import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Remove Button import if not used elsewhere
// import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { InputPhoneComp } from "@/components/ui/input-phone";
import { DateInput } from "@/components/ui/date-input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { Controller, useFormState } from "react-hook-form";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react"; // Added Loader2
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

const fetchFormFields = async (institutionId, selectedRole) => {
  if (!institutionId || !selectedRole) return []; // Should not happen if enabled correctly

  try {
    const response = await axios.get(`/api/institutions/${institutionId}/form-definition?role=${selectedRole}`);
    // Ensure response.data is always an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
     console.error("Failed to fetch form fields:", error);
     // Propagate the error for useQuery's error handling
     throw new Error(error.response?.data?.message || "Could not load registration form.");
  }
};

export function JoinForm({ control, institution, selectedRole, formFieldsQueryKey }) {
  // Fetch fields - query managed here, status used by parent
  const { data: formFields, status, error } = useQuery({
    queryKey: formFieldsQueryKey, // Use the key passed from parent
    queryFn: () => fetchFormFields(institution?.inst_id, selectedRole),
    enabled: !!institution?.inst_id && !!selectedRole, // Enable only when needed
    retry: 1, // Retry once on failure
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
     refetchOnWindowFocus: false, // Optional: prevent refetch on window focus
  });

  // Get errors specific to fields rendered by this form
  const { errors } = useFormState({ control });

  useEffect(() => {
    // Show toast only once when query succeeds and finds no fields
    if (status === 'success' && (!formFields || formFields.length === 0)) {
      toast.info("No additional details required for this role.", {
        description: "You can proceed to the next step.",
        duration: 5000,
      });
    }
    // Show toast on query error
    if (status === 'error') {
         toast.error("Failed to load registration form", {
             description: error?.message || "Please try again later.",
         });
    }
  }, [status, formFields, error]);

  // --- Field Rendering Logic (Mostly Unchanged) ---
  const renderField = (field) => {
    const fieldName = field.name; // Use field.name as the key for react-hook-form
    const fieldError = errors[fieldName];
    const commonProps = {
      id: field.id || fieldName, // Use name as fallback id
      placeholder: field.placeholder || `Enter ${field.name}`, // Use placeholder if provided
      className: "w-full",
    };

    // Add specific validation rules based on field.validation if needed here
    const rules = {
        required: field.required ? `${field.label || field.name} is required` : false,
    };

    switch (field.type) {
      case "tel":
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={rules}
            defaultValue=""
            render={({ field: { onChange, value, ...rest } }) => (
              <InputPhoneComp
                {...rest}
                value={value || ""}
                onChange={onChange}
                className={cn(commonProps.className, "flex-1")}
                defaultCountry="IN" // Example default country
                // Add error styling if needed based on fieldError
              />
            )}
          />
        );

      case "date":
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={rules}
            defaultValue={null}
            render={({ field: { onChange, value, ...rest } }) => (
              <DateInput
                {...rest}
                selected={value ? new Date(value) : null} // Ensure value is a Date object or null
                onSelect={(date) => onChange(date?.toISOString() || null)}
                className={commonProps.className}
                placeholderText={commonProps.placeholder} // Use placeholderText for react-datepicker
              />
            )}
          />
        );

      case "select":
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={rules}
            defaultValue=""
            render={({ field: { onChange, value, ...rest } }) => (
              <Select
                {...rest}
                value={value}
                onValueChange={onChange}
              >
                <SelectTrigger className={cn(commonProps.className, fieldError ? "border-destructive" : "")}>
                  <SelectValue placeholder={commonProps.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );

      case "radio":
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={rules}
            defaultValue=""
            render={({ field: { onChange, value, ...rest } }) => (
              <RadioGroup
                {...rest}
                value={value}
                onValueChange={onChange}
                className="flex flex-col space-y-2 pt-1" // Added padding top
              >
                {field.options?.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${commonProps.id}-${option.value}`} />
                    <Label htmlFor={`${commonProps.id}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        );

      case "checkbox":
        // Checkbox needs different layout (Label usually outside)
        return (
          <Controller
            name={fieldName}
            control={control}
            defaultValue={false}
            rules={rules} // Required rule might behave differently for single checkbox
            render={({ field: { onChange, value, ...rest } }) => (
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  {...rest}
                  id={commonProps.id}
                  checked={value}
                  onCheckedChange={onChange}
                  aria-describedby={fieldError ? `${commonProps.id}-error` : undefined}
                />
                <Label htmlFor={commonProps.id} className="text-sm font-normal cursor-pointer">
                   {field.label || field.name} {/* Use label if provided */}
                   {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
              </div>
            )}
          />
          // Note: Label/description placement might need adjustment for checkbox
        );

      case "textarea":
        return (
          <Controller
            name={fieldName}
            control={control}
            defaultValue=""
            rules={rules}
            render={({ field: formField }) => (
              <Textarea
                {...formField}
                {...commonProps}
                rows={field.rows || 3} // Default rows
                className={cn(commonProps.className, fieldError ? "border-destructive" : "")}
                aria-invalid={fieldError ? "true" : "false"}
                aria-describedby={fieldError ? `${commonProps.id}-error` : undefined}
              />
            )}
          />
        );

      case "file":
         // File inputs need careful handling (value is FileList/File, not string)
         // react-hook-form handles this, but submission logic might need adjustment (FormData)
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={rules}
            defaultValue={null}
            render={({ field: { onChange, value, name, ref } }) => ( // Destructure carefully
              <Input
                id={commonProps.id}
                name={name}
                ref={ref}
                type="file"
                placeholder={commonProps.placeholder} // Placeholder doesn't really work for file
                className={cn(commonProps.className, fieldError ? "border-destructive" : "")}
                accept={field.accept || field.fileTypes?.join(",") || "*"} // Use accept attribute
                onChange={(e) => onChange(e.target.files?.[0] || null)} // Pass the File object or null
                aria-invalid={fieldError ? "true" : "false"}
                aria-describedby={fieldError ? `${commonProps.id}-error` : undefined}
              />
            )}
          />
        );

      default: // Includes text, email, number, password, etc.
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={rules}
            defaultValue=""
            render={({ field: formField }) => (
              <Input
                {...formField}
                {...commonProps}
                type={field.type} // e.g., "text", "email", "number"
                className={cn(commonProps.className, fieldError ? "border-destructive" : "")}
                aria-invalid={fieldError ? "true" : "false"}
                aria-describedby={fieldError ? `${commonProps.id}-error` : undefined}
              />
            )}
          />
        );
    }
  };

  // --- Loading State ---
  if (status === 'pending') {
    return (
      <div className="space-y-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  // --- Error State ---
  if (status === 'error') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Form</AlertTitle>
        <AlertDescription>
          {error?.message || "Could not load the required details. Please try again later or contact support."}
        </AlertDescription>
      </Alert>
    );
  }

  // --- No Fields State ---
  if (status === 'success' && (!formFields || formFields.length === 0)) {
      return (
          <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Additional Information Needed</AlertTitle>
              <AlertDescription>
                  No extra details are required for the selected role. You can proceed by clicking "{ selectedRole === "teacher" ? "Submit Application" : "Proceed" }" below.
              </AlertDescription>
          </Alert>
      );
  }


  // --- Success State (Fields Rendered) ---
  // NO <form> tag here - control is handled by the parent
  return (
    <div className="space-y-5"> {/* Adjusted spacing */}
      {formFields?.map((field) => {
           const fieldName = field.name; // Ensure consistent key usage
           const fieldError = errors[fieldName];
           // Skip rendering if field definition is incomplete
           if (!fieldName || !field.type) {
               console.warn("Skipping rendering of incomplete field definition:", field);
               return null;
           }
           return (
             <div key={field.id || fieldName} className="space-y-1.5"> {/* Reduced spacing */}
               {/* Render Label unless it's a checkbox */}
               {field.type !== "checkbox" && (
                 <Label htmlFor={field.id || fieldName} className="font-medium text-sm"> {/* Slightly smaller label */}
                   {field.label || field.name} {/* Prefer label over name */}
                   {field.required && <span className="text-destructive ml-1">*</span>}
                 </Label>
               )}
               {/* Render the actual input field */}
               {renderField(field)}
               {/* Render description if not a checkbox and description exists */}
               {field.type !== "checkbox" && field.description && (
                 <p className="text-xs text-muted-foreground pt-1">{field.description}</p>
               )}
             </div>
           );
       })}
       {/* NO Submit button here */}
    </div>
  );
}

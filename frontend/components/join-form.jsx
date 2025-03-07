import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {InputPhoneComp} from "@/components/ui/input-phone"
import { DateInput } from "@/components/ui/date-input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import { Controller } from "react-hook-form"
import { cn } from "@/lib/utils"

const fetchFormFields = async (institutionId, selectedRole) => {
  if (!institutionId || !selectedRole) return []

  const response = await axios.get(`/api/institutions/${institutionId}/${selectedRole}/form`)
  return response.data
}

export function JoinForm({ control, institution, selectedRole, onSubmit }) {
  // Fetch form fields using React Query
  const { data: formFields, isSuccess } = useQuery({
    queryKey: ["formFields", institution?.inst_id, selectedRole],
    queryFn: () => fetchFormFields(institution?.inst_id, selectedRole),
    enabled: !!institution?.inst_id && !!selectedRole,
    retry: false,
  });

  const renderField = (field) => {
    const commonProps = {
      id: field.id,
      placeholder: field.description || `Enter ${field.name}`,
      className: "w-full",
    };

    switch (field.type) {
      case "tel":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: { onChange, value, ...rest } }) => (
              <InputPhoneComp
                {...rest}
                value={value || ""}
                onChange={onChange}
                className={cn(commonProps.className, "flex-1")}
                defaultCountry="IN"
              />
            )}
          />
        );

      case "date":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: { onChange, value, ...rest } }) => (
              <DateInput
                {...rest}
                selected={value}
                onSelect={onChange}
                className={commonProps.className}
                placeholder={commonProps.placeholder}
                {...(field.validation?.min && { minDate: new Date(field.validation.min) })}
                {...(field.validation?.max && { maxDate: new Date(field.validation.max) })}
              />
            )}
          />
        );

      case "select":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: { onChange, value, ...rest } }) => (
              <Select
                {...rest}
                value={value || ""}
                onValueChange={onChange}
              >
                <SelectTrigger className={commonProps.className}>
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
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: { onChange, value, ...rest } }) => (
              <RadioGroup
                {...rest}
                value={value || ""}
                onValueChange={onChange}
                className="flex flex-col space-y-1"
              >
                {field.options?.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                    <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        );

      case "checkbox":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: { onChange, value, ...rest } }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...rest}
                  id={field.id}
                  checked={value || false}
                  onCheckedChange={onChange}
                />
                <Label htmlFor={field.id} className="text-sm font-normal">
                  {field.description || field.name}
                </Label>
              </div>
            )}
          />
        );

      case "textarea":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: formField }) => (
              <Textarea
                {...formField}
                {...commonProps}
                rows={field.rows || 4}
              />
            )}
          />
        );

      case "file":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.required }}
            render={({ field: { onChange, value, ...rest } }) => (
              <Input
                {...rest}
                {...commonProps}
                type="file"
                accept={field.fileTypes ? field.fileTypes.join(",") : "*"}
                onChange={(e) => onChange(e.target.files?.[0] || null)}
              />
            )}
          />
        );

      default:
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ 
              required: field.required,
              ...(field.validation?.pattern && { 
                pattern: {
                  value: new RegExp(field.validation.pattern),
                  message: field.validation.message || `Invalid ${field.name} format`
                }
              }),
              ...(field.validation?.min && { min: field.validation.min }),
              ...(field.validation?.max && { max: field.validation.max }),
              ...(field.validation?.minLength && { minLength: field.validation.minLength }),
              ...(field.validation?.maxLength && { maxLength: field.validation.maxLength }),
            }}
            render={({ field: formField }) => (
              <Input
                {...formField}
                {...commonProps}
                type={field.type}
              />
            )}
          />
        );
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {isSuccess && formFields?.map((field) => (
        <div key={field.id || field.name} className="space-y-2">
          {field.type !== "checkbox" && (
            <Label htmlFor={field.id} className="font-medium">
              {field.name}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}
          {renderField(field)}
          {field.type !== "checkbox" && field.description && (
            <p className="text-xs text-muted-foreground">{field.description}</p>
          )}
        </div>
      ))}
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
}
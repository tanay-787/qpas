import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputPhoneComp } from '@/components/ui/input-phone';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DateInput } from '@/components/ui/date-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import NavBar from './shared-components/NavBar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../context/AuthContext';
import { useInstitution } from '../context/InstitutionContext';
import axios from 'axios';
import React from 'react';

// Add validation configuration to initial state
const initialFieldState = {
  name: '',
  type: 'text',
  description: '',
  required: true, // Default required to false
};

const fetchFormDefinition = async (institutionId, selectedRole) => {
  if (!institutionId || !selectedRole) return null;
  console.log(`Fetching form definition for ${institutionId}, role: ${selectedRole}`); // Debug log
  try {
    const response = await axios.get(`/api/institutions/${institutionId}/form-definition?role=${selectedRole}`);
    console.log('Form definition response:', response.data);
    return response.data || []; // Ensure we always return an array
  } catch (error) {
    console.error("Error fetching form definition:", error);
    throw error; // Rethrow for React Query
  }
};

const saveFormDefinition = async ({ institutionId, formData, userToken, selectedRole }) => {
  console.log('Saving form definition:', { institutionId, formData, selectedRole }); // Debug log
  try {
    const response = await axios.post(
      `/api/institutions/${institutionId}/form-definition`,
      { fields: formData, role: selectedRole }
    );
    console.log('Save response:', response.data);
    return response.data;
  } catch (error) {
     console.error("Error saving form definition:", error);
    throw error; // Rethrow for React Query
  }
};

export default function FormBuilder() {
  const { userToken } = useAuth();
  const { institution } = useInstitution();
  const institutionId = institution?.inst_id;
  const [selectedRole, setSelectedRole] = useState('teacher'); // or whatever default role you want
  const [fields, setFields] = useState([]);
  const [currentField, setCurrentField] = useState(initialFieldState);
  const { toast } = useToast();
  const [testMode, setTestMode] = useState(false);
  const [formData, setFormData] = useState({});
  const queryClient = useQueryClient();

  const queryKey = ["formFields", institutionId, selectedRole];

  // Fetch existing form structure
  const { data: existingForm, isLoading: isLoadingForm } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchFormDefinition(institutionId, selectedRole),
    enabled: !!institutionId && !!selectedRole,
    retry: 1, // Retry once
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // --- Effect to update fields state when existingForm data changes ---
  React.useEffect(() => {
    // Only update if the query succeeded and returned an array
    if (existingForm && Array.isArray(existingForm)) {
      console.log('Setting fields state from fetched data:', existingForm);
      setFields(existingForm.map(field => ({
        ...field,
        id: `${field.name}-${Math.random().toString(36).substring(2, 9)}`, // Create a more stable unique ID
      })));
    } else {
      // If query result is not an array (e.g., on initial load, error, or no data), clear fields
      setFields([]);
    }
    // Reset currentField whenever the query data or role changes
    setCurrentField(initialFieldState);
  }, [existingForm, selectedRole]); // Depend on existingForm and selectedRole

  // --- END Effect ---

  const mutation = useMutation({
    mutationFn: saveFormDefinition,
    onSuccess: (data, variables) => {
      toast({
        title: 'Success',
        description: 'Form definition saved successfully',
      });
      // Invalidate the query to refetch the updated form definition
      queryClient.invalidateQueries({ queryKey: ["formFields", variables.institutionId, variables.selectedRole] });
      setCurrentField(initialFieldState);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to save form definition: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    // Remove the temporary id property before saving
    const formDataToSave = fields.map(({ id, ...field }) => ({
      name: field.name,
      type: field.type,
      description: field.description || '', // Ensure description is never undefined
      required: field.required ?? false, // Use nullish coalescing for required
    }));

    if (!institutionId) {
        toast({ title: 'Error', description: 'Institution ID not found. Cannot save.', variant: 'destructive' });
        return;
    }

    mutation.mutate({
      institutionId: institutionId,
      formData: formDataToSave,
      userToken,
      selectedRole,
    });
  };

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'password', label: 'Password' },
    { value: 'number', label: 'Number' },
    { value: 'tel', label: 'Phone' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'date', label: 'Date' },
    { value: 'file', label: 'File Upload' },
  ];

  const addField = () => {
    if (currentField.name.trim()) {
      const newField = {
        ...currentField,
        id: `${currentField.name}-${Math.random().toString(36).substring(2, 9)}`, // Assign ID immediately
      };

      setFields([...fields, newField]);
      setCurrentField(initialFieldState); // Clear the config panel
    }
  };

  const removeField = (idToRemove) => {
    setFields(fields.filter((field) => field.id !== idToRemove));
  };

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const renderFieldPreview = (field) => {
    const commonProps = {
      id: `preview-${field.id}`,
      placeholder: field.description || `Enter ${field.name}`, // Use description as placeholder
      className: "w-full",
      onChange: (e) => handleInputChange(field.id, e.target.value),
      value: formData[field.id] || "",
      disabled: !testMode, // Disable based on testMode
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return <Input type={field.type} {...commonProps} />;
      case 'tel':
        // Note: InputPhoneComp might need specific value/onChange handling
        return <InputPhoneComp {...commonProps} />; 
      case 'textarea':
        return <Textarea {...commonProps} />;
      case 'date':
        // Note: DateInput might need different value/onChange handling
        return (
          <DateInput
            {...commonProps}
            isDisabled={!testMode}
            placeholderText={commonProps.placeholder}
            className="w-full"
          />
        );
      case 'file':
        // File input value/onChange needs special handling, not covered by commonProps
        return (
          <Input
            id={`preview-${field.id}`}
            type="file"
            accept={field.acceptedFileTypes} // Assuming you might add this back later
            disabled={!testMode}
            className="w-full"
            // onChange for file inputs needs to handle e.target.files
            onChange={(e) => handleInputChange(field.id, e.target.files ? e.target.files[0] : null)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {isLoadingForm ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading form structure...</div>
        </div>
      ) : (
        <div className="container mx-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Application Form Builder</h2>
              <p className="text-muted-foreground mt-2">
                Design the registration form for {selectedRole}s
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  setSelectedRole(value);
                  // No need to manually reset fields here, useEffect handles it
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleSave}
                disabled={mutation.isPending || fields.length === 0} // Disable if no fields or saving
                className="w-full sm:w-auto"
              >
                {mutation.isPending ? "Saving..." : "Save Form Structure"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Field Configuration Panel (lg:col-span-1) */}
            <Card className="lg:sticky lg:top-6 lg:col-span-1">
              <CardHeader>
                <CardTitle>Add New Field</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Field Type Select */}
                  <div>
                    <Label htmlFor="fieldType">Field Type</Label>
                    <Select
                      value={currentField.type}
                      onValueChange={(value) =>
                        setCurrentField({ ...currentField, type: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Field Name Input */}
                  <div>
                    <Label htmlFor="fieldName">Field Name / Label</Label>
                    <Input
                      id="fieldName"
                      value={currentField.name}
                      onChange={(e) =>
                        setCurrentField({ ...currentField, name: e.target.value })
                      }
                      placeholder="e.g., Roll Number, Department"
                      className="w-full"
                    />
                  </div>

                  {/* Description Textarea */}
                  <div>
                    <Label htmlFor="fieldDescription">Description / Placeholder</Label>
                    <Textarea
                      id="fieldDescription"
                      value={currentField.description}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          description: e.target.value,
                        })
                      }
                      placeholder="Optional: Helper text or placeholder shown to user"
                      rows={3}
                      className="w-full"
                    />
                  </div>
                    
                  {/* Required Switch */}
                   <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="required"
                        checked={currentField.required}
                        onCheckedChange={(checked) =>
                          setCurrentField({ ...currentField, required: checked })
                        }
                      />
                      <Label htmlFor="required">Required Field</Label>
                    </div>

                  {/* Add Field Button */}
                  <Button onClick={addField} className="w-full" disabled={!currentField.name.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field to Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Form Preview Panel (lg:col-span-2) */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Form Preview ({fields.length} fields)</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="testMode">Test Mode</Label>
                    <Switch
                      id="testMode"
                      checked={testMode}
                      onCheckedChange={setTestMode}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-24rem)] lg:h-[calc(100vh-16rem)] pr-4">
                  {fields.length === 0 ? (
                     <p className="text-center text-muted-foreground py-8">
                        Add fields using the panel on the left to build the form preview.
                      </p>
                  ) : (
                    <form className="space-y-6">
                      {fields.map((field) => (
                        <div key={field.id} className="relative group border p-4 rounded-md">
                          <Label htmlFor={`preview-${field.id}`}>
                            {field.name}
                            {field.required && <span className="text-destructive ml-1">*</span>}
                          </Label>
                          <div className="mt-1">
                             {renderFieldPreview(field)}
                          </div>
                           {field.description && !testMode && (
                              <p className="text-xs text-muted-foreground mt-1">Desc: {field.description}</p>
                           )}
                          {/* Delete button - always visible for simplicity */}
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -right-3 -top-3 h-6 w-6 rounded-full opacity-70 hover:opacity-100" 
                            onClick={() => removeField(field.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </form>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Test Mode Data Display */}
          {testMode && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Test Mode Submitted Data</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded-md overflow-x-auto">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
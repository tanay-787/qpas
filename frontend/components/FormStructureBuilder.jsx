import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  required: false,
  validation: {
    pattern: '',
    errorMessage: '',
    min: '',
    max: '',
    minDate: '',
    maxDate: '',
    maxSize: '',
    phoneFormat: 'INTERNATIONAL', // Default phone format
  },
  acceptedFileTypes: '',
};

const fetchFormDefinition = async (institutionId, selectedRole) => {
  if (!institutionId || !selectedRole) return null;

  try {
    const response = await axios.get(`/api/institutions/${institutionId}/${selectedRole}/form`);
    return response.data || []; // Ensure we always return an array
  } catch (error) {
    throw new Error(error);
  }
};

const saveFormDefinition = async ({ institutionId, formData, userToken, selectedRole }) => {
  try {
    const response = await axios.post(
      `/api/institutions/${institutionId}/form-definition`,
      { fields: formData } // Match backend expectation of req.body.fields
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
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

  // Fetch existing form structure
  const { data: existingForm, isLoading: isLoadingForm, isSuccess } = useQuery({
    queryKey: ["formFields", institutionId, selectedRole],
    queryFn: () => fetchFormDefinition(institutionId, selectedRole),
    enabled: !!institutionId && !!selectedRole,
    retry: false,
  });

  // Handle form data changes
  React.useEffect(() => {
    if (isSuccess && existingForm && Array.isArray(existingForm) && fields.length === 0) {
      setFields(existingForm.map(field => ({
        ...field,
        id: Date.now() + Math.random(), // Ensure unique IDs
      })));
    }
  }, [existingForm, isSuccess]);

  // Reset fields when role changes
  React.useEffect(() => {
    setFields([]); // Clear existing fields
    setCurrentField(initialFieldState); // Reset current field
  }, [selectedRole]);

  const mutation = useMutation({
    mutationFn: ({ institutionId, formData, userToken, selectedRole }) =>
      saveFormDefinition({ institutionId, formData, userToken, selectedRole }),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Form definition saved successfully',
      });
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
    // Remove the id property and ensure all required fields are present
    const formData = fields.map(({ id, ...field }) => ({
      name: field.name,
      type: field.type,
      description: field.description || '', // Ensure description is never undefined
      required: field.required || false, // Ensure required is never undefined
      validation: field.validation || {}, // Ensure validation is never undefined
    }));
    
    mutation.mutate({
      institutionId: institution?.inst_id,
      formData,
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
        id: Date.now(),
        // Clean up empty validation values
        validation: Object.fromEntries(
          Object.entries(currentField.validation)
            .filter(([_, v]) => v !== '')
        )
      };

      // Clean up unnecessary properties based on field type
      if (newField.type !== 'file') delete newField.acceptedFileTypes;
      if (!['number', 'date', 'text', 'email', 'tel'].includes(newField.type)) {
        delete newField.validation.min;
        delete newField.validation.max;
      }
      if (newField.type !== 'date') {
        delete newField.validation.minDate;
        delete newField.validation.maxDate;
      }
      if (newField.type !== 'file') delete newField.validation.maxSize;

      setFields([...fields, newField]);
      setCurrentField(initialFieldState);
    }
  };

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const renderFieldPreview = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <Input
            type={field.type}
            placeholder={`Enter ${field.name}`}
            disabled
          />
        );
      case 'tel':
        return (
          <InputPhoneComp
            // disabled
            placeholder={`Enter ${field.name}`}
            value={field.value}
      onChange={(value) => {
        // Handle phone number change
        console.log(value);
      }}
          />
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={`Enter ${field.name}`}
            disabled
          />
        );
      case 'date':
        return (
          <DateInput
            isDisabled
            placeholder={`Select ${field.name}`}
            min={field.validation.minDate}
            max={field.validation.maxDate}
            className="w-full"
          />
        );
      case 'file':
        return (
          <Input
            type="file"
            accept={field.acceptedFileTypes}
            disabled
          />
        );
      default:
        return null;
    }
  };

  const handleValidationChange = (key, value) => {
    setCurrentField(prev => ({
      ...prev,
      validation: {
        ...prev.validation,
        [key]: value
      }
    }));
  };

  const renderValidationInputs = () => {
    switch (currentField.type) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <>
            <div>
              <Label>Validation Pattern (Regex)</Label>
              <Input
                value={currentField.validation.pattern}
                onChange={(e) => handleValidationChange('pattern', e.target.value)}
                placeholder="Enter regex pattern"
              />
            </div>
            <div>
              <Label>Custom Error Message</Label>
              <Input
                value={currentField.validation.errorMessage}
                onChange={(e) => handleValidationChange('errorMessage', e.target.value)}
                placeholder="Enter custom error message"
              />
            </div>
          </>
        );

      case 'number':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Value</Label>
                <Input
                  type="number"
                  value={currentField.validation.min}
                  onChange={(e) => handleValidationChange('min', e.target.value)}
                />
              </div>
              <div>
                <Label>Maximum Value</Label>
                <Input
                  type="number"
                  value={currentField.validation.max}
                  onChange={(e) => handleValidationChange('max', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      case 'date':
        return (
          <>
            <div className="space-y-2">
              <Label>Minimum Date</Label>
              <DateInput
                value={currentField.validation.minDate ? new Date(currentField.validation.minDate) : undefined}
                onChange={(date) => handleValidationChange('minDate', date ? date.toISOString().split('T')[0] : '')}
                placeholder="Select minimum date(earliest)"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum Date</Label>
              <DateInput
                value={currentField.validation.maxDate ? new Date(currentField.validation.maxDate) : undefined}
                onChange={(date) => handleValidationChange('maxDate', date ? date.toISOString().split('T')[0] : '')}
                placeholder="Select maximum date(latest)"
                className="w-full"
              />
            </div>
          </>
        );

      case 'tel':
        return (
          <div className="space-y-2">
            <Label>Phone Format</Label>
            <Select
              value={currentField.validation.phoneFormat}
              onValueChange={(value) =>
                handleValidationChange('phoneFormat', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INTERNATIONAL">International</SelectItem>
                <SelectItem value="NATIONAL">National</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 'file':
        return (
          <>
            <div>
              <Label>Maximum File Size (MB)</Label>
              <Input
                type="number"
                value={currentField.validation.maxSize}
                onChange={(e) => handleValidationChange('maxSize', e.target.value)}
              />
            </div>
            <div>
              <Label>Accepted File Types</Label>
              <Input
                value={currentField.acceptedFileTypes}
                onChange={(e) => setCurrentField(prev => ({
                  ...prev,
                  acceptedFileTypes: e.target.value
                }))}
                placeholder="e.g., .pdf,.doc,.docx"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {isLoadingForm ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading existing form structure...</div>
        </div>
      ) : (
        <div className="container mx-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Form Builder</h2>
              <p className="text-muted-foreground mt-2">
                Design the registration form for {selectedRole}s
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
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
                disabled={fields.length === 0 || mutation.isLoading}
                className="w-full sm:w-auto"
              >
                {mutation.isLoading ? "Saving..." : "Save Form Structure"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle>Field Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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

                  <div>
                    <Label htmlFor="fieldName">Field Name</Label>
                    <Input
                      id="fieldName"
                      value={currentField.name}
                      onChange={(e) =>
                        setCurrentField({ ...currentField, name: e.target.value })
                      }
                      placeholder="Enter field name"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fieldDescription">Description</Label>
                    <Textarea
                      id="fieldDescription"
                      value={currentField.description}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter field description (will be used as placeholder text)"
                      rows={3}
                      className="w-full"
                    />
                  </div>

                  {currentField.type === 'file' && (
                    <div>
                      <Label htmlFor="acceptedFileTypes">Accepted File Types</Label>
                      <Input
                        id="acceptedFileTypes"
                        value={currentField.acceptedFileTypes}
                        onChange={(e) =>
                          setCurrentField({
                            ...currentField,
                            acceptedFileTypes: e.target.value,
                          })
                        }
                        placeholder="e.g., .pdf,.doc,.docx"
                        className="w-full"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter file extensions separated by commas (e.g., .pdf,.doc,.docx)
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-4">Validation Rules</h3>
                    <div className="space-y-4">
                      {renderValidationInputs()}
                    </div>

                    <div className="flex items-center space-x-2 pt-4">
                      <Switch
                        id="required"
                        checked={currentField.required}
                        onCheckedChange={(checked) =>
                          setCurrentField({ ...currentField, required: checked })
                        }
                      />
                      <Label htmlFor="required">Required Field</Label>
                    </div>
                  </div>

                  <Button onClick={addField} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-24rem)] lg:h-[calc(100vh-16rem)] pr-4">
                  <form className="space-y-4">
                    {fields.map((field) => (
                      <div key={field.id} className="relative group">
                        <Label htmlFor={`preview-${field.id}`}>
                          {field.name}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {renderFieldPreview(field)}
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -right-2 top-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeField(field.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {fields.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Add fields to see the form preview here
                      </p>
                    )}
                  </form>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
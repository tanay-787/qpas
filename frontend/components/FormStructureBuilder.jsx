import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  },
  acceptedFileTypes: '',
};

const saveFormDefinition = async ({ institutionId, formData, userToken }) => {
  try {
    const response = await axios.post(
      `/api/institutions/${institutionId}/form-definition`,
      formData
    );
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export default function FormBuilder() {
  const { userToken } = useAuth();
  const { institution } = useInstitution();
  const [fields, setFields] = useState([]);
  const [currentField, setCurrentField] = useState(initialFieldState);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: ({ institutionId, formData, userToken }) =>
      saveFormDefinition({ institutionId, formData, userToken }),
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

  // ... fieldTypes array remains the same ...
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

  // ... removeField and handleSave remain the same ...

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleSave = () => {
    mutation.mutate({
      institutionId: institution.inst_id,
      formData: { fields },
      userToken,
    });
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
      case 'tel':
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Earliest Date</Label>
                <Input
                  type="date"
                  value={currentField.validation.minDate}
                  onChange={(e) => handleValidationChange('minDate', e.target.value)}
                />
              </div>
              <div>
                <Label>Latest Date</Label>
                <Input
                  type="date"
                  value={currentField.validation.maxDate}
                  onChange={(e) => handleValidationChange('maxDate', e.target.value)}
                />
              </div>
            </div>
          </>
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
      <NavBar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Design Registration Form</h1>
        <p className="text-muted-foreground mb-6">
          Create the structure for the registration form that applicants will fill out when joining your institution.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Form Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* ... existing field config inputs ... */}
                <div>
                  <Label htmlFor="fieldName">Field Name</Label>
                  <Input
                    id="fieldName"
                    value={currentField.name}
                    onChange={(e) =>
                      setCurrentField({ ...currentField, name: e.target.value })
                    }
                    placeholder="Enter field name"
                  />
                </div>

                <div>
                  <Label htmlFor="fieldType">Field Type</Label>
                  <Select
                    value={currentField.type}
                    onValueChange={(value) =>
                      setCurrentField({ ...currentField, type: value })
                    }
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="description">Field Description</Label>
                  <Textarea
                    id="description"
                    value={currentField.description}
                    onChange={(e) =>
                      setCurrentField({
                        ...currentField,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter field description (will be used as placeholder text)"
                    rows={3}
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
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter file extensions separated by commas (e.g., .pdf,.doc,.docx)
                    </p>
                  </div>
                )}
                {/* Add Validation Section */}
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-4">Validation Rules</h3>
                  {renderValidationInputs()}

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
              <ScrollArea className="h-[500px] pr-4">
                <form className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.id} className="relative">
                      <Label htmlFor={`preview-${field.id}`}>
                        {field.name}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      {field.type === 'textarea' ? (
                        <Textarea
                          id={`preview-${field.id}`}
                          placeholder={field.description}
                          disabled
                        />
                      ) : field.type === 'file' ? (
                        <div className="mt-2">
                          <Input
                            id={`preview-${field.id}`}
                            type="file"
                            accept={field.acceptedFileTypes}
                            disabled
                          />
                          {field.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {field.description}
                            </p>
                          )}
                          {field.acceptedFileTypes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Accepted formats: {field.acceptedFileTypes}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Input
                          id={`preview-${field.id}`}
                          type={field.type}
                          placeholder={field.description}
                          disabled
                        />
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-8"
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

        <Button
          className="mt-6"
          size="lg"
          onClick={handleSave}
          disabled={fields.length === 0 || mutation.isLoading}
        >
          {mutation.isLoading ? 'Saving...' : 'Save Form Structure'}
        </Button>
      </div>
    </div>
  );
}
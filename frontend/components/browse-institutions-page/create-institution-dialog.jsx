import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useInstitution } from '../../context/InstitutionContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function CreateInstitutionDialog({ open, onOpenChange }) {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const { createInstitution, uploadLogo, updateInstitution, institution, isLoading } = useInstitution();
  const [previewUrl, setPreviewUrl] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate()

  const logoFile = watch('logoFile');

  useEffect(() => {
    if (logoFile && logoFile[0]) {
      const file = logoFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  }, [logoFile]);

  const onSubmit = async (data) => {
    try {
      // Step 1: Send data to the backend excluding logoFile
      const { logoFile, ...institutionData } = data;
      console.log(institutionData);
      
      const createdInstitution = await createInstitution(institutionData);

      const createdInstitutionId = createdInstitution.id;
      // Step 2: Upload the logo if the institution is created successfully
      if (createdInstitutionId && logoFile && logoFile[0]) {
        const logoUrl = await uploadLogo(logoFile[0]);
        await updateInstitution({ createdInstitutionId, logoUrl });
      }

      reset();
      setPreviewUrl(null);
      onOpenChange(false);
      toast({ title: 'Success', description: `Institution: ${createdInstitution.name} created successfully`, variant: 'default' });
      navigate(`/institutions/${createdInstitutionId}/form-builder`);
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const clearFile = () => {
    reset({ logoFile: null });
    setPreviewUrl(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Institution</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Institution Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Institution name is required' })}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="logoFile">Logo File</Label>
              <Input
                id="logoFile"
                type="file"
                accept="image/*"
                {...register('logoFile')}
              />
            </div>

            {previewUrl && (
              <div className="relative w-32 h-32">
                <img
                  src={previewUrl}
                  alt="Logo preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-0 right-0 rounded-full -mt-2 -mr-2"
                  onClick={clearFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

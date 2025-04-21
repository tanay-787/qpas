import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useInstitution } from '../../context/InstitutionContext';
import { toast as sonner } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function CreateInstitutionDialog({ open, onOpenChange }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    control // Add control from react-hook-form
  } = useForm({
    defaultValues: { name: '', description: '', logoFile: null }
  });

  const {
    createInstitution,
    uploadLogo,
    updateInstitution,
    isCreatingInstitution,
    isUpdatingInstitution
  } = useInstitution();

  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();

  // More robust processing check, includes RHF's submitting state
  const isProcessing = isCreatingInstitution || isUpdatingInstitution || isSubmitting;

  // Ref to track if the component is mounted (helps prevent state updates after unmount)
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; }; // Set to false on unmount
  }, []);


  const logoFile = watch('logoFile');

  // Effect for logo preview (Add mounted check)
  useEffect(() => {
    let fileReader, isSubscribed = true; // Flag to prevent state update if effect cleans up early
    if (logoFile && logoFile[0]) {
      const file = logoFile[0];
      if (!file.type.startsWith('image/')) {
        sonner.error("Invalid File Type", { description: "Please select an image file." });
        clearFile(); return;
      }
      // Optional: Add file size check here

      fileReader = new FileReader();
      fileReader.onloadend = () => {
        // Only update state if the effect is still active and component mounted
        if (isSubscribed && isMounted.current) {
          setPreviewUrl(fileReader.result);
        }
      };
      fileReader.readAsDataURL(file);
    } else {
      if (isMounted.current) {
        setPreviewUrl(null);
      }
    }
    // Cleanup function for the effect
    return () => {
      isSubscribed = false;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort(); // Abort reading if component unmounts/deps change
      }
    }
  }, [logoFile]); // Dependency remains logoFile

  const onSubmit = async (data) => {
    console.log("onSubmit triggered. Raw form data:", data); // Log the data received from RHF

    // **Explicit Check:** Verify name exists right at the start
    if (!data.name || data.name.trim() === '') {
      console.error("Validation Error: Name is empty or missing in data object passed to onSubmit.");
      // This case ideally shouldn't happen if RHF validation works, but acts as a safeguard
      sonner.error("Submission Failed", { description: "Institution name is required." });
      return; // Stop submission
    }

    let createdInstitutionId = null;
    let institutionName = data.name;

    try {
      // Step 1: Create Institution
      const { logoFile: logoFileInput, ...institutionData } = data;
      const createdInstitution = await createInstitution(institutionData);

      // Validate response
      if (!createdInstitution?.inst_id) { // Use optional chaining
        throw new Error("Failed to create institution. Invalid response from server.");
      }
      
      createdInstitutionId = createdInstitution.inst_id;
      institutionName = createdInstitution.name || institutionName;
      console.log(`Institution created with ID: ${createdInstitutionId}`);

      // Step 2: Logo Upload & Update (if applicable)
      if (createdInstitutionId && logoFileInput?.[0]) { // Use optional chaining
        console.log("Uploading logo...");
        try {
          const logoUrl = await uploadLogo(logoFileInput[0]);
          console.log(`Logo uploaded: ${logoUrl}`);
          await updateInstitution({ inst_id: createdInstitutionId, logoUrl });
          console.log("Institution updated with logo.");
        } catch (uploadOrUpdateError) {
          console.error("Error during logo upload/update:", uploadOrUpdateError);
          sonner.error(`Institution "${institutionName}" created, but failed to add logo.`, {
            description: uploadOrUpdateError.message || "Please try updating later.",
          });
          if (isMounted.current) { // Check if component still mounted before navigation/state changes
            resetFormAndCloseDialog(true); // Still reset and close
            navigate(`/institutions/${createdInstitutionId}/settings`); // Redirect to settings
          }
          return; // Stop onSubmit execution
        }
      }
      onOpenChange(false);

      // Step 3: Final Success
      sonner.success(`Institution "${institutionName}" created successfully!`);
      if (isMounted.current) {
        resetFormAndCloseDialog(true); // Reset and close
        navigate(`/institutions/${createdInstitutionId}/form-builder`); // Navigate
      }

    } catch (error) {
      console.error("Error during institution creation process:", error);
      sonner.error("Error during institution creation process", { description: error.message || "Please try again later." })
      onOpenChange(false);
    }
    // No finally block, rely on isSubmitting/isProcessing for loading state
  };

  // Renamed helper for clarity
  const resetFormAndCloseDialog = (shouldClose = true) => {
    if (isMounted.current) { // Check mounted before resetting state
      reset(); // Reset react-hook-form state
      setPreviewUrl(null); // Clear preview state
      if (shouldClose) {
        onOpenChange(false); // Close the dialog via callback
      }
    }
  }

  const clearFile = () => {
    if (isMounted.current) {
      setValue('logoFile', null, { shouldValidate: true, shouldDirty: true }); // Trigger validation/dirty state change
      setPreviewUrl(null);
    }
  };

  // Modified onOpenChange handler
  const handleOpenChange = (isOpen) => {
    // Only reset if manually closing the dialog *and* not currently processing.
    if (!isOpen && !isProcessing && isMounted.current) {
      console.log("Dialog closing via external trigger (X, overlay, Esc) - Resetting form.");
      resetFormAndCloseDialog(false); // Reset form fields, don't trigger onOpenChange again
    }
    // Always call the original handler passed in props
    onOpenChange(isOpen);
  }

  return (
    // Pass the modified handler to the Dialog
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Institution</DialogTitle>
        </DialogHeader>
        {/* onSubmit is now correctly wrapped */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Institution Name Input - Fix ref issue */}
            <div>
              <Label htmlFor="name">Institution Name</Label>
              <Input
                id="name"
                // Change how we register to avoid ref issues
                {...register('name', {
                  required: 'Institution name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' },
                  maxLength: { value: 100, message: 'Name cannot exceed 100 characters' }
                })}
                disabled={isProcessing}
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (<p className="text-sm text-destructive mt-1" role="alert">{errors.name.message}</p>)}
            </div>

            {/* Description Textarea - Fix ref issue */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description', {
                  maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
                })}
                rows={3}
                disabled={isProcessing}
                aria-invalid={errors.description ? "true" : "false"}
              />
              {errors.description && (<p className="text-sm text-destructive mt-1" role="alert">{errors.description.message}</p>)}
            </div>

            {/* Logo File Input - Fix ref issue */}
            <div>
              <Label htmlFor="logoFile">Logo (Optional)</Label>
              <Input
                id="logoFile"
                type="file"
                accept="image/png, image/jpeg, image/gif, image/webp"
                // Use onChange instead of register for file inputs
                onChange={(e) => {
                  setValue('logoFile', e.target.files);
                }}
                disabled={isProcessing}
              />
            </div>

            {/* Logo Preview */}
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
            {/* Cancel Button */}
            <Button type="button" variant="outline" onClick={() => resetFormAndCloseDialog(true)} disabled={isProcessing}>
              Cancel
            </Button>
            {/* Submit Button */}
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : null}
              {isCreatingInstitution ? 'Creating...' : (isUpdatingInstitution ? 'Updating Logo...' : 'Create Institution')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
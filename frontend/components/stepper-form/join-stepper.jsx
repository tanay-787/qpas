import { useState, useEffect } from "react";
import { Stepper, Step, useStepper } from "@/components/ui/stepper"; // Assuming useStepper is exported correctly
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DialogContent, Dialog } from "@/components/ui/dialog";
import { RoleSelection } from "./role-selection";
import { JoinForm } from "./join-form";
import { SuccessStep } from "./success";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

const steps = [
  { id: "role", title: "Select Role", description: "Choose your role" },
  { id: "form", title: "Join Form", description: "Provide your details" },
  { id: "complete", title: "Complete", description: "Application submitted" },
];

export default function JoinStepper({ open, onOpenChange, institution }) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, formState: { isValid }, reset, trigger, getValues } = useForm({
    mode: "onChange", // Validate on change
    defaultValues: { role: "" } // Initialize role
  });
  const selectedRole = useWatch({ control, name: "role" });

  // Fetch form fields status (needed for button disabling)
  const formFieldsQueryKey = ["formFields", institution?.inst_id, selectedRole];
  const formFieldsQuery = queryClient.getQueryState(formFieldsQueryKey);
  const formFieldsData = queryClient.getQueryData(formFieldsQueryKey);
  const isLoadingFormFields = formFieldsQuery?.status === 'pending';
  const hasFormFields = !!formFieldsData && formFieldsData.length > 0;
  // Determine if the form step is truly skippable (no fields fetched and query succeeded)
  const canSkipFormStep = formFieldsQuery?.status === 'success' && !hasFormFields;

  useEffect(() => {
    // When role changes, clear previous form field values and re-validate
    // Get all current form values
    const currentValues = getValues();
    const keysToReset = Object.keys(currentValues).filter(key => key !== 'role');
    const resetValues = keysToReset.reduce((acc, key) => {
      acc[key] = undefined; // Reset dynamic fields to undefined
      return acc;
    }, { role: selectedRole }); // Keep the selected role

    reset(resetValues, { keepDefaultValues: false, keepErrors: false });

    // Optionally trigger validation if needed immediately after reset
    // trigger();

  }, [selectedRole, reset, getValues, trigger]);


  const joinWLMutation = useMutation({
    mutationFn: async (formData) => {
      // Filter out just the dynamic form fields (exclude 'role')
      const formResponses = Object.entries(formData)
        .filter(([key]) => key !== 'role' && formData[key] !== undefined && formData[key] !== null && formData[key] !== '') // Ensure only submitted fields are sent
        .map(([field_id, value]) => ({ field_id, value })); // Assuming field 'name' is used as field_id

      // Handle file uploads if necessary - this example assumes simple values
      // You might need FormData for file uploads

      const transformedData = {
        role_requested: selectedRole,
        // Send empty array if no fields were present or filled
        form_responses: formResponses
      };

      console.log("Submitting Data:", transformedData); // For debugging

      const response = await axios.post(`/api/waiting-lobby/${institution.inst_id}/join`, transformedData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      // Resetting here might clear state before SuccessStep is fully shown
      // Consider resetting when the dialog closes or explicitly needed
      // reset({ role: "" }); // Reset entire form including role
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Submission failed. Please try again.');
    }
  });

  // This is the single onSubmit handler triggered by StepperControls
  const onSubmit = (data) => {
    console.log("Form Data Validated:", data); // For debugging
    // The mutation expects the full form data
    joinWLMutation.mutate(data);
  };

  // Handle Dialog close - reset form state?
  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
       reset({ role: "" }); // Reset form when dialog closes
       // Potentially reset stepper state if the library allows
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl p-0 sm:max-w-2xl"> {/* Adjusted max-width */}
        <Card className="w-full border-0 shadow-none"> {/* Removed border/shadow */}
          <CardContent className="p-6"> {/* Adjusted padding */}
            <Stepper
              initialStep={0}
              orientation="horizontal"
              steps={steps}
              className="mb-6" // Reduced margin
            >
              {/* Use Step component directly with content */}
              {steps.map((step, index) => (
                <Step key={step.id} label={step.title}>
                  <div className="mt-6 min-h-[250px] px-1"> {/* Added padding & min-height */}
                    {index === 0 && (
                      <RoleSelection control={control} />
                    )}
                    {index === 1 && selectedRole && ( // Only render JoinForm if a role is selected
                      <JoinForm
                        key={selectedRole} // Add key to force re-render on role change
                        control={control}
                        institution={institution}
                        selectedRole={selectedRole}
                        formFieldsQueryKey={formFieldsQueryKey} // Pass key for query access
                      />
                    )}
                    {/* Show skeleton/message if role selected but form loading/empty */}
                    {index === 1 && !selectedRole && (
                         <p className="text-center text-muted-foreground">Please select a role first.</p>
                    )}
                    {index === 2 && (
                      <SuccessStep institution={institution} />
                    )}
                  </div>
                </Step>
              ))}

              {/* Pass all necessary props to StepperControls */}
              <StepperControls
                joinWLMutation={joinWLMutation}
                isValid={isValid}
                selectedRole={selectedRole}
                // Pass form field status
                isLoadingFormFields={isLoadingFormFields}
                canSkipFormStep={canSkipFormStep}
                hasFormFields={hasFormFields}
                // Pass the actual submit handler
                onSubmit={handleSubmit(onSubmit)}
              />
            </Stepper>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

// 2. StepperControls.jsx (Handles Buttons & Navigation)
function StepperControls({
  joinWLMutation,
  isValid,
  selectedRole,
  isLoadingFormFields,
  canSkipFormStep,
  hasFormFields,
  onSubmit // This is now handleSubmit(onSubmit) from the parent
}) {
  const { prevStep, nextStep, activeStep, isDisabledStep, isLastStep, isOptionalStep } = useStepper();

  useEffect(() => {
    // Navigate to success step only after mutation is successful
    if (joinWLMutation.isSuccess) {
      // Ensure we are on the form step before automatically moving next
      if (activeStep === 1) {
          nextStep();
      }
    }
  }, [joinWLMutation.isSuccess, nextStep, activeStep]);

  const isFirstStep = activeStep === 0;
  const isFormStep = activeStep === 1;

  // Determine if the "Next" button for the form step should be enabled
  // It's enabled if:
  // 1. Form fields exist AND the form is valid OR
  // 2. Form fields don't exist (and query finished), allowing skip
  const canProceedFromForm = (hasFormFields && isValid) || canSkipFormStep;

  // Define disable conditions more clearly
  const nextButtonDisabled =
    (isFirstStep && !selectedRole) || // No role selected on step 1
    (isFormStep && (isLoadingFormFields || joinWLMutation.isPending || !canProceedFromForm )) || // Loading, submitting, or invalid/no fields on step 2
    isLastStep || // Already on the last step
    joinWLMutation.isPending; // Globally disable if mutation pending

  const handleNextClick = () => {
    if (isFormStep) {
      // Trigger the submission passed from the parent (handleSubmit(onSubmit))
      onSubmit();
    } else {
      // Just move to the next step
      nextStep();
    }
  };

  return (
    <CardFooter className="flex justify-between border-t border-border pt-6 mt-4"> {/* Added top margin */}
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={isFirstStep || joinWLMutation.isPending}
      >
        Back
      </Button>
      <Button
        onClick={handleNextClick}
        disabled={nextButtonDisabled}
      >
        {joinWLMutation.isPending ? (
          <span className="animate-pulse">Submitting...</span>
        ) : isFormStep ? (
           (hasFormFields ? "Submit Application" : "Proceed") // Show "Proceed" if no fields exist
        ) : (
          "Next"
        )}
      </Button>
    </CardFooter>
  );
}
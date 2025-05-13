import { useState, useEffect } from "react";
import { Stepper, Step, useStepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DialogContent, Dialog } from "@/components/ui/dialog";
import { RoleSelection } from "./role-selection";
import { JoinForm } from "./join-form";
import { SuccessStep } from "./success";
import { useForm, useWatch, useFormState } from "react-hook-form";
// --- REMOVE useQueryState, ADD useQuery ---
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const steps = [
  { id: "role", title: "Select Role", description: "Choose your role" },
  { id: "form", title: "Join Form", description: "Provide your details" },
  { id: "complete", title: "Complete", description: "Application submitted" },
];

export default function JoinStepper({ open, onOpenChange, institution }) {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    trigger,
    getValues
  } = useForm({
    mode: "onChange",
    defaultValues: { role: "" }
  });
  const selectedRole = useWatch({ control, name: "role" });

  // Define the query key
  const formFieldsQueryKey = ["formFields", institution?.inst_id, selectedRole];

  // --- Use useQuery to OBSERVE the state of the query managed by JoinForm ---
  const {
    status: formFieldsStatus, // Get the status ('pending', 'success', 'error')
    data: formFieldsData,     // Get the data
    isPending: isLoadingFormFields, // Directly use isPending for loading state
    isSuccess: formFieldsIsSuccess, // Get success status
    // error: formFieldsError, // Optionally get error if needed here
  } = useQuery({
    queryKey: formFieldsQueryKey,
    // No queryFn needed here if JoinForm handles the fetching.
    // TanStack Query reads from the cache based on the key.
    enabled: !!institution?.inst_id && !!selectedRole, // Should match JoinForm's enabled condition
    // You might want to match staleTime etc. if JoinStepper could potentially trigger the first fetch
    // staleTime: 5 * 60 * 1000,
    // refetchOnWindowFocus: false,
  });

  // Derive necessary states from the useQuery result
  const hasFormFields = !!formFieldsData && formFieldsData.length > 0;
  // Determine if the form step is truly skippable (query succeeded with no fields)
  const canSkipFormStep = formFieldsIsSuccess && !hasFormFields;

  useEffect(() => {
    const currentValues = getValues();
    const keysToReset = Object.keys(currentValues).filter(key => key !== 'role');
    const resetValues = keysToReset.reduce((acc, key) => {
      acc[key] = undefined;
      return acc;
    }, { role: selectedRole });

    reset(resetValues, { keepDefaultValues: false, keepErrors: false });
     // You might need to re-trigger validation if necessary, but be careful
     // Consider if validation should only happen on user interaction within the form step
     // if (selectedRole) {
     //   trigger(); // Maybe trigger specific fields if needed
     // }

  }, [selectedRole, reset, getValues, trigger]);


  const joinWLMutation = useMutation({
    mutationFn: async (formData) => {
      const formResponses = Object.entries(formData)
        .filter(([key]) => key !== 'role' && formData[key] !== undefined && formData[key] !== null && formData[key] !== '')
        .map(([field_id, value]) => ({ field_id, value }));

      const transformedData = {
        role_requested: selectedRole,
        form_responses: formResponses
      };

      console.log("Submitting Data:", transformedData);

      const response = await axios.post(`/api/waiting-lobby/${institution.inst_id}/join`, transformedData);
      return response.data;
    },
    onSuccess: (data, variables, context) => { // Added parameters for context if needed
      toast.success("Application submitted successfully!");
       queryClient.invalidateQueries({ queryKey: ['waitingLobbyStatus', institution.inst_id] }); // Example invalidation
       // Do NOT reset form here. Let StepperControls handle navigation based on isSuccess.
       // Resetting clears the form before the SuccessStep is visible.
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Submission failed. Please try again.');
    }
  });

  const onSubmit = (data) => {
    console.log("Form Data Validated:", data);
    joinWLMutation.mutate(data);
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
       reset({ role: "" }); // Reset form when dialog closes
       // Reset mutation state if necessary
       joinWLMutation.reset();
       // Reset stepper state if the library provides a way and it's needed
       // e.g., if you have access to a reset function from useStepper: stepper.reset()
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl p-0 sm:max-w-2xl">
        <Card className="w-full border-0 shadow-none">
          <CardContent className="p-6">
            <Stepper
              initialStep={0}
              orientation="horizontal"
              steps={steps}
              className="mb-6"
            >
              {steps.map((step, index) => (
                <Step key={step.id} label={step.title}>
                  <div className="mt-6 min-h-[250px] px-1">
                    {index === 0 && (
                      <RoleSelection control={control} />
                    )}
                    {index === 1 && selectedRole && (
                      <JoinForm
                        key={selectedRole} // Key helps reset form state implicitly on role change
                        control={control}
                        institution={institution}
                        selectedRole={selectedRole}
                        formFieldsQueryKey={formFieldsQueryKey} // Pass key for query management
                      />
                    )}
                    {index === 1 && !selectedRole && (
                         <p className="text-center text-muted-foreground">Please select a role first.</p>
                    )}
                     {/* SuccessStep should only show mutation success state ideally, controlled by Stepper */}
                    {index === 2 && (
                      <SuccessStep institution={institution} />
                    )}
                  </div>
                </Step>
              ))}

              {/* Pass all necessary props to StepperControls */}
              <StepperControls
              open={open}
              onOpenChange={handleOpenChange}
                control={control}
                joinWLMutation={joinWLMutation}
                selectedRole={selectedRole}
                // Pass form field status derived from useQuery
                isLoadingFormFields={isLoadingFormFields}
                canSkipFormStep={canSkipFormStep}
                hasFormFields={hasFormFields}
                // Pass the actual submit handler wrapped in handleSubmit
                onSubmit={handleSubmit(onSubmit)}
              />
            </Stepper>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

// --- StepperControls.jsx (No changes needed based on this error) ---
// Make sure StepperControls correctly uses the props passed down:
// isLoadingFormFields, canSkipFormStep, hasFormFields
function StepperControls({
  open,
  onOpenChange,
  control,
  joinWLMutation,
  selectedRole,
  isLoadingFormFields, // derived from useQuery in parent
  canSkipFormStep,    // derived from useQuery in parent
  hasFormFields,      // derived from useQuery in parent
  onSubmit // This is handleSubmit(onSubmit) from the parent
}) {
  const { prevStep, nextStep, activeStep, isDisabledStep, isLastStep, isOptionalStep, goToStep } = useStepper();
  const { isValid, errors, isDirty } = useFormState({ control }); // Get RHF state

  // Log relevant state for debugging button logic
  useEffect(() => {
    console.log("StepperControls Update:", {
      activeStep,
      isLastStep,
      isValid,
      isDirty,
      selectedRole: !!selectedRole,
      isLoadingFormFields,
      canSkipFormStep,
      hasFormFields,
      mutationPending: joinWLMutation.isPending,
      mutationSuccess: joinWLMutation.isSuccess,
      // errors // Can be noisy, uncomment if needed
    });
  }, [activeStep, isLastStep, isValid, isDirty, selectedRole, isLoadingFormFields, canSkipFormStep, hasFormFields, joinWLMutation.isPending, joinWLMutation.isSuccess]);

  useEffect(() => {
    // Navigate to success step *after* mutation is successful
    // This should happen *after* the submit button was clicked and mutation finished
    if (joinWLMutation.isSuccess) {
       // Check if we are currently on the form step (index 1)
       // Or maybe the component triggering mutation isn't tied to the step index
       // Ensure this logic fits your stepper's flow.
       if (activeStep === 1 && !isLastStep) { // Only move if on form step and not already last
            nextStep();
       }
       // If the mutation could theoretically succeed from another step, adjust logic.
    }
  }, [joinWLMutation.isSuccess, nextStep, activeStep, isLastStep]);


  const isFirstStep = activeStep === 0;
  const isFormStep = activeStep === 1;

  // Refined Logic for proceeding from form step
  // - If loading fields, wait.
  // - If fields exist, form must be valid.
  // - If fields don't exist (and load succeeded), allow proceeding.
  const canProceedFromForm = !isLoadingFormFields && (canSkipFormStep || (hasFormFields && isValid));

  // Define disable conditions
  const nextButtonDisabled =
    // Disable if mutation is in progress anywhere
    joinWLMutation.isPending ||
    // Disable on first step if no role selected
    (isFirstStep && !selectedRole) ||
    // Disable on form step if loading or cannot proceed
    (isFormStep && (isLoadingFormFields || !canProceedFromForm)) ||
    // Disable on last step (shouldn't happen if navigation works)
    isLastStep;


  const handleNextClick = async () => { // Make async if validation needs await
    if (isFormStep) {
      // IMPORTANT: Directly call the onSubmit passed which includes RHF's handleSubmit
      // This ensures validation runs before mutation.mutate is called inside onSubmit.
      console.log("StepperControls: Calling parent onSubmit (via RHF handleSubmit)");
      await onSubmit(); // RHF's handleSubmit calls our onSubmit if valid
    } else if (!isLastStep) {
       console.log("StepperControls: Calling nextStep()");
      nextStep();
    }
  };

  return (
    <CardFooter className="flex justify-between border-t border-border pt-6 mt-4">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={isFirstStep || joinWLMutation.isPending}
      >
        Back
      </Button>
      {/* Hide Next button on the final step if SuccessStep is shown within the stepper */}
       {!isLastStep && (
           <Button
             onClick={handleNextClick}
             disabled={nextButtonDisabled}
           >
             {joinWLMutation.isPending ? (
               <span className="flex items-center">
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 Submitting...
               </span>
             ) : isFormStep ? (
                (hasFormFields ? "Submit Application" : "Proceed")
             ) : (
               "Next"
             )}
           </Button>
       )}
        {/* Optionally, show a 'Done' or 'Close' button on the last step */}
        {isLastStep && (
             <Button onClick={() => onOpenChange && onOpenChange(false)}> {/* Assuming onOpenChange closes dialog */}
                Done
             </Button>
        )}
    </CardFooter>
  );
}


// --- JoinForm.jsx (No changes needed for this specific error) ---
// Ensure it still uses useQuery correctly to fetch the data.
// ... (keep your existing JoinForm component code) ...
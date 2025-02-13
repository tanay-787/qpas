import { useState, useEffect } from "react";
import { Stepper, Step, useStepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DialogContent, Dialog } from "@/components/ui/dialog";
import { RoleSelection } from "./role-selection";
import { JoinForm } from "./join-form";
import { SuccessStep } from "./success";
import { useForm, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, X, CheckCircle } from "lucide-react";
import { Check } from "lucide-react";

const steps = [
  { title: "Select Role", description: "Choose your role" },
  { title: "Join Form", description: "Provide your details" },
  { title: "Complete", description: "Application submitted" },
];

export default function JoinStepper({ open, onOpenChange, institution }) {
  const [serverError, setServerError] = useState(null);
  const { control, handleSubmit, formState: { isValid }, reset } = useForm({
    mode: "onChange",
    defaultValues: { role: "" }
  });
  const selectedRole = useWatch({ control, name: "role" });

  const joinWLMutation = useMutation({
    mutationFn: async (formData) => {
      const transformedData = {
        role_requested: selectedRole,
        form_responses: Object.entries(formData).filter(([key]) => key !== 'role').map(([field_id, value]) => ({ field_id, value }))
      };

      const response = await axios.post(`/api/waiting-lobby/${institution.inst_id}/join`, transformedData);
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      reset();
    },
    onError: (error) => {
      setServerError(error.response?.data?.message || 'Submission failed. Please try again.');
    }
  });

  const handleOpenChange = (open) => {
    onOpenChange(open);
    if (!open) {
      reset({ role: "" });
      setServerError(null);
    }
  };

  const onSubmit = (data) => {
    joinWLMutation.mutate(data);
  };

  if (!institution) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Join {institution.name}</h2>
              <p className="text-sm text-muted-foreground">{institution.description}</p>
            </div>

            <Stepper
              initialStep={0}
              orientation="horizontal"
              responsive
              size="md"
              variant="circle"
              steps={steps}
              className="mb-8"
            >
              <Step 
                label="Select Role" 
                state={!selectedRole ? "error" : undefined}
                errorIcon={X}
              >
                <RoleSelection control={control} institution={institution} />
              </Step>

              <Step 
                label="Join Form" 
                state={joinWLMutation.isPending ? "loading" : serverError ? "error" : undefined}
                checkIcon={Check}
                errorIcon={X}
              >
                <div className="space-y-4">
                  <JoinForm
                    control={control}
                    institution={institution}
                    selectedRole={selectedRole}
                    onSubmit={handleSubmit(onSubmit)}
                  />
                  {serverError && (
                    <p className="pb-5 text-red-500 text-sm ">Error: {serverError}</p>
                  )}
                </div>
              </Step>

              <Step 
                label="Complete"
                state="completed"
                checkIcon={<CheckCircle className="w-4 h-4" />}
              >
                <SuccessStep institution={institution} />
              </Step>

              <StepperControls 
                joinWLMutation={joinWLMutation}
                isValid={isValid}
                selectedRole={selectedRole}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
              />
            </Stepper>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

function StepperControls({ joinWLMutation, isValid, selectedRole, handleSubmit, onSubmit }) {
  const { prevStep, nextStep, activeStep } = useStepper();

  // Handle successful submission
  useEffect(() => {
    if (joinWLMutation.isSuccess) {
      nextStep();
      joinWLMutation.reset();
    }
  }, [joinWLMutation.isSuccess, nextStep, joinWLMutation]);

  return (
    <CardFooter className="flex justify-between border-t border-border pt-6">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={activeStep === 0 || joinWLMutation.isPending}
      >
        Back
      </Button>
      <Button
        onClick={activeStep === 1 ? handleSubmit(onSubmit) : nextStep}
        disabled={
          (activeStep === 0 && !selectedRole) ||
          (activeStep === 1 && (!isValid || joinWLMutation.isPending)) ||
          activeStep === steps.length - 1
        }
      >
        {joinWLMutation.isPending ? (
          <span className="animate-pulse">Submitting...</span>
        ) : activeStep === steps.length - 2 ? (
          "Submit"
        ) : (
          "Next"
        )}
      </Button>
    </CardFooter>
  );
}
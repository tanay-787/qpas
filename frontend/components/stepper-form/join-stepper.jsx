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
import { toast } from "sonner";

const steps = [
  { title: "Select Role", description: "Choose your role" },
  { title: "Join Form", description: "Provide your details" },
  { title: "Complete", description: "Application submitted" },
];

export default function JoinStepper({ open, onOpenChange, institution }) {
  const { control, handleSubmit, formState: { isValid }, reset } = useForm({
    mode: "onChange",
    defaultValues: { role: "" }
  });
  const selectedRole = useWatch({ control, name: "role" });
  const [hasFormFields, setHasFormFields] = useState(true);

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
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Submission failed. Please try again.');
    }
  });

  const onSubmit = (data) => {
    const formResponses = Object.entries(data).filter(([key]) => key !== 'role');
    if (formResponses.length === 0) {
      setHasFormFields(false);
      toast.error("No form fields available to submit.");
      return;
    }
    joinWLMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <Card className="w-full">
          <CardContent className="pt-6">
            <Stepper
              initialStep={0}
              orientation="horizontal"
              responsive
              size="md"
              variant="circle"
              steps={steps}
              className="mb-8"
            >
              <Step label="Select Role">
                <RoleSelection control={control} institution={institution} />
              </Step>

              <Step label="Join Form">
                <JoinForm
                  control={control}
                  institution={institution}
                  selectedRole={selectedRole}
                  onSubmit={handleSubmit(onSubmit)}
                />
              </Step>

              <Step label="Complete">
                <SuccessStep institution={institution} />
              </Step>

              <StepperControls
                joinWLMutation={joinWLMutation}
                isValid={isValid}
                hasFormFields={hasFormFields}
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

function StepperControls({ joinWLMutation, isValid, selectedRole, hasFormFields, handleSubmit, onSubmit }) {
  const { prevStep, nextStep, activeStep } = useStepper();

  useEffect(() => {
    if (joinWLMutation.isSuccess) {
      nextStep();
    }
  }, [joinWLMutation.isSuccess, nextStep]);

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
          (activeStep === 1 && (!isValid || joinWLMutation.isPending || !hasFormFields)) ||
          activeStep === steps.length - 1
        }
      >
        {joinWLMutation.isPending ? (
          <span className="animate-pulse">Submitting...</span>
        ) : activeStep === steps.length - 2 ? (
          hasFormFields ? "Submit" : "No Form Available"
        ) : (
          "Next"
        )}
      </Button>
    </CardFooter>
  );
}
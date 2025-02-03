import { useState } from "react";
import { Check, User, FileText, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DialogContent, Dialog } from "@/components/ui/dialog";
import { RoleSelection } from "./role-selection";
import { JoinForm } from "./join-form";
import { SuccessStep } from "./success";
import { useForm, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const steps = [
  { title: "Select Role", description: "Choose your role", icon: <User className="w-5 h-5" /> },
  { title: "Join Form", description: "Provide your details", icon: <FileText className="w-5 h-5" /> },
  { title: "Complete", description: "Application submitted", icon: <Smile className="w-5 h-5" /> },
];

export default function JoinStepper({ open, onOpenChange, institution }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formStructure, setFormStructure] = useState([]);
  const [serverError, setServerError] = useState(null);

  const { control, handleSubmit, formState: { isValid }, reset } = useForm({
    mode: "onChange",
  });

  const selectedRole = useWatch({ control, name: "role" });


  /**
   * Mutation to add the user to the Waiting Lobby
   */
  const joinWLMutation = useMutation({
    mutationFn: async (formData) => {
      const transformedData = {
        role_requested: selectedRole,
        form_responses: Object.entries(formData).filter(([key]) => key !== 'role').map(([field_id, value]) => ({ field_id, value }))
      };

      const response = await axios.post(`/api/waiting-lobby/${institution.inst_id}/join`,transformedData);
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      handleNext();
      reset(); // Reset form after successful submission
    },
    onError: (error) => {
      setServerError(error.response?.data?.message || 'Submission failed. Please try again.');
    }
  });

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleOpenChange = (open) => {
    onOpenChange(open);
    if (!open) {
      setCurrentStep(0);
      setFormStructure([]);
      setServerError(null);
      reset();
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

            <div className="flex justify-between mb-8 relative">
              {steps.map((step, index) => (
                <div key={step.title} className="flex flex-col items-center flex-1 relative">
                  <div className="flex items-center">
                    {index > 0 && (
                      <div
                        className={`absolute h-[2px] w-[calc(50%-1.25rem)] left-0 top-1/2 transform -translate-y-1/2 ${
                          index <= currentStep ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all relative z-10 ${
                        index === currentStep
                          ? "border-primary bg-background scale-110"
                          : index < currentStep
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted bg-background"
                      }`}
                    >
                      {index < currentStep ? <Check className="w-5 h-5" /> : step.icon}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute h-[2px] w-[calc(50%-1.25rem)] right-0 top-1/2 transform -translate-y-1/2 ${
                          index < currentStep ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {currentStep === 0 && (
              <RoleSelection control={control} institution={institution} />
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <JoinForm
                  control={control}
                  institution={institution}
                  selectedRole={selectedRole}
                  onSubmit={handleSubmit(onSubmit)}
                  onFormStructureChange={setFormStructure}
                />
                {serverError && (
                  <p className="text-red-500 text-sm text-center">{serverError}</p>
                )}
              </div>
            )}

            {currentStep === 2 && <SuccessStep institution={institution} />}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-border pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || joinWLMutation.isPending}
            >
              Back
            </Button>
            <Button
              onClick={currentStep === 1 ? handleSubmit(onSubmit) : handleNext}
              disabled={
                (currentStep === 0 && !selectedRole) ||
                (currentStep === 1 && (!isValid || joinWLMutation.isPending)) ||
                currentStep === steps.length - 1
              }
            >
              {joinWLMutation.isPending ? (
                <span className="animate-pulse">Submitting...</span>
              ) : currentStep === steps.length - 2 ? (
                "Submit"
              ) : (
                "Next"
              )}
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
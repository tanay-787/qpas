import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { RoleSelection } from "./role-selection"
import { JoinForm } from "./join-form"
import { SuccessStep } from "./success"

const steps = [
  { title: "Select Role", description: "Choose your role" },
  { title: "Join Form", description: "Provide your details" },
  { title: "Complete", description: "Application submitted" },
]

export function JoinStepper() {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    role: "",
    fullName: "",
    mobile: "",
    idCard: null,
  })

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleOpenChange = (open) => {
    setOpen(open)
    if (!open) {
      // Reset form when dialog is closed
      setCurrentStep(0)
      setFormData({
        role: "",
        fullName: "",
        mobile: "",
        idCard: null,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-white text-black hover:bg-white/90">Join Institution</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0">
        <Card className="w-full bg-black text-white border-0">
          <CardContent className="pt-6">
            <div className="flex justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.title} className="flex flex-col items-center flex-1">
                  <div className="flex items-center">
                    {index > 0 && (
                      <div className={`h-px w-full ${index <= currentStep ? "bg-white" : "bg-muted-foreground"}`} />
                    )}
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        index === currentStep
                          ? "border-white bg-transparent"
                          : index < currentStep
                            ? "border-white bg-white text-black"
                            : "border-muted-foreground bg-transparent"
                      }`}
                    >
                      {index < currentStep ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-px w-full ${index < currentStep ? "bg-white" : "bg-muted-foreground"}`} />
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
              <RoleSelection selectedRole={formData.role} onSelect={(role) => updateFormData({ role })} />
            )}
            {currentStep === 1 && <JoinForm formData={formData} onChange={updateFormData} />}
            {currentStep === 2 && <SuccessStep />}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-white/10 mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="border-white text-white hover:bg-white/10"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 0 && !formData.role) ||
                (currentStep === 1 && (!formData.fullName || !formData.mobile || !formData.idCard)) ||
                currentStep === steps.length - 1
              }
              className="bg-white text-black hover:bg-white/90"
            >
              {currentStep === steps.length - 2 ? "Submit" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
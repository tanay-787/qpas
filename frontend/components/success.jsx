import { CheckCircle } from "lucide-react"

export function SuccessStep() {
  return (
    <div className="text-center py-8">
      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
      <h2 className="text-2xl font-semibold mb-2">Successfully Applied!</h2>
      <p className="text-muted-foreground">
        Your application has been submitted to the institution. We will review your details and get back to you soon.
      </p>
    </div>
  )
}
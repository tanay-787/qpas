import { CheckCircle } from "lucide-react";

export function SuccessStep({ institution }) { // Keep institution prop if needed later
  return (
    <div className="text-center py-8 flex flex-col items-center justify-center min-h-[250px]"> {/* Added flex centering */}
      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
      <h2 className="text-xl sm:text-2xl font-semibold mb-2">Successfully Applied!</h2>
      <p className="text-muted-foreground max-w-md"> {/* Added max-width */}
        Your application has been submitted {institution?.name ? `to ${institution.name}` : 'to the institution'}. We will review your details and get back to you soon.
      </p>
      {/* Maybe add a button to close the dialog here? */}
      {/* <Button onClick={() => onOpenChange(false)} className="mt-6">Close</Button> */}
    </div>
  );
}
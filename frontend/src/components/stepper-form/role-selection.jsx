import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, UserCog } from "lucide-react";
import { Controller, useFormState } from "react-hook-form";
import { Label } from "@/components/ui/label"; // If needed for error message
import { cn } from "@/lib/utils";

export function RoleSelection({ control }) {
  // Get field state for error display
   const { errors } = useFormState({ control, name: "role" });
   const roleError = errors.role;

  return (
    <div className="space-y-4"> {/* Wrap in a div for potential error message placement */}
      <Label className={cn("mb-2 block text-sm font-medium", roleError ? "text-destructive" : "")}>
        Select Your Role *
      </Label>
      <Controller
        name="role"
        control={control}
        rules={{ required: "Please select a role" }}
        render={({ field }) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Responsive columns */}
            {/* Teacher Card */}
            <Card
              role="radio" // Accessibility
              aria-checked={field.value === "teacher"}
              tabIndex={0} // Make focusable
              className={cn(
                "cursor-pointer border-2 hover:border-primary/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                field.value === "teacher" ? "border-primary bg-primary/5" : "border-muted"
              )}
              onClick={() => field.onChange("teacher")}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') field.onChange("teacher"); }}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 aspect-square sm:aspect-auto"> {/* Consistent height */}
                <UserCog className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-primary" /> {/* Adjusted size/color */}
                <h3 className="text-base sm:text-lg font-semibold text-center">Join as Teacher</h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-center mt-2">
                  Create & manage courses
                </p>
              </CardContent>
            </Card>

            {/* Student Card */}
            <Card
              role="radio"
              aria-checked={field.value === "student"}
              tabIndex={0}
              className={cn(
                "cursor-pointer border-2 hover:border-primary/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                field.value === "student" ? "border-primary bg-primary/5" : "border-muted"
              )}
              onClick={() => field.onChange("student")}
               onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') field.onChange("student"); }}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 aspect-square sm:aspect-auto">
                <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-primary" />
                <h3 className="text-base sm:text-lg font-semibold text-center">Join as Student</h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-center mt-2">
                  Enroll in courses & learn
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      />
      {/* Display error below the cards */}
      {roleError && (
        <p className="text-sm text-destructive mt-2 text-center sm:text-left" role="alert">
          {roleError.message}
        </p>
      )}
    </div>
  );
}
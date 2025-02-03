import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, UserCog } from "lucide-react"
import { Controller } from "react-hook-form"

export function RoleSelection({ control, institution }) { // Removed onNext from props
  return (
    <div className="grid grid-cols-2 gap-4">
      <Controller
        name="role"
        control={control}
        defaultValue=""
        rules={{ required: "Please select a role" }}
        render={({ field }) => (
          <Card
            className={`cursor-pointer border-2 hover:border-primary/50 transition-colors ${
              field.value === "teacher" ? "border-primary" : "border-muted"
            }`}
            onClick={() => field.onChange("teacher")} // Only update value
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <UserCog className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-semibold">Join as Teacher</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Create and manage courses, interact with students
              </p>
            </CardContent>
          </Card>
        )}
      />

      <Controller
        name="role"
        control={control}
        defaultValue=""
        rules={{ required: "Please select a role" }}
        render={({ field }) => (
          <Card
            className={`cursor-pointer border-2 hover:border-primary/50 transition-colors ${
              field.value === "student" ? "border-primary" : "border-muted"
            }`}
            onClick={() => field.onChange("student")} // Only update value
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <GraduationCap className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-semibold">Join as Student</h3>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Enroll in courses and start learning
              </p>
            </CardContent>
          </Card>
        )}
      />
    </div>
  )
}
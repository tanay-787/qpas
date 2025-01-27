import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, UserCog } from "lucide-react"

export function RoleSelection({ selectedRole, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card
        className={`cursor-pointer border-2 hover:border-white/50 transition-colors ${
          selectedRole === "teacher" ? "border-white" : "border-white/10"
        }`}
        onClick={() => onSelect("teacher")}
      >
        <CardContent className="flex flex-col items-center justify-center p-6">
          <UserCog className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-semibold">Join as Teacher</h3>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Create and manage courses, interact with students
          </p>
        </CardContent>
      </Card>

      <Card
        className={`cursor-pointer border-2 hover:border-white/50 transition-colors ${
          selectedRole === "student" ? "border-white" : "border-white/10"
        }`}
        onClick={() => onSelect("student")}
      >
        <CardContent className="flex flex-col items-center justify-center p-6">
          <GraduationCap className="w-12 h-12 mb-4" />
          <h3 className="text-lg font-semibold">Join as Student</h3>
          <p className="text-sm text-muted-foreground text-center mt-2">Enroll in courses and start learning</p>
        </CardContent>
      </Card>
    </div>
  )
}
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/copy-button"

export default function TryDemoDialog({ triggerClassName }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className={triggerClassName || "px-8 font-medium"}>
          Try Demo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demo Credentials</DialogTitle>
          <DialogDescription>
            Use these credentials to try the app as different roles:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
  {[
    {
      role: "Student",
      email: "student2@royal.com",
      password: "student@2",
    },
    {
      role: "Teacher",
      email: "pradnya@royal.com",
      password: "pradnya@royal",
    },
    {
      role: "Admin",
      email: "admin@royal.com",
      password: "admin@royal",
    },
  ].map(({ role, email, password }) => (
    <div key={role} className="border rounded p-3">
      <div className="font-semibold mb-2">Access {role} Dashboard:</div>
      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground w-20">Email:</span>
          <span className="font-mono text-sm flex-1 break-all">{email}</span>
          <CopyButton value={email} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground w-20">Password:</span>
          <span className="font-mono text-sm flex-1 break-all">{password}</span>
          <CopyButton value={password} />
        </div>
      </div>
    </div>
  ))}
</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

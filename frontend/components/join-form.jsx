import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function JoinForm({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          className="bg-transparent border-white/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input
          id="mobile"
          type="tel"
          value={formData.mobile}
          onChange={(e) => onChange({ mobile: e.target.value })}
          className="bg-transparent border-white/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="idCard">ID Card</Label>
        <Input
          id="idCard"
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => onChange({ idCard: e.target.files?.[0] || null })}
          className="bg-transparent border-white/20"
        />
        <p className="text-xs text-muted-foreground">Upload a valid ID card or student card</p>
      </div>
    </div>
  )
}
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InstitutionProfileTab({ institution, onUpdate }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Institution Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <Label>Institution Name</Label>
                        <Input
                            value={institution?.name}
                            onChange={(e) => onUpdate({ name: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            value={institution?.description}
                            onChange={(e) => onUpdate({ description: e.target.value })}
                            rows={4}
                        />
                    </div>
                    <div>
                        <Label>Contact Email</Label>
                        <Input
                            type="email"
                            value={institution?.createdBy.email}
                            onChange={(e) => onUpdate({ contact_email: e.target.value })}
                        />
                    </div>
                    <Button className="mt-4">Save Changes</Button>
                </div>
            </CardContent>
        </Card>
    );
}
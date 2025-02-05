import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormBuilder from "../FormStructureBuilder";

export default function ApplicationFormTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Form Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <FormBuilder showPreview={true} />
      </CardContent>
    </Card>
  );
}
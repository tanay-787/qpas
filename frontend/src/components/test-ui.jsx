import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function TestUI() {

  const triggerToast = () => {
    toast.success('This is a toast message!');
  };
  
  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Color Test Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Color Testing</h2>
        
        {/* Primary Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Primary Colors</h3>
          <div className="flex gap-4">
            <Button variant="default" onClick={triggerToast}>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="outline" size="icon"><Info className="text-primary"/></Button>
          </div>
        </div>

        {/* Background and Text Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Testing card background and text colors</CardDescription>
            </CardHeader>
            <CardContent>
              <Input />
              <p className="text-primary">Primary Text</p>
              <p className="text-secondary">Secondary Text</p>
              <p className="text-muted-foreground">Muted Text</p>
              <p className="text-accent-foreground">Accent Text</p>
            </CardContent>
            <CardFooter>
              <p className="text-destructive">Destructive Text</p>
            </CardFooter>
          </Card>

          {/* Interactive Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Toggle Switch</Label>
              </div>
              <Progress value={60} className="w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Background Colors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-background rounded-lg border">Background</div>
          <div className="p-4 bg-primary text-primary-foreground rounded-lg">Primary</div>
          <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">Secondary</div>
          <div className="p-4 bg-accent text-accent-foreground rounded-lg">Accent</div>
        </div>

        {/* Chart Colors */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-chart-1 text-white rounded-lg">Chart 1</div>
          <div className="p-4 bg-chart-2 text-white rounded-lg">Chart 2</div>
          <div className="p-4 bg-chart-3 text-white rounded-lg">Chart 3</div>
          <div className="p-4 bg-chart-4 text-white rounded-lg">Chart 4</div>
          <div className="p-4 bg-chart-5 text-white rounded-lg">Chart 5</div>
        </div>
      </section>
    </div>
  );
}
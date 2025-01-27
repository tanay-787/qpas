"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useInstitution } from "../context/InstitutionContext";

const fetchFormDefinition = async (institutionId) => {
    const response = await axios.get(`/api/${institutionId}/form`);
    return response.data;
};

export default function WLJoinForm() {
    const [formData, setFormData] = useState({});
    const { toast } = useToast();
    const { institution } = useInstitution();
    const institutionId = institution?.inst_id;
    const { data: formDefinition, isLoading, error} = useQuery({
        queryKey: ["formDefinition", institutionId],
        queryFn: () => fetchFormDefinition(institutionId),
    });

    const handleInputChange = (fieldId, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldId]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Here you would typically send the formData to your backend
        console.log("Form submitted:", formData);
        toast({
            title: "Form Submitted",
            description: "Your application has been received.",
        });
    };

    if (isLoading) return <div>Loading form...</div>;
    if (error) return <div>Error loading form: {error.message}</div>;

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Join Institution</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {formDefinition?.map((field) => (
                            <div key={field.id}>
                                <Label htmlFor={`field-${field.id}`}>
                                    {field.name}
                                    {field.required && <span className="text-destructive ml-1">*</span>}
                                </Label>
                                {field.type === "textarea" ? (
                                    <Textarea
                                        id={`field-${field.id}`}
                                        placeholder={field.description}
                                        required={field.required}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    />
                                ) : field.type === "file" ? (
                                    <div className="mt-2">
                                        <Input
                                            id={`field-${field.id}`}
                                            type="file"
                                            accept={field.acceptedFileTypes}
                                            required={field.required}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleInputChange(field.id, file);
                                            }}
                                        />
                                        {field.description && <p className="text-sm text-muted-foreground mt-1">{field.description}</p>}
                                    </div>
                                ) : (
                                    <Input
                                        id={`field-${field.id}`}
                                        type={field.type}
                                        placeholder={field.description}
                                        required={field.required}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                        <Button type="submit" className="w-full">
                            Submit Application
                        </Button>
                    </form>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}


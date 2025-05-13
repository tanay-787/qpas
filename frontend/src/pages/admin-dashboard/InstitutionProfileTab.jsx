//hooks & utils
import { useState, useEffect } from "react";
import { useInstitution } from "@/context/InstitutionContext";

//icons
import { Save, Loader2 } from "lucide-react";

//ui-components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AvatarEditor } from "@/components/avatar-editor";

export default function InstitutionProfileTab({ institution, onUpdate, isUpdating }) {
    const [isUploading, setIsUploading] = useState(false);
    const { uploadLogo } = useInstitution();

    // Local state to track form changes
    const [formData, setFormData] = useState({
        name: institution?.name || '',
        description: institution?.description || '',
        contact_email: institution?.createdBy?.email || '',
        logoUrl: institution?.logoUrl || null
    });

    // Update local state when institution data changes
    useEffect(() => {
        if (institution) {
            setFormData({
                name: institution.name || '',
                description: institution.description || '',
                contact_email: institution.createdBy?.email || '',
                logoUrl: institution.logoUrl || null
            });
        }
    }, [institution]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle logo file selection and upload
    const handleLogoChange = async (file) => {
        if (file) {
            try {
                setIsUploading(true);
                // Upload the logo using the context function
                const logoUrl = await uploadLogo(file);

                // Update local form data
                setFormData(prev => ({
                    ...prev,
                    logoUrl
                }));

                toast.success("Logo uploaded successfully");
                return logoUrl;
            } catch (error) {
                console.error("Error uploading logo:", error);
                toast.error("Failed to upload logo");
                throw error;
            } finally {
                setIsUploading(false);
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onUpdate(formData);
            toast.success("Institution profile updated successfully");
        } catch (error) {
            console.error("Error updating institution:", error);
            toast.error("Failed to update institution profile");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Institution Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Logo upload section with avatar editor */}
                    <div className="flex flex-col items-center space-y-4">
                        <AvatarEditor
                            initialImage={formData.logoUrl}
                            onImageChange={handleLogoChange}
                            size="lg"
                            fallbackText={formData.name?.charAt(0) || "I"}
                            isLoading={isUploading}
                            label="Institution Logo"
                        />
                        <p className="text-xs text-muted-foreground max-w-xs text-center">
                            Recommended: Square image, at least 200x200px. Click the upload button to change.
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="name">Institution Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                        />
                    </div>
                    <div>
                        <Label htmlFor="contact_email">Contact Email</Label>
                        <Input
                            id="contact_email"
                            name="contact_email"
                            type="email"
                            value={formData.contact_email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="mt-4"
                        disabled={isUpdating || isUploading}
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
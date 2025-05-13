//hooks & utils
import { useState, useRef, useEffect } from "react";

//icons
import {
    Upload,
    RotateCw,
    Check,
    X,
} from "lucide-react";

//ui-components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export function AvatarEditor({
    initialImage,
    onImageChange,
    size = "lg",
    fallbackText = "A",
    isLoading = false,
    label = "Upload Image"
}) {
    const [open, setOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(initialImage);
    const [selectedFile, setSelectedFile] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const fileInputRef = useRef(null);
    const imageRef = useRef(null);
    const cropAreaRef = useRef(null);

    const sizeClasses = {
        sm: "h-10 w-10",
        md: "h-16 w-16",
        lg: "h-24 w-24",
        xl: "h-32 w-32"
    };

    useEffect(() => {
        setPreviewUrl(initialImage);
    }, [initialImage]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setSelectedFile(file);
            setOpen(true);
            setZoom(1);
            setRotation(0);
            setPosition({ x: 0, y: 0 });
        }
    };

    const cropImageToCircle = async () => {
        if (!selectedFile || !imageRef.current || !cropAreaRef.current) return null;

        const cropSize = 256;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = cropSize;
        canvas.height = cropSize;

        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, cropSize, cropSize);

        ctx.beginPath();
        ctx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const img = new Image();
        await new Promise((resolve) => {
            img.onload = resolve;
            img.src = previewUrl;
        });

        const imgWidth = img.width;
        const imgHeight = img.height;

        const scale = Math.max(cropSize / imgWidth, cropSize / imgHeight) * zoom;
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        const offsetX = (cropSize - scaledWidth) / 2 + position.x;
        const offsetY = (cropSize - scaledHeight) / 2 + position.y;

        ctx.save();
        if (rotation !== 0) {
            ctx.translate(cropSize / 2, cropSize / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-cropSize / 2, -cropSize / 2);
        }

        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
        ctx.restore();

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const croppedFile = new File([blob], selectedFile.name, {
                    type: 'image/png',
                    lastModified: new Date().getTime()
                });
                resolve(croppedFile);
            }, 'image/png');
        });
    };

    const handleSave = async () => {
        if (selectedFile) {
            try {
                const croppedFile = await cropImageToCircle();
                if (croppedFile) {
                    await onImageChange(croppedFile);
                    setOpen(false);
                }
            } catch (error) {
                console.error("Error saving image:", error);
            }
        }
    };

    const handleCancel = () => {
        setOpen(false);
        setPreviewUrl(initialImage ?? null);
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        setPosition({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
    };

    const handleTouchEnd = () => setIsDragging(false);

    useEffect(() => {
        if (open) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("touchmove", handleTouchMove, { passive: false });
            document.addEventListener("touchend", handleTouchEnd);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                document.removeEventListener("touchmove", handleTouchMove);
                document.removeEventListener("touchend", handleTouchEnd);
            };
        }
    }, [open, isDragging, dragStart]);

    return (
        <div className="flex flex-col items-center space-y-2">
            <div className="relative group">
                <Avatar className={`${sizeClasses[size]} border-2 border-border`}>
                    {previewUrl ? (
                        <AvatarImage src={previewUrl} alt="Avatar" />
                    ) : (
                        <AvatarFallback className="text-xl font-semibold">
                            {fallbackText.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    )}
                </Avatar>

                <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md opacity-90 hover:opacity-100"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                >
                    <Upload className="h-4 w-4" />
                </Button>
            </div>

            {label && <Label className="text-xs text-muted-foreground">{label}</Label>}

            <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading}
            />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Image</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center space-y-4 py-4">
                        <div className="relative w-64 h-64 rounded-full overflow-hidden bg-black/10 border border-muted shadow-inner">
                            <div
                                ref={cropAreaRef}
                                className="absolute inset-0 z-10"
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleTouchStart}
                                style={{
                                    cursor: isDragging ? "grabbing" : "grab",
                                    touchAction: "none"
                                }}
                            >
                                {previewUrl && (
                                    <img
                                        ref={imageRef}
                                        src={previewUrl}
                                        alt="Preview"
                                        className="absolute w-auto h-auto max-w-none transition-transform duration-100"
                                        style={{
                                            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                                            transformOrigin: "center",
                                            pointerEvents: "none",
                                            left: "50%",
                                            top: "50%",
                                            translate: "-50% -50%"
                                        }}
                                        draggable={false}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="w-full flex flex-col space-y-2">
                            <Label>Zoom</Label>
                            <Slider
                                min={0.5}
                                max={2}
                                step={0.01}
                                value={[zoom]}
                                onValueChange={(val) => setZoom(val[0])}
                            />
                        </div>

                        <Button variant="ghost" onClick={handleRotate}>
                            <RotateCw className="h-4 w-4 mr-2" /> Rotate
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancel}>
                            <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                            <Check className="h-4 w-4 mr-1" /> Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

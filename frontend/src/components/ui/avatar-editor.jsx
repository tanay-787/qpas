import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Upload,
    ZoomIn,
    RotateCw,
    Check,
    X,
    Image as ImageIcon
} from "lucide-react";
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
            // Reset editing controls
            setZoom(1);
            setRotation(0);
            setPosition({ x: 0, y: 0 });
        }
    };

    // New function to crop the image to a circle
    const cropImageToCircle = async () => {
        if (!selectedFile || !imageRef.current) return null;

        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions (we'll use 500x500 for good quality)
        const size = 500;
        canvas.width = size;
        canvas.height = size;

        // Fill with transparent background
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, size, size);

        // Draw a circular clipping path
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        // Create a new image to draw from our source
        const img = new Image();

        // Wait for the image to load
        await new Promise((resolve) => {
            img.onload = resolve;
            img.src = previewUrl;
        });

        // Calculate dimensions to match what's shown in the preview
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Use the same scaling logic as in the preview
        const scale = Math.max(size / imgWidth, size / imgHeight) * zoom;
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        // Save context state before transformations
        ctx.save();

        // Apply rotation around center if needed
        if (rotation !== 0) {
            ctx.translate(size / 2, size / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-size / 2, -size / 2);
        }

        // Draw the image with position adjustments that match the preview
        // Center the image and apply the same position offsets
        ctx.drawImage(
            img,
            (size - scaledWidth) / 2 + position.x * 1.5, // Adjusted scaling factor
            (size - scaledHeight) / 2 + position.y * 1.5, // Adjusted scaling factor
            scaledWidth,
            scaledHeight
        );

        // Restore context state
        ctx.restore();

        // Convert to blob
        return new Promise((resolve) => {
            canvas.toBlob(blob => {
                // Create a File object from the blob
                const croppedFile = new File([blob], selectedFile.name, {
                    type: 'image/png',
                    lastModified: new Date().getTime()
                });
                resolve(croppedFile);
            }, 'image/png');
        });
    };

    // Update the handleSave function to use the cropped image
    const handleSave = async () => {
        if (selectedFile) {
            try {
                // Crop the image to a circle
                const croppedFile = await cropImageToCircle();
                if (croppedFile) {
                    // Pass the cropped file to the parent component
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
        if (!initialImage) {
            setPreviewUrl(null);
        } else {
            setPreviewUrl(initialImage);
        }
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleMouseDown = (e) => {
        if (imageRef.current) {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && imageRef.current) {
            e.preventDefault();
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;
            setPosition({ x: newX, y: newY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Add touch event handlers for mobile support
    const handleTouchStart = (e) => {
        if (imageRef.current) {
            e.preventDefault();
            const touch = e.touches[0];
            setIsDragging(true);
            setDragStart({
                x: touch.clientX - position.x,
                y: touch.clientY - position.y
            });
        }
    };

    const handleTouchMove = (e) => {
        if (isDragging && imageRef.current) {
            const touch = e.touches[0];
            const newX = touch.clientX - dragStart.x;
            const newY = touch.clientY - dragStart.y;
            setPosition({ x: newX, y: newY });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (open) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
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
                        {/* Circular crop area with mask */}
                        <div className="relative w-64 h-64 rounded-md overflow-hidden bg-black/20">
                            {/* Main image container - make this fill the entire area */}
                            <div
                                ref={cropAreaRef}
                                className="absolute inset-0 overflow-hidden z-10"
                                onMouseDown={handleMouseDown}
                                onTouchStart={handleTouchStart}
                                style={{
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                    touchAction: 'none' // Prevents browser handling of touch events
                                }}
                            >
                                {previewUrl ? (
                                    <img
                                        ref={imageRef}
                                        src={previewUrl}
                                        alt="Preview"
                                        className="absolute object-cover w-auto h-auto max-w-none"
                                        style={{
                                            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                                            transformOrigin: 'center',
                                            pointerEvents: 'none', // Ensures the image doesn't capture events
                                            left: '50%',
                                            top: '50%',
                                            marginLeft: '-50%',
                                            marginTop: '-50%'
                                        }}
                                        draggable="false"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-white">
                                        <ImageIcon className="h-10 w-10 mb-2" />
                                        <span>No image selected</span>
                                    </div>
                                )}
                            </div>

                            {/* Overlay with circular cutout - place this on top */}
                            <div className="absolute inset-0 bg-black/70 z-20 pointer-events-none">
                                {/* This creates the transparent circular hole */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-transparent box-content border-4 border-white/80"
                                    style={{
                                        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.7)",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center">
                                    <ZoomIn className="h-4 w-4 mr-2" />
                                    Zoom
                                </Label>
                                <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
                            </div>
                            <Slider
                                value={[zoom * 100]}
                                min={100}
                                max={300}
                                step={5}
                                onValueChange={(value) => setZoom(value[0] / 100)}
                            />

                            <p className="text-xs text-muted-foreground mt-2">
                                Drag the image to position it within the circle. Zoom to adjust size.
                            </p>

                            <div className="flex justify-between pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRotate}
                                >
                                    <RotateCw className="h-4 w-4 mr-2" />
                                    Rotate
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Choose Another
                                </Button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancel}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            <Check className="h-4 w-4 mr-2" />
                            Apply
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
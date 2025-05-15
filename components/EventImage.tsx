"use client"

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Edit, Upload } from "lucide-react";

export interface EventImageProps {
  photoUrl?: string;
  onChange: (url: string) => void;
}

export default function EventImage({ photoUrl, onChange }: EventImageProps){
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                onChange(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return(
        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                <div
                    className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden bg-gray-50 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {photoUrl ? (
                        <>
                            <Image src={photoUrl || "/placeholder.svg"} alt="Event cover" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Button variant="secondary" size="sm" className="z-10">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Change Image
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Upload event image</p>
                        <p className="text-xs text-gray-400 mt-1">Click or drag and drop</p>
                        </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                <div className="mt-4">
                    <Label htmlFor="photo-url" className="text-sm font-medium">
                        Or enter image URL
                    </Label>
                    <Input
                        id="photo-url"
                        placeholder="https://example.com/image.jpg"
                        className="mt-1"
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>
            </div>
    )
}
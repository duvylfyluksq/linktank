"use client"
import type React from "react"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfilePictureUpdateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfilePictureUpdateModal({
  open,
  onOpenChange
}: ProfilePictureUpdateProps) {

    const [loading, setLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [error, setError] = useState("")
    const { toast } = useToast()
    const { user } = useUser()
  
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
  
      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file")
        return
      }
  
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }
  
      setImageFile(file)
      setError("")
  
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  
    const updateProfilePicture = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!imageFile) return
  
      setLoading(true)
      setError("")
  
      try {
        await user?.setProfileImage({ file: imageFile })
  
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been successfully updated.",
        })
  
        // Reset form and close modal
        setImageFile(null)
        setPreviewUrl(null)
        onOpenChange(false)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to update profile picture")
      } finally {
        setLoading(false)
      }
    }
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
            <DialogDescription>Choose a new profile picture to represent you.</DialogDescription>
          </DialogHeader>
          <form onSubmit={updateProfilePicture} className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewUrl || user?.imageUrl} alt="Profile picture" />
                <AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
  
              <div
                onClick={() => document.getElementById("profile-picture")?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    handleImageChange({ target: { files: [file] } } as any);
                  }
                }}
                className="w-full border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-gray-500 transition-colors"
              >
                <Label htmlFor="profile-picture" className="block mb-2 font-medium cursor-pointer">
                  Drag & drop or click to upload
                </Label>
                <Input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-sm text-muted-foreground">Supported formats: JPG, PNG, GIF (max 5MB)</p>
              </div>

            </div>
  
            {error && <p className="text-sm text-red-500">{error}</p>}
  
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 flex justify-center items-center hover:bg-[#0e3b69]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update Picture"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
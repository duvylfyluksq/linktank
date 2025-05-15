"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import { X, Upload, Globe, Twitter, Linkedin, Facebook, Instagram, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useMobile } from "@/hooks/use-mobile"

type SocialLink = {
  type: "website" | "twitter" | "linkedin" | "facebook" | "instagram" | "other"
  url: string
}

type SpeakerFormProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (speaker: any) => void
}

export function NewSpeakerForm({ isOpen, onClose, onSave }: SpeakerFormProps) {
  const isMobile = useMobile()
  const [name, setName] = useState("")
  const [title, setTitle] = useState("")
  const [speakerImage, setSpeakerImage] = useState<string | null>(null)
  const [links, setLinks] = useState<SocialLink[]>([{ type: "website", url: "" }])

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSpeakerImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addLink = (type: SocialLink["type"]) => {
    setLinks([...links, { type, url: "" }])
  }

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...links]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setLinks(newLinks)
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!name.trim()) return

    const newSpeaker = {
      id: Date.now(), // Temporary ID for demo purposes
      name,
      title: title,
      image: speakerImage || "/placeholder.svg?height=40&width=40",
      links: links.filter((link) => link.url.trim() !== ""),
    }

    onSave(newSpeaker)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setTitle("")
    setSpeakerImage(null)
    setLinks([{ type: "website", url: "" }])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const getSocialIcon = (type: SocialLink["type"]) => {
    switch (type) {
      case "website":
        return <Globe className="h-4 w-4" />
      case "twitter":
        return <Twitter className="h-4 w-4" />
      case "linkedin":
        return <Linkedin className="h-4 w-4" />
      case "facebook":
        return <Facebook className="h-4 w-4" />
      case "instagram":
        return <Instagram className="h-4 w-4" />
      default:
        return <LinkIcon className="h-4 w-4" />
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      <DialogContent className={`${isMobile ? "w-[95vw] max-w-none p-4" : "sm:max-w-[500px]"}`}>
        <DialogHeader>
          <DialogTitle>Add New Speaker</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4 w-full">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Speaker Image */}
              <div
                className="relative h-24 w-24 mx-auto sm:mx-0 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {speakerImage ? (
                  <Image src={speakerImage || "/placeholder.svg"} alt="Speaker" fill className="object-cover" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title/Role</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="CEO, Company Name"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Social Links Section */}
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-center">
              <Label>Social Links</Label>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => addLink("website")}
                  title="Add Website"
                >
                  <Globe className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => addLink("twitter")}
                  title="Add Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => addLink("linkedin")}
                  title="Add LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => addLink("other")}
                  title="Add Other Link"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
              {links.map((link, index) => (
                <div key={index} className="flex items-center gap-2 w-full">
                  <div className="flex-shrink-0">{getSocialIcon(link.type)}</div>
                  <Input
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                    placeholder={`${link.type.charAt(0).toUpperCase() + link.type.slice(1)} URL`}
                    className="flex-1 w-full"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLink(index)}
                    className="h-8 w-8 p-0 flex-shrink-0"
                    disabled={links.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
          <Button variant="outline" onClick={onClose} className={isMobile ? "w-full" : ""}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()} className={isMobile ? "w-full" : ""}>
            Add Speaker
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


"use client"

import Image from "next/image"
import { X, Globe, Twitter, Linkedin, Facebook, Instagram, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type SocialLink = {
  type: "website" | "twitter" | "linkedin" | "facebook" | "instagram" | "other"
  url: string
}

type Speaker = {
  id: number
  name: string
  role: string
  image: string
  links?: SocialLink[]
}

type SpeakerCardProps = {
  speaker: Speaker
  onRemove: (id: number) => void
  showDetails?: boolean
}

export function SpeakerCard({ speaker, onRemove, showDetails = false }: SpeakerCardProps) {
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
    <div className="flex items-center p-4 border rounded-md bg-white">
      <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
        <Image src={speaker.image || "/placeholder.svg"} alt={speaker.name} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{speaker.name}</p>
        <p className="text-sm text-gray-500">{speaker.role}</p>

        {showDetails && speaker.links && speaker.links.length > 0 && (
          <div className="flex mt-3 space-x-3">
            {speaker.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                {getSocialIcon(link.type)}
              </a>
            ))}
          </div>
        )}
      </div>
      <Button variant="ghost" size="sm" onClick={() => onRemove(speaker.id)} className="h-9 w-9 p-0 ml-2">
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}


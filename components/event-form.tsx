"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { MapPin, Upload, Plus, X, Globe, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { DatePicker } from "@/components/date-picker"
import { TimePicker } from "@/components/time-picker"
import { NewSpeakerForm } from "@/components/new-speaker-form"
// import { useMobile } from "@/hooks/use-mobile"
import { SpeakerSelector } from "@/components/speaker-selector"

// Mock data for speakers
// const speakersList = [
//   { id: 1, name: "Alex Johnson", role: "CEO, TechCorp", image: "/placeholder.svg?height=40&width=40" },
//   { id: 2, name: "Maria Garcia", role: "CTO, InnovateLabs", image: "/placeholder.svg?height=40&width=40" },
//   { id: 3, name: "James Wilson", role: "AI Researcher", image: "/placeholder.svg?height=40&width=40" },
//   { id: 4, name: "Sarah Chen", role: "Product Lead, Linktank", image: "/placeholder.svg?height=40&width=40" },
// ]

export function EventForm() {
  // const isMobile = useMobile()
  const [eventImage, setEventImage] = useState<string | null>(null)
  const [isDateRange, setIsDateRange] = useState(false)

  // Date and time state
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState<string>("09:00")
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [endTime, setEndTime] = useState<string>("17:00")

  const [isVirtual, setIsVirtual] = useState(false)
  const [isInPerson, setIsInPerson] = useState(true)
  const [speakers, setSpeakers] = useState<any[]>([])
  const [agendaItems, setAgendaItems] = useState<{ time: string; title: string; description: string }[]>([
    { time: "10:00 AM", title: "Welcome & Introduction", description: "Opening remarks and event overview" },
  ])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setEventImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // const removeSpeaker = (speakerId: number) => {
  //   setSpeakers(speakers.filter((s) => s.id !== speakerId))
  // }

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, { time: "", title: "", description: "" }])
  }

  const updateAgendaItem = (index: number, field: string, value: string) => {
    const newAgendaItems = [...agendaItems]
    newAgendaItems[index] = { ...newAgendaItems[index], [field]: value }
    setAgendaItems(newAgendaItems)
  }

  const removeAgendaItem = (index: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index))
  }

  // Simple section component
  const Section = ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => (
    <div className="mb-8 pb-8 border-b">
      <div className="py-4">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Basic Information Section */}
      <Section title="Basic Information">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Upload Section */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <div
              className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden bg-gray-50 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {eventImage ? (
                <>
                  <Image src={eventImage || "/placeholder.svg"} alt="Event cover" fill className="object-cover" />
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
                onChange={(e) => setEventImage(e.target.value)}
              />
            </div>
          </div>

          {/* Main Form Section */}
          <div className="flex-1">
            <div className="space-y-6">
              <div>
                <Label htmlFor="event-title" className="text-sm font-medium mb-1 block">
                  Event Title
                </Label>
                <Input id="event-title" placeholder="Enter event title" className="text-lg md:text-xl font-medium" />
              </div>

              {/* Brief Description */}
              <div>
                <Label htmlFor="brief-description" className="text-sm font-medium mb-1 block">
                  Brief Description
                </Label>
                <Input id="brief-description" placeholder="A short summary of your event (displayed in event cards)" />
              </div>

              {/* Full Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium mb-1 block">
                  Full Description
                </Label>
                <Textarea id="description" placeholder="Detailed description of your event" className="min-h-[120px]" />
              </div>

              {/* URL */}
              <div>
                <Label htmlFor="url" className="text-sm font-medium mb-1 block">
                  Event URL
                </Label>
                <div className="relative">
                    <Input
                        id="url"
                        placeholder="https://example.com/event"
                    />
                    <Globe className="h-4 w-4 text-gray-400 mr-2" />
                </div>
              </div>

              <Separator className="my-6" />

              {/* Date Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-medium">Event Date</Label>
                  <div className="flex items-center">
                    <Label htmlFor="is-date-range" className="text-xs mr-2">
                      Date Range
                    </Label>
                    <Switch id="is-date-range" checked={isDateRange} onCheckedChange={setIsDateRange} />
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Start Date & Time</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <DatePicker date={startDate} setDate={setStartDate} placeholder="Select start date" />
                      <TimePicker time={startTime} setTime={setStartTime} placeholder="Select start time" />
                    </div>
                  </div>

                  {isDateRange && (
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">End Date & Time</Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <DatePicker date={endDate} setDate={setEndDate} placeholder="Select end date" />
                        <TimePicker time={endTime} setTime={setEndTime} placeholder="Select end time" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Location */}
              <div>
                <Label className="text-sm font-medium mb-4 block">Event Location</Label>
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is-in-person"
                        checked={isInPerson}
                        onCheckedChange={(checked) => setIsInPerson(checked as boolean)}
                      />
                      <Label htmlFor="is-in-person" className="text-sm">
                        In Person
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is-virtual"
                        checked={isVirtual}
                        onCheckedChange={(checked) => setIsVirtual(checked as boolean)}
                      />
                      <Label htmlFor="is-virtual" className="text-sm">
                        Virtual
                      </Label>
                    </div>
                  </div>

                  {isInPerson && (
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Physical Location</Label>
                      <div className="relative">
                        <Input
                            placeholder="Physical location address"
                        />
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      </div>
                    </div>
                  )}

                  {isVirtual && (
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Virtual Meeting Link</Label>
                      <div className="relative">
                        <Input
                            placeholder="Virtual meeting URL"
                        />
                        <Globe className="h-4 w-4 text-gray-400 mr-2" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Speakers Section */}
      <Section title="Speakers">
        <SpeakerSelector selectedSpeakers={speakers} onSpeakersChange={setSpeakers} />
      </Section>

      {/* Agenda Section */}
      <Section title="Agenda">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">Create your event schedule</p>
          <Button variant="outline" size="sm" onClick={addAgendaItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {agendaItems.map((item, index) => (
            <div key={index} className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-3">
                <Label className="text-xs text-gray-500">Agenda Item {index + 1}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAgendaItem(index)}
                  className="h-8 w-8 p-0"
                  disabled={agendaItems.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Time</Label>
                  <Input
                    placeholder="e.g., 10:00 AM"
                    value={item.time}
                    onChange={(e) => updateAgendaItem(index, "time", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Title</Label>
                  <Input
                    placeholder="e.g., Welcome & Introduction"
                    value={item.title}
                    onChange={(e) => updateAgendaItem(index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Description</Label>
                  <Input
                    placeholder="Brief description of this agenda item"
                    value={item.description}
                    onChange={(e) => updateAgendaItem(index, "description", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Submit Button */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 md:p-0 md:border-0 md:bg-transparent md:static md:flex md:justify-end mb-10 z-10">
        <Button size="lg" className="w-full md:w-auto px-8">
          Create Event
        </Button>
      </div>

      {/* New Speaker Modal */}
      <NewSpeakerForm isOpen={false} onClose={() => {}} onSave={() => {}} />
    </div>
  )
}


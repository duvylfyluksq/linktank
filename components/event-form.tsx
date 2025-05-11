"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { MapPin, Upload, Plus, X, Globe, Edit, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { DatePicker } from "@/components/date-picker"
import { TimePicker } from "@/components/time-picker"
import { NewSpeakerForm } from "@/components/new-speaker-form"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SpeakerSelector } from "@/components/speaker-selector"
import { MarkdownEditor } from "./markdown-editor"


// Types
interface Organization {
  _id: string
  name: string
}

interface Speaker {
  id: number
  name: string
  role: string
  image: string
}

interface AgendaItem {
  time: string
  title: string
  description: string
  start_time?: string
  speakers?: Speaker[]
}

interface DayAgenda {
  day: number
  date: Date | undefined
  items: AgendaItem[]
}

export function EventForm() {
  const [eventImage, setEventImage] = useState<string | null>(null)
  const [isDateRange, setIsDateRange] = useState(false)

  // Date and time state
  const [description, setDescription] = useState<string>("")
  const [fetching, setFetching] = useState(true)
  const [selectedOrgId, setSelectedOrgId] = useState<string>("")
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [startTime, setStartTime] = useState<string>("09:00")
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [endTime, setEndTime] = useState<string>("17:00")

  const [isVirtual, setIsVirtual] = useState(false)
  const [isInPerson, setIsInPerson] = useState(true)
  const [speakers, setSpeakers] = useState<Speaker[]>([])

  // Daywise agenda
  const [dayAgendas, setDayAgendas] = useState<DayAgenda[]>([
    {
      day: 1,
      date: new Date(),
      items: [{ time: "10:00 AM", title: "Welcome & Introduction", description: "Opening remarks and event overview" }],
    },
  ])

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true)
        await fetchOrganizations()
      } catch (error) {
        console.error("Error fetching organizations:", error)
      } finally {
        setFetching(false)
      }
    }
    fetchData()
  }, [])

  async function fetchOrganizations() {
    const response = await fetch(`/api/organizations`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const data = await response.json()
    setOrganizations(data.organizations)
  }

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

  const addDay = () => {
    const lastDay = dayAgendas[dayAgendas.length - 1]
    const newDate = new Date(lastDay.date || new Date())
    newDate.setDate(newDate.getDate() + 1)

    setDayAgendas([
      ...dayAgendas,
      {
        day: lastDay.day + 1,
        date: newDate,
        items: [{ time: "09:00 AM", title: "", description: "" }],
      },
    ])
  }

  const removeDay = (dayIndex: number) => {
    if (dayAgendas.length <= 1) return

    const newDayAgendas = [...dayAgendas]
    newDayAgendas.splice(dayIndex, 1)

    // Renumber days
    newDayAgendas.forEach((day, index) => {
      day.day = index + 1
    })

    setDayAgendas(newDayAgendas)
  }

  const addAgendaItem = (dayIndex: number) => {
    const newDayAgendas = [...dayAgendas]
    newDayAgendas[dayIndex].items.push({ time: "", title: "", description: "" })
    setDayAgendas(newDayAgendas)
  }

  const updateAgendaItem = (dayIndex: number, itemIndex: number, field: string, value: string) => {
    const newDayAgendas = [...dayAgendas]
    newDayAgendas[dayIndex].items[itemIndex] = {
      ...newDayAgendas[dayIndex].items[itemIndex],
      [field]: value,
    }
    setDayAgendas(newDayAgendas)
  }

  const removeAgendaItem = (dayIndex: number, itemIndex: number) => {
    const newDayAgendas = [...dayAgendas]
    newDayAgendas[dayIndex].items.splice(itemIndex, 1)

    // If no items left, add one empty item
    if (newDayAgendas[dayIndex].items.length === 0) {
      newDayAgendas[dayIndex].items.push({ time: "", title: "", description: "" })
    }

    setDayAgendas(newDayAgendas)
  }

  const updateDayDate = (dayIndex: number, date: Date | undefined) => {
    const newDayAgendas = [...dayAgendas]
    newDayAgendas[dayIndex].date = date
    setDayAgendas(newDayAgendas)
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
      <h1 className="text-xl sm:text-2xl font-bold">Submit an event</h1>
      <p className="text-gray-500 text-sm sm:text-base mt-1">
        Fill in the details to submit an event to Linktank&apos;s directory
      </p>
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
                  Event Title<span className="text-red-500">*</span>
                </Label>
                <Input id="event-title" placeholder="Enter event title" />
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
                  Full Description<span className="text-red-500">*</span>
                </Label>
                <MarkdownEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Full description here"
                />
              </div>

              {/* URL */}
              <div>
                <Label htmlFor="url" className="text-sm font-medium mb-1 block">
                  Event URL<span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input id="url" placeholder="https://example.com/event" className="pl-10" />
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="organization" className="text-sm font-medium mb-1 block">
                  Organization<span className="text-red-500">*</span>
                </label>
                {fetching ? (
                  <div className="text-gray-500">Loading organizations…</div>
                ) : (
                  <Select value={selectedOrgId} onValueChange={(val) => setSelectedOrgId(val)}>
                    <SelectTrigger className="w-[15.625rem] h-[3.125rem] bg-white rounded-[0.75rem] max-sm:w-full">
                      <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectGroup>
                        <SelectLabel>Select Organization</SelectLabel>
                        <SelectItem value="all">All Organizations</SelectItem>
                        {organizations.map((org) => (
                          <SelectItem key={org._id} value={org._id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
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
                    <Label className="text-xs text-gray-500">
                      Start Date & Time<span className="text-red-500">*</span>
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <DatePicker date={startDate} setDate={setStartDate} placeholder="Select start date" />
                      {!isDateRange && (
                        <TimePicker time={startTime} setTime={setStartTime} placeholder="Select start time" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">End Date & Time</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <DatePicker date={endDate} setDate={setEndDate} placeholder="Select end date" />
                      {!isDateRange && <TimePicker time={endTime} setTime={setEndTime} placeholder="Select end time" />}
                    </div>
                  </div>
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
                        <Input id="event-location" placeholder="Physical location address" className="pl-10" />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  )}

                  {isVirtual && (
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-500">Virtual Meeting Link</Label>
                      <div className="relative">
                        <Input id="meeting-url" placeholder="Virtual meeting link" className="pl-10" />
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
          <Button variant="outline" size="sm" onClick={addDay}>
            <Plus className="h-4 w-4 mr-2" />
            Add Day
          </Button>
        </div>

        <Tabs defaultValue="day-1" className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            {dayAgendas.map((day, dayIndex) => (
              <TabsTrigger key={`day-${day.day}`} value={`day-${day.day}`} className="flex items-center">
                Day {day.day}
                {dayAgendas.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeDay(dayIndex)
                    }}
                    className="ml-2 h-6 w-6 p-0 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {dayAgendas.map((day, dayIndex) => (
            <TabsContent key={`day-content-${day.day}`} value={`day-${day.day}`} className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <Label className="text-sm text-gray-500 mr-2">Day {day.day} Date:</Label>
                </div>
                <DatePicker
                  date={day.date}
                  setDate={(date) => updateDayDate(dayIndex, date)}
                  placeholder="Select date"
                  className="w-[200px]"
                />
                <Button variant="outline" size="sm" onClick={() => addAgendaItem(dayIndex)} className="ml-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {day.items.map((item, itemIndex) => (
                  <div key={`day-${day.day}-item-${itemIndex}`} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-xs text-gray-500">Agenda Item {itemIndex + 1}</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAgendaItem(dayIndex, itemIndex)}
                        className="h-8 w-8 p-0"
                        disabled={day.items.length === 1}
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
                          onChange={(e) => updateAgendaItem(dayIndex, itemIndex, "time", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Title</Label>
                        <Input
                          placeholder="e.g., Welcome & Introduction"
                          value={item.title}
                          onChange={(e) => updateAgendaItem(dayIndex, itemIndex, "title", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Description</Label>
                        <Textarea
                          placeholder="Brief description of this agenda item"
                          value={item.description}
                          onChange={(e) => updateAgendaItem(dayIndex, itemIndex, "description", e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Section>

      {/* Submit Button */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 md:p-0 md:border-0 md:bg-transparent md:static md:flex md:justify-end mb-10 z-10">
        <Button size="lg" className="w-full md:w-auto px-8 hover:bg-[#0e3b69]">
          Submit event
        </Button>
      </div>

      {/* New Speaker Modal */}
      <NewSpeakerForm isOpen={false} onClose={() => {}} onSave={() => {}} />
    </div>
  )
}

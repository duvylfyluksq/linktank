"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import CitySelector from "./CitySelector"

export type EventLocationTypeFilter = "all" | "in-person" | "online" | "hybrid"

interface FiltersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedType: EventLocationTypeFilter
  onApply: (type: EventLocationTypeFilter, cities?: City[]) => void
  onClear: () => void
  initialSelectedCities?: City[]
}

export default function EventFiltersDialog({
  open,
  onOpenChange,
  selectedType,
  onApply,
  onClear,
  initialSelectedCities,
}: FiltersDialogProps) {
  const [tempType, setTempType] = useState<EventLocationTypeFilter>(selectedType)
  const [cities, setCities] = useState<City[]>([])
  const [selectedCities, setSelectedCities] = useState<City[]>([])

  const handleApply = () => {
    onApply(tempType, selectedCities)
    onOpenChange(false)
  }

  const handleClear = () => {
    setTempType("all")
    setSelectedCities([])
    onClear()
  }

  const onDialogOpen = (dialogOpen: boolean) => {
    onOpenChange(dialogOpen)
    setTempType(selectedType)
  }

  useEffect(() => {
    const fetchCities = async () => {
      fetch("/api/cities")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setCities(data.cities)
          }
        })
    }
    if (open) {
      fetchCities()
      setTempType(selectedType)
    }
  }, [open])

  useEffect(() => {
    if (open && initialSelectedCities) {
      setSelectedCities(initialSelectedCities)
    }
  }, [open, initialSelectedCities])

  return (
    <Dialog open={open} onOpenChange={(dialogOpen) => onDialogOpen(dialogOpen)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Events</DialogTitle>
          <p className="text-sm text-gray-500">Filter events by location and type</p>
        </DialogHeader>

        <CitySelector cities={cities} selectedCities={selectedCities} setSelectedCities={setSelectedCities} />

        <div className="mt-4">
          <p className="font-medium text-sm mb-1">Event Type</p>
          <RadioGroup
            value={tempType}
            onValueChange={(val) => setTempType(val as EventLocationTypeFilter)}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <label htmlFor="all">All Events</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in-person" id="in-person" />
              <label htmlFor="in-person">In-Person</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="online" />
              <label htmlFor="online">Online</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hybrid" id="hybrid" />
              <label htmlFor="hybrid">Hybrid</label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleClear}>
            Clear Filters
          </Button>
          <Button className="bg-[#1C2329] hover:bg-[#0e3b69] text-white" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface City {
  _id: string
  name: string
}

export default function CitySelector({
  cities,
  selectedCities,
  setSelectedCities,
}: {
  cities: City[]
  selectedCities: City[]
  setSelectedCities: (cities: City[]) => void
}) {
  const [search, setSearch] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggleCity = (city: City) => {
    if (selectedCities.some((c) => c._id === city._id)) {
      setSelectedCities(selectedCities.filter((c) => c._id !== city._id))
    } else {
      setSelectedCities([...selectedCities, city])
    }
    setSearch("")
    setShowDropdown(false)
  }

  const filteredCities = cities.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) && !selectedCities.some((s) => s._id === c._id),
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="space-y-2" ref={containerRef}>
      <label className="text-sm font-medium">Cities</label>
      <Input
        placeholder="Search cities..."
        value={search}
        onClick={() => setShowDropdown(true)}
        onFocus={() => setShowDropdown(true)}
        onChange={(e) => {
          setSearch(e.target.value)
          setShowDropdown(true)
        }}
        className="text-sm"
      />

      {showDropdown && (
        <div className="max-h-[200px] overflow-y-auto border rounded px-2 py-1 bg-white shadow-md z-50 relative w-full mt-1">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <div
                key={city._id}
                onClick={() => toggleCity(city)}
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 text-sm rounded"
              >
                {city.name}
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 p-2">No matching cities</p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedCities.map((city) => (
          <div key={city._id} className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-1">
            {city.name}
            <X className="w-4 h-4 cursor-pointer" onClick={() => toggleCity(city)} />
          </div>
        ))}
      </div>
    </div>
  )
}

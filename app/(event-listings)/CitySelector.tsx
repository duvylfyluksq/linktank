"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { X, Search } from "lucide-react"


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
  }

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedCities.some((s) => s._id === c._id)
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="space-y-2 w-full" ref={containerRef}>
      <label className="text-sm font-medium">Location</label>

      <div className="relative w-full">
        <div
          onClick={() => setShowDropdown((prev) => !prev)}
          className="w-full cursor-pointer border rounded-md px-4 py-2 bg-white text-sm flex justify-between items-center shadow-sm"
        >
          <span className="text-gray-800">
            {selectedCities.length === 0
              ? "Select Cities..."
              : `${selectedCities.length} ${selectedCities.length === 1 ? "city" : "cities"} selected`}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25L12 15.75 4.5 8.25" />
          </svg>
        </div>

        {showDropdown && (
          <div className="absolute left-1/2 translate-x-[-50%] mt-2 w-[18rem] z-50 bg-white max-h-60 border rounded-md shadow-lg overflow-y-auto">
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Search cities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 border-b border-gray-300 rounded-none px-8 pb-1 text-sm 
                focus:outline-none focus:ring-0 focus:border-gray-300 focus-visible:ring-0 focus-visible:border-gray-300"
              />
            </div>
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <div
                  key={city._id}
                  onClick={() => toggleCity(city)}
                  className="cursor-pointer px-8 py-2 hover:bg-gray-100 rounded text-sm text-gray-700"
                >
                  {city.name}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 p-2">No matching cities</p>
            )}
          </div>
        )}
      </div>


      <div className="flex flex-wrap gap-2 mt-2">
        {selectedCities.map((city) => (
          <div
            key={city._id}
            className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-2 font-medium"
          >
            {city.name}
            <X
              className="w-4 h-4 cursor-pointer hover:text-red-500"
              onClick={() => toggleCity(city)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

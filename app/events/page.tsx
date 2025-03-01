"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import SkeletonCard from "./SkeletonCard";
import { EventCard } from "@/components/event-card";
import { SearchBar } from "@/app/events/SearchBar";
import { EventCalendar } from "@/app/events/EventCalendar";
import { FiltersDisplay } from "@/app/events/FiltersDisplay";
import { EventTypeSelector } from "@/app/events/EventTypeSelector";
import Filters from "./Filters";

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [organizations, setOrganizations] = useState<
        { name: string; _id: string }[]
    >([]);
    const [selectedOrg, setSelectedOrg] = useState<string>("all");
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        dateRange: {
            from: undefined as Date | undefined,
            to: undefined as Date | undefined,
        },
        locations: [] as string[],
        eventType: "upcoming" as "upcoming" | "past" | "all",
    });
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    // Hardcoded location data
    const availableLocations = [
        { id: "ny", name: "New York" },
        { id: "dc", name: "Washington D.C." },
        { id: "sf", name: "San Francisco" },
        { id: "chi", name: "Chicago" },
        { id: "la", name: "Los Angeles" },
        { id: "bos", name: "Boston" },
        { id: "virtual", name: "Virtual" },
    ];

    // Add this function to handle filter changes
    const handleFilterChange = (filterType: string, value: any) => {
        const newFilters = { ...filters };
        let newActiveFilters = [...activeFilters];

        switch (filterType) {
            case "dateRange":
                newFilters.dateRange = value;

                // Update active filters for date range
                const dateFilterIndex = newActiveFilters.findIndex((f) =>
                    f.startsWith("Date:")
                );
                if (value.from && value.to) {
                    const dateFilter = `Date: ${format(value.from, "MMM d")} - ${format(value.to, "MMM d")}`;
                    if (dateFilterIndex >= 0) {
                        newActiveFilters[dateFilterIndex] = dateFilter;
                    } else {
                        newActiveFilters.push(dateFilter);
                    }
                } else if (dateFilterIndex >= 0) {
                    newActiveFilters.splice(dateFilterIndex, 1);
                }
                break;

            case "location":
                const locationIndex = newFilters.locations.indexOf(value);
                if (locationIndex >= 0) {
                    newFilters.locations.splice(locationIndex, 1);
                    newActiveFilters = newActiveFilters.filter(
                        (f) =>
                            f !==
                            `Location: ${availableLocations.find((l) => l.id === value)?.name}`
                    );
                } else {
                    newFilters.locations.push(value);
                    newActiveFilters.push(
                        `Location: ${availableLocations.find((l) => l.id === value)?.name}`
                    );
                }
                break;

            case "eventType":
                newFilters.eventType = value;

                // Update active filters for event type
                const eventTypeIndex = newActiveFilters.findIndex((f) =>
                    f.startsWith("Type:")
                );
                if (value !== "all") {
                    const eventTypeFilter = `Type: ${value.charAt(0).toUpperCase() + value.slice(1)}`;
                    if (eventTypeIndex >= 0) {
                        newActiveFilters[eventTypeIndex] = eventTypeFilter;
                    } else {
                        newActiveFilters.push(eventTypeFilter);
                    }
                } else if (eventTypeIndex >= 0) {
                    newActiveFilters.splice(eventTypeIndex, 1);
                }
                break;
        }

        setFilters(newFilters);
        setActiveFilters(newActiveFilters);
    };

    // Add this function to remove a filter
    const removeFilter = (filter: string) => {
        if (filter.startsWith("Location:")) {
            const locationName = filter.replace("Location: ", "");
            const locationId = availableLocations.find(
                (l) => l.name === locationName
            )?.id;
            if (locationId) {
                handleFilterChange("location", locationId);
            }
        } else if (filter.startsWith("Date:")) {
            handleFilterChange("dateRange", { from: undefined, to: undefined });
        } else if (filter.startsWith("Type:")) {
            handleFilterChange("eventType", "all");
        }
    };

    // Add this function to clear all filters
    const clearAllFilters = () => {
        setFilters({
            dateRange: { from: undefined, to: undefined },
            locations: [],
            eventType: "all",
        });
        setActiveFilters([]);
    };

    const handleSearch = async (term: string) => {
        setSearchTerm(term);

        try {
            const params = new URLSearchParams();
            if (term) {
                params.append("search", term);
            }
            if (selectedOrg !== "all")
                params.append("organization", selectedOrg);
            const response = await fetch(
                `/api/events/search?${params.toString()}`
            );
            const data = await response.json();
            if (data.success) {
                setEvents(data.events);
            }
        } catch (error) {
            console.error("Error searching events:", error);
        }
    };

    const groupedEvents: Record<string, Event[]> = events.reduce(
        (acc, event) => {
            const dateKey = new Date(event.date_from).toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }
            );
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(event);
            return acc;
        },
        {}
    );

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const orgQuery =
                selectedOrg !== "all" ? `?organization=${selectedOrg}` : "";
            const response = await fetch(`/api/events${orgQuery}`);
            const data = await response.json();
            setEvents(data.events);
            setLoading(false);
        };

        fetchEvents();
    }, [selectedOrg]);

    useEffect(() => {
        // Fetch organizations
        fetch("/api/organizations")
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setOrganizations(data.organizations);
                }
            });
    }, []);

    return (
        <div className="mt-[3.75rem] flex flex-col gap-[2.25rem] w-[69.375rem] max-sm:w-full max-sm:px-5 max-sm:mt-5">
            <div className="w-full flex flex-row justify-between items-center max-sm:flex-col max-sm:items-start">
                <div className="flex flex-row items-center gap-2 max-sm:w-full">
                    <h3 className="text-[2rem] font-jakarta font-extrabold max-sm:text-[18px] ">
                        Upcoming Events
                    </h3>
                    <div className="flex gap-2.5 max-sm:ml-auto sm:hidden">
                        <EventTypeSelector
                            currentType={filters.eventType}
                            onChange={(type) =>
                                handleFilterChange("eventType", type)
                            }
                        />
                    </div>
                </div>

                <SearchBar
                    value={searchTerm}
                    onChange={handleSearch}
                    className="max-sm:w-full max-sm:mt-2"
                />

                <Filters
                    activeFilters={activeFilters}
                    filters={filters}
                    onFilterChangeAction={handleFilterChange}
                    clearAllFiltersAction={clearAllFilters}
                />

                <Select
                    value={selectedOrg}
                    onValueChange={(val) => setSelectedOrg(val)}
                >
                    <SelectTrigger className="w-[15.625rem] h-[3.125rem] bg-white rounded-[0.75rem] max-sm:mt-5 max-sm:w-full">
                        <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectGroup>
                            <SelectLabel>Select Organization</SelectLabel>
                            <SelectItem value="all">
                                All Organizations
                            </SelectItem>
                            {organizations.map((org) => (
                                <SelectItem key={org._id} value={org._id}>
                                    {org.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Active filters display */}
            <FiltersDisplay
                activeFilters={activeFilters}
                onRemoveFilter={removeFilter}
                onClearAllFilters={clearAllFilters}
            />

            <div className="flex max-sm:flex-col">
                <ol className="relative flex-grow w-full md:pr-20 border-s border-[#808080] max-sm:border-none border-opacity-25 px-0">
                    <div className="sm:hidden">
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                  <div
                                      key={i}
                                      className="flex flex-col items-left"
                                  >
                                      <SkeletonCard />
                                  </div>
                              ))
                            : Object.entries(groupedEvents).map(
                                  ([date, events]) => (
                                      <div
                                          key={date}
                                          className="mb-6 flex flex-col items-left"
                                      >
                                          <time className="text-lg font-bold mt-6">
                                              {date}
                                          </time>
                                          {events.map((event) => (
                                              <EventCard
                                                  event={event}
                                                  key={event._id}
                                              />
                                          ))}
                                      </div>
                                  )
                              )}
                    </div>

                    <div className="hidden sm:block">
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                  <SkeletonCard key={i} />
                              ))
                            : Object.entries(groupedEvents).map(
                                  ([date, groupedEvents]) => (
                                      <li key={date} className="mb-10 ms-4">
                                          <div className="absolute w-3 h-3 bg-gray-800 rounded-full mt-1.5 -start-1.5 border border-white" />
                                          <time className="text-base md:text-xl font-semibold leading-none">
                                              {date}
                                          </time>
                                          {groupedEvents.map((event) => (
                                              <EventCard
                                                  event={event}
                                                  key={event._id}
                                              />
                                          ))}
                                      </li>
                                  )
                              )}
                    </div>
                </ol>

                <div className="h-auto max-sm:mt-4">
                    <EventTypeSelector
                        currentType={filters.eventType}
                        onChange={(type) =>
                            handleFilterChange("eventType", type)
                        }
                        className="flex w-full items-center space-x-2 mb-4 max-sm:flex-col max-sm:hidden"
                    />

                    <EventCalendar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        className="rounded-md border border-black border-opacity-25 bg-white max-sm:hidden"
                    />
                </div>
            </div>
        </div>
    );
}

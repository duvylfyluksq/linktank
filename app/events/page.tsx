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

    const availableLocations = [
        { id: "ny", name: "New York" },
        { id: "dc", name: "Washington D.C." },
        { id: "sf", name: "San Francisco" },
        { id: "chi", name: "Chicago" },
        { id: "la", name: "Los Angeles" },
        { id: "bos", name: "Boston" },
        { id: "virtual", name: "Virtual" },
    ];

    const handleFilterChange = (filterType: string, value: any) => {
        const newFilters = { ...filters };
        let newActiveFilters = [...activeFilters];

        switch (filterType) {
            case "dateRange":
                newFilters.dateRange = value;

                const dateFilterIndex = newActiveFilters.findIndex((f) =>
                    f.startsWith("Date:")
                );

                if (value.from && value.to) {
                    const dateFilter = `Date: ${format(
                        value.from,
                        "MMM d"
                    )} - ${format(value.to, "MMM d")}`;
                    if (dateFilterIndex >= 0) {
                        newActiveFilters[dateFilterIndex] = dateFilter;
                    } else {
                        newActiveFilters.push(dateFilter);
                    }

                    // Remove event type filter if date range is selected
                    newFilters.eventType = "all";
                    const eventTypeIndex = newActiveFilters.findIndex((f) =>
                        f.startsWith("Type:")
                    );
                    if (eventTypeIndex >= 0)
                        newActiveFilters.splice(eventTypeIndex, 1);
                } else if (dateFilterIndex >= 0) {
                    newActiveFilters.splice(dateFilterIndex, 1);
                }
                break;

            case "location":
                const locationIndex = newFilters.locations.indexOf(value);
                const locationName = availableLocations.find(
                    (l) => l.id === value
                )?.name;

                if (locationIndex >= 0) {
                    newFilters.locations.splice(locationIndex, 1);
                    newActiveFilters = newActiveFilters.filter(
                        (f) => f !== `Location: ${locationName}`
                    );
                } else {
                    newFilters.locations.push(value);
                    newActiveFilters.push(`Location: ${locationName}`);
                }
                break;

            case "eventType":
                newFilters.eventType = value;

                const eventTypeIndex = newActiveFilters.findIndex((f) =>
                    f.startsWith("Type:")
                );

                // Remove date range filter if event type is selected
                newFilters.dateRange = { from: undefined, to: undefined };
                const dateRangeIndex = newActiveFilters.findIndex((f) =>
                    f.startsWith("Date:")
                );
                if (dateRangeIndex >= 0)
                    newActiveFilters.splice(dateRangeIndex, 1);

                if (value !== "all") {
                    const eventTypeFilter = `Type: ${
                        value.charAt(0).toUpperCase() + value.slice(1)
                    }`;
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

    const clearAllFilters = () => {
        setFilters({
            dateRange: { from: undefined, to: undefined },
            locations: [],
            eventType: "all",
        });
        setActiveFilters([]);
    };

    const fetchFilteredEvents = async (searchTerm: string = "") => {
        setLoading(true);

        try {
            const params = new URLSearchParams();

            if (searchTerm) params.append("search", searchTerm);
            if (selectedOrg !== "all")
                params.append("organization", selectedOrg);
            if (filters.dateRange.from)
                params.append("dateFrom", filters.dateRange.from.toISOString());
            if (filters.dateRange.to)
                params.append("dateTo", filters.dateRange.to.toISOString());

            filters.locations.forEach((location) => {
                params.append("locations", location);
            });

            if (
                filters.eventType !== "all" &&
                !(filters.dateRange.from && filters.dateRange.to)
            ) {
                params.append("eventType", filters.eventType);
            }

            const response = await fetch(
                `/api/events/search?${params.toString()}`
            );
            const data = await response.json();

            if (data.success) {
                setEvents(data.events);
            } else {
                console.error("Error fetching events:", data.error);
            }
        } catch (error) {
            console.error("Error fetching filtered events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        await fetchFilteredEvents(term);
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
        fetchFilteredEvents();
    }, [selectedOrg, filters]);

    useEffect(() => {
        fetch("/api/organizations")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setOrganizations(data.organizations);
                }
            });
    }, []);

    return (
        <div className="mt-[3.75rem] flex flex-col gap-[2.25rem] w-[69.1875rem] max-sm:px-5 max-sm:mt-5 flex-grow-0">
            <div className="w-full flex flex-row justify-between items-center max-sm:flex-col max-sm:items-start">
                <div className="flex flex-row items-center gap-2 max-sm:w-full">
                    <h3 className="text-[2rem] font-jakarta font-extrabold max-sm:text-[18px]">
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

                <div className="flex items-center h-full">
                    <SearchBar value={searchTerm} onChange={handleSearch} />

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
                        <SelectTrigger className="w-[12rem] ml-3 h-[3.125rem] bg-white rounded-[0.75rem] max-sm:mt-5 max-sm:w-full">
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
            </div>

            {/* <div className="flex flex-row w-full gap-[1.625rem]">
                <ol className="relative grow border-s border-[#808080] max-sm:border-none border-opacity-25 px-0">
                    <div className="sm:hidden">
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                  <SkeletonCard key={i} />
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

                    <div className="hidden sm:block w-[69.1875rem]">
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
                <div className="h-auto max-sm:mt-4 w-[18.875rem] flex-shrink-0">
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
            </div> */}
            <div className="flex flex-row w-full gap-[1.625rem]">
                <ol className="relative grow border-s border-[#808080] max-sm:border-none border-opacity-25 px-0">
                    <div className="sm:hidden">
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                  <SkeletonCard key={i} />
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

                    <div className="hidden sm:flex flex-col">
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
                <div className="h-auto max-sm:mt-4 flex-shrink-0">
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

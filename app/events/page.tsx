"use client";

import { useEffect, useState } from "react";
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
import { EventCalendar } from "@/app/events/EventCalendar";
import EventTypeSelector from "@/app/events/EventTypeSelector";
import { Button } from "@/components/ui/button";
import EventFiltersDialog from "@/components/EventFiltersDialog";
import {SlidersHorizontal } from "lucide-react";

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const updateFilters = <K extends keyof EventFilter>(
        keyOrUpdates: K | Partial<EventFilter>,
        value?: EventFilter[K]
      ) => {
        if (typeof keyOrUpdates === "string") {
          setFilters((prev) => ({
            ...prev,
            [keyOrUpdates]: value,
          }));
        } else {
          setFilters((prev) => ({
            ...prev,
            ...keyOrUpdates,
          }));
        }
    };

    const [filters, setFilters] = useState<EventFilter>({
        location_type: "all",
        locations: [],
        date_type: "upcoming",
        date: undefined,
        organization_id: "all",
    });

    const fetchFilteredEvents = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            if (filters.organization_id !== "all")
                params.append("organization", filters.organization_id);

            if (filters.date)
                params.append("date", filters.date.toISOString());

            filters.locations.forEach((location) => {
                params.append("locations", location);
            });

            if (filters.date_type !== "all")
                params.append("dateType", filters.date_type);

            if (filters.location_type !== "all")
                params.append("locationType", filters.location_type);

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

    const groupedEvents: Record<string, EventModel[]> = events.reduce(
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
        if (filters.date) {
            const now = new Date();
            const selected = filters.date;
            const isUpcoming = selected >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const dateType = isUpcoming ? "upcoming" : "past";
            updateFilters("date_type", dateType);
        }
      }, [filters.date]);

    useEffect(() => {
        fetchFilteredEvents();
    }, [filters]);

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
        <div className="mt-[3.75rem] flex flex-col gap-[2.25rem] w-[69.1875rem]">
            <div className="w-full flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-2 max-sm:w-full">
                    <h3 className="text-[2rem] font-jakarta font-extrabold max-sm:text-[18px]">
                        {filters.date_type === "upcoming" ? "Upcoming Events" : "Past Events"}
                    </h3>
                    <div className="flex gap-2.5 max-sm:ml-auto sm:hidden">
                        <EventTypeSelector
                            currentType={filters.date_type}
                            onChange={(type) => {
                                updateFilters({
                                    date: undefined,
                                    date_type: type
                                })
                            }}
                        />
                    </div>
                </div>

                <div className="flex gap-4 items-center h-full">
                    <Select
                        value={filters.organization_id}
                        onValueChange={(val) => updateFilters("organization_id", val)}
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
                    <Button 
                        className="bg-[#1C2329] hover:bg-[#0e3b69] rounded-[0.74969rem] h-[3.125rem] text-white px-[0.81rem] max-sm:w-full max-sm:h-11"
                        onClick={() => setFiltersOpen(true)}
                    >
                        <SlidersHorizontal size={20} />
                        <span className="text-[1rem]">Filters</span>
                    </Button>
                    <EventFiltersDialog
                        open={filtersOpen}
                        onOpenChange={setFiltersOpen}
                        selectedType={filters.location_type}
                        onApply={(type) => updateFilters("location_type", type)}
                        onClear={() => updateFilters("location_type", "all")}
                    />
                </div>
            </div>
            <div className="flex flex-row w-full gap-[1.625rem]">
                <ol className="relative border-s border-[#808080] border-opacity-25 w-full">
                    {/* <>
                        <div className="absolute right-4 top-2 sm:hidden">
                            <Button
                                variant="outline"
                                onClick={() => setMobileCalendarOpen(true)}
                                className="p-2"
                            >
                                <CalendarIcon size={20} />
                            </Button>
                        </div>

                        {mobileCalendarOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black backdrop-blur-sm bg-opacity-50 z-50 sm:hidden">
                                <div className="bg-white p-4 rounded-md">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(d) => {
                                            setDate(d);
                                            setMobileCalendarOpen(false);
                                        }}
                                    />
                                    <Button
                                        onClick={() =>
                                            setMobileCalendarOpen(false)
                                        }
                                        className="mt-2 w-full"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        )}
                    </> */}
                    {/* <div className="sm:hidden">
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
                                          <time className="text-2xl font-bold mb-2">
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
                    </div> */}
                    <div className="hidden sm:block">
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                  <SkeletonCard key={i} />
                              ))
                            : Object.entries(groupedEvents).map(
                                  ([date, groupedEvents]) => (
                                      <li key={date} className="mb-10 ms-4">
                                          <div className="absolute w-3 h-3 bg-gray-800 rounded-full mt-1.5 -start-1.5 border border-white" />
                                          <time className="mb-1 text-xl font-semibold leading-none">
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
                        currentType={filters.date_type}
                        onChange={(type) => {
                            updateFilters({
                                date: undefined,
                                date_type: type
                            })
                        }}
                        className="flex w-full items-center space-x-2 mb-4 max-sm:flex-col max-sm:hidden"
                    />

                    <EventCalendar
                        filters={filters}
                        onFilterChange={updateFilters}
                        className="bg-white max-sm:hidden"
                    />
                </div>
            </div>
        </div>
    );
}

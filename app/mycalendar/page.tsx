"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EventCard } from "@/components/event-card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import SkeletonCard from "@/app/events/SkeletonCard";
import { Input } from "@/components/ui/input";
import debounce from "lodash/debounce";
import { useSavedEvents } from "../contexts/SavedEventsContext";

export default function Home() {
    const [date, setDate] = useState<Date | undefined>(() => new Date());
    const [events, setEvents] = useState<EventModel[]>([]);
    console.log(events);
    const [organizations, setOrganizations] = useState<
        { name: string; _id: string }[]
    >([]);
    const [selectedOrg, setSelectedOrg] = useState<string>("all");
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);

    const {savedEvents} = useSavedEvents();

    // Debounced search function
    const debouncedSearch = debounce(async (searchTerm: string) => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) {
                params.append("search", searchTerm);
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
    }, 300);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        debouncedSearch(value.trim());
    };

    const today = useMemo(() => new Date(), []);

    // Group events by date for display
    const groupedEvents: Record<string, EventModel[]> = savedEvents.reduce(
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

    // Clean up debounce on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, []);

    // Fetch saved events instead of all events
    useEffect(() => {
        const fetchSavedEvents = async () => {
            setLoading(true);
            try {
                // First, get saved event ids from your saveevent API
                const savedRes = await fetch("/api/saveevent", {
                    method: "GET",
                });
                const savedData = await savedRes.json();
                if (savedData.success) {
                    const savedIds: string[] = savedData.eventIds;
                    if (savedIds.length > 0) {
                        // Fetch full event details for these saved events
                        const eventsRes = await fetch(
                            `/api/events/savedevents?savedIds=${savedIds.join(
                                ","
                            )}`,
                            {
                                method: "GET",
                            }
                        );
                        const eventsData = await eventsRes.json();
                        if (eventsData.success) {
                            setEvents(eventsData.events);
                        } else {
                            console.error(
                                "Error fetching event details:",
                                eventsData.message
                            );
                        }
                    } else {
                        setEvents([]);
                    }
                } else {
                    console.error(
                        "Error fetching saved event ids:",
                        savedData.message
                    );
                }
            } catch (error) {
                console.error("Error fetching saved events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedEvents();
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
                        <Button
                            variant={
                                date && date >= today ? "default" : "secondary"
                            }
                            onClick={() => setDate(new Date())}
                            className="rounded-[0.75rem] h-11 font-medium w-auto py-2"
                        >
                            Upcoming
                        </Button>
                        <Button
                            variant={
                                date && date < today ? "default" : "secondary"
                            }
                            onClick={() => {
                                const pastDate = new Date();
                                pastDate.setMonth(pastDate.getMonth() - 1);
                                setDate(pastDate);
                            }}
                            className="rounded-[0.75rem] h-11 font-medium w-auto py-2"
                        >
                            Past
                        </Button>
                    </div>
                </div>
                <Input
                    type="search"
                    placeholder="Search..."
                    className="md:w-[10rem] rounded-[0.75rem] mr-3 bg-white h-[3.125rem] max-sm:w-full max-sm:mt-2"
                    onChange={(e) => handleSearch(e.target.value)}
                    value={searchTerm}
                />
                <div className="flex flex-row items-center gap-[0.75rem] max-sm:w-full max-sm:mt-2">
                    <Select>
                        <SelectTrigger className="w-[15.625rem] h-[3.125rem] bg-white rounded-[0.75rem] max-sm:w-full">
                            <SelectValue placeholder="Anywhere" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectGroup>
                                <SelectLabel>Anywhere</SelectLabel>
                                <SelectItem value="ny">New York</SelectItem>
                                <SelectItem value="dc">
                                    Washington D.C.
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button className="bg-[#1C2329] rounded-[0.74969rem] h-[3.125rem] text-white px-[0.81rem] max-sm:w-full max-sm:h-11">
                        <SlidersHorizontal size={20} />
                        <span className="text-[1rem]">Filters (1)</span>
                    </Button>
                </div>
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

            <div className="flex max-sm:flex-col">
                <ol className="relative flex-grow pr-20 border-s border-[#808080] max-sm:border-none border-opacity-25 max-sm:pr-0 max-sm:px-4">
                    <>
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
                    </>
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

                <div className="h-auto max-sm:mt-4">
                    <div className="flex w-full items-center space-x-2 mb-4 max-sm:flex-col max-sm:hidden">
                        <Button
                            variant={
                                date && date >= today ? "default" : "secondary"
                            }
                            onClick={() => setDate(new Date())}
                            className="rounded-[0.75rem] w-[70%] h-[3.125rem] font-medium max-sm:w-full"
                        >
                            Upcoming
                        </Button>
                        <Button
                            variant={
                                date && date < today ? "default" : "secondary"
                            }
                            onClick={() => {
                                const pastDate = new Date();
                                pastDate.setMonth(pastDate.getMonth() - 1);
                                setDate(pastDate);
                            }}
                            className="rounded-[0.75rem] w-[30%] h-[3.125rem] font-medium max-sm:w-full"
                        >
                            Past
                        </Button>
                    </div>

                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border border-black border-opacity-25 bg-white max-sm:hidden"
                    />
                </div>
            </div>
        </div>
    );
}

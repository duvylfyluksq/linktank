"use client";

import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
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
import { useSavedEvents } from "../contexts/SavedEventsContext";
import { useUser } from "@clerk/nextjs";
import SubscriptionPage from "@/app/authwall/authwall";
import EventFiltersDialog from "@/components/EventFiltersDialog";
import EventTypeSelector from "../events/EventTypeSelector";
import { EventCalendar } from "../events/EventCalendar";


export default function Home() {
    const [filters, setFilters] = useState<EventFilter>({
        location_type: "all",
        locations: [],
        date_type: "upcoming",
        date: undefined,
        organization_id: "all",
    });

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

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const { isSignedIn } = useUser();
    const {savedEvents} = useSavedEvents();

    useEffect(() => {
        if (filters.date) {
            const now = new Date();
            const selected = filters.date;
            const isUpcoming = selected >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const dateType = isUpcoming ? "upcoming" : "past";
            updateFilters("date_type", dateType);
        }
      }, [filters.date]);

    const filteredEvents = useMemo(() => {
        const now = new Date();
      
        return savedEvents.filter((event) => {
          if (
            filters.organization_id !== "all" &&
            event.organization._id !== filters.organization_id
          ) {
            return false;
          }
      
          if (filters.location_type === "in-person" && !event.is_in_person) return false;
          if (filters.location_type === "online" && !event.is_virtual) return false;
          if (filters.location_type === "hybrid" &&
            !(event.is_virtual && event.is_in_person)
          )
            return false;
      
          const dateFrom = new Date(event.date_from);
          const dateTo = event.date_to ? new Date(event.date_to) : dateFrom;
      
          if (filters.date) {
            const selectedDate = filters.date;
            const sameDay =
              dateFrom.getFullYear() === selectedDate.getFullYear() &&
              dateFrom.getMonth() === selectedDate.getMonth() &&
              dateFrom.getDate() === selectedDate.getDate();
      
            return sameDay;
          }
      
          if (filters.date_type === "past" && dateFrom >= now) return false;
          if (filters.date_type === "upcoming" && dateTo < now) return false;
      
          return true;
        });
      }, [savedEvents, filters]);

    const groupedEvents: Record<string, EventModel[]> = useMemo(() => {
        return filteredEvents.reduce((acc, event) => {
          const dateKey = new Date(event.date_from).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(event);
          return acc;
        }, {} as Record<string, EventModel[]>);
      }, [filteredEvents]);
    
    useEffect(() => {
        if(savedEvents) setLoading(false);
    }, [savedEvents]);

    useEffect(() => {
        fetch("/api/organizations")
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setOrganizations(data.organizations);
                }
            });
    }, []);

    if(!isSignedIn){
        return <SubscriptionPage/>;
    }
    

    return (
        <div className="mt-[3.75rem] flex flex-col gap-[2.25rem] w-[69.375rem] max-sm:w-full max-sm:px-5 max-sm:mt-5">
            <div className="w-full flex flex-row justify-between items-center max-sm:flex-col max-sm:items-start">
                <div className="flex flex-row items-center gap-2 max-sm:w-full">
                    <div>
                        <h3 className="text-[2rem] font-jakarta font-extrabold max-sm:text-[18px] ">
                            My calendar
                        </h3>
                        <p className="text-gray-700">
                            These are your saved events
                        </p>
                    </div>
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
                <div className="flex gap-4">
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

            <div className="flex max-sm:flex-col">
                <ol className="relative flex-grow pr-20 border-s border-[#808080] max-sm:border-none border-opacity-25 max-sm:pr-0 max-sm:px-4">
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
                        className="space-x-2 mb-4"
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

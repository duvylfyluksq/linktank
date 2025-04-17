import { useEventFilters } from "@/hooks/useEventFilters";
import { useEffect, useState, useRef } from "react";
import EventTypeSelector from "./EventTypeSelector";
import { EventCalendar } from "./EventCalendar";
import EventFiltersDialog from "@/app/(event-listings)/EventFiltersDialog";
import { Button } from "@/components/ui/button";
import { Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Loader2, SlidersHorizontal } from "lucide-react";
import { Timeline } from "@/app/(event-listings)/timeline";


interface EventListingsProps {
    Header: (filters: EventFilter) => React.ReactNode;
    filters: ReturnType<typeof useEventFilters>;
    events: EventModel[];
    loadingState: { loading: boolean };
    fetchingState?: { fetching: boolean};
    onLoadMore?: () => Promise<void>;
    hasMoreRef?: React.MutableRefObject<boolean>;
}


export default function EventListings({
        Header,
        filters,
        events,
        loadingState,
        fetchingState,
        onLoadMore,
        hasMoreRef
}: EventListingsProps){

    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isFetchingRef = useRef(false);

    useEffect(() => {
        const sentinel = sentinelRef.current;
    
        if (!sentinel || !onLoadMore || !hasMoreRef?.current) return;
    
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !loadingState.loading && !isFetchingRef.current && hasMoreRef?.current) {
                    isFetchingRef.current = true;
                    observerRef.current?.unobserve(entry.target);
                    onLoadMore().finally(() => {
                        isFetchingRef.current = false;
                        observerRef.current?.observe(entry.target);
                    });
                }
            },
            {
                root: null,
                rootMargin: "1000px",
                threshold: 0,
            }
        );
    
        observerRef.current.observe(sentinel);
    
        return () => {
            observerRef.current?.disconnect();
            observerRef.current = null;
        };
    }, [loadingState.loading, onLoadMore]); 

    const [organizations, setOrganizations] = useState<Organization[]>([]);

    useEffect(() => {
        fetch("/api/organizations")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setOrganizations(data.organizations);
                }
            });
    }, []);

    useEffect(() => {
        if (filters.date) {
            const now = new Date();
            const selected = filters.date;
            const isUpcoming = selected >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const dateType = isUpcoming ? "upcoming" : "past";
            filters.updateFilters("date_type", dateType);
        }
    }, [filters.date]);

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    return(
        <div className="mt-[3.75rem] flex flex-col gap-[2.25rem] w-[69.1875rem] pb-[2rem]">
            <div className="w-full flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-2 max-sm:w-full">
                    {Header(filters)}
                    <div className="flex gap-2.5 max-sm:ml-auto sm:hidden">
                        <EventTypeSelector
                            currentType={filters.date_type}
                            onChange={(type) => {
                                filters.updateFilters({
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
                        onValueChange={(val) => filters.updateFilters("organization_id", val)}
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
                        onClick={() => setIsFiltersOpen(true)}
                    >
                        <SlidersHorizontal size={20} />
                        <span className="text-[1rem]">Filters</span>
                    </Button>
                    <EventFiltersDialog
                        open={isFiltersOpen}
                        onOpenChange={setIsFiltersOpen}
                        selectedType={filters.location_type}
                        onApply={(type) => filters.updateFilters("location_type", type)}
                        onClear={() => filters.updateFilters("location_type", "all")}
                    />
                </div>
            </div>
            <div className="flex flex-row w-full gap-[1.625rem] min-h-screen relative">
                {/* removed mobile view from here and pasted at the bottom to reduce clutter */}                    
                <div 
                    className="flex-1 pr-4"
                >
                    <Timeline events={events} loading={loadingState.loading}/>
                    {fetchingState?.fetching && (
                        <div className="flex justify-center items-center py-4">
                            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        </div>
                    )}
                    <div className="h-1" ref={sentinelRef} />
                </div>

                <div className="h-auto max-sm:mt-4 flex-shrink-0 sticky top-[5rem] self-start max-sm:hidden">
                    <EventTypeSelector
                        currentType={filters.date_type}
                        onChange={(type) => {
                            filters.updateFilters({
                                date: undefined,
                                date_type: type
                            })
                        }}
                        className="flex w-full items-center space-x-2 mb-4 max-sm:flex-col max-sm:hidden"
                    />

                    <EventCalendar
                        filters={filters}
                        onFilterChange={filters.updateFilters}
                        className="bg-white max-sm:hidden"
                    />
                </div>
            </div>
        </div>
    );
}


{/* <ol className="relative border-s border-[#808080] border-opacity-25 w-full overflow-y-auto"> */}
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
        {loadingState.loading
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
    {/* <div className="hidden sm:block">
        {loadingState.loading
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
</ol> */}

// h-[calc(100vh-8rem)]
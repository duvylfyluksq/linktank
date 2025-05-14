import { useEventFilters } from "@/hooks/useEventFilters";
import { useEffect, useState, useRef } from "react";
import EventTypeSelector from "./EventTypeSelector";
import { EventCalendar } from "./EventCalendar";
import EventFiltersDialog from "@/app/(event-listings)/EventFiltersDialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { Timeline } from "@/app/(event-listings)/timeline";
import NoEvents from "@/components/NoEvents";
import CalendarModal from "./CalendarModal";

interface EventListingsProps {
    Header: (filters: EventFilter) => React.ReactNode;
    filters: ReturnType<typeof useEventFilters>;
    events: EventModel[];
    loadingState: { loading: boolean };
    fetchingState?: { fetching: boolean };
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
    hasMoreRef,
}: EventListingsProps) {
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
                if (
                    entry.isIntersecting &&
                    !loadingState.loading &&
                    !isFetchingRef.current &&
                    hasMoreRef?.current
                ) {
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
            const isUpcoming =
                selected >=
                new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const dateType = isUpcoming ? "upcoming" : "past";
            filters.updateFilters("date_type", dateType);
        }
    }, [filters.date]);

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    // const [selectedCities, setSelectedCities] = useState<City[]>([])

    return (

        <div className="mt-6 sm:mt-[3.75rem] flex flex-col gap-[2.25rem] w-full sm:w-[69.1875rem] pb-[2rem] sm:px-0 px-4">
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-[1.46rem] sm:gap-0">
                <div className="flex gap-2.5 sm:hidden w-full">
                    <EventTypeSelector
                        currentType={filters.date_type}
                        onChange={(type) => {
                            filters.updateFilters({
                                date: undefined,
                                date_type: type,
                            });
                        }}
                    />
                </div>
                <div className="flex flex-row items-center justify-between sm:justify-normal gap-2 max-sm:w-full">
                    {Header(filters)}
                    <CalendarModal filters={filters}/>
                </div>

                <div className="flex gap-4 items-center h-full w-full sm:w-auto">
                    <Select
                        value={filters.organization_id}
                        onValueChange={(val) =>
                            filters.updateFilters("organization_id", val)
                        }
                    >
                        <SelectTrigger className="w-[15.625rem] h-[3.125rem] bg-white rounded-[0.75rem] max-sm:w-full">
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
                        className="bg-[#1C2329] hover:bg-[#0e3b69] rounded-[0.74969rem] h-[3.125rem] text-white px-[0.81rem] w-fit sm:w-full max-sm:h-11"
                        onClick={() => setIsFiltersOpen(true)}
                    >
                        <SlidersHorizontal size={20} />
                        <span className="text-[0.8125rem] sm:text-[1rem]">
                            Filters
                        </span>
                    </Button>
                    <EventFiltersDialog
                        open={isFiltersOpen}
                        onOpenChange={setIsFiltersOpen}
                        selectedType={filters.location_type}
                        // initialSelectedCities={selectedCities}
                        onApply={(type) => {
                            filters.updateFilters("location_type", type)
                            // if (cities) {
                            //     setSelectedCities(cities)
                            //     filters.updateFilters(
                            //         "locations",
                            //         cities.map((c) => c._id),
                            //     )
                            // }
                            }}
                            onClear={() => {
                                filters.updateFilters("location_type", "all")
                                // setSelectedCities([])
                                // filters.updateFilters("locations", [])
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-row w-full gap-[1.625rem] min-h-screen relative">
                <div className="flex-1 sm:pr-4">
                {events.length > 0 || loadingState.loading ? (
                <>
                    <Timeline events={events} loading={loadingState.loading} />
                        {fetchingState?.fetching && (
                        <div className="flex justify-center items-center py-4">
                            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        </div>
                        )}
                    <div className="h-1" ref={sentinelRef} />
                </>
                ) : (
                    <NoEvents
                        imageUrl="/no-results.svg"
                        text="No Events Found"
                    />
                )}
                </div>

                <div className="h-auto max-sm:mt-4 flex-shrink-0 sticky top-[9rem] self-start max-sm:hidden">
                    <EventTypeSelector
                        currentType={filters.date_type}
                        onChange={(type) => {
                            filters.updateFilters({
                                date: undefined,
                                date_type: type,
                            });
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

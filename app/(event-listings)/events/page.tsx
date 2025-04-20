"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import EventListings from "../EventListings";
import { useEventFilters } from "@/hooks/useEventFilters";

export default function Home() {
    const [events, setEvents] = useState<EventModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(true);
    const currentPageRef = useRef(1);
    const loadingState = useMemo(() => ({ loading, setLoading }), [loading]);
    const fetchingState = useMemo(
        () => ({ fetching, setFetching }),
        [fetching]
    );
    const filters = useEventFilters();
    const isLoadingRef = useRef(false);
    const hasMoreRef = useRef(true);

    async function fetchFilteredEvents(
        page: number,
        filters: ReturnType<typeof useEventFilters>
    ): Promise<{ events: EventModel[]; hasMore: boolean }> {
        setFetching(true);
        try {
            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("limit", "10");

            if (filters.organization_id !== "all") {
                params.append("organization", filters.organization_id);
            }

            if (filters.date) {
                params.append("date", filters.date.toISOString());
            }

            filters.locations.forEach((location) => {
                params.append("locations", location);
            });

            if (filters.date_type !== "all") {
                params.append("dateType", filters.date_type);
            }

            if (filters.location_type !== "all") {
                params.append("locationType", filters.location_type);
            }

            const response = await fetch(
                `/api/events/search?${params.toString()}`
            );
            const data = await response.json();

            if (data.success) {
                return { events: data.events, hasMore: data.hasMore };
            } else {
                console.error("Error fetching events:", data.error);
                return { events: [], hasMore: false };
            }
        } catch (error) {
            console.error("Error fetching filtered events:", error);
            return { events: [], hasMore: false };
        } finally {
            setFetching(false);
        }
    }

    const handleLoadNextPage = useCallback(async () => {
        if (isLoadingRef.current || !hasMoreRef.current) return;

        isLoadingRef.current = true;
        const nextPage = currentPageRef.current + 1;

        const { events: newEvents, hasMore } = await fetchFilteredEvents(
            nextPage,
            filters
        );

        hasMoreRef.current = hasMore;

        setEvents((prev) => {
            const combined = [...prev, ...newEvents];
            return combined;
            // implement sliding window later
            // return combined.length > 30
            //     ? combined.slice(combined.length - 30)
            //     : combined;
        });

        currentPageRef.current = nextPage;
        isLoadingRef.current = false;
    }, [filters]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { events: freshEvents, hasMore } =
                    await fetchFilteredEvents(1, filters);
                hasMoreRef.current = hasMore;
                setEvents(freshEvents);
                currentPageRef.current = 1;
            } finally {
                setLoading(false);
            }
        })();
    }, [filters]);

    return (
        <EventListings
            Header={(filters) => (
                <h3 className="text-[1.125rem] sm:text-[2rem] font-jakarta font-extrabold">
                    {filters.date_type === "upcoming"
                        ? "Upcoming Events"
                        : "Past Events"}
                </h3>
            )}
            filters={filters}
            events={events}
            loadingState={loadingState}
            fetchingState={fetchingState}
            onLoadMore={handleLoadNextPage}
            hasMoreRef={hasMoreRef}
        />
    );
}

// requestAnimationFrame(() => {
//     window.scrollBy({ top: -2000, behavior: "auto" });
// });

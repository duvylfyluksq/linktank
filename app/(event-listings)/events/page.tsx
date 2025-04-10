"use client";

import { useEffect, useMemo, useState } from "react";
import EventListings from "../EventListings";
import { useEventFilters } from "@/hooks/useEventFilters";

export default function Home() {
    const [events, setEvents] = useState<EventModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const loadingState = useMemo(() => ({ loading, setLoading }), [loading]);
    const filters = useEventFilters();

    async function fetchFilteredEvents(page: number): Promise<EventModel[]> {
        setLoading(true);
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

            const response = await fetch(`/api/events/search?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                return data.events;
            } else {
                console.error("Error fetching events:", data.error);
                return [];
            }
        } catch (error) {
            console.error("Error fetching filtered events:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }

    const handleLoadNextPage = async () => {
        const nextPage = currentPage + 1;
        const newEvents = await fetchFilteredEvents(nextPage);

        setEvents((prev) => {
            const combined = [...prev, ...newEvents];
            return combined.length > 50
                ? combined.slice(combined.length - 50)
                : combined;
        });

        setCurrentPage(nextPage);
    };

    useEffect(() => {
        (async () => {
            const freshEvents = await fetchFilteredEvents(1);
            setEvents(freshEvents);
            setCurrentPage(1);
        })();
    }, [filters]);

    

    return (
        <EventListings
            Header={(filters)=>(
                <h3 className="text-[2rem] font-jakarta font-extrabold max-sm:text-[18px]">
                    {filters.date_type === "upcoming" ? "Upcoming Events" : "Past Events"}
                </h3>
            )}
            filters={filters}
            events={events}
            loadingState={loadingState}
            onLoadMore={handleLoadNextPage}
        />
    )
}

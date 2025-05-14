"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { EventCard } from "../(event-listings)/EventCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import NoEvents from "@/components/NoEvents";

export default function CMS() {
    const [events, setEvents] = useState<EventModel[]>([]);
    const [fetching, setFetching] = useState(false);

    const isLoadingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const nextPageRef = useRef(1);

    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const fetchPage = useCallback(
        async (page: number) => {
        setFetching(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: "10",
                isApproved: "false",
                isRejected: "false"
            });
            const res = await fetch(`/api/events/search?${params}`);
            const json = await res.json();
            return {
            events: (json.events as EventModel[]) || [],
            hasMore: Boolean(json.hasMore),
            };
        } catch (e) {
            console.error("Fetch error", e);
            return { events: [], hasMore: false };
        } finally {
            setFetching(false);
        }
        },
        []
    );

    const loadNextPage = useCallback(async () => {
        if (isLoadingRef.current || !hasMoreRef.current) return;
        isLoadingRef.current = true;

        const page = nextPageRef.current;
        const { events: newEvents, hasMore } = await fetchPage(page);

        setEvents((prev) => [...prev, ...newEvents]);
        hasMoreRef.current = hasMore;
        nextPageRef.current = page + 1;

        isLoadingRef.current = false;
    }, [fetchPage]);

    useEffect(() => {
        loadNextPage();
    }, [loadNextPage]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        observerRef.current?.disconnect();
        observerRef.current = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
            loadNextPage();
            }
        },
        { rootMargin: "200px" }
        );
        observerRef.current.observe(sentinel);

        return () => {
        observerRef.current?.disconnect();
        };
    }, [loadNextPage]);

    const handleAccept = async (id: string) => {
        await fetch(`/api/events/${id}/accept`, { method: "POST" });
        setEvents((prev) => prev.filter((e) => e._id !== id));
    };

    const handleReject = async (id: string) => {
        await fetch(`/api/events/${id}/reject`, { method: "POST" });
        setEvents((prev) => prev.filter((e) => e._id !== id));
    };

    return (
        <div className="px-[10rem] py-[2rem] flex flex-col gap-4">
            <h1 className="text-2xl font-extrabold text-gray-900">
                Events pending approval
            </h1>
        {events.length > 0 ?
        (events.map((ev) => (
            <div
                key={ev._id}
                className="flex items-center gap-4"
            >
            <EventCard event={ev}/>
            <div className="flex gap-2">
                <Button onClick={() => handleAccept(ev._id)}>Accept</Button>
                <Button
                    variant="destructive"
                    onClick={() => handleReject(ev._id)}
                >
                    Reject
                </Button>
            </div>
            </div>
        )))
        : 
        <>
            <NoEvents
                imageUrl="/no-results.svg"
                text="No Events Found"
            />
        </>
        }
        <div ref={sentinelRef} />

        {fetching && (
            <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            </div>
        )}
        </div>
    );
}

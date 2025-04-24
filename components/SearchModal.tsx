"use client";

import {
    Dialog,
    DialogContent
}
    from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { EventSearchResult } from "./EventSearchResult";
import { SkeletonEventSearchResult } from "./SkeletonEventSearchResult";
import { Loader2 } from "lucide-react";

export default function SearchModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {

    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<EventModel[]>([]);
    const [placeholder, setPlaceholder] = useState<string>("Search for events, organisations and more")
    const [fetching, setFetching] = useState(false);
    const [searching, setSearching] = useState(false);
    const isLoadingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const currentPageRef = useRef(1);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const lastSearchRef = useRef<string>("");
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    async function fetchSearchResults(page: number): Promise<{ events: EventModel[]; hasMore: boolean }> {
        setFetching(true);
        try {
            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("limit", "10");
            params.append("dateType", "upcoming")
            params.append("search", query);

            const response = await fetch(`/api/events/search?${params.toString()}`);
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

    const handleLoadMoreResults = useCallback(async () => {
        if (isLoadingRef.current || !hasMoreRef.current) return;
        isLoadingRef.current = true;

        const nextPage = currentPageRef.current + 1;
        const { events: newResults, hasMore } = await fetchSearchResults(nextPage);

        hasMoreRef.current = hasMore;
        setSearchResults(prev => {
            const combined = [...prev, ...newResults];
            return combined;
            //   return combined.length > 30
            //     ? combined.slice(combined.length - 30)
            //     : combined;
        });

        currentPageRef.current = nextPage;
        isLoadingRef.current = false;
    }, [query]);

    useEffect(() => {
        if (!open) {
            setQuery("");
            setSearchResults([]);
            hasMoreRef.current = true;
            currentPageRef.current = 1;
            isLoadingRef.current = false;
            setFetching(false);
            setSearching(false);
        }
    }, [open]);

    useEffect(() => {
        if (!query.trim()) return;
        const debounceTimer = setTimeout(() => {
            handleSearch();
        }, 1000);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        const scrollContainer = scrollContainerRef.current;

        if (!sentinel || !scrollContainer) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isLoadingRef.current && hasMoreRef.current) {
                    handleLoadMoreResults();
                }
            },
            {
                root: scrollContainer,
                rootMargin: "50px",
                threshold: 0,
            }
        );

        observerRef.current.observe(sentinel);

        return () => {
            observerRef.current?.disconnect();
            observerRef.current = null;
        };
    }, [handleLoadMoreResults, searchResults.length]);



    const handleSearch = async () => {
        const trimmedQuery = query.trim();
        if (trimmedQuery === "" || trimmedQuery === lastSearchRef.current) return;
        lastSearchRef.current = trimmedQuery;
        setSearching(true);
        setPlaceholder("No results found")
        setSearchResults([])
        const { events, hasMore } = await fetchSearchResults(1);
        setSearchResults(events);
        hasMoreRef.current = hasMore;
        currentPageRef.current = 1;
        isLoadingRef.current = false;
        setSearching(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <VisuallyHidden><DialogTitle /></VisuallyHidden>
            <DialogContent
                className="bg-[#f9fdfd] rounded-2xl max-w-md w-[90%] sm:w-full shadow-xl p-0 overflow-hidden gap-0 sm:top-[50%] top-[20%]"
                hideClose={true}
            >
                <div className="w-full border-b rounded-t-2xl">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch();
                        }}
                    >
                        <Input
                            type="text"
                            placeholder="Type here..."
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full px-3 py-6 !border-none !shadow-none !bg-transparent !ring-0 !outline-none focus:!ring-0 focus:!outline-none focus-visible:!ring-0 focus-visible:!outline-none text-lg focus:ring-0 focus:outline-none placeholder:text-gray-400 rounded-none"
                        />
                    </form>
                </div>

                <div
                    className="w-full max-h-[30vh] overflow-y-auto px-3 py-2"
                    ref={scrollContainerRef}
                >
                    {searching ?
                        (
                            <div className="gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <SkeletonEventSearchResult key={i} />
                                ))}
                            </div>
                        )
                        :
                        searchResults.length > 0 ? (
                            <div className="flex flex-col gap-1">
                                {searchResults.map((event) => (
                                    <EventSearchResult key={event._id} event={event} onSelect={() => onOpenChange(false)} />
                                ))}
                                {fetching && (
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                                    </div>
                                )}
                                <div ref={sentinelRef} className="h-1" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center gap-y-2 py-8">
                                <Image
                                    src="/linktank_logo.png"
                                    width={60}
                                    height={60}
                                    alt="Linktank"
                                    className="rounded-full"
                                />
                                <p className="text-[1rem] font-medium text-[#0f2b4f] leading-snug">
                                    {placeholder}
                                </p>
                            </div>
                        )}
                </div>

            </DialogContent>
        </Dialog>

    );
}

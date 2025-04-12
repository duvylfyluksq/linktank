"use client";

import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Timeline } from "@/components/timeline";
import { EventCard } from "@/components/event-card";

export default function PastEvents({ events }: { events: EventModel[] }) {
    const [isMobile, setIsMobile] = useState(false);

    // uh fix
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
                <h2 className="flex items-center justify-center gap-2 text-[32px] font-bold text-[#113663] mb-2">
                    <Calendar className="w-6 h-6" />
                    Past events
                </h2>
                <p className="text-lg text-gray-600">
                    We go directly to the source including think tanks,
                    <br className="hidden sm:inline" /> government institutions,
                    and NGOs.
                </p>
            </div>

            {isMobile ? (
                <div className="flex flex-col gap-4">
                    {events.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            ) : (
                <Timeline events={events} />
            )}
        </div>
    );
}

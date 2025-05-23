import SkeletonCard from "@/app/(event-listings)/SkeletonCard";
import { EventCard } from "@/app/(event-listings)/EventCard";
import { useMemo } from "react";

interface TimelineProps {
    events: EventModel[];
    loading?: boolean;
}

export const Timeline = ({ events, loading }: TimelineProps) => {

    const groupedEvents: Record<string, EventModel[]> = useMemo(() => {
        return events.reduce((acc, event) => {
            const dateKey = new Date(event.date_from).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(event);
            return acc;
        }, {} as Record<string, EventModel[]>);
    }, [events]);

    return (
        <ol className="relative flex-grow sm:pr-5 space-y-0">
            {loading
                ?
                <div className="gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
                : Object.entries(groupedEvents).map(([date, events]) => (
                    <>
                        <li className="hidden w-full items-start sm:flex" >
                            <div className="w-[7rem] flex-shrink-0 text-left flex flex-col">
                                <p className="text-base font-bold whitespace-nowrap">{date}</p>
                                <p className="text-base text-gray-500 whitespace-nowrap">
                                    {new Date(date).toLocaleDateString(undefined, { weekday: "long" })}
                                </p>
                            </div>

                            <div className="relative w-[1rem] flex-shrink-0 flex justify-center self-stretch">
                                <div className="absolute top-0 bottom-0 w-[2px] bg-gray-300" />
                                <div className="w-3 h-3 bg-gray-800 rounded-full border border-white z-10 mt-0" />
                            </div>

                            <div className="flex flex-col flex-1 gap-2 ml-4">
                                {events.map((event) => (
                                    <EventCard key={event._id} event={event} />
                                ))}
                            </div>
                        </li>
                        <li className="flex sm:hidden w-full items-start flex-col">
                            <div className="flex flex-row gap-2"><p className="font-bold text-[#323232] font-jakarta text-lg">{date}</p><p className="font-bold text-[#323232] font-jakarta text-lg opacity-70">{new Date(date).toLocaleDateString(undefined, { weekday: "long" })}</p></div>
                            <div className="flex flex-col w-full my-[1.12rem] gap-4">
                                {events.map((event) => (
                                    <EventCard key={event._id} event={event} />
                                ))}
                            </div>
                        </li>
                    </>
                ))}
        </ol>
    );
};

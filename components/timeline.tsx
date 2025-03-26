import SkeletonCard from "@/app/events/SkeletonCard";
import { EventCard } from "@/components/event-card";

interface TimelineProps {
    events: Event[];
    loading: boolean;
}

export const Timeline = ({ events, loading }: TimelineProps) => {
    const groupedEvents: Record<string, Event[]> = events.reduce(
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

    return (
        <ol className="relative flex-grow pr-20 border-s border-[#808080] border-opacity-25">
            {loading
                ? // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonCard key={i} />
                  ))
                : Object.entries(groupedEvents).map(([date, groupedEvents]) => (
                      <li key={date} className="mb-10 ms-4">
                          <div className="absolute w-3 h-3 bg-gray-800 rounded-full mt-1.5 -start-1.5 border border-white" />
                          <time className="mb-1 text-xl font-semibold leading-none">
                              {date}
                          </time>
                          {groupedEvents.map((event) => (
                              <EventCard event={event} key={event._id} />
                          ))}
                      </li>
                  ))}
        </ol>
    );
};

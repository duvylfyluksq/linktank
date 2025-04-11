import { Calendar } from "lucide-react";
import Link from "next/link";

export const EventSearchResult = ({ event, onSelect }: { event: EventModel; onSelect: () => void;}) => {
    return (
        <Link href={`/events/${event.backlink}`} key={event._id} className="w-full" onClick={onSelect}>
            <div className="flex items-center gap-2 py-1 w-full text-muted-foreground hover:text-foreground hover:bg-gray-100 transition-colors cursor-pointer">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                
                <div className="flex justify-between items-center w-full gap-0">
                    <span className="truncate max-w-[300px] flex-grow min-w-0 text-sm">{event.title}</span>
                    <span className="whitespace-nowrap text-sm flex-shrink-0">
                        {new Date(event.date_from).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        })}
                    </span>
                </div>
            </div>
        </Link>
    );
};

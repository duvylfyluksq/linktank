"use client";
import Link from "next/link";
import Image from "next/image";
import { SaveButton } from "@/components/ui/save-button";
import { MapPin } from "lucide-react";

function removeMediaTags(htmlString: string): string {
    const div = document.createElement("div");
    div.innerHTML = htmlString;

    const mediaTags = [
        "img",
        "video",
        "iframe",
        "audio",
        "source",
        "embed",
        "object",
        "picture",
        "table",
    ];
    mediaTags.forEach((tag) => {
        div.querySelectorAll(tag).forEach((el) => el.remove());
    });

    return div.innerHTML;
}

export const EventCard = ({ event }: { event: EventModel }) => {
    return (
        <Link href={`/events/${event.backlink}`} key={event._id}>
            <div className="border flex border-[#D3D0D0] bg-white mt-6 rounded-2xl py-[1.41rem] px-4 flex-row gap-8 w-full">
                {/* Text container: add min-w-0 to prevent overflow issues */}
                <div className="flex-1 flex flex-col gap-[0.5rem]">
                    <div className="flex items-center opacity-70 font-jakarta text-[0.8rem] md:text-[1rem] font-medium gap-2">
                        {!event.is_date_range && 
                            (<p className="flex-shrink-0">
                                {new Date(event.date_from).toLocaleTimeString(
                                    "en-US",
                                    {
                                        hour: "numeric",
                                        minute: "numeric",
                                    }
                                )}
                            </p>)
                        }
                        <MapPin className="flex-shrink-0" size={16} />
                        <p className="line-clamp-1">{event.location}</p>
                    </div>
                    <h3 className="text-base md:text-lg font-jakarta font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {event.title}
                    </h3>
                    <p className="text-sm md:text-base font-semibold text-black dark:text-gray-400">
                        <span className="font-semibold text-[#1F76F9]">
                            {String(event?.organization?.name) ||
                                "Unknown Host"}
                        </span>
                    </p>
                    {event.brief_description ? (
                        <p className="text-sm md:text-base font-normal text-gray-500 dark:text-gray-400 line-clamp-2">
                            {event.brief_description}
                        </p>
                    ) : (
                        <p
                            className="text-sm md:text-base font-normal text-gray-500 dark:text-gray-400 line-clamp-2"
                            dangerouslySetInnerHTML={{
                                __html: removeMediaTags(event.description),
                            }}
                        ></p>
                    )}
                </div>
                <div className="relative flex-shrink-0">
                    <Image
                        src={
                            event.photo_url ||
                            (event!.organization!.logo_url ??
                                "/linktank_logo.png")
                        }
                        alt={`${event.title} image`}
                        width={150}
                        height={150}
                        className="rounded-lg object-cover w-[80px] h-[80px] md:w-[120px] md:h-[120px]"
                    />
                    <div className="absolute top-2 right-2 max:sm:right-4 max:sm:top-4">
                        <SaveButton
                            eventId={event.backlink}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
};

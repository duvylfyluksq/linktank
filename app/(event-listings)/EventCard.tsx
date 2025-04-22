"use client";
import Link from "next/link";
import Image from "next/image";
import { SaveButton } from "@/components/ui/save-button";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export const EventCard = ({ event }: { event: EventModel }) => {

    const [cleanBriefDescription, setCleanBriefDescription] = useState("");
    useEffect(() => {
        const cleanAndExtract = (htmlString: string) => {
            const div = document.createElement("div");
            div.innerHTML = htmlString;

            const firstP = div.querySelector("p");
            if (firstP) {
                firstP.removeAttribute("class");
                return firstP.innerHTML;
            }
            return "";
        };

        if (!event.brief_description) {
            setCleanBriefDescription(cleanAndExtract(event.description));
        }
    }, [event]);

    return (
        <Link href={`/events/${event.backlink}`} key={event._id} className="w-full">
            <div className="border flex border-[#D3D0D0] bg-white sm:mb-10 rounded-2xl py-[1.41rem] px-4 flex-row gap-8 w-full transition-shadow duration-300 ease-in-out hover:shadow-md hover:shadow-gray-300">
                {/* Text container: add min-w-0 to prevent overflow issues */}
                <div className="flex-1 flex flex-col gap-[0.5rem]">
                    <div className="flex items-center opacity-70 font-jakarta text-[0.8rem] md:text-[1rem] font-medium gap-2">
                        {!event.is_date_range && (
                            <p className="flex-shrink-0">
                                {new Date(event.date_from).toLocaleTimeString(
                                    "en-US",
                                    {
                                        hour: "numeric",
                                        minute: "numeric",
                                    }
                                )}
                            </p>
                        )}
                        {/* {(!!event.is_virtual && !!!event.is_in_person) ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M13.3333 7.50004L17.5 5.83337V14.1667L13.3333 12.5M3.33333 15.4167H12.5C12.9602 15.4167 13.3333 15.0436 13.3333 14.5834V5.41671C13.3333 4.95647 12.9602 4.58337 12.5 4.58337H3.33333C2.8731 4.58337 2.5 4.95647 2.5 5.41671V14.5834C2.5 15.0436 2.8731 15.4167 3.33333 15.4167Z" stroke="#707070" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg> 
                            :  
                            <MapPin className="flex-shrink-0" size={16} />
                        } */}
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
                                __html: cleanBriefDescription,
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
                        <SaveButton eventId={event.backlink} />
                    </div>
                </div>
            </div>
        </Link>
    );
};
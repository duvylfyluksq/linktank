"use client";

import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import { Document } from "mongoose";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EventPage() {
    const [event, setEvent] = useState<any>({
        title: "",
        date_from: "",
        date_to: "",
        url: "",
        ticket_url: "",
        brief_description: "",
        description: "",
        agenda: "",
        speakers: [],
        organization: { name: "" },
        photo_url: "",
        is_virtual: false,
        is_in_person: false,
        location: "",
        address: "",
        room: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        keywords: [],
        contact_name: "",
        contact_phone: "",
        contact_email: "",
    });
    const params = useParams();
    useEffect(() => {
        fetch("/api/events/" + params.id)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setEvent(data.event);
            });
    }, []);

    const displayDate = (date) => {
        console.log(date);
        const dt = new Date(date);
        return dt.toDateString() + ", " + dt.toLocaleTimeString();
    };

    return (
        <div className="flex flex-col items-center justify-center w-full pt-[4.625rem] pb-[6.56rem]">
            <div className="flex flex-col w-[45.875rem] gap-[2.88rem]">
                <div className="">
                    <div className="flex flex-col gap-[1.625rem] w-[42.875rem]">
                        <Image
                            src="/rand.svg"
                            alt="RAND Organization Logo"
                            width={80}
                            height={80}
                            className="h-[5rem] w-[5rem]"
                        />
                        <div className="flex flex-col gap-[1.1875rem]">
                            <div className="flex flex-col gap-[1.25rem]">
                                <div className="gap-[0.5625rem] flex flex-col">
                                    <h6 className="text-[1.125rem] font-semibold leading-[1.92869rem] opacity-70 text-[#323232]">
                                        {event &&
                                            event.keywords &&
                                            event.keywords?.join(", ")}
                                    </h6>
                                    <h1 className="text-[#323232] text-[2.5rem] font-bold">
                                        {event.title}
                                    </h1>
                                </div>
                                <h5 className="text-[#323232] text-[1.125rem] font-medium">
                                    By{" "}
                                    <Link
                                        className="text-[#1F76F9]"
                                        href="/organizations/rand"
                                    >
                                        {event.organization?.name}
                                    </Link>
                                </h5>
                            </div>
                            <Link
                                href={event.ticket_url ?? event.url}
                                className="mb-[1.53rem]"
                                target="_blank"
                            >
                                <Button className="bg-[#1C2329] rounded-[0.74969rem] h-[3.125rem] text-white px-[0.81rem]">
                                    <ExternalLink size={20} />
                                    <span className="text-[1rem]">
                                        Register on website
                                    </span>
                                </Button>
                            </Link>
                        </div>
                        <div className="flex flex-row items-center gap-[1.5rem]">
                            <div className="gap-[0.69rem] flex flex-row items-center">
                                <div className="w-[2.6875rem] h-[2.6875rem] justify-center flex flex-col items-center bg-[#EDFAFF] border-[rgba(91, 100, 105, 0.10)] border-[1px] rounded-[0.33594rem]">
                                    <Calendar
                                        size={30}
                                        className="text-[#727679]"
                                    />
                                </div>
                                <div className="flex flex-col text-[#323232] text-[1.125rem] opacity-70">
                                    <p className="font-semibold">Event Date</p>
                                    <p>
                                        {displayDate(event.date_from)}{" "}
                                        {event.date_to &&
                                            " - " + displayDate(event.date_to)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="gap-[0.69rem] flex flex-row items-center">
                            <div className="w-[2.6875rem] h-[2.6875rem] justify-center flex flex-col items-center bg-[#EDFAFF] border-[rgba(91, 100, 105, 0.10)] border-[1px] rounded-[0.33594rem]">
                                <MapPin size={30} className="text-[#727679]" />
                            </div>
                            <div className="flex flex-col text-[#323232] text-[1.125rem] opacity-70">
                                <p className="font-semibold">{event.address}</p>
                                <p>{event.location}</p>
                            </div>
                        </div>
                        <div className="gap-[0.69rem] flex flex-row items-center">
                            <div className="w-[2.6875rem] h-[2.6875rem] justify-center flex flex-col items-center bg-[#EDFAFF] border-[rgba(91, 100, 105, 0.10)] border-[1px] rounded-[0.33594rem]">
                                <Users size={30} className="text-[#727679]" />
                            </div>
                            <div className="flex flex-col text-[#323232] text-[1.125rem] opacity-70">
                                <p className="font-semibold">Speakers</p>
                                <p>
                                    {event.speakers
                                        ?.map((speaker) => speaker.name)
                                        .join(", ")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-[2.625rem]">
                    {event.photo_url && (
                        <div className="h-[26.3125rem] w-full rounded-[1.4375rem]">
                            <Image
                                src={event.photo_url || "/globe.svg"}
                                alt="Event Image"
                                width={8000}
                                height={8000}
                                className="h-full object-cover w-full rounded-[1.4375rem]"
                            />
                        </div>
                    )}
                    <div className="flex flex-col gap-[0.75rem]">
                        <h3 className="text-[#323232] font-extrabold leading-[1.92869rem] text-[1.5rem]">
                            About
                        </h3>
                        <p className="opacity-70 text-[#323232] text-[1rem] leading-[127.625%]">
                            {event.description}
                        </p>
                    </div>
                    <div className="flex flex-col gap-[0.75rem]">
                        <h3 className="text-[#323232] font-extrabold leading-[1.92869rem] text-[1.5rem]">
                            Agenda
                        </h3>
                        <p className="opacity-70 text-[#323232] text-[1rem] leading-[127.625%]">
                            {event.agenda}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

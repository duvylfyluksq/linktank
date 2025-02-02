"use client";

import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import mongoose, { Document } from "mongoose";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Event extends Document {
    title: string;
    date_from: string;
    date_to?: string;
    url: string;
    ticket_url?: string;
    brief_description?: string;
    description: string;
    agenda?: string;
    speakers?:
        | {
              name: string;
              title: string;
              photo_url: string;
              url: string;
              twitter: string;
          }[]
        | string[];
    organization?: { name: string };
    photo_url?: string;
    is_virtual?: boolean;
    is_in_person?: boolean;
    location: string;
    address?: string;
    room?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    keywords?: string[];
    contact_name?: string;
    contact_phone?: string;
    contact_email?: string;
}

export default function EventPage() {
    const [date, setDate] = useState<Date | undefined>(() => new Date());
    const [event, setEvent] = useState<Event>({
        room: "",
        state: "",
        zip_code: "",
        _id: "",
        title: "",
        date_from: "",
        date_to: "",
        url: "",
        brief_description: "",
        description: "",
        speakers: [],
        organization: {
            name: "",
        },
        is_virtual: false,
        is_in_person: true,
        location: "",
        address: "",
        city: "",
        country: "",
        keywords: [],
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
                                        {event.keywords?.join(", ")}
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
                                        {new Date(
                                            event.date_from
                                        ).toDateString()}
                                        ,{" "}
                                        {new Date(
                                            event.date_from
                                        ).toLocaleTimeString()}{" "}
                                        {event.date_to && " -" + event.date_to}
                                    </p>
                                </div>
                            </div>
                            <div className="gap-[0.69rem] flex flex-row items-center">
                                <div className="w-[2.6875rem] h-[2.6875rem] justify-center flex flex-col items-center bg-[#EDFAFF] border-[rgba(91, 100, 105, 0.10)] border-[1px] rounded-[0.33594rem]">
                                    <MapPin
                                        size={30}
                                        className="text-[#727679]"
                                    />
                                </div>
                                <div className="flex flex-col text-[#323232] text-[1.125rem] opacity-70">
                                    <p className="font-semibold">
                                        {event.address}
                                    </p>
                                    <p>
                                        {event.city},{" "}
                                        {event.state ? event.state + ", " : ""}
                                        {event.country}
                                    </p>
                                </div>
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
                    <div className="h-[26.3125rem] w-full rounded-[1.4375rem]">
                        <Image
                            src={event.photo_url || "/globe.svg"}
                            alt="Event Image"
                            width={8000}
                            height={8000}
                            className="h-full object-cover w-full rounded-[1.4375rem]"
                        />
                    </div>
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

"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import mongoose, { Document } from "mongoose";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Event extends Document {
    title: string;
    date_from: Date;
    date_to?: Date;
    url: string;
    ticket_url?: string;
    brief_description?: string;
    description: string;
    agenda?: string;
    speakers?: mongoose.Schema.Types.ObjectId[];
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

export default function Home() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        fetch("/api/events")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setEvents(data.events);
            });
    }, []);

    return (
        <div className="mt-[3.75rem] flex flex-col px-[10.4rem] gap-[2.25rem]">
            <div className="w-full flex flex-row justify-between items-center">
                <h3 className="text-[2rem] font-jakarta font-extrabold">
                    Upcoming Events
                </h3>
                <div className="flex flex-row items-center gap-[0.75rem]">
                    <Select>
                        <SelectTrigger className="w-[15.625rem] h-[3.125rem] bg-white rounded-[0.75rem]">
                            <SelectValue placeholder="Anywhere" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectGroup>
                                <SelectLabel>Anywhere</SelectLabel>
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="blueberry">
                                    Blueberry
                                </SelectItem>
                                <SelectItem value="grapes">Grapes</SelectItem>
                                <SelectItem value="pineapple">
                                    Pineapple
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button className="bg-[#1C2329] rounded-[0.74969rem] h-[3.125rem] text-white px-[0.81rem]">
                        <SlidersHorizontal size={20} />
                        <span className="text-[1rem]">Filters (1)</span>
                    </Button>
                </div>
            </div>
            <div className="flex">
                <ol className="relative flex-grow pr-20 border-s border-[#808080] border-opacity-25">
                    {events.map((event, index) => (
                        <li key={index} className="mb-10 ms-4">
                            <div className="absolute w-3 h-3 bg-gray-800 rounded-full mt-1.5 -start-1.5 border border-white"></div>
                            <time className="mb-1 text-xl font-semibold leading-none">
                                {new Date(event.date_from).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    }
                                )}
                            </time>
                            <div className="border flex border-[#D3D0D0] bg-white mt-6 rounded-2xl pl-[1.37rem] pr-[0.88rem] py-[1.41rem] w-full">
                                <div className="flex-1 flex flex-col gap-[0.5rem]">
                                    <div className="flex items-center opacity-70 font-jakarta text-[#323232] text-[1rem] font-medium gap-[1.25rem]">
                                        <p>
                                            {new Date(
                                                event.date_from
                                            ).toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "numeric",
                                            })}{" "}
                                        </p>
                                        <div className="flex flex-row items-center gap-[0.12rem]">
                                            <MapPin size={20} />{" "}
                                            <p>{event.location}</p>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-jakarta font-semibold text-gray-900 dark:text-white line-clamp-1">
                                        {event.title}
                                    </h3>
                                    <p className="text-base font-semibold text-black dark:text-gray-400">
                                        By{" "}
                                        <span className="font-semibold text-[#1F76F9]">
                                            {String(
                                                event?.organization?.name
                                            ) || "Unknown Host"}
                                        </span>
                                    </p>
                                    <p className=" pr-10 text-base font-normal text-gray-500 dark:text-gray-400 line-clamp-2">
                                        {event.description}
                                    </p>
                                </div>

                                <img
                                    src={event.photo_url || "/globe.svg"}
                                    alt={`${event.title} image`}
                                    className="rounded-[0.9375rem] h-[9.5625rem] w-auto aspect-square object-cover"
                                />
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="h-auto">
                    <div className="flex w-full items-center space-x-2 mb-4">
                        <Button
                            variant={
                                date && date >= new Date()
                                    ? "default"
                                    : "secondary"
                            }
                            onClick={() => setDate(new Date())}
                            className="rounded-[0.75rem] w-[70%] h-[3.125rem] font-medium"
                        >
                            Upcoming
                        </Button>
                        <Button
                            variant={
                                date && date < new Date()
                                    ? "default"
                                    : "secondary"
                            }
                            onClick={() => {
                                const pastDate = new Date();
                                pastDate.setMonth(pastDate.getMonth() - 1);
                                setDate(pastDate);
                            }}
                            className="rounded-[0.75rem] w-[30%] h-[3.125rem] font-medium"
                        >
                            Past
                        </Button>
                    </div>

                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border border-black border-opacity-25 bg-white"
                    />
                </div>
            </div>
            {/* )} */}
        </div>
    );
}

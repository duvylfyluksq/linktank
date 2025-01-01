"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import mongoose, { Document, Schema } from "mongoose";

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
    organization?: mongoose.Schema.Types.ObjectId;
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
    const [hasUploadedCSV, setHasUploadedCSV] = useState(false);

    // const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (!file) return;

    //     Papa.parse(file, {
    //         header: true, // Use the header row to map fields
    //         skipEmptyLines: true, // Skip empty lines
    //         complete: (results: Papa.ParseResult<unknown>) => {
    //             const parsedEvents = results.data
    //                 .filter(
    //                     (row): row is Record<string, string> =>
    //                         typeof row === "object" && row !== null
    //                 )
    //                 .map((row) => {
    //                     // Convert DD/MM/YYYY to YYYY-MM-DD
    //                     const dateParts = (row["Start Date*"] || "").split("/");
    //                     const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    //                     return {
    //                         title: row["Event Ttile*"] || "",
    //                         startDate: formattedDate,
    //                         startTime: row["Start Time*"] || "",
    //                         location:
    //                             row["Location (Country, City, State)*"] || "",
    //                         description: row["Description*"] || "",
    //                         url: row["URL"] || "",
    //                         photoUrl: row["Photo URL"] || "",
    //                         hosts: row["Host(s)/People"] || "",
    //                     };
    //                 })
    //                 .filter((event) => event.title !== ""); // Ensure event has a title

    //             console.log(parsedEvents);
    //             setEvents(parsedEvents);
    //             setHasUploadedCSV(true);
    //         },
    //         error: (error) => {
    //             console.error("Error parsing CSV:", error);
    //         },
    //     });
    // };

    useEffect(() => {
        fetch("/api/events")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setEvents(data.events);
            });
    }, []);

    return (
        <>
            <Navbar />

            <main className="px-56 py-10 relative">
                <h3 className="text-4xl font-bold mb-10">Upcoming Events</h3>

                {/* {!hasUploadedCSV ? (
                    <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded-lg">
                        <Upload className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-lg text-gray-600 mb-4">
                            Upload your events CSV file
                        </p>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleCSVUpload}
                            className="hidden"
                            id="csv-upload"
                            name="csv-upload"
                        />
                        <label
                            htmlFor="csv-upload"
                            className="bg-black rounded-lg text-white p-2 px-8 cursor-pointer"
                        >
                            Select File
                        </label>
                    </div>
                ) : ( */}
                <div className="flex">
                    <ol className="relative flex-grow pr-20 border-s border-gray-800">
                        {events.map((event, index) => (
                            <li key={index} className="mb-10 ms-4">
                                <div className="absolute w-3 h-3 bg-gray-800 rounded-full mt-1.5 -start-1.5 border border-white"></div>
                                <time className="mb-1 text-xl font-semibold leading-none">
                                    {new Date(
                                        event.date_from
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </time>
                                <div className="border flex border-black bg-white mt-6 rounded-2xl p-4 w-full h-60">
                                    <div className="flex-1">
                                        <p className="flex items-center text-gray-500 mb-2">
                                            {new Date(
                                                event.date_from
                                            ).toLocaleTimeString()}{" "}
                                            <span className="mx-3"></span>
                                            <MapPin size={20} />{" "}
                                            {event.location}
                                        </p>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {event.title}
                                        </h3>
                                        <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                                            by{" "}
                                            <span className="font-semibold">
                                                {event.hosts || "Unknown Host"}
                                            </span>
                                        </p>
                                        <p className="mb-4 pr-10 text-base font-normal text-gray-500 dark:text-gray-400 line-clamp-2">
                                            {event.description}
                                        </p>
                                        <Link
                                            href={event.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            passHref
                                        >
                                            <Button>Learn more</Button>
                                        </Link>
                                    </div>

                                    <img
                                        src={event.photo_url || "/globe.svg"}
                                        alt={`${event.title} image`}
                                        className="rounded-lg h-full w-auto aspect-square object-cover"
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
                                className="rounded-md w-1/2"
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
                                className="rounded-md w-1/2"
                            >
                                Past
                            </Button>
                        </div>

                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border border-black bg-white"
                        />
                    </div>
                </div>
                {/* )} */}
            </main>
        </>
    );
}

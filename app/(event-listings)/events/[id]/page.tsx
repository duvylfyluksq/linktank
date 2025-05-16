"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
    Bookmark,
    Calendar,
    ExternalLink,
    MapPin,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SpeakerCard from "./SpeakerCard";
import { useUser } from "@clerk/nextjs";
import SubscriptionPage from "@/app/(authwall)/authwall";
import { useSavedEvents } from "@/app/contexts/SavedEventsContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const displayDate = (date) => {
    const dt = new Date(date);
    return dt.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
};

const displayTime = (date) => {
    const dt = new Date(date);
    return dt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
    });
};

export default function EventPage() {
    const [event, setEvent] = useState<EventModel | null>(null);
    const [loading, setLoading] = useState(true);
    const { savedEvents, setSavedEvents } = useSavedEvents();
    const params = useParams();
    const [isSaved, setIsSaved] = useState(
        savedEvents.some((event: any) => event.backlink === params.id)
    );
    const [isSaving, setIsSaving] = useState(false);

    const { user, isSignedIn } = useUser();

    useEffect(() => {
        fetch(`/api/events/${params.id}`)
            .then((response) => response.json())
            .then((data) => {
                setEvent(data.event);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching event:", error);
                setLoading(false);
            });
    }, [params.id]);

    useEffect(() => {
        setIsSaved(
            savedEvents.some((event: any) => event.backlink === params.id)
        );
    }, [savedEvents]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    if (!isSignedIn) {
        return <SubscriptionPage />;
    }

    const handleSaveEvent = async () => {
        try {
            setIsSaving(true);
            const res = await fetch(
                `/api/users/${user.id}/saved_events/${params.id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();
            setSavedEvents(data.saved_events);
        } catch (error) {
            console.error("Error saving event:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUnsaveEvent = async () => {
        try {
            setIsSaving(true);
            const res = await fetch(
                `/api/users/${user.id}/saved_events/${params.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await res.json();
            setSavedEvents(data.saved_events);
        } catch (error) {
            console.error("Error removing saved event:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!event) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold text-gray-800">
                    Event not found
                </h2>
                <p className="text-gray-600 mt-2">
                    The event you&nbsp;re looking for doesn&nbsp;t exist or has
                    been removed.
                </p>
                <Link href="/events">
                    <Button className="mt-4">View All Events</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full pt-[2.69rem] sm:pt-[4.625rem] pb-[2.82rem] sm:pb-[6.56rem]">
            <div className="flex flex-col w-full sm:w-[45.875rem] gap-[2.25rem] sm:gap-[2.88rem] px-5 sm:px-0">
                <div className="">
                    <div className="flex flex-col gap-[1.625rem] w-full sm:w-[42.875rem]">
                        <Image
                            src={event.organization?.logo_url || "/rand.svg"}
                            alt="RAND Organization Logo"
                            width={80}
                            height={80}
                            className="sm:h-[5rem] sm:w-[5rem] h-[4.375rem] w-[4.375rem]"
                        />
                        <div className="flex flex-col gap-[1.1875rem]">
                            <div className="flex flex-col gap-[1.25rem]">
                                <div className="gap-[0.5625rem] flex flex-col">
                                    <h6 className="text-[0.8125rem] sm:text-[1.125rem] font-semibold opacity-70 text-[#323232]">
                                        {event &&
                                            event.keywords &&
                                            event.keywords?.join(", ")}
                                    </h6>
                                    <h1 className="text-[#323232] text-[1.25rem] sm:text-[2.5rem] font-bold">
                                        {event.title}
                                    </h1>
                                </div>
                                <h5 className="text-[#323232] text-[1.125rem] font-medium">
                                    By{" "}
                                    <Link
                                        className="text-[#1F76F9]"
                                        href={event.organization.url}
                                    >
                                        {event.organization?.name}
                                    </Link>
                                </h5>
                            </div>
                            <div className="flex flex-row gap-4">
                                <Link
                                    href={event.ticket_url ?? event.url}
                                    className="mb-2 sm:mb-[1.53rem]"
                                    target="_blank"
                                >
                                    <Button className="bg-[#113663] border-[1px] border-[#3F4749] rounded-[0.74969rem] h-[3.125rem] text-white px-[0.81rem]">
                                        <ExternalLink size={20} />
                                        <span className="text-[1rem]">
                                            Register on website
                                        </span>
                                    </Button>
                                </Link>
                                <Button
                                    className="bg-[#1C2329] border-[1px] border-[#3F4749] rounded-[0.74969rem] h-[3.125rem] text-white px-[0.81rem]"
                                    onClick={
                                        isSaved
                                            ? handleUnsaveEvent
                                            : handleSaveEvent
                                    }
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            {isSaved ? (
                                                <Bookmark
                                                    fill="white"
                                                    className="w-4 h-4"
                                                />
                                            ) : (
                                                <Bookmark className="w-4 h-4" />
                                            )}
                                            <span className="text-[1rem]">
                                                {isSaved
                                                    ? "Saved"
                                                    : "Save event"}
                                            </span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex flex-row items-center gap-[1.5rem] w-full">
                                <div className="gap-[0.69rem] flex flex-row items-center">
                                    <div className="flex-shrink-0 w-[2.6875rem] h-[2.6875rem] justify-center flex flex-col items-center bg-[#EDFAFF] border-[rgba(91, 100, 105, 0.10)] border-[1px] rounded-[0.33594rem]">
                                        <Calendar
                                            size={30}
                                            className="text-[#707070]"
                                        />
                                    </div>
                                    <div className="flex flex-col text-[#323232] opacity-70">
                                        <p className="font-semibold text-[0.9375rem] sm:text-[1.125rem]">
                                            {displayDate(event.date_from)}{" "}
                                            {event.date_to &&
                                                " - " +
                                                    displayDate(event.date_to)}
                                        </p>
                                        {!event.is_date_range && (
                                            <p className="text-[0.875rem] sm:text-[1.125rem]">
                                                {displayTime(event.date_from)}{" "}
                                                {event.date_to &&
                                                    " - " +
                                                        displayTime(
                                                            event.date_to
                                                        )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="gap-[0.69rem] flex flex-row items-center w-full">
                                <div className="flex-shrink-0 w-[2.6875rem] h-[2.6875rem] justify-center flex flex-col items-center bg-[#EDFAFF] border-[rgba(91, 100, 105, 0.10)] border-[1px] rounded-[0.33594rem]">
                                    <MapPin
                                        size={30}
                                        className="text-[#707070]"
                                    />
                                </div>
                                <div className="flex flex-col text-[#323232] opacity-70">
                                    <p className="font-semibold text-[0.9375rem] sm:text-[1.125rem]">
                                        {event.address}
                                    </p>
                                    <p className="text-[0.875rem] sm:text-[1.125rem]">
                                        {event.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {event.photo_url && (
                    <div className="flex flex-col gap-[2.625rem]">
                        <div className="h-[19.125rem] sm:h-[26.3125rem] w-full rounded-[1.4375rem]">
                            <img
                                src={event.photo_url || "/globe.svg"}
                                alt="Event Image"
                                width={8000}
                                height={8000}
                                className="h-full object-cover w-full rounded-[1.4375rem]"
                            />
                        </div>
                    </div>
                )}
                {((event.agenda?.length ?? 0) > 0 || (event.speakers?.length ?? 0) > 0) ?
                    <Tabs defaultValue="about">
                        <TabsList className="text-base font-medium p-1 h-[unset] bg-white border-[#E8E8E8] border-[1px]">
                            {event.description && (
                                <TabsTrigger
                                    value="about"
                                    className="data-[state=active]:text-white px-5 py-2 data-[state=active]:bg-[#1C2329]"
                                >
                                    About
                                </TabsTrigger>
                            )}
                            {event.agenda && event.agenda.length > 0 && (
                                <TabsTrigger
                                    value="agenda"
                                    className="data-[state=active]:text-white px-5 py-2 data-[state=active]:bg-[#1C2329]"
                                >
                                    Agenda
                                </TabsTrigger>
                            )}
                            {event.speakers && event.speakers.length > 0 && (
                                <TabsTrigger
                                    value="speakers"
                                    className="data-[state=active]:text-white px-5 py-2 data-[state=active]:bg-[#1C2329]"
                                >
                                    Speakers
                                </TabsTrigger>
                            )}
                        </TabsList>
                        <TabsContent value="about">
                            {/* <div
                                className="prose text-[#323232] text-[0.8125rem] sm:text-[1rem] mt-6 flex flex-col gap-6"
                                dangerouslySetInnerHTML={{
                                    __html: md.render(event.description),
                                }}
                            /> */}
                            <div
                                className="prose text-[#323232] text-[0.8125rem] sm:text-[1rem] mt-6 flex flex-col gap-6"
                            >
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[
                                        rehypeRaw,
                                    ]}
                                >
                                    {event.description}
                                </ReactMarkdown>
                            </div>
                        </TabsContent>
                        <TabsContent value="agenda">
                            <div className="flex flex-col gap-7 w-full mt-6">
                                {event.agenda &&
                                    event.agenda.map((day_agenda, day_index) =>
                                        day_agenda.map(
                                            (agenda_item, item_index) => (
                                                <div key={item_index}>
                                                    <div
                                                        className="flex flex-col gap-4 w-full"
                                                        key={agenda_item.topic}
                                                    >
                                                        <div className="flex flex-col gap-6">
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex flex-row gap-2">
                                                                    {item_index ===
                                                                        0 && (
                                                                        <div className="flex items-center gap-2 text-base text-[#323232] font-jakarta font-medium">
                                                                            <span>
                                                                                {displayDate(
                                                                                    new Date(
                                                                                        new Date(
                                                                                            event.date_from
                                                                                        ).getTime() +
                                                                                            day_index *
                                                                                                86400000
                                                                                    )
                                                                                )}
                                                                            </span>
                                                                            {agenda_item.start_time && (
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="6"
                                                                                    height="6"
                                                                                    viewBox="0 0 6 6"
                                                                                    fill="none"
                                                                                >
                                                                                    <circle
                                                                                        cx="2.63721"
                                                                                        cy="2.86279"
                                                                                        r="2.63721"
                                                                                        fill="#1C2329"
                                                                                    />
                                                                                </svg>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    {agenda_item.start_time && (
                                                                        <p className="text-base text-[#323232] font-jakarta font-medium">
                                                                            {new Date(
                                                                                agenda_item.start_time
                                                                            )?.toLocaleTimeString(
                                                                                "en-US",
                                                                                {
                                                                                    hour: "numeric",
                                                                                    minute: "numeric",
                                                                                }
                                                                            )}
                                                                        </p>
                                                                    )}
                                                                    {agenda_item.end_time && (
                                                                        <p className="text-base text-[#323232] font-jakarta font-medium">
                                                                            {"-"}
                                                                        </p>
                                                                    )}
                                                                    {agenda_item.end_time && (
                                                                        <p className="text-base text-[#323232] font-jakarta font-medium">
                                                                            {new Date(
                                                                                agenda_item.end_time
                                                                            )?.toLocaleTimeString(
                                                                                "en-US",
                                                                                {
                                                                                    hour: "numeric",
                                                                                    minute: "numeric",
                                                                                }
                                                                            )}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <h2 className="font-jakarta text-[#323232] text-2xl font-extrabold">
                                                                    {
                                                                        agenda_item.topic
                                                                    }
                                                                </h2>
                                                            </div>
                                                            {agenda_item.brief_description && (
                                                                <div
                                                                    className="font-jakarta text-[#323232] text-base font-normal"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: agenda_item.brief_description,
                                                                    }}
                                                                ></div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col gap-5">
                                                            {agenda_item.speakers?.map(
                                                                (speaker) =>
                                                                    SpeakerCard({
                                                                        speaker,
                                                                    })
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    )}
                            </div>
                        </TabsContent>
                        <TabsContent value="speakers">
                            <div className="flex flex-col gap-6 w-full mt-6">
                                {event.speakers?.map((speaker) =>
                                    SpeakerCard({ speaker })
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                :
                    <>
                        <h1 className="text-2xl font-extrabold text-gray-900">
                            About
                        </h1>
                        <div
                            className="prose text-[#323232] text-[0.8125rem] sm:text-[1rem] mt-6 flex flex-col gap-6"
                        >
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[
                                    rehypeRaw,
                                ]}
                            >
                                {event.description}
                            </ReactMarkdown>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

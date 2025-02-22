"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Calendar,
	ExternalLink,
	MapPin,
	Mail,
	Phone,
	User,
	Tag,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SpeakerCard from "./SpeakerCard";

const EventDetailItem = ({ icon: Icon, title, content, className = "" }) => {
	if (!content) return null;
	return (
		<div className={`gap-4 flex flex-row items-start ${className}`}>
			<div className="w-11 h-11 shrink-0 justify-center flex flex-col items-center bg-blue-50 border border-gray-100 rounded-lg">
				<Icon size={24} className="text-blue-600" />
			</div>
			<div className="flex flex-col text-gray-800">
				<p className="font-bold text-sm">{title}</p>
				<p className="text-base">{content}</p>
			</div>
		</div>
	);
};
function cleanAgenda(text: string): string {
	// make excess spaces into newline
	return text.replace(/\n\s*\n/g, "\n").trim();
}
export default function EventPage() {
	const [event, setEvent] = useState<Event | null>(null);
	const [loading, setLoading] = useState(true);
	const params = useParams();

	useEffect(() => {
		fetch("/api/events/" + params.id)
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

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (!event) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen">
				<h2 className="text-2xl font-bold text-gray-800">Event not found</h2>
				<p className="text-gray-600 mt-2">
					The event you&nbsp;re looking for doesn&nbsp;t exist or has been
					removed.
				</p>
				<Link href="/events">
					<Button className="mt-4">View All Events</Button>
				</Link>
			</div>
		);
	}

	const formatDate = (date) => {
		if (!date) return "";
		const dt = new Date(date);
		return dt.toLocaleDateString("en-US", {
			weekday: "short",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		});
	};

	const getEventType = () => {
		if (event.is_virtual && event.is_in_person) return "Hybrid Event";
		if (event.is_virtual) return "Virtual Event";
		if (event.is_in_person) return "In-Person Event";
		return "Event";
	};

	const getFullAddress = () => {
		const parts = [
			event.address,
			event.room && `Room ${event.room}`,
			event.city,
			event.state,
			event.zip_code,
			event.country,
		].filter(Boolean);
		return parts.join(", ");
	};

	return (
		<div className="flex flex-col items-center w-full min-h-screen bg-gray-50">
			{/* Hero Section */}
			<div className="w-full bg-white border-b">
				<div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
					<div className="flex flex-col md:flex-row gap-8">
						{/* Left Column */}
						<div className="flex-1">
							<div className="flex flex-col gap-6">
								{/* Event Type & Keywords */}
								<div className="flex flex-wrap gap-2">
									<Badge variant="secondary" className="text-sm">
										{getEventType()}
									</Badge>
									{event.keywords?.map((keyword, index) => (
										<Badge key={index} variant="outline" className="text-sm">
											{keyword}
										</Badge>
									))}
								</div>

								{/* Title & Organization */}
								<div>
									<h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
										{event.title}
									</h1>
									<p className="text-lg text-gray-600">
										By{" "}
										<Link
											href={`/organizations/${event.organization?.id}`}
											className="text-blue-600 hover:underline"
										>
											{event.organization?.name}
										</Link>
									</p>
								</div>

								{/* Action Buttons */}
								<div className="flex flex-wrap gap-4">
									{event.ticket_url && (
										<Link
											href={event.ticket_url}
											target="_blank"
											rel="noreferrer"
										>
											<Button
												size="lg"
												className="bg-blue-600 hover:bg-blue-700"
											>
												<Tag className="mr-2 h-5 w-5" />
												Get Tickets
											</Button>
										</Link>
									)}
									{event.url && (
										<Link href={event.url} target="_blank" rel="noreferrer">
											<Button size="lg" variant="outline">
												<ExternalLink className="mr-2 h-5 w-5" />
												Visit Website
											</Button>
										</Link>
									)}
								</div>
							</div>
						</div>

						{/* Right Column - Event Details */}
						<div className="md:w-1/3">
							<Card>
								<CardContent className="p-6 space-y-6">
									<EventDetailItem
										icon={Calendar}
										title="Date & Time"
										content={
											<>
												<div>
													<b>Starts:</b> {formatDate(event.date_from)}
												</div>
												{event.date_to && (
													<div>
														<b>Ends:</b> {formatDate(event.date_to)}
													</div>
												)}
											</>
										}
									/>

									<EventDetailItem
										icon={MapPin}
										title="Location"
										content={getFullAddress()}
									/>

									{(event.contact_name ||
										event.contact_email ||
										event.contact_phone) && (
										<div className="border-t pt-4">
											<h3 className="font-semibold mb-4">
												Contact Information
											</h3>
											<div className="space-y-4">
												{event.contact_name && (
													<EventDetailItem
														icon={User}
														title="Contact Person"
														content={event.contact_name}
													/>
												)}
												{event.contact_email && (
													<EventDetailItem
														icon={Mail}
														title="Email"
														content={
															<a
																href={`mailto:${event.contact_email}`}
																className="text-blue-600 hover:underline"
															>
																{event.contact_email}
															</a>
														}
													/>
												)}
												{event.contact_phone && (
													<EventDetailItem
														icon={Phone}
														title="Phone"
														content={
															<a
																href={`tel:${event.contact_phone}`}
																className="text-blue-600 hover:underline"
															>
																{event.contact_phone}
															</a>
														}
													/>
												)}
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
				<div className="grid md:grid-cols-3 gap-8">
					{/* Left Column - Main Content */}
					<div className="md:col-span-2 space-y-8">
						{/* Event Image */}
						{event.photo_url && (
							<div className="aspect-video w-full rounded-xl overflow-hidden">
								<img
									src={event.photo_url}
									alt={event.title}
									className="w-full h-full object-cover"
								/>
							</div>
						)}

						{/* Description */}
						{event.description && (
							<section>
								<h2 className="text-2xl font-bold text-gray-900 mb-4">
									About This Event
								</h2>
								<div className="prose max-w-none">
									{/* {event.brief_description && (
                  <p className="text-lg font-medium text-gray-600 mb-4">
                  {event.brief_description}
                  </p>
                  )} */}
									<p className="text-gray-600 whitespace-pre-wrap">
										{event.description}
									</p>
								</div>
							</section>
						)}

						{/* Agenda */}
						{event.agenda && (
							<section>
								<h2 className="text-2xl font-bold text-gray-900 mb-4">
									Event Agenda
								</h2>
								<div className="prose max-w-none">
									{/* Trim and collapse extra whitespace/newlines */}
									<p className="text-gray-600 whitespace-pre-line">
										{cleanAgenda(event.agenda)}
									</p>
								</div>
							</section>
						)}
					</div>

					{/* Right Column - Speakers */}
					<div>
						{event.speakers && event.speakers.length > 0 && (
							<div className="space-y-6">
								<h2 className="text-2xl font-bold text-gray-900">Speakers</h2>
								<div className="space-y-4">
									{event.speakers.map((speaker, index) => (
										<SpeakerCard key={index} speaker={speaker} />
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

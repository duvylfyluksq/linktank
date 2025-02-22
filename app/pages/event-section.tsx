/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Timeline } from "@/components/timeline";

interface Event {
	_id: string;
	date_from: string;
	title: string;
	description: string;
	imageUrl: string;
	url: string;
	organization: {
		name: string;
	};
	location: string;
	backlink: string;
}

export default function PastEvents() {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPastEvents = async () => {
			try {
				const response = await fetch("/api/events/past");
				const data = await response.json();
				if (data.success) {
					const eventsWithDates = data.events.slice(0, 3).map((ev: any) => ({
						...ev,
						date_from: new Date(ev.date_from),
						url: ev.url || ev.backlink || "",
					}));
					setEvents(eventsWithDates);
				}
			} catch (error) {
				console.error("Error fetching past events:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchPastEvents();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			<div className="text-center mb-8">
				<h2 className="flex items-center justify-center gap-2 text-[32px] font-bold text-[#113663] mb-2">
					<Calendar className="w-6 h-6" />
					Past events
				</h2>
				<p className="text-sm text-gray-600">
					We go directly to the source including think tanks,
					<br className="hidden sm:inline" /> government institutions, and NGOs.
				</p>
			</div>

			<Timeline events={events} loading={loading} />
		</div>
	);
}

import Link from "next/link";
import Image from "next/image";
import { SaveButton } from "@/components/ui/save-button";
import { MapPin } from "lucide-react";

interface Event {
	location: string;
	_id: string;
	title: string;
	date_from: Date;
	date_to?: Date;
	url: string;
	ticket_url?: string;
	brief_description?: string;
	description: string;
	agenda?: string;
	speakers?: string[];
	organization?: { name: string };
	photo_url?: string;
	is_virtual?: boolean;
	is_in_person?: boolean;
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
	backlink?: string;
	alrSaved: boolean;
}

export const EventCard = ({ event }: { event: Event }) => {
	return (
		<Link href={`/events/${event.backlink}`} key={event._id}>
			<div className="border flex border-[#D3D0D0] bg-white mt-6 rounded-2xl pl-[1.37rem] pr-[0.88rem] py-[1.41rem] w-full max-sm:w-full max-sm:px-4">
				{/* Text container: add min-w-0 to prevent overflow issues */}
				<div className="flex-1 min-w-0 flex flex-col gap-[0.5rem]">
					<div className="flex items-center opacity-70 font-jakarta text-[0.8rem] md:text-[1rem] font-medium gap-2">
						<p>
							{new Date(event.date_from).toLocaleTimeString("en-US", {
								hour: "numeric",
								minute: "numeric",
							})}
						</p>
						<MapPin className="flex-shrink-0" size={16} />
						<p className="line-clamp-1">{event.location}</p>
					</div>
					<h3 className="text-base md:text-lg font-jakarta font-semibold text-gray-900 dark:text-white line-clamp-1">
						{event.title}
					</h3>
					<p className="text-sm md:text-base font-semibold text-black dark:text-gray-400">
						By{" "}
						<span className="font-semibold text-[#1F76F9]">
							{String(event?.organization?.name) || "Unknown Host"}
						</span>
					</p>
					<p className="pr-10 text-sm md:text-base font-normal text-gray-500 dark:text-gray-400 line-clamp-2">
						{event.description}
					</p>
				</div>
				{/* Image container: prevent shrinking and enforce consistent dimensions */}
				<div className="relative ml-4 flex-shrink-0">
					<Image
						src={event.photo_url || "/linktank_logo.png"}
						alt={`${event.title} image`}
						width={80}
						height={80}
						className="rounded-lg object-cover w-[80px] h-[80px] md:w-[120px] md:h-[120px]"
					/>
					<div className="absolute top-2 right-2 max:sm:right-4 max:sm:top-4">
						<SaveButton eventId={event._id} isSaved={event.alrSaved} />
					</div>
				</div>
			</div>
		</Link>
	);
};

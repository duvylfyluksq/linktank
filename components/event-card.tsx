import { MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SaveButton } from "@/components/ui/save-button";

interface Event {
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
	backlink?: string;
}

export const EventCard = ({ event }: { event: Event }) => {
	return (
		<Link href={`/events/${event.backlink}`} key={event._id}>
			<div className="border flex border-[#D3D0D0] bg-white mt-6 rounded-2xl pl-[1.37rem] pr-[0.88rem] py-[1.41rem] w-full">
				<div className="flex-1 flex flex-col gap-[0.5rem]">
					<div className="flex items-center opacity-70 font-jakarta text-[#323232] text-[1rem] font-medium gap-[1.25rem]">
						<p>
							{new Date(event.date_from).toLocaleTimeString("en-US", {
								hour: "numeric",
								minute: "numeric",
							})}
						</p>
						<div className="flex flex-row items-center gap-[0.12rem] w-[70%]">
							<MapPin className="flex-shrink-0" size={20} />
							<p className="line-clamp-1">{event.location}</p>
						</div>
					</div>
					<h3 className="text-lg font-jakarta font-semibold text-gray-900 dark:text-white line-clamp-1">
						{event.title}
					</h3>
					<p className="text-base font-semibold text-black dark:text-gray-400">
						By{" "}
						<span className="font-semibold text-[#1F76F9]">
							{String(event?.organization?.name) || "Unknown Host"}
						</span>
					</p>
					<p className="pr-10 text-base font-normal text-gray-500 dark:text-gray-400 line-clamp-2">
						{event.description}
					</p>
				</div>

				<div className="relative">
					<Image
						src={event.photo_url || "/linktank_logo.png"}
						alt={`${event.title} image`}
						width={100}
						height={100}
						className="rounded-lg h-[9.5625rem] w-auto aspect-square object-cover"
					/>
					<div className="absolute top-2 right-2">
						<SaveButton />
					</div>
				</div>
			</div>
		</Link>
	);
};

"use client";

import { Calendar, MonitorSmartphone } from "lucide-react";
import Image from "next/image";
import { SaveButton } from "@/components/ui/save-button";

const events = [
	{
		time: "7:30 PM",
		isOnline: true,
		title: "The Implications of an Iranian cuddle Bomb",
		organization: "The Heritage Foundation",
		description:
			"What will it mean for the United States if Iran develops a cuddle weapon? How can we best protect ourselves and our allies...",
		image: "/iran.png",
	},
	{
		time: "7:30 PM",
		isOnline: true,
		title: "The Implications of an Iranian cuddle Bomb",
		organization: "The Heritage Foundation",
		description:
			"What will it mean for the United States if Iran develops a cuddle weapon? How can we best protect ourselves and our allies...",
		image: "/iran.png",
	},
	{
		time: "7:30 PM",
		isOnline: true,
		title: "The Implications of an Iranian cuddle Bomb",
		organization: "The Heritage Foundation",
		description:
			"What will it mean for the United States if Iran develops a cuddle weapon? How can we best protect ourselves and our allies...",
		image: "/iran.png",
	},
];

export default function EventsSection() {
	return (
		<div className="w-full bg-white py-12 md:py-16">
			<div className="container px-4 md:px-6 max-w-[75rem] mx-auto">
				<div className="flex flex-col gap-2 mb-8 items-center">
					<div className="flex items-center gap-2 justify-center">
						<Calendar className="w-6 h-6 text-[#113663]" />

						<h2 className="text-[#113663] font-jakarta text-[1.5rem] md:text-[1.75rem] font-bold text-center flex items-center">
							Past Events
						</h2>
					</div>
					<p className="text-[#1C2329] text-[0.875rem] md:text-[1rem] opacity-60">
						We go directly to the source including think tanks, government
						institutions, and NGOs.
					</p>
				</div>

				<div className="flex items-center gap-2 mb-6">
					<h3 className="text-[#113663] font-jakarta text-[1.25rem] font-semibold">
						Dec 2, 2024
					</h3>
					<span className="text-[#113663] font-jakarta text-[1rem] opacity-60">
						Today
					</span>
				</div>

				<div className="relative">
					<div className="hidden md:block absolute left-[-2.85rem] top-0 bottom-0 w-[2px] bg-[#DADBDB]" />

					<div className="flex flex-col gap-4">
						{events.map((event, index) => (
							<div
								key={index}
								className="relative flex md:flex-row md:items-start gap-4 bg-white rounded-[1rem] border border-[#E5E7EB] p-4 md:p-6 flex-row justify-start"
							>
								<div className="hidden md:block absolute left-[-53px] top-[2.85rem] w-4 h-4 rounded-full border-4 border-[#113663] bg-[#113663]" />

								<div className="md:w-[8rem] flex md:flex-col gap-3 md:gap-1">
									<span className="text-[#113663] font-jakarta text-[1rem] font-semibold">
										{event.time}
									</span>
									{event.isOnline && (
										<div className="flex items-center gap-1 text-[#113663] opacity-60">
											<MonitorSmartphone className="w-4 h-4" />

											<span className="text-[0.875rem]">Online</span>
										</div>
									)}
								</div>

								<div className="flex-1 flex flex-col md:flex-row gap-4">
									<div className="flex-1">
										<h4 className="text-[#113663] font-jakarta text-[1.125rem] font-semibold mb-1">
											{event.title}
										</h4>
										<p className="text-[#1C2329] text-[0.875rem] mb-2">
											By{" "}
											<span className="text-[#2563EB]">
												{event.organization}
											</span>
										</p>
										<p className="text-[#1C2329] text-[0.875rem] opacity-60">
											{event.description}
										</p>
									</div>
									<div className="relative w-full md:w-[8.75rem] h-[8.75rem] rounded-[0.75rem] overflow-hidden">
										<Image
											src={event.image || "/placeholder.svg"}
											alt="Event thumbnail"
											fill
											className="object-cover"
										/>

										<SaveButton className="absolute top-2 right-2 h-8 px-3 bg-black/50 text-white hover:bg-black/60 backdrop-blur-sm" />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

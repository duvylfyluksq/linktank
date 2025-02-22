"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectItem,
} from "@/components/ui/select";

interface Organisation {
	_id: string;
	name: string;
	description: string;
	logoUrl?: string;
	region?: string;
}

const sampleOrganisations: Organisation[] = [
	{
		_id: "1",
		name: "Rand",
		description:
			"RAND is a nonprofit institution that helps improve policy and decisionmaking through research and analysis. RAND focuses on the issues that matter most such ..",
		logoUrl: "/rand.svg",
		region: "europe",
	},
	{
		_id: "2",
		name: "Cato Institute",
		description:
			"RAND is a nonprofit institution that helps improve policy and decisionmaking through research and analysis. RAND focuses on the issues that matter most such ...",
		logoUrl: "/Cato_Institute.svg",
		region: "north-america",
	},
	{
		_id: "3",
		name: "Rand",
		description:
			"RAND is a nonprofit institution that helps improve policy and decisionmaking through research and analysis. RAND focuses on the issues that matter most such ..",
		logoUrl: "/rand.svg",
		region: "europe",
	},
	{
		_id: "4",
		name: "Cato Institute",
		description:
			"RAND is a nonprofit institution that helps improve policy and decisionmaking through research and analysis. RAND focuses on the issues that matter most such ...",
		logoUrl: "/Cato_Institute.svg",
		region: "north-america",
	},
];

export default function Organisations() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedRegion, setSelectedRegion] = useState("all");

	const filteredOrganisations = useMemo(() => {
		return sampleOrganisations.filter((org) => {
			const matchesSearch = org.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesRegion =
				selectedRegion === "all" || org.region === selectedRegion;
			return matchesSearch && matchesRegion;
		});
	}, [searchTerm, selectedRegion]);

	return (
		<div className="flex flex-col items-center w-full min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
				<div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center">
					<div className="w-full">
						<h1 className="text-2xl md:text-4xl font-bold text-[#323232]">
							Organizations Directory
						</h1>
						<p className="mt-2 text-sm md:text-lg text-[#1C2329]">
							Think tanks, research institutions, and policy-focused
							<br />
							organizations worldwide
						</p>
					</div>
					<div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
						<Input
							type="search"
							placeholder="Search organizations..."
							className="w-full md:w-64 rounded-md bg-white h-12"
							onChange={(e) => setSearchTerm(e.target.value)}
							value={searchTerm}
						/>
						<Select
							value={selectedRegion}
							onValueChange={(val) => setSelectedRegion(val)}
						>
							<SelectTrigger className="w-full md:w-64 h-12 bg-white rounded-md">
								<SelectValue placeholder="Anywhere" />
							</SelectTrigger>
							<SelectContent className="bg-white">
								<SelectGroup>
									<SelectLabel>Regions</SelectLabel>
									<SelectItem value="all">Anywhere</SelectItem>
									<SelectItem value="north-america">North America</SelectItem>
									<SelectItem value="europe">Europe</SelectItem>
									<SelectItem value="asia">Asia</SelectItem>
									<SelectItem value="africa">Africa</SelectItem>
									<SelectItem value="south-america">South America</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>
				{filteredOrganisations.length === 0 ? (
					<div className="text-center text-gray-600">
						No organizations found.
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{filteredOrganisations.map((org) => (
							<div
								key={org._id}
								className="border border-[#D3D0D0] bg-white rounded-[10px] shadow-sm
                flex flex-col justify-center items-start
                pr-[40px] pl-[19px] gap-[2px] py-8 w-auto h-auto"
							>
								<div className="flex items-center gap-4">
									{org.logoUrl ? (
										<img
											src={org.logoUrl}
											alt={`${org.name} logo`}
											className="w-14 h-14 object-contain rounded"
										/>
									) : (
										<div className="w-16 h-16 bg-gray-200 rounded" />
									)}
									<h2 className="text-xl font-semibold text-[#323232]">
										{org.name}
									</h2>
								</div>
								<p className="text-[#1C2329] text-sm">{org.description}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

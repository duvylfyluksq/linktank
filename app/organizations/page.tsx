"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
// import {
//     Select,
//     SelectTrigger,
//     SelectValue,
//     SelectContent,
//     SelectGroup,
//     SelectLabel,
//     SelectItem,
// } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";

export default function Organizations() {
    const [searchTerm, setSearchTerm] = useState("");
    // const [selectedRegion, setSelectedRegion] = useState("all");
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [filteredOrganizations, setFilteredOrganizations] = useState<
    Organization[]
    >([]);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    async function fetchOrganizations() {
        const response = await fetch(`/api/organizations`);
        const data = await response.json();
        const organizations = data.organizations;
        setOrganizations(organizations);
        setFilteredOrganizations(organizations);
    }

    useEffect(() => {
        setFilteredOrganizations(
            organizations.filter((org) => {
                const matchesSearch = org.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                // const matchesRegion =
                //     selectedRegion === "all" || org.region === selectedRegion;
                return matchesSearch;
            })
        );
    }, [searchTerm]);

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="w-full md:w-1/2">
                        <h1 className="text-2xl md:text-4xl font-bold text-[#323232]">
                            Organizations Directory
                        </h1>
                        <p className="mt-2 text-sm md:text-lg text-[#1C2329]">
                            Think tanks, research institutions, and
                            policy-focused
                            <br />
                            organizations worldwide
                        </p>
                    </div>
                    <div className="w-full md:w-1/2">
                        <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
                        <Input
                            type="search"
                            placeholder="Search by organization name"
                            className="w-full rounded-md bg-white h-12 pl-10 pr-4"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                        />
                        </div>
                    </div>
                </div>
                {filteredOrganizations.length === 0 ? (
                    <div className="text-center text-gray-600">
                        No organizations found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {filteredOrganizations.map((org) => (
                            <Link href={org.url} key={org._id} target="_blank" rel="noopener noreferrer">
                                <div
                                    key={org._id}
                                    className="border border-[#D3D0D0] bg-white rounded-[10px] shadow-sm
                    flex flex-col justify-center items-start
                    pr-[40px] pl-[19px] py-8 w-auto h-auto gap-[0.5rem]"
                                >
                                    <div className="flex items-center gap-4">
                                            {org.logo_url ? (
                                                <div className="w-20 h-16 bg-gray-200 rounded flex flex-col items-center justify-center flex-shrink-0">
                                                    <Image
                                                        src={org.logo_url}
                                                        alt={`${org.name} logo`}
                                                        width={100}
                                                        height={100}
                                                        className="w-auto h-14 object-contain rounded"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded" />
                                            )}
                                            <h2 className="text-xl font-semibold text-[#323232]">
                                                {org.name}
                                            </h2>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
    {/* <Select
        value={selectedRegion}
        onValueChange={(val) => setSelectedRegion(val)}
    >
        <SelectTrigger className="w-full md:w-64 h-12 bg-white rounded-md">
            <SelectValue placeholder="Anywhere" />
        </SelectTrigger>
        <SelectContent className="bg-white">
            <SelectGroup>
                <SelectLabel>Regions</SelectLabel>
                <SelectItem value="all">
                    Anywhere
                </SelectItem>
                <SelectItem value="north-america">
                    North America
                </SelectItem>
                <SelectItem value="europe">
                    Europe
                </SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="africa">
                    Africa
                </SelectItem>
                <SelectItem value="south-america">
                    South America
                </SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select> */}
}

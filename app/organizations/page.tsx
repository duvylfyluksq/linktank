"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import OrganizationCard from "./OrganizationCard";
import OrganizationSkeleton from "./OrganizationSkeleton";

export default function Organizations() {
    const [searchTerm, setSearchTerm] = useState("");
    const [fetching, setFetching] = useState(true);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            setFetching(true);
            await fetchOrganizations();
          } catch (error) {
            console.error("Error fetching organizations:", error);
          } finally {
            setFetching(false);
          }
        };
        fetchData();
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
                {fetching ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                        <OrganizationSkeleton key={i} />
                        ))}
                    </div>
                ) :
                filteredOrganizations.length === 0 ? (
                    <div className="text-center text-gray-600">
                        No organizations found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {filteredOrganizations.map((org) => (
                            <OrganizationCard org={org} key={org._id}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

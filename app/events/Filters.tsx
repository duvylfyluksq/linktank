"use client";

import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Filters({
    activeFilters,
    filters,
    onFilterChangeAction,
    clearAllFiltersAction,
}: {
    activeFilters: string[];
    filters: {
        dateRange: {
            from: Date | undefined;
            to: Date | undefined;
        };
        locations: string[];
        eventType: "upcoming" | "past" | "all";
    };
    onFilterChangeAction: (filterType: string, value: any) => void;
    clearAllFiltersAction: () => void;
}) {
    const availableLocations = [
        { id: "ny", name: "New York" },
        { id: "dc", name: "Washington D.C." },
        { id: "sf", name: "San Francisco" },
        { id: "chi", name: "Chicago" },
        { id: "la", name: "Los Angeles" },
        { id: "bos", name: "Boston" },
        { id: "virtual", name: "Virtual" },
    ];

    const handleFilterChange = (filterType: string, value: any) => {
        onFilterChangeAction(filterType, value);
    };
    return (
        <div className="flex flex-row items-center gap-[0.75rem] max-sm:w-full max-sm:mt-2">
            {/* All filters button */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="bg-[#1C2329] rounded-[0.74969rem] h-[3.125rem] text-white px-[0.81rem] max-sm:w-full max-sm:h-11">
                        <SlidersHorizontal size={20} />
                        <span className="text-[1rem]">
                            Filters{" "}
                            {activeFilters.length > 0
                                ? `(${activeFilters.length})`
                                : ""}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-4">
                    <div className="space-y-4">
                        {activeFilters.length > 0 && (
                            <div className="flex justify-between items-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAllFiltersAction}
                                    className="h-auto p-0 text-sm text-gray-500"
                                >
                                    Clear all
                                </Button>
                            </div>
                        )}

                        {/* Event type section */}
                        <div>
                            <h5 className="font-medium mb-2">Event Type</h5>
                            <div className="flex space-x-2">
                                <Button
                                    variant={
                                        filters.eventType === "all"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                        handleFilterChange("eventType", "all")
                                    }
                                >
                                    All
                                </Button>
                                <Button
                                    variant={
                                        filters.eventType === "upcoming"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                        handleFilterChange(
                                            "eventType",
                                            "upcoming"
                                        )
                                    }
                                >
                                    Upcoming
                                </Button>
                                <Button
                                    variant={
                                        filters.eventType === "past"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                        handleFilterChange("eventType", "past")
                                    }
                                >
                                    Past
                                </Button>
                            </div>
                        </div>

                        {/* Locations section */}
                        <div>
                            <h5 className="font-medium mb-2">Locations</h5>
                            <div className="grid grid-cols-2 gap-2">
                                {availableLocations.map((location) => (
                                    <div
                                        className="flex items-center space-x-2"
                                        key={location.id}
                                    >
                                        <Checkbox
                                            id={`filter-location-${location.id}`}
                                            checked={filters.locations.includes(
                                                location.id
                                            )}
                                            onCheckedChange={() =>
                                                handleFilterChange(
                                                    "location",
                                                    location.id
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor={`filter-location-${location.id}`}
                                        >
                                            {location.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

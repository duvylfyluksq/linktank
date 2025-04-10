"use client";

// import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
// import { CalendarIcon } from "lucide-react";
// import { useState } from "react";

interface EventCalendarProps {
    filters: EventFilter;
    onFilterChange: <K extends keyof EventFilter>(key: K, value: EventFilter[K]) => void;
    className?: string;
}

export function EventCalendar({
    className = "",
    filters,
    onFilterChange,
}: EventCalendarProps) {
    // const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);

    return (
        <div className={`rounded-2xl border border-[#D3D0D0] ${className}`}>
            {/* <div className="absolute right-4 top-2 sm:hidden">
                <Button
                    variant="outline"
                    onClick={() => setMobileCalendarOpen(true)}
                    className="p-2"
                >
                    <CalendarIcon size={20} />
                </Button>
            </div>

            {mobileCalendarOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black backdrop-blur-sm bg-opacity-50 z-50 sm:hidden">
                    <div className="bg-white p-4 rounded-md">
                        <Calendar
                            mode="range"
                            selected={{
                                from: filters.date_range.from,
                                to: filters.date_range.to,
                            }}
                            onSelect={(range) =>
                                onFilterChange("dateRange", {
                                    from: range?.from,
                                    to: range?.to,
                                })
                            }
                            initialFocus
                        />
                        <Button
                            onClick={() => setMobileCalendarOpen(false)}
                            className="mt-2 w-full"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )} */}

            <Calendar
                mode="single"
                selected={filters.date}
                onSelect={(date) =>
                    onFilterChange("date", date)
                }
                initialFocus
            />
        </div>
    );
}

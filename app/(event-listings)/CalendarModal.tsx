"use client";

import { CalendarIcon } from "lucide-react";
import { EventCalendar } from "./EventCalendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useEventFilters } from "@/hooks/useEventFilters";

export default function CalendarModal({filters}: {filters: ReturnType<typeof useEventFilters>;}){
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    return(
        <>
            <CalendarIcon className="w-5 h-5 text-gray-500 sm:hidden" onClick={() => setIsCalendarOpen(!isCalendarOpen)} />
            <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <DialogContent 
                    className="
                        !p-0
                        !bg-transparent
                        !shadow-none
                        w-auto
                        rounded-2xl
                    " 
                    hideClose={true}
                >
                    <div className="rounded-2xl">
                        <EventCalendar
                            filters={filters}
                            onFilterChange={filters.updateFilters}
                            className="bg-white"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
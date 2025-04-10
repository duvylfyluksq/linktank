"use client";

import { Button } from "@/components/ui/button";

export type EventDateType = "upcoming" | "past" | "all";

interface EventTypeSelectorProps {
    currentType: EventDateType;
    onChange: (type: EventDateType) => void;
    className?: string;
}

export default function EventTypeSelector({
    currentType,
    onChange,
    className = "",
}: EventTypeSelectorProps) {
    return (
        <div className={`inline-flex items-center gap-1 ${className}`}>
            <Button
                variant={currentType === "upcoming" ? "default" : "secondary"}
                onClick={() => onChange("upcoming")}
                className="rounded-[0.75rem] font-medium w-[7.5rem] text-sm"
            >
                Upcoming
            </Button>
            <Button
                variant={currentType === "past" ? "default" : "secondary"}
                onClick={() => onChange("past")}
                className="rounded-[0.75rem] font-medium w-[7.5rem] text-sm"
            >
                Past
            </Button>
        </div>
    );
}

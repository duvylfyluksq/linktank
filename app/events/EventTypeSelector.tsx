"use client";

import { Button } from "@/components/ui/button";

interface EventTypeSelectorProps {
    currentType: string;
    onChange: (type: "upcoming" | "past" | "all") => void;
    className?: string;
}

export function EventTypeSelector({
    currentType,
    onChange,
    className = "",
}: EventTypeSelectorProps) {
    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <Button
                variant={currentType === "upcoming" ? "default" : "secondary"}
                onClick={() => onChange("upcoming")}
                className="rounded-[0.75rem] font-medium"
            >
                Upcoming
            </Button>
            <Button
                variant={currentType === "past" ? "default" : "secondary"}
                onClick={() => onChange("past")}
                className="rounded-[0.75rem] font-medium"
            >
                Past
            </Button>
        </div>
    );
}

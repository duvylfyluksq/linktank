"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FiltersDisplayProps {
    activeFilters: string[];
    onRemoveFilter: (filter: string) => void;
    onClearAllFilters: () => void;
}

export function FiltersDisplay({
    activeFilters,
    onRemoveFilter,
    onClearAllFilters,
}: FiltersDisplayProps) {
    if (activeFilters.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="px-3 py-1">
                    {filter}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-2"
                        onClick={() => onRemoveFilter(filter)}
                    >
                        <X size={14} />
                    </Button>
                </Badge>
            ))}
            <Button
                variant="ghost"
                size="sm"
                className="text-sm text-gray-500"
                onClick={onClearAllFilters}
            >
                Clear all
            </Button>
        </div>
    );
}

"use client";

import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import debounce from "lodash/debounce";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function SearchBar({ value, onChange, className = "" }: SearchBarProps) {
    // Debounced search function to prevent too many API calls
    const debouncedSearch = debounce((searchTerm: string) => {
        onChange(searchTerm);
    }, 300);

    const handleSearch = (value: string) => {
        debouncedSearch(value.trim());
    };

    // Clean up debounce on component unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, []);

    return (
        <Input
            type="search"
            placeholder="Search..."
            className={`md:w-[10rem] rounded-[0.75rem] mr-3 bg-white h-[3.125rem] ${className}`}
            onChange={(e) => handleSearch(e.target.value)}
            value={value}
        />
    );
}

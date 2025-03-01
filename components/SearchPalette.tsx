"use client";

import { Command } from "cmdk";
import { useState } from "react";

export default function SearchPalette() {
    const [open, setOpen] = useState(false);

    return (
        <Command.Dialog open={open} onOpenChange={setOpen}>
            <Command.Input placeholder="Search..." />

            <Command.List>
                <Command.Loading>Loading...</Command.Loading>
                <Command.Empty>No results found.</Command.Empty>

                <Command.Group heading="Navigation">
                    <Command.Item>Events</Command.Item>
                    <Command.Item>My Calendars</Command.Item>
                    <Command.Item>Organizations</Command.Item>
                </Command.Group>

                <Command.Group heading="Actions">
                    <Command.Item>Search</Command.Item>
                    <Command.Item>Create Event</Command.Item>
                </Command.Group>
            </Command.List>
        </Command.Dialog>
    );
}

"use client";

import { Command } from "cmdk";
import { useState } from "react";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, ChevronRight, HelpCircle, Search } from "lucide-react";

export default function SearchPalette() {
    const [open, setOpen] = useState(false);
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            <div className="flex justify-center items-center">
                <button
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center justify-between sm:w-64 w-32 max-w-xs r rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    <div className="flex items-center h-full">
                        <Search className="mr-2 h-4 w-4" />
                        <span>Search</span>
                    </div>
                    <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>
            </div>

            <Command.Dialog
                open={open}
                onOpenChange={setOpen}
                label="Global Command Menu"
                title="Search Palette"
                className="fixed inset-0 z-50 bg-white/10 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                overlayClassName="fixed inset-0 z-50 backdrop-blur-sm cursor-pointer"
            >
                <div className="flex justify-center items-center h-screen w-screen" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setOpen(false);
                    }
                }}>
                    <div className="w-[500px] border-2 border-gray-600 bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center px-4 border-b border-zinc-200">
                            <div className="flex items-center mr-2 text-zinc-500">
                                <Search className="h-4 w-4" />
                            </div>
                            <Command.Input
                                placeholder="Type a command or search..."
                                className="h-14 w-full border-none bg-transparent px-2 py-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 focus:ring-0 focus:ring-offset-0"
                            />
                            <Badge
                                variant="outline"
                                className="hidden md:flex items-center gap-1 px-2 py-1 text-xs text-zinc-500"
                            >
                                Esc
                            </Badge>
                        </div>

                        <Command.List className="max-h-[350px] overflow-y-auto overflow-x-hidden py-2 scrollbar-thin scrollbar-thumb-zinc-200">
                            <Command.Empty className="py-6 text-center text-sm text-zinc-500 flex flex-col items-center">
                                <AlertCircle className="h-10 w-10 mb-2 text-zinc-300" />
                                <span>No results found.</span>
                            </Command.Empty>

                            <Command.Group
                                heading="Suggestions"
                                className="px-3 py-3 text-xs font-semibold text-zinc-600"
                            >
                                <Command.Item className="relative flex cursor-pointer select-none items-center rounded-md px-3 py-2.5 text-sm text-zinc-500 outline-none transition-colors hover:bg-zinc-100 aria-selected:bg-blue-100 aria-selected:text-black data-[disabled]:pointer-events-none">
                                    <Avatar className="mr-2 h-6 w-6">
                                        <AvatarFallback className="bg-zinc-100 text-xs">
                                            C
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>Calendar</span>
                                </Command.Item>
                                <Command.Item className="relative flex cursor-pointer select-none items-center rounded-md px-3 py-2.5 text-sm text-zinc-500 outline-none transition-colors hover:bg-zinc-100 aria-selected:bg-blue-100 aria-selected:text-black data-[disabled]:pointer-events-none">
                                    <Avatar className="mr-2 h-6 w-6">
                                        <AvatarFallback className="bg-zinc-100 text-xs">
                                            E
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>Search Emoji</span>
                                    <ChevronRight className="ml-auto h-4 w-4 text-zinc-400" />
                                </Command.Item>
                                <Command.Item className="relative flex cursor-pointer select-none items-center rounded-md px-3 py-2.5 text-sm text-zinc-500 outline-none transition-colors hover:bg-zinc-100 aria-selected:bg-blue-100 aria-selected:text-black data-[disabled]:pointer-events-none">
                                    <Avatar className="mr-2 h-6 w-6">
                                        <AvatarFallback className="bg-zinc-100 text-xs">
                                            C
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>Calculator</span>
                                </Command.Item>
                            </Command.Group>

                            <Separator className="mx-2 my-2" />

                            <Command.Group
                                heading="Settings"
                                className="mt-2 px-3 py-2 text-xs font-semibold text-zinc-600"
                            >
                                <Command.Item className="relative flex cursor-pointer select-none items-center rounded-md px-3 py-2.5 text-sm text-zinc-500 outline-none transition-colors hover:bg-zinc-100 aria-selected:bg-blue-100 aria-selected:text-black data-[disabled]:pointer-events-none">
                                    <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                                        <Avatar className="h-5 w-5">
                                            <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
                                                P
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <span>Profile</span>
                                </Command.Item>
                                <Command.Item className="relative flex cursor-pointer select-none items-center rounded-md px-3 py-2.5 text-sm text-zinc-500 outline-none transition-colors hover:bg-zinc-100 aria-selected:bg-blue-100 aria-selected:text-black data-[disabled]:pointer-events-none">
                                    <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-md bg-green-100 text-green-700">
                                        <Avatar className="h-5 w-5">
                                            <AvatarFallback className="bg-green-100 text-xs text-green-700">
                                                B
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <span>Billing</span>
                                </Command.Item>
                                <Command.Item className="relative flex cursor-pointer select-none items-center rounded-md px-3 py-2.5 text-sm text-zinc-500 outline-none transition-colors hover:bg-zinc-100 aria-selected:bg-blue-100 aria-selected:text-black data-[disabled]:pointer-events-none">
                                    <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                                        <Avatar className="h-5 w-5">
                                            <AvatarFallback className="bg-gray-100 text-xs text-gray-700">
                                                S
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <span>Settings</span>
                                    <Switch className="ml-auto" />
                                </Command.Item>
                            </Command.Group>
                        </Command.List>

                        <Card className="border-t border-zinc-200 rounded-none px-4 py-3">
                            <CardContent className="p-0 flex items-center justify-between text-xs text-zinc-500">
                                <div className="flex items-center">
                                    <span>Navigate</span>
                                    <div className="flex mx-1 space-x-1">
                                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                            <span className="text-xs">↑</span>
                                        </kbd>
                                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                            <span className="text-xs">↓</span>
                                        </kbd>
                                    </div>
                                </div>
                                <Separator
                                    orientation="vertical"
                                    className="h-4 mx-2"
                                />
                                <div className="flex items-center">
                                    <span>Select</span>
                                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                        <span className="text-xs">Enter</span>
                                    </kbd>
                                </div>
                                <Separator
                                    orientation="vertical"
                                    className="h-4 mx-2"
                                />
                                <div className="flex items-center">
                                    <HelpCircle className="h-3 w-3 mr-1" />
                                    <span>More help</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Command.Dialog>
        </>
    );
}

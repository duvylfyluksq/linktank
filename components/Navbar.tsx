"use client";

import Image from "next/image";

import Link from "next/link";
import {
    SignUpButton,
    SignedIn,
    SignedOut,
    useUser,
    SignOutButton,
} from "@clerk/nextjs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Plus, Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import AccountModal from "./AccountModal";
import SearchModal from "./SearchModal";

const Navbar = () => {
    const { user } = useUser();
    const pathname = usePathname();
    const [accountModalOpen, setAccountModalOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const handleOpenChange = (
        open: boolean,
        setOpen: (val: boolean) => void
    ) => {
        setOpen(open);
        if (!open) {
            setTimeout(() => {
                const active = document.activeElement as HTMLElement;
                if (active) active.blur();
            }, 10);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[4.9375rem] sm:h-[6rem] px-4 sm:px-10 bg-secondaryBlue border-b border-[#323232] border-opacity-15">
            <div className="flex items-center mr-10">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/linktank_logo.png"
                        alt="Linktank"
                        width={100}
                        height={100}
                        className="sm:w-10 sm:h-10 w-[1.7rem] h-[1.7rem] mr-[0.625rem] rounded-full"
                    />
                    <span className="text-[1.39956rem] sm:text-2xl font-bold">
                        Linktank
                    </span>
                </Link>
            </div>

            <div className="flex items-center justify-between w-full">
                <ul className="space-x-8 ml-6 font-medium hidden md:flex">
                    <li>
                        <Link
                            href="/events"
                            className={cn(
                                "text-gray-600 hover:underline",
                                pathname === "/events" && "font-semibold underline"
                            )}
                        >
                            Events
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/mycalendar"
                            className={cn(
                                "text-gray-600 hover:underline",
                                pathname === "/mycalendar" && "font-semibold underline"
                            )}
                        >
                            My calendar
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/organizations"
                            className={cn(
                                "text-gray-600 hover:underline",
                                pathname === "/organizations" && "font-semibold underline"
                            )}
                        >
                            Organizations
                        </Link>
                    </li>
                </ul>

                <div className="flex items-center gap-x-6 ml-auto">
                    <button
                        className="flex items-center text-gray-700 hover:text-black gap-x-2"
                        onClick={() => setSearchOpen(true)}
                    >
                        <Search className="w-5 h-5 text-inherit" />
                        <span className="hidden md:flex">Search</span>
                    </button>

                    <button className="items-center text-gray-700 hover:text-black gap-x-2 hidden md:flex">
                        <Plus className="w-5 h-5 text-inherit" />
                        <span>Create an event</span>
                    </button>

                    <SignedOut>
                        <SignUpButton>
                            <Button className="px-[1.16rem] sm:px-10 py-5 sm:py-6 text-[0.875rem] sm:text-base rounded-xl text-white bg-[#1C2329] hover:bg-[#0e3b69]">
                                Sign Up
                            </Button>
                        </SignUpButton>
                    </SignedOut>

                    <SignedIn>
                        {!accountModalOpen && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-x-2 text-black shadow-none px-3 py-2 rounded-md transition-none focus:outline-none">
                                        <img
                                            src={user?.imageUrl || ""}
                                            alt="User avatar"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div className="text-sm leading-tight text-left sm:flex hidden">
                                            <h4 className="text-base text-[#1C2329] font-semibold">
                                                {user?.fullName}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {
                                                    user?.primaryEmailAddress
                                                        ?.emailAddress
                                                }
                                            </p>
                                        </div>
                                        <ChevronDownIcon className="text-[#737272] w-5 h-5 ml-1" />
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    align="start"
                                    sideOffset={0}
                                    alignOffset={4}
                                    className="w-[--radix-dropdown-menu-trigger-width] shadow-md border rounded-md bg-white"
                                >
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setAccountModalOpen(true);
                                        }}
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        My account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer text-red-500 focus:text-red-600"
                                    >
                                        <SignOutButton>
                                            <div className="flex items-center">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Logout
                                            </div>
                                        </SignOutButton>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </SignedIn>
                </div>
            </div>
            <SearchModal
                open={searchOpen}
                onOpenChange={(open) => handleOpenChange(open, setSearchOpen)}
            />
            <AccountModal
                open={accountModalOpen}
                onOpenChange={(open) =>
                    handleOpenChange(open, setAccountModalOpen)
                }
            />
        </nav>
    );
};

export default Navbar;

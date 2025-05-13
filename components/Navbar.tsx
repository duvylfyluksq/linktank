"use client";

import Image from "next/image";

import Link from "next/link";
import {
    SignUpButton,
    SignedIn,
    SignedOut,
    useUser,
} from "@clerk/nextjs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon, Plus, Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import AccountModal from "./AccountModal";
import SearchModal from "./SearchModal";
import LogoutMenuItem from "./LogoutMenuItem";
import SubscriptionBanner from "./SubscriptionBanner";
import { useAccountModal } from "@/app/contexts/AccountModalContext";

const Navbar = ({ onHeightChange }: { onHeightChange: (height: number) => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { user, isLoaded } = useUser();
    const pathname = usePathname();
    const { open, setOpen } = useAccountModal();
    const [searchOpen, setSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    useEffect(() => {
        if (!containerRef.current || !onHeightChange) return;
        const observer = new ResizeObserver(([entry]) => {
            if (entry && entry.contentRect.height) {
                onHeightChange(entry.contentRect.height);
            }
        });
        observer.observe(containerRef.current);
        onHeightChange(containerRef.current.offsetHeight);
        return () => observer.disconnect();
    }, [onHeightChange]);

    return (
        <div ref={containerRef} className="fixed top-0 left-0 right-0 z-50">
            <nav className="flex items-center justify-between h-[4.9375rem] sm:h-[4rem] px-4 sm:px-10 bg-secondaryBlue border-b border-[#323232] border-opacity-15">
                <div className="flex items-center mr-10">
                    <MenuIcon className="w-6 h-6 text-gray-500 lg:hidden mr-[0.44rem] flex-shrink-0" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/linktank_logo.png"
                            alt="Linktank"
                            width={100}
                            height={100}
                            className="sm:w-10 sm:h-10 w-[1.7rem] h-[1.7rem] mr-[0.625rem] rounded-full flex-shrink-0"
                        />
                        <span className="text-[1.39956rem] sm:text-2xl font-bold">
                            Linktank
                        </span>
                    </Link>
                </div>

                <div className="flex items-center justify-end sm:justify-end  w-full">
                    <ul className="space-x-8 ml-6 font-medium hidden lg:flex">
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

                    <div className="flex items-center gap-x-6 sm:ml-auto">
                        <button
                            className="flex items-center text-gray-700 hover:text-black gap-x-2"
                            onClick={() => setSearchOpen(true)}
                        >
                            <Search className="w-5 h-5 text-inherit" />
                            <span className="hidden lg:flex">Search</span>
                        </button>
                        <Link href="/events/create" className="items-center text-gray-700 hover:text-black gap-x-2 hidden lg:flex">
                            <Plus className="w-5 h-5 text-inherit" />
                            <span>Create an event</span>
                        </Link>

                        {!isLoaded ? (

                            <div className="flex items-center gap-2">
                                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                                <div className="flex-1 flex flex-col gap-1 min-w-0">
                                    <Skeleton className="w-full sm:w-36 h-4 rounded" />
                                    <Skeleton className="w-2/3 sm:w-36 h-4 rounded" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <SignedOut>
                                    <SignUpButton>
                                        <Button className="px-[1.16rem] sm:px-10 py-5 sm:py-5 text-[0.875rem] sm:text-base rounded-xl text-white bg-[#1C2329] hover:bg-[#0e3b69]">
                                            Sign Up
                                        </Button>
                                    </SignUpButton>
                                </SignedOut>

                                <SignedIn>
                                    {!open && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="flex items-center gap-x-2 text-black shadow-none px-3 py-2 rounded-md transition-none focus:outline-none">
                                                    <img
                                                        src={user?.imageUrl || ""}
                                                        alt="User avatar"
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                    <div className="text-sm leading-tight flex-col text-left sm:flex hidden">
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
                                                        setOpen(true)
                                                    }}
                                                >
                                                    <User className="mr-2 h-4 w-4" />
                                                    My account
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    asChild
                                                    className="cursor-pointer text-red-500 focus:text-red-600"
                                                >
                                                    <LogoutMenuItem />
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </SignedIn>
                            </>
                        )}
                    </div>
                </div>
                <SearchModal
                    open={searchOpen}
                    onOpenChange={(open) => handleOpenChange(open, setSearchOpen)}
                />
                <AccountModal />
            </nav>
            <div className={cn("absolute top-0 left-0 h-screen w-[80vw] bg-secondaryBlue shadow-[2px_0px_0px_0px_rgba(0,0,0,0.12)]", isMobileMenuOpen ? "block" : "hidden")}>
                <div className="flex items-center mr-10 h-[4.9375rem] px-4">
                    <MenuIcon className="w-6 h-6 text-gray-500 lg:hidden mr-[0.44rem]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/linktank_logo.png"
                            alt="Linktank"
                            width={100}
                            height={100}
                            className="sm:w-10 sm:h-10 w-[1.7rem] h-[1.7rem] mr-[0.625rem] rounded-full flex-shrink-0"
                        />
                        <span className="text-[1.39956rem] sm:text-2xl font-bold">
                            Linktank
                        </span>
                    </Link>
                </div>
                <div className="flex flex-col gap-[1.81rem] mt-[3rem] ml-[3.13rem]">
                    <Link href="/events" className={cn("text-[1.5rem] font-semibold opacity-50 text-[#113663]", pathname === "/events" && "underline opacity-100")}>
                        Events
                    </Link>
                    <Link href="/mycalendar" className={cn("text-[1.5rem] font-semibold opacity-50 text-[#113663]", pathname === "/mycalendar" && "underline opacity-100")}>
                        My calendar
                    </Link>
                    <Link href="/organizations" className={cn("text-[1.5rem] font-semibold opacity-50 text-[#113663]", pathname === "/organizations" && "underline opacity-100")}>
                        Organizations
                    </Link>
                    <Link href="/events/create" className={cn("text-[1.5rem] font-semibold opacity-50 text-[#113663]", pathname === "/settings" && "underline opacity-100")}>
                        Create an event
                    </Link>
                </div>
            </div>
            <SubscriptionBanner />
        </div>
    );
};

export default Navbar;

"use client";

import Image from "next/image";
import Link from "next/link";
import {
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
    useUser,
} from "@clerk/nextjs";
import SearchPalette from "./SearchPalette";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

const Navbar = () => {
    const { user } = useUser();
    const pathname = usePathname();

    return (
        <nav className="flex items-center justify-between h-[6rem] py-6 px-12 bg-secondaryBlue border-b border-[#323232] border-opacity-15">
            <div className="flex items-center mr-10">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="Linktank"
                        width={100}
                        height={100}
                        className="w-10 h-10 mr-[0.625rem]"
                    />
                    <span className="text-2xl font-bold">Linktank</span>
                </Link>
            </div>

            <div className="hidden md:flex items-center justify-between w-full">
                <ul className="flex space-x-8 ml-6 font-medium">
                    <li>
                        <Link
                            href="/events"
                            className={cn(
                                "text-gray-600 hover:underline",
                                pathname === "/events" && "font-semibold"
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
                                pathname === "/mycalendar" && "font-semibold"
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
                                pathname === "/organizations" && "font-semibold"
                            )}
                        >
                            Organizations
                        </Link>
                    </li>
                </ul>

                <div className="flex items-center gap-x-4">
                    <SearchPalette />

                    <SignedOut>
                        <SignUpButton>
                            <Button>Sign Up</Button>
                        </SignUpButton>
                    </SignedOut>

                    <SignedIn>
                        <div className="flex items-center gap-x-2 bg-secondaryBlue text-black shadow-none flex-row">
                            <UserButton />
                            <div className="text-sm leading-tight">
                                <h4 className="text-base text-[#1C2329] font-semibold">
                                    {user?.fullName}
                                </h4>
                                <p className="text-base text-gray-500">
                                    {user?.username}
                                </p>
                            </div>
                            <ChevronDownIcon className="text-[#737272] w-6 h-6" />
                        </div>
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

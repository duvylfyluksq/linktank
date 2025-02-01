import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between h-[6rem] px-[3.19rem] bg-secondaryBlue border-b border-[#323232] border-opacity-15">
            <div className="flex items-center">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="LinkTank"
                        width={100}
                        height={100}
                        className="w-10 h-10 mr-[0.625rem]"
                    />
                    <span className="text-2xl font-bold mr-[2.44rem]">
                        LinkTank
                    </span>
                </Link>

                <ul className="flex space-x-8 ml-6">
                    <li>
                        <a
                            href="/events"
                            className="text-gray-600 hover:underline"
                        >
                            Events
                        </a>
                    </li>
                    <li>
                        <a href="#" className="text-gray-600 hover:underline">
                            My calendars
                        </a>
                    </li>
                    <li>
                        <a href="#" className="text-gray-600 hover:underline">
                            Organizations
                        </a>
                    </li>
                </ul>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-x-4 py-7 bg-secondaryBlue hover:bg-secondaryBlue text-black shadow-none">
                        <Avatar className="h-[2.96125rem] w-[2.96125rem]">
                            <AvatarImage src="/avatar.jpg" alt="User Avatar" />
                            <AvatarFallback>ID</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col text-left">
                            <span className="font-bold text-[0.97456rem]">
                                Vedanta Som
                            </span>
                            <span className="font-medium text-[0.97456rem]">
                                vedanta@ua.ai
                            </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Students</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="font-bold text-red-500">
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    );
};
export default Navbar;

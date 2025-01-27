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

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between p-4 px-10 bg-secondaryBlue border-b border-[#323232] border-opacity-15">
            <div className="flex items-center">
                <Image
                    src="/logo.png"
                    alt="LinkTank"
                    width={100}
                    height={100}
                    className="w-10 h-10 mr-4"
                />
                <span className="text-2xl font-bold mr-10">LinkTank</span>

                <ul className="flex space-x-8 ml-6">
                    <li>
                        <a href="#" className="text-gray-600 hover:underline">
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
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/avatar.jpg" alt="User Avatar" />
                            <AvatarFallback>ID</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col text-left">
                            <span className="font-bold">Vedanta Som</span>
                            <span className="font-medium">vedanta@ua.ai</span>
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

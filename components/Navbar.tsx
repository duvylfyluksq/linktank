import Image from "next/image";
import Link from "next/link";
import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import SearchPalette from "./SearchPalette";

const Navbar = async () => {
	const user = await currentUser();

	return (
		<nav className="flex items-center justify-between h-[6rem] p-4 bg-secondaryBlue border-b border-[#323232] border-opacity-15">
			<div className="flex items-center mr-10">
				<Link href="/" className="flex items-center">
					<Image
						src="/logo.png"
						alt="LinkTank"
						width={100}
						height={100}
						className="w-10 h-10 mr-[0.625rem]"
					/>

					<span className="text-2xl font-bold">LinkTank</span>
				</Link>
			</div>
			<div className="hidden md:flex items-center justify-between w-full">
				<ul className="flex space-x-8 ml-6">
					<li>
						<Link href="/events" className="text-gray-600 hover:underline">
							Events
						</Link>
					</li>
					<li>
						<Link href="/mycalendars" className="text-gray-600 hover:underline">
							My calendars
						</Link>
					</li>
					<li>
						<Link
							href="/organizations"
							className="text-gray-600 hover:underline"
						>
							Organizations
						</Link>
					</li>
				</ul>
				<div className="flex items-center gap-x-4">
				<SearchPalette />
					<SignedOut>
						<SignInButton />
						<SignUpButton />
					</SignedOut>
					<SignedIn>
						<div className="flex items-center gap-x-4 bg-secondaryBlue hover:bg-secondaryBlue text-black shadow-none">
							<UserButton />
							<h4>{user?.fullName}</h4>
							<p>{user?.username}</p>
						</div>
					</SignedIn>
				</div>
			</div>
		</nav>
	);
};
export default Navbar;

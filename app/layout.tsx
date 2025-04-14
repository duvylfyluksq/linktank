import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { SavedEventsProvider } from "./contexts/SavedEventsContext";
import { Toaster } from "@/components/ui/toaster";
// import { localization } from "./localization";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "LinkTank",
	description: "",
	icons: {
		icon: "/favicons/favicon.ico",
		shortcut: "/favicons/favicon-16x16.png",
		apple: "/favicons/apple-touch-icon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<ClerkProvider
			publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
		>
			<SavedEventsProvider>
				<html lang="en" className="min-h-screen">
					<body
						className={`${geistSans.variable} ${geistMono.variable} light antialiased bg-[#FAFEFF] flex flex-col min-h-screen`}
					>
						<Navbar />

						<main className="pt-[6rem] flex-1 flex flex-col items-center">
							{children}
							<Toaster />
						</main>

						<Footer />
					</body>
				</html>
			</SavedEventsProvider>
		</ClerkProvider>
	);
}

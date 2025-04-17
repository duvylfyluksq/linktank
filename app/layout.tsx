import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SavedEventsProvider } from "./contexts/SavedEventsContext";
import { AccountModalProvider } from "./contexts/AccountModalContext";
import { BillingProvider } from "./contexts/BillingContext";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

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
				<AccountModalProvider>
					<BillingProvider>
						<html lang="en" className="min-h-screen">
							<body
								className={`${geistSans.variable} ${geistMono.variable} light antialiased bg-[#FAFEFF] flex flex-col min-h-screen`}
							>
								<ClientLayoutWrapper>
									{children}
								</ClientLayoutWrapper>
							</body>
						</html>
					</BillingProvider>
				</AccountModalProvider>
			</SavedEventsProvider>
		</ClerkProvider>
	);
}

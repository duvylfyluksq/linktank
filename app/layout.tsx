import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

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
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <ClerkProvider
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} light antialiased bg-[#FAFEFF]`}
                >
                    <Navbar />

                    <main className="flex flex-col items-center">
                        {children}
                    </main>
                    <Footer />
                </body>
            </html>
        </ClerkProvider>
    );
}

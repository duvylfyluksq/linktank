"use client"

import Link from "next/link";
import { usePathname } from "next/navigation"

export default function AuthTabs(){
    const pathname = usePathname();
    return(
        <div className="flex justify-center">
            <div className="inline-flex items-center justify-center rounded-full bg-white p-1 border border-[#CBD5E1]">
            <Link href="/sign-in">
                <button
                    className={`rounded-full px-8 py-3 text-base font-medium ${
                    pathname === "/sign-in"
                        ? "bg-[#0e3b69] text-white"
                        : "bg-transparent text-gray-700"
                    }`}
                >
                    Sign In
                </button>
                </Link>
                <Link href="/sign-up">
                <button
                    className={`rounded-full px-8 py-3 text-base font-medium ${
                    pathname === "/sign-up"
                        ? "bg-[#0e3b69] text-white"
                        : "bg-transparent text-gray-700"
                    }`}
                >
                    Sign Up
                </button>
            </Link>
            </div>
        </div>
    )
}
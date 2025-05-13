"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthTabs() {
  const pathname = usePathname();

  return (
    <div className="flex justify-center px-4">
      <div className="flex w-full max-w-[20rem] rounded-full bg-white p-1 border border-[#CBD5E1]">
        <Link href="/sign-up" className="flex-1">
          <button
            className={`w-full text-sm font-medium py-2 rounded-full text-center
              ${
                pathname.startsWith("/sign-up")
                  ? "bg-[#0e3b69] text-white"
                  : "bg-transparent text-gray-700"
              }`}
          >
            Sign Up
          </button>
        </Link>
        <Link href="/sign-in" className="flex-1">
          <button
            className={`w-full text-sm font-medium py-2 rounded-full text-center
              ${
                pathname.startsWith("/sign-in")
                  ? "bg-[#0e3b69] text-white"
                  : "bg-transparent text-gray-700"
              }`}
          >
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}

"use client"

import { useUser } from "@clerk/nextjs"
import { LockIcon } from "lucide-react"
import Link from "next/link"
import { useBillingInfo } from "@/hooks/useBillingInfo"
import { usePathname } from "next/navigation"

export default function SubscriptionBanner() {
  const { user, isLoaded, isSignedIn } = useUser()
    const pathname = usePathname();
  // Only check subscription if user is signed in
  const { hasSubscription } = useBillingInfo(isSignedIn ? user?.id : undefined)

  // Don't show banner if still loading user data or if user has subscription
  if (!isLoaded || (isSignedIn && hasSubscription) || pathname.startsWith("/sign-up") || pathname.startsWith("/sign-in")) {
    return null
  }

  return (
    <div className="w-full bg-[#0e3b69] text-white py-3 px-4 sm:px-20 flex items-center justify-between">
      <div className="flex items-center">
        <div className="p-2 rounded-full mr-3 bg-[linear-gradient(to_bottom,_#228BE0,_#47ADFF)]">
            <LockIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-sm sm:text-base">Subscribe to see upcoming events</h3>
          <p className="text-xs sm:text-sm text-gray-200">Access all upcoming events and never miss one again!</p>
        </div>
      </div>
      <Link
        href={"/sign-up"}
        className="whitespace-nowrap bg-white text-[#1A365D] hover:bg-gray-100 transition-colors px-8 py-4 rounded-md text-sm font-medium"
      >
        Get started
      </Link>
    </div>
  )
}

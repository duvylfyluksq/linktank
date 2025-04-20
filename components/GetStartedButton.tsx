"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAccountModal } from "@/app/contexts/AccountModalContext";
import { useState } from "react";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { useBillingInfo } from "@/app/contexts/BillingContext";

export default function GetStartedButton({ className, isSubscriptionBanner = false }: { className?: string, isSubscriptionBanner?: boolean }) {
  const [loading, setLoading] = useState(false)
  const { isSignedIn, isLoaded } = useUser();
  const { hasSubscription, loadingPlan } = useBillingInfo();
  const { setTab, setOpen } = useAccountModal();
  const router = useRouter();

  const handleClick = () => {
    setLoading(true)
    if (!isSignedIn) {
      router.push("/sign-up");
    } else if (!hasSubscription) {
      setTab("billing")
      setOpen(true)
    } else {
      router.push("/events");
    }
    setLoading(false)
  };

  const getLabel = () => {
    return !isSignedIn ? "Get Started" : hasSubscription ? "View Events" : "Subscribe";
  };

  return (
    <Button
      className={cn(
        "bg-[#1C2329] text-white hover:bg-[#0e3b69] rounded-xl px-6 py-4 text-base font-medium",
        className
      )}
      onClick={handleClick}
      disabled={!isLoaded}
    >
      {(loading || !isLoaded || loadingPlan) ? <Loader2 className="h-4 w-4 animate-spin" /> : isSubscriptionBanner ? <><div className="sm:hidden flex"><ArrowRightIcon className="h-4 w-4" /></div><div className="hidden sm:flex">{getLabel()}</div></> : getLabel()}
    </Button>
  );
}

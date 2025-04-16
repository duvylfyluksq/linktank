"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function GetStartedButton({ className }: { className?: string }) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const handleClick = () => {
    if (!isSignedIn) {
      router.push("/sign-up");
    } else {
      router.push("/events");
    }
  };

  const getLabel = () => {
    return isSignedIn ? "View Events" : "Get Started";
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
      {getLabel()}
    </Button>
  );
}

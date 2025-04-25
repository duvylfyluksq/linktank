"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-6 bg-[#FAFEFF] px-4">
      <h1 className="text-[8rem] font-extrabold text-[#0e3b69] leading-none tracking-tight">
        404
      </h1>
      <p className="text-lg font-medium text-gray-800">Page not found</p>
      <Button
        onClick={() => {setLoading(true); router.push("/");}}
        disabled={loading}
        className="rounded-lg px-6 py-3 text-white bg-[#1C2329] hover:bg-[#0e3b69] transition"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Back home"}
      </Button>
    </div>
  );
}

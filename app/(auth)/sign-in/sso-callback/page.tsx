"use client";

import { Loader2 } from "lucide-react";
import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function SSOCallbackPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#1C2329]" />
      <p className="mt-4 text-lg">Completing your sign-in...</p>
      <AuthenticateWithRedirectCallback/>
    </div>
  );
}

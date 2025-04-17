"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Toaster } from "./ui/toaster";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navHeight, setNavHeight] = useState(0);

  return (
    <>
      <Navbar onHeightChange={setNavHeight} />
      <main
        style={{ paddingTop: `${navHeight}px` }}
        className="flex-1 flex flex-col items-center"
      >
        {children}
        <Toaster />
      </main>
    </>
  );
}

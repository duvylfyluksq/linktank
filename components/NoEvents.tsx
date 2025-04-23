"use client";

import Image from "next/image";

export default function NoEvents({
  imageUrl,
  text = "No results found",
  className = "",
}: {
  imageUrl: string;
  text?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 ${className}`}>
      <Image
        src={imageUrl}
        alt="No results"
        width={120}
        height={120}
        className="mb-4"
      />
      <p className="text-lg font-medium text-gray-700">{text}</p>
    </div>
  );
}

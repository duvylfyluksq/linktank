"use client";

import { Input } from "@/components/ui/input";
import { useRef } from "react";

interface VerificationCodeProps {
  verificationCode: string;
  setVerificationCode: (code: string) => void;
}

export default function VerificationCode({
  verificationCode,
  setVerificationCode,
}: VerificationCodeProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d$/.test(value)) return;
    const updated = verificationCode.split("");
    updated[index] = value;
    setVerificationCode(updated.join(""));
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (verificationCode[index]) {
        const updated = verificationCode.split("");
        updated[index] = " ";
        setVerificationCode(updated.join(""));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const updated = verificationCode.split("");
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i];
    }
    setVerificationCode(updated.join(""));
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="my-6 flex justify-center">
      <div className="inline-flex gap-2">
        {[...Array(6)].map((_, i) => (
          <Input
            key={i}
            id={`code-box-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="
              flex-shrink-0
              w-6 h-8        /* 1.5rem × 2rem on mobile */
              sm:w-8 sm:h-10 /* 2rem × 2.5rem on ≥640px */
              md:w-12 md:h-14/* 3rem × 3.5rem on ≥768px */
              border border-gray-300 rounded-md
              text-center text-base sm:text-lg md:text-xl font-medium
            "
            value={verificationCode[i] === " " ? "" : verificationCode[i]}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            onChange={(e) => handleInputChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            onPaste={i === 0 ? handlePaste : undefined}
            autoFocus={i === 0}
          />
        ))}
      </div>
    </div>
  );
}

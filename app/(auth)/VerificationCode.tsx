"use client";

import { Input } from "@/components/ui/input";
import { useRef } from "react";

interface VerificationCodeProps {
  verificationCode: string;                    // e.g. "1 4  7"
  setVerificationCode: (code: string) => void; // updater
}

export default function VerificationCode({
  verificationCode,
  setVerificationCode,
}: VerificationCodeProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Always work with an array of exactly 6 characters, padding with " "
  const codeChars = verificationCode
    .padEnd(6, " ")        // if shorter, fill with spaces
    .slice(0, 6)           // if longer, truncate
    .split("");            // -> ["1"," ","4"," ",...," "]

  const updateCodeAt = (idx: number, char: string) => {
    const newChars = [...codeChars];
    newChars[idx] = char;
    setVerificationCode(newChars.join(""));
  };

  const handleInputChange = (idx: number, v: string) => {
    if (!/^\d$/.test(v)) return;
    updateCodeAt(idx, v);
    if (idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      // clear this box (to space) and stay, or move back if already empty
      if (codeChars[idx] !== " ") {
        updateCodeAt(idx, " ");
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowRight" && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e
      .clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");
    const newChars = codeChars.map((c, i) => pasted[i] ?? c);
    setVerificationCode(newChars.join(""));
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="my-6 flex justify-center">
      <div className="inline-flex gap-2">
        {codeChars.map((char, i) => (
          <Input
            key={i}
            id={`code-box-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="
              flex-shrink-0
              w-6 h-8
              sm:w-8 sm:h-10
              md:w-12 md:h-14
              border border-gray-300 rounded-md
              text-center text-base sm:text-lg md:text-xl font-medium
            "
            value={char === " " ? "" : char}
            // ref={el => (inputRefs.current[i] = el)}
            onChange={e => handleInputChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onFocus={e => e.target.select()}
            onPaste={i === 0 ? handlePaste : undefined}
            autoFocus={i === 0}
          />
        ))}
      </div>
    </div>
  );
}
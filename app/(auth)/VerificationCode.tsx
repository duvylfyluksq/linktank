import { Input } from "@/components/ui/input";
import { useRef } from "react";

interface VerificationCodeProps {
    verificationCode: string;
    setVerificationCode: (code: string) => void;
  }

export default function VerficationCode({verificationCode, setVerificationCode} : VerificationCodeProps){
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

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
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
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const updated = verificationCode.split("");

        for (let i = 0; i < pasted.length; i++) {
            updated[i] = pasted[i];
        }

        setVerificationCode(updated.join(""));

        if (pasted.length > 0) {
            inputRefs.current[Math.min(pasted.length, 5)]?.focus();
        }
    };


    return (
        <div className="flex justify-center gap-2 my-6 px-4 overflow-x-auto">
            {[...Array(6)].map((_, i) => (
            <Input
                key={i}
                id={`code-box-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="
                    flex-shrink-0
                    w-10 h-12
                    sm:w-12 sm:h-14
                    border border-gray-300 rounded-md
                    text-center text-xl font-medium
                "
                value={verificationCode[i] === " " ? "" : verificationCode[i]}
                ref={el => { inputRefs.current[i] = el }}
                onChange={e => handleInputChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onFocus={e => e.target.select()}
                onPaste={i === 0 ? handlePaste : undefined}
                autoFocus={i === 0}
            />
            ))}
        </div>
    );
   
}
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export function PasswordInput({ id, value, onChange, placeholder }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

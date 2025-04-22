import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function FormInput({ label, placeholder, type, value, onChange, className, required }: { label: string, placeholder: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, className?: string, required?: boolean }) {
    return (
        <div className="flex flex-col gap-[0.45rem]">
            <Label htmlFor="event-title" className="text-[#525252] font-medium text-base">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input id="event-title" placeholder={placeholder} type={type} value={value} onChange={onChange} className={cn("bg-white border-[1px] border-slate-300 rounded-[0.46rem] h-[2.625rem]", className)} />
        </div>
    );
}
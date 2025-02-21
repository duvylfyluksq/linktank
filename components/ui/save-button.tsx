import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

interface SaveButtonProps {
    className?: string;
}

export function SaveButton({ className }: SaveButtonProps) {
    return (
        <Button
            variant="secondary"
            size="sm"
            className={`
        bg-black/40 
        hover:bg-black/50 
        text-white 
        font-medium 
        backdrop-blur-[2px]
        px-3 
        py-2 
        h-8 
        flex 
        items-center 
        gap-1.5
        ${className}
      `}
        >
            <Bookmark className="w-4 h-4" />
            Save
        </Button>
    );
}

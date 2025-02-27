import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

interface SaveButtonProps {
	className?: string;
	eventId: string;
	isSaved?: boolean;
	onToggle?: (newState: boolean) => void;
}

export function SaveButton({
	className,
	eventId,
	isSaved = false,
}: SaveButtonProps) {
	const handleAction = async (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		if (isSaved) {
			// Unsave the event
			try {
				const response = await fetch("/api/saveevent", {
					method: "DELETE",
					headers: {},
					body: JSON.stringify({ eventId }),
				});
				const data = await response.json();
				if (response.ok) {
					console.log("Event removed from saved events:", data);
				} else {
					console.error("Failed to remove saved event:", data.message);
				}
			} catch (error) {
				console.error("Error unsaving event:", error);
			}
		} else {
			// Save the event
			try {
				const response = await fetch("/api/saveevent", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},

					body: JSON.stringify({ eventId }),
				});
				const data = await response.json();
				if (response.ok) {
					console.log("Event saved successfully:", data);
				} else {
					console.error("Failed to save event:", data.message);
				}
			} catch (error) {
				console.error("Error saving event:", error);
			}
		}
	};

	return (
		<Button
			onClick={handleAction}
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
		max-sm:w-[4rem]
        ${className || ""}
      `}
		>
			<Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : "fill-none"}`} />
			{isSaved ? "Saved" : "Save"}
		</Button>
	);
}

import { Button } from "@/components/ui/button";
import { Bookmark, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSavedEvents } from "@/app/contexts/SavedEventsContext";
import { useUser } from "@clerk/nextjs";

interface SaveButtonProps {
	eventId: string;
}

export function SaveButton({
	eventId
}: SaveButtonProps) {
	const [loading, setLoading] = useState(false);
	const {savedEvents, setSavedEvents} = useSavedEvents();
	const [isSaved, setIsSaved] = useState(savedEvents.some((event: any) => event.backlink === eventId));
	const {user} = useUser();

	useEffect(() => {
		setIsSaved(savedEvents.some((event: any) => event.backlink === eventId));
		}, [savedEvents]);

	if(!user){
		return null;
	}

	const handleSaveEvent = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();    
        try {
            setLoading(true);
            const res = await fetch(`/api/users/${user.id}/saved_events/${eventId}`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            setSavedEvents(data.saved_events);

        } catch (error) {
            console.error("Error saving event:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsaveEvent = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault(); 
        try {
            setLoading(true);
            const res = await fetch(`/api/users/${user.id}/saved_events/${eventId}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            setSavedEvents(data.saved_events);

        } catch (error) {
          console.error("Error removing saved event:", error);
        } finally {
          setLoading(false);
        }
    };
    
	return (
		<Button
			onClick={isSaved ? handleUnsaveEvent : handleSaveEvent}
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
      `}
		>
			{loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : "fill-none"}`} />
            )}
			{!loading && (isSaved ? "Saved" : "Save")}
		</Button>
	);
}

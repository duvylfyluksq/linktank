import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonEventSearchResult = () => {
    return (
        <div className="flex items-center gap-2 py-2 w-full">
            <Skeleton className="w-4 h-4 rounded-full flex-shrink-0" />
            <div className="flex justify-between items-center w-full gap-0">
                <Skeleton className="h-4 w-[60%] rounded-sm flex-grow min-w-0" />                
                <Skeleton className="h-4 w-[80px] rounded-sm flex-shrink-0 ml-2" />
            </div>
        </div>
    );
};
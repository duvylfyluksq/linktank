import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
    return (
        <div className="border mt-6 flex border-[#D3D0D0] bg-white rounded-2xl pl-[1.37rem] pr-[0.88rem] py-[1.41rem] animate-pulse w-full">
            <div className="flex-1 flex flex-col gap-[0.5rem]">
                <div className="flex items-center opacity-70 font-jakarta text-[#323232] text-[1rem] font-medium gap-[1.25rem]">
                    <Skeleton className="h-5 w-20" />
                    <div className="flex flex-row items-center gap-[0.12rem] w-[70%]">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        </div>
    );
}

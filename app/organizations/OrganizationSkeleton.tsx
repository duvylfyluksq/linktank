import { Skeleton } from "@/components/ui/skeleton";

export default function OrganizationSkeleton() {
  return (
    <div
      className="border border-[#D3D0D0] bg-white rounded-[10px] shadow-sm
        flex flex-col justify-center items-start
        pr-[40px] pl-[19px] py-8 w-auto h-auto gap-[0.5rem]"
    >
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-16 rounded flex-shrink-0" />
        <Skeleton className="h-5 w-40 rounded" />
      </div>
    </div>
  );
}

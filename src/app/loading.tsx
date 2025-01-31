import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-2 flex-wrap">
        <Skeleton className="w-[256px] h-[20px] rounded-xl" />
        <Skeleton className="w-[334px] h-[20px] rounded-xl" />
      </div>
      <div className="flex gap-5 flex-col md:flex-row h-[654px]">
        <Skeleton className="w-full rounded-xl h-full" />
        <Skeleton className="w-full rounded-xl h-full hidden md:block" />
      </div>
    </div>
  );
}

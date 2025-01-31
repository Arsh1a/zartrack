import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-2 flex-wrap">
        <Skeleton className="w-[256px] h-[20px] rounded-xl" />
        <Skeleton className="w-[334px] h-[20px] rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 h-[364px]">
        <div className="flex flex-col gap-4 w-full">
          <Skeleton className="h-[46px] w-full rounded-xl" />
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>
        <Skeleton className="h-full w-full rounded-2xl" />
        <Skeleton className="h-full w-full rounded-2xl col-span-1 sm:col-span-2 lg:col-span-1" />
      </div>
      <Skeleton className="h-[136px] w-full rounded-2xl" />
    </div>
  );
}

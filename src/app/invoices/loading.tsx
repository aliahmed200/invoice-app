import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="w-[1010px] m-auto mt-16">
      <div className="flex justify-between items-center mb-5">
        <Skeleton className="h-8 w-[100px]" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-8 w-[100px]" />
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
      <div className="flex justify-center my-7">
        <Skeleton className="h-8 w-[300px]" />
      </div>
    </div>
  );
};

export default Loading;

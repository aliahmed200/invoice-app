import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="w-[300px] md:w-[600px] lg:w-[1010px] m-auto mt-16">
      <div className="flex justify-between items-center mb-10">
        <Skeleton className="h-8 w-[130px]" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-8 w-[120px]" />
        </div>
      </div>
      <div className="flex justify-between items-center mb-20">
        <Skeleton className="h-8 w-[110px]" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-8 w-[90px]" />
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <div className="flex gap-5">
          <Skeleton className="h-52 w-1/3" />
          <Skeleton className="h-52 w-1/3" />
          <Skeleton className="h-52 w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default Loading;

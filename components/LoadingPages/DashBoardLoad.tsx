import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const DashBoardSkeletonLoad = () => {
  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 animate-pulse bg-[#f9f5f2]">
      {/* Header */}
      <Skeleton className="h-6 sm:h-8 w-44 rounded-full bg-gray-300/90" />

      {/* Top 3 summary cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="rounded-xl p-4 flex flex-col justify-between shadow-sm bg-gray-50"
          >
            <div>
              <Skeleton className="h-3 w-1/3 mb-3 bg-gray-300/90" />
              <Skeleton className="h-3 w-1/4 bg-gray-300/90" />
            </div>
            <Skeleton className="h-4 w-1/5 self-end bg-gray-300/90" />
          </Card>
        ))}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        {/* Left section: Chart + Best Sellers */}
        <div className="md:col-span-3 space-y-6">
          {/* Chart placeholder */}
          <Card className="h-60 sm:h-72 p-4 bg-white rounded-2xl shadow-sm flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-xl bg-gray-300/90" />
          </Card>

          {/* Best Sellers placeholder */}
          <Card className="p-4 w-full bg-white rounded-2xl shadow-sm space-y-4">
            <Skeleton className="h-5 w-28 mb-2 bg-gray-300/90" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl p-3 flex flex-col items-center"
                >
                  <Skeleton className="w-full h-28 sm:h-32 rounded-lg mb-3 bg-gray-300/90" />
                  <Skeleton className="h-3 w-16 mb-1 bg-gray-300/90" />
                  <Skeleton className="h-3 w-12 bg-gray-300/90" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right section: Peak Hour */}
        <div className="md:col-span-2">
          <Card className="p-4 bg-white rounded-2xl shadow-sm">
            <Skeleton className="h-5 w-24 mb-6 bg-gray-300/90" />
            <div className="grid grid-cols-8 gap-1">
              {[...Array(56)].map((_, idx) => (
                <Skeleton
                  key={idx}
                  className="h-6 w-full rounded-md bg-gray-300/90"
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

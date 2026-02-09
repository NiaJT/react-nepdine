"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function WaiterDetailPageSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-5">
      {/* Header */}
      <div className="flex sm:justify-between sm:flex-row flex-col items-start gap-4">
        <Skeleton className="h-10 sm:h-12 w-64 sm:w-96 rounded-md bg-gray-200" />

        {/* Waiter Selector */}
        <Skeleton className="h-10 w-40 sm:w-52 rounded-xl" />
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap justify-between gap-6 mb-9">
        {[...Array(4)].map((_, idx) => (
          <Card
            key={idx}
            className="w-[233px] h-[90px] shadow-md rounded-[20px] [@media(min-width:1400px)]:w-[270px] [@media(min-width:1400px)]:h-[110px]"
          >
            <CardContent className="flex items-center gap-4 p-2 min-h-full w-full">
              <Skeleton className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Line Chart */}
      <Card className="w-full shadow-md rounded-2xl">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </CardHeader>
        <CardContent className="h-72">
          <Skeleton className="w-full h-full rounded-md" />
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="w-full shadow-md rounded-2xl">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </CardHeader>
        <CardContent className="h-64 flex flex-col items-center justify-center gap-4">
          <Skeleton className="w-40 h-40 rounded-full" />
          <div className="flex flex-wrap justify-center gap-6">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <Skeleton className="h-3 w-12 rounded-md" />
                <Skeleton className="h-3 w-6 rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

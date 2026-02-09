"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MainMenuPageSkeleton() {
  const itemsPerRow = 3;

  return (
    <div className="p-4 sm:p-6 space-y-5 animate-pulse min-h-screen">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Skeleton className="h-8 w-60 sm:w-72 mb-2 bg-gray-300/90" />
      </div>

      <Card className="w-full max-w-[500px] border-0 bg-gray-100 shadow-md shadow-black/20 rounded-xl sm:rounded-2xl">
        <CardHeader className="px-6 py-3">
          <CardTitle>
            <Skeleton className="h-5 w-40 bg-gray-300/80" />
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 py-3 space-y-3">
          <Skeleton className="h-10 w-full rounded-md bg-gray-200/80" />
          <Skeleton className="h-10 w-full rounded-md bg-gray-200/80" />
          <Skeleton className="h-10 w-full rounded-md bg-gray-200/80" />
          <Skeleton className="h-10 w-32 rounded-md bg-gray-200/80" />
        </CardContent>
      </Card>

      {/* Menu Items Grid */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-${itemsPerRow} gap-6 sm:gap-8 py-6`}
      >
        {[...Array(6)].map((_, idx) => (
          <Card
            key={idx}
            className="relative flex flex-row items-stretch gap-2 rounded-xl border border-gray-300 bg-gray-100 shadow-xl h-[110px] sm:h-[130px] md:h-[150px] overflow-hidden w-full"
          >
            {/* Image */}
            <Skeleton className="w-[20%] h-full bg-gray-300/80 rounded-l-lg" />

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 w-full">
              <Skeleton className="h-5 w-3/4 bg-gray-300/80 rounded" />
              <Skeleton className="h-4 w-1/2 bg-gray-200/80 rounded mt-2" />
              <Skeleton className="h-6 w-1/4 bg-gray-200/80 rounded mt-2" />
            </div>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              <Skeleton className="h-6 w-6 bg-gray-300/80 rounded-full" />
              <Skeleton className="h-6 w-6 bg-gray-300/80 rounded-full" />
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-2">
        {[...Array(5)].map((_, idx) => (
          <Skeleton key={idx} className="h-8 w-8 rounded-md bg-gray-300/80" />
        ))}
      </div>
    </div>
  );
}

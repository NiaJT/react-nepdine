"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function UsersPageSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse bg-[#f9f5f2] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
        <div className="space-y-3 text-center sm:text-left">
          <Skeleton className="h-8 w-64 bg-gray-300/90" />
          <Skeleton className="h-5 w-32 bg-gray-300/90" />
        </div>

        <div className="flex items-center gap-2">
          {/* +Add button */}
          <Skeleton className="h-10 w-[111px] rounded-l-md bg-gray-300/90" />
          {/* Role selector */}
          <Skeleton className="h-10 w-[150px] rounded-r-md bg-gray-300/90" />
        </div>
      </div>

      {/* Table section */}
      <Card className="bg-white shadow-md rounded-2xl p-6 space-y-4">
        {/* Table header skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-36 bg-gray-300/90" />
          <Skeleton className="h-5 w-24 bg-gray-300/90" />
        </div>

        {/* Table rows skeleton */}
        <div className="space-y-3 mt-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-4 sm:grid-cols-6 gap-4 items-center"
            >
              {[...Array(6)].map((_, j) => (
                <Skeleton
                  key={j}
                  className="h-6 w-full rounded bg-gray-300/90"
                />
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

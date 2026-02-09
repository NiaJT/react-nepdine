"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function BalancePageSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-6 animate-pulse bg-[#f9f5f2] min-h-screen">
      {/* Title */}
      <div>
        <Skeleton className="h-8 w-72 mb-2 bg-gray-300/90" />
      </div>

      <Card className="px-4 py-5 bg-white rounded-2xl shadow-sm space-y-6">
        {/* Filters Row */}
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-10 w-64 rounded-2xl bg-gray-300/90" />{" "}
            {/* Search */}
            <Skeleton className="h-10 w-40 rounded-2xl bg-gray-300/90" />{" "}
            {/* Date Range */}
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-40 rounded-2xl bg-gray-300/90" />{" "}
            {/* Calendar */}
            <Skeleton className="h-10 w-28 rounded-2xl bg-gray-300/90" />{" "}
            {/* View */}
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="space-y-2 mt-2">
          {/* Table Header */}
          <div className="grid grid-cols-8 gap-3 bg-gray-100 p-3 rounded-lg">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-full bg-gray-300/90" />
            ))}
          </div>

          {/* Table Rows */}
          {[...Array(8)].map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="grid grid-cols-8 gap-3 p-3 rounded-lg bg-gray-50"
            >
              {[...Array(8)].map((_, colIdx) => (
                <Skeleton
                  key={colIdx}
                  className="h-5 w-full bg-gray-300/90 rounded"
                />
              ))}
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
          <Skeleton className="h-5 w-44 bg-gray-300/90" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-xl bg-gray-300/90" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

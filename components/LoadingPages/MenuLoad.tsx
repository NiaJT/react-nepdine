"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function MenuPageSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-6 animate-pulse bg-[#f9f5f2] min-h-screen">
      {/* Title */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-72 mb-2 bg-gray-300/90" />
        <Skeleton className="h-8 w-20 mb-2 bg-gray-300/90" /> {/* Cart icon */}
      </div>

      <Card className="px-4 py-5 bg-white rounded-2xl shadow-sm space-y-6">
        {/* Filters Row */}
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-10 w-64 rounded-2xl bg-gray-300/90" />{" "}
            {/* Search */}
            <Skeleton className="h-10 w-40 rounded-2xl bg-gray-300/90" />{" "}
            {/* Category dropdown */}
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-8 py-6">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="flex flex-row items-stretch gap-2 rounded-xl bg-white shadow cursor-pointer overflow-hidden"
            >
              {/* Image Skeleton */}
              <Skeleton className="w-16 sm:w-20 md:w-24 lg:w-28 h-[90px] sm:h-[110px] md:h-[130px] lg:h-[100px] rounded-l-xl bg-gray-300/90" />

              {/* Right Content Skeleton */}
              <div className="flex-1 flex flex-col justify-between p-2 sm:px-3 sm:py-4 relative min-h-0">
                <Skeleton className="h-4 w-20 rounded bg-gray-300/90 absolute top-2 right-2" />{" "}
                {/* Availability */}
                <Skeleton className="h-5 w-28 rounded bg-gray-300/90 mt-4" />{" "}
                {/* Name */}
                <Skeleton className="h-4 w-16 rounded bg-gray-300/90 mt-1" />{" "}
                {/* Price */}
                <div className="flex gap-1 mt-2">
                  <Skeleton className="h-6 w-6 rounded-full bg-gray-300/90" />{" "}
                  {/* Decrease */}
                  <Skeleton className="h-6 w-6 rounded-full bg-gray-300/90" />{" "}
                  {/* Qty */}
                  <Skeleton className="h-6 w-6 rounded-full bg-gray-300/90" />{" "}
                  {/* Increase */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center mt-4 gap-2">
          {[...Array(5)].map((_, idx) => (
            <Skeleton key={idx} className="h-8 w-8 rounded-md bg-gray-300/90" />
          ))}
        </div>
      </Card>
    </div>
  );
}

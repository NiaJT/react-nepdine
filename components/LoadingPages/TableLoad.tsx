"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function TablePageSkeleton() {
  const getChairs = (tableWidth: number, tableHeight: number) => {
    // Max 4 chairs: one per side
    return [
      { x: 0, y: -(tableHeight / 2 + 10) }, // top
      { x: 0, y: tableHeight / 2 + 10 }, // bottom
      { x: -(tableWidth / 2 + 10), y: 0 }, // left
      { x: tableWidth / 2 + 10, y: 0 }, // right
    ];
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-pulse min-h-screen">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Skeleton className="h-8 w-60 sm:w-72 mb-2 bg-gray-300/90" />
        <Skeleton className="h-8 w-36 sm:w-40 mb-2 bg-gray-300/90" />
      </div>

      {/* Rooms Dropdown Skeleton */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <Skeleton className="h-10 w-48 rounded-2xl bg-gray-300/90" />
        <Skeleton className="h-10 w-32 rounded-2xl bg-gray-300/90" />
        <Skeleton className="h-10 w-20 rounded-2xl bg-gray-300/90" />
      </div>

      {/* Tables Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-12 py-6">
        {[...Array(8)].map((_, idx) => {
          const tableWidth = 210;
          const tableHeight = 110;
          const chairs = getChairs(tableWidth, tableHeight);

          return (
            <div
              key={idx}
              className="relative flex justify-center items-center"
            >
              {/* Chair Skeletons */}
              {chairs.map((c, i) => (
                <Skeleton
                  key={i}
                  className="absolute w-5 h-5 rounded-full bg-gray-300/90"
                  style={{
                    transform: `translate(${c.x}px, ${c.y}px)`,
                  }}
                />
              ))}

              {/* Table Card */}
              <Card className="w-[210px] h-[110px] flex flex-col justify-center items-center rounded-lg shadow bg-gray-200 relative p-0">
                <Skeleton className="absolute left-0 top-0 h-full w-3 bg-gray-400 rounded-l" />
                <Skeleton className="h-4 w-20 mt-2 bg-gray-300/90 rounded" />
                <Skeleton className="h-3 w-24 mt-2 bg-gray-300/90 rounded" />
                <Skeleton className="h-4 w-16 mt-2 bg-gray-300/90 rounded-full" />
              </Card>
            </div>
          );
        })}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center mt-4 gap-2">
        {[...Array(5)].map((_, idx) => (
          <Skeleton key={idx} className="h-8 w-8 rounded-md bg-gray-300/90" />
        ))}
      </div>
    </div>
  );
}

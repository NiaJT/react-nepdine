"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function WaitersPageSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="w-full sm:w-auto ">
          <Skeleton className="h-10 w-64 sm:w-96 rounded-md bg-gray-200" />
        </div>

        <div className="flex items-center rounded-xl border border-gray-300 bg-white w-full sm:w-auto shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] z-20">
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Leaderboard */}
      <Skeleton className="h-6 w-36 rounded-md" />
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 py-4 px-6 bg-white justify-evenly rounded-xl shadow-md shadow-black/40">
        {[0, 1, 2].map((_, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.33%-0.75rem)] min-h-[70px] rounded-lg p-3 bg-gray-100 flex items-center gap-3 shadow-md"
          >
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-white">
        <table className="min-w-full border-separate border-spacing-y-4">
          <thead className="bg-white rounded-t-2xl shadow-md">
            <tr>
              {[...Array(6)].map((_, idx) => (
                <th key={idx} className="py-3 px-4">
                  <Skeleton className="h-4 w-16 rounded-md" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="space-y-3 p-3 sm:p-4">
            {[...Array(4)].map((_, rowIdx) => (
              <tr
                key={rowIdx}
                className="bg-white hover:bg-gray-50 shadow-md rounded-md cursor-pointer transition"
              >
                {[...Array(6)].map((_, cellIdx) => (
                  <td key={cellIdx} className="py-3 px-4">
                    <Skeleton className="h-4 w-full rounded-md" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

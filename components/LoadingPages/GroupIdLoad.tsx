"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function GroupDetailPageSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-6 animate-pulse bg-[#f9f5f2] min-h-screen">
      {/* Page Title */}
      <div className="flex gap-2 items-center">
        <Skeleton className="h-8 w-60 bg-gray-300/90" />
      </div>

      {/* Group Info Card */}
      <Card className="w-full max-w-lg md:max-w-xl shadow-lg z-10">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48 bg-gray-300/90" /> {/* Group name */}
            <Skeleton className="h-4 w-32 bg-gray-300/90" /> {/* Tables row */}
            <Skeleton className="h-4 w-28 bg-gray-300/90" /> {/* Tables row */}
          </div>
          <Skeleton className="hidden sm:block h-16 w-16 bg-gray-300/90 rounded-full" />{" "}
          {/* Image */}
        </CardHeader>
      </Card>

      {/* Orders Card */}
      <Card className="w-full max-w-lg md:max-w-xl shadow-lg flex flex-col z-10">
        <CardHeader>
          <Skeleton className="h-6 w-40 bg-gray-300/90" />
        </CardHeader>
        <CardContent className="flex flex-col h-[50vh] space-y-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-zinc-200/70 bg-white h-14 sm:h-16"
            >
              <Skeleton className="h-full w-12 sm:w-14 bg-gray-300/90 rounded-l-lg" />{" "}
              {/* Item image */}
              <div className="flex-1 px-2 py-1 space-y-1">
                <Skeleton className="h-4 w-32 bg-gray-300/90" />{" "}
                {/* Item name */}
                <Skeleton className="h-3 w-24 bg-gray-300/90" />{" "}
                {/* Qty & waiter */}
              </div>
              <Skeleton className="h-4 w-16 bg-gray-300/90 mr-2 sm:mr-5" />{" "}
              {/* Amount */}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Billing Card */}
      <Card className="w-full max-w-lg md:max-w-xl shadow-lg z-10">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-gray-300/90" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-24 bg-gray-300/90" />
              <Skeleton className="h-4 w-16 bg-gray-300/90" />
            </div>
          ))}

          <div className="flex justify-between border-t border-zinc-200 pt-2">
            <Skeleton className="h-5 w-24 bg-gray-300/90" />
            <Skeleton className="h-5 w-16 bg-gray-300/90" />
          </div>

          <Skeleton className="h-10 w-full sm:w-40 bg-orange-300/80 rounded-lg mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}

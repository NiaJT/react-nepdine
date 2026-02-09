"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GroupsPageSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-6 animate-pulse bg-[#f9f5f2] min-h-screen">
      {/* Page Title */}
      <div>
        <Skeleton className="h-10 w-64 mb-4 bg-gray-300/90" />
      </div>

      {/* Open Group Card */}
      <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg shadow-lg overflow-hidden">
        <CardContent className="p-3">
          <Skeleton className="h-8 w-3/4 mb-2 bg-gray-300/90" /> {/* Input */}
          <Skeleton className="h-8 w-1/2 bg-gray-300/90" /> {/* People */}
        </CardContent>
      </Card>

      {/* Active Groups Card */}
      <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40 bg-gray-300/90" />
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Group List Skeleton */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-white rounded-lg shadow-sm"
            >
              <Skeleton className="h-5 w-32 bg-gray-300/90" />{" "}
              {/* Group name */}
              <Skeleton className="h-4 w-16 bg-gray-300/90" />{" "}
              {/* People count */}
              <Skeleton className="h-4 w-20 bg-gray-300/90 sm:ml-auto" />{" "}
              {/* Tables */}
            </div>
          ))}

          {/* No groups fallback */}
          <Skeleton className="h-5 w-full bg-gray-300/90 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}

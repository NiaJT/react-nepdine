"use client";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChartLineMultiple } from "@/components/chart-line-interactive";
import Image from "next/image";
import { useEffect, useState } from "react";
import React from "react";
import { useRestaurantDashboard } from "@/hooks/useRestaurantDashboard";
import { DashBoardSkeletonLoad } from "../LoadingPages/DashBoardLoad";
interface MenuItemPreview {
  src?: string;
  name?: string;
  rating: string;
}
export default function DashboardPage() {
  const colors = ["#FFE6D5", "#FF692E", "#771A0D"];

  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("restaurant_id") || "";
    setRestaurantId(id);
  }, []);
  const { data, isLoading, isError } = useRestaurantDashboard(restaurantId);

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  if (isLoading) return <DashBoardSkeletonLoad />;

  if (isError || !data) return <div>Something went wrong</div>;

  // Top card values
  const totalMenuItemsSold =
    data.menu_items_sold_today?.reduce(
      (sum: number, item: { quantity: number }) => sum + item.quantity,
      0
    ) ?? 0;

  const totalCustomers = data.total_customers_today ?? 0;
  const expensesToday = data.earnings_today ?? 0;

  // Best Sellers
  type BestSeller = {
    image?: string;
    name?: string;
    rating?: number | string;
  };

  const bestSellers =
    data.best_sellers && data.best_sellers.length > 0
      ? data.best_sellers.slice(0, 3).map((item: BestSeller) => ({
          src: item.image,
          name: item.name,
          rating: `${item.rating ?? 0}⭐`,
        }))
      : [
          { src: "/bestseller1.svg", name: "No data", rating: "0⭐" },
          { src: "/bestseller2.svg", name: "No data", rating: "0⭐" },
          { src: "/bestseller3.svg", name: "No data", rating: "0⭐" },
        ];

  // Heatmap sales
  const sales = data.heatmap?.matrix || [];
  const maxSale = sales.flat().length ? Math.max(...sales.flat()) : 0;

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-5">
      {" "}
      {/* Top three dashboard cards */}
      <h1 className="text-xl text-center sm:text-left sm:text-3xl font-bold text-zinc-900 mb-4">
        DASH
        <span className="text-[#FB8A22] text-xl sm:text-3xl font-bold">
          BOARD
        </span>
      </h1>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-25 text-[10px] sm:text-xs md:text-sm lg:text-base w-full">
        {[
          {
            title: "Menu Items Sold",
            href: "/balance",
            value: totalMenuItemsSold,
            className: "bg-[#FF993A] text-white h-25",
            curveColor: "#FF5500",
          },
          {
            title: "Customers",
            href: "/balance",
            value: totalCustomers,
            className: "bg-[#FFD143] text-white h-25",
            curveColor: "#FFAA00",
          },
          {
            title: "Expenses",
            href: "/balance",
            value: `Rs ${expensesToday}`,
            className: "bg-[#8AC53E] text-white h-25",
            curveColor: "#006838",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="transform scale-90 sm:scale-95 md:scale-100 origin-top"
          >
            <DashboardCard {...card} description="Today" />
          </div>
        ))}
      </div>
      {/* Bottom section */}
      <div className="flex flex-col gap-10 w-full md:grid md:grid-cols-5 md:gap-10">
        {/* Chart + Best Sellers */}
        <div className="flex flex-col gap-6 w-full md:col-span-3">
          {/* Sales Overview Chart */}
          <div className="block">
            <ChartLineMultiple
              last30Days={data.sales_overview?.last_30_days || []}
              thisWeekTotal={data.sales_overview?.this_week?.[0]?.total || 0}
              lastWeekTotal={data.sales_overview?.last_week?.[0]?.total || 0}
              averageCustomers={
                data.sales_overview?.average_customers_last_30_days || 0
              }
            />
          </div>

          {/* Best Sellers */}
          <Card className="hover:shadow-md transition-shadow p-4 w-full">
            <CardHeader>
              <CardTitle className="text-[#391713] mb-5">
                Best Sellers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between">
                {bestSellers.map((item: MenuItemPreview, idx: number) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center min-w-[80px]"
                  >
                    <div className="relative w-full h-28 sm:h-32">
                      <Image
                        src={item.src || `\fallback.webp`}
                        alt={item.name || "Best Seller"}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-lg"
                      />
                      <div className="absolute top-2 right-2 w-6 h-6 bg-white text-red-500 text-sm flex items-center justify-center rounded-full shadow">
                        ❤️
                      </div>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-[#E95322] font-semibold truncate">
                      {item.name || "N/A"}
                    </p>
                    <p className="text-xs sm:text-sm flex gap-1 mt-2">
                      <span className="text-[#391713]">Rated:</span>
                      <span className="bg-[#E95322] text-white px-2 py-0.5 rounded-full">
                        {item.rating || "0⭐"}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Peak Hour */}
        <div className="w-full md:col-span-2">
          <Card className="hover:shadow-md transition-shadow w-full overflow-hidden">
            <CardHeader>
              <CardTitle className="text-[#391713]">Peak Hour</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 w-full">
              <div className="overflow-x-auto w-full">
                {data?.heatmap?.days && data?.heatmap?.hours ? (
                  <div className="mt-8 grid grid-cols-[50px_repeat(7,minmax(0,1fr))] gap-1 text-[#737373] w-full">
                    <div></div>
                    {data.heatmap.days.map((day: string, i: number) => (
                      <div
                        key={i}
                        className="text-xs text-center font-medium truncate"
                      >
                        {day}
                      </div>
                    ))}

                    {data.heatmap.hours.map((hour, hourIdx) => (
                      <React.Fragment key={hourIdx}>
                        <div className="text-xs text-right pr-1">{hour}:00</div>
                        {data.heatmap.days.map((_, dayIdx) => {
                          const saleCount = sales[dayIdx]?.[hourIdx] || 0; // ✅ correct order
                          const intensity = maxSale ? saleCount / maxSale : 0;
                          const colorIndex = Math.floor(
                            intensity * (colors.length - 1)
                          );
                          const backgroundColor = colors[colorIndex];
                          return (
                            <div
                              key={`cell-${hourIdx}-${dayIdx}`}
                              className="h-6 rounded-[3px] border border-gray-200 w-full"
                              style={{ backgroundColor }}
                              title={`${saleCount} sold`}
                            />
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-8 text-center">
                    No peak hour data available.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// DashboardCard component
function DashboardCard({
  title,
  description,
  href,
  value,
  imageSrc,
  className = "",
  curveColor = "",
}: {
  title: string;
  description: string;
  value?: string | number;
  href: string;
  imageSrc?: string;
  className?: string;
  curveColor?: string;
}) {
  return (
    <Link href={href} className="block">
      <Card
        className={`hover:shadow-md transition-shadow relative overflow-hidden rounded-2xl ${className}`}
      >
        {imageSrc && (
          <div className="relative w-full h-32">
            <Image
              src={imageSrc}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-t-2xl"
            />
          </div>
        )}

        {/* Always show curve color */}
        <div
          className="absolute -bottom-8 -right-8 w-40 h-16 rounded-full"
          style={{ backgroundColor: curveColor + "33" }}
        ></div>

        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-xs text-white">
            {description}
          </CardDescription>
        </CardHeader>

        <div className="absolute right-5 bottom-0 text-white text-lg font-medium z-10">
          {value ?? 0}
        </div>
      </Card>
    </Link>
  );
}

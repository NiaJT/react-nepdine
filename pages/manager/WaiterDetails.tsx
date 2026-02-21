"use client";
import { useRouter } from "@/lib/useRouter";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";

import { axiosInstance } from "@/lib/axios.instance";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { WaiterFormValues } from "@/validation-schema/waiterSchema";
import type { OrderResponse } from "@/validation-schema/orderSchema";
import { ChevronDownIcon } from "lucide-react";
import WaiterDetailPageSkeleton from "@/components/LoadingPages/WaiterIdLoad";

export default function WaiterDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const [waiterList, setWaiterList] = useState<WaiterFormValues[]>([]); // all waiters
  const [selectedWaiter, setSelectedWaiter] = useState<WaiterFormValues | null>(
    null,
  );

  useEffect(() => {
    const id = localStorage.getItem("restaurant_id");
    queueMicrotask(() => setRestaurantId(id));
  }, []);

  useEffect(() => {
    if (!restaurantId) return;
    axiosInstance
      .get(`/restaurants/${restaurantId}/waiters`)
      .then((res) => setWaiterList(res.data))
      .catch((err) => console.error("Error fetching waiters list:", err));
  }, [restaurantId]);

  useEffect(() => {
    if (!restaurantId || !id) return;
    axiosInstance
      .get(`/restaurants/${restaurantId}/waiters/${id}`)
      .then((res) => setSelectedWaiter(res.data))
      .catch((err) => console.error("Error fetching waiter:", err));
  }, [id, restaurantId]);

  const handleSelectWaiter = (waiterId: string) => {
    router.push(`/waiters/${waiterId}`);
  };

  const { data: orders = [], error } = useQuery({
    queryKey: ["waiterOrders", restaurantId, id],
    enabled: !!restaurantId && !!id,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/restaurants/${restaurantId}/waiters/${id}/orders`,
      );
      const data = res.data;
      if (!data) return [];
      if (Array.isArray(data)) return data;

      if (Array.isArray(data.orders)) return data.orders;

      if (data.data && Array.isArray(data.data.orders)) return data.data.orders;

      return [];
    },
  });
  if (axios.isAxiosError(error)) {
    console.log(error.response?.data);
  }
  const safeOrders = useMemo(() => {
    return Array.isArray(orders) ? orders : [];
  }, [orders]);

  const dateRangeOptions = [
    "Today",
    "Yesterday",
    "This Week",
    "This Month",
    "Last 6 Months",
    "This Year",
  ] as const;
  type DateRange = (typeof dateRangeOptions)[number];

  const [lineChartDateRange, setLineChartDateRange] =
    useState<DateRange>("Today");
  const [pieChartDateRange, setPieChartDateRange] =
    useState<DateRange>("Today");

  const pieData = useMemo(() => {
    return [
      { name: "Excellent", value: 100 },
      { name: "good", value: 50 },

      { name: "Satisfactory", value: 30 },
      { name: "decent", value: 10 },
      { name: "Not Good", value: 25 },
    ];
  }, []);

  const PieColors = ["#4318FF", "#6AD2FF", "#EFF4FB"];

  const filterOrdersByDateRange = useCallback(
    (orders: OrderResponse[], dateRange: DateRange) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return orders.filter((o) => {
        const closed = new Date(o.created_at);
        closed.setHours(0, 0, 0, 0);

        switch (dateRange) {
          case "Today": {
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            return closed >= today && closed < tomorrow;
          }
          case "Yesterday": {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            return closed >= yesterday && closed < today;
          }
          case "This Week": {
            const start = new Date(today);
            start.setDate(today.getDate() - today.getDay());
            const end = new Date(start);
            end.setDate(start.getDate() + 7);
            return closed >= start && closed < end;
          }
          case "This Month":
            return (
              closed.getMonth() === today.getMonth() &&
              closed.getFullYear() === today.getFullYear()
            );
          case "Last 6 Months": {
            const sixMonthsAgo = new Date(today);
            sixMonthsAgo.setMonth(today.getMonth() - 6);
            return closed >= sixMonthsAgo && closed <= today;
          }
          case "This Year":
            return closed.getFullYear() === today.getFullYear();
          default:
            return true;
        }
      });
    },
    [], // no dependencies, function identity is stable
  );

  const filteredLineChartOrders = useMemo(() => {
    return filterOrdersByDateRange(safeOrders, lineChartDateRange);
  }, [safeOrders, lineChartDateRange, filterOrdersByDateRange]);

  type TotalType = "orders" | "revenue";

  const totalType: TotalType = "orders";

  const lineData = useMemo(() => {
    const grouped: Record<string, { total: number; dateObj: Date }> = {};

    filteredLineChartOrders.forEach((o) => {
      const createdAt =
        typeof o.created_at === "string"
          ? new Date(o.created_at)
          : o.created_at;

      // Generate x-axis label
      let xLabel = "";
      switch (lineChartDateRange) {
        case "Today":
        case "Yesterday":
          xLabel = format(createdAt, "hh:mm a");
          break;
        case "This Week":
          xLabel = format(createdAt, "EEE");
          break;
        case "This Month":
          xLabel = format(createdAt, "d MMM");
          break;
        case "Last 6 Months":
        case "This Year":
          xLabel = format(createdAt, "MMM");
          break;
        default:
          xLabel = format(createdAt, "P");
      }

      if (!grouped[xLabel]) {
        grouped[xLabel] = { total: 0, dateObj: createdAt };
      }

      // ✅ Count orders or sum revenue
      grouped[xLabel].total +=
        totalType === "orders" ? 1 : Number(o.total ?? 0);
    });

    return Object.entries(grouped)
      .sort((a, b) => a[1].dateObj.getTime() - b[1].dateObj.getTime())
      .map(([date, data]) => ({
        date,
        total: data.total,
      }));
  }, [filteredLineChartOrders, lineChartDateRange, totalType]);

  function isSameMonth(d1: Date, d2: Date) {
    return (
      d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
    );
  }

  function isSameDay(d1: Date, d2: Date) {
    return d1.toDateString() === d2.toDateString();
  }

  function isSameWeek(d1: Date, d2: Date) {
    const startOfWeek = (date: Date) => {
      const d = new Date(date);
      d.setDate(d.getDate() - d.getDay());
      d.setHours(0, 0, 0, 0);
      return d;
    };
    const endOfWeek = (date: Date) => {
      const d = new Date(date);
      d.setDate(d.getDate() - d.getDay() + 6);
      d.setHours(23, 59, 59, 999);
      return d;
    };
    return d1 >= startOfWeek(d2) && d1 <= endOfWeek(d2);
  }

  const today = new Date();

  const totalOrdersToday = safeOrders.filter((o) =>
    isSameDay(new Date(o.created_at), today),
  ).length;

  const totalOrdersWeek = safeOrders.filter((o) =>
    isSameWeek(new Date(o.created_at), today),
  ).length;

  const totalOrdersMonth = safeOrders.filter((o) =>
    isSameMonth(new Date(o.created_at), today),
  ).length;

  const totalDays = new Set(
    safeOrders.map((o) => new Date(o.created_at).toDateString()),
  ).size;

  const averagePerformance = totalDays
    ? (
        1 +
        ((orders.length / totalDays - 1) / (orders.length / totalDays)) * 4
      ).toFixed(1)
    : "0";

  // Inside your component render:
  if (!restaurantId || !selectedWaiter || orders === undefined) {
    return <WaiterDetailPageSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-5 relative">
      <div className="flex sm:justify-between sm:flex-row flex-col">
        <h1 className="text-2xl sm:text-3xl font-bold leading-[100%] tracking-[3%] text-center uppercase mb-3">
          WAITER&apos;S
          <span className="text-[#FB8A22] text-2xl sm:text-3xl font-bold">
            {" "}
            OVERVIEW
          </span>
        </h1>

        {/* Waiter Selector */}
        <div className="flex items-center rounded-xl border border-gray-300 bg-white w-[200px] sm:w-auto shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] z-20 mb-6 ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center border-l border-gray-300 px-4 sm:px-6 py-2 cursor-pointer hover:bg-gray-100 transition rounded-xl">
                <Image
                  src="/icons/user.svg"
                  width={20}
                  height={20}
                  alt="User Icon"
                />
                <span className="ml-2 font-bold text-sm text-black/80 truncate capitalize">
                  {selectedWaiter?.name ?? "Waiter"}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-black/50 ml-1" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white shadow-md rounded-md mt-1 py-1 w-40 h-60 overflow-y-auto">
              {waiterList.map((w, idx) => (
                <div key={w.id}>
                  <DropdownMenuItem
                    onClick={() => handleSelectWaiter(w.id)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                  >
                    {w.name}
                  </DropdownMenuItem>
                  {idx !== waiterList.length - 1 && (
                    <div className="border-b border-gray-200 mx-2" />
                  )}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div>
        {/* Stats Cards */}

        <div className="flex flex-wrap justify-between gap-6 mb-9">
          {[
            {
              title: "Total Orders Today",
              value: totalOrdersToday,
              icon: "/icons/bell.svg",
              iconBg: "bg-red-100",
              isIconify: false,
            },
            {
              title: "Total Orders This Week",
              value: totalOrdersWeek,
              icon: "/icons/paper.svg",
              iconBg: "bg-red-100",
              isIconify: false,
            },
            {
              title: "Total Orders This Month",
              value: totalOrdersMonth,
              icon: "material-symbols-light:order-approve-outline-sharp",
              iconBg: "bg-red-100",
              isIconify: true,
            },
            {
              title: "Average Rating",
              value: averagePerformance,
              icon: "material-symbols:star",
              iconBg: "bg-yellow-100",
              isIconify: true,
              iconColor: "text-yellow-500",
            },
          ].map((card, idx) => (
            <Card
              key={idx}
              className="w-[233px] h-[90px]  shadow-md rounded-[20px]
             [@media(min-width:1400px)]:w-[270px]
             [@media(min-width:1400px)]:h-[110px]"
            >
              <CardContent className="flex items-center gap-4 p-2 min-h-full w-full">
                <div
                  className={`rounded-full ${card.iconBg} flex items-center justify-center 
          w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 shrink-0`}
                >
                  {card.isIconify ? (
                    <Icon
                      icon={card.icon}
                      className={`${card.iconColor ?? "text-red-500"} w-5 h-5 md:w-6 md:h-6`}
                    />
                  ) : (
                    <Image
                      src={card.icon}
                      alt={card.title}
                      width={40}
                      height={40}
                      className="w-5 h-5 md:w-6 md:h-6"
                    />
                  )}
                </div>
                <div className="flex-1 w-full text-left">
                  <CardTitle className="text-[12px] leading-[24px] tracking-[-0.02em] font-medium font-poppins text-zinc-700">
                    {card.title}
                  </CardTitle>
                  <p className="text-[20px] leading-[24px] tracking-[-0.02em] font-medium font-poppins text-[#2B3674]">
                    {card.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Line Chart */}
          <Card className="w-full  shadow-md rounded-2xl">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <CardTitle className="text-base sm:text-lg">
                Order Distribution
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-lg px-2 sm:px-3 md:px-4 py-1 sm:py-5 text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                  >
                    {lineChartDateRange}
                    <Icon
                      icon="mingcute:calendar-line"
                      className="text-purple-900 w-4 h-4"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white rounded-md shadow-md border p-1">
                  {dateRangeOptions.map((opt) => (
                    <DropdownMenuItem
                      key={opt}
                      onClick={() => setLineChartDateRange(opt)}
                      className="cursor-pointer px-3 py-1 text-xs sm:text-sm"
                    >
                      {opt}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="h-10 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#FB8A22" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="hidden justify-between ">
            <Card className="flex flex-col">
              <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <CardTitle className="text-[#2B3674]">
                  Rating Distribution
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-lg px-3 py-1 text-xs md:text-sm flex items-center gap-2 text-purple-900/70"
                    >
                      {pieChartDateRange}
                      <Icon
                        icon="bxs:down-arrow"
                        className="w-3 h-3 text-purple-900/70"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white rounded-md shadow-md border p-1">
                    {dateRangeOptions.map((opt) => (
                      <DropdownMenuItem
                        key={opt}
                        onClick={() => setPieChartDateRange(opt)}
                        className="cursor-pointer px-3 py-1 text-xs md:text-sm"
                      >
                        {opt}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="h-64 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PieColors[index % PieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-6 mt-4">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <span
                        className="font-semibold text-xs md:text-sm"
                        style={{ color: PieColors[index % PieColors.length] }}
                      >
                        {entry.name}
                      </span>
                      <span className="text-xs md:text-sm text-gray-600">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

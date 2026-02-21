"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  LayoutGrid,
  ChevronUp,
} from "lucide-react";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { axiosInstance } from "@/lib/axios.instance";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import type { BalanceItem } from "@/validation-schema/balanceSchema";
import BalancePageSkeleton from "@/components/LoadingPages/BalanceLoad";

type DisplayRow = {
  id?: string;
  date: string;
  time: string;
  group: string;
  table_names: string[];
  waiter_names: string[];
  total: number;
  items: { name?: string; quantity?: number; total_amount?: string }[];
};
const formatLocalDate = (date?: Date) => {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// const localBalances: BalanceItem[] = [
//   {
//     group_id: "1",
//     group_name: "Lunch Orders",
//     table_names: ["Table 1", "Table 2"],
//     waiter_names: ["John", "Alice"],
//     subtotal: "1000",
//     discount: "50",
//     service_charge: "100",
//     tax: "80",
//     total: "1130",
//     checks_count: 2,
//     last_closed_at: "2025-10-18T13:30:00Z",
//     items: [
//       { name: "Burger", quantity: 2, total_amount: "500" },
//       { name: "Fries", quantity: 3, total_amount: "300" },
//     ],
//   },
//   {
//     group_id: "2",
//     group_name: "Dinner Orders",
//     table_names: ["Table 3"],
//     waiter_names: ["Bob"],
//     subtotal: "800",
//     discount: "0",
//     service_charge: "80",
//     tax: "64",
//     total: "944",
//     checks_count: 1,
//     last_closed_at: "2025-10-11T19:45:00Z",
//     items: [
//       { name: "Pizza", quantity: 1, total_amount: "400" },
//       { name: "Salad", quantity: 2, total_amount: "200" },
//     ],
//   },
// ];

export default function BalancePage() {
  const pageSize = 18;
  const [query, setQuery] = useState("");
  const dateOptions = [
    "Today",
    "Yesterday",
    "This Week",
    "This Month",
    "Last 6 Months",
    "This Year",
    "All",
    "Custom",
  ] as const;
  type DateRangeType = (typeof dateOptions)[number];
  const [dateRange, setDateRange] = useState<DateRangeType>("Today");
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [enableCalendar, setEnableCalendar] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("restaurant_id");
    queueMicrotask(() => {
      setRestaurantId(id);
    });
  }, []);

  const { data: balances = [], isPending } = useQuery({
    queryKey: ["balances", query, fromDate, restaurantId, toDate],
    enabled: !!restaurantId,
    queryFn: async () => {
      let res;
      if (toDate) {
        res = await axiosInstance.get(
          `restaurants/${restaurantId}/balance-sheet/by-group`,
          {
            params: {
              query,
              from_date: formatLocalDate(fromDate),
              to_date: formatLocalDate(toDate),
            },
          },
        );
      } else {
        res = await axiosInstance.get(
          `restaurants/${restaurantId}/balance-sheet/by-group`,
          {
            params: {
              query,
              from_date: formatLocalDate(fromDate),
              to_date: formatLocalDate(new Date()),
            },
          },
        );
      }
      console.log("API Response:", res.data);
      return res.data.items ?? [];
    },
  });

  const [columns, setColumns] = useState({
    date: true,
    time: true,
    group: true,
    items: true,
    tableNo: true,
    waiter: true,
    total: true,
  });

  const toggleColumn = (col: keyof typeof columns) => {
    setColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }

    return pages;
  };

  useEffect(() => {
    const now = new Date();

    if (dateRange === "All") {
      queueMicrotask(() => setFromDate(undefined));
    } else if (dateRange === "Today") {
      queueMicrotask(() => {
        setFromDate(now);
        setEnableCalendar(false);
        setToDate(undefined);
      });
    } else if (dateRange === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      queueMicrotask(() => {
        setFromDate(yesterday);
        setEnableCalendar(false);
        setToDate(undefined);
      });
    } else if (dateRange === "This Week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      queueMicrotask(() => {
        setFromDate(startOfWeek);
        setEnableCalendar(false);
        setToDate(undefined);
      });
    } else if (dateRange === "This Month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      queueMicrotask(() => {
        setFromDate(startOfMonth);
        setEnableCalendar(false);
        setToDate(undefined);
      });
    } else if (dateRange === "Last 6 Months") {
      const last6Months = new Date(now);
      last6Months.setMonth(now.getMonth() - 6);
      queueMicrotask(() => {
        setFromDate(last6Months);
        setEnableCalendar(false);
        setToDate(undefined);
      });
    } else if (dateRange === "This Year") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      queueMicrotask(() => {
        setFromDate(startOfYear);
        setEnableCalendar(false);
        setToDate(undefined);
      });
    } else if (dateRange === "Custom") {
      queueMicrotask(() => setEnableCalendar(true));
    }
  }, [dateRange, enableCalendar]);

  const computed = (balances ?? [])
    .filter((row: { group_name: string }) =>
      query
        ? row.group_name?.toLowerCase().includes(query.toLowerCase())
        : true,
    )
    .filter((row: { last_closed_at: string | number | Date }) => {
      if (!fromDate) return true;

      const rowDate = new Date(row.last_closed_at);

      if (dateRange === "Today" || dateRange === "Yesterday") {
        return rowDate.toDateString() === fromDate.toDateString();
      }

      return rowDate >= fromDate;
    });

  const getFilteredRows = () => {
    const now = new Date();

    return computed.filter(
      (row: { last_closed_at: string | number | Date }) => {
        if (!row.last_closed_at) return false;
        const rowDate = new Date(row.last_closed_at);
        let yesterday;

        switch (dateRange) {
          case "Today":
            return (
              rowDate.getFullYear() === now.getFullYear() &&
              rowDate.getMonth() === now.getMonth() &&
              rowDate.getDate() === now.getDate()
            );
          case "Yesterday":
            yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            return (
              rowDate.getFullYear() === yesterday.getFullYear() &&
              rowDate.getMonth() === yesterday.getMonth() &&
              rowDate.getDate() === yesterday.getDate()
            );
          case "This Year":
            return rowDate.getFullYear() === now.getFullYear();
          case "All":
          default:
            return true;
        }
      },
    );
  };

  // const getOrderItems = (row: any) => {
  //   return {
  //     items: row.items?.map((i: any) => ({
  //       id: i.id ?? "",
  //       name: i.name ?? "Unknown Item",
  //       quantity: i.quantity ?? 0,
  //     })) || [],
  //     groupName: row.group_name ?? "",
  //     date: row.created_at ? new Date(row.created_at).toLocaleDateString() : "",
  //     time: row.created_at ? new Date(row.created_at).toLocaleTimeString() : "",
  //     category: row.category ?? "",
  //     tableNo: row.table_name ?? "",
  //     total: Number(row.total) || 0,
  //   };
  // };

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(computed.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const filteredRows = getFilteredRows();
  const paginatedRows: DisplayRow[] = filteredRows
    .slice(start, end)
    .map((row: BalanceItem) => ({
      id: row.group_id,
      date: row.last_closed_at
        ? new Date(row.last_closed_at).toLocaleDateString()
        : "N/A",
      time: row.last_closed_at
        ? new Date(row.last_closed_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A",
      group: row.group_name ?? "N/A",
      table_names: row.table_names ?? [],
      waiter_names: row.waiter_names ?? [],
      total: Number(row.total) || 0,
      items: row.items ?? [],
    }));

  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  if (isPending) {
    return <BalancePageSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-5 relative">
      <h1 className="text-xl text-center sm:text-left sm:text-3xl font-bold text-zinc-900 mb-4">
        BALANCE
        <span className="text-[#FB8A22] text-xl sm:text-3xl font-bold">
          {" "}
          SHEET
        </span>
      </h1>

      <Card className="mt-4 px-3 overflow-hidden w-full max-w-[1800px] mx-auto">
        {/* Search & Filters */}
        {/* Search & Filters */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-5">
          {/* Left: Search Box */}
          <div className="flex items-center gap-5">
            <div className="relative w-68 bg-sky-100 rounded-2xl px-1">
              <Input
                className="pl-9 w-full border-none bg-transparent text-sm"
                placeholder="Search group name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search
                size={16}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>

            {/* Date Range Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-sky-100 rounded-2xl cursor-pointer text-black/60"
                >
                  <Icon icon="uil:calendar" className="h-4 w-4 text-gray-500" />
                  {dateRange}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white rounded-lg shadow-md p-2 w-48">
                {dateOptions.map((range) => (
                  <DropdownMenuItem
                    key={range}
                    onClick={() => {
                      setDateRange(range);
                      setFromDate(undefined);
                    }}
                  >
                    {range}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right: Today Button + View */}
          <div className="flex items-center gap-5">
            {/* Today Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <div
                  className={`relative w-37 bg-sky-100 rounded-2xl flex items-center justify-between px-2 py-2 ${
                    !enableCalendar
                      ? "opacity-70 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  title={!enableCalendar ? "Select Custom to pick dates" : ""}
                >
                  <span className="text-gray-500 text-sm">
                    {dateRange === "Custom"
                      ? fromDate && toDate
                        ? `${fromDate.getFullYear()}-${fromDate.getMonth() + 1}-${fromDate.getDate()} to ${toDate.getFullYear()}-${toDate.getMonth() + 1}-${toDate.getDate()}`
                        : "Pick a date range"
                      : !enableCalendar
                        ? "Select Custom Range"
                        : dateRange}
                  </span>
                  <ChevronDown className="text-gray-500" />
                </div>
              </PopoverTrigger>

              {enableCalendar && (
                <PopoverContent className="w-auto p-0 bg-white shadow-lg rounded-xl border">
                  <Calendar
                    mode="range"
                    selected={{ from: fromDate, to: toDate }}
                    onSelect={(
                      range: { from?: Date; to?: Date } | undefined,
                    ) => {
                      if (!range) return;
                      setFromDate(range.from);
                      setToDate(range.to);
                      setDateRange("Custom");
                    }}
                    captionLayout="dropdown"
                    className="rounded-lg border shadow-sm"
                    hidden={{ after: new Date() }}
                    footer={
                      <div className="flex justify-start gap-2 p-2">
                        <button
                          onClick={(): void => {
                            const today = new Date();
                            setFromDate(today);
                            setToDate(today);
                            setDateRange("Custom");
                          }}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Today
                        </button>
                        <button
                          onClick={(): void => {
                            setFromDate(undefined);
                            setToDate(undefined);
                            setDateRange("Custom");
                          }}
                          className="text-sm text-red-500 hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    }
                  />
                </PopoverContent>
              )}
            </Popover>

            {/* View Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[#C3E66E] rounded-2xl cursor-pointer flex items-center gap-1"
                >
                  <LayoutGrid /> View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.keys(columns).map((col) => (
                  <DropdownMenuItem
                    key={col}
                    onClick={() => toggleColumn(col as keyof typeof columns)}
                  >
                    <input
                      type="checkbox"
                      checked={columns[col as keyof typeof columns]}
                      readOnly
                      className="accent-lime-400 w-4 h-5"
                    />
                    <span className="ml-2 capitalize">
                      {col.replace(/([A-Z])/g, " $1")}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border-collapse rounded-3xl overflow-hidden text-sm">
            <thead className="bg-gray-100 text-left text-gray-600">
              <tr>
                {columns.date && <th className="px-4 py-3 border-b">Date</th>}
                {columns.time && <th className="px-4 py-3 border-b">Time</th>}
                {columns.group && <th className="px-4 py-3 border-b">Group</th>}
                {columns.items && <th className="px-4 py-3 border-b">Items</th>}
                {columns.tableNo && (
                  <th className="px-4 py-3 border-b">Table No</th>
                )}
                {columns.waiter && (
                  <th className="px-4 py-3 border-b">Waiter</th>
                )}
                {columns.total && (
                  <th className="px-4 py-3 border-b">Total Amount</th>
                )}
                {/* Empty header for chevron icon */}
                <th className="w-[40px] border-b"></th>
              </tr>
            </thead>

            <tbody>
              {paginatedRows.map((row, index) => {
                const key = row.id ?? `${row.group}-${index}`;
                return (
                  <React.Fragment key={key}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleExpand(key)}
                    >
                      {columns.date && (
                        <td className="px-4 py-3 border-b">{row.date}</td>
                      )}
                      {columns.time && (
                        <td className="px-4 py-3 border-b">{row.time}</td>
                      )}
                      {columns.group && (
                        <td className="px-4 py-3 border-b">{row.group}</td>
                      )}
                      {columns.items && (
                        <td className="px-4 py-3 border-b">
                          {row.items?.length || 0}
                        </td>
                      )}
                      {columns.tableNo && (
                        <td className="px-4 py-3 border-b">
                          {row.table_names?.length || 0}
                        </td>
                      )}
                      {columns.waiter && (
                        <td className="px-4 py-3 border-b">
                          {row.waiter_names?.length || 0}
                        </td>
                      )}
                      {columns.total && (
                        <td className="border-b font-medium">
                          Rs. {Number(row.total || 0).toFixed(2)}
                        </td>
                      )}
                      <td className="px-2 py-3 border-b text-gray-500 text-center w-[40px]">
                        {expandedRows.includes(key) ? (
                          <ChevronUp
                            size={18}
                            className="text-gray-600 inline-block"
                          />
                        ) : (
                          <ChevronDown
                            size={18}
                            className="text-gray-600 inline-block"
                          />
                        )}
                      </td>
                    </tr>

                    {expandedRows.includes(key) && (
                      <tr className="bg-gray-50" key={`${key}-details`}>
                        {/* Empty placeholders to align under main columns */}
                        {columns.date && (
                          <td className="px-4 py-3 border-b"></td>
                        )}
                        {columns.time && (
                          <td className="px-4 py-3 border-b"></td>
                        )}
                        {columns.group && (
                          <td className="px-4 py-3 border-b"></td>
                        )}

                        {/* Items column */}
                        {columns.items && (
                          <td className="px-4 py-3 border-b align-top">
                            {row.items?.length ? (
                              <div className="space-y-1">
                                {row.items.map((item) => (
                                  <div key={item.name}>
                                    • {item.name} × {item.quantity}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span>No items</span>
                            )}
                          </td>
                        )}

                        {/* Table names column */}
                        {columns.tableNo && (
                          <td className="px-4 py-3 border-b align-top">
                            {row.table_names?.length ? (
                              <div className="space-y-1">
                                {row.table_names.map((table, i) => (
                                  <div key={`${table}-${i}`}>• {table}</div>
                                ))}
                              </div>
                            ) : (
                              <span>No tables</span>
                            )}
                          </td>
                        )}

                        {/* Waiter names column */}
                        {columns.waiter && (
                          <td className="px-4 py-3 border-b align-top">
                            {row.waiter_names?.length ? (
                              <div className="space-y-1">
                                {row.waiter_names.map((waiter, i) => (
                                  <div key={`${waiter}-${i}`}>• {waiter}</div>
                                ))}
                              </div>
                            ) : (
                              <span>No waiters</span>
                            )}
                          </td>
                        )}

                        {/* Total column (keep it empty for alignment) */}
                        {columns.total && (
                          <td className="px-4 py-3 border-b"></td>
                        )}

                        {/* Chevron icon cell placeholder */}
                        <td className="px-2 py-3 border-b"></td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-3 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-2">
          <span>
            Showing {paginatedRows.length} out of {computed.length}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="cursor-pointer rounded-2xl"
              disabled={page === 1}
              onClick={() => setPage(Math.max(page - 1, 1))}
            >
              <ChevronLeft />
            </Button>
            {getPageNumbers().map((p, idx) =>
              typeof p === "number" ? (
                <Button
                  key={idx}
                  className={`rounded-xl ${
                    p === page
                      ? "bg-red-500 text-white hover:bg-red-400"
                      : "bg-zinc-400 hover:bg-red-400"
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ) : (
                <span key={idx} className="px-2 text-gray-500">
                  {p}
                </span>
              ),
            )}
            <Button
              variant="outline"
              className="rounded-2xl"
              disabled={page === totalPages}
              onClick={() => setPage(Math.min(page + 1, totalPages))}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

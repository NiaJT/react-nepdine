"use client";
import { Icon } from "@iconify/react";

import { useRouter } from "@/lib/useRouter";
import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Image from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGroup,
  useGetGroupBill,
  useCheckoutGroup,
} from "@/hooks/auth/useGroups";
import { useOrders } from "@/hooks/auth/useOrders";
import { useWaiters } from "@/hooks/auth/useWaiters";
import { useMenu } from "@/hooks/auth/useMenu";
import GroupDetailPageSkeleton from "@/components/LoadingPages/GroupIdLoad";
import type {
  Order,
  OrderLine,
  Table,
  Waiter,
} from "@/lib/types/globalTypes/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BillData } from "../../lib/thermalBill";
import { handlePrint } from "@/lib/api/superadmin/printbill";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BillPreview } from "@/components/bill/bill-preview";

interface OrderLine2 {
  id: string;
  name: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface BillProps {
  type?: string;
  subtotal: string;
  discount_total: string;
  service_charge: string;
  tax_total: string;
  total: string;
  orders: OrderLine2[];
}

export default function GroupDetailPage() {
  const [waiterFilter, setWaiterFilter] = useState<string>("all");
  const restaurantName =
    localStorage.getItem("restaurant_name") || "Unknown Restaurant";
  const [restaurantId] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("restaurant_id") || ""
      : "",
  );

  const restaurantLocation =
    localStorage.getItem("restaurant_location") || "Unknown Location";

  const router = useRouter();
  const params = useParams();
  const groupId = (params?.id as string) ?? "";

  const { data: group, isLoading: groupLoading } = useGroup(
    restaurantId,
    groupId,
  );
  const { data: ordersData = [], isLoading: ordersLoading } =
    useOrders(restaurantId);
  const { data: waiters = [], isLoading: waitersLoading } =
    useWaiters(restaurantId);
  const { data: menu = [], isLoading: menuLoading } = useMenu(restaurantId);
  const {
    data: bill,
    isLoading: billLoading,
    error: billError,
  } = useGetGroupBill(restaurantId, groupId);
  const { mutate: checkoutGroup, isPending: checkoutLoading } =
    useCheckoutGroup(restaurantId);

  const isLoading =
    groupLoading || ordersLoading || waitersLoading || menuLoading;

  const groupOrders = useMemo(
    () => ordersData.filter((o: Order) => o.group_id === groupId),
    [ordersData, groupId],
  );
  const groupWaiters = useMemo(() => {
    const waiterIds = Array.from(
      new Set(groupOrders.map((o: Order) => o.waiter_id).filter(Boolean)),
    );
    return waiters.filter((w: Waiter) => waiterIds.includes(w.id));
  }, [groupOrders, waiters]);

  const filteredOrders = useMemo(() => {
    if (waiterFilter === "all") return groupOrders;
    if (waiterFilter === "unassigned")
      return groupOrders.filter((o: Order) => !o.waiter_id);
    return groupOrders.filter((o: Order) => o.waiter_id === waiterFilter);
  }, [groupOrders, waiterFilter]);
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onNoPrinter?.(() => alert("No USB printer found!"));
      window.electronAPI.onPrintSuccess?.(() => alert("Print sent!"));
      window.electronAPI.onPrintError?.((msg) => alert("Print error: " + msg));
    }
  }, []);

  const [currentDateTime] = useState(() => {
    const now = new Date();
    return now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  });
  const [discount, setDiscount] = useState<string>("0");
  const [serviceCharge, setServiceCharge] = useState<string>("0");
  const [tax, setTax] = useState<string>("0");

  useEffect(() => {
    if (!bill) return;

    setDiscount((prev) => (prev === "0" ? (bill.discount_total ?? "0") : prev));
    setServiceCharge((prev) =>
      prev === "0" ? (bill.service_charge ?? "0") : prev,
    );
    setTax((prev) => (prev === "0" ? (bill.tax_total ?? "0") : prev));
  }, [bill]);

  const discountNum = parseFloat(discount) || 0;
  const serviceChargeNum = parseFloat(serviceCharge) || 0;
  const taxNum = parseFloat(tax) || 0;
  const subtotal = parseFloat(bill?.subtotal || "0") || 0;

  const discountedAmount = subtotal - (discountNum / 100) * subtotal;
  const discount_total = subtotal - discountedAmount;
  const taxAmount = (taxNum / 100) * discountedAmount;
  const finalTotal = discountedAmount + taxAmount + serviceChargeNum;
  console.log("window.electronAPI:", window.electronAPI);

  if (isLoading) return <GroupDetailPageSkeleton />;

  return (
    <div className="grid gap-3 p-4 md:p-6 max-w-[600px] justify-center md:justify-between ">
      <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left leading-[100%] tracking-[3%] uppercase mb-3">
        OPEN
        <span className="text-[#FB8A22] text-2xl sm:text-3xl font-bold">
          {" "}
          GROUP
        </span>
      </h1>

      <div className="absolute top-0 right-0 z-0 pointer-events-none">
        <Image
          src="/open_group_img1.svg"
          alt="Group decor"
          width={200}
          height={200}
          className="max-w-[35vw] h-auto"
        />
      </div>

      <div className="absolute bottom-0 right-0 z-0 pointer-events-none">
        <Image
          src="/open_group_img2.svg"
          alt="Group decor"
          width={200}
          height={200}
          className="max-w-[35vw] h-auto"
        />
      </div>

      {/* Group Info */}
      {group && (
        <Card className="w-full max-w-lg md:max-w-xl shadow-lg z-10">
          <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <CardTitle className="text-[#FB8A22] text-xl font-semibold">
                {group.name} Group
              </CardTitle>
              <div className="mt-1 flex flex-col gap-1 text-xs">
                {group.tables && group.tables.length > 0 ? (
                  (() => {
                    const tablesByRoom: Record<
                      string,
                      { name: string; tables: string[] }
                    > = {};
                    group.tables.forEach((table: Table) => {
                      if (!tablesByRoom[table.room_id]) {
                        tablesByRoom[table.room_id] = {
                          name: table.room_name ?? "Unknown Room",
                          tables: [],
                        };
                      }
                      tablesByRoom[table.room_id].tables.push(
                        table.name ?? table.id,
                      );
                    });
                    return Object.entries(tablesByRoom).map(
                      ([roomId, room]) => (
                        <div
                          key={roomId}
                          className="flex flex-wrap gap-1 items-center text-xs"
                        >
                          <span className="font-medium text-[#FB8A22]">
                            {room.name}:
                          </span>
                          <span className="rounded-full border border-[#C4C4C4] bg-zinc-50 px-2 py-0.5 text-xs">
                            {room.tables.join(", ")}
                          </span>
                        </div>
                      ),
                    );
                  })()
                ) : (
                  <span className="text-xs text-zinc-600">
                    No tables assigned
                  </span>
                )}
              </div>
            </div>
            <Image
              src="/open_group_img3.png"
              alt={group.name}
              width={80}
              height={80}
              className="hidden sm:block"
            />
          </CardHeader>
        </Card>
      )}

      {/* Orders Section (original design preserved) */}
      <Card className="w-full max-w-lg md:max-w-xl shadow-lg flex flex-col z-10">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-[#FB8A22] sm:text-lg md:text-xl">
              Orders
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 rounded-lg border border-zinc-400 bg-white px-3 text-sm"
                >
                  {waiterFilter === "all"
                    ? "All waiters"
                    : waiterFilter === "unassigned"
                      ? "Unassigned"
                      : (groupWaiters.find((w: Waiter) => w.id === waiterFilter)
                          ?.name ?? "Select waiter")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={5}
                className="min-w-[--radix-dropdown-menu-trigger-width] bg-white border border-zinc-200 rounded-md shadow-lg z-50"
              >
                <DropdownMenuItem onClick={() => setWaiterFilter("all")}>
                  All waiters
                </DropdownMenuItem>
                {groupOrders.some((o: Order) => !o.waiter_id) && (
                  <DropdownMenuItem
                    onClick={() => setWaiterFilter("unassigned")}
                  >
                    Unassigned
                  </DropdownMenuItem>
                )}
                {groupWaiters.map((w: Waiter) => (
                  <DropdownMenuItem
                    key={w.id}
                    onClick={() => setWaiterFilter(w.id)}
                  >
                    {w.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col h-[50vh]">
          <div className="flex-1 overflow-y-auto space-y-1">
            {filteredOrders.map((o: Order) => {
              const item = menu.find((m: OrderLine) => m.id === o.item_id);
              return (
                <div
                  key={o.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200/70 bg-white shadow-sm overflow-hidden h-14 sm:h-16"
                >
                  <div className="relative h-full w-10 sm:w-12 shrink-0">
                    {item?.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="absolute inset-0 rounded-l-xl object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 px-2 py-1 flex flex-col justify-center text-[9px] sm:text-xs md:text-sm">
                    <div className="font-medium text-zinc-900 truncate">
                      {item?.name}
                    </div>
                    <div className="text-zinc-600 truncate">
                      Qty {o.quantity} {o.note ? `• ${o.note}` : ""}
                      {o.waiter_id && (
                        <span className="ml-1">
                          •{" "}
                          {waiters.find((w: Waiter) => w.id === o.waiter_id)
                            ?.name ?? "—"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[9px] sm:text-sm md:text-md font-medium mr-2 sm:mr-5 truncate">
                    रु{(item ? item.price * o.quantity : 0).toFixed(2)}
                  </div>
                </div>
              );
            })}
            {filteredOrders.length === 0 && (
              <div className="text-[9px] sm:text-xs text-zinc-600">
                {groupOrders.length === 0
                  ? "No orders yet."
                  : "No orders match the current filter."}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Billing Section */}
      <Card className="w-full max-w-lg md:max-w-xl shadow-lg z-10">
        <CardHeader>
          <CardTitle className="text-[#FB8A22] font-medium">Billing</CardTitle>
        </CardHeader>
        <CardContent>
          {billLoading ? (
            <div>Loading bill...</div>
          ) : billError ? (
            <div className="text-red-500">Failed to load bill.</div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <div>Food total</div>
                <div>रु {subtotal.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="discount"
                    className="text-xs font-medium mb-1"
                  >
                    Discount (%)
                  </label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="border border-[#C4C4C4] bg-zinc-100 text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="serviceCharge"
                    className="text-xs font-medium mb-1"
                  >
                    Service Charge
                  </label>
                  <Input
                    id="serviceCharge"
                    type="number"
                    min="0"
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(e.target.value)}
                    className="border border-[#C4C4C4] bg-zinc-100 text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="tax" className="text-xs font-medium mb-1">
                    Tax (%)
                  </label>
                  <Input
                    id="tax"
                    type="number"
                    min="0"
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                    className="border border-[#C4C4C4] bg-zinc-100 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-200 pt-2">
                <div className="text-sm font-medium">Final</div>
                <div className="text-sm font-semibold">
                  रु {finalTotal.toFixed(2)}
                </div>
              </div>
              <div className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto px-4 py-2 text-sm bg-gradient-to-r from-[#FB8A22] to-[#EA454C] text-white rounded-lg shadow hover:scale-105 hover:brightness-110">
                      Preview Bill
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Bill Preview</DialogTitle>
                    </DialogHeader>

                    <BillPreview
                      bill={{
                        restaurantName,
                        restaurantLocation,
                        date: currentDateTime,
                        subtotal,
                        discount: discount_total,
                        serviceCharge: serviceChargeNum,
                        tax: taxAmount,
                        total: finalTotal,
                        orders: groupOrders.map((o: Order) => {
                          const item = menu.find(
                            (m: OrderLine) => m.id === o.item_id,
                          );
                          const rate = Number(item?.price ?? 0);
                          return {
                            name: item?.name ?? "Item",
                            qty: o.quantity,
                            rate,
                            amount: rate * o.quantity,
                          };
                        }),
                      }}
                    />

                    <DialogFooter className="flex w-[25%]">
                      <Button
                        className="flex items-center gap-2 flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          const billData: BillData = {
                            restaurantName,
                            restaurantLocation,
                            date: currentDateTime,
                            subtotal,
                            discount: discount_total,
                            serviceCharge: serviceChargeNum,
                            tax: taxAmount,
                            total: finalTotal,
                            orders: groupOrders.map((o: Order) => {
                              const item = menu.find(
                                (m: OrderLine) => m.id === o.item_id,
                              );
                              const rate = Number(item?.price ?? 0);
                              return {
                                name: item?.name ?? "Item",
                                qty: o.quantity,
                                rate,
                                amount: rate * o.quantity,
                              };
                            }),
                          };

                          handlePrint(billData);
                        }}
                      >
                        <Icon icon="mdi:printer" className="w-4 h-4" />
                        Print
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  className="w-full sm:w-auto px-4 py-2 text-sm bg-red-400 text-white rounded-lg shadow hover:scale-105 hover:bg-red-600"
                  onClick={() => {
                    checkoutGroup({
                      groupId,
                      discount: discount_total,
                      service_charge: serviceChargeNum,
                      tax: taxAmount,
                      total_final: finalTotal,
                    });
                    router.replace("/groups");
                  }}
                  disabled={checkoutLoading}
                >
                  Close Group
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

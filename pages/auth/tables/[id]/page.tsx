"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Table } from "@/lib/types/globalTypes/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import axios from "axios";

import { tableSchema } from "../../../../../validation-schema/tableSchema";
import {
  CreateOrderValues,
  orderResponseSchema,
  ordersResponseSchema,
} from "../../../../../validation-schema/orderSchema";
import { MenuFormValues } from "../../../../../validation-schema/menuSchema";
import React from "react";
import { toast } from "react-hot-toast";
import { MenuIngredientFormValues } from "../../../../../validation-schema/menuIngredientsSchema";
import { useGroupsList } from "@/hooks/auth/useGroups";
import { useWaiters } from "@/hooks/auth/useWaiters";
import { useOrders } from "@/hooks/auth/useOrders";
import { KOTPreview } from "@/components/bill/thermalKot";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
type TableFormValues = z.infer<typeof tableSchema>;
type OrderResponse = z.infer<typeof orderResponseSchema>;

export default function TableDetailPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  // const addOrderByWaiter = useAppStore((s) => s.addOrderByWaiter);
  // const createKOT = useAppStore((s) => s.createKOT);
  // const hydrated = useAppStore((s) => s.hydrated);
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("restaurant_id") || "";
    setRestaurantId(id);
  }, []);
  // const [waiterFilter, setWaiterFilter] = useState("all");
  // const [groupFilter, setGroupFilter] = useState("all");
  // const [fromDate, setFromDate] = useState("");
  // const [toDate, setToDate] = useState("");

  const [table, setTable] = useState<Table | null>(null);
  useEffect(() => {
    if (!restaurantId || !id) return; // ✅ Guard both
    axiosInstance
      .get(`/restaurants/${restaurantId}/tables/${id}`)
      .then((res) => setTable(res.data))
      .catch((err) => console.error(err));
  }, [id, restaurantId]); // ✅ include restaurantId in deps

  const { data: waiters = [] } = useWaiters(restaurantId);

  const updateTable = async (id: string, patch: Partial<Table>) => {
    try {
      await axiosInstance.patch(
        `/restaurants/${restaurantId}/tables/${id}`,
        patch
      );

      // useAppStore.getState().updateTable(id, patch);
    } catch (error) {
      console.error("Failed to update table:", error);
    }
  };
  const { data: menu = [] } = useQuery({
    queryKey: ["menu", restaurantId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/restaurants/${restaurantId}/menu`);
      return res.data.map((m: MenuFormValues) => ({
        ...m,
        price: Number(m.price),
      }));
    },
    enabled: !!restaurantId, // <-- prevents the query if restaurantId is null
  });

  const queryClient = useQueryClient();

  const createOrder = async (orderPayload: OrderResponse) => {
    if (!restaurantId) {
      console.error("Cannot create order: restaurantId is null");
      return null;
    }

    try {
      const res = await axiosInstance.post(
        `/restaurants/${restaurantId}/orders`,
        orderPayload
      );

      console.log("Order response:", res.data);

      // Invalidate orders query for this restaurant so it refetches
      await queryClient.invalidateQueries({
        queryKey: ["orders", restaurantId],
      });

      return res.data;
    } catch (err) {
      console.error("Failed to create order:", err);
      return null;
    }
  };

  const [backendOrders, setBackendOrders] = useState<CreateOrderValues[]>([]);

  useEffect(() => {
    if (!restaurantId) {
      console.warn("Cannot fetch orders: restaurantId is null");
      return;
    }

    axiosInstance
      .get(`/restaurants/${restaurantId}/orders/with-lines`)
      .then((res) => {
        console.log("Raw response:", res.data);

        const ordersRaw = ordersResponseSchema.parse(res.data);
        const orders = Array.isArray(ordersRaw) ? ordersRaw : [ordersRaw];

        const transformedOrders: CreateOrderValues[] = orders.map((order) => ({
          restaurant_id: order.restaurant_id,
          group_id: order.group_id ?? "default-group-id",
          table_id: order.table_id,
          items: order.lines.map((line) => ({
            menu_item_id: line.menu_item_id,
            quantity: line.quantity,
            waiter_id: line.waiter_id,
            note: line.note || undefined,
            removed_ingredients: line.removed_ingredients
              ? line.removed_ingredients.map((name) => ({
                  name,
                  default_included: true,
                }))
              : undefined,
          })),
        }));

        console.log("Transformed Orders:", transformedOrders);

        // Update state
        setBackendOrders(transformedOrders);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      });
  }, [restaurantId]);

  // const filteredOrders = useMemo(() => {
  //   return orders
  //     .filter(o => (waiterFilter === "all" ? true : waiterFilter === "unassigned" ? !o.waiterId : o.waiterId === waiterFilter))
  //     .filter(o => (groupFilter === "all" ? true : groupFilter === "unassigned" ? !o.groupId : o.groupId === groupFilter))
  //     .filter(o => {
  //       const t = new Date(o.createdAt).getTime();
  //       const start = fromDate ? new Date(fromDate).getTime() : -Infinity;
  //       const end = toDate ? new Date(new Date(toDate).setHours(23,59,59,999)).getTime() : Infinity;
  //       return t >= start && t <= end;
  //     })
  //     .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  // }, [orders, waiterFilter, groupFilter, fromDate, toDate]);

  // if (!hydrated) {
  //   return <div className="h-8 w-48 animate-pulse rounded bg-zinc-100" />;
  // }

  if (!table) {
    return <div>Table not found.</div>;
  }

  return (
    <div className="lg:flex-1 flex flex-col gap-4 relative px-10 ">
      {" "}
      {/* Table name / header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl sm:text-3xl font-bold text-zinc-900">
          {table.name}
          <span className="text-[#FB8A22] text-xl sm:text-3xl font-bold">
            {" "}
            SECTION
          </span>
        </h1>

        {/* Noodles image in top-right */}
        <div className=" sm:block lg:block">
          <Image
            src="/noodles.svg"
            alt="Noodles"
            width={180}
            height={100}
            className="sm:w-8 sm:h-2 md:w-16 md:h-16 lg:w-80 lg:h-30 object-contain"
          />
        </div>
      </div>
      {/* OrderMenu */}
      <div>
        <OrderMenu
          tableId={id}
          menu={menu}
          waiters={waiters}
          orders={backendOrders}
          onAdd={(waiter_Id, item_Id, qty, note) =>
            console.log(waiter_Id, id, item_Id, qty, note)
          }
          onSendKOT={(waiter_Id, order_Ids) =>
            console.log(id, waiter_Id, order_Ids)
          }
          createOrder={createOrder}
          updateTable={updateTable}
        />
      </div>
    </div>
  );
}

function OrderMenu({
  tableId,
  menu,
  waiters,
}: {
  tableId: string;
  menu: {
    id: string;
    name: string;
    price: number;
    image?: string;
    active: boolean;
    category: string;
  }[];
  waiters: { id: string; name: string }[];
  orders: CreateOrderValues[];
  onAdd: (waiterId: string, itemId: string, qty: number, note?: string) => void;
  onSendKOT: (waiterId: string, orderIds: string[]) => void;
  createOrder: (orderPayload: OrderResponse) => Promise<CreateOrderValues>;
  updateTable: (id: string, patch: Partial<Table>) => void;
  // refetchOrders: () => void;
}) {
  const router = useRouter();
  const [waiterId, setWaiterId] = useState(waiters[0]?.id ?? "");
  const [cart, setCart] = useState<
    Record<string, { name: string; image: string; qty: number; note?: string }>
  >({});
  const [note, setNote] = useState("");
  const [lastKOT, setLastKOT] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [foodFilters, setFoodFilters] = useState<Record<string, string[]>>({});
  const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Drinks"];
  const [restaurantId, setRestaurantId] = useState("");
  const [lastKOTData, setLastKOTData] = useState<{
    table: string;
    waiter: string;
    orders: {
      id: string;
      name: string;
      qty: number;
      remark?: string;
    }[];
    note?: string;
    totalQty: number;
  } | null>(null);
  const [showKOTOverlay, setShowKOTOverlay] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("restaurant_id") || "";
    setRestaurantId(id);
  }, []);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantLocation, setRestaurantLocation] = useState("");
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onNoPrinter?.(() => alert("No USB printer found!"));
      window.electronAPI.onPrintSuccess?.(() => alert("Print sent!"));
      window.electronAPI.onPrintError?.((msg) => alert("Print error: " + msg));
    }
  }, []);

  useEffect(() => {
    setRestaurantName(
      localStorage.getItem("restaurant_name") || "Unknown Restaurant"
    );
    setRestaurantLocation(
      localStorage.getItem("restaurant_location") || "Unknown Location"
    );
  }, []);
  const total = Object.entries(cart).reduce((sum, [itemId, { qty }]) => {
    const item = menu.find((m) => m.id === itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  useEffect(() => {
    if (waiters.length > 0) {
      setWaiterId((prev) => prev ?? waiters[0].id);
    }
  }, [waiters]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredMenu = menu
    .filter((m) => !filterCategory || m.category === filterCategory)
    .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);

  const currentMenu = filteredMenu.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getDefaultIngredients = async (menu_item_id: string) => {
    try {
      const res = await axiosInstance.get(
        `/restaurants/${restaurantId}/menu/${menu_item_id}/ingredients`
      );
      const ingredients = res.data || [];
      return ingredients
        .filter((ing: MenuIngredientFormValues) => ing.default_included)
        .map((ing: MenuIngredientFormValues) => ing.name.replace(/^#/, ""));
    } catch (err) {
      console.error("Failed to fetch ingredients", err);
      return [];
    }
  };

  const addToCart = async (itemId: string) => {
    setCart((c) => {
      const next = { ...c };
      if (next[itemId]) {
        delete next[itemId];
        setFoodFilters((prev) => {
          const updated = { ...prev };
          delete updated[itemId];
          return updated;
        });
      } else {
        const menuItem = menu.find((m: { id: string }) => m.id === itemId);
        if (!menuItem) return next;

        next[itemId] = {
          name: menuItem.name,
          image: menuItem.image || "",
          qty: 1,
        };

        getDefaultIngredients(itemId).then((defaults) => {
          setFoodFilters((prev) => ({
            ...prev,
            [itemId]: defaults,
          }));
        });
      }
      return next;
    });
  };

  const increase = (id: string) =>
    setCart((c) => {
      if (!c[id]) return c;
      return {
        ...c,
        [id]: { ...c[id], qty: c[id].qty + 1 },
      };
    });

  const decrease = (id: string) =>
    setCart((c) => {
      const next = { ...c };
      const q = (next[id]?.qty ?? 0) - 1;
      if (q <= 0) {
        delete next[id];
        setFoodFilters((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } else {
        next[id] = { ...next[id], qty: q };
      }
      return next;
    });

  const clearCart = () => setCart({});

  const { data: orders = [], refetch: refetchOrders } = useOrders(restaurantId);
  function useMenuIngredients(menu_item_id: string | null) {
    return useQuery({
      queryKey: ["menu_ingredients", menu_item_id],
      queryFn: async () => {
        if (!menu_item_id) return [];
        const res = await axiosInstance.get(
          `/restaurants/${restaurantId}/menu/${menu_item_id}/ingredients`
        );
        return res.data;
      },
      enabled: !!menu_item_id,
    });
  }

  const { data: groups = [] } = useGroupsList(restaurantId);

  const createTableGroup = async (tableId: string) => {
    try {
      // Fetch table details to get the name
      const { data: table } = await axiosInstance.get<TableFormValues>(
        `/restaurants/${restaurantId}/tables/${tableId}`
      );

      const tableName = table?.name || "Unnamed Table";

      // Create the group with the table name
      const res = await axiosInstance.post(
        `/restaurants/${restaurantId}/groups`,
        {
          table_id: tableId,
          name: tableName,
        }
      );

      const group = res.data;

      if (!group?.id) {
        console.error("Group was not created properly.");
        return null;
      }

      await axiosInstance.patch(
        `/restaurants/${restaurantId}/tables/${tableId}`,
        { current_group_id: group.id }
      );

      console.log(
        `Group "${group.name}" created and assigned to table ${tableId}`
      );

      return group;
    } catch (err) {
      console.error("Failed to create group or update table:", err);
      return null;
    }
  };

  const createOrder = async (orderPayload: CreateOrderValues) => {
    const res = await axiosInstance.post(
      `/restaurants/${restaurantId}/orders`,
      orderPayload
    );
    console.log("Order response:", res.data);
    await refetchOrders();
    return res.data; // this could be single or array
  };
  const sendKOT = () => {
    if (!lastKOTData) {
      toast.error("No KOT data available to print");
      return;
    }
    setShowKOTOverlay(true);
  };

  const handleSendToKitchen = async () => {
    if (!waiterId) {
      console.error("No waiter selected");
      toast.error("Please select a waiter before sending the order.");
      return;
    }

    if (Object.keys(cart).length === 0) {
      toast.error("Cart is empty. Add items before sending.");
      return;
    }

    try {
      const { data: table } = await axiosInstance.get<TableFormValues>(
        `/restaurants/${restaurantId}/tables/${tableId}`
      );

      let groupId = table.current_group_id;

      if (!groupId) {
        const group = await createTableGroup(tableId);
        if (!group?.id) {
          console.error("Table has no group");
          toast.error("Failed to create table group.");
          return;
        }
        groupId = group.id;
      }
      if (!restaurantId) {
        toast.error("No restaurant selected!");
        console.error("restaurantId is null or undefined");
        return; // exit early
      }
      const orderPayload = {
        restaurant_id: restaurantId,
        group_id: groupId!,
        table_id: tableId,
        items: Object.entries(cart).map(([itemId, { qty, note }]) => ({
          menu_item_id: itemId,
          quantity: Number(qty),
          waiter_id: waiterId!,
          note: note || "",
        })),
      };

      console.log("Order payload:", orderPayload);
      const order = await createOrder(orderPayload);

      console.log("Created order:", order);

      const orderId = Array.isArray(order) ? order[0]?.id : order?.id;

      if (!orderId) {
        console.error("Order creation failed: no ID returned");
        toast.error("Order creation failed.");
        return;
      }

      setLastKOT(orderId);
      const ordersForPdf = Object.entries(cart).map(
        ([itemId, { qty, note }]) => {
          const menuItem = menu.find((m) => m.id === itemId);
          return {
            id: itemId,
            name: menuItem?.name || itemId,
            qty: Number(qty),
            remark: note || "",
          };
        }
      );

      const totalQty = ordersForPdf.reduce((s, o) => s + o.qty, 0);

      const kotSnapshot = {
        table: table.name || tableId,
        waiter: waiters.find((w) => w.id === waiterId)?.name || waiterId,
        orders: ordersForPdf,
        note: note || undefined,
        totalQty,
        restaurantName: restaurantName,
        restaurantLocation: restaurantLocation,
        date: new Date().toString(),
        subtotal: total,
        total: total,
      };

      // ✅ STORE IT
      setLastKOTData(kotSnapshot);

      await axiosInstance.patch(
        `/restaurants/${restaurantId}/tables/${tableId}`,
        { status: "occupied" }
      );

      clearCart();
      setNote("");
      setLastKOT(order.id || "");

      toast.success("Order sent to kitchen!");
      router.push(`/tables/${tableId}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Backend error:", err.response?.data);
        toast.error(
          err.response?.data?.message ||
            "Failed to send order. Please try again."
        );
      } else if (err instanceof Error) {
        console.error(err.message);
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }

    setShowKOTOverlay(true);
  };

  // const hydrated = useAppStore((s) => s.hydrated);
  const [waiterFilter, setWaiterFilter] = useState<string>("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [fromDate] = useState<string>("");
  const [toDate] = useState<string>("");
  const [showCartMobile, setShowCartMobile] = useState(false);

  const waiterFiltered = useMemo(() => {
    console.log("Waiter filtered:", waiterFilter, orders);
    if (waiterFilter === "all") return orders;
    if (waiterFilter === "unassigned")
      return orders.filter((o) => !o.waiter_id);
    return orders.filter((o) => o.waiter_id === waiterFilter);
  }, [orders, waiterFilter]);

  const groupFiltered = useMemo(() => {
    console.log("Group filtered:", groupFilter, waiterFiltered);
    if (groupFilter === "all") return waiterFiltered;
    if (groupFilter === "unassigned")
      return waiterFiltered.filter((o) => !o.group_id);
    return waiterFiltered.filter((o) => o.group_id === groupFilter);
  }, [waiterFiltered, groupFilter]);

  const dateFiltered = useMemo(() => {
    console.log("Date filtered:", fromDate, toDate, groupFiltered);
    if (!fromDate && !toDate) return groupFiltered;
    const start = fromDate ? new Date(fromDate).getTime() : -Infinity;
    const end = toDate
      ? new Date(new Date(toDate).setHours(23, 59, 59, 999)).getTime()
      : Infinity;
    return groupFiltered.filter((o) => {
      const t = new Date(o.created_at).getTime();
      return t >= start && t <= end;
    });
  }, [groupFiltered, fromDate, toDate]);
  const sortedOrders = useMemo(() => {
    return [...dateFiltered].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [dateFiltered]);

  // if (!hydrated) {
  //   return <div className="h-8 w-48 animate-pulse rounded bg-zinc-100" />;
  // }

  const togglePreference = (cardId: string, pref: string) => {
    setFoodFilters((prev) => {
      const current = prev[cardId] || [];
      return {
        ...prev,
        [cardId]: current.includes(pref)
          ? current.filter((f) => f !== pref)
          : [...current, pref],
      };
    });
  };
  return (
    <div>
      <div className="flex items-center w-full justify-start mb-5 gap-2">
        {/* Search box */}
        <div className="flex items-center w-[130px] sm:w-[250px] h-8 md:h-10 shadow rounded-md border px-2 bg-white gap-2">
          <button type="button">
            <Icon
              icon="mdi:magnify"
              className=" h-3 w-3 md:w-7 md:h-7 text-black/80 transform scale-x-[-1]"
            />
          </button>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 h-full outline-none bg-transparent text-xs sm:text-sm"
          />
        </div>

        {/* Category Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-between w-[90px] h-9 px-2 rounded-md bg-white shadow  transition sm:w-[200px] sm:h-10 sm:px-3">
              <Icon
                icon="mingcute:dish-cover-line"
                className="w-3 h-3 sm:w-5 sm:h-5 text-[#FB8A22]"
              />
              <span className="text-[10px] sm:text-sm text-gray-700 truncate">
                {filterCategory || "All Dishes"}
              </span>
              <Icon
                icon="mdi:keyboard-arrow-down"
                className="w-2 h-2 sm:w-5 sm:h-5 text-gray-500"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="end"
            className="z-50  bg-white/70 backdrop-blur rounded-md shadow-md cursor-pointer py-0 sm:py-1 px-0 sm:px-3 hover:none"
          >
            <DropdownMenuItem
              onClick={() => setFilterCategory("")}
              className="mb-1 rounded bg-transparent hover:bg-transparent text-[10px] text-[#616161] sm:text-sm transition-colors py-1 px-2 sm:py-1 sm:px-3 last:mb-0 cursor-pointer hover:text-black"
            >
              All Dishes
            </DropdownMenuItem>
            {categories.map((cat) => (
              <DropdownMenuItem
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className="mb-1 rounded hover:text-black text-[10px]  text-[#616161] sm:text-sm transition-colors py-1 px-2 sm:py-1 sm:px-3 last:mb-0 cursor-pointer"
              >
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Waiter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-between w-[90px] h-9 px-2 rounded-md bg-white transition sm:w-[200px] sm:h-10 sm:px-3">
              <Icon
                icon="raphael:user"
                className="w-3 h-3 sm:w-5 sm:h-5 text-[#FB8A22] mr-1 sm:mr-2"
              />
              <span className="text-[10px] sm:text-sm text-gray-700 truncate">
                {waiters.find((w) => w.id === waiterId)?.name ||
                  "Select a waiter"}
              </span>
              <Icon
                icon="mdi:chevron-down"
                className="w-2 h-2 sm:w-5 sm:h-5 text-gray-500"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="start"
            className=" bg-white/70 backdrop-blur rounded-md shadow-md py-0 sm:py-1 px-0 sm:px-3 max-h-48 overflow-y-auto hover:none"
          >
            {waiters.map((w) => (
              <DropdownMenuItem
                key={w.id}
                className="mb-1 rounded bg-transparent hover:bg-transparent text-[10px] text-[#616161] sm:text-sm transition-colors py-1 px-2 sm:py-1 sm:px-3 last:mb-0 cursor-pointer hover:text-black"
                onClick={() => setWaiterId(w.id)}
              >
                <span>{w.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Cart Button */}
        <button
          className="lg:hidden  relative p-1.5  bg-gradient-to-r from-orange-400 to-red-400 
          rounded-sm text-white shadow hover:bg-orange-600 transition"
          onClick={() => setShowCartMobile(!showCartMobile)}
        >
          <Icon icon="mdi:cart-outline" className="w-4 h-4" />
          {Object.keys(cart).length > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center">
              {Object.keys(cart).length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
        {currentMenu.map((m) => {
          const qty = cart[m.id]?.qty ?? 0;
          const selected = qty > 0;

          return (
            <div
              key={m.id}
              onClick={() => addToCart(m.id)}
              className={`flex flex-row items-stretch gap-0 rounded-xl bg-white shadow-xl cursor-pointer overflow-hidden transition-all duration-150 box-border 
          ${selected ? "border-2 border-green-600" : "border border-zinc-200"}
          h-[90px] sm:h-[110px] md:h-[130px] lg:h-[100px] xl:h-[150px]`}
            >
              {m.image && (
                <div
                  className={`relative h-full flex-shrink-0 rounded-l-lg overflow-hidden transition-all duration-300 
              ${
                selected
                  ? "w-[12vw] sm:w-[10vw] md:w-[8vw] lg:w-[6vw] "
                  : "w-[15vw] sm:w-[12vw] md:w-[10vw] lg:w-[8vw] "
              }`}
                >
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex-1 flex flex-col justify-between p-2 sm:px-2  sm:py-4 relative min-h-0">
                <div
                  className={`absolute top-1 right-1 text-[9px] sm:text-[10px] lg:text-[12px] font-medium rounded-full px-1 py-1 sm:px-1 sm:py-3 ${
                    m.active ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {m.active ? "Available" : "Unavailable"}
                </div>

                {selected && (
                  <div
                    className="absolute top-4 sm:top-6 right-1 px-1 py-1 sm:px-1 sm:py-2 transition-all duration-300 ease-in-out"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="
                      rounded-sm
                md:rounded-md 
                text-[6px] sm:text-[10px] 
                bg-white 
                px-1 sm:px-2 py-0.5 sm:py-1 
                border border-gray-300 
                shadow-sm 
                hover:bg-gray-100 
                hover:shadow-md 
                transition-all duration-200
                   "
                          onClick={(e) => e.stopPropagation()}
                        >
                          Ingredients
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="bottom"
                        align="end"
                        className="z-50 mt-1 max-w-[60vw] sm:max-w-[200px]  order rounded-lg shadow-md p-1.5 sm:p-0 bg-white/2 backdrop-blur-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MenuIngredientsList
                          cardId={m.id}
                          filters={foodFilters}
                          togglePreference={togglePreference}
                          setFoodFilters={setFoodFilters}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                <div className="flex-1 min-h-0"></div>
                <div className="flex justify-between items-end">
                  <div
                    className={`flex flex-col ${
                      selected ? "gap-0.5" : "gap-1"
                    }`}
                  >
                    <div
                      className={`font-medium text-zinc-900 line-clamp-2
                  ${
                    selected
                      ? "text-[10px] sm:text-xs md:text-sm"
                      : "text-xs sm:text-sm md:text-base"
                  }`}
                    >
                      {m.name}
                    </div>
                    <p
                      className={`font-medium text-black
                  ${
                    selected
                      ? "text-[9px] sm:text-[10px] md:text-[10px]"
                      : "text-[10px] sm:text-xs md:text-[12px]"
                  }`}
                    >
                      रु {Number(m.price).toFixed(2)}
                    </p>
                  </div>

                  {selected && (
                    <div className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg bg-zinc-200 px-1 py-1 min-w-[50px] sm:min-w-[60px] md:min-w-[70px]">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 rounded-full text-[9px] sm:text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          decrease(m.id);
                        }}
                      >
                        -
                      </Button>

                      <span className="text-[9px] sm:text-[10px] md:text-sm font-medium min-w-[4px] sm:min-w-[5px] text-center text-[#00A149]">
                        {cart[m.id]?.qty ?? 1}
                      </span>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 rounded-full text-[9px] sm:text-xs hover:bg-zinc-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          increase(m.id);
                        }}
                      >
                        +
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showKOTOverlay && lastKOTData && (
        <Dialog open={showKOTOverlay} onOpenChange={setShowKOTOverlay}>
          {/* Overlay: transparent but blocks clicks */}
          <div
            className="fixed inset-0 z-40 pointer-events-auto"
            onClick={() => setShowKOTOverlay(false)}
          ></div>

          <DialogContent className="max-w-xs w-full p-4 z-50 pointer-events-auto">
            {/* Header */}
            <DialogHeader>
              <DialogTitle>KOT Preview</DialogTitle>
            </DialogHeader>

            {/* Body */}
            <div className="flex flex-col gap-2 overflow-auto max-h-80">
              <KOTPreview
                kot={lastKOTData}
                onClose={() => setShowKOTOverlay(false)}
              />
            </div>

            {/* Footer */}
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button
                className="bg-[#FB8A22] hover:bg-orange-600 text-white"
                onClick={() => {
                  if (!lastKOTData) {
                    toast.error("No KOT data available to print");
                    return;
                  }

                  // Prepare KOT data with restaurant info
                  const kotToPrint = {
                    ...lastKOTData,
                    restaurantName: restaurantName,
                    restaurantLocation: restaurantLocation,
                  };

                  if (window.electronAPI) {
                    window.electronAPI.printKOT(kotToPrint);

                    // Optional: listen for success/error
                    window.electronAPI.onPrintSuccess(() => {
                      toast.success("KOT printed successfully!");
                    });
                    window.electronAPI.onPrintError((msg) => {
                      toast.error(`Print failed: ${msg}`);
                    });
                  }
                }}
              >
                Print
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {/* pagination */}
      {/* pagination */}
      <div className="flex justify-center items-center mt-4 gap-1 sm:gap-2">
        {/* Previous Button */}
        <button
          className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-bold ${
            currentPage === 1
              ? "bg-[EEEEF0] text-black cursor-not-allowed"
              : "bg-[EEEEF0] text-black cursor-pointer hover:bg-gray-300"
          }`}
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {/* Page Numbers with truncation */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            if (page === 1 || page === totalPages) return true; // always show first & last
            if (page >= currentPage - 1 && page <= currentPage + 1) return true; // show current ±1
            return false;
          })
          .map((page, idx, arr) => {
            const prev = arr[idx - 1];
            return (
              <React.Fragment key={page}>
                {prev && page - prev > 1 && (
                  <span className="px-2 py-0.5 text-xs sm:text-sm">…</span>
                )}
                <button
                  className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm font-medium ${
                    currentPage === page
                      ? "bg-[#FB8A22] text-white border-orange-500 hover:bg-orange-400 cursor-pointer"
                      : "bg-[#EEEEF0] text-gray-700 hover:bg-orange-400  hover:text-white cursor-pointer"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          })}

        {/* Next Button */}
        <button
          className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-bold ${
            currentPage === totalPages
              ? "bg-[EEEEF0] text-black cursor-not-allowed"
              : "bg-[EEEEF0] text-black cursor-pointer hover:bg-gray-300"
          }`}
          onClick={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>

      {showCartMobile && (
        <div
          className="lg:hidden fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-2"
          onClick={() => setShowCartMobile(false)}
        >
          {/* Cart container */}
          <div
            className="relative w-72 max-w-[90vw] max-h-[70vh] overflow-auto shadow-lg rounded-lg bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-3 flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-[#FB8A22] mb-2">
                Cart
              </h3>

              {Object.keys(cart).length === 0 ? (
                <p className="text-sm text-black/70">
                  Tap items to add to cart.
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {Object.entries(cart).map(([id]) => {
                    const item = menu.find((m) => m.id === id)!;
                    const prefs = foodFilters[id] || [];

                    return (
                      <div
                        key={id}
                        className="relative flex flex-col border rounded-md px-2 py-5 bg-white shadow-sm"
                      >
                        <p className="text-sm font-semibold">{item.name}</p>
                        {prefs.length > 0 && (
                          <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
                            {prefs.map((pref, index) => (
                              <li key={index}>{pref}</li>
                            ))}
                          </ul>
                        )}

                        <div className="absolute top-1 right-1 flex items-center gap-1 rounded-lg bg-zinc-200 px-2 py-0.5 shadow-sm">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-4 w-4 rounded-full text-xs font-bold hover:bg-zinc-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              decrease(id);
                            }}
                          >
                            -
                          </Button>

                          <span className="text-xs font-semibold w-5 text-center text-black">
                            {cart[id]?.qty ?? 1}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-4 w-4 rounded-full text-xs font-bold hover:bg-zinc-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              increase(id);
                            }}
                          >
                            +
                          </Button>
                        </div>

                        <p
                          className={`absolute right-2 text-xs font-medium text-black ${
                            prefs.length > 0 ? "bottom-1" : "bottom-2"
                          }`}
                        >
                          रु{item.price.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <span className="text-sm font-medium text-black mt-2 block">
                Note:
              </span>
              <Input
                className="mt-1 shadow-sm rounded-md text-sm"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Less spicy"
              />

              <div className="h-px w-full bg-gray-300 my-2"></div>

              <div className="flex justify-between text-sm font-semibold text-black/80">
                <span>Total</span>
                <span>रु.{total.toFixed(2)}/-</span>
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-lg h-9
             hover:from-orange-500 hover:to-red-500 hover:shadow-md transition-all text-sm"
                  onClick={() => handleSendToKitchen()}
                >
                  Send to Kitchen
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 bg-white text-black/60 shadow hover:bg-zinc-100 rounded-lg h-9 text-sm"
                  onClick={clearCart}
                >
                  Clear
                </Button>
              </div>

              {showKOTOverlay && lastKOTData && (
                <Dialog open={showKOTOverlay} onOpenChange={setShowKOTOverlay}>
                  {/* Overlay: transparent but blocks clicks */}
                  <div
                    className="fixed inset-0 z-40 pointer-events-auto"
                    onClick={() => setShowKOTOverlay(false)}
                  ></div>

                  <DialogContent className="max-w-xs w-full p-4 z-50 pointer-events-auto">
                    {/* Header */}
                    <DialogHeader>
                      <DialogTitle>KOT Preview</DialogTitle>
                    </DialogHeader>

                    {/* Body */}
                    <div className="flex flex-col gap-2 overflow-auto max-h-80">
                      <KOTPreview
                        kot={lastKOTData}
                        onClose={() => setShowKOTOverlay(false)}
                      />
                    </div>

                    {/* Footer */}
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                      </DialogClose>
                      <Button
                        className="bg-[#FB8A22] hover:bg-orange-600 text-white"
                        onClick={() => {
                          if (!lastKOTData) {
                            toast.error("No KOT data available to print");
                            return;
                          }

                          // Prepare KOT data with restaurant info
                          const kotToPrint = {
                            ...lastKOTData,
                            restaurantName: restaurantName,
                            restaurantLocation: restaurantLocation,
                          };

                          if (window.electronAPI) {
                            window.electronAPI.printKOT(kotToPrint);

                            // Optional: listen for success/error
                            window.electronAPI.onPrintSuccess(() => {
                              toast.success("KOT printed successfully!");
                            });
                            window.electronAPI.onPrintError((msg) => {
                              toast.error(`Print failed: ${msg}`);
                            });
                          }
                        }}
                      >
                        Print
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row  mt-8 gap-4">
        <div className="w-full max-w-md mx-auto hidden lg:block">
          <Card className="flex flex-col min-h-[20rem] shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-4 flex flex-col">
              <h3 className="text-2xl font-semibold mb-3 text-[#FB8A22]">
                Cart
              </h3>

              {Object.keys(cart).length === 0 ? (
                <p className="text-lg text-black/70">
                  Tap items to add to cart.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {Object.entries(cart).map(([id]) => {
                    const item = menu.find((m) => m.id === id)!;
                    const prefs = foodFilters[id] || [];

                    return (
                      <div
                        key={id}
                        className="relative flex flex-col border rounded-lg px-3 py-6 bg-white shadow-sm"
                      >
                        <p className="text-md font-semibold">{item.name}</p>

                        {prefs.length > 0 && (
                          <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
                            {prefs.map((pref, index) => (
                              <li key={index}>{pref}</li>
                            ))}
                          </ul>
                        )}

                        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-xl bg-zinc-200 px-3  py-1 shadow-sm">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-5 w-5 rounded-full text-xs font-bold hover:bg-zinc-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              decrease(id);
                            }}
                          >
                            -
                          </Button>

                          <span className="text-sm font-semibold w-6 text-center text-black">
                            {cart[id]?.qty ?? 1}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-5 w-5 rounded-full text-xs font-bold hover:bg-zinc-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              increase(id);
                            }}
                          >
                            +
                          </Button>
                        </div>

                        <p
                          className={`absolute right-3 text-sm font-medium text-black ${
                            prefs.length > 0 ? "bottom-2" : "bottom-3"
                          }`}
                        >
                          रु{item.price.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <span className="font-medium text-black block mt-4">Note:</span>
              <Input
                className="mt-2 shadow-sm rounded-lg"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Less spicy"
              />

              <div className="h-px w-full bg-gray-300 my-4"></div>

              <div className="flex justify-between font-semibold text-black/80">
                <span>Total</span>
                <span>रु{total.toFixed(2)}/-</span>
              </div>

              <div className="flex gap-4 mt-4">
                <Button
                  className="flex-1 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-xl h-10
           hover:from-orange-500 hover:to-red-500 hover:shadow-lg hover box-border transition-all cursor-pointer"
                  onClick={() => handleSendToKitchen()}
                >
                  Send to Kitchen
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 bg-white text-black/60 shadow hover:bg-zinc-100 transition-colors rounded-xl h-10"
                  onClick={clearCart}
                >
                  Clear
                </Button>
              </div>

              {showKOTOverlay && lastKOTData && (
                <Dialog open={showKOTOverlay} onOpenChange={setShowKOTOverlay}>
                  {/* Overlay: transparent but blocks clicks */}
                  <div
                    className="fixed inset-0 z-40 pointer-events-auto"
                    onClick={() => setShowKOTOverlay(false)}
                  ></div>

                  <DialogContent className="max-w-xs w-full p-4 z-50 pointer-events-auto">
                    {/* Header */}
                    <DialogHeader>
                      <DialogTitle>KOT Preview</DialogTitle>
                    </DialogHeader>

                    {/* Body */}
                    <div className="flex flex-col gap-2 overflow-auto max-h-80">
                      <KOTPreview
                        kot={lastKOTData}
                        onClose={() => setShowKOTOverlay(false)}
                      />
                    </div>

                    {/* Footer */}
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                      </DialogClose>
                      <Button
                        className="bg-[#FB8A22] hover:bg-orange-600 text-white"
                        onClick={() => {
                          if (!lastKOTData) {
                            toast.error("No KOT data available to print");
                            return;
                          }

                          // Prepare KOT data with restaurant info
                          const kotToPrint = {
                            ...lastKOTData,
                            restaurantName: restaurantName,
                            restaurantLocation: restaurantLocation,
                          };

                          if (window.electronAPI) {
                            window.electronAPI.printKOT(kotToPrint);

                            // Optional: listen for success/error
                            window.electronAPI.onPrintSuccess(() => {
                              toast.success("KOT printed successfully!");
                            });
                            window.electronAPI.onPrintError((msg) => {
                              toast.error(`Print failed: ${msg}`);
                            });
                          }
                        }}
                      >
                        Print
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Orders */}
        <div className="w-full lg:max-w-[65rem] mx-auto">
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-[#FB8A22]   sm:text:xl md:text-2xl">
                  Orders
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-5 sm:h-8 rounded-sm sm:rounded-lg border border-zinc-400 bg-white px-3 text-xs md:text-sm cursor-pointer"
                      >
                        {waiterFilter === "all"
                          ? "All waiters"
                          : waiterFilter === "unassigned"
                            ? "Unassigned"
                            : waiters.find((w) => w.id === waiterFilter)
                                ?.name || "Select waiter"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setWaiterFilter("all")}>
                        All waiters
                      </DropdownMenuItem>
                      {orders.some((o) => !o.waiter_id) && (
                        <DropdownMenuItem
                          onClick={() => setWaiterFilter("unassigned")}
                        >
                          Unassigned
                        </DropdownMenuItem>
                      )}
                      {waiters.map((w) => (
                        <DropdownMenuItem
                          key={w.id}
                          onClick={() => setWaiterFilter(w.id)}
                        >
                          {w.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-5 sm:h-8 rounded-sm sm:rounded-lg border border-zinc-400 bg-white px-3 text-xs md:text-sm cursor-pointer"
                      >
                        {groupFilter === "all"
                          ? "All groups"
                          : groupFilter === "unassigned"
                            ? "Unassigned"
                            : (groups.find((g) => g.id === groupFilter)?.name ??
                              "Unknown Group")}
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setGroupFilter("all")}>
                        All groups
                      </DropdownMenuItem>

                      {groups.map((g) => (
                        <DropdownMenuItem
                          key={g.id}
                          onClick={() => setGroupFilter(g.id)}
                        >
                          {g.name ?? "No name"}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-[60vh]">
              {" "}
              {/* set total height */}
              {/* Scrollable Orders List */}
              <div className="flex-1 overflow-y-auto space-y-1">
                {sortedOrders.map((o) => {
                  const item = menu.find((m) => m.id === o.item_id);
                  return (
                    <div
                      key={o.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-200/70 bg-white shadow-sm overflow-hidden h-16 sm:h-20"
                    >
                      {/* Image */}
                      <div className="relative h-full w-12 sm:w-16 flex-shrink-0">
                        {item?.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="absolute inset-0 rounded-l-2xl object-cover"
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 px-2 py-1 flex flex-col justify-center text-[10px] sm:text-xs md:text-sm">
                        <div className="font-medium text-zinc-900 truncate">
                          {item?.name}
                        </div>
                        <div className="text-zinc-600 truncate">
                          Qty {o.quantity} {o.note ? `• ${o.note}` : ""}
                          {o.waiter_id && (
                            <span className="ml-1">
                              •{" "}
                              {waiters.find((w) => w.id === o.waiter_id)
                                ?.name ?? "—"}
                            </span>
                          )}
                          {o.group_id && (
                            <span className="ml-1">
                              •{" "}
                              {groups.find((g) => g.id === o.group_id)?.name ??
                                o.group_id}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-[10px] sm:text-sm md:text-md font-medium mr-3 sm:mr-7 truncate">
                        रु{(item ? item.price * o.quantity : 0).toFixed(2)}
                      </div>
                    </div>
                  );
                })}

                {sortedOrders.length === 0 && (
                  <div className="text-[10px] sm:text-xs text-zinc-600">
                    {orders.length === 0
                      ? "No orders yet."
                      : "No orders match the current filter."}
                  </div>
                )}
              </div>
              {/* Fixed Footer */}
              {orders.length > 0 && (
                <div className="mt-2 sm:mt-4 space-y-1 border-t pt-2 sm:pt-3 text-[10px] sm:text-xs md:text-sm sticky bottom-0 bg-white">
                  {(waiterFilter !== "all" ||
                    groupFilter !== "all" ||
                    fromDate ||
                    toDate) && (
                    <div className="flex items-center justify-between">
                      <div className="text-zinc-700">Filtered Total</div>
                      <div className="font-semibold">
                        रु{" "}
                        {sortedOrders
                          .reduce((sum, o) => {
                            const item = menu.find((m) => m.id === o.item_id);
                            return sum + (item ? item.price * o.quantity : 0);
                          }, 0)
                          .toFixed(2)}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] sm:text-sm md:text-base font-medium">
                      Table Total
                    </div>
                    <div className="text-[10px] sm:text-sm md:text-base font-semibold">
                      रु{" "}
                      {orders
                        .reduce((sum, o) => {
                          const item = menu.find((m) => m.id === o.item_id);
                          return sum + (item ? item.price * o.quantity : 0);
                        }, 0)
                        .toFixed(2)}
                      /-
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  function MenuIngredientsList({
    cardId,
    filters,
    togglePreference,
    setFoodFilters,
  }: {
    cardId: string;
    filters: Record<string, string[]>;
    togglePreference: (cardId: string, pref: string) => void;
    setFoodFilters: React.Dispatch<
      React.SetStateAction<Record<string, string[]>>
    >;
  }) {
    const { data: ingredients = [] } = useMenuIngredients(cardId);

    useEffect(() => {
      if (ingredients.length && !filters[cardId]) {
        const defaultSelected = ingredients
          .filter((ing: MenuIngredientFormValues) => ing.default_included)
          .map((ing: MenuIngredientFormValues) => ing.name.replace(/^#/, ""));
        setFoodFilters((prev) => ({
          ...prev,
          [cardId]: defaultSelected,
        }));
      }
    }, [ingredients, cardId, filters, setFoodFilters]);

    if (!ingredients.length)
      return <p className="text-xs text-gray-500">No Ingredients</p>;

    return (
      <>
        {ingredients.map((ingredient: MenuIngredientFormValues) => {
          const cleanName = ingredient.name.replace(/^#/, "");

          return (
            <DropdownMenuItem
              key={ingredient.id}
              asChild
              onSelect={(e) => e.preventDefault()}
              className="hover:bg-transparent focus:bg-transparent"
            >
              <label className="flex items-center gap-1 sm:gap-2 cursor-pointer select-none hover:text-inherit hover:bg-transparent">
                <input
                  type="checkbox"
                  className="peer w-3 h-3 sm:w-4 sm:h-4 opacity-0 absolute"
                  checked={filters[cardId]?.includes(cleanName) || false}
                  onChange={() => togglePreference(cardId, cleanName)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span
                  className="w-3 h-3 sm:w-4 sm:h-4 border border-gray-300 rounded flex items-center justify-center
                 peer-checked:bg-green-500 peer-checked:border-green-500"
                >
                  {filters[cardId]?.includes(cleanName) && (
                    <Icon
                      icon="mdi:check"
                      className="w-2 h-2 sm:w-3 sm:h-3 text-white"
                    />
                  )}
                </span>
                <span className="text-xs sm:text-sm text-gray-900">
                  {cleanName}
                </span>
              </label>
            </DropdownMenuItem>
          );
        })}
      </>
    );
  }
}

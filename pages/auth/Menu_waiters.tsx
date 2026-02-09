"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import Image from "@/components/ui/image";

import { axiosInstance } from "@/lib/axios.instance";
import { useQuery } from "@tanstack/react-query";
import { MenuItem } from "@/lib/types/globalTypes/types";
import { Icon } from "@iconify/react";
import { TableFormValues } from "../../../../validation-schema/tableSchema";
import { Input } from "@/components/ui/input";
import { CreateOrderValues } from "../../../../validation-schema/orderSchema";
import axios from "axios";
import toast from "react-hot-toast";
import { MenuIngredientFormValues } from "../../../../validation-schema/menuIngredientsSchema";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/components/guards/UserContext";
import MenuPageSkeleton from "@/components/LoadingPages/MenuLoad";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KOTPreview } from "@/components/bill/thermalKot";
export interface OrderLine {
  id: string; // Menu item ID
  name: string; // Menu item name
  qty: number; // Quantity
  remark?: string; // Optional note for the item
}

export interface KOTProps {
  table: string; // will now hold "Room:Table"
  waiter: string;
  orders: OrderLine[];
  note?: string;
  totalQty?: number;
}

export default function MenuPage() {
  const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Drinks"];
  const [foodFilters, setFoodFilters] = useState<Record<string, string[]>>({});
  const [cart, setCart] = useState<
    Record<string, { name: string; image: string; qty: number; note?: string }>
  >({});
  const [showKOTOverlay, setShowKOTOverlay] = useState(false);

  const [showKOT, setShowKOT] = useState(false);
  const [kotData, setKotData] = useState<KOTProps | null>(null);

  const [note, setNote] = useState("");
  const [lastKOT, setLastKOT] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId") || "";
  const [filterCategory, setFilterCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [showCartMobile, setShowCartMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurantId, setRestaurantId] = useState("");
  const { user } = useUser();
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
      localStorage.getItem("restaurant_name") || "Unknown Restaurant",
    );
    setRestaurantLocation(
      localStorage.getItem("restaurant_location") || "Unknown Location",
    );
  }, []);
  useEffect(() => {
    const rid = localStorage.getItem("restaurant_id") || "";
    setRestaurantId(rid);
  }, []);

  function useMenuIngredients(
    restaurantId: string | null,
    menu_item_id: string | null,
  ) {
    return useQuery({
      queryKey: ["menu_ingredients", restaurantId, menu_item_id],
      enabled: !!restaurantId && !!menu_item_id,
      queryFn: async () => {
        if (!restaurantId || !menu_item_id) return [];

        const res = await axiosInstance.get(
          `/restaurants/${restaurantId}/menu/${menu_item_id}/ingredients`,
        );

        return res.data;
      },
    });
  }

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

        getDefaultIngredients(restaurantId, itemId).then((defaults) => {
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

  console.log("Table ID from URL:", tableId);
  const clearCart = () => setCart({});

  const createTableGroup = async (tableId: string | null) => {
    if (!tableId || !restaurantId) {
      console.warn("createTableGroup: missing tableId or restaurantId");
      return null;
    }

    try {
      const { data: table } = await axiosInstance.get<TableFormValues>(
        `/restaurants/${restaurantId}/tables/${tableId}`,
      );

      const tableName = table?.name || "Unnamed Table";
      const roomName = table?.room_name || "Unnamed Room";
      const res = await axiosInstance.post(
        `/restaurants/${restaurantId}/groups`,
        {
          table_id: tableId,
          restaurant_id: restaurantId,
          name: tableName,
          room_name: roomName,
        },
      );

      const group = res.data;
      if (!group?.id) {
        console.error("Group was not created properly.");
        return null;
      }
      await axiosInstance.patch(
        `/restaurants/${restaurantId}/tables/${tableId}`,
        { current_group_id: group.id },
      );

      console.log(
        `Group "${group.name}" created and assigned to table ${tableId}`,
      );

      return group;
    } catch (err) {
      console.error("Failed to create group or update table:", err);
      return null;
    }
  };

  const getDefaultIngredients = async (
    restaurantId: string | null,
    menu_item_id: string,
  ) => {
    if (!restaurantId) {
      console.warn("restaurantId is null, cannot fetch ingredients");
      return [];
    }

    try {
      const res = await axiosInstance.get(
        `/restaurants/${restaurantId}/menu/${menu_item_id}/ingredients`,
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

  const createOrder = async (order: CreateOrderValues) => {
    try {
      const res = await axiosInstance.post(
        `/restaurants/${restaurantId}/orders`,
        order,
      );
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Failed to create order:", err.response?.data);
        console.error("Status code:", err.response?.status);
      } else {
        console.error("Unexpected error:", err);
      }
      throw err;
    }
  };

  const handleSendToKitchen = async () => {
    if (!user || user.role !== "waiter") {
      toast.error("You must be logged in as a waiter to send orders.");
      return;
    }

    if (!user || user.role !== "waiter") {
      toast.error("You must be logged in as a waiter to send orders.");
      return;
    }

    if (Object.keys(cart).length === 0) {
      toast.error("Cart is empty. Add items before sending.");
      return;
    }

    try {
      const { data: table } = await axiosInstance.get<TableFormValues>(
        `/restaurants/${restaurantId}/tables/${tableId}`,
      );
      console.log(table);

      let groupId = table.current_group_id;

      if (!groupId || !tableId) {
        const group = await createTableGroup(tableId);
        if (!group?.id) {
          console.error("Table has no group");
          toast.error("Failed to create table group.");
          return;
        }
        groupId = group.id;
      }

      const orderPayload = {
        restaurant_id: restaurantId!,
        group_id: groupId!,
        table_id: tableId,
        items: Object.entries(cart).map(([itemId, { qty, note }]) => ({
          menu_item_id: itemId,
          quantity: Number(qty),
          waiter_id: user.id,
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

      await axiosInstance.patch(
        `/restaurants/${restaurantId}/tables/${tableId}`,
        { status: "occupied" },
      );

      clearCart();
      setNote("");
      setLastKOT(order.id || "");

      toast.success("Order sent to kitchen!");
      // Prepare KOT data
      const kot: KOTProps = {
        table: `${table.room_name || "Room"}:${table.name || "Table"}`,
        waiter: user.full_name || user.id,
        orders: Object.entries(cart).map(([id, { name, qty, note }]) => ({
          id,
          name,
          qty,
          remark: note,
        })),
        note,
        totalQty: Object.values(cart).reduce((sum, item) => sum + item.qty, 0),
      };

      setKotData(kot);
      setShowKOTOverlay(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Backend error:", err.response?.data);
        toast.error(
          err.response?.data?.message ||
            "Failed to send order. Please try again.",
        );
      } else if (err instanceof Error) {
        console.error(err.message);
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  const { data: menu = [], isLoading } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/restaurants/${restaurantId}/menu`);
      return res.data;
    },
  });
  if (isLoading) {
    return <MenuPageSkeleton />;
  }
  const total = Object.entries(cart).reduce((sum, [itemId, { qty }]) => {
    const item = menu.find((m: { id: string }) => m.id === itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0);

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
    <>
      {showKOTOverlay && kotData && (
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
                kot={kotData}
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
                  if (!kotData) {
                    toast.error("No KOT data available to print");
                    return;
                  }

                  // Prepare KOT data with restaurant info
                  const kotToPrint = {
                    ...kotData,
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

      <div className="container mx-auto relative  ">
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-1 text-center md:text-left px-10 py-3">
            MENU <span className="text-[#FB8A22]">SECTION</span>
          </h2>
          {/* Image */}
          <div className="absolute -top-10 right-0 z-50 rounded-lg overflow-hidden pointer-events-none w-30 h-30 sm:w-32 sm:h-32 lg:w-[220px] lg:h-[200px]">
            <Image
              src="/icons/garlic.svg"
              alt="Menu Illustration"
              fill
              className="object-contain"
            />
          </div>

          <Card className="border-0 shadow-none bg-transparent p-6 m-1">
            <div className="flex items-center w-full justify-start  gap-4">
              {/* Search box */}
              <div className="flex items-center w-[130px] sm:w-[250px] h-8 md:h-10 shadow rounded-md border px-2 bg-white gap-2">
                <button type="button">
                  <Icon
                    icon="mdi:magnify"
                    className=" h-3 w-3 md:w-5 md:h-5 text-[#6A6C6E] transform scale-x-[-1]"
                  />
                </button>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 h-full outline-none bg-transparent text-xs sm:text-sm text-[#6A6C6E]"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-between w-[90px] h-9 px-2 rounded-md bg-white shadow hover:bg-gray-100 transition sm:w-[200px] sm:h-10 sm:px-3">
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
                  className="z-50  bg-white/90 backdrop-blur-xs rounded-md text-[#616161] shadow-md cursor-pointer py-0 sm:py-1 px-0 sm:px-3"
                >
                  <DropdownMenuItem
                    onClick={() => setFilterCategory("")}
                    className="mb-1 rounded hover:bg-orange-100 text-[10px] sm:text-xs transition-colors py-1 px-2 sm:py-1 sm:px-3"
                  >
                    All Dishes
                  </DropdownMenuItem>
                  {categories.map((cat) => (
                    <DropdownMenuItem
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className="mb-1 rounded hover:bg-orange-100 text-[10px] sm:text-xs transition-colors py-1 px-2 sm:py-1 sm:px-3 last:mb-0"
                    >
                      {cat}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                className="  relative p-1.5  bg-gradient-to-r from-orange-400 to-red-400 
 rounded-sm text-white shadow hover:bg-orange-600 transition"
                onClick={() => setShowCartMobile(!showCartMobile)}
              >
                <Icon icon="mdi:cart-outline" className="w-4 h-4" />
                {Object.keys(cart).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white text-black text-[9px] rounded-full flex items-center justify-center">
                    {Object.keys(cart).length}
                  </span>
                )}
              </button>
            </div>

            {showCartMobile && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-2 "
                onClick={() => setShowCartMobile(false)}
              >
                {/* Cart container */}
                <div
                  className="relative w-72 max-w-[90vw] max-h-[70vh] bg-white rounded-lg shadow-lg flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="p-3 border-b">
                    <h3 className="text-xl font-semibold text-[#FB8A22]">
                      Cart
                    </h3>
                  </div>

                  {/* Scrollable items */}
                  <div className="flex-1 overflow-auto p-3 flex flex-col gap-2">
                    {Object.keys(cart).length === 0 ? (
                      <p className="text-sm text-black/70">
                        Tap items to add to cart.
                      </p>
                    ) : (
                      Object.entries(cart).map(([id]) => {
                        const item = menu.find(
                          (m: { id: string }) => m.id === id,
                        )!;
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

                              <span className="text-xs font-semibold w-5 text-center text-[#00A149]">
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
                              Rs {Number(item.price ?? 0).toFixed(2)}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Bottom controls */}
                  <div className="sticky bottom-0 bg-white border-t p-3 flex flex-col gap-2 rounded-2xl">
                    <span className="text-sm font-medium text-black block">
                      Note:
                    </span>
                    <Input
                      className="shadow-sm rounded-md text-sm"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. Less spicy"
                    />

                    <div className="h-px w-full bg-gray-300 my-2"></div>

                    <div className="flex justify-between text-sm font-semibold text-black/80">
                      <span>Total</span>
                      <span>Rs.{total.toFixed(2)}/-</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-lg h-9 hover:from-orange-500 hover:to-red-500 hover:shadow-md transition-all text-sm"
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

                    {showKOTOverlay && kotData && (
                      <Dialog
                        open={showKOTOverlay}
                        onOpenChange={setShowKOTOverlay}
                      >
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
                              kot={kotData}
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
                                if (!kotData) {
                                  toast.error("No KOT data available to print");
                                  return;
                                }

                                // Prepare KOT data with restaurant info
                                const kotToPrint = {
                                  ...kotData,
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
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3  gap-4 sm:gap-8 py-10">
                {(() => {
                  const filteredMenu = menu.filter(
                    (m: MenuItem) =>
                      (filterCategory === "" ||
                        m.category === filterCategory) &&
                      (searchTerm === "" ||
                        m.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())),
                  );

                  const ITEMS_PER_PAGE = 8;

                  const currentMenu = filteredMenu.slice(
                    (currentPage - 1) * ITEMS_PER_PAGE,
                    currentPage * ITEMS_PER_PAGE,
                  );

                  if (filteredMenu.length === 0) {
                    return (
                      <div className="col-span-full text-center text-gray-500 py-10">
                        No food items found
                      </div>
                    );
                  }

                  return currentMenu.map((m: MenuItem) => {
                    const selected = !!cart[m.id];
                    return (
                      <div
                        key={m.id}
                        onClick={() => addToCart(m.id)}
                        className={`flex flex-row items-stretch gap-0 rounded-xl bg-white shadow cursor-pointer overflow-hidden transition-all duration-150 box-border
          ${selected ? "border-2 border-green-600" : "border border-zinc-200"}
           h-[90px] sm:h-[110px] md:h-[130px] lg:h-[100px] xl:h-[150px] "w-[15vw] sm:w-[12vw] md:w-[10vw] lg:w-[20vw] "`}
                      >
                        {/* Left Image */}
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

                        {/* Right Content */}
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
                              className={`flex flex-col ${selected ? "gap-0.5" : "gap-1"}`}
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

                                <span className="text-[9px] sm:text-[10px] md:text-sm font-medium min-w-[4px] sm:min-w-[5px] text-center">
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
                  });
                })()}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center mt-4 gap-1 sm:gap-2">
                <button
                  className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-bold ${
                    currentPage === 1
                      ? "bg-[#EEEEF0] text-black cursor-not-allowed"
                      : "bg-[#EEEEF0] text-black hover:bg-gray-300"
                  }`}
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>

                {Array.from(
                  {
                    length: Math.ceil(
                      menu.filter(
                        (m: MenuItem) =>
                          (filterCategory === "" ||
                            m.category === filterCategory) &&
                          (searchTerm === "" ||
                            m.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())),
                      ).length / 8,
                    ),
                  },
                  (_, i) => i + 1,
                ).map((page) => (
                  <button
                    key={page}
                    className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm font-medium ${
                      currentPage === page
                        ? "bg-[#FB8A22] text-white border-orange-500 hover:bg-orange-400"
                        : "bg-[#EEEEF0] text-gray-700 hover:bg-orange-400 hover:text-white"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-bold ${
                    currentPage ===
                    Math.ceil(
                      menu.filter(
                        (m: MenuItem) =>
                          (filterCategory === "" ||
                            m.category === filterCategory) &&
                          (searchTerm === "" ||
                            m.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())),
                      ).length / 8,
                    )
                      ? "bg-[#EEEEF0] text-black cursor-not-allowed"
                      : "bg-[#EEEEF0] text-black hover:bg-gray-300"
                  }`}
                  onClick={() =>
                    currentPage <
                      Math.ceil(
                        menu.filter(
                          (m: MenuItem) =>
                            (filterCategory === "" ||
                              m.category === filterCategory) &&
                            (searchTerm === "" ||
                              m.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())),
                        ).length / 8,
                      ) && setCurrentPage(currentPage + 1)
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(
                      menu.filter(
                        (m: MenuItem) =>
                          (filterCategory === "" ||
                            m.category === filterCategory) &&
                          (searchTerm === "" ||
                            m.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())),
                      ).length / 8,
                    )
                  }
                >
                  &gt;
                </button>
              </div>
            </div>
          </Card>
        </div>

        {menu.length > 0 && (
          <div className="absolute  -right-20 lg:-right-1  bottom-1 opacity-90 hidden sm:block">
            <Image
              src="/icons/table_image.svg"
              alt="Menu Table"
              width={500}
              height={300}
              className="object-contain "
            />
          </div>
        )}
        <div className="relative w-full h-[220px] sm:h-[180px] xs:h-[150px] sm:bottom-0">
          <div className="absolute left-0 opacity-70 w-24 h-24 -bottom-2 sm:bottom-0 sm:w-100 sm:h-50">
            <Image
              src="/icons/pizza_image.svg"
              alt="Pizza"
              fill
              className="object-contain"
            />
          </div>

          {/* Fries in center */}
          <div className="absolute left-40  sm:left-1/2 -translate-x-1/2 opacity-70 bottom-0 sm:bottom-0 w-16 h-16 sm:w-60 sm:h-20">
            <Image
              src="/icons/fries_image.svg"
              alt="Fries"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute  left-25 w-full h-[300px]  sm:hidden">
            <Image
              src="/icons/table_image.svg"
              alt="Menu Table"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </>
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
    const { data: ingredients = [] } = useMenuIngredients(restaurantId, cardId);

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
      return <p className="text-xs text-gray-500">No ingredients</p>;

    return (
      <>
        {ingredients.map((ingredient: MenuIngredientFormValues) => {
          const cleanName = ingredient.name.replace(/^#/, "");

          return (
            <DropdownMenuItem
              key={ingredient.id}
              asChild
              onSelect={(e) => e.preventDefault()}
            >
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="peer w-4 h-4 opacity-0 absolute"
                  checked={filters[cardId]?.includes(cleanName) || false}
                  onChange={() => togglePreference(cardId, cleanName)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span
                  className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center
                         peer-checked:bg-green-500 peer-checked:border-green-500"
                >
                  {filters[cardId]?.includes(cleanName) && (
                    <Icon icon="mdi:check" className="w-3 h-3 text-white" />
                  )}
                </span>
                <span className="text-sm text-gray-900">{cleanName}</span>
              </label>
            </DropdownMenuItem>
          );
        })}
      </>
    );
  }
}

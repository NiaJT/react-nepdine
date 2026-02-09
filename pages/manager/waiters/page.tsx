"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { axiosInstance } from "@/lib/axios.instance";
import { useQueries, useQuery } from "@tanstack/react-query";
import { WaiterFormValues } from "../../../../../validation-schema/waiterSchema";
import { OrderResponse } from "../../../../../validation-schema/orderSchema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import WaitersPageSkeleton from "@/components/LoadingPages/WaiterLoad";

export default function WaitersPage() {
  const router = useRouter();
  const [selectedWaiterId, setSelectedWaiterId] = useState("");
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("restaurant_id");
    setRestaurantId(id);
  }, []);

  const handleSelectWaiter = (waiterId: string) => {
    setSelectedWaiterId(waiterId);

    if (waiterId) {
      router.push(`/waiters/${waiterId}`);
    }
  };

  const { data: waiters = [], isLoading } = useQuery({
    queryKey: ["waiters"],
    enabled: !!restaurantId,
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/restaurants/${restaurantId}/waiters`
      );
      return res.data;
    },
  });

  const waiterOrdersQueries = useQueries({
    queries: waiters.map((waiter: WaiterFormValues) => ({
      queryKey: ["waiterOrders", restaurantId, waiter.id],
      queryFn: async (): Promise<{ orders: OrderResponse[] }> => {
        const res = await axiosInstance.get(
          `/restaurants/${restaurantId}/waiters/${waiter.id}/orders`
        );
        return res.data; // must return { orders: Order[] }
      },
      enabled: !!restaurantId && !!waiter.id,
    })),
  }) as { data?: { orders: OrderResponse[] } }[];

  const getTotalOrdersForWaiter = (waiterId: string) => {
    const index = waiters.findIndex((w: { id: string }) => w.id === waiterId);
    if (index === -1) return 0;

    const orders = waiterOrdersQueries[index]?.data?.orders;
    return orders?.length ?? 0;
  };

  const avatarColor = (name: string) => {
    const colors = [
      "bg-red-100",
      "bg-green-100",
      "bg-blue-100",
      "bg-yellow-100",
    ];
    return colors[name?.charCodeAt(0) % colors.length] ?? "bg-gray-200";
  };
  if (isLoading) {
    return <WaitersPageSkeleton />;
  }
  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-[100%] tracking-[3%] text-center uppercase mb-3">
            WAITER&apos;S
            <span className="text-[#FB8A22] text-2xl sm:text-3xl font-bold">
              {" "}
              OVERVIEW
            </span>
          </h1>
        </div>

        <div className="flex items-center rounded-xl border border-gray-300 bg-white w-full sm:w-auto shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center border-l border-gray-300 px-4 sm:px-6 py-2 cursor-pointer hover:bg-gray-100 transition rounded-xl">
                <Image
                  src="/icons/user.svg"
                  width={20}
                  height={20}
                  alt="User Icon"
                />
                <span className="ml-2 font-bold text-sm text-black/80 ">
                  {selectedWaiterId
                    ? waiters.find(
                        (w: { id: string }) => w.id === selectedWaiterId
                      )?.name
                    : "Waiter"}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-black/50 ml-1" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white shadow-sm rounded-md mt-1 py-1 w-40 h-60 overflow-y-auto capitalize ">
              {waiters.map((w: WaiterFormValues, idx: number) => (
                <div key={w.id}>
                  <DropdownMenuItem
                    onClick={() => handleSelectWaiter(w.id)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize z-50"
                  >
                    {w.name}
                  </DropdownMenuItem>
                  {idx !== waiters.length - 1 && (
                    <div className="border-b border-gray-200 mx-2" />
                  )}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <p className="font-medium text-[18px] leading-[100%] tracking-[3%] ">
        Leaderboard
      </p>
      {/* Leaderboard */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 py-4 px-6 bg-white justify-evenly rounded-xl shadow-md shadow-black/40">
        {waiters
          .slice()
          .sort(
            (a: { rating: number }, b: { rating: number }) =>
              (b.rating ?? 0) - (a.rating ?? 0)
          )
          .slice(0, 3)
          .map(
            (
              w: {
                id: string;
                name: string;
                rating: number;
              },
              index: number
            ) => {
              let medalSrc = "/icons/medal.svg";
              if (index === 0) medalSrc = "/icons/gold.svg";
              else if (index === 1) medalSrc = "/icons/silver.svg";
              else if (index === 2) medalSrc = "/icons/bronze.svg";

              return (
                <div
                  key={w.id}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.33%-0.75rem)] min-h-[70px] rounded-lg p-3 bg-gradient-to-r from-[#FB8A2266] to-[#f7f0ea] flex items-center gap-3 shadow-md shadow-black/40 cursor-pointer hover:shadow-lg transition"
                  onClick={() => handleSelectWaiter(w.id)} // ✅ use w.id
                >
                  <Avatar className="w-12 h-12 sm:w-14 sm:h-14">
                    <AvatarFallback
                      className={`text-lg sm:text-xl flex items-center justify-center font-semibold ${avatarColor(
                        w.name || ""
                      )}`}
                    >
                      {w.name?.[0]?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-base sm:text-lg text-zinc-900">
                      {w.name}
                    </div>
                    <div className="text-xs sm:text-sm text-black flex items-center gap-2">
                      <span className="text-black/50 font-semibold">
                        {getTotalOrdersForWaiter(w.id)} orders
                      </span>
                      <span className="text-orange-500 font-medium">
                        {w.rating ?? 4.6}
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 mr-2">
                    <Image src={medalSrc} alt="Medal" width={40} height={40} />
                  </div>
                </div>
              );
            }
          )}
      </div>

      <div className="overflow-x-auto rounded-2xl  bg-white">
        <Table className="min-w-full border-separate border-spacing-y-4">
          {/* Table Header */}
          <TableHeader className="bg-white rounded-t-2xl shadow-md">
            <TableRow>
              <TableHead className="text-[#9B9B9B] py-3 px-4">ID</TableHead>
              <TableHead className="text-[#9B9B9B] py-3 px-4">Name</TableHead>
              <TableHead className="text-[#9B9B9B] py-3 px-4">Status</TableHead>
              <TableHead className="text-[#9B9B9B] py-3 px-4">Mobile</TableHead>
              <TableHead className="text-[#9B9B9B] py-3 px-4 text-center">
                Orders
              </TableHead>
              <TableHead className="text-[#9B9B9B] py-3 px-4 text-center">
                Rating
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="space-y-3 p-3 sm:p-4">
            {waiters.length > 0 ? (
              waiters
                .slice()
                .sort((a: { name: string }, b: { name: string }) =>
                  a.name.localeCompare(b.name)
                )
                .map((w: WaiterFormValues, idx: number) => (
                  <TableRow
                    key={w.id}
                    className={`bg-white hover:bg-gray-50 shadow-md  rounded-md cursor-pointer transition ${
                      selectedWaiterId === w.id
                        ? "border-2 border-orange-300"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedWaiterId(w.id);
                      handleSelectWaiter(w.id);
                    }}
                  >
                    {/* ID */}
                    <TableCell className="py-3 px-4  text-black">
                      {String(idx + 1).padStart(2, "0")}
                    </TableCell>

                    {/* Name */}
                    <TableCell className="py-3 px-4 text-black capitalize">
                      {w.name}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span
                        className={`px-4 py-1 rounded-md text-xs font-medium capitalize ${w.status?.toLowerCase() === "active" ? "bg-green-100 text-green-600 border-2 border-green-500" : w.status?.toLowerCase() === "inactive" ? "bg-red-100 text-red-600 border-2 border-red-500" : "bg-orange-100 text-orange-600 border-2 border-orange-500"} `}
                      >
                        {w.status || "Unknown"}
                      </span>
                    </TableCell>

                    {/* Mobile */}
                    <TableCell className="py-3 px-4 text-black">
                      {w.contact || "--"}
                    </TableCell>

                    {/* Orders */}
                    <TableCell className="py-3 px-4 text-center text-black">
                      {getTotalOrdersForWaiter(w.id)}
                    </TableCell>

                    {/* Rating */}
                    <TableCell className="py-3 px-4 text-center text-orange-500">
                      {w.rating ?? "--"}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 py-6"
                >
                  No waiters found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Waiter</DialogTitle>
            <DialogDescription>Update the waiter's details and save changes.</DialogDescription>
          </DialogHeader>

          {selectedWaiter && (
            <div className="space-y-3 mt-2">
              <Input
                placeholder="Name"
                value={selectedWaiter.name}
                onChange={(e) =>
                  setSelectedWaiter({ ...selectedWaiter, name: e.target.value })
                }
              />
              <Input
                placeholder="Mobile"
                type="number"
                value={selectedWaiter.mobile}
                onChange={(e) =>
                  setSelectedWaiter({
                    ...selectedWaiter,
                    mobile: Number(e.target.value),
                  })
                }
              />
              <select
                value={selectedWaiter.shift}
                onChange={(e) =>
                  setSelectedWaiter({
                    ...selectedWaiter,
                    shift: e.target.value as "Morning" | "Evening" | "Night",
                  })
                }
                className="border rounded-md px-3 py-2 w-full"
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
              <select
                value={selectedWaiter.status}
                onChange={(e) =>
                  setSelectedWaiter({
                    ...selectedWaiter,
                    status: e.target.value as "Active" | "Inactive" | "In Break",
                  })
                }
                className="border rounded-md px-3 py-2 w-full"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="In Break">In Break</option>
              </select>
            </div>
          )}

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateWaiter}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Waiter</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedWaiter?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}

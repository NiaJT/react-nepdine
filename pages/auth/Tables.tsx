"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "@/components/ui/image";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { axiosInstance } from "@/lib/axios.instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { v4 as uuidv4 } from "uuid";
import { roomSchema } from "../../../../validation-schema/roomSchema";
import { tableSchema } from "../../../../validation-schema/tableSchema";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { useAddTable, useRooms, useTables } from "@/hooks/auth/useTables";
import { useUser } from "@/components/guards/UserContext";
import TablePageSkeleton from "@/components/LoadingPages/TableLoad";

type RoomFormValues = z.infer<typeof roomSchema>;
type TableFormValues = z.infer<typeof tableSchema>;

export default function TablePage() {
  const { user } = useUser();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<TableFormValues>>({
    name: "",
    description: "",
    capacity: 0,
    status: "",
    current_group_id: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [newRoomForm, setNewRoomForm] = useState({
    name: "",
    description: "",
    table: "",
  });
  const [restaurantId, setRestaurantId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("restaurant_id") || "";
    setRestaurantId(id);
  }, []);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "table" | "room";
    id: string;
    name: string;
  } | null>(null);

  const { data: tables, isLoading: TableLoading } = useTables(restaurantId);
  const { data: rooms, isLoading: RoomLoading } = useRooms(restaurantId);

  function useAddRoom() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (newRoom: {
        name: string;
        description: string;
        tables?: string[];
        restaurant_id: string;
      }) => {
        const { restaurant_id, ...payload } = newRoom;
        const res = await axiosInstance.post(
          `/restaurants/${restaurant_id}/rooms`,
          payload,
        );
        return res.data;
      },

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
        toast.success("Room added successfully!");
      },

      onError: (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.message || "Failed to add room";
        console.error(
          "Failed to add room:",
          error.response?.data || error.message,
        );
        toast.error(message);
      },
    });
  }

  const { mutateAsync: addTable } = useAddTable(restaurantId);

  const queryClient = useQueryClient();

  const { mutateAsync: updateTable } = useMutation({
    mutationFn: async (values: TableFormValues & { id: string }) => {
      const res = await axiosInstance.patch(
        `/restaurants/${restaurantId}/tables/${values.id}`,
        values,
      );
      return res.data;
    },
    onSuccess: async (updatedTable) => {
      const tables =
        queryClient.getQueryData<TableFormValues[]>(["tables"]) || [];

      const updatedTables = tables.map((t) =>
        t.id === updatedTable.id ? updatedTable : t,
      );

      const roomId = updatedTable.room_id;
      if (!roomId) return;

      const roomTables = updatedTables
        .filter((t) => t.room_id === roomId && /^T\d+$/.test(t.name))
        .sort(
          (a, b) =>
            parseInt(a.name.replace("T", "")) -
            parseInt(b.name.replace("T", "")),
        );

      const startIndex = roomTables.findIndex((t) => t.id === updatedTable.id);

      for (let i = startIndex + 1; i < roomTables.length; i++) {
        const t = roomTables[i];
        const newName = `T${i + 1}`;
        if (t.name !== newName) {
          t.name = newName;
          await axiosInstance.patch(
            `/restaurants/${restaurantId}/tables/${t.id}`,
            { name: newName },
          );
        }
      }

      // Update cache
      queryClient.setQueryData(
        ["tables"],
        updatedTables.map((t) => {
          const renamed = roomTables.find((rt) => rt.id === t.id);
          return renamed || t;
        }),
      );
    },
  });

  const { mutateAsync: removeTable } = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/restaurants/${restaurantId}/tables/${id}`);
    },
    onSuccess: async (_, id) => {
      // Get current tables from cache
      const tables =
        queryClient.getQueryData<TableFormValues[]>(["tables"]) || [];

      // Find the table being deleted
      const tableToDelete = tables.find((t) => t.id === id);

      if (!tableToDelete) return;

      // Only proceed if the table name matches T<number>
      if (!/^T\d+$/.test(tableToDelete.name)) return;

      // Remove deleted table
      const updatedTables = tables.filter((t) => t.id !== id);

      // Rename remaining tables sequentially in the same room
      const roomId = tableToDelete.room_id;
      if (roomId) {
        const roomTables = updatedTables
          .filter((t) => t.room_id === roomId && /^T\d+$/.test(t.name))
          .sort(
            (a, b) =>
              parseInt(a.name.replace("T", "")) -
              parseInt(b.name.replace("T", "")),
          );

        for (let i = 0; i < roomTables.length; i++) {
          const t = roomTables[i];
          const newName = `T${i + 1}`;
          if (t.name !== newName) {
            t.name = newName;
            await updateTable({ ...t, id: t.id });
          }
        }
      }
      // Update cache once
      queryClient.setQueryData(["tables"], updatedTables);
    },
  });

  // function useIsMobile(breakpoint = 640) {
  //   const [isMobile, setIsMobile] = useState(false);

  //   useEffect(() => {
  //     const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
  //     handleResize();
  //     window.addEventListener("resize", handleResize);
  //     return () => window.removeEventListener("resize", handleResize);
  //   }, [breakpoint]);

  //   return isMobile;
  // }

  const { mutateAsync: addRoom } = useAddRoom();

  const filteredTables = selectedRoom
    ? tables.filter((t: { room_id: string }) => t.room_id === selectedRoom)
    : tables;
  if (TableLoading || RoomLoading) {
    return <TablePageSkeleton />;
  }
  return (
    <div className="grid gap-4 ">
      <div className="inline-flex items-center justify-between relative flex-col md:flex-row">
        <h1 className="font-poppins text-xl sm:px-5 sm:py-5 sm:text-3xl font-bold text-zinc-900 mb-5 sm:mb-0">
          TABLE
          <span className="text-[#FB8A22] text-xl sm:text-3xl font-bold">
            {" "}
            SECTION
          </span>
        </h1>
        <div className="inline-flex items-center relative rounded-xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.4)] sm:mr-4">
          <div
            onClick={async () => {
              const roomId = selectedRoom || rooms[0]?.id;
              if (!roomId) {
                setDeleteError("Please select a room first!");
                return;
              }

              const roomTables = tables.filter(
                (t: TableFormValues) => t.room_id === roomId,
              );

              const nextIndex =
                roomTables.length > 0
                  ? Math.max(
                      ...roomTables.map((t: TableFormValues) => {
                        const num = parseInt(
                          (t.name || "").replace("T", "").trim(),
                        );
                        return isNaN(num) ? 0 : num;
                      }),
                    ) + 1
                  : 1;

              await addTable({
                id: uuidv4(),
                name: `T${nextIndex}`,
                capacity: 2,
                room_id: roomId,
                status: "available",
              });
            }}
            className="text-white bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-700 px-4 py-2 flex items-center rounded-l-xl cursor-pointer"
          >
            Add Table
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 border-l border-zinc-200 bg-white hover:bg-gray-100 rounded-r-xl cursor-pointer relative"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Icon
              icon="hugeicons:door-01"
              className="w-5 h-5 text-orange-500"
            />
            <span>
              {selectedRoom
                ? rooms.find((r: { id: string }) => r.id === selectedRoom)?.name
                : "All Rooms"}
            </span>
            <Icon icon="material-symbols:arrow-drop-down" className="w-5 h-5" />

            {isOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-xl z-50 max-h-60 overflow-auto">
                <div
                  onClick={() => {
                    setSelectedRoom(null);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold"
                >
                  <Icon
                    icon="material-symbols:window"
                    className="w-5 h-5 text-gray-500"
                  />
                  <span>All Rooms</span>
                </div>

                {rooms.map((r: RoomFormValues) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-2 px-4 py-2 hover:bg-orange-100 cursor-pointer"
                    onClick={() => {
                      // Clicking anywhere on this div (except the delete button) selects the room
                      setSelectedRoom(r.id!);
                      setIsOpen(false);
                    }}
                  >
                    <span>{r.name}</span>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ prevents the row click
                        setDeleteTarget({
                          type: "room",
                          id: r.id!,
                          name: r.name,
                        });
                        setDeleteDialogOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded"
                      title="Delete room"
                    >
                      <Icon
                        icon="material-symbols:delete-outline"
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                ))}

                <div
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ avoid accidental toggle
                    setRoomDialogOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-green-100 cursor-pointer font-semibold"
                >
                  <Icon
                    icon="material-symbols:add-circle-outline"
                    className="w-5 h-5 text-green-500"
                  />
                  <span>Add Room</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-10  sm:gap-6 lg:gap-10">
        {filteredTables &&
          filteredTables.map(
            (t: {
              id: string;
              name: string;
              capacity: number;
              status: string;
              room_id: string;
              description?: string;
              restaurant_id?: string;
              tenant_id?: string;
              current_group_id?: string;
            }) => {
              const getChairs = (
                capacity: number,
                tableWidth: number,
                tableHeight: number,
              ) => {
                const chairs: {
                  x: number;
                  y: number;
                  side: "top" | "bottom" | "left" | "right";
                }[] = [];

                const perSide = Math.floor(capacity / 4);
                let remainder = capacity % 4;

                const distribute = (
                  count: number,
                  isHorizontal: boolean,
                  fixed: number,
                  size: number,
                  side: "top" | "bottom" | "left" | "right",
                ) => {
                  if (count === 1) {
                    chairs.push(
                      isHorizontal
                        ? { x: 0, y: fixed, side }
                        : { x: fixed, y: 0, side },
                    );
                  } else {
                    for (let i = 0; i < count; i++) {
                      const pos = (i + 1) * (size / (count + 1)) - size / 2;
                      chairs.push(
                        isHorizontal
                          ? { x: pos, y: fixed, side }
                          : { x: fixed, y: pos, side },
                      );
                    }
                  }
                };

                distribute(
                  perSide + (remainder > 0 ? 1 : 0),
                  false,
                  tableWidth / 2 + 20,
                  tableHeight,
                  "right",
                );
                remainder = Math.max(0, remainder - 1);

                distribute(
                  perSide + (remainder > 0 ? 1 : 0),
                  false,
                  -tableWidth / 2 - 20,
                  tableHeight,
                  "left",
                );
                remainder = Math.max(0, remainder - 1);

                distribute(
                  perSide + (remainder > 0 ? 1 : 0),
                  true,
                  -tableHeight / 2 - 20,
                  tableWidth,
                  "top",
                );
                remainder = Math.max(0, remainder - 1);

                distribute(
                  perSide + (remainder > 0 ? 1 : 0),
                  true,
                  tableHeight / 2 + 20,
                  tableWidth,
                  "bottom",
                );

                return chairs;
              };

              const isMobile =
                typeof window !== "undefined" && window.innerWidth < 640;

              // Chairs for phone and PC
              const chairs = isMobile
                ? getChairs(t.capacity ?? 0, 110, 80)
                : getChairs(t.capacity ?? 0, 210, 110);
              return (
                <div
                  key={String(t.id)}
                  className="group relative flex items-center justify-center sm:mb-34 mt-10 "
                >
                  {chairs.map((c, idx) => (
                    <div
                      key={idx}
                      className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-red shadow bg-tra"
                      style={{
                        transform: `translate(${c.x}px, ${c.y}px) rotate(${
                          c.side === "top"
                            ? "0deg"
                            : c.side === "right"
                              ? "90deg"
                              : c.side === "bottom"
                                ? "180deg"
                                : "270deg"
                        })`,
                      }}
                    >
                      <Image
                        src="/icons/chair.svg"
                        width={5}
                        height={5}
                        alt="Chair Icon"
                        className="w-5 h-5  sm:w-8 sm:h-8"
                      />
                    </div>
                  ))}
                  <Link
                    href={
                      user?.role === "admin"
                        ? `/tables/${t.id}`
                        : `/menu_waiters?tableId=${t.id}`
                    }
                  >
                    <Card className="w-[120px] h-[80px] sm:w-[210px] sm:h-[110px] flex flex-row rounded-lg hover:shadow-lg overflow-hidden bg-[#FFE5B5] relative p-0 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.4)]">
                      <div
                        className={`w-2 sm:w-3 absolute left-0 top-0 h-full ${
                          t.status === "occupied"
                            ? "bg-[#FF0000]"
                            : t.status === "reserved"
                              ? "bg-[#4991E7]"
                              : "bg-[#00A14999]"
                        }`}
                      ></div>

                      <div className="flex flex-col flex-1 ml-2 sm:ml-3 justify-between">
                        <CardHeader className="p-1 sm:p-2">
                          <CardTitle className="text-[10px] sm:text-lg font-semibold text-[#C8691C] truncate">
                            {t.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-1 sm:px-2 pb-1 sm:pb-2 text-[8px] sm:text-xs flex justify-between items-end">
                          <span className="text-orange-900">
                            Capacity {t.capacity ?? "-"}
                          </span>
                          <Badge className="bg-white text-zinc-600 shadow-lg text-[9px] w-[50px] sm:w-[70px] sm:text-xs">
                            {t.status}
                          </Badge>
                        </CardContent>
                      </div>

                      <div className="absolute right-1 sm:right-2 top-1 sm:top-2 hidden items-center gap-1 group-hover:flex">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingId(t.id ? String(t.id) : null);

                            setForm({
                              ...form,
                              name: t.name as string,
                              description: t.description ?? "",
                              capacity: t.capacity ?? 0,
                              status: t.status as string,
                              current_group_id: t.current_group_id || "",
                            });
                          }}
                          className="rounded-md border border-zinc-200 bg-white px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-zinc-700 shadow-sm hover:bg-zinc-50 cursor-pointer"
                          title="Edit table"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteTarget({
                              type: "table",
                              id: t.id as string,
                              name: t.name as string,
                            });
                            setDeleteDialogOpen(true);
                          }}
                          className="rounded-md border bg-red-200 border-red-200 hover:bg-red-400 px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-zinc-700 shadow-sm  cursor-pointer"
                          title="Remove table"
                        >
                          Remove
                        </button>
                      </div>
                    </Card>
                  </Link>

                  {editingId === t.id && (
                    <Dialog
                      open={true}
                      onOpenChange={(v) => !v && setEditingId(null)}
                    >
                      <DialogOverlay className="bg-gray-200/70 backdrop-blur-sm" />
                      <DialogContent className="sm:max-w-[600px] rounded-xl shadow-lg">
                        <DialogHeader>
                          <DialogTitle>Edit Table</DialogTitle>
                        </DialogHeader>
                        <div className="px-5 pb-4 pt-2 grid gap-3">
                          <div className="grid gap-1">
                            <label className="text-sm">Name</label>
                            <Input
                              value={form.name}
                              onChange={(e) =>
                                setForm((f) => ({ ...f, name: e.target.value }))
                              }
                            />
                          </div>
                          <div className="grid gap-1">
                            <label className="text-sm">Description</label>
                            <Input
                              value={form.description}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  description: e.target.value,
                                }))
                              }
                              placeholder="Optional"
                            />
                          </div>
                          <div className="grid gap-1">
                            <label className="text-sm">Capacity</label>
                            <Input
                              type="number"
                              min={1}
                              value={form.capacity ?? ""}
                              onChange={(e) =>
                                setForm((f) => ({
                                  ...f,
                                  capacity: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={async () => {
                              if (!t.id) return;

                              // Prepare fields
                              const name = form.name?.trim() || String(t.name);
                              const description =
                                form.description?.trim() ??
                                String(t.description ?? "");
                              const capacity =
                                form.capacity !== undefined &&
                                !isNaN(form.capacity)
                                  ? form.capacity
                                  : Number(t.capacity);
                              const status =
                                form.status?.trim() || String(t.status);
                              const room_id =
                                selectedRoom || String(t.room_id || "");

                              // Check capacity constraints
                              if (isNaN(capacity) || capacity < 1) {
                                setDeleteError(
                                  "Capacity must be a number greater than 0",
                                );
                                return;
                              }
                              if (capacity > 20) {
                                toast.error(
                                  "A table cannot have more than 20 chairs!",
                                );
                                return;
                              }

                              // Prepare payload
                              const payload = {
                                id: String(t.id),
                                name,
                                description,
                                capacity, // guaranteed number
                                status,
                                room_id,
                              };

                              try {
                                await updateTable(payload);
                                setEditingId(null);
                              } catch (err: unknown) {
                                if (err instanceof Error) {
                                  console.error(err.message);
                                  setDeleteError(
                                    `Failed to update table: ${err.message}`,
                                  );
                                } else {
                                  console.error(err);
                                  setDeleteError("Failed to update table");
                                }
                              }
                            }}
                          >
                            Save
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              );
            },
          )}
      </div>
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={() => {
          setDeleteDialogOpen(false);
          setDeleteError(null);
        }}
      >
        <DialogOverlay className="bg-gray-200/70 backdrop-blur-sm z-50" />
        <DialogContent className="sm:max-w-[500px] rounded-xl shadow-lg z-50">
          <DialogHeader>
            <DialogTitle>
              {deleteTarget?.type === "table"
                ? "Delete Table?"
                : "Delete Room?"}
            </DialogTitle>
          </DialogHeader>

          <div className="px-5 pb-4 pt-2 text-sm">
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </div>

          {/* Display error message inside dialog */}
          {deleteError && (
            <div className="px-5 pb-2 text-sm text-red-600 font-medium">
              {deleteError}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteError(null);
              }}
            >
              Cancel
            </Button>

            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={async () => {
                if (!deleteTarget) return;

                try {
                  if (deleteTarget.type === "table") {
                    const table = tables.find(
                      (t: TableFormValues) => t.id === deleteTarget.id,
                    );

                    if (table?.status === "occupied") {
                      setDeleteError(
                        `Cannot delete table "${deleteTarget.name}" because it is occupied or has active orders.`,
                      );
                      return;
                    }

                    await removeTable(deleteTarget.id);
                  } else if (deleteTarget.type === "room") {
                    const roomTables = tables.filter(
                      (t: TableFormValues) => t.room_id === deleteTarget.id,
                    );
                    const hasOccupied = roomTables.some(
                      (t: TableFormValues) => t.status === "occupied",
                    );

                    if (hasOccupied) {
                      setDeleteError(
                        `Cannot delete room "${deleteTarget.name}" because it has occupied tables or active orders.`,
                      );
                      return;
                    }

                    await Promise.all(
                      roomTables.map((t: TableFormValues) => removeTable(t.id)),
                    );
                    await axiosInstance.delete(
                      `/restaurants/${restaurantId}/rooms/${deleteTarget.id}`,
                    );
                    queryClient.invalidateQueries({ queryKey: ["rooms"] });
                    if (selectedRoom === deleteTarget.id) setSelectedRoom(null);
                  }

                  // If successful, close dialog and clear error
                  setDeleteDialogOpen(false);
                  setDeleteError(null);
                } catch (err: unknown) {
                  let msg = "Unknown error";
                  if (err && typeof err === "object" && "response" in err) {
                    const axiosErr = err as {
                      response?: { data?: { message?: string } };
                      message?: string;
                    };
                    msg =
                      axiosErr.response?.data?.message ||
                      axiosErr.message ||
                      msg;
                  } else if (err instanceof Error) {
                    msg = err.message;
                  }
                  setDeleteError(
                    `Failed to delete ${deleteTarget.type}: ${msg}`,
                  );
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
        <DialogOverlay className="bg-gray-200/70 backdrop-blur-sm z-50" />
        <DialogContent className="sm:max-w-[600px] rounded-xl shadow-lg z-50">
          <DialogHeader>
            <DialogTitle>Add Room</DialogTitle>
          </DialogHeader>

          <div className="px-5 pb-4 pt-2 grid gap-3">
            <div className="grid gap-1">
              <label className="text-sm">Name</label>
              <Input
                value={newRoomForm.name}
                onChange={(e) =>
                  setNewRoomForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm">Description</label>
              <Input
                value={newRoomForm.description}
                onChange={(e) =>
                  setNewRoomForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Optional"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRoomDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!newRoomForm.name) return;

                try {
                  if (!restaurantId) {
                    toast.error("Restaurant ID is missing!");
                    return;
                  }

                  await addRoom({
                    name: newRoomForm.name,
                    description: newRoomForm.description,
                    restaurant_id: restaurantId, // ✅ now guaranteed to be a string
                    tables: newRoomForm.table ? [newRoomForm.table] : [],
                  });
                } catch (err: unknown) {
                  if (err instanceof Error) {
                    console.error(err.message);
                    setDeleteError(`Failed to add room: ${err.message}`);
                  } else {
                    console.error(err);
                    setDeleteError("Failed to add room");
                  }
                }

                setRoomDialogOpen(false);
                setNewRoomForm({ name: "", description: "", table: "" });
              }}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

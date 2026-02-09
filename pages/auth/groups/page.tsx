"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Group } from "@/lib/types/globalTypes/types";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useDeleteGroup, useGroupsList } from "@/hooks/auth/useGroups";
import { useRooms } from "@/hooks/auth/useTables";
import OpenGroupForm from "@/components/partials/tenant/group/OpenGroupForm";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

import EditGroupForm from "@/components/partials/tenant/group/EditGroupForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import GroupsPageSkeleton from "@/components/LoadingPages/GroupLoad";

export default function GroupsPage() {
  const [restaurantId, setRestaurantId] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>();
  useEffect(() => {
    const id = localStorage.getItem("restaurant_id") || "";
    setRestaurantId(id);
  }, []);
  const [showAddCard, setShowAddCard] = useState(false);
  const { data: groups, isPending } = useGroupsList(restaurantId);
  const { mutate: deleteGroup } = useDeleteGroup(restaurantId);
  const { data: rooms, isPending: RoomPending } = useRooms(restaurantId);
  if (isPending || RoomPending) {
    return <GroupsPageSkeleton />;
  }
  return (
    <div className="grid gap-3 p-4 md:p-6 w-full sm:max-w-[700px] md:max-w-[900px] sm:mx-0 mx-auto sm:justify-normal justify-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left leading-[100%] tracking-[3%] uppercase mb-3">
        GROUP
        <span className="text-[#FB8A22] text-2xl sm:text-3xl font-bold">
          {" "}
          SECTION
        </span>
      </h1>
      {/* Top-right decorative image */}
      <div className="absolute top-0 right-0 z-0 hidden md:block pointer-events-none">
        <Image
          src="/group_select_imgtop.svg"
          alt="Group select egg"
          width={500}
          height={500}
          className="max-w-[40vw] h-auto"
        />
      </div>

      {/* Bottom-right decorative image */}
      <div className="absolute bottom-0 right-0 z-0 hidden md:block pointer-events-none">
        <Image
          src="/group_select_imgbottom.svg"
          alt="Decorative image"
          width={400}
          height={400}
          className="max-w-[40vw] h-auto"
        />
      </div>
      <Button
        className="w-25 px-4 py-2 bg-gradient-to-r from-[#FB8A22] to-[#EA454C] text-white rounded-lg shadow
        transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-110 hover:shadow-lg"
        onClick={() => setShowAddCard(!showAddCard)}
      >
        {showAddCard ? "Close Form" : "Add Group"}
      </Button>
      {/* Open Group Card aligned left */}
      {showAddCard && (
        <Card className="w-full justify-center sm:justify-start max-w-sm md:max-w-md lg:max-w-lg shadow-lg overflow-hidden">
          <CardContent className="p-3 overflow-x-hidden w-full max-w-full">
            <OpenGroupForm
              rooms={rooms}
              restaurantId={restaurantId}
              onOpen={(name, count, tableIds) =>
                console.log(name, count, tableIds)
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Active Groups Card aligned left */}
      <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg shadow-lg z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-medium text-center sm:text-left">
            Active <span className="text-[#FB8A22]">Groups</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {groups &&
              groups
                .filter((g) => !g.closed_at)
                .map((g) => {
                  const tablesByRoom: Record<
                    string,
                    { name: string; tables: string[] }
                  > = {};

                  g.tables?.forEach((t) => {
                    if (!tablesByRoom[t.room_id]) {
                      tablesByRoom[t.room_id] = {
                        name: t.room_name ?? "",
                        tables: [],
                      };
                    }
                    tablesByRoom[t.room_id].tables.push(t.name ?? "");
                  });

                  return (
                    <Link
                      key={g.id}
                      href={`/groups/${g.id}`}
                      className="block shadow-md group rounded-lg border border-zinc-200/70 bg-white p-2 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        {/* Left side: group name */}
                        <div className="flex items-center gap-1 font-semibold text-zinc-900 text-sm sm:text-base">
                          {g.name}
                        </div>

                        {/* Right side: people count */}
                        <div className="flex items-center gap-1 text-xs font-medium text-zinc-700">
                          <Icon
                            icon="icon-park-solid:avatar"
                            className="w-3 h-3 text-[#FB8A22]"
                          />
                          {g.people_count} people
                        </div>
                      </div>

                      {/* Room:Tables display */}
                      <div className="mt-1 text-xs text-zinc-700">
                        {Object.entries(tablesByRoom).map(([roomId, room]) => (
                          <div
                            key={roomId}
                            className="flex flex-wrap gap-1 items-center"
                          >
                            <span className="font-medium text-[#FB8A22]">
                              {room.name}:
                            </span>
                            <span>{room.tables.join(", ")}</span>
                          </div>
                        ))}

                        {/* If no tables */}
                        {Object.keys(tablesByRoom).length === 0 && (
                          <span>—</span>
                        )}
                      </div>

                      {/* Hover buttons */}
                      <div className="flex gap-1 justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedGroup(g);
                            setShowEdit(true);
                          }}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 text-red-500 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteGroup(g.id);
                          }}
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      </div>
                    </Link>
                  );
                })}
            {groups && groups.filter((g) => !g.closed_at).length === 0 && (
              <div className="text-sm text-zinc-600 font-medium text-center">
                No active groups.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedGroup && (
        <Dialog open={showEdit} onOpenChange={setShowEdit}>
          <DialogContent>
            <EditGroupForm
              group={selectedGroup}
              rooms={rooms}
              restaurantId={restaurantId}
              onClose={() => setShowEdit(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

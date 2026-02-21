"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Room, Group } from "@/lib/types/globalTypes/types";
import { Input } from "@/components/ui/input";
import FloatingSearchDropdown from "@/components/ui/multi-select-dropdown";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useUpdateGroup } from "@/hooks/auth/useGroups";

type FormValues = {
  name: string;
  people: number;
};

export default function EditGroupForm({
  group,
  rooms,
  restaurantId,
  onClose,
}: {
  group: Group;
  rooms: Room[];
  restaurantId: string;
  onClose?: () => void;
}) {
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);

  const updateGroup = useUpdateGroup(restaurantId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: group.name,
      people: group.people_count || 2,
    },
  });

  // Prefill rooms and tables once on mount
  useEffect(() => {
    const tableIds = group.tables?.map((t) => t.id) || [];
    queueMicrotask(() => setSelectedTables(tableIds));

    const prefilledRooms = rooms.filter((room) =>
      room.tables?.some((t) => tableIds.includes(t.id)),
    );
    queueMicrotask(() => setSelectedRooms(prefilledRooms));
  }, [group, rooms]);

  const onSubmit = (data: FormValues) => {
    const { name, people } = data;

    if (selectedTables.length === 0) {
      toast.error("Please select at least one table!");
      return;
    }

    updateGroup.mutate(
      {
        id: group.id,
        name,
        people_count: people,
        restaurant_id: restaurantId,
        table_ids: selectedTables,
      },
      {
        onSuccess: () => {
          onClose?.();
          reset();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 p-2 sm:p-3">
      {/* Group Name */}
      <div>
        <label className="text-md font-medium">Group Name</label>
        <Input
          className="mt-1 border border-[#CECECE] rounded-lg text-xs"
          placeholder="e.g., Sharma Family"
          {...register("name", {
            required: "Group name is required",
            maxLength: {
              value: 15,
              message: "Group name can’t exceed 15 characters",
            },
          })}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <hr className="my-4 border-t border-[#F49B33]" />

      {/* Room and People Selectors */}
      <div>
        <div className="flex items-center justify-between w-full gap-2">
          {/* Rooms Selector */}
          <FloatingSearchDropdown
            items={rooms}
            placeholder="Rooms"
            getLabel={(r) => r.name}
            selectedItems={selectedRooms}
            onChange={(rooms) => {
              setSelectedRooms(rooms);
              // Remove tables not in selected rooms
              setSelectedTables((prev) =>
                prev.filter((t) =>
                  rooms.some((r) => r.tables?.some((x) => x.id === t)),
                ),
              );
            }}
          />

          {/* People Box */}
          <div className="inline-flex w-[60%] items-center border-2 border-[#DFDFDF] rounded-lg overflow-hidden bg-white">
            <span className="flex items-center text-sm font-bold text-[#5E5E5E] px-3 py-2">
              <Icon
                icon="material-symbols:group"
                className="w-4 h-4 text-[#F49B33] mr-1"
              />
              People
            </span>

            <Input
              type="number"
              min="1"
              className="w-15 text-xs px-2 py-2 bg-white border-none focus:outline-none shadow-none"
              {...register("people", {
                required: "People count is required",
                min: { value: 1, message: "At least 1 person required" },
              })}
            />
          </div>
        </div>
        {errors.people && (
          <p className="text-xs text-red-500 mt-1">{errors.people.message}</p>
        )}

        {/* Table Selector */}
        <div className="mt-2 space-y-4 min-h-[100px]">
          {selectedRooms.map((room) => (
            <div key={room.id}>
              <div className="text-sm font-medium mb-1">{room.name} Tables</div>
              <div className="flex flex-wrap gap-2">
                {room.tables?.map((t) => {
                  const isSelected = selectedTables.includes(t.id);
                  const isOccupied =
                    t.status !== "free" &&
                    !selectedTables.includes(t.id) &&
                    Boolean(t.currentGroupId);

                  return (
                    <button
                      key={t.id}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => {
                        setSelectedTables((prev) =>
                          isSelected
                            ? prev.filter((x) => x !== t.id)
                            : [...prev, t.id],
                        );
                      }}
                      className={`w-12 h-12 p-2 flex items-center justify-center text-xs font-medium border rounded-lg shadow-lg transition-colors duration-200
                      ${
                        isOccupied
                          ? "bg-white text-[#FB8A22] border border-[#FB8A22] cursor-not-allowed"
                          : isSelected
                            ? "bg-blue-700 text-white border border-blue-700"
                            : "bg-white text-zinc-800 border border-[#C4C4C4] hover:bg-gray-100"
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="pt-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#FB8A22] to-[#EA454C] text-white rounded-lg shadow
          transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-110 hover:shadow-lg"
        >
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
}

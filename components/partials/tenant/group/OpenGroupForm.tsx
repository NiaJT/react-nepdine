"use client";

import { Room } from "@/lib/types/globalTypes/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import FloatingSearchDropdown from "@/components/ui/multi-select-dropdown";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";
import { useAddGroup } from "@/hooks/auth/useGroups";
import toast from "react-hot-toast";

type FormValues = {
  name: string;
  people: number;
};

export default function OpenGroupForm({
  onOpen,
  rooms,
  restaurantId,
}: {
  rooms: Room[];
  restaurantId: string;
  onOpen: (name: string, people: number, tableIds: string[]) => void;
}) {
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const createGroup = useAddGroup(restaurantId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      people: 2,
    },
  });

  const onSubmit = (data: FormValues) => {
    const { name, people } = data;

    if (selectedTables.length === 0) {
      toast.error("Please select at least one table!");
      return;
    }

    onOpen(name, people, selectedTables);

    createGroup.mutate(
      {
        name,
        people_count: people,
        restaurant_id: restaurantId,
        table_ids: selectedTables,
      },
      {
        onSuccess: () => {
          setSelectedRooms([]);
          setSelectedTables([]);
          reset();
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-5 w-full max-w-2xl sm:mx-0 mx-auto px-3"
    >
      {/* Group Name */}
      <div>
        <label className="text-md font-medium">Group Name</label>
        <Input
          className="mt-1 border border-[#CECECE] rounded-lg text-xs w-full"
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

      <hr className="my-2 border-t border-[#F49B33]" />

      <div className="flex flex-wrap gap-4 w-full items-stretch">
        {/* Rooms Selector */}
        <div className="flex-1 min-w-[220px]">
          <FloatingSearchDropdown
            items={rooms}
            placeholder="Rooms"
            getLabel={(r) => r.name}
            selectedItems={selectedRooms}
            onChange={(rooms) => {
              setSelectedRooms(rooms);
              setSelectedTables((prev) =>
                prev.filter((t) =>
                  rooms.some((r) => r.tables?.find((x) => x.id === t))
                )
              );
            }}
          />
        </div>

        {/* People Box */}
        <div className="flex-shrink-0 min-w-[150px] w-full sm:w-auto border rounded-lg flex items-center">
          <div className="flex justify-between items-center px-3 py-2 h-full w-full">
            <div className="flex items-center gap-1">
              <Icon
                icon="material-symbols:group"
                className="w-4 h-4 text-[#F49B33]"
              />
              <span className="text-sm font-semibold text-[#5E5E5E]">
                People
              </span>
            </div>
            <Input
              type="number"
              min="1"
              className="w-14 text-xs px-2 py-1 bg-white border-none focus:outline-none shadow-none text-center h-full"
              {...register("people", {
                required: "People count is required",
                min: { value: 1, message: "At least 1 person required" },
              })}
            />
          </div>
        </div>
      </div>

      {errors.people && (
        <p className="text-xs text-red-500 mt-1">{errors.people.message}</p>
      )}

      {/* Table Selector */}
      <div className="mt-2 space-y-4 min-h-[20vh] max-h-[45vh] w-full overflow-auto">
        {selectedRooms.map((room) => (
          <div key={room.id}>
            <div className="text-sm font-medium mb-1">{room.name} Tables</div>

            <div className="flex flex-wrap gap-2">
              {room.tables?.map((t) => {
                const isSelected = selectedTables.includes(t.id);
                const isOccupied =
                  t.status !== "free" || Boolean(t.currentGroupId);

                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={isOccupied}
                    onClick={() => {
                      setSelectedTables((prev) =>
                        isSelected
                          ? prev.filter((x) => x !== t.id)
                          : [...prev, t.id]
                      );
                    }}
                    className={`w-12 h-12 p-2 flex items-center justify-center text-xs font-medium border rounded-lg shadow-sm transition-colors
                    ${
                      isOccupied
                        ? "bg-white text-[#FB8A22] border border-[#FB8A22] cursor-not-allowed"
                        : isSelected
                          ? "bg-[#FB8A22] text-white border border-blue-700"
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

      {/* Submit */}
      <div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#FB8A22] to-[#EA454C] text-white rounded-lg shadow
        transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-110 hover:shadow-lg"
        >
          {isSubmitting ? "Adding..." : "Add"}
        </Button>
      </div>
    </form>
  );
}

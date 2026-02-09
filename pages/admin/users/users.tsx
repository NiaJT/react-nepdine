"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react/dist/iconify.js";

import UserForm from "@/components/partials/admin/UserForm";
import UserTable from "@/components/partials/admin/UserTable";
import { useGetRestaurantUsers } from "@/hooks/superAdmin/useUsers";
import UsersPageSkeleton from "@/components/LoadingPages/UsersLoad";

const roles = ["Waiter", "Manager", "Cook", "Admin"];

export default function UsersPage() {
  const restaurantId =
    typeof window !== "undefined"
      ? localStorage.getItem("restaurant_id")
      : null;
  const [selectedRole, setSelectedRole] = useState("Waiter");
  const [openDialog, setOpenDialog] = useState(false);

  // ✅ API Hooks
  const {
    data: users = [],
    isLoading,
    isError,
  } = useGetRestaurantUsers(restaurantId || "");

  const filteredUsers = users.filter(
    (u) => u.role.toLowerCase() === selectedRole.toLowerCase()
  );

  if (!restaurantId) {
    return (
      <div className="p-6 text-center text-gray-600">
        No restaurant selected. Please select a restaurant first.
      </div>
    );
  }
  if (isLoading) {
    return <UsersPageSkeleton />;
  }
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold  leading-[100%] tracking-[3%] sm:text-center uppercase mb-3">
            Admin
            <span className="text-[#FB8A22] text-2xl sm:text-3xl font-bold">
              {" "}
              Panel
            </span>
          </h1>
          <p className="font-semibold text-[18px] leading-[100%] tracking-[3%] ">
            {selectedRole}
          </p>
        </div>

        <div className="flex items-center">
          {/* Add User Dialog */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#FB8A22] to-[#EA454CE5] text-white w-[111px] rounded-l-md rounded-r-none">
                + Add
              </Button>
            </DialogTrigger>

            <DialogContent
              className="
                !w-[90vw] md:!w-[896px]
                !max-w-[90vw] m[930px]:!max-w-[896px]
                h-auto md:h-[457px]
                p-6 flex flex-col justify-between
              "
            >
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Add {selectedRole}
                </DialogTitle>
              </DialogHeader>

              <UserForm role={selectedRole} restaurantId={restaurantId} />
            </DialogContent>
          </Dialog>

          {/* Role Selector */}
          <div className="bg-white">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[150px] rounded-r-md rounded-l-none">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    <Icon
                      icon="icon-park-solid:avatar"
                      className="text-[#FB8A22] mr-2"
                    />
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        {isError ? (
          <div className="text-center py-6 text-red-500">
            Failed to load users.
          </div>
        ) : (
          <UserTable
            data={filteredUsers}
            restaurantId={restaurantId}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}

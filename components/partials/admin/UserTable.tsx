"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ProvidedUser,
  useDeleteUserFromRestaurant,
} from "@/hooks/superAdmin/useUsers";
import { Icon } from "@iconify/react/dist/iconify.js";
import EditUserDialog, {
  EditUserPayload,
} from "@/components/partials/admin/EditUserDialog";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialogue";

interface UserTableProps {
  restaurantId: string;
  data: ProvidedUser[];
  isLoading: boolean;
}

export default function UserTable({
  restaurantId,
  data,
  isLoading,
}: UserTableProps) {
  const deleteMutation = useDeleteUserFromRestaurant(restaurantId);

  const [editingUser, setEditingUser] = useState<EditUserPayload | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [openDelete, setOpenDelete] = useState(false); // dialog state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="text-center p-6 text-gray-500">Loading users...</div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-50 text-green-600 border border-green-200";
      case "inactive":
        return "bg-red-50 text-red-600 border border-red-200";
      case "in break":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const handleEditClick = (user: ProvidedUser) => {
    const payload: EditUserPayload = {
      id: user.user_id,
      full_name: user.user.full_name,
      email: user.user.email,
      contact: user.contact || "",
      password: "",
      is_active: user.user.is_active ? "active" : "inactive",
      role: user.role || "",
    };

    setEditingUser(payload);
    setOpenEdit(true);
  };

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setOpenDelete(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      deleteMutation.mutate(selectedUserId);
    }
    setOpenDelete(false);
    setSelectedUserId(null);
  };

  return (
    <div className="w-full px-4">
      <div className="overflow-x-auto">
        <Table className="min-w-full border-separate border-spacing-y-4">
          <TableHeader className="shadow-md">
            <TableRow>
              <TableHead className="text-[#9B9B9B] py-3 px-4">ID</TableHead>
              <TableHead className="text-[#9B9B9B] py-3 px-4">Name</TableHead>
              <TableHead className="text-[#9B9B9B] py-3 px-4">Status</TableHead>
              <TableHead className="text-[#9B9B9B] py-3 px-4">
                Mobile No
              </TableHead>
              <TableHead className="text-[#9B9B9B] py-3 px-4">Email</TableHead>
              <TableHead className="text-[#9B9B9B] py-3 px-4 text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data && data.length > 0 ? (
              data.map((user, index) => (
                <TableRow
                  key={user.id}
                  className="bg-white hover:bg-gray-50 shadow-md border border-gray-100 rounded-lg"
                >
                  <TableCell className="py-3 px-4 font-medium text-black">
                    {String(index + 1).padStart(2, "0")}
                  </TableCell>

                  <TableCell className="py-3 px-4 text-black capitalize">
                    {user.user.full_name}
                  </TableCell>

                  <TableCell className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-md ${getStatusBadge(
                        user.user.is_active ? "active" : "inactive"
                      )}`}
                    >
                      {user.user.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

                  <TableCell className="py-3 px-4 text-black">
                    {user.contact || "N/A"}
                  </TableCell>

                  <TableCell className="py-3 px-4 text-black">
                    {user.user.email}
                  </TableCell>

                  <TableCell className="py-3 px-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50 rounded-sm"
                        onClick={() => handleEditClick(user)}
                      >
                        <Icon icon="ri:edit-2-line" width={18} height={18} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 rounded-full"
                        disabled={deleteMutation.isPending}
                        onClick={() => handleDeleteClick(user.user_id)}
                      >
                        <Icon
                          icon="icon-park-outline:delete"
                          width={18}
                          height={18}
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 py-6"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      {editingUser && (
        <EditUserDialog
          open={openEdit}
          setOpen={setOpenEdit}
          restaurantId={restaurantId}
          user={editingUser}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        entityName="user"
      />
    </div>
  );
}

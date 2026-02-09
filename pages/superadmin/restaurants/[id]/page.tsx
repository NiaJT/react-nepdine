"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialogue";
import { RestaurantUsersTable } from "@/components/partials/superadmin/users/UserTable";
import {
  UserForm,
  RestaurantUserFormValues,
} from "@/components/partials/superadmin/users/UserForm";
import {
  useGetRestaurant,
  // useUpdateRestaurantUser,
} from "@/hooks/superAdmin/useRestaurant";
import {
  useGetRestaurantUsers,
  useAddUserToRestaurant,
  useDeleteUserFromRestaurant,
} from "@/hooks/superAdmin/useUsers";
import { ProvidedUser } from "@/hooks/superAdmin/useUsers";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const restaurantId = id as string;

  const {
    data: restaurant,
    isLoading,
    isError,
  } = useGetRestaurant(restaurantId);
  const { data: users = [] } = useGetRestaurantUsers(restaurantId);

  const addUser = useAddUserToRestaurant(restaurantId);
  // const updateUser = useUpdateRestaurantUser(restaurantId);
  const deleteUserApi = useDeleteUserFromRestaurant(restaurantId);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] =
    useState<RestaurantUserFormValues | null>(null);
  const [deleteUser, setDeleteUser] = useState<ProvidedUser | null>(null);

  if (isLoading) return <div className="p-6">Loading restaurant...</div>;
  if (isError || !restaurant)
    return <div className="p-6">Restaurant not found</div>;

  const handleCreate = (values: RestaurantUserFormValues) => {
    const payload = {
      ...values,
      password: values.password ?? "",
    };
    addUser.mutate(payload, {
      onSuccess: () => setShowForm(false),
    });
  };

  // const handleUpdate = (values: RestaurantUserFormValues) => {
  //   if (!editingUser) return;
  //   updateUser.mutate(
  //     { userId: editingUser.user_id, values },
  //     {
  //       onSuccess: () => {
  //         setEditingUser(null);
  //         setShowForm(false);
  //       },
  //     }
  //   );
  // };

  const handleDelete = (user: ProvidedUser) => {
    deleteUserApi.mutate(user.user_id, {
      onSuccess: () => setDeleteUser(null),
    });
  };

  return (
    <div className="p-6 space-y-6 rounded-2xl border shadow-sm bg-white">
      <h1 className="text-2xl font-bold">{restaurant.name}</h1>
      <p>
        <span className="font-medium">Location:</span> {restaurant.location}
      </p>
      <p>
        <span className="font-medium">Status:</span>{" "}
        {restaurant.active ? "Active" : "Inactive"}
      </p>
      <p>
        <span className="font-medium">Created At:</span>{" "}
        {new Date(restaurant.created_at).toLocaleString()}
      </p>

      <Button
        onClick={() => {
          setEditingUser(null);
          setShowForm(true);
        }}
      >
        Add User to Restaurant
      </Button>

      {/* Users Table */}
      <RestaurantUsersTable
        users={users}
        onEdit={(user) => {
          setEditingUser({
            user_id: user.id,
            email: user.user.email,
            full_name: user.user.full_name,
            // contact: user.user.contact ?? "",
            role: user.role,
            is_active: user.user.is_active,
            password: "", // keep empty for editing
          });
          setShowForm(true);
        }}
        onDelete={(user) => setDeleteUser(user)}
      />

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={() => setShowForm(false)}>
        <DialogContent className="max-w-lg">
          <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
          <UserForm
            user={editingUser ?? undefined}
            onSubmit={handleCreate}
            isSubmitting={addUser.isPending}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      {deleteUser && (
        <DeleteConfirmDialog
          open={!!deleteUser}
          entityName={deleteUser.user_id}
          onClose={() => setDeleteUser(null)}
          onConfirm={() => handleDelete(deleteUser)}
        />
      )}
    </div>
  );
}

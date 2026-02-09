"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialogue";

import {
  RestaurantForm,
  RestaurantFormValues,
} from "@/components/partials/superadmin/restaurants/RestaurantForm";
import {
  Restaurant,
  useGetRestaurants,
  useAddRestaurant,
  useUpdateRestaurant,
  useDeleteRestaurant,
} from "@/hooks/superAdmin/useRestaurant";
import { RestaurantsTable } from "@/components/partials/superadmin/restaurants/RestaurantTable";

export default function RestaurantsPage() {
  const { data: restaurants = [] } = useGetRestaurants();
  const [tenantId, setTenantId] = useState("");
  const addRestaurant = useAddRestaurant(tenantId);
  const updateRestaurant = useUpdateRestaurant();
  const deleteRestaurantApi = useDeleteRestaurant();

  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(
    null
  );
  const [deleteRestaurant, setDeleteRestaurant] = useState<Restaurant | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);

  const handleCreate = (values: RestaurantFormValues) => {
    setTenantId(values.tenant_id);

    addRestaurant.mutate({
      ...values,
      created_at: values.created_at.toISOString(),
    });
    setShowForm(false);
  };

  const handleUpdate = (values: RestaurantFormValues) => {
    if (!editingRestaurant) return;
    updateRestaurant.mutate({
      id: editingRestaurant.id,
      values: {
        ...values,
        created_at: values.created_at.toISOString(),
      },
    });
    setEditingRestaurant(null);
    setShowForm(false);
  };

  const handleDelete = (restaurant: Restaurant) => {
    deleteRestaurantApi.mutate(restaurant.id);
    setDeleteRestaurant(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Restaurant Management</h2>
        <Button onClick={() => setShowForm(true)}>Add Restaurant</Button>
      </div>
      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={() => setShowForm(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingRestaurant ? "Edit Restaurant" : "Add Restaurant"}
            </DialogTitle>
          </DialogHeader>

          <RestaurantForm
            restaurant={
              editingRestaurant
                ? {
                    ...editingRestaurant,
                    created_at: new Date(editingRestaurant.created_at),
                  }
                : undefined
            }
            onSubmit={editingRestaurant ? handleUpdate : handleCreate}
            isSubmitting={addRestaurant.isPending || updateRestaurant.isPending}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restaurants Table */}
      <RestaurantsTable
        restaurants={restaurants}
        onEdit={(restaurant) => {
          setEditingRestaurant(restaurant);
          setShowForm(true);
        }}
        onDelete={(restaurant) => setDeleteRestaurant(restaurant)}
      />

      {/* Delete Confirmation */}
      {deleteRestaurant && (
        <DeleteConfirmDialog
          open={!!deleteRestaurant}
          entityName={deleteRestaurant.name}
          onClose={() => setDeleteRestaurant(null)}
          onConfirm={() => handleDelete(deleteRestaurant)}
        />
      )}
    </div>
  );
}

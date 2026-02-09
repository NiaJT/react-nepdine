"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useGetTenant } from "@/hooks/superAdmin/useTenants";
import {
  useGetTenantRestaurants,
  Restaurant,
} from "@/hooks/superAdmin/useTenants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useAddRestaurant,
  useDeleteRestaurant,
  useUpdateRestaurant,
} from "@/hooks/superAdmin/useRestaurant";
import {
  RestaurantForm,
  RestaurantFormValues,
} from "@/components/partials/superadmin/restaurants/RestaurantForm";
import { DialogTitle } from "@radix-ui/react-dialog";
import { RestaurantsTable } from "@/components/partials/superadmin/restaurants/RestaurantTable";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialogue";

export default function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const tenantId = id as string;

  const { data: tenant } = useGetTenant(tenantId);
  const { data: restaurants = [] } = useGetTenantRestaurants(tenantId);

  const [showForm, setShowForm] = useState(false);
  const addRestaurant = useAddRestaurant(tenantId);
  const updateRestaurant = useUpdateRestaurant();
  const deleteRestaurantApi = useDeleteRestaurant();

  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(
    null
  );
  const [deleteRestaurant, setDeleteRestaurant] = useState<Restaurant | null>(
    null
  );

  const handleCreate = (values: RestaurantFormValues) => {
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

  if (!tenant) {
    return <div className="p-6">Loading tenant details...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Tenant Details */}
      <div className="rounded-2xl border p-6 shadow-sm bg-white space-y-3">
        <h1 className="text-2xl font-bold">{tenant.name}</h1>
        <p>
          <span className="font-medium">Status:</span> {tenant.status}
        </p>
        <p>
          <span className="font-medium">Owner:</span> {tenant.owner_name}
        </p>
        <p>
          <span className="font-medium">Email:</span> {tenant.owner_email}
        </p>
        <p>
          <span className="font-medium">Contact:</span> {tenant.owner_contact}
        </p>
        <p>
          <span className="font-medium">Created:</span>{" "}
          {new Date(tenant.created_at).toLocaleString()}
        </p>
      </div>

      <div className="p-6 space-y-6">
        <Button onClick={() => setShowForm(true)}>Add Restaurant</Button>

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
                      tenant_id: tenantId,
                      created_at: new Date(editingRestaurant.created_at),
                    }
                  : undefined
              }
              onSubmit={editingRestaurant ? handleUpdate : handleCreate}
              isSubmitting={
                addRestaurant.isPending || updateRestaurant.isPending
              }
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
          restaurants={restaurants.map((r) => ({
            ...r,
            tenant_id: tenantId,
          }))}
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
    </div>
  );
}

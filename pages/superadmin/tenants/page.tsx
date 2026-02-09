"use client";
import { useState } from "react";
import {
  TenantForm,
  TenantFormValues,
} from "@/components/partials/superadmin/tenants/TenantForm";
import { TenantsTable } from "@/components/partials/superadmin/tenants/TenantsTable";
import {
  Tenant,
  useGetTenants,
  useUpdateTenant,
  useDeleteTenant,
  useOnboardTenant,
} from "@/hooks/superAdmin/useTenants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialogue";
import { OnboardTenantForm } from "@/components/partials/superadmin/tenants/OnboardTenantForm";

export default function TenantsPage() {
  const { data: tenants = [] } = useGetTenants();

  const updateTenant = useUpdateTenant();
  const deleteTenantApi = useDeleteTenant();
  const onboardTenant = useOnboardTenant();

  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [deleteTenant, setDeleteTenant] = useState<Tenant | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showOnboardForm, setShowOnboardForm] = useState(false);
  const handleUpdate = (values: TenantFormValues) => {
    if (!editingTenant) return;
    updateTenant.mutate({
      id: editingTenant.id,
      values: { ...values, created_at: values.created_at?.toISOString() },
    });
    setEditingTenant(null);
    setShowForm(false);
  };

  const handleDelete = (tenant: Tenant) => {
    deleteTenantApi.mutate(tenant.id);
    setDeleteTenant(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex w-full justify-between">
        <h1 className="text-2xl font-bold">Tenants</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="default"
            onClick={() => setShowOnboardForm(true)}
            className="cursor-pointer "
          >
            + Onboard Tenant
          </Button>
        </div>
      </div>
      {/* Tenant Form Modal */}
      <Dialog open={showForm} onOpenChange={() => setShowForm(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTenant ? "Edit Tenant" : "Add Tenant"}
            </DialogTitle>
          </DialogHeader>

          <TenantForm
            tenant={
              editingTenant
                ? {
                    ...editingTenant,
                    created_at: editingTenant.created_at
                      ? new Date(editingTenant.created_at)
                      : new Date(),
                  }
                : undefined
            }
            onSubmit={handleUpdate}
            isSubmitting={updateTenant.isPending}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Onboard Tenant Modal */}
      <Dialog open={showOnboardForm} onOpenChange={setShowOnboardForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Onboard New Tenant</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[65vh] p-2">
            <OnboardTenantForm
              onSubmit={(payload) =>
                onboardTenant.mutate(payload, {
                  onSuccess: () => setShowOnboardForm(false),
                })
              }
              isSubmitting={onboardTenant.isPending}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Tenants Table */}
      <TenantsTable
        tenants={tenants}
        onEdit={(tenant) => {
          setEditingTenant(tenant);
          setShowForm(true);
        }}
        onDelete={(tenant) => setDeleteTenant(tenant)}
      />

      {/* Delete Confirmation */}
      {deleteTenant && (
        <DeleteConfirmDialog
          open={!!deleteTenant}
          entityName={deleteTenant.name}
          onClose={() => setDeleteTenant(null)}
          onConfirm={() => handleDelete(deleteTenant)}
        />
      )}
    </div>
  );
}

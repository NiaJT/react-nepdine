"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialogue";

import {
  useGetSuperAdminUsers,
  useDeleteSuperAdmin,
} from "@/hooks/superAdmin/useSuperadmin";
import { SuperAdminForm } from "@/components/partials/superadmin/superadmin-users/SuperAdminForm";
import type { SuperAdminFormValues } from "@/components/partials/superadmin/superadmin-users/SuperAdminForm";
import { SuperAdminTable } from "@/components/partials/superadmin/superadmin-users/SuperadminTable";

export default function SuperAdminPage() {
  const { data: superAdmins = [], refetch } = useGetSuperAdminUsers();
  const deleteSuperAdmin = useDeleteSuperAdmin();

  const [showForm, setShowForm] = useState(false);
  const [editingSuperAdmin, setEditingSuperAdmin] =
    useState<SuperAdminFormValues | null>(null);

  // store both id and name for delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    full_name: string;
  } | null>(null);

  const handleDelete = (admin_id: string) => {
    deleteSuperAdmin.mutate(admin_id, {
      onSuccess: () => {
        refetch();
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Super Admin Management</h2>
        <Button onClick={() => setShowForm(true)}>Add Super Admin</Button>
      </div>

      {/* ✅ SuperAdmin Table */}
      <SuperAdminTable
        superAdmins={superAdmins}
        onEdit={(admin) => {
          setEditingSuperAdmin({
            email: admin.email,
            full_name: admin.full_name,
            password: "", // leave blank for security
          });
          setShowForm(true);
        }}
        onDelete={(id, full_name) => setDeleteTarget({ id, full_name })}
      />

      {/* ✅ Add/Edit Form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSuperAdmin ? "Edit Super Admin" : "Add Super Admin"}
            </DialogTitle>
          </DialogHeader>

          <SuperAdminForm
            defaultValues={editingSuperAdmin || undefined}
            userId={editingSuperAdmin ? editingSuperAdmin.id : undefined}
            onClose={() => {
              setShowForm(false);
              setEditingSuperAdmin(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* ✅ Delete Confirmation Dialog */}
      {deleteTarget && (
        <DeleteConfirmDialog
          open={!!deleteTarget}
          entityName={deleteTarget.full_name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget.id)}
        />
      )}
    </div>
  );
}

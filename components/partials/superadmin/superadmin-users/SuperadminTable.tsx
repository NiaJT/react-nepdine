"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface SuperAdmin {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: string;
  is_superadmin: boolean;
  must_change_password: boolean;
  password?: string;
  created_at: string;
}

interface SuperAdminTableProps {
  superAdmins: SuperAdmin[];
  onEdit: (admin: SuperAdmin) => void;
  onDelete: (id: string, full_name: string) => void;
}

export function SuperAdminTable({
  superAdmins,
  onEdit,
  onDelete,
}: SuperAdminTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {superAdmins.length > 0 ? (
            superAdmins.map((admin) => (
              <TableRow key={admin.id} className="hover:bg-muted/50">
                <TableCell>{admin.full_name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(admin)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(admin.id, admin.full_name)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground italic py-4"
              >
                No super admins found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

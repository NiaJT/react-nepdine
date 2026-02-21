"use client";

import type { Tenant } from "@/hooks/superAdmin/useTenants";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/lib/useRouter";

interface TenantsTableProps {
  tenants: Tenant[];
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
}

export function TenantsTable({ tenants, onEdit, onDelete }: TenantsTableProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Owner Name</TableHead>
          <TableHead>Owner Email</TableHead>
          <TableHead>Owner Contact</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map((tenant) => (
          <TableRow
            key={tenant.id}
            className="hover:bg-gray-100 cursor-pointer"
            onClick={() => router.push(`/superadmin/tenants/${tenant.id}`)} // 👈 Navigate to detail page
          >
            <TableCell>{tenant.name}</TableCell>
            <TableCell>{tenant.status}</TableCell>
            <TableCell>{tenant.owner_name}</TableCell>
            <TableCell>{tenant.owner_email}</TableCell>
            <TableCell>{tenant.owner_contact}</TableCell>
            <TableCell>
              {new Date(tenant.created_at).toLocaleString()}
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onEdit(tenant)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(tenant)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

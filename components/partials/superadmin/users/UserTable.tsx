"use client";

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
import { ProvidedUser } from "@/hooks/superAdmin/useUsers";

interface RestaurantUsersTableProps {
  users: ProvidedUser[];
  onEdit: (user: ProvidedUser) => void;
  onDelete: (user: ProvidedUser) => void;
}

export function RestaurantUsersTable({
  users,
  onEdit,
  onDelete,
}: RestaurantUsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="hover:bg-gray-100 cursor-pointer">
            <TableCell>{user.user.email || "-"}</TableCell>
            <TableCell>{user.user.full_name || "-"}</TableCell>
            <TableCell>{user.user.is_active || "-"}</TableCell>
            <TableCell>{user.role || "-"}</TableCell>
            <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      onEdit(user);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => onDelete(user)}>
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

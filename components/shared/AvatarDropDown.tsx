"use client";

import { useLogout } from "@/hooks/logout";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "./../../lib/useRouter";

export default function AvatarDropDown({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  const { mutate: logout, isPending } = useLogout();
  const router = useRouter();

  return (
    <div className="px-1 md:px-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* Flex container for avatar + text */}
          <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="User Avatar"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <span className="font-medium text-sm">Settings</span>
            )}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 rounded-2xl shadow-lg m-5">
          <DropdownMenuLabel className="font-semibold">
            My Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => logout()}
            disabled={isPending}
          >
            <Icon icon="mdi:logout" className="text-lg" />
            <span>{isPending ? "Logging out..." : "Logout"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.replace("/change-password")}
          >
            <Icon icon="tabler:lock-cog" className="text-lg" />
            <span>Change Password</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

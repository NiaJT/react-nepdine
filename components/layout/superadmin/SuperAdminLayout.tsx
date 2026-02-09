"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Menu,
  Users,
  Building2,
  Utensils,
  X,
  Settings,
  CreditCard,
  MessageCircle,
  HelpCircle,
  ClipboardCheck,
} from "lucide-react";
import LogOut from "@/components/shared/AvatarDropDown";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Restaurants", href: "/superadmin/restaurants", icon: Utensils },
  { name: "Tenants", href: "/superadmin/tenants", icon: Building2 },
  { name: "Superadmins", href: "/superadmin/add-superAdmin", icon: Users },
  { name: "Features", href: "/superadmin/features", icon: Settings },
  {
    name: "Subscriptions",
    href: "/superadmin/subscriptions",
    icon: CreditCard,
  },
  { name: "Feedbacks", href: "/superadmin/feedbacks", icon: MessageCircle },
  { name: "FAQs", href: "/superadmin/faqs", icon: HelpCircle },
  {
    name: "Applications",
    href: "/superadmin/applications",
    icon: ClipboardCheck,
  },
];

interface SuperadminLayoutProps {
  children: React.ReactNode;
}

export function SuperAdminLayout({ children }: SuperadminLayoutProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Mobile toggle button */}
      <button
        className="p-2 md:hidden fixed top-3 left-3 z-50 rounded bg-gray-100"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transform transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h1 className="text-lg font-bold">Superadmin</h1>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="mt-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href; // check if current route
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded",
                  isActive && "bg-gray-200 text-blue-700 font-semibold scale-3d"
                )}
                onClick={() => setOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 w-full px-4">
          <LogOut />
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 md:ml-64 p-4">{children}</main>
    </div>
  );
}

import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import Background from "@/components/layout/tenant/Background";
import { React } from "next/dist/server/route-modules/app-page/vendored/rsc/entrypoints";

export const metadata: Metadata = {
  title: "Restaurant Manager",
  description: "Manage tables, menu, groups, orders, and balance sheet",
};

export default function RestaurantRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAuth blockSuperAdmin>
      <SidebarProvider>
        <Background >{children}</Background>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

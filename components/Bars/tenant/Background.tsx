"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "@/lib/link";
import Image from "@/components/ui/image";

import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import AvatarDropDown from "../../shared/AvatarDropDown";
import { useUser } from "@/guards/useUser";

const allLinks = [
  { href: "/", label: "Dashboard", icon: "mdi:home-variant" },
  { href: "/users", label: "Users", icon: "mdi:user" },
  {
    href: "/tables",
    label: "Tables",
    icon: "material-symbols-light:table-bar-outline-sharp",
  },
  { href: "/groups", label: "Groups", icon: "mdi:account-group-outline" },
  {
    href: "/menu",
    label: "Menu",
    icon: "material-symbols-light:menu-book-2-outline",
  },
  {
    href: "/balance",
    label: "Balance",
    icon: "mdi:account-balance-wallet-outline",
  },
  { href: "/waiters", label: "Waiters", icon: "hugeicons:waiter" },
];

export default function Background({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const noSideBarRoutes = [
    "/change-password",
    "/restaurants",
    "/demo",
    "/restaurants/create",
  ];

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
    const update = () => setIsMobile(window.innerWidth < 1200);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filteredLinks = useMemo(() => {
    if (!user) return [];
    const role = user.role?.toLowerCase();

    switch (role) {
      case "waiter":
        return [
          {
            href: "/tables",
            label: "Tables",
            icon: "material-symbols-light:table-bar-outline-sharp",
          },
          {
            href: "/groups",
            label: "Groups",
            icon: "mdi:account-group-outline",
          },
          {
            href: "/menu_waiters",
            label: "Menu",
            icon: "material-symbols-light:menu-book-2-outline",
          },
        ];

      case "manager":
        return allLinks.filter((link) =>
          ["/", "/tables", "/groups", "/menu", "/balance", "/waiters"].includes(
            link.href,
          ),
        );

      case "cook":
        return allLinks.filter((link) => ["/menu"].includes(link.href));

      case "admin":
        return allLinks; // admin can see all

      default:
        return [];
    }
  }, [user]);

  if (!mounted) return null;
  if (noSideBarRoutes.includes(pathname)) return <>{children}</>;

  const desktopCollapsedClass = "[@media(min-width:1050px)]:w-[80px]";
  const desktopExpandedClass = "[@media(min-width:1050px)]:w-[280px]";

  const drawerFullClass = "w-[280px]";

  const asideClass = [
    "fixed top-0 left-0 z-50 h-full bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out",
    collapsed ? desktopCollapsedClass : desktopExpandedClass,
    isMobile
      ? mobileOpen
        ? `${drawerFullClass} translate-x-0`
        : `${drawerFullClass} -translate-x-full`
      : "translate-x-0",
  ].join(" ");

  const mainMarginClass = isMobile
    ? "ml-0"
    : collapsed
      ? "md:ml-[80px]"
      : "md:ml-[280px]";

  const toggleDesktop = () => setCollapsed((p) => !p);
  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);

  // 🕐 Loading state while user is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading user...</p>
      </div>
    );
  }

  // 🚫 If user not logged in
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please log in to continue.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-h-screen bg-[#F9F4F1] relative">
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={closeMobile}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside className={`${asideClass} max-h-screen`} aria-label="Main sidebar">
        {/* Controls */}
        <div className="absolute top-2 right-2 z-50 flex gap-2 ">
          {isMobile && mobileOpen && (
            <button
              onClick={closeMobile}
              className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition"
            >
              <Icon icon="mdi:close" className="text-2xl" />
            </button>
          )}
          {!isMobile && (
            <button
              onClick={toggleDesktop}
              className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition"
            >
              <Icon icon="mdi:menu" className="text-2xl" />
            </button>
          )}
        </div>

        {/* Logo */}
        {(!collapsed || (isMobile && mobileOpen)) && (
          <div className="flex mt-10 p-2 m-2 transition-transform duration-300 ease-in-out hover:scale-105 shrink-0">
            <Image
              src="/nepdineFull.png"
              alt="Logo"
              width={180}
              height={50}
              priority
            />
          </div>
        )}

        {collapsed && !isMobile && (
          <div className="flex mt-10 p-2 justify-center transition-transform duration-300 ease-in-out hover:scale-105 shrink-0">
            <Image
              src="/nepdineLogo.png"
              alt="Logo Icon"
              width={40}
              height={40}
              priority
            />
          </div>
        )}

        {/* Links */}
        <nav
          className={`flex flex-col gap-3 px-1 md:px-2 flex-1 overflow-y-auto${
            isMobile ? "" : collapsed ? "justify-center" : "mt-4"
          }`}
        >
          {filteredLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href ||
                  pathname.startsWith(link.href + "/");
            return (
              <Link key={link.href} href={link.href} className="w-full px-5">
                <div
                  role="link"
                  onClick={() => {
                    if (isMobile) closeMobile();
                  }}
                  className={`group/navitem flex items-center h-12
                    ${collapsed ? "justify-center" : "gap-3"}
                    rounded-l-full rounded-r-full cursor-pointer transition-all duration-200 ${
                      isActive ? "bg-red-50 text-red-400 " : "text-black"
                    } hover:bg-red-50 hover:text-red-400 `}
                >
                  <span
                    className={`inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-full transition-transform duration-200 ${
                      isActive
                        ? "bg-red-500 text-white scale-110"
                        : "bg-gray-100 text-black"
                    } group-hover/navitem:bg-red-500 group-hover/navitem:text-white group-hover/navitem:scale-110`}
                  >
                    <Icon icon={link.icon} className="text-2xl" />
                  </span>
                  {(!collapsed || (isMobile && mobileOpen)) && (
                    <span
                      className={`ml-2 transition-colors ${
                        isActive ? " text-red-400" : "text-black"
                      } group-hover/navitem:font-semibold group-hover/navitem:text-red-400`}
                    >
                      {link.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 p-3">
          <AvatarDropDown collapsed={collapsed} />
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${mainMarginClass}`}
      >
        {/*mobile button */}
        <div className="px-6 py-4 text-sm text-gray-600 flex items-center gap-3">
          <div className="max-[1025px]:block hidden">
            <button
              onClick={mobileOpen ? closeMobile : openMobile}
              className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition"
            >
              <Icon
                icon={mobileOpen ? "mdi:close" : "mdi:menu"}
                className="text-2xl"
              />
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

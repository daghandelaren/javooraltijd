"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Ticket,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navItems = [
  {
    label: "Overzicht",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Bestellingen",
    href: "/admin/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    label: "Analytics",
    href: "/admin/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Kortingscodes",
    href: "/admin/dashboard/discounts",
    icon: Ticket,
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  function isActive(href: string) {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-stone-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">JVA</span>
            </div>
            <span className="text-stone-100 font-semibold text-sm">
              Admin Panel
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-stone-400 hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                  active
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${active ? "text-amber-400" : "text-stone-500 group-hover:text-stone-300"}`}
                />
                {item.label}
                {active && (
                  <ChevronRight className="w-4 h-4 ml-auto text-amber-400/50" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-stone-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition-colors"
          >
            <LogOut className="w-5 h-5 text-stone-500" />
            Uitloggen
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center px-4 lg:px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-3 p-2 rounded-lg hover:bg-stone-100 text-stone-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-stone-800">
            {navItems.find((item) => isActive(item.href))?.label || "Dashboard"}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getNavItems } from "./role-nav-items";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar() {
  const pathname = usePathname();
  const { profile } = useCurrentUser();
  const navItems = getNavItems(profile?.role ?? "");

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <Image src="/logo.png" alt="Mboa Property Group" width={40} height={40} className="object-contain" />
        <span className="font-bold text-lg">Mboa Property</span>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      {profile && (
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {profile.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile.fullName}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {profile.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

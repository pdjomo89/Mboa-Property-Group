"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNavItems } from "./role-nav-items";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { profile } = useCurrentUser();
  const navItems = getNavItems(profile?.role ?? "");

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-background shadow-xl lg:hidden">
        <div className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Mboa Property Group" width={40} height={40} className="object-contain" />
            <span className="font-bold text-lg">Mboa Property</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
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
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground/70 hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </div>
    </>
  );
}

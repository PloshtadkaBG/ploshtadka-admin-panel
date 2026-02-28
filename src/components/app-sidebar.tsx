"use client";

import * as React from "react";
import { LayoutDashboard, Users, Building2, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { useMe } from "@/app/auth/api/hooks";
import { isAdmin } from "@/lib/scopes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    label: "Табла",
    items: [
      {
        title: "Табло",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Управление",
    items: [
      {
        title: "Потребители",
        url: "/users",
        icon: Users,
        adminOnly: true,
      },
      {
        title: "Обекти",
        url: "/venues",
        icon: Building2,
      },
      {
        title: "Резервации",
        url: "/bookings",
        icon: CalendarCheck,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: me } = useMe();
  const admin = me ? isAdmin(me.scopes) : false;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Logo size={24} className="text-current" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Ploshtadka.BG</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Административен панел
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => {
          const items = admin
            ? group.items
            : group.items.filter((item) => !item.adminOnly);
          return (
            <NavMain key={group.label} label={group.label} items={items} />
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

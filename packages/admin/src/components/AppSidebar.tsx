import { Flag, Users, PieChart } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useNavigate, useLocation } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { title: "Flags", icon: Flag, path: ROUTES.FLAGS },
  { title: "Segments", icon: PieChart, path: null },
  { title: "Users", icon: Users, path: ROUTES.USERS },
] as const;

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 h-16">
            <SidebarTrigger />
            {state === "expanded" && (
              <SidebarMenuItem>
                <span className="px-2 text-lg font-semibold tracking-tight">
                  LibreFlag.js
                </span>
              </SidebarMenuItem>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title} className="h-10">
                  <SidebarMenuButton
                    isActive={item.path === location.pathname}
                    onClick={() => item.path && navigate(item.path)}
                    disabled={item.path === null}
                    tooltip={item.title}
                    className="h-full group-data-[collapsible=icon]:h-full!"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

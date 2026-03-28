import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  CreditCard,
  Package,
  Users,
  Settings,
  Home,
  Phone,
  Clock
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { BrandIdentity } from "./BrandIdentity";

const menuItems = [
  { title: "Beranda", url: "/", icon: Home },
  { title: "Unit Masuk", url: "/units", icon: Phone },
  { title: "Arus Kas", url: "/cashflow", icon: CreditCard },
  { title: "Inventori", url: "/inventory", icon: Package },
  { title: "Teknisi", url: "/technicians", icon: Users },
  { title: "Laporan Aging", url: "/aging", icon: Clock },
  { title: "Analitik", url: "/analytics", icon: BarChart3 },
  { title: "Pengaturan", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary";

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <BrandIdentity compact={isCollapsed} />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
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
"use client";

import { useAuth } from "@/app/hooks/auth/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GraduationCap, LayoutDashboard, Users, UserCheck, Settings, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    url: "/students",
    icon: Users,
  },
  {
    title: "Attendance",
    url: "/attendance",
    icon: UserCheck,
  },
];

const secondaryNavItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { session, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-primary/10 bg-background/50 backdrop-blur-3xl shadow-lg">
      <SidebarHeader className="p-2">
        <SidebarMenu>
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenuButton size="lg" asChild className="hover:bg-primary/5 transition-all rounded-xl p-1 group group-data-[collapsible=icon]:!size-11 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center">
              <Link href="/">
                <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground shadow-md transition-transform group-hover:scale-105">
                  <GraduationCap className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none ml-2 group-data-[collapsible=icon]:hidden w-full">
                  <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Attendance</span>
                  <span className="text-xs font-semibold text-primary">System</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 pb-2 opacity-80 group-data-[collapsible=icon]:hidden">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5 group-data-[collapsible=icon]:items-center">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url} 
                    tooltip={item.title}
                    className="rounded-xl transition-all duration-200 hover:bg-primary/10 hover:text-primary active:scale-[0.98] data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:font-semibold h-11 px-3 group-data-[collapsible=icon]:!size-11 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center"
                  >
                    <Link href={item.url} className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!gap-0">
                      <item.icon className="size-5 shrink-0 transition-transform group-hover:scale-110" />
                      <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8 group-data-[collapsible=icon]:mt-4">
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 pb-2 opacity-80 group-data-[collapsible=icon]:hidden">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5 group-data-[collapsible=icon]:items-center">
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url} 
                    tooltip={item.title}
                    className="rounded-xl transition-all duration-200 hover:bg-primary/10 hover:text-primary active:scale-[0.98] data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:font-semibold h-11 px-3 group-data-[collapsible=icon]:!size-11 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center"
                  >
                    <Link href={item.url} className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!gap-0">
                      <item.icon className="size-5 shrink-0 transition-transform group-hover:scale-110" />
                      <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-primary/5 bg-background/30 backdrop-blur-md">
        <SidebarMenu>
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-primary/10 data-[state=open]:text-primary rounded-xl transition-all hover:bg-primary/5 h-auto p-2 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!size-11 group-data-[collapsible=icon]:justify-center"
                >
                  <Avatar className="h-10 w-10 shrink-0 rounded-xl border-2 border-primary/20 shadow-sm">
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 text-primary font-bold text-sm">
                      {session?.email ? session.email.substring(0, 2).toUpperCase() : "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-2 group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-bold text-foreground/90">{session?.email || "User Account"}</span>
                    <span className="truncate text-xs font-semibold text-primary/80">Administrator</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-xl shadow-xl border-primary/10" side="right" sideOffset={10}>
                <DropdownMenuLabel className="font-semibold text-xs text-muted-foreground uppercase tracking-wider opacity-80 px-3 py-2">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="text-destructive font-medium cursor-pointer focus:bg-destructive/10 focus:text-destructive rounded-lg m-1 p-2 gap-3"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Log out of session</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

import { useEffect, useState } from "react";
import {
  LayoutDashboard, History, Bookmark, Bell, LogOut, ChevronLeft,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

export function InvestorSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);
      setUnreadCount(count ?? 0);
    };
    fetchUnread();

    // Realtime subscription for live badge updates
    const channel = supabase
      .channel("investor-notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => fetchUnread()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const items = [
    { title: "Portfolio", url: "/investor", icon: LayoutDashboard, badge: 0 },
    { title: "Investments", url: "/investor/investments", icon: History, badge: 0 },
    { title: "Watchlist", url: "/investor/watchlist", icon: Bookmark, badge: 0 },
    { title: "Notifications", url: "/investor/notifications", icon: Bell, badge: unreadCount },
  ];

  return (
    <Sidebar collapsible="icon">
      <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-sm font-semibold text-sidebar-foreground truncate">
            Investor Panel
          </span>
        )}
        <SidebarTrigger className="text-sidebar-foreground hover:text-sidebar-primary">
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </SidebarTrigger>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/investor"}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <div className="relative shrink-0">
                        <item.icon className="w-4 h-4" />
                        {item.badge > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
                            {item.badge > 9 ? "9+" : item.badge}
                          </span>
                        )}
                      </div>
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-3 border-t border-sidebar-border">
          {!collapsed && user && (
            <p className="text-xs text-muted-foreground truncate mb-2">
              {user.email}
            </p>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

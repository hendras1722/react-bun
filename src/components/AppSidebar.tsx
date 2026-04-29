import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  ChevronRight,
  LogOut,
  Zap,
  Palette
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Badge } from "./ui/Badge";

interface AppSidebarProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  data: any;
  meta: any;
}

export function AppSidebar({ isOpen, setOpen, data, meta }: AppSidebarProps) {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", active: meta.activeMenu === 'dashboard' },
    { icon: Users, label: "Users", path: "/users", active: meta.activeMenu === 'users' },
    { icon: Palette, label: "Design System", path: "/design-system", active: meta.activeMenu === 'design-system' },
    { icon: Settings, label: "Settings", path: "/settings", active: meta.activeMenu === 'settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-background border-r flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Sidebar Header / Brand */}
        <div className="h-16 flex items-center px-6 border-b shrink-0">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Zap className="w-4.5 h-4.5 text-primary-foreground fill-current" />
            </div>
            <span className="font-bold text-lg tracking-tight">BunAdmin</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">
              Core Platform
            </p>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group
                  ${item.active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
                {item.active && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
              </Link>
            ))}
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">
              External
            </p>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all group">
              <Shield className="w-4 h-4" />
              <span>Documentation</span>
              <Badge variant="outline" className="ml-auto text-[9px] py-0 px-1.5 h-4">DOCS</Badge>
            </a>
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t bg-muted/30">
          <div className="bg-background border rounded-lg p-3 flex items-center gap-3 group cursor-pointer hover:border-primary/50 transition-colors">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold truncate">Alex Rivera</span>
              <span className="text-[10px] text-muted-foreground truncate font-medium">alex@example.com</span>
            </div>
            <LogOut className="w-3.5 h-3.5 text-muted-foreground group-hover:text-destructive transition-colors shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
}

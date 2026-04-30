import { useState, useRef, useEffect } from "react";
import { Menu, Bell, Search, ChevronDown, Command, LogOut, Moon, Sun, Monitor } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { useTheme } from "./ThemeProvider";

interface AppHeaderProps {
  onMenuClick: () => void;
  title: string;
}

export function AppHeader({ onMenuClick, title }: AppHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-background/80 backdrop-blur-xl border-b sticky top-0 z-30 flex items-center justify-between px-6 gap-4">
      {/* Left: Hamburger & Title */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden h-8 w-8"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <h1 className="text-sm font-semibold tracking-tight">
          {title || "Admin Panel"}
        </h1>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-3">
        {/* Modern Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-muted/50 border rounded-lg px-3 h-9 w-64 focus-within:ring-2 focus-within:ring-primary/20 transition-all group">
          <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search anything..."
            className="bg-transparent border-none outline-none flex-1 text-xs placeholder:text-muted-foreground"
          />
          <div className="flex items-center gap-0.5 bg-muted border rounded px-1.5 py-0.5">
            <Command className="w-2.5 h-2.5 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground">K</span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </Button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-2 pl-2 cursor-pointer group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Avatar className="h-8 w-8 border group-hover:border-primary transition-all">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-popover text-popover-foreground rounded-lg border shadow-md py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 border-b border-border/50">
                <p className="text-sm font-medium leading-none">Alex Rivera</p>
                <p className="text-xs text-muted-foreground mt-1">Administrator</p>
              </div>
              
              <div className="p-2 border-b border-border/50">
                <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Theme</p>
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md border border-border/50">
                  <Button
                    variant={theme === "light" ? "secondary" : "ghost"}
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-3 w-3 mr-1.5" /> Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "secondary" : "ghost"}
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-3 w-3 mr-1.5" /> Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "secondary" : "ghost"}
                    size="sm"
                    className="flex-1 h-7 text-xs px-0"
                    onClick={() => setTheme("system")}
                    title="System"
                  >
                    <Monitor className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="p-1">
                <button 
                  className="flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                  onClick={() => {
                    // Placeholder for logout action
                    setIsDropdownOpen(false);
                    console.log('Logging out...');
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

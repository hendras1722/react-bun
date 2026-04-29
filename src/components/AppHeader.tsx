import { Menu, Bell, Search, ChevronDown, Command } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { ModeToggle } from "./ModeToggle";

interface AppHeaderProps {
  onMenuClick: () => void;
  title: string;
}

export function AppHeader({ onMenuClick, title }: AppHeaderProps) {
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

        {/* Theme Toggle */}
        <ModeToggle />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 cursor-pointer group">
          <div className="flex flex-col items-end hidden sm:flex mr-1">
            <span className="text-xs font-semibold leading-tight">Alex Rivera</span>
            <span className="text-[10px] text-muted-foreground font-medium">Administrator</span>
          </div>
          <Avatar className="h-8 w-8 border group-hover:border-primary transition-all">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AR</AvatarFallback>
          </Avatar>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </header>
  );
}

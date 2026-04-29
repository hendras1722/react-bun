import { Outlet, useMatches } from "react-router-dom";
import { useState } from "react";
import { AppSidebar } from "../components/AppSidebar";
import { AppHeader } from "../components/AppHeader";

export default function AdminLayout({ data }: any) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const matches = useMatches();

  const currentMatch: any = matches.find((m: any) => m.handle);
  const meta = currentMatch?.handle || {};

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Sidebar Navigation */}
      <AppSidebar 
        isOpen={isSidebarOpen} 
        setOpen={setSidebarOpen} 
        data={data} 
        meta={meta} 
      />

      {/* Main Content Area */}
      <div className="lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <AppHeader 
          onMenuClick={() => setSidebarOpen(true)} 
          title={meta.title} 
        />
        
        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-6 border-t text-muted-foreground text-sm flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30">
          <p>© 2024 BunAdmin. Built with ❤️ using Bun & React.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

import { Link, Outlet } from "@tanstack/react-router";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-200">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

          {/* Brand */}
          <div className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Bun App
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm">
            <Link
              to="/"
              activeProps={{ className: "text-white after:w-full" }}
              className="relative text-slate-400 hover:text-white transition
              after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 
              after:-bottom-1 after:h-[2px] after:w-0 after:bg-gradient-to-r 
              after:from-green-400 after:to-emerald-500 after:transition-all"
            >
              Home
            </Link>

            <Link
              to="/about"
              activeProps={{ className: "text-white after:w-full" }}
              className="relative text-slate-400 hover:text-white transition
              after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 
              after:-bottom-1 after:h-[2px] after:w-0 after:bg-gradient-to-r 
              after:from-green-400 after:to-emerald-500 after:transition-all"
            >
              About
            </Link>

            <Link
              to="/contact"
              activeProps={{ className: "text-white after:w-full" }}
              className="relative text-slate-400 hover:text-white transition
              after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 
              after:-bottom-1 after:h-[2px] after:w-0 after:bg-gradient-to-r 
              after:from-green-400 after:to-emerald-500 after:transition-all"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 text-center text-sm text-slate-500 py-6">
        Built with ❤️ using Bun & React
      </footer>
    </div>
  );
}
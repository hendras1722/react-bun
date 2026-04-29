import { Link, Outlet, useMatch, useMatches } from "react-router-dom";

export default function Layout() {
  const meta = useMatches()
  console.log(meta)
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">Bun App</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </nav>
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Built with ❤️ using Bun & React</p>
      </footer>
    </div>
  );
}

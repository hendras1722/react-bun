import { Link, Outlet, useMatches } from "react-router-dom";

export default function AdminLayout() {
  const matches = useMatches();

  const currentMatch: any = matches.find((m: any) => m.handle);
  const meta = currentMatch?.handle || {};
  console.log(matches, 'inimeta')

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="sidebar" style={{ width: '250px', background: '#1a1a1a', padding: '2rem', borderRight: '1px solid #333' }}>
        <h2 style={{ color: '#fbf0df' }}>{meta.title || "Admin Panel"}</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <Link to="/" style={{ color: '#ccc', textDecoration: 'none' }}>Back to Site</Link>
          <Link
            to="/dashboard"
            style={{
              color: meta.activeMenu === 'dashboard' ? '#646cff' : '#fff',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Dashboard
          </Link>
          <Link to="/settings" style={{ color: '#ccc', textDecoration: 'none' }}>Settings</Link>
        </nav>

        {meta.permission && (
          <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#666' }}>
            Permissions: {meta.permission.join(', ')}
          </div>
        )}
      </aside>
      <main className="admin-content" style={{ flex: 1, padding: '2rem', background: '#242424' }}>
        <Outlet />
      </main>
    </div>
  );
}

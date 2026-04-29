export const layout = 'admin';

export const meta = {
  activeMenu: 'dashboard',
  permission: ['admin', 'user'],
  title: 'Dashboard Admin'
};

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <h1>Admin Dashboard</h1>
      <p>Selamat datang di panel administrasi.</p>
      <div className="card">
        <h3>Statistik Cepat</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: '#333', padding: '1rem', borderRadius: '8px', flex: 1 }}>
            <h4>User</h4>
            <p style={{ fontSize: '1.5rem' }}>1,234</p>
          </div>
          <div style={{ background: '#333', padding: '1rem', borderRadius: '8px', flex: 1 }}>
            <h4>Sales</h4>
            <p style={{ fontSize: '1.5rem' }}>$12,000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
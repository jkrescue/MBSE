export default function DashboardLayout({ sidebar, children }) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside
        style={{
          width: '200px',
          borderRight: '1px solid #ccc',
          padding: '1rem',
          boxSizing: 'border-box',
        }}
      >
        {sidebar}
      </aside>
      <main style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>{children}</main>
    </div>
  );
}

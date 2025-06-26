export default function TopBar({ role }) {
  return (
    <div
      style={{
        height: '50px',
        borderBottom: '1px solid #ccc',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span>控制台</span>
      <span>当前角色: {role}</span>
    </div>
  );
}

export default function Sidebar({ items }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {items.map((it) => (
        <li key={it} style={{ marginBottom: '0.5rem' }}>
          {it}
        </li>
      ))}
    </ul>
  );
}

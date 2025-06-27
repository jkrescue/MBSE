import { useState } from 'react';

export default function ToolDataSelector({ data }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggle = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '0.5rem',
        marginTop: '0.5rem',
        maxHeight: '150px',
        overflowY: 'auto',
      }}
    >
      {data.map((d) => (
        <label key={d.id || d.name} style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={selectedItems.includes(d)}
            onChange={() => toggle(d)}
          />
          {d.name || d.id}
        </label>
      ))}
    </div>
  );
}

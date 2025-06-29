import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const CustomStartNode = memo(({ data, selected }) => {
  return (
    <div
      style={{
        background: selected ? '#f6ffed' : '#fff',
        border: selected ? '2px solid #52c41a' : '2px solid #52c41a',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: selected ? '0 2px 8px rgba(82, 196, 26, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
      }}
    >
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#52c41a' }}
      />
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '20px', 
          marginBottom: '2px',
          color: '#52c41a'
        }}>
          ▶️
        </div>
        <div style={{ 
          fontSize: '10px', 
          color: '#666',
          wordBreak: 'break-word'
        }}>
          {data.label}
        </div>
      </div>
    </div>
  );
});

CustomStartNode.displayName = 'CustomStartNode';

export default CustomStartNode; 
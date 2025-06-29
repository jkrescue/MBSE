import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const CustomTaskNode = memo(({ data, selected }) => {
  return (
    <div
      style={{
        background: selected ? '#e6f7ff' : '#fff',
        border: selected ? '2px solid #1890ff' : '2px solid #d9d9d9',
        borderRadius: '8px',
        padding: '12px',
        minWidth: '120px',
        boxShadow: selected ? '0 2px 8px rgba(24, 144, 255, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
      />
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '16px', 
          marginBottom: '4px',
          fontWeight: '500',
          color: '#262626'
        }}>
          📋
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#666',
          wordBreak: 'break-word'
        }}>
          {data.label}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#555' }}
      />
    </div>
  );
});

CustomTaskNode.displayName = 'CustomTaskNode';

export default CustomTaskNode; 
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const CustomEndNode = memo(({ data, selected }) => {
  return (
    <div
      style={{
        background: selected ? '#fff2f0' : '#fff',
        border: selected ? '2px solid #ff4d4f' : '2px solid #ff4d4f',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: selected ? '0 2px 8px rgba(255, 77, 79, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#ff4d4f' }}
      />
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '20px', 
          marginBottom: '2px',
          color: '#ff4d4f'
        }}>
          ⏹️
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

CustomEndNode.displayName = 'CustomEndNode';

export default CustomEndNode; 
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const CustomGatewayNode = memo(({ data, selected }) => {
  return (
    <div
      style={{
        background: selected ? '#fff7e6' : '#fff',
        border: selected ? '2px solid #faad14' : '2px solid #faad14',
        borderRadius: '4px',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'rotate(45deg)',
        boxShadow: selected ? '0 2px 8px rgba(250, 173, 20, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#faad14' }}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#faad14' }}
      />
      
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#faad14' }}
      />
      
      <div style={{ 
        textAlign: 'center',
        transform: 'rotate(-45deg)',
        fontSize: '12px',
        color: '#faad14',
        fontWeight: 'bold'
      }}>
        ?
      </div>
    </div>
  );
});

CustomGatewayNode.displayName = 'CustomGatewayNode';

export default CustomGatewayNode; 
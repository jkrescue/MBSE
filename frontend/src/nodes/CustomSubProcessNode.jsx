import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const CustomSubProcessNode = memo(({ data, selected }) => {
  return (
    <div
      style={{
        background: selected ? '#f0f8ff' : '#fff',
        border: selected ? '2px solid #1890ff' : '2px solid #1890ff',
        borderRadius: '8px',
        padding: '16px',
        minWidth: '140px',
        minHeight: '80px',
        boxShadow: selected ? '0 2px 8px rgba(24, 144, 255, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#1890ff' }}
      />
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '18px', 
          marginBottom: '4px',
          color: '#1890ff'
        }}>
          📦
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#666',
          wordBreak: 'break-word',
          fontWeight: '500'
        }}>
          {data.label}
        </div>
      </div>

      {/* 子流程标识线 */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        right: '8px',
        height: '2px',
        background: '#1890ff',
        borderRadius: '1px'
      }} />

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#1890ff' }}
      />
    </div>
  );
});

CustomSubProcessNode.displayName = 'CustomSubProcessNode';

export default CustomSubProcessNode; 
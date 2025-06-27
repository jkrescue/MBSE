import React, { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

function NodeDetail({ node, onClose, onSelectSub }) {
  const [subNodes] = useState(
    node.data.subNodes.map((sn, idx) => ({
      id: sn.id,
      position: { x: idx * 120, y: 0 },
      data: { label: sn.label, active: sn.active },
    }))
  );

  const [edges] = useState(
    node.data.subEdges ||
      node.data.subNodes.slice(1).map((sn, idx) => ({
        id: `${node.id}-${idx}`,
        source: node.data.subNodes[idx].id,
        target: sn.id,
      }))
  );

  const onNodeClick = useCallback((_e, n) => {
    const sub = node.data.subNodes.find((s) => s.id === n.id);
    onSelectSub(sub);
  }, [node, onSelectSub]);

  return (
    <div className="detail-overlay">
      <div className="detail-header">
        <span>{node.data.label} 子节点</span>
        <button onClick={onClose}>关闭</button>
      </div>
      <div className="detail-canvas">
        <ReactFlow nodes={subNodes} edges={edges} onNodeClick={onNodeClick} fitView>
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}

export default NodeDetail;

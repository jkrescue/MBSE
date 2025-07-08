import React, { useEffect, useRef } from 'react';
import LogicFlow from '@logicflow/core';
import { MiniMap, Snapshot } from '@logicflow/extension';
import '@logicflow/core/dist/style/index.css';
import '@logicflow/extension/lib/style/index.css';
import './FlowCanvas.css';

let lf = null;

export default function FlowCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!lf) {
      lf = new LogicFlow({
        container: containerRef.current,
        grid: true,
        keyboard: { enabled: true },
        plugins: [MiniMap, Snapshot],
      });
      lf.render({ nodes: [], edges: [] });
    }
    return () => {
      // LogicFlow v1.2.x 无 destroy 方法，仅清空引用即可
      lf = null;
    };
  }, []);

  return (
    <div className="flow-canvas-wrapper">
      <div ref={containerRef} className="flow-canvas" />
    </div>
  );
}

import { useCallback, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import { initialNodes, initialEdges } from './workflowData';
import './App.css';

const statusColors = {
  pending: '#f0f0f0',
  running: '#fff2ab',
  completed: '#c4f5d2',
};

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selected, setSelected] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = (_e, node) => {
    setSelected(node);
  };

  const toggleActive = (id) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, active: !n.data.active } } : n
      )
    );
    if (selected && selected.id === id) {
      setSelected((s) => ({ ...s, data: { ...s.data, active: !s.data.active } }));
    }
  };

  const toggleSubNode = (nodeId, subId) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== nodeId) return n;
        return {
          ...n,
          data: {
            ...n.data,
            subNodes: n.data.subNodes.map((sn) =>
              sn.id === subId ? { ...sn, active: !sn.active } : sn
            ),
          },
        };
      })
    );
    if (selected && selected.id === nodeId) {
      setSelected((s) => ({
        ...s,
        data: {
          ...s.data,
          subNodes: s.data.subNodes.map((sn) =>
            sn.id === subId ? { ...sn, active: !sn.active } : sn
          ),
        },
      }));
    }
  };

  const updateStatus = (id, status) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: { ...n.data, status },
              style: { background: statusColors[status] },
            }
          : n
      )
    );
    if (selected && selected.id === id) {
      setSelected((s) => ({ ...s, data: { ...s.data, status } }));
    }
  };

  const runWorkflowFrom = async (startId) => {
    const startIndex = nodes.findIndex((n) => n.id === startId);
    for (let i = startIndex; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node.data.active) continue;
      updateStatus(node.id, 'running');
      await new Promise((r) => setTimeout(r, 1000));
      updateStatus(node.id, 'completed');
    }
  };

  const startFromNode = (node) => {
    runWorkflowFrom(node.id);
  };

  const publishApp = () => {
    const name = prompt('应用名称', 'My Workflow App');
    const projectId = prompt('projectId', 'demoProj');
    const modelId = prompt('modelId', 'EA001');
    const fmuVersion = prompt('fmuVersion', 'v1');
    const enableTrace = confirm('开启追溯链构建?');
    const params = { projectId, modelId, fmuVersion, enableTrace };
    localStorage.setItem(
      'publishedWorkflow',
      JSON.stringify({ name, params, nodes })
    );
    window.location.href = '/app';
  };

  return (
    <div className="container">
      <div className="canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      <div className="sidebar">
        {selected ? (
          <div>
            <h3>{selected.data.label}</h3>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={selected.data.active}
                onChange={() => toggleActive(selected.id)}
              />
              激活
            </label>
            <h4>子节点</h4>
            {selected.data.subNodes.map((sn) => (
              <label className="checkbox" key={sn.id}>
                <input
                  type="checkbox"
                  checked={sn.active}
                  onChange={() => toggleSubNode(selected.id, sn.id)}
                />
                {sn.label}
                {sn.required ? ' (必选)' : ''}
              </label>
            ))}
            <button onClick={() => startFromNode(selected)}>从此处开始执行</button>
          </div>
        ) : (
          <div>选择一个节点查看详情</div>
        )}
        <hr />
        <button onClick={() => runWorkflowFrom(nodes[0].id)}>运行流程</button>
        <button onClick={publishApp}>发布为应用</button>
      </div>
    </div>
  );
}

export default App;

import { useCallback, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import { initialNodes, initialEdges } from './workflowData';
import NodeDetail from './NodeDetail.jsx';
import './App.css';

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [subNode, setSubNode] = useState(null);
  const [polarionData, setPolarionData] = useState([]);

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
    setSubNode(null);
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

  const startFromNode = (node) => {
    alert(`Start from ${node.data.label}`);
  };

  const loadPolarion = async () => {
    const res = await fetch('/polarionSample.json');
    const data = await res.json();
    setPolarionData(data);
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
            <button onClick={() => setShowDetail(true)}>查看子节点视图</button>
            <button onClick={() => startFromNode(selected)}>从此处开始执行</button>
          </div>
        ) : (
          <div>选择一个节点查看详情</div>
        )}

        {subNode && (
          <div className="subConfig">
            <h4>子节点配置 - {subNode.label}</h4>
            {subNode.tool && (
              <p>
                工具: {subNode.tool}{' '}
                {subNode.url && (
                  <a href={subNode.url} target="_blank" rel="noreferrer">
                    打开
                  </a>
                )}
              </p>
            )}
            {subNode.desc && <p>{subNode.desc}</p>}
            {subNode.tool === 'Polarion' && (
              <div>
                <button onClick={loadPolarion}>加载Polarion数据</button>
                {polarionData.length > 0 && (
                  <ul>
                    {polarionData.map((r) => (
                      <li key={r.id}>{r.id}: {r.title}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {showDetail && selected && (
        <NodeDetail
          node={selected}
          onClose={() => setShowDetail(false)}
          onSelectSub={(sn) => setSubNode(sn)}
        />
      )}
    </div>
  );
}

export default App;

import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { initialNodes, initialEdges } from './workflowData';
import './App.css';
import SubWorkflow from './components/SubWorkflow.jsx';

const statusColors = {
  pending: '#f0f0f0',
  running: '#fff2ab',
  completed: '#c4f5d2',
};

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selected, setSelected] = useState(null);
  const [showSub, setShowSub] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [toolData, setToolData] = useState([]);

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

  const openSubWorkflow = () => {
    setShowSub(true);
    setSelectedSub(null);
    setToolData([]);
  };

  const closeSubWorkflow = () => {
    setShowSub(false);
    setSelectedSub(null);
    setToolData([]);
  };

  const onSubNodeClick = (_e, node) => {
    setSelectedSub(node);
  };

  const fetchToolData = async (api) => {
    try {
      const res = await fetch(api);
      const data = await res.json();
      setToolData(data.items || data);
    } catch (e) {
      // fallback demo data
      setToolData([{ id: 1, name: '示例数据' }]);
    }
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
            <button onClick={openSubWorkflow}>查看子节点视图</button>
            <button onClick={() => startFromNode(selected)}>从此处开始执行</button>
          </div>
        ) : (
          <div>选择一个节点查看详情</div>
        )}
        <hr />
        <button onClick={() => runWorkflowFrom(nodes[0].id)}>运行流程</button>
        <button onClick={publishApp}>发布为应用</button>
      </div>
      {showSub && selected && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '1rem',
              display: 'flex',
              gap: '1rem',
            }}
          >
            <SubWorkflow
              nodes={selected.data.subNodes.map((sn, idx) => ({
                id: sn.id,
                position: { x: idx * 150, y: 0 },
                data: { label: sn.label },
              }))}
              edges={(selected.data.subEdges || selected.data.subNodes.map((_, i) => i < selected.data.subNodes.length - 1 && {
                id: `sub-${i}`,
                source: selected.data.subNodes[i].id,
                target: selected.data.subNodes[i + 1].id,
              }).filter(Boolean))}
              onNodeClick={onSubNodeClick}
            />
            <div style={{ width: '250px' }}>
              {selectedSub ? (
                <div>
                  <h4>{selectedSub.data.label}</h4>
                  {selected.data.subNodes
                    .find((sn) => sn.id === selectedSub.id)
                    ?.config?.tool && (
                    <div>
                      <p>外部工具: {selected.data.subNodes.find((sn) => sn.id === selectedSub.id).config.tool}</p>
                      <button
                        onClick={() =>
                          window.open(
                            selected.data.subNodes.find((sn) => sn.id === selectedSub.id).config.link,
                            '_blank'
                          )
                        }
                      >
                        打开工具
                      </button>
                      <button
                        onClick={() =>
                          fetchToolData(
                            selected.data.subNodes.find((sn) => sn.id === selectedSub.id).config.restApi
                          )
                        }
                      >
                        解析内容
                      </button>
                      {toolData.length > 0 && (
                        <ul>
                          {toolData.map((d) => (
                            <li key={d.id || d.name}>{d.name || d.id}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>选择子节点查看配置</div>
              )}
              <button onClick={closeSubWorkflow}>关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

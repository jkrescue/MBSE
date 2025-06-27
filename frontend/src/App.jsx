



import { useState } from 'react';
import BpmnModeler from './BpmnModeler.jsx';
import { initialNodes } from './workflowData';
import './App.css';

// 针对“链接需求服务”节点的属性卡片
function RestConnectorProperties({ element }) {
  // 仅演示，真实数据应从 element.businessObject 解析
  return (
    <div style={{padding: 16}}>
      <div style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>REST OUTBOUND CONNECTOR</div>
      <div style={{color:'#888',marginBottom:16}}>链接需求服务</div>
      {/* 通用 */}
      <div style={{borderBottom:'1px solid #eee',marginBottom:8,paddingBottom:8}}>
        <div style={{fontWeight:'bold'}}>General</div>
        <div>Name</div>
        <input style={{width:'100%',marginBottom:4}} value={element.name||''} readOnly />
        <div>ID</div>
        <input style={{width:'100%'}} value={element.id||''} readOnly />
      </div>
      {/* 模板 */}
      <div style={{borderBottom:'1px solid #eee',marginBottom:8,paddingBottom:8}}>
        <div style={{fontWeight:'bold'}}>Template <span style={{color:'#1976d2',fontWeight:'normal',fontSize:12}}>Applied</span></div>
        <div>Name: REST Outbound Connector</div>
        <div>Version: 10</div>
        <div>Description: Invoke REST API</div>
      </div>
      {/* 认证 */}
      <div style={{borderBottom:'1px solid #eee',marginBottom:8,paddingBottom:8}}>
        <div style={{fontWeight:'bold'}}>Authentication</div>
        <div>Type</div>
        <select style={{width:'100%',marginBottom:4}} value="None" disabled>
          <option>None</option>
        </select>
        <div style={{fontSize:12,color:'#888'}}>Choose the authentication type. Select 'None' if no authentication is necessary</div>
      </div>
      {/* HTTP端点 */}
      <div style={{borderBottom:'1px solid #eee',marginBottom:8,paddingBottom:8}}>
        <div style={{fontWeight:'bold'}}>HTTP endpoint</div>
        <div>Method</div>
        <select style={{width:'100%',marginBottom:4}} value="GET" disabled>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <div>URL <span style={{color:'red'}}>*</span></div>
        <input style={{width:'100%',marginBottom:4,borderColor:'red'}} value={''} placeholder="URL must not be empty." readOnly />
        <div style={{fontSize:12,color:'red'}}>URL must not be empty.</div>
      </div>
      {/* Header等可扩展 */}
    </div>
  );
}
function App() {
  // 状态：当前显示的主节点id（null为主流程）
  const [showSubProcessOf, setShowSubProcessOf] = useState(null);
  // 状态：当前选中的节点（主节点或子节点）
  const [selectedNode, setSelectedNode] = useState(null);

  // 处理BPMN节点点击
  const handleNodeClick = (element) => {
    // element.id 可能是主节点id或子节点id
    // 这里可扩展递归查找逻辑，当前仅兼容旧数据结构
    if (!showSubProcessOf) {
      // 主流程：点击主节点
      const node = initialNodes.find(n => n.id === element.id);
      if (node) setSelectedNode({ type: 'main', node });
    } else {
      // 子流程：点击子节点
      const main = initialNodes.find(n => n.id === showSubProcessOf);
      if (main) {
        const sub = (main.data.subNodes || []).find(sn => sn.id === element.id);
        if (sub) setSelectedNode({ type: 'sub', node: sub, main });
      }
    }
  };

  // 处理BPMN节点双击
  const handleNodeDoubleClick = (element) => {
    if (!showSubProcessOf) {
      // 主流程：双击主节点，切换到子流程
      const node = initialNodes.find(n => n.id === element.id);
      if (node && node.data && node.data.subNodes) {
        setShowSubProcessOf(node.id);
        setSelectedNode(null);
      }
    } else {
      // 子流程：双击无操作
    }
  };

  // 返回主流程
  const handleBack = () => {
    setShowSubProcessOf(null);
    setSelectedNode(null);
  };

  // 属性面板内容
  let panelContent = <div style={{padding: 16, color: '#888'}}>请选择主节点或子节点</div>;
  if (selectedNode) {
    // 只针对“链接需求服务”节点特殊展示
    // 1. BPMN serviceTask（主流程或子流程）
    if (
      selectedNode.type === 'bpmn:serviceTask' &&
      (selectedNode.node.name === '链接需求服务' || selectedNode.node.id === 'Activity_1450w8g')
    ) {
      panelContent = <RestConnectorProperties element={selectedNode.node} />;
    }
    // 2. ReactFlow/自定义子节点（兼容旧数据结构）
    else if (
      selectedNode.type === 'sub' &&
      (selectedNode.node.label === '链接需求服务' || selectedNode.node.id === 'link')
    ) {
      // 兼容旧子节点结构
      panelContent = <RestConnectorProperties element={{
        name: selectedNode.node.label,
        id: selectedNode.node.id
      }} />;
    }
    else if (selectedNode.type === 'main') {
      const n = selectedNode.node;
      panelContent = (
        <div style={{padding: 16}}>
          <h3>{n.data?.label || n.name}</h3>
          <div>主节点ID: {n.id}</div>
        </div>
      );
    } else if (selectedNode.type === 'sub') {
      const sn = selectedNode.node;
      panelContent = (
        <div style={{padding: 16}}>
          <h3>{sn.label || sn.name}</h3>
          <div>子节点ID: {sn.id}</div>
        </div>
      );
    }
  }

  return (
    <div className="bpmn-camunda-layout">
      {/* 工具栏 */}
      <div className="bpmn-toolbar">
        <span style={{ fontWeight: 'bold', fontSize: 18 }}>BPMN 工作流建模器</span>
        {showSubProcessOf && (
          <button style={{marginLeft: 24}} onClick={handleBack}>返回主流程</button>
        )}
      </div>
      {/* 主区域 */}
      <div className="bpmn-main-area">
        {/* BPMN画布 */}
        <div className="bpmn-canvas-area">
          <BpmnModeler
            showSubProcessOf={showSubProcessOf}
            onNodeClick={handleNodeClick}
            onNodeDoubleClick={handleNodeDoubleClick}
          />
        </div>
        {/* 右侧属性面板 */}
        <div className="bpmn-properties-panel">
          {panelContent}
        </div>
      </div>
    </div>
  );
}

export default App;

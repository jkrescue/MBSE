import { useState } from 'react';
import BpmnModeler from './BpmnModeler.jsx';
import { initialNodes } from './workflowData';
import './App.css';
import WorkflowHome from './WorkflowHome.jsx';
import './WorkflowHome.css';
import closeIcon from './assets/close.png';

// 针对"链接需求服务"节点的属性卡片
function RestConnectorProperties({ element }) {
  // Camunda风格分组，字段更贴近真实属性
  const bo = element;
  return (
    <div style={{padding: 0, fontFamily: 'Inter, Arial, sans-serif', fontSize: 14, background: '#fff'}}>
      {/* 标题栏 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom: '1px solid #eee', background: '#f7f8fa'}}>
        <div style={{fontWeight:'bold',fontSize:17,marginBottom:2}}>REST Outbound Connector</div>
        <div style={{color:'#888',fontSize:13}}>{bo.name || '链接需求服务'}</div>
      </div>
      {/* General 分组 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom:'1px solid #eee'}}>
        <div style={{fontWeight:'bold',marginBottom:8}}>General</div>
        <div style={{marginBottom:6}}>
          <div style={{fontSize:13, color:'#222'}}>Name</div>
          <input style={{width:'100%',marginBottom:4}} value={bo.name||''} readOnly />
        </div>
        <div>
          <div style={{fontSize:13, color:'#222'}}>ID</div>
          <input style={{width:'100%'}} value={bo.id||''} readOnly />
        </div>
      </div>
      {/* Template 分组 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom:'1px solid #eee'}}>
        <div style={{fontWeight:'bold',marginBottom:8}}>Template <span style={{color:'#1976d2',fontWeight:'normal',fontSize:12}}>Applied</span></div>
        <div style={{fontSize:13}}>Name: <span style={{color:'#333'}}>REST Outbound Connector</span></div>
        <div style={{fontSize:13}}>Version: <span style={{color:'#333'}}>10</span></div>
        <div style={{fontSize:13}}>Description: <span style={{color:'#333'}}>Invoke REST API</span></div>
      </div>
      {/* Authentication 分组 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom:'1px solid #eee'}}>
        <div style={{fontWeight:'bold',marginBottom:8}}>Authentication</div>
        <div style={{fontSize:13, color:'#222'}}>Type</div>
        <select style={{width:'100%',marginBottom:4}} value="None" disabled>
          <option>None</option>
        </select>
        <div style={{fontSize:12,color:'#222'}}>Choose the authentication type. Select 'None' if no authentication is necessary</div>
      </div>
      {/* HTTP endpoint 分组 */}
      <div style={{padding: '16px 20px 8px 20px', borderBottom:'1px solid #eee'}}>
        <div style={{fontWeight:'bold',marginBottom:8}}>HTTP endpoint</div>
        <div style={{fontSize:13, color:'#222'}}>Method</div>
        <select style={{width:'100%',marginBottom:4}} value={bo.method||'GET'} disabled>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <div style={{fontSize:13, color:'#222'}}>URL <span style={{color:'red'}}>*</span></div>
        <input style={{width:'100%',marginBottom:4,borderColor:'#ccc'}} value={bo.url||''} placeholder="URL must not be empty." readOnly />
        <div style={{fontSize:12,color:'#222'}}>URL must not be empty.</div>
      </div>
      {/* Header/高级等分组可继续扩展 */}
    </div>
  );
}
function App() {
  // 状态：当前显示的主节点id（null为主流程）
  const [showSubProcessOf, setShowSubProcessOf] = useState(null);
  // 状态：当前选中的节点（主节点或子节点）
  const [selectedNode, setSelectedNode] = useState(null);
  // 新增：控制BPMN建模器弹窗显示
  const [showBpmnModal, setShowBpmnModal] = useState(false);
  // 新增：保存新建工作流定义信息
  const [workflowDef, setWorkflowDef] = useState(null);

  // 处理BPMN节点点击，兼容 bpmn-js 业务对象
  const handleNodeClick = (element) => {
    const bo = element.businessObject || element;
    // 专属配置：链接需求服务
    if (
      (bo.$type === 'bpmn:ServiceTask' || bo.type === 'bpmn:serviceTask') &&
      (bo.name === '链接需求服务' || bo.id === 'Activity_1450w8g')
    ) {
      setSelectedNode({ type: 'bpmn:serviceTask', node: bo });
      return;
    }
    // 其它 BPMN 节点通用处理（所有层级的 task/service/userTask/subProcess/event 等）
    if (bo.$type && bo.id) {
      setSelectedNode({ type: bo.$type.replace('bpmn:', 'bpmn:'), node: bo });
      return;
    }
    // 兼容旧数据结构
    if (!showSubProcessOf) {
      const node = initialNodes.find(n => n.id === element.id);
      if (node) setSelectedNode({ type: 'main', node });
    } else {
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
  let panelContent = <div style={{padding: 16, color: '#222'}}>请选择主节点或子节点</div>;
  if (selectedNode) {
    // 针对 BPMN 画布节点，按类型弹出不同配置卡片
    const bo = selectedNode.node;
    if (selectedNode.type === 'bpmn:serviceTask') {
      // 针对"链接需求服务"节点展示专属配置，其它服务任务展示通用卡片
      if (bo.name === '链接需求服务' || bo.id === 'Activity_1450w8g') {
        panelContent = <RestConnectorProperties element={bo} />;
      } else {
        panelContent = (
          <div style={{padding: 20}}>
            <div style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>服务任务</div>
            <div style={{marginBottom:8}}>名称：<input style={{width:'80%'}} value={bo.name||''} readOnly /></div>
            <div style={{marginBottom:8}}>ID：<input style={{width:'80%'}} value={bo.id||''} readOnly /></div>
          </div>
        );
      }
    } else if (bo.$type === 'bpmn:UserTask' || bo.type === 'bpmn:UserTask') {
      panelContent = (
        <div style={{padding: 20}}>
          <div style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>用户任务</div>
          <div style={{marginBottom:8}}>名称：<input style={{width:'80%'}} value={bo.name||''} readOnly /></div>
          <div style={{marginBottom:8}}>ID：<input style={{width:'80%'}} value={bo.id||''} readOnly /></div>
          <div style={{marginBottom:8}}>Assignee：<input style={{width:'80%'}} value={bo.assignee||''} readOnly /></div>
        </div>
      );
    } else if (bo.$type === 'bpmn:StartEvent' || bo.type === 'bpmn:StartEvent') {
      panelContent = (
        <div style={{padding: 20}}>
          <div style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>开始事件</div>
          <div style={{marginBottom:8}}>名称：<input style={{width:'80%'}} value={bo.name||''} readOnly /></div>
          <div style={{marginBottom:8}}>ID：<input style={{width:'80%'}} value={bo.id||''} readOnly /></div>
        </div>
      );
    } else if (bo.$type === 'bpmn:EndEvent' || bo.type === 'bpmn:EndEvent') {
      panelContent = (
        <div style={{padding: 20}}>
          <div style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>结束事件</div>
          <div style={{marginBottom:8}}>名称：<input style={{width:'80%'}} value={bo.name||''} readOnly /></div>
          <div style={{marginBottom:8}}>ID：<input style={{width:'80%'}} value={bo.id||''} readOnly /></div>
        </div>
      );
    } else if (bo.$type === 'bpmn:SubProcess' || bo.type === 'bpmn:SubProcess') {
      panelContent = (
        <div style={{padding: 20}}>
          <div style={{fontWeight:'bold',fontSize:16,marginBottom:8}}>子流程</div>
          <div style={{marginBottom:8}}>名称：<input style={{width:'80%'}} value={bo.name||''} readOnly /></div>
          <div style={{marginBottom:8}}>ID：<input style={{width:'80%'}} value={bo.id||''} readOnly /></div>
        </div>
      );
    } else if (selectedNode.type === 'main') {
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

  // 新建工作流按钮回调
  const handleCreateWorkflow = (def) => {
    setWorkflowDef(def || null);
    setShowBpmnModal(true);
  };
  // 关闭建模器弹窗
  const handleCloseBpmnModal = () => {
    setShowBpmnModal(false);
    setShowSubProcessOf(null);
    setSelectedNode(null);
    setWorkflowDef(null);
  };

  // 首页内容
  return (
    <div>
      <WorkflowHome onCreateWorkflow={handleCreateWorkflow} />
      {/* BPMN建模器弹窗 */}
      {showBpmnModal && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:8,boxShadow:'0 4px 24px rgba(0,0,0,0.12)',padding:0,minWidth:1200,minHeight:700,position:'relative'}}>
            {/* 新建工作流定义信息提示 */}
            {workflowDef && (
              <div style={{background:'#e3f0ff',color:'#1976d2',fontWeight:500,padding:'8px 24px',borderRadius:'8px 8px 0 0',fontSize:16,marginBottom:8}}>
                新建工作流：{workflowDef.name}（阶段：{workflowDef.stage}）
              </div>
            )}
            <button style={{position:'absolute',top:18,right:32,zIndex:10,background:'none',border:'none',borderRadius:'50%',width:36,height:36,cursor:'pointer',boxShadow:'none',display:'flex',alignItems:'center',justifyContent:'center',padding:0}} onClick={handleCloseBpmnModal}>
              <img src={closeIcon} alt="关闭" style={{width:20,height:20}} />
            </button>
            <div className="bpmn-main-area" style={{height:'680px'}}>
              <div className="bpmn-canvas-area">
                <BpmnModeler
                  showSubProcessOf={showSubProcessOf}
                  onNodeClick={handleNodeClick}
                  onNodeDoubleClick={handleNodeDoubleClick}
                />
              </div>
              <div className="bpmn-properties-panel">
                {panelContent}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

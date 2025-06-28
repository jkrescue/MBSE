import React, { useState } from 'react';
import './WorkflowHome.css';
import logo from './assets/react.svg'; // 可替换为实际logo
import createImg from './assets/createworkflow.png';
import editImg from './assets/editworkflow.png';
import publishImg from './assets/publishworkflow.png';
import templateIcon from './assets/template.png'; // 你可以用任意模板icon
import { useNavigate } from 'react-router-dom';
import closeIcon from './assets/close.png';

// 快捷操作卡片数据
const quickActions = [
  { icon: '➕', label: '新建系统工程流程', onClick: () => {} },
  { icon: '📂', label: '查看最近使用', onClick: () => {} },
  { icon: '📊', label: '系统建模模板库', onClick: () => {} },
];

const QuickActionBoard = () => (
  <div className="quick-action-board">
    {quickActions.map(action => (
      <div className="quick-action-card" key={action.label} onClick={action.onClick} tabIndex={0} role="button">
        <span className="quick-action-icon">{action.icon}</span>
        <span className="quick-action-label">{action.label}</span>
      </div>
    ))}
  </div>
);

// 静态引导流程内容
const GuideSteps = () => (
  <div className="workflow-guide-bg">
    <div className="workflow-guide-content">
      <div className="guide-header">
        <img src={logo} alt="logo" className="guide-logo" />
        <div className="guide-title">工作流管理平台</div>
        <div className="guide-desc">高效、智能、可视化的流程管理，助力企业数字化转型</div>
      </div>
      {/* 数据总览横向卡片包裹 */}
      <div className="overview-board-wrapper">
        <OverviewBoard />
      </div>
      {/* 快捷操作卡片区 */}
      <QuickActionBoard />
      {/* 静态引导三步流程独立横向卡片 */}
      <div className="guide-steps-card">
        <div className="guide-steps-row">
          <div className="guide-step">
            <img src={createImg} alt="新建" className="step-img" />
            <div className="step-title">新建工作流</div>
            <div className="step-desc">点击"新建工作流"按钮，创建你的第一个流程</div>
          </div>
          <div className="guide-arrow">→</div>
          <div className="guide-step">
            <img src={editImg} alt="编辑" className="step-img" />
            <div className="step-title">设计工作流</div>
            <div className="step-desc">在弹出的建模器中拖拽节点，配置工作流逻辑</div>
          </div>
          <div className="guide-arrow">→</div>
          <div className="guide-step">
            <img src={publishImg} alt="发布" className="step-img" />
            <div className="step-title">发布工作流</div>
            <div className="step-desc">工作流设计完成后可一键发布，正式投入使用</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 状态标签渲染
const statusColorMap = {
  '已发布': '#43a047',
  '未发布': '#bdbdbd',
  '执行中': '#1976d2',
  '异常': '#e53935',
};
const renderStatus = (status) => (
  <span style={{
    display: 'inline-block',
    padding: '2px 12px',
    borderRadius: '12px',
    background: statusColorMap[status] || '#bdbdbd',
    color: '#fff',
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: 1,
  }}>{status}</span>
);

// 表头
const columns = [
  { title: '名称', dataIndex: 'name' },
  { title: '所属系统', dataIndex: 'system' },
  { title: '阶段', dataIndex: 'stage' },
  { title: '描述', dataIndex: 'desc' },
  { title: '状态', dataIndex: 'status' },
  { title: '最新活动', dataIndex: 'activity' },
  { title: '操作', dataIndex: 'actions' },
];

// 示例数据
const initialData = [
  { name: '空调热管理流程', system: '整车系统', stage: '系统仿真', desc: '空调系统热仿真流程', status: '已发布', activity: '已执行-成功' },
  { name: '整车性能-车速验证', system: '动力系统', stage: '性能测试', desc: '整车动力性与最高车速性能测试', status: '执行中', activity: '待执行' },
  { name: '整车功能安全', system: '电子电气', stage: '功能安全', desc: 'ISO26262功能安全分析与流程管理', status: '未发布', activity: '待执行' },
  { name: '整车能量流分析', system: '能量系统', stage: '能效分析', desc: '能量流分布与能效分析流程', status: '异常', activity: '异常-终止' },
  { name: '电池包热失控管理', system: '电池系统', stage: '安全仿真', desc: '电池包热失控仿真与安全验证', status: '已发布', activity: '已执行-成功' },
  { name: '智能驾驶功能测试', system: '智能驾驶', stage: '功能测试', desc: '自动驾驶功能场景测试流程', status: '执行中', activity: '已执行-部分成功' },
  { name: '整车NVH分析', system: '整车系统', stage: 'NVH分析', desc: '整车噪声与振动仿真分析', status: '未发布', activity: '待执行' },
  { name: '动力电池寿命预测', system: '电池系统', stage: '寿命预测', desc: '动力电池寿命建模与预测流程', status: '已发布', activity: '已执行-成功' },
];

// 数据总览卡片
const overviewData = [
  { label: '总项目数', value: 12, color: '#1976d2' },
  { label: '发布流程数', value: 7, color: '#43a047' },
  { label: '执行中的流程', value: 2, color: '#ffa000' },
  { label: '异常流程', value: 1, color: '#e53935' },
];

const OverviewBoard = () => (
  <div className="overview-board">
    {overviewData.map(item => (
      <div className="overview-card" key={item.label} style={{borderBottom:`3px solid ${item.color}`}}>
        <div className="overview-value">{item.value}</div>
        <div className="overview-label">{item.label}</div>
      </div>
    ))}
  </div>
);

// 模板数据
const templateTags = ['全部', '通用', '业务'];
const templateList = [
  {
    templateId: 'vmodel',
    name: 'INCOSE V-模型',
    description: '经典系统工程V模型，适用于通用系统开发流程。',
    tags: ['通用'],
    defaultPhaseList: ['需求分析', '系统设计', '集成验证'],
    defaultModelBinding: ['需求模型', '设计模型'],
  },
  {
    templateId: 'rflp',
    name: 'RFLP流程',
    description: '基于RFLP思想的系统建模流程，适合复杂产品。',
    tags: ['通用'],
    defaultPhaseList: ['需求', '功能', '逻辑', '物理'],
    defaultModelBinding: ['功能模型', '逻辑模型'],
  },
  {
    templateId: 'ac_heat',
    name: '空调热管理模板',
    description: '面向整车空调热管理的业务流程模板。',
    tags: ['业务'],
    defaultPhaseList: ['热负荷分析', '仿真建模', '测试验证'],
    defaultModelBinding: ['热管理模型'],
  },
  {
    templateId: 'veh_perf',
    name: '整车性能模板',
    description: '整车动力性与性能分析业务流程模板。',
    tags: ['业务'],
    defaultPhaseList: ['性能需求', '仿真分析', '性能验证'],
    defaultModelBinding: ['性能模型'],
  },
];

const phaseList = [
  '全部', '需求分析', '功能建模', '系统仿真', '仿真验证', '性能测试', '安全仿真', 'NVH分析', '寿命预测'
];

export default function WorkflowHome({ onCreateWorkflow }) {
  const [data] = useState(initialData);
  const navigate = useNavigate();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState('全部');
  const [showBpmnModal, setShowBpmnModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState('全部');

  // 模板筛选
  const filteredTemplates = selectedTag === '全部'
    ? templateList
    : templateList.filter(t => t.tags.includes(selectedTag));

  // 表格数据根据阶段筛选
  const filteredData = selectedPhase === '全部'
    ? data
    : data.filter(row => row.stage === selectedPhase);

  // 操作按钮渲染
  const renderActions = (row) => (
    <>
      <button className="action-btn edit">编辑</button>
      <button className="action-btn copy">复制</button>
      <button className="action-btn delete">删除</button>
      <button className="action-btn view">查看</button>
    </>
  );
  // 名称渲染为可点击链接
  const renderName = (row) => (
    <span
      className="workflow-link"
      onClick={() => navigate(`/workflow/${encodeURIComponent(row.name)}`)}
    >
      {row.name}
    </span>
  );

  // 新建工作流按钮回调
  const handleCreateWorkflow = () => {
    setShowBpmnModal(true);
    setSelectedTemplate(null);
  };
  // 关闭建模器弹窗
  const handleCloseBpmnModal = () => {
    setShowBpmnModal(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="workflow-home">
      {/* 上半部分：引导流程（含标题、总览、三步） */}
      <GuideSteps />
      {/* 下半部分：工作流列表 */}
      <div className="workflow-list-section">
        <div className="list-header">
          <span className="list-title">工作流列表</span>
          <div style={{display:'flex',gap:12}}>
            <button className="create-btn" onClick={onCreateWorkflow}>新建工作流</button>
            <button className="create-btn" style={{display:'flex',alignItems:'center',gap:6}} onClick={()=>setShowTemplateModal(true)}>
              <img src={templateIcon} alt="模板" style={{width:18,height:18}} />
              从模板创建
            </button>
          </div>
        </div>
        {/* 阶段筛选条 */}
        <div className="phase-filter-bar">
          {phaseList.map(phase => (
            <span
              key={phase}
              className={selectedPhase === phase ? "phase-filter-tag active" : "phase-filter-tag"}
              onClick={() => setSelectedPhase(phase)}
            >
              {phase}
            </span>
          ))}
        </div>
        <table className="workflow-table">
          <thead>
            <tr>
              {columns.map(col => <th key={col.dataIndex}>{col.title}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx}>
                <td>{renderName(row)}</td>
                <td>{row.system}</td>
                <td>{row.stage}</td>
                <td>{row.desc}</td>
                <td>{renderStatus(row.status)}</td>
                <td>{row.activity}</td>
                <td>{renderActions(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 模板选择模态框 */}
      {showTemplateModal && (
        <div className="modal-mask">
          <div className="modal-content">
            <div className="modal-header">
              <span style={{fontWeight:'bold',fontSize:18}}>选择流程模板</span>
              <button className="modal-close" onClick={()=>setShowTemplateModal(false)}>×</button>
            </div>
            <div className="modal-tags">
              {templateTags.map(tag => (
                <span key={tag} className={selectedTag===tag?"modal-tag active":"modal-tag"} onClick={()=>setSelectedTag(tag)}>{tag}</span>
              ))}
            </div>
            <div className="modal-template-list">
              {filteredTemplates.map(tpl => (
                <div className="modal-template-card" key={tpl.templateId}>
                  <div className="modal-template-title">{tpl.name}</div>
                  <div className="modal-template-desc">{tpl.description}</div>
                  <div className="modal-template-tags">
                    {tpl.tags.map(tag=>(<span className="modal-template-tag" key={tag}>{tag}</span>))}
                  </div>
                  <div className="modal-template-phases">阶段：{tpl.defaultPhaseList.join(' / ')}</div>
                  <div className="modal-template-models">模型绑定：{tpl.defaultModelBinding.join('、')}</div>
                  <button className="modal-template-btn" onClick={() => {
                    setShowTemplateModal(false);
                    setSelectedTemplate(tpl);
                    setShowBpmnModal(true);
                  }}>使用该模板</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* BPMN建模器弹窗（只负责顶部模板提示，实际建模器内容在App中） */}
      {showBpmnModal && selectedTemplate && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:8,boxShadow:'0 4px 24px rgba(0,0,0,0.12)',padding:0,minWidth:1200,minHeight:700,position:'relative'}}>
            <div style={{background:'#e3f0ff',color:'#1976d2',fontWeight:500,padding:'8px 24px',borderRadius:'8px 8px 0 0',fontSize:16,marginBottom:8}}>
              基于模板「{selectedTemplate.name}」创建
            </div>
            <button style={{position:'absolute',top:18,right:32,zIndex:10,background:'none',border:'none',borderRadius:'50%',width:36,height:36,cursor:'pointer',boxShadow:'none',display:'flex',alignItems:'center',justifyContent:'center',padding:0}} onClick={handleCloseBpmnModal}>
              <img src={closeIcon} alt="关闭" style={{width:20,height:20}} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
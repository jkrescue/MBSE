import React, { useState, useEffect } from 'react';
import './WorkflowHome.css';
import logo from './assets/react.svg'; // 可替换为实际logo
import createImg from './assets/createworkflow.png';
import editImg from './assets/editworkflow.png';
import publishImg from './assets/publishworkflow.png';
import templateIcon from './assets/template.png'; // 你可以用任意模板icon
import { useNavigate, Link } from 'react-router-dom';
import closeIcon from './assets/close.png';
import { useLocation } from 'react-router-dom';
import { workflowData } from './workflowData.js';

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

// 渲染状态
const renderStatus = (status) => {
  const statusConfig = {
    '执行中': { color: '#0099ff', bg: '#e6f7ff', icon: '▶️', animation: 'pulse' },
    '已完成': { color: '#52c41a', bg: '#f6ffed', icon: '✅', animation: '' },
    '异常': { color: '#ff4d4f', bg: '#fff2f0', icon: '❌', animation: 'shake' },
    '暂停': { color: '#faad14', bg: '#fffbe6', icon: '⏸️', animation: '' },
    '待发布': { color: '#722ed1', bg: '#f9f0ff', icon: '📋', animation: '' }
  };
  const config = statusConfig[status] || { color: '#666', bg: '#f5f5f5', icon: '📄', animation: '' };
  
  return (
    <span 
      className={`status-tag ${config.animation}`}
      style={{ 
        backgroundColor: config.bg, 
        color: config.color,
        border: `1px solid ${config.color}20`
      }}
    >
      <span className="status-icon">{config.icon}</span>
      {status}
    </span>
  );
};

// 表头
const allColumns = [
  { title: '名称', dataIndex: 'name' },
  { title: '所属系统', dataIndex: 'system' },
  { title: '阶段', dataIndex: 'stage' },
  { title: '描述', dataIndex: 'desc' },
  { title: '状态', dataIndex: 'status' },
  { title: '最新活动', dataIndex: 'activity' },
  { title: '操作', dataIndex: 'actions' },
];

// 数据总览卡片
const overviewData = [
  { label: '总项目数', value: 50, color: '#1976d2' },
  { label: '发布流程数', value: 10, color: '#43a047' },
  { label: '执行中的流程', value: 12, color: '#ffa000' },
  { label: '异常流程', value: 10, color: '#e53935' },
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

// 最近使用localStorage key
const RECENT_KEY = 'recentWorkflows';

function getRecentWorkflows() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
}
function setRecentWorkflows(list) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}

// 我的收藏localStorage key
const FAVORITE_KEY = 'favoriteWorkflows';
function getFavoriteWorkflows() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
  } catch {
    return [];
  }
}
function setFavoriteWorkflows(list) {
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(list));
}

// 面包屑导航组件
function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs">
      {items.map((item, idx) => (
        <span key={item.path}>
          {item.path ? <Link to={item.path}>{item.label}</Link> : <span>{item.label}</span>}
          {idx < items.length - 1 && <span className="breadcrumbs-sep"> / </span>}
        </span>
      ))}
    </nav>
  );
}

// 拖拽初始宽度
const DEFAULT_WIDTHS = {
  name: 180,
  system: 120,
  stage: 120,
  desc: 220,
  status: 100,
  activity: 140,
  actions: 160
};

export default function WorkflowHome({ onCreateWorkflow }) {
  const [data, setData] = useState(workflowData);
  const navigate = useNavigate();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState('全部');
  const [showBpmnModal, setShowBpmnModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState('全部');
  const [showWorkflowDefModal, setShowWorkflowDefModal] = useState(false);
  const [workflowDefForm, setWorkflowDefForm] = useState({
    name: '',
    desc: '',
    stage: phaseList[1]
  });
  const [recentVisible, setRecentVisible] = useState(false);
  const [recentList, setRecentList] = useState(getRecentWorkflows());
  const [favoriteVisible, setFavoriteVisible] = useState(false);
  const [favoriteList, setFavoriteList] = useState(getFavoriteWorkflows());
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [visibleCols, setVisibleCols] = useState(allColumns.map(col => col.dataIndex));
  const [colWidths, setColWidths] = useState(DEFAULT_WIDTHS);
  const [dragCol, setDragCol] = useState(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartWidth, setDragStartWidth] = useState(0);
  const [sortState, setSortState] = useState({ field: '', order: 'asc' });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [publishConfirm, setPublishConfirm] = useState({ show: false, workflow: null });

  // 模板筛选
  const filteredTemplates = selectedTag === '全部'
    ? templateList
    : templateList.filter(t => t.tags.includes(selectedTag));

  // 表格数据根据阶段筛选
  const filteredData = selectedPhase === '全部'
    ? data
    : data.filter(row => row.stage === selectedPhase);

  // 表格渲染用的列
  const columns = allColumns.filter(col => visibleCols.includes(col.dataIndex));

  // 操作按钮渲染
  const renderActions = (row) => (
    <>
      <button className="action-btn edit">编辑</button>
      <button className="action-btn publish" onClick={() => handlePublish(row)}>发布</button>
      <button className="action-btn copy">复制</button>
      <button className="action-btn delete">删除</button>
      <button className="action-btn view">查看</button>
    </>
  );

  // 发布工作流
  const handlePublish = (row) => {
    if (row.status === '已发布') {
      alert('该工作流已经发布过了！');
      return;
    }
    
    setPublishConfirm({ show: true, workflow: row });
  };

  const confirmPublish = () => {
    const { workflow } = publishConfirm;
    
    // 这里应该调用API发布工作流
    console.log('发布工作流:', workflow.name);
    
    // 更新数据状态
    setData(prevData => 
      prevData.map(item => 
        item.name === workflow.name 
          ? { ...item, status: '已发布', activity: '已发布 - 可执行' }
          : item
      )
    );
    
    // 关闭确认对话框
    setPublishConfirm({ show: false, workflow: null });
    
    // 显示成功提示
    alert(`工作流"${workflow.name}"发布成功！`);
  };

  const cancelPublish = () => {
    setPublishConfirm({ show: false, workflow: null });
  };

  // 点击流程名称时，记录最近使用
  const handleWorkflowClick = (row) => {
    const now = Date.now();
    const newItem = { name: row.name, system: row.system, stage: row.stage, time: now };
    let list = getRecentWorkflows();
    // 去重，最新在前
    list = [newItem, ...list.filter(item => item.name !== row.name)].slice(0, 8);
    setRecentWorkflows(list);
    setRecentList(list);
    navigate(`/workflow/${encodeURIComponent(row.name)}`);
  };
  // 名称渲染为可点击链接+收藏星标
  const renderName = (row) => (
    <span style={{display:'flex',alignItems:'center',gap:4}}>
      <span
        className="workflow-link"
        onClick={() => handleWorkflowClick(row)}
      >
        {row.name}
      </span>
      <span
        className={isFavorite(row) ? "favorite-star active" : "favorite-star"}
        title={isFavorite(row) ? "取消收藏" : "收藏"}
        onClick={e => { e.stopPropagation(); handleToggleFavorite(row); }}
      >★</span>
    </span>
  );

  // 新建工作流按钮回调
  const handleCreateWorkflow = () => {
    setShowWorkflowDefModal(true);
    setWorkflowDefForm({ name: '', desc: '', stage: phaseList[1] });
  };
  // 关闭建模器弹窗
  const handleCloseBpmnModal = () => {
    setShowBpmnModal(false);
    setSelectedTemplate(null);
  };

  const isFavorite = (row) => favoriteList.some(item => item.name === row.name);
  const handleToggleFavorite = (row) => {
    let list = getFavoriteWorkflows();
    if (isFavorite(row)) {
      list = list.filter(item => item.name !== row.name);
    } else {
      list = [{ name: row.name, system: row.system, stage: row.stage }, ...list].slice(0, 20);
    }
    setFavoriteWorkflows(list);
    setFavoriteList(list);
  };

  // 拖拽事件
  const handleDragStart = (col, e) => {
    e.stopPropagation();
    setDragCol(col);
    setDragStartX(e.clientX);
    setDragStartWidth(colWidths[col]);
    document.body.style.cursor = 'col-resize';
  };
  const handleDrag = (e) => {
    if (!dragCol) return;
    const delta = e.clientX - dragStartX;
    setColWidths(w => ({ ...w, [dragCol]: Math.max(60, dragStartWidth + delta) }));
  };
  const handleDragEnd = () => {
    setDragCol(null);
    document.body.style.cursor = '';
  };
  useEffect(() => {
    if (dragCol) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [dragCol]);

  // 排序
  const handleSort = (col) => {
    setSortState(s => {
      if (s.field === col) {
        return { field: col, order: s.order === 'asc' ? 'desc' : 'asc' };
      } else {
        return { field: col, order: 'asc' };
      }
    });
  };
  let sortedData = [...filteredData];
  if (sortState.field) {
    sortedData.sort((a, b) => {
      const v1 = a[sortState.field] || '';
      const v2 = b[sortState.field] || '';
      if (v1 === v2) return 0;
      if (sortState.order === 'asc') return v1 > v2 ? 1 : -1;
      return v1 < v2 ? 1 : -1;
    });
  }

  // 批量操作
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(new Set(sortedData.map((_, idx) => idx)));
    } else {
      setSelectedRows(new Set());
    }
  };
  const handleSelectRow = (idx, checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(idx);
    } else {
      newSelected.delete(idx);
    }
    setSelectedRows(newSelected);
  };
  const handleBatchDelete = () => {
    if (selectedRows.size === 0) return;
    if (confirm(`确定要删除选中的 ${selectedRows.size} 个工作流吗？`)) {
      // 这里应该调用API删除
      console.log('批量删除:', Array.from(selectedRows).map(idx => sortedData[idx].name));
      setSelectedRows(new Set());
    }
  };
  const handleBatchPublish = () => {
    if (selectedRows.size === 0) return;
    console.log('批量发布:', Array.from(selectedRows).map(idx => sortedData[idx].name));
    setSelectedRows(new Set());
  };
  const handleBatchExport = () => {
    if (selectedRows.size === 0) return;
    const data = Array.from(selectedRows).map(idx => sortedData[idx]);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflows_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 搜索和分页
  const filteredBySearch = sortedData.filter(row => 
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.system.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredBySearch.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const paginatedData = filteredBySearch.slice(startIdx, endIdx);

  return (
    <div className="workflow-home">
      {/* 我的收藏入口 */}
      <div className="favorite-bar">
        <span className="favorite-title" onClick={()=>setFavoriteVisible(v=>!v)}>
          我的收藏
          <span className="favorite-arrow">{favoriteVisible ? '▲' : '▼'}</span>
        </span>
        {favoriteVisible && (
          <div className="favorite-list">
            {favoriteList.length === 0 ? (
              <div className="favorite-empty">暂无收藏流程</div>
            ) : favoriteList.map(item => (
              <div className="favorite-item" key={item.name} onClick={()=>navigate(`/workflow/${encodeURIComponent(item.name)}`)}>
                <span className="favorite-item-name">{item.name}</span>
                <span className="favorite-item-meta">{item.system} / {item.stage}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 最近使用入口 */}
      <div className="recent-bar">
        <span className="recent-title" onClick={()=>setRecentVisible(v=>!v)}>
          最近使用
          <span className="recent-arrow">{recentVisible ? '▲' : '▼'}</span>
        </span>
        {recentVisible && (
          <div className="recent-list">
            {recentList.length === 0 ? (
              <div className="recent-empty">暂无最近访问流程</div>
            ) : recentList.map(item => (
              <div className="recent-item" key={item.name+item.time} onClick={()=>navigate(`/workflow/${encodeURIComponent(item.name)}`)}>
                <span className="recent-item-name">{item.name}</span>
                <span className="recent-item-meta">{item.system} / {item.stage}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 上半部分：引导流程（含标题、总览、三步） */}
      <GuideSteps />
      {/* 下半部分：工作流列表 */}
      <div className="workflow-list-section">
        <div className="table-header">
          <div className="table-title">
            <h3>工作流列表</h3>
            <span className="table-count">共 {filteredBySearch.length} 条</span>
          </div>
          <div className="table-actions">
            {/* 新建按钮 */}
            <button onClick={handleCreateWorkflow} className="btn btn-primary">
              <span>➕</span> 新建工作流
            </button>
            <button onClick={() => setShowTemplateModal(true)} className="btn btn-secondary">
              <span>📋</span> 从模板创建
            </button>
            {/* 搜索框 */}
            <div className="search-box">
              <input
                type="text"
                placeholder="搜索工作流名称、系统、描述..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            {/* 批量操作 */}
            {selectedRows.size > 0 && (
              <div className="batch-actions">
                <span className="batch-count">已选择 {selectedRows.size} 项</span>
                <button onClick={handleBatchPublish} className="btn btn-primary">批量发布</button>
                <button onClick={handleBatchExport} className="btn btn-secondary">批量导出</button>
                <button onClick={handleBatchDelete} className="btn btn-danger">批量删除</button>
                <button onClick={() => setSelectedRows(new Set())} className="btn btn-text">取消选择</button>
              </div>
            )}
            {/* 列配置 */}
            <button onClick={() => setShowColumnConfig(true)} className="btn btn-outline">
              <span>⚙️</span> 列配置
            </button>
          </div>
        </div>
        {/* 列配置弹窗 */}
        {showColumnConfig && (
          <div className="modal-mask">
            <div className="modal-content" style={{minWidth:320,maxWidth:360}}>
              <div className="modal-header">
                <span style={{fontWeight:'bold',fontSize:16}}>表格列显示配置</span>
                <button className="modal-close" onClick={()=>setShowColumnConfig(false)}>×</button>
              </div>
              <div className="modal-form-row">
                {allColumns.map(col => (
                  <label key={col.dataIndex} style={{display:'flex',alignItems:'center',marginBottom:8}}>
                    <input
                      type="checkbox"
                      checked={visibleCols.includes(col.dataIndex)}
                      onChange={e => {
                        if (e.target.checked) {
                          setVisibleCols(cols => [...cols, col.dataIndex]);
                        } else {
                          setVisibleCols(cols => cols.filter(c => c !== col.dataIndex));
                        }
                      }}
                      style={{marginRight:8}}
                    />
                    {col.title}
                  </label>
                ))}
              </div>
              <div style={{marginTop:18,textAlign:'right'}}>
                <button className="modal-template-btn" onClick={()=>setShowColumnConfig(false)}>完成</button>
              </div>
            </div>
          </div>
        )}
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
              <th style={{ width: 50, minWidth: 50 }}>
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onChange={e => handleSelectAll(e.target.checked)}
                />
              </th>
              {columns.map(col => (
                <th
                  key={col.dataIndex}
                  style={{ width: colWidths[col.dataIndex], minWidth: 60, position: 'relative', userSelect: 'none' }}
                >
                  <span
                    className={['sortable-th', sortState.field === col.dataIndex ? 'active' : ''].join(' ')}
                    onClick={() => handleSort(col.dataIndex)}
                    style={{ cursor: 'pointer' }}
                  >
                    {col.title}
                    {sortState.field === col.dataIndex && (
                      <span className="sort-arrow">{sortState.order === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </span>
                  <span
                    className="col-resizer"
                    onMouseDown={e => handleDragStart(col.dataIndex, e)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={startIdx + idx} className={selectedRows.has(startIdx + idx) ? 'selected' : ''}>
                <td style={{ width: 50, minWidth: 50 }}>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(startIdx + idx)}
                    onChange={e => handleSelectRow(startIdx + idx, e.target.checked)}
                  />
                </td>
                {columns.map(col => {
                  if (col.dataIndex === 'name') return <td key={col.dataIndex} style={{ width: colWidths[col.dataIndex], minWidth: 60 }}>{renderName(row)}</td>;
                  if (col.dataIndex === 'status') return <td key={col.dataIndex} style={{ width: colWidths[col.dataIndex], minWidth: 60 }}>{renderStatus(row.status)}</td>;
                  if (col.dataIndex === 'actions') return <td key={col.dataIndex} style={{ width: colWidths[col.dataIndex], minWidth: 60 }}>{renderActions(row)}</td>;
                  return <td key={col.dataIndex} style={{ width: colWidths[col.dataIndex], minWidth: 60 }}>{row[col.dataIndex]}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 分页组件 */}
        <div className="pagination">
          <div className="pagination-info">
            第 {startIdx + 1}-{Math.min(endIdx, filteredBySearch.length)} 条，共 {filteredBySearch.length} 条
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="btn btn-outline"
            >
              首页
            </button>
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className="btn btn-outline"
            >
              上一页
            </button>
            <span className="page-info">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-outline"
            >
              下一页
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="btn btn-outline"
            >
              末页
            </button>
          </div>
          <div className="page-size">
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
              <option value={5}>5条/页</option>
              <option value={10}>10条/页</option>
              <option value={20}>20条/页</option>
              <option value={50}>50条/页</option>
            </select>
          </div>
        </div>
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
      {/* 新建工作流定义面板 */}
      {showWorkflowDefModal && (
        <div className="modal-mask">
          <div className="modal-content" style={{minWidth: 420, maxWidth: 480}}>
            <div className="modal-header">
              <span style={{fontWeight:'bold',fontSize:18}}>新建工作流</span>
              <button className="modal-close" onClick={() => setShowWorkflowDefModal(false)}>×</button>
            </div>
            <div className="modal-form-row">
              <label>工作流名称</label>
              <input
                value={workflowDefForm.name}
                onChange={e => setWorkflowDefForm(f => ({...f, name: e.target.value}))}
                placeholder="请输入工作流名称"
              />
            </div>
            <div className="modal-form-row">
              <label>工作流信息</label>
              <textarea
                value={workflowDefForm.desc}
                onChange={e => setWorkflowDefForm(f => ({...f, desc: e.target.value}))}
                placeholder="请输入工作流描述"
              />
            </div>
            <div className="modal-form-row">
              <label>工作流阶段</label>
              <select
                value={workflowDefForm.stage}
                onChange={e => setWorkflowDefForm(f => ({...f, stage: e.target.value}))}
              >
                {phaseList.filter(p => p !== '全部').map(phase => (
                  <option key={phase} value={phase}>{phase}</option>
                ))}
              </select>
            </div>
            <div style={{marginTop: 24, textAlign: 'right'}}>
              <button className="modal-template-btn" style={{marginRight: 12}} onClick={() => setShowWorkflowDefModal(false)}>取消</button>
              <button
                className="modal-template-btn"
                onClick={() => {
                  setShowWorkflowDefModal(false);
                  setShowBpmnModal(false);
                  setSelectedTemplate(null);
                  onCreateWorkflow(workflowDefForm);
                }}
                disabled={!workflowDefForm.name.trim()}
              >确认</button>
            </div>
          </div>
        </div>
      )}

      {/* 发布确认对话框 */}
      {publishConfirm.show && (
        <div className="modal-mask">
          <div className="modal-content" style={{minWidth: 400, maxWidth: 480}}>
            <div className="modal-header">
              <span style={{fontWeight:'bold',fontSize:18}}>发布确认</span>
              <button className="modal-close" onClick={cancelPublish}>×</button>
            </div>
            <div style={{padding: '20px 0'}}>
              <div style={{marginBottom: 16, fontSize: 16, color: '#262626'}}>
                确定要发布工作流吗？
              </div>
              <div style={{background: '#f5f5f5', padding: 16, borderRadius: 6, marginBottom: 16}}>
                <div style={{fontWeight: 500, marginBottom: 8}}>工作流信息：</div>
                <div style={{color: '#666', fontSize: 14}}>
                  <div><strong>名称：</strong>{publishConfirm.workflow?.name}</div>
                  <div><strong>系统：</strong>{publishConfirm.workflow?.system}</div>
                  <div><strong>阶段：</strong>{publishConfirm.workflow?.stage}</div>
                  <div><strong>当前状态：</strong>{publishConfirm.workflow?.status}</div>
                </div>
              </div>
              <div style={{color: '#ff4d4f', fontSize: 14}}>
                ⚠️ 发布后工作流将变为可执行状态，请确认工作流设计已完成。
              </div>
            </div>
            <div style={{marginTop: 24, textAlign: 'right'}}>
              <button className="modal-template-btn" style={{marginRight: 12}} onClick={cancelPublish}>取消</button>
              <button
                className="modal-template-btn"
                style={{background: '#52c41a', color: 'white'}}
                onClick={confirmPublish}
              >确认发布</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { models as initialModels } from './data';
import { users as userList } from './data';
import ModelOverviewPage from './components/ModelOverviewPage';
// We will create and import other pages later
import ModelDetailPage from './components/ModelDetailPage';
import UploadPage from './components/UploadPage';
import PermissionManagementPage from './components/PermissionManagementPage';
import VersionManagementPage from './components/VersionManagementPage';
import ReviewPanel from './components/ReviewPanel';
import ReferenceInfoPage from './components/ReferenceInfoPage';
import ReviewManagementPage from './components/ReviewManagementPage';
import logo from './MMP_logo.png';
import userIcon from './user_icon.avif';
import { FaBell } from 'react-icons/fa';

const STAGES = ['Draft', 'StaticCheck', 'TechnicalReview', 'QATesting', 'Published'];

// 消息通知数据结构
const initialNotifications = [
  {
    id: 'msg001',
    type: 'review',
    title: '模型发布审核通过',
    content: '你发布的模型"EngineControl_V2"已通过审核，现已公开。',
    time: '2024-06-01 10:23',
    read: false,
    link: '/model/M001'
  },
  {
    id: 'msg002',
    type: 'review',
    title: '模型发布被驳回',
    content: '你发布的模型"BatteryThermalModel"未通过审核，请查看驳回说明。',
    time: '2024-06-01 09:50',
    read: false,
    link: '/model/M002'
  },
  {
    id: 'msg003',
    type: 'system',
    title: '平台升级公告',
    content: '平台将于6月5日凌晨进行升级维护。',
    time: '2024-05-31 18:00',
    read: true,
    link: ''
  }
];

function App() {
  // 初始化时优先从 localStorage 读取 models
  const getInitialModels = () => {
    try {
      const stored = localStorage.getItem('models');
      if (stored) return JSON.parse(stored);
    } catch (e) { console.error('读取本地模型数据失败', e); }
    return initialModels;
  };
  const [currentPage, setCurrentPage] = useState('overview');
  const [models, setModelsRaw] = useState(getInitialModels());
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedModelForVersions, setSelectedModelForVersions] = useState(null);
  const [showManagementDropdown, setShowManagementDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState('Bob');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [reviewTasks, setReviewTasks] = useState([]);
  const [targetModelId, setTargetModelId] = useState(null);
  // 调试面板拖动相关
  const [debugPos, setDebugPos] = useState({ right: 0, bottom: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, right: 0, bottom: 0 });

  const userNames = userList.map(u => u.name);

  // setModels 包装，自动同步 localStorage
  const setModels = (updater) => {
    setModelsRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem('models', JSON.stringify(next)); } catch (e) { console.error('写入本地模型数据失败', e); }
      console.log('setModels后 models:', next);
      return next;
    });
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setSelectedModel(null); // Reset selected model when changing pages
    setShowManagementDropdown(false);
  };

  const handleSelectModel = (model) => {
    setSelectedModel(model);
    setCurrentPage('detail');
  };

  const handleManageVersions = (model) => {
    setSelectedModelForVersions(model);
    setCurrentPage('versions');
  };

  const handleBackToOverview = () => {
    setCurrentPage('overview');
    setSelectedModel(null);
  };

  const handleAddModel = (newModel) => {
    setModels(prevModels => [newModel, ...prevModels]);
    setCurrentPage('overview');
  };

  const handleUpdateModels = (updatedModels) => {
    setModels(updatedModels);
  };

  const updateModelWorkflow = (modelId, versionNumber, newWorkflowData) => {
    setModels(prevModels => {
      return prevModels.map(m => {
        if (m.id === modelId) {
          const newVersions = m.versions.map(v => {
            if (v.version === versionNumber) {
              return { ...v, workflow: { ...v.workflow, ...newWorkflowData } };
            }
            return v;
          });
          return { ...m, versions: newVersions };
        }
        return m;
      });
    });
  };

  const handleApproveReview = (modelId, versionNumber) => {
    const model = models.find(m => m.id === modelId);
    const version = model.versions.find(v => v.version === versionNumber);
    const { workflow } = version;
    const currentStageIndex = STAGES.indexOf(workflow.currentStage);
    const nextStage = STAGES[currentStageIndex + 1];

    const newHistoryEntry = {
      stage: workflow.currentStage,
      status: 'Passed',
      user: currentUser,
      date: new Date().toISOString(),
      comment: 'Approved.',
    };
    
    updateModelWorkflow(modelId, versionNumber, {
      currentStage: nextStage,
      history: [...workflow.history, newHistoryEntry],
    });
  };

  const handleRejectReview = (modelId, versionNumber, comment) => {
    const model = models.find(m => m.id === modelId);
    const version = model.versions.find(v => v.version === versionNumber);
    const { workflow } = version;

    const newHistoryEntry = {
      stage: workflow.currentStage,
      status: 'Failed',
      user: currentUser,
      date: new Date().toISOString(),
      comment: comment,
    };

    updateModelWorkflow(modelId, versionNumber, {
      currentStage: 'Draft', // Always return to draft on rejection
      history: [...workflow.history, newHistoryEntry],
      actionItems: [comment]
    });
  };

  const handleReview = (id, action, note, reviewer) => {
    setModels(models => models.map(m => {
      if (m.id === id) {
        // 多评审人独立评审
        if (Array.isArray(m.reviewTasks)) {
          const updatedReviewTasks = m.reviewTasks.map(rt => {
            if (rt.reviewer === reviewer && rt.status === 'Pending') {
              return {
                ...rt,
                status: action === 'approve' ? 'Approved' : 'Rejected',
                note: action === 'approve' ? '' : (note ? `${note}  —${reviewer}` : `—${reviewer}`)
              };
            }
            return rt;
          });
          // 判定最终模型状态
          let newStatus = m.status;
          let reviewNote = '';
          if (updatedReviewTasks.some(rt => rt.status === 'Rejected')) {
            newStatus = 'Rejected';
            reviewNote = updatedReviewTasks.filter(rt => rt.status === 'Rejected').map(rt => rt.note).join('；');
          } else if (updatedReviewTasks.every(rt => rt.status === 'Approved')) {
            newStatus = 'Published';
            reviewNote = '';
          } else {
            newStatus = 'Pending Review';
            reviewNote = '';
          }
          return { ...m, reviewTasks: updatedReviewTasks, status: newStatus, reviewNote };
        }
        // 兼容无reviewTasks的老模型
        if (action === 'approve') {
          return { ...m, status: 'Published', permission: 'Public', reviewNote: '' };
        } else {
          const formattedNote = note ? `${note}  —${reviewer}` : `—${reviewer}`;
          return { ...m, status: 'Rejected', permission: 'Private', reviewNote: formattedNote };
        }
      }
      return m;
    }));
  };

  const handleAddReviewTaskNotification = (model, reviewers) => {
    reviewers.forEach(reviewerId => {
      const reviewer = userList.find(u => u.id === reviewerId);
      if (reviewer) {
        setNotifications(prev => [
          {
            id: `task_${model.id}_${reviewerId}_${Date.now()}`,
            type: 'review-task',
            title: '新的模型评审任务',
            content: `你有一个新的模型评审任务：${model.name}，请及时处理。`,
            time: new Date().toLocaleString(),
            read: false,
            link: `/review-management?modelId=${model.id}`,
            receiver: reviewer.name,
            modelId: model.id,
          },
          ...prev
        ]);
      }
    });
  };

  const handleDragStart = (e) => {
    setDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      right: debugPos.right,
      bottom: debugPos.bottom
    };
    e.preventDefault();
  };
  const handleDrag = (e) => {
    if (!dragging) return;
    const dx = dragStart.current.x - e.clientX;
    const dy = dragStart.current.y - e.clientY;
    setDebugPos({
      right: Math.max(0, dragStart.current.right + dx),
      bottom: Math.max(0, dragStart.current.bottom + dy)
    });
  };
  const handleDragEnd = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [dragging]);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <ModelOverviewPage models={models} setModels={setModels} onSelectModel={handleSelectModel} onManageVersions={handleManageVersions} currentUser={currentUser} onAddReviewTaskNotification={handleAddReviewTaskNotification} />;
      case 'detail':
        return <ModelDetailPage 
                  model={selectedModel} 
                  allModels={models}
                  currentUser={currentUser}
                  onBack={handleBackToOverview} 
                  onManageVersions={handleManageVersions}
                  onApprove={handleApproveReview}
                  onReject={handleRejectReview}
                />;
      case 'upload':
        return <UploadPage onAddModel={handleAddModel} onBack={handleBackToOverview} currentUser={currentUser} />;
      case 'permissions':
        return <PermissionManagementPage />;
      case 'versions': {
        // 优先选中当前用户可编辑的模型
        const editableModel = models.find(m => m.uploader === currentUser || (userList.find(u => u.name === currentUser)?.role === 'admin'));
        const safeModel = selectedModelForVersions || editableModel || models[0] || null;
        return <VersionManagementPage model={safeModel} models={models} currentUser={currentUser} currentRole={userList.find(u => u.name === currentUser)?.role} onUpdateModels={handleUpdateModels} />;
      }
      case 'review':
        return <ReviewPanel models={models} onReview={handleReview} targetModelId={targetModelId} />;
      case 'references':
        return <ReferenceInfoPage />;
      case 'review-management':
        return <ReviewManagementPage reviewTasks={reviewTasks} currentUser={currentUser} targetModelId={targetModelId} />;
      default:
        return <ModelOverviewPage models={models} onSelectModel={handleSelectModel} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-left">
          <img src={logo} alt="MMP Logo" className="mmp-logo" />
          <span className="product-title">Model Management Platform</span>
        </div>
        <nav>
          <button onClick={() => navigateTo('overview')} className={currentPage === 'overview' ? 'active' : ''}>
            模型总览
          </button>
          <button onClick={() => navigateTo('upload')} className={currentPage === 'upload' ? 'active' : ''}>
            上传/注册模型
          </button>
          <div className="dropdown" onMouseEnter={() => setShowManagementDropdown(true)} onMouseLeave={() => setShowManagementDropdown(false)}>
            <button className="dropdown-toggle">
              管理
            </button>
            {showManagementDropdown && (
              <div className="dropdown-menu">
                {currentUser.toLowerCase() === 'frank' && (
                  <button onClick={() => navigateTo('permissions')}>权限管理</button>
                )}
                <button onClick={() => navigateTo('versions')}>版本管理</button>
                <button onClick={() => navigateTo('review')}>评审面板</button>
                <button onClick={() => navigateTo('references')}>引用信息</button>
              </div>
            )}
          </div>
        </nav>
        <div className="header-right">
          {/* 消息通知铃铛 */}
          <div className="notification-bell" style={{ position: 'relative', marginRight: '18px', cursor: 'pointer' }} onClick={() => setShowNotificationDropdown(v => !v)}>
            <FaBell size={22} color="#007bff" />
            {notifications.filter(n =>
              (
                (n.type === 'review-task' && n.receiver === currentUser) ||
                (n.type !== 'review-task' && n.content && n.content.includes('Frank'))
              ) && !n.read
            ).length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#e74c3c',
                color: '#fff',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}>{notifications.filter(n =>
                (
                  (n.type === 'review-task' && n.receiver === currentUser) ||
                  (n.type !== 'review-task' && n.content && n.content.includes('Frank'))
                ) && !n.read
              ).length}</span>
            )}
            {showNotificationDropdown && (
              <div className="notification-dropdown" style={{
                position: 'absolute',
                right: 0,
                top: '32px',
                background: '#fff',
                border: '1px solid #e1e4e8',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                minWidth: '320px',
                zIndex: 2000,
                padding: '0.5rem 0',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <div style={{padding: '0.5rem 1rem', borderBottom: '1px solid #f0f1f2', fontWeight: 600, color: '#232b36'}}>消息通知</div>
                {notifications.filter(n =>
                  (n.type === 'review-task' && n.receiver === currentUser)
                  || (n.type !== 'review-task' && n.content && n.content.includes('Frank'))
                ).length === 0 && <div style={{padding: '1rem', color: '#888'}}>暂无通知</div>}
                {notifications.filter(n =>
                  (n.type === 'review-task' && n.receiver === currentUser)
                  || (n.type !== 'review-task' && n.content && n.content.includes('Frank'))
                ).map(n => (
                  <div key={n.id} style={{
                    padding: '0.7rem 1rem',
                    background: n.read ? '#fff' : '#eaf5ff',
                    borderBottom: '1px solid #f0f1f2',
                    cursor: 'pointer',
                    fontWeight: n.read ? 400 : 600
                  }}
                    onClick={() => {
                      setNotifications(list => list.map(msg => msg.id === n.id ? { ...msg, read: true } : msg));
                      setShowNotificationDropdown(false);
                      if (n.type === 'review-task') {
                        setCurrentPage('review');
                        setTargetModelId(n.modelId);
                      } else if (n.link) {
                        window.location.hash = n.link;
                      }
                    }}
                  >
                    <div style={{fontSize: '1em', color: n.read ? '#232b36' : '#007bff'}}>{n.title}</div>
                    <div style={{fontSize: '0.95em', color: '#666', margin: '2px 0 0 0'}}>{n.content}</div>
                    <div style={{fontSize: '0.85em', color: '#aaa', marginTop: 2}}>{n.time}</div>
                  </div>
                ))}
                <div style={{padding: '0.5rem 1rem', textAlign: 'right'}}>
                  <button style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '0.98em'}}
                    onClick={() => setNotifications(list => list.map(msg => ({ ...msg, read: true })))}>
                    全部标为已读
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="user-menu" onClick={() => setUserMenuOpen(v => !v)}>
            <img src={userIcon} alt="user" className="user-icon" />
            <span className="user-name">{currentUser}</span>
            <span className="user-role">({(userList.find(u => u.name === currentUser) || {}).role})</span>
          </div>
          {userMenuOpen && (
            <div className="user-dropdown">
              {userNames.map(name => (
                <div key={name} className="user-dropdown-item" onClick={() => {
                  setCurrentUser(name);
                  setUserMenuOpen(false);
                  // 自动跳转到评审面板并高亮当前用户的第一个待评审模型
                  const firstPending = models.find(m => Array.isArray(m.reviewTasks) && m.reviewTasks.some(rt => rt.reviewer === name && rt.status === 'Pending'));
                  setCurrentPage('review');
                  setTargetModelId(firstPending ? firstPending.id : null);
                }}>
                  <img src={userIcon} alt="user" className="user-icon-mini" />
                  <span>{name}（{(userList.find(u => u.name === name) || {}).role}）</span>
                </div>
              ))}
              <div className="user-dropdown-item logout" onClick={() => { setCurrentUser(''); setUserMenuOpen(false); }}>
                退出登录
              </div>
            </div>
          )}
        </div>
      </header>
      <main>
        {renderPage()}
      </main>
      <footer className="App-footer">
        <p>© 2023 MMP Demo</p>
      </footer>
      {/* 开发者调试面板：可拖动 */}
      <div
        style={{
          position: 'fixed',
          right: debugPos.right,
          bottom: debugPos.bottom,
          width: '480px',
          maxHeight: '60vh',
          background: 'rgba(0,0,0,0.85)',
          color: '#fff',
          fontSize: '12px',
          zIndex: 9999,
          overflow: 'auto',
          borderTopLeftRadius: '8px',
          padding: '8px',
          fontFamily: 'monospace',
          boxShadow: '0 0 8px #0008',
          cursor: dragging ? 'move' : 'default',
          userSelect: dragging ? 'none' : 'auto',
        }}
      >
        <div
          style={{fontWeight:700,marginBottom:4,cursor:'move',background:'#222',padding:'2px 8px',borderRadius:'4px'}}
          onMouseDown={handleDragStart}
        >开发者调试面板 models</div>
        <div style={{marginBottom:4}}>currentUser: <span style={{color:'#ffd700'}}>{JSON.stringify(currentUser)}</span></div>
        <pre style={{whiteSpace:'pre-wrap',wordBreak:'break-all',margin:0}}>{JSON.stringify(models, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;

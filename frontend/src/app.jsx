import React, { useState } from 'react';
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
import logo from './MMP_logo.png';
import userIcon from './user_icon.avif';
import { FaBell } from 'react-icons/fa';

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
  const [currentPage, setCurrentPage] = useState('overview');
  const [models, setModels] = useState(initialModels);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedModelForVersions, setSelectedModelForVersions] = useState(null);
  const [showManagementDropdown, setShowManagementDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState('Bob');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const userNames = Object.keys(userList);

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

  const handleReview = (id, action, note) => {
    setModels(models => models.map(m => {
      if (m.id === id) {
        if (action === 'approve') {
          return { ...m, status: 'Published', permission: 'Public', reviewNote: '' };
        } else {
          return { ...m, status: 'Rejected', permission: 'Private', reviewNote: note || '发布未成功' };
        }
      }
      return m;
    }));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <ModelOverviewPage models={models} setModels={setModels} onSelectModel={handleSelectModel} onManageVersions={handleManageVersions} currentUser={currentUser} />;
      case 'detail':
        return <ModelDetailPage model={selectedModel} onBack={handleBackToOverview} />;
      case 'upload':
        return <UploadPage onAddModel={handleAddModel} onBack={handleBackToOverview} currentUser={currentUser} />;
      case 'permissions':
        return <PermissionManagementPage />;
      case 'versions':
        return <VersionManagementPage model={selectedModelForVersions} models={models} />;
      case 'review':
        return <ReviewPanel models={models} onReview={handleReview} />;
      case 'references':
        return <ReferenceInfoPage />;
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
                <button onClick={() => navigateTo('permissions')}>权限管理</button>
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
            {notifications.some(n => !n.read) && (
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
              }}>{notifications.filter(n => !n.read).length}</span>
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
                {notifications.length === 0 && <div style={{padding: '1rem', color: '#888'}}>暂无通知</div>}
                {notifications.map(n => (
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
                      if (n.link) window.location.hash = n.link;
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
            <span className="user-role">({userList[currentUser].role})</span>
          </div>
          {userMenuOpen && (
            <div className="user-dropdown">
              {userNames.map(name => (
                <div key={name} className="user-dropdown-item" onClick={() => { setCurrentUser(name); setUserMenuOpen(false); }}>
                  <img src={userIcon} alt="user" className="user-icon-mini" />
                  <span>{name}（{userList[name].role}）</span>
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
    </div>
  );
}

export default App;

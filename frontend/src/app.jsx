import React, { useState } from 'react';
import './App.css';
import { models as initialModels } from './data';
import ModelOverviewPage from './components/ModelOverviewPage';
// We will create and import other pages later
import ModelDetailPage from './components/ModelDetailPage';
import UploadPage from './components/UploadPage';
import PermissionManagementPage from './components/PermissionManagementPage';
import VersionManagementPage from './components/VersionManagementPage';
import ReviewPanel from './components/ReviewPanel';
import ReferenceInfoPage from './components/ReferenceInfoPage';

function App() {
  const [currentPage, setCurrentPage] = useState('overview');
  const [models, setModels] = useState(initialModels);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showManagementDropdown, setShowManagementDropdown] = useState(false);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setSelectedModel(null); // Reset selected model when changing pages
    setShowManagementDropdown(false);
  };

  const handleSelectModel = (model) => {
    setSelectedModel(model);
    setCurrentPage('detail');
  };

  const handleBackToOverview = () => {
    setCurrentPage('overview');
    setSelectedModel(null);
  };

  const handleAddModel = (newModel) => {
    setModels(prevModels => [newModel, ...prevModels]);
    setCurrentPage('overview');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <ModelOverviewPage models={models} onSelectModel={handleSelectModel} />;
      case 'detail':
        return <ModelDetailPage model={selectedModel} onBack={handleBackToOverview} />;
      case 'upload':
        return <UploadPage onAddModel={handleAddModel} onBack={handleBackToOverview} />;
      case 'permissions':
        return <PermissionManagementPage />;
      case 'versions':
        return <VersionManagementPage />;
      case 'review':
        return <ReviewPanel />;
      case 'references':
        return <ReferenceInfoPage />;
      default:
        return <ModelOverviewPage models={models} onSelectModel={handleSelectModel} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>模型管理平台 (MMP)</h1>
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

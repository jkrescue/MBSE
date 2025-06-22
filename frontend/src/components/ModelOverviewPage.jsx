import React, { useState, useMemo, useEffect } from 'react';
import { FaTable, FaThLarge, FaCog, FaStar, FaRegStar, FaAward } from 'react-icons/fa';
import './ModelOverviewPage.css';
import { modelTypes, allTags, statusOptions, users as userList } from '../data';
import ModelCard from './ModelCard';
import AdvancedSearchModal from './AdvancedSearchModal';
import DependencyModal from './DependencyModal';
import ReviewConfigModal from './ReviewConfigModal';

function ModelOverviewPage({ models, setModels, onSelectModel, onManageVersions, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortColumn, setSortColumn] = useState('uploadDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedModels, setSelectedModels] = useState(new Set());
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [columns, setColumns] = useState([
    { key: 'name', label: '模型名称', visible: true },
    { key: 'type', label: '类型', visible: true },
    { key: 'description', label: '描述', visible: true },
    { key: 'uploader', label: '上传者', visible: true },
    { key: 'uploadDate', label: '上传时间', visible: true },
    { key: 'status', label: '状态', visible: true },
    { key: 'permission', label: '权限', visible: false },
    { key: 'versions', label: '版本', visible: true },
    { key: 'project', label: '所属项目', visible: true },
    { key: 'dependencies', label: '依赖关系', visible: true },
    { key: 'rating', label: '评级', visible: true },
  ]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState([]);
  const [savedViews, setSavedViews] = useState([]);
  const [currentView, setCurrentView] = useState('none');
  const [isDependencyModalOpen, setIsDependencyModalOpen] = useState(false);
  const [selectedModelForDeps, setSelectedModelForDeps] = useState(null);
  const [showReviewConfigModal, setShowReviewConfigModal] = useState(false);
  const [pendingPublishModel, setPendingPublishModel] = useState(null);

  const systemViews = useMemo(() => [
    { name: "我待评审的模型", filters: { advancedFilters: [[{field: 'uploader', value: currentUser}, {field: 'status', value: 'Pending Review'}]] } },
    { name: "动力总成-核心模型", filters: { advancedFilters: [[{field: 'tags', value: 'Engine'}, {field: 'tags', value: 'Control System'}]] } },
  ], [currentUser]);

  useEffect(() => {
    try {
      const storedViews = JSON.parse(localStorage.getItem('modelSavedViews')) || [];
      setSavedViews(storedViews);
    } catch (error) {
      console.error("Failed to load saved views from localStorage", error);
      setSavedViews([]);
    }
  }, []);

  const saveViewsToStorage = (views) => {
    try {
      localStorage.setItem('modelSavedViews', JSON.stringify(views));
    } catch (error) {
      console.error("Failed to save views to localStorage", error);
    }
  };

  const handleSaveView = () => {
    const viewName = prompt("请输入视图名称：");
    if (!viewName) return;

    const currentFilters = {
      searchTerm,
      selectedType,
      selectedStatus,
      selectedTags,
      advancedFilters,
      sortColumn,
      sortDirection,
    };

    const newView = { name: viewName, filters: currentFilters };
    const updatedViews = [...savedViews, newView];
    setSavedViews(updatedViews);
    saveViewsToStorage(updatedViews);
    setCurrentView(viewName);
    alert(`视图 "${viewName}" 已保存！`);
  };

  const handleApplyView = (viewName) => {
    setCurrentView(viewName);
    if (viewName === 'none') {
      handleClearAdvancedFilters(); // Essentially resets to default
      return;
    }

    const allViews = [...systemViews, ...savedViews];
    const viewToApply = allViews.find(v => v.name === viewName);

    if (viewToApply) {
      const { filters } = viewToApply;
      setSearchTerm(filters.searchTerm || '');
      setSelectedType(filters.selectedType || 'All Types');
      setSelectedStatus(filters.selectedStatus || 'All Statuses');
      setSelectedTags(filters.selectedTags || []);
      setAdvancedFilters(filters.advancedFilters || []);
      setSortColumn(filters.sortColumn || 'uploadDate');
      setSortDirection(filters.sortDirection || 'desc');
    }
  };

  const handleDeleteView = (viewName) => {
    if (!window.confirm(`确定要删除视图 "${viewName}" 吗？`)) return;
    const updatedViews = savedViews.filter(v => v.name !== viewName);
    setSavedViews(updatedViews);
    saveViewsToStorage(updatedViews);
    if (currentView === viewName) {
      setCurrentView('none'); // Reset dropdown if the current view is deleted
    }
  }

  const handleOpenDependencyModal = (model) => {
    setSelectedModelForDeps(model);
    setIsDependencyModalOpen(true);
  };

  const handleToggleRecommend = (modelId) => {
    setModels(currentModels =>
      currentModels.map(m =>
        m.id === modelId ? { ...m, isRecommended: !m.isRecommended } : m
      )
    );
  };

  const dependencyMetrics = useMemo(() => {
    const reverseDepMap = new Map();
    // First, populate the reverse dependency map
    models.forEach(model => {
      model.versions?.forEach(version => {
        version.dependencies?.forEach(dep => {
          reverseDepMap.set(dep.modelId, (reverseDepMap.get(dep.modelId) || 0) + 1);
        });
      });
    });

    // Then, create the metrics object for each model
    const metrics = {};
    models.forEach(model => {
      const forwardDeps = new Set(model.versions?.flatMap(v => v.dependencies?.map(d => d.modelId)) || []);
      metrics[model.id] = {
        forward: forwardDeps.size,
        reverse: reverseDepMap.get(model.id) || 0,
      };
    });
    return metrics;
  }, [models]);

  const checkCondition = (model, condition) => {
    const { field, value } = condition;
    const modelValue = model[field];
    const lowerCaseValue = value.toLowerCase();

    if (modelValue === undefined) return false;

    // Handle different field types
    if (field === 'tags' || field === 'projectReferences') {
      // Array fields
      return Array.isArray(modelValue) && modelValue.some(item => item.toLowerCase().includes(lowerCaseValue));
    } else if (typeof modelValue === 'string') {
      // String fields
      return modelValue.toLowerCase().includes(lowerCaseValue);
    } else if (typeof modelValue === 'number') {
      // Number fields (if any)
      return modelValue.toString().toLowerCase() === lowerCaseValue;
    }
    return false;
  };

  // Memoize model lists to prevent re-filtering on every render
  const publicModels = useMemo(() => models.filter(model => model.permission === 'Public'), [models]);
  const personalModels = useMemo(() => models.filter(model => model.uploader === currentUser && (model.status === 'Draft' || model.status === 'Pending Review' || model.status === 'Rejected')), [models, currentUser]);

  // Memoize the filtering and sorting logic
  const processModels = (modelList) => {
    let filtered;

    if (advancedFilters.length > 0) {
      // Advanced filtering logic
      filtered = modelList.filter(model => {
        // OR logic between groups
        return advancedFilters.some(group => {
          // AND logic within a group
          return group.every(condition => checkCondition(model, condition));
        });
      });
    } else {
      // Original simple filtering logic
      filtered = modelList.filter(model => {
        const searchMatch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) || model.description.toLowerCase().includes(searchTerm.toLowerCase());
        const typeMatch = selectedType === 'All Types' || model.type === selectedType;
        const statusMatch = selectedStatus === 'All Statuses' || model.status === selectedStatus;
        const tagsMatch = selectedTags.length === 0 || selectedTags.every(tag => model.tags && model.tags.includes(tag));
        return searchMatch && typeMatch && statusMatch && tagsMatch;
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const processedPublicModels = useMemo(() => processModels(publicModels), [publicModels, searchTerm, selectedType, selectedStatus, selectedTags, sortColumn, sortDirection, advancedFilters]);
  const processedPersonalModels = useMemo(() => processModels(personalModels), [personalModels, searchTerm, selectedType, selectedStatus, selectedTags, sortColumn, sortDirection, advancedFilters]);

  const handleApplyAdvancedFilters = (filters) => {
    setAdvancedFilters(filters);
    // Reset simple filters when advanced are applied
    setSearchTerm('');
    setSelectedType('All Types');
    setSelectedStatus('All Statuses');
    setSelectedTags([]);
  };

  const handleClearAdvancedFilters = () => {
    setAdvancedFilters([]);
    setCurrentView('none'); // Also reset the view selector
  }

  const handlePublish = (model) => {
    if (!window.confirm('确定要发布该模型到公共模型库吗？发布后将进入评审流程。')) return;
    const updatedModel = { ...model, permission: 'Public', status: 'Pending Review', reviewNote: '' };
    setModels(models => models.map(m => m.id === model.id ? updatedModel : m));
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const renderSortArrow = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const handleTagChange = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSelectOne = (modelId) => {
    setSelectedModels(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(modelId)) {
        newSelection.delete(modelId);
      } else {
        newSelection.add(modelId);
      }
      return newSelection;
    });
  };

  const handleSelectAll = (modelList) => {
    // 如果当前已全选，则清空
    if (selectedModels.size === modelList.length) {
      setSelectedModels(new Set());
    } else {
      const allIds = new Set(modelList.map(m => m.id));
      setSelectedModels(allIds);
    }
  };

  const handleBulkDelete = () => {
    if (!window.confirm(`确定要删除选中的 ${selectedModels.size} 个模型吗？此操作不可恢复。`)) return;
    const updatedModels = models.filter(m => !selectedModels.has(m.id));
    setModels(updatedModels);
    setSelectedModels(new Set());
  };

  const handleBulkPublish = () => {
    if (!window.confirm(`确定要发布选中的 ${selectedModels.size} 个模型吗？`)) return;
    const updatedModels = models.map(m => {
      if (selectedModels.has(m.id) && (m.status === 'Draft' || m.status === 'Rejected')) {
        return { ...m, permission: 'Public', status: 'Pending Review', reviewNote: '' };
      }
      return m;
    });
    setModels(updatedModels);
    setSelectedModels(new Set());
  };

  const toggleColumnVisibility = (key) => {
    setColumns(currentColumns =>
      currentColumns.map(col =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const renderTableView = (modelList, isPersonal) => (
    <table className="models-table">
      <thead>
        <tr>
          <th><input type="checkbox" onChange={() => handleSelectAll(modelList)} checked={modelList.length > 0 && selectedModels.size === modelList.length} /></th>
          {columns.map(col => col.visible && (
            <th key={col.key} onClick={() => handleSort(col.key)}>{col.label}{renderSortArrow(col.key)}</th>
          ))}
          <th>操作</th>
          {isPersonal && <th>说明</th>}
        </tr>
      </thead>
      <tbody>
        {modelList.map(model => (
          <tr key={model.id} className={selectedModels.has(model.id) ? 'selected-row' : ''}>
            <td><input type="checkbox" checked={selectedModels.has(model.id)} onChange={() => handleSelectOne(model.id)} /></td>
            {columns.find(c => c.key === 'name' && c.visible) && <td onClick={() => onSelectModel(model)} className="model-name-link">{model.name} {model.isRecommended && <FaAward className="recommended-icon" title="官方推荐" />}</td>}
            {columns.find(c => c.key === 'type' && c.visible) && <td onClick={() => onSelectModel(model)}>{model.type}</td>}
            {columns.find(c => c.key === 'description' && c.visible) && <td onClick={() => onSelectModel(model)}>{model.description}</td>}
            {columns.find(c => c.key === 'uploader' && c.visible) && <td onClick={() => onSelectModel(model)}>{model.uploader}</td>}
            {columns.find(c => c.key === 'uploadDate' && c.visible) && <td onClick={() => onSelectModel(model)}>{formatDateTime(model.uploadDate)}</td>}
            {columns.find(c => c.key === 'status' && c.visible) && <td><span className={`status-badge ${getStatusClass(model.status)}`}>{model.status}</span></td>}
            {columns.find(c => c.key === 'permission' && c.visible) && <td onClick={() => onSelectModel(model)}>{model.permission}</td>}
            {columns.find(c => c.key === 'versions' && c.visible) && <td onClick={() => onSelectModel(model)}>{model.versions && model.versions.length > 0 ? model.versions[0].version : '-'}</td>}
            {columns.find(c => c.key === 'project' && c.visible) && <td onClick={() => onSelectModel(model)}>{model.projectReferences?.join(', ') || 'N/A'}</td>}
            {columns.find(c => c.key === 'dependencies' && c.visible) && (
              <td onClick={(e) => { e.stopPropagation(); handleOpenDependencyModal(model); }}>
                {`依赖: ${dependencyMetrics[model.id]?.forward || 0}, 被引: ${dependencyMetrics[model.id]?.reverse || 0}`}
              </td>
            )}
            {columns.find(c => c.key === 'rating' && c.visible) && (
              <td onClick={() => onSelectModel(model)}>
                <StarRating rating={model.rating} />
              </td>
            )}
            <td>
              {isPersonal ? (
                 <div style={{ display: 'flex', gap: '8px' }}>
                 <button
                   onClick={e => {
                     e.stopPropagation();
                     if (window.confirm('确定要删除该模型吗？此操作不可恢复。')) {
                       setModels(models => models.filter(m => m.id !== model.id));
                     }
                   }}
                   className="action-button"
                   style={{ backgroundColor: '#e74c3c' }}
                 >
                   删除
                 </button>
                 <button
                   onClick={e => {
                     e.stopPropagation();
                     if (model.status === 'Draft' || model.status === 'Rejected') {
                       setPendingPublishModel(model);
                       setShowReviewConfigModal(true);
                     }
                   }}
                   className="action-button"
                   style={{ backgroundColor: (model.status === 'Draft' || model.status === 'Rejected') ? '#f39c12' : '#ccc', cursor: (model.status === 'Draft' || model.status === 'Rejected') ? 'pointer' : 'not-allowed' }}
                   disabled={!(model.status === 'Draft' || model.status === 'Rejected')}
                 >
                   发布
                 </button>
               </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onManageVersions(model);
                    }}
                    className="action-button"
                  >
                    版本管理
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRecommend(model.id);
                    }}
                    className={`action-button recommend-btn ${model.isRecommended ? 'recommended' : ''}`}
                  >
                    {model.isRecommended ? '取消推荐' : '设为推荐'}
                  </button>
                </div>
              )}
            </td>
            {isPersonal && <td>{model.status === 'Rejected' && (model.reviewNote || '发布未成功')}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderCardView = (modelList) => (
    <div className="card-grid">
      {modelList.map(model => (
        <ModelCard 
          key={model.id}
          model={model}
          onSelectModel={onSelectModel}
          onManageVersions={onManageVersions}
          onSelect={handleSelectOne}
          isSelected={selectedModels.has(model.id)}
        />
      ))}
    </div>
  );

  // 时间格式化函数
  function formatDateTime(dateStr) {
    if (!dateStr) return '';
    // 支持原有日期或带时间的字符串
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const pad = n => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  const renderBulkActions = (modelList) => {
    if (selectedModels.size === 0) return null;

    return (
      <div className="bulk-actions-bar">
        <span>已选择 {selectedModels.size} 项</span>
        <button onClick={handleBulkDelete} className="bulk-action-btn delete">批量删除</button>
        {modelList === personalModels && <button onClick={handleBulkPublish} className="bulk-action-btn publish">批量发布</button>}
      </div>
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Published': return 'status-published';
      case 'Pending Review': return 'status-pending';
      case 'Draft': return 'status-draft';
      case 'Rejected': return 'status-rejected';
      case 'Archived': return 'status-archived';
      default: return '';
    }
  };

  const StarRating = ({ rating = 0, max = 5 }) => {
    const fullStars = Math.floor(rating);
    const emptyStars = max - fullStars;
    return (
      <div className="table-rating">
        {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} className="star filled" />)}
        {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} className="star" />)}
      </div>
    );
  };

  const searchableFields = [
    { key: 'name', label: '模型名称' },
    { key: 'type', label: '类型' },
    { key: 'description', label: '描述' },
    { key: 'uploader', label: '上传者' },
    { key: 'status', label: '状态' },
    { key: 'tags', label: '标签' },
    { key: 'projectReferences', label: '所属项目' },
  ];

  return (
    <div className="model-overview-page">
      <DependencyModal 
        show={isDependencyModalOpen}
        onClose={() => setIsDependencyModalOpen(false)}
        model={selectedModelForDeps}
        allModels={models}
      />
      <AdvancedSearchModal
        show={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onApply={handleApplyAdvancedFilters}
        modelFields={searchableFields}
      />
      <ReviewConfigModal
        visible={showReviewConfigModal}
        onClose={() => setShowReviewConfigModal(false)}
        onSubmit={(config) => {
          console.log('发布配置：', config, '模型：', pendingPublishModel);
          setShowReviewConfigModal(false);
        }}
        reviewers={userList}
      />
      <div className="main-content">
        <div className="filters-container">
          <div className="view-management-container">
            <label htmlFor="view-selector">筛选视图</label>
            <select id="view-selector" value={currentView} onChange={e => handleApplyView(e.target.value)}>
              <option value="none">-- 无视图 --</option>
              <optgroup label="系统视图">
                {systemViews.map(view => <option key={view.name} value={view.name}>{view.name}</option>)}
              </optgroup>
              <optgroup label="我的视图">
                {savedViews.map(view => <option key={view.name} value={view.name}>{view.name}</option>)}
              </optgroup>
            </select>
            <div className="view-actions-buttons">
              <button onClick={handleSaveView} className="save-view-btn">保存当前筛选</button>
              {currentView !== 'none' && !systemViews.some(v => v.name === currentView) && (
                <button onClick={() => handleDeleteView(currentView)} className="delete-view-btn">删除视图</button>
              )}
            </div>
          </div>

          <input
            type="text"
            placeholder="关键词搜索..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="type-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {modelTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <select className="status-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
          <div className="advanced-search-controls">
            <button onClick={() => setShowAdvancedSearch(true)} className="advanced-search-btn">
              高级搜索
            </button>
            {advancedFilters.length > 0 && (
              <button onClick={handleClearAdvancedFilters} className="clear-advanced-btn">
                清除高级筛选
              </button>
            )}
          </div>
          <div className="tags-filter">
            <h4>标签筛选</h4>
            {allTags.map(tag => (
              <span
                key={tag}
                className={`tag-filter-item ${selectedTags.includes(tag) ? 'active' : ''}`}
                onClick={() => handleTagChange(tag)}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="models-container">
          <div className="view-controls">
            <h2>公共模型库</h2>
            <div className="view-actions">
              <div className="column-selector">
                <FaCog onClick={() => setShowColumnSelector(!showColumnSelector)} className="action-icon" />
                {showColumnSelector && (
                  <div className="column-dropdown">
                    {columns.map(col => (
                      <label key={col.key}>
                        <input
                          type="checkbox"
                          checked={col.visible}
                          onChange={() => toggleColumnVisibility(col.key)}
                        />
                        {col.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="view-switch">
                <FaTable className={viewMode === 'table' ? 'active' : ''} onClick={() => setViewMode('table')} />
                <FaThLarge className={viewMode === 'card' ? 'active' : ''} onClick={() => setViewMode('card')} />
              </div>
            </div>
          </div>
          {renderBulkActions(publicModels)}
          {viewMode === 'table' ? renderTableView(processedPublicModels, false) : renderCardView(processedPublicModels)}

          <div className="view-controls" style={{marginTop:'2.5rem'}}>
            <h2>个人模型库</h2>
          </div>
          {renderBulkActions(personalModels)}
          {viewMode === 'table' ? renderTableView(processedPersonalModels, true) : renderCardView(processedPersonalModels)}
        </div>
      </div>
    </div>
  );
}

export default ModelOverviewPage; 
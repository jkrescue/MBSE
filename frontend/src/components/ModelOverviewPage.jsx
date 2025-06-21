import React, { useState } from 'react';
import './ModelOverviewPage.css';
import { modelTypes, allTags, statusOptions } from '../data';

function ModelOverviewPage({ models, setModels, onSelectModel, onManageVersions, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedTags, setSelectedTags] = useState([]);

  // 公共模型库：只显示permission为Public的模型
  const publicModels = models.filter(model => model.permission === 'Public');
  // 个人模型库：显示Draft、Pending Review、Rejected三种状态的模型
  const personalModels = models.filter(model => model.uploader === currentUser && (model.status === 'Draft' || model.status === 'Pending Review' || model.status === 'Rejected'));

  const handlePublish = (model) => {
    if (!window.confirm('确定要发布该模型到公共模型库吗？发布后将进入评审流程。')) return;
    const updatedModel = { ...model, permission: 'Public', status: 'Pending Review', reviewNote: '' };
    setModels(models => models.map(m => m.id === model.id ? updatedModel : m));
  };

  // 过滤逻辑（可扩展到每个库）
  const filterModels = (modelList) => modelList.filter(model => {
    const searchMatch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) || model.description.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = selectedType === 'All Types' || model.type === selectedType;
    const statusMatch = selectedStatus === 'All Statuses' || model.status === selectedStatus;
    const tagsMatch = selectedTags.length === 0 || selectedTags.every(tag => model.tags && model.tags.includes(tag));
    return searchMatch && typeMatch && statusMatch && tagsMatch;
  });

  const handleTagChange = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
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

  return (
    <div className="model-overview-page">
      <div className="filters-container">
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
        <h2>公共模型库</h2>
        <table className="models-table">
          <thead>
            <tr>
              <th>模型名称</th>
              <th>类型</th>
              <th>描述</th>
              <th>上传者</th>
              <th>状态</th>
              <th>权限</th>
              <th>版本</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filterModels(publicModels).map(model => (
              <tr key={model.id}>
                <td onClick={() => onSelectModel(model)} className="model-name-link">{model.name}</td>
                <td onClick={() => onSelectModel(model)}>{model.type}</td>
                <td onClick={() => onSelectModel(model)}>{model.description}</td>
                <td onClick={() => onSelectModel(model)}>{model.uploader}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(model.status)}`}>
                    {model.status}
                  </span>
                </td>
                <td onClick={() => onSelectModel(model)}>{model.permission}</td>
                <td onClick={() => onSelectModel(model)}>{model.versions && model.versions.length > 0 ? model.versions[0].version : '-'}</td>
                <td>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onManageVersions(model);
                    }}
                    className="action-button"
                  >
                    版本管理
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{marginTop:'2.5rem'}}>个人模型库</h2>
        <table className="models-table">
          <thead>
            <tr>
              <th>模型名称</th>
              <th>类型</th>
              <th>描述</th>
              <th>上传者</th>
              <th>状态</th>
              <th>权限</th>
              <th>版本</th>
              <th>操作</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            {filterModels(personalModels).map(model => (
              <tr key={model.id}>
                <td onClick={() => onSelectModel(model)} className="model-name-link">{model.name}</td>
                <td onClick={() => onSelectModel(model)}>{model.type}</td>
                <td onClick={() => onSelectModel(model)}>{model.description}</td>
                <td onClick={() => onSelectModel(model)}>{model.uploader}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(model.status)}`}>
                    {model.status}
                  </span>
                </td>
                <td onClick={() => onSelectModel(model)}>{model.permission}</td>
                <td onClick={() => onSelectModel(model)}>{model.versions && model.versions.length > 0 ? model.versions[0].version : '-'}</td>
                <td>
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
                          handlePublish(model);
                        }
                      }}
                      className="action-button"
                      style={{ backgroundColor: (model.status === 'Draft' || model.status === 'Rejected') ? '#f39c12' : '#ccc', cursor: (model.status === 'Draft' || model.status === 'Rejected') ? 'pointer' : 'not-allowed' }}
                      disabled={!(model.status === 'Draft' || model.status === 'Rejected')}
                    >
                      发布
                    </button>
                  </div>
                </td>
                <td>
                  {/* 新增：说明列内容，仅Rejected时显示 */}
                  {model.status === 'Rejected' && (model.reviewNote || '发布未成功')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ModelOverviewPage; 
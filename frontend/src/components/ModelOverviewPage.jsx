import React, { useState } from 'react';
import './ModelOverviewPage.css';
import { modelTypes, allTags } from '../data';

function ModelOverviewPage({ models, onSelectModel }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagChange = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredModels = models.filter(model => {
    const searchMatch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) || model.description.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = selectedType === 'all' || model.type === selectedType;
    const tagsMatch = selectedTags.length === 0 || selectedTags.every(tag => model.tags.includes(tag));
    return searchMatch && typeMatch && tagsMatch;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Published': return 'status-published';
      case 'Pending Review': return 'status-pending';
      case 'Draft': return 'status-draft';
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
          <option value="all">所有类型</option>
          {modelTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <div className="tags-filter">
          <h4>标签筛选</h4>
          {allTags.map(tag => (
            <span
              key={tag}
              className={`tag-filter-item ${selectedTags.includes(tag) ? 'active' : ''}`}
              onClick={() => handleTagChange(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="models-container">
        <h2>模型列表</h2>
        <table className="models-table">
          <thead>
            <tr>
              <th>模型名称</th>
              <th>类型</th>
              <th>描述</th>
              <th>上传者</th>
              <th>状态</th>
              <th>权限</th>
            </tr>
          </thead>
          <tbody>
            {filteredModels.map(model => (
              <tr key={model.id} onClick={() => onSelectModel(model)}>
                <td>{model.name}</td>
                <td>{model.type}</td>
                <td>{model.description}</td>
                <td>{model.uploader}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(model.status)}`}>
                    {model.status}
                  </span>
                </td>
                <td>{model.permission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ModelOverviewPage; 
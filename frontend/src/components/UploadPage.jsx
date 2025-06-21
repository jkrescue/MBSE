import React, { useState } from 'react';
import './UploadPage.css';
import { modelTypes, allTags as availableTags } from '../data';

function UploadPage({ onAddModel, onBack }) {
  const [name, setName] = useState('');
  const [type, setType] = useState(modelTypes[0]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);

  const handleTagToggle = (tag) => {
    setTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description) {
      alert('请填写模型名称和描述');
      return;
    }

    const newModel = {
      id: `M${Date.now()}`,
      name,
      type,
      description,
      tags,
      uploader: 'CurrentUser', // In a real app, this would be the logged-in user
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Draft',
      permission: 'Private',
      projectReferences: [],
      interface: { inputs: [], outputs: [] },
      versions: [
        { version: '0.1', date: new Date().toISOString().split('T')[0], author: 'CurrentUser', status: 'Draft', changes: 'Initial draft.' }
      ],
      structurePreview: 'default_preview.png',
      files: [] // File uploads would be handled here
    };
    
    onAddModel(newModel);
  };

  return (
    <div className="upload-page">
      <button onClick={onBack} className="back-button">← 返回模型总览</button>
      <h2>上传/注册新模型</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>模型名称</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        
        <div className="form-group">
          <label>模型类型</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {modelTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>描述</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="form-group">
            <label>标签</label>
            <div className="tags-input">
                {availableTags.map(tag => (
                    <span 
                        key={tag} 
                        className={`tag-item ${tags.includes(tag) ? 'selected' : ''}`}
                        onClick={() => handleTagToggle(tag)}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>

        <div className="form-group">
          <label>模型文件</label>
          <input type="file" />
        </div>
        <div className="form-group">
          <label>接口文档 (可选)</label>
          <input type="file" />
        </div>
        <div className="form-group">
          <label>辅助文件 (可选)</label>
          <input type="file" />
        </div>

        <button type="submit" className="submit-button">提交注册</button>
      </form>
    </div>
  );
}

export default UploadPage; 
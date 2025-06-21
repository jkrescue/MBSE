import React from 'react';
import './ModelDetailPage.css';

function ModelDetailPage({ model, onBack }) {
  if (!model) {
    return <div>请先选择一个模型</div>;
  }

  const renderTable = (title, data, columns) => (
    <div className="detail-section">
      <h3>{title}</h3>
      <table className="detail-table">
        <thead>
          <tr>
            {columns.map(col => <th key={col.key}>{col.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map(col => <td key={col.key}>{item[col.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="model-detail-page">
      <button onClick={onBack} className="back-button">← 返回模型总览</button>
      
      <div className="detail-header">
        <h2>{model.name}</h2>
        <span className="detail-type">{model.type}</span>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
            <h3>基本信息</h3>
            <p><strong>ID:</strong> {model.id}</p>
            <p><strong>描述:</strong> {model.description}</p>
            <p><strong>上传者:</strong> {model.uploader}</p>
            <p><strong>上传日期:</strong> {model.uploadDate}</p>
            <p><strong>状态:</strong> {model.status}</p>
            <p><strong>权限:</strong> {model.permission}</p>
            <p><strong>标签:</strong> {model.tags.join(', ')}</p>
        </div>

        <div className="detail-card">
            <h3>结构预览</h3>
            <img src={`https://via.placeholder.com/400x200.png/f8f9fa/6c757d?text=${model.structurePreview}`} alt={model.structurePreview} className="structure-image" />
        </div>
      </div>

      {renderTable('接口: 输入', model.interface.inputs, [
        { header: '名称', key: 'name' },
        { header: '类型', key: 'type' },
        { header: '单位', key: 'unit' },
      ])}

      {renderTable('接口: 输出', model.interface.outputs, [
        { header: '名称', key: 'name' },
        { header: '类型', key: 'type' },
        { header: '单位', key: 'unit' },
      ])}

      {renderTable('版本历史', model.versions, [
        { header: '版本', key: 'version' },
        { header: '日期', key: 'date' },
        { header: '作者', key: 'author' },
        { header: '状态', key: 'status' },
        { header: '变更说明', key: 'changes' },
      ])}

       {renderTable('相关文件', model.files, [
        { header: '文件名', key: 'name' },
        { header: '大小', key: 'size' },
      ])}

    </div>
  );
}

export default ModelDetailPage; 
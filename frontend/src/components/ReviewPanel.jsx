import React, { useState } from 'react';
import { models as initialModels } from '../data';
import './ReviewPanel.css';

function ReviewPanel() {
  const [models, setModels] = useState(initialModels);

  // 只显示待评审的模型
  const pendingModels = models.filter(m => m.status === 'Pending Review');

  // 评审操作
  const handleReview = (id, action) => {
    setModels(models.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: action === 'approve' ? 'Published' : 'Rejected',
        };
      }
      return m;
    }));
  };

  return (
    <div className="review-panel">
      <h2>评审面板</h2>
      <p>以下为所有待评审的模型，您可以进行通过或驳回操作：</p>
      <table className="review-table">
        <thead>
          <tr>
            <th>模型名称</th>
            <th>类型</th>
            <th>描述</th>
            <th>上传者</th>
            <th>状态</th>
            <th>权限</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {pendingModels.length === 0 ? (
            <tr><td colSpan={7} style={{textAlign:'center'}}>暂无待评审模型</td></tr>
          ) : pendingModels.map(model => (
            <tr key={model.id}>
              <td>{model.name}</td>
              <td>{model.type}</td>
              <td>{model.description}</td>
              <td>{model.uploader}</td>
              <td><span className="status-badge status-pending">{model.status}</span></td>
              <td>{model.permission}</td>
              <td>
                <button className="btn btn-approve" onClick={() => handleReview(model.id, 'approve')}>通过</button>
                <button className="btn btn-reject" onClick={() => handleReview(model.id, 'reject')}>驳回</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewPanel; 
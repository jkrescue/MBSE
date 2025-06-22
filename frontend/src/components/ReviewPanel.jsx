import React, { useState, useEffect, useRef } from 'react';
import { models as initialModels } from '../data';
import './ReviewPanel.css';

function ReviewPanel({ models, onReview, targetModelId, currentUser }) {
  // 调试输出，方便排查数据流
  console.log('ReviewPanel 当前用户:', currentUser, 'models:', models);
  const [rejectNote, setRejectNote] = useState({});
  const targetRef = useRef(null);

  // 只显示当前用户为评审人且待评审的模型（兼容名字大小写和空格，防止undefined报错）
  console.log('当前用户:', currentUser, '所有模型:', models);
  const pendingModels = models.filter(m =>
    Array.isArray(m.reviewTasks) &&
    m.reviewTasks.some(rt =>
      typeof rt.reviewer === 'string' &&
      typeof currentUser === 'string' &&
      rt.reviewer.trim && currentUser.trim &&
      rt.reviewer.trim().toLowerCase() === currentUser.trim().toLowerCase() &&
      rt.status === 'Pending'
    )
  );

  console.log('ReviewPanel pendingModels:', pendingModels);

  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [targetModelId]);

  return (
    <div className="review-panel">
      <h2>评审面板</h2>
      <p>以下为你待评审的模型，每个评审人互不影响：</p>
      {/* 可视化调试输出 */}
      <div style={{background:'#222',color:'#fff',padding:'8px',marginBottom:'8px',borderRadius:'6px',fontSize:'13px'}}>
        <div>待评审模型数量: <span style={{color:'#ffd700'}}>{pendingModels.length}</span></div>
        <div style={{maxHeight:'120px',overflow:'auto',fontSize:'12px'}}>
          <pre style={{margin:0}}>{JSON.stringify(pendingModels, null, 2)}</pre>
        </div>
      </div>
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
            <tr
              key={model.id + '-' + currentUser}
              ref={model.id === targetModelId ? targetRef : null}
              style={model.id === targetModelId ? {
                background: '#fffbe6',
                border: '2px solid #f7b500'
              } : {}}
            >
              <td>{model.name || '-'}</td>
              <td>{model.type || '-'}</td>
              <td>{model.description || '-'}</td>
              <td>{model.uploader || '-'}</td>
              <td><span className={`status-badge status-${(model.status || 'Pending Review').toLowerCase().replace(/\s/g,'-')}`}>{model.status || 'Pending Review'}</span></td>
              <td>{model.permission || '-'}</td>
              <td>
                {/* 操作区：通过/驳回按钮 */}
                {Array.isArray(model.reviewTasks) && model.reviewTasks.some(rt => rt.reviewer === currentUser && rt.status === 'Pending') ? (
                  <>
                    <button className="action-button approve" onClick={() => onReview(model.id, 'approve', '', currentUser)}>通过</button>
                    <button className="action-button reject" onClick={() => setRejectNote(rn => ({...rn, [model.id]: ''}))}>驳回</button>
                    {rejectNote[model.id] !== undefined && (
                      <span style={{marginLeft:8}}>
                        <input
                          type="text"
                          value={rejectNote[model.id]}
                          onChange={e => setRejectNote(rn => ({...rn, [model.id]: e.target.value}))}
                          placeholder="请输入驳回原因"
                          style={{width:120,fontSize:'12px'}}
                        />
                        <button className="action-button" style={{marginLeft:4}} onClick={() => { onReview(model.id, 'reject', rejectNote[model.id], currentUser); setRejectNote(rn => { const n = {...rn}; delete n[model.id]; return n; }); }}>提交</button>
                        <button className="action-button" style={{marginLeft:2}} onClick={() => setRejectNote(rn => { const n = {...rn}; delete n[model.id]; return n; })}>取消</button>
                      </span>
                    )}
                  </>
                ) : (
                  <span style={{color:'#888'}}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewPanel; 
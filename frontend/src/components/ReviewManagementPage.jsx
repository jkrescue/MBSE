import React, { useEffect, useRef } from 'react';

function ReviewManagementPage({ reviewTasks, currentUser, targetModelId }) {
  const targetRef = useRef(null);

  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [targetModelId]);

  return (
    <div style={{padding:32}}>
      <h2>我的待评审模型</h2>
      {reviewTasks.length === 0 ? (
        <div>暂无待评审任务</div>
      ) : (
        <ul>
          {reviewTasks.map(task => (
            <li
              key={task.id}
              style={{
                marginBottom:16,
                background: targetModelId && task.modelId === targetModelId ? '#fffbe6' : undefined,
                border: targetModelId && task.modelId === targetModelId ? '2px solid #f7b500' : undefined,
                borderRadius: targetModelId && task.modelId === targetModelId ? 6 : undefined,
                padding: targetModelId && task.modelId === targetModelId ? 8 : undefined
              }}
              ref={task.modelId === targetModelId ? targetRef : null}
            >
              <div style={{fontWeight:600}}>{task.content}</div>
              <div style={{color:'#888',fontSize:'0.95em'}}>{task.time}</div>
              {/* 这里可扩展"去评审"按钮等功能 */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReviewManagementPage; 
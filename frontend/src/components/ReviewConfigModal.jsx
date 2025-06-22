import React, { useState } from 'react';
// import Modal from './Modal'; // 暂时不用

// 假数据：评审准则
const CRITERIA = [
  { id: 'security', label: '安全性' },
  { id: 'integrity', label: '完整性' },
  { id: 'usability', label: '可用性' },
  { id: 'performance', label: '性能' },
];

// reviewers 由props传入
const ReviewConfigModal = ({ visible, onClose, onSubmit, reviewers = [] }) => {
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState([]);

  // 类型防御，确保reviewers为数组
  const safeReviewers = Array.isArray(reviewers) ? reviewers : [];

  const handleReviewerChange = (e) => {
    const value = parseInt(e.target.value);
    setSelectedReviewers(prev =>
      prev.includes(value)
        ? prev.filter(id => id !== value)
        : [...prev, value]
    );
  };

  const handleCriteriaChange = (e) => {
    const value = e.target.value;
    setSelectedCriteria(prev =>
      prev.includes(value)
        ? prev.filter(id => id !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = () => {
    onSubmit({ reviewers: selectedReviewers, criteria: selectedCriteria });
    onClose();
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.3)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 320 }}>
        <h2>配置评审流程</h2>
        <h3>选择评审人员</h3>
        {safeReviewers.map(user => (
          <label key={user.id} style={{ marginRight: 12 }}>
            <input
              type="checkbox"
              value={user.id}
              checked={selectedReviewers.includes(user.id)}
              onChange={handleReviewerChange}
            />
            {user.name}{user.role ? `（${user.role}）` : ''}
          </label>
        ))}
        <h3 style={{ marginTop: 16 }}>选择评审准则</h3>
        {CRITERIA.map(c => (
          <label key={c.id} style={{ marginRight: 12 }}>
            <input
              type="checkbox"
              value={c.id}
              checked={selectedCriteria.includes(c.id)}
              onChange={handleCriteriaChange}
            />
            {c.label}
          </label>
        ))}
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <button onClick={onClose} style={{ marginRight: 8 }}>取消</button>
          <button onClick={handleSubmit} disabled={selectedReviewers.length === 0 || selectedCriteria.length === 0}>
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewConfigModal;
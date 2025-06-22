import React, { useState } from 'react';
import './ReviewActionPanel.css';

const ReviewActionPanel = ({ workflow, currentUser, onApprove, onReject }) => {
    const [rejectionComment, setRejectionComment] = useState('');

    if (!workflow) return null;

    const { currentStage, assignedReviewers } = workflow;
    const isCurrentUserAssigned = 
        (currentStage === 'TechnicalReview' && assignedReviewers.tech === currentUser) ||
        (currentStage === 'QATesting' && assignedReviewers.qa === currentUser);

    const handleReject = () => {
        if (!rejectionComment.trim()) {
            alert('请填写驳回理由。');
            return;
        }
        onReject(rejectionComment);
        setRejectionComment('');
    };

    if (!isCurrentUserAssigned) {
        return <div className="review-panel-placeholder">您不是当前阶段的指定评审人。</div>;
    }

    return (
        <div className="review-action-panel">
            <h4>评审操作面板 ({currentUser})</h4>
            <div className="action-area">
                <button className="btn-approve" onClick={onApprove}>通过</button>
                <div className="reject-section">
                    <textarea 
                        placeholder={`请填写驳回理由...`}
                        value={rejectionComment}
                        onChange={(e) => setRejectionComment(e.target.value)}
                    />
                    <button className="btn-reject" onClick={handleReject}>驳回</button>
                </div>
            </div>
        </div>
    );
};

export default ReviewActionPanel; 
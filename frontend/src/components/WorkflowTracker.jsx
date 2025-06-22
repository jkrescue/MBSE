import React from 'react';
import './WorkflowTracker.css';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaPaperPlane } from 'react-icons/fa';

const STAGES = ['Draft', 'StaticCheck', 'TechnicalReview', 'QATesting', 'Published'];

const StageIcon = ({ status }) => {
    switch (status) {
        case 'Passed':
        case 'Completed':
            return <FaCheckCircle className="icon-passed" />;
        case 'Failed':
            return <FaTimesCircle className="icon-failed" />;
        case 'InProgress':
             return <FaHourglassHalf className="icon-inprogress" />;
        default:
            return <FaPaperPlane className="icon-pending" />;
    }
};

const WorkflowTracker = ({ workflow }) => {
    if (!workflow) {
        return <div className="workflow-tracker-empty">此版本没有工作流信息。</div>;
    }

    const { currentStage, history } = workflow;
    const currentStageIndex = STAGES.indexOf(currentStage);

    return (
        <div className="workflow-tracker">
            {STAGES.map((stage, index) => {
                const historyEntry = history.find(h => h.stage === stage);
                let status = 'Pending';
                if (index < currentStageIndex) {
                    status = historyEntry?.status || 'Passed';
                } else if (index === currentStageIndex) {
                    status = historyEntry?.status === 'Failed' ? 'Failed' : 'InProgress';
                }

                return (
                    <React.Fragment key={stage}>
                        <div className={`workflow-stage ${status.toLowerCase()}`}>
                            <div className="stage-icon">
                                <StageIcon status={status} />
                            </div>
                            <div className="stage-info">
                                <div className="stage-name">{stage.replace(/([A-Z])/g, ' $1').trim()}</div>
                                {historyEntry && (
                                    <div className="stage-meta">
                                        <span>{historyEntry.user}</span>
                                        <span>{new Date(historyEntry.date).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {index < STAGES.length - 1 && <div className="workflow-connector" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default WorkflowTracker; 
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './QualityDashboard.css';
import { FaHeartbeat, FaClipboardCheck, FaBookReader, FaProjectDiagram } from 'react-icons/fa';

const getPathColor = (percentage) => {
    if (percentage >= 90) return '#27ae60'; // green
    if (percentage >= 60) return '#f39c12'; // orange
    return '#e74c3c'; // red
};

const HealthIndicator = ({ status }) => {
    const statusMap = {
        good: { text: '健康', className: 'good' },
        warning: { text: '警告', className: 'warning' },
        error: { text: '严重', className: 'error' },
    };
    const currentStatus = statusMap[status] || { text: '未知', className: 'unknown' };

    return (
        <div className="health-indicator">
            <span className={`indicator-dot ${currentStatus.className}`}></span>
            <span>{currentStatus.text}</span>
        </div>
    );
};

const QualityDashboard = ({ metrics }) => {
    if (!metrics) {
        return <div className="quality-dashboard-empty">暂无质量指标数据。</div>;
    }

    const { testCoverage, staticCheckScore, documentationScore, dependencyHealth } = metrics;

    const dashboardItems = [
        {
            value: staticCheckScore,
            label: '静态检查分数',
            icon: <FaClipboardCheck />,
        },
        {
            value: testCoverage,
            label: '测试覆盖率',
            icon: <FaHeartbeat />,
        },
        {
            value: documentationScore,
            label: '文档完整度',
            icon: <FaBookReader />,
        }
    ];

    return (
        <div className="quality-dashboard">
            {dashboardItems.map(item => (
                <div className="dashboard-item" key={item.label}>
                    <div className="item-icon">{item.icon}</div>
                    <div className="item-content">
                        <div className="progress-circle-container">
                            <CircularProgressbar
                                value={item.value}
                                text={`${item.value}%`}
                                styles={buildStyles({
                                    rotation: 0.25,
                                    strokeLinecap: 'butt',
                                    textSize: '20px',
                                    pathTransitionDuration: 0.5,
                                    pathColor: getPathColor(item.value),
                                    textColor: getPathColor(item.value),
                                    trailColor: '#d6d6d6',
                                })}
                            />
                        </div>
                        <div className="item-label">{item.label}</div>
                    </div>
                </div>
            ))}
             <div className="dashboard-item">
                <div className="item-icon"><FaProjectDiagram /></div>
                <div className="item-content">
                     <HealthIndicator status={dependencyHealth} />
                    <div className="item-label">依赖健康度</div>
                </div>
            </div>
        </div>
    );
};

export default QualityDashboard; 
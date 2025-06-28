import React, { useState } from 'react';
import './WorkflowHome.css';
import logo from './assets/react.svg'; // 可替换为实际logo
import createImg from './assets/createworkflow.png';
import editImg from './assets/editworkflow.png';
import publishImg from './assets/publishworkflow.png';
import { useNavigate } from 'react-router-dom';

// 静态引导流程内容
const GuideSteps = () => (
  <div className="workflow-guide-bg">
    <div className="workflow-guide-content">
      <div className="guide-header">
        <img src={logo} alt="logo" className="guide-logo" />
        <div className="guide-title">工作流管理平台</div>
        <div className="guide-desc">高效、智能、可视化的流程管理，助力企业数字化转型</div>
      </div>
      <div className="guide-steps-row">
        <div className="guide-step">
          <img src={createImg} alt="新建" className="step-img" />
          <div className="step-title">新建工作流</div>
          <div className="step-desc">点击"新建工作流"按钮，创建你的第一个流程</div>
        </div>
        <div className="guide-arrow">→</div>
        <div className="guide-step">
          <img src={editImg} alt="编辑" className="step-img" />
          <div className="step-title">设计工作流</div>
          <div className="step-desc">在弹出的建模器中拖拽节点，配置工作流逻辑</div>
        </div>
        <div className="guide-arrow">→</div>
        <div className="guide-step">
          <img src={publishImg} alt="发布" className="step-img" />
          <div className="step-title">发布工作流</div>
          <div className="step-desc">工作流设计完成后可一键发布，正式投入使用</div>
        </div>
      </div>
    </div>
  </div>
);

// 工作流列表表头
const columns = [
  { title: '名称', dataIndex: 'name' },
  { title: '描述', dataIndex: 'desc' },
  { title: '创建人', dataIndex: 'creator' },
  { title: '创建时间', dataIndex: 'createdAt' },
  { title: '状态', dataIndex: 'publishStatus' },
  { title: '操作', dataIndex: 'actions' },
];

// 示例数据
const initialData = [
  { name: '空调热管理流程', desc: '整车空调系统热管理仿真与验证', creator: '王工', createdAt: '2024-06-01', publishStatus: '已发布' },
  { name: '整车性能-车速验证', desc: '整车动力性与最高车速性能测试', creator: '李工', createdAt: '2024-06-02', publishStatus: '未发布' },
  { name: '整车功能安全', desc: 'ISO26262功能安全分析与流程管理', creator: '张工', createdAt: '2024-06-03', publishStatus: '已发布' },
  { name: '整车能量流分析', desc: '能量流分布与能效分析流程', creator: '赵工', createdAt: '2024-06-04', publishStatus: '未发布' },
  { name: '电池包热失控管理', desc: '电池包热失控仿真与安全验证', creator: '钱工', createdAt: '2024-06-05', publishStatus: '已发布' },
];

export default function WorkflowHome({ onCreateWorkflow }) {
  const [data] = useState(initialData);
  const navigate = useNavigate();
  // 操作按钮渲染
  const renderActions = (row) => (
    <>
      <button className="action-btn edit">编辑</button>
      <button className="action-btn copy">复制</button>
      <button className="action-btn delete">删除</button>
    </>
  );
  // 名称渲染为可点击链接
  const renderName = (row) => (
    <span
      className="workflow-link"
      onClick={() => navigate(`/workflow/${encodeURIComponent(row.name)}`)}
    >
      {row.name}
    </span>
  );
  return (
    <div className="workflow-home">
      {/* 上半部分：引导流程 */}
      <GuideSteps />
      {/* 下半部分：工作流列表 */}
      <div className="workflow-list-section">
        <div className="list-header">
          <span className="list-title">工作流列表</span>
          <button className="create-btn" onClick={onCreateWorkflow}>新建工作流</button>
        </div>
        <table className="workflow-table">
          <thead>
            <tr>
              {columns.map(col => <th key={col.dataIndex}>{col.title}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td>{renderName(row)}</td>
                <td>{row.desc}</td>
                <td>{row.creator}</td>
                <td>{row.createdAt}</td>
                <td>{row.publishStatus}</td>
                <td>{renderActions(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
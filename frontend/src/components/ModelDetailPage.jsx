import React, { useState } from 'react';
import './ModelDetailPage.css';
import modelicaImg from './modelica_model.png';
import simulinkImg from './simulink_model.png';
import WorkflowTracker from './WorkflowTracker';
import ReviewActionPanel from './ReviewActionPanel';
import QualityDashboard from './QualityDashboard';
import Modal from './Modal';
import ModelLineageGraph from './ModelLineageGraph';
import { FaExclamationTriangle } from 'react-icons/fa';

const TYPE_ENUM = ['real', 'integer', 'string', 'boolean'];
const UNIT_ENUM = ['A', 'N.m', 'V', 'N', 'kg', 'm'];

const ModelDetailPage = ({ model, allModels, currentUser, onBack, onManageVersions, onApprove, onReject }) => {
  const [localModel, setLocalModel] = useState(() => {
    if (model.name === 'BatteryThermalModel') {
      return {
        ...model,
        interface: {
          inputs: [
            { name: 'TRet', type: 'real', unit: '/' },
            { name: 'TOut', type: 'real', unit: '/' },
            { name: 'TMix', type: 'real', unit: '/' },
            { name: 'TMixSet', type: 'real', unit: '/' },
          ],
          outputs: [
            { name: 'yOA', type: 'real', unit: '/' },
          ]
        }
      };
    }
    return model;
  });

  const [isLineageModalOpen, setLineageModalOpen] = useState(false);

  if (!model) {
    return (
      <div className="model-detail-page">
        <div className="loading-error">
            <h2>模型未找到</h2>
            <p>请返回列表选择一个模型。</p>
            <button onClick={onBack}>返回列表</button>
        </div>
      </div>
    );
  }

  const latestVersion = model.versions[0];
  const workflow = latestVersion?.workflow;

  const handleApprove = () => {
    onApprove(model.id, latestVersion.version);
  };

  const handleReject = (comment) => {
    onReject(model.id, latestVersion.version, comment);
  };

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

  // 可编辑表格
  const renderEditableTable = (title, data, columns, onChange) => (
    <div className="detail-section">
      <h3>{title}</h3>
      <table className="detail-table">
        <thead>
          <tr>
            {columns.map(col => <th key={col.key}>{col.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map(col => {
                if (col.key === 'type') {
                  return (
                    <td key={col.key}>
                      <select value={item.type} onChange={e => onChange(rowIdx, 'type', e.target.value)}>
                        {TYPE_ENUM.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </td>
                  );
                } else if (col.key === 'unit') {
                  return (
                    <td key={col.key}>
                      <select value={item.unit} onChange={e => onChange(rowIdx, 'unit', e.target.value)}>
                        <option value="/">/</option>
                        {UNIT_ENUM.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </td>
                  );
                } else {
                  return <td key={col.key}>{item[col.key]}</td>;
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // 输入输出编辑事件
  const handleInputChange = (idx, key, value) => {
    setLocalModel(m => {
      const newInputs = m.interface.inputs.map((item, i) => i === idx ? { ...item, [key]: value } : item);
      return { ...m, interface: { ...m.interface, inputs: newInputs } };
    });
  };
  const handleOutputChange = (idx, key, value) => {
    setLocalModel(m => {
      const newOutputs = m.interface.outputs.map((item, i) => i === idx ? { ...item, [key]: value } : item);
      return { ...m, interface: { ...m.interface, outputs: newOutputs } };
    });
  };

  // 结构预览区块
  const renderStructurePreview = () => {
    let previewImg = model.structurePreview;
    if (model.type === 'Modelica') {
      previewImg = modelicaImg;
    } else if (model.type === 'Simulink') {
      previewImg = simulinkImg;
    }
    return (
      <div className="structure-preview-block">
        <h3>结构预览</h3>
        {previewImg ? (
          <img src={previewImg} alt="结构预览" style={{maxWidth:'100%',border:'1px solid #e1e4e8',borderRadius:8,background:'#fff'}} />
        ) : (
          <div style={{color:'#888'}}>暂无结构预览</div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="model-detail-page">
        <div className="detail-page-header">
          <button onClick={onBack} className="back-button">← 返回列表</button>
          <h1>{model.name}</h1>
          <div className="header-meta">
            <span>类型: {model.type}</span>
            <span>上传者: {model.uploader}</span>
            <span>创建日期: {model.uploadDate}</span>
          </div>
          <p className="model-description">{model.description}</p>
        </div>

        <div className="detail-page-content">
          <div className="content-section">
            <h2>评审流程</h2>
            <WorkflowTracker workflow={workflow} />

            {workflow?.actionItems && workflow.actionItems.length > 0 && (
              <div className="action-items-section">
                <h4><FaExclamationTriangle /> 待办事项</h4>
                <ul>
                  {workflow.actionItems.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </div>
            )}

            <div className="review-history-section">
              <h4>评审历史</h4>
              {workflow?.history?.length > 0 ? (
                <ul className="history-list">
                  {workflow.history.map((item, index) => (
                    <li key={index} className={`history-item ${item.status.toLowerCase()}`}>
                      <div className="history-item-header">
                        <strong>{item.stage.replace(/([A-Z])/g, ' $1').trim()}</strong> - 
                        <span className={`status-${item.status.toLowerCase()}`}>{item.status}</span>
                      </div>
                      <div className="history-item-meta">
                        by {item.user} on {new Date(item.date).toLocaleString()}
                      </div>
                      <p className="history-item-comment">{item.comment}</p>
                    </li>
                  ))}
                </ul>
              ) : <p>暂无评审历史。</p>}
            </div>

            <ReviewActionPanel 
              workflow={workflow}
              currentUser={currentUser}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>

          <div className="content-section">
            <h2>质量仪表盘</h2>
            <QualityDashboard metrics={latestVersion?.qualityMetrics} />
          </div>
          
          <div className="content-section">
            <h2>模型血缘与影响分析</h2>
             <div className="placeholder-box">
              <p>点击下方按钮，以可视化的图谱形式查看当前模型的上游依赖和下游影响。</p>
              <button className="action-button" onClick={() => setLineageModalOpen(true)}>查看血缘图</button>
            </div>
          </div>
          
          <div className="content-section">
            <h2>版本历史</h2>
             <div className="placeholder-box">
              <p>这里将集成我们现有的版本管理功能，允许用户查看、回滚、和管理不同版本的模型。</p>
              <button className="action-button" onClick={() => onManageVersions(model)}>跳转到版本管理</button>
            </div>
          </div>
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
              {renderStructurePreview()}
          </div>
        </div>

        {renderEditableTable('接口: 输入', localModel.interface.inputs, [
          { header: '名称', key: 'name' },
          { header: '类型', key: 'type' },
          { header: '单位', key: 'unit' },
        ], handleInputChange)}

        {renderEditableTable('接口: 输出', localModel.interface.outputs, [
          { header: '名称', key: 'name' },
          { header: '类型', key: 'type' },
          { header: '单位', key: 'unit' },
        ], handleOutputChange)}

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

      <Modal 
        isOpen={isLineageModalOpen} 
        onClose={() => setLineageModalOpen(false)} 
        title={`模型血缘图: ${model.name}`}
      >
        <ModelLineageGraph model={model} allModels={allModels} />
      </Modal>
    </>
  );
};

export default ModelDetailPage; 
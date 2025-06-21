import React, { useState } from 'react';
import './ModelDetailPage.css';
import modelicaImg from './modelica_model.svg';
import simulinkImg from './simulink_model.png';

const TYPE_ENUM = ['real', 'integer', 'string', 'boolean'];
const UNIT_ENUM = ['A', 'N.m', 'V', 'N', 'kg', 'm'];

function ModelDetailPage({ model, onBack }) {
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
            {model.type === 'Modelica' ? (
              <img src={modelicaImg} alt="Modelica结构图" className="structure-image" />
            ) : model.type === 'Simulink' ? (
              <img src={simulinkImg} alt="Simulink结构图" className="structure-image" />
            ) : (
              <img src={`https://via.placeholder.com/400x200.png/f8f9fa/6c757d?text=${model.structurePreview}`} alt={model.structurePreview} className="structure-image" />
            )}
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
  );
}

export default ModelDetailPage; 
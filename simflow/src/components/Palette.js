import React from 'react';
import { Input, Divider } from 'antd';
import { AppstoreOutlined, ApiOutlined, ClusterOutlined, DeploymentUnitOutlined, ExperimentOutlined } from '@ant-design/icons';
import './Palette.css';

const nodeTypes = [
  { key: 'requirement', label: '需求节点', icon: <AppstoreOutlined /> },
  { key: 'function', label: '功能节点', icon: <ApiOutlined /> },
  { key: 'logic', label: '逻辑节点', icon: <ClusterOutlined /> },
  { key: 'physical', label: '物理节点', icon: <DeploymentUnitOutlined /> },
  { key: 'doe', label: 'DOE/优化节点', icon: <ExperimentOutlined /> },
];

export default function Palette() {
  return (
    <div className="palette">
      <h3 style={{margin: '16px 0 8px 16px'}}>节点库</h3>
      <Input.Search placeholder="搜索节点类型" style={{margin: '0 16px 8px 16px'}} allowClear />
      <Divider style={{margin: '8px 0'}} />
      <div className="palette-list">
        {nodeTypes.map(item => (
          <div className="palette-item" key={item.key} draggable>
            <span className="palette-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

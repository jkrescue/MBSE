import React, { useState } from 'react';
import { 
  AppstoreOutlined,
  ApiOutlined,
  CodeOutlined,
  ClusterOutlined,
  ExperimentOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Input, Collapse } from 'antd';

const { Panel } = Collapse;

// 参考图片优化的节点类型
const nodeCategories = {
  '需求节点': [
    { 
      type: 'requirement',
      label: 'Polarion',
      subLabel: 'REQ-A001',
      description: '车辆动力学性能需求规格',
      icon: <AppstoreOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff'
    }
  ],
  '功能节点': [
    { 
      type: 'function_ea',
      label: 'EA 建模',
      subLabel: 'FUNC-M101', 
      description: '动力系统功能建模',
      icon: <ApiOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a'
    },
    { 
      type: 'function_magic',
      label: 'MagicDraw',
      subLabel: 'FUNC-M102',
      description: '系统架构设计',
      icon: <CodeOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a'
    }
  ],
  '逻辑节点': [
    { 
      type: 'logic_simulink',
      label: 'Simulink',
      subLabel: 'SLX-C201',
      description: '动力控制器逻辑模型',
      icon: <CodeOutlined style={{ color: '#faad14' }} />,
      color: '#faad14'
    },
    { 
      type: 'logic_dymola',
      label: 'Dymola',
      subLabel: 'DYM-C202',
      description: '多物理域仿真模型',
      icon: <ExperimentOutlined style={{ color: '#faad14' }} />,
      color: '#faad14'
    }
  ],
  '物理节点': [
    { 
      type: 'physical_cad',
      label: 'UG CAD',
      subLabel: 'UG-P301',
      description: '车身CAD模型',
      icon: <ClusterOutlined style={{ color: '#722ed1' }} />,
      color: '#722ed1'
    },
    { 
      type: 'physical_ansys',
      label: 'Ansys',
      subLabel: 'ANS-P301', 
      description: '车身强度分析',
      icon: <ExperimentOutlined style={{ color: '#722ed1' }} />,
      color: '#722ed1'
    }
  ],
  'DOE节点': [
    { 
      type: 'doe_full',
      label: '全因子DOE',
      subLabel: 'DOE-D101',
      description: '多参数优化分析',
      icon: <ExperimentOutlined style={{ color: '#eb2f96' }} />,
      color: '#eb2f96'
    },
    { 
      type: 'doe_taguchi',
      label: '田口方法',
      subLabel: 'DOE-D102',
      description: '稳健性设计优化',
      icon: <ExperimentOutlined style={{ color: '#eb2f96' }} />,
      color: '#eb2f96'
    }
  ]
};

export default function Palette() {
  const [searchText, setSearchText] = useState('');
  const [activeKey, setActiveKey] = useState(['需求节点', '功能节点', '逻辑节点', '物理节点', 'DOE节点']);

  const handleDragStart = (e, nodeType) => {
    console.log('开始拖拽节点:', nodeType);
    
    // 设置拖拽数据
    e.dataTransfer.setData('nodeType', JSON.stringify(nodeType));
    e.dataTransfer.setData('text/plain', nodeType.label);
    e.dataTransfer.effectAllowed = 'copy';
    
    // 确保拖拽视觉反馈
    e.dataTransfer.setDragImage(e.currentTarget, 60, 30);
    
    // 添加拖拽样式
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    console.log('拖拽结束');
    // 恢复样式
    e.currentTarget.style.opacity = '1';
  };

  const filterNodes = (nodes) => {
    if (!searchText) return nodes;
    return nodes.filter(node => 
      node.label.toLowerCase().includes(searchText.toLowerCase()) ||
      node.subLabel.toLowerCase().includes(searchText.toLowerCase()) ||
      node.description.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const renderNodeItem = (item) => (
    <div
      key={item.type}
      draggable={true}
      onDragStart={e => handleDragStart(e, item)}
      onDragEnd={handleDragEnd}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        margin: '4px 0',
        background: '#fff',
        border: `1px solid ${item.color}`,
        borderRadius: 6,
        cursor: 'grab',
        transition: 'all 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        userSelect: 'none'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        e.currentTarget.style.cursor = 'grab';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.cursor = 'grabbing';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.cursor = 'grab';
      }}
    >
      <div style={{ marginRight: 8, fontSize: 16 }}>
        {item.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontWeight: 500, 
          fontSize: 12, 
          color: '#333',
          marginBottom: 2
        }}>
          {item.label}
        </div>
        <div style={{ 
          fontSize: 10, 
          color: '#666',
          marginBottom: 2
        }}>
          {item.subLabel}
        </div>
        <div style={{ 
          fontSize: 10, 
          color: '#999',
          lineHeight: 1.2
        }}>
          {item.description}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      padding: 8, 
      height: '100%',
      background: '#fafafa',
      borderRight: '1px solid #e8e8e8'
    }}>
      {/* 搜索框 */}
      <Input
        size="small"
        placeholder="搜索节点..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      
      {/* 节点类别折叠面板 */}
      <Collapse
        activeKey={activeKey}
        onChange={setActiveKey}
        size="small"
        ghost
        expandIcon={({ isActive }) => 
          isActive ? <CaretDownOutlined /> : <CaretRightOutlined />
        }
      >
        {Object.entries(nodeCategories).map(([category, nodes]) => {
          const filteredNodes = filterNodes(nodes);
          if (filteredNodes.length === 0 && searchText) return null;
          
          return (
            <Panel 
              header={
                <span style={{ fontWeight: 500, fontSize: 13 }}>
                  {category} ({filteredNodes.length})
                </span>
              } 
              key={category}
              style={{ 
                marginBottom: 4,
                background: '#fff',
                borderRadius: 6
              }}
            >
              {filteredNodes.map(renderNodeItem)}
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}

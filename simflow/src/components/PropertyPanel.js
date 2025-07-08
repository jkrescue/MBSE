import React, { useState } from 'react';
import { Card, Descriptions, Button, Input, Select, Divider, Tag, Space } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  CopyOutlined, 
  LinkOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

export default function PropertyPanel({ selectedNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  
  console.log('PropertyPanel 渲染, 选中节点:', selectedNode);
  
  if (!selectedNode) {
    return (
      <div style={{ padding: 16 }}>
        <Card title="属性面板" size="small">
          <div style={{ 
            textAlign: 'center',
            color: '#999',
            padding: '40px 0'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <div>请在画布上选择一个节点</div>
            <div style={{ fontSize: 12, marginTop: 8 }}>查看和编辑节点属性</div>
          </div>
        </Card>
      </div>
    );
  }

  // 安全地提取节点信息
  const nodeId = selectedNode.id || '未知';
  const nodeType = selectedNode.properties?.nodeType || selectedNode.type || '未知';
  const nodeText = selectedNode.text?.value || selectedNode.text || '无';
  
  // 安全地提取坐标
  const x = typeof selectedNode.x === 'object' ? selectedNode.x.value : selectedNode.x;
  const y = typeof selectedNode.y === 'object' ? selectedNode.y.value : selectedNode.y;

  // 获取节点状态
  const getNodeStatus = (nodeType) => {
    const statusMap = {
      'requirement': { color: 'blue', text: '需求' },
      'function_ea': { color: 'green', text: '功能' },
      'function_magic': { color: 'green', text: '功能' },
      'logic_simulink': { color: 'orange', text: '逻辑' },
      'logic_dymola': { color: 'orange', text: '逻辑' },
      'physical_cad': { color: 'purple', text: '物理' },
      'physical_ansys': { color: 'purple', text: '物理' },
      'doe_full': { color: 'magenta', text: 'DOE' },
      'doe_taguchi': { color: 'magenta', text: 'DOE' }
    };
    return statusMap[nodeType] || { color: 'default', text: '未知' };
  };

  const nodeStatus = getNodeStatus(nodeType);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      text: nodeText,
      description: selectedNode.properties?.description || '',
      status: selectedNode.properties?.status || 'ready'
    });
  };

  const handleSave = () => {
    console.log('保存节点属性:', editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  return (
    <div style={{ padding: 16, height: '100%', overflow: 'auto' }}>
      <Card 
        title={
          <Space>
            <span>节点属性</span>
            <Tag color={nodeStatus.color}>{nodeStatus.text}</Tag>
          </Space>
        } 
        size="small"
        extra={
          !isEditing && (
            <Button 
              type="text" 
              size="small" 
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              编辑
            </Button>
          )
        }
      >
        {!isEditing ? (
          <>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="节点ID">
                <code style={{ 
                  background: '#f5f5f5', 
                  padding: '2px 6px', 
                  borderRadius: 3,
                  fontSize: 11
                }}>
                  {nodeId}
                </code>
              </Descriptions.Item>
              <Descriptions.Item label="节点类型">
                {nodeType}
              </Descriptions.Item>
              <Descriptions.Item label="显示文本">
                {nodeText}
              </Descriptions.Item>
              <Descriptions.Item label="坐标位置">
                ({Math.round(x || 0)}, {Math.round(y || 0)})
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {new Date().toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color="green">就绪</Tag>
              </Descriptions.Item>
            </Descriptions>
            
            <Divider style={{ margin: '12px 0' }} />
            
            <div style={{ marginBottom: 12 }}>
              <div style={{ 
                fontSize: 12, 
                color: '#666', 
                marginBottom: 8 
              }}>
                节点描述
              </div>
              <div style={{ 
                background: '#fafafa', 
                padding: 8, 
                borderRadius: 4,
                fontSize: 12,
                minHeight: 40,
                color: '#999'
              }}>
                {selectedNode.properties?.description || '暂无描述信息'}
              </div>
            </div>
          </>
        ) : (
          <div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#666' }}>显示文本</label>
              <Input
                size="small"
                value={editForm.text}
                onChange={(e) => setEditForm({...editForm, text: e.target.value})}
                style={{ marginTop: 4 }}
              />
            </div>
            
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#666' }}>节点描述</label>
              <TextArea
                size="small"
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                placeholder="输入节点描述..."
                style={{ marginTop: 4 }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#666' }}>运行状态</label>
              <Select
                size="small"
                value={editForm.status}
                onChange={(value) => setEditForm({...editForm, status: value})}
                style={{ width: '100%', marginTop: 4 }}
              >
                <Option value="ready">就绪</Option>
                <Option value="running">运行中</Option>
                <Option value="completed">已完成</Option>
                <Option value="error">错误</Option>
              </Select>
            </div>
            
            <Space size="small">
              <Button type="primary" size="small" onClick={handleSave}>
                保存
              </Button>
              <Button size="small" onClick={handleCancel}>
                取消
              </Button>
            </Space>
          </div>
        )}
        
        <Divider style={{ margin: '12px 0' }} />
        
        <div style={{ textAlign: 'center' }}>
          <Space wrap size="small">
            <Button 
              type="text" 
              size="small" 
              icon={<PlayCircleOutlined />}
              style={{ color: '#52c41a' }}
            >
              运行
            </Button>
            <Button 
              type="text" 
              size="small" 
              icon={<PauseCircleOutlined />}
              style={{ color: '#faad14' }}
            >
              暂停
            </Button>
            <Button 
              type="text" 
              size="small" 
              icon={<CopyOutlined />}
            >
              复制
            </Button>
            <Button 
              type="text" 
              size="small" 
              icon={<LinkOutlined />}
            >
              连线
            </Button>
            <Button 
              type="text" 
              size="small" 
              icon={<DeleteOutlined />}
              danger
              onClick={() => {
                console.log('删除节点:', selectedNode.id);
              }}
            >
              删除
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
}

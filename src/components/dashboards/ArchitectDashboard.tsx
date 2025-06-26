import React from 'react';
import { Row, Col, Card, List, Tag, Button, Space, Divider, Table, Progress, Badge, Tooltip } from 'antd';
import {
  EditOutlined,
  BranchesOutlined,
  CloudUploadOutlined,
  LinkOutlined,
  TeamOutlined,
  FileSearchOutlined,
  ExportOutlined,
  SyncOutlined
} from '@ant-design/icons';

// 架构模型数据
const architectureModels = [
  {
    id: '1',
    name: '智能驾驶控制系统',
    version: 'v2.1',
    status: 'active',
    lastModified: '2024-03-19',
    coverage: 95,
    owner: '张工'
  },
  {
    id: '2',
    name: '车载娱乐系统',
    version: 'v1.5',
    status: 'review',
    lastModified: '2024-03-18',
    coverage: 85,
    owner: '李工'
  },
  {
    id: '3',
    name: '动力传动系统',
    version: 'v3.0',
    status: 'completed',
    lastModified: '2024-03-17',
    coverage: 100,
    owner: '王工'
  }
];

// 模型映射数据
const modelMappings = [
  {
    block: '车辆动力学模块',
    simulationModel: 'VehicleDynamics.fmu',
    interfaces: 12,
    mapped: 12,
    status: 'complete'
  },
  {
    block: '制动控制器',
    simulationModel: 'BrakeController.slx',
    interfaces: 8,
    mapped: 6,
    status: 'partial'
  },
  {
    block: '传感器系统',
    simulationModel: 'SensorSystem.fmu',
    interfaces: 15,
    mapped: 15,
    status: 'complete'
  }
];

// SSP导出任务
const sspExports = [
  {
    id: '1',
    name: '智能驾驶控制系统SSP',
    status: 'success',
    date: '2024-03-19',
    version: 'v2.1'
  },
  {
    id: '2',
    name: '车载娱乐系统SSP',
    status: 'processing',
    date: '2024-03-18',
    version: 'v1.5'
  }
];

// 需求一致性分析
const requirementAnalysis = [
  {
    requirement: 'REQ-001',
    description: '系统响应时间',
    architectureElement: 'ControlSystem',
    status: 'matched',
    coverage: 100
  },
  {
    requirement: 'REQ-002',
    description: '传感器数据采集',
    architectureElement: 'SensorInterface',
    status: 'partial',
    coverage: 80
  },
  {
    requirement: 'REQ-003',
    description: '安全控制策略',
    architectureElement: 'SafetyController',
    status: 'missing',
    coverage: 0
  }
];

// 架构复用分析
const reuseAnalysis = [
  {
    component: '传感器接口模块',
    template: '标准传感器模板',
    similarity: 95,
    reusePotential: 'high'
  },
  {
    component: '控制器模块',
    template: '通用控制器模板',
    similarity: 75,
    reusePotential: 'medium'
  }
];

// 架构任务协作
const collaborationTasks = [
  {
    block: '动力系统模块',
    owner: '张工',
    status: 'in-progress',
    reviewers: ['李工', '王工'],
    deadline: '2024-03-25'
  },
  {
    block: '传感器接口',
    owner: '李工',
    status: 'review',
    reviewers: ['张工'],
    deadline: '2024-03-23'
  }
];

export const ArchitectDashboard: React.FC = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* 快速操作按钮 */}
        <Col span={24}>
          <Space size="large">
            <Button type="primary" icon={<EditOutlined />}>
              新建架构模型
            </Button>
            <Button icon={<CloudUploadOutlined />}>
              导入SysML模型
            </Button>
            <Button icon={<ExportOutlined />}>
              导出SSP
            </Button>
            <Button icon={<FileSearchOutlined />}>
              需求分析
            </Button>
          </Space>
          <Divider />
        </Col>

        {/* 架构模型总览 */}
        <Col span={24}>
          <Card title="架构模型总览 (SysML)" extra={<Button type="link">查看全部</Button>}>
            <Table
              dataSource={architectureModels}
              columns={[
                { title: '模型名称', dataIndex: 'name' },
                { title: '版本', dataIndex: 'version' },
                {
                  title: '状态',
                  dataIndex: 'status',
                  render: (status) => (
                    <Tag color={
                      status === 'active' ? 'processing' :
                      status === 'review' ? 'warning' :
                      'success'
                    }>
                      {status === 'active' ? '进行中' :
                       status === 'review' ? '待评审' : '已完成'}
                    </Tag>
                  )
                },
                { title: '负责人', dataIndex: 'owner' },
                {
                  title: '需求覆盖率',
                  dataIndex: 'coverage',
                  render: (coverage) => (
                    <Progress percent={coverage} size="small" status={coverage < 90 ? 'active' : 'success'} />
                  )
                },
                {
                  title: '操作',
                  key: 'action',
                  render: () => (
                    <Space>
                      <Button type="link" icon={<EditOutlined />}>编辑</Button>
                      <Button type="link" icon={<BranchesOutlined />}>版本</Button>
                      <Button type="link" icon={<ExportOutlined />}>导出</Button>
                    </Space>
                  )
                }
              ]}
              pagination={false}
            />
          </Card>
        </Col>

        {/* 模型映射视图 */}
        <Col span={12}>
          <Card title="模型映射视图" extra={<Button type="link" icon={<LinkOutlined />}>管理映射</Button>}>
            <Table
              dataSource={modelMappings}
              columns={[
                { title: '架构Block', dataIndex: 'block' },
                { title: '仿真模型', dataIndex: 'simulationModel' },
                {
                  title: '接口映射',
                  render: (_, record) => (
                    <Tooltip title={`${record.mapped}/${record.interfaces} 个接口已映射`}>
                      <Progress
                        percent={Math.round((record.mapped / record.interfaces) * 100)}
                        size="small"
                        status={record.status === 'complete' ? 'success' : 'active'}
                      />
                    </Tooltip>
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* SSP导出管理器 */}
        <Col span={12}>
          <Card title="SSP导出管理器" extra={<Button type="link" icon={<ExportOutlined />}>新建导出</Button>}>
            <List
              dataSource={sspExports}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="link">下载</Button>,
                    <Button type="link">查看日志</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge
                        status={item.status === 'success' ? 'success' : 'processing'}
                      />
                    }
                    title={`${item.name} (${item.version})`}
                    description={`导出时间: ${item.date}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 需求-架构一致性分析 */}
        <Col span={12}>
          <Card title="需求-架构一致性分析" extra={<Button type="link" icon={<FileSearchOutlined />}>详细分析</Button>}>
            <Table
              dataSource={requirementAnalysis}
              columns={[
                { title: '需求ID', dataIndex: 'requirement' },
                { title: '架构元素', dataIndex: 'architectureElement' },
                {
                  title: '状态',
                  dataIndex: 'status',
                  render: (status) => (
                    <Tag color={
                      status === 'matched' ? 'success' :
                      status === 'partial' ? 'warning' :
                      'error'
                    }>
                      {status === 'matched' ? '完全匹配' :
                       status === 'partial' ? '部分匹配' : '未匹配'}
                    </Tag>
                  )
                },
                {
                  title: '覆盖率',
                  dataIndex: 'coverage',
                  render: (coverage) => (
                    <Progress percent={coverage} size="small" status={coverage < 100 ? 'active' : 'success'} />
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 架构复用分析器 */}
        <Col span={12}>
          <Card title="架构复用分析器" extra={<Button type="link" icon={<SyncOutlined />}>分析</Button>}>
            <Table
              dataSource={reuseAnalysis}
              columns={[
                { title: '组件', dataIndex: 'component' },
                { title: '匹配模板', dataIndex: 'template' },
                {
                  title: '相似度',
                  dataIndex: 'similarity',
                  render: (similarity) => (
                    <Progress percent={similarity} size="small" status={similarity < 90 ? 'active' : 'success'} />
                  )
                },
                {
                  title: '复用潜力',
                  dataIndex: 'reusePotential',
                  render: (potential) => (
                    <Tag color={
                      potential === 'high' ? 'success' :
                      potential === 'medium' ? 'warning' :
                      'error'
                    }>
                      {potential === 'high' ? '高' :
                       potential === 'medium' ? '中' : '低'}
                    </Tag>
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 架构任务协作视图 */}
        <Col span={24}>
          <Card title="架构任务协作视图" extra={<Button type="link" icon={<TeamOutlined />}>任务管理</Button>}>
            <Table
              dataSource={collaborationTasks}
              columns={[
                { title: '架构模块', dataIndex: 'block' },
                { title: '负责人', dataIndex: 'owner' },
                {
                  title: '评审人',
                  dataIndex: 'reviewers',
                  render: (reviewers: string[]) => (
                    <Space>
                      {reviewers.map((reviewer: string) => (
                        <Tag key={reviewer}>{reviewer}</Tag>
                      ))}
                    </Space>
                  )
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  render: (status) => (
                    <Tag color={
                      status === 'in-progress' ? 'processing' :
                      status === 'review' ? 'warning' :
                      'success'
                    }>
                      {status === 'in-progress' ? '进行中' :
                       status === 'review' ? '待评审' : '已完成'}
                    </Tag>
                  )
                },
                { title: '截止日期', dataIndex: 'deadline' },
                {
                  title: '操作',
                  key: 'action',
                  render: () => (
                    <Space>
                      <Button type="link">详情</Button>
                      <Button type="link">评审</Button>
                    </Space>
                  )
                }
              ]}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}; 
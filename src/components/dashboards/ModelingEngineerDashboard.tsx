import React from 'react';
import { Row, Col, Card, List, Tag, Button, Steps, Alert, Progress, Upload, Space, Table, Timeline, Tooltip } from 'antd';
import {
  EditOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  PlusOutlined,
  MessageOutlined,
  UploadOutlined,
  LinkOutlined,
  BranchesOutlined,
  FileSearchOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  RobotOutlined
} from '@ant-design/icons';

const { Step } = Steps;

// 类型定义
interface ModelingTask {
  id: string;
  name: string;
  status: 'in_review' | 'in_progress';
  deadline: string;
  progress: number;
  requirements: Array<{
    id: string;
    description: string;
  }>;
  assignedBy: string;
}

interface ModelVersion {
  name: string;
  version: string;
  format: string;
  size: string;
  uploadTime: string;
  status: 'uploading' | 'completed';
  progress: number;
}

interface ModelStatus {
  name: string;
  version: string;
  references: number;
  reviewStatus: 'approved' | 'pending';
  architectureBindings: string[];
  healthStatus: 'normal' | 'warning';
}

interface WorkflowReference {
  workflow: string;
  model: string;
  version: string;
  status: 'running' | 'failed' | 'passed';
  lastRun: string;
  result: 'passed' | 'failed';
}

interface ModelTemplate {
  name: string;
  category: string;
  complexity: 'low' | 'medium' | 'high';
  usageCount: number;
}

interface ReviewFeedback {
  model: string;
  version: string;
  reviewer: string;
  type: 'critical' | 'improvement';
  issue: string;
  suggestion: string;
  status: 'open' | 'fixed';
}

// 模拟数据
const modelingTasks: ModelingTask[] = [
  {
    id: '1',
    name: '发动机控制模型',
    status: 'in_review',
    deadline: '2024-03-25',
    progress: 2,
    requirements: [
      { id: 'REQ-001', description: '响应时间 < 100ms' },
      { id: 'REQ-002', description: '控制精度 ± 0.1%' }
    ],
    assignedBy: '张工 (架构师)'
  },
  {
    id: '2',
    name: '变速器模型',
    status: 'in_progress',
    deadline: '2024-03-28',
    progress: 1,
    requirements: [
      { id: 'REQ-003', description: '换挡时间 < 200ms' }
    ],
    assignedBy: '李工 (项目经理)'
  }
];

const modelVersions: ModelVersion[] = [
  {
    name: '发动机控制模型',
    version: 'v2.1',
    format: 'Simulink',
    size: '15.2MB',
    uploadTime: '2024-03-19 15:30',
    status: 'uploading',
    progress: 85
  },
  {
    name: '变速器模型',
    version: 'v1.5',
    format: 'FMU',
    size: '8.5MB',
    uploadTime: '2024-03-18 14:20',
    status: 'completed',
    progress: 100
  }
];

const modelStatus: ModelStatus[] = [
  {
    name: '发动机控制模型',
    version: 'v2.0',
    references: 5,
    reviewStatus: 'approved',
    architectureBindings: ['动力总成系统', '控制系统'],
    healthStatus: 'normal'
  },
  {
    name: '变速器模型',
    version: 'v1.5',
    references: 3,
    reviewStatus: 'pending',
    architectureBindings: ['传动系统'],
    healthStatus: 'warning'
  }
];

const workflowReferences: WorkflowReference[] = [
  {
    workflow: '整车性能评估',
    model: '发动机控制模型',
    version: 'v2.0',
    status: 'running',
    lastRun: '2024-03-19',
    result: 'passed'
  },
  {
    workflow: '动力系统测试',
    model: '变速器模型',
    version: 'v1.5',
    status: 'failed',
    lastRun: '2024-03-18',
    result: 'failed'
  }
];

const modelTemplates: ModelTemplate[] = [
  {
    name: '2输入1输出控制器',
    category: '控制器',
    complexity: 'low',
    usageCount: 25
  },
  {
    name: '标准传感器模型',
    category: '传感器',
    complexity: 'medium',
    usageCount: 18
  }
];

const reviewFeedback: ReviewFeedback[] = [
  {
    model: '变速器模型',
    version: 'v1.4',
    reviewer: '王工',
    type: 'critical',
    issue: '模型响应时间超出规范',
    suggestion: '建议优化控制算法，减少计算复杂度',
    status: 'open'
  },
  {
    model: '发动机控制模型',
    version: 'v1.9',
    reviewer: '李工',
    type: 'improvement',
    issue: '缺少异常处理机制',
    suggestion: '添加传感器故障检测和处理逻辑',
    status: 'fixed'
  }
];

export const ModelingEngineerDashboard: React.FC = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* 快速操作按钮 */}
        <Col span={24}>
          <Card>
            <Space size="large">
              <Button type="primary" icon={<PlusOutlined />}>
                新建模型
              </Button>
              <Button icon={<EditOutlined />}>
                从模板创建
              </Button>
              <Button icon={<UploadOutlined />}>
                上传模型
              </Button>
              <Button icon={<MessageOutlined />}>
                查看评审
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 我的建模任务面板 */}
        <Col span={24}>
          <Card title="我的建模任务" extra={<Button type="link" icon={<FileSearchOutlined />}>需求追溯</Button>}>
            <List
              dataSource={modelingTasks}
              renderItem={(task: ModelingTask) => (
                <List.Item
                  actions={[
                    <Button type="link" key="continue">继续建模</Button>,
                    <Button type="link" key="review">查看评审</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        {task.name}
                        <Tag color={task.status === 'in_review' ? 'warning' : 'processing'}>
                          {task.status === 'in_review' ? '评审中' : '进行中'}
                        </Tag>
                        <span style={{ color: '#999' }}>来自: {task.assignedBy}</span>
                      </Space>
                    }
                    description={
                      <>
                        <div style={{ marginBottom: 8 }}>
                          <ClockCircleOutlined /> 截止日期: {task.deadline}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          需求列表:
                          {task.requirements.map(req => (
                            <Tag key={req.id} style={{ marginLeft: 8 }}>
                              {req.id}: {req.description}
                            </Tag>
                          ))}
                        </div>
                        <Steps size="small" current={task.progress}>
                          <Step title="建模" />
                          <Step title="评审" />
                          <Step title="发布" />
                        </Steps>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 模型上传与版本管理 */}
        <Col span={12}>
          <Card title="模型上传与版本管理" extra={<Button type="link" icon={<SyncOutlined />}>版本历史</Button>}>
            <List
              dataSource={modelVersions}
              renderItem={(model: ModelVersion) => (
                <List.Item
                  actions={[
                    <Button 
                      type="link" 
                      key={model.status === 'completed' ? 'download' : 'resume'}
                    >
                      {model.status === 'completed' ? '下载' : '续传'}
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        {model.name}
                        <Tag color="blue">{model.format}</Tag>
                        <Tag>{model.version}</Tag>
                      </Space>
                    }
                    description={
                      <>
                        <div>
                          <span>大小: {model.size}</span>
                          <span style={{ marginLeft: 16 }}>上传时间: {model.uploadTime}</span>
                        </div>
                        {model.status === 'uploading' && (
                          <Progress percent={model.progress} size="small" status="active" />
                        )}
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 模型状态追踪器 */}
        <Col span={12}>
          <Card title="模型状态追踪器" extra={<Button type="link" icon={<LinkOutlined />}>查看详情</Button>}>
            <Table
              dataSource={modelStatus}
              columns={[
                {
                  title: '模型',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text: string, record: ModelStatus) => (
                    <Space>
                      {text}
                      <Tag>{record.version}</Tag>
                    </Space>
                  )
                },
                {
                  title: '引用次数',
                  dataIndex: 'references',
                  key: 'references',
                  render: (count: number) => <Tag color="blue">{count}</Tag>
                },
                {
                  title: '审核状态',
                  dataIndex: 'reviewStatus',
                  key: 'reviewStatus',
                  render: (status: string) => (
                    <Tag color={status === 'approved' ? 'success' : 'warning'}>
                      {status === 'approved' ? '已通过' : '待审核'}
                    </Tag>
                  )
                },
                {
                  title: '运行状态',
                  dataIndex: 'healthStatus',
                  key: 'healthStatus',
                  render: (status: string) => (
                    <Tag color={status === 'normal' ? 'success' : 'error'}>
                      {status === 'normal' ? '正常' : '异常'}
                    </Tag>
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 模型工作流引用列表 */}
        <Col span={12}>
          <Card title="工作流引用列表" extra={<Button type="link" icon={<BranchesOutlined />}>全部引用</Button>}>
            <Table
              dataSource={workflowReferences}
              columns={[
                { 
                  title: '工作流',
                  dataIndex: 'workflow',
                  key: 'workflow'
                },
                {
                  title: '模型版本',
                  dataIndex: 'version',
                  key: 'version',
                  render: (version: string) => <Tag>{version}</Tag>
                },
                {
                  title: '运行状态',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => (
                    <Tag color={
                      status === 'running' ? 'processing' :
                      status === 'failed' ? 'error' : 'success'
                    }>
                      {status === 'running' ? '运行中' :
                       status === 'failed' ? '失败' : '成功'}
                    </Tag>
                  )
                },
                { 
                  title: '最后运行',
                  dataIndex: 'lastRun',
                  key: 'lastRun'
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 快速建模入口 */}
        <Col span={12}>
          <Card title="快速建模入口" extra={<Button type="link" icon={<PlusOutlined />}>使用模板</Button>}>
            <Table
              dataSource={modelTemplates}
              columns={[
                { 
                  title: '模板名称',
                  dataIndex: 'name',
                  key: 'name'
                },
                { 
                  title: '类别',
                  dataIndex: 'category',
                  key: 'category'
                },
                {
                  title: '复杂度',
                  dataIndex: 'complexity',
                  key: 'complexity',
                  render: (complexity: string) => (
                    <Tag color={
                      complexity === 'low' ? 'success' :
                      complexity === 'medium' ? 'warning' : 'error'
                    }>
                      {complexity === 'low' ? '低' :
                       complexity === 'medium' ? '中' : '高'}
                    </Tag>
                  )
                },
                { 
                  title: '使用次数',
                  dataIndex: 'usageCount',
                  key: 'usageCount'
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 模型评审与修复建议 */}
        <Col span={24}>
          <Card title="模型评审与修复建议" extra={<Button type="link" icon={<RobotOutlined />}>AI 分析</Button>}>
            <Timeline
              items={reviewFeedback.map((feedback: ReviewFeedback) => ({
                color: feedback.type === 'critical' ? 'red' : 'blue',
                children: (
                  <Card size="small" key={`${feedback.model}-${feedback.version}`}>
                    <List.Item.Meta
                      title={
                        <Space>
                          {feedback.model}
                          <Tag>{feedback.version}</Tag>
                          <Tag color={feedback.type === 'critical' ? 'error' : 'warning'}>
                            {feedback.type === 'critical' ? '严重问题' : '建议改进'}
                          </Tag>
                          <Tag color={feedback.status === 'fixed' ? 'success' : 'processing'}>
                            {feedback.status === 'fixed' ? '已修复' : '待处理'}
                          </Tag>
                        </Space>
                      }
                      description={
                        <>
                          <div style={{ margin: '8px 0' }}>
                            <strong>问题：</strong>{feedback.issue}
                          </div>
                          <div style={{ margin: '8px 0' }}>
                            <strong>建议：</strong>{feedback.suggestion}
                          </div>
                          <div>
                            <strong>评审人：</strong>{feedback.reviewer}
                          </div>
                        </>
                      }
                    />
                  </Card>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}; 
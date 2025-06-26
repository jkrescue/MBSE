import React from 'react';
import { Row, Col, Card, List, Tag, Progress, Badge, Button, Table, Timeline, Statistic } from 'antd';
import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ApiOutlined,
  LinkOutlined,
  CloudOutlined
} from '@ant-design/icons';

// 模拟数据
const projects = [
  {
    id: '1',
    name: '智能驾驶系统项目',
    progress: 75,
    milestone: '架构设计评审',
    status: 'normal',
    risks: 2
  },
  {
    id: '2',
    name: '车载控制器项目',
    progress: 45,
    milestone: '需求分析',
    status: 'warning',
    risks: 3
  },
  {
    id: '3',
    name: '动力系统项目',
    progress: 90,
    milestone: '系统测试',
    status: 'success',
    risks: 0
  }
];

const notifications = [
  {
    id: '1',
    type: 'approval',
    title: '模型审批请求',
    content: '动力系统模型等待审批',
    time: '10分钟前'
  },
  {
    id: '2',
    type: 'warning',
    title: '项目风险提醒',
    content: '车载控制器项目进度延迟',
    time: '30分钟前'
  },
  {
    id: '3',
    type: 'info',
    title: '里程碑完成',
    content: '智能驾驶系统架构设计通过评审',
    time: '2小时前'
  }
];

// 仿真资源数据
const simulationResources = [
  {
    name: '车辆动力学模型',
    type: '仿真模型',
    status: 'running',
    references: 15,
    lastUsed: '2024-03-20'
  },
  {
    name: '制动系统分析',
    type: '仿真应用',
    status: 'online',
    references: 8,
    lastUsed: '2024-03-19'
  },
  {
    name: '整车性能评估',
    type: '标准工作流',
    status: 'completed',
    references: 12,
    lastUsed: '2024-03-18'
  }
];

// 工作流统计
const workflowStats = [
  {
    name: '悬架系统分析流程',
    publishDate: '2024-03-15',
    usageCount: 25,
    status: 'active'
  },
  {
    name: '空气动力学分析流程',
    publishDate: '2024-03-10',
    usageCount: 18,
    status: 'active'
  }
];

// 应用状态数据
const appStatus = [
  {
    name: 'CAE分析器',
    status: 'online',
    errorCount: 0,
    uptime: '99.9%'
  },
  {
    name: '仿真求解器',
    status: 'warning',
    errorCount: 2,
    uptime: '98.5%'
  }
];

// 团队成员任务
const teamTasks = [
  {
    member: '张工',
    role: '系统架构师',
    task: '系统架构设计',
    status: 'in-progress',
    deadline: '2024-03-25'
  },
  {
    member: '李工',
    role: '仿真工程师',
    task: '动力学仿真',
    status: 'review',
    deadline: '2024-03-23'
  }
];

export const ProjectManagerDashboard: React.FC = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* 项目卡片 */}
        {projects.map(project => (
          <Col span={8} key={project.id}>
            <Card
              title={project.name}
              extra={
                <Tag color={
                  project.status === 'warning' ? 'warning' :
                  project.status === 'success' ? 'success' : 'processing'
                }>
                  {project.status === 'warning' ? '需关注' :
                   project.status === 'success' ? '正常' : '进行中'}
                </Tag>
              }
            >
              <Progress percent={project.progress} />
              <div style={{ marginTop: 16 }}>
                <p>
                  <ClockCircleOutlined /> 当前里程碑：{project.milestone}
                </p>
                <p>
                  <WarningOutlined /> 风险项：
                  <Tag color={project.risks > 0 ? 'error' : 'success'}>
                    {project.risks}
                  </Tag>
                </p>
              </div>
              <Button type="link" block>
                查看详情
              </Button>
            </Card>
          </Col>
        ))}

        {/* 仿真资源使用情况 */}
        <Col span={12}>
          <Card title={<><AppstoreOutlined /> 仿真资源使用情况</>}>
            <Table
              dataSource={simulationResources}
              columns={[
                { title: '资源名称', dataIndex: 'name' },
                { title: '类型', dataIndex: 'type' },
                {
                  title: '状态',
                  dataIndex: 'status',
                  render: (status) => (
                    <Tag color={
                      status === 'running' ? 'processing' :
                      status === 'online' ? 'success' :
                      status === 'completed' ? 'default' : 'error'
                    }>
                      {status}
                    </Tag>
                  )
                },
                { title: '引用次数', dataIndex: 'references' }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 工作流发布统计 */}
        <Col span={12}>
          <Card title={<><ApiOutlined /> 工作流发布统计</>}>
            <Table
              dataSource={workflowStats}
              columns={[
                { title: '工作流名称', dataIndex: 'name' },
                { title: '发布日期', dataIndex: 'publishDate' },
                { title: '使用次数', dataIndex: 'usageCount' },
                {
                  title: '状态',
                  dataIndex: 'status',
                  render: (status) => (
                    <Badge status={status === 'active' ? 'success' : 'default'} text={status} />
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 应用状态监控 */}
        <Col span={12}>
          <Card title={<><CloudOutlined /> 应用状态监控</>}>
            {appStatus.map(app => (
              <Card.Grid style={{ width: '50%', textAlign: 'center' }} key={app.name}>
                <Statistic
                  title={app.name}
                  value={app.uptime}
                  valueStyle={{ color: app.status === 'online' ? '#52c41a' : '#faad14' }}
                  prefix={<Badge status={app.status === 'online' ? 'success' : 'warning'} />}
                />
                <div>错误次数：{app.errorCount}</div>
              </Card.Grid>
            ))}
          </Card>
        </Col>

        {/* 成员任务协作板 */}
        <Col span={12}>
          <Card title={<><TeamOutlined /> 成员/任务协作板</>}>
            <Table
              dataSource={teamTasks}
              columns={[
                { title: '成员', dataIndex: 'member' },
                { title: '角色', dataIndex: 'role' },
                { title: '任务', dataIndex: 'task' },
                {
                  title: '状态',
                  dataIndex: 'status',
                  render: (status) => (
                    <Tag color={
                      status === 'in-progress' ? 'processing' :
                      status === 'review' ? 'warning' : 'success'
                    }>
                      {status === 'in-progress' ? '进行中' :
                       status === 'review' ? '待评审' : '完成'}
                    </Tag>
                  )
                },
                { title: '截止日期', dataIndex: 'deadline' }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 项目集成追溯图 */}
        <Col span={24}>
          <Card title={<><LinkOutlined /> 项目集成追溯图</>}>
            <Timeline
              mode="alternate"
              items={[
                {
                  children: '需求分析：用户需求文档 v1.2',
                  color: 'green',
                  dot: <LinkOutlined />
                },
                {
                  children: '系统架构：高层设计文档 v2.0',
                  color: 'blue',
                  dot: <LinkOutlined />
                },
                {
                  children: '详细设计：组件设计规格 v1.5',
                  color: 'blue',
                  dot: <LinkOutlined />
                },
                {
                  children: '仿真验证：动力学仿真报告 v1.0',
                  color: 'purple',
                  dot: <LinkOutlined />
                }
              ]}
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button type="primary">
                查看完整追溯关系
              </Button>
            </div>
          </Card>
        </Col>

        {/* 提醒中心 */}
        <Col span={24}>
          <Card
            title={
              <span>
                <BellOutlined /> 提醒中心
                <Badge count={notifications.length} style={{ marginLeft: 8 }} />
              </span>
            }
          >
            <List
              dataSource={notifications}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      item.type === 'approval' ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                      item.type === 'warning' ? <WarningOutlined style={{ color: '#faad14' }} /> :
                      <BellOutlined style={{ color: '#1890ff' }} />
                    }
                    title={item.title}
                    description={
                      <>
                        <div>{item.content}</div>
                        <small style={{ color: '#999' }}>{item.time}</small>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}; 
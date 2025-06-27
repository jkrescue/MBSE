import React, { useState, useRef } from 'react';
import { Row, Col, Card, List, Tag, Progress, Badge, Button, Table, Timeline, Statistic, Modal, InputNumber, Select, message, Popconfirm, Drawer, Avatar, Space, Typography } from 'antd';
import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ApiOutlined,
  LinkOutlined,
  CloudOutlined,
  MessageOutlined,
  UserOutlined
} from '@ant-design/icons';
import userIcon from '../../user.png';
import messageIcon from '../../message.png';
const { Text } = Typography;

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

// 新增：项目详细信息（工业仿真背景）
const projectDetails = [
  {
    id: '1',
    name: '智能驾驶系统项目',
    description: '面向智能网联汽车的工业级仿真平台开发，涵盖动力学、控制、感知等多学科协同。',
    objectives: [
      '实现整车动力学高保真仿真',
      '支持多源传感器数据融合',
      '集成自动驾驶算法测试与验证'
    ],
    stakeholders: ['系统架构师', '仿真工程师', '测试工程师', '客户代表'],
    timeline: [
      { phase: '需求分析', start: '2025-01-01', end: '2025-01-15' },
      { phase: '系统设计', start: '2025-01-16', end: '2025-02-10' },
      { phase: '模型开发', start: '2025-02-11', end: '2025-03-15' },
      { phase: '仿真验证', start: '2025-03-16', end: '2025-04-10' },
      { phase: '交付与评审', start: '2025-04-11', end: '2025-04-30' }
    ],
    deliverables: [
      '动力学仿真模型',
      '自动驾驶算法集成包',
      '仿真验证报告',
      '用户操作手册'
    ],
    risks: [
      '模型精度不达标',
      '算法集成延迟',
      '硬件资源不足',
      '需求变更频繁'
    ],
    budget: '¥2,000,000',
    progress: 75
  },
  {
    id: '2',
    name: '车载控制器项目',
    description: '开发新一代车载控制器仿真与测试平台，支持硬件在环（HIL）与软件在环（SIL）测试。',
    objectives: [
      '实现控制器模型自动生成',
      '支持实时仿真与故障注入',
      '提升测试自动化水平'
    ],
    stakeholders: ['控制工程师', '测试工程师', '项目经理'],
    timeline: [
      { phase: '需求分析', start: '2025-01-05', end: '2025-01-20' },
      { phase: '系统设计', start: '2025-01-21', end: '2025-02-15' },
      { phase: '模型开发', start: '2025-02-16', end: '2025-03-20' },
      { phase: '仿真验证', start: '2025-03-21', end: '2025-04-15' },
      { phase: '交付与评审', start: '2025-04-16', end: '2025-05-01' }
    ],
    deliverables: [
      '控制器仿真模型',
      '测试用例库',
      '自动化测试报告'
    ],
    risks: [
      '实时性瓶颈',
      '测试用例覆盖不足',
      '接口协议变更'
    ],
    budget: '¥1,200,000',
    progress: 45
  },
  {
    id: '3',
    name: '动力系统项目',
    description: '针对新能源汽车动力系统的多物理场仿真与优化，提升能效与可靠性。',
    objectives: [
      '构建多物理场耦合仿真模型',
      '优化能耗与热管理',
      '支持多方案对比分析'
    ],
    stakeholders: ['动力工程师', '仿真专家', '项目经理'],
    timeline: [
      { phase: '需求分析', start: '2025-01-10', end: '2025-01-25' },
      { phase: '系统设计', start: '2025-01-26', end: '2025-02-20' },
      { phase: '模型开发', start: '2025-02-21', end: '2025-03-25' },
      { phase: '仿真验证', start: '2025-03-26', end: '2025-04-20' },
      { phase: '交付与评审', start: '2025-04-21', end: '2025-05-10' }
    ],
    deliverables: [
      '多物理场仿真模型',
      '能耗优化报告',
      '热管理分析文档'
    ],
    risks: [
      '模型耦合复杂',
      '仿真计算资源紧张',
      '优化目标冲突'
    ],
    budget: '¥1,800,000',
    progress: 90
  }
];

// 重点关注项目示例数据扩展为5个
const focusProjects = [
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
  },
  {
    id: '4',
    name: '热管理仿真平台',
    progress: 60,
    milestone: '仿真模型开发',
    status: 'normal',
    risks: 1
  },
  {
    id: '5',
    name: '整车能耗优化',
    progress: 30,
    milestone: '数据采集',
    status: 'warning',
    risks: 4
  }
];

export const ProjectManagerDashboard: React.FC = () => {
  // 交互性状态
  const [projectList, setProjectList] = useState(projects);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingProgress, setEditingProgress] = useState<number>(0);
  const [teamTaskList, setTeamTaskList] = useState(teamTasks);
  const [notificationsList, setNotificationsList] = useState(notifications);
  const [selectedTrace, setSelectedTrace] = useState<any>(null);
  const [msgDrawerOpen, setMsgDrawerOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const carouselRef = useRef<any>(null);

  const showProjects = focusProjects.slice(focusIndex, focusIndex + 3);
  const handlePrev = () => setFocusIndex(i => (i - 1 + focusProjects.length) % (focusProjects.length - 2));
  const handleNext = () => setFocusIndex(i => (i + 1) % (focusProjects.length - 2));

  // 项目进度编辑
  const openEditProgress = (project: any) => {
    setEditingProject(project);
    setEditingProgress(project.progress);
  };
  const handleEditProgressOk = () => {
    setProjectList(list => list.map(p => p.id === editingProject.id ? { ...p, progress: editingProgress } : p));
    setEditingProject(null);
    message.success('进度已更新');
  };

  // 任务状态切换
  const handleTaskStatusChange = (value: string, record: any) => {
    setTeamTaskList(list => list.map(t => t.member === record.member ? { ...t, status: value } : t));
    message.success('任务状态已更新');
  };

  // 通知已读/删除
  const handleNotificationRead = (id: string) => {
    setNotificationsList(list => list.filter(n => n.id !== id));
    message.info('消息已处理');
  };

  // 追溯节点详情
  const traceItems = [
    { key: 1, children: '需求分析：用户需求文档 v1.2', color: 'green', dot: <LinkOutlined />, detail: '工业仿真项目需求分析，聚焦动力学与控制系统。' },
    { key: 2, children: '系统架构：高层设计文档 v2.0', color: 'blue', dot: <LinkOutlined />, detail: '系统架构设计，包含仿真平台与数据流。' },
    { key: 3, children: '详细设计：组件设计规格 v1.5', color: 'blue', dot: <LinkOutlined />, detail: '详细设计各工业仿真子系统组件。' },
    { key: 4, children: '仿真验证：动力学仿真报告 v1.0', color: 'purple', dot: <LinkOutlined />, detail: '动力学仿真验证，报告覆盖典型工况。' }
  ];

  // 系统架构师参与的项目（复用项目详情数据，筛选干系人包含“系统架构师”）
  const architectProjects = projectDetails.filter(p => p.stakeholders.includes('系统架构师'));
  // 系统架构师任务（可从团队任务中筛选，或模拟）
  const architectTasks = [
    {
      key: '1',
      project: '智能驾驶系统项目',
      task: '系统架构设计',
      status: 'in-progress',
      deadline: '2024-03-25'
    },
    {
      key: '2',
      project: '智能驾驶系统项目',
      task: '架构评审材料准备',
      status: 'review',
      deadline: '2024-03-28'
    }
  ];

  return (
    <div>
      {/* 顶部栏：右上角消息通知icon，用户头像左侧 */}
      <Row justify="end" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <span style={{ position: 'relative', display: 'inline-block', marginRight: 28, cursor: 'pointer' }} onClick={() => setMsgDrawerOpen(true)}>
            <img src={messageIcon} alt="消息" style={{ width: 30, verticalAlign: 'middle' }} />
            {notificationsList.length > 0 && (
              <span style={{ position: 'absolute', top: -6, right: -6, background: '#d32f2f', color: '#fff', borderRadius: '50%', padding: '0 7px', fontSize: 13, fontWeight: 700, minWidth: 20, textAlign: 'center', border: '2px solid #fff' }}>{notificationsList.length}</span>
            )}
          </span>
          <img src={userIcon} alt="用户" style={{ width: 36, borderRadius: '50%', verticalAlign: 'middle', border: '2px solid #1976d2' }} />
        </Col>
      </Row>

      {/* 重点关注项目 Banner 卡片轮播，带左右切换按钮 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={<Space><AppstoreOutlined />重点关注项目</Space>}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Button
                style={{ position: 'absolute', left: -18, top: '50%', zIndex: 2, transform: 'translateY(-50%)' }}
                shape="circle"
                icon={<span style={{ fontSize: 18 }}>{'<'}</span>}
                onClick={handlePrev}
              />
              <Button
                style={{ position: 'absolute', right: -18, top: '50%', zIndex: 2, transform: 'translateY(-50%)' }}
                shape="circle"
                icon={<span style={{ fontSize: 18 }}>{'>'}</span>}
                onClick={handleNext}
              />
              <Row gutter={16} justify="center" align="stretch" style={{ minHeight: 180 }}>
                {showProjects.map(project => (
                  <Col span={8} key={project.id} style={{ display: 'flex' }}>
                    <Card
                      title={<Text strong>{project.name}</Text>}
                      extra={
                        <Tag color={
                          project.status === 'warning' ? 'warning' :
                          project.status === 'success' ? 'success' : 'processing'
                        }>
                          {project.status === 'warning' ? '需关注' : project.status === 'success' ? '正常' : '进行中'}
                        </Tag>
                      }
                      style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 180 }}
                      bodyStyle={{ background: 'transparent', borderRadius: 8, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0 0 8px 0' }}
                    >
                      <div style={{ flex: 1 }}>
                        <Progress percent={project.progress} />
                        <div style={{ marginTop: 10 }}>
                          <p style={{ fontWeight: 500, marginBottom: 6 }}>
                            <ClockCircleOutlined style={{ color: '#1976d2', marginRight: 4 }} /> 当前里程碑：{project.milestone}
                          </p>
                          <p style={{ fontWeight: 500, marginBottom: 0 }}>
                            <WarningOutlined style={{ color: '#d32f2f', marginRight: 4 }} /> 风险项：
                            <Tag color={project.risks > 0 ? 'error' : 'success'}>
                              {project.risks}
                            </Tag>
                          </p>
                        </div>
                      </div>
                      <Button type="link" block style={{ fontWeight: 600, fontSize: 15, marginTop: 8, alignSelf: 'flex-end' }}>
                        查看详情
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 仿真资源使用情况 */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title={<Space><AppstoreOutlined />仿真资源使用情况</Space>}>
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
              style={{ borderRadius: 8, overflow: 'hidden' }}
              rowClassName={(record, index) => index % 2 === 0 ? 'ant-table-row-light' : ''}
            />
          </Card>
        </Col>

        {/* 工作流发布统计 */}
        <Col span={12}>
          <Card title={<Space><ApiOutlined />工作流发布统计</Space>}>
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
              style={{ borderRadius: 8, overflow: 'hidden' }}
              rowClassName={(record, index) => index % 2 === 0 ? 'ant-table-row-light' : ''}
            />
          </Card>
        </Col>

        {/* 应用状态监控 */}
        <Col span={12}>
          <Card title={<Space><CloudOutlined />应用状态监控</Space>}>
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

        {/* 成员任务协作板（状态可交互） */}
        <Col span={12}>
          <Card title={<Space><TeamOutlined />成员/任务协作板</Space>}>
            <Table
              dataSource={teamTaskList}
              columns={[
                { title: '成员', dataIndex: 'member' },
                { title: '角色', dataIndex: 'role' },
                { title: '任务', dataIndex: 'task' },
                {
                  title: '状态',
                  dataIndex: 'status',
                  render: (status, record) => (
                    <Select
                      value={status}
                      style={{ width: 100 }}
                      onChange={value => handleTaskStatusChange(value, record)}
                      options={[
                        { value: 'in-progress', label: '进行中' },
                        { value: 'review', label: '待评审' },
                        { value: 'done', label: '完成' }
                      ]}
                    />
                  )
                },
                { title: '截止日期', dataIndex: 'deadline' }
              ]}
              pagination={false}
              size="small"
              style={{ borderRadius: 8, overflow: 'hidden' }}
              rowClassName={(record, index) => index % 2 === 0 ? 'ant-table-row-light' : ''}
            />
          </Card>
        </Col>

        {/* 项目集成追溯图（节点可点详情） */}
        <Col span={24}>
          <Card title={<Space><LinkOutlined />项目集成追溯图</Space>}>
            <Timeline
              mode="alternate"
              items={traceItems.map(item => ({
                ...item,
                dot: <span style={{ cursor: 'pointer' }} onClick={() => setSelectedTrace(item)}>{item.dot}</span>
              }))}
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button type="primary">
                查看完整追溯关系
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      {/* 项目进度编辑弹窗 */}
      <Modal
        title={editingProject ? `调整进度 - ${editingProject.name}` : ''}
        open={!!editingProject}
        onOk={handleEditProgressOk}
        onCancel={() => setEditingProject(null)}
      >
        <InputNumber
          min={0}
          max={100}
          value={editingProgress}
          onChange={v => setEditingProgress(Number(v))}
          addonAfter="%"
        />
      </Modal>
      {/* 追溯节点详情弹窗 */}
      <Modal
        title={selectedTrace ? selectedTrace.children : ''}
        open={!!selectedTrace}
        onOk={() => setSelectedTrace(null)}
        onCancel={() => setSelectedTrace(null)}
        footer={null}
      >
        <div>{selectedTrace?.detail}</div>
      </Modal>
      {/* 项目完整信息卡片 */}
      <Row gutter={[16, 16]} style={{ marginTop: 0 }}>
        <Col span={24}>
          <Card title={<Space><AppstoreOutlined />项目完整信息（工业仿真）</Space>}>
            <Table
              dataSource={projectDetails}
              rowKey="id"
              pagination={false}
              expandable={{
                expandedRowRender: record => (
                  <div>
                    <p><b>项目简介：</b>{record.description}</p>
                    <p><b>目标：</b>{record.objectives.join('，')}</p>
                    <p><b>干系人：</b>{record.stakeholders.join('，')}</p>
                    <p><b>交付物：</b>{record.deliverables.join('，')}</p>
                    <p><b>风险：</b>{record.risks.join('，')}</p>
                    <p><b>预算：</b>{record.budget}</p>
                    <p><b>进度：</b><Progress percent={record.progress} size="small" /></p>
                    <b>里程碑：</b>
                    <ul style={{ marginBottom: 0 }}>
                      {record.timeline.map((t: any, idx: number) => (
                        <li key={idx}>{t.phase}：{t.start} ~ {t.end}</li>
                      ))}
                    </ul>
                  </div>
                )
              }}
              columns={[
                { title: '项目名称', dataIndex: 'name' },
                { title: '简介', dataIndex: 'description', ellipsis: true },
                { title: '预算', dataIndex: 'budget' },
                { title: '当前进度', dataIndex: 'progress', render: (v: number) => <Progress percent={v} size="small" /> }
              ]}
              size="middle"
              style={{ borderRadius: 8, overflow: 'hidden' }}
              rowClassName={(record, index) => index % 2 === 0 ? 'ant-table-row-light' : ''}
            />
          </Card>
        </Col>
      </Row>

      {/* 消息通知抽屉 */}
      <Drawer
        title={<Space><MessageOutlined />消息通知</Space>}
        placement="right"
        open={msgDrawerOpen}
        onClose={() => setMsgDrawerOpen(false)}
        width={360}
      >
        <List
          dataSource={notificationsList}
          renderItem={item => (
            <List.Item
              actions={[
                <Popconfirm title="确定标记为已读/删除？" onConfirm={() => handleNotificationRead(item.id)} okText="确定" cancelText="取消">
                  <Button size="small" type="link">处理</Button>
                </Popconfirm>
              ]}
            >
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
      </Drawer>

      {/* 系统架构师控制台 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={<Space><TeamOutlined />系统架构师控制台</Space>}>
            <Row gutter={16}>
              <Col span={12}>
                <Card type="inner" title="参与项目" style={{ marginBottom: 16 }}>
                  <Table
                    dataSource={architectProjects}
                    rowKey="id"
                    columns={[
                      { title: '项目名称', dataIndex: 'name' },
                      { title: '简介', dataIndex: 'description', ellipsis: true },
                      { title: '进度', dataIndex: 'progress', render: (v: number) => <Progress percent={v} size="small" /> }
                    ]}
                    size="small"
                    pagination={false}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card type="inner" title="我的任务">
                  <Table
                    dataSource={architectTasks}
                    columns={[
                      { title: '项目', dataIndex: 'project' },
                      { title: '任务', dataIndex: 'task' },
                      { title: '状态', dataIndex: 'status', render: (status) => (
                        <Tag color={status === 'in-progress' ? 'processing' : status === 'review' ? 'warning' : 'success'}>
                          {status === 'in-progress' ? '进行中' : status === 'review' ? '待评审' : '完成'}
                        </Tag>
                      ) },
                      { title: '截止日期', dataIndex: 'deadline' }
                    ]}
                    size="small"
                    pagination={false}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
import React from 'react';
import { Row, Col, Card, List, Tag, Button, Progress, Table, Space, Statistic, Timeline } from 'antd';
import {
  PauseCircleOutlined,
  ReloadOutlined,
  LineChartOutlined,
  RadarChartOutlined,
  MessageOutlined,
  BranchesOutlined,
  FolderOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
  RobotOutlined
} from '@ant-design/icons';

// 运行中的仿真流程
const activeSimulations = [
  {
    id: '1',
    name: '动力系统性能仿真',
    status: 'running',
    progress: 65,
    startTime: '2024-03-19 10:00',
    components: [
      { name: 'Engine.fmu', status: 'running', progress: 70 },
      { name: 'Transmission.fmu', status: 'running', progress: 60 },
      { name: 'Vehicle.fmu', status: 'running', progress: 65 }
    ],
    logs: [
      { time: '10:15:23', level: 'info', message: '发动机模型初始化完成' },
      { time: '10:15:25', level: 'info', message: '变速器模型连接成功' },
      { time: '10:15:30', level: 'warning', message: '动力输出波动超出范围' }
    ]
  }
];

// 仿真结果数据
const simulationResults = [
  {
    name: '方案A',
    metrics: {
      performance: 85,
      efficiency: 92,
      stability: 78,
      reliability: 88,
      cost: 75
    }
  },
  {
    name: '方案B',
    metrics: {
      performance: 92,
      efficiency: 85,
      stability: 82,
      reliability: 90,
      cost: 70
    }
  }
];

// 异常诊断数据
const anomalies = [
  {
    id: '1',
    indicator: '发动机温度',
    value: '95°C',
    threshold: '85°C',
    severity: 'high',
    participants: ['张工', '李工', '王工'],
    status: 'analyzing'
  },
  {
    id: '2',
    indicator: '制动距离',
    value: '45m',
    threshold: '40m',
    severity: 'medium',
    participants: ['李工', '赵工'],
    status: 'resolved'
  }
];

// 工作流引用数据
const workflowReferences = [
  {
    workflow: '整车性能评估流程',
    project: '新能源汽车开发项目',
    author: '张工',
    type: 'standard',
    lastUsed: '2024-03-19'
  },
  {
    workflow: '制动系统验证流程',
    project: '商用车开发项目',
    author: '李工',
    type: 'custom',
    lastUsed: '2024-03-18'
  }
];

// 工况场景数据
const scenarios = [
  {
    name: '城市工况WLTC',
    type: 'standard',
    version: 'v2.0',
    lastModified: '2024-03-15',
    usage: 25
  },
  {
    name: '高速工况NEDC',
    type: 'standard',
    version: 'v1.5',
    lastModified: '2024-03-10',
    usage: 18
  },
  {
    name: '山地路况',
    type: 'custom',
    version: 'v1.0',
    lastModified: '2024-03-05',
    usage: 12
  }
];

// 仿真历史统计
const simulationHistory = {
  totalTasks: 156,
  failureRate: '5.2%',
  avgDuration: '2.5h',
  rerunCount: 12,
  monthlyStats: [
    { month: '2024-03', tasks: 45, failures: 2, avgTime: '2.3h' },
    { month: '2024-02', tasks: 52, failures: 3, avgTime: '2.6h' },
    { month: '2024-01', tasks: 59, failures: 4, avgTime: '2.5h' }
  ]
};

export const SimulationEngineerDashboard: React.FC = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* 仿真流程面板 */}
        <Col span={24}>
          <Card title="仿真流程面板" extra={<Button type="link" icon={<LineChartOutlined />}>实时监控</Button>}>
            {activeSimulations.map(sim => (
              <div key={sim.id}>
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <Tag color="processing">运行中</Tag>
                    <span>{sim.name}</span>
                    <span style={{ color: '#999' }}>开始时间: {sim.startTime}</span>
                  </Space>
                  <Space style={{ float: 'right' }}>
                    <Button icon={<PauseCircleOutlined />}>暂停</Button>
                    <Button icon={<ReloadOutlined />}>重置</Button>
                  </Space>
                </div>
                
                {/* FMU组件状态 */}
                <Row gutter={[16, 16]}>
                  {sim.components.map(comp => (
                    <Col span={8} key={comp.name}>
                      <Card size="small">
                        <Statistic
                          title={comp.name}
                          value={comp.progress}
                          suffix="%"
                          prefix={<Progress type="circle" percent={comp.progress} width={20} />}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* 仿真日志 */}
                <Timeline
                  style={{ marginTop: 16 }}
                  items={sim.logs.map(log => ({
                    color: log.level === 'warning' ? 'yellow' : 'blue',
                    children: (
                      <>
                        <Tag color={log.level === 'warning' ? 'warning' : 'default'}>{log.level}</Tag>
                        <span style={{ marginLeft: 8 }}>{log.message}</span>
                        <span style={{ color: '#999', marginLeft: 8 }}>{log.time}</span>
                      </>
                    )
                  }))}
                />
              </div>
            ))}
          </Card>
        </Col>

        {/* 仿真结果对比板 */}
        <Col span={12}>
          <Card title="仿真结果对比" extra={<Space>
            <Button type="link" icon={<RadarChartOutlined />}>雷达图</Button>
            <Button type="link" icon={<LineChartOutlined />}>曲线图</Button>
          </Space>}>
            <Table
              dataSource={simulationResults}
              columns={[
                { title: '方案', dataIndex: 'name' },
                {
                  title: '性能指标',
                  dataIndex: ['metrics', 'performance'],
                  render: (value) => <Progress percent={value} size="small" />
                },
                {
                  title: '效率指标',
                  dataIndex: ['metrics', 'efficiency'],
                  render: (value) => <Progress percent={value} size="small" />
                },
                {
                  title: '稳定性',
                  dataIndex: ['metrics', 'stability'],
                  render: (value) => <Progress percent={value} size="small" />
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 异常诊断助手 */}
        <Col span={12}>
          <Card title="异常诊断助手" extra={<Button type="link" icon={<RobotOutlined />}>AI分析</Button>}>
            <List
              dataSource={anomalies}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="link" icon={<MessageOutlined />}>发起会话</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <span>{item.indicator}</span>
                        <Tag color={item.severity === 'high' ? 'error' : 'warning'}>
                          {item.value} / {item.threshold}
                        </Tag>
                      </Space>
                    }
                    description={
                      <>
                        <div>
                          参与分析: {item.participants.map(p => (
                            <Tag key={p}>{p}</Tag>
                          ))}
                        </div>
                        <Tag color={item.status === 'analyzing' ? 'processing' : 'success'}>
                          {item.status === 'analyzing' ? '分析中' : '已解决'}
                        </Tag>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 仿真工作流引用图谱 */}
        <Col span={12}>
          <Card title="工作流引用图谱" extra={<Button type="link" icon={<BranchesOutlined />}>查看全部</Button>}>
            <Table
              dataSource={workflowReferences}
              columns={[
                { title: '工作流', dataIndex: 'workflow' },
                { title: '所属项目', dataIndex: 'project' },
                { title: '创建者', dataIndex: 'author' },
                {
                  title: '类型',
                  dataIndex: 'type',
                  render: (type) => (
                    <Tag color={type === 'standard' ? 'success' : 'default'}>
                      {type === 'standard' ? '标准流程' : '自定义'}
                    </Tag>
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 工况与场景库 */}
        <Col span={12}>
          <Card title="工况与场景库" extra={<Button type="link" icon={<FolderOutlined />}>场景管理</Button>}>
            <Table
              dataSource={scenarios}
              columns={[
                { title: '场景名称', dataIndex: 'name' },
                {
                  title: '类型',
                  dataIndex: 'type',
                  render: (type) => (
                    <Tag color={type === 'standard' ? 'success' : 'processing'}>
                      {type === 'standard' ? '标准工况' : '自定义'}
                    </Tag>
                  )
                },
                { title: '版本', dataIndex: 'version' },
                { title: '使用次数', dataIndex: 'usage' }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 仿真执行历史 */}
        <Col span={24}>
          <Card title="仿真执行历史" extra={<Button type="link" icon={<HistoryOutlined />}>详细统计</Button>}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="总任务数"
                  value={simulationHistory.totalTasks}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="失败率"
                  value={simulationHistory.failureRate}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="平均耗时"
                  value={simulationHistory.avgDuration}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="重算次数"
                  value={simulationHistory.rerunCount}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
            </Row>
            <Table
              style={{ marginTop: 16 }}
              dataSource={simulationHistory.monthlyStats}
              columns={[
                { title: '月份', dataIndex: 'month' },
                { title: '任务数', dataIndex: 'tasks' },
                {
                  title: '失败数',
                  dataIndex: 'failures',
                  render: (failures) => (
                    <Tag color="error">{failures}</Tag>
                  )
                },
                { title: '平均耗时', dataIndex: 'avgTime' }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}; 
import React from 'react';
import { Row, Col, Card, Table, Badge, Alert, List, Progress, Space, Button, Tag, Typography, Tooltip } from 'antd';
import { 
  CheckCircleOutlined, 
  WarningOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  DashboardOutlined,
  KeyOutlined,
  ApiOutlined,
  AuditOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// 类型定义
interface SimulationTool {
  name: string;
  status: 'running' | 'error' | 'warning' | 'stopped';
  container: string;
  uptime: string;
  memory: number;
  cpu: number;
}

interface LicenseStatus {
  tool: string;
  total: number;
  used: number;
  available: number;
  expireDate: string;
}

interface ServiceHealth {
  name: string;
  type: 'application' | 'workflow' | 'model';
  status: 'online' | 'failed' | 'timeout' | 'waiting';
  responseTime: number;
  lastCheck: string;
}

interface AuditLog {
  id: string;
  type: 'deployment' | 'login' | 'model' | 'system';
  action: string;
  user: string;
  resource: string;
  time: string;
  status: 'success' | 'failed';
}

interface UserPermission {
  id: string;
  name: string;
  department: string;
  role: string;
  resources: string[];
  lastActive: string;
}

// 模拟数据
const simulationTools: SimulationTool[] = [
  {
    name: 'Amesim',
    status: 'running',
    container: 'amesim-server-1',
    uptime: '15d 6h',
    memory: 45,
    cpu: 32
  },
  {
    name: 'Dymola',
    status: 'warning',
    container: 'dymola-server-1',
    uptime: '7d 12h',
    memory: 78,
    cpu: 65
  },
  {
    name: 'Star-CCM',
    status: 'error',
    container: 'star-ccm-1',
    uptime: '0d 2h',
    memory: 92,
    cpu: 88
  }
];

const licenseStatus: LicenseStatus[] = [
  {
    tool: 'Amesim',
    total: 50,
    used: 35,
    available: 15,
    expireDate: '2024-12-31'
  },
  {
    tool: 'Dymola',
    total: 30,
    used: 28,
    available: 2,
    expireDate: '2024-09-30'
  },
  {
    tool: 'Star-CCM',
    total: 20,
    used: 15,
    available: 5,
    expireDate: '2024-06-30'
  }
];

const serviceHealth: ServiceHealth[] = [
  {
    name: '动力系统仿真服务',
    type: 'application',
    status: 'online',
    responseTime: 156,
    lastCheck: '2024-03-20 10:30:00'
  },
  {
    name: '整车性能评估工作流',
    type: 'workflow',
    status: 'timeout',
    responseTime: 5000,
    lastCheck: '2024-03-20 10:29:00'
  },
  {
    name: '发动机模型服务',
    type: 'model',
    status: 'failed',
    responseTime: 0,
    lastCheck: '2024-03-20 10:28:00'
  }
];

const auditLogs: AuditLog[] = [
  {
    id: '1',
    type: 'deployment',
    action: '部署新版本',
    user: '系统管理员',
    resource: 'amesim-server',
    time: '2024-03-20 10:30:00',
    status: 'success'
  },
  {
    id: '2',
    type: 'login',
    action: '用户登录',
    user: 'john.doe',
    resource: 'web-portal',
    time: '2024-03-20 10:28:00',
    status: 'success'
  },
  {
    id: '3',
    type: 'model',
    action: '模型上传',
    user: 'jane.smith',
    resource: 'engine-model-v2',
    time: '2024-03-20 10:25:00',
    status: 'failed'
  }
];

const userPermissions: UserPermission[] = [
  {
    id: '1',
    name: '张三',
    department: '动力总成部',
    role: '仿真工程师',
    resources: ['Amesim', 'Dymola'],
    lastActive: '2024-03-20 10:00:00'
  },
  {
    id: '2',
    name: '李四',
    department: '整车开发部',
    role: '系统架构师',
    resources: ['Star-CCM', 'Amesim'],
    lastActive: '2024-03-20 09:30:00'
  }
];

export const AdminDashboard: React.FC = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* 仿真工具运行状态 */}
        <Col span={24}>
          <Card 
            title={
              <Space>
                <DashboardOutlined />
                <span>仿真工具运行状态</span>
              </Space>
            }
          >
            <Table
              dataSource={simulationTools}
              columns={[
                {
                  title: '工具名称',
                  dataIndex: 'name',
                  key: 'name'
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => (
                    <Tag color={
                      status === 'running' ? 'success' :
                      status === 'warning' ? 'warning' : 'error'
                    }>
                      {status === 'running' ? '运行中' :
                       status === 'warning' ? '警告' : '错误'}
                    </Tag>
                  )
                },
                {
                  title: '容器',
                  dataIndex: 'container',
                  key: 'container'
                },
                {
                  title: '运行时间',
                  dataIndex: 'uptime',
                  key: 'uptime'
                },
                {
                  title: '资源使用',
                  key: 'resources',
                  render: (_, record: SimulationTool) => (
                    <Space direction="vertical" size="small">
                      <Tooltip title="内存使用率">
                        <Progress 
                          percent={record.memory} 
                          size="small" 
                          status={record.memory > 80 ? "exception" : "normal"}
                        />
                      </Tooltip>
                      <Tooltip title="CPU使用率">
                        <Progress 
                          percent={record.cpu} 
                          size="small" 
                          status={record.cpu > 80 ? "exception" : "normal"}
                        />
                      </Tooltip>
                    </Space>
                  )
                },
                {
                  title: '操作',
                  key: 'action',
                  render: () => (
                    <Space>
                      <Button type="link" icon={<ReloadOutlined />}>重启</Button>
                      <Button type="link" danger>停止</Button>
                    </Space>
                  )
                }
              ]}
              pagination={false}
            />
          </Card>
        </Col>

        {/* License 监控中心 */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <KeyOutlined />
                <span>License 监控中心</span>
              </Space>
            }
          >
            <Table
              dataSource={licenseStatus}
              columns={[
                {
                  title: '工具',
                  dataIndex: 'tool',
                  key: 'tool'
                },
                {
                  title: '使用情况',
                  key: 'usage',
                  render: (_, record: LicenseStatus) => (
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Progress
                        percent={Math.round((record.used / record.total) * 100)}
                        format={() => `${record.used}/${record.total}`}
                        status={record.available < 3 ? "exception" : "normal"}
                      />
                      <Text type="secondary">
                        到期时间: {record.expireDate}
                      </Text>
                    </Space>
                  )
                },
                {
                  title: '状态',
                  key: 'status',
                  render: (_, record: LicenseStatus) => (
                    <Tag color={record.available < 3 ? 'error' : 'success'}>
                      {record.available < 3 ? '紧张' : '充足'}
                    </Tag>
                  )
                }
              ]}
              pagination={false}
            />
          </Card>
        </Col>

        {/* 应用与服务健康图谱 */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <ApiOutlined />
                <span>应用与服务健康图谱</span>
              </Space>
            }
          >
            <Table
              dataSource={serviceHealth}
              columns={[
                {
                  title: '服务名称',
                  dataIndex: 'name',
                  key: 'name'
                },
                {
                  title: '类型',
                  dataIndex: 'type',
                  key: 'type',
                  render: (type: string) => (
                    <Tag>{type}</Tag>
                  )
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => (
                    <Tag color={
                      status === 'online' ? 'success' :
                      status === 'timeout' ? 'warning' : 'error'
                    }>
                      {status === 'online' ? '在线' :
                       status === 'timeout' ? '超时' : '失败'}
                    </Tag>
                  )
                },
                {
                  title: '响应时间',
                  key: 'response',
                  render: (_, record: ServiceHealth) => (
                    <Text type={record.responseTime > 1000 ? "danger" : "success"}>
                      {record.responseTime}ms
                    </Text>
                  )
                }
              ]}
              pagination={false}
            />
          </Card>
        </Col>

        {/* 系统审计与事件日志 */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <AuditOutlined />
                <span>系统审计与事件日志</span>
              </Space>
            }
          >
            <List
              dataSource={auditLogs}
              renderItem={(log) => (
                <List.Item>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <Tag color={log.status === 'success' ? 'success' : 'error'}>
                        {log.type}
                      </Tag>
                      <Text>{log.action}</Text>
                    </Space>
                    <Text type="secondary">
                      用户: {log.user} | 资源: {log.resource} | 时间: {log.time}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 用户与权限管理 */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <TeamOutlined />
                <span>用户与权限管理</span>
              </Space>
            }
          >
            <Table
              dataSource={userPermissions}
              columns={[
                {
                  title: '用户',
                  dataIndex: 'name',
                  key: 'name'
                },
                {
                  title: '部门',
                  dataIndex: 'department',
                  key: 'department'
                },
                {
                  title: '角色',
                  dataIndex: 'role',
                  key: 'role',
                  render: (role: string) => <Tag>{role}</Tag>
                },
                {
                  title: '资源权限',
                  dataIndex: 'resources',
                  key: 'resources',
                  render: (resources: string[]) => (
                    <Space>
                      {resources.map(res => (
                        <Tag key={res} color="blue">{res}</Tag>
                      ))}
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
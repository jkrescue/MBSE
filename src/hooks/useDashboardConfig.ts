import { UserRole } from '@/types/role';
import { ReactNode } from 'react';

interface DashboardConfig {
  title: string;
  description: string;
  widgets: ReactNode[];
}

const dashboardConfigs: Record<UserRole, DashboardConfig> = {
  admin: {
    title: '平台管理员控制台',
    description: '系统状态监控和用户管理',
    widgets: [],
  },
  pm: {
    title: '项目经理控制台',
    description: '项目进度和任务管理',
    widgets: [],
  },
  arch: {
    title: '系统架构师控制台',
    description: '架构设计和接口管理',
    widgets: [],
  },
  sim: {
    title: '仿真工程师控制台',
    description: '仿真监控和数据分析',
    widgets: [],
  },
  model: {
    title: '建模工程师控制台',
    description: '模型管理和进度跟踪',
    widgets: [],
  },
};

export const useDashboardConfig = (role: UserRole): DashboardConfig => {
  return dashboardConfigs[role];
}; 
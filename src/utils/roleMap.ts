import type { UserRole } from '../types/role';

export const ROLE_NAMES: Record<UserRole, string> = {
  admin: '平台管理员',
  pm: '项目经理',
  arch: '系统架构师',
  sim: '仿真工程师',
  model: '建模工程师',
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['system.manage', 'user.manage', 'project.manage', 'dashboard.admin'],
  pm: ['project.manage', 'team.manage', 'dashboard.manager'],
  arch: ['architecture.manage', 'design.review', 'dashboard.architect'],
  sim: ['simulation.run', 'simulation.analyze', 'dashboard.simulation'],
  model: ['model.create', 'model.edit', 'dashboard.modeling'],
};

// 定义每个角色可以访问的路由
export const ROLE_ROUTES: Record<UserRole, string[]> = {
  admin: ['/dashboard', '/system', '/users', '/projects'],
  pm: ['/dashboard', '/projects', '/team'],
  arch: ['/dashboard', '/architecture', '/review'],
  sim: ['/dashboard', '/simulation'],
  model: ['/dashboard', '/modeling'],
}; 
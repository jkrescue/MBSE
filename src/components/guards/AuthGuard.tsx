import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { ROLE_ROUTES } from '../../utils/roleMap';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { currentUser } = useUserStore();
  const location = useLocation();

  if (!currentUser) {
    // 用户未登录，重定向到登录页面
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 检查用户是否有权限访问当前路由
  const userRoutes = ROLE_ROUTES[currentUser.role];
  const canAccess = userRoutes.some(route => location.pathname.startsWith(route));

  if (!canAccess) {
    // 用户无权访问当前路由，重定向到默认页面
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}; 
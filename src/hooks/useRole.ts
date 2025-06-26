import { useCallback } from 'react';
import type { User, UserRole } from '../types/role';
import { ROLE_PERMISSIONS } from '../utils/roleMap';
import { useUserStore } from '@/store/userStore';

export const useRole = () => {
  const currentUser = useUserStore((state) => state.currentUser);

  const getCurrentUser = useCallback((): User => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    return currentUser;
  }, [currentUser]);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!currentUser) return false;
    return ROLE_PERMISSIONS[currentUser.role].includes(permission);
  }, [currentUser]);

  const getUserRole = (): UserRole => {
    if (!currentUser) {
      return 'admin'; // 默认角色，实际应用中应该重定向到登录页
    }
    return currentUser.role;
  };

  return {
    getCurrentUser,
    hasPermission,
    getUserRole,
  };
}; 
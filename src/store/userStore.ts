import { create } from 'zustand';
import { authService } from '@/services/auth';
import { UserRole } from '@/types/role';

interface UserState {
  currentUser: {
    username: string;
    role: UserRole;
  } | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  switchUser: (user: { username: string; role: UserRole }) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: {
    username: 'admin_user',
    role: 'admin'
  },
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(username, password);
      set({
        currentUser: {
          username: response.username,
          role: response.role
        },
        isLoading: false
      });
    } catch (error) {
      set({ error: '登录失败', isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
      set({ currentUser: null, isLoading: false });
    } catch (error) {
      set({ error: '登出失败', isLoading: false });
    }
  },

  switchUser: (user) => {
    set({ currentUser: user });
  }
})); 
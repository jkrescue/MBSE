import { UserRole } from '@/types/role';

export interface AuthResponse {
  token: string;
  role: UserRole;
  username: string;
}

export const authService = {
  async login(username: string, _password: string): Promise<AuthResponse> {
    // 模拟登录请求
    return new Promise<AuthResponse>((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-jwt-token',
          role: 'admin' as UserRole,
          username
        });
      }, 1000);
    });
  },

  async logout(): Promise<void> {
    // 模拟登出请求
    return new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  removeToken(): void {
    localStorage.removeItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}; 
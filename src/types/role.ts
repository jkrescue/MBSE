export type UserRole = 'admin' | 'pm' | 'arch' | 'sim' | 'model';

export interface User {
  username: string;
  role: UserRole;
  avatar?: string;
  email?: string;
  token?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
} 
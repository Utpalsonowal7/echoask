import type { User } from '../types';
import { request } from './http';

export const authApi = {
  register(input: { name: string; email: string; username: string; password: string }) {
    return request<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },
  verify(input: { email: string; code: string }) {
    return request<{ user: User }>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },
  resend(email: string) {
    return request<{ message: string }>('/auth/verify/resend', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },
  login(input: { email: string; password: string }) {
    return request<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },
  logout() {
    return request<void>('/auth/logout', { method: 'POST' });
  },
  me() {
    return request<{ user: User }>('/auth/me');
  }
};


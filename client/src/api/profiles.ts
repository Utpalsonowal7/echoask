import type { PublicProfile, User } from '../types';
import { request } from './http';

export const profilesApi = {
  get(username: string) {
    return request<{ profile: PublicProfile }>(
      '/profiles/' + encodeURIComponent(username)
    );
  },
  update(input: { name?: string; bio?: string; acceptsMessages?: boolean }) {
    return request<{ user: User }>('/profiles/me', {
      method: 'PATCH',
      body: JSON.stringify(input)
    });
  }
};


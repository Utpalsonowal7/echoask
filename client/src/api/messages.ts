import type { InboxResponse } from '../types';
import { request } from './http';

export const messagesApi = {
  send(
    username: string,
    input: { content: string; senderAlias?: string }
  ) {
    return request<{ message: string; id: string }>(
      '/messages/to/' + encodeURIComponent(username),
      { method: 'POST', body: JSON.stringify(input) }
    );
  },
  inbox() {
    return request<InboxResponse>('/messages/inbox');
  },
  markRead(id: string) {
    return request<void>('/messages/' + encodeURIComponent(id) + '/read', {
      method: 'PATCH'
    });
  },
  remove(id: string) {
    return request<void>('/messages/' + encodeURIComponent(id), {
      method: 'DELETE'
    });
  }
};


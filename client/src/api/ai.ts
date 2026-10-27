import { request } from './http';

export const aiApi = {
  suggestions(context?: string) {
    return request<{ suggestions: string[] }>('/ai/suggestions', {
      method: 'POST',
      body: JSON.stringify(context ? { context } : {})
    });
  }
};


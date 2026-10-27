export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  bio: string;
  acceptsMessages: boolean;
  emailVerifiedAt: string | null;
}

export interface PublicProfile {
  name: string;
  username: string;
  bio: string;
  acceptsMessages: boolean;
  createdAt: string;
}

export interface InboxMessage {
  id: string;
  content: string;
  senderAlias: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface InboxResponse {
  messages: InboxMessage[];
  unreadCount: number;
}


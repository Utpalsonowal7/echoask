import type { InboxMessage } from '../types';
import { Button } from './Button';

export function MessageCard({
  message,
  onRead,
  onDelete
}: {
  message: InboxMessage;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const date = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(message.createdAt));

  return (
    <article className={'message-card' + (message.isRead ? '' : ' message-unread')}>
      <div className="message-card-top">
        <div className="message-sender">
          <span className="sender-avatar" aria-hidden="true">
            {message.senderAlias ? message.senderAlias.charAt(0).toUpperCase() : '✳'}
          </span>
          <div>
            <strong>{message.senderAlias || 'Anonymous'}</strong>
            <time dateTime={message.createdAt}>{date}</time>
          </div>
        </div>
        {!message.isRead && <span className="unread-pill">New</span>}
      </div>
      <p className="message-content">{message.content}</p>
      <div className="message-actions">
        {!message.isRead && (
          <Button variant="quiet" size="small" onClick={() => onRead(message.id)}>
            Mark as read
          </Button>
        )}
        <Button variant="quiet" size="small" onClick={() => onDelete(message.id)}>
          Delete
        </Button>
      </div>
    </article>
  );
}


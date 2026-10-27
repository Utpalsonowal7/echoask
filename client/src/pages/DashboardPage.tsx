import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { messagesApi } from '../api/messages';
import { profilesApi } from '../api/profiles';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { MessageCard } from '../components/MessageCard';
import { AppShell } from '../components/AppShell';
import { useAuth } from '../context/AuthContext';
import type { InboxMessage } from '../types';

type Filter = 'all' | 'unread';

export function DashboardPage() {
  const { user, setUser } = useAuth();
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');

  const loadInbox = useCallback(async () => {
    setError('');
    try {
      const inbox = await messagesApi.inbox();
      setMessages(inbox.messages);
      setUnreadCount(inbox.unreadCount);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Your inbox could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInbox();
  }, [loadInbox]);

  useEffect(() => {
    setBio(user?.bio || '');
  }, [user?.bio]);

  const visibleMessages = useMemo(
    () => filter === 'unread' ? messages.filter((message) => !message.isRead) : messages,
    [messages, filter]
  );
  const publicUrl = user ? window.location.origin + '/u/' + user.username : '';

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Copy was unavailable. You can select the profile link below.');
    }
  }

  async function handleRead(id: string) {
    try {
      await messagesApi.markRead(id);
      setMessages((items) => items.map((item) => item.id === id ? { ...item, isRead: true } : item));
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Could not update this note.');
    }
  }

  async function handleDelete(id: string) {
    try {
      await messagesApi.remove(id);
      const removed = messages.find((message) => message.id === id);
      setMessages((items) => items.filter((item) => item.id !== id));
      if (removed && !removed.isRead) setUnreadCount((count) => Math.max(0, count - 1));
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Could not delete this note.');
    }
  }

  async function toggleMessages() {
    if (!user) return;
    setSaving(true);
    setError('');
    try {
      const result = await profilesApi.update({ acceptsMessages: !user.acceptsMessages });
      setUser(result.user);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Could not update your settings.');
    } finally {
      setSaving(false);
    }
  }

  async function saveBio() {
    setSaving(true);
    setError('');
    try {
      const result = await profilesApi.update({ bio });
      setUser(result.user);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <AppShell>
      <section className="dashboard">
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">Your private space</span>
            <h1>Hi, {user.name.split(' ')[0]} <span className="wave">✳</span></h1>
            <p className="muted">Here’s what’s been left in your corner.</p>
          </div>
          <div className="dashboard-heading-actions">
            <Button variant="secondary" onClick={toggleMessages} disabled={saving}>
              <span className={user.acceptsMessages ? 'status-dot status-on' : 'status-dot'} />
              {user.acceptsMessages ? 'Accepting notes' : 'Paused'}
            </Button>
          </div>
        </div>

        {error && <p className="form-error dashboard-error" role="alert">{error}</p>}

        <div className="share-panel">
          <div className="share-copy">
            <span className="card-kicker">Your shareable link</span>
            <strong>{publicUrl}</strong>
            <span className="muted">Anyone with the link can send you an anonymous note.</span>
          </div>
          <Button onClick={copyLink}>{copied ? 'Copied!' : 'Copy link'} <span>↗</span></Button>
          <Link className="share-preview" to={'/u/' + user.username} aria-label="Open public page">↗</Link>
        </div>

        <div className="dashboard-grid">
          <aside className="dashboard-sidebar">
            <div className="stat-card">
              <span className="stat-icon">✉</span>
              <span className="stat-label">All notes</span>
              <strong>{messages.length}</strong>
            </div>
            <div className="stat-card stat-card-purple">
              <span className="stat-icon">✳</span>
              <span className="stat-label">Unread</span>
              <strong>{unreadCount}</strong>
            </div>
            <div className="settings-card">
              <span className="card-kicker">Your profile</span>
              <label className="field" htmlFor="profile-bio">
                <span className="field-label">Short bio</span>
                <textarea id="profile-bio" className="input bio-textarea" maxLength={160}
                  placeholder="A small detail about you…" value={bio}
                  onChange={(event) => setBio(event.target.value)} />
              </label>
              <span className="character-count">{bio.length}/160</span>
              <Button variant="secondary" size="small" onClick={saveBio} disabled={saving || bio === user.bio}>
                Save bio
              </Button>
            </div>
          </aside>

          <div className="inbox-section">
            <div className="inbox-heading">
              <div>
                <span className="card-kicker">Your inbox</span>
                <h2>Notes from your people</h2>
              </div>
              <div className="filter-tabs" role="tablist" aria-label="Filter inbox">
                <button className={filter === 'all' ? 'filter-tab active' : 'filter-tab'} type="button"
                  role="tab" aria-selected={filter === 'all'} onClick={() => setFilter('all')}>All</button>
                <button className={filter === 'unread' ? 'filter-tab active' : 'filter-tab'} type="button"
                  role="tab" aria-selected={filter === 'unread'} onClick={() => setFilter('unread')}>Unread</button>
              </div>
            </div>
            {loading ? (
              <div className="inbox-loading">Gathering your notes…</div>
            ) : visibleMessages.length ? (
              <div className="message-list">
                {visibleMessages.map((message) => (
                  <MessageCard key={message.id} message={message} onRead={handleRead} onDelete={handleDelete} />
                ))}
              </div>
            ) : (
              <EmptyState
                title={filter === 'unread' ? 'All caught up.' : 'Your inbox is quiet.'}
                children={filter === 'unread'
                  ? 'There are no unread notes right now.'
                  : 'Share your profile link and the first note will show up here.'}
              />
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}


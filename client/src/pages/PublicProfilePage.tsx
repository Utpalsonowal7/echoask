import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { aiApi } from '../api/ai';
import { messagesApi } from '../api/messages';
import { profilesApi } from '../api/profiles';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';
import type { PublicProfile } from '../types';

export function PublicProfilePage() {
  const { username = '' } = useParams();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [alias, setAlias] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    profilesApi.get(username)
      .then((result) => { if (active) setProfile(result.profile); })
      .catch((issue: unknown) => {
        if (active) setError(issue instanceof Error ? issue.message : 'Profile not found.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [username]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    setError('');
    setNotice('');
    setBusy(true);
    try {
      await messagesApi.send(profile.username, {
        content: message,
        senderAlias: alias.trim() || undefined
      });
      setMessage('');
      setAlias('');
      setSuggestions([]);
      setNotice('Your note is on its way. Thanks for sharing it.');
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Your note could not be sent.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSuggestions() {
    setError('');
    try {
      const result = await aiApi.suggestions(profile?.bio);
      setSuggestions(result.suggestions);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Suggestions are unavailable right now.');
    }
  }

  if (loading) return <AppShell><div className="screen-loader">Finding this page…</div></AppShell>;
  if (!profile) {
    return (
      <AppShell>
        <section className="profile-error">
          <span className="large-symbol">◌</span>
          <h1>This page is out of reach.</h1>
          <p>{error || 'This profile could not be found.'}</p>
          <Link className="button button-primary" to="/">Go to EchoAsk</Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="public-layout">
        <div className="public-profile-card">
          <div className="profile-avatar">{profile.name.charAt(0).toUpperCase()}</div>
          <span className="eyebrow">A little corner of EchoAsk</span>
          <h1>{profile.name}</h1>
          <p className="profile-handle">@{profile.username}</p>
          <p className="profile-bio">{profile.bio || 'Send a note, question, or something kind.'}</p>
          <div className="profile-divider" />
          <p className="privacy-note"><span>◌</span> Your message is anonymous. No account needed.</p>
        </div>

        <div className="message-compose-card">
          {profile.acceptsMessages ? (
            <>
              <div className="card-kicker">Leave a note</div>
              <h2>What’s on your mind?</h2>
              <p className="muted">Only {profile.name} will see this.</p>
              <form className="form-stack" onSubmit={handleSubmit}>
                <label className="field" htmlFor="message-content">
                  <span className="field-label">Your message</span>
                  <textarea
                    id="message-content"
                    className="input message-textarea"
                    maxLength={1000}
                    minLength={3}
                    placeholder="Start with whatever feels easy…"
                    required
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                  />
                  <span className="character-count">{message.length}/1000</span>
                </label>
                <label className="field" htmlFor="sender-alias">
                  <span className="field-label">Name (optional)</span>
                  <input id="sender-alias" className="input" maxLength={40} placeholder="Stay anonymous or leave a hint"
                    value={alias} onChange={(event) => setAlias(event.target.value)} />
                </label>
                {suggestions.length > 0 && (
                  <div className="suggestion-list" aria-label="Message ideas">
                    {suggestions.map((suggestion) => (
                      <button className="suggestion-chip" type="button" key={suggestion}
                        onClick={() => setMessage(suggestion)}>{suggestion}</button>
                    ))}
                  </div>
                )}
                {error && <p className="form-error" role="alert">{error}</p>}
                {notice && <p className="form-success" role="status">{notice}</p>}
                <Button type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send anonymously'} <span>↗</span></Button>
              </form>
              <button className="ai-link" type="button" onClick={handleSuggestions}>
                ✳ &nbsp; Need a starting point? Get message ideas
              </button>
            </>
          ) : (
            <div className="paused-state">
              <span className="large-symbol">☾</span>
              <h2>Taking a little pause.</h2>
              <p className="muted">This person isn’t accepting new notes right now. Check back later.</p>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}


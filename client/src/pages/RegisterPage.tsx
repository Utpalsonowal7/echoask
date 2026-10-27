import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';
import { Field } from '../components/Field';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await authApi.register(form);
      navigate('/verify?email=' + encodeURIComponent(form.email));
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Could not create your account.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <section className="auth-layout">
        <div className="auth-aside">
          <span className="eyebrow">Start with a name</span>
          <h1>Your corner<br /><em>starts here.</em></h1>
          <p>Choose a username you can share. Your inbox stays private, and you can pause messages at any time.</p>
          <div className="aside-tag">✳ &nbsp; A softer place to be heard</div>
        </div>
        <div className="auth-card">
          <div className="card-kicker">Create account</div>
          <h2>Make your EchoAsk</h2>
          <p className="muted">We’ll email you a quick verification code.</p>
          <form className="form-stack" onSubmit={handleSubmit}>
            <Field label="Your name" name="name" autoComplete="name" required value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <Field label="Email address" name="email" type="email" autoComplete="email" required value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <Field label="Username" name="username" autoComplete="username" minLength={3} maxLength={24} required value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })} />
            <Field label="Password" name="password" type="password" autoComplete="new-password" minLength={8} required value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })} />
            {error && <p className="form-error" role="alert">{error}</p>}
            <Button type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create account'} <span>↗</span></Button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </section>
    </AppShell>
  );
}


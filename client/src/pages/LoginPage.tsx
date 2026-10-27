import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = await authApi.login({ email, password });
      setUser(result.user);
      const destination = (location.state as { from?: string } | null)?.from || '/dashboard';
      navigate(destination, { replace: true });
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <section className="auth-layout auth-layout-login">
        <div className="auth-aside">
          <span className="eyebrow">Welcome back</span>
          <h1>Your words<br /><em>are waiting.</em></h1>
          <p>Sign in to see what people have left in your inbox.</p>
          <div className="aside-tag">◌ &nbsp; Your inbox is yours alone</div>
        </div>
        <div className="auth-card">
          <div className="card-kicker">Sign in</div>
          <h2>Open your inbox</h2>
          <p className="muted">Enter the email and password you registered with.</p>
          <form className="form-stack" onSubmit={handleSubmit}>
            <Field label="Email address" name="email" type="email" autoComplete="email" required value={email}
              onChange={(event) => setEmail(event.target.value)} />
            <Field label="Password" name="password" type="password" autoComplete="current-password" required value={password}
              onChange={(event) => setPassword(event.target.value)} />
            {error && <p className="form-error" role="alert">{error}</p>}
            <Button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <span>↗</span></Button>
          </form>
          <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
        </div>
      </section>
    </AppShell>
  );
}


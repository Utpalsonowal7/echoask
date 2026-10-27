import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth';
import { AppShell } from '../components/AppShell';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { useAuth } from '../context/AuthContext';

export function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = await authApi.verify({ email, code });
      setUser(result.user);
      navigate('/dashboard');
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Could not verify this code.');
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    setError('');
    setNotice('');
    try {
      const result = await authApi.resend(email);
      setNotice(result.message);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'Could not resend the code.');
    }
  }

  return (
    <AppShell>
      <section className="auth-centered">
        <div className="auth-card auth-card-narrow">
          <span className="large-symbol">✳</span>
          <div className="card-kicker">One quick check</div>
          <h2>Check your inbox.</h2>
          <p className="muted">Enter the six-digit code we sent to your email address.</p>
          <form className="form-stack" onSubmit={handleVerify}>
            <Field label="Email address" name="email" type="email" required value={email}
              onChange={(event) => setEmail(event.target.value)} />
            <Field label="Verification code" name="code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} />
            {error && <p className="form-error" role="alert">{error}</p>}
            {notice && <p className="form-success" role="status">{notice}</p>}
            <Button type="submit" disabled={busy}>{busy ? 'Checking…' : 'Verify email'} <span>↗</span></Button>
          </form>
          <button className="text-button resend-button" type="button" onClick={handleResend}>Send a new code</button>
          <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
        </div>
      </section>
    </AppShell>
  );
}


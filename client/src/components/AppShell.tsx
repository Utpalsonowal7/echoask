import { Link, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <div className="app-background">
      <header className="topbar">
        <Link className="brand" to={user ? '/dashboard' : '/'}>
          <span className="brand-mark">e</span>
          <span>echoask</span>
        </Link>
        <nav className="topbar-actions" aria-label="Main navigation">
          {user ? (
            <>
              <Link className="topbar-link" to={'/u/' + user.username}>
                View my page
              </Link>
              <button className="text-button" onClick={handleSignOut} type="button">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className="topbar-link" to="/login">
                Sign in
              </Link>
              <Link className="button button-primary button-small" to="/register">
                Create account
              </Link>
            </>
          )}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <span>EchoAsk</span>
        <span>Share a little. Hear something honest.</span>
      </footer>
    </div>
  );
}


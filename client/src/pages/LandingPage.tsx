import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { useAuth } from '../context/AuthContext';

const highlights = [
  {
    icon: '↗',
    title: 'One link, your space',
    text: 'Share a personal page wherever your people already are.'
  },
  {
    icon: '◌',
    title: 'Anonymous by design',
    text: 'Visitors can leave a note without signing up or revealing a sender account.'
  },
  {
    icon: '✳',
    title: 'Your inbox, your rules',
    text: 'Read, clear, or pause incoming messages whenever you like.'
  }
];

export function LandingPage() {
  const { user } = useAuth();
  const destination = user ? '/dashboard' : '/register';

  return (
    <AppShell>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> A little more honest</div>
          <h1>Say it<br /><em>quietly.</em></h1>
          <p className="hero-description">
            A small corner of the internet for the questions, kind words, and
            thoughts that are easier to share anonymously.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to={destination}>
              Create your page <span aria-hidden="true">↗</span>
            </Link>
            <span className="hero-note">Free to start · No sender account needed</span>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>A</span><span>M</span><span>R</span><span>+</span>
            </div>
            <span>A quieter way to connect</span>
          </div>
        </div>

        <div className="hero-art" aria-label="A preview of an EchoAsk message card">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <span className="spark spark-one">✳</span>
          <span className="spark spark-two">✦</span>
          <span className="floating-note note-left">you made my day</span>
          <div className="preview-card">
            <div className="preview-top">
              <div className="preview-avatar">u</div>
              <div><strong>your little corner</strong><small>@yourname</small></div>
              <span className="preview-dots">···</span>
            </div>
            <div className="preview-rule" />
            <div className="preview-label">A note from someone</div>
            <p className="preview-message">
              What is one thing you wish more people knew about you?
            </p>
            <div className="preview-meta"><span>✳</span> Anonymous <span>just now</span></div>
          </div>
          <span className="floating-note note-right">a safe place to ask</span>
        </div>
      </section>

      <section className="highlights">
        <div className="section-heading">
          <span className="eyebrow">A thoughtful little tool</span>
          <h2>More room for real words.</h2>
        </div>
        <div className="highlight-grid">
          {highlights.map((item, index) => (
            <article className="highlight-card" key={item.title}>
              <span className={'highlight-icon icon-tone-' + index}>{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-cta">
        <div>
          <span className="eyebrow">Your link is waiting</span>
          <h2>Make space for a good conversation.</h2>
        </div>
        <Link className="button button-light" to={destination}>Start your page <span>↗</span></Link>
      </section>
    </AppShell>
  );
}


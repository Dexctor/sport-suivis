'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Erreur');
        setLoading(false);
        return;
      }
      router.replace('/');
      router.refresh();
    } catch {
      setError('Erreur réseau');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <form
        onSubmit={onSubmit}
        className="rt-panel"
        style={{
          width: '100%',
          maxWidth: 380,
          padding: 28,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
            padding: '5px 12px',
            background: 'var(--accent-soft)',
            border: '1px solid rgba(255, 69, 58, 0.3)',
            borderRadius: 999,
          }}
        >
          <div style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>Accès requis</span>
        </div>

        <h1
          style={{
            fontSize: 28,
            margin: '0 0 8px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}
        >
          Recomp <span className="rt-accent">Lean</span>
        </h1>
        <div className="rt-muted" style={{ fontSize: 13, marginBottom: 24 }}>
          Connecte-toi pour accéder à ton suivi.
        </div>

        <label
          htmlFor="password"
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 8,
          }}
        >
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rt-input"
          style={{
            width: '100%',
            padding: '14px 16px',
            fontSize: 16,
            marginBottom: 14,
          }}
        />

        {error && (
          <div
            className="rt-accent"
            style={{
              fontSize: 13,
              marginBottom: 14,
              fontWeight: 500,
            }}
          >
            ✕ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="rt-btn-primary"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: 15,
          }}
        >
          {loading ? 'Connexion…' : 'Entrer'}
        </button>
      </form>
    </div>
  );
}

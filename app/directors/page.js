'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

// ── Film strip decoration ──────────────────────────────────────────────
function FilmStrip({ vertical = false, opacity = 0.06 }) {
  const frames = Array.from({ length: 20 });
  return (
    <div style={{
      display: 'flex',
      flexDirection: vertical ? 'column' : 'row',
      gap: '3px',
      pointerEvents: 'none',
    }}>
      {frames.map((_, i) => (
        <div key={i} style={{
          width: vertical ? '36px' : '28px',
          height: vertical ? '48px' : '42px',
          background: '#0d0c08',
          border: '0.5px solid #1a1610',
          borderRadius: '1px',
          flexShrink: 0,
          position: 'relative',
          opacity,
        }}>
          <div style={{ position: 'absolute', top: '3px', left: '50%', transform: 'translateX(-50%)', width: '5px', height: '4px', background: '#1a1610', borderRadius: '1px' }} />
          <div style={{ position: 'absolute', bottom: '3px', left: '50%', transform: 'translateX(-50%)', width: '5px', height: '4px', background: '#1a1610', borderRadius: '1px' }} />
        </div>
      ))}
    </div>
  );
}

// ── Input component ────────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, onKeyDown, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      <label style={{
        fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase',
        color: focused ? '#c9a84c' : '#5a5040', fontFamily: 'sans-serif',
        transition: 'color 0.2s ease',
      }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          background: '#0a0905',
          border: `0.5px solid ${focused ? '#c9a84c' : '#2a2418'}`,
          borderRadius: '1px',
          color: '#f0e8d0',
          padding: '11px 14px',
          fontSize: '13px',
          letterSpacing: '0.5px',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s ease',
          fontFamily: 'Georgia, serif',
        }}
      />
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function DirectorsPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [visible, setVisible] = useState(false);
  const stripRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Check if already logged in → redirect to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) window.location.href = '/directors/dashboard';
    });
  }, []);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else window.location.href = '/directors/dashboard';
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, company, role: 'director' } },
      });
      if (error) setError(error.message);
      else setSuccess('Check your email to confirm your account, then return here to log in.');
    }
    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/directors/dashboard` },
    });
  }

  const fadeUp = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  return (
    <main style={{
      minHeight: '100vh',
      background: '#060605',
      color: '#f0e8d0',
      fontFamily: 'Georgia, "Times New Roman", serif',
      display: 'grid',
      gridTemplateColumns: '1fr 480px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Grain overlay ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
        backgroundSize: '180px 180px', opacity: 0.5,
      }} />

      {/* ── LEFT PANEL — editorial ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        borderRight: '0.5px solid #1a1610',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 64px',
        overflow: 'hidden',
      }}>

        {/* Ambient gold glow */}
        <div style={{
          position: 'absolute', top: '-120px', left: '-120px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Vertical film strip — left edge */}
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, overflow: 'hidden' }}>
          <FilmStrip vertical opacity={0.05} />
        </div>

        {/* Top — back + logo */}
        <div style={fadeUp(0)}>
          <a href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase',
            color: '#3a3020', textDecoration: 'none', transition: 'color 0.2s ease',
            fontFamily: 'sans-serif',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
            onMouseLeave={e => e.currentTarget.style.color = '#3a3020'}
          >
            ← Return to Кадар
          </a>

          <div style={{ marginTop: '64px' }}>
            <div style={{
              fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase',
              color: '#c9a84c', fontFamily: 'sans-serif', marginBottom: '20px',
            }}>
              Director Portal
            </div>
            <h1 style={{
              fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: '400',
              lineHeight: '1.15', margin: 0, letterSpacing: '-0.5px',
              color: '#f0e8d0',
            }}>
              Your films.<br />
              Your archive.<br />
              <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>Your audience.</em>
            </h1>
            <p style={{
              fontSize: '14px', color: '#5a5040', lineHeight: '1.9',
              letterSpacing: '0.3px', maxWidth: '400px', marginTop: '24px',
            }}>
              List your short films and music videos on Кадар — the curated platform
              for Balkan cinema. Reach audiences across the region and beyond.
            </p>
          </div>
        </div>

        {/* Middle — three value props */}
        <div style={{ ...fadeUp(0.15), display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { n: '01', title: 'Submit & Distribute', body: 'Upload once. Reach viewers across 11 countries on a platform built for the region.' },
            { n: '02', title: 'Festival Access', body: 'Connect your films to Balkan festival listings and get discovered by programmers.' },
            { n: '03', title: 'Transparent Pricing', body: '600 MKD / month per title. First month 300 MKD. No hidden fees, no revenue share.' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '24px', alignItems: 'flex-start',
              padding: '24px 0',
              borderTop: '0.5px solid #1a1610',
            }}>
              <span style={{
                fontSize: '9px', letterSpacing: '3px', color: '#3a3020',
                fontFamily: 'sans-serif', flexShrink: 0, marginTop: '3px',
              }}>{item.n}</span>
              <div>
                <div style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#a09070', fontFamily: 'sans-serif', marginBottom: '6px' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: '#5a5040', lineHeight: '1.8', letterSpacing: '0.2px' }}>{item.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom — Cosmic Films credit */}
        <div style={{ ...fadeUp(0.25), display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ height: '0.5px', background: '#1a1610', width: '32px' }} />
          <span style={{ fontSize: '10px', color: '#3a3020', letterSpacing: '2px', fontFamily: 'sans-serif' }}>
            A <span style={{ color: '#5a5040' }}>Cosmic Films</span> platform
          </span>
        </div>
      </div>

      {/* ── RIGHT PANEL — auth form ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '64px 56px',
        background: '#080806',
      }}>

        {/* Top film strip */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' }}>
          <FilmStrip opacity={0.04} />
        </div>

        <div style={fadeUp(0.1)}>

          {/* Logo */}
          <div style={{ marginBottom: '40px' }}>
            <img
              src="/KADAR LOGO.png"
              alt="Кадар"
              style={{ height: '36px', width: 'auto', mixBlendMode: 'screen', opacity: 0.9 }}
            />
          </div>

          {/* Mode toggle */}
          <div style={{
            display: 'flex', marginBottom: '36px',
            border: '0.5px solid #1a1610', borderRadius: '1px', overflow: 'hidden',
          }}>
            {[
              { id: 'login', label: 'Log In' },
              { id: 'signup', label: 'Register' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setError(null); setSuccess(null); }}
                style={{
                  flex: 1, padding: '10px',
                  background: mode === m.id ? '#121009' : 'none',
                  border: 'none', cursor: 'pointer',
                  color: mode === m.id ? '#c9a84c' : '#3a3020',
                  fontSize: '10px', letterSpacing: '4px',
                  textTransform: 'uppercase',
                  fontFamily: 'sans-serif',
                  borderBottom: mode === m.id ? '0.5px solid #c9a84c' : '0.5px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {mode === 'signup' && (
              <>
                <Field label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
                <Field label="Production Company" value={company} onChange={e => setCompany(e.target.value)} placeholder="Optional" />
              </>
            )}
            <Field label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
            />
          </div>

          {/* Error / success */}
          {error && (
            <div style={{
              fontSize: '12px', color: '#e05a3a', marginBottom: '16px',
              letterSpacing: '0.3px', lineHeight: '1.6',
              padding: '10px 14px', border: '0.5px solid #3a1a10',
              background: '#0d0603', borderRadius: '1px',
            }}>{error}</div>
          )}
          {success && (
            <div style={{
              fontSize: '12px', color: '#c9a84c', marginBottom: '16px',
              letterSpacing: '0.3px', lineHeight: '1.6',
              padding: '10px 14px', border: '0.5px solid #3a2a10',
              background: '#0d0b06', borderRadius: '1px',
            }}>{success}</div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: '#c9a84c', border: 'none',
              color: '#060605', fontSize: '11px',
              fontWeight: '700', letterSpacing: '4px',
              textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              borderRadius: '1px', marginBottom: '12px',
              opacity: loading ? 0.6 : 1,
              transition: 'opacity 0.2s ease, background 0.2s ease',
              fontFamily: 'sans-serif',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#fff0c0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#c9a84c'; }}
          >
            {loading ? '...' : mode === 'login' ? 'Enter Portal' : 'Create Director Account'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
            <span style={{ fontSize: '10px', color: '#3a3020', letterSpacing: '2px', fontFamily: 'sans-serif' }}>or</span>
            <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            style={{
              width: '100%', padding: '12px',
              background: 'none', border: '0.5px solid #2a2418',
              color: '#8a7f6a', fontSize: '11px',
              letterSpacing: '2px', textTransform: 'uppercase',
              cursor: 'pointer', borderRadius: '1px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'border-color 0.2s, color 0.2s',
              fontFamily: 'sans-serif',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#f0e8d0'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2418'; e.currentTarget.style.color = '#8a7f6a'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Pricing note */}
          <p style={{
            fontSize: '10px', color: '#2a2418', letterSpacing: '0.5px',
            lineHeight: '1.8', marginTop: '28px', textAlign: 'center',
            fontFamily: 'sans-serif',
          }}>
            By registering you agree to the director listing terms.<br />
            <a href="/pricing" style={{ color: '#3a3020', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
              onMouseLeave={e => e.currentTarget.style.color = '#3a3020'}
            >View pricing →</a>
          </p>

        </div>
      </div>

    </main>
  );
}
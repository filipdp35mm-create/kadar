'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthModal({ onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === 'login') {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); }
      else {
        const { data: dirProfile } = await supabase
          .from('director_profiles')
          .select('id')
          .eq('id', signInData.user.id)
          .single();
        if (dirProfile) window.location.href = '/directors/dashboard';
        else onClose();
      }

} else {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: { username }  // saves to auth metadata immediately
    }
  });
  if (error) {
    setError(error.message);
  } else {
    setSuccess('Check your email to confirm your account. Then come back here to subscribe.');
  }
}

    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  }

  const inputStyle = {
    width: '100%',
    background: '#0d0c08',
    border: '0.5px solid #2a2418',
    borderRadius: '2px',
    color: '#f0e8d0',
    padding: '10px 14px',
    fontSize: '13px',
    letterSpacing: '0.5px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 100,
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 101,
        background: '#0a0a0a',
        border: '0.5px solid #2a2418',
        borderRadius: '4px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
      }}>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', color: '#5a5040',
            fontSize: '20px', cursor: 'pointer', lineHeight: 1,
          }}
        >×</button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img
            src="/KADAR LOGO.png"
            alt="Кадар"
            style={{ height: '40px', width: 'auto', mixBlendMode: 'screen' }}
          />
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex', marginBottom: '28px',
          border: '0.5px solid #2a2418', borderRadius: '2px', overflow: 'hidden',
        }}>
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); setSuccess(null); }}
              style={{
                flex: 1, padding: '9px',
                background: mode === m ? '#1a1610' : 'none',
                border: 'none', cursor: 'pointer',
                color: mode === m ? '#c9a84c' : '#5a5040',
                fontSize: '11px', letterSpacing: '3px',
                textTransform: 'uppercase', fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
            >
              {m === 'login' ? 'Log In' : 'Join'}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {mode === 'signup' && (
            <input
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={inputStyle}
            />
          )}
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={inputStyle}
          />
        </div>

        {/* Error / success */}
        {error && (
          <div style={{
            fontSize: '12px', color: '#e05a3a', marginBottom: '16px',
            letterSpacing: '0.3px', lineHeight: '1.5',
          }}>{error}</div>
        )}
        {success && (
          <div style={{
            fontSize: '12px', color: '#c9a84c', marginBottom: '16px',
            letterSpacing: '0.3px', lineHeight: '1.5',
          }}>{success}</div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '11px',
            background: '#c9a84c', border: 'none',
            color: '#0a0a0a', fontSize: '12px',
            fontWeight: '700', letterSpacing: '3px',
            textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
            borderRadius: '2px', marginBottom: '12px',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          {loading ? '...' : mode === 'login' ? 'Log In' : 'Create Account'}
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px',
        }}>
          <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
          <span style={{ fontSize: '11px', color: '#5a5040', letterSpacing: '1px' }}>or</span>
          <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          style={{
            width: '100%', padding: '11px',
            background: 'none', border: '0.5px solid #2a2418',
            color: '#8a7f6a', fontSize: '12px',
            letterSpacing: '2px', textTransform: 'uppercase',
            cursor: 'pointer', borderRadius: '2px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#f0e8d0'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2418'; e.currentTarget.style.color = '#8a7f6a'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

      </div>
    </>
  );
}
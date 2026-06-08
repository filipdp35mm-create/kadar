'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

const flickerStyle = `
  @keyframes flicker {
    0%, 88%, 100% { opacity: 1; }
    89% { opacity: 0.3; }
    90% { opacity: 1; }
    91% { opacity: 0.5; }
    92% { opacity: 1; }
    93% { opacity: 0.2; }
    94% { opacity: 1; }
  }
`;

const PROGRESS = 9; // ← change this number whenever you want

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

async function handleNotify() {
  if (!email || !email.includes('@')) { setError(true); return; }
  setError(false);
  await supabase.from('waitlist').insert({ email });
  setDone(true);
}

  return (
    <main style={{
      minHeight: '100vh',
      background: '#060605',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Georgia, serif',
    }}>
        
        <style>{flickerStyle}</style>

      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.35,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
        backgroundSize: '160px 160px',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)',
      }} />

      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #c9a84c0a 0%, transparent 70%)', top: '-10%', left: '-15%', pointerEvents: 'none' }} />
<div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, #c9a84c07 0%, transparent 70%)', bottom: '0%', right: '-10%', pointerEvents: 'none' }} />

      {/* Top gold line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, #c9a84c55, #c9a84c, #c9a84c55, transparent)',
        opacity: 0.6,
      }} />

      {/* Corner brackets */}
      {[
        { top: 24, left: 24, borderTop: '0.5px solid #c9a84c', borderLeft: '0.5px solid #c9a84c' },
        { top: 24, right: 24, borderTop: '0.5px solid #c9a84c', borderRight: '0.5px solid #c9a84c' },
        { bottom: 24, left: 24, borderBottom: '0.5px solid #c9a84c', borderLeft: '0.5px solid #c9a84c' },
        { bottom: 24, right: 24, borderBottom: '0.5px solid #c9a84c', borderRight: '0.5px solid #c9a84c' },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 20, height: 20, opacity: 0.25, ...s }} />
      ))}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 480 }}>

        <div style={{
          fontSize: '9px', letterSpacing: '6px', color: '#c9a84c',
          fontFamily: 'sans-serif', textTransform: 'uppercase', marginBottom: '32px',
        }}>
          Balkan Cinema
        </div>

        <div style={{
          fontSize: 'clamp(52px, 12vw, 80px)',
          fontWeight: '300',
          color: '#f0e8d0',
          letterSpacing: '16px',
          lineHeight: 1,
          marginBottom: '8px',
          animation: 'flicker 4s ease-in-out infinite 2s',
        }}>
          КАДАР
        </div>

        <div style={{ width: 40, height: '0.5px', background: '#c9a84c', margin: '28px auto' }} />

        <div style={{
          fontSize: '17px', fontWeight: '300', fontStyle: 'italic',
          color: '#8a7f6a', letterSpacing: '2px', marginBottom: '12px',
        }}>
          Нешто посебно доаѓа наскоро за љубителите на филмот.
        </div>

        <div style={{ width: '240px', height: '1px', background: '#1a1610', margin: '24px auto 8px' }}>
  <div style={{ width: `${PROGRESS}%`, height: '100%', background: '#c9a84c' }} />
</div>
<div style={{ fontSize: '9px', letterSpacing: '3px', color: '#3a3020', fontFamily: 'sans-serif', marginBottom: '32px' }}>
  {PROGRESS}% COMPLETE
</div>

        <div style={{
          fontSize: '9px', letterSpacing: '3px', color: '#3a3020',
          fontFamily: 'sans-serif', textTransform: 'uppercase', marginBottom: '48px',
        }}>
        </div>

        {!done ? (
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0' }}>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(false); }}
              onKeyDown={e => e.key === 'Enter' && handleNotify()}
              placeholder="your@email.com"
              style={{
                background: '#0a0905',
                border: `0.5px solid ${error ? '#e05a3a' : '#2a2418'}`,
                borderRight: 'none',
                color: '#f0e8d0',
                padding: '11px 16px',
                fontSize: '12px',
                fontFamily: 'Georgia, serif',
                outline: 'none',
                width: 'min(200px, 60vw)',
                letterSpacing: '0.5px',
              }}
            />
            <button
              onClick={handleNotify}
              style={{
                background: '#c9a84c',
                border: 'none',
                color: '#060605',
                padding: '11px 18px',
                fontSize: '8px',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'sans-serif',
                fontWeight: '700',
              }}
            >
              ИЗВЕСТИ МЕ
            </button>
          </div>
        ) : (
          <div style={{
            fontSize: '9px', letterSpacing: '4px', color: '#c9a84c',
            fontFamily: 'sans-serif', textTransform: 'uppercase',
          }}>
            ✓ &nbsp; СЕ СЛУШАМЕ!
          </div>
        )}

      </div>
    </main>
  );
}
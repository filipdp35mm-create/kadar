'use client';

import { useRef, useState } from 'react';

const PICKS = [
  { id: 1, title: 'Последниот Воз', country: 'MK', year: '2024', type: 'Short Film', rating: '4.2' },
  { id: 2, title: 'Bela Soba', country: 'SRB', year: '2024', type: 'Music Video', rating: '3.9' },
  { id: 3, title: 'Нощен Влак', country: 'BG', year: '2023', type: 'Short Film', rating: '4.5' },
  { id: 4, title: 'Tihi Grad', country: 'HR', year: '2024', type: 'Short Film', rating: '4.1' },
  { id: 5, title: 'Valuri', country: 'RO', year: '2024', type: 'Short Film', rating: '4.3' },
  { id: 6, title: 'Srebrna Nit', country: 'SRB', year: '2023', type: 'Short Film', rating: '3.8' },
  { id: 7, title: 'Φως', country: 'GR', year: '2024', type: 'Music Video', rating: '4.0' },
  { id: 8, title: 'Senka', country: 'BA', year: '2023', type: 'Short Film', rating: '4.4' },
];

export default function YourPicks() {
  const rowRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Temporary — will be replaced with real auth later
  const loggedIn = false;

  function onMouseDown(e) {
    setIsDragging(true);
    setStartX(e.pageX - rowRef.current.offsetLeft);
    setScrollLeft(rowRef.current.scrollLeft);
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    rowRef.current.scrollLeft = scrollLeft - walk;
  }

  function onMouseUp() { setIsDragging(false); }

  return (
    <section style={{ padding: '0 0 60px', position: 'relative' }}>

      {/* Section header — always visible */}
      <div style={{
        padding: '0 80px', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <span style={{
          fontFamily: 'sans-serif', fontSize: '11px', letterSpacing: '4px',
          textTransform: 'uppercase', color: '#8a7f6a', fontWeight: '500',
          whiteSpace: 'nowrap',
        }}>Your Picks</span>
        <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
        {loggedIn && (
          <a
            href="#"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
              color: '#c9a84c', textDecoration: 'none',
              border: '0.5px solid #3a3020', padding: '6px 14px', borderRadius: '1px',
              transition: 'all 0.2s ease', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#c9a84c';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(201,168,76,0.4), 0 0 4px rgba(201,168,76,0.2)';
              e.currentTarget.style.color = '#f0e8d0';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#3a3020';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.color = '#c9a84c';
            }}
          >
            View All →
          </a>
        )}
      </div>

      {/* NOT LOGGED IN — sign in prompt */}
      {!loggedIn && (
        <div style={{
          margin: '0 80px',
          border: '0.5px solid #1a1610',
          borderRadius: '2px',
          padding: '48px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#0d0c08',
          gap: '40px',
        }}>

          {/* Left — placeholder poster row, blurred */}
          <div style={{
            display: 'flex', gap: '10px', flex: 1,
            filter: 'blur(3px)', opacity: 0.3, pointerEvents: 'none',
            overflow: 'hidden',
          }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                width: '80px', height: '120px', flexShrink: 0,
                background: '#161208', border: '0.5px solid #2a2418', borderRadius: '2px',
              }} />
            ))}
          </div>

          {/* Center — message */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{
              fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase',
              color: '#c9a84c', marginBottom: '12px', fontWeight: '500',
            }}>
              Your Picks
            </div>
            <div style={{
              fontSize: '20px', fontWeight: '700', color: '#f0e8d0',
              letterSpacing: '1px', marginBottom: '10px', fontFamily: 'sans-serif',
            }}>
              Sign in to access Your Picks
            </div>
            <p style={{
              fontSize: '13px', color: '#5a5040', lineHeight: '1.7',
              maxWidth: '300px', margin: '0 auto 24px', letterSpacing: '0.3px',
            }}>
              Save films and music videos to keep track of what you want to watch.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button style={{
                background: '#c9a84c', border: 'none', color: '#0a0a0a',
                padding: '10px 24px', fontSize: '12px', fontWeight: '700',
                letterSpacing: '3px', textTransform: 'uppercase',
                cursor: 'pointer', borderRadius: '2px',
                transition: 'all 0.15s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#fff7e0';
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(201,168,76,0.6)';
                  setTimeout(() => {
                    if (e.currentTarget) {
                      e.currentTarget.style.background = '#c9a84c';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(201,168,76,0.3)';
                    }
                  }, 150);
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#c9a84c';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Sign In
              </button>
              <button style={{
                background: 'none', border: '0.5px solid #3a3020', color: '#8a7f6a',
                padding: '10px 24px', fontSize: '12px', fontWeight: '500',
                letterSpacing: '3px', textTransform: 'uppercase',
                cursor: 'pointer', borderRadius: '2px',
                transition: 'all 0.15s ease',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#c9a84c';
                  e.currentTarget.style.color = '#f0e8d0';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#3a3020';
                  e.currentTarget.style.color = '#8a7f6a';
                }}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Right — mirror of left */}
          <div style={{
            display: 'flex', gap: '10px', flex: 1,
            filter: 'blur(3px)', opacity: 0.3, pointerEvents: 'none',
            overflow: 'hidden', justifyContent: 'flex-end',
          }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                width: '80px', height: '120px', flexShrink: 0,
                background: '#161208', border: '0.5px solid #2a2418', borderRadius: '2px',
              }} />
            ))}
          </div>

        </div>
      )}

      {/* LOGGED IN — horizontal poster row */}
      {loggedIn && (
        <div
          ref={rowRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{
            display: 'flex', gap: '12px', overflowX: 'auto',
            paddingLeft: '80px', paddingRight: '80px',
            paddingTop: '16px', paddingBottom: '24px',
            cursor: isDragging ? 'grabbing' : 'grab',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
            userSelect: 'none',
          }}
        >
          {PICKS.map((film) => (
            <div
              key={film.id}
              onMouseEnter={() => setHoveredId(film.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                flexShrink: 0, width: '140px', cursor: 'pointer',
                transition: 'transform 0.2s ease',
                transform: hoveredId === film.id ? 'translateY(-6px)' : 'translateY(0)',
              }}
            >
              <div style={{
                width: '140px', height: '210px', background: '#0d0c08',
                border: `0.5px solid ${hoveredId === film.id ? '#c9a84c' : '#2a2418'}`,
                borderRadius: '2px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', position: 'relative', overflow: 'hidden',
                marginBottom: '10px', transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: hoveredId === film.id
                  ? '0 12px 32px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(201,168,76,0.3)'
                  : '0 4px 12px rgba(0,0,0,0.4)',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.12 }}>
                  <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
                  <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
                  <line x1="2" y1="7" x2="22" y2="7" stroke="#c9a84c" strokeWidth="0.5"/>
                  <line x1="2" y1="17" x2="22" y2="17" stroke="#c9a84c" strokeWidth="0.5"/>
                </svg>
                <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '9px', letterSpacing: '2px', color: '#c9a84c', fontWeight: '600', textTransform: 'uppercase' }}>{film.country}</div>
                <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '10px', color: '#c9a84c', letterSpacing: '1px' }}>★ {film.rating}</div>
                {hoveredId === film.id && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '0.5px solid #c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="#c9a84c"><polygon points="4,2 14,8 4,14"/></svg>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#d0c8b0', letterSpacing: '0.3px', lineHeight: '1.3', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{film.title}</div>
              <div style={{ fontSize: '10px', color: '#3a3020', letterSpacing: '1px', textTransform: 'uppercase' }}>{film.type} &middot; {film.year}</div>
            </div>
          ))}
        </div>
      )}

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}
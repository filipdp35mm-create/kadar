'use client';

import { useState } from 'react';

// ============================================
// COMING SOON
// Upcoming films and music videos
// ============================================

const COMING_SOON = [
  { id: 1, title: 'Kaldrma', country: 'MK', year: '2025', type: 'Short Film', director: 'Aleksandar Donev', releaseDate: 'June 2025' },
  { id: 2, title: 'Crna Voda', country: 'SRB', year: '2025', type: 'Short Film', director: 'Milena Janković', releaseDate: 'July 2025' },
  { id: 3, title: 'Orizontul', country: 'RO', year: '2025', type: 'Music Video', director: 'Ioana Petre', releaseDate: 'June 2025' },
  { id: 4, title: 'Pjesma', country: 'BA', year: '2025', type: 'Short Film', director: 'Amra Čehić', releaseDate: 'August 2025' },
  { id: 5, title: 'Zora', country: 'HR', year: '2025', type: 'Short Film', director: 'Luka Horvat', releaseDate: 'July 2025' },
  { id: 6, title: 'Σκιά', country: 'GR', year: '2025', type: 'Music Video', director: 'Nikos Papadopoulos', releaseDate: 'September 2025' },
];

export default function ComingSoon() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section style={{ padding: '0 80px 80px' }}>

      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px',
      }}>
        <span style={{
          fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase',
          color: '#8a7f6a', fontWeight: '500', whiteSpace: 'nowrap',
          fontFamily: 'sans-serif',
        }}>Coming Soon</span>
        <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
      }}>
        {COMING_SOON.map((film) => (
          <div
            key={film.id}
            onMouseEnter={() => setHoveredId(film.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              cursor: 'pointer',
              border: `0.5px solid ${hoveredId === film.id ? '#2a2418' : '#1a1610'}`,
              borderRadius: '2px',
              overflow: 'hidden',
              transition: 'border-color 0.2s ease',
              background: '#0d0c08',
            }}
          >
            {/* Poster area */}
            <div style={{
              width: '100%', aspectRatio: '16/9',
              background: '#080806',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Placeholder */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.08 }}>
                <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
                <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
                <line x1="2" y1="7" x2="22" y2="7" stroke="#c9a84c" strokeWidth="0.5"/>
                <line x1="2" y1="17" x2="22" y2="17" stroke="#c9a84c" strokeWidth="0.5"/>
              </svg>

              {/* Coming soon overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(8,8,6,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase',
                  color: '#c9a84c', fontWeight: '600', border: '0.5px solid #c9a84c',
                  padding: '5px 12px', borderRadius: '1px',
                  opacity: hoveredId === film.id ? 1 : 0.6,
                  transition: 'opacity 0.2s ease',
                }}>
                  Coming Soon
                </div>
              </div>

              {/* Country + type top */}
              <div style={{
                position: 'absolute', top: '10px', left: '10px',
                fontSize: '9px', letterSpacing: '2px', color: '#c9a84c',
                fontWeight: '600', textTransform: 'uppercase',
              }}>
                {film.country}
              </div>

              <div style={{
                position: 'absolute', top: '10px', right: '10px',
                fontSize: '9px', letterSpacing: '2px', color: '#8a7f6a',
                textTransform: 'uppercase',
              }}>
                {film.type}
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: '14px 16px' }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '6px',
              }}>
                <div style={{
                  fontSize: '15px', fontWeight: '700', color: '#f0e8d0',
                  letterSpacing: '0.5px', lineHeight: '1.2',
                  transition: 'color 0.2s ease',
                  ...(hoveredId === film.id && { color: '#c9a84c' }),
                }}>
                  {film.title}
                </div>
                <div style={{
                  fontSize: '10px', letterSpacing: '2px', color: '#c9a84c',
                  textTransform: 'uppercase', fontWeight: '500',
                  border: '0.5px solid #2a2418', padding: '3px 8px', borderRadius: '1px',
                  whiteSpace: 'nowrap', marginLeft: '12px',
                }}>
                  {film.releaseDate}
                </div>
              </div>

              <div style={{
                fontSize: '11px', color: '#8a7f6a', letterSpacing: '1px',
                textTransform: 'uppercase',
              }}>
                {film.director} &middot; {film.country} &middot; {film.year}
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
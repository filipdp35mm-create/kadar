'use client';

import { useState, useRef } from 'react';

// ============================================
// FAN FAVORITES
// 12 films ordered by user rating
// 6 visible at a time, arrow navigates to next 6
// Left arrow hidden until user goes forward
// ============================================

const FAVORITES = [
  { id: 1, title: 'Нощен Влак', country: 'BG', year: '2023', type: 'Short Film', rating: '4.8', director: 'Elena Borisova' },
  { id: 2, title: 'Последниот Воз', country: 'MK', year: '2024', type: 'Short Film', rating: '4.6', director: 'Aleksandar Donev' },
  { id: 3, title: 'Valuri', country: 'RO', year: '2024', type: 'Short Film', rating: '4.5', director: 'Ioana Petre' },
  { id: 4, title: 'Senka', country: 'BA', year: '2023', type: 'Short Film', rating: '4.4', director: 'Amra Čehić' },
  { id: 5, title: 'Bela Soba', country: 'SRB', year: '2024', type: 'Music Video', rating: '4.3', director: 'Milena Janković' },
  { id: 6, title: 'Tihi Grad', country: 'HR', year: '2024', type: 'Short Film', rating: '4.2', director: 'Luka Horvat' },
  { id: 7, title: 'Φως', country: 'GR', year: '2024', type: 'Music Video', rating: '4.1', director: 'Nikos Papadopoulos' },
  { id: 8, title: 'Drita', country: 'KOS', year: '2024', type: 'Short Film', rating: '4.0', director: 'Ardita Krasniqi' },
  { id: 9, title: 'Srebrna Nit', country: 'SRB', year: '2023', type: 'Short Film', rating: '3.9', director: 'Stefan Popović' },
  { id: 10, title: 'Planina', country: 'MNE', year: '2023', type: 'Short Film', rating: '3.8', director: 'Nikola Đurović' },
  { id: 11, title: 'Lumina', country: 'RO', year: '2024', type: 'Music Video', rating: '3.7', director: 'Andrei Ionescu' },
  { id: 12, title: 'Magla', country: 'BA', year: '2023', type: 'Short Film', rating: '3.6', director: 'Tarik Hodžić' },
];

export default function FanFavorites() {
  const [page, setPage] = useState(0); // 0 = first 6, 1 = last 6
  const [hoveredId, setHoveredId] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [slideDir, setSlideDir] = useState('right');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const visible = FAVORITES.slice(page * 6, page * 6 + 6);

  function goNext() {
    if (page === 1) return;
    setSlideDir('right');
    setTransitioning(true);
    setTimeout(() => {
      setPage(1);
      setTransitioning(false);
    }, 300);
  }

  function goPrev() {
    if (page === 0) return;
    setSlideDir('left');
    setTransitioning(true);
    setTimeout(() => {
      setPage(0);
      setTransitioning(false);
    }, 300);
  }

  return (
    <section style={{ padding: '0 80px 80px' }}>

      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px',
      }}>
        <span style={{
          fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase',
          color: '#8a7f6a', fontWeight: '500', whiteSpace: 'nowrap',
          fontFamily: 'sans-serif',
        }}>Fan Favorites</span>
        <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
        <span style={{
          fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
          color: '#8a7f6a', fontWeight: '400', whiteSpace: 'nowrap',
        }}>Ordered by user rating</span>
      </div>

      {/* Grid wrapper with arrows */}
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => { setShowLeftArrow(true); setShowRightArrow(true); }}
        onMouseLeave={() => { setShowLeftArrow(false); setShowRightArrow(false); }}
      >

        {/* LEFT arrow — only visible on page 1 */}
        <div style={{
          position: 'absolute', left: '-20px', top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          opacity: showLeftArrow && page === 1 ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: showLeftArrow && page === 1 ? 'all' : 'none',
        }}>
          <button
            onClick={goPrev}
            style={{
              background: 'rgba(10,10,10,0.9)',
              border: '0.5px solid #3a3020',
              color: '#f0e8d0',
              width: '40px', height: '40px', borderRadius: '50%',
              cursor: 'pointer', fontSize: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#c9a84c';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(201,168,76,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#3a3020';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.88)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >‹</button>
        </div>

        {/* RIGHT arrow — only visible on page 0 */}
        <div style={{
          position: 'absolute', right: '-20px', top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          opacity: showRightArrow && page === 0 ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: showRightArrow && page === 0 ? 'all' : 'none',
        }}>
          <button
            onClick={goNext}
            style={{
              background: 'rgba(10,10,10,0.9)',
              border: '0.5px solid #3a3020',
              color: '#f0e8d0',
              width: '40px', height: '40px', borderRadius: '50%',
              cursor: 'pointer', fontSize: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#c9a84c';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(201,168,76,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#3a3020';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.88)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >›</button>
        </div>

        {/* Film grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
          opacity: transitioning ? 0 : 1,
          transform: transitioning
            ? `translateX(${slideDir === 'right' ? '-20px' : '20px'})`
            : 'translateX(0)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}>
          {visible.map((film) => (
            <div
              key={film.id}
              onMouseEnter={() => setHoveredId(film.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                transform: hoveredId === film.id ? 'translateY(-6px)' : 'translateY(0)',
              }}
            >
              {/* Poster */}
              <div style={{
                width: '100%', aspectRatio: '2/3',
                background: '#0d0c08',
                border: `0.5px solid ${hoveredId === film.id ? '#c9a84c' : '#2a2418'}`,
                borderRadius: '2px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
                marginBottom: '10px',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: hoveredId === film.id
                  ? '0 12px 32px rgba(0,0,0,0.9), 0 0 0 0.5px rgba(201,168,76,0.3)'
                  : '0 4px 12px rgba(0,0,0,0.5)',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.1 }}>
                  <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
                  <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
                  <line x1="2" y1="7" x2="22" y2="7" stroke="#c9a84c" strokeWidth="0.5"/>
                  <line x1="2" y1="17" x2="22" y2="17" stroke="#c9a84c" strokeWidth="0.5"/>
                </svg>

                {/* Rating badge */}
                <div style={{
                  position: 'absolute', top: '8px', right: '8px',
                  fontSize: '10px', color: '#c9a84c', letterSpacing: '1px', fontWeight: '600',
                }}>
                  ★ {film.rating}
                </div>

                {/* Country */}
                <div style={{
                  position: 'absolute', top: '8px', left: '8px',
                  fontSize: '9px', letterSpacing: '2px', color: '#c9a84c',
                  fontWeight: '600', textTransform: 'uppercase',
                }}>
                  {film.country}
                </div>

                {/* Play on hover */}
                {hoveredId === film.id && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(10,10,10,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      border: '0.5px solid #c9a84c',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="#c9a84c">
                        <polygon points="4,2 14,8 4,14"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Film info */}
              <div style={{
                fontSize: '12px', fontWeight: '600', color: '#d0c8b0',
                letterSpacing: '0.3px', lineHeight: '1.3', marginBottom: '4px',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {film.title}
              </div>
              <div style={{
                fontSize: '10px', color: '#8a7f6a', letterSpacing: '1px',
                textTransform: 'uppercase',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {film.director} &middot; {film.year}
              </div>
            </div>
          ))}
        </div>

        {/* Page indicator */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px',
        }}>
          {[0, 1].map((i) => (
            <div key={i} style={{
              width: i === page ? '20px' : '6px', height: '3px',
              background: i === page ? '#c9a84c' : '#3a3020',
              borderRadius: '2px', transition: 'all 0.3s ease',
              cursor: 'pointer',
            }} onClick={() => i === 0 ? goPrev() : goNext()} />
          ))}
        </div>
      </div>
    </section>
  );
}
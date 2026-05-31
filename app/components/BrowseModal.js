'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['All', 'Action', 'Thriller', 'Drama', 'Music Video'];

export default function BrowseModal({ onClose }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [cardPos, setCardPos] = useState(null);
  const [films, setFilms] = useState([]);
  const hoverTimer = useRef(null);
  const leaveTimer = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  useEffect(() => {
    async function fetchFilms() {
      const { data } = await supabase
        .from('films')
        .select(`*, directors (name), countries (code, name)`)
        .eq('status', 'released');
      if (data) setFilms(data);
    }
    fetchFilms();
  }, []);

  useEffect(() => {
const timer = setTimeout(() => setMounted(true), 150);
  return () => clearTimeout(timer);
}, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 350);
  }

  const filtered = films.filter(f => {
    const matchesCategory = activeCategory === 'All' || f.genre === activeCategory;
    const matchesSearch = search === '' ||
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      (f.directors?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesCountry = selectedCountry === 'All Countries' || f.countries?.code === selectedCountry;
    const matchesYear =
      selectedYear === 'All Years' ? true :
      selectedYear === '2021 — 2026' ? f.year >= 2021 && f.year <= 2026 :
      selectedYear === '2011 — 2020' ? f.year >= 2011 && f.year <= 2020 :
      selectedYear === '2000 — 2010' ? f.year >= 2000 && f.year <= 2010 : true;
    return matchesCategory && matchesSearch && matchesCountry && matchesYear;
  });

  function handleEnter(e, film) {
    clearTimeout(leaveTimer.current);
    const rect = e.currentTarget.getBoundingClientRect();
    const cardWidth = 380;
    const left = rect.left + cardWidth > window.innerWidth - 20
      ? rect.right - cardWidth
      : rect.left;
    setCardPos({ left, top: rect.top, width: rect.width });
    hoverTimer.current = setTimeout(() => {
      setHoveredId(film.id);
    }, 80);
  }

  function handleLeave() {
    clearTimeout(hoverTimer.current);
    leaveTimer.current = setTimeout(() => {
      setHoveredId(null);
      setCardPos(null);
    }, 100);
  }

  const hoveredFilm = films.find(f => f.id === hoveredId);

  return (
    <>
      {/* Backdrop */}
      <div onClick={handleClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.92)', zIndex: 100,
        backdropFilter: 'blur(10px)',
        opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease',
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: visible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.96)',
        zIndex: 101, background: '#0a0a0a',
        border: '0.5px solid #2a2418', borderRadius: '4px',
        width: '96vw', maxWidth: '1600px', height: '92vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>

        {/* Close */}
        <button onClick={handleClose} style={{
          position: 'absolute', top: '20px', right: '24px',
          background: 'none', border: 'none', color: '#5a5040',
          fontSize: '28px', cursor: 'pointer', zIndex: 10, lineHeight: 1,
          transition: 'color 0.2s ease',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#f0e8d0'}
          onMouseLeave={e => e.currentTarget.style.color = '#5a5040'}
        >×</button>

        {/* Top bar */}
        <div style={{ padding: '28px 40px', borderBottom: '0.5px solid #1a1610', display: 'flex', gap: '16px', alignItems: 'center', flexShrink: 0, zIndex: 2, position: 'relative' }}>
          <div style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#c9a84c', fontWeight: '600', whiteSpace: 'nowrap', marginRight: '8px' }}>Browse</div>
          <div style={{ position: 'relative', flex: 1 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }}>
              <circle cx="11" cy="11" r="8" stroke="#f0e8d0" strokeWidth="1.5"/>
              <path d="m21 21-4.35-4.35" stroke="#f0e8d0" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input placeholder="Search by title or director..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', background: '#0d0c08', border: '0.5px solid #2a2418', borderRadius: '2px', color: '#f0e8d0', padding: '11px 14px 11px 40px', fontSize: '13px', letterSpacing: '0.5px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={{ background: '#0d0c08', border: '0.5px solid #2a2418', color: '#8a7f6a', padding: '11px 14px', fontSize: '12px', letterSpacing: '1px', borderRadius: '2px', outline: 'none', cursor: 'pointer' }}>
            <option>All Years</option>
            <option>2021 — 2026</option>
            <option>2011 — 2020</option>
            <option>2000 — 2010</option>
          </select>
          <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} style={{ background: '#0d0c08', border: '0.5px solid #2a2418', color: '#8a7f6a', padding: '11px 14px', fontSize: '12px', letterSpacing: '1px', borderRadius: '2px', outline: 'none', cursor: 'pointer' }}>
            <option>All Countries</option>
            {['MK','SRB','HR','BG','GR','BA','RO','SI','KOS','MNE','AL'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Category tabs */}
        <div style={{ padding: '16px 40px', borderBottom: '0.5px solid #1a1610', display: 'flex', gap: '8px', flexShrink: 0, zIndex: 2, position: 'relative' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              background: activeCategory === cat ? '#c9a84c' : 'none',
              border: `0.5px solid ${activeCategory === cat ? '#c9a84c' : '#2a2418'}`,
              color: activeCategory === cat ? '#0a0a0a' : '#8a7f6a',
              padding: '6px 16px', fontSize: '11px', letterSpacing: '2px',
              textTransform: 'uppercase', cursor: 'pointer', borderRadius: '1px',
              transition: 'all 0.2s ease', fontWeight: activeCategory === cat ? '700' : '400',
            }}>{cat}</button>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#3a3020', letterSpacing: '2px', alignSelf: 'center' }}>{filtered.length} titles</div>
        </div>

        {/* Film grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
            {filtered.map((film, index) => (
<div
  key={film.id}
  onMouseEnter={e => handleEnter(e, film)}
  onMouseLeave={handleLeave}
  style={{
    cursor: 'pointer',
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateX(0)' : 'translateX(24px)',
    transition: `opacity 0.5s ease ${index * 0.06}s, transform 0.5s ease ${index * 0.06}s`,
  }}
>
                <div style={{
                  width: '100%', aspectRatio: '2/3', background: '#0d0c08',
                  border: `0.5px solid ${hoveredId === film.id ? '#c9a84c' : '#2a2418'}`,
                  borderRadius: '2px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden', marginBottom: '10px',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: hoveredId === film.id ? '0 8px 24px rgba(0,0,0,0.8)' : 'none',
                }}>
                  {film.poster_file ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_R2_URL}/${film.poster_file}`}
                      alt={film.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                    />
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.08 }}>
                      <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
                      <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
                      <line x1="2" y1="7" x2="22" y2="7" stroke="#c9a84c" strokeWidth="0.5"/>
                      <line x1="2" y1="17" x2="22" y2="17" stroke="#c9a84c" strokeWidth="0.5"/>
                    </svg>
                  )}
                  <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '9px', letterSpacing: '2px', color: '#c9a84c', fontWeight: '600', textTransform: 'uppercase' }}>{film.countries?.code}</div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#d0c8b0', letterSpacing: '0.3px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{film.title}</div>
                <div style={{ fontSize: '10px', color: '#8a7f6a', letterSpacing: '1px', textTransform: 'uppercase' }}>{film.directors?.name} · {film.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover card */}
      {hoveredFilm && cardPos && (
        <div
          onMouseEnter={() => clearTimeout(leaveTimer.current)}
          onMouseLeave={handleLeave}
          style={{
            position: 'fixed',
            left: cardPos.left,
            top: cardPos.top,
            width: '380px',
            zIndex: 500,
            background: '#0a0a0a',
            border: '0.5px solid #c9a84c',
            borderRadius: '3px',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.95), 0 0 0 0.5px rgba(201,168,76,0.15)',
            animation: 'cardExpand 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            transformOrigin: 'top center',
          }}
        >
          {/* 16/9 video area */}
          <div style={{ width: '100%', aspectRatio: '16/9', background: '#080806', position: 'relative', overflow: 'hidden' }}>
            {hoveredFilm.trailer_file ? (
              <video
                key={hoveredFilm.id}
                src={`${process.env.NEXT_PUBLIC_R2_URL}/${hoveredFilm.trailer_file}`}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.06 }}>
                  <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
                  <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
                </svg>
              </div>
            )}
            <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '9px', letterSpacing: '2px', color: '#c9a84c', fontWeight: '600', textTransform: 'uppercase' }}>{hoveredFilm.countries?.code}</div>
            <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '9px', letterSpacing: '2px', color: '#8a7f6a', textTransform: 'uppercase' }}>{hoveredFilm.genre}</div>
          </div>

          {/* Info */}
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#f0e8d0', letterSpacing: '0.5px', marginBottom: '6px' }}>{hoveredFilm.title}</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', color: '#c9a84c', letterSpacing: '1px', border: '0.5px solid #2a2418', padding: '2px 7px', borderRadius: '1px' }}>{hoveredFilm.year}</span>
              <span style={{ fontSize: '10px', color: '#8a7f6a', letterSpacing: '1px', border: '0.5px solid #2a2418', padding: '2px 7px', borderRadius: '1px', textTransform: 'uppercase' }}>{hoveredFilm.genre}</span>
              <span style={{ fontSize: '10px', color: '#c9a84c', letterSpacing: '1px', border: '0.5px solid #2a2418', padding: '2px 7px', borderRadius: '1px' }}>{hoveredFilm.countries?.code}</span>
            </div>
            <div style={{ fontSize: '10px', color: '#5a5040', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Dir. {hoveredFilm.directors?.name}</div>
<p style={{
  fontSize: '11px', color: '#8a7f6a', lineHeight: '1.8', letterSpacing: '0.3px', margin: 0,
  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
}}>{hoveredFilm.synopsis}</p>

<button
  style={{
    marginTop: '16px',
    background: 'none',
    border: '0.5px solid #3a3020',
    color: '#5a5040',
    padding: '9px 24px',
    fontSize: '10px',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '1px',
    width: '100%',
    transition: 'background 0.6s ease, border-color 0.6s ease, color 0.6s ease',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.background = '#c9a84c';
    e.currentTarget.style.borderColor = '#c9a84c';
    e.currentTarget.style.color = '#0a0a0a';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.background = 'none';
    e.currentTarget.style.borderColor = '#3a3020';
    e.currentTarget.style.color = '#5a5040';
  }}
>
  Play
</button>

<div
  onClick={() => window.location.href = `/films/${hoveredFilm.id}`}
  style={{
    marginTop: '10px',
    textAlign: 'center',
    fontSize: '9px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#3a3020',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    paddingBottom: '4px',
  }}
  onMouseEnter={e => e.currentTarget.style.color = '#8a7f6a'}
  onMouseLeave={e => e.currentTarget.style.color = '#3a3020'}
>
  See More
</div>

          </div>
        </div>
      )}

      <style>{`
        @keyframes cardExpand {
          from { opacity: 0; transform: scaleY(0.85); }
          to   { opacity: 1; transform: scaleY(1); }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
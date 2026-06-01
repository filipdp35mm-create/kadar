'use client';

import { useRef, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { createPortal } from 'react-dom';
import ProfileModal from './ProfileModal';

const R2 = process.env.NEXT_PUBLIC_R2_URL;

export default function YourPicks() {
  const rowRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [user, setUser] = useState(null);
  const [picks, setPicks] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchPicks(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchPicks(session.user.id);
      else setPicks([]);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchPicks(userId) {
    const { data } = await supabase
      .from('watchlist')
      .select(`
        film_id,
        films (
          id, title, year, type, avg_rating, poster_file,
          countries (code)
        )
      `)
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });
    if (data) setPicks(data.map(row => row.films).filter(Boolean));
  }

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
    <>
    <section style={{ padding: '0 0 60px', position: 'relative' }}>

      {/* Section header */}
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
        {user && picks.length > 0 && (
          <a href="#" 
            onClick={e => { e.preventDefault(); setShowProfile(true); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
              color: '#c9a84c', textDecoration: 'none',
              border: '0.5px solid #3a3020', padding: '6px 14px', borderRadius: '1px',
              transition: 'all 0.2s ease', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.boxShadow = '0 0 12px rgba(201,168,76,0.4)'; e.currentTarget.style.color = '#f0e8d0'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3020'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.color = '#c9a84c'; }}
          >View All →</a>
        )}
      </div>

      {/* NOT LOGGED IN */}
      {!user && (
        <div style={{
          margin: '0 80px', border: '0.5px solid #1a1610', borderRadius: '2px',
          padding: '48px 40px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', background: '#0d0c08', gap: '40px',
        }}>
          <div style={{ display: 'flex', gap: '10px', flex: 1, filter: 'blur(3px)', opacity: 0.3, pointerEvents: 'none', overflow: 'hidden' }}>
            {[0,1,2,3,4].map(i => <div key={i} style={{ width: '80px', height: '120px', flexShrink: 0, background: '#161208', border: '0.5px solid #2a2418', borderRadius: '2px' }} />)}
          </div>

          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '12px', fontWeight: '500' }}>Your Picks</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#f0e8d0', letterSpacing: '1px', marginBottom: '10px', fontFamily: 'sans-serif' }}>Sign in to access Your Picks</div>
            <p style={{ fontSize: '13px', color: '#5a5040', lineHeight: '1.7', maxWidth: '300px', margin: '0 auto 24px', letterSpacing: '0.3px' }}>
              Save films and music videos to keep track of what you want to watch.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-auth', { detail: 'login' }))}
                style={{ background: '#c9a84c', border: 'none', color: '#0a0a0a', padding: '10px 24px', fontSize: '12px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff7e0'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#c9a84c'; }}
              >Sign In</button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-auth', { detail: 'signup' }))}
                style={{ background: 'none', border: '0.5px solid #3a3020', color: '#8a7f6a', padding: '10px 24px', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#f0e8d0'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3020'; e.currentTarget.style.color = '#8a7f6a'; }}
              >Create Account</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flex: 1, filter: 'blur(3px)', opacity: 0.3, pointerEvents: 'none', overflow: 'hidden', justifyContent: 'flex-end' }}>
            {[0,1,2,3,4].map(i => <div key={i} style={{ width: '80px', height: '120px', flexShrink: 0, background: '#161208', border: '0.5px solid #2a2418', borderRadius: '2px' }} />)}
          </div>
        </div>
      )}

      {/* LOGGED IN — empty state */}
      {user && picks.length === 0 && (
        <div style={{
          margin: '0 80px', border: '0.5px solid #1a1610', borderRadius: '2px',
          padding: '48px 40px', textAlign: 'center', background: '#0d0c08',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#3a3020', marginBottom: '12px' }}>No picks yet</div>
          <div style={{ fontSize: '16px', color: '#8a7f6a', letterSpacing: '0.5px' }}>Browse films and click a poster to save it here.</div>
        </div>
      )}

      {/* LOGGED IN — picks row */}
      {user && picks.length > 0 && (
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
          {picks.map(film => (
            <div
              key={film.id}
              onClick={() => window.location.href = `/films/${film.id}`}
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
                boxShadow: hoveredId === film.id ? '0 12px 32px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(201,168,76,0.3)' : '0 4px 12px rgba(0,0,0,0.4)',
              }}>
                {film.poster_file ? (
                  <img src={`${R2}/${film.poster_file}`} alt={film.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.12 }}>
                    <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
                    <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
                    <line x1="2" y1="7" x2="22" y2="7" stroke="#c9a84c" strokeWidth="0.5"/>
                    <line x1="2" y1="17" x2="22" y2="17" stroke="#c9a84c" strokeWidth="0.5"/>
                  </svg>
                )}
                <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '9px', letterSpacing: '2px', color: '#c9a84c', fontWeight: '600', textTransform: 'uppercase' }}>{film.countries?.code}</div>
                {film.avg_rating && <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '10px', color: '#c9a84c', letterSpacing: '1px' }}>★ {film.avg_rating}</div>}
                {hoveredId === film.id && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '0.5px solid #c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="#c9a84c"><polygon points="4,2 14,8 4,14"/></svg>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#d0c8b0', letterSpacing: '0.3px', lineHeight: '1.3', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{film.title}</div>
<div style={{ fontSize: '10px', color: '#8a7f6a', letterSpacing: '1px', textTransform: 'uppercase' }}>{film.type} · {film.year}</div>
           </div>
          ))}
        </div>
      )}

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </section>

    {mounted && showProfile && user && createPortal(
      <ProfileModal
        onClose={() => setShowProfile(false)}
        user={user}
        username={user.email.split('@')[0]}
      />,
      document.body
    )}
    </>
  );
}
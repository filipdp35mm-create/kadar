'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const R2 = process.env.NEXT_PUBLIC_R2_URL;

const CATEGORIES = [
  { id: 'picks', label: 'Your Picks' },
  { id: 'ratings', label: 'Ratings' },
  { id: 'history', label: 'Watch History' },
  { id: 'subscription', label: 'Subscription' },
  { id: 'settings', label: 'Account Settings' },
];

export default function ProfileModal({ onClose, user, username }) {
  const [activeCategory, setActiveCategory] = useState('picks');
  const [visible, setVisible] = useState(false);
  const [picks, setPicks] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 350);
  }

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      const { data: wl } = await supabase
        .from('watchlist')
        .select(`film_id, saved_at, films (id, title, year, type, avg_rating, poster_file, countries (code))`)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });
      if (wl) setPicks(wl.map(r => ({ ...r.films, saved_at: r.saved_at })).filter(Boolean));

      const { data: rt } = await supabase
        .from('ratings')
        .select(`score, created_at, films (id, title, year, type, poster_file, countries (code))`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (rt) setRatings(rt.map(r => ({ ...r.films, score: r.score })).filter(Boolean));
    }
    fetchData();
  }, [user]);

  return (
    <>
      {/* Backdrop */}
      <div onClick={handleClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(8px)', zIndex: 200,
        opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease',
      }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: visible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.96)',
        zIndex: 201, background: '#0a0a0a',
        border: '0.5px solid #2a2418', borderRadius: '4px',
        width: '90vw', maxWidth: '1200px', height: '85vh',
        display: 'flex', overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>

        {/* Close */}
        <button onClick={handleClose} style={{
          position: 'absolute', top: '20px', right: '24px',
          background: 'none', border: 'none', color: '#5a5040',
          fontSize: '24px', cursor: 'pointer', zIndex: 10, lineHeight: 1,
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#f0e8d0'}
          onMouseLeave={e => e.currentTarget.style.color = '#5a5040'}
        >×</button>

        {/* LEFT sidebar */}
        <div style={{
          width: '220px', flexShrink: 0,
          borderRight: '0.5px solid #1a1610',
          padding: '32px 20px',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {/* Username */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#3a3020', marginBottom: '6px' }}>Signed in as</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#c9a84c', letterSpacing: '0.5px' }}>{username}</div>
          </div>

          {/* Categories */}
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: activeCategory === cat.id ? '#1a1610' : 'none',
                border: activeCategory === cat.id ? '0.5px solid #2a2418' : '0.5px solid transparent',
                color: activeCategory === cat.id ? '#c9a84c' : '#8a7f6a',
                padding: '10px 14px', borderRadius: '2px',
                fontSize: '12px', letterSpacing: '1px',
                textAlign: 'left', cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
              }}
              onMouseEnter={e => { if (activeCategory !== cat.id) e.currentTarget.style.color = '#f0e8d0'; }}
              onMouseLeave={e => { if (activeCategory !== cat.id) e.currentTarget.style.color = '#8a7f6a'; }}
            >
              {cat.label}
            </button>
          ))}

          {/* Sign out at bottom */}
          <div style={{ flex: 1 }} />
          <button
            onClick={async () => { await supabase.auth.signOut(); handleClose(); }}
            style={{
              background: 'none', border: '0.5px solid #2a2418', color: '#5a5040',
              padding: '10px 14px', borderRadius: '2px',
              fontSize: '11px', letterSpacing: '2px',
              textAlign: 'left', cursor: 'pointer',
              textTransform: 'uppercase', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e05a3a'; e.currentTarget.style.borderColor = '#e05a3a'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#5a5040'; e.currentTarget.style.borderColor = '#2a2418'; }}
          >Sign Out</button>
        </div>

        {/* RIGHT content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>

          {/* Category title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#8a7f6a', fontWeight: '500' }}>
              {CATEGORIES.find(c => c.id === activeCategory)?.label}
            </span>
            <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
          </div>

          {/* YOUR PICKS */}
          {activeCategory === 'picks' && (
            <div>
              {picks.length === 0 ? (
                <div style={{ fontSize: '13px', color: '#3a3020', letterSpacing: '1px' }}>No picks saved yet. Browse films and click a poster to save.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '20px' }}>
                  {picks.map(film => (
                    <div key={film.id} onClick={() => { handleClose(); window.location.href = `/films/${film.id}`; }}
                      onMouseEnter={() => setHoveredId(film.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{ cursor: 'pointer', transition: 'transform 0.2s ease', transform: hoveredId === film.id ? 'translateY(-4px)' : 'translateY(0)' }}
                    >
                      <div style={{
                        width: '100%', aspectRatio: '2/3', background: '#0d0c08',
                        border: `0.5px solid ${hoveredId === film.id ? '#c9a84c' : '#2a2418'}`,
                        borderRadius: '2px', overflow: 'hidden', position: 'relative',
                        marginBottom: '8px', transition: 'border-color 0.2s ease',
                      }}>
                        {film.poster_file ? (
                          <img src={`${R2}/${film.poster_file}`} alt={film.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.08 }}>
                              <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
                              <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
                            </svg>
                          </div>
                        )}
                        <div style={{ position: 'absolute', top: '6px', left: '6px', fontSize: '8px', letterSpacing: '2px', color: '#c9a84c', fontWeight: '600', textTransform: 'uppercase' }}>{film.countries?.code}</div>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#d0c8b0', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{film.title}</div>
                      <div style={{ fontSize: '9px', color: '#8a7f6a', letterSpacing: '1px', textTransform: 'uppercase' }}>{film.year} · {film.type}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RATINGS */}
          {activeCategory === 'ratings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ratings.length === 0 ? (
                <div style={{ fontSize: '13px', color: '#3a3020', letterSpacing: '1px' }}>No ratings yet.</div>
              ) : ratings.map(film => (
                <div key={film.id} onClick={() => { handleClose(); window.location.href = `/films/${film.id}`; }}
                  style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '12px', border: '0.5px solid #1a1610', borderRadius: '2px', background: '#0d0c08', cursor: 'pointer', transition: 'border-color 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2418'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1610'}
                >
                  <div style={{ width: '48px', height: '72px', background: '#161208', border: '0.5px solid #2a2418', borderRadius: '1px', overflow: 'hidden', flexShrink: 0 }}>
                    {film.poster_file && <img src={`${R2}/${film.poster_file}`} alt={film.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#d0c8b0', marginBottom: '4px' }}>{film.title}</div>
                    <div style={{ fontSize: '10px', color: '#8a7f6a', letterSpacing: '1px', textTransform: 'uppercase' }}>{film.year} · {film.type}</div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#c9a84c', letterSpacing: '1px', fontWeight: '600' }}>★ {film.score}</div>
                </div>
              ))}
            </div>
          )}

          {/* WATCH HISTORY */}
          {activeCategory === 'history' && (
            <div style={{ fontSize: '13px', color: '#3a3020', letterSpacing: '1px' }}>Watch history coming soon.</div>
          )}

          {/* SUBSCRIPTION */}
          {activeCategory === 'subscription' && (
            <div style={{ maxWidth: '480px' }}>
              <div style={{ padding: '24px', border: '0.5px solid #1a1610', borderRadius: '2px', background: '#0d0c08', marginBottom: '16px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#3a3020', marginBottom: '8px' }}>Current Plan</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#f0e8d0', marginBottom: '8px' }}>Free Trial</div>
                <div style={{ fontSize: '13px', color: '#8a7f6a', lineHeight: '1.7' }}>Your 30-day free trial is active. Link a card to continue after your trial ends.</div>
              </div>
              <button style={{
                background: '#c9a84c', border: 'none', color: '#0a0a0a',
                padding: '11px 24px', fontSize: '11px', fontWeight: '700',
                letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#fff7e0'}
                onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
              >Manage Subscription</button>
            </div>
          )}

          {/* ACCOUNT SETTINGS */}
          {activeCategory === 'settings' && (
            <div style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#3a3020' }}>Username</label>
                <input defaultValue={username} style={{
                  background: '#0d0c08', border: '0.5px solid #2a2418', borderRadius: '2px',
                  color: '#f0e8d0', padding: '10px 14px', fontSize: '13px', outline: 'none',
                }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#3a3020' }}>Email</label>
                <input defaultValue={user?.email} disabled style={{
                  background: '#0d0c08', border: '0.5px solid #1a1610', borderRadius: '2px',
                  color: '#5a5040', padding: '10px 14px', fontSize: '13px', outline: 'none',
                }} />
              </div>
              <button style={{
                background: '#c9a84c', border: 'none', color: '#0a0a0a',
                padding: '11px 24px', fontSize: '11px', fontWeight: '700',
                letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer',
                borderRadius: '2px', alignSelf: 'flex-start',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#fff7e0'}
                onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
              >Save Changes</button>
            </div>
          )}

        </div>
      </div>
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </>
  );
}
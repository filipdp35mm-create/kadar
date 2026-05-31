'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const R2_URL = process.env.NEXT_PUBLIC_R2_URL;

export default function ComingSoon() {
  const [films, setFilms] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComingSoon() {
const { data, error } = await supabase
  .from('films')
  .select(`
    id,
    title,
    type,
    year,
    synopsis,
    release_date,
    poster_file,
    genre,
    country_id,
    director_id,
    countries ( name, code ),
    directors ( name )
  `)
  .eq('status', 'coming_soon')
  .order('release_date', { ascending: true });

  console.log('coming soon data:', data);
console.log('coming soon error:', error);

      if (error) {
        console.error('Error fetching coming soon:', error);
      } else {
        setFilms(data || []);
      }
      setLoading(false);
    }

    fetchComingSoon();
  }, []);

  if (loading) return (
    <section style={{ padding: '0 80px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#8a7f6a', fontWeight: '500', whiteSpace: 'nowrap' }}>Coming Soon</span>
        <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ border: '0.5px solid #1a1610', borderRadius: '2px', overflow: 'hidden', background: '#0d0c08' }}>
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#080806' }} />
            <div style={{ padding: '14px 16px' }}>
              <div style={{ height: '18px', background: '#1a1610', borderRadius: '1px', marginBottom: '8px', width: '60%' }} />
              <div style={{ height: '12px', background: '#1a1610', borderRadius: '1px', width: '80%' }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  if (films.length === 0) return null;

  return (
    <section style={{ padding: '0 80px 80px' }}>

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#8a7f6a', fontWeight: '500', whiteSpace: 'nowrap', fontFamily: 'sans-serif' }}>Coming Soon</span>
        <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {films.map((film) => {
          const country = film.countries?.code || '';
          const director = film.directors?.name || '';
          const posterUrl = film.poster_file ? `${R2_URL}/${film.poster_file}` : null;
          const releaseLabel = film.release_date
            ? new Date(film.release_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'Coming Soon';

          return (
            <div
              key={film.id}
              onMouseEnter={() => setHoveredId(film.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                cursor: 'pointer',
                border: `0.5px solid ${hoveredId === film.id ? '#2a2418' : '#1a1610'}`,
                borderRadius: '2px', overflow: 'hidden',
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
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={film.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.08 }}>
                    <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
                    <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
                    <line x1="2" y1="7" x2="22" y2="7" stroke="#c9a84c" strokeWidth="0.5"/>
                    <line x1="2" y1="17" x2="22" y2="17" stroke="#c9a84c" strokeWidth="0.5"/>
                  </svg>
                )}

                {/* Coming soon overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(8,8,6,0.5)',
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

                {country && (
                  <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '9px', letterSpacing: '2px', color: '#c9a84c', fontWeight: '600', textTransform: 'uppercase' }}>
                    {country}
                  </div>
                )}
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '9px', letterSpacing: '2px', color: '#8a7f6a', textTransform: 'uppercase' }}>
                  {film.type}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{
                    fontSize: '15px', fontWeight: '700', color: '#f0e8d0',
                    letterSpacing: '0.5px', lineHeight: '1.2',
                    transition: 'color 0.2s ease',
                    ...(hoveredId === film.id && { color: '#c9a84c' }),
                  }}>
                    {film.title}
                  </div>
                  <div style={{ fontSize: '10px', letterSpacing: '2px', color: '#c9a84c', textTransform: 'uppercase', fontWeight: '500', border: '0.5px solid #2a2418', padding: '3px 8px', borderRadius: '1px', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                    {releaseLabel}
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#8a7f6a', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {director}{director && country ? ' \u00b7 ' : ''}{country}{film.year ? ` \u00b7 ${film.year}` : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
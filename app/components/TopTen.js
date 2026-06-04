'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const R2 = process.env.NEXT_PUBLIC_R2_URL;

function RankNumber({ rank }) {
  const size = rank === 1 ? '120px' : rank === 2 ? '100px' : '88px';
  const opacity = rank === 1 ? 0.12 : rank === 2 ? 0.09 : 0.07;
  return (
    <div style={{
      fontFamily: 'sans-serif', fontWeight: '700',
      fontSize: size, lineHeight: '1', color: '#c9a84c',
      opacity, letterSpacing: '-4px', userSelect: 'none',
      position: 'absolute', bottom: '-10px', left: '8px',
      pointerEvents: 'none',
    }}>{rank}</div>
  );
}

function Poster({ width, height, rank, hovered, posterFile }) {
  return (
    <div style={{
      width, height, flexShrink: 0,
      background: '#0d0c08',
      border: `0.5px solid ${hovered ? '#c9a84c' : '#2a2418'}`,
      borderRadius: '2px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      boxShadow: hovered
        ? '0 16px 40px rgba(0,0,0,0.9), 0 0 0 0.5px rgba(201,168,76,0.3)'
        : '0 4px 16px rgba(0,0,0,0.5)',
    }}>
      {posterFile ? (
        <img src={`${R2}/${posterFile}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.1 }}>
          <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
          <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
          <line x1="2" y1="7" x2="22" y2="7" stroke="#c9a84c" strokeWidth="0.5"/>
          <line x1="2" y1="17" x2="22" y2="17" stroke="#c9a84c" strokeWidth="0.5"/>
        </svg>
      )}
      {rank && <RankNumber rank={rank} />}
      {hovered && (
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
  );
}

export default function TopTen() {
  const [hoveredRank, setHoveredRank] = useState(null);
  const [topTen, setTopTen] = useState([]);

  useEffect(() => {
    async function fetchTopTen() {
      const { data } = await supabase
        .from('top10_this_week')
        .select('*');
      if (data) setTopTen(data);
    }
    fetchTopTen();
  }, []);

  if (topTen.length === 0) return null;

  const top3 = topTen.slice(0, 3);
  const rest = topTen.slice(3);

  return (
    <section style={{ padding: '0 80px 80px' }}>

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <span style={{ fontFamily: 'sans-serif', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#8a7f6a', fontWeight: '500', whiteSpace: 'nowrap' }}>Top 10 This Week</span>
        <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
      </div>

      {/* TOP 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(top3.length, 3)}, 1fr)`, gap: '16px', marginBottom: '24px' }}>
        {top3.map((film) => (
          <div
            key={film.id}
            onClick={() => window.location.href = `/films/${film.id}`}
            onMouseEnter={() => setHoveredRank(film.rank)}
            onMouseLeave={() => setHoveredRank(null)}
            style={{ cursor: 'pointer', transition: 'transform 0.2s ease', transform: hoveredRank === film.rank ? 'translateY(-6px)' : 'translateY(0)' }}
          >
            <Poster
              width="100%"
              height={film.rank === 1 ? '420px' : film.rank === 2 ? '380px' : '350px'}
              rank={film.rank}
              hovered={hoveredRank === film.rank}
              posterFile={film.poster_file}
            />
            <div style={{ padding: '12px 0 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{
                  fontFamily: 'sans-serif', fontWeight: '700',
                  fontSize: film.rank === 1 ? '28px' : film.rank === 2 ? '24px' : '20px',
                  letterSpacing: '-1px', lineHeight: '1', color: '#c9a84c',
                  textShadow: hoveredRank === film.rank ? '0 0 16px rgba(201,168,76,0.9), 0 0 32px rgba(201,168,76,0.5)' : 'none',
                  transition: 'text-shadow 0.3s ease',
                }}>#{film.rank}</span>
                <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#3a3020', textTransform: 'uppercase' }}>{film.country_code}</span>
                <span style={{ fontSize: '10px', color: '#c9a84c', letterSpacing: '1px', marginLeft: 'auto' }}>★ {film.week_rating}</span>
              </div>
              <div style={{
                fontSize: film.rank === 1 ? '20px' : film.rank === 2 ? '18px' : '16px',
                fontWeight: '700', letterSpacing: '0.5px', lineHeight: '1.2', marginBottom: '4px',
                color: hoveredRank === film.rank ? '#ffb347' : '#f0e8d0',
                textShadow: hoveredRank === film.rank ? '0 0 8px rgba(255,140,0,0.8), 0 0 20px rgba(255,80,0,0.5)' : 'none',
                animation: hoveredRank === film.rank ? `flameBurn${Math.min(film.rank, 3)} 1.5s ease-in-out infinite` : 'none',
                transition: 'color 0.3s ease, text-shadow 0.3s ease',
              }}>{film.title}</div>
              <div style={{ fontSize: '11px', color: '#8a7f6a', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {film.director_name} · {film.year} · {film.type}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      {rest.length > 0 && <div style={{ height: '0.5px', background: '#1a1610', margin: '32px 0' }} />}

      {/* BOTTOM 7 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {rest.map((film, i) => (
          <div
            key={film.id}
            onClick={() => window.location.href = `/films/${film.id}`}
            onMouseEnter={() => setHoveredRank(film.rank)}
            onMouseLeave={() => setHoveredRank(null)}
            style={{
              display: 'grid', gridTemplateColumns: '48px 100px 1fr auto',
              gap: '16px', alignItems: 'flex-start',
              padding: '16px 0',
              borderBottom: i < rest.length - 1 ? '0.5px solid #1a1610' : 'none',
              cursor: 'pointer', transition: 'background 0.2s ease',
              background: hoveredRank === film.rank ? 'rgba(201,168,76,0.02)' : 'transparent',
              borderRadius: '2px',
            }}
          >
            <div style={{
              fontFamily: 'sans-serif', fontWeight: '700', fontSize: '28px',
              letterSpacing: '-1px', lineHeight: '1', textAlign: 'right',
              color: hoveredRank === film.rank ? '#c9a84c' : '#3a3020',
              textShadow: hoveredRank === film.rank ? '0 0 12px rgba(201,168,76,0.8)' : 'none',
              transition: 'color 0.3s ease, text-shadow 0.3s ease',
            }}>{film.rank}</div>
            <Poster width="100px" height="150px" hovered={hoveredRank === film.rank} posterFile={film.poster_file} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: hoveredRank === film.rank ? '#f0e8d0' : '#d0c8b0', letterSpacing: '0.3px', marginBottom: '3px', transition: 'color 0.2s ease' }}>
                {film.title}
              </div>
              <div style={{ fontSize: '11px', color: '#8a7f6a', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {film.director_name} · {film.country_code} · {film.year} · {film.type}
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#c9a84c', letterSpacing: '1px', fontWeight: '500', whiteSpace: 'nowrap' }}>
              ★ {film.week_rating}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes flameBurn1 {
          0%,100% { color: #f0e8d0; text-shadow: none; }
          25% { color: #ffb347; text-shadow: 0 0 8px rgba(255,140,0,0.8), 0 0 16px rgba(255,80,0,0.5); }
          50% { color: #ff6a00; text-shadow: 0 0 12px rgba(255,100,0,0.9), 0 0 24px rgba(255,50,0,0.6), 0 0 40px rgba(200,0,0,0.3); }
          75% { color: #ffb347; text-shadow: 0 0 8px rgba(255,140,0,0.8), 0 0 16px rgba(255,80,0,0.5); }
        }
        @keyframes flameBurn2 {
          0%,100% { color: #f0e8d0; text-shadow: none; }
          30% { color: #ffb347; text-shadow: 0 0 6px rgba(255,140,0,0.7), 0 0 12px rgba(255,80,0,0.4); }
          60% { color: #ff8c00; text-shadow: 0 0 10px rgba(255,120,0,0.8), 0 0 20px rgba(255,60,0,0.5); }
        }
        @keyframes flameBurn3 {
          0%,100% { color: #f0e8d0; text-shadow: none; }
          40% { color: #c9a84c; text-shadow: 0 0 6px rgba(201,168,76,0.7), 0 0 12px rgba(201,140,0,0.4); }
          80% { color: #ffb347; text-shadow: 0 0 8px rgba(255,140,0,0.6), 0 0 16px rgba(255,80,0,0.3); }
        }
      `}</style>
    </section>
  );
}
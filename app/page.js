'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import YourPicks from './components/YourPicks';
import TopTen from './components/TopTen';
import FanFavorites from './components/FanFavorites';
import ComingSoon from './components/ComingSoon';
import BrowseModal from './components/BrowseModal';


function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return count;
}

function FilmLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading');

  useEffect(() => {
    let current = 0;
    const timer = setInterval(() => {
      current += Math.random() * 3 + 1;
      if (current >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => setPhase('fade'), 400);
        setTimeout(() => onComplete(), 1000);
      } else {
        setProgress(Math.floor(current));
      }
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0a0a0a', zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity: phase === 'fade' ? 0 : 1, transition: 'opacity 0.6s ease',
      pointerEvents: phase === 'fade' ? 'none' : 'all',
    }}>
      <div style={{ display: 'flex', gap: '3px', marginBottom: '48px' }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{
            width: '28px', height: '42px',
            background: progress > (i / 7) * 100 ? '#c9a84c' : '#161208',
            border: '0.5px solid #2a2418', borderRadius: '1px',
            transition: 'background 0.3s ease', position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: '4px', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '5px', background: '#0a0a0a', borderRadius: '1px' }} />
            <div style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '5px', background: '#0a0a0a', borderRadius: '1px' }} />
          </div>
        ))}
      </div>
      <div style={{ fontFamily: 'sans-serif', fontSize: '32px', letterSpacing: '10px', color: '#c9a84c', fontWeight: '700', marginBottom: '32px' }}>КАДАР</div>
      <div style={{ width: '200px', height: '0.5px', background: '#1a1610', position: 'relative', marginBottom: '16px' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: '#c9a84c', transition: 'width 0.1s linear' }} />
      </div>
      <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#3a3020', textTransform: 'uppercase' }}>{progress}%</div>
    </div>
  );
}

const FEATURED = [
  { id: 1, tag: 'New Release', title: 'Последниот Воз', subtitle: 'Watch the Trailer', duration: '2:14', country: 'MK', year: '2024', type: 'Short Film' },
  { id: 2, tag: 'Music Video', title: 'Bela Soba', subtitle: 'Official Music Video', duration: '3:42', country: 'SRB', year: '2024', type: 'Music Video' },
  { id: 3, tag: 'Festival Pick', title: 'Нощен Влак', subtitle: 'Sarajevo FF Selection', duration: '18:00', country: 'BG', year: '2023', type: 'Short Film' },
  { id: 4, tag: 'Staff Pick', title: 'Tihi Grad', subtitle: 'Watch the Short Film', duration: '14:30', country: 'HR', year: '2024', type: 'Short Film' },
  { id: 5, tag: "Editor's Choice", title: 'Valuri', subtitle: 'Romanian Competition Entry', duration: '22:10', country: 'RO', year: '2024', type: 'Short Film' },
];

function PosterThumb({ small = false }) {
  return (
    <div style={{
      width: small ? '100px' : '140px', height: small ? '70px' : '96px',
      background: '#161208', border: '0.5px solid #2a2418', borderRadius: '2px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.2 }}>
        <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
        <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
        <line x1="2" y1="7" x2="22" y2="7" stroke="#c9a84c" strokeWidth="0.5"/>
        <line x1="2" y1="17" x2="22" y2="17" stroke="#c9a84c" strokeWidth="0.5"/>
      </svg>
    </div>
  );
}

// Single film frame for the strip
function FilmFrame() {
  return (
    <div style={{
      width: '48px', height: '64px', background: '#0d0c08',
      border: '0.5px solid #1a1610', borderRadius: '1px',
      flexShrink: 0, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ position: 'absolute', top: '4px', left: '50%', transform: 'translateX(-50%)', width: '7px', height: '5px', background: '#1a1610', borderRadius: '1px' }} />
      <div style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', width: '7px', height: '5px', background: '#1a1610', borderRadius: '1px' }} />
      <div style={{ width: '30px', height: '38px', background: '#161208', border: '0.5px solid #1a1610', borderRadius: '1px' }} />
    </div>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const [loaded, setLoaded] = useState(false);
  const [glitchDone, setGlitchDone] = useState(false);
  const [glitchLine1, setGlitchLine1] = useState('THE FRAME');
  const [glitchLine2, setGlitchLine2] = useState('IS THE');
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [glowLeft, setGlowLeft] = useState(false);
  const [glowRight, setGlowRight] = useState(false);
  const [showBrowse, setShowBrowse] = useState(false);

  const pageRef = useRef(null);
  const featuredRef = useRef(null);

  const films = useCountUp(50, 2000, loaded);
  const videos = useCountUp(20, 2200, loaded);
  const countriesCount = useCountUp(11, 1800, loaded);

  const staticLine1 = 'THE FRAME';
  const staticLine2 = 'IS THE';

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse tracking for spotlight + hide over main screen
  const [spotlightHidden, setSpotlightHidden] = useState(false);
  const screenRef = useRef(null);

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (screenRef.current) {
        const rect = screenRef.current.getBoundingClientRect();
        const inside =
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom;
        setSpotlightHidden(inside);
      }
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Glitch effect
  useEffect(() => {
    if (!loaded || glitchDone) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%';
    let iter1 = 0, iter2 = 0;
    const interval = setInterval(() => {
      if (iter1 <= staticLine1.length) {
        setGlitchLine1(staticLine1.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iter1) return staticLine1[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(''));
        iter1++;
      }
      if (iter1 > 4 && iter2 <= staticLine2.length) {
        setGlitchLine2(staticLine2.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iter2) return staticLine2[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join(''));
        iter2++;
      }
      if (iter1 > staticLine1.length && iter2 > staticLine2.length) {
        setGlitchLine1(staticLine1);
        setGlitchLine2(staticLine2);
        setGlitchDone(true);
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [loaded, glitchDone]);

  // Featured auto-rotate
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      triggerTransition((current + 1) % FEATURED.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, current]);

  function triggerTransition(index) {
    setTransitioning(true);
    setTimeout(() => { setCurrent(index); setTransitioning(false); }, 300);
  }

  function goTo(index) {
    triggerTransition(index);
    setPaused(true);
    setTimeout(() => setPaused(false), 10000);
  }

  function prev() {
    setGlowLeft(true);
    setTimeout(() => setGlowLeft(false), 600);
    goTo((current - 1 + FEATURED.length) % FEATURED.length);
  }

  function next() {
    setGlowRight(true);
    setTimeout(() => setGlowRight(false), 600);
    goTo((current + 1) % FEATURED.length);
  }

  const film = FEATURED[current];

  return (
    <>
      {!loaded && <FilmLoader onComplete={() => setLoaded(true)} />}

      {/* Spotlight — hides behind featured screen */}
      {/* Spotlight — hidden when modal open */}
      <div style={{
        position: 'fixed',
        width: '140px', height: '140px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.22) 0%, rgba(201,168,76,0.07) 45%, transparent 70%)',
        left: mousePos.x - 70, top: mousePos.y - 70,
        pointerEvents: 'none',
        transition: 'left 0.05s ease, top 0.05s ease, opacity 0.3s ease',
        zIndex: 9998,
        mixBlendMode: 'screen',
        opacity: spotlightHidden || showBrowse ? 0 : 1,
      }} />

      <div ref={pageRef} className={`scroll-blur${isScrolling ? ' scrolling' : ''}`} style={{
        position: 'relative', width: '100%', overflowX: 'hidden',
        opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease',
      }}>

        {/* Sticky navbar */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          opacity: scrollY > 80 ? 1 : 0,
          pointerEvents: scrollY > 80 ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
          backdropFilter: 'blur(12px)',
          background: 'rgba(10,10,10,0.85)',
          borderBottom: '0.5px solid #2a2418',
        }}>
          <Navbar />
        </div>

        {/* Static navbar */}
        <Navbar />

        {/* LEFT film strip — full page height */}
        <div style={{
          position: 'fixed', top: '90px', left: 0, width: '48px',
          bottom: '0', overflow: 'hidden', pointerEvents: 'none', zIndex: 1,
        }}>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '4px',
            transform: `translateY(${-scrollY * 0.3}px)`,
            transition: 'transform 0.1s linear',
          }}>
            {Array.from({ length: 60 }).map((_, i) => <FilmFrame key={i} />)}
          </div>
        </div>

        {/* ============ HERO SECTION ============ */}
        <section style={{
          padding: '80px 80px 100px',
          position: 'relative', overflow: 'hidden', minHeight: '520px',
        }}>

          {/* Background blurred КАДАР */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'sans-serif', fontSize: '320px', color: '#111008',
            letterSpacing: '-5px', lineHeight: '1',
            userSelect: 'none', pointerEvents: 'none',
            fontWeight: '700', filter: 'blur(8px)', whiteSpace: 'nowrap', zIndex: 0,
          }}>
            КАДАР
          </div>

          {/* RIGHT poster strip — hero only, recently watched placeholders */}
          <div style={{
            position: 'absolute', top: '70px', right: 0, width: '160px', height: 'calc(100% - 70px)',
            display: 'flex', flexDirection: 'column', zIndex: 1, pointerEvents: 'none',
          }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{
                flex: 1, background: '#0d0c08',
                borderLeft: '0.5px solid #2a2418',
                borderBottom: i < 3 ? '0.5px solid #1a1610' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.15 }}>
                  <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
                  <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
                  <line x1="2" y1="7" x2="22" y2="7" stroke="#c9a84c" strokeWidth="0.5"/>
                  <line x1="2" y1="17" x2="22" y2="17" stroke="#c9a84c" strokeWidth="0.5"/>
                </svg>
              </div>
            ))}
          </div>

          {/* Hero content */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>

            <div style={{
              fontSize: '11px', fontWeight: '500', letterSpacing: '4px',
              textTransform: 'uppercase', color: '#c9a84c', marginBottom: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            }}>
              <span style={{ display: 'block', width: '24px', height: '0.5px', background: '#c9a84c' }}></span>
              Balkan short cinema & music video archive
              <span style={{ display: 'block', width: '24px', height: '0.5px', background: '#c9a84c' }}></span>
            </div>

            <h1 style={{
              fontFamily: 'sans-serif', fontSize: '72px', lineHeight: '1.05',
              letterSpacing: '3px', color: '#f0e8d0', margin: '0 0 8px',
              fontWeight: '700', textTransform: 'uppercase',
            }}>
              <span style={{ display: 'block' }}>{glitchLine1}</span>
              <span style={{ display: 'block' }}>
                {glitchLine2}{' '}
                <span style={{
                  fontFamily: "'Pinyon Script', cursive",
                  fontSize: '80px', color: '#c9a84c', fontWeight: '700',
                  textTransform: 'none', letterSpacing: '1px',
                  animation: 'storyPulse 3s ease-in-out infinite',
                  display: 'inline-block',
                }}>
                  Story
                </span>
              </span>
            </h1>

            <p style={{
              fontSize: '15px', fontWeight: '300', color: '#5a5040',
              letterSpacing: '1px', margin: '20px auto 32px',
              lineHeight: '1.6', maxWidth: '380px', textAlign: 'center',
            }}>
              A curated database of short films and music videos from across the Balkans.
              Discover directors, track festivals, rate and review the work that defines a region.
            </p>

<button
  onClick={() => setShowBrowse(true)}
  style={{
    background: '#c9a84c', border: 'none', color: '#0a0a0a',
    padding: '12px 28px', fontSize: '13px', fontWeight: '700',
    letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer',
    borderRadius: '2px', position: 'relative', overflow: 'hidden',
    transition: 'all 0.15s ease',
  }}
  onMouseEnter={e => {
                  e.currentTarget.style.background = '#fff7e0';
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(201,168,76,0.6), 0 0 8px rgba(201,168,76,0.4)';
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
                Browse Films
              </button>
              <button
                style={{
                  background: 'none', border: '0.5px solid #3a3020', color: '#8a7f6a',
                  padding: '12px 28px', fontSize: '13px', fontWeight: '500',
                  letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer',
                  borderRadius: '2px', position: 'relative', overflow: 'hidden',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#c9a84c';
                  e.currentTarget.style.color = '#fff7e0';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(201,168,76,0.4), inset 0 0 20px rgba(201,168,76,0.05)';
                  setTimeout(() => {
                    if (e.currentTarget) {
                      e.currentTarget.style.boxShadow = '0 0 8px rgba(201,168,76,0.15), inset 0 0 12px rgba(201,168,76,0.03)';
                    }
                  }, 150);
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#3a3020';
                  e.currentTarget.style.color = '#8a7f6a';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                For Directors
              </button>

            <div style={{ display: 'flex', marginTop: '48px', borderTop: '0.5px solid #1a1610', paddingTop: '32px' }}>
              {[
                { num: films + '+', label: 'Short Films' },
                { num: videos + '+', label: 'Music Videos' },
                { num: countriesCount, label: 'Countries' },
              ].map((stat, i) => (
                <div key={i} style={{
                  flex: 1,
                  paddingRight: i < 2 ? '24px' : '0',
                  borderRight: i < 2 ? '0.5px solid #1a1610' : 'none',
                  marginRight: i < 2 ? '24px' : '0',
                }}>
                  <div style={{ fontSize: '36px', color: '#c9a84c', letterSpacing: '2px', lineHeight: '1', fontWeight: '700' }}>{stat.num}</div>
                  <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#3a3020', marginTop: '4px', fontWeight: '500' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ FEATURED SECTION ============ */}
        <section ref={featuredRef} style={{
          padding: '0 80px 60px', background: '#0a0a0a',
          position: 'relative', zIndex: 0, marginTop: '-1px',
        }}>

          <div style={{ paddingTop: '48px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <span style={{ fontFamily: 'sans-serif', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#8a7f6a', fontWeight: '500' }}>Featured</span>
            <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>

            {/* Main visual */}
            <div>
              <div ref={screenRef} style={{
                position: 'relative', background: '#0d0c08',
                border: '0.5px solid #2a2418', borderRadius: '2px',
                overflow: 'hidden', aspectRatio: '16/9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.6)',
                transform: 'translateY(-4px)',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: transitioning ? 0 : 1,
                  transform: transitioning ? 'scale(1.02)' : 'scale(1)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.08 }}>
                    <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
                    <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
                    <line x1="2" y1="7" x2="22" y2="7" stroke="#c9a84c" strokeWidth="0.5"/>
                    <line x1="2" y1="17" x2="22" y2="17" stroke="#c9a84c" strokeWidth="0.5"/>
                  </svg>
                </div>

                <div style={{
                  position: 'absolute', top: '16px', left: '16px',
                  background: '#c9a84c', color: '#0a0a0a',
                  fontSize: '10px', fontWeight: '700', letterSpacing: '2px',
                  textTransform: 'uppercase', padding: '4px 10px', borderRadius: '1px',
                  opacity: transitioning ? 0 : 1, transition: 'opacity 0.3s ease',
                }}>{film.tag}</div>

                <div style={{
                  position: 'absolute', top: '16px', right: '16px',
                  fontSize: '11px', letterSpacing: '2px', color: '#5a5040', textTransform: 'uppercase',
                  opacity: transitioning ? 0 : 1, transition: 'opacity 0.3s ease',
                }}>{film.country} &middot; {film.type}</div>

                <button onClick={prev} style={{
                  position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(10,10,10,0.7)', border: '0.5px solid #2a2418',
                  color: glowLeft ? '#c9a84c' : '#f0e8d0',
                  width: '36px', height: '36px', borderRadius: '50%',
                  cursor: 'pointer', fontSize: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: glowLeft ? '0 0 12px rgba(201,168,76,0.8), 0 0 24px rgba(201,168,76,0.4)' : 'none',
                  transition: 'box-shadow 0.2s ease, color 0.2s ease, transform 0.1s ease', zIndex: 2,
                }}
                  onMouseDown={e => e.currentTarget.style.transform = 'translateY(-50%) scale(0.85)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                >‹</button>

                <button onClick={next} style={{
                  position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(10,10,10,0.7)', border: '0.5px solid #2a2418',
                  color: glowRight ? '#c9a84c' : '#f0e8d0',
                  width: '36px', height: '36px', borderRadius: '50%',
                  cursor: 'pointer', fontSize: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: glowRight ? '0 0 12px rgba(201,168,76,0.8), 0 0 24px rgba(201,168,76,0.4)' : 'none',
                  transition: 'box-shadow 0.2s ease, color 0.2s ease, transform 0.1s ease', zIndex: 2,
                }}
                  onMouseDown={e => e.currentTarget.style.transform = 'translateY(-50%) scale(0.85)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                >›</button>

                <div style={{
                  position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', gap: '6px',
                }}>
                  {FEATURED.map((_, i) => (
                    <div key={i} onClick={() => goTo(i)} style={{
                      width: i === current ? '20px' : '6px', height: '3px',
                      background: i === current ? '#c9a84c' : '#3a3020',
                      borderRadius: '2px', cursor: 'pointer', transition: 'all 0.3s ease',
                    }} />
                  ))}
                </div>
              </div>

              {/* Below visual */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px',
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? 'translateY(6px)' : 'translateY(0)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
              }}>
                <PosterThumb />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#f0e8d0', letterSpacing: '1px', marginBottom: '4px' }}>{film.title}</div>
                  <div style={{ fontSize: '13px', color: '#5a5040', letterSpacing: '1px' }}>{film.subtitle}</div>
                  <div style={{ fontSize: '11px', color: '#3a3020', letterSpacing: '1px', marginTop: '4px' }}>{film.duration} &middot; {film.year}</div>
                </div>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  border: '0.5px solid #3a3020',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="#c9a84c">
                    <polygon points="4,2 14,8 4,14"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Up next — all 5 */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#c9a84c', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>
                Up Next
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {FEATURED.map((item, i) => (
                  <div key={item.id} onClick={() => goTo(i)} style={{
                    display: 'flex', gap: '12px', alignItems: 'center',
                    cursor: 'pointer', padding: '8px',
                    border: `0.5px solid ${i === current ? '#3a3020' : 'transparent'}`,
                    borderRadius: '2px',
                    background: i === current ? '#0d0c08' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={e => { if (i !== current) e.currentTarget.style.borderColor = '#2a2418'; }}
                    onMouseLeave={e => { if (i !== current) e.currentTarget.style.borderColor = 'transparent'; }}
                  >
                    <div style={{ position: 'relative' }}>
                      <PosterThumb small />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: 'rgba(10,10,10,0.7)',
                          border: `0.5px solid ${i === current ? '#c9a84c' : '#3a3020'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <svg width="10" height="10" viewBox="0 0 16 16" fill={i === current ? '#c9a84c' : '#5a5040'}>
                            <polygon points="4,2 14,8 4,14"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '10px', color: i === current ? '#c9a84c' : '#3a3020', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '3px' }}>{item.tag}</div>
                      <div style={{ fontSize: '12px', color: i === current ? '#f0e8d0' : '#8a7f6a', fontWeight: i === current ? '600' : '400', lineHeight: '1.3', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                      <div style={{ fontSize: '10px', color: '#3a3020', letterSpacing: '1px' }}>{item.duration} &middot; {item.country}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <YourPicks />
        <TopTen />
        <FanFavorites />
        <ComingSoon />
        <Footer />

      </div>

      <style>{`
        @keyframes storyPulse {
          0%, 100% { text-shadow: 0 0 8px rgba(201,168,76,0.3), 0 0 20px rgba(201,168,76,0.1); }
          50% { text-shadow: 0 0 16px rgba(201,168,76,0.7), 0 0 40px rgba(201,168,76,0.3); }
        }
      `}</style>
      {showBrowse && <BrowseModal onClose={() => setShowBrowse(false)} />}
    </>
  );
}
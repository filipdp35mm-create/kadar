'use client';

import { useEffect, useState } from 'react';

export default function AboutPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fadeIn = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  return (
    <main style={{
      minHeight: '100vh',
      background: '#080808',
      color: '#f0e8d0',
      fontFamily: 'Georgia, "Times New Roman", serif',
    }}>

      {/* Grain */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
        backgroundSize: '200px 200px', opacity: 0.4,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Back nav */}
        <div style={{ padding: '32px 80px 0' }}>
          <a href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
            color: '#5a5040', textDecoration: 'none', transition: 'color 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
            onMouseLeave={e => e.currentTarget.style.color = '#5a5040'}
          >
            <span style={{ fontSize: '14px' }}>←</span> Return
          </a>
        </div>

        {/* Hero */}
        <header style={{ padding: '80px 80px 64px', ...fadeIn(0) }}>
          <div style={{
            fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase',
            color: '#c9a84c', marginBottom: '24px', fontFamily: 'sans-serif',
          }}>
            Cosmic Films
          </div>
          <h1 style={{
            fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: '400',
            color: '#f0e8d0', letterSpacing: '-0.5px', lineHeight: '1.1',
            margin: 0, maxWidth: '640px',
          }}>
            About<br />
            <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>Cosmic Films</em>
          </h1>
        </header>

        {/* Divider */}
        <div style={{ margin: '0 80px', height: '0.5px', background: '#1a1610' }} />

        {/* Who We Are */}
        <section id="who-we-are" style={{ padding: '80px 80px', ...fadeIn(0.1) }}>
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '80px', alignItems: 'start' }}>
            <div>
              <div style={{
                fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase',
                color: '#c9a84c', fontFamily: 'sans-serif', marginBottom: '12px',
              }}>01</div>
              <h2 style={{
                fontSize: '22px', fontWeight: '400', color: '#d0c8b0',
                margin: 0, lineHeight: '1.4',
              }}>Who We Are</h2>
            </div>
            <div style={{
              fontSize: '15px', color: '#5a5040', lineHeight: '1.9',
              letterSpacing: '0.3px', fontStyle: 'italic',
            }}>
              — Coming soon
            </div>
          </div>
        </section>

        <div style={{ margin: '0 80px', height: '0.5px', background: '#1a1610' }} />

        {/* Our Projects */}
        <section id="our-projects" style={{ padding: '80px 80px', ...fadeIn(0.15) }}>
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '80px', alignItems: 'start' }}>
            <div>
              <div style={{
                fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase',
                color: '#c9a84c', fontFamily: 'sans-serif', marginBottom: '12px',
              }}>02</div>
              <h2 style={{
                fontSize: '22px', fontWeight: '400', color: '#d0c8b0',
                margin: 0, lineHeight: '1.4',
              }}>Our Projects</h2>
            </div>
            <div style={{
              fontSize: '15px', color: '#5a5040', lineHeight: '1.9',
              letterSpacing: '0.3px', fontStyle: 'italic',
            }}>
              — Coming soon
            </div>
          </div>
        </section>

        <div style={{ margin: '0 80px', height: '0.5px', background: '#1a1610' }} />

        {/* Press */}
        <section id="press" style={{ padding: '80px 80px', ...fadeIn(0.2) }}>
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '80px', alignItems: 'start' }}>
            <div>
              <div style={{
                fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase',
                color: '#c9a84c', fontFamily: 'sans-serif', marginBottom: '12px',
              }}>03</div>
              <h2 style={{
                fontSize: '22px', fontWeight: '400', color: '#d0c8b0',
                margin: 0, lineHeight: '1.4',
              }}>Press</h2>
            </div>
            <div style={{
              fontSize: '15px', color: '#5a5040', lineHeight: '1.9',
              letterSpacing: '0.3px', fontStyle: 'italic',
            }}>
              — Coming soon
            </div>
          </div>
        </section>

        <div style={{ margin: '0 80px', height: '0.5px', background: '#1a1610' }} />

        {/* Contact */}
        <section id="contact" style={{ padding: '80px 80px 120px', ...fadeIn(0.25) }}>
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '80px', alignItems: 'start' }}>
            <div>
              <div style={{
                fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase',
                color: '#c9a84c', fontFamily: 'sans-serif', marginBottom: '12px',
              }}>04</div>
              <h2 style={{
                fontSize: '22px', fontWeight: '400', color: '#d0c8b0',
                margin: 0, lineHeight: '1.4',
              }}>Contact</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{
                  fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase',
                  color: '#5a5040', fontFamily: 'sans-serif', marginBottom: '8px',
                }}>Phone</div>
                <a href="tel:+38971224824" style={{
                  fontSize: '22px', color: '#d0c8b0', textDecoration: 'none',
                  letterSpacing: '1px', transition: 'color 0.2s ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
                  onMouseLeave={e => e.currentTarget.style.color = '#d0c8b0'}
                >
                  +389 71 224 824
                </a>
              </div>
              <div>
                <div style={{
                  fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase',
                  color: '#5a5040', fontFamily: 'sans-serif', marginBottom: '8px',
                }}>Email</div>
                <a href="mailto:office@filipdimitrievski.com" style={{
                  fontSize: '16px', color: '#d0c8b0', textDecoration: 'none',
                  letterSpacing: '0.5px', transition: 'color 0.2s ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
                  onMouseLeave={e => e.currentTarget.style.color = '#d0c8b0'} 
                >
                  office@filipdimitrievski.com
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
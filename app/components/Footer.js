'use client';

import { useState, useEffect, useRef } from 'react';

export default function Footer() {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [visible, setVisible] = useState(false);
  const footerRef = useRef(null);

  // Trigger animation when footer enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const columns = [
    {
      title: 'Platform',
      links: ['Browse Films', 'Music Videos', 'Directors', 'Festivals'],
    },
    {
      title: 'Directors',
      links: ['Submit a Film', 'Verify Account', 'Pricing', 'Guidelines'],
    },
    {
      title: 'About Cosmic Films',
      links: ['Who We Are', 'Our Projects', 'Press', 'Contact'],
    },
    {
      title: 'Legal',
      links: ['Terms of Service', 'Privacy Policy', 'GDPR', 'Content Policy'],
    },
  ];

  return (
    <div style={{ overflow: 'hidden' }}>
    <footer
      ref={footerRef}
      style={{
        background: '#080808',
        borderTop: '0.5px solid #1a1610',
        padding: '60px 80px 0',
        marginTop: '80px',
        position: 'relative',
        zIndex: 10,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >

      {/* Top row — logo + columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
        gap: '40px',
        paddingBottom: '48px',
        borderBottom: '0.5px solid #1a1610',
      }}>

        {/* Logo + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <img
            src="/KADAR LOGO.png"
            alt="Кадар"
            style={{
              height: '64px', width: 'auto',
              objectFit: 'contain', objectPosition: 'left',
              mixBlendMode: 'screen',
            }}
          />
          <p style={{
            fontSize: '12px', color: '#8a7f6a', lineHeight: '1.7',
            letterSpacing: '0.5px', maxWidth: '180px',
          }}>
            A curated archive of short films and music videos from the Balkans.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
            {['MK', 'SRB', 'HR', 'BG', 'GR'].map((c) => (
              <span key={c} style={{
                fontSize: '9px', letterSpacing: '1px', color: '#5a5040',
                border: '0.5px solid #3a3020', padding: '2px 6px', borderRadius: '1px',
              }}>{c}</span>
            ))}
          </div>
        </div>

        {/* Link columns — each one staggers in */}
        {columns.map((col, colIndex) => (
          <div
            key={col.title}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.8s ease ${0.1 + colIndex * 0.08}s, transform 0.8s ease ${0.1 + colIndex * 0.08}s`,
            }}
          >
            <div style={{
              fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
              color: '#c9a84c', fontWeight: '600', marginBottom: '20px',
            }}>
              {col.title}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    onMouseEnter={() => setHoveredLink(link)}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{
                      fontSize: '13px',
                      color: hoveredLink === link ? '#f0e8d0' : '#8a7f6a',
                      textDecoration: 'none',
                      letterSpacing: '0.5px',
                      transition: 'color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {hoveredLink === link && (
                      <span style={{
                        display: 'inline-block', width: '12px', height: '0.5px',
                        background: '#c9a84c', flexShrink: 0,
                      }} />
                    )}
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 0',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease 0.4s',
      }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '11px', color: '#5a5040', letterSpacing: '1px' }}>
            © 2025 Кадар. All rights reserved.
          </div>
          <div style={{ fontSize: '10px', color: '#5a5040', letterSpacing: '1px' }}>
            Powered by <span style={{ color: '#dac8a7' }}>Cosmic Films</span>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: '#5a5040', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Short Film &middot; Music Video &middot; Balkan Cinema
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button style={{
            background: 'none', border: '0.5px solid #2a2418', color: '#3a3020',
            padding: '5px 10px', fontSize: '10px', letterSpacing: '2px',
            textTransform: 'uppercase', cursor: 'pointer', borderRadius: '1px',
          }}>MK</button>
          <button style={{
            background: 'none', border: '0.5px solid #2a2418', color: '#3a3020',
            padding: '5px 8px', fontSize: '12px', cursor: 'pointer', borderRadius: '1px',
          }}>☀</button>

          {/* Scroll to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              background: 'none', border: '0.5px solid #2a2418', color: '#3a3020',
              width: '28px', height: '28px', cursor: 'pointer', borderRadius: '1px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#c9a84c'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2418'; e.currentTarget.style.color = '#3a3020'; }}
            title="Back to top"
          >
            ↑
          </button>
        </div>
      </div>

    </footer>
    </div>
  );
}
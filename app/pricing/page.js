'use client';

import { useState, useEffect, useRef } from 'react';
import AuthModal from '../components/AuthModal'; // adjust path to match your project
import { supabase } from '../lib/supabase'; // adjust path if needed

const plans = [
  {
    id: 'free',
    label: 'Free',
    price: { monthly: 0 },
    description: 'Browse the archive and catch films in free rotation.',
    note: 'Card required to create account.',
    cta: 'Create Account',
    ctaHref: '/signup',
    accent: '#3a3020',
    accentText: '#8a7f6a',
    features: [
      { text: 'Browse full catalogue', included: true },
      { text: 'Watch trailers & previews', included: true },
      { text: 'Festival listings', included: true },
      { text: 'Apply for attending festivals', included: true },
      { text: 'Watch free films (weekly rotation)', included: true },
      { text: 'Watch all films on the platform', included: false },
      { text: 'Watch music videos', included: false },
    ],
  },
  {
    id: 'cinema',
    label: 'Cinema',
    price: { monthly: 4.07 },
    priceMKD: 250,
    description: 'Full access to every film and music video on the platform.',
    cta: 'Subscribe',
    ctaHref: '/signup?plan=cinema',
    accent: '#c9a84c',
    accentText: '#c9a84c',
    featured: true,
    features: [
      { text: 'Browse full catalogue', included: true },
      { text: 'Watch trailers & previews', included: true },
      { text: 'Festival listings', included: true },
      { text: 'Apply for attending festivals', included: true },
      { text: 'Watch free films (weekly rotation)', included: true },
      { text: 'Watch all films on the platform', included: true },
      { text: 'Watch music videos', included: true },
    ],
  },
];

const faqs = [
  {
    q: 'What films are on Кадар?',
    a: 'We curate short films and music videos from North Macedonia, Serbia, Croatia, Bulgaria, Greece, Bosnia, Kosovo, Montenegro, Romania, Albania, and Slovenia. New titles are added weekly.',
  },
  {
    q: 'What are the free rotation films?',
    a: 'Each week a selection of films is made available to all users at no cost. The rotation changes weekly — a great way to discover the catalogue before subscribing to Cinema.',
  },
  {
    q: 'Can I cancel my Cinema subscription at any time?',
    a: 'Absolutely. No lock-ins, no cancellation fees. Your access continues until the end of the current billing period.',
  },
  {
    q: 'Why is a card required for the free plan?',
    a: 'A payment method is required to verify your account and enable festival applications. You will not be charged anything on the free plan.',
  },
  {
    q: 'I\'m a director. What does it cost to list my film?',
    a: 'Directors pay a standard monthly listing fee of 600 MKD (~€9.75) per film or music video. The first month is discounted to 300 MKD (~€4.88). If a payment is more than 30 days overdue, the film will be removed from the platform until the outstanding balance is settled.',
  },
  {
    q: 'I\'m a director. How do I submit a film?',
    a: 'Head to the Directors section and create an account. Submission guidelines and the full distribution terms are listed there. For any questions, reach us at office@filipdimitrievski.com.',
  },
];

function CheckIcon({ color = '#c9a84c' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" stroke={color} strokeWidth="0.5" />
      <polyline points="4,7 6.2,9.2 10,5" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" stroke="#2a2418" strokeWidth="0.5" />
      <line x1="4.5" y1="4.5" x2="9.5" y2="9.5" stroke="#3a3020" strokeWidth="1" strokeLinecap="round" />
      <line x1="9.5" y1="4.5" x2="4.5" y2="9.5" stroke="#3a3020" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: '0.5px solid #1a1610',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'none', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 0', cursor: 'pointer', gap: '16px',
        }}
      >
        <span style={{ fontSize: '13px', color: '#d0c8b0', letterSpacing: '0.5px', textAlign: 'left' }}>{q}</span>
        <span style={{
          fontSize: '18px', color: open ? '#c9a84c' : '#5a5040',
          flexShrink: 0, transition: 'color 0.2s ease, transform 0.3s ease',
          display: 'inline-block', transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>+</span>
      </button>
      <div style={{
        maxHeight: open ? '320px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <p style={{
          fontSize: '13px', color: '#8a7f6a', lineHeight: '1.9',
          letterSpacing: '0.3px', paddingBottom: '22px', margin: 0,
        }}>{a}</p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [visible, setVisible] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return () => clearTimeout(t);
  }, []);

  return (
    <main style={{
      minHeight: '100vh',
      background: '#080808',
      color: '#f0e8d0',
      fontFamily: 'Georgia, "Times New Roman", serif',
    }}>

      {/* Grain overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
        backgroundSize: '200px 200px',
        opacity: 0.4,
      }} />

      {/* Subtle top vignette */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '200px', zIndex: 0,
        background: 'linear-gradient(to bottom, rgba(201,168,76,0.025), transparent)',
        pointerEvents: 'none',
      }} />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} initialMode="signup" />}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Back nav */}
        <div style={{ padding: '32px 80px 0' }}>
          <a
            href="/"
            style={{
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
        <header
          ref={heroRef}
          style={{
            padding: '80px 80px 64px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Eyebrow */}
          <div style={{
            fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase',
            color: '#c9a84c', marginBottom: '24px', fontFamily: 'sans-serif',
          }}>
            Membership Plans
          </div>

          <h1 style={{
            fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: '400',
            color: '#f0e8d0', letterSpacing: '-0.5px', lineHeight: '1.1',
            margin: '0 0 24px', maxWidth: '640px',
          }}>
            Cinema from<br />
            <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>across the Balkans</em>
          </h1>

          <p style={{
            fontSize: '15px', color: '#8a7f6a', lineHeight: '1.9',
            letterSpacing: '0.3px', maxWidth: '480px', margin: 0,
          }}>
            Short films and music videos, curated from eleven countries.
            Start free, upgrade when you're ready.
          </p>

        </header>

        {/* Plans grid */}
        <section style={{ padding: '0 80px 80px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1px',
            border: '0.5px solid #1a1610',
            borderRadius: '3px',
            overflow: 'hidden',
            background: '#1a1610',
            maxWidth: '860px',
          }}>
            {plans.map((plan, i) => (
              <div
                key={plan.id}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                style={{
                  background: plan.featured ? '#0c0b08' : '#080808',
                  padding: '48px 40px 40px',
                  display: 'flex', flexDirection: 'column',
                  position: 'relative',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.8s ease ${0.2 + i * 0.1}s, transform 0.8s ease ${0.2 + i * 0.1}s`,
                }}
              >
                {/* Featured badge */}
                {plan.featured && (
                  <div style={{
                    position: 'absolute', top: '0', left: '40px',
                    background: '#c9a84c', color: '#0a0a0a',
                    fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase',
                    padding: '4px 10px', fontWeight: '700',
                    fontFamily: 'sans-serif',
                  }}>Most Popular</div>
                )}

                {/* Top accent line */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                  background: plan.featured
                    ? '#c9a84c'
                    : (hoveredPlan === plan.id ? plan.accent : 'transparent'),
                  transition: 'background 0.3s ease',
                }} />

                {/* Plan name */}
                <div style={{
                  fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase',
                  color: plan.accentText, fontFamily: 'sans-serif', marginBottom: '16px',
                  marginTop: plan.featured ? '12px' : '0',
                }}>
                  {plan.label}
                </div>

                {/* Price */}
                <div style={{ marginBottom: '8px' }}>
                  {plan.price.monthly === 0 ? (
                    <span style={{ fontSize: '40px', fontWeight: '300', color: '#f0e8d0', letterSpacing: '-1px' }}>
                      Free
                    </span>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '40px', fontWeight: '300', color: '#f0e8d0', letterSpacing: '-1px' }}>
                          {plan.priceMKD}
                        </span>
                        <span style={{ fontSize: '13px', color: '#8a7f6a', letterSpacing: '1px' }}>MKD / mo</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#5a5040', letterSpacing: '0.5px', marginTop: '4px', fontFamily: 'sans-serif' }}>
                        ≈ €{plan.price.monthly.toFixed(2)} / mo
                      </div>
                    </div>
                  )}
                </div>

                <p style={{
                  fontSize: '12px', color: '#8a7f6a', lineHeight: '1.7',
                  letterSpacing: '0.3px', margin: '12px 0 4px',
                }}>
                  {plan.description}
                </p>

                {plan.note && (
                  <p style={{
                    fontSize: '10px', color: '#5a5040', letterSpacing: '1px',
                    fontFamily: 'sans-serif', textTransform: 'uppercase',
                    margin: '0 0 28px', display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <span style={{ color: '#c9a84c', fontSize: '12px' }}>*</span>
                    {plan.note}
                  </p>
                )}
                {!plan.note && <div style={{ marginBottom: '28px' }} />}

                {/* Features */}
                <ul style={{
                  listStyle: 'none', padding: 0, margin: '0 0 auto',
                  display: 'flex', flexDirection: 'column', gap: '14px',
                }}>
                  {plan.features.map((f) => (
                    <li key={f.text} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      fontSize: '12px',
                      color: f.included ? '#a09070' : '#3a3020',
                      letterSpacing: '0.3px',
                    }}>
                      {f.included
                        ? <CheckIcon color={plan.accentText} />
                        : <CrossIcon />
                      }
                      {f.text}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={plan.id === 'free' ? '#' : plan.ctaHref}
                  onClick={plan.id === 'free' && !user ? (e) => { e.preventDefault(); setShowAuth(true); } : (e) => e.preventDefault()}
                  style={{
                    display: 'block', marginTop: '36px',
                    background: plan.featured ? '#c9a84c' : 'none',
                    border: `0.5px solid ${plan.id === 'free' && user ? '#1a1610' : plan.featured ? '#c9a84c' : '#2a2418'}`,
                    color: plan.id === 'free' && user ? '#3a3020' : plan.featured ? '#0a0a0a' : '#8a7f6a',
                    cursor: plan.id === 'free' && user ? 'default' : 'pointer',
                    pointerEvents: plan.id === 'free' && user ? 'none' : 'auto',
                    padding: '13px 24px',
                    fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase',
                    textDecoration: 'none', textAlign: 'center',
                    borderRadius: '1px', fontWeight: plan.featured ? '700' : '400',
                    fontFamily: 'sans-serif',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    if (plan.featured) {
                      e.currentTarget.style.background = '#fff7e0';
                      e.currentTarget.style.borderColor = '#fff7e0';
                    } else {
                      e.currentTarget.style.borderColor = plan.accent;
                      e.currentTarget.style.color = '#f0e8d0';
                    }
                  }}
                  onMouseLeave={e => {
                    if (plan.featured) {
                      e.currentTarget.style.background = '#c9a84c';
                      e.currentTarget.style.borderColor = '#c9a84c';
                      e.currentTarget.style.color = '#0a0a0a';
                    } else {
                      e.currentTarget.style.borderColor = '#2a2418';
                      e.currentTarget.style.color = '#8a7f6a';
                    }
                  }}
                >
                  {plan.id === 'free' && user ? 'Watching as Free' : plan.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Divider with country tags */}
        <div style={{
          padding: '0 80px 80px',
          display: 'flex', alignItems: 'center', gap: '16px',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.5s',
        }}>
          <div style={{ height: '0.5px', background: '#1a1610', flex: 1 }} />
          {['MK', 'SRB', 'HR', 'BG', 'GR', 'BA', 'AL', 'KOS', 'MNE', 'RO', 'SI'].map(c => (
            <span key={c} style={{
              fontSize: '8px', letterSpacing: '2px', color: '#3a3020',
              border: '0.5px solid #1a1610', padding: '2px 6px', borderRadius: '1px',
            }}>{c}</span>
          ))}
          <div style={{ height: '0.5px', background: '#1a1610', flex: 1 }} />
        </div>

        {/* FAQ */}
        <section style={{
          padding: '0 80px 100px',
          display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '80px',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.6s',
        }}>
          <div>
            <div style={{
              fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase',
              color: '#c9a84c', marginBottom: '16px', fontFamily: 'sans-serif',
            }}>FAQ</div>
            <h2 style={{
              fontSize: '28px', fontWeight: '400', color: '#d0c8b0',
              margin: 0, lineHeight: '1.4', letterSpacing: '-0.3px',
            }}>
              Questions<br />& Answers
            </h2>
            <p style={{
              fontSize: '12px', color: '#5a5040', lineHeight: '1.9',
              letterSpacing: '0.3px', marginTop: '16px',
            }}>
              Can't find an answer?{' '}
              <a href="mailto:office@filipdimitrievski.com" style={{ color: '#8a7f6a', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
                onMouseLeave={e => e.currentTarget.style.color = '#8a7f6a'}
              >Contact us</a>
            </p>
          </div>
          <div style={{ borderTop: '0.5px solid #1a1610' }}>
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
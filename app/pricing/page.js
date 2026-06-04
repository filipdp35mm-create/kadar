'use client';

import { useState, useEffect, useRef } from 'react';

const plans = [
  {
    id: 'free',
    label: 'Archive',
    price: { monthly: 0, yearly: 0 },
    description: 'Explore the catalogue. No card required.',
    cta: 'Start Free',
    ctaHref: '/signup',
    accent: '#3a3020',
    accentText: '#8a7f6a',
    features: [
      { text: 'Browse full catalogue', included: true },
      { text: 'Watch trailers & previews', included: true },
      { text: 'Director profiles', included: true },
      { text: 'Festival listings', included: true },
      { text: 'Full film access', included: false },
      { text: 'Music video library', included: false },
      { text: 'Early access releases', included: false },
      { text: 'Offline downloads', included: false },
    ],
  },
  {
    id: 'standard',
    label: 'Screening',
    price: { monthly: 5.99, yearly: 4.49 },
    description: 'Full access to films and music videos.',
    cta: 'Start 30-Day Trial',
    ctaHref: '/signup?plan=screening',
    accent: '#c9a84c',
    accentText: '#c9a84c',
    featured: true,
    features: [
      { text: 'Browse full catalogue', included: true },
      { text: 'Watch trailers & previews', included: true },
      { text: 'Director profiles', included: true },
      { text: 'Festival listings', included: true },
      { text: 'Full film access', included: true },
      { text: 'Music video library', included: true },
      { text: 'Early access releases', included: false },
      { text: 'Offline downloads', included: false },
    ],
  },
  {
    id: 'pro',
    label: 'Auteur',
    price: { monthly: 11.99, yearly: 8.99 },
    description: 'Everything, plus early access and downloads.',
    cta: 'Start 30-Day Trial',
    ctaHref: '/signup?plan=auteur',
    accent: '#dac8a7',
    accentText: '#dac8a7',
    features: [
      { text: 'Browse full catalogue', included: true },
      { text: 'Watch trailers & previews', included: true },
      { text: 'Director profiles', included: true },
      { text: 'Festival listings', included: true },
      { text: 'Full film access', included: true },
      { text: 'Music video library', included: true },
      { text: 'Early access releases', included: true },
      { text: 'Offline downloads', included: true },
    ],
  },
];

const faqs = [
  {
    q: 'Is the free trial really free?',
    a: 'Yes. Your first 30 days on any paid plan are completely free. We require a card to start the trial, but you won\'t be charged until the trial ends. Cancel any time before that.',
  },
  {
    q: 'What films are on Кадар?',
    a: 'We curate short films and music videos from North Macedonia, Serbia, Croatia, Bulgaria, Greece, Bosnia, Kosovo, Montenegro, Romania, Albania, and Slovenia. New titles are added weekly.',
  },
  {
    q: 'Can I cancel at any time?',
    a: 'Absolutely. No lock-ins, no cancellation fees. Your access continues until the end of the billing period.',
  },
  {
    q: 'Do you support annual billing?',
    a: 'Yes — switch to annual billing and save around 25% compared to monthly. You can toggle between billing cycles on your account page.',
  },
  {
    q: 'I\'m a director. Can I submit films?',
    a: 'Yes. Head to the Directors section and create an account. Submission guidelines and pricing for distribution are listed there.',
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
        maxHeight: open ? '200px' : '0',
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
  const [billing, setBilling] = useState('monthly'); // 'monthly' | 'yearly'
  const [visible, setVisible] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
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
            <span style={{ fontSize: '14px' }}>←</span> Кадар
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

          {/* Billing toggle */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0',
            border: '0.5px solid #2a2418', borderRadius: '2px', marginTop: '40px',
            overflow: 'hidden',
          }}>
            {['monthly', 'yearly'].map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                style={{
                  background: billing === b ? '#1a1610' : 'none',
                  border: 'none',
                  color: billing === b ? '#f0e8d0' : '#5a5040',
                  padding: '9px 20px',
                  fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  fontFamily: 'sans-serif',
                }}
              >
                {b}
                {b === 'yearly' && (
                  <span style={{
                    marginLeft: '8px', fontSize: '8px', letterSpacing: '1.5px',
                    color: billing === 'yearly' ? '#c9a84c' : '#3a3020',
                    border: `0.5px solid ${billing === 'yearly' ? '#c9a84c' : '#3a3020'}`,
                    padding: '1px 5px', borderRadius: '1px',
                  }}>−25%</span>
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Plans grid */}
        <section style={{ padding: '0 80px 80px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            border: '0.5px solid #1a1610',
            borderRadius: '3px',
            overflow: 'hidden',
            background: '#1a1610',
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
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontSize: '13px', color: '#5a5040', alignSelf: 'flex-start', marginTop: '8px' }}>€</span>
                      <span style={{ fontSize: '40px', fontWeight: '300', color: '#f0e8d0', letterSpacing: '-1px' }}>
                        {billing === 'yearly'
                          ? plan.price.yearly.toFixed(2)
                          : plan.price.monthly.toFixed(2)}
                      </span>
                      <span style={{ fontSize: '11px', color: '#5a5040', letterSpacing: '1px' }}>/mo</span>
                    </div>
                  )}
                </div>

                {billing === 'yearly' && plan.price.monthly > 0 && (
                  <div style={{
                    fontSize: '10px', color: '#5a5040', letterSpacing: '1px',
                    marginBottom: '4px', textDecoration: 'line-through',
                    fontFamily: 'sans-serif',
                  }}>
                    €{plan.price.monthly.toFixed(2)}/mo billed monthly
                  </div>
                )}

                <p style={{
                  fontSize: '12px', color: '#8a7f6a', lineHeight: '1.7',
                  letterSpacing: '0.3px', margin: '12px 0 32px',
                }}>
                  {plan.description}
                </p>

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
                  href={plan.ctaHref}
                  style={{
                    display: 'block', marginTop: '36px',
                    background: plan.featured ? '#c9a84c' : 'none',
                    border: `0.5px solid ${plan.featured ? '#c9a84c' : '#2a2418'}`,
                    color: plan.featured ? '#0a0a0a' : '#8a7f6a',
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
                  {plan.cta}
                </a>

                {plan.price.monthly > 0 && (
                  <p style={{
                    fontSize: '10px', color: '#3a3020', textAlign: 'center',
                    marginTop: '12px', letterSpacing: '0.5px',
                    fontFamily: 'sans-serif',
                  }}>
                    No charge during trial
                  </p>
                )}
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
              <a href="/contact" style={{ color: '#8a7f6a', textDecoration: 'none' }}
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
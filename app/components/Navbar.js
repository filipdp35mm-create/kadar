'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';
import ProfileModal from './ProfileModal';
import { createPortal } from 'react-dom';

export default function Navbar({ noModals = false }) {
const [showModal, setShowModal] = useState(false);
const [modalMode, setModalMode] = useState('login');
const [user, setUser] = useState(null);
const [username, setUsername] = useState(null);
const [hoveredBtn, setHoveredBtn] = useState(null);
const [dark, setDark] = useState(true);
const [hoveredNav, setHoveredNav] = useState(null);
const [showProfile, setShowProfile] = useState(false);
const COUNTRY_MAP = {
  'North Macedonia': 'MK', 'Serbia': 'SRB', 'Bulgaria': 'BG',
  'Albania': 'AL', 'Greece': 'GR', 'Bosnia': 'BA',
  'Croatia': 'HR', 'Kosovo': 'KOS', 'Montenegro': 'MNE',
  'Romania': 'RO', 'Slovenia': 'SI',
};


async function fetchUsername(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userId)
    .single();
  if (data?.username) setUsername(data.username);
}

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
    if (session?.user) fetchUsername(session.user.id);
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
    if (session?.user) {
      fetchUsername(session.user.id);
      setShowModal(false);
    } else {
      setUsername(null);
    }
  });

  function handleOpenAuth(e) {
    setModalMode(e.detail);
    setShowModal(true);
  }

  function handleOpenProfile() {
    setShowProfile(true);
  }

  window.addEventListener('open-auth', handleOpenAuth);
  window.addEventListener('open-profile', handleOpenProfile);

  return () => {
    subscription.unsubscribe();
    window.removeEventListener('open-auth', handleOpenAuth);
    window.removeEventListener('open-profile', handleOpenProfile);
  };
}, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <>
      <nav style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '20px 32px',
        borderBottom: '0.5px solid #2a2418',
        background: '#0a0a0a',
      }}>

        {/* Logo */}
        <div
          onClick={() => window.location.href = '/'}
          style={{ cursor: 'pointer', userSelect: 'none', paddingTop: '6px', paddingLeft: '10px' }}
        >
          <img
            src="/KADAR LOGO.png"
            alt="Кадар"
            style={{ height: '36px', width: 'auto', scale: 1.6, objectFit: 'contain', mixBlendMode: 'screen' }}
          />
        </div>

<ul style={{ display: 'flex', gap: '28px', listStyle: 'none', position: 'relative' }}>
  {[
    {
      label: 'Films',
      sections: [
        { heading: 'Genre', items: ['Action', 'Comedy', 'Documentary', 'Musical', 'Sci-Fi', 'Animation', 'Crime', 'Drama', 'Thriller', 'Horror', 'Romance'] },
        { heading: 'Country', items: ['North Macedonia', 'Serbia', 'Bulgaria', 'Albania', 'Greece', 'Bosnia', 'Croatia', 'Kosovo', 'Montenegro', 'Romania', 'Slovenia'] },
        { heading: 'Year', items: ['2021 — 2026', '2011 — 2020', '2000 — 2010'] },
        { heading: 'Browse', items: ['Top 10 This Week', 'Fan Favorites', 'Coming Soon'] },
      ],
    },
    {
      label: 'Music Videos',
      sections: [
        { heading: 'Genre', items: ['Hip-Hop', 'Rock', 'Pop', 'EDM'] },
        { heading: 'Country', items: ['North Macedonia', 'Serbia', 'Bulgaria', 'Albania', 'Greece', 'Bosnia', 'Croatia', 'Kosovo', 'Montenegro', 'Romania', 'Slovenia'] },
        { heading: 'Year', items: ['2021 — 2026', '2011 — 2020', '2000 — 2010'] },
      ],
    },
    { label: 'Directors', sections: [] },
    { label: 'Festivals', sections: [] },
  ].map((nav) => (
    <li
      key={nav.label}
      style={{ position: 'relative' }}
      onMouseEnter={() => setHoveredNav(nav.label)}
      onMouseLeave={() => setHoveredNav(null)}
    >
<a href="#"
onClick={e => {
  e.preventDefault();
  const isMV = nav.label === 'Music Videos';
  const detail = isMV ? { type: 'music_video' } : {};
  if (window.location.pathname === '/') {
    window.dispatchEvent(new CustomEvent('open-browse', { detail }));
  } else {
    window.location.href = isMV ? '/?browse=true&type=music_video' : '/?browse=true';
  }
}}
  style={{
        color: hoveredNav === nav.label ? '#f0e8d0' : '#8a7f6a',
        textDecoration: 'none', fontSize: '13px',
        fontWeight: '500', letterSpacing: '2px', textTransform: 'uppercase',
        position: 'relative', paddingBottom: '4px',
        transition: 'color 0.2s ease',
        display: 'block', padding: '24px 0',
      }}>
        {nav.label}
        <span style={{
          position: 'absolute', bottom: 0, left: 0,
          width: hoveredNav === nav.label ? '100%' : '0%',
          height: '0.5px', background: '#c9a84c',
          transition: 'width 0.3s ease', display: 'block',
        }} />
      </a>

      {/* Dropdown */}
      {nav.sections.length > 0 && (
<div style={{
  position: 'absolute', top: '100%',
  left: '50%', transform: 'translateX(-50%)',
  background: '#0a0a0a',
  border: '0.5px solid #2a2418',
  borderRadius: '2px',
  padding: '24px',
  gridTemplateColumns: `repeat(${nav.sections.length}, auto)`,
  gap: '32px',
  zIndex: 200,
  minWidth: '500px',
  boxShadow: '0 16px 40px rgba(0,0,0,0.8)',
  display: 'grid',
  opacity: hoveredNav === nav.label ? 1 : 0,
  pointerEvents: hoveredNav === nav.label ? 'all' : 'none',
  transition: 'opacity 0.4s ease',
}}>
          {nav.sections.map((section) => (
            <div key={section.heading}>
              <div style={{
                fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
                color: '#c9a84c', fontWeight: '600', marginBottom: '14px',
              }}>
                {section.heading}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {section.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        setHoveredNav(null);
const isHome = window.location.pathname === '/';
const isMV = nav.label === 'Music Videos';
const baseType = isMV ? { type: 'music_video' } : {};
if (section.heading === 'Genre') {
  isHome ? window.dispatchEvent(new CustomEvent('open-browse', { detail: { ...baseType, initialCategory: item } })) : window.location.href = `/?browse=true${isMV ? '&type=music_video' : ''}&category=${encodeURIComponent(item)}`;
} else if (section.heading === 'Country') {
  isHome ? window.dispatchEvent(new CustomEvent('open-browse', { detail: { ...baseType, initialCountry: item } })) : window.location.href = `/?browse=true${isMV ? '&type=music_video' : ''}&country=${encodeURIComponent(item)}`;
} else if (section.heading === 'Year') {
  isHome ? window.dispatchEvent(new CustomEvent('open-browse', { detail: { ...baseType, initialYear: item } })) : window.location.href = `/?browse=true${isMV ? '&type=music_video' : ''}&year=${encodeURIComponent(item)}`;
}
                      }}
                      style={{ fontSize: '13px', color: '#8a7f6a', textDecoration: 'none', letterSpacing: '0.5px', transition: 'color 0.2s ease', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#f0e8d0'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#8a7f6a'; }}
                    >{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </li>
  ))}
</ul>

        {/* Right side */}
        <div style={{ display: 'flex', gap: '10px', justifySelf: 'end', alignItems: 'center' }}>

<button
  onClick={() => {
    setDark(!dark);
    document.documentElement.style.setProperty('--bg', dark ? '#ffffff' : '#0a0a0a');
    document.body.style.background = dark ? '#ffffff' : '#0a0a0a';
    document.body.style.color = dark ? '#1a1a1a' : '#f0e8d0';
  }}
  style={{
    background: 'none', border: '0.5px solid #2a2418', color: '#5a5040',
    padding: '6px 10px', fontSize: '14px', cursor: 'pointer', borderRadius: '2px',
    lineHeight: 1, transition: 'all 0.2s ease',
  }}
  onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#c9a84c'; }}
  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2418'; e.currentTarget.style.color = '#5a5040'; }}
>
  {dark ? '☀' : '☾'}
</button>

{user ? (
  // Logged in state
  <>
<span
  onClick={() => setShowProfile(true)}
  style={{
    fontSize: '12px', color: '#c9a84c', letterSpacing: '1px',
    border: '0.5px solid #2a2418', padding: '6px 12px', borderRadius: '2px',
    cursor: 'pointer', transition: 'border-color 0.2s ease',
  }}
  onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a84c'}
  onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2418'}
>
  {username || user.email.split('@')[0]}
</span>
    <button
      onClick={handleSignOut}
                style={{
                  background: 'none', border: '0.5px solid #3a3020', color: '#8a7f6a',
                  padding: '7px 18px', fontSize: '12px', letterSpacing: '2px',
                  textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#f0e8d0'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3020'; e.currentTarget.style.color = '#8a7f6a'; }}
              >
                Sign Out
              </button>
              {showProfile && <ProfileModal onClose={() => setShowProfile(false)} user={user} username={username || user.email.split('@')[0]} />}
            </>
          ) : (
            // Logged out state
            <>
<button
  onClick={() => { setModalMode('login'); setShowModal(true); }}
  onMouseEnter={() => setHoveredBtn('login')}
  onMouseLeave={() => setHoveredBtn(null)}
  style={{
    background: 'none',
    border: `0.5px solid ${hoveredBtn === 'login' ? '#c9a84c' : '#3a3020'}`,
    color: hoveredBtn === 'login' ? '#f0e8d0' : '#8a7f6a',
    padding: '7px 18px', fontSize: '12px', letterSpacing: '2px',
    textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px',
    transition: 'all 0.2s ease',
  }}
>
  Log in
</button>
<button
  onClick={() => { setModalMode('signup'); setShowModal(true); }}
  onMouseEnter={() => setHoveredBtn('join')}
  onMouseLeave={() => setHoveredBtn(null)}
  style={{
    background: hoveredBtn === 'join' ? '#fff7e0' : '#c9a84c',
    border: 'none', color: '#0a0a0a',
    padding: '7px 18px', fontSize: '12px', fontWeight: '700',
    letterSpacing: '2px', textTransform: 'uppercase',
    cursor: 'pointer', borderRadius: '2px',
    boxShadow: hoveredBtn === 'join' ? '0 0 20px rgba(201,168,76,0.5)' : 'none',
    transition: 'all 0.2s ease',
  }}
>
  Join
</button>
            </>
          )}
        </div>
      </nav>

      {!noModals && showModal && createPortal(
        <AuthModal initialMode={modalMode} onClose={() => setShowModal(false)} />,
        document.body
      )}
      {!noModals && showProfile && user && typeof document !== 'undefined' && createPortal(
        <ProfileModal onClose={() => setShowProfile(false)} user={user} username={username || user.email.split('@')[0]} />,
        document.body
      )}
    </>
  );
}
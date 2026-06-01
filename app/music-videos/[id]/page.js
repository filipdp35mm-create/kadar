'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

function WatchPopup({ type, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#0a0a0a', border: '0.5px solid #2a2418',
        borderRadius: '3px', padding: '48px 40px', width: '420px',
        textAlign: 'center', position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '20px',
          background: 'none', border: 'none', color: '#5a5040',
          fontSize: '22px', cursor: 'pointer', lineHeight: 1,
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#f0e8d0'}
          onMouseLeave={e => e.currentTarget.style.color = '#5a5040'}
        >×</button>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          border: '0.5px solid #c9a84c', margin: '0 auto 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {type === 'login' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#c9a84c" strokeWidth="1.5"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 16 16" fill="#c9a84c">
              <polygon points="4,2 14,8 4,14"/>
            </svg>
          )}
        </div>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#f0e8d0', letterSpacing: '0.5px', marginBottom: '12px' }}>
          {type === 'login' && 'Sign in to Watch'}
          {type === 'subscribe' && 'Subscribe to Watch'}
        </div>
        <p style={{ fontSize: '13px', color: '#8a7f6a', lineHeight: '1.8', letterSpacing: '0.3px', marginBottom: '28px' }}>
          {type === 'login' && 'Create a free account or sign in to access Кадар. Your first 30 days are free.'}
          {type === 'subscribe' && 'Your free trial has ended. Subscribe to continue watching.'}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {type === 'login' && (
            <>
              <button onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-auth', { detail: 'login' })); }}
                style={{ background: '#c9a84c', border: 'none', color: '#0a0a0a', padding: '11px 28px', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fff7e0'}
                onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
              >Sign In</button>
              <button onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-auth', { detail: 'signup' })); }}
                style={{ background: 'none', border: '0.5px solid #3a3020', color: '#8a7f6a', padding: '11px 28px', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#f0e8d0'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3020'; e.currentTarget.style.color = '#8a7f6a'; }}
              >Create Account</button>
            </>
          )}
          {type === 'subscribe' && (
            <button onClick={() => window.location.href = '/account/billing'}
              style={{ background: '#c9a84c', border: 'none', color: '#0a0a0a', padding: '11px 28px', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff7e0'}
              onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
            >View Plans</button>
          )}
        </div>
      </div>
    </div>
  );
}

function VideoPlayer({ src, muted, onToggleMute, videoRef }) {
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hovered, setHovered] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playing) {
          videoRef.current?.play();
          setPlaying(true);
        }
      },
      { threshold: 0.5 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [playing]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    function onTimeUpdate() { setProgress(video.currentTime); }
    function onLoadedMetadata() { setDuration(video.duration); }
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  function togglePause() {
    const video = videoRef.current;
    if (!video) return;
    if (paused) { video.play(); setPaused(false); }
    else { video.pause(); setPaused(true); }
  }

  function handleProgressClick(e) {
    const video = videoRef.current;
    if (!video || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    video.currentTime = ratio * duration;
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  return (
    <div ref={containerRef} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', cursor: 'pointer' }}
      onClick={togglePause}
    >
      <video ref={videoRef} src={src} muted={muted} loop playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)',
        opacity: hovered || paused ? 1 : 0,
        transition: 'opacity 0.3s ease',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '20px',
      }}>
        <div ref={progressRef} onClick={e => { e.stopPropagation(); handleProgressClick(e); }}
          style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', cursor: 'pointer', marginBottom: '12px', position: 'relative' }}
        >
          <div style={{ width: `${duration ? (progress / duration) * 100 : 0}%`, height: '100%', background: '#c9a84c', borderRadius: '2px', transition: 'width 0.1s linear' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} onClick={e => e.stopPropagation()}>
          <button onClick={togglePause} style={{ background: 'none', border: 'none', color: '#f0e8d0', cursor: 'pointer', padding: 0, display: 'flex' }}>
            {paused ? (
              <svg width="20" height="20" viewBox="0 0 16 16" fill="#f0e8d0"><polygon points="3,2 13,8 3,14"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 16 16" fill="#f0e8d0">
                <rect x="3" y="2" width="3" height="12" rx="1"/><rect x="10" y="2" width="3" height="12" rx="1"/>
              </svg>
            )}
          </button>
          <span style={{ fontSize: '11px', color: '#8a7f6a', letterSpacing: '1px', fontFamily: 'monospace' }}>
            {formatTime(progress)} / {formatTime(duration)}
          </span>
          <div style={{ flex: 1 }} />
          <button onClick={onToggleMute} style={{ background: 'none', border: 'none', color: '#f0e8d0', cursor: 'pointer', padding: 0, display: 'flex' }}>
            {muted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="#f0e8d0" strokeWidth="1.5"/>
                <line x1="23" y1="9" x2="17" y2="15" stroke="#f0e8d0" strokeWidth="1.5"/>
                <line x1="17" y1="9" x2="23" y2="15" stroke="#f0e8d0" strokeWidth="1.5"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="#f0e8d0" strokeWidth="1.5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="#f0e8d0" strokeWidth="1.5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#f0e8d0" strokeWidth="1.5"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      {paused && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '0.5px solid #c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="#c9a84c"><polygon points="4,2 14,8 4,14"/></svg>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayButton({ onPlay, label }) {
  return (
    <button onClick={onPlay} style={{
      marginTop: '32px',
      background: '#c9a84c', border: 'none', color: '#0a0a0a',
      padding: '14px 36px', fontSize: '13px', fontWeight: '700',
      letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer',
      borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '10px',
      transition: 'all 0.15s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = '#fff7e0'; e.currentTarget.style.boxShadow = '0 0 24px rgba(201,168,76,0.5)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#c9a84c'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><polygon points="4,2 14,8 4,14"/></svg>
      {label}
    </button>
  );
}

function DirectorSection({ directorId }) {
  const [director, setDirector] = useState(null);

  useEffect(() => {
    if (!directorId) return;
    supabase.from('directors').select('*').eq('id', directorId).single()
      .then(({ data }) => { if (data) setDirector(data); });
  }, [directorId]);

  if (!director) return null;

  return (
    <section style={{ padding: '0 80px 80px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ height: '0.5px', background: '#1a1610', marginBottom: '60px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#8a7f6a', fontWeight: '500', whiteSpace: 'nowrap' }}>Director</span>
        <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
      </div>
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#161208', border: '0.5px solid #2a2418', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {director.photo_file ? (
            <img src={`${process.env.NEXT_PUBLIC_R2_URL}/${director.photo_file}`} alt={director.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#c9a84c" strokeWidth="0.5"/>
            </svg>
          )}
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#f0e8d0', letterSpacing: '0.5px', marginBottom: '8px' }}>{director.name}</div>
          {director.bio && <p style={{ fontSize: '13px', color: '#8a7f6a', lineHeight: '1.8', maxWidth: '560px' }}>{director.bio}</p>}
        </div>
      </div>
    </section>
  );
}

export default function MusicVideoPage() {
  const params = useParams();
  const id = params?.id;
  const [mv, setMv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [popup, setPopup] = useState(null);
  const [muted, setMuted] = useState(true);
  const [isWatching, setIsWatching] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);
  const videoRef = useRef(null);
  const glowRef = useRef(null);

  const R2 = process.env.NEXT_PUBLIC_R2_URL;

  useEffect(() => {
    if (!id) return;
    async function fetchMV() {
      const { data } = await supabase
        .from('music_videos')
        .select(`*, directors (id, name, bio, photo_file), countries (code, name)`)
        .eq('id', id)
        .single();
      if (data) setMv(data);
      setLoading(false);
    }
    fetchMV();
  }, [id]);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('subscription_status, card_linked, trial_start_date, created_at')
          .eq('id', user.id)
          .single();
        setProfile(data);
        const { data: r } = await supabase
          .from('ratings')
          .select('score')
          .eq('user_id', user.id)
          .eq('film_id', id)
          .maybeSingle();
        if (r) setUserRating(r.score);
      }
    }
    loadUser();
  }, [id]);

  function isTrialActive(profile) {
    if (!profile) return false;
    const start = new Date(profile.trial_start_date || profile.created_at);
    const now = new Date();
    return (now - start) / (1000 * 60 * 60 * 24) <= 30;
  }

  function playLabel() {
    if (!user) return 'Log In to Watch';
    if (!profile?.card_linked && isTrialActive(profile)) return 'Link Card to Watch';
    if (!isTrialActive(profile) && profile?.subscription_status !== 'active') return 'Subscribe to Watch';
    return 'Watch';
  }

  function handlePlay() {
    if (!user) { setPopup('login'); return; }
    if (!profile?.card_linked && isTrialActive(profile)) { setPopup('link_card'); return; }
    if (!isTrialActive(profile) && profile?.subscription_status !== 'active') { setPopup('subscribe'); return; }
    setIsWatching(true);
    setTimeout(() => videoRef.current?.play(), 100);
  }

  async function handleRate(score) {
    if (!user) return;
    await supabase.from('ratings').upsert({ user_id: user.id, film_id: mv.id, score });
    setUserRating(score);
  }

  function toggleMute() {
    if (videoRef.current) videoRef.current.muted = !muted;
    setMuted(!muted);
  }

  if (loading) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#3a3020', textTransform: 'uppercase' }}>Loading...</div>
    </div>
  );

  if (!mv) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#3a3020', textTransform: 'uppercase' }}>Not Found</div>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#f0e8d0' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{
        display: 'grid', gridTemplateColumns: '240px 1fr',
        gap: '60px', padding: '80px 80px 60px',
        maxWidth: '1400px', margin: '0 auto',
        alignItems: 'start',
      }}>

        {/* LEFT — poster + rating */}
        <div style={{ position: 'relative' }}>
          {mv.ambient_color && (
            <div style={{
              position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%',
              background: `radial-gradient(ellipse, rgba(${mv.ambient_color},0.4) 0%, transparent 70%)`,
              filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
            }} />
          )}
          <div style={{ position: 'relative', zIndex: 1, aspectRatio: '2/3', borderRadius: '3px', overflow: 'hidden', border: '0.5px solid #2a2418', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}>
            {mv.poster_file ? (
              <img src={`${R2}/${mv.poster_file}`} alt={mv.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#0d0c08', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.1 }}>
                  <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
                  <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
                </svg>
              </div>
            )}
          </div>

          {/* Rating */}
          <div style={{ marginTop: '20px', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#5a5040', marginBottom: '10px' }}>
              {user ? 'Your Rating' : 'Sign in to rate'}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <div
                  key={star}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => user && setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  style={{
                    flex: 1, height: '4px', borderRadius: '2px',
                    background: star <= (hoverRating || userRating || 0) ? '#c9a84c' : '#1a1610',
                    cursor: user ? 'pointer' : 'default',
                    transition: 'background 0.2s ease',
                  }}
                />
              ))}
            </div>
            {mv.avg_rating && (
              <div style={{ fontSize: '11px', color: '#5a5040', letterSpacing: '2px', marginTop: '10px' }}>
                avg {mv.avg_rating} / 5
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#c9a84c', textTransform: 'uppercase', border: '0.5px solid #2a2418', padding: '4px 10px', borderRadius: '1px' }}>{mv.countries?.code}</span>
            <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#8a7f6a', textTransform: 'uppercase', border: '0.5px solid #2a2418', padding: '4px 10px', borderRadius: '1px' }}>Music Video</span>
            <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#8a7f6a', textTransform: 'uppercase', border: '0.5px solid #2a2418', padding: '4px 10px', borderRadius: '1px' }}>{mv.genre}</span>
            <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#8a7f6a', textTransform: 'uppercase', border: '0.5px solid #2a2418', padding: '4px 10px', borderRadius: '1px' }}>{mv.year}</span>
            {mv.status && (
              <span style={{
                fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '1px',
                border: `0.5px solid ${mv.status === 'released' ? '#2a4a2a' : mv.status === 'coming_soon' ? '#4a3a10' : '#2a2418'}`,
                color: mv.status === 'released' ? '#4a9a4a' : mv.status === 'coming_soon' ? '#c9a84c' : '#8a7f6a',
                background: mv.status === 'released' ? 'rgba(74,154,74,0.08)' : mv.status === 'coming_soon' ? 'rgba(201,168,76,0.08)' : 'transparent',
              }}>
                {mv.status === 'coming_soon' ? 'Coming Soon' : mv.status.replace(/-/g, ' ')}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: 'sans-serif', fontSize: '64px', fontWeight: '700', letterSpacing: '-1px', lineHeight: '1.0', color: '#f0e8d0', margin: '0 0 12px' }}>
            {mv.title}
          </h1>

          {/* Artist */}
          {mv.artist && (
            <div style={{ fontSize: '18px', color: '#c9a84c', letterSpacing: '2px', marginBottom: '24px', textTransform: 'uppercase' }}>
              {mv.artist}
            </div>
          )}

          {/* Synopsis */}
          {mv.synopsis && (
            <p style={{ fontSize: '15px', color: '#8a7f6a', lineHeight: '1.9', letterSpacing: '0.3px', marginBottom: '32px', maxWidth: '560px' }}>
              {mv.synopsis}
            </p>
          )}

          {/* Director */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#776241', marginBottom: '6px' }}>Director</div>
            <div style={{ fontSize: '14px', color: '#d0c8b0', letterSpacing: '1px' }}>{mv.directors?.name}</div>
          </div>

          {/* Cast */}
          {mv.cast_members && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#7e6743', marginBottom: '6px' }}>Cast</div>
              <div style={{ fontSize: '14px', color: '#d0c8b0', letterSpacing: '0.5px', lineHeight: '1.8' }}>
                {mv.cast_members.split(',').map((actor, i, arr) => (
                  <span key={i}>
                    {actor.trim()}{i < arr.length - 1 && <span style={{ color: '#2a2418', margin: '0 8px' }}>·</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Play button */}
          {mv.status !== 'coming_soon' && (
            <PlayButton onPlay={handlePlay} label={playLabel()} />
          )}
        </div>
      </section>

      {/* ── VIDEO SECTION ── */}
      <section style={{ padding: '80px', position: 'relative', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ height: '0.5px', background: '#1a1610', marginBottom: '60px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#8a7f6a', fontWeight: '500', whiteSpace: 'nowrap' }}>
            {isWatching ? 'Now Playing' : 'Music Video'}
          </span>
          <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
        </div>

        {mv.trailer_file ? (
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div ref={glowRef} style={{
              position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
              width: '120%', height: '140%',
              background: `radial-gradient(ellipse, rgba(${mv.ambient_color || '80,80,80'},0.5) 0%, transparent 60%)`,
              filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0,
            }} />
            <div style={{ position: 'relative', width: '75%', aspectRatio: '16/9', borderRadius: '3px', overflow: 'hidden', border: '0.5px solid #2a2418', boxShadow: '0 32px 80px rgba(0,0,0,0.8)', zIndex: 1 }}>
              <VideoPlayer src={`${R2}/${mv.trailer_file}`} muted={muted} onToggleMute={toggleMute} videoRef={videoRef} />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', border: '0.5px solid #1a1610', borderRadius: '2px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#3a3020', textTransform: 'uppercase' }}>No Video Available</div>
          </div>
        )}
      </section>

      {/* ── FESTIVALS & AWARDS ── */}
      {(mv.festivals || mv.awards) && (
        <section style={{ padding: '0 80px 80px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ height: '0.5px', background: '#1a1610', marginBottom: '60px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#8a7f6a', fontWeight: '500', whiteSpace: 'nowrap' }}>Festivals & Awards</span>
            <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
            {mv.festivals && (
              <div>
                <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#3a3020', marginBottom: '20px' }}>Festival Screenings</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {mv.festivals.split(',').map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', border: '0.5px solid #1a1610', borderRadius: '2px', background: '#0d0c08' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#c9a84c', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: '#d0c8b0', letterSpacing: '0.3px' }}>{f.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {mv.awards && (
              <div>
                <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#3a3020', marginBottom: '20px' }}>Awards</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {mv.awards.split('·').map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 18px', border: '0.5px solid #1a1610', borderRadius: '2px', background: '#0d0c08' }}>
                      <div style={{ fontSize: '14px', color: '#c9a84c', flexShrink: 0, marginTop: '1px' }}>★</div>
                      <span style={{ fontSize: '13px', color: '#d0c8b0', letterSpacing: '0.3px', lineHeight: '1.6' }}>{a.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── DIRECTOR ── */}
      <DirectorSection directorId={mv.director_id} />

      {popup && <WatchPopup type={popup} onClose={() => setPopup(null)} />}
      <Footer />
    </div>
  );
}
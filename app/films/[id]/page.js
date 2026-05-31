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
          ) : type === 'link_card' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke="#c9a84c" strokeWidth="1.5"/>
              <line x1="2" y1="10" x2="22" y2="10" stroke="#c9a84c" strokeWidth="1.5"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 16 16" fill="#c9a84c">
              <polygon points="4,2 14,8 4,14"/>
            </svg>
          )}
        </div>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#f0e8d0', letterSpacing: '0.5px', marginBottom: '12px' }}>
          {type === 'login' && 'Sign in to Watch'}
          {type === 'link_card' && 'Link a Card to Continue'}
          {type === 'subscribe' && 'Subscribe to Watch'}
        </div>
        <p style={{ fontSize: '13px', color: '#8a7f6a', lineHeight: '1.8', letterSpacing: '0.3px', marginBottom: '28px' }}>
          {type === 'login' && 'Create a free account or sign in to access Кадар. Your first 30 days are free.'}
          {type === 'link_card' && "Link a payment card to activate your free 30-day trial. You won't be charged during the trial period."}
          {type === 'subscribe' && 'Your free trial has ended. Subscribe to continue watching short films and music videos from across the Balkans.'}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {type === 'login' && (
            <>
<button onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-auth', { detail: 'login' })); }} style={{ background: '#c9a84c', border: 'none', color: '#0a0a0a', padding: '11px 28px', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}
  onMouseEnter={e => e.currentTarget.style.background = '#fff7e0'}
  onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
>Sign In</button>
<button onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('open-auth', { detail: 'signup' })); }} style={{ background: 'none', border: '0.5px solid #3a3020', color: '#8a7f6a', padding: '11px 28px', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}
  onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#f0e8d0'; }}
  onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3020'; e.currentTarget.style.color = '#8a7f6a'; }}
>Create Account</button>
            </>
          )}
          {type === 'link_card' && (
            <button onClick={() => window.location.href = '/account/billing'} style={{ background: '#c9a84c', border: 'none', color: '#0a0a0a', padding: '11px 28px', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff7e0'}
              onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
            >Link Card</button>
          )}
          {type === 'subscribe' && (
            <button onClick={() => window.location.href = '/account/billing'} style={{ background: '#c9a84c', border: 'none', color: '#0a0a0a', padding: '11px 28px', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff7e0'}
              onMouseLeave={e => e.currentTarget.style.background = '#c9a84c'}
            >View Plans</button>
          )}
        </div>
      </div>
    </div>
  );
}

function TrailerVideo({ src, muted, onToggleMute, videoRef }) {
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
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

    function onTimeUpdate() {
      setProgress(video.currentTime);
    }
    function onLoadedMetadata() {
      setDuration(video.duration);
    }

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
    if (paused) {
      video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
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
    <div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />

      {/* Controls overlay — only on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '0 20px 16px',
      }}>

        {/* Progress bar */}
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          style={{
            width: '100%', height: '2px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '1px', cursor: 'pointer',
            marginBottom: '12px', position: 'relative',
          }}
          onMouseEnter={e => e.currentTarget.style.height = '3px'}
          onMouseLeave={e => e.currentTarget.style.height = '2px'}
        >
          {/* Filled portion */}
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${duration ? (progress / duration) * 100 : 0}%`,
            background: '#c9a84c', borderRadius: '1px',
            transition: 'width 0.1s linear',
          }} />
          {/* Scrubber dot */}
          <div style={{
            position: 'absolute', top: '50%',
            left: `${duration ? (progress / duration) * 100 : 0}%`,
            transform: 'translate(-50%, -50%)',
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#c9a84c',
            boxShadow: '0 0 6px rgba(201,168,76,0.6)',
          }} />
        </div>

        {/* Bottom row — pause + time + unmute */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

          {/* Pause/Play button */}
          <button
            onClick={togglePause}
            style={{
              background: 'none', border: '0.5px solid #3a3020',
              color: '#8a7f6a', width: '32px', height: '32px',
              borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'border-color 0.2s, color 0.2s', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#c9a84c'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3020'; e.currentTarget.style.color = '#8a7f6a'; }}
          >
            {paused ? (
              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                <polygon points="4,2 14,8 4,14"/>
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                <rect x="3" y="2" width="3" height="12"/>
                <rect x="10" y="2" width="3" height="12"/>
              </svg>
            )}
          </button>

          {/* Time */}
          <div style={{ fontSize: '10px', color: '#8a7f6a', letterSpacing: '1px', fontFamily: 'sans-serif' }}>
            {formatTime(progress)} <span style={{ color: '#3a3020' }}>/ {formatTime(duration)}</span>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Mute toggle */}
          <button
            onClick={onToggleMute}
            style={{
              background: 'none', border: '0.5px solid #3a3020',
              color: '#8a7f6a', padding: '6px 12px',
              fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
              cursor: 'pointer', borderRadius: '1px',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#c9a84c'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3020'; e.currentTarget.style.color = '#8a7f6a'; }}
          >
            {muted ? '♪ Unmute' : '♪ Mute'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DirectorSection({ directorId }) {
  const [director, setDirector] = useState(null);
  const [otherFilms, setOtherFilms] = useState([]);

  useEffect(() => {
    if (!directorId) return;
    async function fetch() {
      const { data: d } = await supabase
        .from('directors')
        .select('*')
        .eq('id', directorId)
        .single();
      if (d) setDirector(d);

      const { data: films } = await supabase
        .from('films')
        .select('id, title, year, genre, poster_file, countries(code)')
        .eq('director_id', directorId)
        .eq('status', 'released');
      if (films) setOtherFilms(films);
    }
    fetch();
  }, [directorId]);

  if (!director) return null;

  return (
    <section style={{ padding: '0 80px 80px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ height: '0.5px', background: '#1a1610', marginBottom: '60px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
        <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#8a7f6a', fontWeight: '500', whiteSpace: 'nowrap', fontFamily: 'sans-serif' }}>Director</span>
        <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
      </div>

      {/* Director info */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '40px', marginBottom: '48px' }}>
        {/* Photo */}
        <div style={{
          width: '200px', height: '300px', borderRadius: '2px',
          background: '#0d0c08', border: '0.5px solid #2a2418',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {director.photo_file ? (
            <img
              src={`${process.env.NEXT_PUBLIC_R2_URL}/${director.photo_file}`}
              alt={director.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.08 }}>
                <circle cx="12" cy="8" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#c9a84c" strokeWidth="0.5"/>
              </svg>
            </div>
          )}
        </div>

        {/* Bio */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#f0e8d0', letterSpacing: '0.5px', marginBottom: '16px' }}>
            {director.name}
          </div>
          {director.bio && (
            <p style={{ fontSize: '14px', color: '#8a7f6a', lineHeight: '1.9', letterSpacing: '0.3px', margin: 0, maxWidth: '600px' }}>
              {director.bio}
            </p>
          )}
        </div>
      </div>

      {/* Other films */}
      {otherFilms.length > 0 && (
        <div>
          <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#3a3020', marginBottom: '20px' }}>
            More by {director.name}
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {otherFilms.map(film => (
              <div
                key={film.id}
                onClick={() => window.location.href = `/films/${film.id}`}
                style={{ cursor: 'pointer', width: '140px', flexShrink: 0 }}
              >
                <div style={{
                  width: '140px', height: '210px',
                  background: '#0d0c08', border: '0.5px solid #2a2418',
                  borderRadius: '2px', overflow: 'hidden',
                  position: 'relative', marginBottom: '10px',
                  transition: 'border-color 0.2s ease',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a84c'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2418'}
                >
                  {film.poster_file ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_R2_URL}/${film.poster_file}`}
                      alt={film.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.08 }}>
                        <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
                        <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
                      </svg>
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '9px', letterSpacing: '2px', color: '#c9a84c', fontWeight: '600', textTransform: 'uppercase' }}>
                    {film.countries?.code}
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#d0c8b0', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{film.title}</div>
                <div style={{ fontSize: '10px', color: '#8a7f6a', letterSpacing: '1px', textTransform: 'uppercase' }}>{film.year} · {film.genre}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function PlayButton({ onPlay, label }) {
  const [fillProgress, setFillProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const intervalRef = useRef(null);

  function startFill() {
    if (ready) return;
    intervalRef.current = setInterval(() => {
      setFillProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          setReady(true);
          return 100;
        }
        return prev + 2;
      });
    }, 20);
  }

  function stopFill() {
    if (ready) return;
    clearInterval(intervalRef.current);
    setFillProgress(0);
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <button
        onMouseEnter={startFill}
        onMouseLeave={stopFill}
        onClick={() => ready && onPlay()}
        style={{
          position: 'relative',
          width: '200px', height: '52px',
          background: 'none',
          border: `0.5px solid ${ready ? '#c9a84c' : '#3a3020'}`,
          borderRadius: '1px',
          cursor: ready ? 'pointer' : 'default',
          overflow: 'hidden',
          transition: 'border-color 0.3s ease',
        }}
      >
        <div style={{
          position: 'absolute', left: 0, top: 0,
          height: '100%', width: `${fillProgress}%`,
          background: '#c9a84c',
          transition: 'width 0.02s linear',
        }} />
        <span style={{
          position: 'relative', zIndex: 1,
          fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase',
          color: fillProgress > 50 ? '#0a0a0a' : '#8a7f6a',
          fontWeight: '600', pointerEvents: 'none',
          transition: 'color 0.1s ease',
        }}>
          {label}
        </span>
      </button>
      {!ready && (
        <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#3a3020', textTransform: 'uppercase', marginTop: '8px' }}>
          Hover to unlock
        </div>
      )}
    </div>
  );
}

export default function FilmPage() {
  const params = useParams();
  const id = params?.id;
  const [film, setFilm] = useState(null);
  const [user, setUser] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);
const [muted, setMuted] = useState(true);
const [popup, setPopup] = useState(null);
const [profile, setProfile] = useState(null);
const videoRef = useRef(null);
const glowRef = useRef(null);
  

  useEffect(() => {
    if (!id) return;
    async function fetchFilm() {
      const { data } = await supabase
        .from('films')
        .select(`*, directors (name), countries (code, name)`)
        .eq('id', id)
        .single();
      if (data) setFilm(data);
    }
    fetchFilm();
  }, [id]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
if (session?.user) {
  supabase.from('profiles')
          .select('subscription_status, card_linked, trial_start_date, created_at')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setProfile(data));
      }
    });  
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from('profiles')
          .select('subscription_status, card_linked, trial_start_date, created_at')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !film) return;
    async function fetchUserData() {
const { data: wl } = await supabase
  .from('watchlist').select('id')
  .eq('user_id', user.id).eq('film_id', film.id).maybeSingle();
setInWatchlist(!!wl);

const { data: r } = await supabase
  .from('ratings').select('score')
  .eq('user_id', user.id).eq('film_id', film.id).maybeSingle();
if (r) setUserRating(r.score);
    }
    fetchUserData();
  }, [user, film]);

function isTrialActive(profile) {
  if (!profile) return false;
  const start = new Date(profile.trial_start_date || profile.created_at);
  const now = new Date();
  const diffDays = (now - start) / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
}

function handlePlay() {
  if (!user) { setPopup('login'); return; }
  if (!profile?.card_linked && isTrialActive(profile)) { setPopup('link_card'); return; }
  if (!isTrialActive(profile) && profile?.subscription_status !== 'active') { setPopup('subscribe'); return; }
  // Authorized — play the film
  alert('Playing film...');
}

function playLabel() {
  if (!user) return 'Log In to Watch';
  if (!profile?.card_linked && isTrialActive(profile)) return 'Link Card to Watch';
  if (!isTrialActive(profile) && profile?.subscription_status !== 'active') return 'Subscribe to Watch';
  return 'Watch Now';
}

  async function toggleWatchlist() {
    if (!user) return;
    if (inWatchlist) {
      await supabase.from('watchlist').delete().eq('user_id', user.id).eq('film_id', film.id);
      setInWatchlist(false);
    } else {
      await supabase.from('watchlist').insert({ user_id: user.id, film_id: film.id });
      setInWatchlist(true);
    }
  }

  async function handleRate(score) {
    if (!user) return;
    await supabase.from('ratings').upsert({ user_id: user.id, film_id: film.id, score });
    setUserRating(score);
  }

  function toggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(!muted);
    }
  }

  if (!film) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#3a3020', textTransform: 'uppercase' }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#f0e8d0' }}>
      <Navbar />

      {/* ── FIRST SECTION ── */}
      <section style={{ padding: '60px 80px', display: 'grid', gridTemplateColumns: '340px 1fr', gap: '60px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* LEFT — poster + watchlist + rating */}
        <div>
          <div
            onClick={toggleWatchlist}
            style={{
              width: '100%', aspectRatio: '2/3',
              background: '#0d0c08',
              border: `0.5px solid ${inWatchlist ? '#c9a84c' : '#2a2418'}`,
              borderRadius: '3px', overflow: 'hidden', position: 'relative',
              cursor: user ? 'pointer' : 'default',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              boxShadow: inWatchlist ? '0 0 24px rgba(201,168,76,0.2)' : '0 8px 32px rgba(0,0,0,0.6)',
            }}
          >
            {film.poster_file ? (
              <img src={`${process.env.NEXT_PUBLIC_R2_URL}/${film.poster_file}`} alt={film.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.08 }}>
                  <rect x="2" y="2" width="20" height="20" rx="1" stroke="#c9a84c" strokeWidth="0.5"/>
                  <circle cx="12" cy="12" r="4" stroke="#c9a84c" strokeWidth="0.5"/>
                </svg>
              </div>
            )}
            {user && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.3s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                <div style={{
                  fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
                  color: inWatchlist ? '#0a0a0a' : '#c9a84c',
                  background: inWatchlist ? '#c9a84c' : 'transparent',
                  border: '0.5px solid #c9a84c', padding: '8px 16px', borderRadius: '1px',
                }}>
                  {inWatchlist ? 'Remove from Picks' : '+ Add to Picks'}
                </div>
              </div>
            )}
          </div>

          {/* Rating */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#5a5040', marginBottom: '12px' }}>
              {user ? 'Your Rating' : 'Sign in to rate'}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <div key={star} onClick={() => handleRate(star)}
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
            {film.avg_rating && (
              <div style={{ fontSize: '11px', color: '#5a5040', letterSpacing: '2px', marginTop: '10px' }}>
                avg {film.avg_rating} / 5
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#c9a84c', textTransform: 'uppercase', border: '0.5px solid #2a2418', padding: '4px 10px', borderRadius: '1px' }}>{film.countries?.code}</span>
            <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#8a7f6a', textTransform: 'uppercase', border: '0.5px solid #2a2418', padding: '4px 10px', borderRadius: '1px' }}>{film.type}</span>
            <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#8a7f6a', textTransform: 'uppercase', border: '0.5px solid #2a2418', padding: '4px 10px', borderRadius: '1px' }}>{film.genre}</span>
            <span style={{ fontSize: '10px', letterSpacing: '3px', color: '#8a7f6a', textTransform: 'uppercase', border: '0.5px solid #2a2418', padding: '4px 10px', borderRadius: '1px' }}>{film.year}</span>
            {film.status && (
              <span style={{
                fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
                padding: '4px 10px', borderRadius: '1px',
                border: `0.5px solid ${film.status === 'released' ? '#2a4a2a' : film.status === 'coming_soon' ? '#4a3a10' : '#2a2418'}`,
                color: film.status === 'released' ? '#4a9a4a' : film.status === 'coming_soon' ? '#c9a84c' : '#8a7f6a',
                background: film.status === 'released' ? 'rgba(74,154,74,0.08)' : film.status === 'coming_soon' ? 'rgba(201,168,76,0.08)' : 'transparent',
              }}>
                {film.status === 'coming_soon' ? 'Coming Soon' : film.status.replace(/-/g, ' ')}
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: 'sans-serif', fontSize: '72px', fontWeight: '700', letterSpacing: '-1px', lineHeight: '1.0', color: '#f0e8d0', margin: '0 0 32px' }}>
            {film.title}
          </h1>

          <p style={{ fontSize: '15px', color: '#8a7f6a', lineHeight: '1.9', letterSpacing: '0.3px', marginBottom: '32px', maxWidth: '560px' }}>
            {film.synopsis}
          </p>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#776241', marginBottom: '6px' }}>Director</div>
            <div style={{ fontSize: '14px', color: '#d0c8b0', letterSpacing: '1px' }}>{film.directors?.name}</div>
          </div>

          {film.cast_members && (
            <div>
              <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#7e6743', marginBottom: '6px' }}>Cast</div>
              <div style={{ fontSize: '14px', color: '#d0c8b0', letterSpacing: '0.5px', lineHeight: '1.8' }}>
                {film.cast_members.split(',').map((actor, i) => (
                  <span key={i}>
                    {actor.trim()}{i < film.cast_members.split(',').length - 1 && <span style={{ color: '#2a2418', margin: '0 8px' }}>·</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Play button — hidden for coming soon films */}
          {film.status !== 'coming_soon' && (
            <PlayButton onPlay={handlePlay} label={playLabel()} />
          )}
          
        </div>
      </section>

      {/* ── TRAILER SECTION ── */}
      <section style={{ padding: '80px', position: 'relative', maxWidth: '1400px', margin: '0 auto', overflow: 'visible' }}>
        <div style={{ height: '0.5px', background: '#1a1610', marginBottom: '60px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#8a7f6a', fontWeight: '500', whiteSpace: 'nowrap', fontFamily: 'sans-serif' }}>Trailer</span>
          <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
        </div>

        {film.trailer_file ? (
<div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>

  {/* Glow sits outside, not clipped */}
<div
  ref={glowRef}
  style={{
    position: 'absolute',
    top: '-20%', left: '50%',
    transform: 'translateX(-50%)',
    width: '120%', height: '140%',
    background: `radial-gradient(ellipse, rgba(${film.ambient_color || '80,80,80'},0.5) 0%, transparent 60%)`,
    filter: 'blur(90px)',
    pointerEvents: 'none',
    zIndex: 0,
    transition: 'background 1s ease',
  }}
/>

  {/* Video */}
  <div style={{
    position: 'relative', width: '75%', aspectRatio: '16/9',
    borderRadius: '3px', overflow: 'hidden',
    border: '0.5px solid #2a2418',
    boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
    zIndex: 1,
  }}>
<TrailerVideo
  src={`${process.env.NEXT_PUBLIC_R2_URL}/${film.trailer_file}`}
  muted={muted}
  onToggleMute={toggleMute}
  videoRef={videoRef}
  glowRef={glowRef}
/>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', border: '0.5px solid #1a1610', borderRadius: '2px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#3a3020', textTransform: 'uppercase' }}>No Trailer Available</div>
          </div>
        )}
      </section>

{/* ── FESTIVALS & AWARDS ── */}
<section style={{ padding: '0 80px 80px', maxWidth: '1400px', margin: '0 auto' }}>
  <div style={{ height: '0.5px', background: '#1a1610', marginBottom: '60px' }} />
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
    <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: '#8a7f6a', fontWeight: '500', whiteSpace: 'nowrap', fontFamily: 'sans-serif' }}>Festivals & Awards</span>
    <div style={{ flex: 1, height: '0.5px', background: '#1a1610' }} />
  </div>

  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
    {/* Festivals */}
    {film.festivals && (
      <div>
        <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#3a3020', marginBottom: '20px' }}>Festival Screenings</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {film.festivals.split(',').map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '14px 18px',
              border: '0.5px solid #1a1610', borderRadius: '2px',
              background: '#0d0c08',
            }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#c9a84c', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: '#d0c8b0', letterSpacing: '0.3px' }}>{f.trim()}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Awards */}
    {film.awards && (
      <div>
        <div style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#3a3020', marginBottom: '20px' }}>Awards</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {film.awards.split('·').map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '14px',
              padding: '14px 18px',
              border: '0.5px solid #1a1610', borderRadius: '2px',
              background: '#0d0c08',
            }}>
              <div style={{ fontSize: '14px', color: '#c9a84c', flexShrink: 0, marginTop: '1px' }}>★</div>
              <span style={{ fontSize: '13px', color: '#d0c8b0', letterSpacing: '0.3px', lineHeight: '1.6' }}>{a.trim()}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</section>

{/* ── DIRECTOR ── */}
<DirectorSection directorId={film.director_id} />
{popup && <WatchPopup type={popup} onClose={() => setPopup(null)} />}
      <Footer />
    </div>
  );
}
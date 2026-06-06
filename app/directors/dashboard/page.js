'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

// ── Helpers ────────────────────────────────────────────────────────────
function paymentStatusColor(status) {
  if (status === 'paid') return '#6ab87a';
  if (status === 'pending') return '#c9a84c';
  if (status === 'late') return '#e05a3a';
  return '#5a5040';
}

function daysSince(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Small UI pieces ────────────────────────────────────────────────────
function Badge({ status }) {
  const color = paymentStatusColor(status);
  return (
    <span style={{
      fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase',
      color, border: `0.5px solid ${color}`, padding: '2px 7px',
      borderRadius: '1px', fontFamily: 'sans-serif', opacity: 0.9,
    }}>{status}</span>
  );
}

function SectionHeader({ label, action, onAction }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      paddingBottom: '16px', borderBottom: '0.5px solid #1a1610', marginBottom: '24px',
    }}>
      <div style={{ fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: '#c9a84c', fontFamily: 'sans-serif' }}>{label}</div>
      {action && (
        <button onClick={onAction} style={{
          background: 'none', border: '0.5px solid #2a2418', color: '#8a7f6a',
          fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase',
          padding: '5px 12px', cursor: 'pointer', borderRadius: '1px',
          fontFamily: 'sans-serif', transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#c9a84c'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2418'; e.currentTarget.style.color = '#8a7f6a'; }}
        >{action}</button>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder, textarea, required }) {
  const [focused, setFocused] = useState(false);
  const base = {
    background: '#0a0905',
    border: `0.5px solid ${focused ? '#c9a84c' : '#2a2418'}`,
    borderRadius: '1px', color: '#f0e8d0',
    padding: '10px 13px', fontSize: '13px', letterSpacing: '0.3px',
    outline: 'none', width: '100%', boxSizing: 'border-box',
    transition: 'border-color 0.2s ease', fontFamily: 'Georgia, serif',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase',
        color: focused ? '#c9a84c' : '#5a5040', fontFamily: 'sans-serif',
        transition: 'color 0.2s ease',
      }}>{label}{required && <span style={{ color: '#c9a84c', marginLeft: '3px' }}>*</span>}</label>
      {textarea
        ? <textarea value={value} onChange={onChange} placeholder={placeholder}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            rows={4} style={{ ...base, resize: 'vertical', lineHeight: '1.7' }} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={base} />
      }
    </div>
  );
}

function SelectField({ label, value, onChange, options, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase',
        color: focused ? '#c9a84c' : '#5a5040', fontFamily: 'sans-serif',
        transition: 'color 0.2s ease',
      }}>{label}{required && <span style={{ color: '#c9a84c', marginLeft: '3px' }}>*</span>}</label>
      <select value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          background: '#0a0905', border: `0.5px solid ${focused ? '#c9a84c' : '#2a2418'}`,
          borderRadius: '1px', color: value ? '#f0e8d0' : '#5a5040',
          padding: '10px 13px', fontSize: '13px', outline: 'none',
          width: '100%', cursor: 'pointer', fontFamily: 'Georgia, serif',
          transition: 'border-color 0.2s ease',
        }}>
        {options.map(o => <option key={o.value} value={o.value} style={{ background: '#0a0905' }}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ── Nav tabs ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'films', label: 'My Films' },
  { id: 'submit', label: 'Submit Film' },
  { id: 'verification', label: 'Verification' },
  { id: 'profile', label: 'Profile' },
];

// ── MAIN DASHBOARD ─────────────────────────────────────────────────────
export default function DirectorsDashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [films, setFilms] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  // Profile edit state
  const [editName, setEditName] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Submit form state
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('short_film');
  const [formYear, setFormYear] = useState('');
  const [formCountry, setFormCountry] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formPoster, setFormPoster] = useState('');
  const [formImdb, setFormImdb] = useState('');
  const [formFestivals, setFormFestivals] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Verification form state
  const [verifFullName, setVerifFullName] = useState('');
  const [verifCompany, setVerifCompany] = useState('');
  const [verifCountry, setVerifCountry] = useState('');
  const [verifPhone, setVerifPhone] = useState('');
  const [verifImdb, setVerifImdb] = useState('');
  const [verifWork, setVerifWork] = useState('');
  const [verifNote, setVerifNote] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifMsg, setVerifMsg] = useState(null);
  const [verifError, setVerifError] = useState(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = '/directors'; return; }
      setUser(session.user);

      const { data: prof } = await supabase
        .from('director_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      // Auto-create profile row if missing (Google OAuth directors)
      if (!prof) {
        const meta = session.user.user_metadata || {};
        await supabase.from('director_profiles').insert({
          id: session.user.id,
          name: meta.name || meta.full_name || '',
          company: meta.company || '',
        });
        const { data: newProf } = await supabase.from('director_profiles').select('*').eq('id', session.user.id).single();
        setProfile(newProf);
        populateEdit(newProf);
      } else {
        setProfile(prof);
        populateEdit(prof);
      }

      const { data: dirFilms } = await supabase
        .from('director_films')
        .select('*, films(title, type, year)')
        .eq('director_id', session.user.id)
        .order('listed_at', { ascending: false });
      setFilms(dirFilms || []);

      const { data: subs } = await supabase
        .from('film_submissions')
        .select('*')
        .eq('director_id', session.user.id)
        .order('submitted_at', { ascending: false });
      setSubmissions(subs || []);

      setLoading(false);
      setTimeout(() => setVisible(true), 60);
    }
    init();
  }, []);

  function populateEdit(prof) {
    if (!prof) return;
    setEditName(prof.name || '');
    setEditCompany(prof.company || '');
    setEditBio(prof.bio || '');
    setEditWebsite(prof.website || '');
    setEditCountry(prof.country || '');
  }

  async function saveProfile() {
    setProfileSaving(true);
    setProfileMsg(null);
    const { error } = await supabase.from('director_profiles').update({
      name: editName, company: editCompany,
      bio: editBio, website: editWebsite, country: editCountry,
    }).eq('id', user.id);
    if (error) setProfileMsg({ type: 'error', text: error.message });
    else { setProfileMsg({ type: 'ok', text: 'Profile saved.' }); setProfile(p => ({ ...p, name: editName, company: editCompany, bio: editBio, website: editWebsite, country: editCountry })); }
    setProfileSaving(false);
  }

  async function submitFilm() {
    if (!formTitle || !formLink) { setSubmitError('Title and transfer link are required.'); return; }
    setSubmitting(true); setSubmitError(null); setSubmitMsg(null);

    const payload = {
      director_id: user.id,
      title: formTitle, type: formType,
      year: formYear ? parseInt(formYear) : null,
      country: formCountry, duration_minutes: formDuration ? parseInt(formDuration) : null,
      description: formDescription, transfer_link: formLink,
      poster_link: formPoster, imdb_link: formImdb,
      festival_history: formFestivals,
    };

    const { error } = await supabase.from('film_submissions').insert(payload);
    if (error) { setSubmitError(error.message); setSubmitting(false); return; }

    // Email notification via Supabase edge function (or direct fetch)
    try {
      await fetch('/api/notify-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directorName: profile?.name || user.email,
          directorEmail: user.email,
          filmTitle: formTitle,
          filmType: formType,
          transferLink: formLink,
        }),
      });
    } catch (_) { /* notification failure is non-blocking */ }

    // Reset form
    setFormTitle(''); setFormType('short_film'); setFormYear('');
    setFormCountry(''); setFormDuration(''); setFormDescription('');
    setFormLink(''); setFormPoster(''); setFormImdb(''); setFormFestivals('');

    // Refresh submissions
    const { data: subs } = await supabase.from('film_submissions').select('*').eq('director_id', user.id).order('submitted_at', { ascending: false });
    setSubmissions(subs || []);

    setSubmitMsg('Submission received. You will hear back within 5 business days.');
    setSubmitting(false);
    setTab('films');
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/directors';
  }

    async function submitVerification() {
    if (!verifFullName || !verifCountry) { setVerifError('Full name and country are required.'); return; }
    setVerifying(true); setVerifError(null); setVerifMsg(null);

    const { error } = await supabase.from('director_profiles')
      .update({ verification_status: 'pending' })
      .eq('id', user.id);

    if (error) { setVerifError(error.message); setVerifying(false); return; }

    try {
      await fetch('/api/notify-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: verifFullName, company: verifCompany,
          country: verifCountry, phone: verifPhone,
          imdb: verifImdb, previousWork: verifWork,
          note: verifNote, email: user.email,
        }),
      });
    } catch (_) {}

    setProfile(p => ({ ...p, verification_status: 'pending' }));
    setVerifMsg('Your verification request has been submitted. We will review it and get back to you.');
    setVerifying(false);
  }

  const fadeUp = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#060605',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ fontSize: '10px', letterSpacing: '5px', color: '#3a3020', fontFamily: 'sans-serif', textTransform: 'uppercase' }}>
        Loading
      </div>
    </div>
  );

  const activeFilms = films.filter(f => !f.removed_at);
  const lateFilms = activeFilms.filter(f => f.payment_status === 'late');
  const pendingSubs = submissions.filter(s => s.status === 'pending');

  return (
    <main style={{
      minHeight: '100vh', background: '#060605',
      color: '#f0e8d0', fontFamily: 'Georgia, "Times New Roman", serif',
    }}>

      {/* Grain */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
        backgroundSize: '180px 180px', opacity: 0.4,
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          borderRight: '0.5px solid #1a1610',
          padding: '40px 28px',
          display: 'flex', flexDirection: 'column', gap: '0',
          position: 'sticky', top: 0, height: '100vh',
          background: '#060605',
        }}>
          {/* Logo */}
          <div style={{ marginBottom: '40px' }}>
            <img src="/KADAR LOGO.png" alt="Кадар" style={{ height: '28px', mixBlendMode: 'screen', opacity: 0.8 }} />
            <div style={{ fontSize: '8px', letterSpacing: '3px', color: '#3a3020', textTransform: 'uppercase', fontFamily: 'sans-serif', marginTop: '6px' }}>Director Portal</div>
          </div>

          {/* Director name */}
          <div style={{
            padding: '16px 0', marginBottom: '24px',
            borderTop: '0.5px solid #1a1610', borderBottom: '0.5px solid #1a1610',
          }}>
            <div style={{ fontSize: '12px', color: '#d0c8b0', letterSpacing: '0.5px', marginBottom: '3px' }}>
              {profile?.name || 'Director'}
            </div>
            <div style={{ fontSize: '10px', color: '#3a3020', letterSpacing: '0.5px', fontFamily: 'sans-serif' }}>
              {profile?.verified ? '✓ Verified' : 'Unverified'}
            </div>
          </div>

          {/* Tabs */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: tab === t.id ? '#121009' : 'none',
                border: 'none',
                borderLeft: `1.5px solid ${tab === t.id ? '#c9a84c' : 'transparent'}`,
                color: tab === t.id ? '#c9a84c' : '#5a5040',
                padding: '10px 14px',
                fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
                cursor: 'pointer', textAlign: 'left',
                fontFamily: 'sans-serif',
                transition: 'all 0.2s ease',
                borderRadius: '0 1px 1px 0',
              }}
                onMouseEnter={e => { if (tab !== t.id) { e.currentTarget.style.color = '#a09070'; e.currentTarget.style.borderLeftColor = '#2a2418'; } }}
                onMouseLeave={e => { if (tab !== t.id) { e.currentTarget.style.color = '#5a5040'; e.currentTarget.style.borderLeftColor = 'transparent'; } }}
              >{t.label}</button>
            ))}
          </nav>

          {/* Sign out */}
          <button onClick={signOut} style={{
            background: 'none', border: '0.5px solid #1a1610',
            color: '#3a3020', padding: '9px', fontSize: '9px',
            letterSpacing: '3px', textTransform: 'uppercase',
            cursor: 'pointer', borderRadius: '1px', fontFamily: 'sans-serif',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e05a3a'; e.currentTarget.style.color = '#e05a3a'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1610'; e.currentTarget.style.color = '#3a3020'; }}
          >Sign Out</button>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ padding: '48px 56px', overflowY: 'auto' }}>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div style={fadeUp(0)}>
              <div style={{ marginBottom: '40px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: '#c9a84c', fontFamily: 'sans-serif', marginBottom: '10px' }}>Dashboard</div>
                <h1 style={{ fontSize: '28px', fontWeight: '400', color: '#f0e8d0', margin: 0 }}>
                  Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}.
                </h1>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#1a1610', border: '0.5px solid #1a1610', borderRadius: '2px', marginBottom: '40px', overflow: 'hidden' }}>
                {[
                  { label: 'Active Films', value: activeFilms.length },
                  { label: 'Pending Review', value: pendingSubs.length },
                  { label: 'Late Payments', value: lateFilms.length, warn: lateFilms.length > 0 },
                  { label: 'Total Submitted', value: submissions.length },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#080806', padding: '24px 20px' }}>
                    <div style={{ fontSize: '28px', fontWeight: '300', color: s.warn ? '#e05a3a' : '#c9a84c', letterSpacing: '-0.5px', marginBottom: '6px' }}>{s.value}</div>
                    <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: '#3a3020', fontFamily: 'sans-serif' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Late payment warning */}
              {lateFilms.length > 0 && (
                <div style={{
                  border: '0.5px solid #4a1a0a', background: '#0d0603',
                  padding: '16px 20px', borderRadius: '1px', marginBottom: '32px',
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                }}>
                  <span style={{ color: '#e05a3a', fontSize: '16px' }}>⚠</span>
                  <div>
                    <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#e05a3a', fontFamily: 'sans-serif', marginBottom: '4px' }}>Payment Overdue</div>
                    <div style={{ fontSize: '12px', color: '#8a5040', lineHeight: '1.7' }}>
                      {lateFilms.length} film{lateFilms.length > 1 ? 's are' : ' is'} more than 30 days overdue.
                      Films will be removed from the platform until payment is settled.
                      Contact <a href="mailto:office@filipdimitrievski.com" style={{ color: '#c9a84c', textDecoration: 'none' }}>office@filipdimitrievski.com</a>.
                    </div>
                  </div>
                </div>
              )}

              {/* Recent submissions */}
              {submissions.length > 0 && (
                <div>
                  <SectionHeader label="Recent Submissions" action="View All" onAction={() => setTab('films')} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1a1610', border: '0.5px solid #1a1610', borderRadius: '1px', overflow: 'hidden' }}>
                    {submissions.slice(0, 4).map(s => (
                      <div key={s.id} style={{
                        background: '#080806', padding: '14px 18px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
                      }}>
                        <div>
                          <div style={{ fontSize: '13px', color: '#d0c8b0', marginBottom: '3px' }}>{s.title}</div>
                          <div style={{ fontSize: '10px', color: '#3a3020', fontFamily: 'sans-serif', letterSpacing: '1px' }}>{formatDate(s.submitted_at)}</div>
                        </div>
                        <Badge status={s.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {submissions.length === 0 && (
                <div style={{
                  border: '0.5px solid #1a1610', borderRadius: '1px',
                  padding: '48px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '13px', color: '#3a3020', marginBottom: '16px', letterSpacing: '0.5px' }}>No films submitted yet.</div>
                  <button onClick={() => setTab('submit')} style={{
                    background: '#c9a84c', border: 'none', color: '#060605',
                    padding: '10px 24px', fontSize: '10px', letterSpacing: '4px',
                    textTransform: 'uppercase', cursor: 'pointer', borderRadius: '1px',
                    fontFamily: 'sans-serif',
                  }}>Submit Your First Film</button>
                </div>
              )}
            </div>
          )}

          {/* ── MY FILMS ── */}
          {tab === 'films' && (
            <div style={fadeUp(0)}>
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: '#c9a84c', fontFamily: 'sans-serif', marginBottom: '10px' }}>My Films</div>
                <h1 style={{ fontSize: '24px', fontWeight: '400', color: '#f0e8d0', margin: 0 }}>Submissions & Active Listings</h1>
              </div>

              {submissions.length === 0 ? (
                <div style={{ border: '0.5px solid #1a1610', borderRadius: '1px', padding: '48px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#3a3020', marginBottom: '16px' }}>No submissions yet.</div>
                  <button onClick={() => setTab('submit')} style={{
                    background: 'none', border: '0.5px solid #2a2418', color: '#8a7f6a',
                    padding: '10px 24px', fontSize: '10px', letterSpacing: '3px',
                    textTransform: 'uppercase', cursor: 'pointer', borderRadius: '1px', fontFamily: 'sans-serif',
                  }}>Submit a Film</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1a1610', border: '0.5px solid #1a1610', borderRadius: '1px', overflow: 'hidden' }}>
                  {/* Header row */}
                  <div style={{
                    background: '#0a0905', padding: '10px 18px',
                    display: 'grid', gridTemplateColumns: '1fr 100px 120px 100px 120px',
                    gap: '16px',
                  }}>
                    {['Title', 'Type', 'Submitted', 'Status', 'Payment'].map(h => (
                      <div key={h} style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: '#3a3020', fontFamily: 'sans-serif' }}>{h}</div>
                    ))}
                  </div>

                  {submissions.map(s => {
                    const matched = films.find(f => f.film_id && s.id);
                    return (
                      <div key={s.id} style={{
                        background: '#080806', padding: '14px 18px',
                        display: 'grid', gridTemplateColumns: '1fr 100px 120px 100px 120px',
                        gap: '16px', alignItems: 'center',
                      }}>
                        <div>
                          <div style={{ fontSize: '13px', color: '#d0c8b0', marginBottom: '2px' }}>{s.title}</div>
                          {s.year && <div style={{ fontSize: '10px', color: '#3a3020', fontFamily: 'sans-serif' }}>{s.year}</div>}
                        </div>
                        <div style={{ fontSize: '10px', color: '#5a5040', fontFamily: 'sans-serif', letterSpacing: '1px' }}>{s.type === 'short_film' ? 'Short Film' : 'Music Video'}</div>
                        <div style={{ fontSize: '10px', color: '#3a3020', fontFamily: 'sans-serif' }}>{formatDate(s.submitted_at)}</div>
                        <Badge status={s.status} />
                        <div style={{ fontSize: '10px', color: '#3a3020', fontFamily: 'sans-serif' }}>
                          {s.status === 'approved' ? <Badge status={matched?.payment_status || 'pending'} /> : '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── SUBMIT FILM ── */}
          {tab === 'submit' && (
            <div style={fadeUp(0)}>
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: '#c9a84c', fontFamily: 'sans-serif', marginBottom: '10px' }}>Submit</div>
                <h1 style={{ fontSize: '24px', fontWeight: '400', color: '#f0e8d0', margin: '0 0 8px' }}>Submit a Film</h1>
                <p style={{ fontSize: '13px', color: '#5a5040', lineHeight: '1.8', margin: 0, maxWidth: '520px' }}>
                  Upload your film to SwissTransfer or WeTransfer, paste the link below, and fill in the details.
                  We'll review and get back to you within 5 business days.
                </p>
              </div>

              {profile?.verification_status !== 'verified' && (
                <div style={{
                  border: '0.5px solid #2a2418', borderRadius: '1px',
                  padding: '48px', textAlign: 'center',
                  opacity: 0.6,
                }}>
                  <div style={{ fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: '#5a5040', fontFamily: 'sans-serif', marginBottom: '12px' }}>
                    {profile?.verification_status === 'pending' ? 'Verification Pending' : 'Verification Required'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#3a3020', lineHeight: '1.8', marginBottom: '20px' }}>
                    {profile?.verification_status === 'pending'
                      ? 'Your verification request is under review. You will be notified once approved.'
                      : 'You must be a verified director before submitting films.'}
                  </div>
                  {profile?.verification_status !== 'pending' && (
                    <button onClick={() => setTab('verification')} style={{
                      background: 'none', border: '0.5px solid #2a2418', color: '#8a7f6a',
                      padding: '10px 24px', fontSize: '10px', letterSpacing: '3px',
                      textTransform: 'uppercase', cursor: 'pointer', borderRadius: '1px', fontFamily: 'sans-serif',
                    }}>Request Verification →</button>
                  )}
                </div>
              )}

              {profile?.verification_status === 'verified' && (
                <div style={{
                  border: '0.5px solid #1a1610', borderRadius: '1px',
                  padding: '36px', background: '#080806',
                  maxWidth: '680px',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <Field label="Film Title" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Title of your film" required />
                    <SelectField label="Type" value={formType} onChange={e => setFormType(e.target.value)} required options={[
                      { value: 'short_film', label: 'Short Film' },
                      { value: 'music_video', label: 'Music Video' },
                    ]} />
                    <Field label="Year" type="number" value={formYear} onChange={e => setFormYear(e.target.value)} placeholder="2024" />
                    <Field label="Country" value={formCountry} onChange={e => setFormCountry(e.target.value)} placeholder="e.g. North Macedonia" />
                    <Field label="Duration (minutes)" type="number" value={formDuration} onChange={e => setFormDuration(e.target.value)} placeholder="e.g. 15" />
                    <Field label="IMDb Link" value={formImdb} onChange={e => setFormImdb(e.target.value)} placeholder="https://imdb.com/title/..." />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
                    <Field label="Transfer Link" value={formLink} onChange={e => setFormLink(e.target.value)} placeholder="SwissTransfer or WeTransfer link" required />
                    <Field label="Poster / Still Link" value={formPoster} onChange={e => setFormPoster(e.target.value)} placeholder="Link to poster image (optional)" />
                    <Field label="Description / Synopsis" value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Brief description of your film..." textarea />
                    <Field label="Festival History" value={formFestivals} onChange={e => setFormFestivals(e.target.value)} placeholder="List any festivals where this film was screened..." textarea />
                  </div>

                  {submitError && (
                    <div style={{ fontSize: '12px', color: '#e05a3a', marginBottom: '16px', padding: '10px 14px', border: '0.5px solid #3a1a10', background: '#0d0603', borderRadius: '1px' }}>{submitError}</div>
                  )}
                  {submitMsg && (
                    <div style={{ fontSize: '12px', color: '#c9a84c', marginBottom: '16px', padding: '10px 14px', border: '0.5px solid #3a2a10', background: '#0d0b06', borderRadius: '1px' }}>{submitMsg}</div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={submitFilm} disabled={submitting} style={{
                      background: '#c9a84c', border: 'none', color: '#060605',
                      padding: '12px 32px', fontSize: '10px', fontWeight: '700',
                      letterSpacing: '4px', textTransform: 'uppercase',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      borderRadius: '1px', opacity: submitting ? 0.6 : 1,
                      fontFamily: 'sans-serif', transition: 'opacity 0.2s ease, background 0.2s ease',
                    }}
                      onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#fff0c0'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#c9a84c'; }}
                    >{submitting ? 'Submitting...' : 'Submit Film'}</button>
                    <p style={{ fontSize: '10px', color: '#3a3020', fontFamily: 'sans-serif', letterSpacing: '0.5px', margin: 0 }}>
                      600 MKD / month after approval · 300 MKD first month
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── VERIFICATION ── */}
          {tab === 'verification' && (
            <div style={fadeUp(0)}>
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: '#c9a84c', fontFamily: 'sans-serif', marginBottom: '10px' }}>Verification</div>
                <h1 style={{ fontSize: '24px', fontWeight: '400', color: '#f0e8d0', margin: '0 0 8px' }}>Director Verification</h1>
                <p style={{ fontSize: '13px', color: '#5a5040', lineHeight: '1.8', margin: 0, maxWidth: '520px' }}>
                  Fill in the form below so we can verify your identity as a director.
                  Once approved you'll be able to submit films to the platform.
                </p>
              </div>

              {profile?.verification_status === 'verified' && (
                <div style={{ border: '0.5px solid #2a3a20', background: '#080d06', borderRadius: '1px', padding: '20px 24px' }}>
                  <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#6ab87a', fontFamily: 'sans-serif' }}>✓ Verified Director</div>
                </div>
              )}

              {profile?.verification_status === 'pending' && (
                <div style={{ border: '0.5px solid #3a2a10', background: '#0d0b06', borderRadius: '1px', padding: '20px 24px' }}>
                  <div style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#c9a84c', fontFamily: 'sans-serif', marginBottom: '6px' }}>Request Under Review</div>
                  <div style={{ fontSize: '12px', color: '#8a7f6a' }}>We'll get back to you at {user?.email}.</div>
                </div>
              )}

              {(profile?.verification_status === 'unverified' || profile?.verification_status === 'rejected' || !profile?.verification_status) && (
                <div style={{ border: '0.5px solid #1a1610', borderRadius: '1px', padding: '36px', background: '#080806', maxWidth: '580px' }}>
                  {profile?.verification_status === 'rejected' && (
                    <div style={{ border: '0.5px solid #3a1a10', background: '#0d0603', borderRadius: '1px', padding: '14px 18px', marginBottom: '24px', fontSize: '12px', color: '#e05a3a' }}>
                      Your previous request was not approved. You may reapply below.
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <Field label="Full Name" value={verifFullName} onChange={e => setVerifFullName(e.target.value)} placeholder="Your full name" required />
                      <Field label="Country" value={verifCountry} onChange={e => setVerifCountry(e.target.value)} placeholder="e.g. North Macedonia" required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <Field label="Production Company" value={verifCompany} onChange={e => setVerifCompany(e.target.value)} placeholder="e.g. Filmmakers Inc." />
                      <Field label="Phone Number" value={verifPhone} onChange={e => setVerifPhone(e.target.value)} placeholder="+389 ..." />
                    </div>
                    <Field label="IMDb Profile Link" value={verifImdb} onChange={e => setVerifImdb(e.target.value)} placeholder="https://imdb.com/name/..." />
                    <Field label="Previous Work / Portfolio" value={verifWork} onChange={e => setVerifWork(e.target.value)} placeholder="Links to previous films, Vimeo, YouTube..." textarea />
                    <Field label="Anything else you'd like us to know" value={verifNote} onChange={e => setVerifNote(e.target.value)} placeholder="Optional note..." textarea />
                  </div>
                  {verifError && (
                    <div style={{ fontSize: '12px', color: '#e05a3a', marginBottom: '16px', padding: '10px 14px', border: '0.5px solid #3a1a10', background: '#0d0603', borderRadius: '1px' }}>{verifError}</div>
                  )}
                  {verifMsg && (
                    <div style={{ fontSize: '12px', color: '#c9a84c', marginBottom: '16px', padding: '10px 14px', border: '0.5px solid #3a2a10', background: '#0d0b06', borderRadius: '1px' }}>{verifMsg}</div>
                  )}
                  <button onClick={submitVerification} disabled={verifying} style={{
                    background: '#c9a84c', border: 'none', color: '#060605',
                    padding: '12px 32px', fontSize: '10px', fontWeight: '700',
                    letterSpacing: '4px', textTransform: 'uppercase',
                    cursor: verifying ? 'not-allowed' : 'pointer',
                    borderRadius: '1px', opacity: verifying ? 0.6 : 1, fontFamily: 'sans-serif',
                  }}
                    onMouseEnter={e => { if (!verifying) e.currentTarget.style.background = '#fff0c0'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#c9a84c'; }}
                  >{verifying ? 'Submitting...' : 'Request Verification'}</button>
                </div>
              )}
            </div>
          )}

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <div style={fadeUp(0)}>
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: '#c9a84c', fontFamily: 'sans-serif', marginBottom: '10px' }}>Account</div>
                <h1 style={{ fontSize: '24px', fontWeight: '400', color: '#f0e8d0', margin: 0 }}>Director Profile</h1>
              </div>

              <div style={{ border: '0.5px solid #1a1610', borderRadius: '1px', padding: '36px', background: '#080806', maxWidth: '580px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <Field label="Full Name" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Your name" />
                    <Field label="Production Company" value={editCompany} onChange={e => setEditCompany(e.target.value)} placeholder="Optional" />
                  </div>
                  <Field label="Bio" value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Short bio about you and your work..." textarea />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <Field label="Website" value={editWebsite} onChange={e => setEditWebsite(e.target.value)} placeholder="https://yoursite.com" />
                    <Field label="Country" value={editCountry} onChange={e => setEditCountry(e.target.value)} placeholder="e.g. North Macedonia" />
                  </div>
                </div>

                <div style={{ paddingTop: '20px', borderTop: '0.5px solid #1a1610', marginBottom: '20px' }}>
                  <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#3a3020', fontFamily: 'sans-serif', marginBottom: '8px' }}>Account Email</div>
                  <div style={{ fontSize: '13px', color: '#5a5040' }}>{user?.email}</div>
                </div>

                {profileMsg && (
                  <div style={{
                    fontSize: '12px', marginBottom: '16px', padding: '10px 14px', borderRadius: '1px',
                    color: profileMsg.type === 'ok' ? '#c9a84c' : '#e05a3a',
                    border: `0.5px solid ${profileMsg.type === 'ok' ? '#3a2a10' : '#3a1a10'}`,
                    background: profileMsg.type === 'ok' ? '#0d0b06' : '#0d0603',
                  }}>{profileMsg.text}</div>
                )}

                <button onClick={saveProfile} disabled={profileSaving} style={{
                  background: '#c9a84c', border: 'none', color: '#060605',
                  padding: '11px 28px', fontSize: '10px', fontWeight: '700',
                  letterSpacing: '4px', textTransform: 'uppercase',
                  cursor: profileSaving ? 'not-allowed' : 'pointer',
                  borderRadius: '1px', opacity: profileSaving ? 0.6 : 1,
                  fontFamily: 'sans-serif', transition: 'opacity 0.2s, background 0.2s',
                }}
                  onMouseEnter={e => { if (!profileSaving) e.currentTarget.style.background = '#fff0c0'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#c9a84c'; }}
                >{profileSaving ? 'Saving...' : 'Save Profile'}</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
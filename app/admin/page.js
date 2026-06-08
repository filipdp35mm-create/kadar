'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const ADMIN_PASSWORD = 'kadar2026';

// ─── tiny shared style tokens ────────────────────────────────────────────────
const gold   = '#c9a84c';
const bg     = '#060605';
const card   = '#080806';
const border = '#1a1610';
const dim    = '#3a3020';
const text   = '#f0e8d0';
const muted  = '#5a5040';
const red    = '#e05a3a';

const btn = (variant = 'gold') => ({
  border: 'none',
  padding: '8px 20px',
  fontSize: '9px',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  cursor: 'pointer',
  fontFamily: 'sans-serif',
  fontWeight: '700',
  ...(variant === 'gold'  && { background: gold, color: bg }),
  ...(variant === 'ghost' && { background: 'none', border: `0.5px solid #3a1a10`, color: red }),
  ...(variant === 'dim'   && { background: 'none', border: `0.5px solid ${dim}`,  color: muted }),
});

// ─────────────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [auth,    setAuth]    = useState(false);
  const [password,setPassword]= useState('');
  const [tab,     setTab]     = useState('directors'); // 'directors' | 'films'

  if (!auth) return <LoginScreen password={password} setPassword={setPassword} onAuth={() => setAuth(true)} />;

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: 'Georgia, serif' }}>
      {/* ── top bar ── */}
      <div style={{ padding: '32px 56px 0', borderBottom: `0.5px solid ${border}` }}>
        <div style={{ fontSize: '9px', letterSpacing: '5px', color: gold, fontFamily: 'sans-serif', marginBottom: '16px' }}>
          КАДАР · ADMIN
        </div>
        <div style={{ display: 'flex', gap: '0' }}>
          {[['directors','Director Verifications'],['films','Film Submissions'],['newsletter','Newsletter']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'sans-serif', fontSize: '9px', letterSpacing: '4px',
              textTransform: 'uppercase', padding: '10px 24px 12px',
              color: tab === key ? gold : muted,
              borderBottom: tab === key ? `1px solid ${gold}` : '1px solid transparent',
              transition: 'color 0.15s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── panels ── */}
      <div style={{ padding: '40px 56px' }}>
        {tab === 'directors' && <DirectorsTab supabaseAdmin={supabaseAdmin} />}
{tab === 'films' && <FilmsTab supabaseAdmin={supabaseAdmin} />}
{tab === 'newsletter' && <NewsletterTab supabaseAdmin={supabaseAdmin} />}
      </div>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginScreen({ password, setPassword, onAuth }) {
  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ border: `0.5px solid ${border}`, padding: '40px', background: card, minWidth: '300px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '4px', color: gold, fontFamily: 'sans-serif', marginBottom: '24px' }}>
          КАДАР · ADMIN
        </div>
        <input
          type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && password === ADMIN_PASSWORD && onAuth()}
          placeholder="Password"
          style={{
            width: '100%', background: '#0a0905', border: `0.5px solid #2a2418`,
            color: text, padding: '10px 13px', fontSize: '13px', outline: 'none',
            boxSizing: 'border-box', fontFamily: 'Georgia, serif', marginBottom: '12px',
          }}
        />
        <button onClick={() => password === ADMIN_PASSWORD && onAuth()} style={{
          ...btn('gold'), width: '100%', padding: '11px', fontSize: '10px',
        }}>Enter</button>
      </div>
    </div>
  );
}

// ─── Directors Tab (existing logic, now also creates public directors entry) ──

function DirectorsTab({ supabaseAdmin }) {
  const [directors, setDirectors] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [msg,       setMsg]       = useState(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('director_profiles')
      .select('*')
      .eq('verification_status', 'pending');
    setDirectors(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function approve(d) {
    // 1. Mark profile verified
    await supabaseAdmin.from('director_profiles')
      .update({ verification_status: 'verified', verified: true })
      .eq('id', d.id);

    // 2. Create public directors entry if not already there
    const { data: existing } = await supabaseAdmin
      .from('directors')
      .select('id')
      .eq('id', d.id)
      .maybeSingle();

    if (!existing) {
      await supabaseAdmin.from('directors').insert({
        id:   d.id,
        name: d.name,
        bio:  d.bio  || null,
      });
    }

    // 3. Notify
    await fetch('/api/notify-approved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: d.name, email: d.email }),
    });

    setMsg({ type: 'ok', text: `✓ ${d.name} verified — public profile created` });
    load();
  }

  async function reject(d) {
    await supabase.from('director_profiles')
      .update({ verification_status: 'rejected' })
      .eq('id', d.id);
    setMsg({ type: 'err', text: `✗ ${d.name} rejected` });
    load();
  }

  return (
    <section>
      <h1 style={{ fontSize: '22px', fontWeight: '400', margin: '0 0 6px' }}>Pending Verifications</h1>
      <p style={{ fontSize: '11px', color: muted, fontFamily: 'sans-serif', margin: '0 0 24px', letterSpacing: '1px' }}>
        Approving a director creates their public profile on the platform.
      </p>
      <Toast msg={msg} onClose={() => setMsg(null)} />
      {loading && <Loader />}
      {!loading && directors.length === 0 && <Empty text="No pending director requests." />}
      <Table>
        {directors.map(d => (
          <Row key={d.id}>
            <div>
              <div style={{ fontSize: '14px', color: '#d0c8b0', marginBottom: '4px' }}>{d.name}</div>
              <div style={{ fontSize: '11px', color: muted, fontFamily: 'sans-serif' }}>
                {d.country}{d.company ? ` · ${d.company}` : ''} · {d.email}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => approve(d)} style={btn('gold')}>Approve</button>
              <button onClick={() => reject(d)}  style={btn('ghost')}>Reject</button>
            </div>
          </Row>
        ))}
      </Table>
    </section>
  );
}

// ─── Films Tab ────────────────────────────────────────────────────────────────
// ─── Films Tab ────────────────────────────────────────────────────────────────

function FilmsTab({ supabaseAdmin }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [msg,         setMsg]         = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectNote,  setRejectNote]  = useState('');

  async function load() {
    setLoading(true);
    const { data } = await supabaseAdmin
      .from('film_submissions')
      .select('*, director_profiles(name, email)')
      .in('status', ['pending', 'approved'])
      .order('submitted_at', { ascending: true });
    setSubmissions(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function approve(sub) {
    const res = await fetch('/api/admin-approve-film', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sub }),
    });
    const result = await res.json();

    if (!result.ok) {
      setMsg({ type: 'err', text: `✗ Error: ${result.error}` });
      return;
    }

    const directorEmail = sub.director_profiles?.email;
    const directorName  = sub.director_profiles?.name;
    if (directorEmail) {
      await fetch('/api/notify-film-approved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: directorName, email: directorEmail, title: sub.title }),
      });
    }

    setMsg({ type: 'ok', text: `✓ "${sub.title}" approved — visible on director dashboard, live after payment` });
    load();
  }

  async function reject(sub) {
    const now = new Date().toISOString();
    await supabaseAdmin.from('film_submissions')
      .update({ status: 'rejected', reviewed_at: now, notes: rejectNote || null })
      .eq('id', sub.id);

    const directorEmail = sub.director_profiles?.email;
    const directorName  = sub.director_profiles?.name;
    if (directorEmail) {
      await fetch('/api/notify-film-rejected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: directorName, email: directorEmail, title: sub.title, note: rejectNote || null }),
      });
    }

    setMsg({ type: 'err', text: `✗ "${sub.title}" rejected` });
    setRejectModal(null);
    setRejectNote('');
    load();
  }

  async function goLive(sub) {
    const now = new Date().toISOString();

    await supabaseAdmin
      .from('films')
      .update({ status: 'released' })
      .eq('director_id', sub.director_id)
      .eq('title', sub.title);

    await supabaseAdmin
      .from('director_films')
      .update({
        payment_status: 'paid',
        last_payment_date: now,
        next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        months_active: 1,
      })
      .eq('director_id', sub.director_id);

    const { error: subErr } = await supabaseAdmin
      .from('film_submissions')
      .update({ status: 'live' })
      .eq('id', sub.id);

    if (subErr) {
      setMsg({ type: 'err', text: `✗ Submission update failed: ${subErr.message}` });
      return;
    }

    setMsg({ type: 'ok', text: `✓ "${sub.title}" is now live on the platform.` });
    load();
  }

  return (
    <section>
      <h1 style={{ fontSize: '22px', fontWeight: '400', margin: '0 0 6px' }}>Film Submissions</h1>
      <p style={{ fontSize: '11px', color: muted, fontFamily: 'sans-serif', margin: '0 0 24px', letterSpacing: '1px' }}>
        Approving adds the film to the director's dashboard as <span style={{ color: gold }}>unreleased</span>. It goes live once their payment is complete.
      </p>
      <Toast msg={msg} onClose={() => setMsg(null)} />
      {loading && <Loader />}
      {!loading && submissions.length === 0 && <Empty text="No pending film submissions." />}
      <Table>
        {submissions.map(sub => {
          const dir = sub.director_profiles;
          return (
            <Row key={sub.id}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '15px', color: '#d0c8b0' }}>{sub.title}</span>
                  <span style={{ fontSize: '9px', color: muted, fontFamily: 'sans-serif', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    {sub.type}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: muted, fontFamily: 'sans-serif', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  {dir && <span>{dir.name}</span>}
                  {sub.year && <span>{sub.year}</span>}
                  {sub.country && <span>{sub.country}</span>}
                  {sub.duration_minutes && <span>{sub.duration_minutes} min</span>}
                </div>
                <div style={{ marginTop: '8px', display: 'flex', gap: '14px' }}>
                  {sub.transfer_link && (
                    <a href={sub.transfer_link} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: gold, fontFamily: 'sans-serif', letterSpacing: '1px' }}>↗ Film file</a>
                  )}
                  {sub.poster_link && (
                    <a href={sub.poster_link} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: gold, fontFamily: 'sans-serif', letterSpacing: '1px' }}>↗ Poster</a>
                  )}
                  {sub.imdb_link && (
                    <a href={sub.imdb_link} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color: gold, fontFamily: 'sans-serif', letterSpacing: '1px' }}>↗ IMDb</a>
                  )}
                </div>
                {sub.festival_history && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: '#4a4030', fontStyle: 'italic' }}>{sub.festival_history}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'flex-start' }}>
                {sub.status === 'pending' && <button onClick={() => approve(sub)} style={btn('gold')}>Approve</button>}
                {sub.status === 'approved' && <button onClick={() => goLive(sub)} style={{ ...btn('gold'), background: '#6ab87a' }}>Go Live</button>}
                {sub.status === 'pending' && <button onClick={() => { setRejectModal(sub); setRejectNote(''); }} style={btn('ghost')}>Reject</button>}
              </div>
            </Row>
          );
        })}
      </Table>

      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: card, border: `0.5px solid ${border}`, padding: '36px', width: '420px', maxWidth: '90vw' }}>
            <div style={{ fontSize: '9px', letterSpacing: '4px', color: red, fontFamily: 'sans-serif', marginBottom: '16px' }}>REJECT SUBMISSION</div>
            <div style={{ fontSize: '15px', marginBottom: '4px' }}>{rejectModal.title}</div>
            <div style={{ fontSize: '11px', color: muted, fontFamily: 'sans-serif', marginBottom: '20px' }}>{rejectModal.director_profiles?.name}</div>
            <div style={{ fontSize: '10px', color: muted, fontFamily: 'sans-serif', letterSpacing: '2px', marginBottom: '6px' }}>NOTE TO DIRECTOR (OPTIONAL)</div>
            <textarea
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              placeholder="Reason for rejection, feedback…"
              rows={4}
              style={{ width: '100%', background: '#0a0905', border: `0.5px solid #2a2418`, color: text, padding: '10px 13px', fontSize: '12px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Georgia, serif', resize: 'vertical', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setRejectModal(null)} style={btn('dim')}>Cancel</button>
              <button onClick={() => reject(rejectModal)} style={btn('ghost')}>Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function NewsletterTab({ supabaseAdmin }) {
  const [count, setCount] = useState(null);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    supabaseAdmin.from('waitlist').select('id', { count: 'exact', head: true })
      .then(({ count }) => setCount(count));
  }, []);

  async function sendLaunch() {
    setSending(true);
    setMsg(null);
    const { data } = await supabaseAdmin.from('waitlist').select('email');
    const emails = (data || []).map(r => r.email);
    const res = await fetch('/api/notify-launch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails }),
    });
    const json = await res.json();
    if (json.ok) setMsg({ type: 'ok', text: `✓ Launch email sent to ${emails.length} people.` });
    else setMsg({ type: 'err', text: `✗ Something went wrong.` });
    setSending(false);
  }

  return (
    <section>
      <h1 style={{ fontSize: '22px', fontWeight: '400', margin: '0 0 6px' }}>Launch Newsletter</h1>
      <p style={{ fontSize: '11px', color: muted, fontFamily: 'sans-serif', margin: '0 0 32px', letterSpacing: '1px' }}>
        Sends the "we're live" email to everyone on the waitlist. One time, one button.
      </p>
      <Toast msg={msg} onClose={() => setMsg(null)} />
      <div style={{ background: card, border: `0.5px solid ${border}`, padding: '32px', maxWidth: '400px' }}>
        <div style={{ fontSize: '36px', color: gold, fontWeight: '300', marginBottom: '4px' }}>{count ?? '—'}</div>
        <div style={{ fontSize: '9px', letterSpacing: '3px', color: muted, fontFamily: 'sans-serif', textTransform: 'uppercase', marginBottom: '32px' }}>People on the waitlist</div>
        <button onClick={sendLaunch} disabled={sending} style={{ ...btn('gold'), opacity: sending ? 0.6 : 1, cursor: sending ? 'not-allowed' : 'pointer' }}>
          {sending ? 'Sending...' : 'Send Launch Email'}
        </button>
      </div>
    </section>
  );
}

// ─── Shared small components ──────────────────────────────────────────────────

function Toast({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div style={{
      fontSize: '12px',
      color: msg.type === 'ok' ? gold : red,
      margin: '0 0 20px',
      padding: '10px 14px',
      border: `0.5px solid ${msg.type === 'ok' ? '#3a2a10' : '#3a1a10'}`,
      background: '#0d0b06',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      {msg.text}
      <span onClick={onClose} style={{ cursor: 'pointer', color: muted, fontSize: '14px', lineHeight: 1 }}>×</span>
    </div>
  );
}

function Loader() {
  return <div style={{ color: dim, fontSize: '12px', marginTop: '32px' }}>Loading…</div>;
}

function Empty({ text }) {
  return <div style={{ color: dim, fontSize: '13px', marginTop: '32px' }}>{text}</div>;
}

function Table({ children }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '1px',
      background: border, border: `0.5px solid ${border}`, marginTop: '16px',
    }}>
      {children}
    </div>
  );
}

function Row({ children }) {
  return (
    <div style={{
      background: card, padding: '20px 24px',
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', gap: '24px',
    }}>
      {children}
    </div>
  );
}


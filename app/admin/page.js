'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ADMIN_PASSWORD = 'kadar2026';

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from('director_profiles')
      .select('*')
      .eq('verification_status', 'pending');
    console.log('data:', data, 'error:', error);
    setDirectors(data || []);
    setLoading(false);
  }

  useEffect(() => { if (auth) load(); }, [auth]);

async function approve(director) {
    await supabase.from('director_profiles')
      .update({ verification_status: 'verified' })
      .eq('id', director.id);

    await fetch('/api/notify-approved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: director.name, email: director.email }),
    });

    setMsg(`✓ ${director.name} approved`);
    load();
  }

  async function reject(director) {
    await supabase.from('director_profiles')
      .update({ verification_status: 'rejected' })
      .eq('id', director.id);
    setMsg(`✗ ${director.name} rejected`);
    load();
  }

  if (!auth) return (
    <div style={{ minHeight: '100vh', background: '#060605', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ border: '0.5px solid #1a1610', padding: '40px', background: '#080806', minWidth: '300px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '4px', color: '#c9a84c', fontFamily: 'sans-serif', marginBottom: '24px' }}>КАДАР · ADMIN</div>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && password === ADMIN_PASSWORD && setAuth(true)}
          placeholder="Password" style={{
            width: '100%', background: '#0a0905', border: '0.5px solid #2a2418',
            color: '#f0e8d0', padding: '10px 13px', fontSize: '13px', outline: 'none',
            boxSizing: 'border-box', fontFamily: 'Georgia, serif', marginBottom: '12px',
          }} />
        <button onClick={() => password === ADMIN_PASSWORD && setAuth(true)} style={{
          width: '100%', background: '#c9a84c', border: 'none', color: '#060605',
          padding: '11px', fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase',
          cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: '700',
        }}>Enter</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#060605', color: '#f0e8d0', padding: '48px 56px', fontFamily: 'Georgia, serif' }}>
      <div style={{ fontSize: '9px', letterSpacing: '5px', color: '#c9a84c', fontFamily: 'sans-serif', marginBottom: '8px' }}>ADMIN</div>
      <h1 style={{ fontSize: '24px', fontWeight: '400', margin: '0 0 8px' }}>Pending Verifications</h1>
      {msg && <div style={{ fontSize: '12px', color: '#c9a84c', margin: '16px 0', padding: '10px 14px', border: '0.5px solid #3a2a10', background: '#0d0b06' }}>{msg}</div>}
      {loading && <div style={{ color: '#3a3020', fontSize: '12px', marginTop: '32px' }}>Loading...</div>}
      {!loading && directors.length === 0 && <div style={{ color: '#3a3020', fontSize: '13px', marginTop: '32px' }}>No pending requests.</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1a1610', border: '0.5px solid #1a1610', marginTop: '32px' }}>
        {directors.map(d => (
          <div key={d.id} style={{ background: '#080806', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#d0c8b0', marginBottom: '4px' }}>{d.name}</div>
              <div style={{ fontSize: '11px', color: '#5a5040', fontFamily: 'sans-serif' }}>{d.country} {d.company ? `· ${d.company}` : ''}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => approve(d)} style={{
                background: '#c9a84c', border: 'none', color: '#060605',
                padding: '8px 20px', fontSize: '9px', letterSpacing: '3px',
                textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: '700',
              }}>Approve</button>
              <button onClick={() => reject(d)} style={{
                background: 'none', border: '0.5px solid #3a1a10', color: '#e05a3a',
                padding: '8px 20px', fontSize: '9px', letterSpacing: '3px',
                textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'sans-serif',
              }}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
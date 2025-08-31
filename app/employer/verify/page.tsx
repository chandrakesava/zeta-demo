'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EmployerVerify() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [userId, setUserId] = useState<string|null>(null);
  const [msg, setMsg] = useState('');

  async function createEmployer() {
    setMsg('Creating employer...');
    const { data: user, error } = await supabase.from('users').insert({ email, role: 'employer' }).select().single();
    if (error || !user) { setMsg('Error: '+(error?.message||'')); return; }
    setUserId(user.id);
    const { error: e2 } = await supabase.from('employers').insert({ user_id: user.id, company_name: company, website });
    if (e2) { setMsg('Error profile: '+e2.message); return; }
    setMsg('Employer created. Now verify.');
  }

  async function verifySim() {
    if (!userId) { setMsg('Create employer first'); return; }
    const { error } = await supabase.from('employers').update({ verified: true }).eq('user_id', userId);
    if (error) { setMsg('Verify error: '+error.message); return; }
    setMsg('Verified ✅');
  }

  return (
    <main>
      <h3>Employer: Verify</h3>
      <p style={{color:'green'}}>{msg}</p>
      <div style={{display:'grid', gap:8, maxWidth:420}}>
        <input placeholder="Work email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Company name" value={company} onChange={e=>setCompany(e.target.value)} />
        <input placeholder="Website" value={website} onChange={e=>setWebsite(e.target.value)} />
        <button onClick={createEmployer}>Create employer</button>
        <button onClick={verifySim}>Verify (simulate)</button>
      </div>
    </main>
  );
}

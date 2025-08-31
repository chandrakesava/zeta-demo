'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminApprovals() {
  const [cands, setCands] = useState<any[]>([]);
  const [emps, setEmps] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  async function load() {
    const { data: c } = await supabase.from('candidates').select('*, user_id');
    const { data: e } = await supabase.from('employers').select('*, user_id');
    setCands(c||[]); setEmps(e||[]);
  }

  async function toggleCandidate(u: string, val:boolean) {
    await supabase.from('candidates').update({ verified: val }).eq('user_id', u);
    setMsg('Candidate updated'); load();
  }
  async function toggleEmployer(u: string, val:boolean) {
    await supabase.from('employers').update({ verified: val }).eq('user_id', u);
    setMsg('Employer updated'); load();
  }

  useEffect(()=>{ load(); },[]);

  return (
    <main>
      <h3>Admin: Approvals</h3>
      <p style={{color:'green'}}>{msg}</p>

      <h4>Candidates</h4>
      {cands.map((c:any)=>(
        <div key={c.user_id} style={{border:'1px solid #ddd', padding:8, marginBottom:6}}>
          {c.name || c.user_id} — Verified: {String(c.verified)}{' '}
          <button onClick={()=>toggleCandidate(c.user_id, !c.verified)}>Toggle</button>
        </div>
      ))}

      <h4>Employers</h4>
      {emps.map((e:any)=>(
        <div key={e.user_id} style={{border:'1px solid #ddd', padding:8, marginBottom:6}}>
          {e.company_name || e.user_id} — Verified: {String(e.verified)}{' '}
          <button onClick={()=>toggleEmployer(e.user_id, !e.verified)}>Toggle</button>
        </div>
      ))}
    </main>
  );
}

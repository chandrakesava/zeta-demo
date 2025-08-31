'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function WeSelect() {
  const [email, setEmail] = useState('');
  const [jobId, setJobId] = useState('');
  const [vendor, setVendor] = useState('internal');
  const [msg, setMsg] = useState('');

  async function inviteTop5() {
    const { data: u } = await supabase.from('users').select('*').eq('email', email).single();
    if (!u) { setMsg('No employer'); return; }
    const { data: job } = await supabase.from('jobs').select('*').eq('id', jobId).single();
    if (!job) { setMsg('No job'); return; }
    const { data: candUsers } = await supabase.from('users').select('*').eq('role','candidate');
    const scored:any[] = [];
    for (const uu of candUsers||[]) {
      const { data: cs } = await supabase.from('candidate_skills').select('*').eq('candidate_user_id', uu.id);
      const skills = (cs||[]).map((x:any)=>x.skill);
      const matches = job.core_skills.filter((s:string)=> skills.includes(s));
      const pct = Math.round((matches.length / job.core_skills.length) * 100);
      scored.push({ user:uu, pct });
    }
    scored.sort((a,b)=> b.pct - a.pct);
    const top = scored.slice(0,5);
    for (const t of top) {
      const { data: app } = await supabase.from('applications').insert({
        job_id: jobId,
        candidate_user_id: t.user.id,
        status: 'assessing'
      }).select().single();
      await supabase.from('assessments').insert({
        application_id: app?.id,
        vendor,
        status: 'invited'
      });
    }
    setMsg('Invited top 5 candidates (simulated).');
  }

  return (
    <main>
      <h3>Employer: We-Select</h3>
      <p style={{color:'green'}}>{msg}</p>
      <div style={{display:'grid', gap:8, maxWidth:480}}>
        <input placeholder="Employer email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Job ID (copy from DB or create via Post Job)" value={jobId} onChange={e=>setJobId(e.target.value)} />
        <label>Vendor
          <select value={vendor} onChange={e=>setVendor(e.target.value)}>
            <option value="internal">Internal</option>
            <option value="karat">Karat</option>
            <option value="hackerrank">HackerRank</option>
            <option value="imocha">Imocha</option>
          </select>
        </label>
        <button onClick={inviteTop5}>Send Assessment Invites (simulate)</button>
      </div>
    </main>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Matching() {
  const [email, setEmail] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [cands, setCands] = useState<any[]>([]);
  const [chosen, setChosen] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState('');

  async function loadJobs() {
    const { data: u } = await supabase.from('users').select('*').eq('email', email).single();
    if (!u) { setMsg('No employer found'); return; }
    const { data: j } = await supabase.from('jobs').select('*').eq('employer_user_id', u.id).order('created_at', { ascending:false });
    setJobs(j||[]);
    setMsg(`Loaded ${j?.length||0} jobs`);
  }

  async function loadMatches() {
    if (!selectedJobId) return;
    const { data: job } = await supabase.from('jobs').select('*').eq('id', selectedJobId).single();
    const { data: candUsers } = await supabase.from('users').select('*').eq('role','candidate');
    const result:any[] = [];
    for (const u of candUsers||[]) {
      const { data: cs } = await supabase.from('candidate_skills').select('*').eq('candidate_user_id', u.id);
      const skillSet = (cs||[]).map((x:any)=>x.skill);
      const matches = job.core_skills.filter((s:string)=> skillSet.includes(s));
      const pct = Math.round((matches.length / job.core_skills.length) * 100);
      const { data: c } = await supabase.from('candidates').select('*').eq('user_id', u.id).single();
      result.push({ user:u, profile:c, matchPct:pct, skills:skillSet });
    }
    result.sort((a,b)=> b.matchPct - a.matchPct);
    setCands(result);
  }

  async function submitSelected() {
    const picked = cands.filter(c=>chosen[c.user.id]);
    for (const p of picked) {
      await supabase.from('applications').insert({
        job_id: selectedJobId,
        candidate_user_id: p.user.id,
        status: 'assessing'
      });
    }
    setMsg(`Submitted ${picked.length} candidates. (Simulated emails sent)`);
  }

  return (
    <main>
      <h3>Employer: Matching (Self-select)</h3>
      <p style={{color:'green'}}>{msg}</p>
      <div style={{display:'flex', gap:8}}>
        <input placeholder="Employer email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button onClick={loadJobs}>Load Jobs</button>
      </div>

      {jobs.length>0 && (
        <div style={{marginTop:12}}>
          <label>Pick a job: </label>
          <select value={selectedJobId} onChange={e=>setSelectedJobId(e.target.value)}>
            <option value="">-- select --</option>
            {jobs.map(j=> <option key={j.id} value={j.id}>{j.role} ({j.location_city||''})</option>)}
          </select>
          <button onClick={loadMatches} style={{marginLeft:8}}>Find Matches</button>
        </div>
      )}

      <div style={{marginTop:16}}>
        {cands.map(c=>(
          <div key={c.user.id} style={{border:'1px solid #ddd', padding:10, marginBottom:8}}>
            <label>
              <input type="checkbox" checked={!!chosen[c.user.id]} onChange={e=>setChosen(prev=>({...prev, [c.user.id]: e.target.checked}))}/>
              {' '}Select
            </label>
            <div><b>{c.profile?.name || c.user.email}</b> — Match: {c.matchPct}%</div>
            <div>Skills: {c.skills.join(', ')}</div>
            <div>Verified: {c.profile?.verified ? 'Yes' : 'No'}</div>
          </div>
        ))}
        {cands.length>0 && <button onClick={submitSelected}>Submit Selected</button>}
      </div>
    </main>
  );
}

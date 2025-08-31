'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EmployerInterviews() {
  const [jobId, setJobId] = useState('');
  const [apps, setApps] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  async function load() {
    const { data } = await supabase.from('applications').select('*').eq('job_id', jobId);
    setApps(data||[]);
  }

  async function schedule(appId:string) {
    const when = new Date(Date.now() + 24*60*60*1000).toISOString(); // +1 day
    await supabase.from('interviews').insert({ application_id: appId, scheduled_at: when });
    setMsg('Interview scheduled (sim). Refresh to see updates.');
  }

  async function decision(appId:string, status:'hired'|'rejected') {
    await supabase.from('applications').update({ status }).eq('id', appId);
    setMsg(`Marked ${status}. For hired, open a sample offer from offers bucket.`);
  }

  return (
    <main>
      <h3>Employer: Interviews & Decisions</h3>
      <p style={{color:'green'}}>{msg}</p>
      <input placeholder="Job ID" value={jobId} onChange={e=>setJobId(e.target.value)} />
      <button onClick={load}>Load Applications</button>
      <div style={{marginTop:12}}>
        {apps.map((a:any)=>(
          <div key={a.id} style={{border:'1px solid #ddd', padding:10, marginBottom:8}}>
            <div>Application: {a.id}</div>
            <div>Status: {a.status}</div>
            <button onClick={()=>schedule(a.id)}>Schedule Interview (simulate)</button>{' '}
            <button onClick={()=>decision(a.id, 'hired')}>Mark Hired</button>{' '}
            <button onClick={()=>decision(a.id, 'rejected')}>Mark Rejected</button>{' '}
            <a href="https://YOUR-SUPABASE-PROJECT-URL/storage/v1/object/public/offers/sample_offer.pdf" target="_blank">Open Offer PDF (demo)</a>
          </div>
        ))}
      </div>
    </main>
  );
}

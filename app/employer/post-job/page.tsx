'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PostJob() {
  const [email, setEmail] = useState('');
  const [job, setJob] = useState({
    role:'', level:'', domain:'', sector:'',
    core_skills:'Python, SQL, AWS',
    location_city:'', location_state:'', location_country:'USA',
    work_type:'Full-time', salary_min:120000, salary_max:150000
  });
  const [msg, setMsg] = useState('');

  async function post() {
    const { data: u } = await supabase.from('users').select('*').eq('email', email).single();
    if (!u) { setMsg('No employer with that email'); return; }
    const skillsArray = job.core_skills.split(',').map(s=>s.trim()).filter(Boolean);
    const { error } = await supabase.from('jobs').insert({
      employer_user_id: u.id, ...job, core_skills: skillsArray
    });
    if (error) { setMsg('Error: '+error.message); return; }
    setMsg('Job posted ✅');
  }

  return (
    <main>
      <h3>Employer: Post a Job</h3>
      <p style={{color:'green'}}>{msg}</p>
      <div style={{display:'grid', gap:8, maxWidth:520}}>
        <input placeholder="Employer email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Role" value={job.role} onChange={e=>setJob({...job, role:e.target.value})}/>
        <input placeholder="Level" value={job.level} onChange={e=>setJob({...job, level:e.target.value})}/>
        <input placeholder="Domain" value={job.domain} onChange={e=>setJob({...job, domain:e.target.value})}/>
        <input placeholder="Sector" value={job.sector} onChange={e=>setJob({...job, sector:e.target.value})}/>
        <input placeholder="Core skills (comma-separated)" value={job.core_skills} onChange={e=>setJob({...job, core_skills:e.target.value})}/>
        <input placeholder="City" value={job.location_city} onChange={e=>setJob({...job, location_city:e.target.value})}/>
        <input placeholder="State" value={job.location_state} onChange={e=>setJob({...job, location_state:e.target.value})}/>
        <input placeholder="Country" value={job.location_country} onChange={e=>setJob({...job, location_country:e.target.value})}/>
        <input placeholder="Work type (Remote/Full-time/...)" value={job.work_type} onChange={e=>setJob({...job, work_type:e.target.value})}/>
        <input placeholder="Salary min" type="number" value={job.salary_min} onChange={e=>setJob({...job, salary_min:parseInt(e.target.value||'0')})}/>
        <input placeholder="Salary max" type="number" value={job.salary_max} onChange={e=>setJob({...job, salary_max:parseInt(e.target.value||'0')})}/>
        <button onClick={post}>Post Job</button>
      </div>
    </main>
  );
}

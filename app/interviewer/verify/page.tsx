'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function InterviewerVerify() {
  const [email, setEmail] = useState('');
  const [skills, setSkills] = useState('Python, SQL, AWS');
  const [msg, setMsg] = useState('');

  async function createInterviewer() {
    const { data, error } = await supabase.from('users').insert({ email, role: 'interviewer' });
    if (error) { setMsg('Error: '+error.message); return; }
    setMsg('Interviewer created. Verification simulated ✅');
  }

  return (
    <main>
      <h3>Interviewer: Verify</h3>
      <p style={{color:'green'}}>{msg}</p>
      <div style={{display:'grid', gap:8, maxWidth:420}}>
        <input placeholder="Work email" value={email} onChange={e=>setEmail(e.target.value)} />
        <textarea rows={3} value={skills} onChange={e=>setSkills(e.target.value)} />
        <button onClick={createInterviewer}>Create/Verify (simulate)</button>
      </div>
    </main>
  );
}

'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function InterviewerSession() {
  const [interviewId, setInterviewId] = useState('');
  const [rating, setRating] = useState(4);
  const [notes, setNotes] = useState('Strong on APIs.');
  const [msg, setMsg] = useState('');

  async function submit() {
    const { error } = await supabase.from('interviews').update({
      status:'done', rating, notes
    }).eq('id', interviewId);
    if (error) { setMsg('Error: '+error.message); return; }
    setMsg('Interview submitted ✅');
  }

  return (
    <main>
      <h3>Interviewer: Session</h3>
      <p style={{color:'green'}}>{msg}</p>
      <div style={{display:'grid', gap:8, maxWidth:420}}>
        <input placeholder="Interview ID" value={interviewId} onChange={e=>setInterviewId(e.target.value)} />
        <label>Rating
          <select value={rating} onChange={e=>setRating(parseInt(e.target.value))}>
            {[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <textarea rows={4} value={notes} onChange={e=>setNotes(e.target.value)} />
        <button onClick={submit}>End & Submit</button>
      </div>
    </main>
  );
}

'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CandidateResults() {
  const [email, setEmail] = useState('');
  const [rows, setRows] = useState<any[]>([]);

  async function load() {
    const { data: u } = await supabase.from('users').select('*').eq('email', email).single();
    if (!u) return;
    const { data } = await supabase.from('quizzes').select('*').eq('candidate_user_id', u.id).order('created_at', { ascending: false });
    setRows(data || []);
  }

  return (
    <main>
      <h3>Candidate: Results</h3>
      <input placeholder="candidate email" value={email} onChange={e=>setEmail(e.target.value)} />
      <button onClick={load}>Load</button>
      <ul>
        {rows.map((r:any)=>(
          <li key={r.id}>
            {new Date(r.created_at).toLocaleString()} — {r.score_pct}% — {r.passed ? 'PASS' : 'FAIL'}
          </li>
        ))}
      </ul>
    </main>
  );
}

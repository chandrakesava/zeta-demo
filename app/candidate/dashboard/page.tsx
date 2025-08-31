'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CandidateDashboard() {
  const [me, setMe] = useState<any>(null);
  const [email, setEmail] = useState('');

  async function load() {
    if (!email) return;
    const { data: u } = await supabase.from('users').select('*').eq('email', email).single();
    if (!u) return;
    const { data: c } = await supabase.from('candidates').select('*').eq('user_id', u.id).single();
    setMe({ user: u, cand: c });
  }

  return (
    <main>
      <h3>Candidate: Dashboard</h3>
      <p>Type your candidate email to load your dashboard:</p>
      <input placeholder="your@email"
             value={email} onChange={e=>setEmail(e.target.value)} />
      <button onClick={load}>Load</button>

      {me && (
        <div style={{marginTop:16}}>
          <p><b>Name:</b> {me.cand?.name}</p>
          <p><b>Verified:</b> {me.cand?.verified ? 'Yes' : 'No'}</p>
          <div style={{marginTop:8}}>
            <Link href="/candidate/quiz">Take Quiz</Link>
          </div>
          <div style={{marginTop:12}}>
            <h4>Ratings (demo)</h4>
            <ul>
              <li>Quiz: check in Results after submission</li>
              <li>Assessment: pending</li>
              <li>Interview: pending</li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}

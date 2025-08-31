'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Q = { id:string; skill:string; prompt:string; options_json:any; correct_key:string };

function distributeQuestions(skills: string[], total: number) {
  const s = skills.filter(Boolean).map(x=>x.trim()).filter(x=>x.length>0);
  if (s.length === 0) return [];
  const base = Math.floor(total / s.length);
  let leftover = total % s.length;
  return s.map((skill, i) => ({ skill, count: base + (i < leftover ? 1 : 0) }));
}

export default function CandidateQuiz() {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string| null>(null);
  const [skillsText, setSkillsText] = useState('Python, SQL, AWS');
  const [total, setTotal] = useState(10);
  const [timeLimit, setTimeLimit] = useState(600); // 600 sec = 10 min
  const [qs, setQs] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [remaining, setRemaining] = useState<number>(0);
  const timerRef = useRef<any>(null);
  const [msg, setMsg] = useState('');

  async function loadUser() {
    const { data: u } = await supabase.from('users').select('*').eq('email', email).single();
    if (!u) { setMsg('No candidate user with that email'); return; }
    setUserId(u.id);
    setMsg('User loaded. Generate quiz next.');
  }

  async function generateQuiz() {
    const plan = distributeQuestions(skillsText.split(','), total);
    const all: Q[] = [];
    for (const p of plan) {
      if (p.count <= 0) continue;
      const { data } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('skill', p.skill)
        .limit(p.count);
      if (data) all.push(...(data as any));
    }
    setQs(all.slice(0, total)); // ensure cap to total
    setAnswers({});
    setMsg(`Quiz generated with ${all.length} questions. Start timer when ready.`);
  }

  function startTimer() {
    setRemaining(timeLimit);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(()=> {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); submit(); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  async function submit() {
    if (timerRef.current) clearInterval(timerRef.current);
    let correct = 0;
    for (const q of qs) {
      if (answers[q.id] === q.correct_key) correct++;
    }
    const scorePct = Math.round((correct / (qs.length || 1)) * 100);
    const passed = scorePct >= 70;
    setMsg(`Submitted. Score ${scorePct}%. ${passed ? 'PASS' : 'FAIL'}`);

    if (!userId) return;
    await supabase.from('quizzes').insert({
      candidate_user_id: userId,
      total_q: qs.length,
      time_limit_sec: timeLimit,
      score_pct: scorePct,
      passed: passed,
      cooldown_until: passed ? null : new Date(Date.now() + 60*1000).toISOString()
    });
  }

  return (
    <main>
      <h3>Candidate: Quiz</h3>
      <p style={{color:'green'}}>{msg}</p>

      <div style={{display:'grid', gap:8, maxWidth:520}}>
        <input placeholder="Your candidate email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button onClick={loadUser}>Load Candidate</button>

        <textarea rows={3} value={skillsText} onChange={e=>setSkillsText(e.target.value)} />
        <label>Total Questions: <input type="number" value={total} onChange={e=>setTotal(parseInt(e.target.value||'0'))} /></label>
        <label>Time Limit (sec): <input type="number" value={timeLimit} onChange={e=>setTimeLimit(parseInt(e.target.value||'0'))} /></label>
        <button onClick={generateQuiz}>Generate Quiz</button>
        <button onClick={startTimer}>Start Timer</button>
        <div>Time Remaining: {remaining}s</div>
      </div>

      {qs.length>0 && (
        <div style={{marginTop:16}}>
          {qs.map((q,i)=>(
            <div key={q.id} style={{border:'1px solid #ddd', padding:12, marginBottom:8}}>
              <div><b>Q{i+1} ({q.skill})</b> {q.prompt}</div>
              {['A','B','C','D'].map(opt => (
                <label key={opt} style={{display:'block'}}>
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id]===opt}
                    onChange={()=>setAnswers(prev=>({...prev,[q.id]:opt}))}
                  /> {opt}. {q.options_json?.[opt]}
                </label>
              ))}
            </div>
          ))}
          <button onClick={submit}>Submit</button>
        </div>
      )}
    </main>
  );
}

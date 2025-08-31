'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CandidateRegister() {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [citizenship, setCitizenship] = useState('');
  const [sponsorship, setSponsorship] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [govId, setGovId] = useState<File | null>(null);
  const [orgId, setOrgId] = useState<File | null>(null);
  const [msg, setMsg] = useState<string>('');

  async function createUser() {
    setMsg('Creating candidate user...');
    const { data: user, error } = await supabase
      .from('users')
      .insert({ email, role: 'candidate' })
      .select()
      .single();

    if (error || !user) { setMsg('Error creating user: ' + (error?.message||'')); return; }
    setUserId(user.id);

    const { error: err2 } = await supabase.from('candidates').insert({
      user_id: user.id, name, address, citizenship, sponsorship
    });
    if (err2) { setMsg('Error creating candidate profile: ' + err2.message); return; }
    setMsg('User & profile created. Now upload files and verify.');
  }

  async function uploadTo(bucket: 'resumes'|'ids', file: File, key: string) {
    const { data, error } = await supabase.storage.from(bucket)
      .upload(key, file, { upsert: true });
    if (error) throw error;
    // Make public URL for demo
    const pub = supabase.storage.from(bucket).getPublicUrl(data.path);
    return pub.data.publicUrl;
  }

  async function uploadFiles() {
    if (!userId) { setMsg('Create user first'); return; }
    try {
      setMsg('Uploading files...');
      let resumeUrl = null, govIdUrl = null, orgIdUrl = null;
      if (resume) resumeUrl = await uploadTo('resumes', resume, `candidate_${userId}/${resume.name}`);
      if (govId) govIdUrl = await uploadTo('ids', govId, `candidate_${userId}/gov_${govId.name}`);
      if (orgId) orgIdUrl = await uploadTo('ids', orgId, `candidate_${userId}/org_${orgId.name}`);

      const { error } = await supabase
        .from('candidates')
        .update({ resume_url: resumeUrl, gov_id_url: govIdUrl, org_id_url: orgIdUrl })
        .eq('user_id', userId);
      if (error) throw error;
      setMsg('Files uploaded & saved.');
    } catch (e:any) {
      setMsg('Upload error: ' + e.message);
    }
  }

  async function verifySim() {
    if (!userId) { setMsg('Create user first'); return; }
    const { error } = await supabase.from('candidates').update({ verified: true }).eq('user_id', userId);
    if (error) { setMsg('Verify error: ' + error.message); return; }
    setMsg('Verified ✅');
  }

  return (
    <main>
      <h3>Candidate: Register & Verify</h3>
      <p style={{color:'green'}}>{msg}</p>
      <div style={{display:'grid', gap:8, maxWidth:420}}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />
        <input placeholder="Citizenship" value={citizenship} onChange={e=>setCitizenship(e.target.value)} />
        <input placeholder="Sponsorship" value={sponsorship} onChange={e=>setSponsorship(e.target.value)} />
        <button onClick={createUser}>Create account</button>

        <label>Upload Resume <input type="file" onChange={e=>setResume(e.target.files?.[0]||null)} /></label>
        <label>Upload Government ID <input type="file" onChange={e=>setGovId(e.target.files?.[0]||null)} /></label>
        <label>Upload Univ/Employer ID <input type="file" onChange={e=>setOrgId(e.target.files?.[0]||null)} /></label>
        <button onClick={uploadFiles}>Upload files</button>

        <button onClick={verifySim}>Verify Email & Phone (simulate)</button>
      </div>
    </main>
  );
}

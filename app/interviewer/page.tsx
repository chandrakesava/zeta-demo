import Link from 'next/link';
export default function InterviewerHome() {
  return (
    <main>
      <h2>Interviewer</h2>
      <ul>
        <li><Link href="/interviewer/verify">Verify (simulate)</Link></li>
        <li><Link href="/interviewer/session">Interview Session</Link></li>
      </ul>
    </main>
  );
}

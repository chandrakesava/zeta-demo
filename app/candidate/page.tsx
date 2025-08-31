import Link from 'next/link';

export default function CandidateHome() {
  return (
    <main>
      <h2>Candidate</h2>
      <ol>
        <li><Link href="/candidate/register">1) Register & Verify</Link></li>
        <li><Link href="/candidate/dashboard">2) Dashboard</Link></li>
        <li><Link href="/candidate/quiz">3) Take Quiz</Link></li>
        <li><Link href="/candidate/results">4) Results</Link></li>
      </ol>
    </main>
  );
}

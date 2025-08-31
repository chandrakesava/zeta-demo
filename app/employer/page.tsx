import Link from 'next/link';
export default function EmployerHome() {
  return (
    <main>
      <h2>Employer</h2>
      <ol>
        <li><Link href="/employer/verify">1) Verify (simulate)</Link></li>
        <li><Link href="/employer/post-job">2) Post Job</Link></li>
        <li><Link href="/employer/choose-mode">3) Choose Mode</Link></li>
        <li><Link href="/employer/matching">4) Matching (Self-select)</Link></li>
        <li><Link href="/employer/we-select">5) We-Select</Link></li>
        <li><Link href="/employer/interviews">6) Interviews & Decisions</Link></li>
      </ol>
    </main>
  );
}

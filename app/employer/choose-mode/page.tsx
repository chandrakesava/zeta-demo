import Link from 'next/link';
export default function ChooseMode() {
  return (
    <main>
      <h3>Employer: Choose Mode</h3>
      <p>Pick how you want to proceed after posting a job:</p>
      <ul>
        <li><Link href="/employer/matching">Self-select candidates</Link></li>
        <li><Link href="/employer/we-select">We select on your behalf</Link></li>
      </ul>
    </main>
  );
}

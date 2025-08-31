import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ZetaHire Demo',
  description: 'Prototype',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', margin: 0 }}>
        <div style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', gap: '16px' }}>
          <Link href="/">Home</Link>
          <Link href="/candidate">Candidate</Link>
          <Link href="/employer">Employer</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/interviewer">Interviewer</Link>
        </div>
        <div style={{ padding: '16px' }}>{children}</div>
      </body>
    </html>
  );
}

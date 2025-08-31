import Link from 'next/link';
export default function AdminHome() {
  return (
    <main>
      <h2>Admin</h2>
      <ul>
        <li><Link href="/admin/approvals">Approvals</Link></li>
      </ul>
    </main>
  );
}

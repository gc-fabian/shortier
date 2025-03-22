import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ViewPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  const handleView = e => {
    e.preventDefault();
    router.push(`/user/${username.trim()}`);
  };

  return (
    <div className="container mx-auto p-8">
      <nav className="flex justify-end mb-8">
        <Link href="/" className="btn btn-outline">Acortar URL</Link>
      </nav>

      <h1 className="text-3xl font-bold mb-4">Ver mis links</h1>
      <form onSubmit={handleView} className="space-y-4 max-w-md">
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Usuario" className="input input-bordered w-full" required />
        <button type="submit" className="btn btn-secondary w-full">Mostrar URLs</button>
      </form>
    </div>
  );
}

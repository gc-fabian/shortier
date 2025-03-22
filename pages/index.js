import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username, longUrl }),
    });
    const data = await res.json();
    res.ok ? setShortUrl(data.shortUrl) : setError(data.message);
  };

  return (
    <div className="container mx-auto p-8">
      <nav className="flex justify-end mb-8">
        <Link href="/view" className="btn btn-outline">Ver mis links</Link>
      </nav>

      <h1 className="text-3xl font-bold mb-4">Acortar URL</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Usuario" className="input input-bordered w-full" required />
        <input value={longUrl} onChange={e=>setLongUrl(e.target.value)} type="url" placeholder="URL larga" className="input input-bordered w-full" required />
        <button type="submit" className="btn btn-primary w-full">Acortar URL</button>
      </form>

      {shortUrl && <p className="mt-4">🔗 <a href={shortUrl} className="link">{shortUrl}</a></p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

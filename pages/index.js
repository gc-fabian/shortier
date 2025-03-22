import { useState } from 'react';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setShortUrl(data.shortUrl);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div>
      <h1>Acortador de URLs</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Ingresa la URL larga"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />
        <button type="submit">Acortar URL</button>
      </form>
      {shortUrl && (
        <div>
          <p>URL Acortada:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
        </div>
      )}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

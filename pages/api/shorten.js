import { nanoid } from 'nanoid';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { username, longUrl } = req.body;
  if (!username?.trim() || !longUrl) {
    return res.status(400).json({ message: 'Usuario y URL son requeridos' });
  }

  try {
    const client = await clientPromise;
    const urls = client.db().collection('urls');

    const shortId = nanoid(6);
    const creationDate = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(creationDate.getDate() + 3);

    await urls.insertOne({ username, longUrl, shortId, creationDate, expirationDate, clicks: 0 });

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : req.headers.origin;
    return res.status(201).json({ shortUrl: `${baseUrl}/${shortId}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al acortar URL' });
  }
}

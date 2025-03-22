import { nanoid } from 'nanoid';
import clientPromise from '../../lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Debes iniciar sesión para acortar URLs' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }

  const { longUrl } = req.body;
  if (!longUrl) {
    return res.status(400).json({ message: 'La URL es requerida' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('urls');

    const shortId = nanoid(6);
    const creationDate = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(creationDate.getDate() + 3);

    const newUrl = {
      userId: session.user.id,
      longUrl,
      shortId,
      creationDate,
      expirationDate,
      clicks: 0,
    };

    await collection.insertOne(newUrl);

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : req.headers.origin;
    const shortUrl = `${baseUrl}/${shortId}`;

    return res.status(201).json({ shortUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al acortar la URL' });
  }
}

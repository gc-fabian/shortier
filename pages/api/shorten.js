import { nanoid } from 'nanoid';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { longUrl } = req.body;
    if (!longUrl) {
      return res.status(400).json({ message: 'La URL es requerida' });
    }
    try {
      const client = await clientPromise;
      const db = client.db(); // o especifica el nombre de la base de datos
      const collection = db.collection('urls');

      const shortId = nanoid(6); // genera un ID de 6 caracteres
      const creationDate = new Date();
      const expirationDate = new Date();
      expirationDate.setDate(creationDate.getDate() + 3); // Expira en 3 días

      const newUrl = {
        longUrl,
        shortId,
        creationDate,
        expirationDate,
        clicks: 0,
      };

      await collection.insertOne(newUrl);

      // Construye la URL acortada utilizando el host de la solicitud
      const shortUrl = `${req.headers.origin}/${shortId}`;

      return res.status(201).json({ shortUrl });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al acortar la URL' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}

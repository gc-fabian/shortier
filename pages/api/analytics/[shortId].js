
export const dynamic = 'force-dynamic';
import clientPromise from '../../../lib/mongodb';
export default async function handler(req, res) {
  const { shortId } = req.query;

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('urls');

    const urlData = await collection.findOne({ shortId });
    if (!urlData) {
      return res.status(404).json({ message: 'URL no encontrada' });
    }

    return res.status(200).json({ clicks: urlData.clicks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener la analítica' });
  }
}

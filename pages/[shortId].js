import clientPromise from '../lib/mongodb';

export async function getServerSideProps({ params, res }) {
  const { shortId } = params;

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('urls');

    const urlData = await collection.findOne({ shortId });
    if (!urlData) {
      return { notFound: true };
    }

    const now = new Date();
    if (now > new Date(urlData.expirationDate)) {
      return {
        props: {
          expired: true,
          message: 'La URL ha expirado',
        },
      };
    }

    // Incrementar el contador de clics
    await collection.updateOne({ shortId }, { $inc: { clicks: 1 } });

    // Redirigir al usuario a la URL original
    res.writeHead(307, { Location: urlData.longUrl });
    res.end();
    return { props: {} };
  } catch (error) {
    console.error(error);
    return {
      props: {
        error: 'Error al redirigir la URL',
      },
    };
  }
}

export default function RedirectPage({ expired, message, error }) {
  if (expired) {
    return <p>{message}</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  return <p>Redirigiendo...</p>;
}

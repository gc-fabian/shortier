import clientPromise from '../../lib/mongodb';

export async function getServerSideProps({ params }) {
  const client = await clientPromise;
  const urls = await client.db()
    .collection('urls')
    .find({ username: params.username })
    .toArray();

  return { props: { urls: JSON.parse(JSON.stringify(urls)), username: params.username } };
}

export default function UserDashboard({ urls, username }) {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">URLs de {username}</h1>
      <table className="table w-full">
        <thead>
          <tr><th>Short ID</th><th>Original</th><th>Clics</th><th>Expira</th></tr>
        </thead>
        <tbody>
          {urls.map(u => (
            <tr key={u._id}>
              <td><a href={`/${u.shortId}`}>{u.shortId}</a></td>
              <td><a href={u.longUrl}>{u.longUrl}</a></td>
              <td>{u.clicks}</td>
              <td>{new Date(u.expirationDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

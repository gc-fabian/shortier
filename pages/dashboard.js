import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import clientPromise from "../lib/mongodb";

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return { redirect: { destination: "/api/auth/signin", permanent: false } };

  const client = await clientPromise;
  const urls = await client.db().collection("urls")
    .find({ userId: session.user.id })
    .toArray();

  return { props: { urls: JSON.parse(JSON.stringify(urls)) } };
}

export default function Dashboard({ urls }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tus URLs</h1>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th>Short ID</th><th>Original</th><th>Clicks</th><th>Expira</th>
          </tr>
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

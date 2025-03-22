import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";

function AuthButton() {
  const { data: session } = useSession();
  return session
    ? <button onClick={() => signOut()}>Cerrar sesión</button>
    : <button onClick={() => signIn("google")}>Iniciar con Google</button>;
}

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider>
      <AuthButton />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

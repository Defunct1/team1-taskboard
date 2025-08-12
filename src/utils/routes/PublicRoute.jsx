// PublicRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

export default function PublicRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return setUser(null);
      try {
        await u.reload();
      } catch {}
      setUser(u);
    });
    return unsub;
  }, []);

  if (user === undefined) return <p>Завантаження...</p>;

  if (user && user.emailVerified) return <Navigate to="/dashboard" replace />;

  return children;
}

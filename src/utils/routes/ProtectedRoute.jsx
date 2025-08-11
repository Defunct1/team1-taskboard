// ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function ProtectedRoute({ children, role = null }) {
  const [user, setUser] = useState(undefined);
  const [roleAllowed, setRoleAllowed] = useState(undefined);
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setRoleAllowed(undefined);
        return;
      }

      try {
        await u.reload();
      } catch (_) {}

      if (!u.emailVerified) {
        setUser("unverified");
        setRoleAllowed(undefined);
        return;
      }

      setUser(u);

      if (!role) {
        setRoleAllowed(true);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        const data = snap.data();
        setRoleAllowed(data?.role === role);
      } catch {
        setRoleAllowed(false);
      }
    });

    return unsub;
  }, [role]);

  if (user === undefined) return <p>Завантаження...</p>;

  if (user === null)
    return <Navigate to="/auth" replace state={{ from: location }} />;

  if (user === "unverified")
    return <p>Будь ласка, підтвердіть email перед доступом.</p>;

  if (role && roleAllowed === undefined) return <p>Завантаження...</p>;

  if (role && roleAllowed === false)
    return <Navigate to="/dashboard" replace />;

  return children;
}

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export default function ProtectedRoute({ children, role = null }) {
  const [user, setUser] = useState(undefined);
  const [hasAccess, setHasAccess] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(undefined); // для role-redirect

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        return;
      }

      await user.reload();

      if (!user.emailVerified) {
        setUser("unverified");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      setUser(user);

      // 🔐 Перевірка ролі
      if (!role || userData?.role === role) {
        setHasAccess(true);
        setIsAuthorized(true);
      } else {
        setHasAccess(false);
        setIsAuthorized(false);
      }
    });

    return unsub;
  }, [role]);

  if (user === undefined || isAuthorized === undefined)
    return <p>Завантаження...</p>;
  if (user === "unverified")
    return <p>Будь ласка, підтвердіть email перед доступом.</p>;
  if (!user) return <Navigate to="/auth" />;
  if (!hasAccess && role) return <Navigate to="/dashboard" />;

  return children;
}

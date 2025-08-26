import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function PublicRoute({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthChecked(true);
        return;
      }

      try {
        // Оновлюємо стан користувача
        await user.reload();
        
        // Якщо email підтверджено - перенаправляємо
        if (user.emailVerified) {
          // Перенаправляємо на попередню сторінку або /dashboard
          const redirectTo = location.state?.from?.pathname || "/dashboard";
          setAuthChecked(redirectTo);
        } else {
          setAuthChecked(true);
        }
      } catch (error) {
        console.error("Помилка оновлення стану користувача:", error);
        setAuthChecked(true);
      }
    });

    return () => unsubscribe();
  }, [location.state]);

  if (authChecked === false) {
    return <LoadingSpinner fullScreen />;
  }

  if (typeof authChecked === 'string') {
    return <Navigate to={authChecked} replace />;
  }

  return children;
}
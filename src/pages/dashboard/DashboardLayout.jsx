import { Outlet, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase";
import styles from "./DashboardLayout.module.css";
import { useEffect, useState } from "react";
import DashboardNav from "./DashboardNav";

export default function DashboardLayout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "");
      } else {
        setUserEmail("");
        navigate("/auth");
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth); // navigate зробить onAuthStateChanged
    } catch (error) {
      console.error("Помилка при виході:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          {userEmail && <span className={styles.userEmail}>{userEmail}</span>}
        </div>
        <DashboardNav onLogout={handleLogout} isLoggingOut={isLoggingOut} />
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

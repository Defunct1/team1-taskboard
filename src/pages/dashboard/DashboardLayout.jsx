import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase";
import styles from "./DashboardLayout.module.css";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function DashboardLayout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
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
      await signOut(auth);
      navigate("/auth");
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
        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
            end
          >
            Головна
          </NavLink>
          <NavLink
            to="/dashboard/board"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Дошки
          </NavLink>
          <NavLink
            to="/dashboard/account"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Акаунт
          </NavLink>
          <NavLink
            to="/dashboard/support"
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            Підтримка
          </NavLink>
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? <LoadingSpinner small /> : "Вийти"}
          </button>
        </nav>
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
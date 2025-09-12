import { NavLink } from "react-router-dom";
import styles from "./DashboardLayout.module.css";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function DashboardNav({ onLogout, isLoggingOut }) {
  return (
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
        onClick={onLogout}
        className={styles.logoutButton}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? <LoadingSpinner small /> : "Вийти"}
      </button>
    </nav>
  );
}

import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* ── Left ─────────────────────────────────────────────────────────── */}
      <div className="navbar__left">
        <button
          className="navbar__hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div className="navbar__brand">
          🏆 <span className="navbar__brand-text">Sports Day</span>
        </div>
      </div>

      {/* ── Right ────────────────────────────────────────────────────────── */}
      <div className="navbar__right">
        <div className="navbar__user-info">
          <span className="navbar__role-badge">
            {user?.role === "admin" ? "👑" : "⚖️"}
          </span>
          <span className="navbar__user">
            {user?.name || user?.email || "User"}
          </span>
        </div>
        <button className="navbar__logout" onClick={handleLogout}>
          <span className="navbar__logout-text">Logout</span>
          <span className="navbar__logout-icon">→</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
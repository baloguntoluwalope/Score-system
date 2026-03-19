import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const adminLinks = [
  { to: "/admin",          icon: "📊", label: "Dashboard"    },
  { to: "/admin/games",    icon: "🎮", label: "Manage Games"  },
  { to: "/admin/publish",  icon: "📢", label: "Publish"       },
  { to: "/admin/reset",    icon: "🔄", label: "Reset Board"   },
];

const judgeLinks = [
  { to: "/judge",                icon: "🏠", label: "Dashboard"     },
  { to: "/judge/submit",         icon: "🥇", label: "Submit Score"   },
  { to: "/judge/submit/batch",   icon: "📋", label: "Submit Batch"   },
  { to: "/judge/submit/bygame",  icon: "🎯", label: "Submit by Game" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();
  const links = isAdmin ? adminLinks : judgeLinks;

  return (
    <>
      {/* Overlay — mobile only */}
      <div
        className={`sidebar-overlay${isOpen ? " visible" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`sidebar${isOpen ? " open" : ""}`}>
        <div className="sidebar__section">
          <span className="sidebar__label">
            {isAdmin ? "Admin Menu" : "Judge Menu"}
          </span>

          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin" || link.to === "/judge"}
              className={({ isActive }) =>
                `sidebar__link${isActive ? " active" : ""}`
              }
              onClick={onClose} // close sidebar on mobile after clicking
            >
              <span className="sidebar__icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
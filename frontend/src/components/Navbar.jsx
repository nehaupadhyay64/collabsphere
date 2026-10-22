
import { Link, NavLink, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { id } = useParams();

  const links = [
    { label: "Dashboard", icon: "⌂", to: "/dashboard", end: true },
    { label: "My Projects", icon: "▦", to: "/dashboard", end: true },
    ...(id
      ? [
          { label: "Notes", icon: "▤", to: `/projects/${id}/notes` },
          { label: "Members", icon: "♙", to: `/projects/${id}/members` },
          { label: "Analytics", icon: "▥", to: `/projects/${id}/analytics` },
          { label: "Files", icon: "▧", to: `/projects/${id}/files` },
          { label: "README", icon: "⌘", to: `/projects/${id}/readme` },
        ]
      : []),
  ];

  return (
    <aside className="cs-sidebar">
      <Link to="/dashboard" className="cs-brand">
        <span className="cs-brand-icon">C</span>
        <span>CollabSphere</span>
      </Link>

      <div className="cs-workspace">
        <span className="cs-workspace-dot" />
        Workspace
        <span className="cs-workspace-arrow">⌄</span>
      </div>

      <div className="cs-nav-label">WORKSPACE</div>

      <nav className="cs-nav">
        {id && (
    <Link to="/dashboard" className="cs-back">
      <span>←</span> Back to projects
    </Link>
  )}
        {links.map((link, index) => (
          <NavLink
            key={`${link.label}-${index}`}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `cs-nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="cs-nav-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="cs-sidebar-bottom">
        <div className="cs-user">
          <div className="cs-user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="cs-user-details">
            <strong>{user?.name || "User"}</strong>
            <span>Workspace member</span>
          </div>
        </div>

        <button className="cs-logout" onClick={logout}>
          <span>↪</span> Logout
        </button>
      </div>
    </aside>
  );
}

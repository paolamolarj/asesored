import { useState } from "react";
import { BookOpen, LogOut, X, Menu, Users } from "lucide-react";
import AdminAsesoresList from "../components/AdminAsesoresList";
import ToastContainer from "../components/ToastContainer";
import PerfilPanel from "../components/PerfilPanel";
import { useToast } from "../hooks/useToast";
import { useTheme } from "../hooks/useTheme";
import AdminStats from "../components/AdminStats";
import AdminMateriasList from "../components/AdminMateriasList";
import AdminAlumnosList from "../components/AdminAlumnosList";


interface LoggedUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

interface AdminDashboardProps {
  goLogout: () => void;
  user: LoggedUser;
}

export default function AdminDashboard({ goLogout, user }: AdminDashboardProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toasts, showToast, removeToast } = useToast();
  const { isDark, toggleTheme } = useTheme();

  function handleLogout() {
    localStorage.removeItem("asesored_user");
    goLogout();
  }

  const fullName = user?.nombre && user?.apellido ? `${user.nombre} ${user.apellido}` : "Administrador";
  const firstName = user?.nombre || "Administrador";
  const initials = user?.nombre && user?.apellido
    ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()
    : "AD";

  return (
    <div className="dash-root">
      <aside className={`sidebar${mobileOpen ? " mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon"><BookOpen size={22} color="#FFFFFF" /></div>
          <span className="syne" style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            AsesoRed
          </span>
          {mobileOpen && (
            <button onClick={() => setMobileOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">Administrador</div>
            <button className="nav-item active">
              <Users size={18} />
              <span>Asesores y reportes</span>
            </button>
          </div>
          <div className="nav-section">
            <div className="nav-label">Cuenta</div>
            <button className="nav-item" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text-primary)" }}>
              {fullName}
            </div>
            <div className="sidebar-user-rol">Admin</div>
          </div>
        </div>
      </aside>

      <div className={`overlay${mobileOpen ? " visible" : ""}`} onClick={() => setMobileOpen(false)} />

      <main className="dash-main">
        <div className="dash-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="icon-btn hamburger" onClick={() => setMobileOpen(true)}>
              <Menu size={18} />
            </button>
          </div>
          <div className="topbar-actions">
            <button className="theme-toggle" onClick={toggleTheme} title="Cambiar tema">
              {isDark ? "☀️" : "🌙"}
            </button>
            <PerfilPanel initials={initials} />
          </div>
        </div>

        <div className="dash-content content-narrow">
          <div className="greeting anim-fade-up">
            <h1 className="page-hero-title">Hola, {firstName} 🛠️</h1>
            <p className="page-hero-subtitle">
              Gestiona asesores activos y supervisa la operación académica de la plataforma.
            </p>
          </div>
          <AdminStats />

          <AdminAsesoresList showToast={showToast} />
          <AdminMateriasList showToast={showToast} />
          <AdminAlumnosList showToast={showToast} />


        </div>
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
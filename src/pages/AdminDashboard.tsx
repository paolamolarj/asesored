import { useState } from "react";
import {
  BookOpen,
  Bell,
  Search,
  LogOut,
  Settings,
  X,
  Menu,
  Users,
} from "lucide-react";
import Toast from "../components/Toast";
import AdminAsesoresList from "../components/AdminAsesoresList";

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

export default function AdminDashboard({
  goLogout,
  user,
}: AdminDashboardProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  function toast(msg: string) {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  }

  function handleLogout() {
    localStorage.removeItem("asesored_user");
    goLogout();
  }

  const fullName =
    user?.nombre && user?.apellido
      ? `${user.nombre} ${user.apellido}`
      : "Administrador";

  const firstName = user?.nombre || "Administrador";

  const initials =
    user?.nombre && user?.apellido
      ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()
      : "AD";

  return (
    <div className="dash-root">
      <aside className={`sidebar${mobileOpen ? " mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <BookOpen size={22} color="#0D1B2A" />
          </div>
          <span className="syne" style={{ fontSize: 20, fontWeight: 800 }}>
            AsesoRed
          </span>

          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
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

            <button
              className="nav-item"
              onClick={() => toast("Configuración próximamente.")}
            >
              <Settings size={18} />
              <span>Configuración</span>
            </button>

            <button className="nav-item" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {fullName}
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
              Admin
            </div>
          </div>
        </div>
      </aside>

      <div
        className={`overlay${mobileOpen ? " visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <main className="dash-main">
        <div className="dash-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="icon-btn hamburger" onClick={() => setMobileOpen(true)}>
              <Menu size={18} />
            </button>

            <div className="search-bar">
              <Search size={16} color="var(--text-muted)" />
              <input placeholder="Buscar asesor..." />
            </div>
          </div>

          <div className="topbar-actions">
            <div className="icon-btn" style={{ cursor: "pointer" }}>
              <Bell size={17} />
              <div className="notif-dot" />
            </div>

            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {initials}
            </div>
          </div>
        </div>

        <div className="dash-content">
          <div className="greeting anim-fade-up">
            <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
              Hola, {firstName} 🛠️
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
              Administra asesores y controla su disponibilidad en la plataforma.
            </p>
          </div>

          <AdminAsesoresList />
        </div>
      </main>

      {showToast && <Toast message={toastMsg} />}
    </div>
  );
}
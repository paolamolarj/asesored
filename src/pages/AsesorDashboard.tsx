import { useRef, useState } from "react";
import {
  BookOpen,
  Bell,
  Search,
  LogOut,
  Settings,
  X,
  Menu,
} from "lucide-react";
import Toast from "../components/Toast";
import SelectMateriasAsesor from "../components/SelectMateriasAsesor";
import RegisterAvailabilityForm from "../components/RegisterAvailabilityForm";
import AsesorOwnAvailability from "../components/AsesorOwnAvailability";
import AsesorSessionsList from "../components/AsesorSessionsList";
import { asesorNavItems } from "../data/dashboardData";
import AsesorRatingsList from "../components/AsesorRatingsList";
import NotificationsPanel from "../components/NotificationsPanel";

interface LoggedUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

interface AsesorDashboardProps {
  goLogout: () => void;
  user: LoggedUser;
}

export default function AsesorDashboard({
  goLogout,
  user,
}: AsesorDashboardProps) {
  const [activeNav, setActiveNav] = useState("inicio");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [availabilityReload, setAvailabilityReload] = useState(0);

  const inicioRef = useRef<HTMLDivElement | null>(null);
  const materiasRef = useRef<HTMLDivElement | null>(null);
  const horariosRef = useRef<HTMLDivElement | null>(null);
  const solicitudesRef = useRef<HTMLDivElement | null>(null);
  const citasRef = useRef<HTMLDivElement | null>(null);
  const calificacionesRef = useRef<HTMLDivElement | null>(null);

  function scrollToSection(sectionId: string) {
    const sections: Record<string, React.RefObject<HTMLDivElement | null>> = {
      inicio: inicioRef,
      materias: materiasRef,
      horarios: horariosRef,
      solicitudes: solicitudesRef,
      citas: citasRef,
      calificaciones: calificacionesRef,
    };

    const ref = sections[sectionId];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleNavClick(id: string) {
    setActiveNav(id);
    setMobileOpen(false);
    scrollToSection(id);
  }

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
      : "Usuario";

  const firstName = user?.nombre || "Usuario";

  const initials =
    user?.nombre && user?.apellido
      ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()
      : "US";

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
            <div className="nav-label">Principal</div>
            {asesorNavItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item${activeNav === item.id ? " active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`nav-badge${item.badgeColor ? ` ${item.badgeColor}` : ""}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-label">Cuenta</div>

            <button
              className="nav-item"
              onClick={() => {
                setActiveNav("config");
                setMobileOpen(false);
                toast("Configuración próximamente.");
              }}
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
              Asesor
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
              <input placeholder="Buscar alumno, materia..." />
            </div>
          </div>

          <div className="topbar-actions">
  <NotificationsPanel />

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
          <div ref={inicioRef} className="greeting anim-fade-up">
            <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
              Hola, {firstName} 👨‍🏫
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
              Administra tus materias, horarios y solicitudes de asesoría.
            </p>
          </div>

          <div ref={materiasRef} style={{ scrollMarginTop: "100px" }}>
            <SelectMateriasAsesor />
          </div>

          <div ref={horariosRef} style={{ scrollMarginTop: "100px" }}>
            <RegisterAvailabilityForm
              onCreated={() => setAvailabilityReload((prev) => prev + 1)}
            />
          </div>

          <div ref={solicitudesRef} style={{ marginBottom: 24, scrollMarginTop: "100px" }}>
            <AsesorOwnAvailability reloadKey={availabilityReload} />
          </div>

         
<div ref={citasRef} style={{ scrollMarginTop: "100px" }}>
  <AsesorSessionsList reloadKey={availabilityReload} />
</div>

<div ref={calificacionesRef} style={{ scrollMarginTop: "100px" }}>
  <AsesorRatingsList />
</div>



        </div>
      </main>

      {showToast && <Toast message={toastMsg} />}
    </div>
  );
}
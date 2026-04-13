import { useRef, useState } from "react";
import {
  BookOpen,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import Toast from "../components/Toast";
import SearchAsesores from "../components/SearchAsesores";
import AsesorAvailability from "../components/AsesorAvailability";
import AlumnoSessionsList from "../components/AlumnoSessionsList";
import { alumnoNavItems } from "../data/dashboardData";
import AsesorProfile from "../components/AsesorProfile";
import NotificationsPanel from "../components/NotificationsPanel";

interface LoggedUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

interface AlumnoDashboardProps {
  goLogout: () => void;
  user: LoggedUser;
}

export default function AlumnoDashboard({
  goLogout,
  user,
}: AlumnoDashboardProps) {
  const [activeNav, setActiveNav] = useState("inicio");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [selectedAsesor, setSelectedAsesor] = useState<any>(null);

  const inicioRef = useRef<HTMLDivElement | null>(null);
  const buscarRef = useRef<HTMLDivElement | null>(null);
  const citasRef = useRef<HTMLDivElement | null>(null);

  function scrollToSection(sectionId: string) {
    const sections: Record<string, React.RefObject<HTMLDivElement | null>> = {
      inicio: inicioRef,
      buscar: buscarRef,
      citas: citasRef,
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
         <span
  className="syne"
  style={{
    fontSize: 19,
    fontWeight: 800,
    letterSpacing: "-0.03em",
  }}
>
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
            {alumnoNavItems.map((item) => (
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
           <div
  style={{
    color: "rgba(255,255,255,0.55)",
    fontSize: 11.5,
    fontWeight: 600,
    letterSpacing: "0.01em",
  }}
>
  Alumno
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

        <div className="dash-content content-narrow">
          <div ref={inicioRef} className="greeting anim-fade-up">
           <h1
  style={{
    fontFamily: "'Outfit', sans-serif",
    fontSize: 40,
    fontWeight: 700,
    marginBottom: 6,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  }}
>
  Hola, {firstName} 👋
</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
              Busca asesores por materia, revisa horarios y administra tus solicitudes.
            </p>
          </div>

          <div ref={buscarRef} style={{ marginBottom: 24, scrollMarginTop: "100px" }}>
            <SearchAsesores onSelectAsesor={(asesor) => setSelectedAsesor(asesor)} />
          </div>

          <AsesorProfile asesor={selectedAsesor} />
          <AsesorAvailability asesor={selectedAsesor} />

          <div ref={citasRef} style={{ scrollMarginTop: "100px" }}>
            <AlumnoSessionsList />
          </div>
        </div>
      </main>

      {showToast && <Toast message={toastMsg} />}
    </div>
  );
}
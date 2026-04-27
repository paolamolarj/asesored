import { useRef, useState, useEffect } from "react";
import { BookOpen, LogOut, X, Menu } from "lucide-react";
import { alumnoNavItems } from "../data/dashboardData";
import SearchAsesores from "../components/SearchAsesores";
import AsesorAvailability from "../components/AsesorAvailability";
import AlumnoSessionsList from "../components/AlumnoSessionsList";
import AsesorProfile from "../components/AsesorProfile";
import NotificationsPanel from "../components/NotificationsPanel";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import { useTheme } from "../hooks/useTheme";
import PerfilPanel from "../components/PerfilPanel";

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

export default function AlumnoDashboard({ goLogout, user }: AlumnoDashboardProps) {
  const [activeNav, setActiveNav] = useState("inicio");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedAsesor, setSelectedAsesor] = useState<any>(null);
  const { toasts, showToast, removeToast } = useToast();
  const { isDark, toggleTheme } = useTheme();

  const inicioRef = useRef<HTMLDivElement | null>(null);
  const buscarRef = useRef<HTMLDivElement | null>(null);
  const citasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sectionRefs = [
      { id: "inicio", ref: inicioRef },
      { id: "buscar", ref: buscarRef },
      { id: "citas", ref: citasRef },
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const matched = sectionRefs.find((s) => s.ref.current === entry.target);
            if (matched) setActiveNav(matched.id);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -80% 0px", threshold: 0 }
    );
    sectionRefs.forEach(({ ref }) => { if (ref.current) observer.observe(ref.current); });
    return () => observer.disconnect();
  }, []);

  function scrollToSection(sectionId: string) {
    const sections: Record<string, React.RefObject<HTMLDivElement | null>> = {
      inicio: inicioRef,
      buscar: buscarRef,
      citas: citasRef,
    };
    sections[sectionId]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleNavClick(id: string) {
    setActiveNav(id);
    setMobileOpen(false);
    scrollToSection(id);
  }

  function handleLogout() {
    localStorage.removeItem("asesored_user");
    goLogout();
  }

  const fullName = user?.nombre && user?.apellido ? `${user.nombre} ${user.apellido}` : "Usuario";
  const firstName = user?.nombre || "Usuario";
  const initials = user?.nombre && user?.apellido
    ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()
    : "US";

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
            <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text-primary)" }}>
              {fullName}
            </div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11.5, fontWeight: 600 }}>
              Alumno
            </div>
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
            <NotificationsPanel />
            <PerfilPanel initials={initials} />
          </div>
        </div>

        <div className="dash-content content-narrow">

          {/* Inicio — ref envuelve greeting + buscador para que tenga altura suficiente */}
          <div ref={inicioRef} style={{ scrollMarginTop: "64px" }}>
            <div className="greeting anim-fade-up" style={{ marginBottom: 24 }}>
              <h1 className="page-hero-title">Hola, {firstName} 👋</h1>
              <p className="page-hero-subtitle">
                Encuentra asesores académicos, revisa horarios disponibles y da seguimiento a tus solicitudes.
              </p>
            </div>
            <SearchAsesores onSelectAsesor={(asesor) => setSelectedAsesor(asesor)} />
          </div>

          {/* Buscar — perfil y disponibilidad del asesor seleccionado */}
          <div ref={buscarRef} style={{ scrollMarginTop: "64px" }}>
            <AsesorProfile asesor={selectedAsesor} />
            <AsesorAvailability
              asesor={selectedAsesor}
              onSolicitudEnviada={() => showToast("Solicitud enviada correctamente.", "success")}
            />
          </div>

          {/* Citas */}
          <div ref={citasRef} style={{ scrollMarginTop: "64px" }}>
            <AlumnoSessionsList showToast={showToast} />
          </div>

        </div>
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
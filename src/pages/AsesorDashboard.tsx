import { useRef, useState, useEffect } from "react";
import { BookOpen, LogOut, X, Menu } from "lucide-react";
import SelectMateriasAsesor from "../components/SelectMateriasAsesor";
import RegisterAvailabilityForm from "../components/RegisterAvailabilityForm";
import AsesorOwnAvailability from "../components/AsesorOwnAvailability";
import AsesorSessionsList from "../components/AsesorSessionsList";
import { asesorNavItems } from "../data/dashboardData";
import AsesorRatingsList from "../components/AsesorRatingsList";
import NotificationsPanel from "../components/NotificationsPanel";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../hooks/useToast";
import { useTheme } from "../hooks/useTheme";

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

export default function AsesorDashboard({ goLogout, user }: AsesorDashboardProps) {
  const [activeNav, setActiveNav] = useState("inicio");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [availabilityReload, setAvailabilityReload] = useState(0);
  const { toasts, showToast, removeToast } = useToast();
  const { isDark, toggleTheme } = useTheme();

  const inicioRef = useRef<HTMLDivElement | null>(null);
  const materiasRef = useRef<HTMLDivElement | null>(null);
  const horariosRef = useRef<HTMLDivElement | null>(null);
  const solicitudesRef = useRef<HTMLDivElement | null>(null);
  const citasRef = useRef<HTMLDivElement | null>(null);
  const calificacionesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sectionRefs: { id: string; ref: React.RefObject<HTMLDivElement | null> }[] = [
      { id: "inicio", ref: inicioRef },
      { id: "materias", ref: materiasRef },
      { id: "horarios", ref: horariosRef },
      { id: "solicitudes", ref: solicitudesRef },
      { id: "citas", ref: citasRef },
      { id: "calificaciones", ref: calificacionesRef },
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
      { root: null, rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    sectionRefs.forEach(({ ref }) => { if (ref.current) observer.observe(ref.current); });
    return () => observer.disconnect();
  }, []);

  function scrollToSection(sectionId: string) {
    const sections: Record<string, React.RefObject<HTMLDivElement | null>> = {
      inicio: inicioRef,
      materias: materiasRef,
      horarios: horariosRef,
      solicitudes: solicitudesRef,
      citas: citasRef,
      calificaciones: calificacionesRef,
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
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.01em" }}>
              Asesor
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
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#4f46e5,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              {initials}
            </div>
          </div>
        </div>

        <div className="dash-content content-narrow">
          <div ref={inicioRef} className="greeting anim-fade-up">
            <h1 className="page-hero-title">Hola, {firstName} 👨‍🏫</h1>
            <p className="page-hero-subtitle">
              Administra tus materias, disponibilidad y solicitudes de asesoría académica.
            </p>
          </div>

          <div ref={materiasRef} style={{ scrollMarginTop: "100px" }}>
            <SelectMateriasAsesor
              onSaved={() => showToast("Materias guardadas correctamente.", "success")}
            />
          </div>

          <div ref={horariosRef} style={{ scrollMarginTop: "100px" }}>
            <RegisterAvailabilityForm
              onCreated={() => {
                setAvailabilityReload((prev) => prev + 1);
                showToast("Horario registrado correctamente.", "success");
              }}
            />
          </div>

          <div ref={solicitudesRef} style={{ marginBottom: 24, scrollMarginTop: "100px" }}>
            <AsesorOwnAvailability reloadKey={availabilityReload} showToast={showToast} />
          </div>

          <div ref={citasRef} style={{ scrollMarginTop: "100px" }}>
            <AsesorSessionsList reloadKey={availabilityReload} showToast={showToast} />
          </div>

          <div ref={calificacionesRef} style={{ scrollMarginTop: "100px" }}>
            <AsesorRatingsList />
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
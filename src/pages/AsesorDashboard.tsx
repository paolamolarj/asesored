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
import PerfilPanel from "../components/PerfilPanel";
import { useToast } from "../hooks/useToast";
import { useTheme } from "../hooks/useTheme";
import AsesorStats from "../components/AsesorStats";

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
  const mainRef = useRef<HTMLElement | null>(null);

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
    { root: null, rootMargin: "0px 0px -80% 0px", threshold: 0 }
  );

  sectionRefs.forEach(({ ref }) => { if (ref.current) observer.observe(ref.current); });

  // Fix última sección
  function handleScroll() {
    const el = mainRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      setActiveNav("calificaciones");
    }
  }

  const mainEl = mainRef.current;
  mainEl?.addEventListener("scroll", handleScroll);

  return () => {
    observer.disconnect();
    mainEl?.removeEventListener("scroll", handleScroll);
  };
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
            <div className="sidebar-user-rol">Asesor</div>
          </div>
        </div>
      </aside>

      <div className={`overlay${mobileOpen ? " visible" : ""}`} onClick={() => setMobileOpen(false)} />

      <main ref={mainRef} className="dash-main">

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

  {/* INICIO */}
  <div ref={inicioRef} style={{ scrollMarginTop: "64px", minHeight: "40vh", display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: 32 }}>
    <div className="greeting anim-fade-up">
      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--teal)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
        Panel de asesor 👨‍🏫
      </p>
      <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: 16 }}>
        Hola, {firstName}
      </h1>
      <p className="page-hero-subtitle" style={{ fontSize: 16, marginBottom: 32 }}>
        Administra tus materias, disponibilidad y solicitudes de asesoría académica.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { icon: "📚", label: "Mis materias", desc: "Gestionar materias", action: () => handleNavClick("materias") },
          { icon: "🕒", label: "Mis horarios", desc: "Ver disponibilidad", action: () => handleNavClick("horarios") },
          { icon: "📋", label: "Solicitudes", desc: "Revisar pendientes", action: () => handleNavClick("solicitudes") },
          { icon: "⭐", label: "Calificaciones", desc: "Ver reseñas", action: () => handleNavClick("calificaciones") },
        ].map((item) => (
          <button key={item.label} onClick={item.action} className="quick-action-btn">
  <span style={{ fontSize: 24 }}>{item.icon}</span>
  <div>
    <div className="quick-action-btn-label">{item.label}</div>
    <div className="quick-action-btn-desc">{item.desc}</div>
  </div>
</button>
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
  <AsesorStats />
</div>
    </div>
  </div>

  {/* MATERIAS */}
  <div ref={materiasRef} style={{ scrollMarginTop: "64px", paddingTop: 16, paddingBottom: 16 }}>
    <div style={{ marginBottom: 20 }}>
      <p className="section-eyebrow">Configuración</p>
      <h2 className="section-heading">Mis materias</h2>
    </div>
    <SelectMateriasAsesor
      onSaved={() => showToast("Materias guardadas correctamente.", "success")}
    />
  </div>

  {/* HORARIOS */}
  <div ref={horariosRef} style={{ scrollMarginTop: "64px", paddingTop: 16, paddingBottom: 16 }}>
    <div style={{ marginBottom: 20 }}>
      <p className="section-eyebrow">Disponibilidad</p>
      <h2 className="section-heading">Registrar horario</h2>
    </div>
    <RegisterAvailabilityForm
      onCreated={() => {
        setAvailabilityReload((prev) => prev + 1);
        
      }}
    />
  </div>

  {/* SOLICITUDES */}
  <div ref={solicitudesRef} style={{ scrollMarginTop: "64px", paddingTop: 16, paddingBottom: 16 }}>
    <div style={{ marginBottom: 20 }}>
      <p className="section-eyebrow">Gestión</p>
      <h2 className="section-heading">Mis horarios disponibles</h2>
    </div>
    <AsesorOwnAvailability reloadKey={availabilityReload} showToast={showToast} />
  </div>

  {/* CITAS */}
  <div ref={citasRef} style={{ scrollMarginTop: "64px", paddingTop: 16, paddingBottom: 16 }}>
    <div style={{ marginBottom: 20 }}>
      <p className="section-eyebrow">Seguimiento</p>
      <h2 className="section-heading">Solicitudes y asesorías</h2>
    </div>
    <AsesorSessionsList reloadKey={availabilityReload} showToast={showToast} />
  </div>

  {/* CALIFICACIONES */}
<div ref={calificacionesRef} style={{ scrollMarginTop: "64px", paddingTop: 16, paddingBottom: 300 }}>    <div style={{ marginBottom: 20 }}>
      <p className="section-eyebrow">Retroalimentación</p>
      <h2 className="section-heading">Mis calificaciones</h2>
    </div>
    <AsesorRatingsList />
  </div>

</div>
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
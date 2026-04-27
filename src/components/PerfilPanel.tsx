// components/PerfilPanel.tsx
import { useEffect, useState, useRef } from "react";
import { User, Mail, Phone, BookOpen, GraduationCap, Hash, Calendar } from "lucide-react";

interface LoggedUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

interface Perfil {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  telefono: string;
  carrera: string;
  semestre: number;
  rol: string;
  created_at: string;
}

interface PerfilPanelProps {
  initials: string;
}

export default function PerfilPanel({ initials }: PerfilPanelProps) {
  const [open, setOpen] = useState(false);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const savedUser = localStorage.getItem("asesored_user");
  const user: LoggedUser | null = savedUser ? JSON.parse(savedUser) : null;

  // Cierra al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchPerfil() {
    if (!user?.id || perfil) return; // no re-fetcha si ya tiene datos
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost/asesored-api/obtener_perfil.php?usuario_id=${user.id}`
      );
      const data = await res.json();
      if (data.success) {
        setPerfil(data.usuario);
      } else {
        setError(data.message || "No se pudo cargar el perfil.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  function handleToggle() {
    setOpen((prev) => !prev);
    if (!open) fetchPerfil();
  }

  function formatFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric", month: "long", day: "numeric",
    });
  }

  const campos = perfil ? [
    { icon: Hash, label: "Matrícula", value: perfil.matricula || "—" },
    { icon: Mail, label: "Correo", value: perfil.email || "—" },
    { icon: Phone, label: "Teléfono", value: perfil.telefono || "—" },
    { icon: GraduationCap, label: "Carrera", value: perfil.carrera || "—" },
    { icon: BookOpen, label: "Semestre", value: perfil.semestre ? `${perfil.semestre}°` : "—" },
    { icon: Calendar, label: "Miembro desde", value: formatFecha(perfil.created_at) },
  ] : [];

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      {/* Botón de iniciales */}
      <div
        onClick={handleToggle}
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
          border: open ? "2px solid rgba(124,58,237,0.6)" : "2px solid transparent",
          transition: "border 0.18s ease",
          color: "#fff",
        }}
      >
        {initials}
      </div>

      {/* Panel */}
      {open && (
        <div style={{
          position: "absolute",
          top: 50,
          right: 0,
          width: 320,
          background: "linear-gradient(180deg, rgba(17,24,39,0.98) 0%, rgba(15,23,42,0.98) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          boxShadow: "0 24px 60px rgba(0,0,0,0.40)",
          zIndex: 300,
          padding: 16,
          backdropFilter: "blur(16px)",
          animation: "slideUp 0.2s ease",
        }}>

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 14, padding: "12px 0" }}>
              <div className="spinner" /> Cargando perfil...
            </div>
          )}

          {error && <div className="error-msg">{error}</div>}

          {perfil && (
            <>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#fff",
                  flexShrink: 0,
                  boxShadow: "0 8px 20px rgba(124,58,237,0.25)",
                }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                    {perfil.nombre} {perfil.apellido}
                  </div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 999,
                    background: "rgba(37,99,235,0.12)",
                    border: "1px solid rgba(37,99,235,0.22)",
                    color: "#93C5FD",
                    textTransform: "capitalize",
                    marginTop: 4,
                    display: "inline-block",
                  }}>
                    {perfil.rol}
                  </span>
                </div>
              </div>

              {/* Campos */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {campos.map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10,
                  }}>
                    <div style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: "rgba(37,99,235,0.10)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon size={14} color="#93C5FD" />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {label}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginTop: 1 }}>
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
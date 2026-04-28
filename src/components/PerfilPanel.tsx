import { useEffect, useState, useRef } from "react";
import { Mail, Phone, BookOpen, GraduationCap, Hash, Calendar } from "lucide-react";

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
    if (!user?.id || perfil) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost/asesored-api/obtener_perfil.php?usuario_id=${user.id}`);
      const data = await res.json();
      if (data.success) setPerfil(data.usuario);
      else setError(data.message || "No se pudo cargar el perfil.");
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
      <div onClick={handleToggle} className="perfil-trigger">
        {initials}
      </div>

      {open && (
        <div className="perfil-panel">
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 14, padding: "12px 0" }}>
              <div className="spinner" /> Cargando perfil...
            </div>
          )}

          {error && <div className="error-msg">{error}</div>}

          {perfil && (
            <>
              <div className="perfil-panel-header">
                <div className="perfil-panel-avatar">{initials}</div>
                <div>
                  <div className="perfil-panel-name">
                    {perfil.nombre} {perfil.apellido}
                  </div>
                  <span className="perfil-panel-rol">{perfil.rol}</span>
                </div>
              </div>

              <div className="perfil-campos">
                {campos.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="perfil-campo">
                    <div className="perfil-campo-icon">
                      <Icon size={14} color="#93C5FD" />
                    </div>
                    <div>
                      <div className="perfil-campo-label">{label}</div>
                      <div className="perfil-campo-value">{value}</div>
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
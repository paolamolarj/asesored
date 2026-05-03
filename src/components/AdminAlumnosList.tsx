import { useEffect, useState, useMemo } from "react";

interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  matricula: string;
  carrera: string;
  semestre: number;
  created_at: string;
  total_asesorias: number;
  completadas: number;
  pendientes: number;
}

interface AdminAlumnosListProps {
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function AdminAlumnosList({ showToast }: AdminAlumnosListProps) {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCa, setFiltroCa] = useState("todas");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAlumnos() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost/asesored-api/obtener_alumnos_admin.php");
        const data = await res.json();
        if (data.success) setAlumnos(data.alumnos);
        else showToast(data.message || "No se pudieron cargar los alumnos.", "error");
      } catch {
        showToast("No se pudo conectar con el servidor.", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchAlumnos();
  }, []);

  function formatFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric", month: "short", day: "numeric",
    });
  }

  // Carreras únicas para filtro
  const carrerasUnicas = useMemo(() => {
    return [...new Set(alumnos.map((a) => a.carrera).filter(Boolean))].sort();
  }, [alumnos]);

  const alumnosFiltrados = useMemo(() => {
    return alumnos.filter((a) => {
      const q = busqueda.toLowerCase();
      const matchBusqueda = !busqueda || 
        `${a.nombre} ${a.apellido}`.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.matricula?.toLowerCase().includes(q);
      const matchCarrera = filtroCa === "todas" || a.carrera === filtroCa;
      return matchBusqueda && matchCarrera;
    });
  }, [alumnos, busqueda, filtroCa]);

  return (
    <div className="section-card" style={{ marginBottom: 24 }}>
      <div className="section-header">
        <span className="section-title">Alumnos registrados</span>
        <span style={{
          fontSize: 12, fontWeight: 700, color: "var(--text-muted)",
          background: "rgba(255,255,255,0.06)", padding: "4px 10px",
          borderRadius: 999, border: "1px solid var(--border)",
        }}>
          {alumnos.length} alumnos
        </span>
      </div>

      <div className="section-body">

        {/* Filtros */}
        {alumnos.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 180 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Buscar alumno
              </label>
              <input
                className="field"
                style={{ height: 36, padding: "0 12px", fontSize: 13 }}
                placeholder="Nombre, email o matrícula..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {carrerasUnicas.length > 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 200 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Carrera
                </label>
                <select
                  className="field field-select"
                  style={{ height: 36, padding: "0 32px 0 12px", fontSize: 13 }}
                  value={filtroCa}
                  onChange={(e) => setFiltroCa(e.target.value)}
                >
                  <option value="todas">Todas</option>
                  {carrerasUnicas.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 14 }}>
            <div className="spinner" /> Cargando alumnos...
          </div>
        )}

        {!loading && alumnosFiltrados.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">👨‍🎓</div>
            <div>
              <div className="empty-state-title">
                {busqueda || filtroCa !== "todas" ? "Sin coincidencias" : "No hay alumnos registrados"}
              </div>
              <div className="empty-state-text">
                {busqueda || filtroCa !== "todas" ? "Intenta con otros términos de búsqueda." : "Cuando los alumnos se registren, aparecerán aquí."}
              </div>
            </div>
          </div>
        )}

        {!loading && alumnosFiltrados.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alumnosFiltrados.map((a) => (
              <div key={a.id} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                overflow: "hidden",
                transition: "border-color 0.18s ease",
              }}>
                {/* Fila principal */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}
                  onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 11,
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0,
                  }}>
                    {a.nombre.charAt(0)}{a.apellido.charAt(0)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
                      {a.nombre} {a.apellido}
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: 12.5 }}>
                      {a.email} {a.matricula ? `· ${a.matricula}` : ""}
                    </div>
                  </div>

                  {/* Stats rápidas */}
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999,
                      background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.22)",
                      color: "#93C5FD",
                    }}>
                      {a.total_asesorias} asesorías
                    </span>
                    <span style={{
                      fontSize: 18, color: "var(--text-muted)",
                      transform: expandedId === a.id ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      display: "inline-block",
                    }}>
                      ▾
                    </span>
                  </div>
                </div>

                {/* Panel expandido */}
                {expandedId === a.id && (
                  <div style={{
                    borderTop: "1px solid var(--border)",
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.02)",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 12,
                  }}>
                    {[
                      { label: "Carrera", value: a.carrera || "—" },
                      { label: "Semestre", value: a.semestre ? `${a.semestre}°` : "—" },
                      { label: "Matrícula", value: a.matricula || "—" },
                      { label: "Registro", value: formatFecha(a.created_at) },
                      { label: "Completadas", value: a.completadas ?? 0 },
                      { label: "Pendientes", value: a.pendientes ?? 0 },
                    ].map(({ label, value }) => (
                      <div key={label} style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        padding: "10px 12px",
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                          {label}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
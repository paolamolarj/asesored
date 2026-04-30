import { useEffect, useState } from "react";

interface LoggedUser {
  id?: number;
}

interface Stats {
  total: number;
  completadas: number;
  pendientes: number;
  promedio_calificacion: string | number;
  total_calificaciones: number;
  materia_top: string;
  alumnos_unicos: number;
  por_mes: { mes: string; total: number }[];
}

export default function AsesorStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("asesored_user");
  const user: LoggedUser | null = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    async function fetchStats() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost/asesored-api/obtener_stats_asesor.php?asesor_id=${user.id}`);
        const data = await res.json();
        if (data.success) setStats(data.stats);
        else setError(data.message || "No se pudieron cargar las estadísticas.");
      } catch {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [user?.id]);

  function formatMes(mes: string) {
    const [year, month] = mes.split("-");
    const fecha = new Date(Number(year), Number(month) - 1);
    return fecha.toLocaleDateString("es-MX", { month: "short", year: "numeric" });
  }

  const maxMes = stats ? Math.max(...stats.por_mes.map((m) => m.total), 1) : 1;

  const statCards = stats ? [
    { icon: "📋", label: "Total asesorías", value: stats.total, color: "#3B82F6", bg: "rgba(59,130,246,0.10)", border: "rgba(59,130,246,0.20)" },
    { icon: "✅", label: "Completadas", value: stats.completadas, color: "#34D399", bg: "rgba(52,211,153,0.10)", border: "rgba(52,211,153,0.20)" },
    { icon: "⏳", label: "Pendientes", value: stats.pendientes, color: "#FBBF24", bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.20)" },
    { icon: "⭐", label: "Calificación", value: stats.promedio_calificacion !== "—" ? `${stats.promedio_calificacion}/5` : "—", color: "#F59E0B", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.20)" },
    { icon: "👨‍🎓", label: "Alumnos atendidos", value: stats.alumnos_unicos, color: "#A78BFA", bg: "rgba(167,139,250,0.10)", border: "rgba(167,139,250,0.20)" },
    { icon: "📚", label: "Materia top", value: stats.materia_top, color: "#60A5FA", bg: "rgba(96,165,250,0.10)", border: "rgba(96,165,250,0.20)" },
  ] : [];

  return (
    <div className="section-card" style={{ marginBottom: 24 }}>
      <div className="section-header">
        <span className="section-title">Mis estadísticas</span>
      </div>

      <div className="section-body">
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 14 }}>
            <div className="spinner" /> Cargando estadísticas...
          </div>
        )}
        {error && <div className="error-msg">{error}</div>}

        {stats && (
          <>
            {/* Stat cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 12,
              marginBottom: 28,
            }}>
              {statCards.map(({ icon, label, value, color, bg, border }) => (
                <div key={label} style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}>
                  <div style={{ fontSize: 22 }}>{icon}</div>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 24,
                    fontWeight: 800,
                    color,
                    lineHeight: 1,
                  }}>
                    {value}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Gráfica de barras por mes */}
            {stats.por_mes.length > 0 && (
              <>
                <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 16,
                }}>
                  Actividad últimos 6 meses
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                  {stats.por_mes.map((m) => {
                    const pct = Math.round((m.total / maxMes) * 100);
                    return (
                      <div key={m.mes} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                        <div style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--text-muted)",
                        }}>
                          {m.total}
                        </div>
                        <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                          <div style={{
                            width: "100%",
                            height: `${Math.max(pct, 8)}%`,
                            background: "linear-gradient(180deg, #3B82F6, #1D4ED8)",
                            borderRadius: "6px 6px 0 0",
                            transition: "height 0.5s ease",
                            minHeight: 8,
                          }} />
                        </div>
                        <div style={{
                          fontSize: 10,
                          color: "var(--text-muted)",
                          fontWeight: 600,
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}>
                          {formatMes(m.mes)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Porcentaje de completadas */}
                {stats.total > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
                      <span>Tasa de completadas</span>
                      <span style={{ color: "#34D399" }}>
                        {Math.round((stats.completadas / stats.total) * 100)}%
                      </span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.round((stats.completadas / stats.total) * 100)}%`,
                          background: "linear-gradient(90deg, #34D399, #059669)",
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {stats.por_mes.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <div>
                  <div className="empty-state-title">Sin actividad reciente</div>
                  <div className="empty-state-text">Cuando tengas asesorías registradas, aparecerá tu actividad mensual aquí.</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
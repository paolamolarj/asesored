import { useEffect, useState } from "react";

interface Stats {
  total_asesorias: number;
  completadas: number;
  pendientes: number;
  confirmadas: number;
  canceladas: number;
  asesores_activos: number;
  total_asesores: number;
  total_alumnos: number;
  materia_top: string;
  promedio_global: string | number;
  asesor_top: string;
  por_mes: { mes: string; total: number }[];
  top_materias: { materia: string; total: number }[];
}

export default function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost/asesored-api/obtener_stats_admin.php");
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
  }, []);

  function formatMes(mes: string) {
    const [year, month] = mes.split("-");
    return new Date(Number(year), Number(month) - 1).toLocaleDateString("es-MX", {
      month: "short", year: "numeric",
    });
  }

  const maxMes = stats ? Math.max(...stats.por_mes.map((m) => m.total), 1) : 1;
  const maxMateria = stats ? Math.max(...stats.top_materias.map((m) => m.total), 1) : 1;

  const statCards = stats ? [
    { icon: "📋", label: "Total asesorías", value: stats.total_asesorias, color: "#3B82F6", bg: "rgba(59,130,246,0.10)", border: "rgba(59,130,246,0.20)" },
    { icon: "✅", label: "Completadas", value: stats.completadas, color: "#34D399", bg: "rgba(52,211,153,0.10)", border: "rgba(52,211,153,0.20)" },
    { icon: "⏳", label: "Pendientes", value: stats.pendientes, color: "#FBBF24", bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.20)" },
    { icon: "👨‍🏫", label: "Asesores activos", value: `${stats.asesores_activos}/${stats.total_asesores}`, color: "#A78BFA", bg: "rgba(167,139,250,0.10)", border: "rgba(167,139,250,0.20)" },
    { icon: "👨‍🎓", label: "Alumnos registrados", value: stats.total_alumnos, color: "#60A5FA", bg: "rgba(96,165,250,0.10)", border: "rgba(96,165,250,0.20)" },
    { icon: "⭐", label: "Calificación global", value: stats.promedio_global !== "—" ? `${stats.promedio_global}/5` : "—", color: "#F59E0B", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.20)" },
    { icon: "🏆", label: "Asesor más activo", value: stats.asesor_top, color: "#34D399", bg: "rgba(52,211,153,0.10)", border: "rgba(52,211,153,0.20)" },
    { icon: "📚", label: "Materia más solicitada", value: stats.materia_top, color: "#F472B6", bg: "rgba(244,114,182,0.10)", border: "rgba(244,114,182,0.20)" },
  ] : [];

  return (
    <div className="section-card" style={{ marginBottom: 24 }}>
      <div className="section-header">
        <span className="section-title">Estadísticas generales</span>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 28 }}>
              {statCards.map(({ icon, label, value, color, bg, border }) => (
                <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontSize: 22 }}>{icon}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>
                    {value}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Distribución por estado */}
            {stats.total_asesorias > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
                  Distribución por estado
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Completadas", value: stats.completadas, color: "#34D399" },
                    { label: "Confirmadas", value: stats.confirmadas, color: "#3B82F6" },
                    { label: "Pendientes", value: stats.pendientes, color: "#FBBF24" },
                    { label: "Canceladas", value: stats.canceladas, color: "#F87171" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13, fontWeight: 600 }}>
                        <span style={{ color: "var(--text-muted)" }}>{label}</span>
                        <span style={{ color }}>
                          {value} ({stats.total_asesorias > 0 ? Math.round((value / stats.total_asesorias) * 100) : 0}%)
                        </span>
                      </div>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" style={{
                          width: `${stats.total_asesorias > 0 ? Math.round((value / stats.total_asesorias) * 100) : 0}%`,
                          background: color,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top materias */}
            {stats.top_materias.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
                  Top materias solicitadas
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {stats.top_materias.map(({ materia, total }, i) => (
                    <div key={materia}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13, fontWeight: 600 }}>
                        <span style={{ color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 16 }}>{["🥇", "🥈", "🥉"][i]}</span>
                          {materia}
                        </span>
                        <span style={{ color: "var(--text-muted)" }}>{total} asesorías</span>
                      </div>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" style={{
                          width: `${Math.round((total / maxMateria) * 100)}%`,
                          background: ["linear-gradient(90deg,#F59E0B,#D97706)", "linear-gradient(90deg,#94A3B8,#64748B)", "linear-gradient(90deg,#B45309,#92400E)"][i],
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gráfica de actividad por mes */}
            {stats.por_mes.length > 0 && (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
                  Actividad últimos 6 meses
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                  {stats.por_mes.map((m) => {
                    const pct = Math.round((m.total / maxMes) * 100);
                    return (
                      <div key={m.mes} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>{m.total}</div>
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
                        <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textAlign: "center", whiteSpace: "nowrap" }}>
                          {formatMes(m.mes)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {stats.por_mes.length === 0 && stats.total_asesorias === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <div>
                  <div className="empty-state-title">Sin datos aún</div>
                  <div className="empty-state-text">Las estadísticas aparecerán cuando haya actividad en el sistema.</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
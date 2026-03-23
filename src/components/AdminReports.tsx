import { useEffect, useState } from "react";

interface Resumen {
  total_asesorias: number;
  pendientes: number;
  confirmadas: number;
  completadas: number;
  canceladas: number;
  asesores_activos: number;
}

interface SemanaRow {
  semana_id: string;
  inicio_semana: string;
  total: string | number;
}

interface TopAsesor {
  id: number;
  nombre: string;
  apellido: string;
  total_asesorias: string | number;
  completadas: string | number;
}

export default function AdminReports() {
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [porSemana, setPorSemana] = useState<SemanaRow[]>([]);
  const [topAsesores, setTopAsesores] = useState<TopAsesor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReportes() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("http://localhost/asesored-api/obtener_reportes_admin.php");
        const data = await response.json();

        if (data.success) {
          setResumen(data.resumen);
          setPorSemana(data.por_semana || []);
          setTopAsesores(data.top_asesores || []);
        } else {
          setError(data.message || "No se pudieron cargar los reportes.");
        }
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    }

    fetchReportes();
  }, []);

  function formatFecha(fecha: string) {
    const d = new Date(fecha + "T00:00:00");
    return d.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="section-card" style={{ marginBottom: 24 }}>
      <div className="section-header">
        <span className="section-title">Reportes del sistema</span>
      </div>

      <div className="section-body">
        {loading && <div className="success-msg">Cargando reportes...</div>}
        {error && <div className="error-msg">{error}</div>}

        {!loading && !error && resumen && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div className="stat-card teal">
                <div className="stat-value">{resumen.total_asesorias}</div>
                <div className="stat-label">Total de asesorías</div>
              </div>

              <div className="stat-card amber">
                <div className="stat-value">{resumen.pendientes}</div>
                <div className="stat-label">Pendientes</div>
              </div>

              <div className="stat-card purple">
                <div className="stat-value">{resumen.confirmadas}</div>
                <div className="stat-label">Confirmadas</div>
              </div>

              <div className="stat-card teal">
                <div className="stat-value">{resumen.completadas}</div>
                <div className="stat-label">Completadas</div>
              </div>

              <div className="stat-card rose">
                <div className="stat-value">{resumen.canceladas}</div>
                <div className="stat-label">Canceladas</div>
              </div>

              <div className="stat-card purple">
                <div className="stat-value">{resumen.asesores_activos}</div>
                <div className="stat-label">Asesores activos</div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 700 }}>
                Asesorías por semana
              </h3>

              {porSemana.length === 0 ? (
                <div className="error-msg">Aún no hay datos semanales.</div>
              ) : (
                <div className="asesor-list">
                  {porSemana.map((semana) => (
                    <div key={semana.semana_id} className="asesor-item">
                      <div className="asesor-avatar" style={{ background: "rgba(255,255,255,.08)" }}>
                        📊
                      </div>

                      <div className="asesor-info">
                        <div className="asesor-name">Semana {semana.semana_id}</div>
                        <div className="asesor-subject">
                          Inicio: {formatFecha(semana.inicio_semana)}
                        </div>
                      </div>

                      <div className="asesor-rating">
                        {semana.total} asesoría{Number(semana.total) !== 1 ? "s" : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 700 }}>
                Asesores más activos
              </h3>

              {topAsesores.length === 0 ? (
                <div className="error-msg">Aún no hay asesores con actividad.</div>
              ) : (
                <div className="asesor-list">
                  {topAsesores.map((asesor) => (
                    <div key={asesor.id} className="asesor-item">
                      <div className="asesor-avatar" style={{ background: "rgba(255,255,255,.08)" }}>
                        👨‍🏫
                      </div>

                      <div className="asesor-info">
                        <div className="asesor-name">
                          {asesor.nombre} {asesor.apellido}
                        </div>
                        <div className="asesor-subject">
                          Completadas: {asesor.completadas}
                        </div>
                      </div>

                      <div className="asesor-rating">
                        {asesor.total_asesorias} total
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
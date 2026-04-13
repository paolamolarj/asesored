import { useEffect, useState } from "react";

interface LoggedUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

interface Calificacion {
  id: number;
  puntuacion: number;
  comentario: string;
  created_at: string;
  materia: string;
  alumno_nombre: string;
  alumno_apellido: string;
}

interface Stats {
  total_calificaciones: number;
  promedio: number;
}

export default function AsesorRatingsList() {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_calificaciones: 0,
    promedio: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("asesored_user");
  const user: LoggedUser | null = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    async function fetchCalificaciones() {
      if (!user?.id) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost/asesored-api/obtener_calificaciones_asesor.php?asesor_id=${user.id}`
        );

        const data = await response.json();

        if (data.success) {
          setStats(data.stats);
          setCalificaciones(data.calificaciones);
        } else {
          setError(data.message || "No se pudieron cargar las calificaciones.");
        }
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    }

    fetchCalificaciones();
  }, [user?.id]);

  function renderStars(puntuacion: number) {
    return "★".repeat(puntuacion) + "☆".repeat(5 - puntuacion);
  }

  function formatFecha(fecha: string) {
    const d = new Date(fecha);
    return d.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="section-card" style={{ marginBottom: 24 }}>
      <div className="section-header">
        <span className="section-title">Calificaciones recibidas</span>
      </div>

      <div className="section-body">
        {loading && <div className="success-msg">Cargando calificaciones...</div>}
        {error && <div className="error-msg">{error}</div>}

        {!loading && !error && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div className="stat-card teal">
                <div className="stat-value">{stats.promedio || 0}</div>
                <div className="stat-label">Promedio general</div>
              </div>

              <div className="stat-card purple">
                <div className="stat-value">{stats.total_calificaciones}</div>
                <div className="stat-label">Total de calificaciones</div>
              </div>
            </div>

            {calificaciones.length === 0 ? (
              <div className="empty-state">
  <div className="empty-state-icon">⭐</div>
  <div>
    <div className="empty-state-title">Sin calificaciones todavía</div>
    <div className="empty-state-text">
      Cuando los alumnos califiquen asesorías completadas, aquí podrás ver el promedio y los comentarios.
    </div>
  </div>
</div>
            ) : (
              <div className="asesor-list">
                {calificaciones.map((c) => (
                  <div key={c.id} className="asesor-item" style={{ alignItems: "flex-start" }}>
                    <div
                      className="asesor-avatar"
                      style={{ background: "rgba(255,255,255,.08)" }}
                    >
                      ⭐
                    </div>

                    <div className="asesor-info">
                      <div className="asesor-name">
                        {c.alumno_nombre} {c.alumno_apellido}
                      </div>
                      <div className="asesor-subject">{c.materia}</div>

                      <div
                        style={{
                          marginTop: 6,
                          color: "var(--amber)",
                          fontSize: 15,
                          fontWeight: 700,
                        }}
                      >
                        {renderStars(c.puntuacion)} ({c.puntuacion}/5)
                      </div>

                      {c.comentario && (
                        <div
                          style={{
                            marginTop: 8,
                            color: "var(--text-primary)",
                            fontSize: 13.5,
                            lineHeight: 1.5,
                          }}
                        >
                          “{c.comentario}”
                        </div>
                      )}

                      <div
                        style={{
                          marginTop: 8,
                          color: "var(--text-muted)",
                          fontSize: 12,
                        }}
                      >
                        {formatFecha(c.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
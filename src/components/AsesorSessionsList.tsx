import { useEffect, useState } from "react";

interface LoggedUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

interface Asesoria {
  id: number;
  materia: string;
  fecha: string;
  hora: string;
  estado: string;
  notas?: string;
  alumno_nombre: string;
  alumno_apellido: string;
}

interface AsesorSessionsListProps {
  reloadKey?: number;
}

export default function AsesorSessionsList({
  reloadKey = 0,
}: AsesorSessionsListProps) {
  const [asesorias, setAsesorias] = useState<Asesoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const savedUser = localStorage.getItem("asesored_user");
  const user: LoggedUser | null = savedUser ? JSON.parse(savedUser) : null;

  async function fetchAsesorias() {
    if (!user?.id) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost/asesored-api/obtener_asesorias_asesor.php?asesor_id=${user.id}`
      );

      const data = await response.json();

      if (data.success) {
        setAsesorias(data.asesorias);
      } else {
        setError(data.message || "No se pudieron cargar las asesorías.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAsesorias();
  }, [reloadKey, user?.id]);

  async function aceptarAsesoria(asesoriaId: number) {
    if (!user?.id) return;
    setUpdatingId(asesoriaId);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost/asesored-api/aceptar_asesoria.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asesoria_id: asesoriaId,
          asesor_id: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Solicitud aceptada.");
        fetchAsesorias();
      } else {
        setError(data.message || "No se pudo aceptar la solicitud.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function rechazarAsesoria(asesoriaId: number) {
    if (!user?.id) return;
    setUpdatingId(asesoriaId);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost/asesored-api/rechazar_asesoria.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asesoria_id: asesoriaId,
          asesor_id: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Solicitud rechazada.");
        fetchAsesorias();
      } else {
        setError(data.message || "No se pudo rechazar la solicitud.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function marcarCompletada(asesoriaId: number) {
    if (!user?.id) return;

    setUpdatingId(asesoriaId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost/asesored-api/marcar_asesoria_completada.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asesoria_id: asesoriaId,
            asesor_id: user.id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Asesoría marcada como completada.");
        fetchAsesorias();
      } else {
        setError(data.message || "No se pudo actualizar la asesoría.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setUpdatingId(null);
    }
  }

  function formatFecha(fecha: string) {
    const d = new Date(fecha + "T00:00:00");
    return d.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatHora(hora: string) {
    return hora.slice(0, 5);
  }

  function getStatusClass(estado: string) {
    switch (estado) {
      case "confirmada":
        return "confirm";
      case "pendiente":
        return "pending";
      case "cancelada":
        return "cancel";
      case "completada":
        return "confirm";
      default:
        return "confirm";
    }
  }

  function getStatusLabel(estado: string) {
    switch (estado) {
      case "confirmada":
        return "Confirmada";
      case "pendiente":
        return "Pendiente";
      case "cancelada":
        return "Cancelada";
      case "completada":
        return "Completada";
      default:
        return estado;
    }
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const proximas = asesorias.filter((a) => {
    const fecha = new Date(a.fecha + "T00:00:00");
    return fecha >= hoy && a.estado !== "completada" && a.estado !== "cancelada";
  });

  const historial = asesorias.filter((a) => {
    const fecha = new Date(a.fecha + "T00:00:00");
    return fecha < hoy || a.estado === "completada" || a.estado === "cancelada";
  });

  return (
    <div className="section-card" style={{ marginBottom: 24 }}>
      <div className="section-header">
        <span className="section-title">Mis asesorías</span>
      </div>

      <div className="section-body">
        {loading && <div className="success-msg">Cargando asesorías...</div>}
        {error && <div className="error-msg">{error}</div>}
        {message && <div className="success-msg">{message}</div>}

        {!loading && !error && asesorias.length === 0 && (
          <div className="error-msg">Aún no tienes asesorías registradas</div>
        )}

        {!loading && !error && proximas.length > 0 && (
          <>
            <h3 style={{ marginBottom: 14, fontSize: 16, fontWeight: 700 }}>
              Próximas asesorías
            </h3>

            <div className="asesoria-list" style={{ marginBottom: 24 }}>
              {proximas.map((a) => (
                <div key={a.id} className="asesoria-item">
                  <div className="asesoria-avatar" style={{ background: "rgba(255,255,255,.08)" }}>
                    👨‍🎓
                  </div>

                  <div className="asesoria-info">
                    <div className="asesoria-subject">{a.materia}</div>
                    <div className="asesoria-meta">
                      Alumno: {a.alumno_nombre} {a.alumno_apellido}
                    </div>
                    {a.notas && (
                      <div style={{ marginTop: 6, color: "var(--text-muted)", fontSize: 12.5 }}>
                        Notas: {a.notas}
                      </div>
                    )}
                  </div>

                  <div className="asesoria-time" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="asesoria-hour">{formatHora(a.hora)}</div>
                    <div className="asesoria-date">{formatFecha(a.fecha)}</div>
                    <span className={`status-badge ${getStatusClass(a.estado)}`}>
                      {getStatusLabel(a.estado)}
                    </span>

                    {a.estado === "pendiente" && (
                      <>
                        <button
                          className="btn-sm"
                          onClick={() => aceptarAsesoria(a.id)}
                          disabled={updatingId === a.id}
                        >
                          {updatingId === a.id ? "Procesando..." : "Aceptar"}
                        </button>

                        <button
                          className="btn-sm"
                          onClick={() => rechazarAsesoria(a.id)}
                          disabled={updatingId === a.id}
                        >
                          {updatingId === a.id ? "Procesando..." : "Rechazar"}
                        </button>
                      </>
                    )}

                    {a.estado === "confirmada" && (
                      <button
                        className="btn-sm"
                        onClick={() => marcarCompletada(a.id)}
                        disabled={updatingId === a.id}
                      >
                        {updatingId === a.id ? "Guardando..." : "Marcar completada"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && !error && historial.length > 0 && (
          <>
            <h3 style={{ marginBottom: 14, fontSize: 16, fontWeight: 700 }}>
              Historial de asesorías
            </h3>

            <div className="asesoria-list">
              {historial.map((a) => (
                <div key={a.id} className="asesoria-item">
                  <div className="asesoria-avatar" style={{ background: "rgba(255,255,255,.08)" }}>
                    📚
                  </div>

                  <div className="asesoria-info">
                    <div className="asesoria-subject">{a.materia}</div>
                    <div className="asesoria-meta">
                      Alumno: {a.alumno_nombre} {a.alumno_apellido}
                    </div>
                  </div>

                  <div className="asesoria-time">
                    <div className="asesoria-hour">{formatHora(a.hora)}</div>
                    <div className="asesoria-date">{formatFecha(a.fecha)}</div>
                    <div style={{ marginTop: 6 }}>
                      <span className={`status-badge ${getStatusClass(a.estado)}`}>
                        {getStatusLabel(a.estado)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
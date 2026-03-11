import { useEffect, useState } from "react";

interface LoggedUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

interface Horario {
  id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
}

interface AsesorOwnAvailabilityProps {
  reloadKey?: number;
}

export default function AsesorOwnAvailability({
  reloadKey = 0,
}: AsesorOwnAvailabilityProps) {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("asesored_user");
  const user: LoggedUser | null = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    async function fetchHorarios() {
      if (!user?.id) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost/asesored-api/obtener_disponibilidad.php?asesor_id=${user.id}`
        );

        const data = await response.json();

        if (data.success) {
          setHorarios(data.horarios);
        } else {
          setError(data.message || "No se pudieron cargar los horarios.");
        }
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    }

    fetchHorarios();
  }, [reloadKey, user?.id]);

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

  return (
    <div className="section-card">
      <div className="section-header">
        <span className="section-title">Mis horarios disponibles</span>
      </div>

      <div className="section-body">
        {loading && <div className="success-msg">Cargando horarios...</div>}
        {error && <div className="error-msg">{error}</div>}

        {!loading && !error && horarios.length === 0 && (
          <div className="error-msg">Aún no has registrado horarios disponibles</div>
        )}

        {horarios.length > 0 && (
          <div className="asesoria-list">
            {horarios.map((h) => (
              <div key={h.id} className="asesoria-item">
                <div
                  className="asesoria-avatar"
                  style={{ background: "rgba(0,201,167,.12)" }}
                >
                  🕒
                </div>

                <div className="asesoria-info">
                  <div className="asesoria-subject">{formatFecha(h.fecha)}</div>
                  <div className="asesoria-meta">
                    {formatHora(h.hora_inicio)} - {formatHora(h.hora_fin)}
                  </div>
                </div>

                <div className="asesoria-time">
                  <span className="status-badge confirm">Disponible</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
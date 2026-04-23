import { useEffect, useState } from "react";

interface AsesorData {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  materia?: string;
}

interface Horario {
  id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
}

interface LoggedUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

interface AsesorAvailabilityProps {
  asesor: AsesorData | null;
}

export default function AsesorAvailability({ asesor }: AsesorAvailabilityProps) {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [bookingId, setBookingId] = useState<number | null>(null);

  const savedUser = localStorage.getItem("asesored_user");
  const user: LoggedUser | null = savedUser ? JSON.parse(savedUser) : null;

  async function fetchHorarios() {
    if (!asesor?.id) return;

    setLoading(true);
    setError("");
    setMessage("");
    setHorarios([]);

    try {
      const response = await fetch(
        `http://localhost/asesored-api/obtener_disponibilidad.php?asesor_id=${asesor.id}`
      );

      const data = await response.json();

      if (data.success) {
        setHorarios(data.horarios);
      } else {
        setError(data.message || "No se pudo cargar la disponibilidad.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHorarios();
  }, [asesor]);

  async function reservarHorario(disponibilidadId: number) {
    if (!user?.id) {
      setError("No se encontró la sesión del alumno.");
      return;
    }

    if (!asesor) {
      setError("No se encontró el asesor seleccionado.");
      return;
    }
    if (!asesor.materia || !asesor.materia.trim()) {
  setError("No se pudo identificar la materia seleccionada para esta solicitud.");
  return;
}

    setBookingId(disponibilidadId);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost/asesored-api/reservar_asesoria.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disponibilidad_id: disponibilidadId,
          alumno_id: user.id,
          notas: "",
          materia: asesor.materia.trim(),        }),
      });

      const data = await response.json();

      if (data.success) {
setMessage("La solicitud fue enviada correctamente. Ahora queda pendiente de revisión por parte del asesor.");        fetchHorarios();
      } else {
        setError(data.message || "No se pudo enviar la solicitud.");
      }
    } catch (err) {
setError("No se pudo cargar o enviar la solicitud en este momento. Intenta nuevamente.");    } finally {
      setBookingId(null);
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

  if (!asesor) return null;

  return (
    <div className="section-card" style={{ marginBottom: 24 }}>
      <div className="section-header">
        <span className="section-title">
          Horarios disponibles
        </span>
      </div>

      <div className="section-body">
        <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: 14, lineHeight: 1.6 }}>
          Selecciona uno de los horarios disponibles para enviar una solicitud de asesoría.
        </p>

        {message && <div className="success-msg">{message}</div>}
        {loading && <div className="success-msg">Cargando horarios...</div>}
        {error && <div className="error-msg">{error}</div>}

       {!loading && !error && horarios.length === 0 && (
  <div className="empty-state">
    <div className="empty-state-icon">📅</div>
    <div>
      <div className="empty-state-title">Sin horarios disponibles</div>
      <div className="empty-state-text">
        Este asesor no tiene bloques activos por el momento. Puedes revisar más tarde o elegir otro asesor.
      </div>
    </div>
  </div>
)}

        {horarios.length > 0 && (
          <div className="asesoria-list">
            {horarios.map((h) => (
              <div key={h.id} className="asesoria-item">
                <div
                  className="asesoria-avatar"
                  style={{ background: "rgba(0,201,167,.12)" }}
                >
                  🗓️
                </div>

                <div className="asesoria-info">
                  <div className="asesoria-subject">{formatFecha(h.fecha)}</div>
                  <div className="asesoria-meta">
                    {formatHora(h.hora_inicio)} - {formatHora(h.hora_fin)}
                  </div>
                </div>

                <div
                  className="asesoria-time"
                  style={{
  display: "flex",
  flexDirection: "column",
  gap: 10,
  alignItems: "flex-end",
  justifyContent: "center",
  minWidth: 140,
  width: "auto",
  flexShrink: 0,
}}
                >
                  <span className="status-badge confirm">Disponible</span>
                  <button
                    className="btn-sm"
                    onClick={() => reservarHorario(h.id)}
                    disabled={bookingId === h.id}
                  >
                    {bookingId === h.id ? "Enviando..." : "Solicitar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
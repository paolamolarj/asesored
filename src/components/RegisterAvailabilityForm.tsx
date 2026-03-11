import { useState } from "react";

interface LoggedUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

interface RegisterAvailabilityFormProps {
  onCreated?: () => void;
}

export default function RegisterAvailabilityForm({
  onCreated,
}: RegisterAvailabilityFormProps) {
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("asesored_user");
  const user: LoggedUser | null = savedUser ? JSON.parse(savedUser) : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!fecha || !horaInicio || !horaFin) {
      setError("Completa todos los campos.");
      return;
    }

    if (!user?.id) {
      setError("No se encontró la sesión del asesor.");
      return;
    }

    if (horaInicio >= horaFin) {
      setError("La hora de inicio debe ser menor que la hora final.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost/asesored-api/registrar_disponibilidad.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            asesor_id: user.id,
            fecha,
            hora_inicio: horaInicio,
            hora_fin: horaFin,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Horario registrado correctamente.");
        setFecha("");
        setHoraInicio("");
        setHoraFin("");
        onCreated?.();
      } else {
        setError(data.message || "No se pudo registrar el horario.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-card" style={{ marginBottom: 24 }}>
      <div className="section-header">
        <span className="section-title">Registrar horario disponible</span>
      </div>

      <div className="section-body">
        {error && <div className="error-msg">{error}</div>}
        {message && <div className="success-msg">{message}</div>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <div className="input-wrap" style={{ marginBottom: 0 }}>
            <label>Fecha</label>
            <input
              className="field"
              style={{ paddingLeft: 16 }}
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="input-wrap" style={{ marginBottom: 0 }}>
              <label>Hora de inicio</label>
              <input
                className="field"
                style={{ paddingLeft: 16 }}
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
            </div>

            <div className="input-wrap" style={{ marginBottom: 0 }}>
              <label>Hora final</label>
              <input
                className="field"
                style={{ paddingLeft: 16 }}
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar horario"}
          </button>
        </form>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";

interface LoggedUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

interface ExistingCalificacion {
  id: number;
  puntuacion: number;
  comentario: string;
  created_at: string;
}

interface RateAsesoriaFormProps {
  asesoriaId: number;
  onRated?: () => void;
}

export default function RateAsesoriaForm({
  asesoriaId,
  onRated,
}: RateAsesoriaFormProps) {
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [existing, setExisting] = useState<ExistingCalificacion | null>(null);
  const [loadingCheck, setLoadingCheck] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const savedUser = localStorage.getItem("asesored_user");
  const user: LoggedUser | null = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    async function checkExisting() {
      setLoadingCheck(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost/asesored-api/obtener_calificacion_asesoria.php?asesoria_id=${asesoriaId}`
        );

        const data = await response.json();

        if (data.success) {
          setExisting(data.calificacion);
        } else {
          setError(data.message || "No se pudo revisar la calificación.");
        }
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoadingCheck(false);
      }
    }

    checkExisting();
  }, [asesoriaId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!user?.id) {
      setError("No se encontró la sesión del alumno.");
      return;
    }

    if (puntuacion < 1 || puntuacion > 5) {
      setError("La puntuación debe ser entre 1 y 5.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost/asesored-api/guardar_calificacion.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asesoria_id: asesoriaId,
          alumno_id: user.id,
          puntuacion,
          comentario,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Calificación guardada correctamente.");
        onRated?.();
      } else {
        setError(data.message || "No se pudo guardar la calificación.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  if (loadingCheck) {
    return <div className="success-msg">Cargando calificación...</div>;
  }

  if (existing) {
    return (
      <div className="success-msg" style={{ marginTop: 8 }}>
        Ya calificaste esta asesoría con {existing.puntuacion}/5
        {existing.comentario ? ` — "${existing.comentario}"` : ""}
      </div>
    );
  }

  return (
    <div style={{ marginTop: 10 }}>
      {error && <div className="error-msg">{error}</div>}
      {message && <div className="success-msg">{message}</div>}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 6,
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            Calificación
          </label>

          <select
            className="field field-select"
            style={{ paddingLeft: 16 }}
            value={puntuacion}
            onChange={(e) => setPuntuacion(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option style={{color:"black"}} key={n} value={n}>
                {n} estrella{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 6,
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            Comentario opcional
          </label>

          <textarea
            className="field"
            style={{ paddingLeft: 16, minHeight: 90, resize: "vertical" }}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Escribe un comentario sobre la asesoría..."
          />
        </div>

        <button type="submit" className="btn-sm" disabled={loading}>
          {loading ? "Guardando..." : "Enviar calificación"}
        </button>
      </form>
    </div>
  );
}
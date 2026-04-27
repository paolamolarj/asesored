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
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function RateAsesoriaForm({ asesoriaId, onRated, showToast }: RateAsesoriaFormProps) {
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [existing, setExisting] = useState<ExistingCalificacion | null>(null);
  const [loadingCheck, setLoadingCheck] = useState(true);
  const [loading, setLoading] = useState(false);

  const savedUser = localStorage.getItem("asesored_user");
  const user: LoggedUser | null = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    async function checkExisting() {
      setLoadingCheck(true);
      try {
        const response = await fetch(
          `http://localhost/asesored-api/obtener_calificacion_asesoria.php?asesoria_id=${asesoriaId}`
        );
        const data = await response.json();
        if (data.success) setExisting(data.calificacion);
      } catch {
        // silencioso
      } finally {
        setLoadingCheck(false);
      }
    }
    checkExisting();
  }, [asesoriaId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user?.id) { showToast("No se encontró la sesión del alumno.", "error"); return; }
    if (puntuacion < 1 || puntuacion > 5) { showToast("La puntuación debe ser entre 1 y 5.", "error"); return; }
    const comentarioLimpio = comentario.trim();
    if (comentario.length > 0 && comentarioLimpio.length < 3) {
      showToast("Si agregas un comentario, escribe al menos 3 caracteres.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost/asesored-api/guardar_calificacion.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asesoria_id: asesoriaId, alumno_id: user.id, puntuacion, comentario }),
      });
      const data = await response.json();
      if (data.success) {
        showToast("Calificación enviada correctamente.", "success");
        onRated?.();
      } else {
        showToast(data.message || "No se pudo guardar la calificación.", "error");
      }
    } catch {
      showToast("No se pudo guardar la calificación. Intenta nuevamente.", "error");
    } finally {
      setLoading(false);
    }
  }

  if (loadingCheck) return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: 13, marginTop: 8 }}>
      <div className="spinner spinner-sm" /> Cargando...
    </div>
  );

  if (existing) return (
    <div className="success-msg" style={{ marginTop: 8 }}>
      Ya calificaste esta asesoría con {existing.puntuacion}/5
      {existing.comentario ? ` — "${existing.comentario}"` : ""}
    </div>
  );

  return (
    <div style={{ marginTop: 10 }}>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--text-muted)", textTransform: "uppercase" }}>
            Calificación
          </label>
          <select className="field field-select" style={{ paddingLeft: 16 }} value={puntuacion} onChange={(e) => setPuntuacion(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option style={{ color: "black" }} key={n} value={n}>{n} estrella{n > 1 ? "s" : ""}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6, color: "var(--text-muted)", textTransform: "uppercase" }}>
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
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="spinner spinner-sm" /> Guardando...
            </span>
          ) : "Enviar calificación"}
        </button>
      </form>
    </div>
  );
}
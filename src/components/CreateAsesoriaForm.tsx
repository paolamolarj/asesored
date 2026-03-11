import { useEffect, useState } from "react";

interface UserOption {
  id: number;
  nombre: string;
  apellido: string;
  rol: string;
}

interface LoggedUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

interface CreateAsesoriaFormProps {
  onCreated?: () => void;
}

export default function CreateAsesoriaForm({ onCreated }: CreateAsesoriaFormProps) {
  const [materia, setMateria] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [notas, setNotas] = useState("");
  const [asesorId, setAsesorId] = useState("");
  const [asesores, setAsesores] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAsesores, setLoadingAsesores] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("asesored_user");
  const user: LoggedUser | null = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    async function fetchAsesores() {
      setLoadingAsesores(true);
      try {
        const response = await fetch("http://localhost/asesored-api/obtener_asesores.php");
        const data = await response.json();

        if (data.success) {
          setAsesores(data.asesores);
        } else {
          setError(data.message || "No se pudieron cargar los asesores.");
        }
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoadingAsesores(false);
      }
    }

    fetchAsesores();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!materia || !fecha || !hora || !asesorId) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    if (!user?.id) {
      setError("No se encontró la sesión del alumno.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost/asesored-api/crear_asesoria.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materia,
          fecha,
          hora,
          estado: "pendiente",
          alumno_id: user.id,
          asesor_id: Number(asesorId),
          notas,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Asesoría creada correctamente.");
        setMateria("");
        setFecha("");
        setHora("");
        setNotas("");
        setAsesorId("");
        onCreated?.();
      } else {
        setError(data.message || "No se pudo crear la asesoría.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-card">
      <div className="section-header">
        <span className="section-title">Solicitar asesoría</span>
      </div>

      <div className="section-body">
        {error && <div className="error-msg">{error}</div>}
        {message && <div className="success-msg">{message}</div>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <div className="input-wrap" style={{ marginBottom: 0 }}>
            <label>Materia</label>
            <input
              className="field"
              style={{ paddingLeft: 16 }}
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
              placeholder="Ej. Cálculo Diferencial"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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

            <div className="input-wrap" style={{ marginBottom: 0 }}>
              <label>Hora</label>
              <input
                className="field"
                style={{ paddingLeft: 16 }}
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              />
            </div>
          </div>

          <div className="input-wrap" style={{ marginBottom: 0 }}>
            <label>Asesor</label>
            <select
              className="field field-select"
              style={{ paddingLeft: 16 }}
              value={asesorId}
              onChange={(e) => setAsesorId(e.target.value)}
              disabled={loadingAsesores}
            >
              <option value="">
                {loadingAsesores ? "Cargando asesores..." : "Selecciona un asesor"}
              </option>
              {asesores.map((asesor) => (
                <option key={asesor.id} value={asesor.id}>
                  {asesor.nombre} {asesor.apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="input-wrap" style={{ marginBottom: 0 }}>
            <label>Notas (opcional)</label>
            <textarea
              className="field"
              style={{ paddingLeft: 16, minHeight: 100, resize: "vertical" }}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Detalles sobre el tema que necesitas revisar"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Crear asesoría"}
          </button>
        </form>
      </div>
    </div>
  );
}
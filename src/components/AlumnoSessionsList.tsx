import { useEffect, useState } from "react";
import RateAsesoriaForm from "./RateAsesoriaForm";
import ConfirmModal from "./ConfirmModal";
import Toast from "./Toast";

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
  asesor_nombre: string;
  asesor_apellido: string;
}

interface AlumnoSessionsListProps {
  reloadKey?: number;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function AlumnoSessionsList({ reloadKey = 0, showToast }: AlumnoSessionsListProps) {
  const [asesorias, setAsesorias] = useState<Asesoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ id: number } | null>(null);
const [loadingAction, setLoadingAction] = useState(false);
const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

function showSuccess(message: string) {
  setToast({ message, type: "success" });
}

function showError(message: string) {
  setToast({ message, type: "error" });
}
  const savedUser = localStorage.getItem("asesored_user");
  const user: LoggedUser | null = savedUser ? JSON.parse(savedUser) : null;

  async function fetchAsesorias() {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost/asesored-api/obtener_asesorias_alumno.php?alumno_id=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setAsesorias(data.asesorias);
      } else {
        setError(data.message || "No se pudieron cargar tus asesorías.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAsesorias();
  }, [reloadKey, user?.id]);

  async function cancelarAsesoria(asesoriaId: number) {
    if (!user?.id) return;
    setUpdatingId(asesoriaId);
    setConfirmModal(null);
    setLoadingAction(true);
setError("");
    

    try {
      const response = await fetch("http://localhost/asesored-api/cancelar_asesoria.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asesoria_id: asesoriaId, alumno_id: user.id }),
      });
      const data = await response.json();

      if (data.success) {
        showToast("Asesoría cancelada correctamente.", "success");
        fetchAsesorias();
        showSuccess("La asesoría se canceló correctamente.");
      } else {
        showError(data.message || "No se pudo cancelar la asesoría.");
      }
    } catch {
showError("No se pudo conectar con el servidor.");    } finally {
      setLoadingAction(false);
    }
  }

  function formatFecha(fecha: string) {
    return new Date(fecha + "T00:00:00").toLocaleDateString("es-MX", {
      year: "numeric", month: "long", day: "numeric",
    });
  }

  function formatHora(hora: string) { return hora.slice(0, 5); }

  function getStatusClass(estado: string) {
    switch (estado) {
      case "confirmada": return "confirm";
      case "pendiente": return "pending";
      case "cancelada": return "cancel";
      case "completada": return "confirm";
      default: return "confirm";
    }
  }

  function getStatusLabel(estado: string) {
    switch (estado) {
      case "confirmada": return "Aceptada";
      case "pendiente": return "Pendiente";
      case "cancelada": return "Cancelada";
      case "completada": return "Completada";
      default: return estado;
    }
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  function getDateTimeValue(fecha: string, hora: string) {
    return new Date(`${fecha}T${hora}`).getTime();
  }

  const proximas = asesorias
    .filter((a) => {
      const fecha = new Date(a.fecha + "T00:00:00");
      return fecha >= hoy && a.estado !== "completada" && a.estado !== "cancelada";
    })
    .sort((a, b) => getDateTimeValue(a.fecha, a.hora) - getDateTimeValue(b.fecha, b.hora));

  const historial = asesorias
    .filter((a) => {
      const fecha = new Date(a.fecha + "T00:00:00");
      return fecha < hoy || a.estado === "completada" || a.estado === "cancelada";
    })
    .sort((a, b) => getDateTimeValue(b.fecha, b.hora) - getDateTimeValue(a.fecha, a.hora));

  return (
    <>
      <div className="section-card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <span className="section-title">Seguimiento de asesorías</span>
        </div>

        <div className="section-body">
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 14, padding: "8px 0" }}>
              <div className="spinner" />
              Cargando asesorías...
            </div>
          )}
          {error && <div className="error-msg">{error}</div>}

          {!loading && !error && asesorias.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📘</div>
              <div>
                <div className="empty-state-title">Aún no tienes asesorías</div>
                <div className="empty-state-text">Cuando solicites una asesoría, aparecerá aquí con su estado y seguimiento.</div>
              </div>
            </div>
          )}

          {!loading && !error && proximas.length > 0 && (
            <>
              <h3 style={{ marginBottom: 14, fontSize: 16, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                Próximas asesorías
              </h3>
              <p className="muted-small" style={{ marginBottom: 14 }}>
                Aquí se muestran primero las asesorías activas ordenadas por fecha y hora.
              </p>
              <div className="asesoria-list" style={{ marginBottom: 24 }}>
                {proximas.map((a) => (
                  <div key={a.id} className="asesoria-item">
                    <div className="asesoria-avatar" style={{ background: "rgba(255,255,255,.08)" }}>👨‍🏫</div>
                    <div className="asesoria-info">
                      <div className="asesoria-subject">{a.materia}</div>
                      <div className="asesoria-meta">Asesor: {a.asesor_nombre} {a.asesor_apellido}</div>
                      {a.notas && (
                        <div style={{ marginTop: 6, color: "var(--text-muted)", fontSize: 12.5 }}>Notas: {a.notas}</div>
                      )}
                    </div>
                    <div className="asesoria-time" style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end", justifyContent: "center", minWidth: 140, flexShrink: 0 }}>
                      <div className="asesoria-hour">{formatHora(a.hora)}</div>
                      <div className="asesoria-date">{formatFecha(a.fecha)}</div>
                      <span className={`status-badge ${getStatusClass(a.estado)}`}>{getStatusLabel(a.estado)}</span>
                      {(a.estado === "confirmada" || a.estado === "pendiente") && (
                       <button
  className="btn-sm"
  onClick={() => cancelarAsesoria(a.id)}
  disabled={loadingAction}
>
  {loadingAction ? "Procesando..." : "Cancelar"}
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
              <h3 style={{ marginBottom: 14, fontSize: 16, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                Historial
              </h3>
              <p className="muted-small" style={{ marginBottom: 14 }}>
                Aquí puedes revisar asesorías completadas, canceladas o pasadas.
              </p>
              <div className="asesoria-list">
                {historial.map((a) => (
                  <div key={a.id} className="asesoria-item" style={{ alignItems: "flex-start" }}>
                    <div className="asesoria-avatar" style={{ background: "rgba(255,255,255,.08)" }}>📘</div>
                    <div className="asesoria-info">
                      <div className="asesoria-subject">{a.materia}</div>
                      <div className="asesoria-meta">Asesor: {a.asesor_nombre} {a.asesor_apellido}</div>
                      {a.estado === "completada" && (
                        <RateAsesoriaForm
                          asesoriaId={a.id}
                          onRated={() => fetchAsesorias()}
                          showToast={showToast}
                        />
                      )}
                    </div>
                    <div className="asesoria-time">
                      <div className="asesoria-hour">{formatHora(a.hora)}</div>
                      <div className="asesoria-date">{formatFecha(a.fecha)}</div>
                      <div style={{ marginTop: 6 }}>
                        <span className={`status-badge ${getStatusClass(a.estado)}`}>{getStatusLabel(a.estado)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de confirmación para cancelar */}
      {confirmModal && (
        <ConfirmModal
          message="¿Seguro que quieres cancelar esta asesoría? El horario volverá a quedar disponible."
          confirmLabel="Sí, cancelar"
          cancelLabel="No, mantener"
          variant="danger"
          onConfirm={() => cancelarAsesoria(confirmModal.id)}
          onCancel={() => setConfirmModal(null)}
        />
      )}
      {toast && (
  <Toast
    message={toast.message}
    type={toast.type}
    onClose={() => setToast(null)}
  />
)}
    </>
  );
}
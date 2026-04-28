import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";

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
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

type ConfirmAction = {
  id: number;
  action: "aceptar" | "rechazar" | "completar";
};

export default function AsesorSessionsList({ reloadKey = 0, showToast }: AsesorSessionsListProps) {
  const [asesorias, setAsesorias] = useState<Asesoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmAction | null>(null);

  const savedUser = localStorage.getItem("asesored_user");
  const user: LoggedUser | null = savedUser ? JSON.parse(savedUser) : null;

  async function fetchAsesorias() {
    if (!user?.id) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost/asesored-api/obtener_asesorias_asesor.php?asesor_id=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setAsesorias(data.asesorias);
      } else {
        setError(data.message || "No se pudieron cargar las asesorías.");
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

  async function aceptarAsesoria(asesoriaId: number) {
    if (!user?.id) return;
    setUpdatingId(asesoriaId);
    setConfirmModal(null);
    try {
      const response = await fetch("http://localhost/asesored-api/aceptar_asesoria.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asesoria_id: asesoriaId, asesor_id: user.id }),
      });
      const data = await response.json();
      if (data.success) {
        showToast("Solicitud aceptada correctamente.", "success");
        fetchAsesorias();
      } else {
        showToast(data.message || "No se pudo aceptar la solicitud.", "error");
      }
    } catch {
      showToast("No se pudo conectar con el servidor.", "error");
    } finally {
      setUpdatingId(null);
    }
  }

  async function rechazarAsesoria(asesoriaId: number) {
    if (!user?.id) return;
    setUpdatingId(asesoriaId);
    setConfirmModal(null);
    try {
      const response = await fetch("http://localhost/asesored-api/rechazar_asesoria.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asesoria_id: asesoriaId, asesor_id: user.id }),
      });
      const data = await response.json();
      if (data.success) {
        showToast("Solicitud rechazada. El horario volvió a estar disponible.", "info");
        fetchAsesorias();
      } else {
        showToast(data.message || "No se pudo rechazar la solicitud.", "error");
      }
    } catch {
      showToast("No se pudo conectar con el servidor.", "error");
    } finally {
      setUpdatingId(null);
    }
  }

  async function marcarCompletada(asesoriaId: number) {
    if (!user?.id) return;
    setUpdatingId(asesoriaId);
    setConfirmModal(null);
    try {
      const response = await fetch("http://localhost/asesored-api/marcar_asesoria_completada.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asesoria_id: asesoriaId, asesor_id: user.id }),
      });
      const data = await response.json();
      if (data.success) {
        showToast("Asesoría marcada como completada.", "success");
        fetchAsesorias();
      } else {
        showToast(data.message || "No se pudo actualizar la asesoría.", "error");
      }
    } catch {
      showToast("No se pudo conectar con el servidor.", "error");
    } finally {
      setUpdatingId(null);
    }
  }

  function handleConfirm() {
    if (!confirmModal) return;
    if (confirmModal.action === "aceptar") aceptarAsesoria(confirmModal.id);
    else if (confirmModal.action === "rechazar") rechazarAsesoria(confirmModal.id);
    else if (confirmModal.action === "completar") marcarCompletada(confirmModal.id);
  }

  const modalConfig = {
    aceptar: { message: "¿Deseas aceptar esta solicitud de asesoría?", confirmLabel: "Sí, aceptar", variant: "default" as const },
    rechazar: { message: "¿Seguro que quieres rechazar esta solicitud? El horario volverá a estar disponible.", confirmLabel: "Sí, rechazar", variant: "danger" as const },
    completar: { message: "¿Seguro que deseas marcar esta asesoría como completada?", confirmLabel: "Sí, completar", variant: "warning" as const },
  };

  function formatFecha(fecha: string) {
    return new Date(fecha + "T00:00:00").toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
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
          <span className="section-title">Solicitudes y asesorías</span>
        </div>

        <div className="section-body">
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 14, padding: "8px 0" }}>
              <div className="spinner" /> Cargando asesorías...
            </div>
          )}
          {error && <div className="error-msg">{error}</div>}

          {!loading && !error && asesorias.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">👨‍🏫</div>
              <div>
                <div className="empty-state-title">Sin asesorías registradas</div>
                <div className="empty-state-text">Cuando los alumnos envíen solicitudes, aparecerán aquí.</div>
              </div>
            </div>
          )}

          {!loading && !error && proximas.length > 0 && (
            <>
              <h3 style={{ marginBottom: 14, fontSize: 16, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                Próximas asesorías
              </h3>
              <p className="muted-small" style={{ marginBottom: 14 }}>
                Se muestran primero las solicitudes y asesorías activas ordenadas por fecha y hora.
              </p>
              <div className="asesoria-list" style={{ marginBottom: 24 }}>
                {proximas.map((a) => (
                  <div key={a.id} className="asesoria-item">
                    <div className="asesoria-avatar" style={{ background: "rgba(255,255,255,.08)" }}>👨‍🎓</div>
                    <div className="asesoria-info">
                      <div className="asesoria-subject">{a.materia}</div>
                      <div className="asesoria-meta">Alumno: {a.alumno_nombre} {a.alumno_apellido}</div>
                      {a.notas && (
                        <div style={{ marginTop: 6, color: "var(--text-muted)", fontSize: 12.5 }}>Notas: {a.notas}</div>
                      )}
                    </div>
                    <div className="asesoria-time" style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", justifyContent: "center", minWidth: 140, flexShrink: 0 }}>
                      <div className="asesoria-hour">{formatHora(a.hora)}</div>
                      <div className="asesoria-date">{formatFecha(a.fecha)}</div>
                      <span className={`status-badge ${getStatusClass(a.estado)}`}>{getStatusLabel(a.estado)}</span>

                      {a.estado === "pendiente" && (
                        <>
                          <button className="btn-sm" onClick={() => setConfirmModal({ id: a.id, action: "aceptar" })} disabled={updatingId === a.id}>
                            {updatingId === a.id ? <span style={{ display: "flex", alignItems: "center", gap: 6 }}><div className="spinner spinner-sm" /> Procesando...</span> : "Aceptar"}
                          </button>
                          <button className="btn-sm" onClick={() => setConfirmModal({ id: a.id, action: "rechazar" })} disabled={updatingId === a.id}>
                            {updatingId === a.id ? "Procesando..." : "Rechazar"}
                          </button>
                        </>
                      )}

                      {a.estado === "confirmada" && (
                        <button className="btn-sm" onClick={() => setConfirmModal({ id: a.id, action: "completar" })} disabled={updatingId === a.id}>
                          {updatingId === a.id ? <span style={{ display: "flex", alignItems: "center", gap: 6 }}><div className="spinner spinner-sm" /> Guardando...</span> : "Marcar completada"}
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
                Historial de asesorías
              </h3>
              <p className="muted-small" style={{ marginBottom: 14 }}>
                Aquí aparecen asesorías completadas, canceladas o ya finalizadas.
              </p>
              <div className="asesoria-list">
                {historial.map((a) => (
                  <div key={a.id} className="asesoria-item">
                    <div className="asesoria-avatar" style={{ background: "rgba(255,255,255,.08)" }}>📚</div>
                    <div className="asesoria-info">
                      <div className="asesoria-subject">{a.materia}</div>
                      <div className="asesoria-meta">Alumno: {a.alumno_nombre} {a.alumno_apellido}</div>
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

      {confirmModal && (
        <ConfirmModal
          message={modalConfig[confirmModal.action].message}
          confirmLabel={modalConfig[confirmModal.action].confirmLabel}
          cancelLabel="Cancelar"
          variant={modalConfig[confirmModal.action].variant}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </>
  );
}
import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";

interface Asesor {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  activo: number;
}

interface AdminAsesoresListProps {
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function AdminAsesoresList({ showToast }: AdminAsesoresListProps) {
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<Asesor | null>(null);

  async function fetchAsesores() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost/asesored-api/obtener_asesores_admin.php");
      const data = await response.json();
      if (data.success) {
        setAsesores(data.asesores);
      } else {
        setError(data.message || "No se pudieron cargar los asesores.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAsesores();
  }, []);

  async function toggleEstado(asesor: Asesor) {
    setUpdatingId(asesor.id);
    setConfirmModal(null);
    try {
      const response = await fetch("http://localhost/asesored-api/cambiar_estado_asesor.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asesor_id: asesor.id, activo: asesor.activo ? 0 : 1 }),
      });
      const data = await response.json();
      if (data.success) {
        showToast(
          asesor.activo ? "Asesor desactivado correctamente." : "Asesor activado correctamente.",
          "success"
        );
        fetchAsesores();
      } else {
        showToast(data.message || "No se pudo cambiar el estado.", "error");
      }
    } catch {
      showToast("No se pudo conectar con el servidor.", "error");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      <div className="section-card">
        <div className="section-header">
          <span className="section-title">Gestión de asesores</span>
        </div>

        <div className="section-body">
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 14, padding: "8px 0" }}>
              <div className="spinner" /> Cargando asesores...
            </div>
          )}
          {error && <div className="error-msg">{error}</div>}

          {!loading && !error && asesores.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🧑‍💼</div>
              <div>
                <div className="empty-state-title">No hay asesores registrados</div>
                <div className="empty-state-text">
                  Cuando el administrador active usuarios como asesores, aparecerán listados aquí.
                </div>
              </div>
            </div>
          )}

          {asesores.length > 0 && (
            <div className="asesor-list">
              {asesores.map((asesor) => (
                <div key={asesor.id} className="asesor-item">
                  <div className="asesor-avatar" style={{ background: "rgba(255,255,255,.08)" }}>
                    👨‍🏫
                  </div>

                  <div className="asesor-info">
                    <div className="asesor-name">{asesor.nombre} {asesor.apellido}</div>
                    <div className="asesor-subject">{asesor.email}</div>
                    <div style={{ marginTop: 6 }}>
                      <span className={`status-badge ${asesor.activo ? "confirm" : "cancel"}`}>
                        {asesor.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn-sm"
                    onClick={() => setConfirmModal(asesor)}
                    disabled={updatingId === asesor.id}
                  >
                    {updatingId === asesor.id ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div className="spinner spinner-sm" /> Guardando...
                      </span>
                    ) : asesor.activo ? "Desactivar" : "Activar"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {confirmModal && (
        <ConfirmModal
          message={
            confirmModal.activo
              ? `¿Seguro que quieres desactivar a ${confirmModal.nombre} ${confirmModal.apellido}?`
              : `¿Seguro que quieres activar a ${confirmModal.nombre} ${confirmModal.apellido}?`
          }
          confirmLabel={confirmModal.activo ? "Sí, desactivar" : "Sí, activar"}
          cancelLabel="Cancelar"
          variant={confirmModal.activo ? "danger" : "default"}
          onConfirm={() => toggleEstado(confirmModal)}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </>
  );
}
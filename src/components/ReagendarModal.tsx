import { useEffect, useState } from "react";

interface Horario {
  id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

interface ReagendarModalProps {
  asesoriaId: number;
  asesorId: number;
  materia: string;
  onReagendado: () => void;
  onCancel: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function ReagendarModal({
  asesoriaId, asesorId, materia, onReagendado, onCancel, showToast,
}: ReagendarModalProps) {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("asesored_user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    async function fetchHorarios() {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost/asesored-api/obtener_disponibilidad_asesor_reagendar.php?asesor_id=${asesorId}&asesoria_id=${asesoriaId}`
        );
        const data = await res.json();
        if (data.success) setHorarios(data.horarios);
        else setError(data.message || "No se pudieron cargar los horarios.");
      } catch {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    }
    fetchHorarios();
  }, [asesorId, asesoriaId]);

  async function handleReagendar() {
    if (!selectedId || !user?.id) return;
    setSaving(true);
    try {
      const res = await fetch("http://localhost/asesored-api/reagendar_asesoria.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asesoria_id: asesoriaId,
          alumno_id: user.id,
          nueva_disponibilidad_id: selectedId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Asesoría reagendada correctamente.", "success");
        onReagendado();
      } else {
        showToast(data.message || "No se pudo reagendar.", "error");
      }
    } catch {
      showToast("No se pudo conectar con el servidor.", "error");
    } finally {
      setSaving(false);
    }
  }

  function formatFecha(fecha: string) {
    return new Date(fecha + "T00:00:00").toLocaleDateString("es-MX", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  }

  function formatHora(hora: string) { return hora.slice(0, 5); }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        padding: 20, animation: "fadeIn 0.2s ease",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 18, padding: 24,
          maxWidth: 480, width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          animation: "slideUp 0.2s ease",
          maxHeight: "80vh", overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 20,
            fontWeight: 800, color: "var(--text-primary)",
            letterSpacing: "-0.01em", marginBottom: 6,
          }}>
            Reagendar asesoría
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Selecciona un nuevo horario disponible para <strong style={{ color: "var(--text-primary)" }}>{materia}</strong>
          </p>
        </div>

        {/* Contenido scrolleable */}
        <div style={{ flex: 1, overflowY: "auto", marginBottom: 20 }}>
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 14, padding: "12px 0" }}>
              <div className="spinner" /> Cargando horarios disponibles...
            </div>
          )}

          {error && <div className="error-msg">{error}</div>}

          {!loading && !error && horarios.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <div>
                <div className="empty-state-title">Sin horarios disponibles</div>
                <div className="empty-state-text">
                  El asesor no tiene horarios disponibles en este momento.
                </div>
              </div>
            </div>
          )}

          {!loading && horarios.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {horarios.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSelectedId(h.id)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                    border: selectedId === h.id
                      ? "2px solid var(--teal)"
                      : "1px solid var(--border)",
                    background: selectedId === h.id
                      ? "rgba(37,99,235,0.10)"
                      : "rgba(255,255,255,0.04)",
                    transition: "all 0.18s ease",
                    textAlign: "left", width: "100%",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20 }}>🗓️</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
                        {formatFecha(h.fecha)}
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>
                        {formatHora(h.hora_inicio)} - {formatHora(h.hora_fin)}
                      </div>
                    </div>
                  </div>
                  {selectedId === h.id && (
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: "#93C5FD",
                      background: "rgba(37,99,235,0.15)",
                      border: "1px solid rgba(37,99,235,0.25)",
                      padding: "3px 10px", borderRadius: 999,
                    }}>
                      Seleccionado
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "10px 20px", borderRadius: 10,
              border: "1px solid var(--border)", background: "transparent",
              color: "var(--text-muted)", cursor: "pointer",
              fontSize: 14, fontWeight: 600, fontFamily: "Outfit, sans-serif",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleReagendar}
            disabled={!selectedId || saving}
            style={{
              padding: "10px 20px", borderRadius: 10, border: "none",
              background: selectedId ? "var(--teal)" : "rgba(255,255,255,0.1)",
              color: selectedId ? "#fff" : "var(--text-muted)",
              cursor: selectedId ? "pointer" : "not-allowed",
              fontSize: 14, fontWeight: 700, fontFamily: "Outfit, sans-serif",
              display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.18s ease",
            }}
          >
            {saving ? (
              <><div className="spinner spinner-sm" /> Reagendando...</>
            ) : "Confirmar reagenda"}
          </button>
        </div>
      </div>
    </div>
  );
}
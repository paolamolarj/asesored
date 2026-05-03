import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";

interface Materia {
  id: number;
  nombre: string;
}

interface AdminMateriasListProps {
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function AdminMateriasList({ showToast }: AdminMateriasListProps) {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevaMateria, setNuevaMateria] = useState("");
  const [agregando, setAgregando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<Materia | null>(null);
  const [busqueda, setBusqueda] = useState("");

  async function fetchMaterias() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/asesored-api/obtener_materias.php");
      const data = await res.json();
      if (data.success) setMaterias(data.materias);
    } catch {
      showToast("No se pudo conectar con el servidor.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMaterias(); }, []);

  async function handleAgregar(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevaMateria.trim()) return;
    setAgregando(true);
    try {
      const res = await fetch("http://localhost/asesored-api/agregar_materia.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevaMateria.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Materia agregada correctamente.", "success");
        setNuevaMateria("");
        fetchMaterias();
      } else {
        showToast(data.message || "No se pudo agregar la materia.", "error");
      }
    } catch {
      showToast("No se pudo conectar con el servidor.", "error");
    } finally {
      setAgregando(false);
    }
  }

  async function handleEliminar(materia: Materia) {
    setEliminandoId(materia.id);
    setConfirmModal(null);
    try {
      const res = await fetch("http://localhost/asesored-api/eliminar_materia.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materia_id: materia.id }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Materia eliminada correctamente.", "success");
        fetchMaterias();
      } else {
        showToast(data.message || "No se pudo eliminar la materia.", "error");
      }
    } catch {
      showToast("No se pudo conectar con el servidor.", "error");
    } finally {
      setEliminandoId(null);
    }
  }

  const materiasFiltradas = materias.filter((m) =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <div className="section-card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <span className="section-title">Gestión de materias</span>
          <span style={{
            fontSize: 12, fontWeight: 700, color: "var(--text-muted)",
            background: "rgba(255,255,255,0.06)", padding: "4px 10px",
            borderRadius: 999, border: "1px solid var(--border)",
          }}>
            {materias.length} materias
          </span>
        </div>

        <div className="section-body">
          {/* Agregar nueva materia */}
          <form onSubmit={handleAgregar} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <div className="input-wrap" style={{ flex: 1, marginBottom: 0 }}>
              <input
                className="field"
                style={{ paddingLeft: 16 }}
                placeholder="Nombre de la nueva materia..."
                value={nuevaMateria}
                onChange={(e) => setNuevaMateria(e.target.value)}
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={agregando || !nuevaMateria.trim()}
              style={{ width: "auto", minWidth: 120, minHeight: 48 }}
            >
              {agregando ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="spinner spinner-sm" /> Agregando...
                </span>
              ) : "+ Agregar"}
            </button>
          </form>

          {/* Buscador */}
          {materias.length > 3 && (
            <div className="input-wrap" style={{ marginBottom: 16 }}>
              <input
                className="field"
                style={{ paddingLeft: 16 }}
                placeholder="Buscar materia..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          )}

          {/* Lista */}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 14 }}>
              <div className="spinner" /> Cargando materias...
            </div>
          )}

          {!loading && materiasFiltradas.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <div>
                <div className="empty-state-title">
                  {busqueda ? "Sin coincidencias" : "No hay materias registradas"}
                </div>
                <div className="empty-state-text">
                  {busqueda ? "Intenta con otro término de búsqueda." : "Agrega la primera materia usando el formulario de arriba."}
                </div>
              </div>
            </div>
          )}

          {!loading && materiasFiltradas.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {materiasFiltradas.map((m) => (
                <div key={m.id} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  transition: "all 0.18s ease",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 9,
                      background: "rgba(37,99,235,0.12)",
                      border: "1px solid rgba(37,99,235,0.20)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, flexShrink: 0,
                    }}>
                      📖
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
                      {m.nombre}
                    </span>
                  </div>

                  <button
                    className="btn-sm"
                    onClick={() => setConfirmModal(m)}
                    disabled={eliminandoId === m.id}
                    style={{
                      borderColor: "rgba(220,38,38,0.25)",
                      background: "rgba(220,38,38,0.08)",
                      color: "#FCA5A5",
                      minWidth: 90,
                    }}
                  >
                    {eliminandoId === m.id ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div className="spinner spinner-sm" /> Eliminando...
                      </span>
                    ) : "Eliminar"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {confirmModal && (
        <ConfirmModal
          message={`¿Seguro que quieres eliminar la materia "${confirmModal.nombre}"? Esta acción no se puede deshacer.`}
          confirmLabel="Sí, eliminar"
          cancelLabel="Cancelar"
          variant="danger"
          onConfirm={() => handleEliminar(confirmModal)}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </>
  );
}
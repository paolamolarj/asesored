import { useEffect, useMemo, useState, useRef } from "react";

interface Materia {
  id: number;
  nombre: string;
}

interface LoggedUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

interface SelectMateriasAsesorProps {
  onSaved?: () => void;
}

export default function SelectMateriasAsesor({ onSaved }: SelectMateriasAsesorProps) {
  const [catalogo, setCatalogo] = useState<Materia[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const savedUser = localStorage.getItem("asesored_user");
  const user: LoggedUser | null = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    async function cargarDatos() {
      if (!user?.id) return;
      setLoadingData(true);
      setError("");
      try {
        const [resCatalogo, resActuales] = await Promise.all([
          fetch("http://localhost/asesored-api/obtener_materias.php"),
          fetch(`http://localhost/asesored-api/obtener_materias_asesor_actual.php?asesor_id=${user.id}`),
        ]);
        const dataCatalogo = await resCatalogo.json();
        const dataActuales = await resActuales.json();
        if (dataCatalogo.success) setCatalogo(dataCatalogo.materias);
        if (dataActuales.success) setSelected(dataActuales.materias);
      } catch {
        setError("No se pudieron cargar las materias.");
      } finally {
        setLoadingData(false);
      }
    }
    cargarDatos();
  }, [user?.id]);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMaterias = useMemo(() => {
    const text = search.trim().toLowerCase();
    return catalogo.filter((m) => {
      const notSelected = !selected.includes(m.nombre);
      const matches = text === "" || m.nombre.toLowerCase().includes(text);
      return notSelected && matches;
    });
  }, [catalogo, selected, search]);

  function addMateria(nombre: string) {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) return;
    if (!selected.some((m) => m.toLowerCase() === nombreLimpio.toLowerCase())) {
      setSelected((prev) => [...prev, nombreLimpio]);
    }
    setSearch("");
    setDropdownOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }

  function removeMateria(nombre: string) {
    setSelected((prev) => prev.filter((m) => m !== nombre));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!dropdownOpen || filteredMaterias.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredMaterias.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredMaterias.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredMaterias[highlightedIndex]) {
        addMateria(filteredMaterias[highlightedIndex].nombre);
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  }

  // Scroll automático al item resaltado
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const item = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  async function handleSave() {
    if (!user?.id) { setError("No se encontró la sesión del asesor."); return; }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("http://localhost/asesored-api/guardar_materias_asesor.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asesor_id: user.id, materias: selected }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Materias guardadas correctamente.");
        onSaved?.();
      } else {
        setError(data.message || "No se pudieron guardar las materias.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-card" style={{ marginBottom: 24 }}>
      <div className="section-header">
        <span className="section-title">Seleccionar materias que impartes</span>
      </div>

      <div className="section-body">
        {error && <div className="error-msg">{error}</div>}
        {message && <div className="success-msg">{message}</div>}

        {loadingData ? (
          <div className="success-msg">Cargando materias...</div>
        ) : catalogo.length === 0 ? (
          <div className="error-msg">No hay materias registradas en la base de datos.</div>
        ) : (
          <>
            {/* Input con dropdown flotante */}
            <div className="input-wrap" style={{ marginBottom: 18, position: "relative" }}>
              <label>Buscar materia</label>
              <input
                ref={inputRef}
                className="field"
                style={{ paddingLeft: 16 }}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setDropdownOpen(true);
                  setHighlightedIndex(-1);
                }}
                onFocus={() => setDropdownOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe para buscar materias..."
                autoComplete="off"
              />

              {dropdownOpen && filteredMaterias.length > 0 && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    maxHeight: 220,
                    overflowY: "auto",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    background: "var(--surface)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                    marginTop: 4,
                  }}
                >
                  {filteredMaterias.map((materia, index) => (
                    <button
                      key={materia.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault(); // evita que el input pierda focus antes del click
                        addMateria(materia.nombre);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 14px",
                        border: "none",
                        borderBottom: "1px solid var(--border)",
                        background: highlightedIndex === index
                          ? "rgba(0,201,167,0.10)"
                          : "transparent",
                        color: "var(--text-primary)",
                        cursor: "pointer",
                        fontFamily: "Outfit, sans-serif",
                        fontSize: 14,
                        transition: "background 0.15s",
                      }}
                    >
                      {materia.nombre}
                    </button>
                  ))}
                </div>
              )}

              {dropdownOpen && search.trim() !== "" && filteredMaterias.length === 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    background: "var(--surface)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                    marginTop: 4,
                    padding: 14,
                    color: "var(--text-muted)",
                    fontSize: 14,
                  }}
                >
                  No hay coincidencias disponibles.
                </div>
              )}
            </div>

            {/* Materias seleccionadas */}
            <div style={{ marginBottom: 18 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--text-muted)",
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: ".04em",
              }}>
                Materias seleccionadas
              </div>

              {selected.length === 0 ? (
                <div className="error-msg">Aún no has seleccionado materias.</div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {selected.map((materia) => (
                    <div
                      key={materia}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "rgba(0,201,167,.10)",
                        border: "1px solid rgba(0,201,167,.25)",
                        color: "var(--teal)",
                        padding: "8px 12px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      <span>{materia}</span>
                      <button
                        type="button"
                        onClick={() => removeMateria(materia)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--teal)",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar materias"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
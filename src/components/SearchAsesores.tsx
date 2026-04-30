import { useState, useRef, useEffect } from "react";
import Toast from "./Toast";

interface AsesorResult {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  materia: string;
}

interface SearchAsesoresProps {
  onSelectAsesor?: (asesor: AsesorResult) => void;
}

export default function SearchAsesores({ onSelectAsesor }: SearchAsesoresProps) {
  const [materia, setMateria] = useState("");
  const [asesores, setAsesores] = useState<AsesorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [catalogoMaterias, setCatalogoMaterias] = useState<string[]>([]);
const [loadingAction, setLoadingAction] = useState(false);
const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

function showSuccess(message: string) {
  setToast({ message, type: "success" });
}

function showError(message: string) {
  setToast({ message, type: "error" });
}
  // Estado del dropdown de sugerencias
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);


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

  // Scroll automático al item resaltado
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const item = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

useEffect(() => {
  async function cargarMaterias() {
    try {
      const res = await fetch("http://localhost/asesored-api/obtener_materias.php");
      const data = await res.json();
      if (data.success) {
        setCatalogoMaterias(data.materias.map((m: { nombre: string }) => m.nombre));
      }
    } catch {
      // silencioso, no es crítico
    }
  }
  cargarMaterias();
}, []);
function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
  const value = e.target.value;
  setMateria(value);
  setHighlightedIndex(-1);

  if (value.trim().length === 0) {
    setSugerencias([]);
    setDropdownOpen(false);
    return;
  }

  const filtradas = catalogoMaterias.filter((m) =>
    m.toLowerCase().includes(value.trim().toLowerCase())
  );

  setSugerencias(filtradas);
  setDropdownOpen(filtradas.length > 0);
}

  function handleSelectSugerencia(sugerencia: string) {
    setMateria(sugerencia);
    setDropdownOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!dropdownOpen || sugerencias.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < sugerencias.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : sugerencias.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectSugerencia(sugerencias[highlightedIndex]);
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  }

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDropdownOpen(false);
   setLoadingAction(true);
setError("");
setSearched(false);
setAsesores([]);

    if (!materia.trim()) {
      setError("Escribe una materia para buscar.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost/asesored-api/buscar_asesores.php?materia=${encodeURIComponent(materia.trim())}`
      );
      const data = await res.json();

      if (data.success) {
        setAsesores(data.asesores);
        setSearched(true);
      } else {
        setError(data.message || "No se pudo realizar la búsqueda.");
      }
    } catch {
      showError("No se pudo completar la búsqueda. Intenta nuevamente.");
    } finally {
      setLoadingAction(false);
    }
  }

  return (
    <div className="section-card">
      <div className="section-header">
        <span className="section-title">Buscar asesor por materia</span>
      </div>

      <div className="section-body">
        <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
          Escribe una materia y el sistema mostrará los asesores activos relacionados con esa búsqueda.
        </p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSearch} style={{ display: "grid", gap: 14, marginBottom: 20 }}>
          <div className="input-wrap" style={{ marginBottom: 0, position: "relative" }}>
            <label>Materia</label>
            <input
              ref={inputRef}
              className="field"
              style={{ paddingLeft: 16 }}
              value={materia}
              onChange={handleInputChange}
              onFocus={() => sugerencias.length > 0 && setDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Ej. Cálculo, Física, Programación..."
              autoComplete="off"
            />

            {/* Indicador de carga dentro del input */}
           

            {/* Dropdown de sugerencias */}
            {dropdownOpen && sugerencias.length > 0 && (
              <div
                ref={dropdownRef}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 100,
                  maxHeight: 200,
                  overflowY: "auto",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  background: "var(--surface)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                  marginTop: 4,
                }}
              >
                {sugerencias.map((s, index) => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectSugerencia(s);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "11px 14px",
                      border: "none",
                      borderBottom: index < sugerencias.length - 1
                        ? "1px solid var(--border)"
                        : "none",
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
                    🔍 {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loadingAction}>
            {loadingAction ? "Buscando..." : "Buscar asesores"}
          </button>
        </form>

        {searched && asesores.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔎</div>
            <div>
              <div className="empty-state-title">No se encontraron asesores</div>
              <div className="empty-state-text">
                No hay asesores activos relacionados con la materia que escribiste. Intenta con otro nombre o una materia más general.
              </div>
            </div>
          </div>
        )}

        {asesores.length > 0 && (
          <div className="asesor-list">
            {asesores.map((asesor) => (
              <div key={`${asesor.id}-${asesor.materia}`} className="asesor-item">
                <div className="asesor-avatar" style={{ background: "rgba(255,255,255,.08)" }}>
                  👨‍🏫
                </div>
                <div className="asesor-info">
                  <div className="asesor-name">{asesor.nombre} {asesor.apellido}</div>
                  <div className="asesor-subject">{asesor.materia}</div>
                  <div style={{ marginTop: 6, color: "var(--text-muted)", fontSize: 12.5 }}>
                    {asesor.email}
                  </div>
                </div>
                <button className="btn-sm" onClick={() => onSelectAsesor?.(asesor)}>
                  Ver perfil
                </button>
              </div>
            ))}
          </div>
        )}
        {toast && (
  <Toast
    message={toast.message}
    type={toast.type}
    onClose={() => setToast(null)}
  />
)}
      </div>
    </div>
    
  );
  
}

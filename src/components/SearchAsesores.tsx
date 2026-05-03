import { useState, useRef, useEffect } from "react";

interface AsesorResult {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  materia: string;
  materias_array?: string[];
}

interface SearchAsesoresProps {
  onSelectAsesor?: (asesor: AsesorResult) => void;
}

type Modo = "materia" | "nombre";

export default function SearchAsesores({ onSelectAsesor }: SearchAsesoresProps) {
  const [modo, setModo] = useState<Modo>("materia");

  // Búsqueda por materia
  const [materia, setMateria] = useState("");
  const [asesores, setAsesores] = useState<AsesorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [loadingSugerencias, setLoadingSugerencias] = useState(false);
  const [catalogoMaterias, setCatalogoMaterias] = useState<string[]>([]);

  // Búsqueda por nombre
  const [nombreQuery, setNombreQuery] = useState("");
  const [asesoresPorNombre, setAsesoresPorNombre] = useState<AsesorResult[]>([]);
  const [loadingNombre, setLoadingNombre] = useState(false);
  const [searchedNombre, setSearchedNombre] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cargar catálogo de materias
  useEffect(() => {
    async function cargarMaterias() {
      try {
        const res = await fetch("http://localhost/asesored-api/obtener_materias.php");
        const data = await res.json();
        if (data.success) {
          setCatalogoMaterias(data.materias.map((m: { nombre: string }) => m.nombre));
        }
      } catch {}
    }
    cargarMaterias();
  }, []);

  // Cierra dropdown al click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll al item resaltado
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const item = dropdownRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

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
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIndex((prev) => prev < sugerencias.length - 1 ? prev + 1 : 0); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIndex((prev) => prev > 0 ? prev - 1 : sugerencias.length - 1); }
    else if (e.key === "Enter" && highlightedIndex >= 0) { e.preventDefault(); handleSelectSugerencia(sugerencias[highlightedIndex]); }
    else if (e.key === "Escape") { setDropdownOpen(false); setHighlightedIndex(-1); }
  }

  async function handleSearchMateria(e: React.FormEvent) {
    e.preventDefault();
    setDropdownOpen(false);
    setError("");
    setSearched(false);
    setAsesores([]);

    if (!materia.trim()) { setError("Escribe una materia para buscar."); return; }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost/asesored-api/buscar_asesores.php?materia=${encodeURIComponent(materia.trim())}`);
      const data = await res.json();
      if (data.success) { setAsesores(data.asesores); setSearched(true); }
      else setError(data.message || "No se pudo realizar la búsqueda.");
    } catch {
      setError("No se pudo completar la búsqueda. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearchNombre(e: React.FormEvent) {
    e.preventDefault();
    setSearchedNombre(false);
    setAsesoresPorNombre([]);
    setError("");

    if (!nombreQuery.trim()) { setError("Escribe un nombre para buscar."); return; }

    setLoadingNombre(true);
    try {
      const res = await fetch(`http://localhost/asesored-api/buscar_asesor_por_nombre.php?nombre=${encodeURIComponent(nombreQuery.trim())}`);
      const data = await res.json();
      if (data.success) { setAsesoresPorNombre(data.asesores); setSearchedNombre(true); }
      else setError(data.message || "No se pudo realizar la búsqueda.");
    } catch {
      setError("No se pudo completar la búsqueda. Intenta nuevamente.");
    } finally {
      setLoadingNombre(false);
    }
  }

  function handleModoChange(nuevoModo: Modo) {
    setModo(nuevoModo);
    setError("");
    setSearched(false);
    setSearchedNombre(false);
    setAsesores([]);
    setAsesoresPorNombre([]);
  }

  const resultadosNombre = asesoresPorNombre;

  return (
    <div className="section-card">
      <div className="section-header">
        <span className="section-title">Buscar asesor</span>
      </div>

      <div className="section-body">
        {/* Toggle de modo */}
        <div style={{
          display: "flex", gap: 8, marginBottom: 20,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border)",
          borderRadius: 12, padding: 4,
          width: "fit-content",
        }}>
          {(["materia", "nombre"] as Modo[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModoChange(m)}
              style={{
                padding: "8px 18px", borderRadius: 9, border: "none",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                transition: "all 0.18s ease",
                background: modo === m ? "var(--teal)" : "transparent",
                color: modo === m ? "#fff" : "var(--text-muted)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {m === "materia" ? "🔍 Por materia" : "👤 Por nombre"}
            </button>
          ))}
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
          {modo === "materia"
            ? "Escribe una materia y el sistema mostrará los asesores activos relacionados."
            : "Escribe el nombre o apellido del asesor que buscas."}
        </p>

        {error && <div className="error-msg">{error}</div>}

        {/* Búsqueda por materia */}
        {modo === "materia" && (
          <form onSubmit={handleSearchMateria} style={{ display: "grid", gap: 14, marginBottom: 20 }}>
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
              {loadingSugerencias && (
                <div style={{ position: "absolute", right: 14, bottom: 13, fontSize: 12, color: "var(--text-muted)" }}>•••</div>
              )}
              {dropdownOpen && sugerencias.length > 0 && (
                <div ref={dropdownRef} style={{
                  position: "absolute", top: "100%", left: 0, right: 0,
                  zIndex: 100, maxHeight: 200, overflowY: "auto",
                  border: "1px solid var(--border)", borderRadius: 12,
                  background: "var(--surface)", boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                  marginTop: 4,
                }}>
                  {sugerencias.map((s, index) => (
                    <button key={s} type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleSelectSugerencia(s); }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      style={{
                        width: "100%", textAlign: "left", padding: "11px 14px",
                        border: "none",
                        borderBottom: index < sugerencias.length - 1 ? "1px solid var(--border)" : "none",
                        background: highlightedIndex === index ? "rgba(37,99,235,0.10)" : "transparent",
                        color: "var(--text-primary)", cursor: "pointer",
                        fontFamily: "Outfit, sans-serif", fontSize: 14, transition: "background 0.15s",
                      }}
                    >
                      🔍 {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="spinner spinner-sm" /> Buscando...
                </span>
              ) : "Buscar asesores"}
            </button>
          </form>
        )}

        {/* Búsqueda por nombre */}
        {modo === "nombre" && (
          <form onSubmit={handleSearchNombre} style={{ display: "grid", gap: 14, marginBottom: 20 }}>
            <div className="input-wrap" style={{ marginBottom: 0 }}>
              <label>Nombre del asesor</label>
              <input
                className="field"
                style={{ paddingLeft: 16 }}
                value={nombreQuery}
                onChange={(e) => setNombreQuery(e.target.value)}
                placeholder="Ej. Juan, García, Juan García..."
                autoComplete="off"
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loadingNombre}>
              {loadingNombre ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="spinner spinner-sm" /> Buscando...
                </span>
              ) : "Buscar asesor"}
            </button>
          </form>
        )}

        {/* Resultados por materia */}
        {modo === "materia" && searched && asesores.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔎</div>
            <div>
              <div className="empty-state-title">No se encontraron asesores</div>
              <div className="empty-state-text">No hay asesores activos para esa materia. Intenta con otro nombre.</div>
            </div>
          </div>
        )}

        {modo === "materia" && asesores.length > 0 && (
          <div className="asesor-list">
            {asesores.map((asesor) => (
              <div key={`${asesor.id}-${asesor.materia}`} className="asesor-item">
                <div className="asesor-avatar" style={{ background: "rgba(255,255,255,.08)" }}>👨‍🏫</div>
                <div className="asesor-info">
                  <div className="asesor-name">{asesor.nombre} {asesor.apellido}</div>
                  <div className="asesor-subject">{asesor.materia}</div>
                  <div style={{ marginTop: 6, color: "var(--text-muted)", fontSize: 12.5 }}>{asesor.email}</div>
                </div>
                <button className="btn-sm" onClick={() => onSelectAsesor?.(asesor)}>Ver perfil</button>
              </div>
            ))}
          </div>
        )}

        {/* Resultados por nombre */}
        {modo === "nombre" && searchedNombre && resultadosNombre.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔎</div>
            <div>
              <div className="empty-state-title">No se encontraron asesores</div>
              <div className="empty-state-text">No hay asesores activos con ese nombre. Intenta con otro término.</div>
            </div>
          </div>
        )}

        {modo === "nombre" && resultadosNombre.length > 0 && (
          <div className="asesor-list">
            {resultadosNombre.map((asesor) => (
              <div key={asesor.id} className="asesor-item">
                <div className="asesor-avatar" style={{ background: "rgba(255,255,255,.08)" }}>👨‍🏫</div>
                <div className="asesor-info">
                  <div className="asesor-name">{asesor.nombre} {asesor.apellido}</div>
                  <div className="asesor-subject">
                    {asesor.materias_array && asesor.materias_array.length > 0
                      ? asesor.materias_array.join(" · ")
                      : "Sin materias asignadas"}
                  </div>
                  <div style={{ marginTop: 6, color: "var(--text-muted)", fontSize: 12.5 }}>{asesor.email}</div>
                </div>
                <button
                  className="btn-sm"
                  onClick={() => onSelectAsesor?.({
                    ...asesor,
                    materia: asesor.materias_array?.[0] || "",
                  })}
                >
                  Ver perfil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
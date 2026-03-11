import { useState } from "react";

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

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSearched(false);
    setAsesores([]);

    if (!materia.trim()) {
      setError("Escribe una materia para buscar.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost/asesored-api/buscar_asesores.php?materia=${encodeURIComponent(materia)}`
      );

      const data = await response.json();

      if (data.success) {
        setAsesores(data.asesores);
        setSearched(true);
      } else {
        setError(data.message || "No se pudo realizar la búsqueda.");
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
        <span className="section-title">Buscar asesor por materia</span>
      </div>

      <div className="section-body">
        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSearch} style={{ display: "grid", gap: 14, marginBottom: 18 }}>
          <div className="input-wrap" style={{ marginBottom: 0 }}>
            <label>Materia</label>
            <input
              className="field"
              style={{ paddingLeft: 16 }}
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
              placeholder="Ej. Cálculo"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Buscando..." : "Buscar asesores"}
          </button>
        </form>

        {searched && asesores.length === 0 && (
          <div className="error-msg">Sin asesores disponibles</div>
        )}

        {asesores.length > 0 && (
          <div className="asesor-list">
            {asesores.map((asesor) => (
              <div key={`${asesor.id}-${asesor.materia}`} className="asesor-item">
                <div
                  className="asesor-avatar"
                  style={{ background: "rgba(255,255,255,.08)" }}
                >
                  👨‍🏫
                </div>

                <div className="asesor-info">
                  <div className="asesor-name">
                    {asesor.nombre} {asesor.apellido}
                  </div>
                  <div className="asesor-subject">{asesor.materia}</div>
                </div>

                <button
                  className="btn-sm"
                  onClick={() => onSelectAsesor?.(asesor)}
                >
                  Ver horario
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
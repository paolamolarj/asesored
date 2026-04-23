import { useEffect, useState } from "react";

interface AsesorData {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  materia?: string;
}

interface PerfilAsesor {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  activo: number;
}

interface PerfilResponse {
  asesor: PerfilAsesor;
  materias: string[];
  stats: {
    total_asesorias: number | string;
    completadas: number | string;
  };
}

interface AsesorProfileProps {
  asesor: AsesorData | null;
}

export default function AsesorProfile({ asesor }: AsesorProfileProps) {
  const [perfil, setPerfil] = useState<PerfilResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPerfil() {
      if (!asesor?.id) return;

      setLoading(true);
      setError("");
      setPerfil(null);

      try {
        const response = await fetch(
          `http://localhost/asesored-api/obtener_perfil_asesor.php?asesor_id=${asesor.id}`
        );

        const data = await response.json();

        if (data.success) {
          setPerfil(data);
        } else {
          setError(data.message || "No se pudo cargar el perfil del asesor.");
        }
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    }

    fetchPerfil();
  }, [asesor]);

  if (!asesor) return null;

  return (
    <div className="section-card" style={{ marginBottom: 24 }}>
      <div className="section-header">
        <span className="section-title">Perfil del asesor</span>
      </div>

      <div className="section-body">
        {loading && <div className="success-msg">Cargando perfil...</div>}
        {error && <div className="error-msg">{error}</div>}

        {perfil && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div
                className="asesor-avatar"
                style={{
                  width: 60,
                  height: 60,
                  fontSize: 24,
                  background: "rgba(255,255,255,.08)",
                }}
              >
                🎓
              </div>

              <div>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    marginBottom: 4,
                    lineHeight: 1.1,
                  }}
                >
                  {perfil.asesor.nombre} {perfil.asesor.apellido}
                </h3>

                <p style={{ color: "var(--text-muted)", marginBottom: 8, fontSize: 14 }}>
                  {perfil.asesor.email}
                </p>

                <span className={`status-badge ${perfil.asesor.activo ? "confirm" : "cancel"}`}>
                  {perfil.asesor.activo ? "Asesor activo" : "Asesor inactivo"}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: ".04em",
                }}
              >
                Materias que imparte
              </div>

              {perfil.materias.length === 0 ? (
                <div className="error-msg">Este asesor aún no tiene materias registradas.</div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {perfil.materias.map((materia) => (
                    <div
                      key={materia}
                      style={{
                        background: "rgba(0,201,167,.10)",
                        border: "1px solid rgba(0,201,167,.25)",
                        color: "var(--teal)",
                        padding: "8px 12px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {materia}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
              }}
            >
              <div className="stat-card teal">
                <div className="stat-value">{perfil.stats.total_asesorias}</div>
                <div className="stat-label">Asesorías registradas</div>
              </div>

              <div className="stat-card purple">
                <div className="stat-value">{perfil.stats.completadas}</div>
                <div className="stat-label">Asesorías completadas</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
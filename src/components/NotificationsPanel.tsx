import { useEffect, useState } from "react";

interface LoggedUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  rol?: string;
}

interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  leida: number;
  created_at: string;
}

export default function NotificationsPanel() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const savedUser = localStorage.getItem("asesored_user");
  const user: LoggedUser | null = savedUser ? JSON.parse(savedUser) : null;

  async function fetchNotificaciones() {
    if (!user?.id) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost/asesored-api/obtener_notificaciones.php?usuario_id=${user.id}`
      );

      const data = await response.json();

      if (data.success) {
        setNotificaciones(data.notificaciones || []);
      } else {
        setError(data.message || "No se pudieron cargar las notificaciones.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotificaciones();
  }, [user?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotificaciones();
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  async function marcarLeida(notificacionId: number) {
    if (!user?.id) return;

    try {
      await fetch("http://localhost/asesored-api/marcar_notificacion_leida.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificacion_id: notificacionId,
          usuario_id: user.id,
        }),
      });

      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id === notificacionId ? { ...n, leida: 1 } : n
        )
      );
    } catch (err) {
      console.error("No se pudo marcar la notificación como leída");
    }
  }

  async function marcarTodasLeidas() {
    if (!user?.id) return;

    setActionLoading(true);

    try {
      const response = await fetch("http://localhost/asesored-api/marcar_todas_leidas.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotificaciones((prev) =>
          prev.map((n) => ({ ...n, leida: 1 }))
        );
      }
    } catch (err) {
      console.error("No se pudieron marcar todas como leídas");
    } finally {
      setActionLoading(false);
    }
  }

  async function limpiarLeidas() {
    if (!user?.id) return;

    setActionLoading(true);

    try {
      const response = await fetch("http://localhost/asesored-api/limpiar_notificaciones_leidas.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotificaciones((prev) => prev.filter((n) => !Number(n.leida)));
      }
    } catch (err) {
      console.error("No se pudieron limpiar las notificaciones leídas");
    } finally {
      setActionLoading(false);
    }
  }

  function formatFecha(fecha: string) {
    const d = new Date(fecha);
    return d.toLocaleString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const unreadCount = notificaciones.filter((n) => !Number(n.leida)).length;

  return (
    <div style={{ position: "relative" }}>
      <button
        className="icon-btn"
        style={{ cursor: "pointer" }}
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) fetchNotificaciones();
        }}
      >
        🔔
        {unreadCount > 0 && <div className="notif-dot" />}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "48px",
            right: 0,
            width: 380,
            maxHeight: 460,
            overflowY: "auto",
            background: "var(--navy-light)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,.45)",
            zIndex: 200,
            padding: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
              padding: "4px 6px",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 15 }}>
              Notificaciones
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="btn-sm"
                onClick={marcarTodasLeidas}
                disabled={actionLoading || notificaciones.length === 0}
              >
                Marcar todas
              </button>

              <button
                type="button"
                className="btn-sm"
                onClick={limpiarLeidas}
                disabled={actionLoading || notificaciones.length === 0}
              >
                Limpiar leídas
              </button>
            </div>
          </div>

          {loading && <div className="success-msg">Cargando...</div>}
          {error && <div className="error-msg">{error}</div>}

          {!loading && !error && notificaciones.length === 0 && (
            <div
              style={{
                color: "var(--text-muted)",
                fontSize: 14,
                padding: 10,
              }}
            >
              No tienes notificaciones.
            </div>
          )}

          {!loading &&
            !error &&
            notificaciones.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => marcarLeida(n.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: Number(n.leida)
                    ? "transparent"
                    : "rgba(0,201,167,.08)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 10,
                  cursor: "pointer",
                  color: "var(--text-primary)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>
                    {n.titulo}
                  </span>

                  {!Number(n.leida) && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--teal)",
                      }}
                    >
                      Nueva
                    </span>
                  )}
                </div>

                <div
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 13,
                    lineHeight: 1.5,
                    marginBottom: 8,
                  }}
                >
                  {n.mensaje}
                </div>

                <div
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 11.5,
                  }}
                >
                  {formatFecha(n.created_at)}
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
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
        setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: 1 })));
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
        <div className="notifications-panel">
          <div className="notifications-panel-header">
            <div className="notifications-panel-title">Notificaciones</div>

            <div className="notifications-panel-actions">
              <button
                type="button"
                className="notifications-action-btn"
                onClick={marcarTodasLeidas}
                disabled={actionLoading || notificaciones.length === 0}
              >
                Marcar todas
              </button>

              <button
                type="button"
                className="notifications-action-btn"
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
            <div className="empty-state notifications-empty">
              <div className="empty-state-icon">🔔</div>
              <div>
                <div className="empty-state-title">Sin notificaciones</div>
                <div className="empty-state-text">
                  Aquí aparecerán avisos sobre solicitudes, cancelaciones, recordatorios y cambios de estado.
                </div>
              </div>
            </div>
          )}

          {!loading &&
            !error &&
            notificaciones.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => marcarLeida(n.id)}
                className={`notification-item ${Number(n.leida) ? "read" : "unread"}`}
              >
                <div className="notification-item-top">
                  <span className="notification-item-title">{n.titulo}</span>

                  {!Number(n.leida) && (
                    <span className="notification-pill">Nueva</span>
                  )}
                </div>

                <div className="notification-item-message">{n.mensaje}</div>

                <div className="notification-item-date">
                  {formatFecha(n.created_at)}
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
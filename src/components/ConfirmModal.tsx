import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "default";
}

export default function ConfirmModal({
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmModalProps) {
  const confirmColors = {
    danger: "#f87171",
    warning: "#fbbf24",
    default: "var(--teal)",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        padding: 20,
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 28,
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          animation: "slideUp 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background:
                variant === "danger"
                  ? "rgba(248,113,113,0.15)"
                  : variant === "warning"
                  ? "rgba(251,191,36,0.15)"
                  : "rgba(0,201,167,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertTriangle
              size={20}
              color={confirmColors[variant]}
            />
          </div>
          <p style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 500, lineHeight: 1.5 }}>
            {message}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "9px 18px",
              borderRadius: 9,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: "9px 18px",
              borderRadius: 9,
              border: "none",
              background: confirmColors[variant],
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
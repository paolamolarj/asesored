import { useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2600);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast-fixed ${type}`}>
      <div className="toast-icon">
        {type === "success" ? (
          <CheckCircle2 size={18} />
        ) : (
          <AlertCircle size={18} />
        )}
      </div>

      <div className="toast-content">
        <div className="toast-title">
          {type === "success" ? "Éxito" : "Error"}
        </div>
        <div className="toast-message">{message}</div>
      </div>

      <button className="toast-close" onClick={onClose} type="button">
        ×
      </button>
    </div>
  );
}
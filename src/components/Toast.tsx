import { Zap } from "lucide-react";

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="toast">
      <Zap size={16} color="var(--teal)" />
      <span style={{ fontSize:14, fontWeight:500 }}>{message}</span>
    </div>
  );
}
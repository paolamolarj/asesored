import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import STYLES from "./styles/globalStyles";
import type { Page } from "./types";

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("asesored_user");

    if (savedUser) {
      setPage("dashboard");
    } else {
      setPage("login");
    }

    setLoadingSession(false);
  }, []);

  if (loadingSession) {
    return (
      <>
        <style>{STYLES}</style>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--navy)",
            color: "var(--text-primary)",
            fontFamily: "Outfit, sans-serif",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid rgba(255,255,255,0.15)",
              borderTopColor: "var(--teal)",
              borderRadius: "50%",
              animation: "spin .7s linear infinite",
            }}
          />
          <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
            Cargando sesión...
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>

      {page === "login" && (
        <LoginPage
          goRegister={() => setPage("register")}
          goLogin={() => setPage("dashboard")}
        />
      )}

      {page === "register" && (
        <RegisterPage
          goLogin={() => setPage("login")}
        />
      )}

      {page === "dashboard" && (
        <Dashboard
          goLogout={() => setPage("login")}
        />
      )}
    </>
  );
}
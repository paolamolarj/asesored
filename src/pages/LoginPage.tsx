import { useState } from "react";
import {
  BookOpen,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ChevronRight,
  XCircle,
} from "lucide-react";
import type { LoginPageProps } from "../types";

export default function LoginPage({ goRegister, goLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email || !pass) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (!email.includes("@")) {
      setError("Ingresa un correo válido.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost/asesored-api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pass }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("asesored_user", JSON.stringify(data.user));
        goLogin();
      } else {
        setError(data.message || "Correo o contraseña incorrectos.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-panel">
        <div className="auth-panel-grid" />

        <div
          className="shape anim-float"
          style={{
            width: 90,
            height: 90,
            background: "linear-gradient(135deg,var(--teal),#00a88b)",
            top: "12%",
            right: "15%",
            animationDelay: "0s",
            opacity: 0.35,
          }}
        />
        <div
          className="shape anim-float"
          style={{
            width: 55,
            height: 55,
            background: "linear-gradient(135deg,var(--amber),#ffd060)",
            top: "35%",
            left: "8%",
            animationDelay: "1.2s",
            opacity: 0.4,
          }}
        />
        <div
          className="shape anim-float"
          style={{
            width: 70,
            height: 70,
            background: "linear-gradient(135deg,#7c3aed,#a78bfa)",
            bottom: "25%",
            right: "8%",
            animationDelay: "0.7s",
            opacity: 0.3,
          }}
        />
        <div
          className="shape anim-float"
          style={{
            width: 40,
            height: 40,
            background: "var(--rose)",
            bottom: "15%",
            left: "20%",
            animationDelay: "1.8s",
            opacity: 0.35,
          }}
        />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 380 }}>
          <div
            className="anim-fade-up d1"
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "linear-gradient(135deg,var(--teal),#00a88b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 28px",
            }}
          >
            <BookOpen size={36} color="#0D1B2A" />
          </div>

          <h1
            className="syne anim-fade-up d2"
            style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.1, marginBottom: 16, color: "white" }}
          >
            Bienvenido a
            <br />
            <span
              style={{
                background: "linear-gradient(90deg,var(--teal),#00e8c0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AsesoRed
            </span>
          </h1>

          <p
            className="anim-fade-up d3"
            style={{ color: "var(--text-muted)", fontSize: 17, lineHeight: 1.6, marginBottom: 40 }}
          >
            La plataforma de asesorías académicas del IEST Anáhuac. Conecta, aprende y crece junto a tu comunidad.
          </p>

          <div className="anim-fade-up d4" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
  { icon:"🎓", text:"Encuentra apoyo académico por materia" },
  { icon:"⭐", text:"Conecta con asesores disponibles" },
  { icon:"📅", text:"Solicita y administra tus asesorías" },
].map((item, i) => (
              <div
  key={i}
  style={{
    display:"flex",
    alignItems:"center",
    gap:12,
    background:"rgba(255,255,255,.04)",
    border:"1px solid rgba(255,255,255,.07)",
    borderRadius:14,
    padding:"13px 16px",
    textAlign:"left",
    backdropFilter:"blur(8px)"
  }}
>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 14.5, fontWeight: 500 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card anim-scale-in">
          <h2
  className="syne"
  style={{
    fontSize: 30,
    fontWeight: 800,
    marginBottom: 6,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    color: "white"
  }}
>
  Iniciar sesión
</h2>

          <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 28 }}>
            ¿No tienes cuenta?{" "}
            <button className="link-btn" onClick={goRegister}>
              Regístrate gratis
            </button>
          </p>

          {error && (
            <div className="error-msg">
              <XCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-wrap">
              <label>Correo institucional</label>
              <span className="icon">
                <Mail size={17} />
              </span>
              <input
                className="field"
                type="email"
                placeholder="usuario@anahuac.mx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-wrap">
              <label>Contraseña</label>
              <span className="icon">
                <Lock size={17} />
              </span>
              <input
                className="field"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                style={{ paddingRight: 48 }}
              />
              <button
                type="button"
                className="icon-right"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 22, marginTop: -6 }}>
              <button type="button" className="link-btn" style={{ fontSize: 13 }}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      border: "2.5px solid rgba(0,0,0,.3)",
                      borderTopColor: "#0D1B2A",
                      borderRadius: "50%",
                      animation: "spin .7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Verificando...
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="divider">o continúa con</div>

          <button className="btn-google">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 12.5,
              marginTop: 24,
              lineHeight: 1.6,
            }}
          >
            Al ingresar aceptas los{" "}
            <button className="link-btn" style={{ fontSize: 12.5 }}>
              Términos de Uso
            </button>{" "}
            y{" "}
            <button className="link-btn" style={{ fontSize: 12.5 }}>
              Política de Privacidad
            </button>{" "}
            de AsesoRed.
          </p>
        </div>
      </div>
    </div>
  );
}
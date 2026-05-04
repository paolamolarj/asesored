import { useState, useRef } from "react";
import {
  BookOpen, Eye, EyeOff, Mail, Lock, ChevronRight, XCircle, ArrowDown,
} from "lucide-react";
import type { LoginPageProps } from "../types";

export default function LoginPage({ goRegister, goLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formRef = useRef<HTMLDivElement>(null);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email || !pass) { setError("Por favor completa todos los campos."); return; }
    if (!email.includes("@")) { setError("Ingresa un correo válido."); return; }

    setLoading(true);
    try {
      const response = await fetch("http://localhost/asesored-api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("asesored_user", JSON.stringify(data.user));
        goLogin();
      } else {
        setError(data.message || "Correo o contraseña incorrectos.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root">
      {/* Panel izquierdo */}
      <div className="auth-panel">
        <div className="auth-panel-grid" />

        {[
          { w:90, h:90, bg:"linear-gradient(135deg,var(--teal),#00a88b)", top:"12%", right:"15%", delay:"0s", op:0.35 },
          { w:55, h:55, bg:"linear-gradient(135deg,var(--amber),#ffd060)", top:"35%", left:"8%", delay:"1.2s", op:0.4 },
          { w:70, h:70, bg:"linear-gradient(135deg,#7c3aed,#a78bfa)", bottom:"25%", right:"8%", delay:"0.7s", op:0.3 },
          { w:40, h:40, bg:"var(--rose)", bottom:"15%", left:"20%", delay:"1.8s", op:0.35 },
        ].map((s, i) => (
          <div key={i} className="shape anim-float" style={{
            width: s.w, height: s.h, background: s.bg,
            top: s.top, right: s.right, bottom: s.bottom, left: s.left,
            animationDelay: s.delay, opacity: s.op,
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 380 }}>
          <div className="anim-fade-up d1" style={{
            width: 72, height: 72, borderRadius: 18,
            background: "linear-gradient(135deg,var(--teal),#00a88b)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 28px",
          }}>
            <BookOpen size={36} color="#0D1B2A" />
          </div>

          <h1 className="syne anim-fade-up d2" style={{
            fontSize: 42, fontWeight: 800, lineHeight: 1.1,
            marginBottom: 16, color: "white",
          }}>
            Bienvenido a<br />
            <span style={{
              background: "linear-gradient(90deg,var(--teal),#60A5FA)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              AsesoRed
            </span>
          </h1>

          <p className="anim-fade-up d3" style={{
            color: "var(--text-muted)", fontSize: 17, lineHeight: 1.6, marginBottom: 40,
          }}>
            La plataforma de asesorías académicas del IEST Anáhuac. Conecta, aprende y crece junto a tu comunidad.
          </p>

          <div className="anim-fade-up d4" style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
            {[
              { icon: "🎓", text: "Encuentra apoyo académico por materia" },
              { icon: "⭐", text: "Conecta con asesores disponibles" },
              { icon: "📅", text: "Solicita y administra tus asesorías" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "rgba(255,255,255,.04)",
                border: "1px solid rgba(255,255,255,.07)",
                borderRadius: 14, padding: "13px 16px", textAlign: "left",
                backdropFilter: "blur(8px)",
              }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 14.5, fontWeight: 500 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Botón mobile para bajar al formulario */}
          <button
            onClick={scrollToForm}
            className="auth-scroll-btn anim-fade-up d5"
          >
            <span>Iniciar sesión</span>
            <ArrowDown size={18} />
          </button>
        </div>
      </div>

      {/* Panel derecho / formulario */}
      <div ref={formRef} className="auth-form-side">
        <div className="auth-card anim-scale-in">
          <h2 className="syne" style={{
            fontSize: 28, fontWeight: 800, marginBottom: 6,
            lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--text-primary)",
          }}>
            Iniciar sesión
          </h2>

          <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 28 }}>
            ¿No tienes cuenta?{" "}
            <button className="link-btn" onClick={goRegister}>Regístrate gratis</button>
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
              <span className="icon"><Mail size={17} /></span>
              <input
                className="field"
                type="email"
                placeholder="usuario@iest.edu.mx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-wrap">
              <label>Contraseña</label>
              <span className="icon"><Lock size={17} /></span>
              <input
                className="field"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                style={{ paddingRight: 48 }}
              />
              <button type="button" className="icon-right" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner" />
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

          <p style={{
            textAlign: "center", color: "var(--text-muted)",
            fontSize: 12.5, marginTop: 24, lineHeight: 1.6,
          }}>
            Al ingresar aceptas los{" "}
            <button className="link-btn" style={{ fontSize: 12.5 }}>Términos de Uso</button>
            {" "}y{" "}
            <button className="link-btn" style={{ fontSize: 12.5 }}>Política de Privacidad</button>
            {" "}de AsesoRed.
          </p>
        </div>
      </div>
    </div>
  );
}
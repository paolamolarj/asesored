import { useState } from "react";
import {
  Users,
  ChevronRight,
  CheckCircle,
  XCircle,
  User,
  Award,
  Mail,
  Phone,
  BookOpen,
  TrendingUp,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import type { RegisterPageProps } from "../types";

const CARRERAS = [
  "Ingeniería en Sistemas",
  "Administración de Empresas",
  "Contaduría Pública",
  "Mercadotecnia",
  "Derecho",
  "Diseño Gráfico",
  "Psicología",
  "Arquitectura",
];

export default function RegisterPage({ goLogin }: RegisterPageProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre:"",
    apellido:"",
    matricula:"",
    email:"",
    telefono:"",
    carrera:"",
    semestre:"",
    rol:"alumno",
    pass:"",
    pass2:"",
  });

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function upd(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

 async function next(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError("");

  if (step === 1) {
    if (!form.nombre || !form.apellido || !form.matricula || !form.email) {
      setError("Completa todos los campos.");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Ingresa un correo válido.");
      return;
    }

    setStep(2);
    return;
  }

  if (!form.carrera || !form.semestre) {
    setError("Selecciona tu carrera y semestre.");
    return;
  }

  if (!form.pass || !form.pass2) {
    setError("Ingresa y confirma tu contraseña.");
    return;
  }

  if (form.pass.length < 8) {
    setError("La contraseña debe tener al menos 8 caracteres.");
    return;
  }

  if (form.pass !== form.pass2) {
    setError("Las contraseñas no coinciden.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("http://localhost/asesored-api/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (data.success) {
      alert("Usuario registrado correctamente");
      goLogin();
    } else {
      setError(data.message || "Error al registrar usuario");
    }
  } catch (err) {
    setError("No se pudo conectar con el servidor");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="auth-root">
      <div className="auth-panel">
        <div className="auth-panel-grid" />
        <div className="shape anim-float" style={{ width:80,height:80,background:"linear-gradient(135deg,var(--amber),#ffd060)",top:"15%",right:"10%",animationDelay:"0.3s",opacity:.35,borderRadius:20 }} />
        <div className="shape anim-float" style={{ width:60,height:60,background:"linear-gradient(135deg,var(--rose),#ff9f9f)",bottom:"20%",left:"10%",animationDelay:"1s",opacity:.3,borderRadius:"50%" }} />
        <div className="shape anim-float" style={{ width:50,height:50,background:"linear-gradient(135deg,var(--teal),#00e8c0)",top:"45%",left:"5%",animationDelay:"1.8s",opacity:.3,borderRadius:12 }} />

        <div style={{ position:"relative",zIndex:1,textAlign:"center",maxWidth:360 }}>
          <div style={{ width:72,height:72,borderRadius:18,background:"linear-gradient(135deg,var(--amber),#ffd060)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 28px" }}>
            <Users size={36} color="#0D1B2A" />
          </div>

          <h1 className="syne anim-fade-up d1" style={{ fontSize:38,fontWeight:800,lineHeight:1.15,marginBottom:16, color:"white" }}>
            Únete a la comunidad
            <br />
            <span style={{ background:"linear-gradient(90deg,var(--amber),#ffd060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
              Anáhuac
            </span>
          </h1>

          <p className="anim-fade-up d2" style={{ color:"var(--text-muted)",fontSize:16,lineHeight:1.6,marginBottom:36 }}>
            Crea tu cuenta en minutos y empieza a conectar con asesores y estudiantes de tu institución.
          </p>

          <div className="anim-fade-up d3" style={{ display:"flex",gap:12,justifyContent:"center" }}>
            {[1, 2].map((s) => (
              <div key={s} style={{ display:"flex",alignItems:"center",gap:8 }}>
                <div
                  style={{
                    width:38,
                    height:38,
                    borderRadius:12,
                    background: step >= s ? "linear-gradient(135deg,var(--teal),#00a88b)" : "rgba(255,255,255,.08)",
                    border: step >= s ? "none" : "1.5px solid var(--border)",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontWeight:700,
                    fontSize:15,
                    color: step >= s ? "var(--navy)" : "var(--text-muted)",
                    transition:"all .3s"
                  }}
                >
                  {step > s ? <CheckCircle size={18} /> : s}
                </div>

                <span style={{ color: step >= s ? "var(--text-primary)" : "var(--text-muted)", fontSize:13.5, fontWeight:600 }}>
                  {s === 1 ? "Datos académicos" : "Cuenta y rol"}
                </span>

                {s < 2 && <ChevronRight size={14} color="var(--text-muted)" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card anim-scale-in">
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6 }}>
            <h2 className="syne" style={{ fontSize:26,fontWeight:800, color:"white" }}>
              {step === 1 ? "Datos académicos" : "Tu cuenta"}
            </h2>
            <span style={{ color:"var(--text-muted)",fontSize:13 }}>Paso {step}/2</span>
          </div>

          <p style={{ color:"var(--text-muted)",fontSize:15,marginBottom:24 }}>
            ¿Ya tienes cuenta?{" "}
            <button className="link-btn" onClick={goLogin}>
              Inicia sesión
            </button>
          </p>

          {error && (
            <div className="error-msg">
              <XCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={next}>
            {step === 1 ? (
              <>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                  <div className="input-wrap">
                    <label>Nombre</label>
                    <span className="icon"><User size={16} /></span>
                    <input className="field" placeholder="Juan" value={form.nombre} onChange={(e) => upd("nombre", e.target.value)} />
                  </div>

                  <div className="input-wrap">
                    <label>Apellido</label>
                    <span className="icon"><User size={16} /></span>
                    <input className="field" placeholder="García" value={form.apellido} onChange={(e) => upd("apellido", e.target.value)} />
                  </div>
                </div>

                <div className="input-wrap">
                  <label>ID</label>
                  <span className="icon"><Award size={16} /></span>
                  <input className="field" placeholder="Ej: 2023001234" value={form.matricula} onChange={(e) => upd("matricula", e.target.value)} />
                </div>

                <div className="input-wrap">
                  <label>Correo institucional</label>
                  <span className="icon"><Mail size={16} /></span>
                  <input className="field" type="email" placeholder="usuario@anahuac.mx" value={form.email} onChange={(e) => upd("email", e.target.value)} />
                </div>

                <div className="input-wrap">
                  <label>Teléfono (opcional)</label>
                  <span className="icon"><Phone size={16} /></span>
                  <input className="field" placeholder="+52 614 000 0000" value={form.telefono} onChange={(e) => upd("telefono", e.target.value)} />
                </div>
              </>
            ) : (
              <>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                  <div className="input-wrap">
                    <label>Carrera</label>
                    <span className="icon"><BookOpen size={16} /></span>
                    <select className="field field-select" value={form.carrera} onChange={(e) => upd("carrera", e.target.value)}>
                      <option value="" >Seleccionar...</option>
                      {CARRERAS.map((c) => (
                        <option key={c} value={c}  >{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-wrap">
                    <label>Semestre</label>
                    <span className="icon"><TrendingUp size={16} /></span>
                    <select className="field field-select" value={form.semestre} onChange={(e) => upd("semestre", e.target.value)}>
                      <option value=""  >Semestre</option>
                      {[1,2,3,4,5,6,7,8,9,10].map((s) => (
                        <option key={s} value={s}  >{s}°</option>
                      ))}
                    </select>
                  </div>
                </div>


                <div className="input-wrap" style={{ marginTop:4 }}>
                  <label>Contraseña</label>
                  <span className="icon"><Lock size={16} /></span>
                  <input
                    className="field"
                    type={showPass ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={form.pass}
                    onChange={(e) => upd("pass", e.target.value)}
                    style={{ paddingRight:48 }}
                  />
                  <button type="button" className="icon-right" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="input-wrap">
                  <label>Confirmar contraseña</label>
                  <span className="icon"><Lock size={16} /></span>
                  <input className="field" type="password" placeholder="Repite tu contraseña" value={form.pass2} onChange={(e) => upd("pass2", e.target.value)} />
                </div>
              </>
            )}

            <div style={{ display:"flex",gap:12,marginTop:4 }}>
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                  style={{
                    flex:1,
                    padding:"14px",
                    borderRadius:12,
                    border:"1.5px solid var(--border)",
                    background:"var(--glass)",
                    color:"var(--text-primary)",
                    fontFamily:"'Outfit',sans-serif",
                    fontSize:15,
                    fontWeight:600,
                    cursor:"pointer"
                  }}
                >
                  Atrás
                </button>
              )}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span
                      style={{
                        width:18,
                        height:18,
                        border:"2.5px solid rgba(0,0,0,.3)",
                        borderTopColor:"#0D1B2A",
                        borderRadius:"50%",
                        animation:"spin .7s linear infinite",
                        display:"inline-block"
                      }}
                    />
                    Creando cuenta...
                  </>
                ) : step === 1 ? (
                  <>
                    <span>Continuar</span>
                    <ChevronRight size={18} />
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Crear cuenta</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
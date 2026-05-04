const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ===== VARIABLES ===== */
:root {
  --navy: #0F172A;
  --navy-mid: #162033;
  --navy-light: #1E293B;
  --academic-blue: #1D4ED8;
  --academic-blue-soft: #2563EB;
  --academic-gold: #D97706;
  --academic-green: #059669;
  --academic-red: #DC2626;
  --teal: #2563EB;
  --teal-dim: #1D4ED8;
  --amber: #D97706;
  --rose: #DC2626;
  --text-primary: #F8FAFC;
  --text-muted: #94A3B8;
  --border: rgba(255,255,255,0.08);
  --glass: rgba(255,255,255,0.045);
  --card: rgba(255,255,255,0.06);
  --surface-1: #111827;
  --surface-2: #1E293B;
  --surface: #1E293B;
}

/* ===== BASE ===== */
body {
  font-family: 'Inter', sans-serif;
  background: var(--navy);
  color: var(--text-primary);
  overflow-x: hidden;
}
.syne { font-family: 'Outfit', sans-serif; }

*:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: 2px;
  border-radius: 6px;
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--teal);
  outline-offset: 2px;
}

/* ===== QUICK ACTION BUTTONS (inicio hero) ===== */
.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.09);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.18s ease;
  text-align: left;
  font-family: 'Inter', sans-serif;
}

.quick-action-btn:hover {
  background: rgba(37,99,235,0.12);
  border-color: rgba(37,99,235,0.25);
  transform: translateY(-1px);
}

.quick-action-btn-label {
  font-weight: 700;
  font-size: 14px;
  color: var(--text-primary);
}

.quick-action-btn-desc {
  color: var(--text-muted);
  font-size: 12px;
  margin-top: 2px;
}

body.light-mode .quick-action-btn {
  background: rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.08);
}

body.light-mode .quick-action-btn:hover {
  background: rgba(37,99,235,0.08);
  border-color: rgba(37,99,235,0.20);
}
  
/* ===== ANIMACIONES ===== */
@keyframes fadeUp    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
@keyframes scaleIn   { from { opacity:0; transform:scale(.92); } to { opacity:1; transform:scale(1); } }
@keyframes float     { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
@keyframes spin      { to { transform:rotate(360deg); } }
@keyframes shimmer   { 0% { background-position:-600px 0; } 100% { background-position:600px 0; } }
@keyframes slideRight { from { transform:translateX(-20px); opacity:0; } to { transform:translateX(0); opacity:1; } }
@keyframes slideUp   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

.anim-fade-up  { animation: fadeUp  .7s cubic-bezier(.22,1,.36,1) both; }
.anim-fade-in  { animation: fadeIn  .6s ease both; }
.anim-scale-in { animation: scaleIn .5s cubic-bezier(.22,1,.36,1) both; }
.anim-float    { animation: float 3.5s ease-in-out infinite; }
.anim-slide-r  { animation: slideRight .5s cubic-bezier(.22,1,.36,1) both; }

.d1{animation-delay:.05s} .d2{animation-delay:.12s} .d3{animation-delay:.2s}
.d4{animation-delay:.28s} .d5{animation-delay:.36s} .d6{animation-delay:.44s}
/* Sección label estilo pill */
.section-eyebrow {
  font-size: 11px;
  font-weight: 700;
  color: var(--teal);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.section-heading {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

body.light-mode .section-heading { color: #0F172A; }
body.light-mode .section-eyebrow { color: #1D4ED8; }

/* ===== PERFIL PANEL ===== */
.perfil-trigger {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  color: #fff;
  border: 2px solid transparent;
  transition: border 0.18s ease, transform 0.18s ease;
}
.perfil-trigger:hover { transform: translateY(-1px); }

.perfil-panel {
  position: absolute;
  top: 50px;
  right: 0;
  width: 300px;
  background: linear-gradient(180deg, rgba(17,24,39,0.98) 0%, rgba(15,23,42,0.98) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.40);
  z-index: 300;
  padding: 16px;
  backdrop-filter: blur(16px);
  animation: slideUp 0.2s ease;
}

.perfil-panel-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.perfil-panel-avatar {
  width: 48px;
  height: 48px;
  border-radius: 13px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(124,58,237,0.25);
}

.perfil-panel-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}

.perfil-panel-rol {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(37,99,235,0.12);
  border: 1px solid rgba(37,99,235,0.22);
  color: #93C5FD;
  text-transform: capitalize;
  display: inline-block;
}

.perfil-campos {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.perfil-campo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 11px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
}

.perfil-campo-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: rgba(37,99,235,0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.perfil-campo-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.perfil-campo-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 1px;
}

/* Light mode */
body.light-mode .perfil-panel {
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.09);
  box-shadow: 0 16px 50px rgba(0,0,0,0.14);
}
body.light-mode .perfil-panel-header {
  border-bottom: 1px solid rgba(0,0,0,0.07);
}
body.light-mode .perfil-panel-name { color: #0F172A; }
body.light-mode .perfil-panel-rol {
  background: rgba(37,99,235,0.08);
  border-color: rgba(37,99,235,0.18);
  color: #1D4ED8;
}
body.light-mode .perfil-campo {
  background: #F8FAFC;
  border: 1px solid rgba(0,0,0,0.07);
}
body.light-mode .perfil-campo-icon { background: rgba(37,99,235,0.08); }
body.light-mode .perfil-campo-value { color: #0F172A; }


/* ===== SPINNER ===== */
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.15);
  border-top-color: var(--teal);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
  display: inline-block;
}
.spinner-sm { width: 12px; height: 12px; }

/* ===== AUTH ===== */
.auth-root {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
}
@media(max-width:900px) {
  .auth-root { grid-template-columns: 1fr; }
  .auth-panel { display: none !important; }
}

.auth-panel {
  background:
    radial-gradient(circle at 20% 20%, rgba(37,99,235,0.14), transparent 35%),
    radial-gradient(circle at 80% 30%, rgba(217,119,6,0.10), transparent 30%),
    linear-gradient(145deg, #0F172A 0%, #111827 42%, #1E293B 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 48px;
  position: relative;
  overflow: hidden;
}

.auth-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.00) 35%, rgba(255,255,255,0.015) 100%);
  pointer-events: none;
}

.auth-panel-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(circle at center, black 55%, transparent 95%);
}

.auth-form-side {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(255,255,255,0.01) 100%),
    var(--navy-mid);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 48px 40px;
  position: relative;
  overflow-y: auto;
}

.auth-form-side::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--teal), var(--amber), var(--rose));
}

.auth-card {
  width: 100%;
  max-width: 460px;
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 22px;
  padding: 28px;
  box-shadow: 0 24px 70px rgba(0,0,0,0.28);
  backdrop-filter: blur(10px);
}

/* ===== INPUTS ===== */
.input-wrap {
  position: relative;
  margin-bottom: 18px;
}

.input-wrap label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255,255,255,0.60);
  margin-bottom: 8px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.input-wrap .icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(calc(-50% + 14px));
  color: rgba(255,255,255,0.46);
  pointer-events: none;
  display: flex;
  align-items: center;
}

.input-wrap .icon-right {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(calc(-50% + 14px));
  color: rgba(255,255,255,0.46);
  cursor: pointer;
  background: none;
  border: none;
  display: flex;
  align-items: center;
}

.field {
  width: 100%;
  height: 48px;
  padding: 0 16px 0 46px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  font-size: 14.5px;
  transition: border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
  outline: none;
  line-height: 48px;
}

.field:focus {
  border-color: rgba(37,99,235,0.55);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.14);
  background: rgba(255,255,255,0.055);
}

.field::placeholder { color: var(--text-muted); }

.field-select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 40px;
  cursor: pointer;
  line-height: normal;
}

.field-select option { color: #111827; background: #ffffff; }

textarea.field {
  height: auto;
  min-height: 100px;
  padding: 14px 16px;
  line-height: 1.55;
}

/* ===== BOTONES ===== */
.btn-primary {
  width: 100%;
  min-height: 50px;
  padding: 14px 16px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  background: linear-gradient(135deg, var(--academic-blue) 0%, var(--academic-blue-soft) 100%);
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 10px 24px rgba(37,99,235,0.20);
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 14px 30px rgba(37,99,235,0.26); filter: brightness(1.03); }
.btn-primary:disabled { opacity: 0.65; cursor: not-allowed; transform: none; box-shadow: none; }

.btn-sm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  min-width: 100px;
  max-width: 190px;
  min-height: 34px;
  padding: 7px 14px;
  border: 1px solid rgba(37,99,235,0.26);
  border-radius: 10px;
  background: rgba(37,99,235,0.10);
  color: #93C5FD;
  font-family: 'Inter', sans-serif;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
}
.btn-sm:hover { background: rgba(37,99,235,0.18); border-color: rgba(37,99,235,0.36); color: #DBEAFE; transform: translateY(-1px); }
.btn-sm:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.btn-google {
  width: 100%;
  min-height: 48px;
  padding: 13px 14px;
  border: 1.5px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  background: rgba(255,255,255,0.03);
  color: var(--text-primary);
  font-family: 'Outfit', sans-serif;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease;
}
.btn-google:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); transform: translateY(-1px); }

.theme-toggle {
  width: 40px; height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.035);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.18s ease;
}
.theme-toggle:hover { transform: translateY(-1px); }

/* ===== MISC UI ===== */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0;
  color: var(--text-muted);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.03em;
}
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08); }

.link-btn {
  background: none; border: none; color: var(--teal); cursor: pointer;
  font-family: 'Outfit', sans-serif; font-size: inherit; font-weight: 600;
  transition: color .2s;
}
.link-btn:hover { color: #60A5FA; }

.error-msg, .success-msg {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 13.5px;
  margin-bottom: 18px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.5;
  width: 100%;
}
.error-msg { background: rgba(220,38,38,0.10); border: 1px solid rgba(220,38,38,0.20); color: #FCA5A5; }
.success-msg { background: rgba(5,150,105,0.10); border: 1px solid rgba(5,150,105,0.20); color: #6EE7B7; }

.shape { position: absolute; border-radius: 16px; opacity: .6; }

/* ===== DASHBOARD LAYOUT ===== */
.dash-root {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

/* Mobile: sidebar oculto por defecto */
@media(max-width:900px) {
  .dash-root { grid-template-columns: 1fr; }
  .sidebar {
    position: fixed !important;
    left: -280px;
    top: 0;
    width: 260px;
    height: 100vh;
    z-index: 200;
    transition: left 0.28s cubic-bezier(.22,1,.36,1);
  }
  .sidebar.mobile-open {
    left: 0;
  }
}

/* ===== SIDEBAR ===== */
.sidebar {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(255,255,255,0.01) 100%),
    #06111f;
  border-right: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  padding: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-logo {
  padding: 0px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 64px;
}

.logo-icon {
  width: 42px; height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--academic-blue), var(--academic-blue-soft));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(37,99,235,0.18);
  flex-shrink: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-section { margin-bottom: 24px; }

.nav-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.38);
  padding: 0 12px;
  margin-bottom: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  border-radius: 12px;
  color: rgba(255,255,255,0.65);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  border: none;
  background: transparent;
  width: 100%;
  position: relative;
  text-align: left;
  min-height: 46px;
}
.nav-item:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
.nav-item.active {
  background: linear-gradient(90deg, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0.08) 100%);
  color: #93C5FD;
  box-shadow: inset 0 0 0 1px rgba(37,99,235,0.18);
}
.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0; top: 8px; bottom: 8px;
  width: 3px;
  border-radius: 999px;
  background: var(--teal);
}

.nav-badge {
  margin-left: auto;
  background: var(--rose);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 99px;
}
.nav-badge.teal { background: var(--teal); color: var(--navy); }

.sidebar-user {
  padding: 16px 18px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.015);
  min-height: 72px;
}

.user-avatar {
  width: 40px; height: 40px;
  border-radius: 11px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}

/* ===== OVERLAY MOBILE ===== */
.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 199;
}
.overlay.visible { display: block; }

/* ===== DASH MAIN ===== */
.dash-main {
  overflow-y: auto;
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(37,99,235,0.08), transparent 25%),
    linear-gradient(180deg, #111827 0%, #0F172A 100%);
}

.dash-topbar {
  padding: 0px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: sticky;
  top: 0;
  background: rgba(13,27,42,0.80);
  backdrop-filter: blur(14px);
  z-index: 40;
  min-height: 64px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-btn {
  width: 38px; height: 38px;
  border-radius: 11px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.035);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 0.18s ease;
  position: relative;
  font-size: 16px;
}
.icon-btn:hover { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.06); color: var(--text-primary); transform: translateY(-1px); }

.hamburger { display: none; }
@media(max-width:900px) { .hamburger { display: flex; } }

.notif-dot {
  position: absolute;
  top: 6px; right: 6px;
  width: 8px; height: 8px;
  background: var(--rose);
  border-radius: 50%;
  border: 2px solid #0d1b2a;
}

/* ===== DASH CONTENT ===== */
.dash-content {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content-narrow {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
}

.greeting { margin-bottom: 4px; }

.page-hero-title {
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.page-hero-subtitle {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.65;
  max-width: 720px;
}

/* ===== SECTION CARDS ===== */
.section-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.04) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  transition: transform 0.20s ease, box-shadow 0.20s ease, border-color 0.20s ease;
  width: 100%;
}
.section-card:hover { transform: translateY(-1px); box-shadow: 0 14px 36px rgba(0,0,0,0.22); border-color: rgba(255,255,255,0.11); }

.section-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,0.018);
}

.section-title {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

.section-body { padding: 20px; }

.muted-small { color: var(--text-muted); font-size: 12.5px; line-height: 1.55; }

/* ===== LISTAS ===== */
.asesoria-list, .asesor-list { display: flex; flex-direction: column; gap: 12px; }

.asesoria-item, .asesor-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 14px 16px;
  transition: all 0.18s ease;
}
.asesoria-item:hover, .asesor-item:hover { transform: translateY(-1px); border-color: rgba(37,99,235,0.28); background: rgba(37,99,235,0.05); }

.asesoria-avatar, .asesor-avatar {
  width: 44px; height: 44px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.asesoria-info, .asesor-info { flex: 1; min-width: 0; }

.asesoria-subject, .asesor-name {
  font-weight: 700;
  font-size: 14.5px;
  color: var(--text-primary);
  line-height: 1.35;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.asesoria-meta, .asesor-subject {
  color: var(--text-muted);
  font-size: 12.5px;
  line-height: 1.5;
}

.asesoria-time { text-align: right; flex-shrink: 0; }

.asesoria-hour { font-weight: 800; font-size: 15px; color: var(--teal); line-height: 1.2; }
.asesoria-date { color: var(--text-muted); font-size: 12px; line-height: 1.4; }

/* Mobile: asesoria-item apilado */
@media(max-width:600px) {
  .asesoria-item, .asesor-item {
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .asesoria-time {
    width: 100%;
    text-align: left;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
  }
  .asesoria-date { text-align: left; }
}

/* ===== STATUS BADGES ===== */
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  border: 1px solid transparent;
  white-space: nowrap;
}
.status-badge.pending { background: rgba(217,119,6,0.13); color: #FBBF24; border-color: rgba(217,119,6,0.22); }
.status-badge.confirm { background: rgba(5,150,105,0.13); color: #34D399; border-color: rgba(5,150,105,0.22); }
.status-badge.cancel  { background: rgba(220,38,38,0.13); color: #FCA5A5; border-color: rgba(220,38,38,0.22); }

/* ===== STAT CARDS ===== */
.stat-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.04) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: transform 0.20s ease, box-shadow 0.20s ease;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(0,0,0,0.20); }
.stat-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; }
.stat-card.teal::after   { background: linear-gradient(90deg, var(--teal), #60A5FA); }
.stat-card.amber::after  { background: linear-gradient(90deg, var(--amber), #ffd060); }
.stat-card.rose::after   { background: linear-gradient(90deg, var(--rose), #ff9f9f); }
.stat-card.purple::after { background: linear-gradient(90deg, #7c3aed, #a78bfa); }

.stat-value {
  font-family: 'Outfit', sans-serif;
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 6px;
  color: var(--text-primary);
}
.stat-label { color: var(--text-muted); font-size: 13px; font-weight: 500; line-height: 1.5; }

/* ===== EMPTY STATE ===== */
.empty-state {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  border-radius: 16px;
  background: rgba(255,255,255,0.03);
  border: 1px dashed rgba(255,255,255,0.10);
}
.empty-state-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.06);
  font-size: 20px;
}
.empty-state-title { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
.empty-state-text { font-size: 13px; line-height: 1.6; color: var(--text-muted); }

/* ===== TOAST ===== */
.toast-fixed {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9999;
  min-width: 320px;
  max-width: 420px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  backdrop-filter: blur(12px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.32);
  animation: toastSlideIn 0.25s ease;
}

.toast-fixed.success {
  background: rgba(5, 150, 105, 0.14);
  border: 1px solid rgba(5, 150, 105, 0.28);
  color: #d1fae5;
}

.toast-fixed.error {
  background: rgba(220, 38, 38, 0.14);
  border: 1px solid rgba(220, 38, 38, 0.28);
  color: #fee2e2;
}

.toast-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 700;
  font-size: 13.5px;
  margin-bottom: 2px;
}

.toast-message {
  font-size: 13px;
  line-height: 1.5;
}

.toast-close {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.85;
}

.toast-close:hover {
  opacity: 1;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ===== NOTIFICATIONS ===== */
.notifications-panel {
  position: absolute;
  top: 50px; right: 0;
  width: 360px;
  max-height: 460px;
  overflow-y: auto;
  background: linear-gradient(180deg, rgba(17,24,39,0.98) 0%, rgba(15,23,42,0.98) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.40);
  z-index: 300;
  padding: 14px;
  backdrop-filter: blur(16px);
}

.notifications-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.notifications-panel-title {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  padding-top: 2px;
}

.notifications-panel-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }

.notifications-action-btn {
  min-height: 32px;
  padding: 6px 11px;
  border-radius: 9px;
  border: 1px solid rgba(37,99,235,0.22);
  background: rgba(37,99,235,0.08);
  color: #BFDBFE;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
}
.notifications-action-btn:hover { background: rgba(37,99,235,0.16); border-color: rgba(37,99,235,0.34); color: #DBEAFE; }
.notifications-action-btn:disabled { opacity: 0.55; cursor: not-allowed; }

.notification-item {
  width: 100%;
  text-align: left;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.18s ease;
}
.notification-item:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.10); }
.notification-item.unread { background: rgba(37,99,235,0.08); border-color: rgba(37,99,235,0.18); }
.notification-item.read { opacity: 0.88; }

.notification-item-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 5px; }
.notification-item-title { font-size: 13px; font-weight: 700; color: var(--text-primary); }
.notification-pill {
  font-size: 10.5px; font-weight: 700; color: #DBEAFE;
  background: rgba(37,99,235,0.16); border: 1px solid rgba(37,99,235,0.22);
  padding: 2px 7px; border-radius: 999px; white-space: nowrap;
}
.notification-item-message { color: var(--text-muted); font-size: 12.5px; line-height: 1.5; margin-bottom: 6px; }
.notification-item-date { color: rgba(255,255,255,0.40); font-size: 11px; }
.notifications-empty { margin-top: 4px; }

/* ===== MISC ===== */
.progress-bar-wrap { background: rgba(255,255,255,.07); border-radius: 99px; height: 8px; overflow: hidden; }
.progress-bar { height: 100%; border-radius: 99px; transition: width 1s cubic-bezier(.22,1,.36,1); }
.card-subtitle { color: var(--text-muted); font-size: 13px; line-height: 1.6; }

/* ===== SCROLLBAR ===== */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.18); }

/* ===== RESPONSIVE GENERAL ===== */
@media(max-width:700px) {
  .dash-content { padding: 16px; gap: 16px; }
  .section-body { padding: 16px; }
  .section-header { padding: 14px 16px; }
  .page-hero-title { font-size: 22px; }
  .notifications-panel { width: 300px; right: -8px; }
  .notifications-panel-header { flex-direction: column; align-items: stretch; }
  .notifications-panel-actions { justify-content: flex-start; }
}

/* ===== LIGHT MODE ===== */
body.light-mode {
  --navy: #F0F4F8;
  --navy-mid: #E8EEF4;
  --navy-light: #FFFFFF;
  --text-primary: #0F172A;
  --text-muted: #64748B;
  --border: rgba(0,0,0,0.08);
  --glass: rgba(0,0,0,0.03);
  --card: rgba(0,0,0,0.04);
  --surface-1: #F8FAFC;
  --surface-2: #FFFFFF;
  --surface: #FFFFFF;
  background: #F0F4F8;
  color: #0F172A;
}
  /* Botón scroll-to-form solo visible en mobile */
.auth-scroll-btn {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, var(--academic-blue), var(--academic-blue-soft));
  color: #fff;
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(37,99,235,0.25);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.auth-scroll-btn:hover { transform: translateY(-1px); box-shadow: 0 14px 30px rgba(37,99,235,0.32); }

/* En mobile: muestra el panel izquierdo completo y el botón */
@media(max-width:900px) {
  .auth-root {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
  .auth-panel {
    display: flex !important;
    min-height: 100vh;
    padding: 48px 28px;
  }
  .auth-scroll-btn {
    display: flex;
  }
  .auth-form-side {
    min-height: 100vh;
    padding: 40px 24px;
  }
}

body.light-mode .sidebar {
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
  border-right: 1px solid rgba(0,0,0,0.08);
}
body.light-mode .sidebar-logo { border-bottom: 1px solid rgba(0,0,0,0.07); }
body.light-mode .sidebar-user { background: rgba(0,0,0,0.025); border-top: 1px solid rgba(0,0,0,0.07); }
body.light-mode .nav-item { color: #475569; }
body.light-mode .nav-item:hover { background: rgba(0,0,0,0.04); color: #0F172A; }
body.light-mode .nav-item.active { background: linear-gradient(90deg, rgba(37,99,235,0.10) 0%, rgba(37,99,235,0.05) 100%); color: #1D4ED8; box-shadow: inset 0 0 0 1px rgba(37,99,235,0.14); }
body.light-mode .nav-label { color: rgba(0,0,0,0.35); }
body.light-mode .nav-badge { color: #fff; }

body.light-mode .dash-main { background: linear-gradient(180deg, #F0F4F8 0%, #E8EEF4 100%); }
body.light-mode .dash-topbar { background: rgba(240,244,248,0.88); border-bottom: 1px solid rgba(0,0,0,0.07); }

body.light-mode .section-card { background: #FFFFFF; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
body.light-mode .section-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.10); border-color: rgba(0,0,0,0.11); }
body.light-mode .section-header { background: rgba(0,0,0,0.02); border-bottom: 1px solid rgba(0,0,0,0.07); }
body.light-mode .section-title { color: #0F172A; }

body.light-mode .asesoria-item,
body.light-mode .asesor-item { background: #F8FAFC; border: 1px solid rgba(0,0,0,0.08); }
body.light-mode .asesoria-item:hover,
body.light-mode .asesor-item:hover { background: rgba(37,99,235,0.04); border-color: rgba(37,99,235,0.18); }
body.light-mode .asesoria-subject,
body.light-mode .asesor-name { color: #0F172A; }

body.light-mode .stat-card { background: #FFFFFF; border: 1px solid rgba(0,0,0,0.08); }
body.light-mode .stat-value { color: #0F172A; }

body.light-mode .empty-state { background: rgba(0,0,0,0.025); border: 1px dashed rgba(0,0,0,0.12); }
body.light-mode .empty-state-title { color: #0F172A; }

body.light-mode .field { background: #FFFFFF; border: 1px solid rgba(0,0,0,0.12); color: #0F172A; }
body.light-mode .field:focus { border-color: rgba(37,99,235,0.50); box-shadow: 0 0 0 3px rgba(37,99,235,0.10); }
body.light-mode .field::placeholder { color: #94A3B8; }
body.light-mode .input-wrap label { color: #475569; }

body.light-mode .icon-btn { background: rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.08); color: #475569; }
body.light-mode .icon-btn:hover { background: rgba(0,0,0,0.07); color: #0F172A; }

body.light-mode .theme-toggle { border: 1px solid rgba(0,0,0,0.08); background: rgba(0,0,0,0.04); }

body.light-mode .notifications-panel { background: #FFFFFF; border: 1px solid rgba(0,0,0,0.09); box-shadow: 0 16px 50px rgba(0,0,0,0.14); }
body.light-mode .notifications-panel-title { color: #0F172A; }
body.light-mode .notification-item { background: #F8FAFC; border: 1px solid rgba(0,0,0,0.07); color: #0F172A; }
body.light-mode .notification-item.unread { background: rgba(37,99,235,0.06); border-color: rgba(37,99,235,0.16); }
body.light-mode .notification-item-title { color: #0F172A; }
body.light-mode .notification-item-date { color: #94A3B8; }

body.light-mode .error-msg { background: rgba(220,38,38,0.07); border: 1px solid rgba(220,38,38,0.18); color: #DC2626; }
body.light-mode .success-msg { background: rgba(5,150,105,0.07); border: 1px solid rgba(5,150,105,0.18); color: #059669; }

body.light-mode .toast { background: #FFFFFF; border: 1px solid rgba(0,0,0,0.10); box-shadow: 0 12px 40px rgba(0,0,0,0.14); }

body.light-mode .divider::before,
body.light-mode .divider::after { background: rgba(0,0,0,0.10); }
body.light-mode .divider { color: #94A3B8; }

body.light-mode ::-webkit-scrollbar-thumb { background: rgba(0,0,0,.12); }
body.light-mode ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,.20); }
`;


export default STYLES;
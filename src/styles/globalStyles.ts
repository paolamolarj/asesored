const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0D1B2A;
    --navy-mid: #1B2B3B;
    --navy-light: #243447;
    --teal: #00C9A7;
    --teal-dim: #00a88b;
    --amber: #FFB703;
    --rose: #FF6B6B;
    --text-primary: #F0F4F8;
    --text-muted: #8DA3B9;
    --border: rgba(255,255,255,0.07);
    --glass: rgba(255,255,255,0.04);
    --card: rgba(255,255,255,0.06);
  }

.page-hero-title {
  font-family: 'Outfit', sans-serif;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 6px;
}

  body { font-family: 'Outfit', sans-serif; background: var(--navy); color: var(--text-primary); overflow-x: hidden; }
  .syne { font-family: 'Syne', sans-serif; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn  { from { opacity:0; transform:scale(.92); } to { opacity:1; transform:scale(1); } }
  @keyframes float    { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-12px); } }
  @keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:.5; } }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes shimmer  { 0% { background-position:-600px 0; } 100% { background-position:600px 0; } }
  @keyframes slideRight { from { transform:translateX(-20px); opacity:0; } to { transform:translateX(0); opacity:1; } }

  .anim-fade-up   { animation: fadeUp   .7s cubic-bezier(.22,1,.36,1) both; }
  .anim-fade-in   { animation: fadeIn   .6s ease both; }
  .anim-scale-in  { animation: scaleIn  .5s cubic-bezier(.22,1,.36,1) both; }
  .anim-float     { animation: float 3.5s ease-in-out infinite; }
  .anim-slide-r   { animation: slideRight .5s cubic-bezier(.22,1,.36,1) both; }

  .d1{animation-delay:.05s} .d2{animation-delay:.12s} .d3{animation-delay:.2s}
  .d4{animation-delay:.28s} .d5{animation-delay:.36s} .d6{animation-delay:.44s}

  .auth-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
  }
  @media(max-width:900px){ .auth-root { grid-template-columns:1fr; } .auth-panel { display:none !important; } }

.auth-panel {
  background:
    radial-gradient(circle at 20% 20%, rgba(0,201,167,0.12), transparent 35%),
    radial-gradient(circle at 80% 30%, rgba(255,183,3,0.10), transparent 30%),
    linear-gradient(145deg, #081321 0%, #0b1a2d 38%, #0f2238 100%);
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
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0.02) 0%,
    rgba(255,255,255,0.00) 35%,
    rgba(255,255,255,0.015) 100%
  );
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
  top: 0;
  left: 0;
  right: 0;
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

.input-wrap {
  position: relative;
  margin-bottom: 18px;
}

.input-wrap label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 8px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.input-wrap .icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(calc(-50% + 14px));
  color: var(--text-muted);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-wrap .icon-right {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(calc(-50% + 14px));
  color: var(--text-muted);
  cursor: pointer;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.field {
  width: 100%;
  height: 48px;
  padding: 0 16px 0 46px;
  background: var(--glass);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  color: var(--text-primary);
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
  outline: none;
  line-height: 48px;
}

.field:focus {
  border-color: var(--teal);
  box-shadow: 0 0 0 3px rgba(0, 201, 167, 0.15);
}

.field::placeholder {
  color: var(--text-muted);
}

.field-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 40px;
  cursor: pointer;
  line-height: normal;
}

.field-select option {
  color: #111;
  background: #fff;
}

textarea.field {
  height: auto;
  min-height: 100px;
  padding: 14px 16px;
  line-height: 1.5;
}
  
.btn-primary {
  width: 100%;
  min-height: 50px;
  padding: 14px 16px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  background: linear-gradient(135deg, var(--teal) 0%, #00a88b 100%);
  color: var(--navy);
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.02em;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 32px rgba(0,201,167,0.30);
  filter: brightness(1.02);
}

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

.btn-google:hover {
  border-color: rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.06);
  transform: translateY(-1px);
}

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

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.08);
}
  .link-btn {
    background:none; border:none; color:var(--teal); cursor:pointer;
    font-family:'Outfit',sans-serif; font-size:inherit; font-weight:600;
    transition: color .2s;
  }
  .link-btn:hover { color:#00e8c0; }

.error-msg,
.success-msg {
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

  .shape {
    position:absolute; border-radius:16px; opacity:.6;
  }

  .dash-root {
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: 100vh;
  }
  @media(max-width:900px){ .dash-root { grid-template-columns:1fr; } }
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
  box-shadow: inset -1px 0 0 rgba(255,255,255,0.02);
}

.sidebar-logo {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--teal), #00a88b);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(0,201,167,0.18);
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
}

.nav-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.42);
  padding: 0 12px;
  margin-bottom: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  color: rgba(255,255,255,0.72);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  text-decoration: none;
  border: none;
  background: transparent;
  width: 100%;
  position: relative;
}

.nav-item:hover {
  background: rgba(255,255,255,0.045);
  color: var(--text-primary);
}




.nav-item.active {
  background: linear-gradient(90deg, rgba(0,201,167,0.16) 0%, rgba(0,201,167,0.08) 100%);
  color: var(--teal);
  box-shadow: inset 0 0 0 1px rgba(0,201,167,0.12);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3px;
  border-radius: 999px;
  background: var(--teal);
}


.empty-state {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  border-radius: 16px;
  background: rgba(255,255,255,0.035);
  border: 1px dashed rgba(255,255,255,0.10);
}

.empty-state-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.06);
  font-size: 20px;
}

.empty-state-title {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.empty-state-text {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-muted);
}

.sidebar-user {
  padding: 16px 18px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.015);
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 10px 20px rgba(124,58,237,0.18);
}
  .nav-badge {
    margin-left:auto; background:var(--rose); color:#fff;
    font-size:11px; font-weight:700; padding:2px 7px; border-radius:99px;
  }
  .nav-badge.teal { background:var(--teal); color:var(--navy); }

  
.dash-main {
  overflow-y: auto;
  background:
    radial-gradient(circle at top right, rgba(0,201,167,0.06), transparent 22%),
    linear-gradient(180deg, #0b1727 0%, #08121f 100%);
}
  
  .search-bar {
    display:flex; align-items:center; gap:10px;
    background:var(--glass); border:1.5px solid var(--border);
    border-radius:10px; padding:9px 16px; width:260px;
  }
  .search-bar input {
    background:none; border:none; outline:none;
    color:var(--text-primary); font-family:'Outfit',sans-serif; font-size:14px;
    width:100%;
  }
  .search-bar input::placeholder { color:var(--text-muted); }

 .dash-topbar {
  padding: 18px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: sticky;
  top: 0;
  background: rgba(13, 27, 42, 0.72);
  backdrop-filter: blur(14px);
  z-index: 40;
}

@media (max-width: 600px) {
  .dash-topbar {
    padding: 14px 18px;
  }
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.035);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 0.18s ease;
  position: relative;
}

.icon-btn:hover {
  border-color: rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.notif-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 8px;
  height: 8px;
  background: var(--rose);
  border-radius: 50%;
  border: 2px solid var(--navy-mid);
}

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

@media (max-width: 700px) {
  .dash-content {
    padding: 18px;
  }

  .section-header,
  .section-body {
    padding-left: 16px;
    padding-right: 16px;
  }

  .asesoria-item,
  .asesor-item {
    padding: 14px;
  }
}
  .greeting { margin-bottom:32px; }

  .stats-grid {
    display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px;
  }
  @media(max-width:1100px){ .stats-grid { grid-template-columns:repeat(2,1fr); } }
  @media(max-width:500px){ .stats-grid { grid-template-columns:1fr; } }

  .stat-card {
    background:var(--card); border:1px solid var(--border);
    border-radius:16px; padding:22px; position:relative; overflow:hidden;
    transition: transform .25s, box-shadow .25s;
  }
  .stat-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,.3); }
  .stat-card::after {
    content:''; position:absolute; bottom:0; left:0; right:0; height:3px;
  }
  .stat-card.teal::after   { background:linear-gradient(90deg,var(--teal),#00e8c0); }
  .stat-card.amber::after  { background:linear-gradient(90deg,var(--amber),#ffd060); }
  .stat-card.rose::after   { background:linear-gradient(90deg,var(--rose),#ff9f9f); }
  .stat-card.purple::after { background:linear-gradient(90deg,#7c3aed,#a78bfa); }

  .stat-icon {
    width:44px; height:44px; border-radius:11px;
    display:flex; align-items:center; justify-content:center; margin-bottom:16px;
  }
  .stat-icon.teal   { background:rgba(0,201,167,.15); color:var(--teal); }
  .stat-icon.amber  { background:rgba(255,183,3,.15);  color:var(--amber); }
  .stat-icon.rose   { background:rgba(255,107,107,.15);color:var(--rose); }
  .stat-icon.purple { background:rgba(124,58,237,.15); color:#a78bfa; }

  .stat-value { font-family:'Syne',sans-serif; font-size:32px; font-weight:800; line-height:1; margin-bottom:6px; }
  .stat-label { color:var(--text-muted); font-size:13px; font-weight:500; }
  .stat-change { font-size:12px; margin-top:8px; display:flex; align-items:center; gap:4px; }
  .stat-change.up   { color:var(--teal); }
  .stat-change.down { color:var(--rose); }

  .content-grid {
    display:grid; grid-template-columns:1fr 360px; gap:24px;
  }
  @media(max-width:1100px){ .content-grid { grid-template-columns:1fr; } }

.section-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.045) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 14px 36px rgba(0,0,0,0.22);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  width: 100%;
  max-width: 1200px;
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 42px rgba(0,0,0,0.28);
  border-color: rgba(255,255,255,0.12);
}

.section-header {
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,0.02);
}

.section-title {
  font-family: 'Syne', sans-serif;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0.01em;
}

.section-body {
  padding: 22px;
}
  .asesoria-hour {
  font-weight: 800;
  font-size: 15px;
  color: var(--teal);
  line-height: 1.2;
}

.asesoria-date {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.4;
  text-align: right;
}

.asesoria-item,
.asesor-item {
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 16px;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.asesoria-item:hover,
.asesor-item:hover {
  transform: translateY(-1px);
  border-color: rgba(0,201,167,0.28);
  background: rgba(0,201,167,0.045);
}

.asesoria-avatar,
.asesor-avatar {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.asesoria-subject,
.asesor-name {
  font-weight: 700;
  font-size: 14.8px;
  color: var(--text-primary);
}

.asesoria-meta,
.asesor-subject {
  color: var(--text-muted);
  font-size: 12.8px;
  margin-top: 2px;
}

.btn-sm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  width: auto;
  min-width: 120px;
  max-width: 180px;
  padding: 8px 14px;
  min-height: 34px;
  border: 1px solid rgba(0,201,167,0.35);
  border-radius: 10px;
  background: rgba(0,201,167,0.08);
  color: var(--teal);
  font-family: 'Outfit', sans-serif;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
}

.btn-sm:hover {
  background: var(--teal);
  color: var(--navy);
  border-color: var(--teal);
  transform: translateY(-1px);
}

.btn-sm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}


.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  width: auto;
  min-width: 96px;
  max-width: 140px;
  gap: 5px;
  min-height: 28px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.01em;
  border: 1px solid transparent;
  white-space: nowrap;
}
.status-badge.pending {
  background: rgba(255,183,3,0.12);
  color: var(--amber);
  border-color: rgba(255,183,3,0.18);
}

.status-badge.confirm {
  background: rgba(0,201,167,0.12);
  color: var(--teal);
  border-color: rgba(0,201,167,0.18);
}

.status-badge.cancel {
  background: rgba(255,107,107,0.12);
  color: var(--rose);
  border-color: rgba(255,107,107,0.18);
}

.quick-btn {
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 16px 14px;
  cursor: pointer;
  transition: all 0.18s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  text-align: center;
}

.quick-btn:hover {
  border-color: rgba(0,201,167,0.28);
  background: rgba(0,201,167,0.05);
  transform: translateY(-2px);
}

.stat-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.045) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  padding: 22px;
  position: relative;
  overflow: hidden;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 38px rgba(0,0,0,0.22);
}

.stat-value {
  font-family: 'Syne', sans-serif;
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
}
  .cal-grid {
    display:grid; grid-template-columns:repeat(7,1fr); gap:4px;
    text-align:center;
  }
  .cal-day-name { font-size:11px; color:var(--text-muted); font-weight:600; padding:4px 0; }
  .cal-day {
    aspect-ratio:1; display:flex; align-items:center; justify-content:center;
    border-radius:8px; font-size:13px; cursor:pointer;
    transition:all .15s;
  }
  .cal-day:hover { background:var(--glass); }
  .cal-day.today { background:rgba(0,201,167,.15); color:var(--teal); font-weight:700; }
  .cal-day.has-event { position:relative; font-weight:600; }
  .cal-day.has-event::after {
    content:''; position:absolute; bottom:3px; left:50%; transform:translateX(-50%);
    width:4px; height:4px; border-radius:50%; background:var(--amber);
  }
  .cal-day.other-month { color:rgba(255,255,255,.2); }

  .quick-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .quick-btn {
    background:var(--glass); border:1px solid var(--border); border-radius:12px;
    padding:16px 14px; cursor:pointer; transition:all .2s;
    display:flex; flex-direction:column; align-items:center; gap:8px;
    color:var(--text-primary); text-align:center;
  }
  .quick-btn:hover { border-color:rgba(0,201,167,.3); background:rgba(0,201,167,.06); transform:translateY(-2px); }
  .quick-icon {
    width:40px; height:40px; border-radius:10px;
    display:flex; align-items:center; justify-content:center;
  }
  .quick-label { font-size:13px; font-weight:600; }

  .asesor-list { display:flex; flex-direction:column; gap:10px; }
  .asesor-item {
    display:flex; align-items:center; gap:12px;
    padding:14px 16px; background:var(--glass); border:1px solid var(--border);
    border-radius:12px; transition:all .2s;
  }
  .asesor-item:hover { border-color:rgba(0,201,167,.3); background:rgba(0,201,167,.05); }
  .asesor-avatar { width:44px; height:44px; border-radius:10px; font-size:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .asesor-info { flex:1; min-width:0; }
  .asesor-name { font-weight:700; font-size:14.5px; }
  .asesor-subject { color:var(--text-muted); font-size:12.5px; }
  .asesor-rating { display:flex; align-items:center; gap:3px; font-size:13px; font-weight:600; color:var(--amber); }

  .btn-sm {
    padding:7px 14px; border:1.5px solid var(--teal); border-radius:8px;
    background:rgba(0,201,167,.08); color:var(--teal); font-family:'Outfit',sans-serif;
    font-size:12.5px; font-weight:600; cursor:pointer; transition:all .2s; white-space:nowrap;
  }
  .btn-sm:hover { background:var(--teal); color:var(--navy); }

  .progress-bar-wrap {
    background:rgba(255,255,255,.07); border-radius:99px; height:8px; overflow:hidden;
  }
  .progress-bar {
    height:100%; border-radius:99px;
    transition: width 1s cubic-bezier(.22,1,.36,1);
  }

  .materias-list { display:flex; flex-direction:column; gap:14px; }
  .materia-row { display:flex; flex-direction:column; gap:6px; }
  .materia-header { display:flex; justify-content:space-between; font-size:13.5px; font-weight:500; }
  .materia-pct { color:var(--text-muted); font-size:12.5px; }

  .hamburger { display:none; }
  @media(max-width:900px){ .hamburger { display:flex; } }

  .toast {
    position:fixed; bottom:28px; right:28px; z-index:999;
    background:var(--navy-light); border:1px solid var(--teal);
    border-radius:14px; padding:14px 20px; display:flex; align-items:center; gap:10px;
    box-shadow:0 20px 60px rgba(0,0,0,.5);
    animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both;
  }

  .overlay {
    display:none;
    position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:99;
  }
  .overlay.visible { display:block; }

  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1); border-radius:99px; }
  ::-webkit-scrollbar-thumb:hover { background:rgba(255,255,255,.18); }
`;

export default STYLES;
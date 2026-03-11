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
    background: linear-gradient(145deg, #0a1628 0%, #0d2340 40%, #0f1f35 100%);
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 60px 48px;
    position: relative; overflow: hidden;
  }
  .auth-panel::before {
    content:''; position:absolute; inset:0;
    background: radial-gradient(ellipse 70% 60% at 80% 20%, rgba(0,201,167,.18) 0%, transparent 60%),
                radial-gradient(ellipse 50% 50% at 20% 80%, rgba(255,183,3,.1) 0%, transparent 60%);
  }
  .auth-panel-grid {
    position:absolute; inset:0;
    background-image: linear-gradient(rgba(0,201,167,.06) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,201,167,.06) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .auth-form-side {
    background: var(--navy-mid);
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 48px 40px;
    position: relative; overflow-y: auto;
  }
  .auth-form-side::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background: linear-gradient(90deg, var(--teal), var(--amber), var(--rose));
  }

  .auth-card {
    width: 100%; max-width: 440px;
  }

  .input-wrap {
    position: relative; margin-bottom: 18px;
  }
  .input-wrap label {
    display: block; font-size: 13px; font-weight:600;
    color: var(--text-muted); margin-bottom:8px; letter-spacing:.04em; text-transform:uppercase;
  }
  .input-wrap .icon {
    position:absolute; left:16px; top:50%; transform:translateY(-50%);
    color: var(--text-muted); pointer-events:none;
  }
  .input-wrap .icon-right {
    position:absolute; right:16px; top:50%; transform:translateY(-50%);
    color: var(--text-muted); cursor:pointer; background:none; border:none;
  }
  .field {
    width:100%; padding: 14px 16px 14px 46px;
    background: var(--glass); border: 1.5px solid var(--border);
    border-radius: 12px; color: var(--text-primary);
    font-family:'Outfit',sans-serif; font-size:15px;
    transition: border-color .25s, box-shadow .25s;
    outline: none;
  }
  .field:focus {
    border-color: var(--teal);
    box-shadow: 0 0 0 3px rgba(0,201,167,.15);
  }
  .field::placeholder { color: var(--text-muted); }
  .field-select { appearance:none; padding-right:40px; cursor:pointer; }

  .btn-primary {
    width:100%; padding:15px; border:none; border-radius:12px; cursor:pointer;
    background: linear-gradient(135deg, var(--teal) 0%, #00a88b 100%);
    color: var(--navy); font-family:'Outfit',sans-serif; font-size:16px; font-weight:700;
    letter-spacing:.02em; transition: transform .2s, box-shadow .2s;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .btn-primary:hover { transform:translateY(-2px); box-shadow: 0 12px 28px rgba(0,201,167,.35); }
  .btn-primary:active { transform:translateY(0); }

  .btn-google {
    width:100%; padding:14px; border:1.5px solid var(--border); border-radius:12px;
    background: var(--glass); color:var(--text-primary);
    font-family:'Outfit',sans-serif; font-size:15px; font-weight:500;
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px;
    transition: border-color .2s, background .2s;
  }
  .btn-google:hover { border-color:rgba(255,255,255,.2); background:rgba(255,255,255,.08); }

  .divider {
    display:flex; align-items:center; gap:12px; margin:20px 0;
    color:var(--text-muted); font-size:13px;
  }
  .divider::before, .divider::after {
    content:''; flex:1; height:1px; background:var(--border);
  }

  .link-btn {
    background:none; border:none; color:var(--teal); cursor:pointer;
    font-family:'Outfit',sans-serif; font-size:inherit; font-weight:600;
    transition: color .2s;
  }
  .link-btn:hover { color:#00e8c0; }

  .error-msg {
    background: rgba(255,107,107,.12); border:1px solid rgba(255,107,107,.25);
    color: #ff8f8f; border-radius:10px; padding:12px 16px; font-size:14px;
    margin-bottom:18px; display:flex; align-items:center; gap:8px;
  }
  .success-msg {
    background: rgba(0,201,167,.1); border:1px solid rgba(0,201,167,.25);
    color: var(--teal); border-radius:10px; padding:12px 16px; font-size:14px;
    margin-bottom:18px; display:flex; align-items:center; gap:8px;
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
    background: #0a1220;
    border-right: 1px solid var(--border);
    display:flex; flex-direction:column;
    padding: 0;
    position: sticky; top:0; height:100vh;
    overflow-y:auto;
  }
  @media(max-width:900px){ .sidebar { display:none; } }
  .sidebar.mobile-open { display:flex; position:fixed; inset:0; z-index:100; width:280px; }

  .sidebar-logo {
    padding: 28px 24px; border-bottom:1px solid var(--border);
    display:flex; align-items:center; gap:12px;
  }
  .logo-icon {
    width:42px; height:42px; border-radius:10px;
    background:linear-gradient(135deg,var(--teal),#00a88b);
    display:flex; align-items:center; justify-content:center;
  }

  .sidebar-nav { flex:1; padding:16px 12px; }
  .nav-section { margin-bottom:28px; }
  .nav-label {
    font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
    color:var(--text-muted); padding:0 12px; margin-bottom:8px;
  }
  .nav-item {
    display:flex; align-items:center; gap:12px;
    padding:11px 14px; border-radius:10px;
    color:var(--text-muted); font-size:14.5px; font-weight:500;
    cursor:pointer; transition:all .2s;
    text-decoration:none; border:none; background:none; width:100%;
    position:relative;
  }
  .nav-item:hover { background:var(--glass); color:var(--text-primary); }
  .nav-item.active {
    background:rgba(0,201,167,.1);
    color:var(--teal);
  }
  .nav-item.active::before {
    content:''; position:absolute; left:0; top:4px; bottom:4px;
    width:3px; border-radius:2px; background:var(--teal);
  }
  .nav-badge {
    margin-left:auto; background:var(--rose); color:#fff;
    font-size:11px; font-weight:700; padding:2px 7px; border-radius:99px;
  }
  .nav-badge.teal { background:var(--teal); color:var(--navy); }

  .sidebar-user {
    padding:16px 20px; border-top:1px solid var(--border);
    display:flex; align-items:center; gap:12px;
  }
  .user-avatar {
    width:40px; height:40px; border-radius:10px;
    background:linear-gradient(135deg,#4f46e5,#7c3aed);
    display:flex; align-items:center; justify-content:center;
    font-size:17px; font-weight:700; color:#fff; flex-shrink:0;
  }

  .dash-main { overflow-y:auto; }

  .dash-topbar {
    padding:24px 32px; display:flex; align-items:center; justify-content:space-between;
    border-bottom:1px solid var(--border); position:sticky; top:0;
    background:rgba(27,43,59,.85); backdrop-filter:blur(12px); z-index:40;
  }
  @media(max-width:600px){ .dash-topbar { padding:16px 20px; } }

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

  .topbar-actions { display:flex; align-items:center; gap:12px; }
  .icon-btn {
    width:38px; height:38px; border-radius:9px; border:1px solid var(--border);
    background:var(--glass); cursor:pointer; display:flex; align-items:center;
    justify-content:center; color:var(--text-muted); transition:all .2s;
    position:relative;
  }
  .icon-btn:hover { border-color:rgba(255,255,255,.15); color:var(--text-primary); }
  .notif-dot {
    position:absolute; top:6px; right:6px; width:7px; height:7px;
    background:var(--rose); border-radius:50%; border:1.5px solid var(--navy-mid);
  }

  .dash-content { padding:32px; }
  @media(max-width:600px){ .dash-content { padding:20px; } }

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
    background:var(--card); border:1px solid var(--border); border-radius:16px; overflow:hidden;
  }
  .section-header {
    padding:20px 24px; border-bottom:1px solid var(--border);
    display:flex; align-items:center; justify-content:space-between;
  }
  .section-title { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; }
  .section-body { padding:24px; }

  .asesoria-list { display:flex; flex-direction:column; gap:12px; }
  .asesoria-item {
    background:var(--glass); border:1px solid var(--border); border-radius:12px;
    padding:16px; display:flex; align-items:center; gap:14px;
    transition:all .2s;
  }
  .asesoria-item:hover { border-color:rgba(0,201,167,.3); background:rgba(0,201,167,.05); }

  .asesoria-avatar {
    width:46px; height:46px; border-radius:10px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center; font-size:20px;
  }
  .asesoria-info { flex:1; min-width:0; }
  .asesoria-subject { font-weight:700; font-size:15px; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .asesoria-meta   { color:var(--text-muted); font-size:13px; }
  .asesoria-time   { text-align:right; flex-shrink:0; }
  .asesoria-hour   { font-weight:700; font-size:15px; color:var(--teal); }
  .asesoria-date   { color:var(--text-muted); font-size:12px; }

  .status-badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px; border-radius:99px; font-size:11.5px; font-weight:600;
  }
  .status-badge.pending  { background:rgba(255,183,3,.12);   color:var(--amber); }
  .status-badge.confirm  { background:rgba(0,201,167,.12);   color:var(--teal);  }
  .status-badge.cancel   { background:rgba(255,107,107,.12); color:var(--rose);  }

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
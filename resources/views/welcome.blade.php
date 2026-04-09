<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>Febri.net - Internet Super Cepat</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#080f20;--navy:#0f1e3d;
  --bg:#05101e;--white:#fff;--bd:rgba(255,255,255,0.08);
  --aqua:#00c8d7;--aqua2:#00eeff;--mint:#00d4a0;
  --blue:#2563eb;--violet:#5b21b6;
  --red:#e11d48;--amber:#d97706;--green:#059669;
  --sh:0 12px 40px rgba(0,0,0,0.4);
}
body {
    background-color: var(--bg);
    color: var(--white);
    font-family: 'Sora', sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
}

/* Background Effects */
.bg-glow-1 { position: absolute; top: -10vw; right: -10vw; width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(0,200,215,0.15) 0%, transparent 70%); z-index:-1; pointer-events:none;}
.bg-glow-2 { position: absolute; bottom: -20vw; left: -10vw; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 60%); z-index:-1; pointer-events:none;}
.bg-grid {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: -1;
    pointer-events: none;
}

/* Navbar */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 5%;
    max-width: 1200px;
    margin: 0 auto;
}
.logo {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--white);
    text-decoration: none;
}
.logo-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--aqua), var(--mint));
    display: flex;
    align-items: center;
    justify-content: center;
}
.logo-icon svg { width: 18px; height: 18px; stroke: #05101E; stroke-width: 2.5; fill: none; }
.nav-links { display: flex; gap: 32px; }
.nav-links a { color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 600; font-size: 14px; transition: color 0.3s; }
.nav-links a:hover { color: var(--aqua); }
.nav-actions a {
    display: inline-block;
    padding: 10px 24px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.3s;
}
.btn-login { color: var(--white); background: rgba(255,255,255,0.05); border: 1px solid var(--bd); margin-right: 12px; }
.btn-login:hover { background: rgba(255,255,255,0.1); }
.btn-join { color: #05101E; background: linear-gradient(135deg, var(--aqua), var(--mint)); box-shadow: 0 4px 15px rgba(0, 200, 215, 0.4); }
.btn-join:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0, 200, 215, 0.5); }

/* Hero Section */
.hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 60px auto;
    padding: 0 5%;
    min-height: 70vh;
}
.hero-text { flex: 1; max-width: 600px; }
.badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(0,200,215,0.1);
    border: 1px solid rgba(0,200,215,0.2);
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    color: var(--aqua);
    margin-bottom: 24px;
}
.badge-dot { width: 6px; height: 6px; background: var(--aqua); border-radius: 50%; animation: blink 2s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

.hero-text h1 {
    font-size: 64px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -2px;
    margin-bottom: 24px;
    background: linear-gradient(to right, #fff, #a5b4fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.hero-text p {
    font-size: 18px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 40px;
    max-width: 500px;
}
.hero-btns { display: flex; gap: 16px; }
.btn-primary {
    padding: 16px 36px;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 800;
    color: #05101e;
    background: linear-gradient(135deg, var(--aqua), var(--mint));
    text-decoration: none;
    box-shadow: 0 8px 30px rgba(0, 200, 215, 0.3);
    transition: all 0.3s;
}
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0, 200, 215, 0.5); }
.btn-secondary {
    padding: 16px 36px;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 700;
    color: var(--white);
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--bd);
    text-decoration: none;
    transition: all 0.3s;
}
.btn-secondary:hover { background: rgba(255,255,255,0.1); }

/* Hero Graphic / Phone Mockup */
.hero-graphic { flex: 1; display: flex; justify-content: center; position: relative; }
.phone-mockup {
    width: 320px;
    height: 640px;
    background: var(--navy);
    border-radius: 40px;
    border: 8px solid #1e293b;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);
    position: relative;
    overflow: hidden;
    transform: rotate(-5deg) translateY(20px);
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.phone-mockup:hover { transform: rotate(0deg) translateY(0); }

/* Phone Inner Content */
.pm-hdr { padding: 40px 20px 20px; background: linear-gradient(to bottom, #05101E, #0F1E3D); }
.pm-card {
    background: linear-gradient(140deg, #00aab8, #00cfe0, #00e8cc, #00d4a8);
    border-radius: 20px;
    padding: 20px;
    color: #063a3f;
    position: relative;
    overflow: hidden;
    margin-bottom: 20px;
}
.pm-card::before { content:''; position:absolute; top:-20px; right:-20px; width:100px; height:100px; background:rgba(255,255,255,0.15); border-radius:50%; }
.pm-ct span { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.pm-ct h3 { font-size: 14px; font-weight: 800; margin: 5px 0; }
.pm-ct h2 { font-size: 32px; font-weight: 900; letter-spacing: -2px; margin: 10px 0; }
.pm-ct p { font-size: 11px; font-weight: 600; opacity: 0.8; margin-bottom:0; }

.pm-stats { display: flex; gap: 10px; padding: 0 20px; }
.pm-stat { flex: 1; background: #1e293b; border-radius: 16px; padding: 15px; border: 1px solid rgba(255,255,255,0.05); }
.pm-si { width: 32px; height: 32px; background: rgba(0,200,215,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
.pm-si svg { width: 16px; height: 16px; stroke: var(--aqua); fill:none; stroke-width: 2; }
.pm-sv { font-size: 20px; font-weight: 800; }
.pm-sl { font-size: 10px; color: rgba(255,255,255,0.5); margin-top: 4px; }

/* Responsive */
@media (max-width: 900px) {
    .nav-links { display: none; }
    .hero { flex-direction: column; text-align: center; margin: 40px auto; padding-top: 20px; gap: 60px;}
    .hero-text h1 { font-size: 48px; }
    .hero-text p { margin: 0 auto 30px; }
    .hero-btns { justify-content: center; }
    .phone-mockup { transform: rotate(0) translateY(0); width: 280px; height: 560px;}
}
</style>
</head>
<body>
    <div class="bg-glow-1"></div>
    <div class="bg-glow-2"></div>
    <div class="bg-grid"></div>

    <nav class="navbar">
        <a href="/" class="logo">
            <div class="logo-icon">
                <svg viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1.5" fill="#05101E" stroke="none"/></svg>
            </div>
            Febri.net
        </a>
        <div class="nav-links">
            <a href="#">Fitur</a>
            <a href="#">Paket WiFi</a>
            <a href="#">Tentang Kami</a>
            <a href="#">Bantuan</a>
        </div>
        <div class="nav-actions">
            @auth
                <a href="{{ url('/dashboard') }}" class="btn-join">Buka Dashboard</a>
            @else
                <a href="{{ route('login') }}" class="btn-login">Log In</a>
                @if (Route::has('register'))
                    <a href="{{ route('register') }}" class="btn-join">Daftar Sekarang</a>
                @endif
            @endauth
        </div>
    </nav>

    <main class="hero">
        <div class="hero-text">
            <div class="badge">
                <div class="badge-dot"></div>
                Internet Super Cepat & Stabil
            </div>
            <h1>Bebas Akses Tanpa Batas Ruang & Waktu.</h1>
            <p>Kelola WiFi, beli voucher, dan pantau tagihan secara real-time langsung dari genggaman Anda. Nikmati ekosistem Febri.net yang modern dan cepat.</p>
            
            <div class="hero-btns">
                @auth
                    <a href="{{ url('/dashboard') }}" class="btn-primary">Lanjut ke Dashboard</a>
                @else
                    <a href="{{ route('register') }}" class="btn-primary">Mulai Sekarang</a>
                    <a href="{{ route('login') }}" class="btn-secondary">Masuk</a>
                @endauth
            </div>
        </div>
        
        <div class="hero-graphic">
            <div class="phone-mockup">
                <div class="pm-hdr">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 20px;">
                        <div>
                            <div style="font-size:12px; color:rgba(255,255,255,0.5)">Selamat Datang,</div>
                            <div style="font-size:18px; font-weight:800">Kemal 👋</div>
                        </div>
                        <div style="width:36px; height:36px; border-radius:50%; background:var(--aqua); display:flex; align-items:center; justify-content:center; color:#062022; font-weight:800;">K</div>
                    </div>
                    
                    <div class="pm-card">
                        <div class="pm-ct">
                            <span>Voucher Aktif</span>
                            <h3>Family Entertainment</h3>
                            <h2>50 <span>Mbps</span></h2>
                            <p>Berlaku s/d 20 Mar 2026</p>
                        </div>
                    </div>
                </div>
                
                <div class="pm-stats">
                    <div class="pm-stat">
                        <div class="pm-si"><svg viewBox="0 0 24 24"><path d="M12 3v13"/><path d="m5 14 7 7 7-7"/></svg></div>
                        <div class="pm-sv">45.2 <span style="font-size:12px; color:var(--aqua)">GB</span></div>
                        <div class="pm-sl">Download</div>
                    </div>
                    <div class="pm-stat">
                        <div class="pm-si" style="background:rgba(217,119,6,0.1)"><svg viewBox="0 0 24 24" style="stroke:var(--amber)"><path d="M12 21V8"/><path d="m5 10 7-7 7 7"/></svg></div>
                        <div class="pm-sv">12.8 <span style="font-size:12px; color:var(--amber)">GB</span></div>
                        <div class="pm-sl">Upload</div>
                    </div>
                </div>
                
                <div style="margin: 20px; padding: 15px; background: #1e293b; border-radius: 16px; display:flex; align-items:center; gap:12px; border: 1px solid rgba(255,255,255,0.05);">
                    <div style="width:40px; height:40px; border-radius:12px; background:rgba(0,200,215,0.1); display:flex; align-items:center; justify-content:center;">
                        <svg viewBox="0 0 24 24" style="width:20px; height:20px; stroke:var(--aqua); fill:none; stroke-width:2;"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1.5" fill="var(--aqua)" stroke="none"/></svg>
                    </div>
                    <div style="flex:1">
                        <div style="font-size:14px; font-weight:700">WiFi Scanner</div>
                        <div style="font-size:11px; color:rgba(255,255,255,0.5)">2 Perangkat Online</div>
                    </div>
                </div>
            </div>
        </div>
    </main>

</body>
</html>

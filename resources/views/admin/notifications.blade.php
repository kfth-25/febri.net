<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin Panel – Kirim Notifikasi | Febri.net</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#080f20;--navy:#0f1e3d;--bg:#05101e;
  --aqua:#00c8d7;--mint:#00d4a0;--red:#e11d48;
  --green:#059669;--amber:#d97706;--blue:#2563eb;
  --bd:rgba(255,255,255,0.07);
  --card:#0d1f36;--surface:#0a1929;
}
body{background:var(--bg);color:#fff;font-family:'Sora',sans-serif;min-height:100vh}

/* --- LAYOUT --- */
.layout{display:flex;min-height:100vh}
.sidebar{width:240px;background:var(--ink);border-right:1px solid var(--bd);padding:24px 0;flex-shrink:0}
.logo-wrap{padding:0 24px 28px;border-bottom:1px solid var(--bd);margin-bottom:20px}
.logo{font-size:20px;font-weight:800;display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none}
.logo-ic{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,var(--aqua),var(--mint));display:flex;align-items:center;justify-content:center}
.logo-ic svg{width:16px;height:16px;stroke:#05101e;stroke-width:2.5;fill:none}
.nav-section{padding:0 16px}
.nav-label{font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:0.1em;text-transform:uppercase;padding:0 8px;margin-bottom:8px}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;color:rgba(255,255,255,0.6);text-decoration:none;font-size:13px;font-weight:600;transition:all .2s;margin-bottom:4px}
.nav-item:hover{background:rgba(255,255,255,0.05);color:#fff}
.nav-item.active{background:rgba(0,200,215,0.12);color:var(--aqua)}
.nav-item svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;flex-shrink:0}

.main{flex:1;padding:32px;overflow-y:auto;max-width:900px}

/* --- HEADER --- */
.page-header{margin-bottom:32px}
.page-label{font-size:12px;font-weight:600;color:rgba(255,255,255,0.4);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}
.page-title{font-size:28px;font-weight:800;letter-spacing:-0.5px;background:linear-gradient(to right,#fff,rgba(255,255,255,.6));-webkit-background-clip:text;-webkit-text-fill-color:transparent}

/* --- ALERT --- */
.alert{border-radius:14px;padding:14px 18px;margin-bottom:24px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:10px}
.alert-success{background:rgba(5,150,105,.12);border:1px solid rgba(5,150,105,.25);color:var(--green)}
.alert-error{background:rgba(225,29,72,.1);border:1px solid rgba(225,29,72,.22);color:var(--red)}
.alert svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2;flex-shrink:0}

/* --- CARDS --- */
.card{background:var(--card);border:1px solid var(--bd);border-radius:20px;padding:24px;margin-bottom:20px}
.card-title{font-size:15px;font-weight:700;margin-bottom:18px;display:flex;align-items:center;gap:8px}
.card-title svg{width:18px;height:18px;stroke:var(--aqua);fill:none;stroke-width:2}

/* --- FORM --- */
.form-group{margin-bottom:18px}
label{display:block;font-size:12px;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px}
input,select,textarea{width:100%;background:var(--surface);border:1.5px solid rgba(255,255,255,.09);border-radius:12px;padding:12px 16px;color:#fff;font-size:14px;font-family:'Sora',sans-serif;outline:none;transition:border-color .2s;appearance:none}
input:focus,select:focus,textarea:focus{border-color:var(--aqua)}
select option{background:var(--navy)}
textarea{min-height:90px;resize:vertical}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}

/* Target toggle */
.toggle-wrap{display:flex;gap:10px;margin-bottom:18px}
.toggle-btn{flex:1;padding:10px;border-radius:12px;border:1.5px solid rgba(255,255,255,.1);background:transparent;color:rgba(255,255,255,.5);font-size:13px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif;transition:all .2s;text-align:center}
.toggle-btn.on{border-color:var(--aqua);background:rgba(0,200,215,.1);color:var(--aqua)}
#userSelectWrap{transition:all .2s}

/* Checkbox */
.check-row{display:flex;align-items:center;gap:10px;margin-top:4px}
.check-row input[type=checkbox]{width:18px;height:18px;border-radius:5px;cursor:pointer;flex-shrink:0}
.check-label{font-size:13px;color:rgba(255,255,255,.7);font-weight:500}

/* Badge type pills */
.type-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.type-pill{padding:10px 8px;border-radius:12px;border:1.5px solid rgba(255,255,255,.08);background:transparent;color:rgba(255,255,255,.5);font-size:11px;font-weight:700;cursor:pointer;text-align:center;transition:all .2s;font-family:'Sora',sans-serif;position:relative}
.type-pill.on{border-color:currentColor}
.tp-billing.on{color:var(--red);background:rgba(225,29,72,.1)}
.tp-payment.on{color:var(--green);background:rgba(5,150,105,.1)}
.tp-outage.on{color:var(--amber);background:rgba(217,119,6,.1)}
.tp-install.on{color:var(--blue);background:rgba(37,99,235,.1)}
.tp-general.on{color:var(--aqua);background:rgba(0,200,215,.1)}
.tp-promo.on{color:#a78bfa;background:rgba(91,33,182,.1)}

/* Submit */
.submit-btn{width:100%;padding:15px;border-radius:14px;border:none;background:linear-gradient(135deg,var(--aqua),var(--mint));color:#05101e;font-size:15px;font-weight:800;cursor:pointer;font-family:'Sora',sans-serif;transition:all .2s;margin-top:8px}
.submit-btn:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(0,200,215,.35)}

/* Users table */
.table{width:100%;border-collapse:collapse}
.table th{font-size:11px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.08em;padding:10px 14px;border-bottom:1px solid var(--bd);text-align:left}
.table td{padding:12px 14px;font-size:13px;color:rgba(255,255,255,.8);border-bottom:1px solid rgba(255,255,255,.04)}
.table tr:last-child td{border-bottom:none}
.role-pill{display:inline-block;padding:2px 10px;border-radius:10px;font-size:10px;font-weight:700}
.role-admin{background:rgba(0,200,215,.12);color:var(--aqua)}
.role-customer{background:rgba(5,150,105,.12);color:var(--green)}
.role-tech{background:rgba(37,99,235,.12);color:#60a5fa}

@media(max-width:720px){
  .sidebar{display:none}
  .main{padding:20px}
  .form-row{grid-template-columns:1fr}
  .type-grid{grid-template-columns:repeat(2,1fr)}
}
</style>
</head>
<body>
<div class="layout">

  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="logo-wrap">
      <a href="/" class="logo">
        <div class="logo-ic">
          <svg viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1.5" fill="#05101e" stroke="none"/></svg>
        </div>
        Febri.net
      </a>
    </div>
    <nav class="nav-section">
      <div class="nav-label">Admin Panel</div>
      <a href="/" class="nav-item">
        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Dashboard
      </a>
      <a href="/admin/notifications" class="nav-item active">
        <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        Kirim Notifikasi
      </a>
    </nav>
  </aside>

  <!-- Main content -->
  <main class="main">
    <div class="page-header">
      <div class="page-label">Admin Panel</div>
      <div class="page-title">Kirim Notifikasi</div>
    </div>

    @if(session('success'))
      <div class="alert alert-success">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        {{ session('success') }}
      </div>
    @endif

    @if($errors->any())
      <div class="alert alert-error">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {{ $errors->first() }}
      </div>
    @endif

    <!-- Send Form -->
    <div class="card">
      <div class="card-title">
        <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Compose Notifikasi
      </div>

      <form method="POST" action="/admin/notifications/send">
        @csrf
        <input type="hidden" name="target" id="targetInput" value="user">
        <input type="hidden" name="type" id="typeInput" value="general">

        <!-- Target -->
        <div class="form-group">
          <label>Kirim Kepada</label>
          <div class="toggle-wrap">
            <button type="button" class="toggle-btn on" id="btnUser" onclick="setTarget('user')">
              👤 Pengguna Tertentu
            </button>
            <button type="button" class="toggle-btn" id="btnAll" onclick="setTarget('all')">
              📢 Semua Pengguna
            </button>
          </div>

          <div id="userSelectWrap">
            <select name="user_id" id="userSelect">
              <option value="">-- Pilih Pengguna --</option>
              @foreach($users as $u)
                <option value="{{ $u->id }}" {{ old('user_id') == $u->id ? 'selected' : '' }}>
                  {{ $u->name }} ({{ $u->email }}) · {{ $u->role }}
                </option>
              @endforeach
            </select>
          </div>
        </div>

        <!-- Type -->
        <div class="form-group">
          <label>Tipe Notifikasi</label>
          <div class="type-grid">
            <button type="button" class="type-pill tp-billing" onclick="setType('billing_due')">💳 Tagihan</button>
            <button type="button" class="type-pill tp-payment" onclick="setType('payment_received')">✅ Pembayaran</button>
            <button type="button" class="type-pill tp-outage" onclick="setType('outage')">⚠️ Gangguan</button>
            <button type="button" class="type-pill tp-install" onclick="setType('request_update')">🔧 Instalasi</button>
            <button type="button" class="type-pill tp-general on" onclick="setType('general')">🔔 Umum</button>
            <button type="button" class="type-pill tp-promo" onclick="setType('promo')">🎉 Promo</button>
          </div>
        </div>

        <!-- Title & Body -->
        <div class="form-group">
          <label>Judul Notifikasi</label>
          <input type="text" name="title" placeholder="Masukkan judul notifikasi..." maxlength="100" value="{{ old('title') }}" required>
        </div>

        <div class="form-group">
          <label>Pesan</label>
          <textarea name="body" placeholder="Tulis isi notifikasi di sini..." maxlength="400" required>{{ old('body') }}</textarea>
        </div>

        <!-- Email toggle -->
        <div class="form-group" id="emailWrap">
          <div class="check-row">
            <input type="checkbox" name="send_email" id="sendEmail" value="1" {{ old('send_email') ? 'checked' : '' }}>
            <label class="check-label" for="sendEmail" style="text-transform:none;letter-spacing:0;font-size:13px;color:rgba(255,255,255,.7);">
              Juga kirim via Email
            </label>
          </div>
        </div>

        <button type="submit" class="submit-btn">🚀 Kirim Notifikasi</button>
      </form>
    </div>

    <!-- User List -->
    <div class="card">
      <div class="card-title">
        <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Daftar Pengguna Aktif
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          @forelse($users as $u)
          <tr>
            <td>{{ $u->name }}</td>
            <td style="color:rgba(255,255,255,.5);font-family:'JetBrains Mono',monospace;font-size:12px">{{ $u->email }}</td>
            <td>
              <span class="role-pill role-{{ $u->role }}">{{ strtoupper($u->role) }}</span>
            </td>
          </tr>
          @empty
          <tr><td colspan="3" style="text-align:center;color:rgba(255,255,255,.3);padding:30px">Belum ada pengguna aktif</td></tr>
          @endforelse
        </tbody>
      </table>
    </div>
  </main>
</div>

<script>
function setTarget(t) {
  document.getElementById('targetInput').value = t;
  const userWrap = document.getElementById('userSelectWrap');
  const emailWrap = document.getElementById('emailWrap');
  const btnUser = document.getElementById('btnUser');
  const btnAll = document.getElementById('btnAll');

  if (t === 'user') {
    btnUser.classList.add('on');
    btnAll.classList.remove('on');
    userWrap.style.display = 'block';
    emailWrap.style.display = 'block';
    document.getElementById('userSelect').required = true;
  } else {
    btnUser.classList.remove('on');
    btnAll.classList.add('on');
    userWrap.style.display = 'none';
    emailWrap.style.display = 'none';
    document.getElementById('userSelect').required = false;
  }
}

const typePillMap = {
  billing_due: 'tp-billing',
  payment_received: 'tp-payment',
  outage: 'tp-outage',
  request_update: 'tp-install',
  general: 'tp-general',
  promo: 'tp-promo',
};
let currentType = 'general';

function setType(t) {
  // Remove active from previous
  document.querySelectorAll('.type-pill').forEach(p => p.classList.remove('on'));
  // Add active to current
  const targetClass = typePillMap[t];
  document.querySelector('.' + targetClass)?.classList.add('on');
  document.getElementById('typeInput').value = t;
  currentType = t;
}
</script>
</body>
</html>

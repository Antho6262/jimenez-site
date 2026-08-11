// =============================================
// VIZU 6BLOCK'S — App.js
// =============================================

const NAV_ITEMS = [
  { page: 'dashboard',    icon: '🏠', label: 'Tableau de bord', file: 'dashboard.html' },
  { page: 'tracker',      icon: '📋', label: 'Tracker',          file: 'tracker.html' },
  { page: 'stats',        icon: '📊', label: 'Statistiques',     file: 'stats.html' },
  { page: 'stock',        icon: '📦', label: 'Stock',            file: 'stock.html' },
  { page: 'transactions', icon: '🤝', label: 'Transactions',     file: 'transactions.html' },
  { page: 'taxes',        icon: '💸', label: 'Taxes',            file: 'taxes.html' },
  { page: 'blanchiment',  icon: '🏦', label: 'Blanchiment',      file: 'blanchiment.html' },
  { page: 'quotas',       icon: '🎯', label: 'Quotas',           file: 'quotas.html' },
  { page: 'objectifs',    icon: '🏆', label: 'Objectifs',        file: 'objectifs.html' },
  { page: 'sanctions',    icon: '⚠️', label: 'Sanctions',        file: 'sanctions.html' },
  { page: 'tv',           icon: '📺', label: 'Mode TV',          file: 'tv.html' },
  { page: 'admin',        icon: '🔧', label: 'Administration',   file: 'admin.html' },
  { page: 'profil',       icon: '👤', label: 'Mon Profil',       file: 'profil.html' },
];

// Couleurs grades (dynamique selon GRADES)
const GRADE_COLORS = {
  'Fondateur':   '#ff7a1a',
  'Lead':        '#ffa04d',
  'Co-Lead':     '#c0c0c0',
  'Bras droit':  '#ffbf80',
  'Gadjo':       '#a0a0a0',
  'Comis':       '#707070',
};

// =============================================
// AUTH
// =============================================
const Auth = {
  get membre() {
    return JSON.parse(sessionStorage.getItem('jimenez_user') || 'null');
  },
  login(data) {
    sessionStorage.setItem('jimenez_user', JSON.stringify(data));
  },
  logout() {
    sessionStorage.removeItem('jimenez_user');
    window.location.href = '../index.html';
  },
  canAccess(page) {
    const u = this.membre;
    if (!u) return false;
    if (u.role === 'admin') return true;
    const perms = PERMS_DEFAUT[u.grade] || PERMS_DEFAUT['Comis'] || [];
    return perms.includes(page);
  }
};

// Redirect si non connecté
if (!Auth.membre && !window.location.pathname.includes('index')) {
  window.location.href = '../index.html';
}

// Stub pour éviter les erreurs sur les fonctions Sombra non portées
function initDataIfEmpty() { return Promise.resolve(); }
function startRealtimeNotifications() {}

// =============================================
// SIDEBAR
// =============================================
async function buildSidebar(currentPage) {
  const user = Auth.membre;
  if (!user) return;

  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  let navHTML = '';
  for (const item of NAV_ITEMS) {
    if (!Auth.canAccess(item.page)) continue;
    const active = item.page === currentPage ? 'active' : '';
    navHTML += `<a href="${item.file}" class="nav-item ${active}">
      <span class="nav-icon">${item.icon}</span>
      <span class="nav-label">${item.label}</span>
    </a>`;
  }

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <img src="../img/groupe.jpg" class="sidebar-logo" alt="Vizu 6Block's">
      <div class="sidebar-title">Vizu<br><span>6Block's</span></div>
    </div>
    <div class="sidebar-user">
      <div class="user-name">${user.prenom} ${user.nom || ''}</div>
      <div class="user-grade">${user.grade}</div>
    </div>
    <nav class="sidebar-nav">${navHTML}</nav>
    <div class="sidebar-footer">
      <button onclick="Auth.logout()" class="btn-logout">🚪 Déconnexion</button>
    </div>
  `;
}

// =============================================
// UTILITAIRES
// =============================================
const Utils = {
  fmt(n) {
    return Number(n || 0).toLocaleString('fr-FR') + ' $';
  },
  dateStr(d) {
    return (d || new Date()).toLocaleDateString('fr-FR');
  },
  heureStr(d) {
    return (d || new Date()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  },
  toast(msg, type = 'success') {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.className = 'toast toast-' + type + ' show';
    setTimeout(() => t.classList.remove('show'), 3500);
  }
};

function genId() { return db.ref().push().key; }

async function getSemaineActive() {
  const snap = await db.ref('semaines').once('value');
  let active = null;
  Object.entries(snap.val() || {}).forEach(([id, d]) => {
    if (!d.bloquee) active = { id, ...d };
  });
  return active;
}

async function getSemaines() {
  const snap = await db.ref('semaines').once('value');
  const list = [];
  Object.entries(snap.val() || {}).forEach(([id, d]) => list.push({ id, ...d }));
  list.reverse();
  return list;
}

async function getMembres() {
  const snap = await db.ref('membres').once('value');
  const list = [];
  Object.entries(snap.val() || {}).forEach(([id, d]) => {
    if (d.actif !== false) list.push({ id, ...d });
  });
  return list;
}

async function getActions(semaineId) {
  const snap = await db.ref('actions/' + semaineId).once('value');
  const list = [];
  Object.entries(snap.val() || {}).forEach(([id, d]) => list.push({ id, ...d }));
  list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return list;
}

async function populateMembreSelect(selId) {
  const membres = await getMembres();
  const sel = document.getElementById(selId);
  if (!sel) return;
  sel.innerHTML = '<option value="">— Choisir un membre —</option>' +
    membres.map(m => `<option value="${m.id}" data-prenom="${m.prenom}" data-nom="${m.nom||''}">${m.prenom} ${m.nom||''}</option>`).join('');
}

async function populateSemaineSelect(selId, onChange) {
  const semaines = await getSemaines();
  const sel = document.getElementById(selId);
  if (!sel) return;
  sel.innerHTML = semaines.map(s => `<option value="${s.id}">${s.nom}${s.bloquee ? ' 🔒' : ''}</option>`).join('');
  const active = semaines.find(s => !s.bloquee);
  if (active) sel.value = active.id;
  if (onChange) {
    sel.addEventListener('change', () => onChange(sel.value));
    onChange(sel.value);
  }
}

function isAdmin() {
  return Auth.membre && Auth.membre.role === 'admin';
}

function logout() { Auth.logout(); }

// =============================================
// ALIASES COMPAT (fonctions appelées dans les pages)
// =============================================
function formatMoney(n) { return Utils.fmt(n); }
function showToast(msg, type) { Utils.toast(msg, type || 'success'); }
function getUser() { return Auth.membre; }
function confirm2(msg) { return window.confirm(msg); }

// =============================================
// ALIASES — compatibilité avec les pages existantes
// =============================================
function formatMoney(n) { return Utils.fmt(n); }
function showToast(msg, type) { return Utils.toast(msg, type); }
function getUser() { return Auth.membre; }
function confirm2(msg) { return window.confirm(msg); }

// =============================================
// ALIASES DE COMPATIBILITE
// =============================================
function formatMoney(n) { return Utils.fmt(n); }
function showToast(msg, type) { Utils.toast(msg, type || 'success'); }
function getUser() { return Auth.membre; }
function confirm2(msg) { return window.confirm(msg); }

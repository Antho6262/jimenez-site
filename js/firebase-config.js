// VIZU 6BLOCK'S - Firebase Configuration

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCXJPlBL85PkqiuQyLnkjPWnfsAntdydw8",
  authDomain: "famillejimenez-db887.firebaseapp.com",
  databaseURL: "https://famillejimenez-db887-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "famillejimenez-db887",
  storageBucket: "famillejimenez-db887.firebasestorage.app",
  messagingSenderId: "108342190536",
  appId: "1:108342190536:web:586acaa60297f9d463e0fd"
};

firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.database();

const GRADES = [
  "Fondateur",
  "Lead",
  "Co-Lead",
  "Bras droit",
  "Gadjo",
  "Comis"
];

const PERMS_DEFAUT = {
  "Fondateur":  ["dashboard","tracker","stats","stock","logs","quotas","objectifs","blanchiment","sanctions","admin","profil","tv","transactions","taxes"],
  "Lead":       ["dashboard","tracker","stats","stock","logs","quotas","objectifs","blanchiment","sanctions","admin","profil","tv","transactions","taxes"],
  "Co-Lead":    ["dashboard","tracker","stats","stock","logs","quotas","objectifs","blanchiment","sanctions","admin","profil","tv","transactions","taxes"],
  "Bras droit": ["dashboard","tracker","stats","quotas","objectifs","sanctions","profil","transactions","taxes"],
  "Gadjo":      ["dashboard","tracker","stats","quotas","objectifs","sanctions","profil","transactions","taxes"],
  "Comis":      ["dashboard","tracker","stats","quotas","objectifs","sanctions","profil","transactions","taxes"]
};

async function canAccess(page) {
  const user = JSON.parse(sessionStorage.getItem('jimenez_user') || 'null');
  if (!user) return false;
  if (user.role === 'admin') return true;
  try {
    const snap = await db.ref('permissions/' + user.grade + '/' + page).once('value');
    if (snap.exists()) return snap.val() === true;
  } catch(e) {}
  const gradePerms = PERMS_DEFAUT[user.grade] || PERMS_DEFAUT["Comis"];
  return gradePerms.includes(page);
}

function getUser() {
  return JSON.parse(sessionStorage.getItem('jimenez_user') || 'null');
}

function isAdmin() {
  const u = getUser();
  return u && u.role === 'admin';
}

function logout() {
  sessionStorage.removeItem('jimenez_user');
  window.location.href = '../index.html';
}

// Charger les grades depuis Firebase (écrase le tableau GRADES si présent)
db.ref('grades').once('value').then(snap => {
  if (snap.exists()) {
    GRADES.length = 0;
    snap.val().forEach(g => GRADES.push(g));
  } else {
    // Initialiser Firebase avec les grades par défaut
    db.ref('grades').set(GRADES);
  }
});

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

const GRADES = [];

const PERMS_DEFAUT = {};

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
const GRADES_READY = db.ref('grades').once('value').then(snap => {
  if (snap.exists()) {
    GRADES.length = 0;
    snap.val().forEach(g => GRADES.push(g));
  } else {
    // Initialiser Firebase avec les grades par défaut
    db.ref('grades').set(GRADES);
  }
});

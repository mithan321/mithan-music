const $ = id => document.getElementById(id);
const audio = $('audio');

const firebaseConfig = {
  apiKey: "AIzaSyDyqJMIbh2iPzpnzzg2yfhtKDcsntoAzjc",
  authDomain: "mithan-music.firebaseapp.com",
  projectId: "mithan-music",
  storageBucket: "mithan-music.firebasestorage.app",
  messagingSenderId: "375621578843",
  appId: "1:375621578843:web:f25517c38dc5798f7c8f7e",
  measurementId: "G-K4VWENKQ8W"
};

let fbAuth = null, fbFns = null;
(async () => {
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js");
    const authMod = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js");
    fbAuth = authMod.getAuth(initializeApp(firebaseConfig));
    fbFns = authMod;
    authMod.onAuthStateChanged(fbAuth, user => {
      currentUser = user ? { name: user.displayName || user.email.split('@')[0], email: user.email } : null;
      updateAuthUI();
    });
  } catch (e) {}
})();

// ==========================================
// SONGS LIST (Gujarati Songs Folder Included)
// ==========================================
let songs = [
  // --- GUJARATI SONGS FOLDER ---
  {
    title: "Chand Ne Kaho",
    artist: "Jigardan Gadhavi, Sachin-Jigar",
    album: "Gujarati Songs",
    cover: "https://pagallworlds.com/wp-content/uploads/2023/11/Chand-Ne-Kaho.jpg",
    url: "https://pagallworlds.com/wp-content/uploads/2023/11/Chand-Ne-Kaho.mp3",
    duration: "—"
  },
  {
    title: "Vhalam Aavo Ne (Love Ni Bhavai)",
    artist: "Jigardan Gadhavi, Sachin-Jigar",
    album: "Gujarati Songs",
    cover: "https://pagallworlds.com/wp-content/uploads/2023/08/Vhalam-Aavo-Ne.jpg",
    url: "https://pagallworlds.com/wp-content/uploads/2023/08/Vhalam-Aavo-Ne.mp3",
    duration: "—"
  },
  {
    title: "Dhun Laagi (Love Ni Bhavai)",
    artist: "Siddharth Amit Bhavsar, Sachin-Jigar",
    album: "Gujarati Songs",
    cover: "https://pendujatt.com.se/uploads/album/love-ni-bhavai-niren-bhatt.webp",
    url: "https://bajaao.pendujatt.com.se/load/128/16522270/509996/Dhun%20Laagi.mp3",
    duration: "—"
  },

  // --- OTHER SONGS ---
  {
    title: "Dilruba Dilnasheen",
    artist: "Rito Riba",
    album: "Good Energy",
    cover: "https://pagaljatt.co.in/wp-content/uploads/2026/11/Kabile-Tareef-Tu-Rito.jpg",
    url: "https://www.image2url.com/r2/default/audio/1795677686482-e9a3aa03-438e-4a75-a324-c2b94e0545df.mp3",
    duration: "—"
  },
  {
    title: "Late Night Vibes",
    artist: "SoundHelix",
    album: "After Hours",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "—"
  },
  {
    title: "High Voltage",
    artist: "SoundHelix",
    album: "Heat Check",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "—"
  },
  {
    title: "Calm Frequency",
    artist: "SoundHelix",
    album: "Deep Focus",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: "—"
  }
];

let current = -1, liked = new Set(), shuffle = false, repeat = false, view = 'home', activePlaylist = null, customPlaylists = {}, isSignUpMode = false;
let currentUser = JSON.parse(localStorage.getItem('mithan_user') || 'null');

const fmt = n => Number.isFinite(n) ? Math.floor(n / 60) + ':' + String(Math.floor(n % 60)).padStart(2, '0') : '0:00';
const safe = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); setTimeout(() => $('toast').classList.remove('show'), 2600); }

function openAuth() {
  if (currentUser) {
    if (fbAuth && fbFns) fbFns.signOut(fbAuth).catch(() => {});
    currentUser = null; localStorage.removeItem('mithan_user'); audio.pause();
    $('playBtn').textContent = '▶'; $('fpPlayBtn').textContent = '▶'; closeFullPlayer(); updateAuthUI(); toast('Signed out');
  } else {
    $('authModal').classList.add('open');
  }
}
function closeAuth() { $('authModal').classList.remove('open'); }
function requireAuth() { if (!currentUser) { $('authModal').classList.add('open'); toast('Please sign in first'); return false; } return true; }

function updateAuthUI() {
  if (currentUser) {
    $('authBtn').textContent = 'SIGN OUT'; $('authBtn').classList.add('signed-in');
    $('profileIcon').textContent = currentUser.name.slice(0, 1).toUpperCase();
    if (current < 0) $('nowArtist').textContent = 'Welcome, ' + currentUser.name;
  } else {
    $('authBtn').textContent = 'SIGN IN'; $('authBtn').classList.remove('signed-in');
    $('profileIcon').textContent = '?';
    if (current < 0) $('nowArtist').textContent = 'Sign in to play music';
  }
}

$('toggleAuthMode').onclick = () => {
  isSignUpMode = !isSignUpMode;
  $('loginName').style.display = isSignUpMode ? 'block' : 'none';
  $('loginName').required = isSignUpMode;
  $('authTitle').textContent = isSignUpMode ? 'Create Mithan Music Account' : 'Sign in to Mithan Music';
  $('authSubmitBtn').textContent = isSignUpMode ? 'CREATE ACCOUNT' : 'SIGN IN';
  $('authSwitchText').textContent = isSignUpMode ? 'Already have an account?' : 'New here?';
  $('toggleAuthMode').textContent = isSignUpMode ? 'Sign In' : 'Create Account';
};

$('authForm').onsubmit = async e => {
  e.preventDefault();
  const name = $('loginName').value.trim(), email = $('loginEmail').value.trim(), pass = $('loginPass').value;
  try {
    if (fbAuth && fbFns) {
      if (isSignUpMode) {
        const cred = await fbFns.createUserWithEmailAndPassword(fbAuth, email, pass);
        if (name) await fbFns.updateProfile(cred.user, { displayName: name });
        currentUser = { name: name || email.split('@')[0], email };
      } else {
        const cred = await fbFns.signInWithEmailAndPassword(fbAuth, email, pass);
        currentUser = { name: cred.user.displayName || email.split('@')[0], email };
      }
    } else {
      currentUser = { name: name || email.split('@')[0], email };
    }
    localStorage.setItem('mithan_user', JSON.stringify(currentUser));
    updateAuthUI(); closeAuth(); $('authForm').reset();
    toast('Welcome, ' + currentUser.name + '!');
  } catch (err) {
    toast(err.message.replace('Firebase: ', ''));
  }
};

async function downloadSong(idx) {
  if (!requireAuth()) return;
  const s = songs[idx]; if (!s) return;
  toast('Downloading "' + s.title + '"...');
  try {
    const res = await fetch(s.url), blob = await res.blob(), url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = s.title + '.mp3'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  } catch (e) { window.open(s.url, '_blank'); }
}

function artHTML(s) {
  const letter = safe(s.title.slice(0, 1).toUpperCase());
  return s.cover ? `<img src="${safe(s.cover)}" onerror="this.parentElement.textContent='${letter}'">` : letter;
}

function openFullPlayer() { if (!requireAuth()) return; if (current < 0 && songs.length) play(0); $('fullPlayer').classList.add('open'); }
function closeFullPlayer() { $('fullPlayer').classList.remove('open'); }

function render() {
  const list = $('trackList');
  let ids = songs.map((_, i) => i);
  if (view === 'liked') { ids = ids.filter(i => liked.has(i)); $('listHeading').textContent = 'Liked songs'; }
  else if (view === 'playlist' && activePlaylist) { ids = customPlaylists[activePlaylist] || ids.filter(i => songs[i].album === activePlaylist); $('listHeading').textContent = 'Folder: ' + activePlaylist; }
  else $('listHeading').textContent = 'All recent tracks';

  const q = $('searchInput').value.trim().toLowerCase();
  if (q) ids = ids.filter(i => (songs[i].title + ' ' + songs[i].artist + ' ' + songs[i].album).toLowerCase().includes(q));

  list.innerHTML = ids.map((i, n) => {
    let s = songs[i];
    return `<div class="track"><span class="track-index">${String(n + 1).padStart(2, '0')}</span><div class="track-main" data-play="${i}" style="cursor:pointer"><div class="track-art">${artHTML(s)}</div><div style="min-width:0"><div class="track-title">${safe(s.title)}</div><div class="track-artist">${safe(s.artist)}</div></div></div><span class="track-album">${safe(s.album || 'Single')}</span><span class="track-duration">${s.duration || '—'}</span><div style="display:flex;gap:4px;justify-content:flex-end"><button data-dl="${i}" title="Download">⬇</button><button data-like="${i}">${liked.has(i) ? '♥' : '♡'}</button></div></div>`;
  }).join('');

  list.querySelectorAll('[data-play]').forEach(x => x.onclick = () => { if (requireAuth()) { play(+x.dataset.play); openFullPlayer(); } });
  list.querySelectorAll('[data-dl]').forEach(x => x.onclick = e => { e.stopPropagation(); downloadSong(+x.dataset.dl); });
  list.querySelectorAll('[data-like]').forEach(x => x.onclick = () => { if (!requireAuth()) return; let i = +x.dataset.like; liked.has(i) ? liked.delete(i) : liked.add(i); render(); syncLike(); });
}

function play(i) {
  if (!requireAuth() || !songs.length) return;
  current = (i + songs.length) % songs.length;
  const s = songs[current];
  audio.src = s.url;
  audio.play().then(() => { $('playBtn').textContent = 'Ⅱ'; $('fpPlayBtn').textContent = 'Ⅱ'; }).catch(() => toast('Audio blocked'));
  $('nowTitle').textContent = s.title; $('nowArtist').textContent = s.artist; $('miniCover').innerHTML = artHTML(s);
  $('fpTitle').textContent = s.title; $('fpArtist').textContent = s.artist; $('fpArt').innerHTML = artHTML(s);
  syncLike(); render();
}

function syncLike() {
  const isL = liked.has(current);
  $('likeBtn').classList.toggle('liked', isL); $('likeBtn').textContent = isL ? '♥' : '♡';
  $('fpLikeBtn').classList.toggle('liked', isL); $('fpLikeBtn').textContent = isL ? '♥' : '♡';
}

function toggle() {
  if (!requireAuth()) return;
  if (current < 0) return play(0);
  if (audio.paused) { audio.play(); $('playBtn').textContent = 'Ⅱ'; $('fpPlayBtn').textContent = 'Ⅱ'; }
  else { audio.pause(); $('playBtn').textContent = '▶'; $('fpPlayBtn').textContent = '▶'; }
}

const next = () => { if (requireAuth()) play(shuffle ? Math.floor(Math.random() * songs.length) : (current + 1) % songs.length); };
const prev = () => { if (requireAuth()) audio.currentTime > 3 ? audio.currentTime = 0 : play((current - 1 + songs.length) % songs.length); };

document.querySelector('.now').onclick = openFullPlayer;
$('closeFp').onclick = closeFullPlayer;
$('fpDownloadBtn').onclick = () => { if (current >= 0) downloadSong(current); };
$('heroPlay').onclick = () => { if (requireAuth()) { play(current < 0 ? 0 : current); openFullPlayer(); } };
$('upgrade').onclick = () => { if (requireAuth()) $('fileInput').click(); };
$('playBtn').onclick = toggle; $('fpPlayBtn').onclick = toggle;
$('nextBtn').onclick = next; $('fpNext').onclick = next;
$('prevBtn').onclick = prev; $('fpPrev').onclick = prev;
$('likeBtn').onclick = () => { if (requireAuth() && current >= 0) { liked.has(current) ? liked.delete(current) : liked.add(current); syncLike(); render(); } };
$('fpLikeBtn').onclick = $('likeBtn').onclick;
$('volume').oninput = e => audio.volume = +e.target.value; audio.volume = .8;
$('seek').oninput = e => { if (audio.duration) audio.currentTime = +e.target.value / 100 * audio.duration; };
$('fpSeek').oninput = $('seek').oninput;
audio.ontimeupdate = () => { if (audio.duration) { const p = audio.currentTime / audio.duration * 100; $('seek').value = p; $('fpSeek').value = p; $('currentTime').textContent = fmt(audio.currentTime); $('fpCurrent').textContent = fmt(audio.currentTime); $('duration').textContent = fmt(audio.duration); $('fpDuration').textContent = fmt(audio.duration); } };
audio.onended = next;
$('searchInput').oninput = () => { view = 'home'; activePlaylist = null; render(); };

// Sidebar View & Folder Clicks
document.querySelectorAll('.nav button[data-view]').forEach(b => b.onclick = () => {
  view = b.dataset.view; activePlaylist = null;
  document.querySelectorAll('.nav button').forEach(x => x.classList.toggle('active', x === b));
  render();
});

document.querySelectorAll('.nav button[data-folder]').forEach(b => b.onclick = () => {
  view = 'playlist'; activePlaylist = b.dataset.folder;
  document.querySelectorAll('.nav button').forEach(x => x.classList.toggle('active', x === b));
  render();
});

$('viewAll').onclick = $('viewAllTop').onclick = () => {
  view = 'home'; activePlaylist = null;
  document.querySelectorAll('.nav button').forEach(x => x.classList.toggle('active', x.dataset.view === 'home'));
  render();
};

document.querySelectorAll('#featured .album').forEach(card => card.onclick = () => {
  let pl = card.querySelector('h3').textContent.trim();
  view = 'playlist'; activePlaylist = pl; render();
  if (requireAuth()) { let m = songs.findIndex(s => s.album === pl); if (m !== -1) { play(m); openFullPlayer(); } }
});

$('fileInput').onchange = e => { [...e.target.files].forEach(f => { songs.push({ title: f.name.replace(/\.[^.]+$/, ''), artist: 'Local', album: 'Local', cover: '', url: URL.createObjectURL(f), duration: '—' }); }); render(); toast('Added'); };

songs.forEach(s => { let p = new Audio(); p.src = s.url; p.onloadedmetadata = () => { s.duration = fmt(p.duration); render(); }; });
updateAuthUI();
render();
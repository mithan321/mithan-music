// ==========================================
// 1. ANTI-COPY & DEVTOOLS SECURITY SHIELD
// ==========================================
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('cut', e => e.preventDefault());
document.addEventListener('selectstart', e => {
  if (e.target.tagName !== 'INPUT') e.preventDefault();
});

document.addEventListener('keydown', e => {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'K'].includes(e.key.toUpperCase())) ||
    (e.ctrlKey && ['U', 'S', 'P'].includes(e.key.toUpperCase()))
  ) {
    e.preventDefault();
    return false;
  }
});

setInterval(() => {
  console.clear();
  console.log('%cMITHAN MUSIC PROTECTED', 'color:#c8f169;font-size:20px;font-weight:bold;');
}, 3000);

const $ = id => document.getElementById(id);
const audio = $('audio');
audio.controlsList = "nodownload noplaybackrate";

// ==========================================
// 2. FIREBASE CONFIG
// ==========================================
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
// 3. PROTECTED SONGS LIST (10 Gujarati Songs + Time-Synced Lyrics)
// ==========================================
const _d = s => { try { return atob(s); } catch { return s; } };

let songs = [
  {
    title: "Chand Ne Kaho",
    artist: "Jigardan Gadhavi, Sachin-Jigar",
    album: "Gujarati Songs",
    cover: "https://pagallworlds.com/wp-content/uploads/2023/11/Chand-Ne-Kaho.jpg",
    url: _d("aHR0cHM6Ly9wYWdhbGx3b3JsZHMuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDIzLzExL0NoYW5kLU5lLUthaG8ubXAz"),
    duration: "—",
    lyrics: ""
  },
  {
    title: "Vhalam Aavo Ne (Love Ni Bhavai)",
    artist: "Jigardan Gadhavi, Sachin-Jigar",
    album: "Gujarati Songs",
    cover: "https://pagallworlds.com/wp-content/uploads/2023/08/Vhalam-Aavo-Ne.jpg",
    url: _d("aHR0cHM6Ly9wYWdhbGx3b3JsZHMuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDIzLzA4L1ZoYWxhbS1BYXZvLU5lLm1wMw=="),
    duration: "—",
    lyrics: `[00:00] ♪ Music Intro ♪
[00:27] Hu Mane Shodhya Karu Pan Hu Tane Pamya Karu
[00:35] Tu Lai Ne Aave Laagni No Melo Re.
[00:44] Saath Tu Laambi Majal No,
[00:49] Saar Tu Maari Gazal No,
[00:54] Tu Adhuri Vaarta No Chhedo Re.
[01:01] Meethdi Aa Saja Chhe,
[01:05] Dardo Ni Maja Chhe,
[01:09] Taro Virah Pan Laage Vhalo Re…
[01:15] Vhalam Aavo Ne Aavo Ne
[01:19] Vhalam Aavo Ne Aavo Ne
[01:23] Maandi Chhe Love Ni Bhavai
[01:28] O Taa Thaiya Thaiya Taa Thaiya Thai
[01:32] Taa Thaiya Thaiya Taa Thaiya Thai
[01:36] Ke Vhalam Aavo Ne Aavo Ne
[01:40] Man Bhinjavone Aavo Ne
[01:44] Kevi Aa Dil Ni Sagai
[01:48] Ke Maandi Chhe Love Ni Bhavai
[01:53] O Taa Thaiya Thaiya Taa Thaiya Thai
[01:57] Taa Thaiya Thaiya Taa Thaiya Thai O
[02:02] ♪ Instrumental Break ♪
[02:32] Roj Rate Ke Savare Chalta Farta
[02:39] Hu Ane Tara Vicharo Marta Gappa
[02:46] Tari Bolki Aankho,
[02:50] Jane Kholti Vaato,
[02:54] Har Vaat Ma Hu Jaat Bhulu Re…
[03:00] Ke Vhalam Aavo Ne Aavo Ne
[03:04] Vhalam Aavo Ne Aavo Ne
[03:08] Maandi Chhe Love Ni Bhavai
[03:12] O Taa Thaiya Thaiya Ta Thaiya Thai
[03:16] Taa Thaiya Thaiya Ta Thaiya Thai
[03:20] Ke Vhalam Aavo Ne Aavo Ne
[03:24] Man Bhinjavone Aavo Ne
[03:28] Kevi Aa Dil Ni Sagai
[03:32] Ke Maandi Chhe Love Ni Bhavai
[03:36] O Taa Thaiya Thaiya Taa Thaiya Thai
[03:40] Taa Thaiya Thaiya Taa Thaiya Thai O
[03:44] Taa Thaiya Thaiya Taa Thaiya Thai
[03:48] Taa Thaiya Thaiya Taa Thaiya Thai O
[03:53] ♪ Music Interlude ♪
[04:22] Yaado Na Baval Ne Aavya Phool Re Have
[04:29] Tu Aave To Duniya Aakhi Dhul Re Have
[04:36] Taa Thaiya Thaiya Taa Thaiya Thai O
[04:41] Sapna Aasha Manchha Chhodya Mul Re Have
[04:48] Tu Aave To Duniya Aakhi E Ji Dhul Re Have
[04:55] Dhul Re Have Dhul Re Have….
[05:02] Taa Thaiya Thaiya Taa Thaiya Thai
[05:07] Taa Thaiya Thaiya Taa Thaiya Thai o
[05:13] ♪ Music Outro ♪`
  },
  {
    title: "Dhun Laagi (Love Ni Bhavai)",
    artist: "Siddharth Amit Bhavsar, Sachin-Jigar",
    album: "Gujarati Songs",
    cover: "https://pendujatt.com.se/uploads/album/love-ni-bhavai-niren-bhatt.webp",
    url: _d("aHR0cHM6Ly9iYWphYW8ucGVuZHVqYXR0LmNvbS5zZS9sb2FkLzEyOC8xNjUyMjI3MC81MDk5OTYvRGh1biUyMExhYWdpLm1wMw=="),
    duration: "—",
    lyrics: ""
  },
  {
    title: "Pa Pa Pagli",
    artist: "Sonu Nigam, Sachin-Jigar",
    album: "Gujarati Songs",
    cover: "https://pagallworlds.com/wp-content/uploads/2023/11/Pa-Pa-Pagli.jpg",
    url: _d("aHR0cHM6Ly9wYWdhbGx3b3JsZHMuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDIzLzExL1BhLVBhLVBhZ2xpLm1wMw=="),
    duration: "—",
    lyrics: ""
  },
  {
    title: "Mane Malje (Fakt Purusho Maate)",
    artist: "Jigardan Gadhavi 'Jigrra', Kedar-Bhargav",
    album: "Gujarati Songs",
    cover: "https://pagallworlds.com/wp-content/uploads/2025/11/Mane-Malje-From-Fakt-Purusho-Maate-mq.jpg",
    url: _d("aHR0cHM6Ly9wYWdhbGx3b3JsZHMuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDI1LzExL01hbmUtTWFsamUtRnJvbS1GYWt0LVB1cnVzaG8tTWFhdGUtLm1wMw=="),
    duration: "—",
    lyrics: ""
  },
  {
    title: "Khalasi (Coke Studio Bharat)",
    artist: "Aditya Gadhvi, Achint",
    album: "Gujarati Songs",
    cover: "https://hindi-cover.djpunjab.app/cover/GFMCpdydaHa4xq0k3rkz3g==/khalasi-coke-studio-bharat-cover-image.webp",
    url: _d("aHR0cHM6Ly9wYWdhbGx3b3JsZHMuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDIzLzEwL0toYWxhc2kubXAz"),
    duration: "—",
    lyrics: ""
  },
  {
    title: "Madhro Darudo (Hahacar)",
    artist: "Jignesh Barot, Parth Bharat Thakkar",
    album: "Gujarati Songs",
    cover: "https://static.qobuz.com/images/covers/tc/8m/lqj8hsgyp8mtc_600.jpg",
    url: _d("aHR0cHM6Ly93d3cuaW1hZ2UydXJsLmNvbS9yMi9kZWZhdWx0L2F1ZGlvLzE3OTU2OTMxMjMyOTktOTg0NmQyZTgtY2FlMS00ZjVmLWFlZjItMTY0NTM0M2Y0YzExLm1wMw=="),
    duration: "—",
    lyrics: ""
  },
  {
    title: "Tu Maro Dariyo",
    artist: "B Praak, Bhargav Purohit, Kedar-Bhargav",
    album: "Gujarati Songs",
    cover: "https://pendujatt.com.se/uploads/album/tu-maro-dariyo-from.webp",
    url: _d("aHR0cHM6Ly9iYWphYW8ucGVuZHVqYXR0LmRldi9sb2FkLzMyMC81NDI5MDA5Mi8xNDIyNTg2L1R1JTIwTWFybyUyMERhcml5by5tcDM="),
    duration: "—",
    lyrics: ""
  },
  {
    title: "Mann Mohan (Laalo Krishna Sada Sahaayate)",
    artist: "Krishna Beuraa, Smmit Jay",
    album: "Gujarati Songs",
    cover: "https://pagalall.com/wp-content/uploads/Mann-Mohan-Laalo-Krishna-Sada-Sahaayate-Krishna-Beuraa-pagalall.com_-150x150.jpg",
    url: _d("aHR0cHM6Ly9wYWdhbGFsbC5jb20vd3AtY29udGVudC91cGxvYWRzL2FsbC9NYW5uJTIwTW9oYW4lMjAoTGFhbG8lMjBLcmlzaG5hJTIwU2FkYSUyMFNhaGFheWF0ZSklMjBLcmlzaG5hJTIwQmV1cmFhJTIwKHBhZ2FsYWxsLmNvbSkubXAz"),
    duration: "—",
    lyrics: ""
  },
  {
    title: "Kehvu Ghanu Ghanu Chhe",
    artist: "Parthiv Gohil, Meghdhanush",
    album: "Gujarati Songs",
    cover: "https://i.ytimg.com/vi/F7mw6khe9Ss/hq720.jpg",
    url: _d("aHR0cHM6Ly93d3cuaW1hZ2UydXJsLmNvbS9yMi9kZWZhdWx0L2F1ZGlvLzE3OTU3MDU2Mjk1MTQtYzEwNjlmMTMtYjIwMi00OTIzLTlhZjQtZDNiZWM4OTliMjM4Lm1wMw=="),
    duration: "—",
    lyrics: ""
  },
  {
    title: "Dilruba Dilnasheen",
    artist: "Rito Riba",
    album: "Good Energy",
    cover: "https://pagaljatt.co.in/wp-content/uploads/2026/11/Kabile-Tareef-Tu-Rito.jpg",
    url: _d("aHR0cHM6Ly93d3cuaW1hZ2UydXJsLmNvbS9yMi9kZWZhdWx0L2F1ZGlvLzE3OTU2Nzc2ODY0ODItZTlhM2FhMDMtNDM4ZS00YTc1LWEzMjQtYzJiOTRlMDU0NWRmLm1wMw=="),
    duration: "—",
    lyrics: ""
  },
  {
    title: "Late Night Vibes",
    artist: "SoundHelix",
    album: "After Hours",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "—",
    lyrics: ""
  }
];

// ==========================================
// 4. STATE & STORAGE (Saved Likes, Playlists, History)
// ==========================================
let current = -1;
let liked = new Set(JSON.parse(localStorage.getItem('mithan_liked') || '[]'));
let customPlaylists = JSON.parse(localStorage.getItem('mithan_playlists') || '{}');
let recentHistory = JSON.parse(localStorage.getItem('mithan_recent') || '[]');
let shuffle = false;
let repeatMode = 0; // 0 = Off, 1 = Repeat All, 2 = Repeat One
let view = 'home';
let activePlaylist = null;
let isSignUpMode = false;
let currentUser = JSON.parse(localStorage.getItem('mithan_user') || 'null');
let activeBlobUrl = null;
let parsedLyrics = [];
let activeLyricIdx = -1;
let sleepTimerId = null;
let sleepMinutes = 0;

const saveData = () => {
  localStorage.setItem('mithan_liked', JSON.stringify([...liked]));
  localStorage.setItem('mithan_playlists', JSON.stringify(customPlaylists));
  localStorage.setItem('mithan_recent', JSON.stringify(recentHistory));
  $('pmLikedCount').textContent = liked.size;
};

const fmt = n => Number.isFinite(n) ? Math.floor(n / 60) + ':' + String(Math.floor(n % 60)).padStart(2, '0') : '0:00';
const safe = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); setTimeout(() => $('toast').classList.remove('show'), 2600); }

// ==========================================
// 5. TIME-SYNCED LYRICS PARSER & HIGHLIGHTER
// ==========================================
function loadSyncedLyrics(raw, totalDur) {
  const box = $('fpLyricsText');
  parsedLyrics = [];
  activeLyricIdx = -1;

  if (!raw || !raw.trim()) {
    box.innerHTML = '<div class="lyric-line">Lyrics not added for this song yet.</div>';
    return;
  }

  const lines = raw.trim().split('\n').filter(l => l.trim());
  const timeRegex = /^\[(\d{1,2}):(\d{2}(?:\.\d+)?)\]\s*(.*)$/;
  const hasTimestamps = lines.some(l => timeRegex.test(l.trim()));

  if (hasTimestamps) {
    lines.forEach(line => {
      const m = line.trim().match(timeRegex);
      if (m) {
        const sec = parseInt(m[1], 10) * 60 + parseFloat(m[2]);
        parsedLyrics.push({ time: sec, text: m[3] || '♪' });
      }
    });
  } else {
    const dur = Number.isFinite(totalDur) && totalDur > 10 ? totalDur : lines.length * 4;
    const step = dur / lines.length;
    lines.forEach((line, idx) => {
      parsedLyrics.push({ time: idx * step, text: line.trim() });
    });
  }

  box.innerHTML = parsedLyrics.map((item, idx) =>
    `<div class="lyric-line" data-lidx="${idx}" data-time="${item.time}">${safe(item.text)}</div>`
  ).join('');

  box.querySelectorAll('.lyric-line').forEach(el => {
    el.onclick = () => {
      if (audio.duration) {
        audio.currentTime = parseFloat(el.dataset.time);
        syncLyricsHighlight(audio.currentTime);
      }
    };
  });
}

function syncLyricsHighlight(curTime) {
  if (!parsedLyrics.length) return;
  let newIdx = -1;
  for (let i = 0; i < parsedLyrics.length; i++) {
    if (curTime >= parsedLyrics[i].time) newIdx = i;
    else break;
  }

  if (newIdx !== activeLyricIdx) {
    activeLyricIdx = newIdx;
    const allLines = $('fpLyricsText').querySelectorAll('.lyric-line');
    allLines.forEach((el, idx) => {
      el.classList.toggle('active', idx === activeLyricIdx);
    });

    if (activeLyricIdx >= 0 && allLines[activeLyricIdx]) {
      const container = $('fpLyricsBox');
      const activeEl = allLines[activeLyricIdx];
      container.scrollTo({
        top: activeEl.offsetTop - container.offsetTop - container.clientHeight / 2 + activeEl.clientHeight / 2,
        behavior: 'smooth'
      });
    }
  }
}

// ==========================================
// 6. PROFILE DROPDOWN & SLEEP TIMER
// ==========================================
$('profileIcon').onclick = e => {
  e.stopPropagation();
  $('profileMenu').classList.toggle('open');
  $('profileIcon').classList.toggle('active');
};

document.addEventListener('click', e => {
  if (!$('profileMenu').contains(e.target) && e.target !== $('profileIcon')) {
    $('profileMenu').classList.remove('open');
    $('profileIcon').classList.remove('active');
  }
});

$('pmLiked').onclick = () => {
  $('profileMenu').classList.remove('open');
  view = 'liked'; activePlaylist = null; setActiveNav('liked'); render();
};

$('pmRecent').onclick = () => {
  $('profileMenu').classList.remove('open');
  view = 'library'; activePlaylist = null; setActiveNav('library'); render();
};

$('pmNewPl').onclick = () => {
  $('profileMenu').classList.remove('open');
  createNewPlaylist();
};

$('pmSleep').onclick = () => {
  clearTimeout(sleepTimerId);
  if (sleepMinutes === 0) sleepMinutes = 15;
  else if (sleepMinutes === 15) sleepMinutes = 30;
  else sleepMinutes = 0;

  if (sleepMinutes > 0) {
    $('pmSleepState').textContent = sleepMinutes + ' min';
    $('sleepBadge').textContent = '⏱ ' + sleepMinutes + 'm';
    $('sleepBadge').style.display = 'inline-block';
    toast('Sleep timer set for ' + sleepMinutes + ' minutes');
    sleepTimerId = setTimeout(() => {
      audio.pause();
      $('playBtn').textContent = '▶';
      $('fpPlayBtn').textContent = '▶';
      sleepMinutes = 0;
      $('pmSleepState').textContent = 'Off';
      $('sleepBadge').style.display = 'none';
      toast('Sleep timer paused playback');
    }, sleepMinutes * 60 * 1000);
  } else {
    $('pmSleepState').textContent = 'Off';
    $('sleepBadge').style.display = 'none';
    toast('Sleep timer turned off');
  }
};

$('pmShortcuts').onclick = () => {
  $('profileMenu').classList.remove('open');
  toast('Shortcuts: Space = Play/Pause | ←/→ = Seek ±5s | M = Mute');
};

$('pmAuthAction').onclick = () => {
  $('profileMenu').classList.remove('open');
  openAuth();
};

// ==========================================
// 7. CUSTOM PLAYLISTS & SIDEBAR RENDER
// ==========================================
function renderSidebarPlaylists() {
  const box = $('playlistNames');
  const names = Object.keys(customPlaylists);
  box.innerHTML = names.map(name =>
    `<button class="${view === 'playlist' && activePlaylist === name ? 'active' : ''}" data-cpl="${safe(name)}">🎵 ${safe(name)} (${customPlaylists[name].length})</button>`
  ).join('');

  box.querySelectorAll('[data-cpl]').forEach(btn => {
    btn.onclick = () => {
      view = 'playlist';
      activePlaylist = btn.dataset.cpl;
      document.querySelectorAll('.nav button').forEach(x => x.classList.remove('active'));
      renderSidebarPlaylists();
      render();
    };
  });
}

function createNewPlaylist() {
  if (!requireAuth()) return;
  const name = prompt('Enter new playlist name (e.g. Garba Hits, Chill):');
  if (!name || !name.trim()) return;
  const clean = name.trim();
  if (!customPlaylists[clean]) customPlaylists[clean] = [];
  saveData();
  renderSidebarPlaylists();
  toast('Playlist "' + clean + '" created!');
}

$('newPlaylist').onclick = createNewPlaylist;

function addToCustomPlaylist(songIdx) {
  if (!requireAuth()) return;
  const names = Object.keys(customPlaylists);
  if (!names.length) {
    const first = prompt('No custom playlist yet! Enter a name to create one:');
    if (!first || !first.trim()) return;
    customPlaylists[first.trim()] = [songIdx];
    saveData();
    renderSidebarPlaylists();
    toast('Added to "' + first.trim() + '"');
    return;
  }
  const choice = prompt('Type playlist name to add song:\nAvailable: ' + names.join(', '), names[0]);
  if (!choice || !choice.trim()) return;
  const target = choice.trim();
  if (!customPlaylists[target]) customPlaylists[target] = [];
  if (!customPlaylists[target].includes(songIdx)) {
    customPlaylists[target].push(songIdx);
    saveData();
    renderSidebarPlaylists();
    toast('Added to "' + target + '"');
  } else {
    toast('Already in "' + target + '"');
  }
}

// ==========================================
// 8. FIREBASE AUTHENTICATION
// ==========================================
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
    $('pmName').textContent = currentUser.name;
    $('pmEmail').textContent = currentUser.email;
    $('pmAuthAction').textContent = '🚪 Sign Out';
    if (current < 0) $('nowArtist').textContent = 'Welcome, ' + currentUser.name;
  } else {
    $('authBtn').textContent = 'SIGN IN'; $('authBtn').classList.remove('signed-in');
    $('profileIcon').textContent = '?';
    $('pmName').textContent = 'Guest Listener';
    $('pmEmail').textContent = 'Sign in to sync profile';
    $('pmAuthAction').textContent = '🔑 Sign In / Create Account';
    if (current < 0) $('nowArtist').textContent = 'Sign in to play music';
  }
  $('pmLikedCount').textContent = liked.size;
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

// ==========================================
// 9. SEARCH BAR, RENDER & PLAYBACK
// ==========================================
function setActiveNav(v) {
  document.querySelectorAll('.nav button').forEach(x => x.classList.toggle('active', x.dataset.view === v));
  renderSidebarPlaylists();
}

$('searchInput').oninput = () => {
  const q = $('searchInput').value.trim();
  $('clearSearch').classList.toggle('show', q.length > 0);
  if (q) {
    view = 'home';
    activePlaylist = null;
  }
  render();
};

$('clearSearch').onclick = () => {
  $('searchInput').value = '';
  $('clearSearch').classList.remove('show');
  render();
};

async function downloadSong(idx) {
  if (!requireAuth()) return;
  const s = songs[idx]; if (!s) return;
  toast('Preparing "' + s.title + '"...');
  try {
    const res = await fetch(s.url);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = s.title + '.mp3';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (e) {
    toast('Download protected by server CORS');
  }
}

function artHTML(s) {
  const letter = safe(s.title.slice(0, 1).toUpperCase());
  return s.cover ? `<img draggable="false" src="${safe(s.cover)}" onerror="this.parentElement.textContent='${letter}'">` : letter;
}

function openFullPlayer() { if (!requireAuth()) return; if (current < 0 && songs.length) play(0); $('fullPlayer').classList.add('open'); }
function closeFullPlayer() { $('fullPlayer').classList.remove('open'); }

function render() {
  const list = $('trackList');
  const q = $('searchInput').value.trim().toLowerCase();

  // Hide hero & folders while actively searching so results show immediately
  $('heroSection').style.display = q ? 'none' : 'flex';
  $('featuredSection').style.display = q ? 'none' : 'block';

  let ids = songs.map((_, i) => i);
  if (view === 'liked') {
    ids = ids.filter(i => liked.has(i));
    $('listHeading').textContent = 'Liked songs (' + ids.length + ')';
  } else if (view === 'library') {
    ids = recentHistory.filter(i => songs[i]);
    $('listHeading').textContent = 'Recently played (' + ids.length + ')';
  } else if (view === 'playlist' && activePlaylist) {
    ids = customPlaylists[activePlaylist] || ids.filter(i => songs[i].album === activePlaylist);
    $('listHeading').textContent = 'Folder / Playlist: ' + activePlaylist;
  } else {
    $('listHeading').textContent = q ? 'Search results' : 'All recent tracks';
  }

  if (q) {
    ids = ids.filter(i => (songs[i].title + ' ' + songs[i].artist + ' ' + songs[i].album).toLowerCase().includes(q));
  }

  if (!ids.length) {
    list.innerHTML = `<div class="empty">${q ? `No songs matched "<strong>${safe(q)}</strong>".<br><button class="primary" style="margin-top:10px" onclick="document.getElementById('clearSearch').click()">CLEAR SEARCH</button>` : 'No songs in this section yet.'}</div>`;
    return;
  }

  list.innerHTML = ids.map((i, n) => {
    let s = songs[i];
    const isPlaying = i === current;
    return `<div class="track ${isPlaying ? 'playing' : ''}">
      <span class="track-index">${isPlaying ? '▶' : String(n + 1).padStart(2, '0')}</span>
      <div class="track-main" data-play="${i}" style="cursor:pointer">
        <div class="track-art">${artHTML(s)}</div>
        <div style="min-width:0">
          <div class="track-title">${safe(s.title)}</div>
          <div class="track-artist">${safe(s.artist)}</div>
        </div>
      </div>
      <span class="track-album">${safe(s.album || 'Single')}</span>
      <span class="track-duration">${s.duration || '—'}</span>
      <div style="display:flex;gap:4px;justify-content:flex-end">
        <button data-addpl="${i}" title="Add to Playlist">＋</button>
        <button data-dl="${i}" title="Download">⬇</button>
        <button data-like="${i}" title="Like">${liked.has(i) ? '♥' : '♡'}</button>
      </div>
    </div>`;
  }).join('');

  list.querySelectorAll('[data-play]').forEach(x => x.onclick = () => { if (requireAuth()) { play(+x.dataset.play); openFullPlayer(); } });
  list.querySelectorAll('[data-addpl]').forEach(x => x.onclick = e => { e.stopPropagation(); addToCustomPlaylist(+x.dataset.addpl); });
  list.querySelectorAll('[data-dl]').forEach(x => x.onclick = e => { e.stopPropagation(); downloadSong(+x.dataset.dl); });
  list.querySelectorAll('[data-like]').forEach(x => x.onclick = () => {
    if (!requireAuth()) return;
    let i = +x.dataset.like;
    liked.has(i) ? liked.delete(i) : liked.add(i);
    saveData();
    render();
    syncLike();
  });
}

async function play(i) {
  if (!requireAuth() || !songs.length) return;
  current = (i + songs.length) % songs.length;
  const s = songs[current];

  // Track Recently Played
  recentHistory = [current, ...recentHistory.filter(x => x !== current)].slice(0, 20);
  saveData();

  $('nowTitle').textContent = s.title;
  $('nowArtist').textContent = s.artist;
  $('miniCover').innerHTML = artHTML(s);
  $('fpTitle').textContent = s.title;
  $('fpArtist').textContent = s.artist;
  $('fpArt').innerHTML = artHTML(s);
  loadSyncedLyrics(s.lyrics, audio.duration);
  if (s.lyrics && s.lyrics.trim()) $('fpLyricsBox').classList.add('open');
  syncLike();
  render();

  if (activeBlobUrl) {
    URL.revokeObjectURL(activeBlobUrl);
    activeBlobUrl = null;
  }

  try {
    const res = await fetch(s.url);
    const blob = await res.blob();
    activeBlobUrl = URL.createObjectURL(blob);
    audio.src = activeBlobUrl;
    await audio.play();
    $('playBtn').textContent = 'Ⅱ';
    $('fpPlayBtn').textContent = 'Ⅱ';
    setTimeout(() => audio.removeAttribute('src'), 300);
  } catch (err) {
    audio.src = s.url;
    audio.play().then(() => {
      $('playBtn').textContent = 'Ⅱ';
      $('fpPlayBtn').textContent = 'Ⅱ';
      setTimeout(() => audio.removeAttribute('src'), 300);
    }).catch(() => toast('Audio stream unavailable'));
  }
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

function toggleShuffle() {
  shuffle = !shuffle;
  $('shuffleBtn').classList.toggle('active-mode', shuffle);
  $('fpShuffle').classList.toggle('active-mode', shuffle);
  toast(shuffle ? 'Shuffle: ON' : 'Shuffle: OFF');
}

function toggleRepeat() {
  repeatMode = (repeatMode + 1) % 3;
  const active = repeatMode > 0;
  const label = repeatMode === 2 ? '↻1' : '↻';
  $('repeatBtn').textContent = label;
  $('fpRepeat').textContent = label;
  $('repeatBtn').classList.toggle('active-mode', active);
  $('fpRepeat').classList.toggle('active-mode', active);
  toast(repeatMode === 0 ? 'Repeat: OFF' : repeatMode === 1 ? 'Repeat All: ON' : 'Repeat Current Song: ON');
}

const next = () => {
  if (!requireAuth()) return;
  if (repeatMode === 2 && current >= 0) {
    audio.currentTime = 0;
    audio.play();
    return;
  }
  play(shuffle ? Math.floor(Math.random() * songs.length) : (current + 1) % songs.length);
};

const prev = () => {
  if (!requireAuth()) return;
  audio.currentTime > 3 ? audio.currentTime = 0 : play((current - 1 + songs.length) % songs.length);
};

// Controls Binding
document.querySelector('.now').onclick = openFullPlayer;
$('closeFp').onclick = closeFullPlayer;
$('fpLyricsBtn').onclick = () => $('fpLyricsBox').classList.toggle('open');
$('closeLyrics').onclick = () => $('fpLyricsBox').classList.remove('open');
$('fpDownloadBtn').onclick = () => { if (current >= 0) downloadSong(current); };
$('heroPlay').onclick = () => { if (requireAuth()) { play(current < 0 ? 0 : current); openFullPlayer(); } };
$('upgrade').onclick = () => { if (requireAuth()) $('fileInput').click(); };
$('playBtn').onclick = toggle; $('fpPlayBtn').onclick = toggle;
$('nextBtn').onclick = next; $('fpNext').onclick = next;
$('prevBtn').onclick = prev; $('fpPrev').onclick = prev;
$('shuffleBtn').onclick = toggleShuffle; $('fpShuffle').onclick = toggleShuffle;
$('repeatBtn').onclick = toggleRepeat; $('fpRepeat').onclick = toggleRepeat;

$('likeBtn').onclick = () => {
  if (requireAuth() && current >= 0) {
    liked.has(current) ? liked.delete(current) : liked.add(current);
    saveData();
    syncLike();
    render();
  }
};
$('fpLikeBtn').onclick = $('likeBtn').onclick;

$('volume').oninput = e => { audio.volume = +e.target.value; audio.muted = false; };
audio.volume = .8;
$('muteBtn').onclick = () => {
  audio.muted = !audio.muted;
  toast(audio.muted ? 'Muted' : 'Unmuted');
};

$('seek').oninput = e => { if (audio.duration) audio.currentTime = +e.target.value / 100 * audio.duration; };
$('fpSeek').oninput = $('seek').oninput;

audio.ontimeupdate = () => {
  if (audio.duration) {
    const p = audio.currentTime / audio.duration * 100;
    $('seek').value = p;
    $('fpSeek').value = p;
    $('currentTime').textContent = fmt(audio.currentTime);
    $('fpCurrent').textContent = fmt(audio.currentTime);
    $('duration').textContent = fmt(audio.duration);
    $('fpDuration').textContent = fmt(audio.duration);
    syncLyricsHighlight(audio.currentTime);
  }
};

audio.onended = next;

// Keyboard Shortcuts (Space, Left/Right Seek, M Mute)
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.ctrlKey || e.altKey) return;
  if (e.code === 'Space') { e.preventDefault(); toggle(); }
  else if (e.code === 'ArrowRight' && audio.duration) { audio.currentTime = Math.min(audio.duration, audio.currentTime + 5); }
  else if (e.code === 'ArrowLeft' && audio.duration) { audio.currentTime = Math.max(0, audio.currentTime - 5); }
  else if (e.key.toLowerCase() === 'm') { audio.muted = !audio.muted; toast(audio.muted ? 'Muted' : 'Unmuted'); }
});

// Sidebar Views & Folders
document.querySelectorAll('.nav button[data-view]').forEach(b => b.onclick = () => {
  const targetView = b.dataset.view;
  if (targetView === 'search') {
    $('searchInput').focus();
    setActiveNav('search');
    return;
  }
  view = targetView;
  activePlaylist = null;
  setActiveNav(view);
  render();
});

document.querySelectorAll('.nav button[data-folder]').forEach(b => b.onclick = () => {
  view = 'playlist';
  activePlaylist = b.dataset.folder;
  document.querySelectorAll('.nav button').forEach(x => x.classList.toggle('active', x === b));
  renderSidebarPlaylists();
  render();
});

$('viewAll').onclick = $('viewAllTop').onclick = () => {
  view = 'home';
  activePlaylist = null;
  $('searchInput').value = '';
  $('clearSearch').classList.remove('show');
  setActiveNav('home');
  render();
};

document.querySelectorAll('#featured .album').forEach(card => card.onclick = () => {
  let pl = card.querySelector('h3').textContent.trim();
  view = 'playlist'; activePlaylist = pl; render();
  if (requireAuth()) { let m = songs.findIndex(s => s.album === pl); if (m !== -1) { play(m); openFullPlayer(); } }
});

$('fileInput').onchange = e => {
  [...e.target.files].forEach(f => {
    songs.push({ title: f.name.replace(/\.[^.]+$/, ''), artist: 'Local', album: 'Local', cover: '', url: URL.createObjectURL(f), duration: '—', lyrics: '' });
  });
  render();
  toast('Added');
};

songs.forEach(s => {
  let p = new Audio();
  p.src = s.url;
  p.onloadedmetadata = () => { s.duration = fmt(p.duration); render(); };
});

updateAuthUI();
renderSidebarPlaylists();
render():
// ==========================================
// MITHAN STUDIO - PUBLIC SONG SYNC
// ==========================================

async function loadStudioSongs() {
  try {
    const { createClient } = await import(
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
    );

    const studioClient = createClient(
      "https://itjlkkjefeundpqfnvut.supabase.co",
      "sb_publishable_iFwh8jKMbkg8eP9CtiBrMA_31RnNzhx"
    );

    const { data, error } = await studioClient
      .from("songs")
      .select("id,title,artist,album,audio_url,cover_url,created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const existingUrls = new Set(songs.map(song => song.url));

    const studioSongs = (data || [])
      .filter(song => song.audio_url && !existingUrls.has(song.audio_url))
      .map(song => ({
        title: song.title || "Untitled",
        artist: song.artist || "Unknown Artist",
        album: song.album || "Single",
        cover: song.cover_url || "",
        url: song.audio_url,
        duration: "—",
        lyrics: "",
        source: "studio",
        studioId: song.id
      }));

    if (studioSongs.length > 0) {
      songs.push(...studioSongs);

      studioSongs.forEach(song => {
        const audioCheck = new Audio();
        audioCheck.preload = "metadata";
        audioCheck.src = song.url;

        audioCheck.onloadedmetadata = () => {
          song.duration = fmt(audioCheck.duration);
          render();
        };
      });

      render();
      console.log("Mithan Studio songs loaded:", studioSongs.length);
    }

  } catch (error) {
    console.error("Mithan Studio Sync Error:", error);
    toast("Studio songs could not load");
  }
}

loadStudioSongs();



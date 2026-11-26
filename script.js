const $ = id => document.getElementById(id);
const audio = $('audio');

// 1. Songs List with Cover Photo & Audio Link
let songs = [
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
  },
  {
    title: "Future Horizon",
    artist: "SoundHelix",
    album: "New Wave",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    duration: "—"
  }
];

let current = -1;
let liked = new Set();
let shuffle = false;
let repeat = false;
let view = 'home';
let activePlaylist = null;
let customPlaylists = {};

const fmt = n => Number.isFinite(n) ? Math.floor(n / 60) + ':' + String(Math.floor(n % 60)).padStart(2, '0') : '0:00';
const safe = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

function toast(s) {
  $('toast').textContent = s;
  $('toast').classList.add('show');
  setTimeout(() => $('toast').classList.remove('show'), 2200);
}

function artHTML(s) {
  const letter = safe(s.title.slice(0, 1).toUpperCase());
  return s.cover
    ? `<img src="${safe(s.cover)}" alt="${safe(s.title)}" onerror="this.parentElement.textContent='${letter}'">`
    : letter;
}

// Full-Screen Player Open / Close
function openFullPlayer() {
  if (current < 0 && songs.length) play(0);
  $('fullPlayer').classList.add('open');
}

function closeFullPlayer() {
  $('fullPlayer').classList.remove('open');
}

// Track List Render
function render() {
  const list = $('trackList');
  let ids = songs.map((_, i) => i);

  if (view === 'liked') {
    ids = ids.filter(i => liked.has(i));
    $('listHeading').textContent = 'Liked songs';
  } else if (view === 'playlist' && activePlaylist) {
    if (customPlaylists[activePlaylist]) {
      ids = customPlaylists[activePlaylist];
    } else {
      ids = ids.filter(i => songs[i].album === activePlaylist);
    }
    $('listHeading').textContent = 'Playlist: ' + activePlaylist;
  } else {
    $('listHeading').textContent = 'Your recent tracks';
  }

  const q = $('searchInput').value.trim().toLowerCase();
  if (q) {
    ids = ids.filter(i => (songs[i].title + ' ' + songs[i].artist + ' ' + songs[i].album).toLowerCase().includes(q));
    $('listHeading').textContent = 'Search results';
  }

  if (!ids.length) {
    list.innerHTML = '<div class="empty">No tracks in this list.<br>Click "+" next to any song on Home to add it to your playlist, or click EXPLORE PREMIUM to add local MP3 files.</div>';
    return;
  }

  list.innerHTML = ids.map((i, n) => {
    let s = songs[i];
    return `<div class="track">
      <span class="track-index">${String(n + 1).padStart(2, '0')}</span>
      <div class="track-main" data-play="${i}" style="cursor:pointer">
        <div class="track-art">${artHTML(s)}</div>
        <div style="min-width:0">
          <div class="track-title">${safe(s.title)}</div>
          <div class="track-artist">${safe(s.artist)}</div>
        </div>
      </div>
      <span class="track-album">${safe(s.album || 'Single')}</span>
      <span class="track-duration">${s.duration || '—'}</span>
      <div style="display:flex;gap:6px;align-items:center">
        <button data-addpl="${i}" title="Add to Playlist" style="font-size:14px">+</button>
        <button data-like="${i}" aria-label="Like">${liked.has(i) ? '♥' : '♡'}</button>
      </div>
    </div>`;
  }).join('');

  // Geet par click karta j play thay ane Full-Screen Player khule
  list.querySelectorAll('[data-play]').forEach(x => x.onclick = () => {
    play(+x.dataset.play);
    openFullPlayer();
  });
  
  list.querySelectorAll('[data-like]').forEach(x => x.onclick = () => {
    let i = +x.dataset.like;
    liked.has(i) ? liked.delete(i) : liked.add(i);
    render();
    syncLike();
  });

  list.querySelectorAll('[data-addpl]').forEach(x => x.onclick = () => {
    let idx = +x.dataset.addpl;
    let names = Object.keys(customPlaylists);
    if (!names.length) {
      let n = prompt('Enter a new playlist name first:');
      if (!n || !n.trim()) return;
      createCustomPlaylist(n.trim());
      names = Object.keys(customPlaylists);
    }
    let target = names.length === 1 ? names[0] : prompt('Type playlist name to add (' + names.join(', ') + '):', names[0]);
    if (target && customPlaylists[target]) {
      if (!customPlaylists[target].includes(idx)) customPlaylists[target].push(idx);
      toast('Added to ' + target);
    }
  });
}

function play(i) {
  if (!songs.length) return;
  current = (i + songs.length) % songs.length;
  const s = songs[current];
  audio.src = s.url;
  audio.play()
    .then(() => {
      $('playBtn').textContent = 'Ⅱ';
      $('fpPlayBtn').textContent = 'Ⅱ';
    })
    .catch(() => toast('Unable to play this audio link'));

  // Mini Player Update
  $('nowTitle').textContent = s.title;
  $('nowArtist').textContent = s.artist;
  $('miniCover').innerHTML = artHTML(s);

  // Full-Screen Player Update
  $('fpTitle').textContent = s.title;
  $('fpArtist').textContent = s.artist;
  $('fpArt').innerHTML = artHTML(s);

  syncLike();
  render();
}

function syncLike() {
  const isLiked = liked.has(current);
  $('likeBtn').classList.toggle('liked', isLiked);
  $('likeBtn').textContent = isLiked ? '♥' : '♡';
  $('fpLikeBtn').classList.toggle('liked', isLiked);
  $('fpLikeBtn').textContent = isLiked ? '♥' : '♡';
}

function toggle() {
  if (current < 0) {
    if (songs.length) play(0);
    else $('fileInput').click();
    return;
  }
  if (audio.paused) {
    audio.play();
    $('playBtn').textContent = 'Ⅱ';
    $('fpPlayBtn').textContent = 'Ⅱ';
  } else {
    audio.pause();
    $('playBtn').textContent = '▶';
    $('fpPlayBtn').textContent = '▶';
  }
}

function next() {
  if (!songs.length) return;
  play(shuffle ? Math.floor(Math.random() * songs.length) : (current + 1) % songs.length);
}

function prev() {
  if (!songs.length) return;
  if (audio.currentTime > 3) audio.currentTime = 0;
  else play((current - 1 + songs.length) % songs.length);
}

function toggleShuffle() {
  shuffle = !shuffle;
  const col = shuffle ? 'var(--accent)' : '';
  $('shuffleBtn').style.color = col;
  $('fpShuffle').style.color = col;
  toast(shuffle ? 'Shuffle enabled' : 'Shuffle disabled');
}

function toggleRepeat() {
  repeat = !repeat;
  const col = repeat ? 'var(--accent)' : '';
  $('repeatBtn').style.color = col;
  $('fpRepeat').style.color = col;
  toast(repeat ? 'Repeat enabled' : 'Repeat disabled');
}

function toggleLike() {
  if (current < 0) return;
  liked.has(current) ? liked.delete(current) : liked.add(current);
  syncLike();
  render();
}

// Local Device Files Upload
$('fileInput').onchange = e => {
  [...e.target.files].forEach(f => {
    let url = URL.createObjectURL(f);
    let s = {
      title: f.name.replace(/\.[^.]+$/, ''),
      artist: 'Your device',
      album: 'Local Library',
      cover: "",
      url,
      duration: '—'
    };
    songs.push(s);
    let probe = new Audio();
    probe.src = url;
    probe.onloadedmetadata = () => {
      s.duration = fmt(probe.duration);
      render();
    };
  });
  view = 'home';
  activePlaylist = null;
  render();
  if (current < 0 && songs.length) {
    play(0);
    openFullPlayer();
  }
  e.target.value = '';
  toast('Music added to your library');
};

// Curated Cards Click
document.querySelectorAll('#featured .album').forEach(card => {
  card.onclick = () => {
    let plName = card.querySelector('h3').textContent.trim();
    view = 'playlist';
    activePlaylist = plName;
    render();
    let firstMatch = songs.findIndex(s => s.album === plName);
    if (firstMatch !== -1) {
      play(firstMatch);
      openFullPlayer();
    }
    toast('Playing ' + plName);
  };
});

// Custom Playlist Creation
function createCustomPlaylist(name) {
  if (!customPlaylists[name]) {
    customPlaylists[name] = [];
    let b = document.createElement('button');
    b.textContent = name;
    b.onclick = () => {
      view = 'playlist';
      activePlaylist = name;
      render();
    };
    $('playlistNames').appendChild(b);
  }
}

$('newPlaylist').onclick = () => {
  let n = prompt('Playlist name');
  if (n && n.trim()) {
    createCustomPlaylist(n.trim());
    toast('Playlist "' + n.trim() + '" created! Click + on any song to add.');
  }
};

// Mini & Full Player Events
document.querySelector('.now').onclick = openFullPlayer;
$('closeFp').onclick = closeFullPlayer;

$('upgrade').onclick = () => $('fileInput').click();
$('heroPlay').onclick = () => {
  if (songs.length) {
    play(current < 0 ? 0 : current);
    openFullPlayer();
  } else {
    $('fileInput').click();
  }
};

$('playBtn').onclick = toggle;
$('fpPlayBtn').onclick = toggle;
$('nextBtn').onclick = next;
$('fpNext').onclick = next;
$('prevBtn').onclick = prev;
$('fpPrev').onclick = prev;

$('shuffleBtn').onclick = toggleShuffle;
$('fpShuffle').onclick = toggleShuffle;
$('repeatBtn').onclick = toggleRepeat;
$('fpRepeat').onclick = toggleRepeat;

$('likeBtn').onclick = toggleLike;
$('fpLikeBtn').onclick = toggleLike;

$('volume').oninput = e => audio.volume = +e.target.value;
audio.volume = 0.8;

$('seek').oninput = e => {
  if (audio.duration) audio.currentTime = +e.target.value / 100 * audio.duration;
};
$('fpSeek').oninput = e => {
  if (audio.duration) audio.currentTime = +e.target.value / 100 * audio.duration;
};

audio.ontimeupdate = () => {
  if (audio.duration) {
    const pct = audio.currentTime / audio.duration * 100;
    const cur = fmt(audio.currentTime);
    const dur = fmt(audio.duration);
    $('seek').value = pct;
    $('fpSeek').value = pct;
    $('currentTime').textContent = cur;
    $('fpCurrent').textContent = cur;
    $('duration').textContent = dur;
    $('fpDuration').textContent = dur;
  }
};

audio.onended = () => repeat ? (audio.currentTime = 0, audio.play()) : next();

$('searchInput').oninput = () => {
  view = 'home';
  activePlaylist = null;
  render();
};

document.querySelectorAll('.nav button[data-view]').forEach(b => b.onclick = () => {
  view = b.dataset.view;
  activePlaylist = null;
  document.querySelectorAll('.nav button').forEach(x => x.classList.toggle('active', x === b));
  if (view === 'search') $('searchInput').focus();
  render();
});

$('viewAll').onclick = () => {
  view = 'home';
  activePlaylist = null;
  document.querySelectorAll('.nav button').forEach(x => x.classList.toggle('active', x.dataset.view === 'home'));
  render();
};

// Initial Load
songs.forEach(s => {
  let probe = new Audio();
  probe.src = s.url;
  probe.onloadedmetadata = () => {
    s.duration = fmt(probe.duration);
    render();
  };
});

render();
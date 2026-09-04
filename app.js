const CODEX_API = window.CODEX_CONFIG?.apiBase || '/api/proxy?path=';
const FALLBACK_THUMB = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=82';

const COURSES = [
  { id: 183, title: 'Nirmaan Summer Camp', subtitle: 'Class 8 · Foundation', category: 'School', provider: 'CODEXSTUDYS Faculty', thumb: 'https://dylnd2lqy6eys.cloudfront.net/1770981347/admin_v2/uploads/courses/thumbnail/1583344_125_Nirmaan%20Summer%20Camp%20App%20Banners09%20%281%29.jpg', tone: '', count: '124 lessons', description: 'A focused foundation programme for stronger concepts, habits, and exam confidence.' },
  { id: 177, title: 'Nirmaan Batch', subtitle: 'Class 8 · 2026–27', category: 'School', provider: 'CODEXSTUDYS Faculty', thumb: 'https://dylnd2lqy6eys.cloudfront.net/1770981347/admin_v2/uploads/courses/thumbnail/6956338_125_Nirbhay%20Batch%20Class%208th%20App%20Banners09.jpg', tone: 'coral', count: '96 lessons', description: 'Build a reliable base across mathematics, science, and language with guided practice.' },
  { id: 178, title: 'Aarambh 9th', subtitle: 'Class 9 · 2026–27', category: 'School', provider: 'CODEXSTUDYS Faculty', thumb: 'https://dylnd2lqy6eys.cloudfront.net/1770981347/admin_v2/uploads/courses/thumbnail/6571450_125_aarambh%202027%20class%209th%20banner%20app.png', tone: 'yellow', count: '148 lessons', description: 'A clear, steady path from first principles to confident school exam preparation.' },
  { id: 179, title: 'Aarambh Plus 9th', subtitle: 'Class 9 · Advanced', category: 'School', provider: 'CODEXSTUDYS Faculty', thumb: 'https://dylnd2lqy6eys.cloudfront.net/1770981347/admin_v2/uploads/courses/thumbnail/2788484_125_aarambh%20plus%202027%20class%209th%20banner%20app.png', tone: 'navy', count: '172 lessons', description: 'Deeper problem-solving, weekly revision, and a richer practice track for ambitious learners.' },
  { id: 176, title: 'Aarambh 10th', subtitle: 'Class 10 · 2026–27', category: 'School', provider: 'CODEXSTUDYS Faculty', thumb: 'https://dylnd2lqy6eys.cloudfront.net/1770981347/admin_v2/uploads/courses/thumbnail/4628574_125_aarambh%20banner%20app%202026%202.jpg', tone: 'coral', count: '184 lessons', description: 'Exam-oriented coverage with clear concepts, active recall, and focused test practice.' },
  { id: 107, title: 'Prarambh Science', subtitle: 'Class 11 · PCMB', category: 'Science', provider: 'CODEXSTUDYS Faculty', thumb: 'https://dxixtlyravvxx.cloudfront.net/1770981347/admin_v2/uploads/courses/thumbnail/2159678_125_Science%20Prarambh%20Batch%20Class%2011th%20App%20Banners.jpg', tone: 'yellow', count: '216 lessons', description: 'Structured concept learning for Physics, Chemistry, Mathematics, and Biology.' },
  { id: 108, title: 'Prarambh Commerce', subtitle: 'Class 11 · Commerce', category: 'Commerce', provider: 'CODEXSTUDYS Faculty', thumb: 'https://dxixtlyravvxx.cloudfront.net/1770981347/admin_v2/uploads/courses/thumbnail/1338423_125_Commerce%20Prarambh%20Batch%20Class%2011th%20App%20Banners.jpg', tone: 'navy', count: '164 lessons', description: 'A practical start to accountancy, economics, business studies, and stronger exam answers.' },
  { id: 122, title: 'CUET Science', subtitle: 'Entrance · 2026–27', category: 'Entrance', provider: 'CODEXSTUDYS Faculty', thumb: FALLBACK_THUMB, tone: '', count: '138 lessons', description: 'A smart revision system for speed, accuracy, and confidence in entrance preparation.' },
];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[char]));
const params = new URLSearchParams(location.search);

function icon(name) {
  const icons = { search:'⌕', arrow:'↗', folder:'▰', video:'▶', pdf:'▤', book:'▥', sparkle:'✦', clock:'◷', menu:'☰', back:'←' };
  return icons[name] || '•';
}

function courseById(id) { return COURSES.find(course => String(course.id) === String(id)) || COURSES[0]; }

function setupNavigation() {
  const menu = $('.mobile-menu-btn');
  const nav = $('.nav');
  if (menu && nav) menu.addEventListener('click', () => {
    const open = nav.classList.toggle('mobile-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  $$('.global-search').forEach(input => input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && input.value.trim()) location.href = `courses.html?q=${encodeURIComponent(input.value.trim())}`;
  }));
}

function courseCard(course, index = 0) {
  return `<article class="course-card" style="animation-delay:${index * 40}ms">
    <a href="batch.html?id=${course.id}" aria-label="View ${esc(course.title)} course">
      <div class="course-cover ${esc(course.tone)}" style="background-image:linear-gradient(135deg,rgba(184,238,226,.82),rgba(92,160,157,.72)),url('${esc(course.thumb || FALLBACK_THUMB)}')">
        <span class="cover-kicker">${esc(course.subtitle)}</span>
        <span class="cover-number">${String(index + 1).padStart(2, '0')}</span>
        <h3>${esc(course.title)}</h3>
      </div>
    </a>
    <div class="course-body">
      <div class="course-provider">${esc(course.provider)}</div>
      <h3>${esc(course.title)}</h3>
      <p>${esc(course.description)}</p>
      <div class="course-meta"><span class="pill">${icon('book')} ${esc(course.subtitle)}</span><span class="pill">${icon('video')} ${esc(course.count)}</span></div>
      <div class="course-footer"><small>${esc(course.category)} · Self-paced</small><a class="btn btn-primary btn-small" href="batch.html?id=${course.id}">View course ${icon('arrow')}</a></div>
    </div>
  </article>`;
}

function renderCourseGrid(target, list = COURSES) {
  if (!target) return;
  target.innerHTML = list.length ? list.map(courseCard).join('') : `<div class="empty-state"><div class="empty-mark">${icon('search')}</div><h3>No learning paths found</h3><p>Try a different course name, subject, or class.</p><button class="btn btn-secondary btn-small" onclick="location.href='courses.html'">Reset search</button></div>`;
}

function initHome() {
  const target = $('#popularCourses');
  renderCourseGrid(target, COURSES.slice(0, 6));
  setupNavigation();
}

function initCourses() {
  setupNavigation();
  const target = $('#courseGrid');
  const search = $('#courseSearch');
  const category = $('#courseCategory');
  const sort = $('#courseSort');
  const update = () => {
    let result = [...COURSES];
    const query = (search?.value || '').trim().toLowerCase();
    if (query) result = result.filter(course => [course.title, course.subtitle, course.category, course.description].join(' ').toLowerCase().includes(query));
    if (category?.value) result = result.filter(course => course.category === category.value);
    if (sort?.value === 'az') result.sort((a,b) => a.title.localeCompare(b.title));
    if (sort?.value === 'latest') result = [...result].reverse();
    renderCourseGrid(target, result);
  };
  if (search) search.value = params.get('q') || '';
  if (category && params.get('category')) category.value = params.get('category');
  [search, category, sort].forEach(el => el?.addEventListener(el === search ? 'input' : 'change', update));
  update();
}

async function api(path, options = {}) {
  const response = await fetch(`${CODEX_API}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

function showError(target, message, retry) {
  if (!target) return;
  target.innerHTML = `<div class="error-state"><div class="empty-mark">!</div><h3>We couldn't load that yet</h3><p>${esc(message || 'There was a temporary connection issue.')}</p><button class="btn btn-secondary btn-small" id="retryContent">Try again</button></div>`;
  $('#retryContent', target)?.addEventListener('click', retry);
}

function showSkeletons(target, count = 8) {
  target.innerHTML = Array.from({ length: count }, () => `<div class="skeleton-card"><div class="skeleton skeleton-cover"></div><div class="skeleton-body"><span class="skeleton skeleton-line short"></span><span class="skeleton skeleton-line"></span><span class="skeleton skeleton-line short"></span></div></div>`).join('');
}

function formatDuration(seconds) {
  if (!seconds) return 'On demand';
  const mins = Math.floor(Number(seconds) / 60);
  return mins > 59 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
}

function contentCard(item, courseId) {
  const data = item.data || {};
  const isFolder = item.type === 'folder';
  const label = isFolder ? 'Folder' : (data.file_type || 'Video');
  return `<button class="content-card ${isFolder ? 'folder' : 'file'}" data-content-id="${esc(item.entity_id || '')}" data-content-type="${isFolder ? 'folder' : 'file'}" data-course-id="${courseId}" data-title="${esc(item.title || 'Untitled')}">
    <span class="content-icon">${icon(isFolder ? 'folder' : label.toLowerCase().includes('pdf') ? 'pdf' : 'video')}</span>
    <h3>${esc(item.title || 'Untitled')}</h3>
    <small>${isFolder ? 'Open library' : `${label} · ${formatDuration(data.duration)}`}</small>
  </button>`;
}

async function resolveAndPlay(item, courseId) {
  const data = item.data || {};
  let url = data.file_url || data.url;
  if (!url && item.entity_id) {
    try { const result = await api(`/nt/details?content_id=${encodeURIComponent(item.entity_id)}&course_id=${encodeURIComponent(courseId)}`); url = result.data?.file_url || result.data?.url; } catch { /* handled below */ }
  }
  if (!url) { toast('This lesson is not available yet.'); return; }
  if (/youtube\.com|youtu\.be/i.test(url)) { location.href = url; return; }
  if (!/\.(m3u8|mpd|mp4)(\?|$)/i.test(url)) { location.href = url; return; }
  location.href = `player.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(item.title || 'Lesson')}&course=${encodeURIComponent(courseId)}`;
}

function initBatch() {
  setupNavigation();
  const course = courseById(params.get('id') || 183);
  $('#detailTitle').textContent = course.title;
  $('#detailDescription').textContent = course.description;
  $('#detailCoverTitle').textContent = course.title;
  $('#detailCover').style.backgroundImage = `linear-gradient(135deg,rgba(184,238,226,.82),rgba(92,160,157,.72)),url('${course.thumb || FALLBACK_THUMB}')`;
  $('#detailCategory').textContent = `${course.category} · ${course.subtitle}`;
  $('#detailLessons').textContent = course.count;
  const grid = $('#contentGrid');
  const crumbs = $('#breadcrumbs');
  const search = $('#contentSearch');
  const sort = $('#contentSort');
  const cache = {};
  let path = [{ id: '0', title: 'Library' }];

  const renderCrumbs = () => crumbs.innerHTML = path.map((item, i) => `${i ? '<span>/</span>' : ''}<button type="button" data-crumb="${i}" ${i === path.length - 1 ? 'aria-current="page"' : ''}>${esc(item.title)}</button>`).join('');
  const renderItems = items => {
    let filtered = [...(items || [])];
    const q = (search?.value || '').toLowerCase();
    if (q) filtered = filtered.filter(item => String(item.title || '').toLowerCase().includes(q));
    if (sort?.value === 'name') filtered.sort((a,b) => String(a.title).localeCompare(String(b.title)));
    if (sort?.value === 'type') filtered.sort((a,b) => String(a.type).localeCompare(String(b.type)));
    grid.innerHTML = filtered.length ? filtered.map(item => contentCard(item, course.id)).join('') : `<div class="empty-state"><div class="empty-mark">${icon('folder')}</div><h3>This shelf is clear</h3><p>No content matches the current view.</p></div>`;
    $$('.content-card', grid).forEach(card => card.addEventListener('click', async () => {
      const item = items.find(entry => String(entry.entity_id) === card.dataset.contentId);
      if (card.dataset.contentType === 'folder') { path.push({ id: card.dataset.contentId, title: card.dataset.title }); await loadFolder(card.dataset.contentId); } else await resolveAndPlay(item, course.id);
    }));
  };
  const fallbackItems = [{ type:'folder', entity_id:'notes', title:'Study notes', data:{ content_counts:{pdf:{free:12}} } }, { type:'folder', entity_id:'recordings', title:'Class recordings', data:{ content_counts:{video:{free:34}} } }, { type:'folder', entity_id:'practice', title:'Practice sets', data:{ content_counts:{pdf:{free:18}} } }];
  const loadFolder = async folderId => {
    renderCrumbs(); showSkeletons(grid, 6);
    if (cache[folderId]) { renderItems(cache[folderId]); return; }
    try {
      const result = await api('/nt/all-content', { method:'POST', body: JSON.stringify({ course_id: course.id, folder_id: folderId }) });
      cache[folderId] = Array.isArray(result.data) ? result.data : [];
      renderItems(cache[folderId]);
    } catch (error) {
      if (folderId === '0') { cache[folderId] = fallbackItems; renderItems(fallbackItems); toast('Showing the offline library preview.'); }
      else showError(grid, 'Check your connection and try the shelf again.', () => loadFolder(folderId));
    }
  };
  crumbs.addEventListener('click', event => { const button = event.target.closest('[data-crumb]'); if (!button) return; const index = Number(button.dataset.crumb); path = path.slice(0, index + 1); loadFolder(path.at(-1).id); });
  [search, sort].forEach(el => el?.addEventListener(el === search ? 'input' : 'change', () => renderItems(cache[path.at(-1).id] || [])));
  $$('.tab').forEach(tab => tab.addEventListener('click', () => { $$('.tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); $$('.tab-panel').forEach(panel => panel.hidden = panel.id !== `panel-${tab.dataset.tab}`); }));
  $('#loadLibrary')?.addEventListener('click', () => loadFolder('0'));
  loadFolder('0');
}

function initPlayer() {
  const title = params.get('title') || 'Lesson player';
  const url = params.get('url');
  $$('.player-title').forEach(element => element.textContent = title);
  const video = $('#video');
  if (!url) { $('#videoMessage').hidden = false; return; }
  const playbackError = () => { $('#videoMessage').hidden = false; $('#videoMessageText').textContent = 'This lesson may be offline or unavailable right now. Try again later.'; };
  video.addEventListener('loadedmetadata', () => $('#videoMessage').hidden = true);
  video.addEventListener('error', playbackError);
  const saved = Number(localStorage.getItem(`codex_progress_${url}`) || 0);
  video.addEventListener('loadedmetadata', () => { if (saved > 0 && saved < video.duration - 10) video.currentTime = saved; });
  video.addEventListener('timeupdate', () => localStorage.setItem(`codex_progress_${url}`, String(Math.floor(video.currentTime))));
  const startPlayback = async () => {
    const adaptive = /\.(m3u8|mpd)(\?|$)/i.test(url);
    if (adaptive && window.shaka) {
      window.shaka.polyfill.installAll();
      if (window.shaka.Player.isBrowserSupported()) {
        const player = new window.shaka.Player(video);
        player.addEventListener('error', playbackError);
        try { await player.load(url); return; } catch { playbackError(); return; }
      }
    }
    video.src = url;
  };
  startPlayback();
  $('#backFromPlayer')?.addEventListener('click', () => history.length > 1 ? history.back() : location.href = `batch.html?id=${params.get('course') || 183}`);
}

function toast(message) {
  const el = $('#toast') || (() => { const node = document.createElement('div'); node.id = 'toast'; node.className = 'toast'; document.body.appendChild(node); return node; })();
  el.textContent = message; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2800);
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'home') initHome();
  if (page === 'courses') initCourses();
  if (page === 'batch') initBatch();
  if (page === 'player') initPlayer();
});
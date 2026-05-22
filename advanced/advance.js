
const crumbs = {
  buttons:'Buttons', cards:'Cards', inputs:'Inputs',
  toasts:'Toasts', docs:'Documentation', realtime:'Live Panel'
};

function switchTab(el, id) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('panel-' + id).classList.add('active');
  document.getElementById('topbar-crumb').textContent = crumbs[id] || id;
  if (id === 'realtime' && !wsStarted) startWS();
  // close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
}

/* ─── Search highlight (basic) ─── */
function handleSearch(val) {
  if (!val) return;
  fireToast('info', 'Search', `Searching for "${val}"…`);
}

/* ─── Button loading demo ─── */
function triggerLoad() {
  const btn = document.getElementById('load-demo');
  btn.classList.add('btn-loading');
  setTimeout(() => {
    btn.classList.remove('btn-loading');
    fireToast('success', 'Done!', 'Action completed successfully.');
  }, 2200);
}

/* ─── Radio helper ─── */
function selectRadio(el) {
  document.querySelectorAll('.radio-item').forEach(r => r.classList.remove('selected'));
  el.classList.add('selected');
}

/* ─────────────────────────────────────────
   TOAST SYSTEM
───────────────────────────────────────── */
const TOAST_ICONS = {
  success: 'ti-circle-check',
  danger:  'ti-circle-x',
  warning: 'ti-alert-triangle',
  info:    'ti-info-circle'
};

let toastCount = 0;

function fireToast(type, title, msg, dur = 4000) {
  const host = document.getElementById('toast-host');
  const el   = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `
    <i class="ti ${TOAST_ICONS[type]} toast-icon"></i>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${msg}</div>
    </div>
    <button class="toast-close" onclick="dismissToast(this.parentElement)" aria-label="Dismiss">✕</button>
    <div class="toast-bar" style="animation-duration:${dur}ms"></div>`;
  host.appendChild(el);
  toastCount++;
  updateToastBadge(toastCount);
  setTimeout(() => dismissToast(el), dur);
}

function dismissToast(el) {
  if (!el || el.classList.contains('hiding')) return;
  el.classList.add('hiding');
  setTimeout(() => el.remove(), 220);
}

function fireCustomToast() {
  const title = document.getElementById('ct-title').value || 'Toast';
  const msg   = document.getElementById('ct-msg').value   || '';
  const type  = document.getElementById('ct-type').value;
  const dur   = parseInt(document.getElementById('ct-dur').value) || 4000;
  fireToast(type, title, msg, dur);
}

function updateToastBadge(n) {
  const el = document.getElementById('sidebar-notif-count');
  el.textContent = n;
  el.style.display = n > 0 ? 'inline' : 'none';
}

/* ─────────────────────────────────────────
   WEBSOCKET SIMULATION
───────────────────────────────────────── */
let wsStarted      = false;
let wsConnected    = false;
let wsToggleActive = true;
let wsEventTimer, wsMetricsTimer, wsCountTimer;
let totalMsgs = 0;
let notifCount = 0;
let prevUsers  = null, prevEps = null, prevLat = null;
let uptimeStart;
let countdownVal = 5;

const EVENT_POOL = [
  { cat:'info',    titles:['New signup','User login','Session started','API key created'],
    msgs:['Chrome · US','Safari · DE','Firefox · JP','Edge · UK'] },
  { cat:'success', titles:['Payment received','Build passed','Deploy done','Backup complete'],
    msgs:['$42.00 captured','All 312 tests passed','v2.5.1 to prod','3.2GB to S3'] },
  { cat:'warning', titles:['High latency','CPU spike','Rate limit hit','Memory warning'],
    msgs:['P99 at 890ms','Node-3 at 87%','429 from upstream','RSS at 78%'] },
  { cat:'danger',  titles:['Auth failed','Error 500','DB timeout','Worker crashed'],
    msgs:['Invalid JWT on /me','Unhandled exception','Replica lag 4.2s','OOM killed'] }
];

function startWS() {
  wsStarted = true;
  uptimeStart = Date.now();
  setWsDot('connecting');
  document.getElementById('ws-name').textContent = 'Connecting…';

  setTimeout(() => {
    wsConnected = true;
    setWsDot('connected');
    document.getElementById('ws-name').textContent = 'Connected';
    fireToast('success', 'WebSocket connected', 'Real-time stream is live.');
    wsEventTimer   = setInterval(emitEvent, 2800);
    wsMetricsTimer = setInterval(refreshMetrics, 5000);
    wsCountTimer   = setInterval(tickCountdown, 1000);
    refreshMetrics();
    emitEvent();
  }, 900);
}

function setWsDot(state) {
  const dot = document.getElementById('ws-dot');
  dot.className = 'ws-dot ' + state;
}

let wsIsConnected = true;
function wsToggle() {
  wsIsConnected = !wsIsConnected;
  const btn   = document.getElementById('ws-toggle-btn');
  const label = document.getElementById('ws-toggle-label');
  const icon  = document.getElementById('ws-toggle-icon');

  if (wsIsConnected) {
    setWsDot('connecting');
    document.getElementById('ws-name').textContent = 'Reconnecting…';
    label.textContent = 'Disconnect';
    icon.className = 'ti ti-power';
    setTimeout(() => {
      setWsDot('connected');
      document.getElementById('ws-name').textContent = 'Connected';
      wsEventTimer   = setInterval(emitEvent, 2800);
      wsMetricsTimer = setInterval(refreshMetrics, 5000);
      wsCountTimer   = setInterval(tickCountdown, 1000);
      refreshMetrics();
      fireToast('success','Reconnected','WebSocket stream restored.');
    }, 800);
  } else {
    clearInterval(wsEventTimer);
    clearInterval(wsMetricsTimer);
    clearInterval(wsCountTimer);
    setWsDot('disconnected');
    document.getElementById('ws-name').textContent = 'Disconnected';
    label.textContent = 'Reconnect';
    icon.className = 'ti ti-plug';
    fireToast('warning','Disconnected','WebSocket stream paused.');
  }
}

function tickCountdown() {
  countdownVal--;
  if (countdownVal <= 0) countdownVal = 5;
  const el = document.getElementById('refresh-countdown');
  if (el) el.textContent = countdownVal + 's';
}

function clearNotifs() {
  notifCount = 0;
  document.getElementById('notif-count').textContent = '0';
  document.getElementById('notif-list').innerHTML =
    '<div class="notif-empty"><i class="ti ti-hourglass" style="font-size:22px;display:block;margin:0 auto 8px"></i>Waiting for events…</div>';
}

function clearLog() {
  document.getElementById('activity-log').innerHTML = '';
}

function emitEvent() {
  const cat  = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
  const title = cat.titles[Math.floor(Math.random() * cat.titles.length)];
  const msg   = cat.msgs[Math.floor(Math.random() * cat.msgs.length)];
  const now   = new Date();
  const ts    = now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit' });

  totalMsgs++;
  const mc = document.getElementById('ws-msg-count');
  if (mc) mc.textContent = totalMsgs + ' messages';

  // Dot color mapping
  const dotColors = { info:'var(--accent)', success:'var(--green)', warning:'var(--yellow)', danger:'var(--red)' };
  const dotColor = dotColors[cat.cat];

  // Notification panel
  notifCount++;
  document.getElementById('notif-count').textContent = notifCount;
  const list = document.getElementById('notif-list');
  if (list.querySelector('.notif-empty')) list.innerHTML = '';

  const ni = document.createElement('div');
  ni.className = 'notif-item unread';
  ni.innerHTML = `
    <div class="notif-item-dot" style="background:${dotColor}"></div>
    <div class="notif-item-body">
      <div class="notif-item-title">${title}</div>
      <div class="notif-item-sub">${ts} · ${msg}</div>
    </div>`;
  list.insertBefore(ni, list.firstChild);
  setTimeout(() => ni.classList.remove('unread'), 2500);
  if (list.children.length > 25) list.removeChild(list.lastChild);

  // Activity log
  const logColors = {
    info:    { bg:'var(--accent-bg)',  color:'var(--accent)' },
    success: { bg:'var(--green-bg)',   color:'var(--green)' },
    warning: { bg:'var(--yellow-bg)',  color:'var(--yellow)' },
    danger:  { bg:'var(--red-bg)',     color:'var(--red)' }
  };
  const lc = logColors[cat.cat];
  const log = document.getElementById('activity-log');
  const li  = document.createElement('div');
  li.className = 'log-item';
  li.innerHTML = `
    <span class="log-time">${ts}</span>
    <span class="log-type" style="background:${lc.bg};color:${lc.color}">${cat.cat}</span>
    <span class="log-msg">${title} — ${msg}</span>`;
  log.insertBefore(li, log.firstChild);
  if (log.children.length > 40) log.removeChild(log.lastChild);
}

/* ─── Metrics refresh (no page reload) ─── */
function refreshMetrics() {
  const users = 100 + Math.floor(Math.random() * 120);
  const eps   = +(3 + Math.random() * 10).toFixed(1);
  const lat   = 12 + Math.floor(Math.random() * 70);
  const upSec = Math.floor((Date.now() - uptimeStart) / 1000);
  const upStr = upSec < 60 ? upSec + 's' : Math.floor(upSec/60) + 'm ' + (upSec%60) + 's';

  animateCount('m-users', prevUsers || 0, users, 0);
  animateCount('m-eps',   prevEps   || 0, eps, 1);
  animateCount('m-lat',   prevLat   || 0, lat, 0);
  document.getElementById('m-uptime').textContent = upStr;
  document.getElementById('m-uptime-d').textContent = '↑ running';

  if (prevUsers !== null) {
    setDelta('m-users-d', users - prevUsers, users - prevUsers >= 0, 'users');
    setDelta('m-eps-d',   eps - prevEps,     eps - prevEps >= 0,     'eps');
    setDelta('m-lat-d',   lat - prevLat,     lat - prevLat <= 0,     'ms', true);
  }

  prevUsers = users; prevEps = eps; prevLat = lat;

  // Restart refresh bar
  const rf = document.getElementById('rf-fill');
  if (rf) { rf.style.animation='none'; void rf.offsetHeight; rf.style.animation=''; }
  countdownVal = 5;
}

function setDelta(id, diff, isGood, unit, invertLabel) {
  const el = document.getElementById(id);
  if (!el) return;
  const sign  = diff >= 0 ? '+' : '';
  const icon  = isGood ? '↑' : '↓';
  el.textContent = icon + ' ' + sign + (Number.isInteger(diff) ? diff : diff.toFixed(1)) + ' ' + unit;
  el.className   = 'metric-delta ' + (isGood ? 'up' : 'down');
}

function animateCount(id, from, to, decimals) {
  const el    = document.getElementById(id);
  if (!el) return;
  const steps = 20;
  let   i     = 0;
  clearInterval(el._anim);
  el._anim = setInterval(() => {
    i++;
    const v = from + (to - from) * (i / steps);
    el.textContent = decimals ? v.toFixed(decimals) : Math.round(v);
    if (i >= steps) clearInterval(el._anim);
  }, 25);
}

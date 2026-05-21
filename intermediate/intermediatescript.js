// ═══════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════
let isDark = true;

function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('themeIcon').className = isDark ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
  const thumb = document.getElementById('themeSwitchThumb');
  if (thumb) thumb.style.left = isDark ? '2px' : '22px';
  updateChartTheme();
  localStorage.setItem('adminx-theme', isDark ? 'dark' : 'light');
}

function setAccent(color) {
  document.documentElement.style.setProperty('--accent', color);
  const glow = color + '40';
  document.documentElement.style.setProperty('--accent-glow', glow);
  localStorage.setItem('adminx-accent', color);
}

// ═══════════════════════════════════════════════════
// SIDEBAR NAV
// ═══════════════════════════════════════════════════
const pageTitles = {
  dashboard: 'Dashboard', analytics: 'Analytics',
  users: 'Users', form: 'New Entry',
  settings: 'Settings', notifications: 'Notifications'
};

function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('pageTitle').textContent = pageTitles[id] || id;
  closeSidebar();
  if (id === 'analytics') initAnalyticsCharts();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
}

// ═══════════════════════════════════════════════════
// TABLE DATA
// ═══════════════════════════════════════════════════
const statuses = ['Completed','Pending','Failed','Processing'];
const statusClass = { Completed:'badge-success', Pending:'badge-warning', Failed:'badge-danger', Processing:'badge-info' };
const products = ['Pro Plan','Starter Kit','Analytics Suite','API Access','Support Pack','Cloud Storage'];
const names = ['Ali Khan','Sara Ahmed','Umar Sheikh','Ayesha Malik','Bilal Raza','Hina Javed','Kamran Siddiq','Nida Hamid','Faisal Mirza','Amna Butt'];

const allRows = Array.from({length: 50}, (_, i) => ({
  id: 1001 + i,
  name: names[i % names.length],
  product: products[i % products.length],
  amount: '$' + (Math.random() * 500 + 50).toFixed(2),
  date: new Date(2024, Math.floor(Math.random()*12), Math.floor(Math.random()*28)+1).toLocaleDateString('en-GB'),
  status: statuses[Math.floor(Math.random() * statuses.length)]
}));

let currentPage = 1;
const rowsPerPage = 8;

function renderTable() {
  const start = (currentPage - 1) * rowsPerPage;
  const rows = allRows.slice(start, start + rowsPerPage);
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td><span style="font-family:'DM Mono',monospace;color:var(--text-muted);font-size:12px">#${r.id}</span></td>
      <td><strong>${r.name}</strong></td>
      <td>${r.product}</td>
      <td style="font-family:'DM Mono',monospace;font-weight:600">${r.amount}</td>
      <td style="color:var(--text-muted)">${r.date}</td>
      <td><span class="badge-pill ${statusClass[r.status]}">${r.status}</span></td>
      <td>
        <button style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:13px;padding:4px 8px;border-radius:6px;font-family:inherit" onclick="alert('View #${r.id}')"><i class="bi bi-eye"></i></button>
        <button style="background:none;border:none;color:var(--accent3);cursor:pointer;font-size:13px;padding:4px 8px;border-radius:6px;font-family:inherit" onclick="alert('Delete #${r.id}')"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `).join('');

  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  document.getElementById('tableInfo').textContent = `Showing ${start+1}–${Math.min(start+rowsPerPage, allRows.length)} of ${allRows.length} entries`;

  const pageBtns = document.getElementById('pageBtns');
  pageBtns.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn'; prevBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderTable(); } };
  pageBtns.appendChild(prevBtn);

  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (p === currentPage ? ' active' : '');
      btn.textContent = p;
      btn.onclick = (pp => () => { currentPage = pp; renderTable(); })(p);
      pageBtns.appendChild(btn);
    } else if (Math.abs(p - currentPage) === 2) {
      const dots = document.createElement('button');
      dots.className = 'page-btn'; dots.textContent = '…'; dots.disabled = true;
      pageBtns.appendChild(dots);
    }
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn'; nextBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderTable(); } };
  pageBtns.appendChild(nextBtn);
}

// Users table
const roles = ['Admin','Editor','Viewer','Manager'];
const usersData = Array.from({length: 12}, (_, i) => ({
  id: i+1, name: names[i % names.length],
  email: names[i % names.length].toLowerCase().replace(' ','.') + '@example.com',
  role: roles[i % roles.length],
  joined: new Date(2023, i, 10).toLocaleDateString('en-GB'),
  status: i % 5 === 0 ? 'Inactive' : 'Active'
}));

function renderUsersTable() {
  document.getElementById('usersTableBody').innerHTML = usersData.map(u => `
    <tr>
      <td style="font-family:'DM Mono',monospace;color:var(--text-muted);font-size:12px">${u.id}</td>
      <td><strong>${u.name}</strong></td>
      <td style="color:var(--text-muted)">${u.email}</td>
      <td><span class="badge-pill badge-info">${u.role}</span></td>
      <td style="color:var(--text-muted)">${u.joined}</td>
      <td><span class="badge-pill ${u.status==='Active'?'badge-success':'badge-danger'}">${u.status}</span></td>
    </tr>
  `).join('');
}

// ═══════════════════════════════════════════════════
// CHARTS
// ═══════════════════════════════════════════════════
let charts = {};

function getChartDefaults() {
  return {
    color: isDark ? '#8b90a7' : '#5a5f7a',
    grid: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)',
  };
}

function initCharts() {
  const d = getChartDefaults();
  const months = ['Jan','Feb','Mar','Apr','May','Jun'];
  Chart.defaults.font.family = "'Space Grotesk', sans-serif";

  // Line chart
  const lineCtx = document.getElementById('lineChart').getContext('2d');
  const gradient = lineCtx.createLinearGradient(0,0,0,200);
  gradient.addColorStop(0,'rgba(108,99,255,0.3)'); gradient.addColorStop(1,'rgba(108,99,255,0)');
  charts.line = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'Revenue ($K)', data: [42,58,51,73,68,84],
        borderColor: '#6c63ff', backgroundColor: gradient,
        tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#6c63ff',
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: d.grid }, ticks: { color: d.color } },
        y: { grid: { color: d.grid }, ticks: { color: d.color } }
      }
    }
  });

  // Doughnut chart
  charts.doughnut = new Chart(document.getElementById('doughnutChart'), {
    type: 'doughnut',
    data: {
      labels: ['Organic','Direct','Social','Referral'],
      datasets: [{ data: [38,27,21,14],
        backgroundColor: ['#6c63ff','#00d4aa','#ffb347','#ff6b6b'],
        borderWidth: 0 }]
    },
    options: {
      responsive: true, cutout: '68%',
      plugins: { legend: { position:'bottom', labels:{ color: d.color, padding:12, font:{size:12} } } }
    }
  });

  // Bar chart
  charts.bar = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'Orders', data: [210,284,198,312,276,297],
        backgroundColor: 'rgba(0,212,170,0.7)', borderRadius: 6, borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: d.color } },
        y: { grid: { color: d.grid }, ticks: { color: d.color } }
      }
    }
  });

  // Area chart
  const areaCtx = document.getElementById('areaChart').getContext('2d');
  const areaGrad = areaCtx.createLinearGradient(0,0,0,200);
  areaGrad.addColorStop(0,'rgba(255,179,71,0.4)'); areaGrad.addColorStop(1,'rgba(255,179,71,0)');
  charts.area = new Chart(areaCtx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{ label: 'Users', data: [2100,2540,2780,3100,3450,3842],
        borderColor: '#ffb347', backgroundColor: areaGrad, tension: 0.4, fill: true, pointRadius: 3 }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: d.grid }, ticks: { color: d.color } },
        y: { grid: { color: d.grid }, ticks: { color: d.color } }
      }
    }
  });
}

let analyticsInited = false;
function initAnalyticsCharts() {
  if (analyticsInited) return;
  analyticsInited = true;
  const d = getChartDefaults();
  const all12 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  charts.year = new Chart(document.getElementById('yearChart'), {
    type: 'bar',
    data: {
      labels: all12,
      datasets: [{
        label: 'Revenue ($K)', data: [38,44,51,60,55,68,72,80,75,88,82,94],
        backgroundColor: all12.map((_,i) => i < 6 ? 'rgba(108,99,255,0.6)' : 'rgba(108,99,255,0.85)'),
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: d.color } },
        y: { grid: { color: d.grid }, ticks: { color: d.color } }
      }
    }
  });

  charts.pie = new Chart(document.getElementById('pieChart'), {
    type: 'pie',
    data: {
      labels: ['Desktop','Mobile','Tablet'],
      datasets: [{ data: [52,38,10], backgroundColor: ['#6c63ff','#00d4aa','#ffb347'], borderWidth:0 }]
    },
    options: { responsive: true, plugins: { legend: { position:'bottom', labels:{ color:d.color } } } }
  });

  charts.radar = new Chart(document.getElementById('radarChart'), {
    type: 'radar',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [{
        label: 'Sessions', data: [820,940,780,1020,880,640,560],
        borderColor: '#00d4aa', backgroundColor: 'rgba(0,212,170,0.15)', pointBackgroundColor: '#00d4aa'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display:false } },
      scales: { r: { grid: { color: d.grid }, pointLabels: { color: d.color }, ticks: { display:false } } }
    }
  });
}

function updateChartTheme() {
  const d = getChartDefaults();
  Object.values(charts).forEach(c => {
    if (!c) return;
    if (c.options.scales) {
      ['x','y','r'].forEach(axis => {
        if (c.options.scales[axis]) {
          if (c.options.scales[axis].ticks) c.options.scales[axis].ticks.color = d.color;
          if (c.options.scales[axis].grid) c.options.scales[axis].grid.color = d.grid;
          if (c.options.scales[axis].pointLabels) c.options.scales[axis].pointLabels.color = d.color;
        }
      });
    }
    if (c.config.type === 'doughnut' || c.config.type === 'pie') {
      c.options.plugins.legend.labels.color = d.color;
    }
    c.update();
  });
}

// ═══════════════════════════════════════════════════
// MULTI-STEP FORM
// ═══════════════════════════════════════════════════
let currentStep = 0;
const totalSteps = 4;

const SAVE_KEY = 'adminx-form-progress';

function saveProgress() {
  const data = {
    fname: v('f-fname'), lname: v('f-lname'), phone: v('f-phone'),
    dob: v('f-dob'), address: v('f-address'),
    email: v('f-email'), username: v('f-username'), role: v('f-role'),
    dept: v('f-dept'), startdate: v('f-startdate'), skills: v('f-skills'),
    bio: v('f-bio'), newsletter: document.getElementById('f-newsletter').checked,
    step: currentStep
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  const si = document.getElementById('saveIndicator');
  si.classList.add('visible');
  setTimeout(() => si.classList.remove('visible'), 2000);
}

function loadProgress() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) return;
  const d = JSON.parse(saved);
  const map = ['fname','lname','phone','dob','address','email','username','role','dept','startdate','skills','bio'];
  map.forEach(k => { const el = document.getElementById('f-'+k); if (el && d[k] !== undefined) el.value = d[k]; });
  const nl = document.getElementById('f-newsletter');
  if (nl) nl.checked = !!d.newsletter;
  if (d.step > 0) {
    currentStep = 0;
    for (let i = 0; i < d.step; i++) {
      document.getElementById('fstep-'+i).classList.remove('active');
      markStepDone(i);
    }
    currentStep = d.step;
    document.getElementById('fstep-'+currentStep).classList.add('active');
    document.getElementById('sn-'+currentStep).classList.add('active');
    updateFormUI();
  }
}

function v(id) { return document.getElementById(id)?.value || ''; }

function validateStep(step) {
  let ok = true;
  const rules = [
    [['f-fname','First name is required'],['f-lname','Last name is required'],['f-phone','Phone is required']],
    [['f-email','Email is required'],['f-username','Username (min 4 chars) required'],['f-password','Password (min 8 chars) required'],['f-confirm','Passwords must match']],
    [['f-dept','Please select a department']],
    []
  ];
  rules[step].forEach(([id, msg]) => {
    const el = document.getElementById(id);
    const errEl = document.getElementById('e-'+id.slice(2));
    let val = el ? el.value.trim() : '';
    let err = '';
    if (!val) { err = msg; }
    else if (id === 'f-email' && !/^\S+@\S+\.\S+$/.test(val)) err = 'Enter a valid email';
    else if (id === 'f-username' && val.length < 4) err = msg;
    else if (id === 'f-password' && val.length < 8) err = msg;
    else if (id === 'f-confirm' && val !== v('f-password')) err = msg;
    if (errEl) errEl.textContent = err;
    if (el) el.classList.toggle('error', !!err);
    if (err) ok = false;
  });
  return ok;
}

function markStepDone(step) {
  const sn = document.getElementById('sn-'+step);
  sn.classList.remove('active'); sn.classList.add('done');
  sn.innerHTML = '<i class="bi bi-check-lg" style="font-size:14px"></i>';
  const lbl = document.getElementById('lbl-'+step);
  if (lbl) { lbl.classList.remove('active'); lbl.classList.add('done'); }
  const sc = document.getElementById('sc-'+step);
  if (sc) sc.classList.add('done');
}

function updateFormUI() {
  document.getElementById('formProgress').style.width = ((currentStep+1)/totalSteps*100) + '%';
  document.getElementById('btnBack').style.display = currentStep > 0 ? 'flex' : 'none';
  const nextBtn = document.getElementById('btnNext');
  if (currentStep === totalSteps - 1) {
    nextBtn.innerHTML = '<i class="bi bi-send-fill"></i> Submit';
    nextBtn.className = 'btn-x btn-success-x';
  } else {
    nextBtn.innerHTML = 'Next <i class="bi bi-arrow-right"></i>';
    nextBtn.className = 'btn-x btn-primary-x';
  }
  for (let i = 0; i < totalSteps; i++) {
    const lbl = document.getElementById('lbl-'+i);
    const sn = document.getElementById('sn-'+i);
    if (lbl && !lbl.classList.contains('done')) {
      lbl.classList.toggle('active', i === currentStep);
    }
    if (sn && !sn.classList.contains('done')) {
      sn.classList.toggle('active', i === currentStep);
    }
  }
}

function buildReview() {
  const fields = [
    ['Full Name', v('f-fname') + ' ' + v('f-lname')],
    ['Phone', v('f-phone')],
    ['Date of Birth', v('f-dob') || '—'],
    ['Address', v('f-address') || '—'],
    ['Email', v('f-email')],
    ['Username', v('f-username')],
    ['Role', v('f-role') || '—'],
    ['Department', v('f-dept') || '—'],
    ['Start Date', v('f-startdate') || '—'],
    ['Skills', v('f-skills') || '—'],
    ['Newsletter', document.getElementById('f-newsletter').checked ? 'Yes' : 'No'],
  ];
  document.getElementById('reviewContent').innerHTML = `
    <div style="margin-bottom:16px;font-size:15px;font-weight:600">Please review your information:</div>
    ${fields.map(([k,val]) => `<div class="review-row"><span class="review-key">${k}</span><span class="review-val">${val}</span></div>`).join('')}
  `;
}

function formStep(dir) {
  if (dir === 1) {
    if (!validateStep(currentStep)) return;
    if (currentStep === totalSteps - 1) {
      // Submit
      localStorage.removeItem(SAVE_KEY);
      document.getElementById('reviewContent').style.display = 'none';
      document.getElementById('submitSuccess').style.display = 'block';
      document.getElementById('formFooter').style.display = 'none';
      return;
    }
    document.getElementById('fstep-'+currentStep).classList.remove('active');
    markStepDone(currentStep);
    currentStep++;
    document.getElementById('fstep-'+currentStep).classList.add('active');
    if (currentStep === totalSteps - 1) buildReview();
  } else {
    document.getElementById('fstep-'+currentStep).classList.remove('active');
    const sn = document.getElementById('sn-'+currentStep);
    sn.classList.remove('active','done'); sn.textContent = currentStep+1;
    const lbl = document.getElementById('lbl-'+currentStep);
    if (lbl) { lbl.classList.remove('active','done'); }
    const sc = document.getElementById('sc-'+(currentStep-1));
    if (sc) sc.classList.remove('done');
    const prevSn = document.getElementById('sn-'+(currentStep-1));
    prevSn.classList.remove('done'); prevSn.textContent = currentStep;
    prevSn.classList.add('active');
    const prevLbl = document.getElementById('lbl-'+(currentStep-1));
    if (prevLbl) { prevLbl.classList.remove('done'); prevLbl.classList.add('active'); }
    currentStep--;
    document.getElementById('fstep-'+currentStep).classList.add('active');
  }
  updateFormUI();
  saveProgress();
}

function resetForm() {
  currentStep = 0;
  ['fname','lname','phone','dob','address','email','username','role','dept','startdate','skills','bio'].forEach(k => {
    const el = document.getElementById('f-'+k); if (el) el.value = '';
  });
  document.getElementById('f-newsletter').checked = false;
  document.querySelectorAll('.form-step').forEach((s,i) => {
    s.classList.toggle('active', i === 0);
  });
  for (let i = 0; i < totalSteps; i++) {
    const sn = document.getElementById('sn-'+i);
    sn.className = 'step-node' + (i===0?' active':'');
    sn.textContent = i+1;
    const lbl = document.getElementById('lbl-'+i);
    if (lbl) { lbl.className = 'step-label-item' + (i===0?' active':''); }
    const sc = document.getElementById('sc-'+i);
    if (sc) sc.classList.remove('done');
  }
  document.getElementById('reviewContent').style.display = '';
  document.getElementById('submitSuccess').style.display = 'none';
  document.getElementById('formFooter').style.display = '';
  updateFormUI();
  localStorage.removeItem(SAVE_KEY);
}

// Auto-save on input
document.querySelectorAll('.form-control-x').forEach(el => {
  el.addEventListener('input', () => { if (currentStep < 3) saveProgress(); });
});

// ═══════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  // Load saved theme
  const savedTheme = localStorage.getItem('adminx-theme');
  if (savedTheme === 'light') toggleTheme();
  const savedAccent = localStorage.getItem('adminx-accent');
  if (savedAccent) setAccent(savedAccent);

  renderTable();
  renderUsersTable();
  initCharts();
  loadProgress();
  updateFormUI();
});

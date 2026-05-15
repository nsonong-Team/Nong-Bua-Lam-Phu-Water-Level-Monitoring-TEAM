/* ===================================================
   water-level-chart.js
   กราฟระดับน้ำ — หนองบัวลำภู
   =================================================== */

/* ─── Station data (from scripts/data.js) ─────────── */
const STATIONS = [
  { id:1,  nm:"วังปลาป้อม",        ap:"นาวัง",       el:290, rd:290,   yl:289.5, gm:289,   rv:"p" },
  { id:2,  nm:"โคกกระทอ",          ap:"นาวัง",       el:266, rd:266,   yl:265.5, gm:265,   rv:"p" },
  { id:3,  nm:"วังสามหาบ",         ap:"นาวัง",       el:258, rd:258,   yl:257.5, gm:257,   rv:"p" },
  { id:4,  nm:"บ้านหนองด่าน",      ap:"นากลาง",      el:249, rd:249,   yl:248.5, gm:248,   rv:"p" },
  { id:5,  nm:"บ้านฝั่งแดง",       ap:"นากลาง",      el:237, rd:237,   yl:236.5, gm:236,   rv:"p" },
  { id:6,  nm:"ปตร.หนองหว้าใหญ่",  ap:"เมืองฯ",      el:216, rd:216,   yl:215.5, gm:215,   rv:"p" },
  { id:7,  nm:"วังหมื่น",          ap:"เมืองฯ",      el:210, rd:210,   yl:209.5, gm:209,   rv:"p" },
  { id:8,  nm:"ปตร.ปู่หลอด",       ap:"เมืองฯ",      el:203, rd:203,   yl:202.5, gm:202.5, rv:"p" },
  { id:9,  nm:"บ้านข้องโป้",       ap:"เมืองฯ",      el:201, rd:201,   yl:200.5, gm:200,   rv:"p" },
  { id:10, nm:"ปตร.หัวนา",         ap:"เมืองฯ",      el:191, rd:191,   yl:190.5, gm:190,   rv:"p" },
  { id:11, nm:"คลองบุญทัน",        ap:"สุวรรณคูหา",  el:231, rd:231,   yl:230.5, gm:230,   rv:"m" },
  { id:12, nm:"บ้านโคก",           ap:"สุวรรณคูหา",  el:218, rd:218,   yl:217.5, gm:217,   rv:"m" },
  { id:13, nm:"บ้านนาตาแหลว",      ap:"สุวรรณคูหา",  el:202, rd:202,   yl:201.5, gm:201,   rv:"m" },
  { id:14, nm:"บ้านกุดฝั่ง",       ap:"สุวรรณคูหา",  el:192, rd:192,   yl:191.5, gm:191,   rv:"m" },
  { id:15, nm:"อ่างเก็บน้ำมอ",     ap:"ศรีบุญเรือง", el:242, rd:242,   yl:241.5, gm:241,   rv:"mo" },
  { id:16, nm:"บ้านวังคูณ",        ap:"ศรีบุญเรือง", el:211, rd:211,   yl:210.5, gm:210,   rv:"mo" },
  { id:17, nm:"บ้านโนนสูงเปลือย",  ap:"ศรีบุญเรือง", el:202, rd:202,   yl:201.5, gm:201,   rv:"mo" },
  { id:18, nm:"บ้านวังโปร่ง",      ap:"ศรีบุญเรือง", el:212, rd:212,   yl:211.5, gm:211,   rv:"pw" },
  { id:19, nm:"บ้านทุ่งโพธิ์",     ap:"ศรีบุญเรือง", el:197, rd:197,   yl:196.5, gm:196,   rv:"pw" },
  { id:20, nm:"บ้านโคกล่าม",       ap:"ศรีบุญเรือง", el:193, rd:193,   yl:192.5, gm:192,   rv:"pw" },
];

/* ─── Simulated current water levels ─────────────── */
let levels = {};

function initLevels() {
  STATIONS.forEach(s => {
    const r = Math.random();
    const range = s.rd - s.gm;
    if (r < 0.12) {
      levels[s.id] = +(s.rd + range * 0.15 * Math.random()).toFixed(2);
    } else if (r < 0.32) {
      levels[s.id] = +(s.yl + (s.rd - s.yl) * Math.random()).toFixed(2);
    } else {
      levels[s.id] = +(s.gm - range * 0.9 * Math.random()).toFixed(2);
    }
  });
}

/* ─── Status helper ───────────────────────────────── */
function getStatus(s, lvl) {
  if (lvl >= s.rd) return { c: "r", t: "วิกฤติ",     e: "🔴" };
  if (lvl >= s.yl) return { c: "y", t: "เฝ้าระวัง", e: "🟡" };
  return               { c: "g", t: "ปกติ",       e: "🟢" };
}

/* ─── Time series generation ──────────────────────── */
function genSeries(station, hours) {
  const STEP_MIN = 30;
  const n = (hours * 60) / STEP_MIN;
  const now = Date.now();
  const labels = [];
  const data   = [];

  const lvl   = levels[station.id];
  const range = station.rd - station.gm;
  const base  = station.gm - range * 0.45;

  /* Gaussian flood-wave: peaks at ~60-70% through the window, then recedes */
  const peakPos = 0.58 + Math.random() * 0.15;
  const peakLvl = Math.max(lvl + range * 0.3, station.yl + range * (0.4 + Math.random() * 0.7));

  for (let i = 0; i < n; i++) {
    const ts = new Date(now - (n - 1 - i) * STEP_MIN * 60_000);
    labels.push(ts);

    if (i === n - 1) {
      data.push(+lvl.toFixed(2));
    } else {
      const p     = i / (n - 1);
      const wave  = Math.exp(-Math.pow((p - peakPos) / 0.26, 2));
      const noise = (Math.random() - 0.5) * 0.03 * range;
      const v     = base + (peakLvl - base) * wave + noise;
      data.push(+Math.max(base, v).toFixed(2));
    }
  }

  return { labels, data };
}

/* ─── Chart instance ──────────────────────────────── */
let chartInst = null;

function buildChart(station, hours) {
  const { labels, data } = genSeries(station, hours);

  /* Format labels — density depends on window size */
  const tickStep = hours <= 24 ? 4 : hours <= 48 ? 8 : 48;
  const strLabels = labels.map((d, i) => {
    if (i % tickStep !== 0 && i !== labels.length - 1) return '';
    if (hours <= 48) {
      return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  });

  const minY = Math.min(station.gm - (station.rd - station.gm) * 0.9, Math.min(...data) - 0.1);
  const maxY = Math.max(station.rd + (station.rd - station.gm) * 0.35, Math.max(...data) + 0.15);

  const canvas = document.getElementById('waterChart');
  const ctx    = canvas.getContext('2d');

  if (chartInst) { chartInst.destroy(); chartInst = null; }

  chartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels: strLabels,
      datasets: [{
        label: 'ระดับน้ำ (ม.รทก.)',
        data,
        borderColor: '#2196f3',
        borderWidth: 2.5,
        tension: 0.42,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2196f3',
        pointHoverBorderWidth: 2,
        fill: 'start',
        backgroundColor(context) {
          const { chartArea, ctx: c } = context.chart;
          if (!chartArea) return 'rgba(33,150,243,0.12)';
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0,   'rgba(33,150,243,0.38)');
          g.addColorStop(0.6, 'rgba(33,150,243,0.10)');
          g.addColorStop(1,   'rgba(33,150,243,0.01)');
          return g;
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },

      plugins: {
        legend: { display: false },

        tooltip: {
          backgroundColor: 'rgba(4,21,39,0.94)',
          titleColor: '#90caf9',
          bodyColor: '#e3f2fd',
          borderColor: 'rgba(33,150,243,0.3)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            title: (items) => {
              const raw = labels[items[0].dataIndex];
              if (!raw) return '';
              return raw.toLocaleString('th-TH', {
                day: '2-digit', month: 'short',
                hour: '2-digit', minute: '2-digit'
              });
            },
            label: (item) => ` ${item.parsed.y.toFixed(2)} ม.รทก.`,
            afterLabel: (item) => {
              const st = getStatus(station, item.parsed.y);
              return ` ${st.e} ${st.t}`;
            }
          }
        },

        annotation: {
          annotations: {

            /* Background zones */
            zoneGn: {
              type: 'box',
              yMin: minY, yMax: station.yl,
              backgroundColor: 'rgba(0,230,118,0.04)',
              borderWidth: 0
            },
            zoneYl: {
              type: 'box',
              yMin: station.yl, yMax: station.rd,
              backgroundColor: 'rgba(255,214,0,0.055)',
              borderWidth: 0
            },
            zoneRd: {
              type: 'box',
              yMin: station.rd, yMax: maxY,
              backgroundColor: 'rgba(255,23,68,0.065)',
              borderWidth: 0
            },

            /* Yellow threshold line */
            lineYl: {
              type: 'line',
              yMin: station.yl, yMax: station.yl,
              borderColor: '#ffd600',
              borderWidth: 1.5,
              borderDash: [7, 5],
              label: {
                display: true,
                content: `⚠ เฝ้าระวัง  ${station.yl.toFixed(1)} ม.`,
                position: 'start',
                xAdjust: 8,
                backgroundColor: 'rgba(4,21,39,0.82)',
                color: '#ffd600',
                font: { size: 11, family: 'Kanit' },
                padding: { x: 8, y: 4 },
                borderRadius: 5,
                borderWidth: 1,
                borderColor: 'rgba(255,214,0,0.35)'
              }
            },

            /* Red threshold line */
            lineRd: {
              type: 'line',
              yMin: station.rd, yMax: station.rd,
              borderColor: '#ff1744',
              borderWidth: 1.5,
              borderDash: [7, 5],
              label: {
                display: true,
                content: `🔴 วิกฤติ  ${station.rd.toFixed(1)} ม.`,
                position: 'start',
                xAdjust: 8,
                backgroundColor: 'rgba(4,21,39,0.82)',
                color: '#ff1744',
                font: { size: 11, family: 'Kanit' },
                padding: { x: 8, y: 4 },
                borderRadius: 5,
                borderWidth: 1,
                borderColor: 'rgba(255,23,68,0.35)'
              }
            }
          }
        }
      },

      scales: {
        x: {
          grid: {
            color: 'rgba(13,74,128,0.28)',
            tickLength: 0
          },
          ticks: {
            color: '#5a8bb5',
            font: { size: 11, family: 'Kanit' },
            maxRotation: 0,
            autoSkip: false,
            /* hide empty label slots */
            callback(val, idx) { return this.getLabelForValue(idx) || null; }
          }
        },
        y: {
          min: minY,
          max: maxY,
          grid: {
            color: 'rgba(13,74,128,0.28)',
            tickLength: 0
          },
          ticks: {
            color: '#5a8bb5',
            font: { size: 11, family: 'Kanit' },
            callback: v => v.toFixed(1) + ' ม.'
          }
        }
      }
    }
  });
}

/* ─── Stat cards ──────────────────────────────────── */
function updateCards(station) {
  const lvl = levels[station.id];
  const st  = getStatus(station, lvl);

  document.getElementById('valLevel').textContent  = lvl.toFixed(2);
  document.getElementById('valStatus').textContent = `${st.e} ${st.t}`;
  document.getElementById('valYl').textContent     = station.yl.toFixed(2);
  document.getElementById('valRd').textContent     = station.rd.toFixed(2);

  const statusVal  = document.getElementById('valStatus');
  const statusCard = document.getElementById('cardStatus');
  statusVal.className  = 'sc-val ' + st.c;
  statusCard.className = `stat-card card-status glow-${st.c}`;

  /* alert banner */
  const alert = document.getElementById('statusAlert');
  if (st.c !== 'g') {
    alert.className    = `status-alert show ${st.c}`;
    alert.textContent  = `${st.e} สถานี${station.nm} — ระดับน้ำ ${lvl.toFixed(2)} ม.รทก. อยู่ใน${st.t}`;
  } else {
    alert.className = 'status-alert';
  }
}

/* ─── Chart title ─────────────────────────────────── */
function updateTitle(station) {
  document.getElementById('chartTitle').textContent =
    `กราฟระดับน้ำ — สถานี${station.nm}`;
  document.getElementById('chartSub').textContent =
    `อ.${station.ap} | ระดับตลิ่ง ${station.el.toFixed(1)} ม.รทก.`;
}

/* ─── Station grid ────────────────────────────────── */
function renderGrid(river, activeId) {
  const grid  = document.getElementById('stationsGrid');
  const list  = STATIONS.filter(s => s.rv === river);
  const range = s => s.rd - s.gm;
  const pct   = (s, lvl) => Math.min(100, Math.max(0,
    ((lvl - s.gm) / range(s)) * 100
  ));

  grid.innerHTML = list.map(s => {
    const lvl = levels[s.id] ?? s.gm;
    const st  = getStatus(s, lvl);
    const p   = pct(s, lvl);
    const barClr = st.c === 'r' ? '#ff1744' : st.c === 'y' ? '#ffd600' : '#00e676';
    const active = s.id === activeId ? ' active' : '';

    return `<div class="stn-card ${st.c}${active}" onclick="selectStation(${s.id})">
  <div class="stn-name">${s.nm}</div>
  <div class="stn-ap">อ.${s.ap}</div>
  <div><span class="stn-level">${lvl.toFixed(2)}</span><span class="stn-unit">ม.รทก.</span></div>
  <span class="stn-badge ${st.c}">${st.e} ${st.t}</span>
  <div class="stn-bar"><div class="stn-bar-fill" style="width:${p}%;background:${barClr}"></div></div>
</div>`;
  }).join('');
}

/* ─── Populate station dropdown ───────────────────── */
function fillStationSelect(river, selectId) {
  const sel  = document.getElementById('stationSelect');
  const list = STATIONS.filter(s => s.rv === river);
  sel.innerHTML = list.map(s =>
    `<option value="${s.id}"${s.id === selectId ? ' selected' : ''}>${s.nm} (อ.${s.ap})</option>`
  ).join('');
  if (!selectId) sel.value = list[0].id;
}

/* ─── Refresh chart + cards for current selection ─── */
function refresh() {
  const stationSel = document.getElementById('stationSelect');
  const timeRange  = document.getElementById('timeRange');
  const station    = STATIONS.find(s => s.id === +stationSel.value);
  if (!station) return;

  const hours = +timeRange.value;
  updateTitle(station);
  updateCards(station);
  buildChart(station, hours);
}

/* ─── Called from station grid card click ─────────── */
function selectStation(id) {
  const s = STATIONS.find(s => s.id === id);
  if (!s) return;

  /* sync river dropdown */
  document.getElementById('riverSelect').value = s.rv;
  fillStationSelect(s.rv, id);

  const hours = +document.getElementById('timeRange').value;
  updateTitle(s);
  updateCards(s);
  buildChart(s, hours);
  renderGrid(s.rv, id);
}

/* ─── Init ────────────────────────────────────────── */
function init() {
  initLevels();

  const aU = localStorage.getItem("aU");
  if (aU) {
    window._lc_chart = function(d) {
      if (d && d.levels) {
        d.levels.forEach(i => {
          if (i.stationId && i.level !== '') {
            levels[i.stationId] = parseFloat(i.level);
          }
        });
      }
      // re-render หลังได้ข้อมูล
      const stationSel = document.getElementById('stationSelect');
      const timeRange  = document.getElementById('timeRange');
      const station    = STATIONS.find(s => s.id === +stationSel.value);
      if (station) {
        updateTitle(station);
        updateCards(station);
        buildChart(station, +timeRange.value);
        renderGrid(document.getElementById('riverSelect').value, station.id);
      }
    };

    const sc = document.createElement("script");
    sc.src = aU + "?action=getLevels&callback=_lc_chart";
    sc.onload = () => sc.remove();
    document.head.appendChild(sc);
  }

  const riverSel   = document.getElementById('riverSelect');
  const stationSel = document.getElementById('stationSelect');
  const timeRange  = document.getElementById('timeRange');

  fillStationSelect('p');
  renderGrid('p', +stationSel.value);

  const first = STATIONS.find(s => s.id === +stationSel.value) || STATIONS[0];
  updateTitle(first);
  updateCards(first);
  buildChart(first, +timeRange.value);

  riverSel.addEventListener('change', () => {
    fillStationSelect(riverSel.value);
    renderGrid(riverSel.value, +stationSel.value);
    refresh();
  });

  stationSel.addEventListener('change', () => {
    renderGrid(riverSel.value, +stationSel.value);
    refresh();
  });

  timeRange.addEventListener('change', refresh);
}

document.addEventListener('DOMContentLoaded', init);

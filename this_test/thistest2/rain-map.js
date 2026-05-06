// ── MAP INIT ──────────────────────────────────────────────
const map = L.map('map', { zoomControl: true }).setView([13.7563, 100.5018], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// ── STATE ─────────────────────────────────────────────────
let points        = [];          // Array<{ lat, lng, intensity, color, _marker }>
let heatLayer     = null;
let pendingLatLng = null;
let selectedColor = '#ff4d6d';
let mode          = 'add';       // 'add' | 'pan'
let markerGroup   = L.layerGroup().addTo(map);

// ── MODE ──────────────────────────────────────────────────
function setMode(m) {
  mode = m;
  document.getElementById('modeAdd').classList.toggle('active', m === 'add');
  document.getElementById('modePan').classList.toggle('active', m === 'pan');
  map.getContainer().style.cursor = m === 'add' ? 'crosshair' : 'grab';
}

// ── MAP CLICK ─────────────────────────────────────────────
map.on('click', (e) => {
  if (mode !== 'add') return;

  pendingLatLng = e.latlng;

  // Reset modal fields
  document.getElementById('modalCoord').textContent =
    `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
  document.getElementById('intensitySlider').value = 50;
  document.getElementById('intensityVal').textContent = '50';

  // Reset color preset selection
  document.querySelector('.preset.sel')?.classList.remove('sel');
  document.querySelector('[data-color="#ff4d6d"]').classList.add('sel');
  selectedColor = '#ff4d6d';

  document.getElementById('overlay').classList.add('show');
});

// ── MODAL ─────────────────────────────────────────────────
function closeModal() {
  document.getElementById('overlay').classList.remove('show');
  pendingLatLng = null;
}

function selPreset(el) {
  document.querySelectorAll('.preset').forEach(p => p.classList.remove('sel'));
  el.classList.add('sel');
  selectedColor = el.dataset.color;
}

function confirmPoint() {
  if (!pendingLatLng) return;

  const intensity = parseInt(document.getElementById('intensitySlider').value);
  const pt = {
    lat: pendingLatLng.lat,
    lng: pendingLatLng.lng,
    intensity,
    color: selectedColor
  };

  points.push(pt);
  addMarker(pt);
  rebuildHeat();
  renderList();
  updateStats();
  closeModal();
}

// ── MARKERS ───────────────────────────────────────────────
function addMarker(pt) {
  const size = 10 + pt.intensity * 0.14;

  const icon = L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px; height:${size}px;
      border-radius: 50%;
      background: ${pt.color};
      border: 2px solid rgba(255,255,255,.5);
      box-shadow: 0 0 ${size}px ${pt.color}88;
      cursor: pointer;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });

  const m = L.marker([pt.lat, pt.lng], { icon })
    .addTo(markerGroup)
    .bindPopup(`<b>ปริมาณฝน:</b> ${pt.intensity} มม.<br><small>${pt.lat.toFixed(5)}, ${pt.lng.toFixed(5)}</small>`);

  pt._marker = m;
}

// ── HEAT LAYER ────────────────────────────────────────────
function rebuildHeat() {
  if (heatLayer) map.removeLayer(heatLayer);
  if (!points.length) return;

  const radius = parseInt(document.getElementById('radiusSlider').value);
  const blur   = parseInt(document.getElementById('blurSlider').value);
  const op     = parseInt(document.getElementById('opSlider').value) / 10;

  const data = points.map(p => [p.lat, p.lng, p.intensity / 100]);

  heatLayer = L.heatLayer(data, {
    radius,
    blur,
    maxZoom: 17,
    max: 1.0,
    minOpacity: op,
    gradient: {
      0.0: '#e0f2fe',
      0.2: '#7dd3fc',
      0.4: '#38bdf8',
      0.6: '#0284c7',
      0.8: '#1e40af',
      1.0: '#1e3a8a'
    }
  }).addTo(map);
}

function updateHeatOptions() {
  document.getElementById('rVal').textContent  = document.getElementById('radiusSlider').value;
  document.getElementById('bVal').textContent  = document.getElementById('blurSlider').value;
  document.getElementById('opVal').textContent = (document.getElementById('opSlider').value / 10).toFixed(1);
  rebuildHeat();
}

// ── POINT LIST ────────────────────────────────────────────
function renderList() {
  const list = document.getElementById('pointList');

  if (!points.length) {
    list.innerHTML = '<div class="empty-hint">คลิกบนแผนที่<br>เพื่อเพิ่มจุดความร้อน</div>';
    return;
  }

  list.innerHTML = points.map((p, i) => `
    <div class="point-item" onclick="flyTo(${i})">
      <div class="point-dot" style="background:${p.color}; box-shadow:0 0 4px ${p.color}"></div>
      <div class="point-info">
        <div style="font-weight:600">ฝน: ${p.intensity} มม.</div>
        <div class="point-coord">${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}</div>
      </div>
      <button class="point-del" onclick="event.stopPropagation(); deletePoint(${i})">×</button>
    </div>
  `).join('');
}

function flyTo(i) {
  const p = points[i];
  map.flyTo([p.lat, p.lng], 15, { duration: 0.8 });
  if (p._marker) p._marker.openPopup();
}

function deletePoint(i) {
  if (points[i]._marker) markerGroup.removeLayer(points[i]._marker);
  points.splice(i, 1);
  rebuildHeat();
  renderList();
  updateStats();
}

function clearAll() {
  if (!points.length) return;
  if (!confirm(`ล้าง ${points.length} จุดทั้งหมด?`)) return;
  markerGroup.clearLayers();
  points = [];
  rebuildHeat();
  renderList();
  updateStats();
}

// ── STATS ─────────────────────────────────────────────────
function updateStats() {
  document.getElementById('countStat').textContent = points.length;
  document.getElementById('sumStat').textContent   = points.reduce((s, p) => s + p.intensity, 0);
}

// ── EVENT LISTENERS ───────────────────────────────────────

// Close modal when clicking outside
document.getElementById('overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('overlay')) closeModal();
});

// Keyboard shortcuts: Esc = close modal | A = add mode | P = pan mode
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'a')     setMode('add');
  if (e.key === 'p')     setMode('pan');
});
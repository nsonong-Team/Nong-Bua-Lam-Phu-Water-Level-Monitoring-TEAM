// ── RAIN FEATURE ──────────────────────────────────────────
// Integrates rain-map functionality into the water monitoring system
// Uses the existing `map` variable from map.js

let rainPoints    = [];   // Array<{ lat, lng, intensity, color, _marker }>
let rainHeatLayer = null;
let rainPending   = null;
let rainColor     = '#ff4d6d';
let rainMode      = 'pan';  // start in pan so station markers still clickable
let rainMarkers   = window.L.layerGroup().addTo(map);

// ── MODE ──────────────────────────────────────────────────
function setRainMode(m) {
  rainMode = m;
  document.getElementById('rainModeAdd').classList.toggle('active', m === 'add');
  document.getElementById('rainModePan').classList.toggle('active', m === 'pan');
  map.getContainer().style.cursor = m === 'add' ? 'crosshair' : '';
}

// ── MAP CLICK (rain) ──────────────────────────────────────
map.on('click', function(e) {
  if (rainMode !== 'add') return;

  // Don't fire if clicking on a station marker popup
  rainPending = e.latlng;
  document.getElementById('rmCoord').textContent =
    e.latlng.lat.toFixed(5) + ', ' + e.latlng.lng.toFixed(5);
  document.getElementById('rmInt').value = 50;
  document.getElementById('rmIntVal').textContent = '50';

  // Reset preset selection
  document.querySelectorAll('.rm-preset').forEach(p => p.classList.remove('sel'));
  document.querySelector('.rm-preset[data-color="#ff4d6d"]').classList.add('sel');
  rainColor = '#ff4d6d';

  document.getElementById('rainOverlay').classList.add('show');
});

// ── MODAL ─────────────────────────────────────────────────
function closeRainModal() {
  document.getElementById('rainOverlay').classList.remove('show');
  rainPending = null;
}

function selRainPreset(el) {
  document.querySelectorAll('.rm-preset').forEach(p => p.classList.remove('sel'));
  el.classList.add('sel');
  rainColor = el.dataset.color;
}

function confirmRainPoint() {
  if (!rainPending) return;

  const intensity = parseInt(document.getElementById('rmInt').value);
  const pt = {
    lat: rainPending.lat,
    lng: rainPending.lng,
    intensity,
    color: rainColor
  };

  rainPoints.push(pt);
  addRainMarker(pt);
  rebuildRainHeat();
  renderRainList();
  updateRainStats();
  closeRainModal();
}

// ── MARKER ────────────────────────────────────────────────
function addRainMarker(pt) {
  const size = 10 + pt.intensity * 0.12;

  const icon = window.L.divIcon({
    className: '',
    html: '<div style="' +
      'width:' + size + 'px;height:' + size + 'px;' +
      'border-radius:50%;' +
      'background:' + pt.color + ';' +
      'border:2px solid rgba(255,255,255,.5);' +
      'box-shadow:0 0 ' + size + 'px ' + pt.color + '88;' +
      'cursor:pointer;' +
      '"></div>',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });

  const m = window.L.marker([pt.lat, pt.lng], { icon })
    .addTo(rainMarkers)
    .bindPopup(
      '<div style="font-family:Kanit;font-size:13px;color:var(--tx)">' +
      '<b>🌧️ ปริมาณฝน:</b> ' + pt.intensity + ' มม.<br>' +
      '<small style="color:var(--tx4)">' +
      pt.lat.toFixed(5) + ', ' + pt.lng.toFixed(5) +
      '</small></div>'
    );

  pt._marker = m;
}

// ── HEAT LAYER ────────────────────────────────────────────
function rebuildRainHeat() {
  if (rainHeatLayer) map.removeLayer(rainHeatLayer);

  const legend = document.getElementById('rainLegend');

  if (!rainPoints.length) {
    legend.classList.remove('show');
    return;
  }

  const radius = parseInt(document.getElementById('rRad').value);
  const blur   = parseInt(document.getElementById('rBlur').value);
  const op     = parseInt(document.getElementById('rOp').value) / 10;

  const data = rainPoints.map(p => [p.lat, p.lng, p.intensity / 100]);

  rainHeatLayer = window.L.heatLayer(data, {
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

  legend.classList.add('show');
}

function updateRainHeat() {
  document.getElementById('rRadV').textContent  = document.getElementById('rRad').value;
  document.getElementById('rBlurV').textContent = document.getElementById('rBlur').value;
  document.getElementById('rOpV').textContent   =
    (document.getElementById('rOp').value / 10).toFixed(1);
  rebuildRainHeat();
}

// ── POINT LIST ────────────────────────────────────────────
function renderRainList() {
  const el = document.getElementById('rainPointList');

  if (!rainPoints.length) {
    el.innerHTML = '<div class="empty-hint">คลิกบนแผนที่<br>เพื่อบันทึกข้อมูลฝน</div>';
    return;
  }

  el.innerHTML = rainPoints.map(function(p, i) {
    return '<div class="rain-pt" onclick="flyToRain(' + i + ')">' +
      '<div class="rpd" style="background:' + p.color +
        ';box-shadow:0 0 4px ' + p.color + '"></div>' +
      '<div class="rpi">' +
        '<b>' + p.intensity + ' มม.</b>' +
        '<div class="rpc">' + p.lat.toFixed(4) + ', ' + p.lng.toFixed(4) + '</div>' +
      '</div>' +
      '<button class="rpx" onclick="event.stopPropagation();deleteRainPoint(' + i + ')">×</button>' +
    '</div>';
  }).join('');
}

function flyToRain(i) {
  const p = rainPoints[i];
  map.flyTo([p.lat, p.lng], 14, { duration: 0.8 });
  if (p._marker) p._marker.openPopup();
}

function deleteRainPoint(i) {
  if (rainPoints[i]._marker) rainMarkers.removeLayer(rainPoints[i]._marker);
  rainPoints.splice(i, 1);
  rebuildRainHeat();
  renderRainList();
  updateRainStats();
}

function clearRainAll() {
  if (!rainPoints.length) return;
  if (!confirm('ล้าง ' + rainPoints.length + ' จุดทั้งหมด?')) return;
  rainMarkers.clearLayers();
  rainPoints = [];
  rebuildRainHeat();
  renderRainList();
  updateRainStats();
}

// ── STATS ─────────────────────────────────────────────────
function updateRainStats() {
  document.getElementById('rainCount').textContent = rainPoints.length;
  document.getElementById('rainSum').textContent =
    rainPoints.reduce(function(s, p) { return s + p.intensity; }, 0);
}

// ── CLOSE MODAL ON OVERLAY CLICK ─────────────────────────
document.getElementById('rainOverlay').addEventListener('click', function(e) {
  if (e.target === document.getElementById('rainOverlay')) closeRainModal();
});

// ── KEYBOARD SHORTCUTS ────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeRainModal();
  // Only trigger when rain tab is active
  const rainTab = document.getElementById('p-rn');
  if (!rainTab || !rainTab.classList.contains('on')) return;
  if (e.key === 'a') setRainMode('add');
  if (e.key === 'p') setRainMode('pan');
});
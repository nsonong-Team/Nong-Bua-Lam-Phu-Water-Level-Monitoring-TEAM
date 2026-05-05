// ============================================================
// form.js — Water Report Form Logic
// ============================================================

// ---------- Apps Script URL (ตั้งค่าตรงนี้) ----------
const GAS_URL = localStorage.getItem("gasUrl") || "";

// ---------- State ----------
let selectedType = null;   // "rain" | "level"
let submitting   = false;

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  initDateTime();
  renderTypeCards();
  renderRiverOptions();
  renderWeatherOptions();
  bindRiverChange();
  bindValueInput();
  loadGasUrl();

  document.getElementById("btnSubmit").addEventListener("click", handleSubmit);
  document.getElementById("btnClear").addEventListener("click", resetAll);
  document.getElementById("btnSaveUrl").addEventListener("click", saveGasUrl);
});

// ---------- Date / Time ----------
function initDateTime() {
  const now = new Date();
  document.getElementById("fDate").valueAsDate = now;
  document.getElementById("fTime").value =
    now.getHours().toString().padStart(2, "0") + ":" +
    now.getMinutes().toString().padStart(2, "0");
}

// ---------- Type Cards ----------
function renderTypeCards() {
  const wrap = document.getElementById("typeCards");
  wrap.innerHTML = FORM_TYPES.map(t => `
    <div class="type-card" data-id="${t.id}" onclick="selectType('${t.id}')">
      <div class="tc-icon">${t.label.split(" ")[0]}</div>
      <div class="tc-body">
        <div class="tc-title">${t.label.replace(/^\S+\s/, "")}</div>
        <div class="tc-desc">${t.desc}</div>
      </div>
      <div class="tc-check" id="chk-${t.id}"></div>
    </div>
  `).join("");
}

function selectType(id) {
  selectedType = id;

  // highlight cards
  document.querySelectorAll(".type-card").forEach(c => {
    c.classList.toggle("active", c.dataset.id === id);
    document.getElementById("chk-" + c.dataset.id).innerHTML =
      c.dataset.id === id ? "✓" : "";
  });

  // show fields
  document.getElementById("mainFields").classList.remove("hidden");

  // toggle value fields
  document.getElementById("fieldRain").classList.toggle("hidden",  id !== "rain");
  document.getElementById("fieldLevel").classList.toggle("hidden", id !== "level");

  // reset value inputs
  document.getElementById("fRain").value  = "";
  document.getElementById("fLevel").value = "";
  document.getElementById("statusBadge").textContent = "—";
  document.getElementById("statusBadge").className   = "status-badge";

  // scroll to fields smoothly
  setTimeout(() => {
    document.getElementById("mainFields").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 80);
}

// ---------- River / Station ----------
function renderRiverOptions() {
  const sel = document.getElementById("fRiver");
  sel.innerHTML = '<option value="">-- เลือกลำน้ำ --</option>' +
    RIVERS.map(r => `<option value="${r.id}">${r.label}</option>`).join("");
}

function bindRiverChange() {
  document.getElementById("fRiver").addEventListener("change", function () {
    const rv = this.value;
    const stations = STATIONS.filter(s => s.rv === rv);
    const sel = document.getElementById("fStation");
    sel.innerHTML = '<option value="">-- เลือกสถานี --</option>' +
      stations.map(s =>
        `<option value="${s.id}">${s.nm} (อ.${s.ap})</option>`
      ).join("");
  });
}

// ---------- Level → Auto Status ----------
function bindValueInput() {
  document.getElementById("fLevel").addEventListener("input", function () {
    const sid = +document.getElementById("fStation").value;
    if (!sid) return;

    const s   = STATIONS.find(x => x.id === sid);
    const lv  = parseFloat(this.value);
    const badge = document.getElementById("statusBadge");

    if (!s || isNaN(lv)) {
      badge.textContent = "—";
      badge.className   = "status-badge";
      return;
    }

    // ใช้ค่า threshold จาก data หลัก (ถ้ามี) — fallback ตัวอย่าง
    // ตรงนี้ถ้าต้องการ threshold จริงให้ import จาก data.js หลักได้
    badge.textContent = lv >= 0 ? "บันทึกแล้ว" : "—";
    badge.className   = "status-badge ok";
  });
}

// ---------- Weather ----------
function renderWeatherOptions() {
  const sel = document.getElementById("fWeather");
  sel.innerHTML = '<option value="">-- เลือกสภาพอากาศ --</option>' +
    WEATHER_OPTIONS.map(w =>
      `<option value="${w.v}">${w.label}</option>`
    ).join("");
}

// ---------- Submit ----------
function handleSubmit() {
  if (submitting) return;

  // Validate
  const errors = validate();
  if (errors.length) {
    showToast("⚠️ " + errors[0], "warn");
    return;
  }

  const payload = buildPayload();

  if (!GAS_URL && !localStorage.getItem("gasUrl")) {
    showToast("⚠️ ยังไม่ได้ตั้งค่า Apps Script URL", "warn");
    return;
  }

  submitting = true;
  const btn = document.getElementById("btnSubmit");
  btn.textContent = "⏳ กำลังส่ง...";
  btn.disabled = true;

  sendToGAS(payload);
}

function validate() {
  const errs = [];
  if (!selectedType)                             errs.push("กรุณาเลือกประเภทการบันทึก");
  if (!document.getElementById("fDate").value)  errs.push("กรุณาระบุวันที่");
  if (!document.getElementById("fRiver").value) errs.push("กรุณาเลือกลำน้ำ");
  if (!document.getElementById("fStation").value) errs.push("กรุณาเลือกสถานี");

  if (selectedType === "rain") {
    const v = document.getElementById("fRain").value;
    if (v === "" || isNaN(parseFloat(v))) errs.push("กรุณากรอกปริมาณน้ำฝน");
  }
  if (selectedType === "level") {
    const v = document.getElementById("fLevel").value;
    if (v === "" || isNaN(parseFloat(v))) errs.push("กรุณากรอกระดับน้ำ");
  }
  return errs;
}

function buildPayload() {
  const sid    = +document.getElementById("fStation").value;
  const station = STATIONS.find(s => s.id === sid);

  return {
    type:      selectedType,
    date:      document.getElementById("fDate").value,
    time:      document.getElementById("fTime").value,
    river:     document.getElementById("fRiver").value === "p" ? "ลำน้ำพะเนียง" : "ลำน้ำโมง",
    stationId: sid,
    station:   station ? station.nm : "",
    reporter:  document.getElementById("fReporter").value.trim(),
    weather:   document.getElementById("fWeather").value,
    note:      document.getElementById("fNote").value.trim(),
    rain:      selectedType === "rain"  ? parseFloat(document.getElementById("fRain").value)  : "",
    level:     selectedType === "level" ? parseFloat(document.getElementById("fLevel").value) : "",
    trend:     document.getElementById("fTrend") ? document.getElementById("fTrend").value : ""
  };
}

// ---------- Google Apps Script (JSONP) ----------
function sendToGAS(payload) {
  const url = localStorage.getItem("gasUrl");
  const qs  = Object.entries(payload)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const sc = document.createElement("script");
  sc.src = `${url}?action=addRecord&${qs}&callback=_gasCallback`;

  sc.onerror = () => {
    sc.remove();
    onSubmitDone(false);
  };

  document.head.appendChild(sc);

  // timeout fallback 10 วิ
  setTimeout(() => {
    if (submitting) onSubmitDone(false, "หมดเวลา");
  }, 10000);
}

window._gasCallback = function (res) {
  onSubmitDone(res && res.success !== false);
};

function onSubmitDone(ok, msg) {
  submitting = false;
  const btn = document.getElementById("btnSubmit");
  btn.textContent = "📤 ส่งข้อมูล";
  btn.disabled = false;

  if (ok) {
    showToast("✅ บันทึกข้อมูลเรียบร้อยแล้ว", "ok");
    addHistory(buildPayload());
    resetAll();
  } else {
    showToast("❌ ส่งข้อมูลไม่สำเร็จ " + (msg || ""), "err");
  }
}

// ---------- History ----------
const history = [];

function addHistory(p) {
  history.unshift(p);
  renderHistory();
}

function renderHistory() {
  const el = document.getElementById("historyList");
  if (!history.length) {
    el.innerHTML = '<div class="hist-empty">ยังไม่มีรายการ</div>';
    return;
  }

  el.innerHTML = history.slice(0, 10).map(p => {
    const typeLabel = p.type === "rain" ? "🌧️ น้ำฝน" : "📏 ระดับน้ำ";
    const valLabel  = p.type === "rain"
      ? `${p.rain} มม.`
      : `${p.level} ม.รทก.`;
    return `
      <div class="hist-item">
        <div class="hi-left">
          <div class="hi-type">${typeLabel}</div>
          <div class="hi-station">${p.station} · ${p.river}</div>
          <div class="hi-time">${p.date} ${p.time} ${p.reporter ? "· " + p.reporter : ""}</div>
        </div>
        <div class="hi-val">${valLabel}</div>
      </div>
    `;
  }).join("");
}

// ---------- Reset ----------
function resetAll() {
  selectedType = null;
  document.querySelectorAll(".type-card").forEach(c => c.classList.remove("active"));
  document.querySelectorAll(".tc-check").forEach(c => c.textContent = "");
  document.getElementById("mainFields").classList.add("hidden");
  document.getElementById("fRiver").value    = "";
  document.getElementById("fStation").innerHTML = '<option value="">-- เลือกสถานี --</option>';
  document.getElementById("fReporter").value = "";
  document.getElementById("fWeather").value  = "";
  document.getElementById("fNote").value     = "";
  document.getElementById("fRain").value     = "";
  document.getElementById("fLevel").value    = "";
  document.getElementById("fTrend").value    = "";
  document.getElementById("statusBadge").textContent = "—";
  document.getElementById("statusBadge").className   = "status-badge";
  initDateTime();
}

// ---------- GAS URL Config ----------
function loadGasUrl() {
  const saved = localStorage.getItem("gasUrl");
  if (saved) {
    document.getElementById("gasUrlInput").value = saved;
    document.getElementById("connStatus").textContent = "🟢 เชื่อมต่อแล้ว";
    document.getElementById("connStatus").className   = "conn-status ok";
  }
}

function saveGasUrl() {
  const val = document.getElementById("gasUrlInput").value.trim();
  const el  = document.getElementById("connStatus");

  if (val && !val.startsWith("https://script.google.com")) {
    el.textContent = "❌ URL ไม่ถูกต้อง";
    el.className   = "conn-status err";
    return;
  }

  localStorage.setItem("gasUrl", val);
  el.textContent = val ? "🟢 บันทึกแล้ว" : "⚪ ยังไม่ได้ตั้งค่า";
  el.className   = "conn-status " + (val ? "ok" : "");
}

// ---------- Toast ----------
function showToast(msg, type) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className   = "toast show " + (type || "");
  setTimeout(() => el.classList.remove("show"), 3500);
}
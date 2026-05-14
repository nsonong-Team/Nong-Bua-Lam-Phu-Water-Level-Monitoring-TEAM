let LS = {};

function startInterval() {
  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(() => {
    if (aU) {
      const sc = document.createElement("script");
      sc.src = aU + "?action=getLevels&callback=_lc";
      sc.onload = () => sc.remove();
      sc.onerror = () => console.error("โหลดข้อมูลไม่สำเร็จ");
      document.head.appendChild(sc);
    } else sim();
  }, rI * 1000);
}

function svCfg() {
  aU = document.getElementById("cU").value.trim();
  rI = parseInt(document.getElementById("cI").value) || 30;

  const e = document.getElementById("cS");

  if (aU && !aU.startsWith("http")) {
    e.innerHTML = "❌ URL ไม่ถูกต้อง";
    e.style.background = "var(--rd-bg)";
    e.style.color = "var(--rd)";
    return;
  }

  localStorage.setItem("aU", aU);
  localStorage.setItem("rI", String(rI));

  if (aU) {
    e.innerHTML = "🟢 เชื่อมต่อแล้ว — refresh ทุก " + rI + " วินาที";
    e.style.background = "var(--gn-bg)";
    e.style.color = "var(--gn)";
  } else {
    e.innerHTML = "⚪ ยังไม่ได้เชื่อมต่อ";
    e.style.background = "var(--w7)";
    e.style.color = "var(--tx4)";
  }

  startInterval();
}

window._cb = function(d) {
  console.log("Sheet:", d);
};

window._lc = function(d) {
  if (d && d.levels) {
    d.levels.forEach(i => {
      if (i.stationId && i.level !== '') {
        L[i.stationId] = parseFloat(i.level);
        LS[i.stationId] = i.statusCode; // เก็บ 'r', 'y', 'g'
      }
    });
  }
  rf();
};

function rf() {
  uK();
  D.forEach(s => mM(s));
  rL("lP", "p");
  rL("lM", "m");
  rE();
}

function sim() {
  D.forEach(s => {
    L[s.id] = Math.round((L[s.id] + (Math.random() - 0.48) * 0.2) * 10) / 10;
  });
  rf();
}

function uc() {
  const isMobile = window.innerWidth <= 480;

  if (isMobile) {
    document.getElementById("clk").textContent =
      new Date().toLocaleTimeString("th-TH", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
  } else {
    document.getElementById("clk").textContent =
      new Date().toLocaleString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
  }
}

(function() {
  document.getElementById("fD").valueAsDate = new Date();

  if (aU) {
    document.getElementById("cU").value = aU;
    document.getElementById("cI").value = rI;
    const e = document.getElementById("cS");
    e.innerHTML = "🟢 เชื่อมต่อแล้ว";
    e.style.background = "var(--gn-bg)";
    e.style.color = "var(--gn)";
  }

  iL();
  iM();
  rf();
  uc();

  setInterval(uc, 1000);

  // ✅ เพิ่ม: ดึงข้อมูลจาก Sheet ทันทีตอน load
  if (aU) {
  // แสดง loading ก่อน
  document.getElementById("at").innerHTML = "⏳ กำลังโหลดข้อมูลล่าสุด...";
  document.getElementById("ab").classList.add("show");

  const sc = document.createElement("script");
  sc.src = aU + "?action=getLevels&callback=_lc";
  sc.onload = () => sc.remove();
  sc.onerror = () => console.error("โหลดข้อมูลไม่สำเร็จ");
  document.head.appendChild(sc);
  }

  startInterval();
})();

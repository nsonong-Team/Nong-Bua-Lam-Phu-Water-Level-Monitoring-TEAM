let intervalId;

let L = {},
  rp = [],
  map,
  mk = {},
  aU = localStorage.getItem("aU") || "",
  rI = parseInt(localStorage.getItem("rI") || "30");

function gs(s, l) {
  // ถ้ามี status จาก server ให้ใช้ก่อนเลย
  if (LS && LS[s.id]) {
    const c = LS[s.id];
    if (c === 'r') return { t:"วิกฤติ", c:"r", f:"ธงแดง", e:"🔴", co:"var(--rd)" };
    if (c === 'y') return { t:"เฝ้าระวัง", c:"y", f:"ธงเหลือง", e:"🟡", co:"var(--yl)" };
    return { t:"ปกติ", c:"g", f:"ธงเขียว", e:"🟢", co:"var(--gn)" };
  }
  // fallback คำนวณจาก threshold เดิม
  if (l >= s.rd) return { t:"วิกฤติ", c:"r", f:"ธงแดง", e:"🔴", co:"var(--rd)" };
  if (l >= s.yl) return { t:"เฝ้าระวัง", c:"y", f:"ธงเหลือง", e:"🟡", co:"var(--yl)" };
  return { t:"ปกติ", c:"g", f:"ธงเขียว", e:"🟢", co:"var(--gn)" };
}

function iL() {
  D.forEach(s => {
    const b = s.gm - 2,
      r = s.rd - b;
    L[s.id] = Math.round((b + Math.random() * r * .6) * 10) / 10;
  });
}

function rL(el, rv) {
  const c = document.getElementById(el);
  c.innerHTML = D.filter(s => s.rv === rv)
    .map(s => {
      const lv = L[s.id],
        x = gs(s, lv),
        p = Math.max(
          0,
          Math.min(100, ((lv - (s.gm - 5)) / (s.rd + 2 - s.gm + 5)) * 100)
        );

      return (
        '<div class="sc ' + x.c + '" onclick="fT(' + s.id + ')">' +
        '<div class="hd">' +
        '<span class="nm">' + s.nm + '</span>' +
        '<span class="bd ' + x.c + '">' + x.f + '</span>' +
        '</div>' +
        '<div class="lc">อ.' + s.ap + ' ต.' + s.tb + '</div>' +
        '<div class="mt">' +
        '<span><b>' + lv.toFixed(1) + '</b> ม.รทก.</span>' +
        '<span>สูง <b>' + s.el + '</b></span>' +
        (s.ds ? '<span>' + s.ds + ' กม.</span>' : '') +
        '</div>' +
        '<div class="sb2">' +
        '<i style="width:' + p + '%;background:' + x.co + '"></i>' +
        '</div>' +
        '</div>'
      );
    })
    .join("");
}

function rE() {
  const el = document.getElementById("eB");
  if (!el) return;

  const sr = [...D].sort((a, b) => b.el - a.el),
        mx = Math.max(...D.map(s => s.el));

  el.innerHTML = sr.map(s => {
    const lv = L[s.id],
          x = gs(s, lv),
          h = (s.el / mx) * 100;

    return `
      <div class="mebar"
        style="height:${h}%;background:${x.co};opacity:.65"
        onclick="fT(${s.id})">
      </div>
    `;
  }).join("");
}

function fT(id) {
  const s = D.find(x => x.id === id);
  map.flyTo([s.la, s.ln], 12, {
    duration: 1
  });
  setTimeout(() => mk[id].openPopup(), 600);
}

function swP(p, b) {
  document.querySelectorAll(".sbt").forEach(t => t.classList.remove("on"));
  document.querySelectorAll(".sbp").forEach(t => t.classList.remove("on"));
  b.classList.add("on");
  document.getElementById("p-" + p).classList.add("on");
}

document.getElementById("fR").onchange = function() {
  const sts = D.filter(s => s.rv === (this.value === "paneang" ? "p" : "m"));
  document.getElementById("fS").innerHTML =
    '<option value="">-- เลือก --</option>' +
    sts.map(s => '<option value="' + s.id + '">' + s.nm + '</option>').join("");
};

document.getElementById("fL").oninput = function() {
  const sid = +document.getElementById("fS").value;
  if (!sid) return;

  const s = D.find(x => x.id === sid),
    lv = parseFloat(this.value);

  if (isNaN(lv)) return;
  // if (isNaN(lv) || lv < 0 || lv > 500) {
  //   alert("ค่าระดับน้ำไม่ถูกต้อง");
  //   return;
  // }

  const x = gs(s, lv),
    el = document.getElementById("fSt");

  el.textContent = x.e + " " + x.f + " (" + x.t + ")";
  el.style.background =
    x.c === "g" ? "var(--gn-bg)" : x.c === "y" ? "var(--yl-bg)" : "var(--rd-bg)";
  el.style.color = x.co;
};

function subR() {
  const sid = +document.getElementById("fS").value;
  if (!sid) {
    alert("กรุณาเลือกสถานี");
    return;
  }

  const lv = parseFloat(document.getElementById("fL").value);
  if (isNaN(lv)) {
    alert("กรุณากรอกระดับน้ำ");
    return;
  }

  const s = D.find(x => x.id === sid);
  L[sid] = lv;
  const x = gs(s, lv);

  rp.unshift({
    d: document.getElementById("fD").value,
    t: document.getElementById("fT").value,
    nm: s.nm,
    sid,
    lv,
    x,
    w: document.getElementById("fW").value
  });

  if (aU) {
    const p =
      "stationId=" + sid +
      "&station=" + encodeURIComponent(s.nm) +
      "&level=" + lv +
      "&status=" + encodeURIComponent(x.f) +
      "&date=" + encodeURIComponent(document.getElementById("fD").value) +
      "&time=" + encodeURIComponent(document.getElementById("fT").value) +
      "&weather=" + encodeURIComponent(document.getElementById("fW").value) +
      "&rain=" + encodeURIComponent(document.getElementById("fRn").value || "") +
      "&note=" + encodeURIComponent(document.getElementById("fN").value);

    const sc = document.createElement("script");
    sc.src = aU + "?action=addReport&" + p + "&callback=_cb";
    sc.onload = () => sc.remove();
    sc.onerror = () => {
      alert("❌ ส่งข้อมูลไม่สำเร็จ");
    };
    document.head.appendChild(sc);
  }
  rf();
  rrp();
  clrF();
}

function clrF() {
  document.getElementById("fD").valueAsDate = new Date();
  document.getElementById("fT").value = "08:00";
  document.getElementById("fR").value = "";
  document.getElementById("fS").innerHTML = '<option value="">-- เลือก --</option>';
  ["fL", "fRn", "fN"].forEach(i => (document.getElementById(i).value = ""));
  document.getElementById("fW").value = "";
  document.getElementById("fTr").value = "";

  const e = document.getElementById("fSt");
  e.textContent = "—";
  e.style.background = "var(--w7)";
  e.style.color = "var(--tx4)";
}

function rrp() {
  const el = document.getElementById("rL");
  if (!rp.length) {
    el.innerHTML = '<div style="color:var(--tx4)">ยังไม่มีรายงาน</div>';
    return;
  }
  el.innerHTML = rp
    .slice(0, 8)
    .map(r =>
      '<div class="ri">' +
      '<div>' +
      '<div style="font-weight:500;color:var(--tx)">' + r.nm + '</div>' +
      '<div style="color:var(--tx4)">' + r.d + ' ' + r.t + ' ' + (r.w || '') + '</div>' +
      '</div>' +
      '<div style="text-align:right">' +
      '<span class="bd ' + r.x.c + '">' + r.x.f + '</span>' +
      '<div style="margin-top:2px;font-weight:600">' + r.lv.toFixed(1) + ' ม.</div>' +
      '</div>' +
      '</div>'
    )
    .join("");
}

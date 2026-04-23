const D = [
  { id: 1, nm: "วังปลาป้อม", vl: "บ้านโคกเจริญ", mo: 2, tb: "วังปลาป้อม", ap: "นาวัง", la: 17.42065, ln: 101.99304, el: 290, rd: 290, yl: 289.5, gm: 289, ds: 22.6, rv: "p" },
  { id: 2, nm: "โคกกระทอ", vl: "บ้านโคกกระทอ", mo: 3, tb: "นาเหล่า", ap: "นาวัง", la: 17.34314, ln: 102.07167, el: 266, rd: 266, yl: 265.5, gm: 265, ds: 12.18, rv: "p" },
  { id: 3, nm: "วังสามหาบ", vl: "บ้านวังสามหาบ", mo: 8, tb: "เทพคีรี", ap: "นาวัง", la: 17.3099, ln: 102.10789, el: 258, rd: 258, yl: 257.5, gm: 257, ds: 14, rv: "p" },
  { id: 4, nm: "บ้านหนองด่าน", vl: "บ้านหนองด่าน", mo: 14, tb: "ด่านช้าง", ap: "นากลาง", la: 17.27936, ln: 102.16552, el: 249, rd: 249, yl: 248.5, gm: 248, ds: 15.7, rv: "p" },
  { id: 5, nm: "บ้านฝั่งแดง", vl: "บ้านฝั่งแดง", mo: 14, tb: "ฝั่งแดง", ap: "นากลาง", la: 17.2673, ln: 102.22728, el: 237, rd: 237, yl: 236.5, gm: 236, ds: 34.8, rv: "p" },
  { id: 6, nm: "ปตร.หนองหว้าใหญ่", vl: "บ้านหนองหว้าใหญ่", mo: 1, tb: "หนองหว้า", ap: "เมืองฯ", la: 17.17981, ln: 102.38617, el: 216, rd: 216, yl: 215.5, gm: 215, ds: 10, rv: "p" },
  { id: 7, nm: "วังหมื่น", vl: "บ้านวังหมื่น", mo: 4, tb: "หนองบัว", ap: "เมืองฯ", la: 17.18317, ln: 102.43244, el: 210, rd: 210, yl: 209.5, gm: 209, ds: 18.8, rv: "p" },
  { id: 8, nm: "ปตร.ปู่หลอด", vl: "บ้านโนนคูณ", mo: 3, tb: "บ้านขาม", ap: "เมืองฯ", la: 17.11487, ln: 102.45435, el: 203, rd: 203, yl: 202.5, gm: 202.5, ds: 8.07, rv: "p" },
  { id: 10, nm: "ปตร.หัวนา", vl: "บ้านดอนหัน", mo: 10, tb: "หัวนา", ap: "เมืองฯ", la: 17.00067, ln: 102.424, el: 191, rd: 191, yl: 190.5, gm: 190, ds: 0, rv: "p" },
  { id: 11, nm: "คลองบุญทัน", vl: "บ้านบุญทัน", mo: 1, tb: "บุญทัน", ap: "สุวรรณคูหา", la: 17.54512, ln: 102.16832, el: 231, rd: 231, yl: 230.5, gm: 230, ds: 6, rv: "m" },
  { id: 12, nm: "บ้านโคก", vl: "บ้านโคก", mo: 1, tb: "บ้านโคก", ap: "สุวรรณคูหา", la: 17.54952, ln: 102.20425, el: 218, rd: 218, yl: 217.5, gm: 217, ds: 13.6, rv: "m" }
];

const PB = [[17.60, 101.95], [17.62, 102.00], [17.63, 102.10], 
[17.62, 102.20], [17.60, 102.30], [17.58, 102.35], 
[17.55, 102.38], [17.50, 102.42], [17.45, 102.48], 
[17.40, 102.50], [17.35, 102.52], [17.30, 102.53], 
[17.25, 102.52], [17.20, 102.50], [17.15, 102.48], 
[17.10, 102.50], [17.05, 102.48], [17.00, 102.46], 
[16.95, 102.45], [16.92, 102.42], [16.90, 102.38], 
[16.88, 102.32], [16.90, 102.25], [16.92, 102.18], 
[16.95, 102.12], [16.98, 102.08], [17.02, 102.02], 
[17.05, 101.98], [17.10, 101.95], [17.15, 101.93], 
[17.20, 101.92], [17.25, 101.91], [17.30, 101.90], 
[17.35, 101.88], [17.40, 101.87], [17.45, 101.88], 
[17.50, 101.90], [17.55, 101.92], [17.60, 101.95]];
const DT = [{ n: "อ.เมืองหนองบัวลำภู", la: 17.204, ln: 102.441 }, { n: "อ.นากลาง", la: 17.312, ln: 102.195 }, { n: "อ.นาวัง", la: 17.371, ln: 102.068 }, { n: "อ.สุวรรณคูหา", la: 17.548, ln: 102.183 }, { n: "อ.โนนสัง", la: 17.062, ln: 102.305 }, { n: "อ.ศรีบุญเรือง", la: 17.145, ln: 102.195 }];

let L = {},
  rp = [],
  map,
  mk = {},
  aU = localStorage.getItem("aU") || "",
  rI = parseInt(localStorage.getItem("rI") || "30");

function gs(s, l) {
  if (l >= s.rd)
    return {
      t: "วิกฤติ",
      c: "r",
      f: "ธงแดง",
      e: "🔴",
      co: "var(--rd)"
    };

  if (l >= s.yl)
    return {
      t: "เฝ้าระวัง",
      c: "y",
      f: "ธงเหลือง",
      e: "🟡",
      co: "var(--yl)"
    };

  return {
    t: "ปกติ",
    c: "g",
    f: "ธงเขียว",
    e: "🟢",
    co: "var(--gn)"
  };
}

function iL() {
  D.forEach(s => {
    const b = s.gm - 2,
      r = s.rd - b;
    L[s.id] = Math.round((b + Math.random() * r * .6) * 10) / 10;
  });
}

function iM() {
  map = window.L.map("map", {
    center: [17.22, 102.20],
    zoom: 10,
    zoomControl: true,
    attributionControl: false
  });

  // background map
  window.L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 19
    }
  ).addTo(map);

  fetch("river.geojson")
    .then(res => res.json())
    .then(data => {
      // glow layer
      window.L.geoJSON(data, {
        style: function(feature) {
          const type = feature.properties.waterway;

          if (type === "river") return { color: "#00e5ff", weight: 4 };
          if (type === "stream") return { color: "#4fc3f7", weight: 2 };
          if (type === "canal") return { color: "#80deea", weight: 2 };

          return { color: "#aaa", weight: 1 };
        }
      }).addTo(map);

      // main line river
      window.L.geoJSON(data, {
        style: function(feature) {
          const type = feature.properties.waterway;

          if (type === "river") return { color: "#00e5ff", weight: 4 };
          if (type === "stream") return { color: "#4fc3f7", weight: 2 };
          if (type === "canal") return { color: "#80deea", weight: 2 };

          return { color: "#aaa", weight: 1 };
        }
      }).addTo(map);
    });

  // max size map
  window.L.polygon(PB, {
    color: "#0288d1",
    weight: 2.5,
    opacity: .5,
    fillColor: "#0288d1",
    fillOpacity: .04,
    dashArray: "10 5"
  }).addTo(map);

  window.L.polygon(PB, {
    color: "#4fc3f7",
    weight: 1,
    opacity: .2,
    fill: false,
    dashArray: "4 8"
  }).addTo(map);

  // district name
  DT.forEach(d => {
    window.L.marker([d.la, d.ln], {
      icon: window.L.divIcon({
        html:
          '<div style="font-size:10px;color:rgba(79,195,247,.35);font-family:Kanit;font-weight:300;white-space:nowrap;text-shadow:0 0 10px rgba(2,136,209,.3)">' +
          d.n +
          "</div>",
        className: "",
        iconAnchor: [40, 5]
      })
    }).addTo(map);
  });

  // dR();

  D.forEach(s => mM(s));

  map.fitBounds(
    window.L.latLngBounds(D.map(s => [s.la, s.ln])).pad(.2)
  );
}

function dR() {
  const pn = D.filter(s => s.rv === "p").sort((a, b) => b.la - a.la),
    mg = D.filter(s => s.rv === "m").sort((a, b) => b.la - a.la);

  function dr(sts, col) {
    if (sts.length < 2) return;

    const pts = sts.map(s => [s.la, s.ln]);

    window.L.polyline(pts, {
      color: col,
      weight: 10,
      opacity: .08,
      smoothFactor: 2
    }).addTo(map);

    window.L.polyline(pts, {
      color: col,
      weight: 4,
      opacity: .35,
      smoothFactor: 2
    }).addTo(map);

    window.L.polyline(pts, {
      color: col,
      weight: 2,
      opacity: .7,
      smoothFactor: 2,
      dashArray: "10 5"
    }).addTo(map);

    for (let i = 0; i < pts.length - 1; i++) {
      const m = [
          (pts[i][0] + pts[i + 1][0]) / 2,
          (pts[i][1] + pts[i + 1][1]) / 2
        ],
        a = (Math.atan2(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) * 180) / Math.PI;

      window.L.marker(m, {
        icon: window.L.divIcon({
          html: '<div style="font-size:10px;color:' +
            col +
            ';opacity:.6;transform:rotate(' +
            (180 - a) +
            'deg)">▾</div>',
          className: "",
          iconSize: [10, 10],
          iconAnchor: [5, 5]
        })
      }).addTo(map);
    }
  }
// man u just del line in map
  //dr(pn, "#0ea5e9");
  //dr(mg, "#ab47bc");
}

function mM(s) {
  const lv = L[s.id],
    x = gs(s, lv),
    c = x.c;

  const ic = window.L.divIcon({
    html: '<div class="wm">' +
      '<div class="wr ' + c + '"></div>' +
      '<div class="wr2 ' + c + '"></div>' +
      '<div class="wb ' + c + '">💧</div>' +
      '<div class="wl">' +
      '<div class="n">' + s.nm + '</div>' +
      '<div class="v" style="color:' + x.co + '">' +
      lv.toFixed(1) + ' ม.รทก.' +
      '</div>' +
      '</div>' +
      '</div>',
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -26]
  });

  if (mk[s.id]) map.removeLayer(mk[s.id]);

  mk[s.id] = window.L.marker([s.la, s.ln], {
    icon: ic
  }).addTo(map);

  mk[s.id].bindPopup(
    function() {
      return bP(s);
    }, {
      maxWidth: 300,
      closeButton: true
    }
  );
}

function bP(s) {
  const lv = L[s.id],
    x = gs(s, lv),
    rn = s.rv === "p" ? "ลำน้ำพะเนียง" : "ลำน้ำโมง",
    rc = s.rv === "p" ? "#0ea5e9" : "#ab47bc";

  const tr = s.rd - s.gm + 4,
    gP = ((s.gm - (s.gm - 2)) / tr) * 100,
    yP = ((s.rd - s.yl) / tr) * 100,
    rP = 100 - gP - yP;

  const mP = Math.max(
    0,
    Math.min(100, ((lv - (s.gm - 2)) / tr) * 100)
  );

  return (
    '<div>' +
    '<div class="ph">' +
    '<h3>' + x.e + ' ' + s.nm + ' <span class="bd ' + x.c + '">' + x.f + '</span></h3>' +
    '<div class="su">' + s.vl + ' ม.' + s.mo + ' ต.' + s.tb + ' อ.' + s.ap + '</div>' +
    '</div>' +

    '<div class="pg">' +
    '<div class="pgi">' +
    '<div class="pv" style="color:' + x.co + '">' + lv.toFixed(1) + '</div>' +
    '<div class="pl">ระดับน้ำ (ม.รทก.)</div>' +
    '</div>' +

    '<div class="pgi">' +
    '<div class="pv" style="color:var(--w3)">' + s.el + '</div>' +
    '<div class="pl">ความสูง (ม.รทก.)</div>' +
    '</div>' +

    '<div class="pgi">' +
    '<div class="pv" style="color:#4fc3f7">' + (s.ds || "—") + '</div>' +
    '<div class="pl">ระยะทาง (กม.)</div>' +
    '</div>' +
    '</div>' +

    '<div class="pt">' +
    '<div style="font-size:10px;color:var(--tx4);margin-bottom:4px">เกณฑ์เตือนภัย</div>' +
    '<div style="position:relative">' +
    '<div class="ptb">' +
    '<div class="ptz" style="flex:' + gP + ';background:var(--gn);opacity:.4"></div>' +
    '<div class="ptz" style="flex:' + yP + ';background:var(--yl);opacity:.5"></div>' +
    '<div class="ptz" style="flex:' + rP + ';background:var(--rd);opacity:.5"></div>' +
    '</div>' +
    '<div class="ptm" style="left:' + mP + '%"></div>' +
    '</div>' +

    '<div class="ptl">' +
    '<span>< ' + s.gm + ' ม. ปกติ</span>' +
    '<span>' + s.yl + ' ม.</span>' +
    '<span>≥ ' + s.rd + ' ม. วิกฤติ</span>' +
    '</div>' +
    '</div>' +

    '<div class="prv">' +
    '<span class="dt" style="background:' + rc + '"></span>' + rn +
    '<span style="margin-left:auto;font-family:Sarabun;font-size:9px">📍 ' +
    s.la.toFixed(4) + ', ' + s.ln.toFixed(4) +
    '</span>' +
    '</div>' +
    '</div>'
  );
}

function uK() {
  let g = 0,
    y = 0,
    r = 0;

  D.forEach(s => {
    const x = gs(s, L[s.id]);
    if (x.c === "g") g++;
    else if (x.c === "y") y++;
    else r++;
  });

  document.getElementById("k1").textContent = g;
  document.getElementById("k2").textContent = y;
  document.getElementById("k3").textContent = r;

  const ab = document.getElementById("ab");

  if (r > 0) {
    const cr = D.filter(s => gs(s, L[s.id]).c === "r");
    document.getElementById("at").innerHTML =
      "<b>สถานีวิกฤติ " + r + " แห่ง:</b> " +
      cr.map(s => s.nm).join(", ") +
      " — เตรียมรับมือ!";
    ab.classList.add("show");
  } else {
    ab.classList.remove("show");
  }
}

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

function svCfg() {
  const aU = document.getElementById("cU").value.trim();
  const rI = parseInt(document.getElementById("cI").value) || 30;

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
}

window._cb = function(d) {
  console.log("Sheet:", d);
};

window._lc = function(d) {
  if (d && d.levels)
    d.levels.forEach(i => {
      if (i.stationId && i.level) L[i.stationId] = parseFloat(i.level);
    });
  rf();
};

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

  setInterval(() => {
    if (aU) {
      const sc = document.createElement("script");
      sc.src = aU + "?action=getLevels&callback=_lc";
      sc.onload = () => sc.remove();
      document.head.appendChild(sc);
    } else sim();
  }, rI * 1000);
})();
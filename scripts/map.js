function iM() {
  map = window.L.map("map", {
    center: [17.22, 102.20],
    zoom: 10,
    zoomControl: true,
    attributionControl: false
  });

  // background map
  window.L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    //"https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=8w48IpzMfnzEHpa2wQww",
    //"https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19
    }
  ).addTo(map);

  fetch("dwr_nong_bua_lamphu_water_all.geojson")
    .then(res => res.json())
    .then(data => {
      // glow layer
      window.L.geoJSON(data, {
        style: function(feature) {
          const cat = feature.properties.water_category;

          if (cat === "natural_stream")    return { color: "#4fc3f7", weight: 2 };
      if (cat === "manmade_canal")     return { color: "#80deea", weight: 2 };
      if (cat === "manmade_waterbody") return { color: "#0288d1", weight: 1, fillColor: "#0288d1", fillOpacity: 0.3 };
      if (cat === "natural_waterbody") return { color: "#00e5ff", weight: 1, fillColor: "#00acc1", fillOpacity: 0.25 };
      if (cat === "dam_or_weir")       return { color: "#ff9800", weight: 3 };

          return { color: "#aaa", weight: 1 };
        }
      }).addTo(map);

      // main line river
      window.L.geoJSON(data, {
        style: function(feature) {
          const cat = feature.properties.water_category;

          if (cat === "natural_stream")    return { color: "#4fc3f7", weight: 2 };
          if (cat === "manmade_canal")     return { color: "#80deea", weight: 2 };
          if (cat === "manmade_waterbody") return { color: "#0288d1", weight: 1, fillColor: "#0288d1", fillOpacity: 0.3 };
          if (cat === "natural_waterbody") return { color: "#00e5ff", weight: 1, fillColor: "#00acc1", fillOpacity: 0.25 };
          if (cat === "dam_or_weir")       return { color: "#ff9800", weight: 3 };

          return { color: "#aaa", weight: 1 };
        }
      }).addTo(map);
    });

  // max size map
  // window.L.polygon(PB, {
  //   color: "#0288d1",
  //   weight: 2.5,
  //   opacity: .5,
  //   fillColor: "#0288d1",
  //   fillOpacity: .04,
  //   dashArray: "10 5"
  // }).addTo(map);

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
  const main = document.querySelector(".main");

  if (r > 0) {
    const cr = D.filter(s => gs(s, L[s.id]).c === "r");
    document.getElementById("at").innerHTML =
      "<b>สถานีวิกฤติ " + r + " แห่ง:</b> " +
      cr.map(s => s.nm).join(", ") +
      " — เตรียมรับมือ!";
    ab.classList.add("show");
    main.classList.add("alrt-on");
  } else {
    ab.classList.remove("show");
    main.classList.remove("alrt-on");
  }
}

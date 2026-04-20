const D = [
    { id:1, nm:"วังปลาป้อม", vl:"บ้านโคกเจริญ", mo:2, tb:"วังปลาป้อม", ap:"นาวัง", la:17.42065, ln:101.99304, el:290, rd:290, yl:289.5, gm:289, ds:22.6, rv:"p" },
    { id:2, nm:"โคกกระทอ", vl:"บ้านโคกกระทอ", mo:3, tb:"นาเหล่า", ap:"นาวัง", la:17.34314, ln:102.07167, el:266, rd:266, yl:265.5, gm:265, ds:12.18, rv:"p" },
    { id:3, nm:"วังสามหาบ", vl:"บ้านวังสามหาบ", mo:8, tb:"เทพคีรี", ap:"นาวัง", la:17.3099, ln:102.10789, el:258, rd:258, yl:257.5, gm:257, ds:14, rv:"p" },
    { id:4, nm:"บ้านหนองด่าน", vl:"บ้านหนองด่าน", mo:14, tb:"ด่านช้าง", ap:"นากลาง", la:17.27936, ln:102.16552, el:249, rd:249, yl:248.5, gm:248, ds:15.7, rv:"p" },
    { id:5, nm:"บ้านฝั่งแดง", vl:"บ้านฝั่งแดง", mo:14, tb:"ฝั่งแดง", ap:"นากลาง", la:17.2673, ln:102.22728, el:237, rd:237, yl:236.5, gm:236, ds:34.8, rv:"p" },
    { id:6, nm:"ปตร.หนองหว้าใหญ่", vl:"บ้านหนองหว้าใหญ่", mo:1, tb:"หนองหว้า", ap:"เมืองฯ", la:17.17981, ln:102.38617, el:216, rd:216, yl:215.5, gm:215, ds:10, rv:"p" },
    { id:7, nm:"วังหมื่น", vl:"บ้านวังหมื่น", mo:4, tb:"หนองบัว", ap:"เมืองฯ", la:17.18317, ln:102.43244, el:210, rd:210, yl:209.5, gm:209, ds:18.8, rv:"p" },
    { id:8, nm:"ปตร.ปู่หลอด", vl:"บ้านโนนคูณ", mo:3, tb:"บ้านขาม", ap:"เมืองฯ", la:17.11487, ln:102.45435, el:203, rd:203, yl:202.5, gm:202.5, ds:8.07, rv:"p" },
    { id:9, nm:"บ้านข้องโป้", vl:"บ้านข้องโป้", mo:7, tb:"บ้านขาม", ap:"เมืองฯ", la:17.08217, ln:102.45068, el:201, rd:201, yl:200.5, gm:200, ds:20.7, rv:"p" },
    { id:10, nm:"ปตร.หัวนา", vl:"บ้านดอนหัน", mo:10, tb:"หัวนา", ap:"เมืองฯ", la:17.00067, ln:102.424, el:191, rd:191, yl:190.5, gm:190, ds:0, rv:"p" },
    { id:11, nm:"คลองบุญทัน", vl:"บ้านบุญทัน", mo:1, tb:"บุญทัน", ap:"สุวรรณคูหา", la:17.54512, ln:102.16832, el:231, rd:231, yl:230.5, gm:230, ds:6, rv:"m" },
    { id:12, nm:"บ้านโคก", vl:"บ้านโคก", mo:1, tb:"บ้านโคก", ap:"สุวรรณคูหา", la:17.54952, ln:102.20425, el:218, rd:218, yl:217.5, gm:217, ds:13.6, rv:"m" }
];

const PB = [
    [17.60,101.95],[17.62,102.00],[17.63,102.10],[17.62,102.20],[17.60,102.30],
    [17.58,102.35],[17.55,102.38],[17.50,102.42],[17.45,102.48],[17.40,102.50],
    [17.35,102.52],[17.30,102.53],[17.25,102.52],[17.20,102.50],[17.15,102.48],
    [17.10,102.50],[17.05,102.48],[17.00,102.46],[16.95,102.45],[16.92,102.42],
    [16.90,102.38],[16.88,102.32],[16.90,102.25],[16.92,102.18],[16.95,102.12],
    [16.98,102.08],[17.02,102.02],[17.05,101.98],[17.10,101.95],[17.15,101.93],
    [17.20,101.92],[17.25,101.91],[17.30,101.90],[17.35,101.88],[17.40,101.87],
    [17.45,101.88],[17.50,101.90],[17.55,101.92],[17.60,101.95]
];

const DT = [
    { n:"อ.เมืองหนองบัวลำภู", la:17.204, ln:102.441 },
    { n:"อ.นากลาง", la:17.312, ln:102.195 },
    { n:"อ.นาวัง", la:17.371, ln:102.068 },
    { n:"อ.สุวรรณคูหา", la:17.548, ln:102.183 },
    { n:"อ.โนนสัง", la:17.062, ln:102.305 },
    { n:"อ.ศรีบุญเรือง", la:17.145, ln:102.195 }
];

/* GLOBAL STATE */
let L = {};
let rp = [];
let map;
let mk = {};

let aU = localStorage.getItem('aU') || '';
let rI = parseInt(localStorage.getItem('rI') || '30');

/* STATUS */
function gs(s, l) {
    if (l >= s.rd) return { t:'วิกฤติ', c:'r', f:'ธงแดง', e:'🔴', co:'var(--rd)' };
    if (l >= s.yl) return { t:'เฝ้าระวัง', c:'y', f:'ธงเหลือง', e:'🟡', co:'var(--yl)' };
    return { t:'ปกติ', c:'g', f:'ธงเขียว', e:'🟢', co:'var(--gn)' };
}

/* INIT LEVEL */
function iL() {
    D.forEach(s => {
        const b = s.gm - 2;
        const r = s.rd - b;
        L[s.id] = Math.round((b + Math.random() * r * .6) * 10) / 10;
    });
}

/* MAP INIT */
function iM() {
    map = L.map
        ? L.map
        : window.L.map('map', {
            center:[17.22,102.20],
            zoom:10,
            zoomControl:true,
            attributionControl:false
        });

    if (!map._leaflet_id) {
        map = window.L.map('map', {
            center:[17.22,102.20],
            zoom:10,
            zoomControl:true,
            attributionControl:false
        });
    }

    window.L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { maxZoom:16 }
    ).addTo(map);

    window.L.polygon(PB, {
        color:'#0288d1',
        weight:2.5,
        opacity:.5,
        fillColor:'#0288d1',
        fillOpacity:.04,
        dashArray:'10 5'
    }).addTo(map);

    dR();

    D.forEach(s => mM(s));

    map.fitBounds(
        window.L.latLngBounds(D.map(s => [s.la, s.ln])).pad(.2)
    );
}

/* MARKER */
function mM(s) {
    const lv = L[s.id];
    const x = gs(s, lv);
    const c = x.c;

    const ic = window.L.divIcon({
        html: `
            <div class="wm">
                <div class="wr ${c}"></div>
                <div class="wr2 ${c}"></div>
                <div class="wb ${c}">💧</div>
                <div class="wl">
                    <div class="n">${s.nm}</div>
                    <div class="v" style="color:${x.co}">
                        ${lv.toFixed(1)} ม.รทก.
                    </div>
                </div>
            </div>
        `,
        className:'',
        iconSize:[44,44],
        iconAnchor:[22,22]
    });

    if (mk[s.id]) map.removeLayer(mk[s.id]);

    mk[s.id] = window.L.marker([s.la, s.ln], { icon:ic }).addTo(map);
}

/* UPDATE KPI */
function uK() {
    let g=0, y=0, r=0;

    D.forEach(s => {
        const x = gs(s, L[s.id]);
        if (x.c === 'g') g++;
        else if (x.c === 'y') y++;
        else r++;
    });

    document.getElementById('k1').textContent = g;
    document.getElementById('k2').textContent = y;
    document.getElementById('k3').textContent = r;
}

/* CLOCK */
function uc() {
    document.getElementById('clk').textContent =
        new Date().toLocaleString('th-TH', {
            year:'numeric',
            month:'short',
            day:'numeric',
            hour:'2-digit',
            minute:'2-digit',
            second:'2-digit'
        });
}

/* INIT */
(function () {
    document.getElementById('fD').valueAsDate = new Date();

    if (aU) {
        document.getElementById('cU').value = aU;
        document.getElementById('cI').value = rI;
    }

    iL();
    iM();
    uK();
    uc();

    setInterval(uc, 1000);
})();
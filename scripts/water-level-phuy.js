const ST = [
    { id: 18, nm: "บ้านวังโปร่ง",  vl: "บ.วังโปร่ง",  ap: "ศรีบุญเรือง", tb: "โนนสะอาด", el: 212, rd: 212, yl: 211.5, gm: 211, ds: 9  },
    { id: 19, nm: "บ้านทุ่งโพธิ์", vl: "บ.ทุ่งโพธิ์",  ap: "ศรีบุญเรือง", tb: "โนนสะอาด", el: 197, rd: 197, yl: 196.5, gm: 196, ds: 11 },
    { id: 20, nm: "บ้านโคกล่าม",   vl: "บ.โคกล่าม",   ap: "ศรีบุญเรือง", tb: "นากอก",    el: 193, rd: 193, yl: 192.5, gm: 192, ds: 0  },
];


let LV = {};
ST.forEach(s => {
    const b = s.gm - 1.5, r = s.rd - b;
    LV[s.id] = Math.round((b + Math.random() * r * 0.6) * 100) / 100;
});


function gs2(s, l) {
    if (l >= s.rd) return { t: 'วิกฤติ', c: 'r', f: 'ธงแดง', cls: 'c', e: '🔴' };
    if (l >= s.yl) return { t: 'เฝ้าระวัง', c: 'y', f: 'ธงเหลือง', cls: 'w', e: '🟡' };
    return { t: 'ปกติ', c: 'g', f: 'ธงเขียว', cls: '', e: '🟢' };
}


function build() {
    const el = document.getElementById('sLayer');
    const sp = 550, sx = 350;
    let h = '';

    ST.forEach((s, i) => {
        const x = sx + i * sp, lv = LV[s.id], st = gs2(s, lv);

        const wp = Math.max(5, Math.min(82, ((lv - (s.gm - 3)) / (s.rd - s.gm + 4)) * 65 + 12));

        h += `<div class="gs" style="left:${x}px;bottom:255px">`;
        h += `<div class="gtop2">
                <div class="gbox lv ${st.cls}" data-label="ระดับน้ำ">${lv.toFixed(2)}</div>
                <div class="gbox el" data-label="ม.รทก.">${s.el}</div>
              </div>`;
        h += `<div class="ruler">`;
        
        for (let m = 0; m <= 10; m++) {
            const p = (1 - m / 10) * 100;
            h += `<div class="rmk mj" style="top:${p}%"></div>`;
            h += `<div class="rnum" style="top:calc(${p}% - 4px)">${m * 10}</div>`;
            if (m < 10) {
                for (let u = 1; u <= 4; u++) {
                    h += `<div class="rmk mn" style="top:${(1 - (m + u * 0.2) / 10) * 100}%"></div>`;
                }
            }
        }
        
        h += `<div class="wfill" style="height:${wp}%"></div><div class="wline" style="bottom:${wp}%"></div></div>`;
        h += `<div class="scard">
                <div class="sn">${s.nm}</div>
                <div class="sl">อ.${s.ap} ต.${s.tb}</div>
                <div class="sd">ระดับ <b style="color:${st.c === 'g' ? '#69f0ae' : st.c === 'y' ? '#ffd600' : '#ff5252'}">${lv.toFixed(2)}</b> ม.รทก.<br>
                ตลิ่ง <b style="color:#90caf9">${s.el}</b> ม.รทก.</div>
                <div class="ss ${st.c}">${st.e} ${st.f}</div>
              </div>`;
        
        if (s.dm) h += `<div class="dam"><div class="dam-shape"></div><div class="dam-lbl">${s.nm}</div></div>`;
        h += `</div>`;

        if (i < ST.length - 1) {
            const td = Math.max(1, Math.round(s.ds / 12));
            h += `<div class="dist-seg" style="left:${x + 75}px;bottom:128px;width:${sp - 110}px">
                    <div class="dist-line"></div>
                    <div class="dist-box">${s.ds} กม.</div>
                    <div class="dist-line"></div>
                  </div>`;
            h += `<div class="travel-tag" style="left:${x + sp / 2 - 20}px;bottom:148px">${td} วัน</div>`;
        }
    });

    h += `<div style="position:absolute;bottom:55px;left:100px;right:100px;display:flex;align-items:center;z-index:5">
            <div style="flex:1;height:1px;background:rgba(255,255,255,.1)"></div>
            <div style="padding:0 12px;font-size:10px;color:rgba(255,255,255,.3)">▲ ต้นน้ำ (${ST[0].el} ม.รทก.) ━━━ ระยะทางตามลำน้ำ ━━━ ปลายน้ำ (${ST[ST.length - 1].el} ม.รทก.) ▼</div>
            <div style="flex:1;height:1px;background:rgba(255,255,255,.1)"></div>
          </div>`;
    
    el.innerHTML = h;
}


function env() {

    const c = document.getElementById('clds');
    let ch = '';
    for (let i = 0; i < 25; i++) {
        ch += `<div class="cloud" style="width:${80 + Math.random() * 180}px;height:${25 + Math.random() * 50}px;left:${Math.random() * 100}%;top:${5 + Math.random() * 55}%"></div>`;
    }
    c.innerHTML = ch;


    const m = document.getElementById('mtns');
    let mh = '';
    const mc = ['#1b5e20', '#2e7d32', '#388e3c', '#33691e'];
    for (let i = 0; i < 22; i++) {
        const w = 180 + Math.random() * 350, ht = 50 + Math.random() * 90, x = i * 200 + Math.random() * 80;
        mh += `<div style="position:absolute;bottom:0;left:${x}px;width:0;height:0;border-left:${w / 2}px solid transparent;border-right:${w / 2}px solid transparent;border-bottom:${ht}px solid ${mc[i % 4]};opacity:${0.3 + Math.random() * 0.4}"></div>`;
    }
    m.innerHTML = mh;

 
    const g = document.getElementById('gr');
    let gh = '';
    for (let i = 0; i < 550; i++) {
        gh += `<div class="gblade" style="left:${i * 8}px;height:${4 + Math.random() * 7}px;background:linear-gradient(180deg,#81c784,#66bb6a);animation-delay:${Math.random() * 3}s"></div>`;
    }
    g.innerHTML = gh;

    const p = document.getElementById('rps');
    let ph = '';
    for (let i = 0; i < 50; i++) {
        const w = 2 + Math.random() * 3;
        ph += `<div class="rp" style="width:${w}px;height:${w}px;left:${Math.random() * 100}%;top:${10 + Math.random() * 80}%;animation-duration:${3 + Math.random() * 4}s;animation-delay:${Math.random() * 5}s"></div>`;
    }
    p.innerHTML = ph;
}

function kpi() {
    let g = 0, y = 0, r = 0;
    ST.forEach(s => {
        const x = gs2(s, LV[s.id]);
        if (x.c === 'g') g++; else if (x.c === 'y') y++; else r++;
    });
    document.getElementById('hG').textContent = g;
    document.getElementById('hY').textContent = y;
    document.getElementById('hR').textContent = r;
}

function dt() {
    document.getElementById('dtLbl').textContent = ST.length + ' สถานี | ' + new Date().toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function sim() {
    ST.forEach(s => {
        LV[s.id] = Math.round((LV[s.id] + (Math.random() - 0.48) * 0.12) * 100) / 100;
    });
    build();
    kpi();
}

document.getElementById('wrap').addEventListener('scroll', () => {
    const h = document.getElementById('hint');
    if (h) {
        h.style.opacity = '0';
        setTimeout(() => h.style.display = 'none', 500);
    }
}, { once: true });

env();
build();
kpi();
dt();

setInterval(sim, 15000);
setInterval(dt, 60000);
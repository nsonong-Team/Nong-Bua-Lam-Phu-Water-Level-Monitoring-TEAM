const ST = [
    {
        id: 11,
        nm: "คลองบุญทัน",
        vl: "บ.บุญทัน",
        ap: "สุวรรณคูหา",
        tb: "บุญทัน",
        el: 231,
        rd: 231,
        yl: 230.5,
        gm: 230,
        ds: 6
    },
    {
        id: 12,
        nm: "บ้านโคก",
        vl: "บ.โคก",
        ap: "สุวรรณคูหา",
        tb: "บ้านโคก",
        el: 218,
        rd: 218,
        yl: 217.5,
        gm: 217,
        ds: 13.6
    }
];

let LV = {};

ST.forEach(s => {
    const b = s.gm - 1.5;
    const r = s.rd - b;

    LV[s.id] = Math.round((b + Math.random() * r * 0.6) * 100) / 100;
});

function gs2(s, l) {
    if (l >= s.rd) {
        return {
            t: 'วิกฤติ',
            c: 'r',
            f: 'ธงแดง',
            cls: 'c',
            e: '🔴'
        };
    }

    if (l >= s.yl) {
        return {
            t: 'เฝ้าระวัง',
            c: 'y',
            f: 'ธงเหลือง',
            cls: 'w',
            e: '🟡'
        };
    }

    return {
        t: 'ปกติ',
        c: 'g',
        f: 'ธงเขียว',
        cls: '',
        e: '🟢'
    };
}

function build() {
    const el = document.getElementById('sLayer');
    let h = '';

    const positions = [
        { x: '28%' },
        { x: '65%' }
    ];

    ST.forEach((s, i) => {
        const lv = LV[s.id];
        const st = gs2(s, lv);

        const wp = Math.max(
            5,
            Math.min(82, ((lv - (s.gm - 3)) / (s.rd - s.gm + 4)) * 65 + 12)
        );

        h += `<div class="gs" style="left:${positions[i].x};bottom:255px;transform:translateX(-50%)">`;

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

        h += `
            <div class="wfill" style="height:${wp}%"></div>
            <div class="wline" style="bottom:${wp}%"></div>
        </div>`;

        h += `<div class="scard">
                <div class="sn">${s.nm}</div>
                <div class="sl">อ.${s.ap} ต.${s.tb}</div>
                <div class="sd">
                    ระดับ <b style="color:${
                        st.c === 'g'
                            ? '#69f0ae'
                            : st.c === 'y'
                            ? '#ffd600'
                            : '#ff5252'
                    }">${lv.toFixed(2)}</b> ม.รทก.<br>
                    สูง <b style="color:#9fa8da">${s.el}</b> ม.รทก.
                </div>
                <div class="ss ${st.c}">${st.e} ${st.f}</div>
              </div>
            </div>`;
    });

    // distance between
    h += `<div class="dist-seg" style="left:35%;bottom:128px;width:24%">
            <div class="dist-line"></div>
            <div class="dist-box">${ST[0].ds} กม.</div>
            <div class="dist-line"></div>
          </div>`;

    h += `<div style="position:absolute;bottom:55px;left:15%;right:15%;display:flex;align-items:center;z-index:5">
            <div style="flex:1;height:1px;background:rgba(255,255,255,.1)"></div>
            <div style="padding:0 12px;font-size:10px;color:rgba(255,255,255,.25)">
                ▲ ต้นน้ำ (${ST[0].el} ม.รทก.) ━━━ ปลายน้ำ (${ST[1].el} ม.รทก.) ▼
            </div>
            <div style="flex:1;height:1px;background:rgba(255,255,255,.1)"></div>
          </div>`;

    el.innerHTML = h;
}

function env() {
    const c = document.getElementById('clds');
    let ch = '';

    for (let i = 0; i < 20; i++) {
        ch += `<div class="cloud" style="
            width:${60 + Math.random() * 160}px;
            height:${20 + Math.random() * 40}px;
            left:${Math.random() * 100}%;
            top:${5 + Math.random() * 55}%"></div>`;
    }

    c.innerHTML = ch;

    const m = document.getElementById('mtns');
    let mh = '';

    const mc = ['#1a237e', '#283593', '#1b5e20', '#33691e'];

    for (let i = 0; i < 12; i++) {
        const w = 160 + Math.random() * 300;
        const ht = 40 + Math.random() * 80;
        const x = i * 180;

        mh += `<div style="
            position:absolute;
            bottom:0;
            left:${x}px;
            width:0;
            height:0;
            border-left:${w / 2}px solid transparent;
            border-right:${w / 2}px solid transparent;
            border-bottom:${ht}px solid ${mc[i % 4]};
            opacity:${0.25 + Math.random() * 0.35}"></div>`;
    }

    m.innerHTML = mh;

    const g = document.getElementById('gr');
    let gh = '';

    for (let i = 0; i < 300; i++) {
        gh += `<div class="gblade" style="
            left:${i * 6}px;
            height:${4 + Math.random() * 6}px;
            background:linear-gradient(180deg,#66bb6a,#43a047);
            animation-delay:${Math.random() * 3}s"></div>`;
    }

    g.innerHTML = gh;

    const p = document.getElementById('rps');
    let ph = '';

    for (let i = 0; i < 30; i++) {
        const w = 2 + Math.random() * 3;

        ph += `<div class="rp" style="
            width:${w}px;
            height:${w}px;
            left:${Math.random() * 100}%;
            top:${10 + Math.random() * 80}%;
            animation-duration:${3 + Math.random() * 4}s;
            animation-delay:${Math.random() * 5}s"></div>`;
    }

    p.innerHTML = ph;
}

function kpi() {
    let g = 0,
        y = 0,
        r = 0;

    ST.forEach(s => {
        const x = gs2(s, LV[s.id]);

        if (x.c === 'g') g++;
        else if (x.c === 'y') y++;
        else r++;
    });

    document.getElementById('hG').textContent = g;
    document.getElementById('hY').textContent = y;
    document.getElementById('hR').textContent = r;
}

function dt() {
    document.getElementById('dtLbl').textContent =
        '2 สถานี | ' +
        new Date().toLocaleString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
}

function sim() {
    ST.forEach(s => {
        LV[s.id] = Math.round((LV[s.id] + (Math.random() - 0.48) * 0.12) * 100) / 100;
    });

    build();
    kpi();
}

// INIT
env();
build();
kpi();
dt();

setInterval(sim, 15000);
setInterval(dt, 60000);
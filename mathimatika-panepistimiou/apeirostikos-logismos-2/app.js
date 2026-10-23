/* ================= Σχήματα ασκήσεων (SVG ως κείμενο) ================= */
const FIG = (() => {
  const INK = "#1f2a44", BLUE = "#2563eb", ACC = "#c2410c", MUT = "#94a3b8", PUR = "#7c3aed";
  const n2 = v => +v.toFixed(1);
  const txt = (x, y, s, o = {}) => `<text x="${n2(x)}" y="${n2(y)}" font-size="${o.fs || 15}" font-weight="${o.fw || 700}" fill="${o.c || INK}" text-anchor="${o.a || "middle"}" dominant-baseline="middle" font-family="Commissioner,system-ui,sans-serif"${o.it ? ' font-style="italic"' : ""}>${s}</text>`;
  const line = (p, q, o = {}) => `<line x1="${n2(p[0])}" y1="${n2(p[1])}" x2="${n2(q[0])}" y2="${n2(q[1])}" stroke="${o.c || INK}" stroke-width="${o.w || 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""} stroke-linecap="round"/>`;
  const dot = (p, c = INK, r = 3.2) => `<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${r}" fill="${c}"/>`;
  const wrap = (W, H, body, label) => `<svg class="fig" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label || "σχήμα"}" style="display:block;width:100%;max-width:${Math.min(W + 40, 360)}px;height:auto;margin:.6rem auto">${body}</svg>`;
  const arrowHead = (p, q, c, s = 10) => { const a = Math.atan2(q[1] - p[1], q[0] - p[0]); const L = [q[0] - s * Math.cos(a - 0.4), q[1] - s * Math.sin(a - 0.4)], R = [q[0] - s * Math.cos(a + 0.4), q[1] - s * Math.sin(a + 0.4)]; return `<path d="M${n2(q[0])},${n2(q[1])}L${n2(L[0])},${n2(L[1])}L${n2(R[0])},${n2(R[1])}Z" fill="${c}"/>`; };
  /* γωνία στην κορυφή V μεταξύ των σημείων P, Q (συντεταγμένες SVG) */
  function angMark(V, P, Q, label, o = {}) {
    let a1 = Math.atan2(P[1] - V[1], P[0] - V[0]), a2 = Math.atan2(Q[1] - V[1], Q[0] - V[0]);
    let d = a2 - a1; while (d <= -Math.PI) d += 2 * Math.PI; while (d > Math.PI) d -= 2 * Math.PI;
    const r = o.r || 20, s = [V[0] + r * Math.cos(a1), V[1] + r * Math.sin(a1)], e = [V[0] + r * Math.cos(a1 + d), V[1] + r * Math.sin(a1 + d)];
    const m = a1 + d / 2, R = o.lr || r + 14;
    let out = "";
    if (o.right) { const k = 12, u = [Math.cos(a1), Math.sin(a1)], w = [Math.cos(a1 + d), Math.sin(a1 + d)]; out += `<path d="M${n2(V[0] + k * u[0])},${n2(V[1] + k * u[1])}L${n2(V[0] + k * (u[0] + w[0]))},${n2(V[1] + k * (u[1] + w[1]))}L${n2(V[0] + k * w[0])},${n2(V[1] + k * w[1])}" fill="none" stroke="${o.c || ACC}" stroke-width="1.8"/>`; }
    else out += `<path d="M${n2(s[0])},${n2(s[1])}A${r},${r} 0 0 ${d > 0 ? 1 : 0} ${n2(e[0])},${n2(e[1])}" fill="none" stroke="${o.c || ACC}" stroke-width="2"/>`;
    if (label) out += txt(V[0] + R * Math.cos(m), V[1] + R * Math.sin(m), label, { c: o.c || ACC, fs: o.fs || 14 });
    return out;
  }
  /* ---- Κύκλος: σημεία με γωνία (μοίρες), r = 1 ---- */
  function circ(o) {
    const W = o.W || 300, H = o.H || 250, cx = o.cx || W / 2, cy = o.cy || H / 2, R = o.R || 92;
    const P = {}; const mp = (x, y) => [cx + R * x, cy - R * y];
    if (o.center !== false) P[o.center || "O"] = mp(0, 0);
    for (const k in (o.pts || {})) { const t = o.pts[k] * Math.PI / 180; P[k] = mp(Math.cos(t), Math.sin(t)); }
    for (const k in (o.ext || {})) P[k] = mp(...o.ext[k]);
    let b = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${BLUE}" stroke-width="2.2"/>`;
    for (const t of (o.tan || [])) { const th = t[0] * Math.PI / 180, p = [Math.cos(th), Math.sin(th)], d = [-Math.sin(th), Math.cos(th)], L = t[1] || 1.25; b += line(mp(p[0] + L * d[0], p[1] + L * d[1]), mp(p[0] - L * d[0], p[1] - L * d[1]), { c: PUR, w: 2 }); if (t[2]) { const q = mp(p[0] + (L + 0.12) * d[0], p[1] + (L + 0.12) * d[1]); b += txt(q[0], q[1], t[2], { c: PUR, it: 1 }); } }
    for (const a of (o.arcs || [])) { const t1 = o.pts[a[0]], t2 = o.pts[a[1]] < t1 ? o.pts[a[1]] + 360 : o.pts[a[1]], m = (t1 + t2) / 2 * Math.PI / 180, q = mp(1.2 * Math.cos(m), 1.2 * Math.sin(m)); b += txt(q[0], q[1], a[2], { c: BLUE, fs: 13 }); }
    for (const s of (o.segs || [])) b += line(P[s[0]], P[s[1]], s[2] ? { dash: "5 4", c: MUT } : {});
    for (const a of (o.ang || [])) b += angMark(P[a[1]], P[a[0]], P[a[2]], a[3], { right: a[4] === "R", r: a[0] === "O" || a[1] === "O" ? 18 : 20 });
    for (const k in P) {
      if (o.ext && k in o.ext && !(o.extShow || []).includes(k)) continue;
      b += dot(P[k]);
      let lx, ly; const dx = P[k][0] - cx, dy = P[k][1] - cy, L = Math.hypot(dx, dy);
      if (o.lab && o.lab[k]) { lx = P[k][0] + o.lab[k][0]; ly = P[k][1] + o.lab[k][1]; }
      else if (L < 2) { lx = P[k][0] - 12; ly = P[k][1] - 12; }
      else { lx = P[k][0] + 15 * dx / L; ly = P[k][1] + 15 * dy / L; }
      b += txt(lx, ly, k);
    }
    return wrap(W, H, b, o.alt);
  }
  /* ---- Ευθύγραμμα σχήματα: σημεία σε δικές τους μονάδες, αυτόματη κλίμακα ---- */
  function poly(o) {
    const ks = Object.keys(o.pts), xs = ks.map(k => o.pts[k][0]), ys = ks.map(k => o.pts[k][1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const Wmax = o.W || 300, Hmax = o.Hmax || 230, pad = o.lines ? 48 : 30, s = Math.min((Wmax - 2 * pad) / Math.max(x1 - x0, 1e-9), (Hmax - 2 * pad) / Math.max(y1 - y0, 1e-9));
    const W = Math.max(160, (x1 - x0) * s + 2 * pad), H = (y1 - y0) * s + 2 * pad;
    const mp = p => [pad + (p[0] - x0) * s + (W - ((x1 - x0) * s + 2 * pad)) / 2, H - pad - (p[1] - y0) * s];
    const P = {}; for (const k of ks) P[k] = mp(o.pts[k]);
    const gx = xs.reduce((u, v) => u + v, 0) / ks.length, gy = ys.reduce((u, v) => u + v, 0) / ks.length, G = mp([gx, gy]);
    let b = "";
    for (const l of (o.lines || [])) { const p = P[l[0]], q = P[l[1]], dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), e = l[3] || 22; const A = [p[0] - e * dx / L, p[1] - e * dy / L], B = [q[0] + e * dx / L, q[1] + e * dy / L]; b += line(A, B, { c: l[4] || PUR, w: 1.8 }); if (l[2]) b += txt(B[0] + 4 * dx / L, B[1] + 4 * dy / L - 10, l[2], { c: l[4] || PUR, it: 1, fs: 13 }); }
    if (o.fill) b += `<polygon points="${o.fill.map(k => P[k].map(n2).join(",")).join(" ")}" fill="#dbeafe" stroke="none"/>`;
    for (const sg of (o.segs || [])) b += line(P[sg[0]], P[sg[1]], sg[2] ? { dash: "5 4", c: MUT } : {});
    for (const a of (o.arrows || [])) { b += line(P[a[0]], P[a[1]], { c: a[2] || BLUE, w: 2.4 }); b += arrowHead(P[a[0]], P[a[1]], a[2] || BLUE); if (a[3]) { const m = [(P[a[0]][0] + P[a[1]][0]) / 2, (P[a[0]][1] + P[a[1]][1]) / 2], dx = P[a[1]][0] - P[a[0]][0], dy = P[a[1]][1] - P[a[0]][1], L = Math.hypot(dx, dy); b += txt(m[0] - 14 * dy / L, m[1] + 14 * dx / L, a[3], { c: a[2] || BLUE, it: 1 }); } }
    for (const l of (o.slab || [])) { const p = P[l[0]], q = P[l[1]], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy); let nx = -dy / L, ny = dx / L; if ((m[0] - G[0]) * nx + (m[1] - G[1]) * ny < 0) { nx = -nx; ny = -ny; } const k = l[3] ? -1 : 1; b += txt(m[0] + k * 15 * nx, m[1] + k * 15 * ny, l[2], { c: BLUE, fs: 13.5 }); }
    for (const a of (o.ang || [])) b += angMark(P[a[1]], P[a[0]], P[a[2]], a[3], { right: a[4] === "R", r: 18 });
    for (const k of ks) {
      if (o.nodot && o.nodot.includes(k)) continue;
      b += dot(P[k]);
      const off = o.lab && o.lab[k]; let lx, ly;
      if (off) { lx = P[k][0] + off[0]; ly = P[k][1] + off[1]; } else { const dx = P[k][0] - G[0], dy = P[k][1] - G[1], L = Math.hypot(dx, dy) || 1; lx = P[k][0] + 14 * dx / L; ly = P[k][1] + 14 * dy / L; }
      b += txt(lx, ly, k);
    }
    return wrap(W, H, b, o.alt);
  }
  /* ---- Ορθοκανονικό σύστημα με σημείο στην τελική πλευρά γωνίας ---- */
  function axes(o) {
    const W = 260, H = 220, cx = 130, cy = 110, m = o.m || Math.max(Math.abs(o.pt[0]), Math.abs(o.pt[1]), 1), s = 80 / m;
    const mp = p => [cx + p[0] * s, cy - p[1] * s], A = mp(o.pt);
    let b = line([12, cy], [W - 12, cy], { c: MUT, w: 1.5 }) + line([cx, 10], [cx, H - 10], { c: MUT, w: 1.5 });
    b += arrowHead([12, cy], [W - 8, cy], MUT, 8) + arrowHead([cx, H - 10], [cx, 6], MUT, 8) + txt(W - 10, cy + 13, "x", { fs: 13, it: 1, c: MUT }) + txt(cx + 11, 12, "y", { fs: 13, it: 1, c: MUT });
    const th = Math.atan2(o.pt[1], o.pt[0]), Lx = 95;
    b += line([cx, cy], [cx + Lx * Math.cos(th) * 1.1, cy - Lx * Math.sin(th) * 1.1], { c: BLUE, w: 2.4 });
    if (o.drop !== false) b += line(A, [A[0], cy], { dash: "4 4", c: MUT, w: 1.5 });
    let t0 = 0, t1 = th < 0 && !o.neg ? th + 2 * Math.PI : th; const r = 20, steps = 40; let d = "";
    for (let i = 0; i <= steps; i++) { const t = t0 + (t1 - t0) * i / steps; d += (i ? "L" : "M") + n2(cx + r * Math.cos(t)) + "," + n2(cy - r * Math.sin(t)); }
    b += `<path d="${d}" fill="none" stroke="${ACC}" stroke-width="2"/>` + txt(cx + 34 * Math.cos((t0 + t1) / 2), cy - 34 * Math.sin((t0 + t1) / 2), o.ang || "θ", { c: ACC, it: 1 });
    b += dot(A, BLUE, 4) + txt(A[0] + (o.pt[0] >= 0 ? 8 : -8), A[1] + (o.pt[1] >= 0 ? -12 : 14), o.lab, { a: o.pt[0] >= 0 ? "start" : "end", fs: 13.5 });
    b += txt(cx - 10, cy + 12, "O", { fs: 13 });
    return wrap(W, H, b, o.alt);
  }
  return { circ, poly, axes };
})();

/* ================= GR: στατικά γραφήματα συναρτήσεων (SVG ως κείμενο) για τη θεωρία =================
   GR.plot({ x:[xmin,xmax], y:[ymin,ymax], w:520, h:300,
             fns:[{ f:x=>…, c:"blue"|"purple"|"green"|"amber"|"red"|"ink"|"#hex", w:2.6, dash:"6 5",
                    dom:[a,b], label:"y=f(x)", lx:x, holes:[x…], dots:[x…] }],
             shade:[{ f, g:x=>0, a, b, c:"blue", op:.18 }],          // περιοχή μεταξύ f και g
             pts:[{ x, y, label, open:true, c, pos:"ne"|"nw"|"se"|"sw"|"n"|"s"|"e"|"w" }],
             segs:[{ p:[x1,y1], q:[x2,y2], c, dash, w, arrow:true }],
             vl:[{ x, c, dash, label }], hl:[{ y, c, dash, label }],
             tan:[{ f, x0, len:2, c }],                               // εφαπτομένη
             rects:[{ x, w, y0:0, y1, c, op }],                       // ορθογώνια Riemann κ.λπ.
             labels:[{ x, y, t, c, fs, a }],
             grid:true, ticks:true, xlab:"x", ylab:"y", caption:"…" })
   GR.thumb(f, [xmin,xmax], [ymin,ymax], c) → μικρό εικονίδιο 96×56 για τις κάρτες ενοτήτων.            */
const GR = (() => {
  const COL = { blue: "#0F6FD1", purple: "#6F42C1", green: "#198754", amber: "#C77A0A", red: "#DC3545", ink: "#15233f", navy: "#1B2A4A", muted: "#94a3b8", teal: "#0d9488", pink: "#db2777" };
  const col = c => COL[c] || c || COL.blue;
  const r1 = v => Math.round(v * 10) / 10;
  const fmt = v => { const s = Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : String(+v.toFixed(2)); return s.replace("-", "−").replace(".", ","); };
  function niceStep(span, n) { const raw = span / n, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p; }
  function txt(x, y, s, o = {}) { return `<text x="${r1(x)}" y="${r1(y)}" font-size="${o.fs || 13}" font-weight="${o.fw || 700}" fill="${col(o.c || "ink")}" text-anchor="${o.a || "middle"}" dominant-baseline="middle" font-family="Commissioner,system-ui,sans-serif"${o.it ? ' font-style="italic"' : ""}${o.halo === false ? "" : ' paint-order="stroke" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"'}>${s}</text>`; }
  function head(p, q, c, s = 9) { const a = Math.atan2(q[1] - p[1], q[0] - p[0]); const L = [q[0] - s * Math.cos(a - 0.42), q[1] - s * Math.sin(a - 0.42)], R = [q[0] - s * Math.cos(a + 0.42), q[1] - s * Math.sin(a + 0.42)]; return `<path d="M${r1(q[0])},${r1(q[1])}L${r1(L[0])},${r1(L[1])}L${r1(R[0])},${r1(R[1])}Z" fill="${c}"/>`; }
  function plot(o) {
    const W = o.w || 520, H = o.h || 300, pad = { l: 34, r: 16, t: 14, b: 26 };
    const [x0, x1] = o.x || [-5, 5], [y0, y1] = o.y || [-4, 4];
    const sx = x => pad.l + (x - x0) / (x1 - x0) * (W - pad.l - pad.r), sy = y => H - pad.b - (y - y0) / (y1 - y0) * (H - pad.t - pad.b);
    let s = `<rect x="0" y="0" width="${W}" height="${H}" rx="12" fill="#fff"/>`;
    const id = "c" + Math.random().toString(36).slice(2, 8);
    s += `<defs><clipPath id="${id}"><rect x="${pad.l}" y="${pad.t}" width="${W - pad.l - pad.r}" height="${H - pad.t - pad.b}"/></clipPath></defs>`;
    const xs = o.xstep || niceStep(x1 - x0, 8), ys = o.ystep || niceStep(y1 - y0, 6);
    if (o.grid !== false) {
      for (let x = Math.ceil(x0 / xs) * xs; x <= x1 + 1e-9; x += xs) s += `<line x1="${r1(sx(x))}" y1="${pad.t}" x2="${r1(sx(x))}" y2="${H - pad.b}" stroke="#e8edf5" stroke-width="1"/>`;
      for (let y = Math.ceil(y0 / ys) * ys; y <= y1 + 1e-9; y += ys) s += `<line x1="${pad.l}" y1="${r1(sy(y))}" x2="${W - pad.r}" y2="${r1(sy(y))}" stroke="#e8edf5" stroke-width="1"/>`;
    }
    const ax = Math.min(Math.max(0, y0), y1), ay = Math.min(Math.max(0, x0), x1);
    s += `<line x1="${pad.l}" y1="${r1(sy(ax))}" x2="${W - pad.r}" y2="${r1(sy(ax))}" stroke="#334155" stroke-width="1.4"/>` + head([W - pad.r - 10, sy(ax)], [W - pad.r + 2, sy(ax)], "#334155", 7);
    s += `<line x1="${r1(sx(ay))}" y1="${H - pad.b}" x2="${r1(sx(ay))}" y2="${pad.t}" stroke="#334155" stroke-width="1.4"/>` + head([sx(ay), pad.t + 10], [sx(ay), pad.t - 2], "#334155", 7);
    s += txt(W - pad.r - 4, sy(ax) - 11, o.xlab || "x", { it: true, c: "ink", fs: 13, a: "end" }) + txt(sx(ay) + 10, pad.t + 4, o.ylab || "y", { it: true, fs: 13, a: "start" });
    if (o.ticks !== false) {
      for (let x = Math.ceil(x0 / xs) * xs; x <= x1 + 1e-9; x += xs) if (Math.abs(x) > 1e-9) s += txt(sx(x), Math.min(sy(ax) + 13, H - 8), fmt(x), { fs: 10.5, fw: 600, c: "#64748b" });
      for (let y = Math.ceil(y0 / ys) * ys; y <= y1 + 1e-9; y += ys) if (Math.abs(y) > 1e-9) s += txt(Math.max(sx(ay) - 6, 14), sy(y), fmt(y), { fs: 10.5, fw: 600, c: "#64748b", a: "end" });
    }
    let body = "";
    for (const sh of o.shade || []) {
      const g = sh.g || (() => 0), N = 120; let d = "";
      for (let i = 0; i <= N; i++) { const x = sh.a + (sh.b - sh.a) * i / N; d += (i ? "L" : "M") + r1(sx(x)) + "," + r1(sy(sh.f(x))); }
      for (let i = N; i >= 0; i--) { const x = sh.a + (sh.b - sh.a) * i / N; d += "L" + r1(sx(x)) + "," + r1(sy(g(x))); }
      body += `<path d="${d}Z" fill="${col(sh.c)}" fill-opacity="${sh.op || 0.18}"/>`;
    }
    for (const rc of o.rects || []) { const ya = sy(rc.y0 || 0), yb = sy(rc.y1); body += `<rect x="${r1(sx(rc.x))}" y="${r1(Math.min(ya, yb))}" width="${r1(sx(rc.x + rc.w) - sx(rc.x))}" height="${r1(Math.abs(ya - yb))}" fill="${col(rc.c || "amber")}" fill-opacity="${rc.op || 0.25}" stroke="${col(rc.c || "amber")}" stroke-width="1"/>`; }
    for (const v of o.vl || []) { body += `<line x1="${r1(sx(v.x))}" y1="${pad.t}" x2="${r1(sx(v.x))}" y2="${H - pad.b}" stroke="${col(v.c || "muted")}" stroke-width="${v.w || 1.6}" stroke-dasharray="${v.dash || "5 4"}"/>`; if (v.label) body += txt(sx(v.x) + 4, pad.t + 10, v.label, { a: "start", c: v.c || "muted", fs: 12 }); }
    for (const v of o.hl || []) { body += `<line x1="${pad.l}" y1="${r1(sy(v.y))}" x2="${W - pad.r}" y2="${r1(sy(v.y))}" stroke="${col(v.c || "muted")}" stroke-width="${v.w || 1.6}" stroke-dasharray="${v.dash || "5 4"}"/>`; if (v.label) body += txt(W - pad.r - 4, sy(v.y) - 10, v.label, { a: "end", c: v.c || "muted", fs: 12 }); }
    for (const fn of o.fns || []) {
      const [a, b] = fn.dom || [x0, x1], N = fn.n || 400; let d = "", pen = false, prev = null;
      const holes = fn.holes || [];
      for (let i = 0; i <= N; i++) {
        const x = a + (b - a) * i / N; let y; try { y = fn.f(x); } catch (e) { y = NaN; }
        const nearHole = holes.some(hx => Math.abs(x - hx) < (b - a) / N * 0.6);
        if (!isFinite(y) || nearHole || Math.abs(y) > 1e6 || (prev !== null && Math.abs(y - prev) > (y1 - y0) * 1.5)) { pen = false; prev = isFinite(y) ? y : null; continue; }
        const yy = Math.max(y0 - (y1 - y0), Math.min(y1 + (y1 - y0), y));
        d += (pen ? "L" : "M") + r1(sx(x)) + "," + r1(sy(yy)); pen = true; prev = y;
      }
      body += `<path d="${d}" fill="none" stroke="${col(fn.c)}" stroke-width="${fn.w || 2.6}" stroke-linejoin="round" stroke-linecap="round"${fn.dash ? ` stroke-dasharray="${fn.dash}"` : ""}/>`;
      for (const hx of holes) { const hy = fn.f(hx + 1e-7); if (isFinite(hy)) body += `<circle cx="${r1(sx(hx))}" cy="${r1(sy(hy))}" r="4.2" fill="#fff" stroke="${col(fn.c)}" stroke-width="2"/>`; }
      for (const dx of fn.dots || []) body += `<circle cx="${r1(sx(dx))}" cy="${r1(sy(fn.f(dx)))}" r="4.2" fill="${col(fn.c)}"/>`;
      if (fn.label) { const lx = fn.lx !== undefined ? fn.lx : a + (b - a) * 0.82, ly = fn.f(lx); if (isFinite(ly)) body += txt(sx(lx) + (fn.ldx || 0), sy(ly) + (fn.ldy !== undefined ? fn.ldy : -14), fn.label, { c: fn.c, it: true, fs: 13.5 }); }
    }
    for (const t of o.tan || []) {
      const hh = 1e-5, m = (t.f(t.x0 + hh) - t.f(t.x0 - hh)) / (2 * hh), yv = t.f(t.x0), L = t.len || 2;
      body += `<line x1="${r1(sx(t.x0 - L))}" y1="${r1(sy(yv - m * L))}" x2="${r1(sx(t.x0 + L))}" y2="${r1(sy(yv + m * L))}" stroke="${col(t.c || "amber")}" stroke-width="2.2"${t.dash ? ` stroke-dasharray="${t.dash}"` : ""}/>`;
    }
    for (const g of o.segs || []) { body += `<line x1="${r1(sx(g.p[0]))}" y1="${r1(sy(g.p[1]))}" x2="${r1(sx(g.q[0]))}" y2="${r1(sy(g.q[1]))}" stroke="${col(g.c || "ink")}" stroke-width="${g.w || 2}"${g.dash ? ` stroke-dasharray="${g.dash}"` : ""} stroke-linecap="round"/>`; if (g.arrow) body += head([sx(g.p[0]), sy(g.p[1])], [sx(g.q[0]), sy(g.q[1])], col(g.c || "ink")); }
    s += `<g clip-path="url(#${id})">${body}</g>`;
    const OFF = { n: [0, -14, "middle"], s: [0, 16, "middle"], e: [9, 0, "start"], w: [-9, 0, "end"], ne: [8, -12, "start"], nw: [-8, -12, "end"], se: [8, 13, "start"], sw: [-8, 13, "end"] };
    for (const p of o.pts || []) {
      const X = sx(p.x), Y = sy(p.y), c = col(p.c || "ink");
      s += p.open ? `<circle cx="${r1(X)}" cy="${r1(Y)}" r="4.4" fill="#fff" stroke="${c}" stroke-width="2.2"/>` : `<circle cx="${r1(X)}" cy="${r1(Y)}" r="4.4" fill="${c}"/>`;
      if (p.label) { const [dx, dy, a] = OFF[p.pos || "ne"]; s += txt(X + dx, Y + dy, p.label, { c: p.c || "ink", a, fs: 12.5 }); }
    }
    for (const l of o.labels || []) s += txt(sx(l.x), sy(l.y), l.t, { c: l.c || "ink", fs: l.fs || 13, a: l.a || "middle", it: l.it });
    const cap = o.caption ? `<figcaption>${o.caption}</figcaption>` : "";
    return `<figure class="grfig"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${(o.alt || o.caption || "γράφημα").replace(/<[^>]+>/g, "")}">${s}</svg>${cap}</figure>`;
  }
  function thumb(f, xr = [-3, 3], yr = [-2, 2], c = "blue") {
    const W = 96, H = 56, sx = x => (x - xr[0]) / (xr[1] - xr[0]) * W, sy = y => H - (y - yr[0]) / (yr[1] - yr[0]) * H;
    let d = "", pen = false;
    for (let i = 0; i <= 120; i++) { const x = xr[0] + (xr[1] - xr[0]) * i / 120, y = f(x); if (!isFinite(y) || y < yr[0] - 5 || y > yr[1] + 5) { pen = false; continue; } d += (pen ? "L" : "M") + r1(sx(x)) + "," + r1(sy(y)); pen = true; }
    const ax = sy(Math.min(Math.max(0, yr[0]), yr[1])), ay = sx(Math.min(Math.max(0, xr[0]), xr[1]));
    return `<svg class="thumb" viewBox="0 0 ${W} ${H}" aria-hidden="true"><line x1="0" y1="${r1(ax)}" x2="${W}" y2="${r1(ax)}" stroke="#cbd5e1" stroke-width="1"/><line x1="${r1(ay)}" y1="0" x2="${r1(ay)}" y2="${H}" stroke="#cbd5e1" stroke-width="1"/><path d="${d}" fill="none" stroke="${col(c)}" stroke-width="2.4" stroke-linecap="round"/></svg>`;
  }
  return { plot, thumb, col };
})();

/* ================= Κοινά βοηθήματα Α΄ Λυκείου ================= */
const gq = deg => { let d = ((deg % 360) + 360) % 360; if (d === 0 || d === 90 || d === 180 || d === 270) return 0; return d < 90 ? 1 : d < 180 ? 2 : d < 270 ? 3 : 4; };
const gRad = d => d * Math.PI / 180;
function gPlot(container, cx, cy, half, H = 330, grid = true) {
  const P = makePlot(container, { xmin: cx - half, xmax: cx + half, ymin: cy - half * H / 560, ymax: cy + half * H / 560, H, W: 560, xstep: niceStep(2 * half), ystep: niceStep(2 * half) });
  if (!grid) P.svg.classList.add("nogrid");
  return P;
}
function gCircle(P, x, y, r, st = "stroke:var(--blue);stroke-width:2.4;fill:none") { return P.layer.appendChild(svgEl("ellipse", { cx: P.sx(x), cy: P.sy(y), rx: Math.abs(P.sx(x + r) - P.sx(x)), ry: Math.abs(P.sy(y + r) - P.sy(y)), style: st })); }
function gLine(P, x1, y1, x2, y2, st = "stroke:var(--ink);stroke-width:2") { return P.top.appendChild(svgEl("line", { x1: P.sx(x1), y1: P.sy(y1), x2: P.sx(x2), y2: P.sy(y2), style: st + ";stroke-linecap:round" })); }
function gText(P, x, y, s, st = "fill:var(--ink)", anchor = "middle") { const t = svgEl("text", { x: P.sx(x), y: P.sy(y), "text-anchor": anchor, "dominant-baseline": "middle", style: st + ";font-weight:800;font-size:14px;font-family:var(--sans)" }); t.textContent = s; P.top.appendChild(t); return t; }
function gArrow(P, x1, y1, x2, y2, col = "var(--blue)", w = 3) {
  gLine(P, x1, y1, x2, y2, `stroke:${col};stroke-width:${w}`);
  const X1 = P.sx(x1), Y1 = P.sy(y1), X2 = P.sx(x2), Y2 = P.sy(y2), a = Math.atan2(Y2 - Y1, X2 - X1), s = 12;
  if (Math.hypot(X2 - X1, Y2 - Y1) < 4) return;
  P.top.appendChild(svgEl("path", { d: `M${X2},${Y2}L${X2 - s * Math.cos(a - 0.4)},${Y2 - s * Math.sin(a - 0.4)}L${X2 - s * Math.cos(a + 0.4)},${Y2 - s * Math.sin(a + 0.4)}Z`, style: `fill:${col}` }));
}
/* τόξο γωνίας με κορυφή (vx,vy) από γωνία a1 έως a2 (μοίρες, θετική φορά) */
function gArc(P, vx, vy, a1, a2, r, col = "var(--amber)", label, lr) {
  let d = ""; const n = 40;
  for (let i = 0; i <= n; i++) { const t = gRad(a1 + (a2 - a1) * i / n); d += (i ? "L" : "M") + P.sx(vx + r * Math.cos(t)).toFixed(1) + "," + P.sy(vy + r * Math.sin(t)).toFixed(1); }
  P.top.appendChild(svgEl("path", { d, style: `fill:none;stroke:${col};stroke-width:2.4` }));
  if (label) { const m = gRad((a1 + a2) / 2), R = lr || r * 1.75; gText(P, vx + R * Math.cos(m), vy + R * Math.sin(m), label, `fill:${col}`); }
}
const gAng = (vx, vy, x, y) => Math.atan2(y - vy, x - vx) * 180 / Math.PI;
/* γωνία στην κορυφή V από ακτίνα VP σε ακτίνα VQ (η μικρή) */
function gAngMark(P, V, A, B, r, col, label) {
  let a1 = gAng(V[0], V[1], A[0], A[1]), a2 = gAng(V[0], V[1], B[0], B[1]); let d = a2 - a1;
  while (d <= -180) d += 360; while (d > 180) d -= 360;
  if (d < 0) { [a1, a2] = [a2, a1]; d = -d; } else a2 = a1 + d;
  gArc(P, V[0], V[1], a1, a1 + d, r, col, label);
  return d;
}
const pw = v => (v < 0 ? "(" + v + ")" : v) + "²";
const gDeg = v => fmt(v) + "°";
const onDeg = (t) => [Math.cos(gRad(t)), Math.sin(gRad(t))];
function sqrtForm(n) { /* √n σε απλή μορφή κ√μ */ let k = 1, m = n; for (let d = 2; d * d <= m; d++) while (m % (d * d) === 0) { m /= d * d; k *= d; } return m === 1 ? String(k) : (k === 1 ? "" : k) + "√" + m; }
function gcdI(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; }
function fracStr(p, q) { if (q < 0) { p = -p; q = -q; } const g = gcdI(p, q); p /= g; q /= g; return q === 1 ? String(p) : (p < 0 ? "−" : "") + Math.abs(p) + "/" + q; }

function fracS2(p, q) { if (q < 0) { p = -p; q = -q; } const g = gcdI(p, q); p /= g; q /= g; return q === 1 ? String(p) : p + "/" + q; }
function texFrac(p, q) { if (q < 0) { p = -p; q = -q; } const g = gcdI(p, q); p /= g; q /= g; return q === 1 ? String(p) : (p < 0 ? "-" : "") + R`\frac{${Math.abs(p)}}{${q}}`; }

const R = String.raw;
const CONFIG = {
  storeKey: "pagk-μας013-v1",
  heroTitle: "Απειροστικός Λογισμός ΙΙ (ΜΑΣ013)",
  tefxos: "μαθήματος ΜΑΣ013",
  howto: `<ul><li>Αριθμοί: <code>12</code> · κλάσματα: <code>3/4</code> ή <code>-5/6</code> · δεκαδικοί: <code>2,5</code></li>
    <li>Πολλά πεδία; Γράψε κάθε απάντηση στο δικό της πεδίο, με τη σειρά που ζητείται.</li>
    <li>Υλικό για το αντίστοιχο μάθημα 1ου έτους (Πανεπιστήμιο Κύπρου).</li></ul>`
};

const UNITS = [
  { id: 1, title: "Κεφ. 1 · Ακολουθίες" },
  { id: 2, title: "Κεφ. 2 · Σειρές" },
  { id: 3, title: "Κεφ. 3 · Δυναμοσειρές – Taylor" },
  { id: 4, title: "Κεφ. 4 · Παραμετρικές καμπύλες – Πολικές συντεταγμένες" },
  { id: 5, title: "Κεφ. 5 · Συναρτήσεις πολλών μεταβλητών" },
  { id: 6, title: "Κεφ. 6 · Πολλαπλά ολοκληρώματα" }
];

const SECTIONS = [
/* ───────────────────────────── 1.1 ───────────────────────────── */
{
  id: "1.1", unit: 1, title: "Ακολουθίες πραγματικών αριθμών – Όριο ακολουθίας",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 1 · Βλ. και Stewart, Απειροστικός Λογισμός, §11.1",
  theory: R`
<div class="tbox"><h4>Ακολουθία και όριο</h4>
<p>Ακολουθία είναι μια συνάρτηση $a: \mathbb N \to \mathbb R$, $n \mapsto a_n$. Λέμε ότι η $(a_n)$ <b>συγκλίνει</b> στο $L \in \mathbb R$ και γράφουμε $\lim_{n\to\infty} a_n = L$ ή $a_n \to L$, αν
$$\forall \varepsilon > 0\ \ \exists N \in \mathbb N:\ \ n \ge N \Rightarrow |a_n - L| < \varepsilon.$$
Δηλαδή από κάποιον όρο και μετά, <b>όλοι</b> οι όροι βρίσκονται στη ζώνη $(L - \varepsilon, L + \varepsilon)$, όσο στενή κι αν είναι. Αν δεν υπάρχει τέτοιο $L$, η ακολουθία <b>αποκλίνει</b> (π.χ. $a_n \to +\infty$ ή ταλαντεύεται, όπως η $(-1)^n$).</p></div>
<div class="tbox"><h4>Βασικές ιδιότητες</h4>
<ul><li>Το όριο, αν υπάρχει, είναι <b>μοναδικό</b>· κάθε συγκλίνουσα ακολουθία είναι <b>φραγμένη</b>.</li>
<li>Αν $a_n \to a$, $b_n \to b$: $a_n \pm b_n \to a \pm b$, $a_nb_n \to ab$, $\frac{a_n}{b_n} \to \frac ab$ (όταν $b \ne 0$).</li>
<li>Αν $\lim_{x\to\infty} f(x) = L$ και $a_n = f(n)$, τότε $a_n \to L$ (έτσι μπορούμε να χρησιμοποιούμε και de l'Hôpital στη συνάρτηση $f$).</li>
<li><b>Κριτήριο παρεμβολής:</b> αν $b_n \le a_n \le c_n$ για $n \ge n_0$ και $b_n \to L$, $c_n \to L$, τότε $a_n \to L$. Συνέπεια: αν $|a_n| \to 0$ τότε $a_n \to 0$.</li></ul></div>
<div class="tbox tip"><h4>Χρήσιμα όρια</h4>
<p>$\frac{1}{n^p} \to 0$ ($p > 0$) · $q^n \to 0$ για $|q| < 1$ · $\sqrt[n]{a} \to 1$ ($a > 0$) · $\sqrt[n]{n} \to 1$ · $\frac{\ln n}{n} \to 0$ · $\frac{a^n}{n!} \to 0$.<br>
Λόγος πολυωνύμων: διαιρούμε με τη μεγαλύτερη δύναμη του παρονομαστή — ίδιοι βαθμοί δίνουν τον λόγο των μεγιστοβάθμιων συντελεστών.</p></div>
<div class="tbox warn"><h4>Παράδειγμα και παγίδα</h4>
<p>$\lim(\sqrt{n^2 + 3n} - n) = \lim \frac{3n}{\sqrt{n^2 + 3n} + n} = \lim \frac{3}{\sqrt{1 + 3/n} + 1} = \frac32$ (πολλαπλασιάζουμε με τη συζυγή παράσταση· η μορφή $\infty - \infty$ <b>δεν</b> είναι $0$).<br>
Η $\frac{\sin n}{n}$: $-\frac1n \le \frac{\sin n}{n} \le \frac1n$, άρα τείνει στο $0$ — ενώ η $\sin n$ μόνη της δεν συγκλίνει.</p></div>`,
  widget: "m2aseqw",
  gen: "m2aseq",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε το $\lim_{n\to\infty} \dfrac{3n^2 - n + 2}{5n^2 + 4}$.`, fields: [{ label: "όριο =", ans: "3/5" }],
      hint: R`Διαιρέστε με $n^2$.`, sol: R`$\dfrac{3 - \frac1n + \frac{2}{n^2}}{5 + \frac{4}{n^2}} \to \dfrac35$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το $\lim_{n\to\infty} \dfrac{2n + 1}{n^2 + 3}$.`, fields: [{ label: "όριο =", ans: 0 }],
      hint: R`Μεγαλύτερος βαθμός στον παρονομαστή.`, sol: R`Διαιρώντας με $n^2$: $\dfrac{\frac2n + \frac{1}{n^2}}{1 + \frac{3}{n^2}} \to \dfrac{0}{1} = 0$.` },
    { level: 2, type: "fields", q: R`Για την ακολουθία $a_n = \dfrac{3n + 2}{n + 1}$ ισχύει $a_n \to 3$. Για $\varepsilon = 0{,}01$, ποιο είναι το <b>μικρότερο</b> $N$ ώστε $|a_n - 3| < \varepsilon$ για κάθε $n \ge N$;`,
      fields: [{ label: "N =", ans: 100 }], hint: R`$|a_n - 3| = \left|\frac{3n + 2 - 3n - 3}{n + 1}\right| = \frac{1}{n + 1}$.`,
      sol: R`$\frac{1}{n + 1} < 0{,}01 \iff n + 1 > 100 \iff n > 99$. Άρα $N = 100$ (για $n = 99$: $|a_{99} - 3| = 0{,}01$, όχι γνήσια μικρότερο).` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\lim_{n\to\infty} \left(\sqrt{n^2 + 5n} - n\right)$.`, fields: [{ label: "όριο =", ans: "5/2" }],
      hint: R`Πολλαπλασιάστε και διαιρέστε με τη συζυγή $\sqrt{n^2 + 5n} + n$.`,
      sol: R`$\sqrt{n^2 + 5n} - n = \dfrac{5n}{\sqrt{n^2 + 5n} + n} = \dfrac{5}{\sqrt{1 + \frac5n} + 1} \to \dfrac{5}{2}$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\lim_{n\to\infty} \dfrac{2n + \cos n}{n + 1}$.`, fields: [{ label: "όριο =", ans: 2 }],
      hint: R`$-1 \le \cos n \le 1$· κριτήριο παρεμβολής.`, sol: R`$\dfrac{2n - 1}{n + 1} \le \dfrac{2n + \cos n}{n + 1} \le \dfrac{2n + 1}{n + 1}$ και τα δύο άκρα τείνουν στο $2$, άρα το όριο είναι $2$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\lim_{n\to\infty} \dfrac{2^n + 3^n}{3^{n+1}}$.`, fields: [{ label: "όριο =", ans: "1/3" }],
      hint: R`Κοινός παράγοντας $3^n$.`, sol: R`$\dfrac{3^n\left(\left(\frac23\right)^n + 1\right)}{3\cdot 3^n} = \dfrac{\left(\frac23\right)^n + 1}{3} \to \dfrac{0 + 1}{3} = \dfrac13$.` },
    { level: 1, type: "mc", q: R`Κάθε φραγμένη ακολουθία συγκλίνει.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Σκεφτείτε την $(-1)^n$.`, sol: R`Λάθος: η $a_n = (-1)^n$ είναι φραγμένη ($|a_n| \le 1$) αλλά δεν συγκλίνει. Ισχύει μόνο το αντίστροφο: κάθε συγκλίνουσα ακολουθία είναι φραγμένη.` },
    { level: 2, type: "mc", q: R`Για την ακολουθία $a_n = (-1)^n\dfrac{n}{n+1}$ ισχύει:`,
      options: ["αποκλίνει, γιατί οι άρτιοι όροι τείνουν στο $1$ και οι περιττοί στο $-1$", "συγκλίνει στο $1$", "συγκλίνει στο $0$", "συγκλίνει στο $-1$"], correct: 0,
      hint: R`Εξετάστε χωριστά τους άρτιους και τους περιττούς όρους.`, sol: R`$a_{2k} = \frac{2k}{2k+1} \to 1$ ενώ $a_{2k+1} = -\frac{2k+1}{2k+2} \to -1$. Δύο υπακολουθίες με διαφορετικά όρια: η ακολουθία αποκλίνει (είναι όμως φραγμένη).` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε το $\lim_{n\to\infty} n\sin\dfrac1n$.`, fields: [{ label: "όριο =", ans: 1 }],
      hint: R`Θέστε $x = \frac1n \to 0^+$ και χρησιμοποιήστε το $\lim_{x\to0}\frac{\sin x}{x}$.`, sol: R`$n\sin\frac1n = \dfrac{\sin(1/n)}{1/n}$ και, αφού $\lim_{x\to 0}\frac{\sin x}{x} = 1$, το όριο είναι $1$ (μορφή $\infty\cdot 0$, όχι $0$).` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε το $\lim_{n\to\infty} \dfrac{\sqrt{9n^2 + n}}{2n - 5}$.`, fields: [{ label: "όριο =", ans: "3/2" }],
      hint: R`Βγάλτε το $n$ από τη ρίζα: $\sqrt{9n^2 + n} = n\sqrt{9 + \frac1n}$ για $n > 0$.`, sol: R`$\dfrac{n\sqrt{9 + \frac1n}}{n\left(2 - \frac5n\right)} = \dfrac{\sqrt{9 + \frac1n}}{2 - \frac5n} \to \dfrac{3}{2}$.` }
  ]
},
/* ───────────────────────────── 1.2 ───────────────────────────── */
{
  id: "1.2", unit: 1, title: "Μονότονες και φραγμένες ακολουθίες – Αναδρομικές ακολουθίες – Ο αριθμός e",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 1 · Βλ. και Stewart, §11.1",
  theory: R`
<div class="tbox"><h4>Μονοτονία και φράγματα</h4>
<p>Η $(a_n)$ είναι <b>αύξουσα</b> αν $a_{n+1} \ge a_n$ για κάθε $n$ (γνησίως αν $>$) και <b>φθίνουσα</b> αν $a_{n+1} \le a_n$. Ελέγχουμε το πρόσημο της $a_{n+1} - a_n$ ή, για θετικούς όρους, αν $\frac{a_{n+1}}{a_n} \gtrless 1$. Είναι <b>άνω φραγμένη</b> αν $a_n \le M$ για κάθε $n$, <b>κάτω φραγμένη</b> αν $a_n \ge m$.</p></div>
<div class="tbox"><h4>Θεώρημα μονότονης σύγκλισης</h4>
<p>Κάθε <b>αύξουσα και άνω φραγμένη</b> ακολουθία συγκλίνει (στο $\sup_n a_n$)· κάθε <b>φθίνουσα και κάτω φραγμένη</b> συγκλίνει (στο $\inf_n a_n$). Το θεώρημα εξασφαλίζει την <b>ύπαρξη</b> ορίου χωρίς να το υπολογίσουμε.</p></div>
<div class="tbox"><h4>Αναδρομικές ακολουθίες $a_{n+1} = f(a_n)$</h4>
<ol><li>Με <b>επαγωγή</b> δείχνουμε ότι η ακολουθία είναι φραγμένη (π.χ. $0 \le a_n < 3$).</li>
<li>Με επαγωγή (ή με το πρόσημο της $a_{n+1} - a_n$) δείχνουμε ότι είναι μονότονη.</li>
<li>Άρα συγκλίνει σε κάποιο $L$· αφού και $a_{n+1} \to L$, και η $f$ είναι συνεχής, παίρνουμε $L = f(L)$ και λύνουμε, κρατώντας τη λύση που συμφωνεί με τα φράγματα.</li></ol>
<p>Π.χ. $a_1 = 0$, $a_{n+1} = \sqrt{6 + a_n}$: $L = \sqrt{6 + L} \Rightarrow L^2 - L - 6 = 0 \Rightarrow L = 3$ (η $L = -2$ απορρίπτεται, αφού $a_n \ge 0$).</p></div>
<div class="tbox tip"><h4>Ο αριθμός e</h4>
<p>Η $\left(1 + \frac1n\right)^n$ είναι γνησίως αύξουσα και φραγμένη από το $3$, άρα συγκλίνει· το όριό της είναι ο αριθμός $e \approx 2{,}71828$. Γενικότερα $\left(1 + \frac{x}{n}\right)^n \to e^x$ για κάθε $x \in \mathbb R$.</p></div>
<div class="tbox warn"><h4>Προσοχή</h4><p>Η εξίσωση $L = f(L)$ δίνει το όριο <b>μόνο αν</b> έχουμε πρώτα δείξει ότι η ακολουθία συγκλίνει: π.χ. η $a_1 = 2$, $a_{n+1} = a_n^2$ «δίνει» $L = 0$ ή $1$, όμως $a_n = 2^{2^{n-1}} \to \infty$.</p></div>`,
  widget: "m2aseqw",
  gen: "m2arec",
  exercises: [
    { level: 1, type: "fields", q: R`Δίνεται $a_1 = 1$ και $a_{n+1} = \sqrt{2 + a_n}$. Η ακολουθία είναι αύξουσα και άνω φραγμένη από το $2$. Να βρείτε το όριό της.`, fields: [{ label: "L =", ans: 2 }],
      hint: R`$L = \sqrt{2 + L}$ με $L \ge 0$.`, sol: R`$L^2 = 2 + L \iff L^2 - L - 2 = 0 \iff (L - 2)(L + 1) = 0$. Αφού $a_n > 0$, $L \ge 0$, άρα $L = 2$.` },
    { level: 2, type: "fields", q: R`Δίνεται $a_1 = 3$ και $a_{n+1} = \dfrac12\left(a_n + \dfrac{4}{a_n}\right)$. Αν η ακολουθία συγκλίνει (είναι φθίνουσα και $a_n \ge 2$), ποιο είναι το όριό της;`, fields: [{ label: "L =", ans: 2 }],
      hint: R`$L = \frac12\left(L + \frac4L\right)$, $L > 0$.`, sol: R`$2L = L + \frac4L \iff L = \frac4L \iff L^2 = 4$ και $L > 0$, άρα $L = 2$ (είναι η μέθοδος του Νεύτωνα για το $\sqrt4$).` },
    { level: 1, type: "fields", q: R`Το όριο $\lim_{n\to\infty}\left(1 + \frac3n\right)^{2n}$ γράφεται $e^{\kappa}$. Να βρείτε το $\kappa$.`, fields: [{ label: "κ =", ans: 6 }],
      hint: R`$\left(1 + \frac xn\right)^n \to e^x$.`, sol: R`$\left(1 + \frac3n\right)^{2n} = \left[\left(1 + \frac3n\right)^n\right]^2 \to (e^3)^2 = e^6$, άρα $\kappa = 6$.` },
    { level: 2, type: "fields", q: R`Το όριο $\lim_{n\to\infty}\left(1 - \frac1n\right)^{n}$ γράφεται $e^{\kappa}$. Να βρείτε το $\kappa$.`, fields: [{ label: "κ =", ans: -1 }],
      hint: R`Είναι $\left(1 + \frac{x}{n}\right)^n$ με $x = -1$.`, sol: R`$\left(1 + \frac{-1}{n}\right)^n \to e^{-1}$, άρα $\kappa = -1$.` },
    { level: 3, type: "fields", q: R`Το όριο $\lim_{n\to\infty}\left(\dfrac{n+1}{n-1}\right)^{n}$ γράφεται $e^{\kappa}$. Να βρείτε το $\kappa$.`, fields: [{ label: "κ =", ans: 2 }],
      hint: R`$\frac{n+1}{n-1} = 1 + \frac{2}{n-1}$.`,
      sol: R`$\left(1 + \frac{2}{n-1}\right)^{n} = \left(1 + \frac{2}{n-1}\right)^{n-1}\cdot\left(1 + \frac{2}{n-1}\right) \to e^2\cdot 1$. Άλλος τρόπος: $\frac{(1 + 1/n)^n}{(1 - 1/n)^n} \to \frac{e}{e^{-1}} = e^2$. Άρα $\kappa = 2$.` },
    { level: 1, type: "mc", q: R`Η ακολουθία $a_n = \dfrac{n}{n+1}$ είναι:`,
      options: ["γνησίως αύξουσα και φραγμένη", "γνησίως φθίνουσα και φραγμένη", "γνησίως αύξουσα και όχι άνω φραγμένη", "όχι μονότονη"], correct: 0,
      hint: R`$a_n = 1 - \frac{1}{n+1}$.`, sol: R`$a_n = 1 - \frac{1}{n+1}$: όσο μεγαλώνει το $n$, το $\frac{1}{n+1}$ μικραίνει, άρα η $a_n$ αυξάνει γνησίως· και $\frac12 \le a_n < 1$, άρα είναι φραγμένη (συγκλίνει στο $1$).` },
    { level: 1, type: "mc", q: R`Κάθε αύξουσα και άνω φραγμένη ακολουθία πραγματικών αριθμών συγκλίνει.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Θεώρημα μονότονης σύγκλισης.`, sol: R`Σωστό: συγκλίνει στο $\sup_n a_n$ (η ιδιότητα της πληρότητας του $\mathbb R$).` },
    { level: 2, type: "fields", q: R`Για την $a_n = \dfrac{2^n}{n!}$: από ποιον δείκτη $n_0$ και μετά ισχύει $a_{n+1} < a_n$ (για κάθε $n \ge n_0$); Ποιο είναι το $\lim a_n$;`,
      fields: [{ label: "n₀ =", ans: 2 }, { label: "όριο =", ans: 0 }], hint: R`$\frac{a_{n+1}}{a_n} = \frac{2}{n+1}$.`,
      sol: R`$\frac{a_{n+1}}{a_n} = \frac{2^{n+1}n!}{(n+1)!\,2^n} = \frac{2}{n+1} < 1 \iff n > 1$, άρα από το $n_0 = 2$ η ακολουθία είναι γνησίως φθίνουσα ($a_1 = a_2 = 2$). Είναι θετική, άρα συγκλίνει σε $L \ge 0$· από $a_{n+1} = \frac{2}{n+1}a_n$ παίρνουμε $L = 0\cdot L = 0$.` },
    { level: 3, type: "fields", q: R`Δίνεται $a_1 = 0$, $a_{n+1} = \sqrt{6 + a_n}$. Να υπολογίσετε τον όρο $a_3$ (με $3$ δεκαδικά) και το όριο της ακολουθίας.`,
      fields: [{ label: "a₃ ≈", ans: 2.9068, tol: 0.0005 }, { label: "L =", ans: 3 }], hint: R`$a_2 = \sqrt6$, $a_3 = \sqrt{6 + \sqrt6}$.`,
      sol: R`$a_2 = \sqrt 6 \approx 2{,}449$, $a_3 = \sqrt{6 + \sqrt 6} \approx 2{,}907$. Με επαγωγή: $0 \le a_n < 3$ (αφού $a_n < 3 \Rightarrow a_{n+1} < \sqrt9 = 3$) και $a_{n+1} > a_n$ (αφού $6 + a > a^2$ για $0 \le a < 3$). Συγκλίνει, και $L = \sqrt{6 + L} \Rightarrow L = 3$.` }
  ]
},
/* ───────────────────────────── 2.1 ───────────────────────────── */
{
  id: "2.1", unit: 2, title: "Σειρές – Γεωμετρική και τηλεσκοπική σειρά – Κριτήριο n-οστού όρου",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 2 · Βλ. και Stewart, §11.2",
  theory: R`
<div class="tbox"><h4>Σειρά και μερικά αθροίσματα</h4>
<p>Για μια ακολουθία $(a_n)$ ορίζουμε τα <b>μερικά αθροίσματα</b> $S_N = a_1 + a_2 + \dots + a_N$. Η σειρά $\sum_{n=1}^\infty a_n$ <b>συγκλίνει</b> με άθροισμα $S$ αν $S_N \to S$· αλλιώς <b>αποκλίνει</b>. Αν $\sum a_n = A$, $\sum b_n = B$, τότε $\sum(\lambda a_n + \mu b_n) = \lambda A + \mu B$.</p></div>
<div class="tbox"><h4>Γεωμετρική σειρά</h4>
<p>$$\sum_{n=0}^{\infty} a r^n = a + ar + ar^2 + \dots = \frac{a}{1 - r}\quad\text{αν } |r| < 1,$$
ενώ για $|r| \ge 1$ (και $a \ne 0$) αποκλίνει. Αιτία: $S_N = a\frac{1 - r^{N+1}}{1 - r}$ και $r^{N+1} \to 0$ μόνο όταν $|r| < 1$. «Άθροισμα = πρώτος όρος / (1 − λόγος)».</p></div>
<div class="tbox"><h4>Τηλεσκοπική σειρά</h4>
<p>Αν $a_n = b_n - b_{n+1}$, τότε $S_N = b_1 - b_{N+1}$, οπότε η σειρά συγκλίνει ανν η $b_n$ συγκλίνει. Π.χ. $\frac{1}{n(n+1)} = \frac1n - \frac{1}{n+1}$, άρα $S_N = 1 - \frac{1}{N+1} \to 1$.</p></div>
<div class="tbox warn"><h4>Κριτήριο n-οστού όρου (απόκλισης)</h4>
<p>Αν η $\sum a_n$ συγκλίνει, τότε $a_n \to 0$. Ισοδύναμα: <b>αν $a_n \not\to 0$, η σειρά αποκλίνει</b>. Το αντίστροφο <b>δεν</b> ισχύει: η αρμονική $\sum \frac1n$ έχει $\frac1n \to 0$ αλλά αποκλίνει.</p></div>`,
  widget: "m2asums",
  gen: "m2aser",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε το άθροισμα $\sum_{n=1}^{\infty} 3\left(\frac12\right)^{n-1}$.`, fields: [{ label: "άθροισμα =", ans: 6 }],
      hint: R`Πρώτος όρος $3$, λόγος $\frac12$.`, sol: R`$\frac{3}{1 - \frac12} = 6$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το άθροισμα $\sum_{n=0}^{\infty} \left(-\frac23\right)^{n}$.`, fields: [{ label: "άθροισμα =", ans: "3/5" }],
      hint: R`$|r| = \frac23 < 1$.`, sol: R`$\dfrac{1}{1 - \left(-\frac23\right)} = \dfrac{1}{\frac53} = \dfrac35$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το άθροισμα $\sum_{n=1}^{\infty} \dfrac{1}{n(n+1)}$.`, fields: [{ label: "άθροισμα =", ans: 1 }],
      hint: R`$\frac{1}{n(n+1)} = \frac1n - \frac{1}{n+1}$.`, sol: R`Τηλεσκοπική: $S_N = 1 - \frac{1}{N+1} \to 1$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το άθροισμα $\sum_{n=1}^{\infty} \dfrac{1}{(n+1)(n+3)}$.`, fields: [{ label: "άθροισμα =", ans: "5/12" }],
      hint: R`$\frac{1}{(n+1)(n+3)} = \frac12\left(\frac{1}{n+1} - \frac{1}{n+3}\right)$.`,
      sol: R`Στο $S_N$ απαλείφονται οι όροι εκτός από τους δύο πρώτους θετικούς και τους δύο τελευταίους αρνητικούς: $S_N = \frac12\left(\frac12 + \frac13 - \frac{1}{N+2} - \frac{1}{N+3}\right) \to \frac12\cdot\frac56 = \frac{5}{12}$.` },
    { level: 2, type: "fields", q: R`Να γράψετε τον περιοδικό αριθμό $0{,}\overline{36}$ ως άθροισμα γεωμετρικής σειράς και να τον μετατρέψετε σε ανάγωγο κλάσμα.`, fields: [{ label: "κλάσμα =", ans: "4/11" }],
      hint: R`$0{,}\overline{36} = \frac{36}{100} + \frac{36}{100^2} + \dots$`, sol: R`Γεωμετρική με $a = \frac{36}{100}$, $r = \frac{1}{100}$: $\dfrac{36/100}{1 - 1/100} = \dfrac{36}{99} = \dfrac{4}{11}$.` },
    { level: 1, type: "mc", q: R`Η σειρά $\sum_{n=1}^\infty \dfrac{n}{2n+1}$:`,
      options: ["αποκλίνει, γιατί $a_n \\to \\frac12 \\ne 0$", "συγκλίνει στο $\\frac12$", "συγκλίνει, γιατί είναι φθίνουσα", "συγκλίνει, γιατί $a_n < 1$"], correct: 0,
      hint: R`Κριτήριο n-οστού όρου.`, sol: R`$a_n = \frac{n}{2n+1} \to \frac12 \ne 0$, άρα η σειρά αποκλίνει. (Το $\frac12$ είναι το όριο του <b>όρου</b>, όχι το άθροισμα.)` },
    { level: 1, type: "mc", q: R`Αν $a_n \to 0$, τότε η σειρά $\sum a_n$ συγκλίνει.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Αρμονική σειρά.`, sol: R`Λάθος: $\frac1n \to 0$ αλλά $\sum\frac1n = \infty$. Η συνθήκη $a_n \to 0$ είναι αναγκαία, όχι ικανή.` },
    { level: 2, type: "fields", q: R`Η σειρά $\sum_{n=0}^\infty (x-1)^n$ συγκλίνει ακριβώς για $a < x < b$. Να βρείτε τα $a, b$ και το άθροισμα για $x = \frac12$.`,
      fields: [{ label: "a =", ans: 0 }, { label: "b =", ans: 2 }, { label: "άθροισμα για x = 1/2:", ans: "2/3" }], hint: R`Γεωμετρική με λόγο $r = x - 1$.`,
      sol: R`Συγκλίνει ανν $|x - 1| < 1 \iff 0 < x < 2$. Το άθροισμα είναι $\frac{1}{1 - (x - 1)} = \frac{1}{2 - x}$· για $x = \frac12$: $\frac{1}{3/2} = \frac23$.` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε το άθροισμα $\sum_{n=1}^\infty \dfrac{2^n + 3^n}{6^n}$.`, fields: [{ label: "άθροισμα =", ans: "3/2" }],
      hint: R`Σπάστε σε δύο γεωμετρικές: $\left(\frac13\right)^n + \left(\frac12\right)^n$.`, sol: R`$\sum_{n\ge1}\left(\frac13\right)^n = \frac{1/3}{1 - 1/3} = \frac12$ και $\sum_{n\ge1}\left(\frac12\right)^n = 1$. Αφού συγκλίνουν και οι δύο, το άθροισμα είναι $\frac12 + 1 = \frac32$.` },
    { level: 3, type: "mc", q: R`Για τη σειρά $\sum_{n=1}^\infty \ln\dfrac{n}{n+1}$ ισχύει:`,
      options: ["αποκλίνει στο $-\\infty$, αφού $S_N = -\\ln(N+1)$", "συγκλίνει, αφού $\\ln\\frac{n}{n+1} \\to 0$", "συγκλίνει στο $0$", "συγκλίνει στο $-1$"], correct: 0,
      hint: R`$\ln\frac{n}{n+1} = \ln n - \ln(n+1)$: τηλεσκοπική.`, sol: R`$S_N = (\ln 1 - \ln 2) + (\ln 2 - \ln 3) + \dots + (\ln N - \ln(N+1)) = -\ln(N+1) \to -\infty$. Αποκλίνει, παρότι ο γενικός όρος τείνει στο $0$.` }
  ]
},
/* ───────────────────────────── 2.2 ───────────────────────────── */
{
  id: "2.2", unit: 2, title: "Σειρές θετικών όρων – Κριτήρια σύγκρισης και ολοκληρωτικό κριτήριο",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 2 · Βλ. και Stewart, §11.3–11.4",
  theory: R`
<div class="tbox"><h4>Σειρές με μη αρνητικούς όρους</h4>
<p>Αν $a_n \ge 0$, τα μερικά αθροίσματα $S_N$ είναι αύξουσα ακολουθία· άρα η $\sum a_n$ συγκλίνει <b>ανν</b> η $(S_N)$ είναι άνω φραγμένη.</p></div>
<div class="tbox"><h4>Ολοκληρωτικό κριτήριο και p-σειρές</h4>
<p>Έστω $f$ συνεχής, θετική και <b>φθίνουσα</b> στο $[1, \infty)$ με $a_n = f(n)$. Τότε η $\sum a_n$ και το $\int_1^\infty f(x)\,dx$ είτε συγκλίνουν και τα δύο είτε αποκλίνουν και τα δύο. Επιπλέον, για το υπόλοιπο: $\int_{N+1}^\infty f \le \sum_{n > N} a_n \le \int_N^\infty f$.</p>
<p><b>p-σειρά:</b> $\displaystyle\sum_{n=1}^\infty \frac{1}{n^p}$ συγκλίνει ανν $p > 1$ (για $p = 1$: αρμονική, αποκλίνει).</p></div>
<div class="tbox"><h4>Κριτήρια σύγκρισης ($a_n, b_n > 0$)</h4>
<ul><li><b>Άμεσο:</b> αν $a_n \le b_n$ και η $\sum b_n$ συγκλίνει, τότε συγκλίνει και η $\sum a_n$· αν $a_n \ge b_n$ και η $\sum b_n$ αποκλίνει, αποκλίνει και η $\sum a_n$.</li>
<li><b>Οριακό:</b> αν $\lim \frac{a_n}{b_n} = c$ με $0 < c < \infty$, οι δύο σειρές έχουν την <b>ίδια</b> συμπεριφορά.</li></ul></div>
<div class="tbox tip"><h4>Πρακτικός κανόνας</h4>
<p>Για ρητές παραστάσεις του $n$ συγκρίνουμε με $\frac{1}{n^{p}}$, όπου $p$ = (βαθμός παρονομαστή) − (βαθμός αριθμητή). Π.χ. $\frac{2n + 1}{n^3 + 4} \sim \frac{2}{n^2}$: συγκλίνει.</p></div>
<div class="tbox warn"><h4>Προσοχή</h4><p>Το άμεσο κριτήριο δουλεύει μόνο «προς τη σωστή κατεύθυνση»: αν $a_n \le b_n$ και η $\sum b_n$ <b>αποκλίνει</b>, δεν συμπεραίνουμε τίποτα για την $\sum a_n$.</p></div>`,
  widget: "m2aint",
  gen: "m2acmp",
  exercises: [
    { level: 1, type: "mc", q: R`Η σειρά $\sum_{n=1}^\infty \dfrac{1}{n\sqrt n}$:`, options: ["συγκλίνει (p-σειρά με $p = \\frac32 > 1$)", "αποκλίνει (p-σειρά με $p = \\frac12$)", "αποκλίνει, όπως η αρμονική", "συγκλίνει στο $\\frac32$"], correct: 0,
      hint: R`$n\sqrt n = n^{3/2}$.`, sol: R`$\frac{1}{n\sqrt n} = \frac{1}{n^{3/2}}$: p-σειρά με $p = \frac32 > 1$, συγκλίνει. (Το $p$ δεν είναι το άθροισμα.)` },
    { level: 1, type: "mc", q: R`Η σειρά $\sum_{n=1}^\infty \dfrac{1}{\sqrt n}$:`, options: ["αποκλίνει (p-σειρά με $p = \\frac12 \\le 1$)", "συγκλίνει, αφού $\\frac{1}{\\sqrt n} \\to 0$", "συγκλίνει (p-σειρά με $p = \\frac12$)", "συγκλίνει στο $2$"], correct: 0,
      hint: R`$p = \frac12$.`, sol: R`p-σειρά με $p = \frac12 \le 1$: αποκλίνει (μάλιστα $\frac{1}{\sqrt n} \ge \frac1n$).` },
    { level: 2, type: "fields", q: R`Για τη σειρά $\sum \dfrac{2n + 1}{n^3 + 4}$, συγκρίνουμε οριακά με την $\sum \frac{1}{n^p}$. Ποιο είναι το κατάλληλο $p$ και το όριο $L = \lim \dfrac{a_n}{1/n^p}$;`,
      fields: [{ label: "p =", ans: 2 }, { label: "L =", ans: 2 }], hint: R`Μεγιστοβάθμιοι όροι: $\frac{2n}{n^3}$.`,
      sol: R`$\frac{a_n}{1/n^2} = \frac{2n^3 + n^2}{n^3 + 4} \to 2 \in (0, \infty)$. Αφού η $\sum\frac{1}{n^2}$ συγκλίνει ($p = 2 > 1$), συγκλίνει και η σειρά μας.` },
    { level: 2, type: "mc", q: R`Η σειρά $\sum_{n=2}^\infty \dfrac{1}{n(\ln n)^p}$ συγκλίνει ακριβώς όταν:`, options: ["$p > 1$", "$p \\ge 1$", "$p > 0$", "για κανένα $p$"], correct: 0,
      hint: R`Ολοκληρωτικό κριτήριο με $u = \ln x$.`, sol: R`Για $p > 0$ η $f(x) = \frac{1}{x(\ln x)^p}$ είναι θετική και φθίνουσα στο $[2, \infty)$, και με $u = \ln x$: $\int_2^\infty \frac{dx}{x(\ln x)^p} = \int_{\ln 2}^\infty \frac{du}{u^p}$, που συγκλίνει ανν $p > 1$. Για $p \le 0$ ισχύει $\frac{1}{n(\ln n)^p} \ge \frac1n$ για $n \ge 3$, οπότε αποκλίνει με σύγκριση με την αρμονική. Άρα συγκλίνει ακριβώς για $p > 1$.` },
    { level: 2, type: "fields", q: R`Για να εφαρμόσουμε το ολοκληρωτικό κριτήριο στη $\sum_{n\ge1} n e^{-n^2}$ υπολογίζουμε το $\int_1^\infty x e^{-x^2}dx$. Πόσο είναι (με $4$ δεκαδικά);`,
      fields: [{ label: "ολοκλήρωμα ≈", ans: 0.18394, tol: 0.002 }], hint: R`Αντικατάσταση $u = x^2$.`,
      sol: R`$\int_1^b x e^{-x^2}dx = \left[-\tfrac12 e^{-x^2}\right]_1^b \to \frac{1}{2e} \approx 0{,}1839$. Το ολοκλήρωμα συγκλίνει (και η $f(x) = xe^{-x^2}$ είναι φθίνουσα για $x \ge 1$), άρα η σειρά συγκλίνει.` },
    { level: 1, type: "mc", q: R`Αν $0 \le a_n \le b_n$ για κάθε $n$ και η $\sum a_n$ συγκλίνει, τότε συγκλίνει και η $\sum b_n$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Η μικρότερη σειρά δεν «ελέγχει» τη μεγαλύτερη.`, sol: R`Λάθος: $a_n = \frac{1}{n^2} \le b_n = \frac1n$, η $\sum a_n$ συγκλίνει αλλά η $\sum b_n$ αποκλίνει. Το κριτήριο σύγκρισης πάει από τη μεγαλύτερη (συγκλίνουσα) στη μικρότερη.` },
    { level: 2, type: "mc", q: R`Η σειρά $\sum_{n=1}^\infty \dfrac{\sin^2 n}{n^2}$:`, options: ["συγκλίνει, με σύγκριση με τη $\\sum\\frac{1}{n^2}$", "αποκλίνει, γιατί ο $\\sin^2 n$ δεν έχει όριο", "δεν εφαρμόζεται κανένα κριτήριο", "αποκλίνει, με σύγκριση με την αρμονική"], correct: 0,
      hint: R`$0 \le \sin^2 n \le 1$.`, sol: R`$0 \le \frac{\sin^2 n}{n^2} \le \frac{1}{n^2}$ και η $\sum\frac{1}{n^2}$ συγκλίνει, άρα συγκλίνει (άμεσο κριτήριο σύγκρισης).` },
    { level: 2, type: "fields", q: R`Ποιος είναι ο <b>μικρότερος ακέραιος</b> $p$ για τον οποίο συγκλίνει η $\sum_{n=1}^\infty \dfrac{n^2}{n^p + 1}$;`, fields: [{ label: "p =", ans: 4 }],
      hint: R`$\frac{n^2}{n^p + 1} \sim \frac{1}{n^{p-2}}$.`, sol: R`Οριακή σύγκριση με $\frac{1}{n^{p-2}}$: συγκλίνει ανν $p - 2 > 1 \iff p > 3$. Ο μικρότερος ακέραιος είναι $p = 4$ (για $p = 3$: $\sim\frac1n$, αποκλίνει).` },
    { level: 3, type: "fields", q: R`Για τη $\sum\frac{1}{n^2}$, με το ολοκληρωτικό κριτήριο, το υπόλοιπο $R_N = \sum_{n>N}\frac{1}{n^2}$ ικανοποιεί $R_N \le \int_N^\infty \frac{dx}{x^2}$. Ποιο είναι το μικρότερο $N$ για το οποίο αυτό το φράγμα εγγυάται $R_N \le 0{,}01$;`,
      fields: [{ label: "N =", ans: 100 }], hint: R`$\int_N^\infty x^{-2}dx = \frac1N$.`, sol: R`$\int_N^\infty \frac{dx}{x^2} = \frac1N \le 0{,}01 \iff N \ge 100$. Άρα με $100$ όρους το σφάλμα είναι το πολύ $0{,}01$.` }
  ]
},
/* ───────────────────────────── 2.3 ───────────────────────────── */
{
  id: "2.3", unit: 2, title: "Κριτήρια λόγου και ρίζας – Εναλλάσσουσες σειρές – Απόλυτη σύγκλιση",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 2 · Βλ. και Stewart, §11.5–11.7",
  theory: R`
<div class="tbox"><h4>Απόλυτη και υπό συνθήκη σύγκλιση</h4>
<p>Η $\sum a_n$ συγκλίνει <b>απόλυτα</b> αν συγκλίνει η $\sum |a_n|$. <b>Θεώρημα:</b> απόλυτη σύγκλιση ⇒ σύγκλιση. Αν η $\sum a_n$ συγκλίνει αλλά η $\sum|a_n|$ αποκλίνει, λέμε ότι συγκλίνει <b>υπό συνθήκη</b> (π.χ. $\sum\frac{(-1)^{n+1}}{n}$).</p></div>
<div class="tbox"><h4>Κριτήρια λόγου και ρίζας</h4>
<p>Έστω $L = \lim\left|\frac{a_{n+1}}{a_n}\right|$ (λόγου) ή $L = \lim\sqrt[n]{|a_n|}$ (ρίζας). Τότε:</p>
<ul><li>$L < 1$: η σειρά συγκλίνει <b>απόλυτα</b>·</li><li>$L > 1$ (ή $L = \infty$): <b>αποκλίνει</b> (ο όρος δεν τείνει στο 0)·</li><li>$L = 1$: το κριτήριο <b>δεν αποφαίνεται</b> (π.χ. $\sum\frac1n$ και $\sum\frac{1}{n^2}$ δίνουν και οι δύο $L = 1$).</li></ul>
<p>Ο λόγος βολεύει με παραγοντικά και εκθετικά, η ρίζα με όρους της μορφής $(\dots)^n$.</p></div>
<div class="tbox"><h4>Εναλλάσσουσες σειρές – Κριτήριο Leibniz</h4>
<p>Αν $b_n > 0$, η $(b_n)$ είναι <b>φθίνουσα</b> και $b_n \to 0$, τότε η $\sum(-1)^{n+1}b_n$ συγκλίνει. Επιπλέον, το σφάλμα όταν κρατάμε $N$ όρους είναι $|S - S_N| \le b_{N+1}$.</p></div>
<div class="tbox tip"><h4>Στρατηγική ελέγχου</h4>
<ol><li>$a_n \not\to 0$; → αποκλίνει.</li><li>Γεωμετρική / p-σειρά / τηλεσκοπική;</li><li>Θετικοί όροι, ρητή μορφή → (οριακή) σύγκριση· φθίνουσα συνάρτηση → ολοκληρωτικό.</li><li>Παραγοντικά / εκθετικά → λόγου· $(\dots)^n$ → ρίζας.</li><li>Εναλλασσόμενο πρόσημο → πρώτα απόλυτη σύγκλιση, αλλιώς Leibniz.</li></ol></div>`,
  widget: "m2asums",
  gen: "m2aratio",
  exercises: [
    { level: 1, type: "fields", q: R`Για τη σειρά $\sum_{n=1}^\infty \dfrac{n}{3^n}$ να βρείτε το $L = \lim\left|\frac{a_{n+1}}{a_n}\right|$.`, fields: [{ label: "L =", ans: "1/3" }],
      hint: R`$\frac{a_{n+1}}{a_n} = \frac{n+1}{n}\cdot\frac13$.`, sol: R`$\frac{n+1}{3n} \to \frac13 < 1$: συγκλίνει απόλυτα.` },
    { level: 2, type: "fields", q: R`Για τη σειρά $\sum_{n=1}^\infty \dfrac{n!}{n^n}$ να βρείτε το $L = \lim\frac{a_{n+1}}{a_n}$ (με $4$ δεκαδικά).`, fields: [{ label: "L ≈", ans: 0.36788, tol: 0.002 }],
      hint: R`$\frac{a_{n+1}}{a_n} = \frac{(n+1)!\,n^n}{n!\,(n+1)^{n+1}} = \left(\frac{n}{n+1}\right)^n$.`,
      sol: R`$\left(\frac{n}{n+1}\right)^n = \dfrac{1}{\left(1 + \frac1n\right)^n} \to \dfrac1e \approx 0{,}3679 < 1$: η σειρά συγκλίνει.` },
    { level: 1, type: "fields", q: R`Με το κριτήριο της ρίζας, να βρείτε το $L$ για τη σειρά $\sum_{n=1}^\infty \left(\dfrac{2n}{3n+1}\right)^n$.`, fields: [{ label: "L =", ans: "2/3" }],
      hint: R`$\sqrt[n]{a_n} = \frac{2n}{3n+1}$.`, sol: R`$\frac{2n}{3n+1} \to \frac23 < 1$: συγκλίνει.` },
    { level: 1, type: "fields", q: R`Για τη σειρά $\sum_{n=0}^\infty \dfrac{5^n}{n!}$ να βρείτε το $L = \lim\frac{a_{n+1}}{a_n}$ και το άθροισμα της σειράς ως δύναμη του $e$: $e^{\kappa}$.`,
      fields: [{ label: "L =", ans: 0 }, { label: "κ =", ans: 5 }], hint: R`$\frac{a_{n+1}}{a_n} = \frac{5}{n+1}$· θυμηθείτε τη σειρά της $e^x$.`, sol: R`$\frac{5}{n+1} \to 0 < 1$: συγκλίνει. Αφού $e^x = \sum\frac{x^n}{n!}$, το άθροισμα είναι $e^5$, άρα $\kappa = 5$.` },
    { level: 1, type: "mc", q: R`Η σειρά $\sum_{n=1}^\infty \dfrac{(-1)^{n+1}}{n}$:`, options: ["συγκλίνει υπό συνθήκη", "συγκλίνει απόλυτα", "αποκλίνει", "αποκλίνει στο $+\\infty$"], correct: 0,
      hint: R`Leibniz για τη σειρά· αρμονική για τις απόλυτες τιμές.`, sol: R`$b_n = \frac1n$ φθίνουσα με $b_n \to 0$: συγκλίνει (Leibniz, στο $\ln 2$). Η $\sum\left|\frac{(-1)^{n+1}}{n}\right| = \sum\frac1n$ αποκλίνει, άρα η σύγκλιση είναι υπό συνθήκη.` },
    { level: 1, type: "mc", q: R`Η σειρά $\sum_{n=1}^\infty \dfrac{(-1)^{n}}{n^2}$:`, options: ["συγκλίνει απόλυτα", "συγκλίνει υπό συνθήκη", "αποκλίνει", "δεν μπορούμε να αποφανθούμε"], correct: 0,
      hint: R`$\sum\frac{1}{n^2}$.`, sol: R`$\sum\left|\frac{(-1)^n}{n^2}\right| = \sum\frac{1}{n^2}$ συγκλίνει ($p = 2$), άρα η σειρά συγκλίνει απόλυτα.` },
    { level: 2, type: "fields", q: R`Πόσους όρους $N$ (τουλάχιστον) της $\sum_{n=1}^\infty \frac{(-1)^{n+1}}{n^3}$ πρέπει να αθροίσουμε ώστε, με βάση την εκτίμηση του Leibniz, το σφάλμα να είναι μικρότερο από $0{,}001$;`,
      fields: [{ label: "N =", ans: 10 }], hint: R`$|S - S_N| \le b_{N+1} = \frac{1}{(N+1)^3}$.`, sol: R`$\frac{1}{(N+1)^3} < 0{,}001 \iff (N+1)^3 > 1000 \iff N + 1 > 10 \iff N \ge 10$.` },
    { level: 1, type: "mc", q: R`Αν $\lim\left|\frac{a_{n+1}}{a_n}\right| = 1$, τότε η $\sum a_n$ αποκλίνει.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Συγκρίνετε $\sum\frac1n$ και $\sum\frac{1}{n^2}$.`, sol: R`Λάθος: με $L = 1$ το κριτήριο δεν αποφαίνεται. Η $\sum\frac1n$ αποκλίνει και η $\sum\frac{1}{n^2}$ συγκλίνει, και οι δύο με $L = 1$.` },
    { level: 3, type: "mc", q: R`Η σειρά $\sum_{n=1}^\infty (-1)^n\dfrac{n}{n^2 + 1}$:`, options: ["συγκλίνει υπό συνθήκη", "συγκλίνει απόλυτα", "αποκλίνει, γιατί $\\frac{n}{n^2+1}$ δεν είναι φθίνουσα", "αποκλίνει, γιατί ο όρος δεν τείνει στο 0"], correct: 0,
      hint: R`Για την απόλυτη: οριακή σύγκριση με $\frac1n$. Για τη μονοτονία: $f(x) = \frac{x}{x^2+1}$.`,
      sol: R`$\frac{n}{n^2 + 1} \sim \frac1n$, οπότε η $\sum|a_n|$ αποκλίνει (οριακή σύγκριση, $L = 1$). Όμως $f'(x) = \frac{1 - x^2}{(x^2+1)^2} < 0$ για $x > 1$, άρα $b_n = \frac{n}{n^2+1}$ είναι φθίνουσα και $\to 0$: συγκλίνει κατά Leibniz. Άρα υπό συνθήκη.` },
    { level: 3, type: "fields", q: R`Για τη σειρά $\sum_{n=1}^\infty \dfrac{(n!)^2}{(2n)!}$ να βρείτε το $L = \lim\frac{a_{n+1}}{a_n}$.`, fields: [{ label: "L =", ans: "1/4" }],
      hint: R`$\frac{(2n+2)!}{(2n)!} = (2n+1)(2n+2)$.`, sol: R`$\frac{a_{n+1}}{a_n} = \frac{(n+1)^2}{(2n+1)(2n+2)} = \frac{n+1}{2(2n+1)} \to \frac14 < 1$: η σειρά συγκλίνει.` }
  ]
},
/* ───────────────────────────── 3.1 ───────────────────────────── */
{
  id: "3.1", unit: 3, title: "Δυναμοσειρές – Ακτίνα και διάστημα σύγκλισης",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 3 · Βλ. και Stewart, §11.8–11.9",
  theory: R`
<div class="tbox"><h4>Δυναμοσειρά</h4>
<p>Δυναμοσειρά με κέντρο $a$ είναι η $\sum_{n=0}^\infty c_n(x - a)^n$. Για κάθε δυναμοσειρά υπάρχει $R \in [0, \infty]$, η <b>ακτίνα σύγκλισης</b>, ώστε η σειρά να συγκλίνει <b>απόλυτα</b> για $|x - a| < R$ και να <b>αποκλίνει</b> για $|x - a| > R$. Για $|x - a| = R$ (τα δύο άκρα) μπορεί να συμβαίνει οτιδήποτε.</p></div>
<div class="tbox"><h4>Υπολογισμός της ακτίνας</h4>
<p>Με το κριτήριο του λόγου στους όρους $|c_n(x - a)^n|$: αν $\lim\left|\frac{c_{n+1}}{c_n}\right| = \ell$, τότε $R = \frac1\ell$ (με $R = \infty$ αν $\ell = 0$ και $R = 0$ αν $\ell = \infty$). Ανάλογα με τη ρίζα: $\ell = \lim\sqrt[n]{|c_n|}$.</p>
<p>Π.χ. $\sum\frac{x^n}{n}$: $\left|\frac{x^{n+1}/(n+1)}{x^n/n}\right| \to |x|$, άρα $R = 1$· στο $x = 1$ η αρμονική αποκλίνει, στο $x = -1$ η εναλλάσσουσα συγκλίνει. Διάστημα σύγκλισης: $[-1, 1)$.</p></div>
<div class="tbox tip"><h4>Πράξεις με δυναμοσειρές</h4>
<p>Στο $(a - R, a + R)$ η $f(x) = \sum c_n(x-a)^n$ είναι παραγωγίσιμη και
$f'(x) = \sum n c_n (x - a)^{n-1}$, $\int f = C + \sum\frac{c_n}{n+1}(x - a)^{n+1}$ — με την <b>ίδια</b> ακτίνα $R$ (τα άκρα ξαναελέγχονται).<br>
Από $\frac{1}{1-x} = \sum x^n$ ($|x| < 1$): $\frac{1}{(1-x)^2} = \sum n x^{n-1}$, $\ \ln(1+x) = \sum_{n\ge1}\frac{(-1)^{n+1}x^n}{n}$.</p></div>
<div class="tbox warn"><h4>Συνηθισμένα λάθη</h4><p>Ξεχνάμε να ελέγξουμε τα άκρα· ή γράφουμε $R = \ell$ αντί $R = \frac1\ell$. Επίσης, για σειρές όπως $\sum (2x - 1)^n$ το κέντρο είναι $\frac12$ και η ακτίνα $\frac12$, όχι $1$.</p></div>`,
  widget: "m2ataylor",
  gen: "m2arad",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε την ακτίνα σύγκλισης της $\sum_{n=0}^\infty \dfrac{x^n}{3^n}$.`, fields: [{ label: "R =", ans: 3 }],
      hint: R`Γεωμετρική με λόγο $\frac x3$.`, sol: R`$\left|\frac x3\right| < 1 \iff |x| < 3$, άρα $R = 3$.` },
    { level: 1, type: "fields", q: R`Να βρείτε την ακτίνα σύγκλισης της $\sum_{n=0}^\infty n!\,x^n$.`, fields: [{ label: "R =", ans: 0 }],
      hint: R`$\left|\frac{(n+1)!\,x^{n+1}}{n!\,x^n}\right| = (n+1)|x|$.`, sol: R`Για $x \ne 0$: $(n+1)|x| \to \infty$, αποκλίνει. Η σειρά συγκλίνει μόνο για $x = 0$: $R = 0$.` },
    { level: 1, type: "mc", q: R`Η ακτίνα σύγκλισης της $\sum_{n=0}^\infty \dfrac{x^n}{n!}$ είναι:`, options: ["$R = \\infty$", "$R = 1$", "$R = 0$", "$R = e$"], correct: 0,
      hint: R`$\left|\frac{x^{n+1}/(n+1)!}{x^n/n!}\right| = \frac{|x|}{n+1}$.`, sol: R`$\frac{|x|}{n+1} \to 0 < 1$ για κάθε $x$: συγκλίνει παντού, $R = \infty$ (είναι η $e^x$).` },
    { level: 2, type: "fields", q: R`Για τη $\sum_{n=1}^\infty \dfrac{(x-2)^n}{n\cdot 4^n}$ να βρείτε την ακτίνα $R$ και τα άκρα $\alpha < \beta$ του διαστήματος σύγκλισης.`,
      fields: [{ label: "R =", ans: 4 }, { label: "α =", ans: -2 }, { label: "β =", ans: 6 }], hint: R`Κέντρο $2$· κριτήριο λόγου δίνει $\frac{|x-2|}{4}$.`,
      sol: R`$\frac{|x - 2|}{4}\cdot\frac{n}{n+1} \to \frac{|x-2|}{4} < 1 \iff -2 < x < 6$, $R = 4$. Στο $x = 6$: $\sum\frac1n$ αποκλίνει· στο $x = -2$: $\sum\frac{(-1)^n}{n}$ συγκλίνει. Διάστημα $[-2, 6)$.` },
    { level: 2, type: "mc", q: R`Το διάστημα σύγκλισης της $\sum_{n=1}^\infty \dfrac{x^n}{n^2}$ είναι:`, options: ["$[-1, 1]$", "$(-1, 1)$", "$[-1, 1)$", "$(-1, 1]$"], correct: 0,
      hint: R`$R = 1$· στα άκρα συγκρίνετε με $\sum\frac{1}{n^2}$.`, sol: R`$R = 1$. Στα $x = \pm 1$: $\sum\frac{(\pm1)^n}{n^2}$ συγκλίνει απόλυτα ($p = 2$). Άρα $[-1, 1]$.` },
    { level: 2, type: "fields", q: R`Γνωρίζουμε ότι $\sum_{n=1}^\infty n x^{n} = \dfrac{x}{(1-x)^2}$ για $|x| < 1$. Να υπολογίσετε το άθροισμα $\sum_{n=1}^\infty \dfrac{n}{2^n}$.`, fields: [{ label: "άθροισμα =", ans: 2 }],
      hint: R`Θέστε $x = \frac12$.`, sol: R`$\frac{1/2}{(1 - 1/2)^2} = \frac{1/2}{1/4} = 2$. (Η ταυτότητα προκύπτει παραγωγίζοντας τη γεωμετρική σειρά και πολλαπλασιάζοντας με $x$.)` },
    { level: 2, type: "fields", q: R`Ολοκληρώνοντας την $\frac{1}{1+x} = \sum(-1)^n x^n$ παίρνουμε τη σειρά της $\ln(1+x)$. Ποιος είναι ο συντελεστής του $x^4$ σε αυτή;`, fields: [{ label: "συντελεστής =", ans: "-1/4" }],
      hint: R`$\int_0^x t^3\,dt = \frac{x^4}{4}$.`, sol: R`$\ln(1+x) = \sum_{n\ge0}\frac{(-1)^n x^{n+1}}{n+1} = x - \frac{x^2}{2} + \frac{x^3}{3} - \frac{x^4}{4} + \dots$, άρα $-\frac14$.` },
    { level: 2, type: "fields", q: R`Να βρείτε την ακτίνα σύγκλισης και το κέντρο της $\sum_{n=1}^\infty \dfrac{(2x - 1)^n}{n}$.`, fields: [{ label: "R =", ans: "1/2" }, { label: "κέντρο =", ans: "1/2" }],
      hint: R`$|2x - 1| < 1 \iff \left|x - \frac12\right| < \frac12$.`, sol: R`Το κριτήριο λόγου δίνει $|2x - 1| < 1$, δηλαδή $\left|x - \frac12\right| < \frac12$: κέντρο $\frac12$, $R = \frac12$ (διάστημα $[0, 1)$).` },
    { level: 3, type: "fields", q: R`Για τη $\sum_{n=0}^\infty \dfrac{(-1)^n x^{2n}}{4^n}$ να βρείτε την ακτίνα σύγκλισης και το άθροισμα για $x = 1$.`, fields: [{ label: "R =", ans: 2 }, { label: "S(1) =", ans: "4/5" }],
      hint: R`Γεωμετρική με λόγο $-\frac{x^2}{4}$.`, sol: R`Συγκλίνει ανν $\frac{x^2}{4} < 1 \iff |x| < 2$: $R = 2$. Άθροισμα $\dfrac{1}{1 + \frac{x^2}{4}} = \dfrac{4}{4 + x^2}$· για $x = 1$: $\frac45$.` }
  ]
},
/* ───────────────────────────── 3.2 ───────────────────────────── */
{
  id: "3.2", unit: 3, title: "Σειρές Taylor και Maclaurin",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 3 · Βλ. και Stewart, §11.10–11.11",
  theory: R`
<div class="tbox"><h4>Σειρά Taylor</h4>
<p>Αν η $f$ έχει παραγώγους κάθε τάξης στο $a$, η <b>σειρά Taylor</b> της $f$ γύρω από το $a$ είναι
$$\sum_{n=0}^\infty \frac{f^{(n)}(a)}{n!}(x - a)^n = f(a) + f'(a)(x - a) + \frac{f''(a)}{2!}(x - a)^2 + \cdots$$
Για $a = 0$ λέγεται σειρά <b>Maclaurin</b>. Το άθροισμα των όρων μέχρι $(x - a)^n$ είναι το <b>πολυώνυμο Taylor</b> $T_n(x)$. Αν η $f$ παριστάνεται από δυναμοσειρά $\sum c_n(x - a)^n$ με $R > 0$, τότε $c_n = \frac{f^{(n)}(a)}{n!}$ (μοναδικότητα): η δυναμοσειρά είναι η σειρά Taylor της.</p></div>
<div class="tbox"><h4>Βασικές σειρές Maclaurin</h4>
<p>$e^x = \sum\frac{x^n}{n!}$ $(R = \infty)$ · $\sin x = \sum\frac{(-1)^n x^{2n+1}}{(2n+1)!}$ · $\cos x = \sum\frac{(-1)^n x^{2n}}{(2n)!}$ $(R = \infty)$<br>
$\frac{1}{1-x} = \sum x^n$ · $\ln(1+x) = \sum_{n\ge1}\frac{(-1)^{n+1}x^n}{n}$ · $\arctan x = \sum\frac{(-1)^n x^{2n+1}}{2n+1}$ $(R = 1)$<br>
$(1+x)^\alpha = \sum\binom{\alpha}{n}x^n$ $(R = 1$ για $\alpha\notin\{0,1,2,\dots\})$. Νέες σειρές προκύπτουν με αντικατάσταση, γινόμενο με πολυώνυμο, παραγώγιση, ολοκλήρωση.</p></div>
<div class="tbox"><h4>Υπόλοιπο Taylor (Lagrange)</h4>
<p>$f(x) = T_n(x) + R_n(x)$ με $R_n(x) = \dfrac{f^{(n+1)}(\xi)}{(n+1)!}(x - a)^{n+1}$ για κάποιο $\xi$ μεταξύ $a$ και $x$. Αν $|f^{(n+1)}| \le M$, τότε $|R_n(x)| \le \frac{M|x - a|^{n+1}}{(n+1)!}$. Η σειρά Taylor συγκλίνει στην $f$ ανν $R_n(x) \to 0$.</p></div>
<div class="tbox tip"><h4>Εφαρμογή στα όρια</h4>
<p>$\lim_{x\to0}\frac{\sin x - x}{x^3} = \lim\frac{-\frac{x^3}{6} + \frac{x^5}{120} - \dots}{x^3} = -\frac16$ — χωρίς τρεις εφαρμογές του de l'Hôpital.</p></div>`,
  widget: "m2ataylor",
  gen: "m2atay",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε τον συντελεστή του $x^3$ στη σειρά Maclaurin της $e^{2x}$.`, fields: [{ label: "συντελεστής =", ans: "4/3" }],
      hint: R`$e^{u} = \sum\frac{u^n}{n!}$ με $u = 2x$.`, sol: R`$\frac{(2x)^3}{3!} = \frac{8x^3}{6}$, συντελεστής $\frac86 = \frac43$.` },
    { level: 1, type: "fields", q: R`Το πολυώνυμο Taylor δεύτερου βαθμού της $\cos x$ στο $0$ είναι $T_2(x) = 1 + c\,x^2$. Να βρείτε το $c$.`, fields: [{ label: "c =", ans: "-1/2" }],
      hint: R`$\cos 0 = 1$, $\cos'(0) = 0$, $\cos''(0) = -1$.`, sol: R`$T_2(x) = 1 + 0\cdot x + \frac{-1}{2!}x^2$, άρα $c = -\frac12$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τον συντελεστή του $(x-1)^3$ στη σειρά Taylor της $\ln x$ γύρω από το $a = 1$.`, fields: [{ label: "συντελεστής =", ans: "1/3" }],
      hint: R`$\ln x = \ln(1 + (x - 1))$.`, sol: R`Με $u = x - 1$: $\ln(1 + u) = u - \frac{u^2}{2} + \frac{u^3}{3} - \dots$, άρα $\frac13$. (Ή: $f'''(x) = \frac{2}{x^3}$, $\frac{f'''(1)}{3!} = \frac26 = \frac13$.)` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\lim_{x\to 0}\dfrac{\sin x - x}{x^3}$.`, fields: [{ label: "όριο =", ans: "-1/6" }],
      hint: R`$\sin x = x - \frac{x^3}{6} + \dots$`, sol: R`$\frac{-\frac{x^3}{6} + \frac{x^5}{120} - \dots}{x^3} = -\frac16 + \frac{x^2}{120} - \dots \to -\frac16$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\lim_{x\to 0}\dfrac{e^x - 1 - x}{x^2}$.`, fields: [{ label: "όριο =", ans: "1/2" }],
      hint: R`$e^x = 1 + x + \frac{x^2}{2} + \dots$`, sol: R`$\frac{\frac{x^2}{2} + \frac{x^3}{6} + \dots}{x^2} \to \frac12$.` },
    { level: 1, type: "fields", q: R`Με το πολυώνυμο $T_2$ της $e^x$ στο $0$, να προσεγγίσετε το $e^{0{,}1}$.`, fields: [{ label: "T₂(0,1) =", ans: 1.105, tol: 1e-6 }],
      hint: R`$T_2(x) = 1 + x + \frac{x^2}{2}$.`, sol: R`$1 + 0{,}1 + \frac{0{,}01}{2} = 1{,}105$ (η πραγματική τιμή είναι $1{,}10517\dots$).` },
    { level: 2, type: "fields", q: R`Να βρείτε την παράγωγο $f^{(5)}(0)$ της $f(x) = x^2e^x$, χρησιμοποιώντας τη σειρά Maclaurin.`, fields: [{ label: "f⁽⁵⁾(0) =", ans: 20 }],
      hint: R`$x^2e^x = \sum\frac{x^{n+2}}{n!}$· ο συντελεστής του $x^5$ είναι $\frac{f^{(5)}(0)}{5!}$.`, sol: R`Ο όρος με $x^5$ έχει $n = 3$: συντελεστής $\frac{1}{3!} = \frac16$. Άρα $f^{(5)}(0) = \frac{5!}{6} = 20$.` },
    { level: 3, type: "fields", q: R`Χρησιμοποιώντας ότι $e < 3$, το υπόλοιπο Lagrange δίνει $|e - T_n(1)| \le \dfrac{3}{(n+1)!}$ για την $f(x) = e^x$ στο $x = 1$. Ποιο είναι το μικρότερο $n$ για το οποίο αυτό το φράγμα είναι μικρότερο από $0{,}001$;`,
      fields: [{ label: "n =", ans: 6 }], hint: R`Χρειαζόμαστε $(n+1)! > 3000$.`, sol: R`$6! = 720$ (δεν φτάνει), $7! = 5040 > 3000$. Άρα $n + 1 = 7$, $n = 6$: $T_6(1) = 1 + 1 + \frac12 + \dots + \frac{1}{720} \approx 2{,}71806$.` },
    { level: 2, type: "mc", q: R`Η σειρά Maclaurin της $f(x) = \dfrac{1}{1 + x^2}$ και η ακτίνα σύγκλισής της είναι:`,
      options: ["$\\sum (-1)^n x^{2n}$, $R = 1$", "$\\sum x^{2n}$, $R = 1$", "$\\sum (-1)^n x^{2n}$, $R = \\infty$", "$\\sum (-1)^n x^{n}$, $R = 1$"], correct: 0,
      hint: R`Γεωμετρική με $u = -x^2$.`, sol: R`$\frac{1}{1 - (-x^2)} = \sum(-x^2)^n = \sum(-1)^nx^{2n}$, για $|x^2| < 1 \iff |x| < 1$: $R = 1$ (παρότι η $f$ ορίζεται παντού!).` },
    { level: 3, type: "fields", q: R`Ολοκληρώνοντας τη σειρά της $\frac{1}{1+t^2}$ από $0$ έως $x$ παίρνουμε τη σειρά της $\arctan x$. Ποιος είναι ο συντελεστής του $x^5$;`, fields: [{ label: "συντελεστής =", ans: "1/5" }],
      hint: R`$\int_0^x t^4\,dt = \frac{x^5}{5}$.`, sol: R`$\arctan x = x - \frac{x^3}{3} + \frac{x^5}{5} - \dots$, άρα $\frac15$.` }
  ]
},
/* ───────────────────────────── 4.1 ───────────────────────────── */
{
  id: "4.1", unit: 4, title: "Παραμετρικές καμπύλες – Εφαπτομένη – Μήκος τόξου",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 4 · Βλ. και Stewart, Λογισμός, «Παραμετρικές εξισώσεις»",
  theory: R`
<div class="tbox"><h4>Παραμετρική καμπύλη</h4>
<p>Μια <b>παραμετρική καμπύλη</b> δίνεται από δύο συναρτήσεις μιας παραμέτρου $t \in I$: $\ x = f(t),\ y = g(t)$. Καθώς το $t$ αυξάνεται, το σημείο $(f(t), g(t))$ διαγράφει την καμπύλη με ορισμένη <b>φορά</b>. Η ίδια καμπύλη μπορεί να έχει πολλές παραμετρικοποιήσεις (π.χ. $x = \cos t,\ y = \sin t,\ t \in [0, 2\pi]$ και $x = \cos 2t,\ y = \sin 2t,\ t \in [0, \pi]$).</p>
<p><b>Απαλοιφή της παραμέτρου:</b> $x = 2\cos t,\ y = 3\sin t \Rightarrow \frac{x^2}{4} + \frac{y^2}{9} = \cos^2 t + \sin^2 t = 1$ (έλλειψη).</p></div>
<div class="tbox"><h4>Εφαπτομένη</h4>
<p>Αν οι $f, g$ είναι παραγωγίσιμες και $\frac{dx}{dt} \ne 0$, τότε
$$\frac{dy}{dx} = \frac{dy/dt}{dx/dt}, \qquad \frac{d^2y}{dx^2} = \frac{\frac{d}{dt}\left(\frac{dy}{dx}\right)}{dx/dt}.$$</p>
<ul><li><b>Οριζόντια</b> εφαπτομένη: $\frac{dy}{dt} = 0$ και $\frac{dx}{dt} \ne 0$.</li>
<li><b>Κατακόρυφη</b> εφαπτομένη: $\frac{dx}{dt} = 0$ και $\frac{dy}{dt} \ne 0$.</li>
<li>Αν μηδενίζονται και οι δύο, χρειάζεται ξεχωριστή μελέτη (π.χ. «ακίδα» της κυκλοειδούς).</li></ul></div>
<div class="tbox tip"><h4>Μήκος τόξου</h4>
<p>Αν οι $f', g'$ είναι συνεχείς στο $[\alpha, \beta]$ και η καμπύλη διαγράφεται <b>μία φορά</b> καθώς το $t$ πηγαίνει από $\alpha$ σε $\beta$:
$$L = \int_\alpha^\beta \sqrt{\left(\frac{dx}{dt}\right)^2 + \left(\frac{dy}{dt}\right)^2}\,dt.$$</p>
<p>Παράδειγμα: για $x = 3\cos t,\ y = 3\sin t,\ 0 \le t \le \pi$ είναι $\sqrt{9\sin^2 t + 9\cos^2 t} = 3$, άρα $L = 3\pi$ (ημικύκλιο ακτίνας $3$).</p></div>
<div class="tbox warn"><h4>Προσοχή</h4><p>Αν η καμπύλη διαγράφεται δύο φορές (π.χ. $x = \cos 2t,\ y = \sin 2t,\ 0 \le t \le 2\pi$), ο τύπος δίνει το <b>διπλάσιο</b> του γεωμετρικού μήκους.</p></div>`,
  widget: "m2bparam",
  gen: "m2bparam",
  exercises: [
    { level: 1, type: "fields", q: R`Δίνεται η καμπύλη $x = t^2 + 1$, $y = t^3 - t$. Να βρείτε την κλίση $\frac{dy}{dx}$ της εφαπτομένης στο σημείο με $t = 2$.`,
      fields: [{ label: "dy/dx =", ans: "11/4" }], hint: R`$\frac{dy}{dx} = \frac{3t^2 - 1}{2t}$.`, sol: R`$\frac{dx}{dt} = 2t = 4$, $\frac{dy}{dt} = 3t^2 - 1 = 11$, άρα $\frac{dy}{dx} = \frac{11}{4}$.` },
    { level: 1, type: "mc", q: R`Η καμπύλη $x = 2\cos t$, $y = 3\sin t$, $0 \le t \le 2\pi$, είναι:`,
      options: ["η έλλειψη $\\frac{x^2}{4} + \\frac{y^2}{9} = 1$", "ο κύκλος $x^2 + y^2 = 6$", "η υπερβολή $\\frac{x^2}{4} - \\frac{y^2}{9} = 1$", "η έλλειψη $\\frac{x^2}{9} + \\frac{y^2}{4} = 1$"], correct: 0,
      hint: R`$\cos t = \frac x2$, $\sin t = \frac y3$.`, sol: R`$\left(\frac x2\right)^2 + \left(\frac y3\right)^2 = \cos^2 t + \sin^2 t = 1$: έλλειψη με ημιάξονες $2$ (στον $x$) και $3$ (στον $y$).` },
    { level: 1, type: "fields", q: R`Να βρείτε την εξίσωση $y = \lambda x + \beta$ της εφαπτομένης της καμπύλης $x = t^2$, $y = t^3$ στο σημείο με $t = 1$.`,
      fields: [{ label: "λ =", ans: "3/2" }, { label: "β =", ans: "-1/2" }], hint: R`Σημείο $(1, 1)$, κλίση $\frac{3t^2}{2t}$.`,
      sol: R`Για $t = 1$: σημείο $(1, 1)$, $\frac{dy}{dx} = \frac{3t^2}{2t} = \frac32$. Εφαπτομένη: $y - 1 = \frac32(x - 1) \Rightarrow y = \frac32 x - \frac12$.` },
    { level: 2, type: "fields", q: R`Η καμπύλη $x = t^3 - 3t$, $y = t^2 - 4t$ έχει οριζόντια εφαπτομένη σε ένα σημείο. Να το βρείτε.`,
      fields: [{ label: "x =", ans: 2 }, { label: "y =", ans: -4 }], hint: R`$\frac{dy}{dt} = 0$ με $\frac{dx}{dt} \ne 0$.`,
      sol: R`$\frac{dy}{dt} = 2t - 4 = 0 \Rightarrow t = 2$, και $\frac{dx}{dt} = 3t^2 - 3 = 9 \ne 0$. Σημείο: $x = 8 - 6 = 2$, $y = 4 - 8 = -4$.` },
    { level: 2, type: "fields", q: R`Η καμπύλη $x = t^2 - 2t$, $y = t^3 - 12t$ έχει κατακόρυφη εφαπτομένη σε ένα σημείο. Να το βρείτε.`,
      fields: [{ label: "x =", ans: -1 }, { label: "y =", ans: -11 }], hint: R`Κατακόρυφη: $\frac{dx}{dt} = 0$, $\frac{dy}{dt} \ne 0$.`,
      sol: R`$\frac{dx}{dt} = 2t - 2 = 0 \Rightarrow t = 1$, $\frac{dy}{dt} = 3 - 12 = -9 \ne 0$. Σημείο: $(1 - 2,\ 1 - 12) = (-1, -11)$.` },
    { level: 2, type: "fields", q: R`Για την καμπύλη $x = t^2$, $y = t^3$ ($t > 0$) να υπολογίσετε τη $\frac{d^2y}{dx^2}$ στο σημείο με $t = 1$.`,
      fields: [{ label: "d²y/dx² =", ans: "3/4" }], hint: R`Πρώτα $\frac{dy}{dx} = \frac{3t}{2}$· μετά παραγωγίζουμε ως προς $t$ και διαιρούμε με $\frac{dx}{dt}$.`,
      sol: R`$\frac{dy}{dx} = \frac{3t^2}{2t} = \frac{3t}{2}$, $\frac{d}{dt}\left(\frac{3t}{2}\right) = \frac32$, άρα $\frac{d^2y}{dx^2} = \frac{3/2}{2t} = \frac{3}{4t} = \frac34$ για $t = 1$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το μήκος του τόξου της καμπύλης $x = \frac{t^3}{3}$, $y = \frac{t^2}{2}$ για $0 \le t \le \sqrt3$.`,
      fields: [{ label: "L =", ans: "7/3" }], hint: R`$\sqrt{t^4 + t^2} = t\sqrt{t^2 + 1}$ για $t \ge 0$· αντικατάσταση $u = t^2 + 1$.`,
      sol: R`$x' = t^2$, $y' = t$: $L = \int_0^{\sqrt3} t\sqrt{t^2 + 1}\,dt = \left[\frac13(t^2 + 1)^{3/2}\right]_0^{\sqrt3} = \frac13(8 - 1) = \frac73$.` },
    { level: 3, type: "fields", q: R`Να βρείτε το μήκος της καμπύλης $x = e^t\cos t$, $y = e^t\sin t$ για $0 \le t \le \ln 2$ (σε δεκαδική μορφή, 3 δεκαδικά).`,
      fields: [{ label: "L ≈", ans: 1.41421, tol: 0.002 }], hint: R`Υπολογίστε $x'^2 + y'^2$· απλοποιείται σε $2e^{2t}$.`,
      sol: R`$x' = e^t(\cos t - \sin t)$, $y' = e^t(\sin t + \cos t)$, άρα $x'^2 + y'^2 = e^{2t}\cdot 2$. $L = \int_0^{\ln 2}\sqrt2\,e^t\,dt = \sqrt2(2 - 1) = \sqrt2 \approx 1{,}414$.` },
    { level: 1, type: "mc", q: R`Η καμπύλη $x = \cos 2t$, $y = \sin 2t$, $0 \le t \le 2\pi$, διαγράφει τον μοναδιαίο κύκλο ακριβώς μία φορά.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Πόσο μεταβάλλεται η γωνία $2t$;`, sol: R`Λάθος: το $2t$ διατρέχει το $[0, 4\pi]$, οπότε ο κύκλος διαγράφεται <b>δύο</b> φορές (και ο τύπος του μήκους θα έδινε $4\pi$).` }
  ]
},
/* ───────────────────────────── 4.2 ───────────────────────────── */
{
  id: "4.2", unit: 4, title: "Πολικές συντεταγμένες – Πολικές καμπύλες – Εμβαδόν",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 4 · Βλ. και Stewart, Λογισμός, «Πολικές συντεταγμένες»",
  theory: R`
<div class="tbox"><h4>Πολικές συντεταγμένες</h4>
<p>Το σημείο με πολικές συντεταγμένες $(r, \theta)$ έχει καρτεσιανές
$$x = r\cos\theta, \qquad y = r\sin\theta, \qquad\text{και}\qquad r^2 = x^2 + y^2,\ \ \tan\theta = \frac yx\ (x \ne 0).$$
Το $\theta$ επιλέγεται σύμφωνα με το <b>τεταρτημόριο</b> του σημείου (το $\arctan\frac yx$ μόνο δεν αρκεί). Η αναπαράσταση δεν είναι μοναδική: $(r, \theta) = (r, \theta + 2\pi) = (-r, \theta + \pi)$.</p></div>
<div class="tbox"><h4>Βασικές πολικές καμπύλες</h4>
<ul><li>$r = a$: κύκλος κέντρου $O$, ακτίνας $|a|$ · $\ \theta = \alpha$: ευθεία από το $O$.</li>
<li>$r = 2a\cos\theta$: κύκλος $x^2 + y^2 = 2ax$ (κέντρο $(a, 0)$) · $\ r = 2a\sin\theta$: κύκλος κέντρου $(0, a)$.</li>
<li>$r = a(1 + \cos\theta)$: καρδιοειδής · $\ r = a\cos(n\theta)$ ή $a\sin(n\theta)$: ρόδο με $n$ φύλλα αν $n$ περιττός, $2n$ αν $n$ άρτιος.</li></ul>
<p>Κλίση εφαπτομένης της $r = f(\theta)$: $\ \frac{dy}{dx} = \frac{f'(\theta)\sin\theta + f(\theta)\cos\theta}{f'(\theta)\cos\theta - f(\theta)\sin\theta}$.</p></div>
<div class="tbox tip"><h4>Εμβαδόν σε πολικές</h4>
<p>Το εμβαδόν του χωρίου που σαρώνει η $r = f(\theta)$, $\alpha \le \theta \le \beta$ (με $0 < \beta - \alpha \le 2\pi$), είναι
$$A = \frac12\int_\alpha^\beta [f(\theta)]^2\,d\theta.$$
Παράδειγμα: καρδιοειδής $r = 1 + \cos\theta$: $\ A = \frac12\int_0^{2\pi}(1 + \cos\theta)^2 d\theta = \frac12\left(2\pi + 0 + \pi\right) = \frac{3\pi}{2}$.</p></div>
<div class="tbox warn"><h4>Προσοχή</h4><p>Σε ρόδα και σε καμπύλες με $r < 0$, ολοκληρώνουμε σε διάστημα που σαρώνει κάθε κομμάτι <b>μία</b> φορά (π.χ. ένα φύλλο του $r = \cos 2\theta$: $-\frac\pi4 \le \theta \le \frac\pi4$) και πολλαπλασιάζουμε με το πλήθος των φύλλων.</p></div>`,
  widget: "m2bpolar",
  gen: "m2bpolar",
  exercises: [
    { level: 1, type: "fields", q: R`Να μετατρέψετε σε καρτεσιανές συντεταγμένες το σημείο με πολικές συντεταγμένες $\left(2, \frac{\pi}{3}\right)$ (το $y$ με 3 δεκαδικά).`,
      fields: [{ label: "x =", ans: 1 }, { label: "y ≈", ans: 1.73205, tol: 0.001 }], hint: R`$x = r\cos\theta$, $y = r\sin\theta$.`, sol: R`$x = 2\cos\frac\pi3 = 1$, $y = 2\sin\frac\pi3 = \sqrt3 \approx 1{,}732$.` },
    { level: 1, type: "fields", q: R`Το σημείο $(-1, 1)$ έχει πολικές συντεταγμένες $(r, \theta)$ με $r > 0$, $0 \le \theta < 2\pi$. Να δώσετε το $r^2$ και τον λόγο $\theta/\pi$.`,
      fields: [{ label: "r² =", ans: 2 }, { label: "θ/π =", ans: "3/4" }], hint: R`Το σημείο βρίσκεται στο 2ο τεταρτημόριο.`,
      sol: R`$r^2 = 1 + 1 = 2$ ($r = \sqrt2$). $\tan\theta = -1$ στο 2ο τεταρτημόριο ⇒ $\theta = \frac{3\pi}{4}$.` },
    { level: 1, type: "mc", q: R`Η πολική καμπύλη $r\cos\theta = 2$ είναι:`, options: ["η ευθεία $x = 2$", "ο κύκλος $x^2 + y^2 = 4$", "η ευθεία $y = 2$", "ο κύκλος $x^2 + y^2 = 2x$"], correct: 0,
      hint: R`$r\cos\theta = x$.`, sol: R`$r\cos\theta = x$, άρα η καμπύλη είναι η κατακόρυφη ευθεία $x = 2$.` },
    { level: 2, type: "fields", q: R`Η καμπύλη $r = 4\sin\theta$ είναι κύκλος. Να βρείτε την τεταγμένη $y_0$ του κέντρου του $(0, y_0)$ και την ακτίνα του.`,
      fields: [{ label: "y₀ =", ans: 2 }, { label: "ακτίνα =", ans: 2 }], hint: R`Πολλαπλασιάστε με $r$: $r^2 = 4r\sin\theta$.`,
      sol: R`$r^2 = 4r\sin\theta \Rightarrow x^2 + y^2 = 4y \Rightarrow x^2 + (y - 2)^2 = 4$: κέντρο $(0, 2)$, ακτίνα $2$.` },
    { level: 2, type: "fields", q: R`Πόσα φύλλα έχει το ρόδο $r = \sin 3\theta$ και πόσα το $r = \sin 4\theta$;`,
      fields: [{ label: "sin 3θ:", ans: 3 }, { label: "sin 4θ:", ans: 8 }], hint: R`$n$ περιττός: $n$ φύλλα· $n$ άρτιος: $2n$ φύλλα.`, sol: R`$n = 3$ (περιττός) ⇒ $3$ φύλλα· $n = 4$ (άρτιος) ⇒ $8$ φύλλα.` },
    { level: 2, type: "fields", q: R`Να βρείτε το εμβαδόν που περικλείει η καρδιοειδής $r = 1 + \cos\theta$. Αν $A = \kappa\pi$, πόσο είναι το $\kappa$;`,
      fields: [{ label: "κ =", ans: "3/2" }], hint: R`$\cos^2\theta = \frac{1 + \cos 2\theta}{2}$.`,
      sol: R`$A = \frac12\int_0^{2\pi}(1 + 2\cos\theta + \cos^2\theta)\,d\theta = \frac12\left(2\pi + 0 + \pi\right) = \frac{3\pi}{2}$, άρα $\kappa = \frac32$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το εμβαδόν <b>ενός</b> φύλλου του ρόδου $r = \cos 2\theta$. Αν $A = \kappa\pi$, πόσο είναι το $\kappa$;`,
      fields: [{ label: "κ =", ans: "1/8" }], hint: R`Ένα φύλλο: $-\frac\pi4 \le \theta \le \frac\pi4$.`,
      sol: R`$A = \frac12\int_{-\pi/4}^{\pi/4}\cos^2 2\theta\,d\theta = \frac12\int_{-\pi/4}^{\pi/4}\frac{1 + \cos 4\theta}{2}\,d\theta = \frac12\cdot\frac{\pi}{4} = \frac{\pi}{8}$.` },
    { level: 3, type: "fields", q: R`Να βρείτε την κλίση της εφαπτομένης της σπείρας $r = \theta$ στο σημείο με $\theta = \frac\pi2$ (3 δεκαδικά).`,
      fields: [{ label: "dy/dx ≈", ans: -0.63662, tol: 0.002 }], hint: R`$\frac{dy}{dx} = \frac{r'\sin\theta + r\cos\theta}{r'\cos\theta - r\sin\theta}$ με $r' = 1$.`,
      sol: R`Στο $\theta = \frac\pi2$: αριθμητής $1\cdot 1 + \frac\pi2\cdot 0 = 1$, παρονομαστής $1\cdot 0 - \frac\pi2\cdot 1 = -\frac\pi2$. Άρα $\frac{dy}{dx} = -\frac2\pi \approx -0{,}637$.` },
    { level: 1, type: "mc", q: R`Τα ζεύγη $(2, \frac\pi6)$ και $(-2, \frac{7\pi}{6})$ παριστάνουν το ίδιο σημείο του επιπέδου.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`$(r, \theta) = (-r, \theta + \pi)$.`, sol: R`Σωστό: $(-2, \frac{7\pi}{6}) = (-2, \frac\pi6 + \pi)$, που είναι το ίδιο σημείο με το $(2, \frac\pi6)$.` }
  ]
},
/* ───────────────────────────── 5.1 ───────────────────────────── */
{
  id: "5.1", unit: 5, title: "Συναρτήσεις πολλών μεταβλητών – Ισοϋψείς – Όρια και συνέχεια",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 5 · Βλ. και Stewart, Λογισμός, «Συναρτήσεις πολλών μεταβλητών»",
  theory: R`
<div class="tbox"><h4>Πεδίο ορισμού και ισοϋψείς</h4>
<p>Μια συνάρτηση δύο μεταβλητών $f: D \subseteq \mathbb R^2 \to \mathbb R$ αντιστοιχίζει σε κάθε $(x, y) \in D$ έναν αριθμό $z = f(x, y)$. Το <b>γράφημα</b> της είναι επιφάνεια στον $\mathbb R^3$. Οι <b>ισοϋψείς καμπύλες</b> είναι τα σύνολα $f(x, y) = c$ (όπως οι ισοϋψείς ενός χάρτη).</p>
<p>Π.χ. $f = \sqrt{4 - x^2 - y^2}$: πεδίο ο κλειστός δίσκος $x^2 + y^2 \le 4$, ισοϋψείς κύκλοι· $f = \ln(y - x^2)$: πεδίο το χωρίο $y > x^2$.</p></div>
<div class="tbox"><h4>Όριο</h4>
<p>$\lim_{(x,y)\to(a,b)} f(x, y) = L$ αν για κάθε $\varepsilon > 0$ υπάρχει $\delta > 0$ ώστε $0 < \sqrt{(x - a)^2 + (y - b)^2} < \delta \Rightarrow |f(x, y) - L| < \varepsilon$. Το $(x, y)$ μπορεί να πλησιάζει το $(a, b)$ <b>από οποιονδήποτε δρόμο</b>.</p>
<ul><li><b>Μη ύπαρξη:</b> αν κατά μήκος δύο δρόμων προκύπτουν διαφορετικά όρια, το όριο δεν υπάρχει. Π.χ. $\frac{xy}{x^2 + y^2}$ κατά μήκος $y = mx$ δίνει $\frac{m}{1 + m^2}$, που εξαρτάται από το $m$.</li>
<li><b>Ύπαρξη:</b> με παρεμβολή, π.χ. $\left|\frac{x^2y}{x^2 + y^2}\right| \le |y| \to 0$, ή με πολικές $x = r\cos\theta,\ y = r\sin\theta$ και φράγμα ανεξάρτητο του $\theta$.</li></ul></div>
<div class="tbox tip"><h4>Συνέχεια</h4><p>Η $f$ είναι συνεχής στο $(a, b)$ αν $\lim_{(x,y)\to(a,b)} f(x, y) = f(a, b)$. Πολυώνυμα είναι συνεχή παντού· ρητές συναρτήσεις συνεχείς όπου ορίζονται· σύνθεση συνεχών είναι συνεχής. Έτσι π.χ. $\lim_{(x,y)\to(1,2)}\frac{x^2y + 3y}{x + y} = \frac{2 + 6}{3} = \frac83$.</p></div>
<div class="tbox warn"><h4>Προσοχή</h4><p>Το ότι το όριο είναι ίδιο κατά μήκος <b>όλων των ευθειών</b> $y = mx$ <b>δεν</b> αποδεικνύει ότι υπάρχει. Για $f = \frac{x^2y}{x^4 + y^2}$ οι ευθείες δίνουν $0$, αλλά η παραβολή $y = x^2$ δίνει $\frac12$.</p></div>`,
  widget: "m2bgrad",
  gen: "m2blim",
  exercises: [
    { level: 1, type: "mc", q: R`Το πεδίο ορισμού της $f(x, y) = \sqrt{4 - x^2 - y^2}$ είναι:`, options: ["ο κλειστός δίσκος $x^2 + y^2 \\le 4$", "ο ανοικτός δίσκος $x^2 + y^2 < 4$", "ο κύκλος $x^2 + y^2 = 4$", "το εξωτερικό του κύκλου $x^2 + y^2 = 4$"], correct: 0,
      hint: R`Ποσότητα κάτω από ρίζα $\ge 0$.`, sol: R`$4 - x^2 - y^2 \ge 0 \iff x^2 + y^2 \le 4$: κλειστός δίσκος κέντρου $O$ και ακτίνας $2$ (περιλαμβάνει τον κύκλο).` },
    { level: 1, type: "mc", q: R`Το πεδίο ορισμού της $f(x, y) = \ln(y - x^2)$ είναι:`, options: ["το σύνολο $\\{(x, y): y > x^2\\}$, πάνω από την παραβολή", "το σύνολο $\\{(x, y): y \\ge x^2\\}$", "το σύνολο $\\{(x, y): y < x^2\\}$", "όλο το $\\mathbb R^2$"], correct: 0,
      hint: R`Ο λογάριθμος ορίζεται για θετικά ορίσματα.`, sol: R`$y - x^2 > 0 \iff y > x^2$: τα σημεία αυστηρά πάνω από την παραβολή $y = x^2$.` },
    { level: 1, type: "mc", q: R`Οι ισοϋψείς καμπύλες $f(x, y) = c$ της $f(x, y) = y - x^2$ είναι:`, options: ["παραβολές $y = x^2 + c$", "κύκλοι κέντρου $O$", "ευθείες παράλληλες στην $y = x$", "υπερβολές $xy = c$"], correct: 0,
      hint: R`Λύστε την $y - x^2 = c$ ως προς $y$.`, sol: R`$y - x^2 = c \iff y = x^2 + c$: μετατοπίσεις της παραβολής $y = x^2$ κατά $c$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το $\displaystyle\lim_{(x,y)\to(1,2)}\frac{x^2y + 3y}{x + y}$.`, fields: [{ label: "=", ans: "8/3" }],
      hint: R`Ρητή συνάρτηση με μη μηδενικό παρονομαστή στο $(1, 2)$: συνεχής.`, sol: R`Η συνάρτηση είναι συνεχής στο $(1, 2)$, άρα το όριο είναι η τιμή: $\frac{2 + 6}{3} = \frac83$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το $\displaystyle\lim_{(x,y)\to(2,2)}\frac{x^2 - y^2}{x - y}$ (για $x \ne y$).`, fields: [{ label: "=", ans: 4 }],
      hint: R`Παραγοντοποίηση του αριθμητή.`, sol: R`$\frac{(x - y)(x + y)}{x - y} = x + y \to 4$.` },
    { level: 2, type: "fields", q: R`Για την $f(x, y) = \frac{xy}{x^2 + y^2}$, να βρείτε το όριο καθώς $(x, y) \to (0, 0)$ κατά μήκος της ευθείας $y = 2x$.`,
      fields: [{ label: "=", ans: "2/5" }], hint: R`Θέστε $y = 2x$ και απλοποιήστε.`, sol: R`$\frac{x\cdot 2x}{x^2 + 4x^2} = \frac{2x^2}{5x^2} = \frac25$. (Κατά μήκος του άξονα $y = 0$ το όριο είναι $0$, άρα το $\lim_{(x,y)\to(0,0)}$ <b>δεν υπάρχει</b>.)` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\displaystyle\lim_{(x,y)\to(0,0)}\frac{x^2y}{x^2 + y^2}$.`, fields: [{ label: "=", ans: 0 }],
      hint: R`$\frac{x^2}{x^2 + y^2} \le 1$.`, sol: R`$0 \le \left|\frac{x^2y}{x^2 + y^2}\right| \le |y| \to 0$, άρα από το κριτήριο παρεμβολής το όριο είναι $0$.` },
    { level: 2, type: "mc", q: R`Η συνάρτηση $f(x, y) = \frac{xy}{x^2 + y^2}$ για $(x, y) \ne (0, 0)$, με $f(0, 0) = 0$:`, options: ["δεν είναι συνεχής στο $(0, 0)$", "είναι συνεχής στο $(0, 0)$", "δεν ορίζεται στο $(0, 0)$", "έχει όριο $\\frac12$ στο $(0, 0)$"], correct: 0,
      hint: R`Συγκρίνετε τους δρόμους $y = 0$ και $y = x$.`, sol: R`Στον $y = 0$ η $f$ είναι $0$, στην $y = x$ είναι $\frac12$: το όριο δεν υπάρχει, άρα η $f$ δεν είναι συνεχής στο $(0, 0)$ (αν και ορίζεται εκεί).` },
    { level: 3, type: "mc", q: R`Αν $\lim_{x\to 0} f(x, mx) = 0$ για κάθε $m \in \mathbb R$ και $\lim_{y\to 0} f(0, y) = 0$, τότε υπάρχει το $\lim_{(x,y)\to(0,0)} f(x, y)$ και είναι $0$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Δοκιμάστε $f = \frac{x^2y}{x^4 + y^2}$ κατά μήκος $y = x^2$.`, sol: R`Λάθος. Για $f = \frac{x^2y}{x^4 + y^2}$ όλες οι ευθείες δίνουν $0$, αλλά κατά μήκος $y = x^2$ είναι $f = \frac{x^4}{2x^4} = \frac12$.` }
  ]
},
/* ───────────────────────────── 5.2 ───────────────────────────── */
{
  id: "5.2", unit: 5, title: "Μερικές παράγωγοι – Εφαπτόμενο επίπεδο – Γραμμική προσέγγιση",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 5 · Βλ. και Stewart, Λογισμός, «Μερικές παράγωγοι»",
  theory: R`
<div class="tbox"><h4>Μερικές παράγωγοι</h4>
<p>$$f_x(a, b) = \lim_{h\to 0}\frac{f(a + h, b) - f(a, b)}{h}, \qquad f_y(a, b) = \lim_{h\to 0}\frac{f(a, b + h) - f(a, b)}{h}.$$
Για την $f_x$ παραγωγίζουμε ως προς $x$ θεωρώντας το $y$ <b>σταθερά</b>. Γεωμετρικά, η $f_x(a, b)$ είναι η κλίση της τομής της επιφάνειας με το επίπεδο $y = b$.</p>
<p>Π.χ. $f = x^3y^2 + 4xy$: $\ f_x = 3x^2y^2 + 4y$, $\ f_y = 2x^3y + 4x$.</p></div>
<div class="tbox"><h4>Παράγωγοι ανώτερης τάξης</h4>
<p>$f_{xx},\ f_{xy} = (f_x)_y,\ f_{yx},\ f_{yy}$. <b>Θεώρημα Schwarz (Clairaut):</b> αν οι $f_{xy}, f_{yx}$ είναι <b>συνεχείς</b> σε ανοικτό δίσκο γύρω από το $(a, b)$, τότε $f_{xy}(a, b) = f_{yx}(a, b)$.</p></div>
<div class="tbox tip"><h4>Εφαπτόμενο επίπεδο – γραμμική προσέγγιση</h4>
<p>Αν η $f$ είναι διαφορίσιμη στο $(a, b)$ (αρκεί οι $f_x, f_y$ να είναι συνεχείς κοντά στο $(a, b)$), το εφαπτόμενο επίπεδο στο $(a, b, f(a, b))$ είναι
$$z = f(a, b) + f_x(a, b)(x - a) + f_y(a, b)(y - b),$$
και για $(x, y)$ κοντά στο $(a, b)$: $f(x, y) \approx L(x, y)$ (η ίδια έκφραση).</p>
<p>Π.χ. $f = \sqrt{x^2 + y^2}$ στο $(3, 4)$: $f = 5$, $f_x = \frac35$, $f_y = \frac45$, άρα $f(3{,}1;\ 3{,}9) \approx 5 + 0{,}06 - 0{,}08 = 4{,}98$.</p></div>
<div class="tbox warn"><h4>Προσοχή</h4><p>Η ύπαρξη των μερικών παραγώγων σε ένα σημείο <b>δεν</b> εξασφαλίζει ούτε συνέχεια ούτε διαφορισιμότητα: η $\frac{xy}{x^2 + y^2}$ (με $f(0, 0) = 0$) έχει $f_x(0, 0) = f_y(0, 0) = 0$, αλλά δεν είναι συνεχής στο $(0, 0)$.</p></div>`,
  widget: "m2bslice",
  gen: "m2bpart",
  exercises: [
    { level: 1, type: "fields", q: R`Για την $f(x, y) = x^3y^2 + 4xy$ να βρείτε τις $f_x(1, 2)$ και $f_y(1, 2)$.`,
      fields: [{ label: "f_x =", ans: 20 }, { label: "f_y =", ans: 8 }], hint: R`$f_x = 3x^2y^2 + 4y$, $f_y = 2x^3y + 4x$.`, sol: R`$f_x(1, 2) = 3\cdot 4 + 8 = 20$, $f_y(1, 2) = 2\cdot 2 + 4 = 8$.` },
    { level: 1, type: "fields", q: R`Για την $f(x, y) = e^{xy}$ να βρείτε τις $f_x(0, 3)$ και $f_{xy}(0, 3)$.`,
      fields: [{ label: "f_x =", ans: 3 }, { label: "f_xy =", ans: 1 }], hint: R`$f_x = y e^{xy}$· παραγωγίστε το γινόμενο ως προς $y$.`,
      sol: R`$f_x = ye^{xy} \Rightarrow f_x(0, 3) = 3$. $f_{xy} = e^{xy} + xye^{xy} \Rightarrow f_{xy}(0, 3) = 1$.` },
    { level: 1, type: "fields", q: R`Για την $f(x, y) = \ln(x^2 + y^2)$ να βρείτε την $f_x(1, 1)$.`, fields: [{ label: "f_x =", ans: 1 }],
      hint: R`Κανόνας αλυσίδας: $(\ln u)' = \frac{u'}{u}$.`, sol: R`$f_x = \frac{2x}{x^2 + y^2} = \frac{2}{2} = 1$.` },
    { level: 2, type: "fields", q: R`Για την $f(x, y) = \sin x\cos y$ να βρείτε την $f_{xy}\left(0, \frac\pi2\right)$.`, fields: [{ label: "f_xy =", ans: -1 }],
      hint: R`$f_x = \cos x\cos y$.`, sol: R`$f_x = \cos x\cos y$, $f_{xy} = -\cos x\sin y$. Στο $(0, \frac\pi2)$: $-1\cdot 1 = -1$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το εφαπτόμενο επίπεδο $z = \alpha x + \beta y + \gamma$ της επιφάνειας $z = x^2 + y^2$ στο σημείο $(1, 2, 5)$.`,
      fields: [{ label: "α =", ans: 2 }, { label: "β =", ans: 4 }, { label: "γ =", ans: -5 }], hint: R`$z = f(1, 2) + f_x(1, 2)(x - 1) + f_y(1, 2)(y - 2)$.`,
      sol: R`$f_x = 2x = 2$, $f_y = 2y = 4$: $z = 5 + 2(x - 1) + 4(y - 2) = 2x + 4y - 5$.` },
    { level: 2, type: "fields", q: R`Με γραμμική προσέγγιση της $f(x, y) = \sqrt{x^2 + y^2}$ γύρω από το $(3, 4)$, να εκτιμήσετε την τιμή $f(3{,}1;\ 3{,}9)$.`,
      fields: [{ label: "f ≈", ans: 4.98, tol: 0.0002 }], hint: R`$f_x = \frac{x}{\sqrt{x^2 + y^2}}$, $f_y = \frac{y}{\sqrt{x^2 + y^2}}$.`,
      sol: R`$L = 5 + \frac35(0{,}1) + \frac45(-0{,}1) = 5 + 0{,}06 - 0{,}08 = 4{,}98$ (πραγματική τιμή $\approx 4{,}9820$).` },
    { level: 2, type: "fields", q: R`Για την $f(x, y) = x^2y - y^3$ να υπολογίσετε το $f_{xx} + f_{yy}$ στο σημείο $(1, 2)$.`, fields: [{ label: "=", ans: -8 }],
      hint: R`$f_{xx} = 2y$, $f_{yy} = -6y$.`, sol: R`$f_{xx} + f_{yy} = 2y - 6y = -4y = -8$ στο $(1, 2)$ (άρα η $f$ δεν είναι αρμονική).` },
    { level: 2, type: "mc", q: R`Το θεώρημα Schwarz εξασφαλίζει $f_{xy}(a, b) = f_{yx}(a, b)$ όταν:`, options: ["οι $f_{xy}, f_{yx}$ είναι συνεχείς σε έναν ανοικτό δίσκο γύρω από το $(a, b)$", "υπάρχουν οι $f_x, f_y$ στο $(a, b)$", "η $f$ είναι συνεχής στο $(a, b)$", "πάντα, για κάθε συνάρτηση"], correct: 0,
      hint: R`Χρειάζεται υπόθεση για τις μικτές παραγώγους.`, sol: R`Η υπόθεση είναι η συνέχεια των μικτών παραγώγων σε περιοχή του σημείου· χωρίς αυτήν υπάρχουν αντιπαραδείγματα με $f_{xy} \ne f_{yx}$.` },
    { level: 3, type: "mc", q: R`Αν υπάρχουν οι $f_x(a, b)$ και $f_y(a, b)$, τότε η $f$ είναι συνεχής στο $(a, b)$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Σκεφτείτε την $\frac{xy}{x^2 + y^2}$ με $f(0, 0) = 0$.`, sol: R`Λάθος: για αυτή τη συνάρτηση $f_x(0, 0) = f_y(0, 0) = 0$ (είναι $0$ πάνω στους άξονες), αλλά η $f$ δεν είναι συνεχής στο $(0, 0)$.` }
  ]
},
/* ───────────────────────────── 5.3 ───────────────────────────── */
{
  id: "5.3", unit: 5, title: "Κανόνας αλυσίδας – Κλίση – Κατευθυνόμενη παράγωγος",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 5 · Βλ. και Stewart, Λογισμός, «Κανόνας αλυσίδας», «Κατευθυνόμενες παράγωγοι»",
  theory: R`
<div class="tbox"><h4>Κανόνας αλυσίδας</h4>
<p>Αν η $z = f(x, y)$ είναι διαφορίσιμη και $x = x(t),\ y = y(t)$ παραγωγίσιμες:
$$\frac{dz}{dt} = f_x\frac{dx}{dt} + f_y\frac{dy}{dt}.$$
Αν $x = x(s, t),\ y = y(s, t)$: $\ \frac{\partial z}{\partial s} = f_x\frac{\partial x}{\partial s} + f_y\frac{\partial y}{\partial s}$, ομοίως για το $t$.</p>
<p><b>Πεπλεγμένη παραγώγιση:</b> αν η $F$ έχει συνεχείς μερικές παραγώγους, η $F(x, y) = 0$ ορίζει την $y = y(x)$ και $F_y \ne 0$, τότε $\frac{dy}{dx} = -\frac{F_x}{F_y}$.</p></div>
<div class="tbox"><h4>Κλίση και κατευθυνόμενη παράγωγος</h4>
<p>Η <b>κλίση</b> (gradient) είναι το διάνυσμα $\nabla f = (f_x, f_y)$. Για <b>μοναδιαίο</b> διάνυσμα $\vec u = (u_1, u_2)$, η κατευθυνόμενη παράγωγος ορίζεται ως $D_{\vec u}f(a, b) = \lim_{h\to0}\frac{f(a + hu_1,\, b + hu_2) - f(a, b)}{h}$. Αν η $f$ είναι <b>διαφορίσιμη</b> στο $(a, b)$, τότε
$$D_{\vec u}f(a, b) = \nabla f(a, b)\cdot\vec u.$$
Αν δίνεται μη μοναδιαίο $\vec v$, χρησιμοποιούμε $\vec u = \vec v/\|\vec v\|$.</p></div>
<div class="tbox tip"><h4>Ιδιότητες της κλίσης</h4>
<ul><li>(Για διαφορίσιμη $f$ με $\nabla f(a, b)\ne\vec 0$.) $D_{\vec u}f = \|\nabla f\|\cos\theta$: <b>μέγιστη</b> τιμή $\|\nabla f\|$ στην κατεύθυνση του $\nabla f$, <b>ελάχιστη</b> $-\|\nabla f\|$ στην κατεύθυνση του $-\nabla f$.</li>
<li>Για διαφορίσιμη $f$ με $\nabla f(a, b)\ne\vec 0$, το $\nabla f(a, b)$ είναι <b>κάθετο</b> στην ισοϋψή που περνά από το $(a, b)$· έτσι η εφαπτομένη της $f(x, y) = c$ στο $(a, b)$ είναι $f_x(a, b)(x - a) + f_y(a, b)(y - b) = 0$.</li></ul>
<p>Π.χ. $f = x^2 + y^2$ στο $(1, 2)$, $\vec v = (3, 4)$: $\nabla f = (2, 4)$, $\vec u = (\frac35, \frac45)$, $D_{\vec u}f = \frac65 + \frac{16}{5} = \frac{22}{5}$.</p></div>`,
  widget: "m2bgrad",
  gen: "m2bgrad",
  exercises: [
    { level: 1, type: "fields", q: R`Αν $z = x^2y$ με $x = t^2$, $y = t^3$, να βρείτε το $\frac{dz}{dt}$ για $t = 1$ με τον κανόνα αλυσίδας.`, fields: [{ label: "dz/dt =", ans: 7 }],
      hint: R`$\frac{dz}{dt} = 2xy\cdot 2t + x^2\cdot 3t^2$.`, sol: R`Για $t = 1$: $x = y = 1$, άρα $\frac{dz}{dt} = 2\cdot 1\cdot 1\cdot 2 + 1\cdot 3 = 7$. (Έλεγχος: $z = t^7$, $z' = 7t^6 = 7$.)` },
    { level: 1, type: "fields", q: R`Να βρείτε την κλίση $\nabla f(1, 2)$ της $f(x, y) = x^2 + 3xy$.`, fields: [{ label: "f_x =", ans: 8 }, { label: "f_y =", ans: 3 }],
      hint: R`$\nabla f = (2x + 3y,\ 3x)$.`, sol: R`$\nabla f(1, 2) = (2 + 6,\ 3) = (8, 3)$.` },
    { level: 1, type: "fields", q: R`Να βρείτε την κατευθυνόμενη παράγωγο της $f(x, y) = x^2 + y^2$ στο $(1, 2)$ προς την κατεύθυνση του $\vec v = (3, 4)$.`, fields: [{ label: "D_u f =", ans: "22/5" }],
      hint: R`Κανονικοποιήστε το $\vec v$ πρώτα.`, sol: R`$\nabla f = (2, 4)$, $\vec u = (\frac35, \frac45)$: $D_{\vec u}f = \frac65 + \frac{16}{5} = \frac{22}{5}$.` },
    { level: 2, type: "fields", q: R`Ποιος είναι ο μέγιστος ρυθμός μεταβολής της $f(x, y) = xe^y$ στο $(2, 0)$; (3 δεκαδικά)`, fields: [{ label: "max ≈", ans: 2.23607, tol: 0.001 }],
      hint: R`Ο μέγιστος ρυθμός είναι $\|\nabla f\|$.`, sol: R`$\nabla f = (e^y,\ xe^y) = (1, 2)$ στο $(2, 0)$· μέγιστος ρυθμός $\|\nabla f\| = \sqrt5 \approx 2{,}236$, στην κατεύθυνση του $(1, 2)$.` },
    { level: 1, type: "fields", q: R`Η $x^2 + y^2 = 25$ ορίζει πεπλεγμένα την $y = y(x)$ κοντά στο $(3, 4)$. Να βρείτε το $\frac{dy}{dx}$ στο $(3, 4)$.`, fields: [{ label: "dy/dx =", ans: "-3/4" }],
      hint: R`$\frac{dy}{dx} = -\frac{F_x}{F_y}$.`, sol: R`$F = x^2 + y^2 - 25$: $\frac{dy}{dx} = -\frac{2x}{2y} = -\frac34$.` },
    { level: 2, type: "fields", q: R`Το «φύλλο του Descartes» $x^3 + y^3 = 6xy$ περνά από το $(3, 3)$. Να βρείτε την κλίση της εφαπτομένης εκεί.`, fields: [{ label: "dy/dx =", ans: -1 }],
      hint: R`$F = x^3 + y^3 - 6xy$, $F_x = 3x^2 - 6y$, $F_y = 3y^2 - 6x$.`, sol: R`$F_x(3, 3) = 27 - 18 = 9$, $F_y(3, 3) = 27 - 18 = 9$, άρα $\frac{dy}{dx} = -\frac99 = -1$.` },
    { level: 2, type: "fields", q: R`Αν $z = xy$ με $x = s + t$, $y = s - t$, να βρείτε τα $\frac{\partial z}{\partial s}$ και $\frac{\partial z}{\partial t}$ στο $(s, t) = (3, 1)$.`,
      fields: [{ label: "∂z/∂s =", ans: 6 }, { label: "∂z/∂t =", ans: -2 }], hint: R`$z_s = y\cdot 1 + x\cdot 1$, $z_t = y\cdot 1 + x\cdot(-1)$.`,
      sol: R`Για $(s, t) = (3, 1)$: $x = 4$, $y = 2$. $z_s = y + x = 6$, $z_t = y - x = -2$. (Έλεγχος: $z = s^2 - t^2$.)` },
    { level: 1, type: "mc", q: R`Σε ένα σημείο με $\nabla f \ne \vec 0$, η $f$ <b>ελαττώνεται</b> ταχύτερα προς την κατεύθυνση:`, options: ["του $-\\nabla f$", "του $\\nabla f$", "κάθετη στο $\\nabla f$", "του άξονα $x$"], correct: 0,
      hint: R`$D_{\vec u}f = \|\nabla f\|\cos\theta$.`, sol: R`Η $D_{\vec u}f$ είναι ελάχιστη ($= -\|\nabla f\|$) όταν $\theta = \pi$, δηλαδή $\vec u$ αντίρροπο του $\nabla f$. Κάθετα στο $\nabla f$ ο ρυθμός είναι $0$ (εφαπτομένη ισοϋψούς).` },
    { level: 3, type: "fields", q: R`Η εφαπτομένη της έλλειψης $x^2 + 2y^2 = 9$ στο σημείο $(1, 2)$ γράφεται $x + \lambda y = c$. Να βρείτε τα $\lambda, c$.`,
      fields: [{ label: "λ =", ans: 4 }, { label: "c =", ans: 9 }], hint: R`Το $\nabla f(1, 2)$ είναι κάθετο στην εφαπτομένη.`,
      sol: R`$\nabla f = (2x, 4y) = (2, 8)$: $2(x - 1) + 8(y - 2) = 0 \iff 2x + 8y = 18 \iff x + 4y = 9$.` }
  ]
},
/* ───────────────────────────── 5.4 ───────────────────────────── */
{
  id: "5.4", unit: 5, title: "Τοπικά ακρότατα – Κριτήριο δεύτερων παραγώγων – Πολλαπλασιαστές Lagrange",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 5 · Βλ. και Stewart, Λογισμός, «Μέγιστα και ελάχιστα», «Πολλαπλασιαστές Lagrange»",
  theory: R`
<div class="tbox"><h4>Κρίσιμα σημεία</h4>
<p>Αν η $f$ έχει τοπικό ακρότατο στο εσωτερικό σημείο $(a, b)$ και υπάρχουν οι μερικές παράγωγοι, τότε $\nabla f(a, b) = \vec 0$. Σημεία με $\nabla f = \vec 0$ (ή όπου δεν υπάρχει κάποια μερική παράγωγος) λέγονται <b>κρίσιμα</b>. Δεν είναι όλα ακρότατα: π.χ. το $(0, 0)$ για $f = x^2 - y^2$ είναι <b>σαγματικό σημείο</b>.</p></div>
<div class="tbox"><h4>Κριτήριο δεύτερων παραγώγων</h4>
<p>Έστω ότι οι δεύτερες παράγωγοι είναι συνεχείς κοντά στο κρίσιμο σημείο $(a, b)$ και $D = f_{xx}f_{yy} - f_{xy}^2$ (ορίζουσα του πίνακα Hessian) στο $(a, b)$:</p>
<ul><li>$D > 0$ και $f_{xx} > 0$: <b>τοπικό ελάχιστο</b> · $\ D > 0$ και $f_{xx} < 0$: <b>τοπικό μέγιστο</b>.</li>
<li>$D < 0$: <b>σαγματικό σημείο</b> · $\ D = 0$: το κριτήριο <b>δεν δίνει συμπέρασμα</b> (π.χ. $x^4 + y^4$, $x^4 - y^4$ στο $(0, 0)$).</li></ul>
<p>Σε <b>κλειστό και φραγμένο</b> σύνολο, μια συνεχής $f$ παίρνει μέγιστη και ελάχιστη τιμή· τις βρίσκουμε συγκρίνοντας τις τιμές στα εσωτερικά κρίσιμα σημεία και στο σύνορο.</p></div>
<div class="tbox tip"><h4>Πολλαπλασιαστές Lagrange</h4>
<p>Αν οι $f, g$ έχουν συνεχείς μερικές παραγώγους και η $f$ έχει ακρότατο υπό τον περιορισμό $g(x, y) = k$ σε σημείο με $\nabla g \ne \vec 0$, τότε υπάρχει $\lambda$ με
$$\nabla f = \lambda\nabla g, \qquad g(x, y) = k.$$
Τα σημεία που προκύπτουν είναι <b>υποψήφια</b>· συγκρίνουμε τις τιμές της $f$ σε αυτά.
Γεωμετρικά: στο ακρότατο η ισοϋψής της $f$ <b>εφάπτεται</b> στην καμπύλη του περιορισμού.</p>
<p>Π.χ. μέγιστο της $xy$ υπό $x + y = 10$: $(y, x) = \lambda(1, 1) \Rightarrow x = y = 5$, τιμή $25$ (πράγματι $xy = x(10 - x) \le 25$).</p></div>`,
  widget: "m2bextr",
  gen: "m2bcrit",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε το κρίσιμο σημείο της $f(x, y) = x^2 + y^2 - 2x + 4y$ και την τιμή της $f$ εκεί.`,
      fields: [{ label: "x =", ans: 1 }, { label: "y =", ans: -2 }, { label: "f =", ans: -5 }], hint: R`$f_x = 2x - 2$, $f_y = 2y + 4$.`,
      sol: R`$f_x = 0 \Rightarrow x = 1$, $f_y = 0 \Rightarrow y = -2$. $f(1, -2) = 1 + 4 - 2 - 8 = -5$ (ολικό ελάχιστο, αφού $f = (x - 1)^2 + (y + 2)^2 - 5$).` },
    { level: 2, type: "mc", q: R`Η $f(x, y) = x^3 - 3x + y^2$ έχει κρίσιμα σημεία $(1, 0)$ και $(-1, 0)$. Το $(-1, 0)$ είναι:`, options: ["σαγματικό σημείο", "τοπικό ελάχιστο", "τοπικό μέγιστο", "σημείο όπου το κριτήριο δεν αποφαίνεται"], correct: 0,
      hint: R`$f_{xx} = 6x$, $f_{yy} = 2$, $f_{xy} = 0$.`, sol: R`$D = 6x\cdot 2 - 0 = 12x$. Στο $(-1, 0)$: $D = -12 < 0$ ⇒ σαγματικό σημείο. (Στο $(1, 0)$: $D = 12 > 0$, $f_{xx} = 6 > 0$ ⇒ τοπικό ελάχιστο.)` },
    { level: 2, type: "fields", q: R`Η $f(x, y) = xy - x^2 - y^2 + 3y$ έχει ένα κρίσιμο σημείο. Να το βρείτε και να δώσετε την τιμή της $f$ εκεί (είναι τοπικό μέγιστο).`,
      fields: [{ label: "x =", ans: 1 }, { label: "y =", ans: 2 }, { label: "f =", ans: 3 }], hint: R`$f_x = y - 2x = 0$, $f_y = x - 2y + 3 = 0$.`,
      sol: R`$y = 2x$ και $x - 4x + 3 = 0 \Rightarrow x = 1$, $y = 2$. $D = (-2)(-2) - 1 = 3 > 0$, $f_{xx} = -2 < 0$ ⇒ τοπικό μέγιστο $f(1, 2) = 2 - 1 - 4 + 6 = 3$.` },
    { level: 1, type: "fields", q: R`Με πολλαπλασιαστές Lagrange να βρείτε τη μέγιστη τιμή της $f = xy$ υπό τον περιορισμό $x + y = 10$.`, fields: [{ label: "max =", ans: 25 }],
      hint: R`$(y, x) = \lambda(1, 1)$.`, sol: R`$y = \lambda$, $x = \lambda$ ⇒ $x = y$, και $x + y = 10 \Rightarrow x = y = 5$, $f = 25$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το σημείο της ευθείας $x + 2y = 5$ που είναι πλησιέστερο στην αρχή των αξόνων, ελαχιστοποιώντας την $f = x^2 + y^2$, και την ελάχιστη τιμή της $f$.`,
      fields: [{ label: "x =", ans: 1 }, { label: "y =", ans: 2 }, { label: "f_min =", ans: 5 }], hint: R`$(2x, 2y) = \lambda(1, 2)$ ⇒ $y = 2x$.`,
      sol: R`$2x = \lambda$, $2y = 2\lambda$ ⇒ $y = 2x$. Τότε $x + 4x = 5 \Rightarrow x = 1$, $y = 2$, $f = 5$ (απόσταση $\sqrt5$).` },
    { level: 2, type: "fields", q: R`Να βρείτε τη μέγιστη και την ελάχιστη τιμή της $f = x + y$ πάνω στον κύκλο $x^2 + y^2 = 2$.`,
      fields: [{ label: "max =", ans: 2 }, { label: "min =", ans: -2 }], hint: R`$(1, 1) = \lambda(2x, 2y)$ ⇒ $x = y$.`,
      sol: R`$x = y = \frac{1}{2\lambda}$ και $2x^2 = 2 \Rightarrow x = \pm 1$. Στο $(1, 1)$: $f = 2$ (μέγιστο), στο $(-1, -1)$: $f = -2$ (ελάχιστο).` },
    { level: 2, type: "mc", q: R`Για την $f(x, y) = x^4 + y^4$ στο κρίσιμο σημείο $(0, 0)$, το κριτήριο των δεύτερων παραγώγων:`, options: ["δεν δίνει συμπέρασμα, γιατί $D = 0$", "δείχνει τοπικό ελάχιστο", "δείχνει σαγματικό σημείο", "δείχνει τοπικό μέγιστο"], correct: 0,
      hint: R`Όλες οι δεύτερες παράγωγοι μηδενίζονται στο $(0, 0)$.`, sol: R`$f_{xx} = 12x^2$, $f_{yy} = 12y^2$, $f_{xy} = 0$ ⇒ $D(0, 0) = 0$: το κριτήριο δεν αποφαίνεται. (Απευθείας: $f \ge 0 = f(0, 0)$, άρα είναι ελάχιστο.)` },
    { level: 3, type: "fields", q: R`Ένα ανοικτό από πάνω κουτί σχήματος ορθογωνίου παραλληλεπιπέδου έχει συνολικό εμβαδόν επιφάνειας $12\ \text{m}^2$ (βάση $xy$ και τέσσερις πλευρές). Ποιος είναι ο μέγιστος όγκος του;`,
      fields: [{ label: "V_max (m³) =", ans: 4 }], hint: R`Μεγιστοποιήστε $V = xyz$ υπό $xy + 2xz + 2yz = 12$· λόγω συμμετρίας $x = y$.`,
      sol: R`Από τις εξισώσεις Lagrange προκύπτει $x = y = 2z$. Τότε $4z^2 + 4z^2 + 4z^2 = 12 \Rightarrow z = 1$, $x = y = 2$, $V = 2\cdot 2\cdot 1 = 4\ \text{m}^3$.` },
    { level: 1, type: "mc", q: R`Κάθε κρίσιμο σημείο μιας διαφορίσιμης συνάρτησης δύο μεταβλητών είναι τοπικό ακρότατο.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Σκεφτείτε την $x^2 - y^2$.`, sol: R`Λάθος: η $f = x^2 - y^2$ έχει $\nabla f(0, 0) = \vec 0$, αλλά το $(0, 0)$ είναι σαγματικό σημείο (αύξηση κατά τον $x$, μείωση κατά τον $y$).` }
  ]
},
/* ───────────────────────────── 6.1 ───────────────────────────── */
{
  id: "6.1", unit: 6, title: "Διπλά ολοκληρώματα – Fubini – Αλλαγή σειράς ολοκλήρωσης",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 6 · Βλ. και Stewart, Λογισμός, «Πολλαπλά ολοκληρώματα»",
  theory: R`
<div class="tbox"><h4>Διπλό ολοκλήρωμα σε ορθογώνιο – Θεώρημα Fubini</h4>
<p>Αν η $f$ είναι συνεχής στο $R = [a, b]\times[c, d]$, τότε
$$\iint_R f(x, y)\,dA = \int_a^b\!\!\int_c^d f(x, y)\,dy\,dx = \int_c^d\!\!\int_a^b f(x, y)\,dx\,dy.$$
Ειδικά, αν $f(x, y) = g(x)h(y)$: $\ \iint_R g(x)h(y)\,dA = \left(\int_a^b g\right)\left(\int_c^d h\right)$.</p>
<p>Αν $f \ge 0$, το $\iint_R f\,dA$ είναι ο <b>όγκος</b> κάτω από την επιφάνεια $z = f(x, y)$· το $\iint_D 1\,dA$ είναι το <b>εμβαδόν</b> του $D$.</p></div>
<div class="tbox"><h4>Γενικά χωρία</h4>
<ul><li><b>Τύπου I:</b> $D = \{a \le x \le b,\ g_1(x) \le y \le g_2(x)\}$: $\ \iint_D f\,dA = \int_a^b\int_{g_1(x)}^{g_2(x)} f\,dy\,dx$.</li>
<li><b>Τύπου II:</b> $D = \{c \le y \le d,\ h_1(y) \le x \le h_2(y)\}$: $\ \iint_D f\,dA = \int_c^d\int_{h_1(y)}^{h_2(y)} f\,dx\,dy$.</li></ul>
<p>Παράδειγμα: χωρίο ανάμεσα σε $y = x^2$ και $y = x$: $\int_0^1\int_{x^2}^{x} x\,dy\,dx = \int_0^1 (x^2 - x^3)\,dx = \frac1{12}$.</p></div>
<div class="tbox tip"><h4>Αλλαγή σειράς ολοκλήρωσης</h4>
<p>Σχεδιάζουμε το χωρίο από τα όρια και το περιγράφουμε με την άλλη σειρά. Χρήσιμο όταν η μία σειρά δεν δίνει στοιχειώδη αντιπαράγωγο:
$$\int_0^1\!\!\int_x^1 e^{y^2}dy\,dx = \int_0^1\!\!\int_0^y e^{y^2}dx\,dy = \int_0^1 ye^{y^2}dy = \frac{e - 1}{2}.$$</p></div>`,
  widget: "m2bregion",
  gen: "m2bdbl",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε το $\iint_R (x + 2y)\,dA$, όπου $R = [0, 2]\times[0, 3]$.`, fields: [{ label: "=", ans: 24 }],
      hint: R`$\int_0^2\left[xy + y^2\right]_0^3 dx$.`, sol: R`$\int_0^2\int_0^3 (x + 2y)\,dy\,dx = \int_0^2 (3x + 9)\,dx = 6 + 18 = 24$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το $\displaystyle\int_0^1\!\!\int_0^2 xy^2\,dy\,dx$.`, fields: [{ label: "=", ans: "4/3" }],
      hint: R`Χωριζόμενος ολοκληρωτέος.`, sol: R`$\left(\int_0^1 x\,dx\right)\left(\int_0^2 y^2dy\right) = \frac12\cdot\frac83 = \frac43$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\iint_R e^{x + y}\,dA$, $R = [0, 1]\times[0, 1]$ (3 δεκαδικά).`, fields: [{ label: "≈", ans: 2.95249, tol: 0.0005 }],
      hint: R`$e^{x + y} = e^xe^y$.`, sol: R`$\left(\int_0^1 e^xdx\right)^2 = (e - 1)^2 \approx 2{,}952$.` },
    { level: 2, type: "fields", q: R`Έστω $D$ το χωρίο ανάμεσα στις $y = x^2$ και $y = x$. Να υπολογίσετε το εμβαδόν του $D$ και το $\iint_D x\,dA$.`,
      fields: [{ label: "εμβαδόν =", ans: "1/6" }, { label: "∬ x dA =", ans: "1/12" }], hint: R`Τύπου I: $0 \le x \le 1$, $x^2 \le y \le x$.`,
      sol: R`Εμβαδόν $= \int_0^1 (x - x^2)\,dx = \frac12 - \frac13 = \frac16$. $\iint_D x\,dA = \int_0^1 x(x - x^2)\,dx = \frac13 - \frac14 = \frac1{12}$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\iint_D xy\,dA$, όπου $D$ το τρίγωνο με κορυφές $(0, 0)$, $(1, 0)$, $(1, 1)$.`, fields: [{ label: "=", ans: "1/8" }],
      hint: R`$0 \le x \le 1$, $0 \le y \le x$.`, sol: R`$\int_0^1\int_0^x xy\,dy\,dx = \int_0^1 x\cdot\frac{x^2}{2}\,dx = \frac18$.` },
    { level: 2, type: "mc", q: R`Με αλλαγή της σειράς ολοκλήρωσης, το $\displaystyle\int_0^2\!\!\int_{x^2}^{4} f(x, y)\,dy\,dx$ γράφεται:`,
      options: ["$\\int_0^4\\int_0^{\\sqrt y} f(x, y)\\,dx\\,dy$", "$\\int_0^4\\int_{\\sqrt y}^{2} f(x, y)\\,dx\\,dy$", "$\\int_0^2\\int_0^{y^2} f(x, y)\\,dx\\,dy$", "$\\int_0^4\\int_{y^2}^{2} f(x, y)\\,dx\\,dy$"], correct: 0,
      hint: R`Σχεδιάστε: πάνω από την παραβολή $y = x^2$, κάτω από $y = 4$, με $x \ge 0$.`, sol: R`Για σταθερό $y \in [0, 4]$, το $x$ πάει από $0$ (άξονας $y$) έως $\sqrt y$ (παραβολή). Άρα $\int_0^4\int_0^{\sqrt y} f\,dx\,dy$.` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε το $\displaystyle\int_0^1\!\!\int_x^1 e^{y^2}\,dy\,dx$ (3 δεκαδικά).`, fields: [{ label: "≈", ans: 0.85914, tol: 0.0005 }],
      hint: R`Η $e^{y^2}$ δεν έχει στοιχειώδη αντιπαράγωγο: αλλάξτε τη σειρά.`, sol: R`Χωρίο: $0 \le x \le y \le 1$. $\int_0^1\int_0^y e^{y^2}dx\,dy = \int_0^1 ye^{y^2}dy = \left[\frac12 e^{y^2}\right]_0^1 = \frac{e - 1}{2} \approx 0{,}859$.` },
    { level: 3, type: "fields", q: R`Να βρείτε τον όγκο του στερεού κάτω από το επίπεδο $z = 4 - x - y$ και πάνω από το τρίγωνο $x \ge 0$, $y \ge 0$, $x + y \le 2$.`, fields: [{ label: "V =", ans: "16/3" }],
      hint: R`$\int_0^2\int_0^{2 - x}(4 - x - y)\,dy\,dx$.`, sol: R`Εσωτερικό: $(4 - x)(2 - x) - \frac{(2 - x)^2}{2} = \frac{(2 - x)(6 - x)}{2}$. Τότε $\frac12\int_0^2(12 - 8x + x^2)\,dx = \frac12\left(24 - 16 + \frac83\right) = \frac{16}{3}$.` },
    { level: 1, type: "mc", q: R`Αν $R = [a, b]\times[c, d]$, τότε $\iint_R g(x)h(y)\,dA = \left(\int_a^b g(x)\,dx\right)\left(\int_c^d h(y)\,dy\right)$ για συνεχείς $g, h$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Fubini: το $g(x)$ βγαίνει από το εσωτερικό ολοκλήρωμα ως προς $y$.`, sol: R`Σωστό: $\int_a^b g(x)\left(\int_c^d h(y)\,dy\right)dx$ και η παρένθεση είναι σταθερά. (Σε μη ορθογώνιο χωρίο ο τύπος γενικά δεν ισχύει, αφού τα όρια του εσωτερικού ολοκληρώματος εξαρτώνται από την άλλη μεταβλητή.)` }
  ]
},
/* ───────────────────────────── 6.2 ───────────────────────────── */
{
  id: "6.2", unit: 6, title: "Διπλά ολοκληρώματα σε πολικές συντεταγμένες – Εφαρμογές",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 6 · Βλ. και Stewart, Λογισμός, «Διπλά ολοκληρώματα σε πολικές συντεταγμένες»",
  theory: R`
<div class="tbox"><h4>Αλλαγή σε πολικές</h4>
<p>Αν $D = \{(r, \theta): \alpha \le \theta \le \beta,\ 0 \le a \le r \le b\}$ (πολικό ορθογώνιο, $0 \le \beta - \alpha \le 2\pi$) και η $f$ είναι συνεχής:
$$\iint_D f(x, y)\,dA = \int_\alpha^\beta\!\!\int_a^b f(r\cos\theta, r\sin\theta)\,r\,dr\,d\theta.$$
Ο επιπλέον παράγοντας $r$ (η <b>ορίζουσα Jacobi</b>) προέρχεται από το ότι το «κελί» $\Delta r\times\Delta\theta$ έχει εμβαδόν $\approx r\,\Delta r\,\Delta\theta$. Γενικότερα, για $h_1(\theta) \le r \le h_2(\theta)$ τα όρια του $r$ εξαρτώνται από το $\theta$.</p></div>
<div class="tbox"><h4>Πότε χρησιμοποιούμε πολικές</h4>
<p>Όταν το χωρίο είναι δίσκος, δακτύλιος ή τομέας, ή ο ολοκληρωτέος περιέχει $x^2 + y^2$. Π.χ. για τον δίσκο $x^2 + y^2 \le 4$:
$$\iint_D (x^2 + y^2)\,dA = \int_0^{2\pi}\!\!\int_0^2 r^2\cdot r\,dr\,d\theta = 2\pi\cdot 4 = 8\pi.$$</p></div>
<div class="tbox tip"><h4>Εφαρμογές</h4>
<ul><li><b>Όγκος</b> κάτω από $z = f(x, y) \ge 0$: $V = \iint_D f\,dA$ (π.χ. παραβολοειδές $z = 4 - x^2 - y^2$ πάνω από το επίπεδο $xy$: $V = \int_0^{2\pi}\int_0^2 (4 - r^2)r\,dr\,d\theta = 8\pi$).</li>
<li><b>Μάζα</b> ελάσματος με πυκνότητα $\rho(x, y)$: $m = \iint_D \rho\,dA$· κέντρο μάζας $\bar x = \frac1m\iint_D x\rho\,dA$, $\bar y = \frac1m\iint_D y\rho\,dA$.</li>
<li>Ολοκλήρωμα Gauss: $\left(\int_{-\infty}^\infty e^{-x^2}dx\right)^2 = \int_0^{2\pi}\!\int_0^\infty e^{-r^2}r\,dr\,d\theta = \pi$, άρα $\int_{-\infty}^\infty e^{-x^2}dx = \sqrt\pi$.</li></ul></div>`,
  widget: "m2bpolreg",
  gen: "m2bpolint",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε το $\iint_D (x^2 + y^2)\,dA$, όπου $D$ ο δίσκος $x^2 + y^2 \le 4$. Αν το αποτέλεσμα είναι $\kappa\pi$, πόσο είναι το $\kappa$;`, fields: [{ label: "κ =", ans: 8 }],
      hint: R`$x^2 + y^2 = r^2$, $dA = r\,dr\,d\theta$.`, sol: R`$\int_0^{2\pi}\int_0^2 r^3\,dr\,d\theta = 2\pi\cdot\frac{16}{4} = 8\pi$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το $\iint_D \sqrt{x^2 + y^2}\,dA$, όπου $D$ ο δίσκος $x^2 + y^2 \le 9$. Αν το αποτέλεσμα είναι $\kappa\pi$, πόσο είναι το $\kappa$;`, fields: [{ label: "κ =", ans: 18 }],
      hint: R`$\sqrt{x^2 + y^2} = r$.`, sol: R`$\int_0^{2\pi}\int_0^3 r\cdot r\,dr\,d\theta = 2\pi\cdot 9 = 18\pi$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\iint_D e^{-(x^2 + y^2)}\,dA$, όπου $D$ ο μοναδιαίος δίσκος (3 δεκαδικά).`, fields: [{ label: "≈", ans: 1.98587, tol: 0.0005 }],
      hint: R`Αντικατάσταση $u = r^2$.`, sol: R`$\int_0^{2\pi}\int_0^1 e^{-r^2}r\,dr\,d\theta = 2\pi\cdot\frac12(1 - e^{-1}) = \pi(1 - e^{-1}) \approx 1{,}986$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\iint_D x\,dA$, όπου $D$ το τμήμα του δακτυλίου $1 \le x^2 + y^2 \le 4$ στο 1ο τεταρτημόριο.`, fields: [{ label: "=", ans: "7/3" }],
      hint: R`$x = r\cos\theta$, $0 \le \theta \le \frac\pi2$, $1 \le r \le 2$.`, sol: R`$\int_0^{\pi/2}\cos\theta\,d\theta\cdot\int_1^2 r^2dr = 1\cdot\frac{8 - 1}{3} = \frac73$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τον όγκο του στερεού κάτω από το παραβολοειδές $z = 4 - x^2 - y^2$ και πάνω από το επίπεδο $xy$. Αν $V = \kappa\pi$, πόσο είναι το $\kappa$;`, fields: [{ label: "κ =", ans: 8 }],
      hint: R`Το παραβολοειδές τέμνει το $z = 0$ στον κύκλο $r = 2$.`, sol: R`$\int_0^{2\pi}\int_0^2 (4 - r^2)r\,dr\,d\theta = 2\pi\left[2r^2 - \frac{r^4}{4}\right]_0^2 = 2\pi(8 - 4) = 8\pi$.` },
    { level: 3, type: "fields", q: R`Με πολικές συντεταγμένες να βρείτε τον όγκο της σφαίρας ακτίνας $3$, ως $2\iint_D\sqrt{9 - x^2 - y^2}\,dA$. Αν $V = \kappa\pi$, πόσο είναι το $\kappa$;`, fields: [{ label: "κ =", ans: 36 }],
      hint: R`$\int_0^3\sqrt{9 - r^2}\,r\,dr = \left[-\frac13(9 - r^2)^{3/2}\right]_0^3$.`, sol: R`$\int_0^3\sqrt{9 - r^2}\,r\,dr = \frac13\cdot 27 = 9$. Άρα $V = 2\cdot 2\pi\cdot 9 = 36\pi = \frac43\pi\cdot 3^3$.` },
    { level: 2, type: "fields", q: R`Ένα έλασμα έχει σχήμα μοναδιαίου δίσκου και πυκνότητα $\rho(x, y) = x^2 + y^2$. Αν η μάζα του είναι $m = \kappa\pi$, πόσο είναι το $\kappa$;`, fields: [{ label: "κ =", ans: "1/2" }],
      hint: R`$m = \iint_D \rho\,dA$.`, sol: R`$m = \int_0^{2\pi}\int_0^1 r^2\cdot r\,dr\,d\theta = 2\pi\cdot\frac14 = \frac\pi2$.` },
    { level: 1, type: "mc", q: R`Κατά την αλλαγή σε πολικές, το στοιχείο εμβαδού $dA$ γίνεται:`, options: ["$r\\,dr\\,d\\theta$", "$dr\\,d\\theta$", "$r^2\\,dr\\,d\\theta$", "$\\frac1r\\,dr\\,d\\theta$"], correct: 0,
      hint: R`Εμβαδόν κελιού $\approx r\,\Delta r\,\Delta\theta$.`, sol: R`$dA = r\,dr\,d\theta$: η ορίζουσα Jacobi του $(r, \theta) \mapsto (r\cos\theta, r\sin\theta)$ είναι $r$.` },
    { level: 2, type: "mc", q: R`Με τη βοήθεια πολικών συντεταγμένων αποδεικνύεται ότι $\int_{-\infty}^{\infty} e^{-x^2}dx$ ισούται με:`, options: ["$\\sqrt\\pi$", "$\\pi$", "$\\frac{\\sqrt\\pi}{2}$", "$1$"], correct: 0,
      hint: R`Το τετράγωνο του ολοκληρώματος είναι $\iint_{\mathbb R^2} e^{-(x^2 + y^2)}dA$.`, sol: R`$I^2 = \int_0^{2\pi}\int_0^\infty e^{-r^2}r\,dr\,d\theta = 2\pi\cdot\frac12 = \pi$, και $I > 0$, άρα $I = \sqrt\pi$.` }
  ]
},
/* ───────────────────────────── 6.3 ───────────────────────────── */
{
  id: "6.3", unit: 6, title: "Τριπλά ολοκληρώματα – Κυλινδρικές και σφαιρικές συντεταγμένες",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 6 · Βλ. και Stewart, Λογισμός, «Τριπλά ολοκληρώματα»",
  theory: R`
<div class="tbox"><h4>Τριπλό ολοκλήρωμα</h4>
<p>Για συνεχή $f$ στο $B = [a, b]\times[c, d]\times[p, q]$ ισχύει το θεώρημα Fubini: $\iiint_B f\,dV = \int_p^q\int_c^d\int_a^b f\,dx\,dy\,dz$ (με οποιαδήποτε σειρά). Για γενικό στερεό, π.χ. $E = \{(x, y) \in D,\ u_1(x, y) \le z \le u_2(x, y)\}$:
$$\iiint_E f\,dV = \iint_D\left[\int_{u_1(x,y)}^{u_2(x,y)} f\,dz\right]dA.$$
Ο <b>όγκος</b> του $E$ είναι $\iiint_E 1\,dV$· π.χ. το τετράεδρο $x, y, z \ge 0$, $x + y + z \le 1$ έχει όγκο $\frac16$.</p></div>
<div class="tbox"><h4>Κυλινδρικές συντεταγμένες</h4>
<p>$x = r\cos\theta,\ y = r\sin\theta,\ z = z$ και $dV = r\,dz\,dr\,d\theta$. Κατάλληλες για κυλίνδρους, κώνους, παραβολοειδή με άξονα τον $z$.</p></div>
<div class="tbox tip"><h4>Σφαιρικές συντεταγμένες</h4>
<p>$x = \rho\sin\varphi\cos\theta,\ y = \rho\sin\varphi\sin\theta,\ z = \rho\cos\varphi$, με $\rho \ge 0$, $0 \le \varphi \le \pi$, $0 \le \theta \le 2\pi$, και
$$dV = \rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta.$$
Π.χ. όγκος σφαίρας ακτίνας $a$: $\int_0^{2\pi}\int_0^\pi\int_0^a \rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta = 2\pi\cdot 2\cdot\frac{a^3}{3} = \frac43\pi a^3$.</p></div>`,
  widget: "m2bsph",
  gen: "m2btriple",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε το $\iiint_B xyz\,dV$, όπου $B = [0, 1]\times[0, 2]\times[0, 3]$.`, fields: [{ label: "=", ans: "9/2" }],
      hint: R`Γινόμενο τριών απλών ολοκληρωμάτων.`, sol: R`$\frac12\cdot\frac42\cdot\frac92 = \frac12\cdot 2\cdot\frac92 = \frac92$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το $\iiint_B (x + y + z)\,dV$, όπου $B = [0, 1]^3$.`, fields: [{ label: "=", ans: "3/2" }],
      hint: R`Λόγω συμμετρίας, $3\iiint_B x\,dV$.`, sol: R`$\iiint_B x\,dV = \frac12\cdot 1\cdot 1 = \frac12$· ομοίως για $y, z$· σύνολο $\frac32$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τον όγκο του τετραέδρου $x \ge 0$, $y \ge 0$, $z \ge 0$, $x + y + z \le 1$.`, fields: [{ label: "V =", ans: "1/6" }],
      hint: R`$\int_0^1\int_0^{1 - x}\int_0^{1 - x - y} dz\,dy\,dx$.`, sol: R`$\int_0^1\int_0^{1 - x}(1 - x - y)\,dy\,dx = \int_0^1\frac{(1 - x)^2}{2}\,dx = \frac16$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\iiint_E z\,dV$, όπου $E$ ο κύλινδρος $x^2 + y^2 \le 1$, $0 \le z \le 2$. Αν το αποτέλεσμα είναι $\kappa\pi$, πόσο είναι το $\kappa$;`, fields: [{ label: "κ =", ans: 2 }],
      hint: R`Κυλινδρικές: $\int_0^{2\pi}\int_0^1\int_0^2 z\,r\,dz\,dr\,d\theta$.`, sol: R`$2\pi\cdot\frac12\cdot\frac{4}{2} = 2\pi$.` },
    { level: 2, type: "fields", q: R`Με σφαιρικές συντεταγμένες να βρείτε τον όγκο της σφαίρας ακτίνας $2$. Αν $V = \kappa\pi$, πόσο είναι το $\kappa$;`, fields: [{ label: "κ =", ans: "32/3" }],
      hint: R`$\int_0^{2\pi}\int_0^\pi\int_0^2\rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta$.`, sol: R`$2\pi\cdot 2\cdot\frac83 = \frac{32\pi}{3}$.` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε το $\iiint_B (x^2 + y^2 + z^2)\,dV$, όπου $B$ η μοναδιαία σφαίρα $x^2 + y^2 + z^2 \le 1$. Αν το αποτέλεσμα είναι $\kappa\pi$, πόσο είναι το $\kappa$;`, fields: [{ label: "κ =", ans: "4/5" }],
      hint: R`$x^2 + y^2 + z^2 = \rho^2$.`, sol: R`$\int_0^{2\pi}\int_0^\pi\int_0^1\rho^4\sin\varphi\,d\rho\,d\varphi\,d\theta = 2\pi\cdot 2\cdot\frac15 = \frac{4\pi}{5}$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τον όγκο του στερεού μέσα στον κύλινδρο $x^2 + y^2 \le 4$, πάνω από το $z = 0$ και κάτω από το $z = x^2 + y^2$. Αν $V = \kappa\pi$, πόσο είναι το $\kappa$;`, fields: [{ label: "κ =", ans: 8 }],
      hint: R`Κυλινδρικές: $0 \le z \le r^2$.`, sol: R`$\int_0^{2\pi}\int_0^2 r^2\cdot r\,dr\,d\theta = 2\pi\cdot 4 = 8\pi$.` },
    { level: 1, type: "mc", q: R`Σε σφαιρικές συντεταγμένες $(\rho, \varphi, \theta)$, το στοιχείο όγκου $dV$ είναι:`, options: ["$\\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$", "$\\rho\\,d\\rho\\,d\\varphi\\,d\\theta$", "$\\rho^2\\cos\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$", "$\\rho\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$"], correct: 0,
      hint: R`Η ορίζουσα Jacobi της αλλαγής.`, sol: R`$dV = \rho^2\sin\varphi\,d\rho\,d\varphi\,d\theta$ (με $0 \le \varphi \le \pi$, ώστε $\sin\varphi \ge 0$).` },
    { level: 1, type: "mc", q: R`Το σημείο με κυλινδρικές συντεταγμένες $(r, \theta, z) = \left(2, \frac\pi2, 3\right)$ έχει καρτεσιανές συντεταγμένες $(0, 2, 3)$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`$x = r\cos\theta$, $y = r\sin\theta$.`, sol: R`Σωστό: $x = 2\cos\frac\pi2 = 0$, $y = 2\sin\frac\pi2 = 2$, $z = 3$.` }
  ]
}
];

/* ================= Widgets Α΄ Λυκείου ΚΚ — Τεύχος Α ================= */
var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 1.1 Η εξίσωση x^ν = a ---------- */
  nroot(box) {
    box.innerHTML = `<div class="wctl"><label>εκθέτης ν <input type="range" class="rn" min="1" max="7" step="1" value="3"><b class="vn"></b></label>
      <label>α <input type="range" class="ra" min="-20" max="20" step="0.5" value="8"><b class="va"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const n = +$(".rn", box).value, a = +$(".ra", box).value;
      $(".vn", box).textContent = n; $(".va", box).textContent = fmt(a);
      const P = makePlot($(".pl", box), { xmin: -3.2, xmax: 3.2, ymin: -22, ymax: 22, H: 300, xstep: 1, ystep: 5 });
      P.curve(x => x ** n, "c1"); P.seg(-4, a, 4, a, "c1line");
      const r = n % 2 ? [Math.sign(a) * Math.pow(Math.abs(a), 1 / n)] : a > 0 ? [-Math.pow(a, 1 / n), Math.pow(a, 1 / n)] : a === 0 ? [0] : [];
      r.forEach(x => P.dot(x, a, "dmin", "x = " + fmt(x), 6, a >= 0 ? 18 : -10));
      const root = `<sup>${n}</sup>√${fmt(Math.abs(a))}`;
      let msg;
      if (n % 2) msg = `ν <b>περιττός</b> ⇒ πάντα <b>μία</b> λύση: x = ${a > 0 ? root : a < 0 ? "−" + root : "0"} ≈ <b>${fmt(r[0])}</b>`;
      else if (a > 0) msg = `ν <b>άρτιος</b>, α &gt; 0 ⇒ <b>δύο</b> λύσεις: x = ±${root} ≈ <b>±${fmt(r[1])}</b>`;
      else if (a === 0) msg = `ν άρτιος, α = 0 ⇒ <b>μία</b> λύση: x = 0`;
      else msg = `ν άρτιος, α &lt; 0 ⇒ <b>καμία</b> πραγματική λύση (η x<sup>${n}</sup> δεν παίρνει αρνητικές τιμές)`;
      $(".wout", box).innerHTML = `Εξίσωση x<sup>${n}</sup> = ${fmt(a)}: ${msg}<br><span class="muted">Μπλε: y = x<sup>${n}</sup>. Μωβ: y = α. Οι λύσεις είναι τα σημεία τομής.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 2.1 Γωνία σε κανονική θέση ---------- */
  stdangle(box) {
    box.innerHTML = `<div class="wctl"><label>γωνία θ <input type="range" class="rt" min="-720" max="720" step="5" value="135"><b class="vt"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const t = +$(".rt", box).value; $(".vt", box).textContent = t + "°";
      const P = gPlot($(".pl", box), 0, 0, 2.6, 380);
      gCircle(P, 0, 0, 1, "stroke:var(--line);stroke-width:1.5;fill:none");
      /* σπείρα που δείχνει την περιστροφή */
      let d = ""; const n = Math.max(20, Math.abs(t) / 3);
      for (let i = 0; i <= n; i++) { const a = t * i / n, rr = 0.28 + 0.16 * Math.abs(a) / 360; d += (i ? "L" : "M") + P.sx(rr * Math.cos(gRad(a))).toFixed(1) + "," + P.sy(rr * Math.sin(gRad(a))).toFixed(1); }
      P.top.appendChild(svgEl("path", { d, style: "fill:none;stroke:var(--amber);stroke-width:2.4" }));
      gArrow(P, 0, 0, 1.45, 0, "var(--muted)", 2.4); gArrow(P, 0, 0, 1.3 * Math.cos(gRad(t)), 1.3 * Math.sin(gRad(t)), "var(--blue)", 3.2);
      gText(P, 1.6, -0.15, "αρχική", "fill:var(--muted)", "end"); gText(P, 1.52 * Math.cos(gRad(t)), 1.52 * Math.sin(gRad(t)), "τελική", "fill:var(--blue)");
      const q = gq(t), red = ((t % 360) + 360) % 360;
      $(".wout", box).innerHTML = `θ = <b>${t}°</b> ${t > 0 ? "(θετική — αντίθετα από τους δείκτες του ρολογιού)" : t < 0 ? "(αρνητική — όπως οι δείκτες του ρολογιού)" : ""}<br>
        Ίδια τελική πλευρά με <b>${red}°</b> ${t !== red ? `αφού ${t} = ${red} ${t - red >= 0 ? "+" : "−"} ${Math.abs(t - red) / 360}·360` : ""} &nbsp;·&nbsp; ${q ? `τελική πλευρά στο <b>${q}ο τεταρτημόριο</b>` : "τελική πλευρά <b>πάνω σε άξονα</b>"}`;
    }
    $(".rt", box).oninput = draw; draw();
  },

  /* ---------- 2.2 Σημείο στην τελική πλευρά ---------- */
  pointtrig(box) {
    box.innerHTML = `<div class="wctl"><label>x <input type="range" class="rx" min="-6" max="6" step="1" value="-3"><b class="vx"></b></label>
      <label>y <input type="range" class="ry" min="-6" max="6" step="1" value="4"><b class="vy"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      let x = +$(".rx", box).value, y = +$(".ry", box).value; if (!x && !y) { x = 1; $(".rx", box).value = 1; }
      $(".vx", box).textContent = x; $(".vy", box).textContent = y;
      const P = gPlot($(".pl", box), 0, 0, 8.6, 450);
      const r2 = x * x + y * y, rho = Math.sqrt(r2), rs = sqrtForm(r2), t = Math.atan2(y, x) * 180 / Math.PI;
      gLine(P, 0, 0, 7.4 * x / rho, 7.4 * y / rho, "stroke:var(--blue);stroke-width:3");
      gLine(P, x, 0, x, y, "stroke:var(--muted);stroke-width:1.6;stroke-dasharray:5 4");
      gArc(P, 0, 0, 0, t < 0 ? t + 360 : t, 1.1, "var(--amber)", "θ", 1.9);
      P.dot(x, y, "d2", `A(${x}, ${y})`, x >= 0 ? 8 : -8, y >= 0 ? -10 : 20);
      const isInt = Number.isInteger(rho);
      const ratio = (p, q) => { if (q === 0) return "δεν ορίζεται"; if (isInt || !Number.isInteger(q)) return fracStr(p, q); return fracStr(p, 1) + "/" + rs; };
      const num = (p, qv, qs) => qs === "δεν ορίζεται" ? qs : `${qs}${Number.isInteger(+qs.replace("−", "-")) ? "" : " ≈ " + fmt(p / qv)}`;
      const rat2 = (p, q) => q === 0 ? "δεν ορίζεται" : fracStr(p, q);
      const sin = isInt ? fracStr(y, rho) : (y === 0 ? "0" : fracStr(y, 1) + "/" + rs), cos = isInt ? fracStr(x, rho) : (x === 0 ? "0" : fracStr(x, 1) + "/" + rs);
      $(".wout", box).innerHTML = `ρ = √(x² + y²) = √${r2} = <b>${rs}</b><br>
        ημθ = y/ρ = <b>${sin}</b>${isInt || y === 0 ? "" : " ≈ " + fmt(y / rho)} &nbsp;·&nbsp; συνθ = x/ρ = <b>${cos}</b>${isInt || x === 0 ? "" : " ≈ " + fmt(x / rho)}<br>
        εφθ = y/x = <b>${rat2(y, x)}</b> &nbsp;·&nbsp; σφθ = x/y = <b>${rat2(x, y)}</b> &nbsp;·&nbsp; ${gq(t) ? gq(t) + "ο τεταρτημόριο" : "πάνω σε άξονα"}
        <br><span class="muted">Οι λόγοι δεν αλλάζουν αν πάρεις άλλο σημείο της ίδιας τελικής πλευράς (π.χ. το διπλάσιο).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 2.3 Τριγωνομετρικός κύκλος ---------- */
  ucircle(box) {
    box.innerHTML = `<div class="wctl"><label>γωνία ω <input type="range" class="rt" min="0" max="360" step="1" value="140"><b class="vt"></b></label>
      <label><input type="checkbox" class="ct" checked> άξονας εφαπτομένων</label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const t = +$(".rt", box).value, show = $(".ct", box).checked; $(".vt", box).textContent = t + "°";
      const P = gPlot($(".pl", box), 0.25, 0, 2.3, 330);
      gCircle(P, 0, 0, 1);
      const c = Math.cos(gRad(t)), s = Math.sin(gRad(t));
      gLine(P, 0, 0, c, s, "stroke:var(--navy);stroke-width:2.4");
      gLine(P, c, 0, c, s, "stroke:var(--red);stroke-width:3.4"); gLine(P, 0, 0, c, 0, "stroke:var(--green);stroke-width:3.4");
      gArc(P, 0, 0, 0, t, 0.25, "var(--amber)", "ω", 0.42);
      const tanOk = Math.abs(c) > 1e-9, tn = s / c;
      if (show) {
        gLine(P, 1, -2.5, 1, 2.5, "stroke:var(--purple);stroke-width:1.5;stroke-dasharray:5 4");
        if (tanOk && Math.abs(tn) < 2.6) { gLine(P, 0, 0, 1, tn, "stroke:var(--muted);stroke-width:1.3;stroke-dasharray:3 3"); gLine(P, 1, 0, 1, tn, "stroke:var(--purple);stroke-width:3.4"); P.dot(1, tn, "dinf", "εφω", 8, 4); }
      }
      P.dot(c, s, "d2", "M", c >= 0 ? 8 : -8, s >= 0 ? -10 : 18);
      const q = gq(t), sg = v => Math.abs(v) < 1e-9 ? "0" : v > 0 ? "+" : "−";
      const row = (name, v) => `<td class="${q ? "" : ""}">${name}</td>` + [1, 2, 3, 4].map(k => `<td style="${k === q ? "background:var(--soft);font-weight:800" : ""}">${["", "+", ...(name === "ημ" ? ["+", "−", "−"] : name === "συν" ? ["−", "−", "+"] : ["−", "+", "−"])][k]}</td>`).join("");
      $(".wout", box).innerHTML = `<span style="color:var(--red)">■</span> ημω = y = <b>${fmt(s)}</b> &nbsp;·&nbsp; <span style="color:var(--green)">■</span> συνω = x = <b>${fmt(c)}</b> &nbsp;·&nbsp; <span style="color:var(--purple)">■</span> εφω = <b>${tanOk ? fmt(tn) : "δεν ορίζεται"}</b>
        <br>Έλεγχος: ημ²ω + συν²ω = ${fmt(s * s)} + ${fmt(c * c)} = <b>1</b> &nbsp;·&nbsp; ${q ? `<b>${q}ο τεταρτημόριο</b>` : "πάνω σε άξονα"}
        <table class="mini" style="margin-top:.5rem"><tr><th></th><th>1ο</th><th>2ο</th><th>3ο</th><th>4ο</th></tr><tr>${row("ημ")}</tr><tr>${row("συν")}</tr><tr>${row("εφ")}</tr></table>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 2.4 Μετατροπή σε οξεία ---------- */
  reduce(box) {
    box.innerHTML = `<div class="wctl"><label>οξεία θ <input type="range" class="rt" min="0" max="90" step="1" value="35"><b class="vt"></b></label>
      <label>σύγκρινε με <select class="sm"><option value="180">180° − θ</option><option value="90">90° − θ</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const t = +$(".rt", box).value, m = +$(".sm", box).value, u = m - t; $(".vt", box).textContent = t + "°";
      const P = gPlot($(".pl", box), 0, 0, 1.9, 320);
      gCircle(P, 0, 0, 1);
      const [c1, s1] = onDeg(t), [c2, s2] = onDeg(u);
      gLine(P, 0, 0, c1, s1, "stroke:var(--blue);stroke-width:2.6"); gLine(P, 0, 0, c2, s2, "stroke:var(--purple);stroke-width:2.6");
      if (m === 180) { gLine(P, c1, s1, c2, s2, "stroke:var(--muted);stroke-width:1.4;stroke-dasharray:4 4"); gLine(P, 0, -1.3, 0, 1.3, "stroke:var(--muted);stroke-width:1.2;stroke-dasharray:2 4"); }
      else gLine(P, -1.2, -1.2, 1.3, 1.3, "stroke:var(--muted);stroke-width:1.2;stroke-dasharray:2 4");
      gArc(P, 0, 0, 0, t, 0.28, "var(--blue)", "θ", 0.45); gArc(P, 0, 0, 0, u, 0.5, "var(--purple)", m === 180 ? "180°−θ" : "90°−θ", 0.75);
      P.dot(c1, s1, "d1", `(${fmt(c1)}, ${fmt(s1)})`, 8, -8); P.dot(c2, s2, "dinf", `(${fmt(c2)}, ${fmt(s2)})`, c2 < 0 ? -8 : 8, -8);
      $(".wout", box).innerHTML = m === 180
        ? `Τα σημεία είναι <b>συμμετρικά ως προς τον άξονα y′y</b>: ίδιο y, αντίθετο x.<br>ημ(${u}°) = ημ${t}° = <b>${fmt(s1)}</b> &nbsp;·&nbsp; συν(${u}°) = −συν${t}° = <b>${fmt(c2)}</b> &nbsp;·&nbsp; εφ(${u}°) = −εφ${t}° ${t === 90 ? "" : "= <b>" + fmt(-Math.tan(gRad(t))) + "</b>"}`
        : `Τα σημεία είναι <b>συμμετρικά ως προς τη διχοτόμο y = x</b>: οι συντεταγμένες ανταλλάσσονται.<br>ημ(${u}°) = συν${t}° = <b>${fmt(s2)}</b> &nbsp;·&nbsp; συν(${u}°) = ημ${t}° = <b>${fmt(c2)}</b>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 3.1 Σχετική θέση δύο κύκλων ---------- */
  relpos(box) {
    box.innerHTML = `<div class="wctl"><label>R <input type="range" class="rR" min="1" max="6" step="0.5" value="4"><b class="vR"></b></label>
      <label>ρ <input type="range" class="rr" min="0.5" max="5" step="0.5" value="2.5"><b class="vr"></b></label>
      <label>διάκεντρος δ <input type="range" class="rd" min="0" max="12" step="0.5" value="5"><b class="vd"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      let R = +$(".rR", box).value, r = +$(".rr", box).value; const d = +$(".rd", box).value;
      $(".vR", box).textContent = fmt(R); $(".vr", box).textContent = fmt(r); $(".vd", box).textContent = fmt(d);
      const big = Math.max(R, r), sm = Math.min(R, r);
      const P = gPlot($(".pl", box), d / 2, 0, Math.max(8, (d + R + r) / 2 + 1.5), 300, false);
      gCircle(P, 0, 0, R); gCircle(P, d, 0, r, "stroke:var(--purple);stroke-width:2.4;fill:none");
      gLine(P, 0, 0, d, 0, "stroke:var(--amber);stroke-width:2.2"); P.dot(0, 0, "d1", "Κ", -6, 18); P.dot(d, 0, "dinf", "Λ", 6, 18);
      const e = 1e-9; let k;
      if (d < e && Math.abs(R - r) < e) k = ["ταυτίζονται", "άπειρα κοινά σημεία", "δ = 0 και R = ρ"];
      else if (d > R + r + e) k = ["ξένοι εξωτερικά", "κανένα κοινό σημείο", `δ &gt; R + ρ = ${fmt(R + r)}`];
      else if (Math.abs(d - (R + r)) < e) k = ["εφάπτονται εξωτερικά", "ένα κοινό σημείο", `δ = R + ρ = ${fmt(R + r)}`];
      else if (d > big - sm + e) k = ["τέμνονται", "δύο κοινά σημεία", `${fmt(big - sm)} = |R − ρ| &lt; δ &lt; R + ρ = ${fmt(R + r)}`];
      else if (Math.abs(d - (big - sm)) < e) k = ["εφάπτονται εσωτερικά", "ένα κοινό σημείο", `δ = |R − ρ| = ${fmt(big - sm)}`];
      else k = ["ξένοι εσωτερικά", "κανένα κοινό σημείο", `δ &lt; |R − ρ| = ${fmt(big - sm)}`];
      $(".wout", box).innerHTML = `Οι κύκλοι <b>${k[0]}</b> — ${k[1]}, επειδή <b>${k[2]}</b>.<br><span class="muted">Σύγκρινε πάντα τη διάκεντρο δ με το άθροισμα R + ρ και τη διαφορά |R − ρ| των ακτίνων.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 3.2 Εγγεγραμμένη – επίκεντρη ---------- */
  inscribed(box) {
    box.innerHTML = `<div class="wctl"><label>τόξο ΑΒ <input type="range" class="ra" min="20" max="340" step="2" value="100"><b class="va"></b></label>
      <label>θέση του Μ <input type="range" class="rm" min="2" max="98" step="1" value="50"><b class="vm"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const arc = +$(".ra", box).value, pm = +$(".rm", box).value / 100; $(".va", box).textContent = arc + "°"; $(".vm", box).textContent = "";
      const a = 270 - arc / 2, b = 270 + arc / 2, mt = b + (360 - arc) * pm; /* Μ στο άλλο τόξο */
      const A = onDeg(a), B = onDeg(b), M = onDeg(mt), O = [0, 0];
      const P = gPlot($(".pl", box), 0, 0, 1.75, 450, false);
      gCircle(P, 0, 0, 1);
      let d = ""; for (let i = 0; i <= 40; i++) { const t = gRad(a + arc * i / 40); d += (i ? "L" : "M") + P.sx(Math.cos(t)).toFixed(1) + "," + P.sy(Math.sin(t)).toFixed(1); }
      P.top.appendChild(svgEl("path", { d, style: "fill:none;stroke:var(--red);stroke-width:5;opacity:.55" }));
      gLine(P, ...M, ...A); gLine(P, ...M, ...B);
      gLine(P, 0, 0, ...A, "stroke:var(--purple);stroke-width:2"); gLine(P, 0, 0, ...B, "stroke:var(--purple);stroke-width:2");
      const ins = gAngMark(P, M, A, B, 0.2, "var(--amber)"), cen = arc <= 180 ? gAngMark(P, O, A, B, 0.17, "var(--purple)") : (gArc(P, 0, 0, b - 360, a, 0.17, "var(--purple)"), arc);
      P.dot(...A, "d2", "Α", -8, 16); P.dot(...B, "d2", "Β", 8, 16); P.dot(...M, "d3", "Μ", M[0] >= 0 ? 8 : -8, M[1] >= 0 ? -10 : 18); P.dot(0, 0, "dinf", "Ο", 8, -8);
      $(".wout", box).innerHTML = `Τόξο ΑΒ = <b>${arc}°</b> &nbsp;·&nbsp; <span style="color:var(--purple)">επίκεντρη ΑΟΒ = <b>${arc}°</b></span> &nbsp;·&nbsp; <span style="color:var(--amber)">εγγεγραμμένη ΑΜΒ = <b>${fmt(ins)}°</b></span> = ${arc}°/2
        <br><span class="muted">Μετακίνησε το Μ: η εγγεγραμμένη γωνία δεν αλλάζει — όλες οι εγγεγραμμένες στο ίδιο τόξο είναι ίσες. Για τόξο 180° (ημικύκλιο) γίνεται ορθή.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 3.3 Εγγεγραμμένο τετράπλευρο ---------- */
  cyclic(box) {
    const def = [190, 300, 40, 115];
    box.innerHTML = `<div class="wctl">${["Α", "Β", "Γ", "Δ"].map((k, i) => `<label>${k} <input type="range" class="rv" data-i="${i}" min="0" max="359" step="1" value="${def[i]}"></label>`).join("")}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      let ts = [...box.querySelectorAll(".rv")].map(i => +i.value);
      const order = ts.map((t, i) => [t, i]).sort((u, v) => u[0] - v[0]).map(z => z[1]);
      const ok = [0, 1, 2, 3].some(s => [0, 1, 2, 3].every(k => order[(s + k) % 4] === k)) || [0, 1, 2, 3].some(s => [0, 1, 2, 3].every(k => order[(s + 3 - k) % 4] === k));
      const pts = ts.map(onDeg), P = gPlot($(".pl", box), 0, 0, 1.75, 450, false);
      gCircle(P, 0, 0, 1);
      const L = ["Α", "Β", "Γ", "Δ"]; for (let i = 0; i < 4; i++) gLine(P, ...pts[i], ...pts[(i + 1) % 4]);
      const angs = [];
      for (let i = 0; i < 4; i++) angs.push(gAngMark(P, pts[i], pts[(i + 3) % 4], pts[(i + 1) % 4], 0.18, i % 2 ? "var(--purple)" : "var(--amber)"));
      pts.forEach((p, i) => P.dot(...p, "d2", L[i], p[0] >= 0 ? 8 : -8, p[1] >= 0 ? -10 : 18));
      $(".wout", box).innerHTML = ok
        ? `<span style="color:var(--amber)">Α + Γ = ${fmt(angs[0])}° + ${fmt(angs[2])}° = <b>${fmt(angs[0] + angs[2])}°</b></span> &nbsp;·&nbsp; <span style="color:var(--purple)">Β + Δ = ${fmt(angs[1])}° + ${fmt(angs[3])}° = <b>${fmt(angs[1] + angs[3])}°</b></span><br><span class="muted">Όπως κι αν μετακινήσεις τις κορυφές πάνω στον κύκλο, οι απέναντι γωνίες είναι παραπληρωματικές.</span>`
        : `<span class="warnc">Οι κορυφές πρέπει να είναι με τη σειρά Α, Β, Γ, Δ γύρω από τον κύκλο — αλλιώς οι πλευρές τέμνονται και δεν έχουμε κυρτό τετράπλευρο.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 3.4 Χορδή και εφαπτομένη ---------- */
  tanchord(box) {
    box.innerHTML = `<div class="wctl"><label>τόξο ΑΒ <input type="range" class="ra" min="20" max="340" step="2" value="110"><b class="va"></b></label>
      <label>θέση του Γ <input type="range" class="rg" min="3" max="97" step="1" value="45"></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const arc = +$(".ra", box).value, pg = +$(".rg", box).value / 100; $(".va", box).textContent = arc + "°";
      const ta = 270, tb = 270 + arc, tg = tb + (360 - arc) * pg, A = onDeg(ta), B = onDeg(tb), G = onDeg(tg);
      const P = gPlot($(".pl", box), 0, -0.1, 1.9, 450, false);
      gCircle(P, 0, 0, 1);
      gLine(P, -1.8, -1, 1.8, -1, "stroke:var(--purple);stroke-width:2.4"); gText(P, 1.7, -1.15, "ε", "fill:var(--purple)");
      gLine(P, ...A, ...B); gLine(P, ...G, ...A); gLine(P, ...G, ...B);
      let d = ""; for (let i = 0; i <= 40; i++) { const t = gRad(ta + arc * i / 40); d += (i ? "L" : "M") + P.sx(Math.cos(t)).toFixed(1) + "," + P.sy(Math.sin(t)).toFixed(1); }
      P.top.appendChild(svgEl("path", { d, style: "fill:none;stroke:var(--red);stroke-width:5;opacity:.55" }));
      const w = gAngMark(P, A, [1.8, -1], B, 0.22, "var(--purple)"), f = gAngMark(P, G, A, B, 0.2, "var(--amber)");
      P.dot(...A, "d2", "Α", 0, 22); P.dot(...B, "d2", "Β", B[0] >= 0 ? 8 : -8, B[1] >= 0 ? -10 : 18); P.dot(...G, "d3", "Γ", G[0] >= 0 ? 8 : -8, G[1] >= 0 ? -10 : 18);
      $(".wout", box).innerHTML = `<span style="color:var(--purple)">γωνία χορδής ΑΒ – εφαπτομένης ε = <b>${fmt(w)}°</b></span> &nbsp;·&nbsp; <span style="color:var(--amber)">εγγεγραμμένη ΑΓΒ = <b>${fmt(f)}°</b></span> &nbsp;·&nbsp; τόξο = ${arc}° ⇒ μισό ${fmt(arc / 2)}°
        <br><span class="muted">Η γωνία χορδής–εφαπτομένης ισούται με κάθε εγγεγραμμένη που βαίνει στο τόξο ανάμεσα στις πλευρές της (το κόκκινο).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 4.1 Ίσα, αντίθετα, παράλληλα ---------- */
  vec1(box) {
    box.innerHTML = `<div class="wctl"><label>α: οριζόντια <input type="range" class="ax" min="-4" max="4" step="1" value="3"></label><label>κατακόρυφα <input type="range" class="ay" min="-4" max="4" step="1" value="1"></label>
      <label>β: οριζόντια <input type="range" class="bx" min="-6" max="6" step="1" value="-3"></label><label>κατακόρυφα <input type="range" class="by" min="-6" max="6" step="1" value="-1"></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const [ax, ay, bx, by] = ["ax", "ay", "bx", "by"].map(c => +$("." + c, box).value);
      const P = gPlot($(".pl", box), 0, 0, 9, 320);
      gArrow(P, -6, -2, -6 + ax, -2 + ay, "var(--blue)"); gText(P, -6 + ax / 2 - 0.5, -2 + ay / 2 + 0.6, "α", "fill:var(--blue)");
      gArrow(P, 2, 0, 2 + bx, by, "var(--purple)"); gText(P, 2 + bx / 2 + 0.5, by / 2 + 0.6, "β", "fill:var(--purple)");
      const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by), cr = ax * by - ay * bx, dt = ax * bx + ay * by;
      let rel;
      if (!la || !lb) rel = "Ένα από τα δύο είναι το <b>μηδενικό διάνυσμα</b>.";
      else if (cr !== 0) rel = "<b>Μη παράλληλα</b> (διαφορετική διεύθυνση).";
      else if (dt > 0) rel = la === lb ? "<b>Ίσα</b>: ίδια διεύθυνση, ίδια φορά, ίδιο μέτρο." : "<b>Ομόρροπα</b>: ίδια διεύθυνση και φορά, διαφορετικό μέτρο.";
      else rel = la === lb ? "<b>Αντίθετα</b>: ίδια διεύθυνση, αντίθετη φορά, ίδιο μέτρο (β = −α)." : "<b>Αντίρροπα</b>: ίδια διεύθυνση, αντίθετη φορά, διαφορετικό μέτρο.";
      $(".wout", box).innerHTML = `|α| = √(${pw(ax)} + ${pw(ay)}) = <b>${sqrtForm(ax * ax + ay * ay)}</b> &nbsp;·&nbsp; |β| = √(${pw(bx)} + ${pw(by)}) = <b>${sqrtForm(bx * bx + by * by)}</b><br>${rel}
        <br><span class="muted">Κάθε τετραγωνάκι = 1 μονάδα. Το μέτρο βγαίνει από το Πυθαγόρειο θεώρημα.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 4.2 Πράξεις με διανύσματα ---------- */
  vecops(box) {
    box.innerHTML = `<div class="wctl"><label>Πράξη <select class="op"><option value="add">α + β (παραλληλόγραμμο)</option><option value="chain">α + β (διαδοχικά)</option><option value="sub">α − β</option><option value="mul">λ·α</option></select></label>
      <label>λ <input type="range" class="rl" min="-3" max="3" step="0.5" value="2"><b class="vl"></b></label></div>
      <div class="wctl"><label>α: <input type="range" class="ax" min="-5" max="5" step="1" value="4"><input type="range" class="ay" min="-5" max="5" step="1" value="1"></label>
      <label>β: <input type="range" class="bx" min="-5" max="5" step="1" value="1"><input type="range" class="by" min="-5" max="5" step="1" value="3"></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const op = $(".op", box).value, l = +$(".rl", box).value, [ax, ay, bx, by] = ["ax", "ay", "bx", "by"].map(c => +$("." + c, box).value);
      $(".vl", box).textContent = fmt(l); $(".rl", box).parentElement.style.display = op === "mul" ? "" : "none";
      const P = gPlot($(".pl", box), 0, 0, 10, 330), O = [-2, -2];
      const A = [O[0] + ax, O[1] + ay];
      let out = "";
      if (op === "add") {
        const B = [O[0] + bx, O[1] + by], S = [O[0] + ax + bx, O[1] + ay + by];
        gLine(P, ...A, ...S, "stroke:var(--muted);stroke-width:1.4;stroke-dasharray:5 4"); gLine(P, ...B, ...S, "stroke:var(--muted);stroke-width:1.4;stroke-dasharray:5 4");
        gArrow(P, ...O, ...A, "var(--blue)"); gArrow(P, ...O, ...B, "var(--purple)"); gArrow(P, ...O, ...S, "var(--red)", 3.6);
        gText(P, ...S.map((v, i) => v + (i ? 0.6 : 0.3)), "α+β", "fill:var(--red)");
        out = `Κοινή αρχή, φτιάχνουμε παραλληλόγραμμο. Η διαγώνιος από την κοινή αρχή είναι το <b style="color:var(--red)">α + β</b>, μέτρου ${sqrtForm((ax + bx) ** 2 + (ay + by) ** 2)}.`;
      } else if (op === "chain") {
        const S = [A[0] + bx, A[1] + by];
        gArrow(P, ...O, ...A, "var(--blue)"); gArrow(P, ...A, ...S, "var(--purple)"); gArrow(P, ...O, ...S, "var(--red)", 3.6);
        out = `Το β ξεκινά εκεί που τελειώνει το α: <b>ΑΒ + ΒΓ = ΑΓ</b>. Από την αρχή του πρώτου στο τέλος του τελευταίου.`;
      } else if (op === "sub") {
        const B = [O[0] + bx, O[1] + by];
        gArrow(P, ...O, ...A, "var(--blue)"); gArrow(P, ...O, ...B, "var(--purple)"); gArrow(P, ...B, ...A, "var(--red)", 3.6);
        out = `Με κοινή αρχή, το <b style="color:var(--red)">α − β</b> πηγαίνει από το <b>τέλος του β</b> στο <b>τέλος του α</b>. (Έλεγχος: β + (α − β) = α.)`;
      } else {
        const L = [O[0] + l * ax, O[1] + l * ay];
        gArrow(P, ...O, ...A, "var(--blue)", 5); gArrow(P, ...O, ...L, "var(--red)", 2.6);
        out = `λ = ${fmt(l)}: το λα είναι <b>${l > 0 ? "ομόρροπο" : l < 0 ? "αντίρροπο" : "το μηδενικό"}</b>${l ? ` του α, με μέτρο |λ|·|α| = ${fmt(Math.abs(l))}·|α|` : ""}.`;
      }
      gText(P, O[0] + ax / 2 - 0.4, O[1] + ay / 2 + 0.6, "α", "fill:var(--blue)"); if (op !== "mul") gText(P, (op === "chain" ? A[0] : O[0]) + bx / 2 + 0.6, (op === "chain" ? A[1] : O[1]) + by / 2, "β", "fill:var(--purple)");
      $(".wout", box).innerHTML = out;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  }
});

/* ================= Γεννήτριες ================= */
const SUP = { 2: "", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7" };
const PYTH = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
var GENS = Object.assign(window.GENS || {}, {
  groot: { title: "Γεννήτρια — ρίζες και δυνάμεις", make() { const o = this.make0(); o.q = o.q.replace(/\\sqrt\[2\]/g, "\\sqrt"); o.sol = o.sol.replace(/\\sqrt\[2\]/g, "\\sqrt"); return o; }, make0() {
    const t = ri(0, 3);
    if (t === 0) { const n = ri(2, 5), b = ri(2, n > 3 ? 3 : 6), a = b ** n; return { q: R`Να υπολογίσετε τη ρίζα $\sqrt[${n}]{${a}}$.`, fields: [{ label: "=", ans: b }], sol: R`$${a} = ${b}^{${n}}$, άρα $\sqrt[${n}]{${a}} = \sqrt[${n}]{${b}^{${n}}} = ${b}$.` }; }
    if (t === 1) { const n = ri(2, 3), b = ri(2, n === 2 ? 7 : 4), m = [-2, -1, 1, 2, 3][ri(0, 4)], a = b ** n, v = m > 0 ? b ** m : "1/" + b ** -m;
      return { q: R`Να υπολογίσετε χωρίς υπολογιστική μηχανή: $${a}^{${m < 0 ? "-" : ""}\frac{${Math.abs(m)}}{${n}}}$.`, fields: [{ label: "=", ans: v }], sol: R`$${a}^{${m < 0 ? "-" : ""}\frac{${Math.abs(m)}}{${n}}} = \left(\sqrt[${n}]{${a}}\right)^{${m}} = ${b}^{${m}} = ${m > 0 ? b ** m : R`\frac{1}{${b ** -m}}`}$.` }; }
    if (t === 2) { const n = ri(3, 5), b = ri(2, n === 3 ? 5 : 3), s = n % 2 && ri(0, 1) ? -1 : 1, a = s * b ** n;
      return { q: R`Να λύσετε την εξίσωση $x^{${n}} = ${a}$.${n % 2 ? "" : " Δώστε τη <b>θετική</b> λύση."}`, fields: [{ label: n % 2 ? "x =" : "x (θετική) =", ans: s * b }], sol: n % 2 ? R`$\nu = ${n}$ περιττός ⇒ μία λύση: $x = ${s < 0 ? "-" : ""}\sqrt[${n}]{${b ** n}} = ${s * b}$.` : R`$\nu = ${n}$ άρτιος και $${a} > 0$ ⇒ $x = \pm\sqrt[${n}]{${a}} = \pm ${b}$. Θετική: $${b}$.` }; }
    const k = ri(2, 6), m = [2, 3, 5, 6, 7][ri(0, 4)], N = k * k * m;
    return { q: R`Να γράψετε τη $\sqrt{${N}}$ στη μορφή $\alpha\sqrt{${m}}$.`, fields: [{ label: "α =", ans: k }], sol: R`$\sqrt{${N}} = \sqrt{${k * k}\cdot ${m}} = \sqrt{${k * k}}\cdot\sqrt{${m}} = ${k}\sqrt{${m}}$.` };
  } },
  grat: { title: "Γεννήτρια — ρητοποίηση παρονομαστή", make() {
    const t = ri(0, 1);
    if (t === 0) { const b = [2, 3, 5, 6, 7, 10][ri(0, 5)], a = b * ri(1, 4) * (ri(0, 1) ? 1 : 2) ; const g = gcdI(a, b);
      return { q: R`Να γράψετε το κλάσμα $\dfrac{${a}}{\sqrt{${b}}}$ με ρητό παρονομαστή, στη μορφή $\kappa\sqrt{${b}}$.`, fields: [{ label: "κ =", ans: fracS2(a, b) }],
        sol: R`$\dfrac{${a}}{\sqrt{${b}}} = \dfrac{${a}\sqrt{${b}}}{(\sqrt{${b}})^2} = \dfrac{${a}\sqrt{${b}}}{${b}} = ${texFrac(a, b)}\sqrt{${b}}$. Άρα $\kappa = ${texFrac(a, b)}$.` }; }
    const pr = [[3, 2], [5, 3], [7, 5], [6, 2], [7, 3]][ri(0, 4)], [m, n] = pr, d = m - n, a = d * ri(1, 3), sg = ri(0, 1);
    return { q: R`Να γράψετε το $\dfrac{${a}}{\sqrt{${m}} ${sg ? "+" : "-"} \sqrt{${n}}}$ με ρητό παρονομαστή, στη μορφή $\kappa\left(\sqrt{${m}} ${sg ? "-" : "+"} \sqrt{${n}}\right)$.`, fields: [{ label: "κ =", ans: fracS2(a, d) }],
      sol: R`Πολλαπλασιάζουμε με τη συζυγή $\sqrt{${m}} ${sg ? "-" : "+"} \sqrt{${n}}$: παρονομαστής $(\sqrt{${m}})^2 - (\sqrt{${n}})^2 = ${m} - ${n} = ${d}$.<br>$\dfrac{${a}(\sqrt{${m}} ${sg ? "-" : "+"} \sqrt{${n}})}{${d}} = ${texFrac(a, d)}\left(\sqrt{${m}} ${sg ? "-" : "+"} \sqrt{${n}}\right)$.` };
  } },
  gquad: { title: "Γεννήτρια — τεταρτημόρια και τελική πλευρά", make() {
    const t = ri(0, 1);
    if (t === 0) { let a; do { a = ri(-80, 80) * 10 + 5 * ri(0, 1); } while (gq(a) === 0 || Math.abs(a) < 20);
      return { q: R`Σε ποιο τεταρτημόριο βρίσκεται η τελική πλευρά της γωνίας $${a}^\circ$ (σε κανονική θέση);`, fields: [{ label: "τεταρτημόριο =", ans: gq(a) }], sol: a === (((a % 360) + 360) % 360) ? R`Η $${a}^\circ$ βρίσκεται ήδη στο $[0^\circ, 360^\circ)$ και έχει τελική πλευρά στο <b>${gq(a)}ο τεταρτημόριο</b>.` : R`$${a}^\circ = ${(((a % 360) + 360) % 360)}^\circ ${a - (((a % 360) + 360) % 360) >= 0 ? "+" : "-"} ${Math.abs(a - (((a % 360) + 360) % 360)) / 360}\cdot 360^\circ$. Η $${(((a % 360) + 360) % 360)}^\circ$ έχει τελική πλευρά στο <b>${gq(a)}ο τεταρτημόριο</b>.` }; }
    let a; do { a = (ri(0, 1) ? 1 : -1) * ri(40, 150) * 10; } while (a % 360 === 0); const r = ((a % 360) + 360) % 360;
    return { q: R`Να βρείτε τη γωνία $\theta$ με $0^\circ \le \theta < 360^\circ$ που έχει την ίδια τελική πλευρά με τη γωνία $${a}^\circ$.`, fields: [{ label: "θ =", ans: r }], sol: R`Προσθέτουμε/αφαιρούμε ακέραια πολλαπλάσια του $360^\circ$: $${a}^\circ ${a > r ? "-" : "+"} ${Math.abs(a - r) / 360}\cdot 360^\circ = ${r}^\circ$.` };
  } },
  gtrig: { title: "Γεννήτρια — από έναν τριγωνομετρικό αριθμό στους άλλους", make() {
    const [p, qq, h] = PYTH[ri(0, PYTH.length - 1)], swap = ri(0, 1), a = swap ? qq : p, b = swap ? p : qq; /* ημ = a/h ή συν = a/h */
    const q = ri(1, 4), sS = q <= 2 ? 1 : -1, sC = q === 1 || q === 4 ? 1 : -1, givenSin = ri(0, 1);
    const S = sS * (givenSin ? a : b), C = sC * (givenSin ? b : a);
    const rng = ["0^\\circ < \\theta < 90^\\circ", "90^\\circ < \\theta < 180^\\circ", "180^\\circ < \\theta < 270^\\circ", "270^\\circ < \\theta < 360^\\circ"][q - 1];
    const giv = givenSin ? R`\text{ημ}\theta = ${texFrac(S, h)}` : R`\text{συν}\theta = ${texFrac(C, h)}`;
    return { q: R`Αν $${giv}$ και $${rng}$, να υπολογίσετε τους άλλους τριγωνομετρικούς αριθμούς της $\theta$.`,
      fields: givenSin ? [{ label: "συνθ =", ans: fracS2(C, h) }, { label: "εφθ =", ans: fracS2(S, C) }, { label: "σφθ =", ans: fracS2(C, S) }] : [{ label: "ημθ =", ans: fracS2(S, h) }, { label: "εφθ =", ans: fracS2(S, C) }, { label: "σφθ =", ans: fracS2(C, S) }],
      sol: R`Από $\text{ημ}^2\theta + \text{συν}^2\theta = 1$: $${givenSin ? R`\text{συν}^2\theta = 1 - \frac{${a * a}}{${h * h}} = \frac{${b * b}}{${h * h}}` : R`\text{ημ}^2\theta = 1 - \frac{${a * a}}{${h * h}} = \frac{${b * b}}{${h * h}}`}$ ⇒ $${givenSin ? "\\text{συν}" : "\\text{ημ}"}\theta = \pm\frac{${b}}{${h}}$.<br>Στο ${q}ο τεταρτημόριο ${givenSin ? (sC > 0 ? "το συνημίτονο είναι θετικό" : "το συνημίτονο είναι αρνητικό") : (sS > 0 ? "το ημίτονο είναι θετικό" : "το ημίτονο είναι αρνητικό")} ⇒ $${givenSin ? R`\text{συν}\theta = ${texFrac(C, h)}` : R`\text{ημ}\theta = ${texFrac(S, h)}`}$.<br>$\text{εφ}\theta = \frac{\text{ημ}\theta}{\text{συν}\theta} = ${texFrac(S, C)}$, $\;\text{σφ}\theta = \frac{1}{\text{εφ}\theta} = ${texFrac(C, S)}$.` };
  } },
  gnot: { title: "Γεννήτρια — τριγωνομετρικοί αριθμοί βασικών γωνιών", make() {
    const base = { 0: ["0", "1", "0"], 30: ["1/2", "√3/2", "√3/3"], 45: ["√2/2", "√2/2", "1"], 60: ["√3/2", "1/2", "√3"], 90: ["1", "0", null] };
    const tex = s => s === null ? null : s.replace(/√(\d)\/(\d)/, "\\frac{\\sqrt{$1}}{$2}").replace(/^(\d)\/(\d)$/, "\\frac{$1}{$2}").replace(/^√(\d)$/, "\\sqrt{$1}");
    let th, ac, kind;
    do { ac = [30, 45, 60][ri(0, 2)]; kind = ri(0, 1); th = kind ? 180 - ac : 90 - ac; if (ri(0, 3) === 0) { th = [90, 180, 270, 0][ri(0, 3)]; kind = 2; } } while (false);
    const fn = ri(0, 2), nm = ["ημ", "συν", "εφ"][fn], nmT = ["\\text{ημ}", "\\text{συν}", "\\text{εφ}"][fn];
    const exact = { 0: [0, 1, 0], 90: [1, 0, null], 180: [0, -1, 0], 270: [-1, 0, null] };
    let val, sol;
    if (kind === 2) { val = exact[th][fn]; if (val === null) { th = 180; val = exact[180][fn]; } sol = R`Στον τριγωνομετρικό κύκλο, η γωνία $${th}^\circ$ αντιστοιχεί στο σημείο $(${exact[th][1]}, ${exact[th][0]})$ ⇒ $${nmT}${th}^\circ = ${val}$.`; return { q: R`Να υπολογίσετε: $${nmT}\,${th}^\circ$.`, fields: [{ label: nm + th + "° =", ans: val }], sol }; }
    if (kind === 1) { /* 180 − θ */ const v = base[ac][fn], neg = fn > 0; val = (neg ? "-" : "") + v; sol = R`$${th}^\circ = 180^\circ - ${ac}^\circ$ ⇒ $${nmT}${th}^\circ = ${neg ? "-" : ""}${nmT}${ac}^\circ = ${neg ? "-" : ""}${tex(v)}$.`; }
    else { const sw = fn === 0 ? 1 : fn === 1 ? 0 : 2; let v; if (fn === 2) { v = base[th][2]; sol = R`$\text{εφ}${th}^\circ = \text{σφ}${ac}^\circ = \frac{1}{\text{εφ}${ac}^\circ} = ${tex(v)}$.`; } else { v = base[ac][sw]; sol = R`$${th}^\circ = 90^\circ - ${ac}^\circ$ ⇒ $${nmT}${th}^\circ = ${fn === 0 ? "\\text{συν}" : "\\text{ημ}"}${ac}^\circ = ${tex(v)}$.`; } val = v; }
    return { q: R`Να υπολογίσετε χωρίς υπολογιστική μηχανή: $${nmT}\,${th}^\circ$.`, fields: [{ label: nm + th + "° =", ans: val }], sol };
  } },
  gcirc: { title: "Γεννήτρια — γωνίες στον κύκλο", make() {
    const t = ri(0, 3);
    if (t === 0) { const c = 2 * ri(15, 85); return { q: R`Επίκεντρη γωνία $\widehat{AOB} = ${c}^\circ$. Πόση είναι κάθε εγγεγραμμένη γωνία που βαίνει στο ίδιο τόξο $\overset{\frown}{AB}$;`, fields: [{ label: "εγγεγραμμένη =", ans: c / 2 }], sol: R`Εγγεγραμμένη = μισό της αντίστοιχης επίκεντρης: $\frac{${c}^\circ}{2} = ${c / 2}^\circ$.` }; }
    if (t === 1) { const a = ri(50, 130); return { q: R`Το τετράπλευρο $AB\Gamma\Delta$ είναι εγγεγραμμένο σε κύκλο και $\hat A = ${a}^\circ$. Πόση είναι η $\hat\Gamma$;`, fields: [{ label: "Γ =", ans: 180 - a }], sol: R`Οι απέναντι γωνίες εγγεγραμμένου τετραπλεύρου είναι παραπληρωματικές: $\hat\Gamma = 180^\circ - ${a}^\circ = ${180 - a}^\circ$.` }; }
    if (t === 2) { const a = ri(20, 75); return { q: R`Η $AB$ είναι διάμετρος κύκλου και $\Gamma$ σημείο του κύκλου με $\widehat{\Gamma AB} = ${a}^\circ$. Πόση είναι η $\widehat{AB\Gamma}$;`, fields: [{ label: "ΑΒΓ =", ans: 90 - a }], sol: R`Η $\widehat{A\Gamma B}$ βαίνει σε ημικύκλιο ⇒ $90^\circ$. Άρα $\widehat{AB\Gamma} = 180^\circ - 90^\circ - ${a}^\circ = ${90 - a}^\circ$.` }; }
    const arc = 2 * ri(20, 80); return { q: R`Η ευθεία $\varepsilon$ εφάπτεται του κύκλου στο $A$ και η χορδή $AB$ ορίζει τόξο $${arc}^\circ$ (ανάμεσα στις πλευρές της γωνίας). Πόση είναι η γωνία χορδής–εφαπτομένης;`, fields: [{ label: "γωνία =", ans: arc / 2 }], sol: R`Ισούται με την εγγεγραμμένη στο ίδιο τόξο, δηλαδή με το μισό του τόξου: $\frac{${arc}^\circ}{2} = ${arc / 2}^\circ$.` };
  } }
});

/* ================= Widgets Α΄ Λυκείου ΚΚ — Τεύχος Β ================= */
const sg2 = v => (v < 0 ? " − " : " + ") + fmt(Math.abs(v));
function quadStr(a, b, c) { let s = (a === 1 ? "" : a === -1 ? "−" : fmt(a)) + "x²"; if (b) s += (b < 0 ? " − " : " + ") + (Math.abs(b) === 1 ? "" : fmt(Math.abs(b))) + "x"; if (c) s += sg2(c); return s; }
function statsOf(arr) {
  const n = arr.length, d = [...arr].sort((u, v) => u - v), mean = arr.reduce((u, v) => u + v, 0) / n;
  const med = n % 2 ? d[(n - 1) / 2] : (d[n / 2 - 1] + d[n / 2]) / 2;
  const cnt = {}; arr.forEach(v => cnt[v] = (cnt[v] || 0) + 1); const mx = Math.max(...Object.values(cnt));
  const modes = Object.keys(cnt).filter(k => cnt[k] === mx).map(Number).sort((u, v) => u - v);
  const v2 = arr.reduce((u, v) => u + (v - mean) ** 2, 0) / n;
  return { n, d, mean, med, modes: mx > 1 ? modes : [], range: d[n - 1] - d[0], var: v2, sd: Math.sqrt(v2) };
}

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 5.1 y = α(x + κ)² + λ ---------- */
  parab(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="-3" max="3" step="0.25" value="1"><b class="va"></b></label>
      <label>κ <input type="range" class="rk" min="-5" max="5" step="0.5" value="-2"><b class="vk"></b></label>
      <label>λ <input type="range" class="rl" min="-6" max="6" step="0.5" value="-3"><b class="vl"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      let a = +$(".ra", box).value; if (a === 0) { a = 0.25; $(".ra", box).value = a; }
      const k = +$(".rk", box).value, l = +$(".rl", box).value;
      $(".va", box).textContent = fmt(a); $(".vk", box).textContent = fmt(k); $(".vl", box).textContent = fmt(l);
      const P = makePlot($(".pl", box), { xmin: -9, xmax: 9, ymin: -9, ymax: 9, H: 360, xstep: 1, ystep: 1 });
      P.curve(x => x * x, "cfam"); P.curve(x => a * (x + k) ** 2 + l, "c1");
      P.seg(-k, -20, -k, 20, "guide"); P.dot(-k, l, a > 0 ? "dmin" : "dmax", `Κ(${fmt(-k)}, ${fmt(l)})`, 8, a > 0 ? 18 : -10);
      const form = `y = ${a === 1 ? "" : a === -1 ? "−" : fmt(a)}(x ${k < 0 ? "−" : "+"} ${fmt(Math.abs(k))})²${l ? sg2(l) : ""}`;
      $(".wout", box).innerHTML = `<b>${form}</b><br>Κορυφή <b>(${fmt(-k)}, ${fmt(l)})</b> · άξονας συμμετρίας <b>x = ${fmt(-k)}</b> · ${a > 0 ? `ελάχιστη τιμή <b>${fmt(l)}</b>, σύνολο τιμών [${fmt(l)}, +∞)` : `μέγιστη τιμή <b>${fmt(l)}</b>, σύνολο τιμών (−∞, ${fmt(l)}]`}
        <br><span class="muted">Γκρι: y = x². Το α «ανοίγει/κλείνει» και αναποδογυρίζει την παραβολή, το κ τη μετατοπίζει <b>οριζόντια</b> (κ &gt; 0 ⇒ αριστερά!), το λ <b>κατακόρυφα</b>.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 5.2 – 5.3 Τριώνυμο ---------- */
  trin(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="-3" max="3" step="0.5" value="1"><b class="va"></b></label>
      <label>β <input type="range" class="rb" min="-8" max="8" step="1" value="-2"><b class="vb"></b></label>
      <label>γ <input type="range" class="rc" min="-9" max="9" step="1" value="-3"><b class="vc"></b></label>
      <label>ανίσωση <select class="si"><option value="0">f(x) &gt; 0</option><option value="1">f(x) ≥ 0</option><option value="2">f(x) &lt; 0</option><option value="3">f(x) ≤ 0</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      let a = +$(".ra", box).value; if (a === 0) { a = 0.5; $(".ra", box).value = a; }
      const b = +$(".rb", box).value, c = +$(".rc", box).value, iq = +$(".si", box).value;
      $(".va", box).textContent = fmt(a); $(".vb", box).textContent = b; $(".vc", box).textContent = c;
      const f = x => a * x * x + b * x + c, D = b * b - 4 * a * c, xv = -b / (2 * a), yv = f(xv);
      const P = makePlot($(".pl", box), { xmin: xv - 7, xmax: xv + 7, ymin: -10, ymax: 10, H: 340, xstep: 1, ystep: 2 });
      let r = []; if (D > 1e-12) { const s = Math.sqrt(D); r = [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((u, v) => u - v); } else if (Math.abs(D) <= 1e-12) r = [xv];
      /* σκίαση λύσεων */
      const want = x => iq === 0 ? f(x) > 1e-12 : iq === 1 ? f(x) >= -1e-12 : iq === 2 ? f(x) < -1e-12 : f(x) <= 1e-12;
      const cuts = [xv - 7, ...r, xv + 7];
      for (let i = 0; i < cuts.length - 1; i++) { const m = (cuts[i] + cuts[i + 1]) / 2; if (want(m)) P.band(cuts[i], cuts[i + 1], "bandok"); }
      P.curve(f, "c1"); P.seg(xv, -20, xv, 20, "guide");
      r.forEach(x => P.dot(x, 0, "dinf", fmt(x), 6, 16)); P.dot(xv, yv, a > 0 ? "dmin" : "dmax", `(${fmt(xv)}, ${fmt(yv)})`, 8, a > 0 ? 18 : -10);
      /* λύση ανίσωσης σε λόγια */
      const strict = iq === 0 || iq === 2, positive = iq < 2, L = strict ? "(" : "[", Rb = strict ? ")" : "]";
      let sol;
      const wantPos = positive === (a > 0); /* θέλουμε το ίδιο πρόσημο με το α; */
      if (r.length === 2) sol = wantPos ? `x ${strict ? "&lt;" : "≤"} ${fmt(r[0])} ή x ${strict ? "&gt;" : "≥"} ${fmt(r[1])}` : `${L}${fmt(r[0])}, ${fmt(r[1])}${Rb}`;
      else if (r.length === 1) sol = wantPos ? (strict ? `κάθε x ≠ ${fmt(r[0])}` : "κάθε x ∈ ℝ") : (strict ? "αδύνατη" : `μόνο x = ${fmt(r[0])}`);
      else sol = wantPos ? "κάθε x ∈ ℝ" : "αδύνατη";
      $(".wout", box).innerHTML = `f(x) = <b>${quadStr(a, b, c)}</b> · Δ = β² − 4αγ = <b>${fmt(D)}</b> ⇒ ${D > 0 ? "δύο ρίζες: <b>" + r.map(fmt).join(", ") + "</b>" : D === 0 ? "διπλή ρίζα: <b>" + fmt(xv) + "</b>" : "καμία πραγματική ρίζα"}
        <br>Κορυφή (−β/2α, −Δ/4α) = <b>(${fmt(xv)}, ${fmt(yv)})</b> · ${a > 0 ? "ελάχιστο" : "μέγιστο"} ${fmt(yv)} · S = −β/α = ${fmt(-b / a)}, P = γ/α = ${fmt(c / a)}
        <br>Λύσεις της ανίσωσης ${["f(x) &gt; 0", "f(x) ≥ 0", "f(x) &lt; 0", "f(x) ≤ 0"][iq]}: <b>${sol}</b> <span class="muted">(πράσινη σκίαση)</span>
        <br><span class="muted">Κανόνας: έξω από τις ρίζες το τριώνυμο έχει το πρόσημο του α, ανάμεσα στις ρίζες το αντίθετο.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 5.2.4 Ευθεία και παραβολή ---------- */
  linepar(box) {
    box.innerHTML = `<div class="wctl"><label>κλίση λ <input type="range" class="rm" min="-4" max="6" step="0.5" value="2"><b class="vm"></b></label>
      <label>τεταγμένη επί την αρχή <input type="range" class="rn" min="-6" max="16" step="1" value="15"><b class="vn"></b></label>
      <label>παραβολή <select class="sp"><option value="0">y = x²</option><option value="1">y = x² + 3x + 20</option><option value="2">y = −x² + 4</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    const ps = [[1, 0, 0], [1, 3, 20], [-1, 0, 4]];
    function draw() {
      const m = +$(".rm", box).value, n = +$(".rn", box).value, [a, b, c] = ps[$(".sp", box).value];
      $(".vm", box).textContent = fmt(m); $(".vn", box).textContent = n;
      const P = makePlot($(".pl", box), { xmin: -8, xmax: 8, ymin: -10, ymax: 40, H: 340, xstep: 1, ystep: 5 });
      P.curve(x => a * x * x + b * x + c, "c1"); P.curve(x => m * x + n, "c2");
      const A = a, B = b - m, C = c - n, D = B * B - 4 * A * C;
      let r = []; if (D > 1e-12) r = [(-B - Math.sqrt(D)) / (2 * A), (-B + Math.sqrt(D)) / (2 * A)].sort((u, v) => u - v); else if (Math.abs(D) <= 1e-12) r = [-B / (2 * A)];
      r.forEach(x => P.dot(x, m * x + n, "dmin", `(${fmt(x)}, ${fmt(m * x + n)})`, 8, -8));
      $(".wout", box).innerHTML = `Εξισώνουμε: ${quadStr(a, b, c)} = ${fmt(m)}x${sg2(n)} ⇔ <b>${quadStr(A, B, C)} = 0</b>, Δ = ${fmt(D)}<br>${D > 0 ? "Δ &gt; 0 ⇒ η ευθεία <b>τέμνει</b> την παραβολή σε δύο σημεία." : D === 0 ? "Δ = 0 ⇒ η ευθεία <b>εφάπτεται</b> της παραβολής (ένα κοινό σημείο)." : "Δ &lt; 0 ⇒ <b>κανένα</b> κοινό σημείο."}`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 6.1 Θεώρημα Θαλή ---------- */
  thales(box) {
    box.innerHTML = `<div class="wctl"><label>θέση μεσαίας παράλληλης <input type="range" class="ry" min="0.6" max="4.4" step="0.1" value="2"><b class="vy"></b></label>
      <label>κλίση 2ης τέμνουσας <input type="range" class="rs" min="-1.5" max="1.5" step="0.1" value="-0.6"></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const ym = +$(".ry", box).value, s = +$(".rs", box).value;
      const P = gPlot($(".pl", box), 4, 2.5, 7.5, 340, false);
      [5, ym, 0].forEach((y, i) => { gLine(P, -3.5, y, 11.5, y, "stroke:var(--purple);stroke-width:1.8"); gText(P, 11.2, y + 0.35, "ε" + (i + 1), "fill:var(--purple)"); });
      const t1 = y => 0.6 * y, t2 = y => 7 + s * y;
      gLine(P, t1(-0.5), -0.5, t1(5.5), 5.5); gLine(P, t2(-0.5), -0.5, t2(5.5), 5.5);
      const A = [t1(5), 5], B = [t1(ym), ym], G = [t1(0), 0], D = [t2(5), 5], E = [t2(ym), ym], Z = [t2(0), 0];
      [[A, "Α"], [B, "Β"], [G, "Γ"], [D, "Δ"], [E, "Ε"], [Z, "Ζ"]].forEach(([p, l], i) => P.dot(p[0], p[1], "d2", l, i < 3 ? -16 : 8, -6));
      const len = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
      const r1 = len(A, B) / len(B, G), r2 = len(D, E) / len(E, Z);
      $(".wout", box).innerHTML = `ΑΒ = ${fmt(len(A, B))}, ΒΓ = ${fmt(len(B, G))} ⇒ <b>ΑΒ/ΒΓ = ${fmt(r1)}</b> &nbsp;·&nbsp; ΔΕ = ${fmt(len(D, E))}, ΕΖ = ${fmt(len(E, Z))} ⇒ <b>ΔΕ/ΕΖ = ${fmt(r2)}</b>
        <br><span class="muted">Όσο κι αν γείρεις τη δεύτερη τέμνουσα, οι λόγοι μένουν ίσοι: παράλληλες ευθείες χωρίζουν τις τέμνουσες σε ανάλογα τμήματα.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 6.2 – 6.3 Ομοιότητα ---------- */
  simil(box) {
    box.innerHTML = `<div class="wctl"><label>λόγος ομοιότητας λ <input type="range" class="rl" min="0.5" max="3" step="0.25" value="2"><b class="vl"></b></label>
      <label>σχήμα <select class="ss"><option value="0">τρίγωνο 3–4–5</option><option value="1">τρίγωνο 4–5–6</option><option value="2">ορθογώνιο 2 × 3</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    const shapes = [[[0, 0], [4, 0], [0, 3]], [[0, 0], [6, 0], [3.75, 3.307]], [[0, 0], [3, 0], [3, 2], [0, 2]]];
    function draw() {
      const l = +$(".rl", box).value, sh = shapes[$(".ss", box).value]; $(".vl", box).textContent = fmt(l);
      const P = gPlot($(".pl", box), 9.5, 4, 11, 340);
      const draw1 = (pts, dx, k, col) => { const q = pts.map(p => [dx + k * p[0], k * p[1]]); P.layer.appendChild(svgEl("polygon", { points: q.map(p => P.sx(p[0]) + "," + P.sy(p[1])).join(" "), style: `fill:${col};fill-opacity:.18;stroke:${col};stroke-width:2.4` })); };
      draw1(sh, 0, 1, "var(--blue)"); draw1(sh, 7, l, "var(--purple)");
      const per = pts => pts.reduce((u, p, i) => u + Math.hypot(p[0] - pts[(i + 1) % pts.length][0], p[1] - pts[(i + 1) % pts.length][1]), 0);
      const area = pts => Math.abs(pts.reduce((u, p, i) => u + p[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * p[1], 0)) / 2;
      const p1 = per(sh), e1 = area(sh);
      $(".wout", box).innerHTML = `Περίμετροι: ${fmt(p1)} → ${fmt(l * p1)} ⇒ λόγος <b>${fmt(l)} = λ</b> &nbsp;·&nbsp; Εμβαδά: ${fmt(e1)} → ${fmt(l * l * e1)} ⇒ λόγος <b>${fmt(l * l)} = λ²</b>
        <br><span class="muted">Οι γωνίες μένουν ίδιες. Τα μήκη πολλαπλασιάζονται με λ, τα εμβαδά με λ². Π.χ. διπλάσιες πλευρές ⇒ τετραπλάσιο εμβαδόν.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 7.1 Πολύγωνο αθροιστικών συχνοτήτων ---------- */
  cumfreq(box) {
    const sets = [
      { n: "Χρόνος μετάβασης (λεπτά)", a: 0, w: 10, f: [9, 18, 13, 10, 4, 4, 2] },
      { n: "Επίπεδα SO₂ σήμερα (μgr/m³)", a: 10, w: 5, f: [6, 4, 3, 5, 2, 1, 2, 1] },
      { n: "Δείκτης IQ", a: 50, w: 20, f: [24, 228, 490, 232, 26] }];
    box.innerHTML = `<div class="wctl"><label>Δεδομένα <select class="sd">${sets.map((s, i) => `<option value="${i}">${s.n}</option>`).join("")}</select></label></div>
      <div class="wctl fq"></div><div class="pl"></div><div class="wout"></div>`;
    function setup() { const s = sets[$(".sd", box).value]; $(".fq", box).innerHTML = s.f.map((v, i) => `<label>[${s.a + i * s.w}, ${s.a + (i + 1) * s.w}) <input type="number" min="0" max="999" value="${v}" style="width:4.2em"></label>`).join(""); $(".fq", box).querySelectorAll("input").forEach(i => i.oninput = draw); draw(); }
    function draw() {
      const s = sets[$(".sd", box).value], f = [...$(".fq", box).querySelectorAll("input")].map(i => Math.max(0, +i.value || 0)), N = f.reduce((u, v) => u + v, 0);
      const xs = [s.a, ...f.map((_, i) => s.a + (i + 1) * s.w)], cum = [0]; f.forEach(v => cum.push(cum[cum.length - 1] + v));
      const P = makePlot($(".pl", box), { xmin: s.a - s.w * 0.5, xmax: xs[xs.length - 1] + s.w * 0.5, ymin: -N * 0.08, ymax: N * 1.12 || 1, H: 320, xstep: s.w, ystep: niceStep(N * 1.2 || 1) });
      for (let i = 0; i < f.length; i++) P.layer.appendChild(svgEl("rect", { x: P.sx(xs[i]), y: P.sy(cum[i + 1]), width: P.sx(xs[i + 1]) - P.sx(xs[i]), height: P.sy(0) - P.sy(cum[i + 1]), style: "fill:var(--blue);fill-opacity:.12;stroke:var(--line)" }));
      const poly = x => { for (let i = 0; i < f.length; i++) if (x <= xs[i + 1]) return cum[i] + (cum[i + 1] - cum[i]) * (x - xs[i]) / s.w; return N; };
      P.curve(poly, "c1", xs[0], xs[xs.length - 1]); xs.forEach((x, i) => P.dot(x, cum[i], "d2"));
      const inv = t => { for (let i = 0; i < f.length; i++) if (t <= cum[i + 1] && f[i] > 0) return xs[i] + (t - cum[i]) / f[i] * s.w; return xs[xs.length - 1]; };
      const Q = [0.25, 0.5, 0.75].map(p => inv(p * N));
      Q.forEach((q, i) => { const y = [0.25, 0.5, 0.75][i] * N; P.seg(xs[0], y, q, y, "guide"); P.seg(q, y, q, 0, "guide"); P.dot(q, 0, "dmin", "Q" + (i + 1), 4, 16); });
      $(".wout", box).innerHTML = `Σύνολο N = <b>${N}</b> · αθροιστικές συχνότητες: ${cum.slice(1).join(", ")}
        <br>Q₁ ≈ <b>${fmt(Q[0])}</b> (στο ${fmt(N / 4)}) · Q₂ = διάμεσος ≈ <b>${fmt(Q[1])}</b> (στο ${fmt(N / 2)}) · Q₃ ≈ <b>${fmt(Q[2])}</b> (στο ${fmt(3 * N / 4)})
        <br><span class="muted">Το πολύγωνο ενώνει τα σημεία (δεξί άκρο κλάσης, αθροιστική συχνότητα), ξεκινώντας από το (αριστερό άκρο, 0). Άλλαξε τις συχνότητες!</span>`;
    }
    $(".sd", box).onchange = setup; setup();
  },

  /* ---------- 7.2 Μέτρα θέσης και διασποράς ---------- */
  disp(box) {
    box.innerHTML = `<div class="wctl"><label style="flex:1 1 100%">Δεδομένα (χώρισε με κόμμα ή κενό) <input type="text" class="td" value="8, 15, 13, 20, 9, 13, 17, 19, 20, 11, 10, 10, 15, 13, 14, 17" style="width:100%"></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const arr = $(".td", box).value.replace(/(\d),(\d)/g, "$1.$2").split(/[\s;,]+/).map(Number).filter(v => isFinite(v) && $(".td", box).value.trim() !== "");
      if (arr.length < 2) { $(".wout", box).innerHTML = '<span class="warnc">Γράψε τουλάχιστον δύο αριθμούς.</span>'; return; }
      const S = statsOf(arr), lo = S.d[0], hi = S.d[S.n - 1], pad = Math.max(1, (hi - lo) * 0.15);
      const cnt = {}; const P = makePlot($(".pl", box), { xmin: lo - pad, xmax: hi + pad, ymin: -1, ymax: 8, H: 220, xstep: niceStep(hi - lo + 2 * pad), ystep: 10 });
      P.band(S.mean - S.sd, S.mean + S.sd, "bandok");
      S.d.forEach(v => { cnt[v] = (cnt[v] || 0) + 1; P.dot(v, cnt[v] * 0.8 - 0.2, "d1"); });
      P.seg(S.mean, -1, S.mean, 8, "asl"); P.seg(S.med, -1, S.med, 8, "guide");
      $(".wout", box).innerHTML = `ν = ${S.n} · μέση τιμή x̄ = <b>${fmt(S.mean)}</b> (κόκκινη) · διάμεσος = <b>${fmt(S.med)}</b> (γκρι) · επικρατούσα: <b>${S.modes.length ? S.modes.map(fmt).join(", ") : "καμία"}</b>
        <br>εύρος = <b>${fmt(S.range)}</b> · διακύμανση s² = <b>${fmt(S.var)}</b> · τυπική απόκλιση s = <b>${fmt(S.sd)}</b> <span class="muted">(πράσινη ζώνη: x̄ ± s)</span>
        <br><span class="muted">Δοκίμασε: πρόσθεσε 5 σε όλες τις τιμές — η μέση τιμή αυξάνεται κατά 5, η τυπική απόκλιση μένει ίδια. Άλλαξε δύο τιμές σε 1 — η μέση τιμή «τραβιέται», η διάμεσος σχεδόν όχι.</span>`;
    }
    $(".td", box).oninput = draw; draw();
  }
});

/* ================= Γεννήτριες ================= */
var GENS = Object.assign(window.GENS || {}, {
  gvert: { title: "Γεννήτρια — κορυφή και ακρότατο παραβολής", make() {
    const a = [-3, -2, -1, 1, 2, 3][ri(0, 5)], x0 = ri(-5, 5), y0 = ri(-8, 8), b = -2 * a * x0, c = a * x0 * x0 + y0;
    return { q: R`Δίνεται η συνάρτηση $f(x) = ${quadStr(a, b, c).replace(/x²/, "x^2").replace(/−/g, "-")}$. Να βρείτε την κορυφή της παραβολής και την ${a > 0 ? "ελάχιστη" : "μέγιστη"} τιμή της $f$.`,
      fields: [{ label: "x κορυφής =", ans: x0 }, { label: (a > 0 ? "ελάχιστη" : "μέγιστη") + " τιμή =", ans: y0 }],
      sol: R`$x_K = -\frac{\beta}{2\alpha} = -\frac{${b}}{${2 * a}} = ${x0}$, $\;y_K = f(${x0}) = ${y0}$.<br>Αφού $\alpha = ${a} ${a > 0 ? ">" : "<"} 0$, η $f$ έχει <b>${a > 0 ? "ελάχιστη" : "μέγιστη"}</b> τιμή $${y0}$ στο $x = ${x0}$. Σε μορφή κορυφής: $f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}${x0 === 0 ? "x^2" : `(x ${x0 > 0 ? "-" : "+"} ${Math.abs(x0)})^2`}${y0 === 0 ? "" : ` ${y0 < 0 ? "-" : "+"} ${Math.abs(y0)}`}$.` };
  } },
  gquad: { title: "Γεννήτρια — εξίσωση 2ου βαθμού", make() {
    let p, q, a; do { p = ri(-7, 7); q = ri(-7, 7); a = [1, 1, 2, -1, 3][ri(0, 4)]; } while (p === q);
    const r1 = Math.min(p, q), r2 = Math.max(p, q), b = -a * (r1 + r2), c = a * r1 * r2, D = b * b - 4 * a * c;
    return { q: R`Να λύσετε την εξίσωση $${quadStr(a, b, c).replace(/x²/, "x^2").replace(/−/g, "-")} = 0$.`,
      fields: [{ label: "μικρότερη λύση =", ans: r1 }, { label: "μεγαλύτερη λύση =", ans: r2 }],
      sol: R`$\Delta = \beta^2 - 4\alpha\gamma = ${b < 0 ? `(${b})` : b}^2 - 4\cdot ${a < 0 ? `(${a})` : a}\cdot ${c < 0 ? `(${c})` : c} = ${D}$, $\sqrt\Delta = ${Math.sqrt(D)}$.<br>$x_{1,2} = \frac{${-b} \pm ${Math.sqrt(D)}}{${2 * a}}$ ⇒ $x_1 = ${r1}$, $x_2 = ${r2}$.` };
  } },
  gvieta: { title: "Γεννήτρια — άθροισμα και γινόμενο λύσεων", make() {
    let a, b, c; do { a = [1, 1, 2, 3][ri(0, 3)]; b = ri(-9, 9); c = ri(-9, 9); } while (b * b - 4 * a * c <= 0 || c === 0);
    const S = fracS2(-b, a), Pp = fracS2(c, a);
    return { q: R`Αν $x_1, x_2$ είναι οι λύσεις της $${quadStr(a, b, c).replace(/x²/, "x^2").replace(/−/g, "-")} = 0$, χωρίς να τη λύσετε, να υπολογίσετε τα $S = x_1 + x_2$, $P = x_1x_2$ και $x_1^2 + x_2^2$.`,
      fields: [{ label: "S =", ans: S }, { label: "P =", ans: Pp }, { label: "x₁² + x₂² =", ans: fracS2(b * b - 2 * a * c, a * a) }],
      sol: R`$\Delta = ${b * b - 4 * a * c} > 0$. $S = -\frac{\beta}{\alpha} = ${texFrac(-b, a)}$, $P = \frac{\gamma}{\alpha} = ${texFrac(c, a)}$.<br>$x_1^2 + x_2^2 = S^2 - 2P = ${texFrac(b * b - 2 * a * c, a * a)}$.` };
  } },
  gineq: { title: "Γεννήτρια — ανισώσεις 2ου βαθμού", make() {
    let p, q; do { p = ri(-6, 6); q = ri(-6, 6); } while (p >= q);
    const a = ri(0, 1) ? 1 : -1, b = -a * (p + q), c = a * p * q, iq = ri(0, 3), sym = ["\\gt", "\\ge", "\\lt", "\\le"][iq];
    const strict = iq % 2 === 0, positive = iq < 2, outside = positive === (a > 0);
    const io = outside ? R`$x ${strict ? "<" : "\\le"} ${p}$ ή $x ${strict ? ">" : "\\ge"} ${q}$` : R`$${p} ${strict ? "<" : "\\le"} x ${strict ? "<" : "\\le"} ${q}$`;
    const wrong = [outside ? R`$${p} ${strict ? "<" : "\\le"} x ${strict ? "<" : "\\le"} ${q}$` : R`$x ${strict ? "<" : "\\le"} ${p}$ ή $x ${strict ? ">" : "\\ge"} ${q}$`,
      outside ? R`$x ${strict ? "\\le" : "<"} ${p}$ ή $x ${strict ? "\\ge" : ">"} ${q}$` : R`$${p} ${strict ? "\\le" : "<"} x ${strict ? "\\le" : "<"} ${q}$`, R`κάθε $x \in \mathbb{R}$`];
    const opts = shuffle([io, ...wrong]);
    return { type: "mc", q: R`Να λύσετε την ανίσωση $${quadStr(a, b, c).replace(/x²/, "x^2").replace(/−/g, "-")} ${sym} 0$.`, options: opts, correct: opts.indexOf(io),
      sol: R`Ρίζες του τριωνύμου: $${p}$ και $${q}$, $\alpha = ${a}$. Έξω από τις ρίζες το τριώνυμο έχει το πρόσημο του $\alpha$ (${a > 0 ? "θετικό" : "αρνητικό"}), ανάμεσα το αντίθετο. Θέλουμε ${positive ? "θετικές" : "αρνητικές"} τιμές${strict ? "" : " ή μηδέν"} ⇒ ${io}.` };
  } },
  gsim: { title: "Γεννήτρια — λόγος ομοιότητας", make() {
    const t = ri(0, 1), l = [2, 3, 1.5, 2.5, 4][ri(0, 4)], s = ri(2, 9);
    if (t === 0) { const per = s * 2 + 4; return { q: R`Δύο όμοια πολύγωνα έχουν λόγο ομοιότητας $\lambda = ${String(l).replace(".", "{,}")}$ (μεγάλο προς μικρό). Αν η περίμετρος του μικρού είναι $${per}$ cm, ποια είναι η περίμετρος του μεγάλου;`, fields: [{ label: "περίμετρος =", ans: l * per }], sol: R`Ο λόγος περιμέτρων ισούται με τον λόγο ομοιότητας: $${String(l).replace(".", "{,}")}\cdot ${per} = ${String(l * per).replace(".", "{,}")}$ cm.` }; }
    const E = s * 4; return { q: R`Δύο όμοια τρίγωνα έχουν λόγο ομοιότητας $\lambda = ${String(l).replace(".", "{,}")}$ (μεγάλο προς μικρό). Αν το εμβαδόν του μικρού είναι $${E}$ cm², ποιο είναι το εμβαδόν του μεγάλου;`, fields: [{ label: "εμβαδόν =", ans: l * l * E }], sol: R`Ο λόγος εμβαδών είναι $\lambda^2 = ${String(l * l).replace(".", "{,}")}$: $${String(l * l).replace(".", "{,}")}\cdot ${E} = ${String(l * l * E).replace(".", "{,}")}$ cm².` };
  } },
  gstat: { title: "Γεννήτρια — μέση τιμή, διάμεσος, διασπορά", make() {
    const n = ri(5, 8); let arr; do { arr = Array.from({ length: n }, () => ri(1, 12)); } while (!Number.isInteger(arr.reduce((u, v) => u + v, 0) / n));
    const S = statsOf(arr);
    return { q: R`Δίνονται οι παρατηρήσεις: <b>${arr.join(", ")}</b>. Να βρείτε τη μέση τιμή, τη διάμεσο, το εύρος και τη διακύμανση.`,
      fields: [{ label: "x̄ =", ans: S.mean }, { label: "διάμεσος =", ans: S.med }, { label: "εύρος =", ans: S.range }, { label: "s² =", ans: fracS2(arr.reduce((u, v) => u + (v - S.mean) ** 2, 0), n) }],
      sol: R`$\bar x = \frac{${arr.reduce((u, v) => u + v, 0)}}{${n}} = ${S.mean}$. Σε αύξουσα σειρά: ${S.d.join(", ")} ⇒ διάμεσος $${String(S.med).replace(".", "{,}")}$. Εύρος $${S.d[n - 1]} - ${S.d[0]} = ${S.range}$.<br>$s^2 = \frac{${arr.map(v => `(${v} - ${S.mean})^2`).join(" + ")}}{${n}} = \frac{${arr.reduce((u, v) => u + (v - S.mean) ** 2, 0)}}{${n}}${gcdI(arr.reduce((u, v) => u + (v - S.mean) ** 2, 0), n) > 1 ? " = " + texFrac(arr.reduce((u, v) => u + (v - S.mean) ** 2, 0), n) : ""}$.` };
  } }
});

/* ================= Widgets Α΄ Λυκείου Προσανατολισμού ================= */
const piStr = (num, den) => { /* num·π/den ως κείμενο */ const g = gcdI(num, den); num /= g; den /= g; if (num === 0) return "0"; const n = Math.abs(num) === 1 ? (num < 0 ? "−" : "") : (num < 0 ? "−" : "") + Math.abs(num); return den === 1 ? n + "π" : n + "π/" + den; };
const piTex = (num, den) => { const g = gcdI(num, den); num /= g; den /= g; if (num === 0) return "0"; const s = num < 0 ? "-" : "", a = Math.abs(num); return den === 1 ? `${s}${a === 1 ? "" : a}\\pi` : `${s}\\frac{${a === 1 ? "" : a}\\pi}{${den}}`; };
function quartHalves(arr) { const d = [...arr].sort((u, v) => u - v), n = d.length, med = a => a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2; const lo = d.slice(0, Math.floor(n / 2)), hi = d.slice(Math.ceil(n / 2)); return { d, q1: med(lo), q2: med(d), q3: med(hi), lo, hi }; }
const det2 = (a, b, c, d) => a * d - b * c;
const det3 = m => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
const sgnT = v => v < 0 ? `- ${Math.abs(v)}` : `+ ${v}`;
function lineTex(A, B, C, norm = true) { /* Ax + By + C = 0 */ if (norm) { const g = gcdI(gcdI(A, B), C) || 1; A /= g; B /= g; C /= g; if (A < 0 || (A === 0 && B < 0)) { A = -A; B = -B; C = -C; } } let s = ""; const t = (c, v, first) => { if (!c) return ""; const sign = c < 0 ? "-" : first ? "" : "+"; const a = Math.abs(c); return ` ${sign} ${a === 1 && v ? "" : a}${v}`; }; s = t(A, "x", true); s += t(B, "y", !s); s += t(C, "", !s); return (s.trim() || "0") + " = 0"; }

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 1.5 Διάταξη: πράξεις με διαστήματα ---------- */
  ineqrange(box) {
    box.innerHTML = `<div class="wctl"><label>x από <input type="number" class="a" value="3" step="1" style="width:4em"> έως <input type="number" class="b" value="4" step="1" style="width:4em"></label>
      <label>y από <input type="number" class="c" value="-5" step="1" style="width:4em"> έως <input type="number" class="d" value="-3" step="1" style="width:4em"></label></div><div class="wout"></div>`;
    function draw() {
      const [a, b, c, d] = ["a", "b", "c", "d"].map(k => +$("." + k, box).value);
      if (!(a < b && c < d)) { $(".wout", box).innerHTML = '<span class="warnc">Χρειάζεται α &lt; β σε κάθε διάστημα.</span>'; return; }
      const prods = [a * c, a * d, b * c, b * d], quot = (c > 0 || d < 0) ? [a / c, a / d, b / c, b / d] : null;
      const row = (n, lo, hi, how) => `<tr><td style="white-space:nowrap"><b>${n}</b></td><td>(${fmt(lo)}, ${fmt(hi)})</td><td class="muted">${how}</td></tr>`;
      $(".wout", box).innerHTML = `<table class="mini">${row("x + y", a + c, b + d, "προσθέτουμε κατά μέλη")}
        ${row("x − y", a - d, b - c, "−y ∈ (" + fmt(-d) + ", " + fmt(-c) + "), μετά πρόσθεση")}
        ${row("x · y", Math.min(...prods), Math.max(...prods), a > 0 && c > 0 ? "θετικοί: πολλαπλασιάζουμε κατά μέλη" : "με αρνητικούς: πρώτα αλλάζουμε πρόσημο, μετά πολλαπλασιάζουμε")}
        ${quot ? row("x / y", Math.min(...quot), Math.max(...quot), "1/y και μετά γινόμενο") : '<tr><td><b>x / y</b></td><td colspan="2" class="muted">το y μπορεί να γίνει 0 — δεν ορίζεται παντού</td></tr>'}</table>
        <span class="muted">Προσοχή: <b>δεν</b> αφαιρούμε ούτε διαιρούμε ανισότητες κατά μέλη! Για το x − y γράφουμε x + (−y).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 2.1 Ακτίνιο ---------- */
  radian(box) {
    box.innerHTML = `<div class="wctl"><label>γωνία θ <input type="range" class="rt" min="0" max="360" step="5" value="120"><b class="vt"></b></label>
      <label>ακτίνα R <input type="range" class="rr" min="1" max="5" step="0.5" value="2"><b class="vr"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const t = +$(".rt", box).value, R = +$(".rr", box).value; $(".vt", box).textContent = t + "°"; $(".vr", box).textContent = fmt(R);
      const th = gRad(t), P = gPlot($(".pl", box), 0, 0, 7, 340, false);
      gCircle(P, 0, 0, R, "stroke:var(--line);stroke-width:1.6;fill:none");
      let d = `M${P.sx(0)},${P.sy(0)}`; for (let i = 0; i <= 60; i++) { const a = th * i / 60; d += `L${P.sx(R * Math.cos(a)).toFixed(1)},${P.sy(R * Math.sin(a)).toFixed(1)}`; }
      P.layer.appendChild(svgEl("path", { d: d + "Z", style: "fill:var(--blue);fill-opacity:.12;stroke:none" }));
      let arc = ""; for (let i = 0; i <= 60; i++) { const a = th * i / 60; arc += (i ? "L" : "M") + P.sx(R * Math.cos(a)).toFixed(1) + "," + P.sy(R * Math.sin(a)).toFixed(1); }
      P.top.appendChild(svgEl("path", { d: arc, style: "fill:none;stroke:var(--red);stroke-width:4" }));
      gLine(P, 0, 0, R, 0, "stroke:var(--navy);stroke-width:2.4"); gLine(P, 0, 0, R * Math.cos(th), R * Math.sin(th), "stroke:var(--navy);stroke-width:2.4");
      gText(P, R / 2, -0.35, "R", "fill:var(--navy)");
      const g = gcdI(t, 180), rad = t / 180 * Math.PI;
      $(".wout", box).innerHTML = `θ = <b>${t}°</b> = <b>${piStr(t / g, 180 / g)}</b> rad ≈ ${fmt(rad)} rad &nbsp;·&nbsp; <span style="color:var(--red)">μήκος τόξου s = Rθ = <b>${fmt(R * rad)}</b></span> &nbsp;·&nbsp; <span style="color:var(--blue)">εμβαδόν τομέα E = ½R²θ = <b>${fmt(R * R * rad / 2)}</b></span>
        <br><span class="muted">1 rad: η γωνία που «βλέπει» τόξο ίσο με την ακτίνα (≈ 57,3°). Μετατροπή: θ(rad)/π = μ°/180°.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 2.5 Τριγωνομετρικές συναρτήσεις ---------- */
  trigfun(box) {
    box.innerHTML = `<div class="wctl"><label>συνάρτηση <select class="sf"><option value="0">ημ</option><option value="1">συν</option><option value="2">εφ</option></select></label>
      <label>α (πλάτος) <input type="range" class="ra" min="-3" max="3" step="0.5" value="1"><b class="va"></b></label>
      <label>κ (συχνότητα) <input type="range" class="rk" min="0.5" max="4" step="0.5" value="1"><b class="vk"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const f = +$(".sf", box).value; let a = +$(".ra", box).value; if (!a) { a = 0.5; $(".ra", box).value = a; } const k = +$(".rk", box).value;
      $(".va", box).textContent = fmt(a); $(".vk", box).textContent = fmt(k);
      const base = [Math.sin, Math.cos, Math.tan][f], g = x => a * base(k * x);
      const P = makePlot($(".pl", box), { xmin: -2 * Math.PI, xmax: 2 * Math.PI, ymin: -4, ymax: 4, H: 300, xstep: Math.PI / 2, ystep: 1 });
      P.svg.querySelectorAll(".tick").forEach(t => { if (t.getAttribute("text-anchor") !== "middle") return; const v = +t.textContent.replace(",", ".").replace("−", "-"); t.textContent = piStr(Math.round(v / (Math.PI / 2)), 2); });
      P.curve(x => base(x), "cfam");
      if (f === 2) { const T = Math.PI / k; for (let c = -6; c <= 6; c++) { const x = T / 2 + c * T; if (Math.abs(x) < 2 * Math.PI) P.seg(x, -5, x, 5, "asl"); P.curve(g, "c1", x - T + 1e-3, x - 1e-3); } }
      else P.curve(g, "c1");
      const k2 = Math.round(k * 2), Tt = f === 2 ? piStr(2, k2) : piStr(4, k2), nm = ["ημ", "συν", "εφ"][f];
      $(".wout", box).innerHTML = `y = <b>${a === 1 ? "" : a === -1 ? "−" : fmt(a)}${nm}(${k === 1 ? "" : fmt(k)}x)</b> &nbsp;·&nbsp; περίοδος T = ${f === 2 ? "π" : "2π"}/κ = <b>${Tt}</b>${f < 2 ? ` &nbsp;·&nbsp; μέγιστο <b>${fmt(Math.abs(a))}</b>, ελάχιστο <b>${fmt(-Math.abs(a))}</b>` : " &nbsp;·&nbsp; κατακόρυφες ασύμπτωτες (κόκκινες)"}
        <br><span class="muted">Γκρι: y = ${nm}x. Το α τεντώνει κατακόρυφα (και αναποδογυρίζει αν α &lt; 0), το κ «συμπιέζει» οριζόντια και αλλάζει την περίοδο.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 2.5 Αναγωγή σε όλα τα τεταρτημόρια ---------- */
  reduce2(box) {
    const forms = [["−θ", t => -t], ["90° − θ", t => 90 - t], ["90° + θ", t => 90 + t], ["180° − θ", t => 180 - t], ["180° + θ", t => 180 + t], ["270° − θ", t => 270 - t], ["270° + θ", t => 270 + t], ["360° − θ", t => 360 - t]];
    box.innerHTML = `<div class="wctl"><label>οξεία θ <input type="range" class="rt" min="5" max="85" step="1" value="30"><b class="vt"></b></label>
      <label>γωνία <select class="sm">${forms.map((f, i) => `<option value="${i}"${i === 4 ? " selected" : ""}>${f[0]}</option>`).join("")}</select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const t = +$(".rt", box).value, F = forms[+$(".sm", box).value], u = F[1](t); $(".vt", box).textContent = t + "°";
      const P = gPlot($(".pl", box), 0, 0, 1.9, 340, false); gCircle(P, 0, 0, 1);
      gLine(P, -1.3, 0, 1.3, 0, "stroke:var(--muted);stroke-width:1"); gLine(P, 0, -1.3, 0, 1.3, "stroke:var(--muted);stroke-width:1");
      const [c1, s1] = onDeg(t), [c2, s2] = onDeg(u);
      gLine(P, 0, 0, c1, s1, "stroke:var(--blue);stroke-width:2.6"); gLine(P, 0, 0, c2, s2, "stroke:var(--purple);stroke-width:2.6");
      gArc(P, 0, 0, 0, t, 0.25, "var(--blue)", "θ", 0.4); gArc(P, 0, 0, Math.min(0, u), Math.max(0, u), 0.5, "var(--purple)");
      P.dot(c1, s1, "d1", `(${fmt(c1)}, ${fmt(s1)})`, 8, -8); P.dot(c2, s2, "dinf", `(${fmt(c2)}, ${fmt(s2)})`, c2 < 0 ? -8 : 8, s2 < 0 ? 18 : -8);
      const swap = /90|270/.test(F[0]), sg = v => v < -1e-9 ? "−" : "", nm = swap ? ["συν", "ημ", "σφ"] : ["ημ", "συν", "εφ"];
      const sv = [Math.sin(gRad(u)), Math.cos(gRad(u)), Math.tan(gRad(u))];
      $(".wout", box).innerHTML = `γωνία ${F[0]} = <b>${u}°</b> (${gq(u) ? gq(u) + "ο τεταρτημόριο" : "σε άξονα"})<br>
        ημ(${F[0]}) = <b>${sg(sv[0])}${nm[0]}θ</b> = ${fmt(sv[0])} &nbsp;·&nbsp; συν(${F[0]}) = <b>${sg(sv[1])}${nm[1]}θ</b> = ${fmt(sv[1])} &nbsp;·&nbsp; εφ(${F[0]}) = <b>${sg(sv[2])}${nm[2]}θ</b> = ${fmt(sv[2])}
        <br><span class="muted">Κανόνας: με 180° ή 360° κρατάμε το ίδιο όνομα· με 90° ή 270° αλλάζουμε σε «συμπληρωματικό» (ημ↔συν, εφ↔σφ). Το πρόσημο το δίνει το τεταρτημόριο της αρχικής γωνίας.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 4.3 Διανύσματα με συντεταγμένες ---------- */
  veccoord(box) {
    box.innerHTML = `<div class="wctl"><label>A(x, y) <input type="number" class="ax" value="1" style="width:3.6em"> <input type="number" class="ay" value="-2" style="width:3.6em"></label>
      <label>B(x, y) <input type="number" class="bx" value="5" style="width:3.6em"> <input type="number" class="by" value="1" style="width:3.6em"></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const [ax, ay, bx, by] = ["ax", "ay", "bx", "by"].map(k => +$("." + k, box).value || 0);
      const P = gPlot($(".pl", box), 0, 0, 9, 360);
      gArrow(P, 0, 0, ax, ay, "var(--purple)", 2); gArrow(P, 0, 0, bx, by, "var(--purple)", 2);
      gArrow(P, ax, ay, bx, by, "var(--red)", 3.4);
      gArrow(P, 0, 0, 1, 0, "var(--green)", 3); gArrow(P, 0, 0, 0, 1, "var(--green)", 3);
      P.dot(ax, ay, "d2", "A", -14, 4); P.dot(bx, by, "d2", "B", 8, -6); P.dot((ax + bx) / 2, (ay + by) / 2, "dinf", "M", 8, 14);
      const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
      $(".wout", box).innerHTML = `<span style="color:var(--red)">AB = OB − OA = (${dx}, ${dy}) = ${dx}i ${dy < 0 ? "−" : "+"} ${Math.abs(dy)}j</span> &nbsp;·&nbsp; |AB| = √(${pw(dx)} + ${pw(dy)}) = <b>${sqrtForm(L2)}</b>${Number.isInteger(Math.sqrt(L2)) ? "" : " ≈ " + fmt(Math.sqrt(L2))}
        <br>Μέσο M = ((x₁ + x₂)/2, (y₁ + y₂)/2) = <b>(${fmt((ax + bx) / 2)}, ${fmt((ay + by) / 2)})</b> · ${dx ? `συντελεστής διεύθυνσης λ = ${fmt(dy)}/${fmt(dx)} = <b>${fracStr(dy, dx)}</b>` : "κατακόρυφο — δεν ορίζεται λ"}
        <br><span class="muted">Μωβ: διανυσματικές ακτίνες OA, OB. Πράσινα: τα μοναδιαία i, j.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 5.1 Ορίζουσες ---------- */
  det(box) {
    const def = [[2, 3, 5], [4, 1, 6], [7, 9, 2]];
    box.innerHTML = `<div class="wctl"><label>μέγεθος <select class="sz"><option value="2">2 × 2</option><option value="3" selected>3 × 3</option></select></label></div>
      <div class="dgrid" style="display:grid;gap:6px;max-width:260px;margin:8px 0"></div><div class="wout"></div>`;
    function setup() {
      const n = +$(".sz", box).value, g = $(".dgrid", box); g.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
      g.innerHTML = Array.from({ length: n * n }, (_, i) => `<input type="number" value="${def[Math.floor(i / n)][i % n]}" style="width:100%;text-align:center;font:inherit;padding:6px;border:1px solid var(--line);border-radius:8px">`).join("");
      g.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
    }
    function draw() {
      const n = +$(".sz", box).value, v = [...$(".dgrid", box).querySelectorAll("input")].map(i => +i.value || 0), m = Array.from({ length: n }, (_, r) => v.slice(r * n, r * n + n));
      if (n === 2) { $(".wout", box).innerHTML = `|A| = αδ − βγ = ${m[0][0]}·${pw(m[1][1]).replace("²", "")} − ${m[0][1]}·${pw(m[1][0]).replace("²", "")} = <b>${det2(m[0][0], m[0][1], m[1][0], m[1][1])}</b>`; return; }
      const D = det3(m), p = (a, b, c) => `${a}·${b < 0 ? "(" + b + ")" : b}·${c < 0 ? "(" + c + ")" : c}`;
      const plus = [m[0][0] * m[1][1] * m[2][2], m[0][1] * m[1][2] * m[2][0], m[0][2] * m[1][0] * m[2][1]], minus = [m[2][0] * m[1][1] * m[0][2], m[2][1] * m[1][2] * m[0][0], m[2][2] * m[1][0] * m[0][1]];
      $(".wout", box).innerHTML = `<b>Sarrus:</b> (${plus.join(" + ")}) − (${minus.join(" + ")}) = ${plus.reduce((a, b) => a + b, 0)} − ${minus.reduce((a, b) => a + b, 0)} = <b>${D}</b>
        <br><b>Κατά την 1η γραμμή:</b> ${m[0][0]}·(${det2(m[1][1], m[1][2], m[2][1], m[2][2])}) − ${m[0][1]}·(${det2(m[1][0], m[1][2], m[2][0], m[2][2])}) + ${m[0][2]}·(${det2(m[1][0], m[1][1], m[2][0], m[2][1])}) = <b>${D}</b>
        <br><span class="muted">Βάλε δύο ίσες γραμμές ή μια γραμμή με μηδενικά: η ορίζουσα μηδενίζεται.</span>`;
    }
    $(".sz", box).onchange = setup; setup();
  },

  /* ---------- 5.2 – 5.4 Ευθεία ---------- */
  linetool(box) {
    box.innerHTML = `<div class="wctl"><label>A <input type="number" class="ax" value="-1" style="width:3.4em"> <input type="number" class="ay" value="3" style="width:3.4em"></label>
      <label>B <input type="number" class="bx" value="3" style="width:3.4em"> <input type="number" class="by" value="-1" style="width:3.4em"></label>
      <label>Ρ <input type="number" class="px" value="3" style="width:3.4em"> <input type="number" class="py" value="4" style="width:3.4em"></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const [ax, ay, bx, by, px, py] = ["ax", "ay", "bx", "by", "px", "py"].map(k => +$("." + k, box).value || 0);
      if (ax === bx && ay === by) { $(".wout", box).innerHTML = '<span class="warnc">Τα A, B πρέπει να είναι διαφορετικά.</span>'; return; }
      let A = by - ay, B = ax - bx, C = -(A * ax + B * ay); { const g = gcdI(gcdI(A, B), C) || 1; A /= g; B /= g; C /= g; if (A < 0 || (A === 0 && B < 0)) { A = -A; B = -B; C = -C; } } const P = gPlot($(".pl", box), 0, 0, 9, 360);
      if (B !== 0) P.curve(x => (-A * x - C) / B, "c1"); else gLine(P, ax, -20, ax, 20, "stroke:var(--blue);stroke-width:3");
      const d = Math.abs(A * px + B * py + C) / Math.hypot(A, B), t = ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2), F = [ax + t * (bx - ax), ay + t * (by - ay)];
      gLine(P, px, py, F[0], F[1], "stroke:var(--red);stroke-width:2;stroke-dasharray:5 4");
      P.layer.appendChild(svgEl("polygon", { points: [[ax, ay], [bx, by], [px, py]].map(q => P.sx(q[0]) + "," + P.sy(q[1])).join(" "), style: "fill:var(--purple);fill-opacity:.12;stroke:none" }));
      P.dot(ax, ay, "d2", "A", -14, -6); P.dot(bx, by, "d2", "B", 8, -6); P.dot(px, py, "dmin", "Ρ", 8, -8);
      const lam = B !== 0 ? -A / B : null, ang = lam === null ? 90 : ((Math.atan(lam) * 180 / Math.PI) + 180) % 180;
      const area = Math.abs(det3([[ax, ay, 1], [bx, by, 1], [px, py, 1]])) / 2;
      $(".wout", box).innerHTML = `Ευθεία AB: <b>${lineTex(A, B, C).replace(/ - /g, " − ")}</b> · κλίση λ = ${lam === null ? "δεν ορίζεται (κατακόρυφη)" : "<b>" + fracStr(by - ay, bx - ax) + "</b>"} · γωνία με τον x′x ω ≈ <b>${fmt(ang)}°</b> (εφω = λ)
        <br><span style="color:var(--red)">Απόσταση d(Ρ, AB) = |Ax₀ + By₀ + Γ|/√(A² + B²) = |${A * px + B * py + C}|/√${A * A + B * B} ≈ <b>${fmt(d)}</b></span>
        <br><span style="color:var(--purple)">Εμβαδόν ΑΒΡ = ½·|ορίζουσα| = <b>${fmt(area)}</b></span> ${area === 0 ? "— τα σημεία είναι <b>συνευθειακά</b>!" : ""}`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 6.4 Δύναμη σημείου ---------- */
  power(box) {
    box.innerHTML = `<div class="wctl"><label>απόσταση δ του Σ από το κέντρο <input type="range" class="rd" min="0" max="3.5" step="0.05" value="2.4"><b class="vd"></b></label>
      <label>κλίση 1ης τέμνουσας <input type="range" class="r1" min="-80" max="80" step="1" value="12"></label>
      <label>κλίση 2ης τέμνουσας <input type="range" class="r2" min="-80" max="80" step="1" value="-20"></label></div><div class="pl"></div><div class="wout"></div>`;
    function hits(S, ang) { const u = [Math.cos(gRad(ang)), Math.sin(gRad(ang))], b = 2 * (S[0] * u[0] + S[1] * u[1]), c = S[0] ** 2 + S[1] ** 2 - 1, D = b * b - 4 * c; if (D < 0) return null; return [(-b - Math.sqrt(D)) / 2, (-b + Math.sqrt(D)) / 2].map(t => [S[0] + t * u[0], S[1] + t * u[1]]); }
    function draw() {
      const dd = +$(".rd", box).value, a1 = 180 + +$(".r1", box).value, a2 = 180 + +$(".r2", box).value; $(".vd", box).textContent = fmt(dd) + " (R = 1)";
      const S = [dd, 0], P = gPlot($(".pl", box), 0.9, 0, 3, 340, false); gCircle(P, 0, 0, 1);
      P.dot(0, 0, "d2", "K", -14, 4); P.dot(...S, "dmin", "Σ", 8, -8);
      const L = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]); let out = [];
      [[a1, "Α", "Β", "var(--blue)"], [a2, "Γ", "Δ", "var(--purple)"]].forEach(([ang, n1, n2, col]) => {
        const h = hits(S, ang); if (!h) { out.push(`η τέμνουσα ${n1}${n2} δεν τέμνει τον κύκλο`); return; }
        const far = [S[0] + 4 * Math.cos(gRad(ang)), S[1] + 4 * Math.sin(gRad(ang))]; gLine(P, S[0], S[1], dd >= 1 ? h[1][0] + (h[1][0] - S[0]) * 0.15 : far[0], dd >= 1 ? h[1][1] + (h[1][1] - S[1]) * 0.15 : far[1], `stroke:${col};stroke-width:2.2`);
        if (dd < 1) gLine(P, ...S, S[0] - 4 * Math.cos(gRad(ang)), S[1] - 4 * Math.sin(gRad(ang)), `stroke:${col};stroke-width:2.2`);
        P.dot(...h[0], "d1", n1, 6, -8); P.dot(...h[1], "d1", n2, 6, -8);
        out.push(`(Σ${n1})·(Σ${n2}) = ${fmt(L(S, h[0]))}·${fmt(L(S, h[1]))} = <b>${fmt(L(S, h[0]) * L(S, h[1]))}</b>`);
      });
      if (dd > 1) { const t = Math.sqrt(dd * dd - 1), T = [1 / dd, Math.sqrt(1 - 1 / (dd * dd))]; gLine(P, ...S, ...T, "stroke:var(--green);stroke-width:2.2"); P.dot(...T, "dmax", "Τ", 6, -8); out.push(`<span style="color:var(--green)">(ΣΤ)² = ${fmt(t)}² = <b>${fmt(t * t)}</b></span>`); }
      $(".wout", box).innerHTML = out.join(" &nbsp;·&nbsp; ") + `<br>|δ² − R²| = |${fmt(dd * dd)} − 1| = <b>${fmt(Math.abs(dd * dd - 1))}</b> — <b>${dd > 1 ? "Σ έξω από τον κύκλο" : dd < 1 ? "Σ μέσα στον κύκλο" : "Σ πάνω στον κύκλο"}</b>
        <br><span class="muted">Όπως κι αν στρίψεις τις τέμνουσες, το γινόμενο μένει σταθερό: είναι η «δύναμη» του σημείου Σ.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 7.4 Πρόσημο γινομένου / πηλίκου ---------- */
  signtab(box) {
    const ex = [
      { n: "(x − 2)(x² + 2x − 8)", f: x => (x - 2) * (x * x + 2 * x - 8), z: [-4, 2], p: [] },
      { n: "(x² + 2x)(x² − 25)", f: x => (x * x + 2 * x) * (x * x - 25), z: [-5, -2, 0, 5], p: [] },
      { n: "x² / (x − 3)", f: x => x * x / (x - 3), z: [0], p: [3] },
      { n: "(x² − x − 12) / (7 − x)", f: x => (x * x - x - 12) / (7 - x), z: [-3, 4], p: [7] },
      { n: "x / (x − 3)²", f: x => x / (x - 3) ** 2, z: [0], p: [3] }];
    box.innerHTML = `<div class="wctl"><label>παράσταση <select class="se">${ex.map((e, i) => `<option value="${i}">${e.n}</option>`).join("")}</select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const e = ex[+$(".se", box).value], pts = [...e.z, ...e.p].sort((u, v) => u - v), lo = Math.min(...pts) - 3, hi = Math.max(...pts) + 3;
      const P = makePlot($(".pl", box), { xmin: lo, xmax: hi, ymin: -12, ymax: 12, H: 280, xstep: 1, ystep: 4 });
      const cuts = [lo, ...pts, hi]; let signs = [];
      for (let i = 0; i < cuts.length - 1; i++) { const m = (cuts[i] + cuts[i + 1]) / 2, s = e.f(m) > 0; signs.push(s ? "+" : "−"); P.band(cuts[i], cuts[i + 1], s ? "pos" : "neg"); P.curve(e.f, "c1", cuts[i] + 1e-3, cuts[i + 1] - 1e-3); }
      e.p.forEach(x => P.seg(x, -20, x, 20, "asl")); e.z.forEach(x => P.dot(x, 0, "dinf", fmt(x), 5, 16));
      const head = ["−∞", ...pts.map(fmt), "+∞"], row = [];
      for (let i = 0; i < signs.length; i++) { row.push(signs[i]); if (i < pts.length) row.push(e.p.includes(pts[i]) ? "‖" : "0"); }
      $(".wout", box).innerHTML = `<table class="mini"><tr><th>x</th>${head.map((h, i) => `<th${i && i < head.length - 1 ? ' colspan="1"' : ""}>${h}</th>`).join("<th></th>")}</tr><tr><td>${e.n}</td><td></td>${row.map(s => `<td>${s}</td>`).join("")}<td></td></tr></table>
        <span class="muted">Ρίζες αριθμητή → 0, ρίζες παρονομαστή → ‖ (δεν ορίζεται, πάντα εξαιρούνται). Πράσινο: θετικό, κόκκινο: αρνητικό.</span>`;
    }
    $(".se", box).onchange = draw; draw();
  },

  /* ---------- 8.2 – 8.3 Θηκόγραμμα ---------- */
  boxplot(box) {
    box.innerHTML = `<div class="wctl"><label style="flex:1 1 100%">Δεδομένα <input type="text" class="td" value="30, 16, 18, 17, 16, 19, 2" style="width:100%"></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const arr = $(".td", box).value.replace(/(\d),(\d)/g, "$1.$2").split(/[\s;,]+/).filter(s => s !== "").map(Number).filter(isFinite);
      if (arr.length < 4) { $(".wout", box).innerHTML = '<span class="warnc">Γράψε τουλάχιστον τέσσερις αριθμούς.</span>'; return; }
      const Q = quartHalves(arr), iqr = Q.q3 - Q.q1, lf = Q.q1 - 1.5 * iqr, uf = Q.q3 + 1.5 * iqr, out = Q.d.filter(v => v < lf || v > uf), inl = Q.d.filter(v => v >= lf && v <= uf);
      const mn = Q.d[0], mx = Q.d[Q.d.length - 1], pad = Math.max(1, (mx - mn) * 0.1);
      const P = makePlot($(".pl", box), { xmin: mn - pad, xmax: mx + pad, ymin: -1, ymax: 3, H: 170, xstep: niceStep(mx - mn + 2 * pad), ystep: 10 });
      const y0 = 0.6, y1 = 2.0, ym = 1.3, wl = Math.min(...inl), wr = Math.max(...inl);
      P.layer.appendChild(svgEl("rect", { x: P.sx(Q.q1), y: P.sy(y1), width: P.sx(Q.q3) - P.sx(Q.q1), height: P.sy(y0) - P.sy(y1), style: "fill:var(--blue);fill-opacity:.15;stroke:var(--blue);stroke-width:2.4" }));
      P.seg(Q.q2, y0, Q.q2, y1, "c1line"); P.seg(wl, ym, Q.q1, ym, "c1line"); P.seg(Q.q3, ym, wr, ym, "c1line"); P.seg(wl, y0 + 0.3, wl, y1 - 0.3, "c1line"); P.seg(wr, y0 + 0.3, wr, y1 - 0.3, "c1line");
      out.forEach(v => P.dot(v, ym, "dmin", fmt(v), 4, -10));
      const stems = {}; Q.d.forEach(v => { if (!Number.isInteger(v) || v < 0) return; const s = Math.floor(v / 10); (stems[s] = stems[s] || []).push(v % 10); });
      const ks = Object.keys(stems).map(Number), sl = ks.length && Q.d.every(v => Number.isInteger(v) && v >= 0) ? `<br><b>Φυλλογράφημα</b> (κορμός = δεκάδες):<pre style="margin:4px 0 0;font-family:'IBM Plex Mono',monospace">${Array.from({ length: Math.max(...ks) - Math.min(...ks) + 1 }, (_, i) => Math.min(...ks) + i).map(s => `${String(s).padStart(2)} | ${(stems[s] || []).join(" ")}`).join("\n")}</pre>` : "";
      $(".wout", box).innerHTML = `Σε σειρά: ${Q.d.join(", ")}<br>Q₁ = <b>${fmt(Q.q1)}</b> · Q₂ = <b>${fmt(Q.q2)}</b> · Q₃ = <b>${fmt(Q.q3)}</b> · IQR = Q₃ − Q₁ = <b>${fmt(iqr)}</b>
        <br>Όρια ακραίων: Q₁ − 1,5·IQR = ${fmt(lf)}, Q₃ + 1,5·IQR = ${fmt(uf)} ⇒ ακραίες: <b>${out.length ? out.join(", ") : "καμία"}</b>${sl}`;
    }
    $(".td", box).oninput = draw; draw();
  }
});

/* ================= Γεννήτριες ================= */
var GENS = Object.assign(window.GENS || {}, {
  gdiat: { title: "Γεννήτρια — διαστήματα από ανισότητες", make() {
    const a = ri(1, 5), b = a + ri(1, 4), c = -ri(2, 7), d = Math.min(-1, c + ri(1, 3));
    return { q: R`Αν $${a} < x < ${b}$ και $${c} < y < ${d}$, να βρείτε το μικρότερο διάστημα στο οποίο ανήκει καθεμιά από τις παραστάσεις $x + y$, $x - y$ και $xy$.`,
      fields: [{ label: "x + y: από", ans: a + c }, { label: "έως", ans: b + d }, { label: "x − y: από", ans: a - d }, { label: "έως", ans: b - c }, { label: "xy: από", ans: b * c }, { label: "έως", ans: a * d }],
      sol: R`Πρόσθεση κατά μέλη: $${a + c} < x + y < ${b + d}$.<br>$${-d} < -y < ${-c}$, άρα $${a - d} < x - y < ${b - c}$.<br>Με $${-d} < -y < ${-c}$ (θετικοί) πολλαπλασιάζουμε κατά μέλη: $${a * -d} < -xy < ${b * -c}$ ⇒ $${b * c} < xy < ${a * d}$.` };
  } },
  grad: { title: "Γεννήτρια — μοίρες και ακτίνια", make() {
    const t = ri(0, 2), dens = [2, 3, 4, 6], den = dens[ri(0, 3)], num = ri(1, 2 * den - 1) * (ri(0, 4) ? 1 : -1), deg = num * 180 / den;
    if (t === 0) return { q: R`Να μετατρέψετε τη γωνία $${deg}^\circ$ σε ακτίνια.`, fields: [{ label: "θ (rad) =", ans: `${num}π/${den}` }], sol: R`$\theta = ${deg}\cdot\frac{\pi}{180} = ${piTex(num, den)}$ rad.` };
    if (t === 1) return { q: R`Να μετατρέψετε τη γωνία $${piTex(num, den)}$ rad σε μοίρες.`, fields: [{ label: "μ° =", ans: deg }], sol: R`$\mu = ${piTex(num, den)}\cdot\frac{180^\circ}{\pi} = ${deg}^\circ$.` };
    const R0 = ri(2, 12), n2 = Math.abs(num), s = n2 * R0;
    return { q: R`Σε κύκλο ακτίνας $R = ${R0}$ cm, να βρείτε το μήκος τόξου που αντιστοιχεί σε επίκεντρη γωνία $${piTex(n2, den)}$ rad.`, fields: [{ label: "s (cm) =", ans: `${s}π/${den}` }], sol: R`$s = R\theta = ${R0}\cdot ${piTex(n2, den)} = ${piTex(s, den)}$ cm $\approx ${String((s * Math.PI / den).toFixed(2)).replace(".", "{,}")}$ cm.` };
  } },
  gred: { title: "Γεννήτρια — αναγωγή σε οξεία γωνία", make() {
    const acute = [30, 45, 60][ri(0, 2)], kind = ri(0, 4), fn = ri(0, 2);
    const ang = [-acute, 180 + acute, 360 - acute, 90 + acute, 270 - acute][kind];
    const val = [Math.sin, Math.cos, Math.tan][fn](gRad(ang));
    const exact = { 1: "1", "-1": "-1", "0.5": "1/2", "-0.5": "-1/2" }; const near = v => { const c = [[0.5, "1/2"], [Math.SQRT2 / 2, "√2/2"], [Math.sqrt(3) / 2, "√3/2"], [1, "1"], [Math.sqrt(3), "√3"], [Math.sqrt(3) / 3, "√3/3"]]; for (const [x, s] of c) if (Math.abs(Math.abs(v) - x) < 1e-9) return (v < 0 ? "-" : "") + s; return String(v); };
    const nm = ["ημ", "συν", "εφ"][fn], nmT = ["\\text{ημ}", "\\text{συν}", "\\text{εφ}"][fn];
    const desc = ["-\\theta", "180^\\circ + \\theta", "360^\\circ - \\theta", "90^\\circ + \\theta", "270^\\circ - \\theta"][kind];
    return { q: R`Να υπολογίσετε χωρίς υπολογιστική μηχανή: $${nmT}(${ang}^\circ)$.`, fields: [{ label: `${nm}(${ang}°) =`, ans: near(val) }],
      sol: R`${kind ? R`$${ang}^\circ = ${desc.replace("\\theta", acute + "^\\circ")}$: ` : R`$${nmT}(-\theta) = ${fn === 1 ? "" : "-"}${nmT}\theta$: `}τελική πλευρά στο ${gq(ang) ? gq(ang) + "ο" : ""} τεταρτημόριο, όπου το ${nm} είναι ${val > 0 ? "θετικό" : "αρνητικό"}.${kind >= 3 ? " Με 90° ή 270° αλλάζει το όνομα (ημ↔συν, εφ↔σφ)." : ""} Άρα $${nmT}(${ang}^\circ) = ${near(val).replace(/√(\d)\/(\d)/, "\\frac{\\sqrt{$1}}{$2}").replace(/^(-?)1\/2$/, "$1\\frac12").replace(/√(\d)/, "\\sqrt{$1}")}$.` };
  } },
  gvec2: { title: "Γεννήτρια — διανύσματα με συντεταγμένες", make() {
    let ax, ay, bx, by; do { ax = ri(-6, 6); ay = ri(-6, 6); bx = ri(-6, 6); by = ri(-6, 6); } while (ax === bx && ay === by);
    const dx = bx - ax, dy = by - ay;
    return { q: R`Δίνονται τα σημεία $A(${ax}, ${ay})$ και $B(${bx}, ${by})$. Να βρείτε τις συντεταγμένες του $\vec{AB}$, το μέτρο του και το μέσο $M$ του $AB$.`,
      fields: [{ label: "AB: x =", ans: dx }, { label: "AB: y =", ans: dy }, { label: "|AB| =", ans: (Number.isInteger(Math.sqrt(dx * dx + dy * dy)) ? "" : "√") + (Number.isInteger(Math.sqrt(dx * dx + dy * dy)) ? Math.sqrt(dx * dx + dy * dy) : dx * dx + dy * dy) }, { label: "M: x =", ans: fracS2(ax + bx, 2) }, { label: "M: y =", ans: fracS2(ay + by, 2) }],
      sol: R`$\vec{AB} = (${bx} - (${ax}),\ ${by} - (${ay})) = (${dx}, ${dy})$. $|\vec{AB}| = \sqrt{${dx * dx} + ${dy * dy}} = ${sqrtForm(dx * dx + dy * dy).replace(/√(\d+)/, "\\sqrt{$1}")}$. $M\left(${texFrac(ax + bx, 2)}, ${texFrac(ay + by, 2)}\right)$.` };
  } },
  gdet: { title: "Γεννήτρια — ορίζουσες", make() {
    if (ri(0, 1)) { const m = [ri(-6, 9), ri(-6, 9), ri(-6, 9), ri(-6, 9)]; return { q: R`Να υπολογίσετε την ορίζουσα $\begin{vmatrix} ${m[0]} & ${m[1]} \\ ${m[2]} & ${m[3]} \end{vmatrix}$.`, fields: [{ label: "=", ans: det2(...m) }], sol: R`$${m[0]}\cdot${m[3] < 0 ? `(${m[3]})` : m[3]} - ${m[1] < 0 ? `(${m[1]})` : m[1]}\cdot${m[2] < 0 ? `(${m[2]})` : m[2]} = ${det2(...m)}$.` }; }
    const m = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => ri(-4, 6))), D = det3(m);
    return { q: R`Να υπολογίσετε την ορίζουσα $\begin{vmatrix} ${m.map(r => r.join(" & ")).join(" \\\\ ")} \end{vmatrix}$.`, fields: [{ label: "=", ans: D }],
      sol: R`Ανάπτυξη κατά την 1η γραμμή: $${m[0][0]}\cdot(${det2(m[1][1], m[1][2], m[2][1], m[2][2])}) - (${m[0][1]})\cdot(${det2(m[1][0], m[1][2], m[2][0], m[2][2])}) + (${m[0][2]})\cdot(${det2(m[1][0], m[1][1], m[2][0], m[2][1])}) = ${D}$.` };
  } },
  gline: { title: "Γεννήτρια — ευθεία, απόσταση, εμβαδόν", make() {
    const t = ri(0, 2);
    if (t === 0) { let x1, y1, x2, y2; do { x1 = ri(-5, 5); y1 = ri(-5, 5); x2 = ri(-5, 5); y2 = ri(-5, 5); } while (x1 === x2); const lam = fracS2(y2 - y1, x2 - x1), b = fracS2(y1 * (x2 - x1) - x1 * (y2 - y1), x2 - x1);
      return { q: R`Να βρείτε την εξίσωση της ευθείας που διέρχεται από τα σημεία $A(${x1}, ${y1})$ και $B(${x2}, ${y2})$, στη μορφή $y = \lambda x + \beta$.`, fields: [{ label: "λ =", ans: lam }, { label: "β =", ans: b }],
        sol: R`$\lambda = \frac{${y2} - (${y1})}{${x2} - (${x1})} = ${texFrac(y2 - y1, x2 - x1)}$. Από $y - (${y1}) = \lambda(x - (${x1}))$: $\beta = ${y1} - \lambda\cdot(${x1}) = ${texFrac(y1 * (x2 - x1) - x1 * (y2 - y1), x2 - x1)}$.` }; }
    if (t === 1) { const tr = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10]][ri(0, 3)], A = tr[0] * (ri(0, 1) ? 1 : -1), B = tr[1], C = ri(-12, 12), x0 = ri(-5, 5), y0 = ri(-5, 5), num = Math.abs(A * x0 + B * y0 + C);
      return { q: R`Να υπολογίσετε την απόσταση του σημείου $P(${x0}, ${y0})$ από την ευθεία $${lineTex(A, B, C, false)}$.`, fields: [{ label: "d =", ans: fracS2(num, tr[2]) }],
        sol: R`$d = \frac{|${A}\cdot(${x0}) + ${B}\cdot(${y0}) ${C < 0 ? "-" : "+"} ${Math.abs(C)}|}{\sqrt{${A * A} + ${B * B}}} = \frac{${num}}{${tr[2]}}${gcdI(num, tr[2]) > 1 || num % tr[2] === 0 ? " = " + texFrac(num, tr[2]) : ""}$.` }; }
    const p = Array.from({ length: 3 }, () => [ri(-5, 6), ri(-5, 6)]), D = det3(p.map(q => [q[0], q[1], 1]));
    if (D === 0) return this.make();
    return { q: R`Να υπολογίσετε το εμβαδόν του τριγώνου με κορυφές $A(${p[0].join(", ")})$, $B(${p[1].join(", ")})$, $\Gamma(${p[2].join(", ")})$.`, fields: [{ label: "E =", ans: fracS2(Math.abs(D), 2) }],
      sol: R`$E = \frac12\left|\begin{vmatrix} ${p.map(q => q.join(" & ") + " & 1").join(" \\\\ ")} \end{vmatrix}\right| = \frac12|${D}| = ${texFrac(Math.abs(D), 2)}$.` };
  } },
  gpow: { title: "Γεννήτρια — δύναμη σημείου", make() {
    const t = ri(0, 1);
    if (t === 0) { const a = ri(2, 6), b = a + ri(2, 8), dv = Array.from({ length: a * b }, (_, i) => i + 1).filter(v => (a * b) % v === 0 && v * v < a * b && v !== a), c = dv.length ? dv[ri(0, dv.length - 1)] : 1;
      return { q: R`Από σημείο $\Sigma$ έξω από κύκλο φέρνουμε δύο τέμνουσες $\Sigma AB$ και $\Sigma\Gamma\Delta$ με $\Sigma A = ${a}$, $\Sigma B = ${b}$ και $\Sigma\Gamma = ${c}$. Να βρείτε το $\Sigma\Delta$ και το εφαπτόμενο τμήμα $\Sigma T$.`,
        fields: [{ label: "ΣΔ =", ans: (a * b) / c }, { label: "ΣΤ =", ans: (Number.isInteger(Math.sqrt(a * b)) ? "" : "√") + (Number.isInteger(Math.sqrt(a * b)) ? Math.sqrt(a * b) : a * b) }],
        sol: R`$(\Sigma A)(\Sigma B) = (\Sigma\Gamma)(\Sigma\Delta) = (\Sigma T)^2$: $\;${a}\cdot${b} = ${c}\cdot\Sigma\Delta \Rightarrow \Sigma\Delta = ${(a * b) / c}$ και $(\Sigma T)^2 = ${a * b} \Rightarrow \Sigma T = ${sqrtForm(a * b).replace(/√(\d+)/, "\\sqrt{$1}")}$.` }; }
    const R0 = ri(3, 9), dd = R0 + ri(1, 6);
    return { q: R`Ένα σημείο $\Sigma$ απέχει $\delta = ${dd}$ από το κέντρο κύκλου ακτίνας $R = ${R0}$. Να υπολογίσετε τη δύναμη του σημείου, δηλαδή το γινόμενο $(\Sigma A)(\Sigma B)$ για οποιαδήποτε τέμνουσα $\Sigma AB$.`, fields: [{ label: "(ΣΑ)(ΣΒ) =", ans: dd * dd - R0 * R0 }],
      sol: R`Το $\Sigma$ είναι έξω από τον κύκλο ($\delta > R$): $(\Sigma A)(\Sigma B) = \delta^2 - R^2 = ${dd * dd} - ${R0 * R0} = ${dd * dd - R0 * R0}$.` };
  } },
  gquart2: { title: "Γεννήτρια — τεταρτημόρια, IQR, ακραίες τιμές", make() {
    const n = ri(7, 12), data = Array.from({ length: n }, () => ri(5, 40)); if (ri(0, 1)) data[ri(0, n - 1)] = ri(70, 95);
    const Q = quartHalves(data), iqr = Q.q3 - Q.q1, uf = Q.q3 + 1.5 * iqr;
    const S = v => String(v).replace(".", "{,}");
    return { q: R`Δεδομένα ($\nu = ${n}$): <b>${data.join(", ")}</b>. Να βρείτε τα $Q_1, Q_2, Q_3$, το ενδοτεταρτημοριακό εύρος και το άνω όριο $Q_3 + 1{,}5\cdot IQR$ για ακραίες τιμές.`,
      fields: [{ label: "Q₁ =", ans: Q.q1 }, { label: "Q₂ =", ans: Q.q2 }, { label: "Q₃ =", ans: Q.q3 }, { label: "IQR =", ans: iqr }, { label: "άνω όριο =", ans: uf }],
      sol: R`Σε σειρά: ${Q.d.join(", ")}. $Q_2 = ${S(Q.q2)}$. ${n % 2 ? "Περιττό πλήθος: αφαιρούμε τη διάμεσο. " : ""}Κάτω μισό ${Q.lo.join(", ")} ⇒ $Q_1 = ${S(Q.q1)}$. Άνω μισό ${Q.hi.join(", ")} ⇒ $Q_3 = ${S(Q.q3)}$.<br>$IQR = ${S(iqr)}$, $Q_3 + 1{,}5\cdot IQR = ${S(uf)}$${Q.d.filter(v => v > uf).length ? R` ⇒ ακραία τιμή: ${Q.d.filter(v => v > uf).join(", ")}` : " ⇒ καμία ακραία τιμή από πάνω"}.` };
  } }
});

/* ================= Widgets Β΄ Λυκείου Κοινού Κορμού ================= */
const bkNums = s => { const t = String(s).trim(); if (!t) return []; return t.replace(/(\d),(\d)/g, "$1.$2").split(/[\s;,]+/).map(Number).filter(v => isFinite(v)); };
const bkSin = d => Math.sin(gRad(d)), bkCos = d => Math.cos(gRad(d));
const bkDeg = v => Math.acos(Math.max(-1, Math.min(1, v))) * 180 / Math.PI;
const bkR2 = v => Math.round(v * 100) / 100;
const bkOpen = (P, x, y, col = "var(--blue)") => P.top.appendChild(svgEl("circle", { cx: P.sx(x), cy: P.sy(y), r: 5.5, style: `fill:var(--card);stroke:${col};stroke-width:2.4` }));
const bkFill = (P, x, y, col = "var(--blue)") => P.top.appendChild(svgEl("circle", { cx: P.sx(x), cy: P.sy(y), r: 5.5, style: `fill:${col}` }));
/* επίλυση τριγώνου: επιστρέφει λίστα λύσεων {a,b,c,A,B,C} ή μήνυμα λάθους */
function bkTri(mode, x, y, z) {
  const fin = t => { const R0 = t.a / (2 * bkSin(t.A)); t.R = R0; t.E = 0.5 * t.b * t.c * bkSin(t.A); return t; };
  if (!(x > 0 && y > 0 && z > 0)) return "Όλα τα δεδομένα πρέπει να είναι θετικοί αριθμοί.";
  if (mode === 0) { const B = x, C = y, a = z, A = 180 - B - C; if (A <= 0) return "Οι γωνίες Β̂ + Γ̂ πρέπει να είναι μικρότερες από 180°."; return [fin({ a, b: a * bkSin(B) / bkSin(A), c: a * bkSin(C) / bkSin(A), A, B, C })]; }
  if (mode === 1) { const b = x, c = y, A = z; if (A >= 180) return "Η γωνία Â πρέπει να είναι μικρότερη από 180°."; const a = Math.sqrt(b * b + c * c - 2 * b * c * bkCos(A)); const B = bkDeg((a * a + c * c - b * b) / (2 * a * c)); return [fin({ a, b, c, A, B, C: 180 - A - B })]; }
  if (mode === 2) { const a = x, b = y, c = z; if (a >= b + c || b >= a + c || c >= a + b) return "Δεν ισχύει η τριγωνική ανισότητα — δεν υπάρχει τρίγωνο."; const A = bkDeg((b * b + c * c - a * a) / (2 * b * c)), B = bkDeg((a * a + c * c - b * b) / (2 * a * c)); return [fin({ a, b, c, A, B, C: 180 - A - B })]; }
  const a = x, b = y, A = z; if (A >= 180) return "Η γωνία Â πρέπει να είναι μικρότερη από 180°.";
  const s = b * bkSin(A) / a; if (s > 1 + 1e-12) return `ημΒ = β·ημΑ/α = ${fmt(s)} > 1 — δεν υπάρχει τρίγωνο.`;
  const B1 = Math.asin(Math.min(1, s)) * 180 / Math.PI, out = [];
  for (const B of (Math.abs(B1 - 90) < 1e-9 ? [B1] : [B1, 180 - B1])) if (A + B < 180 - 1e-9) { const C = 180 - A - B; out.push(fin({ a, b, c: a * bkSin(C) / bkSin(A), A, B, C })); }
  return out.length ? out : "Καμία από τις τιμές της Β̂ δεν δίνει άθροισμα γωνιών μικρότερο από 180° — δεν υπάρχει τρίγωνο.";
}
function bkTriDraw(P0, t, faint) {
  const B = [0, 0], C = [t.a, 0], A = [t.c * bkCos(t.B), t.c * bkSin(t.B)];
  const st = faint ? "stroke:var(--muted);stroke-width:1.6;stroke-dasharray:6 5" : "stroke:var(--navy);stroke-width:2.6";
  gLine(P0, ...A, ...B, st); gLine(P0, ...B, ...C, st); gLine(P0, ...C, ...A, st);
  return { A, B, C };
}
function triW(box, defMode) {
  const modes = [["Δύο γωνίες + πλευρά (Β̂, Γ̂, α)", ["Β̂ (°)", "Γ̂ (°)", "α"], [45, 60, 5]], ["Δύο πλευρές + περιεχόμενη γωνία (β, γ, Â)", ["β", "γ", "Â (°)"], [4, 6, 60]], ["Τρεις πλευρές (α, β, γ)", ["α", "β", "γ"], [5, 6, 7]], ["Δύο πλευρές + μη περιεχόμενη γωνία (α, β, Â)", ["α", "β", "Â (°)"], [4, 5, 40]]];
  box.innerHTML = `<div class="wctl"><label>δίνονται <select class="sm">${modes.map((m, i) => `<option value="${i}"${i === defMode ? " selected" : ""}>${m[0]}</option>`).join("")}</select></label></div>
    <div class="wctl">${[0, 1, 2].map(i => `<label><span class="l${i}"></span> <input type="number" class="v${i}" step="any" min="0" style="width:5.5em"></label>`).join("")}</div><div class="pl"></div><div class="wout"></div>`;
  const setMode = () => { const m = modes[+$(".sm", box).value]; [0, 1, 2].forEach(i => { $(".l" + i, box).textContent = m[1][i]; $(".v" + i, box).value = m[2][i]; }); };
  function draw() {
    const mode = +$(".sm", box).value, v = [0, 1, 2].map(i => +$(".v" + i, box).value);
    const res = bkTri(mode, ...v);
    if (typeof res === "string") { $(".pl", box).innerHTML = ""; $(".wout", box).innerHTML = `<span class="warnc">${res}</span>`; return; }
    const pts = res.map(t => [[0, 0], [t.a, 0], [t.c * bkCos(t.B), t.c * bkSin(t.B)]]).flat();
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), w = Math.max(...xs) - Math.min(...xs), hgt = Math.max(...ys);
    const half = Math.max(w / 2, hgt * 560 / 330 / 2) * 1.3 + 0.2;
    const P = gPlot($(".pl", box), (Math.max(...xs) + Math.min(...xs)) / 2, hgt / 2, half, 330, false);
    if (res[1]) bkTriDraw(P, res[1], true);
    const V = bkTriDraw(P, res[0], false), t = res[0], off = half * 0.07;
    gText(P, V.A[0], V.A[1] + off, "Α", "fill:var(--navy)"); gText(P, V.B[0] - off, -off * 0.6, "Β", "fill:var(--navy)"); gText(P, V.C[0] + off, -off * 0.6, "Γ", "fill:var(--navy)");
    gText(P, t.a / 2, -off, "α", "fill:var(--blue)"); gText(P, (V.A[0] + V.C[0]) / 2 + off * 0.8, V.A[1] / 2 + off * 0.4, "β", "fill:var(--blue)"); gText(P, V.A[0] / 2 - off * 0.8, V.A[1] / 2 + off * 0.4, "γ", "fill:var(--blue)");
    const row = (s, k) => `<tr><td>${res.length > 1 ? (k + 1) + "η λύση" : "λύση"}</td><td>${fmt(s.a)}</td><td>${fmt(s.b)}</td><td>${fmt(s.c)}</td><td>${fmt(s.A)}°</td><td>${fmt(s.B)}°</td><td>${fmt(s.C)}°</td><td>${fmt(s.R)}</td><td>${fmt(s.E)}</td></tr>`;
    const how = ["Â = 180° − Β̂ − Γ̂, μετά <b>νόμος ημιτόνων</b> α/ημΑ = β/ημΒ = γ/ημΓ = 2R.", "<b>Νόμος συνημιτόνων</b> α² = β² + γ² − 2βγ·συνΑ, μετά συνΒ = (α² + γ² − β²)/(2αγ).", "<b>Νόμος συνημιτόνων</b> για κάθε γωνία: συνΑ = (β² + γ² − α²)/(2βγ) κ.λπ.", "<b>Νόμος ημιτόνων</b>: ημΒ = β·ημΑ/α — προσοχή, η εξίσωση ημΒ = κ δίνει δύο γωνίες (Β και 180° − Β)! Κρατάμε όσες δίνουν Â + Β̂ &lt; 180°."][mode];
    $(".wout", box).innerHTML = `<table class="mini"><tr><th></th><th>α</th><th>β</th><th>γ</th><th>Â</th><th>Β̂</th><th>Γ̂</th><th>R</th><th>Ε</th></tr>${res.map(row).join("")}</table>
      <span class="muted">${how} Εμβαδόν: Ε = ½βγ·ημΑ.${res.length > 1 ? " Η διακεκομμένη γραμμή δείχνει τη 2η λύση." : ""}</span>`;
  }
  $(".sm", box).onchange = () => { setMode(); draw(); };
  box.querySelectorAll("input").forEach(i => i.oninput = draw); setMode(); draw();
}
/* ακολουθίες */
function seqW(box, defMode) {
  box.innerHTML = `<div class="wctl"><label>είδος <select class="sm"><option value="0">με γενικό τύπο</option><option value="1">αριθμητική πρόοδος</option><option value="2">γεωμετρική πρόοδος</option></select></label>
    <label class="lf"><span>α<sub>ν</sub> =</span> <input type="text" class="tf" value="(-1)^ν·10/ν" style="width:10em"></label></div>
    <div class="wctl"><label class="la">α₁ <input type="range" class="ra" min="-10" max="10" step="1" value="2"><b class="va"></b></label>
    <label class="ld">διαφορά δ <input type="range" class="rd" min="-4" max="4" step="0.5" value="1.5"><b class="vd"></b></label>
    <label class="ll">λόγος λ <input type="range" class="rl" min="-2" max="2" step="0.1" value="0.5"><b class="vl"></b></label></div><div class="pl"></div><div class="wout"></div>`;
  $(".sm", box).value = defMode;
  function draw() {
    const m = +$(".sm", box).value, d = +$(".rd", box).value; let a1 = +$(".ra", box).value; if (m === 2 && a1 === 0) { a1 = 1; $(".ra", box).value = 1; } let l = +$(".rl", box).value; if (Math.abs(l) < 1e-9) { l = 0.1; $(".rl", box).value = l; }
    $(".va", box).textContent = a1; $(".vd", box).textContent = fmt(d); $(".vl", box).textContent = fmt(l);
    $(".lf", box).style.display = m === 0 ? "" : "none"; $(".ld", box).style.display = m === 1 ? "" : "none"; $(".ll", box).style.display = m === 2 ? "" : "none"; $(".la", box).style.display = m === 0 ? "none" : "";
    const N = 10; let f, err = "";
    if (m === 0) { try { const g = MathParse.parse($(".tf", box).value.replace(/[νn]/g, "x")); f = v => g(v); } catch (e) { err = e.message; f = () => NaN; } }
    else if (m === 1) f = v => a1 + (v - 1) * d; else f = v => a1 * Math.pow(l, v - 1);
    const terms = []; for (let v = 1; v <= N; v++) terms.push(f(v));
    if (err || terms.some(t => !isFinite(t))) { $(".pl", box).innerHTML = ""; $(".wout", box).innerHTML = `<span class="warnc">Ο τύπος δεν δίνει πραγματικούς όρους για ν = 1, …, ${N}${err ? " (" + err + ")" : ""}.</span>`; return; }
    let lo = Math.min(0, ...terms), hi = Math.max(0, ...terms); if (hi - lo < 1) { hi += 1; lo -= 1; } const pad = (hi - lo) * 0.12;
    const P = makePlot($(".pl", box), { xmin: -0.3, xmax: N + 0.7, ymin: lo - pad, ymax: hi + pad, H: 280, xstep: 1, ystep: niceStep(hi - lo) });
    terms.forEach((t, i) => { P.seg(i + 1, 0, i + 1, t, "guide"); P.dot(i + 1, t, "d1"); });
    const S = terms.reduce((u, v) => u + v, 0), list = terms.slice(0, 6).map(fmt).join(", ") + ", …";
    let txt = `Όροι: <b>${list}</b><br>`;
    if (m === 0) txt += `Η ακολουθία είναι συνάρτηση με πεδίο ορισμού το ℕ: σε κάθε θέση ν αντιστοιχεί ο όρος α<sub>ν</sub>. Γράφημα: μόνο μεμονωμένα σημεία (ν, α<sub>ν</sub>).`;
    else if (m === 1) txt += `α<sub>ν+1</sub> = α<sub>ν</sub> + ${fmt(d)} &nbsp;·&nbsp; α<sub>ν</sub> = α₁ + (ν − 1)δ = <b>${a1} + (ν − 1)·${fmt(d)}</b> &nbsp;·&nbsp; Σ<sub>${N}</sub> = ${N}/2·(α₁ + α<sub>${N}</sub>) = <b>${fmt(S)}</b><br><span class="muted">Τα σημεία είναι πάνω σε ευθεία — η αριθμητική πρόοδος «μεγαλώνει» κατά σταθερό βήμα δ.</span>`;
    else txt += `α<sub>ν+1</sub> = α<sub>ν</sub>·${fmt(l)} &nbsp;·&nbsp; α<sub>ν</sub> = α₁·λ<sup>ν−1</sup> = <b>${a1}·(${fmt(l)})<sup>ν−1</sup></b> &nbsp;·&nbsp; Σ<sub>${N}</sub> = α₁(λ<sup>${N}</sup> − 1)/(λ − 1) = <b>${fmt(Math.abs(l - 1) < 1e-9 ? N * a1 : S)}</b>
      <br>${Math.abs(l) < 1 ? `|λ| &lt; 1: οι όροι πλησιάζουν το 0 και το άθροισμα των άπειρων όρων είναι <b>Σ<sub>∞</sub> = α₁/(1 − λ) = ${fmt(a1 / (1 - l))}</b>.` : `|λ| ≥ 1: δεν ορίζεται άθροισμα άπειρων όρων.`}`;
    $(".wout", box).innerHTML = txt;
  }
  box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
}

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 1.2–1.4 Επίλυση τριγώνου ---------- */
  trisin(box) { triW(box, 0); },
  tricos(box) { triW(box, 2); },
  triarea(box) { triW(box, 1); },

  /* ---------- 2.2 Τιμές συνάρτησης ---------- */
  funval(box) {
    box.innerHTML = `<div class="wctl"><label>f(x) = <input type="text" class="tf" value="x^2 - 2x - 3" style="width:11em"></label>
      <label>x₀ <input type="range" class="rx" min="-4" max="4" step="0.5" value="2"><b class="vx"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const x0 = +$(".rx", box).value; $(".vx", box).textContent = fmt(x0); let f;
      try { f = MathParse.parse($(".tf", box).value); } catch (e) { $(".wout", box).innerHTML = `<span class="warnc">⚠ ${e.message}</span>`; return; }
      let [lo, hi] = fitY(f, -5, 5, 0.15, [0]); lo = Math.max(lo, -12); hi = Math.min(hi, 12); if (hi - lo < 2) { lo -= 1; hi += 1; }
      const P = makePlot($(".pl", box), { xmin: -5, xmax: 5, ymin: lo, ymax: hi, H: 290 }); P.curve(f, "c1");
      const y0 = f(x0), ok = isFinite(y0);
      if (ok) { P.seg(x0, 0, x0, y0, "guide"); P.seg(0, y0, x0, y0, "guide"); P.dot(x0, y0, "d2", `(${fmt(x0)}, ${fmt(y0)})`, x0 > 2 ? -8 : 8); }
      const tb = [-2, -1, 0, 1, 2].map(v => `<td>${isFinite(f(v)) ? fmt(f(v)) : "—"}</td>`).join("");
      $(".wout", box).innerHTML = `${ok ? `f(${fmt(x0)}) = <b>${fmt(y0)}</b> — το σημείο (${fmt(x0)}, ${fmt(y0)}) ανήκει στη γραφική παράσταση.` : `Η f <b>δεν ορίζεται</b> στο x₀ = ${fmt(x0)}: το x₀ δεν ανήκει στο πεδίο ορισμού.`}
        <table class="mini"><tr><th>x</th><td>−2</td><td>−1</td><td>0</td><td>1</td><td>2</td></tr><tr><th>f(x)</th>${tb}</tr></table>
        <span class="muted">Γράψε δικό σου τύπο: π.χ. <code>√(x+3)</code>, <code>1/(x-1)</code>, <code>2^x</code>. Κάθε x του πεδίου ορισμού αντιστοιχεί σε <b>ένα</b> f(x).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 2.3 Κριτήριο κατακόρυφης ευθείας ---------- */
  vline(box) {
    const C = [
      { n: "y = x² − 2", fn: true, ys: c => [c * c - 2], draw: P => P.curve(x => x * x - 2, "c1") },
      { n: "x = y² − 2", fn: false, ys: c => c > -2 ? [Math.sqrt(c + 2), -Math.sqrt(c + 2)] : c === -2 ? [0] : [], draw: P => { P.curve(x => Math.sqrt(x + 2), "c1", -2, 6); P.curve(x => -Math.sqrt(x + 2), "c1", -2, 6); } },
      { n: "x² + y² = 9 (κύκλος)", fn: false, ys: c => Math.abs(c) < 3 ? [Math.sqrt(9 - c * c), -Math.sqrt(9 - c * c)] : Math.abs(c) === 3 ? [0] : [], draw: P => gCircle(P, 0, 0, 3) },
      { n: "y = x³ − 3x", fn: true, ys: c => [c ** 3 - 3 * c], draw: P => P.curve(x => x ** 3 - 3 * x, "c1") },
      { n: "y = √(x + 4)", fn: true, ys: c => c >= -4 ? [Math.sqrt(c + 4)] : [], draw: P => P.curve(x => Math.sqrt(x + 4), "c1", -4, 6) },
      { n: "|y| = x", fn: false, ys: c => c > 0 ? [c, -c] : c === 0 ? [0] : [], draw: P => { P.curve(x => x, "c1", 0, 6); P.curve(x => -x, "c1", 0, 6); } }
    ];
    box.innerHTML = `<div class="wctl"><label>σχέση <select class="sc">${C.map((c, i) => `<option value="${i}">${c.n}</option>`).join("")}</select></label>
      <label>κατακόρυφη ευθεία x = c <input type="range" class="rc" min="-5" max="5" step="0.5" value="1"><b class="vc"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const k = C[+$(".sc", box).value], c = +$(".rc", box).value; $(".vc", box).textContent = fmt(c);
      const P = gPlot($(".pl", box), 0, 0, 6, 330); k.draw(P); P.seg(c, -10, c, 10, "asl");
      const ys = k.ys(c); ys.forEach(y => P.dot(c, y, "d2"));
      $(".wout", box).innerHTML = `Η ευθεία x = ${fmt(c)} έχει <b>${ys.length}</b> κοινό${ys.length === 1 ? "" : "ά"} σημεί${ys.length === 1 ? "ο" : "α"} με τη γραμμή.<br>
        ${k.fn ? `<span class="okc">Κάθε κατακόρυφη ευθεία τέμνει τη γραμμή σε <b>το πολύ ένα</b> σημείο ⇒ είναι γραφική παράσταση συνάρτησης.</span>` : `<span class="badc">Υπάρχουν κατακόρυφες ευθείες με <b>δύο</b> κοινά σημεία (σε ένα x αντιστοιχούν δύο y) ⇒ <b>δεν</b> είναι γραφική παράσταση συνάρτησης.</span>`}`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 2.4 Πεδίο ορισμού ---------- */
  domain(box) {
    const F = [
      ["1/(x − α)", a => x => 1 / (x - a), a => `ℝ − {${fmt(a)}}`, a => "ℝ − {0}", "Παρονομαστής ≠ 0"],
      ["√(x − α)", a => x => Math.sqrt(x - a), a => `[${fmt(a)}, +∞)`, a => "[0, +∞)", "Υπόρριζο ≥ 0"],
      ["√(α − x)", a => x => Math.sqrt(a - x), a => `(−∞, ${fmt(a)}]`, a => "[0, +∞)", "Υπόρριζο ≥ 0"],
      ["√(x² − α²)", a => x => Math.sqrt(x * x - a * a), a => a === 0 ? "ℝ" : `(−∞, ${fmt(-Math.abs(a))}] ∪ [${fmt(Math.abs(a))}, +∞)`, a => "[0, +∞)", "Υπόρριζο ≥ 0: x² ≥ α²"],
      ["1/(x² − α²)", a => x => 1 / (x * x - a * a), a => a === 0 ? "ℝ − {0}" : `ℝ − {${fmt(-Math.abs(a))}, ${fmt(Math.abs(a))}}`, a => a === 0 ? "(0, +∞)" : `(−∞, ${fmt(-1 / (a * a))}] ∪ (0, +∞)`, "Παρονομαστής ≠ 0: x ≠ ±α"],
      ["1/√(x − α)", a => x => 1 / Math.sqrt(x - a), a => `(${fmt(a)}, +∞)`, a => "(0, +∞)", "Υπόρριζο ≥ 0 και παρονομαστής ≠ 0: x − α > 0"]
    ];
    box.innerHTML = `<div class="wctl"><label>f(x) = <select class="sf">${F.map((f, i) => `<option value="${i}">${f[0]}</option>`).join("")}</select></label>
      <label>α <input type="range" class="ra" min="-3" max="3" step="0.5" value="1"><b class="va"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const k = F[+$(".sf", box).value], a = +$(".ra", box).value; $(".va", box).textContent = fmt(a);
      const f = k[1](a), P = makePlot($(".pl", box), { xmin: -6, xmax: 6, ymin: -4, ymax: 4, H: 300 });
      const n = 600; let st = null;
      for (let i = 0; i <= n; i++) { const x = -6 + 12 * i / n, ok = isFinite(f(x)); if (ok && st === null) st = x; if ((!ok || i === n) && st !== null) { P.band(st, ok ? x : x - 12 / n, "bandok"); st = null; } }
      if (+$(".sf", box).value === 0 || +$(".sf", box).value === 4) { const poles = +$(".sf", box).value === 0 ? [a] : (a ? [a, -a] : [0]); poles.forEach(p => { P.seg(p, -5, p, 5, "asl"); P.curve(f, "c1", -6, p - 1e-3); }); const ps = [...new Set(poles)].sort((u, v) => u - v); let prev = -6; ps.forEach(p => { P.curve(f, "c1", prev + 1e-3, p - 1e-3); prev = p; }); P.curve(f, "c1", prev + 1e-3, 6); }
      else P.curve(f, "c1");
      $(".wout", box).innerHTML = `Περιορισμός: <b>${k[4]}</b><br>Πεδίο ορισμού: <b>A = ${k[2](a)}</b> &nbsp;·&nbsp; σύνολο τιμών: <b>f(A) = ${k[3](a)}</b>
        <br><span class="muted">Η πράσινη λωρίδα δείχνει το πεδίο ορισμού πάνω στον άξονα x'x· το σύνολο τιμών το «διαβάζουμε» στον άξονα y'y.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 2.6 Πράξεις συναρτήσεων ---------- */
  funops(box) {
    box.innerHTML = `<div class="wctl"><label>f(x) = <input type="text" class="tf" value="x^2" style="width:8em"></label><label>g(x) = <input type="text" class="tg" value="x - 1" style="width:8em"></label>
      <label>πράξη <select class="so"><option value="0">f + g</option><option value="1">f − g</option><option value="2">f · g</option><option value="3">f / g</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      let f, g; try { f = MathParse.parse($(".tf", box).value); g = MathParse.parse($(".tg", box).value); } catch (e) { $(".wout", box).innerHTML = `<span class="warnc">⚠ ${e.message}</span>`; return; }
      const o = +$(".so", box).value, h2 = [x => f(x) + g(x), x => f(x) - g(x), x => f(x) * g(x), x => Math.abs(g(x)) < 1e-9 ? NaN : f(x) / g(x)][o];
      const P = makePlot($(".pl", box), { xmin: -5, xmax: 5, ymin: -6, ymax: 6, H: 300 });
      P.curve(f, "cfam"); P.curve(g, "c2"); P.curve(h2, "c1");
      const sym = ["+", "−", "·", "/"][o], fs = $(".tf", box).value, gs = $(".tg", box).value;
      $(".wout", box).innerHTML = `<span style="color:var(--blue)"><b>(f ${sym} g)(x) = ${o === 3 ? `(${fs}) / (${gs})` : `(${fs}) ${sym} (${gs})`}</b></span> &nbsp;·&nbsp; <span class="muted">γκρι: f, μωβ: g</span>
        <br>Πεδίο ορισμού: <b>A ∩ B</b>${o === 3 ? " <b>χωρίς</b> τα x για τα οποία g(x) = 0" : ""} — ορίζεται μόνο όπου ορίζονται <b>και οι δύο</b> συναρτήσεις.
        <br><span class="muted">Δοκίμασε f(x) = √x και g(x) = √(1 − x): το f + g ορίζεται μόνο στο [0, 1].</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 2.7 Κριτήριο οριζόντιας ευθείας ---------- */
  hline(box) {
    const F = [["y = 2x − 1", x => 2 * x - 1, true], ["y = x²", x => x * x, false], ["y = x³", x => x ** 3, true], ["y = 1/x", x => 1 / x, true], ["y = x³ − 3x", x => x ** 3 - 3 * x, false], ["y = √x", x => Math.sqrt(x), true], ["y = ημx", x => Math.sin(x), false]];
    box.innerHTML = `<div class="wctl"><label>συνάρτηση <select class="sf">${F.map((f, i) => `<option value="${i}">${f[0]}</option>`).join("")}</select></label>
      <label>οριζόντια ευθεία y = c <input type="range" class="rc" min="-4" max="4" step="0.25" value="1"><b class="vc"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const k = F[+$(".sf", box).value], f = k[1], c = +$(".rc", box).value; $(".vc", box).textContent = fmt(c);
      const P = makePlot($(".pl", box), { xmin: -5, xmax: 5, ymin: -5, ymax: 5, H: 300 });
      if (k[0].includes("1/x")) { P.curve(f, "c1", -5, -1e-3); P.curve(f, "c1", 1e-3, 5); } else P.curve(f, "c1");
      P.seg(-5, c, 5, c, "asl");
      const xs = [], n = 4000; let px = -5, pv = f(px) - c;
      for (let i = 1; i <= n; i++) { const x = -5 + 10 * i / n, v = f(x) - c; if (Math.abs(v) < 1e-12) { xs.push(x); } else if (isFinite(v) && isFinite(pv) && pv * v < 0 && Math.abs(pv - v) < 5 && Math.abs(pv) > 1e-12) { const t = pv / (pv - v); xs.push(px + t * (x - px)); } px = x; pv = v; }
      for (let i = 1; i < n; i++) { const x = -5 + 10 * i / n, g = t => Math.abs(f(t) - c), v = g(x); if (isFinite(v) && v < 2e-3 && v <= g(x - 10 / n) && v <= g(x + 10 / n) && !xs.some(z => Math.abs(z - x) < 0.02)) xs.push(x); }
      xs.sort((u, v) => u - v);
      const sol = xs.filter((x, i) => i === 0 || x - xs[i - 1] > 1e-3);
      sol.forEach(x => P.dot(x, c, "d2"));
      $(".wout", box).innerHTML = `Στο διάστημα [−5, 5] η ευθεία y = ${fmt(c)} έχει <b>${sol.length}</b> κοινό${sol.length === 1 ? "" : "ά"} σημεί${sol.length === 1 ? "ο" : "α"} με τη γραφική παράσταση.<br>
        ${k[2] ? `<span class="okc">Κάθε οριζόντια ευθεία τέμνει τη γραφική παράσταση σε <b>το πολύ ένα</b> σημείο ⇒ η συνάρτηση είναι <b>1–1</b>.</span>` : `<span class="badc">Υπάρχουν οριζόντιες ευθείες με δύο ή περισσότερα κοινά σημεία (διαφορετικά x με ίδιο y) ⇒ <b>δεν</b> είναι 1–1.</span>`}`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 3.3 Εκθετική συνάρτηση ---------- */
  expfun(box) {
    box.innerHTML = `<div class="wctl"><label>βάση α <input type="range" class="ra" min="0.1" max="4" step="0.1" value="2"><b class="va"></b></label>
      <label><input type="checkbox" class="cb" checked> δείξε και την y = (1/α)ˣ</label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      let a = +$(".ra", box).value; if (Math.abs(a - 1) < 1e-9) { a = 1.1; $(".ra", box).value = a; } $(".va", box).textContent = fmt(a);
      const P = makePlot($(".pl", box), { xmin: -4, xmax: 4, ymin: -1, ymax: 8, H: 300 });
      if ($(".cb", box).checked) P.curve(x => Math.pow(1 / a, x), "cfam");
      P.curve(x => Math.pow(a, x), "c1"); P.dot(0, 1, "d2", "(0, 1)", 8, -8); if (a ** 1 < 8) P.dot(1, a, "d1", `(1, ${fmt(a)})`, 8, 14);
      $(".wout", box).innerHTML = `f(x) = <b>${fmt(a)}<sup>x</sup></b> — ${a > 1 ? "<b>γνησίως αύξουσα</b> (α &gt; 1)" : "<b>γνησίως φθίνουσα</b> (0 &lt; α &lt; 1)"} &nbsp;·&nbsp; πεδίο ορισμού ℝ, σύνολο τιμών <b>(0, +∞)</b>
        <br><span class="muted">Περνά πάντα από το (0, 1) γιατί α⁰ = 1. Ο άξονας x'x είναι ασύμπτωτη: η γραφική παράσταση πλησιάζει το y = 0 χωρίς να το αγγίζει. Η y = (1/α)ˣ = α<sup>−x</sup> (γκρι) είναι συμμετρική ως προς τον y'y.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 3.5 Ανατοκισμός – εκθετική μεταβολή ---------- */
  growth(box) {
    box.innerHTML = `<div class="wctl"><label>K₀ <input type="range" class="rk" min="500" max="20000" step="500" value="1000"><b class="vk"></b></label>
      <label>ε (% ανά έτος) <input type="range" class="re" min="-30" max="30" step="0.5" value="3"><b class="ve"></b></label>
      <label>t (έτη) <input type="range" class="rt" min="0" max="30" step="1" value="10"><b class="vt"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const K0 = +$(".rk", box).value, e = +$(".re", box).value / 100, t = +$(".rt", box).value; $(".vk", box).textContent = K0; $(".ve", box).textContent = fmt(e * 100) + "%"; $(".vt", box).textContent = t;
      const K = x => K0 * Math.pow(1 + e, x), top = Math.max(K0, K(30)) * 1.12;
      const P = makePlot($(".pl", box), { xmin: -1, xmax: 31, ymin: -top * 0.06, ymax: top, H: 280, xstep: 5, ystep: niceStep(top * 2.5) });
      P.curve(K, "c1", 0, 30); P.seg(t, 0, t, K(t), "guide"); P.dot(t, K(t), "d2", `K(${t}) ≈ ${fmt(K(t))}`, t > 20 ? -8 : 8);
      const T = e === 0 ? null : Math.log(2) / Math.abs(Math.log(1 + e));
      $(".wout", box).innerHTML = `K<sub>t</sub> = K₀(1 + ε)<sup>t</sup> = ${K0}·${fmt(1 + e)}<sup>${t}</sup> ≈ <b>${fmt(K(t))}</b>
        <br>${e > 0 ? `Διπλασιασμός όταν (1 + ε)<sup>t</sup> = 2 ⇔ t = log 2 / log(1 + ε) ≈ <b>${fmt(T)}</b> έτη.` : e < 0 ? `Υποδιπλασιασμός (μισή τιμή) όταν (1 + ε)<sup>t</sup> = 1/2 ⇔ t ≈ <b>${fmt(T)}</b> έτη.` : "Με ε = 0 το ποσό μένει σταθερό."}
        <br><span class="muted">Για ε &gt; 0 εκθετική αύξηση (βάση 1 + ε &gt; 1), για ε &lt; 0 εκθετική μείωση (βάση &lt; 1).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 3.6–3.8 Λογαριθμική συνάρτηση ---------- */
  logfun(box) {
    box.innerHTML = `<div class="wctl"><label>βάση α <input type="range" class="ra" min="0.2" max="4" step="0.1" value="2"><b class="va"></b></label>
      <label>εκθέτης κ <input type="range" class="rk" min="-2" max="2" step="0.5" value="1.5"><b class="vk"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      let a = +$(".ra", box).value; if (Math.abs(a - 1) < 1e-9) { a = 1.1; $(".ra", box).value = a; } const k = +$(".rk", box).value; $(".va", box).textContent = fmt(a); $(".vk", box).textContent = fmt(k);
      const P = gPlot($(".pl", box), 1.5, 1.5, 5.5, 330); P.seg(-6, -6, 9, 9, "guide");
      P.curve(x => Math.pow(a, x), "c2"); P.curve(x => Math.log(x) / Math.log(a), "c1", 1e-4, 7);
      const ak = Math.pow(a, k); if (ak < 7) { P.dot(k, ak, "d2", `(${fmt(k)}, ${fmt(ak)})`, -8, -8); P.dot(ak, k, "d1", `(${fmt(ak)}, ${fmt(k)})`, 8, 16); }
      $(".wout", box).innerHTML = `<span style="color:var(--purple)">y = ${fmt(a)}<sup>x</sup></span> και <span style="color:var(--blue)"><b>y = log<sub>${fmt(a)}</sub>x</b></span> — συμμετρικές ως προς την y = x.
        <br>${fmt(a)}<sup>${fmt(k)}</sup> = ${fmt(ak)} ⇔ <b>log<sub>${fmt(a)}</sub>${fmt(ak)} = ${fmt(k)}</b> &nbsp;·&nbsp; log<sub>α</sub>1 = 0, log<sub>α</sub>α = 1
        <br><span class="muted">Η log<sub>α</sub>x ορίζεται μόνο για x &gt; 0, έχει σύνολο τιμών ℝ, είναι ${a > 1 ? "γνησίως αύξουσα (α &gt; 1)" : "γνησίως φθίνουσα (0 &lt; α &lt; 1)"} και 1–1. Ο y'y είναι ασύμπτωτη.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 7.1 Σύγκριση δύο πληθυσμών ---------- */
  cvcomp(box) {
    box.innerHTML = `<div class="wctl"><label style="flex:1 1 100%">Δείγμα Α <input type="text" class="ta" value="140 150 160 130 150 170 150 140 160" style="width:100%"></label>
      <label style="flex:1 1 100%">Δείγμα Β <input type="text" class="tb" value="170 180 190 110 200 100 80 120 200" style="width:100%"></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const A = bkNums($(".ta", box).value), B = bkNums($(".tb", box).value);
      if (A.length < 2 || B.length < 2) { $(".wout", box).innerHTML = '<span class="warnc">Γράψε τουλάχιστον δύο αριθμούς σε κάθε δείγμα.</span>'; return; }
      const SA = statsOf(A), SB = statsOf(B), lo = Math.min(SA.d[0], SB.d[0]), hi = Math.max(SA.d[SA.n - 1], SB.d[SB.n - 1]), pad = Math.max(1, (hi - lo) * 0.08);
      const P = makePlot($(".pl", box), { xmin: lo - pad, xmax: hi + pad, ymin: 0, ymax: 3, H: 170, xstep: niceStep(hi - lo + 2 * pad), ystep: 10 });
      P.svg.classList.add("nogrid");
      [[A, SA, 2, "d1"], [B, SB, 1, "d2"]].forEach(([D, S, y, cl]) => { const cnt = {}; D.forEach(v => { cnt[v] = (cnt[v] || 0) + 1; P.dot(v, y + (cnt[v] - 1) * 0.18, cl); }); P.seg(S.mean, y - 0.35, S.mean, y + 0.6, "asl"); });
      gText(P, lo - pad * 0.6, 2.35, "Α", "fill:var(--blue)", "start"); gText(P, lo - pad * 0.6, 1.35, "Β", "fill:var(--purple)", "start");
      const cv = S => S.mean ? S.sd / Math.abs(S.mean) * 100 : NaN, row = (n, S) => `<tr><td><b>${n}</b></td><td>${S.n}</td><td>${fmt(S.mean)}</td><td>${fmt(S.sd)}</td><td>${fmt(cv(S))}%</td><td>${cv(S) < 10 ? "ναι" : "όχι"}</td></tr>`;
      $(".wout", box).innerHTML = `<table class="mini"><tr><th></th><th>ν</th><th>x̄</th><th>s</th><th>CV = s/|x̄|</th><th>ομοιογενές (CV &lt; 10%);</th></tr>${row("Α", SA)}${row("Β", SB)}</table>
        <span class="muted">Οι κόκκινες γραμμές δείχνουν τις μέσες τιμές. Μικρότερη τυπική απόκλιση ⇒ μικρότερη διασπορά. Για δείγματα με πολύ διαφορετικές μέσες τιμές ή μονάδες συγκρίνουμε τον <b>συντελεστή μεταβολής</b> CV.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 7.2 Φυλλογράφημα ---------- */
  stemleaf(box) {
    box.innerHTML = `<div class="wctl"><label style="flex:1 1 100%">Δείγμα Α <input type="text" class="ta" value="10 16 20 5 10 5 11 9 15 12 8 6" style="width:100%"></label>
      <label style="flex:1 1 100%">Δείγμα Β (προαιρετικό, για διπλής όψης) <input type="text" class="tb" value="23 5 31 17 17 31 23 7 17 23 31 23" style="width:100%"></label>
      <label>κορμός <select class="ss"><option value="10">δεκάδες (φύλλο: μονάδες)</option><option value="1">ακέραιο μέρος (φύλλο: 1ο δεκαδικό)</option></select></label></div><div class="wout"></div>`;
    function draw() {
      const unit = +$(".ss", box).value, A = bkNums($(".ta", box).value), B = bkNums($(".tb", box).value);
      if (A.length < 2) { $(".wout", box).innerHTML = '<span class="warnc">Γράψε τουλάχιστον δύο αριθμούς στο δείγμα Α.</span>'; return; }
      const split = v => { const k = unit === 10 ? Math.round(v) : Math.round(v * 10); return [Math.floor(k / 10), k - 10 * Math.floor(k / 10)]; };
      const all = A.concat(B).map(split), s0 = Math.min(...all.map(p => p[0])), s1 = Math.max(...all.map(p => p[0]));
      if (s1 - s0 > 40) { $(".wout", box).innerHTML = '<span class="warnc">Πολύ μεγάλο εύρος για φυλλογράφημα με αυτόν τον κορμό.</span>'; return; }
      const leaves = D => { const m = {}; D.map(split).forEach(([s, l]) => (m[s] = m[s] || []).push(l)); Object.values(m).forEach(a => a.sort((u, v) => u - v)); return m; };
      const LA = leaves(A), LB = leaves(B); let rows = "";
      for (let s = s1; s >= s0; s--) rows += `<tr>${B.length ? `<td style="text-align:right;letter-spacing:.25em;font-family:monospace">${(LB[s] || []).slice().reverse().join("")}</td>` : ""}<th style="font-family:monospace">${s}</th><td style="text-align:left;letter-spacing:.25em;font-family:monospace">${(LA[s] || []).join("")}</td></tr>`;
      const st = D => { const q = quartHalves(D); return `ν = ${D.length}, Q₁ = <b>${fmt(q.q1)}</b>, διάμεσος Q₂ = <b>${fmt(q.q2)}</b>, Q₃ = <b>${fmt(q.q3)}</b>, IQR = Q₃ − Q₁ = <b>${fmt(q.q3 - q.q1)}</b>, εύρος = <b>${fmt(q.d[q.d.length - 1] - q.d[0])}</b>`; };
      $(".wout", box).innerHTML = `<table class="mini">${B.length ? `<tr><th>Β</th><th></th><th>Α</th></tr>` : ""}${rows}</table>
        <span class="muted">Κλειδί: ${unit === 10 ? "2 | 3 σημαίνει 23" : "14 | 6 σημαίνει 14,6"}. Τα φύλλα γράφονται σε αύξουσα σειρά <b>απομακρυνόμενα</b> από τον κορμό.</span><br>
        <b>Α:</b> ${st(A)}${B.length ? `<br><b>Β:</b> ${st(B)}` : ""}<br><span class="muted">Τεταρτημόρια: διάμεσος του κάτω και του πάνω μισού των διατεταγμένων τιμών (με περιττό πλήθος αφήνουμε έξω τη διάμεσο).</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 4.2–4.3 Όριο και πλευρικά όρια ---------- */
  limit(box) {
    const F = [
      { n: "f(x) = (x² − 1)/(x − 1), x₀ = 1", x0: 1, f: x => x === 1 ? NaN : (x * x - 1) / (x - 1), L: 2, R: 2, v: null, draw: P => { P.curve(x => x + 1, "c1"); bkOpen(P, 1, 2); } },
      { n: "f(x) = x + 1 αν x < 1, x + 2 αν x ≥ 1", x0: 1, f: x => x < 1 ? x + 1 : x + 2, L: 2, R: 3, v: 3, draw: P => { P.curve(x => x + 1, "c1", -3, 1 - 1e-9); P.curve(x => x + 2, "c1", 1, 4); bkOpen(P, 1, 2); bkFill(P, 1, 3); } },
      { n: "f(x) = x² αν x ≠ 2, f(2) = 1", x0: 2, f: x => x === 2 ? 1 : x * x, L: 4, R: 4, v: 1, draw: P => { P.curve(x => x * x, "c1"); bkOpen(P, 2, 4); bkFill(P, 2, 1); } },
      { n: "f(x) = x² − 2x + 3, x₀ = 1", x0: 1, f: x => x * x - 2 * x + 3, L: 2, R: 2, v: 2, draw: P => { P.curve(x => x * x - 2 * x + 3, "c1"); bkFill(P, 1, 2); } },
      { n: "f(x) = 3 − x αν x < 2, x² − 3 αν x > 2", x0: 2, f: x => x < 2 ? 3 - x : x === 2 ? NaN : x * x - 3, L: 1, R: 1, v: null, draw: P => { P.curve(x => 3 - x, "c1", -3, 2 - 1e-9); P.curve(x => x * x - 3, "c1", 2 + 1e-9, 4); bkOpen(P, 2, 1); } }
    ];
    box.innerHTML = `<div class="wctl"><label>συνάρτηση <select class="sf">${F.map((f, i) => `<option value="${i}">${f.n}</option>`).join("")}</select></label>
      <label><span>πόσο κοντά στο x₀ (h = 10<sup>−κ</sup>)</span> <input type="range" class="rk" min="0" max="3" step="0.25" value="0.5"><b class="vk"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const k = F[+$(".sf", box).value], h = Math.pow(10, -+$(".rk", box).value); $(".vk", box).textContent = "h = " + fmt(h);
      const P = makePlot($(".pl", box), { xmin: -3, xmax: 4, ymin: -2, ymax: 7, H: 300 }); k.draw(P);
      const xl = k.x0 - h, xr = k.x0 + h, yl = k.f(xl), yr = k.f(xr);
      P.seg(xl, 0, xl, yl, "guide"); P.seg(xr, 0, xr, yr, "guide"); P.dot(xl, yl, "d2"); P.dot(xr, yr, "d1");
      const ex = k.L === k.R;
      $(".wout", box).innerHTML = `<table class="mini"><tr><th>x</th><td>${fmt(k.x0 - h)}${h < 0.01 ? "…" : ""}</td><td>x₀ = ${k.x0}</td><td>${fmt(k.x0 + h)}${h < 0.01 ? "…" : ""}</td></tr><tr><th>f(x)</th><td>${(+yl.toFixed(4)).toLocaleString("el-GR")}</td><td>${k.v === null ? "δεν ορίζεται" : k.v}</td><td>${(+yr.toFixed(4)).toLocaleString("el-GR")}</td></tr></table>
        <span style="color:var(--purple)">από αριστερά: lim<sub>x→${k.x0}⁻</sub> f(x) = <b>${k.L}</b></span> &nbsp;·&nbsp; <span style="color:var(--blue)">από δεξιά: lim<sub>x→${k.x0}⁺</sub> f(x) = <b>${k.R}</b></span><br>
        ${ex ? `<span class="okc">Τα πλευρικά όρια είναι ίσα ⇒ <b>lim<sub>x→${k.x0}</sub> f(x) = ${k.L}</b></span>${k.v === null ? " — παρόλο που η f δεν ορίζεται στο x₀!" : k.v !== k.L ? ` — διαφορετικό από την τιμή f(${k.x0}) = ${k.v}!` : ` = f(${k.x0}).`}` : `<span class="badc">Τα πλευρικά όρια είναι διαφορετικά ⇒ το όριο στο x₀ = ${k.x0} <b>δεν υπάρχει</b>.</span>`}
        <br><span class="muted">Το όριο εξαρτάται από τις τιμές της f <b>κοντά</b> στο x₀, όχι από την τιμή στο x₀.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 4.4 Όριο πολυωνύμου στο άπειρο ---------- */
  inflim(box) {
    box.innerHTML = `<div class="wctl"><label><span>μεγιστοβάθμιος συντελεστής</span> <input type="range" class="ra" min="-3" max="3" step="1" value="-2"><b class="va"></b></label>
      <label>βαθμός ν <input type="range" class="rn" min="3" max="6" step="1" value="3"><b class="vn"></b></label>
      <label>παράθυρο ±X <input type="range" class="rz" min="2" max="40" step="1" value="5"><b class="vz"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      let a = +$(".ra", box).value; if (!a) { a = 1; $(".ra", box).value = 1; } const n = +$(".rn", box).value, Z = +$(".rz", box).value;
      $(".va", box).textContent = a; $(".vn", box).textContent = n; $(".vz", box).textContent = Z;
      const p = x => a * x ** n + 4 * x * x - 6 * x + 2;
      /* πραγματικός μεγιστοβάθμιος όρος */
      let lc = a, ld = n; if (n === 2) { lc = a + 4; if (!lc) { lc = -6; ld = 1; } } else if (n === 1) { lc = 4; ld = 2; }
      const lead = x => lc * x ** ld, sup = d => d > 1 ? "<sup>" + d + "</sup>" : "";
      const Y = Math.max(...[-Z, Z, Z / 2, -Z / 2].map(x => Math.abs(p(x)))) * 1.1 + 1;
      const P = makePlot($(".pl", box), { xmin: -Z, xmax: Z, ymin: -Y, ymax: Y, H: 300, xstep: niceStep(2 * Z), ystep: niceStep(2 * Y) });
      P.curve(lead, "cfam"); P.curve(p, "c1");
      const sg = v => v > 0 ? "+∞" : "−∞", Lp = sg(lc), Lm = sg(lc * (ld % 2 ? -1 : 1));
      const cf = c => c === 1 ? "" : c === -1 ? "−" : String(c).replace("-", "−");
      const ps = n > 2 ? `${cf(a)}x${sup(n)} + 4x² − 6x + 2` : n === 2 ? `${a + 4 ? cf(a + 4) + "x²" : ""} − 6x + 2`.replace(/^ − /, "−") : `4x² − ${6 - a}x + 2`;
      const ts = `${cf(lc)}x${sup(ld)}`;
      $(".wout", box).innerHTML = `P(x) = <b>${ps}</b> &nbsp;·&nbsp; <span class="muted">γκρι: μόνο ο μεγιστοβάθμιος όρος ${ts}</span>
        <br>lim<sub>x→+∞</sub> P(x) = lim<sub>x→+∞</sub> ${ts} = <b>${Lp}</b> &nbsp;·&nbsp; lim<sub>x→−∞</sub> P(x) = lim<sub>x→−∞</sub> ${ts} = <b>${Lm}</b>
        <br><span class="muted">Μεγάλωσε το παράθυρο: όσο απομακρυνόμαστε, οι δύο καμπύλες «συμπίπτουν» — στο ±∞ μετράει μόνο ο όρος με τον μεγαλύτερο βαθμό.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 4.6 / 4.9 Τέμνουσα → εφαπτομένη ---------- */
  secant(box) {
    const F = [["x²", x => x * x, x => 2 * x], ["x³ − 3x", x => x ** 3 - 3 * x, x => 3 * x * x - 3], ["1/x", x => 1 / x, x => -1 / (x * x)], ["x² − 4x + 1", x => x * x - 4 * x + 1, x => 2 * x - 4], ["√x", x => Math.sqrt(x), x => 1 / (2 * Math.sqrt(x))]];
    box.innerHTML = `<div class="wctl"><label>f(x) = <select class="sf">${F.map((f, i) => `<option value="${i}">${f[0]}</option>`).join("")}</select></label>
      <label>x₀ <input type="range" class="rx" min="-2.5" max="2.5" step="0.25" value="1"><b class="vx"></b></label>
      <label>h = x − x₀ <input type="range" class="rh" min="-2" max="2" step="0.05" value="1.5"><b class="vh"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const i = +$(".sf", box).value, [nm, f, d] = F[i]; let x0 = +$(".rx", box).value, h = +$(".rh", box).value;
      if (i === 2 && x0 === 0) x0 = 0.5; if (i === 4 && x0 <= 0) x0 = 1; if (Math.abs(h) < 1e-9) h = 0.05; if (i === 4 && x0 + h <= 0) h = -x0 / 2; if (i === 2 && (x0 + h) * x0 <= 0.0025) h = x0 > 0 ? 0.1 - x0 : -0.1 - x0; if (i === 2 && Math.abs(h) < 1e-9) h = x0 > 0 ? 0.3 : -0.3;
      $(".vx", box).textContent = fmt(x0); $(".vh", box).textContent = fmt(h);
      const y0 = f(x0), x1 = x0 + h, y1 = f(x1), ls = (y1 - y0) / h, lt = d(x0), b = y0 - lt * x0;
      const P = makePlot($(".pl", box), { xmin: -4, xmax: 4, ymin: -4, ymax: 6, H: 300 });
      if (i === 2) { P.curve(f, "c1", -4, -1e-3); P.curve(f, "c1", 1e-3, 4); } else if (i === 4) P.curve(f, "c1", 0, 4); else P.curve(f, "c1");
      P.curve(x => y0 + ls * (x - x0), "c1line"); P.curve(x => y0 + lt * (x - x0), "tangent");
      P.dot(x0, y0, "d2", "Α", -10, -8); P.dot(x1, y1, "d1", "Β", 8, -8);
      const be = b === 0 ? "" : b > 0 ? ` + ${fmt(b)}` : ` − ${fmt(-b)}`;
      $(".wout", box).innerHTML = `<span style="color:var(--purple)">κλίση τέμνουσας ΑΒ: Δy/Δx = (f(x₀ + h) − f(x₀))/h = <b>${fmt(ls)}</b></span>
        <br><span style="color:var(--red)">κλίση εφαπτομένης: f'(${fmt(x0)}) = lim<sub>h→0</sub> (f(x₀ + h) − f(x₀))/h = <b>${fmt(lt)}</b></span>
        <br>Εφαπτομένη στο Α(${fmt(x0)}, ${fmt(y0)}): y − ${fmt(y0)} = ${fmt(lt)}(x − ${fmt(x0)}) ⇔ <b>y = ${fmt(lt)}x${be}</b>
        <br><span class="muted">Μίκρυνε το h προς το 0 (από δεξιά ή αριστερά): η τέμνουσα πλησιάζει την εφαπτομένη και η κλίση της τον παράγωγο αριθμό.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 4.8 Συνάρτηση και παράγωγος ---------- */
  derivplot(box) {
    box.innerHTML = `<div class="wctl"><label>f(x) = <input type="text" class="tf" value="x^3 - 3x" style="width:9em"></label>
      <label>η f'(x) που βρήκες: <input type="text" class="tg" value="3x^2 - 3" style="width:9em"></label>
      <label>x₀ <input type="range" class="rx" min="-3" max="3" step="0.25" value="1.5"><b class="vx"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const x0 = +$(".rx", box).value; $(".vx", box).textContent = fmt(x0); let f, g = null;
      try { f = MathParse.parse($(".tf", box).value); } catch (e) { $(".wout", box).innerHTML = `<span class="warnc">f: ⚠ ${e.message}</span>`; return; }
      try { if ($(".tg", box).value.trim()) g = MathParse.parse($(".tg", box).value); } catch (e) { g = null; }
      const D1 = x => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
      const P = makePlot($(".pl", box), { xmin: -4, xmax: 4, ymin: -6, ymax: 6, H: 300 });
      P.curve(f, "c1"); P.curve(D1, "c2");
      const y0 = f(x0), s = D1(x0);
      if (isFinite(y0) && isFinite(s)) { P.curve(x => y0 + s * (x - x0), "tangent", x0 - 1.5, x0 + 1.5); P.dot(x0, y0, "d1"); P.dot(x0, s, "d2"); P.seg(x0, y0, x0, s, "guide"); }
      let chk = ""; if (g) { const pts = [-2.3, -1.4, -0.6, 0.7, 1.3, 2.1]; let n = 0, good = true; for (const x of pts) { const a = g(x), b = D1(x); if (!isFinite(b)) continue; n++; if (!isFinite(a) || Math.abs(a - b) > 1e-3 * Math.max(1, Math.abs(b))) good = false; } chk = n >= 3 ? (good ? '<span class="okc">✓ Ο τύπος σου ταιριάζει με την παράγωγο!</span>' : '<span class="badc">✗ Ο τύπος σου δεν συμφωνεί με την παράγωγο — ξαναδές τους κανόνες.</span>') : ""; }
      $(".wout", box).innerHTML = `<span style="color:var(--blue)">μπλε: f</span> &nbsp;·&nbsp; <span style="color:var(--purple)">μωβ: f'</span> &nbsp;·&nbsp; f'(${fmt(x0)}) ≈ <b>${isFinite(s) ? fmt(s) : "—"}</b> = κλίση της εφαπτομένης (κόκκινη) στο (${fmt(x0)}, ${isFinite(y0) ? fmt(y0) : "—"})
        <br>${chk}<br><span class="muted">Όπου η f' είναι θετική, η f ανεβαίνει· όπου είναι αρνητική, κατεβαίνει. Γράψε π.χ. <code>(x-2)(x-3)</code> ή <code>x/(x-2)</code>.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 5.x Ακολουθίες ---------- */
  seqgen(box) { seqW(box, 0); },
  seqap(box) { seqW(box, 1); },
  seqgp(box) { seqW(box, 2); },

  /* ---------- 6.2 Κανονικά πολύγωνα ---------- */
  regpoly(box) {
    box.innerHTML = `<div class="wctl"><label>πλευρές ν <input type="range" class="rn" min="3" max="24" step="1" value="6"><b class="vn"></b></label>
      <label>ακτίνα R <input type="range" class="rr" min="1" max="5" step="0.5" value="2"><b class="vr"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const n = +$(".rn", box).value, R0 = +$(".rr", box).value; $(".vn", box).textContent = n; $(".vr", box).textContent = fmt(R0);
      const P = gPlot($(".pl", box), 0, 0, R0 * 1.22 * 560 / 330, 330, false); gCircle(P, 0, 0, R0, "stroke:var(--line);stroke-width:1.6;fill:none");
      const V = []; for (let i = 0; i < n; i++) { const t = 90 + 360 * i / n; V.push([R0 * Math.cos(gRad(t)), R0 * Math.sin(gRad(t))]); }
      P.layer.appendChild(svgEl("path", { d: V.map((p, i) => (i ? "L" : "M") + P.sx(p[0]) + "," + P.sy(p[1])).join("") + "Z", style: "fill:var(--blue);fill-opacity:.08;stroke:var(--navy);stroke-width:2.4" }));
      gLine(P, 0, 0, ...V[0], "stroke:var(--purple);stroke-width:2"); gLine(P, 0, 0, ...V[1], "stroke:var(--purple);stroke-width:2");
      const M = [(V[0][0] + V[1][0]) / 2, (V[0][1] + V[1][1]) / 2]; gLine(P, 0, 0, ...M, "stroke:var(--amber);stroke-width:2;stroke-dasharray:5 4");
      gAngMark(P, [0, 0], V[0], V[1], R0 * 0.22, "var(--purple)", n > 8 ? "" : "κ");
      P.dot(0, 0, "d2", "Κ", 8, 16);
      const k = 360 / n, phi = 180 - k, lam = 2 * R0 * Math.sin(Math.PI / n), ap = R0 * Math.cos(Math.PI / n);
      $(".wout", box).innerHTML = `Κανονικό ${n}-γωνο: <span style="color:var(--purple)">κεντρική γωνία κ<sub>ν</sub> = 360°/ν = <b>${fmt(k)}°</b></span> &nbsp;·&nbsp; γωνία φ<sub>ν</sub> = 180° − κ<sub>ν</sub> = <b>${fmt(phi)}°</b>
        <br>πλευρά λ<sub>${n}</sub> ≈ <b>${fmt(lam)}</b> &nbsp;·&nbsp; <span style="color:var(--amber)">απόστημα α<sub>${n}</sub> ≈ <b>${fmt(ap)}</b></span> &nbsp;·&nbsp; περίμετρος Π<sub>${n}</sub> ≈ <b>${fmt(n * lam)}</b> &nbsp;·&nbsp; εμβαδόν Ε<sub>${n}</sub> ≈ <b>${fmt(n * lam * ap / 2)}</b>
        <br>κύκλος: μήκος 2πR ≈ <b>${fmt(2 * Math.PI * R0)}</b>, εμβαδόν πR² ≈ <b>${fmt(Math.PI * R0 * R0)}</b>
        <br><span class="muted">${n === 3 ? "Ισόπλευρο: λ₃ = R√3, α₃ = R/2." : n === 4 ? "Τετράγωνο: λ₄ = R√2, α₄ = R√2/2." : n === 6 ? "Εξάγωνο: λ₆ = R, α₆ = R√3/2 (6 ισόπλευρα τρίγωνα)." : "Μεγάλωσε το ν: η περίμετρος και το εμβαδόν πλησιάζουν το μήκος και το εμβαδόν του κύκλου."}</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 6.3 Τόξο, τομέας, τμήμα ---------- */
  sector(box) {
    box.innerHTML = `<div class="wctl"><label>ακτίνα R <input type="range" class="rr" min="1" max="6" step="0.5" value="3"><b class="vr"></b></label>
      <label>επίκεντρη γωνία μ° <input type="range" class="rm" min="10" max="350" step="5" value="120"><b class="vm"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const R0 = +$(".rr", box).value, m = +$(".rm", box).value; $(".vr", box).textContent = fmt(R0); $(".vm", box).textContent = m + "°";
      const P = gPlot($(".pl", box), 0, 0, R0 * 1.3 * 560 / 330, 330, false); gCircle(P, 0, 0, R0, "stroke:var(--line);stroke-width:1.6;fill:none");
      const pt = t => [R0 * Math.cos(gRad(t)), R0 * Math.sin(gRad(t))], A = pt(0), B = pt(m);
      let arc = ""; for (let i = 0; i <= 80; i++) { const p = pt(m * i / 80); arc += (i ? "L" : "M") + P.sx(p[0]).toFixed(1) + "," + P.sy(p[1]).toFixed(1); }
      P.layer.appendChild(svgEl("path", { d: `M${P.sx(0)},${P.sy(0)}` + arc.replace("M", "L") + "Z", style: "fill:var(--blue);fill-opacity:.14;stroke:none" }));
      P.layer.appendChild(svgEl("path", { d: arc + "Z", style: "fill:var(--amber);fill-opacity:.3;stroke:none" }));
      P.top.appendChild(svgEl("path", { d: arc, style: "fill:none;stroke:var(--red);stroke-width:4" }));
      gLine(P, 0, 0, ...A, "stroke:var(--navy);stroke-width:2"); gLine(P, 0, 0, ...B, "stroke:var(--navy);stroke-width:2"); gLine(P, ...A, ...B, "stroke:var(--amber);stroke-width:2");
      gArc(P, 0, 0, 0, m, R0 * 0.22, "var(--purple)", "μ"); P.dot(...A, "d2", "Α", 8, 4); P.dot(...B, "d2", "Β", B[0] >= 0 ? 8 : -8, B[1] >= 0 ? -8 : 18);
      const L = Math.PI * R0 * m / 180, S = Math.PI * R0 * R0 * m / 360, T = 0.5 * R0 * R0 * Math.sin(gRad(m));
      const piF = (num, den) => { const g = gcdI(Math.round(num * 4), Math.round(den * 4)); const p = Math.round(num * 4) / g, q = Math.round(den * 4) / g; return (p === 1 ? "" : p) + "π" + (q === 1 ? "" : "/" + q); };
      $(".wout", box).innerHTML = `<span style="color:var(--red)">μήκος τόξου ℓ = πRμ/180 = <b>${piF(R0 * m, 180)} ≈ ${fmt(L)}</b></span> &nbsp;·&nbsp; μήκος κύκλου 2πR ≈ ${fmt(2 * Math.PI * R0)}
        <br><span style="color:var(--blue)">εμβαδόν τομέα Ε = πR²μ/360 = <b>${piF(R0 * R0 * m, 360)} ≈ ${fmt(S)}</b></span> &nbsp;·&nbsp; εμβαδόν δίσκου πR² ≈ ${fmt(Math.PI * R0 * R0)}
        <br><span style="color:var(--amber)">κυκλικό τμήμα (χορδή ΑΒ + τόξο) = Ε<sub>τομέα</sub> − Ε<sub>ΚΑΒ</sub> = ${fmt(S)} − ½R²·ημμ = <b>${fmt(S - T)}</b></span>
        <br><span class="muted">Το τόξο και ο τομέας είναι ανάλογα της γωνίας: μ/360 του κύκλου. ${m > 180 ? "Για μ > 180° είναι ημμ < 0, άρα το τρίγωνο ΚΑΒ <b>προστίθεται</b>." : ""}</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  }
});

/* ================= Γεννήτριες ================= */
const bkPick = a => a[ri(0, a.length - 1)];
const bkD = v => String(bkR2(v)).replace(".", "{,}");
const bkTexSq = s => String(s).replace(/(\d*)√(\d+)/g, (m, k, r) => `${k}\\sqrt{${r}}`).replace(/−/g, "-");
const bkPolyTex = (cs) => { /* cs: [[coef, power],...] */ let s = ""; cs.forEach(([c, p]) => { if (!c) return; const sg = c < 0 ? "-" : s ? "+" : ""; const a = Math.abs(c); const v = p === 0 ? "" : p === 1 ? "x" : `x^{${p}}`; s += ` ${sg} ${a === 1 && p ? "" : a}${v}`; }); return s.trim() || "0"; };
const bkPolyStr = (cs) => { let s = ""; cs.forEach(([c, p]) => { if (!c) return; const sg = c < 0 ? "-" : s ? "+" : ""; const a = Math.abs(c); const v = p === 0 ? "" : p === 1 ? "x" : `x^${p}`; s += `${sg}${a === 1 && p ? "" : a}${v}`; }); return s || "0"; };
const bkPolyEval = (cs, x) => cs.reduce((u, [c, p]) => u + c * x ** p, 0);
const bkPolyDer = cs => cs.filter(([c, p]) => p > 0 && c).map(([c, p]) => [c * p, p - 1]);
const bkLin = (k, c, v = "x") => k === 0 ? String(c) : `${k === 1 ? "" : k === -1 ? "-" : k}${v}${c ? (c < 0 ? " - " + -c : " + " + c) : ""}`;
function bkMC(ex, opts, ci) { const idx = shuffle(opts.map((_, i) => i)); ex.options = idx.map(i => opts[i]); ex.correct = idx.indexOf(ci); ex.type = "mc"; return ex; }

var GENS = Object.assign(window.GENS || {}, {
  gsines: { title: "Γεννήτρια — νόμος ημιτόνων", make() {
    const t = ri(0, 2);
    if (t === 0) { const B = ri(25, 80), C = ri(25, 150 - B), a = ri(4, 15), A = 180 - B - C, b = a * bkSin(B) / bkSin(A);
      return { q: R`Σε τρίγωνο $AB\Gamma$ είναι $\hat B = ${B}^\circ$, $\hat\Gamma = ${C}^\circ$ και $\alpha = ${a}$ cm. Να υπολογίσετε τη γωνία $\hat A$ και την πλευρά $\beta$ (2 δεκαδικά).`,
        fields: [{ label: "Â (°) =", ans: A }, { label: "β (cm) =", ans: bkR2(b), tol: 0.006 / Math.max(1, b) }],
        sol: R`$\hat A = 180^\circ - ${B}^\circ - ${C}^\circ = ${A}^\circ$. Νόμος ημιτόνων: $\frac{\beta}{\text{ημ}${B}^\circ} = \frac{${a}}{\text{ημ}${A}^\circ} \Rightarrow \beta = \frac{${a}\,\text{ημ}${B}^\circ}{\text{ημ}${A}^\circ} \approx ${bkD(b)}$ cm.` }; }
    if (t === 1) { const A = bkPick([30, 45, 60, 90, 120, 135, 150]), R0 = ri(2, 9), val = { 30: [R0, `${R0}`], 150: [R0, `${R0}`], 90: [2 * R0, `${2 * R0}`], 45: [R0 * Math.SQRT2, `${R0}√2`], 135: [R0 * Math.SQRT2, `${R0}√2`], 60: [R0 * Math.sqrt(3), `${R0}√3`], 120: [R0 * Math.sqrt(3), `${R0}√3`] }[A];
      const s = val[1].replace(/^1√/, "√");
      return { q: R`Τρίγωνο $AB\Gamma$ είναι εγγεγραμμένο σε κύκλο ακτίνας $R = ${R0}$ cm και έχει $\hat A = ${A}^\circ$. Να υπολογίσετε την πλευρά $\alpha$.`,
        fields: [{ label: "α (cm) =", ans: s, tol: 0.006 / Math.max(1, val[0]) }],
        sol: R`$\frac{\alpha}{\text{ημ}A} = 2R \Rightarrow \alpha = 2\cdot${R0}\cdot\text{ημ}${A}^\circ = ${bkTexSq(s)}$ cm.` }; }
    const R0 = ri(2, 12), k = ri(1, 2 * R0 - 1), g = gcdI(k, 2 * R0);
    return { q: R`Σε τρίγωνο $AB\Gamma$ είναι $\gamma = ${k}$ cm και η ακτίνα του περιγεγραμμένου κύκλου είναι $R = ${R0}$ cm. Να υπολογίσετε το $\text{ημ}\Gamma$.`,
      fields: [{ label: "ημΓ =", ans: fracS2(k, 2 * R0) }],
      sol: R`$\frac{\gamma}{\text{ημ}\Gamma} = 2R \Rightarrow \text{ημ}\Gamma = \frac{\gamma}{2R} = \frac{${k}}{${2 * R0}}${g > 1 ? ` = ${texFrac(k, 2 * R0)}` : ""}$.` };
  } },
  gcosines: { title: "Γεννήτρια — νόμος συνημιτόνων", make() {
    if (ri(0, 1)) { const A = bkPick([60, 120, 90]), b = ri(2, 9), c = ri(2, 9), a2 = b * b + c * c - 2 * b * c * bkCos(A), a2r = Math.round(a2);
      const cosT = A === 90 ? "0" : A === 60 ? R`\frac12` : R`\left(-\frac12\right)`;
      return { q: R`Σε τρίγωνο $AB\Gamma$ είναι $\beta = ${b}$, $\gamma = ${c}$ και $\hat A = ${A}^\circ$. Να υπολογίσετε το $\alpha^2$ και το $\alpha$.`,
        fields: [{ label: "α² =", ans: a2r }, { label: "α =", ans: "√" + a2r, tol: 0.006 / Math.max(1, Math.sqrt(a2r)) }],
        sol: R`$\alpha^2 = \beta^2 + \gamma^2 - 2\beta\gamma\,\text{συν}A = ${b * b} + ${c * c} - 2\cdot${b}\cdot${c}\cdot${cosT} = ${a2r}$, άρα $\alpha = ${bkTexSq(sqrtForm(a2r))}${Number.isInteger(Math.sqrt(a2r)) ? "" : R` \approx ${bkD(Math.sqrt(a2r))}`}$.` }; }
    let a, b, c; do { a = ri(2, 12); b = ri(2, 12); c = ri(2, 12); } while (a >= b + c || b >= a + c || c >= a + b);
    const num = a * a + b * b - c * c, den = 2 * a * b, C = bkDeg(num / den);
    return { q: R`Σε τρίγωνο $AB\Gamma$ είναι $\alpha = ${a}$, $\beta = ${b}$ και $\gamma = ${c}$. Να υπολογίσετε το $\text{συν}\Gamma$.`,
      fields: [{ label: "συνΓ =", ans: fracS2(num, den) }], type: "fields",
      sol: R`$\text{συν}\Gamma = \frac{\alpha^2 + \beta^2 - \gamma^2}{2\alpha\beta} = \frac{${a * a} + ${b * b} - ${c * c}}{${den}} = ${texFrac(num, den)}$, άρα $\hat\Gamma \approx ${bkD(C)}^\circ$ — ${num > 0 ? "οξεία" : num < 0 ? "αμβλεία" : "ορθή"} (${num > 0 ? "συνΓ > 0" : num < 0 ? "συνΓ < 0" : "συνΓ = 0"}).` };
  } },
  garea: { title: "Γεννήτρια — εμβαδόν τριγώνου", make() {
    const t = ri(0, 1), A = bkPick([30, 45, 60, 90, 120, 135, 150]), b = ri(2, 10), c = ri(2, 10);
    const sn = { 30: [1, 2, ""], 150: [1, 2, ""], 90: [1, 1, ""], 45: [1, 2, "√2"], 135: [1, 2, "√2"], 60: [1, 2, "√3"], 120: [1, 2, "√3"] }[A];
    const p = b * c * sn[0], q = 2 * sn[1], g = gcdI(p, q), P2 = p / g, Q2 = q / g;
    const ans = (P2 === 1 && sn[2] ? "" : P2) + sn[2] + (Q2 === 1 ? "" : "/" + Q2), val = 0.5 * b * c * bkSin(A);
    const texA = (sn[2] ? (P2 === 1 ? "" : P2) + `\\sqrt{${sn[2].slice(1)}}` : P2);
    if (t === 0) return { q: R`Να υπολογίσετε το εμβαδόν τριγώνου $AB\Gamma$ με $\beta = ${b}$ cm, $\gamma = ${c}$ cm και $\hat A = ${A}^\circ$.`,
      fields: [{ label: "Ε (cm²) =", ans, tol: 0.006 / Math.max(1, val) }],
      sol: R`$E = \frac12\beta\gamma\,\text{ημ}A = \frac12\cdot${b}\cdot${c}\cdot\text{ημ}${A}^\circ = ${Q2 === 1 ? texA : R`\frac{${texA}}{${Q2}}`} \approx ${bkD(val)}$ cm².` };
    const E = ri(3, 30), bb = ri(2, 9), cc = ri(2, 9); const s = 2 * E / (bb * cc);
    if (s > 1) return GENS.garea.make();
    return { q: R`Τρίγωνο $AB\Gamma$ έχει εμβαδόν $E = ${E}$ cm², $\alpha = ${bb}$ cm και $\beta = ${cc}$ cm. Να υπολογίσετε το $\text{ημ}\Gamma$.`,
      fields: [{ label: "ημΓ =", ans: fracS2(2 * E, bb * cc) }],
      sol: R`$E = \frac12\alpha\beta\,\text{ημ}\Gamma \Rightarrow ${E} = \frac12\cdot${bb}\cdot${cc}\cdot\text{ημ}\Gamma \Rightarrow \text{ημ}\Gamma = ${texFrac(2 * E, bb * cc)}$.${Math.abs(s - 1) < 1e-12 ? " Άρα $\\hat\\Gamma = 90^\\circ$." : " (Δύο δυνατές γωνίες: μία οξεία και η παραπληρωματική της.)"}` };
  } },
  gfval: { title: "Γεννήτρια — τιμές συνάρτησης", make() {
    const a = ri(-3, 3) || 2, b = ri(-6, 6), c = ri(-9, 9), x0 = ri(1, 3) * (ri(0, 1) ? 1 : -1), cs = [[a, 2], [b, 1], [c, 0]];
    if (ri(0, 1)) return { q: R`Δίνεται η συνάρτηση $f(x) = ${bkPolyTex(cs)}$, $x \in \mathbb{R}$. Να υπολογίσετε τις τιμές $f(${x0})$ και $f(0)$.`,
      fields: [{ label: `f(${x0}) =`, ans: bkPolyEval(cs, x0) }, { label: "f(0) =", ans: c }],
      sol: R`$f(${x0}) = ${bkPolyTex(cs).replace(/x/g, `(${x0})`)} = ${bkPolyEval(cs, x0)}$, $\ f(0) = ${c}$.` };
    const k = ri(2, 3) * (ri(0, 1) ? 1 : -1), v = ri(-20, 20);
    return { q: R`Δίνεται $f(x) = ${bkPolyTex([[a, 2], [b, 1]])} + A$. Αν $f(${k}) = ${v}$, να βρείτε το $A$.`,
      fields: [{ label: "A =", ans: v - a * k * k - b * k }],
      sol: R`$f(${k}) = ${a * k * k + b * k} + A = ${v} \Rightarrow A = ${v - a * k * k - b * k}$.` };
  } },
  gdom: { title: "Γεννήτρια — πεδίο ορισμού", make() {
    const a = ri(-6, 6), b = ri(1, 6), t = ri(0, 3), fa = a === 0 ? "x" : `x ${a > 0 ? "-" : "+"} ${Math.abs(a)}`;
    const C = [
      [R`f(x) = \frac{${ri(1, 5)}}{${fa}}`, [`ℝ − {${a}}`, `(${a}, +∞)`, `[${a}, +∞)`, "ℝ"], R`Παρονομαστής $\ne 0$: $x \ne ${a}$.`],
      [R`f(x) = \sqrt{${fa}}`, [`[${a}, +∞)`, `(${a}, +∞)`, `ℝ − {${a}}`, `(−∞, ${a}]`], R`Υπόρριζο $\ge 0$: $x \ge ${a}$.`],
      [R`f(x) = \sqrt{x^2 - ${b * b}}`, [`(−∞, ${-b}] ∪ [${b}, +∞)`, `[${-b}, ${b}]`, `[${b}, +∞)`, `ℝ − {${-b}, ${b}}`], R`$x^2 - ${b * b} \ge 0 \iff x^2 \ge ${b * b} \iff x \le ${-b}$ ή $x \ge ${b}$.`],
      [R`f(x) = \dfrac{1}{\sqrt{${fa}}}`, [`(${a}, +∞)`, `[${a}, +∞)`, `ℝ − {${a}}`, `(−∞, ${a})`], R`Υπόρριζο $\ge 0$ και παρονομαστής $\ne 0$: $${fa} > 0 \iff x > ${a}$.`]
    ][t];
    return bkMC({ q: R`Ποιο είναι το πεδίο ορισμού της συνάρτησης $${C[0]}$;`, sol: C[2] }, C[1], 0);
  } },
  g11: { title: "Γεννήτρια — συναρτήσεις 1–1", make() {
    const yes = ["f(x) = 3x − 2", "f(x) = x³", "f(x) = 1/x, x ≠ 0", "f(x) = x², x ≥ 0", "f(x) = √x", "f(x) = −5x + 1", "f(x) = x³ + 2"];
    const no = ["f(x) = x² + 2", "f(x) = |x|", "f(x) = x³ − x", "f(x) = ημx", "f(x) = x⁴", "f(x) = (x − 1)²", "f(x) = 5 (σταθερή)"];
    const why = { "f(x) = x² + 2": "f(−1) = f(1) = 3", "f(x) = |x|": "f(−2) = f(2) = 2", "f(x) = x³ − x": "f(−1) = f(0) = f(1) = 0", "f(x) = ημx": "ημ0 = ημπ = 0", "f(x) = x⁴": "f(−1) = f(1) = 1", "f(x) = (x − 1)²": "f(0) = f(2) = 1", "f(x) = 5 (σταθερή)": "όλα τα x δίνουν 5" };
    if (ri(0, 1)) { const c = bkPick(yes), opts = [c]; while (opts.length < 4) { const z = bkPick(no); if (!opts.includes(z)) opts.push(z); }
      return bkMC({ q: "Ποια από τις πιο κάτω συναρτήσεις είναι 1–1;", sol: R`Η ${c} είναι 1–1: από $f(x_1) = f(x_2)$ προκύπτει $x_1 = x_2$ (κάθε οριζόντια ευθεία τέμνει τη γραφική της παράσταση το πολύ σε ένα σημείο). Οι άλλες δεν είναι: ${opts.slice(1).map(o => `${o} (${why[o]})`).join("· ")}.` }, opts, 0); }
    const c = bkPick(no), opts = [c]; while (opts.length < 4) { const z = bkPick(yes); if (!opts.includes(z)) opts.push(z); }
    return bkMC({ q: "Ποια από τις πιο κάτω συναρτήσεις <b>δεν</b> είναι 1–1;", sol: R`Η ${c} δεν είναι 1–1: ${why[c]} — διαφορετικά $x$ με την ίδια τιμή. Οι άλλες είναι 1–1.` }, opts, 0);
  } },
  gexpeq: { title: "Γεννήτρια — εκθετικές εξισώσεις", make() {
    const t = ri(0, 2), a = bkPick([2, 3, 5]);
    if (t === 0) { const p = ri(1, 4), q = ri(-5, 5), n = ri(-3, 5), base = a ** n;
      const rhs = n >= 0 ? `${base}` : R`\frac{1}{${a ** -n}}`;
      return { q: R`Να λύσετε την εξίσωση $${a}^{${bkLin(p, q)}} = ${rhs}$.`, fields: [{ label: "x =", ans: fracS2(n - q, p) }],
        sol: R`$${rhs} = ${a}^{${n}}$, άρα $${bkLin(p, q)} = ${n} \Rightarrow x = ${texFrac(n - q, p)}$ (η $${a}^x$ είναι 1–1).` }; }
    if (t === 1) { const b = a * a, k = ri(-3, 3) || 1, n = bkPick([1, 3, 4, 5, 6]);
      return { q: R`Να λύσετε την εξίσωση $${b}^{${bkLin(1, k)}} = ${a}^{${n === 1 ? "" : n}x}$.`, fields: [{ label: "x =", ans: fracS2(2 * k, n - 2) }],
        sol: R`$${b}^{${bkLin(1, k)}} = (${a}^2)^{${bkLin(1, k)}} = ${a}^{${bkLin(2, 2 * k)}}$, άρα $${bkLin(2, 2 * k)} = ${n === 1 ? "" : n}x \Rightarrow ${bkLin(2 - n, 0)} = ${-2 * k} \Rightarrow x = ${texFrac(2 * k, n - 2)}$.` }; }
    const r1 = ri(0, 3), r2 = ri(r1 + 1, 4), s = a ** r1 + a ** r2, pr = a ** (r1 + r2);
    return { q: R`Να λύσετε την εξίσωση $${a * a}^x - ${s}\cdot ${a}^x + ${pr} = 0$ (δώστε τη μικρότερη και τη μεγαλύτερη λύση).`,
      fields: [{ label: "x₁ =", ans: r1 }, { label: "x₂ =", ans: r2 }],
      sol: R`Θέτουμε $y = ${a}^x > 0$: $y^2 - ${s}y + ${pr} = 0 \Rightarrow y = ${a ** r1}$ ή $y = ${a ** r2}$. Άρα $${a}^x = ${a ** r1} \Rightarrow x = ${r1}$ και $${a}^x = ${a ** r2} \Rightarrow x = ${r2}$.` };
  } },
  ganat: { title: "Γεννήτρια — ανατοκισμός", make() {
    const K0 = bkPick([1000, 2000, 5000, 8000, 12000, 20000]), e = bkPick([2, 2.5, 3, 4, 5, 6]), t = ri(2, 10), K = K0 * Math.pow(1 + e / 100, t);
    return { q: R`Ποσό $${K0}$ ευρώ ανατοκίζεται ετήσια με επιτόκιο $${String(e).replace(".", "{,}")}\%$. Να υπολογίσετε το τελικό ποσό ύστερα από $${t}$ χρόνια (σε 2 δεκαδικά).`,
      fields: [{ label: "K (€) =", ans: bkR2(K), tol: 0.006 / K }],
      sol: R`$K_t = K_0(1 + \varepsilon)^t = ${K0}\cdot ${String(1 + e / 100).replace(".", "{,}")}^{${t}} \approx ${bkD(K)}$ ευρώ.` };
  } },
  glogval: { title: "Γεννήτρια — υπολογισμός λογαρίθμων", make() {
    const t = ri(0, 2), a = bkPick([2, 3, 4, 5, 10]);
    if (t === 0) { const n = ri(-3, 4), val = a ** n, arg = n >= 0 ? `${val}` : R`\frac{1}{${a ** -n}}`;
      return { q: R`Να υπολογίσετε τον λογάριθμο $${a === 10 ? R`\log` : R`\log_{${a}}`} ${arg}$.`, fields: [{ label: "=", ans: n }],
        sol: R`$${arg} = ${a}^{${n}}$, άρα $${a === 10 ? R`\log` : R`\log_{${a}}`} ${arg} = ${n}$ (ο εκθέτης στον οποίο υψώνουμε το $${a}$ για να πάρουμε $${arg}$).` }; }
    if (t === 1) { const p = ri(1, 5), q = ri(2, 4); if (gcdI(p, q) > 1) return GENS.glogval.make();
      const rt = `\\sqrt${q === 2 ? "" : `[${q}]`}{${p === 1 ? a : `${a}^{${p}}`}}`;
      return { q: R`Να υπολογίσετε τον λογάριθμο $\log_{${a}} ${rt}$.`, fields: [{ label: "=", ans: fracS2(p, q) }],
        sol: R`$${rt} = ${a}^{${p}/${q}}$, άρα ο λογάριθμος είναι $${texFrac(p, q)}$.` }; }
    const n = ri(2, 4), b = ri(1, 30);
    return { q: R`Να βρείτε το $x$ αν $\log_{${a}}(x ${b ? "+ " + b : ""}) = ${n}$.`, fields: [{ label: "x =", ans: a ** n - b }],
      sol: R`Από τον ορισμό: $x + ${b} = ${a}^{${n}} = ${a ** n} \Rightarrow x = ${a ** n - b}$ (και πράγματι $x + ${b} > 0$).` };
  } },
  glogprop: { title: "Γεννήτρια — ιδιότητες λογαρίθμων", make() {
    const a = bkPick([2, 3, 5, 6, 10]), t = ri(0, 2), lg = a === 10 ? R`\log` : R`\log_{${a}}`;
    if (t === 0) { const n = ri(2, 4), tot = a ** n; let x; const divs = []; for (let d = 2; d < tot; d++) if (tot % d === 0 && d !== a ** Math.round(Math.log(d) / Math.log(a))) divs.push(d); x = divs.length ? bkPick(divs) : a;
      return { q: R`Να υπολογίσετε την τιμή της παράστασης $${lg} ${x} + ${lg} ${tot / x}$.`, fields: [{ label: "=", ans: n }],
        sol: R`$${lg} ${x} + ${lg} ${tot / x} = ${lg}(${x}\cdot${tot / x}) = ${lg} ${tot} = ${lg} ${a}^{${n}} = ${n}$.` }; }
    if (t === 1) { const n = ri(1, 3), y = ri(2, 7), x = y * a ** n;
      return { q: R`Να υπολογίσετε την τιμή της παράστασης $${lg} ${x} - ${lg} ${y}$.`, fields: [{ label: "=", ans: n }],
        sol: R`$${lg} ${x} - ${lg} ${y} = ${lg}\frac{${x}}{${y}} = ${lg} ${a ** n} = ${n}$.` }; }
    const p = ri(2, 5), q = ri(2, 5);
    return { q: R`Να υπολογίσετε την τιμή της παράστασης $\dfrac{${lg} ${a ** p}}{${lg} ${a ** q}}$.`, fields: [{ label: "=", ans: fracS2(p, q) }],
      sol: R`$\frac{${lg} ${a}^{${p}}}{${lg} ${a}^{${q}}} = \frac{${p}\,${lg} ${a}}{${q}\,${lg} ${a}} = ${texFrac(p, q)}$ (ιδιότητα $\log_\alpha x^\kappa = \kappa\log_\alpha x$).` };
  } },
  glogeq: { title: "Γεννήτρια — λογαριθμικές εξισώσεις", make() {
    if (ri(0, 1)) { /* log x + log(x + p) = log q, ρίζες r και -(r+p) */ const r = ri(1, 6), p = ri(1, 6), qv = r * (r + p);
      return { q: R`Να λύσετε την εξίσωση $\log x + \log(x + ${p}) = \log ${qv}$.`, fields: [{ label: "x =", ans: r }],
        sol: R`Περιορισμοί: $x > 0$ (και $x + ${p} > 0$). $\log[x(x + ${p})] = \log ${qv} \Rightarrow x^2 + ${p}x - ${qv} = 0 \Rightarrow x = ${r}$ ή $x = ${-(r + p)}$. Η $x = ${-(r + p)}$ απορρίπτεται ($x > 0$), άρα $x = ${r}$.` }; }
    const a = ri(1, 4), b = ri(-5, 5), n = ri(1, 2), c = ri(1, 3), d = ri(-3, 6); /* log(ax+b) - log(cx+d) = n  => ax+b = 10^n (cx+d) */
    const k = 10 ** n, den = a - k * c; if (den === 0) return GENS.glogeq.make();
    const x = (k * d - b) / den; if (!(a * x + b > 0 && c * x + d > 0)) return GENS.glogeq.make();
    const bt = b === 0 ? "" : b > 0 ? ` + ${b}` : ` - ${-b}`, dt = d === 0 ? "" : d > 0 ? ` + ${d}` : ` - ${-d}`;
    return { q: R`Να λύσετε την εξίσωση $\log(${a === 1 ? "" : a}x${bt}) - \log(${c === 1 ? "" : c}x${dt}) = ${n}$.`, fields: [{ label: "x =", ans: fracS2(k * d - b, den) }],
      sol: R`$\log\frac{${a === 1 ? "" : a}x${bt}}{${c === 1 ? "" : c}x${dt}} = ${n} \Rightarrow ${a === 1 ? "" : a}x${bt} = ${k}(${c === 1 ? "" : c}x${dt}) \Rightarrow x = ${texFrac(k * d - b, den)}$. Ελέγχουμε ότι τα ορίσματα είναι θετικά: ισχύει, άρα η λύση είναι δεκτή.` };
  } },
  gcv: { title: "Γεννήτρια — συντελεστής μεταβολής", make() {
    const m1 = ri(20, 90), s1 = ri(2, 15), m2 = ri(20, 90), s2 = ri(2, 15), c1 = s1 / m1 * 100, c2 = s2 / m2 * 100;
    if (Math.abs(c1 - c2) < 0.5) return GENS.gcv.make();
    return { q: R`Για δύο δείγματα Α και Β δίνονται $\bar x_A = ${m1}$, $s_A = ${s1}$ και $\bar x_B = ${m2}$, $s_B = ${s2}$. Να υπολογίσετε τους συντελεστές μεταβολής (σε %, 2 δεκαδικά).`,
      fields: [{ label: "CV_A (%) =", ans: bkR2(c1), tol: 0.002 }, { label: "CV_B (%) =", ans: bkR2(c2), tol: 0.002 }],
      sol: R`$CV_A = \frac{${s1}}{${m1}} \approx ${bkD(c1)}\%$, $\ CV_B = \frac{${s2}}{${m2}} \approx ${bkD(c2)}\%$. Πιο ομοιογενές είναι το <b>${c1 < c2 ? "Α" : "Β"}</b> (μικρότερος CV)${Math.min(c1, c2) < 10 ? " — και είναι ομοιογενές γιατί CV < 10%" : ""}.` };
  } },
  gstem: { title: "Γεννήτρια — φυλλογράφημα", make() {
    const n = ri(9, 15), base = ri(1, 5), D = Array.from({ length: n }, () => ri(base * 10, base * 10 + 39)).sort((u, v) => u - v);
    const m = {}; D.forEach(v => (m[Math.floor(v / 10)] = m[Math.floor(v / 10)] || []).push(v % 10));
    const s0 = Math.floor(D[0] / 10), s1 = Math.floor(D[n - 1] / 10); let rows = ""; for (let s = s1; s >= s0; s--) rows += `<tr><th>${s}</th><td style="text-align:left;letter-spacing:.3em;font-family:monospace">${(m[s] || []).join("")}</td></tr>`;
    const q = quartHalves(D);
    return { q: R`Δίνεται το φυλλογράφημα (κλειδί: $${s0} \,|\, 4$ σημαίνει $${s0}4$):<table class="mini">${rows}</table>Να βρείτε τη διάμεσο, το πρώτο και το τρίτο τεταρτημόριο.`,
      fields: [{ label: "Q₁ =", ans: q.q1 }, { label: "διάμεσος =", ans: q.q2 }, { label: "Q₃ =", ans: q.q3 }],
      sol: R`Οι ${n} τιμές σε αύξουσα σειρά: ${D.join(", ")}. Διάμεσος $Q_2 = ${bkD(q.q2)}$. Κάτω μισό: ${q.lo.join(", ")} ⇒ $Q_1 = ${bkD(q.q1)}$. Πάνω μισό: ${q.hi.join(", ")} ⇒ $Q_3 = ${bkD(q.q3)}$.` };
  } },
  /* ---- Μέρος Β ---- */
  gside: { title: "Γεννήτρια — πλευρικά όρια", make() {
    const p1 = ri(1, 3), q1 = ri(-5, 5), p2 = ri(1, 3) + (ri(0, 1) ? 0 : 3), q2 = ri(-5, 5); if (p1 === p2) return GENS.gside.make();
    const x0 = ri(-3, 3), num = q2 - q1, den = p1 - p2, k = num / den;
    const f1 = bkLin(p1, q1, "\\kappa"), f2 = bkLin(p2, q2, "\\kappa");
    return { q: R`Για μια συνάρτηση $f$ ισχύουν $\lim_{x\to ${x0}^-} f(x) = ${f1}$ και $\lim_{x\to ${x0}^+} f(x) = ${f2}$. Να βρείτε την τιμή του $\kappa$ για την οποία υπάρχει το $\lim_{x\to ${x0}} f(x)$, καθώς και το όριο.`,
      fields: [{ label: "κ =", ans: fracS2(num, den) }, { label: "όριο =", ans: fracS2(p1 * num + q1 * den, den) }],
      sol: R`Το όριο υπάρχει όταν τα πλευρικά όρια είναι ίσα: $${f1} = ${f2} \Rightarrow \kappa = ${texFrac(num, den)}$. Τότε $\lim_{x\to ${x0}} f(x) = ${p1 === 1 ? "" : p1 + "\\cdot"}\left(${texFrac(num, den)}\right)${q1 ? ` ${q1 < 0 ? "-" : "+"} ${Math.abs(q1)}` : ""} = ${texFrac(p1 * num + q1 * den, den)}$.` };
  } },
  glim: { title: "Γεννήτρια — όρια ρητών συναρτήσεων", make() {
    const t = ri(0, 2), a = ri(-5, 5) || 3;
    const at = a < 0 ? `+ ${-a}` : `- ${a}`;
    if (t === 0) return { q: R`Να υπολογίσετε το όριο $\lim_{x\to ${a}} \dfrac{x^2 - ${a * a}}{x ${at}}$.`, fields: [{ label: "όριο =", ans: 2 * a }],
      sol: R`Για $x = ${a}$ προκύπτει $\frac00$. Παραγοντοποιούμε: $\frac{(x ${at})(x ${a < 0 ? "-" : "+"} ${Math.abs(a)})}{x ${at}} = x ${a < 0 ? "-" : "+"} ${Math.abs(a)}$, $x \ne ${a}$. Άρα το όριο είναι $${a} ${a < 0 ? "-" : "+"} ${Math.abs(a)} = ${2 * a}$.` };
    if (t === 1) { let b = ri(-5, 5); if (b === a) b = a + 1; const s = -(a + b), p = a * b;
      const poly = bkPolyTex([[1, 2], [s, 1], [p, 0]]);
      return { q: R`Να υπολογίσετε το όριο $\lim_{x\to ${a}} \dfrac{${poly}}{x ${at}}$.`, fields: [{ label: "όριο =", ans: a - b }],
        sol: R`$${poly} = ${b === 0 ? `x(x ${at})` : `(x ${at})(${bkLin(1, -b)})`}$, άρα για $x \ne ${a}$ η παράσταση ισούται με $${bkLin(1, -b)}$ και το όριο είναι $${b === 0 ? a : `${a} ${b < 0 ? "+" : "-"} ${Math.abs(b)} = ${a - b}`}$.` }; }
    const p1 = ri(-3, 3), q1 = ri(-5, 5), c = ri(1, 4), x0 = ri(-3, 3); if (x0 + c === 0) return GENS.glim.make();
    const num = x0 * x0 + p1 * x0 + q1, den = x0 + c;
    return { q: R`Να υπολογίσετε το όριο $\lim_{x\to ${x0}} \dfrac{${bkPolyTex([[1, 2], [p1, 1], [q1, 0]])}}{x + ${c}}$.`, fields: [{ label: "όριο =", ans: fracS2(num, den) }],
      sol: R`Ο παρονομαστής δεν μηδενίζεται στο $${x0}$ ($${x0} + ${c} = ${den}$), άρα αντικαθιστούμε $x = ${x0}$: το όριο είναι $${Math.abs(den) === 1 ? texFrac(num, den) : R`\frac{${num}}{${den}}${gcdI(num, den) > 1 || den < 0 ? ` = ${texFrac(num, den)}` : ""}`}$.` };
  } },
  glinf: { title: "Γεννήτρια — όρια στο άπειρο", make() {
    const n = ri(2, 5), a = (ri(1, 5)) * (ri(0, 1) ? 1 : -1), side = ri(0, 1) ? 1 : -1, cs = [[a, n], [ri(-6, 6), n - 1], [ri(-9, 9), 0]];
    const val = a * (side < 0 && n % 2 ? -1 : 1) > 0 ? 0 : 1;
    return bkMC({ q: R`Να υπολογίσετε το όριο $\lim_{x\to ${side > 0 ? "+" : "-"}\infty} (${bkPolyTex(cs)})$.`,
      sol: R`Στο άπειρο μετράει ο μεγιστοβάθμιος όρος: $\lim_{x\to ${side > 0 ? "+" : "-"}\infty} ${bkPolyTex([[a, n]])}$. ${side < 0 ? R`Για $x \to -\infty$ είναι $x^{${n}} \to ${n % 2 ? "-" : "+"}\infty$` : R`$x^{${n}} \to +\infty$`}, επί $${a}$: το όριο είναι $${val ? "-" : "+"}\infty$.` }, ["$+\\infty$", "$-\\infty$", "$0$", `$${a}$`], val);
  } },
  grate: { title: "Γεννήτρια — ρυθμός μεταβολής και παράγωγος αριθμός", make() {
    const a = ri(-3, 3) || 1, b = ri(-5, 5), c = ri(-5, 5), cs = [[a, 2], [b, 1], [c, 0]];
    if (ri(0, 1)) { const p = ri(-3, 2), q = p + ri(1, 3), r = (bkPolyEval(cs, q) - bkPolyEval(cs, p)) / (q - p);
      return { q: R`Δίνεται $f(x) = ${bkPolyTex(cs)}$. Να υπολογίσετε τον μέσο ρυθμό μεταβολής $\frac{\Delta y}{\Delta x}$ της $f$ στο διάστημα $[${p}, ${q}]$.`, fields: [{ label: "Δy/Δx =", ans: r }],
        sol: R`$\frac{f(${q}) - f(${p})}{${q} - (${p})} = \frac{${bkPolyEval(cs, q)} - (${bkPolyEval(cs, p)})}{${q - p}} = ${r}$.` }; }
    const x0 = ri(-3, 3), d = 2 * a * x0 + b;
    return { q: R`Με τη χρήση του ορισμού, να βρείτε τον παράγωγο αριθμό της $f(x) = ${bkPolyTex(cs)}$ στο $x_0 = ${x0}$.`, fields: [{ label: `f'(${x0}) =`, ans: d }],
      sol: R`$f(${x0}) = ${bkPolyEval(cs, x0)}$ και $f(${x0} + h) = ${bkPolyTex(cs).replace(/x/g, x0 ? `(${x0} + h)` : "h")}$, άρα $f(${x0} + h) - f(${x0}) = ${bkPolyTex([[a, 2], [d, 1]]).replace(/x/g, "h")}$. Άρα $\frac{f(${x0} + h) - f(${x0})}{h} = ${bkPolyTex([[a, 1], [d, 0]]).replace(/x/g, "h")} \to ${d}$ καθώς $h \to 0$: $f'(${x0}) = ${d}$.` };
  } },
  gderiv: { title: "Γεννήτρια — κανόνες παραγώγισης", make() {
    const t = ri(0, 2);
    if (t === 0) { const n = ri(3, 5), cs = [[ri(-4, 4) || 2, n], [ri(-5, 5), 2], [ri(-7, 7), 1], [ri(-9, 9), 0]], ds = bkPolyDer(cs);
      return { type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = ${bkPolyTex(cs)}$.`, ref: bkPolyStr(ds), key: bkPolyStr(ds), sol: R`Παραγωγίζουμε όρο-όρο με $(x^\nu)' = \nu x^{\nu - 1}$: $f'(x) = ${bkPolyTex(ds)}$.` }; }
    if (t === 1) { const a = ri(-4, 4) || 1, b = ri(-4, 4) || 2; /* (x+a)(x^2+b) */
      const ds = [[3, 2], [2 * a, 1], [b, 0]];
      return { type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = (x ${a < 0 ? "-" : "+"} ${Math.abs(a)})(x^2 ${b < 0 ? "-" : "+"} ${Math.abs(b)})$ με τον κανόνα του γινομένου.`, ref: bkPolyStr(ds), key: bkPolyStr(ds),
        sol: R`$f'(x) = 1\cdot(x^2 ${b < 0 ? "-" : "+"} ${Math.abs(b)}) + (x ${a < 0 ? "-" : "+"} ${Math.abs(a)})\cdot 2x = ${bkPolyTex(ds)}$.` }; }
    const a = ri(1, 5), b = ri(-5, 5) || -2; /* x/(x+b)  -> b/(x+b)^2 ;  (x+a)/(x+b) -> (b-a)/(x+b)^2 */ if (a === b) return GENS.gderiv.make();
    const k = b - a;
    return { type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = \dfrac{x + ${a}}{x ${b < 0 ? "-" : "+"} ${Math.abs(b)}}$, $x \ne ${-b}$.`, ref: `${k}/(x${b < 0 ? "-" : "+"}${Math.abs(b)})^2`, key: `${k}/(x${b < 0 ? "-" : "+"}${Math.abs(b)})^2`,
      sol: R`$f'(x) = \frac{1\cdot(x ${b < 0 ? "-" : "+"} ${Math.abs(b)}) - (x + ${a})\cdot 1}{(x ${b < 0 ? "-" : "+"} ${Math.abs(b)})^2} = \frac{${k}}{(x ${b < 0 ? "-" : "+"} ${Math.abs(b)})^2}$.` };
  } },
  gtan: { title: "Γεννήτρια — εξίσωση εφαπτομένης", make() {
    if (ri(0, 2)) { const cs = ri(0, 1) ? [[ri(-2, 2) || 1, 2], [ri(-5, 5), 1], [ri(-5, 5), 0]] : [[1, 3], [ri(-4, 4), 1], [ri(-4, 4), 0]], x0 = ri(-2, 2);
      const y0 = bkPolyEval(cs, x0), l = bkPolyEval(bkPolyDer(cs), x0), b = y0 - l * x0;
      return { q: R`Να βρείτε την εξίσωση της εφαπτομένης της γραφικής παράστασης της $f(x) = ${bkPolyTex(cs)}$ στο σημείο της με τετμημένη $x_0 = ${x0}$, στη μορφή $y = \lambda x + \beta$.`,
        fields: [{ label: "λ =", ans: l }, { label: "β =", ans: b }],
        sol: R`$f(${x0}) = ${y0}$, $f'(x) = ${bkPolyTex(bkPolyDer(cs))}$, $\lambda = f'(${x0}) = ${l}$. $${y0 ? `y ${y0 < 0 ? "+" : "-"} ${Math.abs(y0)}` : "y"} = ${l === 1 ? "" : l === -1 ? "-" : l}${x0 ? `(${bkLin(1, -x0)})` : "x"} \Rightarrow y = ${bkLin(l, b)}$.` }; }
    const a = ri(-3, 3) || 1, b = ri(-6, 6), c = ri(-5, 5), k = ri(-6, 6); const num = k - b, den = 2 * a, X = num / den, Y = a * X * X + b * X + c;
    return { q: R`Σε ποιο σημείο της γραφικής παράστασης της $f(x) = ${bkPolyTex([[a, 2], [b, 1], [c, 0]])}$ η κλίση της ισούται με $${k}$;`,
      fields: [{ label: "x =", ans: fracS2(num, den) }, { label: "y =", ans: fracS2(a * num * num + b * num * den + c * den * den, den * den) }],
      sol: R`$f'(x) = ${bkPolyTex([[2 * a, 1], [b, 0]])} = ${k} \Rightarrow x = ${texFrac(num, den)}$ και $y = f\left(${texFrac(num, den)}\right) = ${texFrac(a * num * num + b * num * den + c * den * den, den * den)}$.` };
  } },
  gseq: { title: "Γεννήτρια — όροι ακολουθίας", make() {
    if (true) { const p = ri(1, 3), q = ri(-4, 4), r = ri(-6, 6), k = ri(3, 12), cs = [[p, 2], [q, 1], [r, 0]];
      return { q: R`Δίνεται η ακολουθία $\alpha_\nu = ${bkPolyTex(cs).replace(/x/g, "\\nu")}$, $\nu \in \mathbb{N}$. Να υπολογίσετε τον όρο $\alpha_{${k}}$.`, fields: [{ label: `α_${k} =`, ans: bkPolyEval(cs, k) }],
        sol: R`$\alpha_{${k}} = ${bkPolyTex([[p, 2], [q, 1], [r, 0]]).replace("x^{2}", `\\cdot ${k}^2`).replace(/x/, `\\cdot ${k}`).replace(/(^|[+-] )1\\cdot /g, "$1").replace(/^\\cdot /, "").replace(/([+-] )\\cdot /g, "$1")} = ${bkPolyEval(cs, k)}$.` }; }
    const n = ri(3, 12), b = ri(-2, 4), c = ri(-5, 5), v = n * n + b * n + c;
    return { q: R`Δίνεται η ακολουθία $\alpha_\nu = ${bkPolyTex([[1, 2], [b, 1], [c, 0]]).replace(/x/g, "\\nu")}$. Σε ποια θέση $\nu$ βρίσκεται ο όρος $${v}$;`, fields: [{ label: "ν =", ans: n }],
      sol: R`$${bkPolyTex([[1, 2], [b, 1], [c - v, 0]]).replace(/x/g, "\\nu")} = 0 \Rightarrow \nu = ${n}$ ή $\nu = ${-b - n}$· κρατάμε τη λύση που είναι θετικός ακέραιος, $\nu = ${n}$.` };
  } },
  gap: { title: "Γεννήτρια — αριθμητική πρόοδος", make() {
    const t = ri(0, 2), a1 = ri(-10, 12), d = ri(-5, 6) || 3;
    if (t === 0) { const n = ri(8, 40), an = a1 + (n - 1) * d, S = n * (a1 + an) / 2;
      return { q: R`Σε αριθμητική πρόοδο είναι $\alpha_1 = ${a1}$ και $\delta = ${d}$. Να υπολογίσετε τον $\alpha_{${n}}$ και το άθροισμα $\Sigma_{${n}}$ των ${n} πρώτων όρων.`,
        fields: [{ label: `α_${n} =`, ans: an }, { label: `Σ_${n} =`, ans: S }],
        sol: R`$\alpha_{${n}} = \alpha_1 + (${n} - 1)\delta = ${a1} + ${n - 1}\cdot(${d}) = ${an}$. $\Sigma_{${n}} = \frac{${n}}{2}(\alpha_1 + \alpha_{${n}}) = \frac{${n}}{2}(${a1} + (${an})) = ${S}$.` }; }
    if (t === 1) { const p = ri(2, 6), q = p + ri(2, 8), ap = a1 + (p - 1) * d, aq = a1 + (q - 1) * d;
      return { q: R`Σε αριθμητική πρόοδο είναι $\alpha_{${p}} = ${ap}$ και $\alpha_{${q}} = ${aq}$. Να βρείτε τη διαφορά $\delta$ και τον πρώτο όρο $\alpha_1$.`,
        fields: [{ label: "δ =", ans: d }, { label: "α₁ =", ans: a1 }],
        sol: R`$\alpha_{${q}} - \alpha_{${p}} = ${q - p}\delta \Rightarrow ${aq - ap} = ${q - p}\delta \Rightarrow \delta = ${d}$. $\alpha_1 = \alpha_{${p}} - ${p - 1}\delta = ${ap} - (${(p - 1) * d}) = ${a1}$.` }; }
    const x = ri(-6, 8), p1 = ri(1, 3), q1 = ri(-5, 5), p3 = ri(1, 4), q3 = ri(-5, 5);
    /* α = p1 x + q1, β = ?, γ = p3 x + q3 :   2β = α + γ  → δίνουμε β = m x + r με 2m ≠ p1 + p3 */
    const m = ri(1, 4); if (2 * m === p1 + p3) return GENS.gap.make();
    const r2 = p1 * x + q1 + p3 * x + q3 - 2 * m * x; if (r2 % 2) return GENS.gap.make(); const r = r2 / 2;
    const lin = (k, c) => bkLin(k, c);
    return { q: R`Να βρείτε την τιμή του $x$ ώστε οι αριθμοί $${lin(p1, q1)}$, $${lin(m, r)}$, $${lin(p3, q3)}$ να είναι διαδοχικοί όροι αριθμητικής προόδου.`, fields: [{ label: "x =", ans: x }],
      sol: R`Πρέπει $2\beta = \alpha + \gamma$: $2(${lin(m, r)}) = ${lin(p1, q1)} + ${lin(p3, q3)} \Rightarrow ${bkLin(2 * m, 2 * r)} = ${bkLin(p1 + p3, q1 + q3)} \Rightarrow x = ${x}$.` };
  } },
  ggp: { title: "Γεννήτρια — γεωμετρική πρόοδος", make() {
    const t = ri(0, 2);
    if (t === 0) { const a1 = (ri(1, 5)) * (ri(0, 3) ? 1 : -1), l = bkPick([2, 3, -2, -3]), n = ri(4, 8), an = a1 * l ** (n - 1), S = a1 * (l ** n - 1) / (l - 1);
      return { q: R`Σε γεωμετρική πρόοδο είναι $\alpha_1 = ${a1}$ και $\lambda = ${l}$. Να υπολογίσετε τον $\alpha_{${n}}$ και το άθροισμα $\Sigma_{${n}}$.`,
        fields: [{ label: `α_${n} =`, ans: an }, { label: `Σ_${n} =`, ans: S }],
        sol: R`$\alpha_{${n}} = \alpha_1\lambda^{${n - 1}} = ${a1}\cdot(${l})^{${n - 1}} = ${an}$. $\Sigma_{${n}} = \alpha_1\frac{\lambda^{${n}} - 1}{\lambda - 1} = ${a1}\cdot\frac{${l ** n} - 1}{${l - 1}} = ${S}$.` }; }
    if (t === 1) { const a1 = ri(2, 30), p = ri(1, 4) * (ri(0, 1) ? 1 : -1), q = ri(2, 5); if (Math.abs(p) >= q || gcdI(p, q) > 1) return GENS.ggp.make();
      return { q: R`Να υπολογίσετε το άθροισμα των άπειρων όρων της γεωμετρικής προόδου με $\alpha_1 = ${a1}$ και $\lambda = ${texFrac(p, q)}$.`, fields: [{ label: "Σ∞ =", ans: fracS2(a1 * q, q - p) }],
        sol: R`Αφού $|\lambda| < 1$: $\Sigma_\infty = \frac{\alpha_1}{1 - \lambda} = \frac{${a1}}{1 - \left(${texFrac(p, q)}\right)} = \frac{${a1}}{${texFrac(q - p, q)}} = ${texFrac(a1 * q, q - p)}$.` }; }
    const a1 = ri(1, 5), l = bkPick([2, 3, 4]), p = ri(1, 3), q = p + 2, ap = a1 * l ** (p - 1), aq = a1 * l ** (q - 1);
    return { q: R`Γεωμετρική πρόοδος με <b>θετικούς</b> όρους έχει $\alpha_{${p}} = ${ap}$ και $\alpha_{${q}} = ${aq}$. Να βρείτε τον λόγο $\lambda$ και τον $\alpha_1$.`,
      fields: [{ label: "λ =", ans: l }, { label: "α₁ =", ans: a1 }],
      sol: R`$\frac{\alpha_{${q}}}{\alpha_{${p}}} = \lambda^2 = ${l * l} \Rightarrow \lambda = ${l}$ (θετικοί όροι). $\alpha_1 = \frac{\alpha_{${p}}}{\lambda^{${p - 1}}} = ${a1}$.` };
  } },
  gcyc: { title: "Γεννήτρια — εγγεγραμμένο τετράπλευρο", make() {
    const A = ri(50, 130), B = ri(50, 130);
    if (ri(0, 1)) return { q: R`Το τετράπλευρο $AB\Gamma\Delta$ είναι εγγεγραμμένο σε κύκλο με $\hat A = ${A}^\circ$ και $\hat B = ${B}^\circ$. Να υπολογίσετε τις γωνίες $\hat\Gamma$ και $\hat\Delta$.`,
      fields: [{ label: "Γ̂ (°) =", ans: 180 - A }, { label: "Δ̂ (°) =", ans: 180 - B }],
      sol: R`Στο εγγεγραμμένο τετράπλευρο οι απέναντι γωνίες είναι παραπληρωματικές: $\hat\Gamma = 180^\circ - ${A}^\circ = ${180 - A}^\circ$, $\hat\Delta = 180^\circ - ${B}^\circ = ${180 - B}^\circ$.` };
    return { q: R`Σε εγγεγραμμένο τετράπλευρο $AB\Gamma\Delta$ η εξωτερική γωνία στην κορυφή $\Gamma$ είναι $${A}^\circ$. Να υπολογίσετε τη γωνία $\hat A$ και τη γωνία $\hat\Gamma$.`,
      fields: [{ label: "Â (°) =", ans: A }, { label: "Γ̂ (°) =", ans: 180 - A }],
      sol: R`Η εξωτερική γωνία του εγγεγραμμένου τετραπλεύρου ισούται με την απέναντι εσωτερική: $\hat A = ${A}^\circ$. Τότε $\hat\Gamma = 180^\circ - ${A}^\circ = ${180 - A}^\circ$.` };
  } },
  gpoly: { title: "Γεννήτρια — κανονικά πολύγωνα", make() {
    const ns = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36], n = bkPick(ns);
    if (ri(0, 1)) return { q: R`Να βρείτε τη γωνία $\varphi_\nu$ κανονικού πολυγώνου με $\nu = ${n}$ πλευρές.`,
      fields: [{ label: "φ (°) =", ans: 180 - 360 / n }],
      sol: R`$\varphi_{${n}} = 180^\circ - \frac{360^\circ}{${n}} = ${bkD(180 - 360 / n)}^\circ$.` };
    return { q: R`Η γωνία ενός κανονικού πολυγώνου είναι $${bkD(180 - 360 / n)}^\circ$. Πόσες πλευρές έχει;`, fields: [{ label: "ν =", ans: n }],
      sol: R`$180^\circ - \frac{360^\circ}{\nu} = ${bkD(180 - 360 / n)}^\circ \Rightarrow \frac{360^\circ}{\nu} = ${bkD(360 / n)}^\circ \Rightarrow \nu = ${n}$.` };
  } },
  garc: { title: "Γεννήτρια — μήκος τόξου, εμβαδόν τομέα", make() {
    const R0 = ri(2, 12), m = bkPick([30, 36, 40, 45, 60, 72, 90, 120, 135, 150, 180, 210, 240, 270, 300]);
    const pf = (p, q) => { const g = gcdI(p, q); p /= g; q /= g; return (p === 1 ? "" : p) + "π" + (q === 1 ? "" : "/" + q); };
    const pt = (p, q) => { const g = gcdI(p, q); p /= g; q /= g; return q === 1 ? `${p === 1 ? "" : p}\\pi` : `\\frac{${p === 1 ? "" : p}\\pi}{${q}}`; };
    if (ri(0, 2)) return { q: R`Σε κύκλο ακτίνας $R = ${R0}$ cm, να υπολογίσετε το μήκος του τόξου και το εμβαδόν του κυκλικού τομέα που αντιστοιχούν σε επίκεντρη γωνία $${m}^\circ$ (γράψτε π.χ. <code>4π</code> ή <code>3π/2</code>).`,
      fields: [{ label: "ℓ (cm) =", ans: pf(R0 * m, 180), tol: 0.003 }, { label: "Ε (cm²) =", ans: pf(R0 * R0 * m, 360), tol: 0.003 }],
      sol: R`$\ell = \frac{\pi R\mu}{180} = \frac{\pi\cdot${R0}\cdot${m}}{180} = ${pt(R0 * m, 180)}$ cm, $\ E = \frac{\pi R^2\mu}{360} = \frac{\pi\cdot${R0 * R0}\cdot${m}}{360} = ${pt(R0 * R0 * m, 360)}$ cm².` };
    return { q: R`Τόξο κύκλου ακτίνας $R = ${R0}$ cm έχει μήκος $${pt(R0 * m, 180)}$ cm. Να βρείτε το μέτρο του σε μοίρες.`, fields: [{ label: "μ (°) =", ans: m }],
      sol: R`$\ell = \frac{\pi R\mu}{180} \Rightarrow \mu = \frac{180\,\ell}{\pi R} = \frac{180\cdot ${pt(R0 * m, 180)}}{${R0}\pi} = ${m}^\circ$.` };
  } }
});

/* ================= Βοηθητικά Β΄ τεύχους ================= */
const fact = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
const nPk = (n, k) => k > n ? 0 : fact(n) / fact(n - k);
const nCk = (n, k) => k > n ? 0 : Math.round(fact(n) / (fact(k) * fact(n - k)));
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const frac = (a, b) => { const g = gcd(a, b); return [a / g, b / g]; };
const fracS = (a, b) => { const [p, q] = frac(a, b); return q === 1 ? `${p}` : `${p}/${q}`; };
const fracT = (a, b) => { const [p, q] = frac(a, b); return q === 1 ? `${p}` : `\\frac{${p}}{${q}}`; };
const piT = (a, b = 1) => { const [p, q] = frac(a, b); return q === 1 ? `${p}\\pi` : `\\frac{${p}\\pi}{${q}}`; };
const median = arr => { const n = arr.length, m = Math.floor(n / 2); return n % 2 ? arr[m] : (arr[m - 1] + arr[m]) / 2; };
function quartiles(data) {
  const d = [...data].sort((a, b) => a - b), n = d.length;
  const lo = d.slice(0, Math.floor(n / 2)), hi = d.slice(Math.ceil(n / 2));
  return { d, lo, hi, q1: median(lo), q2: median(d), q3: median(hi) };
}
function stats(xs) { const n = xs.length, m = xs.reduce((a, b) => a + b, 0) / n, v = xs.reduce((a, x) => a + (x - m) ** 2, 0) / n; return { n, m, v, s: Math.sqrt(v) }; }
function corr(xs, ys) {
  const n = xs.length, X = stats(xs), Y = stats(ys), sxy = xs.reduce((a, x, i) => a + x * ys[i], 0);
  return { r: (sxy - n * X.m * Y.m) / (n * X.s * Y.s), sxy, X, Y };
}
function rLabel(r) {
  if (!isFinite(r)) return "δεν ορίζεται (σταθερή μεταβλητή)";
  const a = Math.abs(r);
  if (a > 0.9999) return r > 0 ? "τέλεια θετική" : "τέλεια αρνητική";
  if (a < 0.05) return "μηδενική (καμία γραμμική)";
  if (a > 0.7) return r > 0 ? "ισχυρή θετική" : "ισχυρή αρνητική";
  return r > 0 ? "ασθενής θετική" : "ασθενής αρνητική";
}
const LET = ["Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ"];

/* ================= Widgets ================= */
var WIDGETS = Object.assign(window.WIDGETS || {}, {
  venn(box) {
    const ops = [
      ["A ∪ B", [1, 1, 1, 0]], ["A ∩ B", [0, 1, 0, 0]], ["A − B", [1, 0, 0, 0]], ["B − A", [0, 0, 1, 0]],
      ["A′", [0, 0, 1, 1]], ["(A ∪ B)′", [0, 0, 0, 1]], ["(A ∩ B)′", [1, 0, 1, 1]], ["A′ ∪ B′", [1, 0, 1, 1]], ["A′ ∩ B′", [0, 0, 0, 1]]];
    box.innerHTML = `<div class="wctl chips">${ops.map((o, i) => `<button class="chip" data-i="${i}">${o[0]}</button>`).join("")}</div>
      <div class="two"><div class="vsvg"></div><div>
      <div class="wctl col"><label>ν(Ω) <input type="range" class="rO" min="10" max="60" value="40"><b class="vO"></b></label>
      <label>ν(A) <input type="range" class="rA" min="0" max="30" value="18"><b class="vA"></b></label>
      <label>ν(B) <input type="range" class="rB" min="0" max="30" value="12"><b class="vB"></b></label>
      <label>ν(A∩B) <input type="range" class="rX" min="0" max="30" value="5"><b class="vX"></b></label></div></div></div><div class="wout"></div>`;
    let cur = 0;
    const g = (c) => $(c, box);
    function draw() {
      let O = +g(".rO").value, A = +g(".rA").value, B = +g(".rB").value, X = +g(".rX").value;
      X = Math.min(X, A, B); g(".rX").value = X;
      if (A + B - X > O) { O = A + B - X; g(".rO").value = O; }
      [["O", O], ["A", A], ["B", B], ["X", X]].forEach(([k, v]) => g(".v" + k).textContent = v);
      const cnt = [A - X, X, B - X, O - (A + B - X)], on = ops[cur][1], uid = "v" + Math.random().toString(36).slice(2, 7);
      const reg = i => on[i] ? "var(--blue)" : "transparent";
      g(".vsvg").innerHTML = `<svg viewBox="0 0 320 210" class="plot"><defs>
        <clipPath id="${uid}a"><circle cx="125" cy="108" r="70"/></clipPath>
        <mask id="${uid}nb"><rect width="320" height="210" fill="#fff"/><circle cx="195" cy="108" r="70" fill="#000"/></mask>
        <mask id="${uid}na"><rect width="320" height="210" fill="#fff"/><circle cx="125" cy="108" r="70" fill="#000"/></mask>
        <mask id="${uid}no"><rect width="320" height="210" fill="#fff"/><circle cx="125" cy="108" r="70" fill="#000"/><circle cx="195" cy="108" r="70" fill="#000"/></mask></defs>
        <rect x="6" y="6" width="308" height="198" rx="10" fill="${reg(3)}" fill-opacity=".28" mask="url(#${uid}no)" stroke="var(--navy)"/>
        <circle cx="125" cy="108" r="70" fill="${reg(0)}" fill-opacity=".38" mask="url(#${uid}nb)"/>
        <circle cx="195" cy="108" r="70" fill="${reg(2)}" fill-opacity=".38" mask="url(#${uid}na)"/>
        <circle cx="195" cy="108" r="70" fill="${reg(1)}" fill-opacity=".55" clip-path="url(#${uid}a)"/>
        <circle cx="125" cy="108" r="70" fill="none" stroke="var(--navy)" stroke-width="2"/><circle cx="195" cy="108" r="70" fill="none" stroke="var(--navy)" stroke-width="2"/>
        <text x="70" y="45" class="lbl d2">A</text><text x="243" y="45" class="lbl d2">B</text><text x="20" y="28" class="lbl d2">Ω</text>
        <text x="95" y="113" class="vnum">${cnt[0]}</text><text x="160" y="113" class="vnum">${cnt[1]}</text><text x="225" y="113" class="vnum">${cnt[2]}</text><text x="280" y="190" class="vnum">${cnt[3]}</text></svg>`;
      const val = cnt.reduce((a, c, i) => a + (on[i] ? c : 0), 0);
      g(".wout").innerHTML = `<b>${ops[cur][0]}</b>: ν = <b>${val}</b> &nbsp;·&nbsp; Αρχή εγκλεισμού–αποκλεισμού: ν(A ∪ B) = ${A} + ${B} − ${X} = <b>${A + B - X}</b>
        <br><span class="muted">Σύγκρινε (A ∪ B)′ με A′ ∩ B′ και (A ∩ B)′ με A′ ∪ B′ — νόμοι De Morgan!</span>`;
      box.querySelectorAll(".chip").forEach((c, i) => c.classList.toggle("on", i === cur));
    }
    box.querySelectorAll(".chip").forEach(c => c.onclick = () => { cur = +c.dataset.i; draw(); });
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  tree(box) {
    box.innerHTML = `<div class="wctl"><label>Φάση 1 (π.χ. ορεκτικά) <input type="range" class="s1" min="1" max="4" value="3"><b class="v1"></b></label>
      <label>Φάση 2 (κυρίως) <input type="range" class="s2" min="1" max="4" value="2"><b class="v2"></b></label>
      <label>Φάση 3 (επιδόρπια) <input type="range" class="s3" min="1" max="3" value="2"><b class="v3"></b></label></div>
      <div class="tsvg"></div><div class="wout"></div>`;
    function draw() {
      const n = [1, 2, 3].map(i => +$(".s" + i, box).value); n.forEach((v, i) => $(".v" + (i + 1), box).textContent = v);
      const leaves = n[0] * n[1] * n[2], W = 640, H = Math.max(160, leaves * 11 + 20), cols = [30, 200, 380, 560];
      let s = `<svg viewBox="0 0 ${W} ${H}" class="plot">`;
      const ly = i => 10 + (i + 0.5) * (H - 20) / leaves;
      let leaf = 0;
      (function walk(level, y0, path) {
        if (level === 3) { s += `<circle cx="${cols[3]}" cy="${y0}" r="3.5" class="dot dmin"/>` + (leaves <= 24 ? `<text x="${cols[3] + 8}" y="${y0 + 4}" class="tick">${path}</text>` : ""); return; }
        const span = n.slice(level + 1).reduce((a, b) => a * b, 1);
        for (let k = 0; k < n[level]; k++) {
          const start = leaf, yc = (ly(start) + ly(start + span - 1)) / 2;
          s += `<line x1="${cols[level]}" y1="${y0}" x2="${cols[level + 1]}" y2="${yc}" stroke="${["#2E75B6", "#6F42C1", "#C77A0A"][level]}" stroke-width="1.6"/>`;
          if (level === 2) { walk(3, yc, path + "ε" + (k + 1)); leaf++; } else walk(level + 1, yc, path + ["α", "κ"][level] + (k + 1) + "·");
        }
      })(0, H / 2, "");
      s += `<circle cx="${cols[0]}" cy="${H / 2}" r="5" class="dot d2"/></svg>`;
      $(".tsvg", box).innerHTML = s;
      $(".wout", box).innerHTML = `Κάθε «κλαδί» από την αρχή ως το τέλος είναι ένα γεύμα. Τελικά σημεία: <b>${n[0]} · ${n[1]} · ${n[2]} = ${leaves}</b> — πολλαπλασιαστική αρχή!`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  comb(box) {
    const T = [
      ["perm", "Μεταθέσεις Μ_ν = ν!"], ["circ", "Κυκλικές Κ_ν = (ν−1)!"], ["arr", "Διατάξεις Δ^ν_κ"],
      ["rarr", "Επαναληπτικές διατάξεις ν^κ"], ["comb", "Συνδυασμοί C(ν, κ)"], ["word", "Αναγραμματισμοί λέξης"]];
    box.innerHTML = `<div class="wctl"><label>Είδος <select class="ty">${T.map(t => `<option value="${t[0]}">${t[1]}</option>`).join("")}</select></label>
      <label class="nl">ν <input type="range" class="rn" min="1" max="8" value="4"><b class="vn"></b></label>
      <label class="kl">κ <input type="range" class="rk" min="0" max="8" value="2"><b class="vk"></b></label>
      <label class="wl">λέξη <input type="text" class="wd" value="ΚΑΚΑΟ" maxlength="9" style="width:120px;font:inherit;padding:5px 8px;border-radius:8px;border:1px solid var(--line)"></label></div>
      <div class="cform"></div><div class="clist"></div>`;
    const ty = $(".ty", box), rn = $(".rn", box), rk = $(".rk", box), wd = $(".wd", box);
    function gen(items, k, rep, ordered) {
      const out = [];
      (function rec(cur, start, used) {
        if (out.length > 400) return;
        if (cur.length === k) { out.push(cur.join("")); return; }
        for (let i = ordered ? 0 : start; i < items.length; i++) {
          if (!rep && used[i]) continue;
          used[i] = true; rec([...cur, items[i]], rep ? i : i + 1, used); used[i] = false;
        }
      })([], 0, []);
      return out;
    }
    function draw() {
      const t = ty.value, n = +rn.value; rk.max = t === "rarr" ? 5 : n; let k = Math.min(+rk.value, +rk.max); rk.value = k;
      $(".vn", box).textContent = n; $(".vk", box).textContent = k;
      $(".kl", box).style.display = ["arr", "rarr", "comb"].includes(t) ? "" : "none";
      $(".nl", box).style.display = t === "word" ? "none" : ""; $(".wl", box).style.display = t === "word" ? "" : "none";
      const items = LET.slice(0, n); let tex = "", val = 0, list = [], note = "";
      if (t === "perm") { val = fact(n); tex = `M_{${n}} = ${n}! = ${val}`; list = gen(items, n, false, true); note = "Κάθε σειρά είναι διαφορετική."; }
      if (t === "circ") { val = fact(n - 1); tex = `K_{${n}} = (${n}-1)! = ${n - 1}! = ${val}`; list = gen(items.slice(1), n - 1, false, true).map(s => items[0] + s); note = `Κρατάμε το ${items[0]} «σταθερό» (σε κύκλο δεν υπάρχει πρώτη θέση) και μεταθέτουμε τα υπόλοιπα.`; }
      if (t === "arr") { val = nPk(n, k); tex = `\\Delta^{${n}}_{${k}} = \\frac{${n}!}{(${n}-${k})!} = ${val}`; list = gen(items, k, false, true); note = "Η σειρά μετράει: ΑΒ ≠ ΒΑ."; }
      if (t === "rarr") { val = n ** k; tex = `${n}^{${k}} = ${val}`; list = gen(items, k, true, true); note = "Κάθε θέση έχει ν επιλογές — επιτρέπεται επανάληψη."; }
      if (t === "comb") { val = nCk(n, k); tex = `\\binom{${n}}{${k}} = \\frac{${n}!}{${k}!\\,(${n}-${k})!} = ${val}`; list = gen(items, k, false, false); note = "Η σειρά δεν μετράει: {Α,Β} = {Β,Α}."; }
      if (t === "word") {
        const w = (wd.value || "Α").toUpperCase().replace(/[^Α-ΩA-ZΆΈΉΊΌΎΏ]/g, "").slice(0, 9) || "Α";
        const c = {}; for (const ch of w) c[ch] = (c[ch] || 0) + 1;
        const reps = Object.values(c).filter(v => v > 1);
        val = fact(w.length) / reps.reduce((a, v) => a * fact(v), 1);
        tex = reps.length ? `\\frac{${w.length}!}{${reps.map(v => v + "!").join("\\,")}} = ${val}` : `${w.length}! = ${val}`;
        const seen = new Set(); (function rec(cur, rest) { if (seen.size > 400) return; if (!rest.length) { seen.add(cur); return; } const tried = new Set(); for (let i = 0; i < rest.length; i++) { if (tried.has(rest[i])) continue; tried.add(rest[i]); rec(cur + rest[i], rest.slice(0, i) + rest.slice(i + 1)); } })("", w);
        list = [...seen]; note = reps.length ? "Τα ίδια γράμματα δεν δίνουν νέο αναγραμματισμό όταν ανταλλάσσονται μεταξύ τους." : "Όλα τα γράμματα διαφορετικά ⇒ απλές μεταθέσεις.";
      }
      $(".cform", box).innerHTML = `<div class="wout" style="margin-top:0">$$${tex}$$<span class="muted">${note}</span></div>`;
      const show = list.slice(0, 120);
      $(".clist", box).innerHTML = val <= 400 ? `<div class="cap">Όλες οι περιπτώσεις (${list.length}${list.length > show.length ? ", εμφανίζονται οι πρώτες 120" : ""}):</div><div class="pills">${show.map(s => `<span>${s || "∅"}</span>`).join("")}</div>` : `<div class="cap">Πάρα πολλές περιπτώσεις για να εμφανιστούν (${val.toLocaleString("el-GR")}) — γι' αυτό χρειαζόμαστε τύπους!</div>`;
      typeset(box);
    }
    ty.onchange = rn.oninput = rk.oninput = wd.oninput = draw; draw();
  },

  dice(box) {
    box.innerHTML = `<div class="wctl"><label>Ενδεχόμενο: άθροισμα = <select class="ts">${[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(s => `<option ${s === 7 ? "selected" : ""}>${s}</option>`).join("")}</select></label>
      <button class="btn primary small" data-n="1">Ρίξε 1</button><button class="btn ghost small" data-n="100">+100</button><button class="btn ghost small" data-n="1000">+1000</button><button class="btn ghost small rs">Μηδενισμός</button></div>
      <div class="dlast"></div><div class="pl"></div><div class="wout"></div>`;
    let cnt = Array(13).fill(0), N = 0, last = null;
    const pips = v => ({ 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]] })[v];
    const die = v => `<svg viewBox="0 0 60 60" width="46" height="46"><rect x="3" y="3" width="54" height="54" rx="10" fill="#fff" stroke="var(--navy)" stroke-width="2.5"/>${pips(v).map(([c, r]) => `<circle cx="${15 + c * 15}" cy="${15 + r * 15}" r="5" fill="var(--navy)"/>`).join("")}</svg>`;
    function roll(k) { for (let i = 0; i < k; i++) { const a = ri(1, 6), b = ri(1, 6); cnt[a + b]++; N++; last = [a, b]; } draw(); }
    function draw() {
      const s = +$(".ts", box).value, ways = 6 - Math.abs(s - 7);
      $(".dlast", box).innerHTML = last ? `<div class="dice">${die(last[0])}${die(last[1])}<span>άθροισμα <b>${last[0] + last[1]}</b></span></div>` : "";
      const P = makePlot($(".pl", box), { xmin: 1.4, xmax: 12.6, ymin: 0, ymax: 0.22, H: 230, ystep: 0.05 });
      for (let v = 2; v <= 12; v++) {
        const th = (6 - Math.abs(v - 7)) / 36, fr = N ? cnt[v] / N : 0;
        P.layer.appendChild(svgEl("rect", { x: P.sx(v - 0.38), y: P.sy(fr), width: P.sx(v + 0.38) - P.sx(v - 0.38), height: Math.max(0, P.sy(0) - P.sy(fr)), fill: v === s ? "var(--amber)" : "var(--blue)", opacity: 0.8 }));
        P.seg(v - 0.42, th, v + 0.42, th, "theo");
      }
      $(".wout", box).innerHTML = `Ρίψεις: <b>${N}</b> · Σχετική συχνότητα «άθροισμα ${s}»: <b>${N ? fmt(cnt[s] / N * 100) : 0}%</b> · Θεωρητική πιθανότητα: <b>${ways}/36 ≈ ${fmt(ways / 36 * 100)}%</b>
        <br><span class="muted">Οι μπάρες είναι οι συχνότητες, οι κόκκινες γραμμές οι πιθανότητες. Με πολλές ρίψεις πλησιάζουν μεταξύ τους — νόμος των μεγάλων αριθμών.</span>`;
    }
    box.querySelectorAll("button[data-n]").forEach(b => b.onclick = () => roll(+b.dataset.n));
    $(".rs", box).onclick = () => { cnt = Array(13).fill(0); N = 0; last = null; draw(); };
    $(".ts", box).onchange = draw; draw();
  },

  table2(box) {
    box.innerHTML = `<div class="cap">Συμπλήρωσε τον πίνακα πλήθους (π.χ. 100 μαθητές). A = «παίζει όργανο», B = «κορίτσι».</div>
      <div class="tblwrap"><table class="vt t2"><tr><th></th><th>B (κορίτσι)</th><th>B′ (αγόρι)</th><th>Σύνολο</th></tr>
      <tr><th>A (όργανο)</th><td><input class="c11" value="30"></td><td><input class="c12" value="10"></td><td class="s1"></td></tr>
      <tr><th>A′ (όχι)</th><td><input class="c21" value="30"></td><td><input class="c22" value="30"></td><td class="s2"></td></tr>
      <tr><th>Σύνολο</th><td class="t1"></td><td class="t2c"></td><td class="tt"></td></tr></table></div>
      <div class="wout"></div>`;
    function draw() {
      const v = ["c11", "c12", "c21", "c22"].map(c => Math.max(0, Math.round(+$("." + c, box).value || 0)));
      const [a, b, c, d] = v, N = a + b + c + d;
      $(".s1", box).textContent = a + b; $(".s2", box).textContent = c + d; $(".t1", box).textContent = a + c; $(".t2c", box).textContent = b + d; $(".tt", box).textContent = N;
      if (!N || !(a + c)) { $(".wout", box).textContent = "Βάλε θετικούς αριθμούς."; return; }
      const PA = (a + b) / N, PB = (a + c) / N, PAB = a / N, PAgB = a / (a + c);
      const ind = Math.abs(PAB - PA * PB) < 1e-9;
      $(".wout", box).innerHTML = `P(A) = ${fracS(a + b, N)} ≈ ${fmt(PA)} · P(B) = ${fracS(a + c, N)} · P(A ∩ B) = ${fracS(a, N)}
        <br><b>P(A | B) = ${a}/${a + c} ≈ ${fmt(PAgB)}</b> — μετράμε μόνο μέσα στη στήλη B.
        <br>P(A)·P(B) ≈ ${fmt(PA * PB)} ${ind ? "= P(A∩B) ⇒ <b class='ok'>ανεξάρτητα</b>" : "≠ P(A∩B) ⇒ <b class='bad'>όχι ανεξάρτητα</b>"}
        <br><span class="muted">Δοκίμασε 20, 20, 30, 30: τότε P(A|B) = P(A) και τα ενδεχόμενα γίνονται ανεξάρτητα.</span>`;
    }
    box.querySelectorAll("input").forEach(i => { i.type = "number"; i.min = 0; i.oninput = draw; }); draw();
  },

  quart(box) {
    box.innerHTML = `<div class="wctl"><label style="flex:1">Δεδομένα (χωρισμένα με κόμμα · δεκαδικά με τελεία)<input type="text" class="qd" value="181, 210, 193, 197, 196, 205, 189, 204, 193, 199, 205, 187" style="width:100%;font:inherit;font-weight:400;padding:8px 10px;border-radius:9px;border:1px solid var(--line)"></label></div>
      <div class="qsorted"></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const data = $(".qd", box).value.split(/[\s,;]+/).map(s => parseFloat(s)).filter(Number.isFinite);
      if (data.length < 4) { $(".wout", box).textContent = "Δώσε τουλάχιστον 4 τιμές."; return; }
      const Q = quartiles(data), S = stats(data), n = Q.d.length, odd = n % 2;
      $(".qsorted", box).innerHTML = `<div class="cap">Διατεταγμένα (ν = ${n}${odd ? ", περιττό ⇒ η διάμεσος εξαιρείται από τα μισά" : ", άρτιο"}):</div><div class="pills">${Q.d.map((v, i) => `<span class="${odd && i === (n - 1) / 2 ? "pm" : i < n / 2 ? "pl1" : "pl2"}">${fmt(v)}</span>`).join("")}</div>`;
      const lo = Q.d[0], hi = Q.d[n - 1], pad = (hi - lo) * 0.08 || 1;
      const P = makePlot($(".pl", box), { xmin: lo - pad, xmax: hi + pad, ymin: 0, ymax: 4, H: 150, xstep: niceStep(hi - lo + 2 * pad) * 1.0, ystep: 10 });
      const y = 2, sq = (x1, x2) => P.layer.appendChild(svgEl("rect", { x: P.sx(x1), y: P.sy(y + 0.9), width: P.sx(x2) - P.sx(x1), height: P.sy(y - 0.9) - P.sy(y + 0.9), fill: "rgba(46,117,182,.15)", stroke: "var(--blue)", "stroke-width": 2 }));
      sq(Q.q1, Q.q3); P.seg(lo, y, Q.q1, y, "whisk"); P.seg(Q.q3, y, hi, y, "whisk"); P.seg(Q.q2, y - 0.9, Q.q2, y + 0.9, "medl");
      for (const [v, l] of [[Q.q1, "Q₁"], [Q.q2, "Q₂"], [Q.q3, "Q₃"]]) { const t = svgEl("text", { x: P.sx(v), y: P.sy(y + 1.25), "text-anchor": "middle", class: "lbl d2" }); t.textContent = l; P.top.appendChild(t); }
      P.dot(lo, y, "d2"); P.dot(hi, y, "d2");
      $(".wout", box).innerHTML = `Q₁ = <b>${fmt(Q.q1)}</b> · Q₂ (διάμεσος) = <b>${fmt(Q.q2)}</b> · Q₃ = <b>${fmt(Q.q3)}</b> · IQR = <b>${fmt(Q.q3 - Q.q1)}</b>
        <br>x̄ = ${fmt(S.m)} · s = ${fmt(S.s)} · εύρος = ${fmt(hi - lo)}
        <br><span class="muted">Πρόσθεσε μια ακραία τιμή (π.χ. 400): το εύρος και η s αλλάζουν πολύ, το IQR ελάχιστα!</span>`;
    }
    $(".qd", box).oninput = draw; draw();
  },

  scatter(box) {
    box.innerHTML = `<div class="wctl"><label>Ισχύς/φορά (θεωρητικό ρ) <input type="range" class="rr" min="-1" max="1" step="0.05" value="0.8"><b class="vr"></b></label>
      <button class="btn ghost small nw">Νέο δείγμα ↻</button>
      <label>ή δικά σου δεδομένα: <select class="ps"><option value="">— τυχαίο δείγμα —</option><option value="b">Μαθηματικά–Φυσική (12 μαθητές)</option><option value="c">x: 1..5, y: 2,4,5,4,5</option><option value="d">ώρες μελέτης–βαθμός</option></select></label></div>
      <div class="pl"></div><div class="wout"></div>`;
    const presets = { b: [[10, 8], [14, 13], [17, 16], [12, 13], [15, 15], [16, 16], [20, 19], [18, 19], [10, 12], [13, 13], [12, 10], [11, 14]], c: [[1, 2], [2, 4], [3, 5], [4, 4], [5, 5]], d: [[1, 9], [2, 11], [3, 12], [4, 14], [5, 15], [6, 18]] };
    let pts = [];
    const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    function sample() { const rho = +$(".rr", box).value; pts = []; for (let i = 0; i < 25; i++) { const z1 = gauss(), z2 = gauss(); pts.push([10 + 3 * z1, 10 + 3 * (rho * z1 + Math.sqrt(Math.max(0, 1 - rho * rho)) * z2)]); } }
    function draw() {
      $(".vr", box).textContent = fmt(+$(".rr", box).value);
      const ps = $(".ps", box).value, P0 = ps ? presets[ps] : pts;
      const xs = P0.map(p => p[0]), ys = P0.map(p => p[1]), C = corr(xs, ys);
      const xl = Math.min(...xs), xh = Math.max(...xs), yl = Math.min(...ys), yh = Math.max(...ys), px = (xh - xl) * 0.12 + 0.5, py = (yh - yl) * 0.12 + 0.5;
      const P = makePlot($(".pl", box), { xmin: xl - px, xmax: xh + px, ymin: yl - py, ymax: yh + py, H: 300, xstep: niceStep(xh - xl + 2 * px) });
      const b = C.r * C.Y.s / C.X.s, a = C.Y.m - b * C.X.m;
      if (isFinite(b)) P.curve(x => a + b * x, "c3");
      for (const [x, y] of P0) P.dot(x, y, "d1");
      $(".wout", box).innerHTML = `ν = ${xs.length} · x̄ = ${fmt(C.X.m)} · ȳ = ${fmt(C.Y.m)} · Σxy = ${fmt(C.sxy)} · s<sub>x</sub> = ${fmt(C.X.s)} · s<sub>y</sub> = ${fmt(C.Y.s)}
        <br><b>r ≈ ${C.r.toLocaleString("el-GR", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</b> → ${rLabel(C.r)} γραμμική συσχέτιση${ps === "b" ? " (όπως στο Παράδειγμα 3 του βιβλίου: r ≈ 0,89)" : ""}
        <br><span class="muted">Μετακίνησε τον δείκτη προς το 1, το 0 και το −1 και παρατήρησε πώς «μαζεύονται» τα σημεία γύρω από την ευθεία.</span>`;
    }
    $(".rr", box).oninput = () => { $(".ps", box).value = ""; sample(); draw(); };
    $(".nw", box).onclick = () => { $(".ps", box).value = ""; sample(); draw(); };
    $(".ps", box).onchange = draw; sample(); draw();
  },

  solid(box) {
    box.innerHTML = `<div class="wctl"><label>Στερεό <select class="sh"><option value="cyl">Κύλινδρος (περιστροφή ορθογωνίου)</option><option value="cone">Κώνος (περιστροφή ορθ. τριγώνου)</option><option value="fr">Κόλουρος κώνος (περιστροφή ορθ. τραπεζίου)</option><option value="sph">Σφαίρα (περιστροφή κύκλου)</option></select></label>
      <label>R <input type="range" class="rR" min="1" max="6" value="3"><b class="vR"></b></label>
      <label class="ul">υ <input type="range" class="rU" min="1" max="10" value="4"><b class="vU"></b></label>
      <label class="rl">ρ <input type="range" class="rP" min="1" max="5" value="1"><b class="vP"></b></label>
      <label>περιστροφή <input type="range" class="rot" min="0" max="100" value="100"></label></div>
      <div class="two"><div class="ssvg"></div><div class="wout sform" style="margin-top:0"></div></div>`;
    function draw() {
      const sh = $(".sh", box).value; if (sh === "fr" && +$(".rR", box).value < 2) $(".rR", box).value = 2; const R = +$(".rR", box).value, U = +$(".rU", box).value, rot = +$(".rot", box).value / 100;
      $(".rP", box).max = Math.max(1, R - 1); const rho = Math.min(+$(".rP", box).value, R - 1 || 1); $(".rP", box).value = rho;
      $(".vR", box).textContent = R; $(".vU", box).textContent = U; $(".vP", box).textContent = rho;
      $(".ul", box).style.display = sh === "sph" ? "none" : ""; $(".rl", box).style.display = sh === "fr" ? "" : "none";
      const k = 20, cx = 160, H = sh === "sph" ? 2 * R : U, top = 30, base = top + H * k + (sh === "sph" ? 0 : 0), W = 320, VH = Math.max(H * k + 70, 2 * R * k + 70);
      const ell = (y, r, dashedBack) => r <= 0 ? "" : `<path d="M ${cx - r * k} ${y} A ${r * k} ${r * k * 0.28} 0 0 0 ${cx + r * k} ${y}" class="sol-e"/><path d="M ${cx - r * k} ${y} A ${r * k} ${r * k * 0.28} 0 0 1 ${cx + r * k} ${y}" class="${dashedBack ? "sol-eb" : "sol-e"}"/>`;
      const rx = r => r * k * rot; // how far the revolution has "swept" visually
      let s = `<svg viewBox="0 0 ${W} ${VH}" class="plot"><line x1="${cx}" y1="8" x2="${cx}" y2="${VH - 8}" class="axisrot"/>`;
      let gen2d = "", body = "";
      if (sh === "cyl") { body = `<path d="M ${cx - rx(R)} ${top} L ${cx - rx(R)} ${base} M ${cx + rx(R)} ${top} L ${cx + rx(R)} ${base}" class="sol-e"/>${ell(top, R * rot, false)}${ell(base, R * rot, true)}`; gen2d = `<rect x="${cx}" y="${top}" width="${R * k}" height="${U * k}" class="gen2d"/>`; }
      if (sh === "cone") { body = `<path d="M ${cx} ${top} L ${cx - rx(R)} ${base} M ${cx} ${top} L ${cx + rx(R)} ${base}" class="sol-e"/>${ell(base, R * rot, true)}`; gen2d = `<path d="M ${cx} ${top} L ${cx + R * k} ${base} L ${cx} ${base} Z" class="gen2d"/>`; }
      if (sh === "fr") { body = `<path d="M ${cx - rx(rho)} ${top} L ${cx - rx(R)} ${base} M ${cx + rx(rho)} ${top} L ${cx + rx(R)} ${base}" class="sol-e"/>${ell(top, rho * rot, false)}${ell(base, R * rot, true)}`; gen2d = `<path d="M ${cx} ${top} L ${cx + rho * k} ${top} L ${cx + R * k} ${base} L ${cx} ${base} Z" class="gen2d"/>`; }
      if (sh === "sph") { const cy = top + R * k; body = `<ellipse cx="${cx}" cy="${cy}" rx="${rx(R)}" ry="${R * k}" class="sol-e"/>${ell(cy, R * rot, true)}`; gen2d = `<path d="M ${cx} ${top} A ${R * k} ${R * k} 0 0 1 ${cx} ${top + 2 * R * k} Z" class="gen2d"/>`; }
      s += gen2d + body + `<text x="${cx + 6}" y="${VH - 12}" class="tick">άξονας</text></svg>`;
      $(".ssvg", box).innerHTML = s;
      const sq = Math.sqrt;
      let rows = [];
      if (sh === "cyl") rows = [["E_\\kappa = 2\\pi R\\upsilon", 2 * R * U], ["E_{o\\lambda} = 2\\pi R(R+\\upsilon)", 2 * R * (R + U)], ["V = \\pi R^2\\upsilon", R * R * U]];
      if (sh === "cone") { const L = sq(R * R + U * U); rows = [["\\lambda = \\sqrt{R^2+\\upsilon^2}", null, L], ["E_\\kappa = \\pi R\\lambda", R * L], ["E_{o\\lambda} = \\pi R(R+\\lambda)", R * (R + L)], ["V = \\tfrac13\\pi R^2\\upsilon", [R * R * U, 3]]]; }
      if (sh === "fr") { const L = sq(U * U + (R - rho) ** 2); rows = [["\\lambda = \\sqrt{\\upsilon^2+(R-\\rho)^2}", null, L], ["E_\\kappa = \\pi(R+\\rho)\\lambda", (R + rho) * L], ["E_{o\\lambda} = E_\\kappa + \\pi R^2 + \\pi\\rho^2", (R + rho) * L + R * R + rho * rho], ["V = \\tfrac{\\pi\\upsilon}{3}(R^2+R\\rho+\\rho^2)", [U * (R * R + R * rho + rho * rho), 3]]]; }
      if (sh === "sph") rows = [["E = 4\\pi R^2", 4 * R * R], ["V = \\tfrac43\\pi R^3", [4 * R ** 3, 3]]];
      $(".sform", box).innerHTML = rows.map(([f, c, plain]) => {
        if (c === null) return `$${f} ${Number.isInteger(plain) ? "= " + plain : "\\approx " + fmt(plain).replace(",", "{,}")}$`;
        if (Array.isArray(c)) return `$${f} = ${piT(c[0], c[1])} \\approx ${fmt(Math.PI * c[0] / c[1]).replace(",", "{,}")}$`;
        return `$${f} ${Number.isInteger(c) ? "= " + c + "\\pi" : "\\approx " + fmt(c).replace(",", "{,}") + "\\pi"} \\approx ${fmt(Math.PI * c).replace(",", "{,}")}$`;
      }).join("<br>") + `<br><span class="muted">Το σκιασμένο σχήμα περιστρέφεται γύρω από τον άξονα και «γεννά» το στερεό.</span>`;
      typeset($(".sform", box));
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  }
});

/* ================= Γεννήτριες ================= */
var GENS = Object.assign(window.GENS || {}, {
  gcomb: { title: "Γεννήτρια — μέτρησε τους τρόπους", make() {
    const t = ri(0, 4);
    if (t === 0) { const n = ri(4, 7); return { q: R`Με πόσους τρόπους μπορούν $${n}$ μαθητές να σταθούν σε <b>σειρά</b>;`, fields: [{ label: "τρόποι =", ans: fact(n) }], sol: R`Μεταθέσεις: $M_{${n}} = ${n}! = ${fact(n)}$.` }; }
    if (t === 1) { const n = ri(4, 8); return { q: R`Με πόσους τρόπους μπορούν $${n}$ φίλοι να καθίσουν σε <b>στρογγυλό</b> τραπέζι;`, fields: [{ label: "τρόποι =", ans: fact(n - 1) }], sol: R`Κυκλικές μεταθέσεις: $K_{${n}} = ${n - 1}! = ${fact(n - 1)}$.` }; }
    if (t === 2) { const n = ri(5, 10), k = ri(2, 3), roles = k === 2 ? "πρόεδρος και αντιπρόεδρος" : "πρόεδρος, γραμματέας και ταμίας"; return { q: R`Από $${n}$ άτομα εκλέγονται ${roles}. Με πόσους τρόπους;`, fields: [{ label: "τρόποι =", ans: nPk(n, k) }], sol: R`Διαφορετικοί ρόλοι ⇒ η σειρά μετράει: $\Delta^{${n}}_{${k}} = ${Array.from({ length: k }, (_, i) => n - i).join("\\cdot")} = ${nPk(n, k)}$.` }; }
    if (t === 3) { const n = ri(6, 12), k = ri(2, 4); return { q: R`Με πόσους τρόπους επιλέγεται ομάδα $${k}$ ατόμων από $${n}$ (χωρίς ρόλους);`, fields: [{ label: "τρόποι =", ans: nCk(n, k) }], sol: R`Η σειρά δεν μετράει ⇒ συνδυασμοί: $\binom{${n}}{${k}} = \frac{${Array.from({ length: k }, (_, i) => n - i).join("\\cdot")}}{${k}!} = ${nCk(n, k)}$.` }; }
    const n = ri(2, 5), k = ri(3, 4); return { q: R`Πόσοι κωδικοί $${k}$ θέσεων σχηματίζονται με τα ψηφία $${Array.from({ length: n }, (_, i) => i + 1).join(",")}$, αν επιτρέπεται <b>επανάληψη</b>;`, fields: [{ label: "κωδικοί =", ans: n ** k }], sol: R`Επαναληπτικές διατάξεις: κάθε θέση έχει $${n}$ επιλογές ⇒ $${n}^{${k}} = ${n ** k}$.` };
  } },
  gdice: { title: "Γεννήτρια — πιθανότητες με δύο ζάρια", make() {
    const t = ri(0, 3); let name, test;
    if (t === 0) { const s = ri(3, 11); name = R`το άθροισμα να είναι $${s}$`; test = (a, b) => a + b === s; }
    if (t === 1) { const s = ri(4, 9); name = R`το άθροισμα να είναι <b>το πολύ</b> $${s}$`; test = (a, b) => a + b <= s; }
    if (t === 2) { name = "να έρθουν <b>ίδιοι</b> αριθμοί"; test = (a, b) => a === b; }
    if (t === 3) { const v = ri(1, 6); name = R`να έρθει <b>τουλάχιστον ένα</b> $${v}$`; test = (a, b) => a === v || b === v; }
    let m = 0; const fav = []; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (test(a, b)) { m++; fav.push(`(${a},${b})`); }
    return { q: R`Ρίχνουμε δύο ζάρια. Ποια η πιθανότητα ${name};`, fields: [{ label: "P =", ans: fracS(m, 36) }],
      sol: R`$\nu(\Omega) = 36$. Ευνοϊκά (${m}): ${fav.join(", ")}.<br>$P = \frac{${m}}{36} = ${fracT(m, 36)}$.` };
  } },
  gquart: { title: "Γεννήτρια — τεταρτημόρια", make() {
    const n = ri(7, 12), data = Array.from({ length: n }, () => ri(1, 40)), Q = quartiles(data);
    const odd = n % 2, show = arr => arr.join(",\\ ");
    return { q: R`Δεδομένα ($\nu = ${n}$): <b>${data.join(", ")}</b>. Να βρείτε τα τεταρτημόρια και το ενδοτεταρτημοριακό εύρος.`,
      fields: [{ label: "Q₁ =", ans: Q.q1 }, { label: "Q₂ =", ans: Q.q2 }, { label: "Q₃ =", ans: Q.q3 }, { label: "IQR =", ans: Q.q3 - Q.q1 }],
      sol: R`Διατεταγμένα: $${show(Q.d)}$. ${odd ? R`Περιττό πλήθος ⇒ $Q_2 = ${Q.q2}$ (μεσαία τιμή), την αφαιρούμε.` : R`Άρτιο πλήθος ⇒ $Q_2 = ${String(Q.q2).replace(".", "{,}")}$.`}<br>Πρώτο μισό $${show(Q.lo)}$ ⇒ $Q_1 = ${String(Q.q1).replace(".", "{,}")}$. Δεύτερο μισό $${show(Q.hi)}$ ⇒ $Q_3 = ${String(Q.q3).replace(".", "{,}")}$.<br>$IQR = ${String(Q.q3 - Q.q1).replace(".", "{,}")}$.` };
  } },
  gsolid: { title: "Γεννήτρια — εμβαδά & όγκοι", make() {
    const t = ri(0, 2);
    if (t === 0) { const R0 = ri(2, 6), U = ri(2, 10); return { q: R`Κύλινδρος με $R = ${R0}$ cm και $\upsilon = ${U}$ cm. Να βρείτε την ολική επιφάνεια και τον όγκο (σε π).`, fields: [{ label: "E_ολ =", ans: `${2 * R0 * (R0 + U)}pi` }, { label: "V =", ans: `${R0 * R0 * U}pi` }], sol: R`$E_{o\lambda} = 2\pi \cdot ${R0}(${R0} + ${U}) = ${2 * R0 * (R0 + U)}\pi$, $\;V = \pi \cdot ${R0 * R0} \cdot ${U} = ${R0 * R0 * U}\pi$.` }; }
    if (t === 1) { const tr = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [9, 12, 15]][ri(0, 5)], [R0, U, L] = tr; return { q: R`Κώνος με $R = ${R0}$ cm και $\upsilon = ${U}$ cm. Να βρείτε τη γενέτειρα, την κυρτή επιφάνεια και τον όγκο.`, fields: [{ label: "λ =", ans: L }, { label: "E_κ =", ans: `${R0 * L}pi` }, { label: "V =", ans: `${R0 * R0 * U}pi/3` }], sol: R`$\lambda = \sqrt{${R0 * R0} + ${U * U}} = ${L}$, $\;E_\kappa = \pi \cdot ${R0} \cdot ${L} = ${R0 * L}\pi$, $\;V = \frac13\pi \cdot ${R0 * R0} \cdot ${U} = ${piT(R0 * R0 * U, 3)}$.` }; }
    const R0 = ri(1, 6); return { q: R`Σφαίρα με $R = ${R0}$ cm. Να βρείτε το εμβαδόν της επιφάνειας και τον όγκο.`, fields: [{ label: "E =", ans: `${4 * R0 * R0}pi` }, { label: "V =", ans: `${4 * R0 ** 3}pi/3` }], sol: R`$E = 4\pi \cdot ${R0 * R0} = ${4 * R0 * R0}\pi$, $\;V = \frac43\pi \cdot ${R0 ** 3} = ${piT(4 * R0 ** 3, 3)}$.` };
  } }
});

/* ================= Widgets & γεννήτριες Α΄ Γυμνασίου ================= */
const gyF = (p, q) => fracS2(p, q);
const gyT = (p, q) => texFrac(p, q);
const gyPar = v => v < 0 ? `(${v})` : `${v}`;           /* αρνητικοί σε παρένθεση */
const gyParT = v => v < 0 ? `(${v})` : `${v}`;
const gyNZ = (a, b) => { let v = 0; while (v === 0) v = ri(a, b); return v; };
const gyPF = n => { const f = []; let m = n; for (let p = 2; p * p <= m; p++) while (m % p === 0) { f.push(p); m /= p; } if (m > 1) f.push(m); return f; };
const gyPFT = n => { const f = gyPF(n), c = {}; f.forEach(p => c[p] = (c[p] || 0) + 1); return Object.keys(c).map(p => c[p] > 1 ? `${p}^{${c[p]}}` : p).join("\\cdot "); };
const gyDivs = n => { const d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; };
const gyLcm = (a, b) => a / gcdI(a, b) * b;
const gyRoman = n => { const v = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; let s = ""; for (const [k, r] of v) while (n >= k) { s += r; n -= k; } return s; };
const gyMix = (p, q) => fracS2(p, q);
const gyC = (a, v = "x") => a === 1 ? v : a === -1 ? "-" + v : a + v;          /* συντελεστής */
const gyS = b => b === 0 ? "" : b < 0 ? ` - ${-b}` : ` + ${b}`;                /* σταθερός όρος */
const gyRF = (p, q) => { const g = gcdI(p, q); return [p / g, q / g]; };
function gyCanvas(box, W = 560, H = 300) { const s = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "plot" }); $(".pl", box).innerHTML = ""; $(".pl", box).appendChild(s); return s; }
function gyAdd(svg, tag, attrs, txt) { const e = svgEl(tag, attrs); if (txt !== undefined) e.textContent = txt; svg.appendChild(e); return e; }
const gyTS = "font-family:var(--sans);font-weight:800;font-size:14px";

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- Επανάληψη: κλάσματα ---------- */
  fracbar(box) {
    box.innerHTML = `<div class="wctl"><label>αριθμητής <input type="range" class="rp" min="0" max="12" value="3"><b class="vp"></b></label>
      <label>παρονομαστής <input type="range" class="rq" min="1" max="12" value="4"><b class="vq"></b></label>
      <label>επί κ <input type="range" class="rk" min="1" max="4" value="2"><b class="vk"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const p = +$(".rp", box).value, q = +$(".rq", box).value, k = +$(".rk", box).value;["p", "q", "k"].forEach((c, i) => $(".v" + c, box).textContent = [p, q, k][i]);
      const svg = gyCanvas(box, 560, 170), wid = 520, x0 = 20;
      [[q, p, 30, "var(--blue)"], [q * k, p * k, 100, "var(--green)"]].forEach(([n, f, y, col]) => {
        const whole = Math.max(1, Math.ceil(f / n)); const cw = wid / (n * whole);
        for (let i = 0; i < n * whole; i++) gyAdd(svg, "rect", { x: x0 + i * cw, y, width: cw, height: 40, style: `fill:${i < f ? col : "#fff"};fill-opacity:${i < f ? .55 : 1};stroke:var(--navy);stroke-width:${i % n === 0 ? 2.4 : 1}` });
      });
      const g = gcdI(p, q);
      $(".wout", box).innerHTML = `<b>${p}/${q} = ${p * k}/${q * k}</b> (ισοδύναμα κλάσματα: πολλαπλασιάζουμε αριθμητή και παρονομαστή με ${k}). Ανάγωγο: <b>${p === 0 ? 0 : (p / g) + "/" + (q / g)}</b> · δεκαδικός ≈ ${fmt(p / q)}${p > q ? ` · μεικτός: ${Math.floor(p / q)} ${p % q}/${q}` : ""}.
        <br><span class="muted">Οι δύο ράβδοι έχουν το ίδιο χρωματισμένο μήκος: είναι το ίδιο μέρος της μονάδας.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- Επανάληψη: εμβαδά ---------- */
  areas(box) {
    box.innerHTML = `<div class="wctl"><label>σχήμα <select class="ss"><option value="0">ορθογώνιο</option><option value="1">τρίγωνο</option><option value="2">παραλληλόγραμμο</option><option value="3">τραπέζιο</option></select></label>
      <label>β <input type="range" class="rb" min="2" max="10" value="6"><b class="vb"></b></label><label>υ <input type="range" class="rh" min="1" max="6" value="3"><b class="vh"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const t = +$(".ss", box).value, b = +$(".rb", box).value, h = +$(".rh", box).value; $(".vb", box).textContent = b; $(".vh", box).textContent = h;
      const P = makePlot($(".pl", box), { xmin: -1, xmax: 13, ymin: -1, ymax: 7.5, H: 280, xstep: 1, ystep: 1 }), s = 2, B2 = Math.max(1, b - 3);
      const pts = [[[0, 0], [b, 0], [b, h], [0, h]], [[0, 0], [b, 0], [b / 2 - 1, h]], [[0, 0], [b, 0], [b + s, h], [s, h]], [[0, 0], [b, 0], [s + B2, h], [s, h]]][t];
      P.layer.appendChild(svgEl("polygon", { points: pts.map(p => P.sx(p[0]) + "," + P.sy(p[1])).join(" "), style: "fill:rgba(15,111,209,.18);stroke:var(--blue);stroke-width:2.5" }));
      if (t) P.seg(pts[pts.length - 1][0], h, pts[pts.length - 1][0], 0, "guide");
      const E = [b * h, b * h / 2, b * h, (b + B2) * h / 2][t], f = ["E = β·υ", "E = ½·β·υ", "E = β·υ", "E = ½·(Β + β)·υ"][t];
      $(".wout", box).innerHTML = `${f} = <b>${fmt(E)}</b> τετραγωνικές μονάδες${t === 3 ? ` (Β = ${b}, β = ${B2})` : ""}. Περίμετρος${t === 0 ? ` = 2(β + υ) = <b>${2 * (b + h)}</b>` : ": άθροισμα όλων των πλευρών"}.
        <br><span class="muted">Μέτρησε τα τετραγωνάκια του πλέγματος για να επιβεβαιώσεις τον τύπο.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 1. Σύνολα: Venn με στοιχεία ---------- */
  setsel(box) {
    const PR = [["Α = διαιρέτες του 12, Β = διαιρέτες του 18", gyDivs(12), gyDivs(18), [...Array(20)].map((_, i) => i + 1)],
      ["Α = άρτιοι ≤ 12, Β = πολλαπλάσια του 3 ≤ 12", [2, 4, 6, 8, 10, 12], [3, 6, 9, 12], [...Array(12)].map((_, i) => i + 1)],
      ["Α = πρώτοι < 20, Β = περιττοί < 20", [2, 3, 5, 7, 11, 13, 17, 19], [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], [...Array(19)].map((_, i) => i + 1)],
      ["Α = {α, ε, ι, ο}, Β = φωνήεντα της «ΣΥΝΟΛΟ»", ["α", "ε", "ι", "ο"], ["υ", "ο"], ["α", "ε", "η", "ι", "ο", "υ", "ω"]]];
    const OPS = [["Α ∪ Β", (a, b) => a || b], ["Α ∩ Β", (a, b) => a && b], ["Α′", (a, b) => !a], ["Β′", (a, b) => !b]];
    box.innerHTML = `<div class="wctl"><label>σύνολα <select class="sp">${PR.map((p, i) => `<option value="${i}">${p[0]}</option>`).join("")}</select></label></div>
      <div class="wctl chips">${OPS.map((o, i) => `<button class="chip${i ? "" : " on"}" data-i="${i}">${o[0]}</button>`).join("")}</div><div class="pl"></div><div class="wout"></div>`;
    let cur = 0;
    function draw() {
      const [nm, A, B, U] = PR[+$(".sp", box).value], op = OPS[cur], svg = gyCanvas(box, 560, 280);
      const inA = x => A.includes(x), inB = x => B.includes(x);
      gyAdd(svg, "rect", { x: 8, y: 8, width: 544, height: 264, rx: 12, style: "fill:#f6f9fd;stroke:var(--navy)" });
      gyAdd(svg, "circle", { cx: 220, cy: 140, r: 105, style: "fill:rgba(15,111,209,.10);stroke:var(--blue);stroke-width:2.4" });
      gyAdd(svg, "circle", { cx: 340, cy: 140, r: 105, style: "fill:rgba(214,138,0,.10);stroke:var(--amber);stroke-width:2.4" });
      gyAdd(svg, "text", { x: 130, y: 40, style: gyTS + ";fill:var(--blue)" }, "Α"); gyAdd(svg, "text", { x: 425, y: 40, style: gyTS + ";fill:var(--amber)" }, "Β"); gyAdd(svg, "text", { x: 24, y: 30, style: gyTS }, "Ω");
      const reg = { a: [], ab: [], b: [], o: [] }; U.forEach(x => reg[inA(x) && inB(x) ? "ab" : inA(x) ? "a" : inB(x) ? "b" : "o"].push(x));
      const place = (arr, cx, cy, w) => arr.forEach((x, i) => { const c = Math.min(arr.length, 3), r = Math.floor(i / c), k = i % c; const on = op[1](inA(x), inB(x));
        gyAdd(svg, "text", { x: cx + (k - (c - 1) / 2) * w, y: cy + (r - (Math.ceil(arr.length / c) - 1) / 2) * 24, "text-anchor": "middle", style: gyTS + `;font-size:15px;fill:${on ? "var(--red)" : "#7a8699"}` }, x); });
      place(reg.a, 165, 145, 30); place(reg.ab, 280, 145, 26); place(reg.b, 395, 145, 30);
      reg.o.forEach((x, i) => { const on = op[1](false, false); gyAdd(svg, "text", { x: 30 + (i % 18) * 29, y: i < 18 ? 262 : 22, style: gyTS + `;font-size:13px;fill:${on ? "var(--red)" : "#9aa5b5"}` }, x); });
      const res = U.filter(x => op[1](inA(x), inB(x)));
      $(".wout", box).innerHTML = `${nm}<br><b>${op[0]} = {${res.join(", ")}}</b> · πλήθος στοιχείων: <b>${res.length}</b>
        <br><span class="muted">Με κόκκινο τα στοιχεία που ανήκουν στο ${op[0]}. Το ορθογώνιο είναι το βασικό σύνολο Ω.</span>`;
    }
    box.querySelectorAll(".chip").forEach(c => c.onclick = () => { box.querySelectorAll(".chip").forEach(x => x.classList.remove("on")); c.classList.add("on"); cur = +c.dataset.i; draw(); });
    $(".sp", box).onchange = draw; draw();
  },

  /* ---------- 2.1 Δυνάμεις ---------- */
  powgrid(box) {
    box.innerHTML = `<div class="wctl"><label>βάση α <input type="range" class="ra" min="1" max="10" value="2"><b class="va"></b></label>
      <label>εκθέτης ν <input type="range" class="rn" min="0" max="8" value="3"><b class="vn"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, n = +$(".rn", box).value; $(".va", box).textContent = a; $(".vn", box).textContent = n;
      const svg = gyCanvas(box, 560, 120), vals = [...Array(9)].map((_, k) => a ** k), mx = Math.max(...vals.slice(0, 9));
      vals.forEach((v, k) => { const h = 80 * Math.log(1 + v) / Math.log(1 + mx); gyAdd(svg, "rect", { x: 20 + k * 60, y: 100 - h, width: 40, height: h, style: `fill:${k === n ? "var(--red)" : "var(--blue)"};fill-opacity:${k === n ? .8 : .35}` }); gyAdd(svg, "text", { x: 40 + k * 60, y: 115, "text-anchor": "middle", style: gyTS + ";font-size:12px" }, `${a}^${k}`); });
      const prod = n === 0 ? "1 (κάθε μη μηδενικός αριθμός με εκθέτη 0)" : n === 1 ? `${a}` : Array(n).fill(a).join(" · ");
      $(".wout", box).innerHTML = `${a}<sup>${n}</sup> = ${prod} = <b>${(a ** n).toLocaleString("el-GR")}</b>
        <br><span class="muted">Η δύναμη α<sup>ν</sup> είναι γινόμενο ν ίσων παραγόντων. Οι στήλες (λογαριθμική κλίμακα) δείχνουν πόσο γρήγορα μεγαλώνουν οι δυνάμεις.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 2.2 Συστήματα αρίθμησης ---------- */
  numsys(box) {
    box.innerHTML = `<div class="wctl"><label>αριθμός <input type="range" class="rn" min="1" max="9999" value="2026"><b class="vn"></b></label></div><div class="wout"></div>`;
    function draw() {
      const n = +$(".rn", box).value; $(".vn", box).textContent = n;
      const d = String(n).split("").map(Number), L = d.length, exp = d.map((x, i) => `${x}·10<sup>${L - 1 - i}</sup>`).join(" + ");
      const b2 = n.toString(2), b5 = n.toString(5);
      $(".wout", box).innerHTML = `<b>Δεκαδικό:</b> ${n} = ${exp}
        <br><b>Δυαδικό:</b> ${n} = <b>${b2}</b><sub>2</sub> = ${b2.split("").map((x, i) => x === "1" ? `2<sup>${b2.length - 1 - i}</sup>` : null).filter(Boolean).join(" + ")}
        <br><b>Αιγυπτιακό:</b> ${d.map((x, i) => x ? `${x} × ${["λουλούδι λωτού (1000)", "σπείρα (100)", "πέταλο (10)", "ράβδος (1)"][4 - L + i]}` : null).filter(Boolean).join(" + ")} — <b>${d.reduce((a, b) => a + b, 0)}</b> σύμβολα
        <br><span class="muted">Στο θεσιακό σύστημα η αξία κάθε ψηφίου εξαρτάται από τη θέση του. Το αιγυπτιακό δεν είναι θεσιακό: προσθέτουμε τις αξίες των συμβόλων, όπου κι αν βρίσκονται.</span>`;
    }
    $(".rn", box).oninput = draw; draw();
  },

  /* ---------- 2.5–2.6 & 4.9 Ζυγαριά εξίσωσης ---------- */
  balance(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="1" max="5" value="3"><b class="va"></b></label>
      <label>β <input type="range" class="rb" min="-6" max="9" value="4"><b class="vb"></b></label><label>γ <input type="range" class="rc" min="-10" max="25" value="19"><b class="vc"></b></label>
      <label>βήμα <input type="range" class="rs" min="0" max="2" value="0"><b class="vs"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, b = +$(".rb", box).value, c = +$(".rc", box).value, st = +$(".rs", box).value;["a", "b", "c"].forEach((k, i) => $(".v" + k, box).textContent = [a, b, c][i]); $(".vs", box).textContent = st;
      const x = (c - b) / a, svg = gyCanvas(box, 560, 200);
      gyAdd(svg, "polygon", { points: "280,170 262,195 298,195", style: "fill:var(--navy)" }); gyAdd(svg, "line", { x1: 60, y1: 170, x2: 500, y2: 170, style: "stroke:var(--navy);stroke-width:5" });
      const L = st === 0 ? `${a === 1 ? "" : a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}` : `${a === 1 ? "" : a}x`, R = st === 0 ? `${c}` : st === 1 ? `${c} ${b < 0 ? "+" : "−"} ${Math.abs(b)} = ${c - b}` : "";
      const Lt = st === 2 ? "x" : L, Rt = st === 2 ? `${c - b} : ${a} = ${fmt(x)}` : R;
      gyAdd(svg, "rect", { x: 80, y: 110, width: 160, height: 56, rx: 8, style: "fill:rgba(15,111,209,.18);stroke:var(--blue);stroke-width:2" }); gyAdd(svg, "rect", { x: 320, y: 110, width: 160, height: 56, rx: 8, style: "fill:rgba(214,138,0,.18);stroke:var(--amber);stroke-width:2" });
      gyAdd(svg, "text", { x: 160, y: 144, "text-anchor": "middle", style: gyTS + ";font-size:18px" }, Lt); gyAdd(svg, "text", { x: 400, y: 144, "text-anchor": "middle", style: gyTS + ";font-size:16px" }, Rt);
      const steps = [`Εξίσωση: ${L} = ${c}`, `Αφαιρούμε ${b} και από τα δύο μέλη (ο όρος ${b} «περνά» απέναντι με αντίθετο πρόσημο): ${a === 1 ? "" : a}x = ${c - b}`, `Διαιρούμε και τα δύο μέλη με ${a}: x = ${gyF(c - b, a)}${Number.isInteger(x) ? "" : " ≈ " + fmt(x)}`];
      $(".wout", box).innerHTML = steps.slice(0, st + 1).map((s, i) => i === st ? `<b>${s}</b>` : s).join("<br>") + `<br><span class="muted">Η ζυγαριά μένει σε ισορροπία όταν κάνουμε την ίδια πράξη και στα δύο μέλη. Επαλήθευση: ${a}·${fmt(x)} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${fmt(a * x + b)}.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 3.1 Ευκλείδεια διαίρεση ---------- */
  euclid(box) {
    box.innerHTML = `<div class="wctl"><label>Δ <input type="range" class="rD" min="0" max="60" value="38"><b class="vD"></b></label>
      <label>δ <input type="range" class="rd" min="1" max="12" value="7"><b class="vd"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const D = +$(".rD", box).value, d = +$(".rd", box).value; $(".vD", box).textContent = D; $(".vd", box).textContent = d;
      const q = Math.floor(D / d), r = D % d, svg = gyCanvas(box, 560, 150), s = Math.min(18, 520 / Math.max(D, 1));
      for (let i = 0; i < D; i++) { const grp = Math.floor(i / d), rem = grp >= q; gyAdd(svg, "rect", { x: 20 + i * s + grp * 3, y: 40, width: s - 2, height: 40, rx: 3, style: `fill:${rem ? "var(--red)" : grp % 2 ? "var(--blue)" : "var(--green)"};fill-opacity:.6` }); }
      $(".wout", box).innerHTML = `<b>${D} = ${d} · ${q} + ${r}</b>, με 0 ≤ ${r} &lt; ${d} · πηλίκο π = ${q}, υπόλοιπο υ = ${r}${r === 0 ? ` — <b>τέλεια διαίρεση</b>: το ${d} διαιρεί το ${D}` : ""}.
        <br><span class="muted">Χωρίζουμε τα ${D} κουτάκια σε ομάδες των ${d}: οι πλήρεις ομάδες είναι το πηλίκο, τα κόκκινα που περισσεύουν το υπόλοιπο (πάντα μικρότερο από τον διαιρέτη).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 3.2–3.4 Διαιρέτες, κριτήρια, πρώτοι ---------- */
  divisors(box) {
    box.innerHTML = `<div class="wctl"><label>αριθμός <input type="range" class="rn" min="2" max="300" value="180"><b class="vn"></b></label></div><div class="wout"></div>`;
    function draw() {
      const n = +$(".rn", box).value; $(".vn", box).textContent = n;
      const D = gyDivs(n), ds = String(n).split("").map(Number), S = ds.reduce((a, b) => a + b, 0), last2 = n % 100;
      const cr = [[2, `τελευταίο ψηφίο ${n % 10} ${n % 2 === 0 ? "άρτιο" : "περιττό"}`], [3, `άθροισμα ψηφίων ${S}`], [4, `τελευταία δύο ψηφία ${last2}`], [5, `τελευταίο ψηφίο ${n % 10}`], [9, `άθροισμα ψηφίων ${S}`], [10, `τελευταίο ψηφίο ${n % 10}`], [25, `τελευταία δύο ψηφία ${last2}`]];
      $(".wout", box).innerHTML = `Διαιρέτες του ${n}: <b>{${D.join(", ")}}</b> (${D.length} διαιρέτες) — ${D.length === 2 ? "<b>πρώτος</b> αριθμός" : "<b>σύνθετος</b> αριθμός"}
        <br>Ανάλυση σε γινόμενο πρώτων: <b>${n} = ${gyPF(n).join(" · ")}</b>
        <br>${cr.map(([k, t]) => `<span style="color:${n % k === 0 ? "var(--green)" : "var(--red)"}">${n % k === 0 ? "✓" : "✗"} ${k}</span> (${t})`).join(" · ")}
        <br><span class="muted">Κριτήρια: 2, 5, 10 → τελευταίο ψηφίο · 4, 25 → τελευταία δύο ψηφία · 3, 9 → άθροισμα ψηφίων.</span>`;
    }
    $(".rn", box).oninput = draw; draw();
  },

  /* ---------- 3.5 ΜΚΔ – ΕΚΠ ---------- */
  gcdlcm(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="2" max="120" value="24"><b class="va"></b></label>
      <label>β <input type="range" class="rb" min="2" max="120" value="36"><b class="vb"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, b = +$(".rb", box).value; $(".va", box).textContent = a; $(".vb", box).textContent = b;
      const fa = gyPF(a), fb = gyPF(b), common = [], ra = [...fa], rb = [...fb];
      for (let i = ra.length - 1; i >= 0; i--) { const j = rb.indexOf(ra[i]); if (j >= 0) { common.push(ra[i]); ra.splice(i, 1); rb.splice(j, 1); } }
      const svg = gyCanvas(box, 560, 200);
      gyAdd(svg, "circle", { cx: 220, cy: 100, r: 90, style: "fill:rgba(15,111,209,.10);stroke:var(--blue);stroke-width:2.4" }); gyAdd(svg, "circle", { cx: 340, cy: 100, r: 90, style: "fill:rgba(214,138,0,.10);stroke:var(--amber);stroke-width:2.4" });
      gyAdd(svg, "text", { x: 150, y: 22, style: gyTS + ";fill:var(--blue)" }, `${a}`); gyAdd(svg, "text", { x: 395, y: 22, style: gyTS + ";fill:var(--amber)" }, `${b}`);
      const put = (arr, cx) => arr.forEach((p, i) => gyAdd(svg, "text", { x: cx + ((i % 3) - 1) * 26, y: 100 + (Math.floor(i / 3) - (Math.ceil(arr.length / 3) - 1) / 2) * 24, "text-anchor": "middle", style: gyTS + ";font-size:16px" }, p));
      put(ra, 165); put(common, 280); put(rb, 395);
      const g = gcdI(a, b), l = gyLcm(a, b);
      $(".wout", box).innerHTML = `${a} = ${fa.join("·")} · ${b} = ${fb.join("·")}
        <br><b>ΜΚΔ(${a}, ${b}) = ${common.length ? common.join("·") : "1"} = ${g}</b> (κοινοί πρώτοι παράγοντες — η τομή) · <b>ΕΚΠ(${a}, ${b}) = ${[...ra, ...common, ...rb].join("·")} = ${l}</b> (όλοι οι παράγοντες — η ένωση)
        <br><span class="muted">Ισχύει πάντα ΜΚΔ · ΕΚΠ = α · β: ${g} · ${l} = ${a * b}.${g === 1 ? " Οι αριθμοί είναι <b>πρώτοι μεταξύ τους</b>." : ""}</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 4.1–4.4 Ρητοί στην αριθμογραμμή ---------- */
  numline(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="-8" max="8" step="0.5" value="-3"><b class="va"></b></label>
      <label>β <input type="range" class="rb" min="-8" max="8" step="0.5" value="5"><b class="vb"></b></label>
      <label>πράξη <select class="so"><option value="0">σύγκριση – απόλυτες τιμές</option><option value="1">α + β</option><option value="2">α − β</option><option value="3">απόσταση</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, b = +$(".rb", box).value, o = +$(".so", box).value; $(".va", box).textContent = fmt(a); $(".vb", box).textContent = fmt(b);
      const P = makePlot($(".pl", box), { xmin: -17, xmax: 17, ymin: -2, ymax: 3, H: 170, xstep: 2, ystep: 1 }); let txt = "";
      P.dot(a, 0, "d1", "α", -4, 22); P.dot(b, 0, "d3", "β", 4, 22);
      if (o === 0) { gArrow(P, 0, 1.2, a, 1.2, "var(--blue)", 2); gArrow(P, 0, 2.2, b, 2.2, "var(--amber)", 2);
        txt = `${fmt(a)} ${a < b ? "&lt;" : a > b ? "&gt;" : "="} ${fmt(b)} (μεγαλύτερος είναι αυτός που βρίσκεται δεξιότερα) · |α| = ${fmt(Math.abs(a))}, |β| = ${fmt(Math.abs(b))} (απόσταση από το 0) · αντίθετος του α: ${fmt(-a)}`; }
      else if (o === 1) { gArrow(P, 0, 1.2, a, 1.2, "var(--blue)", 3); gArrow(P, a, 2.2, a + b, 2.2, "var(--amber)", 3); P.dot(a + b, 0, "dmax", "α+β", 4, 22);
        txt = `${fmt(a)} + ${gyPar(fmt(b))} = <b>${fmt(a + b)}</b>: από το α κινούμαστε ${Math.abs(b)} μονάδες ${b >= 0 ? "δεξιά" : "αριστερά"}. ${a * b < 0 ? "Ετερόσημοι: αφαιρούμε τις απόλυτες τιμές και κρατάμε το πρόσημο του μεγαλύτερου κατ' απόλυτη τιμή." : "Ομόσημοι: προσθέτουμε τις απόλυτες τιμές και κρατάμε το κοινό πρόσημο."}`; }
      else if (o === 2) { gArrow(P, 0, 1.2, a, 1.2, "var(--blue)", 3); gArrow(P, a, 2.2, a - b, 2.2, "var(--amber)", 3); P.dot(a - b, 0, "dmax", "α−β", 4, 22);
        txt = `${fmt(a)} − ${gyPar(fmt(b))} = ${fmt(a)} + ${gyPar(fmt(-b))} = <b>${fmt(a - b)}</b>: η αφαίρεση είναι πρόσθεση του αντίθετου.`; }
      else { P.band(Math.min(a, b), Math.max(a, b), "pos"); txt = `Απόσταση των α και β: |α − β| = |${fmt(a)} − ${gyPar(fmt(b))}| = <b>${fmt(Math.abs(a - b))}</b>.`; }
      $(".wout", box).innerHTML = txt;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 4.5–4.7 Πρόσημα γινομένου ---------- */
  signs(box) {
    box.innerHTML = `<div class="wctl"><label>πλήθος αρνητικών παραγόντων <input type="range" class="rk" min="0" max="7" value="3"><b class="vk"></b></label>
      <label>θετικοί <input type="range" class="rp" min="0" max="5" value="2"><b class="vp"></b></label></div><div class="wout"></div>`;
    function draw() {
      const k = +$(".rk", box).value, p = +$(".rp", box).value; $(".vk", box).textContent = k; $(".vp", box).textContent = p;
      const fs = [...Array(k).fill(-2), ...Array(p).fill(3)], v = fs.reduce((x, y) => x * y, 1);
      $(".wout", box).innerHTML = `${fs.length ? fs.map(gyPar).join(" · ") : "—"} = <b>${fs.length ? v : "—"}</b>
        <br>${k} αρνητικοί παράγοντες ⇒ ${k % 2 ? "<b>περιττό</b> πλήθος ⇒ γινόμενο <b>αρνητικό</b>" : "<b>άρτιο</b> πλήθος ⇒ γινόμενο <b>θετικό</b>"}
        <br><span class="muted">Ίδιος κανόνας και για τη διαίρεση: ομόσημοι ⇒ θετικό, ετερόσημοι ⇒ αρνητικό. Άρα (−2)<sup>ν</sup> είναι θετικό για άρτιο ν και αρνητικό για περιττό ν, ενώ −2<sup>ν</sup> = −(2<sup>ν</sup>) είναι πάντα αρνητικό.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 4.8 Περιοδικοί ---------- */
  periodic(box) {
    box.innerHTML = `<div class="wctl"><label>αριθμητής <input type="range" class="rp" min="1" max="40" value="5"><b class="vp"></b></label>
      <label>παρονομαστής <input type="range" class="rq" min="2" max="30" value="6"><b class="vq"></b></label></div><div class="wout"></div>`;
    function draw() {
      const p = +$(".rp", box).value, q = +$(".rq", box).value; $(".vp", box).textContent = p; $(".vq", box).textContent = q;
      let r = p % q, digs = "", seen = {}, i = 0, start = -1; const ip = Math.floor(p / q);
      while (r && i < 40) { if (seen[r] !== undefined) { start = seen[r]; break; } seen[r] = i; r *= 10; digs += Math.floor(r / q); r %= q; i++; }
      const g = gcdI(p, q); let qq = q / g; while (qq % 2 === 0) qq /= 2; while (qq % 5 === 0) qq /= 5;
      const dec = start < 0 ? `${ip}${digs ? "," + digs : ""}` : `${ip},${digs.slice(0, start)}<span style="text-decoration:overline">${digs.slice(start)}</span>`;
      $(".wout", box).innerHTML = `${p}/${q} = <b>${dec}</b> — ${start < 0 ? "<b>δεκαδικός με πεπερασμένα ψηφία</b>" : `<b>περιοδικός</b> με περίοδο ${digs.slice(start)}`}
        <br><span class="muted">Ένα ανάγωγο κλάσμα δίνει πεπερασμένο δεκαδικό μόνο όταν ο παρονομαστής έχει πρώτους παράγοντες μόνο 2 και 5 (εδώ: ${qq === 1 ? "ναι" : "όχι, υπάρχει ο παράγοντας " + gyPF(qq).join("·")}).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 6.2–6.3 Γωνίες ---------- */
  angleG(box) {
    box.innerHTML = `<div class="wctl"><label>ω <input type="range" class="rw" min="0" max="360" value="65"><b class="vw"></b></label>
      <label><input type="checkbox" class="cb" checked> διχοτόμος</label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const w = +$(".rw", box).value, bis = $(".cb", box).checked; $(".vw", box).textContent = w + "°";
      const P = gPlot($(".pl", box), 0, 0.3, 2.2, 280, false), r = 1.6;
      gLine(P, 0, 0, r, 0, "stroke:var(--navy);stroke-width:3"); gLine(P, 0, 0, r * Math.cos(gRad(w)), r * Math.sin(gRad(w)), "stroke:var(--navy);stroke-width:3");
      if (w > 0) gArc(P, 0, 0, 0, w, 0.45, "var(--amber)", w + "°", 0.75);
      if (bis && w > 0) gLine(P, 0, 0, r * Math.cos(gRad(w / 2)), r * Math.sin(gRad(w / 2)), "stroke:var(--red);stroke-width:2;stroke-dasharray:6 4");
      P.dot(0, 0, "d2", "Ο", -14, 16);
      const type = w === 0 ? "μηδενική" : w < 90 ? "οξεία" : w === 90 ? "ορθή" : w < 180 ? "αμβλεία" : w === 180 ? "ευθεία" : w < 360 ? "μη κυρτή" : "πλήρης";
      $(".wout", box).innerHTML = `Η γωνία ω = ${w}° είναι <b>${type}</b>.${w <= 90 ? ` Συμπληρωματική: <b>${90 - w}°</b>.` : ""}${w <= 180 ? ` Παραπληρωματική: <b>${180 - w}°</b>.` : ""}${bis && w > 0 ? ` Η διχοτόμος τη χωρίζει σε δύο γωνίες των <b>${fmt(w / 2)}°</b>.` : ""}
        <br><span class="muted">Συμπληρωματικές: άθροισμα 90° · παραπληρωματικές: άθροισμα 180° · κατακορυφήν: ίσες.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 6.3 Κατακορυφήν – εφεξής ---------- */
  vertical(box) {
    box.innerHTML = `<div class="wctl"><label>γωνία ω <input type="range" class="rw" min="10" max="170" value="55"><b class="vw"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const w = +$(".rw", box).value; $(".vw", box).textContent = w + "°";
      const P = gPlot($(".pl", box), 0, 0, 2.2, 280, false), c = Math.cos(gRad(w)), s = Math.sin(gRad(w));
      gLine(P, -2, 0, 2, 0, "stroke:var(--navy);stroke-width:3"); gLine(P, -1.9 * c, -1.9 * s, 1.9 * c, 1.9 * s, "stroke:var(--navy);stroke-width:3");
      gArc(P, 0, 0, 0, w, 0.4, "var(--blue)", "ω", 0.65); gArc(P, 0, 0, 180, 180 + w, 0.4, "var(--blue)", "ω", 0.65);
      gArc(P, 0, 0, w, 180, 0.32, "var(--amber)", (180 - w) + "°", 0.7); gArc(P, 0, 0, 180 + w, 360, 0.32, "var(--amber)", (180 - w) + "°", 0.7);
      $(".wout", box).innerHTML = `Οι <b style="color:var(--blue)">κατακορυφήν</b> γωνίες είναι ίσες: ω = ${w}°. Δύο <b style="color:var(--amber)">εφεξής</b> γωνίες πάνω σε ευθεία είναι <b>παραπληρωματικές</b>: ${w}° + ${180 - w}° = 180°.
        <br><span class="muted">Οι τέσσερις γωνίες γύρω από το σημείο τομής έχουν άθροισμα 360°.${w === 90 ? " Εδώ οι ευθείες είναι <b>κάθετες</b>." : ""}</span>`;
    }
    $(".rw", box).oninput = draw; draw();
  },

  /* ---------- 6.4 Απόσταση σημείου από ευθεία ---------- */
  distpt(box) {
    box.innerHTML = `<div class="wctl"><label>σημείο Μ στην ευθεία <input type="range" class="rm" min="-3" max="3" step="0.1" value="1.6"><b class="vm"></b></label>
      <label>απόσταση του Α <input type="range" class="rd" min="0.5" max="2.5" step="0.1" value="1.5"><b class="vd"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const m = +$(".rm", box).value, d = +$(".rd", box).value; $(".vm", box).textContent = fmt(m); $(".vd", box).textContent = fmt(d);
      const P = gPlot($(".pl", box), 0, 1, 3.6, 260, true);
      gLine(P, -3.6, 0, 3.6, 0, "stroke:var(--navy);stroke-width:3"); gText(P, 3.3, -0.25, "ε");
      gLine(P, 0, d, 0, 0, "stroke:var(--green);stroke-width:3"); gLine(P, 0, d, m, 0, "stroke:var(--red);stroke-width:2;stroke-dasharray:6 4");
      P.dot(0, d, "d2", "Α", 8, -6); P.dot(0, 0, "dmax", "Κ", 6, 18); P.dot(m, 0, "dmin", "Μ", 6, 18);
      $(".wout", box).innerHTML = `ΑΚ ⊥ ε: απόσταση του Α από την ε = <b>ΑΚ = ${fmt(d)}</b> · ΑΜ = <b>${fmt(Math.hypot(m, d))}</b>
        <br><span class="muted">Από όλα τα τμήματα που ενώνουν το Α με σημεία της ευθείας, το <b>κάθετο</b> ΑΚ είναι το μικρότερο — γι' αυτό το μήκος του ορίζεται ως απόσταση.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 6.5 Στοιχεία κύκλου ---------- */
  circleG(box) {
    box.innerHTML = `<div class="wctl"><label>επίκεντρη γωνία <input type="range" class="rw" min="10" max="350" value="100"><b class="vw"></b></label>
      <label>ακτίνα ρ <input type="range" class="rr" min="1" max="10" value="5"><b class="vr"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const w = +$(".rw", box).value, R = +$(".rr", box).value; $(".vw", box).textContent = w + "°"; $(".vr", box).textContent = R;
      const P = gPlot($(".pl", box), 0, 0, 3.4, 300, false), A = [1.5, 0], B = [1.5 * Math.cos(gRad(w)), 1.5 * Math.sin(gRad(w))];
      gCircle(P, 0, 0, 1.5); gArc(P, 0, 0, 0, w, 1.5, "var(--red)"); gLine(P, 0, 0, ...A, "stroke:var(--navy);stroke-width:2"); gLine(P, 0, 0, ...B, "stroke:var(--navy);stroke-width:2");
      gLine(P, ...A, ...B, "stroke:var(--green);stroke-width:2.4;stroke-dasharray:6 4"); gArc(P, 0, 0, 0, w, 0.35, "var(--amber)", w + "°", 0.62);
      P.dot(0, 0, "d2", "Κ", -14, 16); P.dot(...A, "d1", "Α", 8, 4); P.dot(...B, "d1", "Β", 8, -6);
      const L = 2 * Math.PI * R, arc = L * w / 360;
      $(".wout", box).innerHTML = `Κόκκινο: το τόξο ΑΒ που αντιστοιχεί στην επίκεντρη γωνία ${w}° · πράσινο: η χορδή ΑΒ.
        <br>Μήκος κύκλου: L = 2πρ ≈ <b>${fmt(L)}</b> · μήκος τόξου ≈ ${w}/360 · L ≈ <b>${fmt(arc)}</b> · διάμετρος = 2ρ = ${2 * R}
        <br><span class="muted">Η μεγαλύτερη χορδή του κύκλου είναι η διάμετρος. Ίσες επίκεντρες γωνίες βαίνουν σε ίσα τόξα.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 8.1 Συντεταγμένες ---------- */
  coordG(box) {
    box.innerHTML = `<div class="wctl"><label>x <input type="range" class="rx" min="-6" max="6" value="3"><b class="vx"></b></label>
      <label>y <input type="range" class="ry" min="-6" max="6" value="-2"><b class="vy"></b></label><label><input type="checkbox" class="cs" checked> συμμετρικά</label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const x = +$(".rx", box).value, y = +$(".ry", box).value, sy = $(".cs", box).checked; $(".vx", box).textContent = x; $(".vy", box).textContent = y;
      const P = makePlot($(".pl", box), { xmin: -7, xmax: 7, ymin: -7, ymax: 7, H: 330, xstep: 1, ystep: 1 });
      P.seg(x, 0, x, y, "guide"); P.seg(0, y, x, y, "guide"); P.dot(x, y, "d1", `Α(${x}, ${y})`);
      if (sy) { P.dot(x, -y, "d3", `(${x}, ${-y})`); P.dot(-x, y, "d3", `(${-x}, ${y})`); P.dot(-x, -y, "dinf", `(${-x}, ${-y})`); }
      const q = x === 0 || y === 0 ? (x === 0 && y === 0 ? "είναι η αρχή των αξόνων" : x === 0 ? "βρίσκεται πάνω στον άξονα y′y" : "βρίσκεται πάνω στον άξονα x′x") : `βρίσκεται στο <b>${x > 0 ? (y > 0 ? "1ο" : "4ο") : (y > 0 ? "2ο" : "3ο")} τεταρτημόριο</b>`;
      $(".wout", box).innerHTML = `Το Α(${x}, ${y}) ${q}: τετμημένη ${x}, τεταγμένη ${y}.${sy ? ` Συμμετρικό ως προς x′x: (${x}, ${-y}) · ως προς y′y: (${-x}, ${y}) · ως προς την αρχή Ο: (${-x}, ${-y}).` : ""}`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 8.2 Αντιστοιχία ---------- */
  mapping(box) {
    const R = [["y = 2x + 1", x => 2 * x + 1, true], ["y = x²", x => x * x, true], ["y = 10 − x", x => 10 - x, true], ["x ↦ διαιρέτες του x (δεν είναι συνάρτηση)", null, false]];
    box.innerHTML = `<div class="wctl"><label>αντιστοιχία <select class="sr">${R.map((r, i) => `<option value="${i}">${r[0]}</option>`).join("")}</select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const k = +$(".sr", box).value, r = R[k], A = r[1] ? [-2, -1, 0, 1, 2] : [2, 3, 4, 6], svg = gyCanvas(box, 560, 260);
      let pairs = []; if (r[1]) pairs = A.map(x => [x, r[1](x)]); else A.forEach(x => gyDivs(x).filter(d => d > 1).forEach(d => pairs.push([x, d])));
      const Bv = [...new Set(pairs.map(p => p[1]))].sort((a, b) => a - b);
      gyAdd(svg, "ellipse", { cx: 130, cy: 130, rx: 70, ry: 115, style: "fill:rgba(15,111,209,.08);stroke:var(--blue);stroke-width:2" }); gyAdd(svg, "ellipse", { cx: 430, cy: 130, rx: 70, ry: 115, style: "fill:rgba(214,138,0,.08);stroke:var(--amber);stroke-width:2" });
      const ya = i => 40 + i * 180 / Math.max(1, A.length - 1), yb = i => 30 + i * 200 / Math.max(1, Bv.length - 1);
      pairs.forEach(([x, y]) => gyAdd(svg, "line", { x1: 150, y1: ya(A.indexOf(x)), x2: 410, y2: yb(Bv.indexOf(y)), style: "stroke:var(--navy);stroke-width:1.6;opacity:.7" }));
      A.forEach((x, i) => gyAdd(svg, "text", { x: 130, y: ya(i) + 5, "text-anchor": "middle", style: gyTS }, x)); Bv.forEach((y, i) => gyAdd(svg, "text", { x: 430, y: yb(i) + 5, "text-anchor": "middle", style: gyTS }, y));
      $(".wout", box).innerHTML = r[2] ? `<b>Συνάρτηση</b>: κάθε στοιχείο του Α αντιστοιχίζεται σε <b>ένα μόνο</b> στοιχείο. Ζεύγη: ${pairs.map(p => `(${p[0]}, ${p[1]})`).join(", ")}.`
        : `<b>Δεν είναι συνάρτηση</b>: π.χ. το 6 αντιστοιχίζεται σε περισσότερα από ένα στοιχεία (2, 3, 6).`;
    }
    $(".sr", box).onchange = draw; draw();
  },

  /* ---------- 9.1 Παράλληλες και τέμνουσα ---------- */
  parallels(box) {
    box.innerHTML = `<div class="wctl"><label>γωνία τέμνουσας <input type="range" class="rw" min="25" max="155" value="60"><b class="vw"></b></label>
      <label>ζεύγος <select class="sp"><option value="0">εντός εναλλάξ</option><option value="1">εντός εκτός και επί τα αυτά</option><option value="2">εντός και επί τα αυτά</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const w = +$(".rw", box).value, t = +$(".sp", box).value; $(".vw", box).textContent = w + "°";
      const P = gPlot($(".pl", box), 0, 0, 3, 300, false), h = 0.9, c = Math.cos(gRad(w)), s = Math.sin(gRad(w)), k = h / s;
      gLine(P, -3, h, 3, h, "stroke:var(--navy);stroke-width:3"); gLine(P, -3, -h, 3, -h, "stroke:var(--navy);stroke-width:3"); gText(P, 2.8, h + 0.25, "ε₁"); gText(P, 2.8, -h + 0.25, "ε₂");
      gLine(P, -2 * k * c, -2 * h, 2 * k * c, 2 * h, "stroke:var(--purple);stroke-width:2.4");
      const X1 = k * c, X2 = -k * c; P.dot(X1, h, "d2"); P.dot(X2, -h, "d2");
      const col1 = "var(--red)", col2 = "var(--blue)";
      if (t === 0) { gArc(P, X1, h, 180, 180 + w, 0.35, col1, w + "°", 0.6); gArc(P, X2, -h, 0, w, 0.35, col1, w + "°", 0.6); }
      if (t === 1) { gArc(P, X1, h, 0, w, 0.35, col1, w + "°", 0.6); gArc(P, X2, -h, 0, w, 0.35, col1, w + "°", 0.6); }
      if (t === 2) { gArc(P, X1, h, 180 + w, 360, 0.35, col2, (180 - w) + "°", 0.6); gArc(P, X2, -h, 0, w, 0.35, col1, w + "°", 0.6); }
      const msg = ["Οι <b>εντός εναλλάξ</b> γωνίες είναι <b>ίσες</b>", "Οι <b>εντός εκτός και επί τα αυτά</b> (αντίστοιχες) γωνίες είναι <b>ίσες</b>", "Οι <b>εντός και επί τα αυτά</b> γωνίες είναι <b>παραπληρωματικές</b>"][t];
      $(".wout", box).innerHTML = `${msg}: ${t === 2 ? `${w}° + ${180 - w}° = 180°` : `${w}° = ${w}°`}.
        <br><span class="muted">Ισχύουν όταν ε₁ ∥ ε₂. Και αντίστροφα: αν δύο ευθείες τεμνόμενες από τρίτη σχηματίζουν ίσες εντός εναλλάξ γωνίες, είναι παράλληλες.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 9.2 Γωνίες τριγώνου ---------- */
  triangleG(box) {
    box.innerHTML = `<div class="wctl"><label>B̂ <input type="range" class="rb" min="10" max="150" value="70"><b class="vb"></b></label>
      <label>Γ̂ <input type="range" class="rc" min="10" max="150" value="50"><b class="vc"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      let B = +$(".rb", box).value, C = +$(".rc", box).value; if (B + C > 170) { C = 170 - B; $(".rc", box).value = C; }
      $(".vb", box).textContent = B + "°"; $(".vc", box).textContent = C + "°"; const A = 180 - B - C;
      const a = 4, tb = Math.tan(gRad(B)), tc = Math.tan(gRad(C)), xa = a * tc / (tb + tc), ya = xa * tb;
      const sc = Math.min(1, 2.6 / Math.max(ya, 0.01)), Bp = [-2, -1.2], Cp = [2, -1.2], Ap = [-2 + xa, -1.2 + ya * sc];
      const P = gPlot($(".pl", box), 0.4, 0.3, 3.4, 300, false);
      P.layer.appendChild(svgEl("polygon", { points: [Ap, Bp, Cp].map(p => P.sx(p[0]) + "," + P.sy(p[1])).join(" "), style: "fill:rgba(15,111,209,.12);stroke:var(--navy);stroke-width:2.6" }));
      gLine(P, ...Cp, 3.6, -1.2, "stroke:var(--navy);stroke-width:2;stroke-dasharray:6 4");
      gAngMark(P, Bp, Cp, Ap, 0.4, "var(--blue)", B + "°"); gAngMark(P, Cp, Ap, Bp, 0.4, "var(--green)", C + "°"); gAngMark(P, Ap, Bp, Cp, 0.35, "var(--red)", A + "°"); gAngMark(P, Cp, [3.6, -1.2], Ap, 0.55, "var(--purple)", (180 - C) + "°");
      P.dot(...Ap, "d2", "Α", 6, -8); P.dot(...Bp, "d2", "Β", -16, 16); P.dot(...Cp, "d2", "Γ", 4, 18);
      const kind = A === 90 || B === 90 || C === 90 ? "ορθογώνιο" : (A > 90 || B > 90 || C > 90) ? "αμβλυγώνιο" : "οξυγώνιο";
      const sides = A === B && B === C ? "ισόπλευρο" : (A === B || B === C || A === C) ? "ισοσκελές" : "σκαληνό";
      $(".wout", box).innerHTML = `Â + B̂ + Γ̂ = ${A}° + ${B}° + ${C}° = <b>180°</b> · Το τρίγωνο είναι <b>${kind}</b> και <b>${sides}</b>.
        <br><span style="color:var(--purple)">Εξωτερική γωνία στο Γ: <b>${180 - C}° = Â + B̂ = ${A}° + ${B}°</b></span> (ίση με το άθροισμα των δύο απέναντι εσωτερικών).`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 9.3 Δευτερεύοντα στοιχεία ---------- */
  trisec(box) {
    box.innerHTML = `<div class="wctl"><label>κορυφή Α <input type="range" class="rx" min="-2.5" max="2.5" step="0.1" value="-0.8"><b class="vx"></b></label>
      <label><input type="checkbox" class="c1" checked> διάμεσος</label><label><input type="checkbox" class="c2" checked> ύψος</label><label><input type="checkbox" class="c3"> διχοτόμος</label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const x = +$(".rx", box).value; $(".vx", box).textContent = fmt(x);
      const A = [x, 2.2], B = [-2, -1], C = [2.4, -1], P = gPlot($(".pl", box), 0.2, 0.6, 3.4, 300, false);
      P.layer.appendChild(svgEl("polygon", { points: [A, B, C].map(p => P.sx(p[0]) + "," + P.sy(p[1])).join(" "), style: "fill:rgba(15,111,209,.08);stroke:var(--navy);stroke-width:2.6" }));
      const out = [];
      if ($(".c1", box).checked) { const M = [(B[0] + C[0]) / 2, -1]; gLine(P, ...A, ...M, "stroke:var(--green);stroke-width:2.4"); P.dot(...M, "dmax", "Μ", 4, 18); out.push(`<span style="color:var(--green)">διάμεσος ΑΜ: ενώνει το Α με το <b>μέσο</b> Μ της ΒΓ (ΒΜ = ΜΓ = ${fmt((C[0] - B[0]) / 2)})</span>`); }
      if ($(".c2", box).checked) { const H = [x, -1]; if (x < B[0] || x > C[0]) gLine(P, B[0], -1, x, -1, "stroke:var(--navy);stroke-width:1.5;stroke-dasharray:5 4"); gLine(P, ...A, ...H, "stroke:var(--red);stroke-width:2.4"); P.dot(...H, "dmin", "Δ", 4, 18); out.push(`<span style="color:var(--red)">ύψος ΑΔ: <b>κάθετο</b> από το Α στην (ευθεία) ΒΓ${x < B[0] || x > C[0] ? " — εδώ πέφτει έξω από το τρίγωνο" : ""}</span>`); }
      if ($(".c3", box).checked) { const b = Math.hypot(A[0] - C[0], A[1] - C[1]), c = Math.hypot(A[0] - B[0], A[1] - B[1]), D = [B[0] + (C[0] - B[0]) * c / (b + c), -1]; gLine(P, ...A, ...D, "stroke:var(--purple);stroke-width:2.4"); P.dot(...D, "dinf", "Ε", 4, 18); out.push(`<span style="color:var(--purple)">διχοτόμος ΑΕ: χωρίζει τη γωνία Α σε δύο <b>ίσες</b> γωνίες</span>`); }
      P.dot(...A, "d2", "Α", 6, -8); P.dot(...B, "d2", "Β", -16, 16); P.dot(...C, "d2", "Γ", 6, 16);
      $(".wout", box).innerHTML = (out.join("<br>") || "Διάλεξε στοιχείο.") + `<br><span class="muted">Κάθε τρίγωνο έχει τρεις διαμέσους, τρία ύψη και τρεις διχοτόμους. Στο ισοσκελές τρίγωνο, από την κορυφή, συμπίπτουν (μετακίνησε το Α στο ${fmt((B[0] + C[0]) / 2)}).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 10 Λόγοι – ποσοστά ---------- */
  ratioG(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="1" max="40" value="12"><b class="va"></b></label>
      <label>β <input type="range" class="rb" min="1" max="40" value="18"><b class="vb"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, b = +$(".rb", box).value; $(".va", box).textContent = a; $(".vb", box).textContent = b;
      const g = gcdI(a, b), svg = gyCanvas(box, 560, 120), tot = a + b, W = 520;
      gyAdd(svg, "rect", { x: 20, y: 30, width: W * a / tot, height: 44, style: "fill:var(--blue);fill-opacity:.55" }); gyAdd(svg, "rect", { x: 20 + W * a / tot, y: 30, width: W * b / tot, height: 44, style: "fill:var(--amber);fill-opacity:.55" });
      gyAdd(svg, "text", { x: 20 + W * a / tot / 2, y: 58, "text-anchor": "middle", style: gyTS }, `${fmt(100 * a / tot)}%`); gyAdd(svg, "text", { x: 20 + W * a / tot + W * b / tot / 2, y: 58, "text-anchor": "middle", style: gyTS }, `${fmt(100 * b / tot)}%`);
      $(".wout", box).innerHTML = `Λόγος <b>α : β = ${a} : ${b} = ${a / g} : ${b / g}</b> = ${gyF(a, b)} ≈ ${fmt(a / b)}
        <br>Το α είναι το <b>${fmt(100 * a / b)}%</b> του β · το α είναι το <b>${fmt(100 * a / tot)}%</b> του συνόλου α + β = ${tot}.
        <br><span class="muted">Μοιρασμός ${tot} σε λόγο ${a / g} : ${b / g}: κάθε «μερίδιο» είναι ${fmt(tot / (a / g + b / g))}, άρα ${a} και ${b}. Αναλογία: ${a}/${b} = ${a * 2}/${b * 2} (χιαστί: ${a}·${b * 2} = ${b}·${a * 2}).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 11.2 Διαγράμματα ---------- */
  chartsG(box) {
    const DS = [["Αγαπημένο άθλημα (30 μαθητές)", ["Ποδόσφαιρο", "Μπάσκετ", "Κολύμβηση", "Τένις", "Βόλεϊ"], [10, 8, 5, 3, 4]], ["Μέσο μετακίνησης (40 μαθητές)", ["Με τα πόδια", "Αυτοκίνητο", "Λεωφορείο", "Ποδήλατο"], [12, 16, 8, 4]], ["Βαθμοί διαγωνίσματος (20 μαθητές)", ["10–12", "13–15", "16–18", "19–20"], [3, 7, 6, 4]]];
    box.innerHTML = `<div class="wctl"><label>δεδομένα <select class="sd">${DS.map((d, i) => `<option value="${i}">${d[0]}</option>`).join("")}</select></label>
      <label>διάγραμμα <select class="st"><option value="0">ραβδόγραμμα</option><option value="1">κυκλικό</option><option value="2">πίνακας συχνοτήτων</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    const COL = ["#0F6FD1", "#E0901A", "#1A9E6A", "#C2410C", "#7C3AED"];
    function draw() {
      const [nm, L, F] = DS[+$(".sd", box).value], t = +$(".st", box).value, N = F.reduce((a, b) => a + b, 0), svg = gyCanvas(box, 560, 260);
      if (t === 0) { const mx = Math.max(...F); F.forEach((f, i) => { const h = 190 * f / mx, x = 40 + i * (480 / F.length); gyAdd(svg, "rect", { x, y: 220 - h, width: 480 / F.length - 18, height: h, style: `fill:${COL[i]};fill-opacity:.75` }); gyAdd(svg, "text", { x: x + (480 / F.length - 18) / 2, y: 212 - h, "text-anchor": "middle", style: gyTS }, f); gyAdd(svg, "text", { x: x + (480 / F.length - 18) / 2, y: 242, "text-anchor": "middle", style: gyTS + ";font-size:11.5px" }, L[i]); }); gyAdd(svg, "line", { x1: 30, y1: 220, x2: 540, y2: 220, style: "stroke:var(--navy);stroke-width:2" }); }
      else if (t === 1) { let a0 = -90; F.forEach((f, i) => { const a1 = a0 + 360 * f / N, r = 105, cx = 160, cy = 130, p = (a) => [cx + r * Math.cos(gRad(a)), cy + r * Math.sin(gRad(a))], [x0, y0] = p(a0), [x1, y1] = p(a1);
          gyAdd(svg, "path", { d: `M${cx},${cy}L${x0},${y0}A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1},${y1}Z`, style: `fill:${COL[i]};fill-opacity:.8;stroke:#fff;stroke-width:2` });
          gyAdd(svg, "rect", { x: 300, y: 40 + i * 34, width: 18, height: 18, style: `fill:${COL[i]}` }); gyAdd(svg, "text", { x: 326, y: 54 + i * 34, style: gyTS + ";font-size:13px" }, `${L[i]}: ${fmt(360 * f / N)}°`); a0 = a1; }); }
      else { gyAdd(svg, "text", { x: 20, y: 30, style: gyTS }, "Τιμή"); gyAdd(svg, "text", { x: 220, y: 30, style: gyTS }, "Συχνότητα"); gyAdd(svg, "text", { x: 340, y: 30, style: gyTS }, "Ποσοστό"); F.forEach((f, i) => { const y = 62 + i * 32; gyAdd(svg, "text", { x: 20, y, style: gyTS + ";font-weight:600" }, L[i]); gyAdd(svg, "text", { x: 250, y, style: gyTS }, f); gyAdd(svg, "text", { x: 360, y, style: gyTS }, `${fmt(100 * f / N)}%`); }); gyAdd(svg, "text", { x: 20, y: 62 + F.length * 32, style: gyTS }, "Σύνολο"); gyAdd(svg, "text", { x: 250, y: 62 + F.length * 32, style: gyTS }, N); gyAdd(svg, "text", { x: 360, y: 62 + F.length * 32, style: gyTS }, "100%"); }
      const mx = Math.max(...F);
      $(".wout", box).innerHTML = `${nm} · σύνολο Ν = ${N} · τη μεγαλύτερη συχνότητα έχει: ${L[F.indexOf(mx)]} (${mx}, δηλαδή ${fmt(100 * mx / N)}%).
        <br><span class="muted">Ποσοστό = συχνότητα / Ν · 100%. Στο κυκλικό διάγραμμα κάθε τομέας έχει γωνία 360° · (συχνότητα / Ν), π.χ. ${L[0]}: 360° · ${F[0]}/${N} = ${fmt(360 * F[0] / N)}°.</span>`;
    }
    box.querySelectorAll("select").forEach(i => i.onchange = draw); draw();
  },

  /* ---------- 11.3 Πιθανότητα με σφαιρίδια ---------- */
  urn(box) {
    box.innerHTML = `<div class="wctl"><label>κόκκινες <input type="range" class="rr" min="0" max="10" value="3"><b class="vr"></b></label>
      <label>μπλε <input type="range" class="rb" min="0" max="10" value="5"><b class="vb"></b></label><label>πράσινες <input type="range" class="rg" min="0" max="10" value="2"><b class="vg"></b></label>
      <button class="btn primary small bt">Τράβηξε 100 φορές</button></div><div class="pl"></div><div class="wout"></div>`;
    let cnt = [0, 0, 0], tr = 0;
    function draw(sim) {
      const n = [+$(".rr", box).value, +$(".rb", box).value, +$(".rg", box).value];["r", "b", "g"].forEach((k, i) => $(".v" + k, box).textContent = n[i]); const N = n[0] + n[1] + n[2];
      if (!sim) { cnt = [0, 0, 0]; tr = 0; }
      const svg = gyCanvas(box, 560, 150), cols = ["#dc3545", "#0F6FD1", "#1A9E6A"]; let k = 0;
      n.forEach((m, c) => { for (let i = 0; i < m; i++, k++) gyAdd(svg, "circle", { cx: 30 + (k % 15) * 34, cy: 30 + Math.floor(k / 15) * 34, r: 13, style: `fill:${cols[c]}` }); });
      const nm = ["κόκκινη", "μπλε", "πράσινη"];
      $(".wout", box).innerHTML = N === 0 ? "Βάλε σφαιρίδια στο κουτί." : nm.map((s, i) => `P(${s}) = ${n[i]}/${N}${n[i] && gcdI(n[i], N) > 1 ? " = " + gyF(n[i], N) : ""} ≈ <b>${fmt(n[i] / N)}</b>${tr ? ` · σχετική συχνότητα σε ${tr} δοκιμές: ${fmt(cnt[i] / tr)}` : ""}`).join("<br>") + `<br><span class="muted">P(Α) = ευνοϊκές περιπτώσεις / δυνατές περιπτώσεις (όταν όλες είναι ισοπίθανες). Με πολλές δοκιμές η σχετική συχνότητα πλησιάζει την πιθανότητα.</span>`;
    }
    $(".bt", box).onclick = () => { const n = [+$(".rr", box).value, +$(".rb", box).value, +$(".rg", box).value], N = n[0] + n[1] + n[2]; if (!N) return; for (let i = 0; i < 100; i++) { let u = Math.random() * N; cnt[u < n[0] ? 0 : u < n[0] + n[1] ? 1 : 2]++; } tr += 100; draw(true); };
    box.querySelectorAll("input").forEach(i => i.oninput = () => draw(false)); draw(false);
  }
});

var GENS = Object.assign(window.GENS || {}, {
  gyfrac: { title: "Γεννήτρια — πράξεις κλασμάτων", make() {
    const t = ri(0, 2); let a, b, c, d; do { a = ri(1, 8); b = ri(2, 9); c = ri(1, 8); d = ri(2, 9); } while (gcdI(a, b) > 1 || gcdI(c, d) > 1);
    if (t === 0) return { q: R`Να υπολογίσετε: $\dfrac{${a}}{${b}} + \dfrac{${c}}{${d}}$ (σε ανάγωγο κλάσμα).`, fields: [{ label: "=", ans: gyF(a * d + c * b, b * d) }],
      sol: R`ΕΚΠ$(${b}, ${d}) = ${gyLcm(b, d)}$: $\frac{${a}}{${b}} + \frac{${c}}{${d}} = \frac{${a * gyLcm(b, d) / b} + ${c * gyLcm(b, d) / d}}{${gyLcm(b, d)}} = ${gyT(a * d + c * b, b * d)}$.` };
    if (t === 1) return { q: R`Να υπολογίσετε: $\dfrac{${a}}{${b}} \cdot \dfrac{${c}}{${d}}$ (σε ανάγωγο κλάσμα).`, fields: [{ label: "=", ans: gyF(a * c, b * d) }],
      sol: R`$\frac{${a}\cdot ${c}}{${b}\cdot ${d}} = \frac{${a * c}}{${b * d}} = ${gyT(a * c, b * d)}$.` };
    return { q: R`Να υπολογίσετε: $\dfrac{${a}}{${b}} : \dfrac{${c}}{${d}}$ (σε ανάγωγο κλάσμα).`, fields: [{ label: "=", ans: gyF(a * d, b * c) }],
      sol: R`Πολλαπλασιάζουμε με το αντίστροφο: $\frac{${a}}{${b}}\cdot\frac{${d}}{${c}} = \frac{${a * d}}{${b * c}} = ${gyT(a * d, b * c)}$.` };
  } },
  gyset: { title: "Γεννήτρια — πράξεις συνόλων", make() {
    const x = bkPick([12, 18, 20, 24, 30]), y = bkPick([8, 15, 16, 27, 36].filter(v => v !== x)), A = gyDivs(x), B = gyDivs(y), I = A.filter(v => B.includes(v)), U = [...new Set([...A, ...B])], t = ri(0, 2);
    const f = [["Α ∩ Β", I], ["Α ∪ Β", U], ["Α′ (με σύνολο αναφοράς Ω = {1, 2, …, " + Math.max(x, y) + "})", [...Array(Math.max(x, y))].map((_, i) => i + 1).filter(v => !A.includes(v))]][t];
    return { q: R`Α = το σύνολο των διαιρετών του ${x} και Β = το σύνολο των διαιρετών του ${y}. Πόσα στοιχεία έχει το σύνολο ${f[0]};`, fields: [{ label: "πλήθος =", ans: f[1].length }],
      sol: R`Α = {${A.join(", ")}}, Β = {${B.join(", ")}}. ${f[0]} = {${f[1].join(", ")}}: <b>${f[1].length}</b> στοιχεία.` };
  } },
  gypow: { title: "Γεννήτρια — δυνάμεις και προτεραιότητα πράξεων", make() {
    const t = ri(0, 2);
    if (t === 0) { const a = ri(2, 6), n = ri(2, 4); return { q: R`Να υπολογίσετε τη δύναμη $${a}^{${n}}$.`, fields: [{ label: "=", ans: a ** n }], sol: R`$${a}^{${n}} = ${Array(n).fill(a).join("\\cdot ")} = ${a ** n}$.` }; }
    if (t === 1) { const a = ri(2, 9), b = ri(2, 5), c = ri(2, 3), d = ri(2, 9); const v = a + b ** c * d; return { q: R`Να υπολογίσετε την τιμή της παράστασης $${a} + ${b}^{${c}}\cdot ${d}$.`, fields: [{ label: "=", ans: v }], sol: R`Πρώτα η δύναμη, μετά ο πολλαπλασιασμός, τέλος η πρόσθεση: $${a} + ${b ** c}\cdot ${d} = ${a} + ${b ** c * d} = ${v}$.` }; }
    const a = ri(2, 6), b = ri(2, 4), c = ri(2, 5), v = (a + c) * b ** 2; return { q: R`Να υπολογίσετε την τιμή της παράστασης $(${a} + ${c})\cdot ${b}^2$.`, fields: [{ label: "=", ans: v }], sol: R`Πρώτα η παρένθεση, μετά η δύναμη: $${a + c}\cdot ${b * b} = ${v}$.` };
  } },
  gynumsys: { title: "Γεννήτρια — συστήματα αρίθμησης", make() {
    const t = ri(0, 2);
    if (t === 0) { const n = ri(5, 63), b = n.toString(2); return { q: R`Να γράψετε τον δυαδικό αριθμό $${b}_{(2)}$ στο δεκαδικό σύστημα.`, fields: [{ label: "=", ans: n }], sol: R`$${b}_{(2)} = ${b.split("").map((x, i) => x === "1" ? `2^{${b.length - 1 - i}}` : null).filter(Boolean).join(" + ")} = ${n}$.` }; }
    if (t === 1) { const n = ri(5, 40), b = n.toString(2); return { q: R`Να γράψετε τον δεκαδικό αριθμό $${n}$ στο δυαδικό σύστημα (γράψε μόνο τα ψηφία, π.χ. <code>1011</code>).`, fields: [{ label: "=", ans: +b }], sol: R`Διαδοχικές διαιρέσεις με το 2 (κρατάμε τα υπόλοιπα από κάτω προς τα πάνω): $${n} = ${b}_{(2)}$.` }; }
    const n = ri(102, 3999), ds = String(n).split("").map(Number); return { q: R`Πόσα σύμβολα χρειάζονται για να γραφεί ο αριθμός $${n}$ στο αιγυπτιακό σύστημα αρίθμησης;`, fields: [{ label: "σύμβολα =", ans: ds.reduce((a, b) => a + b, 0) }], sol: R`Ένα σύμβολο για κάθε μονάδα κάθε τάξης: $${ds.join(" + ")} = ${ds.reduce((a, b) => a + b, 0)}$ σύμβολα.` };
  } },
  gyval: { title: "Γεννήτρια — αριθμητική τιμή παράστασης", make() {
    const a = ri(2, 5), b = ri(1, 9), x = ri(1, 6), t = ri(0, 1);
    if (t === 0) return { q: R`Να βρείτε την αριθμητική τιμή της παράστασης $${a}x + ${b}$ για $x = ${x}$.`, fields: [{ label: "=", ans: a * x + b }], sol: R`$${a}\cdot ${x} + ${b} = ${a * x} + ${b} = ${a * x + b}$.` };
    const y = ri(1, 5); return { q: R`Να βρείτε την αριθμητική τιμή της παράστασης $x^2 + ${a}xy - ${b}$ για $x = ${x}$, $y = ${y}$.`, fields: [{ label: "=", ans: x * x + a * x * y - b }], sol: R`$${x}^2 + ${a}\cdot ${x}\cdot ${y} - ${b} = ${x * x} + ${a * x * y} - ${b} = ${x * x + a * x * y - b}$.` };
  } },
  gyeq: { title: "Γεννήτρια — εξισώσεις", make() {
    const t = ri(0, 2), x = ri(1, 12), a = ri(2, 9), b = ri(1, 20);
    if (t === 0) return { q: R`Να λύσετε την εξίσωση $x + ${b} = ${x + b}$.`, fields: [{ label: "x =", ans: x }], sol: R`$x = ${x + b} - ${b} = ${x}$.` };
    if (t === 1) return { q: R`Να λύσετε την εξίσωση $${a}x = ${a * x}$.`, fields: [{ label: "x =", ans: x }], sol: R`$x = ${a * x} : ${a} = ${x}$.` };
    return { q: R`Να λύσετε την εξίσωση $${a}x + ${b} = ${a * x + b}$.`, fields: [{ label: "x =", ans: x }], sol: R`$${a}x = ${a * x + b} - ${b} = ${a * x} \Rightarrow x = ${x}$.` };
  } },
  gyeuclid: { title: "Γεννήτρια — ευκλείδεια διαίρεση", make() {
    const d = ri(3, 15), q = ri(2, 30), r = ri(0, d - 1), D = d * q + r;
    return { q: R`Να κάνετε την ευκλείδεια διαίρεση $${D} : ${d}$ και να γράψετε την ταυτότητα $\Delta = \delta\cdot\pi + \upsilon$.`, fields: [{ label: "π =", ans: q }, { label: "υ =", ans: r }], sol: R`$${D} = ${d}\cdot ${q} + ${r}$, με $0 \le ${r} < ${d}$.` };
  } },
  gycrit: { title: "Γεννήτρια — κριτήρια διαιρετότητας", make() {
    const k = bkPick([3, 9, 4, 6]);
    const pre = ri(1, 9), post = ri(0, 9), cands = [...Array(10)].map((_, d) => +(`${pre}${d}${post}`)).map((n, d) => [d, n]).filter(([d, n]) => n % k === 0);
    if (!cands.length) return GENS.gycrit.make();
    const ds = cands.map(c => c[0]);
    return { q: R`Ποιο είναι το <b>μικρότερο</b> ψηφίο $\square$ ώστε ο αριθμός $${pre}\square ${post}$ να διαιρείται με το $${k}$;`, fields: [{ label: "□ =", ans: ds[0] }],
      sol: R`Δοκιμάζοντας με το κριτήριο του ${k}${k === 3 || k === 9 ? " (άθροισμα ψηφίων)" : k === 4 ? " (τελευταία δύο ψηφία)" : " (διαιρείται με 2 και με 3)"}: κατάλληλα ψηφία ${ds.join(", ")}· το μικρότερο είναι το <b>${ds[0]}</b> (αριθμός ${cands[0][1]}).` };
  } },
  gyfactor: { title: "Γεννήτρια — ανάλυση σε πρώτους παράγοντες", make() {
    const n = bkPick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 60, 63, 72, 75, 80, 84, 90, 96, 100, 108, 120, 126, 150, 180, 200, 210, 225, 252, 300]);
    const f = gyPF(n), c2 = f.filter(p => p === 2).length, c3 = f.filter(p => p === 3).length, c5 = f.filter(p => p === 5).length;
    return { q: R`Να αναλύσετε τον $${n}$ σε γινόμενο πρώτων παραγόντων: $${n} = 2^{\alpha}\cdot 3^{\beta}\cdot 5^{\gamma}\cdots$ Να δώσετε τα $\alpha, \beta, \gamma$ (0 αν δεν εμφανίζεται).`,
      fields: [{ label: "α =", ans: c2 }, { label: "β =", ans: c3 }, { label: "γ =", ans: c5 }], sol: R`$${n} = ${f.join("\\cdot ")} = ${gyPFT(n)}$.` };
  } },
  gygcd: { title: "Γεννήτρια — ΜΚΔ και ΕΚΠ", make() {
    const g = ri(2, 12), a = g * ri(1, 7), b = g * ri(2, 8); if (a === b) return GENS.gygcd.make();
    return { q: R`Να βρείτε τον ΜΚΔ και το ΕΚΠ των αριθμών $${a}$ και $${b}$.`, fields: [{ label: "ΜΚΔ =", ans: gcdI(a, b) }, { label: "ΕΚΠ =", ans: gyLcm(a, b) }],
      sol: R`$${a} = ${gyPF(a).join("\\cdot ") || 1}$, $${b} = ${gyPF(b).join("\\cdot ")}$. ΜΚΔ = γινόμενο κοινών παραγόντων = $${gcdI(a, b)}$, ΕΚΠ = $${gyLcm(a, b)}$ (έλεγχος: $${gcdI(a, b)}\cdot ${gyLcm(a, b)} = ${a * b} = ${a}\cdot ${b}$).` };
  } },
  gyadd: { title: "Γεννήτρια — πρόσθεση και αφαίρεση ρητών", make() {
    const t = ri(0, 2);
    if (t < 2) { const a = gyNZ(-20, 20), b = gyNZ(-20, 20), c = gyNZ(-15, 15), v = a - b + c; return { q: R`Να υπολογίσετε: $${a} - ${gyParT(b)} + ${gyParT(c)}$.`, fields: [{ label: "=", ans: v }], sol: R`$${a} ${b < 0 ? "+ " + (-b) : "- " + b} ${c < 0 ? "- " + (-c) : "+ " + c} = ${v}$.` }; }
    let p, q, r, s; do { p = gyNZ(-7, 7); q = ri(2, 6); r = gyNZ(-7, 7); s = ri(2, 6); } while (gcdI(p, q) > 1 || gcdI(r, s) > 1 || q === s);
    const L = gyLcm(q, s), N = p * L / q + r * L / s;
    return { q: R`Να υπολογίσετε: $${gyT(p, q)} + ${r < 0 ? `\\left(${gyT(r, s)}\\right)` : gyT(r, s)}$ (σε ανάγωγο κλάσμα).`, fields: [{ label: "=", ans: gyF(N, L) }], sol: R`ΕΚΠ$(${q}, ${s}) = ${L}$: $\frac{${p * L / q}}{${L}} + \frac{${r * L / s}}{${L}} = \frac{${N}}{${L}}${gcdI(N, L) > 1 ? ` = ${gyT(N, L)}` : ""}$.` };
  } },
  gycmp: { title: "Γεννήτρια — σύγκριση ρητών", make() {
    let p, q, r, s; do { p = gyNZ(-9, 9); q = ri(2, 9); r = gyNZ(-9, 9); s = ri(2, 9); } while (gcdI(p, q) > 1 || gcdI(r, s) > 1 || p * s === r * q);
    return bkMC({ q: R`Να συγκρίνετε τους ρητούς $${gyT(p, q)}$ και $${gyT(r, s)}$.`, sol: R`${p * r < 0 ? "Ο θετικός είναι μεγαλύτερος από τον αρνητικό. " : ""}Ομώνυμα: $\frac{${p * s}}{${q * s}}$ και $\frac{${r * q}}{${q * s}}$. Άρα $${gyT(p, q)} ${p * s < r * q ? "<" : ">"} ${gyT(r, s)}$.` },
      [`$${gyT(p, q)} < ${gyT(r, s)}$`, `$${gyT(p, q)} > ${gyT(r, s)}$`, `$${gyT(p, q)} = ${gyT(r, s)}$`], p * s < r * q ? 0 : 1);
  } },
  gymul: { title: "Γεννήτρια — πολλαπλασιασμός και διαίρεση ρητών", make() {
    const t = ri(0, 2);
    if (t === 0) { const pk = () => { let v; do v = gyNZ(-9, 9); while (Math.abs(v) === 1); return v; }, a = pk(), b = pk(), c = pk(); return { q: R`Να υπολογίσετε: $${gyParT(a)}\cdot ${gyParT(b)}\cdot ${gyParT(c)}$.`, fields: [{ label: "=", ans: a * b * c }], sol: R`${[a, b, c].filter(v => v < 0).length} αρνητικοί παράγοντες ⇒ πρόσημο ${a * b * c < 0 ? "−" : "+"}: $${a * b * c}$.` }; }
    if (t === 1) { let b, q; do { b = gyNZ(-9, 9); q = gyNZ(-12, 12); } while (Math.abs(b) === 1); const a = b * q; return { q: R`Να υπολογίσετε: $${gyParT(a)} : ${gyParT(b)}$.`, fields: [{ label: "=", ans: q }], sol: R`${a * b > 0 ? "Ομόσημοι ⇒ θετικό" : "Ετερόσημοι ⇒ αρνητικό"}: $${q}$.` }; }
    let p, q, r, s; do { p = gyNZ(-6, 6); q = ri(2, 7); r = gyNZ(-6, 6); s = ri(2, 7); } while (gcdI(p, q) > 1 || gcdI(r, s) > 1); return { q: R`Να υπολογίσετε: $\left(${gyT(p, q)}\right) : \left(${gyT(r, s)}\right)$ (σε ανάγωγο κλάσμα).`, fields: [{ label: "=", ans: gyF(p * s, q * r) }], sol: R`$${gyT(p, q)}\cdot ${gyT(s, r)} = ${gyT(p * s, q * r)}$.` };
  } },
  gyrpow: { title: "Γεννήτρια — δυνάμεις ρητών", make() {
    const t = ri(0, 2), a = ri(2, 5), n = ri(2, 5);
    if (t === 0) return { q: R`Να υπολογίσετε τη δύναμη $(-${a})^{${n}}$.`, fields: [{ label: "=", ans: (-a) ** n }], sol: R`Αρνητική βάση με ${n % 2 ? "περιττό" : "άρτιο"} εκθέτη ⇒ ${n % 2 ? "αρνητικό" : "θετικό"}: $(-${a})^{${n}} = ${(-a) ** n}$.` };
    if (t === 1) return { q: R`Να υπολογίσετε: $-${a}^{${n}}$.`, fields: [{ label: "=", ans: -(a ** n) }], sol: R`Ο εκθέτης αφορά μόνο το ${a}: $-${a}^{${n}} = -(${a}^{${n}}) = ${-(a ** n)}$.` };
    const p = ri(1, 4), q = ri(2, 5), k = ri(2, 3); if (gcdI(p, q) > 1) return GENS.gyrpow.make(); return { q: R`Να υπολογίσετε τη δύναμη $\left(-\frac{${p}}{${q}}\right)^{${k}}$.`, fields: [{ label: "=", ans: gyF((-p) ** k, q ** k) }], sol: R`$\left(-\frac{${p}}{${q}}\right)^{${k}} = ${k % 2 ? "-" : ""}\frac{${p ** k}}{${q ** k}}$ (${k % 2 ? "περιττός" : "άρτιος"} εκθέτης).` };
  } },
  gyper: { title: "Γεννήτρια — περιοδικοί δεκαδικοί σε κλάσμα", make() {
    const t = ri(0, 1);
    if (t === 0) { const d = ri(1, 8); return { q: R`Να γράψετε τον περιοδικό αριθμό $0,\overline{${d}}$ ως κλάσμα.`, fields: [{ label: "=", ans: gyF(d, 9) }], sol: R`$x = 0,\overline{${d}} \Rightarrow 10x = ${d},\overline{${d}} \Rightarrow 9x = ${d} \Rightarrow x = ${gyT(d, 9)}$.` }; }
    const ab = ri(10, 98); if (ab % 11 === 0) return GENS.gyper.make(); return { q: R`Να γράψετε τον περιοδικό αριθμό $0,\overline{${ab}}$ ως κλάσμα.`, fields: [{ label: "=", ans: gyF(ab, 99) }], sol: R`$x = 0,\overline{${ab}} \Rightarrow 100x = ${ab},\overline{${ab}} \Rightarrow 99x = ${ab} \Rightarrow x = ${gyT(ab, 99)}$.` };
  } },
  gyeqq: { title: "Γεννήτρια — εξισώσεις στους ρητούς", make() {
    const t = ri(0, 1);
    if (t === 0) { let a; do a = gyNZ(-6, 6); while (Math.abs(a) === 1); const x = gyNZ(-9, 9), b = gyNZ(-12, 12); return { q: R`Να λύσετε την εξίσωση $${gyC(a)}${gyS(b)} = ${a * x + b}$.`, fields: [{ label: "x =", ans: x }], sol: R`$${gyC(a)} = ${a * x + b} ${b < 0 ? "+" : "-"} ${Math.abs(b)} = ${a * x} \Rightarrow x = ${a * x} : ${gyParT(a)} = ${x}$.` }; }
    const a = ri(2, 5), b = ri(2, 6), c = ri(-9, 9); return { q: R`Να λύσετε την εξίσωση $\dfrac{x}{${a}} - ${b} = ${c}$.`, fields: [{ label: "x =", ans: a * (c + b) }], sol: R`$\frac{x}{${a}} = ${c} + ${b} = ${c + b} \Rightarrow x = ${a}\cdot ${gyParT(c + b)} = ${a * (c + b)}$.` };
  } },
  gyseq: { title: "Γεννήτρια — ακολουθίες", make() {
    const t = ri(0, 1), a = ri(-5, 9), d = gyNZ(-5, 6);
    if (t === 0) { const T = [0, 1, 2, 3].map(i => a + i * d); return { q: R`Να βρείτε τον επόμενο όρο της ακολουθίας $${T.join(",\\ ")},\ \dots$`, fields: [{ label: "επόμενος =", ans: a + 4 * d }], sol: R`Κάθε όρος προκύπτει από τον προηγούμενο ${d > 0 ? "προσθέτοντας" : "αφαιρώντας"} ${Math.abs(d)}: $${a + 3 * d} ${d > 0 ? "+" : "-"} ${Math.abs(d)} = ${a + 4 * d}$.` }; }
    const n = ri(8, 30); return { q: R`Δίνεται η ακολουθία με γενικό όρο $\alpha_\nu = ${gyC(d, "\\nu")}${gyS(a - d)}$. Να βρείτε τον όρο $\alpha_{${n}}$.`, fields: [{ label: `α${n} =`, ans: d * n + a - d }], sol: R`$\alpha_{${n}} = ${d === 1 ? "" : d === -1 ? "-" : d + "\\cdot "}${n}${gyS(a - d)} = ${d * n + a - d}$.` };
  } },
  gyang: { title: "Γεννήτρια — σχέσεις γωνιών", make() {
    const t = ri(0, 2), w = ri(5, 85);
    if (t === 0) return { q: R`Να βρείτε τη συμπληρωματική και την παραπληρωματική γωνία μιας γωνίας $${w}^\circ$.`, fields: [{ label: "συμπληρωματική (°) =", ans: 90 - w }, { label: "παραπληρωματική (°) =", ans: 180 - w }], sol: R`$90^\circ - ${w}^\circ = ${90 - w}^\circ$ και $180^\circ - ${w}^\circ = ${180 - w}^\circ$.` };
    if (t === 1) { const v = ri(20, 160); return { q: R`Δύο ευθείες τέμνονται και η μία από τις γωνίες που σχηματίζουν είναι $${v}^\circ$. Να βρείτε την κατακορυφήν της και μία εφεξής της.`, fields: [{ label: "κατακορυφήν (°) =", ans: v }, { label: "εφεξής (°) =", ans: 180 - v }], sol: R`Κατακορυφήν: ίση, $${v}^\circ$. Εφεξής: παραπληρωματικές, $${180 - v}^\circ$ (και οι δύο εφεξής είναι ίσες μεταξύ τους).` }; }
    const k = ri(2, 5); return { q: R`Δύο παραπληρωματικές γωνίες έχουν λόγο $1 : ${k}$. Να βρείτε τη μικρότερη.`, fields: [{ label: "μικρότερη (°) =", ans: 180 / (k + 1) }], sol: R`$x + ${k}x = 180^\circ \Rightarrow x = \frac{180^\circ}{${k + 1}} = ${fmt(180 / (k + 1))}^\circ$.` };
  } },
  gypar: { title: "Γεννήτρια — παράλληλες ευθείες και τέμνουσα", make() {
    const w = ri(25, 155), t = ri(0, 2);
    const nm = ["εντός εναλλάξ", "εντός εκτός και επί τα αυτά", "εντός και επί τα αυτά"][t], ans = t === 2 ? 180 - w : w;
    return { q: R`Δύο παράλληλες ευθείες τέμνονται από τρίτη. Μία από τις εντός γωνίες είναι $${w}^\circ$. Πόσες μοίρες είναι η <b>${nm}</b> της;`, fields: [{ label: "γωνία (°) =", ans }], sol: t === 2 ? R`Οι εντός και επί τα αυτά γωνίες είναι παραπληρωματικές: $180^\circ - ${w}^\circ = ${180 - w}^\circ$.` : R`Οι ${nm} γωνίες είναι ίσες: $${w}^\circ$.` };
  } },
  gytri: { title: "Γεννήτρια — γωνίες τριγώνου", make() {
    const t = ri(0, 2);
    if (t === 0) { const A = ri(20, 100), B = ri(20, 150 - A); return { q: R`Σε τρίγωνο $AB\Gamma$ είναι $\hat A = ${A}^\circ$ και $\hat B = ${B}^\circ$. Να βρείτε τη $\hat\Gamma$ και την εξωτερική γωνία στο $\Gamma$.`, fields: [{ label: "Γ̂ (°) =", ans: 180 - A - B }, { label: "εξωτερική (°) =", ans: A + B }], sol: R`$\hat\Gamma = 180^\circ - ${A}^\circ - ${B}^\circ = ${180 - A - B}^\circ$. Εξωτερική $= \hat A + \hat B = ${A + B}^\circ$.` }; }
    if (t === 1) { const A = 2 * ri(10, 70); return { q: R`Ισοσκελές τρίγωνο $AB\Gamma$ ($AB = A\Gamma$) έχει γωνία κορυφής $\hat A = ${A}^\circ$. Να βρείτε τις γωνίες της βάσης.`, fields: [{ label: "B̂ = Γ̂ (°) =", ans: (180 - A) / 2 }], sol: R`$\hat B = \hat\Gamma = \frac{180^\circ - ${A}^\circ}{2} = ${(180 - A) / 2}^\circ$.` }; }
    const k = ri(1, 4), m = ri(1, 4), n = ri(2, 6); if (180 % (k + m + n)) return GENS.gytri.make(); const u = 180 / (k + m + n);
    return { q: R`Οι γωνίες ενός τριγώνου είναι ανάλογες των $${k}, ${m}, ${n}$. Να βρείτε τη μεγαλύτερη γωνία.`, fields: [{ label: "μεγαλύτερη (°) =", ans: Math.max(k, m, n) * u }], sol: R`$${k}x + ${m}x + ${n}x = 180^\circ \Rightarrow x = ${u}^\circ$. Μεγαλύτερη: $${Math.max(k, m, n)}\cdot ${u}^\circ = ${Math.max(k, m, n) * u}^\circ$.` };
  } },
  gycoord: { title: "Γεννήτρια — συντεταγμένες", make() {
    const x = gyNZ(-8, 8), y = gyNZ(-8, 8), t = ri(0, 1);
    if (t === 0) return bkMC({ q: R`Σε ποιο τεταρτημόριο βρίσκεται το σημείο $A(${x}, ${y})$;`, sol: R`Τετμημένη ${x > 0 ? "θετική" : "αρνητική"}, τεταγμένη ${y > 0 ? "θετική" : "αρνητική"}: ${x > 0 ? (y > 0 ? "1ο" : "4ο") : (y > 0 ? "2ο" : "3ο")} τεταρτημόριο.` }, ["1ο", "2ο", "3ο", "4ο"], x > 0 ? (y > 0 ? 0 : 3) : (y > 0 ? 1 : 2));
    const k = ri(0, 2), nm = ["τον άξονα x′x", "τον άξονα y′y", "την αρχή Ο"][k], P2 = [[x, -y], [-x, y], [-x, -y]][k];
    return { q: R`Να βρείτε το συμμετρικό του σημείου $A(${x}, ${y})$ ως προς ${nm}.`, fields: [{ label: "x =", ans: P2[0] }, { label: "y =", ans: P2[1] }], sol: R`Συμμετρικό ως προς ${nm}: $(${P2[0]}, ${P2[1]})$ — ${k === 0 ? "αλλάζει πρόσημο η τεταγμένη" : k === 1 ? "αλλάζει πρόσημο η τετμημένη" : "αλλάζουν πρόσημο και οι δύο συντεταγμένες"}.` };
  } },
  gyfun: { title: "Γεννήτρια — τιμές συνάρτησης", make() {
    const a = gyNZ(-4, 5), b = ri(-6, 6), x = ri(-5, 5), t = ri(0, 1), f = v => a * v + b;
    const ft = gyC(a) + gyS(b);
    if (t === 0) return { q: R`Δίνεται η συνάρτηση $y = ${ft}$. Να βρείτε την τιμή της $y$ για $x = ${x}$.`, fields: [{ label: "y =", ans: f(x) }], sol: R`$y = ${a === 1 ? "" : a === -1 ? "-" : a + "\\cdot "}${a === 1 ? x : gyParT(x)}${gyS(b)} = ${f(x)}$.` };
    return { q: R`Για τη συνάρτηση $y = ${ft}$, ποια τιμή του $x$ δίνει $y = ${f(x)}$;`, fields: [{ label: "x =", ans: x }], sol: R`$${[...new Set([`${ft} = ${f(x)}`, `${gyC(a)} = ${f(x) - b}`, `x = ${x}`])].join(" \\Rightarrow ")}$.` };
  } },
  gyratio: { title: "Γεννήτρια — λόγοι και αναλογίες", make() {
    const t = ri(0, 2);
    if (t === 0) { const a = ri(1, 9), b = ri(2, 9), c = ri(2, 6); if (a === b) return GENS.gyratio.make(); return { q: R`Να βρείτε το $x$ στην αναλογία $\dfrac{${a * c}}{${b * c}} = \dfrac{x}{${b}}$.`, fields: [{ label: "x =", ans: a }], sol: R`Χιαστί: $${b * c}x = ${a * c}\cdot ${b} \Rightarrow x = ${a}$.` }; }
    if (t === 1) { const a = ri(1, 5), b = ri(1, 5), k = ri(2, 12); if (a === b) return GENS.gyratio.make(); const S = (a + b) * k; return { q: R`Να μοιράσετε ${S} € σε δύο άτομα σε λόγο $${a} : ${b}$.`, fields: [{ label: "1ο (€) =", ans: a * k }, { label: "2ο (€) =", ans: b * k }], sol: R`Σύνολο μεριδίων ${a + b}, κάθε μερίδιο ${S} : ${a + b} = ${k} €. Άρα ${a * k} € και ${b * k} €.` }; }
    const a = ri(2, 9), b = ri(2, 9); if (gcdI(a, b) > 1) return GENS.gyratio.make(); return { q: R`Να απλοποιήσετε τον λόγο $${a * 6} : ${b * 6}$ σε λόγο ακεραίων πρώτων μεταξύ τους. Δώστε το κλάσμα.`, fields: [{ label: "=", ans: gyF(a, b) }], sol: R`Διαιρούμε με ΜΚΔ$(${a * 6}, ${b * 6}) = ${gcdI(a * 6, b * 6)}$: $${gyT(a, b)}$.` };
  } },
  gypct: { title: "Γεννήτρια — ποσοστά", make() {
    const t = ri(0, 2), p = bkPick([5, 10, 12, 15, 20, 25, 30, 40, 75]), A = bkPick([40, 60, 80, 120, 200, 240, 300, 500]);
    if (t === 0) return { q: R`Να υπολογίσετε το $${p}\%$ του $${A}$.`, fields: [{ label: "=", ans: p * A / 100 }], sol: R`$\frac{${p}}{100}\cdot ${A} = ${fmt(p * A / 100)}$.` };
    if (t === 1) return { q: R`Ένα προϊόν κοστίζει ${A} € και έχει έκπτωση $${p}\%$. Ποια είναι η νέα τιμή;`, fields: [{ label: "νέα τιμή (€) =", ans: A * (100 - p) / 100 }], sol: R`Έκπτωση $${fmt(p * A / 100)}$ €, νέα τιμή $${A} - ${fmt(p * A / 100)} = ${fmt(A * (100 - p) / 100)}$ € (δηλαδή το $${100 - p}\%$ της αρχικής).` };
    if ((p * A) % 100) return GENS.gypct.make(); const part = p * A / 100; return { q: R`Σε ένα σχολείο ${A} μαθητών, οι ${part} είναι αγόρια. Τι ποσοστό είναι αγόρια;`, fields: [{ label: "ποσοστό (%) =", ans: p }], sol: R`$\frac{${part}}{${A}} = ${fmt(part / A)} = ${p}\%$.` };
  } },
  gystat: { title: "Γεννήτρια — συχνότητες και διαγράμματα", make() {
    const F = [ri(2, 9), ri(2, 9), ri(2, 9), ri(1, 6)], N = F.reduce((a, b) => a + b, 0), k = ri(0, 3), L = ["Α", "Β", "Γ", "Δ"], t = ri(0, 1);
    if (t === 0) return { q: R`Σε μια έρευνα οι απαντήσεις Α, Β, Γ, Δ είχαν συχνότητες ${F.join(", ")}. Να βρείτε τη σχετική συχνότητα της απάντησης ${L[k]} (ως ποσοστό %, 1 δεκαδικό).`, fields: [{ label: "% =", ans: Math.round(1000 * F[k] / N) / 10, tol: 0.051 / Math.max(1, 100 * F[k] / N) }], sol: R`Ν = ${N}. $\frac{${F[k]}}{${N}} \approx ${fmt(F[k] / N)} = ${fmt(100 * F[k] / N)}\%$.` };
    return { q: R`Σε μια έρευνα οι απαντήσεις Α, Β, Γ, Δ είχαν συχνότητες ${F.join(", ")}. Στο κυκλικό διάγραμμα, πόσες μοίρες είναι ο τομέας της απάντησης ${L[k]}; (1 δεκαδικό)`, fields: [{ label: "μοίρες =", ans: Math.round(3600 * F[k] / N) / 10, tol: 0.051 / Math.max(1, 360 * F[k] / N) }], sol: R`$360^\circ\cdot\frac{${F[k]}}{${N}} \approx ${fmt(360 * F[k] / N)}^\circ$.` };
  } },
  gyprob: { title: "Γεννήτρια — πιθανότητες", make() {
    const t = ri(0, 2);
    if (t === 0) { const r = ri(1, 8), b = ri(1, 8), g = ri(1, 6), N = r + b + g; return { q: R`Ένα κουτί έχει ${r} κόκκινες, ${b} μπλε και ${g} πράσινες μπάλες. Παίρνουμε τυχαία μία. Ποια η πιθανότητα να είναι μπλε;`, fields: [{ label: "P =", ans: gyF(b, N) }], sol: R`Ευνοϊκές ${b}, δυνατές ${N}: $P = ${gyT(b, N)}$.` }; }
    if (t === 1) { const k = bkPick([[2, "άρτιο", 3], [3, "πολλαπλάσιο του 3", 2], [1, "μεγαλύτερο του 4", 2], [4, "πρώτο αριθμό", 3]]); return { q: R`Ρίχνουμε ένα ζάρι. Ποια η πιθανότητα να φέρουμε ${k[1]};`, fields: [{ label: "P =", ans: gyF(k[2], 6) }], sol: R`Δειγματικός χώρος {1, 2, 3, 4, 5, 6}. Ευνοϊκές: ${k[2]}. $P = ${gyT(k[2], 6)}$.` }; }
    const n = ri(10, 30), m = ri(1, n - 1); return { q: R`Σε μια τάξη ${n} μαθητών, οι ${m} φορούν γυαλιά. Επιλέγουμε τυχαία έναν μαθητή. Ποια η πιθανότητα να <b>μη</b> φορά γυαλιά;`, fields: [{ label: "P =", ans: gyF(n - m, n) }], sol: R`$P = \frac{${n} - ${m}}{${n}} = ${gyT(n - m, n)}$.` };
  } }
});

/* Απειροστικός Λογισμός ΙΙ (ΜΑΣ013) — widgets & γεννήτριες (μέρος α: ακολουθίες, σειρές, δυναμοσειρές) */
const m2aTF = (p, q) => texFrac(p, q);                     /* ανάγωγο κλάσμα σε TeX */
const m2aFS = (p, q) => fracS2(p, q);                      /* ανάγωγο κλάσμα ως απάντηση */
const m2aNum = v => fmt(v);                                /* δεκαδικός με κόμμα (κείμενο) */
const m2aTN = v => String(Math.round(v * 1e4) / 1e4).replace(".", "{,}");   /* δεκαδικός σε TeX */
const m2aFr = (c, d) => c === 0 ? "" : ` ${c < 0 ? "-" : "+"} \\frac{${Math.abs(c)}}{${d}}`;   /* ± c/d (παραλείπεται αν c = 0) */
const m2aLin = (c, v = "x") => c === 1 ? v : c === -1 ? "-" + v : c + v;
const m2aFact = n => { let p = 1; for (let i = 2; i <= n; i++) p *= i; return p; };
/* πολυώνυμο του n με συντελεστές [a2,a1,a0] σε TeX (μεταβλητή v) */
function m2aPoly(cs, v = "n") {
  const deg = cs.length - 1; let s = "";
  cs.forEach((c, i) => {
    const d = deg - i; if (c === 0) return;
    const pw = d === 0 ? "" : d === 1 ? v : `${v}^{${d}}`;
    const abs = Math.abs(c), coef = d > 0 && abs === 1 ? "" : String(abs);
    s += (s === "" ? (c < 0 ? "-" : "") : (c < 0 ? " - " : " + ")) + coef + pw;
  });
  return s || "0";
}

/* ---------- προεπιλεγμένες ακολουθίες για τον εξερευνητή ---------- */
const M2A_SEQ = [
  { n: "a_n = \\dfrac{3n+2}{n+1}", t: "(3n+2)/(n+1)", f: n => (3 * n + 2) / (n + 1), L: 3 },
  { n: "a_n = \\dfrac{\\sin n}{n}", t: "sin(n)/n", f: n => Math.sin(n) / n, L: 0 },
  { n: "a_n = \\left(1+\\tfrac1n\\right)^n", t: "(1+1/n)^n", f: n => Math.pow(1 + 1 / n, n), L: Math.E, Ltxt: "e ≈ 2,7183" },
  { n: "a_n = (-1)^n\\dfrac{n}{n+1}", t: "(−1)^n·n/(n+1)", f: n => (n % 2 ? -1 : 1) * n / (n + 1), L: null },
  { n: "a_1=0,\\ a_{n+1}=\\sqrt{6+a_n}", t: "αναδρομική √(6+aₙ)", rec: [0, a => Math.sqrt(6 + a)], L: 3 },
  { n: "a_n = \\sqrt[n]{n}", t: "n^(1/n)", f: n => Math.pow(n, 1 / n), L: 1 }
];
/* ---------- προεπιλεγμένες σειρές ---------- */
const M2A_SER = [
  { n: "\\sum \\left(\\tfrac12\\right)^{n}", t: "Σ (1/2)ⁿ", a: n => Math.pow(0.5, n), S: 1, why: "γεωμετρική με λόγο ½: συγκλίνει στο ½ / (1 − ½) = 1" },
  { n: "\\sum \\frac{1}{n(n+1)}", t: "Σ 1/(n(n+1))", a: n => 1 / (n * (n + 1)), S: 1, why: "τηλεσκοπική: Sₙ = 1 − 1/(n+1) → 1" },
  { n: "\\sum \\frac{1}{n}", t: "Σ 1/n (αρμονική)", a: n => 1 / n, S: null, why: "αρμονική: aₙ → 0 αλλά Sₙ → ∞ (αργά, σαν ln n)" },
  { n: "\\sum \\frac{1}{n^2}", t: "Σ 1/n²", a: n => 1 / (n * n), S: Math.PI * Math.PI / 6, why: "p-σειρά με p = 2 > 1: συγκλίνει (στο π²/6 ≈ 1,645)" },
  { n: "\\sum \\frac{(-1)^{n+1}}{n}", t: "Σ (−1)ⁿ⁺¹/n", a: n => (n % 2 ? 1 : -1) / n, S: Math.LN2, why: "Leibniz: συγκλίνει (στο ln 2 ≈ 0,693) υπό συνθήκη" },
  { n: "\\sum \\frac{n}{3^n}", t: "Σ n/3ⁿ", a: n => n / Math.pow(3, n), S: 0.75, why: "κριτήριο λόγου: L = 1/3 < 1, συγκλίνει (στο 3/4)" },
  { n: "\\sum \\frac{n}{2n+1}", t: "Σ n/(2n+1)", a: n => n / (2 * n + 1), S: null, why: "aₙ → ½ ≠ 0: αποκλίνει (κριτήριο n-οστού όρου)" }
];
/* ---------- συναρτήσεις για Taylor ---------- */
const M2A_TAY = [
  { t: "eˣ", f: Math.exp, c: k => 1 / m2aFact(k), R: Infinity, lo: -3, hi: 3, tex: "e^x = \\sum_{n\\ge0} \\frac{x^n}{n!}" },
  { t: "sin x", f: Math.sin, c: k => k % 2 ? (((k - 1) / 2) % 2 ? -1 : 1) / m2aFact(k) : 0, R: Infinity, lo: -7, hi: 7, tex: "\\sin x = \\sum_{n\\ge0} \\frac{(-1)^n x^{2n+1}}{(2n+1)!}" },
  { t: "cos x", f: Math.cos, c: k => k % 2 ? 0 : ((k / 2) % 2 ? -1 : 1) / m2aFact(k), R: Infinity, lo: -7, hi: 7, tex: "\\cos x = \\sum_{n\\ge0} \\frac{(-1)^n x^{2n}}{(2n)!}" },
  { t: "1/(1 − x)", f: x => 1 / (1 - x), c: k => 1, R: 1, lo: -2.5, hi: 2.5, tex: "\\frac{1}{1-x} = \\sum_{n\\ge0} x^n,\\ |x|<1" },
  { t: "ln(1 + x)", f: x => x > -1 ? Math.log(1 + x) : NaN, c: k => k === 0 ? 0 : (k % 2 ? 1 : -1) / k, R: 1, lo: -1.5, hi: 2.5, tex: "\\ln(1+x) = \\sum_{n\\ge1} \\frac{(-1)^{n+1}x^n}{n},\\ -1<x\\le 1" },
  { t: "arctan x", f: Math.atan, c: k => k % 2 ? (((k - 1) / 2) % 2 ? -1 : 1) / k : 0, R: 1, lo: -2.5, hi: 2.5, tex: "\\arctan x = \\sum_{n\\ge0} \\frac{(-1)^n x^{2n+1}}{2n+1},\\ |x|\\le 1" }
];

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 1.1–1.2: ακολουθία, ζώνη ε, κατώφλι N ---------- */
  m2aseqw(box) {
    box.innerHTML = `<div class="wctl"><label>ακολουθία <select class="sq">${M2A_SEQ.map((s, i) => `<option value="${i}">${s.t}</option>`).join("")}</select></label>
      <label>ε <input type="range" class="re" min="1" max="40" value="20"><b class="ve"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const S = M2A_SEQ[+$(".sq", box).value], eps = +$(".re", box).value / 100; $(".ve", box).textContent = fmt(eps);
      const N = 40, a = [];
      if (S.rec) { let v = S.rec[0]; for (let n = 1; n <= N; n++) { a.push(v); v = S.rec[1](v); } } else for (let n = 1; n <= N; n++) a.push(S.f(n));
      const lo = Math.min(...a, S.L ?? 0) - 0.3, hi = Math.max(...a, S.L ?? 0) + 0.3;
      const P = makePlot($(".pl", box), { xmin: 0, xmax: N + 1, ymin: lo, ymax: hi, W: 560, H: 300, xstep: 5, ystep: niceStep(hi - lo) });
      let Nst = null;
      if (S.L !== null) {
        P.layer.appendChild(svgEl("rect", { x: 0, y: P.sy(S.L + eps), width: P.W, height: Math.max(0, P.sy(S.L - eps) - P.sy(S.L + eps)), style: "fill:rgba(25,135,84,.14)" }));
        P.seg(0, S.L, N + 1, S.L, "guide");
        /* μικρότερο N ώστε |a_n − L| < ε για όλα τα n ≥ N (μέσα στα 40 όρους) */
        for (let k = N; k >= 1; k--) if (Math.abs(a[k - 1] - S.L) >= eps) { Nst = k + 1; break; }
        if (Nst === null) Nst = 1;
      }
      a.forEach((v, i) => P.dot(i + 1, v, S.L !== null && Nst !== null && i + 1 >= Nst ? "dmax" : "d1"));
      if (S.L !== null && Nst <= N) P.seg(Nst, lo, Nst, hi, "guide");
      $(".wout", box).innerHTML = `$${S.n}$ · πρώτοι όροι: ${a.slice(0, 5).map(v => fmt(v)).join(", ")}, …<br>` +
        (S.L !== null ? `Όριο $L = ${S.Ltxt ? S.Ltxt.replace("≈", "\\approx").replace(",", "{,}") : String(S.L)}$. Για $\\varepsilon = ${String(eps).replace(".", "{,}")}$: ${Nst <= N ? `από τον όρο $n = ${Nst}$ και μετά <b>όλοι</b> οι όροι (πράσινοι) μένουν στη ζώνη $(L-\\varepsilon, L+\\varepsilon)$.` : "χρειάζονται περισσότεροι από 40 όροι."}<br><span class="muted">Μικραίνοντας το ε, το N μεγαλώνει — αλλά υπάρχει πάντα: αυτός είναι ο ορισμός $a_n \\to L$.</span>`
          : `Η ακολουθία <b>δεν συγκλίνει</b>: οι άρτιοι όροι πλησιάζουν το $1$ και οι περιττοί το $-1$ — καμία ζώνη πλάτους $2\\varepsilon < 2$ δεν τους χωρά όλους.`);
      typeset($(".wout", box));
    }
    box.querySelectorAll("select,input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 2.1, 2.3: όροι και μερικά αθροίσματα ---------- */
  m2asums(box) {
    box.innerHTML = `<div class="wctl"><label>σειρά <select class="ss">${M2A_SER.map((s, i) => `<option value="${i}">${s.t}</option>`).join("")}</select></label>
      <label>N <input type="range" class="rn" min="5" max="60" value="30"><b class="vn"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const S = M2A_SER[+$(".ss", box).value], N = +$(".rn", box).value; $(".vn", box).textContent = N;
      const a = [], Sn = []; let s = 0; for (let n = 1; n <= N; n++) { const v = S.a(n); a.push(v); s += v; Sn.push(s); }
      const lo = Math.min(0, ...a, ...Sn) - 0.15, hi = Math.max(...a, ...Sn, S.S ?? 0) + 0.25;
      const P = makePlot($(".pl", box), { xmin: 0, xmax: N + 1, ymin: lo, ymax: hi, W: 560, H: 300, xstep: niceStep(N), ystep: niceStep(hi - lo) });
      const bw = Math.max(1.5, P.W / (N + 1) * 0.5);
      a.forEach((v, i) => P.layer.appendChild(svgEl("rect", { x: P.sx(i + 1) - bw / 2, y: Math.min(P.sy(0), P.sy(v)), width: bw, height: Math.abs(P.sy(v) - P.sy(0)), style: "fill:rgba(199,122,10,.55)" })));
      if (S.S !== null) P.seg(0, S.S, N + 1, S.S, "guide");
      Sn.forEach((v, i) => P.dot(i + 1, v, "d1"));
      const r = a.length > 2 ? a[N - 1] / a[N - 2] : NaN;
      $(".wout", box).innerHTML = `<span style="color:var(--amber);font-weight:800">■ όροι $a_n$</span> · <span style="color:var(--blue);font-weight:800">● μερικά αθροίσματα $S_n$</span><br>
        $${S.n}$: $S_{${N}} \\approx ${m2aTN(Sn[N - 1])}$${S.S !== null ? `, άθροισμα σειράς $\\approx ${m2aTN(S.S)}$` : ""} · λόγος $a_{${N}}/a_{${N - 1}} \\approx ${m2aTN(r)}$<br>
        <span class="muted">${S.why}.</span>`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("select,input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 2.2: ολοκληρωτικό κριτήριο / p-σειρές ---------- */
  m2aint(box) {
    box.innerHTML = `<div class="wctl"><label>p <input type="range" class="rp" min="5" max="30" value="20"><b class="vp"></b></label>
      <label>N <input type="range" class="rn" min="5" max="12" value="8"><b class="vn"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const p = +$(".rp", box).value / 10, N = +$(".rn", box).value; $(".vp", box).textContent = fmt(p); $(".vn", box).textContent = N;
      const f = x => Math.pow(x, -p);
      const P = makePlot($(".pl", box), { xmin: 0, xmax: N + 1.5, ymin: -0.08, ymax: 1.15, W: 560, H: 300, xstep: 1, ystep: 0.25 });
      for (let n = 1; n <= N; n++) P.layer.appendChild(svgEl("rect", { x: P.sx(n), y: P.sy(f(n)), width: P.sx(n + 1) - P.sx(n), height: P.sy(0) - P.sy(f(n)), style: "fill:rgba(15,111,209,.18);stroke:var(--blue);stroke-width:1.2" }));
      P.curve(f, "c3", 0.85, N + 1.5);
      let S = 0; for (let n = 1; n <= N; n++) S += f(n);
      const I = p === 1 ? Math.log(N + 1) : (Math.pow(N + 1, 1 - p) - 1) / (1 - p), conv = p > 1;
      $(".wout", box).innerHTML = `Ορθογώνια με βάση $[n, n+1]$ και ύψος $a_n = 1/n^{${String(p).replace(".", "{,}")}}$: βρίσκονται <b>πάνω</b> από την καμπύλη $f(x) = 1/x^{${String(p).replace(".", "{,}")}}$, αφού η $f$ είναι φθίνουσα.<br>
        $S_{${N}} \\approx ${m2aTN(S)}$ και $\\int_1^{${N + 1}} x^{-p}\\,dx \\approx ${m2aTN(I)}$: ισχύει $\\int_1^{N+1} f \\le S_N \\le 1 + \\int_1^{N} f$.<br>
        ${conv ? `Αφού $p > 1$, το $\\int_1^\\infty x^{-p}dx = \\frac{1}{p-1} = ${m2aTN(1 / (p - 1))}$ <b>συγκλίνει</b> — άρα και η σειρά.` : `Αφού $p \\le 1$, το $\\int_1^\\infty x^{-p}dx$ <b>αποκλίνει</b> — άρα και η σειρά.`}`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 3.1–3.2: πολυώνυμα Taylor και διάστημα σύγκλισης ---------- */
  m2ataylor(box) {
    box.innerHTML = `<div class="wctl"><label>f(x) <select class="sf">${M2A_TAY.map((s, i) => `<option value="${i}">${s.t}</option>`).join("")}</select></label>
      <label>βαθμός n <input type="range" class="rn" min="0" max="15" value="3"><b class="vn"></b></label>
      <label>x₀ <input type="range" class="rx" min="-20" max="20" value="5"><b class="vx"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const F = M2A_TAY[+$(".sf", box).value], n = +$(".rn", box).value, x0 = +$(".rx", box).value / 10;
      $(".vn", box).textContent = n; $(".vx", box).textContent = fmt(x0);
      const T = x => { let s = 0, p = 1; for (let k = 0; k <= n; k++) { s += F.c(k) * p; p *= x; } return s; };
      const P = makePlot($(".pl", box), { xmin: F.lo, xmax: F.hi, ymin: -3, ymax: 3, W: 560, H: 320, xstep: 1, ystep: 1 });
      if (isFinite(F.R)) P.band(Math.max(F.lo, -F.R), Math.min(F.hi, F.R), "bandok");
      P.curve(F.f, "c1"); P.curve(T, "c3");
      const fx = F.f(x0), tx = T(x0);
      if (isFinite(fx)) P.dot(x0, Math.max(-3, Math.min(3, fx)), "d1");
      if (isFinite(tx) && Math.abs(tx) < 3) P.dot(x0, tx, "d3");
      const terms = []; for (let k = 0; k <= n; k++) { const c = F.c(k); if (Math.abs(c) < 1e-12) continue; terms.push({ k, c }); }
      const tt = terms.length ? terms.map(({ k, c }, i) => { const den = Math.round(1 / Math.abs(c)), sg = c < 0 ? "-" : (i ? "+" : ""); const pw = k === 0 ? "" : k === 1 ? "x" : `x^{${k}}`; return `${sg}${den === 1 ? (k === 0 ? "1" : "") : `\\frac{${k === 0 ? 1 : 1}}{${den}}`}${pw}`; }).join(" ") : "0";
      $(".wout", box).innerHTML = `<span style="color:var(--blue);font-weight:800">— f</span> · <span style="color:var(--amber);font-weight:800">— T<sub>n</sub></span>${isFinite(F.R) ? ` · <span style="color:var(--green);font-weight:800">▮ διάστημα σύγκλισης (ακτίνα R = ${F.R})</span>` : " · ακτίνα σύγκλισης $R = \\infty$"}<br>
        $T_{${n}}(x) = ${tt}$<br>
        Στο $x_0 = ${String(x0).replace(".", "{,}")}$: $f(x_0) ${isFinite(fx) ? `\\approx ${m2aTN(fx)}` : "\\text{ δεν ορίζεται}"}$, $T_{${n}}(x_0) \\approx ${m2aTN(tx)}$${isFinite(fx) ? `, σφάλμα $\\approx ${m2aTN(Math.abs(fx - tx))}$` : ""}.<br>
        <span class="muted">${F.tex ? `$${F.tex}$. ` : ""}${isFinite(F.R) ? "Έξω από το διάστημα σύγκλισης, όσο κι αν μεγαλώσει το n, το T<sub>n</sub> απομακρύνεται από την f." : "Για κάθε x, αυξάνοντας το n το σφάλμα τείνει στο 0."}</span>`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("select,input").forEach(i => i.oninput = draw); draw();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  /* 1.1 όρια ακολουθιών */
  m2aseq: { title: "Γεννήτρια — όρια ακολουθιών", make() {
    const t = ri(0, 2);
    if (t === 0) {   /* ρητή, ίδιοι βαθμοί */
      const a = gyNZ(-6, 6), d = ri(1, 7), b = ri(-9, 9), c = ri(-9, 9), e = ri(1, 9); if (gcdI(a, d) === Math.abs(a) && Math.abs(a) === d) return GENS.m2aseq.make();
      return { q: R`Να υπολογίσετε το $\lim_{n\to\infty} \dfrac{${m2aPoly([a, b, c])}}{${m2aPoly([d, 0, e])}}$.`, fields: [{ label: "όριο =", ans: m2aFS(a, d) }],
        hint: R`Διαιρέστε αριθμητή και παρονομαστή με $n^2$.`, sol: R`Διαιρώντας με $n^2$: $\dfrac{${a}${m2aFr(b, "n")}${m2aFr(c, "n^2")}}{${d} + \frac{${e}}{n^2}} \to ${m2aTF(a, d)}$, αφού $\frac{1}{n}, \frac{1}{n^2} \to 0$.` };
    }
    if (t === 1) {   /* βαθμός αριθμητή < βαθμός παρονομαστή */
      const a = gyNZ(-6, 6), b = ri(1, 9), d = ri(1, 5), e = ri(1, 9);
      return { q: R`Να υπολογίσετε το $\lim_{n\to\infty} \dfrac{${m2aPoly([a, b])}}{${m2aPoly([d, 0, e])}}$.`, fields: [{ label: "όριο =", ans: 0 }],
        hint: R`Μεγαλύτερος βαθμός στον παρονομαστή.`, sol: R`Διαιρώντας με $n^2$: $\dfrac{${a < 0 ? "-" : ""}\frac{${Math.abs(a)}}{n} + \frac{${b}}{n^2}}{${d} + \frac{${e}}{n^2}} \to \dfrac{0}{${d}} = 0$.` };
    }
    /* (p^n + q^n) / q^{n+1} → 1/q με p < q */
    const qv = ri(3, 6), pv = ri(2, qv - 1), k = ri(1, 2);
    return { q: R`Να υπολογίσετε το $\lim_{n\to\infty} \dfrac{${pv}^n + ${qv}^n}{${qv}^{n+${k}}}$.`, fields: [{ label: "όριο =", ans: m2aFS(1, qv ** k) }],
      hint: R`Βγάλτε κοινό παράγοντα $${qv}^n$.`, sol: R`$\dfrac{${qv}^n\left(\left(\frac{${pv}}{${qv}}\right)^n + 1\right)}{${qv}^{${k}}\cdot ${qv}^n} = \dfrac{\left(\frac{${pv}}{${qv}}\right)^n + 1}{${qv ** k}} \to \dfrac{0 + 1}{${qv ** k}} = ${m2aTF(1, qv ** k)}$, αφού $\left|\frac{${pv}}{${qv}}\right| < 1$.` };
  } },
  /* 1.2 αναδρομικές ακολουθίες και ο αριθμός e */
  m2arec: { title: "Γεννήτρια — αναδρομικές ακολουθίες και ο αριθμός e", make() {
    const t = ri(0, 1);
    if (t === 0) {   /* a_{n+1} = √(c + a_n), όριο L με L² − L = c */
      const L = ri(2, 6), c = L * L - L;
      return { q: R`Δίνεται $a_1 = 0$ και $a_{n+1} = \sqrt{${c} + a_n}$. Αν η ακολουθία συγκλίνει (είναι αύξουσα και άνω φραγμένη από το $${L}$), να βρείτε το όριό της.`, fields: [{ label: "όριο L =", ans: L }],
        hint: R`Περνώντας στο όριο: $L = \sqrt{${c} + L}$, με $L \ge 0$.`, sol: R`$L^2 = ${c} + L \iff L^2 - L - ${c} = 0 \iff (L - ${L})(L + ${L - 1}) = 0$. Αφού $a_n \ge 0$, $L \ge 0$, άρα $L = ${L}$.` };
    }
    const k = gyNZ(-4, 4), m = ri(1, 4);
    const base = k > 0 ? R`1 + \frac{${k}}{n}` : R`1 - \frac{${-k}}{n}`;
    return { q: R`Το όριο $\lim_{n\to\infty}\left(${base}\right)^{${m === 1 ? "n" : m + "n"}}$ γράφεται $e^{\kappa}$. Να βρείτε το $\kappa$.`, fields: [{ label: "κ =", ans: k * m }],
      hint: R`$\left(1 + \frac{x}{n}\right)^n \to e^x$.`, sol: R`$\left(${base}\right)^{${m === 1 ? "n" : m + "n"}} = \left[\left(${base}\right)^{n}\right]^{${m}} \to \left(e^{${k}}\right)^{${m}} = e^{${k * m}}$, άρα $\kappa = ${k * m}$.` };
  } },
  /* 2.1 γεωμετρικές και τηλεσκοπικές σειρές */
  m2aser: { title: "Γεννήτρια — γεωμετρικές και τηλεσκοπικές σειρές", make() {
    const t = ri(0, 1);
    if (t === 0) {
      let p, q; do { p = gyNZ(-4, 4); q = ri(2, 6); } while (Math.abs(p) >= q || gcdI(p, q) !== 1);
      const a = gyNZ(-5, 5), s0 = ri(0, 1);
      /* Σ_{n=s0}^∞ a (p/q)^{n-s0}: πρώτος όρος a */
      const num = a * q, den = q - p;
      return { q: R`Να υπολογίσετε το άθροισμα $\sum_{n=${s0}}^{\infty} ${a === 1 ? "" : a === -1 ? "-" : a}\left(${m2aTF(p, q)}\right)^{${s0 === 0 ? "n" : "n-1"}}$.`, fields: [{ label: "άθροισμα =", ans: m2aFS(num, den) }],
        hint: R`Γεωμετρική σειρά με πρώτο όρο $${a}$ και λόγο $${m2aTF(p, q)}$.`, sol: R`$|r| = ${m2aTF(Math.abs(p), q)} < 1$, άρα συγκλίνει: $\dfrac{a}{1 - r} = \dfrac{${a}}{1 ${p < 0 ? "+" : "-"} ${m2aTF(Math.abs(p), q)}} = ${m2aTF(num, den)}$.` };
    }
    const k = ri(1, 3), s = ri(1, 3);    /* Σ_{n=s}^∞ 1/((n)(n+k)) = (1/k)(1/s + … + 1/(s+k-1)) */
    let P = 0, Q = 1; for (let j = 0; j < k; j++) { P = P * (s + j) + Q; Q = Q * (s + j); }
    const g = gcdI(P, Q * k);
    const tail = []; for (let j = 0; j < k; j++) tail.push(s + j === 1 ? "1" : R`\frac{1}{${s + j}}`);
    const pre = k === 1 ? "" : R`\frac{1}{${k}}`, par = x => k === 1 ? x : `\left(${x}\right)`;
    return { q: R`Να υπολογίσετε το άθροισμα $\sum_{n=${s}}^{\infty} \dfrac{1}{n(n+${k})}$.`, fields: [{ label: "άθροισμα =", ans: m2aFS(P, Q * k) }],
      hint: R`Απλά κλάσματα: $\frac{1}{n(n+${k})} = \frac{1}{${k}}\left(\frac1n - \frac{1}{n+${k}}\right)$ — τηλεσκοπική.`,
      sol: k === 1 ? R`Τηλεσκοπική: $S_N = ${tail[0]} - \frac{1}{N + 1} \to ${m2aTF(P, Q)}$.`
        : R`Στο $S_N$ απαλείφονται σχεδόν όλοι οι όροι και μένουν οι πρώτοι ${k} θετικοί και οι τελευταίοι ${k} αρνητικοί: $S_N = ${pre}\left(${tail.join(" + ")} - \dots\right)$, όπου τα «$\dots$» είναι ${k} όροι της μορφής $\frac{1}{N+j} \to 0$. Άρα το άθροισμα είναι $${pre}${par(tail.join(" + "))} = ${m2aTF(P, Q * k)}$.` };
  } },
  /* 2.2 p-σειρές και οριακό κριτήριο σύγκρισης */
  m2acmp: { title: "Γεννήτρια — κριτήριο σύγκρισης και p-σειρές", make() {
    const t = ri(0, 1);
    if (t === 0) {
      const da = ri(0, 2), db = da + ri(1, 3), a = ri(1, 6), b = ri(1, 6), c = ri(1, 9), e = ri(1, 9);
      const p = db - da;
      const num = da === 0 ? `${a}` : m2aPoly(da === 1 ? [a, c] : [a, 0, c]);
      const den = m2aPoly([b, ...Array(db - 1).fill(0), e].slice(0, db + 1));
      const conv = p > 1, nP = d => d === 0 ? "" : d === 1 ? "n" : `n^{${d}}`;
      return { q: R`Για τη σειρά $\sum_{n=1}^\infty \dfrac{${num}}{${den}}$ συγκρίνουμε (οριακά) με την $\sum \frac{1}{n^{p}}$. Ποιο είναι το κατάλληλο $p$ και ποιο το όριο $L = \lim \frac{a_n}{1/n^{p}}$;`,
        fields: [{ label: "p =", ans: p }, { label: "L =", ans: m2aFS(a, b) }],
        hint: R`Κρατήστε τους μεγιστοβάθμιους όρους: $a_n \sim \frac{${da === 0 ? a : (a === 1 ? "" : a) + nP(da)}}{${(b === 1 ? "" : b) + nP(db)}}$.`,
        sol: R`$a_n \sim ${m2aTF(a, b)}\cdot\frac{1}{${nP(p)}}$, άρα με $p = ${p}$: $\lim \frac{a_n}{1/${nP(p)}} = ${m2aTF(a, b)} \in (0, \infty)$. Οι δύο σειρές έχουν την ίδια συμπεριφορά, οπότε η σειρά <b>${conv ? "συγκλίνει" : "αποκλίνει"}</b> (p-σειρά με $p = ${p} ${conv ? "> 1" : "\\le 1"}$).` };
    }
    const r = ri(2, 8), s = bkPick([1, 2, 3]);   /* Σ 1/n^{r/s} */
    const g = gcdI(r, s), pr = r / g, ps = s / g, conv = pr > ps;
    const pt = ps === 1 ? String(pr) : `${pr}/${ps}`;
    return bkMC({ q: R`Η σειρά $\sum_{n=1}^{\infty} \dfrac{1}{${ps === 1 ? `n^{${pr}}` : (ps === 2 ? `\\sqrt{n^{${pr}}}` : `\\sqrt[${ps}]{n^{${pr}}}`)}}$:`, hint: R`Γράψτε τον όρο ως $\frac{1}{n^{p}}$.`,
      sol: R`Είναι p-σειρά με $p = ${ps === 1 ? pr : `\\frac{${pr}}{${ps}}`} ${conv ? "> 1" : "\\le 1"}$, άρα <b>${conv ? "συγκλίνει" : "αποκλίνει"}</b>.` },
      [conv ? `συγκλίνει (p = ${pt} > 1)` : `αποκλίνει (p = ${pt} ≤ 1)`, conv ? `αποκλίνει (p = ${pt})` : `συγκλίνει (p = ${pt})`, "συγκλίνει, γιατί ο γενικός όρος τείνει στο 0", "δεν μπορούμε να αποφανθούμε με κανένα κριτήριο"], 0);
  } },
  /* 2.3 κριτήριο λόγου */
  m2aratio: { title: "Γεννήτρια — κριτήριο λόγου και ρίζας", make() {
    const t = ri(0, 2);
    if (t === 0) {    /* Σ n^k / b^n → L = 1/b */
      const k = ri(1, 4), b = ri(2, 7);
      return { q: R`Εφαρμόστε το κριτήριο του λόγου στη σειρά $\sum_{n=1}^\infty \dfrac{n^{${k}}}{${b}^n}$. Ποιο είναι το $L = \lim \left|\frac{a_{n+1}}{a_n}\right|$;`, fields: [{ label: "L =", ans: m2aFS(1, b) }],
        hint: R`$\frac{a_{n+1}}{a_n} = \left(\frac{n+1}{n}\right)^{${k}}\cdot\frac{1}{${b}}$.`, sol: R`$\frac{a_{n+1}}{a_n} = \left(1 + \frac1n\right)^{${k}}\frac{1}{${b}} \to \frac{1}{${b}} < 1$: η σειρά <b>συγκλίνει</b> (απόλυτα).` };
    }
    if (t === 1) {    /* Σ c^n/n! ή Σ n!/c^n */
      const c = ri(2, 9), inv = ri(0, 1);
      return bkMC({ q: inv ? R`Η σειρά $\sum_{n=1}^\infty \dfrac{n!}{${c}^n}$ (κριτήριο λόγου):` : R`Η σειρά $\sum_{n=1}^\infty \dfrac{${c}^n}{n!}$ (κριτήριο λόγου):`, hint: R`$\frac{(n+1)!}{n!} = n + 1$.`,
        sol: inv ? R`$\frac{a_{n+1}}{a_n} = \frac{n+1}{${c}} \to \infty > 1$: <b>αποκλίνει</b>.` : R`$\frac{a_{n+1}}{a_n} = \frac{${c}}{n+1} \to 0 < 1$: <b>συγκλίνει</b> (μάλιστα $\sum_{n\ge0} \frac{${c}^n}{n!} = e^{${c}}$).` },
        inv ? ["αποκλίνει (L = ∞)", "συγκλίνει (L = 0)", `συγκλίνει (L = 1/${c})`, "το κριτήριο δεν αποφαίνεται (L = 1)"] : ["συγκλίνει (L = 0)", "αποκλίνει (L = ∞)", `αποκλίνει (L = ${c})`, "το κριτήριο δεν αποφαίνεται (L = 1)"], 0);
    }
    /* κριτήριο ρίζας: Σ ((a n + b)/(c n + d))^n → L = a/c */
    let a, b, c, d; do { a = ri(1, 6); c = ri(1, 6); b = ri(1, 9); d = ri(1, 9); } while (a === c || a * d === b * c);
    const conv = a < c;
    return { q: R`Με το κριτήριο της ρίζας, να βρείτε το $L = \lim \sqrt[n]{|a_n|}$ για τη σειρά $\sum_{n=1}^\infty \left(\dfrac{${m2aPoly([a, b])}}{${m2aPoly([c, d])}}\right)^n$.`, fields: [{ label: "L =", ans: m2aFS(a, c) }],
      hint: R`$\sqrt[n]{a_n} = \frac{${m2aPoly([a, b])}}{${m2aPoly([c, d])}}$.`, sol: R`$\sqrt[n]{a_n} = \dfrac{${m2aPoly([a, b])}}{${m2aPoly([c, d])}} \to ${m2aTF(a, c)} ${conv ? "< 1" : "> 1"}$: η σειρά <b>${conv ? "συγκλίνει" : "αποκλίνει"}</b>.` };
  } },
  /* 3.1 ακτίνα και διάστημα σύγκλισης */
  m2arad: { title: "Γεννήτρια — ακτίνα και διάστημα σύγκλισης δυναμοσειράς", make() {
    const a = ri(-4, 4), b = ri(2, 5), p = bkPick([0, 1, 2]);
    const xm = a === 0 ? "x" : `x ${a < 0 ? "+" : "-"} ${Math.abs(a)}`, xa = a === 0 ? "x" : `(${xm})`;
    const den = p === 0 ? `${b}^n` : p === 1 ? `n\\cdot ${b}^n` : `n^2\\cdot ${b}^n`;
    const L = a - b, Rr = a + b;
    const intv = p === 0 ? `(${L}, ${Rr})` : p === 1 ? `[${L}, ${Rr})` : `[${L}, ${Rr}]`;
    const ends = p === 0 ? R`Στα άκρα ο γενικός όρος είναι $(\pm 1)^n$ που δεν τείνει στο $0$: αποκλίνει και στα δύο.` : p === 1 ? R`Στο $x = ${Rr}$: $\sum \frac1n$ αποκλίνει (αρμονική)· στο $x = ${L}$: $\sum \frac{(-1)^n}{n}$ συγκλίνει (Leibniz).` : R`Στα άκρα: $\sum \frac{(\pm1)^n}{n^2}$ συγκλίνει απόλυτα (p = 2).`;
    const t = ri(0, 1);
    if (t === 0) return { q: R`Να βρείτε την ακτίνα σύγκλισης και το κέντρο της δυναμοσειράς $\sum_{n=1}^\infty \dfrac{${xa}^n}{${den}}$.`, fields: [{ label: "ακτίνα R =", ans: b }, { label: "κέντρο a =", ans: a }],
      hint: R`Κριτήριο λόγου: $\left|\frac{a_{n+1}}{a_n}\right| \to \frac{|${xm}|}{${b}}$.`,
      sol: R`$\left|\frac{a_{n+1}}{a_n}\right| \to \frac{|${xm}|}{${b}} < 1 \iff |${xm}| < ${b}$. Άρα $R = ${b}$ με κέντρο $${a}$. ${ends}` };
    return bkMC({ q: R`Ποιο είναι το διάστημα σύγκλισης της $\sum_{n=1}^\infty \dfrac{${xa}^n}{${den}}$;`, hint: R`Βρείτε πρώτα την ακτίνα και μετά εξετάστε <b>χωριστά</b> τα άκρα.`,
      sol: R`Ακτίνα $R = ${b}$, κέντρο $${a}$: απόλυτη σύγκλιση για $${L} < x < ${Rr}$. ${ends} Άρα το διάστημα είναι $${intv}$.` },
      [`$${intv}$`, ...[`(${L}, ${Rr})`, `[${L}, ${Rr})`, `[${L}, ${Rr}]`, `(${L}, ${Rr}]`].filter(s => s !== intv).slice(0, 2).map(s => `$${s}$`), `$(${a - 1}, ${a + 1})$`], 0);
  } },
  /* 3.2 Maclaurin */
  m2atay: { title: "Γεννήτρια — σειρές Taylor και Maclaurin", make() {
    const t = ri(0, 3), c = gyNZ(-3, 3), cc = c === 1 ? "" : c === -1 ? "-" : c;
    if (t === 0) {   /* e^{cx}: συντελεστής x^k = c^k/k! */
      const k = ri(2, 5);
      return { q: R`Να βρείτε τον συντελεστή του $x^{${k}}$ στο ανάπτυγμα Maclaurin της $f(x) = e^{${cc}x}$.`, fields: [{ label: "συντελεστής =", ans: m2aFS(c ** k, m2aFact(k)) }],
        hint: R`$e^u = \sum \frac{u^n}{n!}$ με $u = ${cc}x$.`, sol: R`$e^{${cc}x} = \sum_{n\ge0} \frac{(${c})^n x^n}{n!}$, άρα ο συντελεστής του $x^{${k}}$ είναι $\frac{(${c})^{${k}}}{${k}!} = ${m2aTF(c ** k, m2aFact(k))}$.` };
    }
    if (t === 1) {   /* 1/(1 − cx): συντελεστής x^k = c^k */
      const k = ri(2, 5);
      return { q: R`Να βρείτε τον συντελεστή του $x^{${k}}$ στο ανάπτυγμα Maclaurin της $f(x) = \dfrac{1}{1 ${c < 0 ? "+" : "-"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}x}$ και την ακτίνα σύγκλισης.`, fields: [{ label: "συντελεστής =", ans: c ** k }, { label: "R =", ans: m2aFS(1, Math.abs(c)) }],
        hint: R`Γεωμετρική σειρά: $\frac{1}{1-u} = \sum u^n$, $|u| < 1$.`, sol: R`Με $u = ${cc}x$: $\sum (${c})^n x^n$, συντελεστής $(${c})^{${k}} = ${c ** k}$, και $|${cc}x| < 1 \iff |x| < ${m2aTF(1, Math.abs(c))}$, άρα $R = ${m2aTF(1, Math.abs(c))}$.` };
    }
    if (t === 2) {   /* όρια με Taylor */
      const cx = m2aLin(c), mcx = c < 0 ? `+ ${m2aLin(-c)}` : `- ${cx}`;
      const o = bkPick([[R`\dfrac{\sin(${cx}) ${mcx}}{x^3}`, m2aFS(-(c ** 3), 6), R`\sin u = u - \frac{u^3}{6} + \dots`, R`\frac{-\frac{(${cx})^3}{6}}{x^3} \to ${m2aTF(-(c ** 3), 6)}`],
        [R`\dfrac{1 - \cos(${cx})}{x^2}`, m2aFS(c * c, 2), R`\cos u = 1 - \frac{u^2}{2} + \dots`, R`\frac{\frac{(${cx})^2}{2}}{x^2} \to ${m2aTF(c * c, 2)}`],
        [R`\dfrac{e^{${cx}} - 1 ${mcx}}{x^2}`, m2aFS(c * c, 2), R`e^u = 1 + u + \frac{u^2}{2} + \dots`, R`\frac{\frac{(${cx})^2}{2}}{x^2} \to ${m2aTF(c * c, 2)}`]]);
      return { q: R`Να υπολογίσετε με χρήση σειρών Taylor το $\lim_{x\to 0} ${o[0]}$.`, fields: [{ label: "όριο =", ans: o[1] }],
        hint: R`$${o[2]}$`, sol: R`Αντικαθιστούμε το ανάπτυγμα: ο πρώτος μη μηδενικός όρος του αριθμητή δίνει $${o[3]}$ (οι υπόλοιποι όροι έχουν μεγαλύτερη δύναμη του $x$ και τείνουν στο $0$ μετά τη διαίρεση).` };
    }
    /* f^{(k)}(0) για f(x) = x^m e^x: συντελεστής x^k = 1/(k-m)!, f^{(k)}(0) = k!/(k-m)! */
    const m = ri(1, 3), k = m + ri(1, 3), val = m2aFact(k) / m2aFact(k - m);
    return { q: R`Να βρείτε την παράγωγο $f^{(${k})}(0)$ της $f(x) = x^{${m === 1 ? "" : m}}e^x$`.replace("x^{}", "x") + R` χρησιμοποιώντας τη σειρά Maclaurin.`, fields: [{ label: `f^(${k})(0) =`, ans: val }],
      hint: R`$f(x) = \sum \frac{x^{n+${m}}}{n!}$· ο συντελεστής του $x^{${k}}$ ισούται με $\frac{f^{(${k})}(0)}{${k}!}$.`,
      sol: R`$${m === 1 ? "x" : `x^{${m}}`}e^x = \sum_{n\ge0}\frac{x^{n+${m}}}{n!}$: ο όρος με $x^{${k}}$ έχει $n = ${k - m}$, συντελεστή $\frac{1}{${k - m}!}$. Άρα $f^{(${k})}(0) = \frac{${k}!}{${k - m}!} = ${val}$.` };
  } }
});

/* Απειροστικός Λογισμός ΙΙ (ΜΑΣ013) — widgets & γεννήτριες: παραμετρικές, πολικές, πολλές μεταβλητές, πολλαπλά ολοκληρώματα */
const m2bSl = (k, lab, min, max, val, step = 1) => `<label>${lab} <input type="range" class="r-${k}" min="${min}" max="${max}" step="${step}" value="${val}"><b class="v-${k}"></b></label>`;
const m2bRd = (box, ks) => { const o = {}; ks.forEach(k => { const e = $(".r-" + k, box); o[k] = +e.value; const b = $(".v-" + k, box); if (b) b.textContent = String(+(+e.value).toFixed(3)).replace(".", ","); }); return o; };
const m2bN = (x, d = 3) => { const v = Math.abs(x) < 1e-10 ? 0 : x; return String(+v.toFixed(d)).replace(".", ","); };
const m2bPath = (P, pts, st, layer) => { let d = "", pen = false; pts.forEach(p => { if (!p || !isFinite(p[0]) || !isFinite(p[1])) { pen = false; return; } d += (pen ? "L" : "M") + P.sx(p[0]).toFixed(1) + "," + P.sy(p[1]).toFixed(1); pen = true; }); const e = svgEl("path", { d, style: "fill:none;stroke-linejoin:round;" + st }); (layer || P.layer).appendChild(e); return e; };
const m2bPoly = (P, pts, st) => { const e = svgEl("polygon", { points: pts.map(p => P.sx(p[0]).toFixed(1) + "," + P.sy(p[1]).toFixed(1)).join(" "), style: st }); P.layer.insertBefore(e, P.layer.firstChild); return e; };
/* ισοϋψείς με marching squares */
function m2bContour(P, f, levels, st, nx = 90, ny = 54) {
  const x0 = P.xmin, x1 = P.xmax, y0 = P.ymin, y1 = P.ymax, dx = (x1 - x0) / nx, dy = (y1 - y0) / ny, V = [];
  for (let j = 0; j <= ny; j++) { V.push([]); for (let i = 0; i <= nx; i++) V[j].push(f(x0 + i * dx, y0 + j * dy)); }
  levels.forEach(c => {
    let d = "";
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const v = [V[j][i] - c, V[j][i + 1] - c, V[j + 1][i + 1] - c, V[j + 1][i] - c];
      const p = [[x0 + i * dx, y0 + j * dy], [x0 + (i + 1) * dx, y0 + j * dy], [x0 + (i + 1) * dx, y0 + (j + 1) * dy], [x0 + i * dx, y0 + (j + 1) * dy]];
      const cr = [];
      for (let k = 0; k < 4; k++) { const a = v[k], b = v[(k + 1) % 4]; if (!isFinite(a) || !isFinite(b)) continue; if ((a < 0) !== (b < 0)) { const t = a / (a - b), A = p[k], B = p[(k + 1) % 4]; cr.push([A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])]); } }
      for (let k = 0; k + 1 < cr.length; k += 2) d += `M${P.sx(cr[k][0]).toFixed(1)},${P.sy(cr[k][1]).toFixed(1)}L${P.sx(cr[k + 1][0]).toFixed(1)},${P.sy(cr[k + 1][1]).toFixed(1)}`;
    }
    P.layer.appendChild(svgEl("path", { d, style: "fill:none;" + st }));
  });
}
const m2bArrow = (P, x1, y1, x2, y2, col, w = 3) => gArrow(P, x1, y1, x2, y2, col, w);
const m2bPi = (p, q) => { /* κ·π ως TeX, p/q ανάγωγο */ if (q < 0) { p = -p; q = -q; } const g = gcdI(p, q); p /= g; q /= g; const s = p < 0 ? "-" : ""; p = Math.abs(p); if (p === 0) return "0"; return s + (q === 1 ? (p === 1 ? "" : p) + "\\pi" : `\\frac{${p === 1 ? "" : p}\\pi}{${q}}`); };
const m2bCo = (a, v, first) => { /* όρος a·v με πρόσημο */ if (a === 0) return ""; const s = a < 0 ? (first ? "-" : " - ") : (first ? "" : " + "), A = Math.abs(a); return s + (A === 1 && v ? "" : A) + v; };
const m2bPoly1 = terms => { let s = ""; terms.forEach(([a, v]) => { s += m2bCo(a, v, s === ""); }); return s || "0"; };

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 4.1 παραμετρικές καμπύλες ---------- */
  m2bparam(box) {
    const C = {
      par: { n: "x = t², y = t³ − t", x: t => t * t, y: t => t ** 3 - t, dx: t => 2 * t, dy: t => 3 * t * t - 1, a: -1.6, b: 1.6, v: [1.3, 0, 1.5] },
      ell: { n: "x = 2 cos t, y = sin t (έλλειψη)", x: t => 2 * Math.cos(t), y: t => Math.sin(t), dx: t => -2 * Math.sin(t), dy: t => Math.cos(t), a: 0, b: 2 * Math.PI, v: [0, 0, 3] },
      cyc: { n: "x = t − sin t, y = 1 − cos t (κυκλοειδής)", x: t => t - Math.sin(t), y: t => 1 - Math.cos(t), dx: t => 1 - Math.cos(t), dy: t => Math.sin(t), a: 0, b: 4 * Math.PI, v: [6.3, 1, 7] },
      lis: { n: "x = sin 2t, y = sin 3t (Lissajous)", x: t => Math.sin(2 * t), y: t => Math.sin(3 * t), dx: t => 2 * Math.cos(2 * t), dy: t => 3 * Math.cos(3 * t), a: 0, b: 2 * Math.PI, v: [0, 0, 1.6] }
    };
    box.innerHTML = `<div class="wctl"><label>καμπύλη <select class="sel">${Object.entries(C).map(([k, c]) => `<option value="${k}">${c.n}</option>`).join("")}</select></label>${m2bSl("t", "t", 0, 1, 0.7, 0.005)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const c = C[$(".sel", box).value], u = m2bRd(box, ["t"]).t, t = c.a + (c.b - c.a) * u;
      $(".v-t", box).textContent = m2bN(t, 2);
      const P = gPlot($(".pl", box), c.v[0], c.v[1], c.v[2], 330), pts = [];
      for (let i = 0; i <= 400; i++) { const s = c.a + (c.b - c.a) * i / 400; pts.push([c.x(s), c.y(s)]); }
      m2bPath(P, pts, "stroke:var(--blue);stroke-width:2.6");
      const X = c.x(t), Y = c.y(t), DX = c.dx(t), DY = c.dy(t), L = Math.hypot(DX, DY);
      if (L > 1e-9) { const k = 4 * c.v[2]; P.seg(X - k * DX / L, Y - k * DY / L, X + k * DX / L, Y + k * DY / L, "tangent"); m2bArrow(P, X, Y, X + DX * 0.35 * c.v[2] / Math.max(1, L), Y + DY * 0.35 * c.v[2] / Math.max(1, L), "var(--green)", 3); }
      P.dot(X, Y, "d2");
      const sl = Math.abs(DX) < 1e-9 ? (Math.abs(DY) < 1e-9 ? "δεν ορίζεται (x′ = y′ = 0)" : "κατακόρυφη εφαπτομένη (dx/dt = 0)") : m2bN(DY / DX);
      $(".wout", box).innerHTML = `t = ${m2bN(t, 2)}: σημείο (${m2bN(X)}, ${m2bN(Y)}) · dx/dt = ${m2bN(DX)}, dy/dt = ${m2bN(DY)}<br>κλίση εφαπτομένης <b>dy/dx = (dy/dt)/(dx/dt) = ${sl}</b>${Math.abs(DY) < 1e-9 && Math.abs(DX) > 1e-9 ? " ⇒ <b>οριζόντια</b> εφαπτομένη" : ""}<br><span class="muted">Το πράσινο βέλος είναι το διάνυσμα ταχύτητας (x′(t), y′(t)): εφάπτεται στην καμπύλη και δείχνει τη φορά διαγραφής.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 4.2 πολικές καμπύλες και εμβαδόν ---------- */
  m2bpolar(box) {
    const C = {
      card: { n: "r = 1 + cos θ (καρδιοειδής)", r: q => 1 + Math.cos(q), T: 2 * Math.PI, A: "3π/2" },
      circ: { n: "r = 2 cos θ (κύκλος)", r: q => 2 * Math.cos(q), T: Math.PI, A: "π" },
      rose2: { n: "r = cos 2θ (ρόδο 4 φύλλων)", r: q => Math.cos(2 * q), T: 2 * Math.PI, A: "π/2" },
      rose3: { n: "r = sin 3θ (ρόδο 3 φύλλων)", r: q => Math.sin(3 * q), T: Math.PI, A: "π/4" },
      spir: { n: "r = θ/π (σπείρα Αρχιμήδη)", r: q => q / Math.PI, T: 2 * Math.PI, A: "4π/3 (για 0 ≤ θ ≤ 2π)" }
    };
    box.innerHTML = `<div class="wctl"><label>καμπύλη <select class="sel">${Object.entries(C).map(([k, c]) => `<option value="${k}">${c.n}</option>`).join("")}</select></label>${m2bSl("th", "θ έως", 0, 1, 0.6, 0.005)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const c = C[$(".sel", box).value], th = m2bRd(box, ["th"]).th * c.T;
      $(".v-th", box).textContent = m2bN(th / Math.PI, 2) + "π";
      const P = gPlot($(".pl", box), 0.4, 0, 2.6, 330), full = [], part = [[0, 0]];
      for (let i = 0; i <= 500; i++) { const q = c.T * i / 500, r = c.r(q); full.push([r * Math.cos(q), r * Math.sin(q)]); }
      let A = 0; const n = 300;
      for (let i = 0; i <= n; i++) { const q = th * i / n, r = c.r(q); part.push([r * Math.cos(q), r * Math.sin(q)]); if (i < n) { const q2 = th * (i + 0.5) / n; A += 0.5 * c.r(q2) ** 2 * th / n; } }
      m2bPoly(P, part, "fill:rgba(13,110,253,.16);stroke:none");
      m2bPath(P, full, "stroke:#b9c4d6;stroke-width:1.6;stroke-dasharray:5 4");
      m2bPath(P, part.slice(1), "stroke:var(--blue);stroke-width:2.8");
      const r = c.r(th), X = r * Math.cos(th), Y = r * Math.sin(th);
      P.seg(0, 0, X, Y, "guide"); P.dot(X, Y, "d2");
      $(".wout", box).innerHTML = `θ = ${m2bN(th / Math.PI, 2)}π, r(θ) = ${m2bN(r)} ⇒ (x, y) = (r cos θ, r sin θ) = (${m2bN(X)}, ${m2bN(Y)})<br>Σαρωμένο εμβαδόν <b>½∫₀^θ r² dθ ≈ ${m2bN(A)}</b> · για όλη την καμπύλη: ${c.A}<br><span class="muted">Όταν r &lt; 0 το σημείο σχεδιάζεται στην αντίθετη κατεύθυνση (θ + π)· ένα κομμάτι μπορεί να σαρωθεί δύο φορές — γι' αυτό διαλέγουμε προσεκτικά τα όρια του θ.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 5.1 / 5.3 ισοϋψείς, κλίση, κατευθυνόμενη παράγωγος ---------- */
  m2bgrad(box) {
    const F = {
      par: { n: "f = x² + y²", f: (x, y) => x * x + y * y, g: (x, y) => [2 * x, 2 * y], L: [1, 2, 4, 6, 9, 12] },
      ell: { n: "f = x² + 4y²", f: (x, y) => x * x + 4 * y * y, g: (x, y) => [2 * x, 8 * y], L: [1, 2, 4, 6, 9, 12] },
      sad: { n: "f = x² − y²", f: (x, y) => x * x - y * y, g: (x, y) => [2 * x, -2 * y], L: [-6, -4, -2, -1, 0, 1, 2, 4, 6] },
      xy: { n: "f = xy", f: (x, y) => x * y, g: (x, y) => [y, x], L: [-6, -3, -1, 1, 3, 6] },
      lin: { n: "f = 2x + y", f: (x, y) => 2 * x + y, g: () => [2, 1], L: [-8, -6, -4, -2, 0, 2, 4, 6, 8] }
    };
    box.innerHTML = `<div class="wctl"><label>συνάρτηση <select class="sel">${Object.entries(F).map(([k, c]) => `<option value="${k}">${c.n}</option>`).join("")}</select></label>${m2bSl("a", "a", -3, 3, 1, 0.5)}${m2bSl("b", "b", -2, 2, 1, 0.5)}${m2bSl("w", "κατεύθυνση φ°", 0, 360, 30, 5)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const c = F[$(".sel", box).value], p = m2bRd(box, ["a", "b", "w"]);
      const P = gPlot($(".pl", box), 0, 0, 4, 330);
      m2bContour(P, c.f, c.L, "stroke:#8fa6c8;stroke-width:1.5");
      const g = c.g(p.a, p.b), gn = Math.hypot(...g), ph = p.w * Math.PI / 180, u = [Math.cos(ph), Math.sin(ph)], D = g[0] * u[0] + g[1] * u[1];
      m2bContour(P, c.f, [c.f(p.a, p.b)], "stroke:var(--navy);stroke-width:2.4");
      if (gn > 1e-9) { const s = Math.min(1.6, 1.6 / gn) ; m2bArrow(P, p.a, p.b, p.a + g[0] * s, p.b + g[1] * s, "var(--red)", 3); }
      m2bArrow(P, p.a, p.b, p.a + u[0], p.b + u[1], "var(--green)", 3);
      P.dot(p.a, p.b, "d2");
      $(".wout", box).innerHTML = `Στο (${m2bN(p.a)}, ${m2bN(p.b)}): f = ${m2bN(c.f(p.a, p.b))} · <span style="color:var(--red)"><b>∇f = (${m2bN(g[0])}, ${m2bN(g[1])})</b></span>, ‖∇f‖ = ${m2bN(gn)}<br><span style="color:var(--green)">u = (cos φ, sin φ) = (${m2bN(u[0])}, ${m2bN(u[1])})</span> ⇒ <b>D<sub>u</sub>f = ∇f · u = ${m2bN(D)}</b>${gn > 1e-9 ? ` (μέγιστη τιμή ${m2bN(gn)} στην κατεύθυνση του ∇f)` : " (κρίσιμο σημείο: ∇f = 0)"}<br><span class="muted">Η σκούρα καμπύλη είναι η ισοϋψής που περνά από το σημείο· η κλίση ∇f είναι πάντα <b>κάθετη</b> σε αυτήν.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 5.2 τομές της επιφάνειας και μερικές παράγωγοι ---------- */
  m2bslice(box) {
    const F = {
      a: { n: "f = x²y + y²", f: (x, y) => x * x * y + y * y, fx: (x, y) => 2 * x * y, fy: (x, y) => x * x + 2 * y },
      b: { n: "f = 4 − x² − y²", f: (x, y) => 4 - x * x - y * y, fx: x => -2 * x, fy: (x, y) => -2 * y },
      c: { n: "f = x sin y", f: (x, y) => x * Math.sin(y), fx: (x, y) => Math.sin(y), fy: (x, y) => x * Math.cos(y) },
      d: { n: "f = eˣ⁻ʸ", f: (x, y) => Math.exp(x - y), fx: (x, y) => Math.exp(x - y), fy: (x, y) => -Math.exp(x - y) }
    };
    box.innerHTML = `<div class="wctl"><label>συνάρτηση <select class="sel">${Object.entries(F).map(([k, c]) => `<option value="${k}">${c.n}</option>`).join("")}</select></label>${m2bSl("a", "a", -2, 2, 1, 0.25)}${m2bSl("b", "b", -2, 2, 0.5, 0.25)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const c = F[$(".sel", box).value], p = m2bRd(box, ["a", "b"]), z0 = c.f(p.a, p.b), fx = c.fx(p.a, p.b), fy = c.fy(p.a, p.b);
      const ys = []; for (let i = 0; i <= 80; i++) { const s = -2.5 + 5 * i / 80; ys.push(c.f(s, p.b), c.f(p.a, s)); }
      const lo = Math.max(-12, Math.min(...ys)), hi = Math.min(12, Math.max(...ys)), mid = (lo + hi) / 2, half = Math.max(2.6, (hi - lo) * 0.62);
      const P = makePlot($(".pl", box), { xmin: -2.6, xmax: 2.6, ymin: mid - half, ymax: mid + half, H: 330, W: 560, xstep: 1, ystep: niceStep(2 * half) });
      P.curve(s => c.f(s, p.b), "c1"); P.curve(s => c.f(p.a, s), "c3");
      P.seg(-2.6, z0 + fx * (-2.6 - p.a), 2.6, z0 + fx * (2.6 - p.a), "tangent");
      P.seg(-2.6, z0 + fy * (-2.6 - p.b), 2.6, z0 + fy * (2.6 - p.b), "guide");
      P.dot(p.a, z0, "d1"); P.dot(p.b, z0, "d3");
      $(".wout", box).innerHTML = `<span style="color:var(--blue)">Μπλε: τομή y = ${m2bN(p.b)}, δηλαδή z = f(x, ${m2bN(p.b)})</span> — κλίση στο x = ${m2bN(p.a)}: <b>f<sub>x</sub>(${m2bN(p.a)}, ${m2bN(p.b)}) = ${m2bN(fx)}</b> (κόκκινη εφαπτομένη)<br><span style="color:var(--amber)">Πορτοκαλί: τομή x = ${m2bN(p.a)}, z = f(${m2bN(p.a)}, y)</span> — κλίση στο y = ${m2bN(p.b)}: <b>f<sub>y</sub> = ${m2bN(fy)}</b> (γκρι εφαπτομένη)<br>Εφαπτόμενο επίπεδο: z = ${m2bN(z0)} ${fx < 0 ? "−" : "+"} ${m2bN(Math.abs(fx))}(x ${p.a < 0 ? "+" : "−"} ${m2bN(Math.abs(p.a))}) ${fy < 0 ? "−" : "+"} ${m2bN(Math.abs(fy))}(y ${p.b < 0 ? "+" : "−"} ${m2bN(Math.abs(p.b))})<br><span class="muted">Ο οριζόντιος άξονας είναι το x για τη μπλε τομή και το y για την πορτοκαλί.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 5.4 ακρότατα και Lagrange ---------- */
  m2bextr(box) {
    const F = {
      min: { n: "f = x² + y² − 2x + 4y", f: (x, y) => x * x + y * y - 2 * x + 4 * y, v: [1, -1.5], cp: [[1, -2, "τοπικό ελάχιστο (D = 4 > 0, f_xx = 2 > 0)"]], L: [-4.5, -4, -3, -1, 1, 4, 8] },
      sad: { n: "f = x³ − 3x + y²", f: (x, y) => x ** 3 - 3 * x + y * y, cp: [[1, 0, "τοπικό ελάχιστο (D = 12 > 0)"], [-1, 0, "σαγματικό σημείο (D = −12 < 0)"]], L: [-3, -2, -1, 0, 1, 2, 3, 5] },
      max: { n: "f = xy − x² − y² + 3y", f: (x, y) => x * y - x * x - y * y + 3 * y, v: [0.8, 1.5], cp: [[1, 2, "τοπικό μέγιστο (D = 3 > 0, f_xx = −2 < 0)"]], L: [-6, -3, -1, 1, 2, 2.75, 3.5] },
      lag: { n: "f = x + y υπό x² + y² = 2", f: (x, y) => x + y, cp: [[1, 1, "μέγιστο υπό τον περιορισμό: f = 2"], [-1, -1, "ελάχιστο υπό τον περιορισμό: f = −2"]], L: [-3, -2, -1, 0, 1, 2, 3], g: (x, y) => x * x + y * y - 2 }
    };
    box.innerHTML = `<div class="wctl"><label>συνάρτηση <select class="sel">${Object.entries(F).map(([k, c]) => `<option value="${k}">${c.n}</option>`).join("")}</select></label>${m2bSl("c", "ισοϋψής f = c", -5, 5, 1, 0.25)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const c = F[$(".sel", box).value], lv = m2bRd(box, ["c"]).c, P = gPlot($(".pl", box), (c.v || [0, 0])[0], (c.v || [0, 0])[1], 3.6, 330);
      m2bContour(P, c.f, c.L, "stroke:#b3c2da;stroke-width:1.3");
      if (c.g) m2bContour(P, c.g, [0], "stroke:var(--purple);stroke-width:2.6");
      m2bContour(P, c.f, [lv], "stroke:var(--blue);stroke-width:2.6");
      c.cp.forEach(([x, y]) => P.dot(x, y, "dinf"));
      let tan = "";
      if (c.g) { const ok = Math.abs(Math.abs(lv) - 2) < 0.13; tan = ok ? `<b>Η ισοϋψής f = ${m2bN(lv)} εφάπτεται στον περιορισμό</b> ⇒ ∇f ∥ ∇g, ακρότατο υπό συνθήκη.` : `Μετακίνησε το c: όσο η ισοϋψής <b>τέμνει</b> τον κύκλο, η τιμή c μπορεί να βελτιωθεί· το ακρότατο είναι εκεί όπου απλώς <b>εφάπτεται</b> (c = ±2).`; }
      $(".wout", box).innerHTML = c.cp.map(([x, y, t]) => `(${x}, ${y}): ${t}`).join("<br>") + `<br>${tan || `<span class="muted">Γύρω από ελάχιστο/μέγιστο οι ισοϋψείς είναι κλειστές «ωοειδείς»· γύρω από σαγματικό σημείο σχηματίζουν «Χ».</span>`}`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 6.1 χωρία ολοκλήρωσης τύπου I / II ---------- */
  m2bregion(box) {
    const D = {
      par: { n: "ανάμεσα σε y = x² και y = x", lo: x => x * x, hi: x => x, a: 0, b: 1, ylo: y => y, yhi: y => Math.sqrt(y), c: 0, d: 1, I: "∫<sub>0</sub><sup>1</sup> ∫<sub>x²</sub><sup>x</sup> … dy dx", II: "∫<sub>0</sub><sup>1</sup> ∫<sub>y</sub><sup>√y</sup> … dx dy", v: [0.5, 0.5, 1.0] },
      tri: { n: "τρίγωνο (0,0), (1,0), (1,1)", lo: () => 0, hi: x => x, a: 0, b: 1, ylo: y => y, yhi: () => 1, c: 0, d: 1, I: "∫<sub>0</sub><sup>1</sup> ∫<sub>0</sub><sup>x</sup> … dy dx", II: "∫<sub>0</sub><sup>1</sup> ∫<sub>y</sub><sup>1</sup> … dx dy", v: [0.5, 0.5, 1.0] },
      sq: { n: "κάτω από y = 4 − x², x ≥ 0, y ≥ 0", lo: () => 0, hi: x => 4 - x * x, a: 0, b: 2, ylo: () => 0, yhi: y => Math.sqrt(4 - y), c: 0, d: 4, I: "∫<sub>0</sub><sup>2</sup> ∫<sub>0</sub><sup>4−x²</sup> … dy dx", II: "∫<sub>0</sub><sup>4</sup> ∫<sub>0</sub><sup>√(4−y)</sup> … dx dy", v: [1.2, 2, 3.6] },
      ex: { n: "0 ≤ x ≤ 2, x² ≤ y ≤ 4", lo: x => x * x, hi: () => 4, a: 0, b: 2, ylo: () => 0, yhi: y => Math.sqrt(y), c: 0, d: 4, I: "∫<sub>0</sub><sup>2</sup> ∫<sub>x²</sub><sup>4</sup> … dy dx", II: "∫<sub>0</sub><sup>4</sup> ∫<sub>0</sub><sup>√y</sup> … dx dy", v: [1.2, 2, 3.6] }
    };
    box.innerHTML = `<div class="wctl"><label>χωρίο <select class="sel">${Object.entries(D).map(([k, c]) => `<option value="${k}">${c.n}</option>`).join("")}</select></label><label>τομές <select class="ty"><option value="1">τύπου I (κατακόρυφες)</option><option value="2">τύπου II (οριζόντιες)</option></select></label>${m2bSl("s", "θέση τομής", 0.02, 0.98, 0.5, 0.01)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const c = D[$(".sel", box).value], ty = $(".ty", box).value, s = m2bRd(box, ["s"]).s, P = gPlot($(".pl", box), c.v[0], c.v[1], c.v[2], 330), pts = [];
      for (let i = 0; i <= 120; i++) { const x = c.a + (c.b - c.a) * i / 120; pts.push([x, c.hi(x)]); }
      for (let i = 120; i >= 0; i--) { const x = c.a + (c.b - c.a) * i / 120; pts.push([x, c.lo(x)]); }
      m2bPoly(P, pts, "fill:rgba(25,135,84,.16);stroke:var(--green);stroke-width:2");
      let txt;
      if (ty === "1") { const x = c.a + (c.b - c.a) * s; m2bArrow(P, x, c.lo(x), x, c.hi(x), "var(--red)", 3); txt = `Για σταθερό x = ${m2bN(x)} το y πηγαίνει από ${m2bN(c.lo(x))} (κάτω σύνορο) έως ${m2bN(c.hi(x))} (πάνω σύνορο).<br><b>${c.I}</b>`; }
      else { const y = c.c + (c.d - c.c) * s; m2bArrow(P, c.ylo(y), y, c.yhi(y), y, "var(--red)", 3); txt = `Για σταθερό y = ${m2bN(y)} το x πηγαίνει από ${m2bN(c.ylo(y))} (αριστερό σύνορο) έως ${m2bN(c.yhi(y))} (δεξί σύνορο).<br><b>${c.II}</b>`; }
      $(".wout", box).innerHTML = txt + `<br><span class="muted">Τύπος I: ${c.I} · Τύπος II: ${c.II}. Η αλλαγή σειράς ολοκλήρωσης ξεκινά πάντα από το σχήμα του χωρίου.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 6.2 πολικό ορθογώνιο ---------- */
  m2bpolreg(box) {
    box.innerHTML = `<div class="wctl">${m2bSl("a", "r από", 0, 3, 1, 0.25)}${m2bSl("b", "r έως", 0.25, 3, 2, 0.25)}${m2bSl("al", "θ από (°)", 0, 360, 0, 15)}${m2bSl("be", "θ έως (°)", 0, 360, 90, 15)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const p = m2bRd(box, ["a", "b", "al", "be"]), a = Math.min(p.a, p.b), b = Math.max(p.a, p.b), al = Math.min(p.al, p.be) * Math.PI / 180, be = Math.max(p.al, p.be) * Math.PI / 180;
      const P = gPlot($(".pl", box), 0, 0, 3.8, 330), pts = [];
      for (let i = 0; i <= 80; i++) { const q = al + (be - al) * i / 80; pts.push([b * Math.cos(q), b * Math.sin(q)]); }
      for (let i = 80; i >= 0; i--) { const q = al + (be - al) * i / 80; pts.push([a * Math.cos(q), a * Math.sin(q)]); }
      m2bPoly(P, pts, "fill:rgba(13,110,253,.16);stroke:var(--blue);stroke-width:2");
      for (let k = 1; k < 6; k++) { const q = al + (be - al) * k / 6; P.seg(a * Math.cos(q), a * Math.sin(q), b * Math.cos(q), b * Math.sin(q), "guide"); }
      for (let k = 1; k < 4; k++) { const r = a + (b - a) * k / 4, arc = []; for (let i = 0; i <= 40; i++) { const q = al + (be - al) * i / 40; arc.push([r * Math.cos(q), r * Math.sin(q)]); } m2bPath(P, arc, "stroke:#9aa8bf;stroke-width:1.2;stroke-dasharray:4 4"); }
      const A = 0.5 * (b * b - a * a) * (be - al);
      $(".wout", box).innerHTML = `Χωρίο: ${m2bN(a)} ≤ r ≤ ${m2bN(b)}, ${m2bN(al * 180 / Math.PI, 0)}° ≤ θ ≤ ${m2bN(be * 180 / Math.PI, 0)}°<br>Εμβαδόν = ∫∫ r dr dθ = ½(${m2bN(b)}² − ${m2bN(a)}²)·(β − α) = <b>${m2bN(A)}</b><br><span class="muted">Κάθε «κελί» έχει εμβαδόν ≈ r·Δr·Δθ: γι' αυτό στο ολοκλήρωμα εμφανίζεται ο παράγοντας r (η ορίζουσα Jacobi).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 6.3 κυλινδρικές / σφαιρικές συντεταγμένες ---------- */
  m2bsph(box) {
    box.innerHTML = `<div class="wctl">${m2bSl("rho", "ρ", 0.5, 3, 2, 0.25)}${m2bSl("ph", "φ (°)", 0, 180, 50, 5)}${m2bSl("th", "θ (°)", 0, 360, 40, 5)}${m2bSl("rot", "περιστροφή όψης", -60, 60, 0, 5)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const p = m2bRd(box, ["rho", "ph", "th", "rot"]), ph = p.ph * Math.PI / 180, th = p.th * Math.PI / 180, ro = p.rot * Math.PI / 180;
      const x = p.rho * Math.sin(ph) * Math.cos(th), y = p.rho * Math.sin(ph) * Math.sin(th), z = p.rho * Math.cos(ph), r = p.rho * Math.sin(ph);
      const svg = gyCanvas(box, 560, 330), cx = 270, cy = 205, k = 66;
      const pr = (X, Y, Z) => { const xr = X * Math.cos(ro) - Y * Math.sin(ro), yr = X * Math.sin(ro) + Y * Math.cos(ro); return [cx + k * (yr - 0.55 * xr), cy - k * (Z - 0.32 * xr)]; };
      const ln = (A, B, st) => { const a = pr(...A), b = pr(...B); gyAdd(svg, "line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], style: st }); };
      [[[3.2, 0, 0], "x"], [[0, 3.2, 0], "y"], [[0, 0, 3], "z"]].forEach(([E, l]) => { ln([0, 0, 0], E, "stroke:var(--navy);stroke-width:1.8"); const q = pr(...E); gyAdd(svg, "text", { x: q[0] + 6, y: q[1], style: gyTS }, l); });
      const eq = []; for (let i = 0; i <= 60; i++) { const q = 2 * Math.PI * i / 60; eq.push(pr(p.rho * Math.cos(q), p.rho * Math.sin(q), 0).join(",")); }
      gyAdd(svg, "polyline", { points: eq.join(" "), style: "fill:none;stroke:#c3cde0;stroke-width:1.2;stroke-dasharray:4 4" });
      ln([0, 0, 0], [x, y, z], "stroke:var(--blue);stroke-width:3");
      ln([x, y, z], [x, y, 0], "stroke:#9aa8bf;stroke-width:1.6;stroke-dasharray:5 4");
      ln([0, 0, 0], [x, y, 0], "stroke:var(--amber);stroke-width:2.4");
      const P0 = pr(x, y, z); gyAdd(svg, "circle", { cx: P0[0], cy: P0[1], r: 6, style: "fill:var(--red);stroke:#fff;stroke-width:2" });
      gyAdd(svg, "text", { x: P0[0] + 9, y: P0[1] - 8, style: gyTS }, "P");
      $(".wout", box).innerHTML = `Σφαιρικές (ρ, φ, θ) = (${m2bN(p.rho)}, ${p.ph}°, ${p.th}°)<br>Καρτεσιανές: x = ρ sin φ cos θ = ${m2bN(x)}, y = ρ sin φ sin θ = ${m2bN(y)}, z = ρ cos φ = ${m2bN(z)}<br><span style="color:var(--amber)">Κυλινδρικές: r = ρ sin φ = ${m2bN(r)}</span>, θ = ${p.th}°, z = ${m2bN(z)}<br><span class="muted">dV = r dz dr dθ (κυλινδρικές) = ρ² sin φ dρ dφ dθ (σφαιρικές).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  m2blim: { title: "Γεννήτρια — όρια συναρτήσεων δύο μεταβλητών", make() {
    const t = ri(0, 1);
    if (t === 0) { /* κατά μήκος y = mx της (a xy)/(x² + k y²) */
      const a = gyNZ(1, 4), k = ri(1, 3), m = gyNZ(-3, 3);
      return { q: R`Για την $f(x, y) = \dfrac{${a === 1 ? "" : a}xy}{x^2 + ${k === 1 ? "" : k}y^2}$ να βρείτε το όριο καθώς $(x, y) \to (0, 0)$ κατά μήκος της ευθείας $y = ${m2bCo(m, "x", true)}$.`,
        fields: [{ label: "=", ans: gyF(a * m, 1 + k * m * m) }], hint: R`Θέστε $y = ${m2bCo(m, "x", true)}$· το $x^2$ απλοποιείται.`,
        sol: R`$\dfrac{${a === 1 ? "" : a}x\cdot ${m < 0 ? `(${m2bCo(m, "x", true)})` : m2bCo(m, "x", true)}}{x^2 + ${k === 1 ? "" : k}(${m2bCo(m, "x", true)})^2} = \dfrac{${m2bCo(a * m, "x^2", true)}}{${1 + k * m * m}x^2} = ${gyT(a * m, 1 + k * m * m)}$. Το όριο εξαρτάται από το $m$ (για $y = 0$ είναι $0$), άρα το $\lim_{(x,y)\to(0,0)}$ δεν υπάρχει.` };
    }
    const a = gyNZ(-3, 3), b = gyNZ(-3, 3), c = ri(1, 4), x0 = gyNZ(-2, 2), y0 = gyNZ(-2, 2), den = x0 * x0 + y0 * y0 + c, num = a * x0 * y0 + b * y0;
    return { q: R`Να υπολογίσετε το $\displaystyle\lim_{(x,y)\to(${x0},${y0})}\frac{${m2bPoly1([[a, "xy"], [b, "y"]])}}{x^2 + y^2 + ${c}}$.`, fields: [{ label: "=", ans: gyF(num, den) }],
      hint: R`Ο παρονομαστής δεν μηδενίζεται: η συνάρτηση είναι συνεχής στο σημείο.`, sol: R`Αντικατάσταση: $${gcdI(num, den) > 1 || den === 1 ? `${num < 0 ? "-" : ""}\\frac{${Math.abs(num)}}{${den}} = ` : ""}${gyT(num, den)}$.` };
  } },
  m2bparam: { title: "Γεννήτρια — παραμετρικές καμπύλες", make() {
    const t = ri(0, 1);
    if (t === 0) { /* x = a t² + b, y = c t³ + d t, dy/dx στο t0 */
      const a = gyNZ(-3, 3), b = ri(-4, 4), c = gyNZ(-2, 2), d = ri(-5, 5), t0 = gyNZ(-2, 2), num = 3 * c * t0 * t0 + d, den = 2 * a * t0;
      const xt = m2bPoly1([[a, "t^2"]]) + gyS(b), yt = m2bPoly1([[c, "t^3"], [d, "t"]]);
      return { q: R`Δίνεται η καμπύλη $x = ${xt}$, $y = ${yt}$. Να βρείτε την κλίση $\dfrac{dy}{dx}$ της εφαπτομένης στο σημείο με $t = ${t0}$.`, fields: [{ label: "dy/dx =", ans: gyF(num, den) }],
        hint: R`$\dfrac{dy}{dx} = \dfrac{dy/dt}{dx/dt}$.`, sol: R`$\dfrac{dx}{dt} = ${m2bPoly1([[2 * a, "t"]])} = ${den}$, $\dfrac{dy}{dt} = ${m2bPoly1([[3 * c, "t^2"], [d, ""]])} = ${num}$ για $t = ${t0}$. Άρα $\dfrac{dy}{dx} = ${gyT(num, den)}$.` };
    }
    /* οριζόντια εφαπτομένη: x = t³ + p t, y = t² − 2 s t */
    const s = gyNZ(-3, 3), p = ri(1, 4), X = s ** 3 + p * s, Y = s * s - 2 * s * s;
    return { q: R`Η καμπύλη $x = ${m2bPoly1([[1, "t^3"], [p, "t"]])}$, $y = ${m2bPoly1([[1, "t^2"], [-2 * s, "t"]])}$ έχει οριζόντια εφαπτομένη σε ένα σημείο. Να το βρείτε.`, fields: [{ label: "x =", ans: X }, { label: "y =", ans: Y }],
      hint: R`Οριζόντια εφαπτομένη: $\dfrac{dy}{dt} = 0$ και $\dfrac{dx}{dt} \ne 0$.`, sol: R`$\dfrac{dy}{dt} = ${m2bPoly1([[2, "t"], [-2 * s, ""]])} = 0 \Rightarrow t = ${s}$, ενώ $\dfrac{dx}{dt} = 3t^2 + ${p} > 0$. Σημείο $(${X}, ${Y})$.` };
  } },
  m2bpolar: { title: "Γεννήτρια — πολικές συντεταγμένες", make() {
    const t = ri(0, 2);
    if (t === 0) { const r = ri(1, 6), k = bkPick([[0, "0", 1, 0], [1, "\\frac{\\pi}{2}", 0, 1], [2, "\\pi", -1, 0], [3, "\\frac{3\\pi}{2}", 0, -1]]);
      return { q: R`Να μετατρέψετε σε καρτεσιανές συντεταγμένες το σημείο με πολικές συντεταγμένες $(r, \theta) = \left(${r}, ${k[1]}\right)$.`, fields: [{ label: "x =", ans: r * k[2] }, { label: "y =", ans: r * k[3] }],
        hint: R`$x = r\cos\theta$, $y = r\sin\theta$.`, sol: R`$x = ${r}\cos ${k[1]} = ${r * k[2]}$, $y = ${r}\sin ${k[1]} = ${r * k[3]}$.` }; }
    if (t === 1) { const a = ri(1, 5), q = bkPick([[1, 1, 1, 4], [-1, 1, 3, 4], [-1, -1, 5, 4], [1, -1, 7, 4]]);
      return { q: R`Το σημείο $(${q[0] * a}, ${q[1] * a})$ έχει πολικές συντεταγμένες $(r, \theta)$ με $r > 0$, $0 \le \theta < 2\pi$. Να βρείτε το $r^2$ και τον λόγο $\theta/\pi$.`, fields: [{ label: "r² =", ans: 2 * a * a }, { label: "θ/π =", ans: gyF(q[2], q[3]) }],
        hint: R`$r^2 = x^2 + y^2$· βρείτε το τεταρτημόριο πριν από το $\tan\theta = y/x$.`, sol: R`$r^2 = ${a * a} + ${a * a} = ${2 * a * a}$ ($r = ${a === 1 ? "" : a}\sqrt2$). $\tan\theta = ${q[0] * q[1]}$ με το σημείο στο ${["", "1ο", "", "2ο", "", "3ο", "", "4ο"][q[2]]} τεταρτημόριο ⇒ $\theta = ${m2bPi(q[2], q[3])}$.` }; }
    const r = ri(1, 5), dn = bkPick([2, 3, 4, 6]), nm = ri(1, dn - 1);
    return { q: R`Να υπολογίσετε το εμβαδόν του κυκλικού τομέα $0 \le r \le ${r}$, $0 \le \theta \le ${m2bPi(nm, dn)}$ με το $A = \frac12\int_\alpha^\beta r^2\,d\theta$. Αν $A = \kappa\pi$, πόσο είναι το $\kappa$;`, fields: [{ label: "κ =", ans: gyF(r * r * nm, 2 * dn) }],
      hint: R`Το $r$ είναι σταθερό: $A = \frac12 r^2(\beta - \alpha)$.`, sol: R`$A = \frac12\cdot ${r * r}\cdot ${m2bPi(nm, dn)} = ${m2bPi(r * r * nm, 2 * dn)}$, άρα $\kappa = ${gyT(r * r * nm, 2 * dn)}$.` };
  } },
  m2bpart: { title: "Γεννήτρια — μερικές παράγωγοι", make() {
    const a = gyNZ(-4, 4), m = ri(2, 3), n = ri(1, 3), b = gyNZ(-5, 5), c = ri(-3, 3), x0 = gyNZ(-2, 2), y0 = gyNZ(-2, 2);
    const fx = a * m * x0 ** (m - 1) * y0 ** n + b * y0, fy = a * n * x0 ** m * y0 ** (n - 1) + b * x0 + 2 * c * y0;
    const pw = (v, e) => e === 1 ? v : `${v}^{${e}}`, f = m2bPoly1([[a, pw("x", m) + pw("y", n)], [b, "xy"], [c, "y^2"]]);
    return { q: R`Για τη συνάρτηση $f(x, y) = ${f}$ να βρείτε τις $f_x(${x0}, ${y0})$ και $f_y(${x0}, ${y0})$.`, fields: [{ label: "f_x =", ans: fx }, { label: "f_y =", ans: fy }],
      hint: R`Για την $f_x$ το $y$ θεωρείται σταθερά, και αντίστροφα.`, sol: R`$f_x = ${m2bPoly1([[a * m, pw("x", m - 1).replace(/^x\^\{1\}$/, "x") + pw("y", n)], [b, "y"]])}$, $f_y = ${m2bPoly1([[a * n, pw("x", m) + (n - 1 ? pw("y", n - 1) : "")], [b, "x"], [2 * c, "y"]])}$. Στο $(${x0}, ${y0})$: $f_x = ${fx}$, $f_y = ${fy}$.` };
  } },
  m2bgrad: { title: "Γεννήτρια — κλίση και κατευθυνόμενη παράγωγος", make() {
    const a = gyNZ(-3, 3), b = gyNZ(-3, 3), c = ri(-3, 3), x0 = gyNZ(-2, 2), y0 = gyNZ(-2, 2);
    const gx = 2 * a * x0 + c * y0, gy = 2 * b * y0 + c * x0, tr = bkPick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [-3, 4, 5], [3, -4, 5], [-5, 12, 13]]);
    if (gx === 0 && gy === 0) return GENS.m2bgrad.make();
    const f = m2bPoly1([[a, "x^2"], [b, "y^2"], [c, "xy"]]);
    return { q: R`Δίνεται $f(x, y) = ${f}$. Να βρείτε την κλίση $\nabla f(${x0}, ${y0})$ και την κατευθυνόμενη παράγωγο στο $(${x0}, ${y0})$ προς την κατεύθυνση του $\vec v = (${tr[0]}, ${tr[1]})$.`, fields: [{ label: "f_x =", ans: gx }, { label: "f_y =", ans: gy }, { label: "D_u f =", ans: gyF(gx * tr[0] + gy * tr[1], tr[2]) }],
      hint: R`Πρώτα κανονικοποιούμε: $\vec u = \vec v/\|\vec v\|$ με $\|\vec v\| = ${tr[2]}$.`, sol: R`$\nabla f = (${m2bPoly1([[2 * a, "x"], [c, "y"]])},\ ${m2bPoly1([[2 * b, "y"], [c, "x"]])}) = (${gx}, ${gy})$. $\vec u = \left(${gyT(tr[0], tr[2])}, ${gyT(tr[1], tr[2])}\right)$, $D_{\vec u}f = \nabla f\cdot\vec u = ${gyT(gx * tr[0] + gy * tr[1], tr[2])}$.` };
  } },
  m2bcrit: { title: "Γεννήτρια — κρίσιμα σημεία", make() {
    const p = ri(-3, 3), q = ri(-3, 3), A = gyNZ(-3, 3), B = ri(-3, 3), C = gyNZ(-3, 3), Dd = 4 * A * C - B * B;
    if (Dd === 0) return GENS.m2bcrit.make();
    const D = -(2 * A * p + B * q), E = -(B * p + 2 * C * q), f = m2bPoly1([[A, "x^2"], [B, "xy"], [C, "y^2"], [D, "x"], [E, "y"]]);
    const kind = Dd < 0 ? 2 : A > 0 ? 0 : 1, names = ["τοπικό ελάχιστο", "τοπικό μέγιστο", "σαγματικό σημείο"];
    if (ri(0, 1)) return { q: R`Να βρείτε το (μοναδικό) κρίσιμο σημείο της $f(x, y) = ${f}$.`, fields: [{ label: "x =", ans: p }, { label: "y =", ans: q }],
      hint: R`Λύστε το σύστημα $f_x = 0$, $f_y = 0$.`, sol: R`$f_x = ${m2bPoly1([[2 * A, "x"], [B, "y"], [D, ""]])} = 0$, $f_y = ${m2bPoly1([[B, "x"], [2 * C, "y"], [E, ""]])} = 0$ ⇒ $(x, y) = (${p}, ${q})$.` };
    return bkMC({ q: R`Η $f(x, y) = ${f}$ έχει κρίσιμο σημείο το $(${p}, ${q})$. Τι είδους είναι;`, hint: R`$D = f_{xx}f_{yy} - f_{xy}^2$.`,
      sol: R`$f_{xx} = ${2 * A}$, $f_{yy} = ${2 * C}$, $f_{xy} = ${B}$ ⇒ $D = ${2 * A}\cdot ${2 * C < 0 ? `(${2 * C})` : 2 * C} - ${B < 0 ? `(${B})` : B}^2 = ${Dd}$. ${Dd < 0 ? "$D < 0$ ⇒ σαγματικό σημείο." : `$D > 0$ και $f_{xx} ${A > 0 ? ">" : "<"} 0$ ⇒ ${names[kind]}.`}` },
      [names[kind], ...names.filter((_, i) => i !== kind), "δεν προκύπτει συμπέρασμα (D = 0)"], 0);
  } },
  m2bdbl: { title: "Γεννήτρια — διπλά ολοκληρώματα σε ορθογώνιο", make() {
    const a = ri(1, 3), b = ri(1, 3), m = ri(0, 2), n = ri(0, 2), k = gyNZ(1, 4);
    /* ∫0^a∫0^b k x^m y^n dy dx = k a^{m+1}/(m+1) · b^{n+1}/(n+1) */
    const N = k * a ** (m + 1) * b ** (n + 1), Dn = (m + 1) * (n + 1), pw = (v, e) => e === 0 ? "" : e === 1 ? v : `${v}^{${e}}`;
    const ig = (k === 1 && !m && !n ? "1" : (k === 1 ? "" : k) + pw("x", m) + pw("y", n)) || "1";
    return { q: R`Να υπολογίσετε το $\displaystyle\int_0^{${a}}\!\!\int_0^{${b}} ${ig}\,dy\,dx$.`, fields: [{ label: "=", ans: gyF(N, Dn) }],
      hint: R`Ο ολοκληρωτέος είναι γινόμενο συνάρτησης του $x$ και συνάρτησης του $y$ σε ορθογώνιο: το ολοκλήρωμα «σπάει» σε γινόμενο.`,
      sol: R`$${k === 1 ? "" : k}\left(\int_0^{${a}} ${pw("x", m) || "1"}\,dx\right)\left(\int_0^{${b}} ${pw("y", n) || "1"}\,dy\right) = ${k === 1 ? "" : k + "\\cdot"}${gyT(a ** (m + 1), m + 1)}\cdot ${gyT(b ** (n + 1), n + 1)} = ${gyT(N, Dn)}$.` };
  } },
  m2bpolint: { title: "Γεννήτρια — ολοκληρώματα σε πολικές", make() {
    const Rr = ri(1, 3), k = ri(0, 2), qd = bkPick([[1, "ο δίσκος", 2, 1], [4, "το τμήμα στο 1ο τεταρτημόριο του δίσκου", 1, 2], [2, "ο άνω ημιδίσκος", 1, 1]]);
    /* ∬ (x²+y²)^k dA = (β−α) R^{2k+2}/(2k+2) */
    const N = qd[2] * Rr ** (2 * k + 2), Dn = qd[3] * (2 * k + 2), ig = k === 0 ? "1" : k === 1 ? "(x^2 + y^2)" : "(x^2 + y^2)^2";
    return { q: R`Να υπολογίσετε με πολικές συντεταγμένες το $\iint_D ${ig}\,dA$, όπου $D$ ${qd[1]} $x^2 + y^2 \le ${Rr * Rr}$. Αν το αποτέλεσμα είναι $\kappa\pi$, πόσο είναι το $\kappa$;`, fields: [{ label: "κ =", ans: gyF(N, Dn) }],
      hint: R`$x^2 + y^2 = r^2$ και $dA = r\,dr\,d\theta$.`, sol: R`$\int_\alpha^\beta\!\int_0^{${Rr}} ${k === 0 ? "r" : `r^{${2 * k}}\\cdot r`}\,dr\,d\theta = (\beta - \alpha)\cdot\frac{${Rr}^{${2 * k + 2}}}{${2 * k + 2}}$ με $\beta - \alpha = ${m2bPi(qd[2], qd[3])}$ ⇒ $${m2bPi(N, Dn)}$.` };
  } },
  m2btriple: { title: "Γεννήτρια — τριπλά ολοκληρώματα", make() {
    const a = ri(1, 3), b = ri(1, 3), c = ri(1, 3), e = [ri(0, 1), ri(0, 1), ri(0, 2)];
    const N = a ** (e[0] + 1) * b ** (e[1] + 1) * c ** (e[2] + 1), Dn = (e[0] + 1) * (e[1] + 1) * (e[2] + 1), pw = (v, k) => k === 0 ? "" : k === 1 ? v : `${v}^{${k}}`;
    const ig = pw("x", e[0]) + pw("y", e[1]) + pw("z", e[2]) || "1";
    return { q: R`Να υπολογίσετε το $\iiint_B ${ig}\,dV$, όπου $B = [0, ${a}]\times[0, ${b}]\times[0, ${c}]$.`, fields: [{ label: "=", ans: gyF(N, Dn) }],
      hint: R`Σε ορθογώνιο παραλληλεπίπεδο με χωριζόμενο ολοκληρωτέο, το ολοκλήρωμα είναι γινόμενο τριών απλών.`,
      sol: R`$${gyT(a ** (e[0] + 1), e[0] + 1)}\cdot ${gyT(b ** (e[1] + 1), e[1] + 1)}\cdot ${gyT(c ** (e[2] + 1), e[2] + 1)} = ${gyT(N, Dn)}$.` };
  } }
});

/* ================= Parser: μαθηματική έκφραση → συνάρτηση του x ================= */
const MathParse = (() => {
  const FN = {
    "τοξημ": Math.asin, "τοξσυν": Math.acos, "τοξεφ": Math.atan, "arcsin": Math.asin, "arccos": Math.acos, "arctan": Math.atan,
    "sqrt": Math.sqrt, "abs": Math.abs, "exp": Math.exp, "ln": Math.log, "log": Math.log10,
    "ημ": Math.sin, "συν": Math.cos, "εφ": Math.tan, "σφ": x => 1 / Math.tan(x), "sin": Math.sin, "cos": Math.cos, "tan": Math.tan, "cot": x => 1 / Math.tan(x),
    "sinh": Math.sinh, "cosh": Math.cosh, "tanh": Math.tanh, "coth": x => 1 / Math.tanh(x), "sech": x => 1 / Math.cosh(x), "csch": x => 1 / Math.sinh(x),
    "arsinh": Math.asinh, "arcosh": Math.acosh, "artanh": Math.atanh, "asinh": Math.asinh, "acosh": Math.acosh, "atanh": Math.atanh,
    "asin": Math.asin, "acos": Math.acos, "atan": Math.atan, "sec": x => 1 / Math.cos(x), "csc": x => 1 / Math.sin(x)
  };
  const NAMES = Object.keys(FN).sort((a, b) => b.length - a.length);
  function normalize(s) {
    s = String(s)
      .replace(/[−–—]/g, "-").replace(/[·×∙⋅]/g, "*").replace(/÷/g, "/")
      .replace(/√/g, "sqrt").replace(/π/g, "pi")
      .replace(/²/g, "^2").replace(/³/g, "^3").replace(/⁴/g, "^4").replace(/⁵/g, "^5")
      .replace(/(\d),(\d)/g, "$1.$2")
      .replace(/^\s*(y|f\s*\(\s*x\s*\)|F\s*\(\s*x\s*\)|s\s*\(\s*t\s*\))\s*=\s*/i, "")
      .replace(/\s+/g, "");
    for (let k = 0; k < 4 && s.includes("|"); k++) s = s.replace(/\|([^|]+)\|/g, "abs($1)");
    return s;
  }
  function tokenize(s) {
    const t = []; let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (/[0-9.]/.test(ch)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; t.push({ k: "n", v: parseFloat(s.slice(i, j)) }); i = j; }
      else if (/[a-zA-Zα-ωά-ώΑ-ΩΆ-Ώς]/.test(ch)) {
        let j = i; while (j < s.length && /[a-zA-Zα-ωά-ώΑ-ΩΆ-Ώς]/.test(s[j])) j++;
        let w = s.slice(i, j).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
        while (w.length) {
          const name = NAMES.find(n => w.startsWith(n));
          if (name) { t.push({ k: "f", v: name }); w = w.slice(name.length); }
          else if (w.startsWith("pi")) { t.push({ k: "n", v: Math.PI }); w = w.slice(2); }
          else if (w[0] === "e") { t.push({ k: "n", v: Math.E }); w = w.slice(1); }
          else if (w[0] === "x" || w[0] === "t" || w[0] === "χ" || w[0] === "ν" || w[0] === "n") { t.push({ k: "x" }); w = w.slice(1); }
          else if (w[0] === "c" || w[0] === "κ") { t.push({ k: "n", v: 0 }); w = w.slice(1); }
          else throw new Error("Άγνωστο σύμβολο: " + w[0]);
        }
        i = j;
      }
      else if ("+-*/^()".includes(ch)) { t.push({ k: ch }); i++; }
      else throw new Error("Άγνωστο σύμβολο: " + ch);
    }
    return t;
  }
  function parse(src) {
    const toks = tokenize(normalize(src)); let p = 0;
    const peek = () => toks[p], eat = k => { if (toks[p] && toks[p].k === k) return toks[p++]; throw new Error("Συντακτικό λάθος"); };
    function expr() { let a = term(); while (peek() && (peek().k === "+" || peek().k === "-")) { const op = toks[p++].k, l = a, r = term(); a = op === "+" ? x => l(x) + r(x) : x => l(x) - r(x); } return a; }
    function startsAtom(t) { return t && (t.k === "n" || t.k === "x" || t.k === "f" || t.k === "("); }
    function term() {
      let a = unary();
      for (;;) {
        const t = peek();
        if (t && (t.k === "*" || t.k === "/")) { p++; const l = a, r = unary(); a = t.k === "*" ? x => l(x) * r(x) : x => l(x) / r(x); }
        else if (startsAtom(t)) { const l = a, r = power(); a = x => l(x) * r(x); }
        else break;
      }
      return a;
    }
    function unary() { const t = peek(); if (t && t.k === "-") { p++; const u = unary(); return x => -u(x); } if (t && t.k === "+") { p++; return unary(); } return power(); }
    function power() { const b = atom(); if (peek() && peek().k === "^") { p++; const e = unary(); return x => Math.pow(b(x), e(x)); } return b; }
    function atom() {
      const t = peek(); if (!t) throw new Error("Ελλιπής έκφραση");
      if (t.k === "n") { p++; const v = t.v; return () => v; }
      if (t.k === "x") { p++; return x => x; }
      if (t.k === "f") {
        p++; const F = FN[t.v];
        let ex = null; if (peek() && peek().k === "^") { p++; ex = atom(); }       // ημ^2x
        let a;
        if (peek() && peek().k === "(") { eat("("); a = expr(); eat(")"); }
        else { // ημ2x, ln x^2, συν3x : συντελεστής * x (και δύναμη)
          const numArg = peek() && peek().k === "n";
          a = power();
          while (peek() && (peek().k === "x" || (peek().k === "(" && !(t.v === "sqrt" && numArg)))) { const l = a, r = power(); a = x => l(x) * r(x); }  // √2(…) = √2·(…)
        }
        return ex ? x => Math.pow(F(a(x)), ex(x)) : x => F(a(x));
      }
      if (t.k === "(") { p++; const e = expr(); eat(")"); return e; }
      throw new Error("Συντακτικό λάθος");
    }
    const f = expr(); if (p < toks.length) throw new Error("Συντακτικό λάθος");
    return f;
  }
  return { parse };
})();

const close = (a, b, rel = 1e-6) => Math.abs(a - b) <= rel * Math.max(1, Math.abs(b));
const PTS = [-2.3, -1.4, -0.6, 0.7, 1.3, 2.1, 3.2];
const PPTS = [0.4, 0.9, 1.6, 2.5, 3.7];

const ptsFor = pos => Array.isArray(pos) ? [0.13, 0.29, 0.41, 0.58, 0.77, 0.86].map(t => pos[0] + t * (pos[1] - pos[0])) : (pos ? PPTS : PTS);
function checkExpr(student, ref, pos) {
  const S = MathParse.parse(student), Rf = MathParse.parse(ref);
  let n = 0;
  for (const x of ptsFor(pos)) { const a = S(x), b = Rf(x); if (!isFinite(b)) continue; if (!isFinite(a) || !close(a, b, 1e-6)) return false; n++; }
  return n >= 3;
}
function checkAnti(student, f, pos, x0, y0) {
  const F = MathParse.parse(student), g = MathParse.parse(f), h = 1e-4;
  let n = 0;
  for (const x of ptsFor(pos)) {
    const want = g(x); if (!isFinite(want)) continue;
    const d = (F(x + h) - F(x - h)) / (2 * h);
    if (!isFinite(d) || !close(d, want, 1e-4)) return false; n++;
  }
  if (n < 3) return false;
  if (x0 !== undefined) return close(F(x0), y0, 1e-6);
  return true;
}
function numVal(s) { const v = MathParse.parse(s)(NaN); return v; }

/* ================= Πρόοδος (localStorage, προαιρετικό) ================= */
const STORE_KEY = CONFIG.storeKey;
let PROG = {};
try { PROG = JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {}; } catch (e) { PROG = {}; }
function saveProg() { try { localStorage.setItem(STORE_KEY, JSON.stringify(PROG)); } catch (e) {} }
const exKey = (sid, i) => sid + "#" + i;
function secDone(s) { return s.exercises.filter((_, i) => PROG[exKey(s.id, i)]).length; }

/* ================= Βοηθητικά ================= */
const $ = (sel, el = document) => el.querySelector(sel);
const h = (tag, attrs = {}, html = "") => { const e = document.createElement(tag); for (const k in attrs) { if (k === "class") e.className = attrs[k]; else if (k.startsWith("on")) e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]); } if (html) e.innerHTML = html; return e; };
function typeset(el) { if (window.renderMathInElement) renderMathInElement(el, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }], throwOnError: false }); }
const LVL = { 1: ["Βασική", "l1"], 2: ["Μέτρια", "l2"], 3: ["Απαιτητική", "l3"] };
const fmt = v => { const r = Math.round(v * 100) / 100; return (Object.is(r, -0) ? 0 : r).toLocaleString("el-GR", { maximumFractionDigits: 2 }); };
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

/* ================= SVG plotter ================= */
const NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; }
function makePlot(container, o) {
  const W = o.W || 560, H = o.H || 320;
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "plot", role: "img" });
  container.innerHTML = ""; container.appendChild(svg);
  const P = { svg, W, H, ...o };
  P.sx = x => (x - P.xmin) / (P.xmax - P.xmin) * W;
  P.sy = y => H - (y - P.ymin) / (P.ymax - P.ymin) * H;
  P.ix = px => P.xmin + px / W * (P.xmax - P.xmin);
  P.layer = svgEl("g", {}); P.top = svgEl("g", {});
  const grid = svgEl("g", { class: "grid" });
  const step = o.xstep || 1, ystep = o.ystep || niceStep(P.ymax - P.ymin);
  for (let x = Math.ceil(P.xmin / step) * step; x <= P.xmax; x += step) {
    grid.appendChild(svgEl("line", { x1: P.sx(x), x2: P.sx(x), y1: 0, y2: H }));
    if (Math.abs(x) > 1e-9) { const t = svgEl("text", { x: P.sx(x), y: Math.min(H - 4, Math.max(12, P.sy(0) + 14)), "text-anchor": "middle", class: "tick" }); t.textContent = fmt(x); grid.appendChild(t); }
  }
  for (let y = Math.ceil(P.ymin / ystep) * ystep; y <= P.ymax; y += ystep) {
    grid.appendChild(svgEl("line", { x1: 0, x2: W, y1: P.sy(y), y2: P.sy(y) }));
    if (Math.abs(y) > 1e-9) { const t = svgEl("text", { x: Math.min(W - 4, Math.max(4, P.sx(0) - 5)), y: P.sy(y) + 4, "text-anchor": P.sx(0) < 30 ? "start" : "end", class: "tick" }); t.textContent = fmt(y); grid.appendChild(t); }
  }
  svg.appendChild(grid);
  if (P.ymin < 0 && P.ymax > 0) svg.appendChild(svgEl("line", { x1: 0, x2: W, y1: P.sy(0), y2: P.sy(0), class: "axis" }));
  if (P.xmin < 0 && P.xmax > 0) svg.appendChild(svgEl("line", { x1: P.sx(0), x2: P.sx(0), y1: 0, y2: H, class: "axis" }));
  svg.appendChild(P.layer); svg.appendChild(P.top);
  P.clear = () => { P.layer.innerHTML = ""; P.top.innerHTML = ""; };
  P.curve = (f, cls = "c1", a = P.xmin, b = P.xmax, layer = P.layer) => {
    let d = "", pen = false; const n = 400;
    for (let i = 0; i <= n; i++) {
      const x = a + (b - a) * i / n, y = f(x);
      if (!isFinite(y) || y < P.ymin - (P.ymax - P.ymin) || y > P.ymax + (P.ymax - P.ymin)) { pen = false; continue; }
      d += (pen ? "L" : "M") + P.sx(x).toFixed(1) + "," + P.sy(y).toFixed(1); pen = true;
    }
    const e = svgEl("path", { d, class: "curve " + cls }); layer.appendChild(e); return e;
  };
  P.dot = (x, y, cls = "d1", label, dx = 6, dy = -8) => {
    P.top.appendChild(svgEl("circle", { cx: P.sx(x), cy: P.sy(y), r: 5, class: "dot " + cls }));
    if (label) { const t = svgEl("text", { x: P.sx(x) + dx, y: P.sy(y) + dy, class: "lbl " + cls, "text-anchor": dx < 0 ? "end" : "start" }); t.textContent = label; P.top.appendChild(t); }
  };
  P.band = (a, b, cls) => P.layer.insertBefore(svgEl("rect", { x: P.sx(a), y: 0, width: Math.max(0, P.sx(b) - P.sx(a)), height: H, class: "band " + cls }), P.layer.firstChild);
  P.seg = (x1, y1, x2, y2, cls) => P.top.appendChild(svgEl("line", { x1: P.sx(x1), y1: P.sy(y1), x2: P.sx(x2), y2: P.sy(y2), class: cls }));
  return P;
}
function niceStep(span) { const r = span / 8, p = Math.pow(10, Math.floor(Math.log10(r))), m = r / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
function fitY(f, a, b, pad = 0.15, extra = []) {
  const ys = [];
  for (let i = 0; i <= 300; i++) { const y = f(a + (b - a) * i / 300); if (isFinite(y)) ys.push(y); }
  ys.sort((u, v) => u - v);
  let lo = ys.length ? ys[0] : -1, hi = ys.length ? ys[ys.length - 1] : 1;
  if (ys.length > 20) { const q1 = ys[Math.floor(ys.length * 0.06)], q2 = ys[Math.floor(ys.length * 0.94)]; if (hi - lo > 12 * Math.max(q2 - q1, 1)) { lo = q1; hi = q2; } }
  for (const y of extra) { lo = Math.min(lo, y); hi = Math.max(hi, y); }
  const s = Math.max(hi - lo, 1); return [lo - s * pad, hi + s * pad];
}
function roots(f, a, b) { const r = []; const n = 800; let px = a, py = f(a); for (let i = 1; i <= n; i++) { const x = a + (b - a) * i / n, y = f(x); if (py === 0) r.push(px); else if (py * y < 0) { let l = px, hgh = x; for (let k = 0; k < 50; k++) { const m = (l + hgh) / 2; if (f(l) * f(m) <= 0) hgh = m; else l = m; } r.push((l + hgh) / 2); } px = x; py = y; } return r.filter((v, i, arr) => i === 0 || Math.abs(v - arr[i - 1]) > 1e-6); }
const D = (f, x, e = 1e-4) => (f(x + e) - f(x - e)) / (2 * e);
const D2 = (f, x, e = 1e-3) => (f(x + e) - 2 * f(x) + f(x - e)) / (e * e);

/* ================= Κάρτα άσκησης ================= */
function exerciseCard(ex, opts) {
  const { title, onSolved, solved, quiz } = opts;
  const card = h("div", { class: "ex" + (solved ? " solved" : "") });
  const lv = LVL[ex.level] || null;
  card.innerHTML = `<div class="exh"><span class="exn">${title}</span>${lv ? `<span class="lvl ${lv[1]}">${lv[0]}</span>` : ""}<span class="tick-ok">${solved ? "✓ Λυμένη" : ""}</span></div><div class="exq">${ex.q}</div>`;
  const body = h("div", { class: "exb" });
  const type = ex.type || (ex.fields ? "fields" : "mc");
  let inputs = [];
  if (type === "mc") {
    const name = "mc" + Math.random().toString(36).slice(2);
    if (!ex._sh) { ex._sh = true;
      const tf = ex.options.length === 2 && ex.options.every(o => /^\s*(ΣΩΣΤΟ|ΛΑΘΟΣ)\s*$/.test(o)), ord = ex.options.every(o => String(o).length <= 3);
      if (tf && /ΛΑΘΟΣ/.test(ex.options[0])) { ex.options = ["ΣΩΣΤΟ", "ΛΑΘΟΣ"]; ex.correct = 1 - ex.correct; }
      /* οι λύσεις που αναφέρονται σε επιλογές «κατά θέση» (1ο, τελευταίο, …) κρατούν τη σειρά τους */
      const pos = /(^|[^0-9])[1-6]ο(ς|υ)?(?![0-9])|πρώτ[οηαε]|δεύτερ|τρίτ[οηαε]|τέταρτ|τελευταί|επιλογή \(?[α-δ]/i.test(String(ex.sol || "") + String(ex.hint || ""));
      if (!tf && !ord && !ex.noshuffle && !pos) { const idx = shuffle(ex.options.map((_, i) => i)); ex.options = idx.map(i => ex.options[i]); ex.correct = idx.indexOf(ex.correct); } }
    ex.options.forEach((o, i) => { const l = h("label", { class: "opt" }, `<input type="radio" name="${name}" value="${i}"><span>${o}</span>`); body.appendChild(l); });
  } else if (type === "fields") {
    const g = h("div", { class: "fields" });
    ex.fields.forEach(fd => { const l = h("label", { class: "fld" }, `<span>${fd.label}</span><input type="text" inputmode="decimal" autocomplete="off" spellcheck="false">`); g.appendChild(l); inputs.push($("input", l)); });
    body.appendChild(g);
  } else {
    const l = h("label", { class: "fld wide" }, `<span>${ex.label || (type === "expr" || type === "ivp" ? "f(x) =" : "Απάντηση:")}</span><input type="text" autocomplete="off" spellcheck="false" placeholder="π.χ. x^3/3 - 2x + 1">`);
    body.appendChild(l); inputs.push($("input", l));
    body.appendChild(h("div", { class: "preview muted" }));
    inputs[0].addEventListener("input", () => { const pv = $(".preview", body); try { MathParse.parse(inputs[0].value); pv.textContent = inputs[0].value ? "✓ συντακτικά σωστή έκφραση" : ""; pv.className = "preview muted"; } catch (e) { pv.textContent = inputs[0].value ? "⚠ " + e.message : ""; pv.className = "preview warnc"; } });
  }
  const bar = h("div", { class: "exbar" });
  const bCheck = h("button", { class: "btn primary" }, "Έλεγχος");
  const bHint = h("button", { class: "btn ghost" }, "💡 Υπόδειξη");
  const bSol = h("button", { class: "btn ghost" }, "📖 Λύση");
  const fb = h("div", { class: "fb", "aria-live": "polite" });
  const hint = h("div", { class: "hint hidden" }, ex.hint ? "<b>Υπόδειξη:</b> " + ex.hint : "");
  const sol = h("div", { class: "sol hidden" }, "<b>Λύση:</b> " + ex.sol);
  if (!quiz) { bar.append(bCheck); if (ex.hint) bar.append(bHint); } bar.append(bSol);
  if (quiz) bSol.classList.add("hidden");
  body.append(bar, fb, hint, sol);
  card.appendChild(body);
  let tries = 0;
  bHint.onclick = () => { hint.classList.toggle("hidden"); typeset(hint); };
  bSol.onclick = () => {
    sol.classList.toggle("hidden");
    if (!sol.dataset.r) { sol.dataset.r = 1; typeset(sol); if (ex.graph) { const pl = h("div", { class: "pl solgraph" }); sol.appendChild(pl); drawGraph(pl, ex.graph); } }
  };
  let lastOk = null;
  bCheck.onclick = () => { lastOk = doCheck(); return lastOk; };
  function doCheck() {
    tries++; let ok = false;
    try {
      if (type === "mc") {
        const sel = $("input:checked", body); if (!sel) { fb.className = "fb warnc"; fb.textContent = quiz ? "Δεν απαντήθηκε." : "Διάλεξε μια απάντηση."; return false; }
        ok = +sel.value === ex.correct;
        body.querySelectorAll(".opt").forEach((o, i) => { o.classList.remove("right", "wrong"); if (i === +sel.value) o.classList.add(ok ? "right" : "wrong"); });
      } else if (type === "fields") {
        let all = true, empty = false;
        ex.fields.forEach((fd, i) => {
          const inp = inputs[i]; inp.classList.remove("right", "wrong");
          if (!inp.value.trim()) { empty = true; all = false; return; }
          let good = false; try { const want = typeof fd.ans === "string" ? numVal(fd.ans) : fd.ans;
            const plain = typeof fd.ans === "number" || /^-?\d+(\/\d+)?$/.test(fd.ans), lit = /^\s*[+\-−]?\s*\d+([.,]\d+)?(\s*\/\s*\d+)?\s*$/.test(inp.value);
            good = (!plain || lit) && close(numVal(inp.value.replace("−", "-")), want, fd.tol || 1e-6); } catch (e) { good = false; }
          inp.classList.add(good ? "right" : "wrong"); if (!good) all = false;
        });
        ok = all; if (empty && !ok) { fb.className = "fb warnc"; fb.textContent = quiz ? (ex.fields.every((_, i) => !inputs[i].value.trim()) ? "Δεν απαντήθηκε." : "Ελλιπής απάντηση — δες τη λύση.") : "Συμπλήρωσε όλα τα πεδία."; return false; }
      } else {
        const v = inputs[0].value; if (!v.trim()) { fb.className = "fb warnc"; fb.textContent = quiz ? "Δεν απαντήθηκε." : "Γράψε την απάντησή σου."; return false; }
        if (type === "expr") ok = checkExpr(v, ex.ref, ex.pos);
        else if (type === "anti") ok = checkAnti(v, ex.f, ex.pos);
        else if (type === "ivp") ok = checkAnti(v, ex.f, ex.pos, ex.x0, ex.y0);
        inputs[0].classList.remove("right", "wrong"); inputs[0].classList.add(ok ? "right" : "wrong");
        if (!ok && type === "ivp") { try { if (checkAnti(v, ex.f, ex.pos)) { fb.className = "fb warnc"; fb.innerHTML = "Σχεδόν! Η παράγωγος είναι σωστή, αλλά δεν ικανοποιείται η αρχική συνθήκη — έλεγξε τη σταθερά c."; return false; } } catch (e) {} }
      }
    } catch (e) { fb.className = "fb warnc"; fb.textContent = "Δεν μπορώ να διαβάσω την απάντηση: " + e.message; return false; }
    if (ok) {
      fb.className = "fb okc"; fb.innerHTML = ["Σωστά! 🎉", "Μπράβο, σωστό!", "Τέλεια!"][tries % 3] + (tries > 1 ? ` <span class="muted">(${tries}η προσπάθεια)</span>` : "");
      card.classList.add("solved"); $(".tick-ok", card).textContent = "✓ Λυμένη"; onSolved && onSolved();
    } else {
      fb.className = "fb badc"; fb.innerHTML = quiz ? "Λάθος — δες τη λύση." : (tries >= 2 && ex.hint && hint.classList.contains("hidden") ? "Όχι ακόμα. Δες την υπόδειξη!" : "Όχι ακόμα — ξαναπροσπάθησε.");
    }
    return ok;
  }
  if (!quiz) card.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type === "text") bCheck.click(); });
  card.grade = () => { const r = doCheck(); bSol.classList.remove("hidden"); body.querySelectorAll("input").forEach(i => i.disabled = true); return r; };
  return card;
}
function drawGraph(pl, g) {
  const f = typeof g === "function" ? g : MathParse.parse(g);
  const ex = roots(x => D(f, x), -6, 6).filter(r => isFinite(f(r)) && Math.abs(f(r) - f(r + 1e-3)) < 0.05); let a = -3, b = 3;
  if (ex.length) { a = Math.min(...ex) - 1.8; b = Math.max(...ex) + 1.8; }
  const [lo, hi] = fitY(f, a, b, 0.15);
  const P = makePlot(pl, { xmin: a, xmax: b, ymin: lo, ymax: hi, H: 260 });
  P.curve(f, "c1");
  for (const r of ex) { const s1 = D(f, r - 0.02), s2 = D(f, r + 0.02); if (s1 * s2 < 0 && isFinite(f(r)) && Math.abs(f(r) - f(r + 1e-3)) < 0.05) P.dot(r, f(r), s1 > 0 ? "dmax" : "dmin", `(${fmt(r)}, ${fmt(f(r))})`, 6, s1 > 0 ? -8 : 18); }
  for (const r of roots(x => D2(f, x), a, b)) if (D2(f, r - 0.05) * D2(f, r + 0.05) < 0 && isFinite(f(r)) && Math.abs(f(r) - f(r + 1e-3)) < 0.05) P.dot(r, f(r), "dinf", "καμπή");
}

/* ================= Σελίδες ================= */
let CURRENT = null;
const ROUTE = window.ROUTE || { base: "", slugs: {}, titles: {} };
const urlFor = id => id === "home" ? ROUTE.base : id === "quiz" ? ROUTE.base + "#quiz" : ROUTE.base + (ROUTE.slugs[id] || "") + "/";
function lnk(cls, id, html) {
  const a = h("a", { class: cls, href: urlFor(id) }, html);
  a.addEventListener("click", e => { if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button) return; e.preventDefault(); go(id); });
  return a;
}
function renderNav() {
  const nav = $("#nav"); nav.innerHTML = "";
  nav.appendChild(lnk("navit" + (CURRENT === "home" ? " on" : ""), "home", `<span class="nid">⌂</span><span class="nt">Αρχική & πρόοδος</span>`));
  nav.appendChild(lnk("navit quizit" + (CURRENT === "quiz" ? " on" : ""), "quiz", `<span class="nid">📝</span><span class="nt">Quiz — κάνε διαγώνισμα</span>`));
  for (const u of UNITS) {
    nav.appendChild(h("div", { class: "navu" }, u.title.replace(" · ", "<br><small>") + "</small>"));
    for (const s of SECTIONS.filter(s => s.unit === u.id)) {
      const d = secDone(s), n = s.exercises.length, pct = Math.round(d / n * 100);
      nav.appendChild(lnk("navit" + (CURRENT === s.id ? " on" : ""), s.id,
        `<span class="nid">${s.id}</span><span class="nt">${s.title}</span><span class="ring" style="--p:${pct}" title="${d}/${n}">${d === n ? "✓" : ""}</span>`));
    }
  }
}
function go(id, scroll = true, push = true) {
  CURRENT = id; renderNav();
  const main = $("#main"); main.innerHTML = "";
  if (id === "home") renderHome(main); else if (id === "quiz") renderQuiz(main); else renderSection(main, SECTIONS.find(s => s.id === id));
  typeset(main);
  if (ROUTE.titles[id]) document.title = ROUTE.titles[id];
  try { if (/^https?:/.test(location.protocol) && ROUTE.base) { const u = urlFor(id); if (location.pathname + location.hash !== u) history[push ? "pushState" : "replaceState"]({ id }, "", u); } } catch (e) {}
  if (scroll) { const top = $("#app").getBoundingClientRect().top + window.scrollY - 76; window.scrollTo({ top: Math.max(0, top), behavior: "smooth" }); }
}
function renderHome(main) {
  const total = SECTIONS.reduce((a, s) => a + s.exercises.length, 0), done = SECTIONS.reduce((a, s) => a + secDone(s), 0);
  const heroTxt = `<h1>${CONFIG.heroTitle}</h1>
    <p>${CONFIG.heroLead || `Διαδραστική θεωρία, γραφήματα που κινούνται και ασκήσεις με <b>άμεσο έλεγχο</b>, υποδείξεις και πλήρεις λύσεις για όλη την ύλη του ${CONFIG.tefxos}.`}</p>
    <div class="bigprog"><div class="bar"><i style="width:${total ? done / total * 100 : 0}%"></i></div><span>${done} / ${total} ασκήσεις λυμένες</span></div>
    <p class="muted small">Η πρόοδος αποθηκεύεται μόνο σε αυτή τη συσκευή.</p>`;
  main.appendChild(h("section", { class: "card hero" + (CONFIG.heroArt ? " art" : "") }, CONFIG.heroArt ? `<div>${heroTxt}</div><div class="heroart" aria-hidden="true">${CONFIG.heroArt}</div>` : heroTxt));
  for (const u of UNITS) {
    const grid = h("div", { class: "secgrid" });
    for (const s of SECTIONS.filter(s => s.unit === u.id)) {
      const d = secDone(s), n = s.exercises.length;
      grid.appendChild(lnk("seccard", s.id, `<span class="sid">${s.id}</span><b>${s.title}</b><span class="bar"><i style="width:${d / n * 100}%"></i></span><small>${d}/${n} ασκήσεις${s.widget ? " · διαδραστικό γράφημα" : ""}${s.gen ? " · γεννήτρια" : ""}</small>${s.thumb || ""}`));
    }
    main.appendChild(h("h2", { class: "unith" }, CONFIG.unitChips ? `<span class="uchip">${u.id}</span>${u.title.replace(/^Κεφ\. \d+ · /, "")}` : u.title)); main.appendChild(grid);
  }
  main.appendChild(lnk("card quizcta", "quiz", `<span style="font-size:28px">📝</span><span><b>Δοκίμασε ένα Quiz</b><br><span class="muted">Τυχαίες ασκήσεις από τις ενότητες που θέλεις, με βαθμό και λύσεις στο τέλος.</span></span><span class="go">Ξεκίνα →</span>`));
  main.appendChild(h("section", { class: "card howto" }, `<h3>Πώς γράφω απαντήσεις;</h3>
    ${CONFIG.howto}
    <button class="btn ghost small" id="resetp">Μηδενισμός προόδου</button>`));
  $("#resetp", main).onclick = () => { if (confirm("Να διαγραφεί η πρόοδός σου σε αυτή τη συσκευή;")) { PROG = {}; saveProg(); go("home", false); } };
}
function renderSection(main, s) {
  const idx = SECTIONS.indexOf(s);
  main.appendChild(h("div", { class: "sechead" }, `<span class="sid big">${s.id}</span><div><h1>${s.title}</h1><div class="muted small">📘 ${s.book}</div></div>`));
  if (s.intro) main.appendChild(h("p", { class: "intro" }, s.intro));
  const th = h("section", { class: "card" }, `<h3 class="blk">Θεωρία</h3>${s.theory}`);
  main.appendChild(th);
  if (s.widget) { const w = h("section", { class: "card widget" }, `<h3 class="blk">Πειραματίσου</h3><div class="wbody"></div>`); main.appendChild(w); WIDGETS[s.widget]($(".wbody", w)); }
  const exs = h("section", { class: "card" }, `<h3 class="blk">Ασκήσεις <span class="muted small">— ${secDone(s)}/${s.exercises.length} λυμένες</span></h3>`);
  s.exercises.forEach((ex, i) => exs.appendChild(exerciseCard(ex, { title: `Άσκηση ${i + 1}`, solved: !!PROG[exKey(s.id, i)], onSolved: () => { PROG[exKey(s.id, i)] = 1; saveProg(); renderNav(); $(".blk .muted", exs).textContent = `— ${secDone(s)}/${s.exercises.length} λυμένες`; } })));
  main.appendChild(exs);
  if (s.gen) {
    const G = GENS[s.gen], gs = h("section", { class: "card gen" }, `<h3 class="blk">♾️ ${G.title}</h3><p class="muted small">Κάθε φορά καινούργια άσκηση — εξάσκηση χωρίς τέλος.</p><div class="gslot"></div><button class="btn primary newg">Νέα άσκηση ↻</button>`);
    main.appendChild(gs);
    let count = 0;
    const fresh = () => { count++; const slot = $(".gslot", gs); slot.innerHTML = ""; const ex = G.make(); slot.appendChild(exerciseCard(ex, { title: `Εξάσκηση #${count}` })); typeset(slot); };
    $(".newg", gs).onclick = fresh; fresh();
  }
  const nav = h("div", { class: "pager" });
  if (idx > 0) nav.appendChild(lnk("btn ghost", SECTIONS[idx - 1].id, `← ${SECTIONS[idx - 1].id} ${SECTIONS[idx - 1].title}`)); else nav.appendChild(h("span"));
  if (idx < SECTIONS.length - 1) nav.appendChild(lnk("btn primary", SECTIONS[idx + 1].id, `${SECTIONS[idx + 1].id} ${SECTIONS[idx + 1].title} →`));
  main.appendChild(nav);
}


/* ================= Quiz ================= */
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function renderQuiz(main) {
  const chips = SECTIONS.map(s => `<label class="qchip"><input type="checkbox" value="${s.id}" checked><span><b>${s.id}</b> ${s.title}</span></label>`).join("");
  const setup = h("section", { class: "card" }, `<h2>📝 Quiz</h2>
    <p class="muted" style="margin:6px 0 14px">Τυχαίες ασκήσεις από τις ενότητες που διαλέγεις. Απαντάς σε όλες και στο τέλος παίρνεις <b>βαθμό</b> και τις <b>λύσεις</b>. Χωρίς υποδείξεις — όπως στις εξετάσεις!</p>
    <div class="qhead"><b>Ενότητες</b> <button class="btn ghost small qall">Όλες</button><button class="btn ghost small qnone">Καμία</button></div>
    <div class="qchips">${chips}</div>
    <div class="qopts"><label>Αριθμός ασκήσεων <select class="qn"><option>5</option><option selected>10</option><option>15</option><option>20</option></select></label>
    <label><input type="checkbox" class="qgen" checked> να περιλαμβάνει και ασκήσεις από γεννήτριες</label></div>
    <button class="btn primary qgo">Ξεκίνα το quiz →</button>`);
  main.appendChild(setup);
  const area = h("div"); main.appendChild(area);
  $(".qall", setup).onclick = () => setup.querySelectorAll(".qchip input").forEach(i => i.checked = true);
  $(".qnone", setup).onclick = () => setup.querySelectorAll(".qchip input").forEach(i => i.checked = false);
  $(".qgo", setup).onclick = () => {
    const ids = [...setup.querySelectorAll(".qchip input:checked")].map(i => i.value);
    if (!ids.length) { alert("Διάλεξε τουλάχιστον μία ενότητα."); return; }
    const N = +$(".qn", setup).value, useGen = $(".qgen", setup).checked;
    let pool = [];
    for (const s of SECTIONS.filter(s => ids.includes(s.id))) {
      s.exercises.forEach((ex, i) => pool.push({ ex, sid: s.id, i }));
      if (useGen && s.gen && GENS[s.gen]) for (let k = 0; k < 2; k++) pool.push({ gen: s.gen, sid: s.id });
    }
    pool = shuffle(pool).slice(0, N);
    area.innerHTML = "";
    const t0 = Date.now();
    const head = h("div", { class: "card qbar" }, `<b>Quiz · ${pool.length} ασκήσεις</b><span class="qtime">⏱ 0:00</span>`);
    area.appendChild(head);
    const timer = setInterval(() => { if (!document.body.contains(head)) return clearInterval(timer); const s = Math.floor((Date.now() - t0) / 1000); $(".qtime", head).textContent = `⏱ ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }, 1000);
    const cards = pool.map((it, k) => {
      const ex = it.gen ? GENS[it.gen].make() : it.ex;
      const c = exerciseCard(ex, { title: `Ερώτηση ${k + 1} <span class="muted small">· ${it.sid}</span>`, quiz: true, onSolved: it.gen ? null : () => { PROG[exKey(it.sid, it.i)] = 1; saveProg(); } });
      area.appendChild(c); return c;
    });
    const submit = h("button", { class: "btn primary qsub" }, "Υποβολή & βαθμολογία ✓");
    area.appendChild(submit); typeset(area);
    window.scrollTo({ top: head.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    submit.onclick = () => {
      clearInterval(timer);
      const res = cards.map(c => c.grade()), ok = res.filter(Boolean).length, pct = Math.round(ok / cards.length * 100);
      const sec = Math.floor((Date.now() - t0) / 1000);
      const msg = pct >= 90 ? "Εξαιρετικά! 🏆" : pct >= 70 ? "Πολύ καλά! 👏" : pct >= 50 ? "Καλή βάση — δες τις λύσεις στα λάθη." : "Συνέχισε την εξάσκηση — διάβασε τις λύσεις και ξαναδοκίμασε.";
      const score = h("div", { class: "card qscore" }, `<div class="qbig">${ok} / ${cards.length}</div><div><b>${pct}%</b> · χρόνος ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}<br>${msg}<br><span class="muted small">Πάτησε «📖 Λύση» σε κάθε ερώτηση για να δεις τη λύση.</span></div><button class="btn primary qagain">Νέο quiz ↻</button>`);
      area.insertBefore(score, area.firstChild); submit.remove(); renderNav();
      $(".qagain", score).onclick = () => { $(".qgo", setup).click(); };
      window.scrollTo({ top: score.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    };
  };
}

function boot() {
  let start = window.START_SEC || "home";
  try { const hsh = decodeURIComponent(location.hash.slice(1)); if (hsh && (hsh === "home" || hsh === "quiz" || SECTIONS.some(s => s.id === hsh))) start = hsh; } catch (e) {}
  go(start, false, false);
  window.addEventListener("popstate", e => { const id = e.state && e.state.id || window.START_SEC || "home"; go(id, false, false); });
}
if (window.renderMathInElement) boot(); else window.addEventListener("load", boot);

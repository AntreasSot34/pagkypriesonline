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

/* ================= C++ helpers (Πληροφορική Γ΄ Λυκείου) =================
   CPP(src, opts)  → HTML <pre class="cpp"> με χρωματισμό σύνταξης & αριθμούς γραμμών
       opts: { title:"main.cpp", hl:[3,4] (γραμμές με έμφαση), nonum:true, small:true }
   CPPlines(src)   → πίνακας HTML (μία ανά γραμμή) για widgets που φωτίζουν τρέχουσα γραμμή
   OUT(text, title)→ HTML «οθόνη εξόδου» (κονσόλα)
   cppEsc(s)       → HTML escape
   Το src γράφεται ως απλό κείμενο C++ (χωρίς &lt;): το escape γίνεται εδώ.
   Η πρώτη/τελευταία κενή γραμμή αφαιρείται, η κοινή εσοχή επίσης. */
const cppEsc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const CPP_KW = new Set("int float double char bool void string const return if else switch case default break continue for while do struct true false using namespace include cout cin endl ifstream ofstream fstream iostream cmath iomanip cstring cstdlib ctime std new delete sizeof long short unsigned auto static stack queue vector".split(" "));
const CPP_TY = new Set("int float double char bool void string long short unsigned auto ifstream ofstream fstream stack queue vector".split(" "));
function cppHL(line) {
  let out = "", i = 0; const L = line;
  if (/^\s*#/.test(L)) return `<span class="cpp-pp">${cppEsc(L)}</span>`;
  while (i < L.length) {
    const c = L[i];
    if (c === "/" && L[i + 1] === "/") { out += `<span class="cpp-cm">${cppEsc(L.slice(i))}</span>`; break; }
    if (c === "/" && L[i + 1] === "*") { const j = L.indexOf("*/", i + 2), e = j < 0 ? L.length : j + 2; out += `<span class="cpp-cm">${cppEsc(L.slice(i, e))}</span>`; i = e; continue; }
    if (c === '"' || c === "'") { let j = i + 1; while (j < L.length && L[j] !== c) { if (L[j] === "\\") j++; j++; } out += `<span class="cpp-st">${cppEsc(L.slice(i, j + 1))}</span>`; i = j + 1; continue; }
    if (/[0-9]/.test(c) && !/[A-Za-z_0-9]/.test(L[i - 1] || "")) { const m = /^[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?f?/.exec(L.slice(i)); out += `<span class="cpp-nu">${m[0]}</span>`; i += m[0].length; continue; }
    if (/[A-Za-z_]/.test(c)) { const m = /^[A-Za-z_][A-Za-z_0-9]*/.exec(L.slice(i))[0]; const cls = CPP_TY.has(m) ? "cpp-ty" : CPP_KW.has(m) ? "cpp-kw" : /^\s*\(/.test(L.slice(i + m.length)) ? "cpp-fn" : ""; out += cls ? `<span class="${cls}">${m}</span>` : m; i += m.length; continue; }
    out += cppEsc(c); i++;
  }
  return out;
}
function cppClean(src) {
  let ls = String(src).replace(/\t/g, "    ").split("\n");
  while (ls.length && !ls[0].trim()) ls.shift();
  while (ls.length && !ls[ls.length - 1].trim()) ls.pop();
  const ind = Math.min(...ls.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
  return ls.map(l => l.slice(ind));
}
function CPPlines(src) { return cppClean(src).map(cppHL); }
function CPP(src, o = {}) {
  const ls = cppClean(src), hl = new Set(o.hl || []);
  const body = ls.map((l, k) => `<span class="cl${hl.has(k + 1) ? " on" : ""}">${o.nonum ? "" : `<i>${k + 1}</i>`}${cppHL(l) || " "}</span>`).join("");
  return `<div class="cppbox${o.small ? " sm" : ""}">${o.title ? `<div class="cpptitle">${cppEsc(o.title)}</div>` : ""}<pre class="cpp${o.nonum ? " nonum" : ""}"><code>${body}</code></pre></div>`;
}
function OUT(text, title) {
  return `<div class="conbox">${`<div class="cpptitle">${cppEsc(title || "Οθόνη (έξοδος)")}</div>`}<pre class="con"><code>${cppEsc(cppClean(text).join("\n"))}</code></pre></div>`;
}
/* ICON("01", "blue") → μικρό εικονίδιο κάρτας ενότητας (thumb) με σύντομο κείμενο σε κονσόλα */
function ICON(txt, c = "blue") {
  const col = { blue: "#0F6FD1", purple: "#6F42C1", amber: "#C77A0A", green: "#198754", red: "#DC3545" }[c] || c;
  return `<svg class="thumb" viewBox="0 0 96 56" aria-hidden="true"><rect x="2" y="4" width="92" height="48" rx="9" fill="#0f1a2e"/><circle cx="12" cy="13" r="2.6" fill="#ff5f56"/><circle cx="20" cy="13" r="2.6" fill="#ffbd2e"/><circle cx="28" cy="13" r="2.6" fill="#27c93f"/><text x="48" y="40" text-anchor="middle" font-family="SF Mono,Consolas,Menlo,monospace" font-weight="700" font-size="${txt.length > 5 ? 13 : 17}" fill="${col}" style="filter:brightness(1.6)">${cppEsc(txt)}</text></svg>`;
}

/* ================= Νέα Ελληνικά — βοηθήματα (preloaded πριν από τα δεδομένα) =================
   PASSAGE(text, {title, source, num:"par"|"line"|false, hl:[...]})
       → πλαίσιο κειμένου· παράγραφοι χωρίζονται με κενή γραμμή. num:"par" αριθμεί παραγράφους (§1…),
         num:"line" αριθμεί στίχους/γραμμές (κάθε γραμμή = στίχος). Γράψε απλό κείμενο (κάνει escape).
         Σημεία έμφασης: [[λέξη]] → υπογράμμιση (όπως οι «υπογραμμισμένες λέξεις» των εξετάσεων).
   LETTER(txt, c) → εικονίδιο κάρτας ενότητας (thumb), σε στυλ σελίδας βιβλίου.
   neEsc(s) → HTML escape. */
const neEsc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const neMark = s => neEsc(s).replace(/\[\[(.+?)\]\]/g, '<u class="neu">$1</u>');
function PASSAGE(text, o = {}) {
  const src = String(text).replace(/^\n+|\n+$/g, "");
  let body;
  if (o.num === "line") {
    const ls = src.split("\n"); let n = 0;
    body = ls.map(l => { if (!l.trim()) return '<span class="nel gap"></span>'; n++; return `<span class="nel"><i>${(n % 5 === 0 || n === 1) ? n : ""}</i>${neMark(l)}</span>`; }).join("");
    body = `<div class="nepoem">${body}</div>`;
  } else {
    const ps = src.split(/\n\s*\n/);
    body = ps.map((p, k) => `<p>${o.num === "par" ? `<b class="nepn">§${k + 1}</b>` : ""}${neMark(p.replace(/\n/g, " "))}</p>`).join("");
  }
  return `<figure class="nepass">${o.title ? `<figcaption class="netitle">${neEsc(o.title)}</figcaption>` : ""}${body}${o.source ? `<div class="nesrc">${neEsc(o.source)}</div>` : ""}</figure>`;
}
function LETTER(txt, c = "red") {
  const col = { red: "#C62828", blue: "#0F6FD1", purple: "#6F42C1", amber: "#C77A0A", green: "#198754" }[c] || c;
  return `<svg class="thumb" viewBox="0 0 96 56" aria-hidden="true"><rect x="3" y="4" width="90" height="48" rx="8" fill="#fff8f6" stroke="${col}" stroke-opacity=".35"/><rect x="3" y="4" width="7" height="48" rx="3" fill="${col}"/><text x="52" y="37" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-weight="700" font-size="${txt.length > 6 ? 13 : txt.length > 4 ? 16 : 20}" fill="${col}">${neEsc(txt)}</text></svg>`;
}

const R = String.raw;
const CONFIG = {
  storeKey: "pagk-nea-ellinika-glossa-v1",
  heroTitle: "Νέα Ελληνικά Γ΄ Λυκείου — Παγκύπριες: Γλώσσα",
  tefxos: "Γλώσσα",
  widgetLabel: "διαδραστική άσκηση",
  noacc: true,
  heroLead: "Περίληψη, τρόποι και μέσα πειθούς, δομή παραγράφου, συνοχή, ύφος, εκφραστικά μέσα, λεξιλόγιο και παραγωγή λόγου (άρθρο, επιστολή, δοκίμιο, ομιλία) για τις Παγκύπριες. <b>Δωρεάν υλικό</b> — δεν προσφέρουμε ιδιαίτερα μαθήματα Νέων Ελληνικών.",
  howto: `<ul><li>Απαντήσεις-λέξεις: γράψε τη λέξη, π.χ. «<b>ωφέλιμος</b>» — οι τόνοι και τα κεφαλαία δεν μετρούν.</li>
    <li>Ερωτήσεις ανοιχτού τύπου (περίληψη, κριτική τοποθέτηση, παραγωγή λόγου): γράψε στο τετράδιό σου και σύγκρινε με την <b>ενδεικτική απάντηση</b> και τα κριτήρια.</li>
    <li>Το υλικό δίνεται <b>δωρεάν</b>· δεν προσφέρουμε ιδιαίτερα μαθήματα Νέων Ελληνικών.</li>
    <li>Ύλη: Παγκύπριες Εξετάσεις, «Νέα Ελληνικά» Γ΄ Λυκείου (πίνακας προδιαγραφών ΥΠΑΝ).</li></ul>`
};

const UNITS = [
  { id: 1, title: "Παγκύπριες: δομή εξέτασης και θέματα 2026" },
  { id: 2, title: "Κατανόηση κειμένου: περίληψη, πειθώ, ύφος" },
  { id: 3, title: "Οργάνωση λόγου: δομή κειμένου και παραγράφου" },
  { id: 4, title: "Εκφραστικά μέσα και λεξιλόγιο" },
  { id: 5, title: "Παραγωγή γραπτού λόγου: κειμενικά είδη" },
  { id: 6, title: "Θεματικές ενότητες: ιδέες και επιχειρήματα" }
];

const SECTIONS = [
/* ───────────────────────────── 1.1 ───────────────────────────── */
{
  id: "1.1", unit: 1, title: "Νέα Ελληνικά Παγκύπριες: δομή του εξεταστικού δοκιμίου, μονάδες και είδη ερωτήσεων",
  book: "Πίνακας προδιαγραφών Παγκυπρίων 2026 «Νέα Ελληνικά» · Παγκύπριες 2026, εξεταστικό δοκίμιο και οδηγός διόρθωσης · «Είδη ερωτήσεων» ΥΠΑΝ",
  intro: "Πώς είναι δομημένο το εξεταστικό δοκίμιο των Νέων Ελληνικών στις Παγκύπριες, πόσες μονάδες παίρνει κάθε ερώτηση και τι ακριβώς ζητά κάθε ρήμα της εκφώνησης;",
  thumb: LETTER("100 μον."),
  theory: R`
<p>Το μάθημα <b>Νέα Ελληνικά</b> είναι ένα από τα βασικά μαθήματα των <b>Παγκυπρίων Εξετάσεων</b> της Γ΄ Λυκείου. Το εξεταστικό δοκίμιο διαρκεί <b>3 ώρες</b> και βαθμολογείται με <b>100 μονάδες</b>, που μοιράζονται σε δύο μέρη: τη <b>Νέα Ελληνική Γλώσσα</b> (70 μονάδες) και τη <b>Λογοτεχνία</b> (30 μονάδες). Αν ξέρεις από πριν τι θα συναντήσεις, ποιες ερωτήσεις «αξίζουν» περισσότερο και τι σημαίνει κάθε ρήμα της εκφώνησης, κερδίζεις χρόνο και μονάδες. Η ενότητα αυτή στηρίζεται στον επίσημο πίνακα προδιαγραφών, στο εξεταστικό δοκίμιο του 2026 και στον οδηγό διόρθωσης του Υπουργείου.</p>
<div class="tbox def"><h4>Η δομή του εξεταστικού δοκιμίου</h4>
<table class="tbl"><tr><th>Μέρος</th><th>Τι περιλαμβάνει</th><th>Μονάδες</th></tr>
<tr><td><b>Α΄ · Νέα Ελληνική Γλώσσα</b></td><td><b>Α.Ι Κατανόηση περιεχομένου και μορφής</b>: ένα μη λογοτεχνικό κείμενο (συνήθως άρθρο ή δοκίμιο) και περίπου 6–7 ερωτήσεις — περίληψη, τρόποι/μέσα πειθούς, οργάνωση και γλώσσα του κειμένου, κριτική τοποθέτηση, λεξιλόγιο.</td><td>30</td></tr>
<tr><td></td><td><b>Α.ΙΙ Παραγωγή γραπτού επικοινωνιακού λόγου</b>: ένα κείμενο 450–500 λέξεων σε συγκεκριμένο κειμενικό είδος (άρθρο, επιστολή, ομιλία, δοκίμιο), πάνω σε μια από τις τέσσερις θεματικές ενότητες.</td><td>40</td></tr>
<tr><td><b>Β΄ · Λογοτεχνία</b></td><td><b>Β1</b>: διδαγμένο κείμενο (ερμηνεία, τεκμηρίωση, εκφραστικά μέσα) · <b>Β2</b>: διδαγμένο και <b>αδίδακτο</b> κείμενο (σύγκριση) · <b>Β3</b>: απόσπασμα από το <b>λογοτεχνικό βιβλίο</b>.</td><td>30</td></tr></table>
<p>Στο δοκίμιο του 2026 οι μονάδες ήταν: Α.Ι.1 περίληψη 8 · Α.Ι.2 και Α.Ι.3 από 3 · Α.Ι.4 3 · Α.Ι.5 κριτική τοποθέτηση 5 · Α.Ι.6 αντώνυμα 4 · Α.Ι.7 παράγωγα 4 (σύνολο 30) — Α.ΙΙ άρθρο 40 — Β1 6 + 6 · Β2 6 + 4 · Β3 8 (σύνολο 30).</p></div>
<div class="tbox thm"><h4>Πώς βαθμολογείται η παραγωγή λόγου (40 μονάδες)</h4>
<p>Ο οδηγός διόρθωσης μοιράζει τις 40 μονάδες σε τέσσερα κριτήρια:</p>
<ul><li><b>Περιεχόμενο — 12</b>: πρόλογος 1,5 · κύριο μέρος 9 (κάθε ζητούμενο σημείο με ανάπτυξη) · επίλογος 1,5.</li>
<li><b>Δομή — 12</b>: εξωτερικά στοιχεία (πρόλογος, κύριο μέρος, επίλογος) 2 · δομή αποδεικτικού λόγου (θέση, υποστήριξη, συμπέρασμα) 4 · δομή παραγράφων 2 · αλληλουχία και σύνδεση ιδεών 4.</li>
<li><b>Έκφραση — 12</b>: σαφήνεια και σύνταξη 4 · ακριβολογία και λεξιλόγιο 4 · ύφος κατάλληλο για το κειμενικό είδος 4.</li>
<li><b>Ορθογραφία — 4</b>: για κάθε 5 μη επαναλαμβανόμενα λάθη αφαιρείται 1 μονάδα· η απουσία τονισμού κοστίζει 1 μονάδα.</li></ul>
<p>Κείμενο <b>εκτός θέματος</b> παίρνει μηδέν σε όλα τα κριτήρια — γι’ αυτό διάβασε την εκφώνηση δύο φορές και υπογράμμισε τα ζητούμενα.</p></div>
<div class="tbox def"><h4>Τα ρήματα της εκφώνησης: τι ακριβώς ζητείται</h4>
<p>Οι ερωτήσεις κατατάσσονται σε επίπεδα δυσκολίας (ταξινομία Bloom). Το ρήμα της εκφώνησης δείχνει το επίπεδο και το είδος της απάντησης:</p>
<table class="tbl"><tr><th>Επίπεδο</th><th>Ρήματα</th><th>Τι κάνεις στην απάντηση</th></tr>
<tr><td>Γνώση</td><td>εντοπίζω, αναφέρω, καταγράφω, προσδιορίζω</td><td>Βρίσκεις και γράφεις σύντομα το στοιχείο, χωρίς ανάλυση.</td></tr>
<tr><td>Κατανόηση</td><td>εξηγώ, ερμηνεύω, αιτιολογώ, αποδίδω το νόημα</td><td>Λες με δικά σου λόγια τι σημαίνει κάτι και γιατί.</td></tr>
<tr><td>Εφαρμογή</td><td>αξιοποιώ, εισηγούμαι, παρουσιάζω</td><td>Χρησιμοποιείς όσα ξέρεις σε νέα περίσταση (π.χ. προτάσεις λύσεων).</td></tr>
<tr><td>Ανάλυση</td><td>αναλύω, συγκρίνω, διακρίνω, τεκμηριώνω</td><td>Χωρίζεις σε μέρη, δείχνεις σχέσεις και στηρίζεις κάθε θέση με αναφορές στο κείμενο.</td></tr>
<tr><td>Σύνθεση</td><td>συνθέτω, γράφω (κείμενο), οργανώνω</td><td>Παράγεις δικό σου οργανωμένο κείμενο.</td></tr>
<tr><td>Αξιολόγηση</td><td>σχολιάζω, κρίνω, αξιολογώ, τοποθετούμαι</td><td>Παίρνεις θέση και την αιτιολογείς.</td></tr></table>
<p>Η λέξη <b>«τεκμηριώστε»</b> σημαίνει πάντα: <b>παράθεσε συγκεκριμένο σημείο του κειμένου</b> (σε εισαγωγικά ή με αριθμό στίχων/παραγράφου). Στον οδηγό διόρθωσης η τεκμηρίωση έχει δικές της μονάδες: αν την ξεχάσεις, χάνεις μονάδες ακόμη κι αν η ερμηνεία σου είναι σωστή.</p></div>
<div class="tbox tip"><h4>Χρονοπρογραμματισμός στις 3 ώρες</h4>
<p>Μια λογική κατανομή είναι περίπου <b>60–65 λεπτά</b> για το Α.Ι (με την περίληψη να «τρώει» τα 20), <b>70 λεπτά</b> για την παραγωγή λόγου (σχεδιάγραμμα 10΄, γράψιμο 50΄, έλεγχος 10΄) και <b>40–45 λεπτά</b> για τη Λογοτεχνία. Στο εργαλείο πιο κάτω μπορείς να φτιάξεις τον δικό σου προγραμματισμό και να δεις πόσες μονάδες «κερδίζεις» ανά λεπτό σε κάθε μέρος.</p></div>
<div class="tbox ex"><h4>Πώς διαβάζω μια εκφώνηση</h4>
<p>Εκφώνηση εξάσκησης: «Να εντοπίσετε <u>δύο (2)</u> μέσα πειθούς στη 2η παράγραφο και να <u>τεκμηριώσετε</u> την απάντησή σας.»</p>
<details class="steps"><summary>Λύση βήμα-βήμα</summary><ol><li><b>Αριθμός</b>: ζητούνται ακριβώς δύο μέσα — γράψε όσα ζητούνται· επιπλέον απαντήσεις δεν κερδίζουν μονάδες και κοστίζουν χρόνο.</li><li><b>Περιοχή</b>: μόνο η 2η παράγραφος· παραδείγματα από άλλη παράγραφο δεν μετράνε.</li><li><b>Ρήματα</b>: «εντοπίζω» (ονομάζω το μέσο) + «τεκμηριώνω» (παραθέτω το σημείο του κειμένου).</li><li><b>Μορφή απάντησης</b>: «α. Παράδειγμα: “…” — β. Στατιστικό στοιχείο: “…”».</li></ol></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Υπέρβαση της έκτασης: στην περίληψη, πάνω από 170 λέξεις αφαιρείται 1 μονάδα και πάνω από 200 αφαιρούνται 4.</li><li>Απαντήσεις χωρίς τεκμηρίωση ή με τεκμηρίωση από λάθος παράγραφο/στίχους.</li><li>Στον πίνακα παραγώγων: αν δεν γράψεις ποιο είναι το ουσιαστικό και ποιο το επίθετο, χάνεις όλες τις μονάδες.</li><li>Τίτλος ή ονοματεπώνυμο στο άρθρο, όταν η εκφώνηση το απαγορεύει.</li><li>Πολύς χρόνος στο Α.Ι και βιαστικό, ελλιπές κείμενο στο Α.ΙΙ, που έχει τις περισσότερες μονάδες.</li></ul></div>
`,
  widget: "na1plan",
  gen: "na1gExam",
  exercises: [
    { level: 1, q: R`Πόσες μονάδες συνολικά παίρνει το Μέρος Α΄ (Νέα Ελληνική Γλώσσα) του εξεταστικού δοκιμίου;`, fields: [{ label: "Μονάδες:", ans: 70 }],
      hint: R`Το δοκίμιο έχει 100 μονάδες και η Λογοτεχνία παίρνει τις 30.`, sol: R`Μέρος Α΄: <b>70</b> μονάδες (30 Κατανόηση + 40 Παραγωγή λόγου) · Μέρος Β΄: 30 μονάδες.` },
    { level: 1, q: R`Πόσες μονάδες παίρνει η παραγωγή γραπτού επικοινωνιακού λόγου (Α.ΙΙ) και ποια είναι η ζητούμενη έκταση (κατώτατο όριο λέξεων);`, fields: [{ label: "Μονάδες:", ans: 40 }, { label: "Από (λέξεις):", ans: 450 }],
      hint: R`Είναι η ερώτηση με τις περισσότερες μονάδες του δοκιμίου.`, sol: R`Η παραγωγή λόγου παίρνει <b>40</b> μονάδες και ζητείται έκταση <b>450</b>–500 λέξεων.` },
    { level: 1, type: "mc", q: R`Η απουσία τονισμού στο κείμενο της παραγωγής λόγου δεν επηρεάζει τη βαθμολογία, αφού κρίνεται μόνο το περιεχόμενο.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Υπάρχει ξεχωριστό κριτήριο ορθογραφίας.`, sol: R`<b>ΛΑΘΟΣ.</b> Η ορθογραφία έχει 4 μονάδες και η απουσία τονισμού κοστίζει 1 μονάδα. Επιπλέον, για κάθε 5 μη επαναλαμβανόμενα λάθη αφαιρείται 1 μονάδα.` },
    { level: 2, type: "mc", q: R`Σε ποιο επίπεδο της ταξινομίας Bloom ανήκει μια ερώτηση που ξεκινά με «Να σχολιάσετε την πιο πάνω θέση…»;`, options: ["Αξιολόγηση", "Γνώση", "Κατανόηση", "Εφαρμογή"], correct: 0,
      hint: R`Ο μαθητής καλείται να πάρει θέση και να την αιτιολογήσει.`, sol: R`Το «σχολιάζω» ανήκει στην <b>αξιολόγηση</b>: παίρνουμε θέση (συμφωνία, διαφωνία ή μερική συμφωνία) και την αιτιολογούμε.` },
    { level: 2, type: "mc", q: R`Μια ερώτηση ζητά: «Να εντοπίσετε δύο μέσα πειθούς και να τεκμηριώσετε την απάντησή σας». Τι σημαίνει εδώ «τεκμηριώνω»;`, options: ["Παραθέτω το συγκεκριμένο σημείο του κειμένου όπου εμφανίζεται το μέσο", "Γράφω τη δική μου άποψη για το θέμα", "Εξηγώ τι είναι το μέσο πειθούς με γενικό ορισμό", "Αναφέρω ένα δικό μου παράδειγμα από την καθημερινότητα"], correct: 0,
      hint: R`Η τεκμηρίωση στηρίζει την απάντηση πάνω στο ίδιο το κείμενο.`, sol: R`Τεκμηρίωση = <b>παράθεση σημείου του κειμένου</b> (σε εισαγωγικά, με αριθμό παραγράφου ή στίχων). Έχει δικές της μονάδες στον οδηγό διόρθωσης.` },
    { level: 2, q: R`Στο κριτήριο «Περιεχόμενο» της παραγωγής λόγου (12 μονάδες), πόσες μονάδες αντιστοιχούν στο κύριο μέρος;`, fields: [{ label: "Μονάδες:", ans: 9 }],
      hint: R`Πρόλογος και επίλογος παίρνουν από 1,5 μονάδα.`, sol: R`12 − 1,5 − 1,5 = <b>9</b> μονάδες για το κύριο μέρος. Σε εκφώνηση με δύο ζητούμενα των τριών σημείων, κάθε σημείο με ανάπτυξη παίρνει 1,5 μονάδα (6 × 1,5 = 9).` },
    { level: 2, q: R`Υποψήφιος γράφει περίληψη 185 λέξεων, ενώ ζητούνται 120–140 λέξεις. Πόσες μονάδες αφαιρούνται, σύμφωνα με τον οδηγό διόρθωσης του 2026, για την υπέρβαση;`, fields: [{ label: "Αφαιρούνται:", ans: 1 }],
      hint: R`Ο οδηγός ορίζει δύο κατώφλια: πάνω από 170 και πάνω από 200 λέξεις.`, sol: R`185 λέξεις > 170 αλλά ≤ 200, άρα αφαιρείται <b>1</b> μονάδα (πάνω από 200 λέξεις θα αφαιρούνταν 4).` },
    { level: 3, type: "mc", q: R`Ποια από τις παρακάτω κατανομές χρόνου για τις 3 ώρες της εξέτασης είναι η πιο λογική, με βάση τις μονάδες κάθε μέρους;`, options: ["Περίπου 60΄ Κατανόηση, 70΄ Παραγωγή λόγου, 45΄ Λογοτεχνία, 5΄ τελικός έλεγχος", "Περίπου 100΄ Κατανόηση, 40΄ Παραγωγή λόγου, 40΄ Λογοτεχνία", "Περίπου 30΄ Κατανόηση, 120΄ Παραγωγή λόγου, 30΄ Λογοτεχνία", "Περίπου 60΄ Κατανόηση, 30΄ Παραγωγή λόγου, 90΄ Λογοτεχνία"], correct: 0,
      hint: R`Σύγκρινε τις μονάδες: 30 – 40 – 30.`, sol: R`Η Παραγωγή λόγου (40 μον.) χρειάζεται τον περισσότερο χρόνο (σχεδιάγραμμα, γράψιμο, έλεγχος), ενώ Κατανόηση και Λογοτεχνία (30 μον. η καθεμιά) μοιράζονται τον υπόλοιπο. Η κατανομή <b>60΄ – 70΄ – 45΄ – 5΄</b> είναι ισορροπημένη.` },
    { level: 3, type: "mc", q: R`Στην ερώτηση παραγώγων (πίνακας ρήμα – ουσιαστικό – επίθετο) ο υποψήφιος γράφει σωστές λέξεις, αλλά δεν δηλώνει ποιο είναι το ουσιαστικό και ποιο το επίθετο. Τι προβλέπει ο οδηγός διόρθωσης του 2026;`, options: ["Αφαιρούνται όλες οι μονάδες της ερώτησης", "Αφαιρείται μισή μονάδα", "Δεν αφαιρείται τίποτα, αφού οι λέξεις είναι σωστές", "Βαθμολογούνται μόνο τα ουσιαστικά"], correct: 0,
      hint: R`Η ερώτηση ζητά συγκεκριμένο μέρος του λόγου.`, sol: R`Ο οδηγός σημειώνει ρητά ότι, αν δεν προσδιοριστεί το μέρος του λόγου, <b>αφαιρούνται όλες οι μονάδες</b>. Γι’ αυτό μεταφέρουμε τον πίνακα στο τετράδιο όπως ζητείται.` },
    { level: 3, q: R`Υποψήφιος συγκέντρωσε 52 μονάδες στο Μέρος Α΄ και 21 στο Μέρος Β΄. Ποιος είναι ο βαθμός του στην κλίμακα του 20 (μονάδες ÷ 5);`, fields: [{ label: "Βαθμός /20:", ans: 14.6, tol: 0.001 }],
      hint: R`Πρώτα το σύνολο στις 100, μετά διαίρεση με το 5.`, sol: R`52 + 21 = 73 μονάδες → 73 ÷ 5 = <b>14,6</b>.` }
  ]
},
/* ───────────────────────────── 1.2 ───────────────────────────── */
{
  id: "1.2", unit: 1, title: "Παγκύπριες 2026 Νέα Ελληνικά: ανάλυση των θεμάτων και ενδεικτικές απαντήσεις",
  book: "Παγκύπριες Εξετάσεις 2026, Νέα Ελληνικά (8 Ιουνίου 2026): εξεταστικό δοκίμιο και οδηγός διόρθωσης ΥΠΑΝ (ελεύθερη απόδοση)",
  intro: "Τι ζητήθηκε στα θέματα των Νέων Ελληνικών στις Παγκύπριες 2026 και πώς έπρεπε να απαντηθεί κάθε ερώτηση για να πάρει όλες τις μονάδες;",
  thumb: LETTER("2026"),
  theory: R`
<p>Στις <b>Παγκύπριες Εξετάσεις 2026</b> το μάθημα των <b>Νέων Ελληνικών</b> εξετάστηκε τη Δευτέρα 8 Ιουνίου (08:00–11:00). Παρακάτω παρουσιάζουμε, <b>με δικά μας λόγια</b>, τι ζήτησε κάθε ερώτηση και πώς έπρεπε να απαντηθεί σύμφωνα με τον επίσημο οδηγό διόρθωσης. Για να μελετήσεις τα ίδια τα κείμενα, άνοιξε το επίσημο εξεταστικό δοκίμιο της Υπηρεσίας Εξετάσεων και τα σχολικά ανθολόγια — εδώ δεν αναδημοσιεύουμε τα κείμενα, αλλά εξηγούμε τη μεθοδολογία, που είναι αυτή που μετρά για τη δική σου εξέταση.</p>
<div class="tbox def"><h4>Μέρος Α΄ · Το κείμενο της κατανόησης</h4>
<p>Δόθηκε ένα <b>άρθρο γνώμης</b> ακαδημαϊκού για τις <b>ηθικές επικρίσεις κατά της διαφήμισης</b> (θεματική ενότητα «Οικονομία – Διαφήμιση – Καταναλωτισμός»). Στην 1η παράγραφο ο συγγραφέας παρουσιάζει τις κατηγορίες εναντίον της διαφήμισης (πλασματικές ανάγκες, υπερκατανάλωση, εξιδανικευμένα πρότυπα, παραπλάνηση, αύξηση τιμών, επιβλαβείς διαφημίσεις). Στις επόμενες παραγράφους τις αντικρούει: ο σημερινός καταναλωτής είναι πιο ενημερωμένος, ο τρόπος ζωής δεν διαμορφώνεται μόνο από τη διαφήμιση και εμφανίζεται ο «ηθικός καταναλωτής», ενώ οι επιχειρήσεις που διαφημίζονται δείχνουν ότι επενδύουν μακροπρόθεσμα. Στην τελευταία παράγραφο επισημαίνει ότι η προσωποποιημένη διαδικτυακή διαφήμιση με τεχνητή νοημοσύνη γεννά νέα ηθικά διλήμματα για τα προσωπικά δεδομένα.</p></div>
<div class="tbox ex"><h4>Α.Ι.1 · Περίληψη 120–140 λέξεων (8 μονάδες)</h4>
<p><b>Τι ζητήθηκε:</b> περιληπτική απόδοση όλου του κειμένου.</p>
<details class="steps"><summary>Πώς βαθμολογήθηκε</summary><p>6 μονάδες για το <b>περιεχόμενο</b>, κατανεμημένες ανά παράγραφο (η 1η παράγραφος, που είναι η πιο πλούσια, 2 μονάδες, κάθε άλλη από 1), και 2 μονάδες για <b>δομή – έκφραση – ορθογραφία</b> (εισαγωγική φράση, διαρθρωτικές λέξεις, αλληλουχία, λεξιλόγιο). Αν φράσεις του κειμένου απλώς αντιγράφονται και παρατίθενται ασύνδετα, η δομή παίρνει μηδέν· για απλή αντιγραφή χωρίς διαρθρωτικές λέξεις αφαιρείται το μισό των συνολικών μονάδων. Αφαιρείται επίσης 0,5 μονάδα για 5 ή περισσότερα μη επαναλαμβανόμενα ορθογραφικά λάθη. Μάθε τη μέθοδο στην ενότητα 2.1.</p></details></div>
<div class="tbox ex"><h4>Α.Ι.2 · Μέσα πειθούς για την επίκληση στη λογική (3 μονάδες)</h4>
<p><b>Τι ζητήθηκε:</b> δύο διαφορετικά μέσα με τα οποία ο συγγραφέας επικαλείται τη λογική στην 1η παράγραφο, με τεκμηρίωση.</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p>Αποδεκτά μέσα ήταν: <b>επιχειρήματα</b> (οι διαδοχικές προτάσεις κρίσεως με τις οποίες παρουσιάζονται οι απόψεις διαφορετικών επικριτών), ο <b>συλλογισμός</b> που συνδέει όλες τις επικρίσεις, <b>τεκμήρια – παραδείγματα</b> (η διαφήμιση που προβάλλει την απόλαυση και κρύβει τις θερμίδες, οι διαφημίσεις που απευθύνονται σε παιδιά ή προβάλλουν στερεότυπα) και <b>γενικά αποδεκτές αλήθειες</b> (ότι υπάρχουν παραπλανητικές διαφημίσεις). Κάθε μέσο έδινε 1 μονάδα και κάθε τεκμηρίωση 0,5. Δες την ενότητα 2.2.</p></details></div>
<div class="tbox ex"><h4>Α.Ι.3 · Εντοπισμός στοιχείων στην 5η παράγραφο (3 μονάδες)</h4>
<p><b>Τι ζητήθηκε:</b> δύο μέσα-εργαλεία που χρησιμοποιούν οι επιχειρήσεις για να διαφημιστούν και ένας κίνδυνος από τη χρήση τους.</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p>Μέσα-εργαλεία: η <b>προσωποποιημένη διαφήμιση</b>, το <b>διαδίκτυο</b>, τα <b>μέσα κοινωνικής δικτύωσης</b>, η <b>τεχνητή νοημοσύνη</b> (2 × 1 μονάδα). Κίνδυνος: τα <b>ηθικά διλήμματα</b> για τη διάθεση και τον έλεγχο των <b>προσωπικών δεδομένων</b> (1 μονάδα). Ερωτήσεις «εντοπισμού» θέλουν σύντομες, ακριβείς απαντήσεις από τη συγκεκριμένη παράγραφο.</p></details></div>
<div class="tbox ex"><h4>Α.Ι.4 · Ο σκοπός του μακροπερίοδου λόγου (3 μονάδες)</h4>
<p><b>Τι ζητήθηκε:</b> δύο σκοποί που εξυπηρετεί μια πολύ μεγάλη περίοδος της 3ης παραγράφου, με βάση το νόημά της.</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p>Ο μακροπερίοδος λόγος: (α) επιτρέπει στον συγγραφέα να <b>αναλύσει διεξοδικά</b> μια σύνθετη έννοια — εδώ τι σημαίνει «ηθικός καταναλωτής» — παραθέτοντας πολλά γνωρίσματα· (β) κάνει την επιχειρηματολογία <b>πιο πειστική</b>, γιατί συσσωρεύει θετικά παραδείγματα· (γ) κρατά σε <b>εγρήγορση τον αναγνώστη</b> μέχρι το συμπέρασμα της παραγράφου· (δ) προσδίδει <b>επίσημο, σοβαρό ύφος</b>. Δύο σκοποί × 1,5 μονάδα. Προσοχή: ο σκοπός συνδέεται πάντα με το νόημα της συγκεκριμένης παραγράφου — βλ. ενότητα 4 (εκφραστικά μέσα).</p></details></div>
<div class="tbox ex"><h4>Α.Ι.5 · Σχολιασμός θέσης σε 60–80 λέξεις (5 μονάδες)</h4>
<p><b>Τι ζητήθηκε:</b> σχόλιο στη θέση ότι το επιχείρημα «η διαφήμιση μας επιβάλλει καταναλωτικά πρότυπα» είναι αδύναμο, γιατί ο τρόπος ζωής μας δεν διαμορφώνεται μόνο από αυτή· και δύο άλλοι παράγοντες που επηρεάζουν τα καταναλωτικά πρότυπα.</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p><b>Σχολιασμός (2 μονάδες):</b> συμφωνούμε ότι η διαφήμιση δεν είναι ο μοναδικός παράγοντας· ο σύγχρονος άνθρωπος δέχεται και άλλες επιδράσεις που τον ωθούν στην κατανάλωση. <b>Παράγοντες (2 × 1,5):</b> η οικογένεια, το σχολείο, η παρέα και η ανάγκη κοινωνικής αποδοχής, τα ΜΜΕ και τα μέσα κοινωνικής δικτύωσης, η μόδα, το υλιστικό πνεύμα της εποχής, η τεχνολογική εξέλιξη, η παγκοσμιοποίηση. Κάθε παράγοντας χρειάζεται μία σύντομη εξήγηση — όχι απλή αναφορά. Βλ. ενότητα 2.5.</p></details></div>
<div class="tbox ex"><h4>Α.Ι.6 και Α.Ι.7 · Λεξιλόγιο (4 + 4 μονάδες)</h4>
<p><b>Α.Ι.6:</b> αντώνυμα για δύο υπογραμμισμένες λέξεις, ώστε να δίνεται η αντίθετη σημασία μέσα στην πρόταση — για το «επιβλαβείς» έγιναν δεκτά π.χ. <i>αβλαβείς, ωφέλιμες, ακίνδυνες, ευεργετικές</i> και για το «εξοικονόμηση» π.χ. <i>σπατάλη, απώλεια, δαπάνη</i>. Το αντώνυμο πρέπει να έχει τον ίδιο γραμματικό τύπο (γένος, αριθμό, πτώση) με τη λέξη που αντικαθιστά.</p>
<p><b>Α.Ι.7:</b> ένα παράγωγο ουσιαστικό και ένα παράγωγο επίθετο για δύο ρήματα — π.χ. <i>επιβαρύνω → επιβάρυνση, επιβαρυντικός</i> · <i>διακρίνω → διάκριση, διακριτικός / διακριτός</i>. Βλ. ενότητα 4 (λεξιλόγιο).</p></div>
<div class="tbox def"><h4>Μέρος Α΄ · Α.ΙΙ Παραγωγή λόγου: άρθρο (40 μονάδες)</h4>
<p><b>Τι ζητήθηκε:</b> <b>άρθρο</b> για τον ημερήσιο Τύπο, 450–500 λέξεων, χωρίς τίτλο, με δύο ζητούμενα: (α) <b>τρία αρνητικά χαρακτηριστικά</b> του σύγχρονου καταναλωτή που οφείλονται στη διαφήμιση και (β) <b>τρεις τρόπους</b> με τους οποίους το <b>εκπαιδευτικό σύστημα</b> μπορεί να διαμορφώσει ηθικούς, συνειδητοποιημένους καταναλωτές.</p>
<details class="steps"><summary>Ενδεικτικές ιδέες από τον οδηγό διόρθωσης (σε ελεύθερη απόδοση)</summary>
<p><b>(α) Αρνητικά χαρακτηριστικά:</b> πνευματικά ανελεύθερος, με αδρανοποιημένη κριτική σκέψη · ψυχικά εξαρτημένος, ταυτίζει την ευτυχία με το «έχειν» · αλλοτριωμένος από τον εαυτό του και τους άλλους · ευάλωτος στη χειραγώγηση · υλιστής και μονοδιάστατος · ατομικιστής · ανασφαλής, με αίσθημα κατωτερότητας · αγχώδης, διαρκώς ανικανοποίητος · σπάταλος, με κίνδυνο δανεισμού · εργασιομανής.</p>
<p><b>(β) Τρόποι του σχολείου:</b> ανθρωπιστική παιδεία και καλλιέργεια αξιών (μέτρο, αυτάρκεια) · σύγχρονα αναλυτικά προγράμματα · οι εκπαιδευτικοί ως πρότυπα · μαθήματα που αποκωδικοποιούν τα διαφημιστικά μηνύματα · βιωματικές δράσεις κοινωνικής και περιβαλλοντικής ευθύνης · ψηφιακός και κριτικός γραμματισμός · καλλιέργεια κριτικής σκέψης και οικολογικής συνείδησης.</p>
<p><b>Βαθμολόγηση:</b> 3 σημεία με ανάπτυξη × 1,5 = 4,5 μονάδες για κάθε ζητούμενο, συν πρόλογος και επίλογος από 1,5 — και τα κριτήρια δομής, έκφρασης, ορθογραφίας (ενότητα 1.1). Μάθε τη δομή του άρθρου στην ενότητα 5.</p></details></div>
<div class="tbox def"><h4>Μέρος Β΄ · Λογοτεχνία (30 μονάδες)</h4>
<p><b>Β1 — Κώστας Μόντης, «Τρίτο γράμμα στη μητέρα», ζ΄ (διδαγμένο, 12 μονάδες).</b> (α) Δύο <b>τραγικές συνέπειες της εισβολής του 1974</b>, όπως φαίνονται στο πρώτο μέρος του αποσπάσματος (στ. 1–20), με τεκμηρίωση από συγκεκριμένους στίχους. Ο οδηγός δέχτηκε, μεταξύ άλλων, τον ξεριζωμό και την προσφυγιά, την ερήμωση και την υλική καταστροφή — ο χώρος που περιγράφει ο ποιητής λειτουργεί ως σύμβολο της τραυματισμένης πατρίδας —, τον ψυχικό πόνο και την απόγνωση, και τον χαμό πολύ νέων στρατιωτών. (β) Δύο σημεία των στίχων 21–30 όπου φαίνεται η <b>ειρωνεία</b> του ποιητικού υποκειμένου απέναντι στους ξένους παράγοντες που επισκέπτονται την Κύπρο και υπόσχονται βοήθεια χωρίς αποτέλεσμα — και δύο <b>εκφραστικά μέσα</b> της ειρωνείας (π.χ. μεταφορά, εισαγωγικά, επανάληψη/επαναφορά/επιφορά, πολυσύνδετο σχήμα, εικόνες), με παραπομπή σε στίχους.</p>
<p><b>Β2 — Γιάννης Ρίτσος, «Αποχαιρετισμός» (διδαγμένο) και Κλαίρη Αγγελίδου, «Γρηγόρης Αυξεντίου» (αδίδακτο), 10 μονάδες.</b> (α) Δύο σημεία από κάθε ποίημα όπου προβάλλεται η <b>συνείδηση του χρέους</b> του ήρωα προς την πατρίδα — για παράδειγμα η ετοιμότητα για αυτοθυσία, η αντίληψη ότι η ελευθερία οφείλεται σε όλους και όχι σε έναν, η πεποίθηση ότι η θυσία του θα συνεχίσει να εμπνέει τον αγώνα, η εσωτερική γαλήνη όταν εκπληρώνει το καθήκον του —, πάντα με παραπομπή σε στίχους. (β) Πώς ο χώρος του θανάτου του ήρωα, η <b>σπηλιά</b>, αλλάζει χαρακτήρα σε κάθε ποίημα: από σκοτεινός και κλειστός χώρος συνδέεται με το φως (Ρίτσος) ή με την άνοιξη και τη φύση (Αγγελίδου), δηλαδή με την ελευθερία, τη δικαίωση και τη ζωή — και το <b>κοινό σχήμα λόγου: η μεταφορά</b>. Τα ίδια τα ποιήματα θα τα βρεις στο εξεταστικό δοκίμιο και στα σχολικά ανθολόγια.</p>
<p><b>Β3 — Ι. Μ. Παναγιωτόπουλος, «Αστροφεγγιά» (λογοτεχνικό βιβλίο), 8 μονάδες.</b> Ζητήθηκε η στάση της Δάφνης απέναντι στον Άγγελο σε μια σκηνή όπου η παρέα ανακαλύπτει ένα ποίημά του, δύο γνωρίσματα του χαρακτήρα της και η επίδραση της στάσης της στον Άγγελο, με δύο αναφορές στο απόσπασμα. Η Δάφνη εμφανίζεται κοροϊδευτική, ειρωνική και σκληρή, ενώ ο Άγγελος περνά από την αμηχανία και την ντροπή στον θυμό και τελικά απομακρύνεται βαθιά πληγωμένος. Η ανάλυση των εξεταστέων κειμένων υπάρχει στο υλικό Λογοτεχνίας.</p>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Στο Β1 και Β2: ερμηνεία χωρίς αναφορά στους συγκεκριμένους στίχους που ορίζει η ερώτηση.</li><li>Στο εκφραστικό μέσο: απλή ονομασία («επανάληψη») χωρίς στίχο και χωρίς λειτουργία.</li><li>Στο άρθρο: παράλειψη ενός από τα δύο ζητούμενα ή ανάπτυξη λιγότερων σημείων από τα τρία που ζητούνται.</li><li>Στη σύγκριση διδαγμένου–αδίδακτου: παρουσίαση των δύο κειμένων χωριστά, χωρίς να φαίνεται η σύγκριση.</li></ul></div>
`,
  widget: "na1score",
  exercises: [
    { level: 1, type: "mc", q: R`Σε ποια θεματική ενότητα της ύλης ανήκε το κείμενο της κατανόησης των Παγκυπρίων 2026;`, options: ["Οικονομία – Διαφήμιση – Καταναλωτισμός", "Παιδεία – Εκπαίδευση", "Κύπρος – Ελλάδα – Ευρώπη – Κόσμος", "Επιστήμη – Τεχνολογία"], correct: 0,
      hint: R`Το κείμενο αφορούσε τις επικρίσεις για τη διαφήμιση.`, sol: R`Το άρθρο για τις ηθικές επικρίσεις κατά της <b>διαφήμισης</b> ανήκει στην ενότητα «Οικονομία – Διαφήμιση – Καταναλωτισμός».` },
    { level: 1, type: "mc", q: R`Σε ποιο κειμενικό είδος ζητήθηκε να γραφτεί η παραγωγή λόγου των Παγκυπρίων 2026;`, options: ["Άρθρο για τον ημερήσιο Τύπο", "Επιστολή σε εφημερίδα", "Ομιλία σε εκδήλωση του σχολείου", "Δοκίμιο"], correct: 0,
      hint: R`Η εκφώνηση ανέφερε «θα δημοσιευθεί στον ημερήσιο Τύπο».`, sol: R`Ζητήθηκε <b>άρθρο</b> για τον ημερήσιο Τύπο, 450–500 λέξεων, χωρίς τίτλο.` },
    { level: 1, q: R`Γράψε ένα αντώνυμο της λέξης «επιβλαβείς» στη φράση «Για τις επιβλαβείς διαφημίσεις υπάρχει ρυθμιστικό πλαίσιο», ώστε να δίνεται η αντίθετη σημασία.`, fields: [{ label: "Αντώνυμο:", ans: ["αβλαβείς", "ωφέλιμες", "χρήσιμες", "επωφελείς", "θετικές", "ακίνδυνες", "ευεργετικές", "αβλαβεις", "ευεργετικές"], text: true, nopunct: true }],
      hint: R`Το αντώνυμο πρέπει να είναι θηλυκό πληθυντικού, όπως η λέξη «διαφημίσεις».`, sol: R`Αποδεκτά: <b>αβλαβείς, ωφέλιμες, ακίνδυνες, ευεργετικές, επωφελείς, χρήσιμες, θετικές</b>. Πρόσεξε να κρατήσεις τον ίδιο γραμματικό τύπο (θηλυκό, πληθυντικός).` },
    { level: 2, q: R`Γράψε ένα παράγωγο ουσιαστικό του ρήματος «επιβαρύνω».`, fields: [{ label: "Ουσιαστικό:", ans: ["επιβάρυνση", "η επιβάρυνση", "επιβαρυνση"], text: true, nopunct: true }],
      hint: R`Με την κατάληξη -ση.`, sol: R`<b>επιβάρυνση</b> (ουσιαστικό). Παράγωγο επίθετο: <i>επιβαρυντικός, -ή, -ό</i>.` },
    { level: 2, q: R`Γράψε ένα παράγωγο επίθετο του ρήματος «διακρίνω».`, fields: [{ label: "Επίθετο:", ans: ["διακριτικός", "διακριτός", "διακρίσιμος", "διακριτέος", "διακριτική", "διακριτικό", "διακριτή", "διακριτό"], text: true, nopunct: true }],
      hint: R`Σκέψου λέξεις με τη ρίζα «διακρι-» και κατάληξη επιθέτου (-ικός, -τός…).`, sol: R`Αποδεκτά: <b>διακριτικός</b>, <b>διακριτός</b>, διακρίσιμος, διακριτέος. Παράγωγο ουσιαστικό: <i>διάκριση, διακριτικότητα</i>.` },
    { level: 2, type: "mc", q: R`Στην ερώτηση Β2(β) ζητήθηκε το κοινό σχήμα λόγου με το οποίο αποδίδεται η μεταμόρφωση της σπηλιάς στα δύο ποιήματα. Ποιο ήταν;`, options: ["Η μεταφορά", "Η παρομοίωση", "Η αντίθεση", "Το ασύνδετο σχήμα"], correct: 0,
      hint: R`Σκέψου πώς ξεχωρίζουμε τη μεταφορά από την παρομοίωση: υπάρχει ή όχι λέξη σύγκρισης;`, sol: R`<b>Μεταφορά</b>: η σπηλιά ταυτίζεται άμεσα με κάτι φωτεινό ή ζωντανό, χωρίς συγκριτικό σύνδεσμο· αν υπήρχε «σαν/όπως», θα ήταν παρομοίωση.` },
    { level: 2, type: "mc", q: R`Ποιο από τα παρακάτω ΔΕΝ ήταν αποδεκτό εκφραστικό μέσο της ειρωνείας στο Β1(β) (Μόντης);`, options: ["Η αποστροφή προς τον αναγνώστη σε β΄ πληθυντικό", "Τα εισαγωγικά στις υποσχέσεις φροντίδας των επισκεπτών", "Η επιφορά της ίδιας φράσης στο τέλος διαδοχικών στίχων", "Το πολυσύνδετο σχήμα στην απαρίθμηση των επισκεπτών"], correct: 0,
      hint: R`Σε ποιον απευθύνεται το ποιητικό υποκείμενο σε όλο το ποίημα;`, sol: R`Το ποιητικό υποκείμενο απευθύνεται στη <b>μητέρα</b>, όχι στον αναγνώστη. Η ειρωνεία δημιουργείται με τα εισαγωγικά, την επανάληψη/επιφορά, το πολυσύνδετο και τη μεταφορά.` },
    { level: 3, type: "mc", q: R`Στην Α.Ι.4 ζητήθηκαν δύο σκοποί του μακροπερίοδου λόγου «με βάση το νόημα της παραγράφου». Ποια απάντηση θα έπαιρνε τις λιγότερες μονάδες;`, options: ["«Ο μακροπερίοδος λόγος χρησιμοποιείται σε επίσημα κείμενα.» — χωρίς καμία σύνδεση με το περιεχόμενο", "«Αναλύει διεξοδικά την έννοια του ηθικού καταναλωτή, παραθέτοντας πολλά γνωρίσματά του.»", "«Η συσσώρευση θετικών παραδειγμάτων κάνει πιο πειστική τη θέση ότι ο ηθικός καταναλωτής ωφελεί την κοινωνία.»", "«Κρατά την προσοχή του αναγνώστη μέχρι το συμπέρασμα της παραγράφου.»"], correct: 0,
      hint: R`Η εκφώνηση απαιτεί σύνδεση με το νόημα.`, sol: R`Η γενική διαπίστωση χωρίς σύνδεση με το περιεχόμενο της παραγράφου είναι <b>ελλιπής</b>. Οι άλλες τρεις απαντήσεις συνδέουν τον σκοπό με τον «ηθικό καταναλωτή» και ήταν αποδεκτές.` },
    { level: 3, type: "mc", q: R`Στο Β3 (Αστροφεγγιά) ζητήθηκαν η συμπεριφορά της Δάφνης, δύο γνωρίσματα του χαρακτήρα της και η επίδρασή της στον Άγγελο. Ποιο ζεύγος γνωρισμάτων είναι σύμφωνο με τον οδηγό διόρθωσης;`, options: ["ειρωνική και σκληρή", "τρυφερή και συμπονετική", "ντροπαλή και φοβισμένη", "αδιάφορη και απαθής"], correct: 0,
      hint: R`Χαρακτηρίζουμε έναν ήρωα από τα λόγια και τις πράξεις του απέναντι στους άλλους.`, sol: R`Σύμφωνα με τον οδηγό, η Δάφνη εμφανίζεται <b>ειρωνική, χλευαστική, σκληρή, προκλητική, επίμονη</b>· ο Άγγελος νιώθει αμηχανία και ντροπή, θυμώνει και απομακρύνεται πληγωμένος.` },
    { level: 3, q: R`Πόσες μονάδες συνολικά έδιναν οι τρεις ερωτήσεις λεξιλογίου και εντοπισμού Α.Ι.3, Α.Ι.6 και Α.Ι.7 στο δοκίμιο του 2026;`, fields: [{ label: "Μονάδες:", ans: 11 }],
      hint: R`Ανάτρεξε στον πίνακα μονάδων της ενότητας 1.1 και πρόσθεσε.`, sol: R`3 + 4 + 4 = <b>11</b> μονάδες — σχεδόν όσο η περίληψη και ο σχολιασμός μαζί (8 + 5). Οι σύντομες ερωτήσεις αξίζουν προσοχή!` }
  ]
},
/* ───────────────────────────── 2.1 ───────────────────────────── */
{
  id: "2.1", unit: 2, title: "Περίληψη κειμένου: πώς γράφεται βήμα-βήμα (120–140 λέξεις) — Παγκύπριες",
  book: "Πίνακας προδιαγραφών 2026 · Κειμενικά είδη 8: (Σημειώσεις) Περίληψη γραπτού κειμένου · Οδηγός διόρθωσης 2026, Α.Ι.1",
  intro: "Πώς γράφουμε περίληψη κειμένου στις Παγκύπριες ώστε να πάρουμε και τις 8 μονάδες — από τις σημειώσεις ανά παράγραφο μέχρι το τελικό κείμενο των 120–140 λέξεων;",
  thumb: LETTER("Περίληψη"),
  theory: R`
<p>Η <b>περίληψη κειμένου</b> είναι η πρώτη ερώτηση του Μέρους Α΄ και αξίζει <b>8 μονάδες</b> — όσο καμία άλλη ερώτηση κατανόησης. Περίληψη σημαίνει να αποδώσεις <b>με δικά σου λόγια</b>, σύντομα και με λογική σειρά, τις <b>βασικές ιδέες</b> ενός κειμένου, ώστε όποιος τη διαβάσει να καταλάβει τι υποστηρίζει ο συγγραφέας χωρίς να έχει διαβάσει το αρχικό. Στις εξετάσεις η έκταση είναι συνήθως <b>120–140 λέξεις</b>. Ο οδηγός διόρθωσης δίνει <b>6 μονάδες στο περιεχόμενο</b> (μοιρασμένες ανά παράγραφο) και <b>2 μονάδες στη δομή, την έκφραση και την ορθογραφία</b>.</p>
<div class="tbox def"><h4>Τι είναι — και τι δεν είναι — η περίληψη</h4>
<ul><li>Είναι <b>πύκνωση</b> του κειμένου: κρατάμε τη θέση του συγγραφέα και τα βασικά επιχειρήματα, παραλείπουμε παραδείγματα, στατιστικά, λεπτομέρειες, επαναλήψεις.</li>
<li>Γράφεται σε <b>γ΄ πρόσωπο</b>, σε <b>ενεστώτα</b>, με <b>ουδέτερο, αντικειμενικό ύφος</b> — <b>χωρίς δικά μας σχόλια</b> ή κρίσεις.</li>
<li>Δεν είναι αντιγραφή: οι φράσεις του κειμένου <b>αναδιατυπώνονται</b> (ο οδηγός αφαιρεί το μισό των μονάδων για απλή αντιγραφή χωρίς διαρθρωτικές λέξεις).</li>
<li>Είναι <b>ένα ενιαίο κείμενο</b> (μία παράγραφος), με αρχή, συνοχή και κατάληξη — όχι λίστα από κουκκίδες.</li></ul></div>
<div class="tbox thm"><h4>Η μέθοδος σε πέντε βήματα</h4>
<ol><li><b>Πρώτη ανάγνωση</b>: βρες το θέμα και τη βασική θέση του συγγραφέα. Ρώτα: «Τι υποστηρίζει;»</li>
<li><b>Σημειώσεις ανά παράγραφο</b>: για κάθε παράγραφο γράψε στο περιθώριο έναν πλαγιότιτλο (2–6 λέξεις) με την κύρια ιδέα της. Συνήθως τη βρίσκεις στη <b>θεματική περίοδο</b> ή στην <b>κατακλείδα</b>.</li>
<li><b>Ιεράρχηση</b>: κράτησε τις κύριες ιδέες, διέγραψε παραδείγματα και λεπτομέρειες. Η πιο «πλούσια» παράγραφος θα πάρει περισσότερες λέξεις.</li>
<li><b>Σύνδεση</b>: γράψε το κείμενο με <b>εισαγωγική φράση</b> («Το άρθρο πραγματεύεται…», «Ο συγγραφέας αναφέρεται…») και <b>διαρθρωτικές λέξεις</b> που δείχνουν τη λογική πορεία: <i>αρχικά, στη συνέχεια, επιπλέον, ωστόσο, γι’ αυτό, καταληκτικά</i>.</li>
<li><b>Έλεγχος</b>: μέτρησε τις λέξεις, έλεγξε ορθογραφία και αν «καλύφθηκαν» όλες οι παράγραφοι.</li></ol>
<p>Χρήσιμα ρήματα για να αποδίδεις τη στάση του συγγραφέα: <i>υποστηρίζει, επισημαίνει, διαπιστώνει, τονίζει, προειδοποιεί, διερωτάται, προτείνει, καταλήγει</i>. Τα ερωτήματα του κειμένου (ρητορικά ή ερωτήματα που εισάγουν το θέμα μιας παραγράφου) <b>πλαγιοποιούνται</b> ή γίνονται κρίσεις: «Ποια τα οφέλη;» → «ο συγγραφέας εξετάζει ποια είναι τα οφέλη».</p></div>
<div class="tbox ex"><h4>Κείμενο εξάσκησης</h4>
${PASSAGE(`Τα τελευταία χρόνια όλο και περισσότεροι νέοι στην Κύπρο προσφέρουν εθελοντικά τον χρόνο τους: συμμετέχουν σε δενδροφυτεύσεις και καθαρισμούς ακτών, στηρίζουν ηλικιωμένους που ζουν μόνοι και οργανώνουν εράνους για οικογένειες που δοκιμάζονται. Σύμφωνα με μια πρόσφατη έρευνα, σχεδόν ένας στους τρεις μαθητές Λυκείου έχει πάρει μέρος σε κάποια εθελοντική δράση μέσα στον τελευταίο χρόνο. Το φαινόμενο αυτό διαψεύδει την εικόνα μιας νεολαίας αδιάφορης, εγκλωβισμένης στις οθόνες της, και μας υποχρεώνει να δούμε με νέα ματιά τη σχέση των νέων με την κοινωνία.

Ποια είναι, όμως, τα οφέλη για τους ίδιους τους νέους; Πρώτα απ’ όλα, ο εθελοντισμός καλλιεργεί την ενσυναίσθηση: όποιος έχει μοιράσει φαγητό σε άστεγους δύσκολα θα μείνει αδιάφορος μπροστά στον πόνο του άλλου. Επιπλέον, οι νέοι αποκτούν δεξιότητες που κανένα σχολικό εγχειρίδιο δεν μπορεί να διδάξει, όπως τη συνεργασία, την οργάνωση, τη διαχείριση του άγχους και την ανάληψη ευθύνης. Δεν είναι τυχαίο ότι πολλοί εργοδότες εκτιμούν ιδιαίτερα την εθελοντική εμπειρία ενός υποψηφίου, γιατί τη θεωρούν ένδειξη ωριμότητας και πρωτοβουλίας.

Τα οφέλη, βέβαια, δεν περιορίζονται στο άτομο. Μια κοινωνία με ενεργούς εθελοντές αντιδρά πιο γρήγορα στις κρίσεις: στις πυρκαγιές του καλοκαιριού, για παράδειγμα, ομάδες νέων μετέφεραν νερό και τρόφιμα στις πληγείσες κοινότητες πολύ πριν φτάσει η οργανωμένη βοήθεια. Παράλληλα, ο εθελοντισμός χτίζει γέφυρες ανάμεσα στις γενιές και ανάμεσα σε ανθρώπους με διαφορετική καταγωγή, αφού φέρνει κοντά όσους διαφορετικά δεν θα συναντιόνταν ποτέ. Με αυτόν τον τρόπο ενισχύεται ο κοινωνικός ιστός και η εμπιστοσύνη των πολιτών ο ένας στον άλλο.

Ωστόσο, ο εθελοντισμός δεν πρέπει να γίνεται άλλοθι για την αδράνεια της πολιτείας. Όταν οι εθελοντές καλύπτουν διαρκώς κενά σε νοσοκομεία ή σε κοινωνικές υπηρεσίες, υπάρχει ο κίνδυνος να θεωρηθεί η προσφορά τους δεδομένη και να μην προσλαμβάνεται το αναγκαίο προσωπικό. Επιπρόσθετα, η «εθελοντική» συμμετοχή χάνει το νόημά της, όταν επιβάλλεται ως υποχρέωση για την απόκτηση μορίων ή βεβαιώσεων. Τότε η προσφορά μετατρέπεται σε συναλλαγή και ο νέος μαθαίνει να υπολογίζει το αντάλλαγμα αντί να νοιάζεται για τον συνάνθρωπο.

Το ζητούμενο, επομένως, είναι ο εθελοντισμός να πηγάζει από ελεύθερη επιλογή και να στηρίζεται από ένα σχολείο που εμπνέει και δεν εξαναγκάζει. Οι εκπαιδευτικοί μπορούν να γνωρίσουν στους μαθητές τις ανάγκες της τοπικής κοινωνίας, να συνεργαστούν με οργανώσεις και, κυρίως, να γίνουν οι ίδιοι παράδειγμα. Αν η εκπαίδευση καλλιεργήσει την ιδέα ότι η κοινωνία είναι υπόθεση όλων μας, τότε η προσφορά θα πάψει να είναι μια φευγαλέα «μόδα» και θα γίνει στάση ζωής.`, { title: "Εθελοντισμός: πολυτέλεια ή ανάγκη;", source: "Πρωτότυπο κείμενο εξάσκησης (PagkypriesOnline) · τα στοιχεία είναι ενδεικτικά", num: "par" })}
<details class="steps"><summary>Βήμα 2 · Σημειώσεις ανά παράγραφο</summary>
<table class="tbl"><tr><th>§</th><th>Πλαγιότιτλος (κύρια ιδέα)</th><th>Τι παραλείπουμε</th></tr>
<tr><td>1</td><td>Αυξανόμενη εθελοντική δράση των νέων — ανατροπή της εικόνας αδιάφορης νεολαίας</td><td>τα είδη των δράσεων, το «ένας στους τρεις»</td></tr>
<tr><td>2</td><td>Ατομικά οφέλη: ενσυναίσθηση, δεξιότητες, εκτίμηση από εργοδότες</td><td>το παράδειγμα με τους άστεγους, τη λίστα δεξιοτήτων</td></tr>
<tr><td>3</td><td>Κοινωνικά οφέλη: γρήγορη αντίδραση στις κρίσεις, αλληλεγγύη, εμπιστοσύνη</td><td>το παράδειγμα των πυρκαγιών</td></tr>
<tr><td>4</td><td>Κίνδυνοι: υποκατάσταση της πολιτείας, εξαναγκασμός με αντάλλαγμα</td><td>νοσοκομεία, μόρια, βεβαιώσεις (τα συνοψίζουμε)</td></tr>
<tr><td>5</td><td>Πρόταση: ελεύθερη επιλογή και σχολείο που εμπνέει → στάση ζωής</td><td>τις επιμέρους ενέργειες των εκπαιδευτικών</td></tr></table></details>
<details class="steps"><summary>Βήμα 4 · Ενδεικτική περίληψη (124 λέξεις)</summary>
<p>Το άρθρο πραγματεύεται τον εθελοντισμό των νέων, τα οφέλη και τους κινδύνους του. Αρχικά, ο αρθρογράφος διαπιστώνει ότι όλο και περισσότεροι νέοι στην Κύπρο προσφέρουν εθελοντικά, γεγονός που ανατρέπει την εικόνα μιας αδιάφορης νεολαίας. Στη συνέχεια, υποστηρίζει ότι ο εθελοντισμός καλλιεργεί την ενσυναίσθηση και αναπτύσσει δεξιότητες συνεργασίας και υπευθυνότητας, τις οποίες εκτιμούν και οι εργοδότες. Επιπλέον, ωφελεί το σύνολο, καθώς η κοινωνία αντιμετωπίζει ταχύτερα τις κρίσεις, ενώ ενισχύονται η αλληλεγγύη και η εμπιστοσύνη μεταξύ των πολιτών. Ωστόσο, προειδοποιεί ότι η εθελοντική προσφορά δεν πρέπει να υποκαθιστά τις υποχρεώσεις της πολιτείας ούτε να επιβάλλεται με αντάλλαγμα, γιατί τότε γίνεται συναλλαγή. Καταληκτικά, τονίζει ότι ο εθελοντισμός πρέπει να είναι ελεύθερη επιλογή και ότι το σχολείο, εμπνέοντας χωρίς να εξαναγκάζει, μπορεί να τον μετατρέψει σε στάση ζωής.</p></details></div>
<div class="tbox rem"><h4>Πώς μοιράζονται οι λέξεις</h4>
<p>Για 120–140 λέξεις και 5 παραγράφους, υπολόγισε περίπου <b>15 λέξεις για την εισαγωγική φράση</b> και <b>20–25 λέξεις για κάθε παράγραφο</b>. Αν μια παράγραφος έχει δύο κύριες ιδέες (όπως η 1η παράγραφος του θέματος των Παγκυπρίων 2026, που πήρε 2 μονάδες), δώσ’ της περισσότερο χώρο.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>«Κολλάμε» φράσεις του κειμένου τη μία μετά την άλλη χωρίς σύνδεση — 0 μονάδες για τη δομή.</li><li>Ξεχνάμε την τελευταία παράγραφο, επειδή τελείωσαν οι λέξεις.</li><li>Γράφουμε «νομίζω», «συμφωνώ», «σωστά λέει» — η περίληψη δεν έχει προσωπικά σχόλια.</li><li>Κρατάμε παραδείγματα και αριθμούς αντί για τις ιδέες που στηρίζουν.</li><li>Ξεπερνάμε τις 170 λέξεις (−1 μονάδα) ή τις 200 (−4 μονάδες).</li></ul></div>
`,
  widget: "na1sum",
  gen: "na1gSum",
  exercises: [
    { level: 1, type: "mc", q: R`Σε ποιο γραμματικό πρόσωπο γράφεται η περίληψη ενός κειμένου;`, options: ["Στο γ΄ πρόσωπο", "Στο α΄ πρόσωπο", "Στο β΄ πρόσωπο", "Στο πρόσωπο που χρησιμοποιεί ο συγγραφέας"], correct: 0,
      hint: R`Μιλάμε για τον συγγραφέα και το κείμενό του, όχι ως ο συγγραφέας.`, sol: R`Η περίληψη γράφεται στο <b>γ΄ πρόσωπο</b> («ο συγγραφέας υποστηρίζει…»), με ουδέτερο ύφος.` },
    { level: 1, type: "mc", q: R`Στην περίληψη μπορούμε να προσθέσουμε και τη δική μας γνώμη για όσα υποστηρίζει ο συγγραφέας, αρκεί να είναι σύντομη.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ποιος είναι ο σκοπός της περίληψης;`, sol: R`<b>ΛΑΘΟΣ.</b> Η περίληψη αποδίδει αντικειμενικά τις ιδέες του κειμένου· τα προσωπικά σχόλια ανήκουν σε άλλες ερωτήσεις (π.χ. σχολιασμός θέσης).` },
    { level: 1, type: "mc", q: R`Ποια από τις παρακάτω είναι κατάλληλη εισαγωγική φράση περίληψης;`, options: ["«Το άρθρο πραγματεύεται τον εθελοντισμό των νέων, τα οφέλη και τους κινδύνους του.»", "«Συμφωνώ απόλυτα με όσα γράφει ο αρθρογράφος για τον εθελοντισμό.»", "«Στην πρώτη παράγραφο υπάρχουν πολλά παραδείγματα δράσεων.»", "«Ο εθελοντισμός είναι πολύ ωραίο πράγμα.»"], correct: 0, shuffle: true,
      hint: R`Η εισαγωγική φράση δηλώνει το θέμα όλου του κειμένου, ουδέτερα.`, sol: R`Η εισαγωγική φράση παρουσιάζει <b>το θέμα</b> και τον άξονα του κειμένου, χωρίς κρίσεις: «Το άρθρο πραγματεύεται…».` },
    { level: 2, q: R`Στο κείμενο εξάσκησης «Εθελοντισμός: πολυτέλεια ή ανάγκη;» της θεωρίας, σε ποια παράγραφο (αριθμός §) περνά ο αρθρογράφος από τα οφέλη στους κινδύνους του εθελοντισμού — δηλαδή πού θα χρειαστείς διαρθρωτική λέξη αντίθεσης στην περίληψη;`, fields: [{ label: "§", ans: 4 }],
      hint: R`Διάβασε τη θεματική περίοδο κάθε παραγράφου και πρόσεξε τις διαρθρωτικές λέξεις στην αρχή τους.`, sol: R`Στην <b>§4</b>, που ξεκινά με το «Ωστόσο»: εκεί αλλάζει η οπτική (κίνδυνοι). Στην περίληψη η μετάβαση δηλώνεται με λέξη αντίθεσης (ωστόσο, όμως, εντούτοις).` },
    { level: 2, type: "mc", q: R`Ποια είναι η κύρια ιδέα της 3ης παραγράφου του κειμένου εξάσκησης;`, options: ["Ο εθελοντισμός ωφελεί και την κοινωνία: γρηγορότερη αντίδραση στις κρίσεις, αλληλεγγύη, εμπιστοσύνη", "Στις πυρκαγιές του καλοκαιριού νέοι μετέφεραν νερό και τρόφιμα", "Οι εργοδότες εκτιμούν την εθελοντική εμπειρία", "Ο εθελοντισμός δεν πρέπει να υποκαθιστά το κράτος"], correct: 0,
      hint: R`Ξεχώρισε την ιδέα από το παράδειγμα που τη στηρίζει.`, sol: R`Η 3η παράγραφος ξεκινά με τη θεματική περίοδο «Τα οφέλη… δεν περιορίζονται στο άτομο»: <b>κοινωνικά οφέλη</b>. Οι πυρκαγιές είναι <b>παράδειγμα</b> και παραλείπεται.` },
    { level: 2, type: "mc", q: R`Ποιο στοιχείο του κειμένου εξάσκησης πρέπει να ΠΑΡΑΛΕΙΦΘΕΙ στην περίληψη;`, options: ["Ότι σχεδόν ένας στους τρεις μαθητές έχει πάρει μέρος σε εθελοντική δράση", "Ότι ο εθελοντισμός δεν πρέπει να γίνεται άλλοθι για την αδράνεια της πολιτείας", "Ότι ο εθελοντισμός καλλιεργεί την ενσυναίσθηση", "Ότι το σχολείο πρέπει να εμπνέει και όχι να εξαναγκάζει"], correct: 0,
      hint: R`Στατιστικά στοιχεία και παραδείγματα στηρίζουν τις ιδέες — δεν είναι οι ιδέες.`, sol: R`Το στατιστικό στοιχείο είναι <b>τεκμήριο</b>· στην περίληψη κρατάμε μόνο τη διαπίστωση ότι οι νέοι προσφέρουν όλο και περισσότερο. Τα άλλα τρία είναι κύριες ιδέες.` },
    { level: 2, type: "mc", q: R`Η 2η παράγραφος αρχίζει με το ερώτημα «Ποια είναι, όμως, τα οφέλη για τους ίδιους τους νέους;». Πώς το αποδίδουμε σωστά στην περίληψη;`, options: ["«Ο αρθρογράφος εξετάζει στη συνέχεια τα οφέλη του εθελοντισμού για τους νέους…»", "«Ποια είναι, όμως, τα οφέλη για τους ίδιους τους νέους;»", "«Ρωτάμε ποια είναι τα οφέλη μας.»", "Το παραλείπουμε, γιατί οι ερωτήσεις δεν έχουν περιεχόμενο."], correct: 0,
      hint: R`Η περίληψη γράφεται σε γ΄ πρόσωπο και αποδίδει τι κάνει ο συγγραφέας σε κάθε σημείο.`, sol: R`Το ερώτημα εδώ δεν είναι ρητορικό: εισάγει το θέμα της παραγράφου και απαντάται αμέσως. Στην περίληψη τα ερωτήματα <b>πλαγιοποιούνται</b> ή γίνονται κρίσεις, σε γ΄ πρόσωπο: «ο αρθρογράφος εξετάζει ποια είναι…».` },
    { level: 2, q: R`Υποψήφιος γράφει περίληψη 212 λέξεων. Πόσες μονάδες αφαιρούνται για την υπέρβαση, σύμφωνα με τον οδηγό διόρθωσης του 2026;`, fields: [{ label: "Αφαιρούνται:", ans: 4 }],
      hint: R`Πάνω από 200 λέξεις ισχύει το αυστηρότερο κατώφλι.`, sol: R`212 > 200 → αφαιρούνται <b>4</b> μονάδες από τις 8. Γι’ αυτό μετράμε πάντα τις λέξεις.` },
    { level: 3, type: "mc", q: R`Ποια διατύπωση αποδίδει καλύτερα, σε ύφος περίληψης, την 4η παράγραφο του κειμένου εξάσκησης;`, options: ["«Ωστόσο, προειδοποιεί ότι ο εθελοντισμός δεν πρέπει να υποκαθιστά τις υποχρεώσεις της πολιτείας ούτε να επιβάλλεται με αντάλλαγμα.»", "«Ωστόσο, ο εθελοντισμός δεν πρέπει να γίνεται άλλοθι για την αδράνεια της πολιτείας σε νοσοκομεία και κοινωνικές υπηρεσίες.»", "«Πολύ σωστά ο αρθρογράφος τονίζει ότι το κράτος δεν κάνει τίποτα.»", "«Στα νοσοκομεία δεν προσλαμβάνεται το αναγκαίο προσωπικό και δίνονται μόρια.»"], correct: 0,
      hint: R`Ψάχνουμε αναδιατύπωση + διαρθρωτική λέξη + χωρίς σχόλια και λεπτομέρειες.`, sol: R`Η σωστή επιλογή <b>αναδιατυπώνει</b> και συνοψίζει τις δύο ιδέες της παραγράφου με τη διαρθρωτική λέξη «Ωστόσο». Η διατύπωση με τα νοσοκομεία είναι σχεδόν αντιγραφή, εκείνη με το «πολύ σωστά» έχει προσωπικό σχόλιο και εκείνη με τα μόρια μένει σε λεπτομέρειες.` },
    { level: 3, type: "mc", q: R`Ποια διαρθρωτική λέξη ταιριάζει καλύτερα για τη μετάβαση από τα οφέλη (§2–3) στους κινδύνους (§4) μέσα στην περίληψη;`, options: ["Ωστόσο", "Επιπλέον", "Για παράδειγμα", "Δηλαδή"], correct: 0,
      hint: R`Ποια λογική σχέση συνδέει τα θετικά που προηγούνται με τα αρνητικά που ακολουθούν;`, sol: R`Από τα θετικά περνάμε στα αρνητικά: χρειάζεται λέξη <b>αντίθεσης</b> — <i>ωστόσο, όμως, εντούτοις, από την άλλη</i>.` }
  ]
},
/* ───────────────────────────── 2.2 ───────────────────────────── */
{
  id: "2.2", unit: 2, title: "Τρόποι και μέσα πειθούς: επίκληση στη λογική, στην αυθεντία, στο συναίσθημα, στο ήθος",
  book: "Πίνακας προδιαγραφών 2026 · Κειμενικοί τύποι 1: Επιχειρηματολογία — Τρόποι και μέσα πειθούς · Οδηγός διόρθωσης 2026, Α.Ι.2",
  intro: "Με ποιους τρόπους και με ποια μέσα πείθει ένας συγγραφέας τον αναγνώστη — και πώς τα εντοπίζουμε και τα τεκμηριώνουμε στις Παγκύπριες;",
  thumb: LETTER("Πειθώ"),
  theory: R`
<p>Κάθε <b>επιχειρηματολογικό κείμενο</b> (άρθρο, δοκίμιο, ομιλία, επιστολή γνώμης) θέλει να <b>πείσει</b> τον δέκτη. Ο <b>τρόπος πειθούς</b> είναι η γενική στρατηγική — σε τι «απευθύνεται» ο πομπός: στη λογική, στην αυθεντία, στο συναίσθημα ή στο ήθος. Τα <b>μέσα πειθούς</b> είναι τα συγκεκριμένα εργαλεία με τα οποία υλοποιείται κάθε τρόπος (επιχειρήματα, τεκμήρια, παραδείγματα, ρητορικά ερωτήματα κ.λπ.). Στις Παγκύπριες η ερώτηση συνήθως δίνει τον τρόπο και ζητά <b>μέσα με τεκμηρίωση</b> (όπως στην Α.Ι.2 του 2026) ή ζητά να εντοπίσεις τον τρόπο σε συγκεκριμένη παράγραφο.</p>
<div class="tbox def"><h4>Οι τρόποι πειθούς της ύλης</h4>
<table class="tbl"><tr><th>Τρόπος</th><th>Σε τι στηρίζεται</th><th>Τυπικά μέσα</th></tr>
<tr><td><b>Επίκληση στη λογική</b></td><td>Στη λογική σκέψη του δέκτη: αποδεικνύει.</td><td>επιχειρήματα, συλλογισμοί, τεκμήρια (παραδείγματα, γεγονότα, στατιστικά στοιχεία), γενικά αποδεκτές αλήθειες</td></tr>
<tr><td><b>Επίκληση στην αυθεντία</b></td><td>Στο κύρος ενός ειδικού, θεσμού ή διάσημου προσώπου.</td><td>γνώμες ειδικών, αποφάσεις οργανισμών, παραθέματα από φιλοσόφους ή επιστήμονες, μαρτυρίες</td></tr>
<tr><td><b>Επίκληση στο συναίσθημα</b></td><td>Στα συναισθήματα του δέκτη: συγκινεί, φοβίζει, ενθουσιάζει.</td><td>συναισθηματικά φορτισμένο λεξιλόγιο, ρητορικά ερωτήματα, αφήγηση περιστατικών, εικόνες, χιούμορ, ειρωνεία, θαυμαστικά, β΄ πρόσωπο</td></tr>
<tr><td><b>Επίκληση στο ήθος του πομπού</b></td><td>Στην αξιοπιστία και το κύρος του ίδιου του ομιλητή.</td><td>αναφορά στην εμπειρία ή τις σπουδές του, ειλικρίνεια, μετριοφροσύνη, προσωπικό παράδειγμα</td></tr>
<tr><td><b>Επίκληση στο ήθος του δέκτη</b></td><td>Στις αξίες, την ευαισθησία ή την ευθύνη του αποδέκτη.</td><td>«Εσείς, ως συνειδητοποιημένοι πολίτες…», κολακεία, έκκληση στο φιλότιμο</td></tr>
<tr><td><b>Επίθεση στο ήθος του αντιπάλου</b></td><td>Στην υπονόμευση της αξιοπιστίας όποιου έχει αντίθετη άποψη.</td><td>ειρωνεία, απαξιωτικοί χαρακτηρισμοί, αμφισβήτηση κινήτρων (θεμιτή μόνο όταν στηρίζεται σε στοιχεία)</td></tr></table></div>
<div class="tbox thm"><h4>Επιχείρημα και τεκμήριο: η διαφορά</h4>
<p>Το <b>επιχείρημα</b> είναι μια <b>κρίση</b> που στηρίζει τη θέση, συνήθως με αιτιολόγηση: «Ο εθελοντισμός καλλιεργεί την ενσυναίσθηση, γιατί φέρνει τον νέο σε επαφή με τον πόνο του άλλου». Το <b>τεκμήριο</b> είναι ένα <b>αντικειμενικό στοιχείο</b> που επιβεβαιώνει το επιχείρημα: παράδειγμα, γεγονός, στατιστικό στοιχείο, μαρτυρία. Ένα επιχείρημα χωρίς τεκμήρια μένει αστήρικτο· ένα τεκμήριο χωρίς επιχείρημα δεν αποδεικνύει τίποτα.</p></div>
<div class="tbox ex"><h4>Κείμενο εξάσκησης: εντοπίζω τρόπους και μέσα</h4>
${PASSAGE(`Η κατάργηση των πλαστικών μιας χρήσης δεν είναι υπερβολή, αλλά ανάγκη. Κάθε χρόνο εκατομμύρια τόνοι πλαστικού καταλήγουν στις θάλασσες, όπου διασπώνται σε μικροσωματίδια που περνούν στην τροφική αλυσίδα. Όπως επισημαίνουν οι θαλάσσιοι βιολόγοι, τα μικροπλαστικά εντοπίζονται πλέον ακόμη και στα ψάρια που φτάνουν στο τραπέζι μας. Θα μπορούσαμε άραγε να κοιτάξουμε στα μάτια τα παιδιά μας και να τους πούμε ότι τους αφήνουμε θάλασσες γεμάτες σκουπίδια; Όσοι ισχυρίζονται ότι το μέτρο «βλάπτει την αγορά» ξεχνούν πως οι ίδιοι κερδίζουν από την παραγωγή του πλαστικού. Εσείς, που αγαπάτε τις ακτές του τόπου μας, ξέρετε ότι η αλλαγή αρχίζει από τις μικρές καθημερινές επιλογές.`, { title: "Μια θάλασσα χωρίς πλαστικό", source: "Πρωτότυπο κείμενο εξάσκησης", num: "par" })}
<details class="steps"><summary>Λύση βήμα-βήμα</summary>
<table class="tbl"><tr><th>Σημείο</th><th>Τρόπος</th><th>Μέσο</th></tr>
<tr><td>«Κάθε χρόνο εκατομμύρια τόνοι πλαστικού…»</td><td>επίκληση στη λογική</td><td>τεκμήριο: γεγονός/στατιστικό στοιχείο, αιτιολόγηση</td></tr>
<tr><td>«Όπως επισημαίνουν οι θαλάσσιοι βιολόγοι…»</td><td>επίκληση στην αυθεντία</td><td>γνώμη ειδικών</td></tr>
<tr><td>«Θα μπορούσαμε άραγε να κοιτάξουμε στα μάτια τα παιδιά μας…;»</td><td>επίκληση στο συναίσθημα</td><td>ρητορικό ερώτημα, συναισθηματικά φορτισμένη εικόνα</td></tr>
<tr><td>«Όσοι ισχυρίζονται… ξεχνούν πως οι ίδιοι κερδίζουν…»</td><td>επίθεση στο ήθος του αντιπάλου</td><td>αμφισβήτηση των κινήτρων, εισαγωγικά με ειρωνική χροιά</td></tr>
<tr><td>«Εσείς, που αγαπάτε τις ακτές του τόπου μας…»</td><td>επίκληση στο ήθος του δέκτη</td><td>β΄ πρόσωπο, αναφορά στις αξίες του αναγνώστη</td></tr></table></details></div>
<div class="tbox tip"><h4>Πώς γράφω την απάντηση</h4>
<p>Σχήμα που δουλεύει πάντα: <b>μέσο → τεκμηρίωση → (λειτουργία)</b>. Π.χ.: «α. <i>Γνώμη ειδικών</i>: “Όπως επισημαίνουν οι θαλάσσιοι βιολόγοι…”· με την αναφορά σε ειδικούς ο συγγραφέας προσδίδει κύρος στη θέση του». Αν η ερώτηση ζητά «δύο διαφορετικά μέσα», μη γράψεις δύο παραδείγματα του ίδιου μέσου.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Μπερδεύουμε τον <b>τρόπο</b> (επίκληση στη λογική) με το <b>μέσο</b> (στατιστικό στοιχείο).</li><li>Θεωρούμε κάθε ερωτηματικό «επίκληση στο συναίσθημα» — ένα ερώτημα μπορεί απλώς να εισάγει θέμα.</li><li>Ονομάζουμε το μέσο, αλλά δεν το τεκμηριώνουμε με σημείο του κειμένου (χάνεται η μισή μονάδα).</li><li>Βρίσκουμε μέσα σε λάθος παράγραφο από αυτή που ορίζει η ερώτηση.</li></ul></div>
`,
  widget: "na1pers",
  gen: "na1gPers",
  exercises: [
    { level: 1, type: "mc", q: R`«Σύμφωνα με τον Παγκόσμιο Οργανισμό Υγείας, η καθιστική ζωή συνδέεται με σοβαρά προβλήματα υγείας.» Ποιος τρόπος πειθούς χρησιμοποιείται;`, options: ["Επίκληση στην αυθεντία", "Επίκληση στο συναίσθημα", "Επίκληση στο ήθος του δέκτη", "Επίθεση στο ήθος του αντιπάλου"], correct: 0,
      hint: R`Ποιος «εγγυάται» την αλήθεια της κρίσης;`, sol: R`Η αναφορά σε έναν διεθνή οργανισμό με κύρος είναι <b>επίκληση στην αυθεντία</b>.` },
    { level: 1, type: "mc", q: R`«Φανταστείτε ένα παιδί να περιμένει μάταια, κάθε βράδυ, τον πατέρα του να γυρίσει από τη θάλασσα…» Ποιος τρόπος πειθούς κυριαρχεί;`, options: ["Επίκληση στο συναίσθημα", "Επίκληση στη λογική", "Επίκληση στην αυθεντία", "Επίκληση στο ήθος του πομπού"], correct: 0,
      hint: R`Η εικόνα προκαλεί συγκίνηση.`, sol: R`Η συγκινησιακή εικόνα και η προτροπή «φανταστείτε» αποτελούν <b>επίκληση στο συναίσθημα</b>.` },
    { level: 1, type: "mc", q: R`Το στατιστικό στοιχείο είναι τρόπος πειθούς.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ξεχώρισε τη στρατηγική από το εργαλείο.`, sol: R`<b>ΛΑΘΟΣ.</b> Το στατιστικό στοιχείο είναι <b>μέσο</b> πειθούς (τεκμήριο), που υπηρετεί την <b>επίκληση στη λογική</b>.` },
    { level: 2, type: "mc", q: R`«Ως γιατρός που υπηρέτησα είκοσι χρόνια σε επαρχιακό νοσοκομείο, ξέρω καλά τι σημαίνει έλλειψη προσωπικού.» Ποιος τρόπος πειθούς χρησιμοποιείται;`, options: ["Επίκληση στο ήθος του πομπού", "Επίκληση στο ήθος του δέκτη", "Επίκληση στην αυθεντία τρίτου", "Επίθεση στο ήθος του αντιπάλου"], correct: 0,
      hint: R`Ο ίδιος ο ομιλητής προβάλλει την εμπειρία του.`, sol: R`Ο πομπός στηρίζει την αξιοπιστία του στην <b>προσωπική του εμπειρία</b>: επίκληση στο <b>ήθος του πομπού</b>.` },
    { level: 2, type: "mc", q: R`«Οι υπέρμαχοι της ιδέας αυτής, που τυχαίνει να είναι και ιδιοκτήτες των μεγαλύτερων εταιρειών του κλάδου, θέλουν να μας πείσουν για το “κοινό καλό”.» Ποιος τρόπος πειθούς χρησιμοποιείται;`, options: ["Επίθεση στο ήθος του αντιπάλου", "Επίκληση στην αυθεντία", "Επίκληση στο ήθος του δέκτη", "Επίκληση στη λογική με στατιστικά"], correct: 0,
      hint: R`Πρόσεξε την ειρωνεία των εισαγωγικών και την αναφορά στα συμφέροντα.`, sol: R`Αμφισβητούνται τα <b>κίνητρα</b> όσων έχουν την αντίθετη άποψη, με ειρωνεία: <b>επίθεση στο ήθος του αντιπάλου</b>.` },
    { level: 2, type: "mc", q: R`«Εσείς, οι νέοι, που δεν φοβάστε να ονειρεύεστε, μπορείτε να αλλάξετε αυτόν τον τόπο.» Ποιος τρόπος πειθούς χρησιμοποιείται;`, options: ["Επίκληση στο ήθος του δέκτη", "Επίκληση στο ήθος του πομπού", "Επίκληση στη λογική", "Επίκληση στην αυθεντία"], correct: 0,
      hint: R`Σε ποιον αποδίδονται θετικές αξίες;`, sol: R`Ο ομιλητής απευθύνεται στους δέκτες (β΄ πρόσωπο) και επικαλείται τις αρετές τους: <b>επίκληση στο ήθος του δέκτη</b>.` },
    { level: 2, type: "mc", q: R`Στο κείμενο εξάσκησης «Μια θάλασσα χωρίς πλαστικό», με ποιο μέσο υλοποιείται η επίκληση στο συναίσθημα;`, options: ["Με ρητορικό ερώτημα και συγκινησιακή εικόνα για τα παιδιά", "Με τη γνώμη των θαλάσσιων βιολόγων", "Με το στοιχείο για τους τόνους πλαστικού", "Με την αμφισβήτηση των κινήτρων των αντιπάλων"], correct: 0,
      hint: R`Ποια γλωσσικά μέσα απευθύνονται στο συναίσθημα και όχι στη λογική του αναγνώστη;`, sol: R`Το ερώτημα «Θα μπορούσαμε άραγε να κοιτάξουμε στα μάτια τα παιδιά μας…;» είναι <b>ρητορικό ερώτημα</b> με φορτισμένη εικόνα — μέσο της επίκλησης στο συναίσθημα.` },
    { level: 2, type: "mc", q: R`Στο κείμενο εξάσκησης «Μια θάλασσα χωρίς πλαστικό», με ποιο σημείο ο συγγραφέας επικαλείται το ήθος του δέκτη;`, options: ["«Εσείς, που αγαπάτε τις ακτές του τόπου μας, ξέρετε ότι η αλλαγή αρχίζει από τις μικρές καθημερινές επιλογές.»", "«Όπως επισημαίνουν οι θαλάσσιοι βιολόγοι, τα μικροπλαστικά εντοπίζονται πλέον ακόμη και στα ψάρια.»", "«Κάθε χρόνο εκατομμύρια τόνοι πλαστικού καταλήγουν στις θάλασσες.»", "«Όσοι ισχυρίζονται ότι το μέτρο “βλάπτει την αγορά” ξεχνούν πως οι ίδιοι κερδίζουν από την παραγωγή του πλαστικού.»"], correct: 0,
      hint: R`Το ήθος του δέκτη αφορά τις αξίες εκείνου στον οποίο απευθύνεται ο λόγος. Πού τον «βλέπει» ο συγγραφέας;`, sol: R`Με το β΄ πρόσωπο και την αναφορά στην αγάπη των αναγνωστών για τον τόπο, ο συγγραφέας επικαλείται το <b>ήθος του δέκτη</b>. Οι άλλες προτάσεις είναι επίκληση στην αυθεντία, στη λογική και επίθεση στο ήθος του αντιπάλου.` },
    { level: 3, type: "mc", q: R`Ερώτηση εξέτασης: «Να αναφέρετε δύο διαφορετικά μέσα με τα οποία επιτυγχάνεται η επίκληση στη λογική στην παράγραφο.» Ποια απάντηση είναι πλήρης;`, options: ["«α. Τεκμήριο–στατιστικό στοιχείο: “…εκατομμύρια τόνοι…” · β. Αιτιολόγηση: “…όπου διασπώνται σε μικροσωματίδια…”»", "«α. Επίκληση στη λογική · β. Επίκληση στην αυθεντία»", "«α. Στατιστικό στοιχείο · β. Άλλο στατιστικό στοιχείο»", "«Ο συγγραφέας είναι πολύ πειστικός, γιατί λέει την αλήθεια.»"], correct: 0,
      hint: R`Ζητούνται δύο ΔΙΑΦΟΡΕΤΙΚΑ μέσα, με τεκμηρίωση.`, sol: R`Χρειάζονται δύο <b>διαφορετικά μέσα</b> + <b>τεκμηρίωση</b> από το κείμενο. Όποιος γράφει «επίκληση στη λογική / στην αυθεντία» δίνει τρόπους αντί για μέσα· δύο στατιστικά στοιχεία είναι το ίδιο μέσο· και το «είναι πειστικός» είναι γενικόλογο.` },
    { level: 3, type: "mc", q: R`Σε ποια περίπτωση η «επίθεση στο ήθος του αντιπάλου» θεωρείται θεμιτό μέσο πειθούς;`, options: ["Όταν στηρίζεται σε αποδεδειγμένα στοιχεία για τα κίνητρα ή τη συμπεριφορά του", "Πάντοτε, αφού κάθε μέσο είναι θεμιτό", "Μόνο όταν γίνεται με ύβρεις", "Ποτέ — απαγορεύεται σε κάθε κείμενο"], correct: 0,
      hint: R`Η διαφορά ανάμεσα στην κριτική και τη λασπολογία.`, sol: R`Όταν τεκμηριώνεται (π.χ. αποδεδειγμένη σύγκρουση συμφερόντων) είναι θεμιτή κριτική· όταν είναι αβάσιμη, γίνεται <b>λογική πλάνη</b> (προσωπική επίθεση) και υπονομεύει την αξιοπιστία του ίδιου του πομπού.` }
  ]
},
/* ───────────────────────────── 2.3 ───────────────────────────── */
{
  id: "2.3", unit: 2, title: "Συλλογισμοί: παραγωγικός, επαγωγικός και αναλογικός συλλογισμός (αναγνώριση)",
  book: "Πίνακας προδιαγραφών 2026 · Κειμενικά είδη 5: Συλλογισμοί, είδη συλλογισμών (απλή αναγνώριση)",
  intro: "Τι είναι ο συλλογισμός σε ένα επιχειρηματολογικό κείμενο και πώς ξεχωρίζουμε αμέσως αν είναι παραγωγικός, επαγωγικός ή αναλογικός;",
  thumb: LETTER("άρα…"),
  theory: R`
<p>Ο <b>συλλογισμός</b> είναι η νοητική πορεία με την οποία, από κάποιες δεδομένες κρίσεις — τις <b>προκείμενες</b> — καταλήγουμε σε μια νέα κρίση, το <b>συμπέρασμα</b>. Στα επιχειρηματολογικά κείμενα ο συλλογισμός είναι ο «σκελετός» της επίκλησης στη λογική: δείχνει γιατί η θέση του συγγραφέα προκύπτει από όσα προηγούνται. Η ύλη των Παγκυπρίων ζητά <b>απλή αναγνώριση</b> τριών ειδών: του <b>παραγωγικού</b>, του <b>επαγωγικού</b> και του <b>αναλογικού</b> συλλογισμού. Συνήθως τους εντοπίζουμε από την κατεύθυνση της σκέψης: από το γενικό στο ειδικό, από το ειδικό στο γενικό ή από το ειδικό στο ειδικό.</p>
<div class="tbox def"><h4>Παραγωγικός συλλογισμός: από το γενικό στο ειδικό</h4>
<p>Ξεκινά από μια <b>γενική αρχή</b> (μείζων προκείμενη), την εφαρμόζει σε μια <b>συγκεκριμένη περίπτωση</b> (ελάσσων προκείμενη) και καταλήγει σε <b>βέβαιο</b> συμπέρασμα — αν οι προκείμενες είναι αληθείς.</p>
<p>Παράδειγμα: <i>Όσοι οδηγούν μετά από κατανάλωση αλκοόλ θέτουν σε κίνδυνο τη ζωή άλλων. Ο Χ οδήγησε μετά από κατανάλωση αλκοόλ. Άρα έθεσε σε κίνδυνο τη ζωή άλλων.</i></p></div>
<div class="tbox def"><h4>Επαγωγικός συλλογισμός: από το ειδικό στο γενικό</h4>
<p>Ξεκινά από <b>πολλές συγκεκριμένες περιπτώσεις</b> (παρατηρήσεις, παραδείγματα, στατιστικά) και καταλήγει σε ένα <b>γενικό συμπέρασμα</b>. Το συμπέρασμα είναι <b>πιθανό</b>, όχι βέβαιο: μια νέα περίπτωση μπορεί να το διαψεύσει. Όσο περισσότερες και πιο αντιπροσωπευτικές οι περιπτώσεις, τόσο πιο πειστικό.</p>
<p>Παράδειγμα: <i>Στο σχολείο μας, στα σχολεία της Λεμεσού και σε όσα σχολεία της Πάφου εξετάστηκαν, όταν καθιερώθηκε το διάλειμμα με αθλητικές δραστηριότητες μειώθηκαν τα επεισόδια βίας. Επομένως, η άθληση στο διάλειμμα περιορίζει τη βία στα σχολεία.</i></p></div>
<div class="tbox def"><h4>Αναλογικός συλλογισμός: από το ειδικό στο ειδικό</h4>
<p>Συγκρίνει <b>δύο περιπτώσεις που μοιάζουν</b> σε κάποια σημεία και συμπεραίνει ότι θα μοιάζουν και σε κάποιο άλλο. Είναι ο <b>λιγότερο ασφαλής</b> συλλογισμός: η ομοιότητα μπορεί να είναι επιφανειακή.</p>
<p>Παράδειγμα: <i>Όπως ο κηπουρός κλαδεύει τα ξερά κλαδιά για να ανθίσει το δέντρο, έτσι και ο δάσκαλος πρέπει να διορθώνει τα λάθη του μαθητή για να τον βοηθήσει να ωριμάσει.</i></p></div>
<div class="tbox thm"><h4>Πίνακας αναγνώρισης</h4>
<table class="tbl"><tr><th></th><th>Κατεύθυνση</th><th>Συμπέρασμα</th><th>Λέξεις-ενδείξεις</th></tr>
<tr><td><b>Παραγωγικός</b></td><td>γενικό → ειδικό</td><td>βέβαιο (αν οι προκείμενες ισχύουν)</td><td>όλοι, κάθε, πάντοτε … άρα, συνεπώς</td></tr>
<tr><td><b>Επαγωγικός</b></td><td>ειδικό → γενικό</td><td>πιθανό</td><td>σε πολλές περιπτώσεις, έρευνες δείχνουν … επομένως γενικά</td></tr>
<tr><td><b>Αναλογικός</b></td><td>ειδικό → ειδικό</td><td>πιθανό, λιγότερο ασφαλές</td><td>όπως… έτσι, παρόμοια, κατ’ αναλογία</td></tr></table></div>
<div class="tbox ex"><h4>Βρίσκω συλλογισμό σε παράγραφο</h4>
${PASSAGE(`Κάθε δημοκρατία στηρίζεται στη συμμετοχή των πολιτών της. Όταν οι πολίτες απέχουν μαζικά από τις εκλογές, τα αποτελέσματα εκφράζουν μια μικρή μειοψηφία και οι αποφάσεις χάνουν την κοινωνική τους νομιμοποίηση. Στις τελευταίες τοπικές εκλογές ψήφισε λιγότερο από το μισό εκλογικό σώμα. Είναι φανερό, επομένως, ότι η δημοκρατία μας αντιμετωπίζει σοβαρό πρόβλημα νομιμοποίησης, που δεν λύνεται με ευχολόγια αλλά με ουσιαστική πολιτική παιδεία.`, { title: "Παράγραφος εξάσκησης", source: "Πρωτότυπο κείμενο εξάσκησης" })}
<details class="steps"><summary>Λύση βήμα-βήμα</summary><p><b>Γενική αρχή</b> (μείζων): κάθε δημοκρατία στηρίζεται στη συμμετοχή· η μαζική αποχή αφαιρεί νομιμοποίηση. <b>Συγκεκριμένη περίπτωση</b> (ελάσσων): στις τελευταίες τοπικές εκλογές ψήφισε λιγότερο από το μισό εκλογικό σώμα. <b>Συμπέρασμα</b> («επομένως»): η δημοκρατία μας έχει πρόβλημα νομιμοποίησης. Η σκέψη πηγαίνει από το γενικό στο ειδικό → <b>παραγωγικός συλλογισμός</b>.</p></details></div>
<div class="tbox rem"><h4>Συλλογισμός και μέσα πειθούς</h4>
<p>Στον οδηγό διόρθωσης των Παγκυπρίων 2026 (Α.Ι.2) ο <b>συλλογισμός</b> έγινε δεκτός ως ένα από τα μέσα της <b>επίκλησης στη λογική</b>, μαζί με τα επιχειρήματα και τα τεκμήρια. Όταν τον αναφέρεις, εξήγησε σύντομα από πού ξεκινά και πού καταλήγει η σκέψη.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Χαρακτηρίζουμε «επαγωγικό» κάθε κείμενο με παράδειγμα — ο επαγωγικός χρειάζεται <b>πολλές</b> περιπτώσεις που οδηγούν σε <b>γενίκευση</b>.</li><li>Μπερδεύουμε τον αναλογικό συλλογισμό με την απλή παρομοίωση: ο συλλογισμός καταλήγει σε <b>συμπέρασμα</b>, η παρομοίωση απλώς ζωντανεύει την εικόνα.</li><li>Γράφουμε μόνο το όνομα του συλλογισμού, χωρίς να δείξουμε προκείμενες και συμπέρασμα.</li></ul></div>
`,
  widget: "na1syl",
  gen: "na1gSyl",
  exercises: [
    { level: 1, type: "mc", q: R`«Όλα τα μέταλλα διαστέλλονται όταν θερμαίνονται. Ο χαλκός είναι μέταλλο. Άρα ο χαλκός διαστέλλεται όταν θερμαίνεται.» Τι είδους συλλογισμός είναι;`, options: ["Παραγωγικός", "Επαγωγικός", "Αναλογικός"], correct: 0,
      hint: R`Ρώτα: από τι είδους κρίση ξεκινά η σκέψη (γενική ή ειδική) και πού καταλήγει;`, sol: R`Από τη <b>γενική αρχή</b> στη <b>συγκεκριμένη περίπτωση</b>: <b>παραγωγικός</b> συλλογισμός, με βέβαιο συμπέρασμα.` },
    { level: 1, type: "mc", q: R`Στον επαγωγικό συλλογισμό το συμπέρασμα είναι πάντοτε βέβαιο.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι γίνεται αν βρεθεί μια περίπτωση που δεν ταιριάζει;`, sol: R`<b>ΛΑΘΟΣ.</b> Το επαγωγικό συμπέρασμα είναι <b>πιθανό</b>: γενικεύει από περιορισμένο αριθμό περιπτώσεων και μπορεί να διαψευστεί.` },
    { level: 1, type: "mc", q: R`Ποια είναι η κατεύθυνση της σκέψης στον αναλογικό συλλογισμό;`, options: ["Από το ειδικό στο ειδικό", "Από το γενικό στο ειδικό", "Από το ειδικό στο γενικό", "Από το γενικό στο γενικό"], correct: 0,
      hint: R`Συγκρίνονται δύο συγκεκριμένες περιπτώσεις.`, sol: R`Ο αναλογικός πηγαίνει <b>από το ειδικό στο ειδικό</b>, με βάση την ομοιότητα δύο περιπτώσεων.` },
    { level: 2, type: "mc", q: R`«Στη Φινλανδία, στη Δανία και στην Ολλανδία, όπου οι μαθητές έχουν λιγότερες ώρες κατ’ οίκον εργασίας, οι επιδόσεις στις διεθνείς αξιολογήσεις είναι υψηλές. Φαίνεται, λοιπόν, ότι η πολλή κατ’ οίκον εργασία δεν είναι προϋπόθεση για καλές επιδόσεις.» Τι συλλογισμός είναι;`, options: ["Επαγωγικός", "Παραγωγικός", "Αναλογικός"], correct: 0,
      hint: R`Από πόσες περιπτώσεις και προς τα πού πηγαίνει η σκέψη;`, sol: R`Από <b>τρεις συγκεκριμένες περιπτώσεις</b> σε <b>γενικό συμπέρασμα</b> («φαίνεται» = πιθανό): <b>επαγωγικός</b>.` },
    { level: 2, type: "mc", q: R`«Όπως ένα σπίτι με σαθρά θεμέλια καταρρέει στον πρώτο σεισμό, έτσι και μια κοινωνία χωρίς παιδεία λυγίζει στην πρώτη κρίση.» Τι συλλογισμός είναι;`, options: ["Αναλογικός", "Παραγωγικός", "Επαγωγικός"], correct: 0,
      hint: R`Τι συγκρίνεται με τι; Καταλήγει η σκέψη σε γενίκευση ή σε μια άλλη συγκεκριμένη περίπτωση;`, sol: R`Δύο συγκεκριμένες περιπτώσεις (σπίτι – κοινωνία) με κοινά στοιχεία: <b>αναλογικός</b> συλλογισμός.` },
    { level: 2, type: "mc", q: R`Στον συλλογισμό «Κάθε πολίτης έχει υποχρέωση να πληρώνει φόρους. Ο Ανδρέας είναι πολίτης. Άρα ο Ανδρέας έχει υποχρέωση να πληρώνει φόρους», ποια πρόταση είναι η μείζων προκείμενη;`, options: ["«Κάθε πολίτης έχει υποχρέωση να πληρώνει φόρους.»", "«Ο Ανδρέας είναι πολίτης.»", "«Άρα ο Ανδρέας έχει υποχρέωση να πληρώνει φόρους.»"], correct: 0,
      hint: R`Η μείζων είναι η γενική αρχή.`, sol: R`Μείζων = η <b>γενική αρχή</b> («Κάθε πολίτης…»). Ελάσσων = η ειδική περίπτωση («Ο Ανδρέας είναι πολίτης»). Το «άρα» εισάγει το συμπέρασμα.` },
    { level: 2, q: R`Πόσες προκείμενες έχει ένας κλασικός παραγωγικός συλλογισμός (πριν από το συμπέρασμα);`, fields: [{ label: "Προκείμενες:", ans: 2 }],
      hint: R`Θυμήσου τα μέρη του κλασικού συλλογισμού που προηγούνται του «άρα».`, sol: R`<b>Δύο</b>: τη μείζονα (γενική αρχή) και την ελάσσονα (συγκεκριμένη περίπτωση).` },
    { level: 3, type: "mc", q: R`Ποια λέξη ή φράση δηλώνει συνήθως ότι ακολουθεί το συμπέρασμα ενός συλλογισμού;`, options: ["επομένως", "για παράδειγμα", "επιπλέον", "ενώ"], correct: 0,
      hint: R`Σκέψου ποια λογική σχέση πρέπει να δηλώνει η λέξη που εισάγει την κατάληξη του συλλογισμού.`, sol: R`Το <b>επομένως</b> (όπως και τα <i>άρα, συνεπώς, κατά συνέπεια, λοιπόν</i>) εισάγει συμπέρασμα. Το «για παράδειγμα» εισάγει τεκμήριο, το «επιπλέον» προσθήκη και το «ενώ» αντίθεση.` },
    { level: 3, type: "mc", q: R`Ένας αρθρογράφος γράφει: «Τρεις φίλοι μου που έπαιζαν πολλές ώρες βιντεοπαιχνίδια είχαν χαμηλούς βαθμούς. Άρα τα βιντεοπαιχνίδια καταστρέφουν τις σχολικές επιδόσεις όλων των νέων.» Ποια είναι η βασική αδυναμία του συλλογισμού;`, options: ["Επαγωγική γενίκευση από πολύ λίγες, μη αντιπροσωπευτικές περιπτώσεις", "Είναι παραγωγικός με ψευδή μείζονα", "Είναι αναλογικός με επιφανειακή ομοιότητα", "Δεν έχει καθόλου συμπέρασμα"], correct: 0,
      hint: R`Από πόσες περιπτώσεις γενικεύει;`, sol: R`Είναι <b>επαγωγικός</b>, αλλά γενικεύει «για όλους» από τρία μόνο παραδείγματα: <b>βιαστική γενίκευση</b>, που αποδυναμώνει την πειθώ.` }
  ]
},
/* ───────────────────────────── 2.4 ───────────────────────────── */
{
  id: "2.4", unit: 2, title: "Ύφος κειμένου, σημεία στίξης και η λειτουργία τους, σκοπός του συγγραφέα",
  book: "Πίνακας προδιαγραφών 2026 · Κειμενικά είδη 6: Ύφος – τρόποι ανίχνευσης ύφους, σημεία στίξης και λειτουργία, σκοπός",
  intro: "Πώς αναγνωρίζουμε το ύφος ενός κειμένου, τι ρόλο παίζουν τα εισαγωγικά, η παρένθεση ή η άνω τελεία και πώς εξηγούμε τον σκοπό του συγγραφέα;",
  thumb: LETTER("« ; »"),
  theory: R`
<p>Το <b>ύφος</b> είναι ο <b>ιδιαίτερος τρόπος</b> με τον οποίο ένας πομπός χρησιμοποιεί τη γλώσσα — οι επιλογές του στο λεξιλόγιο, στη σύνταξη, στα σημεία στίξης, στο πρόσωπο των ρημάτων. Το ύφος εξαρτάται από το <b>επικοινωνιακό πλαίσιο</b>: ποιος γράφει, σε ποιον, για ποιον σκοπό, σε ποιο μέσο. Στις Παγκύπριες ζητείται να <b>χαρακτηρίσεις</b> το ύφος και να το <b>τεκμηριώσεις</b> με γλωσσικά στοιχεία, να εξηγήσεις τη <b>λειτουργία</b> ενός σημείου στίξης ή να προσδιορίσεις τον <b>σκοπό</b> του συγγραφέα.</p>
<div class="tbox def"><h4>Χαρακτηρισμοί ύφους και ενδείξεις</h4>
<table class="tbl"><tr><th>Ύφος</th><th>Τι το δείχνει</th></tr>
<tr><td><b>Επίσημο, σοβαρό</b></td><td>λόγιο ή επιστημονικό λεξιλόγιο, μακροπερίοδος λόγος, υπόταξη, γ΄ πρόσωπο, απρόσωπη σύνταξη, κυριολεξία</td></tr>
<tr><td><b>Οικείο, ανεπίσημο</b></td><td>καθημερινό λεξιλόγιο, α΄ και β΄ πρόσωπο, μικροπερίοδος λόγος, προφορικότητα, επιφωνήματα</td></tr>
<tr><td><b>Απλό, λιτό</b></td><td>σύντομες περίοδοι, κοινό λεξιλόγιο, λίγα επίθετα</td></tr>
<tr><td><b>Γλαφυρό, ζωντανό</b></td><td>εικόνες, μεταφορές, παρομοιώσεις, ποικιλία σύνταξης</td></tr>
<tr><td><b>Προσωπικό / απρόσωπο</b></td><td>α΄ πρόσωπο, προσωπικές εμπειρίες / γ΄ πρόσωπο, παθητική φωνή, απρόσωπες εκφράσεις</td></tr>
<tr><td><b>Ειρωνικό, χιουμοριστικό</b></td><td>εισαγωγικά με ειρωνική χροιά, υπερβολές, αντιφάσεις, παιχνίδια λέξεων</td></tr>
<tr><td><b>Συναισθηματικά φορτισμένο, δραματικό</b></td><td>θαυμαστικά, ρητορικά ερωτήματα, φορτισμένο λεξιλόγιο, αποσιωπητικά</td></tr></table></div>
<div class="tbox def"><h4>Σημεία στίξης και η λειτουργία τους</h4>
<table class="tbl"><tr><th>Σημείο</th><th>Συνήθεις λειτουργίες</th></tr>
<tr><td><b>« » εισαγωγικά</b></td><td>αυτούσια μεταφορά λόγων (παράθεμα) · <b>ειρωνεία</b> · έμφαση σε λέξη · νεολογισμός, ξένη ή ιδιωματική λέξη · μεταφορική χρήση · τίτλοι</td></tr>
<tr><td><b>( ) παρένθεση</b></td><td>επεξήγηση, διευκρίνιση, συμπλήρωση, παράδειγμα, σχόλιο του συγγραφέα</td></tr>
<tr><td><b>— παύλα / διπλή παύλα</b></td><td>απομόνωση σχολίου ή επεξήγησης με έμφαση · εναλλαγή προσώπων σε διάλογο</td></tr>
<tr><td><b>: άνω και κάτω τελεία</b></td><td>επεξήγηση ή ανάλυση αυτού που προηγείται · απαρίθμηση · εισαγωγή ευθέος λόγου</td></tr>
<tr><td><b>· άνω τελεία</b></td><td>χωρίζει στενά συνδεδεμένες προτάσεις· δηλώνει συμπέρασμα ή αντίθεση με μικρότερη παύση από την τελεία</td></tr>
<tr><td><b>… αποσιωπητικά</b></td><td>συγκίνηση, δισταγμός, υπαινιγμός, ειρωνεία, ελλειπτικός λόγος που ο αναγνώστης συμπληρώνει</td></tr>
<tr><td><b>! θαυμαστικό</b></td><td>έντονο συναίσθημα (θαυμασμό, έκπληξη, αγανάκτηση, ειρωνεία), προτροπή</td></tr>
<tr><td><b>; ερωτηματικό</b></td><td>πραγματική ερώτηση · <b>ρητορικό ερώτημα</b> (δεν περιμένει απάντηση· προβληματίζει ή εμπλέκει τον αναγνώστη)</td></tr></table></div>
<div class="tbox thm"><h4>Ο σκοπός του συγγραφέα</h4>
<p>Κάθε κείμενο υπηρετεί έναν ή περισσότερους σκοπούς: να <b>πληροφορήσει</b>, να <b>πείσει</b>, να <b>προβληματίσει</b>, να <b>ευαισθητοποιήσει</b>, να <b>κινητοποιήσει</b>, να <b>καταγγείλει</b>, να <b>ψυχαγωγήσει</b>. Όταν μια ερώτηση ζητά «τον σκοπό» μιας επιλογής (π.χ. ενός σημείου στίξης ή του μακροπερίοδου λόγου), <b>πάντα</b> συνδέουμε τη γλωσσική επιλογή με το <b>νόημα</b> του σημείου: «Με τα εισαγωγικά ο συγγραφέας αποστασιοποιείται ειρωνικά από τη λέξη “ανάπτυξη”, υπονοώντας ότι πρόκειται για καταστροφή του περιβάλλοντος».</p></div>
<div class="tbox ex"><h4>Χαρακτηρίζω ύφος και στίξη</h4>
${PASSAGE(`Μας λένε ότι η νέα μαρίνα θα φέρει «ανάπτυξη». Ποια ανάπτυξη, αλήθεια; Εκείνη που θα κλείσει την τελευταία ελεύθερη παραλία της περιοχής; Οι κάτοικοι — όσοι τουλάχιστον ρωτήθηκαν — ζητούν κάτι απλό: να μη θυσιαστεί ο τόπος τους για τα κέρδη λίγων… Δεν είναι πολλά!`, { title: "Παράγραφος εξάσκησης", source: "Πρωτότυπο κείμενο εξάσκησης" })}
<details class="steps"><summary>Λύση βήμα-βήμα</summary><ul><li><b>Ύφος</b>: συναισθηματικά φορτισμένο, ειρωνικό, προσωπικό (α΄ πληθυντικό «μας»), με προφορικότητα.</li><li><b>«ανάπτυξη»</b>: τα εισαγωγικά δείχνουν <b>ειρωνεία</b> — ο συγγραφέας αμφισβητεί ότι πρόκειται για πραγματική ανάπτυξη.</li><li><b>Ερωτηματικά</b>: ρητορικά ερωτήματα που προκαλούν τον προβληματισμό του αναγνώστη.</li><li><b>Διπλή παύλα</b>: απομονώνει σχόλιο με έμφαση (μόνο λίγοι ρωτήθηκαν).</li><li><b>Αποσιωπητικά</b>: υπαινιγμός και αγανάκτηση· <b>θαυμαστικό</b>: έντονο συναίσθημα.</li><li><b>Σκοπός</b>: να <b>καταγγείλει</b> το έργο και να <b>ευαισθητοποιήσει</b> τους αναγνώστες.</li></ul></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Χαρακτηρίζουμε το ύφος χωρίς να το <b>τεκμηριώσουμε</b> με γλωσσικά στοιχεία του κειμένου.</li><li>Γράφουμε για τα εισαγωγικά πάντα «αυτούσια μεταφορά» — δες αν η λέξη έχει ειρωνική ή μεταφορική χρήση.</li><li>Δίνουμε γενικό σκοπό («για να πείσει») χωρίς σύνδεση με το νόημα του συγκεκριμένου σημείου.</li></ul></div>
`,
  widget: "na1punct",
  gen: "na1gPunct",
  exercises: [
    { level: 1, type: "mc", q: R`«Οι λεγόμενοι “ειδικοί” της τηλεόρασης μας εξήγησαν, για πολλοστή φορά, τι πρέπει να φοβόμαστε.» Ποια είναι η λειτουργία των εισαγωγικών;`, options: ["Ειρωνεία", "Αυτούσια μεταφορά λόγων", "Τίτλος έργου", "Ξένη λέξη"], correct: 0,
      hint: R`Ο συγγραφέας πιστεύει πραγματικά ότι είναι ειδικοί;`, sol: R`Τα εισαγωγικά δηλώνουν <b>ειρωνεία</b>: ο συγγραφέας αμφισβητεί την ειδημοσύνη τους (το ενισχύουν το «λεγόμενοι» και το «για πολλοστή φορά»).` },
    { level: 1, type: "mc", q: R`«Η ενσυναίσθηση (η ικανότητα να κατανοούμε τα συναισθήματα του άλλου) καλλιεργείται από την παιδική ηλικία.» Ποια είναι η λειτουργία της παρένθεσης;`, options: ["Επεξήγηση όρου", "Ειρωνικό σχόλιο", "Εισαγωγή ευθέος λόγου", "Δήλωση δισταγμού"], correct: 0,
      hint: R`Τι περιέχει η παρένθεση σε σχέση με την προηγούμενη λέξη;`, sol: R`Η παρένθεση δίνει τον <b>ορισμό/επεξήγηση</b> του όρου «ενσυναίσθηση».` },
    { level: 1, type: "mc", q: R`Ένα κείμενο με καθημερινό λεξιλόγιο, α΄ και β΄ πρόσωπο, σύντομες περιόδους και επιφωνήματα έχει συνήθως ύφος:`, options: ["Οικείο, ανεπίσημο", "Επίσημο, επιστημονικό", "Απρόσωπο, τυπικό", "Λόγιο, αρχαΐζον"], correct: 0,
      hint: R`Συνδύασε τα γνωρίσματα: είδος λεξιλογίου, γραμματικό πρόσωπο, μήκος περιόδων — σε ποια περίσταση επικοινωνίας ταιριάζουν;`, sol: R`Αυτά είναι γνωρίσματα του <b>οικείου, ανεπίσημου</b> ύφους.` },
    { shuffle: true, level: 2, type: "mc", q: R`«Η λύση είναι μία: παιδεία, παιδεία και πάλι παιδεία.» Ποια είναι η λειτουργία της άνω και κάτω τελείας;`, options: ["Εισάγει επεξήγηση/ανάλυση αυτού που προηγείται", "Δηλώνει ειρωνεία", "Κλείνει ρητορικό ερώτημα", "Δηλώνει δισταγμό"], correct: 0,
      hint: R`Τι μας λέει το δεύτερο μέρος για «τη λύση»;`, sol: R`Η άνω και κάτω τελεία εισάγει την <b>επεξήγηση</b>: ποια είναι η λύση.` },
    { level: 2, type: "mc", q: R`«Και μετά… μετά δεν υπήρχε τίποτα πια να πούμε.» Τι δηλώνουν εδώ τα αποσιωπητικά;`, options: ["Συγκίνηση και δισταγμό", "Απαρίθμηση", "Αυτούσια μεταφορά λόγων", "Επεξήγηση όρου"], correct: 0,
      hint: R`Τι δείχνουν η διακοπή του λόγου και η επανάληψη της λέξης για την ψυχική κατάσταση του ομιλητή;`, sol: R`Τα αποσιωπητικά δείχνουν <b>συγκίνηση, δισταγμό</b>, μια παύση φορτισμένη συναισθηματικά.` },
    { level: 2, type: "mc", q: R`«Μέχρι πότε θα κάνουμε πως δεν βλέπουμε τη φτώχεια δίπλα μας;» Πώς χαρακτηρίζεται το ερώτημα και ποια η λειτουργία του;`, options: ["Ρητορικό ερώτημα που προβληματίζει και εμπλέκει τον αναγνώστη", "Πραγματική ερώτηση που περιμένει απάντηση", "Ερώτηση που εισάγει παράδειγμα", "Ερώτηση που δηλώνει άγνοια του συγγραφέα"], correct: 0,
      hint: R`Ο συγγραφέας περιμένει πράγματι απάντηση;`, sol: R`Είναι <b>ρητορικό ερώτημα</b>: δεν ζητά απάντηση, αλλά <b>προβληματίζει</b>, εκφράζει αγανάκτηση και εμπλέκει συναισθηματικά τον αναγνώστη.` },
    { level: 2, type: "mc", q: R`Ποιο από τα παρακάτω γνωρίσματα ΔΕΝ ταιριάζει σε επίσημο, σοβαρό ύφος;`, options: ["Επιφωνήματα και αργκό", "Λόγιο λεξιλόγιο", "Υπόταξη και μακροπερίοδος λόγος", "Απρόσωπη σύνταξη"], correct: 0,
      hint: R`Ποιο γνώρισμα ανήκει στον προφορικό, καθημερινό λόγο;`, sol: R`Τα <b>επιφωνήματα και η αργκό</b> ανήκουν σε οικείο, ανεπίσημο ύφος.` },
    { level: 3, type: "mc", q: R`Στην παράγραφο εξάσκησης για τη μαρίνα, ποιος είναι ο κύριος σκοπός του συγγραφέα;`, options: ["Να καταγγείλει το έργο και να ευαισθητοποιήσει τους αναγνώστες", "Να πληροφορήσει ουδέτερα για τα τεχνικά στοιχεία του έργου", "Να ψυχαγωγήσει τον αναγνώστη με αστεία", "Να διαφημίσει τη νέα μαρίνα"], correct: 0,
      hint: R`Πρόσεξε την ειρωνεία και τα ρητορικά ερωτήματα.`, sol: R`Η ειρωνεία, τα ρητορικά ερωτήματα και το θαυμαστικό δείχνουν ότι ο συγγραφέας θέλει να <b>καταγγείλει</b> και να <b>ευαισθητοποιήσει</b>.` },
    { level: 3, type: "mc", q: R`«Οι κάτοικοι — όσοι τουλάχιστον ρωτήθηκαν — ζητούν κάτι απλό.» Ποια είναι η λειτουργία της διπλής παύλας;`, options: ["Απομονώνει σχόλιο του συγγραφέα με έμφαση", "Δηλώνει εναλλαγή προσώπων σε διάλογο", "Εισάγει αυτούσια λόγια των κατοίκων", "Δηλώνει απαρίθμηση"], correct: 0,
      hint: R`Τι προσθέτει το κομμάτι ανάμεσα στις παύλες;`, sol: R`Η διπλή παύλα <b>απομονώνει ένα σχόλιο</b> με έμφαση: υπαινίσσεται ότι ρωτήθηκαν ελάχιστοι — κρυφή κριτική στη διαδικασία.` }
  ]
},
/* ───────────────────────────── 2.5 ───────────────────────────── */
{
  id: "2.5", unit: 2, title: "Κριτική τοποθέτηση και σχολιασμός θέσης σε 60–80 λέξεις",
  book: "Πίνακας προδιαγραφών 2026 · Κειμενικά είδη 7: Κριτική τοποθέτηση · Οδηγός διόρθωσης 2026, Α.Ι.5",
  intro: "Πώς σχολιάζουμε μια θέση του συγγραφέα σε 60–80 λέξεις, ώστε να παρουσιάσουμε τεκμηριωμένη άποψη και να πάρουμε όλες τις μονάδες;",
  thumb: LETTER("Σχόλιο"),
  theory: R`
<p>Η ερώτηση <b>κριτικής τοποθέτησης</b> ή <b>σχολιασμού θέσης</b> δίνει συνήθως μια φράση του κειμένου και ζητά να τη <b>σχολιάσεις</b> σε περιορισμένη έκταση (π.χ. <b>60–80 λέξεις</b>) — συχνά μαζί με ένα δεύτερο ζητούμενο, όπως «να παρουσιάσετε δύο άλλους παράγοντες» (Α.Ι.5, Παγκύπριες 2026, 5 μονάδες). Δεν είναι περίληψη ούτε μικρό δοκίμιο: είναι μια <b>σύντομη, τεκμηριωμένη άποψη</b>, γραμμένη σε μία συνεκτική παράγραφο.</p>
<div class="tbox def"><h4>Τι σημαίνει «σχολιάζω» μια θέση</h4>
<ol><li><b>Δείχνω ότι την κατάλαβα</b>: την αποδίδω σύντομα με δικά μου λόγια (μία πρόταση).</li>
<li><b>Παίρνω θέση</b>: συμφωνώ, διαφωνώ ή συμφωνώ μερικώς — με σαφήνεια.</li>
<li><b>Αιτιολογώ</b>: δίνω ένα ή δύο επιχειρήματα, ιδανικά με ένα σύντομο παράδειγμα από την πραγματικότητα.</li>
<li><b>Απαντώ στο δεύτερο ζητούμενο</b>, αν υπάρχει (π.χ. δύο παράγοντες, δύο τρόποι), με μια σύντομη εξήγηση για τον καθένα.</li></ol>
<p>Στον οδηγό διόρθωσης του 2026 ο σχολιασμός πήρε 2 μονάδες και οι δύο παράγοντες 3 (1,5 ο καθένας): η απλή αναφορά ενός παράγοντα χωρίς εξήγηση δεν παίρνει όλη τη μονάδα.</p></div>
<div class="tbox thm"><h4>Ένα σχήμα που δουλεύει</h4>
<p><b>Θέση</b> («Η άποψη ότι … είναι εύστοχη / εν μέρει εύστοχη, γιατί…») → <b>αιτιολόγηση</b> («Πράγματι, …») → <b>δεύτερο ζητούμενο</b> («Εκτός από …, καθοριστικό ρόλο παίζουν, κατά τη γνώμη μου, … , που … , και … , που …») → <b>κατακλείδα</b> με μία φράση. Γράφεις σε α΄ ενικό ή απρόσωπα, με σοβαρό ύφος.</p></div>
<div class="tbox ex"><h4>Παράδειγμα σε πρωτότυπη θέση</h4>
<p><b>Θέση:</b> «Τα μέσα κοινωνικής δικτύωσης δεν απομονώνουν τους νέους· απλώς αλλάζουν τον τρόπο που επικοινωνούν.» Να τη σχολιάσετε και να αναφέρετε δύο τρόπους με τους οποίους οι νέοι μπορούν να προστατευτούν από την υπερβολική χρήση τους (60–80 λέξεις).</p>
<details class="steps"><summary>Ενδεικτική απάντηση (66 λέξεις)</summary>
<p>Η θέση είναι εν μέρει εύστοχη. Πράγματι, τα μέσα κοινωνικής δικτύωσης κρατούν τους νέους σε επαφή με φίλους και ομάδες ενδιαφερόντων· όταν όμως υποκαθιστούν τη ζωντανή συνάντηση, οδηγούν σε επιφανειακές σχέσεις και μοναξιά. Για να προστατευτούν, οι νέοι μπορούν, πρώτον, να θέτουν όρια χρόνου, αξιοποιώντας τα εργαλεία ελέγχου του κινητού τους, και, δεύτερον, να επενδύουν σε δραστηριότητες με φυσική παρουσία, όπως ο αθλητισμός και ο εθελοντισμός.</p></details></div>
<div class="tbox tip"><h4>Χρήσιμες φράσεις</h4>
<ul><li>Συμφωνία: <i>Η άποψη αυτή είναι εύστοχη, καθώς… · Συντάσσομαι με τη θέση του συγγραφέα, αφού…</i></li>
<li>Μερική συμφωνία: <i>Η θέση ισχύει σε μεγάλο βαθμό, ωστόσο… · Δεν μπορεί να αγνοηθεί ότι…</i></li>
<li>Διαφωνία: <i>Η άποψη αυτή είναι υπεραπλουστευτική, γιατί… · Δύσκολα θα μπορούσε κανείς να δεχθεί ότι…</i></li></ul></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Αντί για σχόλιο γράφουμε <b>περίληψη</b> ή απλή επανάληψη της θέσης.</li><li>Δεν δηλώνουμε καθαρά αν συμφωνούμε ή διαφωνούμε.</li><li>Ξεχνάμε το δεύτερο ζητούμενο ή γράφουμε μόνο τις λέξεις «οικογένεια, σχολείο» χωρίς εξήγηση.</li><li>Ξεφεύγουμε από την έκταση (π.χ. 150 λέξεις) — η συντομία είναι μέρος της άσκησης.</li></ul></div>
`,
  widget: "na1crit",
  exercises: [
    { level: 1, type: "mc", q: R`Ποιο από τα παρακάτω ΔΕΝ ζητείται σε μια ερώτηση σχολιασμού θέσης;`, options: ["Η περίληψη όλου του κειμένου", "Η σαφής δήλωση συμφωνίας, διαφωνίας ή μερικής συμφωνίας", "Η αιτιολόγηση της άποψής μας", "Η απάντηση σε τυχόν δεύτερο ζητούμενο της εκφώνησης"], correct: 0,
      hint: R`Ο σχολιασμός αφορά μία θέση, όχι όλο το κείμενο.`, sol: R`Ο σχολιασμός εστιάζει στη <b>συγκεκριμένη θέση</b>: παίρνουμε θέση και την αιτιολογούμε. Η περίληψη είναι άλλη ερώτηση.` },
    { level: 1, type: "mc", q: R`Στον σχολιασμό θέσης επιτρέπεται να γράψουμε σε α΄ ενικό πρόσωπο («κατά τη γνώμη μου»).`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Η ερώτηση ζητά τη δική σου άποψη.`, sol: R`<b>ΣΩΣΤΟ.</b> Η εκφώνηση ζητά άποψη («κατά τη γνώμη σας»), άρα το α΄ πρόσωπο είναι αποδεκτό — με σοβαρό, όχι οικείο ύφος.` },
    { level: 1, q: R`Στον οδηγό διόρθωσης των Παγκυπρίων 2026 (Α.Ι.5), πόσες μονάδες πήρε συνολικά η ερώτηση σχολιασμού μαζί με τους δύο παράγοντες;`, fields: [{ label: "Μονάδες:", ans: 5 }],
      hint: R`Δες στη θεωρία πώς μοιράζει ο οδηγός τις μονάδες ανάμεσα στα δύο ζητούμενα.`, sol: R`2 + 3 = <b>5</b> μονάδες.` },
    { level: 2, type: "mc", q: R`Θέση: «Το διάβασμα βιβλίων είναι ξεπερασμένο στην εποχή του διαδικτύου.» Ποια αρχή σχολιασμού είναι η πιο κατάλληλη;`, options: ["«Η άποψη αυτή είναι υπεραπλουστευτική, γιατί το βιβλίο καλλιεργεί τη συγκέντρωση και τη βαθιά σκέψη, που η αποσπασματική ανάγνωση στο διαδίκτυο συχνά δεν προσφέρει.»", "«Ο συγγραφέας λέει ότι το διάβασμα βιβλίων είναι ξεπερασμένο στην εποχή του διαδικτύου.»", "«Δεν ξέρω, εξαρτάται.»", "«Το διαδίκτυο δημιουργήθηκε τη δεκαετία του 1990.»"], correct: 0,
      hint: R`Ψάχνουμε σαφή θέση + αιτιολόγηση.`, sol: R`Η σωστή αρχή δηλώνει <b>θέση</b> (διαφωνία) και δίνει <b>αιτιολόγηση</b>. Η απλή επανάληψη, η αοριστία και η άσχετη πληροφορία δεν αποτελούν σχολιασμό.` },
    { level: 2, type: "mc", q: R`Η εκφώνηση ζητά «δύο (2) άλλους παράγοντες» που επηρεάζουν τα καταναλωτικά πρότυπα. Ποια απάντηση είναι πλήρης;`, options: ["«…Η οικογένεια, γιατί οι γονείς λειτουργούν ως πρότυπα κατανάλωσης· και η παρέα, γιατί η ανάγκη αποδοχής ωθεί σε κοινές αγοραστικές συνήθειες.»", "«…Η οικογένεια και η παρέα.»", "«…Η οικογένεια, η παρέα, το σχολείο, η μόδα, η τεχνολογία, τα ΜΜΕ.»", "«…Η διαφήμιση και πάλι η διαφήμιση.»"], correct: 0,
      hint: R`Κάθε παράγοντας χρειάζεται εξήγηση και ζητούνται ακριβώς δύο.`, sol: R`Πλήρης = <b>δύο παράγοντες</b> + <b>σύντομη εξήγηση</b> για τον καθένα. Η σκέτη αναφορά δεν παίρνει όλη τη μονάδα· η μακριά λίστα δεν αναπτύσσει κανέναν· η διαφήμιση αποκλείεται από την εκφώνηση («άλλους»).` },
    { level: 2, type: "mc", q: R`Ποιο από τα παρακάτω είναι λάθος ύφους σε σχολιασμό θέσης για εξέταση;`, options: ["«Ε, καλά, αυτό είναι τελείως χαζό!»", "«Η άποψη αυτή είναι εν μέρει εύστοχη.»", "«Κατά τη γνώμη μου, ο παράγοντας αυτός είναι καθοριστικός.»", "«Δεν μπορεί, ωστόσο, να αγνοηθεί ότι…»"], correct: 0,
      hint: R`Ποια διατύπωση ανήκει στον προφορικό, οικείο λόγο;`, sol: R`Η φράση με το «Ε, καλά» και το «χαζό» έχει <b>οικείο, απαξιωτικό ύφος</b>, ακατάλληλο για εξέταση.` },
    { level: 3, q: R`Σε σχόλιο 60–80 λέξεων γράφεις εισαγωγική θέση 14 λέξεων και αιτιολόγηση 22 λέξεων. Πόσες λέξεις το πολύ σού μένουν για τα δύο σημεία του δεύτερου ζητούμενου, ώστε να μην ξεπεράσεις το όριο;`, fields: [{ label: "Λέξεις:", ans: 44 }],
      hint: R`Αφαίρεσε από το ανώτατο όριο όσες λέξεις έχεις ήδη χρησιμοποιήσει.`, sol: R`80 − 14 − 22 = <b>44</b> λέξεις, δηλαδή περίπου 20 λέξεις για κάθε σημείο με τη σύντομη εξήγησή του. Σχεδίασε την έκταση πριν γράψεις.` },
    { level: 3, type: "mc", q: R`Θέση: «Η τεχνολογία έκανε τη ζωή μας πιο εύκολη, αλλά όχι πιο ευτυχισμένη.» Ποια τοποθέτηση είναι η πιο ολοκληρωμένη για 60–80 λέξεις;`, options: ["Μερική συμφωνία: αναγνωρίζει τις διευκολύνσεις (υγεία, επικοινωνία), αλλά εξηγεί ότι η ευτυχία εξαρτάται από σχέσεις και νόημα, που η τεχνολογία δεν εγγυάται — με ένα παράδειγμα", "Μια λίστα με δέκα τεχνολογικά επιτεύγματα του αιώνα", "Μια περίληψη του κειμένου από το οποίο προέρχεται η θέση", "Μια ιστορία από το τελευταίο καλοκαίρι, χωρίς σύνδεση με τη θέση"], correct: 0,
      hint: R`Θέση – αιτιολόγηση – παράδειγμα, μέσα στο θέμα.`, sol: R`Η μερική συμφωνία με αιτιολόγηση και παράδειγμα <b>σχολιάζει</b> τη θέση. Οι άλλες επιλογές δεν παίρνουν θέση ή είναι εκτός θέματος.` },
    { level: 3, type: "mc", q: R`Γιατί ο οδηγός διόρθωσης δίνει μονάδες χωριστά για τον «σχολιασμό» και για τους «παράγοντες»;`, options: ["Γιατί πρόκειται για δύο διαφορετικά ζητούμενα, που πρέπει να απαντηθούν και τα δύο", "Γιατί οι παράγοντες είναι προαιρετικοί", "Γιατί ο σχολιασμός βαθμολογείται μόνο για την ορθογραφία", "Γιατί η έκταση δεν μετρά"], correct: 0,
      hint: R`Πρόσεξε τη λέξη «και» στην εκφώνηση.`, sol: R`Η εκφώνηση έχει <b>δύο ζητούμενα</b> (σχολιασμός + παράγοντες). Αν απαντήσεις μόνο το ένα, χάνεις τις μονάδες του άλλου — γι’ αυτό υπογράμμισε κάθε ρήμα της εκφώνησης.` }
  ]
},
/* ───────────────────────────── 2.6 ───────────────────────────── */
{
  id: "2.6", unit: 2, title: "Επικοινωνιακό πλαίσιο, κειμενικοί τύποι (επιχειρηματολογία, αφήγηση, περιγραφή) και κειμενικά είδη",
  book: "Πίνακας προδιαγραφών 2026 · Κειμενικοί τύποι 1–3 · Κειμενικά είδη 1 και 3: επικοινωνιακό και κοινωνικοπολιτισμικό πλαίσιο",
  intro: "Ποιος γράφει, σε ποιον, για ποιον σκοπό και σε ποιο είδος κειμένου; Πώς αναγνωρίζουμε επιχειρηματολογία, αφήγηση και περιγραφή μέσα σε ένα κείμενο;",
  thumb: LETTER("πομπός→δέκτης"),
  theory: R`
<p>Κάθε κείμενο γράφεται σε ένα συγκεκριμένο <b>επικοινωνιακό πλαίσιο</b>: κάποιος <b>πομπός</b> απευθύνεται σε κάποιον <b>δέκτη</b>, με συγκεκριμένο <b>σκοπό</b>, μέσα από ένα <b>μέσο</b> (εφημερίδα, ιστοσελίδα, εκδήλωση), σε μια συγκεκριμένη <b>περίσταση</b> και <b>εποχή</b> (ιστορικότητα). Από αυτά εξαρτώνται το <b>κειμενικό είδος</b> (άρθρο, δοκίμιο, επιστολή, ομιλία), ο <b>κειμενικός τύπος</b> που κυριαρχεί (επιχειρηματολογία, αφήγηση, περιγραφή) και το <b>ύφος</b>. Στις Παγκύπριες ζητείται να αναγνωρίσεις αυτά τα στοιχεία στο κείμενο της κατανόησης και να τα εφαρμόσεις στην παραγωγή λόγου.</p>
<div class="tbox def"><h4>Τα στοιχεία του επικοινωνιακού πλαισίου</h4>
<table class="tbl"><tr><th>Στοιχείο</th><th>Ερώτηση-κλειδί</th><th>Πού το βρίσκω</th></tr>
<tr><td>Πομπός</td><td>Ποιος γράφει; Με ποια ιδιότητα;</td><td>υπογραφή, πηγή, α΄ πρόσωπο, προσφώνηση</td></tr>
<tr><td>Δέκτης</td><td>Σε ποιον απευθύνεται;</td><td>προσφώνηση, β΄ πρόσωπο, ύφος, μέσο δημοσίευσης</td></tr>
<tr><td>Σκοπός</td><td>Τι θέλει να πετύχει;</td><td>θέση του συγγραφέα, προτροπές, συμπέρασμα</td></tr>
<tr><td>Μέσο – περίσταση</td><td>Πού και πότε δημοσιεύεται ή εκφωνείται;</td><td>πηγή, ημερομηνία, αναφορές στην περίσταση</td></tr>
<tr><td>Ιστορικότητα</td><td>Σε ποια εποχή γράφτηκε; Τι τη χαρακτηρίζει;</td><td>ημερομηνία, αναφορές σε γεγονότα, γλώσσα</td></tr></table></div>
<div class="tbox def"><h4>Οι τρεις κειμενικοί τύποι της ύλης</h4>
<ul><li><b>Επιχειρηματολογία</b>: ο πομπός διατυπώνει μια <b>θέση</b> και την <b>υποστηρίζει</b> με επιχειρήματα και τεκμήρια, καταλήγοντας σε <b>συμπέρασμα</b>. Γλώσσα: κρίσεις, αιτιολογικές και συμπερασματικές διαρθρωτικές λέξεις (<i>γιατί, επομένως</i>), συχνά ενεστώτας.</li>
<li><b>Αφήγηση</b>: παρουσιάζει <b>γεγονότα</b> σε χρονική σειρά (ποιος, τι, πού, πότε, πώς, γιατί). Γλώσσα: παρελθοντικοί χρόνοι (αόριστος, παρατατικός), χρονικές λέξεις (<i>αρχικά, ύστερα, τότε</i>), ρήματα δράσης.</li>
<li><b>Περιγραφή</b>: παρουσιάζει πώς είναι ένα πρόσωπο, ένας χώρος, ένα αντικείμενο ή μια κατάσταση. Γλώσσα: επίθετα, εικόνες, αισθητηριακές λεπτομέρειες, ρήματα κατάστασης.</li></ul>
<p>Στα επιχειρηματολογικά κείμενα η <b>αφήγηση</b> και η <b>περιγραφή</b> δεν μπαίνουν «για στολίδι»: λειτουργούν ως <b>μέσα πειθούς</b>. Ένα περιστατικό ή μια ζωντανή περιγραφή λειτουργεί ως τεκμήριο, προκαλεί συναίσθημα ή κάνει πιο απτή μια αφηρημένη ιδέα.</p></div>
<div class="tbox thm"><h4>Γνωρίσματα των κειμενικών ειδών (για αναγνώριση)</h4>
<table class="tbl"><tr><th>Είδος</th><th>Πομπός – δέκτης</th><th>Μορφικά στοιχεία</th></tr>
<tr><td><b>Άρθρο</b></td><td>αρθρογράφος → ευρύ κοινό εφημερίδας ή ιστοσελίδας</td><td>τίτλος (εκτός αν απαγορεύεται), επικαιρότητα, επιχειρηματολογία, συχνά γ΄ πρόσωπο ή α΄ πληθυντικό</td></tr>
<tr><td><b>Δοκίμιο</b></td><td>δοκιμιογράφος → καλλιεργημένος αναγνώστης</td><td>στοχαστικός λόγος, διαχρονικό θέμα, προσωπική ματιά, πυκνότητα ιδεών</td></tr>
<tr><td><b>Επιστολή</b></td><td>συγκεκριμένος αποστολέας → συγκεκριμένος παραλήπτης</td><td>τόπος – ημερομηνία, προσφώνηση, αποφώνηση, υπογραφή, β΄ πρόσωπο</td></tr>
<tr><td><b>Ομιλία</b></td><td>ομιλητής → συγκεκριμένο ακροατήριο σε περίσταση</td><td>προσφώνηση («Αγαπητοί συμμαθητές…»), αναφορά στην περίσταση, ευχαριστίες, προφορικότητα, ρητορικά ερωτήματα, έκκληση στο τέλος</td></tr></table>
<p>Η παραγωγή καθενός από τα είδη αυτά αναλύεται στην ενότητα 5.</p></div>
<div class="tbox ex"><h4>Αναγνωρίζω τον κειμενικό τύπο</h4>
${PASSAGE(`Πρωί του Νοεμβρίου. Η αίθουσα μυρίζει υγρασία. Τα τζάμια είναι θολά, τα θρανία παγωμένα, και στη γωνία ένα σπασμένο καλοριφέρ στέκει σιωπηλό σαν παλιό έπιπλο. Είκοσι πέντε μαθητές κρατούν τα μπουφάν τους κουμπωμένα μέχρι το τέλος του μαθήματος. Μπορεί κανείς, σε τέτοιες συνθήκες, να μιλά σοβαρά για «σχολείο του μέλλοντος»; Η επένδυση στις σχολικές υποδομές δεν είναι πολυτέλεια· είναι προϋπόθεση για κάθε μεταρρύθμιση.`, { title: "Παράγραφος εξάσκησης", source: "Πρωτότυπο κείμενο εξάσκησης" })}
<details class="steps"><summary>Λύση βήμα-βήμα</summary><p>Οι πρώτες περίοδοι είναι <b>περιγραφή</b> (επίθετα, αισθητηριακές λεπτομέρειες: μυρωδιά, θολά τζάμια, παγωμένα θρανία, παρομοίωση «σαν παλιό έπιπλο»). Λειτουργεί όμως ως <b>μέσο πειθούς</b>: κάνει απτή την ανάγκη για υποδομές και προκαλεί συναίσθημα. Ακολουθεί ρητορικό ερώτημα και η <b>θέση</b> του συγγραφέα — ο κυρίαρχος τύπος είναι η <b>επιχειρηματολογία</b>.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Χαρακτηρίζουμε «αφήγηση» κάθε κείμενο που έχει ένα παράδειγμα — ο κυρίαρχος τύπος κρίνεται από τον σκοπό.</li><li>Ξεχνάμε ότι η επιστολή και η ομιλία έχουν <b>προσφώνηση</b> και συγκεκριμένο δέκτη, που επηρεάζουν το ύφος.</li><li>Όταν ζητείται το επικοινωνιακό πλαίσιο, γράφουμε μόνο τον πομπό και ξεχνάμε δέκτη, σκοπό, μέσο.</li></ul></div>
`,
  widget: "na1genre",
  gen: "na1gGenre",
  exercises: [
    { level: 1, type: "mc", q: R`Ποιο κειμενικό είδος έχει υποχρεωτικά προσφώνηση, αποφώνηση και υπογραφή;`, options: ["Επιστολή", "Άρθρο", "Δοκίμιο", "Περίληψη"], correct: 0,
      hint: R`Σκέψου το κείμενο με συγκεκριμένο παραλήπτη.`, sol: R`Η <b>επιστολή</b> έχει τόπο – ημερομηνία, προσφώνηση, αποφώνηση και υπογραφή.` },
    { level: 1, type: "mc", q: R`Ποιοι ρηματικοί χρόνοι κυριαρχούν συνήθως στην αφήγηση γεγονότων;`, options: ["Αόριστος και παρατατικός", "Μέλλοντας και υποτακτική", "Μόνο ο ενεστώτας", "Προστακτική"], correct: 0,
      hint: R`Αφηγούμαστε κάτι που έγινε.`, sol: R`Η αφήγηση χρησιμοποιεί κυρίως <b>παρελθοντικούς χρόνους</b> (αόριστο για τα γεγονότα, παρατατικό για τη διάρκεια/το σκηνικό).` },
    { level: 1, type: "mc", q: R`Η περιγραφή σε ένα επιχειρηματολογικό κείμενο μπορεί να λειτουργεί ως μέσο πειθούς.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Δες τον πίνακα της ύλης: «Περιγραφή στην Επιχειρηματολογία ως μέσο πειθούς».`, sol: R`<b>ΣΩΣΤΟ.</b> Μια ζωντανή περιγραφή κάνει απτή την ιδέα, λειτουργεί ως τεκμήριο ή προκαλεί συναίσθημα.` },
    { level: 2, type: "mc", q: R`«Αγαπητοί συμμαθητές, αξιότιμε κύριε Διευθυντή, σας ευχαριστώ που βρίσκεστε σήμερα εδώ, στην εκδήλωση για την Παγκόσμια Ημέρα Περιβάλλοντος.» Από ποιο κειμενικό είδος προέρχεται η φράση;`, options: ["Ομιλία", "Άρθρο", "Δοκίμιο", "Επιστολή"], correct: 0,
      hint: R`Ακροατήριο, ευχαριστίες, περίσταση.`, sol: R`Προσφώνηση σε <b>ακροατήριο</b>, ευχαριστίες και αναφορά στην περίσταση: <b>ομιλία</b> (προσχεδιασμένος προφορικός λόγος).` },
    { level: 2, type: "mc", q: R`Στην παράγραφο εξάσκησης για τη σχολική αίθουσα, ποια είναι η λειτουργία της περιγραφής;`, options: ["Λειτουργεί ως μέσο πειθούς: κάνει απτή την ανάγκη για υποδομές και προκαλεί συναίσθημα", "Είναι απλό στολίδι χωρίς σχέση με τη θέση", "Αφηγείται την ιστορία ενός μαθητή", "Δίνει στατιστικά στοιχεία"], correct: 0,
      hint: R`Πού καταλήγει η παράγραφος;`, sol: R`Η περιγραφή προετοιμάζει τη <b>θέση</b> («η επένδυση στις υποδομές… είναι προϋπόθεση»): είναι <b>μέσο πειθούς</b>.` },
    { level: 2, type: "mc", q: R`Ποιο στοιχείο του επικοινωνιακού πλαισίου δηλώνει η ημερομηνία δημοσίευσης ενός κειμένου του 1980;`, options: ["Την ιστορικότητα του κειμένου", "Τον δέκτη", "Το κειμενικό είδος", "Τον τρόπο πειθούς"], correct: 0,
      hint: R`Σε ποια εποχή γράφτηκε;`, sol: R`Η ημερομηνία δείχνει την <b>ιστορικότητα</b>: τις συνθήκες της εποχής, που βοηθούν στην ερμηνεία του κειμένου.` },
    { level: 2, type: "mc", q: R`Ποιος είναι ο κυρίαρχος κειμενικός τύπος σε ένα κείμενο που διατυπώνει μια θέση, την υποστηρίζει με επιχειρήματα και καταλήγει σε συμπέρασμα;`, options: ["Επιχειρηματολογία", "Αφήγηση", "Περιγραφή", "Οδηγίες"], correct: 0,
      hint: R`Θέση – υποστήριξη – συμπέρασμα.`, sol: R`Αυτή είναι η δομή της <b>επιχειρηματολογίας</b>.` },
    { level: 3, type: "mc", q: R`Ένα κείμενο δημοσιεύεται σε εφημερίδα, έχει τίτλο, ασχολείται με ένα επίκαιρο ζήτημα και απευθύνεται στο ευρύ κοινό με επιχειρήματα. Ποιο είναι πιθανότατα το κειμενικό του είδος;`, options: ["Άρθρο", "Επιστολή", "Ομιλία", "Διήγημα"], correct: 0,
      hint: R`Μέσο: εφημερίδα · δέκτης: ευρύ κοινό · θέμα: επίκαιρο.`, sol: R`Επικαιρότητα, ευρύ κοινό, εφημερίδα, επιχειρηματολογία: <b>άρθρο</b>.` },
    { level: 3, type: "mc", q: R`Ποιο ζεύγος συνδέει σωστά κειμενικό είδος και χαρακτηριστικό ύφους;`, options: ["Ομιλία – προφορικότητα και άμεση απεύθυνση στο ακροατήριο", "Δοκίμιο – αργκό και επιφωνήματα", "Επίσημη επιστολή σε υπουργό – οικείο, φιλικό ύφος", "Άρθρο σε εφημερίδα – ποιητικός ελεύθερος στίχος"], correct: 0,
      hint: R`Ποιο ταιριάζει με την περίσταση;`, sol: R`Η <b>ομιλία</b> απευθύνεται σε ακροατήριο και έχει στοιχεία προφορικότητας (προσφωνήσεις, ρητορικά ερωτήματα, β΄ πρόσωπο). Τα υπόλοιπα ζεύγη είναι αταίριαστα.` }
  ]
},
/* ───────────────────────────── 3.1 ───────────────────────────── */
{
  id: "3.1", unit: 3, title: "Δομή κειμένου και παραγράφου: θεματική περίοδος, λεπτομέρειες, κατακλείδα",
  book: "Πίνακας προδιαγραφών 2026 · Οργάνωση λόγου – Δομή κειμένου 1–2: εξωτερικά και εσωτερικά δομικά στοιχεία, δομικά στοιχεία παραγράφου",
  intro: "Ποια είναι η δομή μιας παραγράφου και πώς βρίσκουμε τη θεματική περίοδο σε ένα κείμενο των Παγκυπρίων;",
  thumb: LETTER("§ δομή"),
  theory: R`
<p>Κάθε καλογραμμένο κείμενο έχει <b>δομή</b>: τα μέρη του διατάσσονται με λογική σειρά, ώστε ο αναγνώστης να παρακολουθεί χωρίς κόπο τη σκέψη του γράφοντος. Στις Παγκύπριες η δομή εξετάζεται με δύο τρόπους: στην <b>κατανόηση</b> (π.χ. «να εντοπίσετε τη θεματική περίοδο της 2ης παραγράφου», «να δώσετε πλαγιότιτλο σε κάθε παράγραφο») και στην <b>παραγωγή λόγου</b>, όπου το δικό σου κείμενο βαθμολογείται και για την οργάνωσή του. Διακρίνουμε τα <b>εξωτερικά</b> δομικά στοιχεία ολόκληρου του κειμένου και τα <b>εσωτερικά</b> δομικά στοιχεία κάθε παραγράφου.</p>
<div class="tbox def"><h4>Εξωτερικά δομικά στοιχεία κειμένου</h4>
<p>Είναι τα «ορατά» μέρη του κειμένου, που εξαρτώνται από τον <b>κειμενικό τύπο</b> (επιχειρηματολογία, αφήγηση, περιγραφή) και το <b>κειμενικό είδος</b> (άρθρο, επιστολή, δοκίμιο, ομιλία):</p>
<table class="tbl"><tr><th>Μέρος</th><th>Λειτουργία</th></tr>
<tr><td><b>Τίτλος</b></td><td>Δηλώνει συνοπτικά το θέμα και προσελκύει τον αναγνώστη (στο άρθρο, στο δοκίμιο). <i>Στις Παγκύπριες συνήθως ζητείται να μη γράψεις τίτλο.</i></td></tr>
<tr><td><b>Πρόλογος / εισαγωγή</b></td><td>Εισάγει στο θέμα, δηλώνει την αφορμή και τον σκοπό του κειμένου.</td></tr>
<tr><td><b>Κύριο μέρος</b></td><td>Αναπτύσσει τις θέσεις σε παραγράφους· κάθε παράγραφος έχει έναν άξονα.</td></tr>
<tr><td><b>Επίλογος</b></td><td>Ανακεφαλαιώνει, συμπεραίνει ή κάνει έκκληση/προτροπή.</td></tr></table>
<p>Ορισμένα είδη έχουν <b>δικά τους</b> εξωτερικά στοιχεία: η <b>επιστολή</b> τόπο και ημερομηνία, <b>προσφώνηση</b> («Αγαπητέ κύριε Διευθυντά,») και <b>αποφώνηση</b> («Με εκτίμηση,»)· η <b>ομιλία</b> <b>προσφώνηση ακροατηρίου</b> («Αξιότιμε κύριε Δήμαρχε, αγαπητοί συμμαθητές,») και <b>αποφώνηση</b> («Σας ευχαριστώ για την προσοχή σας»).</p></div>
<div class="tbox def"><h4>Δομικά στοιχεία παραγράφου</h4>
<p>Η <b>παράγραφος</b> είναι ένα τμήμα του κειμένου που αναπτύσσει <b>μία κεντρική ιδέα</b>. Ξεκινά με εσοχή και αποτελείται από τρία μέρη:</p>
<table class="tbl"><tr><th>Μέρος</th><th>Τι κάνει</th></tr>
<tr><td><b>Θεματική περίοδος</b></td><td>Δηλώνει περιληπτικά το θέμα (την κεντρική ιδέα) της παραγράφου. Συνήθως είναι η πρώτη περίοδος, αλλά μπορεί να βρίσκεται και στη μέση ή στο τέλος (ιδίως όταν η παράγραφος οργανώνεται <i>επαγωγικά</i>, από τα παραδείγματα στο γενικό συμπέρασμα).</td></tr>
<tr><td><b>Λεπτομέρειες / σχόλια</b></td><td>Αναπτύσσουν τη θεματική περίοδο: την εξηγούν, την αιτιολογούν, δίνουν παραδείγματα, συγκρίνουν… (βλ. ενότητα 3.2 «Τρόποι ανάπτυξης»).</td></tr>
<tr><td><b>Κατακλείδα</b></td><td>Κλείνει την παράγραφο ανακεφαλαιώνοντας ή βγάζοντας συμπέρασμα. <b>Δεν είναι υποχρεωτική</b>.</td></tr></table></div>
<div class="tbox ex"><h4>Ανάλυση παραγράφου</h4>
${PASSAGE(`Η ανάγνωση λογοτεχνίας καλλιεργεί την ενσυναίσθηση. Ο αναγνώστης ζει, για λίγες ώρες, μέσα στη σκέψη ενός ήρωα που μπορεί να είναι εντελώς διαφορετικός από τον ίδιο. Νιώθει τον φόβο του, καταλαβαίνει τα κίνητρά του, συμμερίζεται τον πόνο του. Έτσι, μαθαίνει να κατανοεί και τους ανθρώπους της πραγματικής ζωής πριν τους κρίνει.`, { title: "Πρωτότυπο κείμενο εξάσκησης" })}
<details class="steps"><summary>Λύση βήμα-βήμα</summary>
<p><b>Θεματική περίοδος:</b> «Η ανάγνωση λογοτεχνίας καλλιεργεί την ενσυναίσθηση.» — δηλώνει την κεντρική ιδέα.</p>
<p><b>Λεπτομέρειες:</b> οι δύο επόμενες περίοδοι εξηγούν <i>πώς</i> συμβαίνει αυτό (ο αναγνώστης «ζει» τη θέση του ήρωα).</p>
<p><b>Κατακλείδα:</b> «Έτσι, μαθαίνει να κατανοεί…» — βγάζει το συμπέρασμα (προσέξτε τη διαρθρωτική λέξη <i>Έτσι</i>).</p>
<p><b>Πλαγιότιτλος:</b> «Η λογοτεχνία ως σχολείο ενσυναίσθησης».</p></details></div>
<div class="tbox thm"><h4>Πώς δίνουμε πλαγιότιτλο</h4>
<p>Ο <b>πλαγιότιτλος</b> αποδίδει σε λίγες λέξεις την κεντρική ιδέα μιας παραγράφου. Προτιμάμε <b>ονοματική φράση</b> (π.χ. «Τα οφέλη του εθελοντισμού για τους νέους»), όχι ολόκληρη πρόταση, και αποφεύγουμε να αντιγράφουμε αυτούσια τη θεματική περίοδο. Ένας καλός πλαγιότιτλος καλύπτει <b>όλη</b> την παράγραφο — ούτε μόνο ένα παράδειγμα της ούτε κάτι γενικότερο από αυτήν.</p></div>
<div class="tbox rem"><h4>Συνοχή μέσα στο κείμενο</h4>
<p>Οι παράγραφοι δεν στέκονται απομονωμένες. Συνδέονται με <b>διαρθρωτικές λέξεις</b> («Επιπλέον», «Από την άλλη πλευρά», «Συνοψίζοντας»), με επανάληψη λέξεων-κλειδιών ή με μια περίοδο-«γέφυρα» στην αρχή της επόμενης παραγράφου. Αυτό θα το δούμε αναλυτικά στην ενότητα 3.3.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Θεωρούμε <b>αυτόματα</b> θεματική περίοδο την πρώτη περίοδο: διάβασε πρώτα ολόκληρη την παράγραφο και ρώτα «ποια πρόταση τα λέει όλα συνοπτικά;».</li>
<li>Δίνουμε για πλαγιότιτλο ολόκληρη πρόταση ή αντιγράφουμε φράση του κειμένου.</li>
<li>Στη δική μας έκθεση γράφουμε παραγράφους χωρίς θεματική περίοδο ή με δύο διαφορετικές ιδέες στην ίδια παράγραφο.</li>
<li>Ξεχνάμε την προσφώνηση/αποφώνηση στην επιστολή και στην ομιλία — είναι στοιχεία του κειμενικού είδους που βαθμολογούνται.</li></ul></div>
`,
  widget: "na3par",
  gen: "na3gpar",
  exercises: [
    { level: 1, type: "mc", q: R`Τι είναι η <b>θεματική περίοδος</b> μιας παραγράφου;`, options: ["Η περίοδος που δηλώνει περιληπτικά την κεντρική ιδέα της παραγράφου", "Η περίοδος που περιέχει τα περισσότερα παραδείγματα", "Η περίοδος που κλείνει την παράγραφο με συμπέρασμα", "Η μεγαλύτερη σε έκταση περίοδος της παραγράφου"], correct: 0,
      hint: R`Σκέψου ποιο μέρος της παραγράφου «προαναγγέλλει» το θέμα της.`, sol: R`Η θεματική περίοδος δηλώνει συνοπτικά το θέμα· οι λεπτομέρειες την αναπτύσσουν και η κατακλείδα (αν υπάρχει) την ολοκληρώνει.` },
    { level: 1, type: "mc", q: R`Η θεματική περίοδος βρίσκεται <b>πάντοτε</b> στην αρχή της παραγράφου.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι γίνεται όταν μια παράγραφος ξεκινά από παραδείγματα και καταλήγει σε γενίκευση;`, sol: R`ΛΑΘΟΣ. Συνήθως είναι η αρχική περίοδος, μπορεί όμως να βρίσκεται και στη μέση ή στο τέλος — π.χ. σε παράγραφο που οργανώνεται επαγωγικά (από τα επιμέρους στο γενικό).` },
    { level: 1, type: "mc", q: R`Κάθε παράγραφος πρέπει υποχρεωτικά να κλείνει με κατακλείδα.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ποιο από τα τρία δομικά στοιχεία της παραγράφου είναι προαιρετικό;`, sol: R`ΛΑΘΟΣ. Η κατακλείδα δεν είναι υποχρεωτική· πολλές παράγραφοι τελειώνουν με την τελευταία λεπτομέρεια.` },
    { level: 1, type: "mc", q: R`Ποιο από τα παρακάτω είναι εξωτερικό δομικό στοιχείο που χαρακτηρίζει ειδικά την <b>επιστολή</b>;`, options: ["Η προσφώνηση και η αποφώνηση", "Ο πρόλογος", "Οι παράγραφοι του κύριου μέρους", "Η θεματική περίοδος"], correct: 0,
      hint: R`Ποιο στοιχείο υπάρχει στην επιστολή αλλά όχι σε ένα άρθρο εφημερίδας;`, sol: R`Η <b>προσφώνηση</b> (π.χ. «Αξιότιμε κύριε Υπουργέ,») και η <b>αποφώνηση</b> (π.χ. «Με εκτίμηση,» και υπογραφή) είναι τυπικά στοιχεία της επιστολής. Πρόλογο, κύριο μέρος και παραγράφους έχουν όλα τα κειμενικά είδη.` },
    { level: 2, q: R`Το παρακάτω πρωτότυπο κείμενο εξάσκησης έχει πέντε παραγράφους. Πόσες από αυτές ανήκουν στο <b>κύριο μέρος</b>;${PASSAGE(`Τα τελευταία χρόνια γίνεται πολύς λόγος για τον εθελοντισμό. Τι κερδίζει όμως ένας νέος όταν προσφέρει εθελοντικά τον χρόνο του;

Καταρχάς, ο εθελοντισμός καλλιεργεί την ενσυναίσθηση, αφού ο νέος έρχεται σε επαφή με ανθρώπους που δοκιμάζονται.

Επιπλέον, αναπτύσσει δεξιότητες συνεργασίας και οργάνωσης, πολύτιμες σε κάθε επάγγελμα.

Τέλος, η εθελοντική δράση δίνει στον νέο την αίσθηση ότι είναι χρήσιμος και ότι μπορεί να αλλάξει κάτι γύρω του.

Συνοψίζοντας, ο εθελοντισμός είναι σχολείο ζωής. Ας μην περιμένουμε να μας το ζητήσει κάποιος· ας κάνουμε εμείς το πρώτο βήμα.`, { num: "par" })}`, fields: [{ label: "Παράγραφοι κύριου μέρους:", ans: 3 }],
      hint: R`Βρες ποια παράγραφος εισάγει το θέμα και ποια κλείνει το κείμενο.`, sol: R`§1 = πρόλογος (θέτει το ερώτημα), §2–§4 = κύριο μέρος (τρία οφέλη, με «Καταρχάς – Επιπλέον – Τέλος»), §5 = επίλογος («Συνοψίζοντας» + προτροπή). Άρα <b>3</b> παράγραφοι.` },
    { level: 2, type: "mc", shuffle: true, q: R`Ποιος είναι ο καταλληλότερος <b>πλαγιότιτλος</b> για την παράγραφο;${PASSAGE(`Τα παιδιά βλέπουν καθημερινά εκατοντάδες διαφημιστικά μηνύματα στις οθόνες τους. Πολλά από αυτά παρουσιάζουν ένα παιχνίδι ή ένα σνακ ως εισιτήριο για τη χαρά και την αποδοχή από τους φίλους. Το παιδί όμως δεν έχει ακόμη αναπτύξει τα κριτήρια για να αναγνωρίσει την πειθώ που κρύβεται πίσω από τις εικόνες. Για τους λόγους αυτούς, η διαφήμιση που απευθύνεται σε ανηλίκους χρειάζεται αυστηρότερους κανόνες.`)}`,
      options: ["Η ανάγκη αυστηρότερων κανόνων για τη διαφήμιση που απευθύνεται σε παιδιά", "Τα παιδιά και οι οθόνες", "Τα σνακ στη διαφήμιση", "Η διαφήμιση ως μέσο ενημέρωσης των καταναλωτών"], correct: 0,
      hint: R`Βρες πρώτα τη θεματική περίοδο — όπου κι αν βρίσκεται — και διάλεξε τον τίτλο που καλύπτει ολόκληρη την παράγραφο, όχι μόνο μια λεπτομέρειά της.`, sol: R`Η θεματική περίοδος είναι η τελευταία («η διαφήμιση που απευθύνεται σε ανηλίκους χρειάζεται αυστηρότερους κανόνες»)· οι προηγούμενες περίοδοι είναι οι αιτίες που την τεκμηριώνουν. Οι άλλοι πλαγιότιτλοι είναι είτε πολύ γενικοί («Τα παιδιά και οι οθόνες») είτε αφορούν μια λεπτομέρεια είτε δεν αντιστοιχούν στο περιεχόμενο.` },
    { level: 2, q: R`Στην παρακάτω παράγραφο, <b>σε ποια περίοδο</b> (γράψε τον αριθμό της: 1, 2, 3 ή 4) βρίσκεται η θεματική περίοδος;${PASSAGE(`(1) Κάθε εβδομάδα, εκατοντάδες ενήλικες ξεκινούν τρέξιμο, ποδηλασία ή κολύμβηση. (2) Λίγους μήνες αργότερα, αναφέρουν καλύτερο ύπνο, περισσότερη ενέργεια και λιγότερο άγχος. (3) Οι γιατροί επιβεβαιώνουν ότι οι ασκούμενοι επισκέπτονται σπανιότερα το ιατρείο. (4) Είναι φανερό ότι η συστηματική άσκηση αποτελεί την πιο φθηνή και αποτελεσματική επένδυση στην υγεία.`)}`, fields: [{ label: "Αριθμός περιόδου:", ans: 4 }],
      hint: R`Ποια περίοδος είναι γενίκευση και ποιες είναι επιμέρους στοιχεία που οδηγούν σε αυτήν;`, sol: R`Η περίοδος <b>(4)</b>: είναι η γενική θέση στην οποία καταλήγουν τα επιμέρους στοιχεία των περιόδων (1)–(3). Η παράγραφος οργανώνεται <b>επαγωγικά</b>, γι' αυτό η θεματική περίοδος βρίσκεται στο τέλος.` },
    { level: 2, type: "mc", q: R`Ποια είναι η λειτουργία της κατακλείδας σε μια παράγραφο;`, options: ["Ανακεφαλαιώνει ή βγάζει συμπέρασμα από όσα αναπτύχθηκαν", "Εισάγει ένα νέο, διαφορετικό θέμα", "Παραθέτει το πιο δυνατό παράδειγμα", "Ορίζει τους όρους που θα χρησιμοποιηθούν"], correct: 0,
      hint: R`Η κατακλείδα «κλείνει»· δεν ανοίγει κάτι νέο.`, sol: R`Η κατακλείδα συνοψίζει ή συμπεραίνει, συχνά με διαρθρωτικές λέξεις όπως «επομένως», «έτσι», «γι' αυτό». Δεν εισάγει νέα ιδέα — αυτό θα χαλούσε τη συνοχή της παραγράφου.` },
    { level: 3, type: "mc", q: R`Θέμα τύπου Παγκυπρίων: Στην παράγραφο ποια περίοδος αποτελεί την <b>κατακλείδα</b>;${PASSAGE(`Η ευτυχία δεν αγοράζεται, όσο κι αν η κοινωνία μάς ωθεί να αγοράζουμε συνεχώς. Οι βιτρίνες αλλάζουν κάθε εβδομάδα, οι προσφορές λήγουν «σήμερα» και κάθε νέο μοντέλο υπόσχεται να κάνει τη ζωή μας καλύτερη. Ωστόσο, οι έρευνες δείχνουν ότι η ικανοποίηση από μια αγορά διαρκεί ελάχιστα. Ίσως, λοιπόν, η ευτυχία βρίσκεται λιγότερο στα πράγματα και περισσότερο στις σχέσεις και στις εμπειρίες.`, { title: "Πρωτότυπο κείμενο εξάσκησης" })}`,
      options: ["«Ίσως, λοιπόν, η ευτυχία βρίσκεται λιγότερο στα πράγματα…»", "«Η ευτυχία δεν αγοράζεται, όσο κι αν η κοινωνία μάς ωθεί να αγοράζουμε συνεχώς.»", "«Ωστόσο, οι έρευνες δείχνουν ότι η ικανοποίηση από μια αγορά διαρκεί ελάχιστα.»", "«Οι βιτρίνες αλλάζουν κάθε εβδομάδα…»"], correct: 0,
      hint: R`Ψάξε τη διαρθρωτική λέξη που εισάγει συμπέρασμα.`, sol: R`Η περίοδος με το συμπερασματικό «λοιπόν» κλείνει την παράγραφο με συμπέρασμα. Η περίοδος «Η ευτυχία δεν αγοράζεται…» είναι η θεματική περίοδος, ενώ οι άλλες δύο είναι λεπτομέρειες (παραδείγματα και αντίθεση με «Ωστόσο»).` }
  ]
},
/* ───────────────────────────── 3.2 ───────────────────────────── */
{
  id: "3.2", unit: 3, title: "Τρόποι ανάπτυξης παραγράφου: αιτιολόγηση, παραδείγματα, σύγκριση, αναλογία, διαίρεση, ορισμός",
  book: "Πίνακας προδιαγραφών 2026 · Οργάνωση λόγου 3: Τρόποι ανάπτυξης παραγράφου",
  intro: "Με ποιους τρόπους αναπτύσσεται μια παράγραφος και πώς τους αναγνωρίζουμε σε ένα κείμενο;",
  thumb: LETTER("Ανάπτυξη"),
  theory: R`
<p>Μετά τη θεματική περίοδο, ο συγγραφέας πρέπει να <b>αναπτύξει</b> την ιδέα του. Ο τρόπος με τον οποίο το κάνει λέγεται <b>τρόπος ανάπτυξης παραγράφου</b>. Ο πίνακας προδιαγραφών των Παγκυπρίων ορίζει επτά τρόπους: <b>αιτιολόγηση, παραδείγματα, σύγκριση – αντίθεση, αναλογία, διαίρεση, αίτιο – αποτέλεσμα και ορισμό</b>. Στις εξετάσεις ζητείται συνήθως να αναγνωρίσεις τον τρόπο ανάπτυξης και να <b>τεκμηριώσεις</b> την απάντησή σου με στοιχεία από το κείμενο· στην παραγωγή λόγου, η ποικιλία τρόπων κάνει την έκθεσή σου πιο πειστική.</p>
<table class="tbl"><tr><th>Τρόπος</th><th>Τι κάνει ο συγγραφέας</th><th>Ενδείξεις (όχι πάντα)</th></tr>
<tr><td><b>Αιτιολόγηση</b></td><td>Απαντά στο «γιατί;» της θεματικής περιόδου.</td><td>γιατί, επειδή, διότι, αφού, ο λόγος είναι</td></tr>
<tr><td><b>Παραδείγματα</b></td><td>Στηρίζει τη γενική θέση με συγκεκριμένες περιπτώσεις.</td><td>για παράδειγμα, λόγου χάρη, όπως, συγκεκριμένα</td></tr>
<tr><td><b>Σύγκριση – αντίθεση</b></td><td>Εξετάζει δύο έννοιες ως προς ομοιότητες/διαφορές, με κοινά κριτήρια.</td><td>ενώ, αντίθετα, από την άλλη, όμοια, απεναντίας</td></tr>
<tr><td><b>Αναλογία</b></td><td>Φωτίζει μια αφηρημένη ιδέα μέσα από μια γνωστή εικόνα άλλου πεδίου.</td><td>όπως ακριβώς… έτσι και…, μοιάζει με, σαν</td></tr>
<tr><td><b>Διαίρεση</b></td><td>Χωρίζει μια έννοια σε είδη/κατηγορίες με ένα κριτήριο.</td><td>διακρίνεται σε, χωρίζεται σε, υπάρχουν… είδη</td></tr>
<tr><td><b>Αίτιο – αποτέλεσμα</b></td><td>Παρουσιάζει τις αιτίες ενός φαινομένου και τις συνέπειές του.</td><td>με αποτέλεσμα, οδηγεί σε, προκαλεί, συνεπώς</td></tr>
<tr><td><b>Ορισμός</b></td><td>Προσδιορίζει το περιεχόμενο μιας έννοιας.</td><td>είναι, ονομάζεται, ορίζεται ως, εννοούμε</td></tr></table>
<div class="tbox def"><h4>Ο ορισμός και τα μέρη του</h4>
<p>Ένας λογικός ορισμός έχει τρία μέρη: την <b>οριστέα έννοια</b> (αυτή που ορίζουμε), το <b>γένος</b> (την ευρύτερη κατηγορία στην οποία ανήκει) και την <b>ειδοποιό διαφορά</b> (το γνώρισμα που τη διακρίνει από τις άλλες έννοιες του ίδιου γένους).</p>
<p>Π.χ. «<b>Εθελοντισμός</b> ονομάζεται η <i>ανιδιοτελής</i> <u>προσφορά χρόνου και εργασίας</u> <i>προς όφελος του συνόλου, χωρίς υλική ανταμοιβή</i>.» → οριστέα έννοια (έντονα): <b>εθελοντισμός</b> · γένος (υπογραμμισμένο): <u>προσφορά χρόνου και εργασίας</u> · ειδοποιός διαφορά (πλάγια): <i>ανιδιοτελής, προς όφελος του συνόλου, χωρίς υλική ανταμοιβή</i>.</p></div>
<div class="tbox def"><h4>Η διαίρεση και τα μέρη της</h4>
<p>Στη διαίρεση υπάρχουν: η <b>διαιρετέα έννοια</b> (αυτή που χωρίζουμε), η <b>διαιρετική βάση</b> (το κριτήριο) και τα <b>μέλη της διαίρεσης</b> (τα είδη που προκύπτουν). Π.χ. «Η διαφήμιση, <i>ανάλογα με τον σκοπό της</i>, διακρίνεται σε <i>εμπορική</i> και <i>κοινωνική</i>.» — διαιρετέα έννοια: διαφήμιση · βάση: ο σκοπός · μέλη: εμπορική, κοινωνική.</p></div>
<div class="tbox thm"><h4>Σύγκριση ή αναλογία;</h4>
<p>Στη <b>σύγκριση – αντίθεση</b> τα δύο μέλη ανήκουν στην <b>ίδια κατηγορία</b> και εξετάζονται εξίσου (το έντυπο και το ηλεκτρονικό βιβλίο). Στην <b>αναλογία</b> τα δύο μέλη ανήκουν σε <b>διαφορετικά πεδία</b>· το ένα, γνωστό και συγκεκριμένο, χρησιμοποιείται μόνο για να φωτίσει το άλλο (η παιδεία είναι <i>σαν</i> το θεμέλιο ενός σπιτιού).</p></div>
<div class="tbox ex"><h4>Αναγνώριση και τεκμηρίωση</h4>
${PASSAGE(`Η δημοκρατία χρειάζεται συνεχή φροντίδα, όπως ακριβώς ένας κήπος. Αν ο κηπουρός σταματήσει να ποτίζει και να ξεριζώνει τα αγριόχορτα, τα λουλούδια μαραίνονται· αν οι πολίτες αδιαφορήσουν, οι θεσμοί φθείρονται.`, { title: "Πρωτότυπο κείμενο εξάσκησης" })}
<details class="steps"><summary>Ενδεικτική απάντηση</summary>
<p>Η παράγραφος αναπτύσσεται με <b>αναλογία</b>. Η αφηρημένη έννοια της δημοκρατίας φωτίζεται μέσα από μια οικεία εικόνα από άλλο πεδίο, τον κήπο («όπως ακριβώς ένας κήπος»). Στον κηπουρό αντιστοιχούν οι πολίτες και στα λουλούδια που μαραίνονται οι θεσμοί που φθείρονται. Με την αναλογία ο συγγραφέας κάνει το νόημα πιο παραστατικό και κατανοητό.</p></details></div>
<div class="tbox rem"><h4>Συνδυασμός τρόπων</h4>
<p>Πολλές παράγραφοι αναπτύσσονται με <b>συνδυασμό</b> τρόπων (π.χ. ορισμός και παραδείγματα, αιτιολόγηση και παραδείγματα). Στις εξετάσεις ονόμασε τον τρόπο που κυριαρχεί — ή και τους δύο, αν ζητείται — και τεκμηρίωσε κάθε απάντηση με αναφορά στο κείμενο.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Αναγνωρίζουμε τον τρόπο μόνο από μια διαρθρωτική λέξη: το «γιατί» δεν σημαίνει πάντα αιτιολόγηση της θεματικής περιόδου, και πολλές παράγραφοι με παραδείγματα δεν έχουν το «για παράδειγμα».</li>
<li>Γράφουμε μόνο τον όρο χωρίς <b>τεκμηρίωση</b> («αιτιολόγηση» — και τίποτε άλλο). Η τεκμηρίωση βαθμολογείται.</li>
<li>Μπερδεύουμε την <b>αιτιολόγηση</b> (στηρίζει μια θέση με λόγους) με το <b>αίτιο – αποτέλεσμα</b> (εξηγεί πώς ένα φαινόμενο προκαλεί άλλα).</li>
<li>Μπερδεύουμε την αναλογία με τη σύγκριση (δες το πλαίσιο «Σύγκριση ή αναλογία;»).</li></ul></div>
`,
  widget: "na3dev",
  gen: "na3gdev",
  exercises: [
    { level: 1, type: "mc", q: R`Στον ορισμό «Δημοκρατία είναι το <u>πολίτευμα</u> στο οποίο η εξουσία πηγάζει από τον λαό», η υπογραμμισμένη λέξη αποτελεί…`, options: ["το γένος", "την οριστέα έννοια", "την ειδοποιό διαφορά", "τη διαιρετική βάση"], correct: 0,
      hint: R`Σε ποια ευρύτερη κατηγορία ανήκει η δημοκρατία;`, sol: R`Η δημοκρατία είναι ένα είδος <b>πολιτεύματος</b> → <b>γένος</b>. Οριστέα έννοια είναι η «δημοκρατία» και ειδοποιός διαφορά το «στο οποίο η εξουσία πηγάζει από τον λαό».` },
    { level: 1, q: R`Ποια είναι η <b>οριστέα έννοια</b> στον ορισμό «Με τον όρο ψηφιακός γραμματισμός εννοούμε την ικανότητα να αξιολογούμε κριτικά τις πληροφορίες του διαδικτύου»;`, fields: [{ label: "Οριστέα έννοια:", ans: ["ψηφιακός γραμματισμός", "ο ψηφιακός γραμματισμός", "ψηφιακος γραμματισμος"], text: true, nopunct: true }],
      hint: R`Ποια έννοια εξηγείται στον ορισμό;`, sol: R`Οριστέα έννοια: <b>ψηφιακός γραμματισμός</b> · γένος: η ικανότητα · ειδοποιός διαφορά: να αξιολογούμε κριτικά τις πληροφορίες του διαδικτύου.` },
    { level: 1, type: "mc", q: R`Στη διαίρεση «Οι πηγές ενέργειας, ανάλογα με το αν εξαντλούνται, χωρίζονται σε ανανεώσιμες και μη ανανεώσιμες», ποια είναι η <b>διαιρετική βάση</b>;`, options: ["Το αν εξαντλούνται", "Οι πηγές ενέργειας", "Οι ανανεώσιμες πηγές", "Οι μη ανανεώσιμες πηγές"], correct: 0,
      hint: R`Η διαιρετική βάση είναι το κριτήριο με το οποίο χωρίζουμε.`, sol: R`Διαιρετέα έννοια: οι πηγές ενέργειας · <b>διαιρετική βάση</b>: το αν εξαντλούνται · μέλη: ανανεώσιμες και μη ανανεώσιμες.` },
    { level: 2, type: "mc", q: R`Με ποιον κύριο τρόπο αναπτύσσεται η παράγραφος;${PASSAGE(`Η γνώση μιας ξένης γλώσσας είναι σήμερα απαραίτητη. Κι αυτό γιατί οι περισσότερες επιστημονικές πηγές γράφονται σε άλλες γλώσσες, οι επιχειρήσεις συνεργάζονται με εταίρους από όλο τον κόσμο και ο νέος που ταξιδεύει ή σπουδάζει στο εξωτερικό χρειάζεται να επικοινωνεί χωρίς μεσάζοντες.`)}`, options: ["Αιτιολόγηση", "Ορισμός", "Αναλογία", "Διαίρεση"], correct: 0,
      hint: R`Οι λεπτομέρειες απαντούν σε κάποιο ερώτημα για τη θεματική περίοδο. Ποιο;`, sol: R`<b>Αιτιολόγηση</b>: η θεματική περίοδος («είναι απαραίτητη») στηρίζεται με λόγους που εισάγονται με το «γιατί» (πηγές, επιχειρήσεις, σπουδές).` },
    { level: 2, type: "mc", q: R`Με ποιον κύριο τρόπο αναπτύσσεται η παράγραφος;${PASSAGE(`Ο αθλητής και ο θεατής του ποδοσφαίρου ζουν τον ίδιο αγώνα με εντελώς διαφορετικό τρόπο. Ο αθλητής ιδρώνει, κουράζεται και παίρνει αποφάσεις μέσα σε δευτερόλεπτα· ο θεατής, από την άλλη, παρακολουθεί καθισμένος, συχνά κρίνει αυστηρά και σπάνια γνωρίζει πόσο δύσκολο είναι αυτό που βλέπει.`)}`, options: ["Σύγκριση – αντίθεση", "Αναλογία", "Αίτιο – αποτέλεσμα", "Παραδείγματα"], correct: 0,
      hint: R`Τα δύο πρόσωπα ανήκουν στην ίδια κατηγορία ή σε διαφορετικά πεδία; Εξετάζονται εξίσου;`, sol: R`<b>Σύγκριση – αντίθεση</b>: δύο πρόσωπα του ίδιου πλαισίου (αθλητής – θεατής) εξετάζονται με κοινά κριτήρια (τι κάνουν, πώς βιώνουν τον αγώνα). Ενδείξεις: «από την άλλη», η άνω τελεία που χωρίζει τα δύο σκέλη.` },
    { level: 2, type: "mc", q: R`Με ποιον κύριο τρόπο αναπτύσσεται η παράγραφος;${PASSAGE(`Η συνεχής χρήση του αυτοκινήτου για μικρές αποστάσεις έχει σοβαρές συνέπειες. Οι δρόμοι γεμίζουν, ο χρόνος μετακίνησης αυξάνεται, η ατμόσφαιρα επιβαρύνεται με ρύπους και οι ίδιοι οι οδηγοί χάνουν την ευκαιρία για λίγη καθημερινή σωματική άσκηση.`)}`, options: ["Αίτιο – αποτέλεσμα", "Ορισμός", "Διαίρεση", "Αναλογία"], correct: 0,
      hint: R`Τι παρουσιάζουν οι λεπτομέρειες σε σχέση με τη «συνεχή χρήση του αυτοκινήτου»;`, sol: R`<b>Αίτιο – αποτέλεσμα</b>: το αίτιο (συνεχής χρήση του αυτοκινήτου) οδηγεί σε μια σειρά από συνέπειες (κυκλοφοριακό, χρόνος, ρύπανση, έλλειψη άσκησης).` },
    { level: 1, type: "mc", q: R`Μια παράγραφος μπορεί να αναπτύσσεται με <b>συνδυασμό</b> δύο ή περισσότερων τρόπων.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Μπορεί ένας ορισμός να συνοδεύεται από παραδείγματα;`, sol: R`ΣΩΣΤΟ. Συχνά π.χ. ένας ορισμός συνοδεύεται από παραδείγματα ή μια αιτιολόγηση από παραδείγματα. Στις εξετάσεις ονομάζουμε τον κυρίαρχο τρόπο (ή όσους ζητούνται) και τεκμηριώνουμε.` },
    { level: 2, q: R`Πόσα <b>παραδείγματα</b> δίνει ο συγγραφέας για να στηρίξει τη θεματική περίοδο;${PASSAGE(`Οι νέοι συμμετέχουν πιο ενεργά στα κοινά απ' όσο συχνά πιστεύουμε. Συγκεκριμένα, οργανώνουν καθαρισμούς παραλιών, στηρίζουν τράπεζες τροφίμων, δημιουργούν διαδικτυακές καμπάνιες για την προστασία των ζώων και συμμετέχουν σε μαθητικά συνέδρια για τα δικαιώματα του παιδιού.`)}`, fields: [{ label: "Παραδείγματα:", ans: 4 }],
      hint: R`Μέτρησε τις δράσεις που αναφέρονται μετά το «Συγκεκριμένα».`, sol: R`<b>4</b>: καθαρισμοί παραλιών, τράπεζες τροφίμων, διαδικτυακές καμπάνιες, μαθητικά συνέδρια. Ο τρόπος ανάπτυξης είναι τα <b>παραδείγματα</b>.` },
    { level: 3, type: "mc", q: R`Θέμα τύπου Παγκυπρίων: Ποια απάντηση αναγνωρίζει <b>και τεκμηριώνει σωστά</b> τον τρόπο ανάπτυξης της παραγράφου;${PASSAGE(`Η βία στο σχολείο εμφανίζεται με ποικίλες μορφές. Υπάρχει η σωματική βία, η λεκτική βία με προσβολές και χλευασμό, η κοινωνική βία με την απομόνωση ενός μαθητή από την ομάδα και, τέλος, η διαδικτυακή βία μέσα από τα κοινωνικά δίκτυα.`, { title: "Πρωτότυπο κείμενο εξάσκησης" })}`,
      options: ["Διαίρεση: η έννοια «σχολική βία» (διαιρετέα) χωρίζεται, με βάση τη μορφή της, σε σωματική, λεκτική, κοινωνική και διαδικτυακή (μέλη).", "Παραδείγματα: ο συγγραφέας δίνει παραδείγματα μαθητών που άσκησαν βία.", "Αίτιο – αποτέλεσμα: παρουσιάζονται οι αιτίες της σχολικής βίας.", "Ορισμός: ορίζεται τι είναι η σχολική βία."], correct: 0,
      hint: R`Εξέτασε τι κάνουν οι λεπτομέρειες με την έννοια της θεματικής περιόδου και έλεγξε αν η τεκμηρίωση κάθε απάντησης στηρίζεται πραγματικά σε στοιχεία του κειμένου.`, sol: R`<b>Διαίρεση</b> με διαιρετέα έννοια τη βία στο σχολείο, διαιρετική βάση τη <b>μορφή</b> της («ποικίλες μορφές») και μέλη σωματική, λεκτική, κοινωνική, διαδικτυακή. Δεν υπάρχουν συγκεκριμένα περιστατικά (παραδείγματα), αιτίες ή ορισμός.` }
  ]
},
/* ───────────────────────────── 3.3 ───────────────────────────── */
{
  id: "3.3", unit: 3, title: "Συνοχή και συνεκτικότητα: διαρθρωτικές λέξεις και νοηματικές σχέσεις",
  book: "Πίνακας προδιαγραφών 2026 · Οργάνωση λόγου 2: Εσωτερικά δομικά στοιχεία – συνοχή",
  intro: "Τι είναι οι διαρθρωτικές λέξεις και ποια νοηματική σχέση δηλώνει η καθεμιά — «ωστόσο», «επομένως», «επιπλέον», «δηλαδή»;",
  thumb: LETTER("ωστόσο"),
  theory: R`
<p>Ένα κείμενο δεν είναι απλώς μια σειρά από προτάσεις. Για να το καταλάβει ο αναγνώστης, οι προτάσεις, οι περίοδοι και οι παράγραφοι πρέπει να <b>συνδέονται</b> μεταξύ τους — και στη μορφή και στο νόημα. Η σύνδεση αυτή εξασφαλίζεται κυρίως με τις <b>διαρθρωτικές λέξεις και φράσεις</b> (λέγονται και «συνδετικές» ή «μεταβατικές» λέξεις), που δηλώνουν τη <b>νοηματική σχέση</b> ανάμεσα στα μέρη του κειμένου. Στις Παγκύπριες ζητείται συχνά: «Να εντοπίσετε δύο διαρθρωτικές λέξεις στην 3η παράγραφο και να δηλώσετε τη νοηματική σχέση που εκφράζει η καθεμιά» ή «Να συμπληρώσετε τα κενά με την κατάλληλη διαρθρωτική λέξη».</p>
<div class="tbox def"><h4>Συνοχή και συνεκτικότητα</h4>
<p><b>Συνοχή</b> είναι η <b>μορφική</b> σύνδεση των μερών του κειμένου: διαρθρωτικές λέξεις, επανάληψη λέξεων-κλειδιών, συνώνυμα, αντωνυμίες που παραπέμπουν σε κάτι που προηγήθηκε («<i>αυτό</i>», «<i>η στάση αυτή</i>»), περίοδοι-γέφυρες ανάμεσα σε παραγράφους.</p>
<p><b>Συνεκτικότητα</b> είναι η <b>νοηματική</b> ενότητα του κειμένου: οι ιδέες ακολουθούν λογική σειρά, δεν αντιφάσκουν και όλες υπηρετούν το ίδιο θέμα. Ένα κείμενο μπορεί να έχει διαρθρωτικές λέξεις και όμως να μην είναι συνεκτικό, αν οι ιδέες του δεν «δένουν».</p></div>
<table class="tbl"><tr><th>Νοηματική σχέση</th><th>Διαρθρωτικές λέξεις / φράσεις</th></tr>
<tr><td>Προσθήκη</td><td>επιπλέον, επίσης, επιπρόσθετα, πέρα από αυτό, ακόμη</td></tr>
<tr><td>Αντίθεση – εναντίωση</td><td>ωστόσο, όμως, αντίθετα, εντούτοις, απεναντίας, αν και, παρόλο που, μολονότι</td></tr>
<tr><td>Αιτιολόγηση</td><td>γιατί, επειδή, διότι, αφού, καθώς, εξαιτίας, λόγω</td></tr>
<tr><td>Αποτέλεσμα – συμπέρασμα</td><td>επομένως, συνεπώς, άρα, γι' αυτό, κατά συνέπεια, ως εκ τούτου, ώστε</td></tr>
<tr><td>Χρονική διαδοχή</td><td>αρχικά, έπειτα, στη συνέχεια, κατόπιν, μόλις, αργότερα, όταν</td></tr>
<tr><td>Παράδειγμα</td><td>για παράδειγμα, λόγου χάρη, παραδείγματος χάρη, π.χ., όπως</td></tr>
<tr><td>Επεξήγηση – διευκρίνιση</td><td>δηλαδή, με άλλα λόγια, πιο συγκεκριμένα, ειδικότερα</td></tr>
<tr><td>Όρος – προϋπόθεση</td><td>αν, εάν, εφόσον, με την προϋπόθεση ότι, υπό τον όρο ότι</td></tr>
<tr><td>Σκοπός</td><td>για να, προκειμένου να, με σκοπό να</td></tr>
<tr><td>Ανακεφαλαίωση – κατακλείδα</td><td>συνοψίζοντας, συμπερασματικά, εν κατακλείδι, εν ολίγοις, συνολικά</td></tr>
<tr><td>Έμφαση</td><td>κυρίως, ιδιαίτερα, πρωτίστως, προπάντων, πάνω απ' όλα</td></tr>
<tr><td>Απαρίθμηση – διάταξη</td><td>πρώτον, δεύτερον, καταρχάς, αφενός… αφετέρου, τέλος</td></tr></table>
<div class="tbox ex"><h4>Διαρθρωτικές λέξεις σε κείμενο</h4>
${PASSAGE(`Ο εθελοντισμός αποτελεί σχολείο ζωής για τους νέους. [[Καταρχάς]], καλλιεργεί την ενσυναίσθηση, [[αφού]] ο εθελοντής έρχεται σε επαφή με ανθρώπους που δοκιμάζονται. Ορισμένοι υποστηρίζουν ότι οι νέοι δεν έχουν χρόνο. [[Ωστόσο]], μία ώρα την εβδομάδα αρκεί. [[Συνεπώς]], ο εθελοντισμός αξίζει να ενταχθεί στη ζωή κάθε νέου.`, { title: "Πρωτότυπο κείμενο εξάσκησης" })}
<details class="steps"><summary>Ενδεικτική απάντηση</summary>
<p><i>Καταρχάς</i> → απαρίθμηση/διάταξη (εισάγει το πρώτο επιχείρημα) · <i>αφού</i> → αιτιολόγηση · <i>Ωστόσο</i> → αντίθεση (αναιρεί την αντίθετη άποψη) · <i>Συνεπώς</i> → συμπέρασμα.</p></details></div>
<div class="tbox rem"><h4>Λέξεις με περισσότερες από μία σημασία</h4>
<p>Ορισμένες λέξεις αλλάζουν σχέση ανάλογα με το συγκείμενο: το <b>«αφού»</b> μπορεί να είναι αιτιολογικό («αφού το ήξερες, γιατί δεν μίλησες;») ή χρονικό («αφού τελείωσε, έφυγε»)· το <b>«καθώς»</b> αιτιολογικό ή χρονικό· το <b>«ενώ»</b> χρονικό ή αντιθετικό· το <b>«ώστε»</b> αποτελεσματικό ή τελικό. Γι' αυτό απαντάμε πάντα <b>με βάση το νόημα της συγκεκριμένης περιόδου</b>.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Γράφουμε «σύνδεσμος» αντί να ονομάσουμε τη <b>νοηματική σχέση</b> (π.χ. «αντίθεση»).</li>
<li>Στη συμπλήρωση κενών βάζουμε λέξη που ταιριάζει νοηματικά αλλά όχι συντακτικά (π.χ. «επειδή» στην αρχή ανεξάρτητης περιόδου που δεν έχει κύρια πρόταση).</li>
<li>Χρησιμοποιούμε στην έκθεσή μας συνέχεια τις ίδιες λέξεις («επίσης, επίσης…»): ποικιλία διαρθρωτικών λέξεων = καλύτερη συνοχή και ύφος.</li></ul></div>
`,
  widget: "na3conn",
  gen: "na3gconn",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια νοηματική σχέση δηλώνει η διαρθρωτική λέξη <b>«εντούτοις»</b>;`, options: ["Αντίθεση – εναντίωση", "Αποτέλεσμα – συμπέρασμα", "Αιτιολόγηση", "Προσθήκη"], correct: 0,
      hint: R`Αντικατάστησέ τη με το «όμως» και δες αν το νόημα μένει ίδιο.`, sol: R`Το «εντούτοις» = «όμως, παρ' όλα αυτά» → <b>αντίθεση – εναντίωση</b>.` },
    { level: 1, type: "mc", q: R`Η <b>συνοχή</b> αφορά κυρίως…`, options: ["τη μορφική σύνδεση των μερών του κειμένου (π.χ. διαρθρωτικές λέξεις, αντωνυμίες, επαναλήψεις)", "τη λογική σειρά και την ενότητα των ιδεών", "την ορθογραφία του κειμένου", "την έκταση των παραγράφων"], correct: 0,
      hint: R`Συνοχή = «πώς δένουν μορφικά»· συνεκτικότητα = «πώς δένουν νοηματικά».`, sol: R`Η συνοχή είναι η <b>μορφική</b> σύνδεση (διαρθρωτικές λέξεις, αντωνυμίες, επανάληψη λέξεων-κλειδιών)· η συνεκτικότητα είναι η <b>νοηματική</b> ενότητα.` },
    { level: 1, q: R`Να συμπληρώσετε το κενό με μία διαρθρωτική λέξη που δηλώνει <b>αντίθεση</b>:<div class="nepass">Ο νέος νόμος ψηφίστηκε πριν από δύο χρόνια. _____, η εφαρμογή του καθυστερεί ακόμη.</div>`, fields: [{ label: "Λέξη:", ans: ["ωστόσο", "όμως", "εντούτοις", "παρόλα αυτά", "παρ' όλα αυτά", "παρ όλα αυτά", "μολαταύτα", "εν τούτοις"], text: true, nopunct: true }],
      hint: R`Το δεύτερο μέρος έρχεται σε αντίθεση με αυτό που θα περίμενε κανείς από το πρώτο.`, sol: R`Π.χ. <b>Ωστόσο</b> / Όμως / Εντούτοις / Παρ' όλα αυτά, η εφαρμογή του καθυστερεί ακόμη.` },
    { level: 1, q: R`Να συμπληρώσετε το κενό με μία διαρθρωτική λέξη ή φράση που δηλώνει <b>αποτέλεσμα – συμπέρασμα</b>:<div class="nepass">Τα αποθέματα νερού του νησιού μειώνονται χρόνο με τον χρόνο. _____, η εξοικονόμηση νερού είναι υποχρέωση όλων.</div>`, fields: [{ label: "Λέξη/φράση:", ans: ["επομένως", "συνεπώς", "άρα", "γι' αυτό", "γι αυτό", "κατά συνέπεια", "ως εκ τούτου", "συνακόλουθα", "λοιπόν", "έτσι"], text: true, nopunct: true }],
      hint: R`Το δεύτερο μέρος προκύπτει ως συνέπεια του πρώτου.`, sol: R`Π.χ. <b>Επομένως</b> / Συνεπώς / Γι' αυτό / Κατά συνέπεια, η εξοικονόμηση νερού είναι υποχρέωση όλων.` },
    { level: 2, type: "mc", q: R`Στην περίοδο «<b>Αφού</b> τελείωσε η συνέλευση, οι μαθητές επέστρεψαν στις τάξεις τους», το «αφού» δηλώνει…`, options: ["χρόνο", "αιτία", "αντίθεση", "σκοπό"], correct: 0,
      hint: R`Αντικατάστησέ το με «όταν» ή με «επειδή»: ποιο ταιριάζει;`, sol: R`Εδώ το «αφού» = «όταν/μόλις» → <b>χρονική</b> σχέση. Σε περίοδο όπως «Αφού δεν διάβασες, μην παραπονιέσαι» θα ήταν αιτιολογικό.` },
    { level: 2, type: "mc", q: R`Ποιο από τα παρακάτω μέσα <b>δεν</b> εξασφαλίζει συνοχή ανάμεσα σε δύο παραγράφους;`, options: ["Η αλλαγή θέματος χωρίς καμία σύνδεση με τα προηγούμενα", "Μια διαρθρωτική φράση όπως «Από την άλλη πλευρά»", "Μια αντωνυμία που παραπέμπει σε ό,τι προηγήθηκε («Η στάση αυτή…»)", "Η επανάληψη μιας λέξης-κλειδιού της προηγούμενης παραγράφου"], correct: 0,
      hint: R`Τρία από τα τέσσερα «δένουν» τις παραγράφους.`, sol: R`Η απότομη αλλαγή θέματος χωρίς γέφυρα διασπά το κείμενο. Οι διαρθρωτικές φράσεις, οι αναφορικές αντωνυμίες και οι λέξεις-κλειδιά εξασφαλίζουν συνοχή.` },
    { level: 2, type: "mc", shuffle: true, q: R`Ποια διαρθρωτική λέξη ταιριάζει στο κενό;<div class="nepass">Η τεχνητή νοημοσύνη μπορεί να βοηθήσει τους γιατρούς στη διάγνωση. _____, ένα πρόγραμμα αναλύει χιλιάδες ακτινογραφίες σε λίγα λεπτά και εντοπίζει ύποπτα σημεία.</div>`, options: ["Για παράδειγμα", "Αντίθετα", "Συνοψίζοντας", "Επειδή"], correct: 0,
      hint: R`Η δεύτερη περίοδος είναι γενική θέση ή συγκεκριμένη περίπτωση της πρώτης;`, sol: R`Η δεύτερη περίοδος δίνει μια συγκεκριμένη περίπτωση της γενικής θέσης → <b>«Για παράδειγμα»</b>. Το «Αντίθετα» δηλώνει αντίθεση, το «Συνοψίζοντας» ανακεφαλαίωση και το «Επειδή» θα χρειαζόταν κύρια πρόταση.` },
    { level: 3, type: "mc", shuffle: true, q: R`Θέμα τύπου Παγκυπρίων: Ποια νοηματική σχέση δηλώνει η υπογραμμισμένη φράση στο απόσπασμα;${PASSAGE(`Πολλοί έφηβοι πάσχουν σήμερα από «ψηφιακή κόπωση». [[Με άλλα λόγια]], νιώθουν εξαντλημένοι από τις ατελείωτες ώρες μπροστά στις οθόνες, ακόμη κι όταν δεν έχουν κάνει τίποτε κουραστικό.`, { title: "Πρωτότυπο κείμενο εξάσκησης" })}`, options: ["Επεξήγηση – διευκρίνιση", "Αντίθεση – εναντίωση", "Χρονική διαδοχή", "Όρος – προϋπόθεση"], correct: 0,
      hint: R`Η δεύτερη περίοδος λέει κάτι καινούργιο ή εξηγεί με άλλα λόγια το προηγούμενο;`, sol: R`<b>Επεξήγηση</b>: η δεύτερη περίοδος εξηγεί τι σημαίνει η «ψηφιακή κόπωση». Ισοδύναμες φράσεις: «δηλαδή», «πιο απλά».` },
    { level: 3, type: "mc", q: R`Θέμα τύπου Παγκυπρίων: Στο απόσπασμα, η λέξη «<b>Παρόλο που</b>» εισάγει…${PASSAGE(`[[Παρόλο που]] οι κίνδυνοι από την υπερβολική χρήση των οθονών είναι γνωστοί, οι περισσότεροι έφηβοι δεν περιορίζουν τον χρόνο που περνούν μπροστά σε αυτές.`)}`, options: ["εναντίωση: το αποτέλεσμα είναι αντίθετο από αυτό που θα περίμενε κανείς", "αιτιολόγηση: εξηγεί γιατί οι έφηβοι δεν περιορίζουν τις οθόνες", "συμπέρασμα από τα προηγούμενα", "παράδειγμα της θέσης"], correct: 0,
      hint: R`Θα περίμενε κανείς ότι όσοι γνωρίζουν τους κινδύνους θα περιόριζαν τη χρήση. Συμβαίνει;`, sol: R`<b>Εναντίωση (παραχώρηση)</b>: η δευτερεύουσα με «παρόλο που» δηλώνει κάτι που κανονικά θα εμπόδιζε την κύρια πράξη, η οποία όμως πραγματοποιείται. Συνώνυμα: αν και, μολονότι, μόλο που.` }
  ]
},
/* ───────────────────────────── 3.4 ───────────────────────────── */
{
  id: "3.4", unit: 3, title: "Γλώσσα αφήγησης και επιχειρηματολογίας — και η περιγραφή ως μέσο πειθούς",
  book: "Πίνακας προδιαγραφών 2026 · Οργάνωση λόγου 4: Γλώσσα αφήγησης και επιχειρηματολογίας · Κειμενικοί τύποι 1–3",
  intro: "Πώς ξεχωρίζουμε τη γλώσσα της αφήγησης από τη γλώσσα της επιχειρηματολογίας — και τι ρόλο παίζει η περιγραφή σε ένα πειστικό κείμενο;",
  thumb: LETTER("Αφήγηση"),
  theory: R`
<p>Ο πίνακας προδιαγραφών των Παγκυπρίων αναφέρει τρεις <b>κειμενικούς τύπους</b>: την <b>επιχειρηματολογία</b>, την <b>αφήγηση</b> και την <b>περιγραφή στην επιχειρηματολογία ως μέσο πειθούς</b>. Κάθε τύπος έχει τη δική του γλώσσα: άλλους χρόνους ρημάτων, άλλες διαρθρωτικές λέξεις, άλλο λεξιλόγιο. Αν μάθεις να αναγνωρίζεις αυτά τα γλωσσικά σημάδια, μπορείς να απαντήσεις σε ερωτήσεις όπως «Να εντοπίσετε δύο γλωσσικά στοιχεία που δείχνουν ότι στην 2η παράγραφο κυριαρχεί η αφήγηση» — και να τα χρησιμοποιείς σωστά στο δικό σου κείμενο.</p>
<div class="figrow">
<div class="tbox def"><h4>Γλώσσα της αφήγησης</h4>
<ul><li><b>Παρελθοντικοί χρόνοι</b>: αόριστος (έφυγε), παρατατικός (περίμενε), υπερσυντέλικος (είχε φύγει)· ή «ιστορικός ενεστώτας» για ζωντάνια.</li>
<li><b>Χρονικοί δείκτες</b> που δηλώνουν διαδοχή: εκείνο το πρωί, ύστερα, την επόμενη μέρα, μόλις, όταν.</li>
<li><b>Ρήματα κίνησης και δράσης</b>: έτρεξε, άρπαξε, χτύπησε.</li>
<li>Πρόσωπα που δρουν σε συγκεκριμένο <b>τόπο</b> και <b>χρόνο</b>· συχνά διάλογος.</li>
<li>Α΄ πρόσωπο (ο αφηγητής ζει τα γεγονότα) ή γ΄ πρόσωπο.</li></ul></div>
<div class="tbox def"><h4>Γλώσσα της επιχειρηματολογίας</h4>
<ul><li><b>Ενεστώτας διαχρονικός/γνωμικός</b>: η παιδεία καλλιεργεί, ο άνθρωπος χρειάζεται.</li>
<li><b>Λογικοί σύνδεσμοι</b>: επειδή, συνεπώς, ωστόσο, άρα.</li>
<li><b>Αφηρημένο λεξιλόγιο</b> και όροι: ελευθερία, ευθύνη, καταναλωτισμός.</li>
<li>Θέση → επιχειρήματα → <b>τεκμήρια</b> (στατιστικά, γνώμη ειδικών, παραδείγματα).</li>
<li>Απρόσωπες συντάξεις («είναι γεγονός ότι…»), ρητορικά ερωτήματα, αναίρεση αντίθετης άποψης.</li></ul></div></div>
<div class="tbox def"><h4>Η περιγραφή μέσα στην επιχειρηματολογία</h4>
<p>Η <b>περιγραφή</b> παρουσιάζει πώς είναι ένας χώρος, ένα πρόσωπο ή μια κατάσταση: πολλά <b>επίθετα</b>, <b>αισθητηριακές εικόνες</b> (χρώματα, ήχοι, μυρωδιές), ρήματα στάσης (βρίσκεται, απλώνεται), προσδιορισμοί τόπου. Ο χρόνος «σταματά». Μέσα σε ένα επιχειρηματολογικό κείμενο η περιγραφή λειτουργεί ως <b>μέσο πειθούς</b>: λειτουργεί σαν τεκμήριο που ο αναγνώστης «βλέπει» και συχνά κάνει <b>επίκληση στο συναίσθημα</b>.</p>
${PASSAGE(`Για να καταλάβουμε τι σημαίνει ρύπανση, αρκεί να επισκεφθούμε μια παραλία μετά από ένα καλοκαιρινό σαββατοκύριακο. Η άμμος γεμάτη πλαστικά καλαμάκια, τα βότσαλα λαδωμένα, ένα γκρίζο στρώμα αφρού απλώνεται στην ακτή. Η εικόνα αυτή αποδεικνύει ότι η προστασία του περιβάλλοντος ξεκινά από τις καθημερινές μας συνήθειες.`, { title: "Πρωτότυπο κείμενο εξάσκησης" })}
<p>Η περιγραφή της παραλίας (επίθετα, οπτικές εικόνες) δεν μπαίνει για «διακόσμηση»· <b>τεκμηριώνει</b> τη θέση της τελευταίας περιόδου και συγκινεί τον αναγνώστη.</p></div>
<div class="tbox ex"><h4>Πώς απαντάμε σε ερώτηση για τη γλώσσα</h4>
<p><i>Ερώτηση:</i> «Να αναφέρετε δύο γλωσσικά στοιχεία που δείχνουν ότι η παράγραφος είναι αφηγηματική.»</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary>
<p>1) Κυριαρχούν <b>παρελθοντικοί χρόνοι</b>, κυρίως αόριστος («πήγα», «με πλησίασε», «με οδήγησε»), που παρουσιάζουν διαδοχικά γεγονότα. 2) Υπάρχουν <b>χρονικοί δείκτες</b> («Την πρώτη μέρα», «Ύστερα από λίγες ώρες»), που δηλώνουν τη χρονική διαδοχή. <i>(Κάθε στοιχείο ονομάζεται και τεκμηριώνεται με παράδειγμα από το κείμενο.)</i></p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Αναφέρουμε το γλωσσικό στοιχείο χωρίς παράδειγμα από το κείμενο ή χωρίς να εξηγήσουμε τη λειτουργία του.</li>
<li>Θεωρούμε ότι κάθε κείμενο με «εγώ» είναι αφήγηση: και ένα επιχειρηματολογικό άρθρο μπορεί να είναι σε α΄ πρόσωπο.</li>
<li>Στην παραγωγή λόγου «γλιστράμε» σε αφήγηση προσωπικών ιστοριών, ενώ ζητείται επιχειρηματολογία· μια σύντομη εμπειρία ή περιγραφή επιτρέπεται μόνο ως τεκμήριο.</li></ul></div>
`,
  widget: "na3lang",
  gen: "na3glang",
  exercises: [
    { level: 1, type: "mc", q: R`Ποιος χρόνος ρημάτων κυριαρχεί συνήθως στην <b>αφήγηση</b>;`, options: ["Αόριστος και παρατατικός", "Ενεστώτας διαχρονικός", "Μέλλοντας", "Προστακτική"], correct: 0,
      hint: R`Η αφήγηση παρουσιάζει γεγονότα που συνέβησαν.`, sol: R`Οι <b>παρελθοντικοί χρόνοι</b> (αόριστος για ολοκληρωμένα γεγονότα, παρατατικός για διάρκεια/επανάληψη) κυριαρχούν στην αφήγηση.` },
    { level: 1, type: "mc", q: R`Στην επιχειρηματολογία ο <b>ενεστώτας</b> χρησιμοποιείται συχνά με διαχρονική σημασία (π.χ. «η παιδεία καλλιεργεί την κρίση»).`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Οι θέσεις ενός δοκιμίου ισχύουν μόνο «τώρα» ή γενικά;`, sol: R`ΣΩΣΤΟ. Ο διαχρονικός/γνωμικός ενεστώτας παρουσιάζει τις θέσεις ως γενικές αλήθειες και ενισχύει την αντικειμενικότητα και την πειστικότητα.` },
    { level: 1, type: "mc", q: R`Ποιο από τα παρακάτω είναι χαρακτηριστικό της <b>περιγραφής</b>;`, options: ["Επίθετα και αισθητηριακές εικόνες", "Λογικοί σύνδεσμοι αιτίου – αποτελέσματος", "Στατιστικά στοιχεία", "Ρητορικά ερωτήματα"], correct: 0,
      hint: R`Σκέψου τι χρειάζεται ένα κείμενο για να «δει» ο αναγνώστης έναν χώρο ή ένα πρόσωπο.`, sol: R`Η περιγραφή στηρίζεται σε <b>επίθετα</b>, <b>εικόνες</b> (οπτικές, ακουστικές, οσφρητικές…), ρήματα στάσης και προσδιορισμούς τόπου. Τα υπόλοιπα χαρακτηρίζουν την επιχειρηματολογία.` },
    { level: 2, type: "mc", q: R`Ποιος κειμενικός τύπος κυριαρχεί στο απόσπασμα;${PASSAGE(`Μόλις άνοιξα την πόρτα, το σκυλάκι πετάχτηκε έξω και χάθηκε στο σκοτάδι. Το έψαχνα για ώρες στους γύρω δρόμους. Κοντά στα μεσάνυχτα, το βρήκα κουλουριασμένο κάτω από ένα παγκάκι.`)}`, options: ["Αφήγηση", "Επιχειρηματολογία", "Περιγραφή", "Ορισμός"], correct: 0,
      hint: R`Κοίτα τους χρόνους των ρημάτων και τους χρονικούς δείκτες.`, sol: R`<b>Αφήγηση</b>: παρελθοντικοί χρόνοι (άνοιξα, πετάχτηκε, έψαχνα, βρήκα), χρονικοί δείκτες (Μόλις, για ώρες, Κοντά στα μεσάνυχτα), διαδοχή γεγονότων.` },
    { level: 2, type: "mc", q: R`Ποιος κειμενικός τύπος κυριαρχεί στο απόσπασμα;${PASSAGE(`Η κατάργηση των εξετάσεων δεν θα λύσει το πρόβλημα του άγχους των μαθητών. Το άγχος δεν οφείλεται στις εξετάσεις καθαυτές, αλλά στον τρόπο με τον οποίο τις αντιμετωπίζει η κοινωνία· συνεπώς, αυτό που πρέπει να αλλάξει είναι η νοοτροπία μας.`)}`, options: ["Επιχειρηματολογία", "Αφήγηση", "Περιγραφή", "Διάλογος"], correct: 0,
      hint: R`Υπάρχει θέση, αιτιολόγηση και συμπέρασμα;`, sol: R`<b>Επιχειρηματολογία</b>: θέση («δεν θα λύσει…»), αιτιολόγηση («Το άγχος δεν οφείλεται…, αλλά…»), συμπέρασμα με «συνεπώς», ενεστώτας διαχρονικός, αφηρημένο λεξιλόγιο.` },
    { level: 2, type: "mc", q: R`Σε ένα επιχειρηματολογικό άρθρο για την προστασία των δασών, ο συγγραφέας περιγράφει με ζωντανές εικόνες ένα καμένο βουνό. Ποια είναι κυρίως η λειτουργία της περιγραφής;`, options: ["Λειτουργεί ως μέσο πειθούς: τεκμηριώνει τη θέση και κάνει επίκληση στο συναίσθημα", "Διακοσμεί το κείμενο χωρίς σχέση με τη θέση", "Αποδεικνύει τη θέση με στατιστικά στοιχεία", "Μετατρέπει το άρθρο σε λογοτεχνικό διήγημα"], correct: 0,
      hint: R`Γιατί ένας συγγραφέας που θέλει να πείσει θα αφιέρωνε χώρο σε μια εικόνα; Τι προκαλεί αυτή στον αναγνώστη;`, sol: R`Η περιγραφή κάνει την καταστροφή «ορατή» στον αναγνώστη· λειτουργεί ως <b>τεκμήριο</b> και ως <b>επίκληση στο συναίσθημα</b>, ενισχύοντας την πειστικότητα της θέσης.` },
    { level: 2, type: "mc", q: R`Ποιο γλωσσικό στοιχείο του αποσπάσματος <b>δεν</b> είναι τυπικό της επιχειρηματολογίας;${PASSAGE(`Είναι γεγονός ότι οι νέοι διαβάζουν λιγότερα βιβλία. Πρόσφατη έρευνα δείχνει ότι μόνο ένας στους τέσσερις εφήβους διαβάζει για ευχαρίστηση. Πώς μπορούμε άραγε να αλλάξουμε αυτή την πραγματικότητα;`)}`, options: ["Παρελθοντικοί χρόνοι που δηλώνουν διαδοχή γεγονότων", "Απρόσωπη σύνταξη («Είναι γεγονός ότι…»)", "Τεκμήριο από έρευνα", "Ρητορικό ερώτημα"], correct: 0,
      hint: R`Τρία στοιχεία υπάρχουν στο απόσπασμα. Ποιο λείπει;`, sol: R`Το απόσπασμα έχει απρόσωπη σύνταξη, τεκμήριο (έρευνα) και ρητορικό ερώτημα — όλα τυπικά της επιχειρηματολογίας. <b>Δεν</b> έχει παρελθοντικούς χρόνους με διαδοχή γεγονότων, που είναι γνώρισμα της αφήγησης.` },
    { level: 3, type: "mc", q: R`Θέμα τύπου Παγκυπρίων: Ποια απάντηση αναφέρει σωστά <b>δύο γλωσσικά στοιχεία</b> που δείχνουν ότι το απόσπασμα είναι αφηγηματικό;${PASSAGE(`Εκείνο το καλοκαίρι πήγα για πρώτη φορά εθελοντής σε μια κατασκήνωση. Την πρώτη μέρα ένιωθα αμήχανος. Ύστερα από λίγες ώρες, όμως, ένα αγόρι με πλησίασε, μου έπιασε το χέρι και με οδήγησε στο γήπεδο.`, { title: "Πρωτότυπο κείμενο εξάσκησης" })}`,
      options: ["Παρελθοντικοί χρόνοι («πήγα», «με πλησίασε») και χρονικοί δείκτες («Την πρώτη μέρα», «Ύστερα από λίγες ώρες»)", "Ενεστώτας διαχρονικός και λογικοί σύνδεσμοι αιτίου – αποτελέσματος", "Ρητορικά ερωτήματα και στατιστικά στοιχεία", "Αφηρημένο λεξιλόγιο και απρόσωπες συντάξεις"], correct: 0,
      hint: R`Ποια στοιχεία υπάρχουν πραγματικά στο απόσπασμα;`, sol: R`Σωστά: οι <b>παρελθοντικοί χρόνοι</b> (αόριστος, παρατατικός) και οι <b>χρονικοί δείκτες</b>, που οργανώνουν τα γεγονότα σε διαδοχή. Τα άλλα ζεύγη χαρακτηρίζουν την επιχειρηματολογία και δεν υπάρχουν στο απόσπασμα.` }
  ]
},
/* ───────────────────────────── 4.1 ───────────────────────────── */
{
  id: "4.1", unit: 4, title: "Κυριολεξία και μεταφορά (δηλωτική – συνυποδηλωτική λειτουργία) και ρητορικά ερωτήματα",
  book: "Πίνακας προδιαγραφών 2026 · Εκφραστικά/γλωσσικά μέσα: κυριολεξία – μεταφορά, ρητορικά ερωτήματα",
  intro: "Πότε μια λέξη χρησιμοποιείται κυριολεκτικά και πότε μεταφορικά — και τι πετυχαίνει ένα ρητορικό ερώτημα σε ένα κείμενο;",
  thumb: LETTER("Μεταφορά"),
  theory: R`
<p>Η ίδια λέξη μπορεί να σημαίνει κάτι συγκεκριμένο, όπως στο λεξικό, ή να «μεταφέρεται» σε άλλο πεδίο και να αποκτά νέα, πιο συναισθηματική σημασία. Αυτή η διάκριση ανάμεσα σε <b>κυριολεξία</b> και <b>μεταφορά</b> είναι από τα πιο συχνά θέματα του λεξιλογίου και του ύφους στις Παγκύπριες: «Να μετατρέψετε τη μεταφορική φράση σε κυριολεκτική», «Ποια είναι η λειτουργία της μεταφοράς στην 1η παράγραφο;». Στην ίδια ενότητα εξετάζουμε και το <b>ρητορικό ερώτημα</b>, ένα από τα πιο αποτελεσματικά μέσα του πειστικού λόγου.</p>
<div class="tbox def"><h4>Κυριολεξία – δηλωτική λειτουργία</h4>
<p>Η λέξη χρησιμοποιείται με την <b>αρχική, συγκεκριμένη σημασία</b> της. Η γλώσσα έχει <b>δηλωτική (αναφορική)</b> λειτουργία: πληροφορεί με ακρίβεια, σαφήνεια και αντικειμενικότητα. Χρησιμοποιείται σε επιστημονικά κείμενα, ειδήσεις, οδηγίες, νόμους. <i>Π.χ. «Η φωτιά έκαψε εκατοντάδες στρέμματα δάσους.»</i></p></div>
<div class="tbox def"><h4>Μεταφορά – συνυποδηλωτική λειτουργία</h4>
<p>Η λέξη χρησιμοποιείται με <b>μεταφορική σημασία</b>: μεταφέρεται από το πεδίο όπου ανήκει σε άλλο, με βάση κάποια ομοιότητα. Η γλώσσα έχει <b>συνυποδηλωτική</b> λειτουργία: υποβάλλει συναισθήματα, εικόνες, συνειρμούς. <i>Π.χ. «Οι ψευδείς ειδήσεις φουντώνουν στο διαδίκτυο.»</i> (Προσοχή: με «σαν» ή «όπως» έχουμε <b>παρομοίωση</b>, όχι μεταφορά — π.χ. «εξαπλώνονται σαν φωτιά».)</p>
<p><b>Λειτουργία μεταφοράς:</b> ζωντάνια και <b>παραστατικότητα</b> (ο αναγνώστης «βλέπει» την ιδέα), <b>συναισθηματική φόρτιση</b>, έμφαση, πρωτοτυπία, πιο λογοτεχνικό ύφος· συχνά λειτουργεί και ως επίκληση στο συναίσθημα.</p></div>
<div class="tbox ex"><h4>Από τη μεταφορά στην κυριολεξία</h4>
<p>«Η ανεργία είναι <u>πληγή</u> για την κοινωνία.» → «Η ανεργία είναι <b>σοβαρό πρόβλημα</b> για την κοινωνία.»</p>
<p>«Η νέα υπουργός <u>πήρε το τιμόνι</u> της οικονομίας.» → «Η νέα υπουργός <b>ανέλαβε τη διοίκηση</b> της οικονομίας.»</p>
<p>«Ο συγγραφέας <u>ρίχνει φως</u> σε μια άγνωστη πτυχή της ιστορίας.» → «Ο συγγραφέας <b>διαφωτίζει / εξηγεί</b> μια άγνωστη πτυχή της ιστορίας.»</p>
<p>Παρατήρησε ότι η κυριολεκτική διατύπωση είναι πιο ακριβής, αλλά <b>χάνει τη ζωντάνια και τη συγκινησιακή δύναμη</b> της μεταφοράς.</p></div>
<div class="tbox def"><h4>Ρητορικό ερώτημα</h4>
<p>Είναι ερώτηση που <b>δεν περιμένει απάντηση</b>, γιατί η απάντηση θεωρείται αυτονόητη ή γιατί ο σκοπός είναι να προβληματίσει. Π.χ. «Μπορεί άραγε να υπάρξει δημοκρατία χωρίς ενεργούς πολίτες;»</p>
<p><b>Λειτουργίες:</b> προκαλεί <b>προβληματισμό</b> και ενεργοποιεί τον αναγνώστη· δίνει <b>έμφαση</b> σε μια θέση· προσδίδει <b>ζωντάνια, αμεσότητα και διαλογικότητα</b>· κάνει το ύφος πιο οικείο ή πιο έντονο· ως μέσο πειθούς συνήθως λειτουργεί ως <b>επίκληση στο συναίσθημα</b> ή στη λογική (όταν η απάντηση είναι προφανής).</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Στη μετατροπή μεταφοράς σε κυριολεξία αλλάζουμε και άλλα μέρη της πρότασης ή αλλάζουμε το νόημα.</li>
<li>Γράφουμε για τη λειτουργία της μεταφοράς μόνο «κάνει το κείμενο πιο ωραίο». Ονόμασε συγκεκριμένα: παραστατικότητα, συναισθηματική φόρτιση, έμφαση — και σε σχέση με το νόημα της περιόδου.</li>
<li>Χαρακτηρίζουμε ρητορικό ερώτημα κάθε ερώτηση: αν ο συγγραφέας απαντά αμέσως ο ίδιος, πρόκειται συχνά για ερώτηση που εισάγει το θέμα (ερώτηση-απάντηση).</li></ul></div>
`,
  widget: "na3meta",
  gen: "na3gmeta",
  exercises: [
    { level: 1, type: "mc", q: R`Στην περίοδο «Η κοινωνία μας <u>διψά</u> για αξιοκρατία», το ρήμα χρησιμοποιείται…`, options: ["μεταφορικά", "κυριολεκτικά"], correct: 0,
      hint: R`Μπορεί μια κοινωνία να διψάσει για νερό;`, sol: R`<b>Μεταφορικά</b>: «διψά» = επιθυμεί έντονα. Η μεταφορά δίνει ένταση και συναισθηματική φόρτιση.` },
    { level: 1, type: "mc", q: R`Η γλώσσα στη <b>συνυποδηλωτική</b> της λειτουργία…`, options: ["υποβάλλει συναισθήματα, εικόνες και συνειρμούς", "πληροφορεί με απόλυτη ακρίβεια και αντικειμενικότητα", "χρησιμοποιείται κυρίως σε νομικά κείμενα", "αποφεύγει κάθε μεταφορά"], correct: 0,
      hint: R`«Συν-υπο-δηλώνω» = δηλώνω κάτι επιπλέον, έμμεσα.`, sol: R`Η συνυποδηλωτική γλώσσα υποβάλλει συναισθήματα και συνειρμούς (λογοτεχνία, διαφήμιση, πειστικός λόγος). Η δηλωτική πληροφορεί με ακρίβεια (επιστήμη, νόμοι, ειδήσεις).` },
    { level: 1, type: "mc", q: R`Ένα ρητορικό ερώτημα περιμένει απάντηση από τον αναγνώστη ή τον ακροατή.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Γιατί λέγεται «ρητορικό»;`, sol: R`ΛΑΘΟΣ. Το ρητορικό ερώτημα δεν περιμένει απάντηση· η απάντηση είναι αυτονόητη ή ο σκοπός είναι να προκαλέσει προβληματισμό.` },
    { level: 2, type: "mc", q: R`Ποια είναι η καταλληλότερη <b>κυριολεκτική</b> απόδοση της φράσης: «Η νέα πρόταση <u>έπεσε στο κενό</u>»;`, options: ["Η νέα πρόταση δεν βρήκε καμία ανταπόκριση", "Η νέα πρόταση έπεσε από ψηλά", "Η νέα πρόταση έγινε δεκτή με ενθουσιασμό", "Η νέα πρόταση συζητήθηκε πολύ"], correct: 0,
      hint: R`Φαντάσου την εικόνα κυριολεκτικά και σκέψου τι σημαίνει αυτό για μια πρόταση που κατατίθεται σε μια σύσκεψη.`, sol: R`«Έπεσε στο κενό» = <b>δεν βρήκε ανταπόκριση</b>, αγνοήθηκε. Η μεταφορά δίνει παραστατικά την εικόνα μιας πρότασης που «δεν την έπιασε κανείς».` },
    { level: 2, type: "mc", q: R`Ποια είναι η καταλληλότερη <b>κυριολεκτική</b> απόδοση της φράσης: «Τα μέσα κοινωνικής δικτύωσης έχουν γίνει <u>ο καθρέφτης</u> της κοινωνίας»;`, options: ["Τα μέσα κοινωνικής δικτύωσης αντανακλούν/φανερώνουν τις αξίες και τα προβλήματα της κοινωνίας", "Τα μέσα κοινωνικής δικτύωσης είναι γυάλινα αντικείμενα", "Τα μέσα κοινωνικής δικτύωσης αντιγράφουν άλλα μέσα", "Τα μέσα κοινωνικής δικτύωσης διαστρεβλώνουν πάντα την πραγματικότητα"], correct: 0,
      hint: R`Ποια ιδιότητα του αντικειμένου «καθρέφτης» μεταφέρεται στα μέσα κοινωνικής δικτύωσης;`, sol: R`Ο καθρέφτης δείχνει ό,τι βρίσκεται μπροστά του· μεταφορικά, τα μέσα κοινωνικής δικτύωσης <b>αντανακλούν</b> τις αξίες, τις συνήθειες και τα προβλήματα της κοινωνίας.` },
    { level: 2, type: "mc", q: R`Ποια είναι η κύρια λειτουργία του ρητορικού ερωτήματος στο απόσπασμα;${PASSAGE(`Κάθε χρόνο χιλιάδες τόνοι πλαστικού καταλήγουν στις θάλασσές μας. Θέλουμε στ' αλήθεια να αφήσουμε στα παιδιά μας ωκεανούς γεμάτους σκουπίδια;`)}`, options: ["Προκαλεί προβληματισμό και συναισθηματικά ενεργοποιεί τον αναγνώστη", "Ζητά πληροφορίες από τον αναγνώστη", "Εισάγει ένα νέο θέμα που δεν σχετίζεται με το προηγούμενο", "Δίνει στατιστικά στοιχεία"], correct: 0,
      hint: R`Ποια είναι η αυτονόητη απάντηση; Γιατί τότε ρωτά ο συγγραφέας;`, sol: R`Η απάντηση είναι αυτονόητη («όχι»)· το ερώτημα <b>προβληματίζει</b>, ευαισθητοποιεί και κάνει επίκληση στο συναίσθημα (ευθύνη απέναντι στα παιδιά), προσδίδοντας ζωντάνια και αμεσότητα.` },
    { level: 2, type: "mc", q: R`Σε ποια περίοδο η υπογραμμισμένη λέξη χρησιμοποιείται <b>κυριολεκτικά</b>;`, options: ["Οι αμυγδαλιές <u>ανθίζουν</u> τον Φεβρουάριο.", "Η ελπίδα <u>ανθίζει</u> ξανά στις καρδιές των πολιτών.", "Το ταλέντο της <u>άνθισε</u> στη σκηνή του θεάτρου.", "Η φιλία τους <u>άνθισε</u> μέσα στις δυσκολίες."], correct: 0,
      hint: R`Για κάθε περίοδο έλεγξε αν το ρήμα έχει τη λεξικογραφική, αρχική σημασία του μαζί με το συγκεκριμένο υποκείμενο.`, sol: R`Μόνο τα δέντρα ανθίζουν κυριολεκτικά. Η ελπίδα, το ταλέντο και η φιλία «ανθίζουν» μεταφορικά (= αναπτύσσονται, αναγεννιούνται).` },
    { level: 3, type: "mc", q: R`Θέμα τύπου Παγκυπρίων: Ποια απάντηση εξηγεί καλύτερα τη <b>λειτουργία</b> της υπογραμμισμένης μεταφοράς;${PASSAGE(`Ο σύγχρονος καταναλωτής [[πνίγεται]] σε ένα κύμα διαφημιστικών μηνυμάτων που τον ακολουθούν από το πρωί ως το βράδυ.`, { title: "Πρωτότυπο κείμενο εξάσκησης" })}`,
      options: ["Αποδίδει παραστατικά και με συναισθηματική φόρτιση τον καταιγισμό διαφημίσεων, που ο καταναλωτής αδυνατεί να αντιμετωπίσει", "Δίνει ακριβή, αντικειμενική πληροφόρηση για τον αριθμό των διαφημίσεων", "Δείχνει ότι ο καταναλωτής κινδυνεύει πραγματικά από τη θάλασσα", "Δεν έχει καμία λειτουργία· είναι διακοσμητική"], correct: 0,
      hint: R`Τι εικόνα δημιουργεί το «πνίγεται»; Τι συναίσθημα;`, sol: R`Η μεταφορά «πνίγεται» (μαζί με το «κύμα») δημιουργεί την εικόνα ανθρώπου που χάνεται μέσα στο νερό: αποδίδει <b>παραστατικά</b> τον υπερβολικό όγκο διαφημίσεων και την <b>αδυναμία</b> του καταναλωτή να αντισταθεί, με <b>συναισθηματική φόρτιση</b> που ενισχύει την κριτική του συγγραφέα.` }
  ]
},
/* ───────────────────────────── 4.2 ───────────────────────────── */
{
  id: "4.2", unit: 4, title: "Ενεργητική και παθητική σύνταξη: μετατροπή και λειτουργία στο κείμενο",
  book: "Πίνακας προδιαγραφών 2026 · Εκφραστικά/γλωσσικά μέσα: ενεργητική – παθητική σύνταξη",
  intro: "Πώς μετατρέπουμε μια πρόταση από την ενεργητική στην παθητική σύνταξη και τι αλλάζει στο ύφος και στην έμφαση;",
  thumb: LETTER("Ενεργ./Παθ."),
  theory: R`
<p>Το ίδιο γεγονός μπορεί να ειπωθεί με δύο τρόπους: «<i>Οι εθελοντές καθάρισαν την παραλία</i>» ή «<i>Η παραλία καθαρίστηκε από τους εθελοντές</i>». Η πληροφορία είναι η ίδια, αλλά η <b>έμφαση</b> αλλάζει. Στις Παγκύπριες ζητείται συχνά να μετατρέψεις μια πρόταση από την ενεργητική στην παθητική σύνταξη (ή αντίστροφα) και να εξηγήσεις τι πετυχαίνει ο συγγραφέας με την επιλογή του.</p>
<div class="figrow">
<div class="tbox def"><h4>Ενεργητική σύνταξη</h4>
<p>Το <b>υποκείμενο ενεργεί</b> και η ενέργεια περνά σε ένα <b>αντικείμενο</b>· το ρήμα είναι στην ενεργητική φωνή.</p>
<p><span class="na3S">Οι πολίτες</span> <span class="na3V">εξέλεξαν</span> <span class="na3O">τον νέο δήμαρχο</span>.</p></div>
<div class="tbox def"><h4>Παθητική σύνταξη</h4>
<p>Το <b>υποκείμενο δέχεται</b> την ενέργεια· το ρήμα είναι στην παθητική φωνή· αυτός που ενεργεί δηλώνεται με το <b>ποιητικό αίτιο</b> (από + αιτιατική).</p>
<p><span class="na3S">Ο νέος δήμαρχος</span> <span class="na3V">εκλέχτηκε</span> <span class="na3A">από τους πολίτες</span>.</p></div></div>
<div class="tbox thm"><h4>Βήματα μετατροπής από ενεργητική σε παθητική</h4>
<ol><li>Το <b>αντικείμενο</b> της ενεργητικής γίνεται <b>υποκείμενο</b> (σε ονομαστική).</li>
<li>Το ρήμα μπαίνει στην <b>παθητική φωνή</b>, στον <b>ίδιο χρόνο</b> και στο πρόσωπο/αριθμό του νέου υποκειμένου (εξέλεξαν → εκλέχτηκε· ψηφίζει → ψηφίζεται· θα ανακαινίσει → θα ανακαινιστεί).</li>
<li>Το <b>υποκείμενο</b> της ενεργητικής γίνεται <b>ποιητικό αίτιο</b>: από + αιτιατική (οι πολίτες → από τους πολίτες).</li>
<li>Οι άλλοι προσδιορισμοί (χρόνου, τόπου, τρόπου) μένουν ίδιοι.</li></ol>
<p>Η μετατροπή γίνεται μόνο με <b>μεταβατικά</b> ρήματα (που έχουν αντικείμενο). Το «Ο μαθητής κοιμάται» δεν μετατρέπεται.</p></div>
<div class="tbox def"><h4>Τι πετυχαίνει κάθε σύνταξη</h4>
<table class="tbl"><tr><th>Ενεργητική</th><th>Παθητική</th></tr>
<tr><td>Έμφαση στο <b>πρόσωπο που ενεργεί</b> (τον δράστη) και στην <b>ευθύνη</b> του.</td><td>Έμφαση στην <b>ενέργεια</b>, στο <b>αποτέλεσμα</b> ή σε αυτόν που τη δέχεται.</td></tr>
<tr><td>Ζωντάνια, αμεσότητα, παραστατικότητα, ρέων λόγος.</td><td><b>Αντικειμενικότητα</b>, απρόσωπο και πιο επίσημο ύφος (επιστημονικά, δημοσιογραφικά, διοικητικά κείμενα).</td></tr>
<tr><td>Σαφήνεια ως προς το ποιος έκανε τι.</td><td>Δυνατότητα να <b>αποσιωπηθεί</b> ο δράστης όταν είναι άγνωστος, αυτονόητος ή όταν ο συγγραφέας δεν θέλει να τον κατονομάσει («Πάρθηκαν αποφάσεις…»).</td></tr></table></div>
<div class="tbox ex"><h4>Παράδειγμα με αιτιολόγηση</h4>
<p>«<i>Το σκάνδαλο αποκαλύφθηκε τον περασμένο μήνα.</i>» — Η παθητική σύνταξη χωρίς ποιητικό αίτιο εστιάζει στο ίδιο το γεγονός (την αποκάλυψη) και όχι σε αυτούς που το αποκάλυψαν· ο λόγος γίνεται απρόσωπος και αντικειμενικός, όπως ταιριάζει σε μια είδηση.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Αλλάζουμε <b>χρόνο</b> στο ρήμα κατά τη μετατροπή (εξέλεξαν → «εκλέγεται» ✗ — σωστό: «εκλέχτηκε»).</li>
<li>Αντιστρέφουμε τους ρόλους («Οι πολίτες εκλέχτηκαν από τον δήμαρχο» ✗).</li>
<li>Ξεχνάμε τη συμφωνία ρήματος και νέου υποκειμένου σε αριθμό («Τα γραπτά διορθώθηκε» ✗).</li>
<li>Ορθογραφία των παθητικών τύπων: γράφτηκε, ψηφίστηκε, εκλέχτηκε (ή εξελέγη), συνελήφθησαν.</li></ul></div>
`,
  widget: "na3voice",
  gen: "na3gvoice",
  exercises: [
    { level: 1, type: "mc", q: R`Η περίοδος «<b>Η εκδήλωση οργανώθηκε από τους μαθητές.</b>» είναι σε…`, options: ["παθητική σύνταξη", "ενεργητική σύνταξη"], correct: 0,
      hint: R`Το υποκείμενο ενεργεί ή δέχεται την ενέργεια;`, sol: R`<b>Παθητική</b>: το υποκείμενο «η εκδήλωση» δέχεται την ενέργεια, το ρήμα είναι στην παθητική φωνή και υπάρχει ποιητικό αίτιο («από τους μαθητές»).` },
    { level: 1, type: "mc", q: R`Στη μετατροπή από ενεργητική σε παθητική σύνταξη, το υποκείμενο της ενεργητικής γίνεται…`, options: ["ποιητικό αίτιο (από + αιτιατική)", "αντικείμενο", "κατηγορούμενο", "επιρρηματικός προσδιορισμός χρόνου"], correct: 0,
      hint: R`«Οι πολίτες εξέλεξαν…» → «… εκλέχτηκε από τους πολίτες».`, sol: R`Το υποκείμενο της ενεργητικής γίνεται <b>ποιητικό αίτιο</b>, ενώ το αντικείμενο γίνεται υποκείμενο.` },
    { level: 2, q: R`Να μετατρέψετε την περίοδο στην <b>παθητική σύνταξη</b> (στον ίδιο χρόνο):<div class="nepass">Οι δημοσιογράφοι αποκάλυψαν το σκάνδαλο.</div>`, fields: [{ label: "Παθητική:", ans: ["Το σκάνδαλο αποκαλύφθηκε από τους δημοσιογράφους", "Αποκαλύφθηκε το σκάνδαλο από τους δημοσιογράφους", "Το σκάνδαλο αποκαλύφτηκε από τους δημοσιογράφους", "Αποκαλύφτηκε το σκάνδαλο από τους δημοσιογράφους"], text: true, nopunct: true, wide: true }],
      hint: R`αντικείμενο → υποκείμενο · αποκάλυψαν (αόριστος) → παθητικός αόριστος · οι δημοσιογράφοι → από τους δημοσιογράφους.`, sol: R`«<b>Το σκάνδαλο αποκαλύφθηκε από τους δημοσιογράφους.</b>» (δεκτό και «αποκαλύφτηκε»).` },
    { level: 2, q: R`Να μετατρέψετε την περίοδο στην <b>παθητική σύνταξη</b> (στον ίδιο χρόνο):<div class="nepass">Η Βουλή θα ψηφίσει τον νέο νόμο.</div>`, fields: [{ label: "Παθητική:", ans: ["Ο νέος νόμος θα ψηφιστεί από τη Βουλή", "Ο νέος νόμος θα ψηφισθεί από τη Βουλή", "Θα ψηφιστεί ο νέος νόμος από τη Βουλή", "Θα ψηφισθεί ο νέος νόμος από τη Βουλή", "Ο νέος νόμος θα ψηφιστεί από την Βουλή"], text: true, nopunct: true, wide: true }],
      hint: R`Ο μέλλοντας «θα ψηφίσει» γίνεται παθητικός μέλλοντας «θα ψηφιστεί».`, sol: R`«<b>Ο νέος νόμος θα ψηφιστεί από τη Βουλή.</b>»` },
    { level: 2, q: R`Να μετατρέψετε την περίοδο στην <b>ενεργητική σύνταξη</b> (στον ίδιο χρόνο):<div class="nepass">Τα γραπτά διορθώθηκαν από τον καθηγητή.</div>`, fields: [{ label: "Ενεργητική:", ans: ["Ο καθηγητής διόρθωσε τα γραπτά", "Τα γραπτά τα διόρθωσε ο καθηγητής", "Διόρθωσε ο καθηγητής τα γραπτά"], text: true, nopunct: true, wide: true }],
      hint: R`Το ποιητικό αίτιο γίνεται υποκείμενο, το υποκείμενο γίνεται αντικείμενο.`, sol: R`«<b>Ο καθηγητής διόρθωσε τα γραπτά.</b>»` },
    { level: 2, type: "mc", q: R`Ποια είναι η σωστή μετατροπή της περιόδου «Ο σεισμός κατέστρεψε πολλά σπίτια» σε παθητική σύνταξη;`, options: ["Πολλά σπίτια καταστράφηκαν από τον σεισμό.", "Πολλά σπίτια καταστρέφονται από τον σεισμό.", "Ο σεισμός καταστράφηκε από πολλά σπίτια.", "Πολλά σπίτια κατέστρεψαν τον σεισμό."], correct: 0,
      hint: R`Πρόσεξε τον χρόνο του ρήματος και τους ρόλους.`, sol: R`«Πολλά σπίτια <b>καταστράφηκαν</b> από τον σεισμό»: ίδιος χρόνος (αόριστος), το αντικείμενο έγινε υποκείμενο, το υποκείμενο ποιητικό αίτιο. Η επιλογή με το «καταστρέφονται» αλλάζει χρόνο και οι άλλες αντιστρέφουν τους ρόλους.` },
    { level: 2, type: "mc", q: R`Ποια ρηματική περίοδος <b>δεν</b> μπορεί να μετατραπεί σε παθητική σύνταξη;`, options: ["Ο μαθητής κοιμήθηκε νωρίς.", "Ο μαθητής έγραψε την έκθεση.", "Ο μαθητής διάβασε το βιβλίο.", "Ο μαθητής βοήθησε τον φίλο του."], correct: 0,
      hint: R`Ποιο ρήμα δεν έχει αντικείμενο;`, sol: R`Το «κοιμήθηκε» είναι <b>αμετάβατο</b> (δεν έχει αντικείμενο), άρα δεν μετατρέπεται σε παθητική. Οι άλλες περίοδοι έχουν μεταβατικά ρήματα με αντικείμενο.` },
    { level: 3, type: "mc", q: R`Θέμα τύπου Παγκυπρίων: Γιατί ο συγγραφέας προτιμά την <b>παθητική σύνταξη</b> στην υπογραμμισμένη περίοδο;${PASSAGE(`Τα τελευταία δέκα χρόνια [[καταστράφηκαν από πυρκαγιές χιλιάδες στρέμματα δάσους]]. Η απώλεια αυτή δεν αφορά μόνο τη φύση, αλλά και την οικονομία και την υγεία μας.`, { title: "Πρωτότυπο κείμενο εξάσκησης" })}`,
      options: ["Για να δώσει έμφαση στο αποτέλεσμα, την καταστροφή των δασών, και όχι στο αίτιο, προσδίδοντας αντικειμενικότητα", "Για να δείξει ποιος είναι υπεύθυνος για τις πυρκαγιές", "Για να κάνει τον λόγο πιο προσωπικό και οικείο", "Γιατί το ρήμα δεν μπορεί να μπει στην ενεργητική φωνή"], correct: 0,
      hint: R`Ποια λέξη έρχεται στο προσκήνιο με την παθητική σύνταξη; Ποιο είναι το θέμα της επόμενης περιόδου;`, sol: R`Με την παθητική σύνταξη έρχεται στο προσκήνιο το <b>αποτέλεσμα</b> (η καταστροφή χιλιάδων στρεμμάτων), το οποίο σχολιάζεται στην επόμενη περίοδο («Η απώλεια αυτή…»). Ο λόγος γίνεται πιο <b>αντικειμενικός</b>, σαν διαπίστωση. Θα μπορούσε να γραφτεί και ενεργητικά («Οι πυρκαγιές κατέστρεψαν…»), άρα η απάντηση ότι «το ρήμα δεν μπορεί να μπει στην ενεργητική φωνή» είναι λάθος.` }
  ]
},
/* ───────────────────────────── 4.3 ───────────────────────────── */
{
  id: "4.3", unit: 4, title: "Παρατακτική και υποτακτική σύνδεση, μικροπερίοδος και μακροπερίοδος λόγος, ρηματικά πρόσωπα",
  book: "Πίνακας προδιαγραφών 2026 · Εκφραστικά/γλωσσικά μέσα: παρατακτική – υποτακτική σύνδεση, μικροπερίοδος/μακροπερίοδος λόγος, ρηματικά πρόσωπα",
  intro: "Τι πετυχαίνει ο συγγραφέας με τον μακροπερίοδο ή τον μικροπερίοδο λόγο, με την παράταξη ή την υπόταξη, με το α΄ ή το γ΄ πρόσωπο;",
  thumb: LETTER("Σύνταξη"),
  theory: R`
<p>Η σύνταξη δεν είναι μόνο γραμματική· είναι και <b>επιλογή ύφους</b>. Ο ίδιος συγγραφέας μπορεί να γράψει με σύντομες, «κοφτές» περιόδους ή με μεγάλες, σύνθετες περιόδους· να ενώνει τις προτάσεις με «και» ή με «επειδή»· να μιλά σε α΄, β΄ ή γ΄ πρόσωπο. Στις Παγκύπριες αυτές οι επιλογές εξετάζονται πολύ συχνά — για παράδειγμα, το 2026 ζητήθηκε να εξηγηθούν δύο σκοποί που εξυπηρετεί ο <b>μακροπερίοδος λόγος</b> σε μια παράγραφο. Πάντα απαντάμε <b>σε σχέση με το νόημα</b> του συγκεκριμένου σημείου του κειμένου.</p>
<div class="tbox def"><h4>Παρατακτική και υποτακτική σύνδεση</h4>
<p><b>Παράταξη:</b> ισοδύναμες προτάσεις ενώνονται με παρατακτικούς συνδέσμους (<i>και, ούτε, ή, αλλά, όμως, ωστόσο, λοιπόν</i>) ή χωρίς σύνδεσμο (<b>ασύνδετο σχήμα</b>, με κόμματα). Δίνει <b>απλότητα</b>, φυσικότητα, ροή, γρήγορο ρυθμό — συχνή στην αφήγηση και στον προφορικό λόγο.</p>
<p><b>Υπόταξη:</b> μια δευτερεύουσα πρόταση εξαρτάται από μια κύρια (<i>επειδή, όταν, αν, ότι, που, για να, ώστε, παρόλο που, μήπως</i>). Δηλώνει τις <b>λογικές σχέσεις</b> ανάμεσα στις ιδέες (αιτία, σκοπό, όρο, αποτέλεσμα, χρόνο, εναντίωση) — συχνή στον επιχειρηματολογικό λόγο, που γίνεται πιο <b>σύνθετος και αναλυτικός</b>.</p></div>
<div class="figrow">
<div class="tbox def"><h4>Μικροπερίοδος λόγος</h4>
<p>Σύντομες περίοδοι, λίγες προτάσεις η καθεμιά.</p>
<ul><li><b>σαφήνεια</b>, αμεσότητα, λιτότητα</li><li><b>γρήγορος ρυθμός</b>, ζωντάνια, ένταση, δραματικότητα</li><li>έμφαση σε κάθε πληροφορία χωριστά</li><li>εύκολη ανάγνωση (π.χ. ειδήσεις, ομιλίες)</li></ul></div>
<div class="tbox def"><h4>Μακροπερίοδος λόγος</h4>
<p>Μεγάλες περίοδοι με πολλές προτάσεις, συνήθως με υπόταξη.</p>
<ul><li><b>πληρότητα</b>, ανάλυση, ακρίβεια</li><li>παρουσίαση πολλών στοιχείων με <b>συσσώρευση</b> (απαρίθμηση, κλιμάκωση)</li><li>ανάδειξη <b>λογικών σχέσεων</b></li><li><b>επίσημο</b>, επιστημονικό ή δοκιμιακό ύφος· απαιτεί προσοχή από τον αναγνώστη</li></ul></div></div>
<div class="tbox def"><h4>Ρηματικά πρόσωπα και η λειτουργία τους</h4>
<table class="tbl"><tr><th>Πρόσωπο</th><th>Λειτουργία</th></tr>
<tr><td><b>α΄ ενικό</b> (πιστεύω, θυμάμαι)</td><td>Προσωπική άποψη ή εμπειρία· <b>υποκειμενικότητα</b>, αμεσότητα, ειλικρίνεια, συναισθηματική φόρτιση.</td></tr>
<tr><td><b>α΄ πληθυντικό</b> (πρέπει να αλλάξουμε, ας σκεφτούμε)</td><td>Ο συγγραφέας εντάσσει τον εαυτό του στο σύνολο· <b>οικειότητα</b>, συλλογική ευθύνη, προτροπή· κερδίζει τον αναγνώστη.</td></tr>
<tr><td><b>β΄ ενικό / πληθυντικό</b> (σκέψου, σκεφτείτε)</td><td>Άμεση απεύθυνση στον αναγνώστη/ακροατή· <b>διαλογικότητα</b>, ζωντάνια, προτρεπτικός ή παραινετικός λόγος (π.χ. ομιλία).</td></tr>
<tr><td><b>γ΄ πρόσωπο</b> και απρόσωπες συντάξεις (οι νέοι αντιμετωπίζουν, είναι γεγονός ότι)</td><td><b>Αντικειμενικότητα</b>, αποστασιοποίηση, γενίκευση· επίσημο, επιστημονικό ύφος.</td></tr></table></div>
<div class="tbox ex"><h4>Ενδεικτική απάντηση για τον μακροπερίοδο λόγο</h4>
${PASSAGE(`Ο σημερινός μαθητής, που παρακολουθεί μαθήματα έξι και επτά ωρών, γυρίζει στο σπίτι για να διαβάσει, τρέχει σε φροντιστήρια και αθλητικές προπονήσεις και μένει ξύπνιος ως αργά για να τελειώσει τις εργασίες του, δεν είναι το ανέμελο παιδί που θυμούνται οι παλαιότερες γενιές, αλλά ένας μικρός εργαζόμενος με ωράριο που θα ζήλευε και ο πιο απασχολημένος ενήλικας.`, { title: "Πρωτότυπο κείμενο εξάσκησης" })}
<details class="steps"><summary>Ενδεικτική απάντηση</summary>
<p>Με τον μακροπερίοδο λόγο ο συγγραφέας: (α) <b>συσσωρεύει</b> σε μία περίοδο τις πολλές υποχρεώσεις του μαθητή (σχολείο, διάβασμα, φροντιστήρια, προπονήσεις, εργασίες), ώστε ο αναγνώστης να νιώσει το βάρος της μέρας του· (β) αναδεικνύει την <b>αντίθεση</b> ανάμεσα στην εικόνα του «ανέμελου παιδιού» και του «μικρού εργαζόμενου», δένοντας λογικά τα στοιχεία σε ένα ενιαίο συμπέρασμα· παράλληλα προσδίδει στον λόγο πληρότητα και ένταση.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Γράφουμε γενικόλογα «ο μακροπερίοδος λόγος κάνει το κείμενο πιο ωραίο». Ζητείται <b>λειτουργία σε σχέση με το νόημα</b> της παραγράφου.</li>
<li>Συγχέουμε την <b>περίοδο</b> (από τελεία σε τελεία) με την <b>πρόταση</b> (ένα ρήμα και οι όροι του).</li>
<li>Για το α΄ πληθυντικό γράφουμε μόνο «οικειότητα»· εξήγησε και <b>γιατί</b>: ο συγγραφέας εντάσσει τον εαυτό του στο πρόβλημα και κερδίζει τον αναγνώστη.</li></ul></div>
`,
  widget: "na3syn",
  gen: "na3gsyn",
  exercises: [
    { level: 1, type: "mc", q: R`Η περίοδος «<b>Ήρθε, είδε, νίκησε.</b>» σχηματίζεται με…`, options: ["ασύνδετο σχήμα", "υποτακτική σύνδεση", "μακροπερίοδο λόγο", "παθητική σύνταξη"], correct: 0,
      hint: R`Υπάρχει κάποιος σύνδεσμος ανάμεσα στα ρήματα;`, sol: R`<b>Ασύνδετο σχήμα</b>: οι προτάσεις παρατίθενται με κόμματα χωρίς σύνδεσμο. Δίνει γρήγορο ρυθμό, ένταση και ζωντάνια.` },
    { level: 1, type: "mc", q: R`Η περίοδος «<b>Επειδή έβρεχε, η εκδρομή αναβλήθηκε.</b>» είναι παράδειγμα…`, options: ["υποτακτικής σύνδεσης", "παρατακτικής σύνδεσης", "ασύνδετου σχήματος", "ρητορικού ερωτήματος"], correct: 0,
      hint: R`Η πρόταση «επειδή έβρεχε» στέκεται μόνη της;`, sol: R`<b>Υπόταξη</b>: η δευτερεύουσα αιτιολογική πρόταση «επειδή έβρεχε» εξαρτάται από την κύρια «η εκδρομή αναβλήθηκε».` },
    { level: 1, type: "mc", q: R`Ο <b>μικροπερίοδος</b> λόγος προσδίδει συνήθως…`, options: ["σαφήνεια, γρήγορο ρυθμό και ένταση", "πληρότητα, ανάλυση και επισημότητα", "αοριστία και ασάφεια", "επιστημονική ακρίβεια με πολλές δευτερεύουσες προτάσεις"], correct: 0,
      hint: R`Σύντομες περίοδοι = ;`, sol: R`Οι σύντομες περίοδοι δίνουν <b>σαφήνεια, αμεσότητα, γρήγορο ρυθμό, ένταση και δραματικότητα</b>. Η πληρότητα και η ανάλυση χαρακτηρίζουν τον μακροπερίοδο λόγο.` },
    { level: 2, q: R`Πόσες <b>περίοδοι</b> υπάρχουν στο απόσπασμα;${PASSAGE(`Η πόλη ξυπνά. Τα αυτοκίνητα γεμίζουν τους δρόμους, οι άνθρωποι τρέχουν. Κανείς δεν κοιτάζει τον ουρανό. Κι όμως, ο ουρανός είναι εκεί, γαλάζιος, κάθε πρωί.`)}`, fields: [{ label: "Περίοδοι:", ans: 4 }],
      hint: R`Η περίοδος τελειώνει με τελεία (ή ερωτηματικό/θαυμαστικό).`, sol: R`<b>4</b> περίοδοι (τέσσερις τελείες). Είναι μικροπερίοδος λόγος, που δίνει γρήγορο ρυθμό και στιγμιότυπα της πόλης.` },
    { level: 2, type: "mc", q: R`Σε ποιο ρηματικό πρόσωπο είναι η περίοδος «<b>Ας αναλογιστούμε τι κόσμο θα αφήσουμε στα παιδιά μας.</b>» και τι πετυχαίνει;`, options: ["α΄ πληθυντικό: ο συγγραφέας εντάσσει τον εαυτό του στο σύνολο και καλεί σε κοινό προβληματισμό", "γ΄ πρόσωπο: δίνει αντικειμενικότητα και αποστασιοποίηση", "β΄ ενικό: απευθύνεται σε έναν συγκεκριμένο αναγνώστη", "α΄ ενικό: εκφράζει μια καθαρά προσωπική εμπειρία"], correct: 0,
      hint: R`Ποιοι «αναλογίζονται»; Μόνο ο συγγραφέας;`, sol: R`<b>α΄ πληθυντικό</b> (ας αναλογιστούμε, θα αφήσουμε, μας): ο συγγραφέας μιλά ως μέλος της κοινωνίας, δημιουργεί οικειότητα και συλλογική ευθύνη και προτρέπει σε προβληματισμό.` },
    { level: 2, type: "mc", q: R`Ποια περίοδος έχει <b>παρατακτική</b> σύνδεση;`, options: ["Μελέτησε πολύ, αλλά δεν πέτυχε τον στόχο του.", "Όταν τελείωσε η παράσταση, το κοινό σηκώθηκε όρθιο.", "Πιστεύω ότι η παιδεία είναι το πολυτιμότερο αγαθό.", "Διάβαζε κάθε βράδυ για να πετύχει στις εξετάσεις."], correct: 0,
      hint: R`Ψάξε παρατακτικό σύνδεσμο: και, αλλά, όμως, ή, ούτε…`, sol: R`«Μελέτησε πολύ, <b>αλλά</b> δεν πέτυχε»: δύο ισοδύναμες κύριες προτάσεις με τον αντιθετικό παρατακτικό σύνδεσμο «αλλά». Οι άλλες περίοδοι έχουν δευτερεύουσες προτάσεις (χρονική, ειδική, τελική).` },
    { level: 2, type: "mc", q: R`Ποια είναι η λειτουργία του <b>γ΄ προσώπου</b> στο απόσπασμα;${PASSAGE(`Οι έφηβοι περνούν κατά μέσο όρο έξι ώρες την ημέρα μπροστά σε οθόνες. Οι ειδικοί επισημαίνουν ότι η υπερβολική χρήση επηρεάζει τον ύπνο και τη συγκέντρωση.`)}`, options: ["Προσδίδει αντικειμενικότητα και αποστασιοποίηση, ώστε τα στοιχεία να παρουσιάζονται ως διαπιστώσεις", "Δημιουργεί οικειότητα με τον αναγνώστη", "Δείχνει ότι ο συγγραφέας μιλά για τον εαυτό του", "Προσδίδει χιουμοριστικό τόνο"], correct: 0,
      hint: R`Ποιος «μιλά» και πόσο εμπλέκεται συναισθηματικά;`, sol: R`Το <b>γ΄ πρόσωπο</b> κρατά τον συγγραφέα σε απόσταση· οι πληροφορίες παρουσιάζονται ως <b>αντικειμενικά δεδομένα</b> (μαζί με τη γνώμη ειδικών), κάτι που ενισχύει την αξιοπιστία.` },
    { level: 3, type: "mc", q: R`Θέμα τύπου Παγκυπρίων: Ποια απάντηση εξηγεί σωστά <b>δύο σκοπούς</b> του μακροπερίοδου λόγου στο απόσπασμα;${PASSAGE(`Η γιαγιά μου, που μεγάλωσε σε ένα χωριό χωρίς ρεύμα, έμαθε να γράφει μόνη της με ένα μολύβι που της χάρισε ο δάσκαλος, δούλευε από τα δώδεκα στα χωράφια και μεγάλωσε έξι παιδιά, όταν ο παππούς έφυγε μετανάστης, μού έδειξε ότι η μόρφωση δεν είναι προνόμιο των λίγων αλλά κατάκτηση όσων τη διψούν.`, { title: "Πρωτότυπο κείμενο εξάσκησης" })}`,
      options: ["Συσσωρεύει πολλά στοιχεία από τη δύσκολη ζωή της γιαγιάς, ώστε να γίνει πλήρης και συγκινητική η εικόνα της, και τα συνδέει λογικά με το τελικό συμπέρασμα ότι η μόρφωση είναι κατάκτηση όσων τη διψούν", "Δίνει γρήγορο ρυθμό και δραματικότητα με σύντομες, κοφτές προτάσεις", "Κάνει τον λόγο απλό και προφορικό, όπως σε έναν διάλογο", "Αποκρύπτει ποιος είναι ο ηθικός καταναλωτής"], correct: 0,
      hint: R`Πόσα στοιχεία χωρούν σε αυτή τη μία περίοδο; Πού καταλήγουν;`, sol: R`Ο μακροπερίοδος λόγος (α) <b>συσσωρεύει/απαριθμεί</b> πολλά βιογραφικά στοιχεία, δίνοντας πληρότητα, παραστατικότητα και συναισθηματική φόρτιση στην εικόνα της γιαγιάς, και (β) τα <b>συνδέει λογικά</b> σε μία ενιαία περίοδο με το συμπέρασμα (η μόρφωση ως κατάκτηση), προσδίδοντας ένταση. Οι «σύντομες, κοφτές προτάσεις» περιγράφουν τον μικροπερίοδο λόγο.` }
  ]
},
/* ───────────────────────────── 4.4 ───────────────────────────── */
{
  id: "4.4", unit: 4, title: "Λεξιλόγιο: συνώνυμα, αντώνυμα και πολυσημία λέξεων στο συγκείμενο",
  book: "Πίνακας προδιαγραφών 2026 · Λεξιλόγιο: πολυσημία, συνώνυμα, αντώνυμα",
  intro: "Πώς βρίσκουμε το σωστό συνώνυμο ή αντώνυμο μιας λέξης «στη συγκεκριμένη πρόταση», όπως ζητούν οι Παγκύπριες;",
  thumb: LETTER("≠ ="),
  theory: R`
<p>Οι ασκήσεις λεξιλογίου είναι από τις πιο «σίγουρες» μονάδες στις Παγκύπριες — αν ξέρεις τους κανόνες. Το 2026, για παράδειγμα, ζητήθηκε να αντικατασταθούν δύο υπογραμμισμένες λέξεις με ένα αντώνυμό τους «ώστε να δίνεται η αντίθετη σημασία από αυτή που έχει στη συγκεκριμένη πρόταση». Η φράση-κλειδί είναι <b>«στη συγκεκριμένη πρόταση»</b>: η σωστή απάντηση εξαρτάται από το <b>συγκείμενο</b>, δηλαδή από τις λέξεις που περιβάλλουν την υπογραμμισμένη λέξη.</p>
<div class="tbox def"><h4>Συνώνυμα και αντώνυμα</h4>
<p><b>Συνώνυμα</b> είναι λέξεις με την ίδια ή παρόμοια σημασία (ραγδαία – ταχύτατη). Σπάνια δύο λέξεις είναι απόλυτα ισοδύναμες· διαφέρουν συχνά στο ύφος (λόγιο/καθημερινό) ή στη συναισθηματική φόρτιση.</p>
<p><b>Αντώνυμα</b> είναι λέξεις με αντίθετη σημασία (επιβλαβής – ωφέλιμος, αύξηση – μείωση). Σχηματίζονται και με αρνητικά προθήματα: <i>α-/αν-</i> (δίκαιος – άδικος, ασαφής), <i>δυσ-</i> (ευνοϊκός – δυσμενής), ή με αλλαγή προθέματος (εισαγωγή – εξαγωγή).</p></div>
<div class="tbox def"><h4>Πολυσημία</h4>
<p>Μια λέξη είναι <b>πολύσημη</b> όταν έχει περισσότερες από μία σημασίες. Π.χ. <b>ρίζα</b>: η ρίζα του δέντρου (τμήμα φυτού) · η ρίζα του προβλήματος (αιτία) · η ρίζα του ρήματος (γραμματικός όρος) · η τετραγωνική ρίζα (μαθηματικά). Γι' αυτό ένα αντώνυμο ή συνώνυμο ταιριάζει σε μία σημασία αλλά όχι σε άλλη: το «σκληρός» έχει αντώνυμο «μαλακός» για ένα στρώμα, αλλά «επιεικής» για έναν καθηγητή.</p></div>
<div class="tbox thm"><h4>Οι τρεις κανόνες της σωστής απάντησης</h4>
<ol><li><b>Συγκείμενο:</b> διάβασε ολόκληρη την πρόταση και βρες τη σημασία της λέξης εκεί.</li>
<li><b>Ίδιος γραμματικός τύπος:</b> ίδιο μέρος του λόγου, ίδια πτώση, αριθμός και γένος (ή πρόσωπο, χρόνος για ρήματα). «Οι <u>επιβλαβείς</u> ουσίες» → «οι <b>ωφέλιμες</b> / <b>αβλαβείς</b> ουσίες» (θηλυκό, πληθυντικός, ονομαστική).</li>
<li><b>Δοκιμή αντικατάστασης:</b> ξαναδιάβασε την πρόταση με τη λέξη σου· πρέπει να στέκει γραμματικά και να δίνει την ίδια (συνώνυμο) ή την αντίθετη (αντώνυμο) σημασία.</li></ol>
<p>Στις Παγκύπριες το ορθογραφικό ή γραμματικό λάθος κοστίζει μονάδες· γράψε μια λέξη που ξέρεις να ορθογραφείς.</p></div>
<div class="tbox ex"><h4>Παράδειγμα</h4>
<p>«Οι νέοι λαμπτήρες επιτρέπουν μεγάλη <u>εξοικονόμηση</u> ενέργειας.» → Αντώνυμο: <b>σπατάλη</b> (ή κατασπατάληση) ενέργειας.</p>
<p>«Ο καθηγητής ήταν <u>αυστηρός</u> αλλά δίκαιος.» → Συνώνυμο: <b>απαιτητικός</b>. Αντώνυμο: <b>επιεικής</b> (όχι «μαλακός», που ταιριάζει σε υλικά).</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Αλλάζουμε μέρος του λόγου (π.χ. δίνουμε ουσιαστικό αντί για επίθετο) ή πτώση/αριθμό.</li>
<li>Δίνουμε αντώνυμο της «γενικής» σημασίας της λέξης και όχι της σημασίας της στη συγκεκριμένη πρόταση.</li>
<li>Δίνουμε περισσότερες λέξεις απ' όσες ζητούνται — γράψε ακριβώς όσες ζητά η ερώτηση, για να μην κινδυνεύσεις να μη βαθμολογηθεί η απάντησή σου.</li>
<li>Γράφουμε απλώς την άρνηση («όχι επιβλαβείς») αντί για αντώνυμη λέξη.</li></ul></div>
`,
  widget: "na3lex",
  gen: "na3glex",
  exercises: [
    { level: 1, q: R`Να αντικαταστήσετε την υπογραμμισμένη λέξη με ένα (1) <b>αντώνυμό</b> της, ώστε να δίνεται η αντίθετη σημασία στη συγκεκριμένη πρόταση:<div class="nepass">Η <u>αύξηση</u> της ανεργίας ανησυχεί τους νέους.</div>`, fields: [{ label: "Αντώνυμο:", ans: ["μείωση", "ελάττωση", "συρρίκνωση", "πτώση", "περιορισμός", "κάμψη", "αποκλιμάκωση", "υποχώρηση"], text: true, nopunct: true }],
      hint: R`Ουσιαστικό, θηλυκό, ονομαστική ενικού.`, sol: R`Π.χ. <b>μείωση</b> / ελάττωση / συρρίκνωση / πτώση της ανεργίας.` },
    { level: 1, q: R`Να αντικαταστήσετε την υπογραμμισμένη λέξη με ένα (1) <b>αντώνυμό</b> της:<div class="nepass">Ο ομιλητής έκανε μια <u>σαφή</u> δήλωση.</div>`, fields: [{ label: "Αντώνυμο:", ans: ["ασαφή", "αόριστη", "θολή", "δυσνόητη", "διφορούμενη", "συγκεχυμένη", "νεφελώδη", "ακαθόριστη", "γενικόλογη"], text: true, nopunct: true }],
      hint: R`Επίθετο, θηλυκό, αιτιατική ενικού (μια … δήλωση).`, sol: R`Π.χ. <b>ασαφή</b> / αόριστη / θολή / διφορούμενη δήλωση.` },
    { level: 1, q: R`Να αντικαταστήσετε την υπογραμμισμένη λέξη με ένα (1) <b>συνώνυμό</b> της, χωρίς να αλλάξει το νόημα:<div class="nepass">Η <u>ραγδαία</u> ανάπτυξη της τεχνολογίας αλλάζει τη ζωή μας.</div>`, fields: [{ label: "Συνώνυμο:", ans: ["ταχύτατη", "γρήγορη", "ταχεία", "αλματώδης", "ορμητική", "ταχύρρυθμη", "θεαματική", "ιλιγγιώδης"], text: true, nopunct: true }],
      hint: R`Επίθετο, θηλυκό, ονομαστική ενικού.`, sol: R`Π.χ. <b>ταχύτατη</b> / γρήγορη / αλματώδης ανάπτυξη.` },
    { level: 2, q: R`Να αντικαταστήσετε την υπογραμμισμένη λέξη με ένα (1) <b>αντώνυμό</b> της, ώστε να δίνεται η αντίθετη σημασία στη συγκεκριμένη πρόταση:<div class="nepass">Οι <u>επιβλαβείς</u> ουσίες του τσιγάρου προκαλούν σοβαρές ασθένειες.</div>`, fields: [{ label: "Αντώνυμο:", ans: ["αβλαβείς", "ωφέλιμες", "επωφελείς", "ακίνδυνες", "ευεργετικές"], text: true, nopunct: true }],
      hint: R`Το νέο επίθετο πρέπει να συμφωνεί με το «ουσίες» (θηλυκό, πληθυντικός, ονομαστική).`, sol: R`Π.χ. <b>αβλαβείς</b> / ακίνδυνες / ωφέλιμες ουσίες. (Το «ωφέλιμος» ως ενικός αρσενικός θα ήταν λάθος τύπος.)` },
    { level: 2, q: R`Να αντικαταστήσετε την υπογραμμισμένη λέξη με ένα (1) <b>αντώνυμό</b> της:<div class="nepass">Οι ειδικοί <u>επιβεβαίωσαν</u> την είδηση.</div>`, fields: [{ label: "Αντώνυμο:", ans: ["διέψευσαν", "αμφισβήτησαν", "ανασκεύασαν", "αναίρεσαν", "διάψευσαν"], text: true, nopunct: true }],
      hint: R`Ρήμα, γ΄ πληθυντικό, αόριστος.`, sol: R`Π.χ. <b>διέψευσαν</b> / αμφισβήτησαν / αναίρεσαν την είδηση.` },
    { level: 2, q: R`Να αντικαταστήσετε την υπογραμμισμένη λέξη με ένα (1) <b>συνώνυμό</b> της:<div class="nepass">Η διαφήμιση δημιουργεί <u>πλασματικές</u> ανάγκες.</div>`, fields: [{ label: "Συνώνυμο:", ans: ["ψεύτικες", "τεχνητές", "επίπλαστες", "πλαστές", "ανύπαρκτες", "φανταστικές", "κατασκευασμένες", "εικονικές", "ψευδείς"], text: true, nopunct: true }],
      hint: R`Τι είδους ανάγκες «δημιουργεί» η διαφήμιση; Ανάγκες που δεν υπάρχουν πραγματικά.`, sol: R`Π.χ. <b>τεχνητές</b> / επίπλαστες / ψεύτικες ανάγκες.` },
    { level: 2, type: "mc", q: R`Σε ποια πρόταση η λέξη «<b>σταθμός</b>» σημαίνει «ορόσημο, καθοριστικό γεγονός»;`, options: ["Η επανάσταση αποτέλεσε σταθμό στην ιστορία της χώρας.", "Ο σιδηροδρομικός σταθμός ήταν γεμάτος ταξιδιώτες.", "Άκουσε τις ειδήσεις από τον ραδιοφωνικό σταθμό.", "Ο πυροσβεστικός σταθμός βρίσκεται στο κέντρο."], correct: 0,
      hint: R`Πολυσημία: η σημασία κρίνεται από το συγκείμενο.`, sol: R`Στην πρόταση με την επανάσταση ο «σταθμός» έχει μεταφορική σημασία (<b>ορόσημο</b>)· στις άλλες σημαίνει τόπο στάσης ή φορέα/εγκατάσταση.` },
    { level: 2, type: "mc", q: R`Ποιο είναι το κατάλληλο <b>αντώνυμο</b> της υπογραμμισμένης λέξης στην πρόταση «Ο καθηγητής ήταν <u>σκληρός</u> με τους μαθητές του»;`, options: ["επιεικής", "αυστηρός", "εύθραυστος", "υγρός"], correct: 0,
      hint: R`Η λέξη αναφέρεται σε συμπεριφορά ανθρώπου, όχι σε υλικό.`, sol: R`Σε ανθρώπινη συμπεριφορά το αντώνυμο του «σκληρός» είναι <b>επιεικής</b>. Το «αυστηρός» είναι συνώνυμο, ενώ τα «εύθραυστος» και «υγρός» αφορούν υλικά. Η πολυσημία καθορίζει το σωστό αντώνυμο.` },
    { level: 3, q: R`Θέμα τύπου Παγκυπρίων: Να αντικαταστήσετε την υπογραμμισμένη λέξη με ένα (1) <b>αντώνυμό</b> της, ώστε να δίνεται η αντίθετη σημασία από αυτή που έχει στη συγκεκριμένη πρόταση:${PASSAGE(`Ένας καλός ιστορικός δεν αποδέχεται [[άκριτα]] τις μαρτυρίες των πηγών· τις διασταυρώνει και τις αξιολογεί.`, { title: "Πρωτότυπο κείμενο εξάσκησης" })}`, fields: [{ label: "Αντώνυμο:", ans: ["κριτικά", "συνειδητά", "προσεκτικά", "με κρίση", "επιλεκτικά", "συνετά", "με κριτική σκέψη", "εμπεριστατωμένα", "λελογισμένα"], text: true, nopunct: true }],
      hint: R`Επίρρημα — η απάντηση πρέπει να είναι κι αυτή επίρρημα (ή επιρρηματική έκφραση).`, sol: R`Π.χ. <b>κριτικά</b> / συνειδητά / με κρίση / προσεκτικά. Το «κριτικός» (επίθετο) θα ήταν λάθος μέρος του λόγου.` }
  ]
},
/* ───────────────────────────── 4.5 ───────────────────────────── */
{
  id: "4.5", unit: 4, title: "Ετυμολογία, παραγωγή και σύνθεση λέξεων: παράγωγα ουσιαστικά και επίθετα από ρήματα",
  book: "Πίνακας προδιαγραφών 2026 · Λεξιλόγιο: ετυμολογία, παραγωγή – σύνθεση",
  intro: "Πώς γράφουμε ένα παράγωγο ουσιαστικό και ένα παράγωγο επίθετο από ένα ρήμα, όπως ζητήθηκε στις Παγκύπριες 2026;",
  thumb: LETTER("-ση -τικός"),
  theory: R`
<p>Η ελληνική γλώσσα δημιουργεί νέες λέξεις με δύο βασικούς μηχανισμούς: την <b>παραγωγή</b> και τη <b>σύνθεση</b>. Η γνώση τους βοηθά να καταλαβαίνεις άγνωστες λέξεις, να εμπλουτίζεις το λεξιλόγιό σου και να απαντάς σε ασκήσεις όπως αυτή των Παγκυπρίων 2026: «να συμπληρώσετε τον πίνακα γράφοντας ένα (1) παράγωγο ουσιαστικό και ένα (1) παράγωγο επίθετο για κάθε ένα από τα ρήματα».</p>
<div class="tbox def"><h4>Παραγωγή</h4>
<p>Νέα λέξη σχηματίζεται από μια άλλη με την προσθήκη <b>παραγωγικής κατάληξης</b> στο <b>θέμα</b> της: <i>διακρίν-ω → διάκρι-ση, διακρι-τικός</i>. Οι λέξεις που έχουν κοινό θέμα αποτελούν μια <b>οικογένεια λέξεων</b>.</p>
<table class="tbl"><tr><th>Ουσιαστικά από ρήματα</th><th>Επίθετα από ρήματα</th></tr>
<tr><td><b>-ση / -ξη / -ψη</b>: ενημέρωση, ανάπτυξη, σύλληψη</td><td><b>-τικός</b>: ενημερωτικός, καταστροφικός, διαφημιστικός</td></tr>
<tr><td><b>-μός</b>: σεβασμός, θαυμασμός, επηρεασμός</td><td><b>-σιμος</b>: ελέγξιμος, συνεργάσιμος, αξιολογήσιμος</td></tr>
<tr><td><b>-τής / -τρια</b>: ελεγκτής, καταναλωτής, καταναλώτρια</td><td><b>-τός / -τέος</b>: σεβαστός, θαυμαστός, διακριτέος</td></tr>
<tr><td><b>-μα</b>: δημιούργημα, εξάρτημα, επίτευγμα</td><td><b>-ής</b>: επιβαρής, επιτυχής</td></tr>
<tr><td><b>-ία / -ή</b>: δημιουργία, εργασία, συμμετοχή</td><td><b>-ικός</b>: δημιουργικός, παραγωγικός</td></tr></table></div>
<div class="tbox def"><h4>Σύνθεση</h4>
<p>Νέα λέξη σχηματίζεται από την ένωση <b>δύο ή περισσότερων θεμάτων</b> (α΄ και β΄ συνθετικό): <i>δήμος + κράτος → δημοκρατία</i>, <i>οίκος + λόγος → οικολογία</i>, <i>άνθρωπος + γεννώ → ανθρωπογενής</i>, <i>πολύς + χρώμα → πολύχρωμος</i>. Πολλά σύνθετα έχουν ως α΄ συνθετικό <b>πρόθεση</b> ή <b>αχώριστο μόριο</b>: <i>συν-εργάζομαι, υπερ-κατανάλωση, ά-δικος, δυσ-μενής, ευ-νοϊκός</i>.</p></div>
<div class="tbox def"><h4>Ετυμολογία</h4>
<p>Η <b>ετυμολογία</b> εξετάζει την <b>προέλευση</b> μιας λέξης και την αρχική της σημασία. Π.χ. <i>σχολείο</i> < αρχ. σχολή (= ελεύθερος χρόνος, απασχόληση με τα πνευματικά) · <i>ιδιώτης</i> < ίδιος (αυτός που ασχολείται μόνο με τα δικά του και όχι με τα κοινά) · <i>κριτική</i> < κρίνω (= ξεχωρίζω, διακρίνω). Η ετυμολογία φωτίζει συχνά το βαθύτερο νόημα μιας έννοιας και αξιοποιείται και στον ορισμό ή στον πρόλογο μιας έκθεσης.</p></div>
<div class="tbox ex"><h4>Ο πίνακας των Παγκυπρίων — πώς τον συμπληρώνουμε</h4>
<table class="tbl"><tr><th>Ρήμα</th><th>Παράγωγο ουσιαστικό</th><th>Παράγωγο επίθετο</th></tr>
<tr><td>προστατεύω</td><td>προστασία, προστάτης</td><td>προστατευτικός</td></tr>
<tr><td>καταναλώνω</td><td>κατανάλωση, καταναλωτής</td><td>καταναλωτικός</td></tr>
<tr><td>συμμετέχω</td><td>συμμετοχή</td><td>συμμετοχικός</td></tr></table>
<p>Γράψε <b>μία</b> λέξη σε κάθε κελί, στον <b>βασικό τύπο</b> (ουσιαστικό σε ονομαστική ενικού, επίθετο στο αρσενικό ή σε όλα τα γένη: -ός, -ή, -ό) και πρόσεξε την ορθογραφία· στον πίνακα του 2026 οι οδηγίες βαθμολόγησης αφαιρούσαν μονάδες για ορθογραφικό λάθος και όλες τις μονάδες αν δεν προσδιοριζόταν το μέρος του λόγου.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Γράφουμε <b>σύνθετη</b> λέξη αντί για παράγωγη (π.χ. «υπερκατανάλωση» για το «καταναλώνω» — είναι σύνθετη με πρόθεση).</li>
<li>Γράφουμε <b>μετοχή</b> (σε -μένος, -όμενος, -ων: ενημερωμένος, εκπαιδευόμενος) αντί για επίθετο, ή ρήμα αντί για ουσιαστικό. Οι μετοχές δεν γίνονται δεκτές εδώ ως «παράγωγα επίθετα».</li>
<li>Ορθογραφικά: -ση/-ξη (ανάπτυξη, εξέλιξη), -τικός με -ι-, διπλά σύμφωνα (σύλληψη, εκκίνηση).</li></ul></div>
`,
  widget: "na3der",
  gen: "na3gder",
  exercises: [
    { level: 1, q: R`Να γράψετε ένα (1) <b>παράγωγο ουσιαστικό</b> και ένα (1) <b>παράγωγο επίθετο</b> του ρήματος <b>«ενημερώνω»</b>.`, fields: [{ label: "Ουσιαστικό:", ans: ["ενημέρωση", "ενημερωτής"], text: true }, { label: "Επίθετο:", ans: ["ενημερωτικός", "ενημερωτική", "ενημερωτικά", "ενημερωτικό"], text: true }],
      hint: R`Βρες το θέμα του ρήματος και δοκίμασε τις παραγωγικές καταλήξεις ουσιαστικών και επιθέτων του πίνακα της θεωρίας.`, sol: R`Ουσιαστικό: <b>ενημέρωση</b> · Επίθετο: <b>ενημερωτικός</b>. (Η μετοχή «ενημερωμένος» δεν είναι παράγωγο επίθετο.)` },
    { level: 1, q: R`Να γράψετε ένα (1) <b>παράγωγο ουσιαστικό</b> και ένα (1) <b>παράγωγο επίθετο</b> του ρήματος <b>«καταστρέφω»</b>.`, fields: [{ label: "Ουσιαστικό:", ans: ["καταστροφή", "καταστροφέας"], text: true }, { label: "Επίθετο:", ans: ["καταστροφικός", "καταστροφική", "καταστροφικά", "καταστροφικό"], text: true }],
      hint: R`Το θέμα αλλάζει φωνήεν: -στρεφ- → -στροφ-.`, sol: R`Ουσιαστικό: <b>καταστροφή</b> (ή καταστροφέας) · Επίθετο: <b>καταστροφικός</b>.` },
    { level: 2, q: R`Να γράψετε ένα (1) <b>παράγωγο ουσιαστικό</b> και ένα (1) <b>παράγωγο επίθετο</b> του ρήματος <b>«διακρίνω»</b>.`, fields: [{ label: "Ουσιαστικό:", ans: ["διάκριση", "διακριτικότητα", "διακριτικό"], text: true }, { label: "Επίθετο:", ans: ["διακριτικός", "διακριτική", "διακριτικά", "διακριτικό", "διακριτός", "διακριτή", "διακριτά", "διακριτό", "διακρίσιμος", "διακρίσιμη", "διακρίσιμα", "διακρίσιμο", "διακριτέος", "διακριτέα", "διακριτέο"], text: true }],
      hint: R`Θυμήσου τις καταλήξεις -ση και -τικός / -τός.`, sol: R`Ουσιαστικό: <b>διάκριση</b> (ή διακριτικότητα) · Επίθετο: <b>διακριτικός</b> / διακριτός. (Από τον πίνακα των Παγκυπρίων 2026.)` },
    { level: 2, q: R`Να γράψετε ένα (1) <b>παράγωγο ουσιαστικό</b> και ένα (1) <b>παράγωγο επίθετο</b> του ρήματος <b>«επιβαρύνω»</b>.`, fields: [{ label: "Ουσιαστικό:", ans: ["επιβάρυνση"], text: true }, { label: "Επίθετο:", ans: ["επιβαρυντικός", "επιβαρυντική", "επιβαρυντικά", "επιβαρυντικό", "επιβαρής", "επιβαρές"], text: true }],
      hint: R`Βρες το θέμα του ρήματος και δοκίμασε τις παραγωγικές καταλήξεις ουσιαστικών και επιθέτων του πίνακα της θεωρίας.`, sol: R`Ουσιαστικό: <b>επιβάρυνση</b> · Επίθετο: <b>επιβαρυντικός</b> (ή επιβαρής). (Από τον πίνακα των Παγκυπρίων 2026.)` },
    { level: 1, type: "mc", q: R`Η λέξη «<b>δημοκρατία</b>» είναι…`, options: ["σύνθετη (δήμος + κράτος)", "παράγωγη από το ρήμα «δημιουργώ»", "απλή, χωρίς παραγωγή ή σύνθεση", "παράγωγη από το «κράτος» με την κατάληξη -ία μόνο"], correct: 0,
      hint: R`Πόσα θέματα λέξεων βλέπεις;`, sol: R`Σύνθετη: <b>δῆμος</b> (λαός) + <b>κράτος</b> (εξουσία) = η εξουσία του λαού.` },
    { level: 2, q: R`Να γράψετε το <b>α΄</b> και το <b>β΄ συνθετικό</b> της λέξης «<b>οικολογία</b>».`, fields: [{ label: "α΄ συνθετικό:", ans: ["οίκος", "οικος", "ο οίκος"], text: true, nopunct: true }, { label: "β΄ συνθετικό:", ans: ["λόγος", "λέγω", "ο λόγος", "λογος", "λογία"], text: true, nopunct: true }],
      hint: R`Η οικολογία μελετά τον «οίκο» μας, τον πλανήτη.`, sol: R`<b>οίκος</b> (σπίτι, εδώ το περιβάλλον) + <b>λόγος</b> (μελέτη, επιστήμη) = η επιστήμη που μελετά τη σχέση των οργανισμών με το περιβάλλον τους.` },
    { level: 2, type: "mc", q: R`Ποια από τις παρακάτω λέξεις είναι <b>σύνθετη</b> και όχι απλώς παράγωγη;`, options: ["υπερκατανάλωση", "κατανάλωση", "καταναλωτής", "καταναλωτικός"], correct: 0,
      hint: R`Ποια λέξη έχει δύο συνθετικά (εδώ μια πρόθεση + ουσιαστικό);`, sol: R`<b>υπερ- + κατανάλωση</b> → σύνθετη. Οι άλλες είναι παράγωγες του «καταναλώνω» με καταλήξεις -ση, -τής, -τικός.` },
    { level: 2, type: "mc", q: R`Με βάση την ετυμολογία της, η λέξη «<b>ιδιώτης</b>» (από το «ίδιος») δήλωνε αρχικά…`, options: ["αυτόν που ασχολείται μόνο με τα δικά του και όχι με τα κοινά", "τον πλούσιο έμπορο", "τον δημόσιο υπάλληλο", "τον καλλιτέχνη"], correct: 0,
      hint: R`«ίδιος» = δικός μου, προσωπικός.`, sol: R`Ο <b>ιδιώτης</b> ήταν αυτός που φροντίζει μόνο τα «ίδια», τα δικά του, σε αντίθεση με τον πολίτη που συμμετέχει στα κοινά. Η ετυμολογία μπορεί να αξιοποιηθεί σε έκθεση για τον ενεργό πολίτη.` },
    { level: 3, q: R`Θέμα τύπου Παγκυπρίων: Να γράψετε ένα (1) <b>παράγωγο ουσιαστικό</b> και ένα (1) <b>παράγωγο επίθετο</b> για το ρήμα που είναι υπογραμμισμένο στην πρόταση:${PASSAGE(`Η ευρεία χρήση της τεχνολογίας [[επηρεάζει]] βαθιά τον τρόπο με τον οποίο μαθαίνουμε.`, { title: "Πρωτότυπο κείμενο εξάσκησης" })}`, fields: [{ label: "Ουσιαστικό:", ans: ["επηρεασμός"], text: true }, { label: "Επίθετο:", ans: ["επηρεάσιμος", "επηρεάσιμη", "επηρεάσιμα", "επηρεάσιμο"], text: true }],
      hint: R`Βρες το θέμα του ρήματος (επηρεαζ-/επηρεασ-) και πρόσθεσε τις κατάλληλες παραγωγικές καταλήξεις.`, sol: R`Ουσιαστικό: <b>επηρεασμός</b> · Επίθετο: <b>επηρεάσιμος</b>. (Η «επιρροή» έχει άλλη ρίζα και η μετοχή «επηρεασμένος» δεν είναι παράγωγο επίθετο.)` }
  ]
},
/* ───────────────────────────── 5.1 ───────────────────────────── */
{
  id: "5.1", unit: 5, title: "Παραγωγή λόγου στις Παγκύπριες: ανάλυση εκφώνησης, σχεδιάγραμμα και κριτήρια βαθμολόγησης",
  book: "Πίνακας προδιαγραφών 2026 · Κειμενικά είδη 2: Παραγωγή γραπτού επικοινωνιακού λόγου · Οδηγός διόρθωσης Παγκυπρίων 2026 (Α.ΙΙ)",
  intro: "Πώς γράφεται το κείμενο των 40 μονάδων στις Παγκύπριες — από την πρώτη ανάγνωση της εκφώνησης μέχρι τον επίλογο — και με ποια κριτήρια βαθμολογείται;",
  thumb: LETTER("40 μον.", "red"),
  theory: R`
<p>Η <b>παραγωγή γραπτού επικοινωνιακού λόγου</b> (ενότητα Α.ΙΙ του εξεταστικού δοκιμίου) είναι το πιο «βαρύ» ερώτημα στα <b>Νέα Ελληνικά των Παγκυπρίων</b>: αξίζει <b>40 από τις 100 μονάδες</b>. Ζητείται ένα κείμενο <b>450–500 λέξεων</b> σε ένα από τα τέσσερα κειμενικά είδη της ύλης — <b>άρθρο, επιστολή, δοκίμιο, ομιλία</b> — πάνω σε μία από τις τέσσερις θεματικές ενότητες. Η επιτυχία δεν κρίνεται από το πόσα «ωραία» λόγια θα γράψεις, αλλά από το αν απαντάς <b>με ακρίβεια σε ό,τι ζητείται</b>, στο σωστό κειμενικό είδος, με οργανωμένο και καθαρό λόγο.</p>

<div class="tbox def"><h4>Βήμα 1 · Ανάλυση της εκφώνησης</h4>
<p>Πριν γράψεις οτιδήποτε, «ξεκλείδωσε» την εκφώνηση απαντώντας σε έξι ερωτήματα:</p>
<table class="tbl"><tr><th>Ερώτημα</th><th>Τι ψάχνω</th></tr>
<tr><td><b>Κειμενικό είδος</b></td><td>«Σε άρθρο σας…», «Να γράψετε επιστολή…», «Σε ομιλία σας…», «Σε δοκίμιό σας…»</td></tr>
<tr><td><b>Πομπός</b></td><td>Ποιος γράφει; (μαθητής, εκπρόσωπος μαθητικού συμβουλίου, πολίτης…)</td></tr>
<tr><td><b>Δέκτης</b></td><td>Σε ποιον απευθύνομαι; (αναγνώστες εφημερίδας, Υπουργός, ακροατήριο εκδήλωσης)</td></tr>
<tr><td><b>Περίσταση/μέσο</b></td><td>Πού δημοσιεύεται ή εκφωνείται; (ημερήσιος Τύπος, σχολική εφημερίδα, εκδήλωση, συνέδριο)</td></tr>
<tr><td><b>Ζητούμενα</b></td><td>Πόσα σκέλη έχει και <b>πόσα σημεία</b> ζητά κάθε σκέλος («τρία χαρακτηριστικά», «τρεις τρόποι»)</td></tr>
<tr><td><b>Ειδικές οδηγίες</b></td><td>Έκταση, «να μην αναγραφεί τίτλος», «να μην αναφέρετε το ονοματεπώνυμό σας»</td></tr></table>
<p>Υπογράμμισε τα <b>ρήματα-εντολές</b> (να παρουσιάσετε, να εξηγήσετε, να εισηγηθείτε, να τοποθετηθείτε) και τους <b>αριθμούς</b>. Μέτρησε τα <b>σκέλη</b> που ζητούνται και <b>πόσα σημεία</b> ζητά το καθένα: συνήθως κάθε ρήμα-εντολή εισάγει ένα σκέλος, αλλά ένα ρήμα μπορεί να ζητά δύο σκέλη (π.χ. «να εξετάσετε τις επιπτώσεις στην εργασία <i>και</i> στις σχέσεις, δύο για κάθε τομέα»). Οι αριθμοί σού λένε πόσες παραγράφους θα γράψεις.</p></div>

<div class="tbox ex"><h4>Ανάλυση μιας εκφώνησης</h4>
${PASSAGE(`Σε άρθρο σας, που θα δημοσιευθεί σε ηλεκτρονική εφημερίδα, να παρουσιάσετε τρεις (3) λόγους για τους οποίους οι νέοι απέχουν από τα κοινά. Ακολούθως, να εισηγηθείτε τρεις (3) τρόπους με τους οποίους η οικογένεια μπορεί να καλλιεργήσει ενεργούς πολίτες. (Έκταση: 450–500 λέξεις)`, { title: "Πρωτότυπη εκφώνηση εξάσκησης" })}
<details class="steps"><summary>Λύση βήμα-βήμα</summary>
<p><b>Είδος:</b> άρθρο (χωρίς προσφώνηση/αποφώνηση). <b>Δέκτης:</b> ευρύ αναγνωστικό κοινό. <b>Θεματική:</b> 1 (ενεργός πολίτης). <b>Ζητούμενα:</b> 2 — (α) τρεις λόγοι αποχής (<i>αίτια</i>), (β) τρεις τρόποι από την <i>οικογένεια</i> (μόνο αυτός ο φορέας!). Άρα το κύριο μέρος έχει <b>6 παραγράφους</b>, μία για κάθε σημείο. Αν γράψεις λύσεις από το σχολείο ή την πολιτεία, <b>δεν απαντάς</b> στο ζητούμενο.</p></details></div>

<div class="tbox"><h4>Βήμα 2 · Σχεδιάγραμμα και «προϋπολογισμός» λέξεων</h4>
<p>Με 450–500 λέξεις ένα ισορροπημένο κείμενο έχει: <b>πρόλογο</b> ≈ 60–70 λέξεις · <b>κύριο μέρος</b> ≈ 340–370 λέξεις (για 6 σημεία ≈ 55–60 λέξεις το καθένα) · <b>επίλογο</b> ≈ 50–60 λέξεις. Στο πρόχειρο γράψε μόνο λέξεις-κλειδιά: μία γραμμή για κάθε παράγραφο, με τη <b>θεματική πρόταση</b> και ένα <b>παράδειγμα</b> ή μια <b>αιτιολόγηση</b>.</p>
<ul><li><b>Πρόλογος:</b> αφόρμηση (επικαιρότητα, ορισμός, ερώτημα, διαπίστωση) → σύνδεση με το θέμα → μετάβαση στο πρώτο ζητούμενο.</li>
<li><b>Κύριο μέρος:</b> μία παράγραφος για κάθε σημείο· κάθε παράγραφος με θεματική περίοδο, λεπτομέρειες (αιτιολόγηση, παράδειγμα, αίτιο–αποτέλεσμα) και κατακλείδα. Μεταβατική παράγραφος ή φράση ανάμεσα στα δύο ζητούμενα.</li>
<li><b>Επίλογος:</b> σύντομη ανακεφαλαίωση και κατάληξη ανάλογη του είδους (προτροπή στο άρθρο, προσδοκία ανταπόκρισης στην επιστολή, ευχαριστίες στην ομιλία, στοχαστική σύνθεση στο δοκίμιο).</li></ul></div>

<div class="tbox"><h4>Τεχνικές για πρόλογο και επίλογο</h4>
<div class="figrow"><div><p><b>Πρόλογος</b> — ξεκίνα με: ορισμό της βασικής έννοιας · γενική διαπίστωση για την εποχή · επίκαιρο γεγονός ή είδηση · στατιστικό στοιχείο · ερώτημα · ιστορική αναδρομή ή σύγκριση παρελθόντος–παρόντος · σύντομο βίωμα · ρήση/γνωμικό · εικόνα ή μεταφορά · παρουσίαση αντιτιθέμενων απόψεων.</p></div>
<div><p><b>Επίλογος</b> — κλείσε με: σύνοψη των θέσεων · συμπέρασμα · προτροπή («Ας μη…») · ευχή ή έκκληση · ερώτημα προβληματισμού · αναφορά πίσω στην αφόρμηση του προλόγου («κυκλική» δομή). <i>Ποτέ</i> νέα επιχειρήματα στον επίλογο.</p></div></div></div>

<div class="tbox def"><h4>Κριτήρια βαθμολόγησης (40 μονάδες)</h4>
<p>Σύμφωνα με τον οδηγό διόρθωσης των Παγκυπρίων 2026, το κείμενο βαθμολογείται σε τέσσερις άξονες:</p>
<table class="tbl"><tr><th>Άξονας</th><th>Μονάδες</th><th>Τι ελέγχεται</th></tr>
<tr><td><b>Περιεχόμενο</b></td><td>12</td><td>Πρόλογος 1,5 · κύριο μέρος 9 (π.χ. 6 σημεία × 1,5, καθένα με σχετική ανάπτυξη) · επίλογος 1,5</td></tr>
<tr><td><b>Δομή</b></td><td>12</td><td>Εξωτερικά δομικά στοιχεία (πρόλογος–κύριο μέρος–επίλογος) 2 · δομή αποδεικτικού λόγου (θέση–υποστήριξη–συμπέρασμα) 4 · δομή παραγράφων 2 · αλληλουχία και σύνδεση ιδεών 4</td></tr>
<tr><td><b>Έκφραση</b></td><td>12</td><td>Σαφήνεια–σύνταξη 4 · ακριβολογία–κατάλληλο λεξιλόγιο 4 · ύφος ανάλογο του κειμενικού είδους 4</td></tr>
<tr><td><b>Ορθογραφία</b></td><td>4</td><td>Αφαιρείται 1 μονάδα για κάθε 5 (μη επαναλαμβανόμενα) ορθογραφικά/γραμματικά λάθη και 1 μονάδα για απουσία τονισμού</td></tr></table>
<p>Προσοχή: κείμενο <b>εκτός θέματος</b> βαθμολογείται με <b>μηδέν σε όλα τα κριτήρια</b> — ακόμη και αν είναι άψογα γραμμένο.</p></div>

<div class="tbox rem"><h4>Τι σημαίνει «σχετική ανάπτυξη»</h4>
<p>Κάθε σημείο παίρνει τη μονάδα του μόνο αν <b>αναπτυχθεί</b>: δεν αρκεί να γράψεις «η διαφήμιση δημιουργεί άγχος»· πρέπει να εξηγήσεις <i>γιατί</i> (π.χ. προβάλλει εξιδανικευμένα πρότυπα) και <i>με ποιο αποτέλεσμα</i> (ο νέος συγκρίνεται και νιώθει μειονεκτικά), ιδανικά με ένα παράδειγμα. Αυτό είναι το νόημα της παραγράφου: <b>ένας ισχυρισμός + η στήριξή του</b>.</p></div>

<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Γράφεις σε λάθος είδος (π.χ. «Αγαπητοί αναγνώστες,» σε άρθρο ή κείμενο χωρίς προσφώνηση σε επιστολή).</li>
<li>Αλλάζεις τον φορέα ή το ζητούμενο (ζητούνται τρόποι από την <i>οικογένεια</i> και γράφεις για το κράτος).</li>
<li>Γράφεις λιγότερα ή περισσότερα σημεία από όσα ζητούνται· τα επιπλέον δεν προσθέτουν μονάδες και «τρώνε» λέξεις.</li>
<li>Αντιγράφεις φράσεις του κειμένου της Α.Ι ή γενικόλογες «κονσέρβες» που ταιριάζουν σε κάθε θέμα.</li>
<li>Αναγράφεις τίτλο ή ονοματεπώνυμο, όταν η εκφώνηση το απαγορεύει.</li>
<li>Ξεπερνάς κατά πολύ την έκταση ή μένεις πολύ κάτω από αυτήν — και τα δύο φανερώνουν κακό σχεδιασμό.</li></ul></div>
`,
  widget: "na5prompt",
  gen: "na5gtask",
  exercises: [
    { level: 1, q: R`Πόσες μονάδες αντιστοιχούν στην παραγωγή γραπτού επικοινωνιακού λόγου (Α.ΙΙ) στο εξεταστικό δοκίμιο των Νέων Ελληνικών;`, fields: [{ label: "Μονάδες:", ans: 40 }],
      hint: R`Το Μέρος Α΄ (Γλώσσα) έχει 70 μονάδες: Κατανόηση 30 και Παραγωγή λόγου τις υπόλοιπες.`, sol: R`Το Μέρος Α΄ αξίζει 70 μονάδες: Α.Ι Κατανόηση 30 + Α.ΙΙ Παραγωγή λόγου <b>40</b>. Το Μέρος Β΄ (Λογοτεχνία) αξίζει 30.` },
    { level: 1, q: R`Να συμπληρώσετε πώς κατανέμονται οι 40 μονάδες της παραγωγής λόγου στους τέσσερις άξονες βαθμολόγησης.`, fields: [{ label: "Περιεχόμενο:", ans: 12 }, { label: "Δομή:", ans: 12 }, { label: "Έκφραση:", ans: 12 }, { label: "Ορθογραφία:", ans: 4 }],
      hint: R`Τρεις άξονες είναι ισοβαρείς· ο τέταρτος παίρνει τις λιγότερες μονάδες.`, sol: R`Περιεχόμενο <b>12</b> · Δομή <b>12</b> · Έκφραση <b>12</b> · Ορθογραφία <b>4</b> (σύνολο 40).` },
    { level: 2, q: R`Στο κείμενο ενός υποψηφίου εντοπίστηκαν 11 διαφορετικά ορθογραφικά λάθη, ενώ ο τονισμός ήταν σωστός. Πόσες μονάδες αφαιρούνται από τις 4 της ορθογραφίας;`, fields: [{ label: "Αφαιρούνται:", ans: 2 }],
      hint: R`Αφαιρείται 1 μονάδα για κάθε πλήρη πεντάδα μη επαναλαμβανόμενων λαθών.`, sol: R`11 λάθη = 2 πλήρεις πεντάδες (10 λάθη) + 1. Αφαιρούνται <b>2</b> μονάδες, άρα μένουν 2 στην ορθογραφία.` },
    { shuffle: true, level: 1, type: "mc", q: R`Ένα κείμενο παραγωγής λόγου που είναι εκτός θέματος μπορεί να πάρει μονάδες στην ορθογραφία και στην έκφραση, αν είναι καλογραμμένο.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι ορίζει ο οδηγός διόρθωσης για το κείμενο «εκτός θέματος»;`, sol: R`<b>ΛΑΘΟΣ.</b> Κείμενο εκτός θέματος βαθμολογείται με μηδέν σε <i>όλα</i> τα σημεία. Γι’ αυτό η ανάλυση της εκφώνησης είναι το πιο σημαντικό βήμα.` },
    { level: 2, q: R`${PASSAGE(`Σε ομιλία σας, στο πλαίσιο συνεδρίου μαθητικών συμβουλίων, να παρουσιάσετε τρία (3) γνωρίσματα του συνειδητοποιημένου πολίτη και να εξηγήσετε με ποιους τρεις (3) τρόπους το σχολείο μπορεί να συμβάλει στη διαμόρφωσή του.`, { title: "Εκφώνηση" })}Πόσες παράγραφοι κύριου μέρους χρειάζονται, αν γράψετε μία παράγραφο για κάθε σημείο;`, fields: [{ label: "Παράγραφοι:", ans: 6 }],
      hint: R`Μέτρησε τα σημεία κάθε ζητουμένου και πρόσθεσέ τα.`, sol: R`Δύο ζητούμενα × τρία σημεία = <b>6</b> παράγραφοι στο κύριο μέρος (συν πρόλογος και επίλογος, και η προσφώνηση στην αρχή της ομιλίας).` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποια από τις παρακάτω ενέργειες <b>δεν</b> ανήκει στον ρόλο του προλόγου;`, options: ["Η παρουσίαση νέου, βασικού επιχειρήματος που δεν αναπτύσσεται στη συνέχεια", "Η αφόρμηση από ένα επίκαιρο γεγονός ή έναν ορισμό", "Η σύνδεση της αφόρμησης με το θέμα της εκφώνησης", "Η ομαλή μετάβαση στο πρώτο ζητούμενο"], correct: 0,
      hint: R`Ο πρόλογος προετοιμάζει· δεν αποδεικνύει.`, sol: R`Τα επιχειρήματα αναπτύσσονται στο κύριο μέρος. Ο πρόλογος κάνει αφόρμηση, συνδέει με το θέμα και οδηγεί στο πρώτο ζητούμενο· ένα «σκόρπιο» επιχείρημα εκεί χαλά τη δομή.` },
    { shuffle: true, level: 2, type: "mc", q: R`Η εκφώνηση ζητά «τρεις (3) τρόπους». Ο υποψήφιος γράφει πέντε τρόπους, τους δύο πολύ σύντομα. Τι ισχύει;`, options: ["Βαθμολογούνται τα ζητούμενα σημεία με σχετική ανάπτυξη· τα επιπλέον δεν προσθέτουν μονάδες και συνήθως αποδυναμώνουν την ανάπτυξη", "Παίρνει bonus μονάδες για τα επιπλέον σημεία", "Μηδενίζεται όλο το κείμενο", "Βαθμολογούνται μόνο οι δύο σύντομοι τρόποι"], correct: 0,
      hint: R`Τι σημαίνει «τρία σημεία με σχετική ανάπτυξη»;`, sol: R`Ο οδηγός διόρθωσης δίνει μονάδες για <b>τα ζητούμενα σημεία με σχετική ανάπτυξη</b>. Τα επιπλέον δεν «αγοράζουν» μονάδες· αντίθετα, καταναλώνουν λέξεις και οδηγούν σε επιφανειακή ανάπτυξη.` },
    { shuffle: true, level: 1, type: "mc", q: R`${PASSAGE(`Να γράψετε ανοιχτή επιστολή προς τους δημάρχους της Κύπρου, στην οποία να παρουσιάσετε τρεις (3) συνέπειες της διατάραξης του οικοσυστήματος στην καθημερινή ζωή των πολιτών και να εισηγηθείτε τρεις (3) δράσεις που μπορούν να αναλάβουν οι δήμοι.`, { title: "Εκφώνηση" })}Ποιος είναι ο δέκτης του κειμένου;`, options: ["Οι δήμαρχοι της Κύπρου — και το ευρύ κοινό, αφού η επιστολή είναι ανοιχτή", "Ο Υπουργός Εσωτερικών", "Οι συμμαθητές του πομπού", "Οι επιστήμονες που μελετούν το περιβάλλον"], correct: 0,
      hint: R`Σε ποιον απευθύνεται ρητά η εκφώνηση; Τι σημαίνει «ανοιχτή»;`, sol: R`Δέκτες είναι <b>οι δήμαρχοι</b>· επειδή η επιστολή είναι <b>ανοιχτή</b> (δημοσιεύεται), τη διαβάζει και το ευρύ κοινό. Γι’ αυτό το ύφος είναι επίσημο αλλά και κατανοητό σε όλους.` },
    { level: 2, q: R`Το κύριο μέρος βαθμολογείται με 9 μονάδες και η εκφώνηση ζητά συνολικά έξι σημεία. Πόσες μονάδες αντιστοιχούν σε κάθε σημείο με σχετική ανάπτυξη;`, fields: [{ label: "Μονάδες ανά σημείο:", ans: 1.5, tol: 1e-9 }],
      hint: R`Διαίρεσε τις μονάδες του κύριου μέρους με τον αριθμό των σημείων.`, sol: R`9 : 6 = <b>1,5</b> μονάδα ανά σημείο — όπως ορίζει και ο οδηγός διόρθωσης («τρία σημεία με σχετική ανάπτυξη × 1,5»).` },
    { shuffle: true, level: 3, type: "mc", q: R`${PASSAGE(`Σε άρθρο σας, που θα δημοσιευθεί στον ημερήσιο Τύπο, να παρουσιάσετε τρεις (3) αιτίες της υπερκατανάλωσης. (Έκταση: 450–500 λέξεις)

Σημείωση: Να μην αναγραφεί τίτλος στο άρθρο. Δεν επιτρέπεται να αναφέρετε το ονοματεπώνυμό σας.`, { title: "Εκφώνηση" })}Ποια αρχή του άρθρου είναι σωστή;`, options: ["Να ξεκινά κατευθείαν με την πρώτη παράγραφο του προλόγου", "«Η διαφήμιση στη ζωή μας» και μετά ο πρόλογος", "«Αγαπητοί αναγνώστες,» και μετά ο πρόλογος", "«Του μαθητή Ανδρέα Γεωργίου» και μετά ο πρόλογος"], correct: 0,
      hint: R`Ποια από τις αρχές παραβιάζει κάποια οδηγία ή το είδος;`, sol: R`Χωρίς τίτλο και χωρίς ονοματεπώνυμο, το άρθρο ξεκινά <b>κατευθείαν με τον πρόλογο</b>. Η προσφώνηση «Αγαπητοί αναγνώστες,» δεν ταιριάζει στο άρθρο (είναι στοιχείο επιστολής/ομιλίας).` }
  ]
},
/* ───────────────────────────── 5.2 ───────────────────────────── */
(() => {
  const M = `Ζούμε σε μια εποχή που οι νέοι είναι περισσότερο «συνδεδεμένοι» από ποτέ: μοιράζονται απόψεις στα μέσα κοινωνικής δικτύωσης, υπογράφουν διαδικτυακές εκκλήσεις, σχολιάζουν τα πάντα. Κι όμως, όταν έρχεται η ώρα της ουσιαστικής συμμετοχής — στις εκλογές, στις συλλογικότητες, στον εθελοντισμό — οι θέσεις τους συχνά μένουν άδειες. Γιατί συμβαίνει αυτό και τι μπορεί να κάνει η οικογένεια για να το αλλάξει;

Αρχικά, πολλοί νέοι απέχουν από τα κοινά επειδή έχουν χάσει την εμπιστοσύνη τους στην πολιτική. Οι ειδήσεις για διαφθορά, οι υποσχέσεις που δεν τηρούνται και η αίσθηση ότι «όλοι είναι ίδιοι» γεννούν απογοήτευση. Πολλοί νέοι πιστεύουν ότι η ψήφος τους δεν αλλάζει τίποτα, αφού οι ίδιοι άνθρωποι και οι ίδιες πρακτικές επανέρχονται διαρκώς. Έτσι, η αποχή μοιάζει με μια σιωπηλή διαμαρτυρία, που όμως αφήνει τις αποφάσεις σε λίγους και, τελικά, διαιωνίζει όσα οι νέοι κατακρίνουν.

Επιπλέον, το σημερινό σχολείο, πιεσμένο από την ύλη και τις εξετάσεις, σπάνια δίνει στους μαθητές ευκαιρίες να βιώσουν τη δημοκρατία. Ο νέος μαθαίνει τον ορισμό του ενεργού πολίτη, αλλά δεν ασκείται στον διάλογο, στη συνεργασία και στην ανάληψη ευθύνης. Τα μαθητικά συμβούλια λειτουργούν συχνά τυπικά, ενώ οι δράσεις που φέρνουν τους μαθητές σε επαφή με την κοινότητα θεωρούνται «χαμένος χρόνος» από την προετοιμασία για τις εξετάσεις.

Τέλος, ο ατομικισμός της εποχής μας στρέφει την προσοχή στην προσωπική επιτυχία. Η ψυχαγωγία μπροστά σε μια οθόνη καταναλώνει τον ελεύθερο χρόνο, ενώ τα κοινά θεωρούνται «υπόθεση των άλλων». Μέσα σε ένα περιβάλλον έντονου ανταγωνισμού, ο νέος μαθαίνει να φροντίζει πρώτα και κύρια τον εαυτό του, χωρίς να αντιλαμβάνεται ότι η ατομική του ευημερία εξαρτάται από την ποιότητα της κοινωνίας στην οποία ζει.

Απέναντι σε αυτή την εικόνα, η οικογένεια έχει έναν ρόλο που δεν μπορεί να αναθέσει σε κανέναν. Καταρχάς, μπορεί να καλλιεργεί τον διάλογο στο σπίτι. Όταν οι γονείς συζητούν με τα παιδιά τους τα προβλήματα της γειτονιάς, της χώρας ή του κόσμου και σέβονται τη γνώμη τους, τα παιδιά μαθαίνουν ότι η φωνή τους μετράει. Μαθαίνουν, επίσης, να ακούν την αντίθετη άποψη και να διαφωνούν με επιχειρήματα, δεξιότητες απαραίτητες για κάθε δημοκρατικό πολίτη.

Ακόμη, οι γονείς διδάσκουν περισσότερο με το παράδειγμά τους παρά με τα λόγια. Ένας γονιός που ψηφίζει, που συμμετέχει στον σύνδεσμο γονέων ή σε μια εθελοντική ομάδα, δείχνει στην πράξη ότι η συμμετοχή είναι φυσική στάση ζωής και όχι υποχρέωση. Αντίθετα, ένας γονιός που απαξιώνει κάθε συλλογική προσπάθεια μεταδίδει, συχνά χωρίς να το θέλει, τον κυνισμό του στα παιδιά του.

Παράλληλα, η οικογένεια μπορεί να ενθαρρύνει την αυτονομία. Αντί να προστατεύει υπερβολικά το παιδί, του αναθέτει ευθύνες, το στηρίζει να εκλεγεί στο μαθητικό συμβούλιο ή να πάρει μέρος σε μια δράση. Έτσι ο νέος αποκτά αυτοπεποίθηση, μαθαίνει να αναλαμβάνει την ευθύνη των επιλογών του και αντιλαμβάνεται ότι μπορεί, με τη δική του συμβολή, να αλλάξει τα πράγματα.

Συμπερασματικά, η αποχή των νέων δεν είναι αδιαφορία αλλά συχνά απογοήτευση και έλλειψη ευκαιριών. Αν η οικογένεια γίνει ο πρώτος «χώρος δημοκρατίας», οι αυριανοί πολίτες δεν θα κοιτάζουν τα κοινά από τον καναπέ, αλλά θα τα διαμορφώνουν οι ίδιοι.`;
  return {
  id: "5.2", unit: 5, title: "Άρθρο: δομή, ύφος και παράδειγμα άρθρου για τις Παγκύπριες",
  book: "Πίνακας προδιαγραφών 2026 · Κειμενικά είδη: Άρθρο (κατανόηση και παραγωγή) · Παγκύπριες 2026, Α.ΙΙ",
  intro: "Πώς γράφεται ένα άρθρο γνώμης για εφημερίδα — με ποιον πρόλογο, ποιο ύφος και ποια δομή — όπως ζητήθηκε στις Παγκύπριες 2026;",
  thumb: LETTER("Άρθρο", "red"),
  na5genre: "άρθρο", na5model: M,
  theory: R`
<p>Το <b>άρθρο</b> είναι κείμενο που δημοσιεύεται σε εφημερίδα, περιοδικό ή ιστοσελίδα και <b>σχολιάζει ένα θέμα επικαιρότητας</b>, εκφράζοντας τις απόψεις του αρθρογράφου. Στις <b>Παγκύπριες 2026</b> το κείμενο παραγωγής λόγου ήταν άρθρο για τον ημερήσιο Τύπο· είναι ένα είδος που πρέπει να γνωρίζεις πολύ καλά, χωρίς όμως να παραμελείς τα άλλα τρία. Ο δέκτης του είναι <b>ευρύς και ανώνυμος</b>: αναγνώστες κάθε ηλικίας και μόρφωσης. Γι’ αυτό η γλώσσα του πρέπει να είναι σαφής, το ύφος σοβαρό αλλά ζωντανό, και η επιχειρηματολογία πειστική.</p>

<div class="tbox def"><h4>Χαρακτηριστικά του άρθρου</h4>
<ul><li><b>Επικαιρότητα:</b> ξεκινά συχνά από ένα γεγονός, μια έρευνα, μια τάση της εποχής.</li>
<li><b>Τίτλος και υπογραφή:</b> στην εφημερίδα υπάρχουν· <b>στις εξετάσεις ακολουθείς την εκφώνηση</b> (το 2026 ορίστηκε ρητά «να μην αναγραφεί τίτλος» και απαγορεύτηκε το ονοματεπώνυμο).</li>
<li><b>Χωρίς προσφώνηση και αποφώνηση</b> — δεν είναι επιστολή ούτε ομιλία.</li>
<li><b>Ρηματικά πρόσωπα:</b> κυρίως γ΄ πρόσωπο για αντικειμενικότητα· α΄ πληθυντικό («ζούμε», «οφείλουμε») για να εντάξει ο αρθρογράφος τον εαυτό του και τον αναγνώστη στο πρόβλημα.</li>
<li><b>Ύφος:</b> σοβαρό, σαφές, με μέτρο στα ρητορικά ερωτήματα και στα συναισθηματικά φορτισμένα λόγια.</li></ul></div>

<div class="tbox"><h4>Δομή άρθρου γνώμης</h4>
<table class="tbl"><tr><th>Μέρος</th><th>Περιεχόμενο</th></tr>
<tr><td><b>Πρόλογος</b></td><td>«Άγκιστρο» (επίκαιρο γεγονός, ερώτημα, διαπίστωση) → παρουσίαση του προβλήματος → διατύπωση των ερωτημάτων που θα απαντηθούν</td></tr>
<tr><td><b>Κύριο μέρος</b></td><td>Μία παράγραφος για κάθε σημείο κάθε ζητουμένου· μεταβατική φράση ανάμεσα στα ζητούμενα («Απέναντι σε αυτή την εικόνα…»)</td></tr>
<tr><td><b>Επίλογος</b></td><td>Συμπέρασμα και προτροπή ή προβληματισμός προς τους αναγνώστες</td></tr></table></div>

<div class="tbox ex"><h4>Πρότυπο άρθρο (494 λέξεις)</h4>
<p class="small muted">Εκφώνηση: «Σε άρθρο σας, που θα δημοσιευθεί σε ηλεκτρονική εφημερίδα, να παρουσιάσετε τρεις λόγους για τους οποίους οι νέοι απέχουν από τα κοινά. Ακολούθως, να εισηγηθείτε τρεις τρόπους με τους οποίους η οικογένεια μπορεί να καλλιεργήσει ενεργούς πολίτες.»</p>
<details class="steps"><summary>Ενδεικτική απάντηση — δες το άρθρο</summary>
${PASSAGE(M, { num: "par", source: "Πρωτότυπο κείμενο εξάσκησης" })}
<p><b>Ανάλυση:</b> §1 πρόλογος με αντίθεση («συνδεδεμένοι» αλλά απόντες) και ερώτημα που προαναγγέλλει τα δύο ζητούμενα · §2–4 τρεις λόγοι (αναξιοπιστία πολιτικής, σχολείο χωρίς βιωματική δημοκρατία, ατομικισμός) · §5 μεταβατική φράση και 1ος τρόπος (διάλογος) · §6 2ος τρόπος (παράδειγμα γονέων) · §7 3ος τρόπος (αυτονομία) · §8 συμπέρασμα με εικόνα («από τον καναπέ»). Διαρθρωτικές λέξεις: <i>Αρχικά, Επιπλέον, Τέλος, Καταρχάς, Ακόμη, Παράλληλα, Συμπερασματικά</i>.</p></details></div>

<div class="tbox tip"><h4>Γλωσσικές επιλογές που «ανεβάζουν» το άρθρο</h4>
<p>Χρησιμοποίησε ακριβές λεξιλόγιο της θεματικής ενότητας (π.χ. <i>απολιτικοποίηση, χειραγώγηση, συλλογικότητα</i>), εναλλαγή ενεργητικής και παθητικής σύνταξης, μέτριο μήκος περιόδων (15–30 λέξεις) και ένα-δύο ρητορικά ερωτήματα σε καίρια σημεία — όχι σε κάθε παράγραφο.</p></div>

<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Προσφώνηση «Αγαπητοί αναγνώστες,» ή αποφώνηση στο τέλος — στοιχεία άλλων ειδών.</li>
<li>Τίτλος ή υπογραφή, ενώ η εκφώνηση τα απαγορεύει.</li>
<li>Υπερβολικά συναισθηματικό ή «κηρυγματικό» ύφος («Ντροπή μας!»), ή αντίθετα ξερό, σαν σχολική απαρίθμηση.</li>
<li>Προσωπικές αφηγήσεις που πιάνουν μισό κείμενο· το βίωμα χωρά σε μία πρόταση του προλόγου.</li></ul></div>
`,
  widget: "na5planArt",
  gen: "na5ggenre",
  exercises: [
    { shuffle: true, level: 1, type: "mc", q: R`Ποιο από τα παρακάτω <b>δεν</b> είναι γνώρισμα του άρθρου γνώμης;`, options: ["Η προσφώνηση στην αρχή και η αποφώνηση στο τέλος", "Η αφόρμηση από την επικαιρότητα", "Ο ευρύς, ανώνυμος δέκτης", "Η έκφραση και η τεκμηρίωση της άποψης του αρθρογράφου"], correct: 0,
      hint: R`Ποια στοιχεία ανήκουν στην επιστολή;`, sol: R`Η προσφώνηση και η αποφώνηση είναι στοιχεία της <b>επιστολής</b> (και της ομιλίας). Το άρθρο απευθύνεται σε ανώνυμους αναγνώστες χωρίς τέτοιους τύπους.` },
    { shuffle: true, level: 1, type: "mc", q: R`Ο αρθρογράφος γράφει: «Όλοι μας οφείλουμε να αναρωτηθούμε τι κόσμο θα αφήσουμε». Τι πετυχαίνει με το α΄ πληθυντικό πρόσωπο;`, options: ["Εντάσσει τον εαυτό του και τους αναγνώστες στο πρόβλημα, δημιουργώντας οικειότητα και συλλογική ευθύνη", "Δείχνει ότι μιλά μόνο για τον εαυτό του", "Κάνει το κείμενο απρόσωπο και αντικειμενικό", "Απευθύνεται σε συγκεκριμένο πρόσωπο, όπως σε επιστολή"], correct: 0,
      hint: R`Ποιοι κρύβονται πίσω από το «εμείς»;`, sol: R`Το α΄ πληθυντικό («οφείλουμε», «θα αφήσουμε») <b>εντάσσει αρθρογράφο και αναγνώστες σε μια κοινή ομάδα</b>: προκαλεί οικειότητα και τονίζει ότι η ευθύνη είναι συλλογική.` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποιος πρόλογος ταιριάζει καλύτερα σε άρθρο για τον ημερήσιο Τύπο με θέμα την υπερκατανάλωση;`, options: ["Οι πρόσφατες «εβδομάδες προσφορών» γέμισαν τα καταστήματα και τα καλάθια μας· γέμισαν, άραγε, και τη ζωή μας;", "Αξιότιμε κύριε Υπουργέ, σας γράφω για την υπερκατανάλωση.", "Κυρίες και κύριοι, σας ευχαριστώ που ήρθατε απόψε.", "Η υπερκατανάλωση. Θα γράψω τώρα για την υπερκατανάλωση."], correct: 0,
      hint: R`Το άρθρο ξεκινά από την επικαιρότητα και «αγκιστρώνει» τον αναγνώστη — χωρίς προσφωνήσεις.`, sol: R`Ο κατάλληλος πρόλογος ξεκινά από ένα <b>επίκαιρο γεγονός</b> και κλείνει με <b>ερώτημα προβληματισμού</b>. Οι άλλοι είναι αρχές επιστολής, ομιλίας ή μια άτεχνη επανάληψη.` },
    { shuffle: true, level: 1, type: "mc", q: R`Στις Παγκύπριες 2026 η εκφώνηση όριζε «Να μην αναγραφεί τίτλος στο άρθρο». Αν ο υποψήφιος γράψει τίτλο, παραβιάζει οδηγία της εκφώνησης.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Οι ειδικές οδηγίες της εκφώνησης υπερισχύουν των γενικών συμβάσεων του είδους.`, sol: R`<b>ΣΩΣΤΟ.</b> Παρότι στην εφημερίδα το άρθρο έχει τίτλο, στις εξετάσεις ακολουθούμε την εκφώνηση.` },
    { level: 2, q: R`${PASSAGE(`Αρχικά, η διαφήμιση συνδέει τα προϊόντα με την ευτυχία. Επιπλέον, οι αλγόριθμοι προβάλλουν διαφημίσεις στα μέτρα μας. Ωστόσο, ο νέος μπορεί να αντισταθεί, αν σκεφτεί κριτικά. Συνεπώς, η εκπαίδευση έχει καθοριστικό ρόλο.`, { title: "Απόσπασμα" })}Πόσες διαρθρωτικές λέξεις/φράσεις υπάρχουν στο απόσπασμα (στην αρχή των περιόδων);`, fields: [{ label: "Πλήθος:", ans: 4 }],
      hint: R`Ψάξε λέξεις που δείχνουν σειρά, προσθήκη, αντίθεση ή συμπέρασμα.`, sol: R`<b>4</b>: «Αρχικά» (σειρά), «Επιπλέον» (προσθήκη), «Ωστόσο» (αντίθεση), «Συνεπώς» (συμπέρασμα).` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποια κατάληξη επιλόγου ταιριάζει καλύτερα σε άρθρο γνώμης;`, options: ["Αν θέλουμε μια κοινωνία πολιτών και όχι πελατών, ας ξεκινήσουμε από τις καθημερινές μας επιλογές.", "Με εκτίμηση, ένας μαθητής.", "Σας ευχαριστώ για την προσοχή σας.", "Και ένα ακόμη επιχείρημα: η διαφήμιση ακριβαίνει τα προϊόντα."], correct: 0,
      hint: R`Ο επίλογος του άρθρου συμπεραίνει και προτρέπει· δεν φέρνει νέα επιχειρήματα.`, sol: R`Η <b>προτροπή</b> με συμπερασματικό χαρακτήρα είναι ιδανική κατάληξη άρθρου. Οι άλλες επιλογές είναι αποφώνηση επιστολής, κλείσιμο ομιλίας ή νέο επιχείρημα (λάθος στον επίλογο).` },
    { shuffle: true, level: 3, type: "mc", q: R`${PASSAGE(`Σε άρθρο σας να παρουσιάσετε τρία (3) αρνητικά χαρακτηριστικά του σύγχρονου καταναλωτή που προκύπτουν από την επίδραση της διαφήμισης. Ακολούθως, να εισηγηθείτε τρεις (3) τρόπους με τους οποίους το εκπαιδευτικό σύστημα μπορεί να συμβάλει στη διαμόρφωση ηθικών καταναλωτών.`, { title: "Εκφώνηση (στο πνεύμα των Παγκυπρίων 2026)" })}Ποιο σχέδιο κύριου μέρους είναι σωστό;`, options: ["3 παράγραφοι για χαρακτηριστικά (π.χ. ανελεύθερος, αγχώδης, αλλοτριωμένος) + 3 για τρόπους του σχολείου (π.χ. κριτική σκέψη, ψηφιακός γραμματισμός, βιωματικές δράσεις)", "3 παράγραφοι για τα αίτια της διαφήμισης + 3 για τα οφέλη της", "3 παράγραφοι για χαρακτηριστικά + 3 για μέτρα της πολιτείας", "6 παράγραφοι για τα χαρακτηριστικά του καταναλωτή"], correct: 0,
      hint: R`Έλεγξε ότι τηρείς και τα δύο ζητούμενα και τον φορέα (εκπαιδευτικό σύστημα).`, sol: R`Πρέπει να καλυφθούν <b>και τα δύο ζητούμενα</b> με τρία σημεία το καθένα, και οι τρόποι να αφορούν <b>το εκπαιδευτικό σύστημα</b>, όπως στον οδηγό διόρθωσης των Παγκυπρίων 2026.` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποια φράση <b>δεν</b> ταιριάζει στο ύφος ενός άρθρου για τον ημερήσιο Τύπο;`, options: ["Ρε παιδιά, η διαφήμιση μας έχει πάρει τα μυαλά!", "Η διαφήμιση διαμορφώνει σε μεγάλο βαθμό τις καταναλωτικές μας επιλογές.", "Δεν είναι λίγοι εκείνοι που υποστηρίζουν ότι ο καταναλωτής έχει γίνει πιο ενεργός.", "Αξίζει να αναρωτηθούμε αν οι ανάγκες μας είναι πράγματι δικές μας."], correct: 0,
      hint: R`Ποια φράση ανήκει στον προφορικό, οικείο λόγο;`, sol: R`Η φράση «Ρε παιδιά, … μας έχει πάρει τα μυαλά» είναι <b>οικεία, προφορική</b>, ακατάλληλη για άρθρο σε εφημερίδα. Οι άλλες έχουν σοβαρό αλλά κατανοητό ύφος.` },
    { shuffle: true, level: 1, type: "mc", q: R`Το άρθρο απευθύνεται συνήθως σε:`, options: ["ευρύ, ανώνυμο αναγνωστικό κοινό", "ένα συγκεκριμένο πρόσωπο, που κατονομάζεται", "ζωντανό ακροατήριο μιας εκδήλωσης", "μόνο σε ειδικούς επιστήμονες"], correct: 0,
      hint: R`Πού δημοσιεύεται το άρθρο;`, sol: R`Το άρθρο δημοσιεύεται στον Τύπο ή στο διαδίκτυο και το διαβάζει <b>ευρύ, ανώνυμο κοινό</b>.` }
  ]
  };
})(),
/* ───────────────────────────── 5.3 ───────────────────────────── */
(() => {
  const M = `Αξιότιμε κύριε Υπουργέ,

Σας απευθύνομαι εκ μέρους του Κεντρικού Μαθητικού Συμβουλίου, με αφορμή τον διάλογο που έχει ανοίξει για τον εκσυγχρονισμό της Μέσης Εκπαίδευσης. Ως μαθητές που σε λίγους μήνες θα βρεθούμε στην αγορά εργασίας ή στα πανεπιστήμια, θεωρούμε χρέος μας να σας μεταφέρουμε τις ανησυχίες μας, αλλά και συγκεκριμένες προτάσεις. Οι απόψεις που ακολουθούν συγκεντρώθηκαν ύστερα από συζητήσεις με μαθητές από όλα τα σχολεία της Κύπρου.

Καταρχάς, το σημερινό σχολείο δίνει έμφαση στην απομνημόνευση και στις εξετάσεις. Πολλοί από εμάς αποφοιτούμε με υψηλούς βαθμούς, αλλά δυσκολευόμαστε να λύσουμε ένα πρακτικό πρόβλημα ή να συνεργαστούμε σε μια ομάδα, δεξιότητες που κάθε εργοδότης θεωρεί αυτονόητες. Η γνώση που αποκτούμε μένει συχνά θεωρητική και ξεχνιέται λίγο μετά τις εξετάσεις, επειδή δεν συνδέθηκε ποτέ με πραγματικά προβλήματα.

Επιπλέον, ο επαγγελματικός προσανατολισμός περιορίζεται σε λίγες ενημερωτικές συναντήσεις. Οι μαθητές επιλέγουν σπουδές χωρίς να έχουν γνωρίσει από κοντά κανένα επάγγελμα, με αποτέλεσμα συχνά να αλλάζουν κατεύθυνση ή να απογοητεύονται. Πολλοί συμμαθητές μας παραδέχονται ότι διάλεξαν σχολή σύμφωνα με τις βάσεις εισαγωγής ή τις συμβουλές τρίτων, και όχι με βάση τα δικά τους ενδιαφέροντα και τις κλίσεις τους.

Τέλος, οι ψηφιακές δεξιότητες που καλλιεργούνται δεν συμβαδίζουν με τις ανάγκες της εποχής. Η χρήση της τεχνολογίας περιορίζεται συχνά σε βασικές εφαρμογές, ενώ ο κόσμος της εργασίας αλλάζει με ραγδαίους ρυθμούς. Η τεχνητή νοημοσύνη, η ανάλυση δεδομένων και ο προγραμματισμός διαμορφώνουν ήδη τα επαγγέλματα του αύριο, αλλά παραμένουν σχεδόν άγνωστα για τους περισσότερους μαθητές.

Για τους λόγους αυτούς, σας παρακαλούμε να εξετάσετε τις εξής προτάσεις, οι οποίες, κατά την άποψή μας, δεν απαιτούν μεγάλο κόστος. Πρώτον, να ενταχθούν στο ωρολόγιο πρόγραμμα ερευνητικές και συνεργατικές εργασίες, οι οποίες θα αξιολογούνται όπως και οι γραπτές εξετάσεις. Με τον τρόπο αυτό, η γνώση θα συνδεθεί με την πράξη και οι μαθητές θα καλλιεργήσουν την κριτική σκέψη, τη συνεργασία και την ικανότητα επίλυσης προβλημάτων.

Δεύτερον, να θεσμοθετηθεί η βιωματική γνωριμία με τον κόσμο της εργασίας: σύντομη παρακολούθηση επαγγελματιών στον χώρο τους, συνεργασία των σχολείων με επιχειρήσεις και οργανισμούς, συναντήσεις με αποφοίτους. Μια τέτοια εμπειρία θα βοηθούσε κάθε μαθητή να επιλέξει την πορεία του με επίγνωση και όχι στα τυφλά.

Τρίτον, να επιμορφωθούν συστηματικά οι εκπαιδευτικοί στις νέες τεχνολογίες και να εμπλουτιστούν τα σχολικά εργαστήρια, ώστε κάθε μαθητής να αποκτά ουσιαστικό ψηφιακό γραμματισμό, και όχι μόνο τυπικές γνώσεις. Οι εκπαιδευτικοί μας είναι πρόθυμοι, αλλά χρειάζονται υποστήριξη, χρόνο και σύγχρονο εξοπλισμό για να ανταποκριθούν στις νέες απαιτήσεις.

Είμαστε βέβαιοι ότι κατανοείτε πως ένα σχολείο που προετοιμάζει για τη ζωή είναι επένδυση για ολόκληρη την κοινωνία. Ως Κεντρικό Μαθητικό Συμβούλιο, δηλώνουμε έτοιμοι να συμμετάσχουμε σε κάθε διάλογο και να συνεργαστούμε με τις υπηρεσίες του Υπουργείου σας. Ελπίζουμε ότι οι προτάσεις μας θα αποτελέσουν αφορμή για γόνιμο διάλογο και σας ευχαριστούμε για τον χρόνο που μας αφιερώσατε.

Με εκτίμηση
Ο Πρόεδρος του Κεντρικού Μαθητικού Συμβουλίου`;
  return {
  id: "5.3", unit: 5, title: "Επιστολή (επίσημη και ανοιχτή): προσφώνηση, αποφώνηση, δομή και παράδειγμα",
  book: "Πίνακας προδιαγραφών 2026 · Κειμενικά είδη: Επιστολή (κατανόηση και παραγωγή)",
  intro: "Πώς γράφεται μια επίσημη επιστολή προς έναν Υπουργό ή μια ανοιχτή επιστολή — με ποια προσφώνηση ξεκινά, πώς κλείνει και τι ύφος έχει;",
  thumb: LETTER("Επιστολή", "red"),
  na5genre: "επιστολή", na5model: M,
  theory: R`
<p>Η <b>επιστολή</b> είναι γραπτό κείμενο που απευθύνεται σε <b>συγκεκριμένο παραλήπτη</b> — πρόσωπο, αξιωματούχο ή φορέα — με σκοπό να τον ενημερώσει, να εκφράσει μια διαμαρτυρία, ένα αίτημα ή μια πρόταση. Στις Παγκύπριες ζητείται σχεδόν πάντα <b>επίσημη επιστολή</b> (προς Υπουργό, Δήμαρχο, Διευθυντή, αρχισυντάκτη) ή <b>ανοιχτή επιστολή</b>, δηλαδή επιστολή που δημοσιεύεται, ώστε να τη διαβάσει και το ευρύ κοινό. Το είδος έχει αυστηρές συμβάσεις, που βαθμολογούνται στη δομή και στο ύφος.</p>

<div class="tbox def"><h4>Τα δομικά στοιχεία της επιστολής</h4>
<table class="tbl"><tr><th>Στοιχείο</th><th>Πώς γράφεται</th></tr>
<tr><td><b>(Τόπος – ημερομηνία)</b></td><td>Πάνω δεξιά, π.χ. «Λευκωσία, 12 Μαρτίου 2026» — <i>μόνο αν δεν το αποκλείει η εκφώνηση</i></td></tr>
<tr><td><b>Προσφώνηση</b></td><td>Στην κλητική, με κόμμα: «Αξιότιμε κύριε Υπουργέ,» · «Αξιότιμη κυρία Διευθύντρια,»</td></tr>
<tr><td><b>Πρόλογος</b></td><td>Ποιος γράφει (ιδιότητα) και γιατί (αφορμή, σκοπός)</td></tr>
<tr><td><b>Κύριο μέρος</b></td><td>Τα ζητούμενα, μία παράγραφος ανά σημείο</td></tr>
<tr><td><b>Επίλογος</b></td><td>Σύνοψη, ελπίδα για ανταπόκριση, ευχαριστίες</td></tr>
<tr><td><b>Αποφώνηση</b></td><td>«Με εκτίμηση», «Με σεβασμό», «Με βαθύτατο σεβασμό» (για τον Πρόεδρο της Δημοκρατίας ή τον Αρχιεπίσκοπο)</td></tr>
<tr><td><b>Υπογραφή</b></td><td>Στις εξετάσεις <b>μόνο ιδιότητα</b> («Ο/Η μαθητής/-τρια», «Η Πρόεδρος του μαθητικού συμβουλίου») — ποτέ ονοματεπώνυμο</td></tr></table></div>

<div class="tbox"><h4>Ύφος και γλώσσα</h4>
<p>Το ύφος είναι <b>επίσημο, ευγενικό και σοβαρό</b>, χωρίς όμως δουλοπρέπεια ή επιθετικότητα. Ο παραλήπτης προσφωνείται με τον <b>β΄ πληθυντικό ευγενείας</b> («σας παρακαλούμε», «γνωρίζετε»), ενώ ο πομπός μιλά σε α΄ πρόσωπο (ενικό ή πληθυντικό, αν εκπροσωπεί ομάδα). Χρήσιμες φράσεις: «Σας απευθύνομαι με αφορμή…», «Θα θέλαμε να σας εκθέσουμε…», «Σας παρακαλούμε να εξετάσετε…», «Ελπίζουμε ότι θα ανταποκριθείτε…».</p>
<p>Η <b>ανοιχτή επιστολή</b> έχει τα ίδια στοιχεία, αλλά γράφεται με τη συναίσθηση ότι τη διαβάζουν και άλλοι· γι’ αυτό συχνά περιέχει εκκλήσεις και προς το κοινό και έχει πιο έντονο επιχειρηματολογικό χαρακτήρα.</p></div>

<div class="tbox ex"><h4>Πρότυπη επίσημη επιστολή (459 λέξεις)</h4>
<p class="small muted">Εκφώνηση: «Ως εκπρόσωπος του Κεντρικού Μαθητικού Συμβουλίου, να γράψετε επιστολή προς τον Υπουργό Παιδείας, στην οποία να αναφέρετε τρεις αδυναμίες του σημερινού σχολείου ως προς την προετοιμασία των μαθητών για την αγορά εργασίας. Ακολούθως, να προτείνετε τρεις αλλαγές που θα το βελτίωναν.»</p>
<details class="steps"><summary>Ενδεικτική απάντηση — δες την επιστολή</summary>
${PASSAGE(M, { source: "Πρωτότυπο κείμενο εξάσκησης" })}
<p><b>Ανάλυση:</b> προσφώνηση στην κλητική με κόμμα · πρόλογος με ιδιότητα και αφορμή · τρεις αδυναμίες (απομνημόνευση, ελλιπής προσανατολισμός, ψηφιακές δεξιότητες) · μεταβατική φράση «Για τους λόγους αυτούς» · τρεις προτάσεις με «Πρώτον, Δεύτερον, Τρίτον» · επίλογος με ελπίδα και ευχαριστίες · αποφώνηση και ιδιότητα χωρίς όνομα.</p></details></div>

<div class="tbox tip"><h4>Κλητική των αξιωμάτων</h4>
<p>κύριε Υπουργέ · κυρία Υπουργέ · κύριε Πρόεδρε · κυρία Πρόεδρε · κύριε Δήμαρχε · κυρία Δήμαρχε · κύριε Διευθυντά (ή Διευθυντή) · κυρία Διευθύντρια · κύριε Αρχισυντάκτη · Εξοχότατε κύριε Πρόεδρε (της Δημοκρατίας) · Μακαριότατε (Αρχιεπίσκοπος).</p></div>

<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Ξεχνάς την προσφώνηση ή την αποφώνηση — χάνονται μονάδες στη δομή και στο ύφος.</li>
<li>Γράφεις το ονοματεπώνυμό σου στην υπογραφή (απαγορεύεται· γράψε ιδιότητα).</li>
<li>Λάθος κλητική («Αξιότιμε κύριε Υπουργός») ή θαυμαστικό αντί για κόμμα μετά την προσφώνηση.</li>
<li>Οικείο ή επιθετικό ύφος («Πρέπει επιτέλους να κάνετε κάτι!»): το αίτημα διατυπώνεται ευγενικά, με επιχειρήματα.</li>
<li>Ξεχνάς τον παραλήπτη στο κύριο μέρος: η επιστολή γράφεται <i>προς</i> κάποιον — απευθύνσου σε αυτόν κάπου και στο κύριο μέρος.</li></ul></div>
`,
  widget: "na5planLet",
  gen: "na5glet",
  exercises: [
    { shuffle: true, level: 1, type: "mc", q: R`Ποια προσφώνηση είναι σωστή σε επιστολή προς τον Υπουργό Παιδείας;`, options: ["Αξιότιμε κύριε Υπουργέ,", "Αξιότιμε κύριε Υπουργός,", "Γεια σας κύριε Υπουργέ!", "Αγαπητέ μου Υπουργέ!"], correct: 0,
      hint: R`Η προσφώνηση γράφεται στην κλητική πτώση και ακολουθεί κόμμα.`, sol: R`<b>«Αξιότιμε κύριε Υπουργέ,»</b>: κλητική (Υπουργέ), επίσημο επίθετο (Αξιότιμε), κόμμα στο τέλος.` },
    { shuffle: true, level: 1, type: "mc", q: R`Σε επιστολή στις Παγκύπριες, η υπογραφή στο τέλος πρέπει να περιέχει το ονοματεπώνυμο του υποψηφίου.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι απαγορεύεται για λόγους αδιάβλητου;`, sol: R`<b>ΛΑΘΟΣ.</b> Δεν επιτρέπεται κανένα στοιχείο που αποκαλύπτει την ταυτότητα· γράφουμε μόνο ιδιότητα (π.χ. «Η μαθήτρια» ή «Ο εκπρόσωπος του μαθητικού συμβουλίου»).` },
    { level: 2, q: R`Να γράψετε την κλητική του ουσιαστικού «ο Δήμαρχος», όπως θα τη χρησιμοποιούσατε στην προσφώνηση «Αξιότιμε κύριε …,».`, fields: [{ label: "Κλητική:", ans: ["Δήμαρχε"], text: true }],
      hint: R`Τα αρσενικά σε -ος σχηματίζουν την κλητική συνήθως σε -ε.`, sol: R`«Αξιότιμε κύριε <b>Δήμαρχε</b>,». (Ομοίως: Υπουργέ, Πρόεδρε, Αρχισυντάκτη.)` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποια φράση είναι κατάλληλη για τον πρόλογο επίσημης επιστολής;`, options: ["Σας απευθύνομαι ως εκπρόσωπος του μαθητικού συμβουλίου, με αφορμή την πρόσφατη απόφαση για την κατάργηση των εκδρομών.", "Ρε κύριε Δήμαρχε, τι γίνεται με τα πάρκα;", "Κυρίες και κύριοι, απόψε θα μιλήσουμε για τα πάρκα.", "Η αποχή των νέων είναι ένα σύνθετο φαινόμενο της εποχής μας, το οποίο θα εξετάσουμε."], correct: 0,
      hint: R`Ο πρόλογος της επιστολής λέει ποιος γράφει και γιατί.`, sol: R`Ο πρόλογος της επιστολής δηλώνει <b>ιδιότητα του πομπού και αφορμή</b>. Οι άλλες είναι οικεία φράση, αρχή ομιλίας και αρχή δοκιμίου.` },
    { shuffle: true, level: 2, type: "mc", q: R`Τι διαφέρει η ανοιχτή επιστολή από την απλή επίσημη επιστολή;`, options: ["Δημοσιεύεται, ώστε να τη διαβάσει και το ευρύ κοινό πέρα από τον παραλήπτη", "Δεν έχει προσφώνηση", "Γράφεται πάντα σε οικείο ύφος", "Δεν απευθύνεται σε κανέναν συγκεκριμένο"], correct: 0,
      hint: R`Τι σημαίνει «ανοιχτή»;`, sol: R`Η ανοιχτή επιστολή έχει παραλήπτη και όλα τα τυπικά στοιχεία, αλλά <b>δημοσιεύεται</b>· γι’ αυτό απευθύνεται έμμεσα και στο κοινό.` },
    { shuffle: true, level: 1, type: "mc", q: R`Ποια αποφώνηση είναι κατάλληλη για επιστολή προς τον Πρόεδρο της Δημοκρατίας;`, options: ["Με βαθύτατο σεβασμό", "Φιλικά", "Με αγάπη", "Τα λέμε σύντομα"], correct: 0,
      hint: R`Το ανώτατο αξίωμα της πολιτείας απαιτεί τον πιο επίσημο τύπο.`, sol: R`<b>«Με βαθύτατο σεβασμό»</b> — ο πιο επίσημος τύπος αποφώνησης. Για Υπουργούς, Δημάρχους κ.λπ. αρκεί «Με εκτίμηση» ή «Με σεβασμό».` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποια διατύπωση αιτήματος ταιριάζει στο ύφος επίσημης επιστολής;`, options: ["Σας παρακαλούμε να εξετάσετε το ενδεχόμενο δημιουργίας ποδηλατοδρόμων στην περιοχή μας.", "Πρέπει επιτέλους να φτιάξετε ποδηλατοδρόμους!", "Φτιάξτε ποδηλατόδρομους, αλλιώς θα το μετανιώσετε.", "Θα ήταν ωραίο αν φτιάχνατε κάνα ποδηλατόδρομο."], correct: 0,
      hint: R`Ευγένεια χωρίς επιθετικότητα και χωρίς οικειότητα.`, sol: R`Το αίτημα διατυπώνεται <b>ευγενικά και επίσημα</b> («Σας παρακαλούμε να εξετάσετε…»). Οι άλλες είναι επιθετικές, απειλητικές ή οικείες.` },
    { level: 3, q: R`${PASSAGE(`Αξιότιμη κυρία Διευθύντρια!

Σας γράφω για να σας πω ότι το κυλικείο του σχολείου μας είναι χάλια. Πρώτον, τα φαγητά είναι ανθυγιεινά. Δεύτερον, οι τιμές είναι πολύ ψηλές.

Με εκτίμηση
Μαρία Ιωάννου`, { title: "Πρωτότυπο απόσπασμα με λάθη" })}Ο μαθητής έκανε λάθη στη μορφή της επιστολής. Πόσα από τα εξής λάθη υπάρχουν: (α) θαυμαστικό αντί για κόμμα στην προσφώνηση, (β) ονοματεπώνυμο στην υπογραφή, (γ) οικείο λεξιλόγιο («χάλια»), (δ) λείπει η αποφώνηση;`, fields: [{ label: "Λάθη:", ans: 3 }],
      hint: R`Έλεγξε ένα-ένα τα τέσσερα σημεία· υπάρχει αποφώνηση στο κείμενο;`, sol: R`Υπάρχουν <b>3</b> λάθη: (α) «Διευθύντρια!» αντί για «Διευθύντρια,» · (β) ονοματεπώνυμο αντί για ιδιότητα · (γ) «χάλια» (οικείο ύφος). Αποφώνηση υπάρχει («Με εκτίμηση»), άρα το (δ) δεν ισχύει.` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποια φράση ταιριάζει στον επίλογο επίσημης επιστολής;`, options: ["Ελπίζουμε ότι θα εξετάσετε θετικά τις προτάσεις μας και σας ευχαριστούμε για τον χρόνο σας.", "Σας ευχαριστώ για την προσοχή σας, αγαπητοί ακροατές.", "Εν κατακλείδι, η τεχνολογία είναι δίκοπο μαχαίρι για την ανθρωπότητα.", "Αρχικά, θα ήθελα να αναφερθώ στο πρώτο πρόβλημα."], correct: 0,
      hint: R`Ο επίλογος της επιστολής εκφράζει προσδοκία ανταπόκρισης.`, sol: R`Η επιστολή κλείνει με <b>ελπίδα ανταπόκρισης και ευχαριστίες προς τον παραλήπτη</b>. Το «Σας ευχαριστώ για την προσοχή σας, αγαπητοί ακροατές» ταιριάζει σε ομιλία, το «Εν κατακλείδι, η τεχνολογία είναι δίκοπο μαχαίρι…» σε δοκίμιο, ενώ το «Αρχικά, θα ήθελα…» είναι αρχή κύριου μέρους.` }
  ]
  };
})(),
/* ───────────────────────────── 5.4 ───────────────────────────── */
(() => {
  const M = `Η τεχνητή νοημοσύνη, η ικανότητα των μηχανών να μαθαίνουν από δεδομένα και να παίρνουν αποφάσεις που άλλοτε απαιτούσαν ανθρώπινη κρίση, δεν αποτελεί πια σενάριο επιστημονικής φαντασίας. Εισέρχεται στον χώρο της εργασίας και στις ανθρώπινες σχέσεις, θέτοντας ένα ερώτημα τόσο παλιό όσο και ο ίδιος ο πολιτισμός: υπηρετεί το εργαλείο τον άνθρωπο ή ο άνθρωπος το εργαλείο; Από τη φωτιά μέχρι την ατμομηχανή, κάθε μεγάλη εφεύρεση υποσχέθηκε ελευθερία και έφερε μαζί της νέες μορφές εξάρτησης.

Στον χώρο της εργασίας, η πρώτη επίπτωση είναι η απελευθέρωση από επίπονα και επαναλαμβανόμενα καθήκοντα. Συστήματα που αναλύουν έγγραφα, διαγνώσεις ή οικονομικά στοιχεία εξοικονομούν χρόνο, τον οποίο ο εργαζόμενος μπορεί να αφιερώσει σε δημιουργικότερες δραστηριότητες. Ο γιατρός, για παράδειγμα, που υποβοηθείται από ένα διαγνωστικό σύστημα, κερδίζει χρόνο για τον ασθενή του· ο ερευνητής επεξεργάζεται σε ώρες δεδομένα που άλλοτε απαιτούσαν χρόνια.

Η ίδια, ωστόσο, εξέλιξη γεννά τον φόβο της ανεργίας. Επαγγέλματα ολόκληρα κινδυνεύουν να εκλείψουν, ενώ η αγορά απαιτεί δεξιότητες που δεν διαθέτουν όλοι. Η τεχνολογική πρόοδος, όταν δεν συνοδεύεται από κοινωνική πρόνοια, διευρύνει το χάσμα ανάμεσα σε όσους την κατέχουν και σε όσους την υφίστανται. Η εργασία, που για αιώνες υπήρξε πηγή αξιοπρέπειας και κοινωνικής ταυτότητας, κινδυνεύει να γίνει προνόμιο των λίγων.

Στις ανθρώπινες σχέσεις, η τεχνητή νοημοσύνη διευκολύνει την επικοινωνία: μεταφράζει, συνδέει, προτείνει. Άνθρωποι που απέχουν χιλιόμετρα μπορούν να συνεργάζονται και να γνωρίζονται, υπερβαίνοντας γλωσσικά και πολιτισμικά εμπόδια. Άνθρωποι με αναπηρίες, εξάλλου, αποκτούν μέσα από έξυπνες εφαρμογές δυνατότητες επικοινωνίας και αυτονομίας που παλαιότερα ήταν αδιανόητες.

Παράλληλα, όμως, η επικοινωνία κινδυνεύει να γίνει επιφανειακή. Όταν οι αλγόριθμοι επιλέγουν τι θα δούμε και με ποιους θα «συνδεθούμε», οι σχέσεις χάνουν την αυθορμησία τους, ενώ η συντροφιά μιας ευγενικής μηχανής μπορεί να υποκαταστήσει τη δύσκολη αλλά ουσιαστική συνάντηση με τον άλλον. Η ανθρώπινη σχέση, όμως, προϋποθέτει την απρόβλεπτη παρουσία του άλλου, τη διαφωνία, την υπομονή — όλα όσα ένας αλγόριθμος έχει σχεδιαστεί να εξαλείφει.

Απειλεί, λοιπόν, η τεχνολογία την ελευθερία του ανθρώπου; Η απάντηση εξαρτάται λιγότερο από την ίδια την τεχνολογία και περισσότερο από τη στάση του ανθρώπου απέναντί της. Η ελευθερία δεν χάνεται τη στιγμή που ένα μηχάνημα αποφασίζει, αλλά τη στιγμή που ο άνθρωπος παραιτείται από το δικαίωμα να κρίνει. Ο κίνδυνος του εξανδραποδισμού είναι πραγματικός, όταν η ευκολία γίνεται εξάρτηση και η πληροφόρηση χειραγώγηση. Αντίθετα, ο άνθρωπος που γνωρίζει πώς λειτουργούν τα εργαλεία του και διατηρεί την ικανότητα να αμφισβητεί τις «προτάσεις» τους παραμένει κύριος των επιλογών του.

Η τεχνητή νοημοσύνη είναι, επομένως, ένας καθρέφτης των αξιών μας. Αν συνοδευτεί από παιδεία, κριτική σκέψη και θεσμούς που προστατεύουν την ανθρώπινη αξιοπρέπεια, μπορεί να διευρύνει την ελευθερία μας· αν όχι, θα μας προσφέρει έναν άνετο, αλλά αόρατο, εγκλεισμό. Η επιλογή παραμένει, για την ώρα, ανθρώπινη — και αυτή ακριβώς η ευθύνη είναι το τελευταίο και πολυτιμότερο προνόμιο της ελευθερίας μας.`;
  return {
  id: "5.4", unit: 5, title: "Δοκίμιο: χαρακτηριστικά, δομή, ύφος και πρότυπο δοκίμιο",
  book: "Πίνακας προδιαγραφών 2026 · Κειμενικά είδη: Δοκίμιο (κατανόηση και παραγωγή)",
  intro: "Τι κάνει ένα κείμενο «δοκίμιο» και πώς γράφουμε στοχαστικό, απρόσωπο λόγο που πείθει με τη λογική του;",
  thumb: LETTER("Δοκίμιο", "red"),
  na5genre: "δοκίμιο", na5model: M,
  theory: R`
<p>Το <b>δοκίμιο</b> είναι πεζό κείμενο μέσης έκτασης, στο οποίο ο συγγραφέας <b>διερευνά στοχαστικά ένα θέμα</b> — κοινωνικό, πολιτικό, ηθικό, φιλοσοφικό — και διατυπώνει με τεκμηρίωση τις απόψεις του. Βρίσκεται ανάμεσα στην επιστημονική μελέτη (από την οποία δανείζεται τη λογική οργάνωση και την τεκμηρίωση) και στη λογοτεχνία (από την οποία δανείζεται την προσωπική ματιά και τη φροντισμένη γλώσσα). Στις Παγκύπριες ζητείται κυρίως το <b>πραγματευτικό/στοχαστικό δοκίμιο</b>: ένα θέμα της θεματικής ενότητας εξετάζεται σε βάθος και ο γράφων κλείνει με τεκμηριωμένη τοποθέτηση.</p>

<div class="tbox def"><h4>Χαρακτηριστικά του δοκιμίου</h4>
<ul><li><b>Απρόσωπος λόγος:</b> κυριαρχεί το γ΄ πρόσωπο και οι απρόσωπες εκφράσεις («είναι αναγκαίο», «θα μπορούσε να υποστηριχθεί»)· το α΄ πληθυντικό χρησιμοποιείται με φειδώ, με γενική σημασία («όλοι μας»).</li>
<li><b>Δεν έχει συγκεκριμένο δέκτη:</b> απευθύνεται στον καλλιεργημένο αναγνώστη· δεν υπάρχουν προσφωνήσεις.</li>
<li><b>Διαχρονικότητα:</b> δεν δεσμεύεται από την επικαιρότητα, όπως το άρθρο· αναζητά το γενικό και το ουσιώδες.</li>
<li><b>Αυστηρή λογική οργάνωση:</b> θέση → επιχειρήματα και τεκμήρια → συμπέρασμα· συχνή χρήση <b>ορισμού, διαίρεσης, σύγκρισης–αντίθεσης, αιτίου–αποτελέσματος</b>.</li>
<li><b>Ύφος υψηλό, επίσημο:</b> ακριβολογία, αφηρημένο λεξιλόγιο, συχνά μακροπερίοδος λόγος, μεταφορές που φωτίζουν τις ιδέες.</li>
<li><b>Τίτλος:</b> το δοκίμιο έχει συνήθως τίτλο, εκτός αν η εκφώνηση ορίζει διαφορετικά.</li></ul></div>

<div class="tbox"><h4>Δομή δοκιμίου</h4>
<p><b>Πρόλογος:</b> ορισμός της βασικής έννοιας ή διατύπωση του προβλήματος με γενικό, στοχαστικό τρόπο · <b>Κύριο μέρος:</b> μία παράγραφος για κάθε πτυχή του θέματος, με αντιθέσεις («η ίδια, ωστόσο, εξέλιξη…») και τεκμηρίωση · <b>Τοποθέτηση:</b> όταν ζητείται, ξεχωριστή παράγραφος με θέση και αιτιολόγηση · <b>Επίλογος:</b> σύνθεση, ανάδειξη της διαχρονικής διάστασης του θέματος.</p></div>

<div class="tbox ex"><h4>Πρότυπο δοκίμιο (453 λέξεις)</h4>
<p class="small muted">Εκφώνηση: «Σε δοκίμιό σας να εξετάσετε τις επιπτώσεις της τεχνητής νοημοσύνης στην εργασία και στις ανθρώπινες σχέσεις (δύο επιπτώσεις για κάθε τομέα) και να τοποθετηθείτε για το αν η τεχνολογία απειλεί την ελευθερία του ανθρώπου.»</p>
<details class="steps"><summary>Ενδεικτική απάντηση — δες το δοκίμιο</summary>
${PASSAGE(M, { num: "par", source: "Πρωτότυπο κείμενο εξάσκησης" })}
<p><b>Ανάλυση:</b> §1 ορισμός της έννοιας και φιλοσοφικό ερώτημα · §2–3 εργασία: θετική και αρνητική επίπτωση (σύγκριση–αντίθεση) · §4–5 σχέσεις: θετική και αρνητική · §6 τοποθέτηση με ρητορικό ερώτημα και αιτιολόγηση · §7 επίλογος με μεταφορά («καθρέφτης των αξιών μας») και διαχρονική σύνθεση. Λόγος απρόσωπος, χωρίς β΄ πρόσωπο.</p></details></div>

<div class="tbox rem"><h4>Δοκίμιο ή άρθρο;</h4>
<table class="tbl"><tr><th></th><th>Άρθρο</th><th>Δοκίμιο</th></tr>
<tr><td>Αφετηρία</td><td>Επικαιρότητα</td><td>Γενικό, διαχρονικό ερώτημα</td></tr>
<tr><td>Πρόσωπα</td><td>γ΄ και α΄ πληθυντικό</td><td>Κυρίως γ΄ πρόσωπο, απρόσωπες δομές</td></tr>
<tr><td>Ύφος</td><td>Σοβαρό, προσιτό</td><td>Υψηλό, στοχαστικό</td></tr>
<tr><td>Κατάληξη</td><td>Προτροπή</td><td>Στοχαστική σύνθεση</td></tr></table></div>

<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Γράφεις το δοκίμιο σαν άρθρο, με αναφορές σε «αγαπητούς αναγνώστες» ή σε β΄ πρόσωπο («εσείς»).</li>
<li>Απαριθμείς ιδέες χωρίς ορισμούς, τεκμήρια και λογική σύνδεση.</li>
<li>Παραλείπεις την τοποθέτηση που ζητείται ή την κάνεις σε μία πρόταση χωρίς αιτιολόγηση.</li>
<li>«Φουσκώνεις» το ύφος με δυσνόητες λέξεις, θυσιάζοντας τη σαφήνεια.</li></ul></div>
`,
  widget: "na5planEss",
  gen: "na5gintro",
  exercises: [
    { shuffle: true, level: 1, type: "mc", q: R`Ποιο από τα παρακάτω χαρακτηρίζει κυρίως το δοκίμιο;`, options: ["Απρόσωπος, στοχαστικός λόγος σε γ΄ πρόσωπο με αυστηρή λογική οργάνωση", "Προσφώνηση και αποφώνηση", "Άμεση επαφή με ζωντανό ακροατήριο", "Οικείο ύφος και προφορικότητα"], correct: 0,
      hint: R`Ποιο είδος είναι το πιο «λόγιο» και απρόσωπο;`, sol: R`Το δοκίμιο έχει <b>απρόσωπο, στοχαστικό λόγο</b>, κυρίως σε γ΄ πρόσωπο, και αυστηρά λογική δομή.` },
    { shuffle: true, level: 1, type: "mc", q: R`Το δοκίμιο δεσμεύεται πάντα από την επικαιρότητα και ξεκινά από μια είδηση της ημέρας.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ποιο είδος έχει κατεξοχήν αφετηρία την επικαιρότητα;`, sol: R`<b>ΛΑΘΟΣ.</b> Η επικαιρότητα χαρακτηρίζει το <b>άρθρο</b>· το δοκίμιο έχει διαχρονικό χαρακτήρα.` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποια πρόταση είναι γραμμένη στο ύφος δοκιμίου;`, options: ["Η ελευθερία δεν νοείται χωρίς την ευθύνη που τη συνοδεύει και την οριοθετεί.", "Παιδιά, η ελευθερία είναι πολύ σημαντική!", "Αξιότιμε κύριε Υπουργέ, η ελευθερία μας απειλείται.", "Αγαπητοί συμμαθητές, απόψε θα μιλήσουμε για την ελευθερία."], correct: 0,
      hint: R`Αναζήτησε τη γενική, απρόσωπη διατύπωση.`, sol: R`Η πρόταση «Η ελευθερία δεν νοείται χωρίς την ευθύνη…» έχει <b>γενικό, απρόσωπο, στοχαστικό</b> χαρακτήρα. Οι άλλες ανήκουν σε προφορικό λόγο, επιστολή και ομιλία.` },
    { shuffle: true, level: 2, type: "mc", q: R`${PASSAGE(`Η παιδεία ορίζεται ως η ολόπλευρη καλλιέργεια του ανθρώπου. Διακρίνεται, ωστόσο, από την εκπαίδευση, η οποία αποτελεί την οργανωμένη μετάδοση γνώσεων και δεξιοτήτων. Η πρώτη αφορά τον άνθρωπο ως όλον· η δεύτερη ένα μέρος του.`, { title: "Απόσπασμα δοκιμίου" })}Ποιος τρόπος ανάπτυξης κυριαρχεί στο απόσπασμα;`, options: ["Ορισμός και σύγκριση–αντίθεση", "Αναλογία", "Αίτιο–αποτέλεσμα", "Παραδείγματα"], correct: 0,
      hint: R`Πρόσεξε το «ορίζεται» και το «διακρίνεται… από».`, sol: R`Το απόσπασμα <b>ορίζει</b> την παιδεία και την <b>αντιπαραβάλλει</b> με την εκπαίδευση — συνηθισμένοι τρόποι ανάπτυξης στο δοκίμιο.` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποια πρόταση μετατρέπει σε απρόσωπο, δοκιμιακό λόγο τη φράση «Εσείς πρέπει να προσέχετε τι διαβάζετε στο διαδίκτυο»;`, options: ["Είναι αναγκαίο να ελέγχεται κριτικά κάθε πληροφορία που προέρχεται από το διαδίκτυο.", "Πρόσεχε τι διαβάζεις στο διαδίκτυο!", "Εγώ προσέχω πάντα τι διαβάζω στο διαδίκτυο.", "Κύριοι, προσέξτε τι διαβάζετε στο διαδίκτυο."], correct: 0,
      hint: R`Ψάξε απρόσωπη έκφραση και παθητική σύνταξη.`, sol: R`Η απρόσωπη έκφραση «είναι αναγκαίο» και η παθητική σύνταξη («να ελέγχεται») δίνουν <b>γενικό και αντικειμενικό</b> χαρακτήρα.` },
    { shuffle: true, level: 1, type: "mc", q: R`Σε ποιον απευθύνεται το δοκίμιο;`, options: ["Στον καλλιεργημένο αναγνώστη γενικά, χωρίς συγκεκριμένο παραλήπτη", "Σε έναν αξιωματούχο, που κατονομάζεται", "Στο ακροατήριο μιας σχολικής εκδήλωσης", "Μόνο στους φίλους του συγγραφέα"], correct: 0,
      hint: R`Υπάρχει προσφώνηση στο δοκίμιο;`, sol: R`Το δοκίμιο <b>δεν έχει συγκεκριμένο δέκτη</b>· απευθύνεται στον καλλιεργημένο αναγνώστη γενικά.` },
    { shuffle: true, level: 3, type: "mc", q: R`${PASSAGE(`Σε δοκίμιό σας να εξετάσετε δύο (2) θετικές και δύο (2) αρνητικές επιπτώσεις της παγκοσμιοποίησης και να τοποθετηθείτε για το αν απειλεί την εθνική ταυτότητα.`, { title: "Εκφώνηση" })}Ποια οργάνωση του κύριου μέρους είναι σωστή;`, options: ["2 παράγραφοι θετικές επιπτώσεις + 2 αρνητικές + 1 παράγραφος τεκμηριωμένης τοποθέτησης", "4 παράγραφοι αρνητικές επιπτώσεις", "2 παράγραφοι θετικές + 2 αρνητικές, χωρίς τοποθέτηση", "1 παράγραφος για όλες τις επιπτώσεις + 3 για την τοποθέτηση"], correct: 0,
      hint: R`Εντόπισε ό,τι ζητά η εκφώνηση — και ό,τι ακολουθεί το «και να…».`, sol: R`Η εκφώνηση έχει τρία σκέλη: δύο θετικές, δύο αρνητικές επιπτώσεις και <b>τοποθέτηση</b>. Η τοποθέτηση χρειάζεται δική της παράγραφο με αιτιολόγηση.` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποια κατάληξη επιλόγου ταιριάζει σε δοκίμιο;`, options: ["Η τεχνολογία, τελικά, δεν είναι ούτε σωτήρας ούτε δυνάστης· είναι ο καθρέφτης των επιλογών μας.", "Σας ευχαριστώ για την προσοχή σας!", "Με εκτίμηση, ο συντάκτης.", "Τρέξτε τώρα να απενεργοποιήσετε τα κινητά σας!"], correct: 0,
      hint: R`Ο επίλογος του δοκιμίου συνθέτει στοχαστικά.`, sol: R`Η <b>στοχαστική σύνθεση με μεταφορά</b> ταιριάζει στο δοκίμιο. Οι άλλες ανήκουν σε ομιλία, επιστολή ή σε κηρυγματικό λόγο.` }
  ]
  };
})(),
/* ───────────────────────────── 5.5 ───────────────────────────── */
(() => {
  const M = `Κύριε Διευθυντά, αγαπητοί καθηγητές και καθηγήτριες, αγαπητοί γονείς, συμμαθητές και συμμαθήτριες,

Σήμερα, Ημέρα της Ευρώπης, το Μαθητικό Συμβούλιο μού ανέθεσε την τιμή να μιλήσω για κάτι που ζούμε καθημερινά χωρίς να το σκεφτόμαστε: τι σημαίνει για εμάς, τους νέους της Κύπρου, να είμαστε πολίτες της Ευρωπαϊκής Ένωσης. Και, κυρίως, πώς μπορούμε να μείνουμε ο εαυτός μας μέσα σε μια μεγάλη ευρωπαϊκή οικογένεια. Είκοσι και πλέον χρόνια μετά την ένταξη της Κύπρου, οι περισσότεροι από εμάς δεν γνωρίσαμε ποτέ μια Κύπρο έξω από την Ευρώπη.

Το πρώτο όφελος το γνωρίζουν πολλοί από εσάς: την ελευθερία να σπουδάσουμε και να εργαστούμε σε οποιαδήποτε χώρα της Ένωσης. Προγράμματα όπως το Erasmus+ έχουν στείλει χιλιάδες Κύπριους φοιτητές σε πανεπιστήμια της Ευρώπης, από όπου επέστρεψαν με γνώσεις, φίλους και ανοιχτούς ορίζοντες. Κάποιοι από εσάς, ίσως, θα είστε ανάμεσά τους σε λίγα χρόνια. Και δεν είναι μόνο οι σπουδές: κάθε Κύπριος νέος μπορεί να εργαστεί, να ταξιδέψει και να ζήσει σε είκοσι έξι άλλες χώρες χωρίς σύνορα.

Το δεύτερο όφελος είναι η οικονομική στήριξη. Ευρωπαϊκά κονδύλια χρηματοδοτούν δρόμους, σχολεία, ερευνητικά κέντρα και προγράμματα απασχόλησης για νέους. Ίσως δεν το προσέχουμε, αλλά η μικρή πινακίδα με τα αστέρια της Ευρώπης δίπλα σε ένα έργο σημαίνει ότι η Κύπρος δεν είναι μόνη. Πολλές από τις ευκαιρίες που θα έχουμε αύριο, τις οφείλουμε σε αυτή τη συνεργασία.

Το τρίτο, ίσως το σημαντικότερο, είναι οι κοινές αξίες: η δημοκρατία, ο σεβασμός των ανθρωπίνων δικαιωμάτων, η προστασία του περιβάλλοντος και του καταναλωτή. Όταν η Κύπρος μιλά για τα δικαιώματά της, δεν μιλά μόνη· τη στηρίζει η φωνή είκοσι επτά κρατών. Για έναν τόπο που ακόμη ζει με τη διαίρεση και την κατοχή, αυτή η αλληλεγγύη δεν είναι λεπτομέρεια· είναι στήριγμα.

Μήπως, όμως, όλο αυτό μάς κάνει να ξεχνάμε ποιοι είμαστε; Δεν χρειάζεται, αν φροντίσουμε δύο πράγματα. Πρώτα, τη γλώσσα μας. Όταν μιλάμε και γράφουμε σωστά ελληνικά, όταν διαβάζουμε τους ποιητές μας, κρατάμε ζωντανή την ταυτότητά μας και την προσφέρουμε στην Ευρώπη ως κάτι μοναδικό. Η ελληνική γλώσσα έδωσε στην Ευρώπη λέξεις όπως «δημοκρατία» και «φιλοσοφία»· θα ήταν κρίμα να την αντικαταστήσουμε εμείς με μισές λέξεις και ξένους όρους.

Έπειτα, την επαφή με την παράδοση και την ιστορία μας. Τα πανηγύρια του χωριού, οι ιστορίες των παππούδων, η μνήμη της κατεχόμενης γης δεν είναι παλιά πράγματα για μουσεία· είναι οι ρίζες που μας επιτρέπουν να ανοίξουμε φτερά χωρίς να χαθούμε. Όσο περισσότερο γνωρίζουμε ποιοι είμαστε, τόσο πιο άνετα συναντάμε τους άλλους, χωρίς φόβο και χωρίς αλαζονεία.

Αγαπητοί φίλοι, η Ευρώπη δεν μας ζητά να γίνουμε όλοι ίδιοι· μας καλεί να φέρουμε στο κοινό τραπέζι ό,τι πιο πολύτιμο έχουμε. Ας είμαστε, λοιπόν, περήφανοι Κύπριοι και ενεργοί Ευρωπαίοι ταυτόχρονα, με τις ρίζες μας βαθιά στο νησί και το βλέμμα μας ανοιχτό στον κόσμο.

Σας ευχαριστώ για την προσοχή σας.`;
  return {
  id: "5.5", unit: 5, title: "Ομιλία (προσχεδιασμένος προφορικός λόγος): προσφώνηση, ύφος, δομή και παράδειγμα",
  book: "Πίνακας προδιαγραφών 2026 · Κειμενικά είδη: Ομιλία (Προσχεδιασμένος Προφορικός Λόγος)",
  intro: "Πώς γράφεται μια ομιλία για σχολική εκδήλωση ή συνέδριο — πώς προσφωνούμε το ακροατήριο και πώς κρατάμε ζωντανή την προσοχή του;",
  thumb: LETTER("Ομιλία", "red"),
  na5genre: "ομιλία", na5model: M,
  theory: R`
<p>Η <b>ομιλία</b> είναι <b>προσχεδιασμένος προφορικός λόγος</b>: γράφεται από πριν, αλλά προορίζεται να <b>ακουστεί</b> από ένα ζωντανό ακροατήριο σε συγκεκριμένη περίσταση — μια σχολική γιορτή, ένα συνέδριο, μια ημερίδα, μια εκδήλωση του δήμου. Αυτό καθορίζει όλα της τα χαρακτηριστικά: ο ακροατής δεν μπορεί να «ξαναδιαβάσει» μια περίοδο, άρα ο λόγος πρέπει να είναι <b>σαφής, με καθαρή διάρθρωση, και να κρατά την προσοχή</b>. Στις Παγκύπριες η ομιλία κρίνεται τόσο στο περιεχόμενο όσο και στο αν ο υποψήφιος «ακούγεται» σαν ομιλητής μπροστά σε κοινό.</p>

<div class="tbox def"><h4>Δομικά στοιχεία της ομιλίας</h4>
<ul><li><b>Προσφώνηση</b> του ακροατηρίου, από το πιο επίσημο πρόσωπο προς το λιγότερο επίσημο: «Κύριε Διευθυντά, αγαπητοί καθηγητές και καθηγήτριες, αγαπητοί γονείς, συμμαθητές και συμμαθήτριες,».</li>
<li><b>Πρόλογος:</b> συστάσεις (με ποια ιδιότητα μιλάς) και αφορμή (γιατί μιλάς σήμερα), προαναγγελία του θέματος.</li>
<li><b>Κύριο μέρος:</b> τα ζητούμενα, με πολύ καθαρές διαρθρωτικές φράσεις («Το πρώτο όφελος…», «Το δεύτερο…»).</li>
<li><b>Επίλογος:</b> σύνοψη, έκκληση ή ευχή, και <b>ευχαριστίες</b>: «Σας ευχαριστώ για την προσοχή σας».</li></ul></div>

<div class="tbox"><h4>Ύφος και γλωσσικά μέσα της ομιλίας</h4>
<ul><li><b>Α΄ πρόσωπο</b> (ενικό και πληθυντικό: «εμείς οι νέοι») και <b>β΄ πληθυντικό</b> προς τους ακροατές («όπως γνωρίζετε») — άμεσο, ζωντανό ύφος.</li>
<li><b>Ρητορικά ερωτήματα</b> («Μήπως, όμως…;»), <b>επαναλήψεις</b> και <b>επαναπροσφωνήσεις</b> μέσα στο κείμενο («Αγαπητοί φίλοι,») για να κρατηθεί η προσοχή.</li>
<li>Περίοδοι κυρίως <b>μέσου μήκους</b>, παρατακτική σύνδεση, σαφές λεξιλόγιο — χωρίς να γίνεται οικείο ή αργκό.</li>
<li>Ο τόνος προσαρμόζεται στην περίσταση: πανηγυρικός σε γιορτή, σοβαρός σε συνέδριο, συγκινησιακός σε επέτειο.</li></ul></div>

<div class="tbox ex"><h4>Πρότυπη ομιλία (456 λέξεις)</h4>
<p class="small muted">Εκφώνηση: «Σε ομιλία σας, που θα εκφωνήσετε σε εκδήλωση του σχολείου σας για την Ημέρα της Ευρώπης, να αναφερθείτε σε τρία οφέλη που απολαμβάνουν οι νέοι της Κύπρου από την ένταξη της χώρας στην Ευρωπαϊκή Ένωση. Ακολούθως, να παρουσιάσετε δύο τρόπους με τους οποίους οι νέοι μπορούν να διατηρήσουν την εθνική και πολιτιστική τους ταυτότητα.»</p>
<details class="steps"><summary>Ενδεικτική απάντηση — δες την ομιλία</summary>
${PASSAGE(M, { source: "Πρωτότυπο κείμενο εξάσκησης" })}
<p><b>Ανάλυση:</b> προσφώνηση με ιεραρχία · πρόλογος με ιδιότητα («το Μαθητικό Συμβούλιο μού ανέθεσε…») και αφορμή (Ημέρα της Ευρώπης) · τρία οφέλη με αριθμητικές διαρθρωτικές φράσεις · ρητορικό ερώτημα ως μετάβαση στο δεύτερο ζητούμενο · δύο τρόποι («Πρώτα… Έπειτα…») · επαναπροσφώνηση «Αγαπητοί φίλοι», προτροπή και ευχαριστίες.</p></details></div>

<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Λείπει η προσφώνηση ή δεν ταιριάζει στο ακροατήριο της εκφώνησης (π.χ. «Αξιότιμε κύριε Υπουργέ» σε μαθητική συνέλευση).</li>
<li>Κείμενο που διαβάζεται σαν δοκίμιο: απρόσωπο, χωρίς καμία επαφή με τους ακροατές.</li>
<li>Υπερβολή στα ρητορικά ερωτήματα και στα θαυμαστικά — κουράζει και φαίνεται τεχνητό.</li>
<li>Ξεχνάς τις ευχαριστίες στο τέλος.</li>
<li>Αναφέρεις το όνομά σου στις συστάσεις («Ονομάζομαι…») — στις εξετάσεις δηλώνεις μόνο ιδιότητα.</li></ul></div>
`,
  widget: "na5planSp",
  gen: "na5gsp",
  exercises: [
    { shuffle: true, level: 1, type: "mc", q: R`Η ομιλία χαρακτηρίζεται ως:`, options: ["προσχεδιασμένος προφορικός λόγος", "αυθόρμητος προφορικός λόγος", "ιδιωτική επιστολή", "επιστημονική μελέτη"], correct: 0,
      hint: R`Γράφεται από πριν, αλλά για να ακουστεί.`, sol: R`Η ομιλία είναι <b>προσχεδιασμένος προφορικός λόγος</b>: γράφεται από πριν και εκφωνείται μπροστά σε ακροατήριο.` },
    { shuffle: true, level: 1, type: "mc", q: R`Ποια φράση ταιριάζει ως κλείσιμο ομιλίας;`, options: ["Σας ευχαριστώ για την προσοχή σας.", "Με εκτίμηση", "Με βαθύτατο σεβασμό", "Λευκωσία, 9 Μαΐου 2026"], correct: 0,
      hint: R`Ποια από αυτές απευθύνεται σε ακροατές;`, sol: R`Η ομιλία κλείνει με <b>ευχαριστίες προς το ακροατήριο</b>. Οι υπόλοιπες είναι στοιχεία επιστολής.` },
    { shuffle: true, level: 2, type: "mc", q: R`Σε ποια περίσταση ταιριάζει η προσφώνηση «Αξιότιμοι προσκεκλημένοι, αγαπητοί σύνεδροι,»;`, options: ["Σε συνέδριο μαθητικών συμβουλίων", "Σε επιστολή προς τον Υπουργό", "Σε άρθρο εφημερίδας", "Σε ιδιωτικό μήνυμα σε φίλο"], correct: 0,
      hint: R`Ποιοι είναι οι «σύνεδροι»;`, sol: R`«Σύνεδροι» είναι οι συμμετέχοντες σε <b>συνέδριο</b>· η προσφώνηση ταιριάζει σε ομιλία σε συνέδριο.` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποιο γλωσσικό μέσο χρησιμοποιεί συχνά ο ομιλητής για να κρατήσει την προσοχή του ακροατηρίου;`, options: ["Ρητορικά ερωτήματα και επαναπροσφωνήσεις («Αγαπητοί φίλοι,»)", "Πολύ μακριές, πυκνές περιόδους με δευτερεύουσες προτάσεις", "Αποκλειστικά απρόσωπη σύνταξη", "Τεχνικούς όρους χωρίς εξήγηση"], correct: 0,
      hint: R`Ο ακροατής δεν μπορεί να ξαναδιαβάσει· τι τον κρατά «ξύπνιο»;`, sol: R`Τα <b>ρητορικά ερωτήματα</b> και οι <b>επαναπροσφωνήσεις</b> ενεργοποιούν τον ακροατή. Οι μακροσκελείς, απρόσωπες ή τεχνικές διατυπώσεις δυσκολεύουν την πρόσληψη του προφορικού λόγου.` },
    { shuffle: true, level: 1, type: "mc", q: R`Στις Παγκύπριες, στον πρόλογο της ομιλίας ο υποψήφιος μπορεί να συστηθεί με το ονοματεπώνυμό του.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ποια οδηγία ισχύει για όλα τα κείμενα των εξετάσεων;`, sol: R`<b>ΛΑΘΟΣ.</b> Απαγορεύεται κάθε στοιχείο που αποκαλύπτει την ταυτότητα· ο ομιλητής δηλώνει μόνο ιδιότητα (π.χ. «ως εκπρόσωπος του μαθητικού συμβουλίου»).` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποια προσφώνηση ταιριάζει σε ομιλία σε σχολική εκδήλωση με παρόντες τον Διευθυντή, τους καθηγητές, τους γονείς και τους μαθητές;`, options: ["Κύριε Διευθυντά, αγαπητοί καθηγητές και καθηγήτριες, αγαπητοί γονείς, συμμαθητές και συμμαθήτριες,", "Γεια σας παιδιά!", "Αξιότιμε κύριε Υπουργέ,", "Αγαπητοί αναγνώστες,"], correct: 0,
      hint: R`Ξεκίνα από το πιο επίσημο πρόσωπο και μην ξεχάσεις καμία ομάδα.`, sol: R`Η προσφώνηση ξεκινά από τον <b>Διευθυντή</b> και περιλαμβάνει <b>όλες τις ομάδες</b> του ακροατηρίου, με κόμμα στο τέλος.` },
    { level: 3, q: R`${PASSAGE(`Αγαπητοί συμμαθητές και συμμαθήτριες,

Πόσες φορές αναρωτηθήκατε αν η ψήφος σας μετράει; Πόσες φορές είπατε «δεν αλλάζει τίποτα»; Σήμερα, ως πρόεδρος του μαθητικού συμβουλίου, θέλω να σας πω ότι αλλάζει. Αλλάζει, όταν συμμετέχουμε.`, { title: "Πρωτότυπη αρχή ομιλίας" })}Πόσα ρητορικά ερωτήματα υπάρχουν στο απόσπασμα;`, fields: [{ label: "Ρητορικά ερωτήματα:", ans: 2 }],
      hint: R`Μέτρα τα ερωτηματικά (;) — είναι ερωτήσεις που δεν περιμένουν απάντηση από το ακροατήριο.`, sol: R`<b>2</b>: «Πόσες φορές αναρωτηθήκατε…;» και «Πόσες φορές είπατε…;». Μαζί με την επανάληψη («Αλλάζει… Αλλάζει») δημιουργούν ρυθμό και εμπλέκουν τους ακροατές.` },
    { shuffle: true, level: 2, type: "mc", q: R`Γιατί στην ομιλία προτιμώνται οι σαφείς διαρθρωτικές φράσεις (π.χ. «Το πρώτο όφελος…», «Το δεύτερο…»);`, options: ["Γιατί ο ακροατής δεν μπορεί να ξαναδιαβάσει και χρειάζεται «σήματα» για να παρακολουθεί τη σκέψη του ομιλητή", "Γιατί απαγορεύονται οι άλλες διαρθρωτικές λέξεις", "Γιατί κάνουν το κείμενο πιο απρόσωπο", "Γιατί μειώνουν τον αριθμό των λέξεων"], correct: 0,
      hint: R`Σκέψου τη διαφορά ανάμεσα στο να διαβάζεις και στο να ακούς.`, sol: R`Στον προφορικό λόγο ο ακροατής <b>δεν μπορεί να γυρίσει πίσω</b>· οι σαφείς διαρθρωτικές φράσεις λειτουργούν ως «πινακίδες» που τον καθοδηγούν.` },
    { shuffle: true, level: 1, type: "mc", q: R`Ποιο στοιχείο <b>δεν</b> ανήκει στην ομιλία;`, options: ["Αποφώνηση «Με εκτίμηση» και υπογραφή", "Προσφώνηση του ακροατηρίου", "Ευχαριστίες στο τέλος", "Αναφορά στην αφορμή της ομιλίας"], correct: 0,
      hint: R`Ποιο στοιχείο είναι τυπικό στοιχείο επιστολής;`, sol: R`Η αποφώνηση <b>«Με εκτίμηση»</b> και η υπογραφή ανήκουν στην <b>επιστολή</b>. Η ομιλία κλείνει με ευχαριστίες.` }
  ]
  };
})(),
/* ───────────────────────────── 6.1 ───────────────────────────── */
{
  id: "6.1", unit: 6, title: "Παιδεία – Εκπαίδευση και ενεργός, συνειδητοποιημένος, ελεύθερος πολίτης: ιδέες και επιχειρήματα",
  book: "Πίνακας προδιαγραφών 2026 · Θεματική ενότητα 1",
  intro: "Ποια είναι η διαφορά παιδείας και εκπαίδευσης και πώς «χτίζεται» ο ενεργός, ελεύθερος πολίτης — με ποια επιχειρήματα θα το γράψεις στις Παγκύπριες;",
  thumb: LETTER("Παιδεία", "red"),
  theory: R`
<p>Η πρώτη <b>θεματική ενότητα</b> των Νέων Ελληνικών συνδέει δύο έννοιες που συχνά πέφτουν μαζί στις Παγκύπριες: την <b>παιδεία</b> και τον <b>πολίτη</b>. Το σχολείο δεν προετοιμάζει μόνο για εξετάσεις και επαγγέλματα· προετοιμάζει ανθρώπους που θα ζήσουν σε μια δημοκρατία. Γι’ αυτό τα θέματα αυτής της ενότητας ζητούν συνήθως <b>αίτια</b> (γιατί οι νέοι απέχουν, γιατί το σχολείο αποτυγχάνει), <b>συνέπειες</b> και <b>τρόπους</b> από συγκεκριμένους <b>φορείς</b> (σχολείο, οικογένεια, πολιτεία, ΜΜΕ, το ίδιο το άτομο).</p>

<div class="tbox def"><h4>Βασικές έννοιες</h4>
<table class="tbl"><tr><th>Έννοια</th><th>Ορισμός για χρήση σε πρόλογο</th></tr>
<tr><td><b>Παιδεία</b></td><td>Η ολόπλευρη καλλιέργεια του ανθρώπου — πνευματική, ηθική, συναισθηματική, σωματική — ώστε να γίνει ολοκληρωμένη προσωπικότητα.</td></tr>
<tr><td><b>Εκπαίδευση</b></td><td>Η οργανωμένη μετάδοση γνώσεων και δεξιοτήτων μέσα από θεσμούς (σχολείο, πανεπιστήμιο)· είναι <i>μέσο</i> της παιδείας.</td></tr>
<tr><td><b>Ενεργός πολίτης</b></td><td>Συμμετέχει στα κοινά: ψηφίζει, εκφράζεται, εθελοντεί, συμμετέχει σε συλλογικότητες.</td></tr>
<tr><td><b>Συνειδητοποιημένος πολίτης</b></td><td>Γνωρίζει δικαιώματα και υποχρεώσεις, ενημερώνεται κριτικά, αναλαμβάνει την ευθύνη των επιλογών του.</td></tr>
<tr><td><b>Ελεύθερος πολίτης</b></td><td>Σκέφτεται αυτόνομα, δεν χειραγωγείται· η ελευθερία του συνοδεύεται από ευθύνη και σεβασμό στην ελευθερία των άλλων.</td></tr></table></div>

<div class="tbox"><h4>Χάρτης του θέματος</h4>
<div class="figrow"><div><p><b>Αίτια προβλημάτων:</b> εξετασιοκεντρικό σχολείο, βαθμοθηρία, αποστήθιση, χρησιμοθηρική αντίληψη για τη μόρφωση, απαξίωση της πολιτικής, ατομικισμός, παθητική ψυχαγωγία.</p>
<p><b>Συνέπειες:</b> μονοδιάστατοι άνθρωποι, άγχος, πολίτες-θεατές, ευκολία χειραγώγησης, αποδυνάμωση της δημοκρατίας.</p></div>
<div><p><b>Λύσεις ανά φορέα:</b> <i>σχολείο</i> (ανθρωποκεντρική παιδεία, βιωματική μάθηση, μαθητικά συμβούλια) · <i>οικογένεια</i> (διάλογος, παράδειγμα, αυτονομία) · <i>πολιτεία</i> (αξιοκρατία, διαφάνεια, θεσμοί για νέους) · <i>ΜΜΕ</i> (ποιοτική ενημέρωση) · <i>άτομο</i> (ενημέρωση, εθελοντισμός).</p></div></div>
<p class="small muted">Στο εργαλείο πιο κάτω θα βρεις κάθε ιδέα με την ανάπτυξή της και μπορείς να φτιάξεις το δικό σου σχεδιάγραμμα.</p></div>

<div class="tbox ex"><h4>Υποδειγματική παράγραφος</h4>
${PASSAGE(`Ένας σημαντικός λόγος για τον οποίο το σύγχρονο σχολείο δυσκολεύεται να διαμορφώσει ενεργούς πολίτες είναι ο εξετασιοκεντρικός του χαρακτήρας. Η πληθώρα της ύλης και η πίεση των βαθμών μετατρέπουν τη μάθηση σε αγώνα δρόμου, όπου η απομνημόνευση υπερισχύει της κατανόησης. Έτσι, δεν μένει χρόνος για διάλογο, για ομαδική έρευνα ή για συμμετοχή σε δράσεις που θα έφερναν τον μαθητή σε επαφή με τα κοινά. Κατά συνέπεια, ο νέος αποφοιτά γνωρίζοντας τον ορισμό της δημοκρατίας, αλλά χωρίς να την έχει βιώσει.`, { source: "Πρωτότυπο κείμενο εξάσκησης" })}
<details class="steps"><summary>Λύση βήμα-βήμα — η δομή της παραγράφου</summary><p><b>Θεματική περίοδος:</b> η πρώτη (ο εξετασιοκεντρικός χαρακτήρας ως αιτία) · <b>λεπτομέρειες:</b> αιτιολόγηση (πληθώρα ύλης, πίεση) και αποτέλεσμα (καμία ευκαιρία διαλόγου) · <b>κατακλείδα:</b> «Κατά συνέπεια…» με την αντίθεση «γνωρίζει τον ορισμό – δεν την έχει βιώσει». Τρόπος ανάπτυξης: αίτιο–αποτέλεσμα.</p></details></div>

<div class="tbox tip"><h4>Χρήσιμο λεξιλόγιο</h4>
<p>αξιοκρατία · βαθμοθηρία · εξετασιοκεντρισμός · χρησιμοθηρία · ανθρωποκεντρική παιδεία · κριτική σκέψη · αυτονομία · ενσυναίσθηση · εθελοντισμός · συλλογικότητα · απολιτικοποίηση · χειραγώγηση · δημαγωγία · κοινωνική ευαισθησία · πολιτική συνείδηση.</p></div>

<div class="tbox rem"><h4>Πιθανά θέματα παραγωγής λόγου</h4>
<ul><li>Τρεις λόγοι αποχής των νέων από τα κοινά — τρεις τρόποι της οικογένειας/του σχολείου.</li>
<li>Τρία γνωρίσματα του ελεύθερου πολίτη — τρεις τρόποι συμβολής της εκπαίδευσης.</li>
<li>Οι αδυναμίες του εξετασιοκεντρικού σχολείου και προτάσεις αλλαγών (επιστολή προς τον Υπουργό).</li>
<li>Ο εθελοντισμός ως σχολείο δημοκρατίας (ομιλία σε εκδήλωση).</li></ul></div>

<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Ταυτίζεις παιδεία και εκπαίδευση· οι διορθωτές περιμένουν τη διάκριση.</li>
<li>Γράφεις λύσεις από άλλον φορέα από αυτόν που ζητείται.</li>
<li>Γενικόλογες φράσεις («το σχολείο πρέπει να βελτιωθεί») χωρίς συγκεκριμένο τρόπο και αιτιολόγηση.</li></ul></div>
`,
  widget: "na5ideas1",
  gen: "na5gt1",
  exercises: [
    { shuffle: true, level: 1, type: "mc", q: R`Ποια διατύπωση αποδίδει σωστά τη σχέση παιδείας και εκπαίδευσης;`, options: ["Η εκπαίδευση είναι μέσο της παιδείας· η παιδεία είναι ευρύτερη, γιατί αφορά την ολόπλευρη καλλιέργεια του ανθρώπου", "Είναι συνώνυμες λέξεις χωρίς καμία διαφορά", "Η παιδεία αφορά μόνο το σχολείο, ενώ η εκπαίδευση όλη τη ζωή", "Η εκπαίδευση είναι ευρύτερη από την παιδεία"], correct: 0,
      hint: R`Ποια έννοια είναι το «όλον» και ποια το «μέσο»;`, sol: R`Η <b>παιδεία</b> είναι η ολόπλευρη καλλιέργεια του ανθρώπου· η <b>εκπαίδευση</b>, η θεσμική μετάδοση γνώσεων, είναι ένα από τα μέσα της.` },
    { level: 1, q: R`Να γράψετε ένα αντώνυμο της λέξης <b>«ενεργός»</b>, όπως χρησιμοποιείται στη φράση «ενεργός πολίτης».`, fields: [{ label: "Αντώνυμο:", ans: ["παθητικός", "αδρανής", "απαθής", "αμέτοχος", "ανενεργός", "αδιάφορος", "παθητικος"], text: true }],
      hint: R`Ποιος πολίτης δεν συμμετέχει, μένει θεατής;`, sol: R`Αντώνυμα: <b>παθητικός</b>, αδρανής, απαθής, αμέτοχος, αδιάφορος.` },
    { level: 2, q: R`Να γράψετε ένα παράγωγο ουσιαστικό του ρήματος <b>«συμμετέχω»</b>.`, fields: [{ label: "Ουσιαστικό:", ans: ["συμμετοχή", "συμμετέχων", "συμμετέχουσα", "συμμέτοχος"], text: true }],
      hint: R`Σκέψου την πράξη ή το πρόσωπο που συμμετέχει.`, sol: R`<b>συμμετοχή</b> (η πράξη) · συμμετέχων/συμμετέχουσα, συμμέτοχος (το πρόσωπο).` },
    { shuffle: true, level: 2, type: "mc", q: R`Σε σχεδιάγραμμα για το θέμα «Γιατί οι νέοι απέχουν από τα κοινά», σε ποια κατηγορία ανήκει η ιδέα «Η αποχή αφήνει λίγους να αποφασίζουν για όλους, αποδυναμώνοντας τη δημοκρατία»;`, options: ["Συνέπειες", "Αίτια", "Λύσεις – φορείς", "Έννοιες"], correct: 0,
      hint: R`Η ιδέα περιγράφει τι προκαλεί η αποχή ή τι την προκαλεί;`, sol: R`Περιγράφει <b>αποτέλεσμα</b> της αποχής, άρα ανήκει στις <b>συνέπειες</b>.` },
    { shuffle: true, level: 1, type: "mc", q: R`Τι σημαίνει η λέξη <b>«χειραγώγηση»</b>;`, options: ["ο έλεγχος της σκέψης ή της συμπεριφοράς κάποιου χωρίς να το αντιλαμβάνεται", "η χειρωνακτική εργασία", "η καθοδήγηση ενός τυφλού", "η εκλογή αντιπροσώπων"], correct: 0,
      hint: R`χείρ + άγω: «οδηγώ από το χέρι» — αλλά με ποια μεταφορική σημασία;`, sol: R`<b>Χειραγώγηση</b> (χείρ + άγω): μεταφορικά, ο έλεγχος της σκέψης ή της συμπεριφοράς κάποιου χωρίς να το αντιλαμβάνεται.` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποιος από τους παρακάτω τρόπους αφορά τον φορέα <b>«σχολείο»</b>;`, options: ["Λειτουργία μαθητικών συμβουλίων και βιωματικών δράσεων όπου οι μαθητές ασκούν τη δημοκρατία", "Διάλογος των γονέων με τα παιδιά στο τραπέζι", "Ψήφιση νόμου για τη διαφάνεια στα κόμματα", "Ποιοτικές εκπομπές στην τηλεόραση"], correct: 0,
      hint: R`Ποια δράση γίνεται μέσα στη σχολική κοινότητα;`, sol: R`Τα <b>μαθητικά συμβούλια και οι βιωματικές δράσεις</b> είναι τρόπος του σχολείου. Οι άλλοι αφορούν οικογένεια, πολιτεία και ΜΜΕ.` },
    { level: 2, q: R`Να συμπληρώσετε τη λέξη που λείπει (ένα ουσιαστικό): «Η … είναι η αντίληψη ότι αξία έχει μόνο ό,τι αποφέρει πρακτικό όφελος· οδηγεί τους μαθητές να βλέπουν τη γνώση μόνο ως μέσο για ένα επάγγελμα.»`, fields: [{ label: "Λέξη:", ans: ["χρησιμοθηρία", "χρησιμοθηρισμός", "χρησιμοθηρική αντίληψη", "ωφελιμισμός"], text: true }],
      hint: R`Σύνθετη λέξη από το «χρήσιμος» και το «θηρεύω» (κυνηγώ).`, sol: R`<b>Χρησιμοθηρία</b> (ή ωφελιμισμός): η επιδίωξη μόνο του χρήσιμου, του πρακτικού οφέλους.` },
    { shuffle: true, level: 1, type: "mc", q: R`Ο ελεύθερος πολίτης κάνει ό,τι θέλει, χωρίς να λογαριάζει τις συνέπειες για τους άλλους.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ελευθερία και ευθύνη πάνε μαζί.`, sol: R`<b>ΛΑΘΟΣ.</b> Η ελευθερία του πολίτη συνοδεύεται από <b>ευθύνη</b> και σεβασμό στην ελευθερία των άλλων· αλλιώς γίνεται ασυδοσία.` },
    { shuffle: true, level: 3, type: "mc", q: R`${PASSAGE(`Η οικογένεια αποτελεί το πρώτο «σχολείο δημοκρατίας». Όταν οι γονείς συζητούν με τα παιδιά τους τα προβλήματα της κοινότητας και σέβονται τη γνώμη τους, τα παιδιά μαθαίνουν ότι η φωνή τους μετράει. Αντίθετα, ένα αυταρχικό περιβάλλον καλλιεργεί είτε την υποταγή είτε την αντίδραση. Επομένως, ο διάλογος στο σπίτι είναι η πρώτη άσκηση στη συμμετοχή.`, { source: "Πρωτότυπο κείμενο εξάσκησης" })}Ποιος τρόπος ανάπτυξης χρησιμοποιείται κυρίως στην παράγραφο;`, options: ["Σύγκριση – αντίθεση", "Ορισμός", "Διαίρεση", "Αναλογία"], correct: 0,
      hint: R`Τι κάνει η παράγραφος με τα δύο είδη οικογένειας που παρουσιάζει;`, sol: R`Η παράγραφος αντιπαραβάλλει τη <b>δημοκρατική</b> με την <b>αυταρχική</b> οικογένεια — τρόπος ανάπτυξης <b>σύγκριση–αντίθεση</b>.` }
  ]
},
/* ───────────────────────────── 6.2 ───────────────────────────── */
{
  id: "6.2", unit: 6, title: "Οικονομία – Διαφήμιση – Καταναλωτισμός: η υποδούλωση του σύγχρονου ανθρώπου",
  book: "Πίνακας προδιαγραφών 2026 · Θεματική ενότητα 2 · Παγκύπριες 2026 (θέμα: διαφήμιση και ηθικός καταναλωτής)",
  intro: "Πώς η διαφήμιση και ο καταναλωτισμός «υποδουλώνουν» τον σύγχρονο άνθρωπο και ποιος είναι ο ηθικός, συνειδητοποιημένος καταναλωτής — το θέμα των Παγκυπρίων 2026;",
  thumb: LETTER("Καταναλωτής", "red"),
  theory: R`
<p>Η δεύτερη <b>θεματική ενότητα</b> εξετάζει τη σχέση του ανθρώπου με την <b>οικονομία</b>, τη <b>διαφήμιση</b> και την <b>κατανάλωση</b>. Στις <b>Παγκύπριες 2026</b> το κείμενο της κατανόησης αφορούσε τις ηθικές επικρίσεις της διαφήμισης και την παραγωγή λόγου ζητούσε άρθρο για τα αρνητικά χαρακτηριστικά του σύγχρονου καταναλωτή και για τον ρόλο της εκπαίδευσης στη διαμόρφωση <b>ηθικών και συνειδητοποιημένων καταναλωτών</b>. Η κεντρική ιδέα της ενότητας είναι η <b>«υποδούλωση»</b>: ο άνθρωπος, ενώ πιστεύει ότι επιλέγει ελεύθερα, συχνά καθοδηγείται από ανάγκες που του δημιουργήθηκαν τεχνητά.</p>

<div class="tbox def"><h4>Βασικές έννοιες</h4>
<table class="tbl"><tr><th>Έννοια</th><th>Ορισμός</th></tr>
<tr><td><b>Καταναλωτισμός</b></td><td>Η τάση να αγοράζουμε περισσότερα από όσα χρειαζόμαστε, ως αυτοσκοπό και μέσο κοινωνικής καταξίωσης.</td></tr>
<tr><td><b>Διαφήμιση</b></td><td>Η επικοινωνιακή διαδικασία προβολής προϊόντων, υπηρεσιών ή ιδεών με στόχο να επηρεαστεί η συμπεριφορά του κοινού.</td></tr>
<tr><td><b>Πλασματικές ανάγκες</b></td><td>Ανάγκες που δεν πηγάζουν από τον άνθρωπο αλλά του «κατασκευάζονται» από τη διαφήμιση.</td></tr>
<tr><td><b>«Έχειν» – «είναι»</b></td><td>Η ταύτιση της αξίας και της ευτυχίας με την κατοχή αγαθών αντί για την καλλιέργεια του εαυτού.</td></tr>
<tr><td><b>Αλλοτρίωση</b></td><td>Η αποξένωση του ανθρώπου από τον εαυτό του, τους άλλους και τα ουσιαστικά προβλήματα.</td></tr>
<tr><td><b>Ηθικός καταναλωτής</b></td><td>Επιλέγει με κριτήρια ανάγκης, ποιότητας, δεοντολογίας και σεβασμού στο περιβάλλον· μπορεί να μποϊκοτάρει ανήθικες επιχειρήσεις.</td></tr></table></div>

<div class="tbox"><h4>Χάρτης του θέματος</h4>
<div class="figrow"><div><p><b>Αρνητικά χαρακτηριστικά του σύγχρονου καταναλωτή</b> (όπως στον οδηγό διόρθωσης 2026): πνευματικά ανελεύθερος, ψυχικά εξαρτημένος από την αγορά, αλλοτριωμένος, ευάλωτος στη χειραγώγηση, υλιστής και μονοδιάστατος, ατομικιστής, ανασφαλής, αγχώδης, σπάταλος, εργασιομανής.</p></div>
<div><p><b>Τρόποι της εκπαίδευσης:</b> ανθρωπιστική παιδεία και καλλιέργεια αξιών (μέτρο, ολιγάρκεια) · σύγχρονα αναλυτικά προγράμματα · εκπαιδευτικοί ως πρότυπα · μαθήματα που αποκωδικοποιούν τα μηνύματα (Λογοτεχνία, Οικονομικά, Πληροφορική, Τέχνη) · βιωματικές δράσεις · ψηφιακός και κριτικός γραμματισμός · περιβαλλοντική ευαισθητοποίηση.</p></div></div></div>

<div class="tbox ex"><h4>Υποδειγματική παράγραφος</h4>
${PASSAGE(`Ένα από τα πιο ανησυχητικά χαρακτηριστικά του σύγχρονου καταναλωτή είναι η ψυχική του εξάρτηση από την αγορά. Η διαφήμιση δεν πουλά απλώς προϊόντα· πουλά υποσχέσεις ευτυχίας, ομορφιάς και κοινωνικής αποδοχής. Έτσι, ο άνθρωπος αρχίζει να ταυτίζει την αξία του με όσα έχει και όχι με όσα είναι. Κάθε νέα αγορά προσφέρει μια στιγμιαία ικανοποίηση, που γρήγορα δίνει τη θέση της σε μια νέα επιθυμία. Ο καταναλωτής, λοιπόν, δεν είναι ελεύθερος να επιλέγει· είναι δέσμιος ενός κύκλου που δεν τελειώνει ποτέ.`, { source: "Πρωτότυπο κείμενο εξάσκησης" })}
<details class="steps"><summary>Λύση βήμα-βήμα — η δομή της παραγράφου</summary><p><b>Θεματική περίοδος:</b> η ψυχική εξάρτηση ως χαρακτηριστικό · <b>λεπτομέρειες:</b> τι «πουλά» η διαφήμιση, η ταύτιση αξίας με το «έχειν», ο κύκλος ικανοποίησης–επιθυμίας · <b>κατακλείδα:</b> «Ο καταναλωτής, λοιπόν, … δέσμιος». Η μεταφορά «δέσμιος ενός κύκλου» δένει την παράγραφο με την έννοια της υποδούλωσης.</p></details></div>

<div class="tbox tip"><h4>Χρήσιμο λεξιλόγιο</h4>
<p>υπερκατανάλωση · πλασματικές ανάγκες · αλλοτρίωση · ευδαιμονισμός · υλισμός · μιμητισμός · καταναλωτική συνείδηση · ολιγάρκεια · μέτρο · ευζωία · παραπλανητική διαφήμιση · προσωποποιημένη διαφήμιση · μποϊκοτάζ · εργασιομανία · οικολογικό αποτύπωμα.</p></div>

<div class="tbox rem"><h4>Πιθανά θέματα παραγωγής λόγου</h4>
<ul><li>Τρόποι με τους οποίους η διαφήμιση επηρεάζει τους εφήβους — μέτρα υπεύθυνης κατανάλωσης από τους ίδιους.</li>
<li>Αιτίες της υπερκατανάλωσης και επιπτώσεις της στο περιβάλλον.</li>
<li>Τα θετικά και τα αρνητικά της διαφήμισης — τοποθέτηση (δοκίμιο).</li>
<li>Ο ηθικός καταναλωτής: γνωρίσματα και ρόλος της οικογένειας.</li></ul></div>

<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Γράφεις μόνο για τη διαφήμιση, ενώ ζητούνται χαρακτηριστικά του <i>καταναλωτή</i>.</li>
<li>Δαιμονοποιείς συλλήβδην τη διαφήμιση· ένα ισορροπημένο κείμενο αναγνωρίζει και τον ενημερωτικό ρόλο της.</li>
<li>Επαναλαμβάνεις τα επιχειρήματα του κειμένου της κατανόησης αντί να γράψεις δικά σου.</li></ul></div>
`,
  widget: "na5ideas2",
  gen: "na5gt2",
  exercises: [
    { shuffle: true, level: 1, type: "mc", q: R`Τι είναι οι <b>«πλασματικές ανάγκες»</b>;`, options: ["Ανάγκες που δεν πηγάζουν από τον άνθρωπο, αλλά του δημιουργούνται τεχνητά, π.χ. από τη διαφήμιση", "Οι βασικές ανάγκες για τροφή και στέγη", "Οι ανάγκες των επιχειρήσεων για κέρδος", "Οι πνευματικές ανάγκες του ανθρώπου"], correct: 0,
      hint: R`«Πλασματικός» από το «πλάθω»: κάτι που κατασκευάζεται.`, sol: R`<b>Πλασματικές</b> είναι οι ανάγκες που <b>κατασκευάζονται</b> τεχνητά — δεν αντιστοιχούν σε πραγματική ανάγκη του ανθρώπου.` },
    { level: 1, q: R`Να γράψετε ένα αντώνυμο της λέξης <b>«πλασματικές»</b> στη φράση «πλασματικές ανάγκες».`, fields: [{ label: "Αντώνυμο:", ans: ["πραγματικές", "αληθινές", "γνήσιες", "ουσιαστικές", "αυθεντικές", "υπαρκτές", "βασικές", "πραγματική", "αληθινή"], text: true }],
      hint: R`Ποιες ανάγκες υπάρχουν πραγματικά;`, sol: R`<b>πραγματικές</b> (ή αληθινές, γνήσιες, ουσιαστικές) ανάγκες.` },
    { level: 2, q: R`Να γράψετε ένα παράγωγο ουσιαστικό και ένα παράγωγο επίθετο του ρήματος <b>«καταναλώνω»</b>.`, fields: [{ label: "Ουσιαστικό:", ans: ["κατανάλωση", "καταναλωτής", "καταναλώτρια", "καταναλωτισμός"], text: true }, { label: "Επίθετο:", ans: ["καταναλωτικός", "καταναλωτική", "καταναλωτικό", "καταναλώσιμος", "καταναλώσιμη", "καταναλώσιμο"], text: true }],
      hint: R`Σκέψου την πράξη, το πρόσωπο και την ιδιότητα (π.χ. «… κοινωνία»).`, sol: R`Ουσιαστικό: <b>κατανάλωση</b>, καταναλωτής, καταναλωτισμός · Επίθετο: <b>καταναλωτικός</b> (καταναλωτική κοινωνία), καταναλώσιμος.` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποιο από τα παρακάτω <b>δεν</b> είναι αρνητικό χαρακτηριστικό του καταναλωτή που προκύπτει από την επίδραση της διαφήμισης;`, options: ["Ελέγχει τις πληροφορίες και συγκρίνει πριν αγοράσει", "Αγχώνεται, γιατί πάντα υπάρχει κάτι νεότερο να αποκτήσει", "Ταυτίζει την ευτυχία με την κατοχή αγαθών", "Παρασύρεται σε αλόγιστες αγορές και δανεισμό"], correct: 0,
      hint: R`Ποιο χαρακτηριστικό ανήκει στον ηθικό, συνειδητοποιημένο καταναλωτή;`, sol: R`Ο έλεγχος και η σύγκριση πριν από την αγορά είναι γνώρισμα του <b>συνειδητοποιημένου</b> καταναλωτή, όχι αρνητικό χαρακτηριστικό.` },
    { shuffle: true, level: 1, type: "mc", q: R`Τι σημαίνει η λέξη <b>«αλλοτρίωση»</b>;`, options: ["η αποξένωση του ανθρώπου από τον εαυτό του και τους άλλους", "η αλλαγή επαγγέλματος", "η πώληση ενός αγαθού σε άλλον", "η αλλαγή της τιμής ενός προϊόντος"], correct: 0,
      hint: R`«Αλλότριος» σημαίνει ξένος.`, sol: R`<b>Αλλοτρίωση</b> (από το «αλλότριος» = ξένος): ο άνθρωπος γίνεται ξένος προς τον εαυτό του, τους άλλους και τα ουσιαστικά προβλήματα.` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποιος τρόπος αφορά τον φορέα <b>«εκπαιδευτικό σύστημα»</b> για τη διαμόρφωση ηθικών καταναλωτών;`, options: ["Καλλιέργεια ψηφιακού και κριτικού γραμματισμού, ώστε οι μαθητές να αποκωδικοποιούν τα διαφημιστικά μηνύματα", "Αυστηρότερη νομοθεσία για τις διαφημίσεις προς παιδιά", "Αυτορρύθμιση των διαφημιστικών εταιρειών", "Μποϊκοτάζ ανήθικων επιχειρήσεων από τους πολίτες"], correct: 0,
      hint: R`Ποιος τρόπος υλοποιείται μέσα από τη μάθηση;`, sol: R`Ο <b>ψηφιακός και κριτικός γραμματισμός</b> καλλιεργείται από το σχολείο. Οι άλλοι αφορούν την πολιτεία, τις επιχειρήσεις και το άτομο.` },
    { level: 2, q: R`Να γράψετε ένα συνώνυμο της λέξης <b>«ολιγάρκεια»</b>.`, fields: [{ label: "Συνώνυμο:", ans: ["λιτότητα", "εγκράτεια", "λιτή ζωή", "μέτρο", "απλότητα", "ολιγοδεΐα"], text: true }],
      hint: R`Ολίγα + αρκώ: αρκούμαι στα λίγα.`, sol: R`Συνώνυμα: <b>λιτότητα</b>, εγκράτεια, μέτρο, απλότητα.` },
    { shuffle: true, level: 1, type: "mc", q: R`Η διαφήμιση δεν έχει κανένα θετικό ρόλο και ένα ισορροπημένο κείμενο δεν πρέπει να αναφέρει κανένα θετικό της.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Η διαφήμιση δίνει και πληροφορίες· υπάρχουν και κοινωνικές διαφημίσεις.`, sol: R`<b>ΛΑΘΟΣ.</b> Η διαφήμιση <b>ενημερώνει</b>, στηρίζει την οικονομία και υπάρχουν κοινωνικές διαφημίσεις. Η κριτική αφορά τις υπερβολές και την παραπλάνηση.` },
    { shuffle: true, level: 3, type: "mc", q: R`${PASSAGE(`Ο ηθικός καταναλωτής δεν αρνείται την κατανάλωση· την επιλέγει. Πριν αγοράσει, αναρωτιέται αν χρειάζεται πράγματι κάτι, ποιος το παρήγαγε και με ποιο κόστος για το περιβάλλον. Προτιμά προϊόντα που δεν παράγονται με παιδική εργασία, ανακυκλώνει, επαναχρησιμοποιεί. Με τον τρόπο αυτό, η αγορά του γίνεται πράξη ευθύνης.`, { source: "Πρωτότυπο κείμενο εξάσκησης" })}Ποιος είναι ο κυριότερος τρόπος ανάπτυξης της παραγράφου;`, options: ["Παραδείγματα (συγκεκριμένες πρακτικές του ηθικού καταναλωτή)", "Αναλογία", "Σύγκριση – αντίθεση με τον παραδοσιακό καταναλωτή", "Αίτιο – αποτέλεσμα της υπερκατανάλωσης"], correct: 0,
      hint: R`Τι περιέχουν κυρίως οι μεσαίες περίοδοι;`, sol: R`Η παράγραφος αναπτύσσεται κυρίως με <b>παραδείγματα</b>: συγκεκριμένες πρακτικές (ερωτήσεις πριν από την αγορά, προτίμηση ηθικών προϊόντων, ανακύκλωση) που φωτίζουν την έννοια του ηθικού καταναλωτή.` }
  ]
},
/* ───────────────────────────── 6.3 ───────────────────────────── */
{
  id: "6.3", unit: 6, title: "Κύπρος – Ελλάδα – Ευρώπη – Κόσμος: εθνική ταυτότητα, παγκοσμιοποίηση και πολυπολιτισμικότητα",
  book: "Πίνακας προδιαγραφών 2026 · Θεματική ενότητα 3",
  intro: "Πώς ζει ο νέος Κύπριος ως Ευρωπαίος και πολίτης του κόσμου χωρίς να χάσει την ταυτότητά του — και ποια επιχειρήματα θα χρησιμοποιήσεις για την παγκοσμιοποίηση;",
  thumb: LETTER("Ευρώπη", "red"),
  theory: R`
<p>Η τρίτη <b>θεματική ενότητα</b> τοποθετεί τον νέο της Κύπρου σε ομόκεντρους κύκλους: <b>Κύπρος – Ελλάδα – Ευρώπη – Κόσμος</b>. Τα θέματα αφορούν την <b>εθνική και πολιτιστική ταυτότητα</b>, την <b>ευρωπαϊκή ενοποίηση</b>, την <b>παγκοσμιοποίηση</b>, την <b>πολυπολιτισμικότητα</b> και τη μετανάστευση, αλλά και τον <b>ρατσισμό και την ξενοφοβία</b>. Το κλειδί για ένα ώριμο κείμενο είναι η <b>ισορροπία</b>: να αναγνωρίζεις τα οφέλη του ανοίγματος στον κόσμο και ταυτόχρονα τους κινδύνους της αλλοίωσης — η γνωστή φράση «ρίζες και φτερά».</p>

<div class="tbox def"><h4>Βασικές έννοιες</h4>
<table class="tbl"><tr><th>Έννοια</th><th>Ορισμός</th></tr>
<tr><td><b>Εθνική ταυτότητα</b></td><td>Τα στοιχεία που ενώνουν ένα έθνος: γλώσσα, ιστορία, παράδοση, θρησκεία, πολιτισμός, κοινή συνείδηση.</td></tr>
<tr><td><b>Παγκοσμιοποίηση</b></td><td>Η αυξανόμενη αλληλεξάρτηση οικονομιών, κοινωνιών και πολιτισμών σε παγκόσμια κλίμακα.</td></tr>
<tr><td><b>Πολυπολιτισμικότητα</b></td><td>Η συνύπαρξη ανθρώπων διαφορετικής καταγωγής, γλώσσας και θρησκείας στην ίδια κοινωνία.</td></tr>
<tr><td><b>Πατριωτισμός – εθνικισμός</b></td><td>Ο πατριωτισμός είναι αγάπη για την πατρίδα· ο εθνικισμός την υπερτιμά, υποτιμώντας ή εχθρευόμενος άλλους λαούς.</td></tr>
<tr><td><b>Πολιτιστική ομογενοποίηση</b></td><td>Η εξαφάνιση των τοπικών ιδιαιτεροτήτων μπροστά σε ένα κυρίαρχο παγκόσμιο πρότυπο.</td></tr></table></div>

<div class="tbox"><h4>Χάρτης του θέματος</h4>
<div class="figrow"><div><p><b>Οφέλη:</b> ελεύθερη κυκλοφορία, σπουδές και εργασία στην ΕΕ (Erasmus+), ευρωπαϊκά κονδύλια, πολιτική ασφάλεια και διεθνής φωνή, γνωριμία με άλλους πολιτισμούς, κοινές αξίες (δημοκρατία, δικαιώματα).</p>
<p><b>Κίνδυνοι:</b> αλλοίωση της ταυτότητας και της γλώσσας, ομογενοποίηση της νεολαίας, οικονομική εξάρτηση, «διαρροή εγκεφάλων», ξενοφοβία, το άλυτο Κυπριακό.</p></div>
<div><p><b>Τρόποι διατήρησης ταυτότητας / λύσεις:</b> σχολείο (ιστορία, λογοτεχνία, παράδοση, διαπολιτισμική αγωγή) · οικογένεια (μεταφορά ηθών, ιστοριών) · πολιτεία (στήριξη πολιτισμού, κίνητρα παραμονής νέων) · ΜΜΕ και διαδίκτυο (ελληνική παραγωγή) · άτομο (ανοιχτότητα χωρίς αφομοίωση).</p></div></div></div>

<div class="tbox ex"><h4>Υποδειγματική παράγραφος</h4>
${PASSAGE(`Η γλώσσα αποτελεί τον πιο ζωντανό φορέα της εθνικής ταυτότητας. Μέσα από αυτήν μεταβιβάζονται η ιστορία, οι αξίες και ο τρόπος με τον οποίο ένας λαός βλέπει τον κόσμο. Γι’ αυτό, όταν οι νέοι αντικαθιστούν τις ελληνικές λέξεις με αγγλικούς όρους ή γράφουν με λατινικούς χαρακτήρες, δεν αλλάζουν απλώς τον τρόπο που εκφράζονται· απομακρύνονται σιγά σιγά από τις ρίζες τους. Η φροντίδα της γλώσσας, επομένως, δεν είναι συντηρητισμός, αλλά προϋπόθεση για να συμμετέχουμε στην Ευρώπη με δική μας φωνή.`, { source: "Πρωτότυπο κείμενο εξάσκησης" })}
<details class="steps"><summary>Λύση βήμα-βήμα — η δομή της παραγράφου</summary><p><b>Θεματική περίοδος:</b> η γλώσσα ως φορέας ταυτότητας · <b>λεπτομέρειες:</b> τι μεταβιβάζει η γλώσσα, παράδειγμα (αγγλισμοί, λατινικοί χαρακτήρες) και αποτέλεσμα · <b>κατακλείδα:</b> «επομένως» + αντίθεση «δεν είναι συντηρητισμός, αλλά προϋπόθεση». Τρόποι ανάπτυξης: αιτιολόγηση και αίτιο–αποτέλεσμα.</p></details></div>

<div class="tbox tip"><h4>Χρήσιμο λεξιλόγιο</h4>
<p>εθνική/πολιτιστική ταυτότητα · ιστορική μνήμη · παγκοσμιοποίηση · ομογενοποίηση · αφομοίωση · ξενομανία · ξενοφοβία · ρατσισμός · διαπολιτισμικότητα · πολυπολιτισμικότητα · κοσμοπολιτισμός · εθνοκεντρισμός · αλληλεγγύη · διαρροή εγκεφάλων · ευρωπαϊκή ολοκλήρωση.</p></div>

<div class="tbox rem"><h4>Πιθανά θέματα παραγωγής λόγου</h4>
<ul><li>Οφέλη της ευρωπαϊκής ένταξης για τους νέους — τρόποι διατήρησης της ταυτότητας (ομιλία για την Ημέρα της Ευρώπης).</li>
<li>Αίτια της ξενοφοβίας και τρόποι καταπολέμησής της από το σχολείο.</li>
<li>Θετικά και αρνητικά της παγκοσμιοποίησης για μια μικρή χώρα — τοποθέτηση (δοκίμιο).</li>
<li>Η «διαρροή εγκεφάλων» από την Κύπρο: αίτια και μέτρα της πολιτείας (επιστολή).</li></ul></div>

<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Συγχέεις τον πατριωτισμό με τον εθνικισμό.</li>
<li>Γράφεις μονόπλευρα «εναντίον» της Ευρώπης ή του ξένου, χωρίς να αναγνωρίζεις οφέλη.</li>
<li>Χρησιμοποιείς στερεότυπα για άλλους λαούς — αντιβαίνει στο πνεύμα της ενότητας.</li></ul></div>
`,
  widget: "na5ideas3",
  gen: "na5gt3",
  exercises: [
    { shuffle: true, level: 1, type: "mc", q: R`Ποια είναι η διαφορά πατριωτισμού και εθνικισμού;`, options: ["Ο πατριωτισμός είναι αγάπη για την πατρίδα, ενώ ο εθνικισμός την υπερτιμά, υποτιμώντας άλλους λαούς", "Είναι ακριβώς το ίδιο", "Ο εθνικισμός είναι ήπια μορφή πατριωτισμού", "Ο πατριωτισμός απορρίπτει κάθε ξένο στοιχείο"], correct: 0,
      hint: R`Ποια στάση είναι εχθρική προς τους άλλους;`, sol: R`Ο <b>πατριωτισμός</b> είναι αγάπη και προσφορά στην πατρίδα· ο <b>εθνικισμός</b> υπερτιμά το δικό μας έθνος και υποτιμά ή εχθρεύεται τα άλλα.` },
    { level: 1, q: R`Να γράψετε ένα αντώνυμο της λέξης <b>«ξενοφοβία»</b>.`, fields: [{ label: "Αντώνυμο:", ans: ["φιλοξενία", "ξενοφιλία", "ανεκτικότητα", "ανοχή", "αποδοχή", "φιλαλληλία", "αλληλεγγύη"], text: true }],
      hint: R`Ποια στάση δέχεται με αγάπη τον ξένο;`, sol: R`Αντώνυμα: <b>φιλοξενία</b>, ξενοφιλία, ανεκτικότητα, αποδοχή.` },
    { shuffle: true, level: 2, type: "mc", q: R`Τι σημαίνει η <b>«διαρροή εγκεφάλων»</b>;`, options: ["η μετανάστευση μορφωμένων νέων στο εξωτερικό, με απώλεια ανθρώπινου δυναμικού για τη χώρα", "η μείωση της νοημοσύνης λόγω της τεχνολογίας", "η διαρροή προσωπικών δεδομένων στο διαδίκτυο", "η εισροή επιστημόνων από το εξωτερικό"], correct: 0,
      hint: R`Μεταφορική έκφραση: ποιοι «εγκέφαλοι» φεύγουν;`, sol: R`Είναι η <b>μετανάστευση των μορφωμένων νέων</b> (επιστημόνων) στο εξωτερικό· η χώρα χάνει το πιο δημιουργικό της δυναμικό.` },
    { level: 2, q: R`Να γράψετε ένα παράγωγο επίθετο του ουσιαστικού <b>«πολιτισμός»</b>.`, fields: [{ label: "Επίθετο:", ans: ["πολιτιστικός", "πολιτιστική", "πολιτιστικό", "πολιτισμικός", "πολιτισμική", "πολιτισμικό", "πολιτισμένος", "πολιτισμένη", "πολιτισμένο"], text: true }],
      hint: R`Π.χ. «… ταυτότητα», «… κληρονομιά».`, sol: R`<b>πολιτιστικός</b> (πολιτιστική κληρονομιά), πολιτισμικός (πολιτισμικές διαφορές), πολιτισμένος.` },
    { shuffle: true, level: 2, type: "mc", q: R`Σε σχεδιάγραμμα για το θέμα «Η Κύπρος στην Ευρωπαϊκή Ένωση», σε ποια κατηγορία ανήκει η ιδέα «Η Κύπρος συμμετέχει στις αποφάσεις ενός ισχυρού διεθνούς οργανισμού»;`, options: ["Οφέλη – θετικά", "Κίνδυνοι – προβλήματα", "Λύσεις – φορείς", "Έννοιες"], correct: 0,
      hint: R`Είναι κάτι που κερδίζει ή που χάνει η χώρα;`, sol: R`Είναι <b>όφελος</b> της ένταξης: πολιτική ασφάλεια και διεθνής φωνή.` },
    { shuffle: true, level: 1, type: "mc", q: R`Η πολυπολιτισμικότητα σημαίνει ότι όλοι οι πολίτες πρέπει να εγκαταλείψουν τις παραδόσεις τους και να υιοθετήσουν μία κοινή κουλτούρα.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Συνύπαρξη ή αφομοίωση;`, sol: R`<b>ΛΑΘΟΣ.</b> Η πολυπολιτισμικότητα σημαίνει <b>συνύπαρξη</b> διαφορετικών πολιτισμών με σεβασμό· η εγκατάλειψη της ταυτότητας είναι <b>αφομοίωση</b>.` },
    { level: 2, q: R`Να γράψετε ένα συνώνυμο της λέξης <b>«ομογενοποίηση»</b>, όπως στη φράση «πολιτιστική ομογενοποίηση».`, fields: [{ label: "Συνώνυμο:", ans: ["ισοπέδωση", "εξομοίωση", "ομοιομορφία", "ομοιομορφοποίηση", "τυποποίηση"], text: true }],
      hint: R`Όλοι γίνονται «ίδιοι».`, sol: R`Συνώνυμα: <b>ισοπέδωση</b>, εξομοίωση, ομοιομορφία, τυποποίηση.` },
    { shuffle: true, level: 3, type: "mc", q: R`${PASSAGE(`Όπως ένα δέντρο αντέχει στον άνεμο μόνο όταν έχει βαθιές ρίζες, έτσι και ένας λαός μπορεί να ανοιχτεί στον κόσμο χωρίς να χαθεί, μόνο όταν γνωρίζει την ιστορία και τη γλώσσα του. Οι ρίζες δεν εμποδίζουν το δέντρο να ψηλώνει· του επιτρέπουν να ψηλώνει.`, { source: "Πρωτότυπο κείμενο εξάσκησης" })}Ποιος τρόπος ανάπτυξης χρησιμοποιείται;`, options: ["Αναλογία", "Ορισμός", "Διαίρεση", "Αίτιο – αποτέλεσμα"], correct: 0,
      hint: R`Με ποιο οικείο αντικείμενο παραλληλίζεται ο λαός;`, sol: R`Το σχήμα «Όπως… έτσι και…» δείχνει <b>αναλογία</b>: ο λαός παραλληλίζεται με δέντρο και η ταυτότητα με τις ρίζες του.` }
  ]
},
/* ───────────────────────────── 6.4 ───────────────────────────── */
{
  id: "6.4", unit: 6, title: "Επιστήμη – Τεχνολογία: εξανδραποδισμός του ανθρώπου και διατάραξη του οικοσυστήματος",
  book: "Πίνακας προδιαγραφών 2026 · Θεματική ενότητα 4",
  intro: "Πότε η επιστήμη και η τεχνολογία ελευθερώνουν τον άνθρωπο και πότε τον «εξανδραποδίζουν» — και πώς συνδέονται με την κλιματική κρίση και τη διατάραξη του οικοσυστήματος;",
  thumb: LETTER("Τεχνολογία", "red"),
  theory: R`
<p>Η τέταρτη <b>θεματική ενότητα</b> εξετάζει τη <b>διπλή όψη της επιστήμης και της τεχνολογίας</b>. Από τη μια, χάρισαν στον άνθρωπο υγεία, μακροζωία, γνώση και ευκολίες· από την άλλη, όταν χρησιμοποιούνται χωρίς ηθικά όρια, οδηγούν σε <b>εξάρτηση</b>, σε <b>απειλές για την ελευθερία</b> και στη <b>διατάραξη του οικοσυστήματος</b>. Ο δύσκολος όρος <b>«εξανδραποδισμός»</b> σημαίνει κυριολεκτικά την πώληση ανθρώπων ως δούλων· στη θεματική ενότητα χρησιμοποιείται μεταφορικά για τον άνθρωπο που γίνεται «δούλος» των δημιουργημάτων του — των μηχανών, των οθονών, των αλγορίθμων.</p>

<div class="tbox def"><h4>Βασικές έννοιες</h4>
<table class="tbl"><tr><th>Έννοια</th><th>Ορισμός</th></tr>
<tr><td><b>Επιστήμη</b></td><td>Η συστηματική, τεκμηριωμένη γνώση του κόσμου, που προκύπτει από παρατήρηση, πείραμα και έλεγχο.</td></tr>
<tr><td><b>Τεχνολογία</b></td><td>Η εφαρμογή της επιστημονικής γνώσης για την κατασκευή μέσων που διευκολύνουν τη ζωή.</td></tr>
<tr><td><b>Εξανδραποδισμός</b></td><td>Μεταφορικά: η υποδούλωση του ανθρώπου στα ίδια του τα δημιουργήματα.</td></tr>
<tr><td><b>Οικοσύστημα</b></td><td>Το σύνολο των ζωντανών οργανισμών και του περιβάλλοντος με το οποίο αλληλεπιδρούν.</td></tr>
<tr><td><b>Αειφορία</b></td><td>Η ανάπτυξη που καλύπτει τις σημερινές ανάγκες χωρίς να στερεί τις επόμενες γενιές.</td></tr>
<tr><td><b>Βιοηθική</b></td><td>Ο κλάδος που εξετάζει τα ηθικά όρια των επιστημών της ζωής.</td></tr></table></div>

<div class="tbox"><h4>Χάρτης του θέματος</h4>
<div class="figrow"><div><p><b>Οφέλη:</b> υγεία και μακροζωία, πρόσβαση στη γνώση, ευκολίες στην εργασία, ανανεώσιμες πηγές ενέργειας, νέα επαγγέλματα, δημοκρατικότητα της πληροφορίας.</p>
<p><b>Κίνδυνοι – συνέπειες:</b> εξάρτηση από οθόνες, ανεργία λόγω αυτοματοποίησης, παραβίαση ιδιωτικότητας, παραπληροφόρηση, κλιματική αλλαγή, ρύπανση, απώλεια βιοποικιλότητας.</p></div>
<div><p><b>Λύσεις ανά φορέα:</b> σχολείο (ψηφιακός και περιβαλλοντικός γραμματισμός) · επιστήμονες (δεοντολογία, βιοηθική) · πολιτεία και διεθνείς οργανισμοί (νομοθεσία για δεδομένα και ΤΝ, συμφωνίες για το κλίμα) · οικογένεια (όρια στον χρόνο οθόνης) · ΜΜΕ (υπεύθυνη ενημέρωση) · άτομο (ψηφιακή αποτοξίνωση, ανακύκλωση).</p></div></div></div>

<div class="tbox ex"><h4>Υποδειγματική παράγραφος</h4>
${PASSAGE(`Η διατάραξη του οικοσυστήματος δεν είναι πια ένα μακρινό σενάριο, αλλά καθημερινή εμπειρία. Οι παρατεταμένοι καύσωνες, οι πυρκαγιές που κάθε καλοκαίρι καταστρέφουν δάση και οι ξαφνικές πλημμύρες είναι συνέπειες της κλιματικής αλλαγής, την οποία επιτείνουν η αλόγιστη χρήση ορυκτών καυσίμων και η υπερκατανάλωση. Έτσι, η τεχνολογία, που υποσχέθηκε να κάνει τη ζωή μας ευκολότερη, συμβάλλει —όταν χρησιμοποιείται χωρίς μέτρο— στην υπονόμευση των ίδιων των όρων της ζωής.`, { source: "Πρωτότυπο κείμενο εξάσκησης" })}
<details class="steps"><summary>Λύση βήμα-βήμα — η δομή της παραγράφου</summary><p><b>Θεματική περίοδος:</b> η διατάραξη ως καθημερινή εμπειρία · <b>λεπτομέρειες:</b> παραδείγματα (καύσωνες, πυρκαγιές, πλημμύρες) και αιτίες (ορυκτά καύσιμα, υπερκατανάλωση) · <b>κατακλείδα:</b> «Έτσι…» με την ειρωνική αντίθεση υπόσχεσης–αποτελέσματος. Τρόποι ανάπτυξης: παραδείγματα και αίτιο–αποτέλεσμα.</p></details></div>

<div class="tbox tip"><h4>Χρήσιμο λεξιλόγιο</h4>
<p>εξανδραποδισμός · τεχνοκρατία · τεχνοφοβία · ψηφιακός γραμματισμός · ψηφιακή αποτοξίνωση · τεχνητή νοημοσύνη · αυτοματοποίηση · ιδιωτικότητα · παραπληροφόρηση · βιοηθική · αειφορία · βιοποικιλότητα · αποψίλωση · ερημοποίηση · αποτύπωμα άνθρακα · ανανεώσιμες πηγές ενέργειας.</p></div>

<div class="tbox rem"><h4>Πιθανά θέματα παραγωγής λόγου</h4>
<ul><li>Επιπτώσεις της τεχνητής νοημοσύνης στην εργασία και στις σχέσεις — απειλεί την ελευθερία; (δοκίμιο)</li>
<li>Συνέπειες της οικολογικής διατάραξης και δράσεις των δήμων (ανοιχτή επιστολή).</li>
<li>Η εξάρτηση των νέων από τα κινητά: αίτια και ρόλος της οικογένειας (άρθρο).</li>
<li>Η ευθύνη του επιστήμονα στη σύγχρονη εποχή (ομιλία σε επιστημονική ημερίδα μαθητών).</li></ul></div>

<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Τεχνοφοβικό, μονόπλευρο κείμενο που αγνοεί τα οφέλη — ή, αντίθετα, άκριτος ενθουσιασμός.</li>
<li>Χρήση του «εξανδραποδισμού» χωρίς να φαίνεται ότι κατανοείς τη μεταφορική του σημασία.</li>
<li>Γενικολογίες για «το περιβάλλον» χωρίς συγκεκριμένες συνέπειες και συγκεκριμένους τρόπους.</li></ul></div>
`,
  widget: "na5ideas4",
  gen: "na5gt4",
  exercises: [
    { shuffle: true, level: 1, type: "mc", q: R`Ποια είναι η μεταφορική σημασία του όρου <b>«εξανδραποδισμός»</b> στη θεματική ενότητα;`, options: ["Η υποδούλωση του ανθρώπου στα δημιουργήματά του (μηχανές, οθόνες, αλγόριθμους)", "Η κατάκτηση του διαστήματος από τον άνθρωπο", "Η ανακάλυψη νέων φαρμάκων", "Η προστασία των άγριων ζώων"], correct: 0,
      hint: R`Κυριολεκτικά: πώληση ανθρώπων ως δούλων.`, sol: R`Κυριολεκτικά ο εξανδραποδισμός είναι η πώληση ανθρώπων ως δούλων· μεταφορικά, η <b>υποδούλωση του ανθρώπου στα ίδια του τα δημιουργήματα</b>.` },
    { level: 1, q: R`Να γράψετε ένα συνώνυμο της λέξης <b>«αειφορία»</b> (ή της φράσης που την αποδίδει).`, fields: [{ label: "Συνώνυμο:", ans: ["βιώσιμη ανάπτυξη", "βιωσιμότητα", "αειφόρος ανάπτυξη", "αειφόρος διαχείριση"], text: true }],
      hint: R`Ανάπτυξη που «βιώνει», διαρκεί, χωρίς να εξαντλεί τους πόρους.`, sol: R`<b>Βιώσιμη ανάπτυξη</b> (ή βιωσιμότητα): ανάπτυξη που δεν στερεί τις επόμενες γενιές.` },
    { level: 2, q: R`Να γράψετε ένα παράγωγο ουσιαστικό και ένα παράγωγο επίθετο του ρήματος <b>«ρυπαίνω»</b>.`, fields: [{ label: "Ουσιαστικό:", ans: ["ρύπανση", "ρύπος", "ρυπαντής"], text: true }, { label: "Επίθετο:", ans: ["ρυπογόνος", "ρυπογόνα", "ρυπογόνο", "ρυπαρός", "ρυπαρή", "ρυπαρό", "ρυπασμένος", "ρυπαντικός", "ρυπαντική", "ρυπαντικό"], text: true }],
      hint: R`Π.χ. «η … της ατμόσφαιρας», «… εργοστάσια».`, sol: R`Ουσιαστικό: <b>ρύπανση</b> (και ρύπος, ρυπαντής) · Επίθετο: <b>ρυπογόνος</b> (ρυπογόνες δραστηριότητες), ρυπαρός, ρυπαντικός.` },
    { shuffle: true, level: 2, type: "mc", q: R`Σε σχεδιάγραμμα για την τεχνολογία, σε ποια κατηγορία ανήκει η ιδέα «Αυτοματοποίηση και τεχνητή νοημοσύνη αντικαθιστούν θέσεις εργασίας»;`, options: ["Κίνδυνοι – συνέπειες", "Οφέλη", "Λύσεις – φορείς", "Έννοιες"], correct: 0,
      hint: R`Είναι κέρδος ή απειλή για τον εργαζόμενο;`, sol: R`Η ανεργία λόγω αυτοματοποίησης είναι <b>κίνδυνος/αρνητική συνέπεια</b> της τεχνολογίας.` },
    { shuffle: true, level: 1, type: "mc", q: R`Τι μελετά η <b>βιοηθική</b>;`, options: ["Τα ηθικά όρια των επιστημών της ζωής (π.χ. γενετική μηχανική, κλωνοποίηση)", "Τη βιολογία των φυτών", "Τους κανόνες συμπεριφοράς στο σχολείο", "Τις βιογραφίες των επιστημόνων"], correct: 0,
      hint: R`βίος + ηθική.`, sol: R`Η <b>βιοηθική</b> εξετάζει τα ηθικά ζητήματα των επιστημών της ζωής και της ιατρικής.` },
    { level: 2, q: R`Να γράψετε ένα αντώνυμο της λέξης <b>«ανανεώσιμες»</b> στη φράση «ανανεώσιμες πηγές ενέργειας».`, fields: [{ label: "Αντώνυμο:", ans: ["μη ανανεώσιμες", "εξαντλήσιμες", "μη ανανεωσιμες", "πεπερασμένες", "συμβατικές", "ορυκτές"], text: true }],
      hint: R`Ποιες πηγές εξαντλούνται κάποια στιγμή;`, sol: R`<b>Μη ανανεώσιμες</b> (εξαντλήσιμες) πηγές, π.χ. το πετρέλαιο και ο άνθρακας.` },
    { shuffle: true, level: 1, type: "mc", q: R`Ένα καλό κείμενο για την τεχνολογία στις Παγκύπριες πρέπει να την παρουσιάζει αποκλειστικά ως απειλή.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι εκτιμούν οι διορθωτές: τη μονομέρεια ή την ισορροπία;`, sol: R`<b>ΛΑΘΟΣ.</b> Η τεχνολογία έχει <b>διπλή όψη</b>· ένα ώριμο κείμενο αναγνωρίζει τα οφέλη και επισημαίνει τους κινδύνους από την αλόγιστη χρήση της — εκτός αν η εκφώνηση ζητά ρητά μόνο το ένα σκέλος.` },
    { shuffle: true, level: 3, type: "mc", q: R`${PASSAGE(`Οι συνέπειες της τεχνολογικής εξάρτησης μπορούν να διακριθούν σε τρεις κατηγορίες: σωματικές, όπως η καθιστική ζωή και οι διαταραχές του ύπνου· ψυχικές, όπως το άγχος και η μειωμένη συγκέντρωση· και κοινωνικές, όπως η απομόνωση και η επιφανειακή επικοινωνία.`, { source: "Πρωτότυπο κείμενο εξάσκησης" })}Ποιος τρόπος ανάπτυξης χρησιμοποιείται;`, options: ["Διαίρεση", "Αναλογία", "Σύγκριση – αντίθεση", "Ορισμός"], correct: 0,
      hint: R`Η έννοια χωρίζεται σε κατηγορίες με κοινό κριτήριο.`, sol: R`Οι συνέπειες <b>διαιρούνται</b> σε τρεις κατηγορίες (σωματικές, ψυχικές, κοινωνικές) — τρόπος ανάπτυξης: <b>διαίρεση</b>.` }
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

/* ================= Νέα Ελληνικά — Γλώσσα, ενότητες 1–2 (prefix na1) ================= */
const na1Esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const na1Pick = a => a[Math.floor(Math.random() * a.length)];
const na1Shuf = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const na1Words = t => String(t).split(/\s+/).filter(w => /[0-9A-Za-zΑ-Ωα-ωΆ-Ώά-ώϊϋΐΰ]/.test(w)).length;
/* mc από τράπεζα: σωστή + (n-1) διαφορετικές λάθος από τη λίστα επιλογών */
function na1MC(correct, pool, n = 4) { const wrong = na1Shuf(pool.filter(x => x !== correct)).slice(0, n - 1); return { options: [correct, ...wrong], correct: 0 }; }

/* ---------- τράπεζες (πρωτότυπα παραδείγματα) ---------- */
const NA1_MODES = ["Επίκληση στη λογική", "Επίκληση στην αυθεντία", "Επίκληση στο συναίσθημα", "Επίκληση στο ήθος του πομπού", "Επίκληση στο ήθος του δέκτη", "Επίθεση στο ήθος του αντιπάλου"];
const NA1_MG = [["Στατιστικό στοιχείο", "Παράδειγμα", "Γενικά αποδεκτή αλήθεια", "Αιτιολόγηση"], ["Γνώμη ειδικού", "Παράθεμα από διάσημο πρόσωπο"], ["Ρητορικό ερώτημα", "Συναισθηματικά φορτισμένο λεξιλόγιο", "Αφήγηση περιστατικού", "Ζωντανή εικόνα"], ["Προσωπική εμπειρία του πομπού", "Αναφορά στις αξίες του δέκτη"], ["Αμφισβήτηση των κινήτρων του αντιπάλου", "Ειρωνεία", "Απαξίωση του αντιπάλου"]];
const NA1_MEANS = NA1_MG.flat();
/* λάθος επιλογές μόνο από άλλη «οικογένεια» μέσων, ώστε να μην υπάρχουν δύο υπερασπίσιμες απαντήσεις */
const na1MeanPool = m => NA1_MEANS.filter(x => !NA1_MG.find(g => g.includes(m)).includes(x));
/* [κείμενο, τρόπος (δείκτης NA1_MODES), μέσο, εξήγηση] */
const NA1_PERS = [
  ["Σύμφωνα με μια πρόσφατη έρευνα, το ποσοστό των νέων που διαβάζουν λογοτεχνία έχει μειωθεί σημαντικά μέσα σε μία δεκαετία.", 0, "Στατιστικό στοιχείο", "Η θέση στηρίζεται σε μετρήσιμο, αντικειμενικό στοιχείο."],
  ["Όταν οι πόλεις αποκτούν ποδηλατόδρομους, λιγοστεύουν τα αυτοκίνητα στους δρόμους, γιατί όλο και περισσότεροι επιλέγουν το ποδήλατο για τις κοντινές αποστάσεις.", 0, "Αιτιολόγηση", "Η κρίση στηρίζεται σε σχέση αιτίου–αποτελέσματος."],
  ["Στην Κοπεγχάγη, για παράδειγμα, μετά την επέκταση του δικτύου ποδηλατοδρόμων, το ποδήλατο έγινε ένα από τα πιο διαδεδομένα μέσα μετακίνησης.", 0, "Παράδειγμα", "Ένα συγκεκριμένο παράδειγμα λειτουργεί ως τεκμήριο."],
  ["Είναι γνωστό σε όλους ότι η υγεία είναι το πολυτιμότερο αγαθό του ανθρώπου.", 0, "Γενικά αποδεκτή αλήθεια", "Η θέση στηρίζεται σε κάτι που δέχονται όλοι."],
  ["Αφού κάθε πολίτης έχει δικαίωμα στη μόρφωση, και τα παιδιά των απομακρυσμένων χωριών δικαιούνται σχολείο κοντά στον τόπο τους.", 0, "Αιτιολόγηση", "Από γενική αρχή καταλήγουμε σε συμπέρασμα για ειδική περίπτωση (συλλογισμός)."],
  ["Σε μια έρευνα σε δύο χιλιάδες μαθητές, το 68% δήλωσε ότι διαβάζει πιο εύκολα σε χαρτί παρά σε οθόνη.", 0, "Στατιστικό στοιχείο", "Επικαλείται ποσοτικό αποτέλεσμα έρευνας, δηλαδή αντικειμενικό δεδομένο."],
  ["Όπως έχει επισημάνει ο Παγκόσμιος Οργανισμός Υγείας, η ρύπανση της ατμόσφαιρας ευθύνεται για εκατομμύρια πρόωρους θανάτους.", 1, "Γνώμη ειδικού", "Ένας διεθνής οργανισμός με κύρος εγγυάται την αλήθεια της κρίσης."],
  ["«Η παιδεία είναι δεύτερος ήλιος για τους μορφωμένους», λέει ένα απόφθεγμα που αποδίδεται στον Ηράκλειτο· και ισχύει σήμερα περισσότερο από ποτέ.", 1, "Παράθεμα από διάσημο πρόσωπο", "Ένα αρχαίο απόφθεγμα, που αποδίδεται σε φιλόσοφο, προσδίδει κύρος στη θέση."],
  ["Οι παιδοψυχολόγοι συμφωνούν ότι το παιχνίδι στη φύση είναι απαραίτητο για την ισορροπημένη ανάπτυξη του παιδιού.", 1, "Γνώμη ειδικού", "Η θέση στηρίζεται στην ειδημοσύνη επιστημόνων."],
  ["Το Ευρωπαϊκό Δικαστήριο Ανθρωπίνων Δικαιωμάτων έχει κρίνει επανειλημμένα ότι η ελευθερία του λόγου προστατεύει και τις ενοχλητικές απόψεις.", 1, "Γνώμη ειδικού", "Η απόφαση ενός θεσμού με κύρος στηρίζει τη θέση."],
  ["Ο μεγάλος φυσικός Αϊνστάιν σημείωνε πως η φαντασία είναι πιο σημαντική από τη γνώση· το σχολείο, λοιπόν, οφείλει να την καλλιεργεί.", 1, "Παράθεμα από διάσημο πρόσωπο", "Η αναφορά σε διάσημο επιστήμονα δίνει κύρος στο επιχείρημα."],
  ["Πόσο ακόμα θα κοιτάμε αμέτοχοι τα δάση μας να γίνονται στάχτη κάθε καλοκαίρι;", 2, "Ρητορικό ερώτημα", "Το ερώτημα δεν ζητά απάντηση· προκαλεί αγανάκτηση και συγκίνηση."],
  ["Η μικρή Ελένη περίμενε ώρες στο κρύο τη μητέρα της, που δεν γύρισε ποτέ από τη δουλειά εκείνο το βράδυ.", 2, "Αφήγηση περιστατικού", "Το συγκινητικό περιστατικό αγγίζει το συναίσθημα του αναγνώστη."],
  ["Η τραγική εικόνα των παιδιών που ψάχνουν τροφή στα σκουπίδια πρέπει να μας ταράξει βαθιά.", 2, "Συναισθηματικά φορτισμένο λεξιλόγιο", "Λέξεις όπως «τραγική», «ταράξει βαθιά» φορτίζουν συναισθηματικά τον λόγο."],
  ["Ντροπή! Σε μια πλούσια χώρα του εικοστού πρώτου αιώνα, άνθρωποι κοιμούνται ακόμη στα παγκάκια.", 2, "Συναισθηματικά φορτισμένο λεξιλόγιο", "Το επιφώνημα και η αντίθεση προκαλούν συναισθηματική αντίδραση."],
  ["Φανταστείτε έναν κόσμο χωρίς μέλισσες: χωρίς λουλούδια, χωρίς φρούτα, χωρίς το βουητό του καλοκαιριού.", 2, "Ζωντανή εικόνα", "Η εικόνα, μαζί με την προτροπή «φανταστείτε», συγκινεί τον αναγνώστη."],
  ["Δεν είναι φοβερό να ξοδεύουμε τόσα χρήματα για οπλισμό, όταν τα νοσοκομεία μας στερούνται βασικά φάρμακα;", 2, "Ρητορικό ερώτημα", "Το ρητορικό ερώτημα εκφράζει αγανάκτηση και ζητά συναισθηματική συμφωνία."],
  ["Ως εκπαιδευτικός με τριάντα χρόνια υπηρεσίας σε δημόσια σχολεία, έχω δει από κοντά τι σημαίνει μια τάξη με τριάντα μαθητές.", 3, "Προσωπική εμπειρία του πομπού", "Ο πομπός προβάλλει τη μακρόχρονη εμπειρία του για να γίνει αξιόπιστος."],
  ["Δεν ισχυρίζομαι ότι έχω όλες τις απαντήσεις· ως γονιός, όμως, ξέρω πόσο δύσκολο είναι να βάλεις όρια στο κινητό.", 3, "Προσωπική εμπειρία του πομπού", "Η μετριοφροσύνη και η προσωπική εμπειρία κάνουν τον πομπό αξιόπιστο."],
  ["Έχοντας εργαστεί δέκα χρόνια ως διασώστρια, μπορώ να σας βεβαιώσω ότι η ζώνη ασφαλείας σώζει ζωές.", 3, "Προσωπική εμπειρία του πομπού", "Ο πομπός αντλεί κύρος από την επαγγελματική του ιδιότητα."],
  ["Γράφω αυτές τις γραμμές ως πρώην πρωταθλήτρια που γνώρισε από μέσα τις πιέσεις του πρωταθλητισμού.", 3, "Προσωπική εμπειρία του πομπού", "Η προσωπική πορεία του πομπού στηρίζει την αξιοπιστία του."],
  ["Εσείς, οι νέοι, που δεν συμβιβάζεστε με την αδικία, είστε οι πρώτοι που μπορείτε να αλλάξετε αυτή την κατάσταση.", 4, "Αναφορά στις αξίες του δέκτη", "Ο πομπός επικαλείται τις αρετές και την ευαισθησία των δεκτών."],
  ["Ξέρω ότι, ως συνειδητοποιημένοι πολίτες, δεν θα μείνετε αδιάφοροι μπροστά σε αυτή την πρόκληση.", 4, "Αναφορά στις αξίες του δέκτη", "Ο πομπός «κολακεύει» τη συνείδηση των δεκτών για να τους κινητοποιήσει."],
  ["Εσείς, αγαπητοί γονείς, που θυσιάζετε τόσα για τα παιδιά σας, αξίζετε ένα σχολείο που θα σέβεται τον κόπο σας.", 4, "Αναφορά στις αξίες του δέκτη", "Η αναφορά στη θυσία και στην αγάπη των γονιών απευθύνεται στο ήθος τους."],
  ["Όσοι από εσάς έχετε βρεθεί ποτέ σε ανάγκη θα καταλάβετε αμέσως γιατί η αλληλεγγύη δεν είναι πολυτέλεια.", 4, "Αναφορά στις αξίες του δέκτη", "Ο πομπός απευθύνεται στις εμπειρίες και στην ευαισθησία των δεκτών."],
  ["Οι «ειδικοί» που μας διαβεβαιώνουν για την ασφάλεια του έργου είναι, κατά σύμπτωση, οι ίδιοι που θα το κατασκευάσουν.", 5, "Αμφισβήτηση των κινήτρων του αντιπάλου", "Υπονομεύεται η αξιοπιστία των αντιπάλων με αναφορά στα συμφέροντά τους."],
  ["Είναι εύκολο να μιλάει για λιτότητα όποιος δεν έχει ζήσει ούτε μια μέρα με τον κατώτατο μισθό.", 5, "Αμφισβήτηση των κινήτρων του αντιπάλου", "Αμφισβητείται το δικαίωμα του αντιπάλου να έχει άποψη, λόγω της θέσης του."],
  ["Οι επικριτές της μεταρρύθμισης, που μέχρι χθες υποστήριζαν ακριβώς τα αντίθετα, ανακάλυψαν ξαφνικά τις «αρετές» του παλιού συστήματος.", 5, "Ειρωνεία", "Η ειρωνεία και η αναφορά στην ασυνέπειά τους πλήττουν το ήθος των αντιπάλων."],
  ["Δεν μπορεί να μας κάνει μαθήματα οικολογίας μια εταιρεία που καταδικάστηκε δύο φορές για ρύπανση του ποταμού.", 5, "Αμφισβήτηση των κινήτρων του αντιπάλου", "Η αξιοπιστία του αντιπάλου υπονομεύεται με αναφορά στο παρελθόν του."],
  ["Κατά μέσο όρο, ένας έφηβος περνά σήμερα πάνω από πέντε ώρες την ημέρα μπροστά σε οθόνες.", 0, "Στατιστικό στοιχείο", "Ένα μετρήσιμο στοιχείο στηρίζει τη θέση."],
  ["Στο χωριό μας, όταν έκλεισε το σχολείο, έφυγαν μέσα σε δύο χρόνια σχεδόν όλες οι νέες οικογένειες.", 0, "Παράδειγμα", "Το συγκεκριμένο παράδειγμα επιβεβαιώνει τη θέση για την ερήμωση της υπαίθρου."],
  ["Πολλοί γλωσσολόγοι επισημαίνουν ότι η γλώσσα μας κινδυνεύει όχι από τα δάνεια αλλά από τη φτωχοποίηση του λεξιλογίου.", 1, "Γνώμη ειδικού", "Η θέση στηρίζεται στην ειδημοσύνη επιστημόνων."],
  ["Ποιος από εμάς δεν θυμάται με συγκίνηση τον δάσκαλο που πρώτος πίστεψε σε αυτόν;", 2, "Ρητορικό ερώτημα", "Το ρητορικό ερώτημα ξυπνά αναμνήσεις και συναισθήματα."],
  ["Οι νέοι άνθρωποι με τους οποίους δουλεύω καθημερινά ως σύμβουλος σταδιοδρομίας μού λένε ότι νιώθουν πως κανείς δεν τους ακούει.", 3, "Προσωπική εμπειρία του πομπού", "Η καθημερινή επαγγελματική εμπειρία του πομπού κάνει την κρίση του αξιόπιστη."],
  ["Εσύ, που διαβάζεις αυτές τις γραμμές, είσαι σίγουρα από εκείνους που δεν πετούν σκουπίδια στην παραλία.", 4, "Αναφορά στις αξίες του δέκτη", "Ο πομπός αποδίδει στον δέκτη θετικές αξίες ώστε να τον δεσμεύσει."],
  ["Όποιος υποστηρίζει ότι η τέχνη είναι περιττή, μάλλον δεν έχει μπει ποτέ του σε θέατρο.", 5, "Απαξίωση του αντιπάλου", "Η άποψη του αντιπάλου απαξιώνεται μέσω της υποτιθέμενης προσωπικής του ανεπάρκειας."],
  ["Η ενέργεια του ήλιου είναι ανεξάντλητη και δωρεάν, επομένως η Κύπρος, με τόσες ηλιόλουστες μέρες, οφείλει να την αξιοποιήσει.", 0, "Αιτιολόγηση", "Από τα δεδομένα συνάγεται λογικά το συμπέρασμα."],
  ["Σύμφωνα με τους οικονομολόγους, η επένδυση στην εκπαίδευση αποδίδει πολλαπλάσια οφέλη στην οικονομία μιας χώρας.", 1, "Γνώμη ειδικού", "Η θέση στηρίζεται στην ειδημοσύνη επιστημόνων."],
  ["Καμιά μάνα δεν θα έπρεπε να μαθαίνει από τις ειδήσεις ότι το παιδί της χάθηκε σε έναν δρόμο χωρίς φωτισμό.", 2, "Συναισθηματικά φορτισμένο λεξιλόγιο", "Η οδυνηρή εικόνα προκαλεί έντονη συγκίνηση."],
  ["Είναι κοινή διαπίστωση ότι κανένα σχολείο δεν μπορεί να λειτουργήσει χωρίς τη συνεργασία των γονέων.", 0, "Γενικά αποδεκτή αλήθεια", "Η θέση στηρίζεται σε κάτι που όλοι αποδέχονται."]
];
/* συλλογισμοί: [κείμενο, είδος 0=παραγωγικός 1=επαγωγικός 2=αναλογικός] */
const NA1_SYLT = ["Παραγωγικός", "Επαγωγικός", "Αναλογικός"];
const NA1_SYL = [
  ["Όλα τα θηλαστικά αναπνέουν με πνεύμονες. Το δελφίνι είναι θηλαστικό. Άρα και το δελφίνι αναπνέει με πνεύμονες.", 0],
  ["Κάθε έργο που καταστρέφει τον υδροφόρο ορίζοντα βλάπτει τη γεωργία. Η νέα λατομική μονάδα θα καταστρέψει τον υδροφόρο ορίζοντα της περιοχής. Επομένως, θα βλάψει τη γεωργία.", 0],
  ["Όσοι γυμνάζονται τακτικά έχουν λιγότερο άγχος. Ο Μάριος γυμνάζεται τρεις φορές την εβδομάδα. Άρα είναι λογικό να έχει λιγότερο άγχος.", 0],
  ["Κάθε δημοκρατική κοινωνία χρειάζεται ελεύθερο Τύπο. Η Κύπρος είναι δημοκρατική κοινωνία. Συνεπώς, η Κύπρος χρειάζεται ελεύθερο Τύπο.", 0],
  ["Όλα τα ζώα που απειλούνται με εξαφάνιση πρέπει να προστατεύονται. Το αγρινό απειλείται με εξαφάνιση. Επομένως, πρέπει να προστατεύεται.", 0],
  ["Τα πλαστικά μιας χρήσης ρυπαίνουν τις θάλασσες. Τα καλαμάκια που μοιράζονται στις καφετέριες είναι πλαστικά μιας χρήσης. Άρα κι αυτά ρυπαίνουν τις θάλασσες.", 0],
  ["Κάθε μορφή βίας είναι απαράδεκτη. Ο εκφοβισμός στο σχολείο είναι μορφή βίας. Άρα ο εκφοβισμός είναι απαράδεκτος.", 0],
  ["Όποιος οδηγεί με υπερβολική ταχύτητα θέτει σε κίνδυνο τη ζωή του. Ο Νίκος οδηγούσε με 160 χιλιόμετρα την ώρα. Επομένως, έθεσε σε κίνδυνο τη ζωή του.", 0],
  ["Όλα τα έργα τέχνης αποτελούν μέρος της πολιτιστικής κληρονομιάς. Οι βυζαντινές εικόνες είναι έργα τέχνης. Άρα ανήκουν στην πολιτιστική μας κληρονομιά.", 0],
  ["Κάθε άνθρωπος χρειάζεται αναγνώριση για να νιώσει χρήσιμος. Οι ηλικιωμένοι είναι άνθρωποι. Επομένως, χρειάζονται κι αυτοί αναγνώριση.", 0],
  ["Στη Λευκωσία, στη Λεμεσό και στη Λάρνακα, όπου δημιουργήθηκαν πεζόδρομοι, αυξήθηκε η κίνηση στα καταστήματα του κέντρου. Φαίνεται, λοιπόν, ότι οι πεζόδρομοι αναζωογονούν το εμπόριο.", 1],
  ["Ο Ανδρέας, η Μαρία και ο Κώστας, που διάβαζαν λογοτεχνία από μικροί, γράφουν σήμερα πολύ καλές εκθέσεις. Η συστηματική ανάγνωση, επομένως, φαίνεται να βελτιώνει τον γραπτό λόγο.", 1],
  ["Σε πολλές χώρες όπου απαγορεύτηκε το κάπνισμα σε κλειστούς χώρους, καταγράφηκε μείωση των καρδιακών επεισοδίων. Η απαγόρευση, άρα, φαίνεται να προστατεύει τη δημόσια υγεία.", 1],
  ["Οι τρεις τελευταίοι χειμώνες ήταν οι πιο ζεστοί που έχουν καταγραφεί στην περιοχή, όπως και τα τρία τελευταία καλοκαίρια. Όλα δείχνουν ότι το κλίμα της Κύπρου θερμαίνεται.", 1],
  ["Στο Τμήμα Α, στο Τμήμα Γ και στο Τμήμα Ε οι μαθητές που έκαναν επανάληψη με κάρτες έγραψαν καλύτερα στο διαγώνισμα. Μάλλον, λοιπόν, η μέθοδος με τις κάρτες είναι αποτελεσματική.", 1],
  ["Όσα καταστήματα του δρόμου μας έβαλαν ράμπες για αμαξίδια απέκτησαν νέους πελάτες. Η προσβασιμότητα, φαίνεται, ωφελεί και τις επιχειρήσεις.", 1],
  ["Σε δεκάδες έρευνες σε διαφορετικές χώρες, τα παιδιά που έπαιζαν μουσικό όργανο είχαν καλύτερες επιδόσεις στα μαθηματικά. Η μουσική εκπαίδευση, επομένως, ενισχύει τη μαθηματική σκέψη.", 1],
  ["Το καλοκαίρι στο νησί μας, στη Ρόδο και στην Κρήτη οι μεγάλες πυρκαγιές ξεκίνησαν σε μέρες με θερμοκρασίες πάνω από 40 βαθμούς. Φαίνεται ότι ο καύσωνας αυξάνει τον κίνδυνο πυρκαγιών.", 1],
  ["Όλοι οι μαθητές που ρωτήσαμε στο διάλειμμα δήλωσαν ότι θέλουν περισσότερες αθλητικές δραστηριότητες. Οι νέοι, επομένως, ζητούν περισσότερη άθληση στο σχολείο.", 1],
  ["Τα χωριά της Πιτσιλιάς, της Μαραθάσας και της Σολέας, που απέκτησαν γρήγορο διαδίκτυο, προσέλκυσαν νέους κατοίκους που εργάζονται από απόσταση. Η τεχνολογία, άρα, μπορεί να αναζωογονήσει την ύπαιθρο.", 1],
  ["Όπως ένα δέντρο χωρίς ρίζες ξεραίνεται με τον πρώτο αέρα, έτσι και ένας λαός χωρίς ιστορική μνήμη χάνει εύκολα την ταυτότητά του.", 2],
  ["Όπως ο γιατρός δεν χορηγεί φάρμακο πριν κάνει διάγνωση, έτσι και ο εκπαιδευτικός δεν πρέπει να δίνει λύσεις πριν κατανοήσει το πρόβλημα του μαθητή.", 2],
  ["Όπως ο οργανισμός χρειάζεται ποικιλία τροφών για να είναι υγιής, έτσι και το πνεύμα χρειάζεται ποικιλία ερεθισμάτων για να καλλιεργηθεί.", 2],
  ["Όπως ένα πλοίο χωρίς πυξίδα χάνεται στο πέλαγος, έτσι και ένας νέος χωρίς αξίες χάνεται στην κοινωνία της κατανάλωσης.", 2],
  ["Όπως ο κηπουρός κλαδεύει το δέντρο για να καρπίσει, έτσι και ο προπονητής διορθώνει τον αθλητή για να βελτιωθεί.", 2],
  ["Η οικογένεια μοιάζει με ορχήστρα: όπως κάθε μουσικός πρέπει να ακούει τους άλλους για να βγει αρμονία, έτσι και κάθε μέλος της οικογένειας πρέπει να ακούει τα υπόλοιπα.", 2],
  ["Όπως ο οδηγός ακολουθεί τους κανόνες για να μην προκαλέσει ατύχημα, έτσι και ο χρήστης του διαδικτύου πρέπει να ακολουθεί κανόνες για να μη βλάψει τους άλλους.", 2],
  ["Όπως ένα σπίτι με γερά θεμέλια αντέχει στους σεισμούς, έτσι και μια παιδεία με γερές βάσεις αντέχει στις κρίσεις της εποχής.", 2],
  ["Όπως ο ορειβάτης ανεβαίνει βήμα-βήμα και όχι με ένα άλμα, έτσι και ο μαθητής κατακτά τη γνώση με σταθερή, καθημερινή προσπάθεια.", 2],
  ["Όπως ένας κήπος που δεν τον φροντίζει κανείς γεμίζει αγριόχορτα, έτσι και μια δημοκρατία χωρίς ενεργούς πολίτες γεμίζει δημαγωγούς.", 2]
];
/* στίξη: [πρόταση, σημείο, λειτουργία] */
const NA1_PF = { "« »": ["Αυτούσια μεταφορά λόγων", "Ειρωνεία", "Έμφαση σε λέξη", "Νεολογισμός ή ξένη λέξη", "Μεταφορική χρήση λέξης", "Τίτλος έργου"], "( )": ["Επεξήγηση ή διευκρίνιση", "Παράδειγμα", "Σχόλιο του συγγραφέα"], "—": ["Απομόνωση σχολίου με έμφαση", "Εναλλαγή προσώπων σε διάλογο"], ":": ["Επεξήγηση αυτού που προηγείται", "Απαρίθμηση", "Εισαγωγή ευθέος λόγου"], "·": ["Συμπέρασμα ή αντίθεση με μικρότερη παύση"], "…": ["Συγκίνηση ή δισταγμός", "Υπαινιγμός", "Ειρωνεία"], "!": ["Έντονο συναίσθημα (θαυμασμός, αγανάκτηση)", "Προτροπή"], ";": ["Ρητορικό ερώτημα", "Πραγματική ερώτηση"] };
const NA1_PALL = [...new Set(Object.values(NA1_PF).flat())];
const NA1_PSYN = [["Επεξήγηση ή διευκρίνιση", "Επεξήγηση αυτού που προηγείται", "Παράδειγμα"], ["Σχόλιο του συγγραφέα", "Απομόνωση σχολίου με έμφαση", "Έμφαση σε λέξη"], ["Ειρωνεία", "Υπαινιγμός"], ["Συγκίνηση ή δισταγμός", "Έντονο συναίσθημα (θαυμασμός, αγανάκτηση)"], ["Ρητορικό ερώτημα", "Έντονο συναίσθημα (θαυμασμός, αγανάκτηση)"]];
/* λάθος επιλογές: όχι λειτουργίες του ίδιου σημείου και όχι σχεδόν συνώνυμες */
const na1PunctPool = (sign, fn) => NA1_PALL.filter(f => !NA1_PF[sign].includes(f) && !NA1_PSYN.some(g => g.includes(fn) && g.includes(f)));
const NA1_PUN = [
  ["Ο πρόεδρος δήλωσε: «Θα στηρίξουμε κάθε οικογένεια που επλήγη».", "« »", "Αυτούσια μεταφορά λόγων"],
  ["Η «δωρεάν» εφαρμογή τελικά μάς κόστισε όλα μας τα προσωπικά δεδομένα.", "« »", "Ειρωνεία"],
  ["Η λέξη «φιλότιμο» δεν μεταφράζεται εύκολα σε άλλες γλώσσες.", "« »", "Έμφαση σε λέξη"],
  ["Πολλοί νέοι δουλεύουν πλέον ως «influencers» στα μέσα κοινωνικής δικτύωσης.", "« »", "Νεολογισμός ή ξένη λέξη"],
  ["Το διαδίκτυο είναι μια «αγορά» όπου πουλιέται η προσοχή μας.", "« »", "Μεταφορική χρήση λέξης"],
  ["Διαβάσαμε στην τάξη το διήγημα «Ο πορτοκαλόκηπος».", "« »", "Τίτλος έργου"],
  ["Οι «προοδευτικές» προτάσεις τους θυμίζουν μέτρα του περασμένου αιώνα.", "« »", "Ειρωνεία"],
  ["Η αειφορία (δηλαδή η ανάπτυξη που δεν υπονομεύει τις επόμενες γενιές) είναι στόχος της Ένωσης.", "( )", "Επεξήγηση ή διευκρίνιση"],
  ["Πολλά επαγγέλματα του μέλλοντος (όπως ο σχεδιαστής εικονικών κόσμων) δεν υπάρχουν ακόμη.", "( )", "Παράδειγμα"],
  ["Η κυβέρνηση υποσχέθηκε νέα μέτρα (για πολλοστή φορά, ας σημειωθεί).", "( )", "Σχόλιο του συγγραφέα"],
  ["Η ΑΟΖ (Αποκλειστική Οικονομική Ζώνη) της Κύπρου βρίσκεται στο επίκεντρο των συζητήσεων.", "( )", "Επεξήγηση ή διευκρίνιση"],
  ["Η πόλη — όσο κι αν το αρνούνται οι αρμόδιοι — πνίγεται στα αυτοκίνητα.", "—", "Απομόνωση σχολίου με έμφαση"],
  ["— Θα έρθεις αύριο; — Αν τελειώσω τη δουλειά, ναι.", "—", "Εναλλαγή προσώπων σε διάλογο"],
  ["Οι νέοι — και όχι μόνο αυτοί — χρειάζονται ελπίδα.", "—", "Απομόνωση σχολίου με έμφαση"],
  ["Το πρόβλημα είναι απλό: δεν υπάρχουν αρκετοί εκπαιδευτικοί.", ":", "Επεξήγηση αυτού που προηγείται"],
  ["Η ύλη περιλαμβάνει τρία είδη κειμένων: άρθρο, επιστολή και ομιλία.", ":", "Απαρίθμηση"],
  ["Η γιαγιά μού είπε: «Να προσέχεις, παιδί μου».", ":", "Εισαγωγή ευθέος λόγου"],
  ["Ένα μόνο ζητούν οι κάτοικοι: να μείνει ελεύθερη η παραλία τους.", ":", "Επεξήγηση αυτού που προηγείται"],
  ["Η τεχνολογία δεν είναι από μόνη της ούτε καλή ούτε κακή· όλα εξαρτώνται από τη χρήση της.", "·", "Συμπέρασμα ή αντίθεση με μικρότερη παύση"],
  ["Πολλοί μίλησαν για αλλαγές· λίγοι όμως έκαναν κάτι.", "·", "Συμπέρασμα ή αντίθεση με μικρότερη παύση"],
  ["Και τότε… τότε κατάλαβα ότι δεν θα τον ξανάβλεπα.", "…", "Συγκίνηση ή δισταγμός"],
  ["Όλοι ξέρουμε ποιος κερδίζει από αυτή την απόφαση…", "…", "Υπαινιγμός"],
  ["Ήταν, βλέπετε, ένα «πολύ οικολογικό» έργο… με τρία φουγάρα.", "…", "Ειρωνεία"],
  ["Τι υπέροχο θέαμα ήταν εκείνη η ανατολή!", "!", "Έντονο συναίσθημα (θαυμασμός, αγανάκτηση)"],
  ["Είναι απαράδεκτο να παίζουμε με τη ζωή των παιδιών!", "!", "Έντονο συναίσθημα (θαυμασμός, αγανάκτηση)"],
  ["Σηκωθείτε! Ο τόπος σάς χρειάζεται!", "!", "Προτροπή"],
  ["Μέχρι πότε θα κάνουμε πως δεν βλέπουμε τη φτώχεια;", ";", "Ρητορικό ερώτημα"],
  ["Μπορεί μια κοινωνία να προοδεύσει χωρίς σεβασμό στη γνώση;", ";", "Ρητορικό ερώτημα"],
  ["Τι ώρα ξεκινά η εξέταση της Δευτέρας;", ";", "Πραγματική ερώτηση"],
  ["Ποιος μας εγγυάται ότι τα δεδομένα μας δεν θα πουληθούν;", ";", "Ρητορικό ερώτημα"],
  ["Οι κάτοικοι — όσοι τουλάχιστον ρωτήθηκαν — αντιδρούν έντονα.", "—", "Απομόνωση σχολίου με έμφαση"],
  ["Πολλοί πολίτες (κυρίως ηλικιωμένοι) δυσκολεύονται με τις ψηφιακές υπηρεσίες.", "( )", "Επεξήγηση ή διευκρίνιση"]
];
/* κειμενικά είδη / τύποι: [απόσπασμα, απάντηση, ομάδα 'g'=είδος 't'=τύπος, ενδείξεις] */
const NA1_GEN = ["Άρθρο", "Επιστολή", "Ομιλία", "Δοκίμιο"], NA1_TYP = ["Επιχειρηματολογία", "Αφήγηση", "Περιγραφή"];
const NA1_GR = [
  ["Αξιότιμε κύριε Δήμαρχε, με την παρούσα επιστολή θα ήθελα να σας εκθέσω τα προβλήματα που αντιμετωπίζουν οι κάτοικοι της γειτονιάς μας.", "Επιστολή", "g", "προσφώνηση σε συγκεκριμένο παραλήπτη, «με την παρούσα επιστολή»"],
  ["Με εκτίμηση, Η Πρόεδρος του Μαθητικού Συμβουλίου", "Επιστολή", "g", "αποφώνηση και υπογραφή"],
  ["Αγαπητέ μου φίλε, ελπίζω να είσαι καλά· σου γράφω για να σου πω τα νέα από το σχολείο.", "Επιστολή", "g", "οικεία προσφώνηση, β΄ πρόσωπο, «σου γράφω»"],
  ["Λευκωσία, 15 Μαρτίου 2026 — Προς τη Συντακτική Επιτροπή της εφημερίδας…", "Επιστολή", "g", "τόπος, ημερομηνία, παραλήπτης"],
  ["Κυρίες και κύριοι, αγαπητοί συμμαθητές, σας ευχαριστώ θερμά για την παρουσία σας στη σημερινή εκδήλωση.", "Ομιλία", "g", "προσφώνηση ακροατηρίου, ευχαριστίες, «σημερινή εκδήλωση»"],
  ["Σας ευχαριστώ για την προσοχή σας. Ας κάνουμε όλοι, από αύριο κιόλας, το πρώτο βήμα.", "Ομιλία", "g", "κατακλείδα ομιλίας: ευχαριστίες και έκκληση στο ακροατήριο"],
  ["Επιτρέψτε μου, αξιότιμοι καλεσμένοι, να ξεκινήσω με μια ερώτηση που απασχολεί όλους εμάς σε αυτή την αίθουσα.", "Ομιλία", "g", "απεύθυνση σε παρόντες, «σε αυτή την αίθουσα»"],
  ["Όπως ακούσατε και από τον προηγούμενο ομιλητή, το ζήτημα αυτό μάς αφορά όλους.", "Ομιλία", "g", "αναφορά σε άλλον ομιλητή, προφορικότητα"],
  ["Η πρόσφατη απόφαση της κυβέρνησης για τις τιμές του ρεύματος προκάλεσε έντονες αντιδράσεις. Ας δούμε, όμως, τι ακριβώς σημαίνει για τα νοικοκυριά.", "Άρθρο", "g", "επίκαιρο θέμα, ευρύ κοινό, επιχειρηματολογία"],
  ["Η εβδομάδα που πέρασε έφερε ξανά στο προσκήνιο το ζήτημα της στέγασης των νέων ζευγαριών.", "Άρθρο", "g", "επικαιρότητα, δημοσιογραφικός λόγος"],
  ["Τα χθεσινά αποτελέσματα των εκλογών δείχνουν ότι η αποχή έγινε το μεγαλύτερο «κόμμα» της χώρας.", "Άρθρο", "g", "αναφορά σε πρόσφατα γεγονότα, σχολιασμός για το ευρύ κοινό"],
  ["Τι είναι, άραγε, ο χρόνος για τον άνθρωπο; Μια γραμμή που τρέχει ευθεία ή ένας κύκλος που επιστρέφει; Ίσως η απάντηση κρύβεται στον τρόπο που θυμόμαστε.", "Δοκίμιο", "g", "διαχρονικό, στοχαστικό θέμα, προσωπική ματιά"],
  ["Η ελευθερία δεν είναι κατάκτηση που γίνεται μία φορά για πάντα· είναι στάση ζωής που ξαναδοκιμάζεται σε κάθε γενιά.", "Δοκίμιο", "g", "αφηρημένη έννοια, στοχασμός, διαχρονικότητα"],
  ["Από την αρχαιότητα ως σήμερα, ο άνθρωπος αναζητά την ευτυχία έξω από τον εαυτό του, ενώ ίσως εκείνη βρίσκεται στο μέτρο.", "Δοκίμιο", "g", "διαχρονικός στοχασμός για ηθικές αξίες"],
  ["Εκείνο το πρωί ξυπνήσαμε από τις σειρήνες. Ο πατέρας φόρτωσε βιαστικά λίγα πράγματα στο αυτοκίνητο και ξεκινήσαμε χωρίς να ξέρουμε πού πηγαίνουμε.", "Αφήγηση", "t", "γεγονότα σε χρονική σειρά, αόριστος, ρήματα δράσης"],
  ["Το 1960 η Κύπρος έγινε ανεξάρτητο κράτος· τρία χρόνια αργότερα, το 1963, ξέσπασαν οι διακοινοτικές ταραχές.", "Αφήγηση", "t", "ιστορικά γεγονότα με χρονολογική σειρά"],
  ["Μπήκε στην τάξη, άφησε την τσάντα στο θρανίο και κοίταξε γύρω του. Ύστερα πλησίασε τον δάσκαλο και του ψιθύρισε κάτι.", "Αφήγηση", "t", "διαδοχή πράξεων, χρονικές λέξεις «ύστερα»"],
  ["Όταν έφτασαν οι πυροσβέστες, το δάσος καιγόταν ήδη δύο ώρες. Ολόκληρη τη νύχτα πάλευαν με τις φλόγες, ώσπου ξημέρωσε.", "Αφήγηση", "t", "εξέλιξη γεγονότων στον χρόνο"],
  ["Το σπίτι ήταν μικρό, ασβεστωμένο, με μπλε παράθυρα και μια κληματαριά που σκίαζε όλη την αυλή. Μύριζε βασιλικό και φρεσκοψημένο ψωμί.", "Περιγραφή", "t", "επίθετα, αισθητηριακές λεπτομέρειες, ρήματα κατάστασης"],
  ["Η πλατεία είναι γεμάτη φως· γύρω της στέκουν παλιά νεοκλασικά κτίρια με ξεθωριασμένες προσόψεις και ψηλά παράθυρα.", "Περιγραφή", "t", "παρουσίαση χώρου, επίθετα, εικόνες"],
  ["Ήταν ψηλός και αδύνατος, με γκρίζα μαλλιά και μάτια που χαμογελούσαν πριν από τα χείλη του.", "Περιγραφή", "t", "περιγραφή προσώπου, επίθετα"],
  ["Η αίθουσα ήταν σκοτεινή και υγρή· στους τοίχους ξεφλούδιζε η μπογιά και από το ταβάνι έσταζε νερό.", "Περιγραφή", "t", "εικόνα χώρου με αισθητηριακές λεπτομέρειες"],
  ["Η κατάργηση των εξετάσεων στο Γυμνάσιο δεν θα μειώσει το άγχος των μαθητών, γιατί το άγχος πηγάζει από την κουλτούρα του ανταγωνισμού και όχι από τα διαγωνίσματα.", "Επιχειρηματολογία", "t", "θέση + αιτιολόγηση («γιατί»)"],
  ["Επομένως, η επένδυση στις ανανεώσιμες πηγές ενέργειας δεν είναι επιλογή αλλά αναγκαιότητα.", "Επιχειρηματολογία", "t", "συμπέρασμα («επομένως») επιχειρηματολογίας"],
  ["Πρώτον, η τηλεργασία μειώνει τον χρόνο μετακίνησης· δεύτερον, ελαττώνει την ατμοσφαιρική ρύπανση. Γι’ αυτό πρέπει να στηριχθεί.", "Επιχειρηματολογία", "t", "επιχειρήματα στη σειρά και συμπέρασμα"],
  ["Θα μπορούσε κανείς να αντιτείνει ότι η τεχνολογία απομονώνει. Ωστόσο, τα στοιχεία δείχνουν ότι οι νέοι χρησιμοποιούν το διαδίκτυο κυρίως για να επικοινωνούν.", "Επιχειρηματολογία", "t", "αντίκρουση αντίθετης άποψης"]
];
/* περίληψη: [δήλωση, σωστή?, εξήγηση] */
const NA1_SR = [
  ["Η περίληψη γράφεται σε γ΄ πρόσωπο.", true, "Μιλάμε για τον συγγραφέα και το κείμενό του."],
  ["Στην περίληψη κρατάμε όλα τα παραδείγματα του κειμένου, για να είναι πλήρης.", false, "Τα παραδείγματα είναι λεπτομέρειες· κρατάμε τις ιδέες που στηρίζουν."],
  ["Η περίληψη ξεκινά με εισαγωγική φράση που δηλώνει το θέμα.", true, "Π.χ. «Το άρθρο πραγματεύεται…»."],
  ["Η περίληψη γράφεται σε κουκκίδες, μία για κάθε παράγραφο.", false, "Είναι ενιαίο, συνεκτικό κείμενο σε μία παράγραφο."],
  ["Στην περίληψη μπορούμε να εκφράσουμε τη συμφωνία μας με τον συγγραφέα.", false, "Η περίληψη είναι αντικειμενική, χωρίς προσωπικά σχόλια."],
  ["Οι διαρθρωτικές λέξεις βοηθούν να φανεί η λογική πορεία του κειμένου.", true, "Π.χ. αρχικά, επιπλέον, ωστόσο, καταληκτικά."],
  ["Η αντιγραφή φράσεων του κειμένου χωρίς σύνδεση παίρνει μηδέν στη δομή.", true, "Το προβλέπει ρητά ο οδηγός διόρθωσης του 2026."],
  ["Τα ερωτήματα του κειμένου μεταφέρονται αυτούσια στην περίληψη.", false, "Πλαγιοποιούνται ή γίνονται κρίσεις: «ο συγγραφέας εξετάζει / διερωτάται…»."],
  ["Η περίληψη πρέπει να καλύπτει όλες τις παραγράφους του κειμένου.", true, "Οι μονάδες περιεχομένου μοιράζονται ανά παράγραφο."],
  ["Στην περίληψη χρησιμοποιούμε κατά κανόνα ενεστώτα.", true, "Π.χ. «ο συγγραφέας υποστηρίζει, επισημαίνει…»."],
  ["Στην περίληψη αναφέρουμε τα στατιστικά στοιχεία με ακρίβεια, για να είμαστε πιστοί στο κείμενο.", false, "Τα στατιστικά είναι τεκμήρια· κρατάμε τη διαπίστωση που στηρίζουν."],
  ["Οι πλαγιότιτλοι ανά παράγραφο είναι το πρώτο βήμα για τις σημειώσεις της περίληψης.", true, "Συμπυκνώνουν την κύρια ιδέα κάθε παραγράφου."],
  ["Αν η περίληψη ξεπεράσει τις 200 λέξεις, αφαιρούνται 4 μονάδες.", true, "Σύμφωνα με τον οδηγό διόρθωσης 2026."],
  ["Η κύρια ιδέα μιας παραγράφου βρίσκεται συνήθως στη θεματική περίοδο.", true, "Η θεματική περίοδος δηλώνει το θέμα της παραγράφου."],
  ["Η περίληψη πρέπει να έχει τίτλο.", false, "Δεν ζητείται τίτλος· ξεκινάμε με εισαγωγική φράση."],
  ["Η περίληψη αλλάζει τη σειρά των ιδεών όπως θέλουμε, για να είναι πιο ενδιαφέρουσα.", false, "Ακολουθούμε τη λογική σειρά του κειμένου."],
  ["Ρήματα όπως «υποστηρίζει», «επισημαίνει», «καταλήγει» αποδίδουν τη στάση του συγγραφέα.", true, "Ποικιλία ρημάτων δίνει ακρίβεια και αποφεύγει τη μονοτονία."],
  ["Η περίληψη μπορεί να γραφτεί σε α΄ πρόσωπο, σαν να είμαστε ο συγγραφέας.", false, "Γράφεται σε γ΄ πρόσωπο."],
  ["Η πιο «πλούσια» παράγραφος του κειμένου μπορεί να πάρει περισσότερες λέξεις στην περίληψη.", true, "Οι λέξεις μοιράζονται ανάλογα με τη σημασία κάθε παραγράφου."],
  ["Η ορθογραφία δεν μετρά στην περίληψη.", false, "Δομή, έκφραση και ορθογραφία παίρνουν 2 μονάδες."],
  ["Αν η περίληψη έχει 160 λέξεις αντί για 120–140, αφαιρούνται 4 μονάδες.", false, "Αφαίρεση 1 μονάδας προβλέπεται πάνω από τις 170 λέξεις και 4 μονάδων πάνω από τις 200."],
  ["Αναδιατύπωση σημαίνει ότι αποδίδουμε τις ιδέες με δικά μας λόγια.", true, "Έτσι αποφεύγουμε την αντιγραφή."],
  ["Οι επαναλήψεις του κειμένου παραλείπονται στην περίληψη.", true, "Η περίληψη είναι πύκνωση."],
  ["Η περίληψη ενός άρθρου αρχίζει πάντα με τη φράση «Συμφωνώ με τον αρθρογράφο».", false, "Η εισαγωγική φράση είναι ουδέτερη και δηλώνει το θέμα."],
  ["Λέξεις όπως «καταληκτικά» ή «τέλος» μπορούν να εισαγάγουν την τελευταία ιδέα της περίληψης.", true, "Δηλώνουν την κατάληξη του συλλογισμού του συγγραφέα."],
  ["Στην περίληψη γράφουμε τα παραδείγματα, αλλά όχι τις ιδέες.", false, "Ισχύει το αντίθετο."],
  ["Για κάθε 5 ή περισσότερα μη επαναλαμβανόμενα ορθογραφικά λάθη στην περίληψη αφαιρείται 0,5 μονάδα (οδηγός 2026).", true, "Το προβλέπει ο οδηγός διόρθωσης."],
  ["Η περίληψη είναι το ίδιο με τον σχολιασμό μιας θέσης.", false, "Ο σχολιασμός έχει προσωπική άποψη· η περίληψη όχι."],
  ["Η εισαγωγική φράση της περίληψης μπορεί να αναφέρει και το κειμενικό είδος (άρθρο, δοκίμιο).", true, "Π.χ. «Στο δοκίμιο αυτό ο συγγραφέας…»."],
  ["Η περίληψη πρέπει να διαβάζεται ως αυτοτελές κείμενο από κάποιον που δεν έχει δει το αρχικό.", true, "Αυτός είναι ο σκοπός της."]
];
/* εξέταση: [ερώτηση, απάντηση(αριθμός) ή [mc επιλογές, σωστή], εξήγηση] */
const NA1_EX = [
  ["Πόσες μονάδες έχει συνολικά το εξεταστικό δοκίμιο των Νέων Ελληνικών;", 100, "Μέρος Α΄ 70 + Μέρος Β΄ 30."],
  ["Πόσες ώρες διαρκεί η εξέταση των Νέων Ελληνικών;", 3, "08:00–11:00 στις Παγκύπριες 2026."],
  ["Πόσες μονάδες παίρνει το Μέρος Β΄ (Λογοτεχνία);", 30, "Β1 + Β2 + Β3."],
  ["Πόσες μονάδες παίρνει η ενότητα Α.Ι (Κατανόηση περιεχομένου και μορφής);", 30, "Περίληψη και ερωτήσεις κατανόησης/λεξιλογίου."],
  ["Πόσες μονάδες πήρε η περίληψη (Α.Ι.1) στις Παγκύπριες 2026;", 8, "6 περιεχόμενο + 2 δομή – έκφραση – ορθογραφία."],
  ["Πόσες μονάδες πήρε το κριτήριο «Δομή» της παραγωγής λόγου;", 12, "Εξωτερικά στοιχεία 2, αποδεικτικός λόγος 4, παράγραφοι 2, αλληλουχία 4."],
  ["Πόσες μονάδες πήρε το κριτήριο «Έκφραση» της παραγωγής λόγου;", 12, "Σαφήνεια 4, ακριβολογία 4, ύφος 4."],
  ["Πόσες μονάδες πήρε το κριτήριο «Ορθογραφία» της παραγωγής λόγου;", 4, "Για κάθε 5 λάθη −1 μονάδα."],
  ["Πόσες μονάδες πήρε το κριτήριο «Περιεχόμενο» της παραγωγής λόγου;", 12, "Πρόλογος 1,5 + κύριο μέρος 9 + επίλογος 1,5."],
  ["Πόσες μονάδες πήρε ο πρόλογος της παραγωγής λόγου;", 1.5, "Το ίδιο και ο επίλογος."],
  ["Ποιο είναι το ανώτατο όριο λέξεων της παραγωγής λόγου (Παγκύπριες 2026);", 500, "Έκταση 450–500 λέξεων."],
  ["Ποιο είναι το ανώτατο όριο λέξεων της περίληψης στις Παγκύπριες 2026;", 140, "Έκταση 120–140 λέξεων."],
  ["Πόσες μονάδες πήρε το λογοτεχνικό βιβλίο (Β3) στις Παγκύπριες 2026;", 8, "Αστροφεγγιά: συμπεριφορά, γνωρίσματα, επίδραση, τεκμηρίωση."],
  ["Πάνω από πόσες λέξεις αφαιρείται 1 μονάδα από την περίληψη (οδηγός 2026);", 170, "Πάνω από 200 λέξεις αφαιρούνται 4."],
  ["Πόσα κριτήρια βαθμολόγησης έχει η παραγωγή λόγου;", 4, "Περιεχόμενο, δομή, έκφραση, ορθογραφία."],
  ["Πόσες θεματικές ενότητες έχει η ύλη της Γλώσσας για την παραγωγή λόγου;", 4, "Παιδεία · Οικονομία–Διαφήμιση · Κύπρος–Ελλάδα–Ευρώπη–Κόσμος · Επιστήμη–Τεχνολογία."],
  ["Πόσες μονάδες χάνει ο υποψήφιος από την ορθογραφία της παραγωγής λόγου αν δεν βάλει καθόλου τόνους;", 1, "Η απουσία τονισμού κοστίζει 1 μονάδα."],
  ["Σε 3 ώρες εξέτασης, πόσα λεπτά διαθέτει συνολικά ο υποψήφιος;", 180, "3 × 60 = 180 λεπτά."],
  ["Πόσα κειμενικά είδη παραγωγής λόγου προβλέπει ο πίνακας προδιαγραφών;", 4, "Άρθρο, επιστολή, δοκίμιο, ομιλία."],
  ["Πόσες μονάδες παίρνει το Β1 (διδαγμένο κείμενο) στις Παγκύπριες 2026;", 12, "Δύο υποερωτήματα των 6 μονάδων."]
];

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 1.1 Χρονοπρογραμματισμός εξέτασης + ρήματα εκφώνησης ---------- */
  na1plan(box) {
    const P = [["Α.Ι Κατανόηση", 30, 60, "var(--blue)"], ["Α.ΙΙ Παραγωγή λόγου", 40, 70, "var(--purple)"], ["Β΄ Λογοτεχνία", 30, 45, "var(--amber)"]];
    const V = { "εντοπίζω / αναφέρω": ["Γνώση", "Βρες το στοιχείο στο κείμενο και γράψ’ το σύντομα, χωρίς ανάλυση."], "εξηγώ / ερμηνεύω": ["Κατανόηση", "Πες με δικά σου λόγια τι σημαίνει και γιατί."], "αιτιολογώ": ["Κατανόηση", "Δώσε τον λόγο (γιατί;) με βάση το κείμενο."], "εισηγούμαι / προτείνω": ["Εφαρμογή", "Δώσε συγκεκριμένες λύσεις ή τρόπους, με σύντομη ανάπτυξη."], "αναλύω": ["Ανάλυση", "Χώρισε σε μέρη, εξήγησε τη λειτουργία κάθε μέρους, τεκμηρίωσε."], "συγκρίνω": ["Ανάλυση", "Βρες ομοιότητες και διαφορές ως προς τα ίδια κριτήρια — όχι δύο ξεχωριστές περιγραφές."], "τεκμηριώνω": ["Ανάλυση", "Παράθεσε το σημείο του κειμένου (εισαγωγικά, παράγραφος, στίχοι)."], "σχολιάζω / κρίνω": ["Αξιολόγηση", "Πάρε θέση (συμφωνώ/διαφωνώ/εν μέρει) και αιτιολόγησέ τη."], "γράφω άρθρο / επιστολή": ["Σύνθεση", "Παράγεις δικό σου κείμενο με τη δομή του κειμενικού είδους."] };
    box.innerHTML = `<div class="na1g2"><div><b>Μοίρασε τα 180 λεπτά</b>${P.map((p, i) => `<label class="na1sl"><span>${p[0]} <small class="muted">(${p[1]} μον.)</small></span><input type="range" min="10" max="120" step="5" value="${p[2]}" data-i="${i}"><b class="v"></b></label>`).join("")}<div class="na1bar"></div><div class="wout na1o"></div></div>
      <div><b>Τι ζητά το ρήμα;</b><div class="wctl" style="margin-top:6px"><select class="vb">${Object.keys(V).map(k => `<option>${k}</option>`).join("")}</select></div><div class="wout na1v"></div></div></div>`;
    const draw = () => {
      const m = [...box.querySelectorAll("input[type=range]")].map(x => +x.value), tot = m.reduce((a, b) => a + b, 0);
      box.querySelectorAll(".na1sl .v").forEach((b, i) => b.textContent = m[i] + "΄");
      $(".na1bar", box).innerHTML = P.map((p, i) => `<i style="width:${m[i] / Math.max(tot, 180) * 100}%;background:${p[3]}" title="${p[0]}"></i>`).join("");
      const left = 180 - tot;
      $(".na1o", box).innerHTML = `Σύνολο: <b>${tot}΄</b> από 180΄ · ${left >= 0 ? `<span class="t1">περισσεύουν ${left}΄ για τελικό έλεγχο</span>` : `<b style="color:var(--red)">ξεπερνάς τον χρόνο κατά ${-left}΄!</b>`}<br>` +
        P.map((p, i) => `${p[0]}: <b>${(p[1] / m[i]).toFixed(2).replace(".", ",")}</b> μον./λεπτό`).join(" · ") +
        `<br><span class="muted small">${m[1] < 60 ? "⚠ Λιγότερο από 60΄ για 450–500 λέξεις είναι πολύ λίγο: σχεδιάγραμμα, γράψιμο, έλεγχος." : m[0] > 80 ? "⚠ Πολύς χρόνος στην κατανόηση — μην «κλέβεις» από την παραγωγή λόγου." : "✓ Λογική κατανομή."}</span>`;
      const v = V[$(".vb", box).value]; $(".na1v", box).innerHTML = `<b class="t2">${v[0]}</b> — ${v[1]}`;
    };
    box.querySelectorAll("input,select").forEach(x => x.oninput = x.onchange = draw); draw();
  },

  /* ---------- 1.2 Υπολογιστής βαθμολογίας με τη δομή του 2026 ---------- */
  na1score(box) {
    const Q = [["Α.Ι.1 Περίληψη", 8], ["Α.Ι.2 Μέσα πειθούς", 3], ["Α.Ι.3 Εντοπισμός", 3], ["Α.Ι.4 Μακροπερίοδος λόγος", 3], ["Α.Ι.5 Σχολιασμός", 5], ["Α.Ι.6 Αντώνυμα", 4], ["Α.Ι.7 Παράγωγα", 4], ["Α.ΙΙ Άρθρο", 40], ["Β1 Μόντης", 12], ["Β2 Ρίτσος – Αγγελίδου", 10], ["Β3 Αστροφεγγιά", 8]];
    box.innerHTML = `<p class="muted small">Βαθμολόγησε τον εαυτό σου σε ένα διαγώνισμα με τη δομή των Παγκυπρίων 2026 (σύρε ή γράψε τις μονάδες σου).</p><div class="na1sc">${Q.map((q, i) => `<label><span>${q[0]}</span><input type="number" min="0" max="${q[1]}" step="0.5" value="${Math.round(q[1] * 0.7 * 2) / 2}" data-i="${i}"><small>/ ${q[1]}</small></label>`).join("")}</div><div class="na1bar"></div><div class="wout"></div><div class="wctl" style="margin-top:8px"><button class="btn ghost small na1full">Όλα στο μέγιστο</button><button class="btn ghost small na1zero">Μηδενισμός</button></div>`;
    const ins = [...box.querySelectorAll("input")];
    const draw = () => {
      const v = ins.map((x, i) => Math.max(0, Math.min(Q[i][1], +String(x.value).replace(",", ".") || 0)));
      const A = v.slice(0, 8).reduce((a, b) => a + b, 0), B = v.slice(8).reduce((a, b) => a + b, 0), T = A + B, g = T / 5;
      $(".na1bar", box).innerHTML = `<i style="width:${A}%;background:var(--blue)"></i><i style="width:${B}%;background:var(--amber)"></i>`;
      const weak = Q.map((q, i) => [q[0], v[i] / q[1]]).sort((a, b) => a[1] - b[1]).slice(0, 2);
      $(".wout", box).innerHTML = `Μέρος Α΄: <b>${String(A).replace(".", ",")}</b>/70 · Μέρος Β΄: <b>${String(B).replace(".", ",")}</b>/30 · Σύνολο <b>${String(T).replace(".", ",")}</b>/100 → βαθμός <b class="t1" style="font-size:1.15em">${g.toFixed(2).replace(".", ",")}</b>/20<br><span class="muted small">Πρώτη προτεραιότητα για βελτίωση: ${weak.map(w => `<b>${w[0]}</b> (${Math.round(w[1] * 100)}%)`).join(" και ")}.</span>`;
    };
    ins.forEach(x => x.oninput = draw);
    $(".na1full", box).onclick = () => { ins.forEach((x, i) => x.value = Q[i][1]); draw(); };
    $(".na1zero", box).onclick = () => { ins.forEach(x => x.value = 0); draw(); };
    draw();
  },

  /* ---------- 2.1 Εργαστήρι περίληψης ---------- */
  na1sum(box) {
    const NOTES = ["Αυξανόμενη εθελοντική δράση των νέων — ανατροπή της εικόνας αδιάφορης νεολαίας", "Ατομικά οφέλη: ενσυναίσθηση, δεξιότητες, εκτίμηση από εργοδότες", "Κοινωνικά οφέλη: γρήγορη αντίδραση σε κρίσεις, αλληλεγγύη, εμπιστοσύνη", "Κίνδυνοι: υποκατάσταση της πολιτείας, εξαναγκασμός με αντάλλαγμα", "Πρόταση: ελεύθερη επιλογή, σχολείο που εμπνέει → στάση ζωής"];
    const CK = ["Εισαγωγική φράση με το θέμα", "Γ΄ πρόσωπο, χωρίς προσωπικά σχόλια", "Καλύπτω και τις 5 παραγράφους", "Διαρθρωτικές λέξεις (αρχικά, επιπλέον, ωστόσο…)", "Αναδιατύπωση — όχι αντιγραφή", "Χωρίς παραδείγματα και αριθμούς", "Έλεγχος ορθογραφίας"];
    box.innerHTML = `<p class="muted small">Γράψε την περίληψη του κειμένου εξάσκησης «Εθελοντισμός: πολυτέλεια ή ανάγκη;» (θεωρία πιο πάνω). Ο μετρητής ελέγχει την έκταση με τα όρια του οδηγού διόρθωσης.</p>
      <div class="wctl"><button class="btn ghost small na1n">📝 Σημειώσεις ανά παράγραφο</button><button class="btn ghost small na1m">👁 Ενδεικτική περίληψη</button><button class="btn ghost small na1c">Καθαρισμός</button></div>
      <div class="na1notes hidden"></div>
      <textarea class="na1ta" rows="8" placeholder="Το άρθρο πραγματεύεται…"></textarea>
      <div class="na1meter"><i></i></div><div class="wout na1cnt"></div>
      <div class="na1ck">${CK.map(c => `<label><input type="checkbox"> ${c}</label>`).join("")}</div>
      <div class="na1model hidden wout"></div>`;
    const ta = $(".na1ta", box);
    try { ta.value = localStorage.getItem("na1sum") || ""; } catch (e) {}
    const MODEL = "Το άρθρο πραγματεύεται τον εθελοντισμό των νέων, τα οφέλη και τους κινδύνους του. Αρχικά, ο αρθρογράφος διαπιστώνει ότι όλο και περισσότεροι νέοι στην Κύπρο προσφέρουν εθελοντικά, γεγονός που ανατρέπει την εικόνα μιας αδιάφορης νεολαίας. Στη συνέχεια, υποστηρίζει ότι ο εθελοντισμός καλλιεργεί την ενσυναίσθηση και αναπτύσσει δεξιότητες συνεργασίας και υπευθυνότητας, τις οποίες εκτιμούν και οι εργοδότες. Επιπλέον, ωφελεί το σύνολο, καθώς η κοινωνία αντιμετωπίζει ταχύτερα τις κρίσεις, ενώ ενισχύονται η αλληλεγγύη και η εμπιστοσύνη μεταξύ των πολιτών. Ωστόσο, προειδοποιεί ότι η εθελοντική προσφορά δεν πρέπει να υποκαθιστά τις υποχρεώσεις της πολιτείας ούτε να επιβάλλεται με αντάλλαγμα, γιατί τότε γίνεται συναλλαγή. Καταληκτικά, τονίζει ότι ο εθελοντισμός πρέπει να είναι ελεύθερη επιλογή και ότι το σχολείο, εμπνέοντας χωρίς να εξαναγκάζει, μπορεί να τον μετατρέψει σε στάση ζωής.";
    const CON = ["αρχικά", "στη συνέχεια", "επιπλέον", "επίσης", "παράλληλα", "ωστόσο", "όμως", "αντίθετα", "επομένως", "γι’ αυτό", "καταληκτικά", "τέλος", "συμπερασματικά", "εντούτοις", "ακόμη", "επιπρόσθετα"];
    const draw = () => {
      const t = ta.value, n = na1Words(t);
      try { localStorage.setItem("na1sum", t); } catch (e) {}
      const pct = Math.min(100, n / 210 * 100), col = n === 0 ? "#cbd5e1" : n < 120 ? "var(--amber)" : n <= 140 ? "var(--green)" : n <= 170 ? "var(--amber)" : "var(--red)";
      $(".na1meter i", box).style.cssText = `width:${pct}%;background:${col}`;
      const low = t.toLowerCase(), con = CON.filter(c => low.includes(c));
      const first = /\b(εγώ|νομίζω|πιστεύω|συμφωνώ|διαφωνώ)\b/i.test(t) || /(^|\s)(νομίζω|πιστεύω|συμφωνώ|διαφωνώ)/i.test(t);
      $(".na1cnt", box).innerHTML = `<b style="color:${col}">${n}</b> λέξεις · στόχος 120–140 · ${n === 0 ? "ξεκίνα να γράφεις" : n < 120 ? "λίγες — μήπως λείπει παράγραφος;" : n <= 140 ? "✓ μέσα στα όρια" : n <= 170 ? "λίγο μεγάλη, αλλά χωρίς ποινή" : n <= 200 ? "<b>−1 μονάδα</b> (πάνω από 170)" : "<b>−4 μονάδες</b> (πάνω από 200)"}<br>Διαρθρωτικές λέξεις που εντόπισα: ${con.length ? con.map(c => `<span class="na1tag">${c}</span>`).join(" ") : "<i>καμία ακόμη</i>"}${first ? `<br><b style="color:var(--red)">⚠ Βρήκα προσωπικό σχόλιο (νομίζω/πιστεύω/συμφωνώ) — η περίληψη είναι αντικειμενική.</b>` : ""}`;
    };
    ta.oninput = draw;
    $(".na1n", box).onclick = () => { const d = $(".na1notes", box); d.innerHTML = `<ol>${NOTES.map(x => `<li>${x}</li>`).join("")}</ol>`; d.classList.toggle("hidden"); };
    $(".na1m", box).onclick = () => { const d = $(".na1model", box); d.innerHTML = `<b>Ενδεικτική περίληψη (${na1Words(MODEL)} λέξεις):</b> ${MODEL}`; d.classList.toggle("hidden"); };
    $(".na1c", box).onclick = () => { ta.value = ""; draw(); };
    draw();
  },

  /* ---------- 2.2 Ταξινομητής τρόπων/μέσων πειθούς ---------- */
  na1pers(box) { na1Classifier(box, { bank: NA1_PERS, labels: NA1_MODES, text: e => e[0], ans: e => e[1], fb: (e, ok) => `${ok ? "✓ Σωστά!" : `✗ Όχι — είναι <b>${NA1_MODES[e[1]]}</b>.`} Μέσο: <b>${e[2]}</b>. ${e[3]}`, prompt: "Ποιος τρόπος πειθούς χρησιμοποιείται;" }); },

  /* ---------- 2.3 Ταξινομητής συλλογισμών με διάγραμμα κατεύθυνσης ---------- */
  na1syl(box) {
    const DIAG = ["<b>γενικό</b> ⟶ <b>ειδικό</b> · συμπέρασμα βέβαιο", "<b>ειδικό</b> + <b>ειδικό</b> + … ⟶ <b>γενικό</b> · συμπέρασμα πιθανό", "<b>ειδικό</b> ⟷ <b>ειδικό</b> (ομοιότητα) · συμπέρασμα λιγότερο ασφαλές"];
    na1Classifier(box, { bank: NA1_SYL, labels: NA1_SYLT, text: e => e[0], ans: e => e[1], fb: (e, ok) => `${ok ? "✓ Σωστά!" : `✗ Όχι — είναι <b>${NA1_SYLT[e[1]]}</b>.`} <span class="muted">${DIAG[e[1]]}</span>`, prompt: "Τι είδους συλλογισμός είναι;" });
  },

  /* ---------- 2.4 Εξερευνητής σημείων στίξης ---------- */
  na1punct(box) {
    const keys = Object.keys(NA1_PF);
    box.innerHTML = `<div class="na1keys">${keys.map(k => `<button class="btn ghost na1k" data-k="${k}">${k}</button>`).join("")}</div><div class="wout na1fn"></div><div class="na1q"></div>`;
    let cur = keys[0];
    const show = () => {
      box.querySelectorAll(".na1k").forEach(b => b.classList.toggle("primary", b.dataset.k === cur));
      const ex = NA1_PUN.filter(e => e[1] === cur);
      $(".na1fn", box).innerHTML = `<b>${cur}</b> — λειτουργίες: ${NA1_PF[cur].map(f => `<span class="na1tag">${f}</span>`).join(" ")}<ul class="small" style="margin:6px 0 0 18px">${ex.slice(0, 3).map(e => `<li>${na1Esc(e[0])} → <i>${e[2]}</i></li>`).join("")}</ul>`;
      quiz();
    };
    $(".na1q", box).innerHTML = `<div class="na1card"><div class="small muted na1qp"></div><div class="na1sent"></div><div class="na1opts">${[0, 1, 2, 3].map(i => `<button class="btn ghost small na1o"></button>`).join("")}</div><div class="na1f"></div><button class="btn ghost small na1nx">Άλλη πρόταση ↻</button></div>`;
    const ob = [...box.querySelectorAll(".na1o")]; let qe = null, qd = false;
    const quiz = () => {
      qe = na1Pick(NA1_PUN); qd = false; const opts = na1Shuf(na1MC(qe[2], na1PunctPool(qe[1], qe[2]), 4).options);
      $(".na1qp", box).innerHTML = `Μίνι-τεστ · ποια είναι η λειτουργία του σημείου <b>${qe[1]}</b>;`; $(".na1q .na1sent", box).innerHTML = na1Esc(qe[0]); $(".na1q .na1f", box).innerHTML = "";
      ob.forEach((b, i) => { b.textContent = opts[i]; b.classList.remove("na1ok", "na1bad", "na1dis"); });
    };
    ob.forEach(b => b.onclick = () => { if (qd) return; qd = true; const ok = b.textContent === qe[2]; ob.forEach(x => { x.classList.add("na1dis"); if (x.textContent === qe[2]) x.classList.add("na1ok"); }); if (!ok) b.classList.add("na1bad"); $(".na1q .na1f", box).innerHTML = ok ? "✓ Σωστά!" : `✗ Η λειτουργία είναι: <b>${qe[2]}</b>.`; });
    $(".na1q .na1nx", box).onclick = quiz;
    box.querySelectorAll(".na1k").forEach(b => b.onclick = () => { cur = b.dataset.k; show(); });
    show();
  },

  /* ---------- 2.5 Κατασκευαστής σχολίου 60–80 λέξεων ---------- */
  na1crit(box) {
    const TH = [["Η διαφήμιση δεν είναι ο μόνος παράγοντας που διαμορφώνει τα καταναλωτικά μας πρότυπα.", "παράγοντες που επηρεάζουν τα καταναλωτικά πρότυπα"], ["Τα μέσα κοινωνικής δικτύωσης δεν απομονώνουν τους νέους· απλώς αλλάζουν τον τρόπο που επικοινωνούν.", "τρόπους προστασίας από την υπερβολική χρήση"], ["Το σχολείο προετοιμάζει για τις εξετάσεις, όχι για τη ζωή.", "τρόπους με τους οποίους το σχολείο μπορεί να προετοιμάσει για τη ζωή"], ["Η τεχνολογία έκανε τη ζωή μας πιο εύκολη, αλλά όχι πιο ευτυχισμένη.", "παράγοντες που κάνουν τον άνθρωπο ευτυχισμένο"]];
    const ST = { "συμφωνώ": "Η θέση αυτή είναι εύστοχη.", "εν μέρει": "Η θέση αυτή είναι εν μέρει εύστοχη.", "διαφωνώ": "Η θέση αυτή μού φαίνεται υπεραπλουστευτική." };
    box.innerHTML = `<div class="wctl col"><label>Θέση: <select class="na1th">${TH.map((t, i) => `<option value="${i}">${t[0]}</option>`).join("")}</select></label>
      <label>Η στάση μου: <select class="na1st">${Object.keys(ST).map(k => `<option>${k}</option>`).join("")}</select></label></div>
      <div class="na1fields"><label>Αιτιολόγηση (γιατί;) <input class="na1r" placeholder="π.χ. γιατί δεχόμαστε επιρροές και από την οικογένεια και την παρέα"></label>
      <label class="na1f1l">Πρώτος/η <input class="na1f1" placeholder="π.χ. η οικογένεια, αφού οι γονείς λειτουργούν ως πρότυπα"></label>
      <label class="na1f2l">Δεύτερος/η <input class="na1f2" placeholder="π.χ. η ανάγκη αποδοχής από την παρέα, που…"></label></div>
      <div class="wout na1out"></div><div class="na1meter"><i></i></div><div class="small na1cnt"></div>`;
    const draw = () => {
      const t = TH[+$(".na1th", box).value], st = $(".na1st", box).value;
      $(".na1f1l", box).firstChild.textContent = `Πρώτο σημείο (${t[1]}) `; $(".na1f2l", box).firstChild.textContent = "Δεύτερο σημείο ";
      const r = $(".na1r", box).value.trim(), f1 = $(".na1f1", box).value.trim(), f2 = $(".na1f2", box).value.trim();
      const txt = `${ST[st]}${r ? " Πράγματι, " + r.replace(/^γιατί\s+/i, "") + "." : ""}${f1 || f2 ? ` Ως προς τους ${t[1]}, ${f1 ? "πρώτον, " + f1 : ""}${f1 && f2 ? " και, δεύτερον, " : ""}${f2 ? (f1 ? "" : "") + f2 : ""}.` : ""}`.replace(/\.\./g, ".");
      const n = na1Words(txt), col = n < 60 ? "var(--amber)" : n <= 80 ? "var(--green)" : "var(--red)";
      $(".na1out", box).innerHTML = `<b>Το σχόλιό σου:</b> ${na1Esc(txt)}`;
      $(".na1meter i", box).style.cssText = `width:${Math.min(100, n / 100 * 100)}%;background:${col}`;
      $(".na1cnt", box).innerHTML = `<b style="color:${col}">${n}</b> λέξεις (στόχος 60–80) · ${!r ? "➊ λείπει η αιτιολόγηση · " : ""}${!(f1 && f2) ? "➋ χρειάζονται δύο σημεία με εξήγηση · " : ""}${r && f1 && f2 ? (n >= 60 && n <= 80 ? "✓ πλήρες σχόλιο" : n < 60 ? "ανάπτυξε λίγο τα σημεία σου" : "συντόμευσε") : ""}`;
    };
    box.querySelectorAll("input,select").forEach(x => x.oninput = x.onchange = draw); draw();
  },

  /* ---------- 2.6 Αναγνώριση κειμενικού είδους / τύπου ---------- */
  na1genre(box) {
    box.innerHTML = `<div class="wctl"><label>Άσκηση: <select class="na1md"><option value="g">Κειμενικό είδος (άρθρο, επιστολή, ομιλία, δοκίμιο)</option><option value="t">Κειμενικός τύπος (επιχειρηματολογία, αφήγηση, περιγραφή)</option></select></label></div><div class="na1cl"></div>`;
    const run = () => { const md = $(".na1md", box).value, L = md === "g" ? NA1_GEN : NA1_TYP; na1Classifier($(".na1cl", box), { bank: NA1_GR.filter(e => e[2] === md), labels: L, text: e => e[0], ans: e => L.indexOf(e[1]), fb: (e, ok) => `${ok ? "✓ Σωστά!" : `✗ Είναι <b>${e[1]}</b>.`} Ενδείξεις: <i>${e[3]}</i>.`, prompt: md === "g" ? "Από ποιο κειμενικό είδος προέρχεται;" : "Ποιος κειμενικός τύπος κυριαρχεί;" }); };
    $(".na1md", box).onchange = run; run();
  }
});

/* κοινός ταξινομητής: κάρτα με πρόταση, κουμπιά κατηγοριών, σκορ */
function na1Classifier(box, o) {
  let order = na1Shuf(o.bank.map((_, i) => i)), k = 0, ok = 0, tot = 0, done = false, e = null;
  box.innerHTML = `<div class="na1card"><div class="small muted na1pr"></div><div class="na1sent"></div><div class="na1opts">${o.labels.map((l, i) => `<button class="btn ghost small" data-i="${i}">${l}</button>`).join("")}</div><div class="na1f"></div><div class="wctl" style="margin:8px 0 0"><button class="btn primary small na1nx">Επόμενη ↻</button><span class="small na1scr"></span></div></div>`;
  const btns = [...box.querySelectorAll(".na1opts button")];
  const show = () => {
    e = o.bank[order[k % order.length]]; done = false;
    $(".na1pr", box).textContent = o.prompt; $(".na1sent", box).innerHTML = na1Esc(o.text(e)); $(".na1f", box).innerHTML = "";
    btns.forEach(x => x.classList.remove("na1ok", "na1bad", "na1dis"));
  };
  btns.forEach(b => b.onclick = () => {
    if (done) return; done = true;
    const good = +b.dataset.i === o.ans(e); tot++; if (good) ok++;
    btns.forEach(x => { x.classList.add("na1dis"); if (+x.dataset.i === o.ans(e)) x.classList.add("na1ok"); });
    if (!good) b.classList.add("na1bad");
    $(".na1f", box).innerHTML = o.fb(e, good); $(".na1scr", box).innerHTML = `Σκορ: <b>${ok}/${tot}</b>`;
  });
  $(".na1nx", box).onclick = () => { k++; show(); };
  show();
}

var GENS = Object.assign(window.GENS || {}, {
  na1gExam: { title: "Γεννήτρια — η δομή της εξέτασης σε αριθμούς", make() {
    const e = na1Pick(NA1_EX);
    return { level: 1, q: e[0], fields: [{ label: "Απάντηση:", ans: e[1], tol: 1e-9 }], hint: "Θυμήσου τη δομή: Α.Ι 30 · Α.ΙΙ 40 · Β΄ 30.", sol: `<b>${String(e[1]).replace(".", ",")}</b>. ${e[2]}` };
  } },
  na1gSum: { title: "Γεννήτρια — κανόνες της περίληψης (ΣΩΣΤΟ/ΛΑΘΟΣ)", make() {
    const e = na1Pick(NA1_SR);
    return { level: 1, type: "mc", q: `Ισχύει η πιο κάτω πρόταση για την περίληψη κειμένου;<div class="na1sent">${e[0]}</div>`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: e[1] ? 0 : 1, hint: "Σκέψου τον σκοπό της περίληψης: αντικειμενική, σύντομη απόδοση των κύριων ιδεών.", sol: `<b>${e[1] ? "ΣΩΣΤΟ" : "ΛΑΘΟΣ"}.</b> ${e[2]}` };
  } },
  na1gPers: { title: "Γεννήτρια — τρόποι και μέσα πειθούς", make() {
    const e = na1Pick(NA1_PERS), asks = Math.random() < 0.6;
    if (asks) { const m = na1MC(NA1_MODES[e[1]], NA1_MODES, 4); return { level: 2, type: "mc", q: `<div class="na1sent">${e[0]}</div>Ποιος τρόπος πειθούς χρησιμοποιείται;`, ...m, hint: "Σε τι στηρίζεται η πειθώ: στα δεδομένα, σε κάποιον με κύρος, στο συναίσθημα ή στο ήθος;", sol: `<b>${NA1_MODES[e[1]]}</b> — μέσο: ${e[2].toLowerCase()}. ${e[3]}` }; }
    const m = na1MC(e[2], na1MeanPool(e[2]), 4);
    return { level: 2, type: "mc", q: `<div class="na1sent">${e[0]}</div>Με ποιο μέσο πειθούς στηρίζεται η θέση;`, ...m, hint: "Ψάξε το συγκεκριμένο «εργαλείο»: αριθμός, ειδικός, ερώτημα, εμπειρία, λεξιλόγιο…", sol: `<b>${e[2]}</b> (τρόπος: ${NA1_MODES[e[1]].toLowerCase()}). ${e[3]}` };
  } },
  na1gSyl: { title: "Γεννήτρια — αναγνώριση συλλογισμού", make() {
    const e = na1Pick(NA1_SYL), d = ["από το γενικό στο ειδικό — βέβαιο συμπέρασμα", "από πολλές ειδικές περιπτώσεις στο γενικό — πιθανό συμπέρασμα", "από το ειδικό στο ειδικό, με βάση την ομοιότητα"];
    return { level: 2, type: "mc", q: `<div class="na1sent">${e[0]}</div>Τι είδους συλλογισμός είναι;`, options: NA1_SYLT.slice(), correct: e[1], hint: "Πού ξεκινά και πού καταλήγει η σκέψη;", sol: `<b>${NA1_SYLT[e[1]]}</b>: ${d[e[1]]}.` };
  } },
  na1gPunct: { title: "Γεννήτρια — λειτουργία των σημείων στίξης", make() {
    const e = na1Pick(NA1_PUN), pool = na1PunctPool(e[1], e[2]), m = na1MC(e[2], pool, 4);
    return { level: 2, type: "mc", q: `<div class="na1sent">${e[0]}</div>Ποια είναι η λειτουργία του σημείου <b>${e[1]}</b> στην πρόταση;`, ...m, hint: "Τι προσθέτει ή τι δηλώνει το σημείο στο νόημα της πρότασης;", sol: `<b>${e[2]}</b>. Άλλες πιθανές λειτουργίες του ${e[1]}: ${NA1_PF[e[1]].filter(f => f !== e[2]).join(", ") || "—"}.` };
  } },
  na1gGenre: { title: "Γεννήτρια — κειμενικό είδος και κειμενικός τύπος", make() {
    const e = na1Pick(NA1_GR), L = e[2] === "g" ? NA1_GEN : NA1_TYP;
    return { level: 1, type: "mc", q: `<div class="na1sent">${e[0]}</div>${e[2] === "g" ? "Από ποιο κειμενικό είδος προέρχεται το απόσπασμα;" : "Ποιος κειμενικός τύπος κυριαρχεί στο απόσπασμα;"}`, options: L.slice(), correct: L.indexOf(e[1]), hint: e[2] === "g" ? "Ψάξε προσφώνηση, ακροατήριο, επικαιρότητα ή στοχασμό." : "Γεγονότα στον χρόνο, εικόνα χώρου/προσώπου ή θέση με επιχειρήματα;", sol: `<b>${e[1]}</b>. Ενδείξεις: ${e[3]}.` };
  } }
});

/* στυλ των widgets (εισάγονται μία φορά) */
(function () {
  if (document.getElementById("na1css")) return;
  const st = document.createElement("style"); st.id = "na1css";
  st.textContent = `.na1g2{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.na1sl{display:grid;grid-template-columns:1fr;gap:2px;margin:8px 0;font-size:14px}.na1sl input{width:100%}.na1sl b.v{font-family:"IBM Plex Mono",monospace;color:var(--blue)}
.na1bar{display:flex;height:12px;border-radius:99px;overflow:hidden;background:#eef1f6;margin:8px 0}.na1bar i{display:block;height:100%}
.na1sc{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px 14px}.na1sc label{display:flex;align-items:center;gap:6px;font-size:13.5px}.na1sc label span{flex:1;min-width:0}.na1sc input{width:64px;padding:4px 6px;border:1px solid var(--line);border-radius:8px;font:inherit}
.na1ta{width:100%;box-sizing:border-box;font:15px/1.6 Georgia,serif;padding:10px 12px;border:1px solid var(--line);border-radius:12px;resize:vertical;min-height:140px}
.na1meter{height:8px;border-radius:99px;background:#eef1f6;margin:8px 0 0;overflow:hidden}.na1meter i{display:block;height:100%;transition:width .2s}
.na1ck{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:8px;font-size:13.5px}.na1ck label{display:flex;gap:6px;align-items:center}
.na1notes{margin:8px 0;padding:8px 14px 8px 30px;background:var(--soft);border-radius:10px;font-size:14px}.hidden{display:none}
.na1tag{display:inline-block;background:#fbe9e7;color:var(--navy);border-radius:99px;padding:1px 8px;margin:2px 1px;font-size:12.5px;font-weight:600}
.na1card{border:1px solid var(--line);border-radius:14px;padding:12px 14px;background:#fff}
.na1sent{font:16px/1.6 Georgia,serif;margin:8px 0 10px;padding:8px 12px;background:#fffdfb;border-left:4px solid var(--blue);border-radius:0 8px 8px 0}
.na1opts{display:flex;flex-wrap:wrap;gap:6px}.na1opts .btn{white-space:normal;text-align:left}
.na1ok{background:#e8f5ec!important;border-color:var(--green)!important;color:#0f5132!important}.na1bad{background:#fdecea!important;border-color:var(--red)!important;color:#842029!important}
.na1dis{opacity:.75;cursor:default}.na1f{margin-top:8px;font-size:14.5px;min-height:1.2em}.na1keys{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}.na1keys .btn{min-width:46px;font-size:16px}
.na1fields{display:grid;gap:8px;margin:6px 0}.na1fields label{display:grid;gap:3px;font-size:13.5px;font-weight:600;color:var(--navy)}.na1fields input{font:inherit;font-weight:400;padding:7px 10px;border:1px solid var(--line);border-radius:9px;width:100%;box-sizing:border-box}
.na1q{margin-top:10px}.wctl.col select{width:100%}`;
  document.head.appendChild(st);
})();

/* Νέα Ελληνικά Γ΄ Λυκείου (Γλώσσα) — widgets & γεννήτριες: Οργάνωση λόγου, Εκφραστικά μέσα, Λεξιλόγιο (prefix na3)
   Όλα τα κείμενα και τα παραδείγματα είναι πρωτότυπα κείμενα εξάσκησης. */
const na3Sh = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const na3Pick = a => a[Math.floor(Math.random() * a.length)];
const na3E = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const na3U = s => na3E(s).replace(/\[\[(.+?)\]\]/g, '<u class="neu">$1</u>');
const na3N = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ς/g, "σ").toLowerCase().replace(/[.,;:!·«»"'()…–—-]/g, " ").replace(/\s+/g, " ").trim();
/* mc από σωστή απάντηση + λάθος επιλογές (ανακατεμένες, χωρίς διπλότυπα) */
function na3MC(ex, right, wrongs) {
  const seen = new Set([na3N(right)]), ws = [];
  for (const w of wrongs) { const k = na3N(w); if (!seen.has(k)) { seen.add(k); ws.push(w); } }
  const opts = na3Sh([right].concat(ws.slice(0, 3)));
  return Object.assign({ type: "mc", shuffle: true }, ex, { options: opts, correct: opts.indexOf(right) });
}
const na3Score = () => { let ok = 0, n = 0; return { add(b) { n++; if (b) ok++; }, txt() { return n ? `Σκορ: <b>${ok}/${n}</b>` : "Σκορ: —"; } }; };

/* ═════════════ ΤΡΑΠΕΖΕΣ ═════════════ */

/* 3.1 — παράγραφοι: s = περίοδοι, t = θέση θεματικής περιόδου, k = θέση κατακλείδας (-1 αν δεν υπάρχει) */
const NA3_PAR = [
  { th: "Σχολείο και κριτική σκέψη", s: ["Το σύγχρονο σχολείο οφείλει να καλλιεργεί πρωτίστως την κριτική σκέψη των μαθητών.", "Σε μια εποχή όπου η πληροφορία είναι διαθέσιμη με ένα άγγιγμα της οθόνης, η απομνημόνευση χάνει μεγάλο μέρος της αξίας της.", "Αντίθετα, η ικανότητα να αξιολογεί κανείς την αξιοπιστία μιας πηγής και να διακρίνει το γεγονός από τη γνώμη γίνεται απαραίτητη.", "Γι' αυτό, η εκπαίδευση που περιορίζεται στη μετάδοση γνώσεων αφήνει τους νέους ανυπεράσπιστους απέναντι στην παραπληροφόρηση."], t: 0, k: 3 },
  { th: "Εθελοντισμός", s: ["Ο εθελοντισμός προσφέρει στους νέους πολύτιμες εμπειρίες ζωής.", "Μέσα από τη συμμετοχή τους σε δράσεις αλληλεγγύης, έρχονται σε επαφή με ανθρώπους που δοκιμάζονται και μαθαίνουν να βλέπουν τον κόσμο με τα μάτια του άλλου.", "Παράλληλα, αναπτύσσουν δεξιότητες συνεργασίας, οργάνωσης και επίλυσης προβλημάτων, τις οποίες κανένα βιβλίο δεν μπορεί να διδάξει.", "Η εθελοντική προσφορά, επομένως, δεν ωφελεί μόνο όσους τη δέχονται αλλά και όσους την προσφέρουν."], t: 0, k: 3 },
  { th: "Διαφήμιση και παιδιά", s: ["Τα παιδιά βλέπουν καθημερινά εκατοντάδες διαφημιστικά μηνύματα στις οθόνες τους.", "Πολλά από αυτά παρουσιάζουν ένα παιχνίδι ή ένα σνακ ως εισιτήριο για τη χαρά και την αποδοχή από τους φίλους.", "Το παιδί όμως δεν έχει ακόμη αναπτύξει τα κριτήρια για να αναγνωρίσει την πειθώ που κρύβεται πίσω από τις εικόνες.", "Για τους λόγους αυτούς, η διαφήμιση που απευθύνεται σε ανηλίκους χρειάζεται αυστηρότερους κανόνες."], t: 3, k: -1 },
  { th: "Τεχνητή νοημοσύνη στην εργασία", s: ["Η τεχνητή νοημοσύνη αλλάζει ήδη τον χάρτη της εργασίας.", "Εργασίες ρουτίνας, όπως η καταχώριση δεδομένων ή η απάντηση σε απλά ερωτήματα πελατών, αυτοματοποιούνται με ταχύτατους ρυθμούς.", "Ταυτόχρονα, εμφανίζονται νέα επαγγέλματα που απαιτούν συνδυασμό τεχνικών γνώσεων και ανθρώπινης κρίσης."], t: 0, k: -1 },
  { th: "Βιβλίο και οθόνη", s: ["Το έντυπο βιβλίο αντέχει, παρά τις προβλέψεις για το τέλος του.", "Η πραγματικότητα το επιβεβαιώνει: οι πωλήσεις έντυπων βιβλίων παραμένουν σταθερές και οι βιβλιοθήκες γεμίζουν με νέους αναγνώστες.", "Φαίνεται ότι η σωματική εμπειρία της ανάγνωσης, το χαρτί, η σελίδα που γυρίζει, συνεχίζει να έχει τη δική της αξία.", "Συνεπώς, το βιβλίο και η οθόνη μάλλον θα συνυπάρξουν παρά θα ανταγωνιστούν."], t: 0, k: 3 },
  { th: "Κλιματική κρίση και νέοι", s: ["Οι νέοι αποτελούν σήμερα την πιο δραστήρια φωνή απέναντι στην κλιματική κρίση.", "Οργανώνουν πορείες, συμμετέχουν σε περιβαλλοντικές ομάδες και πιέζουν τις κυβερνήσεις να λάβουν μέτρα.", "Πολλοί αλλάζουν και τις προσωπικές τους συνήθειες, περιορίζοντας τα πλαστικά και επιλέγοντας τις δημόσιες συγκοινωνίες.", "Η στάση τους δείχνει ότι η ευαισθητοποίηση μπορεί να μετατραπεί σε πράξη."], t: 0, k: 3 },
  { th: "Μέσα κοινωνικής δικτύωσης", s: ["Τα μέσα κοινωνικής δικτύωσης έχουν δύο όψεις.", "Από τη μια, μας φέρνουν πιο κοντά με φίλους που ζουν μακριά και μας επιτρέπουν να οργανώνουμε κοινές δράσεις.", "Από την άλλη, η συνεχής σύγκριση με τις εξιδανικευμένες εικόνες των άλλων μπορεί να υπονομεύσει την αυτοεκτίμησή μας.", "Η αξία τους, λοιπόν, εξαρτάται από τον τρόπο με τον οποίο τα χρησιμοποιούμε."], t: 0, k: 3 },
  { th: "Ανάγνωση λογοτεχνίας", s: ["Η ανάγνωση λογοτεχνίας καλλιεργεί την ενσυναίσθηση.", "Ο αναγνώστης ζει, για λίγες ώρες, μέσα στη σκέψη ενός ήρωα που μπορεί να είναι εντελώς διαφορετικός από τον ίδιο.", "Νιώθει τον φόβο του, καταλαβαίνει τα κίνητρά του, συμμερίζεται τον πόνο του.", "Έτσι, μαθαίνει να κατανοεί και τους ανθρώπους της πραγματικής ζωής πριν τους κρίνει."], t: 0, k: 3 },
  { th: "Τουρισμός στην Κύπρο", s: ["Ο τουρισμός αποτελεί έναν από τους βασικούς πυλώνες της κυπριακής οικονομίας.", "Χιλιάδες θέσεις εργασίας εξαρτώνται άμεσα ή έμμεσα από τις ξενοδοχειακές μονάδες, την εστίαση και τις μεταφορές.", "Επιπλέον, τα έσοδα από τους επισκέπτες στηρίζουν μικρές επιχειρήσεις σε χωριά και πόλεις."], t: 0, k: -1 },
  { th: "Αθλητισμός και υγεία", s: ["Κάθε εβδομάδα, εκατοντάδες ενήλικες ξεκινούν τρέξιμο, ποδηλασία ή κολύμβηση.", "Λίγους μήνες αργότερα, αναφέρουν καλύτερο ύπνο, περισσότερη ενέργεια και λιγότερο άγχος.", "Οι γιατροί επιβεβαιώνουν ότι οι ασκούμενοι επισκέπτονται σπανιότερα το ιατρείο.", "Είναι φανερό ότι η συστηματική άσκηση αποτελεί την πιο φθηνή και αποτελεσματική επένδυση στην υγεία."], t: 3, k: -1 },
  { th: "Ξένες γλώσσες", s: ["Η εκμάθηση ξένων γλωσσών ανοίγει παράθυρα σε άλλους πολιτισμούς.", "Όποιος μιλά μια δεύτερη γλώσσα μπορεί να διαβάσει ένα βιβλίο στο πρωτότυπο, να συνομιλήσει χωρίς μεσάζοντες και να καταλάβει χιούμορ και αξίες που χάνονται στη μετάφραση.", "Κατά συνέπεια, η γλωσσομάθεια δεν είναι μόνο επαγγελματικό προσόν αλλά και δρόμος προς τον σεβασμό της διαφορετικότητας."], t: 0, k: 2 },
  { th: "Καταναλωτισμός", s: ["Η ευτυχία δεν αγοράζεται, όσο κι αν η κοινωνία μάς ωθεί να αγοράζουμε συνεχώς.", "Οι βιτρίνες αλλάζουν κάθε εβδομάδα, οι προσφορές λήγουν «σήμερα» και κάθε νέο μοντέλο υπόσχεται να κάνει τη ζωή μας καλύτερη.", "Ωστόσο, οι έρευνες δείχνουν ότι η ικανοποίηση από μια αγορά διαρκεί ελάχιστα.", "Ίσως, λοιπόν, η ευτυχία βρίσκεται λιγότερο στα πράγματα και περισσότερο στις σχέσεις και στις εμπειρίες."], t: 0, k: 3 },
  { th: "Ανακύκλωση στο σχολείο", s: ["Η ανακύκλωση στο σχολείο είναι πρώτα απ' όλα μάθημα αγωγής.", "Όταν οι μαθητές διαχωρίζουν το χαρτί από το πλαστικό, μαθαίνουν ότι κάθε μικρή κίνηση έχει συνέπειες για το περιβάλλον.", "Οι συνήθειες που αποκτούν στο σχολείο μεταφέρονται συχνά και στο σπίτι, επηρεάζοντας ολόκληρη την οικογένεια."], t: 0, k: -1 },
  { th: "Φιλία στην εφηβεία", s: ["Στην εφηβεία η φιλία αποκτά ιδιαίτερη βαρύτητα.", "Ο έφηβος απομακρύνεται σταδιακά από την οικογένεια και αναζητά στους συνομηλίκους του στήριξη και αναγνώριση.", "Με τους φίλους του δοκιμάζει ρόλους, συζητά τα πρώτα του διλήμματα και διαμορφώνει την ταυτότητά του.", "Γι' αυτό η φιλία της εφηβείας αφήνει συχνά βαθιά σημάδια σε όλη τη ζωή."], t: 0, k: 3 },
  { th: "Δημόσιες συγκοινωνίες", s: ["Οι δρόμοι των πόλεων γεμίζουν κάθε πρωί με αυτοκίνητα που μεταφέρουν έναν μόνο επιβάτη.", "Το αποτέλεσμα είναι η κυκλοφοριακή συμφόρηση, η ατμοσφαιρική ρύπανση και η καθημερινή ταλαιπωρία των πολιτών.", "Η ενίσχυση των δημόσιων συγκοινωνιών αποτελεί την πιο ρεαλιστική απάντηση σε αυτά τα προβλήματα των σύγχρονων πόλεων."], t: 2, k: -1 }
];
const NA3_ROLE = ["Θεματική περίοδος", "Σχόλια / λεπτομέρειες", "Κατακλείδα"];
const na3Role = (p, i) => i === p.t ? 0 : i === p.k ? 2 : 1;
/* σε επαγωγική παράγραφο (θεματική στο τέλος) η τελευταία περίοδος λειτουργεί και ως κατακλείδα */
const na3RoleOk = (p, i, r) => r === na3Role(p, i) || (i === p.t && p.k < 0 && p.t === p.s.length - 1 && r === 2);

/* 3.2 — τρόποι ανάπτυξης παραγράφου */
const NA3_DEVM = ["Αιτιολόγηση", "Παραδείγματα", "Σύγκριση – αντίθεση", "Αναλογία", "Διαίρεση", "Αίτιο – αποτέλεσμα", "Ορισμός"];
const NA3_DEVH = {
  "Αιτιολόγηση": "η θεματική περίοδος διατυπώνει μια θέση και οι επόμενες περίοδοι απαντούν στο «γιατί;» (γιατί, επειδή, διότι, αφού, καθώς).",
  "Παραδείγματα": "η γενική θέση στηρίζεται σε συγκεκριμένες περιπτώσεις (για παράδειγμα, λόγου χάρη, όπως, συγκεκριμένα).",
  "Σύγκριση – αντίθεση": "δύο έννοιες εξετάζονται παράλληλα ως προς ομοιότητες ή διαφορές (ενώ, αντίθετα, από την άλλη, όμοια).",
  "Αναλογία": "μια αφηρημένη έννοια φωτίζεται μέσα από μια γνωστή, συγκεκριμένη εικόνα από άλλο πεδίο (όπως ακριβώς… έτσι και…, μοιάζει με).",
  "Διαίρεση": "μια έννοια χωρίζεται σε είδη ή κατηγορίες με βάση ένα κριτήριο (διακρίνεται σε, χωρίζεται σε, υπάρχουν… είδη).",
  "Αίτιο – αποτέλεσμα": "παρουσιάζονται οι αιτίες ενός φαινομένου και οι συνέπειές του (με αποτέλεσμα, συνεπώς, οδηγεί σε, προκαλεί).",
  "Ορισμός": "προσδιορίζεται το περιεχόμενο μιας έννοιας: οριστέα έννοια + γένος + ειδοποιός διαφορά (είναι, ονομάζεται, ορίζεται ως)."
};
const NA3_DEV = [
  { m: "Ορισμός", t: "Δημοκρατία είναι το πολίτευμα στο οποίο η εξουσία πηγάζει από τον λαό και ασκείται για το συμφέρον του. Οι πολίτες εκλέγουν τους αντιπροσώπους τους, ελέγχουν τη δράση τους και έχουν ίσα δικαιώματα απέναντι στον νόμο." },
  { m: "Ορισμός", t: "Εθελοντισμός ονομάζεται η ανιδιοτελής προσφορά χρόνου και εργασίας προς όφελος του συνόλου, χωρίς υλική ανταμοιβή. Ο εθελοντής ενεργεί με δική του πρωτοβουλία, επειδή πιστεύει ότι η κοινωνία είναι υπόθεση όλων." },
  { m: "Ορισμός", t: "Καταναλωτισμός είναι η νοοτροπία που ταυτίζει την ευτυχία με την απόκτηση όλο και περισσότερων αγαθών. Δεν πρόκειται απλώς για την ανάγκη να καλύψουμε τις βιοτικές μας ανάγκες, αλλά για την ακατάσχετη επιθυμία κατανάλωσης." },
  { m: "Ορισμός", t: "Με τον όρο «ψηφιακός γραμματισμός» εννοούμε την ικανότητα να αναζητούμε, να αξιολογούμε και να χρησιμοποιούμε με κριτικό τρόπο τις πληροφορίες που βρίσκουμε στο διαδίκτυο. Περιλαμβάνει γνώσεις, δεξιότητες αλλά και στάσεις." },
  { m: "Ορισμός", t: "Ρατσισμός είναι η αντίληψη ότι ορισμένες ομάδες ανθρώπων είναι κατώτερες εξαιτίας της καταγωγής, του χρώματος ή της θρησκείας τους. Η αντίληψη αυτή εκδηλώνεται με διακρίσεις, προκαταλήψεις και, συχνά, με βία." },
  { m: "Αιτιολόγηση", t: "Η ανάγνωση βιβλίων είναι απαραίτητη για τους νέους. Κι αυτό γιατί πλουτίζει το λεξιλόγιό τους, καλλιεργεί τη φαντασία τους και τους μαθαίνει να συγκεντρώνονται για πολλή ώρα σε μια εποχή διάσπασης της προσοχής." },
  { m: "Αιτιολόγηση", t: "Το κράτος οφείλει να επενδύει στη δημόσια εκπαίδευση. Η μόρφωση, άλλωστε, είναι το πιο αποτελεσματικό μέσο για να μειωθούν οι κοινωνικές ανισότητες, αφού δίνει σε κάθε παιδί, ανεξάρτητα από την οικονομική κατάσταση της οικογένειάς του, την ευκαιρία να εξελιχθεί." },
  { m: "Αιτιολόγηση", t: "Οι εκλογές δεν αρκούν για να λειτουργήσει σωστά η δημοκρατία. Ο λόγος είναι ότι η δημοκρατία προϋποθέτει πολίτες που ενημερώνονται, συμμετέχουν στα κοινά και ελέγχουν τους εκλεγμένους και στο διάστημα ανάμεσα στις κάλπες." },
  { m: "Αιτιολόγηση", t: "Πρέπει να περιορίσουμε τη χρήση του κινητού τηλεφώνου πριν από τον ύπνο. Κι αυτό επειδή το φως της οθόνης μπερδεύει τον βιολογικό μας ρυθμό, ενώ οι συνεχείς ειδοποιήσεις κρατούν τον εγκέφαλο σε εγρήγορση τη στιγμή που χρειάζεται να ξεκουραστεί." },
  { m: "Παραδείγματα", t: "Η τεχνολογία έχει διευκολύνει θεαματικά την καθημερινότητά μας. Για παράδειγμα, πληρώνουμε τους λογαριασμούς μας με ένα κλικ, συνομιλούμε με συγγενείς στην άλλη άκρη του κόσμου και βρίσκουμε τον δρόμο μας σε μια άγνωστη πόλη μέσα σε δευτερόλεπτα." },
  { m: "Παραδείγματα", t: "Η Κύπρος έχει να επιδείξει σημαντική πολιτιστική κληρονομιά. Τα ψηφιδωτά της Πάφου, οι βυζαντινές εκκλησίες του Τροόδους και τα μεσαιωνικά κάστρα είναι μερικά μόνο δείγματα της πλούσιας ιστορίας του νησιού." },
  { m: "Παραδείγματα", t: "Πολλές μικρές πράξεις μπορούν να προστατεύσουν το περιβάλλον. Λόγου χάρη, η χρήση πάνινης τσάντας στις αγορές, το κλείσιμο της βρύσης όσο βουρτσίζουμε τα δόντια και η μετακίνηση με ποδήλατο για μικρές αποστάσεις μειώνουν αισθητά το οικολογικό μας αποτύπωμα." },
  { m: "Παραδείγματα", t: "Οι νέοι συμμετέχουν πιο ενεργά στα κοινά απ' όσο συχνά πιστεύουμε. Συγκεκριμένα, οργανώνουν καθαρισμούς παραλιών, στηρίζουν τράπεζες τροφίμων και δημιουργούν διαδικτυακές καμπάνιες για την προστασία των ζώων." },
  { m: "Σύγκριση – αντίθεση", t: "Το έντυπο και το ηλεκτρονικό βιβλίο εξυπηρετούν τον ίδιο σκοπό με διαφορετικό τρόπο. Το έντυπο προσφέρει την απτή εμπειρία της σελίδας και δεν κουράζει τα μάτια, ενώ το ηλεκτρονικό χωράει εκατοντάδες τίτλους σε μια μικρή συσκευή και κοστίζει λιγότερο." },
  { m: "Σύγκριση – αντίθεση", t: "Η ζωή στο χωριό διαφέρει αισθητά από τη ζωή στην πόλη. Στο χωριό οι ρυθμοί είναι αργοί και οι άνθρωποι γνωρίζονται μεταξύ τους· αντίθετα, στην πόλη η καθημερινότητα είναι γρήγορη και η ανωνυμία κυριαρχεί." },
  { m: "Σύγκριση – αντίθεση", t: "Η διά ζώσης διδασκαλία και η εξ αποστάσεως εκπαίδευση έχουν κοινό στόχο τη μάθηση, όμως ακολουθούν άλλους δρόμους. Η πρώτη στηρίζεται στην άμεση επαφή και στη συζήτηση μέσα στην τάξη· η δεύτερη, από την άλλη, προσφέρει ευελιξία χρόνου και τόπου, αλλά απαιτεί περισσότερη αυτοπειθαρχία." },
  { m: "Σύγκριση – αντίθεση", t: "Ο πολίτης και ο καταναλωτής δεν ταυτίζονται. Ο πολίτης σκέφτεται το κοινό καλό και κρίνει με βάση αξίες· ο καταναλωτής, απεναντίας, κινείται συχνά από την προσωπική επιθυμία της στιγμής." },
  { m: "Αναλογία", t: "Η παιδεία μοιάζει με το θεμέλιο ενός σπιτιού. Όπως ένα κτίριο χωρίς γερά θεμέλια καταρρέει με τον πρώτο σεισμό, έτσι και μια κοινωνία χωρίς παιδεία λυγίζει μπροστά στις πρώτες δυσκολίες." },
  { m: "Αναλογία", t: "Η δημοκρατία χρειάζεται συνεχή φροντίδα, όπως ακριβώς ένας κήπος. Αν ο κηπουρός σταματήσει να ποτίζει και να ξεριζώνει τα αγριόχορτα, τα λουλούδια μαραίνονται· αν οι πολίτες αδιαφορήσουν, οι θεσμοί φθείρονται." },
  { m: "Αναλογία", t: "Το διαδίκτυο είναι σαν μια τεράστια αγορά χωρίς φύλακες. Όπως στην αγορά βρίσκεις και γνήσια προϊόντα και απομιμήσεις, έτσι και στο διαδίκτυο συνυπάρχουν αξιόπιστες πληροφορίες και ψευδείς ειδήσεις· χρειάζεται έμπειρο μάτι για να τις ξεχωρίσεις." },
  { m: "Αναλογία", t: "Ο δάσκαλος λειτουργεί όπως ο φάρος για τον ναυτικό. Δεν ταξιδεύει ο ίδιος στη θέση του, αλλά φωτίζει τον δρόμο, ώστε ο μαθητής να βρει μόνος του τη σωστή πορεία." },
  { m: "Διαίρεση", t: "Η διαφήμιση διακρίνεται σε δύο βασικές κατηγορίες ανάλογα με τον σκοπό της. Η εμπορική διαφήμιση προβάλλει προϊόντα και υπηρεσίες με στόχο το κέρδος, ενώ η κοινωνική διαφήμιση ευαισθητοποιεί το κοινό για θέματα όπως η οδική ασφάλεια ή η αιμοδοσία." },
  { m: "Διαίρεση", t: "Οι πηγές ενέργειας χωρίζονται σε ανανεώσιμες και μη ανανεώσιμες. Στις πρώτες ανήκουν ο ήλιος, ο άνεμος και το νερό, που δεν εξαντλούνται· στις δεύτερες το πετρέλαιο, ο άνθρακας και το φυσικό αέριο, τα αποθέματα των οποίων κάποτε θα τελειώσουν." },
  { m: "Διαίρεση", t: "Υπάρχουν τρία είδη ανάγνωσης, ανάλογα με τον σκοπό του αναγνώστη: η ανάγνωση για ενημέρωση, η ανάγνωση για μελέτη και η ανάγνωση για ψυχαγωγία. Η καθεμιά απαιτεί διαφορετικό ρυθμό και διαφορετικό βαθμό συγκέντρωσης." },
  { m: "Διαίρεση", t: "Η βία στο σχολείο εμφανίζεται με ποικίλες μορφές. Υπάρχει η σωματική βία, η λεκτική βία με προσβολές και χλευασμό, η κοινωνική βία με την απομόνωση ενός μαθητή από την ομάδα και, τέλος, η διαδικτυακή βία μέσα από τα κοινωνικά δίκτυα." },
  { m: "Αίτιο – αποτέλεσμα", t: "Η αλόγιστη χρήση φυτοφαρμάκων και η καταστροφή των φυσικών τους χώρων έχουν μειώσει δραματικά τους πληθυσμούς των μελισσών, με αποτέλεσμα να κινδυνεύει η επικονίαση πολλών καλλιεργειών και, κατά συνέπεια, η ίδια η διατροφή μας." },
  { m: "Αίτιο – αποτέλεσμα", t: "Η συνεχής έκθεση στις οθόνες προκαλεί σοβαρές επιπτώσεις στους εφήβους. Οδηγεί σε διαταραχές ύπνου, σε μείωση της σωματικής δραστηριότητας και, συχνά, σε δυσκολίες συγκέντρωσης στο σχολείο." },
  { m: "Αίτιο – αποτέλεσμα", t: "Η αστυφιλία των τελευταίων δεκαετιών είχε σοβαρές συνέπειες για την ύπαιθρο. Τα χωριά ερήμωσαν, τα σχολεία τους έκλεισαν και πολλές παραδοσιακές τέχνες χάθηκαν, καθώς δεν υπήρχαν πια νέοι να τις συνεχίσουν." },
  { m: "Αίτιο – αποτέλεσμα", t: "Εξαιτίας της παρατεταμένης ανομβρίας, τα φράγματα του νησιού έχουν σχεδόν αδειάσει. Ως συνέπεια, οι αγρότες περιορίζουν τις καλλιέργειές τους και το κράτος αναγκάζεται να επιβάλει περικοπές στην ύδρευση." },
  { m: "Ορισμός", t: "Παραπληροφόρηση ονομάζεται η σκόπιμη διάδοση ψευδών ή παραποιημένων ειδήσεων με στόχο την παραπλάνηση του κοινού. Διαφέρει από το απλό λάθος, γιατί όποιος την προκαλεί γνωρίζει ότι αυτό που μεταδίδει δεν είναι αληθινό." },
  { m: "Παραδείγματα", t: "Η τεχνητή νοημοσύνη βρίσκει εφαρμογές σε πολλούς τομείς της ζωής μας. Στην ιατρική, βοηθά στη διάγνωση ασθενειών από ακτινογραφίες· στις μεταφορές, κινεί αυτόνομα οχήματα· στην εκπαίδευση, προσαρμόζει τις ασκήσεις στις ανάγκες κάθε μαθητή." }
];

/* 3.3 — διαρθρωτικές λέξεις (μόνο σαφείς περιπτώσεις) */
const NA3_REL = {
  "Προσθήκη": ["επιπλέον", "επίσης", "επιπρόσθετα", "πέρα από αυτό", "επιπροσθέτως"],
  "Αντίθεση – εναντίωση": ["ωστόσο", "όμως", "αντίθετα", "εντούτοις", "παρόλο που", "αν και", "μολονότι", "απεναντίας"],
  "Αιτιολόγηση": ["γιατί", "επειδή", "διότι", "εξαιτίας", "λόγω"],
  "Αποτέλεσμα – συμπέρασμα": ["επομένως", "συνεπώς", "άρα", "γι' αυτό", "κατά συνέπεια", "ως εκ τούτου"],
  "Χρονική διαδοχή": ["αρχικά", "έπειτα", "στη συνέχεια", "κατόπιν", "μόλις", "αργότερα"],
  "Παράδειγμα": ["για παράδειγμα", "λόγου χάρη", "παραδείγματος χάρη", "π.χ."],
  "Επεξήγηση – διευκρίνιση": ["δηλαδή", "με άλλα λόγια", "πιο συγκεκριμένα", "ειδικότερα"],
  "Όρος – προϋπόθεση": ["αν", "εάν", "εφόσον", "με την προϋπόθεση ότι", "υπό τον όρο ότι"],
  "Σκοπός": ["για να", "προκειμένου να", "με σκοπό να"],
  "Ανακεφαλαίωση – κατακλείδα": ["συνοψίζοντας", "συμπερασματικά", "εν κατακλείδι", "εν ολίγοις", "συνολικά"],
  "Έμφαση": ["κυρίως", "ιδιαίτερα", "πρωτίστως", "πάνω απ' όλα", "προπάντων"],
  "Απαρίθμηση – διάταξη": ["πρώτον", "δεύτερον", "καταρχάς", "αφενός… αφετέρου"]
};
/* ζεύγη περιόδων με κενό: r = σχέση, a = σωστός σύνδεσμος (όπως γράφεται στην πρόταση) */
const NA3_GAP = [
  { a: "Ωστόσο", r: "Αντίθεση – εναντίωση", s: "Η τεχνολογία διευκολύνει την επικοινωνία μας. ___, συχνά μας απομονώνει από τους ανθρώπους που βρίσκονται δίπλα μας." },
  { a: "Επομένως", r: "Αποτέλεσμα – συμπέρασμα", s: "Οι πόροι του πλανήτη δεν είναι ανεξάντλητοι. ___, οφείλουμε να τους διαχειριζόμαστε με σύνεση." },
  { a: "Επιπλέον", r: "Προσθήκη", s: "Ο αθλητισμός βελτιώνει τη φυσική κατάσταση. ___, καλλιεργεί την ομαδικότητα και την πειθαρχία." },
  { a: "Για παράδειγμα", r: "Παράδειγμα", s: "Πολλά επαγγέλματα έχουν αλλάξει ριζικά τα τελευταία χρόνια. ___, οι λογιστές χρησιμοποιούν πλέον λογισμικό που κάνει αυτόματα τους υπολογισμούς." },
  { a: "επειδή", r: "Αιτιολόγηση", s: "Οι μαθητές δυσκολεύονται συχνά στις εξετάσεις ___ δεν έχουν οργανώσει έγκαιρα τη μελέτη τους." },
  { a: "Δηλαδή", r: "Επεξήγηση – διευκρίνιση", s: "Ο συγγραφέας χρησιμοποιεί επίκληση στην αυθεντία. ___, στηρίζει τη θέση του στη γνώμη ενός αναγνωρισμένου ειδικού." },
  { a: "Αν", r: "Όρος – προϋπόθεση", s: "___ δεν προστατεύσουμε τα δάση, οι επόμενες γενιές θα ζήσουν σε έναν φτωχότερο πλανήτη." },
  { a: "για να", r: "Σκοπός", s: "Το σχολείο οργανώνει εκδρομές στη φύση ___ γνωρίσουν οι μαθητές από κοντά το φυσικό περιβάλλον." },
  { a: "Συνοψίζοντας", r: "Ανακεφαλαίωση – κατακλείδα", s: "Είδαμε τα οφέλη και τους κινδύνους του διαδικτύου για τους εφήβους. ___, το διαδίκτυο μπορεί να μορφώσει αλλά και να εξαπατήσει· όλα εξαρτώνται από την κριτική στάση του χρήστη." },
  { a: "Αρχικά", r: "Χρονική διαδοχή", s: "___, οι μαθητές συγκέντρωσαν πληροφορίες για το θέμα· στη συνέχεια, τις οργάνωσαν σε μια παρουσίαση." },
  { a: "Παρόλο που", r: "Αντίθεση – εναντίωση", s: "___ οι κίνδυνοι του καπνίσματος είναι γνωστοί, πολλοί νέοι εξακολουθούν να καπνίζουν." },
  { a: "Γι' αυτό", r: "Αποτέλεσμα – συμπέρασμα", s: "Η γνώση ξένων γλωσσών είναι σήμερα απαραίτητη στην αγορά εργασίας. ___ όλο και περισσότεροι νέοι παρακολουθούν μαθήματα γλωσσών." },
  { a: "Εξάλλου", r: "Προσθήκη", s: "Δεν αξίζει να αγοράσουμε κάτι που δεν χρειαζόμαστε μόνο επειδή είναι σε προσφορά. ___, κάθε περιττή αγορά επιβαρύνει και το περιβάλλον." },
  { a: "Αντίθετα", r: "Αντίθεση – εναντίωση", s: "Ο βιαστικός αναγνώστης πιστεύει ό,τι συναντά στο διαδίκτυο. ___, ο προσεκτικός αναγνώστης διασταυρώνει τις πηγές πριν σχηματίσει γνώμη." },
  { a: "διότι", r: "Αιτιολόγηση", s: "Η συμμετοχή στις εκλογές είναι υποχρέωση κάθε πολίτη, ___ μέσω αυτής διαμορφώνεται το μέλλον του τόπου." },
  { a: "Κυρίως", r: "Έμφαση", s: "Η παραπληροφόρηση βλάπτει όλους μας. ___ όμως πλήττει τις ευάλωτες ομάδες, που δεν έχουν τα εφόδια να ελέγξουν τις πληροφορίες." },
  { a: "Καταρχάς", r: "Απαρίθμηση – διάταξη", s: "Τα οφέλη του εθελοντισμού είναι πολλά. ___, ο εθελοντής νιώθει χρήσιμος· επιπλέον, γνωρίζει νέους ανθρώπους." },
  { a: "Συνεπώς", r: "Αποτέλεσμα – συμπέρασμα", s: "Τα περισσότερα τροχαία οφείλονται στην υπερβολική ταχύτητα. ___, οι αυστηρότεροι έλεγχοι μπορούν να σώσουν ζωές." },
  { a: "Λόγου χάρη", r: "Παράδειγμα", s: "Η παράδοση επιβιώνει με πολλούς τρόπους στη σύγχρονη ζωή. ___, οι νέοι μαθαίνουν και πάλι παραδοσιακούς χορούς στους πολιτιστικούς συλλόγους." },
  { a: "εφόσον", r: "Όρος – προϋπόθεση", s: "Η τεχνητή νοημοσύνη μπορεί να βοηθήσει την εκπαίδευση, ___ χρησιμοποιείται με μέτρο και με την καθοδήγηση του εκπαιδευτικού." },
  { a: "προκειμένου να", r: "Σκοπός", s: "Η κυβέρνηση ανακοίνωσε κίνητρα για τις μικρές επιχειρήσεις ___ στηριχτεί η τοπική οικονομία." },
  { a: "Με άλλα λόγια", r: "Επεξήγηση – διευκρίνιση", s: "Η φίλη μου είναι πολύγλωσση. ___, μιλά άνετα πέντε γλώσσες." },
  { a: "Στη συνέχεια", r: "Χρονική διαδοχή", s: "Οι εθελοντές έφτασαν στην παραλία νωρίς το πρωί. ___ χωρίστηκαν σε ομάδες και ξεκίνησαν τον καθαρισμό." },
  { a: "Εν κατακλείδι", r: "Ανακεφαλαίωση – κατακλείδα", s: "Εξετάσαμε τον ρόλο του κράτους, των σχολείων και των πολιτών στην προστασία του περιβάλλοντος. ___, η προστασία του περιβάλλοντος δεν είναι υπόθεση μόνο των κυβερνήσεων αλλά ευθύνη κάθε πολίτη." },
  { a: "Εντούτοις", r: "Αντίθεση – εναντίωση", s: "Οι ειδικοί προειδοποιούν εδώ και δεκαετίες για την κλιματική αλλαγή. ___, τα μέτρα που λαμβάνονται παραμένουν ανεπαρκή." },
  { a: "καθώς", r: "Αιτιολόγηση", s: "Το εμπόριο από το διαδίκτυο αυξάνεται συνεχώς, ___ προσφέρει άνεση και χαμηλότερες τιμές." },
  { a: "Επιπρόσθετα", r: "Προσθήκη", s: "Η ανάγνωση εμπλουτίζει το λεξιλόγιο. ___, βοηθά τον αναγνώστη να κατανοήσει καλύτερα τον εαυτό του και τους άλλους." },
  { a: "Πάνω απ' όλα", r: "Έμφαση", s: "Ένας καλός δάσκαλος χρειάζεται γνώσεις και μεθοδικότητα. ___ όμως χρειάζεται αγάπη για τα παιδιά." },
  { a: "Κατά συνέπεια", r: "Αποτέλεσμα – συμπέρασμα", s: "Ο πληθυσμός των πόλεων αυξάνεται ραγδαία. ___, οι ανάγκες για στέγη, νερό και μεταφορές πολλαπλασιάζονται." },
  { a: "Αν και", r: "Αντίθεση – εναντίωση", s: "___ η ομάδα έχασε τον αγώνα, οι παίκτες χειροκροτήθηκαν για την προσπάθειά τους." }
];


const NA3_STARTW = { "Αντίθεση – εναντίωση": ["Ωστόσο", "Όμως", "Αντίθετα"], "Αποτέλεσμα – συμπέρασμα": ["Επομένως", "Συνεπώς", "Άρα"], "Παράδειγμα": ["Για παράδειγμα", "Λόγου χάρη"], "Προσθήκη": ["Επιπλέον", "Επίσης"], "Όρος – προϋπόθεση": ["Αν"], "Αιτιολόγηση": ["Επειδή"], "Χρονική διαδοχή": ["Έπειτα", "Αργότερα"], "Ανακεφαλαίωση – κατακλείδα": ["Συνοψίζοντας"], "Επεξήγηση – διευκρίνιση": ["Δηλαδή"] };
const NA3_NEAR = { "Αποτέλεσμα – συμπέρασμα": ["Προσθήκη", "Ανακεφαλαίωση – κατακλείδα"], "Ανακεφαλαίωση – κατακλείδα": ["Αποτέλεσμα – συμπέρασμα"], "Έμφαση": ["Προσθήκη"], "Επεξήγηση – διευκρίνιση": ["Αποτέλεσμα – συμπέρασμα", "Προσθήκη", "Παράδειγμα"], "Παράδειγμα": ["Επεξήγηση – διευκρίνιση"], "Απαρίθμηση – διάταξη": ["Προσθήκη", "Χρονική διαδοχή"], "Χρονική διαδοχή": ["Προσθήκη", "Απαρίθμηση – διάταξη"], "Προσθήκη": ["Χρονική διαδοχή", "Έμφαση"] };
/* λάθος επιλογές για κενό: στην αρχή περιόδου λέξεις άλλων σχέσεων, στη μέση λέξεις που δεν ταιριάζουν γραμματικά/νοηματικά */
function na3GapOpts(g) {
  const start = g.s.startsWith("___") || /\.\s___/.test(g.s);
  if (!start) return na3Sh(["για παράδειγμα", "ωστόσο", "επομένως", "επιπλέον", "με άλλα λόγια"].filter(w => !NA3_REL[g.r].includes(w))).slice(0, 3);
  const bad = new Set([g.r].concat(NA3_NEAR[g.r] || []));
  return na3Sh(Object.keys(NA3_STARTW).filter(r => !bad.has(r))).slice(0, 3).map(r => na3Pick(NA3_STARTW[r]));
}

/* 3.4 — γλώσσα αφήγησης / επιχειρηματολογίας / περιγραφής: χαρακτηριστικά */
const NA3_LANGF = [
  { f: "Κυριαρχούν οι παρελθοντικοί χρόνοι (αόριστος, παρατατικός, υπερσυντέλικος).", a: "Αφήγηση" },
  { f: "Υπάρχουν χρονικοί δείκτες που δηλώνουν διαδοχή γεγονότων (εκείνο το πρωί, ύστερα, την επόμενη μέρα).", a: "Αφήγηση" },
  { f: "Ρήματα κίνησης και δράσης δίνουν γρήγορο ρυθμό στο κείμενο.", a: "Αφήγηση" },
  { f: "Παρουσιάζονται πρόσωπα που δρουν σε συγκεκριμένο τόπο και χρόνο.", a: "Αφήγηση" },
  { f: "Ο γράφων παρουσιάζει σε α΄ πρόσωπο, με τη σειρά που συνέβησαν, γεγονότα που έζησε ο ίδιος.", a: "Αφήγηση" },
  { f: "Υπάρχει πλοκή: αρχική κατάσταση, εξέλιξη, κορύφωση, λύση.", a: "Αφήγηση" },
  { f: "Κυριαρχεί ο ενεστώτας με διαχρονική ή γνωμική σημασία (η παιδεία καλλιεργεί, ο άνθρωπος χρειάζεται).", a: "Επιχειρηματολογία" },
  { f: "Λογικοί σύνδεσμοι αιτίου – αποτελέσματος (επειδή, συνεπώς, άρα, γι' αυτό).", a: "Επιχειρηματολογία" },
  { f: "Ο συγγραφέας διατυπώνει μια θέση και τη στηρίζει με επιχειρήματα και τεκμήρια.", a: "Επιχειρηματολογία" },
  { f: "Αφηρημένο λεξιλόγιο και όροι (ελευθερία, κοινωνική ευθύνη, καταναλωτισμός).", a: "Επιχειρηματολογία" },
  { f: "Αναιρείται μια αντίθετη άποψη (Ορισμένοι υποστηρίζουν ότι… Ωστόσο…).", a: "Επιχειρηματολογία" },
  { f: "Χρήση στατιστικών στοιχείων, ερευνών και γνώμης ειδικών.", a: "Επιχειρηματολογία" },
  { f: "Ρητορικά ερωτήματα που προκαλούν τον αναγνώστη να σκεφτεί.", a: "Επιχειρηματολογία" },
  { f: "Πλήθος επιθέτων και επιρρηματικών προσδιορισμών τόπου (στα δεξιά, πίσω από, ψηλά).", a: "Περιγραφή" },
  { f: "Αισθητηριακές εικόνες: χρώματα, ήχοι, μυρωδιές, υφές.", a: "Περιγραφή" },
  { f: "Ρήματα στάσης και κατάστασης (βρίσκεται, απλώνεται, υψώνεται, φαίνεται).", a: "Περιγραφή" },
  { f: "Ο χρόνος «σταματά»: το κείμενο παρουσιάζει πώς είναι ένας χώρος ή ένα πρόσωπο, όχι τι συνέβη.", a: "Περιγραφή" },
  { f: "Παρομοιώσεις και μεταφορές που ζωντανεύουν έναν τόπο (ο λόφος μοιάζει με κοιμισμένο ζώο).", a: "Περιγραφή" }
];
/* πρωτότυπα σύντομα αποσπάσματα για αναγνώριση κειμενικού τύπου */
const NA3_LANGS = [
  { t: "Εκείνο το πρωί ξύπνησα πριν χαράξει. Ντύθηκα βιαστικά, άρπαξα την τσάντα μου και έτρεξα στη στάση. Το λεωφορείο είχε μόλις φύγει.", a: "Αφήγηση" },
  { t: "Όταν ο παππούς άνοιξε το παλιό σεντούκι, μια μυρωδιά από ναφθαλίνη γέμισε το δωμάτιο. Έβγαλε προσεκτικά ένα κιτρινισμένο γράμμα και άρχισε να διαβάζει δυνατά.", a: "Αφήγηση" },
  { t: "Την επόμενη μέρα, η Ελένη πήγε στον διευθυντή και του ανακοίνωσε την απόφασή της. Εκείνος την κοίταξε για λίγο σιωπηλός και ύστερα της έσφιξε το χέρι.", a: "Αφήγηση" },
  { t: "Στο τέλος του αγώνα, οι παίκτες έπεσαν εξαντλημένοι στο χορτάρι. Κανείς δεν μιλούσε. Μόνο ο προπονητής πλησίασε και τους χτύπησε έναν έναν στην πλάτη.", a: "Αφήγηση" },
  { t: "Η παιδεία δεν μπορεί να περιορίζεται στη μετάδοση γνώσεων. Αν το σχολείο δεν καλλιεργεί την κριτική σκέψη, οι μαθητές θα μείνουν ανυπεράσπιστοι απέναντι στην παραπληροφόρηση.", a: "Επιχειρηματολογία" },
  { t: "Ορισμένοι υποστηρίζουν ότι η διαφήμιση απλώς ενημερώνει. Ωστόσο, οι περισσότερες διαφημίσεις δεν περιγράφουν το προϊόν· πουλάνε ένα όνειρο.", a: "Επιχειρηματολογία" },
  { t: "Σύμφωνα με πρόσφατη έρευνα, οι έφηβοι περνούν κατά μέσο όρο πάνω από έξι ώρες την ημέρα μπροστά σε οθόνες. Μπορούμε άραγε να μιλάμε για ελεύθερη επιλογή ή μήπως για εξάρτηση;", a: "Επιχειρηματολογία" },
  { t: "Η προστασία του περιβάλλοντος δεν είναι πολυτέλεια αλλά ανάγκη. Χωρίς καθαρό νερό και αέρα, καμία οικονομική ανάπτυξη δεν έχει νόημα.", a: "Επιχειρηματολογία" },
  { t: "Η μικρή πλατεία απλώνεται κάτω από έναν τεράστιο πλάτανο. Γύρω της, χαμηλά πέτρινα σπίτια με γαλάζια παράθυρα, και στη μέση μια βρύση που κελαρύζει ασταμάτητα.", a: "Περιγραφή" },
  { t: "Το δωμάτιο ήταν μικρό και φωτεινό. Στον τοίχο απέναντι από το παράθυρο κρεμόταν ένας χάρτης με κόκκινες πινέζες, και κάτω από αυτόν ένα γραφείο γεμάτο βιβλία.", a: "Περιγραφή" },
  { t: "Η θάλασσα, γυαλιστερή σαν λάδι, ακουμπά απαλά στα βότσαλα. Στον ορίζοντα, το νησάκι μοιάζει με κοιμισμένη χελώνα.", a: "Περιγραφή" },
  { t: "Ο γέρος ψαράς είχε πρόσωπο σκαμμένο από τον ήλιο και χέρια σκληρά σαν ξύλο. Τα μάτια του, όμως, έλαμπαν γαλάζια σαν παιδιού.", a: "Περιγραφή" },
  { t: "Τα μέσα κοινωνικής δικτύωσης δεν είναι από μόνα τους καλά ή κακά. Η αξία τους εξαρτάται από τη χρήση που κάνουμε: μπορούν να γίνουν εργαλείο ενημέρωσης ή παγίδα απομόνωσης.", a: "Επιχειρηματολογία" },
  { t: "Μόλις χτύπησε το κουδούνι, τα παιδιά ξεχύθηκαν στην αυλή. Ο Μάριος έτρεξε πρώτος στο γήπεδο και κράτησε την μπάλα για τον εαυτό του.", a: "Αφήγηση" },
  { t: "Το παλιό σχολείο του χωριού είναι ένα λιθόκτιστο κτίριο με κεραμιδένια στέγη. Στην αυλή του υψώνεται ακόμη το σιδερένιο κοντάρι της σημαίας, σκουριασμένο από τα χρόνια.", a: "Περιγραφή" },
  { t: "Κάθε πολίτης έχει υποχρέωση να ενημερώνεται από αξιόπιστες πηγές. Γιατί η δημοκρατία λειτουργεί μόνο όταν οι αποφάσεις στηρίζονται σε σωστή πληροφόρηση.", a: "Επιχειρηματολογία" }
];

/* 4.1 — κυριολεξία / μεταφορά: m = true αν η υπογραμμισμένη φράση είναι μεταφορική */
const NA3_MET = [
  { s: "Ο μαθητής [[έλυσε]] την άσκηση σε δέκα λεπτά.", m: false, e: "δηλωτική σημασία: βρήκε τη λύση." },
  { s: "Η κυβέρνηση [[έλυσε τα χέρια]] των δημάρχων με τον νέο νόμο.", m: true, e: "τους έδωσε ελευθερία κινήσεων." },
  { s: "Πριν από τις εξετάσεις ο μαθητής [[πνίγεται]] στις υποχρεώσεις.", m: true, e: "έχει υπερβολικά πολλές υποχρεώσεις και δεν προλαβαίνει." },
  { s: "Το παιδί [[κρατούσε]] σφιχτά το χέρι της μητέρας του.", m: false, e: "δηλωτική σημασία: κρατούσε με το χέρι." },
  { s: "Η ανεργία είναι [[πληγή]] για την κοινωνία μας.", m: true, e: "σοβαρό πρόβλημα που προκαλεί πόνο." },
  { s: "Ο γιατρός καθάρισε προσεκτικά την [[πληγή]] στο γόνατο.", m: false, e: "δηλωτική σημασία: τραύμα." },
  { s: "Η εκπαίδευση είναι το [[κλειδί]] για ένα καλύτερο μέλλον.", m: true, e: "το μέσο που ανοίγει δυνατότητες." },
  { s: "Ξέχασα το [[κλειδί]] του σπιτιού στο γραφείο.", m: false, e: "δηλωτική σημασία: αντικείμενο." },
  { s: "Οι ψευδείς ειδήσεις [[φουντώνουν]] στο διαδίκτυο μέσα σε λίγες ώρες.", m: true, e: "διαδίδονται πολύ γρήγορα και ανεξέλεγκτα (όπως μια φωτιά που φουντώνει)." },
  { s: "Η [[φωτιά]] έκαψε εκατοντάδες στρέμματα δάσους.", m: false, e: "δηλωτική σημασία: πυρκαγιά." },
  { s: "Ο νέος υπουργός [[πήρε το τιμόνι]] της οικονομίας.", m: true, e: "ανέλαβε την καθοδήγηση." },
  { s: "Ο οδηγός [[κράτησε το τιμόνι]] με τα δύο χέρια.", m: false, e: "δηλωτική σημασία." },
  { s: "Η κοινωνία μας [[διψά]] για αξιοκρατία.", m: true, e: "επιθυμεί έντονα." },
  { s: "Μετά τον αγώνα [[διψούσα]] τόσο που ήπια δύο μπουκάλια νερό.", m: false, e: "δηλωτική σημασία." },
  { s: "Οι νέοι είναι οι [[σπόροι]] του αύριο.", m: true, e: "από αυτούς θα «φυτρώσει» το μέλλον." },
  { s: "Ο αγρότης έσπειρε [[σπόρους]] σιταριού στο χωράφι.", m: false, e: "δηλωτική σημασία." },
  { s: "Η είδηση ήταν [[κεραυνός εν αιθρία]] για την οικογένεια.", m: true, e: "κάτι απρόσμενο και συγκλονιστικό." },
  { s: "Ένας [[κεραυνός]] χτύπησε το καμπαναριό της εκκλησίας.", m: false, e: "δηλωτική σημασία." },
  { s: "Ο συγγραφέας [[ρίχνει φως]] σε μια άγνωστη πτυχή της ιστορίας.", m: true, e: "διαφωτίζει, κάνει κατανοητό." },
  { s: "Η λάμπα [[ρίχνει φως]] στο γραφείο.", m: false, e: "δηλωτική σημασία." },
  { s: "Η διαφήμιση [[χτίζει]] την εικόνα ενός προϊόντος.", m: true, e: "δημιουργεί σταδιακά." },
  { s: "Οι εργάτες [[χτίζουν]] ένα νέο σχολείο.", m: false, e: "δηλωτική σημασία." },
  { s: "Η ελπίδα [[ανθίζει]] ξανά στις καρδιές των πολιτών.", m: true, e: "αναγεννιέται, μεγαλώνει." },
  { s: "Οι αμυγδαλιές [[ανθίζουν]] τον Φεβρουάριο.", m: false, e: "δηλωτική σημασία." },
  { s: "Ο πολιτικός [[έπαιξε με τα συναισθήματα]] των ψηφοφόρων.", m: true, e: "τα εκμεταλλεύτηκε." },
  { s: "Ο σκύλος [[έπαιζε]] με το μπαλάκι στην αυλή.", m: false, e: "δηλωτική σημασία." },
  { s: "Ο χρόνος [[κυλά]] γρήγορα όταν περνάμε όμορφα.", m: true, e: "περνά (ο χρόνος παρουσιάζεται σαν νερό ή τροχός)." },
  { s: "Η μπάλα [[κύλησε]] κάτω από το αυτοκίνητο.", m: false, e: "δηλωτική σημασία." },
  { s: "Η πόλη [[ξυπνά]] με τον θόρυβο της κίνησης.", m: true, e: "ζωντανεύει (προσωποποίηση)." },
  { s: "Το μωρό [[ξύπνησε]] στις έξι το πρωί.", m: false, e: "δηλωτική σημασία." },
  { s: "Τα μέσα κοινωνικής δικτύωσης έχουν γίνει ένας [[καθρέφτης]] της κοινωνίας.", m: true, e: "αντανακλούν τις αξίες και τα προβλήματά της." },
  { s: "Κοιτάχτηκε στον [[καθρέφτη]] πριν βγει από το σπίτι.", m: false, e: "δηλωτική σημασία." }
];

/* 4.2 — ενεργητική / παθητική σύνταξη: s υποκείμενο, v ρήμα, o αντικείμενο, ps/pv/pa = παθητική, rv = λάθος (αντιστροφή ρόλων), wt = λάθος χρόνος */
const NA3_VOICE = [
  { s: "Οι πολίτες", v: "εξέλεξαν", o: "τον νέο δήμαρχο", ps: "Ο νέος δήμαρχος", pv: "εκλέχτηκε", pa: "από τους πολίτες", rv: "Οι πολίτες εκλέχτηκαν από τον νέο δήμαρχο", wt: "Ο νέος δήμαρχος εκλέγεται από τους πολίτες" },
  { s: "Η Βουλή", v: "ψήφισε", o: "τον νέο νόμο", ps: "Ο νέος νόμος", pv: "ψηφίστηκε", pa: "από τη Βουλή", rv: "Η Βουλή ψηφίστηκε από τον νέο νόμο", wt: "Ο νέος νόμος θα ψηφιστεί από τη Βουλή" },
  { s: "Οι μαθητές", v: "οργάνωσαν", o: "την εκδήλωση", ps: "Η εκδήλωση", pv: "οργανώθηκε", pa: "από τους μαθητές", rv: "Οι μαθητές οργανώθηκαν από την εκδήλωση", wt: "Η εκδήλωση οργανώνεται από τους μαθητές" },
  { s: "Η διαφήμιση", v: "επηρεάζει", o: "τους καταναλωτές", ps: "Οι καταναλωτές", pv: "επηρεάζονται", pa: "από τη διαφήμιση", rv: "Η διαφήμιση επηρεάζεται από τους καταναλωτές", wt: "Οι καταναλωτές επηρεάστηκαν από τη διαφήμιση" },
  { s: "Οι επιστήμονες", v: "ανακάλυψαν", o: "ένα νέο φάρμακο", ps: "Ένα νέο φάρμακο", pv: "ανακαλύφθηκε", pa: "από τους επιστήμονες", rv: "Οι επιστήμονες ανακαλύφθηκαν από ένα νέο φάρμακο", wt: "Ένα νέο φάρμακο ανακαλύπτεται από τους επιστήμονες" },
  { s: "Η πυροσβεστική", v: "έσβησε", o: "τη φωτιά", ps: "Η φωτιά", pv: "σβήστηκε", pa: "από την πυροσβεστική", rv: "Η πυροσβεστική σβήστηκε από τη φωτιά", wt: "Η φωτιά σβήνεται από την πυροσβεστική" },
  { s: "Ο δήμος", v: "θα ανακαινίσει", o: "το πάρκο", ps: "Το πάρκο", pv: "θα ανακαινιστεί", pa: "από τον δήμο", rv: "Ο δήμος θα ανακαινιστεί από το πάρκο", wt: "Το πάρκο ανακαινίστηκε από τον δήμο" },
  { s: "Οι εθελοντές", v: "καθάρισαν", o: "την παραλία", ps: "Η παραλία", pv: "καθαρίστηκε", pa: "από τους εθελοντές", rv: "Οι εθελοντές καθαρίστηκαν από την παραλία", wt: "Η παραλία θα καθαριστεί από τους εθελοντές" },
  { s: "Ο συγγραφέας", v: "έγραψε", o: "το μυθιστόρημα", ps: "Το μυθιστόρημα", pv: "γράφτηκε", pa: "από τον συγγραφέα", rv: "Ο συγγραφέας γράφτηκε από το μυθιστόρημα", wt: "Το μυθιστόρημα γράφεται από τον συγγραφέα" },
  { s: "Η αστυνομία", v: "συνέλαβε", o: "τους δράστες", ps: "Οι δράστες", pv: "συνελήφθησαν", pa: "από την αστυνομία", rv: "Η αστυνομία συνελήφθη από τους δράστες", wt: "Οι δράστες συλλαμβάνονται από την αστυνομία" },
  { s: "Η τεχνολογία", v: "διευκολύνει", o: "την επικοινωνία", ps: "Η επικοινωνία", pv: "διευκολύνεται", pa: "από την τεχνολογία", rv: "Η τεχνολογία διευκολύνεται από την επικοινωνία", wt: "Η επικοινωνία διευκολύνθηκε από την τεχνολογία" },
  { s: "Ο καθηγητής", v: "διόρθωσε", o: "τα γραπτά", ps: "Τα γραπτά", pv: "διορθώθηκαν", pa: "από τον καθηγητή", rv: "Ο καθηγητής διορθώθηκε από τα γραπτά", wt: "Τα γραπτά διορθώνονται από τον καθηγητή" },
  { s: "Οι αγρότες", v: "καλλιεργούν", o: "τα χωράφια", ps: "Τα χωράφια", pv: "καλλιεργούνται", pa: "από τους αγρότες", rv: "Οι αγρότες καλλιεργούνται από τα χωράφια", wt: "Τα χωράφια καλλιεργήθηκαν από τους αγρότες" },
  { s: "Η Βουλή", v: "ενέκρινε", o: "τον προϋπολογισμό", ps: "Ο προϋπολογισμός", pv: "εγκρίθηκε", pa: "από τη Βουλή", rv: "Η Βουλή εγκρίθηκε από τον προϋπολογισμό", wt: "Ο προϋπολογισμός εγκρίνεται από τη Βουλή" },
  { s: "Οι γονείς", v: "στηρίζουν", o: "τα παιδιά", ps: "Τα παιδιά", pv: "στηρίζονται", pa: "από τους γονείς", rv: "Οι γονείς στηρίζονται από τα παιδιά", wt: "Τα παιδιά στηρίχτηκαν από τους γονείς" },
  { s: "Η εταιρεία", v: "προσέλαβε", o: "δέκα νέους υπαλλήλους", ps: "Δέκα νέοι υπάλληλοι", pv: "προσλήφθηκαν", pa: "από την εταιρεία", rv: "Η εταιρεία προσλήφθηκε από δέκα νέους υπαλλήλους", wt: "Δέκα νέοι υπάλληλοι προσλαμβάνονται από την εταιρεία" },
  { s: "Ο σεισμός", v: "κατέστρεψε", o: "πολλά σπίτια", ps: "Πολλά σπίτια", pv: "καταστράφηκαν", pa: "από τον σεισμό", rv: "Ο σεισμός καταστράφηκε από πολλά σπίτια", wt: "Πολλά σπίτια καταστρέφονται από τον σεισμό" },
  { s: "Το υπουργείο", v: "ανακοίνωσε", o: "τα αποτελέσματα", ps: "Τα αποτελέσματα", pv: "ανακοινώθηκαν", pa: "από το υπουργείο", rv: "Το υπουργείο ανακοινώθηκε από τα αποτελέσματα", wt: "Τα αποτελέσματα ανακοινώνονται από το υπουργείο" },
  { s: "Οι ειδικοί", v: "μελετούν", o: "το φαινόμενο", ps: "Το φαινόμενο", pv: "μελετάται", pa: "από τους ειδικούς", rv: "Οι ειδικοί μελετώνται από το φαινόμενο", wt: "Το φαινόμενο μελετήθηκε από τους ειδικούς" },
  { s: "Οι τουρίστες", v: "επισκέπτονται", o: "τα μουσεία", ps: "Τα μουσεία", pv: "επισκέπτονται", pa: "από τους τουρίστες", rv: "", wt: "", dep: true },
  { s: "Η ρύπανση", v: "απειλεί", o: "τα οικοσυστήματα", ps: "Τα οικοσυστήματα", pv: "απειλούνται", pa: "από τη ρύπανση", rv: "Η ρύπανση απειλείται από τα οικοσυστήματα", wt: "Τα οικοσυστήματα απειλήθηκαν από τη ρύπανση" },
  { s: "Οι δημοσιογράφοι", v: "αποκάλυψαν", o: "το σκάνδαλο", ps: "Το σκάνδαλο", pv: "αποκαλύφθηκε", pa: "από τους δημοσιογράφους", rv: "Οι δημοσιογράφοι αποκαλύφθηκαν από το σκάνδαλο", wt: "Το σκάνδαλο αποκαλύπτεται από τους δημοσιογράφους" },
  { s: "Η επιτροπή", v: "θα αξιολογήσει", o: "τις αιτήσεις", ps: "Οι αιτήσεις", pv: "θα αξιολογηθούν", pa: "από την επιτροπή", rv: "Η επιτροπή θα αξιολογηθεί από τις αιτήσεις", wt: "Οι αιτήσεις αξιολογήθηκαν από την επιτροπή" },
  { s: "Ο διευθυντής", v: "βράβευσε", o: "τους αριστούχους", ps: "Οι αριστούχοι", pv: "βραβεύτηκαν", pa: "από τον διευθυντή", rv: "Ο διευθυντής βραβεύτηκε από τους αριστούχους", wt: "Οι αριστούχοι βραβεύονται από τον διευθυντή" },
  { s: "Οι πλημμύρες", v: "προκάλεσαν", o: "μεγάλες ζημιές", ps: "Μεγάλες ζημιές", pv: "προκλήθηκαν", pa: "από τις πλημμύρες", rv: "Οι πλημμύρες προκλήθηκαν από μεγάλες ζημιές", wt: "Μεγάλες ζημιές προκαλούνται από τις πλημμύρες" },
  { s: "Το κοινό", v: "χειροκρότησε", o: "τους ηθοποιούς", ps: "Οι ηθοποιοί", pv: "χειροκροτήθηκαν", pa: "από το κοινό", rv: "Το κοινό χειροκροτήθηκε από τους ηθοποιούς", wt: "Οι ηθοποιοί χειροκροτούνται από το κοινό" },
  { s: "Η μητέρα", v: "μαγείρεψε", o: "το φαγητό", ps: "Το φαγητό", pv: "μαγειρεύτηκε", pa: "από τη μητέρα", rv: "Η μητέρα μαγειρεύτηκε από το φαγητό", wt: "Το φαγητό μαγειρεύεται από τη μητέρα" },
  { s: "Οι αρχαιολόγοι", v: "έφεραν στο φως", o: "ένα αρχαίο ψηφιδωτό", ps: "Ένα αρχαίο ψηφιδωτό", pv: "ήρθε στο φως", pa: "χάρη στους αρχαιολόγους", rv: "", wt: "", dep: true },
  { s: "Οι υπάλληλοι", v: "εξυπηρετούν", o: "τους πελάτες", ps: "Οι πελάτες", pv: "εξυπηρετούνται", pa: "από τους υπαλλήλους", rv: "Οι υπάλληλοι εξυπηρετούνται από τους πελάτες", wt: "Οι πελάτες εξυπηρετήθηκαν από τους υπαλλήλους" },
  { s: "Η ομάδα", v: "κέρδισε", o: "το πρωτάθλημα", ps: "Το πρωτάθλημα", pv: "κερδήθηκε", pa: "από την ομάδα", rv: "Η ομάδα κερδήθηκε από το πρωτάθλημα", wt: "Το πρωτάθλημα κερδίζεται από την ομάδα" },
  { s: "Τα κράτη-μέλη", v: "υπέγραψαν", o: "τη συμφωνία", ps: "Η συμφωνία", pv: "υπογράφτηκε", pa: "από τα κράτη-μέλη", rv: "Τα κράτη-μέλη υπογράφτηκαν από τη συμφωνία", wt: "Η συμφωνία υπογράφεται από τα κράτη-μέλη" },
  { s: "Ο ήλιος", v: "θερμαίνει", o: "τη γη", ps: "Η γη", pv: "θερμαίνεται", pa: "από τον ήλιο", rv: "Ο ήλιος θερμαίνεται από τη γη", wt: "Η γη θερμάνθηκε από τον ήλιο" }
].filter(x => !x.dep);
const na3Act = x => `${x.s} ${x.v} ${x.o}.`;
const na3Pas = x => `${x.ps} ${x.pv} ${x.pa}.`;

/* 4.3 — παράταξη / υπόταξη / ασύνδετο */
const NA3_SYN = [
  { s: "Ο ήλιος έδυσε και η πλατεία άδειασε.", a: "Παράταξη με σύνδεσμο" },
  { s: "Μελέτησε πολύ, αλλά δεν πέτυχε τον στόχο του.", a: "Παράταξη με σύνδεσμο" },
  { s: "Ή θα αλλάξουμε συνήθειες ή θα πληρώσουμε ακριβά τις συνέπειες.", a: "Παράταξη με σύνδεσμο" },
  { s: "Ούτε ενημερώνεται ούτε συμμετέχει στα κοινά.", a: "Παράταξη με σύνδεσμο" },
  { s: "Η κατάσταση είναι δύσκολη, όμως υπάρχουν λύσεις.", a: "Παράταξη με σύνδεσμο" },
  { s: "Άκουσε την είδηση και έφυγε αμέσως για το νοσοκομείο.", a: "Παράταξη με σύνδεσμο" },
  { s: "Επειδή έβρεχε, η εκδρομή αναβλήθηκε.", a: "Υπόταξη" },
  { s: "Όταν τελείωσε η παράσταση, το κοινό σηκώθηκε όρθιο.", a: "Υπόταξη" },
  { s: "Αν προστατεύσουμε τα δάση, θα προστατεύσουμε και το μέλλον μας.", a: "Υπόταξη" },
  { s: "Πιστεύω ότι η παιδεία είναι το πολυτιμότερο αγαθό.", a: "Υπόταξη" },
  { s: "Οι νέοι που συμμετέχουν στον εθελοντισμό αποκτούν πολύτιμες εμπειρίες.", a: "Υπόταξη" },
  { s: "Διάβαζε κάθε βράδυ για να πετύχει στις εξετάσεις.", a: "Υπόταξη" },
  { s: "Παρόλο που ήταν κουρασμένος, συνέχισε να δουλεύει.", a: "Υπόταξη" },
  { s: "Φοβάμαι μήπως χαθούν οι παραδόσεις μας.", a: "Υπόταξη" },
  { s: "Ήρθε, είδε, νίκησε.", a: "Ασύνδετο σχήμα (παράταξη χωρίς σύνδεσμο)" },
  { s: "Τρέχουμε, βιαζόμαστε, αγχωνόμαστε, ξεχνάμε να ζήσουμε.", a: "Ασύνδετο σχήμα (παράταξη χωρίς σύνδεσμο)" },
  { s: "Ψέματα, υποσχέσεις, συνθήματα: αυτά ακούμε στις προεκλογικές περιόδους.", a: "Ασύνδετο σχήμα (παράταξη χωρίς σύνδεσμο)" },
  { s: "Σπίτια γκρεμισμένα, δρόμοι κλειστοί, άνθρωποι στους δρόμους.", a: "Ασύνδετο σχήμα (παράταξη χωρίς σύνδεσμο)" },
  { s: "Τόσο πολύ χάρηκε, ώστε δεν μπορούσε να μιλήσει.", a: "Υπόταξη" },
  { s: "Ρώτησε πού βρίσκεται η βιβλιοθήκη.", a: "Υπόταξη" },
  { s: "Η ομάδα έχασε, ωστόσο οι φίλαθλοι τη χειροκρότησαν.", a: "Παράταξη με σύνδεσμο" },
  { s: "Κουράστηκε, πεινάει, θέλει να γυρίσει σπίτι.", a: "Ασύνδετο σχήμα (παράταξη χωρίς σύνδεσμο)" },
  { s: "Μόλις άνοιξαν οι πόρτες, οι επισκέπτες όρμησαν μέσα.", a: "Υπόταξη" },
  { s: "Δεν ήρθε στο σχολείο, γιατί ήταν άρρωστος.", a: "Υπόταξη" },
  { s: "Και ο πατέρας και η μητέρα εργάζονται στο νοσοκομείο.", a: "Παράταξη με σύνδεσμο" },
  { s: "Ο χρόνος περνά, οι άνθρωποι αλλάζουν, οι αναμνήσεις μένουν.", a: "Ασύνδετο σχήμα (παράταξη χωρίς σύνδεσμο)" },
  { s: "Αυτός μιλά πολύ, εκείνη όμως ακούει.", a: "Παράταξη με σύνδεσμο" },
  { s: "Η πόλη όπου γεννήθηκα έχει αλλάξει πολύ.", a: "Υπόταξη" },
  { s: "Θα σε βοηθήσω, εφόσον μου το ζητήσεις.", a: "Υπόταξη" }
];
const NA3_SYNH = {
  "Παράταξη με σύνδεσμο": "ισοδύναμες προτάσεις ενώνονται με παρατακτικούς συνδέσμους (και, ούτε, ή, αλλά, όμως, ωστόσο…).",
  "Υπόταξη": "μια δευτερεύουσα πρόταση εξαρτάται από κύρια (επειδή, όταν, αν, ότι, που, για να, ώστε, παρόλο που, μήπως…).",
  "Ασύνδετο σχήμα (παράταξη χωρίς σύνδεσμο)": "λέξεις ή προτάσεις παρατίθενται η μία δίπλα στην άλλη χωρίς σύνδεσμο, με κόμμα — δίνει ζωντάνια, ένταση, γρήγορο ρυθμό."
};
/* ρηματικά πρόσωπα: s = παράδειγμα, p = πρόσωπο, f = λειτουργία */
const NA3_PERS = [
  { s: "Όλοι μας πρέπει να αναλάβουμε τις ευθύνες μας απέναντι στο περιβάλλον.", p: "α΄ πληθυντικό", f: "Ο συγγραφέας εντάσσει τον εαυτό του στο σύνολο· δημιουργεί οικειότητα και συλλογική ευθύνη, γίνεται πιο πειστικός." },
  { s: "Πιστεύω ακράδαντα ότι η παιδεία είναι το θεμέλιο της δημοκρατίας.", p: "α΄ ενικό", f: "Ο πομπός εκφράζει προσωπική άποψη/εμπειρία· ο λόγος γίνεται υποκειμενικός, άμεσος, ειλικρινής." },
  { s: "Αν θέλεις να αλλάξεις τον κόσμο, ξεκίνα από τον εαυτό σου.", p: "β΄ ενικό", f: "Απευθύνεται άμεσα στον αναγνώστη· ζωντάνια, οικειότητα, προτρεπτικός χαρακτήρας." },
  { s: "Οι νέοι σήμερα αντιμετωπίζουν πολλές προκλήσεις στην αγορά εργασίας.", p: "γ΄ πρόσωπο", f: "Αντικειμενικότητα και αποστασιοποίηση· ο λόγος γίνεται τεκμηριωμένος, ουδέτερος." },
  { s: "Είναι γεγονός ότι η τεχνολογία εξελίσσεται με ταχύτατους ρυθμούς.", p: "γ΄ πρόσωπο (απρόσωπη σύνταξη)", f: "Γενίκευση και αντικειμενικότητα· η θέση παρουσιάζεται ως κοινά αποδεκτή." },
  { s: "Ας αναλογιστούμε τι κόσμο θα αφήσουμε στα παιδιά μας.", p: "α΄ πληθυντικό", f: "Προτρεπτικό α΄ πληθυντικό· ο συγγραφέας καλεί τον αναγνώστη σε κοινό προβληματισμό." },
  { s: "Σκεφτείτε για μια στιγμή πόσο χρόνο περνάτε κάθε μέρα μπροστά σε μια οθόνη.", p: "β΄ πληθυντικό", f: "Άμεση προσφώνηση του ακροατηρίου (τυπικό στην ομιλία)· ενεργοποιεί και προβληματίζει." },
  { s: "Θυμάμαι ακόμη την πρώτη μέρα που πήγα στο σχολείο.", p: "α΄ ενικό", f: "Προσωπική μαρτυρία/αφήγηση εμπειρίας· συναισθηματική φόρτιση, αμεσότητα." }
];

/* 4.4 — συνώνυμα / αντώνυμα σε συγκείμενο (k: "syn" | "ant"), a: αποδεκτές απαντήσεις στον ίδιο τύπο */
const NA3_LEX = [
  { k: "ant", s: "Οι [[επιβλαβείς]] συνέπειες του θορύβου στην υγεία είναι γνωστές.", a: ["αβλαβείς", "ωφέλιμες", "επωφελείς", "ακίνδυνες", "ευεργετικές", "θετικές"] },
  { k: "ant", s: "Οι νέοι λαμπτήρες επιτρέπουν μεγάλη [[εξοικονόμηση]] ενέργειας.", a: ["σπατάλη", "κατασπατάληση", "απώλεια", "χάσιμο", "ξόδεμα", "δαπάνη"] },
  { k: "ant", s: "Ο Μάριος είναι πολύ [[ενεργός]] στον σύλλογο του χωριού του.", a: ["παθητικός", "αδρανής", "απαθής"] },
  { k: "ant", s: "Η [[αύξηση]] της ανεργίας ανησυχεί τους νέους.", a: ["μείωση", "ελάττωση", "συρρίκνωση", "πτώση", "περιορισμός", "κάμψη"] },
  { k: "ant", s: "Οι συνθήκες εργασίας είναι [[ευνοϊκές]].", a: ["δυσμενείς", "αντίξοες", "δυσχερείς", "αρνητικές", "ανεπιθύμητες"] },
  { k: "ant", s: "Η κυβέρνηση [[ενίσχυσε]] τα μέτρα προστασίας.", a: ["αποδυνάμωσε", "εξασθένισε", "εξασθένησε", "χαλάρωσε", "περιόρισε", "μείωσε", "υπονόμευσε"] },
  { k: "ant", s: "Ο ομιλητής έκανε μια [[σαφή]] δήλωση.", a: ["ασαφή", "αόριστη", "θολή", "δυσνόητη", "διφορούμενη", "συγκεχυμένη", "νεφελώδη"] },
  { k: "ant", s: "Πρόκειται για ένα [[μόνιμο]] πρόβλημα της πόλης.", a: ["προσωρινό", "παροδικό", "εφήμερο", "περιστασιακό", "στιγμιαίο"] },
  { k: "ant", s: "Η απόφαση ήταν [[δίκαιη]].", a: ["άδικη", "αυθαίρετη", "μεροληπτική"] },
  { k: "ant", s: "Ο δάσκαλος [[επαίνεσε]] την προσπάθεια των μαθητών.", a: ["κατέκρινε", "επέκρινε", "αποδοκίμασε", "μέμφθηκε", "κατηγόρησε", "επέπληξε"] },
  { k: "ant", s: "Η συμμετοχή στις εκλογές ήταν [[υψηλή]].", a: ["χαμηλή", "μειωμένη", "περιορισμένη", "ισχνή"] },
  { k: "ant", s: "Οι ειδικοί [[επιβεβαίωσαν]] την είδηση.", a: ["διέψευσαν", "αμφισβήτησαν", "ανασκεύασαν", "αναίρεσαν"] },
  { k: "ant", s: "Οι νέοι δείχνουν [[ενδιαφέρον]] για την πολιτική.", a: ["αδιαφορία", "απάθεια", "απαξίωση"] },
  { k: "ant", s: "Η [[πρόοδος]] της επιστήμης είναι εντυπωσιακή.", a: ["οπισθοδρόμηση", "στασιμότητα", "υποχώρηση", "παρακμή", "πισωγύρισμα"] },
  { k: "ant", s: "Ο νόμος [[απαγορεύει]] το κάπνισμα στους κλειστούς χώρους.", a: ["επιτρέπει", "ενθαρρύνει", "νομιμοποιεί"] },
  { k: "ant", s: "Ήταν μια [[τολμηρή]] απόφαση.", a: ["δειλή", "άτολμη", "συντηρητική", "διστακτική", "φοβισμένη"] },
  { k: "ant", s: "Ο πληθυσμός της υπαίθρου [[μειώνεται]] συνεχώς.", a: ["αυξάνεται", "μεγαλώνει", "πληθαίνει", "πολλαπλασιάζεται", "ενισχύεται"] },
  { k: "ant", s: "Η συζήτηση έγινε σε [[ήρεμο]] κλίμα.", a: ["τεταμένο", "ταραγμένο", "εκρηκτικό", "φορτισμένο", "θυελλώδες", "ταραχώδες", "ηλεκτρισμένο", "εχθρικό"] },
  { k: "ant", s: "Ο μαθητής απάντησε με [[ακρίβεια]].", a: ["ανακρίβεια", "ασάφεια", "προχειρότητα", "αοριστία"] },
  { k: "ant", s: "Η απόφασή του να επιστρέψει τα χρήματα ήταν [[ηθική]].", a: ["ανήθικη", "ανέντιμη", "αθέμιτη", "ανεπίτρεπτη"] },
  { k: "ant", s: "Η είσοδος στο μουσείο είναι [[δωρεάν]].", a: ["επί πληρωμή", "με πληρωμή", "με εισιτήριο"] },
  { k: "ant", s: "Ο διάλογος ήταν [[γόνιμος]].", a: ["άγονος", "στείρος", "ατελέσφορος", "άκαρπος", "αναποτελεσματικός", "άχρηστος"] },
  { k: "ant", s: "Πολλοί αναπαράγουν [[άκριτα]] όσα διαβάζουν στο διαδίκτυο.", a: ["κριτικά", "συνειδητά", "προσεκτικά", "με κρίση", "επιλεκτικά", "συνετά"] },
  { k: "ant", s: "Η [[ειρήνη]] στην περιοχή είναι εύθραυστη.", a: ["πόλεμος", "σύγκρουση", "εχθροπραξίες", "βία", "διένεξη", "σύρραξη"] },
  { k: "ant", s: "Οι τιμές των προϊόντων είναι [[προσιτές]].", a: ["απρόσιτες", "υψηλές", "ακριβές", "απαγορευτικές", "τσουχτερές"] },
  { k: "syn", s: "Ο ήρωας του έργου ζει σε έναν [[πλασματικό]] κόσμο που έχει φτιάξει μόνος του.", a: ["ψεύτικο", "επίπλαστο", "φανταστικό", "ανύπαρκτο", "εικονικό", "πλαστό", "κατασκευασμένο", "ονειρικό"] },
  { k: "syn", s: "Ο συγγραφέας [[επισημαίνει]] τους κινδύνους.", a: ["τονίζει", "υπογραμμίζει", "σημειώνει", "υποδεικνύει", "αναδεικνύει", "εφιστά την προσοχή σε"] },
  { k: "syn", s: "Η κατάσταση παραμένει [[κρίσιμη]].", a: ["σοβαρή", "επικίνδυνη", "οριακή", "δύσκολη", "ανησυχητική"] },
  { k: "syn", s: "Οι νέοι [[αμφισβητούν]] τις παραδοσιακές αξίες.", a: ["αμφιβάλλουν για", "αντιδρούν σε", "απορρίπτουν", "θέτουν υπό αμφισβήτηση", "αντιμάχονται", "κριτικάρουν"] },
  { k: "syn", s: "Το φαινόμενο έχει πάρει [[ανησυχητικές]] διαστάσεις.", a: ["τρομακτικές", "επικίνδυνες", "δραματικές", "απειλητικές", "εκρηκτικές", "σοβαρές", "επίφοβες"] },
  { k: "syn", s: "Η πρόταση έγινε δεκτή με [[ενθουσιασμό]].", a: ["ζέση", "χαρά", "ζήλο", "ευφορία", "αγαλλίαση", "ικανοποίηση"] },
  { k: "syn", s: "Ο πολιτικός έδωσε [[αόριστες]] υποσχέσεις.", a: ["ασαφείς", "θολές", "γενικόλογες", "νεφελώδεις", "συγκεχυμένες", "ακαθόριστες"] },
  { k: "syn", s: "Η εταιρεία [[αποσκοπεί]] στο κέρδος.", a: ["στοχεύει", "αποβλέπει", "σκοπεύει", "επιδιώκει", "στοχεύει στο", "αποβλέπει στο"] },
  { k: "syn", s: "Η [[ραγδαία]] ανάπτυξη της τεχνολογίας αλλάζει τη ζωή μας.", a: ["ταχύτατη", "γρήγορη", "ταχεία", "αλματώδης", "ορμητική", "ταχύρρυθμη", "θεαματική"] },
  { k: "syn", s: "Ο μαθητής έδειξε [[επιμέλεια]] σε όλη τη χρονιά.", a: ["φιλοπονία", "εργατικότητα", "προσήλωση", "συνέπεια", "επιμονή", "ζήλο", "προσοχή"] },
  { k: "syn", s: "Η απόφαση είχε [[ολέθριες]] συνέπειες.", a: ["καταστροφικές", "τραγικές", "δραματικές", "μοιραίες", "βλαβερές", "ζημιογόνες", "δυσμενείς"] },
  { k: "syn", s: "Ο ήρωας [[διακρίθηκε]] για το θάρρος του.", a: ["ξεχώρισε", "αναδείχθηκε", "έλαμψε"] },
  { k: "syn", s: "Η [[αδιαφορία]] των πολιτών βλάπτει τη δημοκρατία.", a: ["απάθεια", "αμέλεια", "αδράνεια", "ολιγωρία", "αποστασιοποίηση"] },
  { k: "syn", s: "Η συνάντηση [[ματαιώθηκε]] λόγω καιρού.", a: ["ακυρώθηκε", "αναιρέθηκε", "καταργήθηκε"] },
  { k: "syn", s: "Οι πολίτες ζητούν [[διαφάνεια]] στη δημόσια διοίκηση.", a: ["καθαρότητα", "εντιμότητα", "ειλικρίνεια", "τιμιότητα", "ακεραιότητα"] },
  { k: "syn", s: "Το ζήτημα είναι [[περίπλοκο]].", a: ["πολύπλοκο", "σύνθετο", "δύσκολο", "μπερδεμένο", "δυσεπίλυτο", "πολυσύνθετο"] },
  { k: "syn", s: "Η κοινωνία [[στιγματίζει]] όσους είναι διαφορετικοί.", a: ["περιθωριοποιεί", "αποκλείει", "κατακρίνει", "χαρακτηρίζει αρνητικά", "σημαδεύει", "απορρίπτει", "στηλιτεύει"] },
  { k: "syn", s: "Οι επιστήμονες [[προειδοποιούν]] για την κλιματική κρίση.", a: ["επισημαίνουν", "προμηνύουν", "ειδοποιούν", "συμβουλεύουν", "προλέγουν", "προτρέπουν σε εγρήγορση", "κρούουν τον κώδωνα του κινδύνου"] },
  { k: "syn", s: "Η [[υιοθέτηση]] νέων συνηθειών απαιτεί χρόνο και επιμονή.", a: ["αποδοχή", "ενστερνισμός", "εφαρμογή", "μίμηση", "επιλογή", "οικειοποίηση"] },
  { k: "syn", s: "Ο καθηγητής ήταν [[αυστηρός]] αλλά δίκαιος.", a: ["απαιτητικός", "σκληρός", "αδιάλλακτος", "άκαμπτος", "τυπικός", "ανελαστικός"] },
  { k: "syn", s: "Η κυβέρνηση [[θεσπίζει]] νέους κανόνες.", a: ["καθιερώνει", "ορίζει", "νομοθετεί", "εισάγει", "επιβάλλει", "προβλέπει", "δημιουργεί"] },
  { k: "syn", s: "Η παράσταση [[συγκίνησε]] το κοινό.", a: ["άγγιξε", "συγκλόνισε", "συνεπήρε", "συντάραξε", "μάγεψε"] },
  { k: "syn", s: "Η έρευνα [[αποκάλυψε]] σημαντικά στοιχεία.", a: ["έδειξε", "ανέδειξε", "φανέρωσε", "έφερε στο φως", "κατέδειξε", "ανακάλυψε"] },
  { k: "syn", s: "Ο ρατσισμός είναι [[απαράδεκτη]] συμπεριφορά.", a: ["ανεπίτρεπτη", "κατακριτέα", "αποκρουστική", "ανάρμοστη", "αθέμιτη", "απορριπτέα"] },
  { k: "syn", s: "Η πόλη έχει [[αξιόλογα]] μνημεία.", a: ["σημαντικά", "αξιοσημείωτα", "σπουδαία", "αξιοπρόσεκτα", "πολύτιμα", "ενδιαφέροντα"] }
];
/* πολυσημία: μία λέξη, πολλές σημασίες */
const NA3_POLY = [
  { w: "ρίζα", u: [["Η ρίζα του δέντρου είναι βαθιά.", "τμήμα του φυτού στο έδαφος"], ["Η φτώχεια είναι η ρίζα πολλών κοινωνικών προβλημάτων.", "αιτία, αφετηρία"], ["Η ρίζα του ρήματος «γράφω» είναι «γραφ-».", "γραμματικός όρος: το αμετάβλητο μέρος"], ["Η τετραγωνική ρίζα του 9 είναι 3.", "μαθηματικός όρος"]] },
  { w: "τιμή", u: [["Η τιμή του ψωμιού αυξήθηκε.", "κόστος σε χρήματα"], ["Είναι μεγάλη τιμή για μένα να σας μιλήσω.", "διάκριση, ευτυχής περίσταση"], ["Ορκίστηκε στην τιμή του.", "υπόληψη, αξιοπρέπεια"]] },
  { w: "κύμα", u: [["Το κύμα έσκασε στα βράχια.", "κίνηση της επιφάνειας του νερού"], ["Ένα κύμα διαμαρτυρίας σάρωσε τη χώρα.", "μαζική εκδήλωση, έξαρση"], ["Τα ραδιοκύματα μεταφέρουν το σήμα.", "φυσική: διάδοση ενέργειας"]] },
  { w: "γραμμή", u: [["Τράβηξε μια ευθεία γραμμή.", "χάραξη"], ["Η γραμμή του λεωφορείου άλλαξε δρομολόγιο.", "συγκοινωνιακή διαδρομή"], ["Το κόμμα ακολουθεί σκληρή γραμμή.", "πολιτική κατεύθυνση"], ["Η τηλεφωνική γραμμή είναι κατειλημμένη.", "σύνδεση τηλεφώνου"]] },
  { w: "πέφτω", u: [["Το παιδί έπεσε από το ποδήλατο.", "χάνω την ισορροπία μου"], ["Οι τιμές έπεσαν μετά τις γιορτές.", "μειώνομαι"], ["Η κυβέρνηση έπεσε ύστερα από πρόταση δυσπιστίας.", "ανατρέπομαι"], ["Έπεσα έξω στους υπολογισμούς μου.", "κάνω λάθος"]] },
  { w: "σταθμός", u: [["Ο σιδηροδρομικός σταθμός ήταν γεμάτος.", "τόπος στάσης μέσων μεταφοράς"], ["Η επανάσταση αποτέλεσε σταθμό στην ιστορία.", "ορόσημο, καθοριστικό γεγονός"], ["Άκουσε τις ειδήσεις από τον ραδιοφωνικό σταθμό.", "φορέας εκπομπής"]] }
];

/* 4.5 — παράγωγα ουσιαστικά / επίθετα από ρήματα (επίθετα στο αρσενικό· δεκτοί και οι άλλοι τύποι) */
const NA3_DER = [
  { v: "επιβαρύνω", n: ["επιβάρυνση"], a: ["επιβαρυντικός", "επιβαρής"] },
  { v: "διακρίνω", n: ["διάκριση", "διακριτικότητα", "διακριτικό"], a: ["διακριτικός", "διακριτός", "διακρίσιμος", "διακριτέος"] },
  { v: "προστατεύω", n: ["προστασία", "προστάτης", "προστάτιδα", "προστατευτισμός"], a: ["προστατευτικός"] },
  { v: "καταναλώνω", n: ["κατανάλωση", "καταναλωτής", "καταναλωτισμός", "καταναλώτρια"], a: ["καταναλωτικός", "καταναλώσιμος"] },
  { v: "διαφημίζω", n: ["διαφήμιση", "διαφημιστής", "διαφημίστρια"], a: ["διαφημιστικός"] },
  { v: "ενημερώνω", n: ["ενημέρωση", "ενημερωτής"], a: ["ενημερωτικός"] },
  { v: "συμμετέχω", n: ["συμμετοχή", "συμμέτοχος"], a: ["συμμετοχικός"] },
  { v: "παράγω", n: ["παραγωγή", "παραγωγός", "παράγωγο", "παραγωγικότητα"], a: ["παραγωγικός", "παράγωγος"] },
  { v: "ελέγχω", n: ["έλεγχος", "ελεγκτής", "ελέγκτρια"], a: ["ελεγκτικός", "ελέγξιμος"] },
  { v: "επηρεάζω", n: ["επηρεασμός"], a: ["επηρεάσιμος"] },
  { v: "αναπτύσσω", n: ["ανάπτυξη"], a: ["αναπτυξιακός"] },
  { v: "δημιουργώ", n: ["δημιουργία", "δημιουργός", "δημιούργημα", "δημιουργικότητα"], a: ["δημιουργικός"] },
  { v: "εκπαιδεύω", n: ["εκπαίδευση", "εκπαιδευτής", "εκπαιδευτικός", "εκπαιδεύτρια"], a: ["εκπαιδευτικός"] },
  { v: "πείθω", n: ["πειθώ", "πειστικότητα", "πεποίθηση"], a: ["πειστικός", "πειθήνιος"] },
  { v: "κρίνω", n: ["κρίση", "κριτής", "κριτική", "κριτικός", "κριτήριο"], a: ["κριτικός", "κρίσιμος", "κριτέος"] },
  { v: "αποφασίζω", n: ["απόφαση", "αποφασιστικότητα"], a: ["αποφασιστικός"] },
  { v: "επιτυγχάνω", n: ["επιτυχία", "επίτευξη", "επίτευγμα"], a: ["επιτυχής", "επιτεύξιμος"] },
  { v: "ωφελώ", n: ["ωφέλεια", "όφελος", "ωφελιμισμός"], a: ["ωφέλιμος"] },
  { v: "εμπιστεύομαι", n: ["εμπιστοσύνη"], a: ["έμπιστος", "εμπιστευτικός"] },
  { v: "εργάζομαι", n: ["εργασία", "εργάτης", "εργάτρια", "εργατικότητα"], a: ["εργατικός"] },
  { v: "σέβομαι", n: ["σεβασμός"], a: ["σεβαστός", "σεβαστικός"] },
  { v: "μορφώνω", n: ["μόρφωση"], a: ["μορφωτικός"] },
  { v: "εξελίσσω", n: ["εξέλιξη"], a: ["εξελικτικός", "εξελίξιμος"] },
  { v: "χρησιμοποιώ", n: ["χρησιμοποίηση"], a: ["χρησιμοποιήσιμος"] },
  { v: "ρυπαίνω", n: ["ρύπανση", "ρυπαντής"], a: ["ρυπαντικός"] },
  { v: "υπερβάλλω", n: ["υπερβολή"], a: ["υπερβολικός"] },
  { v: "επικοινωνώ", n: ["επικοινωνία"], a: ["επικοινωνιακός"] },
  { v: "αξιολογώ", n: ["αξιολόγηση", "αξιολογητής"], a: ["αξιολογικός", "αξιολογήσιμος"] },
  { v: "αντιδρώ", n: ["αντίδραση", "αντιδραστήρας"], a: ["αντιδραστικός"] },
  { v: "συνεργάζομαι", n: ["συνεργασία", "συνεργάτης", "συνεργάτιδα"], a: ["συνεργάσιμος", "συνεργατικός"] },
  { v: "καταστρέφω", n: ["καταστροφή", "καταστροφέας"], a: ["καταστροφικός"] },
  { v: "θαυμάζω", n: ["θαυμασμός", "θαυμαστής", "θαύμα", "θαυμάστρια"], a: ["θαυμαστός"] }
];
/* εκτεταμένοι τύποι επιθέτων: -ος → -η/-α/-ο, -ής → -ές */
const na3AdjForms = list => { const out = []; for (const w of list) { out.push(w); const e = /^(.*)έος$/.exec(w); if (e) { out.push(e[1] + "έα", e[1] + "έο"); continue; } const m = /^(.*)(ος|ός)$/.exec(w); if (m) { const acc = m[2] === "ός"; out.push(m[1] + (acc ? "ή" : "η"), m[1] + (acc ? "ά" : "α"), m[1] + (acc ? "ό" : "ο")); } const n = /^(.*)ής$/.exec(w); if (n) out.push(n[1] + "ές"); const p = /^(.*)ων$/.exec(w); if (p) out.push(p[1] + "ουσα", p[1] + "ον"); } return [...new Set(out)]; };

/* ═════════════ WIDGETS ═════════════ */
var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* 3.1 — δομή παραγράφου: κλικ σε περίοδο → ρόλος */
  na3par(box) {
    box.innerHTML = `<div class="wctl"><label>Παράγραφος <select class="na3ps">${NA3_PAR.map((p, i) => `<option value="${i}">${i + 1}. ${na3E(p.th)}</option>`).join("")}</select></label></div>
      <div class="na3roles">${NA3_ROLE.map((r, i) => `<button class="btn ghost small na3r${i ? "" : " on"}" data-r="${i}"><span class="na3dot c${i}"></span>${r}</button>`).join("")}</div>
      <p class="muted small">1) Διάλεξε ρόλο · 2) Κάνε κλικ στις περιόδους της παραγράφου · 3) Έλεγχος.</p>
      <div class="na3pbox"></div>
      <div class="wctl"><button class="btn primary na3chk">Έλεγχος</button><button class="btn ghost na3show">Δείξε τη λύση</button><button class="btn ghost na3rnd">🎲 Άλλη παράγραφος</button></div>
      <div class="wout na3o">Η κατακλείδα δεν είναι υποχρεωτική: μερικές παράγραφοι κλείνουν με τελευταία λεπτομέρεια.</div>`;
    let role = 0, sel = [];
    const draw = (reveal) => {
      const p = NA3_PAR[+$(".na3ps", box).value];
      $(".na3pbox", box).innerHTML = `<div class="nepass na3para">${p.s.map((s, i) => {
        const r = reveal ? na3Role(p, i) : sel[i];
        return `<span class="na3sent${r === undefined ? "" : " c" + r}" data-i="${i}">${na3E(s)}</span>`; }).join(" ")}</div>`;
      box.querySelectorAll(".na3sent").forEach(el => el.onclick = () => { const i = +el.dataset.i; sel[i] = role; draw(false); });
    };
    box.querySelectorAll(".na3r").forEach(b => b.onclick = () => { role = +b.dataset.r; box.querySelectorAll(".na3r").forEach(x => x.classList.toggle("on", x === b)); });
    $(".na3ps", box).onchange = () => { sel = []; draw(false); $(".na3o", box).textContent = "Κάνε κλικ στις περιόδους."; };
    $(".na3rnd", box).onclick = () => { $(".na3ps", box).value = Math.floor(Math.random() * NA3_PAR.length); $(".na3ps", box).onchange(); };
    $(".na3show", box).onclick = () => { draw(true); const p = NA3_PAR[+$(".na3ps", box).value]; $(".na3o", box).innerHTML = `Θεματική περίοδος: η ${p.t + 1}η περίοδος · ${p.k < 0 ? (p.t === p.s.length - 1 ? "η θεματική περίοδος βρίσκεται στο τέλος (επαγωγική οργάνωση) και λειτουργεί ταυτόχρονα ως κατακλείδα" : "<b>χωρίς κατακλείδα</b>") : `κατακλείδα: η ${p.k + 1}η περίοδος`}. Οι υπόλοιπες είναι λεπτομέρειες (σχόλια) που αναπτύσσουν τη θεματική περίοδο.`; };
    $(".na3chk", box).onclick = () => {
      const p = NA3_PAR[+$(".na3ps", box).value]; let ok = 0, miss = 0;
      p.s.forEach((_, i) => { if (sel[i] === undefined) miss++; else if (na3RoleOk(p, i, sel[i])) ok++; });
      box.querySelectorAll(".na3sent").forEach(el => { const i = +el.dataset.i; el.classList.remove("na3ok", "na3bad"); if (sel[i] !== undefined) el.classList.add(na3RoleOk(p, i, sel[i]) ? "na3ok" : "na3bad"); });
      $(".na3o", box).innerHTML = miss ? `Έχεις αφήσει ${miss} περίοδο/ους χωρίς ρόλο.` : ok === p.s.length ? `✅ Σωστά! Όλες οι ${ok} περίοδοι.` : `${ok}/${p.s.length} σωστές. Θυμήσου: η θεματική περίοδος δηλώνει το θέμα της παραγράφου — δεν είναι πάντα η πρώτη.`;
    };
    draw(false);
  },

  /* 3.2 — τρόποι ανάπτυξης: classifier */
  na3dev(box) {
    const sc = na3Score(); let cur, done;
    box.innerHTML = `<div class="na3top"><b>Με ποιον τρόπο αναπτύσσεται η παράγραφος;</b><span class="na3sc"></span></div>
      <div class="na3txt"></div><div class="na3btns">${NA3_DEVM.map(m => `<button class="btn ghost small na3m">${m}</button>`).join("")}</div>
      <div class="wout na3o">Διάλεξε τρόπο ανάπτυξης.</div><div class="wctl"><button class="btn primary na3nx">Επόμενη παράγραφος →</button></div>`;
    const next = () => { cur = na3Pick(NA3_DEV.filter(x => x !== cur)); done = false; $(".na3txt", box).innerHTML = PASSAGE(cur.t); $(".na3o", box).textContent = "Διάλεξε τρόπο ανάπτυξης."; box.querySelectorAll(".na3m").forEach(b => b.classList.remove("na3ok", "na3bad")); $(".na3sc", box).innerHTML = sc.txt(); };
    box.querySelectorAll(".na3m").forEach(b => b.onclick = () => {
      if (done) return; const ok = b.textContent === cur.m; done = true; sc.add(ok);
      b.classList.add(ok ? "na3ok" : "na3bad"); box.querySelectorAll(".na3m").forEach(x => { if (x.textContent === cur.m) x.classList.add("na3ok"); });
      $(".na3o", box).innerHTML = `${ok ? "✅ Σωστά!" : "❌ Όχι."} <b>${cur.m}</b>: ${NA3_DEVH[cur.m]}`; $(".na3sc", box).innerHTML = sc.txt(); });
    $(".na3nx", box).onclick = next; next();
  },

  /* 3.3 — διαρθρωτικές λέξεις: εξερεύνηση + κουίζ */
  na3conn(box) {
    const sc = na3Score(); let cur, done;
    const rels = Object.keys(NA3_REL);
    box.innerHTML = `<div class="wctl"><label>Νοηματική σχέση <select class="na3rs">${rels.map(r => `<option>${r}</option>`).join("")}</select></label></div>
      <div class="na3chips"></div>
      <hr class="na3hr"><div class="na3top"><b>Συμπλήρωσε το κενό με την κατάλληλη διαρθρωτική λέξη</b><span class="na3sc"></span></div>
      <div class="na3txt"></div><div class="na3btns na3opts"></div><div class="wout na3o"></div>
      <div class="wctl"><button class="btn primary na3nx">Επόμενη πρόταση →</button></div>`;
    const showRel = () => { const r = $(".na3rs", box).value; $(".na3chips", box).innerHTML = NA3_REL[r].map(w => `<span class="na3chip">${w}</span>`).join("") + `<div class="muted small">Παράδειγμα: ${na3E((NA3_GAP.find(g => g.r === r) || { s: "—", a: "" }).s.replace("___", "[" + ((NA3_GAP.find(g => g.r === r) || {}).a || "") + "]"))}</div>`; };
    const next = () => {
      cur = na3Pick(NA3_GAP.filter(x => x !== cur)); done = false;
      const others = na3GapOpts(cur);
      const opts = na3Sh([cur.a].concat(others));
      $(".na3txt", box).innerHTML = `<div class="nepass">${na3E(cur.s).replace("___", '<span class="na3gap">_____</span>')}</div>`;
      $(".na3opts", box).innerHTML = opts.map(o => `<button class="btn ghost small na3m">${na3E(o)}</button>`).join("");
      $(".na3o", box).textContent = "Διάλεξε τη λέξη που ταιριάζει νοηματικά."; $(".na3sc", box).innerHTML = sc.txt();
      box.querySelectorAll(".na3opts .na3m").forEach(b => b.onclick = () => {
        if (done) return; done = true; const ok = b.textContent === cur.a; sc.add(ok);
        box.querySelectorAll(".na3opts .na3m").forEach(x => { if (x.textContent === cur.a) x.classList.add("na3ok"); }); if (!ok) b.classList.add("na3bad");
        $(".na3gap", box).textContent = cur.a; $(".na3o", box).innerHTML = `${ok ? "✅ Σωστά!" : "❌ Όχι."} Η σχέση είναι <b>${cur.r}</b>.`; $(".na3sc", box).innerHTML = sc.txt(); });
    };
    $(".na3rs", box).onchange = showRel; $(".na3nx", box).onclick = next; showRel(); next();
  },

  /* 3.4 — γλωσσικά χαρακτηριστικά: επισήμανση σε κείμενα */
  na3lang(box) {
    const T = [
      { n: "Αφηγηματικό κείμενο", t: "[x:Εκείνο το καλοκαίρι] [f:πήγα] για πρώτη φορά εθελοντής σε μια κατασκήνωση για παιδιά με αναπηρία. [x:Την πρώτη μέρα] [a:ένιωθα] αμήχανος· δεν [a:ήξερα] τι να πω ούτε πώς να φερθώ. [x:Ύστερα από λίγες ώρες], όμως, ένα αγόρι με [a:πλησίασε], μου [a:έπιασε] το χέρι και με [a:οδήγησε] στο γήπεδο. [x:Μέχρι το βράδυ] [a:είχαμε γίνει] φίλοι." },
      { n: "Επιχειρηματολογικό κείμενο", t: "Ο εθελοντισμός [e:αποτελεί] σχολείο ζωής για τους νέους. [c:Καταρχάς], [e:καλλιεργεί] την ενσυναίσθηση, [c:αφού] ο εθελοντής [e:έρχεται] σε επαφή με ανθρώπους που [e:δοκιμάζονται]. [c:Επιπλέον], [e:αναπτύσσει] δεξιότητες συνεργασίας. Ορισμένοι [e:υποστηρίζουν] ότι οι νέοι δεν [e:έχουν] χρόνο. [c:Ωστόσο], μία ώρα την εβδομάδα [e:αρκεί] για να κάνει τη διαφορά. [c:Συνεπώς], ο εθελοντισμός [e:αξίζει] να ενταχθεί στη ζωή κάθε νέου." },
      { n: "Περιγραφή μέσα σε επιχειρηματολογία", t: "Για να καταλάβουμε τι σημαίνει ρύπανση, αρκεί να επισκεφθούμε μια παραλία μετά από ένα καλοκαιρινό σαββατοκύριακο. Η άμμος [s:γεμάτη] πλαστικά καλαμάκια, τα βότσαλα [s:λαδωμένα], ένα [s:γκρίζο] στρώμα αφρού [s:απλώνεται] στην ακτή και η [s:βαριά μυρωδιά] των σκουπιδιών [s:πνίγει] την αλμύρα της θάλασσας. Η εικόνα αυτή [c:αποδεικνύει] ότι η προστασία του περιβάλλοντος [e:ξεκινά] από τις καθημερινές μας συνήθειες." }
    ];
    const K = { a: ["Παρελθοντικοί χρόνοι", "#C62828"], x: ["Χρονικοί δείκτες", "#C77A0A"], f: ["α΄ πρόσωπο αφηγητή", "#6F42C1"], e: ["Ενεστώτας (διαχρονικός)", "#0F6FD1"], c: ["Λογικοί σύνδεσμοι", "#198754"], s: ["Περιγραφικά / αισθητηριακά", "#8d6e63"] };
    box.innerHTML = `<div class="wctl"><label>Κείμενο <select class="na3ts">${T.map((t, i) => `<option value="${i}">${t.n}</option>`).join("")}</select></label></div>
      <div class="na3chips">${Object.entries(K).map(([k, [n, c]]) => `<label class="na3chk2"><input type="checkbox" data-k="${k}" checked><span style="border-color:${c};color:${c}">${n}</span></label>`).join("")}</div>
      <div class="na3txt"></div><div class="wout na3o"></div>`;
    const draw = () => {
      const t = T[+$(".na3ts", box).value], on = {}; box.querySelectorAll(".na3chk2 input").forEach(i => on[i.dataset.k] = i.checked);
      const cnt = {}; const html = na3E(t.t).replace(/\[([axfecs]):(.+?)\]/g, (_, k, w) => { cnt[k] = (cnt[k] || 0) + 1; return on[k] ? `<mark class="na3mk" style="background:${K[k][1]}22;border-bottom:2px solid ${K[k][1]}">${w}</mark>` : w; });
      $(".na3txt", box).innerHTML = `<div class="nepass">${html}</div>`;
      const verdict = (cnt.a || 0) + (cnt.x || 0) > (cnt.e || 0) + (cnt.c || 0) ? "Κυριαρχούν <b>παρελθοντικοί χρόνοι και χρονικοί δείκτες</b> → γλώσσα <b>αφήγησης</b>." : (cnt.s || 0) > 2 ? "Μέσα στο επιχειρηματολογικό πλαίσιο υπάρχει <b>περιγραφή</b> με αισθητηριακές εικόνες, που λειτουργεί ως <b>μέσο πειθούς</b> (τεκμήριο/επίκληση στο συναίσθημα)." : "Κυριαρχούν <b>ενεστώτας διαχρονικός και λογικοί σύνδεσμοι</b> → γλώσσα <b>επιχειρηματολογίας</b>.";
      $(".na3o", box).innerHTML = Object.entries(cnt).map(([k, n]) => `<span style="color:${K[k][1]};font-weight:700">${K[k][0]}: ${n}</span>`).join(" · ") + "<br>" + verdict;
    };
    box.querySelectorAll("select,input").forEach(i => i.onchange = draw); draw();
  },

  /* 4.1 — κυριολεξία / μεταφορά */
  na3meta(box) {
    const sc = na3Score(); let cur, done;
    box.innerHTML = `<div class="na3top"><b>Η υπογραμμισμένη λέξη/φράση χρησιμοποιείται…</b><span class="na3sc"></span></div><div class="na3txt"></div>
      <div class="na3btns"><button class="btn ghost na3m" data-v="0">📏 κυριολεκτικά (δηλωτικά)</button><button class="btn ghost na3m" data-v="1">🎨 μεταφορικά (συνυποδηλωτικά)</button></div>
      <div class="wout na3o"></div><div class="wctl"><button class="btn primary na3nx">Επόμενη →</button></div>`;
    const next = () => { cur = na3Pick(NA3_MET.filter(x => x !== cur)); done = false; $(".na3txt", box).innerHTML = `<div class="nepass na3big">${na3U(cur.s)}</div>`; $(".na3o", box).textContent = "Διάλεξε."; box.querySelectorAll(".na3m").forEach(b => b.classList.remove("na3ok", "na3bad")); $(".na3sc", box).innerHTML = sc.txt(); };
    box.querySelectorAll(".na3m").forEach(b => b.onclick = () => { if (done) return; done = true; const ok = (+b.dataset.v === 1) === cur.m; sc.add(ok); b.classList.add(ok ? "na3ok" : "na3bad");
      $(".na3o", box).innerHTML = `${ok ? "✅ Σωστά!" : "❌ Όχι."} ${cur.m ? "<b>Μεταφορικά</b>" : "<b>Κυριολεκτικά</b>"} — ${na3E(cur.e)}${cur.m ? " Η μεταφορά προσδίδει ζωντάνια, παραστατικότητα και συναισθηματική φόρτιση." : ""}`; $(".na3sc", box).innerHTML = sc.txt(); });
    $(".na3nx", box).onclick = next; next();
  },

  /* 4.2 — ενεργητική ↔ παθητική με χρωματισμένους όρους */
  na3voice(box) {
    box.innerHTML = `<div class="wctl"><label>Πρόταση <select class="na3vs">${NA3_VOICE.map((x, i) => `<option value="${i}">${i + 1}. ${na3E(na3Act(x))}</option>`).join("")}</select></label><button class="btn primary na3tg">⇄ Μετατροπή</button><button class="btn ghost na3rnd">🎲</button></div>
      <div class="na3leg"><span class="na3S">υποκείμενο</span><span class="na3V">ρήμα</span><span class="na3O">αντικείμενο</span><span class="na3A">ποιητικό αίτιο</span></div>
      <div class="na3vbox"></div><div class="wout na3o"></div>`;
    let pas = false;
    const draw = () => {
      const x = NA3_VOICE[+$(".na3vs", box).value];
      $(".na3vbox", box).innerHTML = pas ? `<div class="nepass na3big"><span class="na3S">${na3E(x.ps)}</span> <span class="na3V">${na3E(x.pv)}</span> <span class="na3A">${na3E(x.pa)}</span>.</div>`
        : `<div class="nepass na3big"><span class="na3S">${na3E(x.s)}</span> <span class="na3V">${na3E(x.v)}</span> <span class="na3O">${na3E(x.o)}</span>.</div>`;
      $(".na3o", box).innerHTML = pas ? `<b>Παθητική σύνταξη:</b> το αντικείμενο της ενεργητικής (<i>${na3E(x.o)}</i>) έγινε υποκείμενο (<i>${na3E(x.ps)}</i>), το ρήμα πήγε σε παθητική φωνή στον <b>ίδιο χρόνο</b> (<i>${na3E(x.pv)}</i>) και το υποκείμενο της ενεργητικής έγινε <b>ποιητικό αίτιο</b> (<i>${na3E(x.pa)}</i>). Η έμφαση πέφτει στο <b>αποτέλεσμα / στον δέκτη</b> της ενέργειας· αν παραλειφθεί το ποιητικό αίτιο, ο λόγος γίνεται πιο απρόσωπος και αντικειμενικός.`
        : `<b>Ενεργητική σύνταξη:</b> το υποκείμενο (<i>${na3E(x.s)}</i>) ενεργεί. Η έμφαση πέφτει σε <b>αυτόν που πράττει</b>· ο λόγος γίνεται άμεσος, ζωντανός και αναδεικνύει την ευθύνη του δράστη.`;
      $(".na3tg", box).textContent = pas ? "⇄ Πίσω σε ενεργητική" : "⇄ Μετατροπή σε παθητική";
    };
    $(".na3tg", box).onclick = () => { pas = !pas; draw(); };
    $(".na3vs", box).onchange = () => { pas = false; draw(); };
    $(".na3rnd", box).onclick = () => { $(".na3vs", box).value = Math.floor(Math.random() * NA3_VOICE.length); pas = false; draw(); };
    draw();
  },

  /* 4.3 — ίδιο περιεχόμενο σε παράταξη / υπόταξη / ασύνδετο / μακροπερίοδο + ρηματικά πρόσωπα */
  na3syn(box) {
    const V = [
      { n: "Μικροπερίοδος λόγος (ασύνδετα)", t: "Η πόλη ξυπνά. Τα αυτοκίνητα γεμίζουν τους δρόμους. Οι άνθρωποι τρέχουν. Κανείς δεν κοιτάζει τον ουρανό.", e: "Σύντομες, απλές περίοδοι χωρίς συνδέσμους: γρήγορος ρυθμός, ένταση, δραματικότητα, σαφήνεια· ο αναγνώστης «βλέπει» στιγμιότυπα." },
      { n: "Παράταξη με σύνδεσμο", t: "Η πόλη ξυπνά και τα αυτοκίνητα γεμίζουν τους δρόμους, οι άνθρωποι τρέχουν, αλλά κανείς δεν κοιτάζει τον ουρανό.", e: "Οι προτάσεις είναι ισοδύναμες και ενώνονται με και, αλλά: απλότητα, ροή, φυσικότητα του προφορικού λόγου." },
      { n: "Υπόταξη", t: "Μόλις η πόλη ξυπνήσει, οι δρόμοι γεμίζουν αυτοκίνητα, επειδή οι άνθρωποι βιάζονται να φτάσουν στη δουλειά τους· είναι τόσο αγχωμένοι, ώστε κανείς δεν σηκώνει τα μάτια στον ουρανό.", e: "Οι δευτερεύουσες (χρονική, αιτιολογική, τελική, αποτελεσματική) δηλώνουν λογικές σχέσεις: αιτιότητα, σκοπό, χρόνο, αποτέλεσμα — λόγος αναλυτικός, επιχειρηματολογικός." },
      { n: "Μακροπερίοδος λόγος", t: "Κάθε πρωί, όταν η πόλη ξυπνά και τα αυτοκίνητα, το ένα πίσω από το άλλο, γεμίζουν τους δρόμους, ενώ οι άνθρωποι τρέχουν βιαστικοί για να προλάβουν μια ζωή που όλο τους ξεφεύγει, κανείς δεν βρίσκει μια στιγμή για να σηκώσει τα μάτια στον ουρανό, που απλώνεται από πάνω τους γαλάζιος και αδιάφορος.", e: "Μία μεγάλη περίοδος με πολλές δευτερεύουσες και προσδιορισμούς: πληρότητα, ανάλυση, συσσώρευση στοιχείων, επισημότητα· απαιτεί περισσότερη προσοχή από τον αναγνώστη." }
    ];
    box.innerHTML = `<div class="na3tabs">${V.map((v, i) => `<button class="btn ghost small na3tab${i ? "" : " on"}" data-i="${i}">${v.n}</button>`).join("")}</div><div class="na3txt"></div><div class="wout na3o"></div>
      <hr class="na3hr"><b>Ρηματικά πρόσωπα: τι πετυχαίνει κάθε επιλογή;</b><div class="na3tabs na3pt">${NA3_PERS.map((p, i) => `<button class="btn ghost small na3tab2${i ? "" : " on"}" data-i="${i}">«${na3E(p.s.split(" ").slice(0, 3).join(" "))}…»</button>`).join("")}</div><div class="wout na3o2"></div>`;
    const conn = /\b(και|αλλά|όμως|γιατί|για να|ώστε|μόλις|όταν|ενώ|που)\b/g;
    const draw = i => { const v = V[i]; const sent = v.t.split(/(?<=\.)\s+/).length, words = v.t.split(/\s+/).length;
      $(".na3txt", box).innerHTML = `<div class="nepass na3big">${na3E(v.t).replace(/(^|\s)(και|αλλά|όμως|γιατί|επειδή|για να|ώστε|μόλις|όταν|ενώ|που)(?=[\s,.·])/g, '$1<mark class="na3mk" style="background:#19875422;border-bottom:2px solid #198754">$2</mark>')}</div>`;
      $(".na3o", box).innerHTML = `Περίοδοι: <b>${sent}</b> · λέξεις: <b>${words}</b> · μέσο μήκος περιόδου: <b>${Math.round(words / sent)}</b> λέξεις.<br>${v.e}`; };
    const draw2 = i => { const p = NA3_PERS[i]; $(".na3o2", box).innerHTML = `<div class="nepass">${na3E(p.s)}</div><b>${p.p}:</b> ${na3E(p.f)}`; };
    box.querySelectorAll(".na3tab").forEach(b => b.onclick = () => { box.querySelectorAll(".na3tab").forEach(x => x.classList.toggle("on", x === b)); draw(+b.dataset.i); });
    box.querySelectorAll(".na3tab2").forEach(b => b.onclick = () => { box.querySelectorAll(".na3tab2").forEach(x => x.classList.toggle("on", x === b)); draw2(+b.dataset.i); });
    draw(0); draw2(0); void conn;
  },

  /* 4.4 — συνώνυμα / αντώνυμα με πληκτρολόγηση + πολυσημία */
  na3lex(box) {
    const sc = na3Score(); let cur, done;
    box.innerHTML = `<div class="wctl"><label>Άσκηση <select class="na3k"><option value="ant">Αντώνυμα</option><option value="syn">Συνώνυμα</option><option value="poly">Πολυσημία</option></select></label><span class="na3sc"></span></div>
      <div class="na3area"></div>`;
    const drill = () => {
      const k = $(".na3k", box).value;
      if (k === "poly") {
        $(".na3area", box).innerHTML = `<div class="na3tabs">${NA3_POLY.map((p, i) => `<button class="btn ghost small na3tab${i ? "" : " on"}" data-i="${i}">${p.w}</button>`).join("")}</div><div class="na3pl"></div>`;
        const show = i => { const p = NA3_POLY[i]; $(".na3pl", box).innerHTML = `<table class="tbl"><tr><th>Πρόταση</th><th>Σημασία</th></tr>${p.u.map(u => `<tr><td>${na3E(u[0])}</td><td><details><summary>δες</summary>${na3E(u[1])}</details></td></tr>`).join("")}</table><p class="muted small">Πολυσημία: η ίδια λέξη έχει διαφορετικές σημασίες ανάλογα με το συγκείμενο.</p>`; };
        box.querySelectorAll(".na3tab").forEach(b => b.onclick = () => { box.querySelectorAll(".na3tab").forEach(x => x.classList.toggle("on", x === b)); show(+b.dataset.i); }); show(0); return;
      }
      cur = na3Pick(NA3_LEX.filter(x => x.k === k && x !== cur)); done = false;
      $(".na3area", box).innerHTML = `<p><b>Γράψε ένα ${k === "ant" ? "αντώνυμο" : "συνώνυμο"} της υπογραμμισμένης λέξης</b>, στον ίδιο γραμματικό τύπο, ώστε να ταιριάζει στην πρόταση:</p><div class="nepass na3big">${na3U(cur.s)}</div>
        <div class="wctl"><input type="text" class="na3in" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="η απάντησή σου"><button class="btn primary na3go">Έλεγχος</button><button class="btn ghost na3nx">Επόμενη →</button></div><div class="wout na3o">Οι τόνοι και τα κεφαλαία δεν μετρούν.</div>`;
      const go = () => { const v = na3N($(".na3in", box).value); if (!v) return; const ok = cur.a.some(a => na3N(a) === v); if (!done) { sc.add(ok); done = true; }
        $(".na3o", box).innerHTML = `${ok ? "✅ Σωστά!" : "❌ Δεν είναι στις αναμενόμενες απαντήσεις."} Αποδεκτές: <i>${cur.a.join(", ")}</i>`; $(".na3sc", box).innerHTML = sc.txt(); };
      $(".na3go", box).onclick = go; $(".na3in", box).onkeydown = e => { if (e.key === "Enter") go(); }; $(".na3nx", box).onclick = drill; $(".na3sc", box).innerHTML = sc.txt();
    };
    $(".na3k", box).onchange = drill; drill();
  },

  /* 4.5 — οικογένεια λέξεων: ρήμα → παράγωγα */
  na3der(box) {
    box.innerHTML = `<div class="wctl"><label>Ρήμα <select class="na3dv">${NA3_DER.map((d, i) => `<option value="${i}">${d.v}</option>`).join("")}</select></label><label><input type="checkbox" class="na3quiz"> λειτουργία εξάσκησης</label></div><div class="na3area"></div>`;
    const lcp = (a, b) => { const A = na3N(a), B = na3N(b); let i = 0; while (i < A.length && A[i] === B[i]) i++; return i; };
    const split = (w, v) => { const k = Math.max(2, Math.min(lcp(w, v), w.length - 1)); return `<b>${na3E(w.slice(0, k))}</b><span class="na3suf">${na3E(w.slice(k))}</span>`; };
    const draw = () => {
      const d = NA3_DER[+$(".na3dv", box).value];
      if ($(".na3quiz", box).checked) {
        $(".na3area", box).innerHTML = `<p>Γράψε <b>ένα παράγωγο ουσιαστικό</b> και <b>ένα παράγωγο επίθετο</b> του ρήματος <b>«${d.v}»</b>. <span class="muted small">(Όχι μετοχές σε -μένος / -όμενος.)</span></p>
          <div class="wctl"><label>Ουσιαστικό <input type="text" class="na3n1" autocomplete="off" autocapitalize="off"></label><label>Επίθετο <input type="text" class="na3a1" autocomplete="off" autocapitalize="off"></label><button class="btn primary na3go">Έλεγχος</button></div><div class="wout na3o"></div>`;
        $(".na3go", box).onclick = () => { const n = na3N($(".na3n1", box).value), a = na3N($(".na3a1", box).value);
          const okn = d.n.some(x => na3N(x) === n), oka = na3AdjForms(d.a).some(x => na3N(x) === a);
          $(".na3o", box).innerHTML = `Ουσιαστικό: ${okn ? "✅" : "❌"} · Επίθετο: ${oka ? "✅" : "❌"}<br>Αποδεκτά ουσιαστικά: <i>${d.n.join(", ")}</i><br>Αποδεκτά επίθετα: <i>${d.a.join(", ")}</i> (και οι άλλοι τύποι γένους)`; };
        return;
      }
      $(".na3area", box).innerHTML = `<div class="na3fam"><div class="na3root">${na3E(d.v)}<small>ρήμα</small></div>
        <div class="na3col"><h5>Ουσιαστικά</h5>${d.n.map(w => `<span class="na3w">${split(w, d.v)}</span>`).join("")}</div>
        <div class="na3col"><h5>Επίθετα</h5>${d.a.map(w => `<span class="na3w">${split(w, d.v)}</span>`).join("")}</div></div>
        <p class="muted small">Με <b>έντονα</b> το κοινό θέμα· με <span class="na3suf">κόκκινο</span> η παραγωγική κατάληξη (ή το μέρος που αλλάζει). Στις εξετάσεις ζητείται <b>ένα</b> ουσιαστικό και <b>ένα</b> επίθετο, σωστά ορθογραφημένα, και ο προσδιορισμός του μέρους του λόγου.</p>`;
    };
    box.querySelectorAll("select,input").forEach(i => i.onchange = draw); draw();
  }
});

/* ═════════════ ΓΕΝΝΗΤΡΙΕΣ ═════════════ */
var GENS = Object.assign(window.GENS || {}, {
  na3gpar: { label: "Θεματική περίοδος & κατακλείδα", make() {
    let p = na3Pick(NA3_PAR); const askK = Math.random() < 0.35 && p.k >= 0;
    const pass = PASSAGE(p.s.join(" "));
    if (askK) return na3MC({ level: 2, q: `Ποια περίοδος αποτελεί την <b>κατακλείδα</b> της παραγράφου;${pass}`, hint: "Η κατακλείδα συνοψίζει ή βγάζει συμπέρασμα· συχνά εισάγεται με λέξεις όπως «επομένως», «έτσι», «γι' αυτό».", sol: `Κατακλείδα: «${na3E(p.s[p.k])}» — ανακεφαλαιώνει/συμπεραίνει όσα αναπτύχθηκαν.` }, p.s[p.k], p.s.filter((_, i) => i !== p.k));
    return na3MC({ level: 2, q: `Ποια περίοδος αποτελεί τη <b>θεματική περίοδο</b> της παραγράφου;${pass}`, hint: "Ψάξε την περίοδο που δηλώνει συνοπτικά το θέμα· οι υπόλοιπες την αναπτύσσουν. Δεν βρίσκεται πάντα στην αρχή.", sol: `Θεματική περίοδος: «${na3E(p.s[p.t])}». Οι άλλες περίοδοι ${p.k >= 0 ? "την αναπτύσσουν με λεπτομέρειες ή την κλείνουν με κατακλείδα" : "την αναπτύσσουν με λεπτομέρειες"}.` }, p.s[p.t], p.s.filter((_, i) => i !== p.t));
  } },
  na3gdev: { label: "Τρόπος ανάπτυξης παραγράφου", make() {
    const x = na3Pick(NA3_DEV);
    return na3MC({ level: 2, q: `Με ποιον <b>κύριο τρόπο</b> αναπτύσσεται η παράγραφος;${PASSAGE(x.t)}`, hint: "Ρώτα: τι κάνουν οι περίοδοι μετά τη θεματική; Εξηγούν «γιατί»; Δίνουν περιπτώσεις; Συγκρίνουν; Χωρίζουν σε είδη; Ορίζουν;", sol: `<b>${x.m}</b>: ${NA3_DEVH[x.m]}` }, x.m, na3Sh(NA3_DEVM.filter(m => m !== x.m)));
  } },
  na3gconn: { label: "Διαρθρωτικές λέξεις", make() {
    if (Math.random() < 0.5) {
      const g = na3Pick(NA3_GAP);
      const ws = na3GapOpts(g);
      return na3MC({ level: 1, q: `Ποια διαρθρωτική λέξη/φράση ταιριάζει στο κενό;<div class="nepass">${na3E(g.s).replace("___", "_____")}</div>`, hint: "Βρες πρώτα ποια νοηματική σχέση συνδέει τα δύο μέρη (αντίθεση, αιτία, συμπέρασμα, προσθήκη…).", sol: `«${na3E(g.a)}» — σχέση: <b>${g.r}</b>.` }, g.a, ws);
    }
    const r = na3Pick(Object.keys(NA3_REL)), w = na3Pick(NA3_REL[r]);
    return na3MC({ level: 1, q: `Ποια νοηματική σχέση δηλώνει η διαρθρωτική λέξη/φράση <b>«${na3E(w)}»</b>;`, hint: "Σκέψου μια πρόταση με τη λέξη και ρώτα: τι σχέση έχει με την προηγούμενη;", sol: `«${na3E(w)}» → <b>${r}</b>. Άλλες με την ίδια λειτουργία: ${NA3_REL[r].filter(z => z !== w).slice(0, 4).join(", ")}.` }, r, na3Sh(Object.keys(NA3_REL).filter(z => z !== r && !(NA3_NEAR[r] || []).includes(z) && !(NA3_NEAR[z] || []).includes(r))));
  } },
  na3glang: { label: "Γλώσσα αφήγησης / επιχειρηματολογίας / περιγραφής", make() {
    const T = ["Αφήγηση", "Επιχειρηματολογία", "Περιγραφή"];
    if (Math.random() < 0.5) { const x = na3Pick(NA3_LANGS);
      return na3MC({ level: 1, q: `Ποιος κειμενικός τύπος κυριαρχεί στο απόσπασμα;${PASSAGE(x.t)}`, hint: "Κοίτα τους χρόνους των ρημάτων, τους συνδέσμους και αν «συμβαίνει» κάτι ή αν περιγράφεται μια εικόνα.", sol: `<b>${x.a}</b>. ${x.a === "Αφήγηση" ? "Παρελθοντικοί χρόνοι, διαδοχή γεγονότων, ρήματα δράσης." : x.a === "Επιχειρηματολογία" ? "Θέση + τεκμηρίωση, ενεστώτας διαχρονικός, λογικοί σύνδεσμοι." : "Επίθετα, αισθητηριακές εικόνες, ρήματα στάσης· ο χρόνος «σταματά»."}` }, x.a, T.filter(t => t !== x.a)); }
    const f = na3Pick(NA3_LANGF);
    return na3MC({ level: 1, q: `Το γλωσσικό χαρακτηριστικό «${na3E(f.f)}» είναι τυπικό κυρίως…`, hint: "Η αφήγηση παρουσιάζει γεγονότα στον χρόνο· η περιγραφή εικόνες στον χώρο· η επιχειρηματολογία θέσεις και αποδείξεις.", sol: `Τυπικό της <b>${f.a === "Αφήγηση" ? "αφήγησης" : f.a === "Επιχειρηματολογία" ? "επιχειρηματολογίας" : "περιγραφής"}</b>.` }, `της ${f.a === "Αφήγηση" ? "αφήγησης" : f.a === "Επιχειρηματολογία" ? "επιχειρηματολογίας" : "περιγραφής"}`, ["της αφήγησης", "της επιχειρηματολογίας", "της περιγραφής"]);
  } },
  na3gmeta: { label: "Κυριολεξία – μεταφορά", make() {
    const x = na3Pick(NA3_MET);
    return na3MC({ level: 1, q: `Η υπογραμμισμένη λέξη/φράση χρησιμοποιείται κυριολεκτικά ή μεταφορικά;<div class="nepass">${na3U(x.s)}</div>`, hint: "Αν η λέξη σημαίνει ακριβώς αυτό που λέει το λεξικό (το πρώτο, συγκεκριμένο νόημα), είναι κυριολεξία· αν μεταφέρεται σε άλλο πεδίο, μεταφορά.", sol: `<b>${x.m ? "Μεταφορικά" : "Κυριολεκτικά"}</b> — ${na3E(x.e)}` }, x.m ? "Μεταφορικά (συνυποδηλωτικά)" : "Κυριολεκτικά (δηλωτικά)", [x.m ? "Κυριολεκτικά (δηλωτικά)" : "Μεταφορικά (συνυποδηλωτικά)"]);
  } },
  na3gvoice: { label: "Ενεργητική → παθητική σύνταξη", make() {
    const x = na3Pick(NA3_VOICE);
    if (Math.random() < 0.3) { const pas = Math.random() < 0.5;
      return na3MC({ level: 1, q: `Η πρόταση <b>«${na3E(pas ? na3Pas(x) : na3Act(x))}»</b> είναι σε…`, hint: "Ποιος κάνει την ενέργεια; Είναι το υποκείμενο (ενεργητική) ή δηλώνεται με «από + αιτιατική» (παθητική);", sol: pas ? `<b>Παθητική σύνταξη</b>: υποκείμενο «${na3E(x.ps)}», ρήμα παθητικής φωνής «${na3E(x.pv)}», ποιητικό αίτιο «${na3E(x.pa)}».` : `<b>Ενεργητική σύνταξη</b>: το υποκείμενο «${na3E(x.s)}» ενεργεί πάνω στο αντικείμενο «${na3E(x.o)}».` }, pas ? "παθητική σύνταξη" : "ενεργητική σύνταξη", [pas ? "ενεργητική σύνταξη" : "παθητική σύνταξη"]); }
    return na3MC({ level: 2, q: `Ποια είναι η σωστή μετατροπή σε <b>παθητική σύνταξη</b> της πρότασης «${na3E(na3Act(x))}» (στον ίδιο χρόνο);`, hint: "Το αντικείμενο γίνεται υποκείμενο, το ρήμα πηγαίνει στην παθητική φωνή στον ίδιο χρόνο και το υποκείμενο γίνεται ποιητικό αίτιο (από + αιτιατική).", sol: `«${na3E(na3Pas(x))}» — αντικείμενο → υποκείμενο, «${na3E(x.v)}» → «${na3E(x.pv)}» (ίδιος χρόνος), υποκείμενο → ποιητικό αίτιο «${na3E(x.pa)}».` }, na3Pas(x), [x.rv + ".", x.wt + "."]);
  } },
  na3gsyn: { label: "Παράταξη – υπόταξη – ασύνδετο", make() {
    if (Math.random() < 0.75) { const x = na3Pick(NA3_SYN);
      return na3MC({ level: 1, q: `Πώς συνδέονται οι προτάσεις/όροι στην περίοδο <b>«${na3E(x.s)}»</b>;`, hint: "Ψάξε τον σύνδεσμο: παρατακτικός (και, αλλά, ή, ούτε, όμως), υποτακτικός (επειδή, όταν, αν, ότι, που, για να…) ή κανένας (μόνο κόμματα);", sol: `<b>${x.a}</b>: ${NA3_SYNH[x.a]}` }, x.a, Object.keys(NA3_SYNH).filter(z => z !== x.a)); }
    const p = na3Pick(NA3_PERS);
    return na3MC({ level: 2, q: `Σε ποιο <b>ρηματικό πρόσωπο</b> είναι διατυπωμένη η περίοδος «${na3E(p.s)}»;`, hint: "Κοίτα την κατάληξη του ρήματος και ποιος «μιλά» σε ποιον.", sol: `<b>${p.p}</b>. ${na3E(p.f)}` }, p.p, ["α΄ ενικό", "α΄ πληθυντικό", "β΄ ενικό", "β΄ πληθυντικό", "γ΄ πρόσωπο"].filter(z => !p.p.startsWith(z) && !z.startsWith(p.p.split(" (")[0])));
  } },
  na3glex: { label: "Συνώνυμα και αντώνυμα", make() {
    const x = na3Pick(NA3_LEX);
    const m = /\[\[(.+?)\]\]/.exec(x.s)[1];
    return { level: 1, q: `Να αντικαταστήσετε την υπογραμμισμένη λέξη με ένα (1) <b>${x.k === "ant" ? "αντώνυμό" : "συνώνυμό"}</b> της, ${x.k === "ant" ? "ώστε να δίνεται η αντίθετη σημασία" : "χωρίς να αλλάξει το νόημα"} στη συγκεκριμένη πρόταση:<div class="nepass">${na3U(x.s)}</div>`,
      fields: [{ label: x.k === "ant" ? "Αντώνυμο:" : "Συνώνυμο:", ans: x.a, text: true, nopunct: true }],
      hint: `Γράψε τη λέξη στον ίδιο γραμματικό τύπο (πτώση, αριθμό, γένος, πρόσωπο) με το «${m}».`, sol: `Ενδεικτικές απαντήσεις: <i>${x.a.join(", ")}</i>.` };
  } },
  na3gder: { label: "Παράγωγα από ρήμα", make() {
    const d = na3Pick(NA3_DER);
    return { level: 2, q: `Να γράψετε ένα (1) <b>παράγωγο ουσιαστικό</b> και ένα (1) <b>παράγωγο επίθετο</b> του ρήματος <b>«${d.v}»</b>.`,
      fields: [{ label: "Ουσιαστικό:", ans: d.n, text: true }, { label: "Επίθετο:", ans: na3AdjForms(d.a), text: true }],
      hint: "Κράτησε το θέμα του ρήματος και πρόσθεσε παραγωγική κατάληξη: -ση/-ξη/-ψη, -μός, -τής, -ία για ουσιαστικά· -τικός, -σιμος, -τός, -μένος για επίθετα.", sol: `Ουσιαστικά: <i>${d.n.join(", ")}</i> · Επίθετα: <i>${d.a.join(", ")}</i>.` };
  } }
});

/* στυλ των widgets της ενότητας */
(function () { if (typeof document === "undefined" || document.getElementById("na3css")) return; const st = document.createElement("style"); st.id = "na3css"; st.textContent = `
.na3roles,.na3btns,.na3tabs{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.na3r.on,.na3tab.on,.na3tab2.on{border-color:var(--blue);background:var(--soft);color:var(--blue)}
.na3dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px;vertical-align:middle}
.na3dot.c0,.na3sent.c0{background:#C6282833}.na3dot.c1,.na3sent.c1{background:#0F6FD122}.na3dot.c2,.na3sent.c2{background:#19875433}
.na3dot.c0{background:#C62828}.na3dot.c1{background:#0F6FD1}.na3dot.c2{background:#198754}
.na3para{line-height:2}.na3sent{cursor:pointer;border-radius:6px;padding:2px 3px;transition:.15s;box-decoration-break:clone;-webkit-box-decoration-break:clone}.na3sent:hover{outline:2px dashed var(--blue)}
.na3sent.na3ok{outline:2px solid #198754}.na3sent.na3bad{outline:2px solid #DC3545}
.btn.na3ok{border-color:#198754;background:#e9f7ef;color:#146c43}.btn.na3bad{border-color:#DC3545;background:#fdecee;color:#b02a37}
.na3top{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:baseline}.na3sc{font-size:13.5px;color:var(--muted)}
.na3chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.na3chip{background:var(--soft);border:1px solid #ecd9d4;border-radius:99px;padding:3px 10px;font-size:14px}
.na3chips .muted{flex-basis:100%;margin-top:4px}.na3hr{border:0;border-top:1px solid var(--line);margin:14px 0}
.na3gap{display:inline-block;min-width:70px;border-bottom:2px solid var(--blue);color:var(--blue);font-weight:700;text-align:center}
.na3chk2{display:inline-flex;align-items:center;gap:4px;font-size:13px}.na3chk2 span{border:1.5px solid;border-radius:99px;padding:2px 9px;font-weight:700}
.na3mk{color:inherit;border-radius:3px;padding:0 2px}.na3big{font-size:17px}
.na3leg{display:flex;flex-wrap:wrap;gap:8px;font-size:13px;margin:6px 0}
.na3S,.na3V,.na3O,.na3A{border-radius:6px;padding:1px 6px;font-weight:700}
.na3S{background:#0F6FD11f;color:#0b5aa8}.na3V{background:#C628281f;color:#a51d1d}.na3O{background:#1987541f;color:#146c43}.na3A{background:#6F42C11f;color:#5a32a3}
.na3in{font:inherit;padding:8px 10px;border:1.5px solid var(--line);border-radius:10px;min-width:0;max-width:100%;width:220px}
.na3fam{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;align-items:start}
.na3root{grid-column:1/-1;text-align:center;font:700 22px Georgia,serif;color:var(--blue)}.na3root small{display:block;font:600 12px var(--sans);color:var(--muted)}
.na3col{background:var(--soft);border-radius:12px;padding:10px}.na3col h5{margin:0 0 6px;font-size:13px;color:var(--navy);text-transform:uppercase;letter-spacing:.04em}
.na3w{display:inline-block;margin:3px 6px 3px 0;padding:3px 8px;background:#fff;border:1px solid #ecd9d4;border-radius:8px;font-size:15px}.na3suf{color:#C62828;font-weight:700}
`; document.head.appendChild(st); })();

/* ================= Νέα Ελληνικά — Γλώσσα: Παραγωγή λόγου & Θεματικές ενότητες (NA_u05) — prefix na5 ================= */
(function () {
  if (document.getElementById("na5css")) return;
  const st = document.createElement("style"); st.id = "na5css";
  st.textContent = `
.na5grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:10px}
.na5card{border:1px solid var(--line);border-radius:12px;padding:10px 12px;background:#fff}
.na5card h5{font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--blue);margin:0 0 6px}
.na5ta{width:100%;min-height:220px;box-sizing:border-box;font:15px/1.6 Georgia,"Times New Roman",serif;padding:12px;border:1.5px solid var(--line);border-radius:12px;resize:vertical;background:#fffdfb}
.na5ta:focus{outline:none;border-color:var(--blue)}
.na5bar{height:12px;border-radius:99px;background:#eee;position:relative;overflow:hidden;margin:6px 0 2px}
.na5bar i{position:absolute;top:0;bottom:0;left:0;border-radius:99px;transition:width .2s}
.na5bar b{position:absolute;top:-2px;bottom:-2px;width:2px;background:#333;opacity:.5}
.na5stats{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:13.5px;color:var(--ink)}
.na5stats span b{color:var(--navy)}
.na5ok{color:#198754;font-weight:700}.na5no{color:#C62828;font-weight:700}.na5mid{color:#C77A0A;font-weight:700}
.na5chk{list-style:none;margin:6px 0;padding:0}.na5chk li{display:flex;gap:8px;align-items:flex-start;padding:4px 0;font-size:14px;border-top:1px dashed var(--line)}
.na5chk li:first-child{border-top:0}.na5chk input{margin-top:4px;accent-color:var(--blue)}
.na5chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
.na5chip{display:inline-block;user-select:none;border:1.5px solid var(--line);background:#fff;border-radius:99px;padding:5px 11px;font:inherit;font-size:13.5px;cursor:pointer;color:var(--ink);text-align:left;max-width:100%}
.na5chip:hover{border-color:var(--blue)}.na5chip.on{background:var(--blue);border-color:var(--blue);color:#fff}
.na5tabs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.na5tab{border:0;border-radius:9px;padding:6px 12px;font:inherit;font-size:13.5px;font-weight:700;cursor:pointer;background:#f3e9e8;color:var(--navy)}
.na5tab.on{background:var(--blue);color:#fff}
.na5plan{counter-reset:p;margin:6px 0 0;padding:0;list-style:none}
.na5plan li{padding:6px 8px 6px 34px;position:relative;border-radius:8px;margin:4px 0;background:var(--soft);font-size:14px}
.na5plan li::before{counter-increment:p;content:counter(p);position:absolute;left:8px;top:6px;width:18px;height:18px;border-radius:50%;background:var(--blue);color:#fff;font:700 11px/18px var(--sans);text-align:center}
.na5plan li.pro::before,.na5plan li.epi::before{content:"★";background:#6F42C1}
.na5plan li small{color:var(--muted)}
.na5prompt{font:15px/1.6 Georgia,serif;background:#fffdfb;border:1px solid #ecd9d4;border-left:5px solid var(--blue);border-radius:0 12px 12px 0;padding:12px 14px;margin:8px 0}
.na5frm{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:8px 14px;margin:8px 0}
.na5frm label{display:flex;flex-direction:column;gap:4px;font-size:13.5px;font-weight:700;color:var(--navy)}
.na5frm select,.na5frm input{font:inherit;font-weight:500;padding:6px 8px;border-radius:9px;border:1px solid var(--line);max-width:100%}
.na5tbl{width:100%;border-collapse:collapse;font-size:14px;margin-top:8px}.na5tbl td,.na5tbl th{border-top:1px solid var(--line);padding:6px;vertical-align:top;text-align:left}
.na5tbl th{color:var(--blue);white-space:nowrap}
.na5dev{font-size:13.5px;color:var(--muted);margin:2px 0 6px 6px}
.na5budget{display:flex;height:26px;border-radius:9px;overflow:hidden;margin:6px 0;font:700 11.5px var(--sans);color:#fff}
.na5budget div{display:flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden}
`;
  document.head.appendChild(st);
})();

const na5Words = t => (String(t).match(/[A-Za-zΑ-Ωα-ωΆ-Ώά-ώϊϋΐΰ0-9]+(?:[-'’][A-Za-zΑ-Ωα-ωΆ-Ώά-ώ0-9]+)*/g) || []).length;
const na5Esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const na5Pick = a => a[Math.floor(Math.random() * a.length)];
const na5Shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const na5Norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
/* mc με μοναδικές επιλογές: σωστή + λάθη από λίστα */
function na5MC(q, right, wrongs, hint, sol, level = 1) {
  const opts = [right, ...na5Shuf(wrongs.filter(w => w !== right)).slice(0, 3)];
  return { level, type: "mc", q, options: opts, correct: 0, shuffle: true, hint, sol };
}

/* ---------------- Τράπεζα εκφωνήσεων (πρωτότυπες, στο ύφος των Παγκυπρίων) ---------------- */
const NA5_PROMPTS = [
  { t: "Σε άρθρο σας, που θα δημοσιευθεί σε ηλεκτρονική εφημερίδα, να παρουσιάσετε τρεις (3) λόγους για τους οποίους οι νέοι απέχουν από τα κοινά. Ακολούθως, να εισηγηθείτε τρεις (3) τρόπους με τους οποίους η οικογένεια μπορεί να καλλιεργήσει ενεργούς πολίτες.",
    g: "άρθρο", d: "Το ευρύ αναγνωστικό κοινό της εφημερίδας", n: 2, th: 1, z: ["τρεις λόγοι αποχής των νέων από τα κοινά (αίτια)", "τρεις τρόποι με τους οποίους η οικογένεια καλλιεργεί ενεργούς πολίτες (λύσεις – φορέας: οικογένεια)"] },
  { t: "Ως εκπρόσωπος του Κεντρικού Μαθητικού Συμβουλίου, να γράψετε επιστολή προς τον Υπουργό Παιδείας, στην οποία να αναφέρετε τρεις (3) αδυναμίες του σημερινού σχολείου ως προς την προετοιμασία των μαθητών για την αγορά εργασίας. Ακολούθως, να προτείνετε τρεις (3) αλλαγές που θα το βελτίωναν.",
    g: "επιστολή", d: "Ο Υπουργός Παιδείας", n: 2, th: 1, z: ["τρεις αδυναμίες του σχολείου ως προς την προετοιμασία για την αγορά εργασίας", "τρεις προτάσεις αλλαγών (λύσεις – φορέας: πολιτεία/σχολείο)"] },
  { t: "Σε ομιλία σας, που θα εκφωνήσετε σε εκδήλωση του σχολείου σας για την Ημέρα της Ευρώπης, να αναφερθείτε σε τρία (3) οφέλη που απολαμβάνουν οι νέοι της Κύπρου από την ένταξη της χώρας στην Ευρωπαϊκή Ένωση. Ακολούθως, να παρουσιάσετε δύο (2) τρόπους με τους οποίους οι νέοι μπορούν να διατηρήσουν την εθνική και πολιτιστική τους ταυτότητα.",
    g: "ομιλία", d: "Μαθητές, εκπαιδευτικοί και γονείς που παρακολουθούν την εκδήλωση", n: 2, th: 3, z: ["τρία οφέλη της ευρωπαϊκής ένταξης για τους νέους", "δύο τρόποι διατήρησης της εθνικής και πολιτιστικής ταυτότητας"] },
  { t: "Σε δοκίμιό σας να εξετάσετε τις επιπτώσεις της τεχνητής νοημοσύνης στην εργασία και στις ανθρώπινες σχέσεις (δύο επιπτώσεις για κάθε τομέα) και να τοποθετηθείτε για το αν η τεχνολογία απειλεί την ελευθερία του ανθρώπου.",
    g: "δοκίμιο", d: "Ο καλλιεργημένος αναγνώστης (γενικός, απρόσωπος δέκτης)", n: 3, th: 4, z: ["δύο επιπτώσεις της τεχνητής νοημοσύνης στην εργασία", "δύο επιπτώσεις στις ανθρώπινες σχέσεις", "τεκμηριωμένη τοποθέτηση: απειλεί ή όχι την ελευθερία"] },
  { t: "Σε άρθρο σας για τη σχολική εφημερίδα, να εξηγήσετε τρεις (3) τρόπους με τους οποίους η διαφήμιση επηρεάζει τις καταναλωτικές συνήθειες των εφήβων. Στη συνέχεια, να προτείνετε τρία (3) μέτρα που μπορούν να λάβουν οι ίδιοι οι νέοι για να καταναλώνουν υπεύθυνα.",
    g: "άρθρο", d: "Μαθητές, εκπαιδευτικοί και γονείς που διαβάζουν τη σχολική εφημερίδα", n: 2, th: 2, z: ["τρεις τρόποι επίδρασης της διαφήμισης στους εφήβους", "τρία μέτρα υπεύθυνης κατανάλωσης από τους ίδιους τους νέους (φορέας: το άτομο)"] },
  { t: "Να γράψετε ανοιχτή επιστολή προς τους δημάρχους της Κύπρου, στην οποία να παρουσιάσετε τρεις (3) συνέπειες της διατάραξης του οικοσυστήματος στην καθημερινή ζωή των πολιτών και να εισηγηθείτε τρεις (3) δράσεις που μπορούν να αναλάβουν οι δήμοι.",
    g: "επιστολή", d: "Οι δήμαρχοι της Κύπρου (και το κοινό, αφού η επιστολή είναι ανοιχτή)", n: 2, th: 4, z: ["τρεις συνέπειες της οικολογικής διατάραξης στην καθημερινή ζωή", "τρεις δράσεις των δήμων (φορέας: τοπική αυτοδιοίκηση)"] },
  { t: "Σε ομιλία σας, στο πλαίσιο συνεδρίου μαθητικών συμβουλίων, να παρουσιάσετε τρία (3) γνωρίσματα του συνειδητοποιημένου πολίτη και να εξηγήσετε με ποιους τρεις (3) τρόπους το σχολείο μπορεί να συμβάλει στη διαμόρφωσή του.",
    g: "ομιλία", d: "Οι σύνεδροι (μαθητές-εκπρόσωποι, εκπαιδευτικοί, επίσημοι προσκεκλημένοι)", n: 2, th: 1, z: ["τρία γνωρίσματα του συνειδητοποιημένου πολίτη", "τρεις τρόποι συμβολής του σχολείου (φορέας: σχολείο)"] },
  { t: "Σε άρθρο σας, που θα δημοσιευθεί στον ημερήσιο Τύπο, να παρουσιάσετε τρεις (3) αιτίες της υπερκατανάλωσης στις σύγχρονες κοινωνίες και να εξηγήσετε δύο (2) τρόπους με τους οποίους αυτή αλλοτριώνει τον σύγχρονο άνθρωπο.",
    g: "άρθρο", d: "Το ευρύ αναγνωστικό κοινό του Τύπου", n: 2, th: 2, z: ["τρεις αιτίες της υπερκατανάλωσης", "δύο τρόποι με τους οποίους αλλοτριώνει τον άνθρωπο (συνέπειες)"] },
  { t: "Σε άρθρο σας για τη σχολική εφημερίδα, να παρουσιάσετε τρεις (3) συνέπειες της υπερβολικής χρήσης των μέσων κοινωνικής δικτύωσης στη ζωή των εφήβων και να προτείνετε τρεις (3) τρόπους με τους οποίους οι ίδιοι οι μαθητές μπορούν να τα χρησιμοποιούν υπεύθυνα.",
    g: "άρθρο", d: "Μαθητές, εκπαιδευτικοί και γονείς που διαβάζουν τη σχολική εφημερίδα", n: 2, th: 4, z: ["τρεις συνέπειες της υπερβολικής χρήσης των ΜΚΔ", "τρεις τρόποι υπεύθυνης χρήσης από τους ίδιους τους μαθητές (φορέας: το άτομο)"] },
  { t: "Να γράψετε επιστολή προς τον Δήμαρχο της πόλης σας, στην οποία να εξηγήσετε τρεις (3) λόγους για τους οποίους οι νέοι αποφεύγουν να συμμετέχουν στα κοινά της τοπικής κοινωνίας και να εισηγηθείτε τρεις (3) δράσεις του Δήμου που θα τους ενεργοποιούσαν.",
    g: "επιστολή", d: "Ο Δήμαρχος της πόλης", n: 2, th: 1, z: ["τρεις λόγοι αποχής των νέων από τα τοπικά κοινά", "τρεις δράσεις του Δήμου (φορέας: τοπική αυτοδιοίκηση)"] },
  { t: "Σε ομιλία σας, σε εκδήλωση του Συνδέσμου Γονέων του σχολείου σας, να αναφερθείτε σε τρεις (3) τρόπους με τους οποίους η διαφήμιση επηρεάζει τα παιδιά και να προτείνετε τρεις (3) τρόπους με τους οποίους οι γονείς μπορούν να τα προστατεύσουν.",
    g: "ομιλία", d: "Οι γονείς και οι εκπαιδευτικοί που παρακολουθούν την εκδήλωση", n: 2, th: 2, z: ["τρεις τρόποι επίδρασης της διαφήμισης στα παιδιά", "τρεις τρόποι προστασίας από τους γονείς (φορέας: οικογένεια)"] },
  { t: "Σε δοκίμιό σας να εξηγήσετε τη διαφορά ανάμεσα στον πατριωτισμό και στον εθνικισμό και να παρουσιάσετε δύο (2) κινδύνους που κρύβει ο εθνικισμός για τις σύγχρονες πολυπολιτισμικές κοινωνίες.",
    g: "δοκίμιο", d: "Ο καλλιεργημένος αναγνώστης (γενικός, απρόσωπος δέκτης)", n: 2, th: 3, z: ["η διαφορά πατριωτισμού και εθνικισμού (ορισμοί, σύγκριση)", "δύο κίνδυνοι του εθνικισμού για τις πολυπολιτισμικές κοινωνίες"] },
  { t: "Να γράψετε ανοιχτή επιστολή προς τους βουλευτές της Κύπρου, στην οποία να παρουσιάσετε τρεις (3) λόγους για τους οποίους πολλοί νέοι επιστήμονες μεταναστεύουν στο εξωτερικό και να προτείνετε τρία (3) μέτρα της πολιτείας για να παραμείνουν στον τόπο.",
    g: "επιστολή", d: "Οι βουλευτές (και το ευρύ κοινό, αφού η επιστολή είναι ανοιχτή)", n: 2, th: 3, z: ["τρεις λόγοι της μετανάστευσης των νέων επιστημόνων", "τρία μέτρα της πολιτείας (φορέας: πολιτεία)"] },
  { t: "Σε ομιλία σας, σε μαθητικό συνέδριο για την επιστήμη, να παρουσιάσετε δύο (2) οφέλη και δύο (2) κινδύνους από την εξέλιξη της βιοτεχνολογίας και να εξηγήσετε γιατί ο επιστήμονας οφείλει να έχει ηθική ευθύνη.",
    g: "ομιλία", d: "Οι σύνεδροι (μαθητές, εκπαιδευτικοί, επιστήμονες)", n: 3, th: 4, z: ["δύο οφέλη της βιοτεχνολογίας", "δύο κίνδυνοι της βιοτεχνολογίας", "αιτιολόγηση της ηθικής ευθύνης του επιστήμονα"] }
];
const NA5_GENRES = ["άρθρο", "επιστολή", "δοκίμιο", "ομιλία"];

/* ---------------- Χαρακτηριστικά κειμενικών ειδών (τράπεζα για γεννήτρια) ---------------- */
const NA5_FEAT = [
  ["Ξεκινά με προσφώνηση προς το ακροατήριο και κλείνει με ευχαριστίες για την προσοχή του.", "ομιλία"],
  ["Χρησιμοποιεί β΄ πληθυντικό πρόσωπο για άμεση επαφή με τους ακροατές («όπως γνωρίζετε…»).", "ομιλία"],
  ["Απευθύνεται σε συγκεκριμένο πρόσωπο ή φορέα, με προσφώνηση στην αρχή και αποφώνηση στο τέλος.", "επιστολή"],
  ["Στο τέλος του κειμένου μπαίνει αποφώνηση, π.χ. «Με εκτίμηση».", "επιστολή"],
  ["Δημοσιεύεται σε εφημερίδα ή περιοδικό και απευθύνεται σε ευρύ, ανώνυμο αναγνωστικό κοινό.", "άρθρο"],
  ["Σχολιάζει ένα επίκαιρο θέμα και συνήθως κλείνει με προτροπή ή προβληματισμό προς τους αναγνώστες.", "άρθρο"],
  ["Είναι απρόσωπο, κυρίως σε γ΄ πρόσωπο, με αυστηρά λογική οργάνωση και υψηλό, επίσημο ύφος.", "δοκίμιο"],
  ["Διερευνά ένα θέμα σε βάθος, με στοχασμό και τεκμηρίωση, χωρίς προσφωνήσεις ή άμεσο δέκτη.", "δοκίμιο"],
  ["Χρησιμοποιεί ρητορικά ερωτήματα και επαναλήψεις για να κρατήσει ζωντανή την προσοχή όσων ακούν.", "ομιλία"],
  ["Ο πομπός μπορεί να ζητήσει κάτι συγκεκριμένο από τον παραλήπτη (π.χ. την υλοποίηση μιας πρότασης).", "επιστολή"],
  ["Στις εξετάσεις γράφεται χωρίς υπογραφή με ονοματεπώνυμο· στο τέλος μπορεί να υπάρχει μόνο ιδιότητα (π.χ. «Ο/Η πρόεδρος του μαθητικού συμβουλίου»).", "επιστολή"],
  ["Σε αυτό το κείμενο στις Παγκύπριες 2026 οι μαθητές κλήθηκαν να μη γράψουν τίτλο.", "άρθρο"],
  ["Επιτρέπει α΄ πληθυντικό («εμείς οι νέοι») για να δημιουργήσει οικειότητα με τους ακροατές της εκδήλωσης.", "ομιλία"],
  ["Η αρχή του είναι συνήθως ένα «άγκιστρο»: ένα επίκαιρο γεγονός, ένα στατιστικό στοιχείο ή μια είδηση.", "άρθρο"],
  ["Προτιμά τη γενίκευση, τον αφηρημένο λόγο και την πυκνή, μακροπερίοδη σύνταξη.", "δοκίμιο"],
  ["Ανοιχτή μορφή του δημοσιεύεται στον Τύπο, ώστε να τη διαβάσουν και άλλοι πέρα από τον παραλήπτη.", "επιστολή"],
  ["Ο πομπός συχνά αναφέρει ποιος είναι και με ποια ιδιότητα μιλά («Ως πρόεδρος του μαθητικού συμβουλίου…»), μπροστά σε κοινό.", "ομιλία"],
  ["Η πρώτη παράγραφος εξηγεί γιατί ο πομπός απευθύνεται στον συγκεκριμένο παραλήπτη.", "επιστολή"],
  ["Το ύφος του είναι σοβαρό αλλά όχι ψυχρό· κινείται ανάμεσα στην πληροφόρηση και στον σχολιασμό.", "άρθρο"],
  ["Στον επίλογο κλείνει με ευχή, έκκληση ή ευχαριστία προς όσους το παρακολούθησαν.", "ομιλία"],
  ["Έχει διαχρονικό, φιλοσοφικό χαρακτήρα και δεν δεσμεύεται από την επικαιρότητα.", "δοκίμιο"],
  ["Η προσφώνηση στην αρχή συνοδεύεται υποχρεωτικά από αποφώνηση (π.χ. «Με εκτίμηση») στο τέλος.", "επιστολή"],
  ["Μπορεί να έχει υπογραφή αρθρογράφου και τίτλο — εκτός αν η εκφώνηση των εξετάσεων το απαγορεύει.", "άρθρο"],
  ["Η γλώσσα του έχει τόνο προφορικού λόγου, με σαφείς και όχι πολύπλοκες περιόδους, γιατί ο δέκτης δεν μπορεί να «ξαναδιαβάσει».", "ομιλία"],
  ["Γράφεται με πρόθεση να πείσει έναν αξιωματούχο να αναλάβει δράση και κλείνει εκφράζοντας την ελπίδα για θετική ανταπόκριση.", "επιστολή"],
  ["Η συλλογιστική του αναπτύσσεται με ορισμούς, διαιρέσεις και αιτιολογήσεις, σαν μικρή μελέτη.", "δοκίμιο"],
  ["Η επικεφαλίδα του είναι συχνά πιασάρικη, για να προσελκύσει αναγνώστες.", "άρθρο"],
  ["Απαγορεύεται το β΄ ενικό («εσύ»)· αν απευθυνθεί σε κάποιον, το κάνει με β΄ πληθυντικό ευγενείας.", "επιστολή"],
  ["Το περιεχόμενο είναι γραμμένο για να ακουστεί από ζωντανό ακροατήριο σε συγκεκριμένη περίσταση.", "ομιλία"],
  ["Είναι το πιο απρόσωπο και «λόγιο» από τα τέσσερα είδη· η προσωπική φωνή του συγγραφέα υποχωρεί.", "δοκίμιο"],
  ["Μπορεί να αναφέρει επίκαιρα στοιχεία ή έρευνες για να στηρίξει τις θέσεις του σε εφημερίδα.", "άρθρο"],
  ["Ξεκινά με τόπο και ημερομηνία, όταν δεν το απαγορεύει η εκφώνηση.", "επιστολή"]
];

/* ---------------- Προσφωνήσεις / αποφωνήσεις ---------------- */
const NA5_ADDR = [
  /* [προς (με άρθρο → φύλο), προσφώνηση, αποφώνηση, ομάδα αξιώματος] */
  ["τον Υπουργό Παιδείας", "Αξιότιμε κύριε Υπουργέ,", "Με εκτίμηση", "yp"],
  ["την Υπουργό Υγείας", "Αξιότιμη κυρία Υπουργέ,", "Με εκτίμηση", "yp"],
  ["τον Πρόεδρο της Δημοκρατίας", "Εξοχότατε κύριε Πρόεδρε,", "Με βαθύτατο σεβασμό", "pd"],
  ["τον Πρόεδρο της Βουλής των Αντιπροσώπων", "Αξιότιμε κύριε Πρόεδρε της Βουλής των Αντιπροσώπων,", "Με εκτίμηση", "pv"],
  ["τον Δήμαρχο της πόλης σας", "Αξιότιμε κύριε Δήμαρχε,", "Με εκτίμηση", "dm"],
  ["τη Δήμαρχο της πόλης σας", "Αξιότιμη κυρία Δήμαρχε,", "Με εκτίμηση", "dm"],
  ["τη Διευθύντρια του σχολείου σας", "Αξιότιμη κυρία Διευθύντρια,", "Με σεβασμό", "di"],
  ["τον Διευθυντή του σχολείου σας", "Αξιότιμε κύριε Διευθυντά,", "Με σεβασμό", "di"],
  ["τον Αρχισυντάκτη μιας εφημερίδας", "Αξιότιμε κύριε Αρχισυντάκτη,", "Με εκτίμηση", "ar"],
  ["την Αρχισυντάκτρια μιας εφημερίδας", "Αξιότιμη κυρία Αρχισυντάκτρια,", "Με εκτίμηση", "ar"],
  ["την Επίτροπο Περιβάλλοντος", "Αξιότιμη κυρία Επίτροπε,", "Με εκτίμηση", "ep"],
  ["τον Επίτροπο Περιβάλλοντος", "Αξιότιμε κύριε Επίτροπε,", "Με εκτίμηση", "ep"],
  ["τους Ευρωβουλευτές της Κύπρου", "Αξιότιμες κυρίες και αξιότιμοι κύριοι Ευρωβουλευτές,", "Με εκτίμηση", "eu"],
  ["τον Σύνδεσμο Γονέων του σχολείου σας", "Αγαπητά μέλη του Συνδέσμου Γονέων,", "Με εκτίμηση", "sg"],
  ["τους συμμαθητές σας (ανοιχτή επιστολή)", "Αγαπητοί συμμαθητές και αγαπητές συμμαθήτριες,", "Με φιλικούς χαιρετισμούς", "sm"],
  ["τον Αρχιεπίσκοπο", "Μακαριότατε,", "Με βαθύτατο σεβασμό", "ae"],
  ["τον Μητροπολίτη της περιοχής σας", "Σεβασμιότατε,", "Με βαθύτατο σεβασμό", "mt"],
  ["τον Πρύτανη του Πανεπιστημίου", "Αξιότιμε κύριε Πρύτανη,", "Με εκτίμηση", "pr"],
  ["την Πρύτανη του Πανεπιστημίου", "Αξιότιμη κυρία Πρύτανη,", "Με εκτίμηση", "pr"],
  ["τον Αρχηγό της Αστυνομίας", "Αξιότιμε κύριε Αρχηγέ της Αστυνομίας,", "Με εκτίμηση", "as"],
  ["την Πρόεδρο του Οργανισμού Νεολαίας", "Αξιότιμη κυρία Πρόεδρε,", "Με εκτίμηση", "on"],
  ["τον Πρόεδρο του Οργανισμού Νεολαίας", "Αξιότιμε κύριε Πρόεδρε,", "Με εκτίμηση", "on"],
  ["τον Βουλευτή της επαρχίας σας", "Αξιότιμε κύριε Βουλευτά,", "Με εκτίμηση", "bo"],
  ["τη Βουλευτή της επαρχίας σας", "Αξιότιμη κυρία Βουλευτά,", "Με εκτίμηση", "bo"],
  ["τον Πρέσβη της Ελλάδας στην Κύπρο", "Εξοχότατε κύριε Πρέσβη,", "Με εκτίμηση", "ps"],
  ["τον Κοινοτάρχη του χωριού σας", "Αξιότιμε κύριε Κοινοτάρχη,", "Με εκτίμηση", "ko"],
  ["τον Επίτροπο Προστασίας Δεδομένων", "Αξιότιμε κύριε Επίτροπε,", "Με εκτίμηση", "ep"],
  ["τον Υπουργό Γεωργίας και Περιβάλλοντος", "Αξιότιμε κύριε Υπουργέ,", "Με εκτίμηση", "yp"],
  ["την Πρόεδρο του Αθλητικού Σωματείου", "Αξιότιμη κυρία Πρόεδρε,", "Με εκτίμηση", "on"],
  ["τον Επιθεωρητή του μαθήματος", "Αξιότιμε κύριε Επιθεωρητά,", "Με εκτίμηση", "ei"]
];
const NA5_AUD = [
  ["Σχολική εκδήλωση (διευθυντής, καθηγητές, μαθητές, γονείς)", "Κύριε Διευθυντά, αγαπητοί καθηγητές και καθηγήτριες, αγαπητοί γονείς, συμμαθητές και συμμαθήτριες,"],
  ["Συνέδριο μαθητικών συμβουλίων", "Αξιότιμοι προσκεκλημένοι, αγαπητοί σύνεδροι,"],
  ["Ημερίδα με παρουσία του Υπουργού Παιδείας", "Αξιότιμε κύριε Υπουργέ, κυρίες και κύριοι,"],
  ["Εκδήλωση του Δήμου για το περιβάλλον", "Αξιότιμε κύριε Δήμαρχε, κυρίες και κύριοι δημοτικοί σύμβουλοι, αγαπητοί συμπολίτες,"],
  ["Εκδήλωση Συνδέσμου Γονέων", "Αγαπητοί γονείς, αγαπητοί εκπαιδευτικοί,"],
  ["Μαθητική συνέλευση στο αμφιθέατρο", "Αγαπητοί συμμαθητές και συμμαθήτριες,"],
  ["Ευρωπαϊκό Κοινοβούλιο Νέων", "Κυρίες και κύριοι εκπρόσωποι, αγαπητοί φίλοι από όλη την Ευρώπη,"],
  ["Τελετή αποφοίτησης", "Κύριε Διευθυντά, αγαπητοί καθηγητές και καθηγήτριες, αγαπητοί γονείς, αγαπητοί συναπόφοιτοι,"],
  ["Εκδήλωση μνήμης με παρουσία του Μητροπολίτη", "Σεβασμιότατε, κύριε Διευθυντά, αγαπητοί καθηγητές, γονείς και μαθητές,"],
  ["Βουλή των Νέων, στην Ολομέλεια", "Κύριε Πρόεδρε, αγαπητοί συνάδελφοι νέοι βουλευτές,"],
  ["Ημερίδα του Οργανισμού Νεολαίας", "Αξιότιμη κυρία Πρόεδρε του Οργανισμού Νεολαίας, αγαπητοί φίλοι,"],
  ["Επίσκεψη μαθητών από αδελφοποιημένο σχολείο της Ευρώπης", "Αγαπητοί φίλοι από την Ευρώπη, αγαπητοί συμμαθητές και συμμαθήτριες,"],
  ["Περιβαλλοντική εκστρατεία στην κοινότητα με τον Κοινοτάρχη", "Αξιότιμε κύριε Κοινοτάρχη, αγαπητοί συγχωριανοί,"],
  ["Εκδήλωση Ερυθρού Σταυρού για την αιμοδοσία", "Κυρίες και κύριοι εκπρόσωποι του Ερυθρού Σταυρού, αγαπητοί εθελοντές,"],
  ["Τελετή βράβευσης μαθητικού διαγωνισμού από το Υπουργείο", "Αξιότιμε κύριε Υπουργέ, αξιότιμοι κριτές, αγαπητοί διαγωνιζόμενοι,"],
  ["Μαθητικό συνέδριο για την επιστήμη", "Αξιότιμοι προσκεκλημένοι επιστήμονες, αγαπητοί σύνεδροι,"]
];

/* ---------------- Τεχνικές προλόγου ---------------- */
const NA5_INTRO = [
  ["Η διαφήμιση ορίζεται ως η επικοινωνιακή διαδικασία με την οποία προβάλλονται προϊόντα, υπηρεσίες ή ιδέες, με στόχο να επηρεαστεί η συμπεριφορά του κοινού.", "ορισμός της βασικής έννοιας"],
  ["Ενεργός πολίτης είναι εκείνος που ενημερώνεται, συμμετέχει και αναλαμβάνει ευθύνη για τα κοινά, αντί να περιμένει από τους άλλους τη λύση.", "ορισμός της βασικής έννοιας"],
  ["Πρόσφατη έρευνα έδειξε ότι ένας στους τρεις εφήβους περνά πάνω από πέντε ώρες την ημέρα μπροστά σε μια οθόνη.", "αναφορά σε στατιστικό στοιχείο/έρευνα"],
  ["Σύμφωνα με στοιχεία ευρωπαϊκών οργανισμών, η Κύπρος βρίσκεται ανάμεσα στις χώρες με τη μεγαλύτερη παραγωγή αποβλήτων ανά κάτοικο.", "αναφορά σε στατιστικό στοιχείο/έρευνα"],
  ["Ζούμε σε μια εποχή όπου η τεχνολογία εξελίσσεται ταχύτερα απ’ ό,τι μπορεί να την κατανοήσει ο άνθρωπος.", "γενική διαπίστωση για την εποχή"],
  ["Η σύγχρονη κοινωνία χαρακτηρίζεται από την ταχύτητα, την αφθονία των αγαθών και την πληθώρα των πληροφοριών.", "γενική διαπίστωση για την εποχή"],
  ["Μπορεί ένας άνθρωπος να είναι πραγματικά ελεύθερος, όταν οι επιλογές του υπαγορεύονται από διαφημιστικά μηνύματα;", "ερώτημα προς τον αναγνώστη"],
  ["Τι σημαίνει, άραγε, να είσαι Ευρωπαίος πολίτης χωρίς να χάνεις τη δική σου ταυτότητα;", "ερώτημα προς τον αναγνώστη"],
  ["Τις τελευταίες ημέρες οι πυρκαγιές που κατέκαψαν χιλιάδες στρέμματα δάσους επανέφεραν στο προσκήνιο το ζήτημα της κλιματικής κρίσης.", "αφορμή από επίκαιρο γεγονός"],
  ["Η πρόσφατη ψήφιση του νόμου για την ψηφιακή ασφάλεια των ανηλίκων άνοιξε έναν δημόσιο διάλογο για τα όρια της τεχνολογίας.", "αφορμή από επίκαιρο γεγονός"],
  ["Από την αρχαία αγορά της Αθήνας μέχρι τα σημερινά κοινοβούλια, η συμμετοχή του πολίτη θεωρήθηκε θεμέλιο της δημοκρατίας.", "ιστορική αναδρομή"],
  ["Πριν από μερικές δεκαετίες ο καταναλωτής αγόραζε ό,τι χρειαζόταν· σήμερα συχνά χρειάζεται ό,τι αγοράζει.", "ιστορική αναδρομή/σύγκριση παρελθόντος–παρόντος"],
  ["Θυμάμαι την πρώτη φορά που συμμετείχα σε περιβαλλοντική δράση του σχολείου: μια μικρή παραλία γεμάτη πλαστικά άλλαξε για πάντα τον τρόπο που βλέπω την κατανάλωση.", "προσωπικό βίωμα/μικρή αφήγηση"],
  ["Ένα πρωί, στο λεωφορείο, παρατήρησα ότι όλοι οι επιβάτες κοιτούσαν μια οθόνη· κανείς δεν μιλούσε με κανέναν.", "προσωπικό βίωμα/μικρή αφήγηση"],
  ["«Ο άνθρωπος είναι μέτρο όλων των πραγμάτων» υποστήριζε ο Πρωταγόρας· σήμερα, όμως, φαίνεται πως μέτρο έχει γίνει το κέρδος.", "παράθεση ρήσης/γνωμικού"],
  ["Όπως έλεγαν οι αρχαίοι, «παιδεία πρώτη στους ανθρώπους»· η φράση αυτή αποκτά νέο νόημα στην εποχή της πληροφορίας.", "παράθεση ρήσης/γνωμικού"],
  ["Η τεχνολογία είναι ένα δίκοπο μαχαίρι: μπορεί να θεραπεύσει, αλλά και να τραυματίσει.", "εικόνα (μεταφορά ή παρομοίωση)"],
  ["Ο σύγχρονος καταναλωτής μοιάζει με ναυαγό που πνίγεται μέσα σε μια θάλασσα από προσφορές.", "εικόνα (μεταφορά ή παρομοίωση)"],
  ["Το ζήτημα της εκπαίδευσης συζητείται εδώ και χρόνια· άλλοι τη θεωρούν μηχανισμό απόκτησης πτυχίων και άλλοι εργαστήρι ανθρωπιάς.", "παρουσίαση αντιτιθέμενων απόψεων"],
  ["Για άλλους η παγκοσμιοποίηση είναι ευκαιρία συνεργασίας των λαών, για άλλους απειλή για τις εθνικές ταυτότητες.", "παρουσίαση αντιτιθέμενων απόψεων"],
  ["Ως εθελοντισμός νοείται η αφιλοκερδής προσφορά χρόνου και δυνάμεων για το κοινό καλό.", "ορισμός της βασικής έννοιας"],
  ["Η τεχνητή νοημοσύνη είναι η ικανότητα των μηχανών να μαθαίνουν από δεδομένα και να παίρνουν αποφάσεις.", "ορισμός της βασικής έννοιας"],
  ["Σύμφωνα με πρόσφατη μελέτη, οι μισοί σχεδόν νέοι της Ευρώπης δηλώνουν ότι δεν εμπιστεύονται τα πολιτικά κόμματα.", "αναφορά σε στατιστικό στοιχείο/έρευνα"],
  ["Περισσότερα από οκτώ εκατομμύρια τόνοι πλαστικού καταλήγουν κάθε χρόνο στις θάλασσες, σύμφωνα με διεθνείς οργανισμούς.", "αναφορά σε στατιστικό στοιχείο/έρευνα"],
  ["Η εποχή μας συχνά χαρακτηρίζεται ως «εποχή της πληροφορίας», όμως η αφθονία της πληροφορίας δεν συνεπάγεται πάντα γνώση.", "γενική διαπίστωση για την εποχή"],
  ["Είναι, τελικά, η εκπαίδευση προετοιμασία για τις εξετάσεις ή προετοιμασία για τη ζωή;", "ερώτημα προς τον αναγνώστη"],
  ["Η πρόσφατη ανακοίνωση ότι κλείνουν τρία κοινοτικά σχολεία λόγω έλλειψης μαθητών έφερε ξανά στο προσκήνιο την ερήμωση της υπαίθρου.", "αφορμή από επίκαιρο γεγονός"],
  ["Η ιστορία της Κύπρου είναι γεμάτη από κατακτητές που πέρασαν· ο πολιτισμός της, όμως, άντεξε μέσα στους αιώνες.", "ιστορική αναδρομή"],
  ["Όταν πήγα για πρώτη φορά εθελοντής σε ένα γηροκομείο, κατάλαβα πόσο λίγο χρόνο αφιερώνουμε στους άλλους.", "προσωπικό βίωμα/μικρή αφήγηση"],
  ["«Ουκ εν τω πολλώ το ευ», έλεγαν οι αρχαίοι· η σοφία αυτή ακούγεται σήμερα σχεδόν επαναστατική.", "παράθεση ρήσης/γνωμικού"]
];
const NA5_INTRO_T = [...new Set(NA5_INTRO.map(x => x[1]))];

/* ---------------- Θεματικές ενότητες: τράπεζες ιδεών ---------------- */
const NA5_TH = {
  1: { name: "Παιδεία – Εκπαίδευση · Ενεργός, συνειδητοποιημένος, ελεύθερος πολίτης",
    cats: {
      "Έννοιες": [["Παιδεία", "Η ολόπλευρη καλλιέργεια του ανθρώπου — πνευματική, ηθική, συναισθηματική, σωματική — ώστε να γίνει ολοκληρωμένη προσωπικότητα."], ["Εκπαίδευση", "Η οργανωμένη, θεσμική μετάδοση γνώσεων και δεξιοτήτων (σχολείο, πανεπιστήμιο)· μέσο της παιδείας, όχι ταυτόσημο μ’ αυτήν."], ["Ενεργός πολίτης", "Συμμετέχει στα κοινά (εκλογές, εθελοντισμός, συλλογικότητες) και δεν μένει θεατής."], ["Συνειδητοποιημένος πολίτης", "Γνωρίζει δικαιώματα και υποχρεώσεις, ενημερώνεται κριτικά και αντιλαμβάνεται τις συνέπειες των πράξεών του."], ["Ελεύθερος πολίτης", "Σκέφτεται αυτόνομα, δεν χειραγωγείται από ΜΜΕ, κόμματα ή πρότυπα· η ελευθερία συνοδεύεται από ευθύνη."], ["Κριτική σκέψη", "Η ικανότητα να ελέγχει κανείς πληροφορίες και επιχειρήματα πριν τα αποδεχθεί."]],
      "Αίτια προβλημάτων": [["Βαθμοθηρία – εξετασιοκεντρισμός", "Το σχολείο προετοιμάζει για εξετάσεις και όχι για τη ζωή· η μάθηση γίνεται μέσο, όχι αξία."], ["Αποστήθιση και πληθώρα ύλης", "Δεν μένει χρόνος για διάλογο, έρευνα, δημιουργικότητα."], ["Χρησιμοθηρική αντίληψη για τη μόρφωση", "Η γνώση μετριέται μόνο με το επάγγελμα και τα χρήματα που αποφέρει."], ["Απαξίωση της πολιτικής", "Η διαφθορά και οι αναξιόπιστοι πολιτικοί ωθούν τους νέους στην αποχή."], ["Ατομικισμός", "Ο καθένας κοιτάζει το συμφέρον του· τα κοινά θεωρούνται «υπόθεση των άλλων»."], ["Παθητική ψυχαγωγία", "Οθόνες και ΜΚΔ καταναλώνουν τον ελεύθερο χρόνο και καλλιεργούν ενός είδους αδράνεια."]],
      "Συνέπειες": [["Μονοδιάστατοι άνθρωποι", "Εξειδικευμένοι αλλά χωρίς ανθρωπιστική καλλιέργεια και αξίες."], ["Άγχος και εξουθένωση", "Η πίεση των εξετάσεων φθείρει την ψυχική υγεία των μαθητών."], ["Πολίτες-θεατές", "Αποχή από τις εκλογές και τα κοινά, που αφήνει χώρο σε λίγους να αποφασίζουν για όλους."], ["Ευκολία χειραγώγησης", "Όποιος δεν σκέφτεται κριτικά πέφτει θύμα δημαγωγίας και ψευδών ειδήσεων."], ["Αποδυνάμωση της δημοκρατίας", "Η δημοκρατία ζει μόνο όταν οι πολίτες συμμετέχουν."], ["Κοινωνική αποξένωση", "Ατομικισμός και αδιαφορία για τον συνάνθρωπο."]],
      "Λύσεις – φορείς": [["Σχολείο: ανθρωποκεντρική παιδεία", "Λιγότερη ύλη, περισσότερος διάλογος, ερευνητικές εργασίες, μαθήματα ανθρωπιστικά και τέχνες."], ["Σχολείο: μαθητικά συμβούλια και βιωματικές δράσεις", "Η δημοκρατία μαθαίνεται με την άσκησή της (εκλογές, εθελοντισμός, project)."], ["Οικογένεια", "Διάλογος, παράδειγμα συμμετοχής, ενθάρρυνση της αυτονομίας του παιδιού."], ["Πολιτεία", "Διαφάνεια, αξιοκρατία, θεσμοί διαβούλευσης για τους νέους (π.χ. Βουλή των Νέων)."], ["ΜΜΕ", "Ποιοτική ενημέρωση, εκπομπές που προβάλλουν θετικά πρότυπα ενεργών πολιτών."], ["Το ίδιο το άτομο", "Ενημέρωση από πολλές πηγές, συμμετοχή σε συλλογικότητες, εθελοντισμός."]]
    } },
  2: { name: "Οικονομία – Διαφήμιση – Καταναλωτισμός · Υποδούλωση του σύγχρονου ανθρώπου",
    cats: {
      "Έννοιες": [["Καταναλωτισμός", "Η τάση να αγοράζουμε περισσότερα από όσα χρειαζόμαστε, ως αυτοσκοπό και μέσο κοινωνικής καταξίωσης."], ["Διαφήμιση", "Επικοινωνιακή διαδικασία προβολής προϊόντων, υπηρεσιών ή ιδεών, με στόχο να επηρεάσει τη συμπεριφορά του κοινού."], ["Πλασματικές ανάγκες", "Ανάγκες που δεν πηγάζουν από τον άνθρωπο αλλά του δημιουργούνται τεχνητά από τη διαφήμιση."], ["Υλισμός – «έχειν» αντί «είναι»", "Η ταύτιση της ευτυχίας με την κατοχή αγαθών."], ["Υποδούλωση/αλλοτρίωση", "Ο άνθρωπος χάνει την αυτονομία του και γίνεται εξαρτημένος από την κατανάλωση και την εργασία για να καταναλώνει."], ["Ηθικός/υπεύθυνος καταναλωτής", "Επιλέγει με κριτήρια ανάγκης, ποιότητας, δεοντολογίας και περιβάλλοντος."]],
      "Αίτια": [["Ισχυρή και ψυχολογικά «έξυπνη» διαφήμιση", "Συνδέει τα προϊόντα με την ευτυχία, την ομορφιά, την αποδοχή."], ["Προσωποποιημένη διαδικτυακή διαφήμιση", "Οι αλγόριθμοι γνωρίζουν τις επιθυμίες μας και μας «κυνηγούν»."], ["Κοινωνική πίεση και ανάγκη αποδοχής", "Τα αγαθά γίνονται σύμβολα κοινωνικής θέσης."], ["Πνευματική κενότητα", "Η κατανάλωση καλύπτει υπαρξιακό κενό, μοναξιά, ανία."], ["Εύκολη πίστωση", "Κάρτες και δάνεια δίνουν την ψευδαίσθηση ότι όλα είναι προσιτά."], ["Ελλιπής καταναλωτική παιδεία", "Ο πολίτης δεν έχει μάθει να αποκωδικοποιεί τα μηνύματα."]],
      "Συνέπειες": [["Στο άτομο: άγχος, ανασφάλεια, ανικανοποίητο", "Πάντα υπάρχει κάτι νεότερο να αποκτήσει."], ["Στο άτομο: οικονομική εξάρτηση και χρέη", "Υπερχρέωση και εργασιομανία για να συντηρηθεί ο τρόπος ζωής."], ["Στις σχέσεις: αποξένωση και ατομικισμός", "Οι άνθρωποι αξιολογούνται με βάση όσα έχουν."], ["Στην κοινωνία: ανισότητες και φθόνος", "Όσοι δεν μπορούν να καταναλώνουν νιώθουν περιθωριοποιημένοι."], ["Στο περιβάλλον: εξάντληση πόρων και απόβλητα", "Η υπερπαραγωγή επιβαρύνει τον πλανήτη."], ["Στον πολιτισμό: ομοιομορφία", "Παγκόσμια πρότυπα κατανάλωσης ισοπεδώνουν τις τοπικές παραδόσεις."]],
      "Λύσεις – φορείς": [["Σχολείο: καταναλωτική και ψηφιακή παιδεία", "Αποκωδικοποίηση διαφημίσεων, κριτική σκέψη, οικονομικός γραμματισμός."], ["Οικογένεια: μέτρο και παράδειγμα", "Οι γονείς δείχνουν ότι η αξία δεν μετριέται με τα αγαθά."], ["Πολιτεία: νομοθεσία και έλεγχος", "Κανόνες για παραπλανητικές διαφημίσεις και διαφημίσεις προς παιδιά."], ["ΜΜΕ: δεοντολογία", "Αυτορρύθμιση, διάκριση διαφήμισης από ενημέρωση."], ["Οργανώσεις καταναλωτών", "Ενημέρωση, συγκριτικοί έλεγχοι, προστασία δικαιωμάτων."], ["Το άτομο: συνειδητή κατανάλωση", "Ερώτηση «το χρειάζομαι;», ανακύκλωση, επαναχρησιμοποίηση, μποϊκοτάζ ανήθικων εταιρειών."]]
    } },
  3: { name: "Κύπρος – Ελλάδα – Ευρώπη – Κόσμος",
    cats: {
      "Έννοιες": [["Εθνική ταυτότητα", "Το σύνολο των στοιχείων (γλώσσα, ιστορία, παράδοση, θρησκεία, πολιτισμός) που συνδέουν τα μέλη ενός έθνους."], ["Ευρωπαϊκή ταυτότητα", "Κοινές αξίες: δημοκρατία, ανθρώπινα δικαιώματα, κράτος δικαίου, ελευθερία κινήσεως."], ["Παγκοσμιοποίηση", "Η αυξανόμενη αλληλεξάρτηση οικονομιών, πολιτισμών και κοινωνιών σε όλο τον κόσμο."], ["Πολυπολιτισμικότητα", "Η συνύπαρξη ανθρώπων διαφορετικής καταγωγής, γλώσσας και θρησκείας στην ίδια κοινωνία."], ["Πολιτιστική ομογενοποίηση", "Η εξαφάνιση των τοπικών ιδιαιτεροτήτων μπροστά σε ένα κυρίαρχο παγκόσμιο πρότυπο."], ["Εθνικισμός – πατριωτισμός", "Ο πατριωτισμός είναι αγάπη για την πατρίδα· ο εθνικισμός την υπερτιμά, υποτιμώντας τους άλλους λαούς."]],
      "Οφέλη – θετικά": [["Ελεύθερη κυκλοφορία και σπουδές", "Προγράμματα Erasmus+, εργασία σε άλλες χώρες της ΕΕ."], ["Οικονομική στήριξη", "Ευρωπαϊκά κονδύλια για υποδομές, έρευνα, απασχόληση νέων."], ["Πολιτική ασφάλεια και διεθνής φωνή", "Η Κύπρος συμμετέχει στις αποφάσεις ενός ισχυρού διεθνούς οργανισμού."], ["Γνωριμία με άλλους πολιτισμούς", "Ανοχή, ευρύτητα πνεύματος, ξένες γλώσσες."], ["Κοινές αξίες και θεσμοί", "Προστασία δικαιωμάτων, περιβάλλοντος, καταναλωτή."], ["Ενίσχυση των δεσμών Κύπρου–Ελλάδας", "Κοινή ευρωπαϊκή πορεία, συνεργασία σε παιδεία και πολιτισμό."]],
      "Κίνδυνοι – προβλήματα": [["Αλλοίωση της ταυτότητας", "Ξενομανία, υποχώρηση της ελληνικής γλώσσας (γκρίκλις, αγγλισμοί)."], ["Ομογενοποίηση της νεολαίας", "Ίδια μουσική, ρούχα, συνήθειες σε όλο τον κόσμο."], ["Οικονομική εξάρτηση", "Οι μικρές χώρες επηρεάζονται έντονα από διεθνείς κρίσεις."], ["Μετανάστευση νέων (brain drain)", "Οι μορφωμένοι νέοι φεύγουν και η χώρα χάνει δυναμικό."], ["Ξενοφοβία και ρατσισμός", "Φόβος απέναντι στον «άλλο», ιδιαίτερα σε περιόδους κρίσης."], ["Το άλυτο Κυπριακό", "Η κατοχή και η διαίρεση εξακολουθούν να πληγώνουν τον τόπο."]],
      "Λύσεις – φορείς": [["Σχολείο: ιστορική μνήμη και γλώσσα", "Διδασκαλία ιστορίας, λογοτεχνίας, παράδοσης με ζωντανό, όχι αρχειακό τρόπο."], ["Σχολείο: διαπολιτισμική αγωγή", "Ανταλλαγές, προγράμματα συνεργασίας, γνωριμία με άλλους λαούς."], ["Οικογένεια", "Μεταφορά παραδόσεων, ιστοριών, ηθών· σεβασμός στη διαφορετικότητα."], ["Πολιτεία", "Στήριξη του πολιτισμού, κίνητρα για παραμονή των νέων, διεθνής προβολή του Κυπριακού."], ["ΜΜΕ – διαδίκτυο", "Προβολή ελληνικής παραγωγής και πολιτισμού στις νέες πλατφόρμες."], ["Το άτομο", "Ανοιχτότητα χωρίς αφομοίωση: «ρίζες και φτερά»."]]
    } },
  4: { name: "Επιστήμη – Τεχνολογία · Εξανδραποδισμός – Διατάραξη οικοσυστήματος",
    cats: {
      "Έννοιες": [["Επιστήμη", "Η συστηματική, τεκμηριωμένη γνώση του κόσμου, που προκύπτει από παρατήρηση, πείραμα και έλεγχο."], ["Τεχνολογία", "Η εφαρμογή της επιστημονικής γνώσης για την κατασκευή μέσων που διευκολύνουν τη ζωή."], ["Εξανδραποδισμός", "(κυριολεκτικά: πώληση ανθρώπων ως δούλων) — μεταφορικά, η υποδούλωση του ανθρώπου στα ίδια του τα δημιουργήματα: μηχανές, οθόνες, αλγόριθμους."], ["Οικοσύστημα", "Το σύνολο των ζωντανών οργανισμών και του περιβάλλοντος στο οποίο αλληλεπιδρούν."], ["Αειφορία – βιώσιμη ανάπτυξη", "Ανάπτυξη που καλύπτει τις ανάγκες του σήμερα χωρίς να στερεί τις επόμενες γενιές."], ["Βιοηθική", "Ο κλάδος που εξετάζει τα ηθικά όρια των επιστημών της ζωής (κλωνοποίηση, γενετική μηχανική)."]],
      "Οφέλη": [["Υγεία και μακροζωία", "Φάρμακα, εμβόλια, ιατρική τεχνολογία."], ["Επικοινωνία και γνώση", "Άμεση πρόσβαση στην πληροφορία, εξ αποστάσεως εκπαίδευση."], ["Ευκολία στην εργασία", "Αυτοματοποίηση επίπονων εργασιών, περισσότερος ελεύθερος χρόνος."], ["Λύσεις για το περιβάλλον", "Ανανεώσιμες πηγές ενέργειας, ηλεκτροκίνηση, ανακύκλωση."], ["Οικονομική ανάπτυξη", "Νέα επαγγέλματα και καινοτομία."], ["Δημοκρατικότητα της πληροφορίας", "Ο καθένας μπορεί να εκφραστεί και να ενημερωθεί."]],
      "Κίνδυνοι – συνέπειες": [["Εξάρτηση από οθόνες και ΜΚΔ", "Εθισμός, μείωση συγκέντρωσης, μοναξιά παρά τη «σύνδεση»."], ["Ανεργία λόγω αυτοματοποίησης/ΤΝ", "Επαγγέλματα που αντικαθίστανται από μηχανές."], ["Παραβίαση ιδιωτικότητας", "Συλλογή προσωπικών δεδομένων, παρακολούθηση."], ["Ψευδείς ειδήσεις και χειραγώγηση", "Η τεχνολογία διευκολύνει την παραπληροφόρηση."], ["Κλιματική αλλαγή και ρύπανση", "Βιομηχανία, μεταφορές και υπερκατανάλωση διαταράσσουν το οικοσύστημα."], ["Απώλεια βιοποικιλότητας", "Εξαφάνιση ειδών, αποψίλωση δασών, ερημοποίηση."]],
      "Λύσεις – φορείς": [["Σχολείο: ψηφιακός και περιβαλλοντικός γραμματισμός", "Κριτική χρήση της τεχνολογίας, περιβαλλοντικά προγράμματα."], ["Επιστήμονες: ηθική ευθύνη", "Δεοντολογία, βιοηθική, έρευνα στην υπηρεσία του ανθρώπου."], ["Πολιτεία – διεθνείς οργανισμοί", "Νομοθεσία για δεδομένα και ΤΝ, δεσμευτικές συμφωνίες για το κλίμα."], ["Οικογένεια", "Όρια στον χρόνο οθόνης, παράδειγμα οικολογικής συμπεριφοράς."], ["ΜΜΕ", "Ενημέρωση για την κλιματική κρίση χωρίς κινδυνολογία."], ["Το άτομο", "Ψηφιακή αποτοξίνωση, ανακύκλωση, μείωση του αποτυπώματος άνθρακα."]]
    } }
};
const NA5_VOC = {
  1: [["αξιοκρατία", "η επιλογή και η επιβράβευση με βάση τις ικανότητες και την αξία"], ["βαθμοθηρία", "η υπερβολική επιδίωξη υψηλών βαθμών ως αυτοσκοπού"], ["χειραγώγηση", "ο έλεγχος της σκέψης ή της συμπεριφοράς κάποιου χωρίς να το αντιλαμβάνεται"], ["απολιτικοποίηση", "η απομάκρυνση του πολίτη από το ενδιαφέρον για τα κοινά"], ["δημαγωγία", "η εκμετάλλευση των συναισθημάτων του λαού με ψεύτικες υποσχέσεις"], ["εθελοντισμός", "η αφιλοκερδής προσφορά εργασίας και χρόνου για το κοινό καλό"], ["αυτονομία", "η ικανότητα να σκέφτεται και να αποφασίζει κανείς μόνος του"], ["ενσυναίσθηση", "η ικανότητα να κατανοούμε τα συναισθήματα του άλλου, σαν να ήμασταν στη θέση του"], ["χρησιμοθηρία", "η αντίληψη ότι αξία έχει μόνο ό,τι αποφέρει πρακτικό όφελος"], ["ανθρωπισμός", "η στάση που θέτει στο κέντρο τον άνθρωπο, την αξιοπρέπεια και την καλλιέργειά του"]],
  2: [["υπερκατανάλωση", "η κατανάλωση πέρα από τις πραγματικές ανάγκες"], ["αλλοτρίωση", "η αποξένωση του ανθρώπου από τον εαυτό του και τους άλλους"], ["ευδαιμονισμός", "η αντίληψη ότι σκοπός της ζωής είναι η απόλαυση και η ευημερία"], ["μιμητισμός", "η άκριτη αντιγραφή της συμπεριφοράς των άλλων"], ["καταναλωτική συνείδηση", "η επίγνωση των δικαιωμάτων και των ευθυνών του καταναλωτή"], ["ευζωία", "η ποιότητα ζωής που βασίζεται σε ισορροπία, υγεία και ουσιαστικές σχέσεις"], ["ολιγάρκεια", "η ικανοποίηση με τα λίγα, η αποφυγή της πολυτέλειας"], ["παραπλανητική διαφήμιση", "η διαφήμιση που λέει τη μισή αλήθεια ή εξαπατά τον καταναλωτή"], ["μποϊκοτάζ", "η άρνηση αγοράς προϊόντων ως ένδειξη αποδοκιμασίας"], ["εργασιομανία", "η υπερβολική, σχεδόν εξαρτησιακή αφοσίωση στην εργασία"]],
  3: [["ξενομανία", "η υπερβολική προτίμηση σε ό,τι είναι ξένο, με υποτίμηση του δικού μας"], ["αφομοίωση", "η απορρόφηση μιας ομάδας από μια άλλη, με απώλεια της ταυτότητάς της"], ["διαπολιτισμικότητα", "η αλληλεπίδραση και ο αμοιβαίος σεβασμός διαφορετικών πολιτισμών"], ["ξενοφοβία", "ο παράλογος φόβος ή η εχθρότητα απέναντι στους ξένους"], ["ομογενοποίηση", "η εξίσωση και η εξαφάνιση των διαφορών"], ["ιστορική μνήμη", "η διατήρηση στη συλλογική συνείδηση των γεγονότων του παρελθόντος"], ["διαρροή εγκεφάλων", "η μετανάστευση των μορφωμένων νέων στο εξωτερικό"], ["κοσμοπολιτισμός", "η αντίληψη ότι ο άνθρωπος είναι πολίτης όλου του κόσμου"], ["εθνοκεντρισμός", "η θεώρηση του δικού μας έθνους ως ανώτερου και μέτρου για τα άλλα"], ["αλληλεγγύη", "η αμοιβαία στήριξη και η συνυπευθυνότητα ανάμεσα σε ανθρώπους ή λαούς"]],
  4: [["εξανδραποδισμός", "μεταφορικά, η υποδούλωση του ανθρώπου στα δημιουργήματά του"], ["αειφορία", "η ανάπτυξη που δεν εξαντλεί τους πόρους για τις επόμενες γενιές"], ["βιοποικιλότητα", "η ποικιλία των μορφών ζωής σε έναν τόπο"], ["αποψίλωση", "η καταστροφή των δασών, η κοπή των δέντρων μιας περιοχής"], ["ερημοποίηση", "η μετατροπή γόνιμων περιοχών σε άγονες"], ["τεχνοκρατία", "η κυριαρχία της τεχνικής λογικής πάνω στις ανθρώπινες αξίες"], ["τεχνοφοβία", "ο φόβος ή η απόρριψη της τεχνολογίας"], ["ιδιωτικότητα", "το δικαίωμα του ατόμου να προστατεύει τα προσωπικά του δεδομένα και τη ζωή του"], ["παραπληροφόρηση", "η διάδοση ψευδών ή παραποιημένων πληροφοριών"], ["αποτύπωμα άνθρακα", "η συνολική ποσότητα διοξειδίου του άνθρακα που εκλύεται από τις δραστηριότητές μας"]]
};

/* ---------------- Ρυθμίσεις ειδών για τον «σχεδιαστή κειμένου» ---------------- */
const NA5_GSET = {
  "άρθρο": { opener: false, closer: false, title: "warn", chk: ["Ο πρόλογος έχει «άγκιστρο» (επικαιρότητα, ερώτημα, στοιχείο) και εισάγει το θέμα", "Το κύριο μέρος έχει μία παράγραφο για κάθε σημείο κάθε ζητουμένου", "Κάθε παράγραφος έχει θεματική περίοδο, λεπτομέρειες, κατακλείδα", "Υπάρχουν διαρθρωτικές λέξεις ανάμεσα στις παραγράφους (Αρχικά, Επιπλέον, Ωστόσο…)", "Το ύφος είναι σοβαρό αλλά ζωντανό· μπορεί να χρησιμοποιηθεί α΄ πληθυντικό", "Ο επίλογος ανακεφαλαιώνει και κλείνει με προτροπή ή προβληματισμό", "Δεν υπάρχει τίτλος/ονοματεπώνυμο (όπως ορίζει η εκφώνηση)"] },
  "επιστολή": { opener: true, closer: true, title: "no", chk: ["Υπάρχει σωστή προσφώνηση με κόμμα (π.χ. «Αξιότιμε κύριε Υπουργέ,»)", "Η πρώτη παράγραφος δηλώνει ποιος γράφει (ιδιότητα) και γιατί", "Το κύριο μέρος απαντά σε όλα τα ζητούμενα με μία παράγραφο ανά σημείο", "Ευγενικό, επίσημο ύφος· β΄ πληθυντικός ευγενείας προς τον παραλήπτη", "Ο επίλογος εκφράζει ελπίδα για ανταπόκριση/ευχαριστεί", "Υπάρχει αποφώνηση (π.χ. «Με εκτίμηση») και ιδιότητα, όχι ονοματεπώνυμο"] },
  "δοκίμιο": { opener: false, closer: false, title: "ok", chk: ["Ο πρόλογος ορίζει τη βασική έννοια ή θέτει το πρόβλημα με γενικό τρόπο", "Λόγος απρόσωπος, κυρίως σε γ΄ πρόσωπο", "Αυστηρή λογική οργάνωση: θέση → επιχειρήματα/τεκμήρια → συμπέρασμα", "Ποικιλία τρόπων ανάπτυξης (ορισμός, διαίρεση, σύγκριση, αίτιο–αποτέλεσμα)", "Ύφος υψηλό, επίσημο, με ακριβολογία και αφηρημένο λεξιλόγιο", "Ο επίλογος συνθέτει και αναδεικνύει τη διαχρονική διάσταση του θέματος"] },
  "ομιλία": { opener: true, closer: true, title: "no", chk: ["Προσφώνηση του ακροατηρίου ανάλογα με την περίσταση", "Ο ομιλητής δηλώνει ιδιότητα και αφορμή της ομιλίας", "Άμεσο ύφος: α΄ και β΄ πληθυντικό, ρητορικά ερωτήματα, επαναλήψεις", "Σαφείς διαρθρωτικές λέξεις, ώστε ο ακροατής να «ακολουθεί»", "Απάντηση σε όλα τα ζητούμενα, μία παράγραφος ανά σημείο", "Επίλογος με έκκληση/ευχή και ευχαριστία («Σας ευχαριστώ για την προσοχή σας»)"] }
};
const NA5_CONN = ["αρχικά", "καταρχάς", "καταρχήν", "πρώτα", "επιπλέον", "επιπρόσθετα", "ακόμη", "επίσης", "επιπροσθέτως", "παράλληλα", "ωστόσο", "όμως", "αντίθετα", "αντιθέτως", "εντούτοις", "επομένως", "συνεπώς", "άρα", "συμπερασματικά", "συνοψίζοντας", "τέλος", "τελικά", "συγκεκριμένα", "για παράδειγμα", "παραδείγματος χάρη", "με άλλα λόγια", "δηλαδή", "γιατί", "επειδή", "καθώς", "εξάλλου", "κατά συνέπεια", "συνακόλουθα", "εν κατακλείδι", "ειδικότερα", "πρώτον", "δεύτερον", "τρίτον", "έπειτα", "λοιπόν", "το πρώτο", "το δεύτερο", "το τρίτο", "κυρίως", "ακολούθως", "στη συνέχεια", "αφενός", "αφετέρου", "με τον τρόπο αυτό", "έτσι", "όμοια", "παρομοίως"];

function na5Analyse(txt, genre) {
  const raw = String(txt).replace(/\r/g, "");
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
  const paras = raw.split(/\n\s*\n|\n(?=\s{2,}|\t)/).map(p => p.trim()).filter(p => p && na5Words(p) > 0);
  const body = lines.filter((l, i) => !(i === 0 && /,\s*$/.test(l) && na5Words(l) < 25) && !(i >= lines.length - 2 && na5Words(l) < 8));
  const sents = (body.join(" ").match(/[^.;!…]+[.;!…]+/g) || []).filter(s => na5Words(s) > 1);
  const w = na5Words(raw), n = na5Norm(raw);
  const conn = NA5_CONN.filter(c => new RegExp("(^|[^α-ω])" + na5Norm(c) + "([^α-ω]|$)").test(n));
  const first = lines[0] || "", last2 = lines.slice(-3).join(" ");
  return {
    w, paras: paras.length > 1 ? paras.length : Math.max(paras.length, lines.filter(l => na5Words(l) > 12).length),
    sents: sents.length, avg: sents.length ? Math.round(sents.reduce((a, s) => a + na5Words(s), 0) / sents.length) : 0,
    rq: (raw.match(/;/g) || []).length,
    p1: (n.match(/[α-ω]+(ουμε|αμε|ησαμε|ουμαστε|ομαστε)([^α-ω]|$)/g) || []).length,
    p2: (n.match(/[α-ω]+(ετε|ατε|ειτε|ησατε|εστε|ιστε|ουστε)([^α-ω]|$)/g) || []).length,
    opener: /,\s*$/.test(first) && na5Words(first) < 25 && /(αγαπητ|αξιοτιμ|αξιοτιμοι|κυριε|κυρια|κυριες|εξοχοτατ|μακαριοτατ|αγαπητοι)/.test(na5Norm(first)),
    closer: /(με εκτιμηση|με σεβασμο|με τιμη|με φιλικους|με βαθυτατο|ευχαριστω|σας ευχαριστω|ευχαριστουμε)/.test(na5Norm(last2)),
    title: lines.length > 1 && na5Words(first) <= 9 && !/[.,;!:]\s*$/.test(first),
    conn
  };
}

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 5.1 Αναλυτής εκφώνησης ---------- */
  na5prompt(box) {
    let k = 0;
    box.innerHTML = `<div class="wctl"><label>Εκφώνηση <select class="sp">${NA5_PROMPTS.map((p, i) => `<option value="${i}">${i + 1}. ${p.g[0].toUpperCase() + p.g.slice(1)} — θέμα ${p.th}</option>`).join("")}</select></label><button class="btn ghost rnd">🎲 Τυχαία</button></div>
      <div class="na5prompt"></div>
      <div class="na5frm"><label>Κειμενικό είδος<select class="fg"><option value="">— διάλεξε —</option>${NA5_GENRES.map(g => `<option>${g}</option>`).join("")}</select></label>
      <label>Πόσα ζητούμενα (σκέλη);<input class="fn" type="number" min="1" max="5" placeholder="π.χ. 2"></label>
      <label>Θεματική ενότητα<select class="ft"><option value="">— διάλεξε —</option>${[1, 2, 3, 4].map(t => `<option value="${t}">${t}. ${NA5_TH[t].name.split(" · ")[0]}</option>`).join("")}</select></label></div>
      <div class="wctl"><button class="btn primary ck">Έλεγχος ανάλυσης</button><label>Συνολική έκταση <input class="fw" type="range" min="450" max="500" step="10" value="480"> <b class="fwv">480</b> λέξεις</label></div>
      <div class="wout"></div>`;
    const out = $(".wout", box);
    function show() {
      const p = NA5_PROMPTS[k];
      $(".na5prompt", box).textContent = p.t;
      ["fg", "fn", "ft"].forEach(c => { $("." + c, box).value = ""; });
      out.innerHTML = `<span class="muted">Διάβασε την εκφώνηση και συμπλήρωσε την ανάλυση: είδος, πόσα ζητούμενα έχει, σε ποια θεματική ενότητα ανήκει. Μετά πάτα «Έλεγχος».</span>`;
    }
    function check() {
      const p = NA5_PROMPTS[k], g = $(".fg", box).value, n = +$(".fn", box).value, t = +$(".ft", box).value, W = +$(".fw", box).value;
      const mk = ok => ok ? `<span class="na5ok">✓</span>` : `<span class="na5no">✗</span>`;
      const pro = Math.round(W * 0.14 / 5) * 5, epi = Math.round(W * 0.12 / 5) * 5, mid = W - pro - epi;
      const pts = p.z.map(z => { const m = z.match(/^(δύο|τρεις|τρία|τέσσερις)/); return m ? { "δύο": 2, "τρεις": 3, "τρία": 3, "τέσσερις": 4 }[m[1]] : 1; });
      const tot = pts.reduce((a, b) => a + b, 0), per = Math.round(mid / tot / 5) * 5;
      out.innerHTML = `<table class="na5tbl"><tr><th>Είδος</th><td>${mk(g === p.g)} <b>${p.g}</b> ${g && g !== p.g ? `<span class="muted">(έγραψες: ${g})</span>` : ""}</td></tr>
        <tr><th>Δέκτης</th><td>${p.d}</td></tr>
        <tr><th>Ζητούμενα</th><td>${mk(n === p.n)} <b>${p.n}</b><ol style="margin:4px 0 0 18px">${p.z.map(z => `<li>${z}</li>`).join("")}</ol></td></tr>
        <tr><th>Θεματική</th><td>${mk(t === p.th)} ${p.th}. ${NA5_TH[p.th].name}</td></tr></table>
        <p style="margin:10px 0 2px"><b>Σχεδιάγραμμα & «προϋπολογισμός» λέξεων (${W}):</b></p>
        <div class="na5budget"><div style="width:${pro / W * 100}%;background:#6F42C1">Πρόλ. ${pro}</div><div style="width:${mid / W * 100}%;background:var(--blue)">Κύριο μέρος ${mid} (≈${per}/παράγραφο)</div><div style="width:${epi / W * 100}%;background:#6F42C1">Επίλ. ${epi}</div></div>
        <ol class="na5plan"><li class="pro"><b>Πρόλογος</b> <small>(≈${pro} λέξεις)</small> — αφόρμηση + σύνδεση με το θέμα + μετάβαση στο πρώτο ζητούμενο${p.g === "επιστολή" || p.g === "ομιλία" ? ` · πριν από αυτόν: <b>προσφώνηση</b>` : ""}</li>
        ${p.z.map((z, j) => Array.from({ length: pts[j] }, (_, i) => `<li><b>Ζητούμενο ${j + 1}, σημείο ${i + 1}</b> <small>(≈${per} λέξεις)</small> — ${z.replace(/^(δύο|τρεις|τρία|τέσσερις)\s*/, "")}: θεματική περίοδος → ανάπτυξη (αιτιολόγηση/παράδειγμα) → κατακλείδα</li>`).join("")).join("")}
        <li class="epi"><b>Επίλογος</b> <small>(≈${epi} λέξεις)</small> — ανακεφαλαίωση/συμπέρασμα${p.g === "ομιλία" ? " + ευχαριστία προς το ακροατήριο" : p.g === "επιστολή" ? " + ελπίδα ανταπόκρισης · μετά: <b>αποφώνηση</b> και ιδιότητα" : " + προτροπή ή προβληματισμός"}</li></ol>`;
    }
    $(".sp", box).onchange = e => { k = +e.target.value; show(); };
    $(".rnd", box).onclick = () => { k = (k + 1 + Math.floor(Math.random() * (NA5_PROMPTS.length - 1))) % NA5_PROMPTS.length; $(".sp", box).value = k; show(); };
    $(".ck", box).onclick = check;
    $(".fw", box).oninput = e => { $(".fwv", box).textContent = e.target.value; if (out.querySelector(".na5tbl")) check(); };
    show();
  },

  /* ---------- 5.2–5.5 Σχεδιαστής κειμένου με ζωντανή μέτρηση ---------- */
  na5planArt(box) { na5Planner(box, "άρθρο"); },
  na5planLet(box) { na5Planner(box, "επιστολή"); },
  na5planEss(box) { na5Planner(box, "δοκίμιο"); },
  na5planSp(box) { na5Planner(box, "ομιλία"); },

  /* ---------- 6.1–6.4 Τράπεζα ιδεών ---------- */
  na5ideas1(box) { na5Ideas(box, 1); },
  na5ideas2(box) { na5Ideas(box, 2); },
  na5ideas3(box) { na5Ideas(box, 3); },
  na5ideas4(box) { na5Ideas(box, 4); }
});

function na5Planner(box, genre0) {
  let genre = genre0;
  box.innerHTML = `<div class="wctl"><label>Κειμενικό είδος <select class="sg">${NA5_GENRES.map(g => `<option${g === genre ? " selected" : ""}>${g}</option>`).join("")}</select></label>
    <button class="btn ghost ld">📄 Φόρτωσε το πρότυπο κείμενο</button><button class="btn ghost cl">🧹 Καθάρισε</button></div>
    <textarea class="na5ta" placeholder="Γράψε εδώ το κείμενό σου (ή φόρτωσε το πρότυπο). Άφησε κενή γραμμή ανάμεσα στις παραγράφους."></textarea>
    <div class="na5bar"><i></i><b style="left:${450 / 560 * 100}%"></b><b style="left:${500 / 560 * 100}%"></b></div>
    <div class="na5stats"></div>
    <div class="na5grid" style="margin-top:10px"><div class="na5card"><h5>Αυτόματοι έλεγχοι</h5><ul class="na5chk auto"></ul></div><div class="na5card"><h5>Λίστα ελέγχου (τσέκαρε μόνος σου)</h5><ul class="na5chk man"></ul></div></div>
    <p class="muted small">Οι αυτόματοι έλεγχοι είναι ενδεικτικοί (μετρούν λέξεις, παραγράφους, προσφώνηση/αποφώνηση, συνδέσεις)· την ποιότητα του περιεχομένου την κρίνεις με τη λίστα ελέγχου και τα κριτήρια της ενότητας 5.1.</p>`;
  const ta = $(".na5ta", box);
  let draft = {};
  function man() { $(".man", box).innerHTML = NA5_GSET[genre].chk.map((c, i) => `<li><input type="checkbox" id="na5c${i}"><label for="na5c${i}">${c}</label></li>`).join(""); }
  function upd() {
    const A = na5Analyse(ta.value, genre), S0 = NA5_GSET[genre];
    const col = A.w < 400 ? "#C62828" : A.w < 450 ? "#C77A0A" : A.w <= 500 ? "#198754" : A.w <= 530 ? "#C77A0A" : "#C62828";
    $(".na5bar i", box).style.cssText = `width:${Math.min(100, A.w / 560 * 100)}%;background:${col}`;
    $(".na5stats", box).innerHTML = `<span>Λέξεις: <b style="color:${col}">${A.w}</b> / 450–500</span><span>Παράγραφοι: <b>${A.paras}</b></span><span>Περίοδοι: <b>${A.sents}</b></span><span>Μέσο μήκος περιόδου: <b>${A.avg}</b> λέξεις</span><span>Ερωτηματικά: <b>${A.rq}</b></span><span>Ρήματα α΄ πληθ.: <b>${A.p1}</b></span><span>Ρήματα β΄ πληθ.: <b>${A.p2}</b></span>`;
    const it = [];
    const add = (ok, t, mid) => it.push(`<li>${ok === true ? '<span class="na5ok">✓</span>' : ok === "mid" ? '<span class="na5mid">!</span>' : '<span class="na5no">✗</span>'}<span>${t}</span></li>`);
    add(A.w >= 450 && A.w <= 500 ? true : (A.w >= 420 && A.w <= 530 ? "mid" : false), `Έκταση ${A.w} λέξεις (στόχος 450–500)`);
    add(A.paras >= 5 ? true : A.paras >= 3 ? "mid" : false, `${A.paras} παράγραφοι (πρόλογος + τουλάχιστον 3 του κύριου μέρους + επίλογος)`);
    add(A.conn.length >= 5 ? true : A.conn.length >= 3 ? "mid" : false, `Διαρθρωτικές λέξεις: ${A.conn.length ? A.conn.slice(0, 8).join(", ") : "—"}`);
    if (S0.opener) add(A.opener, A.opener ? "Υπάρχει προσφώνηση στην πρώτη γραμμή" : "Λείπει προσφώνηση στην πρώτη γραμμή (π.χ. «Αξιότιμε κύριε…,»)");
    if (S0.closer) add(A.closer, A.closer ? "Υπάρχει κλείσιμο (αποφώνηση/ευχαριστία)" : (genre === "ομιλία" ? "Λείπει η ευχαριστία προς το ακροατήριο στο τέλος" : "Λείπει η αποφώνηση (π.χ. «Με εκτίμηση»)"));
    if (S0.title === "warn") add(!A.title || A.w < 40 ? true : "mid", A.title && A.w >= 40 ? "Η πρώτη γραμμή μοιάζει με τίτλο — στις Παγκύπριες 2026 ζητήθηκε άρθρο χωρίς τίτλο" : "Χωρίς τίτλο");
    if (genre === "δοκίμιο") add(A.p2 === 0 ? true : "mid", A.p2 ? `${A.p2} ρήματα σε β΄ πληθ. — το δοκίμιο προτιμά τον απρόσωπο λόγο` : "Απρόσωπος λόγος (χωρίς β΄ πληθυντικό)");
    if (genre === "ομιλία") add(A.p1 + A.p2 >= 3 ? true : "mid", "Άμεσο ύφος με α΄/β΄ πληθυντικό");
    if (A.avg > 35) add("mid", `Πολύ μακριές περίοδοι (μέσος όρος ${A.avg}) — κίνδυνος ασάφειας`);
    $(".auto", box).innerHTML = it.join("");
  }
  $(".sg", box).onchange = e => { draft[genre] = ta.value; genre = e.target.value; ta.value = draft[genre] || ""; man(); upd(); };
  $(".ld", box).onclick = () => { const s = SECTIONS.find(x => x.na5genre === genre && x.na5model); ta.value = s ? s.na5model.trim() : ""; upd(); };
  $(".cl", box).onclick = () => { ta.value = ""; upd(); };
  ta.addEventListener("input", upd);
  man(); upd();
}

function na5Ideas(box, t) {
  const T = NA5_TH[t], cats = Object.keys(T.cats);
  let cur = cats[0]; const sel = [];
  const prompts = NA5_PROMPTS.filter(p => p.th === t);
  box.innerHTML = `<p class="small muted" style="margin:0 0 6px"><b>${T.name}</b> — πάτα σε μια ιδέα για να δεις πώς αναπτύσσεται και πρόσθεσέ την στο σχεδιάγραμμά σου.</p>
    <div class="na5tabs">${cats.map(c => `<button class="na5tab" data-c="${c}">${c}</button>`).join("")}</div>
    <div class="na5chips"></div><div class="na5dev"></div>
    <div class="na5card" style="margin-top:8px"><h5>Το σχεδιάγραμμά μου</h5><div class="wctl" style="margin:0 0 4px"><button class="btn ghost small pr">🎲 Θέμα εξάσκησης</button><button class="btn ghost small rs">↺ Άδειασμα</button></div><div class="ptxt na5prompt" style="display:none"></div><ol class="na5plan"></ol><p class="muted small cnt"></p></div>`;
  function tabs() { box.querySelectorAll(".na5tab").forEach(b => b.classList.toggle("on", b.dataset.c === cur)); }
  function chips() {
    $(".na5chips", box).innerHTML = T.cats[cur].map((x, i) => `<span role="button" tabindex="0" class="na5chip${sel.some(s => s[0] === x[0]) ? " on" : ""}" data-i="${i}">${x[0]}</span>`).join("");
    box.querySelectorAll(".na5chip").forEach(b => b.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); b.click(); } });
    box.querySelectorAll(".na5chip").forEach(b => b.onclick = () => {
      const x = T.cats[cur][+b.dataset.i];
      $(".na5dev", box).innerHTML = `<b>${x[0]}:</b> ${x[1]}`;
      const j = sel.findIndex(s => s[0] === x[0]);
      if (j >= 0) sel.splice(j, 1); else sel.push([x[0], x[1], cur]);
      b.classList.toggle("on", j < 0); plan();
    });
  }
  function plan() {
    $(".na5plan", box).innerHTML = sel.length ? `<li class="pro"><b>Πρόλογος</b> <small>— ορισμός/αφόρμηση</small></li>` + sel.map(s => `<li><b>${s[0]}</b> <small>(${s[2]})</small><br><small>${s[1]}</small></li>`).join("") + `<li class="epi"><b>Επίλογος</b> <small>— συμπέρασμα, προτροπή</small></li>` : "";
    $(".cnt", box).textContent = sel.length ? `${sel.length} σημεία στο κύριο μέρος — στις Παγκύπριες συνήθως ζητούνται 2 × 3 = 6 σημεία (≈60 λέξεις το καθένα).` : "Δεν έχεις διαλέξει ακόμη ιδέες.";
  }
  box.querySelectorAll(".na5tab").forEach(b => b.onclick = () => { cur = b.dataset.c; tabs(); chips(); $(".na5dev", box).textContent = ""; });
  $(".pr", box).onclick = () => { const p = na5Pick(prompts.length ? prompts : NA5_PROMPTS); const pt = $(".ptxt", box); pt.style.display = "block"; pt.textContent = p.t; };
  $(".rs", box).onclick = () => { sel.length = 0; box.querySelectorAll(".na5chip.on").forEach(c => c.classList.remove("on")); plan(); };
  tabs(); chips(); plan();
}

/* ================= Γεννήτριες ================= */
function na5ThemeGen(t) {
  return {
    title: `Γεννήτρια: έννοιες και ιδέες — θεματική ενότητα ${t}`,
    make() {
      const T = NA5_TH[t], kind = Math.random();
      if (kind < 0.45) {
        const V = NA5_VOC[t], x = na5Pick(V);
        if (Math.random() < 0.5)
          return na5MC(`Τι σημαίνει ο όρος «${x[0]}»;`, x[1], V.map(v => v[1]), "Σκέψου τα συνθετικά ή την οικογένεια της λέξης.", `Ο όρος <b>«${x[0]}»</b> σημαίνει: ${x[1]}.`);
        return na5MC(`Ποιος όρος αντιστοιχεί στον ορισμό: «${x[1]}»;`, x[0], V.map(v => v[0]), "Ποια λέξη έχει ακριβώς αυτή τη σημασία;", `Πρόκειται για τον όρο <b>«${x[0]}»</b>.`);
      }
      const cats = Object.keys(T.cats).filter(c => c !== "Έννοιες"), c = na5Pick(cats), x = na5Pick(T.cats[c]);
      const lab = x[0].includes(":") ? x[0].split(":").slice(1).join(":").trim() : (c.startsWith("Λύσεις") ? "" : x[0]);
      const idea = (lab ? lab.charAt(0).toUpperCase() + lab.slice(1) + " — " : "") + x[1];
      return na5MC(`Θεματική ενότητα: <i>${T.name}</i>.<br>Σε ποια κατηγορία ενός σχεδιαγράμματος ανήκει η ιδέα: <b>«${idea}»</b>;`, c, cats.concat(["Έννοιες"]).filter(z => z !== c), "Ρώτα: είναι κάτι που προκαλεί το πρόβλημα, αποτέλεσμά του, ή τρόπος αντιμετώπισης;", `Η ιδέα ανήκει στην κατηγορία <b>«${c}»</b>: ${x[1]}`, 2);
    }
  };
}
var GENS = Object.assign(window.GENS || {}, {
  na5gtask: {
    title: "Γεννήτρια: ανάλυση εκφώνησης παραγωγής λόγου",
    make() {
      const p = na5Pick(NA5_PROMPTS), k = Math.random();
      const q0 = `${PASSAGE(p.t, { title: "Εκφώνηση" })}`;
      if (k < 0.4) return na5MC(q0 + "Σε ποιο κειμενικό είδος πρέπει να γραφτεί το κείμενο;", p.g, NA5_GENRES, "Η εκφώνηση το δηλώνει ρητά (σε άρθρο…, να γράψετε επιστολή…).", `Το κείμενο πρέπει να είναι <b>${p.g}</b>· δέκτης: ${p.d}.`);
      if (k < 0.75) return { level: 1, q: q0 + "Από πόσα ζητούμενα (σκέλη) αποτελείται η εκφώνηση;", fields: [{ label: "Ζητούμενα:", ans: p.n }], hint: "Μέτρα τα σκέλη που ζητά η εκφώνηση (συνήθως ένα για κάθε ρήμα-εντολή· προσοχή στα «και» και στα «για κάθε…»).", sol: `Τα ζητούμενα είναι <b>${p.n}</b>: ${p.z.map((z, i) => `(${i + 1}) ${z}`).join(" · ")}.` };
      return na5MC(q0 + "Σε ποια θεματική ενότητα της ύλης ανήκει το θέμα;", NA5_TH[p.th].name, [1, 2, 3, 4].map(t => NA5_TH[t].name), "Ποια είναι η κεντρική έννοια του θέματος;", `Ανήκει στη θεματική ενότητα <b>${p.th}. ${NA5_TH[p.th].name}</b>.`);
    }
  },
  na5ggenre: {
    title: "Γεννήτρια: αναγνώριση κειμενικού είδους",
    make() {
      const x = na5Pick(NA5_FEAT);
      return na5MC(`Σε ποιο κειμενικό είδος ταιριάζει κυρίως το εξής χαρακτηριστικό;<br><i>«${x[0]}»</i>`, x[1], NA5_GENRES, "Σκέψου: ποιος είναι ο δέκτης; Είναι προφορικό ή γραπτό; Προσωπικό ή απρόσωπο;", `Το χαρακτηριστικό ταιριάζει κυρίως ${({ "άρθρο": "στο", "επιστολή": "στην", "δοκίμιο": "στο", "ομιλία": "στην" })[x[1]]} <b>${x[1]}</b>.`);
    }
  },
  na5glet: {
    title: "Γεννήτρια: προσφωνήσεις και αποφωνήσεις επιστολής",
    make() {
      const x = na5Pick(NA5_ADDR), k = Math.random();
      if (k < 0.6 || /συμμαθητ/.test(x[0])) return na5MC(`Γράφετε επιστολή προς <b>${x[0]}</b>. Ποια είναι η κατάλληλη προσφώνηση;`, x[1], [...new Set(NA5_ADDR.filter(a => a[3] !== x[3]).map(a => a[1]))].concat(["Γεια σας κύριε Υπουργέ!", "Αγαπητέ μου φίλε,", "Προς όλους,"]), "Προσοχή στο αξίωμα, στο γένος και στην κλητική (κύριε Υπουργέ, κυρία Διευθύντρια).", `Κατάλληλη προσφώνηση: <b>${x[1]}</b> — με κόμμα στο τέλος· αποφώνηση: «${x[2]}».`);
      return na5MC(`Ποια αποφώνηση είναι κατάλληλη σε επιστολή προς <b>${x[0]}</b>;`, x[2], ["Φιλιά πολλά", "Τα λέμε!", "Αντίο", "Με αγάπη", "Γεια χαρά", "Καλή συνέχεια!"], "Η αποφώνηση πρέπει να ταιριάζει στο αξίωμα και να είναι επίσημη.", `Κατάλληλη αποφώνηση: <b>${x[2]}</b>.`);
    }
  },
  na5gsp: {
    title: "Γεννήτρια: προσφώνηση ακροατηρίου ομιλίας",
    make() {
      const x = na5Pick(NA5_AUD);
      return na5MC(`Εκφωνείτε ομιλία στην εξής περίσταση: <b>${x[0]}</b>. Ποια προσφώνηση ταιριάζει;`, x[1], NA5_AUD.map(a => a[1]), "Η προσφώνηση ξεκινά από το πιο επίσημο πρόσωπο που είναι παρόν και περιλαμβάνει όλες τις ομάδες του ακροατηρίου.", `Κατάλληλη προσφώνηση: <b>${x[1]}</b>`);
    }
  },
  na5gintro: {
    title: "Γεννήτρια: τεχνικές προλόγου",
    make() {
      const x = na5Pick(NA5_INTRO);
      return na5MC(`Ποια τεχνική προλόγου χρησιμοποιείται στο εξής άνοιγμα κειμένου;<br><i>«${x[0]}»</i>`, x[1], NA5_INTRO_T.filter(t => !(x[1].includes("ιστορική") && t.includes("ιστορική"))), "Πώς «αγκιστρώνει» τον αναγνώστη: με ορισμό, ερώτημα, γεγονός, στοιχείο, βίωμα, ρήση;", `Τεχνική: <b>${x[1]}</b>.`);
    }
  },
  na5gt1: na5ThemeGen(1), na5gt2: na5ThemeGen(2), na5gt3: na5ThemeGen(3), na5gt4: na5ThemeGen(4)
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
      if (!tf && (ex.shuffle || (!ord && !ex.noshuffle && !pos))) { const idx = shuffle(ex.options.map((_, i) => i)); ex.options = idx.map(i => ex.options[i]); ex.correct = idx.indexOf(ex.correct); } }
    ex.options.forEach((o, i) => { const l = h("label", { class: "opt" }, `<input type="radio" name="${name}" value="${i}"><span>${o}</span>`); body.appendChild(l); });
  } else if (type === "fields") {
    const g = h("div", { class: "fields" });
    ex.fields.forEach(fd => { const l = h("label", { class: "fld" + (fd.text && (fd.wide || String(fd.ans).length > 8) ? " wide" : "") }, `<span>${fd.label}</span><input type="text" ${fd.text ? 'autocapitalize="off"' : 'inputmode="decimal"'} autocomplete="off" spellcheck="false"${fd.ph ? ` placeholder="${fd.ph}"` : ""}>`); g.appendChild(l); inputs.push($("input", l)); });
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
          let good = false; if (fd.text) { const nz = t => { t = String(t).replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\s+/g, fd.nospace ? "" : " ").trim(); if (fd.noacc || CONFIG.noacc) t = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ς/g, "σ"); if (fd.nopunct) t = t.replace(/[.,;:!·«»"'()\[\]…–—-]/g, " ").replace(/\s+/g, " ").trim(); return fd.cs ? t : t.toLowerCase(); };
            const alts = Array.isArray(fd.ans) ? fd.ans : [fd.ans]; good = alts.some(a => nz(a) === nz(inp.value)); inp.classList.add(good ? "right" : "wrong"); if (!good) all = false; return; }
          try { const want = typeof fd.ans === "string" ? numVal(fd.ans) : fd.ans;
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
      grid.appendChild(lnk("seccard", s.id, `<span class="sid">${s.id}</span><b>${s.title}</b><span class="bar"><i style="width:${d / n * 100}%"></i></span><small>${d}/${n} ασκήσεις${s.widget ? " · " + (CONFIG.widgetLabel || "διαδραστικό γράφημα") : ""}${s.gen ? " · γεννήτρια" : ""}</small>${s.thumb || ""}`));
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

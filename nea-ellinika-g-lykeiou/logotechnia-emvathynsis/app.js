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
  storeKey: "pagk-logotechnia-emvathynsis-v1",
  heroTitle: "Λογοτεχνία Εμβάθυνσης Γ΄ Λυκείου — Παγκύπριες",
  tefxos: "Εμβάθυνση",
  widgetLabel: "διαδραστική άσκηση",
  noacc: true,
  heroLead: "Η δομή της εξέτασης, η σύγκριση διδαγμένου με αδίδακτο κείμενο, τα λογοτεχνικά ρεύματα από το 1920 και ανάλυση όλων των κειμένων της ύλης (Καβάφης, Σεφέρης, Ελύτης, Δούκας, Ιωάννου, Σαχτούρης, Αναγνωστάκης, Εγγονόπουλος, Μόντης, Χαραλαμπίδης, Καμύ). <b>Δωρεάν υλικό</b> — δεν προσφέρουμε ιδιαίτερα μαθήματα Νέων Ελληνικών/Λογοτεχνίας.",
  howto: `<ul><li>Απαντήσεις-λέξεις: γράψε τη λέξη, π.χ. <b>μεταφορά</b> — οι τόνοι και τα κεφαλαία δεν μετρούν.</li>
    <li>Ερωτήσεις ανοιχτού τύπου (ερμηνευτικά σχόλια, σύγκριση με αδίδακτο): γράψε στο τετράδιό σου και σύγκρινε με την <b>ενδεικτική απάντηση</b> και τα κριτήρια.</li>
    <li>Έχε μπροστά σου το κείμενο από το ανθολόγιο του σχολείου (ΝΕ. ΛΟΓ. Γ΄, ΑΝΠ Γ΄, ΚΝΕΛ, ΚΚΛ): εδώ τα σύγχρονα κείμενα αναλύονται, δεν αναδημοσιεύονται.</li>
    <li>Το υλικό δίνεται <b>δωρεάν</b>· δεν προσφέρουμε ιδιαίτερα μαθήματα Νέων Ελληνικών/Λογοτεχνίας.</li>
    <li>Ύλη: Πλαίσιο Μάθησης Λογοτεχνίας Εμβάθυνσης Γ΄ Λυκείου 2026–27 (ΥΠΑΝ) — Α΄ και Β΄ τετράμηνο.</li></ul>`
};

const UNITS = [
  { id: 1, title: "Η εξέταση: δομή, σύγκριση με αδίδακτο, λογοτεχνικός γραμματισμός" },
  { id: 2, title: "Λογοτεχνικά ρεύματα και γενιές από το 1920" },
  { id: 3, title: "Κείμενα Α΄ τετραμήνου" },
  { id: 4, title: "Κείμενα Β΄ τετραμήνου" }
];

const SECTIONS = [
/* ───────────────────────────── 1.1 ───────────────────────────── */
{
  id: "1.1", unit: 1, title: "Λογοτεχνία Εμβάθυνσης Παγκύπριες: δομή του εξεταστικού δοκιμίου και βαθμολόγηση",
  book: "Δομή εξεταστικού δοκιμίου Ενιαίας Τελικής Απολυτήριας Γραπτής Εξέτασης (90΄) · Οδηγίες γραπτού διαγωνίσματος τετραμήνου (45΄) · Δειγματικό δοκίμιο 2026–27",
  intro: "Πώς είναι οργανωμένο το εξεταστικό δοκίμιο της Λογοτεχνίας Εμβάθυνσης στις Παγκύπριες και πώς μοιράζουμε σωστά τον χρόνο των 90 λεπτών;",
  thumb: LETTER("90΄"),
  theory: R`
<p>Η <b>Λογοτεχνία Εμβάθυνσης</b> (Λογοτεχνία Προσανατολισμού) της Γ΄ Λυκείου εξετάζεται στις <b>Παγκύπριες Εξετάσεις</b> με ένα δοκίμιο διάρκειας <b>90 λεπτών</b>, που αξιολογεί την κατανόηση, την ερμηνεία και την αισθητική αποτίμηση λογοτεχνικών κειμένων. Δεν ζητείται αποστήθιση «σχολίων»: ζητείται να διαβάζεις προσεκτικά ένα κείμενο, να διατυπώνεις μια θέση και να την <b>τεκμηριώνεις</b> με στοιχεία από το ίδιο το κείμενο. Η ενότητα αυτή εξηγεί τη δομή του δοκιμίου, τη βαθμολόγηση και τα είδη των ερωτήσεων.</p>
<div class="tbox def"><h4>Η δομή του εξεταστικού δοκιμίου (90΄, 100 μονάδες)</h4>
<p>Δίνονται πεζά ή/και ποιητικά κείμενα από την εξεταστέα ύλη, ακέραια ή σε απόσπασμα. Το δοκίμιο έχει <b>δύο μέρη</b>:</p>
<table class="tbl"><tr><th>Μέρος</th><th>Κείμενα</th><th>Μονάδες</th></tr>
<tr><td><b>Α΄</b></td><td>Δύο <b>διδαγμένα</b> κείμενα (από ένα ερώτημα για το καθένα)</td><td>50</td></tr>
<tr><td><b>Β΄</b></td><td>Ένα διδαγμένο και ένα <b>αδίδακτο</b> κείμενο — ερώτηση <b>σύγκρισης</b></td><td>50</td></tr></table>
<p>Οι εξεταζόμενοι απαντούν σε <b>τρεις (3) ερωτήσεις</b>· κάθε ερώτηση μπορεί να έχει <b>μέχρι δύο υποερωτήματα</b>. Στο δειγματικό δοκίμιο 2026–27, για παράδειγμα, κάθε διδαγμένο του Μέρους Α΄ έχει 25 μονάδες (15 + 10) και η σύγκριση του Μέρους Β΄ 50 μονάδες (25 + 10 + 15).</p></div>
<div class="tbox thm"><h4>Τι ορίζουν οι οδηγίες για τις ερωτήσεις</h4>
<ul><li>Τα στοιχεία λογοτεχνικού γραμματισμού (σχήματα λόγου, αφηγητής, εστίαση κ.λπ.) <b>δεν εξετάζονται μεμονωμένα</b>, αλλά πάντα σε συνάρτηση με τα κείμενα: δεν αρκεί να ονομάσεις μια μεταφορά — πρέπει να εξηγήσεις <b>τι πετυχαίνει</b>.</li>
<li>Οι ερωτήσεις αφορούν <b>κατανόηση και σχολιασμό του περιεχομένου</b> και <b>αισθητική αποτίμηση</b> μέσα από τη συνεξέταση μορφής και περιεχομένου.</li>
<li><b>Μία</b> ερώτηση αφορά πάντα τη <b>σύγκριση</b> ενός διδαγμένου με ένα αδίδακτο κείμενο, ως προς τη θεματική, τις αφηγηματικές τεχνικές (αν είναι πεζά), το ύφος, τα εκφραστικά μέσα κ.ά. Μπορεί να αφορά και ένα από τα δύο διδαγμένα του Μέρους Α΄.</li>
<li>Το αδίδακτο κείμενο σχετίζεται με το διδαγμένο ως προς το θέμα, τη μορφή ή το ύφος, είναι εύληπτο και <b>δεν ξεπερνά τις 40 γραμμές/στίχους</b>.</li></ul></div>
<div class="tbox rem"><h4>Διαγώνισμα τετραμήνου και λογοτεχνικό βιβλίο</h4>
<p>Σε κάθε τετράμηνο γράφεται <b>προειδοποιημένο διαγώνισμα (45΄)</b>, με την ίδια λογική: Μέρος Α΄ (δύο διδαγμένα, 10 μονάδες) και Μέρος Β΄ (σύγκριση διδαγμένου–αδίδακτου, 10 μονάδες). Το <b>λογοτεχνικό βιβλίο</b> της Λέσχης Ανάγνωσης <b>δεν εξετάζεται</b> στο διαγώνισμα· αξιολογείται με εργασία (project) που παρουσιάζεται στην τάξη.</p></div>
<div class="tbox"><h4>Τα ρήματα των ερωτήσεων — τι ζητούν</h4>
<table class="tbl"><tr><th>Ρήμα</th><th>Τι κάνεις</th></tr>
<tr><td>Να <b>εντοπίσετε</b> / να αναφέρετε</td><td>Ονομάζεις με ακρίβεια (π.χ. δύο εκφραστικά μέσα) και δίνεις το σημείο του κειμένου.</td></tr>
<tr><td>Να <b>τεκμηριώσετε</b></td><td>Στηρίζεις τη θέση σου με παραπομπές (λέξεις, στίχους σε εισαγωγικά).</td></tr>
<tr><td>Να <b>σχολιάσετε</b> / να ερμηνεύσετε</td><td>Εξηγείς τη σημασία και τη λειτουργία: γιατί το επιλέγει ο δημιουργός, τι νιώθει ο αναγνώστης.</td></tr>
<tr><td>Να <b>συγκρίνετε</b></td><td>Δείχνεις ομοιότητες <b>και</b> διαφορές, με τεκμήρια από <b>και τα δύο</b> κείμενα.</td></tr>
<tr><td>Να <b>διακρίνετε</b> / να προσδιορίσετε</td><td>Κατατάσσεις (π.χ. είδος εστίασης, ρηματικό πρόσωπο) και αιτιολογείς.</td></tr></table></div>
<div class="tbox ex"><h4>Το «τρίπτυχο» κάθε σωστής απάντησης</h4>
<p><b>Θέση</b> (τι υποστηρίζω) → <b>Τεκμήριο</b> (το σημείο του κειμένου σε εισαγωγικά) → <b>Ερμηνεία/λειτουργία</b> (τι δείχνει, τι πετυχαίνει). Παράδειγμα για ένα ποίημα κοινού κτήματος:</p>
<details class="steps"><summary>Ενδεικτική απάντηση: «Να εντοπίσετε ένα εκφραστικό μέσο στη «Μελαγχολία του Ιάσωνος Κλεάνδρου» και να εξηγήσετε τη λειτουργία του.»</summary>
<p><b>Θέση:</b> Ο Καβάφης αποδίδει το γήρας με <b>μεταφορά</b>. <b>Τεκμήριο:</b> «είναι πληγή από φρικτό μαχαίρι». <b>Λειτουργία:</b> η φθορά του σώματος, που είναι αργή και αόρατη, γίνεται βίαιη, σωματική πληγή· ο αναγνώστης νιώθει με ένταση τον πόνο του ομιλητή. Η επανάληψη του στίχου (στ. 7) εντείνει την αίσθηση ότι ο πόνος επιστρέφει.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Απαντήσεις «γενικές», χωρίς παραπομπές στο κείμενο — η τεκμηρίωση είναι υποχρεωτική.</li>
<li>Αναφορά εκφραστικού μέσου χωρίς <b>λειτουργία</b>.</li>
<li>Στη σύγκριση: γράφεις χωριστά για κάθε κείμενο χωρίς να τα συνδέεις («Και στα δύο…», «Αντίθετα…»).</li>
<li>Απαντάς σε λιγότερα σκέλη απ’ όσα ζητούνται (π.χ. ζητούνται <b>δύο</b> στοιχεία και δίνεις ένα).</li>
<li>Κακή διαχείριση χρόνου: η σύγκριση (50 μονάδες) θέλει περίπου τον μισό χρόνο γραφής.</li></ul></div>
`,
  widget: "nc1exam",
  exercises: [
    { level: 1, q: R`Πόσα λεπτά διαρκεί το εξεταστικό δοκίμιο της Λογοτεχνίας Εμβάθυνσης στις Παγκύπριες (Ενιαία Τελική Απολυτήρια Γραπτή Εξέταση);`, fields: [{ label: "Λεπτά:", ans: 90 }],
      hint: R`Ανάτρεξε στη θεωρία: πόση είναι η διάρκεια του τελικού διαγωνίσματος σε σχέση με εκείνο του τετραμήνου;`, sol: R`Η διάρκεια είναι <b>90΄</b>. Το διαγώνισμα τετραμήνου διαρκεί 45΄.` },
    { level: 1, q: R`Σε πόσες ερωτήσεις απαντούν συνολικά οι εξεταζόμενοι, και πόσα υποερωτήματα μπορεί να έχει το πολύ κάθε ερώτηση;`, fields: [{ label: "Ερωτήσεις:", ans: 3 }, { label: "Μέγιστο υποερωτήματα:", ans: 2 }],
      hint: R`Μέτρησε τις ερωτήσεις κάθε μέρους του διαγωνίσματος, όπως περιγράφονται στη θεωρία.`, sol: R`<b>3</b> ερωτήσεις (Α1, Α2, Β1), καθεμιά με <b>μέχρι 2</b> υποερωτήματα.` },
    { level: 1, shuffle: true, type: "mc", q: R`Τι περιλαμβάνει το Μέρος Β΄ του εξεταστικού δοκιμίου;`, options: ["Ένα διδαγμένο και ένα αδίδακτο κείμενο, για σύγκριση", "Δύο αδίδακτα κείμενα", "Δύο διδαγμένα κείμενα χωρίς σύγκριση", "Ερωτήσεις για το λογοτεχνικό βιβλίο της Λέσχης Ανάγνωσης"], correct: 0,
      hint: R`Το Μέρος Β΄ έχει τίτλο «Σύγκριση διδαγμένου με αδίδακτο κείμενο».`, sol: R`Στο Μέρος Β΄ δίνονται <b>ένα διδαγμένο και ένα αδίδακτο</b> κείμενο και ζητείται σύγκριση (50 μονάδες).` },
    { level: 1, q: R`Ποιο είναι το μέγιστο επιτρεπόμενο μήκος του αδίδακτου κειμένου, σε γραμμές/στίχους;`, fields: [{ label: "Γραμμές/στίχοι:", ans: 40 }],
      hint: R`Οι οδηγίες ζητούν κείμενο «όχι εκτεταμένο» και εύληπτο.`, sol: R`Το αδίδακτο <b>δεν υπερβαίνει τις 40</b> γραμμές/στίχους.` },
    { level: 1, type: "mc", q: R`Το λογοτεχνικό βιβλίο της Λέσχης Ανάγνωσης εξετάζεται στο γραπτό διαγώνισμα του τετραμήνου.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Πώς αξιολογείται η Λέσχη Ανάγνωσης;`, sol: R`<b>ΛΑΘΟΣ.</b> Το βιβλίο δεν εξετάζεται στο διαγώνισμα· αξιολογείται με project που παρουσιάζεται στην τάξη.` },
    { level: 2, type: "mc", q: R`Σύμφωνα με τις οδηγίες, τα στοιχεία λογοτεχνικού γραμματισμού (π.χ. σχήματα λόγου) μπορούν να εξεταστούν και μεμονωμένα, ως ορισμοί.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι λένε οι οδηγίες για τη «συνάρτηση με τα κείμενα»;`, sol: R`<b>ΛΑΘΟΣ.</b> Εξετάζονται <b>πάντα σε συνάρτηση με τα λογοτεχνικά κείμενα</b>: εντοπίζεις και εξηγείς τη λειτουργία τους μέσα στο συγκεκριμένο κείμενο.` },
    { level: 2, shuffle: true, type: "mc", q: R`Μια ερώτηση λέει: «Να αναφέρετε δύο (2) εκφραστικά μέσα με τα οποία παρουσιάζεται η σχέση του ποιητή με την πόλη και να τεκμηριώσετε την απάντησή σας». Ποια απάντηση παίρνει όλες τις μονάδες;`, options: ["Ονομάζει δύο εκφραστικά μέσα, δίνει για το καθένα τον στίχο σε εισαγωγικά και εξηγεί πώς αποδίδει τη σχέση ποιητή–πόλης", "Ονομάζει τέσσερα εκφραστικά μέσα χωρίς παραπομπές", "Εξηγεί γενικά ότι ο ποιητής αγαπά την πόλη του", "Δίνει τον ορισμό της μεταφοράς και της προσωποποίησης"], correct: 0,
      hint: R`Θυμήσου το τρίπτυχο θέση – τεκμήριο – λειτουργία, και πόσα στοιχεία ζητούνται.`, sol: R`Χρειάζονται <b>ακριβώς όσα ζητούνται</b> (δύο), το καθένα με <b>τεκμήριο</b> και <b>λειτουργία</b> σε σχέση με το θέμα της ερώτησης.` },
    { level: 2, q: R`Σε δοκίμιο 90 λεπτών κρατάς 15΄ για ανάγνωση/σχεδιασμό και 5΄ για τελικό έλεγχο. Αν μοιράσεις τον υπόλοιπο χρόνο ανάλογα με τις μονάδες, πόσα λεπτά αναλογούν στην ερώτηση σύγκρισης των 50 μονάδων (σε σύνολο 100);`, fields: [{ label: "Λεπτά:", ans: 35 }],
      hint: R`Υπόλοιπος χρόνος: 90 − 15 − 5. Η σύγκριση είναι το μισό των μονάδων.`, sol: R`90 − 15 − 5 = 70΄ για γραφή· 50/100 του χρόνου → <b>35΄</b> για τη σύγκριση και 35΄ για τα δύο διδαγμένα.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποια από τις παρακάτω διατυπώσεις είναι η καλύτερη <b>εισαγωγική πρόταση</b> σε ερώτηση σύγκρισης δύο ποιημάτων για την ποίηση;`, options: ["«Και τα δύο ποιήματα στοχάζονται πάνω στον ρόλο της ποίησης, αλλά καταλήγουν σε διαφορετική εκτίμηση της δύναμής της.»", "«Το πρώτο ποίημα είναι ωραίο και το άλλο επίσης.»", "«Ο Καβάφης γεννήθηκε στην Αλεξάνδρεια το 1863.»", "«Θα αναφέρω τρία σχήματα λόγου από κάθε ποίημα.»"], correct: 0,
      hint: R`Η εισαγωγή πρέπει να δηλώνει τον άξονα σύγκρισης: κοινό θέμα + διαφορά.`, sol: R`Η σωστή εισαγωγή δηλώνει <b>το κοινό σημείο</b> (στοχασμός για την ποίηση) και <b>προαναγγέλλει τη διαφορά</b>. Βιογραφικά στοιχεία και γενικόλογες κρίσεις δεν κερδίζουν μονάδες.` },
    { level: 3, q: R`Στο δειγματικό δοκίμιο 2026–27 το Μέρος Β΄ έχει υποερωτήματα 25 + 10 + 15 μονάδων. Πόσες μονάδες έχει συνολικά το Μέρος Β΄, και πόσες το Μέρος Α΄ αν το σύνολο είναι 100;`, fields: [{ label: "Μέρος Β΄:", ans: 50 }, { label: "Μέρος Α΄:", ans: 50 }],
      hint: R`Πρόσθεσε τα υποερωτήματα.`, sol: R`25 + 10 + 15 = <b>50</b> για το Μέρος Β΄· το Μέρος Α΄ έχει τις υπόλοιπες <b>50</b> (25 + 25).` }
  ]
},
/* ───────────────────────────── 1.2 ───────────────────────────── */
{
  id: "1.2", unit: 1, title: "Σύγκριση διδαγμένου με αδίδακτο κείμενο: μέθοδος και λυμένο παράδειγμα",
  book: "Δομή εξεταστικού δοκιμίου (Μέρος Β΄) · Δειγματικά δοκίμια 2017 και 2026–27 με οδηγό διόρθωσης",
  intro: "Πώς συγκρίνουμε ένα διδαγμένο με ένα αδίδακτο λογοτεχνικό κείμενο, ώστε να πάρουμε όλες τις μονάδες του Μέρους Β΄;",
  thumb: LETTER("Α ↔ Β"),
  theory: R`
<p>Η <b>σύγκριση διδαγμένου με αδίδακτο κείμενο</b> είναι η πιο «βαριά» ερώτηση της Λογοτεχνίας Εμβάθυνσης: αξίζει το μισό του δοκιμίου. Το αδίδακτο επιλέγεται επειδή <b>συνομιλεί</b> με ένα διδαγμένο — έχει κοινό θέμα, παρόμοια μορφή ή συγγενικό ύφος. Η ερώτηση ελέγχει αν μπορείς να μεταφέρεις όσα έμαθες (ποιητικό υποκείμενο, αφηγητής, εκφραστικά μέσα, ύφος) σε ένα κείμενο που βλέπεις πρώτη φορά.</p>
<div class="tbox def"><h4>Οι άξονες της σύγκρισης</h4>
<table class="tbl"><tr><th>Ποίηση</th><th>Πεζογραφία</th></tr>
<tr><td>Θέμα και κεντρική ιδέα · ποιητικό υποκείμενο (ποιος μιλά, σε ποιον) · ρηματικό πρόσωπο και χρόνος · συναισθήματα · εικόνες και σύμβολα · εκφραστικά μέσα · μορφή (ελεύθερος/έμμετρος στίχος) · ύφος</td>
<td>Θέμα · αφηγητής (ομοδιηγητικός/ετεροδιηγητικός) · πρόσωπο αφήγησης · εστίαση · αφηγηματικοί τρόποι (αφήγηση, περιγραφή, διάλογος, σχόλιο, μονόλογος) · χρόνος και τεχνικές (αναδρομή, επιβράδυνση…) · ύφος · ατμόσφαιρα</td></tr></table></div>
<div class="tbox thm"><h4>Η μέθοδος σε πέντε βήματα</h4>
<ol><li><b>Διάβασε το αδίδακτο δύο φορές</b>: πρώτα για το νόημα, μετά με μολύβι (υπογράμμισε πρόσωπα ρημάτων, επαναλήψεις, εικόνες).</li>
<li><b>Βρες τον κοινό άξονα</b> που ζητά η ερώτηση (π.χ. ρόλος της ποίησης, επίδραση της ομίχλης στον αφηγητή) — μην απαντάς σε κάτι που δεν ζητείται.</li>
<li><b>Φτιάξε πίνακα</b> δύο στηλών (διδαγμένο | αδίδακτο) με 2–3 σημεία για κάθε άξονα και ένα τεκμήριο για κάθε σημείο.</li>
<li><b>Γράψε συνδετικά</b>: εισαγωγή (κοινό θέμα) → ομοιότητες → διαφορές → σύντομη αποτίμηση. Λέξεις-κλειδιά: «και στα δύο κείμενα», «ομοίως», «αντίθετα», «ενώ… εδώ…», «σε αντίθεση με…».</li>
<li><b>Τεκμηρίωσε από ΚΑΙ τα δύο κείμενα</b> και εξήγησε τη λειτουργία για τον αναγνώστη, όταν ζητείται.</li></ol></div>
<div class="tbox ex"><h4>Λυμένο παράδειγμα (ποίηση)</h4>
<p><b>Διδαγμένο:</b> Κ. Π. Καβάφης (1921 — κοινό κτήμα):</p>
${PASSAGE(`Το γήρασμα του σώματος και της μορφής μου
είναι πληγή από φρικτό μαχαίρι.
Δεν έχω εγκαρτέρησι καμιά.
Εις σε προστρέχω Τέχνη της Ποιήσεως,
που κάπως ξέρεις από φάρμακα·
νάρκης του άλγους δοκιμές, εν Φαντασία και Λόγω.

Είναι πληγή από φρικτό μαχαίρι.—
Τα φάρμακά σου φέρε Τέχνη της Ποιήσεως,
που κάμνουνε —για λίγο— να μη νοιώθεται η πληγή.`, { title: "Μελαγχολία του Ιάσωνος Κλεάνδρου· ποιητού εν Κομμαγηνή· 595 μ.Χ.", source: "Κ. Π. Καβάφης (1921) — μονοτονικό", num: "line" })}
<p><b>Αδίδακτο:</b> πρωτότυπο ποίημα εξάσκησης, γραμμένο για αυτή τη σελίδα:</p>
${PASSAGE(`Από τότε που έφυγες
γράφω στο μικρό σου σημειωματάριο,
εκείνο με τις τσακισμένες γωνίες.
Γράφω τι έβρεξε, τι άνθισε στο μπαλκόνι,
γράφω πως η γάτα σε ψάχνει ακόμα στον καναπέ.

Το δωμάτιο είναι άδειο·
οι σελίδες όμως γέμισαν.
Κάθε βράδυ το σημειωματάριο ανασαίνει
δίπλα στο κρεβάτι, σαν να περιμένει τη φωνή σου.

Ξέρω, δεν θα διαβάσεις τίποτα.
Μα όσο γράφω, κάθεσαι απέναντί μου
και δεν βιάζεσαι να φύγεις.`, { title: "Το σημειωματάριο", source: "Πρωτότυπο κείμενο εξάσκησης", num: "line" })}
<p><b>Ερώτηση:</b> Να συγκρίνετε τον ρόλο που αποδίδεται στη γραφή/τέχνη στα δύο ποιήματα και να αναφέρετε ένα κοινό εκφραστικό μέσο. Τεκμηριώστε.</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary>
<p><b>Κοινό θέμα:</b> Και στα δύο ποιήματα ο ομιλητής, απέναντι σε μια απώλεια, καταφεύγει στη γραφή. Στον Καβάφη η απώλεια είναι η νεότητα και η ομορφιά («Το γήρασμα του σώματος και της μορφής μου»)· στο αδίδακτο είναι ένα αγαπημένο πρόσωπο («Από τότε που έφυγες»).</p>
<p><b>Ομοιότητα:</b> Η τέχνη έχει <b>περιορισμένη</b> δύναμη: ο Καβάφης ζητά «φάρμακα» που απαλύνουν τον πόνο «για λίγο»· στο αδίδακτο ο ομιλητής ξέρει ότι ο ομιλητής ξέρει πως ο χαμένος φίλος δεν θα διαβάσει όσα γράφει («δεν θα διαβάσεις τίποτα»). Η γραφή δεν αναιρεί την απώλεια — την κάνει υποφερτή.</p>
<p><b>Διαφορά:</b> Στον Καβάφη η Ποίηση είναι «γιατρός» που ναρκώνει τον πόνο μέσω της Φαντασίας και του Λόγου· στο αδίδακτο η γραφή είναι <b>μνήμη και παρουσία</b>: όσο γράφει, ο χαμένος φίλος είναι σαν να κάθεται μαζί του («κάθεσαι απέναντί μου»). Το ύφος επίσης διαφέρει: λόγιο, ειρωνικά συγκρατημένο στον Καβάφη («κάπως ξέρεις»)· απλό, καθημερινό και τρυφερό στο αδίδακτο.</p>
<p><b>Κοινό εκφραστικό μέσο:</b> η <b>επανάληψη</b> — ο Καβάφης επαναλαμβάνει αυτούσιο τον στίχο «είναι πληγή από φρικτό μαχαίρι» (στ. 2 και 7), τονίζοντας ότι ο πόνος επιστρέφει· στο αδίδακτο επαναλαμβάνεται το «γράφω» (στ. 2, 4, 5, 11), που δείχνει την επίμονη, σχεδόν τελετουργική προσπάθεια να κρατηθεί η μνήμη. Επίσης, και τα δύο χρησιμοποιούν <b>προσωποποίηση</b>: η «Τέχνη της Ποιήσεως» που ξέρει από φάρμακα / το σημειωματάριο που «ανασαίνει».</p></details></div>
<div class="tbox rem"><h4>Τι ζήτησαν τα δειγματικά δοκίμια</h4>
<p><i>Προσοχή: το δειγματικό του 2017 ακολουθεί παλαιότερη μορφή (4 ερωτήσεις, 30/20/25/25 μονάδες, με δύο συγκρίσεις)· η δομή που ισχύει είναι αυτή του Μέρους Α΄/Β΄ που περιγράφεται εδώ.</i></p>
<p>Στο δειγματικό του 2017 η «Μελαγχολία…» συγκρίθηκε με ένα σύγχρονο ποίημα που υποστηρίζει ότι η ποίηση <b>δεν αλλάζει</b> τη ζωή μας και κάνει πιο δύσκολη την καθημερινή πράξη· ζητήθηκε η διαφορά στον ρόλο της ποίησης και το <b>γραμματικό πρόσωπο και ο χρόνος</b> του ποιητικού υποκειμένου (α΄ ενικό/εξομολόγηση ↔ α΄ πληθυντικό/συλλογικότητα· δραματικός ενεστώτας ↔ διαχρονικός ενεστώτας). Η «Ομίχλη» του Ιωάννου συγκρίθηκε με ένα αφηγηματικό απόσπασμα του Μ. Καραγάτση για ομίχλη στο Λονδίνο: ζητήθηκαν η <b>επίδραση της ομίχλης στην ψυχή του αφηγητή</b>, το <b>είδος της εστίασης</b> (εσωτερική και στα δύο) και η διαφορά <b>α΄ ενικού ↔ α΄ πληθυντικού</b> και η λειτουργία της για τον αναγνώστη. Στο δειγματικό 2026–27 ζητήθηκαν ξανά αυτά για την «Ομίχλη».</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Δύο χωριστές «αναλύσεις» χωρίς σύνδεση: η σύγκριση θέλει διαρκή αντιπαραβολή.</li>
<li>Τεκμήρια μόνο από το διδαγμένο (γιατί το ξέρεις καλύτερα) — το αδίδακτο πρέπει να τεκμηριώνεται εξίσου.</li>
<li>Παράθεση όλου του κειμένου σε εισαγωγικά: παραπέμπουμε σύντομα, με αριθμό στίχου.</li>
<li>Συγκρίνεις άξονες που δεν ζητούνται και ξεχνάς εκείνον που ζητείται.</li></ul></div>
`,
  widget: "nc1cmp",
  exercises: [
    { level: 1, q: R`Στο Μέρος Β΄, από πόσα κείμενα πρέπει να δίνεις τεκμήρια στην ερώτηση σύγκρισης;`, fields: [{ label: "Κείμενα:", ans: 2 }],
      hint: R`Σύγκριση σημαίνει αντιπαραβολή.`, sol: R`Από <b>2</b> κείμενα: το διδαγμένο <b>και</b> το αδίδακτο.` },
    { level: 1, shuffle: true, type: "mc", q: R`Ποιο από τα παρακάτω ΔΕΝ είναι άξονας σύγκρισης για δύο πεζά κείμενα;`, options: ["Το μέτρο και η ομοιοκαταληξία", "Ο τύπος του αφηγητή", "Η εστίαση", "Οι αφηγηματικοί τρόποι"], correct: 0,
      hint: R`Ποιος άξονας αφορά τον στίχο;`, sol: R`Το <b>μέτρο και η ομοιοκαταληξία</b> αφορούν την ποίηση· στα πεζά συγκρίνουμε αφηγητή, εστίαση, τρόπους, χρόνο, ύφος.` },
    { level: 2, shuffle: true, type: "mc", q: R`Στη «Μελαγχολία…» (παράδειγμα της θεωρίας) ο ομιλητής μιλά σε α΄ ενικό. Τι κυρίως προσδίδει αυτό στο ποίημα;`, options: ["Εξομολογητικό, προσωπικό τόνο", "Αντικειμενικό, ιστορικό τόνο", "Συλλογικότητα και καθολικότητα", "Χιουμοριστική απόσταση"], correct: 0,
      hint: R`Ποιος μιλά για τον πόνο του;`, sol: R`Το α΄ ενικό δίνει <b>εξομολογητικό, προσωπικό τόνο</b>· ο αναγνώστης «ακούει» τον ίδιο τον Ιάσονα.` },
    { level: 2, shuffle: true, type: "mc", q: R`Σε ένα αδίδακτο ποίημα ο ομιλητής γράφει σε α΄ πληθυντικό («μας», «περπατάμε»). Τι επισημαίνουμε κυρίως στη σύγκριση με ένα ποίημα σε α΄ ενικό;`, options: ["Τη συλλογικότητα της εμπειρίας και τη συμμετοχή του αναγνώστη", "Ότι ο ποιητής αποφεύγει κάθε συναίσθημα", "Ότι πρόκειται για θεατρικό διάλογο", "Ότι το ποίημα είναι έμμετρο"], correct: 0,
      hint: R`Το «εμείς» περιλαμβάνει και άλλους εκτός από τον ομιλητή.`, sol: R`Το α΄ πληθυντικό δίνει <b>συλλογικότητα/καθολικότητα</b> και κάνει τον αναγνώστη συμμέτοχο — σε αντίθεση με το προσωπικό, εξομολογητικό α΄ ενικό.` },
    { level: 2, q: R`Στο πρωτότυπο αδίδακτο «Το σημειωματάριο» (θεωρία), ποιο ρήμα επαναλαμβάνεται για να δείξει την επίμονη προσπάθεια να κρατηθεί η μνήμη;`, fields: [{ label: "Ρήμα:", ans: ["γράφω", "γραφω"], text: true }],
      hint: R`Διάβασε την αρχή κάθε στίχου: ποιο ρήμα επανέρχεται;`, sol: R`Το <b>«γράφω»</b> (στ. 2, 4, 5, 11): η επανάληψη δηλώνει μια σχεδόν τελετουργική επιμονή.` },
    { level: 2, shuffle: true, type: "mc", q: R`Στο «Σημειωματάριο» ο στίχος «Κάθε βράδυ το σημειωματάριο ανασαίνει» περιέχει κυρίως:`, options: ["προσωποποίηση", "παρομοίωση", "ασύνδετο σχήμα", "ρητορική ερώτηση"], correct: 0,
      hint: R`Ένα άψυχο αντικείμενο κάνει κάτι ανθρώπινο.`, sol: R`<b>Προσωποποίηση</b>: το σημειωματάριο αποκτά ζωή, σαν να κρατά «ζωντανό» το χαμένο πρόσωπο.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποια συνδετική διατύπωση δηλώνει <b>διαφορά</b> ανάμεσα στα δύο κείμενα;`, options: ["«Αντίθετα, στο αδίδακτο…»", "«Ομοίως, και στο αδίδακτο…»", "«Και στα δύο κείμενα…»", "«Με τον ίδιο τρόπο…»"], correct: 0,
      hint: R`Ποια λέξη εισάγει αντιπαραβολή;`, sol: R`Το <b>«Αντίθετα»</b> εισάγει διαφορά· οι άλλες διατυπώσεις δηλώνουν ομοιότητα.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποια πρόταση συγκρίνει σωστά τον ρόλο της τέχνης στα δύο ποιήματα της θεωρίας («Μελαγχολία…» και «Το σημειωματάριο»);`, options: ["Και στα δύο η τέχνη απαλύνει μια απώλεια χωρίς να την αναιρεί· στον Καβάφη ναρκώνει τον πόνο, στο αδίδακτο κρατά ζωντανή τη μνήμη.", "Και στα δύο η τέχνη θεραπεύει οριστικά τον πόνο.", "Στον Καβάφη η τέχνη είναι άχρηστη, ενώ στο αδίδακτο φέρνει πίσω τον χαμένο φίλο.", "Κανένα από τα δύο δεν αναφέρεται στη γραφή ή στην ποίηση."], correct: 0,
      hint: R`Πρόσεξε τα «για λίγο» και «δεν θα διαβάσεις τίποτα».`, sol: R`Η τέχνη έχει <b>περιορισμένη αλλά πραγματική</b> δύναμη και στα δύο: «για λίγο» (Καβάφης) — «δεν θα διαβάσεις τίποτα», «όσο γράφω, κάθεσαι απέναντί μου» (αδίδακτο). Διαφέρει ο τρόπος: νάρκωση του πόνου ↔ διατήρηση της μνήμης.` },
    { level: 3, shuffle: true, type: "mc", q: R`Στο δειγματικό δοκίμιο, η «Ομίχλη» (α΄ ενικό) συγκρίθηκε με απόσπασμα σε α΄ πληθυντικό. Πώς λειτουργεί η διαφοροποίηση για τον αναγνώστη;`, options: ["Το α΄ ενικό δίνει βιωματικότητα και εξομολόγηση· το α΄ πληθυντικό προσθέτει συλλογικότητα και κάνει τον αναγνώστη συνοδοιπόρο", "Το α΄ πληθυντικό κάνει την αφήγηση πιο αντικειμενική και ψυχρή", "Δεν υπάρχει καμία διαφορά για τον αναγνώστη", "Το α΄ ενικό δείχνει ότι ο αφηγητής δεν συμμετέχει στην ιστορία"], correct: 0,
      hint: R`Σκέψου ποιος περιλαμβάνεται στο «εμείς».`, sol: R`Ο οδηγός διόρθωσης επισημαίνει: α΄ ενικό → δύναμη της βιωμένης εμπειρίας, εξομολογητικός χαρακτήρας· α΄ πληθυντικό → συλλογικότητα, οικειότητα, ο αναγνώστης γίνεται συμμέτοχος και πιο δεκτικός.` }
  ]
},
/* ───────────────────────────── 1.3 ───────────────────────────── */
{
  id: "1.3", unit: 1, title: "Λογοτεχνικός γραμματισμός: ποιητικό υποκείμενο, αφηγητής, εστίαση, αφηγηματικές τεχνικές, εκφραστικά μέσα",
  book: "Σύνοψη Λογοτεχνικού Γραμματισμού για το Λύκειο (Πλαίσιο Μάθησης Λογοτεχνίας Εμβάθυνσης Γ΄ Λυκείου 2026–27)",
  intro: "Ποια είναι τα «εργαλεία» της λογοτεχνικής ανάλυσης — αφηγητής, εστίαση, αναδρομή, μεταφορά, σύμβολο — και πώς εξηγούμε τη λειτουργία τους στις εξετάσεις;",
  thumb: LETTER("Σχήματα"),
  theory: R`
<p>Ο <b>λογοτεχνικός γραμματισμός</b> είναι το λεξιλόγιο και οι έννοιες με τις οποίες περιγράφουμε πώς είναι φτιαγμένο ένα λογοτεχνικό κείμενο. Στην Εμβάθυνση τα στοιχεία αυτά δεν ζητούνται ως ορισμοί, αλλά <b>πάνω στο κείμενο</b>: εντοπίζεις π.χ. μια αναδρομή ή μια μεταφορά και εξηγείς τη <b>λειτουργία</b> της — τι προσφέρει στο νόημα, στην ατμόσφαιρα, στον αναγνώστη. Ακολουθεί η ύλη της «Σύνοψης Λογοτεχνικού Γραμματισμού». Όλα τα παραδείγματα είναι πρωτότυπα.</p>
<div class="tbox def"><h4>Ποίηση: δημοτική, παραδοσιακή, μοντέρνα</h4>
<table class="tbl"><tr><th>Είδος</th><th>Γνωρίσματα</th></tr>
<tr><td>Δημοτική</td><td>Δεκαπεντασύλλαβος, ισομετρία (κάθε στίχος ολοκληρωμένο νόημα), επαναλήψεις, σχήμα των τριών, σχήμα του αδυνάτου, τυπικά επίθετα, λιτός και ζωντανός λόγος</td></tr>
<tr><td>Παραδοσιακή έντεχνη</td><td>Μέτρο, στροφές, ομοιοκαταληξία, λυρικό ύφος, συνάφεια τίτλου–περιεχομένου</td></tr>
<tr><td>Μοντέρνα</td><td>Ελεύθερος στίχος, απουσία μέτρου και ομοιοκαταληξίας, άνισες στροφές, χαλαρή στίξη, χαλάρωση της λογικής αλληλουχίας, ασάφεια, <b>σύμβολα</b>, διασκελισμός, καθημερινή γλώσσα, αινιγματικός τίτλος</td></tr></table>
<p><b>Ποιητικό υποκείμενο</b> είναι η «φωνή» που μιλά στο ποίημα· <b>δεν ταυτίζεται</b> με τον ποιητή (π.χ. στον Καβάφη μιλά ο φανταστικός Ιάσων Κλεάνδρου). Η <b>ποιητική λέξη-σύμβολο</b> αποκτά μεταφορικές σημασίες πέρα από την κυριολεξία (η θάλασσα = ελευθερία, ταξίδι, μνήμη…).</p></div>
<div class="tbox def"><h4>Πεζογραφία: αφηγητής, πρόσωπο, εστίαση</h4>
<ul><li><b>Αφηγητής</b>: πλασματικό πρόσωπο, διαφορετικό από τον συγγραφέα. <b>Ομοδιηγητικός</b>: συμμετέχει στην ιστορία — ως πρωταγωνιστής (<b>αυτοδιηγητικός</b>) ή ως μάρτυρας/δευτερεύων ήρωας. <b>Ετεροδιηγητικός</b>: δεν συμμετέχει.</li>
<li><b>Πρόσωπο αφήγησης</b>: πρωτοπρόσωπη (α΄ πρόσωπο) ή τριτοπρόσωπη (γ΄ πρόσωπο). Το α΄ πρόσωπο δίνει αμεσότητα, βιωματικότητα, αξιοπιστία μαρτυρίας· το α΄ πληθυντικό συλλογικότητα· το β΄ πρόσωπο οικειότητα/διάλογο.</li>
<li><b>Εστίαση</b> (πόσα ξέρει ο αφηγητής): <b>μηδενική</b> (παντογνώστης — ξέρει περισσότερα από κάθε ήρωα), <b>εσωτερική</b> (βλέπουμε μέσα από τη ματιά ενός προσώπου), <b>εξωτερική</b> (μόνο ό,τι φαίνεται και ακούγεται).</li></ul></div>
<div class="tbox def"><h4>Αφηγηματικοί τρόποι και τεχνικές</h4>
<p><b>Τρόποι</b>: αφήγηση, περιγραφή, διάλογος, μονόλογος (εσωτερικός μονόλογος), σχόλιο. Λειτουργούν στην εξέλιξη της δράσης, στην παρουσίαση και σκιαγράφηση των χαρακτήρων, στη δημιουργία ατμόσφαιρας. <b>Απόδοση λόγου</b>: ευθύς (αυτούσια λόγια) ή πλάγιος λόγος (με «ότι/πως»).</p>
<p><b>Τεχνικές του χρόνου</b>: <b>αναδρομή</b> (επιστροφή σε προγενέστερα γεγονότα), <b>πρόληψη/προοικονομία</b> (προαναγγελία), <b>επιτάχυνση</b> (περίληψη ή παράλειψη μέρους της ιστορίας), <b>επιβράδυνση</b> (καθυστέρηση με εκτενή περιγραφή ή σχόλιο), <b>επανάληψη</b>. Χρήσιμες ακόμη: in medias res, εγκιβωτισμός.</p></div>
<div class="tbox thm"><h4>Εκφραστικά μέσα και λειτουργία</h4>
<p>Επανάληψη, παρήχηση, εικόνες (οπτικές, ακουστικές, οσφρητικές, γευστικές, απτικές), παρομοίωση, μεταφορά, προσωποποίηση, αλληγορία, αντίθεση, ασύνδετο σχήμα, υπερβολή, κοσμητικά επίθετα — και συχνά αποστροφή, οξύμωρο, ρητορική ερώτηση.</p>
<div class="fbox">Λειτουργία (ενδεικτικά): <b>ρυθμός/μουσικότητα</b> · <b>ζωντανές εικόνες</b> · <b>έμφαση στο νόημα</b> · <b>συναισθηματική ένταση</b></div>
<p>Παράδειγμα (πρωτότυπο): «Η πόλη ήταν ένα ξεχαρβαλωμένο ρολόι που κανείς δεν κούρδιζε πια» → <b>μεταφορά</b>· δείχνει παραστατικά την παρακμή και τη στασιμότητα της πόλης και δημιουργεί μελαγχολική ατμόσφαιρα.</p></div>
<div class="tbox ex"><h4>Μικρή άσκηση με λύση</h4>
<p>Πρωτότυπο απόσπασμα: «Ήμουν δώδεκα χρονών όταν έφυγε ο πατέρας για τη Γερμανία. Αργότερα θα μάθαινα ότι δεν σκόπευε να γυρίσει. Εκείνο το πρωί όμως μύριζε φρέσκο ψωμί, και η μάνα τραγουδούσε στην αυλή.»</p>
<details class="steps"><summary>Λύση βήμα-βήμα</summary>
<p><b>Αφηγητής:</b> ομοδιηγητικός (αυτοδιηγητικός), α΄ πρόσωπο — μιλά για τα δικά του βιώματα. <b>Εστίαση:</b> εσωτερική. <b>Τεχνική:</b> «Αργότερα θα μάθαινα…» = <b>πρόληψη</b>, που προαναγγέλλει την εγκατάλειψη και φορτίζει δραματικά τη σκηνή. <b>Εικόνες:</b> οσφρητική (ψωμί) και ακουστική (τραγούδι): η ειδυλλιακή ατμόσφαιρα <b>αντιτίθεται</b> στην πικρή γνώση του αναγνώστη — ειρωνεία της κατάστασης.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Ταύτιση αφηγητή ή ποιητικού υποκειμένου με τον συγγραφέα.</li>
<li>Σύγχυση <b>εστίασης</b> (τι ξέρει ο αφηγητής) με <b>πρόσωπο</b> (σε ποιο πρόσωπο γράφει).</li>
<li>Σύγχυση παρομοίωσης (με «σαν/όπως») και μεταφοράς (χωρίς συγκριτικό μόριο).</li>
<li>Γενικόλογες λειτουργίες («δίνει ζωντάνια») χωρίς σύνδεση με το συγκεκριμένο νόημα.</li></ul></div>
`,
  widget: "nc1detect",
  gen: "nc1gNarr",
  exercises: [
    { level: 1, shuffle: true, type: "mc", q: R`Πρωτότυπο παράδειγμα: «Η θάλασσα ήταν ήρεμη σαν ανάσα κοιμισμένου παιδιού.» Ποιο εκφραστικό μέσο έχουμε;`, options: ["παρομοίωση", "μεταφορά", "προσωποποίηση", "αντίθεση"], correct: 0,
      hint: R`Υπάρχει συγκριτικό μόριο;`, sol: R`<b>Παρομοίωση</b> (με το «σαν»): η ηρεμία της θάλασσας συγκρίνεται με τρυφερή, αθώα εικόνα.` },
    { level: 1, shuffle: true, type: "mc", q: R`Ο αφηγητής που δεν συμμετέχει καθόλου στην ιστορία που αφηγείται λέγεται:`, options: ["ετεροδιηγητικός", "ομοδιηγητικός", "αυτοδιηγητικός", "πρωταγωνιστής-αφηγητής"], correct: 0,
      hint: R`«Έτερος» = άλλος.`, sol: R`<b>Ετεροδιηγητικός</b>: αφηγείται μια ιστορία «άλλων».` },
    { level: 1, q: R`Πώς λέγεται η τεχνική με την οποία η αφήγηση επιστρέφει σε γεγονότα που προηγήθηκαν της κύριας δράσης;`, fields: [{ label: "Τεχνική:", ans: ["αναδρομή", "αναδρομη", "αναδρομική αφήγηση", "flashback"], text: true }],
      hint: R`Ποιος όρος δηλώνει την επιστροφή της αφήγησης σε προγενέστερο χρόνο;`, sol: R`<b>Αναδρομή</b> (αναδρομική αφήγηση).` },
    { level: 1, type: "mc", q: R`Το ποιητικό υποκείμενο ταυτίζεται πάντα με τον ίδιο τον ποιητή.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Σκέψου τον Ιάσονα Κλεάνδρου του Καβάφη.`, sol: R`<b>ΛΑΘΟΣ.</b> Το ποιητικό υποκείμενο είναι η «φωνή» του ποιήματος· μπορεί να είναι προσωπείο, φανταστικό πρόσωπο ή συλλογικό «εμείς».` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποιο ΔΕΝ είναι γνώρισμα της μοντέρνας ποίησης κατά τη Σύνοψη Λογοτεχνικού Γραμματισμού;`, options: ["Ο κανόνας της ισομετρίας", "Ο ελεύθερος στίχος", "Η χαλαρή στίξη", "Τα σύμβολα"], correct: 0,
      hint: R`Ένα από αυτά ανήκει στη δημοτική ποίηση.`, sol: R`Η <b>ισομετρία</b> (κάθε στίχος ολοκληρωμένο νόημα) είναι γνώρισμα της <b>δημοτικής</b> ποίησης.` },
    { level: 2, shuffle: true, type: "mc", q: R`Πρωτότυπο παράδειγμα: «Πέρασαν τρία χρόνια. Ο πόλεμος τέλειωσε, το σπίτι πουλήθηκε, οι φίλοι σκόρπισαν.» Ποια χρονική τεχνική κυριαρχεί;`, options: ["επιτάχυνση", "επιβράδυνση", "αναδρομή", "πρόληψη"], correct: 0,
      hint: R`Πόσος χρόνος ιστορίας χωρά σε πόσες λέξεις;`, sol: R`<b>Επιτάχυνση</b>: τρία χρόνια δίνονται περιληπτικά σε μία πρόταση.` },
    { level: 2, shuffle: true, type: "mc", q: R`Η εστίαση κατά την οποία ο αφηγητής καταγράφει μόνο ό,τι φαίνεται και ακούγεται, χωρίς σκέψεις και συναισθήματα, λέγεται:`, options: ["εξωτερική", "εσωτερική", "μηδενική", "πολυεστιακή"], correct: 0,
      hint: R`Σαν κάμερα.`, sol: R`<b>Εξωτερική εστίαση</b>: ο αφηγητής ξέρει λιγότερα από τους ήρωες.` },
    { level: 2, q: R`Πόσες είναι οι συλλαβές του στίχου της δημοτικής ποίησης (δεκαπεντασύλλαβος);`, fields: [{ label: "Συλλαβές:", ans: 15 }],
      hint: R`Ανάλυσε το σύνθετο: δεκα- + πέντε + συλλαβή.`, sol: R`<b>15</b> συλλαβές (ιαμβικός δεκαπεντασύλλαβος).` },
    { level: 3, shuffle: true, type: "mc", q: R`Πρωτότυπο απόσπασμα: «Το φλιτζάνι γλίστρησε από το χέρι της. Το είδε να γέρνει, να στριφογυρίζει αργά στον αέρα, να φωτίζεται από τον ήλιο, να πλησιάζει το μάρμαρο…» Ποια είναι η λειτουργία της τεχνικής;`, options: ["Η επιβράδυνση απλώνει τη στιγμή και δημιουργεί αγωνία και ένταση", "Η επιτάχυνση παραλείπει γεγονότα για να προχωρήσει η πλοκή", "Η αναδρομή εξηγεί το παρελθόν της ηρωίδας", "Ο διάλογος σκιαγραφεί τον χαρακτήρα"], correct: 0,
      hint: R`Ο χρόνος της αφήγησης είναι μεγαλύτερος από τον χρόνο της ιστορίας.`, sol: R`<b>Επιβράδυνση</b>: μια στιγμή αναλύεται σε πολλές λεπτομέρειες (ασύνδετη σειρά ρημάτων), ο αναγνώστης κρατά την ανάσα του.` },
    { level: 3, shuffle: true, type: "mc", q: R`Πρωτότυπο απόσπασμα: «Ο Πέτρος δεν ήξερε ότι η γυναίκα του είχε ήδη αποφασίσει να φύγει· εκείνη, πάλι, φοβόταν ότι εκείνος το είχε καταλάβει.» Ποια είναι η εστίαση και γιατί;`, options: ["Μηδενική: ο αφηγητής γνωρίζει τις σκέψεις και των δύο προσώπων", "Εσωτερική: βλέπουμε μόνο μέσα από τα μάτια του Πέτρου", "Εξωτερική: καταγράφονται μόνο πράξεις", "Εσωτερική: η αφήγηση είναι σε α΄ πρόσωπο"], correct: 0,
      hint: R`Ποιος ξέρει τι σκέφτονται και οι δύο;`, sol: R`<b>Μηδενική εστίαση</b> (παντογνώστης ετεροδιηγητικός αφηγητής): γνωρίζει περισσότερα από κάθε ήρωα — εδώ αυτό αναδεικνύει την τραγική έλλειψη επικοινωνίας του ζευγαριού.` }
  ]
},
/* ───────────────────────────── 2.1 ───────────────────────────── */
{
  id: "2.1", unit: 2, title: "Από τον συμβολισμό στον μοντερνισμό: Καβάφης, Γενιά του ’30 και υπερρεαλισμός",
  book: "Πλαίσιο Μάθησης Λογοτεχνίας Εμβάθυνσης Γ΄ Λυκείου (ύλη 1920–20ός αι.) · ΝΕ. ΛΟΓ. Γ΄",
  intro: "Τι άλλαξε στην ελληνική ποίηση μετά το 1920 — τι είναι ο μοντερνισμός, η Γενιά του ’30 και ο υπερρεαλισμός, και πώς τα αναγνωρίζουμε σε ένα ποίημα;",
  thumb: LETTER("1930"),
  theory: R`
<p>Η ύλη της Λογοτεχνίας Εμβάθυνσης της Γ΄ Λυκείου οργανώνεται <b>ιστορικά, από το 1920 ως τα τέλη του 20ού αιώνα</b>, με έμφαση στη <b>διαλεκτική σχέση ευρωπαϊκής και νεοελληνικής λογοτεχνίας</b>. Για να καταλάβεις τα κείμενα, πρέπει να ξέρεις σε ποιο ρεύμα ανήκουν: συχνά οι ερωτήσεις ζητούν να «εντοπίσετε χαρακτηριστικά του μοντερνισμού» ή «υπερρεαλιστικά στοιχεία» σε ένα ποίημα.</p>
<div class="tbox def"><h4>Συμβολισμός — η αφετηρία της μοντέρνας ποίησης</h4>
<p>Ο <b>συμβολισμός</b> (Γαλλία, β΄ μισό 19ου αι., με πρόδρομο τον <b>Σαρλ Μπωντλαίρ</b>, «Τα άνθη του κακού», 1857) ζητά από την ποίηση να <b>υποβάλλει</b> διαθέσεις μέσα από σύμβολα, μουσικότητα και «αντιστοιχίες» των αισθήσεων, αντί να περιγράφει ή να διδάσκει. Ο «Άλμπατρος» του Μπωντλαίρ — ο ποιητής σαν μεγάλο θαλασσοπούλι που, όταν το πιάνουν οι ναύτες, σέρνεται αδέξια στο κατάστρωμα — είναι η αρχετυπική εικόνα του ποιητή-ξένου, που θα ξαναβρούμε στον Σαχτούρη.</p></div>
<div class="tbox def"><h4>Ο Καβάφης: μια μοναδική φωνή</h4>
<p>Ο <b>Κ. Π. Καβάφης</b> (Αλεξάνδρεια, 1863–1933) δεν ανήκει σε καμία σχολή. Χαρακτηριστικά του: <b>ιστορικά (ή φανταστικά) πρόσωπα ως προσωπεία</b>, μέσα από τα οποία μιλά για διαχρονικά ανθρώπινα βιώματα· <b>λιτή, πεζολογική γλώσσα</b> με μείξη δημοτικής και λόγιων στοιχείων· <b>στοχαστικός</b> χαρακτήρας, <b>ειρωνεία</b>, δραματικός μονόλογος. Τα ποιήματά του χωρίζονται σε ιστορικά, φιλοσοφικά και ερωτικά (ή «ηδονικά»). Η ποίησή του επηρέασε καθοριστικά τους νεότερους ποιητές.</p></div>
<div class="tbox def"><h4>Ευρωπαϊκός μοντερνισμός</h4>
<p>Μετά τον Α΄ Παγκόσμιο Πόλεμο, ποιητές όπως ο <b>Τ. Σ. Έλιοτ</b> («Η έρημη χώρα», 1922) εκφράζουν την αίσθηση ενός κατακερματισμένου κόσμου με νέα μέσα: <b>ελεύθερο στίχο</b>, <b>αποσπασματική σύνθεση</b>, <b>συνειρμική</b> ανάπτυξη, <b>διακειμενικότητα</b> (αναφορές σε άλλα κείμενα και μύθους) και τη λεγόμενη <b>μυθική μέθοδο</b>: ο αρχαίος μύθος δίνει σχήμα και νόημα στο σύγχρονο χάος.</p></div>
<div class="tbox thm"><h4>Η Γενιά του ’30</h4>
<p>Με αφετηρία συμβατικά το δοκίμιο του Γιώργου Θεοτοκά «Ελεύθερο πνεύμα» (1929), μια γενιά λογοτεχνών ανανεώνει την ελληνική λογοτεχνία:</p>
<ul><li><b>Ποιητές</b>: Γιώργος Σεφέρης (Νόμπελ 1963), Οδυσσέας Ελύτης (Νόμπελ 1979), Ανδρέας Εμπειρίκος, Νίκος Εγγονόπουλος, Γιάννης Ρίτσος, Νικηφόρος Βρεττάκος κ.ά.</li>
<li><b>Πεζογράφοι</b>: Ηλίας Βενέζης, Στράτης Μυριβήλης, Στρατής Δούκας, Κοσμάς Πολίτης, Μ. Καραγάτσης, Γιώργος Θεοτοκάς κ.ά. — συχνά με θέμα τη Μικρασιατική Καταστροφή, τον πόλεμο και την προσφυγιά.</li>
<li><b>Γνωρίσματα</b>: ελεύθερος στίχος, λιτή γλώσσα, <b>αναζήτηση της «ελληνικότητας»</b> (σύνδεση αρχαίας, βυζαντινής και λαϊκής παράδοσης με τη νεωτερική τέχνη), αξιοποίηση του μύθου, ευρωπαϊκός προσανατολισμός.</li></ul></div>
<div class="tbox thm"><h4>Ο υπερρεαλισμός</h4>
<p>Το <b>Μανιφέστο του υπερρεαλισμού</b> (Αντρέ Μπρετόν, 1924) προτείνει την <b>αυτόματη γραφή</b>: τη γραφή χωρίς λογικό έλεγχο, για να μιλήσει το ασυνείδητο και το όνειρο. Στην Ελλάδα ο υπερρεαλισμός εμφανίζεται με την «Υψικάμινο» (1935) του <b>Ανδρέα Εμπειρίκου</b> και με τον <b>Νίκο Εγγονόπουλο</b>· ο <b>Ελύτης</b> τον αφομοιώνει δημιουργικά, με λυρισμό και φως. Γνωρίσματα σε ποίημα: <b>παράδοξες, ονειρικές εικόνες</b>, <b>απρόσμενοι συνδυασμοί λέξεων</b>, χαλάρωση της λογικής αλληλουχίας, κυριαρχία της φαντασίας.</p></div>
<div class="tbox ex"><h4>Αναγνώριση ρεύματος σε πρωτότυπους στίχους</h4>
${PASSAGE(`Στο τραπέζι της κουζίνας φύτρωσε ένα πορτοκαλί φεγγάρι
κι η μάνα μου το έκοψε στα τέσσερα για να το μοιράσει στα ψάρια.`, { title: "Πρωτότυπο δίστιχο εξάσκησης", num: "line" })}
<details class="steps"><summary>Λύση</summary><p>Ελεύθερος στίχος, απουσία ομοιοκαταληξίας, <b>παράδοξη, ονειρική εικόνα</b> (φεγγάρι που φυτρώνει στο τραπέζι και μοιράζεται στα ψάρια), απρόσμενος συνδυασμός του καθημερινού με το φανταστικό → <b>υπερρεαλιστικά στοιχεία</b>. Η λειτουργία τους: απελευθερώνουν τη φαντασία και δημιουργούν μια τρυφερή, μαγική ατμόσφαιρα γύρω από τη μητέρα.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>«Ο Καβάφης ανήκει στη Γενιά του ’30» — λάθος: είναι προγενέστερος και ανεξάρτητος.</li>
<li>Ταύτιση του μοντερνισμού μόνο με τον ελεύθερο στίχο: χρειάζονται και σύμβολα, συνειρμοί, διακειμενικότητα, ασάφεια.</li>
<li>Χαρακτηρισμός κάθε «περίεργης» εικόνας ως υπερρεαλιστικής χωρίς εξήγηση της λειτουργίας της.</li></ul></div>
`,
  widget: "nc1timeline",
  gen: "nc1gMove",
  exercises: [
    { level: 1, shuffle: true, type: "mc", q: R`Ποιο δοκίμιο θεωρείται συμβατικά «μανιφέστο» της Γενιάς του ’30;`, options: ["Γ. Θεοτοκάς, «Ελεύθερο πνεύμα» (1929)", "Α. Μπρετόν, «Μανιφέστο του υπερρεαλισμού» (1924)", "Τ. Σ. Έλιοτ, «Η έρημη χώρα» (1922)", "Σ. Μπωντλαίρ, «Τα άνθη του κακού» (1857)"], correct: 0,
      hint: R`Ξεχώρισε ποιο έργο είναι ελληνικό και ποια ευρωπαϊκά.`, sol: R`Το <b>«Ελεύθερο πνεύμα»</b> του Θεοτοκά (1929). Τα άλλα είναι ευρωπαϊκά έργα (υπερρεαλισμός, μοντερνισμός, συμβολισμός).` },
    { level: 1, q: R`Ποιος Έλληνας ποιητής εισάγει τον υπερρεαλισμό με την «Υψικάμινο» (1935); (γράψε το επώνυμο)`, fields: [{ label: "Επώνυμο:", ans: ["Εμπειρίκος", "Ανδρέας Εμπειρίκος", "Α. Εμπειρίκος", "Εμπειρικος"], text: true, nopunct: true }],
      hint: R`Ανάτρεξε στην ενότητα για τον ελληνικό υπερρεαλισμό (1935).`, sol: R`Ο <b>Ανδρέας Εμπειρίκος</b>.` },
    { level: 1, type: "mc", q: R`Ο Κ. Π. Καβάφης είναι από τους ιδρυτές της Γενιάς του ’30.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Πότε έζησε ο Καβάφης και σε ποια σχολή ανήκει;`, sol: R`<b>ΛΑΘΟΣ.</b> Ο Καβάφης (1863–1933) δεν ανήκει σε σχολή· έχει δική του, ιδιαίτερη ποιητική.` },
    { level: 1, q: R`Ποια χρονιά τιμήθηκε ο Γιώργος Σεφέρης με το Βραβείο Νόμπελ Λογοτεχνίας;`, fields: [{ label: "Έτος:", ans: 1963 }],
      hint: R`Στη δεκαετία του 1960.`, sol: R`Το <b>1963</b> — πρώτος Έλληνας νομπελίστας. Ο Ελύτης ακολούθησε το 1979.` },
    { level: 2, shuffle: true, type: "mc", q: R`Τι εννοούμε με τη «μυθική μέθοδο» του μοντερνισμού;`, options: ["Ο αρχαίος μύθος χρησιμοποιείται ως σχήμα για να εκφραστούν σύγχρονες εμπειρίες", "Ο ποιητής ξαναγράφει πιστά έναν αρχαίο μύθο σε δεκαπεντασύλλαβο", "Η ποίηση αποφεύγει κάθε αναφορά στο παρελθόν", "Ο ποιητής γράφει παραμύθια για παιδιά"], correct: 0,
      hint: R`Σκέψου τους «Αργοναύτες» του Σεφέρη.`, sol: R`Ο μύθος (π.χ. Αργοναύτες) γίνεται <b>σύμβολο</b> για τη σύγχρονη ανθρώπινη και ιστορική εμπειρία.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποιο από τα παρακάτω είναι χαρακτηριστικό γνώρισμα της καβαφικής ποίησης;`, options: ["Ιστορικά πρόσωπα ως προσωπεία και λιτή, πεζολογική γλώσσα", "Αυτόματη γραφή και ονειρικές εικόνες", "Δεκαπεντασύλλαβος και τυπικά επίθετα", "Πομπώδης, ρητορική γλώσσα"], correct: 0,
      hint: R`Ποιο εργαλείο χρησιμοποιεί στον «Καισαρίωνα» και στη «Μελαγχολία»;`, sol: R`Τα <b>ιστορικά προσωπεία</b> και η <b>πεζολογική</b>, στοχαστική γλώσσα.` },
    { level: 2, shuffle: true, type: "mc", q: R`Η «ελληνικότητα» της Γενιάς του ’30 σημαίνει κυρίως:`, options: ["Σύνδεση της ελληνικής παράδοσης (αρχαίας, βυζαντινής, λαϊκής) με τη νεωτερική τέχνη", "Απόρριψη κάθε ευρωπαϊκής επίδρασης", "Επιστροφή στην καθαρεύουσα", "Αποκλειστικά ηθογραφικά θέματα από το χωριό"], correct: 0,
      hint: R`Η γενιά έχει και ευρωπαϊκό προσανατολισμό.`, sol: R`Η ελληνικότητα είναι <b>γόνιμη σύνθεση παράδοσης και νεωτερικότητας</b>, όχι εθνική απομόνωση.` },
    { level: 3, shuffle: true, type: "mc", q: R`Στο πρωτότυπο δίστιχο της θεωρίας (φεγγάρι που φυτρώνει στο τραπέζι και μοιράζεται στα ψάρια), ποιο ρεύμα αναγνωρίζουμε και γιατί;`, options: ["Υπερρεαλισμό, γιατί κυριαρχούν παράδοξες, ονειρικές εικόνες και απρόσμενοι συνδυασμοί", "Δημοτική ποίηση, γιατί έχει δεκαπεντασύλλαβο", "Ρεαλισμό, γιατί περιγράφει πιστά μια κουζίνα", "Παραδοσιακή ποίηση, γιατί έχει ομοιοκαταληξία"], correct: 0,
      hint: R`Είναι η εικόνα λογικά δυνατή;`, sol: R`<b>Υπερρεαλισμός</b>: η λογική αλληλουχία χαλαρώνει, η φαντασία κυριαρχεί και το καθημερινό γίνεται μαγικό.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποιος συνδυασμός ποιητή–χαρακτηριστικού είναι σωστός;`, options: ["Ελύτης: δημιουργική αφομοίωση του υπερρεαλισμού με λυρισμό και φως του Αιγαίου", "Εμπειρίκος: αυστηρός δεκαπεντασύλλαβος", "Καβάφης: αυτόματη γραφή", "Σεφέρης: σοσιαλιστικός ρεαλισμός"], correct: 0,
      hint: R`Σκέψου τη «Μαρίνα των βράχων».`, sol: R`Ο <b>Ελύτης</b> παίρνει από τον υπερρεαλισμό την ελευθερία των εικόνων, αλλά τη δένει με λυρισμό και ελληνικό φως.` }
  ]
},
/* ───────────────────────────── 2.2 ───────────────────────────── */
{
  id: "2.2", unit: 2, title: "Α΄ μεταπολεμική ποίηση, ποιήματα ποιητικής και κυπριακή λογοτεχνία του 20ού αιώνα",
  book: "Πλαίσιο Μάθησης Λογοτεχνίας Εμβάθυνσης Γ΄ Λυκείου, Β΄ τετράμηνο · ΝΕ. ΛΟΓ. Γ΄ · ΚΚΛ",
  intro: "Πώς άλλαξε η ποίηση μετά τον Β΄ Παγκόσμιο Πόλεμο και τον Εμφύλιο, τι είναι τα «ποιήματα ποιητικής» και πώς συνομιλεί η κυπριακή ποίηση με τη νεοελληνική και ευρωπαϊκή;",
  thumb: LETTER("1950"),
  theory: R`
<p>Το Β΄ τετράμηνο της Εμβάθυνσης είναι αφιερωμένο κυρίως στην <b>Α΄ μεταπολεμική γενιά</b> (Σαχτούρης, Αναγνωστάκης), στα <b>ποιήματα ποιητικής</b> και στην <b>κυπριακή λογοτεχνία</b> του 2ου μισού του 20ού αιώνα (Μόντης, Χαραλαμπίδης), μαζί με ένα κείμενο της ευρωπαϊκής <b>αντιστασιακής</b> λογοτεχνίας (Καμύ). Κοινός παρονομαστής: πώς η ιστορία — πόλεμος, Εμφύλιος, δικτατορία, εισβολή — αλλάζει τη θέση και τη φωνή του ποιητή.</p>
<div class="tbox def"><h4>Η Α΄ μεταπολεμική γενιά</h4>
<p>Ποιητές που εμφανίζονται μετά το 1945: <b>Μανόλης Αναγνωστάκης</b>, <b>Μίλτος Σαχτούρης</b>, <b>Τίτος Πατρίκιος</b>, Τάκης Σινόπουλος, Μιχάλης Κατσαρός, Άρης Αλεξάνδρου κ.ά. Βασικά γνωρίσματα:</p>
<ul><li>η εμπειρία του πολέμου, της Κατοχής και του <b>Εμφυλίου</b>· η αίσθηση της καταστροφής και της ήττας·</li>
<li>η <b>διάψευση των συλλογικών οραμάτων</b>, η πολιτική απογοήτευση, η ενοχή, η <b>υπαρξιακή αγωνία</b>·</li>
<li><b>λιτή, αντιρητορική</b>, καθημερινή γλώσσα, συχνά ειρωνική ή αποφθεγματική· ελεύθερος στίχος·</li>
<li>στον Σαχτούρη, ισχυρά <b>υπερρεαλιστικά</b> στοιχεία (εφιαλτικές, παράδοξες εικόνες).</li></ul></div>
<div class="tbox def"><h4>Ποιήματα ποιητικής</h4>
<p>Λέγεται <b>ποίημα ποιητικής</b> το ποίημα που <b>στοχάζεται πάνω στην ίδια την ποίηση</b>: στη φύση, στον ρόλο, στη δύναμη και στα όριά της, στη σχέση ποιητή–κοινωνίας. Στην ύλη:</p>
<table class="tbl"><tr><th>Ποίημα</th><th>Η άποψη για την ποίηση (με δικά μας λόγια)</th></tr>
<tr><td>Καβάφης, «Μελαγχολία του Ιάσωνος Κλεάνδρου…»</td><td>Φάρμακο που απαλύνει για λίγο τον πόνο της φθοράς</td></tr>
<tr><td>Ελύτης, «Μικρή πράσινη θάλασσα»</td><td>Διασώζει και ανασυνθέτει την πολιτισμική μνήμη</td></tr>
<tr><td>Σαχτούρης, «Ο ελεγκτής»</td><td>Χρέος και ευθύνη του ποιητή-φύλακα, που επαγρυπνεί ακόμη και πληγωμένος</td></tr>
<tr><td>Αναγνωστάκης, «Επίλογος»</td><td>Δεν ανατρέπει καθεστώτα· διατηρεί όμως την ηθική ευθύνη και τη μαρτυρία</td></tr>
<tr><td>Εγγονόπουλος, «Ποίηση 1948»</td><td>Στον Εμφύλιο η ποίηση γίνεται σχεδόν αδύνατη, πικραμένη — κι όμως γράφεται</td></tr>
<tr><td>Μόντης, «Όλοι εμείς που γράφουμε στίχους»</td><td>Οικουμενική, διαχρονική αδελφότητα των ποιητών· δημιουργία και αντίσταση</td></tr></table></div>
<div class="tbox thm"><h4>Κυπριακή λογοτεχνία του 2ου μισού του 20ού αιώνα</h4>
<p>Μετά τον απελευθερωτικό αγώνα (1955–1959), την Ανεξαρτησία (1960) και κυρίως μετά την <b>τουρκική εισβολή του 1974</b>, η κυπριακή ποίηση (Κώστας Μόντης, Παντελής Μηχανικός, Κυριάκος Χαραλαμπίδης κ.ά.) και πεζογραφία (Γ. Φ. Πιερίδης κ.ά.) συνδυάζουν τη μοντερνιστική έκφραση — ελεύθερο στίχο, σύμβολα, συνειρμικές εικόνες — με την κυπριακή ιστορική εμπειρία: <b>κατοχή, προσφυγιά, νόστος, μνήμη</b>. Το Πλαίσιο ζητά να βλέπουμε τη <b>διαλεκτική σχέση</b> της κυπριακής με τη νεοελληνική, ευρωπαϊκή και παγκόσμια λογοτεχνία: τα κυπριακά βιώματα γίνονται οικουμενικά θέματα (απώλεια πατρίδας, ελευθερία, ανθρώπινα δικαιώματα).</p></div>
<div class="tbox rem"><h4>Ευρωπαϊκή αντιστασιακή λογοτεχνία</h4>
<p>Ο <b>Αλμπέρ Καμύ</b> (1913–1960, Νόμπελ 1957) γράφει μέσα στη γερμανική κατοχή της Γαλλίας τα «Γράμματα σ’ ένα Γερμανό φίλο» (1943–1944): στοχαστικός, επιχειρηματολογικός επιστολικός λόγος, που υπερασπίζεται τον ανθρωπισμό απέναντι στη βία. Συνδέεται με τον προβληματισμό του για το παράλογο και την ηθική ευθύνη του ανθρώπου.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Σύγχυση της Α΄ μεταπολεμικής με τη Γενιά του ’30 (π.χ. «ο Αναγνωστάκης ανήκει στη Γενιά του ’30»).</li>
<li>Αναφορά στο ιστορικό πλαίσιο χωρίς σύνδεση με τις εικόνες του ποιήματος.</li>
<li>Στα ποιήματα ποιητικής: παρουσίαση της «άποψης για την ποίηση» χωρίς τεκμηρίωση από τους στίχους.</li></ul></div>
`,
  widget: "nc1move",
  gen: "nc1gMove",
  exercises: [
    { level: 1, shuffle: true, type: "mc", q: R`Σε ποια γενιά ανήκουν ο Μανόλης Αναγνωστάκης και ο Τίτος Πατρίκιος;`, options: ["Στην Α΄ μεταπολεμική γενιά", "Στη Γενιά του ’30", "Στη Νέα Αθηναϊκή Σχολή", "Στη Γενιά του ’70"], correct: 0,
      hint: R`Εμφανίζονται μετά το 1945.`, sol: R`<b>Α΄ μεταπολεμική γενιά.</b>` },
    { level: 1, shuffle: true, type: "mc", q: R`Τι ονομάζουμε «ποίημα ποιητικής»;`, options: ["Ποίημα που στοχάζεται πάνω στη φύση, τον ρόλο και τα όρια της ίδιας της ποίησης", "Κάθε ποίημα με μέτρο και ομοιοκαταληξία", "Ποίημα που γράφτηκε για διαγωνισμό", "Ποίημα με ιστορικό θέμα"], correct: 0,
      hint: R`Η ποίηση μιλά για την ποίηση.`, sol: R`Ποίημα <b>για την ίδια την ποίηση</b> και τον ποιητή.` },
    { level: 1, q: R`Ποια χρονιά έγινε η τουρκική εισβολή στην Κύπρο, που σφράγισε την κυπριακή λογοτεχνία του 2ου μισού του 20ού αιώνα;`, fields: [{ label: "Έτος:", ans: 1974 }],
      hint: R`Δεκαετία του 1970.`, sol: R`Το <b>1974</b>.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποιο ΔΕΝ είναι γνώρισμα της Α΄ μεταπολεμικής ποίησης;`, options: ["Πομπώδης, ρητορική γλώσσα με αισιόδοξο τόνο", "Διάψευση των συλλογικών οραμάτων", "Λιτή, αντιρητορική γλώσσα", "Εμπειρία του πολέμου και του Εμφυλίου"], correct: 0,
      hint: R`Η γενιά αυτή είναι αντιρητορική.`, sol: R`Η μεταπολεμική ποίηση είναι <b>λιτή και αντιρητορική</b>, συχνά πικρή ή ειρωνική.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποιο ποίημα της ύλης παρουσιάζει την ποίηση ως «φάρμακο» που απαλύνει τον πόνο μόνο για λίγο;`, options: ["Καβάφης, «Μελαγχολία του Ιάσωνος Κλεάνδρου…»", "Αναγνωστάκης, «Επίλογος»", "Μόντης, «Όλοι εμείς που γράφουμε στίχους»", "Σαχτούρης, «Ο ελεγκτής»"], correct: 0,
      hint: R`Ο ομιλητής θρηνεί το γήρας.`, sol: R`Η <b>«Μελαγχολία…»</b> του Καβάφη.` },
    { level: 2, shuffle: true, type: "mc", q: R`Τι εννοεί το Πλαίσιο με τη «διαλεκτική σχέση» της κυπριακής λογοτεχνίας με τη νεοελληνική και ευρωπαϊκή;`, options: ["Η κυπριακή λογοτεχνία αφομοιώνει ρεύματα όπως ο μοντερνισμός και μετατρέπει τα κυπριακά βιώματα σε οικουμενικά θέματα", "Η κυπριακή λογοτεχνία αγνοεί τα ευρωπαϊκά ρεύματα", "Η κυπριακή λογοτεχνία γράφεται μόνο στην κυπριακή διάλεκτο", "Η κυπριακή λογοτεχνία αντιγράφει την ελλαδική χωρίς δικά της θέματα"], correct: 0,
      hint: R`Αλληλεπίδραση και στις δύο κατευθύνσεις.`, sol: R`Αμοιβαίος διάλογος: <b>μοντέρνα μέσα</b> + <b>κυπριακή εμπειρία</b> → οικουμενικά θέματα (προσφυγιά, ελευθερία, μνήμη).` },
    { level: 2, q: R`Ποια χρονιά τιμήθηκε ο Αλμπέρ Καμύ με το Βραβείο Νόμπελ Λογοτεχνίας;`, fields: [{ label: "Έτος:", ans: 1957 }],
      hint: R`Στη δεκαετία του 1950.`, sol: R`Το <b>1957</b>.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποια πρόταση συγκρίνει σωστά δύο ποιήματα ποιητικής της ύλης;`, options: ["Ο Αναγνωστάκης περιορίζει την κοινωνική δύναμη της ποίησης, ενώ ο Μόντης τονίζει τη διαχρονική, οικουμενική αποστολή των ποιητών", "Και οι δύο υποστηρίζουν ότι η ποίηση ανατρέπει καθεστώτα", "Ο Αναγνωστάκης γράφει σε δεκαπεντασύλλαβο, ο Μόντης σε σονέτο", "Κανένας από τους δύο δεν μιλά για την ποίηση"], correct: 0,
      hint: R`Ποιος μιλά για «όρια» και ποιος για «όλους εμάς»;`, sol: R`Ο «Επίλογος» μιλά για τα <b>όρια</b> της ποίησης (δεν κινητοποιεί μάζες) και την προσωπική ευθύνη· ο Μόντης για τη <b>συλλογική, οικουμενική</b> αποστολή των ποιητών.` },
    { level: 3, shuffle: true, type: "mc", q: R`Γιατί ο Σαχτούρης συνδέεται και με την Α΄ μεταπολεμική γενιά και με τον υπερρεαλισμό;`, options: ["Εκφράζει τη μεταπολεμική αγωνία και καταστροφή μέσα από παράδοξες, εφιαλτικές εικόνες", "Γράφει έμμετρα, ομοιοκατάληκτα σονέτα", "Αφηγείται ρεαλιστικά τη ζωή στο χωριό", "Χρησιμοποιεί ιστορικά προσωπεία, όπως ο Καβάφης"], correct: 0,
      hint: R`Περιεχόμενο (εποχή) + μορφή (εικόνες).`, sol: R`Το <b>περιεχόμενο</b> (καταστροφή, ευθύνη) είναι μεταπολεμικό· τα <b>μέσα</b> (παράδοξες εικόνες, π.χ. ματωμένος ουρανός) υπερρεαλιστικά.` }
  ]
},
/* ───────────────────────────── 3.1 ───────────────────────────── */
{
  id: "3.1", unit: 3, title: "Καβάφης, «Καισαρίων» και «Μελαγχολία του Ιάσωνος Κλεάνδρου»: ανάλυση και ερωτήσεις",
  book: "ΝΕ. ΛΟΓ. Γ΄, σσ. 59–61 και 66–67 · Πλαίσιο Μάθησης, Α΄ τετράμηνο, Κείμενα 1–2",
  intro: "Πώς μετατρέπει ο Καβάφης την ιστορία σε ποίηση στον «Καισαρίωνα» και γιατί η Ποίηση γίνεται «φάρμακο» στη «Μελαγχολία του Ιάσωνος Κλεάνδρου»;",
  thumb: LETTER("Καβάφης"),
  theory: R`
<p>Τα δύο ποιήματα του <b>Κ. Π. Καβάφη</b> (1863–1933) διδάσκονται μαζί, επειδή δείχνουν δύο διαφορετικούς τρόπους με τους οποίους η ποίηση <b>συνομιλεί με την ιστορία</b>: στον «Καισαρίωνα» (1918) ένας ποιητής-ερευνητής <b>αναπλάθει</b> με τη φαντασία του ένα σχεδόν λησμονημένο ιστορικό πρόσωπο· στη «Μελαγχολία του Ιάσωνος Κλεάνδρου, ποιητού εν Κομμαγηνή· 595 μ.Χ.» (1921) ένα <b>φανταστικό ιστορικό προσωπείο</b> εκφράζει ένα βαθιά προσωπικό πρόβλημα, τη φθορά του γήρατος. Και τα δύο είναι <b>ποιήματα ποιητικής</b>: μιλούν για τη δύναμη της ποίησης απέναντι στον χρόνο.</p>
<div class="tbox def"><h4>«Καισαρίων»: το ιστορικό πλαίσιο</h4>
<p>Ο <b>Καισαρίων</b> (Πτολεμαίος ΙΕ΄) ήταν γιος της Κλεοπάτρας και του Ιουλίου Καίσαρα. Μετά την ήττα του Αντωνίου και της Κλεοπάτρας, ο Οκταβιανός τον θανάτωσε το 30 π.Χ., σε ηλικία περίπου 17 ετών· οι αυλικοί του Οκταβιανού τον είχαν συμβουλεύσει ότι η «Πολυκαισαρίη» — η ύπαρξη πολλών «Καισάρων» — δεν είναι καλή. Οι ιστορικές πηγές λένε ελάχιστα για τον νέο.</p></div>
<div class="tbox"><h4>Η πορεία του ποιήματος (με δικά μας λόγια)</h4>
<ol><li>Ο ποιητής-ομιλητής διαβάζει ένα βράδυ μια συλλογή πτολεμαϊκών επιγραφών, εν μέρει για να ερευνήσει μια εποχή, εν μέρει για να περάσει η ώρα. Οι κολακευτικοί έπαινοι για τους Πτολεμαίους είναι όλοι ίδιοι.</li>
<li>Συναντά μια ελάχιστη αναφορά στον Καισαρίωνα και σταματά: τον ελκύει η «αόριστη γοητεία» του — ακριβώς επειδή η ιστορία λέει τόσο λίγα.</li>
<li>Η φαντασία συμπληρώνει τα κενά: τον πλάθει ωραίο και ευαίσθητο, με «ονειρώδη συμπαθητική εμορφιά».</li>
<li>Κορύφωση: αργά τη νύχτα, ο Καισαρίων «μπαίνει» στο δωμάτιο του ποιητή, χλωμός και κουρασμένος, όπως θα στεκόταν στην κατακτημένη Αλεξάνδρεια, ελπίζοντας ακόμη σε έλεος από εκείνους που ψιθύριζαν την «Πολυκαισαρίη».</li></ol>
<p class="muted small">Τα δύο ποιήματα είναι κοινό κτήμα (δημοσιεύτηκαν το 1918 και το 1921)· διάβασέ τα ολόκληρα στο ανθολόγιο.</p></div>
<div class="tbox thm"><h4>Ιστορία και λογοτεχνία</h4>
<p>Η <b>ιστορία</b> δίνει τα γεγονότα — εδώ ελάχιστα. Η <b>λογοτεχνία</b> συμπληρώνει τα κενά με <b>φαντασία, συγκίνηση και καλλιτεχνική ερμηνεία</b>. Ο Καβάφης δεν αναπαριστά απλώς το παρελθόν: φωτίζει διαχρονικά ζητήματα — την αδικία της εξουσίας, την ευαισθησία των αδύναμων, τη φθορά, τη μνήμη, τη δύναμη της τέχνης να «ξαναζωντανεύει» τους λησμονημένους. Το <b>ποιητικό υποκείμενο</b> εδώ είναι ένας ποιητής-ερευνητής, που αναπλάθει δημιουργικά το ιστορικό πρόσωπο· ο Καισαρίων γίνεται ιδεατός, εξιδανικευμένος.</p></div>
<div class="tbox def"><h4>«Μελαγχολία του Ιάσωνος Κλεάνδρου…»</h4>
${PASSAGE(`Το γήρασμα του σώματος και της μορφής μου
είναι πληγή από φρικτό μαχαίρι.
Δεν έχω εγκαρτέρησι καμιά.
Εις σε προστρέχω Τέχνη της Ποιήσεως,
που κάπως ξέρεις από φάρμακα·
νάρκης του άλγους δοκιμές, εν Φαντασία και Λόγω.

Είναι πληγή από φρικτό μαχαίρι.—
Τα φάρμακά σου φέρε Τέχνη της Ποιήσεως,
που κάμνουνε —για λίγο— να μη νοιώθεται η πληγή.`, { title: "Μελαγχολία του Ιάσωνος Κλεάνδρου· ποιητού εν Κομμαγηνή· 595 μ.Χ.", source: "Κ. Π. Καβάφης (1921) — κοινό κτήμα, μονοτονικό", num: "line" })}
<p>Ο <b>Ιάσων Κλεάνδρου</b> είναι <b>φανταστικό πρόσωπο</b>, ποιητής στην Κομμαγηνή (περιοχή της Μικράς Ασίας) το 595 μ.Χ. — σε μια εποχή παρακμής του ελληνισμού της Ανατολής (πρώιμη βυζαντινή εποχή). Το <b>προσωπείο</b> επιτρέπει στον Καβάφη να μιλήσει για ένα δικό του, διαχρονικό βίωμα: το γήρας και την απώλεια της ομορφιάς.</p>
<ul><li><b>Δομή</b>: α΄ μέρος (στ. 1–6): ο πόνος και η καταφυγή στην Ποίηση· β΄ μέρος (στ. 7–9): επανάληψη του πόνου και επίμονη ικεσία.</li>
<li><b>Εκφραστικά μέσα</b>: <b>μεταφορά</b> (το γήρας = «πληγή από φρικτό μαχαίρι»· η ποίηση δίνει «φάρμακα»), <b>προσωποποίηση</b> και <b>αποστροφή</b> («Τέχνη της Ποιήσεως»), <b>επανάληψη</b> του στ. 2 στον στ. 7, <b>προστακτική</b> («φέρε»), λόγια στοιχεία («Εις σε προστρέχω», «εν Φαντασία και Λόγω») που ταιριάζουν σε ποιητή του 6ου αιώνα.</li>
<li><b>Το κλειδί</b>: τα «κάπως» και «για λίγο»: η τέχνη <b>δεν θεραπεύει</b>, απαλύνει προσωρινά — ρεαλισμός και καβαφική ειρωνεία.</li>
<li><b>Πρόσωπο και χρόνος</b>: α΄ ενικό (εξομολόγηση) και <b>δραματικός ενεστώτας</b> («δεν έχω»), που δίνει αμεσότητα και θεατρικότητα.</li></ul></div>
<div class="tbox thm"><h4>Σύγκριση των δύο ποιημάτων</h4>
<table class="tbl"><tr><th></th><th>«Καισαρίων»</th><th>«Μελαγχολία…»</th></tr>
<tr><td>Πρόσωπο</td><td>Ιστορικό (πραγματικό)</td><td>Φανταστικό (προσωπείο)</td></tr>
<tr><td>Ποιητικό υποκείμενο</td><td>Ποιητής-ερευνητής που αναπλάθει την ιστορία</td><td>Ποιητής που βιώνει τη φθορά</td></tr>
<tr><td>Λειτουργία της ποίησης</td><td>Δίνει ζωή σε έναν λησμονημένο</td><td>Προσωπικό καταφύγιο, «φάρμακο» για λίγο</td></tr>
<tr><td>Συναίσθημα</td><td>Συμπόνια, γοητεία, μελαγχολία</td><td>Απελπισία, υπαρξιακή αγωνία, ικεσία</td></tr></table></div>
<div class="tbox ex"><h4>Τύπος ερώτησης</h4>
<p>«Να συγκρίνετε τη λειτουργία της ποίησης στα δύο ποιήματα.»</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p>Και στα δύο ποιήματα η ποίηση αντιστέκεται στον χρόνο. Στον «Καισαρίωνα» η ποίηση <b>αναπλάθει δημιουργικά την ιστορία</b>: ο ποιητής, ξεκινώντας από μια ελάχιστη αναφορά, φαντάζεται τον νέο τόσο έντονα, ώστε εκείνος «μπαίνει» στο δωμάτιό του — η τέχνη δίνει ζωή σε ένα σχεδόν λησμονημένο πρόσωπο. Στη «Μελαγχολία…» η ποίηση είναι <b>προσωπικό καταφύγιο</b>: ο Ιάσων «προστρέχει» στην προσωποποιημένη Τέχνη της Ποιήσεως, που δίνει «φάρμακα» — μεταφορά για τη Φαντασία και τον Λόγο. Η δύναμή της όμως είναι περιορισμένη («κάπως», «για λίγο»). Έτσι, στο πρώτο ποίημα η τέχνη <b>νικά τη λήθη</b>, ενώ στο δεύτερο απλώς <b>απαλύνει τον πόνο</b> της φθοράς.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>«Ο Ιάσων Κλεάνδρου είναι ιστορικό πρόσωπο» — όχι, είναι επινόηση του Καβάφη.</li>
<li>Ταύτιση του ποιητικού υποκειμένου με τον ίδιο τον Καβάφη χωρίς τη λέξη «προσωπείο».</li>
<li>Παράλειψη του περιορισμού «για λίγο» όταν ζητείται ο ρόλος της ποίησης.</li></ul></div>
`,
  widget: "nc1annot",
  gen: "nc1gTech",
  exercises: [
    { level: 1, shuffle: true, type: "mc", q: R`Ποιος ήταν ιστορικά ο Καισαρίων;`, options: ["Ο γιος της Κλεοπάτρας και του Ιουλίου Καίσαρα, που θανατώθηκε με εντολή του Οκταβιανού", "Ένας φανταστικός ποιητής του 6ου αιώνα μ.Χ.", "Ένας Ρωμαίος στρατηγός που νίκησε τον Αντώνιο", "Ο τελευταίος βυζαντινός αυτοκράτορας"], correct: 0,
      hint: R`Το όνομά του δείχνει τον πατέρα του.`, sol: R`Γιος της <b>Κλεοπάτρας</b> και του <b>Ιουλίου Καίσαρα</b>· θανατώθηκε το 30 π.Χ. με εντολή του Οκταβιανού.` },
    { level: 1, type: "mc", q: R`Ο Ιάσων Κλεάνδρου είναι πραγματικό ιστορικό πρόσωπο.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι είναι το καβαφικό «προσωπείο»;`, sol: R`<b>ΛΑΘΟΣ.</b> Είναι <b>φανταστικό</b> πρόσωπο, προσωπείο μέσα από το οποίο ο Καβάφης εκφράζει ένα δικό του βίωμα.` },
    { level: 1, q: R`Στη «Μελαγχολία…», σε ποιον στίχο επαναλαμβάνεται αυτούσιος ο 2ος στίχος («είναι πληγή από φρικτό μαχαίρι»);`, fields: [{ label: "Στίχος:", ans: 7 }],
      hint: R`Είναι ο στίχος που ανοίγει το β΄ μέρος.`, sol: R`Στον <b>7ο</b> στίχο: η επανάληψη τονίζει ότι ο πόνος επιστρέφει.` },
    { level: 1, q: R`Ποια χρονολογία αναφέρεται στον τίτλο της «Μελαγχολίας του Ιάσωνος Κλεάνδρου»;`, fields: [{ label: "Έτος (μ.Χ.):", ans: 595 }],
      hint: R`Ο τίτλος γράφει «… εν Κομμαγηνή· … μ.Χ.».`, sol: R`<b>595 μ.Χ.</b> — εποχή παρακμής του ελληνισμού της Ανατολής (πρώιμη βυζαντινή εποχή).` },
    { level: 2, shuffle: true, type: "mc", q: R`Τι είδους εκφραστικό μέσο είναι η φράση «Εις σε προστρέχω Τέχνη της Ποιήσεως» και ποια η λειτουργία του;`, options: ["Αποστροφή και προσωποποίηση: η Ποίηση γίνεται πρόσωπο στο οποίο ο ομιλητής καταφεύγει ικετευτικά", "Παρομοίωση: η Ποίηση μοιάζει με γιατρό", "Αντίθεση: η Ποίηση αντιπαρατίθεται στο γήρας", "Ασύνδετο σχήμα: γρήγορος ρυθμός"], correct: 0,
      hint: R`Σε ποιον απευθύνεται ο ομιλητής;`, sol: R`<b>Αποστροφή</b> προς την <b>προσωποποιημένη</b> Τέχνη της Ποιήσεως: η ικεσία θυμίζει προσευχή σε θεότητα.` },
    { level: 2, shuffle: true, type: "mc", q: R`Τι δηλώνουν οι λέξεις «κάπως» και «για λίγο» στη «Μελαγχολία…»;`, options: ["Ότι η δύναμη της ποίησης είναι περιορισμένη: απαλύνει προσωρινά, δεν θεραπεύει", "Ότι ο ομιλητής περιφρονεί την ποίηση", "Ότι η ποίηση θεραπεύει οριστικά το γήρας", "Ότι ο ομιλητής βιάζεται"], correct: 0,
      hint: R`Πόσο «ξέρει» η Ποίηση από φάρμακα;`, sol: R`Περιορίζουν <b>ειρωνικά και ρεαλιστικά</b> τη δύναμη της τέχνης: προσωρινή ανακούφιση.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποιο είναι το ποιητικό υποκείμενο στον «Καισαρίωνα»;`, options: ["Ένας ποιητής-ερευνητής που διαβάζει ιστορικές πηγές και αναπλάθει με τη φαντασία του τον Καισαρίωνα", "Ο ίδιος ο Καισαρίων, που μιλά σε α΄ πρόσωπο", "Η Κλεοπάτρα", "Ο Οκταβιανός"], correct: 0,
      hint: R`Ποιος διαβάζει τις επιγραφές τη νύχτα;`, sol: R`Ένας <b>ποιητής-ερευνητής</b>: η ιστορία γίνεται αφορμή για ποιητική αναδημιουργία.` },
    { level: 2, q: R`Ποια λέξη σημαίνει στο ποίημα «υπομονή, καρτερία» («Δεν έχω … καμιά»); (μία λέξη)`, fields: [{ label: "Λέξη:", ans: ["εγκαρτέρησι", "εγκαρτέρηση", "εγκαρτερησι", "εγκαρτερηση"], text: true }],
      hint: R`Αναζήτησε στο ποίημα λέξη συγγενή με το «καρτερώ».`, sol: R`<b>«εγκαρτέρησι»</b> = καρτερία, υπομονή. Ο ομιλητής δεν μπορεί να υπομείνει τη φθορά.` },
    { level: 3, shuffle: true, type: "mc", q: R`Πώς λειτουργεί ο δραματικός ενεστώτας («Δεν έχω εγκαρτέρησι») στη «Μελαγχολία…»;`, options: ["Δίνει αμεσότητα και θεατρικότητα: ο ποιητής Ιάσων μοιάζει να μιλά τώρα, μπροστά μας", "Δείχνει ότι τα γεγονότα θα συμβούν στο μέλλον", "Δημιουργεί αντικειμενική απόσταση από τα συναισθήματα", "Δηλώνει ότι η ποίηση θεραπεύει για πάντα"], correct: 0,
      hint: R`Πότε «συμβαίνει» ο πόνος για τον αναγνώστη;`, sol: R`Ο ενεστώτας φέρνει τον λόγο του Ιάσονα στο <b>παρόν</b> — αμεσότητα, θεατρικότητα (όπως σημειώνει και ο οδηγός διόρθωσης του δειγματικού δοκιμίου).` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποια πρόταση διατυπώνει σωστά τη διαφορά των δύο ποιημάτων ως προς τη σχέση ιστορίας–ποίησης;`, options: ["Στον «Καισαρίωνα» η ιστορία είναι αφορμή για ποιητική αναδημιουργία, ενώ στη «Μελαγχολία» το ιστορικό προσωπείο εκφράζει έναν βαθιά προσωπικό προβληματισμό", "Και τα δύο είναι πιστές ιστορικές αφηγήσεις", "Στον «Καισαρίωνα» μιλά φανταστικό πρόσωπο, στη «Μελαγχολία» ιστορικό", "Κανένα από τα δύο δεν αφορά την ιστορία"], correct: 0,
      hint: R`Ποιος είναι πραγματικός και ποιος επινοημένος;`, sol: R`Αυτή είναι η διατύπωση του Πλαισίου Μάθησης: <b>αναδημιουργία της ιστορίας</b> ↔ <b>προσωπείο για προσωπικό πρόβλημα</b>.` }
  ]
},
/* ───────────────────────────── 3.2 ───────────────────────────── */
{
  id: "3.2", unit: 3, title: "Γιώργος Σεφέρης, «Ερωτικός λόγος»: ανάλυση, σύμβολα και ερωτήσεις",
  book: "ΑΝΠ Γ΄, σ. 73 · Πλαίσιο Μάθησης, Α΄ τετράμηνο, Κείμενο 3",
  intro: "Τι συμβολίζουν το ρόδο, η θάλασσα και ο άνεμος στον «Ερωτικό λόγο» του Σεφέρη και πώς αποδίδεται ο έρωτας, η μνήμη και ο αποχωρισμός;",
  thumb: LETTER("Ρόδο"),
  theory: R`
<p>Ο <b>«Ερωτικός λόγος»</b> ανήκει στην πρώτη ποιητική συλλογή του <b>Γιώργου Σεφέρη</b> (1900–1971), τη <b>«Στροφή» (1931)</b>. Είναι ένα από τα πιο λυρικά και μουσικά ποιήματά του — έχει μελοποιηθεί περισσότερες από μία φορές. Το ποίημα ανήκει στη <b>μεταβατική</b> φάση του Σεφέρη: κρατά ακόμη στοιχεία της παραδοσιακής στιχουργίας (μέτρο, ομοιοκαταληξία, έντονη μουσικότητα), ενώ οι εικόνες και τα σύμβολά του έχουν ήδη τη νεωτερική πυκνότητα που θα ωριμάσει στο «Μυθιστόρημα» (1935). <span class="muted">Το ποίημα δεν αναδημοσιεύεται εδώ· διάβασέ το στην Ανθολογία Νεοελληνικής Ποίησης Γ΄.</span></p>
<div class="tbox def"><h4>Ποιητικό υποκείμενο και θέμα</h4>
<p>Το ποιητικό υποκείμενο είναι η φωνή ενός ερωτευμένου ανθρώπου που μιλά για τον <b>έρωτα</b>, τη <b>μνήμη</b>, τον <b>αποχωρισμό</b> και την <b>προσδοκία</b>. Δεν ταυτίζεται με τον Σεφέρη: τα προσωπικά συναισθήματα αποκτούν <b>καθολική ανθρώπινη διάσταση</b>. Κεντρικό θέμα είναι η σχέση δύο προσώπων, όπως τη διαμορφώνουν η αγάπη, η επικοινωνία, η απουσία και ο χρόνος.</p></div>
<div class="tbox thm"><h4>Τα βασικά σύμβολα</h4>
<table class="tbl"><tr><th>Σύμβολο</th><th>Ερμηνεία</th></tr>
<tr><td>Το ρόδο</td><td>Ο έρωτας στην ομορφιά και στον πόνο του· συνδέεται με τη μοίρα και τον άνεμο — με ό,τι δεν ελέγχει ο άνθρωπος.</td></tr>
<tr><td>Η θάλασσα</td><td>Η απόσταση, το ταξίδι, ο αποχωρισμός· η μνήμη που επιστρέφει σαν κύμα.</td></tr>
<tr><td>Ο άνεμος</td><td>Η ρευστότητα, η αλλαγή, ο χρόνος που παρασέρνει.</td></tr>
<tr><td>Η αυγή, το φως</td><td>Η ελπίδα και η προσδοκία.</td></tr>
<tr><td>Η νύχτα</td><td>Η απουσία, η μοναξιά, η απώλεια.</td></tr></table>
<p>Το ποιητικό λεξιλόγιο δημιουργεί <b>λυρική ατμόσφαιρα</b> και αποδίδει συναισθήματα <b>αγάπης, νοσταλγίας, προσδοκίας και απώλειας</b>.</p></div>
<div class="tbox def"><h4>Εκφραστικά μέσα και μορφή</h4>
<ul><li><b>Μεταφορές και σύμβολα</b> που συνδέουν τον έρωτα με τη μοίρα και τη φύση.</li>
<li><b>Παρομοιώσεις</b> — π.χ. η ψυχή συνδέεται με τη μουσική του αυλού και με τη γραφή: η τέχνη ως έκφραση του έρωτα.</li>
<li><b>Επαναλήψεις</b> και <b>προσωποποιήσεις</b> στοιχείων της φύσης.</li>
<li><b>Μουσικότητα</b> (ρυθμός, ομοιοκαταληξία) και <b>λυρικός τόνος</b>.</li></ul>
<p>Λειτουργία: προσδίδουν μουσικότητα, ενισχύουν τη λυρικότητα και αποδίδουν με ένταση τον εσωτερικό κόσμο του ποιητικού υποκειμένου. Η <b>μορφή υπηρετεί το περιεχόμενο</b>: ο λυρικός, μουσικός λόγος ταιριάζει με την έκφραση του έρωτα, της μνήμης και του χρόνου.</p></div>
<div class="tbox rem"><h4>Διακειμενικότητα: ο «Ερωτόκριτος»</h4>
<p>Το Πλαίσιο προτείνει συνεξέταση με τον <b>«Ερωτόκριτο»</b> του <b>Βιτσέντζου Κορνάρου</b> (κρητική λογοτεχνία, 17ος αι., σε δεκαπεντασύλλαβο). Κοινά: ο έρωτας ως μοίρα, ο αποχωρισμός και η δοκιμασία των εραστών, η μουσικότητα του λόγου. Ο Σεφέρης θαύμαζε τον «Ερωτόκριτο» και του αφιέρωσε μελέτη.</p></div>
<div class="tbox ex"><h4>Τύπος ερώτησης</h4>
<p>«Να ερμηνεύσετε τη συμβολική λειτουργία του ρόδου στο ποίημα.»</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p>Το ρόδο λειτουργεί ως <b>σύμβολο του έρωτα</b>, με τη διπλή του όψη: την ομορφιά (το άνθος) και τον πόνο (τα αγκάθια, η πληγή). Στο ποίημα το ρόδο συνδέεται με τη <b>μοίρα</b> και με τον <b>άνεμο</b>· έτσι ο έρωτας παρουσιάζεται ως δύναμη που ξεπερνά τη θέληση του ανθρώπου, που πληγώνει και παρασύρεται από τον χρόνο. Το σύμβολο ενισχύει τη λυρική ατμόσφαιρα και αποδίδει τα συναισθήματα του ποιητικού υποκειμένου: αγάπη, προσδοκία, αλλά και την πικρή γνώση της απώλειας. <i>(Στην εξέταση τεκμηρίωσε με τους συγκεκριμένους στίχους του κειμένου που θα σου δοθεί.)</i></p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Κατάταξη του «Ερωτικού λόγου» στο «Μυθιστόρημα» — ανήκει στη «Στροφή» (1931).</li>
<li>«Ο Σεφέρης μιλά για τη δική του κοπέλα» — μιλά το ποιητικό υποκείμενο, και το βίωμα γίνεται καθολικό.</li>
<li>Ερμηνεία συμβόλων μονοσήμαντα (ρόδο = μόνο αγάπη): τα σύμβολα είναι πολυσήμαντα.</li></ul></div>
`,
  widget: "nc1eros",
  gen: "nc1gTech",
  exercises: [
    { level: 1, shuffle: true, type: "mc", q: R`Σε ποια συλλογή του Σεφέρη ανήκει ο «Ερωτικός λόγος»;`, options: ["«Στροφή» (1931)", "«Μυθιστόρημα» (1935)", "«Ημερολόγιο Καταστρώματος»", "«Ήλιος ο πρώτος»"], correct: 0,
      hint: R`Είναι η πρώτη του συλλογή.`, sol: R`Στη <b>«Στροφή» (1931)</b>, την πρώτη συλλογή του Σεφέρη.` },
    { level: 1, q: R`Ποια χρονιά κυκλοφόρησε η «Στροφή»;`, fields: [{ label: "Έτος:", ans: 1931 }],
      hint: R`Αρχές της δεκαετίας του 1930.`, sol: R`Το <b>1931</b>.` },
    { level: 1, shuffle: true, type: "mc", q: R`Ποια συναισθήματα αποδίδει κυρίως το ποιητικό λεξιλόγιο του «Ερωτικού λόγου»;`, options: ["Αγάπη, νοσταλγία, προσδοκία, απώλεια", "Θυμό, ειρωνεία, σάτιρα", "Πατριωτικό ενθουσιασμό", "Φόβο για τον πόλεμο"], correct: 0,
      hint: R`Ο τίτλος είναι «ερωτικός».`, sol: R`<b>Αγάπη, νοσταλγία, προσδοκία, απώλεια</b> — όπως ορίζουν οι δείκτες επάρκειας.` },
    { level: 2, shuffle: true, type: "mc", q: R`Σε σύγκριση με το «Μυθιστόρημα Δ΄», ποιο μορφικό γνώρισμα ξεχωρίζει στον «Ερωτικό λόγο»;`, options: ["Κρατά στοιχεία παραδοσιακής στιχουργίας (μέτρο, ομοιοκαταληξία) και έντονη μουσικότητα", "Είναι γραμμένος σε πεζό λόγο", "Είναι αυτόματη γραφή χωρίς σημεία στίξης", "Είναι θεατρικός διάλογος"], correct: 0,
      hint: R`Η «Στροφή» είναι μεταβατική συλλογή.`, sol: R`Ο «Ερωτικός λόγος» κρατά <b>μέτρο, ομοιοκαταληξία, μουσικότητα</b>· το «Μυθιστόρημα» είναι σε ελεύθερο στίχο.` },
    { level: 2, shuffle: true, type: "mc", q: R`Τι συμβολίζει κυρίως η θάλασσα στον «Ερωτικό λόγο»;`, options: ["Την απόσταση, το ταξίδι και τον αποχωρισμό· τη μνήμη που επιστρέφει", "Την οικονομική ευημερία", "Τον πόλεμο και τη στρατιωτική δύναμη", "Τη θρησκευτική πίστη"], correct: 0,
      hint: R`Σκέψου τη σχέση δύο προσώπων που χωρίζονται.`, sol: R`Η θάλασσα: <b>απόσταση, αποχωρισμός, μνήμη</b>.` },
    { level: 2, q: R`Ποιος είναι ο δημιουργός του «Ερωτόκριτου», με τον οποίο το Πλαίσιο προτείνει να συνεξεταστεί ο «Ερωτικός λόγος»; (επώνυμο)`, fields: [{ label: "Επώνυμο:", ans: ["Κορνάρος", "Βιτσέντζος Κορνάρος", "Β. Κορνάρος", "Κορναρος"], text: true, nopunct: true }],
      hint: R`Σκέψου το κορυφαίο έργο της κρητικής λογοτεχνίας του 17ου αιώνα.`, sol: R`Ο <b>Βιτσέντζος Κορνάρος</b> (κρητική λογοτεχνία, 17ος αι.).` },
    { level: 2, type: "mc", q: R`Το ποιητικό υποκείμενο του «Ερωτικού λόγου» ταυτίζεται με τον ίδιο τον Σεφέρη και εκφράζει αποκλειστικά τη δική του ερωτική ιστορία.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι λένε οι δείκτες για την «καθολική ανθρώπινη διάσταση»;`, sol: R`<b>ΛΑΘΟΣ.</b> Το ποιητικό υποκείμενο διακρίνεται από τον ποιητή· τα βιώματα αποκτούν <b>καθολική</b> διάσταση.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποια είναι η λειτουργία των επαναλήψεων και της μουσικότητας στον «Ερωτικό λόγο»;`, options: ["Ενισχύουν τη λυρικότητα και αποδίδουν με ένταση τον εσωτερικό κόσμο του ποιητικού υποκειμένου", "Επιταχύνουν την πλοκή μιας ιστορίας", "Δημιουργούν κωμικό αποτέλεσμα", "Δίνουν ιστορικές πληροφορίες"], correct: 0,
      hint: R`Τι «κάνει» η μουσική σε ένα ερωτικό ποίημα;`, sol: R`Μουσικότητα και επαναλήψεις <b>εντείνουν το λυρικό, συναισθηματικό</b> στοιχείο — η μορφή υπηρετεί το περιεχόμενο.` },
    { level: 3, shuffle: true, type: "mc", q: R`Το ρόδο συνδέεται στο ποίημα με τη μοίρα και τον άνεμο. Τι υπογραμμίζει αυτή η σύνδεση για τον έρωτα;`, options: ["Ότι ο έρωτας είναι δύναμη που ξεπερνά τη θέληση του ανθρώπου και φθείρεται από τον χρόνο", "Ότι ο έρωτας είναι παιχνίδι χωρίς σημασία", "Ότι ο έρωτας εξαρτάται μόνο από την απόφαση των εραστών", "Ότι ο έρωτας είναι αδύνατος για τους νέους"], correct: 0,
      hint: R`Μπορεί ο άνθρωπος να ελέγξει τη μοίρα ή τον άνεμο;`, sol: R`Μοίρα και άνεμος = <b>ό,τι δεν ελέγχει ο άνθρωπος</b>: ο έρωτας μοιάζει πεπρωμένο, ρευστός και εκτεθειμένος στον χρόνο.` }
  ]
},
/* ───────────────────────────── 3.3 ───────────────────────────── */
{
  id: "3.3", unit: 3, title: "Γιώργος Σεφέρης, «Μυθιστόρημα Δ΄ — Αργοναύτες»: μύθος, μοντερνισμός, Γενιά του ’30",
  book: "ΑΝΠ Γ΄, σσ. 75–76 · Πλαίσιο Μάθησης, Α΄ τετράμηνο, Κείμενο 4",
  intro: "Πώς χρησιμοποιεί ο Σεφέρης τον μύθο των Αργοναυτών στο «Μυθιστόρημα Δ΄» για να μιλήσει για τη σύγχρονη ελληνική εμπειρία;",
  thumb: LETTER("Αργώ"),
  theory: R`
<p>Το <b>«Μυθιστόρημα»</b> (1935) του <b>Γιώργου Σεφέρη</b> είναι μια σύνθεση <b>24 ποιημάτων</b> σε <b>ελεύθερο στίχο</b>, που σηματοδοτεί την ωριμότητα του νεοελληνικού μοντερνισμού. Ο τίτλος έχει διπλή σημασία: «μύθος» + «ιστορία» — ο ποιητής αφηγείται τη σύγχρονη ιστορία με όρους μύθου. Το <b>Δ΄ ποίημα</b>, οι <b>«Αργοναύτες»</b>, αξιοποιεί την Αργοναυτική εκστρατεία για να μιλήσει για την περιπλάνηση, τη συλλογική μοίρα, την απώλεια και την ανθρώπινη αναζήτηση. <span class="muted">Το ποίημα δεν αναδημοσιεύεται εδώ· διάβασέ το στην Ανθολογία (ΑΝΠ Γ΄).</span></p>
<div class="tbox def"><h4>Το μότο από τον Πλάτωνα</h4>
<p>Το ποίημα ανοίγει με απόσπασμα από τον πλατωνικό διάλογο «Αλκιβιάδης»: «Καὶ ψυχὴ εἰ μέλλει γνώσεσθαι αὑτήν, εἰς ψυχὴν αὐτῇ βλεπτέον» — δηλαδή: και η ψυχή, αν θέλει να γνωρίσει τον εαυτό της, πρέπει να κοιτάξει μέσα σε (άλλη) ψυχή. Το θέμα της <b>αυτογνωσίας</b> μέσα από τη σχέση με τον άλλο — με τον σύντροφο — διατρέχει το ποίημα.</p></div>
<div class="tbox"><h4>Η πορεία του ποιήματος (με δικά μας λόγια)</h4>
<ol><li>Μετά το μότο, ο ομιλητής στοχάζεται την αυτογνωσία μέσα από το βλέμμα του άλλου και ανακαλεί το ταξίδι.</li>
<li>Θυμάται τους <b>συντρόφους</b> στα κουπιά: άνθρωποι αγαθοί και καρτερικοί, που δεν διαμαρτύρονταν ούτε για τον κόπο ούτε για τη δίψα ή το κρύο· σιωπηλοί, σε αρμονία με τη φύση.</li>
<li>Οι σύντροφοι <b>πεθαίνουν ένας ένας</b> και θάβονται στις ακρογιαλιές· τα κουπιά τους σημαδεύουν τους τάφους.</li>
<li><b>Κανείς δεν τους θυμάται</b>· το ποίημα κλείνει με ένα λιτό, πικρό αίτημα δικαιοσύνης για τους ανώνυμους.</li></ol></div>
<div class="tbox thm"><h4>Μυθική μέθοδος: δύο επίπεδα</h4>
<table class="tbl"><tr><th>Μυθικό επίπεδο</th><th>Σύγχρονο / διαχρονικό επίπεδο</th></tr>
<tr><td>Οι Αργοναύτες ταξιδεύουν για το χρυσόμαλλο δέρας</td><td>Η περιπλάνηση και η αναζήτηση του νεότερου ελληνισμού (μετά τη Μικρασιατική Καταστροφή, την προσφυγιά)</td></tr>
<tr><td>Οι σύντροφοι πεθαίνουν στο ταξίδι</td><td>Οι ανώνυμοι, καρτερικοί άνθρωποι που μόχθησαν και ξεχάστηκαν</td></tr>
<tr><td>Τα κουπιά στους τάφους</td><td>Το μόνο ίχνος του κόπου τους· η αδικία της λήθης</td></tr></table>
<p>Ο μύθος χρησιμοποιείται <b>συμβολικά</b>: δεν αναπαριστάνεται το παρελθόν, αλλά ερμηνεύεται η <b>σύγχρονη ανθρώπινη εμπειρία</b> — εδώ βρίσκεται η «ελληνικότητα» της Γενιάς του ’30: όχι απλή αναφορά στο παρελθόν, αλλά τρόπος να κατανοηθεί το παρόν.</p></div>
<div class="tbox def"><h4>Μοντερνισμός και Γενιά του ’30 στο ποίημα</h4>
<ul><li><b>Ελεύθερος στίχος</b>, λιτή γλώσσα, συνειρμική ανάπτυξη.</li>
<li><b>Διακειμενικότητα</b>: Πλάτωνας, αργοναυτικός μύθος (και ο απόηχος της «μυθικής μεθόδου» του Έλιοτ).</li>
<li><b>Αφηγηματικοί τρόποι</b> μέσα στο ποίημα: <b>αφήγηση</b> (το ταξίδι), <b>περιγραφή</b> (οι σύντροφοι), <b>σχόλιο</b> (ο στοχασμός για την αυτογνωσία και τη δικαιοσύνη).</li>
<li><b>Συλλογική φωνή</b> και <b>στοχαστικό ύφος</b>· υπαινιγμοί, συμβολικές εικόνες, επαναλήψεις.</li>
<li>Ιστορικό και πνευματικό κλίμα: πόλεμοι, απώλειες, ανθρώπινη μοίρα.</li></ul></div>
<div class="tbox ex"><h4>Τύπος ερώτησης</h4>
<p>«Να εξηγήσετε πώς αξιοποιείται ο μύθος των Αργοναυτών για να εκφραστούν σύγχρονες εμπειρίες.»</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p>Ο Σεφέρης εφαρμόζει τη <b>μυθική μέθοδο</b>: οι Αργοναύτες δεν είναι ήρωες ενός ένδοξου κατορθώματος, αλλά <b>ανώνυμοι σύντροφοι</b> που κωπηλατούν καρτερικά, χωρίς παράπονο, και πεθαίνουν ένας ένας στις ξένες ακτές. Μέσα από αυτούς ο ποιητής μιλά για τους απλούς ανθρώπους κάθε εποχής — και ειδικά του νεότερου ελληνισμού, με την περιπλάνηση και τις απώλειες μετά το 1922 — που θυσιάστηκαν και ξεχάστηκαν. Η εικόνα των κουπιών που σημαδεύουν τους τάφους και η διαπίστωση ότι κανείς δεν τους θυμάται οδηγούν σε ένα <b>αίτημα δικαιοσύνης</b>. Έτσι ο μύθος γίνεται <b>σύμβολο της συλλογικής μοίρας</b>.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Αφήγηση του αρχαίου μύθου (Ιάσονας, Μήδεια…) αντί για ερμηνεία του τι εκφράζει στο ποίημα.</li>
<li>«Το Μυθιστόρημα είναι πεζό μυθιστόρημα» — είναι ποιητική σύνθεση.</li>
<li>Παράλειψη του μότο και της αυτογνωσίας.</li></ul></div>
`,
  widget: "nc1argo",
  gen: "nc1gMove",
  exercises: [
    { level: 1, q: R`Από πόσα ποιήματα αποτελείται η σύνθεση «Μυθιστόρημα» του Σεφέρη;`, fields: [{ label: "Ποιήματα:", ans: 24 }],
      hint: R`Πρόσεξε πώς αριθμούνται τα ποιήματα της συλλογής (με γράμματα).`, sol: R`Από <b>24</b> ποιήματα (Α΄–Ω΄).` },
    { level: 1, q: R`Ποια χρονιά κυκλοφόρησε το «Μυθιστόρημα»;`, fields: [{ label: "Έτος:", ans: 1935 }],
      hint: R`Στα μέσα της δεκαετίας του 1930.`, sol: R`Το <b>1935</b>.` },
    { level: 1, shuffle: true, type: "mc", q: R`Από ποιο έργο προέρχεται το μότο του «Μυθιστορήματος Δ΄»;`, options: ["Από τον πλατωνικό διάλογο «Αλκιβιάδης»", "Από την «Οδύσσεια» του Ομήρου", "Από τον «Ερωτόκριτο»", "Από την «Έρημη χώρα» του Έλιοτ"], correct: 0,
      hint: R`Αρχαίος φιλόσοφος.`, sol: R`Από τον <b>πλατωνικό «Αλκιβιάδη»</b>: η ψυχή γνωρίζει τον εαυτό της κοιτάζοντας σε άλλη ψυχή.` },
    { level: 1, shuffle: true, type: "mc", q: R`Ποιο είναι το θέμα του πλατωνικού μότο;`, options: ["Η αυτογνωσία μέσα από τη σχέση με τον άλλο", "Η δικαιοσύνη της πόλης", "Ο έρωτας ως μοίρα", "Η αθανασία των θεών"], correct: 0,
      hint: R`«Γνῶθι σαυτόν» με τη βοήθεια ενός άλλου.`, sol: R`Η <b>αυτογνωσία</b>: για να γνωρίσει η ψυχή τον εαυτό της πρέπει να κοιτάξει σε άλλη ψυχή.` },
    { level: 2, shuffle: true, type: "mc", q: R`Πώς παρουσιάζονται οι σύντροφοι-Αργοναύτες στο ποίημα;`, options: ["Ως καρτερικοί, σιωπηλοί, ανώνυμοι εργάτες του ταξιδιού, που πεθαίνουν και ξεχνιούνται", "Ως ένδοξοι ήρωες που γυρίζουν θριαμβευτές", "Ως δειλοί που εγκαταλείπουν το ταξίδι", "Ως θεοί του Ολύμπου"], correct: 0,
      hint: R`Τι γίνεται στο τέλος με τη μνήμη τους;`, sol: R`<b>Καρτερικοί, ανώνυμοι</b>, πεθαίνουν ένας ένας και <b>κανείς δεν τους θυμάται</b>.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποιο γνώρισμα του μοντερνισμού ΔΕΝ υπάρχει στο «Μυθιστόρημα Δ΄»;`, options: ["Αυστηρό μέτρο και σταθερή ομοιοκαταληξία", "Ελεύθερος στίχος", "Διακειμενικότητα", "Αξιοποίηση του μύθου"], correct: 0,
      hint: R`Ποιο ανήκει στην παραδοσιακή ποίηση;`, sol: R`Το <b>μέτρο και η ομοιοκαταληξία</b>· το ποίημα είναι σε ελεύθερο στίχο.` },
    { level: 2, shuffle: true, type: "mc", q: R`Η εικόνα των κουπιών που σημαδεύουν τους τάφους των συντρόφων λειτουργεί ως:`, options: ["Σύμβολο του ανώνυμου μόχθου και της λήθης που ακολουθεί", "Περιγραφή ενός αρχαιολογικού χώρου", "Κωμική λεπτομέρεια", "Αναφορά σε ναυτικό αγώνα"], correct: 0,
      hint: R`Τι μένει από τους συντρόφους;`, sol: R`Το κουπί — εργαλείο του κόπου τους — είναι το <b>μόνο ίχνος</b> τους: σύμβολο μόχθου και λήθης.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποιοι αφηγηματικοί τρόποι εναλλάσσονται στο ποίημα, σύμφωνα με τους δείκτες;`, options: ["Αφήγηση, περιγραφή, σχόλιο", "Μόνο διάλογος", "Εσωτερικός μονόλογος και ευθύς λόγος ηρώων", "Επιστολή και ημερολόγιο"], correct: 0,
      hint: R`Το ταξίδι, οι σύντροφοι, ο στοχασμός.`, sol: R`<b>Αφήγηση</b> (ταξίδι), <b>περιγραφή</b> (σύντροφοι), <b>σχόλιο</b> (στοχασμός για αυτογνωσία και δικαιοσύνη).` },
    { level: 3, shuffle: true, type: "mc", q: R`Πώς εκφράζεται η «ελληνικότητα» της Γενιάς του ’30 στο ποίημα;`, options: ["Η αρχαία παράδοση (μύθος, Πλάτωνας) γίνεται τρόπος ερμηνείας της σύγχρονης ανθρώπινης εμπειρίας", "Ο ποιητής περιγράφει αρχαία μνημεία", "Το ποίημα γράφεται σε αρχαία ελληνικά", "Ο ποιητής εξυμνεί τις νίκες του ελληνικού στρατού"], correct: 0,
      hint: R`Δεν είναι απλή αναφορά στο παρελθόν.`, sol: R`Η ελληνικότητα εδώ είναι <b>ερμηνευτικό εργαλείο</b>: η παράδοση φωτίζει το παρόν.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποια είναι η λειτουργία του λιτού κλεισίματος του ποιήματος με το αίτημα δικαιοσύνης;`, options: ["Μετατρέπει την ανάμνηση σε ηθικό στοχασμό και καταγγέλλει τη λήθη των ανώνυμων", "Προαναγγέλλει την επιστροφή των Αργοναυτών", "Δημιουργεί χιουμοριστικό τόνο", "Εισάγει νέο ποιητικό υποκείμενο"], correct: 0,
      hint: R`Τι ζητά ο ποιητής για τους συντρόφους που κανείς δεν θυμάται;`, sol: R`Η λιτή κατακλείδα έχει <b>ηθική βαρύτητα</b>: απαιτεί δικαίωση για όσους μόχθησαν και ξεχάστηκαν.` }
  ]
},
/* ───────────────────────────── 3.4 ───────────────────────────── */
{
  id: "3.4", unit: 3, title: "Οδυσσέας Ελύτης, «Η Μαρίνα των βράχων» και «Μικρή πράσινη θάλασσα»: ανάλυση",
  book: "ΚΝΕΛ Β΄, σσ. 252–255 · ΝΕ. ΛΟΓ. Γ΄, σ. 87 · Πλαίσιο Μάθησης, Α΄ τετράμηνο, Κείμενα 5 και 8",
  intro: "Πώς αποδίδει ο Ελύτης τον έρωτα, τη νεότητα και την ελληνικότητα με τις υπερρεαλιστικές και ηλιακές εικόνες της «Μαρίνας των βράχων» και της «Μικρής πράσινης θάλασσας»;",
  thumb: LETTER("Αιγαίο"),
  theory: R`
<p>Ο <b>Οδυσσέας Ελύτης</b> (1911–1996, Νόμπελ 1979) είναι ο ποιητής του φωτός και του Αιγαίου. Ανήκει στη <b>Γενιά του ’30</b> και αφομοιώνει δημιουργικά τον <b>υπερρεαλισμό</b>: κρατά την ελευθερία της φαντασίας και τις τολμηρές εικόνες, αλλά τις δένει με λυρισμό, αισιοδοξία και την ελληνική φύση. Διδάσκονται δύο ποιήματα από τις δύο πρώτες συλλογές του: «Η Μαρίνα των βράχων» από τους <b>«Προσανατολισμούς» (1940)</b> και η «Μικρή πράσινη θάλασσα» από τον <b>«Ήλιο τον πρώτο» (1943)</b>. <span class="muted">Τα ποιήματα δεν αναδημοσιεύονται εδώ — διάβασέ τα στο ανθολόγιο.</span></p>
<div class="tbox def"><h4>«Η Μαρίνα των βράχων»</h4>
<p><b>Ποιητικό υποκείμενο</b>: διακρίνεται από τον Ελύτη· απευθύνεται σε <b>β΄ πρόσωπο</b> στη «Μαρίνα», μια νεαρή γυναίκα που ταυτίζεται με το καλοκαίρι, τη θάλασσα και τους βράχους. Εκφράζει <b>μνήμη, νοσταλγία, θαυμασμό, έρωτα</b> και <b>αγωνία για τη φθορά του χρόνου</b>. Μια ερώτηση προς τη Μαρίνα για το πού περιπλανιόταν επανέρχεται, δίνοντας τον τόνο ενός ερωτικού «διαλόγου» με μια μορφή που μοιάζει ταυτόχρονα πραγματική και ονειρική.</p>
<ul><li><b>Σύμβολα</b>: η θάλασσα, οι βράχοι, η τρικυμία, ο αστερίας, ο άνεμος, το καλοκαίρι, το αίνιγμα — φορείς έρωτα, νεότητας και φύσης.</li>
<li><b>Εκφραστικά μέσα</b>: <b>μεταφορές</b> που ενώνουν το σώμα της κοπέλας με το θαλασσινό τοπίο (π.χ. μια γεύση από θάλασσα σε φουρτούνα πάνω στο στόμα της), <b>παρομοίωση</b> που συνδέει ένα έντονα κόκκινο ρούχο με το αίμα, <b>προσωποποίηση</b> του χρόνου ως καλλιτέχνη που «πλάθει» και φθείρει τους ανθρώπους, εικόνα του ήλιου ως άγριας, ελπιδοφόρας δύναμης, <b>επαναλήψεις</b>, πλούσιες <b>αισθητηριακές εικόνες</b> (οπτικές, γευστικές, οσφρητικές, απτικές), τολμηροί προσδιορισμοί.</li>
<li><b>Λειτουργία</b>: λυρικό και υπερρεαλιστικό ύφος, έντονες εικόνες, μουσικότητα· αναδεικνύονται ο έρωτας, η μνήμη, η νοσταλγία, η φύση και η φθορά του χρόνου. Η σχέση των δύο φύλων εμφανίζεται με θετικές όψεις (αγάπη, τρυφερότητα) και αρνητικές (απομάκρυνση, μοναξιά, αναπόφευκτη φθορά).</li></ul></div>
<div class="tbox def"><h4>«Μικρή πράσινη θάλασσα»</h4>
<p>Σύντομο λυρικό ποίημα: η θάλασσα <b>προσωποποιείται</b> ως έφηβη κοπέλα στα πρώτα χρόνια της εφηβείας, την οποία το ποιητικό υποκείμενο θέλει τρυφερά να πάρει υπό την προστασία του και να τη μορφώσει στην <b>Ιωνία</b>, ώστε να γνωρίσει τη σκέψη του <b>Ηράκλειτου</b> και τον λόγο των θεών. Ο στίχος-προσφώνηση προς τη μικρή θάλασσα, με την ηλικία της, <b>επαναλαμβάνεται</b> ως μοτίβο.</p>
<ul><li><b>Ελληνικότητα</b>: αναφορές στο Αιγαίο, την Ιωνία, τη Σμύρνη, τον Ηράκλειτο και τη <b>βυζαντινή υμνολογία</b> (λειτουργικές φράσεις όπως «Κυριελέησον», «Δόξα σοι») — σύνδεση του παρόντος με την ιστορική και πολιτισμική συνέχεια.</li>
<li><b>Σύμβολο</b>: η μικρή πράσινη θάλασσα = νεότητα, Ελλάδα, μνήμη, ποιητική δημιουργία.</li>
<li><b>Ποίημα ποιητικής</b>: ο ποιητής παρουσιάζεται ως δημιουργός που <b>διασώζει και ανασυνθέτει</b> την παράδοση· η ποίηση γίνεται φορέας μνήμης, ιστορίας και πολιτισμού.</li>
<li><b>Μορφή</b>: ελεύθερος στίχος, συνειρμική ανάπτυξη εικόνων, πολυσημία — νεοελληνικός μοντερνισμός.</li></ul></div>
<div class="tbox thm"><h4>Σύγκριση των δύο ποιημάτων</h4>
<table class="tbl"><tr><th></th><th>«Η Μαρίνα των βράχων»</th><th>«Μικρή πράσινη θάλασσα»</th></tr>
<tr><td>Αποδέκτης (β΄ πρόσωπο)</td><td>Μια νεαρή γυναίκα</td><td>Η θάλασσα ως κοπέλα</td></tr>
<tr><td>Κυρίαρχο θέμα</td><td>Έρωτας, νεότητα, φθορά του χρόνου</td><td>Ελληνικότητα, πολιτισμική μνήμη, ποίηση</td></tr>
<tr><td>Τόνος</td><td>Ερωτικός, νοσταλγικός, με αγωνία</td><td>Τρυφερός, παιγνιώδης, αισιόδοξος</td></tr>
<tr><td>Κοινά</td><td colspan="2">Αιγαιοπελαγίτικο τοπίο, φως, θάλασσα· υπερρεαλιστικές/αισθητηριακές εικόνες· ελεύθερος στίχος· αποστροφή</td></tr></table></div>
<div class="tbox ex"><h4>Τύπος ερώτησης</h4>
<p>«Να ερμηνεύσετε τη λειτουργία της προσωποποίησης της θάλασσας στη «Μικρή πράσινη θάλασσα».»</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p>Η θάλασσα γίνεται μια <b>έφηβη κοπέλα</b>, που ο ποιητής θέλει να φροντίσει και να μορφώσει. Η προσωποποίηση <b>ζωντανεύει</b> το φυσικό στοιχείο και του δίνει νεότητα, αθωότητα και τρυφερότητα. Επειδή η μόρφωσή της γίνεται στην Ιωνία, με τη σκέψη του Ηράκλειτου και τον λόγο των θεών, η θάλασσα γίνεται <b>σύμβολο της Ελλάδας</b> που μαθαίνει την πολιτισμική της κληρονομιά — και ο ποιητής, ως «δάσκαλος», αυτός που διασώζει τη μνήμη. Η επανάληψη του στίχου για τη μικρή πράσινη θάλασσα ενισχύει τον λυρισμό και την ενότητα του ποιήματος.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>«Η Μαρίνα είναι η γυναίκα του Ελύτη» — είναι ποιητική μορφή, το ποιητικό υποκείμενο διακρίνεται από τον ποιητή.</li>
<li>Λίστα εικόνων χωρίς ερμηνεία: εξήγησε πάντα τι συμβολίζουν (έρωτας, νεότητα, χρόνος, ελληνικότητα).</li>
<li>Σύγχυση των συλλογών: «Μαρίνα» → «Προσανατολισμοί» (1940)· «Μικρή πράσινη θάλασσα» → «Ήλιος ο πρώτος» (1943).</li></ul></div>
`,
  widget: "nc1elytis",
  gen: "nc1gTech",
  exercises: [
    { level: 1, shuffle: true, type: "mc", q: R`Σε ποια συλλογή ανήκει «Η Μαρίνα των βράχων»;`, options: ["«Προσανατολισμοί» (1940)", "«Ήλιος ο πρώτος» (1943)", "«Το Άξιον Εστί» (1959)", "«Στροφή» (1931)"], correct: 0,
      hint: R`Είναι η πρώτη συλλογή του Ελύτη.`, sol: R`Στους <b>«Προσανατολισμούς» (1940)</b>.` },
    { level: 1, q: R`Σε ποια ηλικία παρουσιάζεται η θάλασσα-κοπέλα του ποιήματος; (αριθμός ετών)`, fields: [{ label: "Χρόνια:", ans: 13 }],
      hint: R`Ξαναδιάβασε τον στίχο-μοτίβο που επαναλαμβάνεται στο ποίημα.`, sol: R`<b>13</b> χρονών — εφηβεία, νεότητα, αθωότητα.` },
    { level: 1, q: R`Ποια χρονιά τιμήθηκε ο Ελύτης με το Βραβείο Νόμπελ;`, fields: [{ label: "Έτος:", ans: 1979 }],
      hint: R`Θυμήσου τη δεκαετία και τη σειρά των δύο Ελλήνων νομπελιστών.`, sol: R`Το <b>1979</b>.` },
    { level: 2, shuffle: true, type: "mc", q: R`Σε ποιο πρόσωπο απευθύνεται το ποιητικό υποκείμενο και στα δύο ποιήματα;`, options: ["Στο β΄ ενικό (αποστροφή)", "Στο γ΄ πληθυντικό", "Στο α΄ πληθυντικό", "Σε κανένα — είναι απρόσωπα"], correct: 0,
      hint: R`Στη Μαρίνα / στη θάλασσα.`, sol: R`<b>Β΄ ενικό</b>: αποστροφή προς τη Μαρίνα και προς τη θάλασσα-κοπέλα, που δίνει οικειότητα και ερωτική/τρυφερή ένταση.` },
    { level: 2, shuffle: true, type: "mc", q: R`Στη «Μαρίνα» ο χρόνος παρουσιάζεται σαν καλλιτέχνης που δίνει μορφή στους ανθρώπους. Η εικόνα αυτή είναι κυρίως:`, options: ["προσωποποίηση/μεταφορά που αποδίδει τη φθορά του χρόνου", "παρομοίωση με «σαν»", "ρητορική ερώτηση", "ασύνδετο σχήμα"], correct: 0,
      hint: R`Ο χρόνος κάνει κάτι που κάνει ένας καλλιτέχνης.`, sol: R`Ο χρόνος <b>προσωποποιείται</b> ως δημιουργός που πλάθει — δηλαδή αλλάζει και φθείρει — τους ανθρώπους.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποια στοιχεία της «Μικρής πράσινης θάλασσας» συνδέουν το ποίημα με την ελληνική πολιτισμική παράδοση;`, options: ["Η Ιωνία, η Σμύρνη, ο Ηράκλειτος και η βυζαντινή υμνολογία", "Οι αναφορές στον Β΄ Παγκόσμιο Πόλεμο", "Ο δεκαπεντασύλλαβος και η ομοιοκαταληξία", "Η περιγραφή της Αθήνας"], correct: 0,
      hint: R`Αρχαία φιλοσοφία, Μικρά Ασία, Εκκλησία.`, sol: R`<b>Ιωνία, Σμύρνη, Ηράκλειτος, βυζαντινή υμνολογία</b>: ιστορική και πολιτισμική συνέχεια.` },
    { level: 2, type: "mc", q: R`Η «Μικρή πράσινη θάλασσα» μπορεί να διαβαστεί και ως ποίημα ποιητικής.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Ποιος είναι ο ρόλος του ποιητή-«δασκάλου»;`, sol: R`<b>ΣΩΣΤΟ.</b> Η ποίηση παρουσιάζεται ως φορέας μνήμης, ιστορίας και πολιτισμού, και ο ποιητής ως εκείνος που τη διασώζει και την ανασυνθέτει.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποια είναι η λειτουργία των αισθητηριακών εικόνων (γεύσεις, μυρωδιές, χρώματα) στη «Μαρίνα των βράχων»;`, options: ["Δημιουργούν λυρικό, υπερρεαλιστικό ύφος και ζωντανεύουν τον έρωτα και το καλοκαίρι, φορτίζοντας συναισθηματικά το ποίημα", "Δίνουν ιστορικές πληροφορίες για την εποχή", "Επιβραδύνουν μια πεζή αφήγηση", "Δημιουργούν κωμικό αποτέλεσμα"], correct: 0,
      hint: R`Τι «νιώθει» ο αναγνώστης;`, sol: R`Οι εικόνες κάνουν τον έρωτα <b>σωματικό, αισθητό</b> και ενώνουν τη γυναίκα με το τοπίο· δημιουργούν μουσικότητα και έντονη συγκίνηση.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποια διαφορά υπάρχει στον τόνο των δύο ποιημάτων;`, options: ["Η «Μαρίνα» είναι ερωτική και νοσταλγική με αγωνία για τον χρόνο, η «Μικρή πράσινη θάλασσα» τρυφερή, παιγνιώδης και αισιόδοξη", "Και τα δύο είναι σατιρικά", "Η «Μαρίνα» είναι πολεμικό ποίημα, η «Μικρή πράσινη θάλασσα» ερωτικό", "Δεν υπάρχει καμία διαφορά"], correct: 0,
      hint: R`Σε ποιο ποίημα κυριαρχεί η φθορά και σε ποιο η μόρφωση της θάλασσας;`, sol: R`Η «Μαρίνα» είναι <b>ερωτική, νοσταλγική</b> (φθορά του χρόνου)· η «Μικρή πράσινη θάλασσα» <b>τρυφερή και αισιόδοξη</b>, με το βλέμμα στην πολιτισμική μνήμη.` }
  ]
},
/* ───────────────────────────── 3.5 ───────────────────────────── */
{
  id: "3.5", unit: 3, title: "Στρατής Δούκας, «Ιστορία ενός αιχμαλώτου»: αφήγηση-μαρτυρία, αφηγητής, τεχνικές",
  book: "ΝΕ. ΛΟΓ. Γ΄, σσ. 187–199, 208–224 · Πλαίσιο Μάθησης, Α΄ τετράμηνο, Κείμενο 6",
  intro: "Γιατί η «Ιστορία ενός αιχμαλώτου» του Στρατή Δούκα είναι αφήγηση-μαρτυρία, και πώς λειτουργούν ο πρωτοπρόσωπος αφηγητής, η περιγραφή και ο διάλογος;",
  thumb: LETTER("1922"),
  theory: R`
<p>Ο <b>Στρατής Δούκας</b> (1895–1983), Μικρασιάτης από τις Κυδωνίες (Αϊβαλί), δημοσίευσε το <b>1929</b> την <b>«Ιστορία ενός αιχμαλώτου»</b>, ένα από τα σημαντικότερα πεζά για τη <b>Μικρασιατική Καταστροφή</b>. Ο συγγραφέας παρουσιάζει το κείμενο ως <b>καταγραφή</b> της αφήγησης ενός πραγματικού αιχμαλώτου, του Νικόλα Κοζάκογλου, όπως του τη διηγήθηκε ο ίδιος. Ο αφηγητής <b>δεν είναι στρατιώτης</b>: είναι νεαρός Ρωμιός της Μικράς Ασίας, που μετά την καταστροφή της Σμύρνης (1922) χωρίζεται από την οικογένειά του, συλλαμβάνεται και στέλνεται μαζί με άλλους άμαχους Έλληνες στα τάγματα εργασίας (αμελέ ταμπουρού) στο εσωτερικό. <span class="muted">Το κείμενο δεν αναδημοσιεύεται εδώ· τα αποσπάσματα της ύλης βρίσκονται στο ΝΕ. ΛΟΓ. Γ΄.</span></p>
<div class="tbox def"><h4>Είδος: αφήγηση-μαρτυρία με στοιχεία νουβέλας</h4>
<p>Είναι <b>αυτοβιογραφική αφήγηση-μαρτυρία</b>: πρωτοπρόσωπη εξιστόρηση πραγματικών βιωμάτων. Η έκταση, η πλοκή και η αγωνία της δίνουν <b>στοιχεία νουβέλας</b>. Ανήκει στην <b>αντιπολεμική πεζογραφία</b>: αποτυπώνει τη φρίκη του πολέμου, της αιχμαλωσίας και της προσφυγιάς και την ανθρώπινη αγωνία για επιβίωση. Η γλώσσα είναι <b>λιτή, απλή, προφορική</b>, με ιδιωματικά στοιχεία — όπως μιλούσε ο ίδιος ο αφηγητής.</p></div>
<div class="tbox"><h4>Δομή και πλοκή</h4>
<p>Βασικά επεισόδια (σειρά της ιστορίας): <b>σύλληψη</b> στη Σμύρνη μετά την Καταστροφή (1922) και χωρισμός από τους δικούς του → <b>πορείες</b> των αιχμαλώτων, πείνα, βία, θάνατοι → καταναγκαστική εργασία → <b>απόφαση διαφυγής</b> → <b>μεταμφίεση</b> ώστε να περνά για ντόπιος → <b>περιπλάνηση</b> με κινδύνους, αλλά και ανθρωπιά από απλούς ανθρώπους → <b>επιστροφή</b> στην ελευθερία. Η πλοκή κρατά την αγωνία του αναγνώστη μέσα από <b>συνεχείς δοκιμασίες</b> του ήρωα· σύντομες <b>αναδρομές</b> συμπληρώνουν το παρελθόν του αφηγητή.</p></div>
<div class="tbox thm"><h4>Αφηγητής, πρόσωπο, εστίαση</h4>
<ul><li><b>Ομοδιηγητικός-αυτοδιηγητικός</b> αφηγητής: ο πρωταγωνιστής αφηγείται τη δική του ιστορία.</li>
<li><b>Α΄ πρόσωπο</b> (ενικό και συχνά πληθυντικό — το «εμείς» των αιχμαλώτων): <b>αμεσότητα, βιωματικότητα, αξιοπιστία</b> μαρτυρίας· το «εμείς» δείχνει τη συλλογική μοίρα.</li>
<li><b>Εσωτερική εστίαση</b>: ξέρουμε μόνο όσα είδε και ένιωσε ο ίδιος — γι’ αυτό η αγωνία είναι μεγαλύτερη.</li>
<li>Εναλλαγή <b>εξωτερικών γεγονότων</b> (δράση) και <b>εσωτερικών βιωμάτων</b> (φόβος, ελπίδα) → ένταση.</li></ul></div>
<div class="tbox def"><h4>Αφηγηματικοί τρόποι και χρόνος</h4>
<ul><li><b>Αφήγηση</b> (κυρίαρχη), <b>περιγραφή</b> (τόποι, κακουχίες, ατμόσφαιρα της Καταστροφής), <b>διάλογος</b> (σύντομες φράσεις σε ευθύ λόγο, π.χ. διαταγές των φρουρών — ζωντάνια, αληθοφάνεια, σκιαγράφηση χαρακτήρων), <b>σχόλιο</b>.</li>
<li><b>Χρόνος</b>: σε γενικές γραμμές <b>γραμμική</b> αφήγηση· <b>επιβράδυνση</b> στις δραματικές σκηνές, <b>επιτάχυνση</b> στις μετακινήσεις και στα χρονικά περάσματα — η εναλλαγή δημιουργεί αγωνία και κρατά το ενδιαφέρον.</li>
<li><b>Μοτίβα</b>: φόβος, πείνα, διαφυγή, επιβίωση, ελπίδα.</li></ul></div>
<div class="tbox rem"><h4>Ιστορικό πλαίσιο και μήνυμα</h4>
<p>Μετά την κατάρρευση του μικρασιατικού μετώπου (Αύγουστος 1922) και την καταστροφή της Σμύρνης, χιλιάδες Έλληνες άνδρες — στρατιώτες αλλά και άμαχοι, όπως ο αφηγητής — οδηγήθηκαν αιχμάλωτοι στο εσωτερικό· πολλοί πέθαναν στις πορείες και στα τάγματα εργασίας. Το έργο δείχνει πώς ο πόλεμος επηρεάζει τις επιλογές, τις πράξεις και την ψυχολογία των ανθρώπων, και προβάλλει ένα <b>ανθρωπιστικό, αντιπολεμικό μήνυμα</b>: βία από τη μια, αλλά και αλληλεγγύη και ανθρωπιά από απλούς ανθρώπους, ανεξάρτητα από εθνικότητα.</p></div>
<div class="tbox ex"><h4>Τύπος ερώτησης (δειγματικό 2026–27)</h4>
<p>Στο δειγματικό δοκίμιο, σε απόσπασμα από τις πρώτες μέρες της αιχμαλωσίας (πορεία προς τη Μαγνησία), ζητήθηκαν: (α) τρία περιστατικά και η στάση των φρουρών απέναντι στους αιχμαλώτους, (β) δύο αφηγηματικοί τρόποι με τεκμηρίωση.</p>
<details class="steps"><summary>Πώς απαντάμε στο (β)</summary><p>Εντοπίζουμε π.χ. <b>αφήγηση</b> (ρήματα σε α΄ πληθυντικό για την πορεία: εξιστόρηση της πορείας — προωθεί τη δράση και δείχνει τη συλλογική δοκιμασία) και <b>διάλογο/ευθύ λόγο</b> (οι προσταγές των στρατιωτών σε ευθύ λόγο — ζωντάνια, αμεσότητα, αληθοφάνεια, η σκληρότητα των φρουρών «ακούγεται»). Για κάθε τρόπο: <b>όνομα → τεκμήριο → λειτουργία</b>.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>«Ο αφηγητής είναι ο Δούκας» — αφηγητής είναι ο αιχμάλωτος· ο Δούκας είναι ο συγγραφέας-καταγραφέας.</li>
<li>«Ο αφηγητής είναι στρατιώτης» — είναι άμαχος Μικρασιάτης που συλλαμβάνεται μετά την καταστροφή της Σμύρνης.</li>
<li>Σύγχυση «ομοδιηγητικός» (συμμετέχει) με «ετεροδιηγητικός».</li>
<li>Ιστορική αφήγηση της Καταστροφής χωρίς σύνδεση με το συγκεκριμένο απόσπασμα.</li></ul></div>
`,
  widget: "nc1doukas",
  gen: "nc1gNarr",
  exercises: [
    { level: 1, q: R`Ποια χρονιά δημοσιεύτηκε η «Ιστορία ενός αιχμαλώτου»;`, fields: [{ label: "Έτος:", ans: 1929 }],
      hint: R`Λίγα χρόνια μετά την Καταστροφή, στο τέλος της δεκαετίας του 1920.`, sol: R`Το <b>1929</b>.` },
    { level: 1, shuffle: true, type: "mc", q: R`Σε ποιο ιστορικό γεγονός αναφέρεται το έργο;`, options: ["Στη Μικρασιατική Καταστροφή (1922) και την αιχμαλωσία Ελλήνων της Μικράς Ασίας στα τάγματα εργασίας", "Στον Εμφύλιο Πόλεμο", "Στην τουρκική εισβολή στην Κύπρο", "Στη γερμανική κατοχή της Γαλλίας"], correct: 0,
      hint: R`Ο συγγραφέας είναι Μικρασιάτης.`, sol: R`Στη <b>Μικρασιατική Καταστροφή</b> του 1922.` },
    { level: 1, shuffle: true, type: "mc", q: R`Τι είδους αφηγητής αφηγείται την ιστορία;`, options: ["Ομοδιηγητικός-αυτοδιηγητικός (ο ίδιος ο αιχμάλωτος, σε α΄ πρόσωπο)", "Ετεροδιηγητικός παντογνώστης", "Εξωτερικός παρατηρητής σε γ΄ πρόσωπο", "Ο Στρατής Δούκας ως πρωταγωνιστής"], correct: 0,
      hint: R`Ποιος έζησε την αιχμαλωσία;`, sol: R`Ο ίδιος ο αιχμάλωτος: <b>ομοδιηγητικός-αυτοδιηγητικός</b>, α΄ πρόσωπο.` },
    { level: 2, shuffle: true, type: "mc", q: R`Σε ποιο είδος πεζογραφίας εντάσσεται κυρίως το έργο;`, options: ["Αυτοβιογραφική αφήγηση-μαρτυρία με στοιχεία νουβέλας", "Παραμύθι", "Ευθυμογράφημα", "Θεατρικό έργο"], correct: 0,
      hint: R`Καταγράφει πραγματικά βιώματα.`, sol: R`<b>Αφήγηση-μαρτυρία</b> με στοιχεία νουβέλας.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποια είναι η κύρια λειτουργία της πρωτοπρόσωπης αφήγησης στο έργο;`, options: ["Αμεσότητα, βιωματικότητα και αξιοπιστία της μαρτυρίας", "Αντικειμενική απόσταση από τα γεγονότα", "Κωμικό αποτέλεσμα", "Παντογνωσία για όλους τους ήρωες"], correct: 0,
      hint: R`Ο αναγνώστης «ακούει» αυτόν που τα έζησε.`, sol: R`<b>Αμεσότητα, βιωματικότητα, αξιοπιστία</b>.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποια είναι η λειτουργία της περιγραφής στο έργο, κατά τους δείκτες επάρκειας;`, options: ["Αποδίδει τους τόπους, τις κακουχίες και την ατμόσφαιρα της Καταστροφής", "Προαναγγέλλει το τέλος", "Εισάγει νέους αφηγητές", "Δημιουργεί σάτιρα"], correct: 0,
      hint: R`Τι «ζωγραφίζει» η περιγραφή;`, sol: R`Η περιγραφή αποδίδει <b>τόπους, κακουχίες, ατμόσφαιρα</b>.` },
    { level: 2, shuffle: true, type: "mc", q: R`Πώς χειρίζεται ο αφηγητής τον χρόνο, σύμφωνα με τους δείκτες;`, options: ["Επιβράδυνση στις δραματικές σκηνές και επιτάχυνση στις μετακινήσεις και στα χρονικά περάσματα", "Αποκλειστικά αναδρομική αφήγηση από το τέλος", "Αφήγηση στο μέλλον", "Χωρίς καμία χρονική εξέλιξη"], correct: 0,
      hint: R`Πού «σταματά» και πού «τρέχει» η αφήγηση;`, sol: R`<b>Επιβράδυνση</b> στις κρίσιμες σκηνές, <b>επιτάχυνση</b> στα περάσματα: δημιουργείται αγωνία.` },
    { level: 3, shuffle: true, type: "mc", q: R`Στο απόσπασμα των πρώτων ημερών της αιχμαλωσίας οι φρουροί δίνουν διαταγές σε ευθύ λόγο. Ποια είναι η λειτουργία αυτού του διαλόγου;`, options: ["Ζωντάνια, αμεσότητα και αληθοφάνεια· η σκληρότητα των φρουρών γίνεται αισθητή", "Επιβραδύνει τη δράση με περιγραφές τοπίου", "Εκφράζει τις σκέψεις του αφηγητή σε εσωτερικό μονόλογο", "Δημιουργεί χιούμορ"], correct: 0,
      hint: R`Τι αλλάζει όταν «ακούμε» τα ίδια τα λόγια;`, sol: R`Ο <b>ευθύς λόγος</b> φέρνει τη σκηνή στο παρόν: ζωντάνια, αληθοφάνεια, και σκιαγραφεί τη στάση των φρουρών.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποιο είναι το κεντρικό μήνυμα του έργου κατά το Πλαίσιο Μάθησης;`, options: ["Ανθρωπιστικό και αντιπολεμικό: η φρίκη του πολέμου, αλλά και η αλληλεγγύη ανάμεσα σε απλούς ανθρώπους", "Εθνικιστικό: δοξασία της νίκης", "Ψυχαγωγικό: μια περιπετειώδης ιστορία χωρίς βάθος", "Πολιτικό: προπαγάνδα υπέρ ενός κόμματος"], correct: 0,
      hint: R`Υπάρχουν και άνθρωποι που βοηθούν τον ήρωα.`, sol: R`Το μήνυμα είναι <b>ανθρωπιστικό και αντιπολεμικό</b>.` }
  ]
},
/* ───────────────────────────── 3.6 ───────────────────────────── */
{
  id: "3.6", unit: 3, title: "Γιώργος Ιωάννου, «Ομίχλη»: μνήμη, Θεσσαλονίκη, αφηγητής και χρόνος",
  book: "ΝΕ. ΛΟΓ. Γ΄, σσ. 262–264 · Πλαίσιο Μάθησης, Α΄ τετράμηνο, Κείμενο 7 · Δειγματικά δοκίμια 2017 και 2026–27",
  intro: "Τι συμβολίζει η ομίχλη στο πεζογράφημα του Γιώργου Ιωάννου και πώς εναλλάσσονται παρόν και παρελθόν στην αφήγηση;",
  thumb: LETTER("Ομίχλη"),
  theory: R`
<p>Ο <b>Γιώργος Ιωάννου</b> (1927–1985), πεζογράφος της <b>Θεσσαλονίκης</b>, έγραψε σύντομα πεζογραφήματα με έντονα <b>αυτοβιογραφικά και βιωματικά</b> στοιχεία, όπου η προσωπική μνήμη, η πόλη και η καθημερινή εμπειρία δένονται αξεχώριστα. Η <b>«Ομίχλη»</b> ανήκει στη συλλογή <b>«Η μόνη κληρονομιά» (1974)</b> και έχει εμφανιστεί και στα δύο δειγματικά δοκίμια της Εμβάθυνσης. <span class="muted">Το κείμενο δεν αναδημοσιεύεται εδώ· διάβασέ το στο ΝΕ. ΛΟΓ. Γ΄.</span></p>
<div class="tbox"><h4>Η πορεία του κειμένου (με δικά μας λόγια)</h4>
<ol><li><b>Παρόν</b>: ο αφηγητής δηλώνει ότι δεν ξέρει πια τι γίνεται με την ομίχλη· θυμάται και την πάχνη στα κεραμίδια και τις οικογενειακές κουβέντες γι’ αυτήν.</li>
<li><b>Παρελθόν</b>: περίμενε με λαχτάρα τις μέρες της ομίχλης· στεναχωριόταν όταν έπεφτε τις ώρες του γραφείου. Όταν την έβλεπε απρόσμενα το απόγευμα, άλλαζε σχέδια και κατέβαινε στην παραλία.</li>
<li>Στοχασμός: η ομίχλη είναι για τον αφηγητή κάτι που καλεί σε περπάτημα, σχεδόν σαν να τον κρατά· και ταιριάζει μόνο με λιμάνι. Με την ψιλή βροχή γινόταν ακόμη πιο γλυκιά· η πόλη, τα φώτα, τα τραμ αποκτούσαν νόημα.</li>
<li>Το <b>καφενείο του λιμανιού</b>, γκρεμισμένο από χρόνια: εκεί περίμενε την παρέα, που ποτέ δεν ερχόταν· πίσω από τα τζάμια περνούσαν οι <b>σκιές των νεκρών</b>.</li>
<li><b>Παρόν</b>: η ομίχλη πια ξεκινά από τα όνειρα, που πιέζουν για να βγουν· ο αφηγητής γίνεται ένα μαζί της, ακολουθεί σκιές ονομάζοντάς τες, περπατά στο λιθόστρωτο που απομένει· σχόλιο για τον θάνατο και ευχή να ξαναβρούμε τους δικούς μας.</li>
<li>Φτάνει σε ένα επιβλητικό σπίτι τυλιγμένο στους κισσούς, αλλά δεν πλησιάζει την είσοδο — μόνο ένα αγαπημένο πρόσωπο θα τον έπειθε. Επιστρέφει στην κίνηση της πόλης· το περπάτημα στις ομιχλιασμένες νύχτες τον ανακουφίζει.</li></ol></div>
<div class="tbox def"><h4>Αφηγητής, πρόσωπο, εστίαση</h4>
<ul><li><b>Ομοδιηγητικός-αυτοδιηγητικός</b> αφηγητής, <b>α΄ ενικό</b>: αμεσότητα, <b>εξομολογητικός τόνος</b>, νοσταλγική ατμόσφαιρα, στενή σχέση με τον αναγνώστη.</li>
<li><b>Εσωτερική εστίαση</b>: η ιστορία φτάνει σε μας μόνο μέσα από όσα είδε, θυμάται και νιώθει ο αφηγητής.</li>
<li>Εναλλαγή <b>εξωτερικών γεγονότων</b> (περίπατοι, διαδρομές, λιμάνι) και <b>εσωτερικού κόσμου</b> (σκέψεις, αναμνήσεις, συναισθήματα).</li></ul></div>
<div class="tbox thm"><h4>Δομή, τρόποι και χρόνος</h4>
<ul><li><b>Χαλαρή πλοκή</b>: η εξέλιξη στηρίζεται στη <b>μνήμη</b> και στους <b>συνειρμούς</b>, όχι σε έντονη δράση.</li>
<li><b>Τρόποι</b>: αφήγηση προσωπικών βιωμάτων· <b>περιγραφή</b> (ομίχλη, Θεσσαλονίκη, λιμάνι, δρόμοι)· <b>σχόλιο</b> και <b>εσωτερικός μονόλογος</b> (νοσταλγία, υπαρξιακοί προβληματισμοί)· πολύ περιορισμένος <b>διάλογος</b>.</li>
<li><b>Χρόνος</b>: χρόνος της αφήγησης = <b>παρόν</b>· χρόνος της ιστορίας = <b>παρελθόν</b> και αναμνήσεις νεότητας. <b>Αναδρομές</b> και μεταβάσεις παρόντος–παρελθόντος οργανώνονται μέσω της μνήμης και της εικόνας της ομίχλης. <b>Επιβράδυνση</b> με εκτεταμένες περιγραφές και στοχασμούς.</li>
<li><b>Μοτίβα</b>: ομίχλη, σκιές, πόλη, μνήμη.</li></ul></div>
<div class="tbox def"><h4>Ο συμβολισμός της ομίχλης</h4>
<p>Η ομίχλη ξεκινά ως φυσικό φαινόμενο και γίνεται <b>σύμβολο</b>: φορέας <b>μνήμης</b> και <b>νοσταλγίας</b>, χώρος <b>εσωτερικής αναζήτησης</b> και καταφύγιο όπου ο αφηγητής κρύβεται από τα βλέμματα των άλλων. Μέσα της ζωντανεύουν οι νεκροί, και η πόλη μεταμορφώνεται σχεδόν μεταφυσικά. Η φθορά του αστικού χώρου (γκρεμισμένο καφενείο, χορτάρι που χάθηκε) και η απώλεια προσώπων συνδέονται με την <b>προσωπική ταυτότητα</b>, τη μοναξιά και την αλλοίωση της συλλογικής μνήμης.</p></div>
<div class="tbox ex"><h4>Τι ζητήθηκε στα δειγματικά δοκίμια</h4>
<p>Η «Ομίχλη» συγκρίθηκε με απόσπασμα του Μ. Καραγάτση («Το νερό της βροχής», 1950) για μια περιπλάνηση στην ομίχλη του Λονδίνου. Ζητήθηκαν: η <b>επίδραση της ομίχλης στην ψυχική κατάσταση</b> του αφηγητή, το <b>είδος της εστίασης</b> / της αφήγησης και η διαφορά <b>α΄ ενικού ↔ α΄ πληθυντικού</b>.</p>
<details class="steps"><summary>Ενδεικτικά σημεία απάντησης (με βάση τον οδηγό διόρθωσης)</summary>
<ul><li><b>Ιωάννου</b>: νοσταλγική εξομολόγηση· η ομίχλη τον ανακουφίζει, του δίνει σιγουριά, μεταμορφώνει την πόλη, τον φέρνει σε επαφή με τις σκιές των νεκρών και με τα όνειρα — γλυκιά μελαγχολία και παρηγοριά.</li>
<li><b>Καραγάτσης</b>: η ομίχλη τυλίγει με μυστήριο φτωχικούς δρόμους· οι περιπατητές θέλουν να τη νιώσουν στο σώμα τους, να περιπλανηθούν χωρίς σκοπό — αφορμή για ενδοσκόπηση.</li>
<li><b>Εστίαση</b>: εσωτερική και στα δύο (ο αφηγητής-ήρωας ξέρει μόνο όσα αντιλαμβάνεται).</li>
<li><b>Πρόσωπο</b>: α΄ ενικό στον Ιωάννου (βιωμένη εμπειρία, εξομολόγηση)· α΄ πληθυντικό στον Καραγάτση (συλλογικότητα, οικειότητα — ο αναγνώστης γίνεται συμμέτοχος).</li></ul></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>«Το κείμενο έχει πλοκή με δράση και κορύφωση» — η πλοκή είναι χαλαρή, συνειρμική.</li>
<li>Σύγχυση χρόνου αφήγησης (παρόν) και χρόνου ιστορίας (παρελθόν).</li>
<li>Παρουσίαση της ομίχλης μόνο ως καιρικού φαινομένου, χωρίς συμβολισμό.</li></ul></div>
`,
  widget: "nc1omichli",
  gen: "nc1gNarr",
  exercises: [
    { level: 1, q: R`Σε ποια πόλη διαδραματίζεται η «Ομίχλη»;`, fields: [{ label: "Πόλη:", ans: ["Θεσσαλονίκη", "Θεσσαλονικη", "Σαλονίκη", "Σαλονικη"], text: true }],
      hint: R`Η πόλη του Ιωάννου, με λιμάνι και τραμ.`, sol: R`Στη <b>Θεσσαλονίκη</b>.` },
    { level: 1, shuffle: true, type: "mc", q: R`Σε ποια συλλογή του Ιωάννου ανήκει η «Ομίχλη»;`, options: ["«Η μόνη κληρονομιά» (1974)", "«Για ένα φιλότιμο» (1964)", "«Αιολική γη»", "«Το νερό της βροχής»"], correct: 0,
      hint: R`Η συλλογή του 1974.`, sol: R`Στη <b>«Μόνη κληρονομιά» (1974)</b>.` },
    { level: 1, shuffle: true, type: "mc", q: R`Σε ποιο ρηματικό πρόσωπο κυρίως γίνεται η αφήγηση;`, options: ["Στο α΄ ενικό", "Στο γ΄ ενικό", "Στο β΄ πληθυντικό", "Στο γ΄ πληθυντικό"], correct: 0,
      hint: R`Ο αφηγητής μιλά για τα δικά του βιώματα.`, sol: R`<b>Α΄ ενικό</b>: εξομολογητική, πρωτοπρόσωπη αφήγηση.` },
    { level: 2, shuffle: true, type: "mc", q: R`Τι είδους εστίαση έχουμε στην «Ομίχλη»;`, options: ["Εσωτερική εστίαση", "Μηδενική εστίαση", "Εξωτερική εστίαση", "Πολλαπλή εστίαση με παντογνώστη"], correct: 0,
      hint: R`Τι ξέρει ο αφηγητής για τους άλλους;`, sol: R`<b>Εσωτερική εστίαση</b>: μόνο όσα βλέπει, θυμάται και νιώθει ο αφηγητής-ήρωας.` },
    { level: 2, shuffle: true, type: "mc", q: R`Πώς οργανώνεται η πλοκή του κειμένου;`, options: ["Χαλαρά, με βάση τη μνήμη και τους συνειρμούς, χωρίς έντονη εξωτερική δράση", "Με έντονη δράση και αστυνομική κορύφωση", "Σε αυστηρή χρονολογική σειρά, χωρίς αναδρομές", "Ως θεατρικός διάλογος"], correct: 0,
      hint: R`Τι «οδηγεί» τον αφηγητή από σκηνή σε σκηνή;`, sol: R`<b>Χαλαρή, συνειρμική</b> οργάνωση, με άξονα τη μνήμη.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποια σχέση έχουν ο χρόνος της αφήγησης και ο χρόνος της ιστορίας;`, options: ["Ο αφηγητής μιλά από το παρόν για ένα παρελθόν αναμνήσεων· εναλλάσσονται μέσω της μνήμης", "Ταυτίζονται απόλυτα", "Η αφήγηση γίνεται στο μέλλον", "Ο χρόνος δεν έχει καμία σημασία στο κείμενο"], correct: 0,
      hint: R`Παρόν ↔ νεότητα.`, sol: R`Χρόνος αφήγησης: <b>παρόν</b>· χρόνος ιστορίας: <b>παρελθόν</b>· αναδρομές και μεταβάσεις μέσω της μνήμης και της ομίχλης.` },
    { level: 2, type: "mc", q: R`Στην «Ομίχλη» κυριαρχεί ο διάλογος ανάμεσα στον αφηγητή και τους φίλους του.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι λένε οι δείκτες για τον διάλογο;`, sol: R`<b>ΛΑΘΟΣ.</b> Ο διάλογος είναι <b>πολύ περιορισμένος</b>· κυριαρχεί η εσωτερική αφήγηση, η περιγραφή και ο στοχασμός.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποιος είναι ο συμβολικός ρόλος της ομίχλης;`, options: ["Φορέας μνήμης, νοσταλγίας και εσωτερικής αναζήτησης· μέσα της ζωντανεύουν οι νεκροί", "Σύμβολο της βιομηχανικής ρύπανσης", "Προειδοποίηση για επικείμενη καταστροφή", "Απλό σκηνικό χωρίς σημασία"], correct: 0,
      hint: R`Τι εμφανίζεται μέσα στην ομίχλη;`, sol: R`Η ομίχλη είναι <b>φορέας μνήμης και νοσταλγίας</b>, καταφύγιο και χώρος συνάντησης με τις σκιές των νεκρών.` },
    { level: 3, shuffle: true, type: "mc", q: R`Στη σύγκριση με το απόσπασμα του Καραγάτση (α΄ πληθυντικό), τι προσφέρει το α΄ ενικό της «Ομίχλης»;`, options: ["Τη δύναμη της βιωμένης εμπειρίας και έναν εξομολογητικό χαρακτήρα", "Συλλογικότητα και καθολικότητα", "Αντικειμενικότητα και ψυχρότητα", "Χιουμοριστική απόσταση"], correct: 0,
      hint: R`Ποιος μιλά — ένας ή πολλοί;`, sol: R`Το <b>α΄ ενικό</b> δίνει <b>βιωματικότητα και εξομολόγηση</b>· το α΄ πληθυντικό του Καραγάτση προσθέτει συλλογικότητα.` },
    { level: 3, shuffle: true, type: "mc", q: R`Πώς συνδέεται η φθορά της πόλης (γκρεμισμένο καφενείο, χαμένο χορτάρι στο λιθόστρωτο) με τα θέματα του κειμένου;`, options: ["Η αλλαγή του αστικού χώρου συμβαδίζει με την απώλεια προσώπων και αγγίζει την προσωπική ταυτότητα και τη μνήμη", "Δείχνει την πρόοδο και τον εκσυγχρονισμό, που χαροποιούν τον αφηγητή", "Είναι τυχαία λεπτομέρεια", "Δείχνει ότι ο αφηγητής δεν γνωρίζει την πόλη"], correct: 0,
      hint: R`Τι χάνεται μαζί με τα κτίρια;`, sol: R`Η φθορά του χώρου <b>αντανακλά την απώλεια</b> και τη <b>μοναξιά</b>: η πόλη είναι μέρος της ταυτότητας του αφηγητή.` }
  ]
},
/* ───────────────────────────── 4.1 ───────────────────────────── */
{
  id: "4.1", unit: 4, title: "Μίλτος Σαχτούρης, «Ο ελεγκτής»: μεταπολεμική αγωνία, υπερρεαλισμός, ποίηση ποιητικής",
  book: "ΝΕ. ΛΟΓ. Γ΄, σ. 78 · Πλαίσιο Μάθησης, Β΄ τετράμηνο, Κείμενο 9",
  intro: "Ποιος είναι ο ελεγκτής του τίτλου στο ποίημα του Σαχτούρη και τι σημαίνουν οι εικόνες του αιματοβαμμένου ουρανού, των πουλιών και των τραυματισμένων φτερών;",
  thumb: LETTER("Φτερά"),
  theory: R`
<p>Ο <b>Μίλτος Σαχτούρης</b> (1919–2005) είναι από τους πιο ιδιότυπους ποιητές της <b>Α΄ μεταπολεμικής γενιάς</b>. Η ποίησή του, με <b>παράδοξες, εφιαλτικές εικόνες</b> που θυμίζουν τον <b>υπερρεαλισμό</b>, εκφράζει την εμπειρία του πολέμου, την υπαρξιακή αγωνία και την αίσθηση της καταστροφής. Το σύντομο ποίημα <b>«Ο ελεγκτής»</b> είναι <b>ποίημα ποιητικής</b>: μιλά για τον ρόλο και την αποστολή του ποιητή μέσα σε έναν πληγωμένο κόσμο. <span class="muted">Το ποίημα δεν αναδημοσιεύεται εδώ· διάβασέ το στο ΝΕ. ΛΟΓ. Γ΄.</span></p>
<div class="tbox def"><h4>Το ποίημα σε συντομία (με δικά μας λόγια)</h4>
<p>Ένα ποιητικό «εγώ» μιλά για ένα <b>χρέος</b> που δεν μπορεί να αποφύγει: να επιθεωρεί τον έναστρο ουρανό, παρότι ο ουρανός έχει πάρει το χρώμα του αίματος. Το χρέος αυτό διατυπώνεται ξανά και ξανά με ρήματα υποχρέωσης. Ο ομιλητής αισθάνεται ότι έχει παραλάβει μια <b>κληρονομιά από τα πουλιά</b> και ότι οφείλει να συνεχίσει το πέταγμα, ακόμη κι αν τα φτερά του έχουν τραυματιστεί. Το κόκκινο του αίματος συγκρούεται με μια εικόνα λευκότητας.</p></div>
<div class="tbox thm"><h4>Σύμβολα και ερμηνεία</h4>
<table class="tbl"><tr><th>Σύμβολο / εικόνα</th><th>Σημασία</th></tr>
<tr><td>Ο ελεγκτής του τίτλου</td><td>Ο ποιητής ως επόπτης, άγρυπνος και υπεύθυνος απέναντι στον κόσμο</td></tr>
<tr><td>Ο αιματοβαμμένος ουρανός</td><td>Ο κόσμος μετά τον πόλεμο: ακόμη και το ιδανικό είναι ματωμένο</td></tr>
<tr><td>Τα αστέρια</td><td>Οι αξίες, τα ιδανικά, η ομορφιά που χρειάζεται επιτήρηση και διάσωση</td></tr>
<tr><td>Τα πουλιά και η κληρονομιά τους</td><td>Η ποίηση, η ελευθερία· ο ποιητής ως συνεχιστής μιας παράδοσης</td></tr>
<tr><td>Τα τραυματισμένα φτερά</td><td>Ο τραυματισμένος ποιητής που επιμένει να δημιουργεί — αντίσταση</td></tr>
<tr><td>Κόκκινο του αίματος ↔ λευκότητα</td><td>Αντίθεση βίας και αγνότητας, θανάτου και καθαρότητας</td></tr></table></div>
<div class="tbox def"><h4>Εκφραστικά μέσα, μορφή, ρεύμα</h4>
<ul><li><b>Μεταφορά</b> (ο ουρανός ως χώρος βαμμένος με αίμα), <b>σύμβολα</b>, <b>αντίθεση</b> χρωμάτων, <b>επανάληψη</b> της ρηματικής έκφρασης της υποχρέωσης, <b>α΄ πρόσωπο</b>, <b>ελεύθερος στίχος</b>, λιτό και <b>αποσπασματικό</b> ύφος.</li>
<li><b>Υπερρεαλιστικά στοιχεία</b>: παράδοξες εικόνες, απρόσμενοι συνδυασμοί, κυριαρχία της φαντασίας — εκφράζουν τον ψυχικό κόσμο και τη μεταπολεμική πραγματικότητα.</li>
<li><b>Μοντερνισμός</b>: πολυσημία, συμβολικός λόγος, υπαινικτικό και πολυεπίπεδο νόημα.</li>
<li><b>Μεταπολεμικά γνωρίσματα</b>: εμπειρία του πολέμου, υπαρξιακή αγωνία, καταστροφή, διάψευση — και η <b>ευθύνη</b> που αναλαμβάνει το ποιητικό υποκείμενο.</li></ul>
<p><b>Λειτουργία</b>: τα μέσα αναδεικνύουν τη μεταπολεμική αγωνία, την ευθύνη του ποιητή και την ανάγκη για αντίσταση.</p></div>
<div class="tbox rem"><h4>Διακειμενικότητα</h4>
<p>Το Πλαίσιο προτείνει σύγκριση με τον «Άλμπατρο» του <b>Μπωντλαίρ</b> (ο ποιητής ως μεγάλο θαλασσοπούλι, αδέξιο και περιγελασμένο όταν το πιάνουν οι ναύτες) και με ποιήματα του <b>Κ. Γ. Καρυωτάκη</b> για τη μοίρα του ποιητή: το πουλί και τα τραυματισμένα φτερά ως εικόνες του ποιητή και της σχέσης του με την κοινωνία.</p></div>
<div class="tbox ex"><h4>Τύπος ερώτησης</h4>
<p>«Να ερμηνεύσετε τον ρόλο που αναλαμβάνει το ποιητικό υποκείμενο, όπως δηλώνεται και στον τίτλο.»</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p>Το ποιητικό υποκείμενο (α΄ πρόσωπο) αναλαμβάνει τον ρόλο του <b>επόπτη των άστρων</b>: έχει το χρέος να επιβλέπει και να διαφυλάσσει τις αξίες και τα ιδανικά, ακόμη κι όταν ο ουρανός — ο κόσμος των ιδανικών — έχει βαφτεί με το αίμα του πολέμου. Η επανάληψη των εκφράσεων υποχρέωσης δείχνει ότι πρόκειται για <b>ηθική υποχρέωση</b>, όχι για επιλογή. Ως συνεχιστής της κληρονομιάς των πουλιών, συνεχίζει την αποστολή της ποίησης και οφείλει να πετά ακόμη και με τραυματισμένα φτερά: ο ποιητής, πληγωμένος από την εποχή, <b>αντιστέκεται</b> δημιουργώντας. Έτσι το ποίημα γίνεται ποίημα ποιητικής για την ευθύνη του ποιητή στον μεταπολεμικό κόσμο.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Κυριολεκτική ανάγνωση του τίτλου (σαν να πρόκειται για επάγγελμα).</li>
<li>Αναφορά σε «υπερρεαλισμό» χωρίς να εξηγείται τι εκφράζουν οι παράδοξες εικόνες.</li>
<li>Παράλειψη της επανάληψης των εκφράσεων υποχρέωσης, που δηλώνουν χρέος.</li></ul></div>
`,
  widget: "nc1elegktis",
  gen: "nc1gTech",
  exercises: [
    { level: 1, shuffle: true, type: "mc", q: R`Σε ποια γενιά ανήκει ο Μίλτος Σαχτούρης;`, options: ["Στην Α΄ μεταπολεμική γενιά", "Στη Γενιά του ’30", "Στη Γενιά του 1880", "Στην Επτανησιακή Σχολή"], correct: 0,
      hint: R`Σκέψου πότε εμφανίστηκε ως ποιητής και ποια εμπειρία εκφράζει.`, sol: R`<b>Α΄ μεταπολεμική γενιά</b>, με έντονα υπερρεαλιστικά στοιχεία.` },
    { level: 1, shuffle: true, type: "mc", q: R`Σε ποιο πρόσωπο μιλά το ποιητικό υποκείμενο στον «Ελεγκτή»;`, options: ["Α΄ ενικό", "Γ΄ ενικό", "Β΄ πληθυντικό", "Α΄ πληθυντικό"], correct: 0,
      hint: R`Ποιος αναλαμβάνει το χρέος του τίτλου;`, sol: R`<b>Α΄ ενικό</b>: ο ποιητής μιλά για το δικό του χρέος.` },
    { level: 1, shuffle: true, type: "mc", q: R`Τι δηλώνει η επίμονη επανάληψη εκφράσεων υποχρέωσης στον «Ελεγκτή»;`, options: ["Ότι το χρέος του ποιητή είναι ηθική υποχρέωση που δεν μπορεί να αποφύγει", "Ότι ο ποιητής βαριέται τη δουλειά του", "Ότι ο ποιητής δίνει εντολές στους αναγνώστες", "Ότι το ποίημα είναι νομικό κείμενο"], correct: 0,
      hint: R`Η επανάληψη τονίζει κάτι — τι;`, sol: R`Η επανάληψη τονίζει την <b>ηθική υποχρέωση</b> και την ευθύνη του ποιητή.` },
    { level: 2, shuffle: true, type: "mc", q: R`Τι συμβολίζουν τα τραυματισμένα φτερά με τα οποία ο ποιητής οφείλει να συνεχίσει να πετά;`, options: ["Τον τραυματισμένο ποιητή που επιμένει να δημιουργεί και να αντιστέκεται", "Έναν τραυματισμό σε αεροπορικό ατύχημα", "Την εγκατάλειψη της ποίησης", "Την ευτυχία της νεότητας"], correct: 0,
      hint: R`Τα πουλιά = ποίηση.`, sol: R`Ο ποιητής, <b>πληγωμένος</b> από την εποχή, συνεχίζει να πετά: αντίσταση μέσα από τη δημιουργία.` },
    { level: 2, shuffle: true, type: "mc", q: R`Η εικόνα του ουρανού βαμμένου με αίμα είναι κυρίως:`, options: ["μεταφορά με υπερρεαλιστικό χαρακτήρα, που αποδίδει τον ματωμένο μεταπολεμικό κόσμο", "παρομοίωση με «σαν»", "ρητορική ερώτηση", "κοσμητικό επίθετο"], correct: 0,
      hint: R`Άμεση ταύτιση, παράδοξη εικόνα.`, sol: R`<b>Μεταφορά</b> με παράδοξο, υπερρεαλιστικό χαρακτήρα: ακόμη και ο ουρανός των ιδανικών είναι ματωμένος.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποια αντίθεση εντοπίζουν οι δείκτες στο ποίημα;`, options: ["Το κόκκινο του αίματος απέναντι στη λευκότητα", "Μέρα – νύχτα", "Πλούσιοι – φτωχοί", "Χωριό – πόλη"], correct: 0,
      hint: R`Σκέψου τα χρώματα των εικόνων.`, sol: R`Το <b>κόκκινο του αίματος ↔ η λευκότητα</b>: βία ↔ αγνότητα.` },
    { level: 2, type: "mc", q: R`«Ο ελεγκτής» είναι ποίημα ποιητικής.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Μιλά για τον ρόλο του ποιητή;`, sol: R`<b>ΣΩΣΤΟ.</b> Προβάλλει τον ρόλο και την αποστολή του ποιητή μέσα στον κόσμο.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποιο ποίημα της ευρωπαϊκής λογοτεχνίας προτείνει το Πλαίσιο για σύγκριση με τον «Ελεγκτή»;`, options: ["Ο «Άλμπατρος» του Σαρλ Μπωντλαίρ", "Το «Μανιφέστο του υπερρεαλισμού» του Μπρετόν", "Η «Έρημη χώρα» του Έλιοτ", "Το «Γράμμα σ’ ένα φίλο Γερμανό» του Καμύ"], correct: 0,
      hint: R`Ένα θαλασσοπούλι ως εικόνα του ποιητή.`, sol: R`Ο <b>«Άλμπατρος»</b> του Μπωντλαίρ: το πουλί-ποιητής, μεγαλειώδες στον ουρανό, αδέξιο ανάμεσα στους ανθρώπους.` },
    { level: 3, shuffle: true, type: "mc", q: R`Πώς συνδυάζονται στο ποίημα μεταπολεμικά και υπερρεαλιστικά στοιχεία;`, options: ["Η μεταπολεμική εμπειρία (καταστροφή, ευθύνη) εκφράζεται μέσα από παράδοξες, ονειρικές εικόνες", "Το ποίημα περιγράφει ρεαλιστικά μια μάχη", "Το ποίημα είναι έμμετρο σονέτο για τη φύση", "Τα δύο στοιχεία δεν συνδέονται"], correct: 0,
      hint: R`Περιεχόμενο + μέσα έκφρασης.`, sol: R`<b>Μεταπολεμικό περιεχόμενο</b> + <b>υπερρεαλιστικά μέσα</b>: οι παράδοξες εικόνες εκφράζουν τον ψυχικό κόσμο της εποχής.` }
  ]
},
/* ───────────────────────────── 4.2 ───────────────────────────── */
{
  id: "4.2", unit: 4, title: "Μανόλης Αναγνωστάκης, «Επίλογος»: τα όρια της ποίησης και η προσωπική ευθύνη",
  book: "ΝΕ. ΛΟΓ. Γ΄, σ. 81 · Πλαίσιο Μάθησης, Β΄ τετράμηνο, Κείμενο 10",
  intro: "Μπορεί η ποίηση να αλλάξει τον κόσμο; Τι απαντά ο Μανόλης Αναγνωστάκης στον «Επίλογο» και γιατί καλεί τον αναγνώστη σε αυτοκριτική;",
  thumb: LETTER("Επίλογος"),
  theory: R`
<p>Ο <b>Μανόλης Αναγνωστάκης</b> (1925–2005), ποιητής της Θεσσαλονίκης, γιατρός, με εμπειρία της Αντίστασης και των διώξεων του Εμφυλίου, είναι κεντρική μορφή της <b>Α΄ μεταπολεμικής γενιάς</b>. Ο <b>«Επίλογος»</b> κλείνει τη συλλογή <b>«Ο Στόχος» (1970)</b>, που γράφτηκε στα χρόνια της Δικτατορίας. Είναι <b>ποίημα ποιητικής</b>: στοχάζεται τη δύναμη, τα όρια και την αποστολή της ποίησης. <span class="muted">Το ποίημα δεν αναδημοσιεύεται εδώ· διάβασέ το στο ΝΕ. ΛΟΓ. Γ΄.</span></p>
<div class="tbox def"><h4>Το ποίημα σε συντομία (με δικά μας λόγια)</h4>
<p>Το ποιητικό υποκείμενο διαπιστώνει, χωρίς ψευδαισθήσεις, ότι η ποίηση της εποχής του δεν έχει τη δύναμη να κινητοποιήσει πλήθη ή να αλλάξει πολιτικά καθεστώτα. Οι στίχοι παρουσιάζονται σαν αδύναμο φως μέσα σε θολή ατμόσφαιρα: το πολύ να στείλουν ένα ελάχιστο σημάδι ότι ο άνθρωπος είναι ακόμη <b>ζωντανός</b> — σαν μια σύντομη ταχυδρομική κάρτα. Ο ομιλητής ενσωματώνει λόγια του ποιητή <b>Τίτου Πατρίκιου</b>, με τον οποίο συνομιλεί, απορρίπτει ρητά τις <b>αυταπάτες</b> και κλείνει με μια αποφθεγματική προτροπή για <b>αυτοκριτική</b>: όποιος κρίνει τους άλλους πρέπει να δεχτεί να κριθεί κι ο ίδιος.</p></div>
<div class="tbox thm"><h4>Ποιητικό υποκείμενο και μήνυμα</h4>
<ul><li>Διακρίνεται από τον δημιουργό· είναι η φωνή που <b>προβληματίζεται</b> για τον ρόλο της ποίησης και του ποιητή στη σύγχρονη κοινωνία.</li>
<li>Στάση: <b>απόρριψη των αυταπατών</b>, <b>ειλικρίνεια</b>, <b>αυτοκριτική</b>, <b>προσωπική ευθύνη</b> ως στάση ζωής.</li>
<li>Η ποίηση <b>δεν ανατρέπει καθεστώτα</b>, αλλά διατηρεί την <b>ηθική ευθύνη</b> και την <b>ανθρώπινη μαρτυρία</b>.</li>
<li>Αξίες: αυτοκριτική, ειλικρίνεια, υπευθυνότητα, συνέπεια λόγων και πράξεων — ο ενεργός, δημοκρατικός πολίτης.</li></ul></div>
<div class="tbox def"><h4>Σύμβολα, εκφραστικά μέσα, μορφή</h4>
<ul><li><b>Μεταφορά</b>: οι στίχοι ως αμυδρό φως που χάνεται μέσα στη θολούρα (αδύναμη επικοινωνία μέσα στη σύγχυση).</li>
<li><b>Σύμβολα</b>: η θολή ατμόσφαιρα (σύγχυση, δυσκολία επικοινωνίας), η ταχυδρομική κάρτα (ελάχιστο μήνυμα παρουσίας), η εικόνα του τραυματισμένου, ανάπηρου ανθρώπου, η δήλωση ότι κάποιος είναι ζωντανός.</li>
<li><b>Επανάληψη</b>, <b>προστακτικές</b> που απευθύνονται στον αναγνώστη, <b>άμεσος λόγος</b> (παράθεση των λόγων του Πατρίκιου).</li>
<li><b>Ελεύθερος στίχος</b>, <b>λιτό καθημερινό λεξιλόγιο</b>, <b>αποφθεγματικός</b> λόγος.</li></ul>
<p><b>Μορφή–περιεχόμενο</b>: η λιτή, αντιρητορική μορφή αποδίδει με αμεσότητα τον προβληματισμό για τα όρια της ποίησης και το μήνυμα της προσωπικής ευθύνης — ένα ποίημα που απορρίπτει τις μεγαλοστομίες δεν θα μπορούσε να είναι ρητορικό.</p></div>
<div class="tbox rem"><h4>Διακειμενικότητα</h4>
<p>Το Πλαίσιο προτείνει συγκριτική μελέτη με το ποίημα «Στίχοι 2» του <b>Τίτου Πατρίκιου</b> — οι δύο ποιητές διαλέγονται για τον ρόλο, τη δύναμη και τα όρια της ποίησης — και συζήτηση με θέμα «Μπορεί η ποίηση να αλλάξει τον κόσμο;».</p></div>
<div class="tbox ex"><h4>Τύπος ερώτησης</h4>
<p>«Να σχολιάσετε τη στάση του ποιητικού υποκειμένου απέναντι στη δύναμη της ποίησης.»</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p>Το ποιητικό υποκείμενο έχει <b>ρεαλιστική, αντιρητορική</b> στάση: δηλώνει ότι η ποίηση σήμερα δεν κινητοποιεί τις μάζες ούτε ανατρέπει καθεστώτα — απορρίπτει τις αυταπάτες για την πολιτική της δύναμη. Δεν καταλήγει όμως σε απόρριψη της ποίησης: οι στίχοι, σαν αμυδρό φως μέσα στη θολούρα, μπορούν τουλάχιστον να δηλώσουν ότι ο άνθρωπος είναι <b>ζωντανός</b> και αντιστέκεται, μια μικρή αλλά πολύτιμη <b>μαρτυρία</b>. Η αποφθεγματική κατακλείδα μεταφέρει το βάρος από την ποίηση στον άνθρωπο: καλεί σε <b>αυτοκριτική</b> και <b>προσωπική ευθύνη</b>. Η λιτή, καθημερινή γλώσσα και οι προστακτικές δίνουν στον λόγο αμεσότητα και ηθικό κύρος.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>«Ο Αναγνωστάκης λέει ότι η ποίηση είναι άχρηστη» — λέει ότι έχει <b>όρια</b>, όχι ότι είναι άχρηστη.</li>
<li>Παράλειψη του ιστορικού πλαισίου (Δικτατορία, μεταπολεμική απογοήτευση).</li>
<li>Μη αναφορά στη συνομιλία με τον Πατρίκιο, όταν ζητείται ο «άμεσος λόγος».</li></ul></div>
`,
  widget: "nc1anag",
  gen: "nc1gMove",
  exercises: [
    { level: 1, shuffle: true, type: "mc", q: R`Ποια συλλογή κλείνει ο «Επίλογος» του Αναγνωστάκη;`, options: ["«Ο Στόχος» (1970)", "«Εποχές»", "«Έλευσις» (1948)", "«Στροφή» (1931)"], correct: 0,
      hint: R`Η συλλογή γράφτηκε στη Δικτατορία.`, sol: R`<b>«Ο Στόχος» (1970)</b>.` },
    { level: 1, q: R`Ποιος ποιητής (επώνυμο) παρατίθεται σε άμεσο λόγο στον «Επίλογο» και συνομιλεί με τον Αναγνωστάκη;`, fields: [{ label: "Επώνυμο:", ans: ["Πατρίκιος", "Τίτος Πατρίκιος", "Τ. Πατρίκιος", "Πατρικιος"], text: true, nopunct: true }],
      hint: R`Είναι ποιητής της ίδιας γενιάς· η ενότητα 2.2 τον αναφέρει δίπλα στον Αναγνωστάκη.`, sol: R`Ο <b>Τίτος Πατρίκιος</b> («Στίχοι 2»).` },
    { level: 1, type: "mc", q: R`Σύμφωνα με τον «Επίλογο», η ποίηση σήμερα μπορεί να ανατρέψει καθεστώτα.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ποια είναι τα όρια της ποίησης κατά το ποίημα;`, sol: R`<b>ΛΑΘΟΣ.</b> Το ποίημα δηλώνει ρητά ότι η ποίηση <b>δεν</b> ανατρέπει καθεστώτα ούτε κινητοποιεί τις μάζες.` },
    { level: 2, shuffle: true, type: "mc", q: R`Οι στίχοι παρουσιάζονται σαν αμυδρό φως μέσα σε θολή ατμόσφαιρα. Τι συμβολίζει η θολή ατμόσφαιρα;`, options: ["Τη σύγχυση και τη δυσκολία επικοινωνίας της εποχής", "Την ευτυχία και την ηρεμία", "Το ταξίδι στη θάλασσα", "Τη θρησκευτική πίστη"], correct: 0,
      hint: R`Τι παθαίνει το φως μέσα στη θολούρα;`, sol: R`Η θολούρα = <b>σύγχυση, δυσκολία επικοινωνίας</b>· το φως της ποίησης είναι αδύναμο, αλλά υπάρχει.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποια αξία προβάλλει κυρίως η αποφθεγματική κατακλείδα του ποιήματος;`, options: ["Την αυτοκριτική και την προσωπική ευθύνη", "Τον πλούτο και την επιτυχία", "Την εκδίκηση", "Την αδιαφορία για την κοινωνία"], correct: 0,
      hint: R`Ποιον καλεί να κριθεί η κατακλείδα;`, sol: R`<b>Αυτοκριτική και προσωπική ευθύνη</b>: ο ενεργός, υπεύθυνος πολίτης.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποιο γλωσσικό-υφολογικό γνώρισμα ΔΕΝ ταιριάζει στον «Επίλογο»;`, options: ["Πομπώδης, ρητορική γλώσσα με πολλά κοσμητικά επίθετα", "Λιτό, καθημερινό λεξιλόγιο", "Αποφθεγματικός λόγος", "Ελεύθερος στίχος"], correct: 0,
      hint: R`Το ποίημα απορρίπτει τις μεγαλοστομίες.`, sol: R`Ο «Επίλογος» είναι <b>αντιρητορικός</b>: λιτός, καθημερινός, αποφθεγματικός.` },
    { level: 2, shuffle: true, type: "mc", q: R`Τι λειτουργία έχουν οι προστακτικές στο ποίημα;`, options: ["Απευθύνονται άμεσα στον αναγνώστη και τον καλούν σε στάση ευθύνης", "Περιγράφουν ένα τοπίο", "Δηλώνουν το παρελθόν του ποιητή", "Δημιουργούν κωμικό τόνο"], correct: 0,
      hint: R`Σε ποιον μιλά ο ποιητής;`, sol: R`Οι προστακτικές δίνουν <b>αμεσότητα</b> και μετατρέπουν το ποίημα σε <b>ηθική προτροπή</b>.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποια διατύπωση αποδίδει σωστά τη θέση του «Επιλόγου» για την ποίηση;`, options: ["Η ποίηση δεν έχει πολιτική δύναμη, αλλά κρατά την ηθική ευθύνη και τη μαρτυρία ότι ο άνθρωπος ζει", "Η ποίηση είναι εντελώς άχρηστη και πρέπει να εγκαταλειφθεί", "Η ποίηση είναι το πιο ισχυρό όπλο για την ανατροπή καθεστώτων", "Η ποίηση αφορά μόνο τον έρωτα"], correct: 0,
      hint: R`Όρια ≠ αχρηστία.`, sol: R`Ρεαλιστική εκτίμηση: <b>όρια</b> στην κοινωνική δύναμη, αλλά <b>ηθική αξία</b> και μαρτυρία.` },
    { level: 3, shuffle: true, type: "mc", q: R`Πώς σχετίζεται η λιτή μορφή του ποιήματος με το περιεχόμενό του;`, options: ["Η αντιρητορική μορφή αποδίδει με αμεσότητα την απόρριψη των αυταπατών και το μήνυμα της ευθύνης", "Η μορφή δεν σχετίζεται με το περιεχόμενο", "Η λιτή μορφή κάνει το ποίημα αστείο", "Η λιτή μορφή κρύβει το νόημα από τον αναγνώστη"], correct: 0,
      hint: R`Ένα ποίημα κατά των μεγαλοστομιών…`, sol: R`Η <b>λιτότητα</b> της μορφής είναι συνεπής με το μήνυμα: ειλικρίνεια χωρίς αυταπάτες.` }
  ]
},
/* ───────────────────────────── 4.3 ───────────────────────────── */
{
  id: "4.3", unit: 4, title: "Νίκος Εγγονόπουλος, «Ποίηση 1948»: η ποίηση στα χρόνια του Εμφυλίου",
  book: "ΝΕ. ΛΟΓ. Γ΄, σ. 84 · Πλαίσιο Μάθησης, Β΄ τετράμηνο, Κείμενο 11",
  intro: "Έχει θέση η ποίηση σε εποχή εμφύλιου σπαραγμού; Πώς απαντά ο Νίκος Εγγονόπουλος στο «Ποίηση 1948» και τι σημαίνει η «σπασμένη» τυπογραφική μορφή του;",
  thumb: LETTER("1948"),
  theory: R`
<p>Ο <b>Νίκος Εγγονόπουλος</b> (1907–1985), ποιητής και ζωγράφος, είναι μαζί με τον Ανδρέα Εμπειρίκο ο σημαντικότερος εκπρόσωπος του <b>ελληνικού υπερρεαλισμού</b> και μέλος της <b>Γενιάς του ’30</b>· γνωστότερο έργο του ο «Μπολιβάρ» (1944). Το «Ποίηση 1948» γράφτηκε στην καρδιά του <b>Εμφυλίου Πολέμου</b> (1946–1949) και περιλαμβάνεται στη συλλογή «Έλευσις» (1948). Είναι <b>ποίημα ποιητικής</b>: ο ποιητής αναρωτιέται αν μπορεί να υπάρξει ποίηση σε μια εποχή βίας. <span class="muted">Το ποίημα δεν αναδημοσιεύεται εδώ· διάβασέ το στο ΝΕ. ΛΟΓ. Γ΄.</span></p>
<div class="tbox def"><h4>Το ποίημα σε συντομία (με δικά μας λόγια)</h4>
<p>Ο ποιητής δηλώνει, με επανάληψη, ότι η εποχή του εμφύλιου σπαραγμού δεν είναι εποχή για ποίηση. Ό,τι γράφεται μοιάζει να γράφεται στην <b>πίσω πλευρά αγγελτηρίων θανάτου</b>· τα ποιήματα είναι πικραμένα. Η διάταξη των στίχων «σπάει»: εμφανίζονται <b>μονολεκτικοί στίχοι</b> και <b>παρενθέσεις</b>, σαν η ίδια η γραφή να δυσκολεύεται να προχωρήσει.</p></div>
<div class="tbox thm"><h4>Ποιητικό υποκείμενο, εικόνες, σημασίες</h4>
<ul><li>Το ποιητικό υποκείμενο (διακριτό από τον δημιουργό) εκφράζει <b>προσωπική αγωνία</b> για τον ρόλο της ποίησης σε εποχή βίας· παρουσιάζει την ποίηση ως <b>πράξη δύσκολη και επώδυνη</b>.</li>
<li><b>Ο σπαραγμός του Εμφυλίου</b>: το έθνος διχάζεται βίαια — βία, διχασμός, θάνατος.</li>
<li><b>Τα αγγελτήρια θανάτου</b>: τολμηρή, υπερρεαλιστική μεταφορά — η ποίηση έχει γίνει πένθος.</li>
<li><b>Τα πικραμένα ποιήματα</b>: η ποίηση δεν μπορεί να είναι ανέμελη· διαπερνάται από πίκρα.</li>
<li>Ο ποιητής ως <b>μάρτυρας της εποχής του</b>: καταγράφει την ιστορική εμπειρία.</li></ul></div>
<div class="tbox def"><h4>Εκφραστικά μέσα και μορφή</h4>
<ul><li><b>Μεταφορά</b> (αγγελτήρια θανάτου), <b>επανάληψη</b> (ότι δεν είναι η εποχή…), <b>παρένθεση</b>, <b>ελεύθερος στίχος</b>, λιτό καθημερινό λεξιλόγιο.</li>
<li><b>Αποσπασματική διάταξη</b> και <b>μονολεκτικοί στίχοι</b>: έμφαση μέσω της τυπογραφίας.</li>
<li><b>Γενιά του ’30 / υπερρεαλισμός</b>: ελεύθερος στίχος, λιτή έκφραση, συνειρμική ανάπτυξη, εξομολογητικός τόνος, απρόσμενοι συνειρμοί και τολμηρή μεταφορά.</li></ul>
<p><b>Λειτουργία</b>: η «σπασμένη» μορφή αποδίδει την <b>ψυχική ένταση</b>, την <b>αίσθηση διάλυσης</b> που προκαλεί ο Εμφύλιος και τη <b>δυσκολία της ποιητικής δημιουργίας</b>· η επανάληψη και η πίκρα δημιουργούν δραματική ατμόσφαιρα.</p></div>
<div class="tbox rem"><h4>Αξίες και διακειμενικότητα</h4>
<p>Το ποίημα προβάλλει την <b>ειρήνη</b>, την <b>ιστορική μνήμη</b>, την ευθύνη του πνευματικού ανθρώπου, τον σεβασμό στην ανθρώπινη ζωή και την αποδοκιμασία της βίας και του διχασμού. Το Πλαίσιο προτείνει σύγκριση με το ποίημα του Μανόλη Αναγνωστάκη «Στον Νίκο Ε… 1949», που απαντά στον Εγγονόπουλο: διάλογος δύο ποιητών για την ποίηση στον Εμφύλιο.</p></div>
<div class="tbox ex"><h4>Τύπος ερώτησης</h4>
<p>«Να εξηγήσετε πώς η μορφή του ποιήματος συνδέεται με το περιεχόμενό του.»</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p>Το ποίημα είναι σε <b>ελεύθερο στίχο</b>, με <b>μονολεκτικούς στίχους</b>, <b>παρενθέσεις</b> και ασυνήθιστη, «σπασμένη» τυπογραφική διάταξη. Η αποσπασματική αυτή μορφή <b>μιμείται τη διάλυση</b> που φέρνει ο Εμφύλιος: όπως το έθνος διχάζεται, έτσι και ο λόγος κομματιάζεται· ο αναγνώστης «σκοντάφτει» στους μονολεκτικούς στίχους, όπως ο ποιητής δυσκολεύεται να γράψει. Η <b>επανάληψη</b> ότι η εποχή δεν είναι για ποίηση εντείνει την απελπισία, ενώ οι <b>παρενθέσεις</b> δίνουν χαμηλόφωνο, εξομολογητικό τόνο. Έτσι η μορφή υπηρετεί το περιεχόμενο: την ψυχική ένταση, την πίκρα και τη δυσκολία της ποιητικής δημιουργίας σε εποχή βίας.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Σύγχυση του Εμφυλίου (1946–1949) με την Κατοχή ή τον Β΄ Παγκόσμιο.</li>
<li>«Ο ποιητής σταματά να γράφει» — γράφει, και ακριβώς αυτή η αντίφαση είναι το θέμα.</li>
<li>Αναφορά στη μορφή χωρίς σύνδεση με το νόημα.</li></ul></div>
`,
  widget: "nc1engo",
  gen: "nc1gTech",
  exercises: [
    { level: 1, shuffle: true, type: "mc", q: R`Σε ποιο ιστορικό πλαίσιο γράφτηκε το «Ποίηση 1948»;`, options: ["Στον Εμφύλιο Πόλεμο", "Στη Μικρασιατική Καταστροφή", "Στη γερμανική κατοχή της Γαλλίας", "Στην τουρκική εισβολή στην Κύπρο"], correct: 0,
      hint: R`Ο τίτλος δίνει τη χρονολογία.`, sol: R`Στον <b>Εμφύλιο Πόλεμο</b> (1946–1949).` },
    { level: 1, shuffle: true, type: "mc", q: R`Σε ποιο ρεύμα εντάσσεται κυρίως ο Νίκος Εγγονόπουλος;`, options: ["Στον υπερρεαλισμό (Γενιά του ’30)", "Στον ρομαντισμό", "Στη δημοτική ποίηση", "Στον νατουραλισμό"], correct: 0,
      hint: R`Μαζί με τον Εμπειρίκο.`, sol: R`<b>Υπερρεαλισμός</b> — Γενιά του ’30.` },
    { level: 1, q: R`Εκτός από ποιητής, τι άλλο ήταν ο Εγγονόπουλος; (μία λέξη)`, fields: [{ label: "Ιδιότητα:", ans: ["ζωγράφος", "ζωγραφος", "εικαστικός", "εικαστικος", "σκηνογράφος", "σκηνογραφος"], text: true }],
      hint: R`Καλές τέχνες.`, sol: R`<b>Ζωγράφος</b>.` },
    { level: 2, shuffle: true, type: "mc", q: R`Η εικόνα των ποιημάτων που μοιάζουν γραμμένα στην πίσω πλευρά αγγελτηρίων θανάτου λειτουργεί ως:`, options: ["Τολμηρή μεταφορά που δείχνει ότι η ποίηση έχει γίνει πένθος", "Ρεαλιστική περιγραφή του γραφείου του ποιητή", "Χιουμοριστική λεπτομέρεια", "Ιστορική πληροφορία για τα τυπογραφεία"], correct: 0,
      hint: R`Τι αναγγέλλει ένα αγγελτήριο θανάτου;`, sol: R`<b>Μεταφορά</b> (με υπερρεαλιστική τόλμη): η ποίηση του Εμφυλίου είναι <b>θρήνος</b>.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποια είναι η λειτουργία των μονολεκτικών στίχων και της «σπασμένης» διάταξης;`, options: ["Αποδίδουν την ψυχική ένταση, τη διάλυση και τη δυσκολία της γραφής", "Κάνουν το ποίημα πιο εύκολο στην απομνημόνευση", "Δείχνουν ότι το ποίημα είναι δημοτικό τραγούδι", "Δεν έχουν καμία λειτουργία"], correct: 0,
      hint: R`Η μορφή μιμείται το περιεχόμενο.`, sol: R`Η αποσπασματικότητα <b>μιμείται τη διάλυση</b> του Εμφυλίου και τη δυσκολία δημιουργίας.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποια λειτουργία έχει η παρένθεση στο ποίημα;`, options: ["Δίνει χαμηλόφωνο, εξομολογητικό σχόλιο", "Εισάγει διάλογο με άλλο πρόσωπο", "Δίνει τη μετάφραση μιας ξένης λέξης", "Δηλώνει τον τίτλο της συλλογής"], correct: 0,
      hint: R`Σαν ο ποιητής να μιλά στον εαυτό του.`, sol: R`Η παρένθεση δίνει <b>εξομολογητικό, χαμηλόφωνο</b> τόνο.` },
    { level: 2, shuffle: true, type: "mc", q: R`Με ποιο ποίημα του Αναγνωστάκη προτείνει το Πλαίσιο να συγκριθεί το «Ποίηση 1948»;`, options: ["«Στον Νίκο Ε… 1949»", "«Επίλογος»", "«Ο Στόχος»", "«Θεσσαλονίκη, Μέρες του 1969 μ.Χ.»"], correct: 0,
      hint: R`Το ποίημα απευθύνεται στον ίδιο τον Εγγονόπουλο.`, sol: R`Το <b>«Στον Νίκο Ε… 1949»</b>: ο Αναγνωστάκης απαντά στον Εγγονόπουλο.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποια είναι η αντίφαση πάνω στην οποία στηρίζεται το ποίημα;`, options: ["Ο ποιητής δηλώνει ότι η εποχή δεν είναι για ποίηση — και ταυτόχρονα γράφει ποίημα γι’ αυτό", "Ο ποιητής αγαπά και μισεί τη ζωγραφική", "Ο ποιητής ζει στην Αθήνα αλλά γράφει για τη Θεσσαλονίκη", "Ο ποιητής γράφει έμμετρα αλλά δηλώνει ότι γράφει ελεύθερα"], correct: 0,
      hint: R`Τι κρατάμε στα χέρια μας διαβάζοντάς το;`, sol: R`Η ίδια η ύπαρξη του ποιήματος <b>διαψεύδει και επιβεβαιώνει</b> τη διαπίστωση: η ποίηση γίνεται μαρτυρία μέσα στη βία.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποιες αξίες προβάλλονται στο ποίημα, κατά το Πλαίσιο;`, options: ["Ειρήνη, ιστορική μνήμη, ευθύνη του πνευματικού ανθρώπου, σεβασμός στην ανθρώπινη ζωή", "Πλούτος, φήμη, κοινωνική άνοδος", "Στρατιωτική δόξα και εκδίκηση", "Αδιαφορία για την πολιτική"], correct: 0,
      hint: R`Αποδοκιμασία της βίας και του διχασμού.`, sol: R`<b>Ειρήνη, μνήμη, ευθύνη, σεβασμός στη ζωή</b> — αποδοκιμασία της βίας.` }
  ]
},
/* ───────────────────────────── 4.4 ───────────────────────────── */
{
  id: "4.4", unit: 4, title: "Κώστας Μόντης, «Όλοι εμείς που γράφουμε στίχους»: η οικουμενική αδελφότητα των ποιητών",
  book: "Πλαίσιο Μάθησης, Β΄ τετράμηνο, Κείμενο 12 (Κυπριακή λογοτεχνία)",
  intro: "Ποιοι είναι οι «όλοι εμείς» του Κώστα Μόντη και τι λέει το ποίημα για τον ρόλο και την αποστολή των ποιητών κάθε εποχής;",
  thumb: LETTER("εμείς"),
  theory: R`
<p>Ο <b>Κώστας Μόντης</b> (Αμμόχωστος 1914 – Λευκωσία 2004) είναι από τους σημαντικότερους Κύπριους ποιητές του 20ού αιώνα — γνωστός ιδιαίτερα για τα «Γράμματα στη μητέρα» και τις σύντομες, αποφθεγματικές «Στιγμές» του. Η γραφή του συνδυάζει τον <b>μοντερνισμό</b> (ελεύθερος στίχος, καθημερινό λεξιλόγιο, σύμβολα) με μια φωνή απλή, τρυφερή και συχνά ειρωνική. Το ποίημα <b>«Όλοι εμείς που γράφουμε στίχους»</b> είναι <b>ποίημα ποιητικής</b>: ο ποιητής στοχάζεται τον ρόλο, την ευθύνη και την αποστολή των ποιητών. <span class="muted">Το ποίημα δεν αναδημοσιεύεται εδώ.</span></p>
<div class="tbox def"><h4>Το ποιητικό υποκείμενο: ένα συλλογικό «εμείς»</h4>
<p>Το ποιητικό υποκείμενο μιλά σε <b>α΄ πληθυντικό πρόσωπο</b> και εκπροσωπεί <b>συλλογικά όλους τους ποιητές</b>. Η επιλογή του «εμείς» εκφράζει <b>αλληλεγγύη</b>, <b>κοινή ευθύνη</b> και <b>κοινή αποστολή</b> των δημιουργών — σε αντίθεση με το προσωπικό «εγώ» άλλων ποιημάτων ποιητικής (π.χ. «Ο ελεγκτής»).</p></div>
<div class="tbox thm"><h4>Θέματα (με δικά μας λόγια)</h4>
<ul><li><b>Ισότητα</b> των ποιητών: πλούσιοι και φτωχοί, από ανεπτυγμένες και υπανάπτυκτες χώρες, όλοι ανήκουν στην ίδια οικογένεια — ανεξάρτητα από φυλή, τάξη ή βαθμό ανάπτυξης.</li>
<li><b>Διαχρονικότητα</b>: η αλυσίδα των ποιητών ξεκινά από την αρχαιότητα και την ομηρική παράδοση και φτάνει ως σήμερα· η ποίηση είναι συνεχής πράξη δημιουργίας.</li>
<li><b>Οικουμενικότητα</b>: η ποίηση υπερβαίνει εθνικά, κοινωνικά και ιστορικά όρια.</li>
<li><b>Αποστολή</b>: οι ποιητές νιώθουν και εκφράζουν τον πόνο του κόσμου, ελπίζουν, αντιστέκονται, αναζητούν την αλήθεια — παρά τις δυσκολίες και την έλλειψη αναγνώρισης.</li></ul></div>
<div class="tbox def"><h4>Εκφραστικά μέσα και σύμβολα</h4>
<ul><li><b>Επανάληψη</b> της φράσης του τίτλου: ενότητα, ρυθμός, επιμονή των ποιητών να δημιουργούν.</li>
<li><b>Αντιθέσεις</b> (πλούσιοι–φτωχοί, ανεπτυγμένοι–υπανάπτυκτοι): η ποίηση ενώνει ό,τι η κοινωνία χωρίζει.</li>
<li><b>Μεταφορές και σύμβολα</b>: η πληγή που διαπερνά τη Γη (ο πόνος του κόσμου), μια εικόνα πετάγματος στον αέρα, που δηλώνει τα όνειρα και τις ελπίδες (ανάταση), η εικόνα της σημαίας (σημαία αγώνα, ελευθερίας και ιδανικού).</li>
<li><b>Μοντερνιστικά στοιχεία</b>: ελεύθερος στίχος, απουσία ομοιοκαταληξίας, καθημερινό λεξιλόγιο, συμβολικές εικόνες.</li></ul>
<p><b>Λειτουργία</b>: αναδεικνύουν την ενότητα των ποιητών, την επιμονή τους και τη διαχρονική αξία της ποίησης.</p></div>
<div class="tbox rem"><h4>Αξίες και σύνδεση με άλλα ποιήματα</h4>
<p>Το ποίημα καλλιεργεί σεβασμό στην <b>ελευθερία της έκφρασης</b>, της δημιουργίας και της διαφορετικής άποψης, στην <b>ισότητα</b> και στην <b>ανθρώπινη αξιοπρέπεια</b>, και τη συνείδηση ότι η τέχνη μπορεί να συμβάλει στον διάλογο. Συνδέεται με την ελληνική ποιητική παράδοση ως μέρος της πολιτισμικής ταυτότητας. Το Πλαίσιο προτείνει σύγκριση με τα ποιήματα ποιητικής του Αναγνωστάκη («Επίλογος»), του Πατρίκιου («Στίχοι 2») και του Εγγονόπουλου («Ποίηση 1948»).</p></div>
<div class="tbox ex"><h4>Τύπος ερώτησης</h4>
<p>«Να ερμηνεύσετε την επιλογή του α΄ πληθυντικού προσώπου στο ποίημα.»</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p>Ο Μόντης δεν μιλά ως άτομο, αλλά ως <b>εκπρόσωπος όλων των ποιητών</b>. Το «εμείς» δημιουργεί ένα <b>συλλογικό ποιητικό υποκείμενο</b>, που εκφράζει <b>αλληλεγγύη</b> και <b>κοινή αποστολή</b>: οι ποιητές, ανεξάρτητα από χώρα, τάξη ή εποχή, συνδέονται με ένα κοινό χρέος — να εκφράζουν τον πόνο και την ελπίδα του κόσμου. Η επανάληψη του τίτλου ενισχύει αυτή την ενότητα. Σε αντίθεση με το προσωπικό, εξομολογητικό «εγώ» (π.χ. στον «Ελεγκτή» του Σαχτούρη), το «εμείς» δίνει στο ποίημα <b>οικουμενικό</b> χαρακτήρα και κάνει την άποψη για την ποίηση γενική, διαχρονική.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Ερμηνεία του «εμείς» ως «εγώ και ο αναγνώστης» — εδώ σημαίνει «όλοι οι ποιητές».</li>
<li>Παράλειψη της κυπριακής διάστασης και της σύνδεσης με την ευρύτερη λογοτεχνία, όταν ζητείται.</li>
<li>Αναφορά στις αντιθέσεις χωρίς να εξηγείται ότι δείχνουν την ισότητα των ποιητών.</li></ul></div>
`,
  widget: "nc1monti",
  gen: "nc1gMove",
  exercises: [
    { level: 1, shuffle: true, type: "mc", q: R`Σε ποιο ρηματικό πρόσωπο μιλά το ποιητικό υποκείμενο στο ποίημα του Μόντη;`, options: ["Α΄ πληθυντικό", "Α΄ ενικό", "Γ΄ ενικό", "Β΄ ενικό"], correct: 0,
      hint: R`Ποιους εκπροσωπεί ο ομιλητής — μόνο τον εαυτό του ή περισσότερους;`, sol: R`<b>Α΄ πληθυντικό</b> («εμείς»): συλλογικό ποιητικό υποκείμενο.` },
    { level: 1, q: R`Σε ποια πόλη γεννήθηκε ο Κώστας Μόντης;`, fields: [{ label: "Πόλη:", ans: ["Αμμόχωστος", "Αμμοχωστος", "Αμμόχωστο", "Αμμοχωστο", "Famagusta"], text: true }],
      hint: R`Η ίδια πόλη στην οποία είναι αφιερωμένη η «Αμμόχωστος Βασιλεύουσα» του Χαραλαμπίδη.`, sol: R`Στην <b>Αμμόχωστο</b> (1914)· πέθανε στη Λευκωσία (2004).` },
    { level: 1, type: "mc", q: R`Το ποίημα «Όλοι εμείς που γράφουμε στίχους» είναι ποίημα ποιητικής.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Για ποιους μιλά;`, sol: R`<b>ΣΩΣΤΟ.</b> Στοχάζεται τον ρόλο και την αποστολή των ποιητών.` },
    { level: 2, shuffle: true, type: "mc", q: R`Τι δείχνουν οι αντιθέσεις πλούσιοι–φτωχοί, ανεπτυγμένοι–υπανάπτυκτοι;`, options: ["Ότι όλοι οι ποιητές είναι ίσοι και ενωμένοι, ανεξάρτητα από τάξη και χώρα", "Ότι μόνο οι πλούσιοι μπορούν να γράφουν ποίηση", "Ότι οι ποιητές χωρίζονται σε αντίπαλες ομάδες", "Ότι η ποίηση αφορά μόνο την οικονομία"], correct: 0,
      hint: R`Η ποίηση ενώνει ό,τι η κοινωνία χωρίζει.`, sol: R`Οι αντιθέσεις τονίζουν την <b>ισότητα και την ενότητα</b> των ποιητών.` },
    { level: 2, shuffle: true, type: "mc", q: R`Τι δηλώνει η αναφορά σε ποιητές όλων των εποχών, από την ομηρική αρχαιότητα ως σήμερα;`, options: ["Τη διαχρονική συνέχεια της ποίησης", "Ότι ο Μόντης θαυμάζει μόνο την αρχαία ποίηση", "Ότι η σύγχρονη ποίηση δεν έχει αξία", "Ότι ο Όμηρος ήταν Κύπριος"], correct: 0,
      hint: R`Μια αλυσίδα που δεν σπάει.`, sol: R`<b>Διαχρονικότητα</b>: ο σημερινός ποιητής συνεχίζει μια αρχαία παράδοση.` },
    { level: 2, shuffle: true, type: "mc", q: R`Τι συμβολίζει η εικόνα της σημαίας (παντιέρας) των ποιητών;`, options: ["Την ποίηση ως πράξη αγώνα, αντίστασης και υπεράσπισης της ελευθερίας", "Τη στρατιωτική δύναμη", "Ένα ποδοσφαιρικό σωματείο", "Την παράδοση των ποιητών"], correct: 0,
      hint: R`Η σημαία ανεμίζει σε αγώνες.`, sol: R`Σύμβολο <b>αγώνα και ιδανικού</b>· η ποίηση ως αντίσταση.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποιο γνώρισμα του μοντερνισμού ΔΕΝ υπάρχει στο ποίημα, κατά τους δείκτες;`, options: ["Αυστηρή ομοιοκαταληξία", "Ελεύθερος στίχος", "Καθημερινό λεξιλόγιο", "Συμβολικές εικόνες"], correct: 0,
      hint: R`Οι δείκτες μιλούν για «απουσία ομοιοκαταληξίας».`, sol: R`Η <b>ομοιοκαταληξία</b> απουσιάζει· ο στίχος είναι ελεύθερος.` },
    { level: 3, shuffle: true, type: "mc", q: R`Πώς διαφέρει η φωνή του ποιήματος του Μόντη από τη φωνή του «Ελεγκτή» του Σαχτούρη;`, options: ["Ο Μόντης μιλά με συλλογικό «εμείς» για όλους τους ποιητές, ο Σαχτούρης με προσωπικό «εγώ» για το δικό του χρέος", "Και οι δύο μιλούν σε γ΄ πρόσωπο", "Ο Μόντης γράφει πεζό, ο Σαχτούρης θέατρο", "Δεν υπάρχει διαφορά"], correct: 0,
      hint: R`Ενικός ↔ πληθυντικός.`, sol: R`<b>Συλλογικό «εμείς»</b> (Μόντης, οικουμενικότητα) ↔ <b>προσωπικό «εγώ»</b> (Σαχτούρης, ατομική ευθύνη).` },
    { level: 3, shuffle: true, type: "mc", q: R`Πώς αντιλαμβάνεται το ποίημα την αποστολή των ποιητών;`, options: ["Ως διαχρονική πράξη δημιουργίας, αντίστασης και αναζήτησης της αλήθειας, παρά τις δυσκολίες και την έλλειψη αναγνώρισης", "Ως τρόπο να γίνουν διάσημοι και πλούσιοι", "Ως ψυχαγωγία χωρίς κοινωνικό ρόλο", "Ως υπηρεσία προς την εξουσία"], correct: 0,
      hint: R`Τι κάνουν οι ποιητές απέναντι στον πόνο του κόσμου;`, sol: R`Η ποίηση είναι <b>δημιουργία, αντίσταση, αναζήτηση της αλήθειας</b> — ακόμη και χωρίς αναγνώριση.` }
  ]
},
/* ───────────────────────────── 4.5 ───────────────────────────── */
{
  id: "4.5", unit: 4, title: "Κυριάκος Χαραλαμπίδης, «Αμμόχωστος Βασιλεύουσα»: «Η αρχή ενός ειδυλλίου» και «Αρχή Ινδίκτου»",
  book: "ΚΚΛ, σσ. 276–277 · Πλαίσιο Μάθησης, Β΄ τετράμηνο, Κείμενα 13–14 · Δειγματικό δοκίμιο 2026–27",
  intro: "Πώς παρουσιάζει ο Κυριάκος Χαραλαμπίδης την κατεχόμενη Αμμόχωστο — ως πόλη-αγαπημένη, πληγωμένη και φυλακισμένη — και ποια εκφραστικά μέσα αποδίδουν τη σχέση του ποιητή με την πόλη;",
  thumb: LETTER("Αμμόχωστος"),
  theory: R`
<p>Ο <b>Κυριάκος Χαραλαμπίδης</b> (γενν. 1940, Άχνα) είναι από τους κορυφαίους σύγχρονους Κύπριους ποιητές. Η συλλογή <b>«Αμμόχωστος Βασιλεύουσα» (1982)</b> είναι αφιερωμένη στην πόλη που κατέλαβε ο τουρκικός στρατός το 1974 — και ειδικά στη νεκρή, περιφραγμένη συνοικία της. Ο τίτλος συνδέει την Αμμόχωστο με τη <b>Βασιλεύουσα</b>, την Κωνσταντινούπολη: μια πόλη χαμένη, σχεδόν θρυλική, που ζει στη μνήμη και στη λαχτάρα της επιστροφής. Διδάσκονται δύο ποιήματα της συλλογής: <b>«Η αρχή ενός ειδυλλίου»</b> και <b>«Αρχή Ινδίκτου»</b>. <span class="muted">Τα ποιήματα δεν αναδημοσιεύονται εδώ· διάβασέ τα στα «Κείμενα Κυπριακής Λογοτεχνίας». Οι περιλήψεις είναι δικές μας.</span></p>
<div class="tbox def"><h4>«Η αρχή ενός ειδυλλίου»: η πορεία του ποιήματος</h4>
<ol><li><b>Ανάμνηση</b>: το ποιητικό υποκείμενο ανακαλεί μια παλιά στιγμή μέσα στο τοπίο της πόλης — ουρανό, πέτρα, ιερούς τόπους και φυτά του κυπριακού τοπίου — που τον δένει με τον τόπο του.</li>
<li><b>Επιστροφή στο παρόν</b>: βρίσκεται κοντά στην πόλη, χωρίς να μπορεί να μπει. Της μιλά σαν σε γυναίκα και νιώθει ότι της χρωστά ό,τι του έδωσε στα νεανικά του χρόνια.</li>
<li><b>Δύο εικόνες της πόλης</b>: η φωτεινή, αρωματισμένη, ερωτική πόλη του παρελθόντος και η πόλη μετά το 1974, νεκρή και ακίνητη, σαν θάλασσα που ποδοπατήθηκε.</li>
<li><b>Η κατοχή</b>: η πόλη είναι περιφραγμένη και αποκομμένη, ένας ολόκληρος τόπος φυλακισμένος, στερημένος από ό,τι κρατά ζωντανή μια κοινότητα. Μια μικρή οικιακή λεπτομέρεια που έμεινε πίσω δείχνει τη ζωή που διακόπηκε απότομα.</li>
<li><b>Κατακλείδα</b>: ο ομιλητής προβλέπει ότι κάποτε η πόλη θα ξαναγυρίσει στους ανθρώπους της και θα ξαναζωντανέψει — ίσως τότε ξεχάσει εκείνον που την αγάπησε· ωστόσο δηλώνει ότι η σχέση τους δεν έχει κλείσει.</li></ol></div>
<div class="tbox def"><h4>«Αρχή Ινδίκτου»: τίτλος, πλαίσιο, θέμα</h4>
<p>Η <b>Ίνδικτος</b> είναι στη βυζαντινή και εκκλησιαστική παράδοση η <b>αρχή του νέου έτους</b>, την <b>1η Σεπτεμβρίου</b>. Ο τίτλος φορτίζει το ποίημα με μια αντίφαση: η Εκκλησία γιορτάζει μια <b>νέα αρχή</b>, ενώ για τον πρόσφυγα ποιητή ο χρόνος της πόλης έχει <b>παγώσει</b> από το 1974.</p>
<ul><li><b>Περιεχόμενο (με δικά μας λόγια)</b>: ένας θρήνος από την εξορία. Στην αρχή ενός νέου έτους ο ομιλητής ανακαλεί δρόμους, γειτονιές και εκκλησίες της Αμμοχώστου, τόπους που μοιάζουν πια να υπάρχουν μόνο στη δική του μνήμη· η ονομασία τους γίνεται τρόπος να μη χαθούν.</li>
<li><b>Θέματα</b>: εξορία και νόστος, ο χρόνος (νέα χρονιά ↔ ακινητοποιημένος χρόνος της κατοχής), η μνήμη ως αντίσταση στη λήθη, η θρησκευτική και βυζαντινή παράδοση ως μέρος της ταυτότητας.</li>
<li><b>Τεχνικές (περιγραφικά)</b>: τοπωνύμια και ονόματα ναών που λειτουργούν σαν «απογραφή» της χαμένης πόλης· λιτός, θρηνητικός τόνος· διακειμενική σύνδεση με τη λειτουργική γλώσσα της Εκκλησίας· ελεύθερος στίχος και συμβολικές εικόνες.</li>
<li><b>Σύγκριση με το πρώτο ποίημα</b>: στην «Αρχή ενός ειδυλλίου» η πόλη είναι αγαπημένη γυναίκα και κυριαρχεί ο ερωτικός τόνος· στην «Αρχή Ινδίκτου» κυριαρχούν ο χρόνος, η τελετουργία και ο θρήνος. Και τα δύο ποιήματα έχουν στον τίτλο τη λέξη «αρχή»: η απώλεια γίνεται αφετηρία για μνήμη και ελπίδα.</li></ul>
<p class="muted small">Για τις λεπτομέρειες των στίχων στηρίξου στο κείμενο του ανθολογίου.</p></div>
<div class="tbox thm"><h4>Ποιητικό υποκείμενο και σχέση με την πόλη</h4>
<ul><li>Απευθύνεται <b>άμεσα στην Αμμόχωστο</b> (β΄ πρόσωπο, <b>αποστροφή</b>) και εκφράζει προσωπικά βιώματα, νοσταλγία και αγάπη για την κατεχόμενη πόλη.</li>
<li>Η σχέση είναι <b>ερωτική</b> (η πόλη ως αγαπημένη), <b>βιωματική</b> (νεανικά χρόνια) και <b>συμβολική</b> (η πόλη ως πατρίδα, μνήμη, ταυτότητα).</li>
<li><b>Δύο αντίθετες όψεις</b> της πόλης (ζητήθηκαν στο δειγματικό 2026–27): η ζωντανή, φωτεινή, ερωτική πόλη του παρελθόντος ↔ η νεκρή, ακίνητη, φυλακισμένη πόλη του παρόντος· η ισχυρή, οχυρωμένη πόλη ↔ η πόλη που ποδοπατήθηκε.</li></ul></div>
<div class="tbox def"><h4>Εκφραστικά μέσα, σύμβολα, μοντερνισμός</h4>
<ul><li><b>Προσωποποίηση</b> της πόλης: αποκτά σώμα, χαρακτήρα και συναισθήματα γυναίκας.</li>
<li><b>Μεταφορές</b>: η πόλη ως γυναίκα στολισμένη με τα στοιχεία της φύσης· η πόλη ως θάλασσα που ποδοπατήθηκε.</li>
<li><b>Σύμβολα</b>: η περίφραξη και η φυλακή (κατοχή), τα άστρα, η θάλασσα, το φως (μνήμη, ελπίδα, ελευθερία).</li>
<li><b>Επαναλήψεις</b> και <b>αντιθέσεις</b> (παρελθόν–παρόν, ζωή–θάνατος).</li>
<li><b>Μοντερνισμός</b>: ελεύθερος στίχος, συμβολική γραφή, συνειρμικές εικόνες, συνύπαρξη προσωπικής και συλλογικής εμπειρίας — στην υπηρεσία της κυπριακής ιστορικής εμπειρίας (προσφυγιά, κατοχή, μνήμη).</li></ul>
<p><b>Λειτουργία</b>: αναδεικνύουν το τραύμα της κατοχής, τη νοσταλγία, την ελπίδα της επιστροφής και τη συναισθηματική σχέση ποιητή–πόλης.</p></div>
<div class="tbox rem"><h4>Ιστορικό πλαίσιο και οικουμενικότητα</h4>
<p>Τα ποιήματα αποτυπώνουν την τουρκική εισβολή (1974), την κατοχή της Αμμοχώστου και την προσφυγιά, και τις επιπτώσεις τους στα βιώματα, στη μνήμη, στην ταυτότητα και στην ελπίδα των προσφύγων. Η κυπριακή εμπειρία συνδέεται με <b>οικουμενικά θέματα</b> — απώλεια πατρίδας, προσφυγιά, νόστος, ελευθερία, ανθρώπινα δικαιώματα — και με τη μεταπολεμική ελληνική και κυπριακή λογοτεχνία του πολέμου και του νόστου. Η Αμμόχωστος γίνεται <b>ιστορικό και πολιτισμικό σύμβολο</b> της Κύπρου.</p></div>
<div class="tbox ex"><h4>Τύπος ερώτησης (δειγματικό 2026–27)</h4>
<p>«Να περιγράψετε τη σχέση του ποιητή με τη γενέθλια πόλη και να αναφέρετε δύο διαφορετικά εκφραστικά μέσα με τα οποία παρουσιάζεται.»</p>
<details class="steps"><summary>Ενδεικτική απάντηση (σχεδιάγραμμα)</summary><p><b>Σχέση</b>: ερωτική και βιωματική — η πόλη είναι η αγαπημένη του, με την οποία τον δένουν τα νεανικά χρόνια· ο ποιητής τη λαχταρά, αισθάνεται ότι της χρωστά, πονά για την αιχμαλωσία της και πιστεύει ότι η σχέση τους συνεχίζεται. <b>Μέσο 1 — αποστροφή/προσωποποίηση</b>: της μιλά σε β΄ πρόσωπο σαν σε γυναίκα· η πόλη αποκτά ζωή και ο πόνος γίνεται προσωπικός. <b>Μέσο 2 — σύμβολο</b>: η περίφραξη και η φυλακή — η πόλη αιχμάλωτη, αποκομμένη· εντείνει το τραύμα της κατοχής. <i>(Σε κάθε μέσο δίνεις το τεκμήριο από τους στίχους που θα σου δοθούν.)</i></p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Ερμηνεία του ποιήματος ως ερωτικού για μια πραγματική γυναίκα — η «αγαπημένη» είναι η πόλη.</li>
<li>Αναφορά σε εκφραστικά μέσα χωρίς σύνδεση με τη σχέση ποιητή–πόλης, που ζητά η ερώτηση.</li>
<li>Παράλειψη της αντίθεσης παρελθόντος–παρόντος· στην «Αρχή Ινδίκτου», παράλειψη της σημασίας του τίτλου.</li></ul></div>
`,
  widget: "nc1amm",
  gen: "nc1gTech",
  exercises: [
    { level: 1, q: R`Ποια χρονιά κυκλοφόρησε η συλλογή «Αμμόχωστος Βασιλεύουσα»;`, fields: [{ label: "Έτος:", ans: 1982 }],
      hint: R`Αρχές της δεκαετίας του 1980.`, sol: R`Το <b>1982</b>.` },
    { level: 1, shuffle: true, type: "mc", q: R`Σε ποιον απευθύνεται το ποιητικό υποκείμενο στην «Αρχή ενός ειδυλλίου»;`, options: ["Στην πόλη της Αμμοχώστου, σαν σε αγαπημένη γυναίκα", "Στη μητέρα του", "Στους κατακτητές", "Στον αναγνώστη, σε τόνο διδακτικό"], correct: 0,
      hint: R`Η «αγαπημένη» του ποιήματος.`, sol: R`Στην <b>Αμμόχωστο</b>, με αποστροφή σε β΄ πρόσωπο.` },
    { level: 1, shuffle: true, type: "mc", q: R`Ποιο ιστορικό γεγονός βρίσκεται πίσω από τα ποιήματα;`, options: ["Η τουρκική εισβολή του 1974 και η κατοχή της Αμμοχώστου", "Ο Εμφύλιος Πόλεμος στην Ελλάδα", "Η Μικρασιατική Καταστροφή", "Η Άλωση της Κωνσταντινούπολης το 1453"], correct: 0,
      hint: R`Η πόλη είναι κατεχόμενη.`, sol: R`Η <b>εισβολή του 1974</b> και η κατοχή.` },
    { level: 2, shuffle: true, type: "mc", q: R`Τι συμβολίζουν οι εικόνες περίφραξης και φυλάκισης της πόλης στο ποίημα;`, options: ["Την κατοχή: ολόκληρη η πόλη φυλακισμένη και αποκομμένη από τους ανθρώπους της", "Ένα στρατόπεδο της Κατοχής του 1941", "Την ασφάλεια και την προστασία", "Ένα αθλητικό γήπεδο"], correct: 0,
      hint: R`Τι εμποδίζει την επιστροφή;`, sol: R`Σύμβολα της <b>κατοχής</b> και της αιχμαλωσίας της πόλης.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποια είναι μια από τις δύο αντίθετες όψεις της πόλης που παρουσιάζει το ποίημα;`, options: ["Η ζωντανή, φωτεινή, ερωτική πόλη του παρελθόντος ↔ η ακίνητη, φυλακισμένη πόλη του παρόντος", "Η πόλη των πλουσίων ↔ η πόλη των φτωχών", "Η πόλη της βιομηχανίας ↔ η πόλη του τουρισμού", "Η αρχαία Σαλαμίνα ↔ η Λευκωσία"], correct: 0,
      hint: R`Πριν και μετά το 1974.`, sol: R`<b>Παρελθόν</b> (ζωή, ομορφιά) ↔ <b>παρόν</b> (θάνατος, φυλακή).` },
    { level: 2, shuffle: true, type: "mc", q: R`Τι προσφέρει μια μικρή οικιακή λεπτομέρεια που έμεινε πίσω στην εγκαταλελειμμένη πόλη και τη «φροντίζουν» πια μόνο τα στοιχεία της φύσης;`, options: ["Με προσωποποίηση και τρυφερή εικόνα δείχνει τη ζωή που διακόπηκε απότομα και εντείνει τη συγκίνηση", "Δείχνει ότι η πόλη είναι ακόμη κατοικημένη κανονικά", "Είναι χιουμοριστική λεπτομέρεια", "Περιγράφει τον καιρό της Κύπρου"], correct: 0,
      hint: R`Ποιος φροντίζει τα ρούχα, αφού οι άνθρωποι έλειψαν;`, sol: R`Η φύση <b>προσωποποιείται</b> και αναλαμβάνει τις οικιακές δουλειές των ανθρώπων που έλειψαν: <b>σπαρακτική</b> εικόνα της ζωής που διακόπηκε.` },
    { level: 1, q: R`Ποιον μήνα ξεκινά ο νέος χρόνος κατά την Ίνδικτο, στην οποία παραπέμπει ο τίτλος «Αρχή Ινδίκτου»;`, fields: [{ label: "Μήνας:", ans: ["Σεπτέμβριος", "Σεπτέμβρης", "Σεπτεμβρίου", "Σεπτέμβρη"], text: true }],
      hint: R`Η εκκλησιαστική χρονιά δεν αρχίζει τον Ιανουάριο· σκέψου το τέλος του καλοκαιριού.`, sol: R`Τον <b>Σεπτέμβριο</b> (1η Σεπτεμβρίου): αρχή του εκκλησιαστικού έτους.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποια αντίφαση δημιουργεί ο τίτλος «Αρχή Ινδίκτου» σε ένα ποίημα για την κατεχόμενη Αμμόχωστο;`, options: ["Ενώ γιορτάζεται μια νέα αρχή του χρόνου, για τον πρόσφυγα ο χρόνος της πόλης έχει παγώσει", "Ο τίτλος είναι αστείος, ενώ το ποίημα σοβαρό", "Ο τίτλος αναφέρεται στην Ινδία, ενώ το ποίημα στην Κύπρο", "Δεν υπάρχει καμία σχέση τίτλου και περιεχομένου"], correct: 0,
      hint: R`Τι σημαίνει «αρχή» για κάποιον που δεν μπορεί να γυρίσει σπίτι του;`, sol: R`Η <b>νέα αρχή</b> του εκκλησιαστικού έτους αντιπαρατίθεται στον <b>ακινητοποιημένο χρόνο</b> της κατοχής: ο θρήνος εντείνεται.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποια λειτουργία έχει στην «Αρχή Ινδίκτου» η ονομαστική αναφορά σε δρόμους και εκκλησίες της Αμμοχώστου;`, options: ["Λειτουργεί σαν απογραφή της χαμένης πόλης: η μνήμη κρατά ζωντανούς τους τόπους απέναντι στη λήθη", "Δίνει οδηγίες σε τουρίστες", "Δείχνει ότι ο ποιητής ζει ακόμη εκεί", "Δημιουργεί χιουμοριστικό τόνο"], correct: 0,
      hint: R`Τι γίνεται με τους τόπους που δεν μπορεί πια να επισκεφθεί;`, sol: R`Η ονομασία τόπων είναι <b>πράξη μνήμης</b> και αντίστασης στη λήθη· δίνει και αυθεντικότητα στο βίωμα του πρόσφυγα.` },
    { level: 3, shuffle: true, type: "mc", q: R`Γιατί η σχέση του ποιητή με την Αμμόχωστο χαρακτηρίζεται ταυτόχρονα ερωτική, βιωματική και συμβολική;`, options: ["Η πόλη είναι αγαπημένη (έρωτας), συνδέεται με τα νεανικά του χρόνια (βίωμα) και αντιπροσωπεύει την πατρίδα και τη μνήμη (σύμβολο)", "Γιατί ο ποιητής ζει ακόμη στην πόλη", "Γιατί ο ποιητής δεν γνώρισε ποτέ την πόλη", "Γιατί το ποίημα είναι γραμμένο σε δεκαπεντασύλλαβο"], correct: 0,
      hint: R`Τρία επίπεδα: προσωπικό, βιωματικό, συλλογικό.`, sol: R`Το Πλαίσιο: η σχέση είναι <b>ερωτική, βιωματική και συμβολική</b>.` },
    { level: 3, shuffle: true, type: "mc", q: R`Πώς συνδέεται η κυπριακή εμπειρία των ποιημάτων με την οικουμενική λογοτεχνία;`, options: ["Η απώλεια της πατρίδας, η προσφυγιά, ο νόστος και η ελευθερία είναι οικουμενικά θέματα", "Δεν συνδέεται, είναι αποκλειστικά τοπική", "Μόνο μέσω της χρήσης της κυπριακής διαλέκτου", "Μόνο επειδή ο ποιητής ταξίδεψε στην Ευρώπη"], correct: 0,
      hint: R`Ποια θέματα αφορούν κάθε άνθρωπο;`, sol: R`Τα κυπριακά βιώματα γίνονται <b>οικουμενικά</b>: πατρίδα, προσφυγιά, νόστος, ανθρώπινα δικαιώματα.` }
  ]
},
/* ───────────────────────────── 4.6 ───────────────────────────── */
{
  id: "4.6", unit: 4, title: "Αλμπέρ Καμύ, «Γράμμα σ’ ένα φίλο Γερμανό»: αντιστασιακή λογοτεχνία και ανθρωπισμός",
  book: "ΚΝΕΛ Γ΄, σσ. 407–410 · Πλαίσιο Μάθησης, Β΄ τετράμηνο, Κείμενο 15 · Δειγματικό διαγώνισμα τετραμήνου",
  intro: "Γιατί η σύγκρουση στο «Γράμμα σ’ ένα φίλο Γερμανό» του Καμύ είναι σύγκρουση δύο ηθικών στάσεων και όχι δύο λαών, και πώς λειτουργεί η αφήγηση του περιστατικού με το δεκαεξάχρονο παιδί;",
  thumb: LETTER("Καμύ"),
  theory: R`
<p>Ο <b>Αλμπέρ Καμύ</b> (1913–1960), Γάλλος συγγραφέας και στοχαστής, τιμήθηκε με το <b>Νόμπελ Λογοτεχνίας το 1957</b>. Στα χρόνια της γερμανικής κατοχής συμμετείχε στην <b>Αντίσταση</b> και έγραψε τα <b>«Γράμματα σ’ ένα Γερμανό φίλο»</b> (1943–1944): τέσσερα γράμματα προς έναν φανταστικό Γερμανό φίλο, όπου αντιπαραθέτει τη ναζιστική λογική της βίας με την ανθρωπιστική ηθική. Το απόσπασμα της ύλης προέρχεται από γράμμα με ημερομηνία <b>Δεκέμβριος 1943</b>. <span class="muted">Το κείμενο δεν αναδημοσιεύεται εδώ· διάβασέ το στο ΚΝΕΛ Γ΄.</span></p>
<div class="tbox def"><h4>Το απόσπασμα σε συντομία (με δικά μας λόγια)</h4>
<ol><li>Ο συγγραφέας, απευθυνόμενος στον Γερμανό αποδέκτη, αρχίζει να του διηγείται ένα περιστατικό.</li>
<li>Ένα ξημέρωμα, ένα φορτηγό με οπλισμένους στρατιώτες μεταφέρει <b>έντεκα Γάλλους</b> κρατουμένους στο νεκροταφείο για εκτέλεση. Μερικοί είχαν πάρει μέρος σε μικρές πράξεις αντίστασης· οι υπόλοιποι ήταν εντελώς αθώοι. Ανάμεσά τους ένα <b>παιδί δεκαέξι χρονών</b>, κυριευμένο από τον φόβο.</li>
<li>Ένας <b>ιερέας</b>, που οι κατακτητές έχουν βάλει να συνοδεύει τους μελλοθάνατους, μιλά στο παιδί· εκείνο πιάνεται από τα λόγια του και ξαναβρίσκει για λίγο ελπίδα, ενώ ο ιερέας το προετοιμάζει για τον θάνατο.</li>
<li>Το παιδί επιχειρεί να δραπετεύσει από το φορτηγό. Σε μια κρίσιμη στιγμή ο ιερέας — που έχει να επιλέξει ανάμεσα στους εκτελεστές και στα θύματα — <b>ειδοποιεί τους φρουρούς</b>. Ακολουθεί καταδίωξη στα χωράφια· οι κρατούμενοι ακούν μόνο τους ήχους· <b>το παιδί το ξαναφέρνουν</b>.</li>
<li>Ο συγγραφέας αποκαλύπτει ότι την ιστορία την άκουσε από έναν <b>Γάλλο παπά</b>, που ντρεπόταν για τον συνάδελφό του. Συμπεραίνει ότι ο ιερέας σκεφτόταν όπως ο Γερμανός φίλος: έκανε ακόμη και την πίστη του όργανο της πατρίδας και της βίας.</li>
<li>Ιδεολογικό κλείσιμο: οι κατακτητές προχωρούν με τυφλή ορμή· οι Γάλλοι, που ξεκίνησαν από τη στοχαστική, διστακτική σκέψη, έχουν πια λόγο να προσθέσουν σε αυτήν και την αγανάκτηση — ο θάνατος ενός αθώου παιδιού τούς έδωσε την αποφασιστικότητα της αντίστασης.</li></ol></div>
<div class="tbox thm"><h4>Δύο στάσεις, όχι δύο έθνη</h4>
<p>Ο Καμύ δεν καταγγέλλει τους Γερμανούς ως λαό· αντιπαραθέτει <b>δύο στάσεις ζωής</b>: την <b>τυφλή, μηδενιστική βία</b> που θυσιάζει τα πάντα — ακόμη και την πίστη — στην εξουσία και στην πατρίδα, και την <b>ανθρωπιστική στάση</b> που στηρίζεται στη σκέψη, στην αξία της ανθρώπινης ζωής και στη δικαιοσύνη. Η απόδειξη μέσα στο απόσπασμα: ένας ιερέας (άνθρωπος του Θεού) διαλέγει τους δήμιους, ενώ ένας άλλος ιερέας (Γάλλος) ντρέπεται γι’ αυτό — η διάκριση δεν είναι εθνική, είναι ηθική.</p></div>
<div class="tbox def"><h4>Είδος, αφηγητής, πρόσωπα</h4>
<ul><li><b>Επιστολικός λόγος</b>, <b>στοχαστικός και επιχειρηματολογικός</b>, που συνδυάζει <b>αφήγηση</b> και <b>ιδεολογικό προβληματισμό</b>. Γλώσσα <b>λιτή, πυκνή, άμεση</b>.</li>
<li><b>Ομοδιηγητικός</b> αφηγητής που παρεμβαίνει προσωπικά, σχολιάζει και απευθύνεται άμεσα στον αποδέκτη.</li>
<li><b>Α΄ πρόσωπο</b> (ο συγγραφέας που αφηγείται και κρίνει) και <b>β΄ πρόσωπο</b> (ο Γερμανός αποδέκτης στον πληθυντικό ευγενείας): άμεσος, <b>αντιπαραθετικός</b> διάλογος με τον υποθετικό συνομιλητή — προσωπικός, πειστικός λόγος.</li>
<li><b>Δομή</b>: αφήγηση του περιστατικού → κορύφωση με την απόπειρα διαφυγής → ιδεολογικός σχολιασμός και συμπέρασμα.</li></ul></div>
<div class="tbox def"><h4>Αφηγηματικοί τρόποι και χρόνος</h4>
<ul><li><b>Αφήγηση</b>, <b>διάλογος</b> (παιδί – ιερέας, σε ευθύ λόγο), <b>περιγραφή</b> (το φορτηγό, ο άνεμος του πρωινού, η καταχνιά), <b>σχόλιο</b> του συγγραφέα.</li>
<li>Λειτουργία: <b>δραματικότητα</b> και ενίσχυση της <b>αντιπολεμικής επιχειρηματολογίας</b>· στη σκηνή της καταδίωξης η αφήγηση μέσω ήχων (κρότοι, φωνές, πυροβολισμός, σιωπή) δημιουργεί αγωνία.</li>
<li><b>Χρόνος</b>: γραμμική εξέλιξη του επεισοδίου (μεταφορά → απόπειρα → επιστροφή του παιδιού), δεμένη με τον συγκεκριμένο ιστορικό χρόνο του Β΄ Παγκοσμίου Πολέμου αλλά και με τον <b>διαχρονικό</b> προβληματισμό για τη βία, την ελευθερία και την ευθύνη.</li></ul></div>
<div class="tbox ex"><h4>Τύπος ερώτησης (δειγματικό διαγώνισμα)</h4>
<p>«Να προσδιορίσετε έναν αφηγηματικό τρόπο με τον οποίο αποδίδεται η μεταφορά των μελλοθανάτων στο φορτηγό και να εξηγήσετε πώς δημιουργεί δραματική ατμόσφαιρα.»</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p>Ένας τρόπος είναι η <b>περιγραφή</b>: ο συγγραφέας περιγράφει τους κρατουμένους ακίνητους και βουβούς μέσα στο φορτηγό, με τον φόβο κρυμμένο βαθιά μέσα τους, και τον υγρό πρωινό αέρα που ορμά από τον μουσαμά. Η περιγραφή <b>επιβραδύνει</b> την αφήγηση και κάνει τον αναγνώστη να ζει την αγωνία της αναμονής: η σιωπή, η ακινησία και το ψυχρό σκηνικό προετοιμάζουν τη δραματική κορύφωση. Θα μπορούσε να επιλεγεί και ο <b>διάλογος</b> παιδιού–ιερέα: ο ευθύς λόγος δίνει αμεσότητα και φανερώνει την ελπίδα του παιδιού και την ψυχρή «παρηγοριά» του ιερέα.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>«Ο Καμύ μισεί τους Γερμανούς» — αντιπαραθέτει ηθικές στάσεις, όχι λαούς.</li>
<li>Σύγχυση των δύο ιερέων (αυτός που δίνει το σήμα ↔ ο Γάλλος παπάς που διηγείται την ιστορία).</li>
<li>Παράλειψη του επιστολικού χαρακτήρα (α΄ και β΄ πρόσωπο) όταν ζητείται το ρηματικό πρόσωπο.</li></ul></div>
`,
  widget: "nc1camus",
  gen: "nc1gNarr",
  exercises: [
    { level: 1, q: R`Ποια χρονιά τιμήθηκε ο Αλμπέρ Καμύ με το Βραβείο Νόμπελ Λογοτεχνίας;`, fields: [{ label: "Έτος:", ans: 1957 }],
      hint: R`Σκέψου τη δεκαετία του 1950 και τη σειρά των νομπελιστών της ύλης.`, sol: R`Το <b>1957</b>.` },
    { level: 1, shuffle: true, type: "mc", q: R`Σε ποιο ιστορικό πλαίσιο γράφτηκαν τα «Γράμματα σ’ ένα Γερμανό φίλο»;`, options: ["Στη γερμανική κατοχή της Γαλλίας, στον Β΄ Παγκόσμιο Πόλεμο", "Στον Α΄ Παγκόσμιο Πόλεμο", "Στη Γαλλική Επανάσταση", "Στον Ψυχρό Πόλεμο"], correct: 0,
      hint: R`Το απόσπασμα χρονολογείται Δεκέμβριος 1943.`, sol: R`Στη <b>γερμανική κατοχή</b> (1943–1944) — αντιστασιακή λογοτεχνία.` },
    { level: 1, q: R`Πόσων χρονών είναι το παιδί ανάμεσα στους μελλοθάνατους του φορτηγού;`, fields: [{ label: "Χρόνια:", ans: 16 }],
      hint: R`Έφηβος.`, sol: R`<b>Δεκαέξι</b> (16) χρονών.` },
    { level: 1, q: R`Πόσοι Γάλλοι κρατούμενοι μεταφέρονται με το φορτηγό για εκτέλεση;`, fields: [{ label: "Κρατούμενοι:", ans: 11 }],
      hint: R`Περισσότεροι από δέκα.`, sol: R`<b>Έντεκα</b> (11).` },
    { level: 2, shuffle: true, type: "mc", q: R`Τι σημαίνει ότι στο κείμενο του Καμύ συγκρούονται δύο στάσεις ζωής και όχι δύο έθνη;`, options: ["Αντιπαραθέτει την τυφλή βία στην ανθρωπιστική ηθική, όχι τους Γερμανούς στους Γάλλους ως λαούς", "Καταγγέλλει όλους τους Γερμανούς ως λαό", "Υποστηρίζει ότι τα έθνη δεν υπάρχουν", "Ζητά συμμαχία Γαλλίας–Γερμανίας"], correct: 0,
      hint: R`Η διάκριση είναι ηθική.`, sol: R`Η σύγκρουση είναι <b>ηθική</b>: βία/μηδενισμός ↔ ανθρωπισμός/σκέψη.` },
    { level: 2, shuffle: true, type: "mc", q: R`Πώς επιβεβαιώνεται μέσα στο απόσπασμα ότι η σύγκρουση δεν είναι εθνική;`, options: ["Ένας ιερέας διαλέγει τους δήμιους, ενώ ένας άλλος ιερέας (Γάλλος) ντρέπεται γι’ αυτό — η διάκριση είναι ηθική", "Το παιδί είναι Γερμανός", "Όλοι οι στρατιώτες αρνούνται να πυροβολήσουν", "Ο συγγραφέας δεν αναφέρει καμία εθνικότητα"], correct: 0,
      hint: R`Δύο «άνθρωποι του Θεού», δύο στάσεις.`, sol: R`Η αντιπαράθεση των <b>δύο ιερέων</b> δείχνει ότι μετρά η στάση, όχι η εθνικότητα.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποια ρηματικά πρόσωπα κυριαρχούν και τι δημιουργούν;`, options: ["Α΄ και β΄ πρόσωπο: άμεσο, αντιπαραθετικό διάλογο με τον αποδέκτη της επιστολής", "Μόνο γ΄ πρόσωπο: αντικειμενική απόσταση", "Μόνο α΄ πληθυντικό: συλλογική εξομολόγηση", "Μόνο β΄ ενικό: ερωτική αποστροφή"], correct: 0,
      hint: R`Είναι γράμμα προς κάποιον.`, sol: R`<b>Α΄</b> (συγγραφέας) και <b>β΄</b> (ο «φίλος») πρόσωπο: προσωπικός, πειστικός, αντιπαραθετικός λόγος.` },
    { level: 2, shuffle: true, type: "mc", q: R`Ποια είναι η δομή του αποσπάσματος;`, options: ["Αφήγηση του περιστατικού → κορύφωση με την απόπειρα διαφυγής → ιδεολογικός σχολιασμός και συμπέρασμα", "Περιγραφή τοπίου → ερωτική εξομολόγηση → αίσιο τέλος", "Διάλογος → θεατρικό μονόπρακτο → επίλογος σε στίχους", "Βιογραφία του Καμύ → κριτική του έργου του"], correct: 0,
      hint: R`Ιστορία + συμπέρασμα.`, sol: R`Τρία μέρη: <b>αφήγηση → κορύφωση → σχολιασμός</b>.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποια είναι η λειτουργία της αφήγησης της καταδίωξης μόνο μέσα από ήχους (κρότοι, φωνές, πυροβολισμός, σιωπή);`, options: ["Περιορίζει την οπτική στους κρατουμένους του φορτηγού και δημιουργεί αγωνία και δραματική ένταση", "Επιταχύνει την αφήγηση για να τελειώσει γρήγορα", "Δημιουργεί κωμικό αποτέλεσμα", "Δίνει πληροφορίες για την ιστορία της Γαλλίας"], correct: 0,
      hint: R`Τι βλέπουν και τι ακούν οι κρατούμενοι;`, sol: R`Η <b>ακουστική</b> απόδοση βάζει τον αναγνώστη στη θέση των κρατουμένων: αγωνία για το άγνωστο, δραματικότητα.` },
    { level: 3, shuffle: true, type: "mc", q: R`Ποιο είναι το μήνυμα του κλεισίματος, όπου η στοχαστική στάση των Γάλλων αποκτά πια και αγανάκτηση;`, options: ["Ο θάνατος ενός αθώου παιδιού δικαιολογεί την αντίσταση: ο ανθρωπισμός δεν είναι αδυναμία, γίνεται ενεργός αγώνας", "Η βία είναι αναπόφευκτη και πρέπει να γίνει αποδεκτή", "Η σκέψη πρέπει να εγκαταλειφθεί", "Οι κατακτητές θα νικήσουν"], correct: 0,
      hint: R`Πώς αλλάζει η στάση των Γάλλων μετά τον θάνατο του παιδιού;`, sol: R`Η ανθρωπιστική στάση <b>ενισχύεται</b> με την οργή απέναντι στο έγκλημα: ελευθερία, αντίσταση, προσωπική ευθύνη απέναντι στον ολοκληρωτισμό.` }
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

/* ================= Λογοτεχνία Εμβάθυνσης Γ΄ Λυκείου — widgets & γεννήτριες (prefix nc1) =================
   Πνευματικά δικαιώματα: όλα τα παραδείγματα είναι πρωτότυπα κείμενα εξάσκησης, εκτός από το ποίημα
   του Καβάφη «Μελαγχολία του Ιάσωνος Κλεάνδρου…» (1921, κοινό κτήμα). Τα σύγχρονα κείμενα της ύλης
   δεν αναπαράγονται — περιγράφονται/αναλύονται. */
const nc1Esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const nc1Shuf = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const nc1Pick = a => a[Math.floor(Math.random() * a.length)];
const nc1CSS = `
.nc1w{font-size:15px}
.nc1w .nc1bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 10px}
.nc1w .nc1score{font:700 13px "IBM Plex Mono",monospace;color:var(--blue);margin-left:auto}
.nc1w .nc1item{border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin:8px 0;background:#fff}
.nc1w .nc1item p{margin:0 0 8px;line-height:1.5}
.nc1w .nc1cats{display:flex;flex-wrap:wrap;gap:6px}
.nc1w .nc1cats button{font:inherit;font-size:13px;font-weight:700;padding:6px 10px;border-radius:9px;border:1.5px solid var(--line);background:#fff;color:var(--navy);cursor:pointer}
.nc1w .nc1cats button:hover{border-color:var(--blue)}
.nc1w .nc1cats button.ok{background:#e8f6ee;border-color:#198754;color:#0f5132}
.nc1w .nc1cats button.no{background:#fdecec;border-color:#DC3545;color:#842029}
.nc1w .nc1why{font-size:13.5px;color:var(--muted);margin-top:6px}
.nc1w .nc1item.done{background:#fcfcfd}
.nc1w table.nc1mx{width:100%;border-collapse:collapse;font-size:14px}
.nc1w table.nc1mx th,.nc1w table.nc1mx td{border:1px solid var(--line);padding:6px;vertical-align:top}
.nc1w table.nc1mx th{background:var(--soft);color:var(--navy);text-align:left}
.nc1w table.nc1mx textarea{width:100%;min-height:58px;font:inherit;font-size:13.5px;border:1px solid var(--line);border-radius:8px;padding:6px;resize:vertical;box-sizing:border-box}
.nc1w .nc1model{display:none;margin-top:6px;font-size:13px;background:#fff8f6;border-left:3px solid var(--blue);padding:6px 8px;border-radius:0 8px 8px 0}
.nc1w.showm .nc1model{display:block}
.nc1w .nc1scroll{overflow-x:auto;max-width:100%}
.nc1w .nc1tl{position:relative;margin:6px 0 0 8px;padding-left:18px;border-left:3px solid #ecd9d4}
.nc1w .nc1ev{position:relative;margin:0 0 10px;padding:8px 10px;border:1px solid var(--line);border-radius:10px;background:#fff;cursor:pointer}
.nc1w .nc1ev::before{content:"";position:absolute;left:-26px;top:12px;width:12px;height:12px;border-radius:50%;background:var(--ev,#C62828);border:2px solid #fff;box-shadow:0 0 0 1px #ecd9d4}
.nc1w .nc1ev b.y{font:700 12.5px "IBM Plex Mono",monospace;color:var(--ev,#C62828);margin-right:8px}
.nc1w .nc1ev .d{display:none;margin-top:6px;font-size:13.5px;color:var(--ink)}
.nc1w .nc1ev.open .d{display:block}
.nc1w .nc1chip{font:inherit;font-size:12.5px;font-weight:700;padding:5px 10px;border-radius:99px;border:1.5px solid var(--line);background:#fff;cursor:pointer;color:var(--navy)}
.nc1w .nc1chip.on{background:var(--c,#C62828);border-color:var(--c,#C62828);color:#fff}
.nc1w .nc1cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
.nc1w .nc1card{min-height:120px;border:1px solid var(--line);border-radius:14px;padding:12px;background:#fff;cursor:pointer;display:flex;flex-direction:column;justify-content:center;text-align:center;transition:.2s}
.nc1w .nc1card .f{font-family:Georgia,serif;font-size:17px;font-weight:700;color:var(--navy)}
.nc1w .nc1card .b{display:none;font-size:13.5px;line-height:1.45;text-align:left}
.nc1w .nc1card.flip{background:#fff8f6;border-color:var(--blue)}
.nc1w .nc1card.flip .f{display:none}.nc1w .nc1card.flip .b{display:block}
.nc1w .nc1card small{display:block;margin-top:6px;color:var(--muted);font-size:11.5px;font-family:var(--sans);font-weight:600}
.nc1w .nc1poem{font-family:Georgia,"Times New Roman",serif;font-size:16.5px;line-height:1.75;background:#fffdfb;border:1px solid #ecd9d4;border-left:5px solid var(--blue);border-radius:0 12px 12px 0;padding:12px 14px}
.nc1w .nc1ln{display:block;padding:1px 6px;border-radius:6px;cursor:pointer}
.nc1w .nc1ln:hover{background:#fdf0ee}
.nc1w .nc1ln.sel{background:#fbe1dd}
.nc1w .nc1ln i{display:inline-block;width:1.8em;font:600 11px "IBM Plex Mono",monospace;color:#b08a84;font-style:normal}
.nc1w mark.t0{background:#fde2e1}.nc1w mark.t1{background:#e3ecff}.nc1w mark.t2{background:#efe6ff}.nc1w mark.t3{background:#fff1d6}.nc1w mark.t4{background:#e0f5e9}
.nc1w .nc1ord li{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:10px;padding:8px 10px;margin:6px 0;background:#fff;list-style:none}
.nc1w .nc1ord li span{flex:1;min-width:0}
.nc1w .nc1ord li button{font:inherit;font-weight:800;border:1px solid var(--line);background:#fff;border-radius:8px;width:34px;height:30px;cursor:pointer;color:var(--navy)}
.nc1w .nc1ord li.ok{border-color:#198754;background:#e8f6ee}.nc1w .nc1ord li.no{border-color:#DC3545;background:#fdecec}
.nc1w .nc1ord{padding:0;margin:0}
.nc1w .nc1plan td,.nc1w .nc1plan th{padding:6px 8px;border-top:1px solid var(--line);text-align:left;font-size:14px}
.nc1w .nc1plan{width:100%;border-collapse:collapse}
.nc1w .nc1bars{display:flex;height:22px;border-radius:8px;overflow:hidden;margin:8px 0}
.nc1w .nc1bars div{display:flex;align-items:center;justify-content:center;color:#fff;font:700 11.5px var(--sans);white-space:nowrap;overflow:hidden}
.nc1w input[type=range]{max-width:100%}
`;
function nc1Box(box, title) {
  if (!document.getElementById("nc1css")) { const st = document.createElement("style"); st.id = "nc1css"; st.textContent = nc1CSS; document.head.appendChild(st); }
  box.classList.add("nc1w"); box.innerHTML = title ? `<p class="muted small" style="margin:0 0 8px">${title}</p>` : ""; return box;
}
const nc1El = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

/* ---------- Ταξινομητής: κάθε δήλωση → σε μία κατηγορία (τα κουμπιά δεν ξαναδημιουργούνται) ---------- */
function nc1Classify(box, cfg) {
  nc1Box(box, cfg.title);
  const bar = nc1El("div", "nc1bar"), list = nc1El("div");
  const bNew = nc1El("button", "btn ghost small", "↻ Από την αρχή (ανακάτεμα)"), score = nc1El("span", "nc1score");
  bar.append(bNew, score); box.append(bar, list);
  let good = 0, done = 0;
  const cards = cfg.items.map(it => {
    const card = nc1El("div", "nc1item", `<p>${it.t}</p>`), cats = nc1El("div", "nc1cats"), why = nc1El("div", "nc1why");
    cfg.cats.forEach((c, k) => {
      const b = nc1El("button", "", c);
      b.onclick = () => {
        if (card.dataset.d) return; card.dataset.d = 1; card.classList.add("done"); done++;
        const ok = k === it.c; if (ok) good++;
        b.classList.add(ok ? "ok" : "no"); if (!ok) cats.children[it.c].classList.add("ok");
        why.innerHTML = (ok ? "✔ Σωστά. " : "✘ Όχι — σωστό: <b>" + cfg.cats[it.c] + "</b>. ") + (it.why || "");
        upd();
      };
      cats.appendChild(b);
    });
    card.append(cats, why); return card;
  });
  function reset() {
    good = 0; done = 0;
    nc1Shuf(cards).forEach(c => { c.dataset.d = ""; c.classList.remove("done"); c.querySelectorAll("button").forEach(b => b.classList.remove("ok", "no")); c.querySelector(".nc1why").innerHTML = ""; list.appendChild(c); });
    upd();
  }
  function upd() { score.textContent = `${good}/${done} σωστά · ${cards.length - done} απομένουν`; }
  bNew.onclick = reset; reset();
}

/* ---------- Πίνακας σύγκρισης (διδαγμένο ↔ αδίδακτο) ---------- */
function nc1Matrix(box, cfg) {
  nc1Box(box, cfg.title);
  const bar = nc1El("div", "nc1bar"), bShow = nc1El("button", "btn ghost small", "👁 Δείξε ενδεικτικά σημεία"), bClr = nc1El("button", "btn ghost small", "✕ Καθαρισμός"), wc = nc1El("span", "nc1score", "0 λέξεις");
  bar.append(bShow, bClr, wc);
  const sc = nc1El("div", "nc1scroll"), tb = nc1El("table", "nc1mx");
  tb.innerHTML = `<tr><th style="width:24%">Άξονας σύγκρισης</th><th>${cfg.a}</th><th>${cfg.b}</th></tr>` + cfg.rows.map((r, i) =>
    `<tr><th>${r.k}</th><td><textarea data-i="${i}a" placeholder="οι σημειώσεις σου…"></textarea><div class="nc1model">${r.a}</div></td><td><textarea data-i="${i}b" placeholder="οι σημειώσεις σου…"></textarea><div class="nc1model">${r.b}</div></td></tr>`).join("") +
    (cfg.synth ? `<tr><th>Σύνθεση (ομοιότητα / διαφορά)</th><td colspan="2"><textarea data-i="s" placeholder="Και στα δύο κείμενα… Ωστόσο…"></textarea><div class="nc1model">${cfg.synth}</div></td></tr>` : "");
  sc.appendChild(tb); box.append(bar, sc);
  if (cfg.tip) box.appendChild(nc1El("div", "wout", cfg.tip));
  const key = "nc1mx-" + cfg.id, tas = [...box.querySelectorAll("textarea")];
  let saved = {}; try { saved = JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) {}
  tas.forEach(t => { t.value = saved[t.dataset.i] || ""; t.oninput = upd; });
  function upd() {
    const o = {}; let n = 0; tas.forEach(t => { o[t.dataset.i] = t.value; n += (t.value.match(/\S+/g) || []).length; });
    wc.textContent = n + " λέξεις"; try { localStorage.setItem(key, JSON.stringify(o)); } catch (e) {}
  }
  bShow.onclick = () => { box.classList.toggle("showm"); bShow.textContent = box.classList.contains("showm") ? "🙈 Απόκρυψη ενδεικτικών" : "👁 Δείξε ενδεικτικά σημεία"; };
  bClr.onclick = () => { tas.forEach(t => t.value = ""); upd(); };
  upd();
}

/* ---------- Κάρτες (σύμβολα, εικόνες, έννοιες) ---------- */
function nc1Cards(box, cfg) {
  nc1Box(box, cfg.title);
  const bar = nc1El("div", "nc1bar"), bMix = nc1El("button", "btn ghost small", "↻ Ανακάτεμα"), bAll = nc1El("button", "btn ghost small", "Γύρισε όλες"), score = nc1El("span", "nc1score");
  bar.append(bMix, bAll, score);
  const grid = nc1El("div", "nc1cards"); box.append(bar, grid);
  let seen = new Set();
  function draw(order) {
    grid.innerHTML = ""; seen = new Set();
    order.forEach((c, i) => {
      const d = nc1El("div", "nc1card", `<div class="f">${c.f}<small>πάτησε για ερμηνεία</small></div><div class="b">${c.b}</div>`);
      d.onclick = () => { d.classList.toggle("flip"); seen.add(i); upd(); };
      grid.appendChild(d);
    });
    upd();
  }
  function upd() { score.textContent = `${seen.size}/${cfg.cards.length} κάρτες`; }
  bMix.onclick = () => draw(nc1Shuf(cfg.cards));
  bAll.onclick = () => { grid.querySelectorAll(".nc1card").forEach((d, i) => { d.classList.add("flip"); seen.add(i); }); upd(); };
  draw(cfg.cards);
  if (cfg.tip) box.appendChild(nc1El("div", "wout", cfg.tip));
}

/* ---------- Σειρά επεισοδίων: χρόνος ιστορίας (μετακίνηση κόμβων, χωρίς αναδημιουργία) ---------- */
function nc1Order(box, cfg) {
  nc1Box(box, cfg.title);
  const ol = nc1El("ul", "nc1ord"), out = nc1El("div", "wout", cfg.tip || "Βάλε τα επεισόδια στη σωστή σειρά με τα βελάκια.");
  const bar = nc1El("div", "nc1bar"), bChk = nc1El("button", "btn primary small", "Έλεγχος σειράς"), bMix = nc1El("button", "btn ghost small", "↻ Ανακάτεμα"), score = nc1El("span", "nc1score");
  bar.append(bChk, bMix, score);
  box.append(ol, bar, out);
  const lis = cfg.steps.map((t, k) => {
    const li = nc1El("li", "", `<b class="n"></b><span>${t}</span>`); li.dataset.k = k;
    const up = nc1El("button", "", "↑"), dn = nc1El("button", "", "↓");
    up.onclick = () => { const p = li.previousElementSibling; if (p) ol.insertBefore(li, p); ren(); };
    dn.onclick = () => { const n = li.nextElementSibling; if (n) ol.insertBefore(n, li); ren(); };
    li.append(up, dn); return li;
  });
  function ren() { [...ol.children].forEach((li, i) => { li.querySelector(".n").textContent = (i + 1) + "."; li.classList.remove("ok", "no"); }); score.textContent = ""; }
  bMix.onclick = () => { let o; do { o = nc1Shuf(lis); } while (o.every((li, i) => +li.dataset.k === i)); o.forEach(li => ol.appendChild(li)); ren(); out.innerHTML = cfg.tip || "Βάλε τα επεισόδια στη σωστή σειρά με τα βελάκια."; };
  bChk.onclick = () => {
    let g = 0; [...ol.children].forEach((li, i) => { const ok = +li.dataset.k === i; if (ok) g++; li.classList.remove("ok", "no"); li.classList.add(ok ? "ok" : "no"); });
    score.textContent = `${g}/${lis.length} στη σωστή θέση`;
    out.innerHTML = g === lis.length ? "✔ " + (cfg.done || "Σωστή σειρά!") : "Οι κόκκινες θέσεις δεν είναι σωστές — δοκίμασε ξανά.";
  };
  bMix.onclick();
}

/* ---------- Χρονολόγιο ρευμάτων ---------- */
const NC1_MOV = [["Συμβολισμός", "#6F42C1"], ["Καβάφης", "#C77A0A"], ["Μοντερνισμός", "#0F6FD1"], ["Γενιά του ’30", "#C62828"], ["Υπερρεαλισμός", "#198754"], ["Μεταπολεμική", "#5b6b86"], ["Κυπριακή", "#b5179e"], ["Αντίσταση / υπαρξισμός", "#0e7490"]];
const NC1_TL = [
  [1857, 0, "Μπωντλαίρ, «Τα άνθη του κακού»", "Ο Σαρλ Μπωντλαίρ ανοίγει τον δρόμο του συμβολισμού: η ποίηση υποβάλλει διαθέσεις με σύμβολα και «αντιστοιχίες», αντί να περιγράφει. Ο «Άλμπατρος» (ο ποιητής ως πουλί με τεράστια φτερά, που στο κατάστρωμα γίνεται αστείο) είναι πρόγονος του «Ελεγκτή» του Σαχτούρη."],
  [1911, 1, "Καβάφης: η ώριμη ποίηση", "Από το 1911 ο Καβάφης θεωρεί «αποδεκτά» τα ποιήματά του. Λιτή, πεζολογική γλώσσα, ιστορικά προσωπεία, δραματικός μονόλογος, ειρωνεία. Δεν ανήκει σε σχολή· επηρεάζει όλη τη μεταγενέστερη ποίηση."],
  [1918, 1, "Καβάφης, «Καισαρίων»", "Ιστορικό ποίημα: ο ποιητής-ερευνητής φαντάζεται τον λησμονημένο γιο της Κλεοπάτρας. Η ιστορία γίνεται αφορμή για ποιητική αναδημιουργία."],
  [1921, 1, "Καβάφης, «Μελαγχολία του Ιάσωνος Κλεάνδρου…»", "Φανταστικός ποιητής του 595 μ.Χ. θρηνεί το γήρας και καταφεύγει στην Ποίηση ως «φάρμακο»: ποίημα ποιητικής."],
  [1922, 2, "Έλιοτ, «Η έρημη χώρα»", "Ο Τ. Σ. Έλιοτ καθιερώνει τη «μυθική μέθοδο»: ο αρχαίος μύθος δίνει σχήμα στο σύγχρονο χάος. Ο Σεφέρης θα τον μεταφράσει (1936)."],
  [1924, 4, "Μπρετόν, «Μανιφέστο του υπερρεαλισμού»", "Ο Αντρέ Μπρετόν ορίζει τον υπερρεαλισμό: αυτόματη γραφή, όνειρο, ελευθερία του ασυνειδήτου, απρόσμενοι συνδυασμοί εικόνων."],
  [1929, 3, "Θεοτοκάς, «Ελεύθερο πνεύμα»", "Το δοκίμιο-μανιφέστο του Γιώργου Θεοτοκά ζητά ανανέωση και ευρωπαϊκό προσανατολισμό: συμβατική «αφετηρία» της Γενιάς του ’30."],
  [1929, 3, "Δούκας, «Ιστορία ενός αιχμαλώτου»", "Αφήγηση-μαρτυρία ενός Μικρασιάτη αμάχου, που μετά την καταστροφή της Σμύρνης (1922) στάλθηκε στα τάγματα εργασίας και κατόρθωσε να διαφύγει. Λιτή, προφορική γλώσσα· αντιπολεμική πεζογραφία."],
  [1931, 3, "Σεφέρης, «Στροφή» (με τον «Ερωτικό λόγο»)", "Η πρώτη ποιητική συλλογή του Σεφέρη: ακόμη μέτρο και ομοιοκαταληξία, λυρισμός, διάλογος με τον «Ερωτόκριτο»."],
  [1935, 3, "Σεφέρης, «Μυθιστόρημα»", "24 ποιήματα σε ελεύθερο στίχο· το Δ΄ είναι οι «Αργοναύτες». Ο μύθος γίνεται τρόπος να μιλήσει ο ποιητής για τη σύγχρονη ελληνική εμπειρία."],
  [1935, 4, "Εμπειρίκος, «Υψικάμινος»", "Η πρώτη ελληνική υπερρεαλιστική συλλογή: αυτόματη γραφή, ελευθερία των εικόνων. Την ίδια περίοδο εμφανίζεται ο Εγγονόπουλος."],
  [1940, 4, "Ελύτης, «Προσανατολισμοί» («Η Μαρίνα των βράχων»)", "Ο νεαρός Ελύτης αφομοιώνει τον υπερρεαλισμό με λυρισμό και φως του Αιγαίου: τολμηρές εικόνες, έρωτας, καλοκαίρι, θάλασσα."],
  [1943, 3, "Ελύτης, «Ήλιος ο πρώτος» («Μικρή πράσινη θάλασσα»)", "Αισιόδοξη, ηλιακή ποίηση μέσα στην Κατοχή· η θάλασσα γίνεται έφηβη κοπέλα και σύμβολο ελληνικότητας."],
  [1943, 7, "Καμύ, «Γράμματα σ’ ένα Γερμανό φίλο»", "Τέσσερα γράμματα της Αντίστασης (1943–1944): η ανθρωπιστική ηθική απέναντι στον ναζιστικό μηδενισμό· η αντιπαράθεση αφορά αξίες και στάσεις ζωής, όχι λαούς."],
  [1948, 4, "Εγγονόπουλος, «Ποίηση 1948» (συλλογή «Έλευσις»)", "Ο υπερρεαλιστής ποιητής και ζωγράφος γράφει μέσα στον Εμφύλιο για το αν χωρά η ποίηση σε εποχή σπαραγμού."],
  [1950, 5, "Α΄ μεταπολεμική γενιά", "Αναγνωστάκης, Σαχτούρης, Πατρίκιος, Σινόπουλος κ.ά.: εμπειρία πολέμου και Εμφυλίου, διάψευση των οραμάτων, λιτή γλώσσα, ενοχή, ειρωνεία, ευθύνη του ποιητή. Στον «Ελεγκτή» του Σαχτούρη ο ποιητής εμφανίζεται ως άγρυπνος φύλακας μέσα σε έναν πληγωμένο κόσμο."],
  [1960, 6, "Κυπριακή ποίηση μετά την Ανεξαρτησία", "Ποίηση: Μόντης, Μηχανικός, Χαραλαμπίδης κ.ά.· πεζογραφία: Γ. Φ. Πιερίδης κ.ά. Ο μοντερνισμός συναντά την κυπριακή ιστορική εμπειρία (αγώνας, Ανεξαρτησία, 1974)."],
  [1970, 5, "Αναγνωστάκης, «Ο Στόχος» («Επίλογος»)", "Τελευταία συλλογή του Αναγνωστάκη, μέσα στη Δικτατορία: η ποίηση δεν ανατρέπει καθεστώτα, αλλά κρατά την ηθική ευθύνη και τη μαρτυρία."],
  [1974, 5, "Ιωάννου, «Η μόνη κληρονομιά» («Ομίχλη»)", "Πεζογραφήματα μνήμης για τη Θεσσαλονίκη: πρωτοπρόσωπη, εξομολογητική αφήγηση, χαλαρή πλοκή, συνειρμοί."],
  [1982, 6, "Χαραλαμπίδης, «Αμμόχωστος Βασιλεύουσα»", "Η κατεχόμενη Αμμόχωστος ως ερωτευμένη, πληγωμένη πόλη: μνήμη, νόστος, ιστορικό βάθος (βυζαντινό και αρχαίο) και μοντέρνα έκφραση."]
];
function nc1Timeline(box) {
  nc1Box(box, "Πάτησε ένα ρεύμα για φιλτράρισμα· πάτησε ένα γεγονός για λεπτομέρειες.");
  const chips = nc1El("div", "nc1bar"), tl = nc1El("div", "nc1tl"), out = nc1El("div", "wout");
  let on = -1;
  const all = nc1El("button", "nc1chip on", "Όλα"); all.style.setProperty("--c", "#4a1418"); chips.appendChild(all);
  NC1_MOV.forEach(([n, c], k) => { const b = nc1El("button", "nc1chip", n); b.style.setProperty("--c", c); b.onclick = () => { on = k; mark(); draw(); }; chips.appendChild(b); });
  all.onclick = () => { on = -1; mark(); draw(); };
  function mark() { [...chips.children].forEach((b, i) => b.classList.toggle("on", i === on + 1)); }
  function draw() {
    tl.innerHTML = ""; let n = 0;
    NC1_TL.forEach(([y, m, t, d]) => {
      if (on >= 0 && m !== on) return; n++;
      const e = nc1El("div", "nc1ev", `<b class="y">${y}</b><b>${t}</b> <span class="muted small">· ${NC1_MOV[m][0]}</span><div class="d">${d}</div>`);
      e.style.setProperty("--ev", NC1_MOV[m][1]); e.onclick = () => e.classList.toggle("open"); tl.appendChild(e);
    });
    out.innerHTML = on < 0 ? `${n} σταθμοί από το 1857 ως το 1982.` : `<b>${NC1_MOV[on][0]}</b>: ${n} σταθμοί. ${NC1_MOVINFO[on]}`;
  }
  box.append(chips, tl, out); draw();
}
const NC1_MOVINFO = [
  "Σύμβολα, υποβολή, μουσικότητα, απαισιοδοξία — πρόγονος του μοντερνισμού.",
  "Ιστορικά προσωπεία, λιτή πεζολογική γλώσσα, ειρωνεία, δραματικός μονόλογος.",
  "Ελεύθερος στίχος, μυθική μέθοδος, διακειμενικότητα, αποσπασματικότητα.",
  "Ελεύθερος στίχος, ελληνικότητα, σύνδεση παράδοσης και νεωτερικότητας, μύθος.",
  "Αυτόματη γραφή, όνειρο, παράδοξες εικόνες, απρόσμενοι συνδυασμοί λέξεων.",
  "Διάψευση οραμάτων, πολιτική απογοήτευση, λιτότητα, ευθύνη, ποίηση ποιητικής.",
  "Μοντερνισμός και κυπριακή ιστορική εμπειρία: αγώνας, εισβολή, προσφυγιά, νόστος.",
  "Ευρωπαϊκή λογοτεχνία της Αντίστασης και υπαρξιακός στοχασμός: ηθική ευθύνη, ανθρωπισμός απέναντι στη βία."
];

/* ---------- Σχεδιαστής χρόνου εξέτασης ---------- */
function nc1Exam(box) {
  nc1Box(box, "Διάλεξε εξέταση και χρόνο ανάγνωσης: ο χρόνος μοιράζεται ανάλογα με τις μονάδες.");
  const ctl = nc1El("div", "wctl", `<label>Εξέταση <select class="ex"><option value="0">Τελική / Παγκύπριες (90΄)</option><option value="1">Διαγώνισμα τετραμήνου (45΄)</option></select></label><label>Ανάγνωση/σχεδιασμός <input type="range" class="rd" min="5" max="25" value="15"> <b class="rv"></b></label><label>Τελικός έλεγχος <input type="range" class="ck" min="0" max="10" value="5"> <b class="cv"></b></label>`);
  const bars = nc1El("div", "nc1bars"), tbl = nc1El("div", "nc1scroll"), out = nc1El("div", "wout");
  box.append(ctl, bars, tbl, out);
  const EX = [{ T: 90, q: [["Α1 (διδαγμένο 1)", 25], ["Α2 (διδαγμένο 2)", 25], ["Β (σύγκριση διδαγμένου–αδίδακτου)", 50]], tot: 100 },
    { T: 45, q: [["Α1 (διδαγμένο 1)", 5], ["Α2 (διδαγμένο 2)", 5], ["Β (σύγκριση διδαγμένου–αδίδακτου)", 10]], tot: 20 }];
  const col = ["#C62828", "#C77A0A", "#6F42C1"];
  function draw() {
    const e = EX[+box.querySelector(".ex").value], rd = Math.min(+box.querySelector(".rd").value, Math.round(e.T / 3)), ck = +box.querySelector(".ck").value;
    box.querySelector(".rv").textContent = rd + "΄"; box.querySelector(".cv").textContent = ck + "΄";
    const left = Math.max(0, e.T - rd - ck), mins = e.q.map(([, m]) => Math.round(left * m / e.tot));
    const segs = [["Ανάγνωση", rd, "#4a1418"]].concat(e.q.map(([n], i) => [n.split(" ")[0], mins[i], col[i]])).concat([["Έλεγχος", ck, "#5b6b86"]]);
    bars.innerHTML = segs.map(([n, m, c]) => m > 0 ? `<div style="width:${m / e.T * 100}%;background:${c}">${m >= 6 ? n + " " + m + "΄" : ""}</div>` : "").join("");
    tbl.innerHTML = `<table class="nc1plan"><tr><th>Ερώτηση</th><th>Μονάδες</th><th>Χρόνος</th></tr>${e.q.map(([n, m], i) => `<tr><td>${n}</td><td>${m}</td><td><b>${mins[i]}΄</b></td></tr>`).join("")}<tr><td>Ανάγνωση και σχεδιάγραμμα</td><td>—</td><td>${rd}΄</td></tr><tr><td>Τελικός έλεγχος</td><td>—</td><td>${ck}΄</td></tr></table>`;
    out.innerHTML = `Σύνολο ${e.T}΄ για ${e.tot} μονάδες ≈ <b>${(left / e.tot).toFixed(2).replace(".", ",")}΄ ανά μονάδα</b> γραφής. Στη σύγκριση (Μέρος Β΄) διάβασε <b>πρώτα το αδίδακτο</b> δύο φορές και κράτα σημειώσεις σε πίνακα «ομοιότητες / διαφορές».` +
      (+box.querySelector(".ex").value === 0 ? " <span class='muted'>(Η κατανομή 25/25/50 για το Μέρος Α΄ είναι ενδεικτική· οι μονάδες κάθε ερώτησης αναγράφονται στο δοκίμιο — π.χ. στο δειγματικό 2026–27 κάθε διδαγμένο έχει 25 μονάδες.)</span>" : "");
  }
  box.querySelectorAll("select,input").forEach(i => i.oninput = i.onchange = draw); draw();
}

/* ---------- Σχολιασμένο ποίημα (μόνο κείμενα κοινού κτήματος) ---------- */
const NC1_MEL = [
  ["Το γήρασμα του σώματος και της μορφής μου", "Το θέμα δηλώνεται αμέσως: η φθορά του σώματος και της εμφάνισης. Α΄ ενικό πρόσωπο → εξομολογητικός τόνος. Η «μορφή» δείχνει ότι πονά και η απώλεια της ομορφιάς (καβαφικό μοτίβο).", [[0, "Το γήρασμα"]]],
  ["είναι πληγή από φρικτό μαχαίρι.", "<b>Μεταφορά</b>: το γήρας ταυτίζεται με πληγή από μαχαίρι — ο πόνος γίνεται απτός, σωματικός, βίαιος. Το επίθετο «φρικτό» εντείνει τη φρίκη.", [[0, "πληγή από φρικτό μαχαίρι"]]],
  ["Δεν έχω εγκαρτέρησι καμιά.", "Λιτή, πεζολογική δήλωση απελπισίας: ο ομιλητής δεν μπορεί να υπομείνει καρτερικά τη φθορά. Ο ενεστώτας δίνει αμεσότητα (δραματικό παρόν).", []],
  ["Εις σε προστρέχω Τέχνη της Ποιήσεως,", "<b>Αποστροφή</b> και <b>προσωποποίηση</b>: η Τέχνη της Ποιήσεως γίνεται πρόσωπο στο οποίο καταφεύγει. Το λόγιο «Εις σε προστρέχω» θυμίζει ικεσία/προσευχή.", [[2, "Τέχνη της Ποιήσεως"]]],
  ["που κάπως ξέρεις από φάρμακα·", "Η Ποίηση «ξέρει» από φάρμακα — αλλά <b>κάπως</b>: ο Καβάφης περιορίζει ειρωνικά τη δύναμή της. Μεταφορά της ποίησης ως γιατρού.", [[1, "φάρμακα"], [3, "κάπως"]]],
  ["νάρκης του άλγους δοκιμές, εν Φαντασία και Λόγω.", "Τα «φάρμακα» είναι απόπειρες να ναρκωθεί ο πόνος — με τη Φαντασία και τον Λόγο, τα δύο εργαλεία της τέχνης. Λόγια, αρχαΐζουσα σύνταξη, κατάλληλη για ποιητή του 6ου αιώνα.", [[1, "νάρκης του άλγους"]]],
  ["Είναι πληγή από φρικτό μαχαίρι.—", "<b>Επανάληψη</b> του 2ου στίχου: επιστροφή στον πόνο, κυκλική κίνηση, έμφαση. Η παύλα δείχνει παύση και αλλαγή τόνου.", [[4, "Είναι πληγή από φρικτό μαχαίρι"]]],
  ["Τα φάρμακά σου φέρε Τέχνη της Ποιήσεως,", "Προστακτική («φέρε») και νέα αποστροφή: η ικεσία γίνεται επίμονη.", [[2, "Τέχνη της Ποιήσεως"], [1, "φάρμακά"]]],
  ["που κάμνουνε —για λίγο— να μη νοιώθεται η πληγή.", "Κορυφαία λεπτομέρεια: η ανακούφιση είναι <b>προσωρινή</b> («για λίγο», σε παρένθεση με παύλες). Η τέχνη δεν θεραπεύει, απαλύνει. Η «πληγή» κλείνει το ποίημα — σχήμα κύκλου με τον 2ο στίχο.", [[3, "για λίγο"], [0, "πληγή"]]]
];
const NC1_MELTAGS = ["Φθορά / πόνος", "Ποίηση ως φάρμακο", "Προσωποποίηση / αποστροφή", "Περιορισμός (ειρωνεία)", "Επανάληψη"];
function nc1Annot(box) {
  nc1Box(box, "Κ. Π. Καβάφης, «Μελαγχολία του Ιάσωνος Κλεάνδρου ποιητού εν Κομμαγηνή· 595 μ.Χ.» (1921 — κοινό κτήμα, μονοτονικό). Πάτησε έναν στίχο για σχόλιο ή ένα κουμπί για να φωτίσεις μοτίβο.");
  const chips = nc1El("div", "nc1bar"), poem = nc1El("div", "nc1poem"), out = nc1El("div", "wout", "Διάλεξε στίχο.");
  let tag = -1;
  NC1_MELTAGS.forEach((t, k) => { const b = nc1El("button", "nc1chip", t); b.onclick = () => { tag = tag === k ? -1 : k; [...chips.children].forEach((c, i) => c.classList.toggle("on", i === tag)); draw(); }; chips.appendChild(b); });
  function hl(line, marks) {
    let s = nc1Esc(line);
    marks.forEach(([k, w]) => { if (tag === -1 || tag === k) s = s.replace(nc1Esc(w), `<mark class="t${k}">${nc1Esc(w)}</mark>`); });
    return s;
  }
  function draw() {
    poem.innerHTML = "";
    NC1_MEL.forEach(([l, c, m], i) => {
      if (i === 6) poem.appendChild(nc1El("span", "nc1ln", "&nbsp;"));
      const s = nc1El("span", "nc1ln", `<i>${i + 1}</i>${hl(l, tag === -1 ? [] : m)}`);
      s.onclick = () => { poem.querySelectorAll(".nc1ln").forEach(x => x.classList.remove("sel")); s.classList.add("sel"); out.innerHTML = `<b>Στίχος ${i + 1}.</b> ${c}`; };
      poem.appendChild(s);
    });
    if (tag >= 0) out.innerHTML = `<b>${NC1_MELTAGS[tag]}</b>: ` + ["το λεξιλόγιο του πόνου (γήρασμα, πληγή, μαχαίρι) κυριαρχεί στο α΄ μέρος.", "η Ποίηση παρουσιάζεται ως γιατρός που δίνει «φάρμακα» — μεταφορά που διατρέχει το ποίημα.", "η Τέχνη της Ποιήσεως γίνεται πρόσωπο, στο οποίο ο ομιλητής απευθύνεται (αποστροφή) σαν σε θεότητα.", "τα «κάπως» και «για λίγο» περιορίζουν τη δύναμη της τέχνης: ρεαλισμός και καβαφική ειρωνεία.", "ο 2ος στίχος επαναλαμβάνεται αυτούσιος (στ. 7): ο πόνος επιστρέφει, η κίνηση είναι κυκλική."][tag];
  }
  box.append(chips, poem, out); draw();
}

/* ---------- Ανιχνευτής εκφραστικών μέσων (widget πάνω στη γεννήτρια) ---------- */
function nc1Detect(box) {
  nc1Box(box, "Πρωτότυπες προτάσεις εξάσκησης: διάλεξε το εκφραστικό μέσο που κυριαρχεί.");
  const bar = nc1El("div", "nc1bar"), bN = nc1El("button", "btn ghost small", "Επόμενη ➜"), sc = nc1El("span", "nc1score");
  bar.append(bN, sc);
  const card = nc1El("div", "nc1item"); box.append(card, bar);
  let g = 0, n = 0, streak = 0;
  function nx() {
    const it = nc1Pick(NC1_TECH), opts = nc1Shuf([it[1]].concat(nc1TechWrong(it)));
    card.innerHTML = `<p style="font-family:Georgia,serif;font-size:17px">${it[0]}</p>`;
    const cats = nc1El("div", "nc1cats"), why = nc1El("div", "nc1why");
    opts.forEach(o => { const b = nc1El("button", "", o); b.onclick = () => { if (card.dataset.d) return; card.dataset.d = 1; n++; const ok = o === it[1]; if (ok) { g++; streak++; } else streak = 0; b.classList.add(ok ? "ok" : "no"); [...cats.children].forEach(x => { if (x.textContent === it[1]) x.classList.add("ok"); }); why.innerHTML = (ok ? "✔ " : "✘ Σωστό: <b>" + it[1] + "</b>. ") + it[2]; upd(); }; cats.appendChild(b); });
    card.dataset.d = ""; card.append(cats, why); upd();
  }
  function upd() { sc.textContent = `${g}/${n} σωστά · σερί ${streak}`; }
  bN.onclick = nx; nx();
}

/* ---------- Τράπεζες (πρωτότυπα παραδείγματα) ---------- */
const NC1_TECHN = ["μεταφορά", "παρομοίωση", "προσωποποίηση", "αντίθεση", "επανάληψη", "υπερβολή", "ασύνδετο σχήμα", "πολυσύνδετο σχήμα", "παρήχηση", "ρητορική ερώτηση", "οξύμωρο σχήμα", "αποστροφή", "ακουστική εικόνα", "οσφρητική εικόνα", "κοσμητικό επίθετο"];
const NC1_TECH = [
  ["«Η πόλη ήταν ένα ξεχαρβαλωμένο ρολόι που κανείς δεν κούρδιζε πια.»", "μεταφορά", "Η πόλη ταυτίζεται άμεσα (χωρίς «σαν») με χαλασμένο ρολόι: μεταφορά που δηλώνει στασιμότητα και παρακμή."],
  ["«Η μνήμη του είναι ένα συρτάρι γεμάτο σκουριασμένα κλειδιά.»", "μεταφορά", "Άμεση ταύτιση της μνήμης με συρτάρι — χωρίς συγκριτικό μόριο."],
  ["«Ο χειμώνας στο χωριό ήταν ένα μακρύ, γκρίζο σεντόνι.»", "μεταφορά", "Ο χειμώνας ταυτίζεται με σεντόνι: μεταφορά (δεν υπάρχει «σαν/όπως»).", ["κοσμητικό επίθετο"]],
  ["«Το βλέμμα της έκοβε σαν γυαλί σπασμένο.»", "παρομοίωση", "Η σύγκριση γίνεται ρητά με το «σαν»: παρομοίωση."],
  ["«Περίμενε στο λιμάνι όπως περιμένει ο φάρος το καράβι.»", "παρομοίωση", "Η σύγκριση εισάγεται με το «όπως»: παρομοίωση.", ["προσωποποίηση"]],
  ["«Η θάλασσα ήταν ήρεμη σαν ανάσα κοιμισμένου παιδιού.»", "παρομοίωση", "Με το «σαν» η ηρεμία της θάλασσας συγκρίνεται με την ανάσα παιδιού."],
  ["«Ο άνεμος χτυπούσε τα παράθυρα και ζητούσε να μπει.»", "προσωποποίηση", "Ο άνεμος αποκτά ανθρώπινη θέληση («ζητούσε»): προσωποποίηση.", ["ακουστική εικόνα"]],
  ["«Τα σπίτια της γειτονιάς κοιτάζονταν σιωπηλά και θυμούνταν.»", "προσωποποίηση", "Άψυχα σπίτια «κοιτάζονταν» και «θυμούνταν»: προσωποποίηση."],
  ["«Η νύχτα κάθισε στο κατώφλι και δεν έλεγε να φύγει.»", "προσωποποίηση", "Η νύχτα παρουσιάζεται να κάθεται σαν άνθρωπος: προσωποποίηση."],
  ["«Έξω γιορτή και φώτα· μέσα στο δωμάτιο σιωπή και σκοτάδι.»", "αντίθεση", "Αντιπαρατίθενται έξω–μέσα, γιορτή–σιωπή, φώτα–σκοτάδι: αντίθεση.", ["ακουστική εικόνα"]],
  ["«Οι πλούσιοι έχτιζαν πύργους, οι φτωχοί μάζευαν τις πέτρες.»", "αντίθεση", "Πλούσιοι/φτωχοί, χτίσιμο/μάζεμα πέτρας: αντίθεση."],
  ["«Περίμενε, περίμενε, περίμενε ως το ξημέρωμα.»", "επανάληψη", "Το ρήμα επαναλαμβάνεται τρεις φορές και τονίζει τη διάρκεια και την αγωνία."],
  ["«Θα γυρίσω, σου λέω· θα γυρίσω, κι ας αργήσω.»", "επανάληψη", "Η φράση «θα γυρίσω» επαναλαμβάνεται για έμφαση και βεβαιότητα."],
  ["«Έκλαψε τόσο, που πλημμύρισε όλη η αυλή.»", "υπερβολή", "Το αποτέλεσμα είναι αδύνατο στην πραγματικότητα: υπερβολή για να τονιστεί ο πόνος."],
  ["«Σε περίμενα χίλια χρόνια σ’ αυτή τη γωνία.»", "υπερβολή", "Τα «χίλια χρόνια» μεγαλοποιούν την αναμονή: υπερβολή."],
  ["«Μάζεψε τα ρούχα, τα βιβλία, τις φωτογραφίες, τα κλειδιά, έφυγε.»", "ασύνδετο σχήμα", "Όροι στη σειρά χωρίς «και»: ασύνδετο, δίνει γρήγορο, βιαστικό ρυθμό."],
  ["«Τρέξαμε, κρυφτήκαμε, ανασάναμε, ξανατρέξαμε.»", "ασύνδετο σχήμα", "Ρήματα χωρίς συνδέσμους: ασύνδετο που αποδίδει ταραχή και ένταση."],
  ["«Και βράδιασε και κρύωσε και σώπασαν και τα πουλιά.»", "πολυσύνδετο σχήμα", "Το «και» επαναλαμβάνεται ανάμεσα σε όλους τους όρους: πολυσύνδετο, αργός και βαρύς ρυθμός."],
  ["«Κι έφυγε κι έκλεισε την πόρτα κι ούτε γύρισε να δει.»", "πολυσύνδετο σχήμα", "Συνεχής επανάληψη του «κι»: πολυσύνδετο σχήμα."],
  ["«Σιγά σιγά σφύριζε σβηστά το σκοτεινό σκοινί.»", "παρήχηση", "Επανάληψη του ήχου «σ»: παρήχηση που μιμείται το σφύριγμα.", ["προσωποποίηση"]],
  ["«Ρυάκι ρέει, ρίχνει ρίγη στις ρίζες.»", "παρήχηση", "Η συσσώρευση του «ρ» δημιουργεί ηχητικό αποτέλεσμα ροής: παρήχηση.", ["ασύνδετο σχήμα", "προσωποποίηση", "μεταφορά"]],
  ["«Ποιος θυμάται σήμερα τα παιδιά που έφυγαν με τα καράβια;»", "ρητορική ερώτηση", "Η ερώτηση δεν ζητά απάντηση· δηλώνει ότι κανείς δεν θυμάται: ρητορική ερώτηση."],
  ["«Ως πότε θα σωπαίνουμε μπροστά στην αδικία;»", "ρητορική ερώτηση", "Ερώτηση που λειτουργεί ως διαμαρτυρία και κάλεσμα, όχι ως αίτημα πληροφορίας."],
  ["«Ήταν μια εκκωφαντική σιωπή.»", "οξύμωρο σχήμα", "Η σιωπή χαρακτηρίζεται «εκκωφαντική»: συνδυασμός αντιφατικών εννοιών, οξύμωρο."],
  ["«Ζούσε έναν γλυκό θάνατο μέσα στη μοναξιά του.»", "οξύμωρο σχήμα", "Ο θάνατος «γλυκός»: έννοιες που αντιφάσκουν — οξύμωρο.", ["μεταφορά"]],
  ["«Θάλασσα, εσύ που μας πήρες τους δικούς μας, πότε θα μας τους δώσεις πίσω;»", "αποστροφή", "Ο λόγος στρέφεται απευθείας στη θάλασσα σαν σε πρόσωπο: αποστροφή."],
  ["«Μάνα, εσύ που ξενυχτούσες στο παράθυρο, άκουσέ με.»", "αποστροφή", "Ο ομιλητής απευθύνεται σε πρόσωπο απόν: αποστροφή."],
  ["«Ακουγόταν το τρίξιμο της ξύλινης σκάλας και το μακρινό σφύριγμα του τρένου.»", "ακουστική εικόνα", "Η εικόνα στηρίζεται σε ήχους (τρίξιμο, σφύριγμα): ακουστική εικόνα."],
  ["«Από την αυλή ανέβαινε η μυρωδιά του γιασεμιού και του βρεγμένου χώματος.»", "οσφρητική εικόνα", "Η εικόνα στηρίζεται σε μυρωδιές: οσφρητική εικόνα."],
  ["«Ο ροδοδάχτυλος ήλιος ανέβαινε πάνω από τη χρυσοπράσινη θάλασσα.»", "κοσμητικό επίθετο", "Τα επίθετα «ροδοδάχτυλος», «χρυσοπράσινη» στολίζουν τα ουσιαστικά χωρίς να είναι απαραίτητα για το νόημα: κοσμητικά επίθετα."],
  ["«Η καρδιά της ήταν ένα κλειστό σπίτι με κατεβασμένα παντζούρια.»", "μεταφορά", "Η καρδιά ταυτίζεται με κλειστό σπίτι: μεταφορά για τη συναισθηματική απομόνωση."],
  ["«Είχε τόσες δουλειές, που δεν προλάβαινε ούτε να ανασάνει.»", "υπερβολή", "Η διατύπωση μεγεθύνει ασύμμετρα τον φόρτο εργασίας: υπερβολή."],
  ["«Τα δέντρα έσκυψαν το κεφάλι στο πέρασμα της κηδείας.»", "προσωποποίηση", "Τα δέντρα αποκτούν ανθρώπινη χειρονομία πένθους: προσωποποίηση."],
  ["«Λίγα λόγια, πολλά δάκρυα· μικρό το σπίτι, μεγάλη η καρδιά.»", "αντίθεση", "Ζεύγη αντίθετων εννοιών (λίγα/πολλά, μικρό/μεγάλη): αντίθεση.", ["μεταφορά", "υπερβολή"]],
  ["«Θυμάμαι το φως, θυμάμαι τη φωνή σου, θυμάμαι το καλοκαίρι.»", "επανάληψη", "Η λέξη «θυμάμαι» στην αρχή κάθε κώλου (αναφορά): επανάληψη για έμφαση και ρυθμό.", ["ακουστική εικόνα"]]
];
const NC1_TECHX = { "προσωποποίηση": ["μεταφορά"], "παρομοίωση": ["μεταφορά"], "υπερβολή": ["μεταφορά"], "πολυσύνδετο σχήμα": ["επανάληψη"], "παρήχηση": ["επανάληψη", "ακουστική εικόνα"], "ακουστική εικόνα": ["παρήχηση"], "επανάληψη": ["ασύνδετο σχήμα", "υπερβολή"], "αντίθεση": ["ασύνδετο σχήμα", "οξύμωρο σχήμα"], "οξύμωρο σχήμα": ["υπερβολή", "αντίθεση"], "αποστροφή": ["ρητορική ερώτηση", "προσωποποίηση"], "κοσμητικό επίθετο": ["προσωποποίηση", "μεταφορά"], "ασύνδετο σχήμα": ["επανάληψη"], "μεταφορά": ["προσωποποίηση"], "ρητορική ερώτηση": ["αποστροφή"], "οσφρητική εικόνα": [] };
const nc1TechWrong = it => { const ex = new Set([it[1]].concat(NC1_TECHX[it[1]] || [], it[3] || [])); return nc1Shuf(NC1_TECHN.filter(x => !ex.has(x))).slice(0, 3); };
/* αφηγηματολογία: [απόσπασμα, ερώτηση, σωστή, λάθη[], εξήγηση] */
const NC1_NARR = [
  ["«Εκείνο το πρωί ξύπνησα νωρίς. Ήξερα πως θα ήταν η τελευταία μέρα στο χωριό.»", "Τι είδους αφηγητής αφηγείται;", "ομοδιηγητικός (αυτοδιηγητικός)", ["ετεροδιηγητικός", "παντογνώστης τριτοπρόσωπος", "εξωτερικός παρατηρητής"], "Αφηγείται σε α΄ πρόσωπο ιστορία στην οποία πρωταγωνιστεί: ομοδιηγητικός-αυτοδιηγητικός."],
  ["«Ο Πέτρος δεν ήξερε ότι η γυναίκα του είχε ήδη αποφασίσει να φύγει· εκείνη, πάλι, φοβόταν ότι εκείνος το είχε καταλάβει.»", "Ποια εστίαση έχουμε;", "μηδενική εστίαση (παντογνώστης αφηγητής)", ["εσωτερική εστίαση", "εξωτερική εστίαση", "δεν υπάρχει αφηγητής"], "Ο αφηγητής ξέρει τις σκέψεις και των δύο προσώπων — περισσότερα από όσα ξέρει κάθε ήρωας: μηδενική εστίαση."],
  ["«Ένας άντρας μπήκε στο καφενείο, κάθισε στη γωνία και άναψε τσιγάρο. Δεν μίλησε σε κανέναν.»", "Ποια εστίαση έχουμε;", "εξωτερική εστίαση", ["μηδενική εστίαση", "εσωτερική εστίαση", "εσωτερικός μονόλογος"], "Καταγράφονται μόνο όσα φαίνονται, χωρίς σκέψεις/συναισθήματα: εξωτερική εστίαση."],
  ["«Κοίταζε τη θάλασσα και σκεφτόταν: άραγε θα τον περίμενε ακόμα;»", "Ποια εστίαση έχουμε;", "εσωτερική εστίαση", ["μηδενική εστίαση", "εξωτερική εστίαση", "παντογνώστης αφηγητής"], "Βλέπουμε μέσα από τη ματιά και τις γνώσεις ενός ήρωα, που δεν ξέρει τα σχέδια της άλλης: εσωτερική εστίαση."],
  ["«Καθώς έκλεινε την πόρτα, θυμήθηκε τη μέρα που είχε έρθει πρώτη φορά, παιδί ακόμα, κρατώντας το χέρι του πατέρα του.»", "Ποια αφηγηματική τεχνική χρησιμοποιείται;", "αναδρομή (αναδρομική αφήγηση)", ["πρόληψη/προοικονομία", "επιτάχυνση", "in medias res"], "Η αφήγηση επιστρέφει σε γεγονός που προηγήθηκε της κύριας δράσης: αναδρομή."],
  ["«Δεν μπορούσε να ξέρει τότε ότι εκείνο το γράμμα θα ήταν το τελευταίο που θα έπαιρνε από τον αδερφό του.»", "Ποια αφηγηματική τεχνική χρησιμοποιείται;", "πρόληψη (προοικονομία)", ["αναδρομή", "επιβράδυνση", "εγκιβωτισμός"], "Προαναγγέλλεται κάτι που θα συμβεί αργότερα: πρόληψη/προοικονομία."],
  ["«Πέρασαν τρία χρόνια. Ο πόλεμος τέλειωσε, το σπίτι πουλήθηκε, οι φίλοι σκόρπισαν.»", "Ποια αφηγηματική τεχνική χρησιμοποιείται;", "επιτάχυνση (περιληπτική αφήγηση)", ["επιβράδυνση", "αναδρομή", "σκηνική αφήγηση"], "Μεγάλο διάστημα ιστορίας δίνεται σε λίγες λέξεις: επιτάχυνση."],
  ["«Το φλιτζάνι γλίστρησε από το χέρι της. Το είδε να γέρνει, να στριφογυρίζει αργά στον αέρα, να φωτίζεται από τον ήλιο, να πλησιάζει το μάρμαρο…»", "Ποια αφηγηματική τεχνική χρησιμοποιείται;", "επιβράδυνση", ["επιτάχυνση", "πρόληψη", "αναδρομή"], "Μια στιγμή απλώνεται σε πολλές λεπτομέρειες: ο χρόνος της αφήγησης υπερβαίνει τον χρόνο της ιστορίας — επιβράδυνση."],
  ["«— Θα φύγεις; τον ρώτησε. — Αύριο το πρωί, της απάντησε χωρίς να την κοιτάξει.»", "Ποιος αφηγηματικός τρόπος κυριαρχεί;", "διάλογος", ["περιγραφή", "σχόλιο", "εσωτερικός μονόλογος"], "Τα πρόσωπα μιλούν απευθείας, σε ευθύ λόγο με παύλες: διάλογος."],
  ["«Το σπίτι ήταν διώροφο, με ξύλινα μπαλκόνια φαγωμένα από την υγρασία και μια συκιά που έγερνε πάνω από την αυλόπορτα.»", "Ποιος αφηγηματικός τρόπος κυριαρχεί;", "περιγραφή", ["αφήγηση", "διάλογος", "σχόλιο"], "Παρουσιάζονται χαρακτηριστικά ενός χώρου, χωρίς εξέλιξη δράσης: περιγραφή."],
  ["«Έτσι είναι οι άνθρωποι: θυμούνται τις πληγές πιο εύκολα από τα χάδια.»", "Ποιος αφηγηματικός τρόπος κυριαρχεί;", "σχόλιο", ["περιγραφή", "διάλογος", "αφήγηση"], "Ο αφηγητής διακόπτει την ιστορία για να διατυπώσει γενική κρίση: σχόλιο."],
  ["«Πρέπει να φύγω. Όχι, δεν μπορώ. Κι αν με δουν; Κι αν δεν με περιμένει κανείς εκεί; Θεέ μου, τι κάνω…»", "Ποιος αφηγηματικός τρόπος κυριαρχεί;", "εσωτερικός μονόλογος", ["διάλογος", "περιγραφή", "σχόλιο"], "Αποδίδονται απευθείας, ασύνδετα, οι σκέψεις ενός προσώπου: εσωτερικός μονόλογος."],
  ["«Της είπε ότι θα γυρίσει πριν από τα Χριστούγεννα και ότι δεν πρέπει να ανησυχεί.»", "Πώς αποδίδεται ο λόγος του προσώπου;", "πλάγιος λόγος", ["ευθύς λόγος", "εσωτερικός μονόλογος", "ελεύθερος πλάγιος λόγος με παύλες"], "Τα λόγια μεταφέρονται με δευτερεύουσες προτάσεις («ότι…»), όχι αυτούσια: πλάγιος λόγος."],
  ["«— Δεν φοβάμαι τίποτα, είπε το παιδί.»", "Πώς αποδίδεται ο λόγος του προσώπου;", "ευθύς λόγος", ["πλάγιος λόγος", "σχόλιο", "περιγραφή"], "Τα λόγια παρατίθενται αυτούσια, με παύλα: ευθύς λόγος."],
  ["«Οι πρόσφυγες έφτασαν στο λιμάνι ένα βράδυ του Σεπτέμβρη. Ο αφηγητής δεν παίρνει μέρος στην ιστορία· ξέρει όμως τι σκέφτεται ο καθένας.»", "Τι είδους αφηγητής είναι αυτός που περιγράφεται;", "ετεροδιηγητικός", ["ομοδιηγητικός", "αυτοδιηγητικός", "δευτερεύων ήρωας-μάρτυρας"], "Ο αφηγητής δεν συμμετέχει στην ιστορία: ετεροδιηγητικός."],
  ["«Ήμουν δεκατεσσάρων χρονών όταν γνώρισα τον Στέλιο. Εκείνος ήταν ο ήρωας του καλοκαιριού μας· εγώ απλώς τον ακολουθούσα και κοίταζα.»", "Τι είδους αφηγητής είναι;", "ομοδιηγητικός (μάρτυρας, δευτερεύον πρόσωπο)", ["αυτοδιηγητικός πρωταγωνιστής", "ετεροδιηγητικός", "παντογνώστης"], "Συμμετέχει στην ιστορία, αλλά ως παρατηρητής-μάρτυρας του πρωταγωνιστή: ομοδιηγητικός."],
  ["«Ο πυροβολισμός ακούστηκε στις πέντε. Τρεις ώρες νωρίτερα, ο Αντρέας έπινε ήσυχα τον καφέ του…»", "Πώς ξεκινά η αφήγηση;", "in medias res (από τη μέση της δράσης) και μετά αναδρομή", ["με πρόληψη και επιτάχυνση", "με περιγραφή του χώρου", "με σχόλιο του αφηγητή"], "Ξεκινά από ένα κρίσιμο σημείο και επιστρέφει στα προηγούμενα: in medias res με αναδρομή."],
  ["«Τη μέρα εκείνη, όπως και την επομένη και τη μεθεπόμενη, ο γέρος ανέβαινε στον λόφο. Κάθε πρωί. Πάντα την ίδια ώρα.»", "Ποια χρονική τεχνική κυριαρχεί;", "θαμιστική αφήγηση (επανάληψη γεγονότος που συμβαίνει συχνά)", ["πρόληψη", "αναδρομή", "επιβράδυνση"], "Ένα γεγονός που επαναλαμβάνεται αφηγείται μία φορά συνοπτικά: θαμιστική αφήγηση/επανάληψη."],
  ["«Καθώς διάβαζε το γράμμα, ξεδιπλωνόταν μπροστά της μια άλλη ιστορία: η ιστορία του παππού της στη Σμύρνη, που ο ίδιος είχε γράψει πριν από πενήντα χρόνια.»", "Ποια αφηγηματική τεχνική χρησιμοποιείται;", "εγκιβωτισμός (ιστορία μέσα στην ιστορία)", ["επιτάχυνση", "πρόληψη", "εξωτερική εστίαση"], "Μέσα στην κύρια αφήγηση εντάσσεται μια δεύτερη, αυτοτελής ιστορία: εγκιβωτισμός."],
  ["«Περπατούσα στους δρόμους της πόλης μου. Δεν ήξερα αν ήταν όνειρο ή ανάμνηση· τα πρόσωπα των νεκρών φίλων περνούσαν δίπλα μου χωρίς να με κοιτάζουν.»", "Ποιο είναι το κυρίαρχο ρηματικό πρόσωπο και τι πετυχαίνει;", "α΄ ενικό: βιωματικότητα, εξομολογητικός τόνος", ["γ΄ ενικό: αντικειμενικότητα", "β΄ ενικό: διάλογος με τον αναγνώστη", "α΄ πληθυντικό: συλλογικότητα"], "Η αφήγηση σε α΄ ενικό δίνει αμεσότητα, αξιοπιστία μαρτυρίας και εξομολογητικό τόνο."],
  ["«Περπατάμε στην ομίχλη χωρίς σκοπό. Ανασαίνουμε την υγρασία της. Χανόμαστε μαζί με την πόλη.»", "Ποιο ρηματικό πρόσωπο κυριαρχεί και τι προσδίδει;", "α΄ πληθυντικό: συλλογικότητα, ο αναγνώστης γίνεται συμμέτοχος", ["α΄ ενικό: εξομολόγηση", "γ΄ ενικό: αντικειμενικότητα", "β΄ ενικό: ζωντάνια διαλόγου"], "Το «εμείς» δίνει αίσθηση κοινής εμπειρίας και κάνει τον αναγνώστη συνοδοιπόρο."],
  ["«Μπαίνεις στο άδειο σπίτι. Ακούς τα βήματά σου. Νιώθεις ότι κάποιος σε παρακολουθεί.»", "Ποιο ρηματικό πρόσωπο κυριαρχεί και τι προσδίδει;", "β΄ ενικό: οικειότητα, ο αναγνώστης ταυτίζεται με το πρόσωπο", ["α΄ πληθυντικό: συλλογικότητα", "γ΄ ενικό: απόσταση", "α΄ ενικό: μαρτυρία"], "Το «εσύ» μπορεί να είναι ο ίδιος ο αφηγητής ή ο αναγνώστης: δημιουργεί ζωντάνια και ταύτιση."],
  ["«Το έργο διηγείται, σε α΄ πρόσωπο, πώς ένας νέος άμαχος πιάστηκε αιχμάλωτος, πώς δραπέτευσε μεταμφιεσμένος και πώς επέστρεψε. Ο συγγραφέας δηλώνει ότι κατέγραψε την ιστορία όπως του την είπε ο ίδιος ο ήρωας.»", "Σε ποιο είδος πεζογραφίας ανήκει ένα τέτοιο έργο;", "αφήγηση-μαρτυρία (χρονικό) με στοιχεία νουβέλας", ["μυθιστόρημα επιστημονικής φαντασίας", "παραμύθι", "ευθυμογράφημα"], "Η καταγραφή πραγματικών βιωμάτων σε α΄ πρόσωπο κάνει το έργο μαρτυρία· η έκταση και η πλοκή θυμίζουν νουβέλα."],
  ["«Ο αφηγητής περιγράφει με κάθε λεπτομέρεια τον δρόμο, το λιμάνι, τη βροχή, ενώ η δράση σχεδόν σταματά.»", "Ποια είναι η λειτουργία της περιγραφής εδώ;", "επιβραδύνει την αφήγηση και δημιουργεί ατμόσφαιρα", ["επιταχύνει την πλοκή", "προαναγγέλλει το τέλος", "εισάγει νέο αφηγητή"], "Η εκτενής περιγραφή καθυστερεί τη δράση και χτίζει κλίμα/διάθεση: επιβράδυνση και ατμόσφαιρα."],
  ["«Ξαφνικά η πόρτα άνοιξε. — Ποιος είναι; φώναξε. Κανείς δεν απάντησε.»", "Τι προσφέρει ο διάλογος σε τέτοιο σημείο;", "ζωντάνια, αμεσότητα και δραματικότητα", ["αργό ρυθμό και στοχασμό", "ιστορικές πληροφορίες", "περιληπτική απόδοση γεγονότων"], "Ο ευθύς λόγος κάνει τη σκηνή άμεση, θεατρική, αυξάνει την ένταση."],
  ["«Ήταν ο Οκτώβρης του 1922. Όσοι είχαν γλιτώσει από τη φωτιά της πόλης στοιβάζονταν στην προκυμαία.»", "Τι προσφέρει η χρονική και ιστορική τοποθέτηση;", "ιστορικό πλαίσιο και αληθοφάνεια", ["χιουμοριστικό τόνο", "υπερρεαλιστική ατμόσφαιρα", "εσωτερικό μονόλογο"], "Η αναφορά σε πραγματικό ιστορικό χρόνο δένει την ιστορία με γεγονότα και την κάνει αληθοφανή."],
  ["«Αργότερα θα έλεγε ότι εκείνο το καλοκαίρι άλλαξε τη ζωή του· τότε όμως δεν το ήξερε.»", "Ποια αφηγηματική τεχνική χρησιμοποιείται;", "πρόληψη (προοικονομία)", ["αναδρομή", "εγκιβωτισμός", "εξωτερική εστίαση"], "Ο αφηγητής προαναγγέλλει τη μελλοντική σημασία των γεγονότων: πρόληψη."],
  ["«Ο αφηγητής αφηγείται σε α΄ ενικό τα δικά του βιώματα, και η ιστορία φτάνει σε μας μόνο μέσα από όσα είδε και ένιωσε ο ίδιος.»", "Ποια εστίαση έχουμε;", "εσωτερική εστίαση", ["μηδενική εστίαση", "εξωτερική εστίαση", "πολυεστιακή αφήγηση με παντογνώστη"], "Το γνωστικό πεδίο περιορίζεται σε όσα αντιλαμβάνεται ο αφηγητής-ήρωας: εσωτερική εστίαση."],
  ["«Πρώτα μας οδήγησαν στο στρατόπεδο. Ύστερα στη δουλειά στους δρόμους. Ύστερα στο νοσοκομείο. Ύστερα πάλι στη δουλειά.»", "Πώς οργανώνεται εδώ ο χρόνος;", "γραμμικά, με επιτάχυνση (σύντομη απαρίθμηση σταδίων)", ["με αναδρομή", "με επιβράδυνση", "με εγκιβωτισμό"], "Τα στάδια δίνονται χρονολογικά και πολύ σύντομα: γραμμική αφήγηση με επιτάχυνση."],
  ["«Θυμάμαι τη μάνα μου να ζυμώνει. Και τώρα, που κάθομαι σ’ αυτό το ξένο δωμάτιο, μυρίζω ακόμα το ψωμί.»", "Ποια σχέση έχει ο χρόνος της αφήγησης με τον χρόνο της ιστορίας;", "αφήγηση στο παρόν για γεγονότα του παρελθόντος, με εναλλαγή παρόντος–παρελθόντος", ["ταυτίζονται απόλυτα", "αφήγηση στο μέλλον", "δεν υπάρχει χρόνος"], "Ο αφηγητής μιλά από το παρόν («τώρα») και ανακαλεί το παρελθόν: εναλλαγή επιπέδων μέσω της μνήμης."],
  ["«Όλοι στο χωριό έλεγαν ότι ο μυλωνάς ήταν τσιγκούνης. Εκείνος γελούσε και μοίραζε κρυφά αλεύρι στις χήρες.»", "Τι πετυχαίνει η αντίθεση φήμης και πράξης;", "σκιαγράφηση χαρακτήρα με έμμεσο τρόπο (μέσα από τη δράση)", ["επιβράδυνση της πλοκής", "πρόληψη του τέλους", "εξωτερική εστίαση"], "Ο χαρακτήρας αποκαλύπτεται έμμεσα, από τις πράξεις του, που διαψεύδουν τη φήμη."]
];
/* ρεύματα: [δήλωση, σωστή, λάθη[], εξήγηση] */
const NC1_MOVQ = [
  ["Ο Γιώργος Σεφέρης θεωρείται κορυφαίος εκπρόσωπος…", "της Γενιάς του ’30 και του νεοελληνικού μοντερνισμού", ["του ρομαντισμού", "του νατουραλισμού", "της Α΄ μεταπολεμικής γενιάς"], "Με το «Μυθιστόρημα» (1935) ο Σεφέρης φέρνει τον ελεύθερο στίχο και τη μυθική μέθοδο: Γενιά του ’30."],
  ["Ο Ανδρέας Εμπειρίκος με την «Υψικάμινο» (1935) εισάγει στην Ελλάδα…", "τον υπερρεαλισμό", ["τον συμβολισμό", "τον ρεαλισμό", "την ηθογραφία"], "Η «Υψικάμινος» είναι η πρώτη ελληνική υπερρεαλιστική συλλογή, με αυτόματη γραφή."],
  ["Η «αυτόματη γραφή» και η απελευθέρωση του ασυνειδήτου είναι χαρακτηριστικά…", "του υπερρεαλισμού", ["του κλασικισμού", "της Επτανησιακής Σχολής", "του νεορεαλισμού"], "Ο Μπρετόν (Μανιφέστο, 1924) ορίζει τον υπερρεαλισμό ως ψυχικό αυτοματισμό."],
  ["Η «μυθική μέθοδος» (ο αρχαίος μύθος ως σχήμα για το σύγχρονο χάος) συνδέεται κυρίως με…", "τον Τ. Σ. Έλιοτ και τον Σεφέρη", ["τον Σολωμό και τον Κάλβο", "τον Μπωντλαίρ και τον Βερλέν", "τον Παπαδιαμάντη"], "Ο Έλιοτ τη διατυπώνει· ο Σεφέρης την εφαρμόζει, π.χ. στους «Αργοναύτες» (Μυθιστόρημα Δ΄)."],
  ["Η διάψευση των οραμάτων μετά τον Εμφύλιο, η πολιτική απογοήτευση και η λιτή, αντιρητορική γλώσσα χαρακτηρίζουν…", "την Α΄ μεταπολεμική γενιά", ["τη Γενιά του ’30", "τη Νέα Αθηναϊκή Σχολή", "τον συμβολισμό"], "Αναγνωστάκης, Πατρίκιος, Σαχτούρης κ.ά. γράφουν μετά τον πόλεμο και τον Εμφύλιο: Α΄ μεταπολεμική."],
  ["Ο Μανόλης Αναγνωστάκης ανήκει…", "στην Α΄ μεταπολεμική γενιά", ["στη Γενιά του ’30", "στη Γενιά του ’70", "στην Επτανησιακή Σχολή"], "Ποιητής της Θεσσαλονίκης, με εμπειρία Αντίστασης και διώξεων· κεντρική μορφή της Α΄ μεταπολεμικής ποίησης."],
  ["Ο Μίλτος Σαχτούρης συνδέεται με…", "την Α΄ μεταπολεμική γενιά, με έντονα υπερρεαλιστικά στοιχεία", ["τον ρομαντισμό", "τη Γενιά του 1880", "τη δημοτική ποίηση"], "Οι παράδοξες, εφιαλτικές εικόνες του (υπερρεαλισμός) εκφράζουν τη μεταπολεμική αγωνία."],
  ["Ο Νίκος Εγγονόπουλος, ποιητής και ζωγράφος, είναι από τους κύριους εκπροσώπους…", "του ελληνικού υπερρεαλισμού (Γενιά του ’30)", ["του νατουραλισμού", "της αντιπολεμικής πεζογραφίας", "της ηθογραφίας"], "Μαζί με τον Εμπειρίκο, ο Εγγονόπουλος είναι ο σημαντικότερος Έλληνας υπερρεαλιστής."],
  ["Ο Οδυσσέας Ελύτης στους «Προσανατολισμούς» (1940) αφομοιώνει δημιουργικά…", "τον υπερρεαλισμό, με λυρισμό και φως του Αιγαίου", ["τον νατουραλισμό", "τον κλασικισμό", "την ηθογραφία"], "Τολμηρές εικόνες, ελευθερία φαντασίας, αλλά πάντα λυρική και ηλιακή διάθεση."],
  ["Το δοκίμιο «Ελεύθερο πνεύμα» (1929) του Γ. Θεοτοκά θεωρείται…", "μανιφέστο της Γενιάς του ’30", ["μανιφέστο του υπερρεαλισμού", "έργο της Α΄ μεταπολεμικής γενιάς", "κυπριακό χρονικό"], "Ζητά ανανέωση και ευρωπαϊκό προσανατολισμό της ελληνικής λογοτεχνίας."],
  ["Ο Κ. Π. Καβάφης…", "δεν ανήκει σε κάποια σχολή· δημιουργεί προσωπική ποιητική με ιστορικά προσωπεία", ["είναι ο αρχηγός της Γενιάς του ’30", "είναι υπερρεαλιστής", "είναι εκπρόσωπος της Α΄ μεταπολεμικής"], "Ο Αλεξανδρινός ποιητής (1863–1933) έχει μοναδική φωνή, που επηρεάζει όλους τους νεότερους."],
  ["Ο Στρατής Δούκας με την «Ιστορία ενός αιχμαλώτου» (1929) εντάσσεται…", "στην αντιπολεμική/μικρασιατική πεζογραφία της Γενιάς του ’30", ["στον υπερρεαλισμό", "στη Νέα Αθηναϊκή Σχολή", "στον ρομαντισμό"], "Η Μικρασιατική Καταστροφή γεννά πεζογραφία-μαρτυρία (Δούκας, Βενέζης, Σωτηρίου)."],
  ["Ο Γιώργος Ιωάννου γράφει πεζογραφήματα μνήμης για…", "τη Θεσσαλονίκη", ["την Αμμόχωστο", "την Αλεξάνδρεια", "τη Σμύρνη"], "Η Θεσσαλονίκη, οι πρόσφυγες και η μνήμη είναι κεντρικά θέματα του Ιωάννου."],
  ["Η «Αμμόχωστος Βασιλεύουσα» (1982) είναι έργο…", "του Κυριάκου Χαραλαμπίδη", ["του Κώστα Μόντη", "του Μανόλη Αναγνωστάκη", "του Γιώργου Σεφέρη"], "Η συλλογή του Χαραλαμπίδη είναι αφιερωμένη στην κατεχόμενη πόλη, με την οποία τον δένουν τα νεανικά του χρόνια."],
  ["Η κυπριακή ποίηση του 2ου μισού του 20ού αιώνα (Μόντης, Χαραλαμπίδης κ.ά.) συνδυάζει…", "μοντερνιστική έκφραση με την κυπριακή ιστορική εμπειρία", ["αυστηρό δεκαπεντασύλλαβο και ηθογραφία", "αυτόματη γραφή χωρίς ιστορικό περιεχόμενο", "ρομαντική ποίηση του 19ου αιώνα"], "Αγώνας, Ανεξαρτησία, εισβολή, προσφυγιά, εκφρασμένα με ελεύθερο στίχο και σύμβολα."],
  ["Ο Αλμπέρ Καμύ γράφει τα «Γράμματα σ’ ένα Γερμανό φίλο» την περίοδο…", "της γερμανικής κατοχής της Γαλλίας (1943–1944)", ["του Α΄ Παγκοσμίου Πολέμου", "του Ψυχρού Πολέμου", "της Γαλλικής Επανάστασης"], "Είναι κείμενα της γαλλικής Αντίστασης, με ανθρωπιστικό και αντιναζιστικό μήνυμα."],
  ["Ο Αλμπέρ Καμύ τιμήθηκε με το Βραβείο Νόμπελ Λογοτεχνίας το…", "1957", ["1963", "1979", "1948"], "Ο Καμύ πήρε το Νόμπελ το 1957· ο Σεφέρης το 1963, ο Ελύτης το 1979."],
  ["Ο Γιώργος Σεφέρης τιμήθηκε με το Νόμπελ Λογοτεχνίας το…", "1963", ["1979", "1957", "1931"], "Πρώτος Έλληνας νομπελίστας (1963)· ο Ελύτης ακολουθεί το 1979."],
  ["Ο Οδυσσέας Ελύτης τιμήθηκε με το Νόμπελ Λογοτεχνίας το…", "1979", ["1963", "1957", "1940"], "Ο Ελύτης πήρε το Νόμπελ το 1979."],
  ["Ο ελεύθερος στίχος, η απουσία μέτρου και ομοιοκαταληξίας, η χαλαρή στίξη και τα σύμβολα είναι γνωρίσματα…", "της μοντέρνας ποίησης", ["της δημοτικής ποίησης", "της παραδοσιακής έντεχνης ποίησης", "του κλασικισμού"], "Η Σύνοψη Λογοτεχνικού Γραμματισμού τα αναφέρει ως χαρακτηριστικά της μοντέρνας ποίησης."],
  ["Ο δεκαπεντασύλλαβος, το σχήμα των τριών, το σχήμα του αδυνάτου και τα τυπικά επίθετα χαρακτηρίζουν…", "τη δημοτική ποίηση", ["τον υπερρεαλισμό", "τη μοντέρνα ποίηση", "την αντιπολεμική πεζογραφία"], "Είναι τα βασικά γνωρίσματα του δημοτικού τραγουδιού."],
  ["Μέτρο, στροφές, ομοιοκαταληξία και λυρικό ύφος χαρακτηρίζουν…", "την παραδοσιακή (έμμετρη) ποίηση", ["τη μοντέρνα ποίηση", "τον υπερρεαλισμό", "το θέατρο του παραλόγου"], "Η παραδοσιακή επώνυμη ποίηση διατηρεί μέτρο και ομοιοκαταληξία."],
  ["Ο «Ερωτικός λόγος» του Σεφέρη περιλαμβάνεται στη συλλογή…", "«Στροφή» (1931)", ["«Μυθιστόρημα» (1935)", "«Ήλιος ο πρώτος» (1943)", "«Ο Στόχος» (1970)"], "Η «Στροφή» είναι η πρώτη συλλογή του Σεφέρη, ακόμη με μέτρο και ομοιοκαταληξία."],
  ["Η «Μικρή πράσινη θάλασσα» του Ελύτη ανήκει στη συλλογή…", "«Ήλιος ο πρώτος» (1943)", ["«Προσανατολισμοί» (1940)", "«Άξιον εστί» (1959)", "«Στροφή» (1931)"], "Ο «Ήλιος ο πρώτος» κυκλοφόρησε μέσα στην Κατοχή, με φωτεινή, αισιόδοξη διάθεση."],
  ["«Η Μαρίνα των βράχων» του Ελύτη ανήκει στη συλλογή…", "«Προσανατολισμοί» (1940)", ["«Ήλιος ο πρώτος» (1943)", "«Το Άξιον Εστί» (1959)", "«Μυθιστόρημα» (1935)"], "Οι «Προσανατολισμοί» είναι η πρώτη συλλογή του Ελύτη."],
  ["Η «Ομίχλη» του Γ. Ιωάννου ανήκει στη συλλογή πεζογραφημάτων…", "«Η μόνη κληρονομιά» (1974)", ["«Για ένα φιλότιμο» (1964)", "«Αιολική γη» (1943)", "«Ματωμένα χώματα» (1962)"], "Η «Ομίχλη» περιλαμβάνεται στη «Μόνη κληρονομιά» (1974)."],
  ["Ο «Επίλογος» του Αναγνωστάκη είναι το καταληκτικό ποίημα της συλλογής…", "«Ο Στόχος» (1970)", ["«Εποχές» (1945)", "«Έλευσις» (1948)", "«Στροφή» (1931)"], "Ο «Στόχος» (1970) γράφτηκε στα χρόνια της Δικτατορίας· ο «Επίλογος» τον κλείνει."],
  ["Το «Ποίηση 1948» του Εγγονόπουλου γράφτηκε μέσα στον…", "Εμφύλιο Πόλεμο", ["Β΄ Παγκόσμιο Πόλεμο", "Μικρασιατικό πόλεμο", "Κυπριακό αγώνα 1955–59"], "Ο τίτλος παραπέμπει στο 1948, στην καρδιά του Εμφυλίου (1946–1949)."],
  ["Ο Καβάφης χρησιμοποιεί συχνά ιστορικά (ή φανταστικά) πρόσωπα ως «προσωπεία». Αυτό σημαίνει ότι…", "μέσα από αυτά εκφράζει δικές του διαχρονικές σκέψεις και βιώματα", ["γράφει ιστορικές μελέτες σε στίχους", "αντιγράφει αρχαίους συγγραφείς", "αποφεύγει κάθε προσωπικό στοιχείο"], "Το προσωπείο (π.χ. Ιάσων Κλεάνδρου) επιτρέπει στον ποιητή να μιλήσει για τον εαυτό του έμμεσα."],
  ["Ο Σαρλ Μπωντλαίρ («Τα άνθη του κακού», 1857) θεωρείται πρόδρομος…", "του συμβολισμού και της μοντέρνας ποίησης", ["του ρομαντισμού του 18ου αιώνα", "της δημοτικής ποίησης", "του σοσιαλιστικού ρεαλισμού"], "Η ποίηση των «αντιστοιχιών» και των συμβόλων ανοίγει τον δρόμο στη μοντέρνα ποίηση."],
  ["Η Γενιά του ’30 αναζητά την «ελληνικότητα». Αυτό σημαίνει…", "σύνδεση της ελληνικής παράδοσης (αρχαίας, βυζαντινής, λαϊκής) με τη νεωτερική τέχνη", ["απόρριψη κάθε ευρωπαϊκής επίδρασης", "επιστροφή στην καθαρεύουσα", "αποκλειστικά ηθογραφικά θέματα"], "Σεφέρης, Ελύτης κ.ά. συνδυάζουν μοντερνισμό και ελληνική παράδοση."],
  ["«Ποίημα ποιητικής» λέγεται το ποίημα που…", "στοχάζεται πάνω στη φύση, τον ρόλο και τη δύναμη της ίδιας της ποίησης", ["έχει αυστηρό μέτρο", "γράφεται για παιδιά", "αφηγείται ιστορικό γεγονός"], "Π.χ. «Μελαγχολία…» (Καβάφης), «Επίλογος» (Αναγνωστάκης), «Ποίηση 1948» (Εγγονόπουλος), «Ο ελεγκτής» (Σαχτούρης)."]
];

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  nc1exam(box) { nc1Exam(box); },
  nc1detect(box) { nc1Detect(box); },
  nc1timeline(box) { nc1Timeline(box); },
  nc1annot(box) { nc1Annot(box); },
  nc1cmp(box) {
    nc1Matrix(box, { id: "cmp12", title: "Σύγκριση: Καβάφης, «Μελαγχολία του Ιάσωνος Κλεάνδρου…» (διδαγμένο) ↔ πρωτότυπο αδίδακτο ποίημα «Το σημειωματάριο» (βλ. θεωρία). Συμπλήρωσε τα κελιά και μετά άνοιξε τα ενδεικτικά σημεία.",
      a: "Διδαγμένο (Καβάφης)", b: "Αδίδακτο («Το σημειωματάριο»)",
      rows: [
        { k: "Θέμα", a: "Το γήρας ως πληγή· η Ποίηση ως προσωρινό «φάρμακο».", b: "Η απώλεια ενός αγαπημένου προσώπου· η γραφή ως τρόπος να μείνει ζωντανή η μνήμη." },
        { k: "Ποιητικό υποκείμενο / πρόσωπο", a: "Α΄ ενικό, προσωπείο ενός φανταστικού ποιητή (Ιάσων, 595 μ.Χ.)· εξομολόγηση και ικεσία.", b: "Α΄ ενικό, σύγχρονος ομιλητής που απευθύνεται (β΄ πρόσωπο) στον χαμένο φίλο." },
        { k: "Ρόλος της ποίησης/τέχνης", a: "Απαλύνει «για λίγο» τον πόνο — δεν θεραπεύει.", b: "Διατηρεί τη μνήμη, αλλά δεν φέρνει πίσω τον άνθρωπο." },
        { k: "Εκφραστικά μέσα", a: "Μεταφορά (πληγή από μαχαίρι, φάρμακα), προσωποποίηση/αποστροφή (Τέχνη της Ποιήσεως), επανάληψη στίχου.", b: "Προσωποποίηση (το σημειωματάριο «ανασαίνει»), παρομοίωση («σαν να περιμένει»), επανάληψη («γράφω»), αντίθεση άδειο δωμάτιο ↔ γεμάτες σελίδες." },
        { k: "Ύφος / γλώσσα", a: "Λιτό, πεζολογικό, με λόγια στοιχεία (Εις σε προστρέχω, εν Φαντασία και Λόγω).", b: "Απλή καθημερινή γλώσσα, ελεύθερος στίχος, τρυφερός τόνος." }
      ],
      synth: "Και στα δύο η τέχνη/γραφή είναι καταφύγιο απέναντι σε μια απώλεια (σώμα ↔ πρόσωπο) και η δύναμή της είναι περιορισμένη. Διαφέρουν στην αιτία του πόνου, στο ύφος (λόγιο-ειρωνικό ↔ απλό-τρυφερό) και στον αποδέκτη (Ποίηση ↔ φίλος).",
      tip: "Στις Παγκύπριες: για κάθε άξονα γράφε <b>ομοιότητα ή διαφορά + τεκμήριο από ΚΑΙ τα δύο κείμενα</b> (στίχος/φράση σε εισαγωγικά). Χωρίς τεκμηρίωση, η απάντηση χάνει μονάδες." });
  },
  nc1move(box) {
    nc1Classify(box, { title: "Σε ποιο ρεύμα/τάση ανήκει κάθε γνώρισμα ή δημιουργός;", cats: ["Γενιά του ’30 / μοντερνισμός", "Υπερρεαλισμός", "Α΄ μεταπολεμική", "Κυπριακή ποίηση 2ου μισού 20ού αι."], items: [
      { t: "Μυθική μέθοδος: ο μύθος των Αργοναυτών εκφράζει τη σύγχρονη ελληνική μοίρα.", c: 0, why: "Σεφέρης, «Μυθιστόρημα» (1935)." },
      { t: "Αναζήτηση της ελληνικότητας: σύνδεση της αρχαίας και βυζαντινής παράδοσης με τη μοντέρνα τέχνη.", c: 0, why: "Κεντρικό αίτημα της Γενιάς του ’30." },
      { t: "Το δοκίμιο «Ελεύθερο πνεύμα» (1929) ζητά ανανέωση της λογοτεχνίας.", c: 0, why: "Θεοτοκάς — μανιφέστο της Γενιάς." },
      { t: "Αυτόματη γραφή και απρόσμενοι συνδυασμοί λέξεων, όπως στο όνειρο.", c: 1, why: "Βασικό εργαλείο του υπερρεαλισμού (Μπρετόν 1924, Εμπειρίκος 1935)." },
      { t: "Ο Νίκος Εγγονόπουλος, ποιητής και ζωγράφος.", c: 1, why: "Μαζί με τον Εμπειρίκο, κορυφαίος Έλληνας υπερρεαλιστής." },
      { t: "Παράδοξες, ονειρικές εικόνες που παραβιάζουν τη λογική αλληλουχία.", c: 1, why: "Τυπικό υπερρεαλιστικό γνώρισμα." },
      { t: "Διάψευση των οραμάτων μετά τον Εμφύλιο, πολιτική απογοήτευση, αυτοκριτική.", c: 2, why: "Αναγνωστάκης, Πατρίκιος κ.ά." },
      { t: "Λιτή, αντιρητορική γλώσσα και ερώτημα για το αν η ποίηση μπορεί να αλλάξει τον κόσμο.", c: 2, why: "Π.χ. «Επίλογος» του Αναγνωστάκη." },
      { t: "Ο ποιητής ως άγρυπνος φύλακας μέσα σε έναν πληγωμένο, ματωμένο κόσμο· η ευθύνη να συνεχίσει, ακόμη και πληγωμένος.", c: 2, why: "Σαχτούρης, «Ο ελεγκτής»." },
      { t: "Η κατεχόμενη Αμμόχωστος ως αγαπημένη, πληγωμένη πόλη.", c: 3, why: "Χαραλαμπίδης, «Αμμόχωστος Βασιλεύουσα» (1982)." },
      { t: "Συλλογικό «εμείς» των ποιητών όλων των εποχών, από τον Όμηρο ως σήμερα.", c: 3, why: "Μόντης, «Όλοι εμείς που γράφουμε στίχους»." },
      { t: "Μοντερνιστική γραφή στην υπηρεσία της εμπειρίας του 1974: προσφυγιά, διχοτόμηση, νόστος.", c: 3, why: "Κυπριακή ποίηση μετά την εισβολή." }
    ] });
  },
  nc1eros(box) {
    nc1Cards(box, { title: "Σεφέρης, «Ερωτικός λόγος»: οι βασικές εικόνες-σύμβολα. Πάτησε κάθε κάρτα.", cards: [
      { f: "Το ρόδο", b: "Σύμβολο του έρωτα αλλά και της μοίρας: η ομορφιά του έρωτα είναι δεμένη με τον πόνο και τη φθορά. Το ρόδο συνδέεται με τη μοίρα και τον άνεμο — δηλαδή με ό,τι δεν ελέγχει ο άνθρωπος." },
      { f: "Η θάλασσα", b: "Το απέραντο, η απόσταση, το ταξίδι, ο αποχωρισμός· αλλά και η μνήμη που επιστρέφει σαν κύμα." },
      { f: "Ο άνεμος", b: "Η ρευστότητα, η αλλαγή, ο χρόνος που παρασέρνει· ό,τι φέρνει και παίρνει την αγάπη." },
      { f: "Η αυγή / το φως", b: "Η ελπίδα, η προσδοκία μιας νέας αρχής, η στιγμή της αποκάλυψης του συναισθήματος." },
      { f: "Η νύχτα", b: "Η απουσία, η μοναξιά, η ανάμνηση του χαμένου προσώπου." },
      { f: "Η μουσική (τραγούδι, αυλός)", b: "Η ψυχή συνδέεται με τη μουσική και τη γραφή: η τέχνη ως έκφραση του έρωτα — η ποιητική διάσταση του ποιήματος." }
    ], tip: "Γράφε πάντα <b>σύμβολο → τι συμβολίζει → πώς συνδέεται με τα συναισθήματα του ποιητικού υποκειμένου</b> (αγάπη, νοσταλγία, προσδοκία, απώλεια)." });
  },
  nc1argo(box) {
    nc1Classify(box, { title: "Σεφέρης, «Μυθιστόρημα Δ΄ — Αργοναύτες»: σε ποιο επίπεδο ανήκει κάθε στοιχείο;", cats: ["Μυθικό επίπεδο (Αργοναυτική εκστρατεία)", "Σύγχρονο/ιστορικό επίπεδο (νεότερος ελληνισμός)", "Στοχαστικό σχόλιο του ποιητή"], items: [
      { t: "Οι σύντροφοι κάθονται στα κουπιά και τραβούν σιωπηλά, μέρα με τη μέρα.", c: 0, why: "Η εικόνα της κωπηλασίας της Αργώ." },
      { t: "Ταξίδι σε μακρινές ακτές και θάλασσες, αναζήτηση ενός στόχου.", c: 0, why: "Το ταξίδι των Αργοναυτών για το χρυσόμαλλο δέρας." },
      { t: "Οι σύντροφοι πεθαίνουν ένας ένας και θάβονται στις ακρογιαλιές, με τα κουπιά να σημαδεύουν τους τάφους τους.", c: 0, why: "Μυθική εικόνα — αλλά υπαινίσσεται και τους ανώνυμους νεκρούς κάθε εποχής." },
      { t: "Οι ανώνυμοι, καρτερικοί άνθρωποι που μόχθησαν και ξεχάστηκαν· η συλλογική μοίρα και η περιπλάνηση των Ελλήνων.", c: 1, why: "Ο μύθος μεταφέρεται στη σύγχρονη εμπειρία (μετά το 1922, προσφυγιά, πόλεμοι)." },
      { t: "Η αίσθηση ότι κανείς δεν θυμάται τους σιωπηλούς συντρόφους.", c: 1, why: "Η λησμονιά των απλών ανθρώπων της ιστορίας." },
      { t: "Η αυτογνωσία: η ψυχή, για να γνωρίσει τον εαυτό της, πρέπει να κοιτάξει μέσα σε άλλη ψυχή (το πλατωνικό μότο).", c: 2, why: "Το μότο από τον πλατωνικό «Αλκιβιάδη» δίνει τη στοχαστική διάσταση." },
      { t: "Η δικαίωση των ανώνυμων: ένα αίτημα δικαιοσύνης στο κλείσιμο του ποιήματος.", c: 2, why: "Το κλείσιμο μετατρέπει την αφήγηση σε ηθικό στοχασμό." }
    ] });
  },
  nc1elytis(box) {
    nc1Classify(box, { title: "Ελύτης: σε ποιο ποίημα ταιριάζει κάθε στοιχείο;", cats: ["«Η Μαρίνα των βράχων»", "«Μικρή πράσινη θάλασσα»", "Και στα δύο"], items: [
      { t: "Το ποιητικό υποκείμενο απευθύνεται σε μια κοπέλα με όνομα και τη ρωτά πού γύριζε.", c: 0, why: "Η επαναλαμβανόμενη ερώτηση προς τη Μαρίνα." },
      { t: "Η θάλασσα παρουσιάζεται ως νεαρή κοπέλα, που ο ποιητής θέλει να τη μορφώσει και να τη μεγαλώσει.", c: 1, why: "Προσωποποίηση της θάλασσας." },
      { t: "Αναφορές στην Ιωνία, τη Σμύρνη, τον Ηράκλειτο και τη βυζαντινή υμνολογία.", c: 1, why: "Πολιτισμική μνήμη και ελληνικότητα." },
      { t: "Ο έρωτας, η επιθυμία και η φθορά που φέρνει ο χρόνος στους ανθρώπους.", c: 0, why: "Ερωτικό ποίημα με αγωνία για τον χρόνο." },
      { t: "Β΄ πρόσωπο: ο ποιητής μιλά απευθείας σε κάποιον/κάτι.", c: 2, why: "Και τα δύο είναι αποστροφές σε β΄ πρόσωπο." },
      { t: "Αιγαιοπελαγίτικο τοπίο, φως, θάλασσα, καλοκαίρι — η «ηλιακή» ποίηση του Ελύτη.", c: 2, why: "Κοινά μοτίβα της ποίησης του Ελύτη." },
      { t: "Συλλογή «Προσανατολισμοί» (1940).", c: 0, why: "" },
      { t: "Συλλογή «Ήλιος ο πρώτος» (1943).", c: 1, why: "" },
      { t: "Ποίημα ποιητικής: η ποίηση διασώζει και ανασυνθέτει την πολιτισμική παράδοση.", c: 1, why: "Η «αγωγή» της θάλασσας γίνεται μεταφορά της ποιητικής δημιουργίας." }
    ] });
  },
  nc1doukas(box) {
    nc1Order(box, { title: "Στρατής Δούκας, «Ιστορία ενός αιχμαλώτου»: βάλε τα βασικά επεισόδια στη χρονολογική σειρά της ιστορίας.", steps: [
      "Η Μικρασιατική Καταστροφή (1922): ο αφηγητής, νέος άμαχος Μικρασιάτης, συλλαμβάνεται μετά την καταστροφή της Σμύρνης και χωρίζεται από τους δικούς του.",
      "Οι πορείες των αιχμαλώτων προς τα τάγματα εργασίας (αμελέ ταμπουρού), η πείνα, οι ξυλοδαρμοί και οι θάνατοι συντρόφων.",
      "Η καταναγκαστική εργασία και η αγωνία για επιβίωση.",
      "Η απόφαση για διαφυγή και η μεταμφίεση, ώστε να περνά για ντόπιος.",
      "Η περιπλάνηση στην ενδοχώρα, οι κίνδυνοι και η βοήθεια από απλούς ανθρώπους.",
      "Η επιστροφή του στην ελευθερία, ανάμεσα στους δικούς του ανθρώπους."
    ], done: "Η πλοκή είναι γραμμική και κρατά την αγωνία μέσα από διαδοχικές δοκιμασίες· μικρές αναδρομές συμπληρώνουν το παρελθόν του αφηγητή.", tip: "Η αφήγηση είναι σε α΄ πρόσωπο (ομοδιηγητικός-αυτοδιηγητικός αφηγητής): η σειρά των επεισοδίων ακολουθεί σχεδόν πάντα τον χρόνο της ιστορίας." });
  },
  nc1omichli(box) {
    nc1Classify(box, { title: "Γιώργος Ιωάννου, «Ομίχλη»: αφηγηματικός τρόπος ή επίπεδο χρόνου κάθε στοιχείου.", cats: ["Παρελθόν (ανάμνηση)", "Παρόν της αφήγησης", "Σχόλιο / στοχασμός"], items: [
      { t: "Ο αφηγητής θυμάται πώς περίμενε τις μέρες της ομίχλης και άλλαζε σχέδια για να βγει στην παραλία.", c: 0, why: "Παρατατικοί, ανάμνηση της νεότητας." },
      { t: "Οι περίπατοι στο καφενείο του λιμανιού, που σήμερα έχει γκρεμιστεί, και η αναμονή της παρέας.", c: 0, why: "Ανάμνηση — με νύξη για τη σημερινή φθορά του χώρου." },
      { t: "Ο αφηγητής δηλώνει ότι δεν ξέρει πια τι γίνεται με την ομίχλη σήμερα.", c: 1, why: "Το παρόν από το οποίο ξεκινά η αφήγηση." },
      { t: "Σήμερα, όταν πέφτει ομίχλη, γίνεται ένα μ’ αυτήν και ακολουθεί σκιές νεκρών, ονομάζοντάς τες.", c: 1, why: "Ενεστώτες: το παρόν, όπου η ομίχλη πια αναδύεται από τα όνειρα." },
      { t: "Η γενική διαπίστωση ότι κανένας θάνατος δεν είναι καλός και η ευχή να ξαναβρούμε τους νεκρούς.", c: 2, why: "Σχόλιο-στοχασμός του αφηγητή για τον θάνατο." },
      { t: "Η θέση του αφηγητή ότι μέσα στην ομίχλη πρέπει κανείς να περπατά και ότι η ομίχλη ταιριάζει μόνο με λιμάνι.", c: 2, why: "Αποφθεγματικό σχόλιο, προσωπική «φιλοσοφία» του αφηγητή." },
      { t: "Το βάδισμα στις ομιχλιασμένες νύχτες φέρνει ανακούφιση· ο πόνος σαν να φεύγει από το σώμα προς το χώμα.", c: 1, why: "Το κλείσιμο, στο παρόν: η ομίχλη ως παρηγοριά." }
    ] });
  },
  nc1elegktis(box) {
    nc1Cards(box, { title: "Σαχτούρης, «Ο ελεγκτής»: σύμβολα και εικόνες. Πάτησε κάθε κάρτα.", cards: [
      { f: "Ο τίτλος-ρόλος", b: "Ο ίδιος ο ποιητής: έχει χρέος να επιβλέπει τον κόσμο, να μένει άγρυπνος και υπεύθυνος μέσα στην καταστροφή." },
      { f: "Η εικόνα του ματωμένου ουρανού", b: "Υπερρεαλιστική εικόνα: ο κόσμος μετά τον πόλεμο είναι ματωμένος· ακόμη και το ιδανικό (ουρανός) έχει πληγωθεί." },
      { f: "Τα αστέρια", b: "Οι αξίες, τα ιδανικά, η ομορφιά — αυτό για το οποίο ο ποιητής οφείλει να επαγρυπνεί." },
      { f: "Τα πουλιά", b: "Σύμβολο της ποίησης και της ελευθερίας· ο ποιητής παρουσιάζεται ως συνεχιστής τους, μέρος μιας παράδοσης." },
      { f: "Η εικόνα του τραυματισμένου πετάγματος", b: "Η πληγωμένη ποίηση/ο τραυματισμένος ποιητής, που οφείλει όμως να συνεχίζει — αντίσταση παρά τη συντριβή." },
      { f: "Η χρωματική αντίθεση", b: "Το κόκκινο απέναντι στο λευκό: αντίθεση βίας και αγνότητας, θανάτου και καθαρότητας: δραματική ένταση." }
    ], tip: "Σύγκρινε με τον «Άλμπατρο» του Μπωντλαίρ (το πουλί-ποιητής) — πρόταση του Πλαισίου Μάθησης." });
  },
  nc1anag(box) {
    nc1Classify(box, { title: "Αναγνωστάκης, «Επίλογος»: τι μπορεί και τι δεν μπορεί να κάνει η ποίηση, σύμφωνα με το ποίημα;", cats: ["Δεν μπορεί", "Μπορεί / οφείλει"], items: [
      { t: "Να κινητοποιήσει τις μάζες.", c: 0, why: "Ρητή διαπίστωση του ποιήματος." },
      { t: "Να ανατρέψει καθεστώτα.", c: 0, why: "Η ποίηση δεν είναι πολιτική δύναμη." },
      { t: "Να δείξει ότι ο άνθρωπος ζει ακόμα, ότι είναι παρών — μια μαρτυρία ζωής.", c: 1, why: "Οι στίχοι λειτουργούν σαν σύντομο μήνυμα ότι ο ποιητής υπάρχει και αντέχει." },
      { t: "Να καλλιεργήσει αυταπάτες για το μέλλον.", c: 0, why: "Το ποίημα απορρίπτει ρητά τις αυταπάτες." },
      { t: "Να οδηγήσει στην αυτοκριτική και την προσωπική ευθύνη.", c: 1, why: "Η ποίηση στρέφει το βλέμμα στον ίδιο τον άνθρωπο και στην ευθύνη του." },
      { t: "Να είναι ειλικρινής, χωρίς μεγαλοστομίες.", c: 1, why: "Λιτός, αποφθεγματικός λόγος." },
      { t: "Να αλλάξει από μόνη της την ιστορία.", c: 0, why: "Τα όρια της ποίησης είναι σαφή." }
    ] });
  },
  nc1engo(box) {
    nc1Cards(box, { title: "Εγγονόπουλος, «Ποίηση 1948»: λέξεις-κλειδιά και μορφή.", cards: [
      { f: "Ο σπαραγμός του Εμφυλίου", b: "Η εποχή του Εμφυλίου ως σπαραγμός του σώματος του έθνους — βία, διχασμός, θάνατος." },
      { f: "Αγγελτήρια θανάτου", b: "Τολμηρή, υπερρεαλιστική εικόνα: τα ποιήματα μοιάζουν γραμμένα στην πίσω πλευρά αγγελτηρίων θανάτου — η ποίηση είναι πια πένθος." },
      { f: "Η πίκρα των ποιημάτων", b: "Η ποίηση της εποχής δεν μπορεί να είναι ανέμελη· είναι γεμάτη πίκρα." },
      { f: "Μονολεκτικοί στίχοι", b: "Η «σπασμένη» τυπογραφική διάταξη αποδίδει τη διάλυση, τη δυσκολία της γραφής, την ψυχική ένταση." },
      { f: "Παρένθεση", b: "Δίνει χαμηλόφωνο, εξομολογητικό σχόλιο — σαν ο ποιητής να μιλά στον εαυτό του." },
      { f: "Η επίμονη επανάληψη", b: "Τονίζει την απελπισμένη διαπίστωση: η εποχή αρνείται την ποίηση — κι όμως εκείνος γράφει." }
    ], tip: "Συνεξέταση προτείνεται με το «Στον Νίκο Ε… 1949» του Αναγνωστάκη: διάλογος δύο ποιητών για την ποίηση στον Εμφύλιο." });
  },
  nc1monti(box) {
    nc1Cards(box, { title: "Μόντης, «Όλοι εμείς που γράφουμε στίχους»: εικόνες και σημασίες.", cards: [
      { f: "Το α΄ πληθυντικό πρόσωπο", b: "Συλλογικό ποιητικό υποκείμενο: ο ποιητής μιλά εκ μέρους όλων των ποιητών — αλληλεγγύη, κοινή ευθύνη." },
      { f: "Ποιητές πλούσιοι και φτωχοί", b: "Αντίθεση που δείχνει ότι η ποίηση υπερβαίνει κοινωνικές τάξεις: όλοι οι ποιητές είναι ίσοι." },
      { f: "Ποιητές κάθε χώρας, ανεξάρτητα από την ανάπτυξή της", b: "Η ποίηση ενώνει λαούς και κοινωνίες ανεξάρτητα από την οικονομική ανάπτυξη: οικουμενικότητα." },
      { f: "Η αλυσίδα των ποιητών από την αρχαιότητα", b: "Η διαχρονική συνέχεια της ποίησης: ο σημερινός ποιητής συνεχίζει μια αρχαία παράδοση." },
      { f: "Η πληγή που διαπερνά τη Γη", b: "Ο πόνος του κόσμου, που οι ποιητές νιώθουν και εκφράζουν· μεταφορά της παγκόσμιας οδύνης." },
      { f: "Η εικόνα της ανάτασης", b: "Τα όνειρα και οι ελπίδες των ποιητών παρουσιάζονται να υψώνονται σαν παιχνίδι στον αέρα — η ποίηση ως ανάταση." },
      { f: "Η εικόνα της σημαίας", b: "Σημαία αγώνα: η ποίηση ως πράξη αντίστασης και υπεράσπισης της ελευθερίας." }
    ], tip: "Ο Μόντης γράφει με απλό, καθημερινό λεξιλόγιο, ελεύθερο στίχο και επαναλήψεις — συχνά με ειρωνική ή τρυφερή διάθεση." });
  },
  nc1amm(box) {
    nc1Cards(box, { title: "Χαραλαμπίδης, «Αμμόχωστος Βασιλεύουσα»: η πόλη ως πρόσωπο. Πάτησε κάθε κάρτα.", cards: [
      { f: "Η πόλη-αγαπημένη", b: "Ο ποιητής απευθύνεται στην Αμμόχωστο σαν σε ερωμένη (β΄ πρόσωπο): σχέση ερωτική, βιωματική και συμβολική." },
      { f: "Η ανθεκτική πόλη", b: "Η ισχυρή, ανθεκτική πόλη με τα ενετικά τείχη — ιστορική δύναμη και περηφάνια." },
      { f: "Η πόλη μετά την εισβολή", b: "Η πόλη βιασμένη και ακινητοποιημένη μετά την εισβολή: αντίθεση με τη ζωντανή, παλιά της εικόνα." },
      { f: "Εικόνες εγκλεισμού", b: "Σύμβολα της κατοχής: η πόλη σαν τόπος εγκλεισμού, αποκομμένη από τους ανθρώπους της." },
      { f: "Άστρα, φως, θάλασσα", b: "Μνήμη της ομορφιάς, αλλά και ελπίδα επιστροφής και ελευθερίας." },
      { f: "Η μνήμη ως χρέος", b: "Ο ποιητής νιώθει ότι οφείλει στην πόλη όσα του χάρισε στα χρόνια της ζωής του εκεί: η μνήμη γίνεται υποχρέωση." },
      { f: "«Αρχή Ινδίκτου»: ο τίτλος", b: "Η Ίνδικτος είναι η εκκλησιαστική αρχή του έτους (1η Σεπτεμβρίου): νέα χρονιά για την Εκκλησία, ενώ για τον πρόσφυγα ποιητή ο χρόνος της πόλης έχει σταματήσει από το 1974." },
      { f: "«Αρχή Ινδίκτου»: τα τοπωνύμια", b: "Δρόμοι, γειτονιές και εκκλησίες της Αμμοχώστου ονομάζονται σαν σε απογραφή: η ονομασία κρατά την πόλη ζωντανή στη μνήμη και αντιστέκεται στη λήθη." }
    ], tip: "Στο δειγματικό δοκίμιο 2026–27 ζητούνται: δύο αντίθετες όψεις της πόλης, η σχέση ποιητή–πόλης και δύο εκφραστικά μέσα. Τεκμηρίωνε πάντα με στοιχεία από το ποίημα." });
  },
  nc1camus(box) {
    nc1Order(box, { title: "Καμύ, «Γράμμα σ’ ένα φίλο Γερμανό» (απόσπασμα): βάλε τα στάδια του επεισοδίου και του σχολίου στη σειρά του κειμένου.", steps: [
      "Ο συγγραφέας, απευθυνόμενος στον Γερμανό «φίλο», αρχίζει να διηγείται ένα περιστατικό.",
      "Ένα φορτηγό μεταφέρει ξημερώματα έντεκα Γάλλους κρατούμενους για εκτέλεση· ανάμεσά τους ένα παιδί δεκαέξι χρονών.",
      "Ο ιερέας που συνοδεύει τους μελλοθανάτους μιλά με το παιδί και του δίνει ψεύτικη παρηγοριά και ελπίδα.",
      "Το παιδί επιχειρεί να δραπετεύσει· ο ιερέας δίνει το σήμα κινδύνου στους στρατιώτες.",
      "Καταδίωξη στα χωράφια — το παιδί ξαναφέρνουν στο φορτηγό.",
      "Ο συγγραφέας αποκαλύπτει ότι την ιστορία του τη διηγήθηκε ένας Γάλλος παπάς, που ντρεπόταν για τον συνάδελφό του.",
      "Ιδεολογικό συμπέρασμα: η σύγκρουση αφορά αξίες — η τυφλή βία απέναντι σε μια σκέψη που, αφού δοκιμάστηκε, έχει πια αποφασίσει να αντισταθεί."
    ], done: "Δομή: αφήγηση του περιστατικού → κορύφωση με την απόπειρα διαφυγής → ιδεολογικός σχολιασμός και συμπέρασμα.", tip: "Το κείμενο είναι επιστολή: α΄ πρόσωπο (ο συγγραφέας) και β΄ πρόσωπο (ο αποδέκτης) δίνουν άμεσο, αντιπαραθετικό λόγο." });
  }
});

var GENS = Object.assign(window.GENS || {}, {
  nc1gTech: { title: "Γεννήτρια — εκφραστικά μέσα", make() {
    const it = nc1Pick(NC1_TECH), wr = nc1TechWrong(it);
    return bkMC({ level: 1, shuffle: true, q: `Ποιο εκφραστικό μέσο κυριαρχεί στην πρόταση (πρωτότυπο παράδειγμα);<br><i>${it[0]}</i>`, hint: "Υπάρχει «σαν/όπως»; Μιλούν άψυχα; Επαναλαμβάνεται κάτι; Αντιπαρατίθενται έννοιες;", sol: `<b>${it[1]}</b>. ${it[2]}` }, [it[1]].concat(wr), 0);
  } },
  nc1gNarr: { title: "Γεννήτρια — αφηγηματικές τεχνικές", make() {
    const it = nc1Pick(NC1_NARR);
    return bkMC({ level: 2, shuffle: true, q: `${it[0]}<br><span class="muted small">(Πρωτότυπο απόσπασμα εξάσκησης.)</span><br>${it[1]}`, hint: "Ποιος μιλά; Συμμετέχει στην ιστορία; Τι ξέρει; Πώς κινείται ο χρόνος;", sol: `<b>${it[2]}</b>. ${it[4]}` }, [it[2]].concat(it[3]), 0);
  } },
  nc1gMove: { title: "Γεννήτρια — ρεύματα, γενιές, έργα", make() {
    const it = nc1Pick(NC1_MOVQ);
    return bkMC({ level: 1, shuffle: true, q: it[0], hint: "Σκέψου τη χρονολογία και τα βασικά γνωρίσματα του ρεύματος.", sol: `<b>${it[1]}</b>. ${it[3]}` }, [it[1]].concat(it[2]), 0);
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

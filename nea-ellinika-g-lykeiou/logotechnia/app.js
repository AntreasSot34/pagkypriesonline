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
  storeKey: "pagk-nea-ellinika-logotechnia-v1",
  heroTitle: "Νέα Ελληνικά Γ΄ Λυκείου — Παγκύπριες: Λογοτεχνία",
  tefxos: "Λογοτεχνία",
  widgetLabel: "διαδραστική άσκηση",
  noacc: true,
  heroLead: "Λογοτεχνικός γραμματισμός (αφηγηματικές τεχνικές, εκφραστικά μέσα, ποιητικό υποκείμενο, σύγκριση με αδίδακτο) και ανάλυση των εξεταστέων κειμένων των Παγκυπρίων. <b>Δωρεάν υλικό</b> — δεν προσφέρουμε ιδιαίτερα μαθήματα Νέων Ελληνικών.",
  howto: `<ul><li>Απαντήσεις-λέξεις: γράψε τη λέξη, π.χ. «<b>ωφέλιμος</b>» — οι τόνοι και τα κεφαλαία δεν μετρούν.</li>
    <li>Ερωτήσεις ανοιχτού τύπου (περίληψη, κριτική τοποθέτηση, παραγωγή λόγου): γράψε στο τετράδιό σου και σύγκρινε με την <b>ενδεικτική απάντηση</b> και τα κριτήρια.</li>
    <li>Το υλικό δίνεται <b>δωρεάν</b>· δεν προσφέρουμε ιδιαίτερα μαθήματα Νέων Ελληνικών.</li>
    <li>Ύλη: Παγκύπριες Εξετάσεις, «Νέα Ελληνικά» Γ΄ Λυκείου (πίνακας προδιαγραφών ΥΠΑΝ).</li></ul>`
};

const UNITS = [
  { id: 1, title: "Λογοτεχνικός γραμματισμός" },
  { id: 2, title: "Εξεταστέα ποιήματα" },
  { id: 3, title: "Εξεταστέα πεζά και λογοτεχνικό βιβλίο" }
];

const SECTIONS = [
/* ───────────────────────────── 1.1 ───────────────────────────── */
{
  id: "1.1", unit: 1, title: "Λογοτεχνικά γένη, ποιητικό υποκείμενο και αφηγητής",
  book: "Σύνοψη Λογοτεχνικού Γραμματισμού (Πλαίσιο Μάθησης Λογοτεχνίας Γ΄ Λυκείου): Τα γένη της Λογοτεχνίας · Το ποιητικό υποκείμενο · Ο αφηγητής",
  intro: "Ποιος «μιλά» μέσα σε ένα ποίημα ή σε ένα διήγημα — και γιατί δεν είναι ποτέ απλώς ο ίδιος ο συγγραφέας;",
  thumb: LETTER("Φωνή"),
  theory: R`
<p>Κάθε ερώτηση λογοτεχνίας στις Παγκύπριες ξεκινά, φανερά ή σιωπηρά, από ένα ερώτημα: <b>ποιος μιλά</b> στο κείμενο και <b>με ποιον τρόπο</b>. Για να απαντήσεις σωστά πρέπει να γνωρίζεις τα <b>λογοτεχνικά γένη</b> και να ξεχωρίζεις το <b>ποιητικό υποκείμενο</b> και τον <b>αφηγητή</b> από τον πραγματικό δημιουργό του έργου.</p>
<div class="tbox def"><h4>Τα γένη της λογοτεχνίας</h4>
<p>Η λογοτεχνία χωρίζεται σε τρία βασικά γένη:</p>
<ul><li><b>Ποίηση</b> — λόγος οργανωμένος σε στίχους, με έμφαση στον ρυθμό, στην εικόνα και στο συναίσθημα. Διακρίνουμε τη <b>δημοτική</b> (ανώνυμη, προφορική), την <b>παραδοσιακή έντεχνη</b> (με μέτρο, στροφές, ομοιοκαταληξία) και τη <b>μοντέρνα</b> ποίηση (ελεύθερος στίχος, σύμβολα).</li>
<li><b>Πεζογραφία</b> — αφηγηματικός λόγος σε πρόζα. Βασικές μορφές: <b>διήγημα</b> (σύντομη αφήγηση, λίγα πρόσωπα, ένα κεντρικό περιστατικό), <b>νουβέλα</b> (μεσαία έκταση), <b>μυθιστόρημα</b> (εκτενής αφήγηση με πολλά πρόσωπα και επεισόδια), <b>χρονικό</b>, <b>μαρτυρία</b>, <b>ημερολόγιο</b>, <b>(αυτο)βιογραφία</b>, <b>αυτοβιογραφική αφήγηση</b>, <b>παραμύθι</b>, <b>ευθυμογράφημα</b>.</li>
<li><b>Θέατρο</b> — κείμενο γραμμένο για να παρασταθεί· κυριαρχεί ο διάλογος και οι σκηνικές οδηγίες.</li></ul></div>
<div class="tbox def"><h4>Ποιητικό υποκείμενο: η «φωνή» του ποιήματος</h4>
<p><b>Ποιητικό υποκείμενο</b> είναι το πρόσωπο που «μιλά» μέσα στο ποίημα. Μπορεί να μοιάζει με τον ποιητή, αλλά δεν ταυτίζεται μαζί του: είναι <b>δημιούργημα</b> του ποιητή, μια φωνή που εκείνος επινοεί (π.χ. ένα παιδί, ένας στρατιώτης, ένας πρόσφυγας, ένας αρχαίος βασιλιάς, μια ομάδα «εμείς»).</p>
<p>Για να το περιγράψεις στις εξετάσεις, εξετάζεις: <b>(α)</b> ποιος μιλά (ταυτότητα, ηλικία, κατάσταση), <b>(β)</b> σε ποιο <b>πρόσωπο</b> (α΄ ενικό εξομολόγηση· α΄ πληθυντικό συλλογική φωνή· β΄ πρόσωπο αποστροφή/συμβουλή· γ΄ πρόσωπο αποστασιοποίηση), <b>(γ)</b> σε ποιον απευθύνεται και <b>(δ)</b> ποια στάση/συναίσθημα εκφράζει (νοσταλγία, ειρωνεία, οργή, πένθος…).</p></div>
<div class="tbox def"><h4>Ο αφηγητής: η «φωνή» που αφηγείται</h4>
<p>Στην πεζογραφία ο <b>αφηγητής</b> είναι το πλασματικό πρόσωπο που διηγείται την ιστορία — και πάλι διαφέρει από τον <b>συγγραφέα</b>, τον πραγματικό άνθρωπο που έγραψε το έργο. Η Σύνοψη Λογοτεχνικού Γραμματισμού τον κατατάσσει ανάλογα με τη <b>συμμετοχή του στην ιστορία</b>:</p>
<table class="tbl"><tr><th>Τύπος</th><th>Τι σημαίνει</th><th>Συνηθισμένο πρόσωπο</th></tr>
<tr><td><b>Ομοδιηγητικός – αυτοδιηγητικός</b></td><td>Συμμετέχει στην ιστορία ως <b>πρωταγωνιστής</b>· αφηγείται τη δική του ιστορία.</td><td>α΄ πρόσωπο</td></tr>
<tr><td><b>Ομοδιηγητικός – μάρτυρας</b></td><td>Συμμετέχει ως <b>αυτόπτης μάρτυρας ή δευτερεύον πρόσωπο</b>· αφηγείται κυρίως για κάποιον άλλον.</td><td>α΄ πρόσωπο</td></tr>
<tr><td><b>Ετεροδιηγητικός</b></td><td><b>Δεν συμμετέχει</b> καθόλου στην ιστορία· είναι «αόρατος παρατηρητής».</td><td>γ΄ πρόσωπο</td></tr></table>
<p>Ως προς το <b>πρόσωπο</b>, η αφήγηση είναι <b>πρωτοπρόσωπη</b> (α΄ πρόσωπο) ή <b>τριτοπρόσωπη</b> (γ΄ πρόσωπο). Η πρωτοπρόσωπη αφήγηση προσδίδει <b>αμεσότητα, οικειότητα, αληθοφάνεια και υποκειμενικότητα</b>· η τριτοπρόσωπη δίνει <b>αντικειμενικότητα, αποστασιοποίηση</b> και, συχνά, μια συνολική εποπτεία της ιστορίας.</p></div>
<div class="tbox rem"><h4>Εστίαση (οπτική γωνία)</h4><p>Πέρα από το «ποιος μιλά», ρωτάμε και «<b>ποιος βλέπει</b>»: ο ετεροδιηγητικός αφηγητής μπορεί να γνωρίζει τα πάντα, ακόμη και τις σκέψεις των προσώπων (<b>μηδενική εστίαση</b> – «παντογνώστης»), να βλέπει μέσα από τα μάτια ενός ήρωα (<b>εσωτερική εστίαση</b>) ή να καταγράφει μόνο όσα φαίνονται απ' έξω, σαν κάμερα (<b>εξωτερική εστίαση</b>). Ο όρος είναι χρήσιμος στην ανάλυση, αλλά στις απαντήσεις σου βάλε πρώτα τους όρους της Σύνοψης (ομοδιηγητικός/ετεροδιηγητικός, πρωτοπρόσωπη/τριτοπρόσωπη).</p></div>
<div class="tbox ex"><h4>Αναγνώριση αφηγητή — πρωτότυπο απόσπασμα</h4>
${PASSAGE(`Τον μπαρμπα-Λευτέρη τον θυμάμαι πάντα με το ίδιο γκρίζο σακάκι. Κάθε πρωί ανέβαινε στο καφενείο της πλατείας, παράγγελνε έναν σκέτο και κοίταζε σιωπηλός προς τη θάλασσα. Εμείς τα παιδιά λέγαμε πως περίμενε κάποιο καράβι· μόνο χρόνια αργότερα έμαθα ποιο.`, { title: "«Ο μπαρμπα-Λευτέρης» (πρωτότυπο κείμενο εξάσκησης)" })}
<details class="steps"><summary>Λύση βήμα-βήμα</summary><p><b>1. Συμμετέχει;</b> Ναι: «τον θυμάμαι», «εμείς τα παιδιά» → ομοδιηγητικός. <b>2. Ποιος είναι ο πρωταγωνιστής;</b> Ο μπαρμπα-Λευτέρης, όχι ο αφηγητής → <b>ομοδιηγητικός αφηγητής–μάρτυρας</b>. <b>3. Πρόσωπο:</b> α΄ πρόσωπο (πρωτοπρόσωπη αφήγηση). <b>4. Λειτουργία:</b> η οπτική του παιδιού που θυμάται δημιουργεί νοσταλγία και μυστήριο (δεν ξέρει ακόμη «ποιο καράβι»), ενώ η απόσταση του ενήλικα που αφηγείται προσθέτει στοχασμό.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><ul>
<li>Γράφουμε «ο ποιητής λέει…» αντί για «το ποιητικό υποκείμενο…» ή «ο αφηγητής…». Ακόμη κι όταν το κείμενο είναι αυτοβιογραφικό, ο αφηγητής είναι λογοτεχνικό πρόσωπο.</li>
<li>Θεωρούμε ότι κάθε α΄ πρόσωπο σημαίνει πρωταγωνιστή: ο αφηγητής σε α΄ πρόσωπο μπορεί να είναι απλός μάρτυρας.</li>
<li>Κατονομάζουμε τον τύπο αφηγητή χωρίς <b>τεκμήριο</b> (ρήματα, αντωνυμίες) και χωρίς <b>λειτουργία</b> (τι πετυχαίνει η επιλογή).</li></ul></div>`,
  widget: "nb1voice",
  gen: "nb1gNar",
  exercises: [
    { level: 1, type: "mc", q: R`Ποιο από τα παρακάτω <b>δεν</b> ανήκει στα τρία βασικά λογοτεχνικά γένη;`, options: ["Δοκίμιο", "Ποίηση", "Πεζογραφία", "Θέατρο"], correct: 0,
      hint: R`Τα γένη είναι τρία: σε στίχους, σε πρόζα, για σκηνή.`, sol: R`Τα τρία βασικά γένη είναι η <b>ποίηση</b>, η <b>πεζογραφία</b> και το <b>θέατρο</b>. Το δοκίμιο είναι κειμενικό είδος του δοκιμιακού/επιχειρηματολογικού λόγου και εξετάζεται κυρίως στη Γλώσσα.` },
    { level: 1, type: "mc", q: R`Ο αφηγητής ενός διηγήματος…`, options: ["είναι πλασματικό πρόσωπο, δημιούργημα του συγγραφέα", "ταυτίζεται πάντα με τον συγγραφέα", "ταυτίζεται με τον συγγραφέα μόνο στην πρωτοπρόσωπη αφήγηση", "είναι πάντα ο πρωταγωνιστής της ιστορίας"], correct: 0,
      hint: R`Διάκρισε τον πραγματικό άνθρωπο που γράφει από τη «φωνή» που επινοεί.`, sol: R`Ο αφηγητής είναι <b>πλασματικό πρόσωπο</b>, δημιούργημα του συγγραφέα, ακόμη κι όταν μιλά σε α΄ πρόσωπο ή θυμίζει τον συγγραφέα.` },
    { level: 1, type: "mc", q: R`Ο αφηγητής που <b>δεν συμμετέχει</b> καθόλου στην ιστορία που αφηγείται ονομάζεται:`, options: ["Ετεροδιηγητικός", "Ομοδιηγητικός", "Αυτοδιηγητικός", "Δραματοποιημένος"], correct: 0,
      hint: R`Ρώτα: είναι ο αφηγητής ένα από τα πρόσωπα της ιστορίας;`, sol: R`<b>Ετεροδιηγητικός</b> αφηγητής: βρίσκεται έξω από την ιστορία, σαν αόρατος παρατηρητής· συνήθως αφηγείται σε γ΄ πρόσωπο.` },
    { level: 1, type: "mc", q: R`Η μικρή σε έκταση αφήγηση, με λίγα πρόσωπα και ένα κεντρικό περιστατικό, είναι:`, options: ["Διήγημα", "Μυθιστόρημα", "Χρονικό", "Θεατρικό έργο"], correct: 0,
      hint: R`Σκέψου έκταση και πλήθος επεισοδίων.`, sol: R`Το <b>διήγημα</b> είναι σύντομο πεζό με περιορισμένο αριθμό προσώπων και ένα κεντρικό περιστατικό· το μυθιστόρημα είναι εκτενές, με πολλά πρόσωπα και επεισόδια.` },
    { level: 2, type: "mc", q: R`Να διαβάσετε το απόσπασμα (πρωτότυπο κείμενο εξάσκησης):${PASSAGE(`Η Μαρίνα έκλεισε το βιβλίο και κοίταξε το ταβάνι. Δεν ήθελε να σκεφτεί την αυριανή μέρα, μα η σκέψη ερχόταν ξανά και ξανά, σαν σταγόνα που πέφτει στο ίδιο σημείο.`)}Ποιος είναι ο αφηγητής;`, options: ["Ετεροδιηγητικός, σε γ΄ πρόσωπο, που γνωρίζει τις σκέψεις της ηρωίδας", "Ομοδιηγητικός μάρτυρας, σε α΄ πρόσωπο", "Αυτοδιηγητικός, σε α΄ πρόσωπο", "Ομοδιηγητικός, σε γ΄ πρόσωπο"], correct: 0,
      hint: R`Ποιο πρόσωπο έχουν τα ρήματα; Συμμετέχει ο αφηγητής; Ξέρει τι σκέφτεται η ηρωίδα;`, sol: R`Τα ρήματα είναι σε γ΄ πρόσωπο (έκλεισε, κοίταξε) και ο αφηγητής δεν είναι πρόσωπο της ιστορίας → <b>ετεροδιηγητικός</b>· γνωρίζει όμως τις σκέψεις της Μαρίνας («δεν ήθελε να σκεφτεί»).` },
    { level: 2, type: "mc", q: R`Ποια είναι η κύρια λειτουργία της <b>πρωτοπρόσωπης</b> αφήγησης;`, options: ["Αμεσότητα, οικειότητα και αληθοφάνεια· ο αναγνώστης βλέπει τα γεγονότα μέσα από το βίωμα του αφηγητή", "Αντικειμενικότητα και πλήρης γνώση όλων των προσώπων", "Αποστασιοποίηση του αφηγητή από τα γεγονότα", "Επιτάχυνση της αφήγησης"], correct: 0,
      hint: R`Τι αλλάζει όταν ακούμε την ιστορία από «εμένα»;`, sol: R`Η πρωτοπρόσωπη αφήγηση προσφέρει <b>αμεσότητα, οικειότητα, αληθοφάνεια</b> και <b>υποκειμενικότητα</b>: βλέπουμε τα γεγονότα μέσα από τα μάτια και τα συναισθήματα του αφηγητή.` },
    { level: 2, type: "mc", q: R`Σε ένα ποίημα ο ομιλητής λέει «εμείς οι πρόσφυγες κρατάμε ακόμα τα κλειδιά». Πώς περιγράφεται σωστά το ποιητικό υποκείμενο;`, options: ["Συλλογική φωνή σε α΄ πληθυντικό, που μιλά εκ μέρους μιας ομάδας", "Ο ίδιος ο ποιητής, που μιλά για τη δική του ζωή", "Ετεροδιηγητικός αφηγητής σε γ΄ πρόσωπο", "Αποστροφή σε β΄ πρόσωπο"], correct: 0,
      hint: R`Πρόσεξε το «εμείς» και μην ταυτίσεις τη φωνή με τον ποιητή.`, sol: R`Το «εμείς» δηλώνει <b>συλλογικό ποιητικό υποκείμενο</b> (α΄ πληθυντικό): η φωνή εκφράζει την εμπειρία μιας ομάδας (των προσφύγων) — δεν ταυτίζεται απαραίτητα με τον βιογραφικό ποιητή.` },
    { level: 2, type: "mc", q: R`Ένα κείμενο με χρονολογημένες εγγραφές, όπου κάποιος σημειώνει μέρα με τη μέρα τα γεγονότα και τις σκέψεις του, ανήκει στη μορφή:`, options: ["Ημερολόγιο", "Χρονικό", "Βιογραφία", "Ευθυμογράφημα"], correct: 0,
      hint: R`Ποια μορφή γράφεται «ανά ημέρα» και σε α΄ πρόσωπο;`, sol: R`<b>Ημερολόγιο</b>: προσωπικές, χρονολογημένες εγγραφές σε α΄ πρόσωπο. Το χρονικό καταγράφει γεγονότα με χρονολογική σειρά, συνήθως με πιο αντικειμενικό τόνο.` },
    { level: 3, type: "mc", q: R`Να διαβάσετε το απόσπασμα (πρωτότυπο κείμενο εξάσκησης):${PASSAGE(`Ο πατέρας μου δεν μιλούσε ποτέ για τον πόλεμο. Μόνο τις νύχτες του Ιουλίου τον άκουγα να σηκώνεται, να ανοίγει την πόρτα της αυλής και να κάθεται ώρες στο σκοτάδι, καπνίζοντας. Εγώ έκανα πως κοιμάμαι.`)}Ποιος είναι ο τύπος του αφηγητή και τι πετυχαίνει η επιλογή αυτή;`, options: ["Ομοδιηγητικός–μάρτυρας: μέσα από το βλέμμα του παιδιού το τραύμα του πατέρα υποβάλλεται σιωπηλά, χωρίς να ειπωθεί", "Αυτοδιηγητικός: ο αφηγητής μιλά για τον δικό του πόλεμο", "Ετεροδιηγητικός: η αφήγηση είναι ουδέτερη και αντικειμενική", "Ομοδιηγητικός–πρωταγωνιστής: το παιδί είναι το κεντρικό πρόσωπο του πολέμου"], correct: 0,
      hint: R`Ο αφηγητής ανήκει στην ιστορία, αλλά ποιος είναι το κέντρο της; Τι ξέρει και τι δεν ξέρει;`, sol: R`Ο αφηγητής («εγώ») ζει στο σπίτι αλλά <b>παρατηρεί</b> τον πατέρα, που είναι το κεντρικό πρόσωπο → <b>ομοδιηγητικός αφηγητής–μάρτυρας</b>, α΄ πρόσωπο. Η περιορισμένη γνώση του παιδιού κάνει το τραύμα του πατέρα να <b>υπονοείται</b> (σιωπή, νυχτερινές αγρύπνιες) και δημιουργεί συγκίνηση.` },
    { level: 3, type: "mc", q: R`Σε ποιο από τα παρακάτω αποσπάσματα (πρωτότυπα) ο αφηγητής είναι <b>αυτοδιηγητικός</b>;`, options: ["«Όταν έφυγα από το χωριό, δεν πήρα τίποτα μαζί μου· μόνο τη φωνή της μάνας μου στο αυτί.»", "«Η Ελένη έφυγε από το χωριό χωρίς να πάρει τίποτα μαζί της.»", "«Τον φίλο μου τον Άρη τον είδα να φεύγει από το χωριό χωρίς βαλίτσα.»", "«Λένε πως εκείνη τη χρονιά πολλοί έφυγαν από το χωριό.»"], correct: 0,
      hint: R`Αυτοδιηγητικός = αφηγείται τη δική του ιστορία ως πρωταγωνιστής.`, sol: R`Μόνο στο «Όταν έφυγα από το χωριό…» ο αφηγητής αφηγείται <b>τη δική του</b> εμπειρία ως πρωταγωνιστής → αυτοδιηγητικός. Στο «Τον φίλο μου τον Άρη…» είναι μάρτυρας· τα άλλα δύο είναι τριτοπρόσωπα/ετεροδιηγητικά.` }
  ]
},
/* ───────────────────────────── 1.2 ───────────────────────────── */
{
  id: "1.2", unit: 1, title: "Αφηγηματικοί τρόποι και αφηγηματικές τεχνικές: αφήγηση, περιγραφή, διάλογος, μονόλογος, σχόλιο",
  book: "Σύνοψη Λογοτεχνικού Γραμματισμού: Αφηγηματική δομή · Αφηγηματικοί τρόποι · Τρόποι απόδοσης του λόγου (ευθύς – πλάγιος)",
  intro: "Πώς καταλαβαίνουμε αν ένα απόσπασμα είναι αφήγηση, περιγραφή, διάλογος, εσωτερικός μονόλογος ή σχόλιο — και τι προσφέρει ο καθένας στο κείμενο;",
  thumb: LETTER("Τρόποι"),
  theory: R`
<p>Ένα πεζό κείμενο δεν «τρέχει» με τον ίδιο τρόπο από την αρχή ως το τέλος. Ο αφηγητής εναλλάσσει <b>αφηγηματικούς τρόπους</b>: άλλοτε προωθεί τη δράση, άλλοτε σταματά για να περιγράψει, άλλοτε αφήνει τα πρόσωπα να μιλήσουν ή να σκεφτούν. Στις Παγκύπριες ζητείται συχνά να <b>εντοπίσεις</b> έναν τρόπο σε συγκεκριμένο σημείο και να εξηγήσεις τη <b>λειτουργία</b> του.</p>
<div class="tbox def"><h4>Δομικά στοιχεία της αφήγησης</h4><p>Κάθε αφήγηση έχει <b>αφηγητή</b>, <b>πρόσωπα</b> (χαρακτήρες, ήρωες), <b>χώρο</b>, <b>χρόνο</b>, <b>ιστορία</b> (τα γεγονότα), <b>επεισόδια</b> και <b>πλοκή</b> — την οργάνωση και την εξέλιξη των γεγονότων μέσα στο κείμενο.</p></div>
<div class="tbox def"><h4>Οι πέντε αφηγηματικοί τρόποι</h4>
<table class="tbl"><tr><th>Τρόπος</th><th>Πώς τον αναγνωρίζω</th><th>Λειτουργία</th></tr>
<tr><td><b>Αφήγηση</b></td><td>Διαδοχή πράξεων και γεγονότων· ρήματα δράσης (ήρθε, έτρεξε, έφυγε)</td><td>Εξελίσσει τη δράση, προωθεί την πλοκή</td></tr>
<tr><td><b>Περιγραφή</b></td><td>Παρουσίαση χώρου, προσώπου ή αντικειμένου· επίθετα, χρώματα, «ήταν/υπήρχε»· η δράση «σταματά»</td><td>Δημιουργεί ατμόσφαιρα, παραστατικότητα, σκιαγραφεί χαρακτήρες· επιβραδύνει</td></tr>
<tr><td><b>Διάλογος</b></td><td>Ευθύς λόγος δύο ή περισσότερων προσώπων (παύλες, εισαγωγικά)</td><td>Ζωντάνια, θεατρικότητα, αμεσότητα· αποκαλύπτει χαρακτήρες μέσα από τα λόγια τους</td></tr>
<tr><td><b>(Εσωτερικός) μονόλογος</b></td><td>Οι σκέψεις ενός προσώπου αποδίδονται άμεσα, σε α΄ πρόσωπο, συχνά με ερωτήσεις, αποσιωπητικά, ασύνδετο</td><td>Φανερώνει τον ψυχικό κόσμο, τα διλήμματα και τα συναισθήματα του ήρωα</td></tr>
<tr><td><b>Σχόλιο</b></td><td>Ο αφηγητής διακόπτει την ιστορία για να κρίνει, να ερμηνεύσει ή να γενικεύσει (ενεστώτας γνωμικός: «έτσι είναι οι άνθρωποι…»)</td><td>Προβάλλει απόψεις, στοχασμό· καθοδηγεί την ερμηνεία του αναγνώστη</td></tr></table>
<p>Όπως σημειώνει η Σύνοψη, οι τρόποι αυτοί «συμβάλλουν στην εξέλιξη της δράσης, στην παρουσίαση των προσώπων, στη σκιαγράφηση των χαρακτήρων και στη δημιουργία ατμόσφαιρας».</p></div>
<div class="tbox def"><h4>Ευθύς και πλάγιος λόγος</h4>
<p>Τα λόγια των προσώπων αποδίδονται είτε <b>αυτούσια</b> (<b>ευθύς λόγος</b>: «Θα γυρίσω», είπε) είτε <b>μεταφερμένα</b> από τον αφηγητή με δευτερεύουσα πρόταση (<b>πλάγιος λόγος</b>: είπε πως θα γύριζε). Ο ευθύς λόγος δίνει <b>ζωντάνια, αμεσότητα, θεατρικότητα</b>· ο πλάγιος δίνει <b>συντομία, αποστασιοποίηση</b> και κρατά τον έλεγχο στον αφηγητή.</p>
${PASSAGE(`«Θα σε περιμένω στον σταθμό», της είπε. → Της είπε ότι θα την περίμενε στον σταθμό.`, { title: "Μετατροπή ευθέος σε πλάγιο λόγο" })}
<p class="muted small">Στη μετατροπή αλλάζουν τα πρόσωπα (σε → την), οι χρόνοι (θα περιμένω → θα περίμενε) και μπαίνει σύνδεσμος (ότι/πως, για ερώτηση: αν/πού/πότε…).</p></div>
<div class="tbox ex"><h4>Εντοπισμός και λειτουργία — πρωτότυπο απόσπασμα</h4>
${PASSAGE(`Η κουζίνα μύριζε κανέλα· στο τραπέζι, κάτω από μια λευκή πετσέτα, ξεκουραζόταν το ζυμάρι. Η γιαγιά σκούπισε τα χέρια της στην ποδιά και άνοιξε το παράθυρο.

— Θα έρθει φέτος; ρώτησε η εγγονή.
— Θα έρθει, απάντησε η γιαγιά, χωρίς να γυρίσει.

Θα έρθει; Δέκα Χριστούγεννα το ίδιο ερώτημα, δέκα Χριστούγεννα η ίδια απάντηση…`, { num: "par", title: "«Τα Χριστούγεννα» (πρωτότυπο κείμενο εξάσκησης)" })}
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p><b>§1:</b> «Η κουζίνα μύριζε κανέλα… το ζυμάρι» → <b>περιγραφή</b> (με οσφρητική και οπτική εικόνα): δημιουργεί ζεστή, οικογενειακή ατμόσφαιρα· «σκούπισε… άνοιξε» → <b>αφήγηση</b>: προωθεί τη δράση. <b>§2:</b> <b>διάλογος</b> σε ευθύ λόγο: ζωντάνια, και η σύντομη απάντηση «χωρίς να γυρίσει» υπονοεί τη συγκρατημένη θλίψη της γιαγιάς. <b>§3:</b> <b>εσωτερικός μονόλογος</b> (ερώτηση, επανάληψη, αποσιωπητικά): φανερώνει την αμφιβολία και τον πόνο της αναμονής.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><ul>
<li>Μπερδεύουμε τον <b>εσωτερικό μονόλογο</b> με τον διάλογο: ο μονόλογος δεν απευθύνεται σε άλλο πρόσωπο· είναι η «φωνή» της σκέψης.</li>
<li>Λέμε «περιγραφή» για κάθε κείμενο με επίθετα: αν υπάρχει διαδοχή πράξεων, κυριαρχεί η αφήγηση.</li>
<li>Γράφουμε μόνο τον όρο: πάντα <b>όρος + παράθεμα (τεκμήριο) + λειτουργία</b> στη συγκεκριμένη θέση του κειμένου.</li></ul></div>`,
  widget: "nb1modes",
  gen: "nb1gMode",
  exercises: [
    { level: 1, type: "mc", q: R`Ποιος αφηγηματικός τρόπος «σταματά» την εξέλιξη της δράσης για να παρουσιάσει έναν χώρο ή ένα πρόσωπο;`, options: ["Περιγραφή", "Αφήγηση", "Διάλογος", "Σχόλιο"], correct: 0,
      hint: R`Ποιος τρόπος «ζωγραφίζει» αντί να «προχωρά»;`, sol: R`Η <b>περιγραφή</b> παρουσιάζει χώρους, πρόσωπα, αντικείμενα· η δράση σταματά και δημιουργείται ατμόσφαιρα.` },
    { level: 1, type: "mc", q: R`Ο τρόπος με τον οποίο αποδίδονται άμεσα οι σκέψεις ενός ήρωα, όπως γεννιούνται στη συνείδησή του, ονομάζεται:`, options: ["Εσωτερικός μονόλογος", "Πλάγιος λόγος", "Περιγραφή", "Σχόλιο"], correct: 0,
      hint: R`Ο ήρωας «μιλά» στον εαυτό του.`, sol: R`<b>Εσωτερικός μονόλογος</b>: οι σκέψεις του ήρωα αποδίδονται χωρίς τη μεσολάβηση του αφηγητή, συχνά με ερωτήματα και αποσπασματικό λόγο.` },
    { level: 1, type: "mc", q: R`Στη φράση <i>Ο γιατρός είπε στη μητέρα ότι το παιδί θα γινόταν καλά.</i> ο λόγος του γιατρού αποδίδεται σε:`, options: ["Πλάγιο λόγο", "Ευθύ λόγο", "Εσωτερικό μονόλογο", "Διάλογο"], correct: 0,
      hint: R`Υπάρχουν εισαγωγικά ή «ότι»;`, sol: R`Τα λόγια μεταφέρονται από τον αφηγητή με δευτερεύουσα πρόταση («ότι…») και αλλαγή χρόνου (θα γινόταν) → <b>πλάγιος λόγος</b>.` },
    { level: 2, type: "mc", q: R`Ποια είναι η κύρια λειτουργία του <b>διαλόγου</b> σε ένα διήγημα;`, options: ["Δίνει ζωντάνια και θεατρικότητα και αποκαλύπτει τους χαρακτήρες μέσα από τα λόγια τους", "Επιβραδύνει τη δράση με εκτενείς λεπτομέρειες του χώρου", "Προβάλλει τις γενικές κρίσεις του αφηγητή", "Δηλώνει πάντα αναδρομή στο παρελθόν"], correct: 0,
      hint: R`Τι αλλάζει όταν «ακούμε» τα πρόσωπα να μιλούν;`, sol: R`Ο διάλογος προσφέρει <b>αμεσότητα, ζωντάνια, θεατρικότητα</b> και σκιαγραφεί τα πρόσωπα μέσα από τον τρόπο που μιλούν.` },
    { level: 2, type: "mc", q: R`Να διαβάσετε τη φράση (πρωτότυπο κείμενο):${PASSAGE(`Οι μεγάλες αποφάσεις, άλλωστε, παίρνονται πάντα τις πιο ασήμαντες μέρες.`)}Ποιος αφηγηματικός τρόπος είναι;`, options: ["Σχόλιο", "Αφήγηση", "Περιγραφή", "Διάλογος"], correct: 0,
      hint: R`Η φράση αφορά μόνο την ιστορία ή ισχύει γενικά;`, sol: R`Γενική, στοχαστική κρίση του αφηγητή (γνωμικός ενεστώτας «παίρνονται») → <b>σχόλιο</b>.` },
    { level: 2, type: "mc", q: R`Ποια μετατροπή σε <b>πλάγιο λόγο</b> είναι σωστή για τη φράση <i>«Πού πας τέτοια ώρα;» τη ρώτησε ο αδελφός της.</i>;`, options: ["Ο αδελφός της τη ρώτησε πού πήγαινε τέτοια ώρα.", "Ο αδελφός της τη ρώτησε: πού πας τέτοια ώρα.", "Ο αδελφός της τη ρώτησε ότι πήγαινε τέτοια ώρα.", "Ο αδελφός της ρώτησε πού πάω τέτοια ώρα."], correct: 0,
      hint: R`Πλάγια ερώτηση: εισάγεται με το ερωτηματικό επίρρημα· αλλάζουν πρόσωπο και χρόνος.`, sol: R`Η ευθεία ερώτηση γίνεται <b>πλάγια ερωτηματική πρόταση</b> με το «πού», το β΄ πρόσωπο γίνεται γ΄ (πας → πήγαινε) και ο ενεστώτας παρατατικός.` },
    { level: 2, type: "mc", q: R`Να διαβάσετε το απόσπασμα (πρωτότυπο κείμενο):${PASSAGE(`Κι αν δεν με θυμάται πια; Κι αν περάσει από δίπλα μου και δεν γυρίσει να με κοιτάξει; Όχι… δεν μπορεί.`)}Ποιος αφηγηματικός τρόπος κυριαρχεί και ποια στοιχεία τον τεκμηριώνουν;`, options: ["Εσωτερικός μονόλογος: α΄ πρόσωπο, διαδοχικά ερωτήματα, αποσιωπητικά, αποσπασματικός λόγος", "Διάλογος: παύλες και εναλλαγή προσώπων", "Περιγραφή: επίθετα και στατικές εικόνες", "Σχόλιο: γενική κρίση με γνωμικό ενεστώτα"], correct: 0,
      hint: R`Μιλά κάποιος σε άλλον ή στον εαυτό του;`, sol: R`Κανείς δεν απαντά· είναι η φωνή της σκέψης, με ερωτήματα, αποσιωπητικά και α΄ πρόσωπο → <b>εσωτερικός μονόλογος</b>. Φανερώνει την ανασφάλεια και την αγωνία του προσώπου.` },
    { level: 3, type: "mc", q: R`Να διαβάσετε το απόσπασμα (πρωτότυπο κείμενο εξάσκησης):${PASSAGE(`Το λιμάνι κοιμόταν ακόμα· οι βάρκες λικνίζονταν δεμένες, κι ένας γλάρος καθόταν ακίνητος στο φανάρι του μόλου. Ο Στέλιος έλυσε το σκοινί, πήδηξε στη βάρκα του και έβαλε μπρος τη μηχανή.`)}Ποια είναι η σωστή ανάλυση;`, options: ["Περιγραφή στην αρχή (ατμόσφαιρα ηρεμίας), αφήγηση στη συνέχεια (η δράση ξεκινά με διαδοχικές πράξεις)", "Αφήγηση σε όλο το απόσπασμα, γιατί υπάρχουν ρήματα", "Διάλογος, γιατί ο Στέλιος μιλά στη βάρκα", "Σχόλιο του αφηγητή για τη ζωή των ψαράδων"], correct: 0,
      hint: R`Χώρισε το απόσπασμα σε δύο μέρη: τι παρουσιάζει το καθένα;`, sol: R`«Το λιμάνι κοιμόταν… του μόλου» → <b>περιγραφή</b> (στατική εικόνα, προσωποποίηση «κοιμόταν»): ήρεμη ατμόσφαιρα. «Ο Στέλιος έλυσε… έβαλε μπρος» → <b>αφήγηση</b> (ρήματα δράσης σε διαδοχή): η δράση εκκινεί. Η αντίθεση ακινησίας–κίνησης τονίζει την έναρξη της μέρας.` },
    { level: 3, type: "mc", q: R`Ένας μαθητής γράφει: «Ο αφηγητής χρησιμοποιεί διάλογο». Τι λείπει από την απάντησή του για να πάρει πλήρη βαθμό σε ερώτηση «να εντοπίσετε έναν αφηγηματικό τρόπο και να εξηγήσετε τη λειτουργία του»;`, options: ["Παράθεμα από το κείμενο που τεκμηριώνει τον εντοπισμό και εξήγηση της λειτουργίας του στο συγκεκριμένο σημείο", "Ο ορισμός του διαλόγου από τη θεωρία", "Η αναφορά σε όλους τους αφηγηματικούς τρόπους του κειμένου", "Η βιογραφία του συγγραφέα"], correct: 0,
      hint: R`Τι ζητούν τα κριτήρια διόρθωσης: όρο, τεκμήριο, λειτουργία.`, sol: R`Πλήρης απάντηση = <b>όρος</b> (διάλογος) + <b>τεκμήριο</b> (παράθεμα/αναφορά σε στίχους ή γραμμές) + <b>λειτουργία</b> (τι πετυχαίνει εκεί, π.χ. ζωντάνια, σκιαγράφηση χαρακτήρα).` }
  ]
},
/* ───────────────────────────── 1.3 ───────────────────────────── */
{
  id: "1.3", unit: 1, title: "Ο χρόνος της αφήγησης: αναδρομή, πρόληψη, in medias res, επιτάχυνση, επιβράδυνση",
  book: "Σύνοψη Λογοτεχνικού Γραμματισμού: Αφηγηματικές τεχνικές — τεχνικές σχετικές με τον χρόνο",
  intro: "Γιατί ένα διήγημα μπορεί να αρχίσει από το τέλος, να γυρίσει πίσω στο παρελθόν ή να προλάβει το μέλλον — και πώς λέγονται αυτές οι τεχνικές;",
  thumb: LETTER("Χρόνος"),
  theory: R`
<p>Η <b>ιστορία</b> είναι τα γεγονότα με τη <b>χρονολογική</b> τους σειρά· το <b>κείμενο</b> (η αφήγηση) τα παρουσιάζει με τη σειρά που επιλέγει ο αφηγητής. Όταν οι δύο σειρές δεν συμπίπτουν, έχουμε <b>τεχνικές σχετικές με τον χρόνο</b>. Είναι από τα πιο συχνά ερωτήματα στο πεζό κείμενο των Παγκυπρίων.</p>
<div class="tbox def"><h4>Σειρά: αναδρομή, πρόληψη, in medias res</h4><ul>
<li><b>Αναδρομή</b>: η αφήγηση επιστρέφει σε γεγονότα που <b>προηγήθηκαν</b> της κύριας δράσης (μνήμη, «θυμήθηκε», υπερσυντέλικος «είχε φύγει»). Λειτουργία: φωτίζει το παρελθόν των προσώπων, εξηγεί τη συμπεριφορά τους, συγκρίνει παρελθόν και παρόν, προκαλεί νοσταλγία.</li>
<li><b>Πρόληψη / προοικονομία</b>: προαναγγέλλονται γεγονότα που <b>θα συμβούν αργότερα</b> («δεν ήξερε τότε πως…», «χρόνια αργότερα θα…»). Λειτουργία: δημιουργεί αγωνία ή τραγική ειρωνεία, προετοιμάζει τον αναγνώστη. (Η <b>προοικονομία</b> με στενή έννοια είναι η διακριτική προετοιμασία ενός γεγονότος μέσα από ενδείξεις.)</li>
<li><b>In medias res</b> («στο μέσο των πραγμάτων»): η αφήγηση αρχίζει <b>από τη μέση</b> της δράσης, χωρίς εισαγωγή· τα προηγούμενα δίνονται αργότερα, συνήθως με αναδρομή. Λειτουργία: τραβά αμέσως την προσοχή, δημιουργεί ένταση και περιέργεια.</li></ul></div>
<div class="tbox def"><h4>Ρυθμός: επιτάχυνση, επιβράδυνση, επανάληψη</h4><ul>
<li><b>Επιτάχυνση</b>: μεγάλο διάστημα της ιστορίας αποδίδεται <b>συνοπτικά</b> ή παραλείπεται («πέρασαν δέκα χρόνια»). Λειτουργία: προσπερνά τα δευτερεύοντα, φέρνει γρήγορα τον αναγνώστη στο ουσιώδες.</li>
<li><b>Επιβράδυνση</b>: η εξέλιξη <b>καθυστερεί</b> με εκτενή περιγραφή, σχόλιο ή απόδοση σκέψεων· λίγα δευτερόλεπτα της ιστορίας απλώνονται σε πολλές γραμμές. Λειτουργία: αγωνία, έμφαση στην κρίσιμη στιγμή, ανάδειξη συναισθημάτων.</li>
<li><b>Επανάληψη</b>: ένα γεγονός επανέρχεται ή ο αφηγητής αφηγείται μία φορά κάτι που συνέβαινε πολλές φορές («κάθε βράδυ…»). Λειτουργία: δηλώνει μονοτονία, εμμονή, τελετουργικό, ψυχικό τραύμα.</li></ul></div>
${(() => { const X = (k, n) => 40 + k * 104; const pts = [[0, 2, "#C62828"], [1, 0, "#6F42C1"], [2, 1, "#6F42C1"], [3, 3, "#C62828"], [4, 4, "#C77A0A"]]; return `<figure class="grfig"><svg viewBox="0 0 520 178" style="width:100%;max-width:520px;display:block;margin:6px auto"><text x="29" y="20" style="font:700 11px var(--sans);fill:#5b6b86">Κείμενο (σειρά αφήγησης)</text><text x="29" y="166" style="font:700 11px var(--sans);fill:#5b6b86">Ιστορία (χρονολογική σειρά)</text><line x1="40" y1="42" x2="456" y2="42" stroke="#e0b4ad" stroke-width="2"/><line x1="40" y1="130" x2="456" y2="130" stroke="#e0b4ad" stroke-width="2"/>${pts.map(([i, c, col], j) => `<line x1="${X(i)}" y1="42" x2="${X(c)}" y2="130" stroke="${col}" stroke-width="2.5" opacity=".75"/><circle cx="${X(i)}" cy="42" r="11" fill="${col}"/><text x="${X(i)}" y="46" text-anchor="middle" style="font:700 11px var(--sans);fill:#fff">${"ΑΒΓΔΕ"[j]}</text><circle cx="${X(c)}" cy="130" r="11" fill="#fff" stroke="${col}" stroke-width="2.5"/><text x="${X(c)}" y="134" text-anchor="middle" style="font:700 11px var(--sans);fill:${col}">${"ΑΒΓΔΕ"[j]}</text>`).join("")}</svg><figcaption>Επάνω: η σειρά του κειμένου· κάτω: η χρονολογική σειρά της ιστορίας. Τα Β, Γ (μωβ) αφηγούνται μετά το Α αλλά συνέβησαν πριν από αυτό → <b>αναδρομή</b>· το Α ανοίγει την αφήγηση στη μέση της δράσης → <b>in medias res</b>.</figcaption></figure>`; })()}
<div class="tbox ex"><h4>Πρωτότυπο απόσπασμα: εντοπισμός τεχνικών</h4>
${PASSAGE(`Η σφυριξιά του τρένου έσκισε τη νύχτα, και ο Ανδρέας άφησε τη βαλίτσα να πέσει στην αποβάθρα. Είκοσι χρόνια πριν, στον ίδιο σταθμό, είχε αποχαιρετήσει τη μητέρα του. Τα χρόνια που ακολούθησαν, στα εργοστάσια της Βόρειας Ευρώπης, πέρασαν σαν ένα μακρύ, γκρίζο απόγευμα. Δεν ήξερε ακόμη πως εκείνο το βράδυ θα ήταν το τελευταίο του ταξίδι.`, { num: "par" })}
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p><b>In medias res:</b> η αφήγηση ανοίγει με τη σφυριξιά και την πτώση της βαλίτσας, στη μέση της δράσης. <b>Αναδρομή:</b> «Είκοσι χρόνια πριν… είχε αποχαιρετήσει» (υπερσυντέλικος) → φωτίζεται το παρελθόν και το τραύμα του αποχωρισμού. <b>Επιτάχυνση:</b> «Τα χρόνια που ακολούθησαν… πέρασαν» → είκοσι χρόνια σε μία περίοδο λόγου· τονίζεται η μονοτονία της ξενιτιάς (με παρομοίωση «σαν ένα μακρύ, γκρίζο απόγευμα»). <b>Πρόληψη:</b> «Δεν ήξερε ακόμη πως… θα ήταν το τελευταίο» → δημιουργεί αγωνία και τραγική ειρωνεία.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><ul>
<li>Μπερδεύουμε <b>αναδρομή</b> και <b>πρόληψη</b>: ρώτα «το γεγονός συνέβη πριν ή μετά από το “τώρα” της αφήγησης;».</li>
<li>Γράφουμε «επιβράδυνση» για κάθε περιγραφή: επιβράδυνση υπάρχει όταν η περιγραφή/σχόλιο <b>καθυστερεί κάτι που περιμένουμε</b> να συμβεί.</li>
<li>Παραλείπουμε τη λειτουργία της τεχνικής στο συγκεκριμένο κείμενο (π.χ. «η αναδρομή εξηγεί γιατί ο ήρωας φοβάται το τρένο»).</li></ul></div>`,
  widget: "nb1time",
  gen: "nb1gTime",
  exercises: [
    { level: 1, type: "mc", q: R`Η επιστροφή της αφήγησης σε γεγονότα που συνέβησαν πριν από την κύρια δράση ονομάζεται:`, options: ["Αναδρομή", "Πρόληψη", "Επιτάχυνση", "In medias res"], correct: 0,
      hint: R`Πηγαίνουμε πίσω στον χρόνο.`, sol: R`<b>Αναδρομή</b>: επιστροφή στο παρελθόν (συχνά με «θυμήθηκε», υπερσυντέλικο).` },
    { level: 1, type: "mc", q: R`Τι σημαίνει ότι ένα διήγημα αρχίζει <i>in medias res</i>;`, options: ["Αρχίζει από τη μέση της δράσης, χωρίς εισαγωγή", "Αρχίζει με περιγραφή του τόπου", "Αρχίζει από το τέλος της ιστορίας και τελειώνει στην αρχή", "Αρχίζει με σχόλιο του αφηγητή"], correct: 0,
      hint: R`Λατινικά: «στο μέσο των πραγμάτων».`, sol: R`Η αφήγηση ξεκινά <b>στο μέσο της δράσης</b>· τα προηγούμενα γεγονότα δίνονται αργότερα, συχνά με αναδρομή. Δημιουργεί ένταση και περιέργεια.` },
    { level: 1, type: "mc", q: R`Στη φράση <i>«Πέρασαν τρία χρόνια χωρίς νέα του.»</i> η τεχνική είναι:`, options: ["Επιτάχυνση", "Επιβράδυνση", "Αναδρομή", "Επανάληψη"], correct: 0,
      hint: R`Πόσος χρόνος της ιστορίας χωρά σε πόσες λέξεις;`, sol: R`Τρία χρόνια αποδίδονται σε μία πρόταση → <b>επιτάχυνση</b>.` },
    { level: 2, type: "mc", q: R`Ποια είναι μια συνηθισμένη λειτουργία της <b>πρόληψης</b>;`, options: ["Δημιουργεί αγωνία ή τραγική ειρωνεία, αφού ο αναγνώστης μαθαίνει κάτι που ο ήρωας αγνοεί", "Επιβραδύνει την αφήγηση με λεπτομερείς περιγραφές", "Εξηγεί το παρελθόν του ήρωα", "Δίνει ζωντάνια με τον ευθύ λόγο"], correct: 0,
      hint: R`Τι νιώθει ο αναγνώστης όταν ξέρει από πριν το τέλος;`, sol: R`Η πρόληψη προαναγγέλλει το μέλλον· γεννά <b>αγωνία</b> («πώς θα συμβεί;») και συχνά <b>τραγική ειρωνεία</b> (ο ήρωας δεν ξέρει όσα ξέρουμε).` },
    { level: 2, type: "mc", q: R`Να διαβάσετε το απόσπασμα (πρωτότυπο κείμενο):${PASSAGE(`Το γράμμα ήταν στο τραπέζι. Πριν το ανοίξει, κοίταξε τον φάκελο: τα γραμματόσημα με το πρόσωπο μιας ξένης βασίλισσας, τη σφραγίδα που είχε μουτζουρώσει, τη γνώριμη γραφή με τα στρογγυλά γράμματα, τη μικρή σχισμή στη μια γωνία. Ύστερα τον γύρισε ανάποδα και ξανακοίταξε τη διεύθυνση.`)}Ποια τεχνική κυριαρχεί;`, options: ["Επιβράδυνση", "Επιτάχυνση", "Πρόληψη", "In medias res"], correct: 0,
      hint: R`Το «άνοιγμα του γράμματος» γίνεται γρήγορα ή καθυστερεί;`, sol: R`Η λεπτομερής περιγραφή του φακέλου <b>καθυστερεί</b> το άνοιγμα του γράμματος → <b>επιβράδυνση</b>· δημιουργεί αγωνία και δείχνει τον δισταγμό του προσώπου.` },
    { level: 2, type: "mc", q: R`Ποια φράση (πρωτότυπη) περιέχει <b>επανάληψη</b> ως τεχνική του χρόνου;`, options: ["«Κάθε Κυριακή η γιαγιά έστρωνε το ίδιο τραπεζομάντιλο και περίμενε τα παιδιά της που δεν έρχονταν.»", "«Χρόνια μετά θα θυμόταν εκείνη τη μέρα.»", "«Τρία χρόνια πέρασαν σαν μια μέρα.»", "«Θυμήθηκε την πρώτη φορά που είδε τη θάλασσα.»"], correct: 0,
      hint: R`Ποια φράση αφηγείται μία φορά κάτι που γινόταν ξανά και ξανά;`, sol: R`Το «κάθε Κυριακή» δηλώνει γεγονός που επαναλαμβανόταν → <b>επανάληψη</b>· δείχνει την εμμονή της αναμονής και τη μοναξιά.` },
    { level: 2, type: "mc", q: R`Ποια γραμματική ένδειξη συνοδεύει συχνά την <b>αναδρομή</b>;`, options: ["Ο υπερσυντέλικος (είχε φύγει, είχαν γνωριστεί) και ρήματα μνήμης", "Ο μέλλοντας (θα φύγει)", "Η προστακτική (φύγε)", "Η παθητική φωνή"], correct: 0,
      hint: R`Ποιος χρόνος δηλώνει κάτι που έγινε «πριν από» μια άλλη στιγμή του παρελθόντος;`, sol: R`Ο <b>υπερσυντέλικος</b> δηλώνει πράξη προγενέστερη από άλλη στο παρελθόν· μαζί με ρήματα όπως «θυμήθηκε», «του ήρθε στο μυαλό» σηματοδοτεί αναδρομή.` },
    { shuffle: true, level: 3, type: "mc", q: R`Να διαβάσετε το απόσπασμα (πρωτότυπο κείμενο εξάσκησης):${PASSAGE(`«Μην ανοίξεις!» ούρλιαξε η Κατερίνα, μα ήταν αργά. Το νερό όρμησε από την πόρτα του υπογείου. Το πρωί εκείνης της μέρας ο πατέρας είχε πει πως το ποτάμι δεν θα φούσκωνε ποτέ ως το σπίτι τους.`)}Ποια ανάλυση είναι σωστή;`, options: ["In medias res στην αρχή και αναδρομή στη συνέχεια· η αναδρομή δημιουργεί τραγική ειρωνεία, αφού ο λόγος του πατέρα διαψεύδεται", "Πρόληψη στην αρχή και επιτάχυνση στη συνέχεια", "Επιβράδυνση σε όλο το απόσπασμα", "Αναδρομή στην αρχή και in medias res στη συνέχεια"], correct: 0,
      hint: R`Πώς ανοίγει το απόσπασμα; Πότε ειπώθηκαν τα λόγια του πατέρα σε σχέση με την πλημμύρα;`, sol: R`Το απόσπασμα ανοίγει με κραυγή στη μέση της καταστροφής → <b>in medias res</b>. Το «Το πρωί… είχε πει» (υπερσυντέλικος) γυρίζει πίσω → <b>αναδρομή</b>. Η βεβαιότητα του πατέρα, που μόλις διαψεύστηκε, γεννά <b>τραγική ειρωνεία</b>.` },
    { shuffle: true, level: 3, type: "mc", q: R`Να διαβάσετε την αρχή ενός μυθιστορήματος (πρωτότυπο κείμενο εξάσκησης):${PASSAGE(`Τον Στέλιο Αντωνίου τον έθαψαν ένα βροχερό πρωί του Μαρτίου, και στην κηδεία του ήρθε όλη η γειτονιά.

Είχε γεννηθεί εβδομήντα χρόνια νωρίτερα, σε ένα σπίτι με αυλή στην άκρη του χωριού, και από παιδί ονειρευόταν να γίνει καπετάνιος.`, { num: "par" })}Στη συνέχεια το μυθιστόρημα αφηγείται τη ζωή του ήρωα από την παιδική του ηλικία. Ποια είναι η σωστή περιγραφή;`, options: ["Η αφήγηση ξεκινά από το τέλος της ιστορίας και ακολουθεί εκτεταμένη αναδρομή, που εξηγεί πώς φτάσαμε εκεί", "Πρόκειται για πρόληψη, αφού η κηδεία είναι μελλοντικό γεγονός", "Πρόκειται για γραμμική αφήγηση με χρονολογική σειρά", "Πρόκειται για επανάληψη, γιατί η κηδεία αφηγείται δύο φορές"], correct: 0,
      hint: R`Σύγκρινε τη σειρά του κειμένου με τη σειρά της ιστορίας.`, sol: R`Η κηδεία είναι χρονολογικά το τέλος, αλλά αφηγείται πρώτη· η ζωή του ήρωα δίνεται μετά → <b>εκτεταμένη αναδρομή</b>. Ο αναγνώστης ξέρει το τέλος· το ενδιαφέρον μετατοπίζεται στο «πώς» και στο «γιατί».` }
  ]
},
/* ───────────────────────────── 1.4 ───────────────────────────── */
{
  id: "1.4", unit: 1, title: "Εκφραστικά μέσα και σχήματα λόγου: μεταφορά, παρομοίωση, προσωποποίηση, αντίθεση και η λειτουργία τους",
  book: "Σύνοψη Λογοτεχνικού Γραμματισμού: Εκφραστικά μέσα — αναγνώριση και λειτουργία τους στο κείμενο · Ποιητική λέξη – Σύμβολο",
  intro: "Πώς ξεχωρίζουμε μεταφορά από παρομοίωση ή προσωποποίηση — και τι γράφουμε για τη «λειτουργία» ενός σχήματος λόγου στις εξετάσεις;",
  thumb: LETTER("Μεταφορά"),
  theory: R`
<p>Τα <b>εκφραστικά μέσα</b> (σχήματα λόγου) είναι οι τρόποι με τους οποίους η λογοτεχνική γλώσσα απομακρύνεται από την απλή, κυριολεκτική διατύπωση για να γίνει πιο παραστατική, μουσική και συγκινησιακή. Στις Παγκύπριες δεν αρκεί να τα <b>αναγνωρίσεις</b>: πρέπει να εξηγήσεις τη <b>λειτουργία</b> τους στο συγκεκριμένο κείμενο. Όλα τα παραδείγματα εδώ είναι πρωτότυπα.</p>
<div class="tbox def"><h4>Σχήματα σημασίας (εικονοποιία)</h4>
<table class="tbl"><tr><th>Σχήμα</th><th>Τι είναι</th><th>Παράδειγμα (πρωτότυπο)</th></tr>
<tr><td><b>Παρομοίωση</b></td><td>Σύγκριση δύο εννοιών με κοινό γνώρισμα, με λέξη σύγκρισης (σαν, όπως, σάμπως, λες και)</td><td>Τα μάτια της έλαμπαν <u>σαν</u> δυο αστέρια.</td></tr>
<tr><td><b>Μεταφορά</b></td><td>Χρήση λέξης με μεταφορική σημασία· ταύτιση χωρίς λέξη σύγκρισης</td><td>Η μάνα του ήταν <u>βράχος</u>.</td></tr>
<tr><td><b>Προσωποποίηση</b></td><td>Απόδοση ανθρώπινων ιδιοτήτων σε άψυχα, ζώα ή αφηρημένες έννοιες</td><td>Το σπίτι <u>αναστέναξε</u>.</td></tr>
<tr><td><b>Αλληγορία</b></td><td>Εκτεταμένη εικόνα/ιστορία που σημαίνει κάτι άλλο από αυτό που λέει</td><td>Ο λύκος φόρεσε τη στολή του βοσκού…</td></tr>
<tr><td><b>Σύμβολο</b></td><td>Λέξη/εικόνα που, πέρα από την κυριολεξία, παραπέμπει σε ευρύτερη ιδέα</td><td>Το κλειδί του σπιτιού στα κατεχόμενα (μνήμη, ελπίδα επιστροφής)</td></tr>
<tr><td><b>Εικόνα</b></td><td>Παράσταση που απευθύνεται στις αισθήσεις: <b>οπτική, ακουστική, οσφρητική, γευστική, απτική</b></td><td>Μύριζε φρεσκοψημένο ψωμί (οσφρητική).</td></tr>
<tr><td><b>Υπερβολή</b></td><td>Μεγαλοποίηση ή σμίκρυνση της πραγματικότητας</td><td>Σου το έχω πει χίλιες φορές.</td></tr>
<tr><td><b>Κοσμητικά επίθετα</b></td><td>Επίθετα που «στολίζουν» το ουσιαστικό και ζωντανεύουν την εικόνα</td><td>η γαλανή, η αφρισμένη θάλασσα</td></tr>
<tr><td><b>Ειρωνεία</b></td><td>Λέγεται το αντίθετο από αυτό που εννοείται</td><td>«Τι ωραία μέρα!» (μέσα στην μπόρα)</td></tr>
<tr><td><b>Οξύμωρο</b></td><td>Συνδυασμός αντιφατικών εννοιών</td><td>εκκωφαντική σιωπή</td></tr></table></div>
<div class="tbox def"><h4>Σχήματα λόγου που αφορούν τη δομή και τον ήχο</h4>
<table class="tbl"><tr><th>Σχήμα</th><th>Τι είναι</th><th>Παράδειγμα (πρωτότυπο)</th></tr>
<tr><td><b>Επανάληψη</b> (και αναφορά)</td><td>Επανάληψη λέξης/φράσης (στην αρχή διαδοχικών φράσεων: αναφορά)</td><td><u>Θυμάμαι</u> τα δειλινά, <u>θυμάμαι</u> τις φωνές.</td></tr>
<tr><td><b>Αντίθεση</b></td><td>Αντιπαράθεση αντίθετων εννοιών</td><td>Μικρό το σπίτι, μεγάλη η καρδιά.</td></tr>
<tr><td><b>Ασύνδετο σχήμα</b></td><td>Παράθεση λέξεων/προτάσεων χωρίς συνδέσμους</td><td>Ήρθε, κοίταξε, χαμογέλασε, έφυγε.</td></tr>
<tr><td><b>Πολυσύνδετο</b></td><td>Συχνή επανάληψη του συνδέσμου «και»</td><td>Και έτρεχε και φώναζε και χτυπούσε…</td></tr>
<tr><td><b>Παρήχηση</b></td><td>Επανάληψη του ίδιου φθόγγου για ηχητικό αποτέλεσμα</td><td><u>Β</u>ρέχει <u>β</u>αριά, <u>β</u>ροντάει ο <u>β</u>οριάς.</td></tr>
<tr><td><b>Ρητορικό ερώτημα</b></td><td>Ερώτηση που δεν περιμένει απάντηση· ισοδυναμεί με έντονη κατάφαση/άρνηση</td><td>Ποιος ξεχνά τον τόπο του;</td></tr>
<tr><td><b>Σχήμα κύκλου</b></td><td>Η φράση/στροφή αρχίζει και τελειώνει με την ίδια λέξη</td><td><u>Μόνος</u> ήρθε, κι έφυγε <u>μόνος</u>.</td></tr>
<tr><td><b>Σχήμα των τριών</b></td><td>Τριπλή επανάληψη (δημοτική ποίηση, παραμύθι)</td><td>τρεις μέρες, τρεις νύχτες, την τρίτη αυγή</td></tr>
<tr><td><b>Σχήμα αδυνάτου</b></td><td>Κάτι εξαρτάται από ένα αδύνατο γεγονός → δεν θα συμβεί ποτέ</td><td>Όταν ανθίσουν τα λιθάρια, θα σε ξεχάσω.</td></tr></table></div>
<div class="tbox thm"><h4>Πώς γράφεις τη λειτουργία</h4><p>Η Σύνοψη δίνει τις βασικές λειτουργίες: τα εκφραστικά μέσα <b>προσφέρουν ρυθμό/μουσικότητα</b>, <b>δημιουργούν ζωντανές εικόνες</b>, <b>τονίζουν το νόημα</b> και <b>ενισχύουν τη συναισθηματική ένταση</b>. Στην απάντηση σύνδεσε πάντα τη γενική λειτουργία με το <b>συγκεκριμένο νόημα</b>:</p>
<div class="fbox"><b>Όρος</b> → <b>παράθεμα</b> → <b>τι τονίζει / τι συναίσθημα δημιουργεί εδώ</b></div>
<p>Π.χ. «Με την προσωποποίηση “το σπίτι αναστέναξε” το άδειο σπίτι παρουσιάζεται να θρηνεί σαν άνθρωπος· έτσι τονίζεται η ερημιά μετά την αναχώρηση των παιδιών και ενισχύεται η μελαγχολική ατμόσφαιρα».</p></div>
<div class="tbox rem"><h4>Μεταφορά ή προσωποποίηση;</h4><p>Η προσωποποίηση είναι ειδική μορφή μεταφοράς. Αν η μεταφορική σημασία δίνει <b>ανθρώπινη ιδιότητα</b> σε κάτι μη ανθρώπινο, προτίμησε τον ακριβέστερο όρο «προσωποποίηση». Αν απλώς ταυτίζονται δύο έννοιες (μάνα = βράχος), είναι «μεταφορά».</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><ul>
<li>Μεταφορά αντί για παρομοίωση: αν υπάρχει «σαν/όπως», είναι παρομοίωση.</li>
<li>Γενικόλογη λειτουργία («για να είναι πιο ωραίο το κείμενο»): πάντα σε σχέση με το νόημα και το συναίσθημα του συγκεκριμένου σημείου.</li>
<li>Αναγνώριση σχήματος χωρίς παράθεμα: γράψε τη λέξη ή τους στίχους που το περιέχουν.</li></ul></div>`,
  widget: "nb1fig",
  gen: "nb1gFig",
  exercises: [
    { level: 1, type: "mc", q: R`Στη φράση <i>«Η θάλασσα απλωνόταν ήσυχη σαν λάδι.»</i> το εκφραστικό μέσο είναι:`, options: ["Παρομοίωση", "Μεταφορά", "Προσωποποίηση", "Υπερβολή"], correct: 0,
      hint: R`Ψάξε τη λέξη σύγκρισης.`, sol: R`Η λέξη «σαν» δηλώνει σύγκριση → <b>παρομοίωση</b>· τονίζεται η απόλυτη ηρεμία της θάλασσας.` },
    { level: 1, type: "mc", q: R`Στη φράση <i>«Ο άνεμος έκλαιγε όλη νύχτα στα κεραμίδια.»</i> το εκφραστικό μέσο είναι:`, options: ["Προσωποποίηση", "Παρομοίωση", "Σχήμα αδυνάτου", "Ασύνδετο σχήμα"], correct: 0,
      hint: R`Μπορεί ο άνεμος να κλάψει κυριολεκτικά;`, sol: R`Ο άνεμος αποκτά ανθρώπινη ιδιότητα (κλαίει) → <b>προσωποποίηση</b>· ο ήχος του ανέμου γίνεται θρήνος και δημιουργεί πένθιμη ατμόσφαιρα.` },
    { level: 1, type: "mc", q: R`Ποιο σχήμα λόγου υπάρχει στη φράση <i>«Έφαγε, ήπιε, σηκώθηκε, χάθηκε.»</i>;`, options: ["Ασύνδετο σχήμα", "Πολυσύνδετο σχήμα", "Παρομοίωση", "Ειρωνεία"], correct: 0,
      hint: R`Υπάρχουν σύνδεσμοι ανάμεσα στα ρήματα;`, sol: R`Τα ρήματα παρατίθενται χωρίς συνδέσμους → <b>ασύνδετο σχήμα</b>: γρήγορος ρυθμός, αίσθηση βιασύνης.` },
    { level: 1, type: "fields", q: R`Γράψτε τον όρο για το σχήμα λόγου όπου κάτι εξαρτάται από ένα αδύνατο γεγονός, π.χ. <i>«Όταν ο ήλιος βγει από τη δύση, τότε θα σε ξεχάσω.»</i>`, fields: [{ label: "Σχήμα:", ans: ["σχήμα αδυνάτου", "σχημα του αδυνατου", "σχήμα του αδύνατου", "αδύνατο", "αδυνατο", "σχήμα αδύνατου"], text: true, nopunct: true, wide: true }],
      hint: R`Το σχήμα είναι χαρακτηριστικό της δημοτικής ποίησης.`, sol: R`<b>Σχήμα αδυνάτου</b>: η πράξη συνδέεται με κάτι που δεν μπορεί να γίνει, άρα δηλώνεται ότι δεν θα συμβεί ποτέ (εδώ: δεν θα σε ξεχάσω ποτέ).` },
    { level: 2, type: "mc", q: R`Ποια είναι η καλύτερη διατύπωση της <b>λειτουργίας</b> της παρήχησης στη φράση <i>«Σφυρίζει, σέρνεται, σωπαίνει το σκοινί στο σκοτάδι.»</i> (πρωτότυπη);`, options: ["Η επανάληψη του «σ» μιμείται τον σφυριχτό ήχο του σκοινιού και ενισχύει την απειλητική, σκοτεινή ατμόσφαιρα", "Η παρήχηση δείχνει ότι ο ποιητής ξέρει καλά τη γλώσσα", "Η παρήχηση κάνει το κείμενο πιο ωραίο", "Η παρήχηση δηλώνει αναδρομή στο παρελθόν"], correct: 0,
      hint: R`Σύνδεσε τον ήχο με το νόημα και το συναίσθημα.`, sol: R`Η επανάληψη του φθόγγου «σ» (<b>παρήχηση</b>) αναπαράγει ηχητικά το σφύριγμα και το σύρσιμο του σκοινιού· δημιουργεί <b>ρυθμό</b> και <b>απειλητική ατμόσφαιρα</b>.` },
    { level: 2, type: "mc", q: R`Στη φράση <i>«Πλούσιος σε χρήματα, φτωχός σε αγάπη.»</i> κυριαρχεί:`, options: ["Αντίθεση", "Οξύμωρο", "Παρομοίωση", "Σχήμα κύκλου"], correct: 0,
      hint: R`Δύο αντίθετες έννοιες αποδίδονται σε διαφορετικούς τομείς.`, sol: R`<b>Αντίθεση</b>: πλούσιος – φτωχός. Τονίζει ότι ο υλικός πλούτος δεν συνοδεύεται από συναισθηματική πληρότητα. (Οξύμωρο θα ήταν αν οι αντιφατικές έννοιες ενώνονταν σε μία, π.χ. «φτωχός πλούτος».)` },
    { level: 2, type: "mc", q: R`Τι λειτουργία έχει συνήθως το <b>ρητορικό ερώτημα</b> σε ένα ποίημα;`, options: ["Εντείνει το συναίσθημα και δηλώνει εμφατικά μια βεβαιότητα ή διαμαρτυρία, χωρίς να ζητά απάντηση", "Ζητά πληροφορίες από τον αναγνώστη", "Επιβραδύνει την αφήγηση", "Δείχνει ότι ο ποιητής δεν ξέρει την απάντηση"], correct: 0,
      hint: R`Περιμένει απάντηση ο ομιλητής;`, sol: R`Το ρητορικό ερώτημα <b>δεν ζητά απάντηση</b>· ισοδυναμεί με έντονη κατάφαση/άρνηση, προκαλεί προβληματισμό και ενισχύει τη συναισθηματική φόρτιση.` },
    { level: 2, type: "fields", q: R`Στη φράση <i>«Η καρδιά της ήταν ένα κλειστό παράθυρο.»</i> ποιο εκφραστικό μέσο υπάρχει; (μία λέξη)`, fields: [{ label: "Σχήμα:", ans: ["μεταφορά", "μεταφορα"], text: true, nopunct: true }],
      hint: R`Υπάρχει λέξη σύγκρισης; Η «καρδιά» μπορεί κυριολεκτικά να είναι παράθυρο;`, sol: R`<b>Μεταφορά</b>: η καρδιά ταυτίζεται με «κλειστό παράθυρο»· δηλώνεται ότι η ηρωίδα έχει κλειστεί συναισθηματικά, δεν αφήνει κανέναν να την πλησιάσει.` },
    { level: 3, type: "mc", q: R`Να διαβάσετε τους στίχους (πρωτότυπο ποίημα εξάσκησης):${PASSAGE(`Η πόλη μας κοιμάται με ανοιχτά τα μάτια,
κρατάει στα δόντια της ένα κλειδί σκουριασμένο,
και κάθε βράδυ ρωτά τη θάλασσα:
πότε, πότε θα γυρίσουν τα παιδιά μου;`, { num: "line" })}Ποιος συνδυασμός εκφραστικών μέσων είναι σωστός;`, options: ["Προσωποποίηση της πόλης (στ. 1–4), σύμβολο το κλειδί (στ. 2), επανάληψη «πότε, πότε» (στ. 4)", "Παρομοίωση (στ. 1), υπερβολή (στ. 2), ειρωνεία (στ. 4)", "Σχήμα αδυνάτου (στ. 1), οξύμωρο (στ. 3), ασύνδετο (στ. 4)", "Αλληγορία (στ. 2), σχήμα κύκλου (στ. 1–4), πολυσύνδετο (στ. 3)"], correct: 0,
      hint: R`Ποιο πρόσωπο «κοιμάται», «κρατά», «ρωτά»; Τι παραπέμπει σε κάτι ευρύτερο;`, sol: R`Η πόλη κοιμάται, κρατά, ρωτά: <b>προσωποποίηση</b>, που την κάνει μάνα σε πένθος. Το «κλειδί σκουριασμένο» είναι <b>σύμβολο</b> της χαμένης εστίας και της ελπίδας της επιστροφής, φθαρμένης από τον χρόνο. Η <b>επανάληψη</b> «πότε, πότε» εντείνει την αγωνία της αναμονής.` },
    { level: 3, type: "mc", q: R`Ποια από τις παρακάτω απαντήσεις μαθητών για τη φράση <i>«Το σπίτι αναστέναξε όταν έφυγαν τα παιδιά.»</i> θα πάρει <b>πλήρη</b> βαθμό;`, options: ["«Προσωποποίηση: “το σπίτι αναστέναξε”. Το άψυχο σπίτι παρουσιάζεται να θρηνεί σαν άνθρωπος· τονίζεται η ερημιά μετά την αναχώρηση των παιδιών και ενισχύεται η μελαγχολική ατμόσφαιρα.»", "«Υπάρχει προσωποποίηση.»", "«Προσωποποίηση, για να γίνει πιο ωραίο το κείμενο.»", "«Μεταφορά, γιατί το σπίτι δεν μπορεί να αναστενάξει. Ο ποιητής ήταν λυπημένος.»"], correct: 0,
      hint: R`Όρος + παράθεμα + λειτουργία στο συγκεκριμένο νόημα.`, sol: R`Η πλήρης απάντηση έχει <b>όρο</b>, <b>παράθεμα</b> και <b>λειτουργία</b> που συνδέεται με το νόημα (ερημιά, μελαγχολία). Οι άλλες είτε σταματούν στην αναγνώριση είτε δίνουν γενικόλογη ή βιογραφική εξήγηση.` }
  ]
},
/* ───────────────────────────── 1.5 ───────────────────────────── */
{
  id: "1.5", unit: 1, title: "Στιχουργική: μέτρο, συλλαβισμός, δεκαπεντασύλλαβος, ομοιοκαταληξία και ελεύθερος στίχος",
  book: "Σύνοψη Λογοτεχνικού Γραμματισμού: Δημοτική ποίηση · Παραδοσιακή ποίηση (μέτρο, στροφές, ομοιοκαταληξία) · Μοντέρνα ποίηση (ελεύθερος στίχος)",
  intro: "Πώς βρίσκουμε αν ένας στίχος είναι ιαμβικός ή τροχαϊκός, πόσες συλλαβές έχει, και τι λέμε για την ομοιοκαταληξία ή τον ελεύθερο στίχο;",
  thumb: LETTER("στίχος"),
  theory: R`
<p>Η <b>στιχουργική</b> μελετά τη μορφή του στίχου: τον αριθμό των συλλαβών, τη θέση των τόνων (<b>μέτρο</b>), την <b>ομοιοκαταληξία</b> και τις <b>στροφές</b>. Στις Παγκύπριες τη χρειάζεσαι για να χαρακτηρίσεις ένα ποίημα ως <b>δημοτικό, παραδοσιακό ή μοντέρνο</b> και για τη σύγκριση με αδίδακτο κείμενο. Παραδείγματα: δημοτική ποίηση, Σολωμός (1823), Ερωτόκριτος, και πρωτότυποι στίχοι.</p>
<div class="tbox def"><h4>Συλλαβισμός: μετρικές συλλαβές</h4>
<p>Μετράμε τις συλλαβές όπως <b>προφέρονται</b>. Δύο γειτονικά φωνήεντα συχνά προφέρονται σε μία συλλαβή:</p>
<ul><li><b>Συνίζηση</b> (μέσα στη λέξη): βια, ποτάμια, κα-ρά-βια· στον Σολωμό «με-τρά‿ει» μετρά ως μία συλλαβή στο «τρά‿ει».</li>
<li><b>Συνεκφώνηση</b> (ανάμεσα σε λέξεις): «γνωρίζω από» → γνω-ρί-ζω‿α-πό· «κι η γης» → κι‿η γης.</li>
<li><b>Έκθλιψη / αφαίρεση</b>: χάνεται φωνήεν με απόστροφο: «απ' το», «'χω».</li></ul></div>
<div class="tbox def"><h4>Μέτρο: πού πέφτουν οι τόνοι</h4>
<table class="tbl"><tr><th>Μέτρο</th><th>Μοτίβο (∪ άτονη, – τονισμένη)</th><th>Τόνοι στις θέσεις</th></tr>
<tr><td><b>Ιαμβικός</b></td><td>∪ – (άτονη – τονισμένη)</td><td>2, 4, 6, 8…</td></tr>
<tr><td><b>Τροχαϊκός</b></td><td>– ∪ (τονισμένη – άτονη)</td><td>1, 3, 5, 7…</td></tr>
<tr><td>Δακτυλικός</td><td>– ∪ ∪</td><td>1, 4, 7…</td></tr>
<tr><td>Αναπαιστικός</td><td>∪ ∪ –</td><td>3, 6, 9…</td></tr>
<tr><td>Αμφίβραχυς</td><td>∪ – ∪</td><td>2, 5, 8…</td></tr></table>
<p>Δεν χρειάζεται να τονίζεται <b>κάθε</b> ζυγή (ή μονή) θέση· αρκεί οι τόνοι που υπάρχουν να πέφτουν σε θέσεις του μοτίβου. Οι μονοσύλλαβες λέξεις, που στο μονοτονικό δεν παίρνουν τόνο, μπορεί να τονίζονται μετρικά (π.χ. «γης», «βια»).</p>
${PASSAGE(`Ο Δι-γε-νής ψυ-χο-μα-χεί κι‿η γης το-νε τρο-μά-ζει`, { title: "Δημοτικό ακριτικό τραγούδι — 15 συλλαβές, τόνοι στις θέσεις 4, 8, 10, 14 → ιαμβικός δεκαπεντασύλλαβος" })}
${PASSAGE(`Σε γνω-ρί-ζω‿α-πό την κό-ψη
του σπα-θιού την τρο-με-ρή`, { title: "Δ. Σολωμός, «Ύμνος εις την Ελευθερίαν» (1823) — 8 και 7 συλλαβές, τόνοι σε μονές θέσεις → τροχαϊκός", num: "line" })}</div>
<div class="tbox thm"><h4>Ο δεκαπεντασύλλαβος</h4><p>Ο <b>ιαμβικός δεκαπεντασύλλαβος</b> είναι ο εθνικός στίχος της ελληνικής ποίησης: 15 συλλαβές, τόνοι σε ζυγές θέσεις (υποχρεωτικά στην 14η), <b>τομή</b> (παύση) μετά την 8η συλλαβή, που τον χωρίζει σε δύο <b>ημιστίχια</b> (8 + 7). Κυριαρχεί στη <b>δημοτική ποίηση</b>, στον <b>Ερωτόκριτο</b> και σε πολλούς έντεχνους ποιητές. Στη δημοτική ποίηση ισχύει ο <b>κανόνας της ισομετρίας</b>: κάθε στίχος (ή ημιστίχιο) ολοκληρώνει ένα νόημα.</p></div>
<div class="tbox def"><h4>Ομοιοκαταληξία και στροφές</h4>
<p><b>Ομοιοκαταληξία</b> είναι η ηχητική ταύτιση του τέλους δύο ή περισσότερων στίχων, από την τονισμένη συλλαβή και μετά (ποτ<u>άμι</u> – καλ<u>άμι</u>). Τη συμβολίζουμε με γράμματα:</p>
<table class="tbl"><tr><th>Σχήμα</th><th>Όνομα</th></tr><tr><td>αα ββ</td><td><b>Ζευγαρωτή</b></td></tr><tr><td>αβ αβ</td><td><b>Πλεχτή</b></td></tr><tr><td>αββα</td><td><b>Κλειστή</b> (σε ορισμένα βιβλία: «σταυρωτή»)</td></tr></table>
${PASSAGE(`Λάμπει πάνω στο ποτάμι
το φεγγάρι το χλωμό,
τρέμει στο χλωρό καλάμι
σαν τραγούδι σιγανό.`, { title: "Πρωτότυπο τετράστιχο εξάσκησης — τροχαϊκό (8 / 7 συλλαβές), πλεχτή ομοιοκαταληξία αβαβ", num: "line" })}
<p>Ανάλογα με το πλήθος των στίχων οι στροφές λέγονται <b>δίστιχα, τρίστιχα, τετράστιχα</b> κ.λπ.</p></div>
<div class="tbox def"><h4>Παραδοσιακή και μοντέρνα ποίηση</h4>
<div class="figrow"><div><p><b>Παραδοσιακή ποίηση</b>: μέτρο, συμμετρικές στροφές, ομοιοκαταληξία, λυρικό ύφος, συνάφεια τίτλου και περιεχομένου.</p></div>
<div><p><b>Μοντέρνα ποίηση</b>: <b>ελεύθερος στίχος</b> (χωρίς μέτρο και ομοιοκαταληξία), άνισες στροφές, χαλαρή στίξη, <b>διασκελισμός</b> (το νόημα συνεχίζεται στον επόμενο στίχο), σύμβολα, ασάφεια/πολυσημία, καθημερινή γλώσσα, αινιγματικός τίτλος.</p></div></div>
<p>Στην ανάλυση εξηγείς και τη <b>λειτουργία</b> της μορφής: το μέτρο και η ομοιοκαταληξία δίνουν <b>μουσικότητα</b> και ευκολία απομνημόνευσης· ο ελεύθερος στίχος επιτρέπει <b>φυσικότητα, ελευθερία έκφρασης</b> και έμφαση σε λέξεις που απομονώνονται σε δικό τους στίχο.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><ul>
<li>Μετράμε τις γραμμένες, όχι τις προφερόμενες συλλαβές (ξεχνάμε συνίζηση και συνεκφώνηση).</li>
<li>Λέμε «ελεύθερος στίχος» για κάθε ανομοιοκατάληκτο ποίημα: ελεύθερος είναι ο στίχος χωρίς μέτρο· υπάρχουν και έμμετροι ανομοιοκατάληκτοι στίχοι.</li>
<li>Περιγράφουμε τη μορφή χωρίς να τη συνδέσουμε με το νόημα και το ύφος.</li></ul></div>`,
  widget: "nb1metre",
  gen: "nb1gMet",
  exercises: [
    { level: 1, type: "mc", q: R`Σε ποιο μέτρο οι τόνοι πέφτουν στις <b>ζυγές</b> συλλαβές (2, 4, 6…);`, options: ["Ιαμβικό", "Τροχαϊκό", "Δακτυλικό", "Αναπαιστικό"], correct: 0,
      hint: R`Ίαμβος = άτονη – τονισμένη.`, sol: R`Στον <b>ιαμβικό</b> στίχο (∪ –) οι τόνοι πέφτουν σε ζυγές θέσεις.` },
    { level: 1, type: "fields", q: R`Πόσες συλλαβές έχει ο δεκαπεντασύλλαβος στίχος και μετά από ποια συλλαβή υπάρχει συνήθως η τομή;`, fields: [{ label: "Συλλαβές:", ans: 15 }, { label: "Τομή μετά την:", ans: 8 }],
      hint: R`Το όνομα δίνει τη μία απάντηση· τα ημιστίχια είναι άνισα.`, sol: R`<b>15</b> συλλαβές· η τομή μετά την <b>8η</b> συλλαβή τον χωρίζει σε δύο ημιστίχια (8 + 7).` },
    { level: 1, type: "mc", q: R`Ποιο σχήμα ομοιοκαταληξίας ονομάζεται <b>ζευγαρωτή</b>;`, options: ["ααββ", "αβαβ", "αββα", "αβγδ"], correct: 0, shuffle: true,
      hint: R`Ζευγάρια διαδοχικών στίχων.`, sol: R`<b>Ζευγαρωτή</b>: ομοιοκαταληκτούν οι διαδοχικοί στίχοι ανά δύο (αα ββ).` },
    { level: 2, type: "fields", q: R`Πόσες μετρικές συλλαβές έχει ο στίχος του «Ερωτόκριτου»; ${PASSAGE(`Του κύκλου τα γυρίσματα που ανεβοκατεβαίνουν`)}`, fields: [{ label: "Συλλαβές:", ans: 15 }],
      hint: R`Πρόσεξε τη συνεκφώνηση «που ανε-».`, sol: R`Του · κύ · κλου · τα · γυ · ρί · σμα · τα · που‿α · νε · βο · κα · τε · βαί · νουν → <b>15</b> (ιαμβικός δεκαπεντασύλλαβος, τόνοι 2, 6, 14).` },
    { level: 2, type: "mc", q: R`Ποιο είναι το μέτρο του πρωτότυπου στίχου <i>«Τρέμει στο χλωρό καλάμι»</i>;`, options: ["Τροχαϊκός", "Ιαμβικός", "Αναπαιστικός", "Δακτυλικός"], correct: 0,
      hint: R`Συλλάβισε: τρέ-μει-στο-χλω-ρό-κα-λά-μι. Πού πέφτουν οι τόνοι;`, sol: R`Τόνοι στις θέσεις 1 (τρέ), 5 (ρό), 7 (λά) → μονές θέσεις → <b>τροχαϊκός</b> οκτασύλλαβος.` },
    { level: 2, type: "fields", q: R`Γράψτε με γράμματα (π.χ. ααββ) το σχήμα ομοιοκαταληξίας του πρωτότυπου τετράστιχου:${PASSAGE(`Μες στην έρημη αυλή
ξύπνησε το περιβόλι,
κι άνθισαν οι κήποι όλοι,
κελαηδάει ένα πουλί.`, { num: "line" })}`, fields: [{ label: "Σχήμα:", ans: ["αββα", "abba"], text: true, nospace: true, ph: "π.χ. ααββ" }],
      hint: R`Σημείωσε με το ίδιο γράμμα όσους στίχους «ταιριάζουν» στο τέλος.`, sol: R`αυλή – πουλί (α), περιβόλι – όλοι (β) → <b>αββα</b>: κλειστή ομοιοκαταληξία.` },
    { level: 2, type: "mc", q: R`Ποιο από τα παρακάτω χαρακτηρίζει τη <b>μοντέρνα</b> ποίηση;`, options: ["Ελεύθερος στίχος, διασκελισμός, σύμβολα και χαλαρή στίξη", "Ιαμβικός δεκαπεντασύλλαβος με ισομετρία", "Σταθερές στροφές με πλεχτή ομοιοκαταληξία", "Σχήμα των τριών και τυπικά επίθετα"], correct: 0,
      hint: R`Η μοντέρνα ποίηση «απελευθερώνει» τη μορφή.`, sol: R`Η μοντέρνα ποίηση χρησιμοποιεί <b>ελεύθερο στίχο</b>, <b>διασκελισμό</b>, <b>σύμβολα</b>, χαλαρή στίξη και καθημερινή γλώσσα· τα υπόλοιπα χαρακτηρίζουν τη δημοτική ή την παραδοσιακή ποίηση.` },
    { level: 3, type: "mc", q: R`Γιατί ο στίχος του Σολωμού <i>«που με βια μετράει τη γη»</i> θεωρείται <b>επτασύλλαβος</b>, ενώ γραπτά έχει οκτώ φωνηεντικά σύνολα;`, options: ["Λόγω συνίζησης: το «-τράει» προφέρεται ως μία συλλαβή, οπότε: που · με · βια · με · τρά‿ει · τη · γη", "Γιατί οι μονοσύλλαβες λέξεις δεν μετρούν", "Γιατί η τελευταία συλλαβή δεν μετράει ποτέ", "Γιατί υπάρχει έκθλιψη στο «τη γη»"], correct: 0,
      hint: R`Δύο γειτονικά φωνήεντα μέσα στη λέξη μπορεί να προφέρονται μαζί.`, sol: R`Το «α» και το «ει» του «μετράει» προφέρονται ενωμένα (<b>συνίζηση</b>) → 7 μετρικές συλλαβές, με τόνους στις θέσεις 3, 5, 7 (τροχαϊκός). Οι μονοσύλλαβες λέξεις μετρούν κανονικά ως συλλαβές.` },
    { level: 3, type: "mc", q: R`Ένα αδίδακτο ποίημα έχει ιαμβικό δεκαπεντασύλλαβο, ισομετρία, σχήμα των τριών και ανώνυμο δημιουργό. Σε ποια κατηγορία ανήκει και τι λειτουργία έχει η μορφή;`, options: ["Δημοτική ποίηση· ο σταθερός ρυθμός και οι επαναλήψεις διευκολύνουν την απομνημόνευση και την προφορική διάδοση", "Μοντέρνα ποίηση· η μορφή δηλώνει ρήξη με την παράδοση", "Υπερρεαλιστική ποίηση· η μορφή μιμείται τον ελεύθερο συνειρμό", "Θεατρικό κείμενο· η μορφή εξυπηρετεί τον διάλογο"], correct: 0,
      hint: R`Ανωνυμία + δεκαπεντασύλλαβος + σχήμα των τριών…`, sol: R`Τα γνωρίσματα παραπέμπουν στη <b>δημοτική ποίηση</b>. Ο σταθερός ρυθμός, η ισομετρία και οι επαναλήψεις (σχήμα των τριών) εξυπηρετούν την <b>προφορική απόδοση και απομνημόνευση</b>, και δίνουν μουσικότητα και λιτή δύναμη.` }
  ]
},
/* ───────────────────────────── 1.6 ───────────────────────────── */
{
  id: "1.6", unit: 1, title: "Λογοτεχνικά ρεύματα και γενιές: από τη δημοτική ποίηση στη γενιά του '30 και την κυπριακή λογοτεχνία",
  book: "Πλαίσιο Μάθησης Λογοτεχνίας Γ΄ Λυκείου · ένταξη των έργων στην εποχή τους (εξεταστέα κείμενα πίνακα προδιαγραφών 2026)",
  intro: "Σε ποια γενιά ανήκουν ο Σεφέρης, ο Ελύτης, ο Αναγνωστάκης ή ο Μόντης — και γιατί μας βοηθά αυτό να ερμηνεύσουμε ένα ποίημα;",
  thumb: LETTER("Γενιές"),
  theory: R`
<p>Η ερμηνεία ενός λογοτεχνικού κειμένου γίνεται πληρέστερη όταν το εντάσσουμε στην <b>εποχή</b> του: στο ιστορικό πλαίσιο και στο <b>λογοτεχνικό ρεύμα</b> ή τη <b>γενιά</b> στην οποία ανήκει. Έτσι εξηγείται γιατί ένα ποίημα έχει ελεύθερο στίχο, γιατί μιλά για προσφυγιά ή για τη διάψευση των οραμάτων. Παρακάτω μια σύντομη χρονολογική επισκόπηση, με έμφαση στους δημιουργούς της ύλης των Παγκυπρίων.</p>
<div class="tbox def"><h4>Δημοτική ποίηση</h4><p>Ανώνυμη, προφορική, με παραλλαγές. Δεκαπεντασύλλαβος ιαμβικός, ισομετρία, σχήμα των τριών, σχήμα του αδυνάτου, τυπικά επίθετα, λιτός και ζωντανός λόγος. Κατηγορίες: ακριτικά, κλέφτικα, της ξενιτιάς, μοιρολόγια, νανουρίσματα, ιστορικά.</p></div>
<div class="tbox def"><h4>Επτανησιακή Σχολή (19ος αι.)</h4><p>Ρομαντισμός με ευρωπαϊκές επιρροές, χρήση της δημοτικής στην έντεχνη ποίηση, θέματα πατρίδας, ελευθερίας, φύσης και θρησκείας. Κορυφαίος ο <b>Διονύσιος Σολωμός</b> («Ύμνος εις την Ελευθερίαν», 1823)· επίσης ο Αριστοτέλης Βαλαωρίτης. Ο σύγχρονός τους <b>Ανδρέας Κάλβος</b> (Ωδές) αποτελεί ξεχωριστή περίπτωση: γράφει σε αρχαΐζουσα γλώσσα και δεν εντάσσεται εύκολα σε σχολή.</p></div>
<div class="tbox def"><h4>Νέα Αθηναϊκή Σχολή – ηθογραφία (τέλη 19ου αι.)</h4><p>Επικράτηση της δημοτικής (δημοτικισμός), ποίηση του <b>Κωστή Παλαμά</b>· στην πεζογραφία η <b>ηθογραφία</b> (ζωή της υπαίθρου, ήθη και έθιμα): Παπαδιαμάντης, Καρκαβίτσας.</p></div>
<div class="tbox def"><h4>Κ. Π. Καβάφης</h4><p>Ιδιαίτερη μορφή, από την Αλεξάνδρεια. Ιστορικά, φιλοσοφικά και ερωτικά ποιήματα· λιτότητα, πεζολογικό ύφος, <b>ειρωνεία</b>, θεατρικότητα· η ιστορία (ελληνιστική, βυζαντινή) ως αφορμή για διαχρονικά μηνύματα. Στην ύλη: «Αλεξανδρινοί Βασιλείς».</p></div>
<div class="tbox def"><h4>Γενιά του 1920 – Γενιά του '30</h4><p>Η <b>γενιά του 1920</b> (Καρυωτάκης, Πολυδούρη) εκφράζει απαισιοδοξία, μελαγχολία, ματαιότητα. Η <b>γενιά του '30</b> φέρνει τον <b>μοντερνισμό</b>: <b>ελεύθερο στίχο</b>, σύμβολα, πυκνότητα, υπαινικτικότητα, και τον <b>υπερρεαλισμό</b> (Εμπειρίκος, Ελύτης). Αναζητά την «ελληνικότητα» μέσα από τον μύθο, την ιστορία και το ελληνικό τοπίο. Κορυφαίοι: <b>Γιώργος Σεφέρης</b> (Νόμπελ 1963) και <b>Οδυσσέας Ελύτης</b> (Νόμπελ 1979, «Άξιον εστί»), ενώ στην ίδια γενιά ανήκει χρονολογικά και ο <b>Γιάννης Ρίτσος</b>. Στην πεζογραφία: Μυριβήλης, Βενέζης, Ι. Μ. Παναγιωτόπουλος.</p></div>
<div class="tbox def"><h4>Μεταπολεμική λογοτεχνία</h4><p>Μετά τον Β΄ Παγκόσμιο Πόλεμο, την Κατοχή και τον Εμφύλιο: <b>πολιτική ποίηση</b>, λόγος λιτός, χαμηλόφωνος, η <b>διάψευση</b> των οραμάτων· αργότερα και η αντίσταση στη δικτατορία (1967–1974). Ποιητές: <b>Μανόλης Αναγνωστάκης</b>, Τίτος Πατρίκιος. Πεζογράφοι: <b>Γιώργος Ιωάννου</b> (πεζογραφήματα με μνήμη και βίωμα), <b>Διδώ Σωτηρίου</b> (Μικρασιατική καταστροφή).</p></div>
<div class="tbox def"><h4>Κυπριακή λογοτεχνία</h4><p>Από τον <b>Βασίλη Μιχαηλίδη</b> (κυπριακή διάλεκτος, 19ος αι.) ως τους πεζογράφους και ποιητές του 20ού αιώνα, όπως ο πεζογράφος <b>Γ. Φ. Πιερίδης</b> (1904–1968). Μετά το <b>1974</b> κυριαρχούν η εισβολή, η <b>προσφυγιά</b>, τα κατεχόμενα, οι αγνοούμενοι, η νοσταλγία — συνδυασμός προσωπικού και συλλογικού τραύματος. Στην ύλη: <b>Κώστας Μόντης</b>, <b>Παντελής Μηχανικός</b>, <b>Κυριάκος Χαραλαμπίδης</b>, Γ. Φ. Πιερίδης.</p></div>
<div class="tbox tip"><h4>Πώς το αξιοποιείς στις εξετάσεις</h4><p>Μην γράφεις βιογραφικά στοιχεία «για να γεμίσει η απάντηση». Χρησιμοποίησε την εποχή μόνο όταν <b>εξηγεί</b> κάτι στο κείμενο: π.χ. «ο ελεύθερος στίχος και τα σύμβολα εντάσσουν το ποίημα στη μοντέρνα ποίηση», ή «η αναφορά στο στρατόπεδο συνδέεται με την εμπειρία της προσφυγιάς μετά το 1974».</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><ul><li>Ταυτίζουμε το ποιητικό υποκείμενο με τον ποιητή επειδή ξέρουμε τη βιογραφία του.</li><li>Αποδίδουμε στον Καβάφη χαρακτηριστικά της γενιάς του '30 (π.χ. υπερρεαλισμό).</li><li>Γράφουμε γενικά ιστορικά στοιχεία χωρίς σύνδεση με το συγκεκριμένο απόσπασμα.</li></ul></div>`,
  widget: "nb1eras",
  gen: "nb1gEra",
  exercises: [
    { shuffle: true, level: 1, type: "mc", q: R`Σε ποια γενιά εντάσσονται ο Γιώργος Σεφέρης και ο Οδυσσέας Ελύτης;`, options: ["Γενιά του '30", "Γενιά του 1920", "Επτανησιακή Σχολή", "Μεταπολεμική γενιά"], correct: 0,
      hint: R`Η γενιά που έφερε τον μοντερνισμό στην ελληνική ποίηση.`, sol: R`Και οι δύο ανήκουν στη <b>γενιά του '30</b>· βραβεύτηκαν με Νόμπελ (Σεφέρης 1963, Ελύτης 1979).` },
    { shuffle: true, level: 1, type: "mc", q: R`Ποιος από τους παρακάτω ποιητές είναι Κύπριος;`, options: ["Κώστας Μόντης", "Γιώργος Σεφέρης", "Μανόλης Αναγνωστάκης", "Κωστής Παλαμάς"], correct: 0,
      hint: R`Στην ύλη υπάρχει έργο του με τίτλο «Τρίτο γράμμα στη μητέρα».`, sol: R`Ο <b>Κώστας Μόντης</b> είναι από τους σημαντικότερους Κύπριους ποιητές· στην ύλη το «Τρίτο γράμμα στη μητέρα, ζ΄».` },
    { level: 1, type: "mc", q: R`Ο Διονύσιος Σολωμός, ποιητής του «Ύμνου εις την Ελευθερίαν», ανήκει στην:`, options: ["Επτανησιακή Σχολή", "Νέα Αθηναϊκή Σχολή", "Γενιά του '30", "Δημοτική ποίηση"], correct: 0,
      hint: R`Καταγόταν από τη Ζάκυνθο.`, sol: R`Ο Σολωμός είναι ο κορυφαίος της <b>Επτανησιακής Σχολής</b> (19ος αι.).` },
    { level: 2, type: "mc", q: R`Ποιο από τα παρακάτω είναι χαρακτηριστικό της <b>μεταπολεμικής</b> ποίησης;`, options: ["Πολιτικός προβληματισμός, διάψευση των οραμάτων, λιτός και χαμηλόφωνος λόγος", "Αυστηρό μέτρο, ομοιοκαταληξία και ρομαντικός πατριωτισμός", "Ανωνυμία και προφορική διάδοση", "Ηθογραφικές περιγραφές της υπαίθρου"], correct: 0,
      hint: R`Σκέψου την εμπειρία του πολέμου και του Εμφυλίου.`, sol: R`Η μεταπολεμική ποίηση (π.χ. Αναγνωστάκης) έχει <b>πολιτικό χαρακτήρα</b>, εκφράζει τη <b>διάψευση</b> και χρησιμοποιεί λιτό, πεζολογικό λόγο.` },
    { level: 2, type: "mc", q: R`Ποιο θέμα κυριαρχεί στην κυπριακή λογοτεχνία <b>μετά το 1974</b>;`, options: ["Η εισβολή, η προσφυγιά, τα κατεχόμενα και οι αγνοούμενοι", "Η ζωή της αθηναϊκής αστικής τάξης", "Η Μικρασιατική καταστροφή αποκλειστικά", "Τα βυζαντινά ιστορικά πρόσωπα"], correct: 0,
      hint: R`Τι συνέβη στην Κύπρο το 1974;`, sol: R`Μετά την τουρκική εισβολή του 1974 κυριαρχούν η <b>προσφυγιά</b>, η <b>νοσταλγία</b> για τα κατεχόμενα, οι <b>αγνοούμενοι</b> — προσωπικό και συλλογικό τραύμα.` },
    { level: 2, type: "mc", q: R`Ποιο χαρακτηριστικό ταιριάζει στην ποίηση του Κ. Π. Καβάφη;`, options: ["Ιστορικά θέματα ως αφορμή για διαχρονικά μηνύματα, λιτότητα και ειρωνεία", "Υπερρεαλιστικές εικόνες και ελεύθερος συνειρμός", "Κυπριακή διάλεκτος και θέματα αγώνα", "Ανωνυμία και δεκαπεντασύλλαβος"], correct: 0,
      hint: R`Σκέψου τους «Αλεξανδρινούς Βασιλείς».`, sol: R`Ο Καβάφης αξιοποιεί την <b>ιστορία</b> (ελληνιστική, βυζαντινή) για διαχρονικά μηνύματα, με <b>λιτότητα</b>, πεζολογικό ύφος και <b>ειρωνεία</b>.` },
    { level: 2, type: "mc", q: R`Ποιο ρεύμα εισάγει στην ελληνική ποίηση ο Ανδρέας Εμπειρίκος και επηρεάζει τον Ελύτη;`, options: ["Υπερρεαλισμό", "Ρομαντισμό", "Ηθογραφία", "Νατουραλισμό"], correct: 0,
      hint: R`Ρεύμα που στηρίζεται στον ελεύθερο συνειρμό και στις τολμηρές εικόνες.`, sol: R`Ο Εμπειρίκος είναι ο εισηγητής του <b>υπερρεαλισμού</b> στην Ελλάδα· στοιχεία του βρίσκουμε και στην ποίηση του Ελύτη.` },
    { level: 3, type: "mc", q: R`Ένα αδίδακτο ποίημα έχει ελεύθερο στίχο, σύμβολα και θέμα την προσφυγιά μετά το 1974. Ποια ένταξη είναι η πιο τεκμηριωμένη;`, options: ["Νεότερη κυπριακή ποίηση με μοντέρνα μορφή: ο ελεύθερος στίχος και τα σύμβολα ανήκουν στη μοντέρνα ποίηση, το θέμα στην κυπριακή εμπειρία μετά το 1974", "Επτανησιακή Σχολή, λόγω του πατριωτικού θέματος", "Δημοτική ποίηση, λόγω του θέματος του ξεριζωμού", "Γενιά του 1920, λόγω της μελαγχολίας"], correct: 0,
      hint: R`Συνδύασε μορφή (μοντέρνα) και θέμα/εποχή (1974).`, sol: R`Η μορφή (ελεύθερος στίχος, σύμβολα) παραπέμπει στη <b>μοντέρνα ποίηση</b> και το θέμα στην <b>κυπριακή λογοτεχνία μετά το 1974</b>. Η τεκμηριωμένη ένταξη συνδυάζει μορφή και θεματική.` }
  ]
},
/* ───────────────────────────── 1.7 ───────────────────────────── */
{
  id: "1.7", unit: 1, title: "Σύγκριση διδαγμένου με αδίδακτο κείμενο: μέθοδος, πίνακας σύγκρισης και ενδεικτική απάντηση",
  book: "Δομή εξεταστικού δοκιμίου (σύγκριση διδαγμένου με αδίδακτο κείμενο) · Σύνοψη Λογοτεχνικού Γραμματισμού",
  intro: "Πώς συγκρίνουμε ένα διδαγμένο με ένα αδίδακτο κείμενο ως προς το θέμα, τη «φωνή», τα εκφραστικά μέσα και το ύφος — βήμα βήμα, όπως ζητούν οι Παγκύπριες;",
  thumb: LETTER("Α ↔ Β"),
  theory: R`
<p>Η <b>σύγκριση</b> ενός διδαγμένου με ένα <b>αδίδακτο</b> λογοτεχνικό κείμενο εμφανίζεται σταθερά στα εξεταστικά δοκίμια (στη Λογοτεχνία των Νέων Ελληνικών και, υποχρεωτικά, στη Λογοτεχνία Εμβάθυνσης). Ζητείται να εντοπίσεις <b>ομοιότητες και διαφορές</b> ως προς τη θεματική, τις αφηγηματικές τεχνικές (αν τα κείμενα είναι πεζά), το ύφος και τα εκφραστικά μέσα, πάντα <b>με τεκμήρια</b> από τα δύο κείμενα.</p>
<div class="tbox thm"><h4>Η μέθοδος σε 5 βήματα</h4><ol>
<li><b>Διάβασε την εκφώνηση</b>: ποια κριτήρια ζητούνται (π.χ. «ως προς το θέμα και δύο εκφραστικά μέσα»); πόσες ομοιότητες/διαφορές; τι έκταση;</li>
<li><b>Κατανόησε το αδίδακτο</b>: ποιος μιλά, σε ποιον, για τι, με ποιο συναίσθημα; Υπογράμμισε λέξεις-κλειδιά.</li>
<li><b>Φτιάξε πίνακα σύγκρισης</b> (στο πρόχειρο): κριτήρια στις γραμμές, κείμενο Α και Β στις στήλες, «ομοιότητα/διαφορά» στην τελευταία.</li>
<li><b>Γράψε σε συνεχή λόγο</b>, όχι σε πίνακα: για κάθε κριτήριο, παρουσίασε και τα δύο κείμενα με <b>παραθέματα</b> και σύνδεσέ τα με διαρθρωτικές λέξεις.</li>
<li><b>Κλείσε με σύνθεση</b>: ένα συμπέρασμα για το πώς τα δύο κείμενα προσεγγίζουν το ίδιο θέμα με διαφορετικά μέσα.</li></ol></div>
<div class="tbox def"><h4>Κριτήρια σύγκρισης</h4>
<table class="tbl"><tr><th>Κριτήριο</th><th>Τι ρωτάω</th></tr>
<tr><td>Θέμα / μοτίβα</td><td>Για τι μιλά κάθε κείμενο; Κοινά μοτίβα (ξενιτιά, πόλεμος, μνήμη, μάνα, θάλασσα);</td></tr>
<tr><td>Φωνή</td><td>Ποιητικό υποκείμενο ή αφηγητής, πρόσωπο, αποδέκτης</td></tr>
<tr><td>Εκφραστικά μέσα</td><td>Μεταφορές, εικόνες, σύμβολα, επαναλήψεις, αντιθέσεις…</td></tr>
<tr><td>Αφηγηματικές τεχνικές (πεζά)</td><td>Τύπος αφηγητή, τρόποι, χρόνος (αναδρομή, πρόληψη…)</td></tr>
<tr><td>Μορφή</td><td>Παραδοσιακή/μοντέρνα, μέτρο, ομοιοκαταληξία, ελεύθερος στίχος</td></tr>
<tr><td>Ύφος / συναίσθημα</td><td>Λυρικό, νοσταλγικό, ειρωνικό, δραματικό, λιτό…</td></tr></table></div>
<div class="tbox ex"><h4>Υπόδειγμα με δύο κείμενα</h4>
<div class="figrow"><div>${PASSAGE(`Σα βγεις στον πηγαιμό για την Ιθάκη,
να εύχεσαι νάναι μακρύς ο δρόμος,
γεμάτος περιπέτειες, γεμάτος γνώσεις.`, { title: "Κείμενο Α: Κ. Π. Καβάφης, «Ιθάκη» (1911), στ. 1–3", num: "line" })}</div>
<div>${PASSAGE(`Γύρισα στο νησί μου ένα απόγευμα του Νοέμβρη.
Το λιμάνι μικρότερο απ' όσο το θυμόμουν,
τα σπίτια χαμηλά, οι φωνές αλλιώτικες.
Κι όμως κάτι στη μυρωδιά της θάλασσας
μού είπε πως ο δρόμος δεν ήταν χαμένος.`, { title: "Κείμενο Β: «Επιστροφή» (πρωτότυπο ποίημα εξάσκησης)", num: "line" })}</div></div>
<p><b>Εκφώνηση (τύπου Παγκυπρίων):</b> Να συγκρίνετε τα δύο κείμενα ως προς το θέμα και ως προς ένα εκφραστικό μέσο. (Έκταση περίπου 100–120 λέξεις.)</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary><p>Και τα δύο κείμενα αξιοποιούν το μοτίβο του <b>ταξιδιού</b>. Στο Κείμενο Α ο δρόμος προς την Ιθάκη προβάλλεται ως πολύτιμη πορεία ζωής· το ποιητικό υποκείμενο, απευθυνόμενο σε β΄ πρόσωπο («Σα βγεις», «να εύχεσαι»), συμβουλεύει να είναι ο δρόμος «μακρύς». Αντίθετα, στο Κείμενο Β κυριαρχεί η <b>επιστροφή</b>: ο ομιλητής, σε α΄ πρόσωπο («Γύρισα»), διαπιστώνει τις αλλαγές του χρόνου. Ως προς τα εκφραστικά μέσα, στο Α η <b>επανάληψη</b> «γεμάτος περιπέτειες, γεμάτος γνώσεις» τονίζει τον πλούτο των εμπειριών, ενώ στο Β οι <b>εικόνες</b> (οπτικές, ακουστική, οσφρητική: «μυρωδιά της θάλασσας») αποδίδουν τη νοσταλγία και την τελική παρηγοριά. Έτσι, και τα δύο καταλήγουν ότι η διαδρομή έχει αξία, το Α ως προτροπή, το Β ως βίωμα.</p></details></div>
<div class="tbox tip"><h4>Χρήσιμες διαρθρωτικές λέξεις</h4><p><b>Ομοιότητα:</b> και τα δύο κείμενα, ομοίως, παρόμοια, το ίδιο, αντίστοιχα. <b>Διαφορά:</b> αντίθετα, ενώ, ωστόσο, από την άλλη, σε αντίθεση με. <b>Προσθήκη:</b> επιπλέον, ακόμη, επίσης. <b>Σύνθεση:</b> συνοψίζοντας, έτσι, επομένως.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><ul>
<li>Αναλύουμε πρώτα όλο το Α και μετά όλο το Β χωρίς πραγματική σύγκριση: σύγκρινε <b>ανά κριτήριο</b>.</li>
<li>Γράφουμε σε πίνακα ή σε κουκκίδες: η απάντηση δίνεται σε <b>συνεχή λόγο</b>.</li>
<li>Δεν βάζουμε παραθέματα και από τα δύο κείμενα· ή ξεπερνάμε κατά πολύ την έκταση.</li>
<li>Εξετάζουμε κριτήρια που δεν ζητήθηκαν, αφήνοντας εκτός αυτά που ζητήθηκαν.</li></ul></div>`,
  widget: "nb1cmp",
  exercises: [
    { level: 1, type: "mc", q: R`Πώς πρέπει να γράφεται η απάντηση σε ερώτηση σύγκρισης διδαγμένου με αδίδακτο κείμενο;`, options: ["Σε συνεχή λόγο, ανά κριτήριο, με παραθέματα και από τα δύο κείμενα", "Σε πίνακα με δύο στήλες", "Σε κουκκίδες, χωρίς παραθέματα", "Με ανάλυση μόνο του αδίδακτου κειμένου"], correct: 0,
      hint: R`Ο πίνακας βοηθά στο πρόχειρο — όχι στην τελική απάντηση.`, sol: R`Η απάντηση γράφεται σε <b>συνεχή λόγο</b>, οργανωμένη <b>ανά κριτήριο</b>, με <b>τεκμήρια/παραθέματα</b> και από τα δύο κείμενα.` },
    { level: 1, type: "mc", q: R`Ποια διαρθρωτική λέξη/φράση εισάγει <b>διαφορά</b>;`, options: ["Αντίθετα", "Ομοίως", "Και τα δύο κείμενα", "Αντίστοιχα"], correct: 0,
      hint: R`Ποια φράση δηλώνει αντιπαράθεση;`, sol: R`Το «<b>αντίθετα</b>» (όπως και τα «ενώ», «ωστόσο», «σε αντίθεση με») εισάγει διαφορά· τα άλλα δηλώνουν ομοιότητα.` },
    { level: 2, type: "mc", q: R`Το Κείμενο Α είναι ποίημα σε β΄ πρόσωπο με συμβουλευτικό τόνο· το Κείμενο Β είναι ποίημα σε α΄ πρόσωπο με εξομολογητικό τόνο. Ως προς το κριτήριο «φωνή», έχουμε:`, options: ["Διαφορά", "Ομοιότητα", "Ταυτότητα", "Δεν μπορεί να συγκριθεί"], correct: 0,
      hint: R`Σύγκρινε το πρόσωπο και τη στάση του ομιλητή.`, sol: R`Η φωνή διαφέρει (β΄ πρόσωπο συμβουλευτικό ↔ α΄ πρόσωπο εξομολογητικό) → <b>διαφορά</b>.` },
    { level: 2, type: "mc", q: R`Ποιο είναι το σωστό <b>πρώτο βήμα</b> πριν γράψεις μια σύγκριση;`, options: ["Να εντοπίσεις στην εκφώνηση ποια κριτήρια και πόσες ομοιότητες/διαφορές ζητούνται", "Να γράψεις τη βιογραφία των δύο συγγραφέων", "Να αντιγράψεις ολόκληρο το αδίδακτο κείμενο", "Να ξεκινήσεις αμέσως την ανάλυση του διδαγμένου"], correct: 0, shuffle: true,
      hint: R`Τι βαθμολογείται; Αυτό που ζητά η εκφώνηση.`, sol: R`Ξεκινάς από την <b>εκφώνηση</b>: ποια κριτήρια (θέμα, εκφραστικά μέσα, ύφος…), πόσα στοιχεία και τι έκταση ζητούνται. Έτσι δεν χάνεις μονάδες απαντώντας σε κάτι άλλο.` },
    { level: 2, type: "mc", q: R`Ένα διδαγμένο πεζό και ένα αδίδακτο πεζό συγκρίνονται «ως προς τις αφηγηματικές τεχνικές». Ποιο από τα παρακάτω είναι κατάλληλο κριτήριο;`, options: ["Ο τύπος του αφηγητή και η χρήση αναδρομής", "Η ομοιοκαταληξία", "Το μέτρο του στίχου", "Ο αριθμός των σελίδων"], correct: 0,
      hint: R`Ποια στοιχεία αφορούν τον τρόπο που αφηγείται η ιστορία;`, sol: R`Αφηγηματικές τεχνικές είναι ο <b>τύπος αφηγητή</b>, η εστίαση, οι αφηγηματικοί τρόποι, ο <b>χρόνος</b> (αναδρομή, πρόληψη) κ.λπ. Μέτρο και ομοιοκαταληξία αφορούν ποιήματα.` },
    { level: 3, type: "mc", q: R`Να διαβάσετε τα δύο κείμενα:${PASSAGE(`Ξενιτεμένο μου πουλί και παραπονεμένο,
η ξενιτιά σε χαίρεται κι εγώ 'χω τον καημό σου.`, { title: "Κείμενο Α: Δημοτικό τραγούδι της ξενιτιάς (απόσπασμα)", num: "line" })}${PASSAGE(`Η μάνα κρατούσε το γράμμα στα γόνατά της και δεν το άνοιγε. Ήξερε απέξω τον γραφικό χαρακτήρα του γιου της, τις στραβές του γραμμές. Έξω ο αέρας χτυπούσε τα παντζούρια. «Καλά είμαι, μάνα», θα έγραφε πάλι. Κι εκείνη θα έκανε πως το πιστεύει.`, { title: "Κείμενο Β: «Το γράμμα» (πρωτότυπο κείμενο εξάσκησης)" })}Ποια σύνθεση της σύγκρισής τους είναι η πιο εύστοχη;`, options: ["Κοινό θέμα ο πόνος του αποχωρισμού· το Α τον εκφράζει άμεσα, με λιτότητα και ρυθμό, το Β υπαινικτικά, μέσα από λεπτομέρειες και τις σκέψεις του προσώπου", "Τα δύο κείμενα δεν έχουν τίποτα κοινό", "Και τα δύο είναι δημοτικά τραγούδια", "Το Β είναι καλύτερο γιατί είναι πιο σύγχρονο"], correct: 0,
      hint: R`Η σύνθεση ενώνει την ομοιότητα (θέμα) με τις διαφορές (μορφή, μέσα).`, sol: R`Εύστοχη σύνθεση: <b>κοινό θέμα</b> (αποχωρισμός) + <b>διαφορετικοί τρόποι</b> (ποίημα: άμεσο, ρυθμικό, μεταφορά/αντίθεση· πεζό: υπαινικτικό, εικόνες, σκέψεις). Αξιολογικές κρίσεις («καλύτερο») δεν τεκμηριώνονται.` },
    { level: 3, type: "fields", q: R`Πόσα κριτήρια πρέπει να εξετάσεις αν η εκφώνηση λέει: «Να συγκρίνετε τα δύο κείμενα ως προς το θέμα, το ποιητικό υποκείμενο και ένα εκφραστικό μέσο»;`, fields: [{ label: "Κριτήρια:", ans: 3 }],
      hint: R`Μέτρησε τα «ως προς…».`, sol: R`<b>3</b> κριτήρια: θέμα, ποιητικό υποκείμενο, ένα εκφραστικό μέσο. Για καθένα γράφεις και τα δύο κείμενα με τεκμήρια, αλλιώς χάνεις μονάδες.` },
    { level: 3, type: "mc", q: R`Να διαβάσετε τα δύο κείμενα:${PASSAGE(`Σα βγεις στον πηγαιμό για την Ιθάκη,
να εύχεσαι νάναι μακρύς ο δρόμος,
γεμάτος περιπέτειες, γεμάτος γνώσεις.`, { title: "Κείμενο Α: Κ. Π. Καβάφης, «Ιθάκη» (1911), στ. 1–3", num: "line" })}${PASSAGE(`Γύρισα στο νησί μου ένα απόγευμα του Νοέμβρη.
Το λιμάνι μικρότερο απ' όσο το θυμόμουν,
τα σπίτια χαμηλά, οι φωνές αλλιώτικες.
Κι όμως κάτι στη μυρωδιά της θάλασσας
μού είπε πως ο δρόμος δεν ήταν χαμένος.`, { title: "Κείμενο Β: «Επιστροφή» (πρωτότυπο ποίημα εξάσκησης)", num: "line" })}Ποια πρόταση είναι <b>σωστά τεκμηριωμένη</b> σύγκριση εκφραστικών μέσων;`, options: ["«Στο Α η επανάληψη “γεμάτος … γεμάτος” τονίζει τον πλούτο των εμπειριών, ενώ στο Β η οσφρητική εικόνα “μυρωδιά της θάλασσας” αποδίδει τη νοσταλγία.»", "«Και τα δύο έχουν ωραία σχήματα λόγου.»", "«Στο Α υπάρχει επανάληψη, στο Β δεν υπάρχει τίποτα.»", "«Το Α έχει ομοιοκαταληξία, ενώ το Β όχι.»"], correct: 0,
      hint: R`Όρος + παράθεμα + λειτουργία, για κάθε κείμενο.`, sol: R`Μόνο η πρόταση με τα παραθέματα «γεμάτος … γεμάτος» και «μυρωδιά της θάλασσας» δίνει <b>όρο, τεκμήριο και λειτουργία</b> και για τα δύο κείμενα. (Οι στίχοι της «Ιθάκης» δεν έχουν ομοιοκαταληξία.)` }
  ]
},
/* ───────────────────────────── 2.1 ───────────────────────────── */
{
  id: "2.1", unit: 2, title: "Κ. Π. Καβάφης, «Αλεξανδρινοί Βασιλείς» — ανάλυση, ειρωνεία, θεατρικότητα",
  book: "ΑΝΠ Γ΄, σ. 50–51 · Πλαίσιο Λογοτεχνίας Γ΄ Λυκείου (ΚΚ), Α΄ τετράμηνο, Κείμενο 1",
  intro: "Γιατί οι Αλεξανδρινοί ζητωκραυγάζουν σε μια τελετή που ξέρουν ότι είναι «θέατρο»; Η ανάλυση των «Αλεξανδρινών Βασιλέων» του Καβάφη για τις Παγκύπριες.",
  thumb: LETTER("Καβάφης"),
  theory: R`
<div class="tbox def"><h4>Ταυτότητα του ποιήματος</h4>
<p>Οι <b>«Αλεξανδρινοί Βασιλείς»</b> του <b>Κωνσταντίνου Π. Καβάφη</b> (Αλεξάνδρεια, 1863–1933) δημοσιεύτηκαν το <b>1912</b> και ανήκουν στα <b>ιστορικά ποιήματα</b> του ποιητή. Το θέμα αντλείται από τον <b>Πλούταρχο</b> (<i>Βίος Αντωνίου</i>): το <b>34 π.Χ.</b>, στο Γυμνάσιο της Αλεξάνδρειας, ο Μάρκος Αντώνιος και η Κλεοπάτρα ανακήρυξαν βασιλείς τα παιδιά της Κλεοπάτρας — τον <b>Καισαρίωνα</b> (γιο του Ιουλίου Καίσαρα), τον <b>Αλέξανδρο</b> και τον <b>Πτολεμαίο</b> — μοιράζοντάς τους, στα λόγια, χώρες που στην πραγματικότητα δεν έλεγχαν. Λίγα χρόνια μετά (31–30 π.Χ.) ο Οκταβιανός θα νικήσει, η Κλεοπάτρα θα αυτοκτονήσει και ο Καισαρίων θα θανατωθεί: ο αναγνώστης που ξέρει την ιστορία «ακούει» ήδη την ειρωνεία.</p></div>
${PASSAGE(`Μαζεύθηκαν οι Αλεξανδρινοί
να δουν της Κλεοπάτρας τα παιδιά,
τον Καισαρίωνα, και τα μικρά του αδέρφια,
Αλέξανδρο και Πτολεμαίο, που πρώτη
φορά τα βγάζαν έξω στο Γυμνάσιο,
εκεί να τα κηρύξουν βασιλείς,
μες στη λαμπρή παράταξι των στρατιωτών.

Ο Αλέξανδρος — τον είπαν βασιλέα
της Αρμενίας, της Μηδίας, και των Πάρθων.
Ο Πτολεμαίος — τον είπαν βασιλέα
της Κιλικίας, της Συρίας, και της Φοινίκης.
Ο Καισαρίων στέκονταν πιο εμπροστά,
ντυμένος σε μετάξι τριανταφυλλί,
στο στήθος του ανθοδέσμη από υακίνθους,
η ζώνη του διπλή σειρά σαπφείρων κι αμεθύστων,
δεμένα τα ποδήματά του μ' άσπρες
κορδέλλες κεντημένες με ροδόχροα μαργαριτάρια.
Αυτόν τον είπαν πιότερο από τους μικρούς,
αυτόν τον είπαν Βασιλέα των Βασιλέων.

Οι Αλεξανδρινοί ένοιωθαν βέβαια
που ήσαν λόγια αυτά και θεατρικά.

Αλλά η μέρα ήτανε ζεστή και ποιητική,
ο ουρανός ένα γαλάζιο ανοιχτό,
το Αλεξανδρινό Γυμνάσιον ένα
θριαμβικό κατόρθωμα της τέχνης,
των αυλικών η πολυτέλεια έκτακτη,
ο Καισαρίων όλο χάρις κι εμορφιά
(της Κλεοπάτρας υιός, αίμα των Λαγιδών)·
κ' οι Αλεξανδρινοί έτρεχαν πια στην εορτή,
κ' ενθουσιάζονταν, κ' επευφημούσαν
ελληνικά, κ' αιγυπτιακά, και ποιοι εβραίικα,
γοητευμένοι με τ' ωραίο θέαμα —
μ' όλο που βέβαια ήξευραν τι άξιζαν αυτά,
τι κούφια λόγια ήσανε αυτές οι βασιλείες.`, { title: "Κ. Π. Καβάφης, «Αλεξανδρινοί Βασιλείς» (1912)", num: "line", source: "Ποίημα του 1912 (κοινό κτήμα). Έλεγξε τη γραφή με την ΑΝΠ Γ΄, σ. 50–51." })}
<div class="tbox"><h4>Δομή — τρεις νοηματικές ενότητες</h4>
<table class="tbl nbl"><tr><th>Στίχοι</th><th>Περιεχόμενο</th></tr>
<tr><td>1–19</td><td>Η τελετή: συγκέντρωση του πλήθους, ανακήρυξη του Αλέξανδρου και του Πτολεμαίου, λεπτομερής περιγραφή του Καισαρίωνα, ο τίτλος «Βασιλέας των Βασιλέων».</td></tr>
<tr><td>20–21</td><td>Η γνώση των Αλεξανδρινών: ξέρουν ότι όλα είναι «λόγια» και «θεατρικά» — το σχόλιο που ανατρέπει τη λαμπρότητα.</td></tr>
<tr><td>22–34</td><td>Παρ' όλα αυτά, η ωραία μέρα, η αρχιτεκτονική, η πολυτέλεια και η ομορφιά του Καισαρίωνα τους παρασύρουν: επευφημούν σε τρεις γλώσσες, γοητευμένοι από το θέαμα, αν και ξέρουν πόσο «κούφιες» είναι αυτές οι βασιλείες.</td></tr></table></div>
<div class="tbox"><h4>Ποιητικό υποκείμενο και οπτική γωνία</h4>
<p>Το ποιητικό υποκείμενο <b>δεν ταυτίζεται με τον Καβάφη</b>: είναι ένας αφηγητής-παρατηρητής, σαν ιστορικός, που μιλά σε γ΄ πρόσωπο και φαίνεται να περιγράφει αντικειμενικά. Η αποστασιοποίηση όμως είναι επιφανειακή: με την επιλογή των λεπτομερειών, με το επίρρημα «βέβαια» (δύο φορές) και με τον αντιθετικό σύνδεσμο «αλλά» διαμορφώνει μια <b>ειρωνική στάση</b> απέναντι στην τελετή και στο πλήθος.</p></div>
<div class="tbox"><h4>Εκφραστικά μέσα και λειτουργία</h4>
<table class="tbl nbl"><tr><th>Μέσο</th><th>Παράδειγμα</th><th>Λειτουργία</th></tr>
<tr><td>Εικόνες (οπτικές)</td><td>το ένδυμα, τα πετράδια, τα μαργαριτάρια του Καισαρίωνα (στ. 12–17)</td><td>παραστατικότητα· τονίζουν τη λαμπρότητα και τη θεατρικότητα της δημόσιας τελετής</td></tr>
<tr><td>Επανάληψη / επαναφορά</td><td>«τον είπαν βασιλέα…» (στ. 8, 10), «αυτόν τον είπαν…» (στ. 18–19)</td><td>έμφαση στην απονομή των τίτλων· τελετουργικός, σκηνοθετημένος χαρακτήρας· το επαναλαμβανόμενο ρήμα «είπαν» δείχνει ότι όλα μένουν στα λόγια</td></tr>
<tr><td>Αντίθεση</td><td>«λόγια αυτά και θεατρικά» (στ. 21) ↔ η λαμπρότητα (στ. 22–28)· «γοητευμένοι» ↔ «ήξευραν» (στ. 32–34)</td><td>σύγκρουση ανάμεσα στο θέαμα και στη ματαιότητα της εξουσίας</td></tr>
<tr><td>Ειρωνεία</td><td>όλο το ποίημα, με κορύφωση στον τελευταίο στίχο</td><td>αποκαλύπτει την αντίθεση φαίνεσθαι – είναι· κριτική της ματαιοδοξίας και της πολιτικής σκοπιμότητας</td></tr>
<tr><td>Πολυσύνδετο</td><td>«κ' ενθουσιάζονταν, κ' επευφημούσαν / ελληνικά, κ' αιγυπτιακά, και ποιοι εβραίικα» (στ. 30–31)</td><td>ζωντάνια, ενθουσιασμός του πλήθους· δείχνει και την πολυπολιτισμική Αλεξάνδρεια</td></tr></table></div>
<div class="tbox thm"><h4>Θεατρικότητα και νόημα</h4>
<p>Το ποίημα στήνεται σαν <b>παράσταση</b>: <b>σκηνικό</b> (το Γυμνάσιο, «θριαμβικό κατόρθωμα της τέχνης»), <b>πρόσωπα</b> (τα τρία παιδιά, οι αυλικοί, οι στρατιώτες), <b>ενδυματολογικός κώδικας</b> (το μετάξι, οι υάκινθοι, τα πετράδια), <b>θεατές</b> (οι Αλεξανδρινοί) και <b>σκηνική δράση</b> (ανακήρυξη, επευφημίες). Η λέξη «θεατρικά» λειτουργεί σαν κλειδί: η εξουσία δεν είναι πραγματική δύναμη αλλά <b>θέαμα, προπαγάνδα</b>. Ο Καβάφης σχολιάζει έτσι <b>διαχρονικά</b> τη σχέση εξουσίας και λαού: οι πολίτες συχνά αποδέχονται — και χειροκροτούν — μια εικόνα που ξέρουν ότι είναι ψεύτικη, επειδή τους γοητεύει.</p></div>
<div class="tbox"><h4>Ιστορία και λογοτεχνία</h4>
<p>Ο Πλούταρχος περιγράφει την τελετή ως πράξη που προκάλεσε την οργή των Ρωμαίων. Ο Καβάφης <b>επιλέγει</b> (αφήνει τον Αντώνιο και την Κλεοπάτρα σχεδόν εκτός σκηνής), <b>οργανώνει</b> (εστιάζει στο πλήθος) και <b>τονίζει</b> τη γοητεία του θεάματος. Έτσι μεταπλάθει δημιουργικά την ιστορία, για να μιλήσει για τη ματαιοδοξία, την προπαγάνδα και τη χειραγώγηση του πλήθους.</p></div>
<div class="tbox ex"><h4>Θέμα τύπου Παγκυπρίων</h4>
<p>Να εντοπίσετε δύο σημεία του ποιήματος όπου διαφαίνεται η ειρωνική στάση του ποιητικού υποκειμένου και να εξηγήσετε πώς η ειρωνεία ανατρέπει το έκδηλο νόημα της τελετής. (6 μονάδες)</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary>
<p><b>1ο σημείο:</b> Η διπλή επανάληψη «αυτόν τον είπαν…» (στ. 18–19) κορυφώνει τη μεγαλοπρέπεια με τον τίτλο «Βασιλέα των Βασιλέων». Αμέσως όμως ακολουθεί η διαπίστωση ότι οι Αλεξανδρινοί ήξεραν πως ήταν «λόγια αυτά και θεατρικά» (στ. 20–21): ο τίτλος αποδεικνύεται κενός, μόνο «λόγια».</p>
<p><b>2ο σημείο:</b> Οι Αλεξανδρινοί επευφημούν «γοητευμένοι με τ' ωραίο θέαμα», «μ' όλο που βέβαια ήξευραν» πόσο «κούφια λόγια» ήταν οι βασιλείες (στ. 32–34). Η αντίθεση ανάμεσα στη γνώση και στη συμπεριφορά τους, με το ειρωνικό «βέβαια», ανατρέπει το έκδηλο νόημα: η λαμπρή τελετή δεν δείχνει δύναμη αλλά ματαιότητα — και το πλήθος συμμετέχει συνειδητά σε ένα θέαμα.</p></details></div>
<div class="tbox tip"><h4>Σύγκριση με άλλο κείμενο</h4><p>Συνανάγνωση με το «Περιμένοντας τους βαρβάρους» του Καβάφη (1904): και εκεί μια σκηνοθετημένη δημόσια τελετή αποκαλύπτει τη ματαιότητα της εξουσίας μέσα από την ειρωνεία και τη θεατρικότητα.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Γράφουν «ο Καβάφης λέει…» αντί για «το ποιητικό υποκείμενο»· ονομάζουν εκφραστικό μέσο χωρίς να δίνουν τη <b>λειτουργία</b> του· αναφέρουν την ειρωνεία χωρίς να δείξουν <b>ποια</b> αντίθεση (φαίνεσθαι – είναι) αποκαλύπτει.</p></div>
`,
  widget: "nb2w21",
  gen: "nb2g21",
  exercises: [
    { level: 1, q: R`Σε ποιο έτος έγινε η τελετή που περιγράφει το ποίημα; (Γράψε τον αριθμό· π.Χ.)`, fields: [{ label: "Έτος (π.Χ.):", ans: ["34", "-34", "34 π.Χ.", "34 πΧ", "34 π.χ."], text: true, ph: "π.χ. 100" }],
      hint: R`Η τελετή, γνωστή ως «Δωρεές της Αλεξάνδρειας», έγινε λίγο πριν από τη ναυμαχία του Ακτίου (31 π.Χ.).`, sol: R`Το <b>34 π.Χ.</b>, στο Γυμνάσιο της Αλεξάνδρειας, κατά τον Πλούταρχο (Βίος Αντωνίου).` },
    { level: 1, q: R`Ποιο από τα παιδιά της Κλεοπάτρας ονομάζεται «Βασιλέας των Βασιλέων»; (Γράψε το όνομα.)`, fields: [{ label: "Όνομα:", ans: ["Καισαρίων", "ο Καισαρίων", "Καισαρίωνας"], text: true }],
      hint: R`Είναι ο γιος του Ιουλίου Καίσαρα.`, sol: R`Ο <b>Καισαρίων</b> (στ. 19).` },
    { level: 1, type: "mc", q: R`Το ποιητικό υποκείμενο του ποιήματος ταυτίζεται με τον ίδιο τον Καβάφη.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Διάκρινε πάντα τη «φωνή» του ποιήματος από τον βιογραφικό ποιητή.`, sol: R`<b>ΛΑΘΟΣ.</b> Το ποιητικό υποκείμενο είναι ένας αφηγητής-παρατηρητής που διαμορφώνει ειρωνική στάση· δεν ταυτίζεται με τον βιογραφικό Καβάφη.` },
    { level: 2, type: "mc", q: R`Ποια λειτουργία έχει η επανάληψη «τον είπαν βασιλέα… / αυτόν τον είπαν…» (στ. 8, 10, 18–19);`, options: ["Τονίζει τον τελετουργικό, σκηνοθετημένο χαρακτήρα της ανακήρυξης και ότι όλα μένουν στα «λόγια»", "Δείχνει ότι οι Αλεξανδρινοί δεν άκουσαν καλά", "Δημιουργεί ομοιοκαταληξία", "Εισάγει διάλογο ανάμεσα στους βασιλείς"], correct: 0,
      hint: R`Πρόσεξε το ρήμα που επαναλαμβάνεται: είπαν.`, sol: R`Η επανάληψη του «τον είπαν» δίνει έμφαση στην απονομή των τίτλων και ταυτόχρονα υπονομεύει την αξία τους: είναι απλώς ονομασίες, λόγια χωρίς αντίκρισμα.` },
    { level: 2, type: "mc", q: R`Ποια λέξη του ποιήματος λειτουργεί ως «κλειδί» για τη θεατρικότητα της τελετής;`, options: ["θεατρικά (στ. 21)", "ουρανός (στ. 23)", "Αρμενίας (στ. 9)", "μαργαριτάρια (στ. 17)"], correct: 0,
      hint: R`Ποια λέξη χαρακτηρίζει ρητά τα λόγια της τελετής;`, sol: R`Η λέξη <b>«θεατρικά»</b> δηλώνει ότι η τελετή είναι παράσταση: σκηνικό, πρόσωπα, κοστούμια, θεατές — όλα για εντυπωσιασμό.` },
    { level: 2, type: "mc", q: R`Ποιο σχήμα λόγου εντοπίζεται στους στ. 30–31 (επανειλημμένος σύνδεσμος «κ'/και» ανάμεσα στα ρήματα και στις γλώσσες);`, options: ["Πολυσύνδετο", "Ασύνδετο", "Οξύμωρο", "Λιτότητα"], correct: 0,
      hint: R`Πολλοί σύνδεσμοι στη σειρά ή καθόλου σύνδεσμοι;`, sol: R`<b>Πολυσύνδετο:</b> η συχνή επανάληψη του «και» δίνει ρυθμό και ζωντάνια στον ενθουσιασμό του πλήθους.` },
    { level: 2, type: "mc", q: R`Σε πόσες γλώσσες επευφημούν οι Αλεξανδρινοί και τι δείχνει αυτό;`, options: ["Σε τρεις — την πολυπολιτισμική σύνθεση της Αλεξάνδρειας", "Σε δύο — τη διάσπαση της πόλης", "Σε μία — την ενότητα του ελληνισμού", "Σε τέσσερις — την παρουσία των Ρωμαίων"], correct: 0,
      hint: R`Μέτρησε τις γλώσσες στον στ. 31.`, sol: R`Ελληνικά, αιγυπτιακά, εβραϊκά: η ελληνιστική Αλεξάνδρεια είναι πολυπολιτισμική πόλη — και όλο το πλήθος παρασύρεται από το θέαμα.` },
    { level: 3, type: "mc", q: R`Ποια ερμηνεία του τελευταίου στίχου είναι η πιο τεκμηριωμένη;`, options: ["Οι Αλεξανδρινοί ξέρουν ότι οι τίτλοι είναι κενοί, αλλά χειροκροτούν γοητευμένοι — η ειρωνεία αποκαλύπτει τη ματαιότητα της εξουσίας και τη συνενοχή του πλήθους", "Οι Αλεξανδρινοί πιστεύουν ειλικρινά στους νέους βασιλείς", "Ο ποιητής εγκωμιάζει τον Καισαρίωνα ως ιδανικό ηγέτη", "Ο στίχος αναφέρεται στην αρχιτεκτονική του Γυμνασίου"], correct: 0,
      hint: R`Συνδύασε το «ήξευραν» με το «γοητευμένοι».`, sol: R`Η αντίθεση γνώσης – συμπεριφοράς είναι ο πυρήνας της ειρωνείας: το θέαμα υπερισχύει της κριτικής σκέψης· η εξουσία νομιμοποιείται μέσα από την επίδειξη.` },
    { level: 3, type: "mc", q: R`Στο ποίημα ο Καβάφης, σε σχέση με τον Πλούταρχο:`, options: ["Επιλέγει και οργανώνει τα στοιχεία, εστιάζοντας στο πλήθος και στη γοητεία του θεάματος, για να σχολιάσει διαχρονικά την εξουσία", "Αντιγράφει πιστά την ιστορική πηγή χωρίς αλλαγές", "Αλλάζει το αποτέλεσμα της ιστορίας: η Κλεοπάτρα νικά", "Παρουσιάζει τον Αντώνιο ως κεντρικό ήρωα"], correct: 0,
      hint: R`Δείκτης 7 του Πλαισίου: ομοιότητες και διαφορές λόγου Ιστορίας – Λογοτεχνίας.`, sol: R`Η λογοτεχνία μεταπλάθει την ιστορία: επιλογή, οργάνωση, έμφαση. Ο Καβάφης κρατά το γεγονός, αλλά το φωτίζει από τη σκοπιά των θεατών, για να αναδείξει τη σχέση φαίνεσθαι – είναι.` }
  ]
},
/* ───────────────────────────── 2.2 ───────────────────────────── */
{
  id: "2.2", unit: 2, title: "Γιώργος Σεφέρης, «Ελένη» — ανάλυση, σύμβολα, αντιπολεμικό μήνυμα",
  book: "ΚΝΕΛ Β΄, σ. 209–213 ή ΑΝΠ Γ΄, σ. 86–88 · Πλαίσιο Λογοτεχνίας Γ΄ (ΚΚ), Α΄ τετράμηνο, Κείμενο 2",
  intro: "Αξίζει ένας πόλεμος για ένα «είδωλο»; Η «Ελένη» του Σεφέρη: ο Τεύκρος, η Κύπρος και η ματαιότητα του πολέμου — ανάλυση για τις Παγκύπριες.",
  thumb: LETTER("Ελένη"),
  theory: R`
<div class="tbox rem"><h4>Πριν ξεκινήσεις</h4><p>Το ποίημα δεν αναπαράγεται εδώ (προστατεύεται από πνευματικά δικαιώματα). Μελέτησε την ανάλυση με το κείμενο ανοιχτό στο <b>ΚΝΕΛ Β΄ (σ. 209–213)</b> ή στην <b>ΑΝΠ Γ΄ (σ. 86–88)</b>.</p></div>
<div class="tbox def"><h4>Ταυτότητα του ποιήματος</h4>
<p>Η <b>«Ελένη»</b> του <b>Γιώργου Σεφέρη</b> (1900–1971, Νόμπελ Λογοτεχνίας 1963) ανήκει στη συλλογή <b>«Ημερολόγιο Καταστρώματος Γ΄»</b> (1955), που γράφτηκε μετά το ταξίδι του ποιητή στην <b>Κύπρο</b> (1953). Ο Σεφέρης είναι κορυφαίος εκπρόσωπος της <b>Γενιάς του '30</b> (μοντέρνα ποίηση: ελεύθερος στίχος, σύμβολα, αξιοποίηση του μύθου, υπαινικτικός λόγος).</p></div>
<div class="tbox"><h4>Ο μύθος πίσω από το ποίημα</h4>
<p>Κατά μια παραλλαγή του μύθου, που αξιοποιεί η τραγωδία <b>«Ελένη» του Ευριπίδη</b> (412 π.Χ.), η πραγματική Ελένη δεν πήγε ποτέ στην Τροία· οι θεοί την έστειλαν στην Αίγυπτο, ενώ στην Τροία βρισκόταν μόνο ένα <b>είδωλό</b> της, φτιαγμένο από σύννεφο. Άρα Έλληνες και Τρώες πολέμησαν δέκα χρόνια <b>για ένα τίποτα</b>. Ο <b>Τεύκρος</b>, γιος του Τελαμώνα και αδελφός του Αίαντα, εξορίστηκε μετά τον πόλεμο από τον πατέρα του και, κατά την παράδοση, ίδρυσε τη <b>Σαλαμίνα της Κύπρου</b>. Στον Ευριπίδη ο Τεύκρος περνά από την Αίγυπτο και συναντά την Ελένη.</p></div>
<div class="tbox"><h4>Ποιητικό υποκείμενο — δραματικός μονόλογος</h4>
<p>Μιλά ο <b>Τεύκρος</b>, όχι ο Σεφέρης: το ποίημα είναι <b>δραματικός μονόλογος</b> και ο ήρωας λειτουργεί ως <b>προσωπείο</b> του ποιητή. Μέσα από τη φωνή του ναυαγισμένου, ξεριζωμένου ήρωα που φτάνει στην Κύπρο, εκφράζονται οι εμπειρίες και η <b>αντιπολεμική στάση</b> του Σεφέρη, που έζησε τη Μικρασιατική Καταστροφή, τον Β΄ Παγκόσμιο Πόλεμο και την εξορία της κυβέρνησης στη Μέση Ανατολή.</p></div>
<div class="tbox"><h4>Πορεία του νοήματος (σε συντομία)</h4>
<ol><li><b>Η Κύπρος και τα αηδόνια:</b> ο Τεύκρος, στις Πλάτρες, απευθύνεται στα αηδόνια, που δεν τον αφήνουν να κοιμηθεί· το τραγούδι τους φέρνει τη μνήμη του πολέμου.</li>
<li><b>Η αποκάλυψη:</b> θυμάται τη συνάντηση με την πραγματική Ελένη στην Αίγυπτο και την αλήθεια: στην Τροία πολέμησαν για ένα σύννεφο, για ένα άδειο ένδυμα.</li>
<li><b>Ο απολογισμός:</b> οι νεκροί, ο πόνος, οι χαμένες πατρίδες· ο ήρωας αναρωτιέται τι είναι θεός και τι άνθρωπος, τι αλήθεια και τι ψέμα.</li>
<li><b>Η προειδοποίηση:</b> η ιστορία μπορεί να επαναληφθεί — άλλοι άνθρωποι θα σκοτωθούν ξανά για ψεύτικες αιτίες. Η σκέψη στρέφεται στη σύγχρονη Κύπρο.</li></ol></div>
<div class="tbox"><h4>Σύμβολα και εκφραστικά μέσα</h4>
<table class="tbl nbl"><tr><th>Σύμβολο / μέσο</th><th>Σημασία – λειτουργία</th></tr>
<tr><td>Η Ελένη ως είδωλο, σύννεφο</td><td>η <b>ψευδαίσθηση</b>, η πλάνη, η απατηλή εικόνα που γίνεται αιτία πολέμου</td></tr>
<tr><td>Το άδειο ένδυμα (πουκάμισο)</td><td>η <b>ματαιότητα</b> του πολέμου και των θυσιών για ανύπαρκτες αιτίες</td></tr>
<tr><td>Τα αηδόνια</td><td>η μνήμη, η ποίηση, ο θρήνος, η διαχρονική ανθρώπινη οδύνη</td></tr>
<tr><td>Σαλαμίνα, Κύπρος</td><td>η ιστορική μνήμη, η συνέχεια του ελληνισμού, η προσφυγιά και η αναζήτηση πατρίδας</td></tr>
<tr><td>Μεταφορές (η θάλασσα και η γη σαν σαγόνια που καταπίνουν, οι μυλόπετρες που αλέθουν)</td><td>ο πόλεμος που «καταπίνει» και αλέθει τους ανθρώπους</td></tr>
<tr><td>Επαναλήψεις (η προσφώνηση στο αηδόνι, η επίμονη άρνηση ότι κάτι ήταν αληθινό)</td><td>λυρισμός, έμφαση, δραματική ένταση</td></tr>
<tr><td>Ρητορικά ερωτήματα</td><td>υπαρξιακός προβληματισμός, αμφισβήτηση</td></tr>
<tr><td>Αντιθέσεις (αλήθεια – ψευδαίσθηση, ζωή – θάνατος)</td><td>αναδεικνύουν τη σύγκρουση που διατρέχει το ποίημα</td></tr></table></div>
<div class="tbox thm"><h4>Κεντρικά μηνύματα</h4><p>Ο πόλεμος γίνεται συχνά για <b>«είδωλα»</b> — για ιδέες, συμφέροντα ή ψέματα — και οι άνθρωποι πληρώνουν με τη ζωή τους· η ποίηση κρατά τη <b>μνήμη</b> και καλεί σε <b>επαγρύπνηση</b>. Ο αρχαίος μύθος γίνεται σύγχρονος: η Κύπρος της δεκαετίας του 1950 βρίσκεται μπροστά σε νέες συγκρούσεις.</p></div>
<div class="tbox ex"><h4>Θέμα τύπου Παγκυπρίων</h4>
<p>Να εξηγήσετε τη συμβολική λειτουργία δύο ποιητικών λέξεων/εικόνων του ποιήματος και να τις συνδέσετε με το αντιπολεμικό του μήνυμα. (6 μονάδες)</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary>
<p><b>α) Το είδωλο/το σύννεφο:</b> Η Ελένη για την οποία πολέμησαν στην Τροία ήταν μόνο μια εικόνα από σύννεφο. Το σύμβολο δηλώνει την ψευδαίσθηση και την πλάνη που οδηγούν τους λαούς στον πόλεμο· οι αιτίες των πολέμων αποδεικνύονται συχνά ανύπαρκτες.</p>
<p><b>β) Το άδειο ένδυμα:</b> Οι πολεμιστές θυσιάστηκαν για ένα κενό ρούχο. Η εικόνα δείχνει τη ματαιότητα του πολέμου και το τραγικό κόστος των θυσιών. Έτσι το ποίημα καταγγέλλει τον πόλεμο διαχρονικά.</p>
<p><i>(Στις εξετάσεις τεκμηρίωσε με σύντομη αναφορά στους στίχους του δοσμένου κειμένου.)</i></p></details></div>
<div class="tbox tip"><h4>Σύγκριση με άλλο κείμενο</h4><p>Σύγκρινε με τον «Ονήσιλο» του Μηχανικού (ενότητα 2.7): και τα δύο αξιοποιούν αρχαίο ήρωα που συνδέεται με τη Σαλαμίνα της Κύπρου, για να μιλήσουν για τη σύγχρονη κυπριακή μοίρα.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>«Ο Σεφέρης ταξίδεψε στην Τροία» — όχι· μιλά ο <b>Τεύκρος</b>. Μπερδεύουν το ποίημα με το «Μυθιστόρημα». Γράφουν «σύμβολο» χωρίς να εξηγήσουν τι συμβολίζει και πώς υπηρετεί το νόημα.</p></div>
`,
  widget: "nb2w22",
  gen: "nb2g22",
  exercises: [
    { level: 1, q: R`Ποιο μυθικό πρόσωπο είναι το ποιητικό υποκείμενο της «Ελένης»; (Γράψε το όνομα.)`, fields: [{ label: "Όνομα:", ans: ["Τεύκρος", "ο Τεύκρος"], text: true }],
      hint: R`Είναι ο ιδρυτής της Σαλαμίνας της Κύπρου.`, sol: R`Ο <b>Τεύκρος</b> — δραματικός μονόλογος· ο ήρωας είναι προσωπείο του ποιητή.` },
    { level: 1, q: R`Σε ποιο έτος δημοσιεύτηκε η συλλογή «Ημερολόγιο Καταστρώματος Γ΄»;`, fields: [{ label: "Έτος:", ans: 1955 }],
      hint: R`Λίγο μετά το ταξίδι του Σεφέρη στην Κύπρο (1953).`, sol: R`Το <b>1955</b>.` },
    { level: 1, type: "mc", q: R`Κατά την παραλλαγή του μύθου που αξιοποιεί ο Σεφέρης, πού βρισκόταν η πραγματική Ελένη στη διάρκεια του Τρωικού πολέμου;`, options: ["Στην Αίγυπτο", "Στην Τροία", "Στη Σπάρτη", "Στην Κύπρο"], correct: 0,
      hint: R`Σκέψου την τραγωδία του Ευριπίδη.`, sol: R`Στην <b>Αίγυπτο</b>· στην Τροία υπήρχε μόνο ένα είδωλό της (Ευριπίδης, «Ελένη», 412 π.Χ.).` },
    { level: 2, type: "mc", q: R`Τι συμβολίζει η εικόνα της Ελένης ως σύννεφο/είδωλο;`, options: ["Την ψευδαίσθηση και την πλάνη που οδηγούν στον πόλεμο", "Την ομορφιά της φύσης", "Τη θεϊκή δικαιοσύνη", "Την ειρήνη μετά τον πόλεμο"], correct: 0,
      hint: R`Για τι πολέμησαν τελικά οι Αχαιοί;`, sol: R`Το είδωλο είναι σύμβολο της <b>ψευδαίσθησης</b>: οι πόλεμοι γίνονται συχνά για απατηλές αιτίες.` },
    { level: 2, type: "mc", q: R`Η «Ελένη» είναι δραματικός μονόλογος. Τι σημαίνει αυτό;`, options: ["Μιλά ένα δραματικό πρόσωπο (εδώ ο Τεύκρος) σε συγκεκριμένη περίσταση, σαν σε σκηνή", "Το ποίημα είναι γραμμένο για να παιχτεί στο θέατρο με πολλούς ηθοποιούς", "Ο ποιητής μιλά για τον εαυτό του σε α΄ πρόσωπο", "Το ποίημα έχει μόνο διαλόγους"], correct: 0,
      hint: R`Ποιος «μιλά» και πού βρίσκεται;`, sol: R`Δραματικός μονόλογος: ο λόγος ενός <b>δραματικού προσώπου</b>, σε συγκεκριμένο σκηνικό και περίσταση· στοιχείο θεατρικότητας του ποιήματος.` },
    { level: 2, type: "mc", q: R`Τι συμβολίζουν τα αηδόνια στο ποίημα;`, options: ["Τη μνήμη, την ποίηση και τον θρήνο για τον ανθρώπινο πόνο", "Τη χαρά της άνοιξης", "Τους εχθρούς του Τεύκρου", "Την ελπίδα για πλούτο"], correct: 0,
      hint: R`Στη μυθολογία η Αηδόνα/Φιλομήλα θρηνεί.`, sol: R`Τα αηδόνια φέρνουν τη μνήμη και τον θρήνο — σύμβολα της ποίησης και της διαχρονικής οδύνης.` },
    { level: 2, type: "mc", q: R`Σε ποια γενιά ανήκει ο Σεφέρης;`, options: ["Γενιά του '30", "Πρώτη Μεταπολεμική Γενιά", "Νέα Αθηναϊκή Σχολή", "Γενιά του '70"], correct: 0,
      hint: R`Μοντέρνα ποίηση, ελεύθερος στίχος, μύθος.`, sol: R`<b>Γενιά του '30</b> — μαζί με τον Ελύτη, τον Εμπειρίκο, τον Ρίτσο κ.ά.` },
    { level: 3, type: "mc", q: R`Με ποιο τρόπο το ποίημα συνδέει τον αρχαίο μύθο με τη σύγχρονη πραγματικότητα;`, options: ["Ο Τεύκρος στην Κύπρο γίνεται προσωπείο του ποιητή· η ματαιότητα του Τρωικού πολέμου παραλληλίζεται με τους πολέμους του 20ού αιώνα και την κυπριακή συγκυρία", "Το ποίημα περιγράφει μόνο αρχαία γεγονότα χωρίς σύγχρονη σημασία", "Ο ποιητής αφηγείται τη μάχη της Σαλαμίνας του 480 π.Χ.", "Το ποίημα είναι εγκώμιο του πολέμου"], correct: 0,
      hint: R`Δείκτες 6–7 του Πλαισίου: ιστορικό πλαίσιο, μεταποίηση του μύθου.`, sol: R`Ο μύθος λειτουργεί ως <b>«αντικειμενική συστοιχία»</b>: μέσα από αρχαία πρόσωπα ο ποιητής μιλά για τον πόλεμο, την προσφυγιά και την Κύπρο της εποχής του.` }
  ]
},
/* ───────────────────────────── 2.3 ───────────────────────────── */
{
  id: "2.3", unit: 2, title: "Οδυσσέας Ελύτης, «Άξιον Εστί», Τα Πάθη, Άσμα ι΄ — ανάλυση, σύμβολα, επωδός",
  book: "ΑΝΠ Γ΄, σ. 140–141 · Πλαίσιο Λογοτεχνίας Γ΄ (ΚΚ), Α΄ τετράμηνο, Κείμενο 3",
  intro: "Πώς ο πόνος του πολέμου γίνεται τραγούδι και ελπίδα; Το «Άσμα ι΄» από «Τα Πάθη» του «Άξιον Εστί» του Ελύτη: σύμβολα, επωδός, μηνύματα.",
  thumb: LETTER("Άξιον Εστί"),
  theory: R`
<div class="tbox rem"><h4>Πριν ξεκινήσεις</h4><p>Το ποίημα δεν αναπαράγεται εδώ (πνευματικά δικαιώματα). Μελέτησέ το στην <b>ΑΝΠ Γ΄ (σ. 140–141)</b> και άκουσε τη μελοποίηση του Θεοδωράκη.</p></div>
<div class="tbox def"><h4>Ταυτότητα του έργου</h4>
<p>Το <b>«Άξιον Εστί»</b> (1959, Κρατικό Βραβείο Ποίησης 1960) είναι η μεγάλη ποιητική σύνθεση του <b>Οδυσσέα Ελύτη</b> (1911–1996, Νόμπελ Λογοτεχνίας 1979). Ο τίτλος προέρχεται από ύμνο της Παναγίας και η δομή εμπνέεται από τη <b>βυζαντινή εκκλησιαστική υμνογραφία</b>. Έχει τρία μέρη: <b>«Η Γένεσις»</b> (η γέννηση του ποιητικού «εγώ» και του κόσμου), <b>«Τα Πάθη»</b> (οι δοκιμασίες του ελληνικού λαού στη δεκαετία του '40) και <b>«Το Δοξαστικόν»</b> (ύμνος στον κόσμο και στη ζωή). Στα «Πάθη» εναλλάσσονται <b>ψαλμοί</b> (ελεύθερος στίχος), <b>ωδές/άσματα</b> (έμμετρα, με στροφές και επωδό) και πεζά <b>αναγνώσματα</b>. Το <b>Άσμα ι΄</b> (δέκατο) μελοποιήθηκε από τον <b>Μίκη Θεοδωράκη</b> στο λαϊκό ορατόριο του 1964 (ερμηνεία: Γρηγόρης Μπιθικώτσης).</p></div>
<div class="tbox"><h4>Πλαίσιο και περιεχόμενο</h4>
<p>Το ιστορικό υπόβαθρο είναι ο <b>πόλεμος του 1940</b>, η <b>Κατοχή</b>, η <b>Εθνική Αντίσταση</b>, ο Β΄ Παγκόσμιος Πόλεμος. Στο Άσμα ι΄ το ποιητικό υποκείμενο μιλά για την αγάπη και τον πόνο που σημάδεψαν τη ζωή του, για τις δοκιμασίες που πέρασε και για το πώς, μέσα σε ένα σκληρό, πετρώδες τοπίο, κατάφερε να ζωντανέψει και να δημιουργήσει — δηλαδή πώς από τη δοκιμασία γεννήθηκε δημιουργία. Σε κάθε στροφή επανέρχεται, σαν προσευχή, η <b>επωδός</b>: μια προσφώνηση σε μια μακρινή μητέρα και σε ένα ρόδο που δεν μαραίνεται.</p></div>
<div class="tbox"><h4>Ποιητικό υποκείμενο</h4>
<p>Το ποιητικό υποκείμενο <b>δεν ταυτίζεται με τον βιογραφικό Ελύτη</b>. Μέσα από μια προσωπική εξομολόγηση εκφράζει <b>συλλογικές εμπειρίες</b>, βιώματα και αξίες του ελληνικού λαού: το «εγώ» του ποιήματος είναι ταυτόχρονα και «εμείς».</p></div>
<div class="tbox"><h4>Σύμβολα</h4>
<table class="tbl nbl"><tr><th>Σύμβολο</th><th>Σημασία</th></tr>
<tr><td>τα αίματα</td><td>οι θυσίες και οι αγώνες του ελληνικού λαού</td></tr>
<tr><td>το πέλαγος</td><td>η ελληνική μοίρα, η δοκιμασία, η ελευθερία</td></tr>
<tr><td>η Μακρινή Μητέρα</td><td>η πατρίδα, η Παναγία ή η ιδεατή μητρική προστασία</td></tr>
<tr><td>το Ρόδο το Αμάραντο</td><td>η αθανασία, η ιδανική αγάπη, η πνευματική ομορφιά, η αιώνια ζωή</td></tr>
<tr><td>η πέτρα</td><td>οι δυσκολίες, η αντοχή, η ελληνική γη</td></tr>
<tr><td>το φως</td><td>η ελπίδα, η δικαιοσύνη, η πνευματική λύτρωση</td></tr>
</table><p class="small muted">Το Πλαίσιο αναφέρει και τη <b>νοτιά</b> ανάμεσα στα ποιητικά σύμβολα χωρίς να δίνει σημασία· μια πιθανή ερμηνεία (δική μας): η υγρασία που διαβρώνει — η φθορά που φέρνουν ο χρόνος και η δοκιμασία. Στις εξετάσεις τεκμηρίωνε κάθε ερμηνεία με το κείμενο.</p></div>
<div class="tbox"><h4>Εκφραστικά μέσα</h4>
<ul><li><b>Επωδός</b> (το επαναλαμβανόμενο δίστιχο προσφώνησης): λυρικό και μουσικό μοτίβο· δίνει <b>ενότητα</b> στη σύνθεση και ενισχύει τη <b>συγκινησιακή ένταση</b>.</li>
<li><b>Μεταφορές</b>: η πορεία από τη δοκιμασία στη λύτρωση (η ζωή που φυτρώνει μέσα στη σκληρή γη).</li>
<li><b>Αντιθέσεις</b> αίμα – φως, πέτρα – άνθισμα: η <b>μεταμόρφωση του πόνου σε δημιουργία</b>.</li>
<li><b>Εικόνες</b> της ελληνικής φύσης (θάλασσα, ήλιος, άνεμος): παραστατικότητα και λυρική ατμόσφαιρα.</li>
<li><b>Επαναλήψεις</b>: μουσικότητα, ρυθμός, μοτίβο.</li></ul></div>
<div class="tbox thm"><h4>Μηνύματα</h4><p>Η <b>δύναμη της αντίστασης</b>, της αξιοπρέπειας και της ελπίδας· η πίστη ότι από τα πάθη μπορεί να γεννηθεί αναγέννηση· η σύνδεση <b>ιστορίας, ορθόδοξης παράδοσης και ελληνικής φύσης</b> σε μια σύγχρονη ποιητική έκφραση — γνώρισμα της Γενιάς του '30 (με επιδράσεις από τον υπερρεαλισμό).</p></div>
<div class="tbox ex"><h4>Θέμα τύπου Παγκυπρίων</h4>
<p>Να εξηγήσετε τη λειτουργία της επωδού στο ποίημα και να ερμηνεύσετε τα δύο σύμβολα που περιέχει. (5 μονάδες)</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary>
<p><b>Λειτουργία:</b> Η επωδός επαναλαμβάνεται σε κάθε στροφή σαν ρεφρέν προσευχής· προσδίδει μουσικότητα και ρυθμό, δένει τις στροφές σε ενιαίο σύνολο και εντείνει τη συγκίνηση.</p>
<p><b>Σύμβολα:</b> Η Μακρινή Μητέρα μπορεί να είναι η πατρίδα ή η Παναγία — μια προστατευτική μητρική παρουσία που το υποκείμενο επικαλείται στη δοκιμασία. Το Αμάραντο Ρόδο είναι το λουλούδι που δεν μαραίνεται: η αθανασία, η ιδανική αγάπη, η πνευματική ομορφιά που επιβιώνει από τον πόνο.</p></details></div>
<div class="tbox tip"><h4>Σύγκριση με άλλο κείμενο</h4><p>Με τον «Αποχαιρετισμό» του Ρίτσου (2.4): και στα δύο το φως και η φύση συμβολίζουν τη νίκη του ανθρώπου πάνω στον θάνατο και στη σκλαβιά.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Μπερδεύουν τα τρία μέρη του «Άξιον Εστί» με τα είδη κειμένων (ψαλμοί, ωδές, αναγνώσματα). Ερμηνεύουν τα σύμβολα μονοσήμαντα — ενώ το Πλαίσιο δέχεται πολλαπλές σημασίες (π.χ. η Μητέρα = πατρίδα ή Παναγία).</p></div>
`,
  widget: "nb2w23",
  gen: "nb2g23",
  exercises: [
    { level: 1, q: R`Σε ποιο έτος δημοσιεύτηκε το «Άξιον Εστί»;`, fields: [{ label: "Έτος:", ans: 1959 }],
      hint: R`Η σύνθεση γράφτηκε τη δεκαετία του 1950 και βραβεύτηκε αμέσως μετά την έκδοσή της.`, sol: R`Το <b>1959</b>.` },
    { level: 1, type: "mc", q: R`Ποια είναι τα τρία μέρη του «Άξιον Εστί»;`, options: ["Η Γένεσις – Τα Πάθη – Το Δοξαστικόν", "Ψαλμοί – Ωδές – Αναγνώσματα", "Πρόλογος – Πάθη – Επίλογος", "Γένεση – Έξοδος – Αποκάλυψη"], correct: 0,
      hint: R`Το «Άσμα ι΄» βρίσκεται στο μεσαίο μέρος.`, sol: R`<b>Η Γένεσις, Τα Πάθη, Το Δοξαστικόν.</b> Οι ψαλμοί, οι ωδές και τα αναγνώσματα είναι είδη κειμένων μέσα στα «Πάθη».` },
    { level: 1, q: R`Ποιος συνθέτης μελοποίησε το «Άξιον Εστί»; (Γράψε το επώνυμο.)`, fields: [{ label: "Επώνυμο:", ans: ["Θεοδωράκης", "Μίκης Θεοδωράκης", "ο Θεοδωράκης", "ο Μίκης Θεοδωράκης", "Θεοδωράκης Μίκης"], text: true }],
      hint: R`Λαϊκό ορατόριο, 1964.`, sol: R`Ο <b>Μίκης Θεοδωράκης</b> (1964), με ερμηνευτή τον Γρηγόρη Μπιθικώτση.` },
    { level: 2, type: "mc", q: R`Τι είναι η επωδός και ποια η κύρια λειτουργία της στο Άσμα ι΄;`, options: ["Στίχοι που επανέρχονται σε κάθε στροφή· δίνουν μουσικότητα, ενότητα και συγκινησιακή ένταση", "Ο τίτλος του ποιήματος· δηλώνει το θέμα", "Ο πρώτος στίχος· εισάγει τον αναγνώστη", "Μια υποσημείωση του ποιητή"], correct: 0,
      hint: R`Σκέψου το ρεφρέν ενός τραγουδιού.`, sol: R`Η <b>επωδός</b> επαναλαμβάνεται σαν ρεφρέν: μουσικότητα, ρυθμός, ενότητα της σύνθεσης, συγκίνηση.` },
    { level: 2, type: "mc", q: R`Τι συμβολίζει η πέτρα στο ποίημα, κατά το Πλαίσιο;`, options: ["Τις δυσκολίες, την αντοχή και την ελληνική γη", "Τον πλούτο", "Τη σκληρότητα του εχθρού μόνο", "Την αρχαία γλυπτική"], correct: 0,
      hint: R`Σκέψου πού και πώς «φυτρώνει» η ζωή στο ποίημα.`, sol: R`Η πέτρα δηλώνει τη δοκιμασία και την αντοχή — και την ελληνική γη· μέσα της ανθίζει η ζωή.` },
    { level: 2, type: "mc", q: R`Ποιο ιστορικό πλαίσιο αποτυπώνουν «Τα Πάθη»;`, options: ["Τον πόλεμο του '40, την Κατοχή και την Αντίσταση", "Την Επανάσταση του 1821", "Τον Τρωικό πόλεμο", "Την εισβολή του 1974"], correct: 0,
      hint: R`Δεκαετία του 1940.`, sol: R`Τις δοκιμασίες του ελληνικού λαού στη δεκαετία του 1940: πόλεμος, Κατοχή, Αντίσταση.` },
    { level: 2, type: "mc", q: R`Η αντίθεση αίματος και φωτός στο ποίημα δείχνει:`, options: ["Τη μεταμόρφωση του πόνου σε δημιουργία και ελπίδα", "Τη διαφορά μέρας και νύχτας", "Ότι ο ποιητής φοβάται το σκοτάδι", "Τη νίκη του εχθρού"], correct: 0,
      hint: R`Πού καταλήγει η πορεία του υποκειμένου;`, sol: R`Από τη θυσία (αίμα) στη λύτρωση (φως): η δοκιμασία γίνεται πηγή αναγέννησης.` },
    { level: 3, type: "mc", q: R`Ποια πρόταση περιγράφει σωστά τη σχέση «εγώ» – «εμείς» στο ποίημα;`, options: ["Μέσα από προσωπική εξομολόγηση, το ποιητικό υποκείμενο εκφράζει συλλογικές εμπειρίες και αξίες του ελληνικού λαού", "Το ποίημα μιλά αποκλειστικά για την ερωτική ζωή του Ελύτη", "Το υποκείμενο είναι ένας ξένος παρατηρητής", "Δεν υπάρχει ποιητικό υποκείμενο"], correct: 0,
      hint: R`Δείκτης 2 του Πλαισίου.`, sol: R`Το «εγώ» είναι ταυτόχρονα «εμείς»: το προσωπικό βίωμα αποκτά συλλογική, εθνική και οικουμενική διάσταση.` }
  ]
},
/* ───────────────────────────── 2.4 ───────────────────────────── */
{
  id: "2.4", unit: 2, title: "Γιάννης Ρίτσος, «Αποχαιρετισμός» — ανάλυση: Γρηγόρης Αυξεντίου, χρέος, λευτεριά",
  book: "ΑΝΠ Γ΄, σ. 205–207 (απόσπασμα) · Πλαίσιο Λογοτεχνίας Γ΄ (ΚΚ), Α΄ τετράμηνο, Κείμενο 4 · Παγκύπριες 2026, Β2",
  intro: "Τι οφείλει κάθε άνθρωπος στην ελευθερία των άλλων; Ο «Αποχαιρετισμός» του Ρίτσου για τον Γρηγόρη Αυξεντίου — ανάλυση και θέμα Παγκυπρίων 2026.",
  thumb: LETTER("Ρίτσος"),
  theory: R`
<div class="tbox rem"><h4>Πριν ξεκινήσεις</h4><p>Το ποίημα δεν αναπαράγεται εδώ (πνευματικά δικαιώματα). Μελέτησε το απόσπασμα της ύλης στην <b>ΑΝΠ Γ΄ (σ. 205–207)</b>.</p></div>
<div class="tbox def"><h4>Ταυτότητα του ποιήματος</h4>
<p>Ο <b>«Αποχαιρετισμός»</b> γράφτηκε από τον <b>Γιάννη Ρίτσο</b> (Μονεμβασιά 1909 – Αθήνα 1990) το <b>1957</b>, για τον <b>Γρηγόρη Αυξεντίου</b> (1928–1957), υπαρχηγό της ΕΟΚΑ, που σκοτώθηκε στις <b>3 Μαρτίου 1957</b> στο κρησφύγετό του κοντά στη <b>Μονή Μαχαιρά</b>, όταν οι Βρετανοί, μετά από πολύωρη μάχη, έβαλαν φωτιά στη σπηλιά. Πλαίσιο: ο <b>Αγώνας της ΕΟΚΑ (1955–1959)</b> κατά της βρετανικής αποικιοκρατίας.</p></div>
<div class="tbox"><h4>Μορφή: δραματικός μονόλογος</h4>
<p>Μιλά ο ίδιος ο <b>Αυξεντίου</b>, σαν <b>δραματικό πρόσωπο</b>, λίγο πριν από τον θάνατό του: αποχαιρετά τους ανθρώπους, θυμάται στιγμές της ζωής του, εξηγεί γιατί αγωνίστηκε. Στοιχεία <b>θεατρικότητας</b>: δραματικό πρόσωπο, σκηνικό (η σπηλιά), δραματική περίσταση, μικροί διάλογοι μέσα στις αναμνήσεις, έμμεσες σκηνικές οδηγίες (παρενθέσεις). Ο στίχος είναι <b>ελεύθερος</b>, μακρύς, με τόνο προφορικότητας και τρυφερότητας.</p></div>
<div class="tbox"><h4>Πορεία του νοήματος (απόσπασμα της ύλης)</h4>
<ol><li>Ο ήρωας ξέρει ότι το τέλος πλησιάζει και αποχαιρετά, όμως αισθάνεται ότι δεν έχει ακόμη τελειώσει την προσφορά του στους ανθρώπους.</li>
<li><b>Ανάμνηση:</b> μια συνάντηση με μια ηλικιωμένη γυναίκα του χωριού, που τον ξεδίψασε και του ευχήθηκε ελευθερία· τότε κατάλαβε ότι η ελευθερία είναι κάτι που <b>οφείλει</b> στους απλούς ανθρώπους.</li>
<li><b>Στοχασμός:</b> η ελευθερία είναι <b>χρέος του καθενός προς όλους</b>· αν αφορά μόνο το άτομο, χάνει το νόημά της.</li>
<li><b>Κατάληξη:</b> στο κρησφύγετο, η είσοδος της σπηλιάς ταυτίζεται με τον ήλιο, που γίνεται ένα πολύτιμο χρυσό νόμισμα δροσιάς για το καμένο σώμα του — ο θάνατος μεταμορφώνεται σε φως και αθανασία.</li></ol></div>
<div class="tbox"><h4>Σύμβολα και εκφραστικά μέσα</h4>
<table class="tbl nbl"><tr><th>Στοιχείο</th><th>Σημασία – λειτουργία</th></tr>
<tr><td>λευτεριά</td><td>εθνική και οικουμενική ελευθερία (ατομική → εθνική → οικουμενική)</td></tr>
<tr><td>φεγγάρι, ήλιος</td><td>ελπίδα, πνευματική ολοκλήρωση, αιώνια ζωή</td></tr>
<tr><td>χρυσό κωνσταντινάτο (νόμισμα)</td><td>τιμή, θυσία, αθανασία του αγωνιστή</td></tr>
<tr><td>βουνό, σπηλιά</td><td>ο αγώνας, η αντίσταση, ο τόπος της θυσίας</td></tr>
<tr><td>κόσμος</td><td>η οικουμενική διάσταση της ελευθερίας</td></tr>
<tr><td>καρδιά, κόρφος</td><td>η ανθρώπινη ευαισθησία, η συλλογική συνείδηση</td></tr>
<tr><td>Επαναλήψεις (η ευχή για λευτεριά)</td><td>έμφαση, ρυθμός, σταδιακή διαμόρφωση της σκέψης του ήρωα</td></tr>
<tr><td>Αντιθέσεις σκλαβιά – λευτεριά, θάνατος – αθανασία</td><td>η νίκη των ιδανικών απέναντι στον θάνατο</td></tr>
<tr><td>Μεταφορά (ο ήλιος που δροσίζει το καμένο στήθος)</td><td>η θυσία γίνεται λύτρωση και ανάταση</td></tr></table></div>
<div class="tbox thm"><h4>Ποίηση του «εμείς»</h4><p>Το προσωπικό βίωμα του ήρωα (το «εγώ») μετασχηματίζεται σε <b>συλλογικό όραμα</b>: η ελευθερία ή είναι για όλους ή δεν υπάρχει. Οι αξίες που προβάλλονται: ελευθερία, δημοκρατία, αξιοπρέπεια, αυτοθυσία, αλληλεγγύη, δικαιοσύνη.</p></div>
<div class="tbox ex"><h4>Παγκύπριες 2026 — Β2 (σύγκριση με αδίδακτο)</h4>
<p>Στις εξετάσεις του 2026 ένα απόσπασμα του «Αποχαιρετισμού» συγκρίθηκε με αδίδακτο ποίημα της Κλαίρης Αγγελίδου για τον Αυξεντίου. Ζητήθηκαν: (α) δύο σημεία από <b>κάθε</b> ποίημα όπου φαίνεται η <b>συνείδηση του χρέους</b> του ήρωα προς την πατρίδα, με τεκμηρίωση (6 μον.)· (β) πώς <b>μεταμορφώνεται η σπηλιά</b> σε κάθε ποίημα και το <b>κοινό σχήμα λόγου</b> (4 μον.).</p>
<details class="steps"><summary>Ενδεικτική απάντηση (με βάση τον οδηγό διόρθωσης, σε δική μας διατύπωση)</summary>
<p><b>(α) Ρίτσος:</b> ο ήρωας, αν και ξέρει ότι θα πεθάνει, νιώθει ότι έχει να προσφέρει κι άλλο στους ανθρώπους· η ευχή της γριάς τού γεννά το αίσθημα ότι της χρωστά τη λευτεριά· δηλώνει ότι η λευτεριά είναι χρέος όλων προς όλους. <i>(Τεκμηρίωση με παράθεση στίχων του δοσμένου αποσπάσματος.)</i> Για το αδίδακτο: αντίστοιχα δύο σημεία με τεκμηρίωση.</p>
<p><b>(β)</b> Στον Ρίτσο η σπηλιά, από σκοτεινός χώρος θανάτου, γίνεται φωτεινή: το στόμιό της ταυτίζεται με τον ήλιο — το φως της ελευθερίας και της δικαίωσης. Στο αδίδακτο η σπηλιά γεμίζει λουλούδια. Κοινό σχήμα λόγου: <b>μεταφορά</b>.</p></details></div>
<div class="tbox tip"><h4>Σύγκριση με άλλα κείμενα</h4><p>Το Πλαίσιο προτείνει συνανάγνωση με «Ο Ύπνος των Γενναίων» του Ελύτη και το «Ολοκαύτωμα στον Όλυμπο» του Τεύκρου Ανθία· μέσα στην ύλη, με τον «Πορτοκαλόκηπο» (3.3): δύο διαφορετικές θυσίες του αγώνα της ΕΟΚΑ.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Ταυτίζουν το ποιητικό υποκείμενο με τον Ρίτσο (μιλά ο <b>Αυξεντίου</b>). Σε σύγκριση, απαντούν μόνο για το ένα ποίημα ή δίνουν άνισο αριθμό σημείων. Ονομάζουν τη «μεταμόρφωση» χωρίς να εξηγήσουν από τι σε τι μεταμορφώνεται η σπηλιά.</p></div>
`,
  widget: "nb2w24",
  gen: "nb2g24",
  exercises: [
    { level: 1, q: R`Σε ποιον αγωνιστή της ΕΟΚΑ αναφέρεται ο «Αποχαιρετισμός»; (Ονοματεπώνυμο.)`, fields: [{ label: "Αγωνιστής:", ans: ["Γρηγόρης Αυξεντίου", "Αυξεντίου", "Γρηγόριος Αυξεντίου", "ο Γρηγόρης Αυξεντίου", "Αυξεντίου Γρηγόρης", "ο Αυξεντίου"], text: true }],
      hint: R`Υπαρχηγός της ΕΟΚΑ, σκοτώθηκε κοντά στη Μονή Μαχαιρά.`, sol: R`Ο <b>Γρηγόρης Αυξεντίου</b> (1928–1957).` },
    { level: 1, q: R`Σε ποιο έτος σκοτώθηκε ο ήρωας του ποιήματος (και γράφτηκε το ποίημα);`, fields: [{ label: "Έτος:", ans: 1957 }],
      hint: R`3 Μαρτίου…`, sol: R`Το <b>1957</b> (3 Μαρτίου).` },
    { level: 1, type: "mc", q: R`Ποια μορφή έχει το ποίημα;`, options: ["Δραματικός μονόλογος του ήρωα", "Διάλογος ανάμεσα σε δύο αγωνιστές", "Σονέτο σε ιαμβικό ενδεκασύλλαβο", "Ελεγείο της μητέρας του ήρωα"], correct: 0,
      hint: R`Ποιος μιλά;`, sol: R`<b>Δραματικός μονόλογος:</b> μιλά ο ίδιος ο Αυξεντίου, σαν δραματικό πρόσωπο, στη σπηλιά.` },
    { level: 2, type: "mc", q: R`Ποια ιδέα για την ελευθερία διατυπώνει ο ήρωας;`, options: ["Είναι χρέος του καθενός προς όλους· αν αφορά μόνο το άτομο, χάνει το νόημά της", "Είναι προσωπικό κατόρθωμα κάθε ήρωα", "Δεν αξίζει να θυσιάζεται κανείς γι' αυτήν", "Αφορά μόνο την Κύπρο και κανέναν άλλο λαό"], correct: 0,
      hint: R`Ποίηση του «εμείς».`, sol: R`Η ελευθερία έχει <b>συλλογικό και οικουμενικό</b> χαρακτήρα — ατομική → εθνική → οικουμενική.` },
    { level: 2, type: "mc", q: R`Ποια είναι η λειτουργία της ανάμνησης με την ηλικιωμένη γυναίκα που του προσφέρει νερό;`, options: ["Γεννά στον ήρωα τη συνείδηση του χρέους απέναντι στον απλό λαό", "Δείχνει ότι ο ήρωας ήταν διψασμένος και κουρασμένος από τον αγώνα", "Εισάγει χιουμοριστικό τόνο", "Περιγράφει τη γιαγιά του ήρωα"], correct: 0,
      hint: R`Τι νιώθει ο ήρωας μετά την ευχή της;`, sol: R`Η ευχή της για λευτεριά τον κάνει να νιώσει ότι της τη χρωστά: το χρέος του είναι προς τους ανθρώπους.` },
    { level: 2, type: "mc", q: R`Στο τέλος του αποσπάσματος η σπηλιά μεταμορφώνεται. Πώς;`, options: ["Από σκοτεινός χώρος θανάτου γίνεται φως — το στόμιό της ταυτίζεται με τον ήλιο", "Γίνεται φυλακή", "Γίνεται εκκλησία με καμπάνες", "Γίνεται θάλασσα"], correct: 0,
      hint: R`Παγκύπριες 2026, Β2(β).`, sol: R`Η σπηλιά γίνεται φωτεινή· ο ήλιος συμβολίζει την ελευθερία, τη δικαίωση και την αθανασία — <b>μεταφορά</b>.` },
    { level: 2, type: "mc", q: R`Τι συμβολίζει το χρυσό κωνσταντινάτο (νόμισμα) με το οποίο ταυτίζεται ο ήλιος;`, options: ["Την τιμή, τη θυσία και την αθανασία του αγωνιστή", "Τον πλούτο της οικογένειάς του", "Την αμοιβή των Βρετανών", "Την εμπορική ζωή της Κύπρου"], correct: 0,
      hint: R`Πλαίσιο, δείκτης 3.`, sol: R`Το πολύτιμο νόμισμα δηλώνει την <b>αξία της θυσίας</b> και την αθανασία που κερδίζει ο ήρωας.` },
    { level: 3, type: "mc", q: R`Ποιο ιστορικό πλαίσιο πρέπει να αναφέρεις σε ερώτηση για τον «Αποχαιρετισμό»;`, options: ["Ο Αγώνας της ΕΟΚΑ 1955–1959 κατά της βρετανικής αποικιοκρατίας και η θυσία του Αυξεντίου (1957)", "Η Κατοχή στην Ελλάδα", "Η τουρκική εισβολή του 1974", "Η Μικρασιατική Καταστροφή"], correct: 0,
      hint: R`Δείκτης 6 του Πλαισίου.`, sol: R`Ο <b>Αγώνας της ΕΟΚΑ</b> και η αποικιοκρατία· η μορφή του Αυξεντίου ως σύμβολο της κυπριακής ιστορικής μνήμης.` },
    { level: 3, type: "mc", q: R`<b>Σύγκριση με αδίδακτο (τύπου Β2).</b> Διάβασε το πρωτότυπο ποίημα εξάσκησης και επίλεξε την πιο τεκμηριωμένη σύγκριση με τον «Αποχαιρετισμό».${PASSAGE(`Στο ύψωμα έμεινε μόνος ο φρουρός.
Οι σύντροφοι κατέβηκαν στον κάμπο, στα σπίτια.
Εκείνος μετρά τ' άστρα σαν φυσίγγια
κι ό,τι του μένει το μοιράζει στη νύχτα.
Το πρωί το βουνό θα τον θυμάται
σαν πρώτο φως πάνω απ' τα πεύκα.`, { title: "«Ο φρουρός» (πρωτότυπο κείμενο εξάσκησης)", num: "line" })}`,
      options: ["Και στα δύο ο αγωνιστής προσφέρει ως το τέλος για τους άλλους και ο θάνατός του μεταμορφώνεται σε φως (μεταφορά): στον Ρίτσο ο ήλιος της σπηλιάς, στο αδίδακτο το πρώτο φως πάνω από το βουνό", "Και τα δύο είναι σατιρικά ποιήματα για την εξουσία", "Το αδίδακτο είναι δραματικός μονόλογος σε α΄ πρόσωπο, όπως ο «Αποχαιρετισμός»", "Στο αδίδακτο ο ήρωας εγκαταλείπει τον αγώνα, ενώ στον Ρίτσο τον συνεχίζει — άρα δεν υπάρχει καμία ομοιότητα"], correct: 0,
      hint: R`Βρες κοινό θέμα (χρέος, θυσία) και κοινό εκφραστικό μέσο· πρόσεξε όμως το γραμματικό πρόσωπο του αδίδακτου.`, sol: R`Κοινό θέμα: η αυτοθυσία για τους άλλους (στ. 4 του αδίδακτου). Κοινό μέσο: η <b>μεταφορά</b> του θανάτου σε φως (στ. 5–6 ↔ η σπηλιά-ήλιος του Ρίτσου). Διαφορά: το αδίδακτο είναι σε γ΄ πρόσωπο (αφηγητής), ο «Αποχαιρετισμός» δραματικός μονόλογος. Σε γραπτή απάντηση: σημείο + τεκμηρίωση για ΚΑΘΕ κείμενο.` }
  ]
},
/* ───────────────────────────── 2.5 ───────────────────────────── */
{
  id: "2.5", unit: 2, title: "Μανόλης Αναγνωστάκης, «Θεσσαλονίκη, Μέρες του 1969 μ.Χ.» — ανάλυση, ειρωνεία, δικτατορία",
  book: "ΚΝΕΛ Γ΄, σ. 54–55 · Πλαίσιο Λογοτεχνίας Γ΄ (ΚΚ), Β΄ τετράμηνο, Κείμενο 7",
  intro: "Πώς γράφεις πολιτική ποίηση όταν υπάρχει λογοκρισία; Το «Θεσσαλονίκη, Μέρες του 1969 μ.Χ.» του Αναγνωστάκη: ειρωνεία, διάψευση, δικτατορία.",
  thumb: LETTER("1969 μ.Χ."),
  theory: R`
<div class="tbox rem"><h4>Πριν ξεκινήσεις</h4><p>Το ποίημα δεν αναπαράγεται εδώ (πνευματικά δικαιώματα). Μελέτησέ το στο <b>ΚΝΕΛ Γ΄ (σ. 54–55)</b>.</p></div>
<div class="tbox def"><h4>Ταυτότητα του ποιήματος</h4>
<p>Ο <b>Μανόλης Αναγνωστάκης</b> (Θεσσαλονίκη 1925 – Αθήνα 2005) είναι από τους κύριους ποιητές της <b>Πρώτης Μεταπολεμικής Γενιάς</b>. Το ποίημα ανήκει στη συλλογή <b>«Ο Στόχος»</b>, που πρωτοδημοσιεύτηκε το <b>1970</b> στον συλλογικό τόμο <b>«Δεκαοχτώ κείμενα»</b> — μια πράξη αντίστασης των λογοτεχνών στη λογοκρισία της <b>δικτατορίας των Συνταγματαρχών (1967–1974)</b>.</p></div>
<div class="tbox"><h4>Γνωρίσματα της Πρώτης Μεταπολεμικής Γενιάς στο ποίημα</h4>
<ul><li><b>Πολιτικός και κοινωνικός προβληματισμός</b> — η ποίηση σχολιάζει την ιστορία.</li>
<li><b>Λιτός, πεζολογικός λόγος</b>, χωρίς στολίδια· καθημερινές λέξεις, ονόματα δρόμων και καταστημάτων.</li>
<li><b>Ειρωνεία</b> και πικρία· <b>διάψευση</b> των συλλογικών οραμάτων της Αντίστασης και των μεταπολεμικών χρόνων.</li>
<li><b>Κριτική στάση απέναντι στην εξουσία</b>.</li></ul></div>
<div class="tbox"><h4>Περιεχόμενο σε συντομία</h4>
<p>Το ποιητικό υποκείμενο περιδιαβαίνει έναν δρόμο της Θεσσαλονίκης το 1969. Εκεί όπου κάποτε υπήρχε ένας κόσμος δεμένος με τη μνήμη, τη νιότη και τα όνειρα, τώρα υψώνονται μια <b>τράπεζα</b>, <b>τουριστικά γραφεία</b> και <b>πρακτορεία μετανάστευσης</b>. Τα παιδιά δεν έχουν πια χώρο να παίξουν· η νέα γενιά μεγαλώνει μέσα στη σιωπή και στον φόβο. Ο επίσημος λόγος της δικτατορίας — τα πομπώδη πατριωτικά συνθήματα της χούντας για την «ελληνικότητα» — παρατίθεται έτσι ώστε να φανεί η κενότητά του. Επαναλαμβανόμενα, σχεδόν σχολικά σχήματα λόγου (σαν κλίσεις ρημάτων ή ασκήσεις γραμματικής) κάνουν την ειρωνεία ακόμη πιο πικρή. Η εικόνα μιας <b>αλυσίδας</b> δηλώνει ότι η διάψευση περνά από γενιά σε γενιά.</p></div>
<div class="tbox"><h4>Ο τίτλος και η διακειμενικότητα</h4>
<p>Ο τίτλος, με την πόλη, τη χρονολογία και την ένδειξη <b>«μ.Χ.»</b>, θυμίζει τα <b>ιστορικά ποιήματα του Καβάφη</b> (π.χ. ποιήματα με τίτλους «Μέρες του…» ή με χρονολογίες). Η διακειμενική αναφορά κάνει το σύγχρονο παρόν να μοιάζει με κεφάλαιο μιας <b>ιστορίας παρακμής</b>, σαν να το βλέπουμε από απόσταση αιώνων — και ταυτόχρονα ξεγελά τη λογοκρισία, αφού η κριτική γίνεται έμμεσα.</p></div>
<div class="tbox"><h4>Σύμβολα και σημασιοδοτήσεις</h4>
<table class="tbl nbl"><tr><th>Στοιχείο</th><th>Σημασία</th></tr>
<tr><td>Τράπεζα Συναλλαγών</td><td>η κυριαρχία της οικονομικής λογικής· οι ανθρώπινες αξίες υποτάσσονται στη συναλλαγή</td></tr>
<tr><td>τουριστικά γραφεία</td><td>η χώρα γίνεται χώρος εκμετάλλευσης και κατανάλωσης</td></tr>
<tr><td>πρακτορεία μεταναστεύσεως</td><td>ο οικονομικός και κοινωνικός εξαναγκασμός στη μετανάστευση</td></tr>
<tr><td>τα παιδιά</td><td>οι διαδοχικές γενιές που κληρονομούν τις ίδιες διαψεύσεις</td></tr>
<tr><td>η αλυσίδα</td><td>η συνεχής αναπαραγωγή της ιστορικής και κοινωνικής ματαίωσης</td></tr>
<tr><td>το σύνθημα της χούντας για την ελληνικότητα</td><td>ειρωνική αναφορά στο ιδεολόγημα της δικτατορίας</td></tr></table></div>
<div class="tbox"><h4>Εκφραστικά μέσα</h4>
<ul><li><b>Ειρωνεία</b>: αποδομεί τον επίσημο δημόσιο λόγο· αποκαλύπτει την αντίθεση ανάμεσα στην προβαλλόμενη εικόνα και στην πραγματικότητα της δικτατορίας.</li>
<li><b>Επαναλήψεις</b>: έμφαση και διαχρονικότητα της διάψευσης.</li>
<li><b>Αντιθέσεις</b> παρελθόν – παρόν, ελπίδα – ματαίωση.</li>
<li><b>Μεταφορές</b>: συμπυκνώνουν βιώματα.</li>
<li><b>Διακειμενικές αναφορές</b> (Καβάφης, συνθήματα): ενισχύουν την ειρωνεία και την πολιτική κριτική.</li></ul></div>
<div class="tbox thm"><h4>Μηνύματα</h4><p>Η κριτική του αυταρχισμού, της λογοκρισίας και της <b>αλλοτρίωσης</b> μιας κοινωνίας που ζει με τους κανόνες της αγοράς και του φόβου· η σημασία της <b>ιστορικής μνήμης</b> και της <b>δημοκρατικής εγρήγορσης</b>.</p></div>
<div class="tbox ex"><h4>Θέμα τύπου Παγκυπρίων</h4>
<p>Να εξηγήσετε πώς λειτουργεί η ειρωνεία στο ποίημα, αξιοποιώντας δύο σημεία του. (6 μονάδες)</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary>
<p><b>1ο σημείο:</b> Η παράθεση των νέων κτηρίων (τράπεζα, τουριστικά γραφεία, πρακτορεία μετανάστευσης) με ουδέτερο, σχεδόν διαφημιστικό τόνο παρουσιάζει ως «πρόοδο» αυτό που στην πραγματικότητα είναι αλλοτρίωση: οι άνθρωποι φεύγουν μετανάστες, ενώ η χώρα πουλιέται στους τουρίστες.</p>
<p><b>2ο σημείο:</b> Η αναφορά στο σύνθημα της χούντας για την ελληνικότητα δείχνει την απόσταση ανάμεσα στην πομπώδη πατριωτική ρητορική και στην πραγματικότητα της καταπίεσης. Η ειρωνεία ανατρέπει το έκδηλο νόημα: ό,τι προβάλλεται ως εθνικό μεγαλείο είναι στην ουσία παρακμή. <i>(Τεκμηρίωσε με στίχους του δοσμένου κειμένου.)</i></p></details></div>
<div class="tbox tip"><h4>Σύγκριση με άλλο κείμενο</h4><p>Με τους «Αλεξανδρινούς Βασιλείς» του Καβάφη (2.1): και τα δύο ποιήματα χρησιμοποιούν την ειρωνεία για να αποκαλύψουν την κενότητα του επίσημου, «θεατρικού» λόγου της εξουσίας.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Τοποθετούν το ποίημα στην Κατοχή. Γράφουν ότι ο ποιητής «επαινεί την ανάπτυξη» της πόλης — δεν διακρίνουν την ειρωνεία. Δεν εξηγούν τη λειτουργία του τίτλου (διακειμενικότητα με τον Καβάφη).</p></div>
`,
  widget: "nb2w25",
  gen: "nb2g25",
  exercises: [
    { shuffle: true, level: 1, type: "mc", q: R`Σε ποια λογοτεχνική γενιά ανήκει ο Μανόλης Αναγνωστάκης;`, options: ["Πρώτη Μεταπολεμική Γενιά", "Γενιά του '30", "Γενιά του '70", "Νέα Αθηναϊκή Σχολή"], correct: 0,
      hint: R`Ποιητές που έζησαν την Κατοχή, τον Εμφύλιο και τη διάψευση.`, sol: R`<b>Πρώτη Μεταπολεμική Γενιά</b> (μαζί με τον Τίτο Πατρίκιο, τον Μιχάλη Κατσαρό κ.ά.).` },
    { level: 1, q: R`Σε ποιο έτος δημοσιεύτηκε ο συλλογικός τόμος «Δεκαοχτώ κείμενα», όπου πρωτοεμφανίστηκε «Ο Στόχος»;`, fields: [{ label: "Έτος:", ans: 1970 }],
      hint: R`Ο τόμος κυκλοφόρησε στη διάρκεια της δικτατορίας, ως συλλογική πράξη αντίστασης των λογοτεχνών στη λογοκρισία.`, sol: R`Το <b>1970</b>.` },
    { level: 1, type: "mc", q: R`Ποιο πολιτικό καθεστώς είναι το πλαίσιο του ποιήματος;`, options: ["Η δικτατορία των Συνταγματαρχών (1967–1974)", "Η γερμανική Κατοχή", "Η βασιλεία του Όθωνα", "Η μεταπολίτευση"], correct: 0,
      hint: R`Χρονολογία τίτλου: 1969.`, sol: R`Η <b>δικτατορία των Συνταγματαρχών</b>.` },
    { level: 2, type: "mc", q: R`Σε ποιον ποιητή παραπέμπει διακειμενικά ο τίτλος;`, options: ["Στον Καβάφη", "Στον Σολωμό", "Στον Ελύτη", "Στον Κάλβο"], correct: 0,
      hint: R`Ποιος ποιητής έγραψε ιστορικά ποιήματα με χρονολογίες;`, sol: R`Στον <b>Καβάφη</b>: η χρονολογία με «μ.Χ.» θυμίζει τα ιστορικά του ποιήματα — το παρόν φωτίζεται σαν «ιστορία» παρακμής.` },
    { level: 2, type: "mc", q: R`Τι συμβολίζει η Τράπεζα Συναλλαγών;`, options: ["Την κυριαρχία της οικονομικής λογικής και της συναλλαγής πάνω στις ανθρώπινες αξίες", "Την οικονομική ευημερία όλων", "Την αρχιτεκτονική ομορφιά της πόλης", "Την ελευθερία του εμπορίου ως ιδανικό"], correct: 0,
      hint: R`Ποια λογική αντικαθιστά τον παλιό κόσμο;`, sol: R`Η τράπεζα δηλώνει ότι στη θέση της μνήμης και των οραμάτων κυριαρχεί πλέον η <b>λογική της συναλλαγής</b>.` },
    { level: 2, type: "mc", q: R`Ποιο είναι το ύφος του ποιήματος;`, options: ["Λιτό, πεζολογικό, με συγκρατημένη πικρία και ειρωνεία", "Πομπώδες, με πλούσια επίθετα", "Λυρικό, με σταθερή ομοιοκαταληξία", "Κωμικό, γεμάτο λογοπαίγνια"], correct: 0,
      hint: R`Γνώρισμα της γενιάς του ποιητή.`, sol: R`Λιτό, πεζολογικό ύφος — η πικρία δεν φωνάζει, υπονοείται μέσα από την ειρωνεία.` },
    { level: 2, type: "mc", q: R`Η μνεία των πρακτορείων μεταναστεύσεως παραπέμπει σε ποιο κοινωνικό πρόβλημα της εποχής;`, options: ["Στη μαζική, εξαναγκαστική μετανάστευση λόγω φτώχειας", "Στον υπερπληθυσμό των πόλεων", "Στην προσφυγιά του 1922", "Στον μαζικό τουρισμό των Ελλήνων στο εξωτερικό"], correct: 0,
      hint: R`Δεκαετίες 1950–1970: Γερμανία, Αυστραλία…`, sol: R`Χιλιάδες Έλληνες μετανάστευσαν για δουλειά· ο ποιητής δείχνει τον <b>εξαναγκασμό</b> πίσω από την «πρόοδο».` },
    { level: 3, type: "mc", q: R`Γιατί η ειρωνεία είναι κατάλληλο μέσο για ποίημα γραμμένο στη διάρκεια δικτατορίας;`, options: ["Επειδή ασκεί κριτική έμμεσα: λέει κάτι φαινομενικά ουδέτερο, ενώ υπονοεί το αντίθετο, και έτσι αποδομεί την προπαγάνδα και ξεφεύγει από τη λογοκρισία", "Επειδή κάνει τους αναγνώστες να γελάσουν και να ξεχάσουν", "Επειδή επαινεί ανοιχτά το καθεστώς", "Επειδή δεν απαιτεί προσεκτική ανάγνωση"], correct: 0,
      hint: R`Πώς μιλάς όταν δεν μπορείς να μιλήσεις ανοιχτά;`, sol: R`Η ειρωνεία ανατρέπει το έκδηλο νόημα: αποκαλύπτει την αντίθεση επίσημου λόγου – πραγματικότητας και μιλά «πίσω από τις λέξεις», σε έναν καιρό λογοκρισίας.` }
  ]
},
/* ───────────────────────────── 2.6 ───────────────────────────── */
{
  id: "2.6", unit: 2, title: "Κώστας Μόντης, «Τρίτο γράμμα στη μητέρα, ζ΄» — ανάλυση και Παγκύπριες 2026",
  book: "Τρίτο γράμμα στη μητέρα, Λευκωσία 1980 · Πλαίσιο Λογοτεχνίας Γ΄ (ΚΚ), Β΄ τετράμηνο, Κείμενο 9 · Παγκύπριες 2026, Β1",
  intro: "Τι έμεινε μετά την εισβολή του 1974; Το «Τρίτο γράμμα στη μητέρα, ζ΄» του Μόντη: συνέπειες της εισβολής, ειρωνεία για τη διεθνή κοινότητα — όπως εξετάστηκε στις Παγκύπριες 2026.",
  thumb: LETTER("Μόντης"),
  theory: R`
<div class="tbox rem"><h4>Πριν ξεκινήσεις</h4><p>Το ποίημα δεν αναπαράγεται εδώ (πνευματικά δικαιώματα). Το κείμενο δίνεται στο διδακτικό υλικό του ΥΠΑΝ (logom.schools.ac.cy)· στο εξεταστικό δοκίμιο του 2026 δόθηκε απόσπασμα (στ. 1–30). Οι αριθμοί στίχων παρακάτω ακολουθούν την αρίθμηση του αποσπάσματος.</p></div>
<div class="tbox def"><h4>Ταυτότητα</h4>
<p>Ο <b>Κώστας Μόντης</b> (Αμμόχωστος 1914 – Λευκωσία 2004) είναι από τις κορυφαίες φωνές της κυπριακής λογοτεχνίας. Έγραψε τρία «γράμματα» προς τη μητέρα του· το <b>«Τρίτο γράμμα στη μητέρα»</b> κυκλοφόρησε στη <b>Λευκωσία το 1980</b> και θρηνεί την <b>τουρκική εισβολή του 1974</b> και τις συνέπειές της. Το ποίημα χωρίζεται σε ενότητες που αριθμούνται με ελληνικά γράμματα· η ύλη περιλαμβάνει την ενότητα <b>ζ΄</b>.</p></div>
<div class="tbox"><h4>Δομή και περιεχόμενο (σε δικά μας λόγια)</h4>
<table class="tbl nbl"><tr><th>Στίχοι</th><th>Τι λέει το ποιητικό υποκείμενο</th></tr>
<tr><td>1–12</td><td>Οι πρόσφυγες (το «εμείς» του ποιήματος) τριγυρίζουν ασταμάτητα σε έναν ερειπωμένο, άδειο στρατιωτικό χώρο, όπου έχουν μείνει μόνο χαλάσματα και σβησμένες ταμπέλες. Ο τόπος φαίνεται ακόμη πιο έρημος και βουβός επειδή πριν ήταν γεμάτος ζωή: η μοναξιά, η απόγνωση και ο θάνατος μοιάζουν πολλαπλάσια.</td></tr>
<tr><td>13–20</td><td>Βρίσκουν στους τοίχους χαραγμένα ονόματα στρατιωτών με τόπο καταγωγής και ημερομηνία· τα ίδια ονόματα, παράξενα, βρίσκονται έπειτα πλάι-πλάι στο Στρατιωτικό Νεκροταφείο, τώρα με την ηλικία τους: δεκαεννιά, δεκαοχτώ.</td></tr>
<tr><td>21–30</td><td>Η πικρή διαπίστωση ότι η τραγωδία τους έγινε <b>αντικείμενο εμπορίου</b>· η απαρίθμηση ξένων επισκεπτών (υπουργοί, αρχηγοί κομμάτων, βουλευτές, φιλέλληνες, επιτροπές, δημοσιογράφοι, νέοι των οργανώσεων νεολαίας) που έρχονται να δουν τους καταυλισμούς και τα παιδιά των προσφύγων, να ακούσουν για τους αγνοουμένους — και να υποσχεθούν βοήθεια που δεν έρχεται.</td></tr>
<tr><td>31–44</td><td>Ο Γενικός Γραμματέας ενός διεθνούς οργανισμού τούς παροτρύνει να αντέξουν, διαβεβαιώνοντας ότι η υπόθεσή τους αφορά όλη την ανθρωπότητα — τα ίδια που είχε πει και σε άλλους λαούς, για να αποδειχτεί αργότερα ότι κανείς δεν στάθηκε στο πλευρό τους. Το ποίημα κλείνει με την απόφαση του υποκειμένου να πει όλη την αλήθεια στη μητέρα του, ό,τι κι αν γίνει.</td></tr></table></div>
<div class="tbox"><h4>Ποιητικό υποκείμενο — ποίηση του «εμείς»</h4>
<p>Το ποιητικό υποκείμενο <b>δεν ταυτίζεται με τον Μόντη</b>. Απευθύνεται στη <b>μητέρα</b> (προσφώνηση, εξομολογητικός τόνος — η μητέρα είναι και η μητέρα-πατρίδα) και μιλά κυρίως σε <b>α΄ πληθυντικό</b>: εκφράζει τη <b>συλλογική εμπειρία</b> της προσφυγιάς, της απώλειας και της διάψευσης του κυπριακού ελληνισμού.</p></div>
<div class="tbox"><h4>Εκφραστικά μέσα</h4>
<table class="tbl nbl"><tr><th>Μέσο</th><th>Πού</th><th>Λειτουργία</th></tr>
<tr><td>Επανάληψη / επαναφορά</td><td>η προσφώνηση στη μητέρα, το επαναλαμβανόμενο χρονικό επίρρημα του παρόντος, η επανάληψη στους στ. 7–12</td><td>θρήνος, συγκινησιακή ένταση, ρυθμός</td></tr>
<tr><td>Εικόνες</td><td>το έρημο στρατόπεδο, τα ερείπια, οι επιγραφές (στ. 1–20)</td><td>αποδίδουν παραστατικά την ερήμωση και τις συνέπειες της εισβολής</td></tr>
<tr><td>Αντίθεση</td><td>ερημιά – πλήθος, σιωπή – θόρυβος (στ. 7–10)</td><td>η απουσία γίνεται πιο βαριά επειδή προηγήθηκε ζωή</td></tr>
<tr><td>Μεταφορά</td><td>ο λαός που έγινε εμπόρευμα (στ. 21)</td><td>το συλλογικό βίωμα της ταπείνωσης και της εκμετάλλευσης</td></tr>
<tr><td>Ειρωνεία (με εισαγωγικά)</td><td>οι υποσχέσεις των επισκεπτών, η διαβεβαίωση ότι το Κυπριακό αφορά όλη την ανθρωπότητα</td><td>απογοήτευση από τη στάση της διεθνούς κοινότητας</td></tr>
<tr><td>Πολυσύνδετο</td><td>η απαρίθμηση των επισκεπτών (στ. 23–27)</td><td>το πλήθος των «συμπαραστατών» που δεν προσφέρουν τίποτα</td></tr>
<tr><td>Επιφορά</td><td>η ίδια φράση στο τέλος των στ. 28–30</td><td>επιμονή στην ειρωνεία, πικρία</td></tr></table></div>
<div class="tbox ex"><h4>Παγκύπριες 2026 — Β1 (12 μονάδες)</h4>
<p><b>(α)</b> Να εντοπίσετε και να παρουσιάσετε <b>δύο τραγικές συνέπειες</b> της τουρκικής εισβολής, όπως αποτυπώνονται στους στ. 1–20, με τεκμηρίωση. (6 μον.)<br><b>(β)</b> Να αναλύσετε <b>δύο σημεία</b> των στ. 21–30 όπου είναι έκδηλη η <b>ειρωνεία</b> και να εντοπίσετε <b>δύο διαφορετικά εκφραστικά μέσα</b> με τα οποία επιτυγχάνεται. (6 μον.)</p>
<details class="steps"><summary>Ενδεικτική απάντηση (σύμφωνα με τον οδηγό διόρθωσης, σε δική μας διατύπωση)</summary>
<p><b>(α)</b> Δεκτές συνέπειες: <b>προσφυγοποίηση – ανεστιότητα</b> (η ατέλειωτη περιπλάνηση· στ. 1, 6)· <b>υλική καταστροφή – ερήμωση</b> (το εγκαταλελειμμένο, μισογκρεμισμένο στρατόπεδο ως εικόνα της πληγωμένης Κύπρου· στ. 2–5)· <b>ψυχική οδύνη</b> (η ερημιά, η σιωπή και η απελπισία που μοιάζουν πολλαπλάσιες· στ. 7–11)· <b>θάνατος νέων στρατιωτών</b> (τα ονόματα και οι ηλικίες 18–19· στ. 12–20). Βαθμολόγηση: 2 × (συνέπεια 1 + παρουσίαση 1 + τεκμηρίωση 1).</p>
<p><b>(β)</b> Σημεία ειρωνείας: η τραγωδία έγινε αντικείμενο πολιτικής εκμετάλλευσης (στ. 21–22)· η υπερβολική «κινητοποίηση» ξένων παραγόντων με αμφίβολες προθέσεις (στ. 23–27)· οι επισκέπτες ως απλοί θεατές της προσφυγιάς και των αγνοουμένων, με υποσχέσεις που δεν τηρούνται (στ. 28–30). Εκφραστικά μέσα: <b>μεταφορά</b> (στ. 21), <b>εισαγωγικά</b> (στίξη), <b>επανάληψη/επαναφορά</b>, <b>επιφορά</b> (στ. 28–30), <b>πολυσύνδετο</b> (στ. 23–27), <b>εικόνες</b>. Βαθμολόγηση: ανάλυση 2 × 2 (απλός εντοπισμός: οι μισές μονάδες) + μέσα 2 × 0,5 + τεκμηρίωση 2 × 0,5.</p></details></div>
<div class="tbox tip"><h4>Σύγκριση με άλλα κείμενα</h4><p>Με το «Στα στέφανα της κόρης του» του Χαραλαμπίδη (2.8) και τον «Ονήσιλο» του Μηχανικού (2.7): τρεις κυπριακές ποιητικές φωνές για το 1974 — θρήνος, ειρωνεία, ενοχή.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Δίνουν «συνέπεια» χωρίς να την <b>παρουσιάσουν</b> (εξήγηση) ή χωρίς <b>τεκμηρίωση</b> από τους σωστούς στίχους. Στο (β) εντοπίζουν σημεία ειρωνείας αλλά δεν τα <b>αναλύουν</b> (χάνουν τις μισές μονάδες). Δίνουν δύο φορές το ίδιο εκφραστικό μέσο με άλλο όνομα.</p></div>
`,
  widget: "nb2w26",
  gen: "nb2g26",
  exercises: [
    { level: 1, q: R`Σε ποιο έτος κυκλοφόρησε το «Τρίτο γράμμα στη μητέρα»;`, fields: [{ label: "Έτος:", ans: 1980 }],
      hint: R`Η ένδειξη κάτω από το απόσπασμα των εξετάσεων: Λευκωσία, …`, sol: R`<b>1980</b> (Λευκωσία).` },
    { level: 1, type: "mc", q: R`Σε ποιο γραμματικό πρόσωπο μιλά κυρίως το ποιητικό υποκείμενο;`, options: ["Α΄ πληθυντικό", "Α΄ ενικό", "Γ΄ ενικό", "Β΄ πληθυντικό"], correct: 0,
      hint: R`Ποιοι περιφέρονται στο στρατόπεδο;`, sol: R`<b>Α΄ πληθυντικό</b>: συλλογική φωνή των προσφύγων — ποίηση του «εμείς».` },
    { level: 1, type: "mc", q: R`Η μητέρα, στην οποία απευθύνεται το ποίημα, μπορεί να ερμηνευτεί και ως:`, options: ["Η πατρίδα", "Ο Γενικός Γραμματέας", "Η διεθνής κοινότητα", "Ο εισβολέας"], correct: 0,
      hint: R`Σκέψου τη συμβολική διάσταση της προσφώνησης.`, sol: R`Η προσφώνηση στη μητέρα δίνει εξομολογητικό τόνο· συμβολικά η μητέρα είναι και η <b>μητέρα-πατρίδα</b>.` },
    { level: 2, type: "mc", q: R`Η ίδια φράση των επισκεπτών επαναλαμβάνεται στο τέλος των στ. 28, 29 και 30. Ποιο σχήμα λόγου είναι;`, options: ["Επιφορά", "Επαναφορά", "Ασύνδετο", "Οξύμωρο"], correct: 0,
      hint: R`Πρόσεξε σε ποιο σημείο των στίχων βρίσκεται η επαναλαμβανόμενη φράση.`, sol: R`<b>Επιφορά</b> — ενισχύει την ειρωνεία για τις κενές υποσχέσεις.` },
    { level: 2, type: "mc", q: R`Η μακριά απαρίθμηση επισκεπτών στους στ. 23–27, ενωμένων με «και», σχηματίζει:`, options: ["Πολυσύνδετο", "Ασύνδετο", "Παρομοίωση", "Υπερβατό"], correct: 0,
      hint: R`Μέτρησε πόσες φορές εμφανίζεται ο ίδιος σύνδεσμος στην απαρίθμηση.`, sol: R`<b>Πολυσύνδετο:</b> τονίζει το πλήθος των «συμπαραστατών» που τελικά δεν βοηθούν.` },
    { level: 2, type: "mc", q: R`Ποια είναι η λειτουργία των εισαγωγικών σε λόγια των επισκεπτών και των διεθνών παραγόντων;`, options: ["Δηλώνουν ειρωνεία — το ποιητικό υποκείμενο αμφισβητεί την ειλικρίνειά τους", "Δηλώνουν τίτλο βιβλίου", "Δηλώνουν ότι οι λέξεις είναι ξενόγλωσσες", "Δηλώνουν επιστημονικό όρο"], correct: 0,
      hint: R`Στίξη και ύφος.`, sol: R`Τα εισαγωγικά (σημείο στίξης) αποστασιοποιούν το υποκείμενο από τα λόγια των άλλων και τα παρουσιάζουν ως κενά — <b>ειρωνεία</b>.` },
    { level: 2, type: "mc", q: R`Ποια ΔΕΝ είναι τραγική συνέπεια της εισβολής που αποτυπώνεται στους στ. 1–20;`, options: ["Η αύξηση του τουρισμού", "Η προσφυγιά και η περιπλάνηση", "Η ερήμωση του τόπου", "Ο θάνατος νέων στρατιωτών"], correct: 0,
      hint: R`Παγκύπριες 2026, Β1(α).`, sol: R`Οι στ. 1–20 δείχνουν προσφυγιά, ερήμωση, ψυχική οδύνη, θάνατο νέων· ο τουρισμός δεν αναφέρεται.` },
    { level: 2, type: "mc", q: R`Τι δηλώνει η αναφορά στις ηλικίες 18 και 19 ετών στον στ. 20;`, options: ["Τον πρόωρο θάνατο νέων ανθρώπων στον πόλεμο", "Την ηλικία των επισκεπτών", "Την ηλικία των παιδιών των προσφύγων", "Την ηλικία του ποιητή"], correct: 0,
      hint: R`Πού βρέθηκαν ξανά τα ονόματα των στρατιωτών;`, sol: R`Τα ίδια ονόματα βρέθηκαν στο Στρατιωτικό Νεκροταφείο: ο θάνατος παιδιών 18–19 ετών είναι από τις πιο οδυνηρές συνέπειες.` },
    { level: 3, type: "mc", q: R`Ποια ανάλυση της μεταφοράς του στ. 21 (οι πρόσφυγες παρουσιάζονται σαν εμπόρευμα) είναι η πιο πλήρης;`, options: ["Μεταφορά: το κυπριακό δράμα δεν αντιμετωπίζεται ως ανθρώπινος πόνος αλλά ως αντικείμενο πολιτικής εκμετάλλευσης — εκφράζει ειρωνεία και απόγνωση", "Κυριολεξία: οι πρόσφυγες άνοιξαν μαγαζιά", "Υπερβολή: οι Κύπριοι είναι καλοί έμποροι", "Παρομοίωση με τη ζωή στην αγορά"], correct: 0,
      hint: R`Όνομα μέσου + ερμηνεία + λειτουργία.`, sol: R`Μια πλήρης απάντηση <b>ονομάζει</b> το μέσο (μεταφορά), το <b>ερμηνεύει</b> (εκμετάλλευση της τραγωδίας) και εξηγεί τη <b>λειτουργία</b> (ειρωνεία, πικρία, απόγνωση).` }
  ]
},
/* ───────────────────────────── 2.7 ───────────────────────────── */
{
  id: "2.7", unit: 2, title: "Παντελής Μηχανικός, «Ονήσιλος» — ανάλυση: ιστορική μνήμη και εφησυχασμός",
  book: "ΚΚΛ Β΄, σ. 197 · Πλαίσιο Λογοτεχνίας Γ΄ (ΚΚ), Β΄ τετράμηνο, Κείμενο 10",
  intro: "Γιατί ένα κρανίο γεμάτο μέλισσες γίνεται κατηγορία για όλους μας; Ο «Ονήσιλος» του Μηχανικού: ο αρχαίος ήρωας της Σαλαμίνας και η σύγχρονη Κύπρος.",
  thumb: LETTER("Ονήσιλος"),
  theory: R`
<div class="tbox rem"><h4>Πριν ξεκινήσεις</h4><p>Το ποίημα δεν αναπαράγεται εδώ (πνευματικά δικαιώματα). Μελέτησέ το στα <b>Κείμενα Κυπριακής Λογοτεχνίας, Β΄ τόμος (σ. 197)</b>.</p></div>
<div class="tbox def"><h4>Ταυτότητα</h4>
<p>Ο <b>Παντελής Μηχανικός</b> (1926–1979) είναι Κύπριος ποιητής με λιτή, κυνική και συχνά προφητική φωνή. Ο «Ονήσιλος» ανήκει στην ποίηση που γράφτηκε <b>μετά την εισβολή του 1974</b> και ερμηνεύει την καταστροφή ως αποτέλεσμα και της <b>συλλογικής αδιαφορίας</b>.</p></div>
<div class="tbox"><h4>Η ιστορική πηγή: Ηρόδοτος</h4>
<p>Ο <b>Ονήσιλος</b>, από τη βασιλική οικογένεια της <b>Σαλαμίνας</b>, ηγήθηκε της εξέγερσης των Κυπρίων κατά των <b>Περσών</b> στο πλαίσιο της Ιωνικής επανάστασης (<b>499/498–497 π.Χ.</b>). Σκοτώθηκε στη μάχη· οι <b>Αμαθούσιοι</b>, που είχαν μείνει πιστοί στους Πέρσες, κρέμασαν το κεφάλι του πάνω από τις πύλες της πόλης τους. Κατά τον <b>Ηρόδοτο</b> (Ε΄ βιβλίο), όταν το κρανίο άδειασε, το γέμισαν <b>μέλισσες</b> με κηρήθρα· μετά από χρησμό, οι Αμαθούσιοι το έθαψαν και τιμούσαν τον Ονήσιλο ως ήρωα.</p></div>
<div class="tbox"><h4>Περιεχόμενο σε συντομία</h4>
<p>Ο ποιητής αξιοποιεί την εικόνα του Ηροδότου: για μια ολόκληρη δεκαετία οι μέλισσες του κρανίου του Ονήσιλου προσπαθούν με τα κεντριά τους να αφυπνίσουν τη συλλογική συνείδηση — τη δική μας, αφού το ποίημα μιλά σε α΄ πληθυντικό — όμως η αναισθησία μας είναι τόσο βαθιά που δεν αισθανόμαστε τίποτα. Όταν πλησιάζει πια ο εισβολέας, ο ήρωας, σε μια απελπισμένη, βίαιη κίνηση, <b>καταστρέφει το ίδιο του το κρανίο</b> χτυπώντας μ' αυτό το ποιητικό υποκείμενο. Η δεκαετία της προειδοποίησης μπορεί να διαβαστεί ως τα χρόνια πριν από το 1974, όταν τα μηνύματα της ιστορίας αγνοήθηκαν.</p></div>
<div class="tbox"><h4>Ποιητικό υποκείμενο και «εμείς»</h4>
<p>Το ποιητικό υποκείμενο <b>δεν ταυτίζεται με τον ποιητή</b>· μιλά με <b>συλλογική φωνή</b> (α΄ πληθυντικό) και ομολογεί την ευθύνη: «εμείς» δεν αφήσαμε την προειδοποίηση να μας αγγίξει. Η ποίηση του «εμείς» εδώ είναι <b>αυτοκριτική</b>.</p></div>
<div class="tbox"><h4>Σύμβολα και εκφραστικά μέσα</h4>
<table class="tbl nbl"><tr><th>Στοιχείο</th><th>Σημασία – λειτουργία</th></tr>
<tr><td>Ονήσιλος</td><td>διαχρονικό σύμβολο αντίστασης, ιστορικής μνήμης και εγρήγορσης</td></tr>
<tr><td>το κρανίο με τις μέλισσες</td><td>η ιστορική μνήμη που κεντρίζει για να αφυπνίσει</td></tr>
<tr><td>το χοντρό δέρμα (μεταφορά)</td><td>η αδιαφορία, η πνευματική αδράνεια, ο εφησυχασμός</td></tr>
<tr><td>ο εισβολέας που πλησιάζει (ακουστική εικόνα)</td><td>η απειλή που τελικά έρχεται</td></tr>
<tr><td>Σαλαμίνα</td><td>η αρχαία κυπριακή πόλη, σύμβολο της ελληνικής Κύπρου</td></tr>
<tr><td>επανάληψη του αριθμού δέκα</td><td>η επίμονη αλλά μάταιη προσπάθεια αφύπνισης</td></tr>
<tr><td>αντίθεση</td><td>η προσπάθεια του Ονήσιλου ↔ η αδιαφορία των ανθρώπων</td></tr>
<tr><td>θεατρικότητα</td><td>ο Ονήσιλος ως δραματικό πρόσωπο· η βίαιη σκηνική χειρονομία του με το κρανίο κορυφώνει τη δράση</td></tr></table></div>
<div class="tbox thm"><h4>Μήνυμα</h4><p>Η ιστορία προειδοποιεί, αλλά οι λαοί συχνά δεν ακούν. Το ποίημα καταδικάζει τον <b>εφησυχασμό</b>, προβάλλει την <b>ευθύνη του κυπριακού ελληνισμού</b> απέναντι στην ιστορία και καλεί σε διαρκή <b>επαγρύπνηση</b>.</p></div>
<div class="tbox ex"><h4>Θέμα τύπου Παγκυπρίων</h4>
<p>Να εξηγήσετε πώς ο ποιητής αξιοποιεί την ιστορία του Ονήσιλου για να σχολιάσει τη σύγχρονη κυπριακή πραγματικότητα. (6 μονάδες)</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary>
<p>Ο ποιητής κρατά από τον Ηρόδοτο τον ήρωα της αντίστασης κατά των Περσών και το παράδοξο κρανίο με τις μέλισσες, αλλά το μεταπλάθει: οι μέλισσες δεν φτιάχνουν απλώς μέλι — για χρόνια προσπαθούν με τα κεντριά τους να αφυπνίσουν τους ανθρώπους. Έτσι ο αρχαίος ήρωας γίνεται <b>φωνή της ιστορικής μνήμης</b> που προειδοποιεί τη σύγχρονη Κύπρο. Η αποτυχία της προσπάθειας (το χοντρό δέρμα) καταγγέλλει τον <b>εφησυχασμό</b> πριν από το 1974· η βίαιη χειρονομία του Ονήσιλου τη στιγμή που φτάνει ο εισβολέας δείχνει ότι η αφύπνιση ήρθε πολύ αργά.</p></details></div>
<div class="tbox tip"><h4>Σύγκριση με άλλο κείμενο</h4><p>Με την «Ελένη» του Σεφέρη (2.2): και οι δύο ποιητές χρησιμοποιούν αρχαίο ήρωα της Σαλαμίνας της Κύπρου (Τεύκρος – Ονήσιλος) ως προσωπείο, για να μιλήσουν για τη σύγχρονη ιστορία.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Θεωρούν ότι ο εχθρός του ποιήματος είναι μόνο οι αρχαίοι Πέρσες — δεν συνδέουν με το 1974. Περιγράφουν την ιστορία του Ηροδότου χωρίς να εξηγήσουν τη <b>μεταποίησή</b> της από τον ποιητή.</p></div>
`,
  widget: "nb2w27",
  gen: "nb2g27",
  exercises: [
    { level: 1, q: R`Ποιος αρχαίος ιστορικός αφηγείται την ιστορία του Ονήσιλου και των μελισσών; (Γράψε το όνομα.)`, fields: [{ label: "Ιστορικός:", ans: ["Ηρόδοτος", "ο Ηρόδοτος"], text: true }],
      hint: R`Ο «πατέρας της Ιστορίας».`, sol: R`Ο <b>Ηρόδοτος</b> (βιβλίο Ε΄).` },
    { level: 1, type: "mc", q: R`Από ποια κυπριακή πόλη καταγόταν ο Ονήσιλος;`, options: ["Σαλαμίνα", "Αμαθούντα", "Πάφο", "Κίτιο"], correct: 0,
      hint: R`Ήταν η ισχυρότερη πόλη-βασίλειο της αρχαίας Κύπρου, στην ανατολική ακτή του νησιού.`, sol: R`Από τη <b>Σαλαμίνα</b>· η Αμαθούντα ήταν η πόλη που κρέμασε το κεφάλι του.` },
    { level: 1, type: "mc", q: R`Εναντίον ποιων εξεγέρθηκε ο Ονήσιλος;`, options: ["Των Περσών", "Των Ρωμαίων", "Των Αράβων", "Των Φράγκων"], correct: 0,
      hint: R`Η εξέγερση ήταν μέρος της Ιωνικής επανάστασης.`, sol: R`Εναντίον των <b>Περσών</b> (499/498–497 π.Χ.).` },
    { level: 2, type: "mc", q: R`Τι συμβολίζει το χοντρό δέρμα που οι μέλισσες δεν μπορούν να τρυπήσουν;`, options: ["Την αδιαφορία και την πνευματική αδράνεια των ανθρώπων", "Την υγεία του λαού", "Τη στρατιωτική προετοιμασία", "Τον πλούτο της Κύπρου"], correct: 0,
      hint: R`Μεταφορά για τη συνείδηση.`, sol: R`<b>Μεταφορά</b> για την αναισθησία και τον εφησυχασμό που δεν άφησαν την προειδοποίηση να αγγίξει τους ανθρώπους.` },
    { level: 2, type: "mc", q: R`Ποιο είναι το κεντρικό μήνυμα του ποιήματος;`, options: ["Η ανάγκη ιστορικής εγρήγορσης και η καταδίκη του εφησυχασμού", "Η χαρά για την ειρήνη", "Ο θαυμασμός για τους κατακτητές", "Η αξία της μελισσοκομίας"], correct: 0,
      hint: R`Τι έγινε όταν έφτασε τελικά ο εισβολέας;`, sol: R`Η ιστορία προειδοποιεί· όποιος αδιαφορεί πληρώνει. Καταδικάζεται ο <b>εφησυχασμός</b>.` },
    { level: 2, type: "mc", q: R`Ποιο στοιχείο θεατρικότητας υπάρχει στο ποίημα;`, options: ["Ο Ονήσιλος ως δραματικό πρόσωπο που κάνει μια βίαιη σκηνική χειρονομία με το ίδιο του το κρανίο", "Σκηνικές οδηγίες σε πλάγια γράμματα", "Διάλογος ανάμεσα σε χορό και κορυφαίο", "Διαίρεση σε πράξεις και σκηνές"], correct: 0,
      hint: R`Πλαίσιο, δείκτης 5.`, sol: R`Δράση, κίνηση, σκηνική εικόνα: ο ήρωας δρα σαν σε σκηνή — η χειρονομία κορυφώνει τη σύγκρουση.` },
    { level: 2, type: "mc", q: R`Η επανάληψη του αριθμού δέκα στο ποίημα λειτουργεί:`, options: ["Τονίζοντας την επίμονη αλλά μάταιη προσπάθεια αφύπνισης", "Ως ακριβής ιστορική χρονολογία της μάχης", "Ως χιουμοριστικό στοιχείο", "Για να δημιουργήσει ομοιοκαταληξία"], correct: 0,
      hint: R`Τι ήθελαν να πετύχουν οι μέλισσες;`, sol: R`Η επανάληψη υπογραμμίζει τη <b>διάρκεια</b> της προειδοποίησης και την αδιαφορία που τη συνάντησε.` },
    { level: 3, type: "mc", q: R`Ποια φωνή κυριαρχεί και τι δηλώνει;`, options: ["Η συλλογική φωνή του «εμείς», που ομολογεί τη συλλογική ευθύνη για την αδιαφορία", "Η φωνή των Περσών, που καυχιούνται", "Η φωνή ενός ουδέτερου ιστορικού", "Η φωνή του Ηροδότου"], correct: 0,
      hint: R`Πλαίσιο, δείκτης 4.`, sol: R`Το α΄ πληθυντικό κάνει το ποίημα <b>αυτοκριτικό</b>: όλοι μαζί δεν νιώσαμε τίποτα — όλοι μαζί ευθυνόμαστε.` }
  ]
},
/* ───────────────────────────── 2.8 ───────────────────────────── */
{
  id: "2.8", unit: 2, title: "Κυριάκος Χαραλαμπίδης, «Στα στέφανα της κόρης του» — ανάλυση: ο αγνοούμενος πατέρας",
  book: "ΚΝΕΛ Γ΄, σ. 118 · Πλαίσιο Λογοτεχνίας Γ΄ (ΚΚ), Β΄ τετράμηνο, Κείμενο 11",
  intro: "Πώς παρευρίσκεται ένας αγνοούμενος στον γάμο της κόρης του; Το «Στα στέφανα της κόρης του» του Χαραλαμπίδη: ειρωνεία, θεατρικότητα, το δράμα των αγνοουμένων.",
  thumb: LETTER("Στέφανα"),
  theory: R`
<div class="tbox rem"><h4>Πριν ξεκινήσεις</h4><p>Το ποίημα δεν αναπαράγεται εδώ (πνευματικά δικαιώματα). Μελέτησέ το στο <b>ΚΝΕΛ Γ΄ (σ. 118)</b>.</p></div>
<div class="tbox def"><h4>Ταυτότητα</h4>
<p>Ο <b>Κυριάκος Χαραλαμπίδης</b> (γενν. 1940, Άχνα Αμμοχώστου) είναι από τους σημαντικότερους σύγχρονους Κύπριους ποιητές. Το ποίημα δημοσιεύτηκε στη συλλογή <b>«Θόλος»</b> (1989), όπου η ιστορική μνήμη της Κύπρου και τα τραύματα του <b>1974</b> κατέχουν κεντρική θέση (το Πλαίσιο προτείνει και τη μελέτη άλλων ποιημάτων της συλλογής). Θέμα του: το δράμα των <b>αγνοουμένων</b> και των οικογενειών τους.</p></div>
<div class="tbox"><h4>Περιεχόμενο σε συντομία</h4>
<p>Γίνεται ο γάμος («τα στέφανα») μιας κοπέλας. Ο πατέρας της είναι <b>αγνοούμενος</b> της εισβολής: κάποτε νοικοκύρης με δική του γη, χάθηκε μακριά, σε φυλακές της Ανατολής. Τώρα εμφανίζεται αθόρυβα στην εκκλησία και μένει παράμερα, κρυμμένος, χωρίς να πλησιάσει. Κανείς δεν καταλαβαίνει ποιος είναι: οι καλεσμένοι τον θεωρούν έναν ακίνδυνο, περιθωριακό χωρικό και δεν του δίνουν σημασία. Εκείνος βλέπει την κόρη του να παντρεύεται, συγκινείται σιωπηλά και, όταν η τελετή τελειώνει, επιστρέφει εκεί απ' όπου ήρθε — <b>στη γη των νεκρών</b>. Η εικόνα είναι οραματική: ο νεκρός-αγνοούμενος «επιστρέφει» για λίγο στη χαρά της κόρης του.</p></div>
<div class="tbox"><h4>Μορφή: επώνυμη παραδοσιακή ποίηση</h4>
<p>Το Πλαίσιο ζητά να αναγνωρίσεις χαρακτηριστικά της <b>επώνυμης παραδοσιακής ποίησης</b> — <b>στροφική οργάνωση</b>, <b>λυρικό ύφος</b>, <b>συνάφεια τίτλου και περιεχομένου</b> — και να τα διακρίνεις από τα γνωρίσματα της μοντέρνας ποίησης (ελεύθερος στίχος, άνισες στροφές, ασάφεια, αινιγματικός τίτλος). Η παραδοσιακή μορφή ενισχύει τη συγκίνηση και αναδεικνύει το δράμα κόρης και πατέρα.</p></div>
<div class="tbox"><h4>Ποιητικό υποκείμενο</h4>
<p>Το ποιητικό υποκείμενο (όχι ο Χαραλαμπίδης) <b>αφηγείται</b> τη σκηνή με <b>συγκρατημένο, λιτό τρόπο</b>, σαν αφηγητής-παρατηρητής, χωρίς μεγάλα λόγια· η λιτότητα κάνει τη συγκίνηση πιο έντονη.</p></div>
<div class="tbox"><h4>Σύμβολα και εκφραστικά μέσα</h4>
<table class="tbl nbl"><tr><th>Στοιχείο</th><th>Σημασία – λειτουργία</th></tr>
<tr><td>τα στέφανα</td><td>ο γάμος, η ζωή που συνεχίζεται· αντίθεση με την απουσία</td></tr>
<tr><td>η γη/τα στρέμματα του πατέρα</td><td>η περιουσία και ο τόπος που χάθηκαν</td></tr>
<tr><td>η Ανατολή (μεταφορά)</td><td>οι φυλακές και ο τόπος όπου χάθηκαν οι αγνοούμενοι</td></tr>
<tr><td>η Πράσινη Γραμμή (μεταφορά)</td><td>η διαίρεση του νησιού</td></tr>
<tr><td>η γη (ως τόπος των νεκρών)</td><td>ο θάνατος, η επιστροφή στη γη — η γη της πατρίδας</td></tr>
<tr><td>Εικόνες (ο κρυμμένος πατέρας, η σιωπηλή του συγκίνηση)</td><td>παραστατικό δράμα· η σιωπηλή, αόρατη παρουσία</td></tr>
<tr><td>Αντίθεση</td><td>η χαρά του γάμου ↔ ο πόνος της απουσίας</td></tr>
<tr><td>Ειρωνεία (δραματική)</td><td>τον περνούν για περιθωριακό του χωριού, ενώ είναι ο πατέρας της νύφης — ο αναγνώστης ξέρει, οι καλεσμένοι όχι</td></tr>
<tr><td>Θεατρικότητα</td><td>σκηνικό (η εκκλησία την ώρα του μυστηρίου), πρόσωπα, κινήσεις, εξωτερική εικόνα του πατέρα</td></tr></table></div>
<div class="tbox thm"><h4>Μηνύματα</h4><p>Το ανοιχτό τραύμα των <b>αγνοουμένων</b>· η ιστορική μνήμη, η οικογενειακή συνοχή, η αγάπη για την πατρίδα· η ορθόδοξη παράδοση του γάμου ως πλαίσιο όπου η απουσία γίνεται παρουσία.</p></div>
<div class="tbox ex"><h4>Θέμα τύπου Παγκυπρίων</h4>
<p>Να εντοπίσετε την ειρωνεία του ποιήματος και να εξηγήσετε πώς ανατρέπει το έκδηλο νόημα. (5 μονάδες)</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary>
<p>Οι καλεσμένοι, βλέποντας έναν άγνωστο, φτωχικό άνθρωπο κρυμμένο σε μια γωνιά της εκκλησίας, τον περνούν για περιθωριακό του χωριού και τον αγνοούν. Ο αναγνώστης όμως ξέρει ότι είναι ο <b>αγνοούμενος πατέρας</b> της νύφης. Η <b>δραματική ειρωνεία</b> ανατρέπει το έκδηλο νόημα: ο πιο «ασήμαντος» καλεσμένος είναι το πιο σημαντικό πρόσωπο της γιορτής· η εξωτερική εικόνα κρύβει την πραγματική ταυτότητα· η χαρά του γάμου συνυπάρχει με το δράμα της απουσίας. <i>(Τεκμηρίωσε με στίχους του δοσμένου κειμένου.)</i></p></details></div>
<div class="tbox tip"><h4>Σύγκριση με άλλα κείμενα</h4><p>Το Πλαίσιο προτείνει το «Του Χρυσοσώτηρου» του Α. Παστελλά· μέσα στην ύλη, με τον Μόντη (2.6): η μνήμη των νεκρών και των αγνοουμένων του 1974.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Γράφουν ότι ο πατέρας είναι «ζωντανός και γύρισε» — το ποίημα είναι <b>οραματικό</b>: στο τέλος επιστρέφει στον κόσμο των νεκρών. Δεν εξηγούν τη λειτουργία της παραδοσιακής μορφής όταν ζητείται.</p></div>
`,
  widget: "nb2w28",
  gen: "nb2g28",
  exercises: [
    { level: 1, type: "mc", q: R`Ποιο κυπριακό δράμα προβάλλει το ποίημα;`, options: ["Το δράμα των αγνοουμένων", "Τη μετανάστευση", "Τον αγώνα της ΕΟΚΑ", "Τη φτώχεια της αποικιοκρατίας"], correct: 0,
      hint: R`Πού βρίσκεται ο πατέρας;`, sol: R`Ο πατέρας είναι <b>αγνοούμενος</b> της εισβολής του 1974.` },
    { level: 1, q: R`Σε ποια ποιητική συλλογή ανήκει το ποίημα; (Γράψε τον τίτλο.)`, fields: [{ label: "Συλλογή:", ans: ["Θόλος", "ο Θόλος"], text: true, nopunct: true }],
      hint: R`Μια μονολεκτική συλλογή του 1989, βραβευμένη από την Ακαδημία Αθηνών· ο τίτλος παραπέμπει σε αρχιτεκτονικό στοιχείο (και στον θολωτό τάφο).`, sol: R`<b>«Θόλος»</b> (1989).` },
    { level: 1, type: "mc", q: R`Πώς είναι παρών ο πατέρας στη διάρκεια του μυστηρίου;`, options: ["Κρυφά, παράμερα, χωρίς να τον αναγνωρίσει κανείς", "Συνοδεύει τη νύφη ως την Ωραία Πύλη", "Είναι κουμπάρος του γάμου", "Μιλά στους καλεσμένους για την αιχμαλωσία του"], correct: 0,
      hint: R`Τον γνωρίζει κανείς από τους καλεσμένους;`, sol: R`Είναι παρών <b>κρυφά, αόρατα</b>: η σιωπηλή παρουσία του αγνοουμένου.` },
    { level: 2, type: "mc", q: R`Ποια είναι η ειρωνεία του ποιήματος;`, options: ["Οι καλεσμένοι τον περνούν για περιθωριακό του χωριού, ενώ είναι ο πατέρας της νύφης", "Η νύφη δεν θέλει τον γάμο", "Ο ιερέας είναι ο πατέρας", "Ο γάμος γίνεται σε ξένη χώρα"], correct: 0,
      hint: R`Τι ξέρει ο αναγνώστης που δεν ξέρουν οι καλεσμένοι;`, sol: R`<b>Δραματική ειρωνεία:</b> η εξωτερική εικόνα κρύβει την πραγματική ταυτότητα.` },
    { level: 2, type: "mc", q: R`Τι συμβολίζει η Πράσινη Γραμμή;`, options: ["Τη διαίρεση του νησιού", "Τα πράσινα χωράφια", "Την ελπίδα", "Τον ποταμό Πεδιαίο"], correct: 0,
      hint: R`Λευκωσία μετά το 1964/1974.`, sol: R`Τη <b>διαίρεση</b> της Κύπρου.` },
    { level: 2, type: "mc", q: R`Ποια αντίθεση διατρέχει το ποίημα;`, options: ["Η χαρά του γάμου – ο πόνος της απουσίας", "Ο πλούτος – η φτώχεια της νύφης", "Η πόλη – η θάλασσα", "Η νύχτα – η μέρα"], correct: 0,
      hint: R`Γιορτή και…`, sol: R`Η γιορτή της ζωής κάνει την <b>απουσία</b> του πατέρα ακόμη πιο οδυνηρή.` },
    { level: 2, type: "mc", q: R`Ποια χαρακτηριστικά της επώνυμης παραδοσιακής ποίησης εντοπίζει το Πλαίσιο στο ποίημα;`, options: ["Στροφική οργάνωση, λυρικό ύφος, συνάφεια τίτλου και περιεχομένου", "Ελεύθερο στίχο, ασάφεια, αινιγματικό τίτλο", "Υπερρεαλιστικές εικόνες χωρίς λογική σύνδεση", "Πεζό λόγο χωρίς στίχους"], correct: 0,
      hint: R`Παραδοσιακή ↔ μοντέρνα ποίηση.`, sol: R`Στροφές, λυρισμός, τίτλος που δηλώνει καθαρά το θέμα — γνωρίσματα της παραδοσιακής ποίησης.` },
    { level: 3, type: "mc", q: R`Τι δηλώνει το τέλος, όπου ο πατέρας επιστρέφει στη γη;`, options: ["Ότι η παρουσία του ήταν οραματική: ο αγνοούμενος είναι νεκρός και επιστρέφει στη γη της πατρίδας", "Ότι πήγε να δουλέψει στα χωράφια του", "Ότι κρύφτηκε από τους καλεσμένους", "Ότι έφυγε για την Ανατολή"], correct: 0,
      hint: R`Η γη ως σύμβολο.`, sol: R`Η επιστροφή στη γη σημαίνει τον <b>θάνατο</b> — αλλά και τη γη της πατρίδας: ο νεκρός «επέστρεψε» για λίγο στη χαρά της κόρης του.` }
  ]
},
/* ───────────────────────────── 3.1 ───────────────────────────── */
{
  id: "3.1", unit: 3, title: "Γιώργος Ιωάννου, «†13-12-43» — ανάλυση: Καλάβρυτα, μνήμη και λήθη",
  book: "ΚΝΕΛ Γ΄, σ. 275–277 · Πλαίσιο Λογοτεχνίας Γ΄ (ΚΚ), Α΄ τετράμηνο, Κείμενο 5",
  intro: "Πώς στέκεται κανείς σε έναν τόπο μαρτυρίου — με ευλάβεια ή σαν τουρίστας; Το «†13-12-43» του Ιωάννου: αφηγητής, τεχνικές, μηνύματα για τις Παγκύπριες.",
  thumb: LETTER("†13-12-43"),
  theory: R`
<div class="tbox rem"><h4>Πριν ξεκινήσεις</h4><p>Το διήγημα δεν αναπαράγεται εδώ (πνευματικά δικαιώματα). Μελέτησέ το στο <b>ΚΝΕΛ Γ΄ (σ. 275–277)</b>.</p></div>
<div class="tbox def"><h4>Ταυτότητα</h4>
<p>Ο <b>Γιώργος Ιωάννου</b> (Θεσσαλονίκη 1927 – Αθήνα 1985) είναι κορυφαίος πεζογράφος της <b>μεταπολεμικής πεζογραφίας</b>, με εξομολογητική, βιωματική γραφή. Το <b>«†13-12-43»</b> ανήκει στην πρώτη του πεζογραφική συλλογή <b>«Για ένα φιλότιμο»</b> (1964). Ο τίτλος — μια ημερομηνία με σταυρό, σαν επιτύμβια επιγραφή — παραπέμπει στο <b>Ολοκαύτωμα των Καλαβρύτων</b>: στις <b>13 Δεκεμβρίου 1943</b> τα γερμανικά στρατεύματα κατοχής εκτέλεσαν μαζικά τους άνδρες και τα αγόρια της πόλης, ως αντίποινα για τη δράση των ανταρτών, και έκαψαν την πόλη.</p></div>
<div class="tbox"><h4>Περιεχόμενο σε συντομία</h4>
<p>Περίπου είκοσι χρόνια μετά, ο αφηγητής επισκέπτεται τα Καλάβρυτα. Στον λόφο της εκτέλεσης, με τον μεγάλο λευκό σταυρό και την ημερομηνία σχηματισμένη με πέτρες, παρακολουθεί ένα <b>αδελφικό ζευγάρι</b> να ανοίγει τον τάφο του μικρότερου αδελφού τους, για την εκταφή των οστών: η γυναίκα μαζεύει τα κόκαλα με ευλάβεια· ο άντρας βρίσκει το κρανίο με το σημάδι της χαριστικής βολής. Λίγο αργότερα καταφθάνει με πούλμαν μια οργανωμένη ομάδα επισκεπτών, που αφήνει στεφάνι, κρατά ενός λεπτού σιγή, ακούει μια ψυχρή ιστορική περιγραφή — και αμέσως μετά ξαναπιάνει την κουβέντα και τα αστεία. Κάποιος μάλιστα <b>δικαιολογεί την εκτέλεση</b> και κανείς δεν αντιδρά. Όταν η γυναίκα ζητά εφημερίδες για να τυλίξει τα οστά, της δίνουν ακατάλληλες, βρόμικες. Ο αφηγητής συγκλονίζεται, αγανακτεί, θυμάται τον δικό του φόβο στην Κατοχή, και στο τέλος μένει πίσω, αποκομμένος από την ομάδα, και κατευθύνεται πικραμένος σε ένα λαϊκό καφενείο.</p></div>
<div class="tbox"><h4>Αφηγητής και αφηγηματικοί τρόποι</h4>
<ul><li><b>Ομοδιηγητικός αφηγητής</b>, σε <b>α΄ πρόσωπο</b> (αυτόπτης μάρτυρας): <b>αμεσότητα</b>, <b>βιωματικότητα</b>, εξομολογητικός τόνος, <b>αξιοπιστία</b> της μαρτυρίας· ο αναγνώστης νιώθει μαζί του.</li>
<li><b>Αφήγηση</b>: προωθεί τα γεγονότα της επίσκεψης.</li>
<li><b>Περιγραφή</b>: αποδίδει παραστατικά τον χώρο του μαρτυρίου και τα οστά — έντονη οπτική και συναισθηματική εικόνα (με αισθητηριακές λεπτομέρειες: οσμές, χρώματα).</li>
<li><b>Σχόλιο</b>: αποκαλύπτει τις σκέψεις, τις αξίες και την <b>ηθική στάση</b> του αφηγητή (η αγανάκτηση για τους εκδρομείς).</li></ul></div>
<div class="tbox"><h4>Χρόνος</h4>
<p><b>Χρόνος της ιστορίας:</b> η επίσκεψη, είκοσι περίπου χρόνια μετά την εκτέλεση. <b>Αναδρομές</b> στην Κατοχή (οι μνήμες του αφηγητή, η σκέψη για τις τελευταίες στιγμές του εκτελεσμένου). <b>Επιβράδυνση</b> στη σκηνή της εκταφής (λεπτομερής περιγραφή) — ο αναγνώστης «στέκεται» μαζί με τον αφηγητή. <b>Επιτάχυνση</b> στις κινήσεις της ομάδας.</p></div>
<div class="tbox thm"><h4>Θέματα και μηνύματα</h4>
<ul><li>Η <b>ιστορική μνήμη</b> απέναντι στη <b>λήθη</b> και στην επιφανειακή, «τουριστική» σχέση με το παρελθόν.</li>
<li>Η <b>ευλάβεια</b> των συγγενών ↔ η <b>αναισθησία</b> των επισκεπτών (κεντρική αντίθεση, με ειρωνεία).</li>
<li>Η καταδίκη των εγκλημάτων πολέμου, της βίας και του φανατισμού· ο σεβασμός στην ανθρώπινη αξιοπρέπεια.</li></ul></div>
<div class="tbox ex"><h4>Θέμα τύπου Παγκυπρίων</h4>
<p>Να εξηγήσετε πώς λειτουργεί η πρωτοπρόσωπη αφήγηση στο διήγημα. (4 μονάδες)</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary>
<p>Ο αφηγητής είναι ομοδιηγητικός: συμμετέχει στην επίσκεψη ως αυτόπτης μάρτυρας και αφηγείται σε α΄ πρόσωπο. Έτσι (1) η αφήγηση αποκτά <b>αμεσότητα και βιωματικότητα</b> — ζούμε μαζί του τη συγκίνηση μπροστά στην εκταφή· (2) η μαρτυρία γίνεται <b>αξιόπιστη</b>, σαν προσωπική κατάθεση· (3) αποκαλύπτονται οι <b>σκέψεις και η ηθική του στάση</b> (η αγανάκτηση για την αδιαφορία των εκδρομέων), ώστε ο αναγνώστης να συμμεριστεί την κριτική του για τη λήθη. <i>(Τεκμηρίωσε με σημεία του αποσπάσματος.)</i></p></details></div>
<div class="tbox tip"><h4>Σύγκριση με άλλο κείμενο</h4><p>Με το «Τρίτο γράμμα στη μητέρα» του Μόντη (2.6): σε αμφότερα οι «επισκέπτες» ενός τόπου πόνου στέκονται επιφανειακά απέναντι στο δράμα — ειρωνεία και πικρία του αφηγητή/ποιητικού υποκειμένου.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Γράφουν ότι ο αφηγητής ξεθάβει τον δικό του αδελφό — όχι· είναι <b>αυτόπτης μάρτυρας</b>· η εκταφή αφορά ένα άλλο αδελφικό ζευγάρι. Ταυτίζουν άκριτα τον αφηγητή με τον συγγραφέα (ακόμη και σε βιωματικό κείμενο, ο αφηγητής είναι λογοτεχνικό πρόσωπο).</p></div>
`,
  widget: "nb2w31",
  gen: "nb2g31",
  exercises: [
    { level: 1, q: R`Σε ποιο έτος έγινε το Ολοκαύτωμα των Καλαβρύτων, στο οποίο παραπέμπει ο τίτλος;`, fields: [{ label: "Έτος:", ans: 1943 }],
      hint: R`Το ολοκαύτωμα έγινε στη διάρκεια της γερμανικής Κατοχής (1941–1944).`, sol: R`Στις 13 Δεκεμβρίου <b>1943</b>.` },
    { level: 1, type: "mc", q: R`Σε ποια συλλογή του Ιωάννου ανήκει το διήγημα;`, options: ["«Για ένα φιλότιμο» (1964)", "«Η σαρκοφάγος»", "«Οι νεκροί περιμένουν»", "«Σκληροί καιροί»"], correct: 0,
      hint: R`Η αρχική πεζογραφική του συλλογή.`, sol: R`<b>«Για ένα φιλότιμο»</b> (1964).` },
    { level: 1, type: "mc", q: R`Τι είδους αφηγητής υπάρχει στο διήγημα;`, options: ["Ομοδιηγητικός, σε α΄ πρόσωπο", "Ετεροδιηγητικός, σε γ΄ πρόσωπο", "Παντογνώστης εξωτερικός", "Δεν υπάρχει αφηγητής"], correct: 0,
      hint: R`Συμμετέχει στην επίσκεψη;`, sol: R`<b>Ομοδιηγητικός</b> (αυτόπτης μάρτυρας), σε α΄ πρόσωπο.` },
    { level: 2, type: "mc", q: R`Ποια είναι η κεντρική αντίθεση του διηγήματος;`, options: ["Η ευλάβεια των συγγενών – η επιπολαιότητα των εκδρομέων", "Ο πλούτος – η φτώχεια", "Ο χειμώνας – η άνοιξη", "Η πόλη – το χωριό"], correct: 0,
      hint: R`Δύο στάσεις μπροστά στον ίδιο τάφο.`, sol: R`Η ευλάβεια του αδελφικού ζευγαριού αντιπαρατίθεται στην ψυχρή, «τουριστική» συμπεριφορά της ομάδας.` },
    { level: 2, type: "mc", q: R`Ποια λειτουργία έχει η λεπτομερής περιγραφή της εκταφής;`, options: ["Επιβραδύνει την αφήγηση και δημιουργεί έντονη οπτική και συναισθηματική εικόνα", "Επιταχύνει την πλοκή", "Δείχνει ότι ο αφηγητής βαριέται", "Εισάγει χιουμοριστική ατμόσφαιρα"], correct: 0,
      hint: R`Τεχνικές του χρόνου.`, sol: R`<b>Επιβράδυνση</b> με περιγραφή: παραστατικότητα και συγκινησιακή ένταση.` },
    { level: 2, type: "mc", q: R`Ποιος αφηγηματικός τρόπος αποκαλύπτει την ηθική στάση του αφηγητή απέναντι στους εκδρομείς;`, options: ["Το σχόλιο", "Ο διάλογος", "Η περίληψη", "Η πρόληψη"], correct: 0,
      hint: R`Ο αφηγητής κρίνει…`, sol: R`Το <b>σχόλιο</b> φανερώνει τις σκέψεις, τις αξίες και την αγανάκτηση του αφηγητή.` },
    { level: 2, type: "mc", q: R`Πώς αντιδρά η ομάδα όταν κάποιος δικαιολογεί την εκτέλεση;`, options: ["Κανείς δεν αντιδρά", "Όλοι διαμαρτύρονται έντονα", "Ο ξεναγός τον διώχνει", "Η γυναίκα τον χαστουκίζει"], correct: 0,
      hint: R`Τι δείχνει αυτό για την ηθική ευαισθησία της ομάδας;`, sol: R`Η σιωπή της ομάδας δείχνει <b>ηθική αναισθησία</b> — και πληγώνει βαθιά τον αφηγητή.` },
    { level: 3, type: "mc", q: R`Ποιο από τα παρακάτω εκφράζει πληρέστερα το μήνυμα του διηγήματος;`, options: ["Η ιστορική μνήμη απαιτεί σεβασμό και ευθύνη· η λήθη και η αναισθησία είναι μια δεύτερη αδικία προς τους νεκρούς", "Οι εκδρομές είναι κουραστικές", "Ο πόλεμος έχει και θετικές πλευρές", "Τα Καλάβρυτα είναι όμορφος τουριστικός προορισμός"], correct: 0,
      hint: R`Πλαίσιο, δείκτης 6.`, sol: R`Το διήγημα καλλιεργεί τον <b>σεβασμό</b> στην ανθρώπινη αξιοπρέπεια και στην ιστορική μνήμη και καταδικάζει τη λήθη.` }
  ]
},
/* ───────────────────────────── 3.2 ───────────────────────────── */
{
  id: "3.2", unit: 3, title: "Διδώ Σωτηρίου, «Οι νεκροί περιμένουν» — ανάλυση: η μικρασιατική κοινωνία",
  book: "ΚΝΕΛ Γ΄, σ. 173–179 (απόσπασμα) · Πλαίσιο Λογοτεχνίας Γ΄ (ΚΚ), Β΄ τετράμηνο, Κείμενο 6",
  intro: "Πώς ζούσαν οι άνθρωποι στη Μικρά Ασία πριν από το 1922; Το απόσπασμα από το «Οι νεκροί περιμένουν» της Διδώς Σωτηρίου: αφηγήτρια, τρόποι, κοινωνικές σχέσεις.",
  thumb: LETTER("Αϊδίνι"),
  theory: R`
<div class="tbox rem"><h4>Πριν ξεκινήσεις</h4><p>Το απόσπασμα δεν αναπαράγεται εδώ (πνευματικά δικαιώματα). Μελέτησέ το στο <b>ΚΝΕΛ Γ΄ (σ. 173–179)</b>.</p></div>
<div class="tbox def"><h4>Ταυτότητα</h4>
<p>Η <b>Διδώ Σωτηρίου</b> (Αϊδίνι Μικράς Ασίας 1909 – Αθήνα 2004) είναι πεζογράφος της <b>μεταπολεμικής πεζογραφίας</b>, γνωστή κυρίως από τα «Ματωμένα χώματα» (1962). <b>«Οι νεκροί περιμένουν»</b> (1959) είναι το πρώτο της μυθιστόρημα, με έντονα <b>αυτοβιογραφικά</b> στοιχεία: αναπλάθει τη ζωή μιας ελληνικής οικογένειας στο <b>Αϊδίνι</b> και την πορεία της μέχρι την Καταστροφή και την προσφυγιά.</p></div>
<div class="tbox"><h4>Το απόσπασμα της ύλης</h4>
<p>Η αφηγήτρια, ως ενήλικη, ξαναθυμάται τα <b>παιδικά της χρόνια</b> στο Αϊδίνι, πριν από την Καταστροφή του 1922: την οικογένεια, τη γειτονιά, τα έθιμα, την καθημερινή ζωή. Μέσα από τα μάτια του παιδιού αναδεικνύονται οι <b>κοινωνικές σχέσεις</b> της μικρασιατικής κοινωνίας: οι οικογενειακοί δεσμοί, η φιλοξενία, η αλληλεγγύη της γειτονιάς, η καθημερινή συνύπαρξη διαφορετικών ανθρώπων — αλλά και οι <b>ταξικές διακρίσεις</b> ανάμεσα σε πλούσιους και φτωχούς, η κοινωνική προκατάληψη και η φτώχεια.</p></div>
<div class="tbox"><h4>Αφηγήτρια</h4>
<p><b>Αυτοδιηγητική αφηγήτρια</b> (η ίδια η πρωταγωνίστρια), σε <b>α΄ πρόσωπο</b>. Η επιλογή συνδέεται με τον <b>βιωματικό</b> χαρακτήρα του έργου, την <b>αξιοπιστία</b> της μαρτυρίας και την <b>αναβίωση των παιδικών αναμνήσεων</b>. Συνυπάρχουν δύο οπτικές: η <b>παιδική</b> (αθωότητα, απορία) και η <b>ώριμη</b> (νοσταλγία, κρίση). Αποτέλεσμα: αμεσότητα, νοσταλγική ατμόσφαιρα, συγκίνηση, συμμετοχή του αναγνώστη.</p></div>
<div class="tbox"><h4>Αφηγηματικοί τρόποι και λειτουργία</h4>
<table class="tbl nbl"><tr><th>Τρόπος</th><th>Λειτουργία στο απόσπασμα</th></tr>
<tr><td>Αφήγηση</td><td>οργανώνει την εξέλιξη των γεγονότων και των αναμνήσεων</td></tr>
<tr><td>Περιγραφή</td><td>αποδίδει παραστατικά τον μικρασιατικό χώρο, τους ανθρώπους, τα έθιμα, την καθημερινή ζωή</td></tr>
<tr><td>Διάλογος</td><td>φυσικότητα, ζωντάνια· φωτίζει τις σχέσεις ανάμεσα στα πρόσωπα</td></tr>
<tr><td>Σχόλιο</td><td>οι σκέψεις, οι αξιολογήσεις και η νοσταλγική στάση της αφηγήτριας απέναντι στο παρελθόν</td></tr></table>
<p>Όλοι μαζί δημιουργούν μια <b>αυθεντική εικόνα</b> της μικρασιατικής κοινωνίας και αναδεικνύουν την <b>ανθρώπινη διάσταση</b> του κειμένου.</p></div>
<div class="tbox thm"><h4>Μορφές ανθρώπινων σχέσεων</h4>
<p>Οικογενειακές, κοινωνικές, <b>ταξικές</b>, διαγενεακές (ενήλικες – παιδιά), σχέσεις ανάμεσα σε διαφορετικές κοινωνικές ομάδες. Το κείμενο προβάλλει αξίες (οικογενειακή συνοχή, φιλοξενία, αλληλεγγύη, σεβασμός στη διαφορετικότητα) και φαινόμενα (ταξική διάκριση, προκατάληψη, φτώχεια) — μια <b>σύνθετη εικόνα</b> της προπολεμικής μικρασιατικής κοινωνίας. Ο τίτλος του έργου δηλώνει το <b>χρέος της μνήμης</b> απέναντι σε όσους χάθηκαν.</p></div>
<div class="tbox ex"><h4>Θέμα τύπου Παγκυπρίων</h4>
<p>Να εξηγήσετε δύο λειτουργίες της πρωτοπρόσωπης αυτοδιηγητικής αφήγησης στο απόσπασμα. (4 μονάδες)</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary>
<p>(1) <b>Αμεσότητα και αξιοπιστία:</b> η αφηγήτρια μιλά για όσα έζησε η ίδια· η αφήγηση μοιάζει με προσωπική μαρτυρία για έναν κόσμο που χάθηκε. (2) <b>Νοσταλγική ατμόσφαιρα και συγκίνηση:</b> η ενήλικη γυναίκα αναπλάθει με τρυφερότητα τα παιδικά της χρόνια· ο αναγνώστης συμμετέχει συναισθηματικά, ξέροντας ότι αυτός ο κόσμος θα καταστραφεί το 1922. <i>(Τεκμηρίωσε με σημεία του αποσπάσματος.)</i></p></details></div>
<div class="tbox tip"><h4>Σύγκριση με άλλο κείμενο</h4><p>Με το «†13-12-43» (3.1): και τα δύο είναι πρωτοπρόσωπες, βιωματικές αφηγήσεις — η μία νοσταλγική για έναν χαμένο κόσμο, η άλλη πικρή για τη λήθη ενός εγκλήματος.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Γράφουν «η συγγραφέας λέει» αντί για «η αφηγήτρια». Αναφέρουν τους αφηγηματικούς τρόπους χωρίς τη <b>λειτουργία</b> τους. Μπερδεύουν το έργο με τα «Ματωμένα χώματα».</p></div>
`,
  widget: "nb2w32",
  gen: "nb2g32",
  exercises: [
    { level: 1, q: R`Σε ποιο έτος κυκλοφόρησε το μυθιστόρημα «Οι νεκροί περιμένουν»;`, fields: [{ label: "Έτος:", ans: 1959 }],
      hint: R`Ήταν το πρώτο της μυθιστόρημα, στο τέλος της δεκαετίας του 1950.`, sol: R`Το <b>1959</b>.` },
    { level: 1, q: R`Σε ποια πόλη της Μικράς Ασίας γεννήθηκε η Διδώ Σωτηρίου και διαδραματίζεται το απόσπασμα;`, fields: [{ label: "Πόλη:", ans: ["Αϊδίνι", "Αιδίνι", "Αϊδίνιο", "το Αϊδίνι"], text: true }],
      hint: R`Κοντά στη Σμύρνη, στην κοιλάδα του Μαιάνδρου.`, sol: R`Στο <b>Αϊδίνι</b>.` },
    { level: 1, type: "mc", q: R`Τι είδους αφηγητής υπάρχει στο απόσπασμα;`, options: ["Αυτοδιηγητική αφηγήτρια σε α΄ πρόσωπο", "Ετεροδιηγητικός αφηγητής σε γ΄ πρόσωπο", "Πολλαπλοί αφηγητές", "Επιστολικός αφηγητής"], correct: 0,
      hint: R`Η αφηγήτρια είναι και ηρωίδα.`, sol: R`<b>Αυτοδιηγητική</b> αφηγήτρια (πρωταγωνίστρια) σε α΄ πρόσωπο.` },
    { level: 2, type: "mc", q: R`Ποια λειτουργία έχει ο διάλογος στο απόσπασμα;`, options: ["Δίνει φυσικότητα και ζωντάνια και αναδεικνύει τις σχέσεις των προσώπων", "Επιβραδύνει για να κρυφτούν τα γεγονότα", "Εισάγει την πρόληψη", "Δείχνει ότι η αφηγήτρια δεν θυμάται"], correct: 0,
      hint: R`Πλαίσιο, δείκτης 2.`, sol: R`Ο διάλογος ζωντανεύει τα πρόσωπα και τις μεταξύ τους σχέσεις.` },
    { level: 2, type: "mc", q: R`Ποια διάθεση κυριαρχεί στην αφήγηση;`, options: ["Νοσταλγική", "Σατιρική", "Ψυχρή και ουδέτερη", "Επική-πολεμική"], correct: 0,
      hint: R`Πώς θυμάται κανείς έναν χαμένο κόσμο;`, sol: R`<b>Νοσταλγική</b>: η ενήλικη αφηγήτρια ξαναζεί με τρυφερότητα τα παιδικά της χρόνια.` },
    { level: 2, type: "mc", q: R`Ποιο κοινωνικό φαινόμενο αναδεικνύεται έντονα στο απόσπασμα;`, options: ["Οι ταξικές διακρίσεις ανάμεσα σε πλούσιους και φτωχούς", "Η βιομηχανοποίηση", "Ο αθλητισμός", "Η μετανάστευση στη Γερμανία"], correct: 0,
      hint: R`Πλαίσιο, δείκτης 3.`, sol: R`Οι <b>ταξικές αντιθέσεις</b> — μαζί με την αλληλεγγύη και τη συνύπαρξη.` },
    { level: 2, type: "mc", q: R`Ποιο ιστορικό γεγονός «σκιάζει» την ανάμνηση της αφηγήτριας;`, options: ["Η Μικρασιατική Καταστροφή του 1922", "Η εισβολή του 1974", "Η Κατοχή", "Η δικτατορία του 1967"], correct: 0,
      hint: R`Τι θα ακολουθήσει τα παιδικά της χρόνια;`, sol: R`Η <b>Καταστροφή του 1922</b> θα αφανίσει αυτόν τον κόσμο — γι' αυτό η ανάμνηση είναι τόσο νοσταλγική.` },
    { level: 3, type: "mc", q: R`Ποια πρόταση περιγράφει σωστά τη συνύπαρξη δύο οπτικών στην αφήγηση;`, options: ["Συνδυάζονται η αθώα ματιά του παιδιού που ήταν η ηρωίδα και η ώριμη, νοσταλγική ματιά της ενήλικης αφηγήτριας", "Η αφήγηση γίνεται εναλλάξ από τη μητέρα και τον πατέρα", "Η αφηγήτρια βλέπει μόνο το παρόν της Αθήνας", "Δεν υπάρχει καμία οπτική γωνία"], correct: 0,
      hint: R`Ποιος θυμάται και ποιος έζησε;`, sol: R`Η <b>ενήλικη</b> αφηγήτρια θυμάται το <b>παιδί</b> που ήταν: έτσι το κείμενο είναι και ζωντανό και στοχαστικό.` }
  ]
},
/* ───────────────────────────── 3.3 ───────────────────────────── */
{
  id: "3.3", unit: 3, title: "Γ. Φ. Πιερίδης, «Ο πορτοκαλόκηπος» — ανάλυση: Πετρής, Αρτέμης και αγώνας της ΕΟΚΑ",
  book: "ΚΚΛ Β΄, σ. 227–231 · Πλαίσιο Λογοτεχνίας Γ΄ (ΚΚ), Β΄ τετράμηνο, Κείμενο 8",
  intro: "Πώς ο πόνος ενός πατέρα γίνεται συλλογικό βίωμα; «Ο πορτοκαλόκηπος» του Πιερίδη: αφηγητής, χρόνος, ιστορικό πλαίσιο — ανάλυση για τις Παγκύπριες.",
  thumb: LETTER("Πορτοκαλόκηπος"),
  theory: R`
<div class="tbox rem"><h4>Πριν ξεκινήσεις</h4><p>Το διήγημα δεν αναπαράγεται εδώ (πνευματικά δικαιώματα). Μελέτησέ το στα <b>Κείμενα Κυπριακής Λογοτεχνίας, Β΄ τόμος (σ. 227–231)</b>.</p></div>
<div class="tbox def"><h4>Ταυτότητα</h4>
<p>Ο <b>Γιώργος Φιλίππου Πιερίδης</b> (Δάλι, 9 Αυγούστου 1904 – Δεκέμβριος 1999) είναι από τους κύριους εκπροσώπους της <b>κυπριακής πεζογραφίας</b> του 20ού αιώνα. «Ο πορτοκαλόκηπος» ανήκει στη συλλογή <b>«Σκληροί καιροί»</b> (1962). Εμπνέεται από πραγματικό γεγονός: τον θάνατο του μαθητή <b>Πετράκη Γιάλλουρου</b>, σημαιοφόρου του Ελληνικού Γυμνασίου Αμμοχώστου, που σκοτώθηκε από βρετανικά πυρά σε μαθητική διαδήλωση στην Αμμόχωστο, στις <b>7 Φεβρουαρίου 1956</b>, στη διάρκεια του <b>Απελευθερωτικού Αγώνα της ΕΟΚΑ (1955–1959)</b>. Δεν είναι όμως χρονικό: στο κέντρο βρίσκεται η μορφή του πατέρα.</p></div>
<div class="tbox"><h4>Περιεχόμενο σε συντομία</h4>
<p>Το διήγημα ξεκινά με την περιγραφή του τόπου και της ζωής των ανθρώπων της κυπριακής υπαίθρου και ανατρέχει στη ζωή του <b>Πετρή</b>: ενός λιγομίλητου, στωικού αγρότη από πατριαρχική οικογένεια, που με τα χέρια του δημιούργησε έναν <b>πορτοκαλόκηπο</b>, παντρεύτηκε και απέκτησε έναν <b>μοναχογιό</b>, τον <b>Αρτέμη</b>. Ο Αρτέμης, τελειόφοιτος του γυμνασίου, είναι το καμάρι και το όνειρο του πατέρα του. Η αφήγηση περνά γρήγορα πάνω από τα χρόνια και εστιάζει στον ξεσηκωμό της νεολαίας και στη <b>μαθητική διαδήλωση</b> όπου ο Αρτέμης σκοτώνεται. Μετά την κηδεία, ο Πετρής καταφεύγει στη φύση, στον κήπο του· η νέα μέρα και η ηρεμία της φύσης του δίνουν παρηγοριά και δύναμη να συνεχίσει.</p></div>
<div class="tbox"><h4>Αφηγητής και οργάνωση της αφήγησης</h4>
<ul><li><b>Ετεροδιηγητικός αφηγητής</b>, σε <b>γ΄ πρόσωπο</b>, με μηδενική εστίαση (παντογνώστης): δεν συμμετέχει στην ιστορία· έχει <b>ευρύτερη εποπτεία</b> των γεγονότων και γνωρίζει τον <b>εσωτερικό κόσμο</b> του Πετρή και τη σταδιακή ψυχική του μεταμόρφωση. Έτσι το προσωπικό δράμα αναδεικνύεται ως <b>συλλογικό βίωμα</b> του κυπριακού ελληνισμού.</li>
<li><b>Αφηγηματικοί τρόποι</b>: αφήγηση, περιγραφή (κυπριακή ύπαιθρος), λίγος διάλογος, μονόλογος, σχόλιο — η εναλλαγή τους δημιουργεί συγκινησιακή ένταση και συνδέει το ατομικό με το ιστορικό.</li>
<li><b>Χρόνος</b>: αναδρομή στο παρελθόν του Πετρή· <b>επιτάχυνση</b> (περίληψη πολλών χρόνων, αφηγηματικά κενά) και <b>επιβράδυνση</b> στα κρίσιμα σημεία· προϊδεασμός για το τραγικό τέλος. Η χρονική οργάνωση δείχνει την πορεία του Πετρή από την καθημερινότητα στην τραγική δοκιμασία.</li></ul></div>
<div class="tbox"><h4>Σύμβολα και πολιτισμική κληρονομιά</h4>
<table class="tbl nbl"><tr><th>Στοιχείο</th><th>Σημασία</th></tr>
<tr><td>ο πορτοκαλόκηπος</td><td>ο κόπος μιας ζωής, η σχέση με τη γη, η συνέχεια — και το καταφύγιο του πατέρα</td></tr>
<tr><td>ο Πετρής</td><td>ο στωικός Κύπριος αγρότης· η σιωπηλή αξιοπρέπεια του πόνου</td></tr>
<tr><td>ο Αρτέμης</td><td>η νεολαία που αγωνίζεται και θυσιάζεται για την ελευθερία</td></tr>
<tr><td>η νέα μέρα στη φύση</td><td>η παρηγοριά, η δύναμη της ζωής να συνεχίζεται</td></tr></table>
<p>Το διήγημα αναδεικνύει την <b>κυπριακή ύπαιθρο</b>, τη σχέση με τη γη, την οικογένεια, την ελληνική παιδεία και την αγάπη για την πατρίδα ως στοιχεία της <b>εθνικής ταυτότητας</b>.</p></div>
<div class="tbox ex"><h4>Θέμα τύπου Παγκυπρίων</h4>
<p>Να χαρακτηρίσετε τον Πετρή με δύο γνωρίσματα και να εξηγήσετε πώς η επιλογή του ετεροδιηγητικού αφηγητή βοηθά στην ανάδειξή του. (6 μονάδες)</p>
<details class="steps"><summary>Ενδεικτική απάντηση</summary>
<p><b>Γνωρίσματα:</b> (1) <b>στωικός και λιγομίλητος</b> — δεν εκδηλώνει εύκολα τα συναισθήματά του, ακόμη και στον μεγάλο πόνο· (2) <b>εργατικός και δεμένος με τη γη</b> — έφτιαξε μόνος του τον κήπο του, που είναι ολόκληρη η ζωή του. <i>(Τεκμηρίωσε με σημεία του κειμένου.)</i></p>
<p><b>Αφηγητής:</b> επειδή ο αφηγητής βρίσκεται έξω από την ιστορία και γνωρίζει τα πάντα, μπορεί να μας δείξει τον <b>εσωτερικό κόσμο</b> του Πετρή — τις σκέψεις και τον πόνο που ο ίδιος δεν λέει — και να συνδέσει το προσωπικό του δράμα με το <b>συλλογικό</b> ιστορικό γεγονός του αγώνα.</p></details></div>
<div class="tbox tip"><h4>Σύγκριση με άλλο κείμενο</h4><p>Με τον «Αποχαιρετισμό» του Ρίτσου (2.4): δύο θυσίες του αγώνα της ΕΟΚΑ — η μία από τη σκοπιά του ίδιου του αγωνιστή, η άλλη από τη σκοπιά του πατέρα που μένει πίσω.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Θεωρούν τον Αρτέμη αφηγητή ή τον Πετρή παππού του. Παρουσιάζουν το διήγημα ως «ιστορικό χρονικό» του Γιάλλουρου — το κέντρο είναι η μορφή του πατέρα.</p></div>
`,
  widget: "nb2w33",
  gen: "nb2g33",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια σχέση συνδέει τον Πετρή με τον Αρτέμη;`, options: ["Πατέρας και μοναχογιός", "Αδέρφια", "Παππούς και εγγονός", "Δάσκαλος και μαθητής"], correct: 0,
      hint: R`Ο Αρτέμης είναι τελειόφοιτος γυμνασίου.`, sol: R`Ο Αρτέμης είναι ο <b>μοναχογιός</b> του Πετρή.` },
    { level: 1, q: R`Ποιο είναι το επώνυμο του πραγματικού μαθητή του οποίου ο θάνατος ενέπνευσε το διήγημα;`, fields: [{ label: "Επώνυμο:", ans: ["Γιάλλουρος", "Πετράκης Γιάλλουρος", "Γιάλουρος", "Γιάλλουρου", "Πετράκη Γιάλλουρου", "ο Γιάλλουρος", "ο Πετράκης Γιάλλουρος"], text: true }],
      hint: R`Σημαιοφόρος του Ελληνικού Γυμνασίου Αμμοχώστου.`, sol: R`Ο <b>Πετράκης Γιάλλουρος</b> (1956).` },
    { level: 1, q: R`Σε ποιο έτος δημοσιεύτηκε η συλλογή «Σκληροί καιροί»;`, fields: [{ label: "Έτος:", ans: 1962 }],
      hint: R`Λίγα χρόνια μετά την ανεξαρτησία της Κύπρου (1960).`, sol: R`Το <b>1962</b>.` },
    { level: 2, type: "mc", q: R`Τι είδους αφηγητής υπάρχει στο διήγημα;`, options: ["Ετεροδιηγητικός, σε γ΄ πρόσωπο, παντογνώστης", "Ομοδιηγητικός, σε α΄ πρόσωπο", "Ο Αρτέμης, σε α΄ πρόσωπο", "Επιστολικός αφηγητής"], correct: 0,
      hint: R`Συμμετέχει ο αφηγητής στην ιστορία;`, sol: R`<b>Ετεροδιηγητικός</b>, τριτοπρόσωπος, με μηδενική εστίαση.` },
    { level: 2, type: "mc", q: R`Ποια χρονική τεχνική χρησιμοποιείται για να παρουσιαστούν σε λίγες γραμμές πολλά χρόνια της ζωής του Πετρή;`, options: ["Επιτάχυνση (περιληπτική απόδοση)", "Επιβράδυνση", "Πρόληψη", "Σκηνική αφήγηση σε πραγματικό χρόνο"], correct: 0,
      hint: R`Λίγος χρόνος αφήγησης για πολύ χρόνο ιστορίας.`, sol: R`<b>Επιτάχυνση:</b> τα χρόνια συμπυκνώνονται, για να φτάσουμε γρήγορα στο κρίσιμο γεγονός.` },
    { level: 2, type: "mc", q: R`Πώς χαρακτηρίζεται κυρίως ο Πετρής;`, options: ["Στωικός, λιγομίλητος, δεμένος με τη γη", "Φλύαρος και επιπόλαιος", "Αδιάφορος για την οικογένειά του", "Πλούσιος έμπορος της πόλης"], correct: 0,
      hint: R`Πώς αντιδρά στον πόνο;`, sol: R`Ο Πετρής δεν εκδηλώνει εύκολα τα συναισθήματά του· ο πόνος του φαίνεται μέσα από τη σιωπή και τη στροφή του στη φύση.` },
    { level: 2, type: "mc", q: R`Τι προσφέρει στον Πετρή η φύση στο τέλος του διηγήματος;`, options: ["Παρηγοριά και δύναμη να συνεχίσει", "Πλούτο από τη σοδειά", "Αφορμή για εκδίκηση", "Λήθη του γιου του"], correct: 0,
      hint: R`Μια νέα μέρα ξημερώνει…`, sol: R`Η ηρεμία της φύσης και η νέα μέρα δίνουν <b>παρηγοριά</b>: η ζωή συνεχίζεται.` },
    { level: 3, type: "mc", q: R`Πώς συνδέεται το προσωπικό δράμα του Πετρή με το ιστορικό πλαίσιο;`, options: ["Η απώλεια του γιου στη διαδήλωση της ΕΟΚΑ κάνει τον πόνο ενός πατέρα συλλογικό βίωμα του κυπριακού ελληνισμού στον αγώνα για την ελευθερία", "Δεν υπάρχει σύνδεση — το διήγημα είναι αμιγώς οικογενειακό", "Ο Πετρής πολεμά στον Β΄ Παγκόσμιο Πόλεμο", "Ο Αρτέμης μεταναστεύει στην Αγγλία"], correct: 0,
      hint: R`Πλαίσιο, δείκτης 5.`, sol: R`Το ιστορικό γεγονός μεταπλάθεται σε λογοτεχνία: η προσωπική δοκιμασία γίνεται <b>συλλογικό βίωμα</b> — μνήμη, εθνική συνείδηση, ελευθερία.` }
  ]
},
/* ───────────────────────────── 3.4 ───────────────────────────── */
{
  id: "3.4", unit: 3, title: "Ι. Μ. Παναγιωτόπουλος, «Αστροφεγγιά» — λογοτεχνικό βιβλίο: ήρωες, θέματα, Β3",
  book: "Λογοτεχνικό βιβλίο Γ΄ Λυκείου · Πλαίσιο Λογοτεχνίας Γ΄ (ΚΚ) · Παγκύπριες 2026, Β3",
  intro: "Ποια όνειρα σβήνουν σαν το φως των αστεριών; Η «Αστροφεγγιά» του Παναγιωτόπουλου: πρόσωπα, θέματα και η ερώτηση για το λογοτεχνικό βιβλίο στις Παγκύπριες.",
  thumb: LETTER("Αστροφεγγιά"),
  theory: R`
<div class="tbox rem"><h4>Πριν ξεκινήσεις</h4><p>Το μυθιστόρημα προστατεύεται από πνευματικά δικαιώματα· εδώ δίνουμε ανάλυση, όχι αποσπάσματα. Διάβασε ολόκληρο το βιβλίο — στις εξετάσεις δίνεται ένα απόσπασμα (ερώτηση <b>Β3, 8 μονάδες</b>).</p></div>
<div class="tbox def"><h4>Ταυτότητα</h4>
<p>Ο <b>Ι. Μ. Παναγιωτόπουλος</b> (1901–1982), πεζογράφος, ποιητής και δοκιμιογράφος της <b>Γενιάς του '30</b>, δημοσίευσε την <b>«Αστροφεγγιά»</b> το <b>1946</b>· στη μεταγενέστερη αναθεώρησή της πρόσθεσε τον υπότιτλο <b>«Η ιστορία μιας εφηβείας»</b>. Είναι <b>μυθιστόρημα διαπλάσεως</b> (ενηλικίωσης) με αυτοβιογραφικές ενδείξεις και ρεαλιστική απεικόνιση της αθηναϊκής κοινωνίας· αποτελείται από <b>δεκατέσσερα κεφάλαια</b>.</p></div>
<div class="tbox"><h4>Χώρος, χρόνος, ιστορικό πλαίσιο</h4>
<p>Η δράση διαδραματίζεται στην <b>Αθήνα</b>, περίπου στα χρόνια <b>1918–1925</b>: μετά τον Α΄ Παγκόσμιο Πόλεμο, στην περίοδο της Μικρασιατικής εκστρατείας και της <b>Καταστροφής του 1922</b>, όταν η Μεγάλη Ιδέα ματαιώνεται και η κοινωνία ζει μέσα σε κρίση, φτώχεια και πολιτικά πάθη.</p></div>
<div class="tbox"><h4>Πρόσωπα</h4>
<table class="tbl nbl"><tr><th>Πρόσωπο</th><th>Ρόλος</th></tr>
<tr><td><b>Άγγελος Γιαννούζης</b></td><td>ο πρωταγωνιστής· φτωχός, ευαίσθητος, ονειροπόλος έφηβος από επαρχιακή οικογένεια, με καλλιτεχνικές ανησυχίες· ωριμάζει μέσα από ερωτικές, κοινωνικές και ιδεολογικές απογοητεύσεις</td></tr>
<tr><td><b>Νίκος Στέργης</b></td><td>ο εύπορος συμμαθητής και φίλος του, γιος βιομηχάνου· μέσα από τη φιλία τους φαίνεται η ταξική απόσταση</td></tr>
<tr><td><b>Δάφνη</b></td><td>η κοπέλα που αγαπά κρυφά ο Άγγελος, χωρίς να τολμά να τη διεκδικήσει· ανταποκρίνεται στον Νίκο</td></tr>
<tr><td><b>Έρση</b></td><td>μέλος της παρέας, φίλη του Αγγέλου</td></tr>
<tr><td>Πασπάτης, Σκαμπαβίας κ.ά.</td><td>πρόσωπα της παρέας και του ευρύτερου περιβάλλοντος — η φτώχεια και η αρρώστια βαραίνουν πάνω σε κάποιους από αυτούς</td></tr></table></div>
<div class="tbox"><h4>Αφήγηση</h4>
<p><b>Εξωδιηγητικός-ετεροδιηγητικός, παντογνώστης αφηγητής</b>, σε <b>γ΄ πρόσωπο</b>, που εστιάζει κυρίως στις σκέψεις και στα συναισθήματα του Αγγέλου. Γλώσσα: λυρική, πλούσια δημοτική. Αναδρομές σε παιδικά χρόνια του ήρωα και σε απώλειες της οικογένειάς του.</p></div>
<div class="tbox thm"><h4>Θέματα</h4>
<ul><li>Η <b>εφηβεία</b>: τα όνειρα, οι πρώτοι έρωτες, η ντροπή, η ανασφάλεια, η αναζήτηση ταυτότητας.</li>
<li>Η <b>ταξική αντίθεση</b> φτωχών – πλουσίων και ο τρόπος που επηρεάζει τις σχέσεις.</li>
<li>Η <b>ματαίωση</b> των προσδοκιών (ατομικών και συλλογικών) και η επιθυμία φυγής· ένα γενικά μελαγχολικό κλίμα.</li>
<li>Ο <b>τίτλος</b>: το αχνό φως των αστεριών — ελπίδες της νιότης που λάμπουν, αλλά δεν φωτίζουν αρκετά και σβήνουν μία-μία.</li></ul></div>
<div class="tbox ex"><h4>Παγκύπριες 2026 — Β3 (8 μονάδες)</h4>
<p>Δόθηκε απόσπασμα από το <b>Κεφάλαιο VII</b>: η Έρση και η Δάφνη ανακαλύπτουν ένα ποίημα που κρατά ο Άγγελος· η Δάφνη τον πειράζει ότι το έγραψε ο ίδιος, επιμένει, απειλεί να το πει στην παρέα για να τον γελοιοποιήσει· ο Άγγελος πανικοβάλλεται, παρακαλά, αρνείται ότι είναι δικό του, τελικά ξεσπά εναντίον της και φεύγει απελπισμένος, έτοιμος να κλάψει.<br>
Ζητήθηκε: η <b>συμπεριφορά της Δάφνης</b> απέναντι στον Άγγελο και <b>δύο γνωρίσματα</b> του χαρακτήρα της· στη συνέχεια, <b>πώς επιδρά</b> αυτή η συμπεριφορά στον Άγγελο, με <b>δύο αναφορές</b> από το απόσπασμα.</p>
<details class="steps"><summary>Ενδεικτική απάντηση (με βάση τον οδηγό διόρθωσης, σε δική μας διατύπωση)</summary>
<p><b>Συμπεριφορά – γνωρίσματα της Δάφνης:</b> τον ρωτά περιπαιχτικά αν το ποίημα είναι δικό του και τον κοροϊδεύει (ειρωνική, χλευαστική)· απειλεί να τον εκθέσει στην παρέα (προκλητική, σκληρή)· θέλει να γελάσουν μαζί του (αναίσθητη)· επιμένει, παρά τις παρακλήσεις του (πεισματάρα, ανώριμη). Βαθμολόγηση: συμπεριφορά 2 × 1, γνωρίσματα 2 × 1.</p>
<p><b>Επίδραση στον Άγγελο:</b> νιώθει πανικό και προσπαθεί να εμποδίσει την ανάγνωση· γίνεται νευρικός και κρύβει το χαρτί· παρακαλά για να αποφύγει την ντροπή· θυμώνει και καταφεύγει στο ψέμα ότι το ποίημα είναι κάποιου φίλου· ξεσπά με προσβολή· φεύγει τρέχοντας, απελπισμένος, με δάκρυα στα μάτια. Βαθμολόγηση: επίδραση 2 × 1, τεκμηρίωση 2 × 1 <i>(με σύντομες παραθέσεις από το δοσμένο απόσπασμα)</i>.</p></details></div>
<div class="tbox tip"><h4>Πώς απαντάμε στη Β3</h4><p>Το απόσπασμα <b>δίνεται</b> στις εξετάσεις: απάντησε μέσα από αυτό, όχι από γενικές γνώσεις για το βιβλίο. Για κάθε γνώρισμα δώσε επίθετο + εξήγηση + αναφορά. Οι 8 μονάδες είναι πολλές: γράψε οργανωμένα, σε ξεχωριστές παραγράφους για κάθε υποερώτημα.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Περιγράφουν όλη την υπόθεση του μυθιστορήματος αντί να απαντήσουν στο απόσπασμα. Δίνουν γνωρίσματα χωρίς τεκμηρίωση. Μπερδεύουν τα πρόσωπα (π.χ. Έρση – Δάφνη).</p></div>
`,
  widget: "nb2w34",
  gen: "nb2g34",
  exercises: [
    { level: 1, q: R`Ποιο είναι το μικρό όνομα του πρωταγωνιστή της «Αστροφεγγιάς»;`, fields: [{ label: "Όνομα:", ans: ["Άγγελος", "ο Άγγελος", "Άγγελος Γιαννούζης"], text: true }],
      hint: R`Το επώνυμό του είναι Γιαννούζης.`, sol: R`Ο <b>Άγγελος</b> Γιαννούζης.` },
    { level: 1, q: R`Σε ποιο έτος δημοσιεύτηκε για πρώτη φορά η «Αστροφεγγιά»;`, fields: [{ label: "Έτος:", ans: 1946 }],
      hint: R`Αμέσως μετά τον Β΄ Παγκόσμιο Πόλεμο.`, sol: R`Το <b>1946</b>.` },
    { level: 1, type: "mc", q: R`Σε ποια πόλη διαδραματίζεται το μυθιστόρημα;`, options: ["Στην Αθήνα", "Στη Θεσσαλονίκη", "Στη Σμύρνη", "Στη Λευκωσία"], correct: 0,
      hint: R`Η πρωτεύουσα, μετά τον Α΄ Παγκόσμιο Πόλεμο.`, sol: R`Στην <b>Αθήνα</b>, περίπου 1918–1925.` },
    { level: 2, type: "mc", q: R`Σε ποιο είδος μυθιστορήματος εντάσσεται η «Αστροφεγγιά»;`, options: ["Μυθιστόρημα διαπλάσεως (ενηλικίωσης)", "Αστυνομικό", "Ιστορικό μυθιστόρημα για το 1821", "Επιστολικό μυθιστόρημα"], correct: 0,
      hint: R`Ο υπότιτλος μιλά για «την ιστορία μιας εφηβείας».`, sol: R`<b>Μυθιστόρημα διαπλάσεως</b>: η ωρίμανση του Αγγέλου μέσα από απογοητεύσεις.` },
    { level: 2, type: "mc", q: R`Τι είδους αφηγητής υπάρχει στο μυθιστόρημα;`, options: ["Εξωδιηγητικός-ετεροδιηγητικός, παντογνώστης, σε γ΄ πρόσωπο", "Ο Άγγελος σε α΄ πρόσωπο", "Η Δάφνη σε α΄ πρόσωπο", "Πολλοί αφηγητές με επιστολές"], correct: 0,
      hint: R`Ο αφηγητής ξέρει τις σκέψεις του ήρωα, αλλά δεν είναι πρόσωπο της ιστορίας.`, sol: R`<b>Τριτοπρόσωπος, παντογνώστης</b> αφηγητής, με εστίαση κυρίως στον Άγγελο.` },
    { level: 2, type: "mc", q: R`Ποιο κοινωνικό θέμα διατρέχει τη φιλία του Αγγέλου με τον Νίκο Στέργη;`, options: ["Η ταξική απόσταση φτωχών – πλουσίων", "Η μετανάστευση", "Ο αθλητικός ανταγωνισμός", "Η διαφορά θρησκείας"], correct: 0,
      hint: R`Ο Νίκος είναι γιος βιομηχάνου.`, sol: R`Η <b>ταξική αντίθεση</b>: ο φτωχός Άγγελος ζει ανάμεσα σε εύπορους συμμαθητές.` },
    { level: 2, type: "mc", q: R`Στο απόσπασμα των Παγκυπρίων 2026, ποια γνωρίσματα της Δάφνης δέχεται ο οδηγός διόρθωσης;`, options: ["Ειρωνική, προκλητική, σκληρή, πεισματάρα", "Τρυφερή, προστατευτική, ντροπαλή", "Αδιάφορη, σιωπηλή, φοβισμένη", "Ταπεινή, συγκαταβατική, γενναιόδωρη"], correct: 0,
      hint: R`Πώς αντιδρά στο ποίημα του Αγγέλου;`, sol: R`Η Δάφνη κοροϊδεύει, απειλεί να τον εκθέσει, επιμένει: <b>ειρωνική, προκλητική, σκληρή, ανώριμη/πεισματάρα</b>.` },
    { level: 3, type: "mc", q: R`Τι συμβολίζει ο τίτλος «Αστροφεγγιά»;`, options: ["Το αδύναμο, νυχτερινό φως των αστεριών: τα όνειρα και οι ελπίδες της εφηβείας που λάμπουν αλλά σβήνουν", "Τη λάμψη της επιτυχίας του ήρωα", "Το ενδιαφέρον του ήρωα για την αστρονομία", "Τον ήλιο της ελευθερίας"], correct: 0,
      hint: R`Αστροφεγγιά = το φως των άστρων τη νύχτα.`, sol: R`Το λιγοστό φως των άστρων γίνεται εικόνα για τις <b>ελπίδες που ματαιώνονται</b> — ατομικές και συλλογικές.` }
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

/* ================= Νέα Ελληνικά — Λογοτεχνία · Ενότητα 1: Λογοτεχνικός γραμματισμός (NB_u01) =================
   Όλα τα παραδείγματα είναι πρωτότυπα κείμενα εξάσκησης ή κείμενα που δημοσιεύτηκαν πριν από το 1929. */

(function nb1Css() {
  if (document.getElementById("nb1css")) return;
  const st = document.createElement("style"); st.id = "nb1css";
  st.textContent = `
.nb1card{background:#fffdfb;border:1px solid #ecd9d4;border-left:5px solid var(--blue);border-radius:0 12px 12px 0;padding:12px 16px;font-family:Georgia,"Times New Roman",serif;font-size:16.5px;line-height:1.65;margin:8px 0 12px}
.nb1opts{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.nb1opts button{font:inherit;font-size:14px;font-weight:700;border:1.5px solid var(--line);background:#fff;color:var(--navy);border-radius:999px;padding:7px 13px;cursor:pointer;transition:.12s}
.nb1opts button:hover{border-color:var(--blue)}
.nb1opts button.ok{background:#e8f6ee;border-color:#198754;color:#0f5132}
.nb1opts button.no{background:#fdecec;border-color:#C62828;color:#8a1c1c}
.nb1opts button.on{background:var(--blue);border-color:var(--blue);color:#fff}
.nb1fb{min-height:1.4em;font-size:14.5px;margin-top:6px}
.nb1score{font:700 12.5px "IBM Plex Mono",monospace;color:var(--muted)}
.nb1sent{display:inline;cursor:pointer;border-radius:6px;padding:1px 2px;transition:.12s;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.nb1sent:hover{outline:2px dashed #e0b4ad}
.nb1sent .nb1tag{display:inline-block;font:700 10.5px var(--sans);letter-spacing:.03em;border-radius:6px;padding:1px 6px;margin-right:4px;vertical-align:2px;color:#fff}
.nb1lg{display:flex;flex-wrap:wrap;gap:6px 12px;font-size:13px;margin:6px 0}
.nb1lg span{display:inline-flex;align-items:center;gap:5px}.nb1lg i{display:inline-block;width:12px;height:12px;border-radius:3px}
.nb1syl{display:flex;flex-wrap:wrap;align-items:flex-end;gap:2px;margin:10px 0;row-gap:12px}
.nb1s{display:flex;flex-direction:column;align-items:center;min-width:26px}
.nb1s b{font:600 16px Georgia,serif;padding:4px 6px;border-radius:7px;background:#f5eeec;color:var(--ink);cursor:pointer;white-space:nowrap}
.nb1s b.st{background:var(--blue);color:#fff}
.nb1s small{font:700 10.5px "IBM Plex Mono",monospace;color:var(--muted);margin-top:3px}
.nb1j{width:12px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#c9a7a1;font-size:13px;user-select:none}
.nb1j.m{color:var(--blue);font-weight:900}
.nb1j.w{width:16px}
.nb1tl{width:100%;overflow-x:auto}
.nb1ep{display:block;width:100%;text-align:left;font:inherit;font-size:14.5px;background:#fff;border:1.5px solid var(--line);border-radius:10px;padding:8px 10px;margin:6px 0;cursor:pointer;color:var(--ink)}
.nb1ep:hover{border-color:var(--blue)}.nb1ep.done{background:#f5eeec;border-color:#e0b4ad;cursor:default}
.nb1ep b{font:700 12px "IBM Plex Mono",monospace;color:var(--blue);margin-right:6px}
.nb1era{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin:8px 0}
.nb1era button{font:inherit;text-align:left;border:1.5px solid var(--line);background:#fff;border-radius:12px;padding:9px 11px;cursor:pointer;color:var(--navy)}
.nb1era button b{display:block;font-size:14px}.nb1era button small{color:var(--muted);font-size:12px}
.nb1era button.on{border-color:var(--blue);background:#fdf1ef}
.nb1pr{display:inline-block;font:700 10.5px var(--sans);background:var(--blue);color:#fff;border-radius:6px;padding:1px 6px;margin-left:6px;vertical-align:1px}
.nb1mx{width:100%;border-collapse:collapse;font-size:14px}
.nb1mx th,.nb1mx td{border:1px solid var(--line);padding:7px 8px;vertical-align:top;text-align:left}
.nb1mx th{background:#fdf1ef;color:var(--navy)}
.nb1mx select{width:100%;max-width:100%;font:inherit;font-size:13.5px;padding:5px;border-radius:8px;border:1px solid var(--line);background:#fff;white-space:normal}
.nb1mx td.ok{background:#eef8f2}.nb1mx td.no{background:#fdeeee}
.nb1mxw{overflow-x:auto;max-width:100%}
.nb1ta{width:100%;min-height:96px;font:16px Georgia,serif;line-height:1.6;padding:10px;border-radius:10px;border:1px solid var(--line);box-sizing:border-box}
@media (max-width:560px){.nb1mx{font-size:13px}.nb1mx th,.nb1mx td{padding:5px}}
`;
  document.head.appendChild(st);
})();

/* σταθερό σύνολο κουμπιών: ενημερώνει κείμενο/κλάσεις χωρίς να τα ξαναδημιουργεί */
function nb1Btns(cont, labels, attr) {
  while (cont.children.length < labels.length) cont.appendChild(document.createElement("button"));
  while (cont.children.length > labels.length) cont.lastChild.remove();
  [...cont.children].forEach((b, i) => { b.className = ""; b.textContent = labels[i]; if (attr) b.dataset.v = attr[i]; });
  return [...cont.children];
}
const nb1Esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const nb1Pick = a => a[Math.floor(Math.random() * a.length)];
const nb1Shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/* πολλαπλή επιλογή: σωστή + n απαντήσεις-παγίδες από τη λίστα (εκτός από όσες απαγορεύονται) */
function nb1MC(ex, right, pool, n = 3, ban = []) {
  const others = nb1Shuf(pool.filter(o => o !== right && !ban.includes(o))).slice(0, n);
  const opts = nb1Shuf([right, ...others]);
  ex.type = "mc"; ex.options = opts; ex.correct = opts.indexOf(right); return ex;
}

/* ───────────── Τράπεζα 1.1: αφηγητής (πρωτότυπα αποσπάσματα) ─────────────
   t: απόσπασμα · k: "auto" (ομοδιηγητικός-αυτοδιηγητικός, πρωταγωνιστής) | "witn" (ομοδιηγητικός-μάρτυρας/δευτερεύων) | "het" (ετεροδιηγητικός)
   p: 1 (α΄ πρόσωπο) | 3 (γ΄ πρόσωπο) · w: εξήγηση */
const NB1_NAR = [
  { t: "Εκείνο το πρωί ξύπνησα πριν από τον ήλιο. Ήξερα πως αν δεν πρόφταινα το πρώτο λεωφορείο, θα έχανα τη συνέντευξη που περίμενα δύο χρόνια.", k: "auto", p: 1, w: "Αφηγείται ο ίδιος ο ήρωας τη δική του ιστορία σε α΄ πρόσωπο (ξύπνησα, ήξερα)." },
  { t: "Ο γείτονάς μας, ο κυρ-Αντρέας, είχε ένα μανάβικο στη γωνία. Εγώ ήμουν παιδί και τον έβλεπα κάθε απόγευμα να μετρά τα κέρματα με τα χοντρά του δάχτυλα· τότε δεν ήξερα ακόμη τι βάσανα έκρυβε.", k: "witn", p: 1, w: "Ο αφηγητής («εγώ») συμμετέχει στην ιστορία, αλλά ως παρατηρητής· ο πρωταγωνιστής είναι ο κυρ-Αντρέας." },
  { t: "Η Ελένη έκλεισε το βιβλίο και κοίταξε έξω από το παράθυρο. Στον δρόμο τα παιδιά έπαιζαν μπάλα, όμως εκείνη δεν τα άκουγε· σκεφτόταν το γράμμα που δεν είχε ανοίξει ακόμη.", k: "het", p: 3, w: "Ο αφηγητής δεν συμμετέχει στην ιστορία· αφηγείται σε γ΄ πρόσωπο (έκλεισε, κοίταξε) και γνωρίζει τις σκέψεις της ηρωίδας." },
  { t: "Μου τρέμανε τα χέρια όταν άνοιξα την πόρτα του σπιτιού μας ύστερα από τόσα χρόνια. Η σκόνη είχε σκεπάσει τα έπιπλα, μα εγώ έβλεπα ακόμα τη μάνα μου να στρώνει το τραπέζι.", k: "auto", p: 1, w: "Ο ήρωας-αφηγητής μιλά για τη δική του εμπειρία σε α΄ πρόσωπο." },
  { t: "Ο Μιχάλης ήταν ο καλύτερός μου φίλος στο σχολείο. Τον θυμάμαι να στέκεται μόνος στην αυλή τη μέρα που ανακοίνωσαν πως ο πατέρας του δεν θα γύριζε από το καράβι.", k: "witn", p: 1, w: "Ο αφηγητής είναι δευτερεύον πρόσωπο (φίλος) που παρακολουθεί τη ζωή του πρωταγωνιστή Μιχάλη." },
  { t: "Στο χωριό κανείς δεν θυμόταν από πότε ο γέρο-Στάθης φύλαγε το φαράγγι. Κάθε αυγή ανέβαινε στο ξωκλήσι, άναβε το καντήλι και κατέβαινε σιωπηλός, χωρίς να μιλήσει σε κανέναν.", k: "het", p: 3, w: "Ο αφηγητής βρίσκεται έξω από την ιστορία και αφηγείται σε γ΄ πρόσωπο." },
  { t: "Ήμουν δεκαέξι χρονών όταν αποφάσισα να φύγω από το νησί. Κανείς δεν με σταμάτησε· ίσως γιατί κανείς δεν πίστευε πως θα το έκανα στ' αλήθεια.", k: "auto", p: 1, w: "Πρωτοπρόσωπη αφήγηση από τον ίδιο τον πρωταγωνιστή." },
  { t: "Οι δύο αδελφοί δεν μιλιούνταν εδώ και δέκα χρόνια. Ο μεγάλος καλλιεργούσε το κτήμα στον κάμπο, ο μικρός είχε ανοίξει καφενείο στην πόλη· και οι δύο όμως, κάθε Πάσχα, κοίταζαν προς το πατρικό.", k: "het", p: 3, w: "Ετεροδιηγητικός αφηγητής, γ΄ πρόσωπο· δεν είναι κανένα από τα πρόσωπα της ιστορίας." },
  { t: "Τη γιαγιά μου την έλεγαν όλοι «η δασκάλα», παρόλο που δεν πάτησε ποτέ σε σχολείο. Εγώ καθόμουν δίπλα της στο πεζούλι και άκουγα τις ιστορίες της, χωρίς να ξέρω πόσα από αυτά τα παραμύθια τα είχε ζήσει η ίδια.", k: "witn", p: 1, w: "Ο εγγονός-αφηγητής συμμετέχει ως ακροατής και μάρτυρας· κεντρικό πρόσωπο είναι η γιαγιά." },
  { t: "Ο σταθμάρχης κοίταξε το ρολόι για πολλοστή φορά. Το τρένο αργούσε μία ώρα, και ο κόσμος στην αποβάθρα άρχιζε να ψιθυρίζει πως κάτι κακό είχε συμβεί στη γέφυρα.", k: "het", p: 3, w: "Τριτοπρόσωπη αφήγηση από αφηγητή που δεν μετέχει στα γεγονότα." },
  { t: "Δεν ξέρω γιατί σας τα γράφω όλα αυτά. Ίσως γιατί, αν δεν τα γράψω, θα αρχίσω να πιστεύω πως δεν συνέβησαν ποτέ — πως δεν περπάτησα εγώ εκείνη τη νύχτα μέσα στο χιόνι.", k: "auto", p: 1, w: "Ο αφηγητής είναι ο ίδιος ο ήρωας των γεγονότων («δεν περπάτησα εγώ»)." },
  { t: "Ο λοχαγός μας ήταν αυστηρός, μα δίκαιος. Τον είδα με τα μάτια μου να δίνει τη μοναδική του κουβέρτα σε έναν τραυματία, ενώ εμείς τρέμαμε από το κρύο.", k: "witn", p: 1, w: "Ο αφηγητής ανήκει στην ιστορία (στρατιώτης) αλλά αφηγείται κυρίως για τον λοχαγό: αυτόπτης μάρτυρας." },
  { t: "Η βροχή έπεφτε τρεις μέρες ασταμάτητα. Η κυρα-Λένη μάζευε τα σκεύη της κουζίνας κάτω από τις τρύπες της στέγης και μουρμούριζε προσευχές, ενώ ο άντρας της κοιμόταν αμέριμνος.", k: "het", p: 3, w: "Ετεροδιηγητικός αφηγητής σε γ΄ πρόσωπο." },
  { t: "Όταν μπήκα στην αίθουσα των εξετάσεων, η καρδιά μου χτυπούσε τόσο δυνατά, που φοβήθηκα πως θα την άκουγαν όλοι. Κάθισα στο τρίτο θρανίο και κοίταξα το λευκό χαρτί.", k: "auto", p: 1, w: "Ο ήρωας αφηγείται τη δική του εμπειρία σε α΄ πρόσωπο." },
  { t: "Τον Γιάννη τον γνώρισα στο καράβι για τη Μασσαλία. Μιλούσε ελάχιστα, αλλά κάθε βράδυ ανέβαινε στο κατάστρωμα και τραγουδούσε σιγανά ένα τραγούδι της πατρίδας του. Εκείνο το ταξίδι άλλαξε τη ζωή του — όχι τη δική μου.", k: "witn", p: 1, w: "Ο αφηγητής δηλώνει ότι η ιστορία αφορά τον Γιάννη· εκείνος είναι απλός μάρτυρας («όχι τη δική μου»)." },
  { t: "Κανείς στο χωριό δεν ήξερε ότι η μικρή Άννα έγραφε ποιήματα. Τα έκρυβε κάτω από το στρώμα της και τα διάβαζε μόνο στα κατσίκια, όταν τα έβγαζε για βοσκή.", k: "het", p: 3, w: "Ο αφηγητής γνωρίζει τα μυστικά της ηρωίδας χωρίς να συμμετέχει: ετεροδιηγητικός, γ΄ πρόσωπο." },
  { t: "Θυμάμαι ακόμα τη μυρωδιά της βροχής τη μέρα που έφυγα από το σπίτι. Πήρα μόνο μια τσάντα κι ένα βιβλίο, και δεν γύρισα να κοιτάξω πίσω.", k: "auto", p: 1, w: "Αυτοδιηγητικός αφηγητής: ο ίδιος ο πρωταγωνιστής." },
  { t: "Ο μπαρμπα-Κώστας, ο βαρκάρης, είχε μια φωνή σαν βροντή. Εμείς τα παιδιά της γειτονιάς τρέχαμε στο μόλο να τον δούμε να δένει τη βάρκα του και να μας πετά από ένα φρέσκο ψάρι.", k: "witn", p: 1, w: "Ο αφηγητής (ένα από «εμάς τα παιδιά») περιγράφει τον μπαρμπα-Κώστα: ομοδιηγητικός μάρτυρας." },
  { t: "Η πόλη ξύπνησε με τον ήχο από τις σειρήνες. Οι άνθρωποι βγήκαν στα μπαλκόνια μισοντυμένοι, κοιτάζοντας τον καπνό που ανέβαινε πάνω από το λιμάνι.", k: "het", p: 3, w: "Αφηγητής εκτός ιστορίας· γ΄ πρόσωπο." },
  { t: "Σαράντα χρόνια δούλεψα στο ορυχείο. Τα χέρια μου ξέρουν το σκοτάδι καλύτερα απ' ό,τι το φως, και τα πνευμόνια μου θυμούνται κάθε στοά.", k: "auto", p: 1, w: "Ο ήρωας μιλά για τη δική του ζωή: ομοδιηγητικός-αυτοδιηγητικός." },
  { t: "Η θεία Ρήνη ερχόταν κάθε Κυριακή με ένα ταψί γλυκό. Εγώ στεκόμουν στο παράθυρο και την περίμενα, μα εκείνη πάντα πρώτα κοίταζε το παλιό σπίτι απέναντι, εκεί όπου είχε ζήσει τον πρώτο της έρωτα.", k: "witn", p: 1, w: "Το παιδί-αφηγητής παρατηρεί τη θεία, που είναι το κεντρικό πρόσωπο." },
  { t: "Ο καθηγητής άφησε την κιμωλία στην έδρα και σώπασε. Οι μαθητές κατάλαβαν αμέσως πως δεν θα έκανε μάθημα εκείνη τη μέρα· κάτι στο βλέμμα του ήταν διαφορετικό.", k: "het", p: 3, w: "Ετεροδιηγητικός αφηγητής, γ΄ πρόσωπο." },
  { t: "Ποτέ δεν μου άρεσαν τα αποχαιρετιστήρια. Γι' αυτό, όταν ήρθε η ώρα να φύγω από την Αμμόχωστο, κλείδωσα την πόρτα σαν να επρόκειτο να γυρίσω το βράδυ.", k: "auto", p: 1, w: "Ο ήρωας αφηγείται το δικό του βίωμα σε α΄ πρόσωπο." },
  { t: "Ο Νίκος και η Μαρία παντρεύτηκαν ένα ζεστό Αύγουστο, κάτω από τη μουριά της πλατείας. Όλο το χωριό χόρεψε ως το πρωί, κι ο γέρο-παπάς έκλαιγε από χαρά.", k: "het", p: 3, w: "Γ΄ πρόσωπο, ο αφηγητής δεν παίρνει μέρος στην ιστορία." },
  { t: "Ο αδελφός μου έφυγε για τον πόλεμο ένα πρωί του Οκτώβρη. Εγώ ήμουν οκτώ χρονών· κρατούσα το χέρι της μάνας μας και κοίταζα τις στρατιωτικές του μπότες να χάνονται στη στροφή.", k: "witn", p: 1, w: "Το παιδί-αφηγητής παρακολουθεί την ιστορία του αδελφού του (κεντρικό πρόσωπο)." },
  { t: "Εκείνη την άνοιξη αποφάσισα να μάθω να ζωγραφίζω. Αγόρασα μπογιές, πινέλα, έναν καμβά — κι έμεινα τρεις εβδομάδες να κοιτάζω το λευκό του, χωρίς να τολμώ να τον αγγίξω.", k: "auto", p: 1, w: "Ο ίδιος ο πρωταγωνιστής αφηγείται σε α΄ πρόσωπο." },
  { t: "Το καράβι έφτασε στο λιμάνι με δύο ώρες καθυστέρηση. Ανάμεσα στους επιβάτες κατέβηκε ένας ψηλός άντρας με ένα παλιό καπέλο, που κανείς δεν αναγνώρισε — εκτός από τη γυναίκα που πουλούσε κουλούρια στην προκυμαία.", k: "het", p: 3, w: "Ετεροδιηγητικός αφηγητής που βλέπει «από ψηλά» όλη τη σκηνή." },
  { t: "Ο δάσκαλός μου στο Γυμνάσιο ήταν ποιητής, κι εμείς δεν το ξέραμε. Το έμαθα χρόνια αργότερα, όταν βρήκα το όνομά του σε μια παλιά ανθολογία, κάτω από ένα ποίημα για τη θάλασσα της Κερύνειας.", k: "witn", p: 1, w: "Ο αφηγητής (μαθητής του) αφηγείται για τον δάσκαλο, το κεντρικό πρόσωπο." },
  { t: "Κάθε φορά που περνώ μπροστά από το παλιό σινεμά, σταματώ. Εκεί είδα την πρώτη μου ταινία, εκεί έδωσα το πρώτο μου φιλί, εκεί έμαθα πως τα όνειρα κρατούν δύο ώρες.", k: "auto", p: 1, w: "Πρωτοπρόσωπη αφήγηση του ήρωα για τη δική του ζωή." },
  { t: "Ο γιατρός του χωριού δεν έπαιρνε ποτέ χρήματα από τους φτωχούς. Οι χωρικοί τού άφηναν στο κατώφλι αυγά, λάδι και ψωμί, και εκείνος έκανε πως δεν καταλάβαινε ποιος τα έφερνε.", k: "het", p: 3, w: "Γ΄ πρόσωπο· ο αφηγητής δεν είναι πρόσωπο της ιστορίας." }
];
const NB1_KNAME = { auto: "Ομοδιηγητικός – αυτοδιηγητικός (πρωταγωνιστής)", witn: "Ομοδιηγητικός – μάρτυρας / δευτερεύον πρόσωπο", het: "Ετεροδιηγητικός (εκτός ιστορίας)" };

/* ───────────── Τράπεζα 1.2: αφηγηματικοί τρόποι & απόδοση λόγου ───────────── */
const NB1_MODES = ["Αφήγηση", "Περιγραφή", "Διάλογος", "Εσωτερικός μονόλογος", "Σχόλιο"];
const NB1_MODE = [
  { t: "Το πρωί της Δευτέρας ο Λευτέρης φόρτωσε τα σακιά στο κάρο, χαιρέτησε τη γυναίκα του και ξεκίνησε για την πόλη.", a: "Αφήγηση", w: "Παρουσιάζονται διαδοχικές πράξεις (φόρτωσε, χαιρέτησε, ξεκίνησε): εξέλιξη της δράσης." },
  { t: "Η κάμαρα ήταν μικρή και χαμηλοτάβανη· ένα σιδερένιο κρεβάτι, μια καρέκλα με σπασμένο πόδι κι ένα εικόνισμα που το φώτιζε ένα τρεμάμενο καντήλι.", a: "Περιγραφή", w: "Παρουσιάζεται ο χώρος, με στατικά στοιχεία· η δράση σταματά." },
  { t: "— Θα γυρίσεις; ρώτησε η μάνα.\n— Μόλις τελειώσει ο χειμώνας, απάντησε εκείνος χωρίς να την κοιτάξει.", a: "Διάλογος", w: "Ευθύς λόγος δύο προσώπων με παύλες: διάλογος." },
  { t: "Κι αν δεν έρθει; Κι αν όλα αυτά τα χρόνια περίμενα κάποιον που δεν υπήρξε ποτέ; Όχι, θα έρθει· πρέπει να έρθει…", a: "Εσωτερικός μονόλογος", w: "Οι σκέψεις της ηρωίδας αποδίδονται άμεσα, ασύνδετα, με ερωτήσεις και αποσιωπητικά, όπως γεννιούνται στο μυαλό της." },
  { t: "Έτσι είναι οι άνθρωποι: θυμούνται τις πληγές τους πιο εύκολα απ' ό,τι τις χαρές τους.", a: "Σχόλιο", w: "Ο αφηγητής διακόπτει την ιστορία για να διατυπώσει μια γενική κρίση." },
  { t: "Ο Πέτρος πήδηξε από τη βάρκα, έτρεξε στην ακτή και σήκωσε στα χέρια του το παιδί που έκλαιγε.", a: "Αφήγηση", w: "Γρήγορη διαδοχή πράξεων — εξέλιξη της δράσης." },
  { t: "Ο κάμπος απλωνόταν ως τα βουνά, χρυσός από τα σιτάρια· εδώ κι εκεί μια ελιά, ασημένια στο φως του μεσημεριού.", a: "Περιγραφή", w: "Περιγράφεται το τοπίο με χρώματα και εικόνες." },
  { t: "— Πού ήσουν όλη νύχτα;\n— Στο λιμάνι. Περίμενα το καράβι.\n— Και ήρθε;\n— Όχι.", a: "Διάλογος", w: "Στιχομυθία σε ευθύ λόγο." },
  { t: "Τι γυρεύω εδώ; Ποιος με ξέρει πια σ' αυτούς τους δρόμους; Ο φούρνος έκλεισε, ο δάσκαλος πέθανε, κι εγώ… εγώ ποιος είμαι;", a: "Εσωτερικός μονόλογος", w: "Η συνείδηση του ήρωα «μιλά» άμεσα: ερωτήματα, αποσπασματικότητα, α΄ πρόσωπο." },
  { t: "Δεν υπάρχει πιο βαριά σιωπή από τη σιωπή ενός σπιτιού που άδειασε.", a: "Σχόλιο", w: "Γενική, στοχαστική παρατήρηση του αφηγητή." },
  { t: "Η γυναίκα ήταν ψηλή και λιγνή, με μαλλιά που είχαν ασπρίσει πρόωρα και μάτια μαύρα, βαθιά, σαν να έκρυβαν πηγάδια.", a: "Περιγραφή", w: "Πορτρέτο προσώπου: εξωτερικά χαρακτηριστικά." },
  { t: "Τα χρόνια πέρασαν· ο Αντώνης παντρεύτηκε, έκανε τρία παιδιά, έχτισε σπίτι στην άκρη του χωριού.", a: "Αφήγηση", w: "Διαδοχή γεγονότων (με επιτάχυνση του χρόνου)." },
  { t: "— Δεν φοβάσαι; της είπε.\n— Φοβάμαι, μα θα πάω.", a: "Διάλογος", w: "Λόγος των προσώπων σε ευθύ λόγο." },
  { t: "Πρέπει να του το πω. Αύριο. Όχι, σήμερα. Αν περιμένω κι άλλο, δεν θα βρω ποτέ το θάρρος…", a: "Εσωτερικός μονόλογος", w: "Οι σκέψεις του ήρωα αποδίδονται χωρίς τη μεσολάβηση του αφηγητή." },
  { t: "Ίσως αυτή να είναι η μοίρα των νησιωτών: να αγαπούν τη θάλασσα που τους παίρνει τα παιδιά.", a: "Σχόλιο", w: "Ο αφηγητής ερμηνεύει και γενικεύει, πέρα από τη δράση." },
  { t: "Ο σιδεράς χτυπούσε το πυρωμένο σίδερο, το βουτούσε στο νερό και το ξαναχτυπούσε, ώσπου πήρε τη μορφή πετάλου.", a: "Αφήγηση", w: "Εξέλιξη πράξεων στον χρόνο." },
  { t: "Στο βάθος του δρόμου στεκόταν ένα παλιό αρχοντικό με ξεθωριασμένα παντζούρια και μια σιδερένια πόρτα που την είχε φάει η σκουριά.", a: "Περιγραφή", w: "Περιγραφή χώρου/κτηρίου." },
  { t: "Κανείς δεν μπορεί να ξεφύγει από το παρελθόν του· το κουβαλά όπως η χελώνα το καβούκι της.", a: "Σχόλιο", w: "Σχόλιο του αφηγητή με γενικό, διαχρονικό χαρακτήρα." },
  { t: "— Μάνα, πεινάω.\n— Κάνε υπομονή, παιδί μου. Αύριο θα έχουμε ψωμί.", a: "Διάλογος", w: "Ευθύς λόγος σε διαλογική μορφή." },
  { t: "Γιατί δεν μου απάντησε; Μήπως θύμωσε; Μήπως δεν πήρε ποτέ το γράμμα; Ή μήπως το πήρε και απλώς… δεν νοιάζεται;", a: "Εσωτερικός μονόλογος", w: "Διαδοχικά ερωτήματα στη συνείδηση της ηρωίδας." },
  { t: "Η Μαρία ξεκλείδωσε το μαγαζί, σήκωσε τα ρολά, άναψε τα φώτα και έστησε τα καλάθια με τα φρούτα στο πεζοδρόμιο.", a: "Αφήγηση", w: "Διαδοχικές πράξεις που προωθούν τη δράση." },
  { t: "Ο γέρος είχε πρόσωπο αυλακωμένο σαν όργωμα, χέρια ροζιασμένα και μια φωνή βραχνή, που θύμιζε πόρτα που τρίζει.", a: "Περιγραφή", w: "Πορτρέτο του προσώπου με εικόνες και παρομοιώσεις· η δράση σταματά." },
  { t: "— Θα μου γράφεις;\n— Κάθε εβδομάδα.\n— Ορκίσου.\n— Ορκίζομαι.", a: "Διάλογος", w: "Σύντομη στιχομυθία σε ευθύ λόγο." },
  { t: "Να φύγω ή να μείνω; Αν φύγω, θα με κατηγορήσουν. Αν μείνω, θα με λυπούνται. Θεέ μου, τι να κάνω…", a: "Εσωτερικός μονόλογος", w: "Το δίλημμα του ήρωα αποδίδεται άμεσα, όπως διατυπώνεται στη σκέψη του." },
  { t: "Όσοι μεγάλωσαν σε νησί ξέρουν πως η θάλασσα δεν είναι ποτέ η ίδια δύο μέρες στη σειρά.", a: "Σχόλιο", w: "Γενίκευση του αφηγητή, έξω από τη συγκεκριμένη δράση." },
  { t: "Το τρένο σταμάτησε απότομα· οι επιβάτες σηκώθηκαν, κάποιος άνοιξε το παράθυρο κι ένας ελεγκτής πέρασε τρέχοντας τον διάδρομο.", a: "Αφήγηση", w: "Γρήγορη διαδοχή γεγονότων." },
  { t: "Η αυλή ήταν στρωμένη με βότσαλα, άσπρα και μαύρα, που σχημάτιζαν ένα αστέρι· στη μέση, μια λεμονιά έριχνε τη σκιά της πάνω στο πηγάδι.", a: "Περιγραφή", w: "Περιγραφή χώρου με οπτικές εικόνες." },
  { t: "— Ποιος είναι εκεί; φώναξε ο φύλακας.\n— Φίλος, απάντησε μια φωνή από το σκοτάδι.", a: "Διάλογος", w: "Τα πρόσωπα μιλούν σε ευθύ λόγο, με παύλες." },
  { t: "Δεν θα κλάψω. Όχι μπροστά τους. Θα σφίξω τα δόντια και θα χαμογελάσω, όπως μου έμαθε ο πατέρας…", a: "Εσωτερικός μονόλογος", w: "Οι σκέψεις της ηρωίδας σε α΄ πρόσωπο, με κοφτές προτάσεις και αποσιωπητικά." },
  { t: "Ο πόλεμος δεν τελειώνει όταν σωπάσουν τα όπλα· τελειώνει πολύ αργότερα, όταν πεθάνει και ο τελευταίος που τον θυμάται.", a: "Σχόλιο", w: "Στοχαστική, γενική κρίση του αφηγητή." }
];
const NB1_SPEECH = [
  { t: "Ο πατέρας είπε: «Αύριο φεύγουμε για το βουνό».", a: "Ευθύς λόγος", w: "Τα λόγια αποδίδονται αυτούσια, μέσα σε εισαγωγικά." },
  { t: "Ο πατέρας είπε ότι την επομένη θα έφευγαν για το βουνό.", a: "Πλάγιος λόγος", w: "Τα λόγια μεταφέρονται από τον αφηγητή με δευτερεύουσα πρόταση («ότι…»), με αλλαγή χρόνου και προσώπου." },
  { t: "— Δεν θα σε αφήσω μόνη, ψιθύρισε.", a: "Ευθύς λόγος", w: "Αυτούσια λόγια του προσώπου με παύλα." },
  { t: "Της ψιθύρισε πως δεν θα την άφηνε μόνη.", a: "Πλάγιος λόγος", w: "Μεταφορά των λόγων με «πως» και γ΄ πρόσωπο." },
  { t: "Η δασκάλα ρώτησε τα παιδιά αν είχαν διαβάσει το ποίημα.", a: "Πλάγιος λόγος", w: "Πλάγια ερώτηση με «αν»." },
  { t: "«Διαβάσατε το ποίημα;» ρώτησε η δασκάλα.", a: "Ευθύς λόγος", w: "Ευθεία ερώτηση μέσα σε εισαγωγικά." }
];

/* ───────────── Τράπεζα 1.3: χρόνος της αφήγησης ───────────── */
const NB1_TIMES = ["Αναδρομή", "Πρόληψη (προοικονομία)", "Επιτάχυνση", "Επιβράδυνση", "In medias res", "Επανάληψη"];
const NB1_TIME = [
  { t: "Καθώς κοίταζε τη θάλασσα, θυμήθηκε το καλοκαίρι που, παιδί ακόμα, είχε πρωτοβουτήξει από τον βράχο με τον πατέρα του.", a: "Αναδρομή", w: "Η αφήγηση γυρίζει σε γεγονός που προηγήθηκε της κύριας δράσης." },
  { t: "Δεν ήξερε τότε πως εκείνο το γράμμα θα ήταν το τελευταίο που θα έπαιρνε από τον αδελφό του.", a: "Πρόληψη (προοικονομία)", w: "Προαναγγέλλεται γεγονός που θα συμβεί αργότερα." },
  { t: "Πέρασαν δέκα χρόνια. Το χωριό άδειασε, το σχολείο έκλεισε, κι ο Θανάσης έμεινε μόνος με τα πρόβατά του.", a: "Επιτάχυνση", w: "Μια μεγάλη χρονική περίοδος αποδίδεται συνοπτικά, σε λίγες φράσεις." },
  { t: "Το χέρι του σταμάτησε στο πόμολο. Ένιωσε το κρύο του μέταλλο, άκουσε το ρολόι του διαδρόμου να χτυπά, μύρισε τη γνώριμη μυρωδιά του σαπουνιού, κοίταξε τη ραγισμένη μπογιά της πόρτας — και ακόμη δεν την άνοιγε.", a: "Επιβράδυνση", w: "Λίγα δευτερόλεπτα της ιστορίας απλώνονται σε πολλές λεπτομέρειες: η εξέλιξη καθυστερεί." },
  { t: "Η αρχή του διηγήματος: «Πυροβόλησαν!» φώναξε κάποιος, και όλοι έπεσαν στο χώμα.", a: "In medias res", w: "Η αφήγηση αρχίζει από τη μέση της δράσης, χωρίς εισαγωγή." },
  { t: "Κάθε βράδυ η ίδια σκηνή: η μάνα άναβε το καντήλι, κοίταζε τη φωτογραφία, σταύρωνε το παράθυρο. Κάθε βράδυ, για είκοσι χρόνια.", a: "Επανάληψη", w: "Αφηγείται μία φορά κάτι που συνέβαινε επανειλημμένα (ή επανέρχεται το ίδιο γεγονός)." },
  { t: "Είχε γεννηθεί σε ένα χωριό της Μεσαορίας, σε μια χρονιά ξηρασίας· η μάνα του έλεγε πως τον γέννησε την ώρα που έπεφτε η πρώτη βροχή.", a: "Αναδρομή", w: "Επιστροφή σε παλαιότερα γεγονότα (γέννηση του ήρωα)." },
  { t: "Αργότερα, πολύ αργότερα, θα καταλάβαινε πως εκείνο το καλοκαίρι είχε τελειώσει η παιδική του ηλικία.", a: "Πρόληψη (προοικονομία)", w: "Ο αφηγητής προλέγει μια μελλοντική συνειδητοποίηση." },
  { t: "Ο πόλεμος κράτησε τέσσερα χρόνια. Όταν γύρισε, κανείς δεν τον αναγνώρισε.", a: "Επιτάχυνση", w: "Τα τέσσερα χρόνια του πολέμου προσπερνιούνται σε μία φράση." },
  { t: "Τη στιγμή που έπεφτε το ποτήρι, πρόσεξε το φως να σπάει πάνω στο γυαλί, το κόκκινο κρασί να αργοκυλά σαν σταγόνες αίματος, τα πρόσωπα των καλεσμένων να παγώνουν ένα ένα.", a: "Επιβράδυνση", w: "Μια στιγμιαία πράξη «παγώνει» με εκτενή περιγραφή." },
  { t: "Η πρώτη φράση του διηγήματος: «Το σπίτι καιγόταν ήδη όταν η Μαρίνα ξύπνησε».", a: "In medias res", w: "Η ιστορία ξεκινά στην κορύφωση της δράσης." },
  { t: "Και πάλι εκείνο το όνειρο: ο σταθμός, το τρένο που φεύγει, η φωνή που τον καλεί και δεν προλαβαίνει να γυρίσει.", a: "Επανάληψη", w: "Το ίδιο γεγονός (όνειρο) αφηγείται/επανέρχεται πολλές φορές." },
  { t: "Ήταν δεν ήταν οχτώ χρονών όταν πρωτοείδε τη θάλασσα· ο θείος του τον είχε πάρει μαζί του στο λιμάνι της Λεμεσού με το φορτηγό.", a: "Αναδρομή", w: "Η αφήγηση επιστρέφει στην παιδική ηλικία του ήρωα." },
  { t: "Ο Σταύρος δεν θα ξαναέβλεπε ποτέ το νησί του. Εκείνο το πρωί όμως, καθώς έδενε τα σκοινιά, σφύριζε ανέμελα.", a: "Πρόληψη (προοικονομία)", w: "Προαναγγέλλεται το μελλοντικό τέλος της ιστορίας." },
  { t: "Τον χειμώνα δούλεψε στα λιμάνια, την άνοιξη στα χωράφια, το καλοκαίρι πουλούσε καρπούζια. Έτσι πέρασε η πρώτη χρονιά του στην πόλη.", a: "Επιτάχυνση", w: "Μια ολόκληρη χρονιά συνοψίζεται σε τρεις φράσεις." },
  { t: "Πριν απαντήσει, άφησε το βλέμμα του να περιπλανηθεί στο δωμάτιο: στα βιβλία με τις σκονισμένες ράχες, στο παλιό γραμμόφωνο, στην κουρτίνα που ανέμιζε, στη ρωγμή του ταβανιού που θύμιζε ποτάμι σε χάρτη.", a: "Επιβράδυνση", w: "Η περιγραφή καθυστερεί την απάντηση και άρα την εξέλιξη της δράσης." },
  { x: ["Αναδρομή"], t: "Το διήγημα ανοίγει με τον ήρωα δεμένο σε μια καρέκλα, σε ένα σκοτεινό υπόγειο. Μόνο στις επόμενες σελίδες μαθαίνουμε ποιος είναι και πώς βρέθηκε εκεί.", a: "In medias res", w: "Έναρξη από τη μέση των γεγονότων· τα προηγούμενα θα δοθούν μετά (συνήθως με αναδρομή)." },
  { t: "Κάθε Σάββατο ο παππούς ντυνόταν με το καλό του κοστούμι και κατέβαινε στο καφενείο. Κάθε Σάββατο έπαιζε την ίδια παρτίδα τάβλι με τον ίδιο φίλο, και κάθε Σάββατο έχανε.", a: "Επανάληψη", w: "Επαναλαμβανόμενα γεγονότα αφηγούνται μία φορά, με την επανάληψη «κάθε Σάββατο»." },
  { t: "Της θύμισε τη νύχτα που γνωρίστηκαν, στη γιορτή του χωριού, όταν εκείνη είχε σκίσει το φόρεμά της στον χορό.", a: "Αναδρομή", w: "Επιστροφή στο παρελθόν μέσω της ανάμνησης." },
  { t: "Αυτή η απόφαση, όπως θα φανεί, θα του κόστιζε ακριβά.", a: "Πρόληψη (προοικονομία)", w: "Ο αφηγητής προειδοποιεί για τις μελλοντικές συνέπειες." },
  { t: "Σε έναν μήνα ο Αλέξης είχε μάθει να διαβάζει, σε δύο να γράφει, και στο τέλος της χρονιάς απάγγελλε ολόκληρα ποιήματα.", a: "Επιτάχυνση", w: "Ταχεία, συνοπτική παρουσίαση μιας μακράς περιόδου." },
  { t: "Το πρώτο κεφάλαιο ξεκινά τη στιγμή που ο ήρωας πηδά από το παράθυρο της φυλακής.", a: "In medias res", w: "Η δράση ξεκινά στο πιο έντονο σημείο της." },
  { t: "Για τρίτη φορά εκείνη τη νύχτα άκουσε τα βήματα στη σκάλα. Για τρίτη φορά σηκώθηκε, άνοιξε την πόρτα, και για τρίτη φορά δεν βρήκε κανέναν.", a: "Επανάληψη", w: "Το ίδιο περιστατικό επαναλαμβάνεται και αφηγείται με επανάληψη." },
  { t: "Όταν μπήκε στο μαγαζί, του ήρθε στο μυαλό η πρώτη μέρα που ο πατέρας του τον είχε αφήσει εκεί για να μάθει την τέχνη.", a: "Αναδρομή", w: "Η αφήγηση επιστρέφει σε προγενέστερο γεγονός." },
  { t: "Ακόμη δεν το ήξεραν, αλλά εκείνο το δέντρο που φύτεψαν μαζί θα ζούσε περισσότερο κι από τους δύο.", a: "Πρόληψη (προοικονομία)", w: "Προαναγγελία μελλοντικού γεγονότος." },
  { t: "Τα χρόνια της Κατοχής πέρασαν με πείνα και φόβο. Το 1945 η οικογένεια ήταν πάλι μαζί — όσοι είχαν απομείνει.", a: "Επιτάχυνση", w: "Πολλά χρόνια συμπυκνώνονται σε δύο προτάσεις." },
  { x: ["Αναδρομή"], t: "Το μαχαίρι σηκώθηκε. Εκείνη τη στιγμή, που κράτησε όσο μια ανάσα, η γυναίκα είδε όλη της τη ζωή: το πατρικό, τον γάμο, τα παιδιά της να παίζουν στην αυλή, το χαμόγελο του άντρα της…", a: "Επιβράδυνση", w: "Ελάχιστος χρόνος της ιστορίας → μεγάλη έκταση στο κείμενο." },
  { t: "Το βράδυ εκείνο, ενώ μάζευε τα πιάτα, η Ρένα θυμήθηκε τη μέρα που είχε φτάσει στο σπίτι αυτό νύφη, με μια βαλίτσα κι ένα κλουβί με καναρίνι.", a: "Αναδρομή", w: "Η ανάμνηση (θυμήθηκε, είχε φτάσει) μας γυρίζει σε γεγονός πριν από τη στιγμή της αφήγησης." },
  { t: "Δύο χειμώνες και ένα καλοκαίρι έλειψε ο Μάρκος στα καράβια· όταν ξαναπάτησε στο νησί, τα παιδιά του δεν τον γνώρισαν.", a: "Επιτάχυνση", w: "Ένα διάστημα σχεδόν δύο ετών αποδίδεται σε μία φράση." },
  { t: "Το μυθιστόρημα αρχίζει τη στιγμή που ο ήρωας τρέχει στην προκυμαία να προλάβει το τελευταίο καράβι, με δύο χωροφύλακες στο κατόπι του.", a: "In medias res", w: "Η αφήγηση ξεκινά στο πιο έντονο σημείο της δράσης, χωρίς εισαγωγή." }
];

/* ───────────── Τράπεζα 1.4: εκφραστικά μέσα (πρωτότυπα παραδείγματα) ─────────────
   x: άλλα σχήματα που υπάρχουν επίσης στη φράση (δεν μπαίνουν ως λάθος επιλογές) */
const NB1_FIGS = ["Μεταφορά", "Παρομοίωση", "Προσωποποίηση", "Αντίθεση", "Υπερβολή", "Επανάληψη", "Ασύνδετο σχήμα", "Πολυσύνδετο σχήμα", "Ρητορικό ερώτημα", "Ειρωνεία", "Παρήχηση", "Κοσμητικά επίθετα", "Εικόνα", "Σχήμα αδυνάτου", "Σχήμα των τριών", "Σχήμα κύκλου", "Αλληγορία", "Οξύμωρο", "Σύμβολο"];
const NB1_FIG = [
  { t: "Η καρδιά της ήταν ένα κλειστό παράθυρο.", a: "Μεταφορά", w: "Η καρδιά ταυτίζεται χωρίς συγκριτικό μόριο με ένα «κλειστό παράθυρο»: δηλώνει τη συναισθηματική απομόνωση." },
  { t: "Τα λόγια του έσταζαν μέλι.", a: "Μεταφορά", w: "Τα λόγια δεν στάζουν κυριολεκτικά μέλι· η μεταφορική χρήση δηλώνει γλυκύτητα/κολακεία." },
  { t: "Ο χειμώνας της ζωής του τον βρήκε μόνο σ' ένα δωμάτιο με θέα τον τοίχο.", a: "Μεταφορά", w: "Ο «χειμώνας της ζωής» = τα γηρατειά." },
  { t: "Έτρεχε σαν τον άνεμο ανάμεσα στα στάχυα.", a: "Παρομοίωση", w: "Σύγκριση με το «σαν»: η ταχύτητα του ήρωα παρομοιάζεται με τον άνεμο." },
  { t: "Τα μάτια της έλαμπαν σαν δυο αστέρια μέσα στο σκοτάδι.", a: "Παρομοίωση", w: "Σύγκριση με το «σαν»." },
  { t: "Η θάλασσα απλωνόταν ήσυχη σαν λάδι.", a: "Παρομοίωση", w: "Η ηρεμία της θάλασσας παρομοιάζεται με λάδι (σαν)." },
  { t: "Γέρασε όπως γερνούν τα πλατάνια, όρθιος και σιωπηλός.", a: "Παρομοίωση", w: "Σύγκριση με το «όπως»." },
  { t: "Το σπίτι αναστέναξε όταν έφυγαν και τα τελευταία παιδιά.", a: "Προσωποποίηση", x: ["Μεταφορά"], w: "Το άψυχο σπίτι αποκτά ανθρώπινη ιδιότητα (αναστενάζει)." },
  { t: "Ο ήλιος χαμογελούσε στα τζάμια της γειτονιάς.", a: "Προσωποποίηση", x: ["Μεταφορά"], w: "Ο ήλιος «χαμογελά» σαν άνθρωπος." },
  { t: "Η πόλη κοιμόταν βαριά κάτω από το χιόνι.", a: "Προσωποποίηση", x: ["Μεταφορά", "Εικόνα"], w: "Η πόλη παρουσιάζεται να κοιμάται σαν ζωντανό πλάσμα." },
  { t: "Τα δέντρα έσκυβαν το κεφάλι μπροστά στον άνεμο.", a: "Προσωποποίηση", x: ["Μεταφορά", "Εικόνα"], w: "Τα δέντρα αποκτούν «κεφάλι» και ανθρώπινη στάση." },
  { t: "Εκείνος γελούσε, εκείνη έκλαιγε.", a: "Αντίθεση", x: ["Ασύνδετο σχήμα"], w: "Αντιπαρατίθενται δύο αντίθετες αντιδράσεις (γελούσε – έκλαιγε)." },
  { t: "Ήταν πλούσιος σε χρήματα, φτωχός σε φίλους.", a: "Αντίθεση", w: "Πλούσιος – φτωχός: αντιθετική παράθεση που αναδεικνύει τη μοναξιά." },
  { t: "Όσο ψήλωνε ο πύργος του, τόσο χαμήλωνε ο ίδιος στα μάτια των ανθρώπων.", a: "Αντίθεση", x: ["Μεταφορά"], w: "Ψήλωνε – χαμήλωνε: αντίθεση υλικής ανόδου και ηθικής πτώσης." },
  { t: "Σου το έχω πει χίλιες φορές!", a: "Υπερβολή", w: "Οι «χίλιες φορές» μεγαλοποιούν την πραγματικότητα για έμφαση." },
  { t: "Έκλαψε τόσο πολύ, που πλημμύρισε η αυλή.", a: "Υπερβολή", w: "Υπερβολική μεγέθυνση του κλάματος." },
  { t: "Ήταν τόσο ψηλός, που άγγιζε τα σύννεφα.", a: "Υπερβολή", w: "Μεγαλοποίηση του ύψους." },
  { t: "Περίμενε, περίμενε, μα κανείς δεν φάνηκε στον δρόμο.", a: "Επανάληψη", w: "Η επανάληψη του «περίμενε» τονίζει τη διάρκεια και την αγωνία της αναμονής." },
  { t: "Θυμάμαι τα δειλινά, θυμάμαι τις φωνές, θυμάμαι το φως στην αυλή.", a: "Επανάληψη", x: ["Ασύνδετο σχήμα", "Σχήμα των τριών", "Εικόνα"], w: "Το «θυμάμαι» επαναλαμβάνεται στην αρχή κάθε φράσης (αναφορά) και δίνει ρυθμό και συναισθηματική ένταση." },
  { t: "Ήρθε, κοίταξε, χαμογέλασε, έφυγε.", a: "Ασύνδετο σχήμα", w: "Οι προτάσεις παρατάσσονται χωρίς συνδέσμους: γρήγορος ρυθμός, ένταση." },
  { t: "Φωνές, τρεχάματα, κλάματα, σφυρίγματα γέμισαν το λιμάνι.", a: "Ασύνδετο σχήμα", x: ["Εικόνα"], w: "Οι λέξεις παρατίθενται χωρίς συνδέσμους, δημιουργώντας εικόνα αναστάτωσης." },
  { t: "Και έτρεχε και φώναζε και χτυπούσε τις πόρτες και κανείς δεν του άνοιγε.", a: "Πολυσύνδετο σχήμα", x: ["Επανάληψη"], w: "Η συχνή επανάληψη του «και» επιβραδύνει και εντείνει την απόγνωση." },
  { t: "Ποιος μπορεί να ξεχάσει τον τόπο όπου γεννήθηκε;", a: "Ρητορικό ερώτημα", w: "Ερώτηση που δεν περιμένει απάντηση· ισοδυναμεί με έντονη κατάφαση: κανείς δεν ξεχνά." },
  { t: "Ως πότε θα σωπαίνουμε μπροστά στην αδικία;", a: "Ρητορικό ερώτημα", w: "Ερώτηση με προτρεπτική/διαμαρτυρική λειτουργία, όχι για να πάρει απάντηση." },
  { t: "Τι άλλο θέλει ο άνθρωπος, παρά λίγη αγάπη κι ένα κομμάτι ουρανό;", a: "Ρητορικό ερώτημα", w: "Η ερώτηση δηλώνει μια βεβαιότητα του ομιλητή." },
  { t: "Μπράβο, πολύ έξυπνη ιδέα να βγεις χωρίς ομπρέλα μέσα στην μπόρα!", a: "Ειρωνεία", w: "Λέγεται το αντίθετο από αυτό που εννοείται (δεν ήταν έξυπνη ιδέα)." },
  { t: "Τι ευχάριστη διαδρομή: μόλις τρεις ώρες για δέκα χιλιόμετρα!", a: "Ειρωνεία", w: "Το «ευχάριστη» σημαίνει το αντίθετο· ο λόγος είναι ειρωνικός." },
  { t: "Ψιλή ψιχάλα ψιθύριζε στα ψηλά πεύκα.", a: "Παρήχηση", x: ["Προσωποποίηση", "Μεταφορά", "Εικόνα"], w: "Η επανάληψη του ήχου «ψ» μιμείται τον ήχο της ψιχάλας." },
  { t: "Βρέχει βαριά, βροντάει ο βοριάς.", a: "Παρήχηση", x: ["Εικόνα", "Ασύνδετο σχήμα"], w: "Επανάληψη του «β» και του «ρ»: ηχητικό αποτέλεσμα της καταιγίδας." },
  { t: "Τσιρίζουν τα τζιτζίκια στα τσαμπιά του αμπελιού.", a: "Παρήχηση", x: ["Εικόνα"], w: "Ο επαναλαμβανόμενος ήχος «τσ/τζ» μιμείται το τραγούδι των τζιτζικιών." },
  { t: "Η γαλανή, η αφρισμένη, η αλμυρή θάλασσα μάς περίμενε.", a: "Κοσμητικά επίθετα", x: ["Ασύνδετο σχήμα", "Εικόνα", "Επανάληψη", "Προσωποποίηση"], w: "Επίθετα που «στολίζουν» το ουσιαστικό και ζωντανεύουν την εικόνα." },
  { t: "Από μακριά ακουγόταν το καμπανάκι του κοπαδιού κι ένα σκυλί που γάβγιζε.", a: "Εικόνα", w: "Ακουστική εικόνα: ο αναγνώστης «ακούει» τη σκηνή." },
  { t: "Μύριζε φρεσκοψημένο ψωμί και γιασεμί σε όλη τη γειτονιά.", a: "Εικόνα", w: "Οσφρητική εικόνα." },
  { t: "Ένιωσε την παγωμένη πέτρα κάτω από τις γυμνές του πατούσες.", a: "Εικόνα", w: "Απτική εικόνα (αφή)." },
  { t: "Όταν ανθίσουν τα λιθάρια, τότε θα σε ξεχάσω.", a: "Σχήμα αδυνάτου", w: "Κάτι εξαρτάται από ένα αδύνατο γεγονός: δηλώνει ότι δεν θα συμβεί ποτέ." },
  { t: "Θα γυρίσει πίσω όταν το ποτάμι ανέβει προς το βουνό.", a: "Σχήμα αδυνάτου", w: "Ο όρος είναι αδύνατος (το ποτάμι δεν ρέει προς τα πάνω)· άρα δεν θα γυρίσει ποτέ." },
  { t: "Τρεις μέρες περπατούσε, τρεις νύχτες δεν έκλεισε μάτι, και την τρίτη αυγή έφτασε στο μοναστήρι.", a: "Σχήμα των τριών", x: ["Επανάληψη"], w: "Η τριπλή επανάληψη (τρεις μέρες, τρεις νύχτες, τρίτη αυγή) — χαρακτηριστικό της δημοτικής ποίησης και του παραμυθιού." },
  { t: "Μόνος ήρθε στον κόσμο, κι έφυγε μόνος.", a: "Σχήμα κύκλου", x: ["Επανάληψη", "Αντίθεση"], w: "Η φράση αρχίζει και τελειώνει με την ίδια λέξη («μόνος»), «κλείνοντας» το νόημα σε κύκλο και τονίζοντας τη μοναξιά." },
  { t: "Ο λύκος φόρεσε τη στολή του βοσκού, και το κοπάδι τον χειροκροτούσε.", a: "Αλληγορία", x: ["Μεταφορά", "Προσωποποίηση"], w: "Η εικόνα σημαίνει κάτι άλλο πέρα από την κυριολεξία (π.χ. έναν τύραννο που παριστάνει τον προστάτη και έναν λαό που τον επευφημεί)." },
  { t: "Μια εκκωφαντική σιωπή απλώθηκε στην αίθουσα.", a: "Οξύμωρο", w: "Συνδυάζονται αντιφατικές έννοιες (εκκωφαντική – σιωπή) για να τονιστεί η ένταση της στιγμής." },
  { t: "Ήταν μια γλυκιά πίκρα εκείνος ο αποχαιρετισμός.", a: "Οξύμωρο", w: "Γλυκιά – πίκρα: αντιφατικός συνδυασμός." },
  { t: "Στο τέλος του διηγήματος, ένα περιστέρι πετά πάνω από τα χαλάσματα της πόλης.", a: "Σύμβολο", x: ["Εικόνα"], w: "Το περιστέρι λειτουργεί ως σύμβολο της ειρήνης και της ελπίδας μετά την καταστροφή." },
  { t: "Το κλειδί του σπιτιού στην Κερύνεια κρέμεται ακόμη στον τοίχο του προσφυγικού.", a: "Σύμβολο", x: ["Εικόνα"], w: "Το κλειδί συμβολίζει τη μνήμη του χαμένου τόπου και την ελπίδα της επιστροφής." },
  { t: "Ο φόβος άπλωσε τα μαύρα του φτερά πάνω από το χωριό.", a: "Προσωποποίηση", x: ["Μεταφορά", "Εικόνα"], w: "Ο φόβος (αφηρημένη έννοια) παρουσιάζεται σαν ζωντανό πλάσμα με φτερά." },
  { t: "Η μάνα του ήταν βράχος σε όλες τις φουρτούνες.", a: "Μεταφορά", w: "Η μάνα ταυτίζεται με «βράχο» (σταθερότητα, δύναμη) και οι δυσκολίες με «φουρτούνες»." },
  { t: "Μικρό το σπίτι μας, μεγάλη η καρδιά της μάνας μας.", a: "Αντίθεση", x: ["Μεταφορά"], w: "Μικρό – μεγάλη: η αντίθεση τονίζει τη γενναιοδωρία μέσα στη φτώχεια." },
  { t: "Ένα ποτάμι από ανθρώπους κατέβαινε τη λεωφόρο.", a: "Μεταφορά", x: ["Υπερβολή", "Εικόνα"], w: "Το πλήθος ταυτίζεται με «ποτάμι» (συνεχής, ορμητική ροή)." }
];

/* ───────────── 1.5 Στιχουργική ─────────────
   Στίχοι με χειροκίνητο συλλαβισμό: "|" = όριο συλλαβής, "_" = συνεκφώνηση/συνίζηση, "*" πριν από συλλαβή = μετρικά τονισμένη μονοσύλλαβη λέξη. */
const NB1_VERSE = [
  { src: "Διονύσιος Σολωμός, «Ύμνος εις την Ελευθερίαν» (1823), στ. 1", t: "Σε γνωρίζω από την κόψη", s: "Σε|γνω|ρί|ζω_α|πό|την|κό|ψη", m: "τροχαϊκός" },
  { src: "Διονύσιος Σολωμός, «Ύμνος εις την Ελευθερίαν» (1823), στ. 2", t: "του σπαθιού την τρομερή,", s: "του|σπα|θιού|την|τρο|με|ρή", m: "τροχαϊκός" },
  { src: "Διονύσιος Σολωμός, «Ύμνος εις την Ελευθερίαν» (1823), στ. 3", t: "σε γνωρίζω από την όψη", s: "σε|γνω|ρί|ζω_α|πό|την|ό|ψη", m: "τροχαϊκός" },
  { src: "Διονύσιος Σολωμός, «Ύμνος εις την Ελευθερίαν» (1823), στ. 4", t: "που με βια μετράει τη γη.", s: "που|με|*βια|με|τρά_ει|τη|*γη", m: "τροχαϊκός" },
  { src: "Δημοτικό τραγούδι (ακριτικό)", t: "Ο Διγενής ψυχομαχεί κι η γης τονε τρομάζει", s: "Ο|Δι|γε|νής|ψυ|χο|μα|χεί|κι_η|*γης|το|νε|τρο|μά|ζει", m: "ιαμβικός" },
  { src: "Βιτσέντζος Κορνάρος, «Ερωτόκριτος» (17ος αι.), στ. 1", t: "Του κύκλου τα γυρίσματα που ανεβοκατεβαίνουν", s: "Του|κύ|κλου|τα|γυ|ρί|σμα|τα|που_α|νε|βο|κα|τε|βαί|νουν", m: "ιαμβικός" },
  { src: "Πρωτότυπος στίχος εξάσκησης", t: "Το βράδυ σβήνει σιγανά τα φώτα στο λιμάνι", s: "Το|βρά|δυ|σβή|νει|σι|γα|νά|τα|φώ|τα|στο|λι|μά|νι", m: "ιαμβικός" },
  { src: "Πρωτότυπος στίχος εξάσκησης", t: "Λάμπει πάνω στο ποτάμι", s: "Λάμ|πει|πά|νω|στο|πο|τά|μι", m: "τροχαϊκός" },
  { src: "Πρωτότυπος στίχος εξάσκησης", t: "το φεγγάρι το χλωμό,", s: "το|φεγ|γά|ρι|το|χλω|μό", m: "τροχαϊκός" },
  { src: "Πρωτότυπος στίχος εξάσκησης", t: "τρέμει στο χλωρό καλάμι", s: "τρέ|μει|στο|χλω|ρό|κα|λά|μι", m: "τροχαϊκός" },
  { src: "Πρωτότυπος στίχος εξάσκησης", t: "σαν τραγούδι σιγανό.", s: "σαν|τρα|γού|δι|σι|γα|νό", m: "τροχαϊκός" },
  { src: "Πρωτότυπος στίχος εξάσκησης", t: "Στο μονοπάτι του βουνού περπάτησα μονάχος", s: "Στο|μο|νο|πά|τι|του|βου|νού|περ|πά|τη|σα|μο|νά|χος", m: "ιαμβικός" },
  { src: "Πρωτότυπος στίχος εξάσκησης", t: "Τα κύματα χτυπούν τη ράχη του γιαλού", s: "Τα|κύ|μα|τα|χτυ|πούν|τη|ρά|χη|του|για|λού", m: "ιαμβικός" },
  { src: "Πρωτότυπος στίχος εξάσκησης", t: "Τρέχει το νερό στη ρεματιά", s: "Τρέ|χει|το|νε|ρό|στη|ρε|μα|τιά", m: "τροχαϊκός" },
  { src: "Πρωτότυπος στίχος εξάσκησης", t: "Η μάνα κάθεται σιωπηλή στο παραθύρι", s: "Η|μά|να|κά|θε|ται|σι|ω|πη|λή|στο|πα|ρα|θύ|ρι", m: "ιαμβικός" },
  { src: "Πρωτότυπος στίχος εξάσκησης", t: "Σβήνει πίσω στο βουνό", s: "Σβή|νει|πί|σω|στο|βου|νό", m: "τροχαϊκός" },
  { src: "Πρωτότυπος στίχος εξάσκησης", t: "Πετούν τα χελιδόνια στον αέρα", s: "Πε|τούν|τα|χε|λι|δό|νια|στον|α|έ|ρα", m: "ιαμβικός" },
  { src: "Πρωτότυπος στίχος εξάσκησης", t: "Κάτω στο γιαλό χορεύουν τα κοράλλια", s: "Κά|τω|στο|για|λό|χο|ρεύ|ουν|τα|κο|ράλ|λια", m: "τροχαϊκός" }
];
const NB1_ACC = /[άέήίόύώΐΰΆΈΉΊΌΎΏ]/;
/* μετρική ανάλυση από χειροκίνητο συλλαβισμό */
function nb1Scan(s) {
  const syl = s.split("|"), st = [];
  syl.forEach((x, i) => { if (x.startsWith("*") || NB1_ACC.test(x)) st.push(i + 1); });
  return { syl: syl.map(x => x.replace(/^\*/, "").replace(/_/g, "‿")), n: syl.length, st };
}
function nb1Metre(n, st) {
  const sig = st.filter(p => p < n || st.length === 1);
  if (!st.length) return "—";
  const all = f => st.every(f);
  if (all(p => p % 2 === 0)) return "ιαμβικός";
  if (all(p => p % 2 === 1)) return "τροχαϊκός";
  if (all(p => p % 3 === 0)) return "αναπαιστικός";
  if (all(p => p % 3 === 1)) return "δακτυλικός";
  if (all(p => p % 3 === 2)) return "αμφίβραχυς";
  return sig.length ? "μικτός / ελεύθερος" : "—";
}
/* ζεύγη ομοιοκατάληκτων πρωτότυπων στίχων· c = «οικογένεια» ήχου (δεν συνδυάζονται ζεύγη της ίδιας οικογένειας) */
const NB1_PAIRS = [
  { c: "ami", l: ["Λάμπει πάνω στο ποτάμι", "τρέμει στο χλωρό καλάμι"] },
  { c: "o", l: ["το φεγγάρι το χλωμό", "σαν τραγούδι σιγανό"] },
  { c: "ia", l: ["σ' έναν κλώνο απ' τη μηλιά", "με τη ροδαλή ποδιά"] },
  { c: "o", l: ["βγαίνει το πρωί ο βοσκός", "και τον λούζει ο ήλιος ο χρυσός"] },
  { c: "o", l: ["κάτω στον ήσυχο γιαλό", "πέφτει ένα αστέρι χαμηλό"] },
  { c: "oli", l: ["ξύπνησε το περιβόλι", "κι άνθισαν οι κήποι όλοι"] },
  { c: "li", l: ["μες στην έρημη αυλή", "κελαηδάει ένα πουλί"] },
  { c: "ia", l: ["κι η καμπάνα της εκκλησιάς", "σμίγει με τη φωνή της ρεματιάς"] }
];
function nb1Two() { const a = nb1Pick(NB1_PAIRS); let b; do { b = nb1Pick(NB1_PAIRS); } while (b.c === a.c); return [a.l, b.l]; }

/* ───────────── 1.6 Λογοτεχνικά ρεύματα & γενιές ───────────── */
const NB1_ERAS = [
  { id: "dim", n: "Δημοτική ποίηση", d: "Ανώνυμη, προφορική παράδοση (κυρίως 15ος–19ος αι.)", f: ["Ανώνυμοι δημιουργοί, προφορική διάδοση με παραλλαγές", "Δεκαπεντασύλλαβος ιαμβικός στίχος, κανόνας της ισομετρίας (κάθε στίχος ολοκληρωμένο νόημα)", "Σχήμα των τριών, σχήμα του αδυνάτου, τυπικά επίθετα, επαναλήψεις", "Λιτός, ζωντανός λόγος· είδη: ακριτικά, κλέφτικα, της ξενιτιάς, μοιρολόγια, νανουρίσματα"], a: ["Ακριτικά τραγούδια (Διγενής)", "Κλέφτικα τραγούδια", "Τραγούδια της ξενιτιάς"] },
  { id: "ept", n: "Επτανησιακή Σχολή", d: "19ος αιώνας, Επτάνησα", f: ["Ρομαντισμός με ευρωπαϊκές (ιταλικές) επιρροές", "Χρήση της δημοτικής γλώσσας στην έντεχνη ποίηση", "Θέματα: πατρίδα, ελευθερία, θρησκεία, φύση, έρωτας", "Αυστηρή μορφή: μέτρο, ομοιοκαταληξία, στροφές"], a: ["Διονύσιος Σολωμός", "Αριστοτέλης Βαλαωρίτης", "Γεράσιμος Μαρκοράς"] },
  { id: "nas", n: "Νέα Αθηναϊκή Σχολή · ηθογραφία", d: "Γενιά του 1880 – αρχές 20ού αι.", f: ["Επικράτηση της δημοτικής (δημοτικισμός)", "Παραδοσιακή μορφή, παρνασσισμός και συμβολισμός στην ποίηση", "Στην πεζογραφία: ηθογραφία — ζωή της υπαίθρου, ήθη και έθιμα", "Ρεαλισμός, μετάβαση προς τον νατουραλισμό"], a: ["Κωστής Παλαμάς", "Αλέξανδρος Παπαδιαμάντης", "Ανδρέας Καρκαβίτσας"] },
  { id: "kav", n: "Κ. Π. Καβάφης (Αλεξάνδρεια)", d: "Αρχές 20ού αι. — ιδιαίτερη περίπτωση", f: ["Ιστορικά, φιλοσοφικά και ερωτικά ποιήματα", "Πεζολογικό ύφος, λιτότητα, ειρωνεία, θεατρικότητα", "Μείξη λόγιων και δημοτικών στοιχείων", "Η ιστορία (ελληνιστική, βυζαντινή) ως αφορμή για διαχρονικά μηνύματα"], a: ["Κ. Π. Καβάφης"], pr: ["«Αλεξανδρινοί Βασιλείς»"] },
  { id: "g20", n: "Γενιά του 1920", d: "Μεσοπόλεμος", f: ["Νεορομαντισμός και απαισιοδοξία, μελαγχολία", "Αίσθηση ματαιότητας και αδιεξόδου", "Σάτιρα και αυτοσαρκασμός", "Παραδοσιακή μορφή που αρχίζει να χαλαρώνει"], a: ["Κώστας Καρυωτάκης", "Μαρία Πολυδούρη"] },
  { id: "g30", n: "Γενιά του '30 · Μοντερνισμός", d: "Από το 1930 περίπου", f: ["Ελεύθερος στίχος, απουσία μέτρου και ομοιοκαταληξίας", "Σύμβολα, πυκνότητα, υπαινικτικότητα, χαλαρή στίξη, διασκελισμός", "Υπερρεαλισμός (ελεύθερος συνειρμός, τολμηρές εικόνες)", "Αναζήτηση της «ελληνικότητας»: μύθος, ιστορία, ελληνικό τοπίο· στην πεζογραφία ρεαλισμός και πόλεμος"], a: ["Γιώργος Σεφέρης (Νόμπελ 1963)", "Οδυσσέας Ελύτης (Νόμπελ 1979)", "Ανδρέας Εμπειρίκος", "Γιάννης Ρίτσος", "Στράτης Μυριβήλης", "Ηλίας Βενέζης", "Ι. Μ. Παναγιωτόπουλος"], pr: ["Σεφέρης, «Ελένη»", "Ελύτης, «Άξιον εστί»", "Ρίτσος, «Αποχαιρετισμός»", "Παναγιωτόπουλος, «Αστροφεγγιά»"] },
  { id: "met", n: "Μεταπολεμική λογοτεχνία", d: "Μετά τον Β΄ Παγκόσμιο και τον Εμφύλιο", f: ["Πολιτική και κοινωνική ποίηση· διάψευση των οραμάτων", "Λιτός, χαμηλόφωνος, πεζολογικός λόγος", "Μνήμη του πολέμου, της Κατοχής, του Εμφυλίου, της δικτατορίας", "Στην πεζογραφία: μαρτυρίες, χρονικά, αυτοβιογραφικά πεζογραφήματα"], a: ["Μανόλης Αναγνωστάκης", "Τίτος Πατρίκιος", "Γιώργος Ιωάννου", "Διδώ Σωτηρίου"], pr: ["Αναγνωστάκης, «Θεσσαλονίκη, Μέρες του 1969 μ.Χ.»", "Ιωάννου, «†13-12-43»", "Σωτηρίου, «Οι νεκροί περιμένουν»"] },
  { id: "kyp", n: "Κυπριακή λογοτεχνία", d: "19ος αι. – σήμερα· έμφαση μετά το 1974", f: ["Ιδιωματικός λόγος (κυπριακή διάλεκτος) στην παράδοση", "Αγώνας για ελευθερία, αποικιοκρατία", "Μετά το 1974: εισβολή, προσφυγιά, κατεχόμενα, νοσταλγία, αγνοούμενοι", "Συνδυασμός προσωπικού και συλλογικού τραύματος"], a: ["Βασίλης Μιχαηλίδης", "Γ. Φ. Πιερίδης", "Κώστας Μόντης", "Παντελής Μηχανικός", "Κυριάκος Χαραλαμπίδης"], pr: ["Μόντης, «Τρίτο γράμμα στη μητέρα, ζ΄»", "Μηχανικός, «Ονήσιλος»", "Χαραλαμπίδης, «Στα στέφανα της κόρης του»", "Πιερίδης, «Ο πορτοκαλόκηπος»"] }
];
const NB1_ERAQ = [
  { q: "Σε ποια σχολή εντάσσεται ο Διονύσιος Σολωμός;", a: "Επτανησιακή Σχολή" },
  { q: "Η «Αστροφεγγιά» του Ι. Μ. Παναγιωτόπουλου είναι έργο πεζογράφου της…", a: "Γενιά του '30" },
  { q: "Σε ποια σχολή/γενιά εντάσσεται ο Κωστής Παλαμάς;", a: "Νέα Αθηναϊκή Σχολή" },
  { q: "Σε ποια γενιά εντάσσεται ο Γιώργος Σεφέρης;", a: "Γενιά του '30" },
  { q: "Σε ποια γενιά εντάσσεται ο Οδυσσέας Ελύτης;", a: "Γενιά του '30" },
  { q: "Σε ποια γενιά εντάσσεται ο Ανδρέας Εμπειρίκος, εισηγητής του υπερρεαλισμού;", a: "Γενιά του '30" },
  { q: "Σε ποια γενιά εντάσσεται ο Κώστας Καρυωτάκης;", a: "Γενιά του 1920" },
  { q: "Σε ποια περίοδο εντάσσεται ο Μανόλης Αναγνωστάκης;", a: "Μεταπολεμική λογοτεχνία" },
  { q: "Σε ποια περίοδο εντάσσεται το έργο του Γιώργου Ιωάννου;", a: "Μεταπολεμική λογοτεχνία" },
  { q: "Ο Κώστας Μόντης και ο Παντελής Μηχανικός ανήκουν στην…", a: "Κυπριακή λογοτεχνία" },
  { q: "Ο Κυριάκος Χαραλαμπίδης είναι σημαντική φωνή της…", a: "Κυπριακή λογοτεχνία" },
  { q: "Ο Βασίλης Μιχαηλίδης έγραψε κυρίως στην κυπριακή διάλεκτο· ανήκει στην…", a: "Κυπριακή λογοτεχνία" },
  { q: "Ο Αλέξανδρος Παπαδιαμάντης συνδέεται κυρίως με…", a: "Νέα Αθηναϊκή Σχολή" },
  { q: "Ποιο ρεύμα εισάγει τον ελεύθερο στίχο, τα σύμβολα και τον υπερρεαλισμό στην ελληνική ποίηση;", a: "Γενιά του '30" },
  { q: "Η ανωνυμία, ο δεκαπεντασύλλαβος και το σχήμα των τριών χαρακτηρίζουν τη…", a: "Δημοτική ποίηση" },
  { q: "Η ρομαντική ποίηση στη δημοτική γλώσσα με ιταλικές επιρροές τον 19ο αιώνα χαρακτηρίζει την…", a: "Επτανησιακή Σχολή" },
  { q: "Η ηθογραφία (ζωή της υπαίθρου, ήθη και έθιμα) αναπτύσσεται κυρίως με τη…", a: "Νέα Αθηναϊκή Σχολή" },
  { q: "Η απαισιοδοξία, η μελαγχολία και ο αυτοσαρκασμός του Μεσοπολέμου χαρακτηρίζουν τη…", a: "Γενιά του 1920" },
  { q: "Η πολιτική ποίηση της διάψευσης, μετά τον πόλεμο και τον Εμφύλιο, ανήκει στη…", a: "Μεταπολεμική λογοτεχνία" },
  { q: "Θέματα όπως η προσφυγιά, τα κατεχόμενα και οι αγνοούμενοι μετά το 1974 κυριαρχούν στην…", a: "Κυπριακή λογοτεχνία" },
  { q: "Τα ακριτικά και τα κλέφτικα τραγούδια ανήκουν στη…", a: "Δημοτική ποίηση" },
  { q: "Ο Ελύτης τιμήθηκε με το βραβείο Νόμπελ το 1979· ποιητικά ανήκει στη…", a: "Γενιά του '30" },
  { q: "Ο Σεφέρης τιμήθηκε με το βραβείο Νόμπελ το 1963· ποιητικά ανήκει στη…", a: "Γενιά του '30" },
  { q: "Η Διδώ Σωτηρίου έγραψε για τη Μικρασιατική καταστροφή· το έργο της εντάσσεται στη…", a: "Μεταπολεμική λογοτεχνία" },
  { q: "Ο Γ. Φ. Πιερίδης είναι πεζογράφος της…", a: "Κυπριακή λογοτεχνία" },
  { q: "Ο Αριστοτέλης Βαλαωρίτης εντάσσεται στην…", a: "Επτανησιακή Σχολή" },
  { q: "Ο Ανδρέας Καρκαβίτσας («Ο ζητιάνος») εντάσσεται στη…", a: "Νέα Αθηναϊκή Σχολή" },
  { q: "Ο Ηλίας Βενέζης και ο Στράτης Μυριβήλης ανήκουν στην πεζογραφία της…", a: "Γενιά του '30" },
  { q: "Ο Τίτος Πατρίκιος εντάσσεται στη…", a: "Μεταπολεμική λογοτεχνία" },
  { q: "Η Μαρία Πολυδούρη εντάσσεται στη…", a: "Γενιά του 1920" }
];
const NB1_ERANAMES = ["Δημοτική ποίηση", "Επτανησιακή Σχολή", "Νέα Αθηναϊκή Σχολή", "Γενιά του 1920", "Γενιά του '30", "Μεταπολεμική λογοτεχνία", "Κυπριακή λογοτεχνία"];

/* ───────────── 1.2 κείμενα για κλικ-ανάλυση (πρωτότυπα) ───────────── */
const NB1_PASSAGES = [
  { title: "«Το τελευταίο λεωφορείο» (πρωτότυπο κείμενο εξάσκησης)", s: [
    ["Ο σταθμός ήταν σχεδόν άδειος· δυο λάμπες φθορισμού τρεμόπαιζαν πάνω από τα μεταλλικά καθίσματα, κι ένα σκυλί κοιμόταν κουλουριασμένο δίπλα στο περίπτερο.", "Περιγραφή"],
    ["Η Άννα κοίταξε το ρολόι, άφησε τη βαλίτσα κάτω και κάθισε στην άκρη του πάγκου.", "Αφήγηση"],
    ["Κι αν δεν έρθει; Κι αν το τελευταίο έφυγε ήδη; Πού θα κοιμηθώ απόψε;", "Εσωτερικός μονόλογος"],
    ["— Περιμένετε το λεωφορείο για τη Λευκωσία; τη ρώτησε ένας ηλικιωμένος με καπέλο.\n— Ναι. Έχει φύγει;\n— Όχι ακόμη. Πάντα αργεί.", "Διάλογος"],
    ["Έτσι είναι οι σταθμοί τις νύχτες: γεμάτοι ανθρώπους που περιμένουν κάτι να τους πάει κάπου αλλού.", "Σχόλιο"],
    ["Σε λίγο φάνηκαν τα φώτα στη στροφή· η Άννα σηκώθηκε, πήρε τη βαλίτσα και προχώρησε στην άκρη του πεζοδρομίου.", "Αφήγηση"]
  ] },
  { title: "«Η γιορτή του χωριού» (πρωτότυπο κείμενο εξάσκησης)", s: [
    ["Η πλατεία είχε στολιστεί με σημαιάκια και λαμπιόνια, και στη μέση, κάτω από τον πλάτανο, οι οργανοπαίχτες κούρδιζαν το βιολί και το λαούτο.", "Περιγραφή"],
    ["Ο Γιώργης έφτασε τελευταίος, χαιρέτησε τους φίλους του και στάθηκε στη γωνία, μακριά από τον χορό.", "Αφήγηση"],
    ["— Δεν θα χορέψεις; τον πείραξε η αδελφή του.\n— Όχι απόψε, είπε εκείνος.", "Διάλογος"],
    ["Πώς να χορέψω, όταν εκείνη χορεύει με άλλον; Πώς να γελάσω μπροστά σε όλους;", "Εσωτερικός μονόλογος"],
    ["Στα χωριά οι γιορτές δεν είναι μόνο για τη χαρά· είναι και η στιγμή που φανερώνονται όλα όσα κρύβονται τον υπόλοιπο χρόνο.", "Σχόλιο"],
    ["Κατά τα μεσάνυχτα ο Γιώργης έφυγε σιωπηλός και πήρε το μονοπάτι για το σπίτι.", "Αφήγηση"]
  ] }
];
const NB1_MCOL = { "Αφήγηση": "#C62828", "Περιγραφή": "#198754", "Διάλογος": "#0F6FD1", "Εσωτερικός μονόλογος": "#6F42C1", "Σχόλιο": "#C77A0A" };

/* ───────────── 1.3 ιστορίες για τον άξονα του χρόνου (πρωτότυπες) ───────────── */
const NB1_STORIES = [
  { title: "«Η σφυριξιά»", ep: [
    { t: "Ο Πέτρος στέκεται στο λιμάνι της Λεμεσού με μια βαλίτσα στο χέρι.", c: 3, k: "Κύρια δράση" },
    { t: "Χρόνια αργότερα θα έλεγε πως η σφυριξιά του καραβιού εκείνη τη μέρα χώρισε τη ζωή του στα δύο.", c: 5, k: "Πρόληψη" },
    { t: "Θυμάται το βράδυ που ο πατέρας του τού είπε πως πρέπει να φύγει για δουλειά στην Αγγλία.", c: 1, k: "Αναδρομή" },
    { t: "Θυμάται την αδελφή του να του ράβει κρυφά ένα φυλαχτό στη φόδρα του σακακιού.", c: 2, k: "Αναδρομή" },
    { t: "Το καράβι σφυρίζει και ο Πέτρος ανεβαίνει τη σκάλα χωρίς να γυρίσει πίσω.", c: 4, k: "Κύρια δράση" }
  ] },
  { title: "«Η φωτιά» (in medias res)", ep: [
    { t: "Οι φλόγες έχουν ήδη φτάσει στη στέγη, όταν η Μαρίνα ανοίγει τα μάτια της.", c: 3, k: "In medias res (κύρια δράση)" },
    { t: "Το απόγευμα είχε ανάψει τη σόμπα και είχε απλώσει τα ρούχα να στεγνώσουν από πάνω.", c: 1, k: "Αναδρομή" },
    { t: "Είχε αποκοιμηθεί στην πολυθρόνα διαβάζοντας ένα παλιό γράμμα.", c: 2, k: "Αναδρομή" },
    { t: "Τρέχει στο παράθυρο και φωνάζει τους γείτονες.", c: 4, k: "Κύρια δράση" },
    { t: "Το πρωί, μέσα στα αποκαΐδια, θα βρει άκαυτο μόνο εκείνο το γράμμα.", c: 6, k: "Πρόληψη" },
    { t: "Οι γείτονες τη βγάζουν από το παράθυρο με μια σκάλα.", c: 5, k: "Κύρια δράση" }
  ] },
  { title: "«Ο δάσκαλος»", ep: [
    { t: "Ο κυρ-Νικόλας, συνταξιούχος πια, ανοίγει το παράθυρο της τάξης που κάποτε δίδασκε.", c: 4, k: "Κύρια δράση" },
    { t: "Θυμάται την πρώτη μέρα του στο χωριό, τότε που τα παιδιά δεν ήξεραν να κρατούν μολύβι.", c: 1, k: "Αναδρομή" },
    { t: "Τριάντα χρόνια πέρασαν μέσα σε αυτούς τους τοίχους: αλφαβητάρια, γιορτές, εξετάσεις.", c: 2, k: "Αναδρομή (με επιτάχυνση)" },
    { t: "Θυμάται και τη μέρα που έκλεισε το σχολείο, γιατί δεν είχε μείνει πια κανένα παιδί.", c: 3, k: "Αναδρομή" },
    { t: "Γράφει στον μαυροπίνακα με κιμωλία: «Καλή αντάμωση».", c: 5, k: "Κύρια δράση" }
  ] }
];

/* ───────────── 1.7 Πίνακας σύγκρισης ───────────── */
const NB1_CMP = [
  { title: "Κ. Π. Καβάφης, «Ιθάκη» (1911, στ. 1–3) ↔ «Επιστροφή» (πρωτότυπο ποίημα εξάσκησης)",
    A: { name: "Κείμενο Α: Καβάφης, «Ιθάκη» (απόσπασμα)", text: "Σα βγεις στον πηγαιμό για την Ιθάκη,\nνα εύχεσαι νάναι μακρύς ο δρόμος,\nγεμάτος περιπέτειες, γεμάτος γνώσεις." },
    B: { name: "Κείμενο Β: «Επιστροφή» (πρωτότυπο κείμενο)", text: "Γύρισα στο νησί μου ένα απόγευμα του Νοέμβρη.\nΤο λιμάνι μικρότερο απ' όσο το θυμόμουν,\nτα σπίτια χαμηλά, οι φωνές αλλιώτικες.\nΚι όμως κάτι στη μυρωδιά της θάλασσας\nμού είπε πως ο δρόμος δεν ήταν χαμένος." },
    rows: [
      { c: "Κοινό μοτίβο", A: ["Το ταξίδι / ο δρόμος", "Ο πόλεμος", "Ο έρωτας"], aA: 0, B: ["Το ταξίδι / ο δρόμος", "Ο πόλεμος", "Ο έρωτας"], aB: 0, rel: ["Ομοιότητα", "Διαφορά"], ar: 0, why: "Ομοιότητα: και τα δύο κείμενα στηρίζονται στο μοτίβο του ταξιδιού/του δρόμου." },
      { c: "Οπτική του ταξιδιού", A: ["Αναχώρηση: αξία έχει η διαδρομή", "Επιστροφή: οι αλλαγές του χρόνου στον γενέθλιο τόπο", "Ναυάγιο: το ταξίδι ως αποτυχία"], aA: 0, B: ["Αναχώρηση: αξία έχει η διαδρομή", "Επιστροφή: οι αλλαγές του χρόνου στον γενέθλιο τόπο", "Ναυάγιο: το ταξίδι ως αποτυχία"], aB: 1, rel: ["Ομοιότητα", "Διαφορά"], ar: 1, why: "Διαφορά: το Α βλέπει το ταξίδι από την αναχώρηση (η διαδρομή έχει αξία), το Β από την επιστροφή (τι άλλαξε ο χρόνος)." },
      { c: "Ποιητικό υποκείμενο / πρόσωπο", A: ["Β΄ ενικό: απευθύνεται σε έναν «εσύ» με συμβουλευτικό τόνο", "Α΄ ενικό: εξομολόγηση προσωπικού βιώματος", "Γ΄ πρόσωπο: αφήγηση για τρίτους"], aA: 0, B: ["Β΄ ενικό: απευθύνεται σε έναν «εσύ» με συμβουλευτικό τόνο", "Α΄ ενικό: εξομολόγηση προσωπικού βιώματος", "Γ΄ πρόσωπο: αφήγηση για τρίτους"], aB: 1, rel: ["Ομοιότητα", "Διαφορά"], ar: 1, why: "Διαφορά: στο Α ο ομιλητής δίνει συμβουλή σε β΄ πρόσωπο (βγεις, να εύχεσαι), στο Β μιλά σε α΄ πρόσωπο για όσα έζησε (γύρισα, θυμόμουν)." },
      { c: "Εκφραστικά μέσα", A: ["Επανάληψη («γεμάτος … γεμάτος») και σύμβολο (Ιθάκη)", "Ρητορικά ερωτήματα και ειρωνεία", "Σχήμα αδυνάτου"], aA: 0, B: ["Επανάληψη («γεμάτος … γεμάτος») και σύμβολο (Ιθάκη)", "Εικόνες (οπτικές, ακουστικές, οσφρητική) και αντίθεση παρελθόντος–παρόντος", "Σχήμα των τριών"], aB: 1, rel: ["Ομοιότητα", "Διαφορά"], ar: 1, why: "Διαφορά: το Α στηρίζεται στην επανάληψη και στο σύμβολο, το Β σε εικόνες (λιμάνι, σπίτια, φωνές, μυρωδιά) και στην αντίθεση «όπως το θυμόμουν – όπως είναι»." },
      { c: "Μορφή / στιχουργική", A: ["Ανομοιοκατάληκτοι στίχοι άνισης έκτασης", "Δεκαπεντασύλλαβος με ομοιοκαταληξία", "Πεζό κείμενο"], aA: 0, B: ["Ελεύθερος στίχος, χωρίς μέτρο και ομοιοκαταληξία", "Δεκαπεντασύλλαβος με ομοιοκαταληξία", "Πεζό κείμενο"], aB: 0, rel: ["Ομοιότητα", "Διαφορά"], ar: 0, why: "Ομοιότητα: και τα δύο έχουν στίχους άνισης έκτασης χωρίς ομοιοκαταληξία (το Β σε ελεύθερο στίχο)." },
      { c: "Ύφος / τόνος", A: ["Στοχαστικό, διδακτικό-συμβουλευτικό, αισιόδοξο", "Θρηνητικό, απελπισμένο", "Σατιρικό"], aA: 0, B: ["Στοχαστικό, διδακτικό-συμβουλευτικό, αισιόδοξο", "Νοσταλγικό, μελαγχολικό με τελική παρηγοριά", "Σατιρικό"], aB: 1, rel: ["Ομοιότητα", "Διαφορά"], ar: 1, why: "Διαφορά: το Α έχει συμβουλευτικό και αισιόδοξο τόνο· το Β είναι νοσταλγικό, με μια τελική νότα παρηγοριάς." }
    ],
    model: "Και τα δύο κείμενα αξιοποιούν το μοτίβο του ταξιδιού: στο Κείμενο Α ο δρόμος προς την Ιθάκη παρουσιάζεται ως πολύτιμη πορεία ζωής, ενώ στο Κείμενο Β το ποιητικό υποκείμενο επιστρέφει στον τόπο του και διαπιστώνει τις αλλαγές του χρόνου. Διαφέρουν, ωστόσο, ως προς τη «φωνή»: στο Α ο ομιλητής απευθύνεται σε β΄ πρόσωπο με συμβουλευτικό τόνο, ενώ στο Β κυριαρχεί το α΄ πρόσωπο της προσωπικής εξομολόγησης. Επιπλέον, το Α στηρίζεται στην επανάληψη («γεμάτος … γεμάτος»), που τονίζει τον πλούτο των εμπειριών, και στο σύμβολο της Ιθάκης, ενώ το Β χρησιμοποιεί εικόνες και την αντίθεση ανάμεσα στη μνήμη και στο παρόν. Και τα δύο, τέλος, γράφονται σε ανομοιοκατάληκτους στίχους άνισης έκτασης." },
  { title: "Δημοτικό τραγούδι της ξενιτιάς (παράδοση) ↔ «Το γράμμα» (πρωτότυπο πεζό εξάσκησης)",
    A: { name: "Κείμενο Α: Δημοτικό τραγούδι της ξενιτιάς (απόσπασμα)", text: "Ξενιτεμένο μου πουλί και παραπονεμένο,\nη ξενιτιά σε χαίρεται κι εγώ 'χω τον καημό σου." },
    B: { name: "Κείμενο Β: «Το γράμμα» (πρωτότυπο κείμενο)", text: "Η μάνα κρατούσε το γράμμα στα γόνατά της και δεν το άνοιγε. Ήξερε απέξω τον γραφικό χαρακτήρα του γιου της, τις στραβές του γραμμές, το μελάνι που μουτζούρωνε στις γωνίες. Έξω ο αέρας χτυπούσε τα παντζούρια. «Καλά είμαι, μάνα», θα έγραφε πάλι. Κι εκείνη θα έκανε πως το πιστεύει." },
    rows: [
      { c: "Θέμα", A: ["Ο πόνος του αποχωρισμού από τον ξενιτεμένο", "Η χαρά της επιστροφής", "Ο έρωτας"], aA: 0, B: ["Ο πόνος του αποχωρισμού από τον ξενιτεμένο", "Η χαρά της επιστροφής", "Η φιλία"], aB: 0, rel: ["Ομοιότητα", "Διαφορά"], ar: 0, why: "Ομοιότητα: και στα δύο το κέντρο είναι ο καημός για το πρόσωπο που ζει στην ξενιτιά." },
      { c: "Γένος / μορφή", A: ["Ποίηση: δεκαπεντασύλλαβος ιαμβικός, ανώνυμη δημοτική παράδοση", "Πεζογραφία: διήγημα", "Θέατρο"], aA: 0, B: ["Ποίηση: δεκαπεντασύλλαβος ιαμβικός", "Πεζογραφία: σύντομο αφηγηματικό κείμενο", "Θέατρο"], aB: 1, rel: ["Ομοιότητα", "Διαφορά"], ar: 1, why: "Διαφορά: το Α είναι δημοτικό ποίημα σε δεκαπεντασύλλαβο, το Β πεζό αφηγηματικό κείμενο." },
      { c: "Φωνή / πρόσωπο", A: ["Α΄ πρόσωπο: το ποιητικό υποκείμενο απευθύνεται στο «πουλί» (β΄ πρόσωπο)", "Ετεροδιηγητικός αφηγητής σε γ΄ πρόσωπο", "Διάλογος δύο προσώπων"], aA: 0, B: ["Α΄ πρόσωπο: το ποιητικό υποκείμενο απευθύνεται στο «πουλί»", "Ετεροδιηγητικός αφηγητής σε γ΄ πρόσωπο, με εστίαση στη μάνα", "Διάλογος δύο προσώπων"], aB: 1, rel: ["Ομοιότητα", "Διαφορά"], ar: 1, why: "Διαφορά: στο Α μιλά η ίδια η πονεμένη φωνή, στο Β ένας αφηγητής εκτός ιστορίας παρουσιάζει τη μάνα σε γ΄ πρόσωπο." },
      { c: "Εκφραστικά μέσα", A: ["Μεταφορά (ο ξενιτεμένος = «πουλί»), αντίθεση (η ξενιτιά χαίρεται – εγώ έχω καημό)", "Ασύνδετο σχήμα και παρήχηση", "Ειρωνεία"], aA: 0, B: ["Μεταφορά και αντίθεση", "Εικόνες (το γράμμα, ο αέρας στα παντζούρια) και εσωτερική εστίαση στη σκέψη της μάνας", "Σχήμα αδυνάτου"], aB: 1, rel: ["Ομοιότητα", "Διαφορά"], ar: 1, why: "Διαφορά: το Α στηρίζεται στη μεταφορά και στην αντίθεση, το Β σε εικόνες και στην απόδοση των σκέψεων της μάνας." }
    ],
    model: "Τα δύο κείμενα πραγματεύονται τον πόνο του αποχωρισμού από ένα αγαπημένο πρόσωπο που ζει στην ξενιτιά. Στο δημοτικό τραγούδι η πονεμένη φωνή απευθύνεται απευθείας στον ξενιτεμένο, τον οποίο ονομάζει μεταφορικά «πουλί», και η αντίθεση «η ξενιτιά σε χαίρεται – εγώ έχω τον καημό σου» συμπυκνώνει τον πόνο της. Αντίθετα, στο πεζό κείμενο ένας αφηγητής εκτός ιστορίας παρουσιάζει τη μάνα σε γ΄ πρόσωπο· ο πόνος της δεν δηλώνεται ευθέως, αλλά υποβάλλεται μέσα από εικόνες (το κλειστό γράμμα, ο αέρας στα παντζούρια) και από τις σκέψεις της. Έτσι, ενώ το θέμα είναι κοινό, το ποίημα το αποδίδει με λιτότητα και ρυθμό, το πεζό με λεπτομέρειες και υπαινιγμό." }
];

/* ================= WIDGETS ================= */
var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* 1.1 — Ποιος αφηγείται; */
  nb1voice(box) {
    let it, sc = 0, tot = 0, stepK = null, stepP = null;
    box.innerHTML = `<div class="wctl"><span class="nb1score"></span><button class="btn ghost small nx">↻ Άλλο απόσπασμα</button></div>
      <div class="nb1card"></div><div><b>1. Τύπος αφηγητή</b></div><div class="nb1opts ok1"></div><div><b>2. Πρόσωπο αφήγησης</b></div><div class="nb1opts ok2"></div><div class="nb1fb wout"></div>`;
    const card = $(".nb1card", box), o1 = $(".ok1", box), o2 = $(".ok2", box), fb = $(".nb1fb", box);
    function score() { $(".nb1score", box).textContent = `Σωστά: ${sc} / ${tot}`; }
    function next() {
      it = nb1Pick(NB1_NAR); stepK = stepP = null; card.innerHTML = nb1Esc(it.t); fb.innerHTML = "Διάλεξε τύπο αφηγητή και πρόσωπο.";
      nb1Btns(o1, Object.values(NB1_KNAME), Object.keys(NB1_KNAME)).forEach(b => b.onclick = () => { if (stepK) return; stepK = b.dataset.v; b.classList.add(stepK === it.k ? "ok" : "no"); if (stepK !== it.k) o1.querySelector(`[data-v="${it.k}"]`).classList.add("ok"); done(); });
      nb1Btns(o2, ["α΄ πρόσωπο (πρωτοπρόσωπη)", "γ΄ πρόσωπο (τριτοπρόσωπη)"], ["1", "3"]).forEach(b => b.onclick = () => { if (stepP) return; stepP = +b.dataset.v; b.classList.add(stepP === it.p ? "ok" : "no"); if (stepP !== it.p) o2.querySelector(`[data-v="${it.p}"]`).classList.add("ok"); done(); });
      score();
    }
    function done() {
      if (!stepK || !stepP) return;
      tot++; const ok = stepK === it.k && stepP === it.p; if (ok) sc++; score();
      fb.innerHTML = `${ok ? "✔ Σωστά!" : "✘ Δες τη σωστή απάντηση (πράσινο)."} <b>${NB1_KNAME[it.k]}, ${it.p === 1 ? "α΄" : "γ΄"} πρόσωπο.</b> ${nb1Esc(it.w)}<br><span class="muted small">Θυμήσου: ο αφηγητής είναι πλασματικό πρόσωπο — δεν ταυτίζεται με τον συγγραφέα.</span>`;
    }
    $(".nx", box).onclick = next; next();
  },

  /* 1.2 — Κλικ στις περιόδους: αφηγηματικοί τρόποι */
  nb1modes(box) {
    box.innerHTML = `<div class="wctl"><label>Κείμενο <select class="sp">${NB1_PASSAGES.map((p, i) => `<option value="${i}">${nb1Esc(p.title)}</option>`).join("")}</select></label>
      <button class="btn primary small ck">Έλεγχος</button><button class="btn ghost small rs">↺</button></div>
      <div class="nb1lg">${NB1_MODES.map(m => `<span><i style="background:${NB1_MCOL[m]}"></i>${m}</span>`).join("")}</div>
      <p class="muted small">👆 Πάτα κάθε τμήμα του κειμένου όσες φορές χρειάζεται, ώσπου να δείξει τον σωστό αφηγηματικό τρόπο. Μετά πάτα «Έλεγχος».</p>
      <div class="nb1card tx"></div><div class="nb1fb wout"></div>`;
    let lab = [];
    function draw() {
      const P = NB1_PASSAGES[+$(".sp", box).value];
      $(".tx", box).innerHTML = P.s.map((x, i) => `<span class="nb1sent" data-i="${i}">${lab[i] != null ? `<span class="nb1tag" style="background:${NB1_MCOL[NB1_MODES[lab[i]]]}">${NB1_MODES[lab[i]]}</span>` : ""}${nb1Esc(x[0]).replace(/\n/g, "<br>")}</span> `).join("");
      $(".tx", box).querySelectorAll(".nb1sent").forEach(el => el.onclick = () => { const i = +el.dataset.i; lab[i] = lab[i] == null ? 0 : (lab[i] + 1) % NB1_MODES.length; draw(); $(".nb1fb", box).innerHTML = ""; });
    }
    $(".sp", box).onchange = () => { lab = []; draw(); $(".nb1fb", box).innerHTML = ""; };
    $(".rs", box).onclick = () => { lab = []; draw(); $(".nb1fb", box).innerHTML = ""; };
    $(".ck", box).onclick = () => {
      const P = NB1_PASSAGES[+$(".sp", box).value]; let ok = 0;
      const rows = P.s.map((x, i) => { const g = lab[i] != null && NB1_MODES[lab[i]] === x[1]; if (g) ok++; return `<li>${g ? "✔" : "✘"} Τμήμα ${i + 1}: <b>${x[1]}</b>${lab[i] != null && !g ? ` (έγραψες: ${NB1_MODES[lab[i]]})` : lab[i] == null ? " (χωρίς επιλογή)" : ""}</li>`; }).join("");
      $(".nb1fb", box).innerHTML = `<b>${ok} / ${P.s.length} σωστά.</b><ul style="margin:6px 0 0 18px">${rows}</ul><span class="muted small">Κάθε τρόπος έχει λειτουργία: η αφήγηση εξελίσσει τη δράση, η περιγραφή δημιουργεί ατμόσφαιρα, ο διάλογος ζωντανεύει τα πρόσωπα, ο εσωτερικός μονόλογος φανερώνει τον ψυχικό κόσμο, το σχόλιο προβάλλει τις απόψεις του αφηγητή.</span>`;
    };
    draw();
  },

  /* 1.3 — Ιστορία (χρονολογική σειρά) ↔ κείμενο (σειρά αφήγησης) */
  nb1time(box) {
    box.innerHTML = `<div class="wctl"><label>Ιστορία <select class="ss">${NB1_STORIES.map((s, i) => `<option value="${i}">${nb1Esc(s.title)}</option>`).join("")}</select></label><button class="btn ghost small rs">↺</button></div>
      <p class="muted small">👆 Τα επεισόδια φαίνονται με τη σειρά που τα αφηγείται το κείμενο. Πάτα τα με τη <b>χρονολογική</b> σειρά που συνέβησαν (από το παλαιότερο στο νεότερο).</p>
      <div class="eps"></div><div class="nb1tl"></div><div class="nb1fb wout"></div>`;
    let picked = [];
    function draw() {
      const S = NB1_STORIES[+$(".ss", box).value], n = S.ep.length;
      const E = $(".eps", box);
      if (E.dataset.s !== $(".ss", box).value) { E.dataset.s = $(".ss", box).value; E.innerHTML = S.ep.map((e, i) => `<button class="nb1ep" data-i="${i}"><b></b>${nb1Esc(e.t)}</button>`).join(""); E.querySelectorAll(".nb1ep").forEach(b => b.onclick = () => onEp(b)); }
      E.querySelectorAll(".nb1ep").forEach((b, i) => { const k = picked.indexOf(i); b.classList.toggle("done", k >= 0); b.querySelector("b").textContent = `Κείμενο ${i + 1}${k >= 0 ? ` → ${k + 1}ο` : ""}`; });
      function onEp(b) {
        const i = +b.dataset.i; if (picked.includes(i)) return;
        const want = S.ep.map((e, j) => [e.c, j]).sort((a, b) => a[0] - b[0])[picked.length][1];
        if (i !== want) { $(".nb1fb", box).innerHTML = `✘ Όχι ακόμη: υπάρχει επεισόδιο που συνέβη <b>νωρίτερα</b>. Ψάξε δείκτες χρόνου (θυμάται, είχε…, αργότερα θα…).`; return; }
        picked.push(i); $(".nb1fb", box).innerHTML = "✔ Σωστά."; draw();
      }
      const W = 560, H = 170, x = k => 40 + k * (W - 80) / Math.max(1, n - 1);
      let svg = "";
      if (picked.length === n) {
        const chron = S.ep.map((e, j) => [e.c, j]).sort((a, b) => a[0] - b[0]).map(z => z[1]);
        svg = `<svg viewBox="0 0 ${W} ${H + 8}" style="width:100%;max-width:${W}px;display:block;margin:8px auto"><text x="29" y="20" style="font:700 11px var(--sans);fill:var(--muted)">Κείμενο (σειρά αφήγησης)</text><text x="29" y="166" style="font:700 11px var(--sans);fill:var(--muted)">Ιστορία (χρονολογική σειρά)</text>
          <line x1="40" y1="42" x2="${W - 40}" y2="42" stroke="#e0b4ad" stroke-width="2"/><line x1="40" y1="130" x2="${W - 40}" y2="130" stroke="#e0b4ad" stroke-width="2"/>`;
        S.ep.forEach((e, i) => { const k = chron.indexOf(i), col = /Αναδρομή/.test(e.k) ? "#6F42C1" : /Πρόληψη/.test(e.k) ? "#C77A0A" : "#C62828";
          svg += `<line x1="${x(i)}" y1="42" x2="${x(k)}" y2="130" stroke="${col}" stroke-width="2.5" opacity=".75"/><circle cx="${x(i)}" cy="42" r="11" fill="${col}"/><text x="${x(i)}" y="46" text-anchor="middle" style="font:700 11px var(--sans);fill:#fff">${i + 1}</text><circle cx="${x(k)}" cy="130" r="11" fill="#fff" stroke="${col}" stroke-width="2.5"/><text x="${x(k)}" y="134" text-anchor="middle" style="font:700 11px var(--sans);fill:${col}">${i + 1}</text>`; });
        svg += `</svg>`;
        $(".nb1fb", box).innerHTML = `<b>Μπράβο!</b> Όπου οι γραμμές «σταυρώνουν», η σειρά του κειμένου διαφέρει από τη σειρά της ιστορίας:<ul style="margin:6px 0 0 18px">${S.ep.map((e, i) => `<li>Επεισόδιο ${i + 1}: <b>${e.k}</b></li>`).join("")}</ul>
          <div class="nb1lg"><span><i style="background:#C62828"></i>κύρια δράση</span><span><i style="background:#6F42C1"></i>αναδρομή</span><span><i style="background:#C77A0A"></i>πρόληψη</span></div>`;
      }
      $(".nb1tl", box).innerHTML = svg;
    }
    $(".ss", box).onchange = $(".rs", box).onclick = () => { picked = []; $(".nb1fb", box).innerHTML = ""; draw(); };
    draw();
  },

  /* 1.4 — Ντετέκτιβ σχημάτων λόγου */
  nb1fig(box) {
    let it, sc = 0, tot = 0, ans = false;
    box.innerHTML = `<div class="wctl"><label>Εξάσκηση σε <select class="sf"><option value="">όλα τα εκφραστικά μέσα</option>${NB1_FIGS.filter(f => NB1_FIG.some(x => x.a === f)).map(f => `<option>${f}</option>`).join("")}</select></label><span class="nb1score"></span><button class="btn ghost small nx">↻ Επόμενο</button></div>
      <div class="nb1card"></div><div class="nb1opts"></div><div class="nb1fb wout"></div>`;
    function next() {
      const f = $(".sf", box).value, pool = NB1_FIG.filter(x => !f || x.a === f);
      let c; do { c = nb1Pick(pool); } while (pool.length > 1 && c === it); it = c; ans = false;
      $(".nb1card", box).innerHTML = nb1Esc(it.t);
      const opts = nb1Shuf([it.a, ...nb1Shuf(NB1_FIGS.filter(o => o !== it.a && !(it.x || []).includes(o))).slice(0, 3)]);
      nb1Btns($(".nb1opts", box), opts).forEach(b => b.onclick = () => {
        if (ans) return; ans = true; tot++; const ok = b.textContent === it.a; if (ok) sc++;
        b.classList.add(ok ? "ok" : "no"); $(".nb1opts", box).querySelectorAll("button").forEach(z => { if (z.textContent === it.a) z.classList.add("ok"); });
        $(".nb1fb", box).innerHTML = `${ok ? "✔ Σωστά!" : "✘ Όχι."} <b>${it.a}</b>: ${nb1Esc(it.w)}${it.x ? `<br><span class="muted small">Υπάρχει επίσης: ${it.x.join(", ")}.</span>` : ""}<br><span class="muted small">Στις εξετάσεις μη σταματάς στην αναγνώριση: γράψε και τη <b>λειτουργία</b> του σχήματος (τι τονίζει, τι συναίσθημα δημιουργεί).</span>`;
        $(".nb1score", box).textContent = `Σωστά: ${sc} / ${tot}`;
      });
      $(".nb1fb", box).innerHTML = "Ποιο εκφραστικό μέσο κυριαρχεί;";
      $(".nb1score", box).textContent = `Σωστά: ${sc} / ${tot}`;
    }
    $(".nx", box).onclick = next; $(".sf", box).onchange = next; next();
  },

  /* 1.5 — Αναλυτής μέτρου και ομοιοκαταληξίας */
  nb1metre(box) {
    box.innerHTML = `<div class="wctl"><label>Στίχος <select class="sv">${NB1_VERSE.map((v, i) => `<option value="${i}">${nb1Esc(v.t)}</option>`).join("")}<option value="free">✎ Δικός μου στίχος…</option></select></label></div>
      <div class="fr" style="display:none"><input class="fi" type="text" style="width:100%;max-width:520px;font:16px Georgia,serif;padding:8px 10px;border-radius:9px;border:1px solid var(--line)" value="Το βράδυ σβήνει σιγανά τα φώτα στο λιμάνι"></div>
      <div class="src muted small"></div><div class="nb1syl"></div>
      <p class="muted small">👆 Πάτα μια συλλαβή για να ορίσεις/αφαιρέσεις τόνο (π.χ. σε τονισμένη μονοσύλλαβη λέξη: «γης», «βια»). Πάτα το «·» ανάμεσα σε δύο συλλαβές για να τις ενώσεις (συνίζηση / συνεκφώνηση «‿») ή να τις χωρίσεις.</p>
      <div class="nb1fb wout"></div>
      <hr style="border:0;border-top:1px solid var(--line);margin:14px 0">
      <div class="wctl"><b>Ομοιοκαταληξία τετράστιχου</b><button class="btn ghost small nq">↻ Νέο τετράστιχο</button></div>
      <div class="nb1card rq"></div><div class="nb1opts ro"></div><div class="nb1fb rf"></div>`;
    let syl = [], join = [], st = [];
    const V = "αεηιουωάέήίόύώϊϋΐΰ";
    function auto(text) {
      /* απλός συλλαβισμός: φωνήεντα/δίψηφα = πυρήνες· συνίζηση άτονου ι/υ πριν από φωνήεν· συνεκφώνηση ανάμεσα σε λέξεις */
      const words = text.replace(/[.,;:!·«»"()—–-]/g, " ").split(/\s+/).filter(Boolean);
      for (let i = words.length - 1; i >= 0; i--) if (!/[αεηιουωάέήίόύώϊϋΐΰ]/i.test(words[i])) { if (i < words.length - 1) { words[i + 1] = words[i] + words[i + 1]; words.splice(i, 1); } else if (i > 0) { words[i - 1] += words[i]; words.splice(i, 1); } }
      const out = []; const jn = [];
      words.forEach((w, wi) => {
        const lw = w.toLowerCase(); const nuc = [];
        for (let i = 0; i < lw.length; i++) {
          const c = lw[i]; if (!V.includes(c)) continue;
          const d = lw[i + 1] || "";
          const di = (/[αεου]/.test(c) && /[ιί]/.test(d)) || (c === "ο" && /[υύ]/.test(d)) || (/[αεη]/.test(c) && /[υύ]/.test(d));
          if (di && !/[ϊϋΐΰ]/.test(d)) { nuc.push([i, i + 1]); i++; continue; }
          nuc.push([i, i]);
        }
        /* συνίζηση: άτονο ι/υ (ή ει/οι) ακολουθούμενο από φωνήεν, με σύμφωνο πριν */
        const merged = [];
        nuc.forEach((n, k) => {
          const prev = merged[merged.length - 1];
          if (prev && n[0] === prev[1] + 1) {
            const a = lw.slice(prev[0], prev[1] + 1);
            if (/^[ιυ]$/.test(a) && prev[0] > 0 && !V.includes(lw[prev[0] - 1])) { prev[1] = n[1]; return; }
          }
          merged.push(n.slice());
        });
        if (!merged.length) { if (out.length) out[out.length - 1] += w; else out.push(w); return; }
        let start = 0;
        merged.forEach((n, k) => {
          const nextN = merged[k + 1];
          let end;
          if (!nextN) end = w.length;
          else {
            const cons = nextN[0] - n[1] - 1;
            end = cons <= 1 ? n[1] + 1 : n[1] + 1 + (cons - (/(μπ|ντ|γκ|τσ|τζ|στ|σπ|σκ|σθ|σχ|σφ|τρ|πρ|κρ|βρ|γρ|δρ|θρ|φρ|χρ|πλ|κλ|βλ|γλ|φλ|χλ|θλ|γν|κν|μν|πτ|κτ|φθ|χθ)$/.test(lw.slice(nextN[0] - 2, nextN[0])) ? 2 : 1));
          }
          out.push(w.slice(start, end)); start = end;
          if (k < merged.length - 1) jn.push(false);
        });
        if (wi < words.length - 1) {
          const last = lw[lw.length - 1], nx = words[wi + 1].toLowerCase()[0];
          jn.push("w" + (V.includes(last) && V.includes(nx) ? "1" : "0"));
        }
      });
      return { out, jn };
    }
    function load() {
      const v = $(".sv", box).value;
      $(".fr", box).style.display = v === "free" ? "" : "none";
      if (v === "free") {
        const r = auto($(".fi", box).value); syl = r.out; join = r.jn.map(j => j === "w1"); st = syl.map(s => NB1_ACC.test(s));
        $(".src", box).textContent = "Αυτόματος συλλαβισμός (προσεγγιστικός) — διόρθωσέ τον με κλικ αν χρειάζεται.";
        box._wb = r.jn.map(j => typeof j === "string");
      } else {
        const it = NB1_VERSE[+v];
        const parts = it.s.split("|"); syl = []; join = []; st = []; box._wb = [];
        /* τα όρια λέξεων τα βρίσκουμε συγκρίνοντας με το κείμενο */
        const words = it.t.replace(/[.,;:!·«»]/g, "").split(/\s+/); let wi = 0, acc = "";
        parts.forEach((p, k) => {
          const sub = p.replace(/^\*/, "").split("_");
          sub.forEach((q, m) => {
            syl.push(q); st.push(NB1_ACC.test(q) || (m === 0 && p.startsWith("*")));
            acc += q;
            const endW = acc.length >= words[wi].replace(/'/g, "").length;
            if (endW) { wi++; acc = ""; }
            if (k < parts.length - 1 || m < sub.length - 1) { join.push(m < sub.length - 1); box._wb.push(endW); }
          });
        });
        $(".src", box).textContent = "Πηγή: " + it.src;
      }
      draw();
    }
    function groups() { const g = [[0]]; for (let i = 1; i < syl.length; i++) { if (join[i - 1]) g[g.length - 1].push(i); else g.push([i]); } return g; }
    function draw() {
      const g = groups(); let h = "";
      g.forEach((gr, k) => {
        gr.forEach((i, m) => {
          if (m > 0) h += `<span class="nb1j m" data-j="${i - 1}" title="χώρισε">‿</span>`;
          h += `<span class="nb1s"><b class="${st[i] ? "st" : ""}" data-s="${i}">${nb1Esc(syl[i])}</b>${m === gr.length - 1 ? `<small>${k + 1}</small>` : "<small>&nbsp;</small>"}</span>`;
        });
        const last = gr[gr.length - 1];
        if (k < g.length - 1) h += `<span class="nb1j${box._wb[last] ? " w" : ""}" data-j="${last}" title="ένωσε">${box._wb[last] ? "␣" : "·"}</span>`;
      });
      $(".nb1syl", box).innerHTML = h;
      $(".nb1syl", box).querySelectorAll("b[data-s]").forEach(b => b.onclick = () => { const i = +b.dataset.s; st[i] = !st[i]; draw(); });
      $(".nb1syl", box).querySelectorAll(".nb1j").forEach(b => b.onclick = () => { const j = +b.dataset.j; join[j] = !join[j]; draw(); });
      const pos = []; g.forEach((gr, k) => { if (gr.some(i => st[i])) pos.push(k + 1); });
      const n = g.length, m = nb1Metre(n, pos);
      const lastSt = pos[pos.length - 1], ending = lastSt === n ? "οξύτονος (τόνος στην τελευταία συλλαβή)" : lastSt === n - 1 ? "παροξύτονος (τόνος στην παραλήγουσα)" : lastSt === n - 2 ? "προπαροξύτονος" : "—";
      $(".nb1fb", box).innerHTML = `<b>${n} μετρικές συλλαβές</b>${n === 15 ? " — <b>δεκαπεντασύλλαβος</b>" : n === 8 ? " — οκτασύλλαβος" : n === 7 ? " — επτασύλλαβος" : n === 11 ? " — ενδεκασύλλαβος" : n === 12 ? " — δωδεκασύλλαβος" : ""} · τονισμένες θέσεις: <b>${pos.join(", ") || "—"}</b><br>
        Μέτρο: <b>${m}</b>${m === "ιαμβικός" ? " (άτονη – τονισμένη: τόνοι σε ζυγές θέσεις)" : m === "τροχαϊκός" ? " (τονισμένη – άτονη: τόνοι σε μονές θέσεις)" : ""} · στίχος ${ending}${n === 15 && m === "ιαμβικός" ? "<br><span class=\"muted small\">Ο ιαμβικός δεκαπεντασύλλαβος έχει συνήθως τομή (μικρή παύση) μετά την 8η συλλαβή: δύο ημιστίχια 8 + 7.</span>" : ""}`;
    }
    $(".sv", box).onchange = load; $(".fi", box).oninput = load;
    /* ομοιοκαταληξία */
    function rq() {
      const pat = nb1Pick(["ααββ", "αβαβ", "αββα"]); const pr = nb1Two();
      const L = pat === "ααββ" ? [pr[0][0], pr[0][1], pr[1][0], pr[1][1]] : pat === "αβαβ" ? [pr[0][0], pr[1][0], pr[0][1], pr[1][1]] : [pr[0][0], pr[1][0], pr[1][1], pr[0][1]];
      $(".rq", box).innerHTML = L.map(l => nb1Esc(l)).join("<br>");
      const names = { "ααββ": "Ζευγαρωτή (αα ββ)", "αβαβ": "Πλεχτή (αβ αβ)", "αββα": "Κλειστή (α ββ α)" };
      let dn = false;
      nb1Btns($(".ro", box), Object.values(names)).forEach(b => b.onclick = () => { if (dn) return; dn = true; const ok = b.textContent === names[pat]; b.classList.add(ok ? "ok" : "no"); $(".ro", box).querySelectorAll("button").forEach(z => { if (z.textContent === names[pat]) z.classList.add("ok"); }); $(".rf", box).innerHTML = `${ok ? "✔ Σωστά!" : "✘ Όχι."} Σχήμα <b>${pat}</b>: ομοιοκαταληκτούν οι στίχοι ${pat === "ααββ" ? "1–2 και 3–4" : pat === "αβαβ" ? "1–3 και 2–4" : "1–4 και 2–3"}. <span class="muted small">(Πρωτότυποι στίχοι εξάσκησης.)</span>`; });
      $(".rf", box).innerHTML = "Ποιο είναι το σχήμα της ομοιοκαταληξίας;";
    }
    $(".nq", box).onclick = rq;
    load(); rq();
  },

  /* 1.6 — Χρονολόγιο ρευμάτων */
  nb1eras(box) {
    box.innerHTML = `<p class="muted small">👆 Πάτα μια περίοδο για χαρακτηριστικά και δημιουργούς. Με κόκκινη ετικέτα: τα εξεταστέα κείμενα των Παγκυπρίων.</p><div class="nb1era"></div><div class="wout info"></div>
      <hr style="border:0;border-top:1px solid var(--line);margin:14px 0"><div class="wctl"><b>Γρήγορο τεστ</b><span class="nb1score"></span><button class="btn ghost small nx">↻ Επόμενη</button></div><div class="nb1card qq" style="font-family:var(--sans);font-size:15px"></div><div class="nb1opts qo"></div><div class="nb1fb qf"></div>`;
    let cur = 0, sc = 0, tot = 0;
    function show() {
      const eb = $(".nb1era", box);
      if (!eb.children.length) { eb.innerHTML = NB1_ERAS.map((e, i) => `<button data-i="${i}"><b>${e.n}</b><small>${e.d}</small></button>`).join(""); eb.querySelectorAll("button").forEach(b => b.onclick = () => { cur = +b.dataset.i; show(); }); }
      eb.querySelectorAll("button").forEach((b, i) => b.classList.toggle("on", i === cur));
      const e = NB1_ERAS[cur];
      $(".info", box).innerHTML = `<b>${e.n}</b> · <span class="muted">${e.d}</span><ul style="margin:6px 0 6px 18px">${e.f.map(x => `<li>${x}</li>`).join("")}</ul><b>Δημιουργοί:</b> ${e.a.join(" · ")}${e.pr ? `<br><b>Στην ύλη:</b> ${e.pr.map(p => `<span class="nb1pr">${p}</span>`).join(" ")}` : ""}`;
    }
    function q() {
      const it = nb1Pick(NB1_ERAQ); let dn = false;
      $(".qq", box).textContent = it.q;
      const opts = nb1Shuf([it.a, ...nb1Shuf(NB1_ERANAMES.filter(o => o !== it.a)).slice(0, 3)]);
      $(".qf", box).innerHTML = "";
      nb1Btns($(".qo", box), opts).forEach(b => b.onclick = () => { if (dn) return; dn = true; tot++; const ok = b.textContent === it.a; if (ok) sc++; b.classList.add(ok ? "ok" : "no"); $(".qo", box).querySelectorAll("button").forEach(z => { if (z.textContent === it.a) z.classList.add("ok"); }); $(".qf", box).innerHTML = ok ? "✔ Σωστά!" : `✘ Σωστό: <b>${it.a}</b>.`; $(".nb1score", box).textContent = `Σωστά: ${sc} / ${tot}`; });
      $(".nb1score", box).textContent = `Σωστά: ${sc} / ${tot}`;
    }
    $(".nx", box).onclick = q; show(); q();
  },

  /* 1.7 — Πίνακας σύγκρισης διδαγμένου–αδίδακτου */
  nb1cmp(box) {
    box.innerHTML = `<div class="wctl"><label>Ζεύγος <select class="sc">${NB1_CMP.map((c, i) => `<option value="${i}">${nb1Esc(c.title)}</option>`).join("")}</select></label></div>
      <div class="figrow tx"></div>
      <p class="muted small">Συμπλήρωσε τον πίνακα: για κάθε κριτήριο διάλεξε τι ισχύει στο κάθε κείμενο και αν πρόκειται για ομοιότητα ή διαφορά.</p>
      <div class="nb1mxw"><table class="nb1mx"></table></div>
      <div class="wctl" style="margin-top:10px"><button class="btn primary small ck">Έλεγχος</button><button class="btn ghost small md">Δείξε ενδεικτική σύγκριση</button></div>
      <div class="nb1fb wout"></div><div class="mdl"></div>`;
    function draw() {
      const C = NB1_CMP[+$(".sc", box).value];
      $(".tx", box).innerHTML = [C.A, C.B].map(T => `<div><div class="nb1card" style="font-size:15px"><b style="font-family:var(--sans);font-size:13px;color:var(--blue)">${nb1Esc(T.name)}</b><br>${nb1Esc(T.text).replace(/\n/g, "<br>")}</div></div>`).join("");
      const sel = (opts, cls) => `<select class="${cls}"><option value="">— επίλεξε —</option>${opts.map((o, i) => `<option value="${i}">${nb1Esc(o)}</option>`).join("")}</select>`;
      $(".nb1mx", box).innerHTML = `<tr><th>Κριτήριο</th><th>Κείμενο Α</th><th>Κείμενο Β</th><th>Σχέση</th></tr>` + C.rows.map((r, i) => `<tr data-i="${i}"><th>${r.c}</th><td>${sel(r.A, "a")}</td><td>${sel(r.B, "b")}</td><td>${sel(r.rel, "r")}</td></tr>`).join("");
      $(".nb1fb", box).innerHTML = ""; $(".mdl", box).innerHTML = "";
    }
    $(".sc", box).onchange = draw;
    $(".ck", box).onclick = () => {
      const C = NB1_CMP[+$(".sc", box).value]; let ok = 0, all = 0; const why = [];
      box.querySelectorAll(".nb1mx tr[data-i]").forEach(tr => {
        const r = C.rows[+tr.dataset.i];
        [["a", r.aA], ["b", r.aB], ["r", r.ar]].forEach(([c, w]) => { const s = tr.querySelector("." + c), td = s.parentElement; all++; td.classList.remove("ok", "no"); if (s.value !== "" && +s.value === w) { ok++; td.classList.add("ok"); } else td.classList.add("no"); });
        why.push(`<li><b>${r.c}:</b> ${r.why}</li>`);
      });
      $(".nb1fb", box).innerHTML = `<b>${ok} / ${all} σωστά κελιά.</b><ul style="margin:6px 0 0 18px">${why.join("")}</ul>`;
    };
    $(".md", box).onclick = () => { const C = NB1_CMP[+$(".sc", box).value]; const m = $(".mdl", box); m.innerHTML = m.innerHTML ? "" : `<div class="tbox ex" style="margin-top:10px"><h4>Ενδεικτική σύγκριση (μία παράγραφος)</h4><p>${C.model}</p><p class="muted small">Δομή: κοινό θέμα → διαφορές (φωνή, εκφραστικά μέσα, μορφή) με τεκμήρια από τα κείμενα → σύνθεση. Διαρθρωτικές λέξεις: «και τα δύο», «αντίθετα», «ενώ», «επιπλέον», «τέλος».</p></div>`; };
    draw();
  }
});

/* ================= ΓΕΝΝΗΤΡΙΕΣ ================= */
var GENS = Object.assign(window.GENS || {}, {
  nb1gNar: { title: "Γεννήτρια — τύπος αφηγητή", make() {
    const it = nb1Pick(NB1_NAR), ask = Math.random() < 0.75 ? "k" : "p";
    const q = R`Να διαβάσετε το απόσπασμα (πρωτότυπο κείμενο εξάσκησης):${PASSAGE(it.t)}${ask === "k" ? "Τι είδους αφηγητής αφηγείται την ιστορία;" : "Σε ποιο πρόσωπο γίνεται η αφήγηση;"}`;
    const ex = { q, hint: ask === "k" ? "Ρώτα: συμμετέχει ο αφηγητής στην ιστορία; Αν ναι, είναι ο πρωταγωνιστής ή ένας παρατηρητής;" : "Κοίτα τα ρήματα: «εγώ/εμείς» ή «αυτός/αυτή/αυτοί»;", sol: R`<b>${NB1_KNAME[it.k]}</b>, αφήγηση σε <b>${it.p === 1 ? "α΄" : "γ΄"} πρόσωπο</b>. ${it.w}` };
    if (ask === "k") return nb1MC(ex, NB1_KNAME[it.k], Object.values(NB1_KNAME), 2);
    return nb1MC(ex, it.p === 1 ? "Α΄ πρόσωπο (πρωτοπρόσωπη αφήγηση)" : "Γ΄ πρόσωπο (τριτοπρόσωπη αφήγηση)", ["Α΄ πρόσωπο (πρωτοπρόσωπη αφήγηση)", "Γ΄ πρόσωπο (τριτοπρόσωπη αφήγηση)"], 1);
  } },
  nb1gMode: { title: "Γεννήτρια — αφηγηματικοί τρόποι και απόδοση λόγου", make() {
    if (Math.random() < 0.8) {
      const it = nb1Pick(NB1_MODE);
      return nb1MC({ q: R`Ποιος αφηγηματικός τρόπος κυριαρχεί στο απόσπασμα (πρωτότυπο κείμενο εξάσκησης);${PASSAGE(it.t.replace(/\n/g, "\n\n"))}`, hint: "Εξελίσσεται η δράση, «σταματά» για να δείξει χώρο/πρόσωπο, μιλούν τα πρόσωπα, ακούμε τις σκέψεις τους ή ο αφηγητής κρίνει;", sol: R`<b>${it.a}</b>. ${it.w}` }, it.a, NB1_MODES, 3);
    }
    const it = nb1Pick(NB1_SPEECH);
    return nb1MC({ q: R`Πώς αποδίδεται ο λόγος του προσώπου στη φράση;${PASSAGE(it.t)}`, hint: "Αυτούσια λόγια (εισαγωγικά/παύλα) ή μεταφορά τους από τον αφηγητή με «ότι/πως/αν»;", sol: R`<b>${it.a}</b>. ${it.w}` }, it.a, ["Ευθύς λόγος", "Πλάγιος λόγος"], 1);
  } },
  nb1gTime: { title: "Γεννήτρια — χρόνος της αφήγησης", make() {
    const it = nb1Pick(NB1_TIME);
    return nb1MC({ q: R`Ποια τεχνική σχετική με τον χρόνο της αφήγησης κυριαρχεί (πρωτότυπο κείμενο εξάσκησης);${PASSAGE(it.t)}`, hint: "Η αφήγηση πάει πίσω, μπροστά, τρέχει, «παγώνει», ξεκινά από τη μέση ή επαναλαμβάνει;", sol: R`<b>${it.a}</b>. ${it.w}` }, it.a, NB1_TIMES, 3, it.x || []);
  } },
  nb1gFig: { title: "Γεννήτρια — εκφραστικά μέσα", make() {
    const it = nb1Pick(NB1_FIG);
    return nb1MC({ q: R`Ποιο εκφραστικό μέσο κυριαρχεί στη φράση (πρωτότυπο παράδειγμα);${PASSAGE(it.t)}`, hint: "Υπάρχει σύγκριση με «σαν/όπως»; Ταύτιση χωρίς «σαν»; Ανθρώπινες ιδιότητες σε άψυχο; Επανάληψη ήχων ή λέξεων;", sol: R`<b>${it.a}</b>. ${it.w}` }, it.a, NB1_FIGS, 3, it.x || []);
  } },
  nb1gMet: { title: "Γεννήτρια — μέτρο, συλλαβές και ομοιοκαταληξία", make() {
    const t = Math.random();
    if (t < 0.4) {
      const it = nb1Pick(NB1_VERSE), sc = nb1Scan(it.s);
      return { q: R`Πόσες <b>μετρικές συλλαβές</b> έχει ο στίχος; <span class="muted small">(${nb1Esc(it.src)})</span>${PASSAGE(it.t)}`, fields: [{ label: "Συλλαβές:", ans: sc.n }],
        hint: "Χώρισε σε συλλαβές· ένωσε σε μία τα γειτονικά φωνήεντα που προφέρονται μαζί (συνίζηση, συνεκφώνηση ανάμεσα σε λέξεις).",
        sol: R`Συλλαβισμός: <b>${sc.syl.join(" · ")}</b> → <b>${sc.n}</b> μετρικές συλλαβές (το «‿» δείχνει συνίζηση ή συνεκφώνηση).` };
    }
    if (t < 0.75) {
      const it = nb1Pick(NB1_VERSE), sc = nb1Scan(it.s);
      return nb1MC({ q: R`Ποιο είναι το μέτρο του στίχου; <span class="muted small">(${nb1Esc(it.src)})</span>${PASSAGE(it.t)}`, hint: "Βρες τις τονισμένες συλλαβές: πέφτουν σε ζυγές (2, 4, 6…) ή σε μονές (1, 3, 5…) θέσεις;",
        sol: R`Συλλαβές: ${sc.syl.join(" · ")} · τονισμένες θέσεις: <b>${sc.st.join(", ")}</b> → ${it.m === "ιαμβικός" ? "ζυγές θέσεις: <b>ιαμβικός</b> (άτονη–τονισμένη)" : "μονές θέσεις: <b>τροχαϊκός</b> (τονισμένη–άτονη)"}.` }, it.m === "ιαμβικός" ? "Ιαμβικός" : "Τροχαϊκός", ["Ιαμβικός", "Τροχαϊκός", "Δακτυλικός", "Αναπαιστικός"], 3);
    }
    const pat = nb1Pick(["ααββ", "αβαβ", "αββα"]), pr = nb1Two();
    const L = pat === "ααββ" ? [pr[0][0], pr[0][1], pr[1][0], pr[1][1]] : pat === "αβαβ" ? [pr[0][0], pr[1][0], pr[0][1], pr[1][1]] : [pr[0][0], pr[1][0], pr[1][1], pr[0][1]];
    const names = { "ααββ": "Ζευγαρωτή (ααββ)", "αβαβ": "Πλεχτή (αβαβ)", "αββα": "Κλειστή (αββα)" };
    return nb1MC({ q: R`Τι είδους ομοιοκαταληξία έχει το τετράστιχο (πρωτότυποι στίχοι εξάσκησης);${PASSAGE(L.join("\n"), { num: "line" })}`, hint: "Σημείωσε με το ίδιο γράμμα τους στίχους που «ταιριάζουν» στο τέλος τους (από την τονισμένη συλλαβή και μετά).",
      sol: R`Σχήμα <b>${pat}</b> → <b>${names[pat]}</b>: ομοιοκαταληκτούν οι στίχοι ${pat === "ααββ" ? "1–2 και 3–4" : pat === "αβαβ" ? "1–3 και 2–4" : "1–4 και 2–3"}.`, shuffle: true }, names[pat], Object.values(names), 2);
  } },
  nb1gEra: { title: "Γεννήτρια — ρεύματα και γενιές", make() {
    const it = nb1Pick(NB1_ERAQ), e = NB1_ERAS.find(x => x.n.startsWith(it.a));
    return nb1MC({ q: it.q, hint: "Σκέψου την εποχή, τη μορφή (μέτρο/ελεύθερος στίχος) και τα θέματα που χαρακτηρίζουν κάθε περίοδο.", sol: R`<b>${it.a}</b>.${e ? " Χαρακτηριστικά: " + e.f.slice(0, 2).join("· ") + "." : ""}` }, it.a, NB1_ERANAMES, 3);
  } }
});

/* Νέα Ελληνικά Γ΄ Λυκείου — Λογοτεχνία: εξεταστέα κείμενα (prefix nb2)
   Widgets: nb2w21 … nb2w34 (κάρτα μελέτης: χρονολόγιο · σύμβολα · σχέδιο απάντησης)
   Γεννήτριες: nb2g21 … nb2g34 (τράπεζα ερωτήσεων κειμένου + «ποιο κείμενο;»)
   Σημείωση πνευματικών δικαιωμάτων: εδώ δεν αναπαράγονται στίχοι/φράσεις των κειμένων — μόνο περιγραφές. */

/* ---------- δεδομένα έργων ---------- */
const NB2_WORKS = {
  "2.1": { au: "Κ. Π. Καβάφης", ti: "Αλεξανδρινοί Βασιλείς", yr: 1912, kind: "ποίημα", tag: "Ιστορικό ποίημα",
    when: "34 π.Χ. (το ιστορικό γεγονός) · 1912 (το ποίημα)",
    sym: [["Ο Καισαρίων με τα πολυτελή ενδύματα", "η θεατρική επίδειξη μιας εξουσίας χωρίς πραγματικό αντίκρισμα"],
      ["Ο τίτλος «Βασιλέας των Βασιλέων»", "η υπερβολική μεγαλοπρέπεια και η πολιτική προπαγάνδα"],
      ["Το Γυμνάσιο και η παράταξη των στρατιωτών", "το σκηνικό ενός σκηνοθετημένου δημόσιου θεάματος"],
      ["Οι Αλεξανδρινοί που ζητωκραυγάζουν", "το πλήθος που απολαμβάνει το θέαμα, αν και ξέρει ότι είναι κενό"],
      ["Η ζεστή, «ποιητική» μέρα", "η αισθητική γοητεία που υπερνικά προσωρινά την κριτική σκέψη"]],
    tip: "Ξεχώρισε τι ξέρουν οι Αλεξανδρινοί (ότι οι τίτλοι είναι κούφιοι) από το τι κάνουν (επευφημούν): εκεί βρίσκεται η ειρωνεία." },
  "2.2": { au: "Γιώργος Σεφέρης", ti: "Ελένη", yr: 1955, kind: "ποίημα", tag: "Γενιά του '30 · Κύπρος",
    when: "Μυθικός χρόνος (Τρωικός πόλεμος) · γραμμένο μετά το ταξίδι του ποιητή στην Κύπρο (1953) · δημοσίευση 1955",
    sym: [["Η Ελένη ως είδωλο / νεφέλη", "η ψευδαίσθηση και η πλάνη που γίνονται αιτία πολέμου"],
      ["Το άδειο πουκάμισο", "η ματαιότητα του πολέμου και των θυσιών για μια ανύπαρκτη αιτία"],
      ["Τα αηδόνια των Πλατρών", "η μνήμη, η ποίηση, ο θρήνος για τον ανθρώπινο πόνο"],
      ["Ο Τεύκρος", "ο ξεριζωμένος άνθρωπος που αναζητά την αλήθεια — το προσωπείο του ποιητή"],
      ["Η Σαλαμίνα της Κύπρου", "η ιστορική συνέχεια του ελληνισμού και η αναζήτηση πατρίδας"]],
    tip: "Το ποίημα είναι δραματικός μονόλογος: μιλά ο Τεύκρος, όχι ο Σεφέρης. Γράψε «το ποιητικό υποκείμενο (ο Τεύκρος)»." },
  "2.3": { au: "Οδυσσέας Ελύτης", ti: "Άξιον Εστί, Τα Πάθη, Άσμα ι΄", yr: 1959, kind: "ποίημα", tag: "Γενιά του '30",
    when: "Κατοχή – Αντίσταση – Β΄ Παγκόσμιος Πόλεμος · δημοσίευση 1959",
    sym: [["Τα αίματα", "οι θυσίες και οι αγώνες του ελληνικού λαού"],
      ["Το πέλαγος", "η ελληνική μοίρα, η δοκιμασία και η ελευθερία"],
      ["Η Μακρινή Μητέρα", "η πατρίδα, η Παναγία ή η ιδεατή μητρική προστασία"],
      ["Το Ρόδο το Αμάραντο", "η αθανασία, η ιδανική αγάπη και η πνευματική ομορφιά"],
      ["Η πέτρα", "οι δυσκολίες, η αντοχή και η ελληνική γη"],
      ["Το φως", "η ελπίδα, η δικαιοσύνη και η πνευματική λύτρωση"]],
    tip: "Η επωδός (το επαναλαμβανόμενο δίστιχο προσφώνησης) είναι το πιο συχνό ερώτημα: γράψε ότι δίνει μουσικότητα, ενότητα και συγκινησιακή ένταση." },
  "2.4": { au: "Γιάννης Ρίτσος", ti: "Αποχαιρετισμός", yr: 1957, kind: "ποίημα", tag: "Ποίηση του «εμείς» · Κύπρος",
    when: "Αγώνας της ΕΟΚΑ 1955–1959 · θάνατος του Γρηγόρη Αυξεντίου, 3 Μαρτίου 1957",
    sym: [["Η λευτεριά", "η εθνική και η οικουμενική ελευθερία που οφείλεται σε όλους"],
      ["Το φεγγάρι και ο ήλιος", "η ελπίδα, η πνευματική ολοκλήρωση και η αιώνια ζωή"],
      ["Το χρυσό νόμισμα (κωνσταντινάτο)", "η τιμή, η θυσία και η αθανασία του αγωνιστή"],
      ["Το βουνό και η σπηλιά", "ο αγώνας, η αντίσταση και ο τόπος της θυσίας"],
      ["Η καρδιά και ο κόρφος", "η ανθρώπινη ευαισθησία και η συλλογική συνείδηση"]],
    tip: "Στις εξετάσεις του 2026 ζητήθηκε πώς μεταμορφώνεται η σπηλιά: από σκοτεινός χώρος γίνεται φως/ήλιος — σχήμα λόγου: μεταφορά." },
  "2.5": { au: "Μανόλης Αναγνωστάκης", ti: "Θεσσαλονίκη, Μέρες του 1969 μ.Χ.", yr: 1970, kind: "ποίημα", tag: "Α΄ Μεταπολεμική Γενιά",
    when: "Δικτατορία των Συνταγματαρχών (1967–1974) · δημοσίευση 1970",
    sym: [["Η Τράπεζα Συναλλαγών", "η κυριαρχία της οικονομικής λογικής και της συναλλαγής"],
      ["Τα τουριστικά γραφεία", "η μετατροπή της χώρας σε χώρο εκμετάλλευσης και κατανάλωσης"],
      ["Τα πρακτορεία μεταναστεύσεως", "ο κοινωνικός και οικονομικός εξαναγκασμός στη μετανάστευση"],
      ["Τα παιδιά", "οι διαδοχικές γενιές που κληρονομούν τις ίδιες διαψεύσεις"],
      ["Η αλυσίδα", "η συνεχής αναπαραγωγή της ιστορικής και κοινωνικής ματαίωσης"],
      ["Το σύνθημα της χούντας για την ελληνικότητα", "ειρωνική αναφορά στην ιδεολογική προπαγάνδα της δικτατορίας"]],
    tip: "Ο τίτλος παραπέμπει στον Καβάφη (ιστορικές χρονολογίες «μ.Χ.»): η διακειμενική αναφορά κάνει το παρόν της δικτατορίας να μοιάζει με «ιστορία» παρακμής." },
  "2.6": { au: "Κώστας Μόντης", ti: "Τρίτο γράμμα στη μητέρα, ζ΄", yr: 1980, kind: "ποίημα", tag: "Κυπριακή ποίηση · 1974",
    when: "Τουρκική εισβολή 1974 · προσφυγιά, αγνοούμενοι · δημοσίευση 1980",
    sym: [["Το εγκαταλελειμμένο στρατόπεδο", "η ερημωμένη Κύπρος μετά την εισβολή"],
      ["Οι επιγραφές των στρατιωτών στους τοίχους", "η πρόωρη απώλεια νέων ανθρώπων — η μνήμη των νεκρών"],
      ["Η προσφώνηση «μητέρα»", "η εξομολογητική, θρηνητική επικοινωνία — η μητέρα-πατρίδα"],
      ["Οι ξένοι επισκέπτες που υπόσχονται ότι θα φροντίσουν", "η υποκρισία και η αδράνεια της διεθνούς κοινότητας"],
      ["Η εικόνα του εμπορίου", "η μετατροπή του κυπριακού δράματος σε αντικείμενο πολιτικής εκμετάλλευσης"]],
    tip: "Στις Παγκύπριες 2026 ζητήθηκαν (α) δύο τραγικές συνέπειες της εισβολής στους στ. 1–20 και (β) δύο σημεία ειρωνείας και δύο εκφραστικά μέσα της στους στ. 21–30." },
  "2.7": { au: "Παντελής Μηχανικός", ti: "Ονήσιλος", yr: 1975, kind: "ποίημα", tag: "Κυπριακή ποίηση · 1974",
    when: "Εξέγερση του Ονήσιλου κατά των Περσών (499/498–497 π.Χ.) · Κύπρος πριν και μετά το 1974 · το ποίημα γράφτηκε μετά την εισβολή", yl: "μετά το 1974",
    sym: [["Ο Ονήσιλος", "το διαχρονικό σύμβολο αντίστασης και ιστορικής εγρήγορσης"],
      ["Το κρανίο γεμάτο μέλισσες", "η ιστορική μνήμη που «κεντρίζει» για να αφυπνίσει"],
      ["Το χοντρό δέρμα (μεταφορά)", "η αδιαφορία και η πνευματική αδράνεια των ανθρώπων"],
      ["Ο εισβολέας που πλησιάζει", "η απειλή που τελικά έρχεται"],
      ["Η Σαλαμίνα", "η αρχαία κυπριακή πόλη-σύμβολο της ελληνικής Κύπρου"]],
    tip: "Θυμήσου την πηγή: τον Ηρόδοτο (βιβλίο Ε΄). Ο ποιητής μεταπλάθει την ιστορία για να κατηγορήσει τον εφησυχασμό της σύγχρονης Κύπρου." },
  "2.8": { au: "Κυριάκος Χαραλαμπίδης", ti: "Στα στέφανα της κόρης του", yr: 1989, kind: "ποίημα", tag: "Κυπριακή ποίηση · αγνοούμενοι",
    when: "Μετά την εισβολή του 1974 · το δράμα των αγνοουμένων · συλλογή «Θόλος» (1989)",
    sym: [["Τα στέφανα (ο γάμος)", "η χαρά της ζωής που συνεχίζεται — σε αντίθεση με την απουσία"],
      ["Ο πατέρας που μένει κρυμμένος στην εκκλησία", "η αόρατη, σιωπηλή παρουσία του αγνοουμένου"],
      ["Η Ανατολή", "οι φυλακές και ο τόπος όπου χάθηκαν οι αγνοούμενοι"],
      ["Η Πράσινη Γραμμή", "η διαίρεση του νησιού"],
      ["Η επιστροφή στη γη", "ο θάνατος — και η γη της πατρίδας"],
      ["Τα χωράφια (η γη) του πατέρα", "η περιουσία και ο τόπος που χάθηκαν"]],
    tip: "Η ειρωνεία: οι καλεσμένοι τον περνούν για περιθωριακό του χωριού, ενώ είναι ο πατέρας της νύφης. Ο αναγνώστης ξέρει περισσότερα από τους καλεσμένους." },
  "3.1": { au: "Γιώργος Ιωάννου", ti: "†13-12-43", yr: 1964, kind: "πεζό", tag: "Μεταπολεμική πεζογραφία",
    when: "Ολοκαύτωμα των Καλαβρύτων, 13 Δεκεμβρίου 1943 · η επίσκεψη γίνεται περίπου είκοσι χρόνια μετά · δημοσίευση 1964",
    sym: [["Ο λόφος με τον λευκό σταυρό", "ο τόπος μαρτυρίου και ιστορικής μνήμης"],
      ["Τα αδέρφια που ξεθάβουν τον αδελφό τους", "η ευλάβεια και το πένθος που δεν τελειώνει"],
      ["Οι εκδρομείς του πούλμαν", "η επιφανειακή, τουριστική σχέση με την ιστορία — η λήθη"],
      ["Ο επισκέπτης που δικαιολογεί την εκτέλεση", "η ηθική αναισθησία και η απουσία ιστορικής ευθύνης"],
      ["Οι βρόμικες εφημερίδες για τα οστά", "η ασέβεια της κοινωνίας απέναντι στους νεκρούς"]],
    tip: "Ο αφηγητής είναι ομοδιηγητικός (πρωτοπρόσωπος, αυτόπτης μάρτυρας): γράψε πώς αυτό δίνει αμεσότητα, βιωματικότητα και αξιοπιστία." },
  "3.2": { au: "Διδώ Σωτηρίου", ti: "Οι νεκροί περιμένουν", yr: 1959, kind: "πεζό", tag: "Μεταπολεμική πεζογραφία · Μικρά Ασία",
    when: "Παιδικά χρόνια στο Αϊδίνι της Μικράς Ασίας, πριν από την Καταστροφή του 1922 · δημοσίευση 1959",
    sym: [["Η γειτονιά του Αϊδινίου", "η καθημερινή συνύπαρξη και η αλληλεγγύη"],
      ["Το πλούσιο και το φτωχό σπίτι", "οι ταξικές διακρίσεις της μικρασιατικής κοινωνίας"],
      ["Τα έθιμα και οι γιορτές", "η πολιτισμική κληρονομιά του μικρασιατικού ελληνισμού"],
      ["Η φωνή του παιδιού-αφηγήτριας", "η αθωότητα και η νοσταλγία για τον χαμένο κόσμο"],
      ["Ο τίτλος (οι νεκροί που περιμένουν)", "το χρέος της μνήμης απέναντι σε όσους χάθηκαν"]],
    tip: "Αφηγήτρια αυτοδιηγητική σε α΄ πρόσωπο: η ενήλικη αφηγήτρια θυμάται το παιδί που ήταν — δύο οπτικές (παιδική και ώριμη)." },
  "3.3": { au: "Γ. Φ. Πιερίδης", ti: "Ο πορτοκαλόκηπος", yr: 1962, kind: "πεζό", tag: "Κυπριακή πεζογραφία · ΕΟΚΑ",
    when: "Απελευθερωτικός Αγώνας της ΕΟΚΑ 1955–1959 · θάνατος του Πετράκη Γιάλλουρου (Αμμόχωστος, 1956) · δημοσίευση 1962",
    sym: [["Ο πορτοκαλόκηπος", "ο κόπος μιας ζωής, η σχέση με τη γη και η συνέχεια της ζωής"],
      ["Ο Πετρής", "ο λιγομίλητος, στωικός Κύπριος αγρότης — ο πατέρας που πενθεί"],
      ["Ο Αρτέμης", "η νεολαία που ξεσηκώνεται και θυσιάζεται για την ελευθερία"],
      ["Η μαθητική διαδήλωση", "ο συλλογικός αγώνας κατά της αποικιοκρατίας"],
      ["Η νέα μέρα στη φύση", "η παρηγοριά και η δύναμη να συνεχίσει κανείς"]],
    tip: "Ο αφηγητής είναι ετεροδιηγητικός (τριτοπρόσωπος, παντογνώστης): έτσι βλέπουμε και τον εσωτερικό κόσμο του Πετρή." },
  "3.4": { au: "Ι. Μ. Παναγιωτόπουλος", ti: "Αστροφεγγιά", yr: 1946, kind: "πεζό", tag: "Λογοτεχνικό βιβλίο · μυθιστόρημα",
    when: "Αθήνα, περίπου 1918–1925 (μετά τον Α΄ Παγκόσμιο Πόλεμο, Μικρασιατική Καταστροφή) · δημοσίευση 1946",
    sym: [["Ο τίτλος «Αστροφεγγιά»", "το λιγοστό φως των αστεριών: όνειρα και ελπίδες της εφηβείας που σβήνουν"],
      ["Ο Άγγελος Γιαννούζης", "ο φτωχός, ευαίσθητος έφηβος που ωριμάζει μέσα από απογοητεύσεις"],
      ["Ο Νίκος Στέργης", "ο εύπορος φίλος — η ταξική απόσταση μέσα στη φιλία"],
      ["Η Δάφνη", "ο ανεκπλήρωτος, κρυφός έρωτας του Αγγέλου"],
      ["Η φτώχεια και η αρρώστια", "η ματαίωση των ονείρων από τις κοινωνικές συνθήκες"]],
    tip: "Στις Παγκύπριες 2026 (Β3, 8 μον.) ζητήθηκαν η συμπεριφορά και δύο γνωρίσματα της Δάφνης και η επίδρασή της στον Άγγελο, με δύο αναφορές από το απόσπασμα." }
};
const NB2_EVENTS = [[1912, "Βαλκανικοί πόλεμοι"], [1922, "Μικρασιατική Καταστροφή"], [1940, "Ελληνοϊταλικός πόλεμος"], [1943, "Καλάβρυτα"], [1955, "Αρχή αγώνα ΕΟΚΑ"], [1960, "Κυπριακή Δημοκρατία"], [1967, "Δικτατορία"], [1974, "Εισβολή στην Κύπρο"]];

/* ---------- εξεταστικά σχέδια απάντησης ---------- */
const NB2_PLANS = {
  ent: { t: "Εντοπισμός + τεκμηρίωση (π.χ. «δύο συνέπειες…»)", steps: ["Γράφω καθαρά το πρώτο σημείο (π.χ. «Πρώτη συνέπεια: η προσφυγιά»).", "Εξηγώ με δικά μου λόγια τι δείχνει το κείμενο.", "Τεκμηριώνω με σύντομη αναφορά σε στίχους/φράσεις (σε εισαγωγικά, με αριθμό στίχου).", "Επαναλαμβάνω για το δεύτερο σημείο — ούτε λιγότερα ούτε περισσότερα από όσα ζητούνται."] },
  mesa: { t: "Εκφραστικά μέσα και λειτουργία", steps: ["Ονομάζω το μέσο με τον σωστό όρο (μεταφορά, επανάληψη, αντίθεση, ειρωνεία, εικόνα…).", "Δίνω το παράδειγμα από το κείμενο (στίχος).", "Εξηγώ τη λειτουργία: τι τονίζει, τι συναίσθημα δημιουργεί, πώς υπηρετεί το νόημα.", "Συνδέω με το κεντρικό μήνυμα του ποιήματος."] },
  syg: { t: "Σύγκριση διδαγμένου – αδίδακτου", steps: ["Διαβάζω προσεκτικά τι ζητείται (θέμα; μέσο; στάση προσώπου;).", "Για ΚΑΘΕ κείμενο: σημείο + τεκμηρίωση (ισόρροπα).", "Δείχνω ρητά την ομοιότητα ή/και τη διαφορά («Και στα δύο ποιήματα…», «Αντίθετα, …»).", "Κλείνω με μια σύντομη συνθετική πρόταση."] },
  char: { t: "Χαρακτηρισμός / στάση προσώπου", steps: ["Περιγράφω τη συμπεριφορά του προσώπου (τι κάνει, τι λέει).", "Δίνω γνωρίσματα με επίθετα (π.χ. ειρωνική, στωικός, ευάλωτος).", "Τεκμηριώνω κάθε γνώρισμα με αναφορά στο κείμενο.", "Αν ζητείται: εξηγώ πώς η συμπεριφορά επηρεάζει τα άλλα πρόσωπα."] }
};

/* ---------- κάρτα μελέτης (widget) ---------- */
function nb2Study(box, sid) {
  const W = NB2_WORKS[sid];
  box.innerHTML = `<div class="nb2head"><b>${W.au}</b>, «${W.ti}» <span class="nb2chip">${nb2Yr(W)}</span> <span class="nb2chip alt">${W.tag}</span></div>
  <div class="nb2tabs" role="tablist"><button class="btn small nb2t on" data-t="time">🕰 Χρονολόγιο</button><button class="btn small nb2t" data-t="sym">🔗 Σύμβολα &amp; σημασίες</button><button class="btn small nb2t" data-t="plan">✍️ Σχέδιο απάντησης</button></div>
  <div class="nb2pane"></div>`;
  const pane = $(".nb2pane", box);
  const tabs = box.querySelectorAll(".nb2t");
  tabs.forEach(b => b.onclick = () => { tabs.forEach(x => x.classList.toggle("on", x === b)); show(b.dataset.t); });

  function time() {
    const ids = Object.keys(NB2_WORKS).sort((a, b) => NB2_WORKS[a].yr - NB2_WORKS[b].yr), Wd = 820;
    const sx = y => y <= 1950 ? 30 + (y - 1900) / 50 * 230 : 260 + (y - 1950) / 35 * (Wd - 290);
    const tw = t => t.length * 6.6 + 8;
    /* άπληστη κατανομή επιπέδων ώστε να μην επικαλύπτονται οι ετικέτες */
    const place = (items, nlev) => { const ends = Array(nlev).fill(-1e9); return items.map(it => { let L = ends.findIndex(e => e < it.x - it.w / 2); if (L < 0) L = ends.indexOf(Math.min(...ends)); ends[L] = it.x + it.w / 2; return L; }); };
    const wl = ids.map(id => ({ id, x: sx(NB2_WORKS[id].yr), w: tw(NB2_WORKS[id].au.split(" ").pop()) }));
    const wL = place(wl, 6);
    const el = NB2_EVENTS.map(([y, t]) => ({ x: sx(y), w: tw(t + " (0000)") * 0.95 + 6, t, y }));
    const eL = place(el, 4);
    const base = 160, H = base + 30 + 4 * 15;
    let svg = `<svg viewBox="0 0 ${Wd} ${H}" class="nb2svg" role="img" aria-label="Χρονολόγιο έργων και γεγονότων"><line x1="20" y1="${base}" x2="${Wd - 15}" y2="${base}" stroke="#c9b3ae" stroke-width="2"/>`;
    [1900, 1910, 1920, 1930, 1940, 1950, 1955, 1960, 1965, 1970, 1975, 1980, 1985].forEach(y => svg += `<line x1="${sx(y)}" y1="${base - 5}" x2="${sx(y)}" y2="${base + 5}" stroke="#c9b3ae"/><text x="${sx(y)}" y="${base + 18}" text-anchor="middle" class="nb2ax">${y}</text>`);
    el.forEach((e, k) => { const yy = base + 34 + eL[k] * 15; svg += `<line x1="${e.x}" y1="${base + 5}" x2="${e.x}" y2="${yy - 10}" stroke="#d9c8c4" stroke-dasharray="2 2"/><text x="${e.x}" y="${yy}" text-anchor="middle" class="nb2ev">${e.t} (${e.y})</text>`; });
    wl.forEach((w, k) => { const me = w.id === sid, lv = base - 18 - wL[k] * 22;
      svg += `<g class="nb2dot${me ? " me" : ""}" data-id="${w.id}" tabindex="0"><line x1="${w.x}" y1="${lv + 4}" x2="${w.x}" y2="${base}" stroke="${me ? "var(--blue)" : "#d6c3bf"}"/><circle cx="${w.x}" cy="${base}" r="${me ? 7 : 5}"/><text x="${w.x}" y="${lv}" text-anchor="middle">${NB2_WORKS[w.id].au.split(" ").pop()}</text></g>`; });
    svg += `</svg>`;
    pane.innerHTML = `<div class="nb2scroll">${svg}</div><div class="wout nb2info"></div><p class="muted small">👆 Πάτησε σε ένα όνομα για να δεις το πλαίσιο του κειμένου (με κόκκινο: το κείμενο αυτής της ενότητας). Η κλίμακα μετά το 1950 είναι πιο «αραιή». Στο κινητό σύρε το χρονολόγιο οριζόντια.</p>`;
    const info = $(".nb2info", pane);
    const sel = id => { const w = NB2_WORKS[id]; info.innerHTML = `<b>${w.au}, «${w.ti}»</b> (${w.kind}, ${nb2Yr(w)})<br><span class="muted">Πλαίσιο:</span> ${w.when}`; pane.querySelectorAll(".nb2dot").forEach(g => g.classList.toggle("sel", g.dataset.id === id)); };
    pane.querySelectorAll(".nb2dot").forEach(g => { g.onclick = () => sel(g.dataset.id); g.onkeydown = e => { if (e.key === "Enter") sel(g.dataset.id); }; });
    sel(sid);
    const sc = $(".nb2scroll", pane), me = wl.find(w => w.id === sid);
    try { sc.scrollLeft = Math.max(0, me.x * sc.scrollWidth / Wd - sc.clientWidth / 2); } catch (e) {}
  }
  function sym() {
    const P = W.sym, order = shuffle(P.map((_, i) => i));
    let pick = null, done = new Set(), tries = 0;
    pane.innerHTML = `<p class="small muted">Διάλεξε ένα σύμβολο/μοτίβο αριστερά και μετά τη σημασία του δεξιά.</p><div class="nb2match"><div class="nb2col l"></div><div class="nb2col r"></div></div><div class="wout nb2res"></div><button class="btn ghost small nb2again">↺ Ξανά</button>`;
    const L = $(".nb2col.l", pane), Rc = $(".nb2col.r", pane), res = $(".nb2res", pane);
    P.forEach((p, i) => { const b = h("button", { class: "nb2it", "data-i": i }, p[0]); L.appendChild(b); });
    order.forEach(i => { const b = h("button", { class: "nb2it", "data-i": i }, P[i][1]); Rc.appendChild(b); });
    const upd = msg => { res.innerHTML = `${msg ? msg + "<br>" : ""}Σωστά ζεύγη: <b>${done.size}/${P.length}</b> · προσπάθειες: ${tries}` + (done.size === P.length ? " — 🎉 Μπράβο! Τώρα προσπάθησε να εξηγήσεις κάθε σύμβολο με μία πρόταση." : ""); };
    L.querySelectorAll(".nb2it").forEach(b => b.onclick = () => { if (done.has(+b.dataset.i)) return; L.querySelectorAll(".nb2it").forEach(x => x.classList.remove("pk")); b.classList.add("pk"); pick = +b.dataset.i; });
    Rc.querySelectorAll(".nb2it").forEach(b => b.onclick = () => {
      if (pick === null || done.has(+b.dataset.i)) return; tries++;
      if (+b.dataset.i === pick) { done.add(pick); pane.querySelectorAll(`.nb2it[data-i="${pick}"]`).forEach(x => { x.classList.remove("pk"); x.classList.add("ok"); }); upd("✔ Σωστό ζεύγος."); pick = null; }
      else { b.classList.add("no"); setTimeout(() => b.classList.remove("no"), 600); upd("✘ Όχι αυτό — ξαναδοκίμασε."); }
    });
    $(".nb2again", pane).onclick = sym;
    upd("");
  }
  function plan() {
    pane.innerHTML = `<div class="wctl"><label>Τύπος ερώτησης <select class="nb2pt">${Object.entries(NB2_PLANS).map(([k, p]) => `<option value="${k}">${p.t}</option>`).join("")}</select></label></div>
      <ol class="nb2steps"></ol><div class="tbox tip nb2tip"><b>Για αυτό το κείμενο:</b> ${W.tip}</div>
      <label class="nb2ta">Γράψε εδώ το σχέδιό σου (μένει μόνο στη συσκευή σου όσο είναι ανοιχτή η σελίδα):<textarea rows="5" placeholder="Σημείο 1: …&#10;Τεκμηρίωση: «…» (στ. …)&#10;Σημείο 2: …"></textarea></label><div class="muted small nb2wc">0 λέξεις</div>`;
    const st = $(".nb2steps", pane), sel = $(".nb2pt", pane), ta = $("textarea", pane), wc = $(".nb2wc", pane);
    const draw = () => { const p = NB2_PLANS[sel.value]; st.innerHTML = p.steps.map((s, i) => `<li><label><input type="checkbox"> ${s}</label></li>`).join(""); };
    sel.onchange = draw; draw();
    ta.oninput = () => { const n = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0; wc.textContent = n + (n === 1 ? " λέξη" : " λέξεις"); };
  }
  function show(t) { if (t === "sym") sym(); else if (t === "plan") plan(); else time(); }
  show("time");
}
(function nb2Css() {
  if (document.getElementById("nb2css")) return;
  const st = document.createElement("style"); st.id = "nb2css";
  st.textContent = `.nb2head{font-size:15.5px;margin-bottom:10px;color:var(--navy)}.nb2chip{display:inline-block;font:700 12px var(--sans);background:var(--blue);color:#fff;border-radius:99px;padding:2px 9px;margin-left:4px}.nb2chip.alt{background:#fbe9e7;color:var(--blue)}
.nb2tabs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.nb2t.on{background:var(--blue);color:#fff;border-color:var(--blue)}
.nb2scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1px solid var(--line);border-radius:12px;background:#fffdfb}.nb2svg{display:block;min-width:760px;width:100%;height:auto}
.nb2svg .nb2ax{font:600 11px var(--sans);fill:#9a7f7a}.nb2svg .nb2ev{font:600 10.5px var(--sans);fill:#8a6f6a}
.nb2dot{cursor:pointer}.nb2dot circle{fill:#fff;stroke:#bfa6a1;stroke-width:2}.nb2dot text{font:700 11.5px var(--sans);fill:#6d5650}
.nb2dot.me circle{fill:var(--blue);stroke:var(--blue)}.nb2dot.me text{fill:var(--blue)}.nb2dot.sel text{text-decoration:underline}.nb2dot:focus{outline:none}.nb2dot:focus text{fill:var(--blue)}
.nb2match{display:grid;grid-template-columns:1fr 1fr;gap:10px}.nb2col{display:flex;flex-direction:column;gap:6px;min-width:0}
.nb2it{font:inherit;font-size:14px;text-align:left;background:#fff;border:1.5px solid var(--line);border-radius:10px;padding:8px 10px;cursor:pointer;line-height:1.35;color:var(--ink)}
.nb2it:hover{border-color:var(--blue)}.nb2it.pk{border-color:var(--blue);background:#fdecea}.nb2it.ok{border-color:var(--green);background:#eaf7ef;color:#155d38;cursor:default}.nb2it.no{border-color:var(--red);background:#fdecec}
.nb2steps{margin:6px 0 10px 18px}.nb2steps li{margin:4px 0}.nb2ta{display:block;font-weight:600;color:var(--navy);margin-top:8px}.nb2ta textarea{display:block;width:100%;margin-top:6px;font:inherit;font-weight:400;padding:10px;border-radius:10px;border:1px solid var(--line);resize:vertical}
table.tbl.nbl td{text-align:left;vertical-align:top}table.tbl.nbl td:first-child{white-space:nowrap;font-weight:600;color:var(--navy)}@media (max-width:520px){table.tbl.nbl td:first-child{white-space:normal}}
@media (max-width:520px){.nb2match{grid-template-columns:1fr}}`;
  document.head.appendChild(st);
})();

/* ---------- «ποιο κείμενο;» — γενική τράπεζα ενδείξεων ---------- */
const NB2_CLUES = [
  ["Το ποιητικό υποκείμενο είναι ο Τεύκρος, ιδρυτής της Σαλαμίνας της Κύπρου.", "2.2"],
  ["Ένα ιστορικό γεγονός του 34 π.Χ. γίνεται αφορμή για ειρωνικό σχόλιο για την εξουσία.", "2.1"],
  ["Ο ποιητής αντλεί το υλικό του από τον Πλούταρχο (Βίος Αντωνίου).", "2.1"],
  ["Η ιστορία του ήρωα αντλείται από τον Ηρόδοτο: το κρανίο του ήρωα γέμισε μέλισσες.", "2.7"],
  ["Δραματικός μονόλογος του Γρηγόρη Αυξεντίου λίγο πριν από τον θάνατό του.", "2.4"],
  ["Ένας αγνοούμενος πατέρας παρακολουθεί κρυφά τον γάμο της κόρης του.", "2.8"],
  ["Ένα γράμμα-εξομολόγηση προς τη μητέρα για την ερήμωση μετά την εισβολή.", "2.6"],
  ["Ποίημα της δικτατορίας με ειρωνεία και διακειμενική αναφορά στον Καβάφη.", "2.5"],
  ["Ενότητα από ποιητική σύνθεση με δομή εμπνευσμένη από τη βυζαντινή λειτουργία, μελοποιημένη από τον Θεοδωράκη.", "2.3"],
  ["Επωδός με προσφώνηση σε μια μακρινή μητέρα και ένα αμάραντο ρόδο.", "2.3"],
  ["Το είδωλο μιας γυναίκας προκάλεσε δέκα χρόνια πολέμου.", "2.2"],
  ["Μια ομάδα επισκεπτών φτάνει με πούλμαν σε τόπο εκτέλεσης και συμπεριφέρεται σαν τουρίστες, ενώ δύο αδέρφια ξεθάβουν τον αδελφό τους.", "3.1"],
  ["Αυτοδιηγητική αφηγήτρια θυμάται τα παιδικά της χρόνια στο Αϊδίνι.", "3.2"],
  ["Ένας λιγομίλητος αγρότης χάνει τον μοναχογιό του σε μαθητική διαδήλωση της ΕΟΚΑ.", "3.3"],
  ["Μυθιστόρημα διαπλάσεως: ένας φτωχός έφηβος στην Αθήνα μετά τον Α΄ Παγκόσμιο Πόλεμο.", "3.4"],
  ["Το διήγημα έχει για τίτλο μια ημερομηνία με σταυρό μπροστά της.", "3.1"],
  ["Ξένοι επίσημοι επισκέπτονται τους καταυλισμούς των προσφύγων και υπόσχονται ότι θα φροντίσουν.", "2.6"],
  ["Τράπεζα, τουριστικά γραφεία και πρακτορεία μετανάστευσης στη θέση του παλιού κόσμου.", "2.5"],
  ["Η σπηλιά-κρησφύγετο μεταμορφώνεται σε φως και ήλιο.", "2.4"],
  ["Η Πράσινη Γραμμή και οι φυλακές της Ανατολής εμφανίζονται ως τόποι του πόνου.", "2.8"],
  ["Ένας αρχαίος ήρωας της Σαλαμίνας καταστρέφει το ίδιο του το κρανίο, απελπισμένος από την αδιαφορία των ανθρώπων.", "2.7"],
  ["Ο Καισαρίων ονομάζεται «Βασιλέας των Βασιλέων».", "2.1"],
  ["Τα πρόσωπα Άγγελος, Νίκος, Δάφνη και Έρση.", "3.4"],
  ["Ο ήρωας βρίσκει παρηγοριά στη φύση και στον κήπο του μετά την κηδεία.", "3.3"]
];
const nb2Name = id => `${NB2_WORKS[id].au}, «${NB2_WORKS[id].ti}»`;
const nb2Yr = w => w.yl || w.yr;
function nb2Which(prefer) {
  const pool = NB2_CLUES.filter(c => !prefer || Math.random() < 0.5 || c[1] === prefer);
  const [clue, ans] = bkPick(pool.length ? pool : NB2_CLUES);
  const others = shuffle(Object.keys(NB2_WORKS).filter(k => k !== ans)).slice(0, 3);
  const opts = shuffle([ans, ...others]);
  return { level: 1, type: "mc", q: `Σε ποιο εξεταστέο κείμενο ταιριάζει η ένδειξη: <i>${clue}</i>`, options: opts.map(nb2Name), correct: opts.indexOf(ans),
    hint: "Σκέψου τον συγγραφέα, την εποχή και το βασικό θέμα κάθε κειμένου.", sol: `Ταιριάζει στο κείμενο ${nb2Name(ans)} (${nb2Yr(NB2_WORKS[ans])}). Πλαίσιο: ${NB2_WORKS[ans].when}.` };
}

/* ---------- τράπεζες ερωτήσεων ανά κείμενο: [ερώτηση, σωστή, [λάθος…], εξήγηση] ---------- */
const NB2_BANK = {
  "2.1": [
    ["Από ποια ιστορική πηγή αντλεί ο Καβάφης το γεγονός;", "Τον Πλούταρχο (Βίος Αντωνίου)", ["Τον Θουκυδίδη", "Τον Ηρόδοτο", "Τον Ξενοφώντα"], "Η ανακήρυξη των παιδιών της Κλεοπάτρας περιγράφεται στον «Βίο Αντωνίου» του Πλουτάρχου."],
    ["Ποιο είναι το κυριότερο εκφραστικό μέσο που ανατρέπει το έκδηλο νόημα της τελετής;", "Η ειρωνεία", ["Η παρομοίωση", "Η προσωποποίηση", "Η αλληγορία"], "Η ειρωνεία αποκαλύπτει την απόσταση ανάμεσα στο φαίνεσθαι (λαμπρή τελετή) και στο είναι (κούφιοι τίτλοι)."],
    ["Γιατί επευφημούν οι Αλεξανδρινοί, αφού ξέρουν ότι οι τίτλοι είναι κενοί;", "Γοητεύονται από το ωραίο θέαμα και τη μέρα", ["Φοβούνται την τιμωρία", "Πιστεύουν ότι οι τίτλοι έχουν αξία", "Πληρώθηκαν για να επευφημήσουν"], "Η αισθητική γοητεία (ζεστή μέρα, πολυτέλεια, ομορφιά του Καισαρίωνα) υπερισχύει της γνώσης."],
    ["Σε ποια ομάδα ποιημάτων του Καβάφη ανήκει;", "Στα ιστορικά ποιήματα", ["Στα ερωτικά ποιήματα", "Στα «αποκηρυγμένα»", "Στα δημοτικά τραγούδια"], "Είναι ιστορικό ποίημα με θέμα την ελληνιστική Αλεξάνδρεια."],
    ["Ποιο από τα παιδιά της Κλεοπάτρας προβάλλεται περισσότερο;", "Ο Καισαρίων", ["Ο Αλέξανδρος", "Ο Πτολεμαίος", "Κανένα, παρουσιάζονται ισότιμα"], "Ο Καισαρίων στέκεται μπροστά, περιγράφεται αναλυτικά και ονομάζεται «Βασιλέας των Βασιλέων»."],
    ["Ποια λειτουργία έχει η αναλυτική περιγραφή των ενδυμάτων του Καισαρίωνα;", "Δημιουργεί παραστατικότητα και τονίζει τη θεατρικότητα της τελετής", ["Δείχνει τη φτώχεια της Αλεξάνδρειας", "Κρύβει την ειρωνεία", "Δείχνει ότι ο Καισαρίων ήταν ενήλικας"], "Η πολυτέλεια είναι μέρος της σκηνοθεσίας: εντυπωσιάζει, αλλά δεν έχει πραγματικό αντίκρισμα."],
    ["Ποια είναι η στάση του ποιητικού υποκειμένου απέναντι στο γεγονός;", "Αποστασιοποιημένη και ειρωνική", ["Ενθουσιώδης και εγκωμιαστική", "Θρηνητική και απελπισμένη", "Αδιάφορη, χωρίς κανένα σχόλιο"], "Μιλά σαν αφηγητής-παρατηρητής, αλλά με λεπτή ειρωνεία σχολιάζει τη ματαιότητα της εξουσίας."],
    ["Ποιος ήταν ο πατέρας του Καισαρίωνα;", "Ο Ιούλιος Καίσαρας", ["Ο Μάρκος Αντώνιος", "Ο Οκταβιανός", "Ο Πτολεμαίος ΙΓ΄"], "Ο Καισαρίων ήταν γιος της Κλεοπάτρας και του Ιουλίου Καίσαρα· ο Αλέξανδρος και ο Πτολεμαίος ήταν παιδιά της με τον Αντώνιο."],
    ["Πού γίνεται η τελετή της ανακήρυξης;", "Στο Γυμνάσιο της Αλεξάνδρειας", ["Στο παλάτι της Ρώμης", "Στον Φάρο της Αλεξάνδρειας", "Στο θέατρο της Αθήνας"], "Το Γυμνάσιο, «θριαμβικό κατόρθωμα της τέχνης», είναι το σκηνικό της παράστασης."],
    ["Σε ποιο ρήμα στηρίζεται η επανάληψη που υπονομεύει την αξία των τίτλων;", "Στο «είπαν»", ["Στο «νίκησαν»", "Στο «κυβέρνησαν»", "Στο «πολέμησαν»"], "Οι βασιλείς απλώς «ονομάστηκαν» βασιλείς — οι τίτλοι μένουν λόγια."],
    ["Ποια λέξη δηλώνει ρητά ότι η τελετή είναι παράσταση;", "θεατρικά", ["λαμπρή", "ποιητική", "γαλάζιο"], "Οι Αλεξανδρινοί ένιωθαν ότι όλα ήταν λόγια «θεατρικά»."],
    ["Σε ποιες γλώσσες επευφημεί το πλήθος;", "Ελληνικά, αιγυπτιακά και εβραϊκά", ["Μόνο ελληνικά", "Λατινικά και ελληνικά", "Περσικά και αραβικά"], "Η τριγλωσσία δείχνει την πολυπολιτισμική ελληνιστική Αλεξάνδρεια."],
    ["Τι γνωρίζει ο σύγχρονος αναγνώστης που ενισχύει την ειρωνεία;", "Ότι λίγα χρόνια μετά ο Οκταβιανός θα νικήσει και ο Καισαρίων θα θανατωθεί", ["Ότι ο Καισαρίων θα γίνει αυτοκράτορας της Ρώμης", "Ότι η Αλεξάνδρεια θα καταστραφεί από σεισμό την ίδια μέρα", "Ότι η τελετή δεν έγινε ποτέ"], "Η ιστορική γνώση του τέλους (31–30 π.Χ.) κάνει τη μεγαλοπρέπεια ακόμη πιο κενή."],
    ["Ποιο είδος εικόνων κυριαρχεί στην περιγραφή του Καισαρίωνα;", "Οπτικές εικόνες (χρώματα, υφάσματα, πετράδια)", ["Ακουστικές εικόνες", "Οσφρητικές εικόνες μόνο", "Γευστικές εικόνες"], "Χρώματα και πολύτιμα υλικά δημιουργούν ένα εντυπωσιακό οπτικό θέαμα."],
    ["Ποιος σύνδεσμος εισάγει την ανατροπή μετά τη διαπίστωση των Αλεξανδρινών;", "Το «Αλλά»", ["Το «Επειδή»", "Το «Αν»", "Το «Ώστε»"], "Το αντιθετικό «Αλλά» (στ. 22) εισάγει τη γοητεία που υπερνικά τη γνώση."],
    ["Ποια διαχρονική ιδέα προβάλλει το ποίημα;", "Η εξουσία συχνά νομιμοποιείται μέσα από το θέαμα και την προπαγάνδα", ["Η μοναρχία είναι το καλύτερο πολίτευμα", "Οι λαοί ποτέ δεν γοητεύονται από την πολυτέλεια", "Η ιστορία δεν επαναλαμβάνεται"], "Ο Καβάφης σχολιάζει διαχρονικά τη σχέση εξουσίας και λαού."],
    ["Με ποιο άλλο ποίημα του Καβάφη προτείνει το Πλαίσιο να συνδιαβαστεί;", "«Περιμένοντας τους βαρβάρους»", ["«Ιθάκη»", "«Η πόλις»", "«Κεριά»"], "Και εκεί μια σκηνοθετημένη δημόσια τελετή αποκαλύπτει τη ματαιότητα της εξουσίας."],
    ["Σε ποια ιστορική περίοδο ανήκει το γεγονός;", "Στην ελληνιστική περίοδο, στο τέλος της δυναστείας των Πτολεμαίων", ["Στην κλασική Αθήνα", "Στη βυζαντινή περίοδο", "Στη μινωική εποχή"], "Η Κλεοπάτρα Ζ΄ ήταν η τελευταία ηγεμόνας της δυναστείας των Λαγιδών (Πτολεμαίων)."]
  ],
  "2.2": [
    ["Ποιος μιλά στο ποίημα;", "Ο Τεύκρος", ["Η Ελένη", "Ο Μενέλαος", "Ο ίδιος ο Σεφέρης ως διπλωμάτης"], "Το ποιητικό υποκείμενο είναι ο Τεύκρος· ο Σεφέρης μιλά μέσα από το προσωπείο του."],
    ["Ποια αρχαία τραγωδία αξιοποιεί διακειμενικά ο Σεφέρης;", "Την «Ελένη» του Ευριπίδη", ["Την «Αντιγόνη» του Σοφοκλή", "Τους «Πέρσες» του Αισχύλου", "Τη «Μήδεια» του Ευριπίδη"], "Κατά την «Ελένη» του Ευριπίδη η πραγματική Ελένη βρισκόταν στην Αίγυπτο· στην Τροία πήγε μόνο ένα είδωλο."],
    ["Τι δηλώνει η εικόνα του άδειου πουκαμίσου (η Ελένη ως κενό ένδυμα);", "Τη ματαιότητα ενός πολέμου για ανύπαρκτη αιτία", ["Τη φτώχεια των Τρώων", "Την ομορφιά της Ελένης", "Τη νίκη των Αχαιών"], "Οι άνθρωποι σκοτώθηκαν για ένα είδωλο: ο πόλεμος αποδεικνύεται μάταιος."],
    ["Σε ποια γενιά εντάσσεται ο Σεφέρης;", "Στη Γενιά του '30 (μοντέρνα ποίηση)", ["Στη Νέα Αθηναϊκή Σχολή", "Στην Επτανησιακή Σχολή", "Στη Γενιά του '70"], "Ο Σεφέρης είναι κορυφαίος εκπρόσωπος της Γενιάς του '30."],
    ["Ποια ιστορική εμπειρία συνδέεται με το ποίημα;", "Ο Β΄ Παγκόσμιος Πόλεμος, η προσφυγιά και το Κυπριακό της δεκαετίας του '50", ["Η Επανάσταση του 1821", "Η δικτατορία του 1967", "Ο εμφύλιος των Ρωμαίων"], "Το πλαίσιο περιλαμβάνει τη Μικρασιατική Καταστροφή, τον Β΄ Παγκόσμιο Πόλεμο και την κυπριακή συγκυρία."],
    ["Ποια λειτουργία έχει η επανάληψη στην προσφώνηση των αηδονιών;", "Δίνει λυρισμό, έμφαση και δραματική ένταση", ["Δείχνει ότι ο ομιλητής ξέχασε τι ήθελε να πει", "Μειώνει τη συγκίνηση", "Δηλώνει χιούμορ"], "Η επανάληψη ενισχύει τη μουσικότητα και τη συγκινησιακή φόρτιση."],
    ["Ποιο ερώτημα διατρέχει όλο το ποίημα;", "Ποια είναι η αλήθεια πίσω από τον πόλεμο — αξίζει η θυσία;", ["Ποιος θα κερδίσει τον πόλεμο", "Πώς θα επιστρέψει η Ελένη στη Σπάρτη", "Ποιος θα γίνει βασιλιάς της Κύπρου"], "Η αντίθεση αλήθειας – ψευδαίσθησης και τα ρητορικά ερωτήματα εκφράζουν υπαρξιακό προβληματισμό."],
    ["Ποια πόλη της Κύπρου ίδρυσε, κατά την παράδοση, ο Τεύκρος;", "Τη Σαλαμίνα", ["Την Αμαθούντα", "Την Πάφο", "Το Κούριο"], "Ο Τεύκρος, εξόριστος από τη Σαλαμίνα της Αττικής, ίδρυσε τη Σαλαμίνα της Κύπρου."],
    ["Σε ποιο χωριό της Κύπρου συνδέονται τα αηδόνια του ποιήματος;", "Στις Πλάτρες", ["Στη Λάπηθο", "Στο Ριζοκάρπασο", "Στη Λεμεσό"], "Τα αηδόνια των Πλατρών του Τροόδους είναι το εναρκτήριο μοτίβο."],
    ["Ποιο βραβείο κέρδισε ο Σεφέρης το 1963;", "Το Νόμπελ Λογοτεχνίας", ["Το Κρατικό Βραβείο Ποίησης", "Το βραβείο Ουράνη", "Το βραβείο Γκονκούρ"], "Ήταν ο πρώτος Έλληνας που τιμήθηκε με το Νόμπελ Λογοτεχνίας."],
    ["Τι είδους λόγος είναι το ποίημα ως προς τη μορφή;", "Δραματικός μονόλογος σε ελεύθερο στίχο", ["Σονέτο με ομοιοκαταληξία", "Διάλογος δύο προσώπων", "Πεζό ποίημα σε τρίτο πρόσωπο"], "Μιλά ένα δραματικό πρόσωπο, σε ελεύθερο στίχο — γνώρισμα της μοντέρνας ποίησης."],
    ["Ποια ήταν η «αιτία» του Τρωικού πολέμου σύμφωνα με τη μυθική παραλλαγή του ποιήματος;", "Ένα είδωλο της Ελένης, φτιαγμένο από σύννεφο", ["Ο θάνατος του Αχιλλέα", "Ο έλεγχος των εμπορικών δρόμων", "Η αρπαγή του χρυσόμαλλου δέρατος"], "Οι Αχαιοί πολέμησαν για μια ψευδαίσθηση."],
    ["Γιατί ο Σεφέρης χρησιμοποιεί αρχαίο ήρωα ως ομιλητή;", "Για να μιλήσει έμμεσα και διαχρονικά για τον σύγχρονο πόλεμο και την Κύπρο", ["Για να αφηγηθεί πιστά την αρχαία ιστορία", "Γιατί δεν ήξερε σύγχρονα γεγονότα", "Για να γράψει θεατρικό έργο"], "Το προσωπείο επιτρέπει αποστασιοποίηση και διαχρονικότητα."],
    ["Σε ποια συλλογή ανήκει η «Ελένη»;", "«Ημερολόγιο Καταστρώματος Γ΄»", ["«Μυθιστόρημα»", "«Στροφή»", "«Κίχλη»"], "Η συλλογή (1955) γράφτηκε υπό την επίδραση της επίσκεψης στην Κύπρο."],
    ["Ποιο ρεύμα επηρεάζει το ποίημα με τα σύμβολα, την υποβλητική ατμόσφαιρα και τη μουσικότητα;", "Ο συμβολισμός", ["Ο νατουραλισμός", "Ο κλασικισμός", "Ο ρομαντισμός του 19ου αιώνα"], "Το Πλαίσιο ζητά αναγνώριση στοιχείων του συμβολισμού."],
    ["Τι κοινό έχουν ο Τεύκρος και ο ποιητής;", "Και οι δύο είναι ξεριζωμένοι, με εμπειρία πολέμου και εξορίας", ["Και οι δύο ήταν βασιλιάδες", "Και οι δύο γεννήθηκαν στην Κύπρο", "Και οι δύο πολέμησαν στην Τροία"], "Ο Σεφέρης, πρόσφυγας από τη Μικρά Ασία και εξόριστος στον πόλεμο, ταυτίζεται με τον εξόριστο ήρωα."],
    ["Τι εκφράζουν τα ρητορικά ερωτήματα του ποιήματος;", "Υπαρξιακό προβληματισμό και αμφισβήτηση απέναντι στον πόλεμο και στη μοίρα", ["Ερωτήσεις προς τον αναγνώστη που περιμένουν απάντηση", "Ειρωνεία για την Ελένη", "Χαρά για τη νίκη"], "Δεν περιμένουν απάντηση· δηλώνουν αγωνία και αμφιβολία."],
    ["Ποια αντίθεση διατρέχει το ποίημα;", "Αλήθεια – ψευδαίσθηση", ["Πλούτος – φτώχεια", "Πόλη – ύπαιθρος", "Νιότη – γηρατειά"], "Η κεντρική σύγκρουση: πολεμήσαμε για ένα ψέμα."]
  ],
  "2.3": [
    ["Από ποια τρία μέρη αποτελείται το «Άξιον Εστί»;", "Η Γένεσις – Τα Πάθη – Το Δοξαστικόν", ["Πρόλογος – Κύριο μέρος – Επίλογος", "Ψαλμοί – Ωδές – Αναγνώσματα", "Άσματα – Ελεγεία – Ύμνοι"], "Οι ψαλμοί, οι ωδές και τα αναγνώσματα είναι είδη κειμένων μέσα στα «Πάθη»."],
    ["Ποιο ιστορικό πλαίσιο αποτυπώνουν κυρίως «Τα Πάθη»;", "Τον πόλεμο του '40, την Κατοχή και την Αντίσταση", ["Την Επανάσταση του 1821", "Τη Μικρασιατική εκστρατεία", "Τον αγώνα της ΕΟΚΑ"], "«Τα Πάθη» αποδίδουν τις δοκιμασίες του ελληνικού λαού στη δεκαετία του 1940."],
    ["Τι είναι η επωδός;", "Στίχος ή ομάδα στίχων που επαναλαμβάνεται στο τέλος κάθε στροφής", ["Ο τίτλος του ποιήματος", "Ο πρώτος στίχος κάθε στροφής", "Μια μορφή ομοιοκαταληξίας"], "Η επωδός επανέρχεται σαν ρεφρέν: δίνει μουσικότητα και ενότητα."],
    ["Ποια αντίθεση δείχνει τη μεταμόρφωση του πόνου σε δημιουργία;", "Πέτρα – άνθισμα (και αίμα – φως)", ["Μέρα – νύχτα", "Βουνό – θάλασσα", "Πλούτος – φτώχεια"], "Η ζωή που φυτρώνει μέσα στις πέτρες δείχνει ότι από τη δοκιμασία γεννιέται ομορφιά."],
    ["Ποιος μελοποίησε το «Άξιον Εστί»;", "Ο Μίκης Θεοδωράκης", ["Ο Μάνος Χατζιδάκις", "Ο Σταύρος Ξαρχάκος", "Ο Γιάννης Μαρκόπουλος"], "Λαϊκό ορατόριο (1964), με ερμηνευτή τον Γρηγόρη Μπιθικώτση."],
    ["Ποια είναι η γενική διάθεση του άσματος;", "Λυρική, με ελπίδα και πίστη στην αναγέννηση", ["Σατιρική και κωμική", "Κυνική και απαισιόδοξη", "Ουδέτερη, περιγραφική"], "Παρά τον πόνο, το ποίημα κινείται προς το φως και την ελπίδα."],
    ["Ποια παράδοση αξιοποιεί η δομή του «Άξιον Εστί»;", "Τη βυζαντινή εκκλησιαστική υμνογραφία", ["Το αρχαίο δράμα", "Την κρητική αναγεννησιακή ποίηση", "Τα ακριτικά τραγούδια"], "Ψαλμοί, ωδές, αναγνώσματα και ο τίτλος (από ύμνο της Παναγίας) παραπέμπουν στη λειτουργία."],
    ["Ποιο βραβείο κέρδισε ο Ελύτης το 1979;", "Το Νόμπελ Λογοτεχνίας", ["Το βραβείο Πούλιτζερ", "Το Κρατικό Βραβείο Πεζογραφίας", "Το βραβείο Λένιν"], "Ο Ελύτης ήταν ο δεύτερος Έλληνας νομπελίστας ποιητής, μετά τον Σεφέρη."],
    ["Σε ποια γενιά ανήκει ο Ελύτης;", "Στη Γενιά του '30", ["Στη Μεταπολεμική Γενιά", "Στη Γενιά του '80", "Στην Ιόνια Σχολή"], "Μοντέρνα ποίηση με υπερρεαλιστικές επιδράσεις."],
    ["Ποιο ρεύμα επηρέασε την ποιητική του Ελύτη;", "Ο υπερρεαλισμός", ["Ο νατουραλισμός", "Ο Παρνασσισμός", "Ο ρεαλισμός του 19ου αιώνα"], "Ο Ελύτης αφομοίωσε δημιουργικά στοιχεία του υπερρεαλισμού."],
    ["Τι συμβολίζουν τα αίματα;", "Τις θυσίες και τους αγώνες του ελληνικού λαού", ["Την υγεία", "Τον έρωτα μόνο", "Την αριστοκρατία"], "Σύμφωνα με το Πλαίσιο."],
    ["Τι συμβολίζει το πέλαγος;", "Την ελληνική μοίρα, τη δοκιμασία και την ελευθερία", ["Τον τουρισμό", "Τη μοναξιά του ποιητή μόνο", "Τον εχθρό"], "Η θάλασσα του Αιγαίου είναι κεντρικό μοτίβο του Ελύτη."],
    ["Τι συμβολίζει το φως;", "Την ελπίδα, τη δικαιοσύνη και την πνευματική λύτρωση", ["Τη ζέστη του καλοκαιριού μόνο", "Τον πόλεμο", "Τον θάνατο"], "Το φως είναι η κορυφαία αξία στην ποίηση του Ελύτη."],
    ["Πώς αποτυπώνεται η σχέση ατόμου και συνόλου στο ποίημα;", "Το «εγώ» εκφράζει τις συλλογικές εμπειρίες του λαού", ["Το ποίημα αγνοεί την κοινωνία", "Μιλά μόνο ένας αφηγητής-ιστορικός", "Μιλούν οι εχθροί"], "Ποιητική εξομολόγηση με συλλογική διάσταση."],
    ["Ποια ήταν η πρώτη χρονιά δημοσίευσης του έργου;", "1959", ["1945", "1963", "1974"], "Το «Άξιον Εστί» κυκλοφόρησε το 1959 και τιμήθηκε με το Κρατικό Βραβείο Ποίησης (1960)."],
    ["Τι κάνει η μελοποίηση στην πρόσληψη του ποιήματος, κατά το Πλαίσιο;", "Αναδεικνύει τον ρυθμό, τη συγκινησιακή ένταση και το νόημα", ["Αλλάζει το νόημα του ποιήματος", "Το κάνει κωμικό", "Δεν έχει καμία σχέση με αυτό"], "Το Πλαίσιο προτείνει ακρόαση και σύγκριση ανάγνωσης – ακρόασης."],
    ["Ποια θρησκευτική μορφή μπορεί να υποδηλώνει η μακρινή μητέρα της επωδού;", "Την Παναγία", ["Την Αθηνά", "Την Αφροδίτη", "Τη Δήμητρα"], "Μαζί με την πατρίδα — το Πλαίσιο δέχεται και τις δύο ερμηνείες."],
    ["Τι συμβολίζει η πέτρα;", "Τις δυσκολίες, την αντοχή και την ελληνική γη", ["Τον πλούτο", "Την αρχαία γλυπτική μόνο", "Τη φυλακή"], "Μέσα στη σκληρή πέτρα «φυτρώνει» η ζωή."]
  ],
  "2.4": [
    ["Σε ποιον ήρωα είναι αφιερωμένο το ποίημα;", "Στον Γρηγόρη Αυξεντίου", ["Στον Ευαγόρα Παλληκαρίδη", "Στον Κυριάκο Μάτση", "Στον Πετράκη Γιάλλουρο"], "Ο «Αποχαιρετισμός» γράφτηκε το 1957 για τον Γρηγόρη Αυξεντίου, υπαρχηγό της ΕΟΚΑ."],
    ["Τι είδους ποίημα είναι ως προς τη μορφή του λόγου;", "Δραματικός μονόλογος", ["Διάλογος δύο προσώπων", "Σονέτο", "Ελεγείο σε τρίτο πρόσωπο"], "Μιλά ο ίδιος ο ήρωας, σαν δραματικό πρόσωπο, λίγο πριν από τη θυσία του."],
    ["Πού βρίσκεται ο ήρωας τη στιγμή που μιλά;", "Στη σπηλιά-κρησφύγετο", ["Σε φυλακή της Λευκωσίας", "Σε ένα πλοίο", "Στο σπίτι της μητέρας του"], "Ο Αυξεντίου πέθανε στο κρησφύγετό του κοντά στη Μονή Μαχαιρά (3 Μαρτίου 1957)."],
    ["Ποια ιδέα για την ελευθερία διατυπώνει ο ήρωας;", "Η ελευθερία είναι χρέος όλων προς όλους — δεν έχει νόημα μόνο για τον εαυτό μας", ["Η ελευθερία αφορά μόνο τους στρατιώτες", "Η ελευθερία δεν αξίζει θυσίες", "Η ελευθερία είναι ατομική υπόθεση"], "Η ατομική ελευθερία δεν έχει νόημα χωρίς τη συλλογική — ποίηση του «εμείς»."],
    ["Ποια μεταμόρφωση της σπηλιάς ζητήθηκε στις Παγκύπριες 2026;", "Η σπηλιά γίνεται φωτεινή: η είσοδός της ταυτίζεται με τον ήλιο", ["Η σπηλιά γίνεται εκκλησία", "Η σπηλιά γίνεται θάλασσα", "Η σπηλιά γίνεται φυλακή"], "Από χώρος θανάτου γίνεται χώρος φωτός, ελευθερίας και αθανασίας — με μεταφορά."],
    ["Ποια είναι η λειτουργία της ανάμνησης με την ηλικιωμένη γυναίκα;", "Δείχνει πώς ο ήρωας νιώθει χρέος απέναντι στον απλό λαό", ["Είναι μια κωμική παρέκβαση", "Δείχνει ότι ο ήρωας θέλει να εγκαταλείψει", "Περιγράφει τον τόπο γέννησής του"], "Η ευχή της για ελευθερία τού γεννά συνείδηση χρέους."],
    ["Ποιο ζεύγος αντιθέσεων κυριαρχεί;", "Θάνατος – αθανασία (σκλαβιά – λευτεριά)", ["Πλούτος – φτώχεια", "Πόλη – χωριό", "Χειμώνας – καλοκαίρι"], "Ο θάνατος του αγωνιστή μετατρέπεται σε νίκη των ιδανικών."],
    ["Ποια θέση είχε ο Αυξεντίου στην ΕΟΚΑ;", "Υπαρχηγός", ["Αρχηγός", "Πολιτικός εκπρόσωπος", "Ταχυδρόμος"], "Ήταν ο δεύτερος στην ιεραρχία, μετά τον Διγενή (Γρίβα)."],
    ["Πώς πέθανε ο Αυξεντίου;", "Οι Βρετανοί έβαλαν φωτιά στο κρησφύγετό του μετά από πολύωρη μάχη", ["Εκτελέστηκε στην αγχόνη", "Πνίγηκε στη θάλασσα", "Πέθανε από αρρώστια"], "Στις 3 Μαρτίου 1957, κοντά στη Μονή Μαχαιρά."],
    ["Πού γεννήθηκε ο Γιάννης Ρίτσος;", "Στη Μονεμβασιά", ["Στη Λευκωσία", "Στη Θεσσαλονίκη", "Στη Σμύρνη"], "Ο Ρίτσος (1909–1990) γεννήθηκε στη Μονεμβασιά."],
    ["Τι δηλώνουν οι παρενθέσεις μέσα στο ποίημα, από άποψη θεατρικότητας;", "Λειτουργούν σαν έμμεσες σκηνικές οδηγίες ή σχόλια του ομιλητή", ["Είναι υποσημειώσεις του εκδότη", "Δηλώνουν τίτλους βιβλίων", "Είναι παραθέματα από τον Τύπο"], "Το Πλαίσιο αναφέρει διαλόγους και έμμεσες σκηνικές οδηγίες."],
    ["Τι μορφή στίχου έχει το ποίημα;", "Ελεύθερο, μακρύ στίχο με τόνο προφορικότητας", ["Δεκαπεντασύλλαβο με ομοιοκαταληξία", "Ιαμβικό ενδεκασύλλαβο", "Χαϊκού"], "Ο μακρύς ελεύθερος στίχος δίνει την αίσθηση ζωντανής ομιλίας."],
    ["Τι δηλώνει η πορεία «ατομική → εθνική → οικουμενική ελευθερία»;", "Ότι η θυσία του ήρωα αφορά όλη την ανθρωπότητα", ["Ότι ο ήρωας ενδιαφέρεται μόνο για τον εαυτό του", "Ότι η Κύπρος δεν έχει σημασία", "Ότι η ελευθερία είναι ουτοπία"], "Το Πλαίσιο, δείκτης 8."],
    ["Ποια συναισθήματα κυριαρχούν στον λόγο του ήρωα;", "Τρυφερότητα, γαλήνη και αγάπη για τους ανθρώπους", ["Οργή και μίσος", "Φόβος και πανικός", "Αδιαφορία"], "Ο αποχαιρετισμός του είναι τρυφερός, όχι μισαλλόδοξος."],
    ["Με ποιο αδίδακτο ποίημα συγκρίθηκε ο «Αποχαιρετισμός» στις Παγκύπριες 2026;", "Με ποίημα της Κλαίρης Αγγελίδου για τον Αυξεντίου", ["Με την «Ιθάκη» του Καβάφη", "Με τον «Ύμνο εις την Ελευθερίαν»", "Με το «Άξιον Εστί»"], "Ζητήθηκαν η συνείδηση του χρέους και η μεταμόρφωση της σπηλιάς."],
    ["Τι συμβολίζουν το βουνό και η σπηλιά;", "Τον αγώνα, την αντίσταση και τον τόπο της θυσίας", ["Τις διακοπές", "Τη φυσική ομορφιά μόνο", "Τη φυγή από τον αγώνα"], "Κατά το Πλαίσιο."],
    ["Τι ζητά η ερώτηση «συνείδηση του χρέους» στη σύγκριση;", "Δύο σημεία από κάθε ποίημα με τεκμηρίωση", ["Ένα σημείο συνολικά", "Περίληψη των δύο ποιημάτων", "Μόνο τον τίτλο κάθε ποιήματος"], "Ισόρροπη απάντηση για τα δύο κείμενα."],
    ["Σε ποιο ποίημα του Ελύτη προτείνει το Πλαίσιο συνανάγνωση;", "«Ο Ύπνος των Γενναίων»", ["«Η Μαρίνα των βράχων»", "«Μονόγραμμα»", "«Ήλιος ο Πρώτος»"], "Σύγκριση του τρόπου με τον οποίο ποιητές προσεγγίζουν τη θυσία."]
  ],
  "2.5": [
    ["Σε ποια γενιά ανήκει ο Αναγνωστάκης;", "Στην Πρώτη Μεταπολεμική Γενιά", ["Στη Γενιά του '30", "Στη Γενιά του '70", "Στη Νέα Αθηναϊκή Σχολή"], "Ποίηση πολιτικού προβληματισμού και διάψευσης."],
    ["Ποιο πολιτικό καθεστώς ισχύει όταν γράφεται το ποίημα;", "Η δικτατορία των Συνταγματαρχών", ["Η Κατοχή", "Η μεταπολίτευση", "Η βασιλεία του Όθωνα"], "Η χρονολογία του τίτλου (1969) τοποθετεί το ποίημα στη χούντα (1967–1974)."],
    ["Ποιο είναι το βασικό εκφραστικό μέσο του ποιήματος;", "Η ειρωνεία", ["Η ομοιοκαταληξία", "Η επική υπερβολή", "Ο υπερρεαλιστικός αυτοματισμός"], "Η ειρωνεία αποδομεί τον επίσημο λόγο της δικτατορίας."],
    ["Σε ποιον ποιητή παραπέμπει ο τίτλος;", "Στον Καβάφη", ["Στον Σολωμό", "Στον Ελύτη", "Στον Παλαμά"], "Τίτλοι με χρονολογίες και «μ.Χ.» θυμίζουν τα ιστορικά ποιήματα του Καβάφη."],
    ["Τι συμβολίζουν τα πρακτορεία μεταναστεύσεως;", "Τον οικονομικό εξαναγκασμό των ανθρώπων να φύγουν", ["Την ευημερία της χώρας", "Τον τουρισμό", "Την ελευθερία μετακίνησης"], "Η μετανάστευση ήταν μαζική και εξαναγκαστική."],
    ["Ποιο είναι το ύφος του ποιήματος;", "Λιτό, πεζολογικό, με συγκρατημένη πικρία", ["Πομπώδες και ρητορικό", "Λυρικό με πλούσια ομοιοκαταληξία", "Λαϊκό, σε δεκαπεντασύλλαβο"], "Η γενιά του προτιμά τον λιτό, καθημερινό λόγο."],
    ["Ποια ιδέα εκφράζει η εικόνα της αλυσίδας;", "Η ματαίωση περνά από γενιά σε γενιά", ["Η φιλία των παιδιών", "Η ελευθερία", "Η πρόοδος της τεχνολογίας"], "Η αλυσίδα δηλώνει τη συνεχή αναπαραγωγή της διάψευσης."],
    ["Σε ποια συλλογή ανήκει το ποίημα;", "«Ο Στόχος»", ["«Εποχές»", "«Συνέχεια»", "«Το περιθώριο»"], "«Ο Στόχος» πρωτοδημοσιεύτηκε στα «Δεκαοχτώ κείμενα» (1970)."],
    ["Τι ήταν τα «Δεκαοχτώ κείμενα»;", "Συλλογικός τόμος λογοτεχνών ως πράξη αντίστασης στη λογοκρισία της χούντας", ["Ανθολογία δημοτικών τραγουδιών", "Σχολικό εγχειρίδιο", "Περιοδικό του 19ου αιώνα"], "Δημοσιεύτηκε το 1970· ήταν η πρώτη συλλογική «σπάση» της σιωπής."],
    ["Σε ποια πόλη διαδραματίζεται το ποίημα;", "Στη Θεσσαλονίκη", ["Στην Αθήνα", "Στην Πάτρα", "Στη Λευκωσία"], "Η πόλη του ποιητή."],
    ["Τι συμβολίζουν τα τουριστικά γραφεία;", "Τη μετατροπή της χώρας σε χώρο εκμετάλλευσης και κατανάλωσης", ["Τη φιλοξενία των Ελλήνων", "Τη γνώση ξένων γλωσσών", "Τις σχολικές εκδρομές"], "Κατά το Πλαίσιο."],
    ["Τι συμβολίζει η τράπεζα στη θέση του παλιού κόσμου;", "Την κυριαρχία της λογικής της συναλλαγής", ["Την αποταμίευση των φτωχών", "Την ανεξαρτησία της χώρας", "Την αρχιτεκτονική πρόοδο"], "Οι ανθρώπινες αξίες υποτάσσονται στη λογική του κέρδους."],
    ["Γιατί η κριτική του ποιήματος είναι έμμεση;", "Λόγω της λογοκρισίας της δικτατορίας", ["Γιατί ο ποιητής συμφωνούσε με το καθεστώς", "Γιατί η ποίηση δεν μπορεί να μιλήσει για πολιτική", "Γιατί απευθύνεται σε παιδιά"], "Η ειρωνεία και η διακειμενικότητα επιτρέπουν κριτική «πίσω από τις λέξεις»."],
    ["Ποια σχέση προβάλλει το ποίημα ανάμεσα στις γενιές;", "Οι νεότεροι κληρονομούν τις διαψεύσεις των παλαιότερων", ["Οι νέοι αγνοούν πλήρως το παρελθόν και είναι ευτυχισμένοι", "Οι γενιές δεν έχουν καμία σχέση", "Οι παλαιότεροι ζηλεύουν τους νέους"], "Το Πλαίσιο, δείκτης 7."],
    ["Ποιο γνώρισμα της γενιάς του ποιητή ΔΕΝ υπάρχει στο ποίημα;", "Ο πανηγυρικός, θριαμβευτικός τόνος", ["Ο πολιτικός προβληματισμός", "Ο λιτός λόγος", "Η ειρωνεία"], "Η Πρώτη Μεταπολεμική Γενιά γράφει με πικρία, όχι με θριαμβολογία."],
    ["Τι κοινό έχει το ποίημα με τους «Αλεξανδρινούς Βασιλείς»;", "Την ειρωνεία απέναντι στον «θεατρικό» λόγο της εξουσίας", ["Την ίδια ιστορική περίοδο", "Τον ίδιο ποιητή", "Την ομοιοκαταληξία"], "Και τα δύο αποκαλύπτουν την κενότητα του επίσημου λόγου."],
    ["Ποια κοινωνικά φαινόμενα καταγγέλλει το ποίημα;", "Αυταρχισμό, λογοκρισία, αλλοτρίωση και μετανάστευση", ["Υπερβολική ελευθερία του Τύπου", "Ανεργία των ιερέων", "Πλεόνασμα αγροτικών προϊόντων"], "Το Πλαίσιο, δείκτης 6."],
    ["Πού γεννήθηκε ο Μανόλης Αναγνωστάκης;", "Στη Θεσσαλονίκη", ["Στην Κρήτη", "Στη Σμύρνη", "Στην Κέρκυρα"], "Θεσσαλονίκη, 1925."]
  ],
  "2.6": [
    ["Σε ποιο πρόσωπο κυρίως εκφράζεται το ποιητικό υποκείμενο;", "Στο α΄ πληθυντικό (συλλογική φωνή)", ["Στο γ΄ ενικό", "Στο β΄ πληθυντικό", "Στο α΄ ενικό αποκλειστικά"], "Μιλά για όλους τους πρόσφυγες — ποίηση του «εμείς»."],
    ["Ποιο ιστορικό γεγονός αποτελεί το πλαίσιο του ποιήματος;", "Η τουρκική εισβολή του 1974", ["Ο αγώνας της ΕΟΚΑ", "Η ανεξαρτησία του 1960", "Ο Β΄ Παγκόσμιος Πόλεμος"], "Προσφυγιά, θάνατοι, αγνοούμενοι."],
    ["Η ίδια φράση επαναλαμβάνεται στο τέλος τριών διαδοχικών στίχων (στ. 28–30). Πώς λέγεται το σχήμα;", "Επιφορά", ["Επαναφορά", "Ασύνδετο", "Κύκλος"], "Επανάληψη στο τέλος διαδοχικών στίχων· εδώ υπηρετεί την ειρωνεία."],
    ["Η απαρίθμηση επισκεπτών με συνεχή επανάληψη του «και» δημιουργεί ποιο σχήμα;", "Πολυσύνδετο", ["Ασύνδετο", "Παρομοίωση", "Οξύμωρο"], "Τονίζει το πλήθος των επισκεπτών που δεν προσφέρουν ουσιαστική βοήθεια."],
    ["Τι δηλώνουν τα εισαγωγικά σε φράσεις των επισκεπτών;", "Ειρωνεία — αμφισβήτηση της ειλικρίνειάς τους", ["Παράθεση επιστημονικού όρου", "Ευθύ λόγο του ποιητή", "Τίτλο βιβλίου"], "Ως σημείο στίξης, απομακρύνουν τον ποιητή από τα λόγια και τα αμφισβητούν."],
    ["Ποια συνέπεια της εισβολής ΔΕΝ αποτυπώνεται στους στ. 1–20;", "Η οικονομική ανάπτυξη του νησιού", ["Η προσφυγιά και η περιπλάνηση", "Η ερήμωση και η καταστροφή", "Ο θάνατος νέων στρατιωτών"], "Οι στ. 1–20 δείχνουν προσφυγιά, ερήμωση, ψυχική οδύνη, θάνατο νέων."],
    ["Σε ποιον απευθύνεται το ποιητικό υποκείμενο;", "Στη μητέρα του", ["Στους στρατιώτες", "Στον Γενικό Γραμματέα", "Στους αναγνώστες ευθέως"], "Η προσφώνηση στη μητέρα δίνει εξομολογητικό, θρηνητικό τόνο."],
    ["Πού γεννήθηκε ο Κώστας Μόντης;", "Στην Αμμόχωστο", ["Στη Λεμεσό", "Στην Αθήνα", "Στην Πάφο"], "Αμμόχωστος 1914 – Λευκωσία 2004."],
    ["Γιατί η ερημιά και η σιωπή μοιάζουν πολλαπλάσιες στους στ. 7–12;", "Επειδή πριν υπήρχαν πλήθος και θόρυβος — η απουσία βαραίνει περισσότερο", ["Επειδή ο τόπος ήταν πάντα έρημος", "Επειδή είναι νύχτα", "Επειδή ο ποιητής είναι κουφός"], "Η αντίθεση παρελθόντος – παρόντος εντείνει τον πόνο."],
    ["Τι αποκαλύπτουν τα ονόματα των στρατιωτών στους τοίχους, που βρίσκονται έπειτα και στο Στρατιωτικό Νεκροταφείο;", "Τον πρόωρο θάνατο νέων ανθρώπων", ["Τα ονόματα των επισκεπτών", "Τους αξιωματικούς που έφυγαν", "Τους δημοσιογράφους"], "Οι ηλικίες 18–19 δείχνουν τον χαμό της νιότης."],
    ["Ποιον ρόλο παίζει ο Γενικός Γραμματέας του διεθνούς οργανισμού στο ποίημα;", "Δίνει κενές διαβεβαιώσεις — η διεθνής κοινότητα δεν βοηθά", ["Σώζει τους πρόσφυγες", "Είναι Κύπριος αγωνιστής", "Γράφει το γράμμα"], "Η ειρωνεία στρέφεται κατά της αδράνειας και της υποκρισίας."],
    ["Πόσες τραγικές συνέπειες ζητήθηκαν στο Β1(α) του 2026;", "Δύο", ["Μία", "Τρεις", "Τέσσερις"], "Δύο συνέπειες, με παρουσίαση και τεκμηρίωση."],
    ["Πόσες μονάδες είχε συνολικά η ερώτηση Β1 του 2026;", "12", ["8", "10", "6"], "Β1(α) 6 + Β1(β) 6 = 12 μονάδες."],
    ["Τι παθαίνει κανείς στον οδηγό διόρθωσης αν μόνο εντοπίσει ένα σημείο ειρωνείας χωρίς ανάλυση;", "Παίρνει τις μισές μονάδες", ["Παίρνει όλες τις μονάδες", "Παίρνει μηδέν σε όλη την ερώτηση", "Χάνει μονάδες και από τη Γλώσσα"], "Η ανάλυση έχει 2 μονάδες ανά σημείο· ο απλός εντοπισμός μετρά τις μισές."],
    ["Πώς κλείνει η ενότητα ζ΄;", "Με την απόφαση του ποιητικού υποκειμένου να πει όλη την αλήθεια στη μητέρα", ["Με ευχαριστίες προς τους ξένους", "Με την επιστροφή στο σπίτι", "Με προσευχή στον Θεό"], "Η τελευταία δήλωση δείχνει πικρία και αποφασιστικότητα."],
    ["Σε ποιο ρεύμα/χώρο εντάσσεται ο Μόντης;", "Στην κυπριακή λογοτεχνία του 20ού αιώνα", ["Στην Επτανησιακή Σχολή", "Στη Νέα Αθηναϊκή Σχολή", "Στη βυζαντινή υμνογραφία"], "Από τις κορυφαίες φωνές της κυπριακής ποίησης."],
    ["Η μεταφορά του στ. 21 (οι πρόσφυγες σαν εμπόρευμα) δείχνει:", "Τη μετατροπή του δράματος σε αντικείμενο πολιτικής εκμετάλλευσης", ["Ότι οι Κύπριοι έγιναν έμποροι", "Την οικονομική άνθηση", "Την αγάπη των ξένων"], "Ταπείνωση και εκμετάλλευση του συλλογικού πόνου."],
    ["Ποια διάθεση κυριαρχεί στο ποίημα;", "Θρήνος, πικρία και ειρωνεία", ["Χαρά και αισιοδοξία", "Ουδετερότητα", "Χιούμορ για χάρη του γέλιου"], "Ο θρήνος συνυπάρχει με την καυστική ειρωνεία."]
  ],
  "2.7": [
    ["Ποιος ήταν ιστορικά ο Ονήσιλος;", "Αρχηγός της εξέγερσης των Κυπρίων κατά των Περσών (499/498–497 π.Χ.)", ["Βασιλιάς της Αθήνας", "Βυζαντινός αυτοκράτορας", "Αγωνιστής της ΕΟΚΑ"], "Ο Ονήσιλος, από τη Σαλαμίνα, ηγήθηκε της κυπριακής εξέγερσης στο πλαίσιο της Ιωνικής επανάστασης."],
    ["Ποιος αρχαίος ιστορικός αφηγείται την ιστορία του κρανίου με τις μέλισσες;", "Ο Ηρόδοτος", ["Ο Πλούταρχος", "Ο Θουκυδίδης", "Ο Πολύβιος"], "Οι Αμαθούσιοι κρέμασαν το κεφάλι του Ονήσιλου στις πύλες και οι μέλισσες έφτιαξαν κηρήθρα."],
    ["Τι συμβολίζει το χοντρό δέρμα που οι μέλισσες δεν μπορούν να τρυπήσουν;", "Την αδιαφορία και την αναισθησία των ανθρώπων", ["Τη δύναμη του στρατού", "Την υγεία του λαού", "Τον πλούτο"], "Η μεταφορά δείχνει την πνευματική αδράνεια."],
    ["Ποιο είναι το κεντρικό μήνυμα;", "Η ανάγκη ιστορικής εγρήγορσης και η καταδίκη του εφησυχασμού", ["Η χαρά της ειρήνης", "Ο θαυμασμός για τους Πέρσες", "Η αξία του μελιού"], "Ο ποιητής κατηγορεί τη συλλογική αδιαφορία που οδήγησε στην καταστροφή."],
    ["Ποιο στοιχείο θεατρικότητας εντοπίζεται;", "Η δραματική χειρονομία του Ονήσιλου με το κρανίο του", ["Ο διάλογος δύο χορών", "Οι σκηνικές οδηγίες σε παρενθέσεις", "Η διαίρεση σε πράξεις"], "Η χειρονομία του ήρωα είναι σκηνική εικόνα που κορυφώνει τη δράση."],
    ["Ποια φωνή κυριαρχεί;", "Η συλλογική φωνή του «εμείς», που ομολογεί ενοχή", ["Η φωνή του Ονήσιλου σε όλο το ποίημα", "Ένας ουδέτερος αφηγητής σε γ΄ πρόσωπο", "Η φωνή των Περσών"], "Το α΄ πληθυντικό δηλώνει τη συλλογική ευθύνη."],
    ["Τι τονίζει η επίμονη επανάληψη του αριθμού δέκα στο ποίημα;", "Την επίμονη αλλά μάταιη προσπάθεια αφύπνισης", ["Τον πλούτο της Σαλαμίνας", "Τον αριθμό των Περσών στρατιωτών", "Την ηλικία του ήρωα"], "Υπογραμμίζει τη διάρκεια της προειδοποίησης και την αδιαφορία που τη συνάντησε."],
    ["Ποια πόλη κρέμασε το κεφάλι του Ονήσιλου στις πύλες της;", "Η Αμαθούντα", ["Η Σαλαμίνα", "Η Αθήνα", "Η Σούσα"], "Οι Αμαθούσιοι είχαν μείνει πιστοί στους Πέρσες."],
    ["Τι έκαναν οι Αμαθούσιοι μετά από χρησμό, κατά τον Ηρόδοτο;", "Έθαψαν το κεφάλι και τιμούσαν τον Ονήσιλο ως ήρωα", ["Το έστειλαν στους Πέρσες", "Το πέταξαν στη θάλασσα", "Το έκαψαν"], "Ο Ονήσιλος έγινε έτσι ήρωας-σύμβολο."],
    ["Σε ποια ιστορική στιγμή της σύγχρονης Κύπρου παραπέμπει το ποίημα;", "Στην εισβολή του 1974 και στα χρόνια πριν από αυτήν", ["Στην ανεξαρτησία του 1960", "Στην αγγλική κατοχή του 1878", "Στην ένταξη στην ΕΕ"], "Η δεκαετία της προειδοποίησης και ο εισβολέας που φτάνει."],
    ["Ποια λειτουργία έχει η αρχαία ιστορία στο ποίημα;", "Γίνεται προσωπείο για να σχολιαστεί η σύγχρονη πραγματικότητα", ["Διδάσκει απλώς αρχαία ιστορία", "Δείχνει ότι το παρελθόν δεν έχει σχέση με το παρόν", "Προσφέρει χιουμοριστική ανάπαυλα"], "Η μεταποίηση της ιστορίας υπηρετεί τη σύγχρονη αυτοκριτική."],
    ["Τι συμβολίζουν οι μέλισσες του κρανίου;", "Την ιστορική μνήμη που προσπαθεί να ξυπνήσει τη συνείδηση", ["Τη γλυκύτητα της ζωής", "Τους εχθρούς", "Την οικονομική ευημερία"], "Τα κεντριά τους είναι οι προειδοποιήσεις της ιστορίας."],
    ["Πώς χαρακτηρίζεται η ποιητική φωνή του Μηχανικού;", "Λιτή, κυνική και συχνά προφητική", ["Πανηγυρική και ενθουσιώδης", "Ερωτική και τρυφερή", "Παιδική και αφελής"], "Η ποίησή του διαβάζεται συχνά ως προειδοποίηση."],
    ["Ποια αντίθεση διατρέχει το ποίημα;", "Η προσπάθεια αφύπνισης – η αδιαφορία των ανθρώπων", ["Ο πλούτος – η φτώχεια", "Η πόλη – η ύπαιθρος", "Το καλοκαίρι – ο χειμώνας"], "Κατά το Πλαίσιο."],
    ["Με ποιο εξεταστέο κείμενο μοιράζεται ο «Ονήσιλος» τη Σαλαμίνα της Κύπρου;", "Με την «Ελένη» του Σεφέρη", ["Με το «†13-12-43»", "Με την «Αστροφεγγιά»", "Με το «Θεσσαλονίκη, Μέρες του 1969 μ.Χ.»"], "Τεύκρος και Ονήσιλος: δύο αρχαίοι ήρωες της Σαλαμίνας."],
    ["Ποια αξία προβάλλει το ποίημα για την εθνική ταυτότητα;", "Την ιστορική μνήμη, την αντίσταση και την ευθύνη απέναντι στον τόπο", ["Την υποταγή στον ισχυρό", "Την αδιαφορία για την ιστορία", "Τη μετανάστευση"], "Κατά το Πλαίσιο, δείκτης 7."],
    ["Πότε γράφτηκε ο «Ονήσιλος»;", "Μετά την εισβολή του 1974", ["Το 1931", "Το 1821", "Πριν από τον Β΄ Παγκόσμιο Πόλεμο"], "Ανήκει στην ποίηση της εισβολής."],
    ["Ποια εικόνα δηλώνει την απειλή που τελικά φτάνει;", "Ο ήχος του εισβολέα που πλησιάζει", ["Η μυρωδιά του μελιού", "Το φως του ήλιου", "Η σιωπή του δάσους"], "Ακουστική εικόνα που κορυφώνει τη δραματική ένταση."]
  ],
  "2.8": [
    ["Ποιο δράμα της Κύπρου προβάλλει το ποίημα;", "Το δράμα των αγνοουμένων", ["Τη μετανάστευση στην Αυστραλία", "Τον εμφύλιο του 1946", "Τη φτώχεια της αποικιοκρατίας"], "Ο πατέρας είναι αγνοούμενος της εισβολής του 1974."],
    ["Πώς είναι παρών ο πατέρας στο μυστήριο;", "Κρυφά, παράμερα, χωρίς να τον αναγνωρίσει κανείς", ["Ως κουμπάρος", "Συνοδεύοντας τη νύφη", "Μιλώντας στους καλεσμένους"], "Η κρυφή παρουσία του δηλώνει την αόρατη ύπαρξη του αγνοουμένου."],
    ["Ποια ειρωνεία εντοπίζεται;", "Οι καλεσμένοι τον περνούν για περιθωριακό του χωριού, ενώ είναι ο πατέρας της νύφης", ["Η νύφη δεν θέλει να παντρευτεί", "Ο ιερέας ξεχνά τα λόγια", "Η εκκλησία είναι άδεια"], "Δραματική ειρωνεία: ο αναγνώστης ξέρει την ταυτότητά του, οι καλεσμένοι όχι."],
    ["Ποια αντίθεση διατρέχει το ποίημα;", "Η χαρά του γάμου – ο πόνος της απουσίας", ["Ο πλούτος – η φτώχεια", "Η πόλη – η θάλασσα", "Η νύχτα – η μέρα"], "Η γιορτή της ζωής φωτίζει το κενό του πατέρα."],
    ["Τι συμβολίζει η Πράσινη Γραμμή;", "Τη διαίρεση του νησιού", ["Τα πράσινα χωράφια", "Την ελπίδα", "Τα σύνορα με την Ελλάδα"], "Χωρίζει τη Λευκωσία και την Κύπρο."],
    ["Πώς χαρακτηρίζεται η μορφή του ποιήματος σύμφωνα με το Πλαίσιο Προγράμματος;", "Γνωρίσματα επώνυμης παραδοσιακής ποίησης (στροφική οργάνωση, λυρικό ύφος, τίτλος σχετικός με το περιεχόμενο)", ["Πεζοτράγουδο", "Υπερρεαλιστικό ποίημα χωρίς νόημα", "Θεατρικό έργο"], "Το Πλαίσιο ζητά διάκριση παραδοσιακών και μοντέρνων στοιχείων."],
    ["Με ποιο τρόπο αφηγείται το ποιητικό υποκείμενο;", "Με συγκρατημένο, λιτό τρόπο", ["Με ρητορικές κραυγές", "Με χιούμορ", "Με επιστημονική ορολογία"], "Η λιτότητα κάνει τη συγκίνηση πιο έντονη."],
    ["Σε ποια συλλογή δημοσιεύτηκε το ποίημα;", "«Θόλος» (1989)", ["«Αμμόχωστος Βασιλεύουσα»", "«Αχαιών Ακτή»", "«Μεθιστορία»"], "Η συλλογή «Θόλος» τιμήθηκε από την Ακαδημία Αθηνών (1989)."],
    ["Πού συμβολικά χάθηκε ο πατέρας;", "Στα βάθη της Ανατολής, δηλαδή σε φυλακές στην Τουρκία", ["Στη θάλασσα", "Στην Αμερική", "Στο βουνό Τρόοδος"], "Η Ανατολή δηλώνει τον τόπο όπου χάθηκαν οι αγνοούμενοι."],
    ["Τι συμβολίζει η επιστροφή του πατέρα στη γη στο τέλος;", "Τον θάνατο — και τη γη της πατρίδας", ["Την καλλιέργεια των χωραφιών του", "Τη φυγή του στο εξωτερικό", "Τη θεραπεία του"], "Η παρουσία του ήταν οραματική."],
    ["Γιατί το ποίημα χαρακτηρίζεται οραματικό;", "Γιατί ο νεκρός-αγνοούμενος εμφανίζεται για λίγο στη γιορτή της κόρης του", ["Γιατί προβλέπει το μέλλον της Κύπρου", "Γιατί περιγράφει όνειρο της νύφης", "Γιατί είναι γραμμένο σε μέλλοντα"], "Η σκηνή ανήκει στον χώρο του συμβολικού, όχι του ρεαλιστικού."],
    ["Ποια στοιχεία θεατρικότητας εντοπίζονται;", "Σκηνικό, πρόσωπα, κινήσεις και εξωτερική εικόνα του πατέρα", ["Διάλογος σε θεατρική μορφή με ονόματα προσώπων", "Διαίρεση σε πράξεις", "Χορικά"], "Κατά το Πλαίσιο, δείκτης 6."],
    ["Ποια πολιτισμική παράδοση πλαισιώνει τη σκηνή;", "Η ορθόδοξη παράδοση του γάμου", ["Η αρχαία ολυμπιακή τελετή", "Ένα ρωμαϊκό συμπόσιο", "Μια σύγχρονη συναυλία"], "Η εκκλησία και τα στέφανα."],
    ["Πού γεννήθηκε ο Κυριάκος Χαραλαμπίδης;", "Στην Άχνα της Αμμοχώστου", ["Στη Θεσσαλονίκη", "Στην Πάφο", "Στη Σμύρνη"], "Γεννήθηκε το 1940."],
    ["Ποιο γνώρισμα διακρίνει το ποίημα από τη μοντέρνα ποίηση;", "Η συνάφεια τίτλου και περιεχομένου", ["Ο αινιγματικός τίτλος", "Η χαλαρή λογική αλληλουχία", "Η πλήρης απουσία στροφών"], "Παραδοσιακό γνώρισμα σύμφωνα με το Πλαίσιο."],
    ["Με ποιο ποίημα προτείνει το Πλαίσιο συνανάγνωση;", "Με το «Του Χρυσοσώτηρου» του Α. Παστελλά", ["Με την «Ιθάκη» του Καβάφη", "Με το «Άξιον Εστί»", "Με την «Ελένη» του Σεφέρη"], "Σύγκριση θεματικής, πλαισίου, διαχείρισης της απώλειας."],
    ["Ποιες αξίες προβάλλει το ποίημα;", "Οικογενειακή συνοχή, αγάπη για την πατρίδα, ιστορική μνήμη", ["Πλουτισμό και επιτυχία", "Λήθη του παρελθόντος", "Ατομικισμό"], "Κατά το Πλαίσιο, δείκτης 7."],
    ["Τι νιώθει ο αναγνώστης βλέποντας την αντίδραση των καλεσμένων;", "Πικρία και συγκίνηση, επειδή ξέρει ποιος είναι ο άγνωστος", ["Γέλιο", "Αδιαφορία", "Θυμό προς τον πατέρα"], "Η δραματική ειρωνεία εντείνει τη συγκίνηση."]
  ],
  "3.1": [
    ["Τι σημαίνει ο τίτλος †13-12-43;", "Την ημερομηνία του Ολοκαυτώματος των Καλαβρύτων", ["Την ημερομηνία γέννησης του συγγραφέα", "Την απελευθέρωση της Αθήνας", "Τον θάνατο του αδελφού του αφηγητή"], "Στις 13 Δεκεμβρίου 1943 τα γερμανικά στρατεύματα εκτέλεσαν μαζικά τους άνδρες των Καλαβρύτων."],
    ["Τι είδους αφηγητής υπάρχει;", "Ομοδιηγητικός, σε α΄ πρόσωπο (αυτόπτης μάρτυρας)", ["Ετεροδιηγητικός, σε γ΄ πρόσωπο", "Παντογνώστης εξωτερικός αφηγητής", "Δεν υπάρχει αφηγητής, μόνο διάλογος"], "Ο αφηγητής αφηγείται όσα βλέπει και νιώθει."],
    ["Ποια αντίθεση βρίσκεται στο κέντρο του διηγήματος;", "Η ευλάβεια των συγγενών – η επιπολαιότητα των επισκεπτών του πούλμαν", ["Η φτώχεια – ο πλούτος", "Το χωριό – η πόλη", "Ο χειμώνας – το καλοκαίρι"], "Αναδεικνύει την ηθική κρίση του αφηγητή για τη λήθη."],
    ["Ποια τεχνική επιβραδύνει την αφήγηση στο σημείο της εκταφής;", "Η επιβράδυνση με λεπτομερή περιγραφή", ["Η πρόληψη", "Η επιτάχυνση", "Το in medias res"], "Ο αναγνώστης «στέκεται» μαζί με τον αφηγητή στη συγκίνηση."],
    ["Σε ποια συλλογή ανήκει το διήγημα;", "«Για ένα φιλότιμο» (1964)", ["«Η μόνη κληρονομιά»", "«Το δικό μας αίμα»", "«Ο της φύσεως νόμος»"], "Η αρχική πεζογραφική συλλογή του Ιωάννου."],
    ["Πώς κλείνει το διήγημα;", "Ο αφηγητής μένει πίσω, αποκομμένος από την ομάδα, και πηγαίνει πικραμένος σε ένα λαϊκό καφενείο", ["Η ομάδα ζητά συγγνώμη", "Ο αφηγητής βρίσκει τον τάφο του πατέρα του", "Γίνεται τελετή με στρατιωτικές τιμές"], "Το τέλος αφήνει την πικρία για τη λήθη."],
    ["Ποιοι ανοίγουν τον τάφο στον λόφο της εκτέλεσης;", "Ένα αδελφικό ζευγάρι, για τον μικρότερο αδελφό του", ["Ο αφηγητής για τον πατέρα του", "Στρατιώτες", "Αρχαιολόγοι"], "Η εκταφή γίνεται περίπου είκοσι χρόνια μετά την εκτέλεση."],
    ["Πώς φτάνει η οργανωμένη ομάδα επισκεπτών στον τόπο;", "Με πούλμαν", ["Με τρένο", "Με τα πόδια, σε προσκύνημα", "Με πλοίο"], "Η ομάδα έρχεται αργότερα, ενώ ο αφηγητής βρίσκεται ήδη εκεί."],
    ["Τι αποκαλύπτει η σιωπή της ομάδας όταν κάποιος δικαιολογεί την εκτέλεση;", "Ηθική αναισθησία και απουσία ιστορικής ευθύνης", ["Σεβασμό για τους νεκρούς", "Φόβο για τον ξεναγό", "Συμφωνία με τον αφηγητή"], "Κανείς δεν αντιδρά — αυτό πληγώνει τον αφηγητή."],
    ["Τι δηλώνει το επεισόδιο με τις ακατάλληλες εφημερίδες για τα οστά;", "Την ασέβεια της κοινωνίας απέναντι στους νεκρούς", ["Την οικονομική κρίση", "Το ενδιαφέρον για τις ειδήσεις", "Τη βοήθεια της ομάδας"], "Μικρή λεπτομέρεια με μεγάλο συμβολικό βάρος."],
    ["Ποιος αφηγηματικός τρόπος αποκαλύπτει την ηθική στάση του αφηγητή;", "Το σχόλιο", ["Ο διάλογος", "Η περίληψη", "Η πρόληψη"], "Το σχόλιο φανερώνει τις σκέψεις και την αγανάκτησή του."],
    ["Τι θυμάται ο αφηγητής μπροστά στον τόπο της εκτέλεσης;", "Τον δικό του φόβο σε κινδύνους της Κατοχής", ["Τις διακοπές του", "Τη σχολική του γιορτή", "Ένα ταξίδι στο εξωτερικό"], "Η αναδρομή συνδέει το παρόν με την εμπειρία της Κατοχής."],
    ["Πού γεννήθηκε ο Γιώργος Ιωάννου;", "Στη Θεσσαλονίκη", ["Στα Καλάβρυτα", "Στην Αθήνα", "Στη Λευκωσία"], "Θεσσαλονίκη, 1927."],
    ["Σε ποιο ρεύμα εντάσσεται το διήγημα;", "Στη μεταπολεμική πεζογραφία", ["Στη Γενιά του '30", "Στον ρομαντισμό", "Στην ηθογραφία του 19ου αιώνα"], "Βιωματική, εξομολογητική γραφή."],
    ["Ποια εικόνα κυριαρχεί στον λόφο της εκτέλεσης;", "Ένας μεγάλος λευκός σταυρός και η ημερομηνία σχηματισμένη με πέτρες", ["Ένα άγαλμα στρατιώτη", "Ένα σύγχρονο μουσείο", "Μια σημαία της ΕΟΚΑ"], "Ο τόπος μνήμης στήνεται με απλά, συγκινητικά σύμβολα."],
    ["Ποιο ιστορικό γεγονός είναι το πλαίσιο του διηγήματος;", "Η γερμανική Κατοχή και το Ολοκαύτωμα των Καλαβρύτων", ["Η τουρκική εισβολή στην Κύπρο", "Ο εμφύλιος πόλεμος", "Η Μικρασιατική Καταστροφή"], "Κατά το Πλαίσιο, δείκτης 5."],
    ["Γιατί η αφήγηση είναι αξιόπιστη μαρτυρία;", "Επειδή ο αφηγητής είναι αυτόπτης μάρτυρας και μιλά σε α΄ πρόσωπο", ["Επειδή παραθέτει επίσημα αρχεία", "Επειδή είναι ιστορικός", "Επειδή αφηγείται σε τρίτο πρόσωπο"], "Η πρωτοπρόσωπη αφήγηση δίνει αμεσότητα και αξιοπιστία."],
    ["Ποια συναισθήματα κυριαρχούν στον αφηγητή;", "Συγκίνηση, αγανάκτηση και πικρία", ["Χαρά και ενθουσιασμός", "Βαρεμάρα", "Φόβος για το ταξίδι"], "Συγκινείται μπροστά στους νεκρούς και αγανακτεί με τη λήθη."]
  ],
  "3.2": [
    ["Ποιος αφηγείται στο απόσπασμα;", "Η ηρωίδα σε α΄ πρόσωπο (αυτοδιηγητική αφηγήτρια)", ["Ένας παντογνώστης αφηγητής σε γ΄ πρόσωπο", "Ο πατέρας της ηρωίδας", "Ένας γείτονας"], "Η αφηγήτρια είναι και πρωταγωνίστρια."],
    ["Πού διαδραματίζεται το απόσπασμα;", "Στο Αϊδίνι της Μικράς Ασίας", ["Στη Σμύρνη μετά το 1922", "Στην Αθήνα της Κατοχής", "Στην Κύπρο"], "Η Διδώ Σωτηρίου γεννήθηκε στο Αϊδίνι."],
    ["Ποιο κοινωνικό φαινόμενο προβάλλεται έντονα;", "Οι ταξικές διακρίσεις ανάμεσα σε πλούσιους και φτωχούς", ["Η βιομηχανική επανάσταση", "Η μετανάστευση στην Αμερική", "Ο αθλητισμός"], "Αντιθέσεις αλλά και αλληλεγγύη."],
    ["Τι λειτουργία έχει ο διάλογος στο απόσπασμα;", "Δίνει φυσικότητα και ζωντάνια και δείχνει τις σχέσεις των προσώπων", ["Επιταχύνει την αφήγηση", "Κρύβει τα συναισθήματα", "Δεν έχει καμία λειτουργία"], "Ο διάλογος ζωντανεύει τα πρόσωπα."],
    ["Ποια διάθεση κυριαρχεί στην αφήγηση;", "Νοσταλγική", ["Σατιρική", "Επική-πολεμική", "Ουδέτερη"], "Ανάμνηση του χαμένου κόσμου των παιδικών χρόνων."],
    ["Ποιο ιστορικό γεγονός «σκιάζει» την ανάμνηση;", "Η Μικρασιατική Καταστροφή του 1922", ["Η Κατοχή", "Η δικτατορία του 1967", "Η εισβολή του 1974"], "Ο αναγνώστης ξέρει ότι αυτός ο κόσμος θα χαθεί."],
    ["Σε ποιο είδος πεζογραφίας ανήκει το έργο;", "Μυθιστόρημα", ["Διήγημα", "Χρονικό ταξιδιού", "Θεατρικό έργο"], "Το πρώτο μυθιστόρημα της Διδώς Σωτηρίου (1959)."],
    ["Ποιο άλλο γνωστό μυθιστόρημα έγραψε η Διδώ Σωτηρίου;", "«Ματωμένα χώματα»", ["«Αστροφεγγιά»", "«Ζορμπάς»", "«Η Φόνισσα»"], "«Ματωμένα χώματα» (1962)."],
    ["Τι δηλώνει ο τίτλος «Οι νεκροί περιμένουν»;", "Το χρέος της μνήμης απέναντι σε όσους χάθηκαν", ["Ότι το έργο είναι μυθιστόρημα τρόμου", "Ότι η ηρωίδα πεθαίνει στην αρχή", "Ότι οι νεκροί επιστρέφουν"], "Οι νεκροί «περιμένουν» να μη ξεχαστούν."],
    ["Ποιες δύο οπτικές συνυπάρχουν στην αφήγηση;", "Η παιδική οπτική της ηρωίδας και η ώριμη της ενήλικης αφηγήτριας", ["Του πατέρα και της μητέρας", "Δύο διαφορετικών αφηγητών", "Του Έλληνα και του Τούρκου γείτονα"], "Η ενήλικη αφηγήτρια θυμάται το παιδί που ήταν."],
    ["Τι λειτουργία έχει η περιγραφή στο απόσπασμα;", "Αποδίδει παραστατικά τον μικρασιατικό χώρο, τους ανθρώπους και τα έθιμα", ["Επιταχύνει την πλοκή", "Δείχνει την πολεμική σύγκρουση", "Δεν υπάρχει περιγραφή"], "Κατά το Πλαίσιο, δείκτης 2."],
    ["Ποια αξία προβάλλεται μέσα από τη γειτονιά;", "Η αλληλεγγύη και η καθημερινή συνύπαρξη", ["Ο ανταγωνισμός", "Η απομόνωση", "Η αδιαφορία"], "Μαζί με τις ταξικές διακρίσεις."],
    ["Τι λειτουργία έχει το σχόλιο της αφηγήτριας;", "Αποκαλύπτει τις σκέψεις και τη νοσταλγική στάση της απέναντι στο παρελθόν", ["Αφηγείται τα γεγονότα με χρονική σειρά", "Δίνει τα λόγια άλλων προσώπων", "Περιγράφει τοπία μόνο"], "Κατά το Πλαίσιο."],
    ["Ποια χρονιά γεννήθηκε η Διδώ Σωτηρίου;", "Το 1909", ["Το 1922", "Το 1945", "Το 1880"], "Αϊδίνι 1909 – Αθήνα 2004."],
    ["Πώς ενισχύει η πρωτοπρόσωπη αφήγηση τη συμμετοχή του αναγνώστη;", "Με την αμεσότητα και τη συγκινησιακή φόρτιση της προσωπικής ανάμνησης", ["Με την ψυχρή αντικειμενικότητα", "Με επιστημονικά στοιχεία", "Με χιούμορ"], "Κατά το Πλαίσιο, δείκτης 1."],
    ["Ποια μορφή σχέσης ΔΕΝ αναφέρει το Πλαίσιο για το απόσπασμα;", "Σχέσεις εργοδότη – συνδικαλιστή σε εργοστάσιο", ["Οικογενειακές", "Ταξικές", "Διαγενεακές"], "Το Πλαίσιο μιλά για οικογενειακές, κοινωνικές, ταξικές, διαγενεακές σχέσεις και σχέσεις κοινωνικών ομάδων."],
    ["Γιατί η νοσταλγία είναι τόσο έντονη στο απόσπασμα;", "Επειδή ο κόσμος που περιγράφεται χάθηκε οριστικά με την Καταστροφή", ["Επειδή η αφηγήτρια βαριέται", "Επειδή ήταν πάντα πλούσια", "Επειδή ζει ακόμη εκεί"], "Η γνώση της απώλειας φορτίζει την ανάμνηση."],
    ["Σε ποια λογοτεχνική περίοδο εντάσσεται το έργο;", "Στη μεταπολεμική πεζογραφία", ["Στη Γενιά του 1880", "Στην κρητική λογοτεχνία", "Στην Επτανησιακή Σχολή"], "Γράφτηκε το 1959."]
  ],
  "3.3": [
    ["Ποια σχέση έχουν ο Πετρής και ο Αρτέμης;", "Πατέρας και μοναχογιός", ["Αδέρφια", "Δάσκαλος και μαθητής", "Παππούς και εγγονός"], "Ο Αρτέμης είναι ο μοναχογιός του Πετρή."],
    ["Ποιο πραγματικό γεγονός ενέπνευσε το διήγημα;", "Ο θάνατος του μαθητή Πετράκη Γιάλλουρου (1956)", ["Ο θάνατος του Γρηγόρη Αυξεντίου", "Η εισβολή του 1974", "Η ανακήρυξη της ανεξαρτησίας"], "Ο Γιάλλουρος σκοτώθηκε στις 7 Φεβρουαρίου 1956 στην Αμμόχωστο."],
    ["Τι είδους αφηγητής υπάρχει;", "Ετεροδιηγητικός, σε γ΄ πρόσωπο", ["Ομοδιηγητικός, σε α΄ πρόσωπο", "Ο Αρτέμης ως αφηγητής", "Πολλοί αφηγητές εναλλάξ"], "Δεν συμμετέχει στην ιστορία και γνωρίζει τις σκέψεις του Πετρή."],
    ["Ποια χρονική τεχνική κυριαρχεί στην παρουσίαση της ζωής του Πετρή;", "Αναδρομή με επιτάχυνση (περιληπτική απόδοση χρόνων)", ["Πρόληψη", "Ευθύγραμμη αφήγηση χωρίς κενά", "Ημερολογιακή γραφή"], "Πολλά χρόνια συμπυκνώνονται σε λίγες γραμμές."],
    ["Πώς χαρακτηρίζεται ο Πετρής;", "Στωικός, λιγομίλητος, δεμένος με τη γη", ["Φλύαρος και επιπόλαιος", "Δειλός και ανεύθυνος", "Πλούσιος έμπορος της πόλης"], "Ο πόνος του φαίνεται μέσα από τη σιωπή."],
    ["Τι συμβολίζει ο πορτοκαλόκηπος;", "Τον κόπο μιας ζωής, τη σχέση με τη γη και τη συνέχεια", ["Τον βρετανικό στρατό", "Το σχολείο", "Τον πλούτο της πόλης"], "Ο κήπος είναι η ζωή του Πετρή — και το καταφύγιό του."],
    ["Σε ποια συλλογή ανήκει το διήγημα;", "«Σκληροί καιροί» (1962)", ["«Ματωμένα χώματα»", "«Για ένα φιλότιμο»", "«Οι νεκροί περιμένουν»"], "Συλλογή του Γ. Φ. Πιερίδη (1962)."],
    ["Πού γεννήθηκε ο Γ. Φ. Πιερίδης;", "Στο Δάλι", ["Στην Αμμόχωστο", "Στη Λεμεσό", "Στην Αθήνα"], "Δάλι, 9 Αυγούστου 1904 – Δεκέμβριος 1999."],
    ["Ποια ήταν η ιδιότητα του Πετράκη Γιάλλουρου;", "Σημαιοφόρος του Ελληνικού Γυμνασίου Αμμοχώστου", ["Δάσκαλος του χωριού", "Αρχηγός της ΕΟΚΑ", "Δημοσιογράφος"], "Μαθητής, θύμα βρετανικών πυρών σε διαδήλωση."],
    ["Σε ποια περιοχή της Κύπρου τοποθετείται η ιστορία;", "Στην περιοχή της Αμμοχώστου", ["Στην Πάφο", "Στο Τρόοδος", "Στην Κερύνεια"], "Εκεί σκοτώθηκε και ο Γιάλλουρος."],
    ["Πώς ξεκινά το διήγημα;", "Με περιγραφή του τόπου και της ζωής των ανθρώπων της υπαίθρου", ["Με τον θάνατο του Αρτέμη", "Με διάλογο πατέρα – γιου", "Με την κηδεία"], "Η αφήγηση ανατρέχει έπειτα στη ζωή του Πετρή."],
    ["Τι προσφέρει στον Πετρή η φύση στο τέλος;", "Παρηγοριά και δύναμη να συνεχίσει", ["Πλούτο από τη σοδειά", "Αφορμή για εκδίκηση", "Λήθη του γιου του"], "Η νέα μέρα φέρνει την αίσθηση ότι η ζωή συνεχίζεται."],
    ["Ποιο ιστορικό πλαίσιο έχει το διήγημα;", "Ο Απελευθερωτικός Αγώνας της ΕΟΚΑ (1955–1959) κατά της βρετανικής αποικιοκρατίας", ["Η τουρκική εισβολή", "Ο Β΄ Παγκόσμιος Πόλεμος", "Η Μικρασιατική Καταστροφή"], "Κατά το Πλαίσιο, δείκτης 5."],
    ["Γιατί ο διάλογος είναι περιορισμένος στο διήγημα;", "Γιατί ταιριάζει στον λιγομίλητο Πετρή και στη σιωπηλή απόδοση του πόνου", ["Γιατί ο συγγραφέας δεν ήξερε να γράφει διάλογο", "Γιατί τα πρόσωπα είναι ξένοι", "Γιατί είναι θεατρικό έργο"], "Η σιωπή γίνεται μέσο έκφρασης."],
    ["Ποιο είναι το κέντρο του ενδιαφέροντος στο διήγημα;", "Η μορφή του πατέρα", ["Η μάχη με τους Βρετανούς", "Η ζωή στο σχολείο", "Η πολιτική ιστορία της Κύπρου"], "Δεν είναι χρονικό του γεγονότος, αλλά δράμα ενός πατέρα."],
    ["Ποια στοιχεία κυπριακής πολιτισμικής κληρονομιάς προβάλλονται;", "Η ζωή της υπαίθρου, η σχέση με τη γη, η οικογένεια, η ελληνική παιδεία", ["Η βιομηχανία και οι ουρανοξύστες", "Ο τουρισμός", "Τα ξενοδοχεία"], "Κατά το Πλαίσιο, δείκτης 6."],
    ["Με ποιο εξεταστέο ποίημα για την ΕΟΚΑ συγκρίνεται εύκολα το διήγημα;", "Τον «Αποχαιρετισμό» του Ρίτσου", ["Την «Ελένη» του Σεφέρη", "Τους «Αλεξανδρινούς Βασιλείς»", "Το «Θεσσαλονίκη, Μέρες του 1969 μ.Χ.»"], "Δύο θυσίες του αγώνα της ΕΟΚΑ."],
    ["Τι κάνει ο Πετρής μετά την κηδεία;", "Αναζητά καταφύγιο στη φύση, στον κήπο του", ["Μεταναστεύει", "Πουλά τον κήπο", "Γίνεται αντάρτης"], "Η φύση γίνεται τόπος παρηγοριάς."]
  ],
  "3.4": [
    ["Ποιος είναι ο πρωταγωνιστής της «Αστροφεγγιάς»;", "Ο Άγγελος Γιαννούζης", ["Ο Νίκος Στέργης", "Ο Πασπάτης", "Ο Αρτέμης"], "Φτωχός έφηβος από επαρχιακή οικογένεια."],
    ["Σε ποιο είδος μυθιστορήματος εντάσσεται;", "Μυθιστόρημα διαπλάσεως (ενηλικίωσης)", ["Αστυνομικό μυθιστόρημα", "Ιστορικό μυθιστόρημα για το 1821", "Επιστημονική φαντασία"], "Η ωρίμανση του Αγγέλου μέσα από απογοητεύσεις."],
    ["Πού και πότε διαδραματίζεται;", "Στην Αθήνα, περίπου 1918–1925", ["Στη Σμύρνη, 1922", "Στη Θεσσαλονίκη, 1969", "Στην Κύπρο, 1956"], "Μετά τον Α΄ Παγκόσμιο Πόλεμο, με φόντο τη Μικρασιατική Καταστροφή."],
    ["Τι είδους αφηγητής υπάρχει;", "Εξωδιηγητικός-ετεροδιηγητικός, παντογνώστης, σε γ΄ πρόσωπο", ["Ο Άγγελος σε α΄ πρόσωπο", "Η Δάφνη σε α΄ πρόσωπο", "Επιστολική αφήγηση"], "Γνωρίζει τις σκέψεις των ηρώων — κυρίως του Αγγέλου."],
    ["Στο απόσπασμα των Παγκυπρίων 2026, πώς συμπεριφέρεται η Δάφνη στον Άγγελο;", "Τον ειρωνεύεται και απειλεί να τον εκθέσει στην παρέα", ["Τον παρηγορεί τρυφερά", "Τον αγνοεί εντελώς", "Του ζητά να της γράψει ποίημα"], "Ο Άγγελος πανικοβάλλεται, θυμώνει και φεύγει έτοιμος να κλάψει."],
    ["Τι συμβολίζει ο τίτλος;", "Το αδύναμο φως των αστεριών: τα όνειρα της εφηβείας που σβήνουν", ["Τη λάμψη της επιτυχίας", "Την αστρονομία", "Τον ήλιο της ελευθερίας"], "Λιγοστό νυχτερινό φως — όπως οι ελπίδες που ματαιώνονται."],
    ["Ποιο κοινωνικό θέμα διατρέχει το έργο;", "Η ταξική αντίθεση φτωχών και πλουσίων", ["Η τεχνολογική πρόοδος", "Ο τουρισμός", "Η μετανάστευση στη Γερμανία"], "Η απόσταση αυτή πληγώνει τον Άγγελο."],
    ["Ποια χρονιά δημοσιεύτηκε για πρώτη φορά το μυθιστόρημα;", "1946", ["1922", "1971", "1959"], "Το 1971 ο συγγραφέας πρόσθεσε τον υπότιτλο."],
    ["Ποιος είναι ο υπότιτλος που προστέθηκε αργότερα;", "«Η ιστορία μιας εφηβείας»", ["«Χρονικό του πολέμου»", "«Ημερολόγιο ενός φοιτητή»", "«Αθηναϊκά διηγήματα»"], "Δηλώνει το είδος: μυθιστόρημα διαπλάσεως."],
    ["Ποια είναι η κοινωνική θέση του Νίκου Στέργη;", "Εύπορος, γιος βιομηχάνου", ["Φτωχός πρόσφυγας", "Εργάτης στο λιμάνι", "Αγρότης"], "Η φιλία του με τον Άγγελο δείχνει την ταξική απόσταση."],
    ["Ποια είναι η σχέση του Αγγέλου με τη Δάφνη;", "Την αγαπά κρυφά χωρίς να τολμά να τη διεκδικήσει", ["Είναι αδέρφια", "Είναι αρραβωνιασμένοι", "Είναι εχθροί από παιδιά"], "Η Δάφνη ανταποκρίνεται στον Νίκο — ανεκπλήρωτος έρωτας."],
    ["Σε ποια λογοτεχνική γενιά ανήκει ο Παναγιωτόπουλος;", "Στη Γενιά του '30", ["Στη Γενιά του '80", "Στη Μεταπολεμική Γενιά", "Στην Επτανησιακή Σχολή"], "Πεζογράφος, ποιητής και δοκιμιογράφος της γενιάς."],
    ["Πόσα κεφάλαια έχει το μυθιστόρημα;", "Δεκατέσσερα", ["Επτά", "Τριάντα", "Τρία"], "Το απόσπασμα του 2026 ήταν από το Κεφάλαιο VII."],
    ["Πόσες μονάδες είχε η ερώτηση Β3 (λογοτεχνικό βιβλίο) το 2026;", "8", ["12", "10", "5"], "Συμπεριφορά 2, γνωρίσματα 2, επίδραση 2, τεκμηρίωση 2."],
    ["Πώς αντιδρά ο Άγγελος όταν διαβάζουν το ποίημά του;", "Πανικοβάλλεται, αρνείται ότι είναι δικό του και τελικά ξεσπά και φεύγει", ["Το διαβάζει περήφανα δυνατά", "Γελά με τις φίλες του", "Το χαρίζει στη Δάφνη"], "Ο οδηγός διόρθωσης δέχεται πανικό, νευρικότητα, ψέμα, θυμό, απελπισία."],
    ["Ποιο γνώρισμα ΔΕΝ ταιριάζει στον Άγγελο;", "Αλαζονικός και σίγουρος για τον εαυτό του", ["Ευαίσθητος", "Ονειροπόλος", "Ανασφαλής"], "Ο Άγγελος είναι ευάλωτος και διστακτικός."],
    ["Ποια ιστορική ματαίωση αποτυπώνεται στο φόντο του έργου;", "Η κατάρρευση της Μεγάλης Ιδέας με τη Μικρασιατική Καταστροφή", ["Η πτώση της χούντας", "Η ένωση των Επτανήσων", "Η ίδρυση του ΟΗΕ"], "Η ατομική και η συλλογική ματαίωση συμβαδίζουν."],
    ["Πώς απαντάμε σωστά στη Β3;", "Με βάση το δοσμένο απόσπασμα, με γνωρίσματα και τεκμηρίωση", ["Αφηγούμενοι όλη την υπόθεση του βιβλίου", "Με γενικά σχόλια χωρίς αναφορές", "Αντιγράφοντας όλο το απόσπασμα"], "Οι αναφορές πρέπει να είναι σύντομες και στοχευμένες."]
  ]
};
function nb2FromBank(sid) {
  const [q, a, wrong, s] = bkPick(NB2_BANK[sid]);
  const opts = shuffle([a, ...wrong]);
  return { level: 2, type: "mc", q: `<b>${NB2_WORKS[sid].au}, «${NB2_WORKS[sid].ti}»</b> — ${q}`, options: opts, correct: opts.indexOf(a), hint: "Θυμήσου το πλαίσιο, τη «φωνή» και τα βασικά σύμβολα του κειμένου.", sol: s };
}

var WIDGETS = Object.assign(window.WIDGETS || {}, Object.fromEntries(Object.keys(NB2_WORKS).map(sid => ["nb2w" + sid.replace(".", ""), box => nb2Study(box, sid)])));
var GENS = Object.assign(window.GENS || {}, Object.fromEntries(Object.keys(NB2_WORKS).map(sid => ["nb2g" + sid.replace(".", ""), { title: "Νέα ερώτηση για το κείμενο", make: () => Math.random() < 0.65 ? nb2FromBank(sid) : nb2Which(sid) }])));

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

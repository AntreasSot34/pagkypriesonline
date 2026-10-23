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

/* figures (preloaded before data) for part IAa — Γ1.1 Δυαδικό σύστημα (prefix ia1) */
/* δυαδικός ακέραιος με w ψηφία */
const ia1Bin = (n, w = 0) => { let s = Math.abs(n).toString(2); while (s.length < w) s = "0" + s; return s; };
/* αποδεκτές μορφές μιας δυαδικής απάντησης: με . ή , και με/χωρίς αρχικά μηδενικά */
function ia1A(s, keepZeros) {
  s = String(s); const out = new Set([s, s.replace(".", ",")]);
  if (!keepZeros) { let t = s.replace(/^(-?)0+(?=[01])/, "$1"); out.add(t); out.add(t.replace(".", ","));
    const ip = t.split(".")[0]; if (/^[01]+$/.test(ip) && ip.length < 8) { const p8 = ip.padStart(8, "0") + t.slice(ip.length); out.add(p8); out.add(p8.replace(".", ",")); } }
  return [...out];
}
/* δεκαδικό κλάσμα num/den (den δύναμη του 10) ως συμβολοσειρά με τελεία */
function ia1Dec(num, den) {
  const ip = Math.floor(num / den), fp = num - ip * den; if (!fp) return String(ip);
  let f = String(fp); const d = String(den).length - 1; while (f.length < d) f = "0" + f; return ip + "." + f.replace(/0+$/, "");
}
/* πίνακας διαδοχικών διαιρέσεων με το 2: [[n, πηλίκο, υπόλοιπο], …] */
function ia1DivRows(n) { const r = []; do { r.push([n, Math.floor(n / 2), n % 2]); n = Math.floor(n / 2); } while (n > 0); return r; }
/* διαδοχικοί πολλαπλασιασμοί του κλασματικού μέρους (string "0.45") επί 2, k φορές ή μέχρι μηδέν: [[αριθμός, γινόμενο, bit], …] */
function ia1MulRows(fracStr, k) {
  const d = (fracStr.split(".")[1] || "").length, den = 10 ** d; let num = Math.round(parseFloat(fracStr) * den) % den; const r = [];
  for (let i = 0; i < k && num; i++) { const p = 2 * num, b = p >= den ? 1 : 0; r.push([ia1Dec(num, den).replace(/^0(?=\.)/, "0"), ia1Dec(p, den), b]); num = p - b * den; }
  return r;
}
/* HTML πίνακας (class tbl) */
const ia1Tbl = (head, rows, cls = "") => `<table class="tbl ${cls}"><tr>${head.map(x => `<th>${x}</th>`).join("")}</tr>${rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join("")}</tr>`).join("")}</table>`;
const ia1DivTbl = n => ia1Tbl(["Αριθμός", "Πηλίκο", "Υπόλοιπο"], ia1DivRows(n).map(([a, q, r]) => [`${a}/2 =`, q, `<b>${r}</b>`]));
const ia1MulTbl = (f, k) => ia1Tbl(["Αριθμός", "Γινόμενο", "Bit"], ia1MulRows(f, k).map(([a, p, b]) => [`${a} × 2 =`, p, `<b>${b}</b>`]));
/* κάθετη πράξη (πρόσθεση/αφαίρεση) σε σταθερό πλάτος: lines = ["01010100", "+ 10111101", "=", "1 00010001"] */
function ia1Col(lines, note) {
  const w = Math.max(...lines.filter(l => l !== "=").map(l => l.length));
  const body = lines.map(l => l === "=" ? `<span style="display:block;border-top:2px solid #9fb3d9;margin:2px 0 2px auto;width:${w}ch"></span>` : `<span style="display:block">${l.replace(/ /g, "&nbsp;")}</span>`).join("");
  return `<div class="ia1col" style="display:inline-block;vertical-align:top;margin:6px 14px 6px 0;padding:10px 16px;border-radius:10px;background:#0f1a2e;color:#e6edf7;font:15px/1.5 'SF Mono',Consolas,Menlo,monospace;text-align:right;letter-spacing:.06em">${body}${note ? `<span style="display:block;font:600 11.5px var(--sans);color:#9fb3d9;text-align:center;margin-top:4px;letter-spacing:0">${note}</span>` : ""}</div>`;
}
/* σειρά bits με βάρη θέσεων (στατικό σχήμα) */
function ia1BitsFig(bits, caption) {
  const [ip, fp = ""] = bits.split("."), cells = [];
  [...ip].forEach((b, i) => cells.push([b, ip.length - 1 - i])); if (fp) cells.push([".", null]); [...fp].forEach((b, i) => cells.push([b, -(i + 1)]));
  const td = cells.map(([b, e]) => e === null ? `<td style="border:0;font-weight:900;font-size:20px;padding:0 2px">.</td>` : `<td style="padding:6px 8px;text-align:center;min-width:34px;${b === "1" ? "background:#e6f0fb;color:#0F6FD1;font-weight:800" : "color:#8a97ad"}"><div style="font:700 18px 'SF Mono',Consolas,monospace">${b}</div><div style="font-size:11.5px;color:#5b6b86">2<sup>${e}</sup></div><div style="font-size:11px;color:#C77A0A;font-weight:700">${e >= 0 ? 2 ** e : "1/" + 2 ** -e}</div></td>`).join("");
  return `<figure class="grfig" style="overflow-x:auto"><table class="tbl" style="margin:auto"><tr>${td}</tr></table>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
}

/* ================= Γ2.1 Άλγεβρα Boole — βιβλιοθήκη (προφορτώνεται πριν από τα δεδομένα) =================
   ia2Parse("A + B'C")        → AST {t:"v",n} | {t:"c",v} | {t:"not",a} | {t:"and"|"or"|"xor",xs:[…]}
       σύνταξη: μεταβλητές = ένα γράμμα (A–Z, a–z), σταθερές 0/1, άρνηση με ' (ή ’ ´) μετά ή ! ~ πριν,
       AND με * · & ή απλή παράθεση (AB), OR με + |, XOR με ⊕ ^ , παρενθέσεις ( ) [ ].
       Προτεραιότητα: παρενθέσεις, αντιστροφή, γινόμενο, (XOR), άθροισμα — όπως στο βιβλίο.
   ia2Eval(ast, env)           → 0/1          ia2Vars(ast) → ["A","B",…] (αλφαβητικά)
   ia2TT(expr|ast, vars)       → [f(m0), f(m1), …] (m: πρώτη μεταβλητή = πιο σημαντικό bit)
   ia2Bits(expr, vars)         → "01110111"   ia2Sigma(expr, vars) → [1,4,5,…]
   ia2Str(ast) / ia2Tex(ast)   → κείμενο βιβλίου (A'B + C) / TeX
   ia2Gate(type, {w,h,n,label}) → SVG πύλης (AND, OR, NOT, NAND, NOR, XOR, XNOR, BUF)
   ia2Circuit(expr, {vals, w, title, out:"F", compact:true}) → SVG λογικού κυκλώματος (αυτόματη διάταξη)
   ia2KMap(vars, ones, {groups:[cube…], showM, cells:"m"|"bits", title, size}) → SVG χάρτη Karnaugh (διάταξη βιβλίου)
   ia2Min(nv, ones, dc)        → { covers:[[cube…]…], primes:[cube…] } ελάχιστες καλύψεις (cube = "1-0" κ.λπ.)
   ia2CubeStr(cube, vars)      → "AB'"         ia2SOP(cover, vars) → "AB' + C"
   ia2TTable(vars, cols, {hl, names}) → HTML πίνακας αλήθειας (cols: [[όνομα, [bits…]], …])                */
const IA2C = { blue: "#0F6FD1", purple: "#6F42C1", amber: "#C77A0A", green: "#198754", red: "#DC3545", ink: "#15233f", muted: "#94a3b8", line: "#334155" };

function ia2Parse(src) {
  const s = String(src).replace(/[’´‘`]/g, "'").replace(/·|•|&&?/g, "*").replace(/\|\|?/g, "+").replace(/\^|⊕/g, "#").replace(/\[/g, "(").replace(/\]/g, ")").replace(/[~¬]/g, "!");
  let i = 0;
  const peek = () => { while (s[i] === " ") i++; return s[i]; };
  const err = m => { throw new Error(m); };
  function orE() { const xs = [xorE()]; while (peek() === "+") { i++; xs.push(xorE()); } return xs.length > 1 ? { t: "or", xs } : xs[0]; }
  function xorE() { const xs = [andE()]; while (peek() === "#") { i++; xs.push(andE()); } return xs.length > 1 ? { t: "xor", xs } : xs[0]; }
  function andE() {
    const xs = [unE()];
    for (;;) { const c = peek(); if (c === "*") { i++; xs.push(unE()); } else if (c && /[A-Za-z01(!]/.test(c)) xs.push(unE()); else break; }
    return xs.length > 1 ? { t: "and", xs } : xs[0];
  }
  function unE() {
    const c = peek(); let a;
    if (c === "!") { i++; return { t: "not", a: unE() }; }
    if (c === "(") { i++; a = orE(); if (peek() !== ")") err("λείπει «)»"); i++; }
    else if (c && /[A-Za-z]/.test(c)) { a = { t: "v", n: c }; i++; }
    else if (c === "0" || c === "1") { a = { t: "c", v: +c }; i++; }
    else err(c ? "μη αναμενόμενο «" + c + "»" : "ελλιπής έκφραση");
    while (peek() === "'") { i++; a = { t: "not", a }; }
    return a;
  }
  const r = orE(); if (peek() !== undefined) err("μη αναμενόμενο «" + s[i] + "»"); return r;
}
const ia2A = e => typeof e === "string" ? ia2Parse(e) : e;
function ia2Eval(a, env) {
  switch (a.t) {
    case "v": return env[a.n] ? 1 : 0; case "c": return a.v;
    case "not": return 1 - ia2Eval(a.a, env);
    case "and": return a.xs.every(x => ia2Eval(x, env)) ? 1 : 0;
    case "or": return a.xs.some(x => ia2Eval(x, env)) ? 1 : 0;
    case "xor": return a.xs.reduce((p, x) => p ^ ia2Eval(x, env), 0);
  }
}
function ia2Vars(a) { const S = new Set(); (function w(n) { if (n.t === "v") S.add(n.n); else if (n.a) w(n.a); else if (n.xs) n.xs.forEach(w); })(ia2A(a)); return [...S].sort(); }
function ia2TT(e, vars) { const a = ia2A(e); vars = vars || ia2Vars(a); const n = vars.length, r = [];
  for (let m = 0; m < 1 << n; m++) { const env = {}; vars.forEach((v, k) => env[v] = (m >> (n - 1 - k)) & 1); r.push(ia2Eval(a, env)); } return r; }
const ia2Bits = (e, vars) => ia2TT(e, vars).join("");
const ia2Sigma = (e, vars) => ia2TT(e, vars).map((b, m) => b ? m : -1).filter(m => m >= 0);
const ia2Pi = (e, vars) => ia2TT(e, vars).map((b, m) => b ? -1 : m).filter(m => m >= 0);
const ia2Equiv = (e1, e2, vars) => { vars = vars || [...new Set([...ia2Vars(e1), ...ia2Vars(e2)])].sort(); return ia2Bits(e1, vars) === ia2Bits(e2, vars); };
function ia2Str(a, top = true) {
  a = ia2A(a);
  const P = (x, need) => need ? "(" + ia2Str(x, false) + ")" : ia2Str(x, false);
  switch (a.t) {
    case "v": return a.n; case "c": return String(a.v);
    case "not": return a.a.t === "v" || a.a.t === "c" ? ia2Str(a.a) + "'" : "(" + ia2Str(a.a) + ")'";
    case "and": return a.xs.map(x => P(x, x.t === "or" || x.t === "xor")).join("");
    case "xor": return a.xs.map(x => P(x, x.t === "or" || x.t === "and")).join(" ⊕ ");
    case "or": return a.xs.map(x => P(x, x.t === "xor")).join(" + ");
  }
}
function ia2Tex(a) {
  a = ia2A(a);
  const P = (x, need) => need ? "(" + ia2Tex(x) + ")" : ia2Tex(x);
  switch (a.t) {
    case "v": return a.n; case "c": return String(a.v);
    case "not": return a.a.t === "v" || a.a.t === "c" ? ia2Tex(a.a) + "'" : "(" + ia2Tex(a.a) + ")'";
    case "and": return a.xs.map(x => P(x, x.t === "or" || x.t === "xor")).join("");
    case "xor": return a.xs.map(x => P(x, x.t === "or" || x.t === "and")).join(" \\oplus ");
    case "or": return a.xs.map(x => P(x, x.t === "xor")).join(" + ");
  }
}
/* ---------- πύλες ---------- */
const ia2r = v => Math.round(v * 10) / 10;
/* σχήμα σώματος πύλης με αριστερή άκρη x, πάνω y, πλάτος w, ύψος h · επιστρέφει {d, inset(yrel), out:[x,y]} */
function ia2Body(type, x, y, w, h) {
  const T = type.replace(/^N(AND|OR)$/, "$1").replace("XNOR", "XOR").replace("BUF", "NOT");
  const bub = /^N(AND|OR)$|XNOR|^NOT$/.test(type);
  let d, extra = "", inset = () => 0, bw = w - (bub ? 8 : 0);
  if (T === "AND") d = `M${x},${y}H${ia2r(x + bw - h / 2)}A${h / 2},${h / 2} 0 0 1 ${ia2r(x + bw - h / 2)},${y + h}H${x}Z`;
  else if (T === "OR" || T === "XOR") {
    const ox = T === "XOR" ? x + 7 : x, ww = bw - (T === "XOR" ? 7 : 0);
    d = `M${ox},${y}Q${ia2r(ox + ww * 0.55)},${y} ${ox + ww},${ia2r(y + h / 2)}Q${ia2r(ox + ww * 0.55)},${y + h} ${ox},${y + h}Q${ia2r(ox + ww * 0.28)},${ia2r(y + h / 2)} ${ox},${y}Z`;
    inset = yy => { const t = (yy - y) / h; return (ox - x) + 2 * t * (1 - t) * ww * 0.28; };
    if (T === "XOR") extra = `M${x},${y}Q${ia2r(x + ww * 0.28)},${ia2r(y + h / 2)} ${x},${y + h}`;
  } else d = `M${x},${y}L${x + bw},${ia2r(y + h / 2)}L${x},${y + h}Z`;
  return { d, extra, inset, bub, out: [x + w, y + h / 2], bx: x + bw };
}
function ia2GateSVGParts(type, x, y, w, h, fill, stroke) {
  const b = ia2Body(type, x, y, w, h);
  let s = `<path d="${b.d}" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`;
  if (b.extra) s += `<path d="${b.extra}" fill="none" stroke="${stroke}" stroke-width="2"/>`;
  if (b.bub) s += `<circle cx="${ia2r(b.bx + 4)}" cy="${ia2r(y + h / 2)}" r="4" fill="#fff" stroke="${stroke}" stroke-width="2"/>`;
  return { s, b };
}
function ia2Gate(type, o = {}) {
  const W = o.w || 150, H = o.h || 70, n = type === "NOT" || type === "BUF" ? 1 : (o.n || 2), gw = 56, gh = n === 1 ? 32 : Math.max(44, n * 20), gx = (W - gw) / 2, gy = (H - gh) / 2;
  const { s, b } = ia2GateSVGParts(type, gx, gy, gw, gh, o.fill || "#eef4fd", o.stroke || IA2C.blue);
  let w = "";
  for (let k = 0; k < n; k++) { const yy = n === 1 ? gy + gh / 2 : gy + gh * (k + 1) / (n + 1);
    w += `<line x1="20" y1="${ia2r(yy)}" x2="${ia2r(gx + b.inset(yy) + 1)}" y2="${ia2r(yy)}" stroke="${IA2C.ink}" stroke-width="2"/>`;
    if (o.labels !== false) w += `<text x="5" y="${ia2r(yy + 4)}" font-size="12" font-weight="700" fill="${IA2C.ink}">${"ABCD"[k]}</text>`; }
  w += `<line x1="${ia2r(b.out[0])}" y1="${ia2r(b.out[1])}" x2="${W - 20}" y2="${ia2r(b.out[1])}" stroke="${IA2C.ink}" stroke-width="2"/><text x="${W - 5}" y="${ia2r(b.out[1] + 4)}" text-anchor="end" font-size="12" font-weight="700" fill="${IA2C.ink}">Y</text>`;
  return `<svg class="ia2gate" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Πύλη ${type}">${w}${s}${o.label ? `<text x="${W / 2}" y="${H - 2}" text-anchor="middle" font-size="11" font-weight="800" fill="${IA2C.muted}">${o.label}</text>` : ""}</svg>`;
}
/* ---------- αυτόματη σχεδίαση κυκλώματος ---------- */
function ia2Circuit(e, o = {}) {
  const ast = ia2A(e), vars = o.vars || ia2Vars(ast), vals = o.vals || null, compact = o.compact !== false;
  /* δέντρο πυλών */
  function build(a) {
    if (a.t === "v") return { leaf: true, v: a.n };
    if (a.t === "c") return { leaf: true, c: a.v };
    if (a.t === "not") {
      if (compact && (a.a.t === "and" || a.a.t === "or" || a.a.t === "xor")) { const g = build(a.a); g.type = { and: "NAND", or: "NOR", xor: "XNOR" }[a.a.t]; return g; }
      return { type: "NOT", kids: [build(a.a)] };
    }
    return { type: { and: "AND", or: "OR", xor: "XOR" }[a.t], kids: a.xs.map(build) };
  }
  let root = build(ast); if (root.leaf) root = { type: "BUF", kids: [root] };
  const val = n => n.leaf ? (n.c !== undefined ? n.c : vals ? vals[n.v] : null) : n.val;
  (function ev(n) { if (n.leaf) return; n.kids.forEach(ev); if (!vals) return; const k = n.kids.map(val);
    const T = n.type; let v = T === "AND" || T === "NAND" ? +k.every(x => x) : T === "OR" || T === "NOR" ? +k.some(x => x) : T === "XOR" || T === "XNOR" ? k.reduce((p, x) => p ^ x, 0) : k[0];
    if (/^N|XNOR/.test(T) && T !== "NOT") v = 1 - v; if (T === "NOT") v = 1 - k[0]; n.val = v; })(root);
  /* ύψη (στήλες) και γραμμές */
  (function H(n) { if (n.leaf) return n.h = 0; n.h = 1 + Math.max(...n.kids.map(H)); return n.h; })(root);
  const RH = o.rh || 26, colW = o.colw || 92, gw = 50, busGap = vals ? 38 : 30, x0 = 34;
  const busX = vars.map((v, k) => x0 + 18 + k * busGap), xStart = busX[busX.length - 1] + 24 || 70;
  let row = 0;
  (function lay(n) { if (n.leaf) { n.y = (row++ + 0.5) * RH; return; } n.kids.forEach(lay); const ys = n.kids.map(k => k.y); n.y = (Math.min(...ys) + Math.max(...ys)) / 2; })(root);
  const top = 30, totalH = Math.max(row * RH, 60);
  const W = xStart + root.h * colW + 60, Hh = totalH + top + 16;
  const Y = y => ia2r(y + top);
  const on = v => v === 1, cOn = IA2C.green, cOff = vals ? "#9aa7bb" : IA2C.ink;
  const wcol = v => vals ? (on(v) ? cOn : cOff) : IA2C.ink, ww = v => vals && on(v) ? 3 : 2;
  let wires = "", gates = "", dots = "";
  /* είσοδοι: ετικέτες + κάθετοι δίαυλοι */
  let inputs = "";
  vars.forEach((v, k) => {
    const vv = vals ? vals[v] : null, x = busX[k], yl = 12 + k * 0;
    inputs += `<g class="ia2in" data-var="${v}" style="cursor:${o.click ? "pointer" : "default"}"><rect x="${x - (vals ? 17 : 12)}" y="2" width="${vals ? 34 : 24}" height="22" rx="6" fill="${vals ? (on(vv) ? "#e3f6ea" : "#f1f4f9") : "#eef4fd"}" stroke="${vals ? (on(vv) ? cOn : "#9aa7bb") : IA2C.blue}" stroke-width="1.6"/><text x="${x}" y="17" text-anchor="middle" font-size="13" font-weight="800" fill="${IA2C.ink}">${v}${vals ? "=" + vv : ""}</text></g>`;
    wires += `<line x1="${x}" y1="24" x2="${x}" y2="${Y(totalH)}" stroke="${wcol(vv)}" stroke-width="${ww(vv)}"/>`;
    if (vals) inputs = inputs.replace(`>${v}=${vv}<`, ` font-size="12">${v}=${vv}<`);
  });
  /* πύλες */
  const gx = n => xStart + (n.h - 1) * colW + 26;
  (function draw(n) {
    if (n.leaf) return;
    n.kids.forEach(draw);
    const nk = n.kids.length, gh = n.type === "NOT" || n.type === "BUF" ? 22 : Math.max(30, nk * RH - 6), x = gx(n), y = n.y + top - gh / 2;
    const { s, b } = ia2GateSVGParts(n.type, x, y, gw, gh, vals ? (on(n.val) ? "#e3f6ea" : "#f6f8fb") : "#eef4fd", vals ? (on(n.val) ? cOn : "#64748b") : IA2C.blue);
    gates += s;
    n.out = [b.out[0], b.out[1]];
    n.kids.forEach((k, j) => {
      const py = n.y + top + (j - (nk - 1) / 2) * RH, px = x + b.inset(py) + 1, v = val(k);
      if (k.leaf) {
        if (k.c !== undefined) { wires += `<line x1="${px - 22}" y1="${ia2r(py)}" x2="${ia2r(px)}" y2="${ia2r(py)}" stroke="${wcol(v)}" stroke-width="${ww(v)}"/><text x="${px - 26}" y="${ia2r(py + 4)}" text-anchor="end" font-size="12" font-weight="800" fill="${IA2C.ink}">${k.c}</text>`; return; }
        const bx = busX[vars.indexOf(k.v)], ky = k.y + top;
        wires += `<polyline points="${bx},${ia2r(ky)} ${ia2r(px - 12)},${ia2r(ky)} ${ia2r(px - 12)},${ia2r(py)} ${ia2r(px)},${ia2r(py)}" fill="none" stroke="${wcol(v)}" stroke-width="${ww(v)}"/>`;
        dots += `<circle cx="${bx}" cy="${ia2r(ky)}" r="3.4" fill="${wcol(v)}"/>`;
      } else {
        const mx = (k.out[0] + px) / 2 + (j - (nk - 1) / 2) * 4;
        wires += `<polyline points="${ia2r(k.out[0])},${ia2r(k.out[1])} ${ia2r(mx)},${ia2r(k.out[1])} ${ia2r(mx)},${ia2r(py)} ${ia2r(px)},${ia2r(py)}" fill="none" stroke="${wcol(v)}" stroke-width="${ww(v)}"/>`;
      }
    });
  })(root);
  const ox = W - 44, oy = root.out[1];
  wires += `<line x1="${ia2r(root.out[0])}" y1="${ia2r(oy)}" x2="${ox}" y2="${ia2r(oy)}" stroke="${wcol(root.val)}" stroke-width="${ww(root.val)}"/>`;
  const outName = o.out || "F";
  const outBox = `<rect x="${ox}" y="${ia2r(oy - 12)}" width="38" height="24" rx="6" fill="${vals ? (on(root.val) ? IA2C.green : "#f1f4f9") : "#fff3df"}" stroke="${vals ? (on(root.val) ? IA2C.green : "#9aa7bb") : IA2C.amber}" stroke-width="1.6"/><text x="${ox + 19}" y="${ia2r(oy + 4.5)}" text-anchor="middle" font-size="${vals ? 11.5 : 13}" font-weight="800" fill="${vals && on(root.val) ? "#fff" : IA2C.ink}">${outName}${vals ? "=" + root.val : ""}</text>`;
  const sw = o.w || W;
  return `<svg class="ia2circ" viewBox="0 0 ${ia2r(W)} ${ia2r(Hh)}" width="${ia2r(o.scale ? W * o.scale : Math.min(sw, W))}" style="max-width:100%;height:auto" role="img" aria-label="Λογικό κύκλωμα ${outName} = ${ia2Str(ast)}">${wires}${dots}${gates}${inputs}${outBox}</svg>`;
}
function ia2Fig(svg, cap) { const m = /width="([\d.]+)"/.exec(svg); return `<figure class="grfig"${m ? ` style="max-width:${Math.ceil(+m[1] * 1.12)}px"` : ""}>${svg}${cap ? `<figcaption>${cap}</figcaption>` : ""}</figure>`; }
/* ---------- χάρτης Karnaugh (διάταξη βιβλίου) ---------- */
const IA2GRAY = [0, 1, 3, 2];
function ia2KLayout(nv) {
  /* επιστρέφει {R, C, m(r,c), rowBits, colBits, rv, cv} */
  if (nv === 2) return { R: 2, C: 2, m: (r, c) => r * 2 + c, rl: ["0", "1"], cl: ["0", "1"], rv: 1, cv: 1, rowOf: m => m >> 1, colOf: m => m & 1 };
  if (nv === 3) return { R: 2, C: 4, m: (r, c) => r * 4 + IA2GRAY[c], rl: ["0", "1"], cl: ["00", "01", "11", "10"], rv: 1, cv: 2, rowOf: m => m >> 2, colOf: m => IA2GRAY.indexOf(m & 3) };
  return { R: 4, C: 4, m: (r, c) => IA2GRAY[r] * 4 + IA2GRAY[c], rl: ["00", "01", "11", "10"], cl: ["00", "01", "11", "10"], rv: 2, cv: 2, rowOf: m => IA2GRAY.indexOf(m >> 2), colOf: m => IA2GRAY.indexOf(m & 3) };
}
const ia2CubeHas = (cube, m) => { const n = cube.length; for (let k = 0; k < n; k++) { const b = (m >> (n - 1 - k)) & 1; if (cube[k] !== "-" && +cube[k] !== b) return false; } return true; };
const ia2CubeMs = cube => { const n = cube.length, r = []; for (let m = 0; m < 1 << n; m++) if (ia2CubeHas(cube, m)) r.push(m); return r; };
const IA2GCOL = ["#C77A0A", "#DC3545", "#0F6FD1", "#198754", "#6F42C1", "#0e9aa7", "#b5179e", "#5c6f00"];
function ia2KMap(vars, ones, o = {}) {
  const nv = vars.length, L = ia2KLayout(nv), cs = o.size || 50, ox = 62, oy = 54;
  const W = ox + L.C * cs + 14, H = oy + L.R * cs + (o.title ? 30 : 12);
  const one = new Set(ones), dc = new Set(o.dc || []);
  const rName = vars.slice(0, L.rv).join(""), cName = vars.slice(L.rv).join("");
  let s = `<line x1="${ox - 40}" y1="${oy - 40}" x2="${ox}" y2="${oy}" stroke="#64748b" stroke-width="1.6"/>`;
  s += `<text x="${ox - 30}" y="${oy - 8}" text-anchor="middle" font-size="14" font-weight="800" fill="${IA2C.ink}">${rName}</text><text x="${ox - 6}" y="${oy - 36}" font-size="14" font-weight="800" fill="${IA2C.ink}">${cName}</text>`;
  for (let c = 0; c < L.C; c++) s += `<text x="${ox + c * cs + cs / 2}" y="${oy - 10}" text-anchor="middle" font-size="13" font-weight="700" fill="${IA2C.blue}">${L.cl[c]}</text>`;
  for (let r = 0; r < L.R; r++) s += `<text x="${ox - 10}" y="${oy + r * cs + cs / 2 + 5}" text-anchor="end" font-size="13" font-weight="700" fill="${IA2C.blue}">${L.rl[r]}</text>`;
  for (let r = 0; r < L.R; r++) for (let c = 0; c < L.C; c++) {
    const m = L.m(r, c), v = one.has(m) ? "1" : dc.has(m) ? "X" : "0", hl = o.hl && o.hl.includes(m);
    s += `<g class="kc" data-m="${m}"><rect x="${ox + c * cs}" y="${oy + r * cs}" width="${cs}" height="${cs}" fill="${hl ? "#fff3df" : v === "1" ? "#eef6ff" : "#fff"}" stroke="#94a3b8" stroke-width="1.2"/>`;
    if (o.cells === "m" || o.cells === "bits") s += `<text x="${ox + c * cs + cs / 2}" y="${oy + r * cs + cs / 2 + 5}" text-anchor="middle" font-size="${o.cells === "bits" ? 12 : 14}" font-weight="700" fill="${IA2C.ink}">${o.cells === "m" ? "m" + `<tspan font-size="10" dy="3">${m}</tspan>` : m.toString(2).padStart(nv, "0")}</text>`;
    else { s += `<text x="${ox + c * cs + cs / 2}" y="${oy + r * cs + cs / 2 + 6}" text-anchor="middle" font-size="17" font-weight="800" fill="${v === "1" ? IA2C.ink : "#a3b0c4"}">${v}</text>`;
      if (o.showM) s += `<text x="${ox + c * cs + cs - 4}" y="${oy + r * cs + 11}" text-anchor="end" font-size="9" fill="${IA2C.muted}">${m}</text>`; }
    s += `</g>`;
  }
  /* ομάδες */
  const cid = "ia2k" + Math.random().toString(36).slice(2, 8);
  s += `<defs><clipPath id="${cid}"><rect x="${ox}" y="${oy}" width="${L.C * cs}" height="${L.R * cs}"/></clipPath></defs>`;
  (o.groups || []).forEach((cube, gi) => {
    const ms = ia2CubeMs(cube), rows = [...new Set(ms.map(L.rowOf))].sort((a, b) => a - b), cols = [...new Set(ms.map(L.colOf))].sort((a, b) => a - b);
    const seg = (arr, N) => { if (arr.length === N) return [[0, N - 1]]; const segs = []; let st = arr[0], pv = arr[0];
      for (let k = 1; k <= arr.length; k++) { if (k < arr.length && arr[k] === pv + 1) { pv = arr[k]; continue; } segs.push([st, pv]); if (k < arr.length) { st = pv = arr[k]; } } return segs; };
    const col = IA2GCOL[gi % IA2GCOL.length], pad = 5 + (gi % 3) * 3;
    const rs = seg(rows, L.R), csg = seg(cols, L.C);
    const ext = cs * 0.75;
    rs.forEach(([r0, r1]) => csg.forEach(([c0, c1]) => {
      /* τμήμα ομάδας που «τυλίγεται»: η πλευρά προς το άκρο του χάρτη μένει ανοιχτή (επεκτείνεται έξω και κόβεται) */
      const oL = csg.length > 1 && c0 === 0, oR = csg.length > 1 && c1 === L.C - 1, oT = rs.length > 1 && r0 === 0, oB = rs.length > 1 && r1 === L.R - 1;
      let x = ox + c0 * cs + pad, y = oy + r0 * cs + pad, w = (c1 - c0 + 1) * cs - 2 * pad, h = (r1 - r0 + 1) * cs - 2 * pad;
      if (oL) { x -= ext; w += ext; } if (oR) w += ext; if (oT) { y -= ext; h += ext; } if (oB) h += ext;
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${cs / 2 - pad}" fill="${col}" fill-opacity=".10" stroke="${col}" stroke-width="2.6"${oL || oR || oT || oB ? ` clip-path="url(#${cid})"` : ""}/>`;
    }));
  });
  if (o.title) s += `<text x="${W / 2}" y="${H - 8}" text-anchor="middle" font-size="12.5" font-weight="700" fill="${IA2C.muted}">${o.title}</text>`;
  return `<svg class="ia2kmap" viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%;height:auto" role="img" aria-label="Χάρτης Karnaugh">${s}</svg>`;
}
/* ---------- ελαχιστοποίηση (πρώτοι όροι + ελάχιστες καλύψεις) ---------- */
function ia2Min(nv, ones, dc = []) {
  const ON = new Set(ones), OK = new Set([...ones, ...dc]);
  if (!ones.length) return { primes: [], covers: [[]] };
  const cubes = []; const rec = (p) => { if (p.length === nv) { cubes.push(p); return; } for (const ch of "01-") rec(p + ch); }; rec("");
  const valid = cubes.filter(c => ia2CubeMs(c).every(m => OK.has(m)) && ia2CubeMs(c).some(m => ON.has(m)));
  const contains = (a, b) => { for (let k = 0; k < nv; k++) if (a[k] !== "-" && a[k] !== b[k]) return false; return a !== b; };
  const primes = valid.filter(c => !valid.some(d => contains(d, c)));
  const lits = c => c.replace(/-/g, "").length;
  let best = null, covers = [];
  const P = primes.length;
  for (let mask = 1; mask < 1 << P; mask++) {
    const sel = primes.filter((_, k) => mask >> k & 1);
    const cov = new Set(sel.flatMap(ia2CubeMs)); if (!ones.every(m => cov.has(m))) continue;
    const cost = [sel.length, sel.reduce((a, c) => a + lits(c), 0)];
    if (!best || cost[0] < best[0] || (cost[0] === best[0] && cost[1] < best[1])) { best = cost; covers = [sel]; }
    else if (cost[0] === best[0] && cost[1] === best[1]) covers.push(sel);
  }
  const key = c => { const pos = [...c].map((ch, k) => ch === "-" ? -1 : k).filter(k => k >= 0); return [pos[0] ?? 9, pos.length, ...pos, ...[...c].map(ch => ch === "0" ? 0 : ch === "1" ? 1 : 2)]; };
  const cmp = (a, b) => { const A = key(a), B = key(b); for (let k = 0; k < Math.max(A.length, B.length); k++) { if ((A[k] ?? -1) !== (B[k] ?? -1)) return (A[k] ?? -1) - (B[k] ?? -1); } return 0; };
  covers = covers.map(cv => cv.slice().sort(cmp));
  return { primes, covers };
}
function ia2CubeStr(cube, vars) { let s = ""; for (let k = 0; k < cube.length; k++) if (cube[k] !== "-") s += vars[k] + (cube[k] === "0" ? "'" : ""); return s || "1"; }
function ia2SOP(cover, vars) { return cover.length ? cover.map(c => ia2CubeStr(c, vars)).join(" + ") : "0"; }
function ia2SOPTex(cover, vars) { return ia2SOP(cover, vars); }
/* ---------- πίνακας αλήθειας ---------- */
function ia2TTable(vars, cols, o = {}) {
  const n = vars.length;
  let h = `<table class="tbl ia2tt"><tr>${vars.map(v => `<th>${v}</th>`).join("")}${cols.map(c => `<th class="ia2o">${c[0]}</th>`).join("")}${o.m ? "<th>m</th>" : ""}</tr>`;
  for (let m = 0; m < 1 << n; m++) {
    const hl = o.hl === m || (Array.isArray(o.hl) && o.hl.includes(m));
    h += `<tr${hl ? ' class="ia2hl"' : ""}>${vars.map((v, k) => `<td>${(m >> (n - 1 - k)) & 1}</td>`).join("")}${cols.map(c => `<td class="ia2o${c[1][m] ? " ia2one" : ""}">${c[1][m]}</td>`).join("")}${o.m ? `<td class="muted">m${m}</td>` : ""}</tr>`;
  }
  return h + "</table>";
}
/* δυϊκή έκφραση (εναλλαγή + ↔ *, 0 ↔ 1) — για XOR δεν ορίζεται εδώ (επιστρέφει null) */
function ia2Dual(a) { a = ia2A(a);
  switch (a.t) { case "v": return a; case "c": return { t: "c", v: 1 - a.v }; case "not": { const d = ia2Dual(a.a); return d && { t: "not", a: d }; }
    case "and": case "or": { const xs = a.xs.map(ia2Dual); return xs.every(Boolean) ? { t: a.t === "and" ? "or" : "and", xs } : null; }
    default: return null; } }
/* έκφραση με αντικατάσταση τιμών (TeX), π.χ. 0 + 1\cdot 1 */
function ia2SubTex(a, env) { a = ia2A(a);
  const P = (x, need) => need ? "(" + ia2SubTex(x, env) + ")" : ia2SubTex(x, env);
  switch (a.t) { case "v": return String(env[a.n]); case "c": return String(a.v);
    case "not": return a.a.t === "v" || a.a.t === "c" ? ia2SubTex(a.a, env) + "'" : "(" + ia2SubTex(a.a, env) + ")'";
    case "and": return a.xs.map(x => P(x, x.t === "or" || x.t === "xor")).join(" \\cdot ");
    case "xor": return a.xs.map(x => P(x, x.t === "or" || x.t === "and")).join(" \\oplus ");
    case "or": return a.xs.map(x => P(x, x.t === "xor")).join(" + "); } }
/* τυχαία λογική έκφραση από πρότυπα (L = μεταβλητή ή άρνησή της) */
function ia2RandExpr(vars, rnd = Math.random) {
  const pick = a => a[Math.floor(rnd() * a.length)];
  const T = ["L L + L", "(L + L) L", "(L L)' + L", "L ⊕ L + L", "(L + L)' + L L", "L L + L L", "(L + L)(L + L)", "L(L + L)'", "(L ⊕ L) L", "L' + L L"];
  for (;;) {
    const t = pick(T); let used = [];
    const s = t.replace(/L/g, () => { let v = pick(vars); if (used.length < vars.length) { const free = vars.filter(x => !used.includes(x)); v = pick(free); } used.push(v); return v + (rnd() < 0.4 ? "'" : ""); }).replace(/''/g, "");
    const a = ia2Parse(s), b = ia2Bits(a, vars);
    const lit = x => x.t === "v" ? x.n : x.t === "not" && x.a.t === "v" ? x.a.n : null;
    let bad = false;
    (function w(n) { if (n.xs) { const ls = n.xs.map(lit).filter(Boolean); if (new Set(ls).size < ls.length) bad = true;
      if ((n.t === "and" || n.t === "xor") && n.xs.every(lit)) n.xs.sort((p, q) => lit(p) < lit(q) ? -1 : 1); n.xs.forEach(w); } else if (n.a) w(n.a); })(a);
    if (!bad && !/^0+$|^1+$/.test(b) && ia2Vars(a).length === vars.length) return ia2Str(a);
  }
}
if (typeof document !== "undefined" && !document.getElementById("ia2css")) {
  const st = document.createElement("style"); st.id = "ia2css";
  st.textContent = `.ia2tt td,.ia2tt th{text-align:center;min-width:30px}.ia2tt th.ia2o{background:#fff3df}.ia2tt td.ia2o{font-weight:800;color:#94a3b8}.ia2tt td.ia2one{color:#198754}
.ia2tt tr.ia2hl td{background:#e3f6ea}.ia2tt td.ia2click{cursor:pointer;user-select:none}.ia2tt td.ia2click:hover{outline:2px solid #0F6FD1;outline-offset:-2px}
.ia2gtab{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px;margin:10px 0}.ia2gtab>div{border:1px solid var(--line);border-radius:12px;background:#fff;padding:8px 10px}
.ia2gtab b{color:var(--navy)}.ia2gtab .ia2gate{display:block;margin:2px auto}.ia2gtab small{display:block;color:var(--muted)}
.ia2row{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start}.ia2row>*{min-width:0}
.ia2pill{display:inline-block;border-radius:99px;padding:2px 10px;font-weight:800;font-size:13px;margin:2px}
.ia2bit{font:700 15px "SF Mono",Consolas,monospace;width:34px;height:34px;border-radius:8px;border:1.6px solid #94a3b8;background:#f6f8fb;cursor:pointer}.ia2bit.on{background:#198754;border-color:#198754;color:#fff}
.ia2err{color:#DC3545;font-weight:700}.ia2ok{color:#198754;font-weight:800}.ia2scroll{overflow-x:auto;max-width:100%}
.ia2kc .kc{cursor:pointer}.ia2kc .kc:hover rect{stroke:#0F6FD1;stroke-width:2.4}`;
  document.head.appendChild(st);
}

/* figures (preloaded before data) for part IAc — Λογικά διαγράμματα (σύμβολα ANSI όπως στο Παράρτημα του βιβλίου)
   ia3Flow(seq, {caption, hl, w}) → <figure class="grfig"> με στατικό SVG λογικό διάγραμμα.
   Στοιχεία της ακολουθίας seq:
     {t:"term", s:"Αρχή"}            έλλειψη (Αρχή/Τέλος)
     {t:"proc", s:"S ← S + i"}       ορθογώνιο (επεξεργασία)
     {t:"io",   s:"Διάβασε N"}       παραλληλόγραμμο (είσοδος/έξοδος)
     {t:"if", c:"x > 0", yes:[…], no:[…]}        απόφαση: Α δεξιά, Ψ αριστερά, συγχώνευση από κάτω
     {t:"while", c:"i <= N", body:[…]}            έλεγχος στην αρχή (while / for): Α προς τα κάτω, Ψ έξοδος αριστερά
     {t:"do", c:"total < 600", body:[…]}          έλεγχος στο τέλος (do…while): Α επιστροφή αριστερά, Ψ προς τα κάτω
   Κάθε στοιχείο μπορεί να έχει id:"k" — το ia3Flow(…, {hl:"k"}) το τονίζει (χρήση από widgets). */
const IA3F = { cw: 7.6, fs: 13, nh: 34, dh: 46, gap: 20 };
const ia3FEsc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/←/g, '<tspan style="font-size:17px;font-weight:700;fill:#0F6FD1">←</tspan>');
const ia3FTW = s => [...String(s)].reduce((a, ch) => a + (/[\u0370-\u03ff]/.test(ch) ? 8.6 : IA3F.cw), 0);
function ia3FBlock(n) {
  const T = n.t;
  if (T === "term" || T === "proc" || T === "io") {
    const w = Math.max(T === "term" ? 74 : 96, ia3FTW(n.s) + (T === "io" ? 44 : T === "term" ? 34 : 26)), h = IA3F.nh;
    return { L: w / 2, R: w / 2, H: h, draw(cx, y, o) {
      const on = o.hl && n.id === o.hl, st = on ? 'fill="#e7f6ee" stroke="#198754" stroke-width="2.6"' : 'fill="#fff" stroke="#1B2A4A" stroke-width="1.6"';
      let shp;
      if (T === "term") shp = `<ellipse cx="${cx}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" ${st}/>`;
      else if (T === "proc") shp = `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${h}" rx="2" ${st}/>`;
      else { const k = 12; shp = `<path d="M${cx - w / 2 + k},${y}H${cx + w / 2}L${cx + w / 2 - k},${y + h}H${cx - w / 2}Z" ${st}/>`; }
      return shp + `<text x="${cx}" y="${y + h / 2 + 1}" class="ft${on ? " on" : ""}">${ia3FEsc(n.s)}</text>`;
    } };
  }
  const dw = Math.max(110, ia3FTW(n.c) * 1.12 + 60), dh = IA3F.dh;
  const diamond = (cx, y, o) => { const on = o.hl && n.id === o.hl, st = on ? 'fill="#fff6e6" stroke="#C77A0A" stroke-width="2.6"' : 'fill="#fff" stroke="#1B2A4A" stroke-width="1.6"';
    return `<path d="M${cx},${y}L${cx + dw / 2},${y + dh / 2}L${cx},${y + dh}L${cx - dw / 2},${y + dh / 2}Z" ${st}/><text x="${cx}" y="${y + dh / 2 + 1}" class="ft${on ? " on" : ""}">${ia3FEsc(n.c)}</text>`; };
  const ln = (pts, arrow) => `<path d="M${pts.map(p => p.join(",")).join("L")}" class="fl"${arrow ? ' marker-end="url(#ia3ah)"' : ""}/>`;
  const lab = (x, y, s, a = "middle") => `<text x="${x}" y="${y}" class="fa" text-anchor="${a}">${s}</text>`;
  if (T === "if") {
    const Y = ia3FSeq(n.yes || []), N = ia3FSeq(n.no || []);
    const xr = Math.max(dw / 2 + 4, Y.L + 14), xl = Math.max(dw / 2 + 4, N.R + 14), top = dh / 2;
    const bh = Math.max(Y.H, N.H), H = dh + 16 + bh + 18;
    return { L: Math.max(dw / 2, xl + N.L), R: Math.max(dw / 2, xr + Y.R), H, draw(cx, y, o) {
      let s = diamond(cx, y, o); const yb = y + dh + 16, ym = y + H - 4;
      s += ln([[cx + dw / 2, y + top], [cx + xr, y + top], [cx + xr, yb - (Y.H ? 0 : 0)]], !!Y.H) + lab(cx + dw / 2 + 6, y + top - 7, "Α", "start");
      s += ln([[cx - dw / 2, y + top], [cx - xl, y + top], [cx - xl, yb]], !!N.H) + lab(cx - dw / 2 - 6, y + top - 7, "Ψ", "end");
      if (Y.H) s += Y.draw(cx + xr, yb, o); if (N.H) s += N.draw(cx - xl, yb, o);
      s += ln([[cx + xr, yb + Y.H], [cx + xr, ym], [cx + 5, ym]], true) + ln([[cx - xl, yb + N.H], [cx - xl, ym], [cx - 5, ym]], true);
      s += `<circle cx="${cx}" cy="${ym}" r="3" fill="#1B2A4A"/>` + ln([[cx, ym], [cx, y + H]]);
      return s; } };
  }
  if (T === "while") {
    const B = ia3FSeq(n.body || []), xo = Math.max(dw / 2, B.R) + 18, xe = Math.max(dw / 2, B.L) + 18, t0 = 14;
    const H = t0 + dh + 20 + B.H + 14 + 16;
    return { L: xe, R: xo, H, draw(cx, y, o) {
      let s = ln([[cx, y], [cx, y + t0]], true) + diamond(cx, y + t0, o);
      const yb = y + t0 + dh + 20, ye = yb + B.H + 14;
      s += ln([[cx, y + t0 + dh], [cx, yb]], true) + lab(cx + 8, y + t0 + dh + 14, "Α", "start");
      s += B.draw(cx, yb, o);
      s += ln([[cx, yb + B.H], [cx, ye], [cx + xo, ye], [cx + xo, y + 6], [cx + 4, y + 6]], true);
      s += ln([[cx - dw / 2, y + t0 + dh / 2], [cx - xe, y + t0 + dh / 2], [cx - xe, y + H], [cx, y + H]]) + lab(cx - dw / 2 - 6, y + t0 + dh / 2 - 7, "Ψ", "end");
      return s; } };
  }
  if (T === "do") {
    const B = ia3FSeq(n.body || []), xl = Math.max(dw / 2, B.L) + 18, t0 = 14;
    const H = t0 + B.H + 18 + dh + 14;
    return { L: xl, R: Math.max(dw / 2, B.R), H, draw(cx, y, o) {
      let s = ln([[cx, y], [cx, y + t0]], true) + B.draw(cx, y + t0, o);
      const yd = y + t0 + B.H + 18;
      s += ln([[cx, y + t0 + B.H], [cx, yd]], true) + diamond(cx, yd, o);
      s += ln([[cx - dw / 2, yd + dh / 2], [cx - xl, yd + dh / 2], [cx - xl, y + 6], [cx - 4, y + 6]], true) + lab(cx - dw / 2 - 6, yd + dh / 2 - 7, "Α", "end");
      s += ln([[cx, yd + dh], [cx, y + H]]) + lab(cx + 8, yd + dh + 12, "Ψ", "start");
      return s; } };
  }
  throw new Error("ia3Flow: άγνωστο στοιχείο " + T);
}
function ia3FSeq(seq) {
  const bs = seq.map(ia3FBlock), g = IA3F.gap;
  if (!bs.length) return { L: 0, R: 0, H: 0, draw: () => "" };
  const H = bs.reduce((a, b) => a + b.H, 0) + g * (bs.length - 1);
  return { L: Math.max(...bs.map(b => b.L)), R: Math.max(...bs.map(b => b.R)), H, draw(cx, y, o) {
    let s = "", yy = y;
    bs.forEach((b, i) => { if (i) { s += `<path d="M${cx},${yy - g}L${cx},${yy}" class="fl" marker-end="url(#ia3ah)"/>`; } s += b.draw(cx, yy, o); yy += b.H + g; });
    return s; } };
}
function ia3FlowSVG(seq, o = {}) {
  const S = ia3FSeq(seq), pad = 14, st = o.stubs ? 20 : 0, W = Math.ceil(S.L + S.R + 2 * pad), H = Math.ceil(S.H + 2 * pad + 2 * st), cx = pad + S.L;
  const stubs = st ? `<path d="M${cx},${pad - 4}L${cx},${pad + st}" class="fl" marker-end="url(#ia3ah)"/><path d="M${cx},${pad + st + S.H}L${cx},${pad + 2 * st + S.H + 4}" class="fl" marker-end="url(#ia3ah)"/>` : "";
  return `<svg viewBox="0 0 ${W} ${H}" class="ia3flow" style="max-width:${Math.min(o.w || 560, W * 1.05)}px" role="img" aria-label="${ia3FEsc(o.caption || "Λογικό διάγραμμα").replace(/<[^>]+>/g, "")}"><defs><marker id="ia3ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10Z" fill="#1B2A4A"/></marker></defs>
<style>.ia3flow .ft{font:${IA3F.fs}px "SF Mono",Consolas,Menlo,monospace;fill:#15233f;text-anchor:middle;dominant-baseline:middle}.ia3flow .ft.on{font-weight:700}.ia3flow .fl{fill:none;stroke:#1B2A4A;stroke-width:1.5}.ia3flow .fa{font:700 12px system-ui,sans-serif;fill:#C77A0A}</style>
<rect x="0" y="0" width="${W}" height="${H}" fill="#fbfcfe"/>${stubs}${S.draw(cx, pad + st, o)}</svg>`;
}
function ia3Flow(seq, o = {}) {
  return `<figure class="grfig ia3fig">${ia3FlowSVG(seq, o)}${o.caption ? `<figcaption>${o.caption}</figcaption>` : ""}</figure>`;
}
/* πίνακας συμβόλων λογικού διαγράμματος (σύμβολα ANSI) */
function ia3FlowSymbols() {
  const row = (svg, t) => `<tr><td style="padding:6px 10px"><svg viewBox="0 0 120 44" width="120" height="44">${svg}</svg></td><td style="text-align:left">${t}</td></tr>`;
  const st = 'fill="#fff" stroke="#1B2A4A" stroke-width="1.6"';
  return `<table class="tbl ia3sym"><tr><th>Σύμβολο</th><th>Επεξήγηση</th></tr>
${row(`<ellipse cx="60" cy="22" rx="38" ry="16" ${st}/>`, "Αρχή – Τέλος κυρίως προγράμματος (και είσοδος – έξοδος υποπρογραμμάτων)")}
${row(`<rect x="22" y="6" width="76" height="32" ${st}/>`, "Επεξεργασία (π.χ. εκχώρηση <code>S ← S + i</code>)")}
${row(`<path d="M34,6H100L86,38H20Z" ${st}/>`, "Είσοδος δεδομένων – έξοδος αποτελεσμάτων (Διάβασε / Τύπωσε)")}
${row(`<path d="M60,3L98,22L60,41L22,22Z" ${st}/>`, "Απόφαση (συνθήκη με δύο εξόδους: Α / Ψ)")}
${row(`<rect x="22" y="6" width="76" height="32" ${st}/><path d="M30,6V38M90,6V38" stroke="#1B2A4A" stroke-width="1.6"/>`, "Υποπρόγραμμα (συνάρτηση)")}
${row(`<circle cx="60" cy="22" r="15" ${st}/>`, "Σύνδεσμος (συνέχεια της ροής σε άλλο σημείο)")}
${row(`<path d="M10,22H50" stroke="#1B2A4A" stroke-width="1.6" stroke-dasharray="6 4"/><path d="M110,6H58V38H110" ${st}/>`, "Σχόλιο")}
${row(`<path d="M14,22H96" stroke="#1B2A4A" stroke-width="1.6" marker-end="url(#ia3ah2)"/><defs><marker id="ia3ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10Z" fill="#1B2A4A"/></marker></defs>`, "Ροή (η σειρά εκτέλεσης)")}
</table>`;
}

const R = String.raw;
const CONFIG = {
  storeKey: "pagk-pliroforiki-g-a-v1",
  heroTitle: "Πληροφορική Γ΄ Λυκείου — Παγκύπριες (Μέρος Α)",
  tefxos: "Μέρος Α",
  widgetLabel: "διαδραστικό εργαλείο",
  heroLead: "Δυαδικό σύστημα, άλγεβρα Boole, λογικές πύλες, χάρτες Karnaugh, αθροιστές και τα βασικά της C++ — με θεωρία, διαδραστικά εργαλεία, λυμένες ασκήσεις και quiz για τις Παγκύπριες Εξετάσεις «Πληροφορική και Επιστήμη Η/Υ».",
  howto: `<ul><li>Αριθμοί: <code>12</code> · δεκαδικοί: <code>2,5</code> ή <code>2.5</code></li>
    <li>Δυαδικοί / κείμενο / έξοδος προγράμματος: γράψε ακριβώς ό,τι ζητείται, π.χ. <code>1011,01</code> ή <code>5 7 9</code> (τα πολλαπλά κενά δεν μετρούν).</li>
    <li>Πολλά πεδία; Γράψε κάθε απάντηση στο δικό της πεδίο, με τη σειρά που ζητείται.</li>
    <li>Ύλη: Παγκύπριες Εξετάσεις 2025-2026, «Πληροφορική και Επιστήμη Ηλεκτρονικών Υπολογιστών» (βιβλίο Γ΄ Λυκείου ΥΠΑΝ).</li></ul>`
};

const UNITS = [
  { id: 1, title: "Γ1.1 · Δυαδικό σύστημα αρίθμησης" },
  { id: 2, title: "Γ2.1 · Άλγεβρα Boole και λογικά κυκλώματα" },
  { id: 3, title: "Γ7.1 · C++: βασικές δομές (επανάληψη Β΄)" }
];

const SECTIONS = [
/* ───────────────────────────── 1.1 ───────────────────────────── */
{
  id: "1.1", unit: 1, title: "Δυαδικό σύστημα αρίθμησης: μετατροπή δυαδικού σε δεκαδικό",
  book: "Βιβλίο Γ΄ Λυκείου: Γ1.1 §1 Δυαδικοί αριθμοί, παραδείγματα 1.1 (σ. 13)",
  intro: "Πώς «διαβάζουμε» έναν δυαδικό αριθμό όπως το 1101 ή το 1010.01 και βρίσκουμε την τιμή του στο δεκαδικό σύστημα;",
  thumb: ICON("1101", "blue"),
  theory: R`
<p>Ο υπολογιστής αποθηκεύει και επεξεργάζεται όλα τα δεδομένα (αριθμούς, κείμενο, εικόνες, ήχο) στο <b>δυαδικό σύστημα αρίθμησης</b>, δηλαδή με δύο μόνο ψηφία, το <b>0</b> και το <b>1</b>, γιατί τα ηλεκτρονικά κυκλώματα έχουν δύο σταθερές καταστάσεις (χαμηλή / υψηλή τάση). Σε αυτή την ενότητα μαθαίνουμε τη <b>μετατροπή δυαδικού σε δεκαδικό</b> — και για ακέραιους και για αριθμούς με υποδιαστολή — όπως ζητείται στις Παγκύπριες Εξετάσεις Πληροφορικής.</p>
<div class="tbox def"><h4>Bit, byte και βάση αρίθμησης</h4>
<p>Κάθε δυαδικό ψηφίο λέγεται <b>bit</b> (binary digit). Μια ομάδα <b>8 bits</b> λέγεται <b>byte</b>. Οι αριθμοί της καθημερινής ζωής έχουν <b>βάση το 10</b> (δεκαδικοί, decimal), ενώ οι δυαδικοί έχουν <b>βάση το 2</b>. Για να φαίνεται η βάση γράφουμε τον αριθμό σε παρένθεση με δείκτη: $(1101)_2$, $(13)_{10}$.</p>
<p>Το δεκαδικό $259$ σημαίνει $2\cdot 10^2 + 5\cdot 10^1 + 9\cdot 10^0$. Με τον ίδιο τρόπο, στο δυαδικό κάθε θέση έχει <b>βάρος</b> (αξία θέσης) μια <b>δύναμη του 2</b>: από δεξιά προς τα αριστερά $2^0 = 1,\ 2^1 = 2,\ 2^2 = 4,\ 2^3 = 8, \dots$ και, μετά την υποδιαστολή, $2^{-1} = 0.5,\ 2^{-2} = 0.25,\ 2^{-3} = 0.125, \dots$</p></div>
${ia1BitsFig("1010.01", "Τα βάρη θέσεων του δυαδικού αριθμού 1010.01: μετράμε μόνο τις θέσεις που έχουν 1.")}
<div class="tbox thm"><h4>Μετατροπή δυαδικού σε δεκαδικό (ανάπτυγμα σε δυνάμεις του 2)</h4>
<p>Πολλαπλασιάζουμε κάθε ψηφίο με το βάρος της θέσης του και προσθέτουμε:</p>
<div class="fbox">$$(b_{n-1}\dots b_1b_0.b_{-1}b_{-2}\dots)_2 = b_{n-1}\cdot2^{n-1} + \dots + b_1\cdot 2^1 + b_0\cdot 2^0 + b_{-1}\cdot2^{-1} + b_{-2}\cdot 2^{-2} + \dots$$</div>
<p>Για παράδειγμα $(1101)_2 = 1\cdot2^3 + 1\cdot2^2 + 0\cdot2^1 + 1\cdot2^0 = 8 + 4 + 0 + 1 = (13)_{10}$ και
$(1010.01)_2 = 1\cdot 2^3 + 0\cdot 2^2 + 1\cdot 2^1 + 0\cdot 2^0 + 0\cdot 2^{-1} + 1\cdot 2^{-2} = 8 + 2 + 0.25 = (10.25)_{10}$.</p></div>
<div class="tbox ex"><h4>Παραδείγματα του βιβλίου</h4>
<p>$(10111)_2 = (23)_{10}$ · $(1010100)_2 = (84)_{10}$ · $(111.11)_2 = (7.75)_{10}$ · $(10000.101)_2 = (16.625)_{10}$.</p>
<details class="steps"><summary>Λύση βήμα-βήμα για το $(10000.101)_2$</summary>
<p>Ακέραιο μέρος: $1\cdot2^4 = 16$ (τα άλλα ψηφία είναι 0). Κλασματικό μέρος: $1\cdot 2^{-1} + 0\cdot 2^{-2} + 1\cdot 2^{-3} = 0.5 + 0.125 = 0.625$. Σύνολο: $16 + 0.625 = 16.625$.</p></details>
<details class="steps"><summary>Λύση βήμα-βήμα για το $(1010100)_2$ (με πίνακα βαρών)</summary>
${ia1BitsFig("1010100")}
<p>Θέσεις με 1: $2^6 + 2^4 + 2^2 = 64 + 16 + 4 = 84$.</p></details></div>
<div class="tbox rem"><h4>Χρήσιμα «σταθερά» αποτελέσματα</h4>
<p>Με $n$ bits (χωρίς πρόσημο) γράφουμε τους ακέραιους από $0$ έως $2^n - 1$: με 4 bits από 0 έως 15, με <b>8 bits (1 byte) από 0 έως 255</b>. Ο αριθμός που έχει $n$ άσσους, $(11\dots1)_2$, ισούται με $2^n - 1$ (π.χ. $(11111111)_2 = 255$), και το $1$ ακολουθούμενο από $n$ μηδενικά ισούται με $2^n$ (π.χ. $(10000000)_2 = 128$). Τα αρχικά μηδενικά δεν αλλάζουν την τιμή: $(00110010)_2 = (110010)_2 = 50$.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<p>• Αρίθμηση των θέσεων από αριστερά αντί από δεξιά: η δεξιότερη θέση του ακέραιου μέρους έχει βάρος $2^0 = 1$, όχι $2^1$.<br>• Στο κλασματικό μέρος τα βάρη είναι $\frac12, \frac14, \frac18, \dots$ — <i>όχι</i> $0.1, 0.01, \dots$<br>• Στις εξετάσεις ζητείται να «σημειώσετε τα βήματα»: γράφετε πάντα το ανάπτυγμα σε δυνάμεις του 2, όχι μόνο το αποτέλεσμα.</p></div>
`,
  widget: "ia1bits",
  gen: "ia1b2d",
  exercises: [
    { level: 1, q: R`Να μετατρέψετε τον δυαδικό αριθμό $(10111)_2$ στο δεκαδικό σύστημα.`, fields: [{ label: "(10111)₂ =", ans: 23 }],
      hint: R`Βάρη από δεξιά: 1, 2, 4, 8, 16.`, sol: R`$1\cdot 16 + 0\cdot 8 + 1\cdot 4 + 1\cdot 2 + 1\cdot 1 = 23$. Άρα $(10111)_2 = (23)_{10}$.` },
    { level: 1, q: R`Να μετατρέψετε τον δυαδικό αριθμό $01010111$ στο δεκαδικό σύστημα.`, fields: [{ label: "τιμή =", ans: 87 }],
      hint: R`Γράψε κάτω από κάθε ψηφίο το βάρος της θέσης του ($2^7, 2^6, \dots, 2^0$) και πρόσθεσε μόνο όσα αντιστοιχούν σε 1.`, sol: R`$0\cdot2^7 + 1\cdot 2^6 + 0\cdot 2^5 + 1\cdot 2^4 + 0\cdot 2^3 + 1\cdot 2^2 + 1\cdot 2^1 + 1\cdot 2^0 = 64 + 16 + 4 + 2 + 1 = 87$.` },
    { level: 1, q: R`Να μετατρέψετε τον δυαδικό αριθμό $10010001$ στο δεκαδικό σύστημα.`, fields: [{ label: "τιμή =", ans: 145 }],
      hint: R`Αρίθμησε τις θέσεις από δεξιά ξεκινώντας από το $2^0$ και πρόσθεσε τα βάρη των θέσεων που έχουν 1.`, sol: R`$1\cdot2^7 + 1\cdot2^4 + 1\cdot2^0 = 128 + 16 + 1 = 145$.` },
    { level: 1, q: R`Να μετατρέψετε τον δυαδικό αριθμό $10000001$ στο δεκαδικό σύστημα.`, fields: [{ label: "τιμή =", ans: 129 }],
      hint: R`Μόνο δύο ψηφία είναι 1: σε ποιες θέσεις βρίσκονται;`, sol: R`$1\cdot 2^7 + 1\cdot 2^0 = 128 + 1 = 129$.` },
    { level: 1, type: "mc", q: R`Ένα byte αποτελείται από 8 bits.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Θυμήσου τον ορισμό του byte.`, sol: R`Σωστό: 1 byte = 8 bits (δυαδικά ψηφία).` },
    { level: 2, q: R`Να μετατρέψετε τον δυαδικό αριθμό $(111.11)_2$ στο δεκαδικό σύστημα.`, fields: [{ label: "(111.11)₂ =", ans: 7.75, tol: 1e-9 }],
      hint: R`Μετά την υποδιαστολή τα βάρη είναι $2^{-1} = 0.5$ και $2^{-2} = 0.25$.`, sol: R`Ακέραιο μέρος: $4 + 2 + 1 = 7$. Κλασματικό: $0.5 + 0.25 = 0.75$. Άρα $(111.11)_2 = (7.75)_{10}$.` },
    { level: 2, q: R`Να μετατρέψετε τον δυαδικό αριθμό $00110010.01$ στο δεκαδικό σύστημα.`, fields: [{ label: "τιμή =", ans: 50.25, tol: 1e-9 }],
      hint: R`Ακέραιο μέρος $110010$, κλασματικό $.01$.`, sol: R`$1\cdot2^5 + 1\cdot2^4 + 1\cdot 2^1 = 32 + 16 + 2 = 50$ και $0\cdot2^{-1} + 1\cdot 2^{-2} = 0.25$. Άρα $50.25$.` },
    { level: 2, q: R`Να μετατρέψετε τον δυαδικό αριθμό $01100100.11$ στο δεκαδικό σύστημα.`, fields: [{ label: "τιμή =", ans: 100.75, tol: 1e-9 }],
      hint: R`$64 + 32 + 4$ για το ακέραιο μέρος.`, sol: R`Ακέραιο: $2^6 + 2^5 + 2^2 = 64 + 32 + 4 = 100$. Κλασματικό: $2^{-1} + 2^{-2} = 0.75$. Άρα $100.75$.` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποιος είναι ο μεγαλύτερος ακέραιος (χωρίς πρόσημο) που μπορεί να παρασταθεί με 8 bits;`, options: ["255", "256", "128", "127"], correct: 0,
      hint: R`Ο μεγαλύτερος είναι ο $11111111$.`, sol: R`$(11111111)_2 = 2^8 - 1 = 255$. Με 8 bits παριστάνονται $2^8 = 256$ διαφορετικές τιμές, από 0 έως 255.` },
    { level: 3, q: R`<i>(Παγκύπριες, μορφή εξέτασης)</i> Δίνεται ο δυαδικός αριθμός $Β = 01010101$. Να δείξετε ότι η αντίστοιχη τιμή του στο δεκαδικό σύστημα είναι $(85)_{10}$ — γράψτε πόσο συνεισφέρουν οι τέσσερις άσσοι (από αριστερά προς τα δεξιά) και το άθροισμα.`,
      fields: [{ label: "1ος άσσος:", ans: 64 }, { label: "2ος:", ans: 16 }, { label: "3ος:", ans: 4 }, { label: "4ος:", ans: 1 }, { label: "άθροισμα:", ans: 85 }],
      hint: R`Αρίθμησε τις θέσεις από δεξιά ξεκινώντας από το $2^0$ και βρες σε ποιες υπάρχει 1.`, sol: R`$0\cdot 2^7 + 1\cdot 2^6 + 0\cdot 2^5 + 1\cdot 2^4 + 0\cdot 2^3 + 1\cdot 2^2 + 0\cdot 2^1 + 1\cdot 2^0 = 64 + 16 + 4 + 1 = 85$.` },
    { level: 3, q: R`Ένας δυαδικός αριθμός αποτελείται από ένα <b>1</b> ακολουθούμενο από επτά <b>0</b>, μία υποδιαστολή και τρία <b>1</b>: $(10000000.111)_2$. Ποια είναι η τιμή του στο δεκαδικό;`, fields: [{ label: "τιμή =", ans: 128.875, tol: 1e-9 }],
      hint: R`$1$ με επτά μηδενικά $= 2^7$. Κλασματικό: $\frac12 + \frac14 + \frac18$.`, sol: R`$2^7 = 128$ και $0.5 + 0.25 + 0.125 = 0.875$, άρα $128.875$.` }
  ]
},
/* ───────────────────────────── 1.2 ───────────────────────────── */
{
  id: "1.2", unit: 1, title: "Μετατροπή δεκαδικού σε δυαδικό (διαδοχικές διαιρέσεις με το 2)",
  book: "Βιβλίο Γ΄ Λυκείου: Γ1.1 §1, αλγόριθμος και παράδειγμα 1.2 (σ. 13)",
  intro: "Πώς μετατρέπουμε έναν δεκαδικό ακέραιο, π.χ. το 23, σε δυαδικό με τη μέθοδο των διαδοχικών διαιρέσεων με το 2;",
  thumb: ICON("23→10111", "green"),
  theory: R`
<p>Η <b>μετατροπή δεκαδικού σε δυαδικό</b> για ακέραιους γίνεται με τη μέθοδο των <b>διαδοχικών διαιρέσεων με το 2</b>. Κάθε διαίρεση δίνει ένα υπόλοιπο 0 ή 1, και τα υπόλοιπα —διαβασμένα <b>από κάτω προς τα πάνω</b>— σχηματίζουν τον δυαδικό αριθμό. Αυτός είναι ο αλγόριθμος του βιβλίου και πρέπει να φαίνεται ο πίνακας των διαιρέσεων στην απάντησή σας στις Παγκύπριες.</p>
<div class="tbox def"><h4>Αλγόριθμος μετατροπής δεκαδικού ακέραιου σε δυαδικό</h4>
<p><b>Βήμα 1:</b> Διαιρούμε τον αριθμό με το 2.<br><b>Βήμα 2:</b> Σημειώνουμε το υπόλοιπο και διαιρούμε το πηλίκο που προέκυψε με το 2.<br><b>Βήμα 3:</b> Επαναλαμβάνουμε το βήμα 2 για όσο το πηλίκο είναι μεγαλύτερο από το 0.<br><b>Βήμα 4:</b> Ο δυαδικός αριθμός προκύπτει από τα υπόλοιπα των διαιρέσεων, βάζοντάς τα σε <b>αντίστροφη σειρά</b>.</p></div>
<div class="tbox ex"><h4>Μετατροπή του 23 σε δυαδικό</h4>
<div class="figrow"><div>${ia1DivTbl(23)}</div><div><p>Διαβάζουμε τα υπόλοιπα από την τελευταία διαίρεση προς την πρώτη: <b>1 0 1 1 1</b>.</p><div class="fbox">$$(23)_{10} = (10111)_2$$</div><p>Επαλήθευση: $16 + 4 + 2 + 1 = 23$ ✓</p></div></div></div>
<div class="tbox ex"><h4>Μετατροπή του 36 σε δυαδικό (θέμα Παγκυπρίων)</h4>
<details class="steps"><summary>Λύση βήμα-βήμα</summary>
${ia1DivTbl(36)}
<p>Υπόλοιπα από κάτω προς τα πάνω: $100100$. Άρα $(36)_{10} = (100100)_2$. Επαλήθευση: $32 + 4 = 36$.</p></details></div>
<div class="tbox tip"><h4>Γιατί δουλεύει η μέθοδος;</h4>
<p>Το υπόλοιπο της διαίρεσης με το 2 μάς λέει αν ο αριθμός είναι άρτιος (0) ή περιττός (1), δηλαδή μας δίνει το <b>λιγότερο σημαντικό ψηφίο</b> $b_0$ (το δεξιότερο). Το πηλίκο είναι ο αριθμός «μετατοπισμένος» μία θέση δεξιά, οπότε η επόμενη διαίρεση δίνει το $b_1$ κ.ο.κ. Γι’ αυτό το <i>πρώτο</i> υπόλοιπο γράφεται <i>τελευταίο</i> (δεξιά). Συνέπεια: κάθε <b>περιττός</b> αριθμός τελειώνει σε 1 και κάθε <b>άρτιος</b> σε 0.</p></div>
<div class="tbox rem"><h4>Εναλλακτικός έλεγχος με δυνάμεις του 2</h4>
<p>Μπορούμε να ελέγξουμε το αποτέλεσμα αφαιρώντας τη μεγαλύτερη δύναμη του 2 που χωρά: $23 = 16 + 7 = 16 + 4 + 3 = 16 + 4 + 2 + 1 \Rightarrow 10111$. Το πλήθος των bits που χρειάζεται ένας ακέραιος $N \ge 1$ είναι το μικρότερο $n$ με $2^n > N$ (π.χ. για το 200 χρειάζονται 8 bits, αφού $2^7 = 128 \le 200 < 256 = 2^8$).</p>
<p>Σε <b>8 bits</b> συμπληρώνουμε με μηδενικά αριστερά: $(23)_{10} = 00010111$.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<p>• Γράφουμε τα υπόλοιπα από πάνω προς τα κάτω (ανάποδα!).<br>• Σταματάμε όταν το πηλίκο γίνει 1, ξεχνώντας την τελευταία διαίρεση $1/2 = 0$ υπόλοιπο <b>1</b>.<br>• Δεν δείχνουμε τον πίνακα διαιρέσεων: χάνονται μονάδες, γιατί ζητείται «σημειώνοντας τα βήματα».</p></div>
`,
  widget: "ia1div",
  gen: "ia1d2b",
  exercises: [
    { level: 1, q: R`Να μετατρέψετε τον δεκαδικό αριθμό $19$ σε δυαδικό.`, fields: [{ label: "(19)₁₀ =", ans: ia1A("10011"), text: true, ph: "π.χ. 1010" }],
      hint: R`19/2 = 9 υπ. 1, 9/2 = 4 υπ. 1, …`, sol: R`${ia1DivTbl(19)} Υπόλοιπα από κάτω προς τα πάνω: $(19)_{10} = (10011)_2$.` },
    { level: 1, q: R`Να μετατρέψετε τον δεκαδικό αριθμό $48$ σε δυαδικό.`, fields: [{ label: "(48)₁₀ =", ans: ia1A("110000"), text: true }],
      hint: R`Το 48 είναι άρτιο — τελειώνει σε 0.`, sol: R`${ia1DivTbl(48)} Άρα $(48)_{10} = (110000)_2$ $(= 32 + 16)$.` },
    { level: 1, type: "mc", q: R`Ένας περιττός δεκαδικός ακέραιος έχει πάντα 1 ως δεξιότερο (λιγότερο σημαντικό) ψηφίο στο δυαδικό.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Ποιο είναι το υπόλοιπο της διαίρεσης ενός περιττού με το 2;`, sol: R`Σωστό: το δεξιότερο ψηφίο είναι το υπόλοιπο της διαίρεσης με το 2, που για περιττό αριθμό είναι 1.` },
    { level: 2, q: R`Να μετατρέψετε τον δεκαδικό αριθμό $254$ σε δυαδικό.`, fields: [{ label: "(254)₁₀ =", ans: ia1A("11111110"), text: true }],
      hint: R`$254 = 255 - 1$ και $255 = (11111111)_2$.`, sol: R`${ia1DivTbl(254)} Άρα $(254)_{10} = (11111110)_2$.` },
    { level: 2, q: R`<i>(Παγκύπριες)</i> Να δείξετε ότι η τιμή του δεκαδικού αριθμού $Α = 36$ στο δυαδικό είναι $(100100)_2$. Πόσες διαιρέσεις με το 2 χρειάζονται και ποιο είναι το υπόλοιπο της <b>τελευταίας</b> διαίρεσης;`,
      fields: [{ label: "διαιρέσεις:", ans: 6 }, { label: "τελευταίο υπόλοιπο:", ans: 1 }],
      hint: R`Σταματάμε όταν το πηλίκο γίνει 0.`, sol: R`${ia1DivTbl(36)} Έξι διαιρέσεις (36, 18, 9, 4, 2, 1). Η τελευταία, $1/2$, δίνει πηλίκο 0 και υπόλοιπο <b>1</b>, το οποίο γίνεται το αριστερότερο ψηφίο: $100100$.` },
    { level: 2, q: R`Να μετατρέψετε τον δεκαδικό αριθμό $100$ σε δυαδικό <b>8 bits</b> (με τα αρχικά μηδενικά).`, fields: [{ label: "8 bits:", ans: "01100100", text: true, nospace: true }],
      hint: R`Βρες πρώτα τον δυαδικό και συμπλήρωσε μηδενικά αριστερά μέχρι να γίνουν 8 ψηφία.`, sol: R`${ia1DivTbl(100)} $(100)_{10} = (1100100)_2$, δηλαδή 7 ψηφία· σε 8 bits: $01100100$.` },
    { level: 2, q: R`Πόσα bits χρειάζονται (τουλάχιστον) για να γραφτεί ο ακέραιος $200$ στο δυαδικό;`, fields: [{ label: "bits:", ans: 8 }],
      hint: R`Ποια είναι η μεγαλύτερη δύναμη του 2 που δεν ξεπερνά το 200;`, sol: R`$2^7 = 128 \le 200 < 256 = 2^8$, άρα χρειάζονται $8$ bits: $(200)_{10} = (11001000)_2$.` },
    { level: 2, type: "mc", q: R`Στη μέθοδο των διαδοχικών διαιρέσεων, το υπόλοιπο της διαίρεσης του αρχικού αριθμού με το 2 γίνεται:`,
      options: ["το λιγότερο σημαντικό (δεξιότερο) ψηφίο", "το περισσότερο σημαντικό (αριστερότερο) ψηφίο", "το ψηφίο της μεσαίας θέσης", "δεν χρησιμοποιείται"], correct: 0,
      hint: R`Τα υπόλοιπα γράφονται σε αντίστροφη σειρά.`, sol: R`Τα υπόλοιπα διαβάζονται από κάτω προς τα πάνω, οπότε το υπόλοιπο της διαίρεσης του αρχικού αριθμού καταλήγει δεξιά: είναι το λιγότερο σημαντικό ψηφίο $b_0$.` },
    { level: 3, q: R`Να μετατρέψετε σε δυαδικό τον αριθμό $2^7 = 128$ και τον αριθμό $127$.`, fields: [{ label: "(128)₁₀ =", ans: ia1A("10000000"), text: true }, { label: "(127)₁₀ =", ans: ia1A("1111111"), text: true }],
      hint: R`$2^n$ = 1 και $n$ μηδενικά, $2^n - 1$ = $n$ άσσοι.`, sol: R`$128 = 2^7 = (10000000)_2$ και $127 = 2^7 - 1 = 64 + 32 + 16 + 8 + 4 + 2 + 1 = (1111111)_2$ (σε 8 bits: $01111111$).` },
    { level: 3, q: R`Ένας δεκαδικός ακέραιος $N$ γράφεται στο δυαδικό ως $(101101)_2$. Να γράψετε τον $2N$ και τον $N + 1$ στο δυαδικό.`, fields: [{ label: "2N =", ans: ia1A("1011010"), text: true }, { label: "N + 1 =", ans: ia1A("101110"), text: true }],
      hint: R`Πολλαπλασιασμός με 2 = προσθήκη ενός 0 στο τέλος (όπως ×10 στο δεκαδικό).`, sol: R`$N = 45$. $2N = 90 = (1011010)_2$: προσθέτουμε ένα 0 δεξιά. $N + 1 = 46 = (101110)_2$: το τελευταίο 1 γίνεται 0 με κρατούμενο που κάνει το προηγούμενο 0 σε 1.` }
  ]
},
/* ───────────────────────────── 1.3 ───────────────────────────── */
{
  id: "1.3", unit: 1, title: "Μετατροπή δεκαδικού αριθμού με υποδιαστολή σε δυαδικό",
  book: "Βιβλίο Γ΄ Λυκείου: Γ1.1 §1, παραδείγματα 1.3–1.4 (σ. 13–14)",
  intro: "Πώς μετατρέπουμε σε δυαδικό έναν δεκαδικό αριθμό με υποδιαστολή, όπως το 12.45, με διαδοχικούς πολλαπλασιασμούς με το 2;",
  thumb: ICON("0.1011", "purple"),
  theory: R`
<p>Η <b>μετατροπή δεκαδικού αριθμού με υποδιαστολή σε δυαδικό</b> είναι ρητά μέσα στην ύλη των Παγκυπρίων 2025-2026. Ο αριθμός χωρίζεται σε <b>ακέραιο μέρος</b> και <b>κλασματικό μέρος</b>: το ακέραιο μετατρέπεται με διαδοχικές διαιρέσεις με το 2 (ενότητα 1.2), ενώ το κλασματικό με <b>διαδοχικούς πολλαπλασιασμούς με το 2</b>.</p>
<div class="tbox def"><h4>Αλγόριθμος για το κλασματικό μέρος</h4>
<p><b>Βήμα 1:</b> Πολλαπλασιάζουμε το κλασματικό μέρος με το 2.<br>
<b>Βήμα 2:</b> Αν το αποτέλεσμα του πολλαπλασιασμού είναι μεγαλύτερο ή ίσο του 1, το bit είναι <b>1</b>, διαφορετικά είναι <b>0</b>.<br>
<b>Βήμα 3:</b> Πολλαπλασιάζουμε με το 2 το <b>κλασματικό μέρος</b> του προηγούμενου αποτελέσματος (αφαιρούμε δηλαδή το 1, αν υπήρχε).<br>
<b>Βήμα 4:</b> Όπως το βήμα 2.<br>
<b>Βήμα 5:</b> Επαναλαμβάνουμε τα βήματα 3 και 4 μέχρι να βρούμε κλασματικό μέρος 0 ή να πετύχουμε την επιθυμητή ακρίβεια.</p>
<p>Τα bits γράφονται μετά την υποδιαστολή <b>με τη σειρά που βρέθηκαν</b> (από πάνω προς τα κάτω) — αντίθετα από τα υπόλοιπα των διαιρέσεων.</p>
<p class="small"><b>Σημείωση για το βιβλίο:</b> τα βήματα του βιβλίου γράφουν «μεγαλύτερο του 1», όμως το δικό του παράδειγμα ($0.5\times 2 = 1$ → bit 1) δείχνει ότι ο σωστός έλεγχος είναι <b>μεγαλύτερο ή ίσο του 1</b>.</p></div>
<div class="tbox ex"><h4>Μετατροπή του 0.6875</h4>
<div class="figrow"><div>${ia1MulTbl("0.6875", 10)}</div><div><p>Τα bits από πάνω προς τα κάτω: <b>1 0 1 1</b>. Το κλασματικό μέρος έγινε 0, άρα η μετατροπή είναι <b>ακριβής</b>:</p><div class="fbox">$$(0.6875)_{10} = (0.1011)_2$$</div><p>Επαλήθευση: $0.5 + 0.125 + 0.0625 = 0.6875$ ✓</p></div></div></div>
<div class="tbox ex"><h4>Μετατροπή του 12.45 (παράδειγμα 1.4 του βιβλίου)</h4>
<div class="figrow"><div><p><b>Ακέραιο μέρος</b></p>${ia1DivTbl(12)}</div><div><p><b>Κλασματικό μέρος</b> (7 bits)</p>${ia1MulTbl("0.45", 7)}</div></div>
<p>Ακέραιο μέρος: $1100$. Κλασματικό: $0111001$. Η διαδικασία δεν τελειώνει ποτέ (το $0.8$ ξαναεμφανίζεται, άρα τα ψηφία $1100$ επαναλαμβάνονται περιοδικά), οπότε σταματάμε στην επιθυμητή ακρίβεια και παίρνουμε μια <b>προσέγγιση</b>:</p>
<div class="fbox">$$(12.45)_{10} \approx (1100.0111001)_2$$</div>
<details class="steps"><summary>Πόσο ακριβής είναι η προσέγγιση;</summary><p>$(0.0111001)_2 = \frac14 + \frac18 + \frac1{16} + \frac1{128} = 0.4453125$, άρα $(1100.0111001)_2 = 12.4453125$ — σφάλμα μικρότερο από $2^{-7} \approx 0.0078$. Κάθε επιπλέον bit μειώνει το μέγιστο σφάλμα στο μισό.</p></details></div>
<div class="tbox rem"><h4>Εμβάθυνση (εκτός βιβλίου): πότε η μετατροπή είναι ακριβής;</h4>
<p>Ένα δεκαδικό κλάσμα γράφεται με <b>πεπερασμένο</b> πλήθος δυαδικών ψηφίων μόνο αν είναι της μορφής $\frac{m}{2^k}$, π.χ. $0.5,\ 0.25,\ 0.75,\ 0.375,\ 0.6875$. Αριθμοί όπως $0.1$, $0.2$, $0.45$, $0.9$ δίνουν <b>περιοδικό</b> δυαδικό ανάπτυγμα, π.χ. $(0.1)_{10} = (0.0001100110011\dots)_2$. Γι’ αυτό στη C++ η πράξη <code>0.1 + 0.2</code> δεν δίνει ακριβώς <code>0.3</code>: ο υπολογιστής αποθηκεύει μόνο μια προσέγγιση.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<p>• Πολλαπλασιάζουμε ολόκληρο το γινόμενο (π.χ. $1.8 \times 2$) αντί μόνο το κλασματικό μέρος ($0.8 \times 2$).<br>
• Γράφουμε τα bits του κλασματικού μέρους ανάποδα (από κάτω προς τα πάνω).<br>
• Όταν το γινόμενο είναι ακριβώς $1$ (π.χ. $0.5 \times 2 = 1$) το bit είναι <b>1</b> και η διαδικασία τελειώνει.<br>
• Δεν σεβόμαστε το πλήθος ψηφίων που ζητά η άσκηση (π.χ. «με ακρίβεια 6 δυαδικών ψηφίων»): σταματάμε ακριβώς εκεί, <i>χωρίς στρογγυλοποίηση</i>.</p></div>
`,
  widget: "ia1frac",
  gen: "ia1fr",
  exercises: [
    { level: 1, q: R`Να μετατρέψετε τον δεκαδικό αριθμό $0.375$ σε δυαδικό.`, fields: [{ label: "(0.375)₁₀ =", ans: ia1A("0.011", true), text: true, nospace: true, ph: "π.χ. 0.101" }],
      hint: R`$0.375\times2 = 0.75$ → bit 0, …`, sol: R`${ia1MulTbl("0.375", 10)} Bits από πάνω προς τα κάτω: $(0.375)_{10} = (0.011)_2$. Επαλήθευση: $0.25 + 0.125 = 0.375$.` },
    { level: 1, q: R`Να μετατρέψετε τον δεκαδικό αριθμό $5.625$ σε δυαδικό.`, fields: [{ label: "(5.625)₁₀ =", ans: ia1A("101.101"), text: true, nospace: true }],
      hint: R`Ακέραιο μέρος $5 = 101$, κλασματικό $0.625$.`, sol: R`Ακέραιο: $5 = (101)_2$. ${ia1MulTbl("0.625", 10)} Κλασματικό: $.101$. Άρα $(5.625)_{10} = (101.101)_2$.` },
    { level: 1, type: "mc", q: R`Στη μετατροπή του κλασματικού μέρους με διαδοχικούς πολλαπλασιασμούς, τα bits γράφονται μετά την υποδιαστολή με τη σειρά που υπολογίστηκαν (το πρώτο bit ακριβώς μετά την υποδιαστολή).`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Το πρώτο γινόμενο αντιστοιχεί στο βάρος $2^{-1}$.`, sol: R`Σωστό. Το πρώτο bit έχει βάρος $\frac12$, το δεύτερο $\frac14$ κ.ο.κ. — αντίθετα από τα υπόλοιπα των διαιρέσεων, που γράφονται ανάποδα.` },
    { level: 2, q: R`Να μετατρέψετε σε δυαδικό τον αριθμό $12.45$, με <b>7</b> δυαδικά ψηφία στο κλασματικό μέρος.`, fields: [{ label: "(12.45)₁₀ ≈", ans: ia1A("1100.0111001"), text: true, nospace: true }],
      hint: R`Ακέραιο $12 = 1100$· για το $0.45$ κάνε 7 πολλαπλασιασμούς.`, sol: R`${ia1DivTbl(12)} ${ia1MulTbl("0.45", 7)} Άρα $(12.45)_{10} \approx (1100.0111001)_2$.` },
    { level: 2, q: R`Να μετατρέψετε σε δυαδικό τον αριθμό $5.90$, με <b>4</b> δυαδικά ψηφία στο κλασματικό μέρος.`, fields: [{ label: "(5.90)₁₀ ≈", ans: ia1A("101.1110"), text: true, nospace: true }],
      hint: R`$0.9\times 2 = 1.8$ → 1, $0.8\times2 = 1.6$ → 1, …`, sol: R`$5 = (101)_2$. ${ia1MulTbl("0.9", 4)} Άρα $(5.90)_{10} \approx (101.1110)_2$ (περιοδικό: $0.9 = 0.1\overline{1100}_2$).` },
    { level: 2, q: R`Να γράψετε τα πρώτα <b>8</b> δυαδικά ψηφία του κλασματικού μέρους του δεκαδικού αριθμού $0.05$ (δηλαδή $0.b_1b_2\dots b_8$).`, fields: [{ label: "(0.05)₁₀ ≈", ans: ia1A("0.00001100", true), text: true, nospace: true }],
      hint: R`Τα πρώτα τέσσερα γινόμενα είναι μικρότερα του 1.`, sol: R`${ia1MulTbl("0.05", 8)} Άρα $(0.05)_{10} \approx (0.00001100)_2$.` },
    { level: 3, type: "mc", q: R`<i>(Εμβάθυνση — εκτός βιβλίου)</i> Ποιος από τους παρακάτω δεκαδικούς αριθμούς έχει <b>πεπερασμένη</b> (ακριβή) αναπαράσταση στο δυαδικό σύστημα;`, options: ["0.375", "0.1", "0.45", "0.2"], correct: 0,
      hint: R`Ακριβής αναπαράσταση έχουν μόνο τα κλάσματα της μορφής $m/2^k$.`, sol: R`$0.375 = \frac{3}{8} = (0.011)_2$. Τα $0.1$, $0.45$, $0.2$ δεν γράφονται ως $m/2^k$, άρα δίνουν περιοδικό δυαδικό ανάπτυγμα.` },
    { level: 2, q: R`Να μετατρέψετε σε δεκαδικό τον δυαδικό αριθμό $(0.0111001)_2$ (την προσέγγιση του $0.45$).`, fields: [{ label: "τιμή =", ans: 0.4453125, tol: 1e-9 }],
      hint: R`Βάρη: $2^{-2}, 2^{-3}, 2^{-4}, 2^{-7}$.`, sol: R`$0.25 + 0.125 + 0.0625 + 0.0078125 = 0.4453125$.` },
    { level: 3, q: R`Να μετατρέψετε σε δυαδικό τον αριθμό $19.3$ με <b>6</b> δυαδικά ψηφία στο κλασματικό μέρος. Στη στήλη «Αριθμός» του πίνακα πολλαπλασιασμών, ποιος είναι ο πρώτος αριθμός που εμφανίζεται για δεύτερη φορά (και κάνει το ανάπτυγμα περιοδικό);`,
      fields: [{ label: "(19.3)₁₀ ≈", ans: ia1A("10011.010011"), text: true, nospace: true }, { label: "αριθμός στήλης:", ans: 0.6, tol: 1e-9 }],
      hint: R`$0.3 \to 0.6 \to 0.2 \to 0.4 \to 0.8 \to 0.6 \to \dots$`, sol: R`$19 = (10011)_2$. ${ia1MulTbl("0.3", 6)} Άρα $(19.3)_{10} \approx (10011.010011)_2$. Μετά το $0.6$ ακολουθούν $0.2, 0.4, 0.8$ και ξανά $0.6$: τα ψηφία $1001$ επαναλαμβάνονται, $0.3 = 0.0\overline{1001}_2$.` },
    { level: 3, q: R`Ο δεκαδικός αριθμός $x$ μετατράπηκε ακριβώς σε $(110.0101)_2$. Ποιος είναι ο $x$; Πόσοι πολλαπλασιασμοί με το 2 έγιναν για το κλασματικό του μέρος;`,
      fields: [{ label: "x =", ans: 6.3125, tol: 1e-9 }, { label: "πολλαπλασιασμοί:", ans: 4 }],
      hint: R`Το κλασματικό μέρος έχει 4 ψηφία και η μετατροπή ήταν ακριβής.`, sol: R`$6 + \frac14 + \frac1{16} = 6.3125$. Το κλασματικό μέρος $0.3125$ δίνει 4 bits και στον 4ο πολλαπλασιασμό μηδενίζεται: ${ia1MulTbl("0.3125", 10)}` }
  ]
},
/* ───────────────────────────── 1.4 ───────────────────────────── */
{
  id: "1.4", unit: 1, title: "Πρόσθεση και αφαίρεση δυαδικών αριθμών (κρατούμενο, δανεικό, υπερχείλιση)",
  book: "Βιβλίο Γ΄ Λυκείου: Γ1.1 §2, παραδείγματα 1.7–1.8 (σ. 15–16)",
  intro: "Πώς προσθέτουμε και αφαιρούμε δυαδικούς αριθμούς των 8 bits και τι σημαίνει υπερχείλιση;",
  thumb: ICON("1+1=10", "amber"),
  theory: R`
<p>Η <b>πρόσθεση δυαδικών αριθμών</b> γίνεται όπως η πρόσθεση δεκαδικών «κάθετα», στήλη-στήλη από δεξιά προς τα αριστερά. Η διαφορά είναι ότι έχουμε <b>κρατούμενο</b> (carry) όταν συμπληρωθεί μία <b>δυάδα</b> και όχι όταν συμπληρωθεί μία δεκάδα. Αντίστοιχα, στην <b>αφαίρεση δυαδικών</b> $X - Y$ με $X \ge Y$ χρησιμοποιούμε το <b>δανεικό</b> (borrow).</p>
<div class="tbox def"><h4>Κανόνες πρόσθεσης και αφαίρεσης bits</h4>
<div class="figrow"><div>${ia1Tbl(["Πρόσθεση", "Αποτ.", "Κρατ."], [["0 + 0", 0, 0], ["0 + 1 = 1 + 0", 1, 0], ["1 + 1", 0, 1], ["1 + 1 + 1", 1, 1]])}</div>
<div>${ia1Tbl(["Αφαίρεση", "Αποτ.", "Δαν."], [["0 − 0", 0, 0], ["1 − 0", 1, 0], ["1 − 1", 0, 0], ["0 − 1", 1, 1]])}</div></div>
<p>$1 + 1 = (10)_2$: γράφουμε 0 και κρατάμε 1. $0 - 1$: δανειζόμαστε από την επόμενη στήλη, οπότε γίνεται $(10)_2 - 1 = 1$, και η επόμενη στήλη μειώνεται κατά 1.</p></div>
<div class="tbox ex"><h4>Παραδείγματα πρόσθεσης (8 bits)</h4>
${ia1Col(["10001011", "+ 00101010", "=", "10110101"], "139 + 42 = 181")}${ia1Col(["00001111", "+ 00000001", "=", "00010000"], "15 + 1 = 16")}${ia1Col(["10000000", "+ 10000000", "=", "1 00000000"], "υπερχείλιση")}${ia1Col(["11101111", "+ 11111111", "=", "1 11101110"], "υπερχείλιση")}
<p>Στα δύο τελευταία το αποτέλεσμα <b>δεν χωρά σε 8 bits</b>: δημιουργείται 9ο ψηφίο. Αυτό λέγεται <b>υπερχείλιση</b> (overflow) του τελευταίου ψηφίου.</p></div>
<div class="tbox ex"><h4>Παραδείγματα αφαίρεσης $X - Y$ με $X \ge Y$</h4>
${ia1Col(["01100100", "− 00101000", "=", "00111100"], "100 − 40 = 60")}${ia1Col(["00001010", "− 00000111", "=", "00000011"], "10 − 7 = 3")}${ia1Col(["10000001", "− 00011101", "=", "01100100"], "129 − 29 = 100")}
<details class="steps"><summary>Λύση βήμα-βήμα: $00001010 - 00000111$</summary>
<p>Στήλη $2^0$: $0 - 1$ → δανειζόμαστε: $10 - 1 = 1$, δανεικό 1. Στήλη $2^1$: $1 - 1 - 1(\text{δανεικό})$ → πάλι δανειζόμαστε: $11 - 1 - 1 = 1$, δανεικό 1. Στήλη $2^2$: $0 - 1 - 1$ → δανειζόμαστε: $10 - 1 - 1 = 0$, δανεικό 1. Στήλη $2^3$: $1 - 0 - 1 = 0$. Υπόλοιπες στήλες 0. Αποτέλεσμα $00000011 = 3$ ✓.</p></details></div>
<div class="tbox ex"><h4>Θέμα Παγκυπρίων: $Α + Β$ με $Α = 10101010$, $Β = 01000111$</h4>
<details class="steps"><summary>Λύση βήμα-βήμα</summary>
${ia1Col(["   111  ", "10101010", "+ 01000111", "=", "11110001"], "κρατούμενα στην πρώτη γραμμή")}
<p>$170 + 71 = 241 = (11110001)_2$ — χωρά σε 8 bits, άρα δεν έχουμε υπερχείλιση.</p></details></div>
<div class="tbox tip"><h4>Γρήγορος έλεγχος</h4><p>Μετάτρεψε τους όρους σε δεκαδικό, κάνε την πράξη και ξαναμετάτρεψε. Αν το άθροισμα δύο αριθμών 8 bits ξεπερνά το $255$, θα υπάρξει υπερχείλιση (9ο bit).</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>• Λάθος: $1 + 1 = 2$. Σωστό: $1 + 1 = (10)_2$, δηλαδή γράφουμε 0 με κρατούμενο 1.<br>• Λάθος: $1 + 1 + 1 = 0$ ή $3$. Σωστό: $1 + 1 + 1 = (11)_2$, γράφουμε 1 με κρατούμενο 1.<br>• Ξεχνάμε να μειώσουμε τη στήλη από την οποία δανειστήκαμε.<br>• Γράφουμε το αποτέλεσμα με λιγότερα από 8 ψηφία όταν ζητείται 8-bit απάντηση.</p></div>
`,
  widget: "ia1add",
  gen: "ia1ar",
  exercises: [
    { level: 1, q: R`Να υπολογίσετε στο δυαδικό το άθροισμα $00001011 + 00000011$.`, fields: [{ label: "άθροισμα:", ans: ia1A("00001110"), text: true, nospace: true }],
      hint: R`Πρόσθεσε στήλη-στήλη από δεξιά ($1 + 1 = 0$ με κρατούμενο 1) και έλεγξε μετατρέποντας σε δεκαδικό.`, sol: R`${ia1Col(["00001011", "+ 00000011", "=", "00001110"])} Επαλήθευση: $11 + 3 = 14 = (00001110)_2$.` },
    { level: 1, q: R`Αν $Α = 00010110$ και $Β = 01001011$, να υπολογίσετε το $Α + Β$ (8 bits).`, fields: [{ label: "Α + Β =", ans: ia1A("01100001"), text: true, nospace: true }],
      hint: R`Πρόσθεσε στήλη-στήλη από δεξιά, προσέχοντας τα κρατούμενα· έλεγξε με μετατροπή σε δεκαδικό.`, sol: R`${ia1Col(["00010110", "+ 01001011", "=", "01100001"])} $22 + 75 = 97 = (01100001)_2$.` },
    { level: 1, type: "mc", q: R`Στο δυαδικό σύστημα, $1 + 1 =$`, options: ["0 με κρατούμενο 1", "2", "1 με κρατούμενο 1", "1 χωρίς κρατούμενο"], correct: 0,
      hint: R`$1 + 1 = (10)_2$.`, sol: R`$1 + 1 = 2 = (10)_2$: γράφουμε 0 και μεταφέρουμε κρατούμενο 1 στην επόμενη στήλη.` },
    { level: 2, q: R`Αν $Β = 01001011$ και $C = 00101100$, να υπολογίσετε τα $Β + C$ και $Β - C$ (8 bits).`, fields: [{ label: "B + C =", ans: ia1A("01110111"), text: true, nospace: true }, { label: "B − C =", ans: ia1A("00011111"), text: true, nospace: true }],
      hint: R`$Β = 75$, $C = 44$.`, sol: R`${ia1Col(["01001011", "+ 00101100", "=", "01110111"], "75 + 44 = 119")}${ia1Col(["01001011", "− 00101100", "=", "00011111"], "75 − 44 = 31")}` },
    { level: 2, q: R`Αν $Α = 00010110$ και $C = 00101100$, να υπολογίσετε το $C - Α$ (8 bits).`, fields: [{ label: "C − A =", ans: ia1A("00010110"), text: true, nospace: true }],
      hint: R`$44 - 22$.`, sol: R`${ia1Col(["00101100", "− 00010110", "=", "00010110"], "44 − 22 = 22")} Παρατηρούμε ότι $C = 2Α$, άρα $C - Α = Α$.` },
    { level: 2, q: R`Να υπολογίσετε στο δυαδικό τη διαφορά $10000001 - 00011101$.`, fields: [{ label: "διαφορά:", ans: ia1A("01100100"), text: true, nospace: true }],
      hint: R`$129 - 29$.`, sol: R`${ia1Col(["10000001", "− 00011101", "=", "01100100"])} $129 - 29 = 100 = (01100100)_2$.` },
    { level: 2, type: "mc", q: R`Η πρόσθεση $11101111 + 11111111$ σε καταχωρητή 8 bits προκαλεί υπερχείλιση.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`$239 + 255 > 255$;`, sol: R`Σωστό: $239 + 255 = 494 = (111101110)_2$, χρειάζεται 9ο bit. Τα 8 χαμηλότερα bits είναι $11101110$ και το 1 «χάνεται» — υπερχείλιση.` },
    { level: 3, q: R`<i>(Παγκύπριες)</i> Δίνονται οι δυαδικοί αριθμοί $Α = 10101010$ και $Β = 01000111$. Να υπολογίσετε και να γράψετε στο δυαδικό το αποτέλεσμα της πρόσθεσης $Α + Β$ και την τιμή του στο δεκαδικό.`,
      fields: [{ label: "Α + Β =", ans: ia1A("11110001"), text: true, nospace: true }, { label: "στο δεκαδικό:", ans: 241 }],
      hint: R`$Α = 170$, $Β = 71$.`, sol: R`${ia1Col(["10101010", "+ 01000111", "=", "11110001"])} $170 + 71 = 241 = (11110001)_2$.` },
    { level: 3, q: R`Πόσα κρατούμενα (άσσοι που μεταφέρονται σε επόμενη στήλη) δημιουργούνται στην πρόσθεση $00001111 + 00000001$; Ποιο είναι το αποτέλεσμα;`,
      fields: [{ label: "κρατούμενα:", ans: 4 }, { label: "αποτέλεσμα:", ans: ia1A("00010000"), text: true, nospace: true }],
      hint: R`Κάθε στήλη $1 + 1$ ή $1 + 1(\text{κρατ.})$ δίνει νέο κρατούμενο.`, sol: R`Στήλη $2^0$: $1 + 1 = 0$, κρατ. 1. Στήλες $2^1, 2^2, 2^3$: $1 + 0 + 1 = 0$, κρατ. 1. Στη στήλη $2^4$: $0 + 0 + 1 = 1$. Άρα 4 κρατούμενα και αποτέλεσμα $00010000 = 16$.` }
  ]
},
/* ───────────────────────────── 1.5 ───────────────────────────── */
{
  id: "1.5", unit: 1, title: "Συμπλήρωμα ως προς 1 και ως προς 2 – αφαίρεση με συμπληρώματα",
  book: "Βιβλίο Γ΄ Λυκείου: Γ1.1 §2 Συμπληρώματα, παραδείγματα 1.5–1.6, αφαίρεση με συμπλήρωμα (σ. 14–17)",
  intro: "Πώς βρίσκουμε το συμπλήρωμα ως προς 1 και ως προς 2 ενός δυαδικού αριθμού και πώς ο υπολογιστής κάνει αφαίρεση με πρόσθεση;",
  thumb: ICON("~x+1", "purple"),
  theory: R`
<p>Τα <b>συμπληρώματα</b> (complements) χρησιμοποιούνται στους υπολογιστές για την απλοποίηση της πράξης της <b>αφαίρεσης</b> και για λογικές πράξεις: με αυτά η αφαίρεση γίνεται με τον ίδιο αθροιστή που κάνει την πρόσθεση. Για κάθε σύστημα αρίθμησης υπάρχουν δύο τύποι: το συμπλήρωμα ως προς τη βάση και ως προς τη μειωμένη κατά 1 βάση. Στο δυαδικό έχουμε το <b>συμπλήρωμα ως προς 2</b> και το <b>συμπλήρωμα ως προς 1</b>.</p>
<div class="tbox def"><h4>Συμπλήρωμα ως προς 1</h4>
<p>Το συμπλήρωμα ως προς 1 ενός δυαδικού αριθμού $N$ με $k$ ψηφία είναι $(2^k - 1) - N$. Π.χ. για $N = 101$: $2^3 - 1 = 111$, άρα $111 - 101 = 010$.</p>
<div class="fbox">Πρακτικά: <b>αντιστρέφουμε κάθε ψηφίο</b> — τα 1 γίνονται 0 και τα 0 γίνονται 1.</div>
<p>Παραδείγματα (8 bits): $00011001 \to 11100110$ · $11010000 \to 00101111$ · $10101010 \to 01010101$ · $00111100 \to 11000011$.</p></div>
<div class="tbox def"><h4>Συμπλήρωμα ως προς 2</h4>
<p>Το συμπλήρωμα ως προς 2 ενός δυαδικού $N$ με $k$ ψηφία είναι $2^k - N$ για $N \neq 0$ (και $0$ για $N = 0$). Π.χ. για $N = 10100$: $2^5 = 100000$, άρα $100000 - 10100 = 01100$. Ισοδύναμα: <b>συμπλήρωμα ως προς 1 συν 1</b>.</p>
<div class="fbox">Πρακτικός κανόνας: ξεκινώντας από δεξιά, <b>αφήνουμε αναλλοίωτα</b> όλα τα μηδενικά <b>και τον πρώτο άσσο</b>, και <b>αντιστρέφουμε</b> όλα τα υπόλοιπα ψηφία (αριστερά του).</div>
<p>Παραδείγματα (8 bits): $00011001 \to 11100111$ · $11010000 \to 00110000$ · $10101010 \to 01010110$ · $00111100 \to 11000100$.</p></div>
<div class="tbox ex"><h4>Αφαίρεση $X - Y$ με συμπλήρωμα ως προς 2</h4>
<p>$X = 01010100\ (84)$, $Y = 01000011\ (67)$. (α) Συμπλήρωμα ως προς 2 του αφαιρετέου $Y$: $10111101$. (β) Προσθέτουμε: (γ) αγνοούμε την υπερχείλιση του τελευταίου ψηφίου.</p>
${ia1Col(["01010100", "+ 10111101", "=", "1 00010001"], "αγνοούμε το 9ο bit")}
<p>Αποτέλεσμα $00010001 = 17 = 84 - 67$ ✓.</p></div>
<div class="tbox ex"><h4>Αφαίρεση $X - Y$ με συμπλήρωμα ως προς 1</h4>
<p>(α) Συμπλήρωμα ως προς 1 του $Y$: $10111100$. (β) Προσθέτουμε. (γ) Αγνοούμε την υπερχείλιση. (δ) <b>Προσθέτουμε 1</b> στο αποτέλεσμα.</p>
${ia1Col(["01010100", "+ 10111100", "=", "1 00010000"], "(β)–(γ)")}${ia1Col(["00010000", "+ 00000001", "=", "00010001"], "(δ) +1")}</div>
<div class="tbox ex"><h4>Όταν ο αφαιρετέος είναι μεγαλύτερος: $Y - X$</h4>
<p><b>Με συμπλήρωμα ως προς 2:</b> συμπλήρωμα του $X$: $10101100$· $Y + 10101100 = 11101111$ — <b>δεν</b> υπάρχει υπερχείλιση, άρα το αποτέλεσμα είναι <b>αρνητικό</b>: βάζουμε μπροστά το πρόσημο $-$ και παίρνουμε το συμπλήρωμα ως προς 2 του αποτελέσματος: $11101111 \to -00010001\ (= -17)$.</p>
<p><b>Με συμπλήρωμα ως προς 1:</b> συμπλήρωμα του $X$: $10101011$· $Y + 10101011 = 11101110$ → πρόσημο $-$ και συμπλήρωμα ως προς 1: $-00010001$.</p>
${ia1Col(["01000011", "+ 10101100", "=", "11101111"], "Y − X με συμπλ. ως προς 2")}${ia1Col(["01000011", "+ 10101011", "=", "11101110"], "Υ − Χ με συμπλ. ως προς 1")}</div>
<div class="tbox rem"><h4>Ειδικές περιπτώσεις</h4><p>$00000000$: συμπλήρωμα ως προς 1 $= 11111111$, ως προς 2 $= 00000000$. $11111111$: ως προς 1 $= 00000000$, ως προς 2 $= 00000001$. Το συμπλήρωμα του συμπληρώματος δίνει πάντα τον αρχικό αριθμό.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>• Στο συμπλήρωμα ως προς 2 αντιστρέφουμε και τον πρώτο άσσο από δεξιά (λάθος!).<br>• Παίρνουμε το συμπλήρωμα του <i>μειωτέου</i> $X$ αντί του <i>αφαιρετέου</i> $Y$.<br>• Με συμπλήρωμα ως προς 1 ξεχνάμε το βήμα (δ): «+1» μετά την απόρριψη της υπερχείλισης.<br>• Δουλεύουμε με διαφορετικό πλήθος bits στους δύο αριθμούς — πρώτα τους φέρνουμε στο ίδιο μήκος (π.χ. 8 bits).</p></div>
`,
  widget: "ia1comp",
  gen: "ia1cp",
  exercises: [
    { level: 1, q: R`Να υπολογίσετε τα συμπληρώματα ως προς 1 και ως προς 2 του δυαδικού αριθμού $00110010$.`, fields: [{ label: "ως προς 1:", ans: "11001101", text: true, nospace: true }, { label: "ως προς 2:", ans: "11001110", text: true, nospace: true }],
      hint: R`Ως προς 1: αντιστροφή όλων. Ως προς 2: κράτα από δεξιά το 0 και τον πρώτο άσσο.`, sol: R`Ως προς 1: $11001101$. Ως προς 2: τα δύο δεξιότερα ψηφία «10» μένουν ίδια, τα υπόλοιπα αντιστρέφονται: $11001110$ ($= 11001101 + 1$).` },
    { level: 1, q: R`Να υπολογίσετε τα συμπληρώματα ως προς 1 και ως προς 2 του $10001000$.`, fields: [{ label: "ως προς 1:", ans: "01110111", text: true, nospace: true }, { label: "ως προς 2:", ans: "01111000", text: true, nospace: true }],
      hint: R`Από δεξιά: «1000» μένει ίδιο στο συμπλήρωμα ως προς 2.`, sol: R`Ως προς 1: $01110111$. Ως προς 2: κρατάμε «1000», αντιστρέφουμε «1000» → «0111»: $01111000$.` },
    { level: 1, type: "mc", q: R`Το συμπλήρωμα ως προς 1 ενός δυαδικού αριθμού προκύπτει αν αντιστρέψουμε όλα τα ψηφία του (0 ↔ 1).`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`$(2^k - 1) - N$: αφαίρεση κάθε ψηφίου από το 1.`, sol: R`Σωστό: $1 - 0 = 1$ και $1 - 1 = 0$, άρα κάθε ψηφίο αντιστρέφεται.` },
    { level: 1, q: R`<i>(Παγκύπριες)</i> Να γράψετε το συμπλήρωμα ως προς 2 του δυαδικού αριθμού $Γ = 01010011$.`, fields: [{ label: "συμπλ. ως προς 2:", ans: "10101101", text: true, nospace: true }],
      hint: R`Ο δεξιότερος άσσος είναι το τελευταίο ψηφίο.`, sol: R`Από δεξιά ο πρώτος άσσος είναι το τελευταίο ψηφίο: μένει ίδιο, τα υπόλοιπα 7 αντιστρέφονται: $0101001\,1 \to 1010110\,1$. Άρα $10101101$.` },
    { level: 2, q: R`<i>(Παγκύπριες)</i> Δίνονται οι δυαδικοί αριθμοί $Α = 10101010$ και $Β = 01000111$. Να γράψετε το συμπλήρωμα ως προς 2 του αριθμού $Α$ και του αριθμού $Β$.`,
      fields: [{ label: "συμπλ. Α:", ans: "01010110", text: true, nospace: true }, { label: "συμπλ. Β:", ans: "10111001", text: true, nospace: true }],
      hint: R`Για κάθε αριθμό: από δεξιά κράτα τα μηδενικά και τον πρώτο άσσο, αντίστρεψε τα υπόλοιπα.`,
      sol: R`$Α = 101010\,10$: μένει ίδιο το «10», αντιστρέφεται το «101010» → $01010110$ ($= 256 - 170 = 86$). $Β = 0100011\,1$: μένει ίδιο το τελευταίο «1», αντιστρέφονται τα υπόλοιπα → $10111001$ ($= 256 - 71 = 185$).` },
    { level: 2, q: R`Να υπολογίσετε τα συμπληρώματα ως προς 1 και ως προς 2 των $00000000$ και $11111111$.`, fields: [{ label: "00000000 ως προς 1:", ans: "11111111", text: true, nospace: true }, { label: "00000000 ως προς 2:", ans: "00000000", text: true, nospace: true }, { label: "11111111 ως προς 1:", ans: "00000000", text: true, nospace: true }, { label: "11111111 ως προς 2:", ans: "00000001", text: true, nospace: true }],
      hint: R`Για $N = 0$ το συμπλήρωμα ως προς 2 ορίζεται ίσο με 0.`, sol: R`$00000000$: ως προς 1 $11111111$, ως προς 2 $00000000$ (ορισμός για $N = 0$· και $11111111 + 1$ δίνει $1\,00000000$, όπου αγνοούμε το 9ο bit). $11111111$: ως προς 1 $00000000$, ως προς 2 $00000001$.` },
    { level: 2, q: R`Να υπολογίσετε τη διαφορά $X - Y$ με τη μέθοδο του <b>συμπληρώματος ως προς 2</b>, όπου $X = 01100100$, $Y = 00101000$. Γράψτε το συμπλήρωμα του $Y$ και το τελικό αποτέλεσμα (8 bits).`,
      fields: [{ label: "συμπλ. Υ:", ans: "11011000", text: true, nospace: true }, { label: "Χ − Υ =", ans: "00111100", text: true, nospace: true }],
      hint: R`Πρόσθεσε $X$ + συμπλήρωμα $Y$ και αγνόησε το 9ο bit.`, sol: R`Συμπλήρωμα ως προς 2 του $Y$: $11011000$. ${ia1Col(["01100100", "+ 11011000", "=", "1 00111100"])} Αγνοούμε την υπερχείλιση: $00111100 = 60 = 100 - 40$ ✓.` },
    { level: 2, type: "mc", q: R`Στην αφαίρεση $X - Y$ με συμπλήρωμα ως προς 1 (με $X > Y$), μετά την πρόσθεση του $X$ με το συμπλήρωμα του $Y$ και την απόρριψη της υπερχείλισης:`,
      options: ["προσθέτουμε 1 στο αποτέλεσμα", "αφαιρούμε 1 από το αποτέλεσμα", "παίρνουμε το συμπλήρωμα του αποτελέσματος", "δεν κάνουμε τίποτε άλλο"], correct: 0,
      hint: R`Το συμπλήρωμα ως προς 1 είναι κατά 1 μικρότερο από το συμπλήρωμα ως προς 2.`, sol: R`Επειδή $\overline{Y}^{(1)} = 2^k - 1 - Y$, το άθροισμα είναι κατά 1 μικρότερο απ’ ό,τι με συμπλήρωμα ως προς 2· γι’ αυτό, μετά την απόρριψη της υπερχείλισης, <b>προσθέτουμε 1</b>.` },
    { level: 3, q: R`Να υπολογίσετε την $Y - X$ με συμπλήρωμα ως προς 2, όπου $X = 01010100$ και $Y = 01000011$. Γράψτε το άθροισμα $Y + \overline{X}$ (8 bits) και το τελικό αποτέλεσμα στη μορφή $-bbbbbbbb$.`,
      fields: [{ label: "Υ + συμπλ. Χ:", ans: "11101111", text: true, nospace: true }, { label: "Υ − Χ =", ans: ["-00010001", "−00010001", "-10001", "−10001"], text: true, nospace: true }],
      hint: R`Δεν προκύπτει υπερχείλιση → το αποτέλεσμα είναι αρνητικό.`, sol: R`Συμπλήρωμα ως προς 2 του $X$: $10101100$. ${ia1Col(["01000011", "+ 10101100", "=", "11101111"])} Χωρίς υπερχείλιση → αρνητικό. Συμπλήρωμα ως προς 2 του $11101111$: $00010001$. Άρα $Y - X = -00010001 = -17$ ($67 - 84$ ✓).` },
    { level: 3, q: R`<i>(Αντιστοίχιση του βιβλίου)</i> Οι παρακάτω αριθμοί είναι σε αναπαράσταση συμπληρώματος ως προς 2 (8 bits). Να γράψετε τη δεκαδική τιμή καθενός: $01100011$, $01111111$, $00001000$, $01101111$, $00001110$.`,
      fields: [{ label: "01100011:", ans: 99 }, { label: "01111111:", ans: 127 }, { label: "00001000:", ans: 8 }, { label: "01101111:", ans: 111 }, { label: "00001110:", ans: 14 }],
      hint: R`Όλοι αρχίζουν με 0, άρα είναι θετικοί: η αναπαράσταση ενός θετικού αριθμού δεν αλλάζει.`, sol: R`Αρχικό bit 0 → θετικοί, η τιμή βρίσκεται κανονικά: $64 + 32 + 2 + 1 = 99$, $127$, $8$, $64 + 32 + 8 + 4 + 2 + 1 = 111$, $8 + 4 + 2 = 14$.` },
    { level: 3, q: R`Να υπολογίσετε τη διαφορά $Β - C$ με τη μέθοδο του <b>συμπληρώματος ως προς 1</b>, όπου $Β = 01001011$ και $C = 00101100$. Γράψτε το συμπλήρωμα του $C$, το άθροισμα μετά την απόρριψη της υπερχείλισης και το τελικό αποτέλεσμα.`,
      fields: [{ label: "συμπλ. C:", ans: "11010011", text: true, nospace: true }, { label: "άθροισμα (8 bits):", ans: "00011110", text: true, nospace: true }, { label: "Β − C =", ans: "00011111", text: true, nospace: true }],
      hint: R`(α) αντιστροφή του C, (β) πρόσθεση, (γ) απόρριψη 9ου bit, (δ) +1.`, sol: R`(α) $\overline C = 11010011$. ${ia1Col(["01001011", "+ 11010011", "=", "1 00011110"], "(β)")}${ia1Col(["00011110", "+ 00000001", "=", "00011111"], "(δ)")} $75 - 44 = 31 = (00011111)_2$ ✓.` }
  ]
},
/* ───────────────────────────── 1.6 ───────────────────────────── */
{
  id: "1.6", unit: 1, title: "Δυαδικοί αριθμοί με πρόσημο: προσημασμένο μέτρο και συμπλήρωμα ως προς 2",
  book: "Βιβλίο Γ΄ Λυκείου: Γ1.1 §3 Δυαδικοί αριθμοί με πρόσημο (σ. 17)",
  intro: "Πώς παριστάνει ο υπολογιστής αρνητικούς αριθμούς, όπως το −3, με 8 bits; Προσημασμένο μέτρο ή προσημασμένο συμπλήρωμα;",
  thumb: ICON("-3", "red"),
  theory: R`
<p>Οι θετικοί ακέραιοι γράφονται στο δυαδικό χωρίς πρόσημο. Για τους <b>αρνητικούς δυαδικούς αριθμούς</b> χρειαζόμαστε έναν κοινό συμβολισμό, αφού ο υπολογιστής δεν έχει «σύμβολο μείον» — μόνο 0 και 1. Υπάρχουν δύο βασικοί τρόποι: η <b>παράσταση προσημασμένου μέτρου</b> και η <b>παράσταση προσημασμένου συμπληρώματος</b> (ως προς 1 ή ως προς 2).</p>
<div class="tbox def"><h4>Παράσταση προσημασμένου μέτρου (signed-magnitude)</h4>
<p>Το πρώτο ψηφίο από αριστερά είναι το <b>ψηφίο προσήμου</b>: <b>0 για +</b>, <b>1 για −</b>. Τα υπόλοιπα ψηφία δίνουν το <b>μέτρο</b> (απόλυτη τιμή) του αριθμού.</p>
<p>$(00000011)_2 = (+3)_{10}$ και $(10000011)_2 = (-3)_{10}$.</p></div>
<div class="tbox def"><h4>Παράσταση προσημασμένου συμπληρώματος (signed-complement)</h4>
<p>Ο αρνητικός αριθμός $-N$ παριστάνεται με το <b>συμπλήρωμα</b> του $N$ (ως προς 1 ή ως προς 2). Συνήθως —και σε όλους τους σύγχρονους υπολογιστές— χρησιμοποιείται το <b>συμπλήρωμα ως προς 2</b>. Οι <b>θετικοί</b> αριθμοί <b>δεν αλλάζουν</b>.</p>
${ia1Tbl(["Αριθμός", "Προσημ. μέτρο", "Συμπλ. ως προς 1", "Συμπλ. ως προς 2"], [["+3", "00000011", "00000011", "00000011"], ["−3", "10000011", "11111100", "11111101"], ["−18", "10010010", "11101101", "11101110"], ["−1", "10000001", "11111110", "11111111"]])}
<p>Και στις τρεις παραστάσεις το αριστερότερο bit είναι 1 για τους αρνητικούς και 0 για τους θετικούς.</p></div>
<div class="tbox rem"><h4>Σημείωση για το βιβλίο</h4><p>Στο βιβλίο (σ. 17) η αναπαράσταση του $-3$ σε συμπλήρωμα ως προς 2 τυπώθηκε με 9 ψηφία («111111101»). Σε 8 bits η σωστή γραφή είναι $11111101$ $(= 11111100 + 1)$.</p></div>
<div class="tbox rem"><h4>Εμβάθυνση (εκτός βιβλίου): εύρος τιμών με n bits</h4>
${ia1Tbl(["Παράσταση", "Εύρος", "8 bits"], [["χωρίς πρόσημο", "$0$ έως $2^n - 1$", "0 … 255"], ["προσημασμένο μέτρο", "$-(2^{n-1} - 1)$ έως $2^{n-1} - 1$", "−127 … +127"], ["συμπλήρωμα ως προς 1", "$-(2^{n-1} - 1)$ έως $2^{n-1} - 1$", "−127 … +127"], ["συμπλήρωμα ως προς 2", "$-2^{n-1}$ έως $2^{n-1} - 1$", "−128 … +127"]])}
<p>Το προσημασμένο μέτρο και το συμπλήρωμα ως προς 1 έχουν <b>δύο μηδενικά</b> ($+0$ και $-0$, π.χ. $00000000$ και $10000000$ στο προσημασμένο μέτρο). Το συμπλήρωμα ως προς 2 έχει <b>ένα</b> μηδέν, γι’ αυτό «κερδίζει» μία τιμή: το $10000000 = -128$.</p></div>
<div class="tbox ex"><h4>Από τη δυαδική μορφή στην τιμή (συμπλήρωμα ως προς 2)</h4>
<p>Αν το αριστερότερο bit είναι 0, ο αριθμός είναι θετικός και διαβάζεται κανονικά. Αν είναι 1, ο αριθμός είναι αρνητικός: παίρνουμε το συμπλήρωμα ως προς 2 για να βρούμε το μέτρο.</p>
<details class="steps"><summary>Ποιον αριθμό παριστάνει το $11101110$ σε κάθε παράσταση;</summary>
<p><b>Προσημασμένο μέτρο:</b> πρόσημο 1 (−), μέτρο $1101110 = 110$ → $-110$.<br><b>Συμπλήρωμα ως προς 1:</b> αντιστροφή → $00010001 = 17$ → $-17$.<br><b>Συμπλήρωμα ως προς 2:</b> συμπλήρωμα ως προς 2 → $00010010 = 18$ → $-18$.<br><b>Χωρίς πρόσημο:</b> $238$.</p></details></div>
<div class="tbox rem"><h4>Εμβάθυνση (εκτός βιβλίου): υπερχείλιση σε πράξεις με πρόσημο</h4><p>Στο συμπλήρωμα ως προς 2, αν προσθέσουμε δύο αριθμούς με <b>ίδιο πρόσημο</b> και το αποτέλεσμα βγει με <b>διαφορετικό πρόσημο</b>, έχουμε υπερχείλιση: π.χ. $01100100 + 01000000 = 10100100$ ($100 + 64 = 164 > 127$, το αποτέλεσμα «φαίνεται» $-92$). Το κρατούμενο από το 8ο bit απλώς αγνοείται.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>• Αλλάζουμε και τους θετικούς αριθμούς σε συμπλήρωμα — οι θετικοί μένουν ως έχουν.<br>• Στο προσημασμένο μέτρο αντιστρέφουμε τα bits του μέτρου: αλλάζει <b>μόνο</b> το πρώτο bit.<br>• Θεωρούμε ότι με 8 bits σε συμπλήρωμα ως προς 2 φτάνουμε μέχρι $+128$: το μέγιστο είναι $+127$, το ελάχιστο $-128$.</p></div>
`,
  widget: "ia1sign",
  gen: "ia1sg",
  exercises: [
    { level: 1, q: R`Να γράψετε τον αριθμό $-3$ σε 8 bits στην παράσταση <b>προσημασμένου μέτρου</b>.`, fields: [{ label: "−3 =", ans: "10000011", text: true, nospace: true }],
      hint: R`Πρώτο bit 1 (−), τα υπόλοιπα 7 το μέτρο 3.`, sol: R`Πρόσημο 1, μέτρο $3 = 0000011$ (7 bits): $10000011$.` },
    { level: 1, q: R`Να γράψετε τον αριθμό $-3$ σε 8 bits σε παράσταση συμπληρώματος ως προς 1 και ως προς 2.`, fields: [{ label: "ως προς 1:", ans: "11111100", text: true, nospace: true }, { label: "ως προς 2:", ans: "11111101", text: true, nospace: true }],
      hint: R`Ξεκίνα από $+3 = 00000011$.`, sol: R`$+3 = 00000011$. Συμπλήρωμα ως προς 1: $11111100$. Ως προς 2: $11111100 + 1 = 11111101$.` },
    { level: 1, type: "mc", q: R`Στην παράσταση προσημασμένου συμπληρώματος, οι θετικοί αριθμοί παριστάνονται όπως και χωρίς πρόσημο (π.χ. $+3 = 00000011$).`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Το συμπλήρωμα εφαρμόζεται μόνο στους αρνητικούς.`, sol: R`Σωστό: οι θετικοί δεν αλλάζουν· έχουν πρώτο bit 0.` },
    { level: 2, q: R`Να γράψετε τον αριθμό $-18$ σε 8 bits στις τρεις παραστάσεις.`, fields: [{ label: "προσημ. μέτρο:", ans: "10010010", text: true, nospace: true }, { label: "συμπλ. ως προς 1:", ans: "11101101", text: true, nospace: true }, { label: "συμπλ. ως προς 2:", ans: "11101110", text: true, nospace: true }],
      hint: R`$18 = 00010010$.`, sol: R`$+18 = 00010010$. Προσημασμένο μέτρο: $10010010$. Ως προς 1: $11101101$. Ως προς 2: $11101110$.` },
    { level: 3, type: "mc", q: R`<i>(Εμβάθυνση — εκτός βιβλίου)</i> Ποιο είναι το εύρος των ακεραίων που παριστάνονται με 8 bits σε συμπλήρωμα ως προς 2;`, options: ["−128 έως +127", "−127 έως +127", "0 έως 255", "−128 έως +128"], correct: 0,
      hint: R`$-2^{n-1}$ έως $2^{n-1} - 1$.`, sol: R`Για $n = 8$: από $-2^7 = -128$ έως $2^7 - 1 = 127$, συνολικά 256 τιμές.` },
    { level: 2, q: R`Ποια δεκαδική τιμή παριστάνει ο δυαδικός $11111111$ (8 bits) σε προσημασμένο μέτρο και σε συμπλήρωμα ως προς 2;`, fields: [{ label: "προσημ. μέτρο:", ans: -127 }, { label: "συμπλ. ως προς 2:", ans: -1 }],
      hint: R`Στο προσημασμένο μέτρο: πρόσημο + 7 bits μέτρου.`, sol: R`Προσημασμένο μέτρο: πρόσημο −, μέτρο $1111111 = 127$ → $-127$. Συμπλήρωμα ως προς 2: το συμπλήρωμα του $11111111$ είναι $00000001$, άρα $-1$.` },
    { level: 2, q: R`Ποια δεκαδική τιμή παριστάνει ο $11101110$ σε συμπλήρωμα ως προς 2 (8 bits);`, fields: [{ label: "τιμή =", ans: -18 }],
      hint: R`Αρχικό bit 1 → αρνητικός. Βρες το συμπλήρωμα ως προς 2 για το μέτρο.`, sol: R`Συμπλήρωμα ως προς 2 του $11101110$: $00010010 = 18$. Άρα $-18$.` },
    { shuffle: true, level: 3, type: "mc", q: R`<i>(Εμβάθυνση — εκτός βιβλίου)</i> Σε συμπλήρωμα ως προς 2 με 8 bits, το άθροισμα $01100100 + 01000000$ δίνει $10100100$. Τι συμβαίνει;`,
      options: ["Υπερχείλιση: το σωστό αποτέλεσμα 164 δεν χωρά στο εύρος −128…127", "Το αποτέλεσμα είναι σωστό και ίσο με −92", "Το αποτέλεσμα είναι σωστό και ίσο με 164", "Υπάρχει κρατούμενο από το 8ο bit που πρέπει να προστεθεί"], correct: 0,
      hint: R`Δύο θετικοί δίνουν «αρνητικό» αποτέλεσμα.`, sol: R`$100 + 64 = 164 > 127$. Δύο θετικοί (πρώτο bit 0) έδωσαν αποτέλεσμα με πρώτο bit 1: <b>υπερχείλιση</b>. Το $10100100$ θα διαβαζόταν $-92$, που είναι λάθος.` },
    { level: 3, q: R`<i>(Εμβάθυνση — εκτός βιβλίου)</i> Πόσα bits χρειάζονται τουλάχιστον για να παρασταθεί ο αριθμός $-100$ σε συμπλήρωμα ως προς 2, και ποια είναι η αναπαράσταση σε 8 bits;`,
      fields: [{ label: "bits:", ans: 8 }, { label: "−100 (8 bits):", ans: "10011100", text: true, nospace: true }],
      hint: R`Βρες το μικρότερο $n$ για το οποίο $-2^{n-1} \le -100$· μετά συμπλήρωμα ως προς 2 του $+100$.`, sol: R`Με $n$ bits: $-2^{n-1} \le -100 \Rightarrow 2^{n-1} \ge 100 \Rightarrow n - 1 \ge 7$, άρα $n = 8$. $100 = 01100100$ → ως προς 1: $10011011$ → +1: $10011100$.` },
    { level: 3, type: "mc", q: R`<i>(Εμβάθυνση — εκτός βιβλίου)</i> Ποια παράσταση έχει δύο διαφορετικές μορφές για το μηδέν (+0 και −0);`,
      options: ["Το προσημασμένο μέτρο", "Το συμπλήρωμα ως προς 2", "Η παράσταση χωρίς πρόσημο", "Καμία παράσταση"], correct: 0,
      hint: R`Σκέψου τα $00000000$ και $10000000$.`, sol: R`Στο προσημασμένο μέτρο τα $00000000$ (+0) και $10000000$ (−0) παριστάνουν και τα δύο το μηδέν (το ίδιο ισχύει στο συμπλήρωμα ως προς 1 με $11111111$). Στο συμπλήρωμα ως προς 2 το μηδέν είναι μόνο ένα.` }
  ]
},
/* ───────────────────────────── 2.1 ───────────────────────────── */
{
  id: "2.1", unit: 2, title: "Άλγεβρα Boole: ορισμός, αξιώματα Huntington και αρχή του δυϊσμού",
  book: "Βιβλίο Γ΄ Λυκείου: Γ2.1 §1–5 Άλγεβρα Boole, αξιώματα, δυϊσμός, λογική έκφραση (σ. 23–27)",
  intro: "Τι είναι η άλγεβρα Boole, ποια είναι τα αξιώματα του Huntington και πώς βρίσκουμε τη δυϊκή μιας λογικής έκφρασης;",
  thumb: ICON("Boole", "purple"),
  theory: R`
<p>Η <b>άλγεβρα Boole</b> είναι το μαθηματικό εργαλείο με το οποίο περιγράφουμε, αναλύουμε και σχεδιάζουμε κάθε ψηφιακό κύκλωμα. Κάθε <b>λογική πύλη</b> ενός υπολογιστή αντιστοιχεί σε μια πράξη της άλγεβρας Boole, οπότε μπορούμε να «γράψουμε» ένα κύκλωμα ως <b>λογική έκφραση</b>, να την απλοποιήσουμε με κανόνες και να πάρουμε ένα μικρότερο και φθηνότερο κύκλωμα. Στις Παγκύπριες Εξετάσεις Πληροφορικής ζητείται να υπολογίζουμε τιμές λογικών εκφράσεων, να αναγνωρίζουμε τα <b>αξιώματα του Huntington</b> και να εφαρμόζουμε την <b>αρχή του δυϊσμού</b>.</p>
<div class="tbox def"><h4>Άλγεβρα Boole (θεμελίωση Huntington)</h4>
<p>Γενικά, μια αλγεβρική δομή περιέχει (α) ένα <b>σύνολο στοιχείων</b>, (β) ένα σύνολο <b>πράξεων</b> και (γ) ένα σύνολο <b>αξιωμάτων</b>, δηλαδή βασικών παραδοχών από τις οποίες αποδεικνύονται όλες οι υπόλοιπες ιδιότητες (τα <b>θεωρήματα</b>). Σύμφωνα με τον Huntington, η άλγεβρα Boole είναι η αλγεβρική δομή</p>
<div class="fbox">$$\mathcal{A} = \{\, A,\ +,\ *,\ ',\ 0,\ 1 \,\}$$</div>
<ul><li>$A$: σύνολο με <b>τουλάχιστον δύο</b> στοιχεία (στα κυκλώματα $A = \{0, 1\}$),</li>
<li>$+$: <b>λογικό άθροισμα</b> (OR), &nbsp; $*$: <b>λογικό γινόμενο</b> (AND), &nbsp; $'$: <b>λογική αντιστροφή</b> (NOT),</li>
<li>$0$ και $1$: οι <b>σταθερές</b> του συστήματος.</li></ul>
<p>Οι τρεις πράξεις ορίζονται από τον <b>πίνακα αλήθειας</b>:</p>
<table class="tbl ia2tt"><tr><th>a</th><th>b</th><th class="ia2o">a + b (OR)</th><th class="ia2o">a * b (AND)</th><th class="ia2o">a' (NOT)</th></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td></tr><tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr><tr><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td></tr><tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td></tr></table>
<p class="small muted">Το a + b είναι 1 όταν <i>τουλάχιστον ένα</i> είναι 1· το a * b είναι 1 μόνο όταν <i>και τα δύο</i> είναι 1· το a' είναι το αντίθετο του a. Αντί για a * b γράφουμε συχνά απλώς ab.</p></div>
<div class="tbox thm"><h4>Τα αξιώματα της άλγεβρας Boole (Huntington)</h4>
<table class="tbl"><tr><th></th><th>Αξίωμα</th><th>Όνομα</th></tr>
<tr><td><b>Α0</b></td><td>$a, b \in A$ με $a \ne b$</td><td>το $A$ έχει τουλάχιστον δύο στοιχεία</td></tr>
<tr><td><b>Α1</b></td><td>$a + b \in A,\quad a * b \in A$</td><td>κλειστότητα</td></tr>
<tr><td><b>Α2</b></td><td>$a + b = b + a,\quad a * b = b * a$</td><td>αντιμεταθετική ιδιότητα</td></tr>
<tr><td><b>Α3</b></td><td>$a + (b * c) = (a + b) * (a + c)$<br>$a * (b + c) = (a * b) + (a * c)$</td><td>επιμεριστική ιδιότητα</td></tr>
<tr><td><b>Α4</b></td><td>$a + 0 = a,\quad a * 1 = a$</td><td>ουδέτερα στοιχεία</td></tr>
<tr><td><b>Α5</b></td><td>$a + a' = 1,\quad a * a' = 0$</td><td>συμπλήρωμα</td></tr></table>
<p>Το $a'$ λέγεται <b>συμπλήρωμα</b> ή <b>αντίστροφο</b> του $a$ — <i>δεν</i> είναι «αντίθετο»: $a + a' = 1$, όχι $0$.</p></div>
<div class="tbox warn"><h4>Πού διαφέρει από την άλγεβρα των αριθμών</h4>
<ul><li><b>Δεν υπάρχουν αντίστροφες πράξεις</b> (αφαίρεση, διαίρεση): δεν «μεταφέρουμε» όρους από το ένα μέλος στο άλλο.</li>
<li><b>Το άθροισμα επιμερίζεται στο γινόμενο</b> (Α3): $a + bc = (a + b)(a + c)$ — κάτι που στους αριθμούς είναι λάθος!</li>
<li><b>Δεν υπάρχουν αντίθετα στοιχεία</b>: από $a + c = b + c$ <b>δεν</b> προκύπτει $a = b$ (π.χ. $a = 0,\ b = 1,\ c = 1$).</li></ul></div>
<div class="tbox def"><h4>Αρχή του δυϊσμού (duality)</h4>
<p>Μια σχέση Α λέγεται <b>δυϊκή</b> μιας σχέσης Β, αν προκύπτει από τη Β (α) με αμοιβαία εναλλαγή των πράξεων <b>$+$ και $*$</b> και (β) με αμοιβαία εναλλαγή των σταθερών <b>$0$ και $1$</b>. Οι μεταβλητές και οι τόνοι ($'$) μένουν ίδιοι.</p>
<p><b>Θεώρημα του δυϊσμού:</b> αν μια σχέση της άλγεβρας Boole είναι αληθής, τότε είναι αληθής και η δυϊκή της. Γι' αυτό τα αξιώματα Α2–Α5 εμφανίζονται σε ζεύγη: το ένα μέλος του ζεύγους είναι το δυϊκό του άλλου.</p>
<p>Π.χ. από το $a + 1 = 1$ προκύπτει $a * 0 = 0$ · από το $(a + a) * (b' + 1) = a$ προκύπτει $(a * a) + (b' * 0) = a$.</p></div>
<div class="tbox def"><h4>Λογική έκφραση και προτεραιότητα πράξεων</h4>
<p><b>Λογική έκφραση</b> (boolean expression) είναι μια παράσταση με λογικές μεταβλητές (που παίρνουν τιμές από το σύνολο $A$), σταθερές και λογικές πράξεις, π.χ. $F = a + (b + c)a + ab + (b + c)b$. Όταν υπολογίζουμε μια έκφραση ακολουθούμε την <b>προτεραιότητα</b>:</p>
<div class="fbox">παρενθέσεις &nbsp;→&nbsp; αντιστροφή ( ' ) &nbsp;→&nbsp; γινόμενο ( * ) &nbsp;→&nbsp; άθροισμα ( + )</div>
<p>Έτσι η $a * b + a * c$ σημαίνει $(a * b) + (a * c)$ και η $a + b * c$ σημαίνει $a + (b * c)$.</p></div>
<div class="tbox ex"><h4>Παράδειγμα 2.1 — τιμές εκφράσεων για a = 0, b = 1, c = 1</h4>
<details class="steps"><summary>Λύση βήμα-βήμα</summary>
<p>(α) $F = a + b * c = 0 + (1 * 1) = 0 + 1 = 1$ (προτεραιότητα, Α4).</p>
<p>(β) $F = (a + b) * (a + c) = a + (b * c)$ (Α3) $= 0 + (1 * 1) = 1$.</p>
<p>(γ) Για $F = (a + b) * c$ η δυϊκή είναι $F_d = (a * b) + c$. Τότε $F = (0 + 1) * 1 = 1$ και $F_d = (0 * 1) + 1 = 0 + 1 = 1$.</p>
<p class="small muted">Προσοχή στις παρενθέσεις στη δυϊκή: η $(a + b)*c$ γίνεται $(a * b) + c$ — το γινόμενο ab πρέπει να «δεθεί» πρώτο, όπως ήταν πρώτο και το άθροισμα στην αρχική.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>• Υπολογισμός από αριστερά προς τα δεξιά αγνοώντας ότι το $*$ προηγείται του $+$ (η $1 + 0 * 0$ είναι 1, όχι 0). • Στη δυϊκή αλλάζουμε και τους τόνους — <b>λάθος</b>, οι τόνοι μένουν. • Ξεχνάμε να αλλάξουμε τις σταθερές 0 ↔ 1. • Θεωρούμε ότι $1 + 1 = 10$ ή $2$: στην άλγεβρα Boole $1 + 1 = 1$.</p></div>
`,
  widget: "ia2expr",
  gen: "ia2gEval",
  exercises: [
    { level: 1, q: R`Να υπολογίσετε την τιμή της λογικής έκφρασης $F = a + b * c$ για $a = 0,\ b = 1,\ c = 0$.`, fields: [{ label: "F =", ans: 0 }],
      hint: R`Πρώτα το γινόμενο $b * c$, μετά το άθροισμα.`, sol: R`$F = 0 + (1 * 0) = 0 + 0 = 0$.` },
    { level: 1, q: R`Να υπολογίσετε την τιμή της $F = (a + b) * (a' + c)$ για $a = 1,\ b = 0,\ c = 1$.`, fields: [{ label: "F =", ans: 1 }],
      hint: R`Υπολόγισε κάθε παρένθεση χωριστά· $a' = 0$.`, sol: R`$F = (1 + 0) * (0 + 1) = 1 * 1 = 1$.` },
    { level: 2, q: R`Προσοχή στην προτεραιότητα: να υπολογίσετε την $F = a + b * c'$ για $a = 1,\ b = 0,\ c = 1$.`, fields: [{ label: "F =", ans: 1 }],
      hint: R`Το γινόμενο εκτελείται πριν από το άθροισμα: $F = a + (b * c')$.`, sol: R`$F = 1 + (0 * 0) = 1 + 0 = 1$. (Αν κάποιος υπολόγιζε λανθασμένα $(a + b) * c' = 1 * 0$ θα έβρισκε 0.)` },
    { level: 1, type: "mc", q: R`Ποιο αξίωμα της άλγεβρας Boole εκφράζει η σχέση $a + (b * c) = (a + b) * (a + c)$;`,
      options: [R`Α3 — επιμεριστική ιδιότητα`, R`Α2 — αντιμεταθετική ιδιότητα`, R`Α4 — ουδέτερα στοιχεία`, R`Α5 — συμπλήρωμα`], correct: 0,
      hint: R`Το άθροισμα «μοιράζεται» στους παράγοντες του γινομένου.`, sol: R`Είναι η <b>επιμεριστική ιδιότητα (Α3)</b> του αθροίσματος ως προς το γινόμενο, που δεν ισχύει στην άλγεβρα των αριθμών.` },
    { level: 1, type: "mc", q: R`Στην άλγεβρα Boole, αν $a + c = b + c$, τότε υποχρεωτικά $a = b$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Δοκίμασε $c = 1$.`, sol: R`<b>Λάθος.</b> Δεν υπάρχουν αντίθετα στοιχεία, άρα δεν μπορούμε να «απαλείψουμε» το $c$. Αντιπαράδειγμα: $a = 0,\ b = 1,\ c = 1$ δίνει $0 + 1 = 1 + 1 = 1$, όμως $a \ne b$.` },
    { level: 1, type: "mc", q: R`Η σχέση $a * a' = 0$ είναι μέρος του αξιώματος του συμπληρώματος (Α5).`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Α5: $a + a' = 1$ και ...`, sol: R`<b>Σωστό.</b> Α5: $a + a' = 1$ και $a * a' = 0$ — οι δύο σχέσεις είναι δυϊκές η μία της άλλης.` },
    { level: 2, type: "mc", q: R`Ποια είναι η δυϊκή της σχέσης $a + a'b = a + b$;`,
      options: [R`$a(a' + b) = ab$`, R`$a'(a + b') = a'b'$`, R`$a + a'b = ab$`, R`$a * (a' * b) = a * b$`], correct: 0,
      hint: R`Εφάρμοσε τον δυϊσμό σε κάθε μέλος χωριστά: εναλλαγή $+ \leftrightarrow *$ (και 0 ↔ 1)· οι τόνοι μένουν. Βάλε παρενθέσεις ώστε να διατηρηθεί η σειρά των πράξεων.`,
      sol: R`Με εναλλαγή των πράξεων: $a * (a' + b) = a * b$, δηλαδή $a(a' + b) = ab$. (Είναι και οι δύο μορφές του θεωρήματος Θ7.)` },
    { level: 2, q: R`Δίνεται η λογική έκφραση $F = a * b + c'$. Να γράψετε τη δυϊκή της $F_d$ και να υπολογίσετε τις τιμές $F$ και $F_d$ για $a = 0,\ b = 0,\ c = 0$.`,
      fields: [{ label: "F =", ans: 1 }, { label: "F<sub>d</sub> =", ans: 0 }],
      hint: R`Για τη δυϊκή εναλλάσσονται + και *· πρόσεξε ότι το γινόμενο $a * b$ πρέπει να γίνει άθροισμα μέσα σε παρένθεση.`, sol: R`$F = 0 * 0 + 0' = 0 + 1 = 1$.<br>$F_d = (a + b) * c' = (0 + 0) * 1 = 0 * 1 = 0$.<br>Η τιμή μιας έκφρασης και της δυϊκής της <b>δεν</b> είναι γενικά ίδια· ο δυϊσμός λέει ότι αν μια <i>ισότητα</i> ισχύει πάντα, ισχύει και η δυϊκή <i>ισότητα</i>.` },
    { level: 3, q: R`Για πόσους από τους 16 συνδυασμούς τιμών των $a, b, c, d$ η έκφραση $F = (a + b) * (c + d)'$ παίρνει την τιμή 1;`, fields: [{ label: "Πλήθος:", ans: 3 }],
      hint: R`Το γινόμενο είναι 1 μόνο αν και οι δύο παράγοντες είναι 1. Πότε είναι $(c + d)' = 1$;`,
      sol: R`$(c + d)' = 1$ μόνο για $c = d = 0$ (1 συνδυασμός των c, d). $a + b = 1$ σε 3 από τους 4 συνδυασμούς των a, b (όλους εκτός από $a = b = 0$). Άρα $3 \cdot 1 = 3$ συνδυασμοί.` },
    { level: 3, type: "mc", q: R`Ποια από τις πιο κάτω σχέσεις <b>δεν</b> ισχύει στην άλγεβρα Boole;`,
      options: [R`$a + a = 2a$`, R`$a + 1 = 1$`, R`$a * 0 = 0$`, R`$a + bc = (a + b)(a + c)$`], correct: 0,
      hint: R`Υπάρχει το στοιχείο 2 στο σύνολο $\{0, 1\}$;`, sol: R`Στην άλγεβρα Boole $a + a = a$ (Θ1) — δεν υπάρχει «2». Οι άλλες ισχύουν: $a + 1 = 1$ και η δυϊκή της $a * 0 = 0$ (Θ2), και η επιμεριστική Α3.` }
  ]
},
/* ───────────────────────────── 2.2 ───────────────────────────── */
{
  id: "2.2", unit: 2, title: "Θεωρήματα της άλγεβρας Boole, De Morgan και αλγεβρική απλοποίηση",
  book: "Βιβλίο Γ΄ Λυκείου: Γ2.1 §6 Βασικά θεωρήματα της άλγεβρας Boole, Παράδειγμα 2.2 (σ. 27–29)",
  intro: "Πώς απλοποιούμε μια λογική έκφραση με τα θεωρήματα της άλγεβρας Boole και τους νόμους του De Morgan;",
  thumb: ICON("(ab)'", "purple"),
  theory: R`
<p>Από τα αξιώματα του Huntington αποδεικνύονται τα <b>θεωρήματα της άλγεβρας Boole</b>. Με αυτά κάνουμε <b>αλγεβρική απλοποίηση</b>: μετατρέπουμε μια λογική έκφραση σε ισοδύναμη με λιγότερους όρους και μεταβλητές, άρα σε κύκλωμα με λιγότερες πύλες. Τα πιο σημαντικά είναι οι <b>νόμοι του De Morgan</b> (Θ6), η <b>απορρόφηση</b> (Θ3) και το Θ7. Κάθε θεώρημα εμφανίζεται σε δύο δυϊκές μορφές.</p>
<div class="tbox thm"><h4>Βασικά θεωρήματα Θ1–Θ7</h4>
<table class="tbl"><tr><th></th><th>Μορφή 1</th><th>Δυϊκή μορφή</th><th>Συνήθης ονομασία</th></tr>
<tr><td><b>Θ1</b></td><td>$a * a = a$</td><td>$a + a = a$</td><td>ταυτοδυναμία</td></tr>
<tr><td><b>Θ2</b></td><td>$a * 0 = 0$</td><td>$a + 1 = 1$</td><td>«απορροφητικά» στοιχεία</td></tr>
<tr><td><b>Θ3</b></td><td>$a + (a * b) = a$</td><td>$a * (a + b) = a$</td><td>απορρόφηση</td></tr>
<tr><td><b>Θ4</b></td><td>$(a + b) + c = a + (b + c)$</td><td>$(a * b) * c = a * (b * c)$</td><td>προσεταιριστική</td></tr>
<tr><td><b>Θ5</b></td><td colspan="2">$(a')' = a$</td><td>διπλή αντιστροφή</td></tr>
<tr><td><b>Θ6</b></td><td>$(a + b)' = a' * b'$</td><td>$(a * b)' = a' + b'$</td><td>νόμοι του De Morgan</td></tr>
<tr><td><b>Θ7</b></td><td>$a + a' * b = a + b$</td><td>$a * (a' + b) = a * b$</td><td></td></tr></table>
<p class="small muted">Οι αποδείξεις τους από τα αξιώματα Α0–Α5 δεν εξετάζονται· μπορούμε όμως να επαληθεύσουμε οποιοδήποτε θεώρημα με <b>πίνακα αλήθειας</b>.</p></div>
<div class="tbox def"><h4>Νόμοι του De Morgan</h4>
<div class="fbox">$$(a + b)' = a'\,b' \qquad\qquad (a\,b)' = a' + b'$$</div>
<p>«Σπάμε» τη γραμμή της αντιστροφής και <b>αλλάζουμε την πράξη</b>. Γενικεύονται σε περισσότερες μεταβλητές: $(a + b + c)' = a'b'c'$ και $(abcd)' = a' + b' + c' + d'$.</p>
<p><b>Απόδειξη με πίνακα αλήθειας</b> (Θ6, πρώτη μορφή): για κάθε γραμμή τα δύο μέλη έχουν την ίδια τιμή, άρα η σχέση ισχύει.</p>
${ia2TTable(["a", "b"], [["(a + b)'", ia2TT("(a+b)'", ["a", "b"])], ["a' * b'", ia2TT("a'b'", ["a", "b"])]])}</div>
<div class="tbox ex"><h4>Παράδειγμα 2.2 — απλοποιήσεις και αποδείξεις</h4>
<details class="steps"><summary>(α) Απλοποίηση της F = (x' + xyz') + (x' + xyz')(x + x'y'z)</summary>
<p>Θέτουμε $a = x' + xyz'$. Τότε $F = a + a(x + x'y'z) = a$ (Θ3, απορρόφηση). Άρα $F = x' + xyz'$ και με το Θ7 ($x' + x \cdot yz' = x' + yz'$):</p>
<div class="fbox">$$F = x' + yz'$$</div></details>
<details class="steps"><summary>(β) Απόδειξη ότι (abcd)' = a' + b' + c' + d'</summary>
<p>$a' + b' + c' + d' = (a' + b') + (c' + d') = (ab)' + (cd)'$ (Θ6) $= [(ab)(cd)]'$ (Θ6) $= (abcd)'$.</p></details>
<details class="steps"><summary>(γ) Απόδειξη ότι ab + a'c = ab + a'c + bc</summary>
<p>$ab + a'c = (ab + abc) + (a'c + a'bc)$ (Θ3) $= ab + a'c + abc + a'bc$ (Α2) $= ab + a'c + (a + a')bc$ (Α3) $= ab + a'c + 1 \cdot bc$ (Α5) $= ab + a'c + bc$ (Α4).</p></details>
<details class="steps"><summary>(δ) Συμπλήρωμα της F = xy + wxyz' + x'y</summary>
<p>$F' = [xy(1 + wz') + x'y]'$ (Α3) $= (xy + x'y)'$ (Θ2) $= [y(x + x')]'$ (Α3) $= (y \cdot 1)'$ (Α5) $= y'$ (Α4).</p></details></div>
<div class="tbox tip"><h4>Στρατηγική αλγεβρικής απλοποίησης</h4>
<ol><li>Βγάλε <b>κοινό παράγοντα</b> (Α3): $xyz + xyz' = xy(z + z')$.</li>
<li>Χρησιμοποίησε $a + a' = 1$, $aa' = 0$ (Α5) και μετά $a \cdot 1 = a$, $a + 0 = a$ (Α4).</li>
<li>Ψάξε <b>απορρόφηση</b>: όρος που «περιέχει» άλλον όρο του αθροίσματος φεύγει ($a + ab = a$).</li>
<li>Θ7: $a + a'b = a + b$ — το $a'$ «σβήνει» δίπλα στο $a$.</li>
<li>Για αντιστροφή σύνθετου όρου εφάρμοσε <b>De Morgan</b> και Θ5.</li>
<li><b>Έλεγχος</b>: σύγκρινε τους πίνακες αλήθειας της αρχικής και της τελικής έκφρασης.</li></ol></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>• $(ab)' = a'b'$ — <b>λάθος!</b> Το σωστό: $(ab)' = a' + b'$ (αλλάζει η πράξη). • $(a + b)' = a' + b'$ — επίσης λάθος· σωστό $a'b'$. • «Απαλοιφή» όρων όπως στους αριθμούς ($ab + ac = ab + ad \Rightarrow c = d$) — δεν επιτρέπεται. • Σε κάθε βήμα της απλοποίησης να αναφέρεις το αξίωμα/θεώρημα που χρησιμοποιήθηκε, όπως στο βιβλίο.</p></div>
`,
  widget: "ia2equiv",
  gen: "ia2gSimp",
  exercises: [
    { level: 1, type: "mc", q: R`Σύμφωνα με τον νόμο του De Morgan, η $(a + b)'$ είναι ίση με:`, options: [R`$a'b'$`, R`$a' + b'$`, R`$ab$`, R`$(ab)'$`], correct: 0,
      hint: R`«Σπάμε» τη γραμμή και αλλάζουμε την πράξη.`, sol: R`Θ6: $(a + b)' = a' * b' = a'b'$.` },
    { level: 1, type: "mc", q: R`Η έκφραση $a + ab$ απλοποιείται σε:`, options: [R`$a$`, R`$ab$`, R`$a + b$`, R`$b$`], correct: 0,
      hint: R`Θεώρημα απορρόφησης.`, sol: R`Θ3: $a + ab = a(1 + b) = a \cdot 1 = a$.` },
    { level: 1, type: "mc", q: R`Ποιο θεώρημα δικαιολογεί το βήμα $a + a'b = a + b$;`, options: [R`Θ7`, R`Θ3 (απορρόφηση)`, R`Θ6 (De Morgan)`, R`Θ1`], correct: 0,
      hint: R`Ποιο θεώρημα «σβήνει» το $a'$ δίπλα σε ένα $a$;`, sol: R`Είναι το <b>Θ7</b>: $a + a'b = a + b$ (δυϊκή μορφή: $a(a' + b) = ab$).` },
    { level: 1, type: "mc", q: R`Ισχύει ότι $(abcd)' = a'b'c'd'$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι αλλάζει ο De Morgan εκτός από τους τόνους;`, sol: R`<b>Λάθος.</b> Με De Morgan: $(abcd)' = a' + b' + c' + d'$ (το γινόμενο γίνεται άθροισμα).` },
    { level: 2, type: "mc", q: R`Να απλοποιήσετε την έκφραση $F = x' + xyz'$.`, options: [R`$F = x' + yz'$`, R`$F = x'yz'$`, R`$F = x' + y$`, R`$F = yz'$`], correct: 0,
      hint: R`Ποιο θεώρημα «σβήνει» μια μεταβλητή όταν δίπλα υπάρχει το συμπλήρωμά της ως όρος ($a + a'b$);`, sol: R`Με το Θ7 ($a + a'b = a + b$ για $a = x'$, $b = yz'$): $F = x' + yz'$.` },
    { level: 2, q: R`Να συμπληρώσετε τη στήλη της $(a\,b)'$ στον πίνακα αλήθειας (γραμμές $ab = 00, 01, 10, 11$) και τη στήλη της $a' + b'$. Γράψτε κάθε στήλη ως 4 ψηφία χωρίς κενά.`,
      fields: [{ label: "(ab)':", ans: "1110", text: true, nospace: true }, { label: "a' + b':", ans: "1110", text: true, nospace: true }],
      hint: R`Το $ab$ είναι 1 μόνο στη γραμμή 11.`, sol: R`$ab$: 0001, άρα $(ab)'$: <b>1110</b>. $a'$: 1100, $b'$: 1010, άρα $a' + b'$: <b>1110</b>. Οι στήλες ταυτίζονται — αυτό αποδεικνύει τη δεύτερη μορφή του Θ6.` },
    { shuffle: true, level: 2, type: "mc", q: R`Να βρείτε το συμπλήρωμα $F'$ της συνάρτησης $F = xy + x'y$.`, options: [R`$F' = y'$`, R`$F' = y$`, R`$F' = x'y'$`, R`$F' = x + y'$`], correct: 0,
      hint: R`Απλοποίησε πρώτα την F.`, sol: R`$F = y(x + x') = y \cdot 1 = y$ (Α3, Α5, Α4), άρα $F' = y'$.` },
    { level: 2, type: "mc", q: R`Η έκφραση $F = ABC + ABC' + A'B$ απλοποιείται σε:`, options: [R`$F = B$`, R`$F = AB$`, R`$F = A + B$`, R`$F = A'B + AB'$`], correct: 0,
      hint: R`$ABC + ABC' = AB(C + C')$.`, sol: R`$ABC + ABC' = AB(C + C') = AB$. Τότε $F = AB + A'B = B(A + A') = B$.` },
    { level: 3, type: "mc", q: R`Να απλοποιήσετε την $F = (A + B)(A + B')(A' + C)$.`, options: [R`$F = AC$`, R`$F = A$`, R`$F = A + C$`, R`$F = BC$`], correct: 0,
      hint: R`Α3: $(A + B)(A + B') = A + BB'$.`, sol: R`$(A + B)(A + B') = A + BB' = A + 0 = A$ (Α3, Α5, Α4). Μετά $A(A' + C) = AC$ (Θ7, δυϊκή μορφή). Άρα $F = AC$.` },
    { level: 3, type: "mc", q: R`Ισχύει ότι $ab + a'c + bc = ab + a'c$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Δες το Παράδειγμα 2.2(γ) ή έλεγξε με πίνακα αλήθειας στο εργαλείο.`, sol: R`<b>Σωστό</b> (<i>εμβάθυνση, εκτός βιβλίου:</i> θεώρημα της «συναίνεσης» — βλ. και Παράδειγμα 2.2γ): $bc = (a + a')bc = abc + a'bc$, και ο $abc$ απορροφάται από τον $ab$, ο $a'bc$ από τον $a'c$ (Θ3).` }
  ]
},
/* ───────────────────────────── 2.3 ───────────────────────────── */
{
  id: "2.3", unit: 2, title: "Λογικές πύλες AND, OR, NOT, NAND, NOR, XOR, XNOR και πίνακες αλήθειας",
  book: "Βιβλίο Γ΄ Λυκείου: Γ2.1 §7 Λογικές Πύλες (σ. 29–31)",
  intro: "Ποιες είναι οι λογικές πύλες, πώς σχεδιάζονται και ποιος είναι ο πίνακας αλήθειας της καθεμιάς;",
  thumb: ICON("AND", "blue"),
  theory: R`
<p>Οι <b>λογικές πύλες</b> (logic gates) είναι τα βασικά δομικά στοιχεία των ψηφιακών κυκλωμάτων: έτοιμα κυκλώματα που υλοποιούν τις λογικές πράξεις. Κάθε πύλη δέχεται ένα ή περισσότερα <b>σήματα εισόδου</b> (0 ή 1) και παράγει ένα <b>σήμα εξόδου</b>, του οποίου η τιμή καθορίζεται από το είδος της πύλης. Η συμπεριφορά κάθε πύλης περιγράφεται πλήρως από τον <b>πίνακα αλήθειας</b> της. Στις Παγκύπριες πρέπει να αναγνωρίζεις το σύμβολο κάθε πύλης, να γράφεις τη λογική της έκφραση και να υπολογίζεις την έξοδο.</p>
<div class="tbox def"><h4>Οι επτά βασικές λογικές πύλες</h4>
<div class="ia2gtab">
<div><b>NOT</b> (ΟΧΙ) ${ia2Gate("NOT")}$Y = A'$<small>αντιστρέφει την είσοδο</small></div>
<div><b>AND</b> (ΚΑΙ) ${ia2Gate("AND")}$Y = A * B$<small>1 μόνο όταν όλες οι είσοδοι είναι 1</small></div>
<div><b>OR</b> (Ή) ${ia2Gate("OR")}$Y = A + B$<small>1 όταν τουλάχιστον μία είσοδος είναι 1</small></div>
<div><b>NAND</b> (ΟΧΙ-ΚΑΙ) ${ia2Gate("NAND")}$Y = (A * B)'$<small>η αντίθετη έξοδος από την AND</small></div>
<div><b>NOR</b> (ΟΧΙ-Ή) ${ia2Gate("NOR")}$Y = (A + B)'$<small>η αντίθετη έξοδος από την OR</small></div>
<div><b>XOR</b> (αποκλειστικό Ή) ${ia2Gate("XOR")}$Y = A \oplus B = AB' + A'B$<small>1 όταν οι είσοδοι διαφέρουν</small></div>
<div><b>XNOR</b> ${ia2Gate("XNOR")}$Y = (A \oplus B)' = AB + A'B' = A \odot B$<small>1 όταν οι είσοδοι είναι ίδιες</small></div>
</div>
<p class="small muted">Το κυκλάκι στην έξοδο σημαίνει <b>αντιστροφή</b> (NOT). Η καμπύλη πίσω πλευρά χαρακτηρίζει την OR· η διπλή καμπύλη την XOR.</p></div>
<div class="tbox"><h4>Πίνακας αλήθειας όλων των πυλών (2 εισόδων)</h4>
${ia2TTable(["A", "B"], [["AND", ia2TT("AB")], ["OR", ia2TT("A+B")], ["NAND", ia2TT("(AB)'")], ["NOR", ia2TT("(A+B)'")], ["XOR", ia2TT("A⊕B")], ["XNOR", ia2TT("(A⊕B)'")]])}
<p class="small">Μνημονικός κανόνας: η στήλη της NAND είναι η στήλη της AND «ανάποδα» (0001 → 1110), η NOR της OR (0111 → 1000), η XNOR της XOR (0110 → 1001).</p></div>
<div class="tbox def"><h4>Πύλες με περισσότερες εισόδους</h4>
<p>Οι AND, OR, NAND, NOR μπορούν να έχουν 3, 4, … εισόδους: η AND 3 εισόδων δίνει 1 μόνο για 111, η OR 3 εισόδων δίνει 0 μόνο για 000. <i>(Εμβάθυνση, εκτός βιβλίου)</i> Η <b>XOR πολλών εισόδων</b> δίνει 1 όταν το <b>πλήθος των 1 είναι περιττό</b> (π.χ. $1 \oplus 1 \oplus 1 = 1$). Ο πίνακας αλήθειας πύλης με $n$ εισόδους έχει $2^n$ γραμμές.</p></div>
<div class="tbox ex"><h4>Από λεκτική πρόταση σε λογική έκφραση (μεταβλητές X, Y, Z)</h4>
<p>Οι προτάσεις του βιβλίου (§7, σ. 31) με τη <b>σωστή</b> λογική έκφραση:</p>
<table class="tbl"><tr><th>#</th><th>Πρόταση (αληθής όταν…)</th><th>Σωστή έκφραση</th><th>Πύλες</th></tr>
<tr><td>1</td><td>και οι 3 μεταβλητές είναι αληθείς</td><td>$XYZ$</td><td>AND 3 εισόδων</td></tr>
<tr><td>2</td><td>τουλάχιστον μία μεταβλητή είναι αληθής</td><td>$X + Y + Z$</td><td>OR 3 εισόδων</td></tr>
<tr><td>3</td><td>δεν είναι καμία μεταβλητή αληθής</td><td>$(X + Y + Z)' = X'Y'Z'$</td><td>NOR 3 εισόδων</td></tr>
<tr><td>4</td><td>οι X και Y είναι αληθείς ή η Z είναι αληθής</td><td>$XY + Z$</td><td>AND και OR</td></tr>
<tr><td>5</td><td>και οι 3 μεταβλητές είναι ψευδείς</td><td>$(X + Y + Z)' = X'Y'Z'$</td><td>NOR 3 εισόδων</td></tr>
<tr><td>6</td><td>και οι 3 είναι είτε ψευδείς είτε αληθείς (όλες ίδιες)</td><td>$XYZ + X'Y'Z'$</td><td>AND, NOT, OR</td></tr>
<tr><td>7</td><td>δεν είναι και οι 3 ψευδείς, ούτε και οι 3 αληθείς</td><td>$(XYZ + X'Y'Z')' = (X \oplus Y) + (Y \oplus Z)$</td><td>2 XOR και OR</td></tr>
<tr><td>—</td><td>δεν είναι όλες αληθείς (τουλάχιστον μία ψευδής)</td><td>$(XYZ)' = X' + Y' + Z'$</td><td>NAND 3 εισόδων</td></tr></table></div>
<div class="tbox warn"><h4>Σημείωση για το βιβλίο</h4>
<p>Στον αντίστοιχο κατάλογο του βιβλίου τρεις απαντήσεις είναι λανθασμένες:</p>
<ul><li><b>Πρόταση 3</b> δίνεται ως X NAND Y NAND Z. Όμως η NAND δίνει 1 όταν <i>τουλάχιστον μία</i> είσοδος είναι 0: π.χ. για $XYZ = 110$ η NAND δίνει 1, ενώ δύο μεταβλητές είναι αληθείς. Σωστό: NOR, δηλαδή $X'Y'Z'$ (ίδιο με την πρόταση 5).</li>
<li><b>Πρόταση 6</b> δίνεται ως X XNOR Y XNOR Z. Για $XYZ = 100$: $(1 \odot 0) = 0$ και $0 \odot 0 = 1$ — δίνει 1 ενώ οι τρεις δεν είναι ίδιες· και για $XYZ = 000$: $(0 \odot 0) = 1$, $1 \odot 0 = 0$ — δίνει 0 ενώ είναι όλες ίδιες. Σωστό: $XYZ + X'Y'Z'$.</li>
<li><b>Πρόταση 7</b> δίνεται ως $X \oplus Y \oplus Z$. Αυτή δίνει 1 για $XYZ = 111$ (όλες αληθείς!) και 0 για 011, 101, 110 (που δεν είναι όλες ίδιες). Σωστό: $(XYZ + X'Y'Z')' = (X \oplus Y) + (Y \oplus Z)$.</li></ul>
<p class="small muted">Στις εξετάσεις γράψε την έκφραση που πραγματικά περιγράφει την πρόταση και έλεγξέ την με πίνακα αλήθειας.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>• Σύγχυση OR με XOR: για $A = B = 1$ η OR δίνει 1, η XOR δίνει 0. • Το σύμβολο της NAND είναι AND με κυκλάκι — όχι AND ακολουθούμενη από τίποτα. • Στον πίνακα αλήθειας οι γραμμές γράφονται σε αύξουσα δυαδική σειρά (00, 01, 10, 11).</p></div>
`,
  widget: "ia2gates",
  gen: "ia2gGate",
  exercises: [
    { level: 1, q: R`Ποια είναι η έξοδος μιας πύλης <b>NAND</b> δύο εισόδων για $A = 1,\ B = 1$;`, fields: [{ label: "Y =", ans: 0 }],
      hint: R`NAND = αντίθετη της AND.`, sol: R`$AB = 1$, άρα $Y = (AB)' = 0$. Η NAND δίνει 0 μόνο όταν όλες οι είσοδοι είναι 1.` },
    { level: 1, q: R`Να γράψετε τη στήλη εξόδου του πίνακα αλήθειας της πύλης <b>XOR</b> δύο εισόδων (γραμμές $AB = 00, 01, 10, 11$), χωρίς κενά.`, fields: [{ label: "Y:", ans: "0110", text: true, nospace: true }],
      hint: R`Η XOR δίνει 1 όταν οι είσοδοι διαφέρουν.`, sol: R`00 → 0, 01 → 1, 10 → 1, 11 → 0: <b>0110</b>.` },
    { level: 1, q: R`Να γράψετε τη στήλη εξόδου του πίνακα αλήθειας της πύλης <b>NOR</b> δύο εισόδων (γραμμές $AB = 00, 01, 10, 11$), χωρίς κενά.`, fields: [{ label: "Y:", ans: "1000", text: true, nospace: true }],
      hint: R`Πρώτα η στήλη της OR, μετά αντιστροφή.`, sol: R`OR: 0111 → NOR: <b>1000</b>. Η NOR δίνει 1 μόνο όταν όλες οι είσοδοι είναι 0.` },
    { level: 1, type: "mc", q: R`Ποια πύλη δύο εισόδων δίνει έξοδο 1 <b>μόνο όταν οι είσοδοι έχουν την ίδια τιμή</b>;`, options: ["XNOR", "XOR", "NAND", "AND"], correct: 0,
      hint: R`Είναι η αντίθετη της πύλης που ελέγχει αν οι είσοδοι διαφέρουν.`, sol: R`Η <b>XNOR</b>: $Y = AB + A'B' = (A \oplus B)'$ — 1 για 00 και 11.` },
    { level: 1, type: "mc", q: R`Ποια λογική πύλη απεικονίζεται;${ia2Gate("NOR", { labels: false })}`, options: ["NOR", "NAND", "XNOR", "OR"], correct: 0,
      hint: R`Καμπύλη πίσω πλευρά (μία γραμμή) και κυκλάκι στην έξοδο.`, sol: R`Το σχήμα της OR (μία καμπύλη πίσω) με κυκλάκι αντιστροφής στην έξοδο είναι η <b>NOR</b>: $Y = (A + B)'$.` },
    { level: 2, type: "mc", q: R`<i>(Εμβάθυνση, εκτός βιβλίου)</i> Η έξοδος μιας πύλης <b>XOR τριών εισόδων</b> είναι 1 όταν:`, options: [R`το πλήθος των εισόδων με τιμή 1 είναι περιττό`, R`ακριβώς μία είσοδος είναι 1`, R`οι είσοδοι δεν είναι όλες ίδιες`, R`τουλάχιστον μία είσοδος είναι 1`], correct: 0,
      hint: R`Υπολόγισε $1 \oplus 1 \oplus 1$.`, sol: R`$A \oplus B \oplus C = 1$ για 1 ή 3 μονάδες (περιττό πλήθος): π.χ. $1 \oplus 1 \oplus 1 = 0 \oplus 1 = 1$, ενώ $1 \oplus 1 \oplus 0 = 0$.` },
    { level: 2, q: R`<i>(Εμβάθυνση)</i> Ποια είναι η έξοδος πύλης <b>XOR τριών εισόδων</b> για $A = 1,\ B = 1,\ C = 1$;`, fields: [{ label: "Y =", ans: 1 }],
      hint: R`Πρώτα $A \oplus B$, μετά $\oplus\, C$.`, sol: R`$1 \oplus 1 = 0$, $0 \oplus 1 = 1$. Τρία 1 = περιττό πλήθος → $Y = 1$.` },
    { level: 2, type: "mc", q: R`Αν ενώσουμε τις δύο εισόδους μιας πύλης NAND (δηλαδή $A = B$), η πύλη λειτουργεί ως πύλη NOT.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`$(A * A)' = ;$`, sol: R`<b>Σωστό.</b> $(A * A)' = A'$ (Θ1: $AA = A$).<br><i>Εμβάθυνση (εκτός βιβλίου):</i> αφού η NAND δίνει NOT, μια δεύτερη NAND στην έξοδο μιας NAND δίνει AND ($((AB)')' = AB$), και με De Morgan $(A'B')' = A + B$ δίνει OR. Επειδή κάθε συνάρτηση γράφεται με AND, OR, NOT, κάθε κύκλωμα μπορεί να φτιαχτεί μόνο με πύλες NAND.` },
    { level: 3, q: R`Ένας συναγερμός $Y$ χτυπά όταν ο αισθητήρας κίνησης $K$ δίνει 1 <b>και δεν</b> είναι πατημένο το κουμπί απενεργοποίησης $D$ ($D = 1$ όταν είναι πατημένο). Να γράψετε τη στήλη του $Y$ στον πίνακα αλήθειας (γραμμές $KD = 00, 01, 10, 11$) χωρίς κενά.`,
      fields: [{ label: "Y:", ans: "0010", text: true, nospace: true }],
      hint: R`Μετάφρασε τη φράση: «και» → AND, «δεν» → NOT. Μετά συμπλήρωσε τις 4 γραμμές.`, sol: R`$Y = KD'$: είναι 1 μόνο για $K = 1,\ D = 0$ (γραμμή 10). Στήλη: <b>0010</b>.` },
    { level: 3, q: R`Πόσες γραμμές έχει ο πίνακας αλήθειας μιας πύλης AND τεσσάρων εισόδων και σε πόσες από αυτές η έξοδος είναι 1;`,
      fields: [{ label: "Γραμμές:", ans: 16 }, { label: "Έξοδος 1 σε:", ans: 1 }],
      hint: R`$2^n$ γραμμές· η AND δίνει 1 μόνο όταν όλες οι είσοδοι είναι 1.`, sol: R`$2^4 = 16$ γραμμές· η έξοδος είναι 1 μόνο στη γραμμή 1111, δηλαδή σε <b>1</b> γραμμή.` }
  ]
},
/* ───────────────────────────── 2.4 ───────────────────────────── */
{
  id: "2.4", unit: 2, title: "Λογικές συναρτήσεις και λογικά κυκλώματα: από τη συνάρτηση στο κύκλωμα",
  book: "Βιβλίο Γ΄ Λυκείου: Γ2.1 §8 Λογικές Συναρτήσεις και Λογικά Κυκλώματα, Παραδείγματα 2.4–2.5 (σ. 31–34) · Γ2.2 Logic Circuit",
  intro: "Πώς μετατρέπουμε μια λογική συνάρτηση σε λογικό κύκλωμα, πώς φτιάχνουμε τον πίνακα αλήθειας του και πώς ακολουθούμε το σήμα μέσα από τις πύλες;",
  thumb: ICON("F(A,B)", "green"),
  theory: R`
<p>Μια <b>λογική συνάρτηση</b> (boolean function) αποτελείται από μια δυαδική μεταβλητή (την έξοδο), το σύμβολο «=» και μια λογική έκφραση, π.χ. $F = A + B'C$. Για κάθε συνδυασμό τιμών των εισόδων η συνάρτηση παίρνει την τιμή 1 (true) ή 0 (false). Κάθε λογική συνάρτηση μπορεί να μετατραπεί σε <b>λογικό κύκλωμα</b> με πύλες AND, OR, NOT κ.λπ. — και αντίστροφα, από κάθε κύκλωμα γράφουμε τη συνάρτησή του. Αυτό είναι κλασικό θέμα των Παγκυπρίων: <i>πίνακας αλήθειας → συνάρτηση → κύκλωμα</i>.</p>
<div class="tbox def"><h4>Βήματα σχεδίασης συνδυαστικού λογικού κυκλώματος</h4>
<ol><li>Από την περιγραφή της λειτουργίας προσδιορίζουμε το <b>πλήθος των εισόδων και των εξόδων</b> και τους δίνουμε ονόματα.</li>
<li>Συμπληρώνουμε τον <b>πίνακα αλήθειας</b>: με $N$ εισόδους έχει $2^N$ γραμμές.</li>
<li>Γράφουμε (και απλοποιούμε) τη <b>λογική συνάρτηση</b>.</li>
<li>Σχεδιάζουμε το <b>λογικό κύκλωμα</b> (στο χαρτί ή με εργαλείο όπως το Logic Circuit).</li></ol></div>
<div class="tbox ex"><h4>Η συνάρτηση F = A + B'C</h4>
<p>Η $F$ είναι 1 όταν $A = 1$ <b>ή</b> όταν $B'C = 1$, δηλαδή $B = 0$ και $C = 1$. Με $N = 3$ εισόδους έχουμε $2^3 = 8$ γραμμές:</p>
<div class="ia2row"><div>${ia2TTable(["A", "B", "C"], [["F", ia2TT("A+B'C")]])}</div><div style="flex:1 1 280px">${ia2Fig(ia2Circuit("A + B'C"), "Κύκλωμα της F = A + B'C: NOT στο B, AND με το C, OR με το A")}</div></div></div>
<div class="tbox ex"><h4>Παράδειγμα 2.4 — «Οι είσοδοι Α και Β δεν έχουν την ίδια τιμή ή η είσοδος C είναι αληθής»</h4>
<p>«Α και Β διαφορετικά» → πύλη XOR· «ή C» → πύλη OR. Άρα $F = (A \oplus B) + C$. Η ίδια συνάρτηση γράφεται και μόνο με AND, OR, NOT: $F = AB' + A'B + C$. Τα κυκλώματα διαφέρουν, ο <b>πίνακας αλήθειας είναι ο ίδιος</b>:</p>
<div class="ia2row"><div>${ia2TTable(["A", "B", "C"], [["F", ia2TT("A⊕B+C")]])}</div><div style="flex:1 1 300px">${ia2Fig(ia2Circuit("(A ⊕ B) + C"), "Με πύλη XOR")}${ia2Fig(ia2Circuit("AB' + A'B + C"), "Με πύλες AND, OR, NOT")}</div></div></div>
<div class="tbox def"><h4>Ακολουθώντας το σήμα (ανάλυση κυκλώματος)</h4>
<p>Για συγκεκριμένες τιμές εισόδων υπολογίζουμε την έξοδο <b>κάθε πύλης</b> από τα αριστερά προς τα δεξιά, μέχρι την έξοδο $F$. Στο σχήμα τα <span style="color:#198754;font-weight:800">πράσινα</span> καλώδια έχουν τιμή 1 (κύκλωμα πλειοψηφίας $F = AB + AC + BC$ για $A = 1,\ B = 0,\ C = 1$):</p>
${ia2Fig(ia2Circuit("AB + AC + BC", { vals: { A: 1, B: 0, C: 1 } }), "AB = 0, AC = 1, BC = 0 → F = 0 + 1 + 0 = 1")}
<p>Αντίστροφα, για να γράψουμε τη <b>συνάρτηση ενός κυκλώματος</b>, γράφουμε την έκφραση στην έξοδο κάθε πύλης ξεκινώντας από τις εισόδους.</p></div>
<div class="tbox ex"><h4>Παράδειγμα 2.5 — απλοποίηση κυκλώματος</h4>
<p>Η $F = ABC + ABC'$ θέλει 1 NOT, 2 AND τριών εισόδων και 1 OR. Αλγεβρικά: $ABC + ABC' = AB(C + C')$ (Α3) $= AB \cdot 1$ (Α5) $= AB$ (Α4). Το απλοποιημένο κύκλωμα είναι <b>μία</b> πύλη AND!</p>
<div class="figrow">${ia2Fig(ia2Circuit("ABC + ABC'"), "Πριν: F = ABC + ABC'")}${ia2Fig(ia2Circuit("AB"), "Μετά: F = AB")}</div>
<p>Μια συνάρτηση που θα υλοποιηθεί ως κύκλωμα πρέπει να απλοποιείται, ώστε να προκύψει κύκλωμα με <b>λιγότερες πύλες και συνδέσεις</b> (φθηνότερο, ταχύτερο, με μικρότερη κατανάλωση). Η απλοποίηση γίνεται αλγεβρικά ή με <b>χάρτες Karnaugh</b>.</p></div>
<div class="tbox tip"><h4>Θέμα εξετάσεων: «μόνο πύλες AND και OR δύο εισόδων»</h4>
<p>Για $F(a, b, c) = (a \;\&\&\; b) \;||\; (a \;\&\&\; c)$, δηλαδή $F = ab + ac$, το δειγματικό δοκίμιο ζητά το <b>κύκλωμα της δοσμένης συνάρτησης</b>: 2 πύλες AND και 1 OR. Η απλοποίηση είναι προαιρετική βελτιστοποίηση (μόνο αν ζητηθεί «στην πιο απλή μορφή»): Αν πρώτα εφαρμόσουμε την επιμεριστική, $F = a(b + c)$: μία OR και μία AND — 2 πύλες.</p>
<div class="figrow">${ia2Fig(ia2Circuit("ab + ac"), "F = ab + ac (3 πύλες)")}${ia2Fig(ia2Circuit("a(b + c)"), "F = a(b + c) (2 πύλες)")}</div></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>• Πίνακας αλήθειας με λάθος πλήθος γραμμών (3 είσοδοι → 8 γραμμές, όχι 6). • Στο κύκλωμα ξεχνάμε την πύλη NOT για μια μεταβλητή με τόνο. • Συνδέουμε την έξοδο μιας πύλης σε δύο σημεία χωρίς τελεία σύνδεσης ή μπερδεύουμε διασταυρώσεις καλωδίων. • Γράφουμε τη συνάρτηση από το κύκλωμα χωρίς παρενθέσεις: η έξοδος μιας OR που μπαίνει σε AND χρειάζεται παρένθεση, π.χ. $(A + B)C$.</p></div>
`,
  widget: "ia2circ",
  gen: "ia2gCirc",
  exercises: [
    { level: 1, q: R`Δίνεται το κύκλωμα:${ia2Fig(ia2Circuit("A'B + C"))}Ποια είναι η τιμή της εξόδου $F$ για $A = 0,\ B = 1,\ C = 0$;`, fields: [{ label: "F =", ans: 1 }],
      hint: R`$F = A'B + C$.`, sol: R`$A' = 1$, $A'B = 1 \cdot 1 = 1$, $F = 1 + 0 = 1$.${ia2Fig(ia2Circuit("A'B + C", { vals: { A: 0, B: 1, C: 0 } }))}` },
    { level: 1, q: R`Πόσες γραμμές έχει ο πίνακας αλήθειας μιας λογικής συνάρτησης με 4 εισόδους;`, fields: [{ label: "Γραμμές:", ans: 16 }],
      hint: R`$2^N$.`, sol: R`$2^4 = 16$ γραμμές (όλοι οι συνδυασμοί από 0000 έως 1111).` },
    { level: 2, q: R`Να δημιουργήσετε τον πίνακα αλήθειας της $F = (A + B)'C$ και να γράψετε τη στήλη του $F$ (ABC = 000 έως 111) χωρίς κενά.`, fields: [{ label: "F:", ans: ia2Bits("(A+B)'C", ["A", "B", "C"]), text: true, nospace: true }],
      hint: R`$(A + B)' = 1$ μόνο για $A = B = 0$.`, sol: R`Η $F$ είναι 1 μόνο όταν $A = 0,\ B = 0,\ C = 1$ (γραμμή 001).${ia2TTable(["A", "B", "C"], [["F", ia2TT("(A+B)'C")]])}Στήλη: <b>01000000</b>.` },
    { level: 2, type: "mc", q: R`Ποια συνάρτηση υλοποιεί το κύκλωμα;${ia2Fig(ia2Circuit("AB + A'C"))}`, options: [R`$F = AB + A'C$`, R`$F = (A + B)(A' + C)$`, R`$F = AB + AC'$`, R`$F = A'B + AC$`], correct: 0,
      hint: R`Γράψε την έξοδο κάθε πύλης AND και μετά της OR. Σε ποια AND πηγαίνει το A μέσα από NOT;`, sol: R`Η πάνω AND δίνει $AB$, η κάτω AND δέχεται το $A'$ (μέσα από NOT) και το $C$: $A'C$. Η OR δίνει $F = AB + A'C$.` },
    { level: 2, q: R`Πόσες πύλες χρειάζονται για το κύκλωμα της $F = A'B + AB'$, αν χρησιμοποιήσουμε μόνο πύλες NOT, AND και OR (δύο εισόδων);`, fields: [{ label: "Πύλες:", ans: 5 }],
      hint: R`Μέτρησε NOT για κάθε μεταβλητή με τόνο, AND για κάθε γινόμενο, OR για το άθροισμα.`, sol: R`2 NOT ($A'$, $B'$) + 2 AND ($A'B$, $AB'$) + 1 OR = <b>5</b> πύλες. (Η ίδια συνάρτηση είναι $A \oplus B$: μία μόνο πύλη XOR!)${ia2Fig(ia2Circuit("A'B + AB'"))}` },
    { level: 2, q: R`Να γράψετε τη στήλη του πίνακα αλήθειας της $F = (A \oplus B) + C$ (ABC = 000 έως 111) χωρίς κενά.`, fields: [{ label: "F:", ans: ia2Bits("A⊕B+C", ["A", "B", "C"]), text: true, nospace: true }],
      hint: R`Η F είναι 1 όταν $C = 1$ ή όταν $A \ne B$.`, sol: R`Παράδειγμα 2.4 του βιβλίου: 0 μόνο για 000 και 110. Στήλη: <b>01111101</b>.` },
    { level: 2, type: "mc", q: R`Μια λογική συνάρτηση που πρόκειται να υλοποιηθεί ως κύκλωμα απλοποιείται, ώστε:`, options: [R`να προκύψει κύκλωμα με λιγότερες πύλες και συνδέσεις, χωρίς να αλλάξει ο πίνακας αλήθειας`, R`να αλλάξει ο πίνακας αλήθειας σε απλούστερο`, R`να αυξηθεί το πλήθος των εισόδων`, R`να χρησιμοποιούνται μόνο πύλες XOR`], correct: 0,
      hint: R`Η απλοποιημένη συνάρτηση είναι ισοδύναμη με την αρχική.`, sol: R`Η απλοποίηση δίνει <b>ισοδύναμη</b> συνάρτηση (ίδιος πίνακας αλήθειας) με κύκλωμα λιγότερων πυλών και συνδέσεων.` },
    { level: 3, q: R`Δίνεται το κύκλωμα της $F = (AB)' + (B \oplus C)$.${ia2Fig(ia2Circuit("(AB)' + (B ⊕ C)"))}Για $A = 1,\ B = 1,\ C = 1$ να βρείτε την έξοδο της NAND ($G_1$), της XOR ($G_2$) και την έξοδο $F$.`,
      fields: [{ label: "G<sub>1</sub> =", ans: 0 }, { label: "G<sub>2</sub> =", ans: 0 }, { label: "F =", ans: 0 }],
      hint: R`NAND: 0 μόνο αν όλες οι είσοδοι είναι 1. XOR: 1 μόνο αν οι είσοδοι διαφέρουν.`, sol: R`$G_1 = (1 \cdot 1)' = 0$, $G_2 = 1 \oplus 1 = 0$, $F = 0 + 0 = 0$.${ia2Fig(ia2Circuit("(AB)' + (B ⊕ C)", { vals: { A: 1, B: 1, C: 1 } }))}` },
    { level: 3, q: R`Ένα κύκλωμα με τρεις εισόδους $A, B, C$ δίνει έξοδο 1 όταν <b>ακριβώς δύο</b> είσοδοι είναι 1. Να γράψετε τη συνάρτηση ως άθροισμα ελαχιστόρων (μόνο τους αριθμούς, αύξουσα σειρά, με κόμμα).`,
      fields: [{ label: "F = Σ(", ans: "3,5,6", text: true, nospace: true, ph: "π.χ. 1,2" }],
      hint: R`Ποιοι συνδυασμοί από 000 έως 111 έχουν ακριβώς δύο μονάδες;`, sol: R`011 = 3, 101 = 5, 110 = 6. Άρα $F = \Sigma(3, 5, 6) = A'BC + AB'C + ABC'$. (Σε αντίθεση με τη συνάρτηση πλειοψηφίας, εδώ το 111 δίνει 0.)` },
    { level: 3, q: R`Δίνεται $F(a, b, c) = (a \;\&\&\; b) \;||\; (a \;\&\&\; c)$. Ποιο είναι το <b>ελάχιστο</b> πλήθος πυλών AND και OR δύο εισόδων με το οποίο υλοποιείται, αν πρώτα την απλοποιήσετε με την επιμεριστική ιδιότητα;`, fields: [{ label: "Πύλες:", ans: 2 }],
      hint: R`$ab + ac = a(\dots)$`, sol: R`$F = ab + ac = a(b + c)$ (Α3): μία OR για το $b + c$ και μία AND με το $a$ — <b>2</b> πύλες (αντί για 3).` }
  ]
},
/* ───────────────────────────── 2.5 ───────────────────────────── */
{
  id: "2.5", unit: 2, title: "Ελαχιστόροι και μεγιστόροι: άθροισμα ελαχιστόρων Σ και γινόμενο μεγιστόρων Π",
  book: "Βιβλίο Γ΄ Λυκείου: Γ2.1 §9 Ελαχιστόροι και Μεγιστόροι, Παραδείγματα 2.6–2.7 (σ. 34–36)",
  intro: "Τι είναι οι ελαχιστόροι (minterms) και οι μεγιστόροι (maxterms) και πώς γράφουμε μια συνάρτηση ως Σ(…) και Π(…);",
  thumb: ICON("Σm", "amber"),
  theory: R`
<p>Κάθε λογική συνάρτηση μπορεί να γραφτεί σε <b>κανονική μορφή</b>: ως <b>άθροισμα ελαχιστόρων</b> (Σ) ή ως <b>γινόμενο μεγιστόρων</b> (Π). Οι μορφές αυτές προκύπτουν κατευθείαν από τον πίνακα αλήθειας και είναι το πρώτο βήμα για την απλοποίηση με <b>χάρτη Karnaugh</b>.</p>
<div class="tbox def"><h4>Ελαχιστόρος (minterm) και μεγιστόρος (maxterm)</h4>
<p><b>Ελαχιστόρος</b> ονομάζεται κάθε γινόμενο (λογικό ΚΑΙ) που περιέχει <b>όλες</b> τις μεταβλητές της συνάρτησης, την καθεμιά μία φορά, κανονική ή με τόνο. Για εισόδους X, Y: $XY,\ X'Y,\ XY',\ X'Y'$. Συμβολίζεται με $m_i$.</p>
<p><b>Μεγιστόρος</b> ονομάζεται κάθε άθροισμα (λογικό Ή) που περιέχει όλες τις μεταβλητές: $X + Y,\ X' + Y,\ X + Y',\ X' + Y'$. Συμβολίζεται με $M_i$.</p>
<p>Ο δείκτης $i$ είναι ο δεκαδικός αριθμός του συνδυασμού: στον ελαχιστόρο το <b>0 → μεταβλητή με τόνο</b>, το 1 → κανονική· στον μεγιστόρο <b>αντίστροφα</b> (0 → κανονική, 1 → με τόνο).</p></div>
<div class="tbox"><h4>Ελαχιστόροι και μεγιστόροι τριών μεταβλητών</h4>
<table class="tbl ia2tt"><tr><th>x</th><th>y</th><th>z</th><th>Ελαχιστόρος</th><th>Ονομασία</th><th>Μεγιστόρος</th><th>Ονομασία</th></tr>
${[0, 1, 2, 3, 4, 5, 6, 7].map(m => { const b = [m >> 2 & 1, m >> 1 & 1, m & 1], v = ["x", "y", "z"]; return `<tr><td>${b[0]}</td><td>${b[1]}</td><td>${b[2]}</td><td>$${v.map((c, k) => c + (b[k] ? "" : "'")).join("")}$</td><td>$m_{${m}}$</td><td>$${v.map((c, k) => c + (b[k] ? "'" : "")).join(" + ")}$</td><td>$M_{${m}}$</td></tr>`; }).join("")}</table>
<p>Κάθε ελαχιστόρος είναι το <b>συμπλήρωμα</b> του αντίστοιχου μεγιστόρου: $m_i' = M_i$ (De Morgan), π.χ. $(x'yz')' = x + y' + z = M_2$. Για 4 μεταβλητές (w, x, y, z) έχουμε 16 ελαχιστόρους $m_0 \dots m_{15}$ και 16 μεγιστόρους.</p></div>
<div class="tbox def"><h4>Άθροισμα ελαχιστόρων (Σ) και γινόμενο μεγιστόρων (Π)</h4>
<p>Μια συνάρτηση γράφεται ως το <b>άθροισμα των ελαχιστόρων</b> για τους οποίους παίρνει τιμή 1, και ως το <b>γινόμενο των μεγιστόρων</b> που <i>δεν</i> χρησιμοποιούνται στο άθροισμα (δηλαδή των γραμμών με τιμή 0). Π.χ. για $f = x'y'z + xy'z' + xyz$:</p>
<div class="fbox">$$f = m_1 + m_4 + m_7 = \Sigma(1, 4, 7) \qquad f = M_0M_2M_3M_5M_6 = \Pi(0, 2, 3, 5, 6)$$</div>
<p>Οι αριθμοί του Σ και του Π μαζί δίνουν όλους τους αριθμούς $0 \dots 2^n - 1$, ο καθένας μία φορά.</p></div>
<div class="tbox ex"><h4>Παράδειγμα 2.6 — τέσσερις μεταβλητές</h4>
<p>$f = w'x'y'z' + wxy'z + wxyz + wxy'z'$: οι όροι αντιστοιχούν στα 0000 = 0, 1101 = 13, 1111 = 15, 1100 = 12. Άρα $f = \Sigma(0, 12, 13, 15)$ και $f = \Pi(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14)$.</p></div>
<div class="tbox ex"><h4>Παράδειγμα 2.7 — όταν λείπουν μεταβλητές από έναν όρο: f = a + b'c</h4>
<details class="steps"><summary>Λύση βήμα-βήμα</summary>
<p>Στον όρο $a$ λείπουν τα $b$ και $c$: $a = a(b + b') = ab + ab'$ (Α5), και $ab(c + c') + ab'(c + c') = abc + abc' + ab'c + ab'c'$.</p>
<p>Στον όρο $b'c$ λείπει το $a$: $b'c(a + a') = ab'c + a'b'c$.</p>
<p>Ο $ab'c$ εμφανίζεται δύο φορές· κρατάμε έναν (Θ1: $a + a = a$): $f = abc + abc' + ab'c + ab'c' + a'b'c$.</p>
<p>Αριθμοί: 111 = 7, 110 = 6, 101 = 5, 100 = 4, 001 = 1. Άρα $f = \Sigma(1, 4, 5, 6, 7)$ και $f = \Pi(0, 2, 3)$.</p>
${ia2TTable(["a", "b", "c"], [["f", ia2TT("a+b'c")]], { m: true })}
<p class="small muted">Πιο γρήγορα: φτιάξε τον πίνακα αλήθειας και διάβασε τις γραμμές με f = 1 (Σ) και f = 0 (Π).</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>• Ανάποδοι τόνοι στους μεγιστόρους: ο $M_5$ (101) είναι $x' + y + z'$, όχι $x + y' + z$. • Αρίθμηση με λάθος σειρά μεταβλητών: η πρώτη μεταβλητή είναι το <b>πιο σημαντικό</b> bit. • Στο Π γράφουμε τις γραμμές με τιμή <b>0</b>, όχι 1.</p></div>
`,
  widget: "ia2mint",
  gen: "ia2gSig",
  exercises: [
    { level: 1, q: R`Να γράψετε τον ελαχιστόρο $m_5$ τριών μεταβλητών $x, y, z$ (π.χ. στη μορφή <code>x'yz</code>).`, fields: [{ label: "m<sub>5</sub> =", ans: ["xy'z", "x*y'*z", "x·y'·z"], text: true, nospace: true }],
      hint: R`5 = 101: 1 → κανονική, 0 → με τόνο.`, sol: R`$5 = 101_2$ → $m_5 = xy'z$.` },
    { level: 1, q: R`Να γράψετε τον μεγιστόρο $M_3$ τριών μεταβλητών $x, y, z$ (π.χ. στη μορφή <code>x+y'+z</code>).`, fields: [{ label: "M<sub>3</sub> =", ans: ["x+y'+z'", "(x+y'+z')"], text: true, nospace: true }],
      hint: R`3 = 011. Στους μεγιστόρους: 0 → κανονική, 1 → με τόνο.`, sol: R`$3 = 011_2$ → $M_3 = x + y' + z'$ (είναι το συμπλήρωμα του $m_3 = x'yz$).` },
    { level: 1, q: R`Να γράψετε τη συνάρτηση $f = x'y'z + xy'z' + xyz$ ως άθροισμα ελαχιστόρων (μόνο τους αριθμούς, αύξουσα σειρά, με κόμμα).`, fields: [{ label: "f = Σ(", ans: "1,4,7", text: true, nospace: true }],
      hint: R`Μετέτρεψε κάθε όρο σε δυαδικό: με τόνο → 0.`, sol: R`$x'y'z = 001 = 1$, $xy'z' = 100 = 4$, $xyz = 111 = 7$. $f = \Sigma(1, 4, 7)$.` },
    { level: 1, q: R`Η ίδια συνάρτηση $f = x'y'z + xy'z' + xyz$ ως γινόμενο μεγιστόρων: $f = \Pi(\dots)$;`, fields: [{ label: "f = Π(", ans: "0,2,3,5,6", text: true, nospace: true }],
      hint: R`Οι αριθμοί από 0 έως 7 που δεν ανήκουν στο Σ.`, sol: R`$\{0, \dots, 7\} \setminus \{1, 4, 7\} = \{0, 2, 3, 5, 6\}$: $f = \Pi(0, 2, 3, 5, 6) = M_0M_2M_3M_5M_6$.` },
    { level: 1, q: R`Πόσους ελαχιστόρους έχει μια συνάρτηση τεσσάρων μεταβλητών;`, fields: [{ label: "Πλήθος:", ans: 16 }],
      hint: R`Ένας για κάθε γραμμή του πίνακα αλήθειας.`, sol: R`$2^4 = 16$ ελαχιστόροι ($m_0 \dots m_{15}$) — και 16 μεγιστόροι.` },
    { level: 2, type: "mc", q: R`Ποιος ελαχιστόρος των $w, x, y, z$ αντιστοιχεί στον συνδυασμό $1010$ (δηλαδή στον $m_{10}$);`, options: [R`$wx'yz'$`, R`$w'xy'z$`, R`$w' + x + y' + z$`, R`$wxyz'$`], correct: 0,
      hint: R`1 → κανονική μεταβλητή, 0 → με τόνο.`, sol: R`$1010$: $w = 1,\ x = 0,\ y = 1,\ z = 0$ → $m_{10} = wx'yz'$.` },
    { level: 2, q: R`Να γράψετε τη συνάρτηση $f(a, b, c) = a'b + c$ ως άθροισμα ελαχιστόρων (αριθμοί, αύξουσα σειρά, με κόμμα).`, fields: [{ label: "f = Σ(", ans: ia2Sigma("a'b+c", ["a", "b", "c"]).join(","), text: true, nospace: true }],
      hint: R`Φτιάξε τον πίνακα αλήθειας: η f είναι 1 όταν $c = 1$ ή ($a = 0$ και $b = 1$).`, sol: R`Γραμμές με $c = 1$: 1, 3, 5, 7. Γραμμές με $a = 0,\ b = 1$: 2, 3. Ένωση: $f = \Sigma(1, 2, 3, 5, 7)$.${ia2TTable(["a", "b", "c"], [["f", ia2TT("a'b+c")]], { m: true })}` },
    { level: 2, q: R`Να γράψετε τη $f(A, B, C) = AB + C$ ως άθροισμα ελαχιστόρων.`, fields: [{ label: "f = Σ(", ans: ia2Sigma("AB+C").join(","), text: true, nospace: true }],
      hint: R`$AB$ → 110, 111· $C$ → όλες οι περιττές γραμμές.`, sol: R`$AB$: 6, 7 · $C$: 1, 3, 5, 7. $f = \Sigma(1, 3, 5, 6, 7)$.` },
    { level: 3, q: R`Αν $f(A, B, C) = \Sigma(0, 2, 6)$, να γράψετε την $f$ ως γινόμενο μεγιστόρων.`, fields: [{ label: "f = Π(", ans: "1,3,4,5,7", text: true, nospace: true }],
      hint: R`Συμπληρωματικό σύνολο αριθμών.`, sol: R`$f = \Pi(1, 3, 4, 5, 7) = (A + B + C')(A + B' + C')(A' + B + C)(A' + B + C')(A' + B' + C')$.` },
    { level: 3, type: "mc", q: R`Για κάθε $i$ ισχύει $m_i' = M_i$ (το συμπλήρωμα του ελαχιστόρου είναι ο αντίστοιχος μεγιστόρος).`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Εφάρμοσε De Morgan στο $m_2 = x'yz'$.`, sol: R`<b>Σωστό.</b> Π.χ. $(x'yz')' = x + y' + z = M_2$ (Θ6 και Θ5).` }
  ]
},
/* ───────────────────────────── 2.6 ───────────────────────────── */
{
  id: "2.6", unit: 2, title: "Χάρτες Karnaugh: απλοποίηση λογικής συνάρτησης 2, 3 και 4 μεταβλητών",
  book: "Βιβλίο Γ΄ Λυκείου: Γ2.1 §10 Χάρτες Karnaugh, Παραδείγματα 2.8–2.14 (σ. 36–42)",
  intro: "Πώς απλοποιούμε μια λογική συνάρτηση με χάρτη Karnaugh — βήμα-βήμα, όπως ζητείται στις Παγκύπριες;",
  thumb: ICON("K-map", "green"),
  theory: R`
<p>Ο <b>χάρτης Karnaugh</b> είναι ένας πίνακας που μας επιτρέπει να <b>απλοποιήσουμε μια λογική συνάρτηση</b> οπτικά, χωρίς δύσκολη άλγεβρα. Έχει τόσα τετράγωνα (κελιά) όσοι οι συνδυασμοί τιμών των μεταβλητών: με $k$ μεταβλητές, $2^k$ κελιά — ένα για κάθε <b>ελαχιστόρο</b>. Αν ο ελαχιστόρος επαληθεύει τη συνάρτηση γράφουμε 1, αλλιώς 0. Τα κελιά είναι τοποθετημένα ώστε <b>γειτονικά κελιά να διαφέρουν σε μία μόνο μεταβλητή</b> (σειρά 00, 01, <b>11</b>, 10). Στις Παγκύπριες (Μέρος Β) ζητείται σχεδόν πάντα: <i>πίνακας αλήθειας → χάρτης Karnaugh → απλοποιημένη συνάρτηση → κύκλωμα</i>.</p>
<div class="tbox def"><h4>Θέση των ελαχιστόρων στον χάρτη</h4>
<div class="figrow">${ia2Fig(ia2KMap(["A", "B"], [], { cells: "m", size: 46 }), "2 μεταβλητές")}${ia2Fig(ia2KMap(["A", "B", "C"], [], { cells: "m", size: 46 }), "3 μεταβλητές")}</div>
${ia2Fig(ia2KMap(["A", "B", "C", "D"], [], { cells: "m", size: 46 }), "4 μεταβλητές: γραμμές AB, στήλες CD (σειρά 00, 01, 11, 10)")}
<p>Προσοχή: στον χάρτη 3 μεταβλητών η τρίτη στήλη είναι η <b>11</b> (m3, m7) και η τέταρτη η <b>10</b> (m2, m6). Στον χάρτη 4 μεταβλητών η τρίτη γραμμή είναι η AB = 11 (m12–m15).</p></div>
<div class="tbox thm"><h4>Κανόνες απλοποίησης με χάρτη Karnaugh</h4>
<ol type="a"><li><b>Ομαδοποιούμε</b> γειτονικούς όρους με τιμή 1. Γειτονικοί είναι όσοι έχουν κοινή πλευρά — και τα κελιά στις <b>απέναντι άκρες</b> και στις <b>γωνίες</b> (ο χάρτης «τυλίγεται»).</li>
<li>Οι ομάδες έχουν <b>2, 4, 8 ή 16</b> κελιά (τετράγωνα ή ορθογώνια). Στόχος: <b>λίγες</b> και όσο το δυνατό <b>μεγαλύτερες</b> ομάδες.</li>
<li>Ένα κελί με 1 μπορεί να ανήκει σε <b>περισσότερες από μία</b> ομάδες. Ένα 1 χωρίς γειτονικά 1 αποτελεί μόνο του ομάδα.</li>
<li>Κάθε ομάδα πρέπει να έχει τουλάχιστον ένα 1 που <b>δεν ανήκει σε άλλη ομάδα</b>.</li>
<li>Σε κάθε ομάδα <b>απλοποιούνται οι μεταβλητές που αλλάζουν τιμή</b>· μένουν όσες έχουν την ίδια τιμή σε όλα τα κελιά (1 → κανονική, 0 → με τόνο).</li>
<li>Η απλοποιημένη συνάρτηση είναι το <b>άθροισμα</b> των όρων των ομάδων.</li></ol>
<p>Σε χάρτη 4 μεταβλητών: δεκαεξάδα → $F = 1$ · οκτάδα → όρος 1 μεταβλητής · τετράδα → όρος 2 μεταβλητών · δυάδα → όρος 3 μεταβλητών · μονάδα → και οι 4.</p></div>
<div class="tbox ex"><h4>Παραδείγματα 2.8 και 2.9 — δύο μεταβλητές</h4>
<div class="figrow">${ia2Fig(ia2KMap(["A", "B"], [0, 2], { groups: ["-0"], size: 46 }), "Y = A'B' + AB' = Σ(0,2) → Y = B'")}${ia2Fig(ia2KMap(["A", "B"], [1, 2, 3], { groups: ["1-", "-1"], size: 46 }), "Y = Σ(1,2,3) → Y = A + B")}</div>
<p>Στην πρώτη ομάδα το A αλλάζει (0 και 1), το B μένει 0 → $B'$. Αλγεβρικά: $A'B' + AB' = (A + A')B' = B'$. Στη δεύτερη, η οριζόντια ομάδα δίνει $A$, η κάθετη $B$· το κελί $m_3$ ανήκει και στις δύο (κανόνας γ).</p></div>
<div class="tbox ex"><h4>Παράδειγμα 2.11 — συνάρτηση πλειοψηφίας τριών εισόδων</h4>
<p>Το κύκλωμα δίνει 1 όταν υπάρχουν περισσότερα 1 από 0 στις εισόδους: $F = A'BC + AB'C + ABC' + ABC = \Sigma(3, 5, 6, 7)$.</p>
<div class="ia2row"><div>${ia2TTable(["A", "B", "C"], [["F", ia2TT("AB+AC+BC")]])}</div><div style="flex:1 1 260px">${ia2Fig(ia2KMap(["A", "B", "C"], [3, 5, 6, 7], { groups: ["11-", "1-1", "-11"], size: 46 }), "Τρεις δυάδες: AB, AC, BC")}</div></div>
<div class="fbox">$$F = AB + AC + BC$$</div>${ia2Fig(ia2Circuit("AB + AC + BC"), "Κύκλωμα πλειοψηφίας")}</div>
<div class="tbox ex"><h4>Παραδείγματα 2.12–2.14 — τέσσερις μεταβλητές</h4>
<div class="figrow">${ia2Fig(ia2KMap(["A", "B", "C", "D"], [0, 1, 4, 5, 15], { groups: ["0-0-", "1111"], size: 40 }), "Σ(0,1,4,5,15) → A'C' + ABCD")}${ia2Fig(ia2KMap(["A", "B", "C", "D"], [3, 7, 11, 12, 13, 14, 15], { groups: ["11--", "--11"], size: 40 }), "Σ(3,7,11,12,13,14,15) → AB + CD")}</div>
${ia2Fig(ia2KMap(["A", "B", "C", "D"], [0, 2, 8, 10], { groups: ["-0-0"], size: 40 }), "Σ(0,2,8,10): οι τέσσερις γωνίες είναι γειτονικές → B'D'")}
<p>Στο 2.12 ο $m_{15}$ δεν έχει γειτονικό 1, άρα μένει μόνος του με όλες τις μεταβλητές: $ABCD$. Στο 2.13 μια οριζόντια τετράδα (γραμμή 11 → $AB$) και μια κάθετη (στήλη 11 → $CD$) μοιράζονται το $m_{15}$.</p></div>
<div class="tbox ex"><h4>Θέμα τύπου Παγκυπρίων: F(A,B,C) = A'B'C' + AB'C + ABC + A'BC'</h4>
<details class="steps"><summary>Λύση βήμα-βήμα</summary>
<p><b>(α) Πίνακας αλήθειας.</b> Οι όροι αντιστοιχούν στα 000 = 0, 101 = 5, 111 = 7, 010 = 2: $F = \Sigma(0, 2, 5, 7)$.</p>${ia2TTable(["A", "B", "C"], [["F", ia2TT("A'B'C'+AB'C+ABC+A'BC'")]])}
<p><b>(β) Χάρτης Karnaugh</b> και <b>(γ) ομαδοποίηση</b>: τα $m_0, m_2$ (γραμμή A = 0, στήλες 00 και 10 — γειτονικές λόγω αναδίπλωσης) δίνουν $A'C'$· τα $m_5, m_7$ δίνουν $AC$.</p>
${ia2Fig(ia2KMap(["A", "B", "C"], [0, 2, 5, 7], { groups: ["0-0", "1-1"], size: 46 }))}
<div class="fbox">$$F = A'C' + AC$$</div>${ia2Fig(ia2Circuit("A'C' + AC"), "Το κύκλωμα μετά την απλοποίηση (ισοδύναμο με XNOR των A, C)")}</details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>• Σειρά στηλών 00, 01, 10, 11 — <b>λάθος</b>· η σωστή είναι 00, 01, 11, 10. • Ομάδες 3 ή 6 κελιών — δεν επιτρέπονται. • Διαγώνια κελιά <b>δεν</b> είναι γειτονικά. • Ξεχνάμε ότι οι άκρες και οι γωνίες τυλίγονται. • Μικρότερες ομάδες απ' όσο γίνεται (π.χ. δύο δυάδες αντί για μία τετράδα) — η συνάρτηση είναι σωστή αλλά όχι «στην πιο απλή μορφή».</p></div>
`,
  widget: "ia2kmap",
  gen: "ia2gKmap",
  exercises: [
    { level: 1, q: R`Πόσα κελιά έχει ένας χάρτης Karnaugh τεσσάρων μεταβλητών;`, fields: [{ label: "Κελιά:", ans: 16 }],
      hint: R`Ένα κελί για κάθε ελαχιστόρο.`, sol: R`$2^4 = 16$ κελιά (4 γραμμές × 4 στήλες).` },
    { level: 1, type: "mc", q: R`Σε χάρτη Karnaugh τριών μεταβλητών (γραμμές A, στήλες BC), ποιος ελαχιστόρος βρίσκεται στη γραμμή $A = 1$ και στη στήλη $BC = 10$;`, options: [R`$m_6$`, R`$m_5$`, R`$m_7$`, R`$m_2$`], correct: 0,
      hint: R`Ένωσε τα bits: A B C.`, sol: R`$ABC = 110_2 = 6$ → $m_6$.` },
    { level: 1, q: R`Μια τετράδα (ομάδα 4 κελιών) σε χάρτη Karnaugh τεσσάρων μεταβλητών δίνει όρο με πόσες μεταβλητές;`, fields: [{ label: "Μεταβλητές:", ans: 2 }],
      hint: R`Σε ομάδα $2^k$ κελιών απλοποιούνται $k$ μεταβλητές.`, sol: R`Τετράδα = $2^2$: απλοποιούνται 2 μεταβλητές, μένουν $4 - 2 = 2$.` },
    { level: 1, type: "mc", q: R`Σε χάρτη Karnaugh επιτρέπεται ομάδα 6 γειτονικών κελιών.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Μόνο δυνάμεις του 2.`, sol: R`<b>Λάθος.</b> Οι ομάδες έχουν 1, 2, 4, 8 ή 16 κελιά. Έξι κελιά καλύπτονται π.χ. με δύο επικαλυπτόμενες τετράδες.` },
    { level: 2, type: "mc", q: R`Να απλοποιήσετε την $F(A, B, C) = \Sigma(0, 2, 4, 6)$.${ia2Fig(ia2KMap(["A", "B", "C"], [0, 2, 4, 6], { size: 44 }))}`, options: [R`$F = C'$`, R`$F = A'C'$`, R`$F = B'C'$`, R`$F = A'B' + AB$`], correct: 0,
      hint: R`Οι στήλες 00 και 10 είναι γειτονικές.`, sol: R`Τα τέσσερα 1 (στήλες 00 και 10, και οι δύο γραμμές) σχηματίζουν μία τετράδα. Σταθερό μένει μόνο το $C = 0$ → $F = C'$.${ia2Fig(ia2KMap(["A", "B", "C"], [0, 2, 4, 6], { groups: ["--0"], size: 44 }))}` },
    { level: 2, type: "mc", q: R`Να απλοποιήσετε την $F(A, B, C, D) = \Sigma(1, 3, 9, 11)$.`, options: [R`$F = B'D$`, R`$F = B'D'$`, R`$F = A'B'D$`, R`$F = BD$`], correct: 0,
      hint: R`Τα κελιά είναι στις γραμμές 00 και 10 (γειτονικές), στήλες 01 και 11.`, sol: R`Τετράδα με «αναδίπλωση» γραμμών: το $B = 0$ και το $D = 1$ μένουν σταθερά → $F = B'D$.${ia2Fig(ia2KMap(["A", "B", "C", "D"], [1, 3, 9, 11], { groups: ["-0-1"], size: 40 }))}` },
    { level: 2, type: "mc", q: R`Δίνεται $F(A, B, C) = AB'C + A'BC + ABC$. Η απλούστερη μορφή της (με χάρτη Karnaugh) είναι:`, options: [R`$F = AC + BC$`, R`$F = C$`, R`$F = AB + C$`, R`$F = (A + B)C'$`], correct: 0,
      hint: R`$F = \Sigma(3, 5, 7)$.`, sol: R`$F = \Sigma(3, 5, 7)$. Δυάδες: $m_5, m_7$ → $AC$ και $m_3, m_7$ → $BC$. Άρα $F = AC + BC$ (= $C(A + B)$).${ia2Fig(ia2KMap(["A", "B", "C"], [3, 5, 7], { groups: ["1-1", "-11"], size: 44 }))}` },
    { level: 3, type: "mc", q: R`Να απλοποιήσετε την $F(A, B, C, D) = \Sigma(0, 1, 2, 3, 8, 9, 10, 11)$.`, options: [R`$F = B'$`, R`$F = A'B'$`, R`$F = B'C'$`, R`$F = A' + B'$`], correct: 0,
      hint: R`Ποιες γραμμές του χάρτη είναι γεμάτες;`, sol: R`Οι γραμμές $AB = 00$ και $AB = 10$ είναι γεμάτες με 1 και είναι γειτονικές (αναδίπλωση): μία <b>οκτάδα</b>. Σταθερό μένει μόνο $B = 0$ → $F = B'$.${ia2Fig(ia2KMap(["A", "B", "C", "D"], [0, 1, 2, 3, 8, 9, 10, 11], { groups: ["-0--"], size: 40 }))}` },
    { level: 3, type: "mc", q: R`Να απλοποιήσετε την $F(A, B, C, D) = \Sigma(0, 2, 5, 7, 8, 10, 13, 15)$.`, options: [R`$F = B'D' + BD$`, R`$F = B'D + BD'$`, R`$F = A'B'D' + ABD$`, R`$F = D'$`], correct: 0,
      hint: R`Οι τέσσερις γωνίες και τα τέσσερα κεντρικά κελιά.`, sol: R`Γωνίες (0, 2, 8, 10) → $B'D'$· κεντρική τετράδα (5, 7, 13, 15) → $BD$. $F = B'D' + BD$.${ia2Fig(ia2KMap(["A", "B", "C", "D"], [0, 2, 5, 7, 8, 10, 13, 15], { groups: ["-0-0", "-1-1"], size: 40 }))}` },
    { level: 3, type: "mc", q: R`(Θέμα τύπου Παγκυπρίων) Δίνεται $F(A, B, C) = A'B'C' + AB'C + ABC + A'BC'$. Η συνάρτηση στην πιο απλή της μορφή είναι:`, options: [R`$F = A'C' + AC$`, R`$F = A'B'C' + AC$`, R`$F = B'C' + BC$`, R`$F = A \oplus C$`], correct: 0,
      hint: R`$F = \Sigma(0, 2, 5, 7)$. Θυμήσου ότι οι στήλες 00 και 10 είναι γειτονικές.`, sol: R`$m_0, m_2$ → $A'C'$ · $m_5, m_7$ → $AC$. $F = A'C' + AC$ (δηλαδή XNOR των A, C — όχι XOR).${ia2Fig(ia2KMap(["A", "B", "C"], [0, 2, 5, 7], { groups: ["0-0", "1-1"], size: 44 }))}` }
  ]
},
/* ───────────────────────────── 2.7 ───────────────────────────── */
{
  id: "2.7", unit: 2, title: "Ημιαθροιστής και πλήρης αθροιστής (half adder, full adder) — δυαδικός αθροιστής 4 bit",
  book: "Βιβλίο Γ΄ Λυκείου: Γ2.1 §11–12 Ημιαθροιστής, Πλήρης Αθροιστής (σ. 42–46)",
  intro: "Πώς προσθέτει ο υπολογιστής δυαδικούς αριθμούς με λογικές πύλες — τι είναι ο ημιαθροιστής και ο πλήρης αθροιστής;",
  thumb: ICON("1+1", "red"),
  theory: R`
<p>Η πρόσθεση δυαδικών αριθμών γίνεται στον επεξεργαστή από <b>κυκλώματα αθροιστών</b> φτιαγμένα από λογικές πύλες. Ο <b>ημιαθροιστής</b> (half adder, HA) προσθέτει δύο bits· ο <b>πλήρης αθροιστής</b> (full adder, FA) προσθέτει τρία bits (δύο ψηφία και το κρατούμενο της προηγούμενης τάξης). Συνδέοντας έναν ημιαθροιστή και πλήρεις αθροιστές στη σειρά φτιάχνουμε έναν <b>δυαδικό αθροιστή</b> οσωνδήποτε bits.</p>
<div class="tbox def"><h4>Ημιαθροιστής (Half Adder)</h4>
<p>Δέχεται δύο δυαδικά ψηφία $A$, $B$ και δίνει δύο εξόδους: το <b>άθροισμα</b> $S$ και το <b>κρατούμενο</b> $C$.</p>
<div class="ia2row"><div><table class="tbl ia2tt"><tr><th>Πράξη</th><th>A</th><th>B</th><th class="ia2o">S</th><th class="ia2o">C</th></tr>
<tr><td>0 + 0 = 0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td>0 + 1 = 1</td><td>0</td><td>1</td><td>1</td><td>0</td></tr><tr><td>1 + 0 = 1</td><td>1</td><td>0</td><td>1</td><td>0</td></tr><tr><td>1 + 1 = 10</td><td>1</td><td>1</td><td>0</td><td>1</td></tr></table></div>
<div style="flex:1 1 240px"><p>Η στήλη του $S$ (0110) είναι η πύλη <b>XOR</b>· η στήλη του $C$ (0001) είναι η πύλη <b>AND</b>:</p><div class="fbox">$$S = A \oplus B \qquad C = A\,B$$</div></div></div>
<div class="figrow">${ia2Fig(ia2Circuit("A ⊕ B", { out: "S" }), "S = A ⊕ B")}${ia2Fig(ia2Circuit("AB", { out: "C" }), "C = AB")}</div></div>
<div class="tbox def"><h4>Πλήρης Αθροιστής (Full Adder)</h4>
<p>Στην πρόσθεση πολυψήφιων αριθμών, σε κάθε τάξη προσθέτουμε <b>τρία</b> ψηφία: $A$, $B$ και το κρατούμενο $C$ από την προηγούμενη (λιγότερο σημαντική) τάξη. Ο πλήρης αθροιστής δίνει το άθροισμα $S$ και το κρατούμενο εξόδου <b>outC</b>. Με 3 εισόδους ο πίνακας αλήθειας έχει $2^3 = 8$ γραμμές:</p>
<div class="ia2row"><div><table class="tbl ia2tt"><tr><th>A</th><th>B</th><th>C</th><th class="ia2o">S</th><th class="ia2o">outC</th></tr>
${[[0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 0], [0, 0, 1], [0, 1, 1], [1, 0, 1], [1, 1, 1]].map(r => { const s = r[0] + r[1] + r[2]; return `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="ia2o${s & 1 ? " ia2one" : ""}">${s & 1}</td><td class="ia2o">${s >> 1}</td></tr>`; }).join("")}</table><p class="small muted">(Με τη σειρά γραμμών του βιβλίου.)</p></div>
<div style="flex:1 1 260px"><div class="figrow">${ia2Fig(ia2KMap(["A", "B", "C"], [1, 2, 4, 7], { size: 40, groups: ["001", "010", "100", "111"] }), "S: κανένα 1 γειτονικό")}${ia2Fig(ia2KMap(["A", "B", "C"], [3, 5, 6, 7], { size: 40, groups: ["11-", "1-1", "-11"] }), "outC: τρεις δυάδες")}</div></div></div>
<div class="fbox">$$S = AB'C' + A'B'C + ABC + A'BC' = A \oplus B \oplus C \qquad outC = AB + AC + BC$$</div>
<p>Ο χάρτης του $S$ μοιάζει με σκακιέρα: κανένα 1 δεν είναι γειτονικό με άλλο, άρα το $S$ <b>δεν απλοποιείται</b> με Karnaugh (είναι η XOR τριών εισόδων: 1 για περιττό πλήθος μονάδων). Το outC είναι η συνάρτηση πλειοψηφίας.</p>
${ia2Fig(ia2Circuit("AB'C' + A'B'C + ABC + A'BC'", { out: "S", scale: 1.15 }), "S σε μορφή αθροίσματος γινομένων")}${ia2Fig(ia2Circuit("AB + AC + BC", { out: "outC" }), "outC = AB + AC + BC")}</div>
<div class="tbox thm"><h4>Πλήρης αθροιστής από δύο ημιαθροιστές</h4>
<p>Εναλλακτική υλοποίηση: ο πρώτος ημιαθροιστής προσθέτει $A + B$ ($S_1 = A \oplus B$, $C_1 = AB$), ο δεύτερος προσθέτει $S_1 + C$ ($S = S_1 \oplus C$, $C_2 = S_1C$) και μια πύλη <b>OR</b> δίνει $outC = C_1 + C_2$. Δηλαδή: <b>Πλήρης αθροιστής = 2 ημιαθροιστές + 1 πύλη OR.</b></p></div>
<div class="tbox ex"><h4>Δυαδικός αθροιστής 4 bit — A = 1011, B = 1010</h4>
<p>Συνδέουμε διαδοχικά <b>έναν ημιαθροιστή</b> (τάξη 0, όπου δεν υπάρχει κρατούμενο εισόδου) και <b>τρεις πλήρεις αθροιστές</b>: το κρατούμενο εξόδου κάθε βαθμίδας συνδέεται στο κρατούμενο εισόδου της επόμενης ($C_i$ = κρατούμενο που βγαίνει από τη βαθμίδα $i$).</p>
<table class="tbl ia2tt"><tr><th>i</th><th>A<sub>i</sub></th><th>B<sub>i</sub></th><th>C<sub>i</sub></th><th>S<sub>i</sub></th></tr><tr><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td></tr><tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td></tr><tr><td>2</td><td>0</td><td>0</td><td>0</td><td>1</td></tr><tr><td>3</td><td>1</td><td>1</td><td>1</td><td>0</td></tr></table>
<p>Αποτέλεσμα: $C_3S_3S_2S_1S_0 = 10101$ (έλεγχος: $11 + 10 = 21 = 10101_2$ ✓). Για αριθμούς 8 bit χρειαζόμαστε 1 ημιαθροιστή και 7 πλήρεις αθροιστές.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>• Σύγχυση S και C στον ημιαθροιστή: S = XOR, C = AND (όχι OR!). • Ξεχνάμε το τελικό κρατούμενο $C_3$ στο αποτέλεσμα (5 bits). • Ο ημιαθροιστής μπαίνει στη <b>λιγότερο σημαντική</b> τάξη (δεξιά), όχι στην πιο σημαντική.</p></div>
`,
  widget: "ia2adder",
  gen: "ia2gAdd",
  exercises: [
    { level: 1, q: R`Ένας ημιαθροιστής δέχεται $A = 1,\ B = 1$. Ποιες είναι οι έξοδοι $S$ και $C$;`, fields: [{ label: "S =", ans: 0 }, { label: "C =", ans: 1 }],
      hint: R`$1 + 1 = 10_2$.`, sol: R`$S = 1 \oplus 1 = 0$, $C = 1 \cdot 1 = 1$ ($1 + 1 = 10_2$).` },
    { level: 1, q: R`Ένας πλήρης αθροιστής δέχεται $A = 1,\ B = 0$ και κρατούμενο εισόδου $C = 1$. Ποιες είναι οι έξοδοι $S$ και outC;`, fields: [{ label: "S =", ans: 0 }, { label: "outC =", ans: 1 }],
      hint: R`$1 + 0 + 1 = 10_2$.`, sol: R`$1 + 0 + 1 = 2 = 10_2$: $S = 0$, outC = 1.` },
    { level: 1, type: "mc", q: R`Το άθροισμα $S$ του ημιαθροιστή υλοποιείται με πύλη:`, options: ["XOR", "AND", "OR", "NAND"], correct: 0,
      hint: R`Η στήλη του S είναι 0110.`, sol: R`$S = A \oplus B$ — πύλη <b>XOR</b> (το κρατούμενο $C = AB$ με πύλη AND).` },
    { level: 1, type: "mc", q: R`Ένας πλήρης αθροιστής μπορεί να κατασκευαστεί από:`, options: [R`δύο ημιαθροιστές και μία πύλη OR`, R`δύο ημιαθροιστές και μία πύλη AND`, R`έναν ημιαθροιστή και μία πύλη XOR`, R`τρεις πύλες XOR`], correct: 0,
      hint: R`Τα δύο κρατούμενα των ημιαθροιστών συνδυάζονται σε ένα.`, sol: R`$S = (A \oplus B) \oplus C$ με δύο ημιαθροιστές, και $outC = C_1 + C_2$ με μία πύλη <b>OR</b>.` },
    { level: 2, q: R`Πόσοι πλήρεις αθροιστές χρειάζονται (μαζί με έναν ημιαθροιστή) για δυαδικό αθροιστή αριθμών των 8 bit;`, fields: [{ label: "Πλήρεις αθροιστές:", ans: 7 }],
      hint: R`Μία βαθμίδα ανά bit· η πρώτη είναι ημιαθροιστής.`, sol: R`8 βαθμίδες: 1 ημιαθροιστής (bit 0) + <b>7</b> πλήρεις αθροιστές.` },
    { level: 2, q: R`Οι αριθμοί $A = 0110$ και $B = 0111$ προστίθενται σε δυαδικό αθροιστή 4 bit. Να γράψετε το αποτέλεσμα $C_3S_3S_2S_1S_0$.`, fields: [{ label: "C₃S₃S₂S₁S₀ =", ans: "01101", text: true, nospace: true }],
      hint: R`Ξεκίνα από το bit 0. Έλεγξε με δεκαδικούς: 6 + 7.`, sol: R`i=0: 0+1 → S=1, C=0 · i=1: 1+1+0 → S=0, C=1 · i=2: 1+1+1 → S=1, C=1 · i=3: 0+0+1 → S=1, C=0. Αποτέλεσμα <b>01101</b> = 13 = 6 + 7 ✓.` },
    { level: 2, q: R`Για $A = 1011$ και $B = 0110$ σε δυαδικό αθροιστή 4 bit, να βρείτε τα κρατούμενα $C_1$, $C_2$ και το αποτέλεσμα $C_3S_3S_2S_1S_0$.`,
      fields: [{ label: "C<sub>1</sub> =", ans: 1 }, { label: "C<sub>2</sub> =", ans: 1 }, { label: "C₃S₃S₂S₁S₀ =", ans: "10001", text: true, nospace: true }],
      hint: R`$C_i$ είναι το κρατούμενο που <i>βγαίνει</i> από τη βαθμίδα $i$.`, sol: R`<table class="tbl ia2tt"><tr><th>i</th><th>A<sub>i</sub></th><th>B<sub>i</sub></th><th>C<sub>i</sub></th><th>S<sub>i</sub></th></tr><tr><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td></tr><tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td></tr><tr><td>2</td><td>0</td><td>1</td><td>1</td><td>0</td></tr><tr><td>3</td><td>1</td><td>0</td><td>1</td><td>0</td></tr></table>Αποτέλεσμα <b>10001</b> = 17 = 11 + 6 ✓.` },
    { level: 2, type: "mc", q: R`Το κρατούμενο εξόδου του πλήρους αθροιστή είναι $outC = AB + AC + BC$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Πότε προκύπτει κρατούμενο στην πρόσθεση τριών bits;`, sol: R`<b>Σωστό.</b> Κρατούμενο έχουμε όταν τουλάχιστον δύο από τα τρία bits είναι 1 — η συνάρτηση πλειοψηφίας $AB + AC + BC$.` },
    { level: 3, q: R`Να γράψετε το άθροισμα $S$ του πλήρους αθροιστή ως άθροισμα ελαχιστόρων των $A, B, C$ (αριθμοί, αύξουσα σειρά, με κόμμα).`, fields: [{ label: "S = Σ(", ans: "1,2,4,7", text: true, nospace: true }],
      hint: R`Το S είναι 1 όταν το πλήθος των μονάδων είναι περιττό.`, sol: R`Περιττό πλήθος μονάδων: 001 = 1, 010 = 2, 100 = 4, 111 = 7. $S = \Sigma(1, 2, 4, 7)$.` },
    { level: 3, type: "mc", q: R`Γιατί η έξοδος $S$ του πλήρους αθροιστή δεν απλοποιείται με χάρτη Karnaugh;`, options: [R`Γιατί κανένα κελί με τιμή 1 δεν είναι γειτονικό με άλλο κελί με τιμή 1`, R`Γιατί έχει περισσότερα από τέσσερα 1`, R`Γιατί οι χάρτες Karnaugh δεν εφαρμόζονται σε 3 μεταβλητές`, R`Γιατί περιέχει πύλη OR`], correct: 0,
      hint: R`Σχεδίασε τον χάρτη του $\Sigma(1, 2, 4, 7)$.`, sol: R`Τα 1 βρίσκονται σε διάταξη «σκακιέρας»: γειτονικά κελιά διαφέρουν σε ένα bit, άρα έχουν διαφορετική ισοτιμία και ποτέ δεν είναι και τα δύο 1. Κάθε 1 μένει μόνο του, άρα $S = AB'C' + A'B'C + ABC + A'BC'$.` }
  ]
},
/* ───────────────────────────── 3.1 ───────────────────────────── */
{
  id: "3.1", unit: 3, title: "Μεταβλητές, τύποι δεδομένων, είσοδος και έξοδος στη C++ (cin, cout, setw, setprecision)",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.1 §2 Απλά προγράμματα (σ. 71–74)",
  intro: "Πώς δηλώνουμε μεταβλητές και σταθερές στη C++, πώς διαβάζουμε τιμές με cin και πώς τυπώνουμε αποτελέσματα με cout, setw και setprecision;",
  thumb: ICON("cin>>", "blue"),
  theory: R`
<p>Κάθε πρόγραμμα της C++ που γράφουμε για τις Παγκύπριες έχει την ίδια βασική δομή: δηλώνουμε τις <b>βιβλιοθήκες</b> που χρειαζόμαστε, γράφουμε τη <b>συνάρτηση main</b> και μέσα σε αυτήν δηλώνουμε <b>μεταβλητές</b>, διαβάζουμε δεδομένα με την <b>cin</b>, κάνουμε υπολογισμούς και εμφανίζουμε τα αποτελέσματα με την <b>cout</b>. Σε αυτή την ενότητα κάνουμε επανάληψη της ύλης της Β΄ Λυκείου: τύποι δεδομένων, δήλωση μεταβλητών και σταθερών, είσοδος/έξοδος και μορφοποίηση εξόδου.</p>
<div class="tbox ex"><h4>Ένα απλό πρόγραμμα C++</h4>
<p>Το πρόγραμμα διαβάζει δύο ακέραιους και τυπώνει το άθροισμά τους.</p>
${CPP(`
#include <iostream>
using namespace std;
int main() {
    int a, b, sum;
    cin >> a >> b;
    sum = a + b;
    cout << "SUM=" << sum;
    return 0;
}`, { title: "sum.cpp" })}
<p>Με είσοδο <code>4 7</code>: ${OUT(`SUM=11`)}</p>
<ul><li><code>#include &lt;iostream&gt;</code>: η βιβλιοθήκη για είσοδο από πληκτρολόγιο και έξοδο στην οθόνη. Άλλες βιβλιοθήκες που χρησιμοποιούμε: <code>&lt;iomanip&gt;</code> (μορφοποίηση), <code>&lt;cmath&gt;</code> (μαθηματικές συναρτήσεις), <code>&lt;string&gt;</code>.</li>
<li><code>int a, b, sum;</code>: δήλωση τριών μεταβλητών ακέραιου τύπου.</li>
<li><code>cin &gt;&gt; a &gt;&gt; b;</code>: είσοδος — πριν από κάθε μεταβλητή μπαίνει ο τελεστής <code>&gt;&gt;</code>.</li>
<li><code>cout &lt;&lt; "SUM=" &lt;&lt; sum;</code>: έξοδος — ό,τι είναι σε διπλά εισαγωγικά τυπώνεται αυτούσιο.</li></ul></div>
<div class="tbox def"><h4>Τύποι δεδομένων της C++</h4>
<table class="tbl"><tr><th>Τύπος</th><th>Διάκριση</th><th>Bytes</th><th>Εμβέλεια</th></tr>
<tr><td><code>char</code></td><td>χαρακτήρας</td><td>1</td><td>−128 έως 127</td></tr>
<tr><td><code>short</code></td><td>ακέραιος</td><td>2</td><td>−32 768 έως 32 767</td></tr>
<tr><td><code>int</code></td><td>ακέραιος</td><td>4</td><td>−2 147 483 648 έως 2 147 483 647</td></tr>
<tr><td><code>long long</code></td><td>ακέραιος</td><td>8</td><td>περίπου ±9,2·10<sup>18</sup></td></tr>
<tr><td><code>float</code></td><td>πραγματικός</td><td>4</td><td>1.2E−38 έως 3.4E+38</td></tr>
<tr><td><code>double</code></td><td>πραγματικός</td><td>8</td><td>2.2E−308 έως 1.8E+308</td></tr>
<tr><td><code>long double</code></td><td>πραγματικός</td><td>16</td><td>3.4E−4932 έως 1.2E+4932</td></tr>
<tr><td><code>bool</code></td><td>λογική τιμή</td><td>1</td><td>true ή false</td></tr></table>
<p>Μια <b>μεταβλητή</b> είναι μια θέση μνήμης με όνομα, στην οποία αποθηκεύεται μια τιμή συγκεκριμένου τύπου. Τη δηλώνουμε οπουδήποτε μέσα στη main, πριν τη χρησιμοποιήσουμε, και μπορούμε να της δώσουμε αρχική τιμή κατά τη δήλωση:</p>
${CPP(`
int num = 10;
int kpak = 4, jpak = kpak + 2;
double ratio = 25.56;
bool check = false;
char alpha = 'A', beta = 'B';`, { nonum: true })}
<p>Το όνομα μιας μεταβλητής γράφεται με λατινικούς χαρακτήρες, ψηφία και <code>_</code>, <b>δεν</b> αρχίζει με ψηφίο, δεν είναι δεσμευμένη λέξη (π.χ. <code>int</code>, <code>for</code>) και η C++ ξεχωρίζει κεφαλαία από μικρά (<code>sum</code> ≠ <code>Sum</code>).</p></div>
<div class="tbox def"><h4>Σταθερές: const και #define</h4>
<p>Μια <b>σταθερά</b> έχει τιμή που δεν μπορεί να αλλάξει μετά την αρχικοποίηση. Δηλώνεται με τη λέξη <code>const</code> μπροστά από τη δήλωση ή με την οδηγία <code>#define</code>:</p>
${CPP(`
#define p 3.14              // σταθερά με #define (χωρίς = και ;)
const float fpa = 0.23;     // σταθερά με const`, { nonum: true })}
<p>Η ορθότητα μιας δήλωσης <code>const</code> ελέγχεται αμέσως από τον μεταγλωττιστή, ενώ το <code>#define</code> είναι απλή <b>αντικατάσταση κειμένου</b>: ένα λάθος εμφανίζεται στη γραμμή όπου χρησιμοποιείται η σταθερά και όχι στη δήλωσή της.</p></div>
<div class="tbox def"><h4>Μορφοποίηση εξόδου: endl, setw, fixed, setprecision</h4>
<ul><li><code>endl</code>: αλλαγή γραμμής (end line).</li>
<li><code>setw(n)</code> (βιβλιοθήκη <code>&lt;iomanip&gt;</code>): η <b>αμέσως επόμενη</b> τιμή τυπώνεται σε πλάτος n θέσεων, στοιχισμένη δεξιά· οι κενές θέσεις συμπληρώνονται με κενά.</li>
<li><code>fixed &lt;&lt; setprecision(n)</code>: οι πραγματικοί αριθμοί τυπώνονται με <b>ακριβώς n δεκαδικά ψηφία</b>, με στρογγυλοποίηση. Χωρίς το <code>fixed</code> η setprecision μετρά σημαντικά ψηφία — γι' αυτό γράφουμε πάντα πρώτα το <code>fixed</code>.</li></ul>
${CPP(`
cout << "Long" << setw(5) << "live" << setw(4) << "and" << setw(8) << "prosper";`, { nonum: true })}
${OUT(`Long live and prosper`)}
<p>Το «live» έχει 4 χαρακτήρες σε πλάτος 5 → 1 κενό· το «and» 3 σε πλάτος 4 → 1 κενό· το «prosper» 7 σε πλάτος 8 → 1 κενό.</p></div>
<div class="tbox ex"><h4>Τελική τιμή με ΦΠΑ 23% (βιβλίο, Παράδειγμα 1.2)</h4>
${CPP(`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    const float fpa = 0.23;
    float cost;
    cin >> cost;
    cout << fixed << setprecision(2) << cost + cost * fpa;
    return 0;
}`, { title: "fpa.cpp", hl: [8] })}
<details class="steps"><summary>Λύση βήμα-βήμα για είσοδο 80</summary><p>cost = 80 → cost + cost·fpa = 80 + 18,4 = 98,4 → με <code>fixed</code> και 2 δεκαδικά:</p>${OUT(`98.40`)}</details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p><code>cin &gt;&gt; a, b;</code> (σωστό: <code>cin &gt;&gt; a &gt;&gt; b;</code>) · <code>cout &gt;&gt; x;</code> (σωστό: <code>cout &lt;&lt; x;</code>) · παράλειψη του <code>;</code> · χρήση μεταβλητής που δεν δηλώθηκε · ξεχνάμε τη βιβλιοθήκη <code>&lt;iomanip&gt;</code> όταν χρησιμοποιούμε setw/setprecision · ξεχνάμε το <code>fixed</code> πριν από τη setprecision.</p></div>
`,
  widget: "ia3fmt",
  gen: "ia3fmtg",
  exercises: [
    { level: 1, type: "mc", q: R`Ποιον τύπο δεδομένων πρέπει να έχει η μεταβλητή στην οποία θα αποθηκεύσουμε τον <b>μέσο όρο</b> των βαθμών μιας τάξης;`,
      options: ["<code>float</code>", "<code>int</code>", "<code>char</code>", "<code>bool</code>"], correct: 0,
      hint: R`Ο μέσος όρος μπορεί να έχει δεκαδικά ψηφία.`, sol: R`Ο μέσος όρος (π.χ. 15,75) είναι <b>πραγματικός</b> αριθμός, άρα <code>float</code> (ή <code>double</code>). Ο <code>int</code> θα έχανε το δεκαδικό μέρος.` },
    { level: 1, type: "mc", q: R`Η τιμή μιας σταθεράς που δηλώθηκε με <code>const</code> μπορεί να αλλάξει αργότερα στο πρόγραμμα με μια εντολή εκχώρησης.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι σημαίνει «σταθερά»;`, sol: R`<b>ΛΑΘΟΣ.</b> Ούτε με <code>const</code> ούτε με <code>#define</code> επιτρέπεται αλλαγή της τιμής μετά την αρχικοποίηση· μια εντολή όπως <code>fpa = 0.19;</code> δίνει συντακτικό λάθος.` },
    { level: 1, q: R`Τι θα εμφανίσει το πιο κάτω τμήμα προγράμματος;${CPP(`
int a = 7, b = 3;
cout << "SUM=" << a + b << endl;`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: "SUM=10", text: true, cs: true }],
      hint: R`Το κείμενο στα εισαγωγικά τυπώνεται όπως είναι· μετά τυπώνεται η τιμή της παράστασης.`, sol: R`Τυπώνεται το «SUM=» και μετά η τιμή του <code>a + b</code> = 10 (χωρίς κενό ανάμεσα): ${OUT(`SUM=10`)}` },
    { level: 1, q: R`Πόσα bytes μνήμης καταλαμβάνει μια μεταβλητή τύπου <code>int</code> (σύμφωνα με τον πίνακα του βιβλίου);`, fields: [{ label: "Bytes:", ans: 4 }],
      hint: R`Δες τον πίνακα τύπων δεδομένων.`, sol: R`Ο <code>int</code> καταλαμβάνει <b>4 bytes</b> (εμβέλεια −2 147 483 648 έως 2 147 483 647).` },
    { level: 2, q: R`Τι θα εμφανίσει η πιο κάτω εντολή;${CPP(`
cout << fixed << setprecision(2) << 10.0 / 4 + 1;`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: "3.50", text: true }],
      hint: R`Το 10.0 είναι πραγματικός, άρα η διαίρεση είναι πραγματική.`, sol: R`$10.0 / 4 = 2.5$ και $2.5 + 1 = 3.5$. Με <code>fixed</code> και <code>setprecision(2)</code> τυπώνονται ακριβώς δύο δεκαδικά: ${OUT(`3.50`)}` },
    { level: 2, q: R`Πόσα <b>κενά διαστήματα</b> συνολικά θα εμφανίσει η εντολή;${CPP(`
cout << "Long" << setw(5) << "live" << setw(4) << "and" << setw(8) << "prosper";`, { nonum: true })}`, fields: [{ label: "Κενά:", ans: 3 }],
      hint: R`Για κάθε setw: κενά = πλάτος − πλήθος χαρακτήρων της τιμής που ακολουθεί.`, sol: R`«live»: $5 - 4 = 1$ · «and»: $4 - 3 = 1$ · «prosper»: $8 - 7 = 1$ → συνολικά <b>3</b> κενά. ${OUT(`Long live and prosper`)}` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα αν ο χρήστης δώσει την τιμή <b>100</b>;${CPP(`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    const float fpa = 0.23;
    float cost;
    cin >> cost;
    cout << fixed << setprecision(2) << cost + cost * fpa;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "123.00", text: true }],
      hint: R`Υπολόγισε $100 + 100 \cdot 0{,}23$.`, sol: R`$100 + 100 \cdot 0.23 = 123$, που τυπώνεται με δύο δεκαδικά: ${OUT(`123.00`)}` },
    { level: 2, type: "mc", q: R`Ποια από τις πιο κάτω δηλώσεις είναι <b>λανθασμένη</b>;`,
      options: ["<code>int 2x = 5;</code>", "<code>float ratio = 25.56;</code>", "<code>char alpha = 'A';</code>", "<code>bool check = false;</code>"], correct: 0,
      hint: R`Θυμήσου τους κανόνες για τα ονόματα μεταβλητών.`, sol: R`Το όνομα μεταβλητής <b>δεν μπορεί να αρχίζει με ψηφίο</b>, άρα η <code>int 2x = 5;</code> είναι λανθασμένη. Οι άλλες τρεις είναι σωστές δηλώσεις με αρχική τιμή.` },
    { level: 3, q: R`Το πιο κάτω πρόγραμμα πρέπει να διαβάζει δύο ακέραιους και να τυπώνει τον μέσο όρο των ψηφίων των μονάδων τους (π.χ. για 123 και 56 → 4.5). Υπάρχουν <b>4 λάθη</b> (συντακτικά ή λογικά). Γράψε τους αριθμούς των γραμμών τους σε αύξουσα σειρά.${CPP(`
#include <iostream>
using namespace std;
int main() {
    int a, b, m1, m2;
    float mesos;
    cin >> a, b;
    m1 = a % 10;
    m2 = a % 10;
    mesos = (m1 + m2) / 2;
    cout >> mesos;
    return 0;
}`)}`, fields: [{ label: "1ο λάθος — γραμμή", ans: 6 }, { label: "2ο λάθος — γραμμή", ans: 8 }, { label: "3ο λάθος — γραμμή", ans: 9 }, { label: "4ο λάθος — γραμμή", ans: 10 }],
      hint: R`Έλεγξε: την είσοδο, ποια μεταβλητή χρησιμοποιείται για το m2, τη διαίρεση ακεραίων και την έξοδο.`,
      sol: R`<ul><li>Γραμμή 6: <code>cin &gt;&gt; a &gt;&gt; b;</code> — <b>λογικό λάθος</b>: το <code>cin &gt;&gt; a, b;</code> μεταγλωττίζεται (τελεστής κόμματος), αλλά το b δεν διαβάζεται.</li><li>Γραμμή 8: <code>m2 = b % 10;</code> (λογικό).</li><li>Γραμμή 9: <code>mesos = (m1 + m2) / 2.0;</code> — αλλιώς γίνεται ακέραια διαίρεση και το 4.5 γίνεται 4 (λογικό).</li><li>Γραμμή 10: <code>cout &lt;&lt; mesos;</code> (συντακτικό).</li></ul>
${CPP(`
#include <iostream>
using namespace std;
int main() {
    int a, b, m1, m2;
    float mesos;
    cin >> a >> b;
    m1 = a % 10;
    m2 = b % 10;
    mesos = (m1 + m2) / 2.0;
    cout << mesos;
    return 0;
}`, { hl: [6, 8, 9, 10] })} Για είσοδο <code>123 56</code>: ${OUT(`4.5`)}` },
    { level: 3, q: R`Το πρόγραμμα υπολογίζει τον όγκο κυλίνδρου $V = h \cdot \pi \cdot R^2$. Τι θα εμφανίσει για <b>R = 2</b> και <b>h = 5</b>;${CPP(`
#include <iostream>
#define p 3.14
using namespace std;
int main() {
    float R, V, h;
    cout << "R=";
    cin >> R;
    cout << "h=";
    cin >> h;
    V = h * p * R * R;
    cout << "V=" << V;
    return 0;
}`)}<span class="muted small">Γράψε μόνο την τελευταία έξοδο (μετά τα μηνύματα R= και h=).</span>`, fields: [{ label: "Έξοδος:", ans: "V=62.8", text: true, cs: true }],
      hint: R`Η σταθερά p αντικαθίσταται με 3.14. Η cout χωρίς fixed δεν τυπώνει περιττά μηδενικά.`, sol: R`$V = 5 \cdot 3.14 \cdot 2 \cdot 2 = 62.8$. Χωρίς <code>fixed</code>/<code>setprecision</code> η cout τυπώνει τον αριθμό χωρίς περιττά μηδενικά: ${OUT(`R=h=V=62.8`)} <span class="muted">(τα «R=» και «h=» είναι τα μηνύματα εισόδου· οι τιμές 2 και 5 που πληκτρολογεί ο χρήστης εμφανίζονται κι αυτές στην οθόνη.)</span>` }
  ]
},
/* ───────────────────────────── 3.2 ───────────────────────────── */
{
  id: "3.2", unit: 3, title: "Τελεστές στη C++: / και %, προτεραιότητα, ++ και --, λογικοί τελεστές και έτοιμες συναρτήσεις cmath",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.1 §2 Τελεστές, Όρια και Συναρτήσεις (σ. 74–76)",
  intro: "Γιατί στη C++ το 7 / 2 κάνει 3, τι είναι ο τελεστής %, και πώς υπολογίζουμε εκφράσεις με sqrt, pow, trunc, round όπως στις Παγκύπριες;",
  thumb: ICON("17%5", "purple"),
  theory: R`
<p>Οι <b>τελεστές της C++</b> και οι <b>έτοιμες συναρτήσεις της βιβλιοθήκης cmath</b> εμφανίζονται σχεδόν σε κάθε δοκίμιο των Παγκυπρίων: «να γράψετε το αποτέλεσμα της εντολής…», «να γράψετε τις τιμές των λογικών μεταβλητών…». Το κλειδί είναι να ξέρουμε <b>τον τύπο</b> κάθε τιμής (ακέραιος ή πραγματικός) και <b>τη σειρά</b> με την οποία γίνονται οι πράξεις.</p>
<div class="tbox def"><h4>Αριθμητικοί τελεστές</h4>
<table class="tbl"><tr><th>Τελεστής</th><th>Πράξη</th><th>Παράδειγμα</th></tr>
<tr><td><code>+ - *</code></td><td>πρόσθεση, αφαίρεση, πολλαπλασιασμός</td><td><code>3 * 4</code> → 12</td></tr>
<tr><td><code>/</code></td><td>διαίρεση — <b>ακέραια</b> αν και οι δύο τελεστέοι είναι ακέραιοι</td><td><code>17 / 5</code> → 3 · <code>17.0 / 5</code> → 3.4</td></tr>
<tr><td><code>%</code></td><td>υπόλοιπο ακέραιας διαίρεσης (μόνο ακέραιοι)</td><td><code>17 % 5</code> → 2</td></tr></table>
<p>Στην ακέραια διαίρεση το δεκαδικό μέρος <b>αποκόπτεται</b> (στρογγυλοποίηση προς το μηδέν): <code>-17 / 5</code> → −3 και το υπόλοιπο έχει το πρόσημο του διαιρετέου: <code>-17 % 5</code> → −2. Ισχύει πάντα <code>(a / b) * b + a % b == a</code>.</p>
<div class="fbox">$$\text{ψηφίο μονάδων} = n \,\%\, 10, \qquad \text{ψηφίο δεκάδων} = n / 10 \,\%\, 10$$</div></div>
<div class="tbox thm"><h4>Προτεραιότητα τελεστών</h4>
<p>1) παρενθέσεις <code>()</code> → 2) <code>*  /  %</code> → 3) <code>+  -</code>. Τελεστές με ίδια προτεραιότητα εκτελούνται <b>από αριστερά προς τα δεξιά</b>. Παράδειγμα: <code>2 + 3 * 4 % 5</code> = <code>2 + (12 % 5)</code> = 2 + 2 = <b>4</b>.</p></div>
<div class="tbox def"><h4>Μετατροπή τύπου (type casting)</h4>
<p>Για να γίνει <b>πραγματική</b> διαίρεση δύο ακεραίων μετατρέπουμε τον έναν σε πραγματικό: <code>U = float(X) / T;</code> ή <code>mesos = (float) sum / metritis;</code>. Προσοχή: η <code>float(X / T)</code> είναι λάθος — η ακέραια διαίρεση έχει ήδη γίνει!</p></div>
<div class="tbox def"><h4>Τελεστές αύξησης/μείωσης και σύνθετης εκχώρησης</h4>
<p><code>a++; a += 1; a = a + 1;</code> είναι ισοδύναμα. Επίσης <code>b *= a;</code> ≡ <code>b = b * a;</code> και <code>x /= y;</code> ≡ <code>x = x / y;</code>. Σε μια έκφραση όμως έχει σημασία αν ο τελεστής είναι <b>πρόθεμα</b> ή <b>επίθεμα</b>:</p>
${CPP(`
int a, b, c, d;
a = 4;
b = ++a;                        // πρώτα αυξάνεται το a, μετά εκχωρείται
cout << a << " " << b << endl;  // 5 5
c = 4;
d = c++;                        // πρώτα εκχωρείται, μετά αυξάνεται το c
cout << c << " " << d << endl;  // 5 4`)}</div>
<div class="tbox def"><h4>Συγκριτικοί και λογικοί τελεστές</h4>
<p>Συγκρίσεις: <code>==  !=  &gt;  &lt;  &gt;=  &lt;=</code> (η ισότητα είναι <code>==</code>, όχι <code>=</code>). Λογικοί: <b>AND</b> <code>&amp;&amp;</code>, <b>OR</b> <code>||</code>, <b>NOT</b> <code>!</code>, με προτεραιότητα <code>!</code> → <code>&amp;&amp;</code> → <code>||</code>.</p>
<table class="tbl"><tr><th>X</th><th>Y</th><th>X &amp;&amp; Y</th><th>X || Y</th><th>!X</th></tr><tr><td>true</td><td>true</td><td>true</td><td>true</td><td>false</td></tr><tr><td>true</td><td>false</td><td>false</td><td>true</td><td>false</td></tr><tr><td>false</td><td>true</td><td>false</td><td>true</td><td>true</td></tr><tr><td>false</td><td>false</td><td>false</td><td>false</td><td>true</td></tr></table>
<p>Η <code>cout</code> τυπώνει μια λογική τιμή ως <b>1</b> (true) ή <b>0</b> (false). Επειδή ο <code>&lt;&lt;</code> έχει μεγαλύτερη προτεραιότητα από τους συγκριτικούς και τους λογικούς τελεστές, γράφουμε τη λογική έκφραση <b>μέσα σε παρένθεση</b>: <code>cout &lt;&lt; (x &gt; 0 &amp;&amp; y &gt; 0);</code></p></div>
<div class="tbox def"><h4>Έτοιμες συναρτήσεις της βιβλιοθήκης &lt;cmath&gt;</h4>
<table class="tbl"><tr><th>Συνάρτηση</th><th>Επιστρέφει</th><th>Παράδειγμα</th></tr>
<tr><td><code>sqrt(x)</code></td><td>τετραγωνική ρίζα (πραγματικός)</td><td><code>sqrt(9)</code> = 3.0</td></tr>
<tr><td><code>abs(x)</code></td><td>απόλυτη τιμή (ίδιου τύπου με το x)</td><td><code>abs(-2)</code> = 2 · <code>abs(-3.1)</code> = 3.1</td></tr>
<tr><td><code>pow(x, y)</code></td><td>δύναμη $x^y$ (πραγματικός)</td><td><code>pow(2.0, 3.0)</code> = 8.0 · <code>pow(2.0, -1.0)</code> = 0.5</td></tr>
<tr><td><code>trunc(x)</code></td><td>ακέραιο μέρος, αποκόπτοντας τα δεκαδικά</td><td><code>trunc(1.7)</code> = 1.0 · <code>trunc(-2.1)</code> = −2.0</td></tr>
<tr><td><code>round(x)</code></td><td>στρογγυλοποίηση στον πλησιέστερο ακέραιο (το .5 προς τα «έξω»)</td><td><code>round(1.5)</code> = 2.0 · <code>round(-2.5)</code> = −3.0</td></tr></table>
<p>Η βιβλιοθήκη <code>&lt;climits&gt;</code> ορίζει τις σταθερές <code>INT_MAX</code> (2147483647) και <code>INT_MIN</code> (−2147483648), τα όρια του τύπου int. <span class="muted small">(Στο σχόλιο του βιβλίου γράφεται −2147483647, όμως η πραγματική τιμή που τυπώνεται είναι −2147483648.)</span></p>
<p class="muted small">Σημείωση: οι <code>round</code> και <code>trunc</code> (όπως και οι εκδοχές των <code>pow</code>/<code>sqrt</code> με ακέραια ορίσματα) προέρχονται τυπικά από τα πρότυπα C99/C++11. Περιλαμβάνονται όμως στο βιβλίο (σ. 76) και ο g++ τις δέχεται κανονικά με τη <code>&lt;cmath&gt;</code>, οπότε τις χρησιμοποιούμε όπως το βιβλίο.</p></div>
<div class="tbox ex"><h4>Θέμα τύπου Παγκυπρίων</h4>
<p>Να γράψετε το αποτέλεσμα της εντολής <code>cout &lt;&lt; trunc(-6.5 + pow(2, 2)) + abs(round(-sqrt(67)));</code></p>
<details class="steps"><summary>Λύση βήμα-βήμα</summary><p><code>pow(2, 2)</code> = 4 → <code>-6.5 + 4</code> = −2.5 → <code>trunc(-2.5)</code> = −2.<br><code>sqrt(67)</code> ≈ 8.185 → <code>round(-8.185)</code> = −8 → <code>abs(-8)</code> = 8.<br>Άθροισμα: −2 + 8 = 6.</p>${OUT(`6`)}</details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Ξεχνάμε ότι <code>7 / 2</code> = 3 · χρησιμοποιούμε <code>%</code> σε πραγματικούς · γράφουμε <code>1 &lt;= x &lt;= 100</code> αντί για <code>x &gt;= 1 &amp;&amp; x &lt;= 100</code> (η πρώτη είναι πάντα αληθής!) · συγχέουμε <code>trunc</code> με <code>round</code> στους αρνητικούς · ξεχνάμε τη σειρά <code>!</code> → <code>&amp;&amp;</code> → <code>||</code>.</p></div>
`,
  widget: "ia3expr",
  gen: "ia3exprg",
  exercises: [
    { level: 1, q: R`Ποιες τιμές θα εμφανίσουν οι εντολές <code>cout &lt;&lt; 17 / 5;</code> και <code>cout &lt;&lt; 17 % 5;</code>;`, fields: [{ label: "17 / 5 →", ans: 3 }, { label: "17 % 5 →", ans: 2 }],
      hint: R`Και οι δύο τελεστέοι είναι ακέραιοι.`, sol: R`$17 = 3 \cdot 5 + 2$: ακέραιο πηλίκο <b>3</b>, υπόλοιπο <b>2</b>.` },
    { level: 1, q: R`Τι θα εμφανίσει κάθε <code>cout</code>; (μία γραμμή ανά πεδίο)${CPP(`
int a, b, c, d;
a = 4;
b = ++a;
cout << a << " " << b << endl;
c = 4;
d = c++;
cout << c << " " << d << endl;`)}`, fields: [{ label: "1η γραμμή:", ans: "5 5", text: true }, { label: "2η γραμμή:", ans: "5 4", text: true }],
      hint: R`Πρόθεμα (<code>++a</code>): αύξηση και μετά χρήση. Επίθεμα (<code>c++</code>): χρήση και μετά αύξηση.`, sol: R`<code>b = ++a</code>: το a γίνεται 5 και το b παίρνει 5. <code>d = c++</code>: το d παίρνει την παλιά τιμή 4 και μετά το c γίνεται 5. ${OUT(`5 5\n5 4`)}` },
    { level: 2, q: R`Ποιες τιμές θα εμφανίσουν οι εντολές <code>cout &lt;&lt; -17 / 5;</code> και <code>cout &lt;&lt; -17 % 5;</code>;`, fields: [{ label: "-17 / 5 →", ans: -3 }, { label: "-17 % 5 →", ans: -2 }],
      hint: R`Η ακέραια διαίρεση αποκόπτει προς το μηδέν· το υπόλοιπο έχει το πρόσημο του διαιρετέου.`, sol: R`$-17/5 = -3{,}4$ → αποκοπή → <b>−3</b>. Υπόλοιπο: $-17 - (-3)\cdot 5 = -2$.` },
    { level: 2, q: R`Υπολόγισε τις τιμές των εκφράσεων <code>2 + 3 * 4 % 5</code> και <code>(2 + 3) * 4 % 5</code>.`, fields: [{ label: "1η:", ans: 4 }, { label: "2η:", ans: 0 }],
      hint: R`Οι * και % έχουν την ίδια προτεραιότητα και εκτελούνται από αριστερά προς δεξιά.`, sol: R`1η: $3 \cdot 4 = 12$, $12 \% 5 = 2$, $2 + 2 = $ <b>4</b>. 2η: $(2+3) = 5$, $5 \cdot 4 = 20$, $20 \% 5 = $ <b>0</b>.` },
    { level: 2, q: R`Τι θα εμφανίσει το πιο κάτω τμήμα;${CPP(`
int n = 12348889;
cout << n / 10 % 10;`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: 8 }],
      hint: R`Το <code>n / 10</code> «κόβει» το τελευταίο ψηφίο.`, sol: R`$12348889 / 10 = 1234888$ και $1234888 \% 10 = 8$: είναι το <b>ψηφίο των δεκάδων</b>. ${OUT(`8`)}` },
    { level: 2, type: "mc", q: R`Ποια λογική έκφραση της C++ ελέγχει αν η ακέραια μεταβλητή <code>grade</code> είναι μεταξύ 1 και 100, συμπεριλαμβανομένων;`,
      options: ["<code>grade &gt;= 1 &amp;&amp; grade &lt;= 100</code>", "<code>1 &lt;= grade &lt;= 100</code>", "<code>grade &gt;= 1 || grade &lt;= 100</code>", "<code>grade &gt; 1 &amp;&amp; grade &lt; 100</code>"], correct: 0,
      hint: R`Χρειάζονται δύο συγκρίσεις που πρέπει να ισχύουν ταυτόχρονα.`, sol: R`Σωστό: <code>grade &gt;= 1 &amp;&amp; grade &lt;= 100</code>. Η <code>1 &lt;= grade &lt;= 100</code> υπολογίζεται ως <code>(1 &lt;= grade) &lt;= 100</code>, δηλαδή 0 ή 1 ≤ 100 → πάντα αληθής. Με <code>||</code> είναι επίσης πάντα αληθής, και με γνήσιες ανισότητες αποκλείονται τα 1 και 100.` },
    { level: 3, q: R`Να γράψετε το αποτέλεσμα της εντολής (θέμα Παγκυπρίων):${CPP(`
cout << trunc(-6.5 + pow(2, 2)) + abs(round(-sqrt(67)));`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: 6 }],
      hint: R`Υπολόγισε χωριστά τα δύο μέρη: <code>trunc(…)</code> και <code>abs(round(…))</code>.`, sol: R`<code>pow(2,2)</code> = 4, −6.5 + 4 = −2.5, <code>trunc(-2.5)</code> = −2. <code>sqrt(67)</code> ≈ 8.185, <code>round(-8.185)</code> = −8, <code>abs(-8)</code> = 8. Σύνολο −2 + 8 = <b>6</b>. ${OUT(`6`)}` },
    { level: 3, q: R`Οι ακέραιες μεταβλητές έχουν τιμές <code>a = -3</code>, <code>b = 2</code>, <code>c = 4</code>. Ποιες τιμές θα πάρουν οι λογικές μεταβλητές x και y; (γράψε 1 για true, 0 για false)${CPP(`
x = (b != (3 * pow(a, 2) - 1)) && ((abs(a) + trunc((float) b / c)) == b);
y = !((b + c) >= a) || (sqrt(b * 8) <= round(a + 7.3));`, { nonum: true })}`, fields: [{ label: "x =", ans: 0 }, { label: "y =", ans: 1 }],
      hint: R`Υπολόγισε κάθε παρένθεση χωριστά. Θυμήσου: <code>(float) b / c</code> = 0.5.`, sol: R`<b>x:</b> $3 \cdot (-3)^2 - 1 = 26$, άρα $2 \ne 26$ → true. <code>abs(-3)</code> + <code>trunc(0.5)</code> = 3 + 0 = 3, και $3 == 2$ → false. true &amp;&amp; false → <b>x = 0</b>.<br><b>y:</b> $(2+4) \ge -3$ → true, άρα <code>!</code> → false. <code>sqrt(16)</code> = 4, <code>round(4.3)</code> = 4, $4 \le 4$ → true. false || true → <b>y = 1</b>.` },
    { level: 2, q: R`Αν <code>X = 10</code>, <code>Y = 5</code> και <code>Z = -2</code>, γράψε το αποτέλεσμα (1 ή 0) κάθε λογικής έκφρασης:<br>(α) <code>(X &gt; Y) || (X &gt; Z) &amp;&amp; (Y &gt; X)</code><br>(β) <code>!(X == (2 * Y)) &amp;&amp; !(Z == 2)</code><br>(γ) <code>(Y == (X / 2)) &amp;&amp; (Z &gt; 0)</code>`,
      fields: [{ label: "(α)", ans: 1 }, { label: "(β)", ans: 0 }, { label: "(γ)", ans: 0 }],
      hint: R`Το <code>&amp;&amp;</code> εκτελείται πριν από το <code>||</code>.`, sol: R`(α) $(X&gt;Z) \,\&amp;\&amp;\, (Y&gt;X)$ = true &amp;&amp; false = false· μετά true || false = <b>1</b>.<br>(β) $X == 10$ → true, <code>!</code> → false· άρα όλη η σύζευξη <b>0</b>.<br>(γ) $5 == 5$ → true, $Z &gt; 0$ → false → <b>0</b>.` },
    { level: 1, type: "mc", q: R`Η μεταβλητή <code>N</code> είναι τύπου double (π.χ. 56.78). Ποια έκφραση δίνει το <b>δεκαδικό μέρος</b> της (0.78);`,
      options: ["<code>N - trunc(N)</code>", "<code>N % 1</code>", "<code>trunc(N) - N</code>", "<code>round(N) - N</code>"], correct: 0,
      hint: R`Η <code>trunc</code> δίνει το ακέραιο μέρος.`, sol: R`<code>trunc(56.78)</code> = 56, άρα <code>N - trunc(N)</code> = 0.78 (βιβλίο, Παράδειγμα 1.4). Ο <code>%</code> δεν επιτρέπεται σε πραγματικούς, η <code>trunc(N) - N</code> δίνει −0.78 και η <code>round(N) - N</code> δίνει 0.22.` },
    { level: 2, q: R`Ποιες τιμές θα πάρουν οι μεταβλητές x και y;${CPP(`
int x = 7 / 2 * 2.0;
double y = 7 / 2.0 * 2;`, { nonum: true })}`, fields: [{ label: "x =", ans: 6 }, { label: "y =", ans: 7 }],
      hint: R`Πρόσεξε ποια διαίρεση είναι ακέραια.`, sol: R`x: $7/2 = 3$ (ακέραια), $3 \cdot 2.0 = 6.0$ → <b>6</b>. y: $7/2.0 = 3.5$ (πραγματική), $3.5 \cdot 2 = $ <b>7</b>.` }
  ]
},
/* ───────────────────────────── 3.3 ───────────────────────────── */
{
  id: "3.3", unit: 3, title: "Δομή διακλάδωσης στη C++: if, else, ένθετα if και η εντολή switch",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.1 §3 Δομή Διακλάδωσης, §4 Περιπτωσιακή Δομή – switch (σ. 77–80)",
  intro: "Πώς παίρνει αποφάσεις ένα πρόγραμμα C++ με την εντολή if, πότε χρησιμοποιούμε switch και τι γίνεται όταν ξεχάσουμε το break;",
  thumb: ICON("if/else", "amber"),
  theory: R`
<p>Στη <b>δομή διακλάδωσης</b> το πρόγραμμα εκτελεί μια εντολή ή μια ομάδα εντολών ανάλογα με το αποτέλεσμα μιας <b>λογικής έκφρασης</b> (συνθήκης). Στη C++ η δομή διακλάδωσης υλοποιείται με την εντολή <b>if … else</b>, ενώ η <b>περιπτωσιακή δομή</b> με την εντολή <b>switch</b>. Είναι από τα πιο συχνά θέματα των Παγκυπρίων: ίχνος με δοσμένη είσοδο, μετατροπή if ↔ switch, εντοπισμός λαθών.</p>
<div class="tbox def"><h4>Η εντολή if … else</h4>
${CPP(`
if (λογική έκφραση) {
    εντολές που εκτελούνται αν ισχύει η συνθήκη
}
else {
    εντολές που εκτελούνται αν ΔΕΝ ισχύει η συνθήκη
}`, { nonum: true })}
<ul><li>Το <code>else</code> μπορεί να λείπει: αν η συνθήκη είναι ψευδής δεν εκτελείται τίποτα.</li>
<li>Τα άγκιστρα <code>{ }</code> μπορούν να παραλειφθούν όταν ο κλάδος έχει <b>μία μόνο εντολή</b>.</li>
<li>Για ισότητα χρησιμοποιούμε <code>==</code> και όχι <code>=</code>.</li></ul>
<div class="figrow">${ia3Flow([{ t: "if", c: "Έλεγχος συνθήκης", yes: [{ t: "proc", s: "Εντολές Α" }], no: [{ t: "proc", s: "Εντολές Ψ" }] }], { caption: "if … else", w: 330, stubs: true })}${ia3Flow([{ t: "if", c: "Salary > 1000", yes: [{ t: "proc", s: "Tax ← Salary * 0.2" }], no: [] }], { caption: "if χωρίς else", w: 330, stubs: true })}</div></div>
<div class="tbox ex"><h4>Ωρομίσθιος υπάλληλος (βιβλίο, Παράδειγμα 1.5)</h4>
<p>15 ευρώ την ώρα· αν ο μισθός ξεπερνά τα 1000 ευρώ, αφαιρείται φόρος 13%.</p>
${CPP(`
#include <iostream>
#define tax 0.13
#define amount 15
using namespace std;
int main() {
    int h;
    float salary;
    cin >> h;
    salary = h * amount;
    if (salary > 1000)
        salary -= salary * tax;
    cout << salary;
    return 0;
}`, { hl: [10, 11] })}
<details class="steps"><summary>Λύση βήμα-βήμα για h = 80</summary><p>salary = 80 · 15 = 1200 → 1200 &gt; 1000 → Α → salary = 1200 − 156 = 1044.</p>${OUT(`1044`)}</details></div>
<div class="tbox def"><h4>Ένθετες εντολές if — η κλίμακα else if</h4>
<p>Μέσα σε έναν κλάδο μπορεί να υπάρχει άλλη if. Το <code>else</code> ανήκει πάντα στο <b>πλησιέστερο</b> προηγούμενο <code>if</code> που δεν έχει ήδη else. Όταν έχουμε πολλές περιπτώσεις χρησιμοποιούμε την κλίμακα <code>if … else if … else</code>: οι συνθήκες ελέγχονται με τη σειρά και εκτελείται <b>μόνο ο πρώτος</b> κλάδος με αληθή συνθήκη.</p>
${CPP(`
if (c == 'Y' || c == 'y')
    cout << "Yes";
else if (c == 'N' || c == 'n')
    cout << "No";
else
    cout << "Wrong Input";`, { title: "Παράδειγμα 1.6" })}</div>
<div class="tbox def"><h4>Η εντολή switch (περιπτωσιακή δομή)</h4>
<p>Η <code>switch</code> δεν εξετάζει λογική έκφραση αλλά <b>τις τιμές μιας μεταβλητής ελέγχου</b>, η οποία πρέπει να είναι <b>διακριτού τύπου</b> (<code>int</code> ή <code>char</code> — όχι float ή string).</p>
${CPP(`
switch (code) {
    case 1:
        price = 4.0;
        break;
    case 2:
    case 3:
    case 4:
        price = 4.5;
        break;
    default:
        cout << "Wrong input" << endl;
}`, { title: "Παράδειγμα 1.7 (απόσπασμα)" })}
<ul><li>Η εκτέλεση ξεκινά από την <code>case</code> που ταιριάζει και συνεχίζει <b>μέχρι το πρώτο break</b> ή το τέλος της switch. Έτσι οι <code>case 2: case 3: case 4:</code> μοιράζονται την ίδια εντολή.</li>
<li>Αν λείπει το <code>break</code>, εκτελούνται <b>και</b> οι εντολές των επόμενων περιπτώσεων («πέφτει» η εκτέλεση).</li>
<li>Το <code>default</code> εκτελείται όταν καμία περίπτωση δεν είναι ίση με τη μεταβλητή ελέγχου.</li></ul></div>
<div class="tbox ex"><h4>Μετατροπή if → switch</h4>
<p>Η κλίμακα <code>if (flag == 'Z') … else if (flag == 'X') … else …</code> γράφεται ως:</p>
${CPP(`
switch (flag) {
    case 'Z':
        cout << "HOT" << endl;
        break;
    case 'X':
        cout << "WARM" << endl;
        break;
    case 'K':
        cout << "COLD" << endl;
        break;
    default:
        cout << "Wrong value" << endl;
}`)}
<p class="muted small">Η μετατροπή switch → if είναι πάντα δυνατή· η αντίστροφη μόνο όταν οι συνθήκες είναι ισότητες με σταθερές τιμές ακέραιας/χαρακτήρα μεταβλητής (π.χ. το <code>epid &gt;= 1 &amp;&amp; epid &lt;= 3</code> γίνεται <code>case 1: case 2: case 3:</code>).</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p><code>if (x = 0)</code> αντί για <code>if (x == 0)</code> (εκχωρεί 0 και η συνθήκη είναι πάντα ψευδής!) · ξεχασμένο <code>break</code> στη switch · <code>case "Z":</code> με διπλά εισαγωγικά (σωστό: <code>'Z'</code>) · <code>;</code> αμέσως μετά το <code>if (…)</code> · δύο εντολές σε κλάδο χωρίς άγκιστρα.</p></div>
`,
  widget: "ia3branch",
  gen: "ia3ifg",
  exercises: [
    { level: 1, type: "mc", q: R`Η μεταβλητή ελέγχου της εντολής <code>switch</code> μπορεί να είναι τύπου <code>float</code>.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι τύπου πρέπει να είναι η μεταβλητή ελέγχου;`, sol: R`<b>ΛΑΘΟΣ.</b> Η μεταβλητή ελέγχου πρέπει να είναι διακριτού τύπου (<code>int</code>, <code>char</code>).` },
    { level: 1, q: R`Τι θα εμφανίσει το πρόγραμμα με είσοδο <code>M 22</code>;${CPP(`
char sex;
int age, asfalistra;
cin >> sex >> age;
if (sex == 'M')
    if (age < 25)
        asfalistra = 300;
    else
        asfalistra = 250;
else if (age < 21)
    asfalistra = 200;
else
    asfalistra = 150;
cout << "Asfalistra: " << asfalistra;`)}`, fields: [{ label: "Έξοδος:", ans: "Asfalistra: 300", text: true, cs: true }],
      hint: R`Πρώτα ελέγχεται το φύλο και μετά η ηλικία.`, sol: R`sex == 'M' → Α, 22 &lt; 25 → Α → asfalistra = 300. ${OUT(`Asfalistra: 300`)}` },
    { level: 2, q: R`Για το ίδιο πρόγραμμα ασφαλίστρων, τι θα εμφανιστεί με είσοδο <code>F 18</code> και τι με είσοδο <code>M 40</code>;${CPP(`
if (sex == 'M')
    if (age < 25)
        asfalistra = 300;
    else
        asfalistra = 250;
else if (age < 21)
    asfalistra = 200;
else
    asfalistra = 150;
cout << "Asfalistra: " << asfalistra;`, { nonum: true })}`, fields: [{ label: "F 18:", ans: "Asfalistra: 200", text: true, cs: true }, { label: "M 40:", ans: "Asfalistra: 250", text: true, cs: true }],
      hint: R`Το πρώτο else ανήκει στο εσωτερικό if (age &lt; 25).`, sol: R`F 18: sex == 'M' → Ψ, 18 &lt; 21 → Α → 200. M 40: Α, 40 &lt; 25 → Ψ → 250. ${OUT(`Asfalistra: 200`)}${OUT(`Asfalistra: 250`)}` },
    { level: 2, q: R`Το πρόγραμμα του Παραδείγματος 1.7 (τιμές προϊόντων) εκτελείται δύο φορές. Τι θα εμφανίσει με είσοδο <code>3 10</code> και τι με είσοδο <code>10 3</code>;${CPP(`
int code, qty;
float price, total;
cin >> code >> qty;
switch (code) {
    case 1:
        price = 4.0;
        break;
    case 2:
    case 3:
    case 4:
        price = 4.5;
        break;
    case 5:
    case 10:
    case 15:
        price = 5.0;
        break;
    case 7:
    case 9:
        price = 2.0;
        break;
    case 12:
        price = 1.5;
        break;
    default:
        cout << "Wrong input" << endl;
}
total = price * qty;
cout << fixed << setprecision(2) << total;`)}`, fields: [{ label: "3 10:", ans: "45.00", text: true }, { label: "10 3:", ans: "15.00", text: true }],
      hint: R`Βρες σε ποια case «πέφτει» κάθε κωδικός.`, sol: R`code = 3 → price = 4.5 → total = 45 → <b>45.00</b>. code = 10 → price = 5.0 → total = 15 → <b>15.00</b>.` },
    { level: 2, q: R`Τι θα εμφανίσει το πιο κάτω τμήμα;${CPP(`
int k = 2;
switch (k) {
    case 1:
        cout << "A";
    case 2:
        cout << "B";
    case 3:
        cout << "C";
        break;
    default:
        cout << "D";
}`)}`, fields: [{ label: "Έξοδος:", ans: "BC", text: true, cs: true }],
      hint: R`Μετά την case που ταιριάζει, η εκτέλεση συνεχίζει μέχρι το πρώτο break.`, sol: R`Η εκτέλεση ξεκινά από την <code>case 2</code>, τυπώνει B, δεν βρίσκει break και συνεχίζει στην <code>case 3</code> (C) όπου υπάρχει break. ${OUT(`BC`)}` },
    { level: 2, q: R`Σε μια βιβλιοθήκη, το γινόμενο των δύο τελευταίων ψηφίων του αριθμού μητρώου ενός βιβλίου καθορίζει το είδος δανεισμού. Τι θα τυπώσει το πρόγραμμα για τους αριθμούς <b>123</b>, <b>178</b> και <b>105</b>;${CPP(`
int am, d1, d2, g;
cin >> am;
d1 = am % 10;
d2 = am / 10 % 10;
g = d1 * d2;
if (g == 0)
    cout << "never";
else if (g < 10)
    cout << "week";
else
    cout << "month";`)}`, fields: [{ label: "123:", ans: "week", text: true }, { label: "178:", ans: "month", text: true }, { label: "105:", ans: "never", text: true }],
      hint: R`d1 = μονάδες, d2 = δεκάδες.`, sol: R`123: 3·2 = 6 &lt; 10 → <b>week</b>. 178: 8·7 = 56 → <b>month</b>. 105: 5·0 = 0 → <b>never</b>. Προσοχή: η περίπτωση 0 ελέγχεται <b>πρώτη</b>, αλλιώς το 0 θα έπιανε τον κλάδο «&lt; 10».` },
    { level: 3, q: R`Τι θα εμφανίσει το πιο κάτω τμήμα προγράμματος;${CPP(`
int x = 5;
if (x = 0)
    cout << "A";
else
    cout << "B";
cout << x;`)}`, fields: [{ label: "Έξοδος:", ans: "B0", text: true, cs: true }],
      hint: R`Τι κάνει ο τελεστής <code>=</code> μέσα στη συνθήκη;`, sol: R`Το <code>x = 0</code> είναι <b>εκχώρηση</b>: το x γίνεται 0 και η τιμή της έκφρασης (0) σημαίνει ψευδής. Εκτελείται το else και μετά τυπώνεται το x, που είναι πια 0: ${OUT(`B0`)} Ήθελε <code>if (x == 0)</code>.` },
    { level: 3, type: "mc", q: R`Ποια switch είναι ισοδύναμη με το τμήμα:${CPP(`
if (flag == 'Z')
    cout << "HOT";
else if (flag == 'X')
    cout << "WARM";
else
    cout << "Wrong";`, { nonum: true })}`,
      options: [CPP(`switch (flag) {\n    case 'Z':\n        cout << "HOT";\n        break;\n    case 'X':\n        cout << "WARM";\n        break;\n    default:\n        cout << "Wrong";\n}`, { nonum: true, small: true }),
        CPP(`switch (flag) {\n    case 'Z':\n        cout << "HOT";\n    case 'X':\n        cout << "WARM";\n    default:\n        cout << "Wrong";\n}`, { nonum: true, small: true }),
        CPP(`switch (flag) {\n    case "Z":\n        cout << "HOT";\n        break;\n    case "X":\n        cout << "WARM";\n        break;\n    default:\n        cout << "Wrong";\n}`, { nonum: true, small: true }),
        CPP(`switch (flag) {\n    case 'Z' || 'X':\n        cout << "HOT";\n        break;\n    default:\n        cout << "Wrong";\n}`, { nonum: true, small: true })], correct: 0,
      hint: R`Χρειάζονται break, χαρακτήρες σε απλά εισαγωγικά και μία case για κάθε τιμή.`, sol: R`Σωστή είναι η switch με <code>case 'Z':</code>, <code>case 'X':</code>, <code>break</code> σε κάθε περίπτωση και <code>default</code>. Χωρίς break για flag = 'Z' θα τυπωνόταν «HOTWARMWrong»· τα <code>"Z"</code> είναι συμβολοσειρές (συντακτικό λάθος)· το <code>'Z' || 'X'</code> είναι λογική έκφραση με τιμή 1 και όχι δύο περιπτώσεις.` },
    { level: 3, q: R`Η εταιρεία κρατά από τον μισθό δύο ποσά: για μισθό ≤ 800 κρατήσεις 2% και 2,5%, για 801–1200 κρατήσεις 2,5% και 3%, και για μισθό &gt; 1200 κρατήσεις 3% και 4%. Τι θα εμφανίσει το πρόγραμμα με είσοδο <b>1500</b>; (μία γραμμή ανά πεδίο)${CPP(`
float misthos, k1, k2;
cin >> misthos;
if (misthos <= 800) {
    k1 = misthos * 0.02;
    k2 = misthos * 0.025;
}
else if (misthos <= 1200) {
    k1 = misthos * 0.025;
    k2 = misthos * 0.03;
}
else {
    k1 = misthos * 0.03;
    k2 = misthos * 0.04;
}
cout << fixed << setprecision(2) << k1 << endl;
cout << k2 << endl;
cout << misthos - k1 - k2 << endl;`)}`, fields: [{ label: "Κράτηση 1:", ans: "45.00", text: true }, { label: "Κράτηση 2:", ans: "60.00", text: true }, { label: "Καθαρός:", ans: "1395.00", text: true }],
      hint: R`1500 &gt; 1200: εκτελείται ο κλάδος else. Οι fixed/setprecision ισχύουν και για τις επόμενες cout.`, sol: R`1500 ≤ 800 → Ψ, 1500 ≤ 1200 → Ψ → else: k1 = 1500·0,03 = 45, k2 = 1500·0,04 = 60, καθαρός 1500 − 45 − 60 = 1395. ${OUT(`45.00\n60.00\n1395.00`)}` }
  ]
},
/* ───────────────────────────── 3.4 ───────────────────────────── */
{
  id: "3.4", unit: 3, title: "Δομές επανάληψης στη C++: βρόχοι for, while και do…while",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.1 §5 Δομή Επανάληψης (σ. 80–84)",
  intro: "Πώς κάνουμε τον υπολογιστή να εκτελεί τις ίδιες εντολές πολλές φορές με for, while και do…while — και πώς βρίσκουμε τι θα εμφανίσει ένας βρόχος χωρίς να τον τρέξουμε;",
  thumb: ICON("for", "green"),
  theory: R`
<p><b>Δομές επανάληψης</b> ή <b>βρόχοι</b> (loops) ονομάζονται τα μέρη του κώδικα που εκτελούνται περισσότερες από μία φορές, όσο μια λογική συνθήκη είναι αληθής. Όταν η συνθήκη γίνει ψευδής, ο βρόχος τελειώνει και η εκτέλεση συνεχίζει με την επόμενη εντολή. Η C++ έχει τρεις βρόχους: <b>for</b>, <b>while</b> και <b>do…while</b>.</p>
<div class="tbox def"><h4>Ο βρόχος for</h4>
<p>Τον χρησιμοποιούμε όταν <b>γνωρίζουμε από πριν τον αριθμό των επαναλήψεων</b>. Μια μεταβλητή-μετρητής παίρνει αρχική τιμή (μόνο την πρώτη φορά), ελέγχεται η συνθήκη <b>πριν</b> από κάθε επανάληψη και στο τέλος κάθε επανάληψης γίνεται η μεταβολή του μετρητή. Ο μετρητής μπορεί να είναι <b>ακέραιος, δεκαδικός ή χαρακτήρας</b> και μπορεί να δηλωθεί και να αρχικοποιηθεί μέσα στον βρόχο (π.χ. <code>for (char c = 'a'; c &lt;= 'e'; c++)</code>).</p>
${CPP(`
for (μετρητής = αρχική τιμή; συνθήκη; μεταβολή μετρητή) {
    εντολές;
}`, { nonum: true })}
${CPP(`
int N, sum = 0;
cin >> N;
for (int i = 1; i <= N; i++)
    sum += i;
cout << sum;`, { title: "Παράδειγμα 1.8 — άθροισμα 1 + 2 + … + N", hl: [3, 4] })}
<p>Με είσοδο 10: ${OUT(`55`)}</p></div>
<div class="tbox def"><h4>Ο βρόχος while</h4>
<p>Τον χρησιμοποιούμε όταν <b>δεν ξέρουμε</b> τον ακριβή αριθμό επαναλήψεων. Η συνθήκη ελέγχεται <b>στην αρχή</b>· αν είναι ψευδής από την αρχή, το σώμα δεν εκτελείται ούτε μία φορά.</p>
${CPP(`
int a, b, ekp;
cin >> a >> b;
ekp = a;
while (ekp % a != 0 || ekp % b != 0)
    ekp++;
cout << ekp;`, { title: "Παράδειγμα 1.10 — ΕΚΠ δύο αριθμών" })}</div>
<div class="tbox def"><h4>Ο βρόχος do…while</h4>
<p>Η συνθήκη ελέγχεται <b>στο τέλος</b>, άρα το σώμα εκτελείται <b>τουλάχιστον μία φορά</b>. Προσοχή στο <code>;</code> μετά το <code>while (συνθήκη)</code>.</p>
${CPP(`
do {
    εντολές;
} while (συνθήκη);`, { nonum: true })}</div>
<div class="figrow">${ia3Flow([{ t: "proc", s: "M ← 1" }, { t: "while", c: "M <= 5", body: [{ t: "proc", s: "Sum ← Sum + M" }, { t: "proc", s: "M ← M + 1" }] }], { caption: "for / while: έλεγχος στην αρχή", w: 300, stubs: true })}${ia3Flow([{ t: "do", c: "Total <= 5000", body: [{ t: "io", s: "Διάβασε Salary" }, { t: "proc", s: "Total ← Total + Salary" }] }], { caption: "do…while: έλεγχος στο τέλος", w: 300, stubs: true })}</div>
<div class="tbox ex"><h4>Ίχνος (πίνακας τιμών): while ή do;</h4>
<p>Και τα δύο τμήματα υπολογίζουν το άθροισμα των περιττών 1 έως 11:</p>
<div class="figrow">${CPP(`
sum = 0;
arithmos = 1;
while (arithmos <= 11) {
    sum = sum + arithmos;
    arithmos = arithmos + 2;
}`, { small: true, nonum: true })}${CPP(`
sum = 0;
arithmos = 1;
do {
    sum = sum + arithmos;
    arithmos = arithmos + 2;
} while (arithmos <= 11);`, { small: true, nonum: true })}</div>
<details class="steps"><summary>Πίνακας προκαταρκτικής εκτέλεσης (while)</summary>
<table class="tbl"><tr><th>arithmos</th><th>sum</th><th>arithmos&lt;=11</th><th>Α/Ψ</th></tr><tr><td>1</td><td>0</td><td>1&lt;=11</td><td>Α</td></tr><tr><td></td><td>1</td><td></td><td></td></tr><tr><td>3</td><td>4</td><td>3&lt;=11</td><td>Α</td></tr><tr><td>5</td><td>9</td><td>5&lt;=11</td><td>Α</td></tr><tr><td>7</td><td>16</td><td>7&lt;=11</td><td>Α</td></tr><tr><td>9</td><td>25</td><td>9&lt;=11</td><td>Α</td></tr><tr><td>11</td><td>36</td><td>11&lt;=11</td><td>Α</td></tr><tr><td>13</td><td></td><td>13&lt;=11</td><td>Ψ</td></tr></table>
<p>Και τα δύο τυπώνουν 36. Η διαφορά φαίνεται αν η αρχική τιμή είναι 13: το while δεν εκτελεί το σώμα (sum = 0), ενώ το do το εκτελεί μία φορά (sum = 13).</p></details></div>
<div class="tbox def"><h4>Ένθετοι βρόχοι</h4>
<p>Για κάθε επανάληψη του εξωτερικού βρόχου, ο εσωτερικός εκτελεί <b>όλες</b> τις δικές του επαναλήψεις. Ο πίνακας της προπαίδειας 9×9 εκτελεί την εντολή του εσωτερικού βρόχου $9 \cdot 9 = 81$ φορές:</p>
${CPP(`
for (i = 1; i <= 9; i++) {
    for (j = 1; j <= 9; j++) {
        cout << i * j << " ";
    }
    cout << endl;
}`, { title: "Παράδειγμα 1.9" })}</div>
<div class="tbox rem"><h4>Ποιον βρόχο να διαλέξω;</h4><p><b>for</b>: γνωστός αριθμός επαναλήψεων (μετρητής). <b>while</b>: επανάληψη «όσο ισχύει κάτι», ίσως καμία φορά (π.χ. «μέχρι να δοθεί 0»). <b>do…while</b>: τουλάχιστον μία φορά — ιδανικό για <b>έλεγχο εγκυρότητας εισόδου</b>:</p>${CPP(`
do {
    cin >> x;
} while (x < 1 || x > 100);`, { nonum: true })}<p>Κάθε βρόχος μπορεί να ξαναγραφτεί με τους άλλους δύο (θέμα που ζητείται συχνά).</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Ατέρμων βρόχος: ξεχνάμε να αλλάξουμε τη μεταβλητή της συνθήκης μέσα στο while · <code>;</code> αμέσως μετά το <code>for (…)</code> ή το <code>while (…)</code> (κενό σώμα!) · λάθος κατά ένα (<code>&lt;</code> αντί <code>&lt;=</code>) · ξεχνάμε την αρχικοποίηση του αθροιστή (<code>sum = 0</code>) ή του γινομένου (<code>p = 1</code>) · ξεχνάμε το <code>;</code> στο τέλος του do…while.</p></div>
`,
  widget: "ia3loop",
  gen: "ia3loopg",
  exercises: [
    { level: 1, q: R`Τι θα εμφανίσει το πρόγραμμα;${CPP(`
for (int i = 2; i < 10; i += 3)
    cout << i << " ";`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: "2 5 8", text: true }],
      hint: R`Ξεκίνα από i = 2 και πρόσθετε 3 όσο i &lt; 10.`, sol: R`i = 2, 5, 8 (το 11 δεν ικανοποιεί τη συνθήκη). ${OUT(`2 5 8`)}` },
    { level: 1, q: R`Πόσες φορές εκτελείται το σώμα του βρόχου <code>for (int k = 10; k &gt; 0; k -= 2)</code>;`, fields: [{ label: "Φορές:", ans: 5 }],
      hint: R`Γράψε τις τιμές του k.`, sol: R`k = 10, 8, 6, 4, 2 → <b>5</b> φορές (για k = 0 η συνθήκη είναι ψευδής).` },
    { level: 1, type: "mc", q: R`Ο βρόχος <code>do…while</code> εκτελεί το σώμα του τουλάχιστον μία φορά, ακόμη κι αν η συνθήκη είναι ψευδής από την αρχή.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Πού ελέγχεται η συνθήκη;`, sol: R`<b>ΣΩΣΤΟ.</b> Η συνθήκη ελέγχεται <b>μετά</b> το σώμα.` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα του ΕΚΠ με είσοδο <code>4 6</code>;${CPP(`
int a, b, ekp;
cin >> a >> b;
ekp = a;
while (ekp % a != 0 || ekp % b != 0)
    ekp++;
cout << ekp;`)}`, fields: [{ label: "Έξοδος:", ans: 12 }],
      hint: R`Ο βρόχος σταματά στον πρώτο αριθμό ≥ a που διαιρείται και με τους δύο.`, sol: R`ekp = 4, 5, …: ο πρώτος αριθμός που διαιρείται με 4 και 6 είναι το <b>12</b>. ${OUT(`12`)}` },
    { level: 2, q: R`Ένα ασανσέρ σηκώνει έως 600 κιλά ή 8 άτομα. Ποιες τιμές θα τυπώσει το πρόγραμμα αν δοθούν με τη σειρά τα βάρη <code>120 150 130 140 100 90</code>;${CPP(`
int weight, people = 0, total = 0;
cin >> weight;
do {
    total += weight;
    people++;
    cin >> weight;
} while (people != 8 && total + weight <= 600);
cout << "Total=" << total << endl;
cout << "Persons=" << people << endl;`)}`, fields: [{ label: "Total =", ans: 540 }, { label: "Persons =", ans: 4 }],
      hint: R`Πριν από κάθε νέα επανάληψη ελέγχεται αν χωρά και το επόμενο άτομο.`, sol: R`total: 120 → 270 → 400 → 540 (people = 4). Το επόμενο βάρος είναι 100 και 540 + 100 = 640 &gt; 600 → Ψ. ${OUT(`Total=540\nPersons=4`)}` },
    { level: 2, q: R`Στα δύο τμήματα η αρχική τιμή είναι <code>arithmos = 13</code>. Ποια τιμή θα έχει το sum στο τέλος του καθενός;${CPP(`
// Τμήμα Α
sum = 0;
arithmos = 13;
while (arithmos <= 11) {
    sum = sum + arithmos;
    arithmos = arithmos + 2;
}
// Τμήμα Β
sum = 0;
arithmos = 13;
do {
    sum = sum + arithmos;
    arithmos = arithmos + 2;
} while (arithmos <= 11);`, { nonum: true })}`, fields: [{ label: "Α (while):", ans: 0 }, { label: "Β (do):", ans: 13 }],
      hint: R`Το while ελέγχει πριν, το do ελέγχει μετά.`, sol: R`Α: 13 ≤ 11 → Ψ, το σώμα δεν εκτελείται → <b>0</b>. Β: το σώμα εκτελείται μία φορά (sum = 13) και μετά 15 ≤ 11 → Ψ → <b>13</b>.` },
    { level: 2, q: R`Πόσους αστερίσκους θα εμφανίσει συνολικά το πρόγραμμα;${CPP(`
for (int i = 1; i <= 4; i++) {
    for (int j = 1; j <= i; j++)
        cout << "*";
    cout << endl;
}`)}`, fields: [{ label: "Αστερίσκοι:", ans: 10 }],
      hint: R`Στη γραμμή i τυπώνονται i αστερίσκοι.`, sol: R`$1 + 2 + 3 + 4 = $ <b>10</b>. ${OUT(`*\n**\n***\n****`)}` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα αν δοθεί <code>x = 9</code>;${CPP(`
int x, sum = 0;
cin >> x;
for (int i = 0; i <= x; i += 2)
    sum += i;
cout << sum;`)}`, fields: [{ label: "Έξοδος:", ans: 20 }],
      hint: R`Το i παίρνει τις άρτιες τιμές 0, 2, 4, … όσο i ≤ 9.`, sol: R`$0 + 2 + 4 + 6 + 8 = $ <b>20</b>. ${OUT(`20`)}` },
    { level: 3, type: "mc", q: R`Ποιο τμήμα με <code>while</code> είναι ισοδύναμο με το <code>for (int i = 0; i &lt;= x; i += 2) sum += i;</code>;`,
      options: [CPP(`int i = 0;\nwhile (i <= x) {\n    sum += i;\n    i += 2;\n}`, { nonum: true, small: true }), CPP(`int i = 0;\nwhile (i <= x) {\n    i += 2;\n    sum += i;\n}`, { nonum: true, small: true }), CPP(`int i = 0;\nwhile (i < x) {\n    sum += i;\n    i += 2;\n}`, { nonum: true, small: true }), CPP(`int i = 0;\nwhile (i <= x)\n    sum += i;\n    i += 2;`, { nonum: true, small: true })], correct: 0,
      hint: R`Η μεταβολή του μετρητή γίνεται στο <b>τέλος</b> κάθε επανάληψης· η συνθήκη μένει η ίδια.`, sol: R`Σωστό: αρχικοποίηση πριν από το while, ίδια συνθήκη <code>i &lt;= x</code>, και <code>i += 2</code> <b>μετά</b> το <code>sum += i</code>, μέσα στα άγκιστρα. Αν η αύξηση γίνει πριν από την πρόσθεση αθροίζονται 2, 4, …, x+1· με <code>&lt;</code> χάνεται το x όταν είναι άρτιος· χωρίς άγκιστρα το <code>i += 2</code> είναι εκτός βρόχου → ατέρμων βρόχος.` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα για <code>n = 6</code>;${CPP(`
int n, steps = 0;
cin >> n;
while (n > 1) {
    if (n % 2 == 0)
        n = n / 2;
    else
        n = 3 * n + 1;
    steps++;
}
cout << steps;`)}`, fields: [{ label: "Έξοδος:", ans: 8 }],
      hint: R`Κάνε πίνακα τιμών για το n μέχρι να γίνει 1.`, sol: R`n: 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1, δηλαδή <b>8</b> βήματα. ${OUT(`8`)}` }
  ]
},
/* ───────────────────────────── 3.5 ───────────────────────────── */
{
  id: "3.5", unit: 3, title: "Λογικά διαγράμματα και προκαταρκτική εκτέλεση (πίνακας τιμών) – έλεγχος προγράμματος",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.1 §6 Έλεγχος Προγράμματος (σ. 84–86) · Παράρτημα: Σχεδίαση Λογικών Διαγραμμάτων & Προκαταρκτική Εκτέλεση (σ. 323–352)",
  intro: "Πώς σχεδιάζουμε σωστά ένα λογικό διάγραμμα με τα σύμβολα που ζητούν οι Παγκύπριες και πώς γράφουμε τον πίνακα προκαταρκτικής εκτέλεσης ενός προγράμματος;",
  thumb: `<svg class="thumb" viewBox="0 0 96 56" aria-hidden="true"><ellipse cx="48" cy="8" rx="14" ry="6" fill="#fff" stroke="#1B2A4A" stroke-width="1.6"/><path d="M48,14V19" stroke="#1B2A4A" stroke-width="1.6"/><path d="M48,19L62,28L48,37L34,28Z" fill="#fff6e6" stroke="#C77A0A" stroke-width="1.8"/><path d="M62,28H78V44M34,28H18V44" fill="none" stroke="#1B2A4A" stroke-width="1.6"/><rect x="66" y="44" width="24" height="10" fill="#fff" stroke="#1B2A4A" stroke-width="1.4"/><rect x="6" y="44" width="24" height="10" fill="#fff" stroke="#1B2A4A" stroke-width="1.4"/></svg>`,
  theory: R`
<p>Πριν γράψουμε ένα πρόγραμμα, σχεδιάζουμε τον αλγόριθμο με ένα <b>λογικό διάγραμμα</b> (διάγραμμα ροής). Αφού το γράψουμε, ελέγχουμε ότι δουλεύει σωστά με την <b>προκαταρκτική εκτέλεση</b>: εκτελούμε «με το χέρι» κάθε εντολή και καταγράφουμε σε πίνακα τις τιμές των μεταβλητών, τις αποφάσεις και ό,τι εμφανίζεται στην οθόνη. Και τα δύο ζητούνται συστηματικά στις Παγκύπριες (π.χ. «να σχεδιάσετε λογικό διάγραμμα, το οποίο…», «με τη χρήση προκαταρκτικής εκτέλεσης να παρουσιάσετε τα αποτελέσματα…»).</p>
<div class="tbox def"><h4>Δομημένος προγραμματισμός</h4>
<p>Ο δομημένος προγραμματισμός χωρίζει το πρόγραμμα σε λογικά τμήματα χρησιμοποιώντας <b>μόνο τρεις βασικές δομές ελέγχου</b>: (1) την <b>ακολουθιακή δομή</b>, (2) τη <b>δομή διακλάδωσης</b> (και την επέκτασή της, την περιπτωσιακή δομή switch) και (3) τη <b>δομή επανάληψης</b>. Έτσι τα προγράμματα γίνονται πιο εύκολα κατανοητά, ελέγξιμα και συντηρήσιμα.</p></div>
<div class="tbox def"><h4>Σύμβολα λογικών διαγραμμάτων (ANSI)</h4>
${ia3FlowSymbols()}</div>
<div class="tbox rem"><h4>Κανόνες για ομοιόμορφο σχεδιασμό</h4>
<ul><li>Το λογικό διάγραμμα <b>αντιστοιχεί</b> με το πρόγραμμα: ίδιες δομές (αν στο διάγραμμα υπάρχει if-else, το ίδιο και στο πρόγραμμα) και ίδιες μεταβλητές.</li>
<li>Τα μηνύματα εισόδου/εξόδου <b>δεν είναι υποχρεωτικά</b> στο διάγραμμα — στο πρόγραμμα όμως πρέπει να υπάρχουν.</li>
<li>Οι μεταβλητές γράφονται με <b>λατινικούς</b> χαρακτήρες· οι οδηγίες μπορούν να είναι στα Ελληνικά (Διάβασε, Τύπωσε).</li>
<li>Για την εκχώρηση τιμής χρησιμοποιούμε το βέλος <b>←</b> (π.χ. <code>Total ← Total + Salary</code>).</li>
<li>Στις αποφάσεις οι έξοδοι σημειώνονται <b>Α – Ψ</b> (ή Ναι – Όχι, T – F).</li>
<li>Οι σταθερές ξεχωρίζουν από τις μεταβλητές με <b>σχόλιο</b> (π.χ. «Pi: Σταθερά, όπου Pi = 3.14»).</li>
<li>Στο διάγραμμα δεν χρειάζονται δείκτες πλάτους εκτύπωσης (setw, setprecision) — στο πρόγραμμα συστήνονται.</li></ul></div>
<div class="tbox ex"><h4>Οι τρεις δομές σε λογικό διάγραμμα</h4>
<div class="figrow">${ia3Flow([{ t: "term", s: "Αρχή" }, { t: "io", s: "Διάβασε aktina" }, { t: "proc", s: "emvado ← Pi * aktina * aktina" }, { t: "proc", s: "periferia ← 2 * Pi * aktina" }, { t: "io", s: "Τύπωσε emvado, periferia" }, { t: "term", s: "Τέλος" }], { caption: "(α) Ακολουθιακή δομή: εμβαδόν & περίμετρος κύκλου", w: 360 })}
${ia3Flow([{ t: "term", s: "Αρχή" }, { t: "io", s: "Διάβασε Salary" }, { t: "if", c: "Salary > 1000", yes: [{ t: "proc", s: "Tax ← Salary * 0.2" }, { t: "io", s: "Τύπωσε Tax" }], no: [{ t: "proc", s: "Tax ← Salary * 0.1" }] }, { t: "term", s: "Τέλος" }], { caption: "(β) Δομή διακλάδωσης", w: 420 })}</div>
${ia3Flow([{ t: "term", s: "Αρχή" }, { t: "proc", s: "plithismos ← 10000000" }, { t: "proc", s: "M ← 1" }, { t: "while", c: "M <= 15", body: [{ t: "proc", s: "plithismos ← plithismos * 1.02" }, { t: "proc", s: "M ← M + 1" }] }, { t: "io", s: "Τύπωσε plithismos" }, { t: "term", s: "Τέλος" }], { caption: "(γ) Επαναληπτική δομή: πληθυσμός μετά από 15 χρόνια (αύξηση 2%)", w: 380 })}</div>
<div class="tbox def"><h4>Προκαταρκτική εκτέλεση</h4>
<p>Κατά την προκαταρκτική εκτέλεση εκτελούμε βήμα προς βήμα <b>όλες</b> τις εντολές, όπως θα τις εκτελούσε ο υπολογιστής, και καταγράφουμε σε πίνακα: (i) τις τιμές των σταθερών, (ii) τις αρχικές τιμές των μεταβλητών και τις τιμές τους μετά από κάθε αλλαγή, (iii) τις αποφάσεις και τις τιμές τους (Α/Ψ), (iv) τους δείκτες και το περιεχόμενο των πινάκων, (v) την <b>παρουσίαση</b> — ό,τι θα εμφανιζόταν στην οθόνη, ενιαία.</p>
${CPP(`
int no, sum, metritis;
float mesos;
sum = 0;
metritis = 0;
for (no = 10; no <= 15; no++) {
    sum = sum + no;
    metritis = metritis + 1;
}
mesos = (float) sum / metritis;
cout << "Mesos oros: " << fixed << setprecision(2) << mesos;`, { title: "Average (Παράρτημα, Παράδειγμα γ1)" })}
<table class="tbl"><tr><th colspan="4">Μεταβλητές</th><th colspan="2">Απόφαση</th><th>Παρουσίαση</th></tr>
<tr><th>no</th><th>sum</th><th>metritis</th><th>mesos</th><th>no&lt;=15</th><th>Α/Ψ</th><td rowspan="9" style="text-align:left;vertical-align:top;font-family:monospace">Mesos oros: 12.50</td></tr>
<tr><td>10</td><td>0</td><td>0</td><td></td><td>10&lt;=15</td><td>Α</td></tr><tr><td></td><td>10</td><td>1</td><td></td><td></td><td></td></tr>
<tr><td>11</td><td>21</td><td>2</td><td></td><td>11&lt;=15</td><td>Α</td></tr><tr><td>12</td><td>33</td><td>3</td><td></td><td>12&lt;=15</td><td>Α</td></tr>
<tr><td>13</td><td>46</td><td>4</td><td></td><td>13&lt;=15</td><td>Α</td></tr><tr><td>14</td><td>60</td><td>5</td><td></td><td>14&lt;=15</td><td>Α</td></tr>
<tr><td>15</td><td>75</td><td>6</td><td></td><td>15&lt;=15</td><td>Α</td></tr><tr><td>16</td><td></td><td></td><td>12.50</td><td>16&lt;=15</td><td>Ψ</td></tr></table>
<p class="muted small">Για οικονομία χώρου τα βήματα δεν χρειάζεται να γράφονται οπωσδήποτε σε ξεχωριστές γραμμές· γράφουμε όμως <b>κάθε</b> αλλαγή τιμής και <b>κάθε</b> έλεγχο συνθήκης — και τον τελευταίο, που βγαίνει Ψ.</p></div>
<div class="tbox def"><h4>Έλεγχος προγράμματος: συντακτικά και λογικά λάθη</h4>
<p><b>Συντακτικά λάθη</b> (π.χ. αδήλωτη μεταβλητή, ξεχασμένη βιβλιοθήκη, έλλειψη <code>;</code>) τα εντοπίζει ο μεταγλωττιστής. <b>Λογικά λάθη</b> (το πρόγραμμα τρέχει αλλά δίνει λάθος αποτέλεσμα) εντοπίζονται σε δύο βήματα: (α) <b>επιλογή εισόδων</b> που καλύπτουν όλες τις περιπτώσεις — συνηθισμένες αλλά και <b>ακραίες</b> (π.χ. για τη δύναμη $b^e$: e = 0, b = 0, b = e = 0, πολύ μεγάλες τιμές)· (β) <b>έλεγχος αποτελεσμάτων</b>: με πίνακα προκαταρκτικής εκτέλεσης, με έλεγχο του τελικού αποτελέσματος ή με <b>εκτύπωση ενδιάμεσων αποτελεσμάτων</b>.</p>
${CPP(`
for (int i = 1; i <= e; i++) {
    result = result * b;
    cout << "For i=" << i << " result=" << result << endl;
}`, { title: "Εκτύπωση ενδιάμεσων αποτελεσμάτων" })}
<p>Για $10^{15}$ η εκτύπωση δείχνει ότι από i = 10 και μετά το αποτέλεσμα είναι λάθος: γίνεται <b>υπερχείλιση</b>, αφού το αποτέλεσμα ξεπερνά το <code>INT_MAX</code> = 2147483647 και δεν «χωρά» σε μεταβλητή int.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Λάθος σύμβολο (ορθογώνιο αντί για παραλληλόγραμμο στην είσοδο/έξοδο) · απόφαση χωρίς σημειωμένες εξόδους Α/Ψ · βρόχος χωρίς βέλος επιστροφής · διάγραμμα που δεν αντιστοιχεί στο πρόγραμμα (π.χ. while στο διάγραμμα, do στο πρόγραμμα) · στον πίνακα τιμών παραλείπεται ο τελευταίος έλεγχος (Ψ) ή η αρχικοποίηση.</p></div>
`,
  widget: "ia3flowrun",
  gen: "ia3flowg",
  exercises: [
    { level: 1, type: "mc", q: R`Ποιο σύμβολο λογικού διαγράμματος χρησιμοποιείται για την <b>είσοδο δεδομένων – έξοδο αποτελεσμάτων</b>;`, options: ["Παραλληλόγραμμο", "Ορθογώνιο", "Ρόμβος", "Έλλειψη"], correct: 0,
      hint: R`Δες τον πίνακα συμβόλων ANSI.`, sol: R`Το <b>παραλληλόγραμμο</b>. Το ορθογώνιο είναι για επεξεργασία, ο ρόμβος για απόφαση και η έλλειψη για Αρχή/Τέλος.` },
    { level: 1, type: "mc", q: R`Τα μηνύματα εισόδου και εξόδου (π.χ. «Δώσε αριθμό:») είναι υποχρεωτικά στο λογικό διάγραμμα.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Δες τους κανόνες ομοιόμορφου σχεδιασμού.`, sol: R`<b>ΛΑΘΟΣ.</b> Στο λογικό διάγραμμα δεν είναι υποχρεωτικά· στο πρόγραμμα όμως πρέπει να υπάρχουν.` },
    { level: 2, q: R`Δίνεται το λογικό διάγραμμα (άσκηση του βιβλίου). Τι θα τυπωθεί για <b>N = 5</b>;${ia3Flow([{ t: "term", s: "Αρχή" }, { t: "io", s: "Διάβασε N" }, { t: "proc", s: "X ← 1" }, { t: "proc", s: "Y ← 0" }, { t: "do", c: "X < 1000", body: [{ t: "proc", s: "X ← X * N" }, { t: "proc", s: "Y ← Y + 1" }] }, { t: "io", s: "Τύπωσε Y" }, { t: "term", s: "Τέλος" }], { w: 300 })}`, fields: [{ label: "Y =", ans: 5 }],
      hint: R`Η συνθήκη ελέγχεται μετά το σώμα.`, sol: R`<table class="tbl"><tr><th>X</th><th>Y</th><th>X&lt;1000</th><th>Α/Ψ</th></tr><tr><td>1</td><td>0</td><td></td><td></td></tr><tr><td>5</td><td>1</td><td>5&lt;1000</td><td>Α</td></tr><tr><td>25</td><td>2</td><td>25&lt;1000</td><td>Α</td></tr><tr><td>125</td><td>3</td><td>125&lt;1000</td><td>Α</td></tr><tr><td>625</td><td>4</td><td>625&lt;1000</td><td>Α</td></tr><tr><td>3125</td><td>5</td><td>3125&lt;1000</td><td>Ψ</td></tr></table>Τυπώνεται <b>5</b>: η μικρότερη δύναμη του 5 που φτάνει τουλάχιστον το 1000 είναι η $5^5$.` },
    { level: 2, q: R`Στο πρόγραμμα Average (μέσος όρος των 10, 11, …, 15) ποια τιμή έχει η μεταβλητή <code>metritis</code> στο τέλος και τι εμφανίζεται για τον μέσο όρο;${CPP(`
sum = 0;
metritis = 0;
for (no = 10; no <= 15; no++) {
    sum = sum + no;
    metritis = metritis + 1;
}
mesos = (float) sum / metritis;
cout << fixed << setprecision(2) << mesos;`, { nonum: true })}`, fields: [{ label: "metritis =", ans: 6 }, { label: "Έξοδος:", ans: "12.50", text: true }],
      hint: R`Πόσοι αριθμοί υπάρχουν από 10 έως 15;`, sol: R`Ο βρόχος εκτελείται για no = 10…15, δηλαδή 6 φορές → metritis = <b>6</b>, sum = 75. mesos = 75 / 6 = 12.5 → ${OUT(`12.50`)}` },
    { level: 2, type: "mc", q: R`Ένα πρόγραμμα μεταγλωττίζεται κανονικά, αλλά για είσοδο 123 και 56 τυπώνει 4 αντί για 4.5, εξαιτίας της εντολής <code>mesos = (m1 + m2) / 2;</code> (m1, m2 ακέραιοι). Τι είδους λάθος είναι;`,
      options: ["Λογικό λάθος", "Συντακτικό λάθος", "Λάθος υπερχείλισης", "Δεν είναι λάθος"], correct: 0,
      hint: R`Το πρόγραμμα τρέχει, αλλά το αποτέλεσμα είναι λανθασμένο.`, sol: R`<b>Λογικό λάθος</b>: ο μεταγλωττιστής δεν το εντοπίζει· γίνεται ακέραια διαίρεση. Διόρθωση: <code>(m1 + m2) / 2.0</code>.` },
    { level: 2, q: R`Τι θα τυπωθεί από το λογικό διάγραμμα για <b>Salary = 1500</b> και τι για <b>Salary = 800</b>;${ia3Flow([{ t: "term", s: "Αρχή" }, { t: "io", s: "Διάβασε Salary" }, { t: "if", c: "Salary > 1000", yes: [{ t: "proc", s: "Tax ← Salary * 0.2" }], no: [{ t: "proc", s: "Tax ← Salary * 0.1" }] }, { t: "io", s: "Τύπωσε Tax" }, { t: "term", s: "Τέλος" }], { w: 380 })}`, fields: [{ label: "1500 →", ans: 300 }, { label: "800 →", ans: 80 }],
      hint: R`Ακολούθησε την έξοδο Α ή Ψ της απόφασης.`, sol: R`1500 &gt; 1000 → Α → Tax = 1500 · 0,2 = <b>300</b>. 800 &gt; 1000 → Ψ → Tax = 800 · 0,1 = <b>80</b>.` },
    { level: 3, type: "mc", q: R`Ποιο τμήμα προγράμματος αντιστοιχεί <b>ακριβώς</b> στο λογικό διάγραμμα;${ia3Flow([{ t: "proc", s: "Salary ← 350" }, { t: "while", c: "Salary < 5000", body: [{ t: "proc", s: "Salary ← Salary * 2" }] }, { t: "io", s: "Τύπωσε Salary" }], { w: 300, stubs: true })}`,
      options: [CPP(`Salary = 350;\nwhile (Salary < 5000)\n    Salary = Salary * 2;\ncout << Salary;`, { nonum: true, small: true }), CPP(`Salary = 350;\ndo {\n    Salary = Salary * 2;\n} while (Salary < 5000);\ncout << Salary;`, { nonum: true, small: true }), CPP(`Salary = 350;\nif (Salary < 5000)\n    Salary = Salary * 2;\ncout << Salary;`, { nonum: true, small: true }), CPP(`Salary = 350;\nwhile (Salary > 5000)\n    Salary = Salary * 2;\ncout << Salary;`, { nonum: true, small: true })], correct: 0,
      hint: R`Ο ρόμβος είναι πριν από το σώμα και υπάρχει βέλος επιστροφής.`, sol: R`Η απόφαση ελέγχεται <b>πριν</b> από το σώμα και υπάρχει βέλος επιστροφής → <b>while</b> με συνθήκη <code>Salary &lt; 5000</code>. Το do…while ελέγχει στο τέλος, το if δεν επαναλαμβάνει και η συνθήκη &gt; είναι η αντίθετη. (Τυπώνεται 5600.)` },
    { level: 3, q: R`Το λογικό διάγραμμα μετρά τους διψήφιους αριθμούς των οποίων το άθροισμα ψηφίων ισούται με N. Τι θα τυπωθεί για <b>N = 12</b>;${ia3Flow([{ t: "term", s: "Αρχή" }, { t: "io", s: "Διάβασε N" }, { t: "proc", s: "c ← 0" }, { t: "proc", s: "i ← 10" }, { t: "while", c: "i <= 99", body: [{ t: "if", c: "i / 10 + i % 10 == N", yes: [{ t: "proc", s: "c ← c + 1" }], no: [] }, { t: "proc", s: "i ← i + 1" }] }, { t: "io", s: "Τύπωσε c" }, { t: "term", s: "Τέλος" }], { w: 420 })}`, fields: [{ label: "c =", ans: 7 }],
      hint: R`Γράψε τους διψήφιους με άθροισμα ψηφίων 12 (το πρώτο ψηφίο τουλάχιστον 3).`, sol: R`39, 48, 57, 66, 75, 84, 93 → <b>7</b> αριθμοί.` },
    { level: 3, type: "mc", q: R`Ένα πρόγραμμα υπολογίζει τη δύναμη $b^e$ με <code>int result = 1;</code> και <code>result = result * b;</code> μέσα σε βρόχο. Για b = 10 και e = 15 τυπώνει λάθος αποτέλεσμα. Γιατί;`,
      options: ["Γίνεται υπερχείλιση: το αποτέλεσμα ξεπερνά το INT_MAX", "Ο βρόχος εκτελείται μία φορά λιγότερο", "Η pow δεν δέχεται ακέραιους", "Γίνεται ακέραια διαίρεση"], correct: 0,
      hint: R`Ποια είναι η μεγαλύτερη τιμή που χωρά σε int;`, sol: R`Το $10^{15}$ είναι πολύ μεγαλύτερο από το <code>INT_MAX</code> = 2147483647 ≈ $2{,}1 \cdot 10^9$. Από i = 10 και μετά γίνεται <b>υπερχείλιση</b> — φαίνεται τυπώνοντας ενδιάμεσα αποτελέσματα. Λύση: τύπος <code>long long</code> (έως ≈ $9{,}2 \cdot 10^{18}$).` },
    { level: 2, type: "mc", q: R`Για τον έλεγχο του προγράμματος που υπολογίζει τη δύναμη $b^e$ (b, e μη αρνητικοί ακέραιοι), ποια είσοδος <b>δεν</b> είναι ακραία περίπτωση;`,
      options: ["b = 3, e = 4", "b = 5, e = 0", "b = 0, e = 0", "b = 10000, e = 10000"], correct: 0,
      hint: R`Ακραίες είναι οι τιμές στα «όρια» του προβλήματος.`, sol: R`Η <b>b = 3, e = 4</b> είναι συνηθισμένη περίπτωση. Ακραίες είναι: εκθέτης 0, βάση 0, και τα δύο 0, πολύ μεγάλες τιμές (υπερχείλιση).` }
  ]
},
/* ───────────────────────────── 3.6 ───────────────────────────── */
{
  id: "3.6", unit: 3, title: "Μονοδιάστατοι πίνακες (1D arrays) στη C++: άθροισμα, μέγιστο, ελάχιστο, μέτρηση, παράλληλοι πίνακες",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.1 §7 Πίνακες (σ. 86–88) και ασκήσεις κεφαλαίου (σ. 102–105)",
  intro: "Πώς αποθηκεύουμε πολλές τιμές σε έναν μονοδιάστατο πίνακα στη C++ και πώς βρίσκουμε άθροισμα, μέσο όρο, μέγιστο, ελάχιστο και τη θέση του;",
  thumb: ICON("A[i]", "blue"),
  theory: R`
<p>Ένας <b>μονοδιάστατος πίνακας</b> (1D array) ομαδοποιεί δεδομένα <b>του ίδιου τύπου</b> κάτω από ένα όνομα. Κάθε στοιχείο του προσπελάζεται με το όνομα και έναν <b>δείκτη</b> (index) σε αγκύλες, που δηλώνει τη θέση του. Στη C++ ο δείκτης ξεκινά από το <b>0</b>: ένας πίνακας N θέσεων έχει στοιχεία <code>A[0]</code> έως <code>A[N-1]</code>. Οι πίνακες είναι η βάση για τους αλγόριθμους αναζήτησης, ταξινόμησης και για τους δισδιάστατους πίνακες.</p>
<div class="tbox def"><h4>Δήλωση και αρχικές τιμές πίνακα</h4>
<p>Στη δήλωση δίνουμε τον <b>τύπο</b>, το <b>όνομα</b> και το <b>πλήθος θέσεων</b>, που πρέπει να είναι <b>σταθερά</b>:</p>
${CPP(`
const int N = 10;
int grades[N];                         // 10 ακέραιοι: grades[0] … grades[9]
int marks[4] = {16, 18, 15, 20};       // με αρχικές τιμές
int primes[] = {2, 3, 5, 7, 11};       // το μέγεθος (5) προκύπτει από τις τιμές
int a[5] = {12, 5, 4};                 // a → {12, 5, 4, 0, 0}
char characters[3] = {'a', 'b', 'c', 'd'};   // ΣΦΑΛΜΑ: περισσότερες τιμές από θέσεις`, { nonum: true })}
<p>Αν δοθούν λιγότερες αρχικές τιμές, οι υπόλοιπες θέσεις παίρνουν <b>0</b>. Ένας πίνακας που δηλώνεται <b>έξω από τη main</b> (καθολικός) αρχικοποιείται εξ ολοκλήρου με 0. Το μέγεθος μπορεί να δοθεί και με <code>#define N 100</code>, όπως στο βιβλίο — ποτέ όμως με μεταβλητή που διαβάζεται από το πληκτρολόγιο.</p></div>
<div class="tbox def"><h4>Είσοδος, άθροισμα και μέσος όρος</h4>
${CPP(`
const int N = 10;
int grades[N], sum = 0;
float mo;
for (int i = 0; i < N; i++) {
    cin >> grades[i];
    sum += grades[i];
}
mo = float(sum) / N;`, { hl: [4, 5, 6] })}
<p>Ο βρόχος <code>for (int i = 0; i &lt; N; i++)</code> επισκέπτεται όλα τα στοιχεία. Για τον μέσο όρο χρειάζεται <code>float(sum)</code>, αλλιώς γίνεται ακέραια διαίρεση.</p></div>
<div class="tbox thm"><h4>Μέγιστο / ελάχιστο και η θέση του</h4>
${CPP(`
int max = A[0], pos = 0;
for (int i = 1; i < N; i++)
    if (A[i] > max) {
        max = A[i];
        pos = i;
    }`)}
<p>Αρχικοποιούμε με το <b>πρώτο στοιχείο</b> (όχι με 0 — αν όλα είναι αρνητικά, το 0 θα έδινε λάθος). Με <code>&gt;</code> κρατάμε την <b>πρώτη</b> εμφάνιση του μέγιστου, με <code>&gt;=</code> την <b>τελευταία</b>. Για <b>όλες</b> τις θέσεις του μέγιστου χρειάζεται δεύτερο πέρασμα: <code>if (A[i] == max) cout &lt;&lt; i &lt;&lt; " ";</code>.</p></div>
<div class="tbox def"><h4>Παράλληλοι πίνακες</h4>
<p>Όταν για κάθε οντότητα έχουμε πολλά στοιχεία διαφορετικού τύπου (π.χ. όνομα και βαθμό), χρησιμοποιούμε <b>παράλληλους πίνακες</b>: το ίδιο <code>i</code> αντιστοιχεί στον ίδιο μαθητή σε όλους τους πίνακες.</p>
${CPP(`
#include <iostream>
#include <string>
using namespace std;
int main() {
    const int N = 10;
    string names[N];
    int grades[N], sum = 0, i;
    float mo;
    for (i = 0; i < N; i++) {
        cin >> names[i] >> grades[i];
        sum += grades[i];
    }
    mo = float(sum) / N;
    for (i = 0; i < N; i++)
        if (grades[i] > mo)
            cout << names[i] << endl;
    return 0;
}`, { title: "Παράδειγμα 1.14 — μαθητές με βαθμό πάνω από τον μέσο όρο" })}</div>
<div class="tbox ex"><h4>Ίχνος: τι εμφανίζει;</h4>
${CPP(`
int arr[6];
int i;
for (i = 0; i < 6; i++) {
    arr[i] = (i + 1) % 3;
    cout << arr[i] << " ";
}`)}
<details class="steps"><summary>Λύση βήμα-βήμα</summary><table class="tbl"><tr><th>i</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr><tr><th>(i+1)%3</th><td>1</td><td>2</td><td>0</td><td>1</td><td>2</td><td>0</td></tr></table>${OUT(`1 2 0 1 2 0`)}</details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Βρόχος <code>for (i = 0; i &lt;= N; i++)</code>: προσπέλαση της ανύπαρκτης θέσης <code>A[N]</code> (εκτός ορίων!) · αρχικοποίηση του μέγιστου με 0 · ξεχνάμε ότι η πρώτη θέση είναι η 0 όταν ζητείται «η θέση» · μέγεθος πίνακα από μεταβλητή (<code>int A[n];</code> με n από cin) · ακέραια διαίρεση στον μέσο όρο.</p></div>
`,
  widget: "ia3arr",
  gen: "ia3arrg",
  exercises: [
    { level: 1, q: R`Ποιος είναι ο δείκτης του <b>τελευταίου</b> στοιχείου του πίνακα <code>int A[20];</code>;`, fields: [{ label: "Δείκτης:", ans: 19 }],
      hint: R`Οι δείκτες ξεκινούν από το 0.`, sol: R`Οι θέσεις είναι A[0] … A[19], άρα ο τελευταίος δείκτης είναι <b>19</b>.` },
    { level: 1, q: R`Τι θα εμφανίσει το τμήμα;${CPP(`
int a[5] = {12, 5, 4};
cout << a[3] + a[1];`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: 5 }],
      hint: R`Ποιες τιμές παίρνουν οι θέσεις χωρίς αρχική τιμή;`, sol: R`a = {12, 5, 4, 0, 0}, άρα a[3] + a[1] = 0 + 5 = <b>5</b>.` },
    { level: 1, type: "mc", q: R`Ποια δήλωση πίνακα είναι <b>λανθασμένη</b>;`,
      options: ["<code>char c[3] = {'a', 'b', 'c', 'd'};</code>", "<code>int p[] = {2, 3, 5, 7};</code>", "<code>int a[5] = {1, 2};</code>", "<code>float t[4];</code>"], correct: 0,
      hint: R`Μπορούμε να δώσουμε περισσότερες αρχικές τιμές από τις θέσεις;`, sol: R`Η <code>char c[3] = {'a','b','c','d'};</code> δίνει 4 τιμές σε 3 θέσεις → <b>σφάλμα</b>. Οι υπόλοιπες είναι σωστές (λιγότερες τιμές → μηδενικά, μέγεθος από τις τιμές, χωρίς αρχικές τιμές).` },
    { level: 2, q: R`Τι θα εμφανίσει το τμήμα προγράμματος (άσκηση του βιβλίου);${CPP(`
int arr[6];
int i;
for (i = 0; i < 6; i++) {
    arr[i] = (i + 1) % 3;
    cout << arr[i] << " ";
}`)}`, fields: [{ label: "Έξοδος:", ans: "1 2 0 1 2 0", text: true }],
      hint: R`Υπολόγισε (i + 1) % 3 για i = 0…5.`, sol: R`i = 0…5 → (i+1) = 1…6 → υπόλοιπα με το 3: 1, 2, 0, 1, 2, 0. ${OUT(`1 2 0 1 2 0`)}` },
    { level: 2, q: R`Το πρόγραμμα διαβάζει N = 10 και τους αριθμούς <code>3 9 2 9 7 8 1 1 9 5</code>. Τι θα τυπώσει σε κάθε γραμμή;${CPP(`
const int MAX = 100;
int A[MAX], N, i, mn, mx;
cin >> N;
for (i = 0; i < N; i++)
    cin >> A[i];
mn = A[0];
mx = A[0];
for (i = 1; i < N; i++) {
    if (A[i] < mn)
        mn = A[i];
    if (A[i] > mx)
        mx = A[i];
}
for (i = 0; i < N; i++)
    if (A[i] == mn)
        cout << i << " ";
cout << endl;
for (i = 0; i < N; i++)
    if (A[i] == mx)
        cout << i << " ";`)}`, fields: [{ label: "1η γραμμή:", ans: "6 7", text: true }, { label: "2η γραμμή:", ans: "1 3 8", text: true }],
      hint: R`Βρες πρώτα το ελάχιστο και το μέγιστο· μετά όλες τις θέσεις τους (από το 0).`, sol: R`Ελάχιστο 1 στις θέσεις <b>6, 7</b>· μέγιστο 9 στις θέσεις <b>1, 3, 8</b>. ${OUT(`6 7\n1 3 8`)}` },
    { level: 2, q: R`Πόσοι αριθμοί του πίνακα είναι μεγαλύτεροι από τον <b>τελευταίο</b>;${CPP(`
const int N = 10;
int A[N] = {4, 9, 1, 7, 3, 8, 6, 2, 10, 5};
int c = 0;
for (int i = 0; i < N - 1; i++)
    if (A[i] > A[N - 1])
        c++;
cout << c;`)}`, fields: [{ label: "Έξοδος:", ans: 5 }],
      hint: R`Ο τελευταίος είναι το A[9].`, sol: R`A[9] = 5. Μεγαλύτεροι: 9, 7, 8, 6, 10 → <b>5</b>. ${OUT(`5`)}` },
    { level: 2, q: R`Η εταιρεία μελιού μαζεύει μέλι από μια κυψέλη μόνο αν η <b>προηγούμενη</b> δεν έχει καθόλου μέλι. Τι θα τυπώσει το πρόγραμμα;${CPP(`
const int N = 7;
int K[N] = {0, 3, 1, 0, 4, 0, 2};
int total = K[0];
for (int i = 1; i < N; i++)
    if (K[i - 1] == 0)
        total += K[i];
cout << total;`)}`, fields: [{ label: "Έξοδος:", ans: 9 }],
      hint: R`Ποιες κυψέλες έχουν μπροστά τους κυψέλη με 0;`, sol: R`Μετά από 0 βρίσκονται οι K[1] = 3, K[4] = 4, K[6] = 2 (και η K[0] = 0). Σύνολο 0 + 3 + 4 + 2 = <b>9</b>. ${OUT(`9`)}` },
    { level: 3, q: R`Τι θα τυπώσει το πρόγραμμα με τους παράλληλους πίνακες; (γράψε τα ονόματα σε μία γραμμή, χωρισμένα με κενό, π.χ. <code>Anna Maria</code>)${CPP(`
const int N = 5;
string names[N] = {"Anna", "Petros", "Maria", "Kostas", "Eleni"};
int grades[N] = {15, 18, 12, 19, 16};
int sum = 0;
float mo;
for (int i = 0; i < N; i++)
    sum += grades[i];
mo = float(sum) / N;
for (int i = 0; i < N; i++)
    if (grades[i] > mo)
        cout << names[i] << endl;`)}`, fields: [{ label: "Έξοδος:", ans: ["Petros Kostas", "Petros, Kostas", "Petros,Kostas", "Petros/Kostas", "Petros / Kostas"], text: true, cs: true }],
      hint: R`Υπολόγισε πρώτα τον μέσο όρο.`, sol: R`sum = 80, mo = 16.0. Βαθμοί &gt; 16: 18 (Petros) και 19 (Kostas) — η Eleni έχει ακριβώς 16, όχι μεγαλύτερο. ${OUT(`Petros\nKostas`)}` },
    { level: 3, q: R`Για τον πίνακα <code>A = {4, 7, 2, 7, 5}</code>, ποια τιμή θα έχει η <code>pos</code> αν η σύγκριση είναι <code>A[i] &gt; max</code> και ποια αν είναι <code>A[i] &gt;= max</code>;${CPP(`
int max = A[0], pos = 0;
for (int i = 1; i < 5; i++)
    if (A[i] > max) {      // ή: A[i] >= max
        max = A[i];
        pos = i;
    }`, { nonum: true })}`, fields: [{ label: "με > :", ans: 1 }, { label: "με >= :", ans: 3 }],
      hint: R`Το μέγιστο (7) εμφανίζεται δύο φορές.`, sol: R`Με <code>&gt;</code> η θέση αλλάζει μόνο για <b>γνήσια</b> μεγαλύτερη τιμή → πρώτη εμφάνιση, pos = <b>1</b>. Με <code>&gt;=</code> αλλάζει και στην ισότητα → τελευταία εμφάνιση, pos = <b>3</b>.` },
    { level: 2, q: R`Τι θα εμφανίσει το τμήμα;${CPP(`
const int N = 5;
int A[N] = {2, 4, 6, 8, 10};
int temp;
for (int i = 0; i < N / 2; i++) {
    temp = A[i];
    A[i] = A[N - 1 - i];
    A[N - 1 - i] = temp;
}
for (int i = 0; i < N; i++)
    cout << A[i] << " ";`)}`, fields: [{ label: "Έξοδος:", ans: "10 8 6 4 2", text: true }],
      hint: R`Ο πρώτος βρόχος ανταλλάσσει συμμετρικά στοιχεία (N / 2 = 2 ανταλλαγές).`, sol: R`Ανταλλαγές A[0] ↔ A[4] και A[1] ↔ A[3]· το μεσαίο μένει. Ο πίνακας αντιστρέφεται: ${OUT(`10 8 6 4 2`)}` }
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

/* Πληροφορική Γ΄ Λυκείου — Γ1.1 Δυαδικό σύστημα: widgets & γεννήτριες (prefix ia1) */
function ia1Style() {
  if (document.getElementById("ia1css")) return;
  const st = document.createElement("style"); st.id = "ia1css";
  st.textContent = `
.ia1row{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin:8px 0}
.ia1bit{display:flex;flex-direction:column;align-items:center;min-width:34px;padding:5px 3px;border-radius:10px;border:1.5px solid var(--line);background:#fff;cursor:pointer;font:inherit;transition:.15s;user-select:none}
.ia1bit b{font:800 20px "SF Mono",Consolas,Menlo,monospace;color:#9aa7bd}
.ia1bit small{font-size:10.5px;color:var(--muted);line-height:1.2}
.ia1bit em{font-style:normal;font-size:10.5px;font-weight:700;color:var(--amber)}
.ia1bit.on{background:#e6f0fb;border-color:var(--blue)}.ia1bit.on b{color:var(--blue)}
.ia1bit.sg{border-color:var(--red)}.ia1bit.sg.on{background:#fdecee}.ia1bit.sg.on b{color:var(--red)}
.ia1bit.keep{background:#e9f7ef;border-color:var(--green)}.ia1bit.keep b{color:var(--green)}
.ia1bit.flip{background:#f1ebfb;border-color:var(--purple)}.ia1bit.flip b{color:var(--purple)}
.ia1pt{align-self:center;font:900 24px var(--sans);color:var(--ink);padding:0 2px}
.ia1in{font:600 15px "SF Mono",Consolas,Menlo,monospace;padding:6px 9px;border:1px solid var(--line);border-radius:9px;width:150px;max-width:100%}
.ia1in.sm{width:80px}
.ia1big{font:800 18px "SF Mono",Consolas,Menlo,monospace;color:var(--navy);word-break:break-all}
.ia1grid{display:grid;gap:2px;justify-content:center;font:700 16px "SF Mono",Consolas,Menlo,monospace;margin:8px auto}
.ia1grid div{width:25px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:6px}
.ia1grid .lab{width:auto;min-width:27px;font:700 12px var(--sans);color:var(--muted);justify-content:flex-end;padding-right:4px}
.ia1grid .cr{font-size:12px;color:var(--amber)}.ia1grid .rs{background:#e6f0fb;color:var(--blue)}.ia1grid .now{outline:2px solid var(--amber)}
.ia1grid .ov{background:#fdecee;color:var(--red)}.ia1grid .ln{border-top:2px solid var(--navy);border-radius:0}
.ia1tw{overflow-x:auto;max-width:100%}
.ia1tw table.tbl td,.ia1tw table.tbl th{padding:4px 10px;text-align:center}
.ia1tw tr.new td{background:#fff6e5}.ia1tw tr.rep td{background:#fdecee}
.ia1steps{margin:6px 0 0 0;padding-left:18px}.ia1steps li{margin:4px 0}
.ia1kv{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;align-items:center}
.ia1kv span{font-size:13.5px;color:var(--muted);font-weight:600}
`;
  document.head.appendChild(st);
}
const ia1Fmt = v => { const r = Math.round(v * 1e10) / 1e10; return String(r); };
const ia1Flip = s => [...s].map(c => c === "1" ? "0" : "1").join("");
const ia1Two = s => { const n = s.length, v = parseInt(s, 2); return v ? ia1Bin((2 ** n - v) % 2 ** n, n) : ia1Bin(0, n); };
const ia1Clean = s => String(s).replace(/,/g, ".").replace(/\s+/g, "");
const ia1Bind = (box, sel, ev, fn) => box.querySelectorAll(sel).forEach(e => e.addEventListener(ev, fn));
/* ανάπτυγμα σε δυνάμεις του 2 (HTML) */
function ia1Expand(bin) {
  const [ip, fp = ""] = bin.split("."), t = [];
  [...ip].forEach((b, i) => { if (b === "1") t.push(`2<sup>${ip.length - 1 - i}</sup>`); });
  [...fp].forEach((b, i) => { if (b === "1") t.push(`2<sup>−${i + 1}</sup>`); });
  return t.length ? t.join(" + ") : "0";
}
const ia1Val = bin => { const [ip, fp = ""] = bin.split("."); let v = ip ? parseInt(ip, 2) : 0; [...fp].forEach((b, i) => { if (b === "1") v += 2 ** -(i + 1); }); return v; };
const ia1Terms = bin => { const [ip, fp = ""] = bin.split("."), t = []; [...ip].forEach((b, i) => { if (b === "1") t.push(2 ** (ip.length - 1 - i)); }); [...fp].forEach((b, i) => { if (b === "1") t.push(2 ** -(i + 1)); }); return t; };
/* σειρά πράξης στο ίδιο πλάτος για τις λύσεις */
const ia1Add8 = (a, b) => { const s = parseInt(a, 2) + parseInt(b, 2); return s > 255 ? "1 " + ia1Bin(s & 255, 8) : ia1Bin(s, 8); };

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 1.1 Δυαδικό → δεκαδικό: bits με βάρη ---------- */
  ia1bits(box) {
    ia1Style();
    box.innerHTML = `<div class="wctl"><label>Γράψε δυαδικό: <input class="ia1in bi" value="1010.01" spellcheck="false" autocomplete="off"></label>
      <label><input type="checkbox" class="fr" checked> με υποδιαστολή (3 κλασματικά bits)</label><button class="btn ghost clr">↺ μηδένισε</button><button class="btn ghost rnd">🎲 τυχαίος</button></div>
      <div class="ia1row"></div><div class="wout"></div><p class="muted small">👆 Πάτησε ένα bit για να το αλλάξεις (0 ↔ 1). Κάτω από κάθε bit: η δύναμη του 2 και η αξία της θέσης.</p>`;
    let I = [0, 0, 0, 0, 1, 0, 1, 0], F = [0, 1, 0];
    const row = $(".ia1row", box), out = $(".wout", box), inp = $(".bi", box);
    function str() { const fr = $(".fr", box).checked; let ip = I.join("").replace(/^0+(?=.)/, ""); return fr ? ip + "." + F.join("") : ip; }
    function draw(fromInput) {
      const fr = $(".fr", box).checked;
      if (!row.children.length) {
        I.forEach((_, i) => { const e = 7 - i, el = h("button", { class: "ia1bit" }, `<b></b><small>2<sup>${e}</sup></small><em>${2 ** e}</em>`); el.onclick = () => { I[i] ^= 1; draw(); }; row.appendChild(el); });
        row.appendChild(h("span", { class: "ia1pt fx" }, "."));
        F.forEach((_, i) => { const el = h("button", { class: "ia1bit fx" }, `<b></b><small>2<sup>−${i + 1}</sup></small><em>${[0.5, 0.25, 0.125][i]}</em>`); el.onclick = () => { F[i] ^= 1; draw(); }; row.appendChild(el); });
      }
      const btns = row.querySelectorAll("button");
      [...I, ...F].forEach((b, i) => { btns[i].classList.toggle("on", !!b); $("b", btns[i]).textContent = b; });
      row.querySelectorAll(".fx").forEach(e => e.style.display = fr ? "" : "none");
      const s = fr ? I.join("") + "." + F.join("") : I.join(""), v = ia1Val(s), t = ia1Terms(s);
      if (!fromInput) inp.value = str();
      out.innerHTML = `<div class="ia1big">(${s})<sub>2</sub> = ${ia1Expand(s)} = ${t.length ? t.map(ia1Fmt).join(" + ") : "0"} = <span style="color:var(--green)">(${ia1Fmt(v)})<sub>10</sub></span></div>
        <div class="muted small" style="margin-top:6px">Ακέραιο μέρος σε 8 bits = 1 byte: εύρος 0 … 255. ${I.every(x => x) ? "Όλα 1 → 2⁸ − 1 = 255." : ""}${I.join("") === "10000000" ? "1 και 7 μηδενικά → 2⁷ = 128." : ""}</div>`;
    }
    inp.oninput = () => { const s = ia1Clean(inp.value); if (!/^[01]{0,8}(\.[01]{0,3})?$/.test(s)) { inp.style.borderColor = "var(--red)"; return; } inp.style.borderColor = "";
      const [ip, fp] = s.split("."); I = ia1Bin(parseInt(ip || "0", 2), 8).split("").map(Number); if (fp !== undefined) { $(".fr", box).checked = true; F = (fp + "000").slice(0, 3).split("").map(Number); } draw(true); };
    $(".fr", box).onchange = () => draw(); $(".clr", box).onclick = () => { I = I.map(() => 0); F = F.map(() => 0); draw(); };
    $(".rnd", box).onclick = () => { I = I.map(() => ri(0, 1)); F = F.map(() => ri(0, 1)); draw(); };
    draw();
  },

  /* ---------- 1.2 Δεκαδικό → δυαδικό: διαδοχικές διαιρέσεις ---------- */
  ia1div(box) {
    ia1Style();
    box.innerHTML = `<div class="wctl"><label>Δεκαδικός ακέραιος: <input class="ia1in sm n" type="number" min="0" max="65535" value="23"></label>
      <button class="btn primary st">▶ Βήμα</button><button class="btn ghost all">⏩ Όλα</button><button class="btn ghost rs">↺</button></div>
      <div class="figrow"><div class="ia1tw tb"></div><div class="res"></div></div>`;
    let k = 0;
    const N = () => Math.max(0, Math.min(65535, Math.floor(+$(".n", box).value || 0)));
    function draw() {
      const n = N(), rows = ia1DivRows(n); k = Math.min(k, rows.length);
      $(".tb", box).innerHTML = `<table class="tbl"><tr><th>Αριθμός</th><th>Πηλίκο</th><th>Υπόλοιπο</th></tr>${rows.slice(0, k).map((r, i) => `<tr class="${i === k - 1 ? "new" : ""}"><td>${r[0]} / 2 =</td><td>${r[1]}</td><td><b style="color:var(--blue)">${r[2]}</b></td></tr>`).join("")}</table>`;
      const done = k === rows.length, bits = rows.map(r => r[2]).reverse().join("");
      $(".res", box).innerHTML = !k ? `<p class="muted">Πάτησε <b>▶ Βήμα</b>: διαιρούμε με το 2 και σημειώνουμε το υπόλοιπο, όσο το πηλίκο είναι μεγαλύτερο από 0.</p>`
        : !done ? `<p>Το πηλίκο <b>${rows[k - 1][1]}</b> είναι &gt; 0 → συνεχίζουμε με διαίρεση του ${rows[k - 1][1]}.</p><p class="muted small">Υπόλοιπα μέχρι τώρα (με τη σειρά που βρέθηκαν): ${rows.slice(0, k).map(r => r[2]).join(", ")}</p>`
        : `<p>Πηλίκο 0 → <b>τέλος</b>. Διαβάζουμε τα υπόλοιπα <b>από κάτω προς τα πάνω</b> ⬆</p><div class="fbox"><span class="ia1big">(${n})<sub>10</sub> = (${bits})<sub>2</sub></span></div>
           <p class="small">${bits.length} bits${n <= 255 ? ` · σε 8 bits: <code>${ia1Bin(n, 8)}</code>` : ""} · επαλήθευση: ${ia1Expand(bits)} = ${n}</p>`;
    }
    $(".st", box).onclick = () => { k++; draw(); }; $(".all", box).onclick = () => { k = 99; draw(); }; $(".rs", box).onclick = () => { k = 0; draw(); };
    $(".n", box).oninput = () => { k = 0; draw(); }; draw();
  },

  /* ---------- 1.3 Δεκαδικός με υποδιαστολή → δυαδικό ---------- */
  ia1frac(box) {
    ia1Style();
    box.innerHTML = `<div class="wctl"><label>Αριθμός: <input class="ia1in sm x" value="12.45" spellcheck="false" autocomplete="off"></label>
      <label>κλασματικά bits k = <input class="ia1in sm k" type="number" min="1" max="16" value="7" style="width:62px"></label>
      <button class="btn primary st">▶ Βήμα</button><button class="btn ghost all">⏩ Όλα</button><button class="btn ghost rs">↺</button></div>
      <div class="figrow"><div><p class="small"><b>Ακέραιο μέρος</b> (διαιρέσεις)</p><div class="ia1tw ti"></div></div><div><p class="small"><b>Κλασματικό μέρος</b> (πολλαπλασιασμοί)</p><div class="ia1tw tf"></div></div></div><div class="wout"></div>`;
    let s = 0;
    function parse() {
      const t = ia1Clean($(".x", box).value); if (!/^\d{1,5}(\.\d{1,6})?$/.test(t)) return null;
      const [ip, fp = ""] = t.split("."), d = fp.length, den = 10 ** d; return { ip: +ip, num: d ? +fp : 0, den, txt: t };
    }
    function draw() {
      const P = parse(), K = Math.max(1, Math.min(16, Math.floor(+$(".k", box).value || 1)));
      if (!P) { $(".wout", box).innerHTML = `<span class="warnc">Γράψε θετικό αριθμό, π.χ. 12.45 ή 0.6875 (έως 6 δεκαδικά).</span>`; return; }
      $(".ti", box).innerHTML = ia1DivTbl(P.ip);
      const rows = [], seen = new Map(), mark = new Set(); let num = P.num, rep = -1;
      for (let i = 0; i < K && num; i++) { if (seen.has(num)) { if (rep < 0) rep = seen.get(num); mark.add(i); mark.add(seen.get(num)); } else seen.set(num, i); const p = 2 * num, b = p >= P.den ? 1 : 0; rows.push([ia1Dec(num, P.den), ia1Dec(p, P.den), b, num]); num = p - b * P.den; }
      const exact = !num; s = Math.min(s, rows.length);
      $(".tf", box).innerHTML = P.num ? `<table class="tbl"><tr><th>Αριθμός</th><th>Γινόμενο</th><th>Bit</th></tr>${rows.slice(0, s).map((r, i) => `<tr class="${mark.has(i) && rows[i][3] === rows[rep][3] ? "rep" : i === s - 1 ? "new" : ""}"><td>${r[0]} × 2 =</td><td>${r[1]}</td><td><b style="color:var(--purple)">${r[2]}</b></td></tr>`).join("")}</table>` : `<p class="muted small">Δεν υπάρχει κλασματικό μέρος.</p>`;
      const ib = ia1Bin(P.ip), fb = rows.slice(0, s).map(r => r[2]).join(""), all = s === rows.length;
      const approx = P.ip + [...fb].reduce((a, b, i) => a + (+b) * 2 ** -(i + 1), 0), trueV = P.ip + P.num / P.den;
      let note = "";
      if (all && P.num) note = exact ? `Το κλασματικό μέρος έγινε <b>0</b> → η μετατροπή είναι <b>ακριβής</b>.` : `Σταματήσαμε στα <b>${K}</b> bits (επιθυμητή ακρίβεια) → <b>προσέγγιση</b>. Σφάλμα: ${ia1Fmt(trueV - approx)} &lt; 2<sup>−${K}</sup>.${rep >= 0 ? ` Το κλασματικό μέρος <b>${rows[rep][0]}</b> ξαναεμφανίστηκε (κόκκινες γραμμές) → το ανάπτυγμα είναι <b>περιοδικό</b>, δεν τελειώνει ποτέ.` : ""}`;
      $(".wout", box).innerHTML = `<div class="ia1big">(${P.txt})<sub>10</sub> ${all && exact ? "=" : "≈"} (${ib}${P.num ? "." + (fb || "…") : ""})<sub>2</sub></div>
        <div class="small" style="margin-top:6px">${all ? note : `Βήμα ${s}/${rows.length}: πολλαπλασιάζουμε <b>μόνο το κλασματικό μέρος</b> με το 2· bit = 1 αν το γινόμενο είναι ≥ 1. Τα bits γράφονται από πάνω προς τα κάτω.`}${fb ? `<br>Τιμή του δυαδικού: ${ia1Fmt(approx)}` : ""}</div>`;
    }
    $(".st", box).onclick = () => { s++; draw(); }; $(".all", box).onclick = () => { s = 99; draw(); }; $(".rs", box).onclick = () => { s = 0; draw(); };
    ia1Bind(box, "input", "input", () => { s = 0; draw(); }); draw();
  },

  /* ---------- 1.4 Πρόσθεση / αφαίρεση στήλη-στήλη ---------- */
  ia1add(box) {
    ia1Style();
    box.innerHTML = `<div class="wctl"><label>Χ = <input class="ia1in a" value="10101010" maxlength="8" spellcheck="false"></label><label><select class="op"><option value="+">+</option><option value="-">−</option></select></label>
      <label>Υ = <input class="ia1in b" value="01000111" maxlength="8" spellcheck="false"></label>
      <button class="btn primary st">▶ Στήλη</button><button class="btn ghost all">⏩ Όλες</button><button class="btn ghost rs">↺</button><button class="btn ghost rnd">🎲</button></div>
      <div class="ia1tw"><div class="ia1grid g"></div></div><div class="wout"></div>`;
    let c = 0;
    const rd = sel => { const v = $(sel, box).value.replace(/\s/g, ""); return /^[01]{1,8}$/.test(v) ? ia1Bin(parseInt(v, 2), 8) : null; };
    function draw() {
      const A = rd(".a"), B = rd(".b"), op = $(".op", box).value, g = $(".g", box), out = $(".wout", box);
      if (!A || !B) { out.innerHTML = `<span class="warnc">Γράψε δυαδικούς αριθμούς έως 8 bits (μόνο 0 και 1).</span>`; g.innerHTML = ""; return; }
      const a = parseInt(A, 2), b = parseInt(B, 2);
      if (op === "-" && a < b) { g.innerHTML = ""; out.innerHTML = `Εδώ Χ &lt; Υ (${a} &lt; ${b}). Η αφαίρεση με δανεικό του βιβλίου γίνεται για Χ ≥ Υ — για Χ &lt; Υ χρησιμοποίησε <b>συμπλήρωμα</b> (ενότητα 1.5). Αποτέλεσμα: ${a - b}.`; return; }
      c = Math.min(c, 8);
      const res = [], car = [0]; for (let i = 0; i < 8; i++) { const x = +A[7 - i], y = +B[7 - i], k = car[i];
        if (op === "+") { const t = x + y + k; res.push(t & 1); car.push(t >> 1); } else { let t = x - y - k; car.push(t < 0 ? 1 : 0); res.push((t + 2) & 1); } }
      const cols = 10; g.style.gridTemplateColumns = `auto repeat(9, 25px)`;
      const cell = (txt, cls = "") => `<div class="${cls}">${txt}</div>`;
      let html = cell(op === "+" ? "κρατ." : "δανεικό", "lab");
      for (let j = 8; j >= 0; j--) { const i = j; const show = i >= 1 && i <= c && car[i]; html += cell(show ? car[i] : "", "cr"); }
      html += cell("Χ", "lab") + cell("") + [...A].map((d, j) => cell(d, 7 - j === c - 1 ? "now" : "")).join("");
      html += cell(op === "+" ? "+ Υ" : "− Υ", "lab") + cell("") + [...B].map((d, j) => cell(d, 7 - j === c - 1 ? "now" : "")).join("");
      html += cell("=", "lab") + cell(c === 8 && op === "+" && car[8] ? "1" : "", "ln" + (c === 8 && op === "+" && car[8] ? " ov" : "")) + [...Array(8)].map((_, j) => { const i = 7 - j; return cell(i < c ? res[i] : "", "ln" + (i < c ? " rs" : "") + (i === c - 1 ? " now" : "")); }).join("");
      g.innerHTML = html;
      const R8 = res.slice().reverse().join(""), i = c - 1;
      let msg = "";
      if (c === 0) msg = `Ξεκινάμε από τη <b>δεξιότερη στήλη</b> (2<sup>0</sup>) προς τα αριστερά. Πάτησε ▶ Στήλη.`;
      else if (c < 8) { const x = +A[7 - i], y = +B[7 - i], k = car[i];
        msg = op === "+" ? `Στήλη 2<sup>${i}</sup>: ${x} + ${y}${k ? " + 1 (κρατ.)" : ""} = ${x + y + k} = (${ia1Bin(x + y + k, x + y + k > 1 ? 2 : 1)})<sub>2</sub> → γράφουμε <b>${res[i]}</b>${car[i + 1] ? ", κρατάμε <b>1</b>" : ""}.`
          : `Στήλη 2<sup>${i}</sup>: ${x} − ${y}${k ? " − 1 (δανεικό)" : ""}${car[i + 1] ? ` &lt; 0 → δανειζόμαστε: ${x + 2} − ${y + k}` : ""} → γράφουμε <b>${res[i]}</b>${car[i + 1] ? ", δανεικό <b>1</b> στην επόμενη στήλη" : ""}.`; }
      else msg = op === "+" ? (car[8] ? `Αποτέλεσμα: <b>1 ${R8}</b> → <span style="color:var(--red);font-weight:700">υπερχείλιση</span>: ${a} + ${b} = ${a + b} &gt; 255, δεν χωρά σε 8 bits.` : `Αποτέλεσμα: <b>${R8}</b> · έλεγχος: ${a} + ${b} = ${a + b} ✓`) : `Αποτέλεσμα: <b>${R8}</b> · έλεγχος: ${a} − ${b} = ${a - b} ✓`;
      out.innerHTML = msg + `<div class="muted small" style="margin-top:4px">Χ = ${a}, Y = ${b} στο δεκαδικό.</div>`;
    }
    $(".st", box).onclick = () => { c++; draw(); }; $(".all", box).onclick = () => { c = 8; draw(); }; $(".rs", box).onclick = () => { c = 0; draw(); };
    $(".rnd", box).onclick = () => { let a = ri(1, 255), b = ri(1, 255); if ($(".op", box).value === "-" && a < b) [a, b] = [b, a]; $(".a", box).value = ia1Bin(a, 8); $(".b", box).value = ia1Bin(b, 8); c = 0; draw(); };
    ia1Bind(box, "input,select", "input", () => { c = 0; draw(); }); $(".op", box).onchange = () => { c = 0; draw(); }; draw();
  },

  /* ---------- 1.5 Συμπληρώματα & αφαίρεση με συμπλήρωμα ---------- */
  ia1comp(box) {
    ia1Style();
    box.innerHTML = `<p class="small"><b>1. Συμπληρώματα του Υ</b> — πάτησε bits για να αλλάξεις τον αριθμό.</p>
      <div class="ia1kv"><span>Υ</span><div class="ia1row y" style="justify-content:flex-start"></div><span>ως προς 1</span><div class="ia1row c1" style="justify-content:flex-start"></div><span>ως προς 2</span><div class="ia1row c2" style="justify-content:flex-start"></div></div>
      <p class="muted small leg"></p>
      <hr style="border:0;border-top:1px solid var(--line);margin:12px 0">
      <div class="wctl"><b class="small">2. Αφαίρεση</b><label>Χ = <input class="ia1in x" value="01010100" maxlength="8" spellcheck="false"></label><label>μέθοδος <select class="m"><option value="2">συμπλήρωμα ως προς 2</option><option value="1">συμπλήρωμα ως προς 1</option></select></label><label><select class="d"><option value="xy">Χ − Υ</option><option value="yx">Υ − Χ</option></select></label></div>
      <div class="wout sub"></div>`;
    let Y = "01000011".split("").map(Number);
    function bitsRow(el, s, cls) { el.innerHTML = ""; [...s].forEach((b, i) => el.appendChild(h("span", { class: "ia1bit " + (cls ? cls(i) : (b === "1" ? "on" : "")), style: "cursor:default;min-width:28px" }, `<b>${b}</b>`))); }
    function draw() {
      const yr = $(".y", box);
      if (!yr.children.length) Y.forEach((_, i) => { const el = h("button", { class: "ia1bit", style: "min-width:28px" }, `<b></b>`); el.onclick = () => { Y[i] ^= 1; draw(); }; yr.appendChild(el); });
      Y.forEach((b, i) => { const el = yr.children[i]; el.classList.toggle("on", !!b); $("b", el).textContent = b; });
      const ys = Y.join(""), c1 = ia1Flip(ys), c2 = ia1Two(ys), last = ys.lastIndexOf("1");
      bitsRow($(".c1", box), c1, () => "flip");
      bitsRow($(".c2", box), c2, i => last < 0 || i >= last ? "keep" : "flip");
      $(".leg", box).innerHTML = `<span style="color:var(--purple);font-weight:700">μωβ</span> = αντιστράφηκε · <span style="color:var(--green);font-weight:700">πράσινο</span> = έμεινε ίδιο (τα μηδενικά από δεξιά και ο πρώτος άσσος). Y = ${parseInt(ys, 2)}, συμπλ. ως προς 2 = 2⁸ − Υ = ${parseInt(c2, 2)}.`;
      const xv = $(".x", box).value.replace(/\s/g, ""), out = $(".sub", box);
      if (!/^[01]{1,8}$/.test(xv)) { out.innerHTML = `<span class="warnc">Ο Χ πρέπει να είναι δυαδικός έως 8 bits.</span>`; return; }
      const X = ia1Bin(parseInt(xv, 2), 8), m = $(".m", box).value, dir = $(".d", box).value;
      const [P, Q] = dir === "xy" ? [X, ys] : [ys, X], [pn, qn] = dir === "xy" ? ["Χ", "Υ"] : ["Υ", "Χ"];
      const comp = m === "2" ? ia1Two(Q) : ia1Flip(Q), sum = parseInt(P, 2) + parseInt(comp, 2), carry = sum > 255, low = ia1Bin(sum & 255, 8);
      let html = `<ol class="ia1steps"><li>Συμπλήρωμα ως προς ${m} του αφαιρετέου ${qn} = ${Q}: <b>${comp}</b></li><li>${pn} + συμπλήρωμα: ${ia1Col([P, "+ " + comp, "=", carry ? "1 " + low : low])}</li>`;
      const pv = parseInt(P, 2), qv = parseInt(Q, 2);
      if (carry) {
        html += `<li>Υπάρχει υπερχείλιση (9ο bit) → την <b>αγνοούμε</b>: ${low}</li>`;
        if (m === "1") { const f = ia1Bin((parseInt(low, 2) + 1) & 255, 8); html += `<li>Προσθέτουμε <b>1</b>: ${low} + 1 = <b>${f}</b></li></ol><p>${pn} − ${qn} = <b>${f}</b> = ${pv - qv} ✓</p>`; }
        else html += `</ol><p>${pn} − ${qn} = <b>${low}</b> = ${pv - qv} ✓</p>`;
      } else {
        const mag = m === "2" ? ia1Two(low) : ia1Flip(low);
        html += `<li>Δεν υπάρχει υπερχείλιση → το αποτέλεσμα είναι <b>αρνητικό</b>: βάζουμε πρόσημο − και παίρνουμε το συμπλήρωμα ως προς ${m} του ${low}: <b>−${mag}</b></li></ol><p>${pn} − ${qn} = <b>−${mag}</b> = ${pv - qv} ✓</p>`;
      }
      out.innerHTML = html;
    }
    ia1Bind(box, "input", "input", draw); ia1Bind(box, "select", "change", draw); draw();
  },

  /* ---------- 1.6 Αριθμοί με πρόσημο: τρεις παραστάσεις ---------- */
  ia1sign(box) {
    ia1Style();
    box.innerHTML = `<div class="wctl"><label>bits n = <select class="n"><option>4</option><option selected>8</option></select></label><label>τιμή <input type="range" class="v" min="-128" max="127" value="-3" style="width:180px;max-width:100%"></label><b class="vv"></b></div>
      <p class="small"><b>Από τιμή σε αναπαράσταση</b></p><div class="ia1tw t1"></div>
      <p class="small" style="margin-top:12px"><b>Από bits σε τιμή</b> — πάτησε bits (το <span style="color:var(--red);font-weight:700">κόκκινο</span> είναι το bit προσήμου):</p>
      <div class="ia1row bits" style="justify-content:flex-start"></div><div class="ia1tw t2"></div>`;
    let B = [1, 1, 1, 0, 1, 1, 1, 0];
    function rep(v, n) {
      const M = 2 ** (n - 1), r = {};
      r.sm = Math.abs(v) <= M - 1 ? (v < 0 ? "1" : "0") + ia1Bin(Math.abs(v), n - 1) : "—";
      r.c1 = Math.abs(v) <= M - 1 ? (v < 0 ? ia1Flip(ia1Bin(-v, n)) : ia1Bin(v, n)) : "—";
      r.c2 = v >= -M && v <= M - 1 ? ia1Bin(v < 0 ? 2 ** n + v : v, n) : "—";
      return r;
    }
    function draw() {
      const n = +$(".n", box).value, M = 2 ** (n - 1), sl = $(".v", box); sl.min = -M; sl.max = M - 1; if (+sl.value < -M) sl.value = -M; if (+sl.value > M - 1) sl.value = M - 1;
      const v = +sl.value, r = rep(v, n); $(".vv", box).textContent = (v > 0 ? "+" : "") + v;
      $(".t1", box).innerHTML = ia1Tbl(["Παράσταση", `${v}`, "Εύρος με " + n + " bits"], [["προσημασμένο μέτρο", `<code>${r.sm}</code>`, `−${M - 1} … +${M - 1}`], ["συμπλ. ως προς 1", `<code>${r.c1}</code>`, `−${M - 1} … +${M - 1}`], ["συμπλ. ως προς 2", `<code>${r.c2}</code>`, `−${M} … +${M - 1}`]])
        + `<p class="muted small">${v >= 0 ? "Θετικός: ίδιος σε όλες τις παραστάσεις, πρώτο bit 0." : v === -M ? `Το −${M} υπάρχει μόνο στο συμπλήρωμα ως προς 2.` : `Αρνητικός: μέτρο ${-v} = ${ia1Bin(-v, n)} → πρόσημο-μέτρο: αλλάζει μόνο το 1ο bit · ως προς 1: αντιστροφή · ως προς 2: αντιστροφή + 1.`}</p>`;
      if (B.length !== n) B = n === 8 ? [1, 1, 1, 0, 1, 1, 1, 0] : [1, 1, 0, 1];
      const br = $(".bits", box);
      if (br.children.length !== n) { br.innerHTML = ""; B.forEach((_, i) => { const el = h("button", { class: "ia1bit" + (i === 0 ? " sg" : ""), style: "min-width:30px" }, `<b></b>`); el.onclick = () => { B[i] ^= 1; draw(); }; br.appendChild(el); }); }
      B.forEach((b, i) => { const el = br.children[i]; el.classList.toggle("on", !!b); $("b", el).textContent = b; });
      const s = B.join(""), u = parseInt(s, 2), neg = B[0] === 1, mag = parseInt(s.slice(1), 2);
      const sm = neg ? (mag ? "−" + mag : "−0") : "+" + mag, c1 = neg ? (parseInt(ia1Flip(s), 2) ? "−" + parseInt(ia1Flip(s), 2) : "−0") : "+" + u, c2 = neg ? "−" + (2 ** n - u) : "+" + u;
      $(".t2", box).innerHTML = ia1Tbl(["Το " + s + " ως…", "Τιμή", "Πώς"], [["χωρίς πρόσημο", u, "άθροισμα βαρών"], ["προσημασμένο μέτρο", sm, neg ? `πρόσημο −, μέτρο ${s.slice(1)} = ${mag}` : "πρόσημο +"], ["συμπλ. ως προς 1", c1, neg ? `αντιστροφή → ${ia1Flip(s)}` : "θετικός"], ["συμπλ. ως προς 2", c2, neg ? `συμπλ. ως προς 2 → ${ia1Two(s)}` : "θετικός"]]);
    }
    ia1Bind(box, "input", "input", draw); $(".n", box).onchange = draw; draw();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  ia1b2d: { title: "Γεννήτρια — δυαδικός σε δεκαδικό", make() {
    const fr = ri(0, 2) === 0, ip = ri(fr ? 1 : 5, fr ? 127 : 255), k = ri(1, 3), fp = fr ? ri(1, 2 ** k - 1) | 1 : 0;
    const bin = (fr ? ia1Bin(ip) : ia1Bin(ip, 8)) + (fr ? "." + ia1Bin(fp, k) : ""), v = ia1Val(bin), t = ia1Terms(bin);
    return { q: R`Να μετατρέψετε τον δυαδικό αριθμό $(${bin})_2$ στο δεκαδικό σύστημα.`, fields: [{ label: "τιμή =", ans: v, tol: 1e-9 }],
      hint: R`Πολλαπλασίασε κάθε 1 με το βάρος της θέσης του (δύναμη του 2) και πρόσθεσε.`,
      sol: R`Θέσεις με 1: ${ia1Expand(bin)} $= ${t.map(ia1Fmt).join(" + ")} = ${ia1Fmt(v)}$. Άρα $(${bin})_2 = (${ia1Fmt(v)})_{10}$.` };
  } },
  ia1d2b: { title: "Γεννήτρια — δεκαδικός σε δυαδικό", make() {
    const n = ri(5, 255), b = ia1Bin(n), eight = ri(0, 2) === 0;
    return { q: R`Να μετατρέψετε τον δεκαδικό αριθμό $${n}$ σε δυαδικό${eight ? " <b>8 bits</b> (με τα αρχικά μηδενικά)" : ""}.`,
      fields: [{ label: eight ? "8 bits:" : `(${n})₁₀ =`, ans: eight ? ia1Bin(n, 8) : ia1A(b), text: true, nospace: true }],
      hint: R`Διαδοχικές διαιρέσεις με το 2· τα υπόλοιπα από κάτω προς τα πάνω.`,
      sol: R`${ia1DivTbl(n)} Υπόλοιπα από κάτω προς τα πάνω: $(${n})_{10} = (${b})_2$${eight && b.length < 8 ? `, σε 8 bits $${ia1Bin(n, 8)}$` : ""}. Επαλήθευση: ${ia1Expand(b)} $= ${n}$.` };
  } },
  ia1fr: { title: "Γεννήτρια — δεκαδικός με υποδιαστολή σε δυαδικό", make() {
    const ip = ri(0, 30);
    if (ri(0, 1)) {
      const k = ri(2, 4), m = ri(1, 2 ** k - 1) | 1, f = m / 2 ** k, fs = String(f).slice(1), x = ip + fs, fb = ia1Bin(m, k);
      const ans = ia1Bin(ip) + "." + fb;
      return { q: R`Να μετατρέψετε τον δεκαδικό αριθμό $${x}$ σε δυαδικό.`, fields: [{ label: `(${x})₁₀ =`, ans: ia1A(ans, ip === 0), text: true, nospace: true }],
        hint: R`Ακέραιο μέρος με διαιρέσεις, κλασματικό με πολλαπλασιασμούς επί 2 μέχρι να μηδενιστεί.`,
        sol: R`Ακέραιο: $${ip} = (${ia1Bin(ip)})_2$. ${ia1MulTbl("0" + fs, 12)} Το κλασματικό μέρος μηδενίστηκε (ακριβής μετατροπή). Άρα $(${x})_{10} = (${ans})_2$.` };
    }
    let fs, k, rows; do {
    fs = bkPick(["0.1", "0.2", "0.3", "0.4", "0.6", "0.7", "0.8", "0.9", "0.15", "0.35", "0.45", "0.55", "0.65", "0.85", "0.95", "0.05", "0.25", "0.75"]); k = ri(4, 7); rows = ia1MulRows(fs, k);
    } while (!rows.some(r => r[2]));
    const fb = rows.map(r => r[2]).join("").padEnd(k, "0"), x = ip + fs.slice(1), ans = ia1Bin(ip) + "." + fb;
    return { q: R`Να μετατρέψετε τον δεκαδικό αριθμό $${x}$ σε δυαδικό, με <b>${k}</b> δυαδικά ψηφία στο κλασματικό μέρος (χωρίς στρογγυλοποίηση).`,
      fields: [{ label: `(${x})₁₀ ≈`, ans: [...ia1A(ans, ip === 0), ...(rows.length < k ? ia1A(ans.replace(/0+$/, ""), ip === 0) : [])], text: true, nospace: true }],
      hint: R`Κάνε ακριβώς ${k} πολλαπλασιασμούς του κλασματικού μέρους επί 2 (ή λιγότερους αν μηδενιστεί).`,
      sol: R`Ακέραιο: $${ip} = (${ia1Bin(ip)})_2$. ${ia1MulTbl(fs, k)} ${rows.length < k ? "Το κλασματικό μέρος μηδενίστηκε, τα υπόλοιπα ψηφία είναι 0. " : ""}Άρα $(${x})_{10} ${rows.length < k ? "=" : "\\approx"} (${ans})_2$.` };
  } },
  ia1ar: { title: "Γεννήτρια — πρόσθεση και αφαίρεση δυαδικών", make() {
    const add = ri(0, 2) > 0;
    if (add) {
      const ov = ri(0, 3) === 0; let a, b;
      do { a = ri(10, 245); b = ri(5, 240); } while (ov ? a + b <= 255 : a + b > 255);
      const A = ia1Bin(a, 8), B = ia1Bin(b, 8), s = a + b, S = ia1Bin(s & 255, 8);
      return { q: R`Να υπολογίσετε στο δυαδικό (8 bits) το άθροισμα $${A} + ${B}$ και να γράψετε αν προκύπτει υπερχείλιση (γράψτε 1 για ναι, 0 για όχι).`,
        fields: [{ label: "8 bits αποτελέσματος:", ans: S, text: true, nospace: true }, { label: "υπερχείλιση (1/0):", ans: s > 255 ? 1 : 0 }],
        hint: R`Στήλη-στήλη από δεξιά: $1 + 1 = 0$ με κρατούμενο 1.`,
        sol: R`${ia1Col([A, "+ " + B, "=", s > 255 ? "1 " + S : S])} $${a} + ${b} = ${s}$${s > 255 ? ` $> 255$: το 9ο bit δεν χωρά → <b>υπερχείλιση</b>, τα 8 bits είναι $${S}$` : ` $\\le 255$ → χωρίς υπερχείλιση`}.` };
    }
    let a = ri(20, 255), b = ri(1, 200); if (a < b) [a, b] = [b, a]; if (a === b) a = Math.min(255, a + ri(1, 9));
    const A = ia1Bin(a, 8), B = ia1Bin(b, 8), D = ia1Bin(a - b, 8);
    return { q: R`Να υπολογίσετε στο δυαδικό τη διαφορά $${A} - ${B}$ (8 bits).`, fields: [{ label: "διαφορά:", ans: ia1A(D), text: true, nospace: true }],
      hint: R`$0 - 1$: δανειζόμαστε από την επόμενη στήλη ($10 - 1 = 1$).`, sol: R`${ia1Col([A, "− " + B, "=", D])} Έλεγχος: $${a} - ${b} = ${a - b}$.` };
  } },
  ia1cp: { title: "Γεννήτρια — συμπληρώματα ως προς 1 και 2", make() {
    if (ri(0, 1)) {
      const n = ri(1, 254), N = ia1Bin(n, 8), c1 = ia1Flip(N), c2 = ia1Two(N), l = N.lastIndexOf("1");
      return { q: R`Να υπολογίσετε τα συμπληρώματα ως προς 1 και ως προς 2 του δυαδικού αριθμού $${N}$.`,
        fields: [{ label: "ως προς 1:", ans: c1, text: true, nospace: true }, { label: "ως προς 2:", ans: c2, text: true, nospace: true }],
        hint: R`Ως προς 1: αντιστροφή όλων των ψηφίων. Ως προς 2: από δεξιά κράτα τα μηδενικά και τον πρώτο άσσο, αντίστρεψε τα υπόλοιπα.`,
        sol: R`Ως προς 1: $${c1}$. Ως προς 2: μένει ίδιο το «${N.slice(l)}», αντιστρέφεται το «${N.slice(0, l)}» → $${c2}$ (= ως προς 1 + 1 · και $2^8 - ${n} = ${parseInt(c2, 2)}$).` };
    }
    let x = ri(30, 200), y = ri(5, 150); if (x <= y) [x, y] = [y + 1, x]; const X = ia1Bin(x, 8), Y = ia1Bin(y, 8), c = ia1Two(Y), D = ia1Bin(x - y, 8);
    return { q: R`Να υπολογίσετε τη διαφορά $X - Y$ με τη μέθοδο του συμπληρώματος ως προς 2, όπου $X = ${X}$ και $Y = ${Y}$. Γράψτε το συμπλήρωμα του $Y$ και το αποτέλεσμα (8 bits).`,
      fields: [{ label: "συμπλ. Υ:", ans: c, text: true, nospace: true }, { label: "Χ − Υ =", ans: D, text: true, nospace: true }],
      hint: R`Πρόσθεσε το Χ με το συμπλήρωμα ως προς 2 του Υ και αγνόησε την υπερχείλιση.`,
      sol: R`Συμπλήρωμα ως προς 2 του $Y$: $${c}$. ${ia1Col([X, "+ " + c, "=", ia1Add8(X, c)])} Αγνοούμε την υπερχείλιση: $${D}$ $= ${x - y} = ${x} - ${y}$ ✓.` };
  } },
  ia1sg: { title: "Γεννήτρια — αριθμοί με πρόσημο", make() {
    if (ri(0, 1)) {
      const v = -ri(1, 127), m = ia1Bin(-v, 8), sm = "1" + ia1Bin(-v, 7), c1 = ia1Flip(m), c2 = ia1Two(m);
      return { q: R`Να γράψετε τον αριθμό $${v}$ σε 8 bits σε παράσταση προσημασμένου μέτρου, συμπληρώματος ως προς 1 και συμπληρώματος ως προς 2.`,
        fields: [{ label: "προσημ. μέτρο:", ans: sm, text: true, nospace: true }, { label: "ως προς 1:", ans: c1, text: true, nospace: true }, { label: "ως προς 2:", ans: c2, text: true, nospace: true }],
        hint: R`Ξεκίνα από $+${-v} = ${m}$.`, sol: R`$+${-v} = ${m}$. Προσημασμένο μέτρο: πρώτο bit 1 → $${sm}$. Ως προς 1: αντιστροφή → $${c1}$. Ως προς 2: $+1$ → $${c2}$.` };
    }
    const u = ri(129, 254), s = ia1Bin(u, 8), t = ri(0, 2), names = ["προσημασμένου μέτρου", "συμπληρώματος ως προς 1", "συμπληρώματος ως προς 2"];
    const val = t === 0 ? -(u - 128) : t === 1 ? -(255 - u) : u - 256;
    const how = t === 0 ? `πρόσημο 1 (−), μέτρο $${s.slice(1)} = ${u - 128}$` : t === 1 ? `πρώτο bit 1 → αρνητικός· αντιστροφή → $${ia1Flip(s)} = ${255 - u}$` : `πρώτο bit 1 → αρνητικός· συμπλήρωμα ως προς 2 → $${ia1Two(s)} = ${256 - u}$`;
    return { q: R`Ποια δεκαδική τιμή παριστάνει ο δυαδικός $${s}$ (8 bits) στην παράσταση <b>${names[t]}</b>;`, fields: [{ label: "τιμή =", ans: val }],
      hint: R`Το πρώτο bit είναι 1, άρα ο αριθμός είναι αρνητικός.`, sol: R`${how}. Άρα η τιμή είναι $${val}$.` };
  } }
});

/* Πληροφορική Γ΄ — Γ2.1 Στοιχεία Αρχιτεκτονικής: widgets & γεννήτριες (βιβλιοθήκη: figsIAb.js) */
const ia2Pick = a => a[Math.floor(Math.random() * a.length)];
const ia2Shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ia2TeXs = s => "$" + ia2Tex(s) + "$";
const ia2Tx = el => { try { if (window.renderMathInElement) renderMathInElement(el, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }], throwOnError: false }); } catch (e) {} };
const ia2Env = (vars, m) => { const e = {}; vars.forEach((v, k) => e[v] = (m >> (vars.length - 1 - k)) & 1); return e; };
const ia2EnvM = (vars, env) => vars.reduce((m, v) => 2 * m + (env[v] ? 1 : 0), 0);
const ia2Q = (box, s) => box.querySelector(s);
/* επιλογές mc: σωστή + λάθος (μη ισοδύναμες, διαφορετικές) από δεξαμενή */
function ia2Opts(right, pool, vars, k = 3) {
  const rb = ia2Bits(right, vars), seen = new Set([rb]), out = [];
  for (const p of ia2Shuf(pool)) { let b; try { b = ia2Bits(p, vars); } catch (e) { continue; } if (seen.has(b)) continue; seen.add(b); out.push(p); if (out.length === k) break; }
  return out;
}

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 2.1 Υπολογισμός λογικής έκφρασης & δυϊκή ---------- */
  ia2expr(box) {
    const pres = ["a + b*c", "(a + b)*(a + c)", "(a + b)*c", "a*b + c'", "(a + a)*(b' + 1)", "x'y + xz'"];
    box.innerHTML = `<div class="wctl"><label>F = <input type="text" class="ex" value="a + b*c" style="width:200px" spellcheck="false" autocapitalize="off"></label>
      <label>έτοιμες: <select class="pr">${pres.map(p => `<option>${p}</option>`).join("")}</select></label></div>
      <div class="vt wctl"></div><div class="wout res"></div><div class="ia2row"><div class="ia2scroll tt"></div></div>
      <p class="muted small">Γράψε την έκφραση με <code>'</code> για NOT, <code>*</code> ή παράθεση για AND, <code>+</code> για OR. Πάτησε στις μεταβλητές για να αλλάξεις τιμή ή σε μια γραμμή του πίνακα.</p>`;
    let env = {};
    function draw() {
      const src = ia2Q(box, ".ex").value; let a;
      try { a = ia2Parse(src); } catch (e) { ia2Q(box, ".res").innerHTML = `<span class="ia2err">⚠ ${e.message}</span>`; ia2Q(box, ".tt").innerHTML = ""; return; }
      const vars = ia2Vars(a).slice(0, 5); vars.forEach(v => { if (!(v in env)) env[v] = 0; });
      const d = ia2Dual(a), F = ia2Eval(a, env), Fd = d ? ia2Eval(d, env) : null;
      const vt = ia2Q(box, ".vt");
      if (vt.dataset.k !== vars.join("")) { vt.dataset.k = vars.join(""); vt.innerHTML = vars.map(v => `<button class="ia2bit" data-v="${v}" title="${v}" style="width:auto;padding:0 8px"></button>`).join(" ");
        vt.querySelectorAll("button").forEach(b => b.onclick = () => { env[b.dataset.v] ^= 1; draw(); }); }
      vt.querySelectorAll("button").forEach(b => { b.textContent = b.dataset.v + "=" + env[b.dataset.v]; b.classList.toggle("on", !!env[b.dataset.v]); });
      ia2Q(box, ".res").innerHTML = `$F = ${ia2Tex(a)}$ → αντικατάσταση: $${ia2SubTex(a, env)}$ → <b class="${F ? "ia2ok" : ""}">F = ${F}</b><br>` +
        (d ? `Δυϊκή: $F_d = ${ia2Tex(d)}$ → $${ia2SubTex(d, env)}$ → <b>F<sub>d</sub> = ${Fd}</b>` : `<span class="muted">(η δυϊκή ορίζεται για εκφράσεις με +, *, ')</span>`) +
        `<br><span class="muted small">Προτεραιότητα: παρενθέσεις → αντιστροφή (') → γινόμενο (*) → άθροισμα (+).</span>`;
      const cols = [["F", ia2TT(a, vars)]]; if (d) cols.push(["F_d", ia2TT(d, vars)]);
      ia2Q(box, ".tt").innerHTML = ia2TTable(vars, cols, { hl: ia2EnvM(vars, env) }).replace(/F_d/, "F<sub>d</sub>");
      ia2Q(box, ".tt").querySelectorAll("tr").forEach((tr, i) => { if (i) { tr.style.cursor = "pointer"; tr.onclick = () => { env = ia2Env(vars, i - 1); draw(); }; } });
      ia2Tx(ia2Q(box, ".res"));
    }
    ia2Q(box, ".ex").oninput = draw;
    ia2Q(box, ".pr").onchange = () => { ia2Q(box, ".ex").value = ia2Q(box, ".pr").value; env = {}; draw(); };
    draw();
  },

  /* ---------- 2.2 Έλεγχος ισοδυναμίας (θεωρήματα) με πίνακα αλήθειας ---------- */
  ia2equiv(box) {
    const P = [["Θ3 απορρόφηση", "a + a*b", "a"], ["Θ6 De Morgan", "(a + b)'", "a'*b'"], ["Θ6 De Morgan (2)", "(a*b)'", "a' + b'"], ["Θ7", "a + a'*b", "a + b"],
      ["A3 επιμεριστική", "a + b*c", "(a + b)*(a + c)"], ["Συχνό λάθος", "(a*b)'", "a'*b'"], ["Παράδειγμα 2.2(γ)", "ab + a'c", "ab + a'c + bc"], ["Παράδειγμα 2.2(δ)", "(xy + wxyz' + x'y)'", "y'"]];
    box.innerHTML = `<div class="wctl"><label>έτοιμα: <select class="pr">${P.map((p, i) => `<option value="${i}">${p[0]}</option>`).join("")}</select></label></div>
      <div class="wctl"><label>Αριστερό μέλος <input class="e1" style="width:180px" spellcheck="false" autocapitalize="off"></label><label>Δεξί μέλος <input class="e2" style="width:180px" spellcheck="false" autocapitalize="off"></label></div>
      <div class="wout res"></div><div class="ia2scroll tt"></div>`;
    const set = i => { ia2Q(box, ".e1").value = P[i][1]; ia2Q(box, ".e2").value = P[i][2]; draw(); };
    function draw() {
      let a, b; try { a = ia2Parse(ia2Q(box, ".e1").value); b = ia2Parse(ia2Q(box, ".e2").value); } catch (e) { ia2Q(box, ".res").innerHTML = `<span class="ia2err">⚠ ${e.message}</span>`; ia2Q(box, ".tt").innerHTML = ""; return; }
      const vars = [...new Set([...ia2Vars(a), ...ia2Vars(b)])].sort().slice(0, 5), A = ia2TT(a, vars), B = ia2TT(b, vars), bad = A.map((x, m) => x !== B[m] ? m : -1).filter(m => m >= 0);
      ia2Q(box, ".res").innerHTML = `$${ia2Tex(a)}$ ${bad.length ? "≠" : "="} $${ia2Tex(b)}$ &nbsp; ` + (bad.length ? `<span class="ia2err">✗ Δεν είναι ισοδύναμες: διαφέρουν σε ${bad.length} από τις ${A.length} γραμμές (κόκκινες).</span>` : `<span class="ia2ok">✓ Ισοδύναμες: ίδια τιμή σε όλες τις ${A.length} γραμμές — η σχέση ισχύει.</span>`);
      ia2Q(box, ".tt").innerHTML = ia2TTable(vars, [["Αριστερό", A], ["Δεξί", B]]);
      ia2Q(box, ".tt").querySelectorAll("tr").forEach((tr, i) => { if (i && bad.includes(i - 1)) tr.querySelectorAll("td").forEach(td => td.style.background = "#fde8ea"); });
      ia2Tx(ia2Q(box, ".res"));
    }
    ia2Q(box, ".pr").onchange = () => set(+ia2Q(box, ".pr").value);
    ia2Q(box, ".e1").oninput = ia2Q(box, ".e2").oninput = draw;
    set(0);
  },

  /* ---------- 2.3 Προσομοιωτής λογικών πυλών ---------- */
  ia2gates(box) {
    const G = { AND: n => n.join(""), OR: n => n.join(" + "), NOT: n => n[0] + "'", NAND: n => "(" + n.join("") + ")'", NOR: n => "(" + n.join(" + ") + ")'", XOR: n => n.join(" ⊕ "), XNOR: n => "(" + n.join(" ⊕ ") + ")'" };
    const D = { AND: "1 μόνο όταν <b>όλες</b> οι είσοδοι είναι 1", OR: "1 όταν <b>τουλάχιστον μία</b> είσοδος είναι 1", NOT: "αντιστρέφει την είσοδο", NAND: "0 μόνο όταν όλες οι είσοδοι είναι 1 (αντίθετη της AND)", NOR: "1 μόνο όταν όλες οι είσοδοι είναι 0 (αντίθετη της OR)", XOR: "1 όταν το πλήθος των 1 είναι <b>περιττό</b> (για 2 εισόδους: όταν διαφέρουν)", XNOR: "αντίθετη της XOR (για 2 εισόδους: 1 όταν είναι ίσες)" };
    box.innerHTML = `<div class="wctl gs">${Object.keys(G).map(g => `<button class="btn ghost" data-g="${g}">${g}</button>`).join("")}</div>
      <div class="wctl"><label>είσοδοι: <select class="n"><option>2</option><option>3</option></select></label><span class="muted small">👆 Πάτησε στις εισόδους A, B, C του κυκλώματος για να αλλάξεις τιμή.</span></div>
      <div class="ia2row"><div class="cir" style="flex:1 1 260px"></div><div class="ia2scroll tt"></div></div><div class="wout res"></div>`;
    let g = "AND", env = { A: 1, B: 0, C: 0 };
    function draw() {
      const n = g === "NOT" ? 1 : +ia2Q(box, ".n").value, vars = ["A", "B", "C"].slice(0, n), ex = G[g](vars);
      ia2Q(box, ".n").disabled = g === "NOT";
      box.querySelectorAll(".gs button").forEach(b => b.classList.toggle("primary", b.dataset.g === g));
      const vals = {}; vars.forEach(v => vals[v] = env[v]);
      ia2Q(box, ".cir").innerHTML = ia2Circuit(ex, { vals, click: true, out: "Y", scale: 1.25 });
      ia2Q(box, ".cir").querySelectorAll(".ia2in").forEach(el => el.onclick = () => { env[el.dataset.var] ^= 1; draw(); });
      const tt = ia2TT(ex, vars), m = ia2EnvM(vars, env);
      ia2Q(box, ".tt").innerHTML = ia2TTable(vars, [["Y", tt]], { hl: m });
      ia2Q(box, ".tt").querySelectorAll("tr").forEach((tr, i) => { if (i) { tr.style.cursor = "pointer"; tr.onclick = () => { Object.assign(env, ia2Env(vars, i - 1)); draw(); }; } });
      ia2Q(box, ".res").innerHTML = `Πύλη <b>${g}</b>: $Y = ${ia2Tex(ex)}$ — δίνει ${D[g]}. Τώρα: <b class="${tt[m] ? "ia2ok" : ""}">Y = ${tt[m]}</b> · στήλη Y (από 0…0 έως 1…1): <code>${tt.join("")}</code>`;
      ia2Tx(ia2Q(box, ".res"));
    }
    box.querySelectorAll(".gs button").forEach(b => b.onclick = () => { g = b.dataset.g; draw(); });
    ia2Q(box, ".n").onchange = draw; draw();
  },

  /* ---------- 2.4 Από τη συνάρτηση στο κύκλωμα ---------- */
  ia2circ(box) {
    const pres = ["A + B'C", "(A ⊕ B) + C", "AB'+A'B+C", "AB + AC + BC", "ABC + ABC'", "(AB)' + (B ⊕ C)", "(A + B)'C + A'B"];
    box.innerHTML = `<div class="wctl"><label>F = <input class="ex" value="A + B'C" style="width:190px" spellcheck="false" autocapitalize="off"></label><label>έτοιμες: <select class="pr">${pres.map(p => `<option>${p}</option>`).join("")}</select></label>
      <label><input type="checkbox" class="cp" checked> NAND/NOR/XNOR όπου γίνεται</label></div>
      <div class="cir ia2scroll"></div><div class="wout res"></div><div class="ia2scroll tt"></div>
      <p class="muted small">👆 Πάτησε στις εισόδους (πάνω αριστερά) για να δεις τη διαδρομή του σήματος: τα πράσινα καλώδια έχουν τιμή 1.</p>`;
    let env = {};
    function draw() {
      let a; try { a = ia2Parse(ia2Q(box, ".ex").value); } catch (e) { ia2Q(box, ".res").innerHTML = `<span class="ia2err">⚠ ${e.message}</span>`; ia2Q(box, ".cir").innerHTML = ""; ia2Q(box, ".tt").innerHTML = ""; return; }
      const vars = ia2Vars(a).slice(0, 4); if (ia2Vars(a).length > 4) { ia2Q(box, ".res").innerHTML = `<span class="ia2err">Έως 4 μεταβλητές.</span>`; return; }
      vars.forEach(v => { if (!(v in env)) env[v] = 0; });
      const vals = {}; vars.forEach(v => vals[v] = env[v]);
      if (!vars.length) { ia2Q(box, ".res").innerHTML = "Η έκφραση είναι σταθερά."; return; }
      ia2Q(box, ".cir").innerHTML = ia2Circuit(a, { vals, click: true, compact: ia2Q(box, ".cp").checked, scale: 1.3 });
      ia2Q(box, ".cir").querySelectorAll(".ia2in").forEach(el => el.onclick = () => { env[el.dataset.var] ^= 1; draw(); });
      let gates = 0, kinds = {}; const cp = ia2Q(box, ".cp").checked;
      (function cnt(n) { if (n.t === "v" || n.t === "c") return; let k = n.t === "not" ? (cp && ["and", "or", "xor"].includes(n.a.t) ? { and: "NAND", or: "NOR", xor: "XNOR" }[n.a.t] : "NOT") : n.t.toUpperCase();
        if (k === "NAND" || k === "NOR" || k === "XNOR") { kinds[k] = (kinds[k] || 0) + 1; gates++; n.a.xs.forEach(cnt); return; } kinds[k] = (kinds[k] || 0) + 1; gates++; if (n.a) cnt(n.a); else n.xs.forEach(cnt); })(a);
      const tt = ia2TT(a, vars), m = ia2EnvM(vars, env);
      ia2Q(box, ".res").innerHTML = `$F = ${ia2Tex(a)}$ · είσοδοι: <b>${vars.length}</b> → πίνακας αλήθειας με $2^${vars.length} = ${1 << vars.length}$ γραμμές · πύλες: <b>${gates}</b> (${Object.entries(kinds).map(([k, v]) => v + "×" + k).join(", ")})<br>
        Για ${vars.map(v => v + "=" + env[v]).join(", ")}: <b class="${tt[m] ? "ia2ok" : ""}">F = ${tt[m]}</b> · $F = \\Sigma(${ia2Sigma(a, vars).join(",") || "\\,"})$`;
      ia2Q(box, ".tt").innerHTML = ia2TTable(vars, [["F", tt]], { hl: m, m: true });
      ia2Q(box, ".tt").querySelectorAll("tr").forEach((tr, i) => { if (i) { tr.style.cursor = "pointer"; tr.onclick = () => { Object.assign(env, ia2Env(vars, i - 1)); draw(); }; } });
      ia2Tx(ia2Q(box, ".res"));
    }
    ia2Q(box, ".ex").oninput = draw; ia2Q(box, ".cp").onchange = draw;
    ia2Q(box, ".pr").onchange = () => { ia2Q(box, ".ex").value = ia2Q(box, ".pr").value; env = {}; draw(); };
    draw();
  },

  /* ---------- 2.5 Ελαχιστόροι / μεγιστόροι από τον πίνακα αλήθειας ---------- */
  ia2mint(box) {
    box.innerHTML = `<div class="wctl"><label>μεταβλητές: <select class="nv"><option value="2">A, B</option><option value="3" selected>A, B, C</option><option value="4">A, B, C, D</option></select></label>
      <button class="btn ghost rnd">🎲 τυχαία</button><button class="btn ghost clr">↺ καθάρισμα</button></div>
      <div class="ia2row"><div class="ia2scroll tt"></div><div class="km" style="flex:1 1 220px"></div></div><div class="wout res"></div>
      <p class="muted small">👆 Πάτησε στα κελιά της στήλης F για να αλλάξεις 0 ↔ 1.</p>`;
    let nv = 3, F = [0, 1, 0, 0, 1, 1, 1, 1];
    function draw() {
      const vars = "ABCD".slice(0, nv).split(""), on = F.map((b, m) => b ? m : -1).filter(m => m >= 0), off = F.map((b, m) => b ? -1 : m).filter(m => m >= 0);
      let h = `<table class="tbl ia2tt"><tr>${vars.map(v => `<th>${v}</th>`).join("")}<th class="ia2o">F</th><th>ελαχιστόρος</th><th>μεγιστόρος</th></tr>`;
      for (let m = 0; m < 1 << nv; m++) {
        const e = ia2Env(vars, m), mt = vars.map(v => v + (e[v] ? "" : "'")).join(""), Mt = vars.map(v => v + (e[v] ? "'" : "")).join("+");
        h += `<tr${F[m] ? ' class="ia2hl"' : ""}>${vars.map(v => `<td>${e[v]}</td>`).join("")}<td class="ia2o ia2click${F[m] ? " ia2one" : ""}" data-m="${m}">${F[m]}</td><td>${mt} <span class="muted">m${m}</span></td><td>${Mt} <span class="muted">M${m}</span></td></tr>`;
      }
      ia2Q(box, ".tt").innerHTML = h + "</table>";
      ia2Q(box, ".tt").querySelectorAll(".ia2click").forEach(td => td.onclick = () => { F[+td.dataset.m] ^= 1; draw(); });
      const mn = ia2Min(nv, on), sop = mn.covers[0] ? ia2SOP(mn.covers[0], vars) : "0";
      ia2Q(box, ".km").innerHTML = ia2KMap(vars, on, { groups: mn.covers[0] || [], title: "χάρτης Karnaugh", size: 42 });
      const can = on.map(m => vars.map((v, k) => v + ((m >> (nv - 1 - k)) & 1 ? "" : "'")).join("")).join(" + ") || "0";
      const pos = off.map(m => "(" + vars.map((v, k) => v + ((m >> (nv - 1 - k)) & 1 ? "'" : "")).join(" + ") + ")").join("") || "1";
      ia2Q(box, ".res").innerHTML = `<b>Άθροισμα ελαχιστόρων:</b> $F = \\Sigma(${on.join(", ") || "\\;"})$ = ${on.map(m => "m" + m).join(" + ") || "0"}<br><span class="small">${can.length > 160 ? "(κανονική μορφή: πολύ μεγάλη για εμφάνιση)" : "$F = " + ia2Tex(can) + "$"}</span><br>
        <b>Γινόμενο μεγιστόρων:</b> $F = \\Pi(${off.join(", ") || "\\;"})$ = ${off.map(m => "M" + m).join("·") || "1"}<br><span class="small">${off.length && pos.length < 170 ? "$F = " + pos + "$" : ""}</span><br>
        <b>Απλοποιημένη (Karnaugh):</b> $F = ${on.length === 1 << nv ? "1" : ia2Tex(sop)}$ <span class="muted small">— ${on.length} ελαχιστόροι + ${off.length} μεγιστόροι = ${1 << nv} γραμμές</span>`;
      ia2Tx(ia2Q(box, ".res"));
    }
    ia2Q(box, ".nv").onchange = () => { nv = +ia2Q(box, ".nv").value; F = Array(1 << nv).fill(0); draw(); };
    ia2Q(box, ".rnd").onclick = () => { F = F.map(() => Math.random() < 0.45 ? 1 : 0); draw(); };
    ia2Q(box, ".clr").onclick = () => { F = F.map(() => 0); draw(); };
    draw();
  },

  /* ---------- 2.6 Διαδραστικός χάρτης Karnaugh ---------- */
  ia2kmap(box) {
    box.innerHTML = `<div class="wctl"><label>μεταβλητές: <select class="nv"><option value="2">2 (A, B)</option><option value="3">3 (A, B, C)</option><option value="4" selected>4 (A, B, C, D)</option></select></label>
      <label>F = Σ( <input class="sg" style="width:150px" placeholder="π.χ. 0,2,8,10"> )</label><button class="btn ghost rnd">🎲 τυχαία</button><button class="btn ghost clr">↺</button></div>
      <div class="ia2row"><div class="km ia2kc" style="flex:0 1 300px"></div><div class="res wout" style="flex:1 1 240px"></div></div><div class="cir ia2scroll"></div>
      <p class="muted small">👆 Πάτησε στα κελιά του χάρτη για να βάλεις/βγάλεις 1. Οι ομάδες (2, 4, 8, 16 γειτονικά κελιά — και «αναδιπλούμενα» στις άκρες/γωνίες) υπολογίζονται αυτόματα.</p>`;
    let nv = 4, on = new Set([3, 7, 11, 12, 13, 14, 15]);
    function draw(fromInput) {
      const vars = "ABCD".slice(0, nv).split(""), ones = [...on].sort((a, b) => a - b), mn = ia2Min(nv, ones), cv = mn.covers[0] || [];
      ia2Q(box, ".km").innerHTML = ia2KMap(vars, ones, { groups: cv, showM: true, size: nv === 2 ? 60 : 52 });
      ia2Q(box, ".km").querySelectorAll(".kc").forEach(g => g.onclick = () => { const m = +g.dataset.m; on.has(m) ? on.delete(m) : on.add(m); draw(); });
      if (!fromInput) ia2Q(box, ".sg").value = ones.join(",");
      const all = ones.length === 1 << nv;
      let h = `$F = \\Sigma(${ones.join(",") || "\\;"})$<br>`;
      if (!ones.length) h += "Κανένα 1 → <b>F = 0</b>.";
      else if (all) h += "Όλα τα κελιά 1 (δεκαεξάδα/πλήρης χάρτης) → <b>F = 1</b>.";
      else {
        h += `<b>Ομάδες:</b><br>` + cv.map((c, i) => { const n = ia2CubeMs(c).length; return `<span class="ia2pill" style="background:${IA2GCOL[i % IA2GCOL.length]}22;color:${IA2GCOL[i % IA2GCOL.length]}">${n === 1 ? "μονάδα" : n === 2 ? "δυάδα" : n === 4 ? "τετράδα" : n === 8 ? "οκτάδα" : n} (${ia2CubeMs(c).map(m => "m" + m).join(",")}) → $${ia2Tex(ia2CubeStr(c, vars))}$</span>`; }).join("<br>");
        h += `<br><b>Απλοποιημένη:</b> <span style="font-size:1.1em">$F = ${ia2Tex(ia2SOP(cv, vars))}$</span>`;
        if (mn.covers.length > 1) h += `<br><span class="muted small">Υπάρχουν και άλλες εξίσου απλές λύσεις: ${mn.covers.slice(1, 3).map(c => "$" + ia2Tex(ia2SOP(c, vars)) + "$").join(", ")}</span>`;
        h += `<br><span class="muted small">Από ${ones.length} ελαχιστόρους με ${nv} μεταβλητές ο καθένας σε ${cv.length} όρο(υς) με συνολικά ${cv.reduce((a, c) => a + c.replace(/-/g, "").length, 0)} μεταβλητές.</span>`;
      }
      ia2Q(box, ".res").innerHTML = h; ia2Tx(ia2Q(box, ".res"));
      ia2Q(box, ".cir").innerHTML = !ones.length || all ? "" : `<p class="small muted" style="margin:6px 0 2px">Κύκλωμα μετά την απλοποίηση:</p>` + ia2Circuit(ia2SOP(cv, vars), { vars: vars.filter(v => ia2SOP(cv, vars).includes(v)) });
    }
    ia2Q(box, ".nv").onchange = () => { nv = +ia2Q(box, ".nv").value; on = new Set(); draw(); };
    ia2Q(box, ".sg").oninput = () => { const ms = (ia2Q(box, ".sg").value.match(/\d+/g) || []).map(Number).filter(m => m < 1 << nv); on = new Set(ms); draw(true); };
    ia2Q(box, ".rnd").onclick = () => { on = new Set(); for (let m = 0; m < 1 << nv; m++) if (Math.random() < 0.4) on.add(m); draw(); };
    ia2Q(box, ".clr").onclick = () => { on = new Set(); draw(); };
    draw();
  },

  /* ---------- 2.7 Δυαδικός αθροιστής 4 bit (HA + 3 FA) ---------- */
  ia2adder(box) {
    box.innerHTML = `<div class="wctl"><span><b>A</b> = </span><span class="ba"></span><span class="da muted"></span></div>
      <div class="wctl"><span><b>B</b> = </span><span class="bb"></span><span class="db muted"></span></div>
      <div class="wctl"><button class="btn ghost st">▶ Βήμα (κρατούμενο)</button><button class="btn ghost all">⏩ Όλα</button><button class="btn ghost rs">↺</button><button class="btn ghost rnd">🎲</button></div>
      <div class="dia ia2scroll"></div><div class="ia2scroll tab"></div><div class="wout res"></div>`;
    let A = [1, 0, 1, 1], B = [1, 0, 1, 0], k = 4; /* A[3]..A[0] ως πίνακας από το MSB */
    const bit = (arr, i) => arr[3 - i];
    function bits(el, arr) {
      if (!el.children.length) { el.innerHTML = arr.map((b, j) => `<button class="ia2bit" data-j="${j}" title="bit ${3 - j}"></button>`).join(" ");
        el.querySelectorAll("button").forEach(btn => btn.onclick = () => { arr[+btn.dataset.j] ^= 1; k = 4; draw(); }); }
      el.querySelectorAll("button").forEach(btn => { const v = arr[+btn.dataset.j]; btn.textContent = v; btn.classList.toggle("on", !!v); });
    }
    function draw() {
      bits(ia2Q(box, ".ba"), A); bits(ia2Q(box, ".bb"), B);
      const a = parseInt(A.join(""), 2), b = parseInt(B.join(""), 2);
      ia2Q(box, ".da").textContent = ` (= ${a} στο δεκαδικό)`; ia2Q(box, ".db").textContent = ` (= ${b} στο δεκαδικό)`;
      const S = [], C = []; let c = 0;
      for (let i = 0; i < 4; i++) { const s = bit(A, i) + bit(B, i) + c; S[i] = s & 1; C[i] = s >> 1; c = C[i]; }
      /* διάγραμμα */
      const W = 610, Hh = 210, bw = 104, gap = 40, x0 = W - 20 - bw;
      let s = "";
      for (let i = 0; i < 4; i++) {
        const x = x0 - i * (bw + gap), y = 64, act = i < k, cur = i === k - 1;
        const fill = cur ? "#fff3df" : act ? "#eef6ff" : "#f6f8fb", st = cur ? IA2C.amber : act ? IA2C.blue : "#94a3b8";
        s += `<rect x="${x}" y="${y}" width="${bw}" height="70" rx="10" fill="${fill}" stroke="${st}" stroke-width="2.2"/><text x="${x + bw / 2}" y="${y + 40}" text-anchor="middle" font-size="18" font-weight="800" fill="${st}">${i === 0 ? "HA" : "FA"}</text>`;
        [["A", bit(A, i), x + bw * 0.25], ["B", bit(B, i), x + bw * 0.75]].forEach(([n, v, xx]) => {
          s += `<line x1="${xx}" y1="22" x2="${xx}" y2="${y}" stroke="${v ? IA2C.green : "#94a3b8"}" stroke-width="${v ? 3 : 2}"/><text x="${xx}" y="16" text-anchor="middle" font-size="13" font-weight="800" fill="${IA2C.ink}">${n}${i}=${v}</text>`; });
        const sv = act ? S[i] : "?";
        s += `<line x1="${x + bw / 2}" y1="${y + 70}" x2="${x + bw / 2}" y2="${y + 112}" stroke="${act && S[i] ? IA2C.green : "#94a3b8"}" stroke-width="${act && S[i] ? 3 : 2}"/><text x="${x + bw / 2}" y="${y + 130}" text-anchor="middle" font-size="14" font-weight="800" fill="${act ? IA2C.ink : "#94a3b8"}">S${i}=${sv}</text>`;
        const cx = x - (i < 3 ? gap : 26), cv = act ? C[i] : "?";
        s += `<line x1="${x}" y1="${y + 35}" x2="${cx}" y2="${y + 35}" stroke="${act && C[i] ? IA2C.green : "#94a3b8"}" stroke-width="${act && C[i] ? 3 : 2}" marker-end="url(#ia2arr)"/><text x="${x - (i < 3 ? gap / 2 : 15)}" y="${y + 54}" text-anchor="middle" font-size="11.5" font-weight="800" fill="${act ? IA2C.purple : "#94a3b8"}">C${i}=${cv}</text>`;
      }
      s = `<defs><marker id="ia2arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0L8,4L0,8Z" fill="#64748b"/></marker></defs>` + s;
      ia2Q(box, ".dia").innerHTML = `<svg viewBox="0 0 ${W} ${Hh}" width="${W}" style="max-width:100%;height:auto">${s}</svg>`;
      let t = `<table class="tbl ia2tt"><tr><th>i</th><th>A<sub>i</sub></th><th>B<sub>i</sub></th><th>κρατ. εισόδου</th><th class="ia2o">S<sub>i</sub></th><th class="ia2o">C<sub>i</sub></th></tr>`;
      for (let i = 0; i < 4; i++) t += `<tr${i === k - 1 ? ' class="ia2hl"' : ""}><td>${i}</td><td>${bit(A, i)}</td><td>${bit(B, i)}</td><td>${i ? (i < k ? C[i - 1] : "?") : "— (HA)"}</td><td class="ia2o ia2one">${i < k ? S[i] : "?"}</td><td class="ia2o">${i < k ? C[i] : "?"}</td></tr>`;
      ia2Q(box, ".tab").innerHTML = t + "</table>";
      ia2Q(box, ".res").innerHTML = k >= 4 ? `Αποτέλεσμα: <b>C<sub>3</sub>S<sub>3</sub>S<sub>2</sub>S<sub>1</sub>S<sub>0</sub> = <code>${C[3]}${S[3]}${S[2]}${S[1]}${S[0]}</code></b> = ${a + b} στο δεκαδικό (${a} + ${b} = ${a + b})${C[3] ? ' · <span class="ia2err">C<sub>3</sub> = 1: το άθροισμα δεν χωρά σε 4 bit</span>' : ""}` :
        `Βήμα ${k}: η βαθμίδα ${k - 1} προσθέτει A<sub>${k - 1}</sub> + B<sub>${k - 1}</sub>${k > 1 ? " + C<sub>" + (k - 2) + "</sub>" : ""} και δίνει S<sub>${k - 1}</sub> = ${S[k - 1]}, κρατούμενο C<sub>${k - 1}</sub> = ${C[k - 1]} προς την επόμενη βαθμίδα.`;
    }
    ia2Q(box, ".st").onclick = () => { k = k >= 4 ? 1 : k + 1; draw(); };
    ia2Q(box, ".all").onclick = () => { k = 4; draw(); };
    ia2Q(box, ".rs").onclick = () => { k = 0; draw(); };
    ia2Q(box, ".rnd").onclick = () => { for (let j = 0; j < 4; j++) { A[j] = Math.random() < 0.5 ? 1 : 0; B[j] = Math.random() < 0.5 ? 1 : 0; } k = 0; draw(); };
    draw();
  }
});

/* ======================= Γεννήτριες ======================= */
const IA2VS = [["A", "B", "C"], ["a", "b", "c"], ["x", "y", "z"]];
var GENS = Object.assign(window.GENS || {}, {
  /* 2.1 τιμή έκφρασης */
  ia2gEval: { label: "Τιμή λογικής έκφρασης", make() {
    const vars = ia2Pick(IA2VS), e = ia2RandExpr(vars), a = ia2Parse(e), env = ia2Env(vars, Math.floor(Math.random() * 8)), F = ia2Eval(a, env);
    const dual = Math.random() < 0.35 && ia2Dual(a);
    if (dual) { const Fd = ia2Eval(dual, env);
      return { level: 2, q: `Δίνεται η λογική έκφραση $F = ${ia2Tex(a)}$. Να βρείτε τη δυϊκή της $F_d$ και να υπολογίσετε τις τιμές $F$ και $F_d$ για ${vars.map(v => `$${v} = ${env[v]}$`).join(", ")}.`,
        fields: [{ label: "F =", ans: F }, { label: "F<sub>d</sub> =", ans: Fd }], hint: "Για τη δυϊκή εναλλάσσουμε + ↔ * και 0 ↔ 1 (οι μεταβλητές και οι τόνοι μένουν ίδιοι). Προσοχή στις παρενθέσεις!",
        sol: `$F = ${ia2SubTex(a, env)} = ${F}$.<br>Δυϊκή: $F_d = ${ia2Tex(dual)}$, άρα $F_d = ${ia2SubTex(dual, env)} = ${Fd}$.` }; }
    return { level: 1, q: `Να υπολογίσετε την τιμή της λογικής έκφρασης $F = ${ia2Tex(a)}$ για ${vars.map(v => `$${v} = ${env[v]}$`).join(", ")}.`, fields: [{ label: "F =", ans: F }],
      hint: "Αντικατέστησε τις τιμές και κάνε τις πράξεις με τη σειρά: παρενθέσεις, αντιστροφή ('), γινόμενο, άθροισμα. (⊕: 1 όταν οι τιμές διαφέρουν.)",
      sol: `Αντικατάσταση: $F = ${ia2SubTex(a, env)}$. Με την προτεραιότητα των πράξεων προκύπτει $F = ${F}$.` }; } },

  /* 2.2 απλοποίηση με θεωρήματα */
  ia2gSimp: { label: "Αλγεβρική απλοποίηση", make() {
    const T = [["XY + XY'", "X", "X(Y + Y') = X·1 = X (Α3, Α5, Α4)"], ["X + X'Y", "X + Y", "Θ7"], ["X(X' + Y)", "XY", "Θ7 (δυϊκή μορφή)"], ["X + XY", "X", "Θ3 (απορρόφηση)"],
      ["X(X + Y)", "X", "Θ3 (απορρόφηση, δυϊκή μορφή)"], ["(X + Y)(X + Y')", "X", "Α3: X + YY' = X + 0 = X"], ["XYZ + XYZ'", "XY", "XY(Z + Z') = XY (Α3, Α5, Α4)"], ["(X'Y)' ", "X + Y'", "Θ6 (De Morgan) και Θ5"],
      ["X'Y' + X'Y", "X'", "X'(Y' + Y) = X' (Α3, Α5, Α4)"], ["(X' + Y')'", "XY", "Θ6 (De Morgan) και Θ5"], ["XY + X'Z + YZ", "XY + X'Z", "ο όρος YZ «περισσεύει» (Παράδειγμα 2.2γ)"],
      ["(XY)' + X", "1", "Θ6: X' + Y' + X = (X + X') + Y' = 1 + Y' = 1"], ["XY' + XY + X'Y", "X + Y", "X(Y' + Y) + X'Y = X + X'Y = X + Y (Θ7)"], ["(X + Y)' + (X + Y')'", "X'", "X'Y' + X'Y = X'(Y' + Y) = X'"]];
    const [e0, r0, why] = ia2Pick(T), vs = ia2Pick(IA2VS), map = { X: vs[0], Y: vs[1], Z: vs[2] }, sw = Math.random() < 0.5;

    const rn = s => s.replace(/[XYZ]/g, c => map[c]), e = rn(e0), r = rn(r0), vars = vs.slice().sort();
    const pool = ["X", "Y", "X + Y", "XY", "X'", "Y'", "X'Y", "XY'", "X + Y'", "X' + Y", "1", "0", "X'Y'", "X' + Y'", "XZ", "X + Z", "YZ", "XY + Z", "X + YZ", "XY + XZ", "X'Z", "XY + YZ"].map(rn);
    const opts = [r, ...ia2Opts(r, pool, vars)];
    return { level: 2, type: "mc", q: `Να απλοποιήσετε τη λογική έκφραση $F = ${ia2Tex(e)}$, χρησιμοποιώντας τα αξιώματα και τα θεωρήματα της άλγεβρας Boole.`, options: opts.map(o => "$F = " + ia2Tex(o) + "$"), correct: 0,
      hint: "Αναζήτησε κοινό παράγοντα (Α3), τα ζεύγη a + a' = 1 και a·a' = 0 (Α5), την απορρόφηση (Θ3), το Θ7 ή τον De Morgan (Θ6).", sol: `$F = ${ia2Tex(e)} = ${ia2Tex(r)}$ — ${why}. (Έλεγχος με πίνακα αλήθειας: ίδια στήλη <code>${ia2Bits(e, vars)}</code>.)`.replace(" — " + why, " — " + rn(why)) }; } },

  /* 2.3 πύλες */
  ia2gGate: { label: "Έξοδος λογικής πύλης", make() {
    const g = ia2Pick(["AND", "OR", "NOT", "NAND", "NOR", "XOR", "XNOR"]), n = g === "NOT" ? 1 : Math.random() < 0.3 ? 3 : 2, vars = ["A", "B", "C"].slice(0, n);
    const ex = { AND: vars.join(""), OR: vars.join("+"), NOT: "A'", NAND: "(" + vars.join("") + ")'", NOR: "(" + vars.join("+") + ")'", XOR: vars.join("⊕"), XNOR: "(" + vars.join("⊕") + ")'" }[g];
    const fig = ia2Fig(ia2Circuit(ex, { out: "Y", w: 300 }));
    if (Math.random() < 0.5) { const m = Math.floor(Math.random() * (1 << n)), env = ia2Env(vars, m), y = ia2Eval(ia2Parse(ex), env);
      return { level: 1, q: `Δίνεται η λογική πύλη:${fig}Ποια είναι η έξοδος $Y$ για ${vars.map(v => `$${v} = ${env[v]}$`).join(", ")};`, fields: [{ label: "Y =", ans: y }],
        hint: "Αναγνώρισε πρώτα την πύλη από το σχήμα της (καμπύλη πίσω πλευρά = OR/XOR, διπλή καμπύλη = XOR, κυκλάκι στην έξοδο = άρνηση).", sol: `Είναι πύλη <b>${g}</b>: $Y = ${ia2Tex(ex)} = ${ia2SubTex(ex, env)} = ${y}$.` }; }
    const b = ia2Bits(ex, vars);
    return { level: 1, q: `Να συμπληρώσετε τη στήλη εξόδου του πίνακα αλήθειας της πύλης <b>${g}</b> με ${n} ${n === 1 ? "είσοδο" : "εισόδους"} (${vars.join(", ")}). Γράψτε τις τιμές του $Y$ από πάνω προς τα κάτω (από ${"0".repeat(n)} έως ${"1".repeat(n)}) χωρίς κενά.`,
      fields: [{ label: "Y:", ans: b, text: true, nospace: true, ph: "π.χ. " + "0".repeat(1 << n) }], hint: "Ο πίνακας έχει $2^n$ γραμμές. Γράψε τη συμπεριφορά της πύλης γραμμή-γραμμή.",
      sol: `Πύλη ${g}: $Y = ${ia2Tex(ex)}$.` + ia2TTable(vars, [["Y", ia2TT(ex, vars)]]) + `Στήλη: <code>${b}</code>.` }; } },

  /* 2.4 κύκλωμα */
  ia2gCirc: { label: "Ανάλυση λογικού κυκλώματος", make() {
    const vars = ["A", "B", "C"], e = ia2RandExpr(vars), env = ia2Env(vars, Math.floor(Math.random() * 8)), F = ia2Eval(ia2Parse(e), env);
    if (Math.random() < 0.6) return { level: 2, q: `Δίνεται το πιο κάτω λογικό κύκλωμα.${ia2Fig(ia2Circuit(e))}Να βρείτε την τιμή της εξόδου $F$ για ${vars.map(v => `$${v} = ${env[v]}$`).join(", ")}.`, fields: [{ label: "F =", ans: F }],
      hint: "Ακολούθησε τη διαδρομή του σήματος: υπολόγισε την έξοδο κάθε πύλης από αριστερά προς τα δεξιά.",
      sol: `Η συνάρτηση του κυκλώματος είναι $F = ${ia2Tex(e)}$, άρα $F = ${ia2SubTex(e, env)} = ${F}$.${ia2Fig(ia2Circuit(e, { vals: env }), "Πράσινα: σήματα με τιμή 1")}` };
    const b = ia2Bits(e, vars);
    return { level: 2, q: `Να δημιουργήσετε τον πίνακα αλήθειας της λογικής συνάρτησης $F = ${ia2Tex(e)}$. Γράψτε τη στήλη του $F$ από πάνω προς τα κάτω (ABC = 000 έως 111) χωρίς κενά.`,
      fields: [{ label: "F:", ans: b, text: true, nospace: true, ph: "π.χ. 01001111" }], hint: "8 γραμμές (2³). Υπολόγισε την F για κάθε συνδυασμό· βοηθά να βρεις πρώτα πότε κάθε όρος γίνεται 1.",
      sol: ia2TTable(vars, [["F", ia2TT(e, vars)]]) + `Στήλη F: <code>${b}</code> · $F = \\Sigma(${ia2Sigma(e, vars).join(",")})$.` }; } },

  /* 2.5 ελαχιστόροι */
  ia2gSig: { label: "Σ ελαχιστόρων & Π μεγιστόρων", make() {
    const vars = ia2Pick(IA2VS), e = ia2Pick([ia2RandExpr(vars), ia2RandExpr(vars), vars[0] + " + " + vars[1] + "'" + vars[2], vars[0] + vars[1] + " + " + vars[2] + "'", vars[0] + "'" + vars[1] + " + " + vars[0] + vars[2] + "'"]);
    const S = ia2Sigma(e, vars), P = ia2Pi(e, vars);
    return { level: 2, q: `Να γράψετε τη συνάρτηση $f(${vars.join(",")}) = ${ia2Tex(e)}$ ως άθροισμα ελαχιστόρων και ως γινόμενο μεγιστόρων. (Γράψτε μόνο τους αριθμούς, σε αύξουσα σειρά, χωρισμένους με κόμμα.)`,
      fields: [{ label: "f = Σ(", ans: S.join(","), text: true, nospace: true, ph: "π.χ. 1,4,7" }, { label: "f = Π(", ans: P.join(","), text: true, nospace: true }],
      hint: "Φτιάξε τον πίνακα αλήθειας (8 γραμμές): οι γραμμές με f = 1 δίνουν τους ελαχιστόρους, οι γραμμές με f = 0 τους μεγιστόρους.",
      sol: ia2TTable(vars, [["f", ia2TT(e, vars)]], { m: true }) + `$f = \\Sigma(${S.join(",")}) = ${S.map(m => "m_{" + m + "}").join(" + ")}$ και $f = \\Pi(${P.join(",")}) = ${P.map(m => "M_{" + m + "}").join("")}$.` }; } },

  /* 2.6 Karnaugh */
  ia2gKmap: { label: "Απλοποίηση με χάρτη Karnaugh", make() {
    for (;;) {
      const nv = Math.random() < 0.45 ? 3 : 4, vars = "ABCD".slice(0, nv).split(""), on = [];
      for (let m = 0; m < 1 << nv; m++) if (Math.random() < (nv === 3 ? 0.45 : 0.38)) on.push(m);
      if (on.length < 2 || on.length > (1 << nv) - 2) continue;
      const mn = ia2Min(nv, on); if (mn.covers.length !== 1) continue; const cv = mn.covers[0]; if (cv.length < 2 || cv.length > 3) continue; if (cv.every(c => !c.includes("-"))) continue;
      const right = ia2SOP(cv, vars), pool = [];
      cv.forEach((c, i) => { for (let k = 0; k < nv; k++) if (c[k] !== "-") { pool.push(ia2SOP(cv.map((d, j) => j === i ? d.slice(0, k) + "-" + d.slice(k + 1) : d), vars)); pool.push(ia2SOP(cv.map((d, j) => j === i ? d.slice(0, k) + (d[k] === "0" ? "1" : "0") + d.slice(k + 1) : d), vars)); } pool.push(ia2SOP(cv.filter((_, j) => j !== i), vars)); });
      mn.primes.forEach(p => { if (!cv.includes(p)) pool.push(right + " + " + ia2CubeStr(p, vars)); });
      const wr = ia2Opts(right, pool.filter(p => p && p !== "0" && p !== "1"), vars); if (wr.length < 3) continue;
      return { level: 3, type: "mc", q: `Δίνεται η συνάρτηση $F(${vars.join(",")}) = \\Sigma(${on.join(",")})$. Με τη βοήθεια του χάρτη Karnaugh, να βρείτε την απλούστερη μορφή της.${ia2Fig(ia2KMap(vars, on, { size: 44 }))}`,
        options: [right, ...wr].map(o => "$F = " + ia2Tex(o) + "$"), correct: 0,
        hint: "Ομαδοποίησε τα 1 σε όσο το δυνατό λιγότερες και μεγαλύτερες ομάδες των 2, 4, 8 (θυμήσου ότι οι άκρες και οι γωνίες είναι γειτονικές). Σε κάθε ομάδα κρατάς μόνο τις μεταβλητές που δεν αλλάζουν.",
        sol: `${ia2Fig(ia2KMap(vars, on, { groups: cv, size: 44 }))}Ομάδες: ${cv.map(c => `(${ia2CubeMs(c).map(m => "m" + m).join(", ")}) → $${ia2Tex(ia2CubeStr(c, vars))}$`).join(" · ")}.<br>Άρα $F = ${ia2Tex(right)}$.` };
    } } },

  /* 2.7 αθροιστής */
  ia2gAdd: { label: "Δυαδικός αθροιστής 4 bit", make() {
    const a = 1 + Math.floor(Math.random() * 15), b = 1 + Math.floor(Math.random() * 15), A = a.toString(2).padStart(4, "0"), B = b.toString(2).padStart(4, "0");
    const S = [], C = []; let c = 0; for (let i = 0; i < 4; i++) { const s = +A[3 - i] + +B[3 - i] + c; S[i] = s & 1; C[i] = s >> 1; c = C[i]; }
    const res = "" + C[3] + S[3] + S[2] + S[1] + S[0], j = 1 + Math.floor(Math.random() * 2);
    let t = `<table class="tbl ia2tt"><tr><th>i</th><th>A<sub>i</sub></th><th>B<sub>i</sub></th><th>C<sub>i</sub></th><th>S<sub>i</sub></th></tr>`; for (let i = 0; i < 4; i++) t += `<tr><td>${i}</td><td>${A[3 - i]}</td><td>${B[3 - i]}</td><td>${C[i]}</td><td>${S[i]}</td></tr>`;
    return { level: 2, q: `Οι αριθμοί $A = ${A}$ και $B = ${B}$ προστίθενται σε δυαδικό αθροιστή 4 bit (ένας ημιαθροιστής και τρεις πλήρεις αθροιστές). Να βρείτε το κρατούμενο $C_{${j}}$ της βαθμίδας ${j} και το αποτέλεσμα $C_3S_3S_2S_1S_0$.`,
      fields: [{ label: `C<sub>${j}</sub> =`, ans: C[j] }, { label: "C₃S₃S₂S₁S₀ =", ans: res, text: true, nospace: true, ph: "5 bit" }],
      hint: "Ξεκίνα από τα λιγότερο σημαντικά ψηφία (i = 0, ημιαθροιστής). Κάθε πλήρης αθροιστής προσθέτει A_i + B_i + το κρατούμενο της προηγούμενης βαθμίδας.",
      sol: t + `</table>Αποτέλεσμα: <b>${res}</b> (${a} + ${b} = ${a + b}).` }; } }
});

/* Πληροφορική Γ΄ Λυκείου — Ενότητα 3 (C++ βασικές δομές): widgets & γεννήτριες (prefix ia3) */

/* ---------- μορφοποίηση εξόδου όπως η cout ---------- */
/* %g με p σημαντικά ψηφία (προεπιλογή cout: 6) */
function ia3G(x, p = 6) {
  if (typeof x === "boolean") return x ? "1" : "0";
  if (!isFinite(x)) return isNaN(x) ? "-nan" : (x < 0 ? "-inf" : "inf");
  if (x === 0) return Object.is(x, -0) ? "-0" : "0";
  const ex = x.toExponential(p - 1), e = +ex.split("e")[1];
  if (e < -4 || e >= p) { let [m, k] = ex.split("e"); if (m.includes(".")) m = m.replace(/0+$/, "").replace(/\.$/, ""); const kk = Math.abs(+k); return m + "e" + (+k < 0 ? "-" : "+") + (kk < 10 ? "0" : "") + kk; }
  let s = x.toFixed(Math.max(0, p - 1 - e)); if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, ""); return s;
}
/* fixed << setprecision(p): στρογγυλοποίηση όπως η printf (ακριβείς ισοπαλίες → άρτιο ψηφίο) */
function ia3Fix(x, p) {
  const ax = Math.abs(x); let s = ax.toFixed(p);
  const long = ax.toFixed(Math.min(100, p + 40)), tail = long.slice(long.indexOf(".") + 1 + p);
  if (/^50*$/.test(tail)) { const dd = Math.floor(ax * 10 ** p); if (dd % 2 === 0) s = (dd / 10 ** p).toFixed(p); }  /* ακριβής ισοπαλία → άρτιο */
  return (x < 0 || Object.is(x, -0) ? "-" : "") + s;
}
const ia3Round = x => Math.sign(x) * Math.round(Math.abs(x));   /* round() της C++: μισό → μακριά από το 0 */

/* ---------- μικρός υπολογιστής εκφράσεων C++ (int / double / bool) ---------- */
function ia3Eval(src, vars = {}) {
  const toks = []; let i = 0; const S = String(src);
  while (i < S.length) {
    const c = S[i];
    if (/\s/.test(c)) { i++; continue; }
    let m;
    if ((m = /^(\d+\.\d*|\.\d+|\d+)([eE][-+]?\d+)?f?/.exec(S.slice(i)))) { const lit = m[0].replace(/f$/, ""); toks.push({ k: "num", v: +lit, t: /[.eE]/.test(lit) ? "d" : "i", s: m[0] }); i += m[0].length; continue; }
    if ((m = /^[A-Za-z_]\w*/.exec(S.slice(i)))) { toks.push({ k: "id", s: m[0] }); i += m[0].length; continue; }
    if ((m = /^(&&|\|\||==|!=|<=|>=|[-+*/%()!<>,])/.exec(S.slice(i)))) { toks.push({ k: "op", s: m[0] }); i += m[0].length; continue; }
    throw new Error(`άγνωστο σύμβολο «${c}»`);
  }
  let p = 0; const steps = [];
  const peek = () => toks[p], eat = s => { const t = toks[p]; if (!t || t.s !== s) throw new Error(`περίμενα «${s}»`); p++; return t; };
  const V = (v, t) => ({ v: t === "i" ? Math.trunc(v) : t === "b" ? !!v : t === "f" ? Math.fround(v) : v, t });
  const RT = (a, b) => a.t === "d" || b.t === "d" ? "d" : a.t === "f" || b.t === "f" ? "f" : "i";
  const num = a => a.t === "b" ? (a.v ? 1 : 0) : a.v;
  const show = a => a.t === "b" ? (a.v ? "true" : "false") : a.t === "i" ? String(a.v) : ia3G(a.v);
  const TN = { i: "int", f: "float", d: "double", b: "bool" };
  const PREC = { "||": 1, "&&": 2, "==": 3, "!=": 3, "<": 4, ">": 4, "<=": 4, ">=": 4, "+": 5, "-": 5, "*": 6, "/": 6, "%": 6 };
  function bin(op, a, b) {
    let r, note = "";
    if (op === "&&" || op === "||") r = V(op === "&&" ? (num(a) !== 0 && num(b) !== 0) : (num(a) !== 0 || num(b) !== 0), "b");
    else if (PREC[op] <= 4) { const x = num(a), y = num(b); r = V({ "==": x === y, "!=": x !== y, "<": x < y, ">": x > y, "<=": x <= y, ">=": x >= y }[op], "b"); }
    else {
      const rt = RT(a, b), isInt = rt === "i", x = num(a), y = num(b);
      if (op === "%") { if (!isInt) throw new Error("ο τελεστής % δέχεται μόνο ακέραιους"); if (y === 0) throw new Error("υπόλοιπο με μηδέν"); r = V(x % y, "i"); note = "υπόλοιπο ακέραιας διαίρεσης"; }
      else if (op === "/") { if (isInt) { if (y === 0) throw new Error("ακέραια διαίρεση με μηδέν"); r = V(Math.trunc(x / y), "i"); note = "ακέραια διαίρεση (αποκόπτεται το δεκαδικό μέρος)"; } else { r = V(x / y, rt); note = "πραγματική διαίρεση"; } }
      else r = V(op === "+" ? x + y : op === "-" ? x - y : x * y, rt);
      if (isInt && Math.abs(r.v) > 2147483647) note = "⚠ υπερχείλιση int!";
    }
    steps.push({ e: `${show(a)} ${op} ${show(b)}`, r: show(r), note }); return r;
  }
  const FN = {
    sqrt: a => { if (num(a) < 0) throw new Error("sqrt αρνητικού"); return V(Math.sqrt(num(a)), a.t === "f" ? "f" : "d"); },
    abs: a => V(Math.abs(num(a)), a.t === "d" || a.t === "f" ? a.t : "i"),
    pow: (a, b) => V(Math.pow(num(a), num(b)), a.t === "f" && b.t === "f" ? "f" : "d"),
    trunc: a => V(Math.trunc(num(a)), a.t === "f" ? "f" : "d"), round: a => V(ia3Round(num(a)), a.t === "f" ? "f" : "d"),
    float: a => V(num(a), "f"), double: a => V(num(a), "d"), int: a => V(Math.trunc(num(a)), "i")
  };
  function unary() {
    const t = peek(); if (!t) throw new Error("ελλιπής έκφραση");
    if (t.s === "-" || t.s === "+") { p++; const a = unary(); if (t.s === "+") return a; return a.t === "d" || a.t === "f" ? V(-a.v, a.t) : V(-num(a), "i"); }
    if (t.s === "!") { p++; const a = unary(); const r = V(!(num(a) !== 0), "b"); steps.push({ e: `!${show(a)}`, r: show(r), note: "άρνηση (NOT)" }); return r; }
    if (t.s === "(") {
      const n = toks[p + 1], n2 = toks[p + 2];
      if (n && n.k === "id" && /^(int|float|double)$/.test(n.s) && n2 && n2.s === ")") { p += 3; const a = unary(); const r = FN[n.s](a); steps.push({ e: `(${n.s}) ${show(a)}`, r: show(r), note: "μετατροπή τύπου (type casting)" }); return r; }
      p++; const a = expr(0); eat(")"); return a;
    }
    if (t.k === "num") { p++; return V(t.v, t.t); }
    if (t.k === "id") {
      p++;
      if (peek() && peek().s === "(") {
        if (!FN[t.s]) throw new Error(`άγνωστη συνάρτηση ${t.s}`); p++;
        const args = [expr(0)]; while (peek() && peek().s === ",") { p++; args.push(expr(0)); } eat(")");
        if (args.length !== (t.s === "pow" ? 2 : 1)) throw new Error(`λάθος πλήθος ορισμάτων στην ${t.s}`);
        const r = FN[t.s](...args); steps.push({ e: `${t.s}(${args.map(show).join(", ")})`, r: show(r), note: /^(int|float|double)$/.test(t.s) ? "μετατροπή τύπου (type casting)" : "έτοιμη συνάρτηση &lt;cmath&gt;" }); return r;
      }
      if (t.s === "true" || t.s === "false") return V(t.s === "true", "b");
      if (!(t.s in vars)) throw new Error(`αδήλωτη μεταβλητή ${t.s}`);
      return vars[t.s];
    }
    throw new Error(`απρόσμενο «${t.s}»`);
  }
  function expr(minP) {
    let a = unary();
    while (peek() && PREC[peek().s] > minP) {
      const op = peek().s, pr = PREC[op]; p++;
      if (op === "&&" && !(num(a) !== 0)) { const save = steps.length; expr(pr); steps.length = save; a = V(false, "b"); steps.push({ e: `false && …`, r: "false", note: "βραχυκύκλωση: το δεξί μέρος δεν χρειάζεται" }); continue; }
      if (op === "||" && num(a) !== 0) { const save = steps.length; expr(pr); steps.length = save; a = V(true, "b"); steps.push({ e: `true || …`, r: "true", note: "βραχυκύκλωση: το δεξί μέρος δεν χρειάζεται" }); continue; }
      const b = expr(pr); a = bin(op, a, b);
    }
    return a;
  }
  const res = expr(0); if (p < toks.length) throw new Error(`περιττό «${toks[p].s}»`);
  return { val: res, steps, out: res.t === "b" ? (res.v ? "1" : "0") : res.t === "i" ? String(res.v) : ia3G(res.v), show: show(res) };
}

/* ---------- γενικό εργαλείο εκτέλεσης βήμα-βήμα (προκαταρκτική εκτέλεση) ---------- */
/* cfg: { inputs:[{k,label,v,w,type:"num"|"text"|"sel",opts:[[val,label]]}], code(inp)→src, run(inp)→steps, cols(inp)→[names],
          extra(inp, step, el)  (προαιρετικό πάνελ: πίνακας / λογικό διάγραμμα), note }
   step: { ln, v:{μεταβλητή:τιμή}, d:"i<=5", ok:true/false, out:"κείμενο" } */
function ia3Tracer(box, cfg) {
  const ins = cfg.inputs || [];
  box.innerHTML = `<div class="wctl">${ins.map(f => f.type === "sel" ? `<label>${f.label} <select data-k="${f.k}">${f.opts.map(o => `<option value="${o[0]}"${o[0] == f.v ? " selected" : ""}>${o[1]}</option>`).join("")}</select></label>`
      : `<label>${f.label} <input data-k="${f.k}" type="${f.type === "text" ? "text" : "number"}" value="${f.v}" style="width:${f.w || 64}px"></label>`).join("")}</div>
    <div class="wctl ia3btns"><button class="btn primary st">▶ Βήμα</button><button class="btn ghost pl">⏵ Αυτόματα</button><button class="btn ghost al">⏩ Μέχρι το τέλος</button><button class="btn ghost rs">↺ Από την αρχή</button><span class="muted small ia3cnt"></span></div>
    <div class="ia3grid"><div class="ia3code"></div><div class="ia3side"><div class="ia3extra"></div><div class="ia3tr"></div><div class="ia3con"></div></div></div>
    ${cfg.note ? `<p class="muted small">${cfg.note}</p>` : ""}`;
  let k = -1, steps = [], inp = {}, timer = null, err = "";
  const read = () => { inp = {}; box.querySelectorAll("[data-k]").forEach(e => { const f = ins.find(x => x.k === e.dataset.k); inp[e.dataset.k] = f.type === "num" || !f.type ? (e.value === "" ? 0 : +e.value) : e.value; }); };
  function rebuild() { read(); err = ""; try { steps = cfg.run(inp); } catch (e) { steps = []; err = e.message; } k = -1; draw(); }
  function draw() {
    const L = CPPlines(cfg.code(inp)), cur = k >= 0 && steps[k] ? steps[k].ln : 0;
    $(".ia3code", box).innerHTML = `<div class="cppbox"><pre class="cpp"><code>${L.map((l, j) => `<span class="cl${j + 1 === cur ? " on" : ""}"><i>${j + 1}</i>${l || " "}</span>`).join("")}</code></pre></div>`;
    const cols = cfg.cols(inp), shown = steps.slice(0, k + 1);
    let prev = {}, rows = "";
    shown.forEach((s, j) => { const cells = cols.map(c => { const v = s.v && c in s.v ? s.v[c] : undefined; const ch = v !== undefined && (!(c in prev) || prev[c] !== v); if (v !== undefined) prev[c] = v; return `<td>${ch ? cppEsc(String(v)) : ""}</td>`; }).join("");
      rows += `<tr class="${j === k ? "cur" : ""}"><td class="muted">${s.ln}</td>${cells}<td>${s.d ? cppEsc(s.d) : ""}</td><td>${s.d ? (s.ok ? '<b style="color:#198754">Α</b>' : '<b style="color:#DC3545">Ψ</b>') : ""}</td></tr>`; });
    $(".ia3tr", box).innerHTML = `<div class="ia3tw"><table class="tbl ia3tt"><tr><th class="muted">γρ.</th>${cols.map(c => `<th>${cppEsc(c)}</th>`).join("")}<th>Απόφαση</th><th>Α/Ψ</th></tr>${rows || `<tr><td colspan="${cols.length + 3}" class="muted">πάτησε ▶ Βήμα</td></tr>`}</table></div>`;
    const tw = $(".ia3tw", box); tw.scrollTop = tw.scrollHeight;
    const out = shown.map(s => s.out || "").join("");
    $(".ia3con", box).innerHTML = OUT(out || " ", err ? "⚠ " + err : "Οθόνη (έξοδος)");
    if (cfg.extra) cfg.extra(inp, k >= 0 ? steps[k] : null, $(".ia3extra", box), k, steps);
    $(".ia3cnt", box).textContent = err ? "" : `βήμα ${Math.max(0, k + 1)} / ${steps.length}` + (k === steps.length - 1 && steps.length ? " · τέλος εκτέλεσης ✓" : "");
  }
  const stop = () => { if (timer) { clearInterval(timer); timer = null; $(".pl", box).textContent = "⏵ Αυτόματα"; } };
  $(".st", box).onclick = () => { stop(); if (k < steps.length - 1) { k++; draw(); } };
  $(".al", box).onclick = () => { stop(); k = steps.length - 1; draw(); };
  $(".rs", box).onclick = () => { stop(); k = -1; draw(); };
  $(".pl", box).onclick = () => { if (timer) return stop(); if (k >= steps.length - 1) k = -1; $(".pl", box).textContent = "⏸ Παύση";
    timer = setInterval(() => { if (!box.isConnected || k >= steps.length - 1) return stop(); k++; draw(); }, 650); };
  box.querySelectorAll("[data-k]").forEach(e => e.oninput = e.onchange = () => { stop(); rebuild(); });
  rebuild();
  return { rebuild };
}
/* μικρός «καταγραφέας» βημάτων για τα run() */
function ia3Rec() { const st = []; return { st, s(ln, v, extra = {}) { st.push(Object.assign({ ln, v: Object.assign({}, v) }, extra)); }, }; }

(function () { if (document.getElementById("ia3css")) return; const st = document.createElement("style"); st.id = "ia3css";
  st.textContent = `.ia3grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:12px;align-items:start}.ia3grid .cppbox{margin:0}
.ia3tw{max-height:290px;overflow:auto;border-radius:10px}.ia3tt{display:table!important;width:100%;margin:0!important;font-size:13.5px}.ia3tt td,.ia3tt th{padding:3px 7px!important;font-family:"SF Mono",Consolas,Menlo,monospace}
.ia3tt th{position:sticky;top:0;z-index:1;background:#eef3fb}.ia3tt tr.cur td{background:#eafaf1}.ia3side .conbox{margin:8px 0 0}.ia3btns{gap:8px!important}.ia3btns .btn{padding:7px 11px}
.ia3arr{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px}.ia3cell{min-width:44px;text-align:center;border:2px solid var(--line);border-radius:10px;background:#fff;padding:4px 6px;font:700 15px "SF Mono",Consolas,monospace;color:var(--navy);position:relative;transition:.2s}
.ia3cell small{display:block;font:600 11px system-ui,sans-serif;color:var(--muted)}.ia3cell.cur{border-color:#C77A0A;background:#fff6e6;transform:translateY(-3px)}.ia3cell.best{border-color:#198754;background:#e7f6ee}.ia3cell.hit{border-color:#0F6FD1;background:#eaf2fd}
.ia3scr{font:15px "SF Mono",Consolas,Menlo,monospace;display:flex;flex-wrap:wrap;gap:2px;background:#08120c;border-radius:10px;padding:10px;min-height:44px}.ia3scr span{display:inline-block;min-width:16px;text-align:center;color:#b8f5cf;border-bottom:1px dashed #2c5a3c}.ia3scr span.sp{background:#173a26;color:#5d8f6f}
.ia3steps{margin:8px 0 0;padding-left:20px;font-size:14px}.ia3steps li{margin:3px 0}.ia3steps code{font-size:13px}.ia3big{font:700 22px "SF Mono",Consolas,monospace;color:var(--green)}
.ia3flowbox svg{max-width:100%;height:auto;display:block;margin:0 auto}`;
  document.head.appendChild(st); })();

/* ---------- γεννήτριες: βοηθητικά ---------- */
const ia3Dec = p => p === 1 ? "1 δεκαδικό ψηφίο" : p + " δεκαδικά ψηφία";
const ia3Tie = (x, p) => { const y = Math.abs(x) * 10 ** p; return Math.abs(y * 2 - Math.round(y * 2)) < 1e-7 && Math.abs(y - Math.round(y)) > 1e-7; };  /* ακριβές μισό → αποφεύγεται */
const ia3Pick = a => a[ri(0, a.length - 1)];
const ia3Prog = (body, inc = ["iostream"]) => inc.map(h => `#include <${h}>`).join("\n") + `\nusing namespace std;\nint main() {\n${body.split("\n").map(l => "    " + l).join("\n")}\n    return 0;\n}`;

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ===== 3.1 Μορφοποίηση εξόδου: setw / setprecision / fixed ===== */
  ia3fmt(box) {
    box.innerHTML = `<div class="wctl"><label>τιμή <input class="x" type="text" value="3.14159" style="width:96px"></label>
      <label>τύπος <select class="ty"><option value="d">double</option><option value="i">int</option><option value="s">string</option></select></label>
      <label>setw <input class="w" type="number" min="0" max="20" value="10" style="width:56px"></label>
      <label><input type="checkbox" class="fx" checked> fixed</label>
      <label>setprecision <input class="p" type="number" min="0" max="12" value="2" style="width:56px"></label>
      <label><input type="checkbox" class="ue" checked> με setprecision</label></div>
      <div class="code"></div><div class="muted small" style="margin:6px 0 4px">Οθόνη — κάθε κουτάκι είναι ένας χαρακτήρας (τα σκούρα είναι κενά):</div><div class="ia3scr"></div><div class="wout"></div>`;
    function draw() {
      const ty = $(".ty", box).value, w = Math.max(0, Math.min(30, +$(".w", box).value || 0)), fx = $(".fx", box).checked, ue = $(".ue", box).checked, p = Math.max(0, Math.min(15, +$(".p", box).value || 0));
      let raw = $(".x", box).value.trim(), lit, s, why;
      if (ty === "s") { lit = `"${raw}"`; s = raw; why = "Στις συμβολοσειρές η <code>setprecision</code> δεν έχει επίδραση."; }
      else { let x = parseFloat(raw.replace(",", ".")); if (!isFinite(x)) x = 0; if (ty === "i") { x = Math.trunc(x); lit = String(x); s = String(x); why = "Οι ακέραιοι τυπώνονται χωρίς δεκαδικά — η <code>setprecision</code> δεν τους επηρεάζει."; }
        else { lit = String(x).includes(".") || String(x).includes("e") ? String(x) : String(x) + ".0";
          if (!ue) { s = fx ? ia3Fix(x, 6) : ia3G(x, 6); why = fx ? "Με <code>fixed</code> χωρίς setprecision τυπώνονται 6 δεκαδικά ψηφία." : "Χωρίς fixed/setprecision η cout δείχνει έως 6 σημαντικά ψηφία και κόβει τα περιττά μηδενικά."; }
          else if (fx) { s = ia3Fix(x, p); why = `Με <code>fixed</code> η <code>setprecision(${p})</code> ορίζει <b>ακριβώς ${p} δεκαδικά ψηφία</b>, με στρογγυλοποίηση.`; }
          else { s = ia3G(x, Math.max(1, p)); why = `<b>Χωρίς fixed</b> η <code>setprecision(${p})</code> μετρά <b>σημαντικά ψηφία</b> (όχι δεκαδικά)! Γι' αυτό το βιβλίο γράφει πάντα <code>fixed</code> πριν από την setprecision.`; } } }
      const pad = Math.max(0, w - s.length), shown = " ".repeat(pad) + s;
      const parts = [`cout`, w ? `setw(${w})` : null, ty === "d" && fx ? "fixed" : null, ty === "d" && ue ? `setprecision(${p})` : null, lit].filter(Boolean);
      $(".code", box).innerHTML = CPP(`#include <iomanip>   // για setw, setprecision, fixed\n...\n${parts.join(" << ")} << "|";`, { nonum: true });
      $(".ia3scr", box).innerHTML = [...shown, "|"].map(c => `<span class="${c === " " ? "sp" : ""}">${c === " " ? "␣" : cppEsc(c)}</span>`).join("");
      $(".wout", box).innerHTML = `Τυπώνονται <b>${s.length}</b> χαρακτήρες «${cppEsc(s)}»${w ? ` σε πλάτος <b>${w}</b> → <b>${pad}</b> κενά αριστερά (δεξιά στοίχιση)${s.length > w ? " — η τιμή δεν χωρά, άρα τυπώνεται ολόκληρη χωρίς κενά" : ""}` : ""}.<br>${why}${w ? "<br><span class='muted'>Η setw ισχύει μόνο για την <b>αμέσως επόμενη</b> τιμή· οι fixed και setprecision ισχύουν για όλες τις επόμενες.</span>" : ""}`;
    }
    box.querySelectorAll("input,select").forEach(e => e.oninput = e.onchange = draw); draw();
  },

  /* ===== 3.2 Υπολογιστής εκφράσεων C++ ===== */
  ia3expr(box) {
    const EX = ["a / b", "a % b", "float(a) / b", "a / b * b + a % b", "-a / b", "-a % b", "2 + 3 * 4 % 5"].concat(["trunc(-6.5 + pow(2, 2)) + abs(round(-sqrt(67)))", "(a > b) && (b != 0) || !(a == 7)", "sqrt(x * x + 9) / 2", "round(x) >= b || x > 10", "(int)x % b + (float)a / 4", "a % 10 + a / 10 % 10"]);
    box.innerHTML = `<div class="wctl"><label>int a = <input class="a" type="number" value="17" style="width:70px"></label><label>int b = <input class="b" type="number" value="5" style="width:70px"></label><label>double x = <input class="x" type="text" value="4.5" style="width:70px"></label></div>
      <div class="wctl"><label style="flex:1 1 260px">έκφραση <input class="e" type="text" value="a / b * b + a % b" style="flex:1;min-width:0;width:100%;font-family:monospace" spellcheck="false" autocapitalize="off"></label></div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px">${EX.map(e => `<button class="btn ghost ex" style="margin:0;font-family:monospace;font-size:12.5px;padding:4px 8px;line-height:1.3">${cppEsc(e)}</button>`).join("")}</div>
      <div class="code"></div><div class="wout"></div>`;
    function draw() {
      const a = Math.trunc(+$(".a", box).value || 0), b = Math.trunc(+$(".b", box).value || 0), x = parseFloat(($(".x", box).value || "0").replace(",", ".")) || 0, e = $(".e", box).value;
      $(".code", box).innerHTML = CPP(`int a = ${a}, b = ${b};\ndouble x = ${ia3G(x)};\ncout << (${e || "…"});`, { nonum: true });
      let html;
      try { const r = ia3Eval(e, { a: { v: a, t: "i" }, b: { v: b, t: "i" }, x: { v: x, t: "d" } });
        html = `<ol class="ia3steps">${r.steps.map(s => `<li><code>${cppEsc(s.e)}</code> → <b>${cppEsc(s.r)}</b>${s.note ? ` <span class="muted">(${s.note})</span>` : ""}</li>`).join("") || "<li class='muted'>καμία πράξη</li>"}</ol>
          Τύπος αποτελέσματος: <b>${({ i: "int", f: "float", d: "double", b: "bool" })[r.val.t]}</b> · η <code>cout</code> τυπώνει: <span class="ia3big">${cppEsc(r.out)}</span>${r.val.t === "b" ? ' <span class="muted">(true → 1, false → 0)</span>' : ""}`;
      } catch (er) { html = `<span style="color:#DC3545">⚠ ${cppEsc(er.message)}</span> <span class="muted">— επιτρέπονται: a, b, x, αριθμοί, + − * / %, συγκρίσεις, && || !, sqrt abs pow trunc round, float(…) int(…) (float)…</span>`; }
      $(".wout", box).innerHTML = html;
    }
    box.querySelectorAll(".ex").forEach(btn => btn.onclick = () => { $(".e", box).value = btn.textContent; draw(); });
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ===== 3.3 Δομή διακλάδωσης: if / switch βήμα-βήμα ===== */
  ia3branch(box) {
    const P = {
      ins: { code: `char sex;\nint age, asfalistra;\ncin >> sex >> age;\nif (sex == 'M')\n    if (age < 25)\n        asfalistra = 300;\n    else\n        asfalistra = 250;\nelse if (age < 21)\n    asfalistra = 200;\nelse\n    asfalistra = 150;\ncout << "Asfalistra: " << asfalistra;`,
        run(I) { const r = ia3Rec(), sx = String(I.sex || "M").trim().charAt(0) || "M", ag = Math.trunc(I.age); let v = { sex: sx, age: ag }; r.s(3, v);
          const c1 = sx === "M"; r.s(4, v, { d: `'${sx}' == 'M'`, ok: c1 }); let as;
          if (c1) { const c2 = ag < 25; r.s(5, v, { d: `${ag} < 25`, ok: c2 }); as = c2 ? 300 : 250; v.asfalistra = as; r.s(c2 ? 6 : 8, v); }
          else { const c3 = ag < 21; r.s(9, v, { d: `${ag} < 21`, ok: c3 }); as = c3 ? 200 : 150; v.asfalistra = as; r.s(c3 ? 10 : 12, v); }
          r.s(13, v, { out: "Asfalistra: " + as }); return r.st; }, cols: ["sex", "age", "asfalistra"] },
      epid: { code: `int epid;\ncin >> epid;\nif (epid >= 1 && epid <= 3)\n    cout << "METRIA";\nelse if (epid >= 4 && epid <= 7)\n    cout << "KALH";\nelse if (epid >= 8 && epid <= 10)\n    cout << "ARISTH";\nelse\n    cout << "Lanthasmeni timi";`,
        run(I) { const r = ia3Rec(), e = Math.trunc(I.age); const v = { epid: e }; r.s(2, v);
          const tests = [[3, 1, 3, 4, "METRIA"], [5, 4, 7, 6, "KALH"], [7, 8, 10, 8, "ARISTH"]];
          for (const [ln, lo, hi, oln, msg] of tests) { const ok = e >= lo && e <= hi; r.s(ln, v, { d: `${e}>=${lo} && ${e}<=${hi}`, ok }); if (ok) { r.s(oln, v, { out: msg }); return r.st; } }
          r.s(10, v, { out: "Lanthasmeni timi" }); return r.st; }, cols: ["epid"] },
      sw: { code: `int code, qty;\nfloat price = 0, total;\ncin >> code >> qty;\nswitch (code) {\n    case 1:\n        price = 4.0;\n        break;\n    case 2:\n    case 3:\n    case 4:\n        price = 4.5;\n        break;\n    case 5:\n    case 10:\n    case 15:\n        price = 5.0;\n        break;\n    case 7:\n    case 9:\n        price = 2.0;\n        break;\n    case 12:\n        price = 1.5;\n        break;\n    default:\n        cout << "Wrong input" << endl;\n}\ntotal = price * qty;\ncout << fixed << setprecision(2) << total;`,
        run(I) { const r = ia3Rec(), c = Math.trunc(I.age), q = Math.trunc(I.qty); const v = { code: c, qty: q, price: 0 }; r.s(3, v);
          const map = [[[1], 6, 4.0], [[2, 3, 4], 11, 4.5], [[5, 10, 15], 16, 5.0], [[7, 9], 20, 2.0], [[12], 23, 1.5]];
          const hit = map.find(m => m[0].includes(c)); r.s(4, v, { d: `code = ${c}`, ok: !!hit });
          if (hit) { v.price = hit[2]; r.s(hit[1], v); r.s(hit[1] + 1, v); } else r.s(26, v, { out: "Wrong input\n" });
          v.total = Math.fround(Math.fround(v.price) * q); r.s(28, v); r.s(29, v, { out: ia3Fix(v.total, 2) }); return r.st; }, cols: ["code", "qty", "price", "total"] }
    };
    const T = ia3Tracer(box, {
      inputs: [{ k: "prog", label: "πρόγραμμα", type: "sel", v: "ins", opts: [["ins", "ένθετα if (ασφάλιστρα)"], ["epid", "if … else if (επίδοση)"], ["sw", "switch (κωδικός προϊόντος)"]] },
        { k: "sex", label: "sex", type: "text", v: "M", w: 46 }, { k: "age", label: "age / epid / code", v: 23, w: 64 }, { k: "qty", label: "qty", v: 10, w: 56 }],
      code: I => P[I.prog].code, run: I => P[I.prog].run(I), cols: I => P[I.prog].cols,
      note: "Άλλαξε τις τιμές εισόδου και παρακολούθησε ποιες γραμμές εκτελούνται. Στο switch χωρίς break η εκτέλεση «πέφτει» στην επόμενη περίπτωση — γι' αυτό οι case 2, 3, 4 μοιράζονται την ίδια εντολή."
    });
  },

  /* ===== 3.4 Δομές επανάληψης: for / while / do…while βήμα-βήμα ===== */
  ia3loop(box) {
    const cmp = (x, op, y) => op === "<=" ? x <= y : op === "<" ? x < y : op === ">" ? x > y : op === ">=" ? x >= y : x !== y;
    ia3Tracer(box, {
      inputs: [{ k: "kind", label: "βρόχος", type: "sel", v: "for", opts: [["for", "for"], ["while", "while"], ["do", "do … while"]] },
        { k: "a", label: "αρχή i =", v: 1, w: 56 }, { k: "op", label: "συνθήκη i", type: "sel", v: "<=", opts: [["<=", "&lt;="], ["<", "&lt;"], [">=", "&gt;="], [">", "&gt;"], ["!=", "!="]] }, { k: "b", label: "", v: 5, w: 56 },
        { k: "c", label: "βήμα i +=", v: 1, w: 56 }, { k: "acc", label: "πράξη", type: "sel", v: "s+i", opts: [["s+i", "s = s + i"], ["s*i", "s = s * i"], ["s+1", "s = s + 1 (μέτρηση)"], ["s+i*i", "s = s + i*i"]] }],
      code(I) { const s0 = I.acc === "s*i" ? 1 : 0, op = I.op, a = I.a, b = I.b, c = I.c, body = `s = ${I.acc.replace("s", "s ").replace(/([+*])/, " $1 ").replace(/\s+/g, " ").trim()};`;
        const inc = c === 1 ? "i++" : c === -1 ? "i--" : c < 0 ? `i -= ${-c}` : `i += ${c}`;
        if (I.kind === "for") return `int s = ${s0};\nfor (int i = ${a}; i ${op} ${b}; ${inc})\n    ${body}\ncout << s;`;
        if (I.kind === "while") return `int s = ${s0}, i = ${a};\nwhile (i ${op} ${b}) {\n    ${body}\n    ${inc};\n}\ncout << s;`;
        return `int s = ${s0}, i = ${a};\ndo {\n    ${body}\n    ${inc};\n} while (i ${op} ${b});\ncout << s;`; },
      cols: () => ["i", "s"],
      run(I) { const r = ia3Rec(), a = Math.trunc(I.a), b = Math.trunc(I.b), c = Math.trunc(I.c), op = I.op; let s = I.acc === "s*i" ? 1 : 0, i = a, n = 0;
        const f = () => { s = I.acc === "s+i" ? s + i : I.acc === "s*i" ? s * i : I.acc === "s+1" ? s + 1 : s + i * i; };
        if (I.kind === "for") { r.s(1, { s }); r.s(2, { s, i }); while (true) { const ok = cmp(i, op, b); r.s(2, { s, i }, { d: `${i} ${op} ${b}`, ok }); if (!ok) break; f(); r.s(3, { s, i }); if (++n > 60) throw new Error("πάνω από 60 επαναλήψεις — μάλλον ατέρμων βρόχος!"); i += c; } r.s(4, { s, i }, { out: String(s) }); }
        else if (I.kind === "while") { r.s(1, { s, i }); while (true) { const ok = cmp(i, op, b); r.s(2, { s, i }, { d: `${i} ${op} ${b}`, ok }); if (!ok) break; f(); r.s(3, { s, i }); i += c; r.s(4, { s, i }); if (++n > 60) throw new Error("πάνω από 60 επαναλήψεις — μάλλον ατέρμων βρόχος!"); } r.s(6, { s, i }, { out: String(s) }); }
        else { r.s(1, { s, i }); while (true) { f(); r.s(3, { s, i }); i += c; r.s(4, { s, i }); const ok = cmp(i, op, b); r.s(5, { s, i }, { d: `${i} ${op} ${b}`, ok }); if (!ok) break; if (++n > 60) throw new Error("πάνω από 60 επαναλήψεις — μάλλον ατέρμων βρόχος!"); } r.s(6, { s, i }, { out: String(s) }); }
        if (Math.abs(s) > 2147483647) throw new Error("υπερχείλιση int: το s ξεπερνά το INT_MAX");
        return r.st; },
      extra(I, st, el, k, steps) {
        el.innerHTML = `<div class="wout" style="margin:0 0 8px">Επαναλήψεις σώματος: <b>${steps.filter(s => s.ln === 3).length}</b> · ελέγχους συνθήκης: <b>${steps.filter(s => s.d).length}</b>${I.kind === "do" ? " · <span class='muted'>στο do…while ο έλεγχος γίνεται <b>στο τέλος</b>: το σώμα εκτελείται τουλάχιστον μία φορά</span>" : ""}</div>`; },
      note: "Δοκίμασε: ίδιες τιμές με for, while και do…while · αρχή 10, συνθήκη i &lt;= 5 (το for/while δεν εκτελούνται, το do εκτελείται μία φορά) · βήμα αρνητικό με συνθήκη &gt;=."
    });
  },

  /* ===== 3.5 Λογικό διάγραμμα σε εκτέλεση ===== */
  ia3flowrun(box) {
    const F = {
      pow: { label: "X ← X*N μέχρι X ≥ 1000 (do)", cols: ["N", "X", "Y"], inp: "N",
        seq: [{ t: "term", s: "Αρχή", id: "a" }, { t: "io", s: "Διάβασε N", id: "r" }, { t: "proc", s: "X ← 1", id: "x1" }, { t: "proc", s: "Y ← 0", id: "y0" }, { t: "do", c: "X < 1000", id: "c", body: [{ t: "proc", s: "X ← X * N", id: "m" }, { t: "proc", s: "Y ← Y + 1", id: "y" }] }, { t: "io", s: "Τύπωσε Y", id: "p" }, { t: "term", s: "Τέλος", id: "e" }],
        code: `int N, X, Y;\ncin >> N;\nX = 1;\nY = 0;\ndo {\n    X = X * N;\n    Y = Y + 1;\n} while (X < 1000);\ncout << Y;`,
        run(n) { const r = ia3Rec(); let v = { N: n }; const S = (ln, id, ex = {}) => r.s(ln, v, Object.assign({ id }, ex)); S(1, "a"); S(2, "r"); v.X = 1; S(3, "x1"); v.Y = 0; S(4, "y0");
          if (n < 2) throw new Error("δώσε N ≥ 2 (αλλιώς ατέρμων βρόχος)"); let g = 0;
          do { v.X = v.X * n; S(6, "m"); v.Y++; S(7, "y"); const ok = v.X < 1000; S(8, "c", { d: `${v.X} < 1000`, ok }); if (!ok) break; } while (++g < 40);
          S(9, "p", { out: String(v.Y) }); S(9, "e"); return r.st; } },
      odd: { label: "άθροισμα περιττών (while)", cols: ["N", "arithmos", "sum"], inp: "N",
        seq: [{ t: "term", s: "Αρχή", id: "a" }, { t: "io", s: "Διάβασε N", id: "r" }, { t: "proc", s: "sum ← 0", id: "s0" }, { t: "proc", s: "arithmos ← 1", id: "a1" }, { t: "while", c: "arithmos <= N", id: "c", body: [{ t: "proc", s: "sum ← sum + arithmos", id: "add" }, { t: "proc", s: "arithmos ← arithmos + 2", id: "inc" }] }, { t: "io", s: "Τύπωσε sum", id: "p" }, { t: "term", s: "Τέλος", id: "e" }],
        code: `int N, arithmos, sum;\ncin >> N;\nsum = 0;\narithmos = 1;\nwhile (arithmos <= N) {\n    sum = sum + arithmos;\n    arithmos = arithmos + 2;\n}\ncout << sum;`,
        run(n) { const r = ia3Rec(); let v = { N: n }; const S = (ln, id, ex = {}) => r.s(ln, v, Object.assign({ id }, ex)); S(1, "a"); S(2, "r"); v.sum = 0; S(3, "s0"); v.arithmos = 1; S(4, "a1"); let g = 0;
          while (true) { const ok = v.arithmos <= n; S(5, "c", { d: `${v.arithmos} <= ${n}`, ok }); if (!ok) break; v.sum += v.arithmos; S(6, "add"); v.arithmos += 2; S(7, "inc"); if (++g > 40) throw new Error("πάρα πολλές επαναλήψεις — δώσε N ≤ 60"); }
          S(9, "p", { out: String(v.sum) }); S(9, "e"); return r.st; } },
      tax: { label: "φόρος μισθού (if)", cols: ["Salary", "Tax"], inp: "Salary",
        seq: [{ t: "term", s: "Αρχή", id: "a" }, { t: "io", s: "Διάβασε Salary", id: "r" }, { t: "if", c: "Salary > 1000", id: "c", yes: [{ t: "proc", s: "Tax ← Salary * 0.2", id: "t2" }], no: [{ t: "proc", s: "Tax ← Salary * 0.1", id: "t1" }] }, { t: "io", s: "Τύπωσε Tax", id: "p" }, { t: "term", s: "Τέλος", id: "e" }],
        code: `float Salary, Tax;\ncin >> Salary;\nif (Salary > 1000)\n    Tax = Salary * 0.2;\nelse\n    Tax = Salary * 0.1;\ncout << Tax;`,
        run(n) { const r = ia3Rec(); let v = { Salary: n }; const S = (ln, id, ex = {}) => r.s(ln, v, Object.assign({ id }, ex)); S(1, "a"); S(2, "r"); const ok = n > 1000; S(3, "c", { d: `${n} > 1000`, ok });
          v.Tax = Math.fround(Math.fround(n) * (ok ? 0.2 : 0.1)); S(ok ? 4 : 6, ok ? "t2" : "t1"); S(7, "p", { out: ia3G(v.Tax) }); S(7, "e"); return r.st; } }
    };
    ia3Tracer(box, {
      inputs: [{ k: "f", label: "διάγραμμα", type: "sel", v: "pow", opts: Object.entries(F).map(([k, f]) => [k, f.label]) }, { k: "n", label: "τιμή εισόδου", v: 5, w: 74 }],
      code: I => F[I.f].code, cols: I => F[I.f].cols, run: I => F[I.f].run(Math.trunc(I.n)),
      extra(I, st, el) { el.innerHTML = `<div class="ia3flowbox">${ia3FlowSVG(F[I.f].seq, { hl: st ? st.id : null, w: 420 })}</div>`; },
      note: "Το λογικό διάγραμμα και το πρόγραμμα αντιστοιχούν ένα-προς-ένα (ίδιες δομές, ίδιες μεταβλητές). Ο πίνακας είναι η <b>προκαταρκτική εκτέλεση</b>: γράφουμε μόνο τις τιμές που αλλάζουν, τις αποφάσεις με Α/Ψ και την παρουσίαση (οθόνη)."
    });
  },

  /* ===== 3.6 Μονοδιάστατοι πίνακες ===== */
  ia3arr(box) {
    const OPS = {
      sum: { l: "άθροισμα και μέσος όρος", code: `int sum = 0;\nfloat mo;\nfor (int i = 0; i < N; i++)\n    sum = sum + A[i];\nmo = float(sum) / N;\ncout << sum << " " << mo;`, cols: ["i", "A[i]", "sum"] },
      max: { l: "μέγιστο και θέση", code: `int max = A[0], pos = 0;\nfor (int i = 1; i < N; i++)\n    if (A[i] > max) {\n        max = A[i];\n        pos = i;\n    }\ncout << max << " " << pos;`, cols: ["i", "A[i]", "max", "pos"] },
      min: { l: "ελάχιστο και θέση", code: `int min = A[0], pos = 0;\nfor (int i = 1; i < N; i++)\n    if (A[i] < min) {\n        min = A[i];\n        pos = i;\n    }\ncout << min << " " << pos;`, cols: ["i", "A[i]", "min", "pos"] },
      cnt: { l: "μέτρηση: πόσα > k", code: `int count = 0;\nfor (int i = 0; i < N; i++)\n    if (A[i] > k)\n        count++;\ncout << count;`, cols: ["i", "A[i]", "count"] },
      all: { l: "όλες οι θέσεις του μέγιστου", code: `int max = A[0];\nfor (int i = 1; i < N; i++)\n    if (A[i] > max)\n        max = A[i];\nfor (int i = 0; i < N; i++)\n    if (A[i] == max)\n        cout << i << " ";`, cols: ["i", "A[i]", "max"] }
    };
    const parse = s => String(s).split(/[\s,;]+/).filter(Boolean).map(x => Math.trunc(+x)).filter(x => isFinite(x)).slice(0, 12);
    ia3Tracer(box, {
      inputs: [{ k: "op", label: "αλγόριθμος", type: "sel", v: "max", opts: Object.entries(OPS).map(([k, o]) => [k, o.l]) }, { k: "arr", label: "A =", type: "text", v: "3 9 2 9 7 8 1 5", w: 170 }, { k: "k", label: "k =", v: 5, w: 52 }],
      code: I => `const int N = ${parse(I.arr).length};\nint A[N] = {${parse(I.arr).join(", ")}};\n` + OPS[I.op].code, cols: I => OPS[I.op].cols,
      run(I) { const A = parse(I.arr), N = A.length, r = ia3Rec(), op = I.op, k = Math.trunc(I.k); if (!N) throw new Error("δώσε τουλάχιστον έναν αριθμό");
        const S = (ln, v, ex) => r.s(ln + 2, v, ex);
        if (op === "sum") { let sum = 0; S(1, { sum }); for (let i = 0; i < N; i++) { S(3, { i, sum }, { d: `${i} < ${N}`, ok: true, hl: i }); sum += A[i]; S(4, { i, "A[i]": A[i], sum }, { hl: i }); } S(3, { i: N, sum }, { d: `${N} < ${N}`, ok: false }); const mo = Math.fround(Math.fround(sum) / N); S(5, { sum }); S(6, { sum }, { out: sum + " " + ia3G(mo) }); }
        else if (op === "max" || op === "min") { let best = A[0], pos = 0; const nm = op; S(1, { [nm]: best, pos }, { hl: 0, best: 0 });
          for (let i = 1; i < N; i++) { S(2, { i, [nm]: best, pos }, { d: `${i} < ${N}`, ok: true, hl: i, best: pos }); const ok = op === "max" ? A[i] > best : A[i] < best; S(3, { i, "A[i]": A[i] }, { d: `${A[i]} ${op === "max" ? ">" : "<"} ${best}`, ok, hl: i, best: pos }); if (ok) { best = A[i]; S(4, { [nm]: best }, { hl: i, best: pos }); pos = i; S(5, { pos }, { hl: i, best: pos }); } }
          S(2, { i: N }, { d: `${N} < ${N}`, ok: false, best: pos }); S(7, { [nm]: best, pos }, { out: best + " " + pos, best: pos }); }
        else if (op === "cnt") { let c = 0; S(1, { count: c }); for (let i = 0; i < N; i++) { S(2, { i }, { d: `${i} < ${N}`, ok: true, hl: i }); const ok = A[i] > k; S(3, { i, "A[i]": A[i] }, { d: `${A[i]} > ${k}`, ok, hl: i }); if (ok) { c++; S(4, { count: c }, { hl: i, mark: i }); } } S(2, { i: N }, { d: `${N} < ${N}`, ok: false }); S(5, { count: c }, { out: String(c) }); }
        else { let m = A[0]; S(1, { max: m }, { hl: 0 }); for (let i = 1; i < N; i++) { S(2, { i }, { d: `${i} < ${N}`, ok: true, hl: i }); const ok = A[i] > m; S(3, { i, "A[i]": A[i] }, { d: `${A[i]} > ${m}`, ok, hl: i }); if (ok) { m = A[i]; S(4, { max: m }, { hl: i }); } }
          S(2, { i: N }, { d: `${N} < ${N}`, ok: false });
          for (let i = 0; i < N; i++) { S(5, { i }, { d: `${i} < ${N}`, ok: true, hl: i }); const ok = A[i] === m; S(6, { i, "A[i]": A[i] }, { d: `${A[i]} == ${m}`, ok, hl: i }); if (ok) S(7, { i }, { out: i + " ", hl: i, mark: i }); }
          S(5, { i: N }, { d: `${N} < ${N}`, ok: false }); }
        return r.st; },
      extra(I, st, el, k, steps) { const A = parse(I.arr), marks = new Set(steps.slice(0, k + 1).filter(s => s.mark !== undefined).map(s => s.mark));
        el.innerHTML = `<div class="ia3arr">${A.map((x, j) => `<div class="ia3cell${st && st.hl === j ? " cur" : ""}${st && st.best === j ? " best" : ""}${marks.has(j) ? " hit" : ""}">${x}<small>[${j}]</small></div>`).join("")}</div>`; },
      note: "Γράψε δικές σου τιμές (έως 12, χωρισμένες με κενό). Πορτοκαλί: το στοιχείο που εξετάζεται · πράσινο: το τρέχον μέγιστο/ελάχιστο · μπλε: όσα μετρήθηκαν/τυπώθηκαν. Δοκίμασε επαναλαμβανόμενο μέγιστο με &gt; και σκέψου τι θα άλλαζε με &gt;=."
    });
  }
});

/* ===================== ΓΕΝΝΗΤΡΙΕΣ ===================== */
var GENS = Object.assign(window.GENS || {}, {
  /* 3.1 έξοδος με fixed/setprecision/setw */
  ia3fmtg: { title: "Γεννήτρια — μορφοποίηση εξόδου (setw, setprecision)", make() {
    const t = ri(0, 2);
    if (t === 0) { /* fixed setprecision */
      let x, p; do { p = ri(1, 3); x = ri(100, 99999) / 1000 * (ri(0, 4) ? 1 : -1); const tail = Math.abs(x).toFixed(p + 20).slice(Math.abs(x).toFixed(p + 20).indexOf(".") + 1 + p); if (!/^(49|50)/.test(tail)) break; } while (true);
      const ans = ia3Fix(x, p), body = `double x = ${x};\ncout << fixed << setprecision(${p}) << x;`;
      return { q: R`Τι θα εμφανίσει στην οθόνη το πιο κάτω τμήμα προγράμματος;${CPP(body, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans, text: true }],
        hint: R`Με <code>fixed</code>, η <code>setprecision(${p})</code> δίνει ακριβώς ${ia3Dec(p)} με στρογγυλοποίηση.`,
        sol: R`Κρατάμε ${ia3Dec(p)} και στρογγυλοποιούμε με βάση το επόμενο ψηφίο: ${OUT(ans)}`, chk: { src: ia3Prog(body, ["iostream", "iomanip"]) } };
    }
    if (t === 1) { /* ακέραια ή πραγματική διαίρεση με setprecision */
      const a = ri(5, 60), b = ri(2, 9), p = ri(1, 3), cast = ri(0, 1);
      const val = cast ? Math.fround(Math.fround(a) / b) : Math.trunc(a / b), ans = cast ? ia3Fix(val, p) : String(val);
      if (cast && ia3Tie(val, p)) return GENS.ia3fmtg.make();
      const body = `int a = ${a}, b = ${b};\nfloat m;\nm = ${cast ? "float(a) / b" : "a / b"};\ncout << fixed << setprecision(${p}) << m;`;
      if (!cast) { /* m float αλλά η διαίρεση ακέραια → τυπώνει p δεκαδικά μηδενικά */
        const ans2 = ia3Fix(val, p);
        return { q: R`Τι θα εμφανίσει το πιο κάτω τμήμα προγράμματος;${CPP(body, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: ans2, text: true }],
          hint: R`Και οι δύο τελεστέοι της διαίρεσης είναι <code>int</code>.`, sol: R`Η <code>a / b</code> είναι <b>ακέραια διαίρεση</b>: ${a} / ${b} = ${val} (αποκόπτεται το δεκαδικό μέρος). Η τιμή ${val} αποθηκεύεται στη float m και τυπώνεται με ${ia3Dec(p)}: ${OUT(ans2)} Για πραγματική διαίρεση θέλει <code>float(a) / b</code>.`, chk: { src: ia3Prog(body, ["iostream", "iomanip"]) } };
      }
      return { q: R`Τι θα εμφανίσει το πιο κάτω τμήμα προγράμματος;${CPP(body, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans, text: true }],
        hint: R`Η <code>float(a)</code> μετατρέπει τον a σε πραγματικό, άρα η διαίρεση είναι πραγματική.`, sol: R`${a} / ${b} = ${ia3G(a / b, 8)}… → με ${ia3Dec(p)}: ${OUT(ans)}`, chk: { src: ia3Prog(body, ["iostream", "iomanip"]) } };
    }
    const w = ri(4, 10), v = ia3Pick([String(ri(1, 999)), "\"" + ia3Pick(["CY", "C++", "Hello", "abc", "Pi"]) + "\""]), len = v.startsWith("\"") ? v.length - 2 : v.length, sp = Math.max(0, w - len);
    const body = `cout << "[" << setw(${w}) << ${v} << "]";`;
    return { q: R`Πόσα κενά διαστήματα θα εμφανιστούν ανάμεσα στις αγκύλες;${CPP(body, { nonum: true })}`, fields: [{ label: "Κενά:", ans: sp }],
      hint: R`Η <code>setw(${w})</code> δεσμεύει ${w} θέσεις και στοιχίζει την τιμή δεξιά.`, sol: R`Η τιμή ${cppEsc(v)} έχει ${len} χαρακτήρες, άρα συμπληρώνονται $${w} - ${len} = ${sp}$ κενά αριστερά: ${OUT("[" + " ".repeat(sp) + (v.replace(/"/g, "")) + "]")}`, chk: { src: ia3Prog(body, ["iostream", "iomanip"]), count: " " } };
  } },

  /* 3.2 αριθμητικές / λογικές εκφράσεις */
  ia3exprg: { title: "Γεννήτρια — τελεστές και έτοιμες συναρτήσεις", make() {
    const t = ri(0, 3);
    let a = ri(7, 60) * (ri(0, 4) ? 1 : -1), b = ri(2, 9), c = ri(2, 6), d = ri(2, 7), e;
    if (t === 0) e = ia3Pick(["a / b", "a % b", "a / b * b", "a % b + a / c", "a + b * c % d", "(a + b) / c % d", "a / b / c", "a % b * c - d"]);
    else if (t === 1) { a = Math.abs(a); e = ia3Pick(["a / b + float(a) / b", "sqrt(b * b * c * c) + a % c", "pow(b, 2) - a / c", "trunc(float(a) / b) + round(float(a) / c)", "abs(b - a) % d + c", "round(sqrt(a)) + trunc(-a / 4.0)"]); }
    else if (t === 2) e = ia3Pick(["(a > b) && (c < d)", "(a % 2 == 0) || (b > c)", "!(a < b) && (c != d)", "(a > 0) || (b < 0) && (c > d)", "!((a + b) > c) || (d % 2 == 1)", "(b <= c) && !(a % b == 0)"]);
    else { const pre = ri(0, 1); a = ri(2, 9); const body = pre ? `int a = ${a}, b;\nb = ++a * 2;\ncout << a << " " << b;` : `int a = ${a}, b;\nb = a++ * 2;\ncout << a << " " << b;`;
      const ans = pre ? `${a + 1} ${(a + 1) * 2}` : `${a + 1} ${a * 2}`;
      return { q: R`Τι θα εμφανίσει το πιο κάτω τμήμα προγράμματος;${CPP(body, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans, text: true }],
        hint: pre ? R`Πρόθεμα <code>++a</code>: πρώτα αυξάνεται το a και μετά χρησιμοποιείται.` : R`Επίθεμα <code>a++</code>: πρώτα χρησιμοποιείται η παλιά τιμή του a και μετά αυξάνεται.`,
        sol: pre ? R`Το a γίνεται ${a + 1} και μετά b = ${a + 1}·2 = ${(a + 1) * 2}. ${OUT(ans)}` : R`Το b = ${a}·2 = ${a * 2} (παλιά τιμή) και μετά το a γίνεται ${a + 1}. ${OUT(ans)}`, chk: { src: ia3Prog(body) } }; }
    const V = { a: { v: a, t: "i" }, b: { v: b, t: "i" }, c: { v: c, t: "i" }, d: { v: d, t: "i" } }, r = ia3Eval(e, V);
    const body = `int a = ${a}, b = ${b}, c = ${c}, d = ${d};\ncout << ${t === 2 ? "(" + e + ")" : e};`;
    const steps = `<ol class="ia3steps">${r.steps.map(s => `<li><code>${cppEsc(s.e)}</code> → <b>${cppEsc(s.r)}</b>${s.note ? ` <span class="muted">(${s.note})</span>` : ""}</li>`).join("")}</ol>`;
    return { q: R`Τι θα εμφανίσει η <code>cout</code>;${CPP(body, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: r.out, text: true }],
      hint: t === 2 ? R`Η cout τυπώνει μια λογική τιμή ως <b>1</b> (true) ή <b>0</b> (false). Προτεραιότητα: ! → && → ||.` : R`Προτεραιότητα: παρενθέσεις → * / % (αριστερά προς δεξιά) → + −. Η διαίρεση ακεραίων είναι ακέραια.`,
      sol: R`Υπολογισμός με τη σειρά που τον κάνει η C++:${steps}Η <code>cout</code> τυπώνει: ${OUT(r.out)}`, chk: { src: ia3Prog(body, ["iostream", "cmath"]) } };
  } },

  /* 3.3 if / switch */
  ia3ifg: { title: "Γεννήτρια — δομή διακλάδωσης (if, switch)", make() {
    const t = ri(0, 2);
    if (t === 0) { /* if-else if σκάλα */
      const t1 = ri(3, 8) * 5, t2 = t1 + ri(2, 6) * 5, x = ia3Pick([ri(0, t1 - 1), t1, ri(t1 + 1, t2 - 1), t2, ri(t2 + 1, t2 + 30)]), opA = ia3Pick(["<", "<="]);
      const body = `int x = ${x};\nif (x ${opA} ${t1})\n    cout << "LOW";\nelse if (x ${opA} ${t2})\n    cout << "MEDIUM";\nelse\n    cout << "HIGH";`;
      const c1 = opA === "<" ? x < t1 : x <= t1, c2 = opA === "<" ? x < t2 : x <= t2, ans = c1 ? "LOW" : c2 ? "MEDIUM" : "HIGH";
      return { q: R`Τι θα εμφανίσει το πιο κάτω τμήμα προγράμματος;${CPP(body, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans, text: true, cs: true }],
        hint: R`Οι συνθήκες ελέγχονται με τη σειρά· εκτελείται μόνο ο πρώτος κλάδος με αληθή συνθήκη.`,
        sol: R`$${x} ${opA === "<" ? "<" : "\\le"} ${t1}$ → ${c1 ? "Α" : "Ψ"}${c1 ? "" : `, $${x} ${opA === "<" ? "<" : "\\le"} ${t2}$ → ${c2 ? "Α" : "Ψ"}`}. ${OUT(ans)}`, chk: { src: ia3Prog(body) } };
    }
    if (t === 1) { /* switch με/χωρίς break */
      const k = ri(1, 5), br = [ri(0, 1), ri(0, 1), ri(0, 1)];
      const body = `int k = ${k};\nswitch (k) {\n    case 1:\n        cout << "A";\n${br[0] ? "        break;\n" : ""}    case 2:\n        cout << "B";\n${br[1] ? "        break;\n" : ""}    case 3:\n    case 4:\n        cout << "C";\n${br[2] ? "        break;\n" : ""}    default:\n        cout << "D";\n}`;
      const seq = [[1, "A", br[0]], [2, "B", br[1]], [4, "C", br[2]], [9, "D", 1]];
      let start = k === 1 ? 0 : k === 2 ? 1 : (k === 3 || k === 4) ? 2 : 3, out = "";
      for (let j = start; j < 4; j++) { out += seq[j][1]; if (seq[j][2]) break; }
      return { q: R`Τι θα εμφανίσει το πιο κάτω τμήμα προγράμματος;${CPP(body, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: out, text: true, cs: true }],
        hint: R`Η εκτέλεση ξεκινά από την περίπτωση που ταιριάζει και συνεχίζει <b>μέχρι το πρώτο break</b> (ή το τέλος της switch).`,
        sol: R`Για k = ${k} η εκτέλεση ξεκινά από ${start === 3 ? "το <code>default</code>" : `την <code>case ${k}</code>`} και τυπώνει χαρακτήρες μέχρι να συναντήσει <code>break</code>: ${OUT(out)}`, chk: { src: ia3Prog(body) } };
    }
    /* ένθετα if */
    const a = ri(1, 9), b = ri(1, 9), c = ri(1, 9);
    const body = `int a = ${a}, b = ${b}, c = ${c};\nif (a > b)\n    if (a > c)\n        cout << a;\n    else\n        cout << c;\nelse if (b > c)\n    cout << b;\nelse\n    cout << c;`;
    const ans = String(a > b ? (a > c ? a : c) : (b > c ? b : c));
    return { q: R`Τι θα εμφανίσει το πιο κάτω τμήμα προγράμματος;${CPP(body, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans }],
      hint: R`Το else ανήκει στο πλησιέστερο if που δεν έχει ήδη else.`, sol: R`$${a} > ${b}$ → ${a > b ? "Α" : "Ψ"}, ${a > b ? `$${a} > ${c}$ → ${a > c ? "Α" : "Ψ"}` : `$${b} > ${c}$ → ${b > c ? "Α" : "Ψ"}`}. Τυπώνεται: ${OUT(ans)} <span class="muted">(το πρόγραμμα βρίσκει τον μεγαλύτερο από τους τρεις)</span>`, chk: { src: ia3Prog(body) } };
  } },

  /* 3.4 βρόχοι */
  ia3loopg: { title: "Γεννήτρια — δομές επανάληψης", make() {
    const t = ri(0, 3);
    if (t === 0) { const a = ri(0, 5), b = ri(10, 30), c = ri(2, 5), op = ia3Pick(["<", "<="]);
      const body = `int s = 0;\nfor (int i = ${a}; i ${op} ${b}; i += ${c})\n    s = s + i;\ncout << s;`; let s = 0, n = 0, list = []; for (let i = a; op === "<" ? i < b : i <= b; i += c) { s += i; n++; list.push(i); }
      return { q: R`Τι θα εμφανίσει το πιο κάτω τμήμα προγράμματος;${CPP(body, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: s }],
        hint: R`Γράψε τις τιμές που παίρνει το i: ${a}, ${a + c}, ${a + 2 * c}, … όσο ισχύει i ${cppEsc(op)} ${b}.`, sol: R`Το i παίρνει τις τιμές ${list.join(", ")} (${n} επαναλήψεις). s = ${list.join(" + ")} = <b>${s}</b>. ${OUT(String(s))}`, chk: { src: ia3Prog(body) } }; }
    if (t === 1) { const n = ri(20, 400), m = ia3Pick([2, 3]);
      const body = `int x = 1, k = 0;\nwhile (x <= ${n}) {\n    x = x * ${m};\n    k++;\n}\ncout << k << " " << x;`; let x = 1, k = 0; const xs = []; while (x <= n) { x *= m; k++; xs.push(x); }
      return { q: R`Τι θα εμφανίσει το πιο κάτω τμήμα προγράμματος;${CPP(body, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: `${k} ${x}`, text: true }],
        hint: R`Το x πολλαπλασιάζεται με ${m} σε κάθε επανάληψη· σταματά μόλις ξεπεράσει το ${n}.`, sol: R`Τιμές του x: 1 → ${xs.join(" → ")}. Μετά από ${k} επαναλήψεις x = ${x} > ${n}, άρα η συνθήκη γίνεται ψευδής. ${OUT(`${k} ${x}`)}`, chk: { src: ia3Prog(body) } }; }
    if (t === 2) { const n = ri(1000, 99999);
      const body = `int n = ${n}, s = 0;\ndo {\n    s = s + n % 10;\n    n = n / 10;\n} while (n > 0);\ncout << s;`; const s = String(n).split("").reduce((p, d) => p + +d, 0);
      return { q: R`Τι θα εμφανίσει το πιο κάτω τμήμα προγράμματος;${CPP(body, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: s }],
        hint: R`Το <code>n % 10</code> δίνει το τελευταίο ψηφίο και το <code>n / 10</code> το «κόβει».`, sol: R`Ο βρόχος προσθέτει ένα-ένα τα ψηφία του ${n}: ${String(n).split("").reverse().join(" + ")} = <b>${s}</b>. ${OUT(String(s))}`, chk: { src: ia3Prog(body) } }; }
    const r1 = ri(2, 5), r2 = ri(2, 6), inner = ia3Pick(["j <= i", `j <= ${r2}`]);
    const body = `int c = 0;\nfor (int i = 1; i <= ${r1}; i++)\n    for (int j = 1; ${inner}; j++)\n        c++;\ncout << c;`; let c = 0; for (let i = 1; i <= r1; i++) for (let j = 1; inner === "j <= i" ? j <= i : j <= r2; j++) c++;
    return { q: R`Πόσες φορές εκτελείται η εντολή <code>c++</code>, δηλαδή τι θα εμφανιστεί;${CPP(body, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: c }],
      hint: R`Για κάθε τιμή του i, ο εσωτερικός βρόχος εκτελεί όλες τις δικές του επαναλήψεις.`,
      sol: inner === "j <= i" ? R`Για i = 1, 2, …, ${r1} ο εσωτερικός βρόχος κάνει 1, 2, …, ${r1} επαναλήψεις: $1 + 2 + \dots + ${r1} = ${c}$. ${OUT(String(c))}` : R`${r1} επαναλήψεις του εξωτερικού × ${r2} του εσωτερικού $= ${c}$. ${OUT(String(c))}`, chk: { src: ia3Prog(body) } };
  } },

  /* 3.5 λογικό διάγραμμα → αποτέλεσμα */
  ia3flowg: { title: "Γεννήτρια — εκτέλεση λογικού διαγράμματος", make() {
    const t = ri(0, 1);
    if (t === 0) { const N = ri(2, 7), L = ia3Pick([100, 500, 1000, 2000]);
      const fig = ia3Flow([{ t: "term", s: "Αρχή" }, { t: "io", s: "Διάβασε N" }, { t: "proc", s: "X ← 1" }, { t: "proc", s: "Y ← 0" }, { t: "do", c: `X < ${L}`, body: [{ t: "proc", s: "X ← X * N" }, { t: "proc", s: "Y ← Y + 1" }] }, { t: "io", s: "Τύπωσε X, Y" }, { t: "term", s: "Τέλος" }], { w: 300 });
      let X = 1, Y = 0; const xs = []; do { X *= N; Y++; xs.push(X); } while (X < L);
      return { q: R`Δίνεται το λογικό διάγραμμα. Τι θα τυπωθεί για είσοδο <b>N = ${N}</b>; (X και Y με τη σειρά)${fig}`, fields: [{ label: "X =", ans: X }, { label: "Y =", ans: Y }],
        hint: R`Η συνθήκη ελέγχεται <b>μετά</b> το σώμα (δομή do…while). Συνέχισε όσο X &lt; ${L}.`,
        sol: R`Προκαταρκτική εκτέλεση: X = ${xs.join(", ")} και Y = 1, …, ${Y}. Όταν X = ${X} η συνθήκη ${X} &lt; ${L} είναι Ψ. Τυπώνονται X = <b>${X}</b>, Y = <b>${Y}</b>.`,
        chk: { src: ia3Prog(`int N = ${N}, X = 1, Y = 0;\ndo {\n    X = X * N;\n    Y = Y + 1;\n} while (X < ${L});\ncout << X << " " << Y;`), join: true } }; }
    const st = ri(1, 4), inc = ri(1, 3), L = ri(20, 80);
    const fig = ia3Flow([{ t: "term", s: "Αρχή" }, { t: "proc", s: "S ← 0" }, { t: "proc", s: `K ← ${st}` }, { t: "while", c: `S <= ${L}`, body: [{ t: "proc", s: "S ← S + K" }, { t: "proc", s: `K ← K + ${inc}` }] }, { t: "io", s: "Τύπωσε S, K" }, { t: "term", s: "Τέλος" }], { w: 320 });
    let S = 0, K = st; const tr = []; while (S <= L) { S += K; K += inc; tr.push(`(S, K) = (${S}, ${K})`); }
    return { q: R`Δίνεται το λογικό διάγραμμα. Ποιες τιμές θα τυπωθούν; (S και K με τη σειρά)${fig}`, fields: [{ label: "S =", ans: S }, { label: "K =", ans: K }],
      hint: R`Ο έλεγχος S &lt;= ${L} γίνεται <b>πριν</b> από κάθε επανάληψη (δομή while).`, sol: R`Προκαταρκτική εκτέλεση: ${tr.join(" → ")}. Τώρα S = ${S} &gt; ${L}, άρα Ψ και τυπώνονται S = <b>${S}</b>, K = <b>${K}</b>.`,
      chk: { src: ia3Prog(`int S = 0, K = ${st};\nwhile (S <= ${L}) {\n    S = S + K;\n    K = K + ${inc};\n}\ncout << S << " " << K;`), join: true } };
  } },

  /* 3.6 μονοδιάστατοι πίνακες */
  ia3arrg: { title: "Γεννήτρια — μονοδιάστατοι πίνακες", make() {
    const N = ri(6, 8), a = ri(2, 7), b = ri(1, 9), m = ia3Pick([5, 7, 9, 10, 11]), A = []; for (let i = 0; i < N; i++) A.push((i * a + b) % m);
    const fill = `int A[${N}];\nfor (int i = 0; i < ${N}; i++)\n    A[i] = (i * ${a} + ${b}) % ${m};`;
    const t = ri(0, 3); let body, ans, fld, how;
    if (t === 0) { let mx = A[0], pos = 0; for (let i = 1; i < N; i++) if (A[i] > mx) { mx = A[i]; pos = i; }
      body = fill + `\nint max = A[0], pos = 0;\nfor (int i = 1; i < ${N}; i++)\n    if (A[i] > max) {\n        max = A[i];\n        pos = i;\n    }\ncout << max << " " << pos;`; ans = `${mx} ${pos}`; fld = { label: "Έξοδος:", ans, text: true };
      how = R`Πίνακας: [${A.join(", ")}]. Μέγιστο ${mx}, <b>πρώτη</b> εμφάνιση (λόγω του &gt;) στη θέση ${pos}.`; }
    else if (t === 1) { const k = ri(2, m - 2); let c = 0; A.forEach(x => { if (x >= k) c++; });
      body = fill + `\nint count = 0;\nfor (int i = 0; i < ${N}; i++)\n    if (A[i] >= ${k})\n        count++;\ncout << count;`; ans = String(c); fld = { label: "Έξοδος:", ans: c };
      how = R`Πίνακας: [${A.join(", ")}]. Στοιχεία ≥ ${k}: ${A.filter(x => x >= k).join(", ") || "κανένα"} → <b>${c}</b>.`; }
    else if (t === 2) { const B = A.slice(); for (let i = 1; i < N; i++) B[i] = B[i] + B[i - 1];
      body = fill + `\nfor (int i = 1; i < ${N}; i++)\n    A[i] = A[i] + A[i - 1];\nfor (int i = 0; i < ${N}; i++)\n    cout << A[i] << " ";`; ans = B.join(" "); fld = { label: "Έξοδος:", ans, text: true };
      how = R`Αρχικά: [${A.join(", ")}]. Κάθε στοιχείο γίνεται άθροισμα του εαυτού του και του (ήδη ενημερωμένου) προηγούμενου: [${B.join(", ")}].`; }
    else { let s = 0; A.forEach(x => s += x); const p = ri(1, 2), mo = Math.fround(Math.fround(s) / N); if (ia3Tie(mo, p)) return GENS.ia3arrg.make();
      body = fill + `\nint sum = 0;\nfor (int i = 0; i < ${N}; i++)\n    sum = sum + A[i];\ncout << fixed << setprecision(${p}) << float(sum) / ${N};`; ans = ia3Fix(mo, p); fld = { label: "Έξοδος:", ans, text: true };
      how = R`Πίνακας: [${A.join(", ")}], άθροισμα ${s}, μέσος όρος ${s}/${N} → με ${ia3Dec(p)} <b>${ans}</b>.`; }
    return { q: R`Τι θα εμφανίσει το πιο κάτω τμήμα προγράμματος;${CPP(body, { nonum: true })}`, fields: [fld],
      hint: R`Πρώτα γράψε τα στοιχεία του πίνακα: A[i] = (i·${a} + ${b}) % ${m} για i = 0…${N - 1}.`, sol: R`${how} ${OUT(ans)}`, chk: { src: ia3Prog(body, ["iostream", "iomanip"]) } };
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

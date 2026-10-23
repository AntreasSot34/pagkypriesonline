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

/* figures (preloaded before data) for part IBa — Συμβολοσειρές & Αρχεία (prefix ib4) */
/* ib4Boxes("Hello", {ascii:true, hl:[0,1], name:"test", hlc:"green"}) → «κουτάκια» χαρακτήρων με δείκτες θέσης */
function ib4Boxes(str, o = {}) {
  const hl = new Set(o.hl || []), col = { blue: "#0F6FD1", green: "#198754", amber: "#C77A0A", purple: "#6F42C1", red: "#DC3545" }[o.hlc || "blue"];
  const cells = [...String(str)].map((ch, i) => {
    const on = hl.has(i);
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;min-width:34px">
      <div style="width:34px;height:38px;display:flex;align-items:center;justify-content:center;border:2px solid ${on ? col : "#c7d3e6"};background:${on ? col + "1f" : "#fff"};border-radius:8px;font:700 18px 'SF Mono',Consolas,Menlo,monospace;color:${on ? col : "#15233f"}">${ch === " " ? "␣" : cppEsc(ch)}</div>
      <div style="font:600 11.5px 'IBM Plex Mono',ui-monospace,monospace;color:${on ? col : "#5b6b86"}">[${i}]</div>
      ${o.ascii ? `<div style="font:600 11px 'IBM Plex Mono',ui-monospace,monospace;color:#8a97ad">${ch.charCodeAt(0)}</div>` : ""}</div>`;
  }).join("");
  return `<figure class="grfig" style="margin:12px 0"><div style="display:flex;flex-wrap:wrap;gap:4px;align-items:flex-start;justify-content:center;padding:10px;background:#f5f8fd;border:1px solid #dce3ef;border-radius:12px">
    ${o.name ? `<div style="align-self:center;font:700 14px 'SF Mono',Consolas,Menlo,monospace;color:#1B2A4A;margin-right:6px">${cppEsc(o.name)} =</div>` : ""}${cells}</div>${o.caption ? `<figcaption>${o.caption}</figcaption>` : ""}</figure>`;
}
/* ib4Flow(): σχήμα «πρόγραμμα ↔ αρχεία» για τη θεωρία των αρχείων */
function ib4Flow(inName = "input.txt", outName = "output.txt", inTxt = "12 30", outTxt = "42", app) {
  const box = (x, y, w, h, fill, stroke) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
  const t = (x, y, s, c = "#15233f", fs = 14, w = 700, fam = "SF Mono,Consolas,Menlo,monospace") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="${fam}" font-size="${fs}" font-weight="${w}" fill="${c}">${cppEsc(s)}</text>`;
  const arr = (x1, x2, y, c) => `<line x1="${x1}" y1="${y}" x2="${x2 - 8}" y2="${y}" stroke="${c}" stroke-width="3"/><path d="M${x2},${y}L${x2 - 11},${y - 6}L${x2 - 11},${y + 6}Z" fill="${c}"/>`;
  return `<figure class="grfig"><svg viewBox="0 0 560 150" style="width:100%;max-width:560px;height:auto" role="img" aria-label="Ροή δεδομένων από αρχείο εισόδου στο πρόγραμμα και από το πρόγραμμα σε αρχείο εξόδου">
    ${box(8, 30, 140, 90, "#fff", "#0F6FD1")}<path d="M128,30 L148,50 L128,50Z" fill="#dbe9fb"/>${t(78, 22, inName, "#0F6FD1", 13)}${t(78, 82, inTxt, "#15233f", 15)}
    ${box(210, 40, 140, 70, "#0f1a2e", "#0f1a2e")}${t(280, 70, "πρόγραμμα", "#e6edf7", 13, 700, "Commissioner,system-ui,sans-serif")}${t(280, 92, "C++", "#82aaff", 13)}
    ${box(412, 30, 140, 90, "#fff", "#198754")}<path d="M532,30 L552,50 L532,50Z" fill="#d7f0e1"/>${t(482, 22, outName, "#198754", 13)}${t(482, 82, outTxt, "#15233f", 15)}
    ${arr(150, 208, 75, "#0F6FD1")}${arr(352, 410, 75, "#198754")}
    ${t(179, 140, "ifstream fin >>", "#0F6FD1", 12)}${t(381, 140, app ? "ofstream (app) <<" : "ofstream fout <<", "#198754", 12)}
  </svg></figure>`;
}

/* figures (preloaded before data) for part IBb — Συναρτήσεις & Στοίβα/Ουρά (prefix ib6) */
const ib6E = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const IB6C = { main: "#0F6FD1", fn: "#6F42C1", glob: "#198754", ref: "#C77A0A", red: "#DC3545" };
/* Ένα «πλαίσιο μνήμης»: title, color, vars: [[όνομα, τιμή, ετικέτα?]] — τιμή που ξεκινά με "→" σχεδιάζεται ως αναφορά */
function ib6Box(f) {
  const c = IB6C[f.c] || f.c || IB6C.main;
  const rows = (f.vars || []).map(([n, v, tag, hot]) => {
    const isRef = /^→/.test(String(v)), cells = Array.isArray(v);
    const val = cells ? `<span style="display:inline-flex;gap:2px;flex-wrap:wrap">${v.map((x, i) => `<span style="display:inline-flex;flex-direction:column;align-items:center;min-width:26px"><b style="border:1.5px solid ${c};border-radius:5px;padding:1px 5px;background:#fff">${ib6E(x)}</b><small style="color:#7a879c;font-size:10px">${i}</small></span>`).join("")}</span>`
      : `<b style="font-family:'SF Mono',Consolas,monospace;${isRef ? `color:${IB6C.ref}` : ""}">${ib6E(v)}</b>`;
    return `<div style="display:flex;align-items:center;gap:8px;padding:3px 4px;border-bottom:1px dashed #e3e8f1;${hot ? "background:#fff1d6;border-radius:6px;" : ""}"><code style="background:none;padding:0;color:#15233f;font-weight:700">${ib6E(n)}</code>${tag ? `<small style="color:#7a879c">${ib6E(tag)}</small>` : ""}<span style="margin-left:auto">${val}</span></div>`;
  }).join("") || `<div style="color:#7a879c;font-size:13px">(καμία μεταβλητή)</div>`;
  return `<div style="flex:1 1 170px;min-width:0;max-width:100%;border:2px solid ${c};border-radius:12px;background:#fff;overflow:hidden"><div style="background:${c};color:#fff;font-weight:800;font-size:12.5px;padding:4px 10px;letter-spacing:.02em">${ib6E(f.t)}</div><div style="padding:6px 10px;font-size:14px">${rows}</div></div>`;
}
/* ib6Mem([frames], caption) → στατικό σχήμα μνήμης για τη θεωρία */
function ib6Mem(frames, caption) {
  return `<figure class="grfig" style="margin:12px 0"><div style="display:flex;flex-wrap:wrap;gap:10px;align-items:stretch">${frames.map(ib6Box).join("")}</div>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
}
/* ib6Trace(headers, rows) → πίνακας προκαταρκτικής εκτέλεσης */
function ib6Trace(hd, rows, cap) {
  return `${cap ? `<p class="small muted" style="margin:8px 0 2px"><b>${cap}</b></p>` : ""}<table class="tbl"><tr>${hd.map(h => `<th>${h}</th>`).join("")}</tr>${rows.map(r => `<tr>${r.map(x => `<td>${x === "" || x == null ? "" : x}</td>`).join("")}</tr>`).join("")}</table>`;
}
/* ib6Stack(items, opts) → σχήμα στοίβας (κάτω→πάνω) ή ουράς (αριστερά→δεξιά) */
function ib6DS(items, o = {}) {
  const q = o.queue, c = q ? IB6C.main : IB6C.fn;
  const cells = items.map((x, i) => `<div style="min-width:40px;height:34px;display:flex;align-items:center;justify-content:center;border:2px solid ${c};border-radius:7px;background:${(q ? i === 0 : i === items.length - 1) ? "#fff4df" : "#fff"};font-weight:800;font-family:'SF Mono',Consolas,monospace">${ib6E(x)}</div>`);
  const box = q ? `<div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap"><small style="color:${IB6C.ref};font-weight:800">front →</small>${cells.join("")}<small style="color:${IB6C.ref};font-weight:800">← back</small></div>`
    : `<div style="display:inline-flex;flex-direction:column-reverse;gap:4px;border:2px solid #cbd5e1;border-top:0;border-radius:0 0 10px 10px;padding:6px">${cells.join("")}</div>`;
  return `<div style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;margin:4px 8px;vertical-align:bottom">${box}${o.label ? `<small style="font-weight:700;color:#15233f;text-align:center">${o.label}</small>` : ""}</div>`;
}
function ib6DSrow(list, cap) { return `<figure class="grfig" style="margin:12px 0"><div style="display:flex;flex-wrap:wrap;align-items:flex-end;gap:4px">${list.join("")}</div>${cap ? `<figcaption>${cap}</figcaption>` : ""}</figure>`; }

/* figures (preloaded before data) for part IBc — Γ7.5 Αναζήτηση, Γ7.6 Ταξινόμηση (prefix ib7) */
(function () {
  if (document.getElementById("ib7css")) return;
  const st = document.createElement("style"); st.id = "ib7css";
  st.textContent = `
.ib7arr{display:flex;flex-wrap:wrap;gap:4px;margin:10px 0 4px;align-items:flex-end}
.ib7c{display:flex;flex-direction:column;align-items:center;min-width:34px}
.ib7v{min-width:34px;height:34px;padding:0 4px;display:flex;align-items:center;justify-content:center;border:2px solid #c9d5ea;border-radius:8px;background:#fff;font:700 14px "SF Mono",Consolas,Menlo,monospace;color:#15233f;transition:background .25s,border-color .25s,transform .25s}
.ib7i{font:600 10.5px "SF Mono",Consolas,monospace;color:#7a8aa6;margin-top:2px}
.ib7t{font:800 10.5px var(--sans,system-ui);height:14px;line-height:14px;white-space:nowrap}
.ib7v.cmp{background:#fff4dc;border-color:#C77A0A}
.ib7v.hit{background:#dff5e8;border-color:#198754;color:#0d5a35}
.ib7v.mid{background:#ece4fb;border-color:#6F42C1}
.ib7v.sw{background:#fde3e6;border-color:#DC3545;transform:translateY(-3px)}
.ib7v.ok{background:#e7f0fd;border-color:#0F6FD1;color:#0b4f97}
.ib7v.dim{opacity:.32}
.ib7v.tmp{background:#fff4dc;border-color:#C77A0A;border-style:dashed}
.ib7cap{font-size:13px;color:#5b6b86;margin:2px 0 8px}
.ib7leg{display:flex;flex-wrap:wrap;gap:10px;font-size:12.5px;color:#5b6b86;margin:4px 0}
.ib7leg span::before{content:"";display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:5px;vertical-align:-1px;border:2px solid var(--b);background:var(--f)}
.ib7stats{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.ib7stats b{display:inline-block;background:#f5f8fd;border:1px solid #dce3ef;border-radius:10px;padding:4px 10px;font-size:13px;font-weight:700;color:#1B2A4A}
.ib7stats b i{font-style:normal;color:#0F6FD1;font-family:"SF Mono",Consolas,monospace}
.ib7log{max-height:210px;overflow:auto;background:#f8fafd;border:1px solid #dce3ef;border-radius:10px;padding:8px 10px;font:12.5px/1.55 "SF Mono",Consolas,Menlo,monospace;color:#15233f;margin-top:8px}
.ib7log div.on{background:#e7f0fd;border-radius:4px}
.ib7msg{min-height:1.6em;font-size:14px;margin:6px 0}
.ib7wrap{container-type:inline-size}
.ib7two{display:grid;grid-template-columns:minmax(0,1fr);gap:12px}
@container (min-width:760px){.ib7two{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}}
.ib7tw{overflow-x:auto;max-width:100%}
.ib7bars{display:flex;align-items:flex-end;gap:3px;height:120px;margin:8px 0;border-bottom:2px solid #dce3ef;padding:0 2px}
.ib7bars div{flex:1;background:#0F6FD1;border-radius:3px 3px 0 0;min-width:2px;transition:height .2s,background .2s}
`;
  document.head.appendChild(st);
})();
/* ib7Arr([5,6,2], {cls:{1:"cmp",3:"hit"}, tags:{0:["first","#0F6FD1"]}, cap:"…", from:0, noidx:false})
   → HTML πίνακα με κελιά, δείκτες θέσεων και ετικέτες (first/mid/last, i, j …) */
function ib7Arr(a, o = {}) {
  const cls = o.cls || {}, tags = o.tags || {}, dim = o.dim || [];
  return `<div class="ib7arr">${a.map((v, k) => {
    const t = tags[k]; const d = dim.length === 2 && (k < dim[0] || k > dim[1]);
    return `<div class="ib7c"><span class="ib7t" style="color:${t ? t[1] || "#6F42C1" : "inherit"}">${t ? t[0] : "&nbsp;"}</span><span class="ib7v ${cls[k] || ""}${d ? " dim" : ""}">${v}</span>${o.noidx ? "" : `<span class="ib7i">${k}</span>`}</div>`;
  }).join("")}</div>${o.cap ? `<div class="ib7cap">${o.cap}</div>` : ""}`;
}
/* υπόμνημα χρωμάτων */
function ib7Leg(items) { return `<div class="ib7leg">${items.map(([t, f, b]) => `<span style="--f:${f};--b:${b}">${t}</span>`).join("")}</div>`; }
const IB7L = { cmp: ["σύγκριση", "#fff4dc", "#C77A0A"], hit: ["βρέθηκε / στη θέση του", "#dff5e8", "#198754"], mid: ["mid", "#ece4fb", "#6F42C1"], sw: ["αντιμετάθεση", "#fde3e6", "#DC3545"], ok: ["ταξινομημένο τμήμα", "#e7f0fd", "#0F6FD1"], dim: ["εκτός διαστήματος", "#fff", "#c9d5ea"] };

/* ---------- μηχανές (κοινές για θεωρία, widgets, γεννήτριες) — πιστές στον κώδικα του βιβλίου ---------- */
/* bubble sort με λογική μεταβλητή sorted. opt=true → βελτιστοποίηση με S--. desc → φθίνουσα.
   Επιστρέφει {passes:[πίνακας μετά από κάθε διάσχιση], comps, swaps, events:[{a,i,j,swap,pass}]} */
function ib7Bubble(arr, opt = false, desc = false) {
  const a = arr.slice(), N = a.length, passes = [], ev = []; let comps = 0, swaps = 0, S = N, sorted, p = 0;
  do {
    sorted = true; p++;
    for (let i = 0; i < (opt ? S : N) - 1; i++) {
      comps++; const sw = desc ? a[i] < a[i + 1] : a[i] > a[i + 1];
      if (sw) { const t = a[i]; a[i] = a[i + 1]; a[i + 1] = t; sorted = false; swaps++; }
      ev.push({ a: a.slice(), i, j: i + 1, swap: sw, pass: p, S });
    }
    if (opt) S--;
    passes.push(a.slice());
  } while (!sorted);
  return { passes, comps, swaps, events: ev, sorted: a };
}
/* «εναλλακτική προσέγγιση» του βιβλίου: δύο βρόχοι for, σύγκριση arr[i] με arr[j], j>i */
function ib7Bubble2(arr, desc = false) {
  const a = arr.slice(), N = a.length, passes = [], ev = []; let comps = 0, swaps = 0;
  for (let i = 0; i < N - 1; i++) {
    for (let j = i + 1; j < N; j++) {
      comps++; const sw = desc ? a[i] < a[j] : a[i] > a[j];
      if (sw) { const t = a[i]; a[i] = a[j]; a[j] = t; swaps++; }
      ev.push({ a: a.slice(), i, j, swap: sw, pass: i + 1 });
    }
    passes.push(a.slice());
  }
  return { passes, comps, swaps, events: ev, sorted: a };
}
/* insertion sort του βιβλίου. Επιστρέφει {steps:[πίνακας μετά από κάθε i], comps (arr[j]>temp που αποτιμήθηκαν), shifts, events} */
function ib7Insert(arr, desc = false) {
  const a = arr.slice(), N = a.length, steps = [], ev = []; let comps = 0, shifts = 0;
  for (let i = 1; i < N; i++) {
    const temp = a[i]; let j = i - 1;
    ev.push({ a: a.slice(), i, j, temp, kind: "take" });
    while (j >= 0) {
      comps++; const go = desc ? a[j] < temp : a[j] > temp;
      if (!go) { ev.push({ a: a.slice(), i, j, temp, kind: "stop" }); break; }
      a[j + 1] = a[j]; shifts++; ev.push({ a: a.slice(), i, j, temp, kind: "shift" }); j--;
    }
    a[j + 1] = temp; ev.push({ a: a.slice(), i, j: j + 1, temp, kind: "put" });
    steps.push(a.slice());
  }
  return { steps, comps, shifts, events: ev, sorted: a };
}
/* δυαδική αναζήτηση του βιβλίου (int binary_search). desc: πίνακας σε φθίνουσα σειρά */
function ib7Bin(a, target, desc = false) {
  let first = 0, last = a.length - 1; const st = [];
  while (first <= last) {
    const mid = Math.floor((first + last) / 2); const rec = { first, last, mid, v: a[mid] }; st.push(rec);
    if (target === a[mid]) return { pos: mid, steps: st, first, last };
    else if (desc ? target > a[mid] : target < a[mid]) last = mid - 1;
    else first = mid + 1;
  }
  return { pos: -1, steps: st, first, last };
}
/* binary_search_first του βιβλίου (με pos) */
function ib7BinFirst(a, target) {
  let first = 0, last = a.length - 1, pos = -1; const st = [];
  while (first <= last) {
    const mid = Math.floor((first + last) / 2); st.push({ first, last, mid, v: a[mid] });
    if (a[mid] === target) { pos = mid; last = mid - 1; }
    else if (target < a[mid]) last = mid - 1; else first = mid + 1;
  }
  return { pos, steps: st };
}

/* figures (preloaded before data) for part IBd — Γ7.7 Δισδιάστατοι πίνακες, Γ7.8 Εγγραφές (prefix ib9) */
(function () {
  const css = `
.ib9m{display:inline-block;max-width:100%;overflow-x:auto;vertical-align:top;margin:8px 0}
.ib9m table{border-collapse:separate;border-spacing:4px;font:600 14px "SF Mono",Consolas,Menlo,monospace}
.ib9m td{min-width:38px;height:34px;padding:2px 6px;text-align:center;border-radius:8px;background:#eef3fb;color:#1B2A4A;border:1px solid #dce3ef;transition:background .2s,transform .2s}
.ib9m th{font:700 11px "IBM Plex Mono",ui-monospace,monospace;color:#5b6b86;padding:0 4px}
.ib9m td.hb{background:#0F6FD1;color:#fff;border-color:#0F6FD1}
.ib9m td.hg{background:#198754;color:#fff;border-color:#198754}
.ib9m td.ha{background:#C77A0A;color:#fff;border-color:#C77A0A}
.ib9m td.hp{background:#6F42C1;color:#fff;border-color:#6F42C1}
.ib9m td.hl{background:#dbe9fb;border-color:#9cc3ef}
.ib9m td.hr{background:#DC3545;color:#fff;border-color:#DC3545}
.ib9m td.cur{outline:3px solid #54EFA2;transform:scale(1.06)}
.ib9m td.dim{opacity:.35}
.ib9m td.sum{background:#fdf6e9;color:#8a5306;border:1px dashed #C77A0A}
.ib9m caption{caption-side:bottom;font:500 12.5px var(--sans,system-ui);color:#5b6b86;padding-top:4px;text-align:left}
.ib9leg{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:13px;color:#5b6b86;margin:4px 0}
.ib9leg i{display:inline-block;width:13px;height:13px;border-radius:4px;vertical-align:-2px;margin-right:5px}
.ib9rec{display:flex;flex-wrap:wrap;gap:10px;margin:8px 0}
.ib9card{border:2px solid #6F42C1;border-radius:12px;overflow:hidden;min-width:150px;max-width:100%;background:#fff;font-size:13.5px}
.ib9card .h{background:#6F42C1;color:#fff;font:700 12.5px "SF Mono",Consolas,Menlo,monospace;padding:5px 10px}
.ib9card .r{display:flex;justify-content:space-between;gap:12px;padding:4px 10px;border-top:1px solid #ece6f8}
.ib9card .r b{font:600 12.5px "SF Mono",Consolas,Menlo,monospace;color:#6F42C1}
.ib9card .r span{font-family:"SF Mono",Consolas,Menlo,monospace;color:#1B2A4A;overflow-wrap:anywhere}
.ib9card .nest{margin:4px 8px 8px;border:2px dashed #0F6FD1;border-radius:9px}
.ib9card .nest .h{background:#0F6FD1}
.ib9card.on{box-shadow:0 0 0 3px #54EFA2}
.ib9card.mv{border-color:#C77A0A}.ib9card.mv .h{background:#C77A0A}
`;
  try { const st = document.createElement("style"); st.textContent = css; (document.head || document.documentElement).appendChild(st); } catch (e) {}
})();
/* ib9Mat(M, {cls:(i,j)=>"hb"|"", idx:true, name:"a", cap:"…", rowx:[…] (επιπλέον στήλη), colx:[…] (επιπλέον γραμμή)}) → HTML πλέγμα πίνακα με δείκτες */
function ib9Mat(M, o = {}) {
  const n = M.length, m = M[0].length, cls = o.cls || (() => ""), idx = o.idx !== false;
  let h = `<div class="ib9m"><table>`;
  if (o.cap) h += `<caption>${o.cap}</caption>`;
  if (idx) h += `<tr><th></th>${M[0].map((_, j) => `<th>j=${j}</th>`).join("")}${o.rowx ? `<th>${o.rowxh || ""}</th>` : ""}</tr>`;
  for (let i = 0; i < n; i++) {
    h += `<tr>${idx ? `<th>i=${i}</th>` : ""}`;
    for (let j = 0; j < m; j++) { const c = cls(i, j); h += `<td${c ? ` class="${c}"` : ""}${o.tip ? ` title="${o.name || "a"}[${i}][${j}]"` : ""}>${M[i][j]}</td>`; }
    if (o.rowx) h += `<td class="sum">${o.rowx[i]}</td>`;
    h += `</tr>`;
  }
  if (o.colx) h += `<tr>${idx ? `<th>${o.colxh || ""}</th>` : ""}${o.colx.map(v => `<td class="sum">${v}</td>`).join("")}${o.rowx ? "<th></th>" : ""}</tr>`;
  return h + `</table></div>`;
}
/* πλέγμα με ονόματα στοιχείων [i][j] (χωρίς τιμές) */
function ib9Idx(n, m, cls, cap) { const M = []; for (let i = 0; i < n; i++) { M.push([]); for (let j = 0; j < m; j++) M[i].push(`[${i}][${j}]`); } return ib9Mat(M, { cls, idx: false, cap }); }
function ib9Leg(items) { return `<div class="ib9leg">${items.map(([c, t]) => `<span><i style="background:${c}"></i>${t}</span>`).join("")}</div>`; }
/* ib9Card("apple", [["code","101"],["price","1.99"], ["dob", [["dd","5"],["mm","9"]], "date"]], "product") → καρτέλα εγγραφής */
function ib9Card(name, rows, type, cls) {
  const body = rows.map(r => Array.isArray(r[1]) ? `<div class="nest"><div class="h">${r[0]} : ${r[2] || ""}</div>${r[1].map(q => `<div class="r"><b>.${q[0]}</b><span>${q[1]}</span></div>`).join("")}</div>` : `<div class="r"><b>.${r[0]}</b><span>${r[1]}</span></div>`).join("");
  return `<div class="ib9card${cls ? " " + cls : ""}"><div class="h">${name}${type ? " : " + type : ""}</div>${body}</div>`;
}

const R = String.raw;
const CONFIG = {
  storeKey: "pagk-pliroforiki-g-b-v1",
  heroTitle: "Πληροφορική Γ΄ Λυκείου — Παγκύπριες (Μέρος Β)",
  tefxos: "Μέρος Β",
  widgetLabel: "διαδραστικό εργαλείο",
  heroLead: "Συμβολοσειρές, αρχεία, συναρτήσεις, αναζήτηση, ταξινόμηση, δισδιάστατοι πίνακες και εγγραφές σε C++ — με θεωρία, εκτέλεση βήμα-βήμα, λυμένες ασκήσεις και quiz για τις Παγκύπριες Εξετάσεις «Πληροφορική και Επιστήμη Η/Υ».",
  howto: `<ul><li>Αριθμοί: <code>12</code> · δεκαδικοί: <code>2,5</code> ή <code>2.5</code></li>
    <li>Κείμενο / έξοδος προγράμματος: γράψε ακριβώς ό,τι εμφανίζεται, π.χ. <code>3 1 2</code> ή <code>HELLO</code> (τα πολλαπλά κενά δεν μετρούν).</li>
    <li>Πολλά πεδία; Γράψε κάθε απάντηση στο δικό της πεδίο, με τη σειρά που ζητείται.</li>
    <li>Ύλη: Παγκύπριες Εξετάσεις 2025-2026, «Πληροφορική και Επιστήμη Ηλεκτρονικών Υπολογιστών» (βιβλίο Γ΄ Λυκείου ΥΠΑΝ).</li></ul>`
};

const UNITS = [
  { id: 4, title: "Γ7.2 · Συμβολοσειρές (strings)" },
  { id: 5, title: "Γ7.3 · Αρχεία (files)" },
  { id: 6, title: "Γ7.4 · Συναρτήσεις (functions)" },
  { id: 7, title: "Γ7.5 · Αλγόριθμοι αναζήτησης" },
  { id: 8, title: "Γ7.6 · Αλγόριθμοι ταξινόμησης" },
  { id: 9, title: "Γ7.7 · Δισδιάστατοι πίνακες (2D)" },
  { id: 10, title: "Γ7.8 · Εγγραφές (structs)" },
  { id: 11, title: "Γ7.9 · Στοίβα και ουρά (εκτός εξεταστέας ύλης)" }
];

const SECTIONS = [
/* ───────────────────────────── 4.1 ───────────────────────────── */
{
  id: "4.1", unit: 4, title: "Συμβολοσειρές (strings) στη C++: δήλωση, θέσεις χαρακτήρων και συνένωση",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.2 §1–2 Δήλωση και χρήση συμβολοσειράς (σ. 109–110)",
  intro: "Τι είναι μια συμβολοσειρά (string) στη C++, πώς τη δηλώνουμε και πώς διαβάζουμε ή αλλάζουμε τον χαρακτήρα σε κάθε θέση της;",
  thumb: ICON("\"str\"", "green"),
  theory: R`
<p>Η <b>συμβολοσειρά (string)</b> είναι μια ακολουθία χαρακτήρων: ένα όνομα, μια λέξη, ένας κωδικός, μια ολόκληρη φράση. Στη C++ δεν υπάρχει «βασικός» τύπος δεδομένων για συμβολοσειρές, όπως ο <code>int</code> ή ο <code>char</code>· η συμβολοσειρά δηλώνεται ως <b>αντικείμενο</b> της βιβλιοθήκης <code>&lt;string&gt;</code>. Επειδή είναι αντικείμενο, έχει <b>έτοιμες συναρτήσεις</b> (π.χ. <code>size()</code>) και μπορούμε να τη χειριστούμε <b>σαν πίνακα χαρακτήρων</b>. Οι συμβολοσειρές C++ εμφανίζονται σε σχεδόν κάθε θέμα των Παγκυπρίων Πληροφορικής — από «τι θα τυπώσει» μέχρι κρυπτογράφηση και μετρητές χαρακτήρων.</p>
<div class="tbox def"><h4>Δήλωση συμβολοσειράς στη C++</h4>
<p>Δηλώνουμε μια συμβολοσειρά όπως μια μεταβλητή, με το αναγνωριστικό <code>string</code>. <b>Απαραίτητη</b> είναι η βιβλιοθήκη <code>#include&lt;string&gt;</code>. Μπορούμε να δώσουμε <b>αρχική τιμή</b> κατά τη δήλωση και να χρησιμοποιήσουμε τη συμβολοσειρά σε συνθήκες με <code>==</code> και <code>!=</code>.</p>
${CPP(R`
#include<iostream>
#include<string>
using namespace std;
int main(){
    string color;
    cin >> color;
    if(color=="red" || color=="yellow" || color=="blue")
        cout << "Primary";
    else
        cout << "Not Primary";
return 0;
}`, { title: "C7_2_example1.cpp", hl: [2, 5, 7] })}
<p>Με είσοδο <code>green</code> το πρόγραμμα εμφανίζει:</p>${OUT(`Not Primary`)}
</div>
<div class="tbox warn"><h4>Διπλά ή μονά εισαγωγικά;</h4>
<p>Οι <b>συμβολοσειρές</b> γράφονται με <b>διπλά εισαγωγικά</b>: <code>"Hello"</code>. Οι <b>χαρακτήρες</b> (τύπος <code>char</code>) με <b>μονά</b>: <code>'H'</code>. Η δήλωση <code>char c = "A";</code> είναι λάθος, ενώ η <code>string s = "A";</code> είναι σωστή (συμβολοσειρά με έναν χαρακτήρα).</p></div>
<div class="tbox def"><h4>Η συμβολοσειρά ως πίνακας χαρακτήρων — θέσεις (δείκτες)</h4>
<p>Κάθε χαρακτήρας της συμβολοσειράς έχει μια <b>θέση (δείκτη)</b>. Όπως και στους πίνακες, <b>ο πρώτος χαρακτήρας βρίσκεται στη θέση 0</b>, ο δεύτερος στη θέση 1 κ.ο.κ. Ο τελευταίος βρίσκεται στη θέση <code>s.size()-1</code>. Η έκφραση <code>s[i]</code> είναι ένας χαρακτήρας (<code>char</code>): μπορούμε να τον εμφανίσουμε, να τον συγκρίνουμε ή να τον αλλάξουμε.</p>
${ib4Boxes("Hello", { name: "test", hl: [0, 1], caption: "Η συμβολοσειρά test = \"Hello\": η εντολή cout &lt;&lt; test[0] &lt;&lt; test[1]; τυπώνει He." })}
${CPP(R`
string test = "Hello";
cout << test[0] << test[1];     // Τυπώνει τους χαρακτήρες He`, { nonum: true })}
</div>
<div class="tbox def"><h4>Συνένωση συμβολοσειρών με + και +=</h4>
<p>Ο τελεστής <code>+</code> <b>ενώνει</b> (συνενώνει) δύο συμβολοσειρές, ενώ ο <code>+=</code> προσθέτει στο <b>τέλος</b> μιας συμβολοσειράς μια άλλη συμβολοσειρά ή <b>έναν χαρακτήρα</b> — π.χ. <code>st2 += st1[i];</code>, τεχνική που χρησιμοποιεί συχνά το βιβλίο για να «χτίσει» νέα συμβολοσειρά.</p>
${CPP(R`
string a = "Pagk", b = "ypries";
string c = a + b;        // "Pagkypries"
c += '!';                // "Pagkypries!"
cout << c << " " << c.size();`, { nonum: true })}
${OUT(`Pagkypries! 11`)}
</div>
<div class="tbox ex"><h4>Αλλαγή χαρακτήρα και τελευταίος χαρακτήρας</h4>
${CPP(R`
string s = "KYPROS";
s[0] = 'C';
cout << s << " " << s[s.size()-1];`, { nonum: true })}
<details class="steps"><summary>Λύση βήμα-βήμα</summary>
<p>Η εντολή <code>s[0] = 'C';</code> αντικαθιστά τον χαρακτήρα της θέσης 0 (το K) με C, άρα <code>s = "CYPROS"</code>. Το <code>s.size()</code> είναι 6, άρα ο τελευταίος χαρακτήρας είναι ο <code>s[5]</code> = <code>'S'</code>.</p>${OUT(`CYPROS S`)}</details></div>
<div class="tbox ex"><h4>Διάσχιση συμβολοσειράς με for — μέτρηση χαρακτήρων</h4>
<p>Για να επεξεργαστούμε <b>κάθε</b> χαρακτήρα, χρησιμοποιούμε βρόχο <code>for</code> από <code>i=0</code> μέχρι <code>i&lt;s.size()</code>:</p>
${CPP(R`
string s = "banana";
int k = 0;
for(int i=0; i<s.size(); i++)
    if(s[i]=='a')
        k++;
cout << k;`, { nonum: true })}
<details class="steps"><summary>Λύση βήμα-βήμα</summary><table class="tbl"><tr><th>i</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr><tr><td>s[i]</td><td>b</td><td>a</td><td>n</td><td>a</td><td>n</td><td>a</td></tr><tr><td>k</td><td>0</td><td>1</td><td>1</td><td>2</td><td>2</td><td>3</td></tr></table>${OUT(`3`)}</details></div>
<div class="tbox rem"><h4>Σύγκριση συμβολοσειρών</h4><p>Το <code>a == b</code> είναι αληθές μόνο αν οι δύο συμβολοσειρές έχουν <b>ακριβώς</b> τους ίδιους χαρακτήρες με την ίδια σειρά (πεζά ≠ κεφαλαία: <code>"Red" != "red"</code>). Για να ελέγξουμε αν δύο λέξεις ξεκινούν με το ίδιο γράμμα συγκρίνουμε χαρακτήρες: <code>if(a[0]==b[0])</code> (Παράδειγμα 2.2 του βιβλίου).</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>• Ξεκινούμε την αρίθμηση από το 1 αντί από το 0. • Γράφουμε <code>i&lt;=s.size()</code> και διαβάζουμε εκτός ορίων. • Ξεχνάμε το <code>#include&lt;string&gt;</code>. • Μπερδεύουμε <code>'a'</code> (χαρακτήρας) με <code>"a"</code> (συμβολοσειρά).</p></div>
`,
  widget: "ib4str",
  gen: "ib4idx",
  exercises: [
    { level: 1, q: R`Τι θα εμφανίσει το πιο κάτω τμήμα προγράμματος;${CPP(R`
string s = "PROGRAM";
cout << s[0] << s[3];`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: "PG", text: true, cs: true }],
      hint: R`Η αρίθμηση των θέσεων ξεκινά από το 0.`, sol: R`${ib4Boxes("PROGRAM", { hl: [0, 3] })}<code>s[0]</code> = P και <code>s[3]</code> = G. ${OUT(`PG`)}` },
    { level: 1, q: R`Τι θα εμφανίσει η εντολή <code>cout &lt;&lt; s.size();</code> αν <code>string s = "Cyprus";</code>`, fields: [{ label: "Έξοδος:", ans: 6 }],
      hint: R`Μέτρησε τους χαρακτήρες.`, sol: R`Η <code>size()</code> επιστρέφει το μέγεθος (πλήθος χαρακτήρων) της συμβολοσειράς: C-y-p-r-u-s → <b>6</b>.` },
    { level: 1, type: "mc", q: R`Στη C++ ο πρώτος χαρακτήρας μιας συμβολοσειράς <code>s</code> είναι ο <code>s[1]</code>.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Πώς αριθμούνται οι θέσεις των πινάκων;`, sol: R`Λάθος: ο πρώτος χαρακτήρας βρίσκεται στη θέση <b>0</b>, δηλαδή είναι ο <code>s[0]</code>.` },
    { level: 1, type: "mc", q: R`Ποια δήλωση είναι <b>σωστή</b> στη C++;`, options: [R`<code>string s = "Hello";</code>`, R`<code>string s = 'Hello';</code>`, R`<code>char c = "A";</code>`, R`<code>string s = Hello;</code>`], correct: 0,
      hint: R`Συμβολοσειρές: διπλά εισαγωγικά. Χαρακτήρες: μονά.`, sol: R`Σωστή είναι η <code>string s = "Hello";</code>. Το <code>'Hello'</code> δεν είναι έγκυρος χαρακτήρας, το <code>"A"</code> είναι συμβολοσειρά (όχι <code>char</code>) και το <code>Hello</code> χωρίς εισαγωγικά θα θεωρηθεί όνομα μεταβλητής.` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα;${CPP(R`
string a = "abc", b = "xyz";
a += b[1];
b = a + "!";
cout << a << " " << b;`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: "abcy abcy!", text: true, cs: true }],
      hint: R`Το <code>b[1]</code> είναι ο χαρακτήρας 'y'.`, sol: R`<code>a += b[1]</code> → <code>a = "abcy"</code>. Μετά <code>b = a + "!"</code> → <code>b = "abcy!"</code>. ${OUT(`abcy abcy!`)}` },
    { level: 2, q: R`Το πιο κάτω τμήμα ανταλλάσσει τους πρώτους χαρακτήρες δύο συμβολοσειρών. Τι θα εμφανίσει;${CPP(R`
string a = "abcdefg", b = "fyi";
char t = a[0];
a[0] = b[0];
b[0] = t;
cout << a << " " << b;`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: "fbcdefg ayi", text: true, cs: true }],
      hint: R`Η <code>t</code> κρατά προσωρινά τον πρώτο χαρακτήρα της <code>a</code>.`, sol: R`<code>t = 'a'</code>, <code>a[0] = 'f'</code> → <code>a = "fbcdefg"</code>, <code>b[0] = 'a'</code> → <code>b = "ayi"</code>. ${OUT(`fbcdefg ayi`)}` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα;${CPP(R`
string s = "LOGIC";
for(int i=s.size()-1; i>=0; i--)
    cout << s[i];`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: "CIGOL", text: true, cs: true }],
      hint: R`Ο βρόχος ξεκινά από την τελευταία θέση (4) και πάει προς τα πίσω.`, sol: R`i = 4, 3, 2, 1, 0 → C, I, G, O, L: η λέξη τυπώνεται <b>αντίστροφα</b>. ${OUT(`CIGOL`)}` },
    { level: 2, q: R`Πόσες φορές εκτελείται η εντολή <code>k++</code>;${CPP(R`
string s = "mississippi";
int k = 0;
for(int i=0; i<s.size(); i++)
    if(s[i]=='s')
        k++;`, { nonum: true })}`, fields: [{ label: "Φορές:", ans: 4 }],
      hint: R`Μέτρησε τα s.`, sol: R`Η <code>k++</code> εκτελείται μία φορά για κάθε χαρακτήρα <code>'s'</code>: m-i-<b>s</b>-<b>s</b>-i-<b>s</b>-<b>s</b>-i-p-p-i → <b>4</b>.` },
    { level: 3, q: R`Το πρόγραμμα ελέγχει αν μια λέξη είναι <b>παλίνδρομη</b> (διαβάζεται ίδια από αριστερά και από δεξιά). Να γράψετε τη συνθήκη που λείπει στη θέση <b>Α</b>.${CPP(R`
string s;
cin >> s;
int n = s.size();
bool pal = true;
for(int i=0; i<n/2; i++)
    if(   A   )
        pal = false;
if(pal)
    cout << "true";
else
    cout << "false";`, { title: "palindrome.cpp" })}`,
      fields: [{ label: "Θέση Α:", ans: ["s[i]!=s[n-1-i]", "s[n-1-i]!=s[i]", "s[i]!=s[s.size()-1-i]", "s[s.size()-1-i]!=s[i]", "s[i]!=s[n-i-1]", "s[n-i-1]!=s[i]", "!(s[i]==s[n-1-i])", "!(s[n-1-i]==s[i])", "s[i]!=s[(n-1)-i]", "s[(n-1)-i]!=s[i]"], text: true, nospace: true, cs: true, wide: true, ph: "π.χ. s[i]..." }],
      hint: R`Ο χαρακτήρας της θέσης i πρέπει να ταιριάζει με τον «συμμετρικό» του από το τέλος. Ποια είναι η θέση του;`,
      sol: R`Ο συμμετρικός του <code>s[i]</code> είναι ο <code>s[n-1-i]</code> (για i=0 ο τελευταίος, θέση n−1). Αν βρεθεί έστω και ένα ζεύγος που <b>διαφέρει</b>, η λέξη δεν είναι παλίνδρομη: <code>if(s[i]!=s[n-1-i])</code> → <code>pal = false;</code>. Για είσοδο <code>level</code> εμφανίζει <code>true</code>, για <code>abca</code> εμφανίζει <code>false</code>.` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα αν δοθεί η λέξη <code>xyz</code>;${CPP(R`
string s;
cin >> s;
for(int i=0; i<s.size(); i++)
    for(int j=0; j<=i; j++)
        cout << s[i];`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: "xyyzzz", text: true, cs: true }],
      hint: R`Ο εσωτερικός βρόχος εκτελείται i+1 φορές.`, sol: R`Για i=0 τυπώνει x μία φορά, για i=1 το y δύο φορές, για i=2 το z τρεις φορές (ο i-οστός χαρακτήρας i φορές, αν μετράμε από το 1). ${OUT(`xyyzzz`)}` }
  ]
},
/* ───────────────────────────── 4.2 ───────────────────────────── */
{
  id: "4.2", unit: 4, title: "Συναρτήσεις της βιβλιοθήκης string: size(), clear(), empty() και getline()",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.2 §3 Συναρτήσεις της βιβλιοθήκης string (σ. 111–113)",
  intro: "Ποια είναι η διαφορά ανάμεσα στο cin >> και στη getline για την ανάγνωση συμβολοσειράς — και τι κάνουν οι size(), clear() και empty();",
  thumb: ICON("size()", "blue"),
  theory: R`
<p>Η βιβλιοθήκη <code>&lt;string&gt;</code> της C++ προσφέρει πολλές έτοιμες συναρτήσεις. Για τις ανάγκες του μαθήματος (και των <b>Παγκυπρίων Εξετάσεων</b>) χρησιμοποιούμε τέσσερις: <b>size()</b>, <b>clear()</b>, <b>empty()</b> και <b>getline()</b>. Πρέπει να ξέρουμε πότε και πώς χρησιμοποιείται η καθεμιά.</p>
<table class="tbl"><tr><th>Συνάρτηση</th><th>Τι κάνει</th><th>Επιστρέφει</th></tr>
<tr><td><code>s.size()</code></td><td>το μέγεθος της συμβολοσειράς (πλήθος χαρακτήρων/bytes)</td><td>ακέραιο</td></tr>
<tr><td><code>s.clear()</code></td><td>διαγράφει το περιεχόμενο — η <code>s</code> γίνεται <code>""</code></td><td>τίποτα</td></tr>
<tr><td><code>s.empty()</code></td><td>ελέγχει αν η συμβολοσειρά είναι άδεια</td><td><code>true</code>/<code>false</code></td></tr>
<tr><td><code>getline(x, y)</code></td><td>διαβάζει <b>ολόκληρη τη γραμμή</b> από την πηγή <code>x</code> (π.χ. <code>cin</code> ή αρχείο) και την αποθηκεύει στη <code>y</code></td><td>—</td></tr></table>
<div class="tbox def"><h4>size(): το μέγεθος της συμβολοσειράς</h4>
<p>Η <code>a.size()</code> επιστρέφει το πλήθος των χαρακτήρων· για <code>"Hello"</code> επιστρέφει 5. Τη χρησιμοποιούμε σχεδόν πάντα ως όριο του βρόχου διάσχισης:</p>
${CPP(R`
string a;
cin >> a;
for(int i=0; i<a.size(); i++)
    cout << a[i] << endl;`, { title: "C7_2_example3.cpp", hl: [3] })}
<p>Με είσοδο <code>Hello</code> τυπώνεται κάθε γράμμα σε δική του γραμμή: H, e, l, l, o.</p>
<p class="muted small">Σημείωση: η <code>size()</code> μετρά <b>bytes</b>. Για λατινικούς χαρακτήρες 1 χαρακτήρας = 1 byte· τα ελληνικά γράμματα πιάνουν συνήθως 2 bytes, γι’ αυτό στα προγράμματα χρησιμοποιούμε λατινικούς χαρακτήρες.</p></div>
<div class="tbox def"><h4>clear() και empty()</h4>
<p>Το Παράδειγμα 2.4 του βιβλίου «χτίζει» μια νέα συμβολοσειρά με τα <b>κεφαλαία</b> γράμματα μιας λέξης (ASCII 65–90) και, αν δεν βρεθεί κανένα, τυπώνει μήνυμα:</p>
${CPP(R`
string st1, st2;
st2.clear();                  // Διαγράφει το περιεχόμενο της st2
cin >> st1;
for(int i=0; i<st1.size(); i++)
    if(st1[i]>=65 && st1[i]<=90)    // ή (st1[i]>='A' && st1[i]<='Z')
        st2 += st1[i];        // Προσθέτει τον χαρακτήρα στην st2
if(st2.empty())               // true αν η st2 είναι άδεια
    cout << "No capital letters found";
else
    cout << st2;`, { title: "C7_2_example4.cpp", hl: [2, 8] })}
<p>Με είσοδο <code>myCPUfan</code>:</p>${OUT(`CPU`)}</div>
<div class="tbox def"><h4>cin &gt;&gt; ή getline; — ανάγνωση φράσης με κενά</h4>
<p>Η <code>cin &gt;&gt;</code> θεωρεί το <b>κενό διάστημα</b> (space) <b>διαχωριστικό</b>: διαβάζει μόνο μέχρι το πρώτο κενό. Η <code>getline(cin, st1)</code> διαβάζει <b>ολόκληρη τη γραμμή</b> μέχρι την αλλαγή γραμμής (Enter), μαζί με τα κενά.</p>
<div class="figrow"><div>${CPP(R`
string st1;
cin >> st1;          // Input: Hello world
cout << st1 << endl; // Hello
cout << st1.size();  // 5`, { nonum: true, small: true })}</div><div>${CPP(R`
string st1;
getline(cin, st1);   // Input: Hello world
cout << st1 << endl; // Hello world
cout << st1.size();  // 11`, { nonum: true, small: true })}</div></div>
<p>Η <code>getline</code> δέχεται 2 παραμέτρους: η 1η είναι η <b>μέθοδος εισαγωγής</b> (<code>cin</code> για το πληκτρολόγιο ή μια ροή αρχείου) και η 2η το <b>αντικείμενο</b> όπου αποθηκεύεται η φράση. Το κενό μετρά ως χαρακτήρας: <code>"Hello world"</code> έχει μέγεθος 11.</p></div>
<div class="tbox warn"><h4>Η «παγίδα» cin &gt;&gt; πριν από getline</h4>
<p>Η <code>cin &gt;&gt; num;</code> αφήνει στην είσοδο τον χαρακτήρα <b>αλλαγής γραμμής</b>. Μια αμέσως επόμενη <code>getline</code> διαβάζει αυτή την «κενή» γραμμή και η φράση χάνεται! Η λύση του βιβλίου: μια επιπλέον <code>getline</code> που «καταναλώνει» την αλλαγή γραμμής.</p>
${CPP(R`
int num;
string st1, temp;
cin >> num;
getline(cin, temp);    // Διαβάζει τον χαρακτήρα αλλαγής γραμμής
getline(cin, st1);     // Αποθηκεύει τη φράση στη συμβολοσειρά st1`, { nonum: true, hl: [4] })}</div>
<div class="tbox ex"><h4>Θέμα τύπου Παγκυπρίων</h4>
<p>Στο πρόγραμμα δίνονται από το πληκτρολόγιο, σε δύο γραμμές, οι φράσεις <code>Good luck</code> και <code>Pagkypries exams</code>. Τι εμφανίζεται;</p>
${CPP(R`
string st1, st2;
int s1, s2;
getline(cin, st1);
cout << st1 << endl;
cin >> st2;
cout << st2 << endl;
s1 = st1.size();
s2 = st2.size();
cout << s1 << endl;
cout << s2 << endl;`, {})}
<details class="steps"><summary>Λύση βήμα-βήμα</summary><p>Η <code>getline</code> διαβάζει όλη τη 1η γραμμή: <code>st1 = "Good luck"</code> (9 χαρακτήρες μαζί με το κενό). Η <code>cin &gt;&gt; st2</code> σταματά στο κενό: <code>st2 = "Pagkypries"</code> (10 χαρακτήρες).</p>${OUT(`Good luck
Pagkypries
9
10`)}</details></div>
`,
  widget: "ib4input",
  gen: "ib4cin",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια συνάρτηση επιστρέφει το μέγεθος μιας συμβολοσειράς <code>s</code>;`, options: [R`<code>s.size()</code>`, R`<code>s.clear()</code>`, R`<code>s.empty()</code>`, R`<code>getline(cin, s)</code>`], correct: 0,
      hint: R`Μέγεθος = size.`, sol: R`Η <code>s.size()</code>. Η <code>clear()</code> σβήνει το περιεχόμενο, η <code>empty()</code> ελέγχει αν είναι άδεια και η <code>getline</code> διαβάζει γραμμή.` },
    { level: 1, type: "mc", q: R`Η εντολή <code>cin &gt;&gt; st;</code> διαβάζει ολόκληρη μια φράση που περιέχει κενά.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι θεωρεί η cin το κενό διάστημα;`, sol: R`Λάθος. Η <code>cin</code> θεωρεί το κενό <b>διαχωριστικό</b> και διαβάζει μόνο την πρώτη λέξη. Για ολόκληρη τη φράση χρειάζεται η <code>getline(cin, st)</code>.` },
    { level: 1, q: R`Με την εντολή <code>getline(cin, st1);</code> ο χρήστης πληκτρολογεί <code>Hello world</code>. Τι επιστρέφει η <code>st1.size()</code>;`, fields: [{ label: "Μέγεθος:", ans: 11 }],
      hint: R`Το κενό είναι κι αυτό χαρακτήρας.`, sol: R`5 (Hello) + 1 (κενό) + 5 (world) = <b>11</b>.` },
    { level: 2, q: R`Στο πρόγραμμα δίνονται από το πληκτρολόγιο οι γραμμές <code>Good luck</code> και <code>Pagkypries exams</code>. Να γράψετε τι εμφανίζει κάθε εντολή <code>cout</code>, με τη σειρά.${CPP(R`
string st1, st2;
getline(cin, st1);
cout << st1 << endl;
cin >> st2;
cout << st2 << endl;
cout << st1.size() << endl;
cout << st2.size() << endl;`, {})}`, fields: [{ label: "Γραμμή 3:", ans: "Good luck", text: true, cs: true }, { label: "Γραμμή 5:", ans: "Pagkypries", text: true, cs: true }, { label: "Γραμμή 6:", ans: 9 }, { label: "Γραμμή 7:", ans: 10 }],
      hint: R`getline → όλη η γραμμή, cin → μέχρι το κενό.`, sol: R`<code>st1 = "Good luck"</code> (9 χαρακτήρες), <code>st2 = "Pagkypries"</code> (10 χαρακτήρες· η λέξη <code>exams</code> μένει αδιάβαστη).${OUT(`Good luck
Pagkypries
9
10`)}` },
    { level: 2, q: R`Τι θα εμφανίσει το τμήμα προγράμματος;${CPP(R`
string s = "abc";
s.clear();
if(s.empty())
    cout << "EMPTY";
else
    cout << s.size();`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: "EMPTY", text: true, cs: true }],
      hint: R`Τι κάνει η clear();`, sol: R`Η <code>clear()</code> διαγράφει το περιεχόμενο, άρα η <code>s.empty()</code> είναι <code>true</code>. ${OUT(`EMPTY`)}` },
    { level: 2, q: R`Ο χρήστης πληκτρολογεί <code>HeLLo WoRLD</code>. Τι θα εμφανίσει το πρόγραμμα;${CPP(R`
string st1, st2;
st2.clear();
cin >> st1;
for(int i=0; i<st1.size(); i++)
    if(st1[i]>=65 && st1[i]<=90)
        st2 += st1[i];
if(st2.empty())
    cout << "No capital letters found";
else
    cout << st2;`, {})}`, fields: [{ label: "Έξοδος:", ans: "HLL", text: true, cs: true }],
      hint: R`Πρόσεξε: η είσοδος γίνεται με cin.`, sol: R`Η <code>cin</code> διαβάζει μόνο <code>HeLLo</code> (σταματά στο κενό). Τα κεφαλαία (ASCII 65–90) είναι H, L, L. ${OUT(`HLL`)}<i>Παγίδα: όποιος θεωρήσει ότι διαβάστηκε και το <code>WoRLD</code> απαντά λανθασμένα HLLWRLD.</i>` },
    { level: 2, type: "mc", q: R`Ο χρήστης δίνει <code>3</code>, πατά Enter και μετά γράφει <code>Good luck</code>. Τι περιέχει η <code>st1</code> μετά τις εντολές;${CPP(R`
int num;
string st1;
cin >> num;
getline(cin, st1);`, { nonum: true })}`, options: [R`την κενή συμβολοσειρά <code>""</code>`, R`<code>"Good luck"</code>`, R`<code>"Good"</code>`, R`<code>"3"</code>`], correct: 0,
      hint: R`Τι αφήνει η cin &gt;&gt; num στην είσοδο;`, sol: R`Η <code>cin &gt;&gt; num</code> αφήνει την αλλαγή γραμμής· η <code>getline</code> τη διαβάζει αμέσως, άρα <code>st1 = ""</code> (μέγεθος 0). Χρειάζεται μια επιπλέον <code>getline(cin, temp);</code> πριν από τη <code>getline(cin, st1);</code>.` },
    { level: 3, q: R`Το πρόγραμμα μετρά τις λέξεις μιας φράσης (οι λέξεις χωρίζονται με ένα κενό). Τι θα εμφανίσει για την είσοδο <code>to be or not to be</code>;${CPP(R`
string st;
getline(cin, st);
int w = 1;
for(int i=0; i<st.size(); i++)
    if(st[i]==' ')
        w++;
cout << w;`, {})}`, fields: [{ label: "Έξοδος:", ans: 6 }],
      hint: R`Λέξεις = κενά + 1.`, sol: R`Η φράση έχει 5 κενά, άρα <code>w = 1 + 5 = 6</code>. (Με <code>cin</code> αντί για <code>getline</code> θα διαβαζόταν μόνο το «to» και θα εμφάνιζε 1.)` },
    { shuffle: true, level: 3, type: "mc", q: R`Ποια εντολή πρέπει να τοποθετηθεί στη θέση <b>Α</b> ώστε να τυπωθούν οι τρεις (3) πρώτοι χαρακτήρες της συμβολοσειράς <code>st1</code>;${CPP(R`
string st1;
getline(cin, st1);
   A`, {})}`, options: [R`<code>cout &lt;&lt; st1[0] &lt;&lt; st1[1] &lt;&lt; st1[2];</code>`, R`<code>cout &lt;&lt; st1[1] &lt;&lt; st1[2] &lt;&lt; st1[3];</code>`, R`<code>cout &lt;&lt; st1.size(3);</code>`, R`<code>cout &lt;&lt; st1[3];</code>`], correct: 0,
      hint: R`Οι τρεις πρώτες θέσεις είναι 0, 1, 2.`, sol: R`<code>cout &lt;&lt; st1[0] &lt;&lt; st1[1] &lt;&lt; st1[2];</code> — π.χ. για <code>"Exams"</code> τυπώνει <code>Exa</code>. Ισοδύναμα:${CPP(R`
for(int i=0; i<3; i++)
    cout << st1[i];`, { nonum: true })}` },
    { level: 3, q: R`Οι παρουσίες ενός μαθητή σημειώνονται με <code>P</code> και οι απουσίες με <code>A</code>. Ο μαθητής περνά αν παρευρέθηκε στο 75% των μαθημάτων. Τι θα εμφανίσει το πρόγραμμα για την είσοδο <code>PPAPPPPA</code>;${CPP(R`
string st;
cin >> st;
int p = 0;
for(int i=0; i<st.size(); i++)
    if(st[i]=='P')
        p++;
if(p >= 0.75*st.size())
    cout << "PASS";
else
    cout << "FAIL";`, {})}`, fields: [{ label: "Έξοδος:", ans: "PASS", text: true, cs: true }],
      hint: R`Μέτρησε τα P και σύγκρινε με το 75% του μεγέθους.`, sol: R`<code>p = 6</code>, <code>st.size() = 8</code>, <code>0.75·8 = 6</code>. Αφού <code>6 &gt;= 6</code> ✓ ${OUT(`PASS`)}(Για <code>APAAPA</code>: 2 &lt; 4.5 → FAIL.)` }
  ]
},
/* ───────────────────────────── 4.3 ───────────────────────────── */
{
  id: "4.3", unit: 4, title: "Χαρακτήρες και κώδικας ASCII, πίνακες συμβολοσειρών και κρυπτογράφηση στη C++",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.2 §3–4 (Παραδείγματα 2.4–2.6) και Ασκήσεις Κεφαλαίου (σ. 111–122)",
  intro: "Πώς χρησιμοποιούμε τον κώδικα ASCII για να μετράμε γράμματα, να μετατρέπουμε κεφαλαία σε πεζά και να κρυπτογραφούμε λέξεις στη C++;",
  thumb: ICON("'A'=65", "purple"),
  theory: R`
<p>Κάθε χαρακτήρας αποθηκεύεται στη μνήμη ως <b>αριθμός</b>, σύμφωνα με τον <b>κώδικα ASCII</b>. Στη C++ ένας <code>char</code> συμπεριφέρεται σαν μικρός ακέραιος: μπορούμε να τον συγκρίνουμε, να του προσθέσουμε, να τον αφαιρέσουμε. Αυτό είναι το «κλειδί» για πολλά θέματα συμβολοσειρών των Παγκυπρίων: μέτρηση εμφανίσεων γραμμάτων, μετατροπή πεζών/κεφαλαίων, κρυπτογράφηση τύπου Καίσαρα, συμπίεση.</p>
<div class="tbox def"><h4>Κώδικας ASCII — τα όρια που πρέπει να θυμάσαι</h4>
<table class="tbl"><tr><th>Χαρακτήρες</th><th>ASCII</th></tr><tr><td>κεφαλαία <code>'A'</code> … <code>'Z'</code></td><td>65 … 90</td></tr><tr><td>πεζά <code>'a'</code> … <code>'z'</code></td><td>97 … 122</td></tr><tr><td>ψηφία <code>'0'</code> … <code>'9'</code></td><td>48 … 57</td></tr><tr><td>κενό <code>' '</code></td><td>32</td></tr></table>
<p>Η διαφορά πεζού–κεφαλαίου είναι πάντα <b>32</b>: <code>'a' - 'A' = 97 - 65 = 32</code>. Η έκφραση <code>c - 'A'</code> δίνει τη <b>θέση του γράμματος στο αλφάβητο</b> (A→0, B→1, …, Z→25) και η <code>char(65 + pos)</code> κάνει την αντίστροφη μετατροπή.</p>
${ib4Boxes("CPU", { ascii: true, caption: "Κάτω από κάθε χαρακτήρα: η θέση του και ο κωδικός ASCII." })}
${CPP(R`
char c = 'B';
int k = c;                       // 66
cout << k << " " << char(c + 32) << " " << 'd' - 'a';`, { nonum: true })}${OUT(`66 b 3`)}</div>
<div class="tbox ex"><h4>Πίνακας μετρητών cnt[26] — ο χαρακτήρας με τις περισσότερες εμφανίσεις</h4>
<p>Το Παράδειγμα 2.5 του βιβλίου μετρά πόσες φορές εμφανίζεται κάθε κεφαλαίο γράμμα: η θέση <code>st1[i]-'A'</code> του πίνακα <code>cnt</code> αντιστοιχεί στο γράμμα. Ο πίνακας δηλώνεται <b>έξω από τη main</b>, ώστε να αρχικοποιηθεί με μηδενικά.</p>
${CPP(R`
int cnt[26];          // καθολικός πίνακας: αρχικές τιμές 0
int main(){
 string st1;
 cin >> st1;
 for (int i=0; i<st1.size(); i++)
      cnt[st1[i]-'A']++;          // π.χ. 'C' (67) → θέση 2
 int maxt = 0, pos = -1;
 for (int i=0; i<26; i++)
      if (cnt[i]>maxt) {          // εύρεση μέγιστου
           maxt = cnt[i];
           pos = i;
      }
 cout << char (65 + pos);         // μετατροπή ακεραίου σε χαρακτήρα
return 0;
}`, { title: "C7_2_example5.cpp", hl: [6, 13] })}
<details class="steps"><summary>Λύση βήμα-βήμα για είσοδο MISSISSIPPI</summary><p>cnt['I'-'A'] = cnt[8] = 4, cnt[18] (S) = 4, cnt[15] (P) = 2, cnt[12] (M) = 1. Η σύγκριση είναι <b>αυστηρή</b> (<code>&gt;</code>), άρα σε ισοπαλία κρατιέται το γράμμα που συναντάται <b>πρώτο</b> στο αλφάβητο: το I (θέση 8) πριν από το S (θέση 18).</p>${OUT(`I`)}</details></div>
<div class="tbox ex"><h4>Κρυπτογράφηση: A→C, B→D, …, Y→A, Z→B</h4>
<p>Μετατοπίζουμε κάθε κεφαλαίο γράμμα κατά 2 θέσεις «κυκλικά». Με το <code>% 26</code> μετά το Z ξαναρχίζουμε από το A:</p>
${CPP(R`
string s;
cin >> s;                                   // π.χ. AWAY
for(int i=0; i<s.size(); i++)
    s[i] = (s[i] - 'A' + 2) % 26 + 'A';
cout << s;`, { hl: [4] })}${OUT(`CYCA`)}
<p>Για τον <code>'Y'</code>: <code>'Y'-'A' = 24</code>, <code>(24+2)%26 = 0</code>, <code>0 + 'A' = 'A'</code> ✓.</p></div>
<div class="tbox def"><h4>Πίνακες συμβολοσειρών</h4>
<p>Δηλώνουμε πίνακα συμβολοσειρών όπως έναν πίνακα ακεραίων: <code>string st[10];</code> δημιουργεί 10 συμβολοσειρές. Το <code>A[i]</code> είναι συμβολοσειρά και το <code>A[i][0]</code> ο <b>πρώτος χαρακτήρας</b> της.</p>
${CPP(R`
string A[5], st;
for(int i=0; i<5; i++)
    cin >> A[i];
for(int i=0; i<5; i++)
    st += A[i][0];       // προσθήκη 1ου χαρακτήρα
cout << st;`, { title: "C7_2_example6.cpp", hl: [5] })}
<p>Με είσοδο <code>Maria Andreas Xenia Ioanna Nikos</code>:</p>${OUT(`MAXIN`)}</div>
<div class="tbox tip"><h4>Μετατροπή κεφαλαίων σε πεζά (και αντίστροφα)</h4><p>${CPP(R`
if(st[i]>=65 && st[i]<=90)
    st[i] = st[i] + 32;`, { nonum: true })} κάνει τα κεφαλαία πεζά· για το αντίστροφο ελέγχουμε 97–122 και αφαιρούμε 32. Δουλεύουμε πάντα με την αριθμητική ASCII, όπως το βιβλίο — έτοιμες συναρτήσεις μετατροπής από άλλες βιβλιοθήκες δεν χρησιμοποιούνται στις λύσεις μας.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη</h4><p>• <code>'a' &lt; 'B'</code> είναι <b>ψευδές</b>: συγκρίνονται οι κωδικοί 97 και 66. • Το <code>cout &lt;&lt; 'A' + 1;</code> τυπώνει <b>66</b> (ακέραιο), ενώ <code>cout &lt;&lt; char('A' + 1);</code> τυπώνει B. • Ξεχνάμε το <code>% 26</code> στην κυκλική μετατόπιση.</p></div>
`,
  widget: "ib4ascii",
  gen: "ib4caesar",
  exercises: [
    { level: 1, q: R`Αν ο κωδικός ASCII του <code>'A'</code> είναι 65, τι θα εμφανίσει η εντολή <code>cout &lt;&lt; int('C');</code>`, fields: [{ label: "Έξοδος:", ans: 67 }],
      hint: R`Τα κεφαλαία γράμματα έχουν διαδοχικούς κωδικούς.`, sol: R`A=65, B=66, C=<b>67</b>.` },
    { level: 1, q: R`Τι θα εμφανίσει η εντολή <code>cout &lt;&lt; char(65 + 4);</code>`, fields: [{ label: "Έξοδος:", ans: "E", text: true, cs: true }],
      hint: R`65 είναι το A· προχώρησε 4 γράμματα.`, sol: R`<code>char(69)</code> = <b>E</b> (A, B, C, D, E).` },
    { level: 1, q: R`Τι θα εμφανίσει η εντολή <code>cout &lt;&lt; 'd' - 'a';</code>`, fields: [{ label: "Έξοδος:", ans: 3 }],
      hint: R`Η αφαίρεση χαρακτήρων δίνει ακέραιο.`, sol: R`<code>100 - 97 = 3</code>: το d απέχει 3 θέσεις από το a.` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα για είσοδο <code>ZEBRA</code>;${CPP(R`
string s;
cin >> s;
for(int i=0; i<s.size(); i++)
    s[i] = (s[i] - 'A' + 2) % 26 + 'A';
cout << s;`, {})}`, fields: [{ label: "Έξοδος:", ans: "BGDTC", text: true, cs: true }],
      hint: R`Κάθε γράμμα πάει 2 θέσεις μπροστά· μετά το Z έρχεται το A.`, sol: R`Z→B (κυκλικά), E→G, B→D, R→T, A→C. ${OUT(`BGDTC`)}` },
    { level: 2, q: R`Τι θα εμφανίσει το τμήμα προγράμματος;${CPP(R`
string st = "PyThOn";
for(int i=0; i<st.size(); i++)
    if(st[i]>=65 && st[i]<=90)
        st[i] = st[i] + 32;
cout << st;`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: "python", text: true, cs: true }],
      hint: R`Ποιοι χαρακτήρες είναι κεφαλαίοι; Τι κάνει το +32;`, sol: R`Τα κεφαλαία P, T, O γίνονται πεζά (+32). ${OUT(`python`)}` },
    { level: 2, q: R`Μετά την εκτέλεση του προγράμματος, ποιες είναι οι τιμές <code>cnt[0]</code> και <code>cnt[13]</code>;${CPP(R`
int cnt[26];
int main(){
 string st = "BANANA";
 for(int i=0; i<st.size(); i++)
    cnt[st[i]-'A']++;
 cout << cnt[0] << " " << cnt[13];
return 0;
}`, {})}`, fields: [{ label: "cnt[0] =", ans: 3 }, { label: "cnt[13] =", ans: 2 }],
      hint: R`Η θέση 0 αντιστοιχεί στο A. Ποιο γράμμα έχει θέση 13;`, sol: R`<code>cnt[0]</code> μετρά τα A → <b>3</b>. Θέση 13: <code>'A'+13 = 78 = 'N'</code> → τα N είναι <b>2</b>.` },
    { level: 2, q: R`Ο χρήστης πληκτρολογεί <code>Maria Andreas Xenia Ioanna Nikos</code>. Τι θα εμφανίσει το πρόγραμμα;${CPP(R`
string A[5], st;
for(int i=0; i<5; i++)
    cin >> A[i];
for(int i=4; i>=0; i--)
    st += A[i][A[i].size()-1];
cout << st;`, {})}`, fields: [{ label: "Έξοδος:", ans: "saasa", text: true, cs: true }],
      hint: R`<code>A[i][A[i].size()-1]</code> είναι ο τελευταίος χαρακτήρας της A[i]· ο βρόχος πάει από το τέλος.`, sol: R`Τελευταίοι χαρακτήρες από A[4] προς A[0]: Niko<b>s</b>, Ioann<b>a</b>, Xeni<b>a</b>, Andrea<b>s</b>, Mari<b>a</b>. ${OUT(`saasa`)}` },
    { level: 2, type: "mc", q: R`Η συνθήκη <code>'a' &lt; 'B'</code> είναι αληθής στη C++.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Σύγκρινε τους κωδικούς ASCII.`, sol: R`Λάθος: <code>'a' = 97</code> και <code>'B' = 66</code>, άρα <code>'a' &gt; 'B'</code>. Τα πεζά έχουν μεγαλύτερους κωδικούς από όλα τα κεφαλαία.` },
    { level: 3, q: R`Συμπίεση: συνεχόμενοι ίδιοι χαρακτήρες (περισσότεροι από έναν) αντικαθίστανται από το πλήθος τους και έναν χαρακτήρα (π.χ. <code>AAABCDDAA</code> → <code>3ABC2D2A</code>). Τι θα εμφανίσει το πρόγραμμα για είσοδο <code>WWWWBBW</code>;${CPP(R`
string s, r;
cin >> s;
int i = 0;
while(i < s.size()){
    int k = 1;
    while(i+k < s.size() && s[i+k]==s[i])
        k++;
    if(k > 1)
        r += char('0' + k);
    r += s[i];
    i += k;
}
cout << r;`, { title: "compress.cpp" })}`, fields: [{ label: "Έξοδος:", ans: "4W2BW", text: true, cs: true }],
      hint: R`Ομάδες: WWWW, BB, W.`, sol: R`Ομάδα WWWW (k=4) → «4W», BB (k=2) → «2B», W (k=1) → «W». Το <code>char('0'+k)</code> μετατρέπει το ψηφίο σε χαρακτήρα. ${OUT(`4W2BW`)}` },
    { level: 3, q: R`Το πρόγραμμα βρίσκει τον πεζό χαρακτήρα με τις περισσότερες εμφανίσεις. Τι θα εμφανίσει για είσοδο <code>mississippi</code>; (Γράψε την έξοδο σε μία γραμμή.)${CPP(R`
int cnt[26];
int main(){
 string st;
 cin >> st;
 for(int i=0; i<st.size(); i++)
    cnt[st[i]-'a']++;
 int maxt = 0, pos = -1;
 for(int i=0; i<26; i++)
    if(cnt[i] > maxt){
        maxt = cnt[i];
        pos = i;
    }
 cout << char(97 + pos) << " " << maxt;
return 0;
}`, {})}`, fields: [{ label: "Έξοδος:", ans: "i 4", text: true, cs: true }],
      hint: R`Μέτρησε τις εμφανίσεις κάθε γράμματος. Αν δύο γράμματα ισοβαθμούν, σκέψου με ποια σειρά τα εξετάζει ο βρόχος και τι κάνει ο αυστηρός έλεγχος &gt;.`, sol: R`cnt[i]=4, cnt[s]=4, cnt[p]=2, cnt[m]=1. Ο βρόχος διατρέχει το αλφάβητο από το a· στο i γίνεται maxt=4, στο s η συνθήκη <code>4 &gt; 4</code> είναι ψευδής. ${OUT(`i 4`)}` }
  ]
},
/* ───────────────────────────── 5.1 ───────────────────────────── */
{
  id: "5.1", unit: 5, title: "Αρχεία στη C++: ανάγνωση και εγγραφή με ifstream και ofstream",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.3 §1–2 Ανάγνωση και εγγραφή σε αρχείο (σ. 123–124)",
  intro: "Πώς διαβάζει ένα πρόγραμμα C++ δεδομένα από ένα αρχείο κειμένου και πώς γράφει τα αποτελέσματα σε άλλο αρχείο;",
  thumb: ICON("fstream", "amber"),
  theory: R`
<p>Μέχρι τώρα η είσοδος γινόταν από το <b>πληκτρολόγιο</b> (<code>cin</code>) και η έξοδος στην <b>οθόνη</b> (<code>cout</code>). Όταν όμως έχουμε <b>μεγάλο όγκο δεδομένων</b> — 100 βαθμούς, 1000 ονόματα — βολεύει να τα διαβάζουμε από <b>αρχείο</b> και να γράφουμε τα αποτελέσματα σε αρχείο. Οι εντολές για τα αρχεία στη C++ βρίσκονται στη βιβλιοθήκη <code>&lt;fstream&gt;</code>. Η ανάγνωση και εγγραφή αρχείων (ifstream, ofstream) εξετάζεται σταθερά στις Παγκύπριες, συνήθως ως «συμπλήρωση εντολών» σε πρόγραμμα.</p>
${ib4Flow()}
<div class="tbox def"><h4>Ροές αρχείων: ifstream και ofstream</h4>
<p>• <code>ifstream fin("input.txt");</code> δημιουργεί μια <b>ροή ανάγνωσης</b> (input file stream) με όνομα <code>fin</code> προς το αρχείο <code>input.txt</code>. Διαβάζουμε με τον τελεστή <code>&gt;&gt;</code>: <code>fin &gt;&gt; a;</code></p>
<p>• <code>ofstream fout("output.txt");</code> δημιουργεί μια <b>ροή εγγραφής</b> (output file stream). Γράφουμε με τον τελεστή <code>&lt;&lt;</code>: <code>fout &lt;&lt; c;</code></p>
<p>• <code>fin.close();</code> / <code>fout.close();</code> <b>τερματίζουν</b> (κλείνουν) τις ροές.</p>
<p>Τα ονόματα των ροών (<code>fin</code>, <code>fout</code>, <code>infile</code>, <code>outfile</code>…) τα επιλέγουμε εμείς· ό,τι δηλωθεί, αυτό χρησιμοποιούμε μετά με <code>&gt;&gt;</code> και <code>&lt;&lt;</code>.</p></div>
<div class="tbox ex"><h4>Παράδειγμα 3.1: άθροισμα δύο αριθμών από αρχείο</h4>
${CPP(R`
#include<fstream>     // βιβλιοθήκη για ifstream, ofstream
using namespace std;
int main(){
    ifstream fin("input.txt");     // ροή ανάγνωσης
    ofstream fout("output.txt");   // ροή εγγραφής
    int a, b, c;
    fin >> a >> b;
    c = a + b;
    fout << c << endl;
    fin.close();                   // τερματισμός ροής ανάγνωσης
    fout.close();                  // τερματισμός ροής εγγραφής
return 0;
}`, { title: "C7_3_example1.cpp", hl: [4, 5, 7, 9] })}
<div class="figrow"><div>${OUT(`12 30`, "input.txt")}</div><div>${OUT(`42`, "output.txt (μετά την εκτέλεση)")}</div></div>
<p>Το <code>input.txt</code> πρέπει να βρίσκεται <b>στον ίδιο φάκελο</b> με το πρόγραμμα. Το <code>output.txt</code> <b>δεν χρειάζεται να προϋπάρχει</b>: δημιουργείται από το πρόγραμμα. Αν υπάρχει ήδη, το παλιό του περιεχόμενο <b>σβήνεται</b> και γράφεται από την αρχή.</p></div>
<div class="tbox ex"><h4>Παράδειγμα 3.2: αριθμοί μεγαλύτεροι από τον μέσο όρο</h4>
<p>Το βιβλίο διαβάζει 100 αριθμούς· εδώ, για να φαίνεται το αποτέλεσμα, 6 αριθμούς από το <code>in.txt</code>. Αποθηκεύονται σε πίνακα, γιατί χρειαζόμαστε δεύτερο πέρασμα μετά τον υπολογισμό του μέσου όρου.</p>
${CPP(R`
ifstream infile("in.txt");        // Ροή ανάγνωσης - infile
ofstream outfile("out.txt");      // Ροή εγγραφής - outfile
int i, A[6], sum = 0;
float mo;
for(i=0; i<6; i++){
    infile >> A[i];
    sum += A[i];
}
mo = sum / 6.0;
for(i=0; i<6; i++)
    if(A[i]>mo)
        outfile << A[i] << endl;
infile.close();
outfile.close();`, { hl: [6, 12] })}
<details class="steps"><summary>Λύση βήμα-βήμα</summary><p>in.txt: <code>8 3 12 5 9 2</code> → sum = 39, mo = 39/6.0 = 6.5. Μεγαλύτεροι από 6.5: 8, 12, 9 — γράφονται ο καθένας σε δική του γραμμή.</p>${OUT(`8
12
9`, "out.txt")}<p>Προσοχή στο <code>6.0</code>: με <code>sum / 6</code> θα γινόταν <b>ακέραια διαίρεση</b> (39/6 = 6).</p></details></div>
<div class="tbox rem"><h4>Πώς «διαβάζει» ο τελεστής &gt;&gt; από αρχείο</h4><p>Όπως η <code>cin</code>: αγνοεί κενά και αλλαγές γραμμής και διαβάζει την επόμενη τιμή του κατάλληλου τύπου. Άρα δεν έχει σημασία αν οι αριθμοί είναι σε μία γραμμή ή σε πολλές. Για να διαβάσουμε <b>ολόκληρη γραμμή</b> (με κενά) από αρχείο χρησιμοποιούμε <code>getline(fin, st);</code>.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>• Ξεχνάμε το <code>#include&lt;fstream&gt;</code>. • Γράφουμε <code>fin &lt;&lt; x</code> ή <code>fout &gt;&gt; x</code> (λάθος κατεύθυνση τελεστή). • Δηλώνουμε τη ροή με ένα όνομα και χρησιμοποιούμε άλλο. • Ξεχνάμε τα εισαγωγικά στο όνομα του αρχείου: <code>ifstream fin(input.txt);</code> ✗.</p></div>
`,
  widget: "ib4fileio",
  gen: "ib4file",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια βιβλιοθήκη περιέχει τις εντολές <code>ifstream</code> και <code>ofstream</code>;`, options: [R`<code>&lt;fstream&gt;</code>`, R`<code>&lt;iostream&gt;</code>`, R`<code>&lt;string&gt;</code>`, R`<code>&lt;iomanip&gt;</code>`], correct: 0,
      hint: R`file stream.`, sol: R`Η <code>&lt;fstream&gt;</code> (file stream).` },
    { level: 1, type: "mc", q: R`Ποια εντολή δημιουργεί ροή <b>ανάγνωσης</b> από το αρχείο <code>in.txt</code>;`, options: [R`<code>ifstream fin("in.txt");</code>`, R`<code>ofstream fin("in.txt");</code>`, R`<code>ifstream fin(in.txt);</code>`, R`<code>cin fin("in.txt");</code>`], correct: 0,
      hint: R`i = input. Το όνομα του αρχείου είναι συμβολοσειρά.`, sol: R`<code>ifstream fin("in.txt");</code>. Η <code>ofstream</code> είναι για εγγραφή και το όνομα του αρχείου γράφεται σε διπλά εισαγωγικά.` },
    { level: 1, type: "mc", q: R`Για να εκτελεστεί η εντολή <code>ofstream fout("output.txt");</code> πρέπει το αρχείο <code>output.txt</code> να υπάρχει ήδη.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι γίνεται όταν το αρχείο εξόδου δεν υπάρχει;`, sol: R`Λάθος. Το αρχείο εξόδου <b>δημιουργείται</b> από το πρόγραμμα (στον ίδιο φάκελο). Αν υπάρχει, το περιεχόμενό του αντικαθίσταται.` },
    { level: 2, q: R`Το αρχείο <code>input.txt</code> περιέχει <code>7 8 10</code>. Τι θα γραφτεί στο <code>output.txt</code>;${CPP(R`
ifstream fin("input.txt");
ofstream fout("output.txt");
int a, b, c;
fin >> a >> b >> c;
fout << (a + b + c) / 3;
fin.close();
fout.close();`, {})}`, fields: [{ label: "output.txt:", ans: 8 }],
      hint: R`Όλοι οι τελεστέοι είναι int.`, sol: R`<code>(7+8+10)/3 = 25/3</code> με <b>ακέραια διαίρεση</b> = <b>8</b> (όχι 8.33).` },
    { level: 2, q: R`Στο <code>ask3_in.txt</code> υπάρχουν οι τριψήφιοι <code>482 637 915</code>. Το πρόγραμμα γράφει στο <code>ask3_out.txt</code> τον αριθμό από τις εκατοντάδες του 1ου, τις δεκάδες του 2ου και τις μονάδες του 3ου. Τι γράφεται;${CPP(R`
ifstream fin("ask3_in.txt");
ofstream fout("ask3_out.txt");
int x, y, z;
fin >> x >> y >> z;
fout << x / 100 * 100 + y / 10 % 10 * 10 + z % 10;
fin.close();
fout.close();`, {})}`, fields: [{ label: "ask3_out.txt:", ans: 435 }],
      hint: R`Με ακέραια διαίρεση: <code>x / 100</code> δίνει το ψηφίο των εκατοντάδων, <code>y / 10 % 10</code> των δεκάδων και <code>z % 10</code> των μονάδων.`, sol: R`<code>4·100 + 3·10 + 5 = 435</code>.` },
    { level: 2, q: R`Το <code>in.txt</code> περιέχει <code>4 9 2 7 3</code>. Τι θα περιέχει το <code>out.txt</code>; (Γράψε τις τιμές σε μία γραμμή, χωρισμένες με κενό.)${CPP(R`
ifstream infile("in.txt");
ofstream outfile("out.txt");
int A[5], sum = 0;
for(int i=0; i<5; i++){
    infile >> A[i];
    sum += A[i];
}
float mo = sum / 5.0;
for(int i=0; i<5; i++)
    if(A[i] > mo)
        outfile << A[i] << endl;
infile.close();
outfile.close();`, {})}`, fields: [{ label: "out.txt:", ans: "9 7", text: true }],
      hint: R`Υπολόγισε πρώτα τον μέσο όρο.`, sol: R`sum = 25, mo = 5.0. Μεγαλύτεροι: 9 και 7 (με τη σειρά του αρχείου). ${OUT(`9
7`, "out.txt")}` },
    { level: 2, q: R`Το <code>students.txt</code> περιέχει αριθμό μητρώου και δύο βαθμούς διαγωνισμάτων. Ποιοι αριθμοί μητρώου εμφανίζονται στην οθόνη; (σε μία γραμμή, χωρισμένοι με κενό)${OUT(`2001 15 18
2002 20 12
2003 11 17
2004 16 20`, "students.txt")}${CPP(R`
ifstream fin("students.txt");
int am, d1, d2;
for(int i=0; i<4; i++){
    fin >> am >> d1 >> d2;
    if(d1 - d2 > 4 || d2 - d1 > 4)
        cout << am << endl;
}
fin.close();`, {})}`, fields: [{ label: "Οθόνη:", ans: "2002 2003", text: true }],
      hint: R`Η συνθήκη ελέγχει αν η διαφορά (κατ’ απόλυτη τιμή) είναι μεγαλύτερη από 4.`, sol: R`Διαφορές: 3, 8 ✓, 6 ✓, 4 (όχι &gt; 4). ${OUT(`2002
2003`)}` },
    { level: 3, q: R`Να γράψετε τις εντολές που πρέπει να τοποθετηθούν στη θέση <b>Α</b>, ώστε να δημιουργηθούν οι ροές <code>fin</code> (ανάγνωση από το <code>askisi5IN.txt</code>) και <code>fout</code> (εγγραφή στο <code>askisi5OUT.txt</code>).${CPP(R`
#include<fstream>
using namespace std;
int main(){
       A
    int N, sum = 0;
    fin >> N;
    while(!fin.eof()){
        sum += N;
        fin >> N;
    }
    fout << sum;
return 0;
}`, {})}`, fields: [{ label: "1η εντολή:", ans: ['ifstream fin("askisi5IN.txt");', 'ifstream fin("askisi5IN.txt")'], text: true, nospace: true, cs: true, wide: true }, { label: "2η εντολή:", ans: ['ofstream fout("askisi5OUT.txt");', 'ofstream fout("askisi5OUT.txt")'], text: true, nospace: true, cs: true, wide: true }],
      hint: R`ifstream για ανάγνωση, ofstream για εγγραφή· τα ονόματα των ροών είναι ήδη γνωστά από το πρόγραμμα.`, sol: R`${CPP(R`
ifstream fin("askisi5IN.txt");
ofstream fout("askisi5OUT.txt");`, { nonum: true })}Τα ονόματα των ροών πρέπει να είναι <code>fin</code> και <code>fout</code>, αφού αυτά χρησιμοποιούνται στο υπόλοιπο πρόγραμμα. Αν το <code>askisi5IN.txt</code> περιέχει <code>3 9 14 20</code> (με Enter στο τέλος), το <code>askisi5OUT.txt</code> θα περιέχει <code>46</code>.` },
    { level: 3, q: R`Από το πληκτρολόγιο δίνονται <code>4 *</code>. Πόσες γραμμές γράφονται στο <code>tri.txt</code> και τι περιέχει η 3η γραμμή;${CPP(R`
int n;
char c;
cin >> n >> c;
ofstream fout("tri.txt");
for(int i=1; i<=n; i++){
    for(int j=1; j<=i; j++)
        fout << c;
    fout << endl;
}
fout.close();`, {})}`, fields: [{ label: "Γραμμές:", ans: 4 }, { label: "3η γραμμή:", ans: "***", text: true, nospace: true }],
      hint: R`Η i-οστή γραμμή έχει i χαρακτήρες.`, sol: R`${OUT(`*
**
***
****`, "tri.txt")}4 γραμμές· η 3η περιέχει <code>***</code>.` },
    { level: 3, type: "mc", q: R`Ποιο είναι το λάθος στο πιο κάτω τμήμα προγράμματος;${CPP(R`
ifstream fin("data.txt");
int x;
fin << x;
cout << x;`, { nonum: true })}`, options: [R`Η ανάγνωση από ροή γίνεται με <code>&gt;&gt;</code>: <code>fin &gt;&gt; x;</code>`, R`Πρέπει να χρησιμοποιηθεί <code>ofstream</code> αντί για <code>ifstream</code>`, R`Το όνομα της ροής δεν μπορεί να είναι <code>fin</code>`, R`Δεν επιτρέπεται <code>cout</code> σε πρόγραμμα με αρχεία`], correct: 0,
      hint: R`Προς τα πού «ρέουν» τα δεδομένα;`, sol: R`Τα δεδομένα ρέουν <b>από</b> το αρχείο <b>προς</b> τη μεταβλητή: <code>fin &gt;&gt; x;</code>. Ο τελεστής <code>&lt;&lt;</code> χρησιμοποιείται με ροές εγγραφής (<code>fout &lt;&lt; x</code>). Το όνομα της ροής είναι ελεύθερο και η <code>cout</code> επιτρέπεται κανονικά.` }
  ]
},
/* ───────────────────────────── 5.2 ───────────────────────────── */
{
  id: "5.2", unit: 5, title: "Εγγραφή στο τέλος αρχείου (append, ios::app) και έλεγχος τέλους αρχείου με eof()",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.3 §3–4 Εγγραφή στο τέλος αρχείου, Έλεγχος για το τέλος αρχείου (σ. 124–126)",
  intro: "Πώς προσθέτουμε δεδομένα στο τέλος ενός αρχείου χωρίς να σβήσουμε τα παλιά, και πώς διαβάζουμε ένα αρχείο με while(!fin.eof()) όταν δεν ξέρουμε πόσα στοιχεία περιέχει;",
  thumb: ICON("eof()", "red"),
  theory: R`
<p>Δύο ερωτήματα εμφανίζονται συνέχεια στα αρχεία C++: (α) πώς <b>προσθέτουμε</b> πληροφορίες σε ένα υπάρχον αρχείο (<b>append</b>) αντί να το ξαναγράψουμε, και (β) πώς διαβάζουμε όλα τα στοιχεία ενός αρχείου όταν <b>δεν γνωρίζουμε το πλήθος</b> τους — με τη συνάρτηση <b>eof()</b> (end of file) και το πρότυπο της <b>αρχικής ανάγνωσης</b>. Και τα δύο εξετάζονται συχνά στις Παγκύπριες Εξετάσεις Πληροφορικής.</p>
<div class="tbox def"><h4>Εγγραφή στο τέλος αρχείου: ios::out | ios::app</h4>
<p>Μια απλή <code>ofstream fout("file.txt");</code> <b>σβήνει</b> το προηγούμενο περιεχόμενο. Για να γράψουμε <b>στο τέλος</b> του αρχείου δημιουργούμε τη ροή με τη λειτουργία <b>append</b>:</p>
${CPP(R`
ofstream myout("file.txt", (ios::out | ios::app));`, { nonum: true })}
${CPP(R`
#include<fstream>
#include<string>
using namespace std;
int main(){
    ifstream fin("names.txt");
    // Δημιουργία ροής εγγραφής στο τέλος του αρχείου (append)
    ofstream fout("append.txt", (ios::out | ios::app));
    string name;
    for(int i=0; i<5; i++){
        fin >> name;
        fout << name << endl;
    }
    fin.close();
    fout.close();
return 0;
}`, { title: "C7_3_example3.cpp", hl: [7] })}
<div class="figrow"><div>${OUT(`Mark
Mason
Mindy
Mike
Matt`, "names.txt")}${OUT(`John
Jamie
Jason
Jonathan`, "append.txt (πριν)")}</div><div>${OUT(`John
Jamie
Jason
Jonathan
Mark
Mason
Mindy
Mike
Matt`, "append.txt (μετά)")}</div></div>
<p>Τα παλιά ονόματα <b>παραμένουν</b> και τα νέα προστίθενται στο τέλος. Αν εκτελέσουμε ξανά το πρόγραμμα, τα 5 ονόματα θα προστεθούν <b>για δεύτερη φορά</b>.</p></div>
<div class="tbox def"><h4>Έλεγχος για το τέλος αρχείου: eof() με αρχική ανάγνωση</h4>
<p>Η συνάρτηση <code>fin.eof()</code> επιστρέφει <code>true</code> όταν η ανάγνωση έχει φτάσει στο <b>τέλος του αρχείου</b>. Για να διαβάσουμε <b>άγνωστο πλήθος</b> στοιχείων χρησιμοποιούμε σταθερά το εξής πρότυπο:</p>
<ol><li><b>Αρχική ανάγνωση</b> πριν από τον βρόχο: <code>fin &gt;&gt; x;</code></li><li><code>while(!fin.eof())</code> — «όσο δεν φτάσαμε στο τέλος».</li><li>Μέσα στον βρόχο: πρώτα <b>επεξεργασία</b> της τιμής που διαβάστηκε και <b>στο τέλος</b> του σώματος η <b>επόμενη ανάγνωση</b>.</li></ol>
${CPP(R`
#include<fstream>
#include<iostream>
#include<iomanip>
#include<string>
using namespace std;
int main(){
    int sum = 0, i = 0;
    string names[1000];        // οι πίνακες δηλώνονται με βάση
    int ages[1000];            // το μέγιστο δυνατό πλήθος (1000)
    double avg;
    ifstream fin("persons.txt");
    fin >> names[i] >> ages[i];         // αρχική ανάγνωση
    while(!fin.eof()){                  // έλεγχος για το τέλος του αρχείου
        sum += ages[i];
        i++;                            // αύξηση πλήθους ατόμων
        fin >> names[i] >> ages[i];     // επόμενη ανάγνωση
    }
    avg = (double) sum / i;
    cout << fixed << setprecision(1) << avg << endl;
    fin.close();
return 0;
}`, { title: "persons_avg.cpp", hl: [12, 13, 16] })}
<div class="figrow"><div>${OUT(`James 45
Johnson 76
Jeremy 58
Jacobs 51`, "persons.txt (με Enter στο τέλος)")}</div><div>${OUT(`57.5`)}</div></div>
<details class="steps"><summary>Λύση βήμα-βήμα (persons.txt με Enter στο τέλος)</summary><table class="tbl"><tr><th>ανάγνωση</th><th>names[i], ages[i]</th><th>eof()</th><th>sum</th><th>i</th></tr><tr><td>αρχική</td><td>James 45</td><td>false</td><td>0</td><td>0</td></tr><tr><td>2η</td><td>Johnson 76</td><td>false</td><td>45</td><td>1</td></tr><tr><td>3η</td><td>Jeremy 58</td><td>false</td><td>121</td><td>2</td></tr><tr><td>4η</td><td>Jacobs 51</td><td>false</td><td>179</td><td>3</td></tr><tr><td>5η (αποτυγχάνει)</td><td>—</td><td><b>true</b></td><td>230</td><td>4</td></tr></table><p>Η 5η ανάγνωση δεν βρίσκει άλλα δεδομένα, η <code>eof()</code> γίνεται <code>true</code> και ο βρόχος σταματά <b>πριν</b> επεξεργαστεί «άκυρη» τιμή. <code>avg = 230/4 = 57.5</code>. Το <code>(double)</code> αποτρέπει την ακέραια διαίρεση και τα <code>fixed &lt;&lt; setprecision(1)</code> (βιβλιοθήκη <code>&lt;iomanip&gt;</code>) δίνουν ένα δεκαδικό ψηφίο.</p></details></div>
<div class="tbox warn"><h4>Προσοχή: Enter στο τέλος της τελευταίας γραμμής</h4>
<p>Στις ασκήσεις, αν δεν αναφέρεται κάτι άλλο, θεωρούμε ότι <b>κάθε γραμμή του αρχείου τελειώνει με Enter</b>, και η τελευταία. (Δεν ισχύει απαραίτητα για αρχεία που γράφουν τα ίδια τα προγράμματα — π.χ. το <code>fout &lt;&lt; sum;</code> δεν γράφει Enter.) Τότε, μετά την ανάγνωση της τελευταίας τιμής, υπάρχει ακόμα το Enter: η <code>eof()</code> είναι <code>false</code>, η τιμή επεξεργάζεται κανονικά και η <b>επόμενη</b> ανάγνωση φτάνει στο τέλος.</p>
<p>Αν όμως η τελευταία γραμμή <b>δεν</b> τελειώνει με Enter, η ανάγνωση της τελευταίας τιμής «χτυπά» ταυτόχρονα και το τέλος του αρχείου: η <code>eof()</code> γίνεται <code>true</code> και η τελευταία τιμή <b>δεν</b> επεξεργάζεται.</p>
${CPP(R`
ifstream fin("nums.txt");
int x, s = 0, cnt = 0;
fin >> x;
while(!fin.eof()){
    s += x;
    cnt++;
    fin >> x;
}
cout << s << " " << cnt;`, { nonum: true })}
<div class="figrow"><div><p class="small"><b>nums.txt</b> = <code>4 7 9</code> + Enter</p>${OUT(`20 3`)}</div><div><p class="small"><b>nums.txt</b> = <code>4 7 9</code> χωρίς Enter στο τέλος</p>${OUT(`11 2`)}</div></div></div>
<div class="tbox rem"><h4>Γιατί αρχική ανάγνωση;</h4><p>Με την αρχική ανάγνωση ο έλεγχος <code>!fin.eof()</code> γίνεται <b>αμέσως μετά από κάθε ανάγνωση</b> και <b>πριν</b> από την επεξεργασία της τιμής. Έτσι δεν προστίθεται ποτέ τιμή από αποτυχημένη ανάγνωση. Το Παράδειγμα 3.4 του βιβλίου γράφει την ανάγνωση στην αρχή του σώματος του βρόχου (χωρίς αρχική ανάγνωση). Με το persons.txt <b>με Enter στο τέλος</b>, η 5η ανάγνωση αποτυγχάνει <b>μέσα</b> στο σώμα, αλλά το <code>i++</code> εκτελείται: μετρά ένα 5ο «φάντασμα» άτομο και (με g++) εμφανίζει <b>46.0</b> αντί για 57.5. Χωρίς Enter στο τέλος δίνει 57.5. Η εκδοχή με αρχική ανάγνωση δίνει το σωστό <b>57.5 με Enter</b> (ενώ χωρίς Enter χάνει την τελευταία εγγραφή: 179/3 = 59.7). Επειδή τα αρχεία δεδομένων κανονικά τελειώνουν με Enter, στις λύσεις μας χρησιμοποιούμε πάντα το πρότυπο «αρχική ανάγνωση – επεξεργασία – επόμενη ανάγνωση».</p></div>
<div class="tbox ex"><h4>getline από αρχείο: αντιγραφή γραμμή-γραμμή</h4>
<p>Το ίδιο πρότυπο ισχύει και με τη <code>getline(fin, line)</code>, που διαβάζει <b>ολόκληρη γραμμή</b> (με τα κενά) από το αρχείο. Το πρόγραμμα αντιγράφει το <code>lines.txt</code> στο <code>copy.txt</code> και μετρά τις γραμμές:</p>
${CPP(R`
ifstream fin("lines.txt");
ofstream fout("copy.txt");
string line;
int n = 0;
getline(fin, line);           // αρχική ανάγνωση
while(!fin.eof()){
    fout << line << endl;
    n++;
    getline(fin, line);       // επόμενη ανάγνωση
}
cout << n;
fin.close();
fout.close();`, { title: "copy_lines.cpp", hl: [5, 6, 9] })}
<div class="figrow"><div>${OUT(`Hello world
C++ files
Pagkypries 2026`, "lines.txt (με Enter στο τέλος)")}</div><div>${OUT(`Hello world
C++ files
Pagkypries 2026`, "copy.txt")}${OUT(`3`)}</div></div></div>
<div class="tbox tip"><h4>Ποια ροή για ποια δουλειά;</h4><table class="tbl"><tr><th>Θέλω να…</th><th>Εντολή</th></tr><tr><td>διαβάσω από αρχείο</td><td><code>ifstream fin("a.txt");</code></td></tr><tr><td>γράψω σε νέο αρχείο / αντικαταστήσω το περιεχόμενο</td><td><code>ofstream fout("a.txt");</code></td></tr><tr><td>προσθέσω στο τέλος υπάρχοντος αρχείου</td><td><code>ofstream fout("a.txt", (ios::out | ios::app));</code></td></tr><tr><td>διαβάσω μέχρι το τέλος</td><td><code>fin &gt;&gt; x;</code> και <code>while(!fin.eof()){ … fin &gt;&gt; x; }</code></td></tr></table></div>
`,
  widget: "ib4append",
  gen: "ib4eof",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια εντολή δημιουργεί ροή εγγραφής <b>στο τέλος</b> του αρχείου <code>log.txt</code>, χωρίς να σβηστεί το περιεχόμενό του;`, options: [R`<code>ofstream fout("log.txt", (ios::out | ios::app));</code>`, R`<code>ofstream fout("log.txt");</code>`, R`<code>ifstream fout("log.txt", (ios::out | ios::app));</code>`, R`<code>ofstream fout("log.txt", ios::eof);</code>`], correct: 0,
      hint: R`app = append.`, sol: R`<code>ofstream fout("log.txt", (ios::out | ios::app));</code>. Χωρίς <code>ios::app</code> το αρχείο ξαναγράφεται από την αρχή.` },
    { level: 1, type: "mc", q: R`Η συνάρτηση <code>fin.eof()</code> επιστρέφει <code>true</code> όταν η ανάγνωση φτάσει στο τέλος του αρχείου.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`eof = end of file.`, sol: R`Σωστό: γι’ αυτό ο βρόχος <code>while(!fin.eof())</code> σημαίνει «όσο δεν φτάσαμε στο τέλος».` },
    { level: 1, type: "mc", q: R`Η εντολή <code>ofstream fout("a.txt");</code> διατηρεί το παλιό περιεχόμενο του <code>a.txt</code> και προσθέτει τα νέα δεδομένα στο τέλος.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Χρειάζεται κάποια ειδική παράμετρος για append;`, sol: R`Λάθος. Χωρίς <code>(ios::out | ios::app)</code> το παλιό περιεχόμενο <b>σβήνεται</b>.` },
    { level: 2, q: R`Το <code>names.txt</code> έχει 5 ονόματα και το <code>append.txt</code> αρχικά 4 ονόματα. Το πρόγραμμα του βιβλίου (Παράδειγμα 3.3, με <code>ios::app</code>) εκτελείται <b>δύο φορές</b>. Πόσα ονόματα θα περιέχει τελικά το <code>append.txt</code>;`, fields: [{ label: "Ονόματα:", ans: 14 }],
      hint: R`Κάθε εκτέλεση προσθέτει 5 ονόματα στο τέλος.`, sol: R`4 + 5 + 5 = <b>14</b>. Το append δεν «ξέρει» ότι τα ονόματα υπάρχουν ήδη — τα ξαναγράφει.` },
    { level: 2, q: R`Το <code>persons.txt</code> περιέχει τις γραμμές <code>Anna 30</code>, <code>Petros 41</code>, <code>Eleni 52</code>, <code>Kostas 25</code> (κάθε γραμμή τελειώνει με Enter). Τι θα εμφανίσει το πρόγραμμα;${CPP(R`
int sum = 0, i = 0;
string names[1000];
int ages[1000];
double avg;
ifstream fin("persons.txt");
fin >> names[i] >> ages[i];
while(!fin.eof()){
    sum += ages[i];
    i++;
    fin >> names[i] >> ages[i];
}
avg = (double) sum / i;
cout << fixed << setprecision(1) << avg << endl;`, {})}`, fields: [{ label: "Έξοδος:", ans: 37, tol: 1e-9 }],
      hint: R`sum / πλήθος, με ένα δεκαδικό.`, sol: R`sum = 30+41+52+25 = 148, i = 4, avg = 37.0 → εμφανίζεται <code>37.0</code>.` },
    { level: 2, q: R`Το <code>nums.txt</code> περιέχει <code>5 8 -3 10 2</code> (με Enter στο τέλος). Τι θα εμφανίσει το πρόγραμμα;${CPP(R`
ifstream fin("nums.txt");
int x, s = 0, cnt = 0;
fin >> x;
while(!fin.eof()){
    s += x;
    cnt++;
    fin >> x;
}
cout << s << " " << cnt;`, {})}`, fields: [{ label: "s =", ans: 22 }, { label: "cnt =", ans: 5 }],
      hint: R`Πρόσθεσε όλους τους αριθμούς και μέτρησέ τους.`, sol: R`s = 5 + 8 − 3 + 10 + 2 = 22, cnt = 5. ${OUT(`22 5`)}` },
    { level: 2, q: R`Το <code>file1.txt</code> περιέχει <code>1 2 3</code> (με Enter στο τέλος) και το <code>file2.txt</code> περιέχει <code>10</code> (χωρίς Enter στο τέλος). Τι θα περιέχει το <code>file2.txt</code> μετά την εκτέλεση;${CPP(R`
ifstream fin("file1.txt");
ofstream fout("file2.txt", (ios::out | ios::app));
int x;
fin >> x;
while(!fin.eof()){
    fout << " " << x * x;
    fin >> x;
}
fin.close();
fout.close();`, {})}`, fields: [{ label: "file2.txt:", ans: "10 1 4 9", text: true }],
      hint: R`Λόγω ios::app, το 10 μένει· προστίθενται τα τετράγωνα.`, sol: R`Λόγω <code>ios::app</code> το 10 μένει και προστίθενται τα τετράγωνα, το καθένα με ένα κενό μπροστά. Επειδή το <code>file2.txt</code> δεν τελείωνε με Enter, γράφονται στην <b>ίδια γραμμή</b> με το 10. ${OUT(`10 1 4 9`, "file2.txt")}(Αν το <code>file2.txt</code> τελείωνε με Enter, το « 1 4 9» θα ξεκινούσε σε νέα γραμμή.)` },
    { level: 3, q: R`Το <code>nums.txt</code> περιέχει <code>6 1 8</code>, αλλά <b>η γραμμή δεν τελειώνει με Enter</b> (το αρχείο τελειώνει ακριβώς μετά το 8). Τι θα εμφανίσει το πρόγραμμα;${CPP(R`
ifstream fin("nums.txt");
int x, s = 0, cnt = 0;
fin >> x;
while(!fin.eof()){
    s += x;
    cnt++;
    fin >> x;
}
cout << s << " " << cnt;`, {})}`, fields: [{ label: "s =", ans: 7 }, { label: "cnt =", ans: 2 }],
      hint: R`Όταν διαβάζεται το 8, η ανάγνωση φτάνει και στο τέλος του αρχείου.`, sol: R`Η ανάγνωση του 8 «χτυπά» το τέλος του αρχείου (δεν ακολουθεί Enter), άρα αμέσως μετά <code>eof()</code> = <code>true</code> και ο βρόχος σταματά <b>πριν</b> προστεθεί το 8: s = 6 + 1 = 7, cnt = 2. ${OUT(`7 2`)}Γι’ αυτό κάθε γραμμή ενός αρχείου δεδομένων πρέπει να τελειώνει με Enter.` },
    { level: 3, q: R`Το πρόγραμμα υπολογίζει το άθροισμα των ακεραίων του <code>askisi5IN.txt</code>. Να γράψετε την εντολή στη θέση <b>Α</b> (αρχική ανάγνωση), τη συνθήκη στη θέση <b>Β</b> (μέχρι το τέλος του αρχείου) και την εντολή στη θέση <b>Γ</b> (άθροισμα).${CPP(R`
ifstream fin("askisi5IN.txt");
ofstream fout("askisi5OUT.txt");
int N, sum = 0;
   A
while(   B   ){
       Γ
    fin >> N;
}
fout << sum;`, {})}`, fields: [{ label: "Α:", ans: ["fin>>N;", "fin>>N"], text: true, nospace: true, cs: true }, { label: "Β:", ans: ["!fin.eof()", "fin.eof()==false", "fin.eof()==0", "!(fin.eof())", "fin.eof()!=true"], text: true, nospace: true, cs: true }, { label: "Γ:", ans: ["sum+=N;", "sum=sum+N;", "sum=N+sum;", "sum+=N", "sum=sum+N", "sum=N+sum"], text: true, nospace: true, cs: true }],
      hint: R`Πρότυπο: αρχική ανάγνωση – έλεγχος eof – επεξεργασία – επόμενη ανάγνωση.`, sol: R`Α: <code>fin &gt;&gt; N;</code> · Β: <code>!fin.eof()</code> · Γ: <code>sum += N;</code> (ή <code>sum = sum + N;</code>). Με <code>askisi5IN.txt</code> = <code>3 9 14 20</code> (και Enter) γράφεται <code>46</code> στο <code>askisi5OUT.txt</code>.` },
    { level: 3, q: R`Το <code>citizens.txt</code> περιέχει ηλικία και όνομα κατοίκων (κάθε γραμμή τελειώνει με Enter). Τι θα περιέχει το <code>elder.txt</code>; (Γράψε τα ονόματα σε μία γραμμή, χωρισμένα με κενό.)${OUT(`30 Mitsos
70 Marikkou
20 Kokos
68 Loizos`, "citizens.txt")}${CPP(R`
ifstream fin("citizens.txt");
ofstream fout("elder.txt");
int age;
string name;
fin >> age >> name;
while(!fin.eof()){
    if(age > 65)
        fout << name << endl;
    fin >> age >> name;
}
fin.close();
fout.close();`, {})}`, fields: [{ label: "elder.txt:", ans: "Marikkou Loizos", text: true }],
      hint: R`Ποιοι έχουν ηλικία μεγαλύτερη από 65;`, sol: R`70 &gt; 65 ✓ και 68 &gt; 65 ✓. ${OUT(`Marikkou
Loizos`, "elder.txt")}` }
  ]
},
/* ───────────────────────────── 6.1 ───────────────────────────── */
{
  id: "6.1", unit: 6, title: "Συναρτήσεις στη C++: ορισμός, κλήση, return και πρότυπο συνάρτησης",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.4 §1–4 Τμηματικός προγραμματισμός, ορισμός και κλήση, εναλλακτικός ορισμός (σ. 131–134)",
  intro: "Τι είναι μια συνάρτηση (function) στη C++, πώς τη γράφουμε, πώς την καλούμε από τη main και τι ακριβώς κάνει η εντολή return;",
  thumb: ICON("f(x)", "purple"),
  theory: R`
<p>Στις <b>συναρτήσεις στη C++</b> στηρίζεται ο <b>τμηματικός προγραμματισμός</b> (modular programming): ένα μεγάλο πρόβλημα το «σπάμε» σε μικρότερα, αυτόνομα κομμάτια κώδικα, τα <b>υποπρογράμματα</b>, που το καθένα εκτελεί ένα συγκεκριμένο έργο και ορίζεται ξεχωριστά από την κύρια συνάρτηση <code>main</code>. Έτσι αποφεύγουμε να γράφουμε τις ίδιες εντολές πολλές φορές, ο κώδικας γίνεται πιο σύντομος και κατανοητός, και η αποσφαλμάτωση (debugging) γίνεται ευκολότερα, αφού ελέγχουμε κάθε κομμάτι χωριστά. Για παράδειγμα, ένα πρόγραμμα βαθμολογίας χωρίζεται φυσικά σε τρία υποπρογράμματα: <i>καταχώριση δεδομένων</i>, <i>επεξεργασία</i> και <i>εμφάνιση αποτελεσμάτων</i>.</p>
<div class="tbox def"><h4>Συνάρτηση (function)</h4>
<p><b>Συνάρτηση</b> είναι ένας τύπος υποπρογράμματος που δέχεται (προαιρετικά) τιμές μέσω <b>παραμέτρων</b>, εκτελεί τις εντολές του σώματός της και <b>επιστρέφει μία τιμή</b> με την εντολή <code>return</code> σε αυτόν που την κάλεσε. Για κάθε συνάρτηση ορίζουμε:</p>
<ul><li><b>Τύπο επιστρεφόμενης τιμής</b>: <code>int</code>, <code>double</code>, <code>float</code>, <code>char</code>, <code>bool</code>, <code>string</code>… ή <code>void</code> αν <b>δεν</b> επιστρέφει τιμή.</li>
<li><b>Όνομα</b> (αναγνωριστικό): ίδιοι κανόνες ονοματολογίας με τις μεταβλητές.</li>
<li><b>Τυπικές παραμέτρους</b>: μεταβλητές με τον τύπο τους, μέσα στις παρενθέσεις· μπορεί να είναι μηδέν ή περισσότερες.</li></ul>
${CPP(R`
#include <iostream>
using namespace std;
int add_2_nums(int a, int b) {     // επικεφαλίδα: τύπος, όνομα, τυπικές παράμετροι
    return a + b;                  // επιστροφή του αθροίσματος
}
int main() {
    cout << add_2_nums(65, 97);    // κλήση με πραγματικές παραμέτρους 65, 97
    return 0;
}`, { title: "add.cpp", hl: [3] })}
${OUT(`162`)}
</div>
<div class="tbox rem"><h4>Επικεφαλίδα, σώμα και κλήση</h4>
<p>Από την <b>επικεφαλίδα</b> <code>int add_2_nums(int a, int b)</code> καταλαβαίνουμε ότι η συνάρτηση επιστρέφει <b>ακέραιο</b>, λέγεται <code>add_2_nums</code> και δέχεται <b>δύο ακέραιες</b> τυπικές παραμέτρους <code>a</code>, <code>b</code>. Το <b>σώμα</b> είναι οι εντολές μέσα στα άγκιστρα.</p>
<p>Στην <b>κλήση</b> <code>add_2_nums(65, 97)</code> οι <b>πραγματικές παράμετροι</b> (ορίσματα) 65 και 97 αντιστοιχίζονται <b>με τη σειρά</b> στις τυπικές: <code>a = 65</code>, <code>b = 97</code>. Η εκτέλεση «πηδά» στο σώμα της συνάρτησης, υπολογίζει την τιμή, την επιστρέφει και η main συνεχίζει από το σημείο της κλήσης. Η κλήση πρέπει να έχει <b>το ίδιο όνομα, το ίδιο πλήθος και τον ίδιο τύπο</b> παραμέτρων με τον ορισμό.</p></div>
<div class="tbox thm"><h4>Η εντολή return τερματίζει τη συνάρτηση</h4>
<p>Μόλις εκτελεστεί ένα <code>return</code>, η συνάρτηση <b>τερματίζει αμέσως</b> και επιστρέφει την τιμή. Αν υπάρχουν πολλά <code>return</code>, θα εκτελεστεί <b>μόνο ένα</b>. Γι' αυτό στο παρακάτω παράδειγμα (Παράδειγμα 4.1 του βιβλίου) το <code>else</code> μπορεί να παραλειφθεί:</p>
${CPP(R`
int max_num(int a, int b) {
    if (a > b)
        return a;      // αν a>b, επιστρέφει a και ΤΕΡΜΑΤΙΖΕΙ
    return b;          // εκτελείται μόνο αν a<=b
}`, { title: "max_num" })}
<p>Συνάρτηση τύπου <code>void</code> δεν επιστρέφει τιμή (δεν χρειάζεται <code>return</code> με τιμή) — π.χ. μια συνάρτηση που απλώς τυπώνει μηνύματα. Μια τέτοια συνάρτηση καλείται ως αυτόνομη εντολή: <code>say_hello();</code>.</p></div>
<div class="tbox def"><h4>Εναλλακτικός ορισμός: πρότυπο (prototype) συνάρτησης</h4>
<p>Μια συνάρτηση πρέπει να είναι γνωστή στον μεταγλωττιστή <b>πριν</b> κληθεί. Δύο τρόποι: (α) γράφουμε ολόκληρο τον ορισμό <b>πάνω από</b> τη main, ή (β) δηλώνουμε μόνο το <b>πρότυπο</b> (την επικεφαλίδα με <code>;</code>) πριν από τη main και γράφουμε τον ορισμό <b>μετά</b> τη main.</p>
${CPP(R`
#include <iostream>
using namespace std;
int max_num(int a, int b);            // πρότυπο συνάρτησης (τελειώνει με ;)
int main() {
    int num1, num2;
    cin >> num1 >> num2;
    cout << max_num(num1, num2);
    return 0;
}
int max_num(int a, int b) {           // ορισμός μετά τη main
    if (a > b)
        return a;
    return b;
}`, { title: "prototype.cpp", hl: [3], stdin: "8 13" })}
${OUT(`13`, "Οθόνη (είσοδος: 8 13)")}
</div>
<div class="tbox ex"><h4>Παραγοντικό με συνάρτηση: x = y! + z!</h4>
<p>Χωρίς συνάρτηση θα γράφαμε δύο φορές τον ίδιο βρόχο. Με τη συνάρτηση <code>factorial</code> τον γράφουμε μία φορά και τον «καλούμε» όσες φορές θέλουμε (Παράδειγμα 4.2).</p>
${CPP(R`
#include <iostream>
using namespace std;
int factorial(int N) {
    int ans = 1;                  // τοπική μεταβλητή
    for (int i = 1; i <= N; i++)
        ans *= i;
    return ans;
}
int main() {
    int y, z;
    cin >> y >> z;
    int x = factorial(y) + factorial(z);
    cout << x << endl;
    return 0;
}`, { title: "factorial.cpp", stdin: "3 4" })}
<details class="steps"><summary>Λύση βήμα-βήμα (είσοδος 3 4)</summary>
${ib6Trace(["κλήση", "N", "i", "ans", "επιστρέφει"], [["factorial(3)", "3", "1, 2, 3", "1 → 1 → 2 → 6", "6"], ["factorial(4)", "4", "1, 2, 3, 4", "1 → 1 → 2 → 6 → 24", "24"]])}
<p>$x = 6 + 24 = 30$.</p>${OUT(`30`)}</details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Κλήση με λάθος πλήθος/τύπο παραμέτρων ή με <code>int</code> μέσα στην κλήση: <code>max_num(int a, int b)</code> ✗ → <code>max_num(a, b)</code> ✓.</li>
<li>Ξεχνάμε το <code>;</code> στο πρότυπο ή το βάζουμε στην επικεφαλίδα του ορισμού (<code>int f(int x); {</code> ✗).</li>
<li>Νομίζουμε ότι εκτελούνται όλα τα <code>return</code>: το πρώτο που συναντάμε τερματίζει τη συνάρτηση.</li>
<li>Συνάρτηση μη-<code>void</code> που σε κάποια διαδρομή δεν επιστρέφει τιμή.</li>
<li>Η τιμή που επιστρέφεται <b>δεν τυπώνεται μόνη της</b>: πρέπει να την εμφανίσουμε (<code>cout &lt;&lt; f(3);</code>) ή να την αποθηκεύσουμε (<code>x = f(3);</code>).</li></ul></div>
`,
  widget: "ib6call",
  gen: "ib6ret",
  exercises: [
    { level: 1, type: "mc", q: R`Δίνεται η επικεφαλίδα <code>double avg(int a, int b, int c)</code>. Ποια πρόταση είναι σωστή;`,
      options: ["Επιστρέφει πραγματικό αριθμό και δέχεται τρεις ακέραιες τυπικές παραμέτρους", "Επιστρέφει ακέραιο και δέχεται τρεις πραγματικές παραμέτρους", "Δεν επιστρέφει τιμή, γιατί έχει παραμέτρους", "Επιστρέφει τρεις τιμές, μία για κάθε παράμετρο"], correct: 0,
      hint: R`Ο τύπος πριν από το όνομα είναι ο τύπος της επιστρεφόμενης τιμής.`, sol: R`Το <code>double</code> μπροστά από το όνομα δηλώνει ότι επιστρέφεται <b>ένας</b> πραγματικός αριθμός· μέσα στις παρενθέσεις υπάρχουν τρεις τυπικές παράμετροι τύπου <code>int</code>. Μια συνάρτηση με <code>return</code> επιστρέφει πάντα <b>μία</b> τιμή.` },
    { level: 1, type: "mc", q: R`Όταν μια συνάρτηση περιέχει περισσότερες από μία εντολές <code>return</code>, κατά την εκτέλεσή της εκτελούνται όλες με τη σειρά.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι γίνεται αμέσως μόλις εκτελεστεί ένα return;`, sol: R`<b>ΛΑΘΟΣ.</b> Με την εκτέλεση της εντολής <code>return</code> η συνάρτηση <b>τερματίζει</b>, άρα σε κάθε κλήση εκτελείται μόνο ένα <code>return</code>.` },
    { level: 1, q: R`Τι θα εμφανίσει το πρόγραμμα;${CPP(R`
#include <iostream>
using namespace std;
int add_2_nums(int a, int b) {
    return a + b;
}
int main() {
    cout << add_2_nums(23, 19) * 2;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: 84 }],
      hint: R`Πρώτα υπολογίζεται η κλήση, μετά ο πολλαπλασιασμός.`, sol: R`$a = 23$, $b = 19$, η συνάρτηση επιστρέφει $42$ και η main εμφανίζει $42 \cdot 2 = 84$.${OUT(`84`)}` },
    { level: 2, q: R`Με προκαταρκτική εκτέλεση βρείτε τι επιστρέφει η συνάρτηση για κάθε τιμή της παραμέτρου.${CPP(R`
int hundreds(int x) {
    if (x / 100 > 1)
        return 1;
    if (x % 100 == 1)
        return 0;
    return -1;
}`)}`, fields: [{ label: "hundreds(100) =", ans: -1 }, { label: "hundreds(250) =", ans: 1 }, { label: "hundreds(101) =", ans: 0 }],
      hint: R`Η <code>/</code> μεταξύ ακεραίων κάνει ακέραια διαίρεση· η <code>%</code> δίνει το υπόλοιπο.`,
      sol: R`${ib6Trace(["x", "x/100", "x/100 &gt; 1", "x%100", "x%100 == 1", "επιστρέφει"], [["100", "1", "F", "0", "F", "−1"], ["250", "2", "T", "", "", "1"], ["101", "1", "F", "1", "T", "0"]])}Για $x = 250$ το πρώτο <code>return</code> τερματίζει τη συνάρτηση, οπότε ο δεύτερος έλεγχος δεν γίνεται καν.` },
    { level: 2, type: "mc", q: R`Θέλουμε συνάρτηση <code>caps</code> που δέχεται έναν χαρακτήρα και επιστρέφει <code>true</code> αν είναι κεφαλαίο γράμμα, αλλιώς <code>false</code>. Ποιο είναι το σωστό πρότυπο;`,
      options: ["<code>bool caps(char letter);</code>", "<code>void caps(char letter);</code>", "<code>char caps(bool letter);</code>", "<code>bool caps(letter);</code>"], correct: 0,
      hint: R`Τι τύπου είναι η τιμή που επιστρέφεται και τι τύπου η παράμετρος;`, sol: R`Επιστρέφει λογική τιμή → <code>bool</code>· δέχεται χαρακτήρα → <code>char letter</code>· το πρότυπο τελειώνει με <code>;</code>. Το <code>void</code> δεν επιστρέφει τιμή και στο <code>caps(letter)</code> λείπει ο τύπος της παραμέτρου.` },
    { level: 2, q: R`Συμπληρώστε το κενό μέσα στη main, ώστε να κληθεί η <code>FirstLetter</code> και ο πρώτος χαρακτήρας της <code>s</code> να αποθηκευτεί στη <code>c</code>.${CPP(R`
#include <iostream>
#include <string>
using namespace std;
char FirstLetter(string st) {
    return st[0];
}
int main() {
    string s;
    char c;
    cin >> s;
    _______________________
    cout << c;
    return 0;
}`)}`, fields: [{ label: "Εντολή:", ans: ["c=FirstLetter(s);", "c=FirstLetter(s)"], text: true, nospace: true, cs: true, ph: "π.χ. x = f(y);" }],
      hint: R`Η τιμή που επιστρέφει η συνάρτηση πρέπει να ανατεθεί στη <code>c</code>.`, sol: R`<code>c = FirstLetter(s);</code> — η πραγματική παράμετρος είναι η <code>s</code> της main και η επιστρεφόμενη τιμή αποθηκεύεται στη <code>c</code>.` },
    { level: 2, q: R`Συμπληρώστε τις τυπικές παραμέτρους της συνάρτησης ώστε το πρόγραμμα να υπολογίζει τον μέσο όρο των ψηφίων των μονάδων τριών ακεραίων.${CPP(R`
float AverageLastDigit(_________________) {
    int d1, d2, d3, sum;
    d1 = x % 10;
    d2 = y % 10;
    d3 = z % 10;
    sum = d1 + d2 + d3;
    return sum / 3.0;
}
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << AverageLastDigit(a, b, c);
    return 0;
}`)}`, fields: [{ label: "Παράμετροι:", ans: ["int x, int y, int z"], text: true, nospace: true, cs: true, ph: "τύπος όνομα, …" }],
      hint: R`Το σώμα χρησιμοποιεί τα ονόματα <code>x</code>, <code>y</code>, <code>z</code> και η κλήση δίνει τρεις ακέραιους.`, sol: R`<code>float AverageLastDigit(int x, int y, int z)</code>: κάθε τυπική παράμετρος γράφεται με τον δικό της τύπο (το <code>int x, y, z</code> δεν επιτρέπεται σε παραμέτρους).` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα; (γράψτε την έξοδο σε μία γραμμή)${CPP(R`
#include <iostream>
using namespace std;
int f(int n) {
    int s = 0;
    for (int i = 1; i <= n; i++)
        if (n % i == 0)
            s += i;
    return s;
}
int main() {
    int a = 6, b;
    b = f(a);
    cout << b << " " << f(b) << " " << f(f(4)) << endl;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "12 28 8", text: true }],
      hint: R`Η <code>f(n)</code> επιστρέφει το άθροισμα όλων των διαιρετών του $n$. Στο <code>f(f(4))</code> υπολογίζεται πρώτα το εσωτερικό.`,
      sol: R`${ib6Trace(["κλήση", "διαιρέτες", "επιστρέφει"], [["f(6)", "1, 2, 3, 6", "12"], ["f(12)", "1, 2, 3, 4, 6, 12", "28"], ["f(4)", "1, 2, 4", "7"], ["f(7)", "1, 7", "8"]])}${OUT(`12 28 8`)}` },
    { level: 3, type: "mc", q: R`Τι θα συμβεί αν μεταγλωττίσουμε το πρόγραμμα;${CPP(R`
#include <iostream>
using namespace std;
int main() {
    cout << triple(5);
    return 0;
}
int triple(int x) {
    return 3 * x;
}`)}`,
      options: ["Σφάλμα μεταγλώττισης: η triple καλείται πριν δηλωθεί — λείπει το πρότυπο <code>int triple(int x);</code> πριν από τη main", "Εμφανίζει 15", "Εμφανίζει 0, γιατί η συνάρτηση δεν έχει εκτελεστεί ακόμη", "Εμφανίζει 5"], correct: 0,
      hint: R`Ο μεταγλωττιστής διαβάζει το αρχείο από πάνω προς τα κάτω.`, sol: R`Στη γραμμή της κλήσης ο μεταγλωττιστής δεν γνωρίζει ακόμη τη <code>triple</code> («was not declared in this scope»). Διόρθωση: πρότυπο <code>int triple(int x);</code> πριν από τη main (ή μεταφορά του ορισμού πάνω από τη main). Τότε θα εμφανιζόταν 15.` },
    { level: 1, type: "mc", q: R`Ποια συνάρτηση πρέπει να δηλωθεί με τύπο <code>void</code>;`,
      options: ["Μια συνάρτηση που απλώς τυπώνει «Hello world» στην οθόνη", "Μια συνάρτηση που επιστρέφει τον μεγαλύτερο από δύο αριθμούς", "Μια συνάρτηση που ελέγχει αν ένας αριθμός είναι πρώτος", "Μια συνάρτηση που υπολογίζει το εμβαδόν κύκλου και το επιστρέφει"], correct: 0,
      hint: R`<code>void</code> = καμία επιστρεφόμενη τιμή.`, sol: R`Η συνάρτηση που μόνο εμφανίζει μήνυμα δεν επιστρέφει τιμή → <code>void say_hello()</code>. Οι άλλες επιστρέφουν <code>int</code>, <code>bool</code>, <code>double</code> αντίστοιχα.` }
  ]
},
/* ───────────────────────────── 6.2 ───────────────────────────── */
{
  id: "6.2", unit: 6, title: "Τοπικές και καθολικές μεταβλητές – εμβέλεια (scope) στη C++",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.4 §5 Τοπικές (local) και καθολικές (global) μεταβλητές (σ. 134–136)",
  intro: "Ποια είναι η διαφορά ανάμεσα σε τοπική και καθολική μεταβλητή και ποια μεταβλητή «βλέπει» κάθε συνάρτηση όταν δύο μεταβλητές έχουν το ίδιο όνομα;",
  thumb: ICON("{ x }", "green"),
  theory: R`
<p>Κάθε μεταβλητή έχει <b>εμβέλεια (scope)</b> ή <b>πεδίο εφαρμογής</b>: το τμήμα του προγράμματος μέσα στο οποίο είναι γνωστή και μπορεί να χρησιμοποιηθεί. Στη C++ διακρίνουμε τις <b>τοπικές μεταβλητές</b> (local variables), που δηλώνονται μέσα σε μια συνάρτηση, και τις <b>καθολικές μεταβλητές</b> (global variables), που δηλώνονται έξω από όλες τις συναρτήσεις — συνήθως αμέσως μετά το <code>using namespace std;</code>.</p>
<div class="tbox def"><h4>Τοπική μεταβλητή (local)</h4>
<p>Δηλώνεται μέσα στο σώμα μιας συνάρτησης (και η main είναι συνάρτηση!) και είναι προσβάσιμη <b>μόνο</b> εκεί. Δημιουργείται όταν καλείται η συνάρτηση και «χάνεται» όταν αυτή τερματίσει. Οι <b>τυπικές παράμετροι</b> συμπεριφέρονται επίσης ως τοπικές μεταβλητές της συνάρτησης. Δύο διαφορετικές συναρτήσεις μπορούν να έχουν τοπικές μεταβλητές με το ίδιο όνομα χωρίς καμία σχέση μεταξύ τους.</p></div>
<div class="tbox def"><h4>Καθολική μεταβλητή (global)</h4>
<p>Δηλώνεται <b>εκτός</b> της main και των άλλων συναρτήσεων και είναι προσβάσιμη από την κύρια συνάρτηση <b>και</b> από όλες τις συναρτήσεις που ορίζονται μετά τη δήλωσή της. Μια αλλαγή της τιμής της μέσα σε μια συνάρτηση φαίνεται παντού. Αν δεν δοθεί αρχική τιμή, μια καθολική μεταβλητή τύπου <code>int</code> ξεκινά με 0.</p></div>
<div class="tbox ex"><h4>Παράδειγμα του βιβλίου: άθροισμα ψηφίων με καθολικό μετρητή</h4>
${CPP(R`
#include <iostream>
using namespace std;
int cnt = 0;                       // καθολική μεταβλητή - μετρητής
int sum_of_digits(int x) {
    int temp = x, sum = 0;         // τοπικές μεταβλητές
    while (temp > 0) {
        sum += temp % 10;
        temp /= 10;
    }
    cnt++;                         // αλλάζει την καθολική cnt
    return sum;
}
int main() {
    int num, total = 0;            // τοπικές της main
    cin >> num;
    while (num != 0) {
        total += sum_of_digits(num);
        cin >> num;
    }
    cout << total << " " << cnt;
    return 0;
}`, { title: "digits.cpp", hl: [3, 10], stdin: "25 103 7 0" })}
<details class="steps"><summary>Λύση βήμα-βήμα (είσοδος 25 103 7 0)</summary>
${ib6Trace(["num", "κλήση", "sum (ψηφία)", "cnt", "total"], [["25", "sum_of_digits(25)", "5 + 2 = 7", "1", "7"], ["103", "sum_of_digits(103)", "3 + 0 + 1 = 4", "2", "11"], ["7", "sum_of_digits(7)", "7", "3", "18"], ["0", "—", "", "", "τέλος βρόχου"]])}
${OUT(`18 3`)}<p>Η <code>cnt</code> είναι καθολική: η <code>sum_of_digits</code> την αυξάνει και η main βλέπει την ίδια μεταβλητή. Οι <code>temp</code>, <code>sum</code> δεν είναι προσβάσιμες από τη main.</p></details></div>
<div class="tbox thm"><h4>Ίδιο όνομα: η τοπική «κρύβει» την καθολική</h4>
<p>Αν μέσα σε μια συνάρτηση δηλωθεί τοπική μεταβλητή με το <b>ίδιο όνομα</b> με μια καθολική, τότε μέσα σε εκείνη τη συνάρτηση το όνομα αναφέρεται στην <b>τοπική</b> (η καθολική «επισκιάζεται» – shadowing). Η καθολική δεν αλλάζει.</p>
${CPP(R`
#include <iostream>
using namespace std;
int x = 10;                  // καθολική x
void f() {
    int x = 3;               // τοπική x της f: κρύβει την καθολική
    x++;
    cout << x << " ";
}
void g() {
    x++;                     // δεν υπάρχει τοπική x: αλλάζει η καθολική
    cout << x << " ";
}
int main() {
    f();
    g();
    cout << x << endl;
    return 0;
}`, { title: "scope.cpp", hl: [5, 10] })}
${OUT(`4 11 11`)}
${ib6Mem([{ t: "Καθολικές", c: "glob", vars: [["x", "10 → 11"]] }, { t: "f() — τοπικές", c: "fn", vars: [["x", "3 → 4"]] }, { t: "g()", c: "fn", vars: [] }], "Η f έχει δική της x· η g δεν έχει, άρα χρησιμοποιεί την καθολική.")}
</div>
<div class="tbox tip"><h4>Πότε καθολική;</h4><p>Οι καθολικές μεταβλητές βολεύουν για τιμές που μοιράζονται πολλές συναρτήσεις (μετρητές, το πλήθος στοιχείων ενός πίνακα, ροές αρχείων <code>ifstream</code>/<code>ofstream</code>). Όμως κάνουν το πρόγραμμα δυσκολότερο στον έλεγχο: όποια συνάρτηση τις αλλάξει, επηρεάζει όλες τις υπόλοιπες. Γενικά προτιμάμε παραμέτρους και τοπικές μεταβλητές.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Χρήση στη main μιας μεταβλητής που δηλώθηκε μόνο μέσα σε συνάρτηση → σφάλμα μεταγλώττισης «not declared in this scope».</li>
<li>Στην προκαταρκτική εκτέλεση ξεχνάμε ότι η καθολική κρατά την τιμή της από κλήση σε κλήση, ενώ οι τοπικές ξαναπαίρνουν αρχική τιμή σε κάθε κλήση.</li>
<li>Με τοπική μεταβλητή ίδιου ονόματος αλλάζουμε κατά λάθος την καθολική στον πίνακα τιμών — η καθολική μένει ίδια.</li>
<li>Σύνθετες συνθήκες: στο <code>if (a &gt; 3 &amp;&amp; f(a))</code> η <code>f</code> <b>δεν καλείται</b> όταν το <code>a &gt; 3</code> είναι ψευδές (βραχυκύκλωμα), άρα δεν αλλάζει καμία καθολική.</li></ul></div>
`,
  widget: "ib6scope",
  gen: "ib6glob",
  exercises: [
    { level: 1, type: "mc", q: R`Μια τοπική μεταβλητή που δηλώνεται μέσα σε μια συνάρτηση είναι προσβάσιμη και από την κύρια συνάρτηση main.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Πού είναι γνωστή μια τοπική μεταβλητή;`, sol: R`<b>ΛΑΘΟΣ.</b> Η τοπική μεταβλητή είναι γνωστή μόνο μέσα στη συνάρτηση όπου δηλώθηκε.` },
    { level: 1, type: "mc", q: R`Μια καθολική μεταβλητή δηλώνεται έξω από όλες τις συναρτήσεις και είναι προσβάσιμη τόσο από τη main όσο και από τις συναρτήσεις του προγράμματος.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Global = …`, sol: R`<b>ΣΩΣΤΟ.</b> Αυτός είναι ακριβώς ο ορισμός της καθολικής (global) μεταβλητής.` },
    { level: 1, type: "mc", q: R`Στη συνάρτηση <code>int sum_of_digits(int x) { int temp = x, sum = 0; … cnt++; return sum; }</code>, όπου η <code>cnt</code> δηλώνεται πριν από τη συνάρτηση έξω από τη main, ποιες είναι οι τοπικές μεταβλητές της συνάρτησης;`,
      options: ["Οι <code>temp</code> και <code>sum</code> (καθώς και η παράμετρος <code>x</code>)", "Μόνο η <code>cnt</code>", "Οι <code>cnt</code>, <code>temp</code> και <code>sum</code>", "Καμία, αφού η συνάρτηση επιστρέφει τιμή"], correct: 0,
      hint: R`Η <code>cnt</code> δηλώθηκε έξω από τις συναρτήσεις.`, sol: R`Οι <code>temp</code>, <code>sum</code> δηλώνονται στο σώμα της συνάρτησης → τοπικές· η τυπική παράμετρος <code>x</code> είναι επίσης τοπική. Η <code>cnt</code> είναι καθολική.` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα με είσοδο <code>25 103 7 0</code>;${CPP(R`
#include <iostream>
using namespace std;
int cnt = 0;
int sum_of_digits(int x) {
    int temp = x, sum = 0;
    while (temp > 0) {
        sum += temp % 10;
        temp /= 10;
    }
    cnt++;
    return sum;
}
int main() {
    int num, total = 0;
    cin >> num;
    while (num != 0) {
        total += sum_of_digits(num);
        cin >> num;
    }
    cout << total << " " << cnt;
    return 0;
}`, { stdin: "25 103 7 0" })}`, fields: [{ label: "Έξοδος:", ans: "18 3", text: true }],
      hint: R`Αθροίσματα ψηφίων: 25 → 7, 103 → 4, 7 → 7. Η <code>cnt</code> αυξάνεται σε κάθε κλήση.`, sol: R`$total = 7 + 4 + 7 = 18$ και η καθολική <code>cnt</code> έγινε 3 (τρεις κλήσεις· για το 0 ο βρόχος σταματά χωρίς κλήση).${OUT(`18 3`)}` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα;${CPP(R`
#include <iostream>
using namespace std;
int x = 10;
void f() {
    int x = 3;
    x++;
    cout << x << " ";
}
void g() {
    x++;
    cout << x << " ";
}
int main() {
    f();
    g();
    f();
    cout << x << endl;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "4 11 4 11", text: true }],
      hint: R`Η f έχει δική της τοπική x που ξαναγίνεται 3 σε κάθε κλήση.`, sol: R`f(): τοπική x = 3 → 4, εμφανίζει 4. g(): καθολική x = 10 → 11, εμφανίζει 11. f(): ξανά τοπική 3 → 4. Τέλος η main εμφανίζει την καθολική 11.${OUT(`4 11 4 11`)}` },
    { level: 2, type: "mc", q: R`Τι θα συμβεί κατά τη μεταγλώττιση;${CPP(R`
#include <iostream>
using namespace std;
void calc() {
    int result = 5 * 4;
}
int main() {
    calc();
    cout << result;
    return 0;
}`)}`,
      options: ["Σφάλμα μεταγλώττισης: η <code>result</code> είναι τοπική της calc και δεν είναι γνωστή στη main", "Εμφανίζει 20", "Εμφανίζει 0", "Εμφανίζει ένα τυχαίο αριθμό"], correct: 0,
      hint: R`Πού δηλώθηκε η <code>result</code>;`, sol: R`Η <code>result</code> ζει μόνο μέσα στην <code>calc</code>· στη main είναι άγνωστη («'result' was not declared in this scope»). Λύση: η calc να επιστρέφει την τιμή (<code>int calc() { return 5 * 4; }</code> και <code>cout &lt;&lt; calc();</code>).` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα;${CPP(R`
#include <iostream>
using namespace std;
int total = 0;
void add(int v) {
    total += v;
}
int twice(int v) {
    int total = v * 2;
    return total;
}
int main() {
    add(4);
    add(twice(3));
    cout << total << " " << twice(total) << endl;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "10 20", text: true }],
      hint: R`Η twice έχει τοπική <code>total</code>· η add αλλάζει την καθολική.`,
      sol: R`${ib6Trace(["εντολή", "καθολική total", "επιστρέφει"], [["add(4)", "4", ""], ["twice(3)", "4 (η τοπική total = 6)", "6"], ["add(6)", "10", ""], ["twice(10)", "10", "20"]])}${OUT(`10 20`)}` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα; Προσοχή στη σύνθετη συνθήκη.${CPP(R`
#include <iostream>
using namespace std;
int cnt = 0;
bool even(int n) {
    cnt++;
    return n % 2 == 0;
}
int main() {
    int p = 0;
    for (int i = 1; i <= 7; i++)
        if (i > 3 && even(i))
            p++;
    cout << p << " " << cnt << endl;
    return 0;
}`)}`, fields: [{ label: "p =", ans: 2 }, { label: "cnt =", ans: 4 }],
      hint: R`Στο <code>&amp;&amp;</code>, αν το πρώτο σκέλος είναι ψευδές, το δεύτερο (η κλήση) δεν υπολογίζεται.`,
      sol: R`Για $i = 1, 2, 3$ το <code>i &gt; 3</code> είναι ψευδές, άρα η <code>even</code> <b>δεν καλείται</b>. Για $i = 4, 5, 6, 7$ καλείται 4 φορές (<code>cnt = 4</code>) και επιστρέφει true για 4 και 6 (<code>p = 2</code>).${OUT(`2 4`)}` },
    { level: 1, type: "mc", q: R`Τι ονομάζουμε <b>εμβέλεια</b> (scope) ή πεδίο εφαρμογής μιας μεταβλητής;`,
      options: ["Το τμήμα του προγράμματος μέσα στο οποίο η μεταβλητή είναι γνωστή και μπορεί να χρησιμοποιηθεί", "Το εύρος τιμών που μπορεί να πάρει η μεταβλητή", "Το πλήθος των bytes που καταλαμβάνει στη μνήμη", "Τον τύπο δεδομένων της μεταβλητής"], correct: 0,
      hint: R`Scope = «πού είναι ορατή».`, sol: R`Εμβέλεια είναι η περιοχή του κώδικα όπου το όνομα της μεταβλητής είναι ορατό: για μια τοπική, το σώμα της συνάρτησης· για μια καθολική, όλο το πρόγραμμα μετά τη δήλωσή της.` }
  ]
},
/* ───────────────────────────── 6.3 ───────────────────────────── */
{
  id: "6.3", unit: 6, title: "Παράμετροι τιμών (by value) και αναφοράς (by reference) στη C++",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.4 §6 Παράμετροι τιμών και παράμετροι αναφοράς (σ. 136–139) · Παράρτημα: προκαταρκτική εκτέλεση υποπρογραμμάτων",
  intro: "Γιατί μια συνάρτηση C++ άλλοτε αλλάζει και άλλοτε όχι τις μεταβλητές της main — τι κάνει το σύμβολο & στις παραμέτρους αναφοράς;",
  thumb: ICON("&ref", "amber"),
  theory: R`
<p>Η εντολή <code>return</code> επιστρέφει <b>μία</b> μόνο τιμή. Όταν θέλουμε μια συνάρτηση να «επηρεάσει» περισσότερες μεταβλητές της main — π.χ. να υπολογίσει και εμβαδόν και περίμετρο, ή να αντιμεταθέσει δύο τιμές — χρησιμοποιούμε <b>παραμέτρους αναφοράς (by reference)</b> με τον τελεστή <code>&amp;</code>. Οι συνηθισμένες παράμετροι είναι <b>παράμετροι τιμών (by value)</b>. Η διάκριση αυτή είναι από τα πιο συχνά θέματα <b>προκαταρκτικής εκτέλεσης</b> στις Παγκύπριες.</p>
<div class="tbox def"><h4>Παράμετρος τιμής (by value)</h4>
<p>Η τυπική παράμετρος παίρνει ένα <b>αντίγραφο</b> της τιμής της πραγματικής παραμέτρου. Ό,τι αλλαγή γίνει μέσα στη συνάρτηση αφορά μόνο το αντίγραφο· η μεταβλητή της main <b>δεν αλλάζει</b>. Επικεφαλίδα: <code>void byvalue(int x)</code>.</p></div>
<div class="tbox def"><h4>Παράμετρος αναφοράς (by reference)</h4>
<p>Με <code>&amp;</code> πριν από το όνομα (<code>void byreference(int &amp;y)</code>) η τυπική παράμετρος γίνεται <b>ψευδώνυμο</b> (άλλο όνομα) της πραγματικής μεταβλητής: περνάμε τη <b>διεύθυνση</b> της μεταβλητής και όχι την τιμή της. Κάθε αλλαγή στην παράμετρο <b>αλλάζει και τη μεταβλητή της main</b>. Η πραγματική παράμετρος πρέπει να είναι μεταβλητή (όχι σταθερά ή παράσταση, π.χ. όχι <code>byreference(5)</code>).</p>
<p>Ο ίδιος τελεστής δημιουργεί και <b>μεταβλητές αναφοράς</b>: μετά το <code>int x = 5; int &amp;y = x;</code> η <code>y</code> είναι άλλο όνομα της <code>x</code>· το <code>y = 10;</code> κάνει και την <code>x</code> 10. Η θέση του κενού δεν παίζει ρόλο: <code>int &amp;y</code>, <code>int&amp; y</code>, <code>int &amp; y</code> είναι ισοδύναμα.</p></div>
<div class="tbox ex"><h4>Παράδειγμα 4.3: τιμή ή αναφορά;</h4>
${CPP(R`
#include <iostream>
using namespace std;
void byvalue(int x) {          // παράμετρος τιμής
    x = x + 1;
    cout << x << endl;
}
void byreference(int &y) {     // παράμετρος αναφοράς
    y = y + 1;
    cout << y << endl;
}
int main() {
    int num = 5;
    byvalue(num);
    cout << "number=" << num << endl;
    byreference(num);
    cout << "number=" << num << endl;
    return 0;
}`, { title: "byref.cpp", hl: [4, 8] })}
<div class="figrow"><div>${OUT(`
6
number=5
6
number=6`)}</div><div>${ib6Mem([{ t: "main", c: "main", vars: [["num", "5 → 6"]] }, { t: "byreference", c: "fn", vars: [["y", "→ num", "αναφορά"]] }])}</div></div>
<p>Στην <code>byvalue</code> η <code>x</code> είναι αντίγραφο: γίνεται 6, αλλά η <code>num</code> μένει 5. Στη <code>byreference</code> η <code>y</code> «δείχνει» στη <code>num</code>, οπότε η <code>num</code> γίνεται 6.</p></div>
<div class="tbox ex"><h4>Παράδειγμα 4.4 και 4.5: αντιμετάθεση και «επιστροφή» δύο τιμών</h4>
${CPP(R`
void swap(int &a, int &b) {          // αντιμετάθεση με βοηθητική μεταβλητή
    int temp;
    temp = a;
    a = b;
    b = temp;
}
void rectangle(int h, int w, int &E, int &P) {
    E = h * w;                       // «επιστρέφει» εμβαδόν
    P = (h + w) * 2;                 // και περίμετρο μέσω αναφοράς
}`, { title: "swap_rectangle" })}
<p>Με την κλήση <code>swap(x, y);</code> οι <code>x</code>, <code>y</code> της main ανταλλάσσουν τιμές. Με <code>rectangle(mikos, platos, emv, per);</code> οι <code>emv</code>, <code>per</code> παίρνουν τιμή μέσα στη συνάρτηση, ενώ τα <code>mikos</code>, <code>platos</code> περνούν με τιμή.</p></div>
<div class="tbox thm"><h4>Προκαταρκτική εκτέλεση με παραμέτρους αναφοράς (Παράδειγμα 4.6)</h4>
${CPP(R`
#include <iostream>
using namespace std;
int check(int a, int &b) {      // a: τιμής, b: αναφοράς
    b += 2;
    if (a > b)
        return a;
    return a + b;
}
int main() {
    int x = 3, y = 2;
    if (x > y)
        cout << check(x, y) << endl;
    else
        cout << check(y, x) << endl;
    cout << x << " " << y << endl;
    return 0;
}`, { title: "check.cpp" })}
<details class="steps"><summary>Λύση βήμα-βήμα (όπως στο εξεταστικό δοκίμιο)</summary>
${ib6Trace(["x", "y", "x&gt;y", "T/F", "Παρουσίαση"], [["3", "2", "3&gt;2", "T", ""], ["", "4", "", "", "7"], ["", "", "", "", "3 4"]], "Κύρια συνάρτηση (main)")}
${ib6Trace(["a (τιμής)", "b (αναφοράς → y)", "a&gt;b", "T/F", "Επιστρέφει"], [["3", "2", "", "", ""], ["", "4", "3&gt;4", "F", "7"]], "Συνάρτηση check")}
<p>Η <code>b</code> είναι ψευδώνυμο της <code>y</code>, οπότε το <code>b += 2</code> κάνει την <code>y</code> 4. Η συνάρτηση επιστρέφει $3 + 4 = 7$.</p>${OUT(`
7
3 4`)}</details>
<p>Στο εξεταστικό δοκίμιο η προκαταρκτική εκτέλεση γράφεται με <b>ξεχωριστό πίνακα για κάθε συνάρτηση</b>: για τη main οι μεταβλητές, οι αποφάσεις και η παρουσίαση· για τη συνάρτηση οι τυπικές παράμετροι τιμών, οι τυπικές παράμετροι αναφοράς, οι αποφάσεις και η τιμή που επιστρέφει. Η <b>παρουσίαση</b> είναι ενιαία για όλο το πρόγραμμα, όπως θα φαινόταν στην οθόνη.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li>Αντιστοίχιση παραμέτρων <b>κατά θέση</b>, όχι κατά όνομα: στο <code>change(z, y, x)</code> η 1η τυπική παίρνει τη <code>z</code>, η 2η τη <code>y</code>, η 3η τη <code>x</code>.</li>
<li>Αλλάζουμε στον πίνακα τιμών τη μεταβλητή της main ενώ η παράμετρος είναι <b>τιμής</b> (χωρίς &amp;).</li>
<li>Ξεχνάμε ότι μετά την κλήση η μεταβλητή της main έχει πλέον <b>τη νέα τιμή</b> για τις επόμενες εντολές και κλήσεις.</li>
<li>Το <code>&amp;</code> γράφεται στον <b>ορισμό</b> της συνάρτησης (και στο πρότυπο), <b>όχι</b> στην κλήση: <code>swap(x, y);</code> ✓, <code>swap(&amp;x, &amp;y);</code> ✗.</li></ul></div>
`,
  widget: "ib6ref",
  gen: "ib6byref",
  exercises: [
    { level: 1, type: "mc", q: R`Όταν μια παράμετρος περνά <b>με τιμή</b> (by value), οι αλλαγές της μέσα στη συνάρτηση δεν επηρεάζουν την πραγματική παράμετρο της main.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Η συνάρτηση δουλεύει σε αντίγραφο.`, sol: R`<b>ΣΩΣΤΟ.</b> Η τυπική παράμετρος τιμής είναι αντίγραφο· μόνο οι παράμετροι αναφοράς (<code>&amp;</code>) αλλάζουν τη μεταβλητή της main.` },
    { level: 1, type: "mc", q: R`Μετά τις εντολές <code>int x = 5; int &amp;y = x; y = 10;</code> ποια είναι η τιμή της <code>x</code>;`,
      options: ["10, γιατί η y είναι μεταβλητή αναφοράς (άλλο όνομα) της x", "5, γιατί αλλάξαμε μόνο την y", "15", "Σφάλμα μεταγλώττισης"], correct: 0,
      hint: R`Τι σημαίνει <code>int &amp;y = x;</code>;`, sol: R`Η <code>y</code> είναι ψευδώνυμο της <code>x</code> (ίδια θέση μνήμης), άρα <code>y = 10</code> σημαίνει <code>x = 10</code>.` },
    { level: 1, q: R`Τι θα εμφανίσει το πρόγραμμα; (γράψτε την έξοδο σε μία γραμμή, χωρίς τις αλλαγές γραμμής)${CPP(R`
#include <iostream>
using namespace std;
void byvalue(int x) {
    x = x + 1;
    cout << x << endl;
}
void byreference(int &y) {
    y = y + 1;
    cout << y << endl;
}
int main() {
    int num = 5;
    byvalue(num);
    cout << "number=" << num << endl;
    byreference(num);
    cout << "number=" << num << endl;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "6 number=5 6 number=6", text: true }],
      hint: R`Μόνο η <code>byreference</code> αλλάζει τη <code>num</code>.`, sol: R`${OUT(`
6
number=5
6
number=6`)}Η <code>byvalue</code> αυξάνει ένα αντίγραφο· η <code>byreference</code> αυξάνει την ίδια τη <code>num</code>.` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα με είσοδο <code>13 19</code>; (σε μία γραμμή)${CPP(R`
#include <iostream>
using namespace std;
void swap(int &a, int &b) {
    int temp;
    temp = a;
    a = b;
    b = temp;
}
int main() {
    int x, y;
    cin >> x >> y;
    swap(x, y);
    cout << "x=" << x << endl;
    cout << "y=" << y << endl;
    return 0;
}`, { stdin: "13 19" })}`, fields: [{ label: "Έξοδος:", ans: "x=19 y=13", text: true }],
      hint: R`Οι a, b είναι ψευδώνυμα των x, y.`, sol: R`temp = 13, a (=x) = 19, b (=y) = 13.${OUT(`
x=19
y=13`)}` },
    { level: 2, type: "mc", q: R`Θέλουμε συνάρτηση <code>rectangle</code> που δέχεται μήκος και πλάτος ορθογωνίου και «επιστρέφει» στη main το εμβαδόν και την περίμετρο. Ποια επικεφαλίδα είναι κατάλληλη;`,
      options: ["<code>void rectangle(int h, int w, int &amp;E, int &amp;P)</code>", "<code>void rectangle(int h, int w, int E, int P)</code>", "<code>int rectangle(int &amp;h, int &amp;w)</code>", "<code>void rectangle(int &amp;h, int &amp;w, int E, int P)</code>"], correct: 0,
      hint: R`Οι τιμές που πρέπει να «γυρίσουν» στη main χρειάζονται <code>&amp;</code>.`, sol: R`Το μήκος και το πλάτος είναι δεδομένα (με τιμή)· το εμβαδόν και η περίμετρος είναι αποτελέσματα που πρέπει να φτάσουν στη main → παράμετροι αναφοράς <code>int &amp;E, int &amp;P</code>. Με <code>return</code> θα επιστρεφόταν μόνο μία τιμή.` },
    { level: 2, q: R`Με προκαταρκτική εκτέλεση βρείτε τι θα εμφανίσει το πρόγραμμα (έξοδος σε μία γραμμή).${CPP(R`
#include <iostream>
using namespace std;
int f1(int x, int &y) {
    int s;
    s = x + y;
    x = s / 10;
    y = s % 10;
    cout << x << endl << y << endl;
    return x + y;
}
int main() {
    int a = 11, b = 12, c;
    c = f1(a, b);
    cout << a << endl;
    cout << b << endl;
    cout << c << endl;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "2 3 11 3 5", text: true }],
      hint: R`Η x είναι τιμής (αντίγραφο της a), η y αναφοράς (ψευδώνυμο της b).`,
      sol: R`${ib6Trace(["x (τιμής)", "y (αναφοράς → b)", "s", "Επιστρέφει"], [["11", "12", "23", ""], ["2", "3", "", "5"]], "Συνάρτηση f1")}Η <code>a</code> μένει 11, η <code>b</code> έγινε 3, η <code>c</code> = 5.${OUT(`
2
3
11
3
5`)}` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα; (γράψτε τις τέσσερις γραμμές της εξόδου σε μία γραμμή)${CPP(R`
#include <iostream>
using namespace std;
void change(int a, int &b, int &c) {
    a += 4;
    b += 5;
    c += 6;
    cout << a << " " << b << " " << c << endl;
}
int main() {
    int x = 2, y = 1, z = 3;
    change(z, y, x);
    cout << x << " " << y << " " << z << endl;
    change(y, x, z);
    cout << x << " " << y << " " << z << endl;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "7 6 8 8 6 3 10 13 9 13 6 9", text: true }],
      hint: R`Αντιστοίχιση κατά θέση! Στην 1η κλήση: a ← z (τιμή), b → y, c → x.`,
      sol: R`<b>1η κλήση</b> <code>change(z, y, x)</code>: a = 3 + 4 = 7, b (=y) = 1 + 5 = 6, c (=x) = 2 + 6 = 8 → εμφανίζει <code>7 6 8</code>· η main έχει x = 8, y = 6, z = 3.<br><b>2η κλήση</b> <code>change(y, x, z)</code>: a = 6 + 4 = 10, b (=x) = 8 + 5 = 13, c (=z) = 3 + 6 = 9 → <code>10 13 9</code>· η main έχει x = 13, y = 6, z = 9.${OUT(`
7 6 8
8 6 3
10 13 9
13 6 9`)}` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα; (σε μία γραμμή)${CPP(R`
#include <iostream>
using namespace std;
int check(int a, int &b) {
    b += 2;
    if (a > b)
        return a;
    return a + b;
}
int main() {
    int x = 3, y = 2;
    if (x > y)
        cout << check(x, y) << endl;
    else
        cout << check(y, x) << endl;
    cout << x << " " << y << endl;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "7 3 4", text: true }],
      hint: R`x &gt; y, άρα καλείται <code>check(x, y)</code> με b → y.`, sol: R`b (=y) = 2 + 2 = 4· 3 &gt; 4 ψευδές → επιστρέφει 3 + 4 = 7. Η y έγινε 4.${OUT(`
7
3 4`)}` },
    { level: 3, q: R`Με είσοδο <code>5 4 2</code>, ποιες τιμές θα εμφανιστούν;${CPP(R`
#include <iostream>
using namespace std;
void perivol(int length, int width, int height, int &perimeter, int &volume) {
    perimeter = length + 2 * width * height;
    volume = length * width * height;
}
int main() {
    int len, wid, heit, perim, vol;
    cin >> len >> wid >> heit;
    perivol(len, wid, heit, perim, vol);
    cout << perim << " " << vol << endl;
    return 0;
}`, { stdin: "5 4 2" })}`, fields: [{ label: "perim =", ans: 21 }, { label: "vol =", ans: 40 }],
      hint: R`Ακολουθήστε τον τύπο ακριβώς όπως είναι γραμμένος (προτεραιότητα πράξεων!).`, sol: R`perimeter = 5 + 2·4·2 = 21, volume = 5·4·2 = 40. Επειδή είναι παράμετροι αναφοράς, οι τιμές φτάνουν στις <code>perim</code>, <code>vol</code> της main.${OUT(`21 40`)}` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα; (σε μία γραμμή)${CPP(R`
#include <iostream>
using namespace std;
int g(int &a, int b) {
    a = a + b;
    b = b * 2;
    return a + b;
}
int main() {
    int x = 3, y = 4, z;
    z = g(x, y);
    cout << x << " " << y << " " << z << endl;
    z = g(y, x);
    cout << x << " " << y << " " << z << endl;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "7 4 15 7 11 25", text: true }],
      hint: R`Στη δεύτερη κλήση η αναφορά δείχνει στη y και η τιμή που περνά είναι η νέα x.`,
      sol: R`<code>g(x, y)</code>: a (=x) = 3 + 4 = 7, b = 8, επιστρέφει 15 → <code>7 4 15</code>.<br><code>g(y, x)</code>: a (=y) = 4 + 7 = 11, b = 14, επιστρέφει 25 → <code>7 11 25</code>.${OUT(`
7 4 15
7 11 25`)}` }
  ]
},
/* ───────────────────────────── 6.4 ───────────────────────────── */
{
  id: "6.4", unit: 6, title: "Πίνακες και αρχεία σε συναρτήσεις C++",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.4 §7 Πίνακες και συναρτήσεις, §8 Αρχεία και συναρτήσεις (σ. 140–143)",
  intro: "Πώς περνάμε έναν πίνακα σε μια συνάρτηση C++, γιατί οι αλλαγές του φαίνονται στη main χωρίς &, και πώς χρησιμοποιούμε αρχεία μέσα σε συναρτήσεις;",
  thumb: ICON("f(a[])", "blue"),
  theory: R`
<p>Στα προβλήματα των Παγκυπρίων οι <b>συναρτήσεις με πίνακες</b> είναι πολύ συχνές: μια συνάρτηση <code>fill</code> γεμίζει τον πίνακα, μια <code>print</code> τον εμφανίζει, μια <code>average</code> ή <code>max_grade</code> υπολογίζει κάτι από αυτόν. Επίσης, τα <b>αρχεία σε συναρτήσεις</b> χρησιμοποιούνται με ροές <code>ifstream</code>/<code>ofstream</code> δηλωμένες ως καθολικές.</p>
<div class="tbox def"><h4>Πίνακας ως παράμετρος</h4>
<p>Ένας πίνακας έχει πολλές τιμές, γι' αυτό περνά πάντα <b>ως παράμετρος αναφοράς</b>: η συνάρτηση παίρνει τη <b>διεύθυνση</b> του πίνακα και δουλεύει πάνω στον <b>ίδιο</b> πίνακα της main. Ιδιαιτερότητες:</p>
<ul><li>Στην επικεφαλίδα γράφουμε <code>int arr[]</code> — <b>χωρίς</b> <code>&amp;</code> και συνήθως χωρίς μέγεθος.</li>
<li>Στην κλήση γράφουμε <b>μόνο το όνομα</b> του πίνακα: <code>fill(A);</code> (όχι <code>fill(A[]);</code> ή <code>fill(A[N]);</code>).</li>
<li>Το μέγεθος το δίνουμε με σταθερά <code>const int N = 20;</code>, με καθολική μεταβλητή ή με επιπλέον παράμετρο <code>int n</code>.</li>
<li>Κάθε αλλαγή στα στοιχεία μέσα στη συνάρτηση <b>φαίνεται στη main</b>.</li></ul>
${CPP(R`
#include <iostream>
using namespace std;
const int N = 20;
void fill(int arr[]);        // πρότυπα συναρτήσεων
void print(int arr[]);
int main() {
    int A[N];
    fill(A);                 // μόνο το όνομα του πίνακα
    print(A);
    return 0;
}
void fill(int arr[]) {
    for (int i = 0; i < N; i++)
        cin >> arr[i];
}
void print(int arr[]) {
    for (int i = 0; i < N; i++)
        cout << arr[i] << " ";
}`, { title: "fill_print.cpp", hl: [4, 5, 8] })}
<div class="tbox rem"><h4>const int N ή #define N;</h4><p>Το βιβλίο δηλώνει συχνά το μέγεθος με την οδηγία <code>#define N 20</code>. Εδώ γράφουμε <code>const int N = 20;</code> (σταθερά της C++). Και οι δύο τρόποι είναι σωστοί και γίνονται δεκτοί στις εξετάσεις.</p></div>
</div>
<div class="tbox ex"><h4>Πίνακας «αλλάζει», απλή μεταβλητή όχι</h4>
${CPP(R`
#include <iostream>
using namespace std;
const int N = 5;
void change(int arr[], int k) {
    for (int i = 0; i < N; i++)
        if (i % 2 == 0)
            arr[i] += k;
    k = 0;                         // αλλάζει μόνο το αντίγραφο
}
int main() {
    int A[N] = {1, 2, 3, 4, 5};
    int k = 10;
    change(A, k);
    for (int i = 0; i < N; i++)
        cout << A[i] << " ";
    cout << k << endl;
    return 0;
}`, { title: "array_param.cpp" })}
${OUT(`11 2 13 4 15 10`)}
${ib6Mem([{ t: "main", c: "main", vars: [["A", ["11", "2", "13", "4", "15"]], ["k", "10"]] }, { t: "change", c: "fn", vars: [["arr", "→ A", "ίδιος πίνακας"], ["k", "10 → 0", "αντίγραφο"]] }], "Ο πίνακας περνά με αναφορά (χωρίς &), το k με τιμή.")}
</div>
<div class="tbox ex"><h4>Παράδειγμα 4.8: βαθμοί και ονόματα σε παράλληλους πίνακες</h4>
${CPP(R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
const int N = 25;
void read(int grades[], string names[]) {
    for (int i = 0; i < N; i++)
        cin >> grades[i] >> names[i];
}
double average(int grades[]) {
    int sum = 0;
    for (int i = 0; i < N; i++)
        sum += grades[i];
    return (double) sum / N;           // μετατροπή για πραγματική διαίρεση
}
string max_grade(int grades[], string names[]) {
    int maxg = grades[0];
    string maxn = names[0];
    for (int i = 1; i < N; i++)
        if (grades[i] > maxg) {
            maxg = grades[i];
            maxn = names[i];
        }
    return maxn;
}
int main() {
    int vathmoi[N];
    string onomata[N];
    read(vathmoi, onomata);
    cout << "Avg=" << fixed << setprecision(1) << average(vathmoi) << endl;
    cout << "Best student=" << max_grade(vathmoi, onomata) << endl;
    return 0;
}`, { title: "grades.cpp", hl: [14] })}
<p>Η <code>average</code> επιστρέφει <code>double</code>· το <code>(double) sum / N</code> χρειάζεται, αλλιώς η <code>sum / N</code> θα ήταν <b>ακέραια διαίρεση</b>. Μια συνάρτηση μπορεί να επιστρέψει και <code>string</code> (εδώ το όνομα του καλύτερου μαθητή).</p></div>
<div class="tbox def"><h4>Αρχεία και συναρτήσεις</h4>
<p>Για να χρησιμοποιούν πολλές συναρτήσεις το ίδιο αρχείο, δηλώνουμε τις ροές <code>ifstream</code> / <code>ofstream</code> <b>έξω από τη main</b> (καθολικές). Παράδειγμα 4.9: η <code>fill</code> διαβάζει ακεραίους από το <code>numbers.txt</code>, η <code>square</code> ελέγχει αν ένας αριθμός είναι τέλειο τετράγωνο και η <code>print</code> γράφει τα τέλεια τετράγωνα στο <code>squares.txt</code>.</p>
${CPP(R`
#include <iostream>
#include <fstream>
#include <cmath>
using namespace std;
ifstream fin("numbers.txt");       // ροές δηλωμένες εκτός main
ofstream fout("squares.txt");
int cnt = 0;                       // πλήθος ακεραίων (καθολική)
void fill(int nums[]) {
    int x;
    fin >> x;                      // πρώτη ανάγνωση (πριν από τον βρόχο)
    while (!fin.eof()) {
        nums[cnt] = x;
        cnt++;
        fin >> x;                  // επόμενη ανάγνωση στο τέλος του βρόχου
    }
}
bool square(int n) {
    int x = (int)(sqrt(n) + 0.5);
    if (x * x == n)
        return true;
    return false;
}
void print(int nums[]) {
    for (int i = 0; i < cnt; i++)
        if (square(nums[i]))
            fout << nums[i] << " ";
}
int main() {
    int numbers[100];
    fill(numbers);
    print(numbers);
    fin.close();
    fout.close();
    return 0;
}`, { title: "squares.cpp", hl: [5, 6], files: { "numbers.txt": "13 19 25 41 82 16 49 54 112 90\n" }, outfile: "squares.txt" })}
<div class="figrow"><div>${OUT(`13 19 25 41 82 16 49 54 112 90`, "numbers.txt (με Enter στο τέλος)")}</div><div>${OUT(`25 16 49`, "squares.txt")}</div></div>
<div class="tbox rem"><h4>Διαφορά από το βιβλίο</h4><p>Στο Παράδειγμα 4.9 το βιβλίο γράφει τη <code>fill</code> με την ανάγνωση <b>μέσα</b> στον βρόχο (<code>while (!fin.eof()) { fin &gt;&gt; nums[cnt]; cnt++; }</code>). Αν το αρχείο τελειώνει με Enter, αυτή η εκδοχή μετρά <b>ένα στοιχείο παραπάνω</b> (η τελευταία, αποτυχημένη ανάγνωση αυξάνει κι αυτή το <code>cnt</code>). Εδώ χρησιμοποιούμε τη μορφή «ανάγνωση πριν από τον βρόχο – νέα ανάγνωση στο τέλος», που είναι η πρότυπη μορφή για τις εξετάσεις.</p></div>
<p>Η <code>fill</code> ακολουθεί το γνωστό σχήμα ανάγνωσης αρχείου: <b>μία ανάγνωση πριν από τον βρόχο</b>, επεξεργασία, και <b>νέα ανάγνωση στο τέλος</b> του σώματος του <code>while (!fin.eof())</code>. Η <code>print</code> καλεί μέσα της την <code>square</code>: μια συνάρτηση μπορεί να καλεί άλλη συνάρτηση.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<ul><li><code>void f(int &amp;arr[])</code> ✗ — ο πίνακας περνά ήδη με αναφορά: <code>void f(int arr[])</code> ✓.</li>
<li>Κλήση <code>f(A[]);</code> ή <code>f(A[N]);</code> ✗ → <code>f(A);</code> ✓ (το <code>A[N]</code> θα ήταν ένα στοιχείο — και μάλιστα εκτός ορίων).</li>
<li>Μέσα στη συνάρτηση χρησιμοποιούμε το όνομα του πίνακα της main αντί για το όνομα της παραμέτρου.</li>
<li><code>return sum / N;</code> με ακέραια <code>sum</code> → ακέραια διαίρεση· χρειάζεται <code>(double) sum / N</code>.</li></ul></div>
`,
  widget: "ib6arr",
  gen: "ib6arrg",
  exercises: [
    { level: 1, type: "mc", q: R`Για να περάσουμε έναν πίνακα σε συνάρτηση ως παράμετρο αναφοράς, γράφουμε τον τελεστή <code>&amp;</code> πριν από το όνομά του στην επικεφαλίδα.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Πώς είναι γραμμένη η <code>void fill(int arr[])</code>;`, sol: R`<b>ΛΑΘΟΣ.</b> Ο πίνακας περνά πάντα με αναφορά (περνά η διεύθυνσή του), αλλά <b>δεν</b> χρησιμοποιείται ο τελεστής <code>&amp;</code>: <code>void fill(int arr[])</code>.` },
    { level: 1, type: "mc", q: R`Δίνεται η συνάρτηση <code>void print(int arr[])</code> και ο πίνακας <code>int A[N];</code> της main. Ποια κλήση είναι σωστή;`,
      options: ["<code>print(A);</code>", "<code>print(A[]);</code>", "<code>print(A[N]);</code>", "<code>print(int A[]);</code>"], correct: 0,
      hint: R`Στην κλήση δηλώνουμε μόνο το όνομα του πίνακα.`, sol: R`<code>print(A);</code>. Το <code>A[N]</code> θα ήταν ένα (ανύπαρκτο) στοιχείο, και ο τύπος <code>int</code> δεν γράφεται στην κλήση.` },
    { level: 2, q: R`Συμπληρώστε την επικεφαλίδα (Α) της συνάρτησης που υπολογίζει το άθροισμα των στοιχείων του πίνακα.${CPP(R`
#include <iostream>
using namespace std;
const int N = 30;
______________________________ {        // Α
    int sum = 0, i;
    for (i = 0; i < N; i++)
        sum += b[i];
    return sum;
}
int main() {
    int arr[N];
    /* ... γέμισμα του πίνακα ... */
    cout << "Sum of array = " << sumArray(arr);
    return 0;
}`)}`, fields: [{ label: "Επικεφαλίδα (Α):", ans: ["int sumArray(int b[])", "int sumArray(int b[N])", "int sumArray(int b[30])"], text: true, nospace: true, cs: true, ph: "τύπος όνομα(παράμετροι)" }],
      hint: R`Τι επιστρέφει; Πώς λέγεται στην κλήση; Ποιο όνομα έχει ο πίνακας στο σώμα;`, sol: R`<code>int sumArray(int b[])</code>: επιστρέφει ακέραιο (<code>return sum</code>), το όνομα προκύπτει από την κλήση και η παράμετρος πρέπει να λέγεται <code>b</code>, όπως στο σώμα.` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα; (σε μία γραμμή)${CPP(R`
#include <iostream>
using namespace std;
const int N = 5;
void change(int arr[], int k) {
    for (int i = 0; i < N; i++)
        if (i % 2 == 0)
            arr[i] += k;
    k = 0;
}
int main() {
    int A[N] = {1, 2, 3, 4, 5};
    int k = 10;
    change(A, k);
    for (int i = 0; i < N; i++)
        cout << A[i] << " ";
    cout << k << endl;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "11 2 13 4 15 10", text: true }],
      hint: R`Ο πίνακας αλλάζει στη main· η <code>k</code> περνά με τιμή.`, sol: R`Οι θέσεις 0, 2, 4 αυξάνονται κατά 10 στον ίδιο τον πίνακα <code>A</code>. Το <code>k = 0</code> αλλάζει μόνο το αντίγραφο.${OUT(`11 2 13 4 15 10`)}` },
    { level: 2, type: "mc", q: R`Το παρακάτω τμήμα προγράμματος υπολογίζει το πλήθος των άρτιων στοιχείων. Πώς διορθώνεται η γραμμή με την κλήση;${CPP(R`
int even(int B[]);
int main() {
    int A[N];
    cout << "Even numbers:" << even(A[]) << endl;
    return 0;
}`)}`,
      options: ["<code>cout &lt;&lt; \"Even numbers:\" &lt;&lt; even(A) &lt;&lt; endl;</code>", "<code>cout &lt;&lt; \"Even numbers:\" &lt;&lt; even(B[]) &lt;&lt; endl;</code>", "<code>cout &lt;&lt; \"Even numbers:\" &lt;&lt; even(&amp;A) &lt;&lt; endl;</code>", "<code>cout &lt;&lt; \"Even numbers:\" &lt;&lt; even(A[N]) &lt;&lt; endl;</code>"], correct: 0,
      hint: R`Ο πίνακας της main λέγεται A· στην κλήση γράφουμε μόνο το όνομα.`, sol: R`Σωστό: <code>even(A)</code>. Το <code>B</code> είναι το όνομα της τυπικής παραμέτρου (άγνωστο στη main), ενώ τα <code>A[]</code>, <code>&amp;A</code>, <code>A[N]</code> δεν είναι σωστές πραγματικές παράμετροι για <code>int B[]</code>.` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα; (σε μία γραμμή)${CPP(R`
#include <iostream>
using namespace std;
int posMax(int a[], int n) {
    int p = 0;
    for (int i = 1; i < n; i++)
        if (a[i] >= a[p])
            p = i;
    return p;
}
int main() {
    int A[6] = {4, 9, 2, 9, 7, 1};
    int p = posMax(A, 6);
    cout << p << " " << A[p] << " ";
    A[p] = 0;
    cout << posMax(A, 6) << endl;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "3 9 1", text: true }],
      hint: R`Με <code>&gt;=</code> κρατάμε την <b>τελευταία</b> θέση του μέγιστου.`,
      sol: R`1η κλήση: p γίνεται 1 (9 ≥ 4), μετά 3 (9 ≥ 9) → επιστρέφει 3, εμφανίζει <code>3 9</code>. Μετά <code>A[3] = 0</code>, οπότε το μοναδικό 9 είναι στη θέση 1 → <code>1</code>.${OUT(`3 9 1`)}` },
    { level: 2, q: R`Το αρχείο <code>numbers.txt</code> περιέχει τη γραμμή <code>4 10 36 81 50 1 64</code> (με Enter στο τέλος). Τι θα γραφτεί στο <code>squares.txt</code>;${CPP(R`
#include <iostream>
#include <fstream>
#include <cmath>
using namespace std;
ifstream fin("numbers.txt");
ofstream fout("squares.txt");
int cnt = 0;
void fill(int nums[]) {
    int x;
    fin >> x;                      // πρώτη ανάγνωση (πριν από τον βρόχο)
    while (!fin.eof()) {
        nums[cnt] = x;
        cnt++;
        fin >> x;                  // επόμενη ανάγνωση στο τέλος του βρόχου
    }
}
bool square(int n) {
    int x = (int)(sqrt(n) + 0.5);
    if (x * x == n)
        return true;
    return false;
}
void print(int nums[]) {
    for (int i = 0; i < cnt; i++)
        if (square(nums[i]))
            fout << nums[i] << " ";
}
int main() {
    int numbers[100];
    fill(numbers);
    print(numbers);
    fin.close();
    fout.close();
    return 0;
}`, { files: { "numbers.txt": "4 10 36 81 50 1 64\n" }, outfile: "squares.txt" })}`, fields: [{ label: "squares.txt:", ans: "4 36 81 1 64", text: true }],
      hint: R`Βρείτε πρώτα πόσους αριθμούς αποθηκεύει η <code>fill</code> (cnt) και μετά ελέγξτε κάθε αριθμό με τη <code>square</code>: είναι το $x \cdot x$ ίσο με τον αριθμό, όπου $x$ η στρογγυλεμένη τετραγωνική ρίζα;`, sol: R`Η <code>fill</code> (πρώτη ανάγνωση πριν από τον βρόχο, νέα ανάγνωση στο τέλος του) αποθηκεύει τους 7 αριθμούς (cnt = 7). Η <code>print</code> γράφει όσους η <code>square</code> αναγνωρίζει ως τέλεια τετράγωνα, με τη σειρά του αρχείου.${OUT(`4 36 81 1 64`, "squares.txt")}` },
    { level: 3, q: R`Δίνονται οι βαθμοί <code>G[4] = {15, 18, 17, 20}</code>. Τι θα εμφανίσει η εντολή <code>cout &lt;&lt; fixed &lt;&lt; setprecision(1) &lt;&lt; average(G, 4);</code> για καθεμιά από τις δύο εκδοχές της συνάρτησης;${CPP(R`
double average(int g[], int n) {    // εκδοχή Α
    int s = 0;
    for (int i = 0; i < n; i++)
        s += g[i];
    return (double) s / n;
}
double average(int g[], int n) {    // εκδοχή Β
    int s = 0;
    for (int i = 0; i < n; i++)
        s += g[i];
    return s / n;
}`)}`, fields: [{ label: "Εκδοχή Α:", ans: ["17.5", "17,5"], text: true }, { label: "Εκδοχή Β:", ans: ["17.0", "17,0"], text: true }],
      hint: R`Το άθροισμα είναι 70. Στην εκδοχή Β και οι δύο τελεστέοι είναι <code>int</code>.`, sol: R`$s = 70$. Α: <code>(double) 70 / 4 = 17.5</code> → <code>17.5</code>. Β: <code>70 / 4</code> είναι ακέραια διαίρεση = 17, που μετατρέπεται σε double 17.0 → <code>17.0</code>.` },
    { level: 1, type: "mc", q: R`Θέλουμε οι συναρτήσεις <code>fill</code> και <code>print</code> να χρησιμοποιούν τις ίδιες ροές αρχείων. Πού δηλώνουμε τις <code>ifstream fin("numbers.txt");</code> και <code>ofstream fout("squares.txt");</code>;`,
      options: ["Έξω από τη main και τις συναρτήσεις (καθολικές), πριν από τους ορισμούς των συναρτήσεων", "Μέσα στη main", "Μέσα στη fill", "Μέσα στη print"], correct: 0,
      hint: R`Ποιες μεταβλητές είναι προσβάσιμες από όλες τις συναρτήσεις;`, sol: R`Δηλωμένες εκτός main γίνονται καθολικές και είναι προσβάσιμες από όλες τις συναρτήσεις που ορίζονται μετά.` }
  ]
},
/* ───────────────────────────── 11.1 ───────────────────────────── */
{
  id: "11.1", unit: 11, title: "Στοίβα (stack) στη C++: push, pop, top – υλοποίηση με πίνακα και STL",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.9 §1–6 Αφηρημένοι τύποι δεδομένων – Στοίβα (σ. 273–288)",
  intro: "Τι είναι η στοίβα (stack) και η αρχή LIFO, και πώς υλοποιούμε τις λειτουργίες push, pop, top σε C++ με πίνακα ή με τη βιβλιοθήκη STL;",
  thumb: ICON("push", "purple"),
  theory: R`
<div class="tbox warn"><h4>Εκτός εξεταστέας ύλης Παγκυπρίων 2025-26</h4><p>Το κεφάλαιο Γ7.9 (στοίβα και ουρά) <b>δεν</b> περιλαμβάνεται στην ύλη των Παγκυπρίων Εξετάσεων 2025-26 — είναι χρήσιμο για τις σχολικές εξετάσεις και ως εξάσκηση σε συναρτήσεις και πίνακες.</p></div>
<p>Ένας <b>αφηρημένος τύπος δεδομένων</b> (abstract data type) είναι ένα σύνολο στοιχείων μαζί με τις λειτουργίες που εφαρμόζονται σε αυτά. Για να τον υλοποιήσουμε χρησιμοποιούμε μια <b>δομή δεδομένων</b>: μια δομή αποθήκευσης (π.χ. πίνακα) και συναρτήσεις, μία για κάθε λειτουργία. Η πιο γνωστή τέτοια δομή είναι η <b>στοίβα (stack)</b>.</p>
<div class="tbox def"><h4>Στοίβα – αρχή LIFO</h4>
<p><b>Στοίβα</b> είναι μια συλλογή στοιχείων στην οποία τα νέα στοιχεία προστίθενται και αφαιρούνται <b>μόνο από τη μία άκρη</b>, την <b>κορυφή (top)</b> — όπως μια στοίβα από πιάτα. Είναι δομή <b>LIFO</b> (Last-In-First-Out): το στοιχείο που μπήκε τελευταίο βγαίνει πρώτο.</p>
<p>Λειτουργίες: <b>δημιουργία</b> (κενή στοίβα), <b>Push(X)</b> εισαγωγή του X στην κορυφή, <b>Pop()</b> εξαγωγή του στοιχείου της κορυφής, <b>Empty()</b> true αν είναι κενή, <b>Top()</b> επιστρέφει το στοιχείο της κορυφής χωρίς να το αφαιρεί, <b>Size()</b> το πλήθος των στοιχείων.</p>
${ib6DSrow([ib6DS([3, 7, 6], { label: "αρχικά<br>Top 6 · Size 3" }), ib6DS([3, 7, 6, 5], { label: "Push(5)<br>Top 5 · Size 4" }), ib6DS([3, 7, 6, 5, 4], { label: "Push(4)<br>Top 4 · Size 5" }), ib6DS([3, 7, 6, 5], { label: "Pop()<br>Top 5 · Size 4" }), ib6DS([3, 7, 6, 5, 9], { label: "Push(9)<br>Top 9 · Size 5" })], "Το στοιχείο της κορυφής (πορτοκαλί) είναι το μόνο προσβάσιμο.")}
</div>
<div class="tbox ex"><h4>Υλοποίηση στοίβας με πίνακα και συναρτήσεις</h4>
<p>Χρησιμοποιούμε έναν πίνακα σταθερού μεγέθους και μια καθολική μεταβλητή <code>top</code> με τη θέση της κορυφής· αρχικά <code>top = -1</code> (κενή στοίβα). Αν η στοίβα είναι γεμάτη (<code>top == N-1</code>) έχουμε <b>υπερχείλιση</b>· αν είναι άδεια και ζητηθεί Pop, κατάσταση εξαίρεσης.</p>
${CPP(R`
#include <iostream>
using namespace std;
const int ARR_SIZE = 5;
int top = -1;                          // θέση κορυφής: -1 = κενή στοίβα
void Push(int arr[], int X, int N) {
    if (top == N - 1)
        cout << "Stack is full" << endl;
    else {
        top++;
        arr[top] = X;
        cout << "Pushed item " << X << endl;
    }
}
bool Empty() {
    if (top == -1)
        return true;
    else
        return false;
}
void Pop() {
    if (Empty())
        cout << "Stack is empty" << endl;
    else
        top--;
}
int Size() {
    return top + 1;
}
int Top(int arr[]) {
    return arr[top];
}
int main() {
    int mystack[ARR_SIZE];
    for (int x = 10; x <= 60; x += 10)
        Push(mystack, x, ARR_SIZE);
    Pop();
    Pop();
    cout << "Top: " << Top(mystack) << " Size: " << Size() << endl;
    return 0;
}`, { title: "stack_array.cpp", hl: [4] })}
${OUT(`
Pushed item 10
Pushed item 20
Pushed item 30
Pushed item 40
Pushed item 50
Stack is full
Top: 30 Size: 3`)}
<p>Το Pop απλώς μειώνει το <code>top</code>: το στοιχείο μένει στον πίνακα, αλλά θεωρείται «αφαιρεμένο».</p></div>
<div class="tbox def"><h4>Στοίβα μέσω της βιβλιοθήκης STL</h4>
<p>Με <code>#include &lt;stack&gt;</code> δηλώνουμε στοίβα οποιουδήποτε βασικού τύπου (<code>stack&lt;int&gt; S;</code>, <code>stack&lt;char&gt;</code>, <code>stack&lt;string&gt;</code>) και χρησιμοποιούμε τις μεθόδους <code>push(item)</code>, <code>pop()</code>, <code>top()</code>, <code>empty()</code>, <code>size()</code> με τελεία: <code>S.push(5);</code>.</p>
${CPP(R`
#include <iostream>
#include <stack>
using namespace std;
int main() {
    stack<int> binary;
    int num = 35;
    while (num > 0) {              // δεκαδικό → δυαδικό με στοίβα
        binary.push(num % 2);
        num /= 2;
    }
    while (!binary.empty()) {      // τα υπόλοιπα βγαίνουν ανάποδα
        cout << binary.top();
        binary.pop();
    }
    return 0;
}`, { title: "binary_stack.cpp" })}
${OUT(`100011`)}
<div class="tbox rem"><h4>Σημείωση για τη βιβλιοθήκη &lt;stack&gt;</h4><p>Η βιβλιοθήκη <code>&lt;stack&gt;</code> (STL) παρουσιάζεται εδώ μόνο επειδή υπάρχει στο κεφάλαιο Γ7.9, που είναι εκτός εξεταστέας ύλης. Στις λύσεις των θεμάτων των Παγκυπρίων χρησιμοποιούμε μόνο τις βιβλιοθήκες iostream, fstream, string, iomanip, cmath, climits.</p></div>
<p>Η STL στοίβα δεν εμφανίζει μήνυμα όταν κάνουμε <code>pop()</code> σε άδεια στοίβα, και το <code>top()</code> σε άδεια στοίβα είναι σφάλμα· γι' αυτό ελέγχουμε πάντα πρώτα με <code>empty()</code>. Άλλες κλασικές εφαρμογές: αντιστροφή λέξεων, έλεγχος ισορροπημένων παρενθέσεων.</p></div>
`,
  widget: "ib6stack",
  gen: "ib6stk",
  exercises: [
    { level: 1, type: "mc", q: R`Η στοίβα είναι δομή τύπου:`, options: ["LIFO – το στοιχείο που μπήκε τελευταίο βγαίνει πρώτο", "FIFO – το στοιχείο που μπήκε πρώτο βγαίνει πρώτο", "Τυχαίας προσπέλασης – βγαίνει οποιοδήποτε στοιχείο", "Ταξινομημένη – βγαίνει πάντα το μικρότερο"], correct: 0,
      hint: R`Στοίβα από πιάτα.`, sol: R`LIFO (Last-In-First-Out): προσθέτουμε και αφαιρούμε μόνο από την κορυφή.` },
    { level: 1, q: R`Μια στοίβα περιέχει (από κάτω προς τα πάνω) 3, 7, 6. Εκτελούνται με τη σειρά: Push(5), Push(4), Pop(), Push(9), Pop(), Pop(), Push(2). Ποιο είναι το στοιχείο της κορυφής και το μέγεθος;`,
      fields: [{ label: "Top() =", ans: 2 }, { label: "Size() =", ans: 4 }],
      hint: R`Κάθε Pop αφαιρεί το πιο πρόσφατο στοιχείο.`, sol: R`3,7,6 → 3,7,6,5 → 3,7,6,5,4 → 3,7,6,5 → 3,7,6,5,9 → 3,7,6,5 → 3,7,6 → 3,7,6,2. Κορυφή 2, μέγεθος 4.` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα; (σε μία γραμμή)${CPP(R`
#include <iostream>
#include <stack>
using namespace std;
int main() {
    stack<char> mystack;
    mystack.push('A');
    mystack.push('B');
    mystack.push('C');
    cout << mystack.top() << endl;
    mystack.pop();
    cout << mystack.top() << " " << mystack.size() << endl;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "C B 2", text: true, cs: true }],
      hint: R`Το <code>top()</code> δεν αφαιρεί το στοιχείο.`, sol: R`Κορυφή C· μετά το pop η κορυφή είναι B και το μέγεθος 2.${OUT(`
C
B 2`)}` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα; (σε μία γραμμή)${CPP(R`
#include <iostream>
#include <stack>
using namespace std;
int main() {
    stack<int> binary;
    int num = 44;
    while (num > 0) {
        binary.push(num % 2);
        num /= 2;
    }
    while (!binary.empty()) {
        cout << binary.top();
        binary.pop();
    }
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "101100", text: true }],
      hint: R`Υπόλοιπα διαίρεσης με το 2: 0, 0, 1, 1, 0, 1 — βγαίνουν ανάποδα.`, sol: R`44 → υπόλοιπα 0, 0, 1, 1, 0, 1 (push με αυτή τη σειρά). Η στοίβα τα βγάζει αντίστροφα: 101100 = $44_{10}$ στο δυαδικό.${OUT(`101100`)}` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα; (γράψτε όλες τις γραμμές σε μία)${CPP(R`
#include <iostream>
using namespace std;
const int ARR_SIZE = 3;
int top = -1;
void Push(int arr[], int X, int N) {
    if (top == N - 1)
        cout << "Stack is full" << endl;
    else {
        top++;
        arr[top] = X;
        cout << "Pushed item " << X << endl;
    }
}
void Pop() {
    if (top == -1)
        cout << "Stack is empty" << endl;
    else
        top--;
}
int main() {
    int s[ARR_SIZE];
    Push(s, 7, ARR_SIZE);
    Pop();
    Pop();
    Push(s, 8, ARR_SIZE);
    Push(s, 9, ARR_SIZE);
    cout << s[top] << " " << top + 1 << endl;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "Pushed item 7 Stack is empty Pushed item 8 Pushed item 9 9 2", text: true }],
      hint: R`Μετά το πρώτο Pop η στοίβα είναι άδεια (top = −1).`, sol: R`top: −1 → 0 (7) → −1 → (άδεια: μήνυμα) → 0 (8) → 1 (9). Κορυφή 9, μέγεθος 2.${OUT(`
Pushed item 7
Stack is empty
Pushed item 8
Pushed item 9
9 2`)}` },
    { level: 2, type: "mc", q: R`Η λειτουργία <code>Top()</code> μιας στοίβας αφαιρεί το στοιχείο της κορυφής και το επιστρέφει.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ποια λειτουργία αφαιρεί;`, sol: R`<b>ΛΑΘΟΣ.</b> Η <code>Top()</code> επιστρέφει το στοιχείο της κορυφής <b>χωρίς</b> να το αφαιρέσει· την αφαίρεση την κάνει η <code>Pop()</code>.` }
  ]
},
/* ───────────────────────────── 11.2 ───────────────────────────── */
{
  id: "11.2", unit: 11, title: "Ουρά (queue) στη C++: push, pop, front – υλοποίηση με πίνακα και STL",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.9 §7–11 Αφηρημένος τύπος δεδομένων – Ουρά (σ. 288–297)",
  intro: "Πώς λειτουργεί η ουρά (queue) με την αρχή FIFO και πώς την υλοποιούμε σε C++ με πίνακα, δείκτες front/back ή με την STL;",
  thumb: ICON("FIFO", "blue"),
  theory: R`
<div class="tbox warn"><h4>Εκτός εξεταστέας ύλης Παγκυπρίων 2025-26</h4><p>Η ουρά (κεφάλαιο Γ7.9) <b>δεν</b> εξετάζεται στις Παγκύπριες 2025-26 — χρήσιμη για τις σχολικές εξετάσεις.</p></div>
<div class="tbox def"><h4>Ουρά – αρχή FIFO</h4>
<p><b>Ουρά (queue)</b> είναι μια συλλογή στοιχείων όπου τα νέα στοιχεία προστίθενται από την <b>πίσω</b> άκρη (back) και αφαιρούνται μόνο από τη <b>μπροστινή</b> (front) — όπως οι πελάτες στο ταμείο μιας τράπεζας. Είναι δομή <b>FIFO</b> (First-In-First-Out): ό,τι μπαίνει πρώτο, βγαίνει πρώτο.</p>
<p>Λειτουργίες: δημιουργία κενής ουράς, <b>Push(X)</b> εισαγωγή στο τέλος, <b>Pop()</b> εξαγωγή του πρώτου, <b>Empty()</b>, <b>Front()</b> το πρώτο στοιχείο χωρίς αφαίρεση, <b>Size()</b> το πλήθος.</p>
${ib6DSrow([ib6DS([6, 7, 3], { queue: true, label: "αρχικά · Front 6 · Size 3" }), ib6DS([6, 7, 3, 5], { queue: true, label: "Push(5) · Front 6 · Size 4" }), ib6DS([7, 3, 5], { queue: true, label: "Pop() · Front 7 · Size 3" })], "Η εισαγωγή γίνεται πίσω, η εξαγωγή μπροστά.")}
</div>
<div class="tbox ex"><h4>Υλοποίηση ουράς με πίνακα και συναρτήσεις</h4>
<p>Χρησιμοποιούμε δύο καθολικούς δείκτες: <code>front</code> (θέση του πρώτου στοιχείου) και <code>back</code> (η επόμενη ελεύθερη θέση), αρχικά και οι δύο 0. Το μέγεθος είναι <code>back - front</code> και η ουρά είναι κενή όταν <code>front == back</code>.</p>
${CPP(R`
#include <iostream>
using namespace std;
const int ARR_SIZE = 5;
int front = 0, back = 0;
void Push(int arr[], int X, int N) {
    if (back == N)
        cout << "Queue is full" << endl;
    else {
        arr[back] = X;
        back++;
        cout << "Pushed item " << X << endl;
    }
}
bool Empty() {
    return (front == back);
}
void Pop(int arr[]) {
    if (Empty())
        cout << "Queue is empty" << endl;
    else {
        arr[front] = 0;
        front++;
    }
}
int Front(int arr[]) {
    return arr[front];
}
int Size() {
    return (back - front);
}
int main() {
    int myqueue[ARR_SIZE];
    for (int num = 10; num <= 15; num++)
        Push(myqueue, num, ARR_SIZE);
    cout << "Front: " << Front(myqueue) << " Size: " << Size() << endl;
    Pop(myqueue);
    Pop(myqueue);
    cout << "Front: " << Front(myqueue) << " Size: " << Size() << endl;
    for (int i = front; i < back; i++)
        cout << myqueue[i] << " ";
    return 0;
}`, { title: "queue_array.cpp", hl: [4] })}
${OUT(`
Pushed item 10
Pushed item 11
Pushed item 12
Pushed item 13
Pushed item 14
Queue is full
Front: 10 Size: 5
Front: 12 Size: 3
12 13 14`)}
<div class="tbox rem"><h4>Περιορισμός της απλής υλοποίησης</h4><p>Αφού το <code>back</code> μόνο αυξάνεται, όταν φτάσει στο <code>N</code> η ουρά δηλώνει «γεμάτη» ακόμη κι αν έχουν βγει στοιχεία από μπροστά και υπάρχουν κενές θέσεις στην αρχή του πίνακα. (Η «κυκλική ουρά» λύνει το πρόβλημα, αλλά δεν περιλαμβάνεται στο βιβλίο.)</p></div></div>
<div class="tbox def"><h4>Ουρά μέσω της βιβλιοθήκης STL</h4>
<p>Η βιβλιοθήκη <code>&lt;queue&gt;</code> (STL) αναφέρεται μόνο επειδή είναι στο κεφάλαιο Γ7.9 (εκτός εξεταστέας ύλης)· στις λύσεις των Παγκυπρίων δεν χρησιμοποιείται. Με <code>#include &lt;queue&gt;</code>: <code>queue&lt;int&gt; Q;</code> και μέθοδοι <code>push(item)</code> (στο πίσω μέρος), <code>pop()</code> (από μπροστά), <code>front()</code>, <code>back()</code>, <code>empty()</code>, <code>size()</code>.</p>
${CPP(R`
#include <iostream>
#include <queue>
using namespace std;
int main() {
    queue<int> Q;
    for (int i = 1; i <= 4; i++)
        Q.push(i * 10);                       // 10 20 30 40
    Q.pop();
    cout << Q.front() << " " << Q.back() << " " << Q.size() << endl;
    while (!Q.empty()) {
        cout << Q.front() << " ";
        Q.pop();
    }
    return 0;
}`, { title: "queue_stl.cpp" })}
${OUT(`
20 40 3
20 30 40`)}
</div>
`,
  widget: "ib6queue",
  gen: "ib6que",
  exercises: [
    { level: 1, type: "mc", q: R`Η ουρά είναι δομή τύπου:`, options: ["FIFO – το στοιχείο που μπήκε πρώτο βγαίνει πρώτο", "LIFO – το στοιχείο που μπήκε τελευταίο βγαίνει πρώτο", "Βγαίνει πάντα το μεγαλύτερο στοιχείο", "Τα στοιχεία βγαίνουν από οποιαδήποτε θέση"], correct: 0,
      hint: R`Ουρά στο ταμείο.`, sol: R`FIFO (First-In-First-Out): εισαγωγή πίσω, εξαγωγή μπροστά.` },
    { level: 1, q: R`Μια ουρά περιέχει (από μπροστά προς τα πίσω) 4, 8, 1. Εκτελούνται: Push(5), Pop(), Pop(), Push(2). Ποια είναι τα Front(), Size() και το τελευταίο στοιχείο (back);`,
      fields: [{ label: "Front() =", ans: 1 }, { label: "Size() =", ans: 3 }, { label: "back =", ans: 2 }],
      hint: R`Τα Pop αφαιρούν από μπροστά.`, sol: R`4,8,1 → 4,8,1,5 → 8,1,5 → 1,5 → 1,5,2. Front 1, Size 3, τελευταίο 2.` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα; (σε μία γραμμή)${CPP(R`
#include <iostream>
#include <queue>
using namespace std;
int main() {
    queue<int> Q;
    for (int i = 1; i <= 4; i++)
        Q.push(i * 10);
    Q.pop();
    cout << Q.front() << " " << Q.back() << " " << Q.size() << endl;
    while (!Q.empty()) {
        cout << Q.front() << " ";
        Q.pop();
    }
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "20 40 3 20 30 40", text: true }],
      hint: R`Μπήκαν 10, 20, 30, 40· το pop βγάζει το 10.`, sol: R`${OUT(`
20 40 3
20 30 40`)}` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα; (όλες οι γραμμές σε μία)${CPP(R`
#include <iostream>
using namespace std;
const int ARR_SIZE = 4;
int front = 0, back = 0;
void Push(int arr[], int X, int N) {
    if (back == N)
        cout << "Queue is full" << endl;
    else {
        arr[back] = X;
        back++;
    }
}
void Pop(int arr[]) {
    if (front == back)
        cout << "Queue is empty" << endl;
    else {
        arr[front] = 0;
        front++;
    }
}
int main() {
    int q[ARR_SIZE];
    for (int x = 1; x <= 4; x++)
        Push(q, x * 3, ARR_SIZE);
    Pop(q);
    Pop(q);
    Push(q, 20, ARR_SIZE);
    cout << q[front] << " " << back - front << endl;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: "Queue is full 9 2", text: true }],
      hint: R`Μετά τα 4 Push, back = 4 = N. Τα Pop αυξάνουν μόνο το front.`, sol: R`Μπαίνουν 3, 6, 9, 12 (back = 4). Δύο Pop → front = 2. Το Push(20) βρίσκει <code>back == N</code> και εμφανίζει «Queue is full», παρότι οι θέσεις 0 και 1 είναι ελεύθερες — περιορισμός της απλής υλοποίησης. Πρώτο στοιχείο q[2] = 9, μέγεθος 4 − 2 = 2.${OUT(`
Queue is full
9 2`)}` },
    { level: 2, type: "mc", q: R`Στην υλοποίηση ουράς με πίνακα και δείκτες <code>front</code>, <code>back</code> (αρχικά 0), πότε η ουρά είναι κενή;`,
      options: ["Όταν <code>front == back</code>", "Όταν <code>back == N</code>", "Όταν <code>front == -1</code>", "Όταν <code>front == N - 1</code>"], correct: 0,
      hint: R`Μέγεθος = back − front.`, sol: R`Το πλήθος των στοιχείων είναι <code>back - front</code>, άρα η ουρά είναι κενή όταν <code>front == back</code>. Το <code>back == N</code> σημαίνει ότι δεν χωρά άλλο στοιχείο.` }
  ]
},
/* ───────────────────────────── 7.1 ───────────────────────────── */
{
  id: "7.1", unit: 7, title: "Σειριακή (γραμμική) αναζήτηση σε C++",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.5 §1–2 Σειριακή αναζήτηση (σ. 155–158) · Ασκήσεις 5.3–5.9, 5.15–5.18",
  intro: "Πώς βρίσκουμε αν ένα στοιχείο υπάρχει σε έναν πίνακα — και σε ποια θέση — όταν ο πίνακας δεν είναι ταξινομημένος; Με τη σειριακή αναζήτηση.",
  thumb: ICON("i++ ==", "amber"),
  theory: R`
<p>Ένας <b>αλγόριθμος αναζήτησης</b> (searching algorithm) προσπαθεί να εντοπίσει ένα στοιχείο με συγκεκριμένες ιδιότητες μέσα σε μια συλλογή στοιχείων του ίδιου τύπου — στην ύλη των Παγκυπρίων, μέσα σε έναν <b>μονοδιάστατο πίνακα</b>. Το βιβλίο εξετάζει δύο αλγορίθμους: τη <b>σειριακή αναζήτηση</b> (sequential search, ή γραμμική αναζήτηση) και τη <b>δυαδική αναζήτηση</b> (binary search). Η σειριακή αναζήτηση είναι ο απλούστερος τρόπος και δουλεύει σε <i>οποιονδήποτε</i> πίνακα, ταξινομημένο ή όχι.</p>
<div class="tbox def"><h4>Σειριακή αναζήτηση (sequential search)</h4>
<p>Ξεκινώντας από το <b>πρώτο στοιχείο</b> του πίνακα (θέση 0), ελέγχουμε ένα-ένα τα στοιχεία, συγκρίνοντας το καθένα με το <b>στοιχείο προς αναζήτηση</b> (target), μέχρι να εντοπίσουμε αυτό που ψάχνουμε ή να φτάσουμε στο τελευταίο στοιχείο. Ο <b>μέγιστος αριθμός συγκρίσεων</b> είναι ίσος με $N$, το πλήθος των στοιχείων — αυτό συμβαίνει όταν το στοιχείο βρίσκεται στην <b>τελευταία θέση</b> ή <b>δεν υπάρχει</b> στον πίνακα.</p>
<p>Η συνάρτηση του βιβλίου είναι τύπου <code>bool</code>: επιστρέφει <code>true</code> αν εντοπίσει το στοιχείο, αλλιώς <code>false</code>.</p>
${CPP(R`
bool sequential_search(int arr[], int N, int target){
    for (int i=0; i<N; i++)
        if (target == arr[i])
            return true;        // Το στοιχείο βρέθηκε
    return false;               // Το στοιχείο δεν βρέθηκε
}`, { title: "sequential_search (bool)", hl: [2, 3] })}
</div>
<div class="tbox ex"><h4>Ίχνος σειριακής αναζήτησης</h4>
<p>Πίνακας <code>arr = {5, 6, 2, 4, 1, 9, 3, 0, 8, 7}</code>, $N = 10$, target $= 4$. Η συνάρτηση συγκρίνει διαδοχικά <code>arr[0]=5</code>, <code>arr[1]=6</code>, <code>arr[2]=2</code> και στη θέση 3 βρίσκει το 4: επιστρέφει <code>true</code> μετά από <b>4 συγκρίσεις</b>.</p>
${ib7Arr([5, 6, 2, 4, 1, 9, 3, 0, 8, 7], { cls: { 0: "cmp dim", 1: "cmp dim", 2: "cmp dim", 3: "hit" }, tags: { 3: ["i = 3", "#198754"] }, cap: "Οι θέσεις 0–2 ελέγχθηκαν και απορρίφθηκαν· στη θέση 3 βρέθηκε το target = 4." })}
</div>
<div class="tbox thm"><h4>Επιστροφή θέσης: πρώτη και τελευταία εμφάνιση</h4>
<p>Αν θέλουμε τη <b>θέση</b> του στοιχείου, η συνάρτηση γίνεται τύπου <code>int</code>: επιστρέφει τη θέση <code>i</code> αν το στοιχείο βρεθεί, αλλιώς την τιμή <b>-1</b> (που σημαίνει «δεν βρέθηκε» — καμία έγκυρη θέση πίνακα δεν είναι αρνητική). Επειδή η <code>return i;</code> τερματίζει αμέσως τη συνάρτηση, επιστρέφεται η θέση της <b>πρώτης εμφάνισης</b>.</p>
<div class="figrow"><div>${CPP(R`
int sequential_search(int arr[], int N, int target){
    for (int i=0; i<N; i++)
        if (target == arr[i])
            return i;           // πρώτη εμφάνιση
    return -1;                  // δεν βρέθηκε
}`, { title: "πρώτη εμφάνιση", small: true })}</div><div>${CPP(R`
int sequential_search(int arr[], int N, int target){
    int pos = -1;
    for (int i=0; i<N; i++)
        if (target == arr[i])
            pos = i;            // κρατάμε την πιο πρόσφατη
    return pos;                 // τελευταία εμφάνιση ή -1
}`, { title: "τελευταία εμφάνιση", small: true, hl: [5] })}</div></div>
<p>Για την <b>τελευταία εμφάνιση</b> δεν σταματάμε στο πρώτο ταίριασμα: αποθηκεύουμε κάθε φορά τη θέση της πιο πρόσφατης εμφάνισης στη μεταβλητή <code>pos</code> (αρχική τιμή -1) και ο βρόχος διασχίζει πάντα όλο τον πίνακα.</p></div>
<div class="tbox ex"><h4>Παράδειγμα 5.1 — πλήθος εμφανίσεων χαρακτήρα</h4>
<p>Το πρόγραμμα διαβάζει $N$ χαρακτήρες σε πίνακα και έναν χαρακτήρα προς αναζήτηση· η συνάρτηση μετρά τις εμφανίσεις του (πάλι διασχίζει όλο τον πίνακα).</p>
${CPP(R`
#include <iostream>
using namespace std;
#define MAXN 1000
int sequential_search(char arr[], int N, char target){
    int total = 0;                 // πλήθος εμφανίσεων
    for (int i=0; i<N; i++)
        if (target == arr[i])
            total++;
    return total;
}
int main(){
    char characters[MAXN], item;
    int N;
    cin >> N;
    for (int i=0; i<N; i++)
        cin >> characters[i];
    cin >> item;
    cout << sequential_search(characters, N, item) << endl;
    return 0;
}`, { title: "C7_5_example1.cpp" })}
<div class="figrow"><div>${OUT(`13
C B K J H A C B T Y U B V
B`, "Είσοδος")}</div><div>${OUT(`3`)}</div></div></div>
<div class="tbox rem"><h4>Παραλλαγές που ζητούνται συχνά</h4>
<ul><li><b>Ταξινομημένος πίνακας (αύξουσα σειρά):</b> μπορούμε να σταματήσουμε νωρίς μόλις συναντήσουμε στοιχείο <b>μεγαλύτερο</b> από το target — το στοιχείο σίγουρα δεν υπάρχει στις επόμενες θέσεις.</li>
<li><b>Όλες οι θέσεις:</b> αντί για <code>return</code>, εμφανίζουμε (<code>cout</code>) κάθε θέση <code>i</code> όπου <code>arr[i] == target</code>.</li>
<li><b>Παράλληλοι πίνακες:</b> ψάχνουμε στον πίνακα-κλειδί (π.χ. αριθμός μητρώου <code>AM[]</code>) και με τη θέση που βρήκαμε εμφανίζουμε το αντίστοιχο στοιχείο του άλλου πίνακα (π.χ. <code>email[pos]</code>).</li>
<li><b>Συμβολοσειρές:</b> ο ίδιος κώδικας δουλεύει με <code>string arr[]</code> και <code>string target</code>, αφού ο τελεστής <code>==</code> συγκρίνει strings.</li></ul>
${CPP(R`
int sorted_search(int arr[], int N, int target){
    for (int i=0; i<N; i++){
        if (arr[i] == target)
            return i;           // βρέθηκε
        else if (arr[i] > target)
            return -1;          // πρόωρος τερματισμός: δεν υπάρχει
    }
    return -1;
}`, { title: "σειριακή αναζήτηση σε ταξινομημένο πίνακα", hl: [5, 6] })}
</div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<p>✗ <code>else return -1;</code> <b>μέσα</b> στον βρόχο, αμέσως μετά το <code>if</code>: η συνάρτηση τερματίζει στην πρώτη σύγκριση! Το <code>return -1;</code> μπαίνει <b>μετά</b> το τέλος του βρόχου. ✗ <code>i&lt;=N</code> αντί για <code>i&lt;N</code> (εκτός ορίων πίνακα). ✗ Χρήση <code>=</code> αντί για <code>==</code> στη σύγκριση. ✗ Για την τελευταία εμφάνιση, ξεχνάμε την αρχική τιμή <code>pos = -1</code>.</p></div>
`,
  widget: "ib7seq",
  gen: "ib7gseq",
  exercises: [
    { level: 1, q: R`Δίνεται ο πίνακας <code>arr = {5, 6, 2, 4, 1, 9, 3, 0, 8, 7}</code> και η συνάρτηση <code>int sequential_search</code> του βιβλίου (επιστρέφει τη θέση της πρώτης εμφάνισης ή -1). Για target $= 9$, τι επιστρέφει η συνάρτηση και πόσες συγκρίσεις <code>target == arr[i]</code> εκτελούνται;`,
      fields: [{ label: "Επιστρέφει:", ans: 5 }, { label: "Συγκρίσεις:", ans: 6 }],
      hint: R`Μέτρησε τις θέσεις από το 0.`, sol: R`Συγκρίνονται οι θέσεις 0, 1, 2, 3, 4, 5· στη θέση 5 βρίσκεται το 9. Επιστρέφει <b>5</b> μετά από <b>6</b> συγκρίσεις.` },
    { level: 1, type: "mc", q: R`Η σειριακή αναζήτηση μπορεί να εφαρμοστεί μόνο σε ταξινομημένο πίνακα.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι προϋποθέτει ο έλεγχος «ένα-ένα»;`, sol: R`<b>ΛΑΘΟΣ.</b> Η σειριακή αναζήτηση ελέγχει όλα τα στοιχεία ένα-ένα, άρα δουλεύει σε οποιονδήποτε πίνακα. Ταξινομημένο πίνακα απαιτεί η <i>δυαδική</i> αναζήτηση.` },
    { level: 1, q: R`Ένας πίνακας έχει 250 στοιχεία. Ποιος είναι ο <b>μέγιστος</b> αριθμός συγκρίσεων που μπορεί να κάνει η σειριακή αναζήτηση;`,
      fields: [{ label: "Συγκρίσεις:", ans: 250 }],
      hint: R`Πότε έχουμε τη χειρότερη περίπτωση;`, sol: R`Στη χειρότερη περίπτωση (το στοιχείο είναι στην τελευταία θέση ή δεν υπάρχει) ελέγχονται όλα τα στοιχεία: <b>250</b> συγκρίσεις, δηλαδή $N$.` },
    { level: 2, q: R`Δίνεται η συνάρτηση:${CPP(R`
int f(int arr[], int N, int target){
    int pos = -1;
    for (int i=0; i<N; i++)
        if (target == arr[i])
            pos = i;
    return pos;
}`)}και ο πίνακας <code>a = {3, 7, 3, 1, 7, 7, 2}</code> ($N = 7$). Τι επιστρέφουν οι κλήσεις <code>f(a, 7, 7)</code> και <code>f(a, 7, 4)</code>;`,
      fields: [{ label: "f(a,7,7) =", ans: 5 }, { label: "f(a,7,4) =", ans: -1 }],
      hint: R`Η pos ενημερώνεται σε κάθε ταίριασμα.`, sol: R`Η συνάρτηση επιστρέφει την <b>τελευταία</b> εμφάνιση: το 7 εμφανίζεται στις θέσεις 1, 4, 5, άρα επιστρέφει <b>5</b>. Το 4 δεν υπάρχει, άρα επιστρέφεται η αρχική τιμή <b>-1</b>.` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα;${CPP(R`
#include <iostream>
using namespace std;
int count_char(char arr[], int N, char target){
    int total = 0;
    for (int i=0; i<N; i++)
        if (target == arr[i])
            total++;
    return total;
}
int main(){
    char w[9] = {'P','A','P','A','G','A','L','O','S'};
    cout << count_char(w, 9, 'A') << " " << count_char(w, 9, 'Z');
    return 0;
}`)}`,
      fields: [{ label: "Έξοδος:", ans: "3 0", text: true }],
      hint: R`Μέτρησε τα 'A' και τα 'Z'.`, sol: R`Το 'A' εμφανίζεται στις θέσεις 1, 3, 5 (3 φορές) και το 'Z' καμία. ${OUT(`3 0`)}` },
    { shuffle: true, level: 2, type: "mc", q: R`Η συνάρτηση <code>int sequential_search</code> του βιβλίου επιστρέφει τη θέση της <b>πρώτης</b> εμφάνισης. Ποια αλλαγή την κάνει να επιστρέφει τη θέση της <b>τελευταίας</b> εμφάνισης;`,
      options: [R`Μεταβλητή <code>pos = -1</code>, μέσα στο if <code>pos = i;</code> και μετά τον βρόχο <code>return pos;</code>`, R`Αλλαγή της <code>return i;</code> σε <code>return N-1;</code>`, R`Αλλαγή της συνθήκης σε <code>i&lt;=N</code>`, R`Αλλαγή του <code>return -1;</code> σε <code>return 0;</code>`], correct: 0,
      hint: R`Πρέπει ο βρόχος να μη σταματήσει στο πρώτο ταίριασμα.`, sol: R`Χρειάζεται να μη γίνεται <code>return</code> στο πρώτο ταίριασμα, αλλά να αποθηκεύεται η πιο πρόσφατη θέση σε μια μεταβλητή <code>pos</code> (αρχικά -1) και να επιστρέφεται στο τέλος.` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα;${CPP(R`
int a[6] = {4, 8, 4, 2, 4, 9};
int x = 4;
for (int i=0; i<6; i++)
    if (a[i] == x)
        cout << i << " ";`)}`,
      fields: [{ label: "Έξοδος:", ans: "0 2 4", text: true }],
      hint: R`Εμφανίζονται οι θέσεις, όχι οι τιμές.`, sol: R`Το 4 βρίσκεται στις θέσεις 0, 2 και 4. ${OUT(`0 2 4 `)}` },
    { level: 2, q: R`Ο πίνακας είναι ταξινομημένος σε αύξουσα σειρά. Να συμπληρώσετε τη συνθήκη ώστε η αναζήτηση να τερματίζει πρόωρα όταν το στοιχείο δεν υπάρχει:${CPP(R`
int search(int arr[], int N, int target){
    for (int i=0; i<N; i++){
        if (arr[i] == target)
            return i;
        else if ( ________ )
            return -1;
    }
    return -1;
}`)}`,
      fields: [{ label: "Συνθήκη:", ans: ["arr[i]>target", "target<arr[i]", "arr[i]>=target+1"], text: true, nospace: true, ph: "π.χ. a[i]==x" }],
      hint: R`Σε αύξουσα σειρά, αν βρούμε μεγαλύτερο στοιχείο, τα επόμενα θα είναι ακόμη μεγαλύτερα.`, sol: R`<code>arr[i] &gt; target</code>: αφού ο πίνακας είναι σε αύξουσα σειρά, όλα τα επόμενα στοιχεία θα είναι επίσης μεγαλύτερα από το target, άρα δεν χρειάζεται να συνεχίσουμε.` },
    { level: 3, q: R`Παράλληλοι πίνακες: ο <code>AM[]</code> έχει τους αριθμούς μητρώου και ο <code>email[]</code> τα email 6 υπαλλήλων. Τι θα εμφανίσει το πρόγραμμα αν ο χρήστης δώσει <code>82</code>;${CPP(R`
int AM[6] = {24, 102, 31, 190, 82, 123};
string email[6] = {"elenap@tifa.com", "petros1@tifa.com", "papgio@tifa.com",
                   "georgio@tifa.com", "vassos@tifa.com", "chris@tifa.com"};
int x, pos = -1;
cin >> x;
for (int i=0; i<6; i++)
    if (AM[i] == x)
        pos = i;
if (pos == -1)
    cout << "not found";
else
    cout << email[pos];`)}`,
      fields: [{ label: "Έξοδος:", ans: "vassos@tifa.com", text: true }],
      hint: R`Βρες τη θέση του 82 στον AM και πήγαινε στην ίδια θέση του email.`, sol: R`Το 82 βρίσκεται στη θέση 4 του <code>AM</code>, οπότε εμφανίζεται το <code>email[4]</code>. ${OUT(`vassos@tifa.com`)}` },
    { level: 3, q: R`Ο πίνακας <code>arr = {2, 5, 8, 11, 14, 17, 20, 23}</code> είναι ταξινομημένος. Με τη σειριακή αναζήτηση <b>με πρόωρο τερματισμό</b> (σταματά όταν <code>arr[i] &gt; target</code>), πόσα στοιχεία εξετάζονται για target $= 12$ και πόσα με την απλή σειριακή αναζήτηση (χωρίς πρόωρο τερματισμό);`,
      fields: [{ label: "Με πρόωρο τερματισμό:", ans: 5 }, { label: "Απλή:", ans: 8 }],
      hint: R`Το 12 δεν υπάρχει. Ποιο είναι το πρώτο στοιχείο που ξεπερνά το 12;`, sol: R`Με πρόωρο τερματισμό εξετάζονται τα 2, 5, 8, 11 και το <b>14</b> &gt; 12 οδηγεί σε τερματισμό: <b>5</b> στοιχεία. Η απλή σειριακή αναζήτηση εξετάζει και τα 8 στοιχεία, αφού το 12 δεν υπάρχει.` }
  ]
},
/* ───────────────────────────── 7.2 ───────────────────────────── */
{
  id: "7.2", unit: 7, title: "Χρονική πολυπλοκότητα αλγορίθμων — συμβολισμός Ο (Big-O)",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.5 §3–4 Χρονική πολυπλοκότητα, Ανάλυση χρονικής πολυπλοκότητας (σ. 158–160) · Παράδειγμα 5.2 · Ασκήσεις 5.24–5.25",
  intro: "Πόσο πιο αργά θα τρέξει ένα πρόγραμμα αν διπλασιαστούν τα δεδομένα; Η χρονική πολυπλοκότητα O(1), O(N), O(N²), O(log N) απαντά μετρώντας βρόχους.",
  thumb: ICON("O(N²)", "purple"),
  theory: R`
<p>Η <b>χρονική πολυπλοκότητα</b> (time complexity) ενός αλγορίθμου περιγράφει πώς αυξάνεται ο χρόνος εκτέλεσής του σε σχέση με το <b>μέγεθος των δεδομένων εισόδου $N$</b>. Συμβολίζεται με το γράμμα <b>Ο</b> (συμβολισμός «Big-O»): $O(1)$, $O(N)$, $O(N^2)$, $O(\log_2 N)$ κ.λπ. Στις Παγκύπριες ζητείται να βρίσκουμε την πολυπλοκότητα απλών αλγορίθμων <b>μετρώντας τους εμφωλευμένους βρόχους</b> (μέχρι $O(N^3)$) και να υπολογίζουμε πόσα «βήματα» εκτελούνται.</p>
<div class="tbox def"><h4>Χρονική πολυπλοκότητα και βασικές πράξεις</h4>
<p>Η χρονική πολυπλοκότητα ενός αλγορίθμου αφορά στο <b>μέγιστο κόστος εκτέλεσής του</b>, δηλαδή στη <b>χειρότερη περίπτωση</b>. Το κόστος μετριέται με το πλήθος των <b>βασικών πράξεων</b> που εκτελεί ο αλγόριθμος:</p>
<ul><li>(α) ανάθεση τιμής, π.χ. <code>a = 10;</code></li><li>(β) σύγκριση μεταξύ μεταβλητών, π.χ. <code>if (a==b)</code></li><li>(γ) εκτέλεση πράξεων, π.χ. <code>a = b + 5;</code></li></ul>
<p>Παράδειγμα: η σειριακή αναζήτηση έχει πολυπλοκότητα $O(N)$ — στη χειρότερη περίπτωση χρειάζεται $N$ βήματα.</p></div>
<div class="tbox thm"><h4>Οι κατηγορίες πολυπλοκότητας του βιβλίου</h4>
<p>Ο καθηγητής ψάχνει ποιος από τους $N$ μαθητές έχει το απουσιολόγιο. Το πλήθος των ερωτήσεων είναι η πολυπλοκότητα:</p>
<table class="tbl"><tr><th>Πολυπλοκότητα</th><th>Όνομα</th><th>Ο καθηγητής…</th><th>Κώδικας-πρότυπο</th></tr>
<tr><td>$O(1)$</td><td>σταθερή (constant)</td><td>ρωτά όλη την τάξη μία φορά</td><td><code>int ans = 1;</code></td></tr>
<tr><td>$O(\log_2 N)$</td><td>λογαριθμική (logarithmic)</td><td>χωρίζει την τάξη στα δύο και ρωτά σε ποιο μισό είναι</td><td>βρόχος <code>while</code> που διαιρεί το <code>N</code> με το 2</td></tr>
<tr><td>$O(N)$</td><td>γραμμική (linear)</td><td>ρωτά έναν-έναν τους μαθητές</td><td>ένας βρόχος <code>for</code> $N$ φορές</td></tr>
<tr><td>$O(N^2)$</td><td>τετραγωνική (quadratic)</td><td>ρωτά κάθε μαθητή για κάθε άλλο μαθητή</td><td>δύο εμφωλευμένοι βρόχοι</td></tr>
<tr><td>$O(N^3)$</td><td>κυβική (cubic)</td><td>—</td><td>τρεις εμφωλευμένοι βρόχοι</td></tr></table>
${CPP(R`
int ans = 0;
for (int i = 0; i < N; i++){        // N φορές
    for (int j = 0; j < N; j++){    // N φορές για κάθε i
        ans++;                      // εκτελείται N*N φορές -> O(N^2)
    }
}`, { title: "O(N²): δύο εμφωλευμένοι βρόχοι", hl: [4] })}
</div>
<div class="tbox ex"><h4>Παράδειγμα 5.2 — τρεις εμφωλευμένοι βρόχοι</h4>
${CPP(R`
int N = 5, steps = 0;
for (int i = 1; i <= N; i++)
    for (int j = N; j >= 1; j--)
        for (int k = 1; k <= N; k++)
            steps++;
cout << steps << endl;`)}
<details class="steps"><summary>Λύση βήμα-βήμα</summary><p>Κάθε βρόχος εκτελείται $N$ φορές (ο δεύτερος μετρά προς τα κάτω, αλλά πάλι $N$ φορές). Τα συνολικά βήματα είναι $N\cdot N\cdot N = N^3$, άρα <b>κυβική πολυπλοκότητα $O(N^3)$</b>. Για $N = 5$: $5^3 = 125$.</p>${OUT(`125`)}</details></div>
<div class="tbox ex"><h4>Λογαριθμική πολυπλοκότητα: διαίρεση με το 2</h4>
${CPP(R`
int ans = 0;
while (N > 0) {
    N /= 2;
    ans++;
}`)}
<p>Στον κώδικα αυτό το $N$ υποδιπλασιάζεται (ακέραια διαίρεση) σε κάθε επανάληψη. Για $N = 100$: $100 \to 50 \to 25 \to 12 \to 6 \to 3 \to 1 \to 0$, άρα <code>ans = 7</code>. Γενικά ο βρόχος εκτελείται $\lfloor \log_2 N \rfloor + 1$ φορές, δηλαδή $O(\log_2 N)$.</p>
<details class="steps"><summary>Γιατί ο λογάριθμος μεγαλώνει τόσο αργά;</summary><table class="tbl"><tr><th>$N$</th><th>$\log_2 N$ (περίπου)</th><th>$N^2$</th></tr><tr><td>10</td><td>3,3</td><td>100</td></tr><tr><td>1 000</td><td>10</td><td>1 000 000</td></tr><tr><td>1 000 000</td><td>20</td><td>$10^{12}$</td></tr></table><p>Ένας αλγόριθμος $O(\log_2 N)$ σε ένα εκατομμύριο στοιχεία χρειάζεται περίπου 20 βήματα, ενώ ένας $O(N^2)$ ένα τρισεκατομμύριο!</p></details></div>
<div class="tbox rem"><h4>Πώς μετράμε βήματα σε βρόχους</h4>
<ul><li>Διαδοχικοί (όχι εμφωλευμένοι) βρόχοι <b>προστίθενται</b>: ένας βρόχος $x$ φορές και μετά ένας $y$ φορές δίνουν $x + y$ βήματα.</li>
<li>Εμφωλευμένοι βρόχοι <b>πολλαπλασιάζονται</b>: $N$ επαναλήψεις του εξωτερικού × $N$ του εσωτερικού $= N^2$.</li>
<li>Αν ο εσωτερικός βρόχος εξαρτάται από τον εξωτερικό (π.χ. <code>for (j=i; j&lt;N; j++)</code>), αθροίζουμε: $N + (N-1) + \dots + 1 = \frac{N(N+1)}{2}$ — πάλι $O(N^2)$.</li>
<li>Στον συμβολισμό Ο κρατάμε τον <b>μεγαλύτερο όρο</b> χωρίς σταθερές: $\frac{N^2}{2} + 3N + 7 \to O(N^2)$.</li></ul></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<p>✗ Δύο βρόχοι ο ένας <b>μετά</b> τον άλλο δεν δίνουν $O(N^2)$ αλλά $O(N)$. ✗ Ο βρόχος <code>for (int j=N; j&gt;=1; j--)</code> εκτελείται κι αυτός $N$ φορές. ✗ Στο <code>N /= 2</code> η διαίρεση ακεραίων κόβει το δεκαδικό: $25/2 = 12$.</p></div>
`,
  widget: "ib7cx",
  gen: "ib7gcx",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια είναι η χρονική πολυπλοκότητα της σειριακής αναζήτησης σε πίνακα $N$ στοιχείων;`,
      options: ["$O(N)$", "$O(1)$", "$O(\\log_2 N)$", "$O(N^2)$"], correct: 0,
      hint: R`Πόσα στοιχεία ελέγχονται στη χειρότερη περίπτωση;`, sol: R`Στη χειρότερη περίπτωση ελέγχονται και τα $N$ στοιχεία: <b>$O(N)$</b>, γραμμική πολυπλοκότητα.` },
    { level: 1, type: "mc", q: R`Η χρονική πολυπλοκότητα ενός αλγορίθμου αφορά στο μέγιστο κόστος εκτέλεσής του, δηλαδή στη χειρότερη περίπτωση.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Ορισμός του βιβλίου.`, sol: R`<b>ΣΩΣΤΟ.</b> Σύμφωνα με το βιβλίο, η χρονική πολυπλοκότητα αφορά στο μέγιστο κόστος εκτέλεσης, που μετριέται με το πλήθος των βασικών πράξεων στη χειρότερη περίπτωση.` },
    { level: 1, q: R`Τι θα εμφανίσει ο κώδικας;${CPP(R`
int N = 4, steps = 0;
for (int i = 1; i <= N; i++)
    for (int j = N; j >= 1; j--)
        for (int k = 1; k <= N; k++)
            steps++;
cout << steps;`)}`,
      fields: [{ label: "Έξοδος:", ans: 64 }],
      hint: R`Τρεις εμφωλευμένοι βρόχοι, ο καθένας N φορές.`, sol: R`$N \cdot N \cdot N = 4^3 = 64$ (πολυπλοκότητα $O(N^3)$). ${OUT(`64`)}` },
    { level: 2, q: R`Τι θα εμφανίσει ο κώδικας για $N = 6$;${CPP(R`
int steps = 0;
for (int i = 0; i < N; i++)
    for (int j = i; j < N; j++)
        steps++;
cout << steps;`)}`,
      fields: [{ label: "Έξοδος:", ans: 21 }],
      hint: R`Για i = 0 ο εσωτερικός εκτελείται 6 φορές, για i = 1 πέντε, …`, sol: R`$6 + 5 + 4 + 3 + 2 + 1 = \frac{6\cdot 7}{2} = 21$. Η πολυπλοκότητα παραμένει $O(N^2)$. ${OUT(`21`)}` },
    { level: 2, q: R`Τι τιμή θα έχει η <code>ans</code> μετά την εκτέλεση του κώδικα, για $N = 100$ και για $N = 1000$;${CPP(R`
int ans = 0;
while (N > 0) {
    N /= 2;
    ans++;
}`)}`,
      fields: [{ label: "N = 100:", ans: 7 }, { label: "N = 1000:", ans: 10 }],
      hint: R`Ακέραια διαίρεση με το 2 μέχρι να γίνει 0.`, sol: R`$100 \to 50 \to 25 \to 12 \to 6 \to 3 \to 1 \to 0$: <b>7</b> επαναλήψεις. $1000 \to 500 \to 250 \to 125 \to 62 \to 31 \to 15 \to 7 \to 3 \to 1 \to 0$: <b>10</b> επαναλήψεις. Λογαριθμική πολυπλοκότητα $O(\log_2 N)$.` },
    { level: 2, type: "mc", q: R`Ποια είναι η χρονική πολυπλοκότητα της συνάρτησης;${CPP(R`
void f2(int N){
    for(int i=0; i<N; i++){
        for(int j=0; j<N; j++)
            cout << i * j << " ";
        cout << endl;
    }
}`)}`,
      options: ["$O(N^2)$", "$O(N)$", "$O(2N)$", "$O(\\log_2 N)$"], correct: 0,
      hint: R`Μέτρησε εμφωλευμένους βρόχους.`, sol: R`Δύο εμφωλευμένοι βρόχοι των $N$ επαναλήψεων: η εντολή <code>cout &lt;&lt; i*j</code> εκτελείται $N^2$ φορές, άρα <b>$O(N^2)$</b>. Η <code>cout &lt;&lt; endl</code> εκτελείται $N$ φορές, όρος που δεν επηρεάζει την πολυπλοκότητα.` },
    { level: 2, q: R`Τι επιστρέφει η κλήση <code>my_function(4096)</code>;${CPP(R`
int my_function(int N) {
    int ans = 0;
    while (N > 0){
        ans += N % 10;
        N /= 10;
    }
    return ans;
}`)}`,
      fields: [{ label: "Επιστρέφει:", ans: 19 }],
      hint: R`Το N % 10 είναι το τελευταίο ψηφίο.`, sol: R`Η συνάρτηση αθροίζει τα ψηφία: $6 + 9 + 0 + 4 = 19$. Ο βρόχος εκτελείται τόσες φορές όσα τα ψηφία του $N$ (εδώ 4), δηλαδή περίπου $\log_{10} N$ φορές — λογαριθμική πολυπλοκότητα.` },
    { level: 3, q: R`Δίνεται η συνάρτηση:${CPP(R`
int f3(int x, int y){
    int s = 0;
    for(int i=1; i<=x; i++)
        s += i;
    for(int j=1; j<=y; j++)
        s += j;
    return s;
}`)}Τι επιστρέφει η κλήση <code>f3(3, 4)</code> και πόσες φορές συνολικά εκτελούνται οι εντολές <code>s += …</code> για την κλήση <code>f3(100, 50)</code>;`,
      fields: [{ label: "f3(3,4) =", ans: 16 }, { label: "Εκτελέσεις:", ans: 150 }],
      hint: R`Οι δύο βρόχοι είναι διαδοχικοί, όχι εμφωλευμένοι.`, sol: R`$f3(3,4) = (1+2+3) + (1+2+3+4) = 6 + 10 = 16$. Οι βρόχοι είναι διαδοχικοί, άρα τα βήματα <b>προστίθενται</b>: $100 + 50 = 150$. Η πολυπλοκότητα είναι $O(x + y)$ — γραμμική.` },
    { level: 3, q: R`Τι θα εμφανίσει ο κώδικας για $N = 8$;${CPP(R`
int steps = 0;
for (int i = 1; i <= N; i *= 2)
    for (int j = 0; j < N; j++)
        steps++;
cout << steps;`)}`,
      fields: [{ label: "Έξοδος:", ans: 32 }],
      hint: R`Ποιες τιμές παίρνει το i;`, sol: R`Το <code>i</code> παίρνει τις τιμές 1, 2, 4, 8 (4 τιμές) και για καθεμία ο εσωτερικός βρόχος εκτελείται 8 φορές: $4 \cdot 8 = 32$. ${OUT(`32`)}` },
    { level: 1, type: "mc", q: R`Ποια πολυπλοκότητα χαρακτηρίζεται ως «σταθερή» (constant);`,
      options: ["$O(1)$", "$O(N)$", "$O(N^3)$", "$O(\\log_2 N)$"], correct: 0,
      hint: R`Ο χρόνος δεν εξαρτάται από το N.`, sol: R`<b>$O(1)$</b>: ο αλγόριθμος χρειάζεται τον ίδιο χρόνο ανεξάρτητα από τα δεδομένα (π.χ. μία ερώτηση σε όλη την τάξη).` }
  ]
},
/* ───────────────────────────── 7.3 ───────────────────────────── */
{
  id: "7.3", unit: 7, title: "Δυαδική αναζήτηση (binary search) — Διαίρει και Βασίλευε",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.5 §5–6 Διαίρει και Βασίλευε, Δυαδική αναζήτηση (σ. 160–168) · Παραδείγματα 5.3–5.4 · Ασκήσεις 5.2, 5.10–5.14, 5.19–5.21",
  intro: "Πώς βρίσκουμε ένα στοιχείο σε ταξινομημένο πίνακα 1000 στοιχείων με το πολύ 10 επαναλήψεις (βήματα); Με τη δυαδική αναζήτηση και τις μεταβλητές first, last, mid.",
  thumb: ICON("mid", "purple"),
  theory: R`
<p>Η <b>δυαδική αναζήτηση</b> (binary search) είναι πολύ ταχύτερη από τη σειριακή, αλλά έχει μία βασική <b>προϋπόθεση: ο πίνακας πρέπει να είναι ήδη ταξινομημένος</b>. Ανήκει στην κατηγορία αλγορίθμων <b>«Διαίρει και Βασίλευε»</b> (Divide and Conquer) και έχει χρονική πολυπλοκότητα $O(\log_2 N)$.</p>
<div class="tbox def"><h4>Στρατηγική «Διαίρει και Βασίλευε» (Divide and Conquer)</h4>
<p>Οι αλγόριθμοι αυτής της κατηγορίας (1) <b>διασπούν</b> το πρόβλημα σε μικρότερα υποπροβλήματα, (2) <b>επιλύουν</b> ανεξάρτητα και διαδοχικά κάθε υποπρόβλημα και (3) <b>συνδυάζουν</b> τις επιμέρους λύσεις ώστε να σχηματιστεί η λύση του αρχικού προβλήματος. Παράδειγμα του βιβλίου: η κάλυψη πίνακα $2^n \times 2^n$ (με ένα μη προσβάσιμο τετράγωνο) με τρόμινος — χωρίζουμε σε 4 ίσα μέρη, τοποθετούμε ένα τρόμινο στο κέντρο ώστε κάθε μέρος να έχει ένα «κατειλημμένο» τετράγωνο και επαναλαμβάνουμε σε κάθε μέρος.</p></div>
<div class="tbox def"><h4>Ο αλγόριθμος της δυαδικής αναζήτησης</h4>
<p>Εξετάζουμε το <b>μεσαίο στοιχείο</b>, του οποίου η θέση είναι ο μέσος όρος (ακέραια διαίρεση) των θεσεων του πρώτου και του τελευταίου στοιχείου: <code>mid = (first + last) / 2</code>.</p>
<ul><li>Αν <code>target == arr[mid]</code> → το στοιχείο <b>βρέθηκε</b>.</li>
<li>Αν <code>target &lt; arr[mid]</code> → συνεχίζουμε στο <b>«αριστερό» μέρος</b>: <code>last = mid - 1</code>.</li>
<li>Αλλιώς → συνεχίζουμε στο <b>«δεξί» μέρος</b>: <code>first = mid + 1</code>.</li></ul>
<p>Όταν το <code>first</code> γίνει <b>μεγαλύτερο</b> από το <code>last</code>, το στοιχείο <b>δεν υπάρχει</b> στον πίνακα.</p>
${CPP(R`
int binary_search(int arr[], int N, int target){
    int first = 0, last = N - 1, mid;
    while (first <= last) {
        mid = (first + last) / 2;       // Εύρεση μεσαίου στοιχείου
        if (target == arr[mid])
            return mid;                 // Το στοιχείο βρέθηκε
        else if (target < arr[mid])
            last = mid - 1;             // Ψάξε στο «αριστερό» μέρος
        else
            first = mid + 1;            // Ψάξε στο «δεξί» μέρος
    }
    return -1;                          // Το στοιχείο δεν βρέθηκε
}`, { title: "binary_search (επιστρέφει θέση ή -1)", hl: [4] })}
<p>Η εκδοχή τύπου <code>bool</code> του βιβλίου είναι ίδια, με <code>return true;</code> και <code>return false;</code>.</p></div>
<div class="tbox ex"><h4>Ίχνος: αναζήτηση του 73</h4>
<p>Ταξινομημένος πίνακας <code>arr = {15, 26, 32, 44, 51, 68, 73, 80, 88, 97}</code>, $N = 10$, target $= 73$.</p>
${(() => { const a = [15, 26, 32, 44, 51, 68, 73, 80, 88, 97], r = ib7Bin(a, 73); return r.steps.map((s, k) => `<p class="small"><b>Βήμα ${k + 1}:</b> first = ${s.first}, last = ${s.last}, mid = ${s.mid}, arr[mid] = ${s.v} → ${s.v === 73 ? "<b>βρέθηκε</b>" : s.v < 73 ? `${s.v} &lt; 73, δεξί μέρος` : `${s.v} &gt; 73, αριστερό μέρος`}</p>` + ib7Arr(a, { cls: { [s.mid]: s.v === 73 ? "hit" : "mid" }, dim: [s.first, s.last], tags: Object.assign({ [s.first]: ["first", "#0F6FD1"], [s.last]: ["last", "#C77A0A"] }, { [s.mid]: [s.first === s.mid && s.last === s.mid ? "f=l=mid" : s.first === s.mid ? "first,mid" : s.last === s.mid ? "mid,last" : "mid", "#6F42C1"] }) })).join(""); })()}
<p>Βρέθηκε στη θέση <b>6</b> μετά από <b>4</b> επαναλήψεις (η σειριακή αναζήτηση θα χρειαζόταν 7 συγκρίσεις).</p></div>
<div class="tbox thm"><h4>Πολυπλοκότητα $O(\log_2 N)$</h4>
<p>Αρχικά υπάρχουν $N$ στοιχεία· μετά το 1ο βήμα απομένουν $\le N/2$, μετά το 2ο $\le N/2^2$, …, μετά το βήμα $k$ απομένουν $\le N/2^k$. Η διαδικασία τερματίζει όταν απομείνει $\le 1$ στοιχείο: $N/2^k \le 1 \Rightarrow k = O(\log_2 N)$. Κάθε βήμα κοστίζει $O(1)$, άρα η πολυπλοκότητα χειρότερης περίπτωσης είναι:</p>
<div class="fbox">$$O(\log_2 N), \qquad \text{μέγιστο πλήθος επαναλήψεων} = \lfloor \log_2 N \rfloor + 1$$</div>
<p>Π.χ. για $N = 100$: $\log_2 100 \approx 6{,}64$, δηλαδή το πολύ <b>7 βήματα</b>· για $N = 1000$ το πολύ 10· για $N = 1\,000\,000$ το πολύ 20.</p></div>
<div class="tbox ex"><h4>Παράδειγμα 5.4 — θέση της πρώτης εμφάνισης</h4>
<p>Αν ένα στοιχείο εμφανίζεται πολλές φορές, η απλή δυαδική αναζήτηση επιστρέφει <i>κάποια</i> θέση του. Για την <b>πρώτη εμφάνιση</b>, όταν το βρούμε αποθηκεύουμε τη θέση στο <code>pos</code> και <b>συνεχίζουμε στο αριστερό μέρος</b>:</p>
${CPP(R`
int binary_search_first(int arr[], int N, int target) {
    int first = 0, last = N - 1, mid, pos = -1;
    while (first <= last) {
        mid = (first + last) / 2;
        if (arr[mid] == target) {
            pos = mid;          // βρέθηκε: κρατάμε τη θέση
            last = mid - 1;     // και συνεχίζουμε αριστερά
        }
        else if (target < arr[mid])
            last = mid - 1;
        else
            first = mid + 1;
    }
    return pos;
}`, { title: "C7_5_example4.cpp", hl: [6, 7] })}
<p>Για τον πίνακα <code>{2,2,2,2,3,3,3,3,4,4,4,4}</code> και target $= 2$ επιστρέφεται <b>0</b>. Για την <b>τελευταία εμφάνιση</b> (άσκηση 5.20) συνεχίζουμε αντίστοιχα <b>δεξιά</b>: <code>first = mid + 1</code>.</p></div>
<div class="tbox rem"><h4>Παραλλαγές</h4>
<ul><li><b>Φθίνουσα σειρά:</b> αντιστρέφεται η σύγκριση — αν <code>target &gt; arr[mid]</code> πάμε αριστερά (<code>last = mid - 1</code>), αλλιώς δεξιά.</li>
<li><b>Συμβολοσειρές</b> σε αλφαβητική σειρά: ίδιος κώδικας με <code>string arr[]</code>, αφού οι τελεστές <code>&lt;</code>, <code>==</code> συγκρίνουν λεξικογραφικά.</li>
<li><b>Εναλλακτική προσέγγιση του βιβλίου</b> (πρώτη εμφάνιση): <code>first = -1</code>, <code>while (first &lt; last - 1)</code>, <code>if (arr[mid] &gt;= target) last = mid; else first = mid;</code>, <code>return last;</code>.</li></ul></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<p>✗ Δυαδική αναζήτηση σε <b>μη ταξινομημένο</b> πίνακα (δίνει λάθος αποτελέσματα). ✗ <code>while (first &lt; last)</code>: χάνεται η περίπτωση που μένει ένα μόνο στοιχείο. ✗ <code>last = mid;</code> ή <code>first = mid;</code> στον βασικό αλγόριθμο (ατέρμων βρόχος). ✗ Στον υπολογισμό του <code>mid</code> ξεχνάμε ότι η διαίρεση ακεραίων κόβει το δεκαδικό: $(5+9)/2 = 7$, $(5+6)/2 = 5$.</p></div>
`,
  widget: "ib7bin",
  gen: "ib7gbin",
  exercises: [
    { level: 1, q: R`Στον ταξινομημένο πίνακα <code>arr = {15, 26, 32, 44, 51, 68, 73, 80, 88, 97}</code> εφαρμόζεται η <code>binary_search</code> του βιβλίου με target $= 88$. Τι επιστρέφει και πόσες επαναλήψεις του <code>while</code> εκτελούνται;`,
      fields: [{ label: "Επιστρέφει:", ans: 8 }, { label: "Επαναλήψεις:", ans: 3 }],
      hint: R`mid = (0+9)/2 = 4 στο πρώτο βήμα.`, sol: R`Βήμα 1: first=0, last=9, mid=4, arr[4]=51 &lt; 88 → first=5. Βήμα 2: first=5, last=9, mid=7, arr[7]=80 &lt; 88 → first=8. Βήμα 3: first=8, last=9, mid=8, arr[8]=88 → <b>βρέθηκε</b>. Επιστρέφει <b>8</b> μετά από <b>3</b> επαναλήψεις.` },
    { level: 1, type: "mc", q: R`Η δυαδική αναζήτηση μπορεί να χρησιμοποιηθεί μόνο αν ο πίνακας είναι ήδη ταξινομημένος.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Πώς αποφασίζει ο αλγόριθμος αν θα πάει αριστερά ή δεξιά;`, sol: R`<b>ΣΩΣΤΟ.</b> Η απόφαση «αριστερά ή δεξιά» στηρίζεται στο ότι όλα τα στοιχεία αριστερά του mid είναι μικρότερα και δεξιά μεγαλύτερα — ισχύει μόνο σε ταξινομημένο πίνακα.` },
    { level: 1, q: R`Ποιος είναι ο <b>μέγιστος</b> αριθμός επαναλήψεων της δυαδικής αναζήτησης σε ταξινομημένο πίνακα 100 στοιχείων και σε πίνακα 1000 στοιχείων;`,
      fields: [{ label: "N = 100:", ans: 7 }, { label: "N = 1000:", ans: 10 }],
      hint: R`$\lfloor \log_2 N \rfloor + 1$. Ισχύει $2^6 = 64$, $2^9 = 512$.`, sol: R`$\log_2 100 \approx 6{,}64 \Rightarrow$ το πολύ <b>7</b>. $\log_2 1000 \approx 9{,}97 \Rightarrow$ το πολύ <b>10</b>.` },
    { level: 2, q: R`Δίνεται ο ταξινομημένος πίνακας 20 στοιχείων <code>{1, 3, 5, 7, 8, 9, 11, 12, 13, 15, 16, 18, 20, 22, 23, 24, 27, 28, 29, 30}</code>. Με τη δυαδική αναζήτηση για target $= 13$, ποιες είναι διαδοχικά οι τιμές του <code>mid</code>; (Βήμα 1: first=0, last=19, mid=9, arr[mid]=15.)`,
      fields: [{ label: "Τιμές mid:", ans: "9 4 6 7 8", text: true, ph: "π.χ. 9 4 …" }],
      hint: R`15 &gt; 13 → last = 8.`, sol: R`<table class="tbl"><tr><th>Βήμα</th><th>first</th><th>last</th><th>mid</th><th>arr[mid]</th><th>ενέργεια</th></tr><tr><td>1</td><td>0</td><td>19</td><td>9</td><td>15</td><td>15 &gt; 13 → last = 8</td></tr><tr><td>2</td><td>0</td><td>8</td><td>4</td><td>8</td><td>8 &lt; 13 → first = 5</td></tr><tr><td>3</td><td>5</td><td>8</td><td>6</td><td>11</td><td>11 &lt; 13 → first = 7</td></tr><tr><td>4</td><td>7</td><td>8</td><td>7</td><td>12</td><td>12 &lt; 13 → first = 8</td></tr><tr><td>5</td><td>8</td><td>8</td><td>8</td><td>13</td><td>βρέθηκε</td></tr></table>Τιμές mid: <b>9 4 6 7 8</b>.` },
    { level: 2, q: R`Στον πίνακα <code>{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}</code> αναζητείται το 40 με την <code>binary_search</code> του βιβλίου. Ποιες είναι οι τιμές των <code>first</code> και <code>last</code> όταν τερματίσει ο βρόχος, και τι επιστρέφει η συνάρτηση;`,
      fields: [{ label: "first =", ans: 7 }, { label: "last =", ans: 6 }, { label: "Επιστρέφει:", ans: -1 }],
      hint: R`Ο βρόχος σταματά όταν first &gt; last.`, sol: R`mid=4 (16 &lt; 40) → first=5· mid=7 (56 &gt; 40) → last=6· mid=5 (23 &lt; 40) → first=6· mid=6 (38 &lt; 40) → first=7. Τώρα first=<b>7</b> &gt; last=<b>6</b>, ο βρόχος τερματίζει και επιστρέφεται <b>-1</b>.` },
    { level: 2, type: "mc", q: R`Ο πίνακας είναι ταξινομημένος σε <b>φθίνουσα</b> σειρά. Ποια εντολή πρέπει να μπει στη θέση της <code>else if (target &lt; arr[mid])</code> ώστε η δυαδική αναζήτηση να λειτουργεί σωστά (με <code>last = mid - 1;</code> στο σώμα της);`,
      options: [R`<code>else if (target &gt; arr[mid])</code>`, R`<code>else if (target &lt; arr[mid])</code> (καμία αλλαγή)`, R`<code>else if (target &lt;= arr[mid])</code>`, R`<code>else if (arr[mid] &gt; arr[mid+1])</code>`], correct: 0,
      hint: R`Σε φθίνουσα σειρά τα μεγαλύτερα στοιχεία είναι αριστερά.`, sol: R`Σε φθίνουσα σειρά, αν το target είναι <b>μεγαλύτερο</b> από το μεσαίο, βρίσκεται αριστερά του: <code>else if (target &gt; arr[mid]) last = mid - 1;</code>.` },
    { level: 2, q: R`Εφαρμόζεται η <code>binary_search_first</code> του βιβλίου (πρώτη εμφάνιση) στον πίνακα <code>{2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4}</code> με target $= 3$. Τι επιστρέφει και πόσες επαναλήψεις εκτελεί ο βρόχος;`,
      fields: [{ label: "Επιστρέφει:", ans: 4 }, { label: "Επαναλήψεις:", ans: 4 }],
      hint: R`Όταν βρει το 3, κρατά τη θέση και συνεχίζει αριστερά.`, sol: R`mid=5 (3) → pos=5, last=4· mid=2 (2 &lt; 3) → first=3· mid=3 (2) → first=4· mid=4 (3) → pos=4, last=3. first &gt; last: επιστρέφει <b>4</b> μετά από <b>4</b> επαναλήψεις.` },
    { level: 3, q: R`Ο Παντελής ψάχνει την κάρτα 58 ανάμεσα σε 10 ταξινομημένες κάρτες <code>{12, 19, 27, 39, 41, 58, 63, 70, 81, 95}</code> (διαφορετικές κάρτες από το βιβλίο) με τη μέθοδο της δυαδικής αναζήτησης (αναποδογυρίζει κάθε φορά τη μεσαία κάρτα, mid = (first+last)/2). Ο Ανδρέας αναποδογυρίζει τις κάρτες μία-μία από αριστερά. Πόσες κάρτες αναποδογυρίζει ο καθένας;`,
      fields: [{ label: "Παντελής:", ans: 3 }, { label: "Ανδρέας:", ans: 6 }],
      hint: R`Πρώτη μεσαία κάρτα: θέση 4.`, sol: R`Παντελής: θέση 4 (41 &lt; 58) → first=5· θέση 7 (70 &gt; 58) → last=6· θέση 5 (58) βρέθηκε: <b>3</b> κάρτες. Ανδρέας (σειριακή): 12, 19, 27, 39, 41, 58: <b>6</b> κάρτες.` },
    { level: 3, q: R`Να συμπληρώσετε τα κενά (1) και (2) στη συνάρτηση δυαδικής αναζήτησης:${CPP(R`
int binary_search(int arr[], int N, int target){
    int first = 0, last = N - 1, mid;
    while ( ___(1)___ ) {
        mid = ___(2)___ ;
        if (target == arr[mid])
            return mid;
        else if (target < arr[mid])
            last = mid - 1;
        else
            first = mid + 1;
    }
    return -1;
}`)}`,
      fields: [{ label: "(1):", ans: ["first<=last", "last>=first"], text: true, nospace: true }, { label: "(2):", ans: ["(first+last)/2", "(last+first)/2", "((first+last)/2)", "((last+first)/2)", "((first+last))/2", "first+(last-first)/2", "(first+(last-first)/2)", "first+((last-first)/2)"], text: true, nospace: true }],
      hint: R`Ο βρόχος συνεχίζει όσο το διάστημα [first, last] δεν είναι άδειο.`, sol: R`(1) <code>first &lt;= last</code> — με <code>&lt;</code> θα χανόταν η περίπτωση ενός μόνο στοιχείου. (2) <code>(first + last) / 2</code> — ο μέσος όρος των θέσεων (ακέραια διαίρεση).` },
    { level: 2, type: "mc", q: R`Τι θα συμβεί αν στη <code>binary_search</code> η συνθήκη γίνει <code>while (first &lt; last)</code>;`,
      options: [R`Σε ορισμένες περιπτώσεις δεν θα βρίσκεται στοιχείο που υπάρχει, π.χ. όταν μένει μόνο ένα στοιχείο για έλεγχο`, R`Ο βρόχος δεν θα τερματίζει ποτέ`, R`Η συνάρτηση θα λειτουργεί ακριβώς όπως πριν`, R`Θα γίνεται πρόσβαση εκτός ορίων του πίνακα`], correct: 0,
      hint: R`Δοκίμασε πίνακα ενός στοιχείου: first = last = 0.`, sol: R`Όταν <code>first == last</code> υπάρχει ακόμη ένα στοιχείο για έλεγχο, αλλά με <code>first &lt; last</code> ο βρόχος δεν εκτελείται. Π.χ. για <code>{7}</code> και target 7 θα επιστρεφόταν -1. Ο βρόχος πάντα τερματίζει (το διάστημα μικραίνει), αλλά δίνει λάθος αποτέλεσμα.` }
  ]
},
/* ───────────────────────────── 8.1 ───────────────────────────── */
{
  id: "8.1", unit: 8, title: "Ταξινόμηση φυσαλίδας (bubble sort) σε C++ και βελτιστοποίηση",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.6 §1–5 Αλγόριθμος φυσαλίδας, Βελτιστοποίηση, Εναλλακτική προσέγγιση (σ. 183–192) · Παράδειγμα 6.1 · Ασκήσεις 6.1, 6.4–6.5",
  intro: "Πώς ταξινομούμε έναν πίνακα συγκρίνοντας και αντιμεταθέτοντας γειτονικά στοιχεία; Ο αλγόριθμος φυσαλίδας (bubble sort) με τη λογική μεταβλητή sorted.",
  thumb: ICON("bubble", "blue"),
  theory: R`
<p><b>Ταξινόμηση</b> (sorting) είναι η διάταξη των στοιχείων ενός συνόλου σε μια συγκεκριμένη σειρά, <b>αύξουσα</b> ή <b>φθίνουσα</b>. Διευκολύνει πολύ την αναζήτηση (π.χ. επιτρέπει τη δυαδική αναζήτηση). Η ύλη περιλαμβάνει δύο αλγορίθμους που χρησιμοποιούν τεχνικές ανταλλαγής: την <b>ταξινόμηση φυσαλίδας (bubble sort)</b> και την <b>ταξινόμηση με εισαγωγή (insertion sort)</b>.</p>
<div class="tbox def"><h4>Ο αλγόριθμος φυσαλίδας (bubble sort)</h4>
<p>Ο αλγόριθμος βασίζεται στη <b>σύγκριση και αντιμετάθεση δύο γειτονικών στοιχείων</b>. Ξεκινώντας από τα δύο πρώτα στοιχεία, διασχίζει τον πίνακα και αντιμεταθέτει κάθε ζευγάρι <code>arr[i]</code>, <code>arr[i+1]</code> που δεν είναι στη σωστή σειρά. Μετά από κάθε <b>διάσχιση</b> (pass) το μεγαλύτερο στοιχείο του μη ταξινομημένου τμήματος «ανεβαίνει» στο τέλος — όπως οι φυσαλίδες στην επιφάνεια του νερού. Χρειάζονται αρκετές διασχίσεις μέχρι την τελική ταξινόμηση.</p>
${CPP(R`
void bubblesort(int arr[], int N){
    bool sorted;                    // Μεταβλητή λογικού τύπου
    int temp;                       // Βοηθητική μεταβλητή αντιμετάθεσης
    do{
        sorted = true;
        for (int i=0; i<N-1; i++){
            if (arr[i]>arr[i+1]){       // Αν το επόμενο είναι μικρότερο
                temp = arr[i];          // αντιμεταθέτουμε με τη
                arr[i] = arr[i+1];      // βοηθητική μεταβλητή temp
                arr[i+1] = temp;
                sorted = false;         // ο πίνακας δεν ήταν ταξινομημένος
            }
        }
    } while (sorted==false);
}`, { title: "bubblesort (αύξουσα σειρά)", hl: [7, 8, 9, 10, 11] })}
<p>Η <b>λογική μεταβλητή <code>sorted</code></b> σηματοδοτεί αν ο πίνακας είναι ταξινομημένος: πριν από κάθε διάσχιση γίνεται <code>true</code>· αν γίνει έστω και μία αντιμετάθεση γίνεται <code>false</code>. Αν στο τέλος μιας διάσχισης έχει μείνει <code>true</code>, δεν έγινε καμία αντιμετάθεση, άρα ο πίνακας είναι ταξινομημένος και ο βρόχος <code>do…while</code> τερματίζει.</p></div>
<div class="tbox ex"><h4>Η πρώτη διάσχιση βήμα-βήμα</h4>
<p><code>arr = {5, 6, 2, 4, 1, 9, 3, 0, 8, 7}</code>. Στην 1η διάσχιση το 6 «ταξιδεύει» μέχρι να συναντήσει το 9, και μετά το 9 μέχρι το τέλος:</p>
${(() => { const r = ib7Bubble([5, 6, 2, 4, 1, 9, 3, 0, 8, 7]); return r.events.filter(e => e.pass === 1).map(e => ib7Arr(e.a, { noidx: true, cls: { [e.i]: e.swap ? "sw" : "cmp", [e.j]: e.swap ? "sw" : "cmp" } })).join(""); })()}
${ib7Leg([IB7L.cmp, IB7L.sw])}
<details class="steps"><summary>Ο πίνακας μετά από κάθε διάσχιση</summary>
${(() => { const r = ib7Bubble([5, 6, 2, 4, 1, 9, 3, 0, 8, 7]); return `<table class="tbl"><tr><th>Διάσχιση</th><th>Πίνακας</th></tr>${r.passes.map((p, k) => `<tr><td>${k + 1}</td><td><code>${p.join(" ")}</code></td></tr>`).join("")}</table><p>Με την <b>${r.passes.length}η</b> διάσχιση δεν γίνεται καμία αντιμετάθεση: ο πίνακας είναι πλέον ταξινομημένος (συνολικά ${r.comps} συγκρίσεις, ${r.swaps} αντιμεταθέσεις).</p>`; })()}
</details></div>
<div class="tbox thm"><h4>Βελτιστοποίηση: μικραίνει το πεδίο διάσχισης</h4>
<p>Μετά από κάθε διάσχιση, τα εκάστοτε μεγαλύτερα στοιχεία τοποθετούνται στις τελευταίες θέσεις. Άρα σε κάθε επόμενη διάσχιση μπορούμε να ελέγχουμε <b>μία λιγότερη θέση</b>: χρησιμοποιούμε τη μεταβλητή <code>S</code> (αρχικά <code>S = N</code>) στη θέση του πλήθους και τη μειώνουμε (<code>S--</code>) μετά από κάθε διάσχιση.</p>
${CPP(R`
void bubblesort(int arr[], int N){
    bool sorted;
    int temp, S = N;
    do{
        sorted = true;
        for (int i=0; i<S-1; i++){      // όχι πάντα όλος ο πίνακας
            if (arr[i]>arr[i+1]){
                temp = arr[i];
                arr[i] = arr[i+1];
                arr[i+1] = temp;
                sorted = false;
            }
        }
        S--;                            // μειώνουμε το πεδίο διάσχισης
    } while (sorted==false);
}`, { title: "bubblesort — βελτιστοποιημένη", hl: [3, 6, 14] })}
</div>
<div class="tbox def"><h4>Εναλλακτική προσέγγιση: δύο βρόχοι for</h4>
<p>Συγκρίνει το στοιχείο <code>arr[i]</code> με <b>όλα τα επόμενα</b> <code>arr[j]</code> ($j &gt; i$) και αντιμεταθέτει όταν χρειάζεται. Μετά την <code>i</code>-οστή επανάληψη του εξωτερικού βρόχου, στη θέση <code>i</code> βρίσκεται το <b>μικρότερο</b> από τα υπόλοιπα. Δεν ελέγχει αν ο πίνακας ταξινομήθηκε: τερματίζει πάντα όταν συγκρίνει το προτελευταίο με το τελευταίο στοιχείο.</p>
${CPP(R`
void bubblesort(int arr[], int N){
    int temp;
    for (int i=0; i<N-1; i++){
        for (int j=i+1; j<N; j++){
            if (arr[i]>arr[j]){
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
}`, { title: "bubblesort με δύο βρόχους for" })}
<details class="steps"><summary>Ίχνος για {23, 74, 16, 28, 54}</summary>${(() => { const r = ib7Bubble2([23, 74, 16, 28, 54]); return r.events.map(e => `<p class="small" style="margin:6px 0 0">i = ${e.i}, j = ${e.j}: ${e.swap ? "αντιμετάθεση" : "καμία αλλαγή"}</p>` + ib7Arr(e.a, { noidx: true, cls: { [e.i]: e.swap ? "sw" : "cmp", [e.j]: e.swap ? "sw" : "cmp" } })).join(""); })()}</details></div>
<div class="tbox ex"><h4>Παράδειγμα 6.1 — εμφάνιση μετά από κάθε αντιμετάθεση</h4>
<p>Μια συχνή παραλλαγή στις εξετάσεις: μέσα στο <code>if</code> εμφανίζουμε ολόκληρο τον πίνακα μετά από κάθε αντιμετάθεση, και πριν από κάθε διάσχιση το <code>"Pass = "</code> με τον αύξοντα αριθμό της (<code>++cnt</code>).</p>
${CPP(R`
do{
    sorted = true;
    cout << "Pass = " << ++cnt << ":" << endl;
    for (int i=0; i<N-1; i++){
        if (arr[i]>arr[i+1]){
            temp = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = temp;
            sorted = false;
            for (int k=0; k<N; k++)
                cout << arr[k] << " ";
            cout << endl;
        }
    }
} while (sorted==false);`, { small: true })}
<p>Για είσοδο <code>2 1 3 4 5 6 7 8</code>: εμφανίζεται <code>Pass = 1:</code>, μία γραμμή <code>1 2 3 4 5 6 7 8</code> και <code>Pass = 2:</code> (χωρίς αντιμεταθέσεις).</p></div>
<div class="tbox rem"><h4>Φθίνουσα σειρά και άλλοι τύποι</h4>
<p>Για <b>φθίνουσα σειρά</b> αλλάζει μόνο η σύγκριση: <code>if (arr[i] &lt; arr[i+1])</code>. Για πίνακα χαρακτήρων ή συμβολοσειρών αλλάζει ο τύπος του πίνακα και της <code>temp</code> (<code>char</code>, <code>string</code>), ενώ η σύγκριση γίνεται αλφαβητικά (κατά ASCII: τα κεφαλαία προηγούνται των πεζών).</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<p>✗ <code>for (int i=0; i&lt;N; i++)</code>: τότε το <code>arr[i+1]</code> βγαίνει εκτός ορίων στο <code>i = N-1</code>. ✗ Αντιμετάθεση χωρίς βοηθητική μεταβλητή (<code>arr[i]=arr[i+1]; arr[i+1]=arr[i];</code> χάνει την τιμή). ✗ Το <code>sorted = true;</code> έξω από το <code>do</code> (πριν τον βρόχο): ο αλγόριθμος δεν τερματίζει. ✗ Στο ίχνος «μετά από 2 διασχίσεις» δίνουμε τον πίνακα μετά από 2 αντιμεταθέσεις.</p></div>
`,
  widget: "ib7bub",
  gen: "ib7gbub",
  exercises: [
    { level: 1, q: R`Ο πίνακας <code>{16, 6, 4, 14, 5}</code> ταξινομείται σε αύξουσα σειρά με τη <code>bubblesort</code> του βιβλίου (με τη λογική μεταβλητή sorted). Πώς θα είναι ο πίνακας μετά την <b>1η διάσχιση</b>;`,
      fields: [{ label: "Πίνακας:", ans: "6 4 14 5 16", text: true, ph: "π.χ. 1 2 3 4 5" }],
      hint: R`Το 16 είναι μεγαλύτερο από όλα και θα «ταξιδέψει» στο τέλος.`, sol: R`16&gt;6 → <code>6 16 4 14 5</code>· 16&gt;4 → <code>6 4 16 14 5</code>· 16&gt;14 → <code>6 4 14 16 5</code>· 16&gt;5 → <code>6 4 14 5 16</code>. Άρα: <b>6 4 14 5 16</b>.` },
    { level: 1, type: "mc", q: R`Στην ταξινόμηση φυσαλίδας σε αύξουσα σειρά, μετά την πρώτη διάσχιση το μεγαλύτερο στοιχείο του πίνακα βρίσκεται στην τελευταία θέση.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Τι γίνεται με το μέγιστο όταν το συναντήσει η διάσχιση;`, sol: R`<b>ΣΩΣΤΟ.</b> Μόλις η διάσχιση συναντήσει το μέγιστο, το αντιμεταθέτει σε κάθε επόμενη σύγκριση, οπότε καταλήγει στη θέση $N-1$.` },
    { level: 1, type: "mc", q: R`Ποιος είναι ο ρόλος της μεταβλητής <code>sorted</code> στη <code>bubblesort</code> του βιβλίου;`,
      options: [R`Δείχνει αν έγινε αντιμετάθεση στη διάσχιση· αν όχι, ο πίνακας είναι ταξινομημένος και ο βρόχος τερματίζει`, R`Μετρά πόσες αντιμεταθέσεις έγιναν`, R`Αποθηκεύει προσωρινά την τιμή κατά την αντιμετάθεση`, R`Δείχνει αν η ταξινόμηση είναι αύξουσα ή φθίνουσα`], correct: 0,
      hint: R`Πότε γίνεται false;`, sol: R`Η <code>sorted</code> γίνεται <code>true</code> πριν από κάθε διάσχιση και <code>false</code> σε κάθε αντιμετάθεση. Αν μια διάσχιση ολοκληρωθεί με <code>sorted == true</code>, ο πίνακας είναι ταξινομημένος. (Την προσωρινή αποθήκευση την κάνει η <code>temp</code>.)` },
    { level: 2, q: R`Για τον πίνακα <code>{16, 6, 4, 14, 5}</code> και τη <code>bubblesort</code> του βιβλίου (χωρίς βελτιστοποίηση, <code>i&lt;N-1</code> σε κάθε διάσχιση), πόσες διασχίσεις (επαναλήψεις του <code>do…while</code>), πόσες συγκρίσεις <code>arr[i]&gt;arr[i+1]</code> και πόσες αντιμεταθέσεις γίνονται;`,
      fields: [{ label: "Διασχίσεις:", ans: 4 }, { label: "Συγκρίσεις:", ans: 16 }, { label: "Αντιμεταθέσεις:", ans: 7 }],
      hint: R`Μην ξεχάσεις την τελευταία διάσχιση χωρίς αντιμεταθέσεις.`, sol: R`Διάσχιση 1: <code>6 4 14 5 16</code> (4 αντιμεταθέσεις). Διάσχιση 2: <code>4 6 5 14 16</code> (2). Διάσχιση 3: <code>4 5 6 14 16</code> (1). Διάσχιση 4: καμία αντιμετάθεση → τέλος. Άρα <b>4</b> διασχίσεις × 4 συγκρίσεις = <b>16</b> συγκρίσεις και $4+2+1 =$ <b>7</b> αντιμεταθέσεις.` },
    { level: 2, q: R`Ο πίνακας <code>{5, 6, 2, 4, 1, 9, 3, 0, 8, 7}</code> ταξινομείται με τη <code>bubblesort</code> του βιβλίου. Πώς θα είναι μετά τη <b>2η διάσχιση</b>;`,
      fields: [{ label: "Πίνακας:", ans: "2 4 1 5 3 0 6 7 8 9", text: true }],
      hint: R`Μετά την 1η διάσχιση: 5 2 4 1 6 3 0 8 7 9.`, sol: R`Μετά την 1η: <code>5 2 4 1 6 3 0 8 7 9</code>. Στη 2η το 5 προχωρά μέχρι το 6, το 6 μέχρι το 8 και το 8 αντιμετατίθεται με το 7: <b>2 4 1 5 3 0 6 7 8 9</b>.` },
    { level: 2, type: "mc", q: R`Ποια αλλαγή κάνει τη <code>bubblesort</code> του βιβλίου να ταξινομεί σε <b>φθίνουσα</b> σειρά;`,
      options: [R`<code>if (arr[i] &lt; arr[i+1])</code>`, R`<code>for (int i=N-1; i&gt;0; i--)</code>`, R`<code>} while (sorted==true);</code>`, R`<code>sorted = false;</code> πριν από κάθε διάσχιση`], correct: 0,
      hint: R`Πότε πρέπει να αντιμετατεθούν δύο γειτονικά στοιχεία σε φθίνουσα σειρά;`, sol: R`Σε φθίνουσα σειρά αντιμεταθέτουμε όταν το επόμενο στοιχείο είναι <b>μεγαλύτερο</b>: <code>if (arr[i] &lt; arr[i+1])</code>. Όλα τα υπόλοιπα μένουν ίδια.` },
    { level: 2, q: R`Για τον σχεδόν ταξινομημένο πίνακα <code>{2, 1, 3, 4, 5, 6, 7, 8}</code>, πόσες συγκρίσεις στοιχείων («βήματα» του εσωτερικού βρόχου) κάνει καθεμία από τις τρεις υλοποιήσεις του βιβλίου;`,
      fields: [{ label: "Με sorted (χωρίς S):", ans: 14 }, { label: "Με sorted και S--:", ans: 13 }, { label: "Με δύο for:", ans: 28 }],
      hint: R`Με sorted χρειάζονται 2 διασχίσεις. Οι δύο for κάνουν πάντα N(N−1)/2 συγκρίσεις.`, sol: R`Με <code>sorted</code>: 2 διασχίσεις × 7 = <b>14</b>. Βελτιστοποιημένη: 7 + 6 = <b>13</b> (όπως στο βιβλίο). Δύο for: $7+6+5+4+3+2+1 = \frac{8\cdot 7}{2} =$ <b>28</b>, αφού δεν ελέγχουν αν ο πίνακας ταξινομήθηκε.` },
    { level: 2, q: R`Ο πίνακας <code>{15, 61, 42, 24, 53}</code> ταξινομείται σε <b>φθίνουσα</b> σειρά με την εκδοχή των δύο βρόχων <code>for</code> (σύγκριση <code>if (arr[i] &lt; arr[j])</code>). Πώς είναι ο πίνακας μετά το τέλος της επανάληψης <code>i = 0</code> και μετά το τέλος της επανάληψης <code>i = 1</code>;`,
      fields: [{ label: "Μετά i = 0:", ans: "61 15 42 24 53", text: true }, { label: "Μετά i = 1:", ans: "61 53 15 24 42", text: true }],
      hint: R`Στη θέση i καταλήγει το μεγαλύτερο από τα arr[i..N−1].`, sol: R`i=0: 15&lt;61 αντιμετάθεση → <code>61 15 42 24 53</code>· το 61 δεν αλλάζει άλλο: <b>61 15 42 24 53</b>. i=1: 15&lt;42 → <code>61 42 15 24 53</code>· 42&lt;53 (j=4) → <code>61 53 15 24 42</code>: <b>61 53 15 24 42</b>.` },
    { level: 3, q: R`Το πρόγραμμα του Παραδείγματος 6.1 (εμφανίζει <code>Pass = k:</code> πριν από κάθε διάσχιση και ολόκληρο τον πίνακα μετά από <b>κάθε αντιμετάθεση</b>· στο τέλος η <code>main</code> εμφανίζει <code>final:</code> και τον ταξινομημένο πίνακα) εκτελείται με είσοδο <code>5</code> και <code>3 1 2 5 4</code>. Πόσες γραμμές <code>Pass</code> και πόσες γραμμές πίνακα θα εμφανιστούν (πριν από τη γραμμή <code>final:</code>);`,
      fields: [{ label: "Γραμμές Pass:", ans: 2 }, { label: "Γραμμές πίνακα:", ans: 3 }],
      hint: R`Μια γραμμή πίνακα ανά αντιμετάθεση.`, sol: R`Pass 1: 3&gt;1 → <code>1 3 2 5 4</code>· 3&gt;2 → <code>1 2 3 5 4</code>· 5&gt;4 → <code>1 2 3 4 5</code> (3 αντιμεταθέσεις). Pass 2: καμία αντιμετάθεση, τέλος. ${OUT(`Pass = 1:
1 3 2 5 4
1 2 3 5 4
1 2 3 4 5
Pass = 2:
final: 1 2 3 4 5`)} Άρα <b>2</b> γραμμές Pass και <b>3</b> γραμμές πίνακα.` },
    { level: 3, q: R`Να συμπληρώσετε τα κενά στη βελτιστοποιημένη ταξινόμηση φυσαλίδας:${CPP(R`
void bubblesort(int arr[], int N){
    bool sorted;
    int temp, S = N;
    do{
        sorted = true;
        for (int i=0; ___(1)___; i++){
            if (arr[i]>arr[i+1]){
                temp = arr[i];
                arr[i] = arr[i+1];
                arr[i+1] = temp;
                sorted = false;
            }
        }
        ___(2)___;
    } while (sorted==false);
}`)}`,
      fields: [{ label: "(1):", ans: ["i<S-1", "i<=S-2", "S-1>i"], text: true, nospace: true }, { label: "(2):", ans: ["S--", "S=S-1", "--S", "S-=1"], text: true, nospace: true }],
      hint: R`Η διάσχιση φτάνει μέχρι το S−1 και μετά το πεδίο μικραίνει κατά ένα.`, sol: R`(1) <code>i &lt; S-1</code>: η διάσχιση περιορίζεται στα πρώτα <code>S</code> στοιχεία. (2) <code>S--</code>: μετά από κάθε διάσχιση το τελευταίο στοιχείο του πεδίου είναι στη σωστή θέση, οπότε το πεδίο μικραίνει.` }
  ]
},
/* ───────────────────────────── 8.2 ───────────────────────────── */
{
  id: "8.2", unit: 8, title: "Ταξινόμηση με εισαγωγή (insertion sort) σε C++",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.6 §6–7 Ταξινόμηση με εισαγωγή, Μετακίνηση στοιχείων (σ. 192–196) · Παράδειγμα 6.3 · Ασκήσεις 6.2–6.3, 6.9–6.11",
  intro: "Πώς ταξινομεί κάποιος τα φύλλα της τράπουλας στο χέρι του; Παίρνει ένα-ένα και το εισάγει στη σωστή θέση — αυτή είναι η ταξινόμηση με εισαγωγή (insertion sort).",
  thumb: ICON("insert", "green"),
  theory: R`
<p>Η <b>ταξινόμηση με εισαγωγή (insertion sort)</b> λειτουργεί όπως όταν ταξινομούμε τα φύλλα που μας μοίρασαν σε ένα παιχνίδι: ξεκινώντας από αριστερά, παίρνουμε κάθε στοιχείο και το <b>εισάγουμε στη σωστή θέση</b> μέσα στο ήδη ταξινομημένο τμήμα που βρίσκεται <b>αριστερά</b> του. Είναι κι αυτή $O(N^2)$, αλλά στην πράξη πολύ ταχύτερη από την ταξινόμηση φυσαλίδας.</p>
<div class="tbox def"><h4>Ο αλγόριθμος ταξινόμησης με εισαγωγή</h4>
<ul><li>Το <b>πρώτο στοιχείο</b> θεωρείται ήδη ταξινομημένο (δεν έχει στοιχεία αριστερά του) — γι' αυτό ο βρόχος ξεκινά από <code>i = 1</code>.</li>
<li>Αποθηκεύουμε το <code>arr[i]</code> στη βοηθητική μεταβλητή <code>temp</code>.</li>
<li>Όσο βρίσκουμε αριστερά <b>μεγαλύτερα</b> στοιχεία, τα <b>αντιγράφουμε μία θέση δεξιά</b> (<code>arr[j+1] = arr[j]</code>) και μετακινούμαστε αριστερά (<code>j--</code>).</li>
<li>Όταν φτάσουμε στην αρχή (<code>j &lt; 0</code>) ή συναντήσουμε μικρότερο (ή ίσο) στοιχείο, τοποθετούμε την <code>temp</code> στη θέση <code>j+1</code>.</li></ul>
${CPP(R`
void insertionSort(int arr[], int N){
    int temp;                         // Βοηθητική μεταβλητή
    int j;                            // Θέση στοιχείου
    for (int i=1; i<N; i++){          // από το δεύτερο στοιχείο
        temp = arr[i];                // αποθηκεύουμε το στοιχείο
        j = i - 1;                    // ψάχνουμε στα αριστερά
        while (j>=0 && arr[j]>temp){  // όσο βρίσκουμε μεγαλύτερα
            arr[j+1] = arr[j];        // αντιγράφουμε δεξιά
            j--;                      // και πάμε αριστερά
        }
        arr[j+1] = temp;              // στη σωστή θέση
    }
}`, { title: "insertionSort (αύξουσα σειρά)", hl: [7, 8, 9] })}
</div>
<div class="tbox ex"><h4>Ίχνος για {5, 6, 2, 4, 1, 9, 3, 0, 8, 7}</h4>
${(() => { const a = [5, 6, 2, 4, 1, 9, 3, 0, 8, 7], r = ib7Insert(a); return `<table class="tbl"><tr><th>i</th><th>temp</th><th>Πίνακας μετά την εισαγωγή</th></tr>${r.steps.map((s, k) => `<tr><td>${k + 1}</td><td>${a[k + 1]}</td><td><code>${s.map((v, t) => t <= k + 1 ? `<b>${v}</b>` : v).join(" ")}</code></td></tr>`).join("")}</table><p class="small muted">Με έντονα: το ταξινομημένο τμήμα arr[0…i]. Σύνολο: ${r.shifts} μετακινήσεις, ${r.comps} συγκρίσεις arr[j] &gt; temp.</p>`; })()}
</div>
<div class="tbox thm"><h4>Μετακίνηση στοιχείων (τι γίνεται μέσα στο while)</h4>
<p>Ας δούμε την εισαγωγή του 4 στον πίνακα <code>2 5 6 4 1 …</code> ($i = 3$). Αποθηκεύουμε <code>temp = 4</code>:</p>
${(() => { const r = ib7Insert([2, 5, 6, 4, 1]); const ev = r.events.filter(e => e.i === 3); return ev.map(e => `<p class="small" style="margin:6px 0 0">${e.kind === "take" ? "temp = 4, j = 2" : e.kind === "shift" ? `arr[${e.j}] = ${e.a[e.j]} &gt; 4 → αντιγραφή στη θέση ${e.j + 1}` : e.kind === "stop" ? `arr[${e.j}] = ${e.a[e.j]} &lt; 4 → σταματάμε` : `arr[${e.j}] = temp = 4`}</p>` + ib7Arr(e.a, { noidx: false, cls: e.kind === "shift" ? { [e.j + 1]: "sw" } : e.kind === "put" ? { [e.j]: "hit" } : e.kind === "stop" ? { [e.j]: "cmp" } : { 3: "tmp" } })).join(""); })()}
<p>Παρατήρησε ότι κατά τη μετακίνηση ο πίνακας περιέχει <b>προσωρινά διπλότυπα</b> (π.χ. <code>2 5 6 6 1</code>, μετά <code>2 5 5 6 1</code>) — η τιμή 4 δεν χάνεται, είναι αποθηκευμένη στην <code>temp</code>.</p></div>
<div class="tbox ex"><h4>Παράδειγμα 6.3 — φθίνουσα σειρά</h4>
<p>Αρκεί να αλλάξει η σύγκριση στο <code>while</code>: όσο βρίσκουμε <b>μικρότερα</b> στοιχεία τα μετακινούμε δεξιά.</p>
${CPP(R`
while (j>=0 && arr[j]<temp){      // Φθίνουσα σειρά
    arr[j+1] = arr[j];
    j--;
}`, { small: true, hl: [1] })}
<div class="figrow"><div>${OUT(`10
5 6 2 4 1 9 3 0 8 7`, "Είσοδος")}</div><div>${OUT(`9 8 7 6 5 4 3 2 1 0`)}</div></div>
<p>Για πίνακα χαρακτήρων: <code>void insertionSort(char arr[], int N)</code> και <code>char temp;</code> — π.χ. <code>G P T E</code> → <code>E G P T</code>.</p></div>
<div class="tbox rem"><h4>Γιατί πρώτα το j&gt;=0 στη συνθήκη;</h4>
<p>Ο τελεστής <code>&amp;&amp;</code> αποτιμά τη δεύτερη συνθήκη <b>μόνο αν η πρώτη είναι αληθής</b> (short-circuit evaluation). Όταν <code>j</code> γίνει -1, το <code>j&gt;=0</code> είναι ψευδές και το <code>arr[-1]</code> δεν προσπελαύνεται ποτέ. Με την αντίστροφη σειρά (<code>arr[j]&gt;temp &amp;&amp; j&gt;=0</code>) θα γινόταν πρόσβαση εκτός ορίων.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<p>✗ Ο βρόχος <code>for</code> από <code>i = 0</code>. ✗ <code>arr[j] = temp;</code> αντί για <code>arr[j+1] = temp;</code> μετά το while. ✗ Η <code>temp = arr[i];</code> μετά τις μετακινήσεις (η τιμή έχει ήδη «πατηθεί»). ✗ Σε ερώτηση «πίνακας μετά από κάθε επανάληψη» ξεχνάμε τις επαναλήψεις όπου το στοιχείο <b>μένει στη θέση του</b> (ο πίνακας εμφανίζεται ξανά ίδιος).</p></div>
`,
  widget: "ib7ins",
  gen: "ib7gins",
  exercises: [
    { level: 1, q: R`Ο πίνακας <code>{25, 16, 14, 13, 20, 15, 26, 17}</code> ταξινομείται σε αύξουσα σειρά με την <code>insertionSort</code> του βιβλίου. Πώς θα είναι ο πίνακας μετά το τέλος της επανάληψης <code>i = 3</code>;`,
      fields: [{ label: "Πίνακας:", ans: "13 14 16 25 20 15 26 17", text: true }],
      hint: R`Μετά το i = 3 τα 4 πρώτα στοιχεία είναι ταξινομημένα.`, sol: R`i=1: <code>16 25 14 13 …</code>· i=2: <code>14 16 25 13 …</code>· i=3: το 13 μπαίνει στην αρχή: <b>13 14 16 25 20 15 26 17</b>.` },
    { level: 1, type: "mc", q: R`Στην ταξινόμηση με εισαγωγή, ο βρόχος <code>for</code> ξεκινά από <code>i = 1</code> επειδή το πρώτο στοιχείο θεωρείται ήδη ταξινομημένο.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Με τι θα συγκρινόταν το arr[0];`, sol: R`<b>ΣΩΣΤΟ.</b> Το πρώτο στοιχείο δεν έχει άλλα στοιχεία αριστερά του, οπότε μόνο του αποτελεί ταξινομημένο τμήμα.` },
    { level: 2, q: R`Κατά την εισαγωγή του στοιχείου 4 στον πίνακα <code>{2, 5, 6, 4, 1}</code> (επανάληψη <code>i = 3</code>), πώς είναι ο πίνακας <b>αμέσως μετά την έξοδο από το while</b> (πριν από την εντολή <code>arr[j+1] = temp;</code>) και ποια είναι η τιμή του <code>j</code>;`,
      fields: [{ label: "Πίνακας:", ans: "2 5 5 6 1", text: true }, { label: "j =", ans: 0 }],
      hint: R`Το 6 και το 5 αντιγράφονται μία θέση δεξιά.`, sol: R`temp=4, j=2: 6&gt;4 → <code>2 5 6 6 1</code>, j=1· 5&gt;4 → <code>2 5 5 6 1</code>, j=0· 2&gt;4 ψευδές → έξοδος. Πίνακας <b>2 5 5 6 1</b>, <b>j = 0</b>· μετά <code>arr[1] = 4</code> → <code>2 4 5 6 1</code>.` },
    { shuffle: true, level: 2, type: "mc", q: R`Ποια συνθήκη στο <code>while</code> κάνει την <code>insertionSort</code> να ταξινομεί σε <b>φθίνουσα</b> σειρά;`,
      options: [R`<code>while (j&gt;=0 &amp;&amp; arr[j]&lt;temp)</code>`, R`<code>while (j&gt;=0 &amp;&amp; arr[j]&gt;temp)</code>`, R`<code>while (j&lt;0 &amp;&amp; arr[j]&lt;temp)</code>`, R`<code>while (j&gt;=0 || arr[j]&lt;temp)</code>`], correct: 0,
      hint: R`Ποια στοιχεία πρέπει να «περάσει» η temp σε φθίνουσα σειρά;`, sol: R`Σε φθίνουσα σειρά τα μικρότερα στοιχεία πάνε δεξιά: μετακινούμε όσο <code>arr[j] &lt; temp</code>, πάντα με τον έλεγχο <code>j&gt;=0</code> πρώτο και με <code>&amp;&amp;</code>.` },
    { level: 2, q: R`Για τον πίνακα <code>{5, 6, 2, 4, 1}</code> και την <code>insertionSort</code> του βιβλίου (αύξουσα), πόσες μετακινήσεις <code>arr[j+1] = arr[j]</code> και πόσες συγκρίσεις <code>arr[j]&gt;temp</code> εκτελούνται συνολικά;`,
      fields: [{ label: "Μετακινήσεις:", ans: 8 }, { label: "Συγκρίσεις:", ans: 10 }],
      hint: R`Όταν j γίνει -1, η σύγκριση arr[j]>temp δεν εκτελείται (short-circuit).`, sol: R`<table class="tbl"><tr><th>i</th><th>temp</th><th>μετακινήσεις</th><th>συγκρίσεις</th><th>πίνακας</th></tr><tr><td>1</td><td>6</td><td>0</td><td>1</td><td>5 6 2 4 1</td></tr><tr><td>2</td><td>2</td><td>2</td><td>2</td><td>2 5 6 4 1</td></tr><tr><td>3</td><td>4</td><td>2</td><td>3</td><td>2 4 5 6 1</td></tr><tr><td>4</td><td>1</td><td>4</td><td>4</td><td>1 2 4 5 6</td></tr></table>Σύνολο <b>8</b> μετακινήσεις και <b>10</b> συγκρίσεις (όταν το στοιχείο φτάνει στην αρχή, η τελευταία σύγκριση δεν γίνεται).` },
    { level: 2, q: R`Πόσες συγκρίσεις <code>arr[j]&gt;temp</code> κάνει η <code>insertionSort</code> σε πίνακα 10 στοιχείων που είναι <b>ήδη ταξινομημένος</b> σε αύξουσα σειρά, και πόσες σε πίνακα 10 στοιχείων ταξινομημένο σε <b>φθίνουσα</b> σειρά (χειρότερη περίπτωση);`,
      fields: [{ label: "Ήδη ταξινομημένος:", ans: 9 }, { label: "Φθίνουσα σειρά:", ans: 45 }],
      hint: R`Καλύτερη περίπτωση: μία σύγκριση ανά επανάληψη του for. Χειρότερη: 1 + 2 + … + (N−1).`, sol: R`Καλύτερη περίπτωση: το while δεν εκτελείται ποτέ, μία σύγκριση για κάθε $i = 1 \dots 9$: <b>$N - 1 = 9$</b>. Χειρότερη: κάθε στοιχείο πάει στην αρχή, $1 + 2 + \dots + 9 = \frac{9\cdot 10}{2} =$ <b>45</b> $\approx N^2/2$.` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα με είσοδο <code>4</code> και <code>G P T E</code>;${CPP(R`
#include <iostream>
using namespace std;
void insertionSort(char arr[], int N){
    char temp;
    int j;
    for (int i=1; i<N; i++){
        temp = arr[i];
        j = i - 1;
        while (j>=0 && arr[j]>temp){
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = temp;
    }
}
int main(){
    char c[50];
    int N;
    cin >> N;
    for (int i=0; i<N; i++)
        cin >> c[i];
    insertionSort(c, N);
    for (int i=0; i<N; i++)
        cout << c[i] << " ";
    return 0;
}`)}`,
      fields: [{ label: "Έξοδος:", ans: "E G P T", text: true, cs: true }],
      hint: R`Αλφαβητική σειρά (κατά ASCII).`, sol: R`Οι χαρακτήρες συγκρίνονται με τους κωδικούς ASCII, άρα ταξινομούνται αλφαβητικά. ${OUT(`E G P T `)}` },
    { level: 3, q: R`Μια παραλλαγή της <code>insertionSort</code> εμφανίζει ολόκληρο τον πίνακα <b>στο τέλος κάθε επανάληψης του for</b>. Για τον πίνακα <code>{1, 4, 3, 5, 6, 2}</code>, ποια είναι η <b>3η</b> και η <b>5η</b> γραμμή που εμφανίζεται;`,
      fields: [{ label: "3η γραμμή:", ans: "1 3 4 5 6 2", text: true }, { label: "5η γραμμή:", ans: "1 2 3 4 5 6", text: true }],
      hint: R`Εμφανίζεται γραμμή και όταν το στοιχείο μένει στη θέση του.`, sol: R`i=1 (4): <code>1 4 3 5 6 2</code>· i=2 (3): <code>1 3 4 5 6 2</code>· i=3 (5): <code>1 3 4 5 6 2</code>· i=4 (6): <code>1 3 4 5 6 2</code>· i=5 (2): <code>1 2 3 4 5 6</code>. Η 3η γραμμή είναι <b>1 3 4 5 6 2</b> (το 5 έμεινε στη θέση του) και η 5η <b>1 2 3 4 5 6</b>.` },
    { level: 2, q: R`Να συμπληρώσετε τη συνθήκη του <code>while</code> και την εντολή μετά από αυτό στην <code>insertionSort</code> (αύξουσα σειρά):${CPP(R`
for (int i=1; i<N; i++){
    temp = arr[i];
    j = i - 1;
    while ( ___(1)___ ){
        arr[j+1] = arr[j];
        j--;
    }
    ___(2)___ ;
}`)}`,
      fields: [{ label: "(1):", ans: ["j>=0&&arr[j]>temp", "j>-1&&arr[j]>temp", "j>=0&&temp<arr[j]", "j>-1&&temp<arr[j]", "(j>=0)&&(arr[j]>temp)", "(j>-1)&&(arr[j]>temp)", "(j>=0)&&(temp<arr[j])", "(j>=0&&arr[j]>temp)"], text: true, nospace: true }, { label: "(2):", ans: ["arr[j+1]=temp"], text: true, nospace: true }],
      hint: R`Πρώτα ο έλεγχος ορίων, μετά η σύγκριση.`, sol: R`(1) <code>j&gt;=0 &amp;&amp; arr[j]&gt;temp</code> (πρώτα το <code>j&gt;=0</code>, για να μη γίνει πρόσβαση στο <code>arr[-1]</code>). (2) <code>arr[j+1] = temp</code>.` },
    { shuffle: true, level: 3, type: "mc", q: R`Αν η συνθήκη γραφτεί <code>while (arr[j]&gt;temp &amp;&amp; j&gt;=0)</code>, τι πρόβλημα μπορεί να προκύψει;`,
      options: [R`Όταν j = -1 θα αποτιμηθεί το arr[-1], δηλαδή πρόσβαση εκτός ορίων του πίνακα`, R`Κανένα, οι δύο μορφές είναι ισοδύναμες`, R`Ο πίνακας θα ταξινομηθεί σε φθίνουσα σειρά`, R`Ο βρόχος for δεν θα τερματίσει ποτέ`], correct: 0,
      hint: R`Σκέψου πώς αποτιμά ο τελεστής && τις συνθήκες του.`, sol: R`Ο <code>&amp;&amp;</code> αποτιμά πρώτα την αριστερή συνθήκη. Όταν το στοιχείο πρέπει να πάει στην αρχή, το <code>j</code> γίνεται -1 και θα εκτελεστεί το <code>arr[-1] &gt; temp</code> πριν ελεγχθεί το <code>j&gt;=0</code>: πρόσβαση εκτός ορίων (απρόβλεπτη συμπεριφορά).` }
  ]
},
/* ───────────────────────────── 8.3 ───────────────────────────── */
{
  id: "8.3", unit: 8, title: "Σύγκριση αλγορίθμων ταξινόμησης, πολυπλοκότητα και παράλληλοι πίνακες",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.6 §5 και §8 Ανάλυση χρονικής πολυπλοκότητας (σ. 191, 196–197) · Ασκήσεις 6.6–6.8, 6.12–6.18 · Δειγματικά δοκίμια",
  intro: "Bubble sort ή insertion sort; Πόσες συγκρίσεις κάνει ο καθένας, ποια είναι η πολυπλοκότητά τους και πώς ταξινομούμε παράλληλους πίνακες (ονόματα–βαθμοί) στις Παγκύπριες;",
  thumb: ICON("O(N²)", "red"),
  theory: R`
<p>Στις Παγκύπριες ζητείται να συγκρίνουμε την <b>ταχύτητα των αλγορίθμων ταξινόμησης</b> με βάση τη <b>χρονική πολυπλοκότητά</b> τους, να μετράμε «βήματα» (συγκρίσεις, αντιμεταθέσεις) και — στα θέματα προγραμματισμού — να ταξινομούμε <b>παράλληλους πίνακες</b> (π.χ. ονόματα καταστημάτων και κέρδη) με βάση ένα κριτήριο.</p>
<div class="tbox thm"><h4>Χρονική πολυπλοκότητα αλγορίθμων ταξινόμησης</h4>
<p>Ο <b>αλγόριθμος φυσαλίδας</b> έχει χρονική πολυπλοκότητα $O(N^2)$. Στην εκδοχή με τους <b>δύο βρόχους for</b>, ο εξωτερικός εκτελείται $N-1$ φορές και για την $i$-οστή επανάληψη ο εσωτερικός εκτελείται $N-i-1$ φορές, με μία σύγκριση κάθε φορά:</p>
<div class="fbox">$$(N-1) + (N-2) + \dots + 1 = \frac{N(N-1)}{2} \approx \frac{N^2}{2} \ \text{συγκρίσεις}$$</div>
<div class="tbox warn"><h4>Τι γράφουμε στις εξετάσεις</h4><p>Το βιβλίο δηλώνει ότι ο αλγόριθμος φυσαλίδας έχει πολυπλοκότητα <b>$O(N^2)$ σε όλες τις περιπτώσεις (καλύτερη και χειρότερη)</b> — έτσι απαντούμε στις Παγκύπριες. Παρατήρηση: η εκδοχή με τη μεταβλητή <code>sorted</code> σε ήδη ταξινομημένο πίνακα σταματά μετά από μία διάσχιση ($N-1$ συγκρίσεις), όπως δείχνει και το παράδειγμα του βιβλίου με τα 13 βήματα· αυτό αφορά το πλήθος βημάτων σε συγκεκριμένα δεδομένα, όχι την απάντηση για την πολυπλοκότητα.</p></div>
<p>Η <b>ταξινόμηση με εισαγωγή</b> έχει επίσης πολυπλοκότητα $O(N^2)$, αλλά είναι πιο γρήγορη:</p>
<ul><li><b>Καλύτερη περίπτωση</b> (πίνακας ήδη ταξινομημένος): το <code>while</code> δεν εκτελείται ποτέ, μία σύγκριση ανά επανάληψη του <code>for</code> → <b>$N-1$ συγκρίσεις</b>.</li>
<li><b>Χειρότερη περίπτωση</b> (πίνακας σε φθίνουσα σειρά, ταξινόμηση σε αύξουσα): κάθε στοιχείο πάει στην πρώτη θέση → περίπου <b>$N^2/2$ συγκρίσεις</b>.</li></ul></div>
<div class="tbox"><h4>Πίνακας σύγκρισης</h4>
<table class="tbl"><tr><th></th><th>Φυσαλίδα (δύο for)</th><th>Φυσαλίδα (με sorted)</th><th>Εισαγωγή</th></tr>
<tr><td>Πολυπλοκότητα (βιβλίο)</td><td>$O(N^2)$</td><td>$O(N^2)$ σε όλες τις περιπτώσεις</td><td>$O(N^2)$</td></tr>
<tr><td>Συγκρίσεις, ήδη ταξινομημένος</td><td>$\frac{N(N-1)}{2}$</td><td>$N-1$ (μία διάσχιση)<br><span class="muted small">η πολυπλοκότητα παραμένει $O(N^2)$ κατά το βιβλίο</span></td><td>$N-1$</td></tr>
<tr><td>Συγκρίσεις, φθίνουσα σειρά</td><td>$\frac{N(N-1)}{2}$</td><td>$\approx N^2$ ($N$ διασχίσεις)<br><span class="muted small">με S--: $\frac{N(N-1)}{2}$</span></td><td>$\frac{N(N-1)}{2}$</td></tr>
<tr><td>Χρόνος για $N = 100\,000$ (βιβλίο)</td><td>18,0 s</td><td>17,8 s</td><td><b>7,6 s</b></td></tr></table>
<p class="small muted">Χρόνοι από τον Πίνακα 6.1 του βιβλίου (ενδεικτικοί, εξαρτώνται από τον υπολογιστή). Για $N = 1\,000\,000$: 386 s, 377 s και 83 s αντίστοιχα.</p>
${(() => { const N = [1, 5, 20, 50, 100], b2 = [0, 0.078, 1.423, 4.419, 18.015], bb = [0, 0.059, 1.302, 4.387, 17.794], ins = [0, 0.032, 0.312, 1.417, 7.632]; return GR.plot({ x: [0, 105], y: [-1, 20], h: 230, fns: [], xlab: "N (χιλ.)", ylab: "s", segs: [].concat(...[[b2, "red"], [bb, "amber"], [ins, "green"]].map(([v, c]) => v.slice(1).map((y, k) => ({ p: [N[k], v[k]], q: [N[k + 1], y], c, w: 2.6 })))), pts: [].concat(...[[b2, "red"], [bb, "amber"], [ins, "green"]].map(([v, c]) => v.map((y, k) => ({ x: N[k], y, c })))), labels: [{ x: 70, y: 16.5, t: "φυσαλίδα", c: "red" }, { x: 88, y: 5, t: "εισαγωγή", c: "green" }], caption: "Χρόνος (s) ως προς N (σε χιλιάδες στοιχεία) — δεδομένα Πίνακα 6.1 του βιβλίου" }); })()}
</div>
<div class="tbox rem"><h4>Τι μετράμε ως «βήμα»</h4>
<p>Στο βιβλίο, «βήμα» θεωρείται <b>κάθε εκτέλεση του εσωτερικού βρόχου</b>. Στην ερώτηση πρόσεξε τι ζητείται: <b>συγκρίσεις</b> στοιχείων, <b>αντιμεταθέσεις</b> (φυσαλίδα), <b>μετακινήσεις</b> <code>arr[j+1]=arr[j]</code> (εισαγωγή) ή <b>διασχίσεις</b> (επαναλήψεις του <code>do…while</code>). Π.χ. για <code>{2,1,3,4,5,6,7,8}</code>: η βελτιστοποιημένη φυσαλίδα χρειάζεται 13 βήματα (7 + 6), οι δύο for 28.</p></div>
<div class="tbox def"><h4>Ταξινόμηση παράλληλων πινάκων</h4>
<p><b>Παράλληλοι πίνακες</b> είναι πίνακες όπου τα στοιχεία στην <b>ίδια θέση</b> αφορούν την ίδια οντότητα (π.χ. <code>names[i]</code> και <code>totals[i]</code>). Όταν ταξινομούμε με βάση τον έναν, <b>κάθε αντιμετάθεση/μετακίνηση πρέπει να γίνεται και στους δύο πίνακες</b>, αλλιώς «χαλάει» η αντιστοιχία.</p>
${CPP(R`
void sortDesc(string names[], int totals[], int N){
    int temp, j;
    string tempN;
    for (int i=1; i<N; i++){
        temp = totals[i];
        tempN = names[i];
        j = i - 1;
        while (j>=0 && totals[j]<temp){     // φθίνουσα σειρά βάσει totals
            totals[j+1] = totals[j];
            names[j+1] = names[j];         // ίδια μετακίνηση και στα ονόματα
            j--;
        }
        totals[j+1] = temp;
        names[j+1] = tempN;
    }
}`, { title: "insertion sort σε παράλληλους πίνακες", hl: [10] })}
<p>Με δύο κριτήρια (π.χ. ηλικία αύξουσα και, σε ισοβαθμία, όνομα αλφαβητικά) η συνθήκη αντιμετάθεσης της φυσαλίδας γίνεται: <code>if (age[i]&gt;age[i+1] || (age[i]==age[i+1] &amp;&amp; name[i]&gt;name[i+1]))</code>.</p></div>
<div class="tbox ex"><h4>Παράδειγμα — οι 3 μεγαλύτεροι σε αύξουσα σειρά</h4>
<p>Διαβάζουμε 10 ακεραίους, ταξινομούμε σε αύξουσα σειρά και εμφανίζουμε τα τελευταία 3 στοιχεία <code>arr[7]</code>, <code>arr[8]</code>, <code>arr[9]</code>.</p>
<div class="figrow"><div>${OUT(`24 66 12 45 61 77 89 108 15 44`, "Είσοδος")}</div><div>${OUT(`77 89 108`)}</div></div></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4>
<p>✗ Αντιμετάθεση μόνο στον πίνακα-κλειδί σε παράλληλους πίνακες. ✗ Η <code>temp</code> για τα ονόματα δηλωμένη ως <code>int</code> (πρέπει <code>string</code>). ✗ «Η εισαγωγή έχει μικρότερη πολυπλοκότητα από τη φυσαλίδα»: <b>όχι</b> — και οι δύο είναι $O(N^2)$· η εισαγωγή είναι απλώς ταχύτερη στην πράξη.</p></div>
`,
  widget: "ib7race",
  gen: "ib7gcnt",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια είναι η χρονική πολυπλοκότητα του αλγορίθμου ταξινόμησης φυσαλίδας (bubble sort);`,
      options: ["$O(N^2)$", "$O(N)$", "$O(\\log_2 N)$", "$O(N^3)$"], correct: 0,
      hint: R`Δύο εμφωλευμένοι βρόχοι.`, sol: R`<b>$O(N^2)$</b>: περίπου $N^2/2$ συγκρίσεις (δύο εμφωλευμένοι βρόχοι).` },
    { level: 1, q: R`Πόσες συγκρίσεις στοιχείων κάνει η ταξινόμηση φυσαλίδας με <b>δύο βρόχους for</b> σε πίνακα 20 στοιχείων;`,
      fields: [{ label: "Συγκρίσεις:", ans: 190 }],
      hint: R`$\frac{N(N-1)}{2}$, ανεξάρτητα από τα δεδομένα.`, sol: R`$\frac{20 \cdot 19}{2} = 190$ — πάντα, αφού αυτή η εκδοχή δεν ελέγχει αν ο πίνακας ταξινομήθηκε.` },
    { level: 1, type: "mc", q: R`Η ταξινόμηση με εισαγωγή και η ταξινόμηση φυσαλίδας έχουν την ίδια χρονική πολυπλοκότητα, όμως στην πράξη η ταξινόμηση με εισαγωγή είναι γενικά ταχύτερη.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Πίνακας 6.1 του βιβλίου.`, sol: R`<b>ΣΩΣΤΟ.</b> Και οι δύο είναι $O(N^2)$, αλλά οι χρόνοι του βιβλίου (π.χ. 7,6 s έναντι 18 s για 100 000 στοιχεία) δείχνουν ότι η εισαγωγή είναι πολύ πιο αποδοτική.` },
    { level: 2, q: R`Πίνακας 6 στοιχείων σε <b>φθίνουσα</b> σειρά ταξινομείται σε αύξουσα με την <code>insertionSort</code>. Πόσες μετακινήσεις <code>arr[j+1]=arr[j]</code> γίνονται; Και πόσες συγκρίσεις κάνει η φυσαλίδα με δύο for στον ίδιο πίνακα;`,
      fields: [{ label: "Μετακινήσεις (εισαγωγή):", ans: 15 }, { label: "Συγκρίσεις (δύο for):", ans: 15 }],
      hint: R`Χειρότερη περίπτωση: κάθε στοιχείο πάει στην αρχή.`, sol: R`Εισαγωγή: $1 + 2 + 3 + 4 + 5 = 15$ μετακινήσεις. Δύο for: $\frac{6\cdot 5}{2} = 15$ συγκρίσεις.` },
    { level: 2, q: R`Ο πίνακας <code>{0, 1, 2, …, 9}</code> (10 στοιχεία) είναι ήδη ταξινομημένος. Πόσες διασχίσεις και πόσες συγκρίσεις κάνει η <code>bubblesort</code> του βιβλίου με τη μεταβλητή <code>sorted</code>;`,
      fields: [{ label: "Διασχίσεις:", ans: 1 }, { label: "Συγκρίσεις:", ans: 9 }],
      hint: R`Πότε γίνεται false η sorted;`, sol: R`Στην 1η διάσχιση δεν γίνεται καμία αντιμετάθεση, η <code>sorted</code> μένει <code>true</code> και ο βρόχος τερματίζει: <b>1</b> διάσχιση, <b>9</b> συγκρίσεις. <i>Προσοχή:</i> αυτό είναι το πλήθος βημάτων για τα συγκεκριμένα δεδομένα· για την <b>πολυπλοκότητα</b>, το βιβλίο δηλώνει $O(N^2)$ σε όλες τις περιπτώσεις και έτσι απαντούμε στις εξετάσεις.` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα; (Ταξινόμηση παράλληλων πινάκων σε φθίνουσα σειρά βάσει των βαθμών.)${CPP(R`
string names[5] = {"Anna", "Bob", "Chris", "Dora", "Eli"};
int totals[5] = {72, 95, 64, 95, 80};
int temp, j;
string tempN;
for (int i=1; i<5; i++){
    temp = totals[i];
    tempN = names[i];
    j = i - 1;
    while (j>=0 && totals[j]<temp){
        totals[j+1] = totals[j];
        names[j+1] = names[j];
        j--;
    }
    totals[j+1] = temp;
    names[j+1] = tempN;
}
for (int i=0; i<5; i++)
    cout << names[i] << " ";`)}`,
      fields: [{ label: "Έξοδος:", ans: "Bob Dora Eli Anna Chris", text: true, cs: true }],
      hint: R`Σε ισοβαθμία (95) η σύγκριση totals[j] < temp είναι ψευδής, οπότε δεν αλλάζει η σχετική σειρά.`, sol: R`Φθίνουσα σειρά βαθμών: 95, 95, 80, 72, 64. Το Dora (95) δεν προσπερνά το Bob (95), αφού <code>95 &lt; 95</code> είναι ψευδές. ${OUT(`Bob Dora Eli Anna Chris `)}` },
    { level: 2, type: "mc", q: R`Ταξινομούμε τον πίνακα <code>totals[]</code> και θέλουμε ο παράλληλος πίνακας <code>names[]</code> να συνεχίσει να αντιστοιχεί σωστά. Τι πρέπει να κάνουμε;`,
      options: [R`Κάθε αντιμετάθεση ή μετακίνηση στον totals να γίνεται και στον names, στις ίδιες θέσεις`, R`Να ταξινομήσουμε ξεχωριστά και τον names αλφαβητικά`, R`Τίποτα, η αντιστοιχία διατηρείται αυτόματα`, R`Να ταξινομήσουμε μόνο τον names`], correct: 0,
      hint: R`Η αντιστοιχία στηρίζεται στη θέση i.`, sol: R`Η αντιστοιχία στηρίζεται στο ότι τα <code>names[i]</code> και <code>totals[i]</code> αφορούν την ίδια οντότητα· άρα κάθε αλλαγή θέσης πρέπει να γίνεται <b>ταυτόχρονα και στους δύο πίνακες</b>.` },
    { level: 2, q: R`Το πρόγραμμα διαβάζει 10 ακεραίους, τους ταξινομεί σε αύξουσα σειρά και εμφανίζει τους 3 μεγαλύτερους σε αύξουσα σειρά. Τι θα εμφανίσει για είσοδο <code>24 66 12 45 61 77 89 108 15 44</code>;`,
      fields: [{ label: "Έξοδος:", ans: "77 89 108", text: true }],
      hint: R`Μετά την ταξινόμηση, οι 3 μεγαλύτεροι είναι στις θέσεις 7, 8, 9.`, sol: R`Ταξινομημένος: <code>12 15 24 44 45 61 66 77 89 108</code>· εμφανίζονται τα <code>arr[7]</code>, <code>arr[8]</code>, <code>arr[9]</code>. ${OUT(`77 89 108`)}` },
    { level: 3, type: "mc", q: R`Θέλουμε ταξινόμηση φυσαλίδας των παράλληλων πινάκων <code>age[]</code>, <code>name[]</code> σε <b>αύξουσα σειρά ηλικίας</b> και, για ίδια ηλικία, σε <b>αλφαβητική σειρά ονόματος</b>. Ποια συνθήκη αντιμετάθεσης είναι σωστή;`,
      options: [R`<code>if (age[i]&gt;age[i+1] || (age[i]==age[i+1] &amp;&amp; name[i]&gt;name[i+1]))</code>`, R`<code>if (age[i]&gt;age[i+1] &amp;&amp; name[i]&gt;name[i+1])</code>`, R`<code>if (age[i]&gt;age[i+1] || name[i]&gt;name[i+1])</code>`, R`<code>if (age[i]&lt;age[i+1] || (age[i]==age[i+1] &amp;&amp; name[i]&lt;name[i+1]))</code>`], correct: 0,
      hint: R`Το όνομα μετρά μόνο σε ισοβαθμία ηλικίας.`, sol: R`Αντιμεταθέτουμε αν η ηλικία είναι μεγαλύτερη <b>ή</b> αν οι ηλικίες είναι ίσες <b>και</b> το <code>name[i] &gt; name[i+1]</code>, δηλαδή το <code>name[i]</code> βρίσκεται αλφαβητικά <b>μετά</b> από το <code>name[i+1]</code> (άρα πρέπει να αλλάξουν θέση). Η επιλογή μόνο με <code>||</code> χωρίς τον έλεγχο ισότητας θα αντιμετέθετε π.χ. (20, "Zoe") και (30, "Adam") λανθασμένα.` },
    { level: 3, q: R`Για τον πίνακα <code>{4, 3, 2, 1}</code>, πόσες συγκρίσεις στοιχείων κάνει η <code>bubblesort</code> του βιβλίου <b>με sorted χωρίς S</b>, πόσες η <b>βελτιστοποιημένη με S--</b> και πόσες η <code>insertionSort</code>;`,
      fields: [{ label: "Φυσαλίδα (sorted):", ans: 12 }, { label: "Φυσαλίδα (S--):", ans: 6 }, { label: "Εισαγωγή:", ans: 6 }],
      hint: R`Η φυσαλίδα με sorted χρειάζεται 4 διασχίσεις (η τελευταία χωρίς αντιμεταθέσεις).`, sol: R`Φυσαλίδα με sorted: 4 διασχίσεις × 3 = <b>12</b>. Με S--: 3 + 2 + 1 + 0 = <b>6</b> (στην 4η διάσχιση S = 1, ο βρόχος for δεν εκτελείται). Εισαγωγή: 1 + 2 + 3 = <b>6</b> (κάθε στοιχείο πάει στην αρχή, η σύγκριση με το arr[-1] δεν γίνεται).` }
  ]
},
/* ───────────────────────────── 9.1 ───────────────────────────── */
{
  id: "9.1", unit: 9, title: "Δισδιάστατοι πίνακες (2D arrays) στη C++: δήλωση, αρχικές τιμές, εισαγωγή και εμφάνιση",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.7 §1, §3–5 (σ. 211–215) · Παραδείγματα 7.1, 7.2, 7.5, 7.7",
  intro: "Πώς αποθηκεύουμε έναν πίνακα με γραμμές και στήλες στη C++ — και πώς τον γεμίζουμε και τον εμφανίζουμε με δύο εμφωλευμένους βρόχους for;",
  thumb: ICON("[ ][ ]", "blue"),
  theory: R`
<p>Ο <b>δισδιάστατος πίνακας</b> (2D array) στη C++ αποθηκεύει στοιχεία <b>ίδιου τύπου</b> σε ένα ορθογώνιο πλέγμα κελιών με <b>γραμμές</b> (rows) και <b>στήλες</b> (columns). Κάθε στοιχείο χαρακτηρίζεται από <b>δύο δείκτες</b>: τον δείκτη γραμμής (στο πρώτο ζεύγος αγκυλών) και τον δείκτη στήλης (στο δεύτερο). Είναι η φυσική επιλογή όταν τα δεδομένα έχουν μορφή πίνακα: βαθμοί μαθητών ανά μάθημα, θερμοκρασίες ανά ημέρα και ώρα, ένα ταμπλό παιχνιδιού, ο πίνακας της προπαίδειας.</p>
<div class="tbox def"><h4>Δήλωση δισδιάστατου πίνακα</h4>
<p>Η δήλωση <code>int arr[5][3];</code> δεσμεύει μνήμη για $5 \times 3 = 15$ ακέραιους, σε <b>5 γραμμές</b> και <b>3 στήλες</b>. Η αρίθμηση και των δύο δεικτών <b>ξεκινά από το 0</b>: οι γραμμές είναι $0..4$ και οι στήλες $0..2$.</p>
${ib9Idx(5, 3, (i, j) => i === 1 && j === 2 ? "hb" : "", "Το στοιχείο arr[1][2] βρίσκεται στη 2η γραμμή και στην 3η στήλη.")}
<p>Σε πίνακα <code>arr</code> διαστάσεων $N \times M$: πάνω αριστερά είναι το <code>arr[0][0]</code>, πάνω δεξιά το <code>arr[0][M-1]</code>, κάτω αριστερά το <code>arr[N-1][0]</code> και κάτω δεξιά το <code>arr[N-1][M-1]</code>. Οι διαστάσεις δηλώνονται ως <b>σταθερές</b>: <code>const int ROWS = 3;</code> και <code>const int COLS = 4;</code> — το μέγεθος ενός πίνακα πρέπει να είναι πάντα σταθερά, όχι μεταβλητή που διαβάζεται. (Το βιβλίο γράφει <code>#define ROWS 3</code> — ισοδύναμο.)</p></div>
<div class="tbox def"><h4>Απόδοση αρχικών τιμών σε δισδιάστατο πίνακα</h4>
<p>Κάθε γραμμή περικλείεται από δικά της άγκιστρα. Όσα στοιχεία δεν πάρουν τιμή γίνονται <b>0</b>:</p>
${CPP(`
int arr[3][3] = { {1,2,3},{4,5,6},{7,8,9} };
int big[4][4] = { {1,2,3},{4,5,6},{7,8,9} };   // τα υπόλοιπα = 0`, { nonum: true })}
<div class="figrow">${ib9Mat([[1, 2, 3], [4, 5, 6], [7, 8, 9]], { cap: "arr[3][3]" })}${ib9Mat([[1, 2, 3, 0], [4, 5, 6, 0], [7, 8, 9, 0], [0, 0, 0, 0]], { cls: (i, j) => i === 3 || j === 3 ? "ha" : "", cap: "big[4][4]: τα πορτοκαλί κελιά πήραν 0" })}</div></div>
<div class="tbox thm"><h4>Εισαγωγή και εμφάνιση με εμφωλευμένους βρόχους for</h4>
<p>Ο <b>εξωτερικός βρόχος</b> διατρέχει τις γραμμές (<code>i</code>) και ο <b>εσωτερικός</b> τις στήλες (<code>j</code>). Έτσι τα στοιχεία διαβάζονται «γραμμή προς γραμμή». Στην εμφάνιση, μετά από κάθε εσωτερικό βρόχο αλλάζουμε γραμμή με <code>endl</code>, ενώ η <code>setw(n)</code> (βιβλιοθήκη <code>iomanip</code>) δίνει δεξιά στοίχιση σε $n$ χαρακτήρες.</p>
${CPP(`
#include <iostream>
#include <iomanip>        // Για τη χρήση της setw
using namespace std;
const int ROWS = 3;
const int COLS = 4;
void fill_array(int arr[][COLS]){        // μόνο το πλήθος των στηλών
    for (int i=0; i<ROWS; i++)
        for (int j=0; j<COLS; j++)
            cin >> arr[i][j];
}
void print_array(int arr[][COLS]){
    for (int i=0; i<ROWS; i++){
        for (int j=0; j<COLS; j++)
            cout << setw(8) << arr[i][j];  // δεξιά στοίχιση 8 χαρακτήρων
        cout << endl;                      // αλλαγή γραμμής
    }
}
int main(){
    int my_array[ROWS][COLS];
    fill_array(my_array);
    print_array(my_array);
    return 0;
}`, { title: "Παράδειγμα 7.2 — fill_array / print_array", hl: [9, 10, 11, 14, 15, 16, 17] })}
<p>Ένας δισδιάστατος πίνακας περνά σε συνάρτηση <b>πάντα ως παράμετρος αναφοράς</b>, χωρίς τον τελεστή <code>&amp;</code>. Στην επικεφαλίδα απαιτείται <b>υποχρεωτικά η διάσταση των στηλών</b> (σταθερά): <code>int arr[][COLS]</code>· επιτρέπεται να δοθούν και οι δύο διαστάσεις.</p></div>
<div class="tbox ex"><h4>Πίνακας προπαίδειας (Παράδειγμα 7.5)</h4>
<p>Η εντολή <code>arr[i][j] = (i+1)*(j+1);</code> μέσα σε δύο βρόχους $0..9$ γεμίζει τον πίνακα της προπαίδειας: το κελί <code>arr[2][4]</code> παίρνει $3 \cdot 5 = 15$.</p>
<details class="steps"><summary>Λύση βήμα-βήμα: ανάστροφος πίνακας (Παράδειγμα 7.7)</summary>
<p>Ο ανάστροφος $A^T$ προκύπτει αν οι γραμμές γίνουν στήλες. Αρκεί, καθώς διαβάζουμε το <code>A[i][j]</code>, να το τοποθετούμε στο <code>AT[j][i]</code>:</p>
${CPP(`
cin >> N >> M;
for (int i=0; i<N; i++)
    for (int j=0; j<M; j++){
        cin >> A[i][j];
        AT[j][i] = A[i][j];
    }
for (int i=0; i<M; i++){          // ο AT έχει M γραμμές
    for (int j=0; j<N; j++)       // και N στήλες
        cout << setw(5) << AT[i][j];
    cout << endl;
}`, { nonum: true })}
<div class="figrow">${ib9Mat([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], { cls: (i, j) => i === 0 ? "hb" : "", cap: "A (3×4)" })}${ib9Mat([[1, 5, 9], [2, 6, 10], [3, 7, 11], [4, 8, 12]], { cls: (i, j) => j === 0 ? "hb" : "", cap: "AT (4×3): η 1η γραμμή έγινε 1η στήλη" })}</div>
</details></div>
<div class="tbox rem"><h4>Πίνακες εκτός main</h4><p>Αν ένας πίνακας δηλωθεί <b>εκτός</b> της <code>main</code> (καθολικός), όλα του τα στοιχεία παίρνουν αυτόματα τιμή 0. Αν δηλωθεί μέσα σε συνάρτηση χωρίς αρχικές τιμές, περιέχει «σκουπίδια» και πρέπει να τον αρχικοποιήσουμε εμείς.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Γράφουμε <code>arr[i,j]</code> αντί για <code>arr[i][j]</code> · χρησιμοποιούμε <code>i &lt;= ROWS</code> (εκτός ορίων!) · μπερδεύουμε γραμμές και στήλες στον ανάστροφο · ξεχνάμε το <code>endl</code> μετά τον εσωτερικό βρόχο · στην επικεφαλίδα γράφουμε <code>int arr[][]</code> χωρίς τη διάσταση των στηλών.</p></div>
`,
  widget: "ib9grid",
  gen: "ib9cell",
  exercises: [
    { level: 1, q: R`Πόσα στοιχεία (ακέραιους) αποθηκεύει ο πίνακας που δηλώνεται με <code>int arr[5][3];</code> και ποιος είναι ο μεγαλύτερος επιτρεπτός δείκτης γραμμής;`,
      fields: [{ label: "Πλήθος στοιχείων:", ans: 15 }, { label: "Μέγιστος δείκτης γραμμής:", ans: 4 }],
      hint: R`Γραμμές × στήλες. Οι δείκτες ξεκινούν από το 0.`, sol: R`$5 \times 3 = 15$ στοιχεία. Οι γραμμές αριθμούνται $0, 1, 2, 3, 4$, άρα ο μέγιστος δείκτης γραμμής είναι <b>4</b>.` },
    { level: 1, type: "mc", q: R`Σε δισδιάστατο πίνακα <code>arr</code> διαστάσεων $N \times M$, ποιο είναι το στοιχείο στην <b>κάτω δεξιά</b> γωνία;`,
      options: ["<code>arr[N-1][M-1]</code>", "<code>arr[N][M]</code>", "<code>arr[M-1][N-1]</code>", "<code>arr[N-1][0]</code>"], correct: 0,
      hint: R`Κάτω = μεγαλύτερος δείκτης γραμμής, δεξιά = μεγαλύτερος δείκτης στήλης· οι δείκτες ξεκινούν από το 0.`, sol: R`Η κάτω γραμμή έχει δείκτη $N-1$ και η δεξιά στήλη $M-1$: <code>arr[N-1][M-1]</code>. Το <code>arr[N][M]</code> είναι εκτός ορίων και το <code>arr[N-1][0]</code> είναι η κάτω αριστερή γωνία.` },
    { level: 1, q: R`Δίνεται η δήλωση${CPP(`int a[3][4] = { {1,2,3},{4,5,6},{7,8,9} };`, { nonum: true })}Να βρείτε τις τιμές των στοιχείων και της παράστασης.`,
      fields: [{ label: "a[1][3] =", ans: 0 }, { label: "a[2][1] =", ans: 8 }, { label: "a[0][2] + a[2][0] =", ans: 10 }],
      hint: R`Κάθε γραμμή έχει 4 στήλες· όσα κελιά δεν πήραν τιμή γίνονται 0.`, sol: R`${ib9Mat([[1, 2, 3, 0], [4, 5, 6, 0], [7, 8, 9, 0]], { cls: (i, j) => (i === 1 && j === 3) ? "ha" : (i === 2 && j === 1) ? "hb" : ((i === 0 && j === 2) || (i === 2 && j === 0)) ? "hg" : "" })}<br><code>a[1][3]</code> = <b>0</b> (δεν δόθηκε τιμή), <code>a[2][1]</code> = <b>8</b>, <code>a[0][2] + a[2][0]</code> = 3 + 7 = <b>10</b>.` },
    { level: 2, q: R`Ο πίνακας <code>matrix</code> έχει 4 γραμμές και 5 στήλες και περιέχει, γραμμή προς γραμμή, τους αριθμούς 10, 20, 30, …, 200:${ib9Mat([[10, 20, 30, 40, 50], [60, 70, 80, 90, 100], [110, 120, 130, 140, 150], [160, 170, 180, 190, 200]])}Ποιο είναι το στοιχείο <code>matrix[2][3]</code> και τι εμφανίζει η εντολή <code>cout &lt;&lt; matrix[3][2] / matrix[1][0];</code>;`,
      fields: [{ label: "matrix[2][3] =", ans: 140 }, { label: "Έξοδος:", ans: 3 }],
      hint: R`Γραμμή 2 = τρίτη γραμμή. Η διαίρεση ακεραίων στη C++ είναι ακέραια.`, sol: R`<code>matrix[2][3]</code> = <b>140</b> (3η γραμμή, 4η στήλη). <code>matrix[3][2] / matrix[1][0]</code> = 180 / 60 = <b>3</b>.` },
    { level: 2, q: R`Τι θα εμφανίσει το πιο κάτω τμήμα προγράμματος; (Γράψε τους αριθμούς χωρισμένους με κενό.)${CPP(`
int t[3][4];
int m = 16;
for (int i = 0; i < 3; i++)
    for (int j = 0; j < 4; j++){
        t[i][j] = (m + 2) % 3;
        m += 4;
    }
for (int j = 0; j < 4; j++)
    cout << t[1][j] << " ";`)}`,
      fields: [{ label: "Έξοδος:", ans: "1 2 0 1", text: true }],
      hint: R`Το m αυξάνεται κατά 4 σε κάθε κελί, γραμμή προς γραμμή: 16, 20, 24, …`, sol: R`Τα κελιά γεμίζουν με σειρά γραμμών και το m παίρνει 16, 20, 24, 28, 32, 36, 40, 44, … Άρα $(m+2) \% 3$ = 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2:
${ib9Mat([[0, 1, 2, 0], [1, 2, 0, 1], [2, 0, 1, 2]], { cls: i => i === 1 ? "hb" : "", cap: "Πίνακας t" })}${OUT(`1 2 0 1`)}` },
    { level: 2, q: R`Το πιο κάτω τμήμα γεμίζει τον πίνακα <code>matrix[4][5]</code> με τους αριθμούς 10, 20, 30, …, 200 (γραμμή προς γραμμή). Τι πρέπει να γραφτεί στο κενό;${CPP(`
int num = 10;
for (int i = 0; i < 4; i++)
    for (int j = 0; j < 5; j++){
        matrix[i][j] = num;
        num = ________ ;
    }`)}`,
      fields: [{ label: "num =", ans: ["num+10", "10+num"], text: true, nospace: true, ph: "έκφραση" }],
      hint: R`Μετά από κάθε κελί, ο επόμενος αριθμός είναι μεγαλύτερος κατά 10.`, sol: R`Το κενό είναι <code>num + 10</code>: κάθε κελί παίρνει την τρέχουσα τιμή και μετά η <code>num</code> αυξάνεται κατά 10.` },
    { level: 2, q: R`Ποια τιμή θα έχει η μεταβλητή <code>cnt</code> μετά την εκτέλεση;${CPP(`
int cnt = 0;
for (int i = 0; i < 4; i++)
    for (int j = i; j < 4; j++)
        cnt++;`)}`,
      fields: [{ label: "cnt =", ans: 10 }],
      hint: R`Για κάθε i ο εσωτερικός βρόχος εκτελείται 4 − i φορές.`, sol: R`i = 0: 4 φορές, i = 1: 3, i = 2: 2, i = 3: 1. Σύνολο $4+3+2+1 =$ <b>10</b> (τα κελιά πάνω από την κύρια διαγώνιο και πάνω σε αυτήν, σε πίνακα 4×4).` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα; (Γράψε τους αριθμούς σε μία γραμμή.)${CPP(`
int A[2][3] = { {1,2,3},{4,5,6} };
int AT[3][2];
for (int i=0; i<2; i++)
    for (int j=0; j<3; j++)
        AT[j][i] = A[i][j];
for (int i=0; i<3; i++)
    for (int j=0; j<2; j++)
        cout << AT[i][j] << " ";`)}`,
      fields: [{ label: "Έξοδος:", ans: "1 4 2 5 3 6", text: true }],
      hint: R`Ο AT είναι ο ανάστροφος του A (3 γραμμές, 2 στήλες).`, sol: R`${ib9Mat([[1, 4], [2, 5], [3, 6]], { cap: "AT = ανάστροφος του A" })}Εμφανίζεται γραμμή προς γραμμή: ${OUT(`1 4 2 5 3 6`)}` },
    { level: 3, type: "mc", q: R`Ποια επικεφαλίδα συνάρτησης δέχεται σωστά ως παράμετρο τον πίνακα <code>int my_array[ROWS][COLS];</code> (όπου <code>ROWS</code>, <code>COLS</code> σταθερές, π.χ. <code>const int COLS = 4;</code>);`,
      options: ["<code>void fill_array(int arr[][COLS])</code>", "<code>void fill_array(int arr[ROWS][])</code>", "<code>void fill_array(int arr[][])</code>", "<code>void fill_array(int &amp;arr[][COLS])</code>"], correct: 0,
      hint: R`Ποια διάσταση είναι υποχρεωτική; Χρειάζεται &amp;;`, sol: R`Απαιτείται η διάσταση των <b>στηλών</b>: <code>int arr[][COLS]</code>. Ο πίνακας περνά ήδη ως παράμετρος αναφοράς, οπότε δεν γράφουμε <code>&amp;</code>· οι μορφές <code>arr[ROWS][]</code> και <code>arr[][]</code> δεν μεταγλωττίζονται.` },
    { level: 3, q: R`Δίνεται ο πίνακας <code>A</code> και ο κώδικας που γεμίζει τον πίνακα <code>B</code>. Να γράψετε τη <b>δεύτερη γραμμή</b> (<code>B[1][0] B[1][1] B[1][2]</code>) του B.${ib9Mat([[1, 0, 0], [1, 1, 1], [0, 2, 0]], { cap: "Πίνακας A" })}${CPP(`
for (int i = 0; i < 3; i++)
    for (int j = 0; j < 3; j++)
        B[i][j] = A[A[j][i]][A[i][j]];`)}`,
      fields: [{ label: "Γραμμή 1 του B:", ans: "0 1 2", text: true }],
      hint: R`Για i = 1 υπολόγισε πρώτα τους «εσωτερικούς» δείκτες A[j][1] και A[1][j].`, sol: R`Για i = 1:<br>j = 0: <code>A[A[0][1]][A[1][0]]</code> = <code>A[0][1]</code> = 0<br>j = 1: <code>A[A[1][1]][A[1][1]]</code> = <code>A[1][1]</code> = 1<br>j = 2: <code>A[A[2][1]][A[1][2]]</code> = <code>A[2][1]</code> = 2.<br>Ολόκληρος ο B: ${ib9Mat([[1, 1, 1], [0, 1, 2], [1, 1, 1]], { cls: i => i === 1 ? "hb" : "" })}Απάντηση: <b>0 1 2</b>.` }
  ]
},
/* ───────────────────────────── 9.2 ───────────────────────────── */
{
  id: "9.2", unit: 9, title: "Κύρια και δευτερεύουσα διαγώνιος τετραγωνικού πίνακα σε C++",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.7 §2 (σ. 212–213) · Παράδειγμα 7.8 (Παγκύπριες 2016)",
  intro: "Ποια στοιχεία ενός τετραγωνικού πίνακα βρίσκονται πάνω στην κύρια ή στη δευτερεύουσα διαγώνιο — και ποια συνθήκη των δεικτών i, j τα ξεχωρίζει;",
  thumb: ICON("i==j", "green"),
  theory: R`
<p>Ένας πίνακας με ίσο αριθμό γραμμών και στηλών ($N \times N$) λέγεται <b>τετραγωνικός πίνακας</b>. Έχει δύο διαγωνίους: την <b>κύρια διαγώνιο</b> και τη <b>δευτερεύουσα διαγώνιο</b>. Στις Παγκύπριες ζητείται πολύ συχνά να υπολογίσουμε αθροίσματα ή πλήθη στοιχείων <b>πάνω</b>, <b>κάτω</b> ή <b>επάνω</b> σε μια διαγώνιο. Το κλειδί είναι μία απλή <b>συνθήκη στους δείκτες</b> <code>i</code> (γραμμή) και <code>j</code> (στήλη).</p>
<div class="tbox def"><h4>Κύρια διαγώνιος: i == j</h4>
<p>Η κύρια διαγώνιος ξεκινά από την πάνω αριστερή γωνία και καταλήγει στην κάτω δεξιά. Τα στοιχεία της έχουν <b>ίσους δείκτες</b>: <code>i == j</code>. Πάνω από αυτήν ισχύει <code>j &gt; i</code> (ή <code>i &lt; j</code>) και κάτω από αυτήν <code>i &gt; j</code>.</p>
<div class="figrow">${ib9Idx(5, 5, (i, j) => i === j ? "ha" : i < j ? "hl" : "", "Κίτρινο: i == j · γαλάζιο: πάνω (i < j)")}</div></div>
<div class="tbox def"><h4>Δευτερεύουσα διαγώνιος: i + j == N − 1</h4>
<p>Η δευτερεύουσα διαγώνιος ξεκινά από την πάνω δεξιά γωνία και καταλήγει στην κάτω αριστερή. Για τα στοιχεία της ισχύει <code>i == N-j-1</code>, δηλαδή ισοδύναμα <code>i + j == N - 1</code>. Πάνω από αυτήν: <code>i + j &lt; N - 1</code>· κάτω από αυτήν: <code>i + j &gt; N - 1</code>.</p>
${ib9Idx(5, 5, (i, j) => i + j === 4 ? "hg" : i + j > 4 ? "hl" : "", "Πράσινο: i + j == 4 (N = 5) · γαλάζιο: κάτω (i + j > N − 1)")}</div>
<div class="tbox"><h4>Συνοπτικός πίνακας συνθηκών</h4>
<table class="tbl"><tr><th>Περιοχή</th><th>Συνθήκη</th><th>Πλήθος στοιχείων (N×N)</th></tr>
<tr><td>Κύρια διαγώνιος</td><td><code>i == j</code></td><td>$N$</td></tr>
<tr><td>Πάνω από την κύρια</td><td><code>i &lt; j</code></td><td>$\frac{N(N-1)}{2}$</td></tr>
<tr><td>Κάτω από την κύρια</td><td><code>i &gt; j</code></td><td>$\frac{N(N-1)}{2}$</td></tr>
<tr><td>Δευτερεύουσα διαγώνιος</td><td><code>i + j == N-1</code></td><td>$N$</td></tr>
<tr><td>Πάνω από τη δευτερεύουσα</td><td><code>i + j &lt; N-1</code></td><td>$\frac{N(N-1)}{2}$</td></tr>
<tr><td>Κάτω από τη δευτερεύουσα</td><td><code>i + j &gt; N-1</code></td><td>$\frac{N(N-1)}{2}$</td></tr></table>
<p>Όταν το $N$ είναι <b>περιττό</b>, το κεντρικό στοιχείο <code>a[N/2][N/2]</code> ανήκει <b>και στις δύο</b> διαγωνίους.</p></div>
<div class="tbox thm"><h4>Αθροίσματα διαγωνίων με έναν βρόχο</h4>
<p>Αφού στην κύρια διαγώνιο $j = i$ και στη δευτερεύουσα $j = N-1-i$, αρκεί <b>ένας</b> βρόχος:</p>
${CPP(`
int s1 = 0, s2 = 0;
for (int i = 0; i < N; i++){
    s1 += a[i][i];          // κύρια διαγώνιος
    s2 += a[i][N-1-i];      // δευτερεύουσα διαγώνιος
}`, { nonum: true })}
<p>Με δύο εμφωλευμένους βρόχους και <code>if</code> λύνουμε το γενικό πρόβλημα (π.χ. άθροισμα των στοιχείων κάτω από την κύρια διαγώνιο: <code>if (i &gt; j) s += a[i][j];</code>).</p></div>
<div class="tbox ex"><h4>Το κωδικοποιημένο μήνυμα (Παγκύπριες 2016)</h4>
<p>Ένας πίνακας <code>code[10][10]</code> περιέχει τους χαρακτήρες A και B. «Κίνδυνος» υπάρχει αν η κύρια διαγώνιος έχει ακριβώς 5 χαρακτήρες A <b>και</b> τα B πάνω από την κύρια διαγώνιο είναι περισσότερα από τα A κάτω από αυτήν.</p>
<details class="steps"><summary>Λύση βήμα-βήμα</summary>
${CPP(`
char code[10][10];
int sum_on = 0, sum_over = 0, sum_below = 0;
for (int i=0; i<10; i++)
    for (int j=0; j<10; j++){
        cin >> code[i][j];
        if (code[i][j] == 'A'){
            if (i == j)
                sum_on++;          // A στην κύρια διαγώνιο
            else
                if (i > j)
                    sum_below++;   // A κάτω από τη διαγώνιο
        }
        else
            if (i < j)
                sum_over++;        // B πάνω από τη διαγώνιο
    }
if (sum_over > sum_below && sum_on == 5)
    cout << "Danger";
else
    cout << "No Danger";`)}
<p>Παρατήρησε ότι η καταμέτρηση γίνεται <b>την ώρα που διαβάζονται</b> τα στοιχεία, χωρίς δεύτερο πέρασμα του πίνακα.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Γράφουμε <code>i + j == N</code> αντί για <code>i + j == N - 1</code> · στο άθροισμα και των δύο διαγωνίων μετράμε <b>δύο φορές</b> το κεντρικό στοιχείο (περιττό N) · χρησιμοποιούμε <code>=</code> αντί για <code>==</code> στη συνθήκη · θεωρούμε ότι «πάνω» σημαίνει <code>i &gt; j</code> (είναι το αντίθετο!).</p></div>
`,
  widget: "ib9diag",
  gen: "ib9dg",
  exercises: [
    { level: 1, type: "mc", q: R`Σε τετραγωνικό πίνακα 5×5, το στοιχείο <code>a[2][2]</code> ανήκει και στην κύρια και στη δευτερεύουσα διαγώνιο.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Έλεγξε τις δύο συνθήκες i == j και i + j == N − 1.`, sol: R`$i = j = 2$ ✓ και $i + j = 4 = N - 1$ ✓. Είναι το κεντρικό στοιχείο, που ανήκει και στις δύο διαγωνίους.` },
    { level: 1, type: "mc", q: R`Ποια συνθήκη ισχύει για τα στοιχεία <code>a[i][j]</code> της <b>δευτερεύουσας</b> διαγωνίου πίνακα $N \times N$;`,
      options: ["<code>i + j == N - 1</code>", "<code>i == j</code>", "<code>i + j == N</code>", "<code>j == N - i</code>"], correct: 0,
      hint: R`Το στοιχείο πάνω δεξιά είναι το a[0][N−1].`, sol: R`Για το <code>a[0][N-1]</code> ισχύει $0 + (N-1) = N-1$. Γενικά <code>i + j == N - 1</code> (ισοδύναμα <code>i == N-j-1</code>). Η <code>i == j</code> αφορά την κύρια διαγώνιο.` },
    { level: 1, type: "mc", q: R`Ποια συνθήκη επιλέγει τα στοιχεία που βρίσκονται <b>πάνω</b> από την κύρια διαγώνιο;`,
      options: ["<code>i &lt; j</code>", "<code>i &gt; j</code>", "<code>i + j &lt; N - 1</code>", "<code>i == j</code>"], correct: 0,
      hint: R`Πάρε για παράδειγμα το a[0][3].`, sol: R`Πάνω από την κύρια διαγώνιο ο δείκτης στήλης είναι μεγαλύτερος από τον δείκτη γραμμής: <code>j &gt; i</code>, δηλαδή <code>i &lt; j</code>. Η <code>i + j &lt; N - 1</code> αφορά τη δευτερεύουσα διαγώνιο.` },
    { level: 2, q: R`Πόσα στοιχεία ενός πίνακα 6×6 βρίσκονται <b>αυστηρά πάνω</b> από την κύρια διαγώνιο; Πόσα βρίσκονται πάνω <b>ή</b> στη δευτερεύουσα διαγώνιο (<code>i + j &lt;= N - 1</code>);`,
      fields: [{ label: "Πάνω από κύρια:", ans: 15 }, { label: "i + j ≤ N − 1:", ans: 21 }],
      hint: R`Σύνολο 36 στοιχεία, 6 στη διαγώνιο, τα υπόλοιπα μοιράζονται εξίσου.`, sol: R`$(36 - 6)/2 = 15$ πάνω από την κύρια διαγώνιο. Πάνω από τη δευτερεύουσα επίσης 15, συν τα 6 στοιχεία της: <b>21</b>.` },
    { level: 2, q: R`Δίνεται ο πίνακας <code>a</code>. Να υπολογίσετε το άθροισμα της κύριας και το άθροισμα της δευτερεύουσας διαγωνίου.${ib9Mat([[6, 4, 5], [1, 2, 3], [7, 8, 9]])}`,
      fields: [{ label: "Κύρια:", ans: 17 }, { label: "Δευτερεύουσα:", ans: 14 }],
      hint: R`Κύρια: a[0][0], a[1][1], a[2][2]. Δευτερεύουσα: a[0][2], a[1][1], a[2][0].`, sol: R`${ib9Mat([[6, 4, 5], [1, 2, 3], [7, 8, 9]], { cls: (i, j) => i === j && i + j === 2 ? "hp" : i === j ? "ha" : i + j === 2 ? "hg" : "" })}Κύρια: $6 + 2 + 9 = 17$. Δευτερεύουσα: $5 + 2 + 7 = 14$ (το 2 ανήκει και στις δύο).` },
    { level: 2, q: R`Τι θα εμφανίσει το τμήμα προγράμματος;${CPP(`
const int N = 4;
int a[N][N] = { {3,8,1,6}, {2,9,4,7}, {5,0,6,2}, {4,3,8,1} };
for (int i = 0; i < N; i++)
    cout << a[i][N-1-i] << " ";`)}`,
      fields: [{ label: "Έξοδος:", ans: "6 4 0 4", text: true }],
      hint: R`Για i = 0 εμφανίζεται το a[0][3].`, sol: R`Εμφανίζεται η δευτερεύουσα διαγώνιος από πάνω προς τα κάτω: a[0][3] = 6, a[1][2] = 4, a[2][1] = 0, a[3][0] = 4.${OUT(`6 4 0 4`)}` },
    { level: 2, q: R`Για τον ίδιο πίνακα, ποια τιμή εμφανίζεται;${ib9Mat([[3, 8, 1, 6], [2, 9, 4, 7], [5, 0, 6, 2], [4, 3, 8, 1]])}${CPP(`
int s = 0;
for (int i = 0; i < N; i++)
    for (int j = 0; j < N; j++)
        if (i > j)
            s += a[i][j];
cout << s;`)}`,
      fields: [{ label: "Έξοδος:", ans: 22 }],
      hint: R`i > j: στοιχεία κάτω από την κύρια διαγώνιο.`, sol: R`${ib9Mat([[3, 8, 1, 6], [2, 9, 4, 7], [5, 0, 6, 2], [4, 3, 8, 1]], { cls: (i, j) => i > j ? "hb" : i === j ? "ha" : "" })}$2 + 5 + 0 + 4 + 3 + 8 = 22$.` },
    { level: 3, q: R`Στο πρόγραμμα «κωδικοποιημένο μήνυμα» (βλ. θεωρία) ο πίνακας είναι 4×4 και η συνθήκη κινδύνου είναι <code>sum_over &gt; sum_below &amp;&amp; sum_on == 2</code>. Για τον πίνακα που ακολουθεί, να βρείτε τις τιμές των τριών μετρητών και το μήνυμα που εμφανίζεται (Danger ή No Danger).${ib9Mat([["A", "B", "B", "A"], ["A", "B", "B", "B"], ["B", "A", "A", "A"], ["A", "B", "A", "B"]], { name: "code" })}`,
      fields: [{ label: "sum_on =", ans: 2 }, { label: "sum_over =", ans: 4 }, { label: "sum_below =", ans: 4 }, { label: "Μήνυμα:", ans: "No Danger", text: true }],
      hint: R`sum_on: A με i == j · sum_over: B με i < j · sum_below: A με i > j.`, sol: R`${ib9Mat([["A", "B", "B", "A"], ["A", "B", "B", "B"], ["B", "A", "A", "A"], ["A", "B", "A", "B"]], { cls: (i, j) => i === j ? "ha" : i < j ? "hl" : "hg" })}Κύρια διαγώνιος: A, B, A, B → <b>sum_on = 2</b>. Πάνω (γαλάζια): B, B, A, B, B, A → <b>sum_over = 4</b>. Κάτω (πράσινα): A, B, A, A, B, A → <b>sum_below = 4</b>. Επειδή το 4 &gt; 4 είναι ψευδές, εμφανίζεται ${OUT(`No Danger`)}` },
    { level: 3, q: R`Να συμπληρώσετε τη συνθήκη ώστε να υπολογίζεται το άθροισμα των στοιχείων που βρίσκονται <b>κάτω</b> από τη <b>δευτερεύουσα</b> διαγώνιο πίνακα $N \times N$.${CPP(`
for (int i = 0; i < N; i++)
    for (int j = 0; j < N; j++)
        if ( ________ )
            s += a[i][j];`)}`,
      fields: [{ label: "Συνθήκη:", ans: ["i+j>N-1", "i+j>=N", "j+i>N-1", "j+i>=N", "N-1<i+j", "N<=i+j", "i>N-1-j", "j>N-1-i"], text: true, nospace: true, ph: "π.χ. i<j" }],
      hint: R`Η κάτω δεξιά γωνία a[N−1][N−1] έχει i + j = 2N − 2.`, sol: R`Κάτω από τη δευτερεύουσα διαγώνιο: <code>i + j &gt; N - 1</code> (ισοδύναμα <code>i + j &gt;= N</code>).` },
    { level: 3, q: R`Ο πίνακας <code>a[5][5]</code> γεμίζει με <code>a[i][j] = i*5 + j + 1;</code> (δηλαδή 1, 2, …, 25 γραμμή προς γραμμή). Ποιο είναι το άθροισμα των στοιχείων που ανήκουν σε <b>τουλάχιστον μία</b> από τις δύο διαγωνίους (συνθήκη <code>i == j || i + j == N - 1</code>);`,
      fields: [{ label: "Άθροισμα:", ans: 117 }],
      hint: R`Κύρια: 1, 7, 13, 19, 25. Δευτερεύουσα: 5, 9, 13, 17, 21. Το 13 μετρά μία φορά.`, sol: R`${ib9Mat([[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25]], { cls: (i, j) => i === j && i + j === 4 ? "hp" : i === j ? "ha" : i + j === 4 ? "hg" : "" })}Κύρια = 65, δευτερεύουσα = 65. Το κεντρικό 13 ικανοποιεί και τις δύο συνθήκες αλλά με <code>||</code> προστίθεται μία φορά: $65 + 65 - 13 = 117$.` }
  ]
},
/* ───────────────────────────── 9.3 ───────────────────────────── */
{
  id: "9.3", unit: 9, title: "Μέγιστο και ελάχιστο γραμμής ή στήλης, αθροίσματα γραμμών/στηλών και παράλληλοι πίνακες",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.7 §6–7 (σ. 215–220) · Παραδείγματα 7.3, 7.4 (Παγκύπριες 2010), 7.6",
  intro: "Πώς βρίσκουμε το μεγαλύτερο στοιχείο μιας στήλης ή το άθροισμα κάθε γραμμής ενός δισδιάστατου πίνακα — και πώς τον συνδυάζουμε με παράλληλους μονοδιάστατους πίνακες;",
  thumb: ICON("max", "amber"),
  theory: R`
<p>Οι πιο συχνές επεξεργασίες ενός δισδιάστατου πίνακα στις Παγκύπριες είναι: η <b>εύρεση μέγιστου ή ελάχιστου στοιχείου</b> μιας γραμμής ή στήλης, τα <b>αθροίσματα γραμμών και στηλών</b>, και ο συνδυασμός του 2D πίνακα με <b>παράλληλους μονοδιάστατους πίνακες</b> (π.χ. ονόματα μαθητών και βαθμοί τους). Όλα στηρίζονται σε μια ιδέα: για να «περπατήσουμε» μια <b>γραμμή</b> κρατάμε σταθερό το <code>i</code> και μεταβάλλουμε το <code>j</code>· για μια <b>στήλη</b> κρατάμε σταθερό το <code>j</code> και μεταβάλλουμε το <code>i</code>.</p>
<div class="figrow">${ib9Mat([[4, 9, 2, 7], [8, 1, 6, 3], [5, 7, 3, 0]], { cls: (i, j) => i === 1 ? "hb" : "", cap: "Γραμμή row = 1: arr[1][j], j = 0..COLS−1" })}${ib9Mat([[4, 9, 2, 7], [8, 1, 6, 3], [5, 7, 3, 0]], { cls: (i, j) => j === 2 ? "hg" : "", cap: "Στήλη col = 2: arr[i][2], i = 0..ROWS−1" })}</div>
<div class="tbox thm"><h4>Μέγιστο στοιχείο στήλης (Παράδειγμα 7.3)</h4>
<p>Η συνάρτηση <code>find_col_max</code> δέχεται τον πίνακα και τον αριθμό της στήλης και επιστρέφει το μέγιστο στοιχείο της. Σε πίνακα <b>θετικών</b> ακεραίων η <code>maxV</code> μπορεί να ξεκινήσει από 0· κάθε φορά που βρίσκουμε μεγαλύτερο στοιχείο, το κρατάμε.</p>
${CPP(`
int find_col_max(int arr[][COLS], int col){
    int maxV = 0;                    // για θετικούς ακεραίους
    for (int i=0; i<ROWS; i++){
        if (arr[i][col] > maxV)      // η στήλη δίνεται παραμετρικά
            maxV = arr[i][col];
    }
    return maxV;
}`, { hl: [3, 4, 5] })}
<p>Ασφαλέστερη αρχικοποίηση, που δουλεύει και με αρνητικούς: <code>int maxV = arr[0][col];</code> και βρόχος από <code>i = 1</code>. Για το <b>ελάχιστο μιας γραμμής</b> αλλάζουμε τον ρόλο των δεικτών: <code>minV = arr[row][0];</code> και <code>if (arr[row][j] &lt; minV) minV = arr[row][j];</code>.</p></div>
<div class="tbox ex"><h4>Αθροίσματα γραμμών και στηλών με ένα πέρασμα (Παράδειγμα 7.6)</h4>
${CPP(`
int sum_of_rows[4];          // καθολικοί → αρχικά 0
int sum_of_cols[6];
int main(){
    int numbers[4][6];
    for (int i=0; i<4; i++)
        for (int j=0; j<6; j++){
            cin >> numbers[i][j];
            sum_of_rows[i] += numbers[i][j];   // το ίδιο στοιχείο μετρά
            sum_of_cols[j] += numbers[i][j];   // στη γραμμή ΚΑΙ στη στήλη
        }
    ...`)}
${ib9Mat([[4, 9, 2, 7], [8, 1, 6, 3], [5, 7, 3, 0]], { rowx: [22, 18, 15], rowxh: "Σ γρ.", colx: [17, 17, 11, 10], colxh: "Σ στ." })}
<p>Οι πίνακες <code>sum_of_rows</code> και <code>sum_of_cols</code> είναι <b>παράλληλοι</b> με τις γραμμές και τις στήλες: το <code>sum_of_rows[i]</code> αφορά τη γραμμή <code>i</code>.</p></div>
<div class="tbox def"><h4>Παράλληλοι πίνακες</h4>
<p>Όταν τα δεδομένα είναι διαφορετικών τύπων (π.χ. χαρακτήρες απαντήσεων και ακέραιοι βαθμοί), χρησιμοποιούμε <b>παράλληλους πίνακες</b>: η <b>ίδια θέση</b> σε κάθε πίνακα αφορά το <b>ίδιο αντικείμενο</b>. Στο Παράδειγμα 7.4 (Παγκύπριες 2010) η γραμμή <code>i</code> του <code>Apantiseis[N][Q]</code> περιέχει τις απαντήσεις του μαθητή <code>i</code>, το <code>Vathmoi[i]</code> τον βαθμό του, και ο <code>Lyseis[Q]</code> είναι παράλληλος με τις <b>στήλες</b> (σωστή απάντηση κάθε ερώτησης).</p>
<details class="steps"><summary>Λύση βήμα-βήμα: βαθμολόγηση και η συνάρτηση erotisi</summary>
${CPP(`
for (int i=0; i<N; i++)
    for (int j=0; j<Q; j++){
        cin >> Apantiseis[i][j];
        if (Apantiseis[i][j] == Lyseis[j])
            Vathmoi[i] += 5;              // +5 για κάθε σωστή απάντηση
    }

int erotisi(char sol[], char ans[][Q], int quest){
    int correct = 0;
    for (int i=0; i<N; i++)               // διατρέχουμε τη ΣΤΗΛΗ quest
        if (sol[quest]==ans[i][quest])
            correct++;
    return correct;
}`, { nonum: true })}
<p>Ο χρήστης δίνει ερώτηση 1–20, γι’ αυτό η κλήση είναι <code>erotisi(Lyseis, Apantiseis, question-1)</code>.</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Αρχικοποίηση <code>maxV = 0</code> όταν τα στοιχεία μπορεί να είναι αρνητικά (ή <code>minV = 0</code> για το ελάχιστο θετικών!) · μηδενισμός του αθροίσματος <b>έξω</b> από τον εξωτερικό βρόχο, ενώ πρέπει να γίνεται για κάθε γραμμή · σύγχυση <code>arr[i][col]</code> με <code>arr[col][i]</code> · ξεχνάμε το <code>question-1</code> όταν ο χρήστης αριθμεί από το 1.</p></div>
`,
  widget: "ib9rc",
  gen: "ib9rcg",
  exercises: [
    { level: 1, type: "mc", q: R`Στη συνάρτηση <code>find_col_max</code> η αρχικοποίηση <code>maxV = 0</code> δίνει σωστό αποτέλεσμα ακόμη και όταν όλα τα στοιχεία της στήλης είναι αρνητικά.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ποιο στοιχείο θα ήταν μεγαλύτερο από 0;`, sol: R`Αν όλα είναι αρνητικά, κανένα δεν είναι μεγαλύτερο από 0 και η συνάρτηση επιστρέφει λανθασμένα 0. Σωστό: <code>maxV = arr[0][col]</code>.` },
    { level: 1, type: "mc", q: R`Ποια έκφραση, μέσα σε βρόχο <code>for (int i=0; i&lt;ROWS; i++)</code>, διατρέχει τα στοιχεία της <b>στήλης</b> <code>col</code>;`,
      options: ["<code>arr[i][col]</code>", "<code>arr[col][i]</code>", "<code>arr[i][i]</code>", "<code>arr[col][col]</code>"], correct: 0,
      hint: R`Σε μια στήλη αλλάζει η γραμμή, όχι η στήλη.`, sol: R`Η στήλη μένει σταθερή (ο δείκτης στήλης είναι <code>col</code>) και η γραμμή αλλάζει: <code>arr[i][col]</code>.` },
    { level: 2, q: R`Για τον πίνακα <code>M</code> να βρείτε τα αθροίσματα των τριών γραμμών.${ib9Mat([[4, 9, 2, 7], [8, 1, 6, 3], [5, 7, 3, 0]])}`,
      fields: [{ label: "Γραμμή 0:", ans: 22 }, { label: "Γραμμή 1:", ans: 18 }, { label: "Γραμμή 2:", ans: 15 }],
      hint: R`Πρόσθεσε τα 4 στοιχεία κάθε γραμμής.`, sol: R`$4+9+2+7 = 22$, $8+1+6+3 = 18$, $5+7+3+0 = 15$.` },
    { level: 2, q: R`Για τον ίδιο πίνακα <code>M</code> (3×4), ποια τιμή επιστρέφει η <code>find_col_max(M, 2)</code> και ποιο είναι το ελάχιστο στοιχείο της γραμμής 1;${ib9Mat([[4, 9, 2, 7], [8, 1, 6, 3], [5, 7, 3, 0]])}`,
      fields: [{ label: "find_col_max(M, 2) =", ans: 6 }, { label: "Ελάχιστο γραμμής 1:", ans: 1 }],
      hint: R`Η στήλη 2 είναι η τρίτη στήλη: 2, 6, 3.`, sol: R`Στήλη 2: {2, 6, 3} → μέγιστο <b>6</b>. Γραμμή 1: {8, 1, 6, 3} → ελάχιστο <b>1</b>.` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα; (Όλες οι τιμές σε μία γραμμή.)${CPP(`
int sum_of_rows[2];
int sum_of_cols[3];
int main(){
    int numbers[2][3] = { {4, 7, 1}, {3, 5, 9} };
    for (int i=0; i<2; i++)
        for (int j=0; j<3; j++){
            sum_of_rows[i] += numbers[i][j];
            sum_of_cols[j] += numbers[i][j];
        }
    for (int i=0; i<2; i++)
        cout << sum_of_rows[i] << " ";
    for (int j=0; j<3; j++)
        cout << sum_of_cols[j] << " ";
    return 0;
}`)}`,
      fields: [{ label: "Έξοδος:", ans: "12 17 7 12 10", text: true }],
      hint: R`Πρώτα τα 2 αθροίσματα γραμμών, μετά τα 3 αθροίσματα στηλών.`, sol: R`${ib9Mat([[4, 7, 1], [3, 5, 9]], { rowx: [12, 17], rowxh: "Σ γρ.", colx: [7, 12, 10], colxh: "Σ στ." })}Οι καθολικοί πίνακες ξεκινούν από 0. ${OUT(`12 17 7 12 10`)}` },
    { level: 2, q: R`Να συμπληρώσετε τη συνθήκη στη συνάρτηση που επιστρέφει το <b>ελάχιστο</b> στοιχείο της γραμμής <code>row</code>.${CPP(`
int find_row_min(int arr[][COLS], int row){
    int minV = arr[row][0];
    for (int j=1; j<COLS; j++)
        if ( ________ )
            minV = arr[row][j];
    return minV;
}`)}`,
      fields: [{ label: "Συνθήκη:", ans: ["arr[row][j]<minV", "minV>arr[row][j]"], text: true, nospace: true, ph: "π.χ. x>y" }],
      hint: R`Ενημερώνουμε όταν βρούμε μικρότερο στοιχείο στη γραμμή row.`, sol: R`<code>arr[row][j] &lt; minV</code>: η γραμμή μένει σταθερή (<code>row</code>) και αλλάζει η στήλη <code>j</code>.` },
    { level: 3, q: R`Πρόγραμμα διαβάζει πίνακα 5×5, εμφανίζει το άθροισμα κάθε γραμμής και στη συνέχεια το <b>μέγιστο άθροισμα</b> και τη <b>γραμμή</b> (δείκτη 0–4) όπου βρίσκεται. Για την είσοδο που ακολουθεί, τι εμφανίζει στη δεύτερη γραμμή εξόδου (<code>max: … line: …</code>);${ib9Mat([[1, 2, 3, 4, 5], [6, 7, 8, 9, 8], [7, 6, 5, 4, 3], [2, 1, 2, 3, 4], [5, 6, 7, 8, 7]], { idx: false })}`,
      fields: [{ label: "max:", ans: 38 }, { label: "line:", ans: 1 }],
      hint: R`Υπολόγισε τα 5 αθροίσματα γραμμών.`, sol: R`Αθροίσματα: 15, 38, 25, 12, 33.${OUT(`sums: 15 38 25 12 33
max: 38 line: 1`)}` },
    { level: 3, q: R`Διαγώνισμα 4 ερωτήσεων, 3 μαθητές, +5 μονάδες για κάθε σωστή απάντηση. Σωστές απαντήσεις <code>Lyseis = {'A','C','B','D'}</code> και απαντήσεις μαθητών (γραμμές του <code>Apantiseis[3][4]</code>):${ib9Mat([["A", "C", "D", "D"], ["B", "C", "B", "A"], ["A", "A", "B", "D"]])}Να βρείτε τα στοιχεία του παράλληλου πίνακα <code>Vathmoi</code> και την τιμή που επιστρέφει η <code>erotisi(Lyseis, Apantiseis, 2-1)</code>.`,
      fields: [{ label: "Vathmoi[0] =", ans: 15 }, { label: "Vathmoi[1] =", ans: 10 }, { label: "Vathmoi[2] =", ans: 15 }, { label: "erotisi(…, 1) =", ans: 2 }],
      hint: R`Σύγκρινε κάθε κελί Apantiseis[i][j] με το Lyseis[j]. Η ερώτηση 2 είναι η στήλη 1.`, sol: R`${ib9Mat([["A", "C", "D", "D"], ["B", "C", "B", "A"], ["A", "A", "B", "D"]], { cls: (i, j) => [["A", "C", "D", "D"], ["B", "C", "B", "A"], ["A", "A", "B", "D"]][i][j] === "ACBD"[j] ? "hg" : "hr", rowx: [15, 10, 15], rowxh: "Vathmoi" })}Πράσινα = σωστά. Βαθμοί 15, 10, 15. Στη στήλη 1 (σωστό 'C') απάντησαν σωστά οι μαθητές 0 και 1: <b>2</b>.` },
    { level: 3, q: R`Πρόγραμμα μετρά τις γραμμές του πίνακα <code>A[4][4]</code> που περιέχουν <b>μόνο θετικούς</b> αριθμούς. Τι εμφανίζει για τον πίνακα που ακολουθεί;${ib9Mat([[3, -1, 4, 2], [5, 6, 1, 8], [-2, -7, 0, 3], [9, 4, 2, 7]])}${CPP(`
int cnt = 0;
for (int i=0; i<4; i++){
    bool ok = true;
    for (int j=0; j<4; j++)
        if (A[i][j] <= 0)
            ok = false;
    if (ok)
        cnt++;
}
cout << cnt;`)}`,
      fields: [{ label: "Έξοδος:", ans: 2 }],
      hint: R`Το 0 δεν είναι θετικός.`, sol: R`Γραμμή 0: έχει −1 ✗ · γραμμή 1 ✓ · γραμμή 2: −2, −7, 0 ✗ · γραμμή 3 ✓. Εμφανίζει <b>2</b>. Η σημαία <code>ok</code> ξαναγίνεται <code>true</code> για <b>κάθε</b> γραμμή.` },
    { level: 2, type: "mc", q: R`Θέλουμε το άθροισμα <b>κάθε</b> γραμμής ξεχωριστά σε μια μεταβλητή <code>s</code>. Πού πρέπει να γραφτεί η εντολή <code>s = 0;</code>;`,
      options: ["Μέσα στον εξωτερικό βρόχο, πριν από τον εσωτερικό", "Πριν από τον εξωτερικό βρόχο", "Μέσα στον εσωτερικό βρόχο", "Μετά τον εξωτερικό βρόχο"], correct: 0,
      hint: R`Το άθροισμα πρέπει να ξεκινά από 0 για κάθε νέα γραμμή.`, sol: R`Η <code>s = 0;</code> μπαίνει <b>στην αρχή κάθε επανάληψης του εξωτερικού βρόχου</b> (για κάθε γραμμή i), πριν από τον εσωτερικό βρόχο που προσθέτει τα <code>arr[i][j]</code>. Αν γραφτεί πριν από τον εξωτερικό βρόχο, τα αθροίσματα «συσσωρεύονται»· αν γραφτεί μέσα στον εσωτερικό, μηδενίζεται συνεχώς.` }
  ]
},
/* ───────────────────────────── 10.1 ───────────────────────────── */
{
  id: "10.1", unit: 10, title: "Εγγραφές (struct) στη C++: ορισμός, δήλωση μεταβλητών και αναφορά στα μέλη",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.8 §1–5 (σ. 245–248)",
  intro: "Πώς ομαδοποιούμε δεδομένα διαφορετικών τύπων — κωδικό, περιγραφή, τιμή — σε μία μεταβλητή με τη δομή struct της C++;",
  thumb: ICON("struct", "purple"),
  theory: R`
<p>Οι πίνακες αποθηκεύουν πολλά στοιχεία <b>του ίδιου τύπου</b>. Συχνά όμως ένα «αντικείμενο» περιγράφεται από δεδομένα <b>διαφορετικών τύπων</b>: ένας μαθητής έχει αριθμό μητρώου (ακέραιο), όνομα (συμβολοσειρά) και μέσο όρο (πραγματικό). Για αυτό η C++ προσφέρει τις <b>εγγραφές</b> (structures, <code>struct</code>). Τα στοιχεία μιας εγγραφής λέγονται <b>μέλη</b> και, σε αντίθεση με τα στοιχεία ενός πίνακα, το καθένα έχει το <b>δικό του αναγνωριστικό</b> (όνομα). Τα μέλη μπορεί να είναι βασικών τύπων (<code>int</code>, <code>float</code>, <code>double</code>, <code>bool</code>, <code>char</code>), συμβολοσειρές (<code>string</code>), πίνακες ή ακόμη και άλλες εγγραφές.</p>
<div class="tbox def"><h4>Ορισμός εγγραφής</h4>
<p>(α) Ξεκινά με τη δεσμευμένη λέξη <code>struct</code> και το αναγνωριστικό της εγγραφής, (β) τα άγκιστρα οριοθετούν τα μέλη, (γ) το <b>ερωτηματικό</b> μετά το τελικό άγκιστρο ορίζει το τέλος της εγγραφής. Μέλη ίδιου τύπου μπορούν να δηλωθούν μαζί.</p>
<div class="figrow"><div>${CPP(`
struct product {        // δεσμευμένη λέξη struct
    int code, quantity; // δύο ακέραια μέλη
    string description; // συμβολοσειρά
    double price;       // πραγματικός
};                      // ; = τέλος εγγραφής`, { title: "Ορισμός εγγραφής product" })}</div><div>${ib9Card("apple", [["code", "101"], ["quantity", "50"], ["description", "\"ambrosia\""], ["price", "1.99"]], "product")}</div></div>
<p>Ο ορισμός <b>δεν</b> δεσμεύει μνήμη για δεδομένα· δημιουργεί έναν <b>νέο τύπο</b> (<code>product</code>), όπως το <code>int</code>.</p></div>
<div class="tbox def"><h4>Δήλωση μεταβλητών εγγραφής</h4>
${CPP(`
product apple;                     // (α) μία μεταβλητή
product apple, banana, orange;     // (β) πολλές μεταβλητές

struct product {                   // (γ) ορισμός και δήλωση μαζί
    int code, quantity;
    string description;
    double price;
} apple, banana, orange;`, { nonum: true })}</div>
<div class="tbox thm"><h4>Αναφορά στα μέλη: ο τελεστής τελεία (.)</h4>
<p>Γράφουμε <code>&lt;όνομα μεταβλητής&gt;.&lt;όνομα μέλους&gt;</code>. Κάθε μέλος χρησιμοποιείται ακριβώς όπως μια απλή μεταβλητή του τύπου του:</p>
${CPP(`
cin >> apple.code >> apple.quantity;   // ανάγνωση τιμών
cin >> apple.description >> apple.price;
orange.code = 103;                     // εκχώρηση τιμών
orange.description = "clementine";
orange.price = 1.60;
cout << apple.quantity * apple.price;  // σε παραστάσεις`, { nonum: true })}
<p>Ένα μέλος μπορεί να είναι <b>πίνακας</b>: με <code>double test[4];</code> μέσα στην εγγραφή <code>student</code>, γράφουμε <code>st1.test[2] = 16;</code>. Επίσης, μια εγγραφή μπορεί να <b>εκχωρηθεί ολόκληρη</b> σε άλλη ίδιου τύπου: <code>temp = a;</code> αντιγράφει όλα τα μέλη (αυτό χρησιμοποιείται στην ταξινόμηση εγγραφών).</p></div>
<div class="tbox ex"><h4>Μαθητής με βαθμούς τεσσάρων διαγωνισμάτων</h4>
${CPP(`
struct student {
    int student_number;
    string student_name;
    double test[4];          // μέλος: πίνακας 4 στοιχείων
};
int main(){
    student st1;
    st1.student_number = 1001;
    st1.student_name = "Jones";
    st1.test[0] = 13;
    st1.test[1] = 15;
    st1.test[2] = 16;
    st1.test[3] = 15;
    double s = 0;
    for (int i = 0; i < 4; i++)
        s += st1.test[i];
    cout << s / 4;           // μέσος όρος
    return 0;
}`)}
${OUT(`14.75`)}</div>
<div class="tbox rem"><h4>Απόδοση αρχικών τιμών εγγραφής — εκτός εξεταστέας ύλης</h4><p>Το βιβλίο δείχνει και αρχικοποίηση με άγκιστρα, π.χ. <code>apple = {101, 50, "ambrosia", 1.99};</code> (το πλήθος και η σειρά των τιμών πρέπει να ταιριάζουν με τα μέλη). Η «απόδοση αρχικών τιμών εγγραφής» είναι <b>εκτός ύλης</b> για τις Παγκύπριες 2025-26· στις ασκήσεις τα μέλη παίρνουν τιμές με εκχώρηση ή ανάγνωση.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Ξεχνάμε το <code>;</code> μετά το <code>}</code> του ορισμού · γράφουμε το όνομα του <b>τύπου</b> αντί της μεταβλητής (<code>cin &gt;&gt; company.code;</code>) · παραλείπουμε την τελεία (<code>soft2 code = 35;</code>) · ξεχνάμε <code>#include &lt;string&gt;</code> όταν ένα μέλος είναι <code>string</code>.</p></div>
`,
  widget: "ib9struct",
  gen: "ib9sm",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια δεσμευμένη λέξη της C++ χρησιμοποιείται για τον ορισμό μιας εγγραφής;`,
      options: ["<code>struct</code>", "<code>record</code>", "<code>class</code>", "<code>typedef</code>"], correct: 0,
      hint: R`Από τη λέξη structure.`, sol: R`Ο ορισμός εγγραφής ξεκινά με <code>struct</code>, π.χ. <code>struct product { … };</code>.` },
    { level: 1, type: "mc", q: R`Όλα τα μέλη μιας εγγραφής πρέπει να είναι του ίδιου τύπου δεδομένων.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ποια είναι η βασική διαφορά εγγραφής και πίνακα;`, sol: R`Λάθος: η εγγραφή ομαδοποιεί στοιχεία <b>διαφορετικών</b> τύπων (π.χ. <code>int</code>, <code>string</code>, <code>double</code>). Ο πίνακας είναι αυτός που έχει στοιχεία ίδιου τύπου.` },
    { level: 1, type: "mc", q: R`Η μεταβλητή <code>apple</code> είναι τύπου <code>product</code>, που έχει μέλος <code>price</code>. Ποια εντολή εκχωρεί την τιμή 2.5 στο μέλος αυτό;`,
      options: ["<code>apple.price = 2.5;</code>", "<code>product.price = 2.5;</code>", "<code>apple[price] = 2.5;</code>", "<code>price.apple = 2.5;</code>"], correct: 0,
      hint: R`μεταβλητή.μέλος`, sol: R`Η αναφορά γίνεται με <code>&lt;μεταβλητή&gt;.&lt;μέλος&gt;</code>: <code>apple.price = 2.5;</code>. Το <code>product</code> είναι ο <b>τύπος</b>, όχι μεταβλητή.` },
    { level: 1, type: "mc", q: R`Μετά το άγκιστρο που κλείνει τον ορισμό μιας εγγραφής πρέπει να υπάρχει ερωτηματικό (<code>;</code>).`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`(γ) του ορισμού.`, sol: R`Σωστό: <code>struct product { … };</code> — το ερωτηματικό ορίζει το τέλος της εγγραφής (ή ακολουθούν ονόματα μεταβλητών και μετά <code>;</code>).` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα;${CPP(`
struct product {
    int code, quantity;
    string description;
    double price;
};
int main(){
    product apple;
    apple.code = 101;
    apple.quantity = 50;
    apple.description = "ambrosia";
    apple.price = 2;
    cout << apple.quantity * apple.price;
    return 0;
}`)}`,
      fields: [{ label: "Έξοδος:", ans: 100 }],
      hint: R`Πολλαπλασιάζονται τα μέλη quantity και price.`, sol: R`$50 \cdot 2 = 100$.${OUT(`100`)}` },
    { level: 2, type: "mc", q: R`Στο πρόγραμμα που ακολουθεί, ποια εντολή είναι <b>λανθασμένη</b>;${CPP(`
struct company {
    int code;
    double budget;
    int employees;
};
int main(){
    company soft2;
    soft2.code = 35;
    cin >> company.code;
    soft2.employees = soft2.code + 1;
    return 0;
}`)}`,
      options: ["<code>cin &gt;&gt; company.code;</code>", "<code>soft2.code = 35;</code>", "<code>company soft2;</code>", "<code>soft2.employees = soft2.code + 1;</code>"], correct: 0,
      hint: R`Ποιο αναγνωριστικό είναι τύπος και ποιο μεταβλητή;`, sol: R`Το <code>company</code> είναι <b>τύπος</b> εγγραφής, όχι μεταβλητή· δεν έχει μέλη για να διαβαστούν. Σωστό θα ήταν π.χ. <code>cin &gt;&gt; soft2.code;</code>. Οι υπόλοιπες εντολές είναι σωστές.` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα;${CPP(`
struct student {
    int student_number;
    string student_name;
    double test[4];
};
int main(){
    student st1;
    st1.student_number = 1001;
    st1.student_name = "Jones";
    st1.test[0] = 13;
    st1.test[1] = 15;
    st1.test[2] = 16;
    st1.test[3] = 15;
    double s = 0;
    for (int i = 0; i < 4; i++)
        s += st1.test[i];
    cout << s / 4;
    return 0;
}`)}`,
      fields: [{ label: "Έξοδος:", ans: 14.75 }],
      hint: R`Μέσος όρος των τεσσάρων στοιχείων του μέλους-πίνακα test.`, sol: R`$(13 + 15 + 16 + 15)/4 = 59/4 = 14.75$.${OUT(`14.75`)}` },
    { level: 3, q: R`Τι θα εμφανίσει το πρόγραμμα;${CPP(`
struct point {
    int x, y;
};
int main(){
    point a, b, temp;
    a.x = 3;
    a.y = 8;
    b.x = 5;
    b.y = 1;
    temp = a;
    a = b;
    b = temp;
    b.y = b.y + a.x;
    cout << a.x << " " << a.y << " " << b.x << " " << b.y;
    return 0;
}`)}`,
      fields: [{ label: "Έξοδος:", ans: "5 1 3 13", text: true }],
      hint: R`Η εκχώρηση εγγραφής αντιγράφει όλα τα μέλη: οι a και b ανταλλάσσονται.`, sol: R`Μετά την αντιμετάθεση: a = (5, 1), b = (3, 8). Στη συνέχεια <code>b.y = 8 + 5 = 13</code>.<div class="ib9rec">${ib9Card("a", [["x", "5"], ["y", "1"]], "point")}${ib9Card("b", [["x", "3"], ["y", "13"]], "point", "on")}</div>${OUT(`5 1 3 13`)}` },
    { level: 3, type: "mc", q: R`Ποιος ορισμός αντιστοιχεί σε εγγραφή <code>product</code> με μέλη: κωδικός (ακέραιος), περιγραφή (συμβολοσειρά), τιμή (πραγματικός), διαθέσιμο (λογική μεταβλητή);`,
      options: [`<code>struct product { int code; string descr; double price; bool available; };</code>`, `<code>struct product { int code; string descr; double price; bool available; }</code>`, `<code>struct product ( int code; string descr; double price; bool available; );</code>`, `<code>product struct { int code; string descr; double price; bool available; };</code>`], correct: 0,
      hint: R`Έλεγξε τη λέξη struct, τα άγκιστρα και το τελικό ερωτηματικό.`, sol: R`Σωστός είναι ο ορισμός με <code>struct product { … };</code>: άγκιστρα (όχι παρενθέσεις), η λέξη <code>struct</code> πριν από το όνομα και ερωτηματικό στο τέλος. Ο λογικός τύπος είναι <code>bool</code>.` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα; (Θυμήσου ότι η <code>length()</code> επιστρέφει το μήκος της συμβολοσειράς.)${CPP(`
struct person {
    string name;
    int age;
};
int main(){
    person p;
    p.name = "Maria";
    p.age = 17;
    cout << p.name.length() + p.age << " " << p.name.substr(0, 3);
    return 0;
}`)}`,
      fields: [{ label: "Έξοδος:", ans: "22 Mar", text: true, cs: true }],
      hint: R`Ένα μέλος string έχει όλες τις συναρτήσεις της string.`, sol: R`<code>p.name.length()</code> = 5, συν 17 = 22· <code>p.name.substr(0, 3)</code> = "Mar".${OUT(`22 Mar`)}` }
  ]
},
/* ───────────────────────────── 10.2 ───────────────────────────── */
{
  id: "10.2", unit: 10, title: "Πίνακες εγγραφών και ένθετες εγγραφές στη C++",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.8 §6–7 (σ. 248–252) · Παραδείγματα 8.1–8.4",
  intro: "Πώς αποθηκεύουμε τα στοιχεία 20 μαθητών ή 200 προϊόντων — με έναν πίνακα εγγραφών αντί για πολλούς παράλληλους πίνακες;",
  thumb: ICON("s[i].x", "purple"),
  theory: R`
<p>Μία μεταβλητή εγγραφής κρατά τα στοιχεία <b>ενός</b> αντικειμένου. Για πολλά αντικείμενα ορίζουμε έναν <b>πίνακα εγγραφών</b>: κάθε θέση του πίνακα είναι μια ολόκληρη εγγραφή. Έτσι αντικαθιστούμε πολλούς <b>παράλληλους πίνακες</b> (κωδικοί, ονόματα, τιμές…) με <b>έναν</b>, και ο κώδικας γίνεται πιο σύντομος και καθαρός — ιδιαίτερα στην ταξινόμηση. Επιπλέον, μια εγγραφή μπορεί να περιέχει ως μέλος άλλη εγγραφή: πρόκειται για τις <b>ένθετες εγγραφές</b>.</p>
<div class="tbox def"><h4>Πίνακας εγγραφών</h4>
${CPP(`
struct product {
    int code, quantity;
    string description;
    double price;
} fruit[3];               // πίνακας 3 εγγραφών τύπου product
// ή, μετά τον ορισμό:  product fruit[3];`, { nonum: true })}
<p>Η αναφορά σε μέλος γίνεται με <b>δείκτη και τελεία</b>: <code>fruit[i].price</code> (η τιμή του προϊόντος στη θέση <code>i</code>). <b>Προσοχή:</b> ο δείκτης μπαίνει μετά το όνομα του πίνακα, όχι μετά το μέλος.</p>
<div class="ib9rec">${ib9Card("fruit[0]", [["code", "101"], ["quantity", "50"], ["description", "ambrosia"], ["price", "1.99"]])}${ib9Card("fruit[1]", [["code", "102"], ["quantity", "40"], ["description", "chiquita"], ["price", "2.70"]], "", "on")}${ib9Card("fruit[2]", [["code", "103"], ["quantity", "60"], ["description", "clementine"], ["price", "1.60"]])}</div>
<p>Η <code>fruit[1].description</code> είναι η συμβολοσειρά "chiquita".</p></div>
<div class="tbox ex"><h4>Καταχώριση με δομή επανάληψης (Παράδειγμα 8.1)</h4>
${CPP(`
#include <iostream>
#include <string>
using namespace std;
struct student {
    int am;
    string name;
    int tel;
    bool ekt;          // εκτοπισμένος: 1 (true) ή 0 (false)
};
int main(){
    student B3[20];    // πίνακας εγγραφών 20 θέσεων
    for (int i=0; i<20; i++)
        cin >> B3[i].am >> B3[i].name >> B3[i].tel >> B3[i].ekt;
    return 0;
}`, { hl: [11, 12, 13] })}</div>
<div class="tbox def"><h4>Ένθετες εγγραφές</h4>
<p>Μια εγγραφή μπορεί να είναι <b>μέλος άλλης εγγραφής</b>. Η ένθετη εγγραφή πρέπει να έχει <b>οριστεί πρώτα</b>. Η πρόσβαση γίνεται ιεραρχικά, με <b>επιπρόσθετη τελεία</b>, και δεν υπάρχει όριο στο βάθος ένθεσης.</p>
<div class="figrow"><div>${CPP(`
struct date {          // πρώτα η ένθετη εγγραφή
    int dd;
    int mm;
    int yy;
};
struct member {
    int code;
    string email;
    date dob;          // μέλος τύπου date
} mem[50];`, { nonum: true })}</div><div>${ib9Card("mem[i]", [["code", "11"], ["email", "nikos@mail.com"], ["dob", [["dd", "5"], ["mm", "9"], ["yy", "2005"]], "date"]], "member")}</div></div>
<p>Η ημέρα γέννησης του μέλους στη θέση <code>i</code> είναι <code>mem[i].dob.dd</code>.</p>
<details class="steps"><summary>Λύση βήμα-βήμα: email όσων γεννήθηκαν στις 5/9/2005 (Παράδειγμα 8.4)</summary>
${CPP(`
for (int i=0; i<50; i++){
    cin >> mem[i].code >> mem[i].email;
    cin >> mem[i].dob.dd >> mem[i].dob.mm >> mem[i].dob.yy;
}
for (int i=0; i<50; i++)
    if (mem[i].dob.dd==5 && mem[i].dob.mm==9 && mem[i].dob.yy==2005)
        cout << mem[i].email << endl;`, { nonum: true })}
<p>Πρώτα καταχωρίζονται όλα τα δεδομένα και μετά γίνεται ένα δεύτερο πέρασμα με τη σύνθετη συνθήκη (τρία <code>&amp;&amp;</code>).</p></details></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p><code>B3.am[i]</code> αντί για <code>B3[i].am</code> · ορισμός της ένθετης εγγραφής <b>μετά</b> την εγγραφή που την περιέχει · <code>mem[i].dd</code> αντί για <code>mem[i].dob.dd</code> · σύγκριση συμβολοσειράς με μονά εισαγωγικά (<code>'Nicosia'</code>) αντί για διπλά.</p></div>
`,
  widget: "ib9rec",
  gen: "ib9rq",
  exercises: [
    { level: 1, type: "mc", q: R`Με τις εγγραφές <code>date</code> και <code>member</code> της θεωρίας, ποια έκφραση δίνει τον <b>μήνα</b> γέννησης του <b>τρίτου</b> μέλους του πίνακα <code>mem</code>;`,
      options: ["<code>mem[2].dob.mm</code>", "<code>mem[3].dob.mm</code>", "<code>mem.dob[2].mm</code>", "<code>mem[2].mm</code>"], correct: 0,
      hint: R`Οι δείκτες ξεκινούν από το 0· ο μήνας είναι μέλος της ένθετης dob.`, sol: R`<code>mem[2]</code> = το μέλος με δείκτη 2, <code>.dob</code> = η ένθετη εγγραφή, <code>.mm</code> = ο μήνας: <code>mem[2].dob.mm</code>.` },
    { level: 1, type: "mc", q: R`Η ένθετη εγγραφή (π.χ. <code>date</code>) πρέπει να έχει οριστεί πριν από την εγγραφή που τη χρησιμοποιεί ως μέλος (π.χ. <code>member</code>).`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Μπορεί ο μεταγλωττιστής να χρησιμοποιήσει έναν τύπο που δεν γνωρίζει ακόμη;`, sol: R`Σωστό: ο τύπος <code>date</code> πρέπει να είναι ήδη γνωστός όταν δηλώνεται το μέλος <code>date dob;</code>.` },
    { level: 1, type: "mc", q: R`Ποια εντολή διαβάζει σωστά τον αριθμό μητρώου του μαθητή <code>i</code> στον πίνακα εγγραφών <code>student B3[20]</code>;`,
      options: ["<code>cin &gt;&gt; B3[i].am;</code>", "<code>cin &gt;&gt; B3.am[i];</code>", "<code>cin &gt;&gt; student[i].am;</code>", "<code>cin &gt;&gt; B3[i]am;</code>"], correct: 0,
      hint: R`πίνακας[δείκτης].μέλος`, sol: R`Ο δείκτης ακολουθεί το όνομα του πίνακα και μετά η τελεία με το μέλος: <code>B3[i].am</code>.` },
    { level: 2, q: R`Στον πίνακα εγγραφών <code>shop[5]</code> (μέλη <code>code</code>, <code>name</code>, <code>price</code>, <code>qty</code>) καταχωρίστηκαν τα δεδομένα:${ib9Mat([[101, "milk", "1.20", 40], [102, "bread", "0.90", 25], [103, "coffee", "12.50", 8], [104, "honey", "15.00", 6], [105, "rice", "2.40", 30]], { idx: false, cap: "code · name · price · qty" })}Τι θα εμφανίσει το τμήμα;${CPP(`
int cnt = 0;
for (int i=0; i<5; i++)
    if (shop[i].price > 10)
        cnt++;
cout << cnt;`)}`,
      fields: [{ label: "Έξοδος:", ans: 2 }],
      hint: R`Μέτρα τα προϊόντα με τιμή πάνω από 10.`, sol: R`coffee (12.50) και honey (15.00): <b>2</b>.` },
    { level: 2, q: R`Με τα ίδια δεδομένα του <code>shop</code>, τι εμφανίζει το τμήμα;${ib9Mat([[101, "milk", "1.20", 40], [102, "bread", "0.90", 25], [103, "coffee", "12.50", 8], [104, "honey", "15.00", 6], [105, "rice", "2.40", 30]], { idx: false, cap: "code · name · price · qty" })}${CPP(`
for (int i=0; i<5; i++)
    if (shop[i].qty < 10)
        cout << shop[i].name << " ";`)}`,
      fields: [{ label: "Έξοδος:", ans: "coffee honey", text: true }],
      hint: R`Ελέγχεται το μέλος qty, εμφανίζεται το name.`, sol: R`qty &lt; 10: coffee (8), honey (6).${OUT(`coffee honey`)}` },
    { level: 2, q: R`Με τα ίδια δεδομένα, ποια είναι η συνολική αξία του αποθέματος, δηλαδή το άθροισμα <code>shop[i].price * shop[i].qty</code>;${ib9Mat([[101, "milk", "1.20", 40], [102, "bread", "0.90", 25], [103, "coffee", "12.50", 8], [104, "honey", "15.00", 6], [105, "rice", "2.40", 30]], { idx: false, cap: "code · name · price · qty" })}`,
      fields: [{ label: "Συνολική αξία:", ans: 332.5, tol: 1e-6 }],
      hint: R`Υπολόγισε τιμή × ποσότητα για κάθε προϊόν.`, sol: R`$48 + 22.5 + 100 + 90 + 72 = 332.5$.` },
    { level: 3, q: R`Το πρόγραμμα του Παραδείγματος 8.4 (θεωρία) εκτελείται για 4 μέλη με την πιο κάτω είσοδο (κωδικός, email, ημέρα, μήνας, έτος). Τι εμφανίζει; (Γράψε τα email σε μία γραμμή, χωρισμένα με κενό.)${OUT(`11 nikos@mail.com 5 9 2005
12 eleni@mail.com 9 5 2005
13 maria@mail.com 5 9 2006
14 petros@mail.com 5 9 2005`, "Είσοδος")}`,
      fields: [{ label: "Έξοδος:", ans: "nikos@mail.com petros@mail.com", text: true }],
      hint: R`Πρέπει να ισχύουν ταυτόχρονα dd == 5, mm == 9, yy == 2005.`, sol: R`Η eleni έχει 9/5 (ανάποδα ημέρα–μήνα) και η maria έτος 2006.${OUT(`nikos@mail.com
petros@mail.com`)}` },
    { level: 3, q: R`Πρόγραμμα (Παράδειγμα 8.2) διαβάζει τις διαστάσεις 3 ορθογωνίων στον πίνακα εγγραφών <code>rectangle[3]</code> (μέλη <code>height</code>, <code>width</code>) και εμφανίζει εμβαδόν (E) και περίμετρο (P). Για είσοδο <code>2 5</code>, <code>3.5 4</code>, <code>6 1.5</code>, τι εμφανίζεται για το <b>Rectangle 2</b>;${CPP(`
cout << "E: " << rectangle[i].height*rectangle[i].width << " ";
cout << "P: " << (rectangle[i].height+rectangle[i].width)*2;`)}`,
      fields: [{ label: "E:", ans: 14 }, { label: "P:", ans: 15 }],
      hint: R`Το Rectangle 2 είναι το rectangle[1] (εμφανίζεται i+1).`, sol: R`<code>rectangle[1]</code>: height = 3.5, width = 4 → E = 14, P = (3.5 + 4)·2 = 15.${OUT(`Rectangle 2
E: 14 P: 15`)}` },
    { level: 3, type: "mc", q: R`Ποιο είναι το κύριο πλεονέκτημα ενός πίνακα εγγραφών έναντι πολλών παράλληλων πινάκων;`,
      options: ["Τα δεδομένα κάθε αντικειμένου μένουν μαζί, οπότε π.χ. στην ταξινόμηση μετακινείται ολόκληρη η εγγραφή με μία εκχώρηση", "Καταλαμβάνει πάντα λιγότερη μνήμη", "Δεν χρειάζεται δομή επανάληψης για την καταχώριση", "Επιτρέπει μόνο αριθμητικά δεδομένα, άρα είναι ταχύτερος"], correct: 0,
      hint: R`Σκέψου τι γίνεται όταν ανταλλάσσουμε δύο αντικείμενα.`, sol: R`Με παράλληλους πίνακες, κάθε ανταλλαγή πρέπει να γίνει σε <b>όλους</b> τους πίνακες. Με πίνακα εγγραφών αρκεί <code>temp = A[j]; A[j] = A[j+1]; A[j+1] = temp;</code>. Το βιβλίο σημειώνει ότι έτσι «μειώνεται κατά πολύ η έκταση του κώδικα».` }
  ]
},
/* ───────────────────────────── 10.3 ───────────────────────────── */
{
  id: "10.3", unit: 10, title: "Εγγραφές και συναρτήσεις: αναζήτηση και ταξινόμηση εγγραφών σε C++",
  book: "Βιβλίο Γ΄ Λυκείου: Γ7.8 §8–9 (σ. 252–257) · Παραδείγματα 8.5–8.8",
  intro: "Πώς περνάμε μια εγγραφή σε συνάρτηση (με τιμή ή με αναφορά) και πώς κάνουμε αναζήτηση και ταξινόμηση σε πίνακα εγγραφών με βάση ένα πεδίο;",
  thumb: ICON("sort()", "purple"),
  theory: R`
<p>Οι εγγραφές συνεργάζονται φυσικά με τις <b>συναρτήσεις</b>: μια εγγραφή μπορεί να δοθεί ως <b>παράμετρος τιμής</b> (η συνάρτηση παίρνει αντίγραφο) ή ως <b>παράμετρος αναφοράς</b> (με <code>&amp;</code>, η συνάρτηση αλλάζει την πρωτότυπη). Επίσης, οι αλγόριθμοι <b>σειριακής αναζήτησης</b> και <b>ταξινόμησης</b> (φυσαλίδας, εισαγωγής) εφαρμόζονται αυτούσιοι σε πίνακα εγγραφών: συγκρίνουμε <b>ένα πεδίο</b> (το «κλειδί», π.χ. <code>code</code> ή <code>F</code>) αλλά μετακινούμε <b>ολόκληρη</b> την εγγραφή.</p>
<div class="tbox thm"><h4>Εγγραφή ως παράμετρος αναφοράς και τιμής (Παράδειγμα 8.5)</h4>
${CPP(`
struct book {
    string title;
    string author;
    string isbn;
    int quantity;
};
void readBook(book &bk) {          // αναφορά (&): γεμίζει την πρωτότυπη
    getline(cin, bk.title);        // όλη η γραμμή, π.χ. Edgar Allan Poe
    getline(cin, bk.author);
    getline(cin, bk.isbn);
    cin >> bk.quantity;
}
void printBook(book bk) {          // τιμή: αρκεί αντίγραφο για εμφάνιση
    cout << "Book title : " << bk.title << endl;
    cout << "Book quantity : " << bk.quantity << endl;
}`, { hl: [7, 13] })}
<p>Κανόνας: αν η συνάρτηση πρέπει να <b>τροποποιήσει</b> την εγγραφή (π.χ. να τη γεμίσει), τη δίνουμε <b>με αναφορά</b>. Αν μόνο τη <b>διαβάζει</b> (εμφάνιση, υπολογισμός), αρκεί η παράμετρος τιμής. Μια συνάρτηση μπορεί να <b>επιστρέφει</b> αποτέλεσμα από τα μέλη, π.χ. <code>double calculate(advertising ad){ return ad.total * ad.pct / 100 * ad.amount; }</code>.</p></div>
<div class="tbox ex"><h4>Σειριακή αναζήτηση σε πίνακα εγγραφών (Παράδειγμα 8.7)</h4>
${CPP(`
int find_school(school sch[], int key, int N){
    for (int i=0; i<N; i++)
        if (key == sch[i].code)      // σύγκριση με το πεδίο-κλειδί
            return i;                // θέση της εγγραφής
    return -1;                       // δεν βρέθηκε
}
...
int pos = find_school(sch, target, cnt);
if (pos == -1)
    cout << "School not found" << endl;
else
    cout << sch[pos].code << " " << sch[pos].name << endl;`)}
<p>Η συνάρτηση επιστρέφει τη <b>θέση</b> της <b>πρώτης</b> εγγραφής με το ζητούμενο κλειδί ή $-1$. Τα σχολεία διαβάζονται από το αρχείο <code>schools.txt</code> με <b>αρχική ανάγνωση</b> πριν από τον βρόχο και <code>while (!fin.eof())</code>· ο μετρητής <code>cnt</code> δίνει το πλήθος τους (διορθωμένη εκδοχή του βιβλίου: η αρχική ανάγνωση αποφεύγει την επιπλέον κενή εγγραφή όταν το αρχείο τελειώνει με Enter):</p>
${CPP(`
ifstream fin("schools.txt");
int cnt = 0;
fin >> sch[cnt].code;                 // αρχική ανάγνωση
while (!fin.eof()){
    fin >> sch[cnt].name >> sch[cnt].tel >> sch[cnt].city;
    cnt++;                            // επόμενη εγγραφή
    fin >> sch[cnt].code;             // ανάγνωση στο τέλος του βρόχου
}
fin.close();`, { nonum: true })}</div>
<div class="tbox thm"><h4>Ταξινόμηση εγγραφών με εισαγωγή (Παράδειγμα 8.8)</h4>
<p>Ο τελικός βαθμός είναι ο μέσος όρος δύο τετραμήνων στρογγυλοποιημένος: <code>A3[i].F = round((A3[i].t1 + A3[i].t2) / 2.0);</code> (βιβλιοθήκη <code>cmath</code>, το <code>2.0</code> αποφεύγει την ακέραια διαίρεση). Η ταξινόμηση σε <b>φθίνουσα</b> σειρά με βάση το <code>F</code>:</p>
${CPP(`
void sort_struct( ) {
    student temp;                    // μεταβλητή τύπου εγγραφής
    int j;
    for (int i=1; i<N; i++){
        temp = A3[i];                // κρατάμε ολόκληρη την εγγραφή
        j = i - 1;
        while (j>=0 && A3[j].F<temp.F){
            A3[j+1] = A3[j];         // μετακίνηση εγγραφής δεξιά
            j--;
        }
        A3[j+1] = temp;
    }
}`, { hl: [2, 5, 7, 8, 11] })}
<p>Για <b>αύξουσα</b> σειρά αλλάζουμε τη σύγκριση σε <code>A3[j].F &gt; temp.F</code>. Η ταξινόμηση με εισαγωγή είναι <b>ευσταθής</b>: εγγραφές με ίσο κλειδί κρατούν τη σχετική τους σειρά.</p></div>
<div class="tbox rem"><h4>Αν ο πίνακας είναι καθολικός</h4><p>Στο Παράδειγμα 8.8 ο πίνακας <code>A3[N]</code> δηλώνεται εκτός της <code>main</code>, γι’ αυτό η <code>sort_struct()</code> δεν έχει παραμέτρους. Εναλλακτικά: <code>void sort_struct(student A[], int n)</code> — ο πίνακας εγγραφών, όπως κάθε πίνακας, περνά πάντα «με αναφορά».</p></div>
<div class="tbox warn"><h4>Συχνά λάθη στις Παγκύπριες</h4><p>Δηλώνουμε <code>int temp;</code> αντί για <code>student temp;</code> · μετακινούμε μόνο το πεδίο-κλειδί (<code>A3[j+1].F = A3[j].F</code>) και «χαλάμε» τις εγγραφές · παράμετρος τιμής σε συνάρτηση που πρέπει να γεμίσει την εγγραφή · <code>(t1 + t2) / 2</code> με ακέραια διαίρεση πριν από τη <code>round</code>.</p></div>
`,
  widget: "ib9sort",
  gen: "ib9srt",
  exercises: [
    { level: 1, type: "mc", q: R`Μια εγγραφή μπορεί να δοθεί σε συνάρτηση τόσο ως παράμετρος τιμής όσο και ως παράμετρος αναφοράς.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Θυμήσου τις readBook και printBook.`, sol: R`Σωστό: <code>void readBook(book &amp;bk)</code> (αναφορά) και <code>void printBook(book bk)</code> (τιμή).` },
    { level: 1, type: "mc", q: R`Η συνάρτηση <code>readBook</code> διαβάζει από το πληκτρολόγιο τα μέλη μιας εγγραφής <code>book</code>, ώστε να χρησιμοποιηθούν στη <code>main</code>. Ποια επικεφαλίδα είναι κατάλληλη;`,
      options: ["<code>void readBook(book &amp;bk)</code>", "<code>void readBook(book bk)</code>", "<code>book readBook(&amp;bk)</code>", "<code>void readBook(struct bk)</code>"], correct: 0,
      hint: R`Η συνάρτηση πρέπει να αλλάξει την πρωτότυπη μεταβλητή.`, sol: R`Χρειάζεται <b>παράμετρος αναφοράς</b>: <code>book &amp;bk</code>. Με παράμετρο τιμής θα γέμιζε ένα αντίγραφο και η μεταβλητή της <code>main</code> θα έμενε ανέπαφη.` },
    { level: 2, q: R`Η συνάρτηση <code>calculate</code> (Παράδειγμα 8.6) επιστρέφει <code>ad.total * ad.pct / 100 * ad.amount</code> και το αποτέλεσμα εμφανίζεται με <code>fixed &lt;&lt; setprecision(2)</code>. Τι εμφανίζεται για τις εισόδους <code>60 25.0 2.50</code> και <code>80 40 1.25</code>;`,
      fields: [{ label: "1η είσοδος:", ans: ["37.50", "37,50"], text: true }, { label: "2η είσοδος:", ans: ["40.00", "40,00"], text: true }],
      hint: R`60 διαφημίσεις, 25% προβάλλονται, 2.50 ανά προβολή.`, sol: R`$60 \cdot 25 / 100 \cdot 2.5 = 37.5$ → <code>37.50</code>· $80 \cdot 40/100 \cdot 1.25 = 40$ → <code>40.00</code> (η <code>setprecision(2)</code> με <code>fixed</code> δίνει ακριβώς 2 δεκαδικά).` },
    { level: 2, q: R`Τι θα εμφανίσει το πρόγραμμα;${CPP(`
struct account {
    int id;
    double balance;
};
void deposit(account ac, double x){
    ac.balance = ac.balance + x;
}
void deposit2(account &ac, double x){
    ac.balance = ac.balance + x;
}
int main(){
    account a;
    a.id = 7;
    a.balance = 100;
    deposit(a, 50);
    cout << a.balance << " ";
    deposit2(a, 30);
    cout << a.balance;
    return 0;
}`)}`,
      fields: [{ label: "Έξοδος:", ans: "100 130", text: true }],
      hint: R`Ποια συνάρτηση δουλεύει σε αντίγραφο;`, sol: R`Η <code>deposit</code> παίρνει <b>αντίγραφο</b> (παράμετρος τιμής), άρα το <code>a.balance</code> μένει 100. Η <code>deposit2</code> δουλεύει με <b>αναφορά</b> και το κάνει 130.${OUT(`100 130`)}` },
    { level: 2, q: R`Ο πίνακας <code>sch[5]</code> έχει, με τη σειρά, κωδικούς σχολείων 310, 205, 118, 422, 205. Ποια τιμή επιστρέφουν οι κλήσεις της <code>find_school</code> (θεωρία);`,
      fields: [{ label: "find_school(sch, 205, 5) =", ans: 1 }, { label: "find_school(sch, 500, 5) =", ans: -1 }],
      hint: R`Η συνάρτηση επιστρέφει τη θέση της πρώτης εμφάνισης.`, sol: R`Το 205 βρίσκεται πρώτη φορά στη θέση <b>1</b> (η <code>return i</code> τερματίζει αμέσως τη συνάρτηση). Το 500 δεν υπάρχει: <b>−1</b>.` },
    { level: 3, q: R`Το πρόγραμμα του Παραδείγματος 8.8 (με N = 4) διαβάζει τα πιο κάτω δεδομένα (όνομα, t1, t2), υπολογίζει <code>F = round((t1 + t2) / 2.0)</code> και ταξινομεί με τη <code>sort_struct</code> σε φθίνουσα σειρά τελικού βαθμού. Ποια είναι η σειρά των ονομάτων μετά την ταξινόμηση;${OUT(`Andreas 15 18
Eleni 19 20
Kostas 12 13
Maria 16 17`, "students.txt")}`,
      fields: [{ label: "Ονόματα:", ans: "Eleni Andreas Maria Kostas", text: true }],
      hint: R`Η round στρογγυλεύει το .5 προς τα πάνω (μακριά από το 0). Ίσοι βαθμοί κρατούν τη σειρά τους.`, sol: R`F: Andreas round(16.5) = 17, Eleni round(19.5) = 20, Kostas round(12.5) = 13, Maria round(16.5) = 17. Φθίνουσα: Eleni (20), Andreas (17), Maria (17), Kostas (13). Ο Andreas μένει πριν από τη Maria γιατί η συνθήκη <code>A3[j].F &lt; temp.F</code> είναι αυστηρή (ευσταθής ταξινόμηση).<div class="ib9rec">${ib9Card("A3[0]", [["name", "Eleni"], ["F", "20"]])}${ib9Card("A3[1]", [["name", "Andreas"], ["F", "17"]])}${ib9Card("A3[2]", [["name", "Maria"], ["F", "17"]])}${ib9Card("A3[3]", [["name", "Kostas"], ["F", "13"]])}</div>` },
    { level: 3, q: R`Ποιος είναι ο τελικός βαθμός <code>F = round((t1 + t2) / 2.0)</code> για τα ζεύγη βαθμών (14, 15) και (18, 18); Τι θα έδινε για το (14, 15) η λανθασμένη έκφραση <code>round((t1 + t2) / 2)</code>;`,
      fields: [{ label: "F(14, 15) =", ans: 15 }, { label: "F(18, 18) =", ans: 18 }, { label: "Λανθασμένη για (14, 15):", ans: 14 }],
      hint: R`(t1 + t2)/2 με ακέραιους κάνει ακέραια διαίρεση.`, sol: R`$29/2.0 = 14.5 \to 15$· $36/2.0 = 18$. Με <code>/ 2</code> η ακέραια διαίρεση δίνει $29/2 = 14$ <b>πριν</b> τη στρογγυλοποίηση, άρα 14.` },
    { level: 3, type: "mc", q: R`Στη συνάρτηση <code>sort_struct</code>, γιατί η μεταβλητή <code>temp</code> δηλώνεται <code>student temp;</code> και όχι <code>int temp;</code>;`,
      options: ["Γιατί κρατά προσωρινά ολόκληρη την εγγραφή που εισάγεται, ώστε να μετακινηθούν όλα της τα μέλη μαζί", "Γιατί το F είναι πραγματικός αριθμός", "Γιατί ο τύπος int δεν επιτρέπεται μέσα σε συναρτήσεις", "Δεν έχει σημασία· και τα δύο δίνουν το ίδιο αποτέλεσμα"], correct: 0,
      hint: R`Τι εκχωρείται στο temp;`, sol: R`Με <code>temp = A3[i];</code> αντιγράφεται <b>όλη η εγγραφή</b> (όνομα, t1, t2, F). Αν μετακινούσαμε μόνο τον βαθμό, τα ονόματα δεν θα αντιστοιχούσαν πια στους βαθμούς τους.` },
    { level: 3, q: R`Τι εμφανίζει το πρόγραμμα; Ο πίνακας <code>it[5]</code> περιέχει τις εγγραφές (code, price): (11, 4.5), (12, 2.0), (13, 7.25), (14, 1.5), (15, 3.0).${CPP(`
bool sorted;
do {
    sorted = true;
    for (int j = 0; j < 4; j++)
        if (it[j].price > it[j+1].price){
            item temp = it[j];
            it[j] = it[j+1];
            it[j+1] = temp;
            sorted = false;
        }
} while (!sorted);
for (int i = 0; i < 5; i++)
    cout << it[i].code << " ";`)}`,
      fields: [{ label: "Έξοδος:", ans: "14 12 15 11 13", text: true }],
      hint: R`Ταξινόμηση φυσαλίδας (με σημαία sorted) σε αύξουσα τιμή· εμφανίζονται οι κωδικοί.`, sol: R`Αύξουσα σειρά τιμών: 1.5 (14), 2.0 (12), 3.0 (15), 4.5 (11), 7.25 (13).${OUT(`14 12 15 11 13`)}` },
    { level: 2, q: R`Να συμπληρώσετε τη συνθήκη του <code>while</code> ώστε η ταξινόμηση με εισαγωγή να ταξινομεί τον πίνακα εγγραφών <code>A3</code> σε <b>αύξουσα</b> σειρά με βάση το μέλος <code>F</code>.${CPP(`
temp = A3[i];
j = i - 1;
while (j>=0 && ________ ){
    A3[j+1] = A3[j];
    j--;
}
A3[j+1] = temp;`)}`,
      fields: [{ label: "Συνθήκη:", ans: ["A3[j].F>temp.F", "temp.F<A3[j].F"], text: true, nospace: true, cs: true }],
      hint: R`Μετακινούμε δεξιά όσες εγγραφές έχουν μεγαλύτερο F από το temp.`, sol: R`<code>A3[j].F &gt; temp.F</code>: όσο η εγγραφή αριστερά έχει <b>μεγαλύτερο</b> βαθμό, μετακινείται μία θέση δεξιά. (Για φθίνουσα: <code>&lt;</code>.)` }
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

/* Πληροφορική Γ΄ Λυκείου — Συμβολοσειρές & Αρχεία (μέρος IB_u04, prefix ib4) */
const ib4E = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ib4Code = (src, on) => { const L = CPPlines(src); return `<div class="cppbox sm"><pre class="cpp"><code>${L.map((l, j) => `<span class="cl${on === j + 1 || (Array.isArray(on) && on.includes(j + 1)) ? " on" : ""}"><i>${j + 1}</i>${l || " "}</span>`).join("")}</code></pre></div>`; };
const ib4Con = (txt, title) => `<div class="conbox"><div class="cpptitle">${ib4E(title || "Οθόνη (έξοδος)")}</div><pre class="con"><code>${ib4E(txt) || " "}</code></pre></div>`;
const ib4Cell = (ch, i, on, col = "#0F6FD1", sub) => `<div style="display:flex;flex-direction:column;align-items:center;gap:1px;min-width:30px;cursor:pointer" data-i="${i}">
  <div style="width:30px;height:34px;display:flex;align-items:center;justify-content:center;border:2px solid ${on ? col : "#c7d3e6"};background:${on ? col + "22" : "#fff"};border-radius:7px;font:700 16px 'SF Mono',Consolas,Menlo,monospace;color:${on ? col : "#15233f"}">${ch === " " ? "␣" : ch === "\n" ? "↵" : ib4E(ch)}</div>
  <div style="font:600 11px 'IBM Plex Mono',ui-monospace,monospace;color:${on ? col : "#5b6b86"}">${i}</div>${sub !== undefined ? `<div style="font:600 10.5px 'IBM Plex Mono',ui-monospace,monospace;color:#8a97ad">${sub}</div>` : ""}</div>`;
const ib4Row = inner => `<div style="display:flex;flex-wrap:wrap;gap:3px;padding:8px;background:#f5f8fd;border:1px solid #dce3ef;border-radius:12px;margin:8px 0">${inner}</div>`;
const ib4Inp = (cls, val, w = 150, type = "text") => `<input type="${type}" class="${cls}" value="${ib4E(val)}" style="width:${w}px;max-width:100%;font:600 14px 'SF Mono',Consolas,Menlo,monospace;padding:5px 8px;border:1px solid var(--line);border-radius:8px" autocomplete="off" spellcheck="false">`;
const ib4Words = ["PROGRAM", "COMPUTER", "LOGIC", "BINARY", "STRING", "CYPRUS", "MEMORY", "KEYBOARD", "MONITOR", "NETWORK", "PYTHON", "ARRAY", "SEARCH", "SORTING", "LIMASSOL", "NICOSIA", "LARNACA", "PAPHOS", "FAMAGUSTA", "BANANA", "PRINTER", "SERVER"];
const ib4Names = ["Maria", "Andreas", "Eleni", "Nikos", "Xenia", "Petros", "Ioanna", "Kostas", "Sofia", "Marios", "Anna", "Loizos", "Christina", "Giorgos"];
const ib4Caesar = (s, k) => [...s].map(c => c >= "A" && c <= "Z" ? String.fromCharCode((c.charCodeAt(0) - 65 + k) % 26 + 65) : c >= "a" && c <= "z" ? String.fromCharCode((c.charCodeAt(0) - 97 + k) % 26 + 97) : c).join("");
/* προσομοίωση ροής εισόδου C++ (cin / ifstream): λέξη, ακέραιος, getline */
function ib4Stream(text) {
  const S = { t: text, p: 0, fail: false, log: [] };
  const ws = c => c === " " || c === "\n" || c === "\t";
  S.word = tag => { const a = S.p; while (S.p < S.t.length && ws(S.t[S.p])) S.p++; const b = S.p; while (S.p < S.t.length && !ws(S.t[S.p])) S.p++; if (b === S.p) { S.fail = true; return null; } S.log.push([a, b, S.p, tag]); return S.t.slice(b, S.p); };
  S.int = tag => { const a = S.p; while (S.p < S.t.length && ws(S.t[S.p])) S.p++; const b = S.p; const m = /^[+-]?\d+/.exec(S.t.slice(S.p)); if (!m) { S.fail = true; return null; } S.p += m[0].length; S.log.push([a, b, S.p, tag]); return +m[0]; };
  S.line = tag => { if (S.p >= S.t.length) { S.fail = true; return null; } const a = S.p; let e = S.t.indexOf("\n", S.p); if (e < 0) e = S.t.length; const v = S.t.slice(S.p, e); S.p = Math.min(S.t.length, e + 1); S.log.push([a, a, S.p, tag]); return v; };
  S.eof = () => S.p >= S.t.length;
  return S;
}
/* ζωγραφίζει τη ροή εισόδου με χρώματα ανά μεταβλητή που «κατανάλωσε» κάθε χαρακτήρα */
function ib4StreamView(S, cols, upto) {
  const owner = new Array(S.t.length).fill(-1); const L = upto === undefined ? S.log : S.log.slice(0, upto);
  L.forEach(([a, b, e, tag]) => { for (let k = a; k < e; k++) owner[k] = tag; });
  const pos = L.length ? L[L.length - 1][2] : 0;
  return ib4Row([...S.t].map((c, i) => ib4Cell(c, i, owner[i] >= 0, cols[owner[i]] || "#0F6FD1")).join("") + `<div style="align-self:center;font:700 12px 'IBM Plex Mono',monospace;color:#C77A0A;margin-left:6px">◀ θέση ανάγνωσης: ${pos}${pos >= S.t.length ? " (τέλος)" : ""}</div>`);
}

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 4.1 Παιδότοπος συμβολοσειράς: θέσεις, s[i], size(), αλλαγή χαρακτήρα, += ---------- */
  ib4str(box) {
    box.innerHTML = `<div class="wctl"><label>string s = "${ib4Inp("s", "Hello", 160)}"</label><label>i = <input type="range" class="i" min="0" max="4" value="0" style="width:140px"><b class="iv">0</b></label></div>
      <div class="cells"></div>
      <div class="wctl"><label>χαρακτήρας c = '${ib4Inp("c", "J", 34)}'</label><button class="btn ghost set">s[i] = c;</button><button class="btn ghost app">s += c;</button><button class="btn ghost rev">↺ αρχικό</button></div>
      <div class="code"></div><div class="wout"></div><p class="muted small">👆 Κάνε κλικ σε ένα κουτάκι ή σύρε τον δείκτη i. Οι αλλαγές στη συμβολοσειρά φαίνονται και στον κώδικα.</p>`;
    let s = "Hello", hist = [];
    const iEl = $(".i", box);
    function draw() {
      const n = s.length; iEl.max = Math.max(0, n - 1); let i = Math.min(+iEl.value, Math.max(0, n - 1)); iEl.value = i; $(".iv", box).textContent = i;
      $(".cells", box).innerHTML = ib4Row([...s].map((c, k) => ib4Cell(c, k, k === i, "#198754", c.charCodeAt(0))).join("") || `<span class="muted">κενή συμβολοσειρά ""</span>`);
      $(".cells", box).querySelectorAll("[data-i]").forEach(d => d.onclick = () => { iEl.value = d.dataset.i; draw(); });
      const src = `string s = "${$(".s", box).value}";\n` + hist.join("\n") + (hist.length ? "\n" : "") + `cout << s[${i}] << " " << s.size();`;
      $(".code", box).innerHTML = ib4Code(src, src.split("\n").length) + ib4Con(n ? `${s[i]} ${n}` : `(s[${i}] εκτός ορίων!) 0`);
      $(".wout", box).innerHTML = n ? `<b>s</b> = "${ib4E(s)}" · <b>s.size()</b> = ${n} · πρώτος: <code>s[0]</code> = '${ib4E(s[0])}' · τελευταίος: <code>s[${n - 1}]</code> = '${ib4E(s[n - 1])}' · <code>s[${i}]</code> = '${ib4E(s[i])}' (ASCII ${s.charCodeAt(i)})<br><span class="muted">Οι έγκυρες θέσεις είναι 0 … s.size()−1 = ${n - 1}.</span>` : `Η συμβολοσειρά είναι άδεια: <code>s.size()</code> = 0.`;
    }
    $(".s", box).oninput = () => { s = $(".s", box).value.slice(0, 24); hist = []; draw(); };
    const ch = () => ($(".c", box).value || " ")[0];
    $(".set", box).onclick = () => { if (!s.length) return; const i = +iEl.value; s = s.slice(0, i) + ch() + s.slice(i + 1); hist.push(`s[${i}] = '${ch()}';`); draw(); };
    $(".app", box).onclick = () => { if (s.length >= 24) return; s += ch(); hist.push(`s += '${ch()}';`); draw(); };
    $(".rev", box).onclick = () => { s = $(".s", box).value.slice(0, 24); hist = []; draw(); };
    iEl.oninput = draw; draw();
  },

  /* ---------- 4.2 cin >> ή getline; Προσομοίωση εισόδου ---------- */
  ib4input(box) {
    const P = [
      ["cin >> st;", `string st;\ncin >> st;\ncout << st << endl;\ncout << st.size();`, S => { const st = S.word(0); return { vars: [["st", st, 0]], out: st === null ? "" : `${st}\n${st.length}` }; }],
      ["getline(cin, st);", `string st;\ngetline(cin, st);\ncout << st << endl;\ncout << st.size();`, S => { const st = S.line(0); return { vars: [["st", st, 0]], out: st === null ? "" : `${st}\n${st.length}` }; }],
      ["getline + cin >>", `string st1, st2;\ngetline(cin, st1);\ncin >> st2;\ncout << st1.size() << " " << st2.size();`, S => { const a = S.line(0), b = S.word(1); return { vars: [["st1", a, 0], ["st2", b, 1]], out: `${a === null ? 0 : a.length} ${b === null ? 0 : b.length}` }; }],
      ["cin >> num; getline (παγίδα)", `int num;\nstring st;\ncin >> num;\ngetline(cin, st);\ncout << num << "[" << st << "]";`, S => { const n = S.int(0), st = S.line(1); return { vars: [["num", n, 0], ["st", st, 1]], out: `${n === null ? 0 : n}[${st === null ? "" : st}]` }; }],
      ["cin >> num; getline(temp); getline (λύση)", `int num;\nstring st, temp;\ncin >> num;\ngetline(cin, temp);\ngetline(cin, st);\ncout << num << "[" << st << "]";`, S => { const n = S.int(0), t = S.line(2), st = S.line(1); return { vars: [["num", n, 0], ["temp", t, 2], ["st", st, 1]], out: `${n === null ? 0 : n}[${st === null ? "" : st}]` }; }]];
    const cols = ["#0F6FD1", "#198754", "#C77A0A"];
    box.innerHTML = `<div class="wctl"><label>Πρόγραμμα: <select class="pr">${P.map((p, i) => `<option value="${i}">${ib4E(p[0])}</option>`).join("")}</select></label></div>
      <div class="wctl"><label>1η γραμμή εισόδου ${ib4Inp("l1", "Hello world", 170)}</label><label>2η γραμμή ${ib4Inp("l2", "Good luck", 150)}</label></div>
      <div class="code"></div><div class="stream"></div><div class="vars"></div><div class="res"></div>`;
    function draw() {
      const k = +$(".pr", box).value;
      if (k >= 3 && !/^\s*-?\d+\s*$/.test($(".l1", box).value) && !box.dataset.n) { $(".l1", box).value = "3"; box.dataset.n = 1; }
      const S = ib4Stream($(".l1", box).value + "\n" + $(".l2", box).value + "\n"), r = P[k][2](S);
      $(".code", box).innerHTML = ib4Code(P[k][1]);
      $(".stream", box).innerHTML = `<div class="small muted" style="margin-top:6px">Είσοδος (πληκτρολόγιο) — κάθε χαρακτήρας χρωματίζεται ανάλογα με τη μεταβλητή που τον «κατανάλωσε» (↵ = Enter, ␣ = κενό):</div>` + ib4StreamView(S, cols);
      $(".vars", box).innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:10px">${r.vars.map(([n, v, c]) => `<div style="border:2px solid ${cols[c]};border-radius:10px;padding:6px 10px;background:${cols[c]}12"><code>${n}</code> = <b style="font-family:'SF Mono',Consolas,monospace">${v === null ? "(αποτυχία)" : typeof v === "number" ? v : `"${ib4E(v)}"`}</b>${typeof v === "string" ? ` <span class="muted small">size() = ${v.length}</span>` : ""}</div>`).join("")}</div>`;
      $(".res", box).innerHTML = ib4Con(r.out) + `<div class="wout">${["Η <b>cin &gt;&gt;</b> παραλείπει κενά/Enter στην αρχή και σταματά στο πρώτο κενό: τα υπόλοιπα μένουν στην είσοδο.", "Η <b>getline</b> παίρνει όλη τη γραμμή, μαζί με τα κενά, και «καταναλώνει» το Enter.", "Η getline διάβασε όλη την 1η γραμμή· η cin &gt;&gt; πήρε μόνο την πρώτη λέξη της 2ης.", "<b>Παγίδα:</b> η cin &gt;&gt; num άφησε το Enter της 1ης γραμμής· η getline το διάβασε αμέσως και η st έμεινε <b>άδεια</b>!", "<b>Λύση του βιβλίου:</b> η getline(cin, temp) «τρώει» το Enter και η επόμενη getline διαβάζει σωστά τη φράση."][k]}</div>`;
    }
    box.querySelectorAll("input,select").forEach(e => e.oninput = e.onchange = draw); draw();
  },

  /* ---------- 4.3 ASCII, κρυπτογράφηση Καίσαρα και μετρητές cnt[26] ---------- */
  ib4ascii(box) {
    box.innerHTML = `<div class="wctl"><label>Λέξη/φράση ${ib4Inp("w", "AWAY", 190)}</label><label>μετατόπιση X = <input type="range" class="k" min="0" max="25" value="2" style="width:130px"><b class="kv">2</b></label>
      <label>Μετατροπή: <select class="md"><option value="0">Κρυπτογράφηση (Καίσαρας)</option><option value="1">Κεφαλαία → πεζά (+32)</option><option value="2">Πεζά → κεφαλαία (−32)</option></select></label></div>
      <div class="tab" style="overflow-x:auto"></div><div class="res"></div><div class="small muted" style="margin-top:8px">Πίνακας μετρητών <code>cnt[26]</code> (θέση = γράμμα − 'A', πεζά και κεφαλαία μαζί):</div><div class="bars"></div>`;
    function draw() {
      const w = $(".w", box).value.slice(0, 30), k = +$(".k", box).value, md = +$(".md", box).value; $(".kv", box).textContent = k;
      $(".k", box).disabled = md !== 0;
      const conv = c => md === 0 ? ib4Caesar(c, k) : md === 1 ? (c >= "A" && c <= "Z" ? String.fromCharCode(c.charCodeAt(0) + 32) : c) : (c >= "a" && c <= "z" ? String.fromCharCode(c.charCodeAt(0) - 32) : c);
      const rows = [...w].map(c => [c, c.charCodeAt(0), /[A-Za-z]/.test(c) ? (c.toUpperCase().charCodeAt(0) - 65) : "—", conv(c), conv(c).charCodeAt(0)]);
      $(".tab", box).innerHTML = `<table class="tbl"><tr><th>θέση i</th>${rows.map((_, i) => `<td>${i}</td>`).join("")}</tr><tr><th>s[i]</th>${rows.map(r => `<td><b>${r[0] === " " ? "␣" : ib4E(r[0])}</b></td>`).join("")}</tr><tr><th>ASCII</th>${rows.map(r => `<td>${r[1]}</td>`).join("")}</tr>${md === 0 ? `<tr><th>γράμμα − 'A'</th>${rows.map(r => `<td>${r[2]}</td>`).join("")}</tr>` : ""}<tr><th>νέος</th>${rows.map(r => `<td style="color:#198754"><b>${r[3] === " " ? "␣" : ib4E(r[3])}</b></td>`).join("")}</tr><tr><th>νέο ASCII</th>${rows.map(r => `<td>${r[4]}</td>`).join("")}</tr></table>`;
      const code = md === 0 ? `for(int i=0; i<s.size(); i++)\n    if(s[i]>='A' && s[i]<='Z')\n        s[i] = (s[i] - 'A' + ${k}) % 26 + 'A';\n    else if(s[i]>='a' && s[i]<='z')\n        s[i] = (s[i] - 'a' + ${k}) % 26 + 'a';` : md === 1 ? `for(int i=0; i<s.size(); i++)\n    if(s[i]>=65 && s[i]<=90)\n        s[i] = s[i] + 32;` : `for(int i=0; i<s.size(); i++)\n    if(s[i]>=97 && s[i]<=122)\n        s[i] = s[i] - 32;`;
      $(".res", box).innerHTML = ib4Code(code) + ib4Con([...w].map(conv).join(""));
      const cnt = new Array(26).fill(0); for (const c of w.toUpperCase()) if (c >= "A" && c <= "Z") cnt[c.charCodeAt(0) - 65]++;
      let mx = 0, pos = -1; cnt.forEach((v, i) => { if (v > mx) { mx = v; pos = i; } });
      $(".bars", box).innerHTML = `<div style="display:flex;gap:2px;align-items:flex-end;height:110px;overflow-x:auto;padding:6px 2px;background:#f5f8fd;border:1px solid #dce3ef;border-radius:10px">${cnt.map((v, i) => `<div style="display:flex;flex-direction:column;align-items:center;min-width:16px;flex:1"><div style="font:600 10px monospace;color:#5b6b86">${v || ""}</div><div style="width:12px;height:${mx ? v / mx * 66 : 0}px;background:${i === pos ? "#C77A0A" : "#0F6FD1"};border-radius:3px 3px 0 0"></div><div style="font:700 10.5px monospace;color:${i === pos ? "#C77A0A" : "#15233f"}">${String.fromCharCode(65 + i)}</div><div style="font:500 8.5px monospace;color:#8a97ad">${i}</div></div>`).join("")}</div>
        <div class="wout">${pos >= 0 ? `Περισσότερες εμφανίσεις: <b>${String.fromCharCode(65 + pos)}</b> (cnt[${pos}] = ${mx}) — με αυστηρό <code>&gt;</code> σε ισοπαλία κερδίζει το γράμμα που προηγείται αλφαβητικά. Η <code>char(65 + ${pos})</code> δίνει '${String.fromCharCode(65 + pos)}'.` : "Δεν υπάρχουν λατινικά γράμματα."}</div>`;
    }
    box.querySelectorAll("input,select").forEach(e => e.oninput = e.onchange = draw); draw();
  },

  /* ---------- 5.1 Αρχεία: εκτέλεση βήμα-βήμα με ifstream / ofstream ---------- */
  ib4fileio(box) {
    const PR = [
      { name: "Άθροισμα δύο αριθμών", src: `ifstream fin("input.txt");\nofstream fout("output.txt");\nint a, b, c;\nfin >> a >> b;\nc = a + b;\nfout << c << endl;\nfin.close();\nfout.close();`, init: "12 30",
        run(S, st) { st.push({ ln: 1, note: "Ανοίγει η ροή ανάγνωσης fin." }); st.push({ ln: 2, note: "Δημιουργείται (ή αδειάζει) το output.txt." }); const a = S.int(0); st.push({ ln: 4, v: { a }, note: `fin >> a: διαβάστηκε ${a}` }); const b = S.int(1); st.push({ ln: 4, v: { a, b }, note: `fin >> b: διαβάστηκε ${b}` }); const c = (a || 0) + (b || 0); st.push({ ln: 5, v: { a, b, c } }); st.push({ ln: 6, v: { a, b, c }, out: c + "\n" }); st.push({ ln: 8, v: { a, b, c }, note: "Οι ροές κλείνουν." }); } },
      { name: "Μεγαλύτεροι από τον μέσο όρο", src: `ifstream infile("in.txt");\nofstream outfile("out.txt");\nint A[6], sum = 0;\nfor(int i=0; i<6; i++){\n    infile >> A[i];\n    sum += A[i];\n}\nfloat mo = sum / 6.0;\nfor(int i=0; i<6; i++)\n    if(A[i] > mo)\n        outfile << A[i] << endl;`, init: "8 3 12 5 9 2",
        run(S, st) { const A = []; let sum = 0, out = ""; for (let i = 0; i < 6; i++) { const x = S.int(i % 3); A.push(x === null ? 0 : x); sum += A[i]; st.push({ ln: [5, 6], v: { i, ["A[" + i + "]"]: A[i], sum }, note: `infile >> A[${i}]` }); } const mo = sum / 6; st.push({ ln: 8, v: { sum, mo: +mo.toFixed(3) } }); for (let i = 0; i < 6; i++) { const ok = A[i] > mo; if (ok) out += A[i] + "\n"; st.push({ ln: ok ? [10, 11] : 10, v: { i, ["A[" + i + "]"]: A[i], mo: +mo.toFixed(3) }, out, note: ok ? `${A[i]} > ${+mo.toFixed(3)} → γράφεται` : `${A[i]} ≤ ${+mo.toFixed(3)}` }); } } },
      { name: "Μέγιστος από 5 αριθμούς", src: `ifstream fin("in.txt");\nofstream fout("out1.txt");\nint x, max;\nfin >> max;\nfor(int i=2; i<=5; i++){\n    fin >> x;\n    if(x > max)\n        max = x;\n}\nfout << max;`, init: "14 -2 31 7 31",
        run(S, st) { let mx = S.int(0); mx = mx === null ? 0 : mx; st.push({ ln: 4, v: { max: mx }, note: "Ο πρώτος αριθμός γίνεται αρχικό μέγιστο." }); for (let i = 2; i <= 5; i++) { let x = S.int(1); x = x === null ? 0 : x; const ch = x > mx; if (ch) mx = x; st.push({ ln: ch ? [6, 7, 8] : [6, 7], v: { i, x, max: mx }, note: ch ? `${x} > προηγούμενου max → νέο max` : "" }); } st.push({ ln: 10, v: { max: mx }, out: String(mx) }); } }];
    box.innerHTML = `<div class="wctl"><label>Πρόγραμμα: <select class="pr">${PR.map((p, i) => `<option value="${i}">${p.name}</option>`).join("")}</select></label><button class="btn ghost st">▶ Βήμα</button><button class="btn ghost all">⏩ Εκτέλεση</button><button class="btn ghost rs">↺</button></div>
      <div class="wctl"><label><span class="fn">input.txt</span>: ${ib4Inp("inp", "", 210)}</label></div><div class="code"></div><div class="stream"></div><div class="vars"></div><div class="res"></div>`;
    let k = -1;
    function draw(reset) {
      const p = PR[+$(".pr", box).value];
      if (reset) { $(".inp", box).value = p.init; k = -1; }
      const S = ib4Stream($(".inp", box).value), st = []; st.push = function (o) { o.r = S.log.length; return Array.prototype.push.call(this, o); }; p.run(S, st);
      k = Math.min(k, st.length - 1); const cur = st[k] || { v: {} };
      const inName = /"([^"]+)"/.exec(p.src)[1], outName = /ofstream \w+\("([^"]+)"/.exec(p.src)[1]; $(".fn", box).textContent = inName;
      $(".code", box).innerHTML = ib4Code(p.src, k < 0 ? 0 : cur.ln);
      const nRead = k < 0 ? 0 : (cur.r || 0);
      $(".stream", box).innerHTML = `<div class="small muted">Περιεχόμενο του <b>${inName}</b> — η ροή διαβάζει από αριστερά προς τα δεξιά:</div>` + ib4StreamView(S, ["#0F6FD1", "#198754", "#6F42C1"], nRead);
      const v = cur.v || {};
      $(".vars", box).innerHTML = Object.keys(v).length ? `<table class="tbl"><tr>${Object.keys(v).map(n => `<th>${ib4E(n)}</th>`).join("")}</tr><tr>${Object.values(v).map(x => `<td>${x === null || x === undefined ? "?" : x}</td>`).join("")}</tr></table>` : `<span class="muted small">Πάτησε ▶ Βήμα για εκτέλεση γραμμή-γραμμή.</span>`;
      const out = st.slice(0, k + 1).reduce((o, x) => x.out !== undefined ? x.out : o, "");
      $(".res", box).innerHTML = ib4Con(out.replace(/\n$/, ""), outName) + (cur.note ? `<div class="wout">${ib4E(cur.note)}</div>` : "") + (S.fail ? `<div class="wout" style="color:#DC3545">⚠ Το αρχείο δεν έχει αρκετούς ακέραιους: μια ανάγνωση απέτυχε.</div>` : "");
    }
    $(".st", box).onclick = () => { k++; draw(); }; $(".all", box).onclick = () => { k = 999; draw(); }; $(".rs", box).onclick = () => { k = -1; draw(); };
    $(".pr", box).onchange = () => draw(true); $(".inp", box).oninput = () => { k = -1; draw(); }; draw(true);
  },

  /* ---------- 5.2 append vs overwrite & βρόχος while(!fin.eof()) ---------- */
  ib4append(box) {
    box.innerHTML = `<h4 style="margin:0 0 6px">α) ofstream με ή χωρίς ios::app</h4>
      <div class="wctl"><label>Νέο όνομα: ${ib4Inp("nm", "Matt", 120)}</label><button class="btn ghost ow">ofstream fout("log.txt");</button><button class="btn ghost ap">ofstream fout("log.txt", (ios::out | ios::app));</button><button class="btn ghost r1">↺</button></div>
      <div class="f1"></div>
      <h4 style="margin:16px 0 6px">β) Αρχική ανάγνωση και while(!fin.eof())</h4>
      <div class="wctl"><label>nums.txt: ${ib4Inp("nums", "4 7 9", 150)}</label><label><input type="checkbox" class="nl"> χωρίς Enter στο τέλος</label><button class="btn ghost st">▶ Βήμα</button><button class="btn ghost all">⏩ Εκτέλεση</button><button class="btn ghost r2">↺</button></div>
      <div class="f2"></div>`;
    const base = ["John", "Jamie", "Jason"]; let file = base.slice(), last = "";
    function d1() {
      $(".f1", box).innerHTML = `<div class="figrow"><div>${ib4Code(last === "ap" ? `ofstream fout("log.txt", (ios::out | ios::app));\nfout << name << endl;` : `ofstream fout("log.txt");\nfout << name << endl;`, last ? [1] : 0)}</div><div>${ib4Con(file.join("\n"), "log.txt")}</div></div><div class="wout">${last === "ow" ? "Χωρίς <b>ios::app</b> το αρχείο <b>άδειασε</b> πρώτα: έμεινε μόνο το νέο όνομα." : last === "ap" ? `Με <b>ios::app</b> το νέο όνομα προστέθηκε <b>στο τέλος</b>· το αρχείο έχει τώρα ${file.length} γραμμές.` : "Πάτησε ένα από τα δύο κουμπιά για να «τρέξεις» το πρόγραμμα."}</div>`;
    }
    $(".ow", box).onclick = () => { file = [$(".nm", box).value || "?"]; last = "ow"; d1(); };
    $(".ap", box).onclick = () => { if (file.length < 12) file.push($(".nm", box).value || "?"); last = "ap"; d1(); };
    $(".r1", box).onclick = () => { file = base.slice(); last = ""; d1(); };
    let k = -1;
    function d2() {
      const txt = ($(".nums", box).value.trim().replace(/\s+/g, " ")) + ($(".nl", box).checked ? "" : "\n");
      const S = ib4Stream(txt); const st = []; let x = "?", s = 0, cnt = 0;
      const rd = () => { const v = S.int(0); if (v !== null) x = v; return v; };
      let v = rd(); st.push({ ln: 3, x, s, cnt, read: S.log.length, note: v === null ? "Η αρχική ανάγνωση απέτυχε: το αρχείο είναι άδειο." : `Αρχική ανάγνωση: fin >> x → ${v}` });
      for (let g = 0; g < 30; g++) {
        const e = S.eof(); st.push({ ln: 4, eof: e, x, s, cnt, read: S.log.length, note: `fin.eof() = ${e} → ${e ? "τέλος βρόχου" : "εκτελείται το σώμα"}` }); if (e) break;
        s += x; st.push({ ln: 5, eof: false, x, s, cnt, read: S.log.length }); cnt++; st.push({ ln: 6, eof: false, x, s, cnt, read: S.log.length });
        v = rd(); st.push({ ln: 7, eof: S.eof(), x, s, cnt, read: S.log.length, note: v === null ? "Η ανάγνωση απέτυχε: δεν υπάρχει άλλος αριθμός, η eof() γίνεται true." : `fin >> x → ${v}` + (S.eof() ? " — η ανάγνωση έφτασε ταυτόχρονα στο τέλος του αρχείου (δεν υπάρχει Enter), η eof() είναι ήδη true!" : "") });
      }
      st.push({ ln: 9, eof: true, x, s, cnt, read: S.log.length, out: `${s} ${cnt}`, note: `Τυπώνεται s = ${s}, cnt = ${cnt}` + ($(".nl", box).checked ? " — ο τελευταίος αριθμός ΔΕΝ μετρήθηκε, γιατί η γραμμή δεν τελειώνει με Enter!" : "") });
      k = Math.min(k, st.length - 1); const c = st[k] || { x: "?", s: 0, cnt: 0, read: 0 };
      $(".f2", box).innerHTML = `<div class="figrow"><div>${ib4Code(`ifstream fin("nums.txt");\nint x, s = 0, cnt = 0;\nfin >> x;\nwhile(!fin.eof()){\n    s += x;\n    cnt++;\n    fin >> x;\n}\ncout << s << " " << cnt;`, k < 0 ? 0 : c.ln)}</div><div>${ib4StreamView(S, ["#0F6FD1"], k < 0 ? 0 : c.read || 0)}<table class="tbl"><tr><th>eof()</th><th>x</th><th>s</th><th>cnt</th></tr><tr><td>${k < 0 || c.eof === undefined ? "—" : c.eof}</td><td>${k < 0 ? "?" : c.x}</td><td>${c.s}</td><td>${c.cnt}</td></tr></table>${ib4Con(c.out || "")}</div></div>${c.note ? `<div class="wout">${ib4E(c.note)}</div>` : `<div class="wout muted">Πάτησε ▶ Βήμα. Δοκίμασε μετά να τσεκάρεις «χωρίς Enter στο τέλος».</div>`}`;
    }
    $(".st", box).onclick = () => { k++; d2(); }; $(".all", box).onclick = () => { k = 999; d2(); }; $(".r2", box).onclick = () => { k = -1; d2(); };
    $(".nums", box).oninput = $(".nl", box).onchange = () => { k = -1; d2(); };
    d1(); d2();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  /* 4.1 θέσεις χαρακτήρων */
  ib4idx: { title: "Γεννήτρια — θέσεις χαρακτήρων και size()", make() {
    const s = bkPick(ib4Words), n = s.length, t = ri(0, 3), sc = R`string s = "${s}";`;
    if (t === 0) { const i = ri(0, n - 1); let j = ri(0, n - 1); if (j === i) j = (i + 1) % n;
      return { q: R`Τι θα εμφανίσει το τμήμα προγράμματος;${CPP(`${sc}\ncout << s[${i}] << s[${j}];`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: s[i] + s[j], text: true, cs: true }],
        hint: R`Η πρώτη θέση είναι η 0.`, sol: R`${ib4Boxes(s, { hl: [i, j] })}<code>s[${i}]</code> = ${s[i]}, <code>s[${j}]</code> = ${s[j]}. ${OUT(s[i] + s[j])}` }; }
    if (t === 1) { const k = ri(1, 3);
      return { q: R`Τι θα εμφανίσει το τμήμα προγράμματος;${CPP(`${sc}\ncout << s.size() << " " << s[s.size()-${k}];`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: `${n} ${s[n - k]}`, text: true, cs: true }],
        hint: R`Ο τελευταίος χαρακτήρας είναι στη θέση s.size()−1.`, sol: R`${ib4Boxes(s, { hl: [n - k] })}<code>s.size()</code> = ${n}, άρα <code>s[${n}-${k}]</code> = <code>s[${n - k}]</code> = ${s[n - k]}. ${OUT(`${n} ${s[n - k]}`)}` }; }
    if (t === 2) { const cs = [...new Set(s)], c = bkPick(cs), cnt = [...s].filter(x => x === c).length;
      return { q: R`Τι θα εμφανίσει το τμήμα προγράμματος;${CPP(`${sc}\nint k = 0;\nfor(int i=0; i<s.size(); i++)\n    if(s[i]=='${c}')\n        k++;\ncout << k;`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: cnt }],
        hint: R`Μέτρησε πόσες φορές εμφανίζεται ο χαρακτήρας '${c}'.`, sol: R`${ib4Boxes(s, { hl: [...s].map((x, i) => x === c ? i : -1).filter(i => i >= 0) })}Ο χαρακτήρας '${c}' εμφανίζεται <b>${cnt}</b> φορά/ές. ${OUT(String(cnt))}` }; }
    const a = ri(0, Math.max(0, n - 4)), b = Math.min(n - 1, a + ri(2, 3)), out = s.slice(a, b + 1).split("").reverse().join("");
    return { q: R`Τι θα εμφανίσει το τμήμα προγράμματος;${CPP(`${sc}\nfor(int i=${b}; i>=${a}; i--)\n    cout << s[i];`, { nonum: true })}`, fields: [{ label: "Έξοδος:", ans: out, text: true, cs: true }],
      hint: R`Ο βρόχος πηγαίνει από τη θέση ${b} προς τα πίσω μέχρι τη θέση ${a}.`, sol: R`${ib4Boxes(s, { hl: Array.from({ length: b - a + 1 }, (_, q) => a + q) })}Τυπώνονται οι χαρακτήρες των θέσεων ${b} … ${a} με αντίστροφη σειρά. ${OUT(out)}` };
  } },
  /* 4.2 cin >> ή getline */
  ib4cin: { title: "Γεννήτρια — cin ή getline;", make() {
    const w1 = bkPick(ib4Names), w2 = bkPick(["loves", "plays", "studies", "codes", "likes"]), w3 = bkPick(["chess", "football", "music", "coding", "maths", "physics"]), ph = `${w1} ${w2} ${w3}`;
    const g = ri(0, 1), st = g ? ph : w1;
    return { q: R`Ο χρήστης πληκτρολογεί <code>${ph}</code> και πατά Enter. Τι θα εμφανίσει το πρόγραμμα;${CPP(`string st;\n${g ? "getline(cin, st);" : "cin >> st;"}\ncout << st << " " << st.size();`, { nonum: true })}`,
      fields: [{ label: "Έξοδος:", ans: `${st} ${st.length}`, text: true, cs: true, wide: true }],
      hint: g ? R`Η getline διαβάζει όλη τη γραμμή, μαζί με τα κενά.` : R`Η cin &gt;&gt; σταματά στο πρώτο κενό.`,
      sol: R`${g ? R`Η <code>getline</code> αποθηκεύει ολόκληρη τη φράση: <code>st = "${ph}"</code>, μέγεθος ${st.length} (μαζί με τα 2 κενά).` : R`Η <code>cin &gt;&gt;</code> θεωρεί το κενό διαχωριστικό: <code>st = "${w1}"</code>, μέγεθος ${st.length}.`} ${OUT(`${st} ${st.length}`)}` };
  } },
  /* 4.3 ASCII και κρυπτογράφηση */
  ib4caesar: { title: "Γεννήτρια — ASCII και κρυπτογράφηση", make() {
    const t = ri(0, 2);
    if (t === 0) { const w = bkPick(ib4Words.filter(x => x.length <= 7)), k = ri(1, 5), out = ib4Caesar(w, k);
      return { q: R`Τι θα εμφανίσει το πρόγραμμα για είσοδο <code>${w}</code>;${CPP(`string s;\ncin >> s;\nfor(int i=0; i<s.size(); i++)\n    s[i] = (s[i] - 'A' + ${k}) % 26 + 'A';\ncout << s;`, {})}`, fields: [{ label: "Έξοδος:", ans: out, text: true, cs: true }],
        hint: R`Κάθε γράμμα πηγαίνει ${k} θέσεις μπροστά· μετά το Z ακολουθεί το A.`, sol: R`${[...w].map((c, i) => `${c}→${out[i]}`).join(", ")}. ${OUT(out)}` }; }
    if (t === 1) { const c = String.fromCharCode(ri(65, 90)), d = ri(1, 6), lo = ri(0, 1);
      const expr = lo ? `char('${c}' + 32)` : `char('${c}' + ${d})`, res = lo ? c.toLowerCase() : String.fromCharCode((c.charCodeAt(0) + d)), ok = lo || c.charCodeAt(0) + d <= 90;
      if (!ok) return GENS.ib4caesar.make();
      return { q: R`Αν <code>'A'</code> = 65, τι θα εμφανίσει η εντολή <code>cout &lt;&lt; int('${c}') &lt;&lt; " " &lt;&lt; ${ib4E(expr)};</code>`, fields: [{ label: "Έξοδος:", ans: `${c.charCodeAt(0)} ${res}`, text: true, cs: true }],
        hint: R`Τα κεφαλαία έχουν κωδικούς 65–90, τα πεζά 97–122.`, sol: R`<code>'${c}'</code> = 65 + ${c.charCodeAt(0) - 65} = ${c.charCodeAt(0)}. ${lo ? R`Με +32 παίρνουμε το αντίστοιχο πεζό: ${res}.` : R`${c.charCodeAt(0)} + ${d} = ${res.charCodeAt(0)} → '${res}'.`} ${OUT(`${c.charCodeAt(0)} ${res}`)}` }; }
    const w = bkPick(ib4Words), L = bkPick([...new Set(w)]), pos = L.charCodeAt(0) - 65, cnt = [...w].filter(x => x === L).length;
    return { q: R`Μετά την εκτέλεση, ποια θέση του πίνακα <code>cnt</code> αντιστοιχεί στο γράμμα ${L} και ποια είναι η τιμή της;${CPP(`int cnt[26];\nint main(){\n string st = "${w}";\n for(int i=0; i<st.size(); i++)\n    cnt[st[i]-'A']++;\nreturn 0;\n}`, {})}`,
      fields: [{ label: "θέση:", ans: pos }, { label: `cnt[θέση] =`, ans: cnt }],
      hint: R`Η θέση είναι '${L}' − 'A'.`, sol: R`<code>'${L}' - 'A'</code> = ${L.charCodeAt(0)} − 65 = <b>${pos}</b>. Το ${L} εμφανίζεται <b>${cnt}</b> φορά/ές στο ${w}, άρα <code>cnt[${pos}] = ${cnt}</code>.` };
  } },
  /* 5.1 αρχεία */
  ib4file: { title: "Γεννήτρια — τι γράφεται στο αρχείο;", make() {
    const n = 5, A = Array.from({ length: n }, () => ri(-9, 40)), t = ri(0, 2), inp = A.join(" ");
    if (t === 0) { const k = ri(5, 25), s = A.filter(x => x > k).reduce((a, b) => a + b, 0);
      return { q: R`Το <code>in.txt</code> περιέχει <code>${inp}</code>. Τι θα γραφτεί στο <code>out.txt</code>;${CPP(`ifstream fin("in.txt");\nofstream fout("out.txt");\nint x, s = 0;\nfor(int i=0; i<${n}; i++){\n    fin >> x;\n    if(x > ${k})\n        s += x;\n}\nfout << s;\nfin.close();\nfout.close();`, {})}`, fields: [{ label: "out.txt:", ans: s }],
        hint: R`Πρόσθεσε μόνο τους αριθμούς που είναι μεγαλύτεροι από ${k}.`, sol: R`Μεγαλύτεροι από ${k}: ${A.filter(x => x > k).join(", ") || "κανένας"} → s = <b>${s}</b>.` }; }
    if (t === 1) { const ev = A.filter(x => x % 2 === 0), od = A.filter(x => x % 2 !== 0);
      return { q: R`Το <code>nums.txt</code> περιέχει <code>${inp}</code>. Πόσοι αριθμοί γράφονται στο <code>even.txt</code> και πόσοι στο <code>odd.txt</code>;${CPP(`ifstream fin("nums.txt");\nofstream fe("even.txt");\nofstream fo("odd.txt");\nint x;\nfor(int i=0; i<${n}; i++){\n    fin >> x;\n    if(x % 2 == 0)\n        fe << x << endl;\n    else\n        fo << x << endl;\n}`, {})}`, fields: [{ label: "even.txt:", ans: ev.length }, { label: "odd.txt:", ans: od.length }],
        hint: R`Άρτιος: x % 2 == 0 (και οι αρνητικοί άρτιοι!).`, sol: R`Άρτιοι: ${ev.join(", ") || "—"} (${ev.length}) · Περιττοί: ${od.join(", ") || "—"} (${od.length}). Στη C++ π.χ. <code>-3 % 2</code> = −1 ≠ 0, άρα σωστά θεωρείται περιττός.` }; }
    const mx = Math.max(...A);
    return { q: R`Το <code>in.txt</code> περιέχει <code>${inp}</code>. Τι θα γραφτεί στο <code>out1.txt</code>;${CPP(`ifstream fin("in.txt");\nofstream fout("out1.txt");\nint x, max;\nfin >> max;\nfor(int i=2; i<=${n}; i++){\n    fin >> x;\n    if(x > max)\n        max = x;\n}\nfout << max;`, {})}`, fields: [{ label: "out1.txt:", ans: mx }],
      hint: R`Αρχικό μέγιστο: ο πρώτος αριθμός του αρχείου.`, sol: R`Διαδοχικά μέγιστα: ${A.map((_, i) => Math.max(...A.slice(0, i + 1))).join(" → ")}. Γράφεται <b>${mx}</b>.` };
  } },
  /* 5.2 eof */
  ib4eof: { title: "Γεννήτρια — βρόχος while(!fin.eof()) με αρχική ανάγνωση", make() {
    const n = ri(3, 6), A = Array.from({ length: n }, () => ri(-5, 30)), s = A.reduce((a, b) => a + b, 0), noNl = ri(0, 3) === 0;
    const code = CPP(`ifstream fin("data.txt");\nint x, s = 0, cnt = 0;\nfin >> x;\nwhile(!fin.eof()){\n    s += x;\n    cnt++;\n    fin >> x;\n}\ncout << s << " " << cnt;`, {});
    const sumTxt = B => B.join(" + ").replace(/\+ -/g, "− ");
    if (noNl) { const s2 = s - A[n - 1];
      return { q: R`Το <code>data.txt</code> περιέχει <code>${A.join(" ")}</code>, αλλά <b>η γραμμή δεν τελειώνει με Enter</b>. Τι θα εμφανίσει το πρόγραμμα;${code}`, fields: [{ label: "s =", ans: s2 }, { label: "cnt =", ans: n - 1 }],
        hint: R`Όταν διαβάζεται ο τελευταίος αριθμός, η ανάγνωση φτάνει ταυτόχρονα στο τέλος του αρχείου.`, sol: R`Μετά την ανάγνωση του ${A[n - 1]} η <code>eof()</code> γίνεται <code>true</code> (δεν ακολουθεί Enter), οπότε ο βρόχος σταματά πριν τον προσθέσει: s = ${sumTxt(A.slice(0, n - 1))} = <b>${s2}</b>, cnt = <b>${n - 1}</b>. ${OUT(`${s2} ${n - 1}`)}` }; }
    return { q: R`Το <code>data.txt</code> περιέχει <code>${A.join(" ")}</code> (με Enter στο τέλος της γραμμής). Τι θα εμφανίσει το πρόγραμμα;${code}`, fields: [{ label: "s =", ans: s }, { label: "cnt =", ans: n }],
      hint: R`Αρχική ανάγνωση, επεξεργασία, επόμενη ανάγνωση — μέχρι το τέλος του αρχείου.`, sol: R`Επεξεργάζονται όλοι οι αριθμοί: s = ${sumTxt(A)} = <b>${s}</b>, cnt = <b>${n}</b>. ${OUT(`${s} ${n}`)}` };
  } }
});

/* Πληροφορική Γ΄ — Γ7.4 Συναρτήσεις & Γ7.9 Στοίβα/Ουρά: widgets & γεννήτριες (prefix ib6) */
const ib6R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const ib6Pick = a => a[Math.floor(Math.random() * a.length)];
const ib6Shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ib6Div = (a, b) => Math.trunc(a / b);           /* ακέραια διαίρεση C++ */
const ib6Mod = (a, b) => a - b * Math.trunc(a / b);   /* % της C++ */
const ib6Norm = s => String(s).replace(/\s+/g, " ").trim();
/* κώδικας με ετικέτες γραμμών «@@tag» στο τέλος → { src (χωρίς ετικέτες), tag → αριθμός γραμμής (1-based) } */
function ib6Tags(code) {
  const map = {}, lines = cppClean(code).map((l, i) => { const m = /\s*@@(\w+)\s*$/.exec(l); if (m) { map[m[1]] = i + 1; return l.slice(0, m.index); } return l; });
  return { src: lines.join("\n"), map };
}

/* ================= Μηχανή εκτέλεσης βήμα-βήμα (κλήσεις, πλαίσια μνήμης, αναφορές) ================= */
function ib6Recorder(map) {
  const fr = [], steps = []; let out = "", hot = new Set();
  const S = {
    push(t, c) { fr.push({ t, c, v: [] }); return fr.length - 1; },
    pop() { fr.pop(); },
    find(fi, n) { return fr[fi].v.find(e => e.n === n); },
    set(fi, n, val, tag) { let e = S.find(fi, n); if (!e) { e = { n, tag }; fr[fi].v.push(e); } if (tag !== undefined) e.tag = tag; e.val = val; hot.add(fi + ":" + n); },
    ref(fi, n, tfi, tn, tag) { fr[fi].v.push({ n, ref: [tfi, tn], tag: tag || ("αναφορά → " + tn) }); hot.add(fi + ":" + n); },
    res(fi, n) { let e = S.find(fi, n); while (e && e.ref) e = S.find(e.ref[0], e.ref[1]); return e; },
    get(fi, n) { return S.res(fi, n).val; },
    as(fi, n, val) { const e = S.find(fi, n); if (e.ref) { const t = S.res(fi, n); t.val = val; hot.add(fi + ":" + n); let x = e; while (x.ref) { hot.add(x.ref[0] + ":" + x.ref[1]); x = S.find(x.ref[0], x.ref[1]); } } else { e.val = val; hot.add(fi + ":" + n); } },
    setEl(fi, n, i, val) { const t = S.res(fi, n); t.val = t.val.slice(); t.val[i] = val; hot.add(fi + ":" + n); let e = S.find(fi, n); while (e.ref) { hot.add(e.ref[0] + ":" + e.ref[1]); e = S.find(e.ref[0], e.ref[1]); } },
    out(s) { out += s; },
    step(tag, msg) {
      steps.push({ ln: map[tag] || 0, msg, out, fr: fr.map((f, fi) => ({ t: f.t, c: f.c, vars: f.v.map(e => { const r = S.res(fi, e.n); return [e.n, r ? (Array.isArray(r.val) ? r.val.slice() : r.val) : "?", e.tag || "", hot.has(fi + ":" + e.n)]; }) })) });
      hot = new Set();
    },
    steps
  };
  return S;
}
function ib6Runner(box, progs, opt = {}) {
  const sel = progs.length > 1 ? `<label>Πρόγραμμα: <select class="ib6p">${progs.map((p, i) => `<option value="${i}">${p.name}</option>`).join("")}</select></label>` : "";
  box.innerHTML = `<div class="wctl">${sel}<span class="ib6in" style="display:contents"></span></div>
    <div class="wctl"><button class="btn primary ib6st">▶ Βήμα</button><button class="btn ghost ib6bk">◀ Πίσω</button><button class="btn ghost ib6pl">⏩ Αυτόματα</button><button class="btn ghost ib6rs">↺ Από την αρχή</button><span class="muted small ib6cnt"></span></div>
    <div class="ib6grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr));gap:12px;align-items:start">
      <div class="ib6code" style="min-width:0"></div>
      <div style="min-width:0"><div class="ib6msg wout" style="margin:0 0 8px;min-height:44px"></div><div class="ib6fr" style="display:flex;flex-wrap:wrap;gap:8px"></div><div class="ib6con"></div></div>
    </div>`;
  if (!document.getElementById("ib6css")) { const st = document.createElement("style"); st.id = "ib6css"; st.textContent = ".ib6in label{font-weight:600}.ib6in input[type=number]{width:62px}.ib6in input[type=text]{width:140px;max-width:100%}"; document.head.appendChild(st); }
  let P, steps = [], k = 0, timer = null, lines = [];
  const pi = () => progs.length > 1 ? +$(".ib6p", box).value : 0;
  function inputs() {
    P = progs[pi()];
    $(".ib6in", box).innerHTML = (P.inputs || []).map(f => f.type === "chk" ? `<label><input type="checkbox" data-k="${f.k}"${f.v ? " checked" : ""}> ${f.label}</label>`
      : f.type === "sel" ? `<label>${f.label} <select data-k="${f.k}">${f.opts.map((o, i) => `<option value="${i}"${i === f.v ? " selected" : ""}>${o}</option>`).join("")}</select></label>`
      : `<label>${f.label} <input type="${f.type === "text" ? "text" : "number"}" data-k="${f.k}" value="${f.v}"${f.min !== undefined ? ` min="${f.min}"` : ""}${f.max !== undefined ? ` max="${f.max}"` : ""}></label>`).join("") + (P.note ? `<span class="muted small">${P.note}</span>` : "");
    box.querySelectorAll(".ib6in [data-k]").forEach(e => e.oninput = e.onchange = build);
    build();
  }
  function params() {
    const p = {};
    (P.inputs || []).forEach(f => { const e = box.querySelector(`.ib6in [data-k="${f.k}"]`); let v = f.type === "chk" ? e.checked : f.type === "sel" ? +e.value : f.type === "text" ? e.value : Math.round(+e.value || 0);
      if (f.type !== "chk" && f.type !== "sel" && f.type !== "text") { if (f.min !== undefined) v = Math.max(f.min, v); if (f.max !== undefined) v = Math.min(f.max, v); } p[f.k] = v; });
    return p;
  }
  function build() {
    stop(); const p = params(), T = ib6Tags(P.code(p)); lines = CPPlines(T.src);
    const S = ib6Recorder(T.map); try { P.sim(p, S); } catch (e) { S.step("", "⚠ " + e.message); }
    steps = S.steps; k = 0; draw();
  }
  function draw() {
    const st = steps[k] || { ln: 0, fr: [], out: "", msg: "" };
    $(".ib6code", box).innerHTML = `<div class="cppbox sm"><div class="cpptitle">${P.file || "program.cpp"}</div><pre class="cpp"><code>${lines.map((l, j) => `<span class="cl${j + 1 === st.ln ? " on" : ""}"><i>${j + 1}</i>${l || " "}</span>`).join("")}</code></pre></div>`;
    $(".ib6msg", box).innerHTML = `<b>Βήμα ${k + 1}/${steps.length}.</b> ${st.msg || ""}`;
    $(".ib6fr", box).innerHTML = st.fr.map(f => ib6Box({ t: f.t, c: f.c, vars: f.vars.map(([n, v, tag, hot]) => [n, v, tag, hot]) })).join("");
    $(".ib6con", box).innerHTML = OUT(st.out === "" ? " " : st.out.replace(/\n$/, ""));
    $(".ib6cnt", box).textContent = k === steps.length - 1 ? "✔ τέλος εκτέλεσης" : "";
  }
  function stop() { if (timer) { clearTimeout(timer); timer = null; $(".ib6pl", box).textContent = "⏩ Αυτόματα"; } }
  function tick() { if (!box.isConnected) return stop(); if (k < steps.length - 1) { k++; draw(); timer = setTimeout(tick, 900); } else stop(); }
  $(".ib6st", box).onclick = () => { stop(); if (k < steps.length - 1) { k++; draw(); } };
  $(".ib6bk", box).onclick = () => { stop(); if (k > 0) { k--; draw(); } };
  $(".ib6rs", box).onclick = () => { stop(); k = 0; draw(); };
  $(".ib6pl", box).onclick = () => { if (timer) return stop(); if (k >= steps.length - 1) k = 0; $(".ib6pl", box).textContent = "⏸ Παύση"; draw(); timer = setTimeout(tick, 700); };
  if (progs.length > 1) $(".ib6p", box).onchange = inputs;
  inputs();
}

/* ---------- προγράμματα για τον «εκτελεστή» ---------- */
const IB6_MAX = {
  name: "max_num (Παράδειγμα 4.1)", file: "max_num.cpp",
  inputs: [{ k: "a", label: "num1 =", v: 8, min: -99, max: 999 }, { k: "b", label: "num2 =", v: 13, min: -99, max: 999 }],
  code: () => `#include <iostream>
using namespace std;
int max_num(int a, int b) {   @@h
    if (a > b)   @@if
        return a;   @@ra
    return b;   @@rb
}
int main() {   @@m
    int num1, num2;   @@d
    cin >> num1 >> num2;   @@cin
    cout << max_num(num1, num2);   @@call
    return 0;   @@end
}`,
  sim(p, S) {
    const m = S.push("main", "main"); S.step("m", "Η εκτέλεση ξεκινά <b>πάντα</b> από τη main — οι ορισμοί συναρτήσεων πάνω από αυτήν δεν εκτελούνται μέχρι να κληθούν.");
    S.set(m, "num1", "?"); S.set(m, "num2", "?"); S.step("d", "Δήλωση των τοπικών μεταβλητών της main.");
    S.as(m, "num1", p.a); S.as(m, "num2", p.b); S.step("cin", `Είσοδος: num1 = ${p.a}, num2 = ${p.b}.`);
    S.step("call", "Κλήση <code>max_num(num1, num2)</code>: οι <b>πραγματικές</b> παράμετροι αντιγράφονται με τη σειρά στις <b>τυπικές</b> a, b.");
    const f = S.push("max_num", "fn"); S.set(f, "a", p.a, "τιμής"); S.set(f, "b", p.b, "τιμής"); S.step("h", `Μπαίνουμε στη συνάρτηση: a = ${p.a}, b = ${p.b}.`);
    const c = p.a > p.b; S.step("if", `Απόφαση: ${p.a} &gt; ${p.b} → <b>${c ? "T" : "F"}</b>`);
    const r = c ? p.a : p.b; S.step(c ? "ra" : "rb", `<code>return ${c ? "a" : "b"};</code> → επιστρέφει <b>${r}</b> και η συνάρτηση <b>τερματίζει</b>${c ? " (το <code>return b</code> δεν εκτελείται)" : ""}.`);
    S.pop(); S.out(String(r)); S.step("call", `Πίσω στη main: η τιμή ${r} αντικαθιστά την κλήση και εμφανίζεται. Οι a, b «χάθηκαν».`);
    S.step("end", "Τέλος προγράμματος.");
  }
};
const IB6_FACT = {
  name: "x = y! + z! (Παράδειγμα 4.2)", file: "factorial.cpp",
  inputs: [{ k: "y", label: "y =", v: 3, min: 0, max: 7 }, { k: "z", label: "z =", v: 4, min: 0, max: 7 }],
  code: () => `#include <iostream>
using namespace std;
int factorial(int N) {   @@h
    int ans = 1;   @@a
    for (int i = 1; i <= N; i++)   @@for
        ans *= i;   @@mul
    return ans;   @@ret
}
int main() {   @@m
    int y, z;   @@d
    cin >> y >> z;   @@cin
    int x = factorial(y) + factorial(z);   @@call
    cout << x << endl;   @@out
    return 0;   @@end
}`,
  sim(p, S) {
    const m = S.push("main", "main"); S.step("m", "Ξεκινά η main."); S.set(m, "y", "?"); S.set(m, "z", "?"); S.step("d", "Δήλωση y, z.");
    S.as(m, "y", p.y); S.as(m, "z", p.z); S.step("cin", `Είσοδος: y = ${p.y}, z = ${p.z}.`);
    const res = [];
    for (const [nm, v] of [["y", p.y], ["z", p.z]]) {
      S.step("call", `Κλήση <code>factorial(${nm})</code> με πραγματική παράμετρο ${nm} = ${v}.`);
      const f = S.push(`factorial(${v})`, "fn"); S.set(f, "N", v, "τιμής"); S.step("h", `Τυπική παράμετρος N = ${v}.`);
      S.set(f, "ans", 1, "τοπική"); S.step("a", "Τοπική μεταβλητή ans = 1.");
      let ans = 1;
      for (let i = 1; i <= v; i++) { S.set(f, "i", i, "τοπική"); S.step("for", `i = ${i}: ${i} &lt;= ${v} → T`); ans *= i; S.as(f, "ans", ans); S.step("mul", `ans = ans * ${i} = ${ans}`); }
      S.set(f, "i", v + 1, "τοπική"); S.step("for", `i = ${v + 1}: ${v + 1} &lt;= ${v} → F, τέλος βρόχου.`);
      S.step("ret", `return ans → επιστρέφει <b>${ans}</b>.`); S.pop(); res.push(ans);
    }
    const x = res[0] + res[1]; S.set(m, "x", x); S.step("call", `x = ${res[0]} + ${res[1]} = ${x}`);
    S.out(x + "\n"); S.step("out", `Εμφανίζεται ${x}.`); S.step("end", "Τέλος.");
  }
};
const IB6_HUND = {
  name: "Πολλά return (hundreds)", file: "hundreds.cpp",
  inputs: [{ k: "x", label: "x =", v: 101, min: 0, max: 9999 }],
  code: p => `#include <iostream>
using namespace std;
int hundreds(int x) {   @@h
    if (x / 100 > 1)   @@i1
        return 1;   @@r1
    if (x % 100 == 1)   @@i2
        return 0;   @@r2
    return -1;   @@r3
}
int main() {   @@m
    cout << hundreds(${p.x});   @@call
    return 0;   @@end
}`,
  sim(p, S) {
    const m = S.push("main", "main"); S.step("m", "Ξεκινά η main."); S.step("call", `Κλήση hundreds(${p.x}).`);
    const f = S.push("hundreds", "fn"); S.set(f, "x", p.x, "τιμής"); S.step("h", `x = ${p.x}`);
    const q = ib6Div(p.x, 100), c1 = q > 1; S.step("i1", `x / 100 = ${q} (ακέραια διαίρεση) · ${q} &gt; 1 → <b>${c1 ? "T" : "F"}</b>`);
    let r;
    if (c1) { r = 1; S.step("r1", "return 1 → η συνάρτηση τερματίζει εδώ."); }
    else { const md = p.x % 100, c2 = md === 1; S.step("i2", `x % 100 = ${md} · ${md} == 1 → <b>${c2 ? "T" : "F"}</b>`);
      if (c2) { r = 0; S.step("r2", "return 0 → τέλος συνάρτησης."); } else { r = -1; S.step("r3", "return -1."); } }
    S.pop(); S.out(String(r)); S.step("call", `Εμφανίζεται ${r}.`); S.step("end", "Τέλος.");
  }
};
const IB6_DIG = {
  name: "Καθολικός μετρητής cnt (sum_of_digits)", file: "digits.cpp",
  inputs: [{ k: "s", label: "είσοδος:", v: "25 103 7 0", type: "text" }], note: "αριθμοί με κενό, τελευταίος το 0",
  code: () => `#include <iostream>
using namespace std;
int cnt = 0;   @@g
int sum_of_digits(int x) {   @@h
    int temp = x, sum = 0;   @@loc
    while (temp > 0) {   @@wh
        sum += temp % 10;   @@add
        temp /= 10;   @@div
    }
    cnt++;   @@cnt
    return sum;   @@ret
}
int main() {   @@m
    int num, total = 0;   @@d
    cin >> num;   @@cin
    while (num != 0) {   @@w
        total += sum_of_digits(num);   @@call
        cin >> num;   @@cin2
    }
    cout << total << " " << cnt;   @@out
    return 0;   @@end
}`,
  sim(p, S) {
    let nums = p.s.trim().split(/[\s,]+/).map(x => Math.abs(parseInt(x, 10))).filter(x => !isNaN(x)).slice(0, 6); if (!nums.includes(0)) nums.push(0);
    const g = S.push("Καθολικές", "glob"); S.set(g, "cnt", 0); S.step("g", "Η καθολική <code>cnt</code> δημιουργείται πριν ξεκινήσει η main και ζει σε όλη την εκτέλεση.");
    const m = S.push("main", "main"); S.set(m, "num", "?"); S.set(m, "total", 0); S.step("d", "Τοπικές της main: num, total = 0.");
    let q = 0, num = nums[q++]; S.as(m, "num", num); S.step("cin", `Είσοδος: num = ${num}`);
    let total = 0;
    while (true) {
      S.step("w", `${num} != 0 → <b>${num !== 0 ? "T" : "F"}</b>`); if (num === 0) break;
      S.step("call", `Κλήση sum_of_digits(${num}).`);
      const f = S.push(`sum_of_digits(${num})`, "fn"); S.set(f, "x", num, "τιμής"); S.set(f, "temp", num, "τοπική"); S.set(f, "sum", 0, "τοπική"); S.step("loc", "Νέες τοπικές temp, sum σε <b>κάθε</b> κλήση.");
      let t = num, s = 0;
      while (t > 0) { S.step("wh", `${t} &gt; 0 → T`); s += t % 10; S.as(f, "sum", s); S.step("add", `sum += ${t % 10} → ${s}`); t = Math.trunc(t / 10); S.as(f, "temp", t); S.step("div", `temp = ${t}`); }
      S.step("wh", "0 &gt; 0 → F"); const c = S.get(g, "cnt") + 1; S.as(g, "cnt", c); S.step("cnt", `cnt++ → αλλάζει η <b>καθολική</b> cnt = ${c}`);
      S.step("ret", `return ${s}`); S.pop(); total += s; S.as(m, "total", total); S.step("call", `total = ${total}`);
      num = nums[q++]; S.as(m, "num", num); S.step("cin2", `Είσοδος: num = ${num}`);
    }
    S.out(total + " " + S.get(g, "cnt")); S.step("out", "Η main «βλέπει» την καθολική cnt."); S.step("end", "Τέλος.");
  }
};
const IB6_SHAD = {
  name: "Ίδιο όνομα: τοπική κρύβει καθολική", file: "scope.cpp",
  inputs: [{ k: "x0", label: "καθολική x =", v: 10, min: -50, max: 99 }, { k: "l", label: "τοπική x της f =", v: 3, min: -50, max: 99 }],
  code: p => `#include <iostream>
using namespace std;
int x = ${p.x0};   @@g
void f() {   @@fh
    int x = ${p.l};   @@fl
    x++;   @@finc
    cout << x << " ";   @@fout
}
void g() {   @@gh
    x++;   @@ginc
    cout << x << " ";   @@gout
}
int main() {   @@m
    f();   @@c1
    g();   @@c2
    f();   @@c3
    cout << x << endl;   @@out
    return 0;   @@end
}`,
  sim(p, S) {
    const g = S.push("Καθολικές", "glob"); S.set(g, "x", p.x0); S.step("g", "Καθολική x."); const m = S.push("main", "main"); S.step("m", "Ξεκινά η main (δεν έχει δικές της μεταβλητές).");
    const callF = tag => { S.step(tag, "Κλήση f()."); const f = S.push("f()", "fn"); S.set(f, "x", p.l, "τοπική"); S.step("fl", `Η f δηλώνει <b>δική της</b> x = ${p.l}: μέσα στην f το όνομα x δείχνει την τοπική.`);
      S.as(f, "x", p.l + 1); S.step("finc", `Τοπική x = ${p.l + 1} — η καθολική δεν αλλάζει.`); S.out((p.l + 1) + " "); S.step("fout", `Εμφανίζεται ${p.l + 1}.`); S.pop(); };
    callF("c1");
    S.step("c2", "Κλήση g()."); const gg = S.push("g()", "fn"); S.step("gh", "Η g δεν έχει τοπική x."); const nx = S.get(g, "x") + 1; S.as(g, "x", nx); S.step("ginc", `x++ αλλάζει την <b>καθολική</b>: x = ${nx}`); S.out(nx + " "); S.step("gout", `Εμφανίζεται ${nx}.`); S.pop();
    callF("c3");
    S.out(nx + "\n"); S.step("out", `Η main εμφανίζει την καθολική x = ${nx}.`); S.step("end", "Τέλος.");
  }
};
const IB6_PERMS = [["x", "y", "z"], ["x", "z", "y"], ["y", "x", "z"], ["y", "z", "x"], ["z", "x", "y"], ["z", "y", "x"]];
const IB6_CHG = {
  name: "change(a, b, c): τιμή ή αναφορά;", file: "change.cpp",
  inputs: [{ k: "ra", label: "a με &", type: "chk", v: false }, { k: "rb", label: "b με &", type: "chk", v: true }, { k: "rc", label: "c με &", type: "chk", v: true },
    { k: "x", label: "x =", v: 2, min: -9, max: 99 }, { k: "y", label: "y =", v: 1, min: -9, max: 99 }, { k: "z", label: "z =", v: 3, min: -9, max: 99 },
    { k: "o", label: "κλήση:", type: "sel", opts: IB6_PERMS.map(q => `change(${q.join(", ")})`), v: 5 }],
  code: p => { const P = IB6_PERMS[p.o], r = f => f ? "&" : "";
    return `#include <iostream>
using namespace std;
void change(int ${r(p.ra)}a, int ${r(p.rb)}b, int ${r(p.rc)}c) {   @@h
    a += 4;   @@a
    b += 5;   @@b
    c += 6;   @@c
    cout << a << " " << b << " " << c << endl;   @@fo
}
int main() {   @@m
    int x = ${p.x}, y = ${p.y}, z = ${p.z};   @@d
    change(${P.join(", ")});   @@call
    cout << x << " " << y << " " << z << endl;   @@out
    return 0;   @@end
}`; },
  sim(p, S) {
    const P = IB6_PERMS[p.o], m = S.push("main", "main"); S.step("m", "Ξεκινά η main.");
    S.set(m, "x", p.x); S.set(m, "y", p.y); S.set(m, "z", p.z); S.step("d", "Αρχικές τιμές.");
    S.step("call", `Κλήση <code>change(${P.join(", ")})</code>: η αντιστοίχιση γίνεται <b>κατά θέση</b> — a ← ${P[0]}, b ← ${P[1]}, c ← ${P[2]}.`);
    const f = S.push("change", "fn"), fl = [p.ra, p.rb, p.rc];
    ["a", "b", "c"].forEach((n, i) => fl[i] ? S.ref(f, n, m, P[i], "αναφορά → " + P[i]) : S.set(f, n, S.get(m, P[i]), "τιμής (αντίγραφο " + P[i] + ")"));
    S.step("h", "Παράμετροι με <b>&amp;</b> = ψευδώνυμα των μεταβλητών της main· χωρίς &amp; = αντίγραφα.");
    [["a", 4], ["b", 5], ["c", 6]].forEach(([n, d], i) => { const v = S.get(f, n) + d; S.as(f, n, v); S.step(n, `${n} += ${d} → ${v}` + (fl[i] ? ` — αλλάζει και η <b>${P[i]}</b> της main!` : " — αλλάζει μόνο το αντίγραφο.")); });
    S.out(`${S.get(f, "a")} ${S.get(f, "b")} ${S.get(f, "c")}\n`); S.step("fo", "Εμφάνιση μέσα στη συνάρτηση."); S.pop();
    S.out(`${S.get(m, "x")} ${S.get(m, "y")} ${S.get(m, "z")}\n`); S.step("out", "Πίσω στη main: έχουν αλλάξει μόνο όσες μεταβλητές πέρασαν σε παράμετρο αναφοράς."); S.step("end", "Τέλος.");
  }
};
const IB6_CHECK = {
  name: "check(a, &b) (Παράδειγμα 4.6)", file: "check.cpp",
  inputs: [{ k: "x", label: "x =", v: 3, min: -20, max: 99 }, { k: "y", label: "y =", v: 2, min: -20, max: 99 }],
  code: p => `#include <iostream>
using namespace std;
int check(int a, int &b) {   @@h
    b += 2;   @@b
    if (a > b)   @@if
        return a;   @@ra
    return a + b;   @@rb
}
int main() {   @@m
    int x = ${p.x}, y = ${p.y};   @@d
    if (x > y)   @@mif
        cout << check(x, y) << endl;   @@c1
    else
        cout << check(y, x) << endl;   @@c2
    cout << x << " " << y << endl;   @@out
    return 0;   @@end
}`,
  sim(p, S) {
    const m = S.push("main", "main"); S.step("m", "Ξεκινά η main."); S.set(m, "x", p.x); S.set(m, "y", p.y); S.step("d", "Αρχικές τιμές.");
    const c = p.x > p.y; S.step("mif", `${p.x} &gt; ${p.y} → <b>${c ? "T" : "F"}</b>`);
    const [va, vb, tag] = c ? ["x", "y", "c1"] : ["y", "x", "c2"];
    S.step(tag, `Κλήση check(${va}, ${vb}): a ← αντίγραφο της ${va}, b = ψευδώνυμο της ${vb}.`);
    const f = S.push("check", "fn"); S.set(f, "a", S.get(m, va), "τιμής"); S.ref(f, "b", m, vb); S.step("h", "Παράμετροι συνάρτησης.");
    const b = S.get(f, "b") + 2; S.as(f, "b", b); S.step("b", `b += 2 → ${b} — αλλάζει και η ${vb} της main.`);
    const a = S.get(f, "a"), cc = a > b; S.step("if", `${a} &gt; ${b} → <b>${cc ? "T" : "F"}</b>`);
    const r = cc ? a : a + b; S.step(cc ? "ra" : "rb", `επιστρέφει <b>${r}</b>`); S.pop();
    S.out(r + "\n"); S.step(tag, `Εμφανίζεται ${r}.`); S.out(`${S.get(m, "x")} ${S.get(m, "y")}\n`); S.step("out", "Τιμές της main μετά την κλήση."); S.step("end", "Τέλος.");
  }
};
const IB6_SWAP = {
  name: "swap(&a, &b) (Παράδειγμα 4.4)", file: "swap.cpp",
  inputs: [{ k: "x", label: "x =", v: 13, min: -99, max: 999 }, { k: "y", label: "y =", v: 19, min: -99, max: 999 }, { k: "byv", label: "χωρίς & (λάθος εκδοχή)", type: "chk", v: false }],
  code: p => `#include <iostream>
using namespace std;
void swap(int ${p.byv ? "" : "&"}a, int ${p.byv ? "" : "&"}b) {   @@h
    int temp;   @@t
    temp = a;   @@t1
    a = b;   @@t2
    b = temp;   @@t3
}
int main() {   @@m
    int x = ${p.x}, y = ${p.y};   @@d
    swap(x, y);   @@call
    cout << "x=" << x << endl;   @@o1
    cout << "y=" << y << endl;   @@o2
    return 0;   @@end
}`,
  sim(p, S) {
    const m = S.push("main", "main"); S.step("m", "Ξεκινά η main."); S.set(m, "x", p.x); S.set(m, "y", p.y); S.step("d", "Αρχικές τιμές.");
    S.step("call", "Κλήση swap(x, y)."); const f = S.push("swap", "fn");
    if (p.byv) { S.set(f, "a", p.x, "τιμής"); S.set(f, "b", p.y, "τιμής"); } else { S.ref(f, "a", m, "x"); S.ref(f, "b", m, "y"); }
    S.step("h", p.byv ? "Χωρίς &amp;: οι a, b είναι <b>αντίγραφα</b>." : "Οι a, b είναι ψευδώνυμα των x, y.");
    S.set(f, "temp", "?", "τοπική"); S.step("t", "Τοπική temp."); S.as(f, "temp", S.get(f, "a")); S.step("t1", `temp = ${S.get(f, "temp")}`);
    S.as(f, "a", S.get(f, "b")); S.step("t2", `a = ${S.get(f, "a")}`); S.as(f, "b", S.get(f, "temp")); S.step("t3", `b = ${S.get(f, "b")}`); S.pop();
    S.out(`x=${S.get(m, "x")}\n`); S.step("o1", p.byv ? "Οι x, y <b>δεν</b> άλλαξαν — η αντιμετάθεση έγινε στα αντίγραφα!" : "Οι x, y αντιμετατέθηκαν."); S.out(`y=${S.get(m, "y")}\n`); S.step("o2", ""); S.step("end", "Τέλος.");
  }
};
const ib6ArrIn = (s, n0 = 5) => { let a = String(s).trim().split(/[\s,]+/).map(x => parseInt(x, 10)).filter(x => !isNaN(x)).map(x => Math.max(-99, Math.min(99, x))).slice(0, 8); while (a.length < 3) a.push(a.length + 1); return a; };
const IB6_ARR = {
  name: "Πίνακας ως παράμετρος: change(arr, k)", file: "array_param.cpp",
  inputs: [{ k: "A", label: "A =", v: "1 2 3 4 5", type: "text" }, { k: "k", label: "k =", v: 10, min: -20, max: 50 }],
  code: p => { const A = ib6ArrIn(p.A); return `#include <iostream>
using namespace std;
const int N = ${A.length};
void change(int arr[], int k) {   @@h
    for (int i = 0; i < N; i++)   @@for
        if (i % 2 == 0)   @@if
            arr[i] += k;   @@add
    k = 0;   @@k0
}
int main() {   @@m
    int A[N] = {${A.join(", ")}};   @@d
    int k = ${p.k};   @@dk
    change(A, k);   @@call
    for (int i = 0; i < N; i++)   @@pf
        cout << A[i] << " ";   @@po
    cout << k << endl;   @@out
    return 0;   @@end
}`; },
  sim(p, S) {
    const A = ib6ArrIn(p.A), N = A.length, m = S.push("main", "main"); S.step("m", "Ξεκινά η main."); S.set(m, "A", A.slice()); S.step("d", "Πίνακας A."); S.set(m, "k", p.k); S.step("dk", "Μεταβλητή k.");
    S.step("call", "Κλήση change(A, k): για τον πίνακα περνά η <b>διεύθυνσή</b> του (χωρίς &amp;), για το k ένα αντίγραφο.");
    const f = S.push("change", "fn"); S.ref(f, "arr", m, "A", "→ A (ίδιος πίνακας)"); S.set(f, "k", p.k, "τιμής"); S.step("h", "Η arr είναι ο <b>ίδιος</b> πίνακας με τον A.");
    for (let i = 0; i < N; i++) { S.set(f, "i", i, "τοπική"); S.step("for", `i = ${i}`); const c = i % 2 === 0; S.step("if", `${i} % 2 == 0 → ${c ? "T" : "F"}`);
      if (c) { const v = S.get(f, "arr")[i] + p.k; S.setEl(f, "arr", i, v); S.step("add", `arr[${i}] += ${p.k} → ${v} — αλλάζει ο A[${i}] της main!`); } }
    S.as(f, "k", 0); S.step("k0", "k = 0: αλλάζει μόνο το αντίγραφο."); S.pop();
    const AA = S.get(m, "A"); let o = ""; for (let i = 0; i < N; i++) { o += AA[i] + " "; } S.step("pf", "Εμφάνιση του A."); S.out(o); S.step("po", "Ο πίνακας έχει αλλάξει."); S.out(S.get(m, "k") + "\n"); S.step("out", `Το k της main παραμένει ${p.k}.`); S.step("end", "Τέλος.");
  }
};
const IB6_POS = {
  name: "Θέση μέγιστου: posMax(a, n)", file: "posmax.cpp",
  inputs: [{ k: "A", label: "A =", v: "4 9 2 9 7 1", type: "text" }, { k: "ge", label: "με >= (όχι >)", type: "chk", v: true }],
  code: p => { const A = ib6ArrIn(p.A); return `#include <iostream>
using namespace std;
int posMax(int a[], int n) {   @@h
    int p = 0;   @@p
    for (int i = 1; i < n; i++)   @@for
        if (a[i] ${p.ge ? ">=" : ">"} a[p])   @@if
            p = i;   @@set
    return p;   @@ret
}
int main() {   @@m
    int A[${A.length}] = {${A.join(", ")}};   @@d
    int p = posMax(A, ${A.length});   @@call
    cout << p << " " << A[p] << endl;   @@out
    return 0;   @@end
}`; },
  sim(p, S) {
    const A = ib6ArrIn(p.A), n = A.length, m = S.push("main", "main"); S.step("m", "Ξεκινά η main."); S.set(m, "A", A.slice()); S.step("d", "Πίνακας A.");
    S.step("call", `Κλήση posMax(A, ${n}).`); const f = S.push("posMax", "fn"); S.ref(f, "a", m, "A", "→ A"); S.set(f, "n", n, "τιμής"); S.step("h", "Παράμετροι.");
    let q = 0; S.set(f, "p", 0, "τοπική (άλλη από την p της main)"); S.step("p", "p = 0");
    for (let i = 1; i < n; i++) { S.set(f, "i", i, "τοπική"); S.step("for", `i = ${i}`); const c = p.ge ? A[i] >= A[q] : A[i] > A[q]; S.step("if", `a[${i}] = ${A[i]} ${p.ge ? "&gt;=" : "&gt;"} a[${q}] = ${A[q]} → ${c ? "T" : "F"}`); if (c) { q = i; S.as(f, "p", q); S.step("set", `p = ${i}`); } }
    S.step("ret", `return ${q}`); S.pop(); S.set(m, "p", q); S.step("call", `Η p της main = ${q}.`); S.out(`${q} ${A[q]}\n`); S.step("out", p.ge ? "Με &gt;= κρατάμε την <b>τελευταία</b> θέση του μέγιστου." : "Με &gt; κρατάμε την <b>πρώτη</b> θέση του μέγιστου."); S.step("end", "Τέλος.");
  }
};

/* ================= Στοίβα / Ουρά ================= */
function ib6DSWidget(box, queue) {
  const N = 6;
  box.innerHTML = `<div class="wctl"><label>X = <input type="number" class="ib6x" value="10" style="width:70px"></label>
    <button class="btn primary ib6push">Push(X)</button><button class="btn ghost ib6pop">Pop()</button><button class="btn ghost ib6top">${queue ? "Front()" : "Top()"}</button><button class="btn ghost ib6size">Size()</button><button class="btn ghost ib6emp">Empty()</button><button class="btn ghost ib6rst">↺</button></div>
    <div class="ib6vis" style="overflow-x:auto;padding:4px 0"></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:10px;margin-top:8px"><div class="ib6code"></div><div class="ib6con"></div></div>
    <p class="muted small">Υλοποίηση με πίνακα ${N} θέσεων όπως στο βιβλίο (${queue ? "δείκτες front, back" : "δείκτης top"}). Δίπλα φαίνεται η ισοδύναμη εντολή της STL.</p>`;
  let arr, top, front, back, log;
  const reset = () => { arr = Array(N).fill(""); top = -1; front = 0; back = 0; log = []; draw(null); };
  function draw(last) {
    const cells = arr.map((v, i) => { const live = queue ? (i >= front && i < back) : i <= top; const mark = queue ? [i === front ? "front" : "", i === back ? "back" : ""].filter(Boolean).join(", ") : (i === top ? "top" : "");
      if (!queue) return `<div style="display:flex;align-items:center;gap:8px"><small style="color:#7a879c;width:26px;text-align:right">[${i}]</small><div style="width:56px;height:34px;display:flex;align-items:center;justify-content:center;border:2px solid ${live ? "#6F42C1" : "#cbd5e1"};border-radius:8px;background:${live ? (i === top ? "#fff4df" : "#fff") : "#f3f5f9"};color:${live ? "#15233f" : "#a0aabb"};font:700 15px 'SF Mono',Consolas,monospace">${v === "" ? "" : v}</div><small style="color:#C77A0A;font-weight:800">${mark ? "← " + mark : ""}</small></div>`;
      return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px"><div style="width:52px;height:40px;display:flex;align-items:center;justify-content:center;border:2px solid ${live ? (queue ? "#0F6FD1" : "#6F42C1") : "#cbd5e1"};border-radius:8px;background:${live ? "#fff" : "#f3f5f9"};color:${live ? "#15233f" : "#a0aabb"};font:700 15px 'SF Mono',Consolas,monospace;transition:.2s">${v === "" ? "" : v}</div><small style="color:#7a879c">[${i}]</small><small style="color:#C77A0A;font-weight:800;min-height:1.2em">${mark}</small></div>`; });
    const vis = queue ? `<div style="display:flex;gap:6px;align-items:flex-start">${cells.join("")}</div>`
      : `<div style="display:flex;flex-direction:column-reverse;gap:4px;align-items:flex-start;border-left:3px solid #cbd5e1;border-bottom:3px solid #cbd5e1;padding:4px 6px">${cells.join("")}</div>`;
    const ix = queue ? `front = <b>${front}</b> · back = <b>${back}</b> · Size() = back − front = <b>${back - front}</b>` : `top = <b>${top}</b> · Size() = top + 1 = <b>${top + 1}</b>`;
    $(".ib6vis", box).innerHTML = `<div style="display:flex;gap:18px;align-items:flex-end;flex-wrap:wrap">${vis}<div class="wout" style="margin:0">${ix}</div></div>`;
    $(".ib6code", box).innerHTML = last ? CPP(last.code, { title: "τι εκτελέστηκε", small: true, nonum: true }) : CPP(queue ? "int front = 0, back = 0;\n// queue<int> Q;   (STL)" : "int top = -1;\n// stack<int> S;   (STL)", { title: "αρχικά", small: true, nonum: true });
    $(".ib6con", box).innerHTML = OUT(log.slice(-7).join("\n") || " ");
  }
  const say = (code, msg) => { if (msg !== undefined) log.push(msg); draw({ code }); };
  $(".ib6push", box).onclick = () => { const X = Math.round(+$(".ib6x", box).value || 0);
    if (queue) { if (back === N) return say(`if (back == N) cout << "Queue is full";\n// STL: Q.push(${X}); (δεν γεμίζει ποτέ)`, "Queue is full"); arr[back] = X; back++; say(`arr[back] = ${X}; back++;\n// STL: Q.push(${X});`, "Pushed item " + X); }
    else { if (top === N - 1) return say(`if (top == N-1) cout << "Stack is full";\n// STL: S.push(${X}); (δεν γεμίζει ποτέ)`, "Stack is full"); top++; arr[top] = X; say(`top++; arr[top] = ${X};\n// STL: S.push(${X});`, "Pushed item " + X); }
    $(".ib6x", box).value = X + 10; };
  $(".ib6pop", box).onclick = () => { if (queue) { if (front === back) return say(`if (Empty()) cout << "Queue is empty";`, "Queue is empty"); arr[front] = 0; front++; say("arr[front] = 0; front++;\n// STL: Q.pop();"); }
    else { if (top === -1) return say(`if (Empty()) cout << "Stack is empty";`, "Stack is empty"); top--; say("top--;   // το στοιχείο μένει στον πίνακα\n// STL: S.pop();"); } };
  $(".ib6top", box).onclick = () => { if (queue) { if (front === back) return say("// Front() σε άδεια ουρά: σφάλμα!", "(άδεια ουρά)"); say("return arr[front];\n// STL: Q.front()", "Front: " + arr[front]); }
    else { if (top === -1) return say("// Top() σε άδεια στοίβα: σφάλμα!", "(άδεια στοίβα)"); say("return arr[top];\n// STL: S.top()", "Top: " + arr[top]); } };
  $(".ib6size", box).onclick = () => queue ? say("return back - front;\n// STL: Q.size()", "Size: " + (back - front)) : say("return top + 1;\n// STL: S.size()", "Size: " + (top + 1));
  $(".ib6emp", box).onclick = () => { const e = queue ? front === back : top === -1; say(queue ? "return (front == back);\n// STL: Q.empty()" : "return (top == -1);\n// STL: S.empty()", "Empty: " + (e ? "true" : "false")); };
  $(".ib6rst", box).onclick = reset;
  reset();
  [12, 7, 30].forEach(x => { $(".ib6x", box).value = x; $(".ib6push", box).click(); }); $(".ib6x", box).value = 25;
}

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  ib6call(box) { ib6Runner(box, [IB6_MAX, IB6_FACT, IB6_HUND]); },
  ib6scope(box) { ib6Runner(box, [IB6_SHAD, IB6_DIG]); },
  ib6ref(box) { ib6Runner(box, [IB6_CHG, IB6_CHECK, IB6_SWAP]); },
  ib6arr(box) { ib6Runner(box, [IB6_ARR, IB6_POS]); },
  ib6stack(box) { ib6DSWidget(box, false); },
  ib6queue(box) { ib6DSWidget(box, true); }
});

/* ================= Γεννήτριες ================= */
const ib6Prog = body => `#include <iostream>\nusing namespace std;\n${body}`;
var GENS = Object.assign(window.GENS || {}, {
  /* 6.1 — τι επιστρέφει μια συνάρτηση */
  ib6ret: { make() {
    const v = ib6R(0, 2);
    if (v === 0) {
      const D = ib6Pick([10, 100]), T = ib6R(1, 4), M = ib6Pick([3, 5, 7, 10]), K = ib6R(0, M - 1), R1 = ib6R(1, 9), R2 = ib6R(-5, 0), R3 = ib6R(10, 20);
      const f = x => (ib6Div(x, D) > T ? R1 : ib6Mod(x, M) === K ? R2 : R3);
      let xs; do { xs = [ib6R(D, D * 9), ib6R(1, D * 3), ib6R(D, D * 6)]; } while (new Set(xs.map(f)).size < 2 || new Set(xs).size < 3);
      const fn = `int f(int x) {\n    if (x / ${D} > ${T})\n        return ${R1};\n    if (x % ${M} == ${K})\n        return ${R2};\n    return ${R3};\n}`;
      const src = ib6Prog(`${fn}\nint main() {\n    cout << f(${xs[0]}) << " " << f(${xs[1]}) << " " << f(${xs[2]});\n    return 0;\n}`);
      return { level: 2, q: `Με προκαταρκτική εκτέλεση βρείτε τι επιστρέφει η συνάρτηση για κάθε κλήση.${CPP(fn)}`,
        fields: xs.map(x => ({ label: `f(${x}) =`, ans: f(x) })), hint: "Ακέραια διαίρεση <code>/</code>, υπόλοιπο <code>%</code>· το πρώτο <code>return</code> που εκτελείται τερματίζει τη συνάρτηση.",
        sol: ib6Trace(["x", `x/${D}`, `x/${D} &gt; ${T}`, `x%${M}`, `x%${M} == ${K}`, "επιστρέφει"], xs.map(x => { const c1 = ib6Div(x, D) > T; return [x, ib6Div(x, D), c1 ? "T" : "F", c1 ? "" : ib6Mod(x, M), c1 ? "" : (ib6Mod(x, M) === K ? "T" : "F"), f(x)]; })), chk: { src } };
    }
    if (v === 1) {
      const N = ib6R(1000, 99999), k = ib6R(2, 7);
      const f = (n, k) => { let c = 0; while (n > 0) { if (n % 10 > k) c++; n = Math.trunc(n / 10); } return c; };
      const fn = `int count(int n, int k) {\n    int c = 0;\n    while (n > 0) {\n        if (n % 10 > k)\n            c++;\n        n /= 10;\n    }\n    return c;\n}`;
      const src = ib6Prog(`${fn}\nint main() {\n    cout << count(${N}, ${k});\n    return 0;\n}`);
      const ds = String(N).split("").reverse();
      return { level: 2, q: `Τι θα εμφανίσει η εντολή <code>cout &lt;&lt; count(${N}, ${k});</code>;${CPP(fn)}`, fields: [{ label: "Έξοδος:", ans: f(N, k) }],
        hint: "Η συνάρτηση εξετάζει ένα-ένα τα ψηφία του n, από το τελευταίο προς το πρώτο.",
        sol: `Ψηφία (από τις μονάδες): ${ds.join(", ")}. Μεγαλύτερα του ${k}: ${ds.filter(d => +d > k).join(", ") || "κανένα"} → επιστρέφει <b>${f(N, k)}</b>.${OUT(String(f(N, k)))}`, chk: { src } };
    }
    const A = ib6R(2, 9), B = ib6R(1, 30), C = ib6R(2, 6), D = ib6R(1, 9);
    const fn = `int sq(int x) {\n    return x * x;\n}\nint g(int a, int b) {\n    return sq(a) - b;\n}`;
    const res = A * A - B + C * C, r2 = (A * A - B) * D;
    const src = ib6Prog(`${fn}\nint main() {\n    int r = g(${A}, ${B}) + sq(${C});\n    cout << r << " " << g(${A}, ${B}) * ${D};\n    return 0;\n}`);
    return { level: 2, q: `Τι θα εμφανίσει το πρόγραμμα; (σε μία γραμμή)${CPP(`${src}`)}`, fields: [{ label: "Έξοδος:", ans: `${res} ${r2}`, text: true }],
      hint: "Η g καλεί μέσα της τη sq.", sol: `g(${A}, ${B}) = sq(${A}) − ${B} = ${A * A} − ${B} = ${A * A - B}, sq(${C}) = ${C * C}, άρα r = ${res}. Επίσης ${A * A - B} · ${D} = ${r2}.${OUT(`${res} ${r2}`)}`, chk: { src } };
  } },
  /* 6.2 — καθολική ή τοπική */
  ib6glob: { make() {
    const shadow = Math.random() < 0.5, C0 = ib6R(0, 9), D = ib6R(1, 6), M = ib6R(2, 5), L = ib6R(1, 9), A = ib6R(1, 9), B = ib6R(1, 9);
    const fn = `int c = ${C0};\nint f(int x) {\n${shadow ? `    int c = ${L};\n` : ""}    c = c + ${D};\n    return x * ${M} + c;\n}`;
    const src = ib6Prog(`${fn}\nint main() {\n    int a = f(${A});\n    int b = f(${B});\n    cout << a << " " << b << " " << c << endl;\n    return 0;\n}`);
    let a, b, c;
    if (shadow) { a = A * M + L + D; b = B * M + L + D; c = C0; } else { const c1 = C0 + D, c2 = c1 + D; a = A * M + c1; b = B * M + c2; c = c2; }
    const ans = `${a} ${b} ${c}`;
    return { level: 2, q: `Τι θα εμφανίσει το πρόγραμμα; (σε μία γραμμή)${CPP(src)}`, fields: [{ label: "Έξοδος:", ans, text: true }],
      hint: shadow ? "Μέσα στην f δηλώνεται τοπική c με το ίδιο όνομα: ποια c αλλάζει;" : "Η c είναι καθολική: κρατά την τιμή της από κλήση σε κλήση.",
      sol: (shadow ? `Η f έχει <b>τοπική</b> c που ξαναγίνεται ${L} σε κάθε κλήση, άρα c = ${L + D} μέσα στην f κάθε φορά: a = ${A}·${M} + ${L + D} = ${a}, b = ${B}·${M} + ${L + D} = ${b}. Η καθολική c μένει ${C0}.`
        : `Η καθολική c: 1η κλήση c = ${C0} + ${D} = ${C0 + D}, a = ${A}·${M} + ${C0 + D} = ${a}· 2η κλήση c = ${C0 + 2 * D}, b = ${B}·${M} + ${C0 + 2 * D} = ${b}. Η main εμφανίζει την καθολική c = ${c}.`) + OUT(ans), chk: { src } };
  } },
  /* 6.3 — τιμής / αναφοράς */
  ib6byref: { make() {
    let fl; do { fl = [0, 1, 2].map(() => Math.random() < 0.5); } while (fl.every(Boolean) || !fl.some(Boolean));
    const inc = ib6Shuf([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), init = [ib6R(1, 9), ib6R(1, 9), ib6R(1, 9)], P1 = ib6Pick(IB6_PERMS), P2 = ib6Pick(IB6_PERMS);
    const nm = ["a", "b", "c"], hdr = nm.map((n, i) => `int ${fl[i] ? "&" : ""}${n}`).join(", ");
    const src = ib6Prog(`void change(${hdr}) {\n    a += ${inc[0]};\n    b += ${inc[1]};\n    c += ${inc[2]};\n    cout << a << " " << b << " " << c << endl;\n}\nint main() {\n    int x = ${init[0]}, y = ${init[1]}, z = ${init[2]};\n    change(${P1.join(", ")});\n    cout << x << " " << y << " " << z << endl;\n    change(${P2.join(", ")});\n    cout << x << " " << y << " " << z << endl;\n    return 0;\n}`);
    const V = { x: init[0], y: init[1], z: init[2] }, lines = [], expl = [];
    for (const P of [P1, P2]) { const loc = P.map((v, i) => V[v] + inc[i]); P.forEach((v, i) => { if (fl[i]) V[v] = loc[i]; });
      lines.push(loc.join(" ")); lines.push(`${V.x} ${V.y} ${V.z}`);
      expl.push(`<code>change(${P.join(", ")})</code>: ${nm.map((n, i) => `${n} ${fl[i] ? `(=${P[i]})` : `(αντίγραφο ${P[i]})`} = ${loc[i]}`).join(", ")} → η main έχει x = ${V.x}, y = ${V.y}, z = ${V.z}.`); }
    const ans = lines.join(" ");
    return { level: 3, q: `Τι θα εμφανίσει το πρόγραμμα; (γράψτε τις τέσσερις γραμμές σε μία)${CPP(src)}`, fields: [{ label: "Έξοδος:", ans, text: true }],
      hint: `Παράμετροι αναφοράς: ${nm.filter((n, i) => fl[i]).join(", ")}. Αντιστοίχιση κατά θέση!`, sol: expl.join("<br>") + OUT(lines.join("\n")), chk: { src } };
  } },
  /* 6.4 — πίνακας σε συνάρτηση */
  ib6arrg: { make() {
    const N = 5, A = Array.from({ length: N }, () => ib6R(1, 9)), v = ib6R(0, 1);
    if (v === 0) {
      const Rr = ib6R(0, 1), k = ib6R(2, 4), B = A.map(x => x % 2 === Rr ? x * k : x);
      const src = `#include <iostream>\nusing namespace std;\nconst int N = ${N};\nvoid f(int arr[], int k) {\n    for (int i = 0; i < N; i++)\n        if (arr[i] % 2 == ${Rr})\n            arr[i] = arr[i] * k;\n    k++;\n}\nint main() {\n    int A[N] = {${A.join(", ")}};\n    int k = ${k};\n    f(A, k);\n    for (int i = 0; i < N; i++)\n        cout << A[i] << " ";\n    cout << k << endl;\n    return 0;\n}`;
      const ans = `${B.join(" ")} ${k}`;
      return { level: 2, q: `Τι θα εμφανίσει το πρόγραμμα; (σε μία γραμμή)${CPP(src)}`, fields: [{ label: "Έξοδος:", ans, text: true }], hint: "Ο πίνακας αλλάζει στη main· το k περνά με τιμή.",
        sol: `Τα ${Rr ? "περιττά" : "άρτια"} στοιχεία πολλαπλασιάζονται επί ${k} μέσα στον <b>ίδιο</b> πίνακα A. Το <code>k++</code> αλλάζει μόνο το αντίγραφο, άρα εμφανίζεται k = ${k}.${OUT(ans)}`, chk: { src } };
    }
    const B = A.slice(); let c = 0; for (let i = 1; i < N; i++) if (B[i] > B[i - 1]) { c++; B[i - 1] = B[i]; }
    const src = `#include <iostream>\nusing namespace std;\nconst int N = ${N};\nint f(int arr[]) {\n    int c = 0;\n    for (int i = 1; i < N; i++)\n        if (arr[i] > arr[i - 1]) {\n            c++;\n            arr[i - 1] = arr[i];\n        }\n    return c;\n}\nint main() {\n    int A[N] = {${A.join(", ")}};\n    int c = f(A);\n    for (int i = 0; i < N; i++)\n        cout << A[i] << " ";\n    cout << c << endl;\n    return 0;\n}`;
    const rows = []; { const T = A.slice(); for (let i = 1; i < N; i++) { const cc = T[i] > T[i - 1]; rows.push([i, `${T[i]} &gt; ${T[i - 1]}`, cc ? "T" : "F", cc ? `arr[${i - 1}] = ${T[i]}` : ""]); if (cc) T[i - 1] = T[i]; } }
    const ans = `${B.join(" ")} ${c}`;
    return { level: 3, q: `Τι θα εμφανίσει το πρόγραμμα; (σε μία γραμμή)${CPP(src)}`, fields: [{ label: "Έξοδος:", ans, text: true }], hint: "Η συνάρτηση αλλάζει στοιχεία του ίδιου του πίνακα A και επιστρέφει πόσες φορές το έκανε.",
      sol: ib6Trace(["i", "arr[i] &gt; arr[i−1]", "T/F", "αλλαγή"], rows) + OUT(ans), chk: { src } };
  } },
  /* 11.1 — στοίβα STL */
  ib6stk: { make() { return ib6DSGen(false); } },
  /* 11.2 — ουρά STL */
  ib6que: { make() { return ib6DSGen(true); } }
});
function ib6DSGen(queue) {
  const ops = [], st = [], out = []; let n = ib6R(7, 10);
  const nm = queue ? "Q" : "S";
  while (ops.length < n) {
    const r = Math.random();
    if (st.length < 2 || r < 0.45) { const v = ib6R(1, 9) * (ib6Pick([1, 1, 10])); st.push(v); ops.push(`    ${nm}.push(${v});`); }
    else if (r < 0.75) { queue ? st.shift() : st.pop(); ops.push(`    ${nm}.pop();`); }
    else if (r < 0.9) { const t = queue ? st[0] : st[st.length - 1]; out.push(t); ops.push(`    cout << ${nm}.${queue ? "front" : "top"}() << " ";`); }
    else { out.push(st.length); ops.push(`    cout << ${nm}.size() << " ";`); }
  }
  if (!st.length) { st.push(5); ops.push(`    ${nm}.push(5);`); }
  out.push(queue ? st[0] : st[st.length - 1]); ops.push(`    cout << ${nm}.${queue ? "front" : "top"}() << " " << ${nm}.size();`); out.push(st.length);
  const src = `#include <iostream>\n#include <${queue ? "queue" : "stack"}>\nusing namespace std;\nint main() {\n    ${queue ? "queue" : "stack"}<int> ${nm};\n${ops.join("\n")}\n    return 0;\n}`;
  const ans = out.join(" ");
  return { level: 2, q: `Τι θα εμφανίσει το πρόγραμμα; (σε μία γραμμή)${CPP(src)}`, fields: [{ label: "Έξοδος:", ans, text: true }],
    hint: queue ? "FIFO: push στο πίσω μέρος, pop από μπροστά." : "LIFO: push και pop γίνονται στην κορυφή.",
    sol: `Στο τέλος η ${queue ? "ουρά (μπροστά → πίσω)" : "στοίβα (κάτω → πάνω)"} περιέχει: ${st.join(", ")}.${ib6DSrow([ib6DS(st, { queue, label: "τελική κατάσταση" })])}${OUT(ans)}`, chk: { src } };
}

/* Πληροφορική Γ΄ Λυκείου — widgets & γεννήτριες: Γ7.5 Αναζήτηση, Γ7.6 Ταξινόμηση (prefix ib7) */
const ib7Parse = (s, max = 20) => String(s).split(/[\s,;]+/).filter(x => x !== "").map(Number).filter(x => Number.isFinite(x)).map(x => Math.round(x)).slice(0, max);
const ib7Rand = (n, lo = 1, hi = 30, distinct = true) => { const a = []; while (a.length < n) { const v = ri(lo, hi); if (!distinct || !a.includes(v)) a.push(v); } return a; };
const ib7SortedRand = (n, start = 2, maxStep = 9) => { const a = []; let v = ri(start, start + 8); for (let i = 0; i < n; i++) { a.push(v); v += ri(2, maxStep); } return a; };
const ib7J = a => a.join(" ");
/* μπλοκ κώδικα με φωτισμένη γραμμή (1-based) */
function ib7Code(src, on, title) {
  const L = CPPlines(src), set = new Set([].concat(on || []));
  return `<div class="cppbox sm">${title ? `<div class="cpptitle">${title}</div>` : ""}<pre class="cpp"><code>${L.map((l, k) => `<span class="cl${set.has(k + 1) ? " on" : ""}"><i>${k + 1}</i>${l || " "}</span>`).join("")}</code></pre></div>`;
}
/* γενικός «παίκτης» βημάτων: ▶ Βήμα / ⏩ Εκτέλεση / ⏸ / ↺ */
function ib7Player(box, ctl, getFrames, render) {
  let k = -1, tm = null;
  const bS = $(".ib7step", ctl), bR = $(".ib7run", ctl), bZ = $(".ib7rst", ctl);
  const stop = () => { if (tm) { clearInterval(tm); tm = null; } bR.textContent = "⏩ Εκτέλεση"; };
  const show = () => { const F = getFrames(); render(F, Math.min(k, F.length - 1)); };
  bS.onclick = () => { stop(); const F = getFrames(); if (k < F.length - 1) k++; show(); };
  bR.onclick = () => {
    if (tm) { stop(); return; }
    const F = getFrames(); if (k >= F.length - 1) k = -1;
    bR.textContent = "⏸ Παύση";
    tm = setInterval(() => { if (!box.isConnected) { stop(); return; } const G = getFrames(); if (k >= G.length - 1) { stop(); return; } k++; show(); }, +(($(".ib7spd", box) || {}).value || 650));
  };
  bZ.onclick = () => { stop(); k = -1; show(); };
  return { reset() { stop(); k = -1; show(); }, show };
}
const ib7Btns = `<button class="btn ghost ib7step">▶ Βήμα</button><button class="btn ghost ib7run">⏩ Εκτέλεση</button><button class="btn ghost ib7rst">↺</button>`;
const ib7Spd = `<label>ταχύτητα <select class="ib7spd"><option value="1100">αργή</option><option value="650" selected>κανονική</option><option value="280">γρήγορη</option></select></label>`;

/* ----- πηγές κώδικα των widgets ----- */
const IB7_SEQ = {
  first: { t: "πρώτη εμφάνιση", src: `int sequential_search(int arr[], int N, int target){
    for (int i=0; i<N; i++)
        if (target == arr[i])
            return i;
    return -1;
}` },
  last: { t: "τελευταία εμφάνιση", src: `int sequential_search(int arr[], int N, int target){
    int pos = -1;
    for (int i=0; i<N; i++)
        if (target == arr[i])
            pos = i;
    return pos;
}` },
  count: { t: "πλήθος εμφανίσεων", src: `int sequential_search(int arr[], int N, int target){
    int total = 0;
    for (int i=0; i<N; i++)
        if (target == arr[i])
            total++;
    return total;
}` },
  sorted: { t: "ταξινομημένος, πρόωρος τερματισμός", src: `int sorted_search(int arr[], int N, int target){
    for (int i=0; i<N; i++){
        if (arr[i] == target)
            return i;
        else if (arr[i] > target)
            return -1;
    }
    return -1;
}` }
};
/* καρέ σειριακής αναζήτησης: {i, line, cls, msg, comps, ret, vars} */
function ib7SeqFrames(a, x, v) {
  const F = [], N = a.length; let comps = 0, pos = -1, total = 0;
  const base = (i, extra = {}) => { const c = {}; for (let t = 0; t < i; t++) c[t] = "dim"; return Object.assign(c, extra); };
  if (v === "last") F.push({ line: 2, cls: {}, msg: "pos = -1", comps, vars: "pos = -1" });
  if (v === "count") F.push({ line: 2, cls: {}, msg: "total = 0", comps, vars: "total = 0" });
  for (let i = 0; i < N; i++) {
    comps++;
    const eq = a[i] === x;
    const lc = v === "first" ? 3 : v === "sorted" ? 3 : 4;
    if (v === "first" || v === "sorted") {
      F.push({ i, line: lc, cls: base(i, { [i]: eq ? "hit" : "cmp" }), msg: `i = ${i}: arr[${i}] = ${a[i]} ${eq ? "==" : "≠"} ${x}`, comps });
      if (eq) { F.push({ i, line: 4, cls: base(i, { [i]: "hit" }), msg: `<b>return ${i};</b> — βρέθηκε στη θέση ${i}`, comps, ret: i }); return F; }
      if (v === "sorted") {
        const gt = a[i] > x; F.push({ i, line: 5, cls: base(i, { [i]: "cmp" }), msg: `arr[${i}] = ${a[i]} ${gt ? "&gt;" : "&lt;"} ${x}${gt ? " → τα επόμενα είναι ακόμη μεγαλύτερα" : ""}`, comps });
        if (gt) { F.push({ i, line: 6, cls: base(i, { [i]: "cmp" }), msg: `<b>return -1;</b> — πρόωρος τερματισμός μετά από ${i + 1} στοιχεία`, comps, ret: -1 }); return F; }
      }
    } else {
      F.push({ i, line: lc, cls: base(i, { [i]: eq ? "hit" : "cmp" }), msg: `i = ${i}: arr[${i}] = ${a[i]} ${eq ? "==" : "≠"} ${x}`, comps, vars: v === "last" ? `pos = ${pos}` : `total = ${total}` });
      if (eq) { if (v === "last") pos = i; else total++; F.push({ i, line: 5, cls: base(i, { [i]: "hit" }), msg: v === "last" ? `pos = ${i}` : `total++ → ${total}`, comps, vars: v === "last" ? `pos = ${pos}` : `total = ${total}` }); }
    }
  }
  const r = v === "last" ? pos : v === "count" ? total : -1, ln = v === "first" ? 5 : v === "sorted" ? 8 : 6;
  F.push({ i: N, line: ln, cls: base(N), msg: `<b>return ${v === "last" ? "pos" : v === "count" ? "total" : "-1"};</b> → ${r}`, comps, ret: r, vars: v === "last" ? `pos = ${pos}` : v === "count" ? `total = ${total}` : "" });
  return F;
}

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 7.1 Σειριακή αναζήτηση βήμα-βήμα ---------- */
  ib7seq(box) {
    box.classList.add("ib7wrap");
    box.innerHTML = `<div class="wctl"><label>πίνακας <input class="ia" type="text" value="5 6 2 4 1 9 3 0 8 7" style="width:min(220px,60vw)"></label><label>target <input class="it" type="number" value="4" style="width:64px"></label>
      <label>εκδοχή <select class="iv">${Object.entries(IB7_SEQ).map(([k, o]) => `<option value="${k}">${o.t}</option>`).join("")}</select></label><button class="btn ghost ird">🎲</button></div>
      <div class="wctl">${ib7Btns}${ib7Spd}</div>
      <div class="ib7two"><div class="cd"></div><div><div class="ar"></div><div class="ib7msg"></div><div class="ib7stats"></div></div></div>`;
    const ctl = box;
    let a = [], x = 0, v = "first", F = [];
    const rebuild = () => {
      v = $(".iv", box).value; a = ib7Parse($(".ia", box).value, 16); x = Math.round(+$(".it", box).value || 0);
      if (v === "sorted") a = a.slice().sort((p, q) => p - q);
      F = ib7SeqFrames(a, x, v);
    };
    const P = ib7Player(box, ctl, () => F, (F, k) => {
      const f = k >= 0 ? F[k] : null;
      $(".cd", box).innerHTML = ib7Code(IB7_SEQ[v].src, f ? f.line : [], "sequential search — " + IB7_SEQ[v].t);
      $(".ar", box).innerHTML = ib7Arr(a, { cls: f ? f.cls : {}, tags: f && f.i !== undefined && f.i < a.length ? { [f.i]: ["i", "#C77A0A"] } : {} }) + ib7Leg([IB7L.cmp, IB7L.hit]);
      $(".ib7msg", box).innerHTML = f ? f.msg : `Πάτα <b>▶ Βήμα</b> για να δεις τη σειριακή αναζήτηση του ${x}${v === "sorted" ? " (ο πίνακας ταξινομήθηκε αυτόματα)" : ""}.`;
      $(".ib7stats", box).innerHTML = `<b>συγκρίσεις: <i>${f ? f.comps : 0}</i></b>${f && f.vars ? `<b><i>${f.vars}</i></b>` : ""}${f && f.ret !== undefined ? `<b>επιστρέφει: <i>${f.ret}</i></b>` : ""}<b>N = <i>${a.length}</i></b>`;
    });
    box.querySelectorAll("input,select").forEach(e => e.oninput = () => { rebuild(); P.reset(); });
    $(".ird", box).onclick = () => { const n = ri(8, 12), arr = ib7Rand(n, 0, 20, false); $(".ia", box).value = ib7J(arr); $(".it", box).value = Math.random() < 0.75 ? bkPick(arr) : ri(0, 20); rebuild(); P.reset(); };
    rebuild(); P.reset();
  },

  /* ---------- 7.2 Πολυπλοκότητα: μετρητής βημάτων και καμπύλες ---------- */
  ib7cx(box) {
    box.classList.add("ib7wrap");
    const T = [
      { n: "O(1) — σταθερή", c: "#198754", f: N => 1, src: N => `int ans = 1;      // N = ${N}` },
      { n: "O(log₂N) — λογαριθμική", c: "#0F6FD1", f: N => Math.floor(Math.log2(N)) + 1, src: N => `int ans = 0, N = ${N};\nwhile (N > 0) {\n    N /= 2;\n    ans++;\n}` },
      { n: "O(N) — γραμμική", c: "#C77A0A", f: N => N, src: N => `int ans = 0, N = ${N};\nfor (int i = 0; i < N; i++){\n    ans++;\n}` },
      { n: "O(N²) — τετραγωνική", c: "#6F42C1", f: N => N * N, src: N => `int ans = 0, N = ${N};\nfor (int i = 0; i < N; i++){\n    for (int j = 0; j < N; j++){\n        ans++;\n    }\n}` },
      { n: "O(N³) — κυβική", c: "#DC3545", f: N => N ** 3, src: N => `int ans = 0, N = ${N};\nfor (int i = 1; i <= N; i++)\n    for (int j = N; j >= 1; j--)\n        for (int k = 1; k <= N; k++)\n            ans++;` }
    ];
    box.innerHTML = `<div class="wctl"><label>αλγόριθμος <select class="ip">${T.map((t, i) => `<option value="${i}"${i === 3 ? " selected" : ""}>${t.n}</option>`).join("")}</select></label>
      <label>N = <input class="in" type="range" min="1" max="64" value="16"> <b class="nv">16</b></label></div>
      <div class="ib7two"><div class="cd"></div><div><div class="ib7stats"></div><div class="tb"></div></div></div><div class="ch" style="margin-top:8px"></div>`;
    const draw = () => {
      const p = +$(".ip", box).value, N = +$(".in", box).value; $(".nv", box).textContent = N;
      const t = T[p], st = t.f(N);
      $(".cd", box).innerHTML = ib7Code(t.src(N), [], "κώδικας-πρότυπο");
      $(".ib7stats", box).innerHTML = `<b>βήματα (ans): <i>${st.toLocaleString("el-GR")}</i></b><b>πολυπλοκότητα: <i style="color:${t.c}">${t.n.split(" ")[0]}</i></b>`;
      $(".tb", box).innerHTML = `<div class="ib7tw"><table class="tbl"><tr><th>N</th>${T.map(x => `<th style="color:${x.c}">${x.n.split(" ")[0]}</th>`).join("")}</tr>${[N, 2 * N].map(n => `<tr><td>${n}</td>${T.map(x => `<td>${x.f(n).toLocaleString("el-GR")}</td>`).join("")}</tr>`).join("")}</table></div><p class="small muted">Διπλασιάζοντας το N: η O(N) διπλασιάζεται, η O(N²) τετραπλασιάζεται, η O(N³) οκταπλασιάζεται, ενώ η O(log₂N) αυξάνεται μόνο κατά 1.</p>`;
      /* γράφημα με λογαριθμικό άξονα y */
      const W = 560, H = 230, L = 46, B = 26, maxY = Math.log10(64 ** 3), sx = n => L + (n - 1) / 63 * (W - L - 12), sy = y => H - B - Math.log10(Math.max(1, y)) / maxY * (H - B - 10);
      let g = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;height:auto;display:block" role="img" aria-label="καμπύλες πολυπλοκότητας">`;
      for (let e = 0; e <= 5; e++) { const y = sy(10 ** e); g += `<line x1="${L}" x2="${W - 10}" y1="${y}" y2="${y}" stroke="#e3e9f3"/><text x="${L - 6}" y="${y}" font-size="11" text-anchor="end" dominant-baseline="middle" fill="#5b6b86">10${e ? "<tspan dy='-5' font-size='8'>" + e + "</tspan>" : "⁰"}</text>`; }
      [1, 16, 32, 48, 64].forEach(n => g += `<text x="${sx(n)}" y="${H - 8}" font-size="11" text-anchor="middle" fill="#5b6b86">${n}</text>`);
      g += `<text x="${W - 12}" y="${H - B - 8}" font-size="12" text-anchor="end" fill="#5b6b86" font-weight="800">N →</text>`;
      T.forEach((x, i) => { let d = ""; for (let n = 1; n <= 64; n++) d += (n > 1 ? "L" : "M") + sx(n).toFixed(1) + "," + sy(x.f(n)).toFixed(1); g += `<path d="${d}" fill="none" stroke="${x.c}" stroke-width="${i === p ? 3.6 : 1.8}" opacity="${i === p ? 1 : .45}"/>`; });
      g += `<line x1="${sx(N)}" x2="${sx(N)}" y1="10" y2="${H - B}" stroke="#94a3b8" stroke-dasharray="4 4"/><circle cx="${sx(N)}" cy="${sy(st)}" r="6" fill="${t.c}" stroke="#fff" stroke-width="2"/>`;
      g += `</svg><p class="small muted">Λογαριθμική κλίμακα στον άξονα των βημάτων (κάθε γραμμή πλέγματος ×10).</p>`;
      $(".ch", box).innerHTML = g;
    };
    box.querySelectorAll("input,select").forEach(e => e.oninput = draw); draw();
  },

  /* ---------- 7.3 Δυαδική αναζήτηση: first / last / mid ---------- */
  ib7bin(box) {
    box.classList.add("ib7wrap");
    const SRC = `int binary_search(int arr[], int N, int target){
    int first = 0, last = N - 1, mid;
    while (first <= last) {
        mid = (first + last) / 2;
        if (target == arr[mid])
            return mid;
        else if (target < arr[mid])
            last = mid - 1;
        else
            first = mid + 1;
    }
    return -1;
}`;
    box.innerHTML = `<div class="wctl"><label>N <select class="nn">${[7, 10, 12, 15, 16, 20].map(n => `<option${n === 15 ? " selected" : ""}>${n}</option>`).join("")}</select></label><button class="btn ghost ird">🎲 νέος πίνακας</button>
      <label>target <input class="it" type="number" style="width:70px"></label></div>
      <div class="wctl">${ib7Btns}${ib7Spd}</div>
      <div class="ar"></div><div class="ib7msg"></div><div class="ib7stats"></div>
      <div class="ib7two"><div class="cd"></div><div class="lg"></div></div>`;
    let a = [], x = 0, F = [];
    const rebuild = () => {
      x = Math.round(+$(".it", box).value || 0); const r = ib7Bin(a, x); F = [];
      F.push({ line: 2, first: 0, last: a.length - 1, msg: `first = 0, last = ${a.length - 1}`, it: 0 });
      r.steps.forEach((s, k) => {
        F.push({ line: 3, first: s.first, last: s.last, msg: `first = ${s.first} ≤ last = ${s.last} → συνεχίζουμε`, it: k });
        F.push({ line: 4, first: s.first, last: s.last, mid: s.mid, msg: `mid = (${s.first} + ${s.last}) / 2 = ${s.mid}, arr[mid] = ${s.v}`, it: k + 1 });
        if (s.v === x) F.push({ line: [5, 6], first: s.first, last: s.last, mid: s.mid, hit: true, msg: `<b>${x} == arr[${s.mid}]</b> → return ${s.mid}`, it: k + 1, ret: s.mid });
        else if (x < s.v) F.push({ line: [7, 8], first: s.first, last: s.mid - 1, mid: s.mid, msg: `${x} &lt; ${s.v} → «αριστερό» μέρος: last = ${s.mid - 1}`, it: k + 1 });
        else F.push({ line: [9, 10], first: s.mid + 1, last: s.last, mid: s.mid, msg: `${x} &gt; ${s.v} → «δεξί» μέρος: first = ${s.mid + 1}`, it: k + 1 });
      });
      if (r.pos < 0) F.push({ line: [3, 12], first: r.first, last: r.last, msg: `first = ${r.first} &gt; last = ${r.last} → ο βρόχος τερματίζει, <b>return -1</b> (δεν βρέθηκε)`, it: r.steps.length, ret: -1 });
    };
    const P = ib7Player(box, box, () => F, (F, k) => {
      const f = k >= 0 ? F[k] : null, N = a.length;
      const cls = {}, tags = {};
      if (f) {
        if (f.mid !== undefined) cls[f.mid] = f.hit ? "hit" : "mid";
        const add = (p, t, c) => { if (p < 0 || p >= N) return; tags[p] = tags[p] ? [tags[p][0] + "," + t, "#1B2A4A"] : [t, c]; };
        add(f.first, "first", "#0F6FD1"); add(f.last, "last", "#C77A0A"); if (f.mid !== undefined) add(f.mid, "mid", "#6F42C1");
      }
      $(".ar", box).innerHTML = ib7Arr(a, { cls, tags, dim: f ? [f.first, f.last] : [] }) + ib7Leg([IB7L.mid, IB7L.hit, IB7L.dim]);
      $(".ib7msg", box).innerHTML = f ? f.msg : `Ταξινομημένος πίνακας ${N} στοιχείων. Πάτα <b>▶ Βήμα</b> για να ψάξεις το ${x}.`;
      const seq = a.indexOf(x) >= 0 ? a.indexOf(x) + 1 : N;
      $(".ib7stats", box).innerHTML = `<b>επαναλήψεις while: <i>${f ? f.it : 0}</i></b><b>μέγιστο ⌊log₂${N}⌋+1 = <i>${Math.floor(Math.log2(N)) + 1}</i></b><b>σειριακή θα έκανε: <i>${seq}</i> συγκρίσεις</b>${f && f.ret !== undefined ? `<b>επιστρέφει: <i>${f.ret}</i></b>` : ""}`;
      $(".cd", box).innerHTML = ib7Code(SRC, f ? f.line : [], "binary_search");
      const ln4 = F.slice(0, k + 1).filter(g => g.line === 4);
      $(".lg", box).innerHTML = !ln4.length ? `<p class="small muted">Εδώ θα εμφανιστεί ο πίνακας τιμών first / last / mid.</p>` : `<div class="ib7tw"><table class="tbl"><tr><th>βήμα</th><th>first</th><th>last</th><th>mid</th><th>arr[mid]</th></tr>${ln4.map((g, t) => `<tr><td>${t + 1}</td><td>${g.first}</td><td>${g.last}</td><td>${g.mid}</td><td>${a[g.mid]}</td></tr>`).join("")}</table></div>`;
    });
    const newArr = () => { const n = +$(".nn", box).value; a = ib7SortedRand(n, 2, 9); $(".it", box).value = Math.random() < 0.7 ? bkPick(a) : a[ri(0, n - 2)] + 1; rebuild(); P.reset(); };
    $(".ird", box).onclick = newArr; $(".nn", box).onchange = newArr;
    $(".it", box).oninput = () => { rebuild(); P.reset(); };
    a = [15, 26, 32, 44, 51, 68, 73, 80, 88, 97]; $(".nn", box).value = "10"; $(".it", box).value = 73; rebuild(); P.reset();
  },

  /* ---------- 8.1 Ταξινόμηση φυσαλίδας ---------- */
  ib7bub(box) {
    box.classList.add("ib7wrap");
    const SRC = {
      flag: `do{
    sorted = true;
    for (int i=0; i<N-1; i++){
        if (arr[i]>arr[i+1]){
            temp = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = temp;
            sorted = false;
        }
    }
} while (sorted==false);`,
      opt: `do{
    sorted = true;
    for (int i=0; i<S-1; i++){
        if (arr[i]>arr[i+1]){
            temp = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = temp;
            sorted = false;
        }
    }
    S--;
} while (sorted==false);`,
      two: `for (int i=0; i<N-1; i++){
    for (int j=i+1; j<N; j++){
        if (arr[i]>arr[j]){
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
}`
    };
    box.innerHTML = `<div class="wctl"><label>πίνακας <input class="ia" type="text" value="5 6 2 4 1 9 3 0 8 7" style="width:min(220px,60vw)"></label><button class="btn ghost ird">🎲</button>
      <label>εκδοχή <select class="iv"><option value="flag">με sorted</option><option value="opt">με sorted και S--</option><option value="two">δύο βρόχοι for</option></select></label>
      <label>σειρά <select class="io"><option value="a">αύξουσα</option><option value="d">φθίνουσα</option></select></label></div>
      <div class="wctl">${ib7Btns}${ib7Spd}</div>
      <div class="ar"></div><div class="ib7msg"></div><div class="ib7stats"></div>
      <div class="ib7two"><div class="cd"></div><div><b class="small">Ο πίνακας μετά από κάθε διάσχιση</b><div class="ib7log"></div></div></div>`;
    let a = [], v = "flag", desc = false, R0 = null;
    const rebuild = () => { a = ib7Parse($(".ia", box).value, 14); v = $(".iv", box).value; desc = $(".io", box).value === "d"; R0 = v === "two" ? ib7Bubble2(a, desc) : ib7Bubble(a, v === "opt", desc); };
    const src = () => { let s = SRC[v]; if (desc) s = s.replace("arr[i]>arr[i+1]", "arr[i]<arr[i+1]").replace("arr[i]>arr[j]", "arr[i]<arr[j]"); return s; };
    const P = ib7Player(box, box, () => R0.events, (E, k) => {
      const e = k >= 0 ? E[k] : null, N = a.length, cls = {};
      let fixed = 0, pass = e ? e.pass : 0;
      const sw = E.slice(0, k + 1).filter(z => z.swap).length;
      if (e) {
        const donePass = (k === E.length - 1) || E[k + 1].pass !== e.pass ? e.pass : e.pass - 1;
        if (v === "two") { for (let t = 0; t < donePass; t++) cls[t] = "ok"; }
        else { const isLast = k === E.length - 1; fixed = isLast ? N : Math.min(N, donePass); for (let t = N - fixed; t < N; t++) cls[t] = "ok"; }
        cls[e.i] = e.swap ? "sw" : "cmp"; cls[e.j] = e.swap ? "sw" : "cmp";
      }
      const cur = e ? e.a : a;
      $(".ar", box).innerHTML = ib7Arr(cur, { cls, tags: e ? (v === "two" ? { [e.i]: ["i", "#0F6FD1"], [e.j]: ["j", "#C77A0A"] } : { [e.i]: ["i", "#0F6FD1"], [e.j]: ["i+1", "#C77A0A"] }) : {} }) + ib7Leg([IB7L.cmp, IB7L.sw, IB7L.ok]);
      const done = k === E.length - 1;
      $(".ib7msg", box).innerHTML = e ? `${v === "two" ? `i = ${e.i}, j = ${e.j}` : `διάσχιση ${e.pass}${v === "opt" ? ` (S = ${e.S})` : ""}, i = ${e.i}`}: ${e.swap ? `<b style="color:#DC3545">αντιμετάθεση</b>` : "καμία αλλαγή"}${done ? ` — <b style="color:#198754">ο πίνακας ταξινομήθηκε!</b>${v !== "two" ? " (η τελευταία διάσχιση έγινε χωρίς αντιμεταθέσεις, sorted = true)" : ""}` : ""}` : `Πάτα <b>▶ Βήμα</b> ή <b>⏩ Εκτέλεση</b>.`;
      $(".ib7stats", box).innerHTML = `<b>${v === "two" ? "επανάληψη i" : "διάσχιση"}: <i>${v === "two" ? (e ? pass - 1 : "–") : pass}</i></b><b>συγκρίσεις: <i>${k + 1}</i></b><b>αντιμεταθέσεις: <i>${sw}</i></b><b>στο τέλος: <i>${R0.comps}</i> συγκρ. / <i>${R0.swaps}</i> αντιμ.</b>`;
      const hl = v === "two" ? (e ? (e.swap ? [3, 4, 5, 6] : [3]) : []) : (e ? (e.swap ? [4, 5, 6, 7, 8] : [4]) : []);
      $(".cd", box).innerHTML = ib7Code(src(), hl, v === "two" ? "bubblesort — δύο for" : "bubblesort");
      const np = e ? (done ? R0.passes.length : e.pass - 1) : 0;
      $(".ib7log", box).innerHTML = R0.passes.slice(0, np).map((p, t) => `<div${t === np - 1 ? ' class="on"' : ""}>${v === "two" ? "i = " + t : "Pass " + (t + 1)}: ${ib7J(p)}</div>`).join("") || `<span class="muted">—</span>`;
    });
    box.querySelectorAll(".ia,.iv,.io").forEach(e => e.oninput = () => { rebuild(); P.reset(); });
    $(".ird", box).onclick = () => { $(".ia", box).value = ib7J(ib7Rand(ri(6, 9), 1, 40)); rebuild(); P.reset(); };
    rebuild(); P.reset();
  },

  /* ---------- 8.2 Ταξινόμηση με εισαγωγή ---------- */
  ib7ins(box) {
    box.classList.add("ib7wrap");
    const SRC = `for (int i=1; i<N; i++){
    temp = arr[i];
    j = i - 1;
    while (j>=0 && arr[j]>temp){
        arr[j+1] = arr[j];
        j--;
    }
    arr[j+1] = temp;
}`;
    box.innerHTML = `<div class="wctl"><label>πίνακας <input class="ia" type="text" value="5 6 2 4 1 9 3 0 8 7" style="width:min(220px,60vw)"></label><button class="btn ghost ird">🎲</button>
      <label>σειρά <select class="io"><option value="a">αύξουσα</option><option value="d">φθίνουσα</option></select></label></div>
      <div class="wctl">${ib7Btns}${ib7Spd}</div>
      <div class="ar"></div><div class="ib7msg"></div><div class="ib7stats"></div>
      <div class="ib7two"><div class="cd"></div><div><b class="small">Ο πίνακας στο τέλος κάθε επανάληψης του for</b><div class="ib7log"></div></div></div>`;
    let a = [], desc = false, R0 = null;
    const rebuild = () => { a = ib7Parse($(".ia", box).value, 14); desc = $(".io", box).value === "d"; R0 = ib7Insert(a, desc); };
    const P = ib7Player(box, box, () => R0.events, (E, k) => {
      const e = k >= 0 ? E[k] : null, cls = {}, tags = {};
      if (e) {
        for (let t = 0; t < e.i; t++) cls[t] = "ok";
        if (e.kind === "take") { cls[e.i] = "tmp"; tags[e.i] = ["i", "#0F6FD1"]; if (e.j >= 0) tags[e.j] = ["j", "#C77A0A"]; }
        if (e.kind === "shift") { cls[e.j + 1] = "sw"; tags[e.j + 1] = ["j+1", "#DC3545"]; if (e.j - 1 >= 0) tags[e.j - 1] = ["j", "#C77A0A"]; }
        if (e.kind === "stop") { cls[e.j] = "cmp"; tags[e.j] = ["j", "#C77A0A"]; }
        if (e.kind === "put") { for (let t = 0; t <= e.i; t++) cls[t] = "ok"; cls[e.j] = "hit"; tags[e.j] = ["j+1", "#198754"]; }
      }
      const cur = e ? e.a : a;
      $(".ar", box).innerHTML = `<div style="display:flex;gap:14px;align-items:flex-end;flex-wrap:wrap"><div>${ib7Arr(cur, { cls, tags })}</div><div class="ib7c" style="margin-bottom:16px"><span class="ib7t" style="color:#C77A0A">temp</span><span class="ib7v tmp">${e ? e.temp : "–"}</span></div></div>` + ib7Leg([IB7L.ok, ["temp", "#fff4dc", "#C77A0A"], ["μετακίνηση δεξιά", "#fde3e6", "#DC3545"], ["θέση εισαγωγής", "#dff5e8", "#198754"]]);
      const sign = desc ? "&lt;" : "&gt;", nsign = desc ? "≥" : "≤";
      const msg = !e ? "Το πρώτο στοιχείο θεωρείται ήδη ταξινομημένο. Πάτα <b>▶ Βήμα</b>." :
        e.kind === "take" ? `i = ${e.i}: temp = arr[${e.i}] = <b>${e.temp}</b>, j = ${e.j}` :
        e.kind === "shift" ? `arr[${e.j}] = ${e.a[e.j]} ${sign} ${e.temp} → αντιγραφή στη θέση ${e.j + 1}, j = ${e.j - 1}` :
        e.kind === "stop" ? `arr[${e.j}] = ${e.a[e.j]} ${nsign} ${e.temp} → έξοδος από το while` :
        `${e.j === 0 && (k === 0 || E[k - 1].kind === "shift") ? "j = -1 (φτάσαμε στην αρχή) → " : ""}arr[${e.j}] = temp = <b>${e.temp}</b>${k === E.length - 1 ? ` — <b style="color:#198754">ο πίνακας ταξινομήθηκε!</b>` : ""}`;
      $(".ib7msg", box).innerHTML = msg;
      const done = E.slice(0, k + 1);
      $(".ib7stats", box).innerHTML = `<b>i = <i>${e ? e.i : "–"}</i></b><b>μετακινήσεις: <i>${done.filter(z => z.kind === "shift").length}</i></b><b>συγκρίσεις arr[j]${desc ? "&lt;" : "&gt;"}temp: <i>${done.filter(z => z.kind === "shift" || z.kind === "stop").length}</i></b><b>στο τέλος: <i>${R0.shifts}</i> μετακ. / <i>${R0.comps}</i> συγκρ.</b>`;
      const hl = !e ? [] : e.kind === "take" ? [2, 3] : e.kind === "shift" ? [4, 5, 6] : e.kind === "stop" ? [4] : [8];
      $(".cd", box).innerHTML = ib7Code(desc ? SRC.replace("arr[j]>temp", "arr[j]<temp") : SRC, hl, "insertionSort");
      const np = done.filter(z => z.kind === "put").length;
      $(".ib7log", box).innerHTML = R0.steps.slice(0, np).map((p, t) => `<div${t === np - 1 ? ' class="on"' : ""}>i = ${t + 1}: ${ib7J(p)}</div>`).join("") || `<span class="muted">—</span>`;
    });
    box.querySelectorAll(".ia,.io").forEach(e => e.oninput = () => { rebuild(); P.reset(); });
    $(".ird", box).onclick = () => { $(".ia", box).value = ib7J(ib7Rand(ri(6, 9), 1, 40)); rebuild(); P.reset(); };
    rebuild(); P.reset();
  },

  /* ---------- 8.3 Αγώνας αλγορίθμων: συγκρίσεις & αντιμεταθέσεις ---------- */
  ib7race(box) {
    box.classList.add("ib7wrap");
    box.innerHTML = `<div class="wctl"><label>N = <input class="in" type="range" min="5" max="60" value="20"> <b class="nv">20</b></label>
      <label>δεδομένα <select class="it"><option value="r">τυχαία</option><option value="n">σχεδόν ταξινομημένα</option><option value="d">φθίνουσα σειρά (χειρότερη)</option><option value="s">ήδη ταξινομημένα (καλύτερη)</option></select></label><button class="btn ghost ird">🎲 νέα δεδομένα</button></div>
      <div class="ib7bars"></div><div class="res"></div>`;
    let seed = 1;
    const draw = () => {
      const N = +$(".in", box).value, t = $(".it", box).value; $(".nv", box).textContent = N;
      let a = Array.from({ length: N }, (_, k) => k + 1);
      if (t === "r") { for (let k = N - 1; k > 0; k--) { const r = Math.floor(Math.random() * (k + 1)); [a[k], a[r]] = [a[r], a[k]]; } }
      if (t === "n") { for (let k = 0; k < Math.max(1, Math.floor(N / 8)); k++) { const p = ri(0, N - 2); [a[p], a[p + 1]] = [a[p + 1], a[p]]; } }
      if (t === "d") a.reverse();
      $(".ib7bars", box).innerHTML = a.map(v => `<div style="height:${(v / N * 100).toFixed(1)}%;background:${t === "d" ? "#DC3545" : t === "s" ? "#198754" : "#0F6FD1"}"></div>`).join("");
      const b1 = ib7Bubble(a), b2 = ib7Bubble(a, true), b3 = ib7Bubble2(a), ins = ib7Insert(a);
      const rows = [["Φυσαλίδα με sorted", b1.comps, b1.swaps, "αντιμεταθέσεις", "#DC3545", b1.passes.length + " διασχίσεις"], ["Φυσαλίδα με sorted και S--", b2.comps, b2.swaps, "αντιμεταθέσεις", "#C77A0A", b2.passes.length + " διασχίσεις"], ["Φυσαλίδα με δύο for", b3.comps, b3.swaps, "αντιμεταθέσεις", "#6F42C1", (N - 1) + " επαναλήψεις i"], ["Ταξινόμηση με εισαγωγή", ins.comps, ins.shifts, "μετακινήσεις", "#198754", (N - 1) + " επαναλήψεις i"]];
      const mx = Math.max(...rows.map(r => r[1]), 1), ref = N * (N - 1) / 2;
      $(".res", box).innerHTML = rows.map(r => `<div style="margin:8px 0"><div class="small"><b>${r[0]}</b> — <b>${r[1]}</b> συγκρίσεις, ${r[2]} ${r[3]}, ${r[5]}</div><div style="background:#eef2f8;border-radius:6px;height:14px;overflow:hidden"><div style="width:${(r[1] / mx * 100).toFixed(1)}%;height:100%;background:${r[4]};border-radius:6px;transition:width .3s"></div></div></div>`).join("") +
        `<p class="small muted">Αναφορά: N(N−1)/2 = <b>${ref}</b>, N − 1 = <b>${N - 1}</b>. Δοκίμασε «ήδη ταξινομημένα»: η εισαγωγή και η φυσαλίδα με sorted κάνουν μόνο N − 1 συγκρίσεις, ενώ οι δύο for κάνουν πάντα N(N−1)/2. Για την <b>πολυπλοκότητα</b> όμως, το βιβλίο δηλώνει ότι η φυσαλίδα είναι O(N²) σε όλες τις περιπτώσεις — έτσι απαντούμε στις εξετάσεις.</p>`;
    };
    box.querySelectorAll("input,select").forEach(e => e.oninput = draw); $(".ird", box).onclick = () => { seed++; draw(); }; draw();
  }
});

/* ======================= Γεννήτριες ======================= */
var GENS = Object.assign(window.GENS || {}, {
  ib7gseq: { title: "Γεννήτρια — σειριακή αναζήτηση", make() {
    const t = ri(0, 3);
    if (t === 3) {
      const a = ib7SortedRand(8, 1, 6); const x = Math.random() < 0.5 ? bkPick(a) : a[ri(0, 6)] + 1;
      let n = 0, ret = -1; for (let i = 0; i < 8; i++) { n++; if (a[i] === x) { ret = i; break; } if (a[i] > x) break; }
      return { q: R`Ο πίνακας <code>{${a.join(", ")}}</code> είναι ταξινομημένος σε αύξουσα σειρά. Η σειριακή αναζήτηση με <b>πρόωρο τερματισμό</b> (σταματά όταν <code>arr[i] == target</code> ή <code>arr[i] &gt; target</code>) εφαρμόζεται για target $= ${x}$. Πόσα στοιχεία εξετάζονται και τι επιστρέφεται;`,
        fields: [{ label: "Στοιχεία:", ans: n }, { label: "Επιστρέφει:", ans: ret }],
        hint: R`Σταματάμε στο πρώτο στοιχείο που είναι ίσο ή μεγαλύτερο από το ${x}.`,
        sol: R`Εξετάζονται τα ${a.slice(0, n).join(", ")}. ${ret >= 0 ? `Το ${x} βρέθηκε στη θέση ${ret}.` : `Το ${a[n - 1]} &gt; ${x}, άρα το ${x} δεν υπάρχει: επιστρέφεται -1.`} Σύνολο <b>${n}</b> στοιχεία, επιστροφή <b>${ret}</b>.` };
    }
    const a = ib7Rand(9, 1, 9, false), x = Math.random() < 0.8 ? bkPick(a) : bkPick([0, 10, 11]);
    const first = a.indexOf(x), last = a.lastIndexOf(x), cnt = a.filter(v => v === x).length;
    const kind = ["first", "last", "count"][t];
    const ans = kind === "first" ? first : kind === "last" ? last : cnt;
    const src = IB7_SEQ[kind].src.replace("sequential_search", "f");
    return { q: R`Δίνεται η συνάρτηση:${CPP(src)}και ο πίνακας <code>a = {${a.join(", ")}}</code> ($N = 9$). Τι επιστρέφει η κλήση <code>f(a, 9, ${x})</code>${kind === "first" ? " και πόσες συγκρίσεις <code>target == arr[i]</code> γίνονται" : ""};`,
      fields: kind === "first" ? [{ label: "Επιστρέφει:", ans }, { label: "Συγκρίσεις:", ans: first >= 0 ? first + 1 : 9 }] : [{ label: "Επιστρέφει:", ans }],
      hint: kind === "first" ? R`Η return τερματίζει τη συνάρτηση στο πρώτο ταίριασμα.` : kind === "last" ? R`Η pos κρατά την πιο πρόσφατη θέση.` : R`Μέτρησε τις εμφανίσεις του ${x}.`,
      sol: kind === "first" ? (first >= 0 ? R`Το ${x} εμφανίζεται πρώτη φορά στη θέση ${first}: επιστρέφει <b>${first}</b> μετά από <b>${first + 1}</b> συγκρίσεις.` : R`Το ${x} δεν υπάρχει: ελέγχονται και τα 9 στοιχεία (<b>9</b> συγκρίσεις) και επιστρέφεται <b>-1</b>.`)
        : kind === "last" ? (last >= 0 ? R`Το ${x} εμφανίζεται στις θέσεις ${a.map((v, i) => v === x ? i : -1).filter(i => i >= 0).join(", ")}· επιστρέφεται η τελευταία: <b>${last}</b>.` : R`Το ${x} δεν υπάρχει, η pos μένει -1: επιστρέφει <b>-1</b>.`)
        : R`Το ${x} εμφανίζεται <b>${cnt}</b> ${cnt === 1 ? "φορά" : "φορές"}${cnt ? ` (${cnt === 1 ? "θέση" : "θέσεις"} ${a.map((v, i) => v === x ? i : -1).filter(i => i >= 0).join(", ")})` : ""}.` };
  } },
  ib7gcx: { title: "Γεννήτρια — πολυπλοκότητα και πλήθος βημάτων", make() {
    const t = ri(0, 6), cxs = ["$O(1)$", "$O(\\log_2 N)$", "$O(N)$", "$O(N^2)$", "$O(N^3)$"];
    let src, ans, sol, cx;
    if (t === 0) { const N = ri(3, 9), M = ri(3, 9); src = `int steps = 0, N = ${N}, M = ${M};\nfor (int i = 0; i < N; i++)\n    for (int j = 0; j < M; j++)\n        steps++;\ncout << steps;`; ans = N * M; cx = -1; sol = R`Εμφωλευμένοι βρόχοι: $${N} \cdot ${M} = ${N * M}$.`; }
    else if (t === 1) { const N = ri(4, 12); src = `int steps = 0, N = ${N};\nfor (int i = 1; i <= N; i++)\n    for (int j = i; j <= N; j++)\n        steps++;\ncout << steps;`; ans = N * (N + 1) / 2; cx = 3; sol = R`Για $i = 1$ ο εσωτερικός εκτελείται $${N}$ φορές, για $i = 2$ $${N - 1}$, …: $${N} + ${N - 1} + \dots + 1 = \frac{${N}\cdot ${N + 1}}{2} = ${ans}$.`; }
    else if (t === 2) { const N = ri(5, 300); let n = N, c = 0; const tr = []; while (n > 0) { n = Math.floor(n / 2); c++; tr.push(n); } src = `int ans = 0, N = ${N};\nwhile (N > 0) {\n    N /= 2;\n    ans++;\n}\ncout << ans;`; ans = c; cx = 1; sol = R`$${N} \to ${tr.join(" \\to ")}$: <b>${c}</b> επαναλήψεις ($\lfloor\log_2 ${N}\rfloor + 1$).`; }
    else if (t === 3) { const x = ri(3, 30), y = ri(3, 30); src = `int steps = 0;\nfor (int i = 1; i <= ${x}; i++)\n    steps++;\nfor (int j = 1; j <= ${y}; j++)\n    steps++;\ncout << steps;`; ans = x + y; cx = -1; sol = R`Διαδοχικοί βρόχοι: τα βήματα προστίθενται, $${x} + ${y} = ${x + y}$.`; }
    else if (t === 4) { const N = ri(2, 6); src = `int steps = 0, N = ${N};\nfor (int i = 1; i <= N; i++)\n    for (int j = N; j >= 1; j--)\n        for (int k = 1; k <= N; k++)\n            steps++;\ncout << steps;`; ans = N ** 3; cx = 4; sol = R`Τρεις εμφωλευμένοι βρόχοι: $${N}^3 = ${N ** 3}$.`; }
    else if (t === 5) { const e = ri(2, 5), N = 2 ** e, M = ri(3, 9); src = `int steps = 0, N = ${N};\nfor (int i = 1; i <= N; i *= 2)\n    for (int j = 0; j < ${M}; j++)\n        steps++;\ncout << steps;`; ans = (e + 1) * M; cx = -1; sol = R`Το <code>i</code> παίρνει τις τιμές ${Array.from({ length: e + 1 }, (_, k) => 2 ** k).join(", ")} (${e + 1} τιμές), άρα $${e + 1} \cdot ${M} = ${ans}$.`; }
    else { const N = ri(4, 12); src = `int steps = 0, N = ${N};\nfor (int i = 0; i < N; i++)\n    for (int j = 0; j < i; j++)\n        steps++;\ncout << steps;`; ans = N * (N - 1) / 2; cx = 3; sol = R`Για $i = 0$ ο εσωτερικός δεν εκτελείται, για $i = 1$ μία φορά, …, για $i = ${N - 1}$ $${N - 1}$ φορές: $0 + 1 + \dots + ${N - 1} = \frac{${N}\cdot ${N - 1}}{2} = ${ans}$.`; }
    if (cx >= 0 && Math.random() < 0.35) {
      const opts = [cx, ...bkPick([[0, 1, 2, 3, 4].filter(z => z !== cx)]).sort(() => Math.random() - 0.5).slice(0, 3)];
      return { type: "mc", q: R`Ποια είναι η χρονική πολυπλοκότητα του κώδικα (ως προς το μέγεθος των δεδομένων);${CPP(src.replace(/\ncout << \w+;$/, ""))}`, options: opts.map(z => cxs[z]), correct: 0,
        hint: R`Μέτρησε τους εμφωλευμένους βρόχους και το πώς μεταβάλλεται ο μετρητής.`, sol: R`${sol} Πολυπλοκότητα: <b>${cxs[cx]}</b>.` };
    }
    return { q: R`Τι θα εμφανίσει ο κώδικας;${CPP(src)}`, fields: [{ label: "Έξοδος:", ans }], hint: R`Εμφωλευμένοι βρόχοι πολλαπλασιάζονται, διαδοχικοί προστίθενται.`, sol: R`${sol} ${OUT(String(ans))}` };
  } },
  ib7gbin: { title: "Γεννήτρια — ίχνος δυαδικής αναζήτησης", make() {
    const n = bkPick([9, 10, 11, 12, 13, 15, 16]), a = ib7SortedRand(n, 3, 9);
    const x = Math.random() < 0.65 ? bkPick(a) : a[ri(0, n - 2)] + 1;
    const r = ib7Bin(a, x), mids = r.steps.map(s => s.mid);
    const tbl = `<table class="tbl"><tr><th>βήμα</th><th>first</th><th>last</th><th>mid</th><th>arr[mid]</th><th>ενέργεια</th></tr>${r.steps.map((s, k) => `<tr><td>${k + 1}</td><td>${s.first}</td><td>${s.last}</td><td>${s.mid}</td><td>${s.v}</td><td>${s.v === x ? "βρέθηκε" : x < s.v ? `${x} &lt; ${s.v} → last = ${s.mid - 1}` : `${x} &gt; ${s.v} → first = ${s.mid + 1}`}</td></tr>`).join("")}</table>`;
    return { q: R`Στον ταξινομημένο πίνακα <code>{${a.join(", ")}}</code> ($N = ${n}$) εφαρμόζεται η <code>binary_search</code> του βιβλίου με target $= ${x}$. Γράψτε διαδοχικά τις τιμές του <code>mid</code> (χωρισμένες με κενό) και την τιμή που επιστρέφει η συνάρτηση.`,
      fields: [{ label: "Τιμές mid:", ans: mids.join(" "), text: true, ph: "π.χ. 7 3 5" }, { label: "Επιστρέφει:", ans: r.pos }],
      hint: R`Πρώτο mid = (0 + ${n - 1}) / 2 = ${Math.floor((n - 1) / 2)} (ακέραια διαίρεση).`,
      sol: R`${tbl}${r.pos >= 0 ? `Βρέθηκε στη θέση <b>${r.pos}</b>.` : `Τώρα first = ${r.first} &gt; last = ${r.last}: επιστρέφεται <b>-1</b>.`} Τιμές mid: <b>${mids.join(" ")}</b>.` };
  } },
  ib7gbub: { title: "Γεννήτρια — ταξινόμηση φυσαλίδας", make() {
    let a, R0; const desc = Math.random() < 0.3;
    do { a = ib7Rand(ri(5, 6), 1, 40); R0 = ib7Bubble(a, false, desc); } while (R0.passes.length < 3);
    const k = ri(1, Math.min(3, R0.passes.length - 2));
    const swk = R0.events.filter(e => e.pass === k && e.swap).length;
    return { q: R`Ο πίνακας <code>{${a.join(", ")}}</code> ταξινομείται σε <b>${desc ? "φθίνουσα" : "αύξουσα"}</b> σειρά με τη <code>bubblesort</code> του βιβλίου (με τη λογική μεταβλητή <code>sorted</code>, <code>if (arr[i]${desc ? "&lt;" : "&gt;"}arr[i+1])</code>). Πώς είναι ο πίνακας μετά ${k === 2 ? "τη" : "την"} <b>${k}η διάσχιση</b>, πόσες αντιμεταθέσεις έγιναν σε αυτή και πόσες διασχίσεις εκτελούνται συνολικά;`,
      fields: [{ label: `Μετά ${k === 2 ? "τη" : "την"} ${k}η:`, ans: ib7J(R0.passes[k - 1]), text: true }, { label: "Αντιμεταθέσεις στη διάσχιση:", ans: swk }, { label: "Διασχίσεις συνολικά:", ans: R0.passes.length }],
      hint: R`Σε κάθε διάσχιση συγκρίνουμε arr[i] με arr[i+1] για i = 0 … N−2. Η τελευταία διάσχιση γίνεται χωρίς αντιμεταθέσεις.`,
      sol: R`<table class="tbl"><tr><th>Διάσχιση</th><th>Πίνακας</th><th>αντιμεταθέσεις</th></tr>${R0.passes.map((p, t) => `<tr><td>${t + 1}</td><td><code>${ib7J(p)}</code></td><td>${R0.events.filter(e => e.pass === t + 1 && e.swap).length}</td></tr>`).join("")}</table>Μετά ${k === 2 ? "τη" : "την"} ${k}η διάσχιση: <b>${ib7J(R0.passes[k - 1])}</b> (${swk} αντιμεταθέσεις). Συνολικά <b>${R0.passes.length}</b> διασχίσεις — η τελευταία χωρίς αντιμεταθέσεις, οπότε η sorted μένει true.` };
  } },
  ib7gins: { title: "Γεννήτρια — ταξινόμηση με εισαγωγή", make() {
    const desc = Math.random() < 0.3, a = ib7Rand(ri(6, 7), 1, 40), R0 = ib7Insert(a, desc), k = ri(2, a.length - 2);
    const sh = R0.events.filter(e => e.i === k && e.kind === "shift").length;
    return { q: R`Ο πίνακας <code>{${a.join(", ")}}</code> ταξινομείται σε <b>${desc ? "φθίνουσα" : "αύξουσα"}</b> σειρά με την <code>insertionSort</code> του βιβλίου (<code>while (j&gt;=0 &amp;&amp; arr[j]${desc ? "&lt;" : "&gt;"}temp)</code>). Πώς είναι ο πίνακας στο τέλος της επανάληψης <code>i = ${k}</code> και πόσες μετακινήσεις <code>arr[j+1] = arr[j]</code> έγιναν σε αυτή την επανάληψη;`,
      fields: [{ label: `Μετά το i = ${k}:`, ans: ib7J(R0.steps[k - 1]), text: true }, { label: "Μετακινήσεις:", ans: sh }],
      hint: R`Στο τέλος της επανάληψης i τα στοιχεία arr[0…i] είναι ταξινομημένα μεταξύ τους.`,
      sol: R`<table class="tbl"><tr><th>i</th><th>temp</th><th>μετακινήσεις</th><th>Πίνακας</th></tr>${R0.steps.slice(0, k).map((p, t) => `<tr><td>${t + 1}</td><td>${a[t + 1]}</td><td>${R0.events.filter(e => e.i === t + 1 && e.kind === "shift").length}</td><td><code>${ib7J(p)}</code></td></tr>`).join("")}</table>Στο τέλος του i = ${k}: <b>${ib7J(R0.steps[k - 1])}</b> με <b>${sh}</b> μετακινήσεις.` };
  } },
  ib7gcnt: { title: "Γεννήτρια — συγκρίσεις αλγορίθμων ταξινόμησης", make() {
    const a = Math.random() < 0.25 ? ib7Rand(5, 1, 30).sort((p, q) => q - p) : ib7Rand(ri(4, 5), 1, 30), N = a.length;
    const t = ri(0, 3);
    if (t === 0) { const r = ib7Bubble(a); return { q: R`Πόσες συγκρίσεις <code>arr[i]&gt;arr[i+1]</code> και πόσες αντιμεταθέσεις κάνει η <code>bubblesort</code> του βιβλίου (με <code>sorted</code>, χωρίς βελτιστοποίηση) για τον πίνακα <code>{${a.join(", ")}}</code>;`, fields: [{ label: "Συγκρίσεις:", ans: r.comps }, { label: "Αντιμεταθέσεις:", ans: r.swaps }], hint: R`Κάθε διάσχιση κάνει N − 1 = ${N - 1} συγκρίσεις.`, sol: R`Ο πίνακας μετά από κάθε διάσχιση: ${r.passes.map(p => `<code>${ib7J(p)}</code>`).join(" → ")}. Σύνολο ${r.passes.length} διασχίσεις × ${N - 1} = <b>${r.comps}</b> συγκρίσεις, <b>${r.swaps}</b> αντιμεταθέσεις.` }; }
    if (t === 1) { const r = ib7Bubble(a, true); return { q: R`Πόσες συγκρίσεις κάνει η <b>βελτιστοποιημένη</b> <code>bubblesort</code> του βιβλίου (με <code>sorted</code> και <code>S--</code>) για τον πίνακα <code>{${a.join(", ")}}</code>;`, fields: [{ label: "Συγκρίσεις:", ans: r.comps }], hint: R`Στη διάσχιση k γίνονται S − 1 συγκρίσεις, με S = N − k + 1.`, sol: R`Διασχίσεις (συγκρίσεις → πίνακας): ${r.passes.map((p, k) => `${Math.max(0, N - k - 1)} συγκρ. → <code>${ib7J(p)}</code>`).join(" · ")}. Σύνολο <b>${r.comps}</b>.` }; }
    if (t === 2) { const r = ib7Bubble2(a); return { q: R`Πόσες συγκρίσεις και πόσες αντιμεταθέσεις κάνει η ταξινόμηση φυσαλίδας με <b>δύο βρόχους for</b> (σύγκριση <code>arr[i]&gt;arr[j]</code>, $j &gt; i$) για τον πίνακα <code>{${a.join(", ")}}</code>;`, fields: [{ label: "Συγκρίσεις:", ans: r.comps }, { label: "Αντιμεταθέσεις:", ans: r.swaps }], hint: R`Οι συγκρίσεις είναι πάντα N(N−1)/2.`, sol: R`Συγκρίσεις $\frac{${N}\cdot ${N - 1}}{2} = ${r.comps}$. Ο πίνακας μετά από κάθε i: ${r.passes.map(p => `<code>${ib7J(p)}</code>`).join(" → ")}, με <b>${r.swaps}</b> αντιμεταθέσεις συνολικά.` }; }
    const r = ib7Insert(a); return { q: R`Πόσες συγκρίσεις <code>arr[j]&gt;temp</code> και πόσες μετακινήσεις <code>arr[j+1]=arr[j]</code> κάνει η <code>insertionSort</code> του βιβλίου για τον πίνακα <code>{${a.join(", ")}}</code>;`, fields: [{ label: "Συγκρίσεις:", ans: r.comps }, { label: "Μετακινήσεις:", ans: r.shifts }], hint: R`Όταν το j γίνει -1 η σύγκριση arr[j]>temp δεν εκτελείται.`, sol: R`<table class="tbl"><tr><th>i</th><th>temp</th><th>Πίνακας</th></tr>${r.steps.map((p, t) => `<tr><td>${t + 1}</td><td>${a[t + 1]}</td><td><code>${ib7J(p)}</code></td></tr>`).join("")}</table>Σύνολο <b>${r.comps}</b> συγκρίσεις και <b>${r.shifts}</b> μετακινήσεις.` };
  } }
});

/* Πληροφορική Γ΄ — Γ7.7 Δισδιάστατοι πίνακες & Γ7.8 Εγγραφές: widgets & γεννήτριες (prefix ib9) */
const ib9Code = (src, on, title) => { const L = CPPlines(src), S = new Set([].concat(on || [])); return `<div class="cppbox sm">${title ? `<div class="cpptitle">${cppEsc(title)}</div>` : ""}<pre class="cpp"><code>${L.map((l, k) => `<span class="cl${S.has(k + 1) ? " on" : ""}"><i>${k + 1}</i>${l || " "}</span>`).join("")}</code></pre></div>`; };
const ib9Rand = (n, m, lo, hi) => Array.from({ length: n }, () => Array.from({ length: m }, () => ri(lo, hi)));
const ib9Alive = (box, fn) => { if (!box.isConnected) return false; fn(); return true; };
const ib9Num = v => (Math.round(v * 100) / 100).toString();
const ib9Btn = (cls, txt) => `<button class="btn ghost ${cls}">${txt}</button>`;
const ib9Setw = (v, w) => { const s = String(v); return " ".repeat(Math.max(0, w - s.length)) + s; };
const IB9_NAMES = ["Andreas", "Eleni", "Kostas", "Maria", "Nikos", "Sofia", "Petros", "Anna", "Giorgos", "Christina", "Marios", "Ioanna"];
const IB9_PROD = [["milk", 1.2], ["bread", 0.9], ["coffee", 12.5], ["honey", 15], ["rice", 2.4], ["olive_oil", 9.8], ["tea", 3.6], ["cheese", 7.5], ["pasta", 1.4], ["juice", 2.9]];

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 9.1 Γέμισμα & εμφάνιση 2D πίνακα με εμφωλευμένους βρόχους ---------- */
  ib9grid(box) {
    const FM = [
      ["(i+1)*(j+1)  — προπαίδεια", (i, j) => (i + 1) * (j + 1), "arr[i][j] = (i+1)*(j+1);"],
      ["num, num + 10  — 10, 20, 30, …", null, "arr[i][j] = num;\n        num = num + 10;"],
      ["i*COLS + j + 1  — 1, 2, 3, …", (i, j, C) => i * C + j + 1, "arr[i][j] = i*COLS + j + 1;"],
      ["i + j", (i, j) => i + j, "arr[i][j] = i + j;"],
      ["(i == j)  — μοναδιαίος", (i, j) => (i === j ? 1 : 0), "arr[i][j] = (i == j);"]];
    box.innerHTML = `<div class="wctl"><label>γραμμές <select class="r">${[2, 3, 4, 5].map(v => `<option${v === 3 ? " selected" : ""}>${v}</option>`).join("")}</select></label>
      <label>στήλες <select class="c">${[2, 3, 4, 5, 6].map(v => `<option${v === 4 ? " selected" : ""}>${v}</option>`).join("")}</select></label>
      <label>τιμή κελιού <select class="f">${FM.map((f, k) => `<option value="${k}">${f[0]}</option>`).join("")}</select></label>
      <label>σειρά <select class="o"><option value="0">γραμμή προς γραμμή (i έξω)</option><option value="1">στήλη προς στήλη (j έξω)</option></select></label></div>
      <div class="wctl">${ib9Btn("st", "▶ Βήμα")}${ib9Btn("go", "⏩ Εκτέλεση")}${ib9Btn("rs", "↺")}<span class="muted small vars"></span></div>
      <div class="code"></div><div class="grid"></div><div class="out"></div>`;
    let k = -1, timer = null;
    const P = () => ({ R: +$(".r", box).value, C: +$(".c", box).value, f: +$(".f", box).value, o: +$(".o", box).value });
    function order(p) { const L = []; if (p.o === 0) { for (let i = 0; i < p.R; i++) for (let j = 0; j < p.C; j++) L.push([i, j]); } else { for (let j = 0; j < p.C; j++) for (let i = 0; i < p.R; i++) L.push([i, j]); } return L; }
    function draw() {
      const p = P(), L = order(p), F = FM[p.f], M = Array.from({ length: p.R }, () => Array(p.C).fill(""));
      let num = 10;
      for (let t = 0; t <= k && t < L.length; t++) { const [i, j] = L[t]; M[i][j] = F[1] ? F[1](i, j, p.C) : num; if (!F[1]) num += 10; }
      const outer = p.o === 0 ? `for (int i=0; i<ROWS; i++)\n    for (int j=0; j<COLS; j++){` : `for (int j=0; j<COLS; j++)\n    for (int i=0; i<ROWS; i++){`;
      const src = `const int ROWS = ${p.R};\nconst int COLS = ${p.C};\nint arr[ROWS][COLS];${F[1] ? "" : "\nint num = 10;"}\n${outer}\n        ${F[2]}\n    }`;
      const ln = src.split("\n").length, bodyL = F[1] ? ln - 1 : ln - 2;
      $(".code", box).innerHTML = ib9Code(src, k >= 0 && k < L.length ? (F[1] ? [bodyL] : [bodyL, bodyL + 1]) : [], "fill");
      const cur = L[Math.min(k, L.length - 1)] || [-1, -1];
      $(".grid", box).innerHTML = ib9Mat(M, { cls: (i, j) => (k >= 0 && i === cur[0] && j === cur[1] && k < L.length) ? "hb cur" : M[i][j] === "" ? "dim" : "hl", tip: true });
      $(".vars", box).innerHTML = k < 0 ? "πάτησε ▶ για να ξεκινήσει ο βρόχος" : k < L.length ? `βήμα ${k + 1}/${L.length} · i = <b>${cur[0]}</b>, j = <b>${cur[1]}</b> → arr[${cur[0]}][${cur[1]}] = <b>${M[cur[0]][cur[1]]}</b>${F[1] ? "" : ` · num = ${num}`}` : `✔ ο πίνακας γέμισε (${L.length} κελιά)`;
      $(".out", box).innerHTML = k >= L.length - 1 ? OUT(M.map(r => r.map(v => ib9Setw(v, 4)).join("")).join("\n"), "print_array με setw(4)") : "";
    }
    const stop = () => { clearInterval(timer); timer = null; };
    $(".st", box).onclick = () => { stop(); if (k < P().R * P().C - 1) k++; draw(); };
    $(".go", box).onclick = () => { stop(); if (k >= P().R * P().C - 1) k = -1; timer = setInterval(() => { if (!ib9Alive(box, () => { k++; draw(); }) || k >= P().R * P().C - 1) stop(); }, 380); };
    $(".rs", box).onclick = () => { stop(); k = -1; draw(); };
    box.querySelectorAll("select").forEach(s => s.onchange = () => { stop(); k = -1; draw(); });
    draw();
  },

  /* ---------- 9.2 Διαγώνιοι & περιοχές τετραγωνικού πίνακα ---------- */
  ib9diag(box) {
    const RG = [["κύρια διαγώνιος", "i == j", (i, j, N) => i === j], ["πάνω από την κύρια", "i < j", (i, j) => i < j], ["κάτω από την κύρια", "i > j", (i, j) => i > j],
      ["δευτερεύουσα διαγώνιος", "i + j == N-1", (i, j, N) => i + j === N - 1], ["πάνω από τη δευτερεύουσα", "i + j < N-1", (i, j, N) => i + j < N - 1], ["κάτω από τη δευτερεύουσα", "i + j > N-1", (i, j, N) => i + j > N - 1],
      ["και οι δύο διαγώνιοι", "i == j || i + j == N-1", (i, j, N) => i === j || i + j === N - 1], ["κύρια ή πάνω (τριγωνικό)", "i <= j", (i, j) => i <= j]];
    box.innerHTML = `<div class="wctl"><label>N = <input type="range" class="n" min="3" max="7" value="5"> <b class="nv">5</b></label>
      <label>περιοχή <select class="g">${RG.map((r, k) => `<option value="${k}">${r[0]}</option>`).join("")}</select></label>
      <label>πράξη <select class="a"><option value="0">άθροισμα s += a[i][j]</option><option value="1">πλήθος cnt++</option></select></label>${ib9Btn("nw", "🎲 Νέες τιμές")}</div>
      <div class="figrow"><div class="grid"></div><div class="code"></div></div><div class="wout"></div>
      <p class="muted small">👆 Άγγιξε/πέρασε τον δείκτη πάνω από ένα κελί για να δεις τους δείκτες του και ποιες συνθήκες ικανοποιεί.</p>`;
    let M = ib9Rand(7, 7, 0, 9), hov = null;
    function draw() {
      const N = +$(".n", box).value, g = RG[+$(".g", box).value], sum = +$(".a", box).value === 0;
      $(".nv", box).textContent = N;
      const A = M.slice(0, N).map(r => r.slice(0, N)); let s = 0, c = 0, terms = [];
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (g[2](i, j, N)) { s += A[i][j]; c++; terms.push(A[i][j]); }
      $(".grid", box).innerHTML = ib9Mat(A, { cls: (i, j) => (g[2](i, j, N) ? (i === j && i + j === N - 1 && /και οι δύο/.test(g[0]) ? "hp" : (/δευτερ/.test(g[0]) ? "hg" : "ha")) : "") + (hov && hov[0] === i && hov[1] === j ? " cur" : "") });
      $(".code", box).innerHTML = ib9Code(`const int N = ${N};\n${sum ? "int s = 0;" : "int cnt = 0;"}\nfor (int i = 0; i < N; i++)\n    for (int j = 0; j < N; j++)\n        if (${g[1]})\n            ${sum ? "s += a[i][j];" : "cnt++;"}`, [5, 6]);
      let hv = "";
      if (hov && hov[0] < N && hov[1] < N) { const [i, j] = hov; hv = `<br>Κελί <b>a[${i}][${j}]</b> = ${A[i][j]} · i + j = ${i + j} · ${RG.slice(0, 6).filter(r => r[2](i, j, N)).map(r => r[0]).join(", ")}`; }
      $(".wout", box).innerHTML = `Συνθήκη <code>${cppEsc(g[1])}</code> → <b>${c}</b> στοιχεία${sum ? ` · άθροισμα s = ${terms.join(" + ") || 0} = <b>${s}</b>` : ""}.${N % 2 && /και οι δύο/.test(g[0]) ? ` Το κεντρικό a[${(N - 1) / 2}][${(N - 1) / 2}] (μωβ) μετρά <b>μία</b> φορά.` : ""}${hv}`;
      box.querySelectorAll(".grid td").forEach((td, q) => { const i = Math.floor(q / N), j = q % N; td.onpointerenter = () => { if (hov && hov[0] === i && hov[1] === j) return; hov = [i, j]; draw(); }; });
    }
    $(".nw", box).onclick = () => { M = ib9Rand(7, 7, 0, 9); draw(); };
    box.querySelectorAll("input,select").forEach(e => e.oninput = e.onchange = () => { hov = null; draw(); });
    draw();
  },

  /* ---------- 9.3 Μέγιστο στήλης / ελάχιστο γραμμής / αθροίσματα ---------- */
  ib9rc(box) {
    box.innerHTML = `<div class="wctl"><label>λειτουργία <select class="md"><option value="0">μέγιστο στήλης (find_col_max)</option><option value="1">ελάχιστο γραμμής (find_row_min)</option><option value="2">αθροίσματα γραμμών & στηλών</option></select></label>
      <label class="lk">στήλη/γραμμή <select class="k"></select></label><label class="li">αρχική τιμή <select class="ini"><option value="0">maxV = 0</option><option value="1">maxV = arr[0][col]</option></select></label>
      <label><input type="checkbox" class="neg"> με αρνητικούς</label></div>
      <div class="wctl">${ib9Btn("st", "▶ Βήμα")}${ib9Btn("go", "⏩ Εκτέλεση")}${ib9Btn("rs", "↺")}${ib9Btn("nw", "🎲 Νέος πίνακας")}</div>
      <div class="figrow"><div class="grid"></div><div class="code"></div></div><div class="wout"></div>`;
    const R0 = 4, C0 = 5; let M, k = -1, timer = null;
    const gen = () => { M = ib9Rand(R0, C0, $(".neg", box).checked ? -9 : 1, $(".neg", box).checked ? -1 : 30); if ($(".neg", box).checked) M = M.map(r => r.map(v => ri(0, 3) ? v : ri(1, 9))); };
    function fillK() { const md = +$(".md", box).value, n = md === 0 ? C0 : R0; $(".k", box).innerHTML = Array.from({ length: n }, (_, t) => `<option>${t}</option>`).join(""); $(".lk", box).style.display = md === 2 ? "none" : ""; $(".li", box).style.display = md === 2 ? "none" : "";
      $(".ini", box).innerHTML = md === 1 ? `<option value="0">minV = 0</option><option value="1">minV = arr[row][0]</option>` : `<option value="0">maxV = 0</option><option value="1">maxV = arr[0][col]</option>`; }
    function steps() { const md = +$(".md", box).value; return (md === 0 ? R0 : md === 1 ? C0 : R0 * C0) - (md < 2 && +$(".ini", box).value ? 1 : 0); }
    function draw() {
      const md = +$(".md", box).value, K = +$(".k", box).value || 0, ini = +$(".ini", box).value, n = md === 0 ? R0 : md === 1 ? C0 : R0 * C0, t = k < 0 ? -1 : Math.min(k + (md < 2 && ini ? 1 : 0), n - 1);
      if (md === 2) {
        const rs = Array(R0).fill(0), cs = Array(C0).fill(0);
        for (let q = 0; q <= t; q++) { const i = Math.floor(q / C0), j = q % C0; rs[i] += M[i][j]; cs[j] += M[i][j]; }
        const ci = t >= 0 ? [Math.floor(t / C0), t % C0] : [-1, -1];
        $(".grid", box).innerHTML = ib9Mat(M, { cls: (i, j) => i === ci[0] && j === ci[1] ? "hb cur" : (i * C0 + j <= t ? "hl" : ""), rowx: rs, rowxh: "Σ", colx: cs, colxh: "Σ" });
        $(".code", box).innerHTML = ib9Code(`for (int i=0; i<ROWS; i++)\n    for (int j=0; j<COLS; j++){\n        sum_of_rows[i] += arr[i][j];\n        sum_of_cols[j] += arr[i][j];\n    }`, t >= 0 && t < n ? [3, 4] : []);
        $(".wout", box).innerHTML = t < 0 ? "Πάτησε ▶: κάθε στοιχείο προστίθεται <b>και</b> στο άθροισμα της γραμμής του <b>και</b> στης στήλης του." : t < n - 1 ? `arr[${ci[0]}][${ci[1]}] = ${M[ci[0]][ci[1]]} → sum_of_rows[${ci[0]}] = ${rs[ci[0]]}, sum_of_cols[${ci[1]}] = ${cs[ci[1]]}` : `✔ Γραμμές: ${rs.join(", ")} · Στήλες: ${cs.join(", ")}`;
        return;
      }
      const col = md === 0, cellOf = q => col ? [q, K] : [K, q];
      let best = ini ? (col ? M[0][K] : M[K][0]) : 0, bestAt = ini ? 0 : -1;
      const start = ini ? 1 : 0;
      for (let q = start; q <= t; q++) { const [i, j] = cellOf(q); if (col ? M[i][j] > best : M[i][j] < best) { best = M[i][j]; bestAt = q; } }
      const cur = t >= start ? cellOf(t) : [-1, -1], ba = bestAt >= 0 ? cellOf(bestAt) : [-1, -1];
      $(".grid", box).innerHTML = ib9Mat(M, { cls: (i, j) => (i === cur[0] && j === cur[1] ? "cur " : "") + (i === ba[0] && j === ba[1] && k >= 0 ? "ha" : (col ? j === K : i === K) ? "hl" : "") });
      const v = col ? "maxV" : "minV", el = col ? "arr[i][col]" : "arr[row][j]", L = col ? "for (int i=" + (ini ? 1 : 0) + "; i<ROWS; i++)" : "for (int j=" + (ini ? 1 : 0) + "; j<COLS; j++)";
      $(".code", box).innerHTML = ib9Code(`int ${v} = ${ini ? (col ? "arr[0][col]" : "arr[row][0]") : "0"};\n${L}\n    if (${el} ${col ? ">" : "<"} ${v})\n        ${v} = ${el};\nreturn ${v};`, k < 0 ? [1] : t < n - 1 ? [3] : [5]);
      const real = col ? Math.max(...M.map(r => r[K])) : Math.min(...M[K]);
      $(".wout", box).innerHTML = (k < 0 ? `${v} = <b>${best}</b>. Πάτησε ▶.` : t < n - 1 ? `${col ? `i = ${t}` : `j = ${t}`}: ${el.replace("i", t).replace("j", t).replace("col", K).replace("row", K)} = ${col ? M[t][K] : M[K][t]} → ${v} = <b>${best}</b>` : `✔ Επιστρέφεται ${v} = <b>${best}</b>. ${best === real ? "Σωστό!" : `<span class="warnc">Λάθος! Το πραγματικό ${col ? "μέγιστο" : "ελάχιστο"} είναι ${real}: η αρχικοποίηση με 0 αποτυγχάνει ${col ? "όταν όλα τα στοιχεία είναι αρνητικά" : "όταν όλα τα στοιχεία είναι θετικά"}.</span>`}`);
    }
    const stop = () => { clearInterval(timer); timer = null; };
    $(".st", box).onclick = () => { stop(); if (k < steps() - 1) k++; draw(); };
    $(".go", box).onclick = () => { stop(); if (k >= steps() - 1) k = -1; timer = setInterval(() => { if (!ib9Alive(box, () => { k++; draw(); }) || k >= steps() - 1) stop(); }, 420); };
    $(".rs", box).onclick = () => { stop(); k = -1; draw(); };
    $(".nw", box).onclick = () => { stop(); gen(); k = -1; draw(); };
    $(".neg", box).onchange = () => { stop(); gen(); k = -1; draw(); };
    $(".md", box).onchange = () => { stop(); fillK(); k = -1; draw(); };
    [".k", ".ini"].forEach(s => $(s, box).onchange = () => { stop(); k = -1; draw(); });
    gen(); fillK(); draw();
  },

  /* ---------- 10.1 Εγγραφή: ορισμός, μέλη, τελεστής τελεία ---------- */
  ib9struct(box) {
    const T = {
      product: { mem: [["int", "code", 101], ["int", "quantity", 50], ["string", "description", "ambrosia"], ["double", "price", 1.99]], v: "apple",
        ex: [["apple.quantity * apple.price", o => ib9Num(o.quantity * o.price)], ["apple.description.length()", o => String(o.description).length], ["apple.code + 1", o => +o.code + 1], ["apple.description.substr(0, 3)", o => String(o.description).substr(0, 3)]] },
      student: { mem: [["int", "am", 1001], ["string", "name", "Jones"], ["double", "grade", 18.5], ["bool", "ekt", 0]], v: "st1",
        ex: [["st1.grade >= 10", o => (+o.grade >= 10 ? 1 : 0)], ["st1.name + \"!\"", o => o.name + "!"], ["st1.am % 100", o => +o.am % 100], ["st1.ekt", o => (+o.ekt ? 1 : 0)]] },
      point: { mem: [["int", "x", 3], ["int", "y", 8]], v: "a",
        ex: [["a.x + a.y", o => +o.x + +o.y], ["a.x * a.y", o => o.x * o.y], ["a.y / a.x", o => (+o.x === 0 ? "σφάλμα (διαίρεση με 0)" : Math.trunc(o.y / o.x))], ["a.y % a.x", o => (+o.x === 0 ? "σφάλμα" : (o.y % o.x))]] }
    };
    box.innerHTML = `<div class="wctl"><label>εγγραφή <select class="t">${Object.keys(T).map(t => `<option>${t}</option>`).join("")}</select></label><label>έκφραση <select class="e"></select></label></div>
      <div class="vals wctl"></div><div class="figrow"><div class="ib9rec card1"></div><div class="out"></div></div><div class="code"></div>`;
    let o = {};
    function build() {
      const t = T[$(".t", box).value]; o = {}; t.mem.forEach(m => o[m[1]] = m[2]);
      $(".e", box).innerHTML = t.ex.map((x, k) => `<option value="${k}">${cppEsc(x[0])}</option>`).join("");
      $(".vals", box).innerHTML = t.mem.map(m => `<label><code>${t.v}.${m[1]}</code> <input data-m="${m[1]}" type="${m[0] === "string" ? "text" : "number"}" ${m[0] === "bool" ? 'min="0" max="1"' : ""} value="${m[2]}" style="width:${m[0] === "string" ? 110 : 80}px"></label>`).join("");
      box.querySelectorAll(".vals input").forEach(inp => inp.oninput = () => { const mm = t.mem.find(q => q[1] === inp.dataset.m); let v = inp.value; if (mm[0] === "int" || mm[0] === "bool") v = Math.trunc(+v || 0); if (mm[0] === "bool") v = v ? 1 : 0; if (mm[0] === "double") v = +v || 0; if (mm[0] === "string") v = v.replace(/\s+/g, "_"); o[inp.dataset.m] = v; draw(); });
      draw();
    }
    function draw() {
      const nm = $(".t", box).value, t = T[nm], ex = t.ex[+$(".e", box).value || 0];
      const by = {}; t.mem.forEach(m => (by[m[0]] = by[m[0]] || []).push(m[1]));
      const def = `struct ${nm} {\n${Object.entries(by).map(([ty, ns]) => `    ${ty} ${ns.join(", ")};`).join("\n")}\n};`;
      const asg = t.mem.map(m => `    ${t.v}.${m[1]} = ${m[0] === "string" ? `"${o[m[1]]}"` : o[m[1]]};`).join("\n");
      $(".code", box).innerHTML = ib9Code(`${def}\nint main(){\n    ${nm} ${t.v};\n${asg}\n    cout << ${ex[0]};\n    return 0;\n}`, [Object.keys(by).length + 3 + t.mem.length + 2]);
      $(".card1", box).innerHTML = ib9Card(t.v, t.mem.map(m => [m[1], m[0] === "string" ? `"${o[m[1]]}"` : String(o[m[1]])]), nm, "on");
      $(".out", box).innerHTML = OUT(String(ex[1](o))) + `<p class="muted small">Ο ορισμός δημιουργεί τον <b>τύπο</b> <code>${nm}</code>· η <code>${t.v}</code> είναι <b>μεταβλητή</b> αυτού του τύπου και κάθε μέλος της προσπελαύνεται με τελεία.</p>`;
    }
    $(".t", box).onchange = build; $(".e", box).onchange = draw;
    build();
  },

  /* ---------- 10.2 Πίνακας εγγραφών: ερωτήματα με βρόχο ---------- */
  ib9rec(box) {
    box.innerHTML = `<div class="wctl"><label>αν <select class="fd"><option value="price">shop[i].price</option><option value="qty">shop[i].qty</option><option value="code">shop[i].code</option></select></label>
      <label><select class="op"><option>&gt;</option><option>&lt;</option><option>&gt;=</option><option>&lt;=</option><option>==</option></select></label><label><input type="number" class="v" value="10" step="0.5" style="width:80px"></label>
      <label>τότε <select class="ac"><option value="0">cnt++ (πλήθος)</option><option value="1">εμφάνισε name</option><option value="2">total += price*qty</option></select></label>${ib9Btn("nw", "🎲 Νέα δεδομένα")}</div>
      <div class="figrow"><div class="tb"></div><div class="code"></div></div><div class="out"></div>`;
    let D;
    const gen = () => { const P = shuffle(IB9_PROD.slice()).slice(0, 6); D = P.map((p, i) => ({ code: 101 + i, name: p[0], price: p[1], qty: ri(1, 12) * 5 - ri(0, 4) })); };
    function draw() {
      const fd = $(".fd", box).value, op = $(".op", box).value, v = +$(".v", box).value, ac = +$(".ac", box).value;
      const test = x => op === ">" ? x > v : op === "<" ? x < v : op === ">=" ? x >= v : op === "<=" ? x <= v : x === v;
      const hit = D.map(d => test(d[fd]));
      $(".tb", box).innerHTML = `<div class="ib9m"><table><tr><th>i</th><th>.code</th><th>.name</th><th>.price</th><th>.qty</th></tr>${D.map((d, i) => `<tr><th>${i}</th>${["code", "name", "price", "qty"].map(f => `<td class="${hit[i] ? (f === fd ? "hb" : "hl") : ""}">${f === "price" ? d.price.toFixed(2) : d[f]}</td>`).join("")}</tr>`).join("")}</table></div>`;
      const body = ["cnt++;", "cout << shop[i].name << \" \";", "total += shop[i].price * shop[i].qty;"][ac];
      $(".code", box).innerHTML = ib9Code(`struct product {\n    int code;\n    string name;\n    double price;\n    int qty;\n} shop[6];\n...\n${ac === 0 ? "int cnt = 0;\n" : ac === 2 ? "double total = 0;\n" : ""}for (int i=0; i<6; i++)\n    if (shop[i].${fd} ${op} ${v})\n        ${body}${ac === 0 ? "\ncout << cnt;" : ac === 2 ? "\ncout << total;" : ""}`, [], "πίνακας εγγραφών");
      const H = D.filter((_, i) => hit[i]);
      const out = ac === 0 ? String(H.length) : ac === 1 ? H.map(d => d.name).join(" ") : ib9Num(H.reduce((s, d) => s + d.price * d.qty, 0));
      $(".out", box).innerHTML = OUT(out || " ") + `<p class="muted small">Οι μπλε/γαλάζιες γραμμές ικανοποιούν τη συνθήκη (${H.length} από 6). Ο δείκτης γράφεται μετά το όνομα του πίνακα: <code>shop[i].${fd}</code>.</p>`;
    }
    $(".nw", box).onclick = () => { gen(); draw(); };
    box.querySelectorAll("input,select").forEach(e => e.oninput = e.onchange = draw);
    gen(); draw();
  },

  /* ---------- 10.3 Αναζήτηση & ταξινόμηση πίνακα εγγραφών ---------- */
  ib9sort(box) {
    box.innerHTML = `<div class="wctl"><label>αλγόριθμος <select class="al"><option value="0">ταξινόμηση με εισαγωγή</option><option value="1">ταξινόμηση φυσαλίδας</option><option value="2">σειριακή αναζήτηση (κωδικός)</option></select></label>
      <label class="lo">σειρά <select class="or"><option value="0">φθίνουσα (μεγαλύτερο F πρώτα)</option><option value="1">αύξουσα</option></select></label>
      <label class="lk" style="display:none">key = <input type="number" class="key" style="width:80px"></label>${ib9Btn("nw", "🎲 Νέα δεδομένα")}</div>
      <div class="wctl">${ib9Btn("st", "▶ Βήμα")}${ib9Btn("go", "⏩ Εκτέλεση")}${ib9Btn("rs", "↺")}<span class="muted small cnt"></span></div>
      <div class="cards ib9rec"></div><div class="wout"></div><div class="code"></div>`;
    let D, S, k = 0, timer = null;
    const gen = () => { const nm = shuffle(IB9_NAMES.slice()).slice(0, 6); D = nm.map((n, i) => ({ code: 200 + ri(1, 9) * 10 + i, name: n, F: ri(12, 20) })); $(".key", box).value = D[ri(0, 5)].code; };
    /* καταγραφή βημάτων: {A, i, j, msg, line, mark:{idx:cls}} */
    function record() {
      const al = +$(".al", box).value, desc = +$(".or", box).value === 0, A = D.map(d => ({ ...d })), st = [], snap = (msg, line, mark, extra) => st.push({ A: A.map(d => ({ ...d })), msg, line, mark: mark || {}, ...extra });
      const before = (x, y) => desc ? x.F < y.F : x.F > y.F; let cmp = 0, mv = 0;
      if (al === 0) {
        snap("Αρχικός πίνακας εγγραφών A3.", 0);
        for (let i = 1; i < A.length; i++) {
          const temp = A[i]; let j = i - 1; snap(`i = ${i}: temp = A3[${i}] (${temp.name}, F = ${temp.F})`, 5, { [i]: "mv" }, { temp });
          while (j >= 0) { cmp++; if (!before(A[j], temp)) { snap(`A3[${j}].F = ${A[j].F} ${desc ? "<" : ">"} ${temp.F}; ✗ → σταματά`, 7, { [j]: "on" }, { temp, cmp, mv }); break; }
            A[j + 1] = A[j]; mv++; snap(`A3[${j}].F = ${A[j].F} ${desc ? "<" : ">"} ${temp.F} ✓ → A3[${j + 1}] = A3[${j}] (μετακίνηση δεξιά)`, 8, { [j + 1]: "on" }, { temp, cmp, mv }); j--; }
          A[j + 1] = temp; snap(`A3[${j + 1}] = temp (${temp.name})`, 11, { [j + 1]: "mv" }, { cmp, mv });
        }
      } else if (al === 1) {
        snap("Αρχικός πίνακας εγγραφών.", 0);
        const n = A.length; let sorted, pass = 0;
        do { sorted = true; pass++;
          for (let j = 0; j < n - 1; j++) { cmp++;
            if (before(A[j], A[j + 1])) { const t = A[j]; A[j] = A[j + 1]; A[j + 1] = t; mv++; sorted = false; snap(`πέρασμα ${pass}: A[${j}].F με A[${j + 1}].F → ανταλλαγή ολόκληρων εγγραφών, sorted = false`, 7, { [j]: "mv", [j + 1]: "mv" }, { cmp, mv }); }
            else snap(`πέρασμα ${pass}: A[${j}].F = ${A[j].F} με A[${j + 1}].F = ${A[j + 1].F} → σωστή σειρά`, 5, { [j]: "on", [j + 1]: "on" }, { cmp, mv }); }
          snap(sorted ? `τέλος περάσματος ${pass}: καμία ανταλλαγή → sorted = true, ο βρόχος do…while τερματίζει` : `τέλος περάσματος ${pass}: έγιναν ανταλλαγές → νέο πέρασμα`, 11, {}, { cmp, mv });
        } while (!sorted);
      } else {
        const key = +$(".key", box).value; snap(`Αναζητούμε key = ${key}.`, 0);
        let found = -1;
        for (let i = 0; i < A.length; i++) { cmp++; if (A[i].code === key) { found = i; snap(`sch[${i}].code == ${key} ✓ → return ${i}`, 4, { [i]: "mv" }, { cmp }); break; } snap(`sch[${i}].code = ${A[i].code} ≠ ${key}`, 3, { [i]: "on" }, { cmp }); }
        if (found < 0) snap(`Τέλος πίνακα → return -1 · «School not found»`, 5, {}, { cmp });
      }
      return st;
    }
    const SRC = () => { const al = +$(".al", box).value, desc = +$(".or", box).value === 0;
      return al === 0 ? `void sort_struct( ) {\n    student temp;\n    int j;\n    for (int i=1; i<N; i++){\n        temp = A3[i];\n        j = i - 1;\n        while (j>=0 && A3[j].F${desc ? "<" : ">"}temp.F){\n            A3[j+1] = A3[j];\n            j--;\n        }\n        A3[j+1] = temp;\n    }\n}`
        : al === 1 ? `bool sorted;\ndo {\n    sorted = true;\n    for (int j = 0; j < N-1; j++)\n        if (A[j].F ${desc ? "<" : ">"} A[j+1].F){\n            student temp = A[j];\n            A[j] = A[j+1];\n            A[j+1] = temp;\n            sorted = false;\n        }\n} while (!sorted);`
        : `int find_school(school sch[], int key, int N){\n    for (int i=0; i<N; i++)\n        if (key == sch[i].code)\n            return i;\n    return -1;\n}`; };
    function draw() {
      const al = +$(".al", box).value; $(".lo", box).style.display = al === 2 ? "none" : ""; $(".lk", box).style.display = al === 2 ? "" : "none";
      const s = S[Math.min(k, S.length - 1)];
      $(".cards", box).innerHTML = s.A.map((d, i) => ib9Card(`A[${i}]`, al === 2 ? [["code", d.code], ["name", d.name]] : [["name", d.name], ["F", d.F]], "", s.mark[i] || "")).join("") + (s.temp ? ib9Card("temp", [["name", s.temp.name], ["F", s.temp.F]], "student", "mv") : "");
      $(".code", box).innerHTML = ib9Code(SRC(), s.line ? [s.line] : []);
      $(".wout", box).innerHTML = `<b>Βήμα ${Math.min(k, S.length - 1) + 1}/${S.length}:</b> ${s.msg}`;
      $(".cnt", box).textContent = `συγκρίσεις: ${s.cmp || 0}${al === 2 ? "" : ` · ${al === 0 ? "μετακινήσεις (A3[j+1] = A3[j])" : "ανταλλαγές"}: ${s.mv || 0}`}`;
    }
    const stop = () => { clearInterval(timer); timer = null; };
    const reset = () => { stop(); S = record(); k = 0; draw(); };
    $(".st", box).onclick = () => { stop(); if (k < S.length - 1) k++; draw(); };
    $(".go", box).onclick = () => { stop(); if (k >= S.length - 1) k = 0; timer = setInterval(() => { if (!ib9Alive(box, () => { k++; draw(); }) || k >= S.length - 1) stop(); }, 650); };
    $(".rs", box).onclick = reset;
    $(".nw", box).onclick = () => { gen(); reset(); };
    box.querySelectorAll("select,input").forEach(e => e.onchange = reset);
    gen(); reset();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  /* 9.1 */
  ib9cell: { title: "Γεννήτρια — στοιχεία δισδιάστατου πίνακα", make() {
    const t = ri(0, 2);
    if (t === 0) {
      const NR = ri(2, 3), C = ri(3, 4), rows = Array.from({ length: NR }, () => Array.from({ length: ri(1, C) }, () => ri(1, 9)));
      const M = rows.map(r => r.concat(Array(C - r.length).fill(0)));
      let a, b; do { a = [ri(0, NR - 1), ri(0, C - 1)]; b = [ri(0, NR - 1), ri(0, C - 1)]; } while (a[0] === b[0] && a[1] === b[1]);
      const init = `int a[${NR}][${C}] = { ${rows.map(r => `{${r.join(",")}}`).join(",")} };`;
      return { q: R`Δίνεται η δήλωση${CPP(init, { nonum: true })}Να βρείτε την τιμή του <code>a[${a[0]}][${a[1]}]</code> και της παράστασης <code>a[${a[0]}][${a[1]}] * 2 + a[${b[0]}][${b[1]}]</code>.`,
        fields: [{ label: `a[${a[0]}][${a[1]}] =`, ans: M[a[0]][a[1]] }, { label: "Παράσταση =", ans: M[a[0]][a[1]] * 2 + M[b[0]][b[1]] }],
        hint: R`Όσα στοιχεία κάθε γραμμής δεν πήραν τιμή γίνονται 0.`, sol: R`${ib9Mat(M, { cls: (i, j) => i === a[0] && j === a[1] ? "hb" : i === b[0] && j === b[1] ? "hg" : "" })}<code>a[${a[0]}][${a[1]}]</code> = ${M[a[0]][a[1]]}· παράσταση = ${M[a[0]][a[1]]}·2 + ${M[b[0]][b[1]]} = <b>${M[a[0]][a[1]] * 2 + M[b[0]][b[1]]}</b>.` };
    }
    const NR = 3, C = ri(3, 4), m0 = ri(1, 20), d = ri(3, 5), st = bkPick([2, 3, 4, 5, 6, 7].filter(v => gcdI(v, d) === 1)), add = ri(0, 3), row = ri(0, 2), M = [];
    let m = m0; for (let i = 0; i < NR; i++) { M.push([]); for (let j = 0; j < C; j++) { M[i].push((m + add) % d); m += st; } }
    if (t === 1) {
      return { q: R`Τι θα εμφανίσει το τμήμα προγράμματος; (Γράψε τους αριθμούς χωρισμένους με κενό.)${CPP(`
int t[${NR}][${C}];
int m = ${m0};
for (int i = 0; i < ${NR}; i++)
    for (int j = 0; j < ${C}; j++){
        t[i][j] = (m + ${add}) % ${d};
        m += ${st};
    }
for (int j = 0; j < ${C}; j++)
    cout << t[${row}][j] << " ";`)}`, fields: [{ label: "Έξοδος:", ans: M[row].join(" "), text: true }],
        hint: R`Το m αυξάνεται κατά ${st} σε κάθε κελί, γραμμή προς γραμμή.`, sol: R`${ib9Mat(M, { cls: i => i === row ? "hb" : "", cap: "Πίνακας t" })}${OUT(M[row].join(" "))}` };
    }
    const T = M[0].map((_, j) => M.map(r => r[j])), col = ri(0, C - 1);
    return { q: R`Ο πίνακας <code>t[${NR}][${C}]</code> γέμισε όπως φαίνεται. Ο κώδικας <code>for (int i=0; i&lt;${NR}; i++) for (int j=0; j&lt;${C}; j++) AT[j][i] = t[i][j];</code> δημιουργεί τον ανάστροφο <code>AT</code>. Ποια είναι η γραμμή <code>${col}</code> του <code>AT</code>;${ib9Mat(M, { cap: "Πίνακας t" })}`,
      fields: [{ label: `Γραμμή ${col} του AT:`, ans: T[col].join(" "), text: true }],
      hint: R`Η γραμμή ${col} του ανάστροφου είναι η στήλη ${col} του t.`, sol: R`${ib9Mat(T, { cls: i => i === col ? "hb" : "", cap: "AT" })}Η στήλη ${col} του t γίνεται γραμμή: <b>${T[col].join(" ")}</b>.` };
  } },
  /* 9.2 */
  ib9dg: { title: "Γεννήτρια — διαγώνιοι τετραγωνικού πίνακα", make() {
    const N = ri(3, 5), M = ib9Rand(N, N, 0, 9);
    const RG = [["της κύριας διαγωνίου", "i == j", (i, j) => i === j], ["της δευτερεύουσας διαγωνίου", "i + j == N-1", (i, j) => i + j === N - 1], ["πάνω από την κύρια διαγώνιο", "i < j", (i, j) => i < j],
      ["κάτω από την κύρια διαγώνιο", "i > j", (i, j) => i > j], ["πάνω από τη δευτερεύουσα διαγώνιο", "i + j < N-1", (i, j) => i + j < N - 1], ["κάτω από τη δευτερεύουσα διαγώνιο", "i + j > N-1", (i, j) => i + j > N - 1]];
    const g = bkPick(RG); let s = 0, c = 0; const terms = [];
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (g[2](i, j)) { s += M[i][j]; c++; terms.push(M[i][j]); }
    return { q: R`Για τον πίνακα <code>a[${N}][${N}]</code> να βρείτε το πλήθος και το άθροισμα των στοιχείων ${g[0]}.${ib9Mat(M)}`,
      fields: [{ label: "Πλήθος:", ans: c }, { label: "Άθροισμα:", ans: s }],
      hint: R`Συνθήκη: <code>${cppEsc(g[1])}</code> (N = ${N}).`, sol: R`${ib9Mat(M, { cls: (i, j) => g[2](i, j) ? "ha" : "" })}Συνθήκη <code>${cppEsc(g[1])}</code>: ${c} στοιχεία, άθροισμα $${terms.join(" + ")} = ${s}$.` };
  } },
  /* 9.3 */
  ib9rcg: { title: "Γεννήτρια — γραμμές και στήλες", make() {
    const NR = ri(3, 4), C = ri(3, 5), M = ib9Rand(NR, C, -5, 25), r = ri(0, NR - 1), c = ri(0, C - 1), t = ri(0, 1);
    const rs = M[r].reduce((a, b) => a + b, 0), cm = Math.max(...M.map(x => x[c])), rm = Math.min(...M[r]), cs = M.reduce((a, x) => a + x[c], 0);
    if (t === 0) return { q: R`Για τον πίνακα <code>arr[${NR}][${C}]</code>, να βρείτε το άθροισμα της γραμμής ${r} και το μέγιστο στοιχείο της στήλης ${c}.${ib9Mat(M)}`,
      fields: [{ label: `Άθροισμα γραμμής ${r}:`, ans: rs }, { label: `Μέγιστο στήλης ${c}:`, ans: cm }],
      hint: R`Γραμμή: σταθερό i = ${r}. Στήλη: σταθερό j = ${c}.`, sol: R`${ib9Mat(M, { cls: (i, j) => i === r && j === c ? "hp" : i === r ? "hb" : j === c ? "hg" : "" })}Γραμμή ${r}: ${M[r].join(" + ").replace(/\+ -/g, "− ")} = <b>${rs}</b>. Στήλη ${c}: {${M.map(x => x[c]).join(", ")}} → μέγιστο <b>${cm}</b>.` };
    return { q: R`Για τον πίνακα <code>arr[${NR}][${C}]</code>, να βρείτε το ελάχιστο στοιχείο της γραμμής ${r} και το άθροισμα της στήλης ${c} (<code>sum_of_cols[${c}]</code>).${ib9Mat(M)}`,
      fields: [{ label: `Ελάχιστο γραμμής ${r}:`, ans: rm }, { label: `sum_of_cols[${c}] =`, ans: cs }],
      hint: R`Ελάχιστο: ξεκίνα από arr[${r}][0]. Άθροισμα στήλης: όλα τα arr[i][${c}].`, sol: R`${ib9Mat(M, { cls: (i, j) => i === r && j === c ? "hp" : i === r ? "hb" : j === c ? "hg" : "" })}Γραμμή ${r}: {${M[r].join(", ")}} → ελάχιστο <b>${rm}</b>. Στήλη ${c}: άθροισμα <b>${cs}</b>.` };
  } },
  /* 10.1 */
  ib9sm: { title: "Γεννήτρια — μέλη εγγραφής", make() {
    const t = ri(0, 1);
    if (t === 0) {
      const ax = ri(1, 9), ay = ri(1, 9), bx = ri(1, 9), by = ri(1, 9), sw = ri(0, 1), k = ri(2, 5);
      let A = { x: ax, y: ay }, B = { x: bx, y: by };
      if (sw) { const tmp = A; A = B; B = tmp; }
      A = { ...A }; B = { ...B }; B.x = B.x * k; A.y = A.y + B.x;
      return { q: R`Τι θα εμφανίσει το πρόγραμμα;${CPP(`
struct point {
    int x, y;
};
int main(){
    point a, b, temp;
    a.x = ${ax};
    a.y = ${ay};
    b.x = ${bx};
    b.y = ${by};${sw ? `
    temp = a;
    a = b;
    b = temp;` : ""}
    b.x = b.x * ${k};
    a.y = a.y + b.x;
    cout << a.x << " " << a.y << " " << b.x << " " << b.y;
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: `${A.x} ${A.y} ${B.x} ${B.y}`, text: true }],
        hint: sw ? R`Η εκχώρηση εγγραφής αντιγράφει όλα τα μέλη· οι a, b ανταλλάσσονται.` : R`Υπολόγισε με τη σειρά τις εκχωρήσεις στα μέλη.`,
        sol: R`${sw ? `Μετά την αντιμετάθεση: a = (${bx}, ${by}), b = (${ax}, ${ay}). ` : ""}<code>b.x</code> γίνεται ${B.x} και <code>a.y</code> γίνεται ${A.y}.${OUT(`${A.x} ${A.y} ${B.x} ${B.y}`)}` };
    }
    const q = ri(2, 30), p = ri(2, 40) / 2, d = bkPick(["ambrosia", "chiquita", "clementine", "granny", "kiwi"]), e = ri(0, 2);
    const ex = [["apple.quantity * apple.price", ib9Num(q * p)], ["apple.description.length() + apple.quantity", String(d.length + q)], ["apple.code % 100 + apple.quantity", String(q + q)]][e];
    const code = 100 + q;
    const val = e === 2 ? String(code % 100 + q) : ex[1];
    return { q: R`Τι θα εμφανίσει το πρόγραμμα;${CPP(`
struct product {
    int code, quantity;
    string description;
    double price;
};
int main(){
    product apple;
    apple.code = ${code};
    apple.quantity = ${q};
    apple.description = "${d}";
    apple.price = ${p};
    cout << ${ex[0]};
    return 0;
}`)}`, fields: [{ label: "Έξοδος:", ans: +val }],
      hint: R`Κάθε μέλος συμπεριφέρεται ως απλή μεταβλητή του τύπου του.`, sol: R`<code>${cppEsc(ex[0])}</code> = <b>${val}</b>.${OUT(val)}` };
  } },
  /* 10.2 */
  ib9rq: { title: "Γεννήτρια — ερωτήματα σε πίνακα εγγραφών", make() {
    const P = shuffle(IB9_PROD.slice()).slice(0, 5), D = P.map((p, i) => ({ code: 101 + i, name: p[0], price: p[1], qty: ri(1, 40) }));
    const t = ri(0, 2), lim = t === 0 ? bkPick([2, 3, 5, 8, 10]) : ri(10, 30);
    const tbl = ib9Mat(D.map(d => [d.code, d.name, d.price.toFixed(2), d.qty]), { idx: false, cap: "code · name · price · qty" });
    if (t === 0) { const c = D.filter(d => d.price > lim).length;
      return { q: R`Στον πίνακα εγγραφών <code>shop[5]</code> καταχωρίστηκαν τα δεδομένα:${tbl}Τι εμφανίζει το τμήμα;${CPP(`int cnt = 0;\nfor (int i=0; i<5; i++)\n    if (shop[i].price > ${lim})\n        cnt++;\ncout << cnt;`)}`, fields: [{ label: "Έξοδος:", ans: c }],
        hint: R`Μέτρα τις εγγραφές με price &gt; ${lim}.`, sol: R`Ικανοποιούν τη συνθήκη: ${D.filter(d => d.price > lim).map(d => d.name).join(", ") || "καμία"} → <b>${c}</b>.` }; }
    if (t === 1) { const H = D.filter(d => d.qty < lim); if (!H.length) return GENS.ib9rq.make(); const o = H.map(d => d.name).join(" ");
      return { q: R`Στον πίνακα εγγραφών <code>shop[5]</code> καταχωρίστηκαν τα δεδομένα:${tbl}Τι εμφανίζει το τμήμα; (σε μία γραμμή)${CPP(`for (int i=0; i<5; i++)\n    if (shop[i].qty < ${lim})\n        cout << shop[i].name << " ";`)}`, fields: [{ label: "Έξοδος:", ans: o, text: true }],
        hint: R`Ελέγχεται το qty, εμφανίζεται το name, με τη σειρά του πίνακα.`, sol: R`qty &lt; ${lim}: ${H.map(d => `${d.name} (${d.qty})`).join(", ")}.${OUT(o)}` }; }
    const H = D.filter(d => d.qty >= lim); const tot = Math.round(H.reduce((s, d) => s + d.price * d.qty, 0) * 100) / 100;
    return { q: R`Στον πίνακα εγγραφών <code>shop[5]</code> καταχωρίστηκαν τα δεδομένα:${tbl}Ποια τιμή εμφανίζει το τμήμα;${CPP(`double total = 0;\nfor (int i=0; i<5; i++)\n    if (shop[i].qty >= ${lim})\n        total += shop[i].price * shop[i].qty;\ncout << total;`)}`, fields: [{ label: "total =", ans: tot, tol: 1e-6 }],
      hint: R`Άθροισε price × qty μόνο για qty ≥ ${lim}.`, sol: R`${H.length ? H.map(d => `${d.price.toFixed(2)}·${d.qty}`).join(" + ") : "Καμία εγγραφή"} = <b>${ib9Num(tot)}</b>.` };
  } },
  /* 10.3 */
  ib9srt: { title: "Γεννήτρια — ταξινόμηση εγγραφών", make() {
    const n = ri(4, 5), nm = shuffle(IB9_NAMES.slice()).slice(0, n), D = nm.map(x => ({ name: x, F: ri(10, 20) })), desc = ri(0, 1) === 1;
    const A = D.map(d => ({ ...d }));
    for (let i = 1; i < n; i++) { const temp = A[i]; let j = i - 1; while (j >= 0 && (desc ? A[j].F < temp.F : A[j].F > temp.F)) { A[j + 1] = A[j]; j--; } A[j + 1] = temp; }
    const o = A.map(d => d.name).join(" ");
    return { q: R`Ο πίνακας εγγραφών <code>A3[${n}]</code> (μέλη <code>name</code>, <code>F</code>) περιέχει, με τη σειρά: ${D.map(d => `(${d.name}, ${d.F})`).join(", ")}. Ποια είναι η σειρά των ονομάτων μετά την εκτέλεση;${CPP(`
for (int i=1; i<${n}; i++){
    temp = A3[i];
    j = i - 1;
    while (j>=0 && A3[j].F${desc ? "<" : ">"}temp.F){
        A3[j+1] = A3[j];
        j--;
    }
    A3[j+1] = temp;
}`)}`, fields: [{ label: "Ονόματα:", ans: o, text: true }],
      hint: R`Ταξινόμηση με εισαγωγή σε ${desc ? "φθίνουσα" : "αύξουσα"} σειρά του F· εγγραφές με ίσο F κρατούν τη σειρά τους.`, sol: R`${desc ? "Φθίνουσα" : "Αύξουσα"} σειρά με βάση το F (ευσταθής): ${A.map(d => `${d.name} (${d.F})`).join(", ")}.${OUT(o)}` };
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

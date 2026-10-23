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
  storeKey: "pagk-akk-tefxos-a-v1",
  heroTitle: "Μαθηματικά Κοινού Κορμού Α΄ Λυκείου — Α΄ Τεύχος",
  tefxos: "Α΄ τεύχους",
  howto: `<ul><li>Κλάσματα: <code>5/2</code> · δεκαδικά: <code>2,5</code> ή <code>2.5</code> · αρνητικοί: <code>-3/4</code></li>
    <li>Ρίζες: <code>√3/2</code> ή <code>sqrt(3)/2</code> · <code>5√2</code> · κυβική ρίζα: <code>8^(1/3)</code></li>
    <li>Γωνίες σε μοίρες: γράψε μόνο τον αριθμό (π.χ. <code>55</code>)</li></ul>`
};

const UNITS = [
  { id: 1, title: "Ενότητα 1 · Πραγματικοί Αριθμοί" },
  { id: 2, title: "Ενότητα 2 · Τριγωνομετρία" },
  { id: 3, title: "Ενότητα 3 · Κύκλος" },
  { id: 4, title: "Ενότητα 4 · Διανύσματα" }
];

const SECTIONS = [
/* ───────────────────────────── 1.1 ───────────────────────────── */
{
  id: "1.1", unit: 1, title: "Η έννοια της νιοστής ρίζας",
  book: "Α΄ Τεύχος §1.1 · Δραστηριότητες σελ. 23, 26",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Η <b>νιοστή ρίζα</b> ενός μη αρνητικού αριθμού $\alpha$ ($\nu \in \mathbb{N}$) είναι ο <b>μη αρνητικός</b> αριθμός $\beta$ που, υψωμένος στη $\nu$, δίνει $\alpha$:</p>
$$\sqrt[\nu]{\alpha} = \beta \iff \beta^\nu = \alpha \qquad (\alpha, \beta \ge 0)$$
<p>Ο $\nu$ λέγεται <b>δείκτης</b> και ο $\alpha$ <b>υπόριζη ποσότητα</b>. Για $\nu = 2$ δεν γράφουμε δείκτη: $\sqrt{\alpha}$.</p>
<p>Για $\alpha \ge 0$: $\;\sqrt[1]{\alpha} = \alpha$, $\;\sqrt[\nu]{1} = 1$, $\;\sqrt[\nu]{\alpha} = 0 \iff \alpha = 0$, $\;\sqrt[\nu]{\alpha^\nu} = \alpha$.</p></div>

<div class="tbox tip"><h4>Παραδείγματα</h4>
<p>$\sqrt[4]{81} = 3$ αφού $3^4 = 81$ · $\sqrt[5]{\frac{1}{32}} = \frac12$ · $\sqrt[3]{5^{30}} = \sqrt[3]{(5^{10})^3} = 5^{10}$ · $\sqrt[5]{32x^{10}} = 2x^2$.</p>
<p>Η $\sqrt{36}$ είναι $6$ και <b>όχι</b> $-6$: η ρίζα είναι εξ ορισμού μη αρνητική.</p></div>

<div class="tbox"><h4>Η εξίσωση $x^\nu = \alpha$</h4>
<table class="mini"><tr><th></th><th>$\alpha > 0$</th><th>$\alpha = 0$</th><th>$\alpha < 0$</th></tr>
<tr><td><b>ν περιττός</b></td><td>$x = \sqrt[\nu]{\alpha}$</td><td>$x = 0$</td><td>$x = -\sqrt[\nu]{-\alpha}$</td></tr>
<tr><td><b>ν άρτιος</b></td><td>$x = \pm\sqrt[\nu]{\alpha}$</td><td>$x = 0$</td><td>αδύνατη</td></tr></table>
<p>π.χ. $x^3 = -27 \Rightarrow x = -3$ · $\;x^4 = 81 \Rightarrow x = \pm 3$ · $\;x^4 = -81$: αδύνατη, αφού $x^4 \ge 0$.</p></div>`,
  widget: "nroot",
  gen: "groot",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε τις ρίζες: $\sqrt{16}$, $\;\sqrt[3]{27}$, $\;\sqrt[4]{16}$, $\;\sqrt[5]{\frac{1}{100000}}$.`,
      fields: [{ label: "√16 =", ans: 4 }, { label: "∛27 =", ans: 3 }, { label: "⁴√16 =", ans: 2 }, { label: "⁵√(1/100000) =", ans: "1/10" }],
      hint: R`Ποιος μη αρνητικός αριθμός, υψωμένος στον δείκτη, δίνει την υπόριζη; Π.χ. $100000 = 10^5$.`,
      sol: R`$4^2 = 16$, $3^3 = 27$, $2^4 = 16$, $\left(\frac{1}{10}\right)^5 = \frac{1}{100000}$. Άρα $4,\ 3,\ 2,\ \frac{1}{10}$.` },
    { level: 1, type: "mc", q: R`Ποια από τις πιο κάτω ισότητες είναι <b>σωστή</b>;`,
      options: ["$\\sqrt{36} = -6$", "$\\sqrt{36} = \\pm 6$", "$\\sqrt[3]{-8}$ ορίζεται ως $-2$ από τον ορισμό της ρίζας", "$\\sqrt[4]{81} = 3$"], correct: 3,
      hint: R`Η νιοστή ρίζα ορίζεται μόνο για <b>μη αρνητική</b> υπόριζη και είναι πάντα μη αρνητική.`,
      sol: R`$3 \ge 0$ και $3^4 = 81$, άρα $\sqrt[4]{81} = 3$. Η $\sqrt{36}$ είναι μόνο $6$ (μη αρνητική). Ο ορισμός της ρίζας δεν δέχεται αρνητική υπόριζη. (Η $x^3 = -8$ έχει λύση $x = -2 = -\sqrt[3]{8}$, αλλά αυτό είναι λύση εξίσωσης, όχι ρίζα αρνητικού.)` },
    { level: 1, type: "fields", q: R`Να λύσετε τις εξισώσεις: (α) $x^3 = 1000$, (β) $x^5 = -32$, (γ) $x^4 = 10000$.`,
      fields: [{ label: "(α) x =", ans: 10 }, { label: "(β) x =", ans: -2 }, { label: "(γ) θετική λύση x =", ans: 10 }, { label: "(γ) αρνητική λύση x =", ans: -10 }],
      hint: R`Περιττός εκθέτης ⇒ μία λύση, με το πρόσημο του $\alpha$. Άρτιος εκθέτης και $\alpha > 0$ ⇒ δύο αντίθετες λύσεις.`,
      sol: R`(α) $x = \sqrt[3]{1000} = 10$. (β) $x = -\sqrt[5]{32} = -2$. (γ) $x = \pm\sqrt[4]{10000} = \pm 10$.` },
    { level: 1, type: "mc", q: R`Η εξίσωση $x^6 = -1$:`,
      options: ["έχει λύση $x = -1$", "έχει λύσεις $x = \\pm 1$", "δεν έχει πραγματικές λύσεις", "έχει λύση $x = 0$"], correct: 2,
      hint: R`Τι πρόσημο έχει πάντα το $x^6$;`,
      sol: R`Ο εκθέτης $6$ είναι άρτιος, άρα $x^6 \ge 0$ για κάθε $x$, ενώ $-1 < 0$. Η εξίσωση είναι <b>αδύνατη</b> στο $\mathbb{R}$. (Προσοχή: $(-1)^6 = +1$.)` },
    { level: 2, type: "fields", q: R`Με υπολογιστική μηχανή, να λύσετε με ακρίβεια δύο δεκαδικών ψηφίων: (α) $x^5 = 5$, (β) $x^3 = -9$, (γ) $x^4 = 110$ (θετική λύση).`,
      fields: [{ label: "(α) x ≈", ans: 1.38, tol: 0.004 }, { label: "(β) x ≈", ans: -2.08, tol: 0.003 }, { label: "(γ) x ≈", ans: 3.24, tol: 0.002 }],
      hint: R`$\sqrt[\nu]{\alpha} = \alpha^{1/\nu}$: στη μηχανή γράψε π.χ. <code>5^(1/5)</code>.`,
      sol: R`(α) $x = \sqrt[5]{5} \approx 1{,}38$. (β) $x = -\sqrt[3]{9} \approx -2{,}08$. (γ) $x = \pm\sqrt[4]{110} \approx \pm 3{,}24$, θετική $3{,}24$.` },
    { level: 2, type: "mc", q: R`Ποιος αριθμός είναι μεγαλύτερος: $\sqrt[4]{50}$ ή $\sqrt[5]{50}$;`,
      options: ["$\\sqrt[4]{50}$", "$\\sqrt[5]{50}$", "είναι ίσοι", "δεν μπορούμε να ξέρουμε"], correct: 0,
      hint: R`Ο $\sqrt[4]{50}$ υψωμένος στην 4η δίνει 50. Ο $\sqrt[5]{50}$ χρειάζεται <b>περισσότερους</b> παράγοντες για να φτάσει το 50.`,
      sol: R`$\sqrt[4]{50} \approx 2{,}66$ και $\sqrt[5]{50} \approx 2{,}19$. Γενικά, για $\alpha > 1$, όσο μεγαλώνει ο δείκτης τόσο μικραίνει η ρίζα. Άρα μεγαλύτερος ο $\sqrt[4]{50}$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε τον πραγματικό αριθμό που, αν μειωθεί κατά $\frac12$ και υψωθεί στην 3η δύναμη, ισούται με $125$.`,
      fields: [{ label: "αριθμός =", ans: "11/2" }],
      hint: R`$\left(x - \frac12\right)^3 = 125$.`,
      sol: R`$\left(x - \frac12\right)^3 = 125 \Rightarrow x - \frac12 = \sqrt[3]{125} = 5 \Rightarrow x = \frac{11}{2}$.` },
    { level: 2, type: "fields", q: R`Αν ένα σώμα αφεθεί ελεύθερο από ύψος $h$ m, τότε φτάνει στο έδαφος σε χρόνο $t$ s, με $h = 5t^2$. Πόσο χρόνο χρειάζεται μια μπάλα που αφήνεται από ύψος $20$ m;`,
      fields: [{ label: "t (s) =", ans: 2 }],
      hint: R`$5t^2 = 20$ και ο χρόνος είναι θετικός.`,
      sol: R`$5t^2 = 20 \Rightarrow t^2 = 4 \Rightarrow t = 2$ s (η λύση $t = -2$ απορρίπτεται).` },
    { level: 2, type: "fields", q: R`Η διάμετρος μιας λειχήνας (σε mm), $t$ χρόνια μετά το λιώσιμο των πάγων, δίνεται από τον τύπο $\delta = 7\sqrt{t - 12}$, $t \ge 12$.<br>(α) Ποια η διάμετρος $16$ χρόνια μετά; (β) Μια λειχήνα έχει διάμετρο $35$ mm. Πόσα χρόνια πέρασαν;`,
      fields: [{ label: "(α) δ (mm) =", ans: 14 }, { label: "(β) t (έτη) =", ans: 37 }],
      hint: R`(β) $7\sqrt{t-12} = 35 \Rightarrow \sqrt{t - 12} = 5$.`,
      sol: R`(α) $\delta = 7\sqrt{16 - 12} = 7\cdot 2 = 14$ mm.<br>(β) $\sqrt{t - 12} = 5 \Rightarrow t - 12 = 25 \Rightarrow t = 37$ έτη.` },
    { level: 3, type: "fields", q: R`Κεφάλαιο $€3000$ ανατοκίζεται με ετήσιο επιτόκιο $\tau$ και σε $5$ χρόνια γίνεται $€3828{,}84$, όπου $3000(1+\tau)^5 = 3828{,}84$. Να βρείτε το επιτόκιο.`,
      fields: [{ label: "τ (%) =", ans: 5, tol: 0.002 }],
      hint: R`Διαίρεσε με 3000 και πάρε 5η ρίζα: $1 + \tau = \sqrt[5]{1{,}27628}$.`,
      sol: R`$(1+\tau)^5 = \frac{3828{,}84}{3000} = 1{,}27628 \Rightarrow 1 + \tau = \sqrt[5]{1{,}27628} = 1{,}05$. Άρα $\tau = 0{,}05 = 5\%$.` },
    { level: 3, type: "fields", q: R`Ένας μαθηματικός, που γεννήθηκε μεταξύ 950 μ.Χ. και 1000 μ.Χ., είπε: «Η τετραγωνική ρίζα του έτους που γεννήθηκα είναι ακριβώς ίση με τη σημερινή μου ηλικία». Πότε γεννήθηκε και πόσων χρονών ήταν;`,
      fields: [{ label: "έτος γέννησης =", ans: 961 }, { label: "ηλικία =", ans: 31 }, { label: "έτος ερώτησης =", ans: 992 }],
      hint: R`Ποιο τέλειο τετράγωνο βρίσκεται ανάμεσα στο 950 και στο 1000;`,
      sol: R`$30^2 = 900$, $31^2 = 961$, $32^2 = 1024$. Το μόνο τέλειο τετράγωνο στο διάστημα είναι το $961$. Γεννήθηκε το <b>961</b>, ήταν <b>31</b> χρονών, άρα η ερώτηση έγινε το $961 + 31 = $ <b>992</b>.` }
  ]
},
/* ───────────────────────────── 1.2 ───────────────────────────── */
{
  id: "1.2", unit: 1, title: "Ιδιότητες της νιοστής ρίζας",
  book: "Α΄ Τεύχος §1.2 · Δραστηριότητες σελ. 31",
  theory: R`
<div class="tbox"><h4>Ιδιότητες ($\alpha, \beta \ge 0$, $\nu \in \mathbb{N}$)</h4>
$$\left(\sqrt[\nu]{\alpha}\right)^\nu = \alpha \qquad \sqrt[\nu]{\alpha\beta} = \sqrt[\nu]{\alpha}\cdot\sqrt[\nu]{\beta} \qquad \sqrt[\nu]{\frac{\alpha}{\beta}} = \frac{\sqrt[\nu]{\alpha}}{\sqrt[\nu]{\beta}}\ (\beta > 0)$$
<p>Με αυτές «βγάζουμε» παράγοντες έξω από τη ρίζα:</p>
$$\sqrt{18} = \sqrt{9\cdot 2} = 3\sqrt{2} \qquad \sqrt[4]{32} = \sqrt[4]{16\cdot 2} = 2\sqrt[4]{2} \qquad \sqrt[3]{\tfrac{24}{27}} = \tfrac{2\sqrt[3]{3}}{3}$$</div>

<div class="tbox warn"><h4>Προσοχή — δεν ισχύουν!</h4>
<p>$\sqrt{\alpha + \beta} \ne \sqrt{\alpha} + \sqrt{\beta}$ και $\sqrt{\alpha - \beta} \ne \sqrt{\alpha} - \sqrt{\beta}$.</p>
<p>Αντιπαράδειγμα: $\sqrt{9 + 16} = 5$, ενώ $\sqrt9 + \sqrt{16} = 7$.</p></div>

<div class="tbox tip"><h4>Πράξεις με ρίζες</h4>
<p>Προσθέτουμε μόνο <b>όμοιες</b> ρίζες, όπως όμοιους όρους: $\sqrt{12} + \sqrt{27} = 2\sqrt3 + 3\sqrt3 = 5\sqrt3$.</p>
<p>Στους πολλαπλασιασμούς χρησιμοποιούμε επιμεριστική και ταυτότητες: $(5 - \sqrt{x})^2 = 25 - 10\sqrt{x} + x$.</p></div>`,
  gen: "groot",
  exercises: [
    { level: 1, type: "fields", q: R`Να απλοποιήσετε: (α) $\sqrt3\cdot\sqrt{27}$, (β) $\sqrt[4]{32} : \sqrt[4]{2}$, (γ) $\left(\sqrt2\right)^{14}$.`,
      fields: [{ label: "(α) =", ans: 9 }, { label: "(β) =", ans: 2 }, { label: "(γ) =", ans: 128 }],
      hint: R`Ένωσε τις ρίζες σε μία: $\sqrt{3\cdot 27}$, $\sqrt[4]{32 : 2}$. Για το (γ): $(\sqrt2)^{14} = \left[(\sqrt2)^2\right]^7$.`,
      sol: R`(α) $\sqrt{81} = 9$. (β) $\sqrt[4]{16} = 2$. (γ) $\left[(\sqrt2)^2\right]^7 = 2^7 = 128$.` },
    { level: 1, type: "fields", q: R`Να γράψετε στη μορφή $\alpha\sqrt{\beta}$ με $\beta$ όσο γίνεται μικρότερο: (α) $\sqrt{200}$, (β) $\sqrt{48}$, (γ) $\sqrt{150}$.`,
      fields: [{ label: "(α) √200 = ? √2  →", ans: 10 }, { label: "(β) √48 = ? √3  →", ans: 4 }, { label: "(γ) √150 = ? √6  →", ans: 5 }],
      hint: R`Βρες τον μεγαλύτερο τέλειο τετράγωνο παράγοντα: $200 = 100\cdot 2$.`,
      sol: R`$\sqrt{200} = \sqrt{100}\sqrt2 = 10\sqrt2$, $\;\sqrt{48} = \sqrt{16}\sqrt3 = 4\sqrt3$, $\;\sqrt{150} = \sqrt{25}\sqrt6 = 5\sqrt6$.` },
    { level: 1, type: "fields", q: R`Να κάνετε τις πράξεις: (α) $\sqrt{50} - \sqrt2$, (β) $\sqrt{12} + \sqrt{27}$.`,
      fields: [{ label: "(α) =", ans: "4√2" }, { label: "(β) =", ans: "5√3" }],
      hint: R`Πρώτα κάθε ρίζα σε απλή μορφή, μετά πρόσθεση όμοιων ριζών.`,
      sol: R`(α) $5\sqrt2 - \sqrt2 = 4\sqrt2$. (β) $2\sqrt3 + 3\sqrt3 = 5\sqrt3$.` },
    { level: 2, type: "fields", q: R`Να κάνετε τις πράξεις: (α) $\sqrt[3]{4}\cdot\left(\sqrt[3]{16} - \sqrt[3]{2}\right)$, (β) $\left(2\sqrt{75} + 3\sqrt{48} - 6\sqrt{27}\right) : \sqrt3$.`,
      fields: [{ label: "(α) =", ans: 2 }, { label: "(β) =", ans: 4 }],
      hint: R`(α) Επιμεριστική: $\sqrt[3]{64} - \sqrt[3]{8}$. (β) $\sqrt{75} = 5\sqrt3$, $\sqrt{48} = 4\sqrt3$, $\sqrt{27} = 3\sqrt3$.`,
      sol: R`(α) $\sqrt[3]{64} - \sqrt[3]{8} = 4 - 2 = 2$.<br>(β) $(10\sqrt3 + 12\sqrt3 - 18\sqrt3) : \sqrt3 = 4\sqrt3 : \sqrt3 = 4$.` },
    { level: 2, type: "fields", q: R`Να κάνετε τις πράξεις: $\left(\sqrt3 + 2\sqrt5\right)\left(\sqrt3 - 4\sqrt5\right)$.`,
      fields: [{ label: "=", ans: "-37-2√15" }],
      hint: R`Επιμεριστική: τέσσερα γινόμενα. $(\sqrt5)^2 = 5$ και $\sqrt3\cdot\sqrt5 = \sqrt{15}$.`,
      sol: R`$3 - 4\sqrt{15} + 2\sqrt{15} - 8\cdot 5 = -37 - 2\sqrt{15}$.` },
    { level: 2, type: "fields", q: R`Να γράψετε την παράσταση $A = 4\sqrt{18} + \sqrt{50} - \sqrt{200}$ στη μορφή $\kappa\sqrt2$.`,
      fields: [{ label: "κ =", ans: 7 }],
      hint: R`$\sqrt{18} = 3\sqrt2$, $\sqrt{50} = 5\sqrt2$, $\sqrt{200} = 10\sqrt2$.`,
      sol: R`$A = 12\sqrt2 + 5\sqrt2 - 10\sqrt2 = 7\sqrt2$, άρα $\kappa = 7$.` },
    { level: 2, type: "fields", q: R`Αν $x = 1 + \sqrt2$ και $y = 1 - \sqrt2$, να υπολογίσετε: (α) $x + y$, (β) $xy$, (γ) $x^2 - y^2$.`,
      fields: [{ label: "(α) x + y =", ans: 2 }, { label: "(β) xy =", ans: -1 }, { label: "(γ) x² − y² =", ans: "4√2" }],
      hint: R`(β) Διαφορά τετραγώνων. (γ) $x^2 - y^2 = (x+y)(x-y)$.`,
      sol: R`(α) $2$. (β) $1^2 - (\sqrt2)^2 = 1 - 2 = -1$. (γ) $(x+y)(x-y) = 2\cdot 2\sqrt2 = 4\sqrt2$.` },
    { level: 1, type: "mc", q: R`Ποια από τις πιο κάτω ισότητες είναι <b>σωστή</b>;`,
      options: ["$\\sqrt3 + \\sqrt7 = \\sqrt{10}$", "$\\sqrt{90} = 9\\sqrt{10}$", "$\\sqrt{12} - \\sqrt3 = \\sqrt3$", "$\\sqrt{3^2 + 4^2} = 3 + 4$"], correct: 2,
      hint: R`Έλεγξε την καθεμία: τι κάνει $\sqrt{12}$; Τι κάνει $\sqrt{90}$;`,
      sol: R`$\sqrt{12} - \sqrt3 = 2\sqrt3 - \sqrt3 = \sqrt3$ ✓. Οι άλλες είναι λάθος: η ρίζα δεν «σπάει» σε αθροίσματα ($\sqrt{25} = 5 \ne 7$), και $\sqrt{90} = 3\sqrt{10}$.` },
    { level: 2, type: "expr", q: R`Για $x > 0$, να απλοποιήσετε την παράσταση $\sqrt[3]{16x^5 : (2x^2)}$.`,
      ref: "2x", pos: true, key: "2x",
      hint: R`Κάνε πρώτα τη διαίρεση μέσα στη ρίζα: $16x^5 : (2x^2) = 8x^3$.`,
      sol: R`$\sqrt[3]{8x^3} = \sqrt[3]{(2x)^3} = 2x$.` },
    { level: 2, type: "fields", q: R`Οι κάθετες πλευρές ορθογωνίου τριγώνου έχουν μήκη $(4 + \sqrt2)$ μ και $(4 - \sqrt2)$ μ. Να υπολογίσετε το μήκος της υποτείνουσας.`,
      fields: [{ label: "υποτείνουσα =", ans: 6 }],
      hint: R`Πυθαγόρειο: $(4+\sqrt2)^2 + (4-\sqrt2)^2$. Τα «διπλά γινόμενα» φεύγουν!`,
      sol: R`$(16 + 8\sqrt2 + 2) + (16 - 8\sqrt2 + 2) = 36$, άρα υποτείνουσα $= \sqrt{36} = 6$ μ — φυσικός αριθμός.` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε το $x^3$, αν $x - 3\sqrt[3]{7} = 4\sqrt[3]{7}$.`,
      fields: [{ label: "x³ =", ans: 2401 }],
      hint: R`$x = 7\sqrt[3]{7}$, και $\left(\sqrt[3]{7}\right)^3 = 7$.`,
      sol: R`$x = 7\sqrt[3]{7} \Rightarrow x^3 = 7^3\cdot\left(\sqrt[3]{7}\right)^3 = 343\cdot 7 = 2401$.` }
  ]
},
/* ───────────────────────────── 1.3 ───────────────────────────── */
{
  id: "1.3", unit: 1, title: "Δυνάμεις με ρητό εκθέτη",
  book: "Α΄ Τεύχος §1.3 · Δραστηριότητες σελ. 37",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Για $\alpha > 0$, $\mu \in \mathbb{Z}$, $\nu \in \mathbb{N}$:</p>
$$\alpha^{\frac{\mu}{\nu}} = \sqrt[\nu]{\alpha^\mu} = \left(\sqrt[\nu]{\alpha}\right)^\mu \qquad\text{ειδικά}\qquad \alpha^{\frac1\nu} = \sqrt[\nu]{\alpha}$$
<p>Αρνητικός εκθέτης: $\alpha^{-\frac{\mu}{\nu}} = \dfrac{1}{\sqrt[\nu]{\alpha^\mu}}$. Επίσης ορίζουμε $0^{\frac{\mu}{\nu}} = 0$ για $\mu, \nu \in \mathbb{N}$.</p></div>

<div class="tbox tip"><h4>Όλες οι γνωστές ιδιότητες δυνάμεων ισχύουν</h4>
$$\alpha^{x}\alpha^{y} = \alpha^{x+y} \qquad \frac{\alpha^x}{\alpha^y} = \alpha^{x-y} \qquad (\alpha^x)^y = \alpha^{xy} \qquad (\alpha\beta)^x = \alpha^x\beta^x$$
<p>π.χ. $16^{\frac34} = \left(\sqrt[4]{16}\right)^3 = 2^3 = 8$ · $\;9^{-\frac12} = \frac13$ · $\;\sqrt5 + 5^{\frac32} = \sqrt5 + 5\sqrt5 = 6\sqrt5$.</p></div>

<div class="tbox"><h4>Εξισώσεις με ρητό εκθέτη</h4>
<p>Υψώνουμε και τα δύο μέλη στον <b>αντίστροφο</b> εκθέτη:</p>
$$x^{\frac23} = 9 \Rightarrow x = 9^{\frac32} = 27 \qquad y^{-\frac32} = 8 \Rightarrow y = 8^{-\frac23} = \tfrac14$$
<p>Η $(x+1)^{\frac12} = -5$ είναι αδύνατη: μια δύναμη θετικής βάσης με ρητό εκθέτη είναι πάντα θετική.</p></div>`,
  gen: "groot",
  exercises: [
    { level: 1, type: "fields", q: R`Χωρίς υπολογιστική μηχανή: $8^{\frac13}$, $\;16^{\frac12}$, $\;81^{\frac14}$, $\;4^{\frac32}$.`,
      fields: [{ label: "8^(1/3) =", ans: 2 }, { label: "16^(1/2) =", ans: 4 }, { label: "81^(1/4) =", ans: 3 }, { label: "4^(3/2) =", ans: 8 }],
      hint: R`$\alpha^{\frac{\mu}{\nu}} = \left(\sqrt[\nu]{\alpha}\right)^\mu$: πρώτα η ρίζα, μετά η δύναμη.`,
      sol: R`$\sqrt[3]8 = 2$, $\sqrt{16} = 4$, $\sqrt[4]{81} = 3$, $\left(\sqrt4\right)^3 = 8$.` },
    { level: 1, type: "fields", q: R`Χωρίς υπολογιστική μηχανή: (α) $25^{-\frac12}$, (β) $8^{\frac{10}{6}}$, (γ) $\left(\frac18\right)^{-\frac23}$, (δ) $1^{\frac{1}{20}}$.`,
      fields: [{ label: "(α) =", ans: "1/5" }, { label: "(β) =", ans: 32 }, { label: "(γ) =", ans: 4 }, { label: "(δ) =", ans: 1 }],
      hint: R`(β) Απλοποίησε: $\frac{10}{6} = \frac53$. (γ) Αρνητικός εκθέτης ⇒ αντιστρέφουμε τη βάση: $8^{\frac23}$.`,
      sol: R`(α) $\frac{1}{\sqrt{25}} = \frac15$. (β) $8^{\frac53} = (\sqrt[3]8)^5 = 2^5 = 32$. (γ) $8^{\frac23} = 2^2 = 4$. (δ) $1$.` },
    { level: 1, type: "mc", q: R`Να μετατρέψετε το $\sqrt[3]{5^2}$ σε δύναμη με ρητό εκθέτη:`,
      options: ["$5^{\\frac32}$", "$5^{\\frac23}$", "$5^{6}$", "$5^{-\\frac23}$"], correct: 1,
      hint: R`$\sqrt[\nu]{\alpha^\mu} = \alpha^{\frac{\mu}{\nu}}$: ο <b>δείκτης</b> πάει στον παρονομαστή.`,
      sol: R`$\sqrt[3]{5^2} = 5^{\frac23}$.` },
    { level: 2, type: "fields", q: R`Να λύσετε τις εξισώσεις (όπου ορίζονται οι δυνάμεις): (α) $x^{\frac13} = 2$, (β) $x^{\frac23} = 9$, (γ) $x^{-\frac12} = 4$, (δ) $(x + 1)^{\frac13} = 2$.`,
      fields: [{ label: "(α) x =", ans: 8 }, { label: "(β) x =", ans: 27 }, { label: "(γ) x =", ans: "1/16" }, { label: "(δ) x =", ans: 7 }],
      hint: R`Ύψωσε στον αντίστροφο εκθέτη: στην 3, στην $\frac32$, στην $-2$, στην 3.`,
      sol: R`(α) $x = 2^3 = 8$. (β) $x = 9^{\frac32} = 3^3 = 27$. (γ) $x = 4^{-2} = \frac1{16}$. (δ) $x + 1 = 2^3 = 8 \Rightarrow x = 7$.` },
    { level: 2, type: "fields", q: R`Χωρίς υπολογιστική μηχανή: (α) $2^{\frac43} : \sqrt[3]{2}$, (β) $\sqrt5 + 5^{\frac32}$ (γράψτε στη μορφή $\kappa\sqrt5$), (γ) $25^{\frac14}\cdot 5^{-\frac12}$.`,
      fields: [{ label: "(α) =", ans: 2 }, { label: "(β) κ =", ans: 6 }, { label: "(γ) =", ans: 1 }],
      hint: R`Όλα σε δυνάμεις της ίδιας βάσης: $\sqrt[3]2 = 2^{\frac13}$, $25^{\frac14} = 5^{\frac12}$.`,
      sol: R`(α) $2^{\frac43 - \frac13} = 2^1 = 2$. (β) $5^{\frac32} = 5\sqrt5$, άρα $\sqrt5 + 5\sqrt5 = 6\sqrt5$. (γ) $5^{\frac12}\cdot 5^{-\frac12} = 5^0 = 1$.` },
    { level: 2, type: "expr", q: R`Για $x > 0$, να απλοποιήσετε την παράσταση $(8x^6)^{\frac13}$.`,
      ref: "2x^2", pos: true, key: "2x^2",
      hint: R`$(\alpha\beta)^{\frac13} = \alpha^{\frac13}\beta^{\frac13}$ και $(x^6)^{\frac13} = x^{6\cdot\frac13}$.`,
      sol: R`$8^{\frac13}\cdot x^{6\cdot\frac13} = 2x^2$.` },
    { level: 3, type: "expr", q: R`Για $x > 0$, να απλοποιήσετε την παράσταση $(64x^6)^{-\frac23}$.`,
      ref: "1/(16x^4)", pos: true, key: "1/(16x^4)",
      hint: R`$64^{\frac23} = (\sqrt[3]{64})^2 = 16$ και $(x^6)^{\frac23} = x^4$· ο αρνητικός εκθέτης στέλνει όλο το αποτέλεσμα στον παρονομαστή.`,
      sol: R`$(64x^6)^{-\frac23} = \dfrac{1}{(64x^6)^{\frac23}} = \dfrac{1}{16x^4}$.` },
    { level: 2, type: "fields", q: R`Η απόσταση (σε m) που διανύει ένα αυτοκίνητο που επιταχύνει δίνεται από τη σχέση $d(t) = 10\,t^{\frac32}$, όπου $t$ ο χρόνος σε s. Πόσο χρόνο κινήθηκε, αν διένυσε $640$ m;`,
      fields: [{ label: "t (s) =", ans: 16 }],
      hint: R`$t^{\frac32} = 64$ ⇒ ύψωσε στην $\frac23$.`,
      sol: R`$10t^{\frac32} = 640 \Rightarrow t^{\frac32} = 64 \Rightarrow t = 64^{\frac23} = (\sqrt[3]{64})^2 = 16$ s.` },
    { level: 1, type: "mc", q: R`Η εξίσωση $(x + 1)^{\frac12} = -5$, $x \ge -1$:`,
      options: ["έχει λύση $x = 24$", "έχει λύση $x = -26$", "είναι αδύνατη", "έχει άπειρες λύσεις"], correct: 2,
      hint: R`Τι πρόσημο έχει το $(x+1)^{\frac12} = \sqrt{x+1}$;`,
      sol: R`$(x+1)^{\frac12} = \sqrt{x + 1} \ge 0$, άρα δεν μπορεί να ισούται με $-5$. <b>Αδύνατη</b>. (Το $x = 24$ δίνει $\sqrt{25} = +5$, όχι $-5$.)` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε: $\sqrt{\left(\frac{81}{64}\right)^3}$.`,
      fields: [{ label: "=", ans: "729/512" }],
      hint: R`$\sqrt{\left(\frac{81}{64}\right)^3} = \left(\frac{81}{64}\right)^{\frac32} = \left(\frac98\right)^3$.`,
      sol: R`$\left(\sqrt{\frac{81}{64}}\right)^3 = \left(\frac98\right)^3 = \frac{729}{512}$.` }
  ]
},
/* ───────────────────────────── 1.4 ───────────────────────────── */
{
  id: "1.4", unit: 1, title: "Μετατροπή άρρητου παρονομαστή σε ρητό",
  book: "Α΄ Τεύχος §1.4 · Δραστηριότητες σελ. 42, 45",
  theory: R`
<div class="tbox"><h4>Συζυγείς παραστάσεις</h4>
<p>Δύο άρρητες παραστάσεις είναι <b>συζυγείς</b> όταν το γινόμενό τους είναι ρητό ($\alpha, \beta \ge 0$):</p>
<table class="mini"><tr><th>$A$</th><th>$B$</th><th>$A\cdot B$</th></tr>
<tr><td>$\sqrt\alpha + \sqrt\beta$</td><td>$\sqrt\alpha - \sqrt\beta$</td><td>$\alpha - \beta$</td></tr>
<tr><td>$\alpha + \sqrt\beta$</td><td>$\alpha - \sqrt\beta$</td><td>$\alpha^2 - \beta$</td></tr>
<tr><td>$\kappa\sqrt\alpha + \lambda\sqrt\beta$</td><td>$\kappa\sqrt\alpha - \lambda\sqrt\beta$</td><td>$\kappa^2\alpha - \lambda^2\beta$</td></tr></table></div>

<div class="tbox"><h4>Μέθοδος</h4>
<p>Πολλαπλασιάζουμε <b>αριθμητή και παρονομαστή</b> με τη συζυγή του παρονομαστή:</p>
$$\frac{5}{\sqrt7} = \frac{5\sqrt7}{7} \qquad \frac{3}{1 - \sqrt2} = \frac{3(1 + \sqrt2)}{1 - 2} = -3(1 + \sqrt2) \qquad \frac{3}{\sqrt5 + \sqrt2} = \frac{3(\sqrt5 - \sqrt2)}{3} = \sqrt5 - \sqrt2$$</div>

<div class="tbox tip"><h4>Γιατί δουλεύει;</h4>
<p>Χάρη στη διαφορά τετραγώνων: $(\sqrt\alpha - \sqrt\beta)(\sqrt\alpha + \sqrt\beta) = (\sqrt\alpha)^2 - (\sqrt\beta)^2 = \alpha - \beta$ — οι ρίζες «εξαφανίζονται».</p></div>`,
  gen: "grat",
  exercises: [
    { level: 1, type: "fields", q: R`Να γράψετε με ρητό παρονομαστή: (α) $\frac{5}{\sqrt3}$, (β) $\frac{10}{\sqrt2}$, (γ) $\frac{3}{\sqrt{15}}$, (δ) $\frac{2}{5\sqrt6}$. <span class="muted">Γράψτε κάθε αποτέλεσμα π.χ. ως <code>5√3/3</code>.</span>`,
      fields: [{ label: "(α) =", ans: "5√3/3" }, { label: "(β) =", ans: "5√2" }, { label: "(γ) =", ans: "√15/5" }, { label: "(δ) =", ans: "√6/15" }],
      hint: R`Πολλαπλασίασε πάνω και κάτω με τη ρίζα του παρονομαστή.`,
      sol: R`(α) $\frac{5\sqrt3}{3}$. (β) $\frac{10\sqrt2}{2} = 5\sqrt2$. (γ) $\frac{3\sqrt{15}}{15} = \frac{\sqrt{15}}{5}$. (δ) $\frac{2\sqrt6}{5\cdot 6} = \frac{\sqrt6}{15}$.` },
    { level: 2, type: "fields", q: R`Να γράψετε το $\dfrac{5}{\sqrt6 - \sqrt2}$ στη μορφή $\kappa\left(\sqrt6 + \sqrt2\right)$.`,
      fields: [{ label: "κ =", ans: "5/4" }],
      hint: R`Συζυγής του $\sqrt6 - \sqrt2$ είναι η $\sqrt6 + \sqrt2$· το γινόμενό τους είναι $6 - 2$.`,
      sol: R`$\dfrac{5(\sqrt6 + \sqrt2)}{6 - 2} = \dfrac54\left(\sqrt6 + \sqrt2\right)$, άρα $\kappa = \frac54$.` },
    { level: 2, type: "fields", q: R`Να γράψετε με ρητό παρονομαστή: (α) $\dfrac{3}{\sqrt7 - 1} = \kappa\left(\sqrt7 + 1\right)$, (β) $\dfrac{38}{5 + 2\sqrt6} = \lambda\left(5 - 2\sqrt6\right)$.`,
      fields: [{ label: "(α) κ =", ans: "1/2" }, { label: "(β) λ =", ans: 38 }],
      hint: R`(β) $(5 + 2\sqrt6)(5 - 2\sqrt6) = 25 - 4\cdot 6$.`,
      sol: R`(α) $\dfrac{3(\sqrt7 + 1)}{7 - 1} = \dfrac{\sqrt7 + 1}{2}$, $\kappa = \frac12$.<br>(β) $\dfrac{38(5 - 2\sqrt6)}{25 - 24} = 38(5 - 2\sqrt6)$, $\lambda = 38$.` },
    { level: 2, type: "fields", q: R`Δίνεται $A = 6 + \sqrt3$ και $B$ η συζυγής της. Να υπολογίσετε: (α) $A + B$, (β) $A\cdot B$, (γ) $A^2 - B^2$.`,
      fields: [{ label: "(α) A + B =", ans: 12 }, { label: "(β) A·B =", ans: 33 }, { label: "(γ) A² − B² =", ans: "24√3" }],
      hint: R`$B = 6 - \sqrt3$. Για το (γ): $A^2 - B^2 = (A+B)(A-B)$.`,
      sol: R`(α) $12$. (β) $36 - 3 = 33$. (γ) $(A+B)(A-B) = 12\cdot 2\sqrt3 = 24\sqrt3$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε: (α) $\dfrac{1}{3 - \sqrt5} + \dfrac{1}{3 + \sqrt5}$, (β) $\dfrac{2}{4 + \sqrt3} + \dfrac{2}{4 - \sqrt3}$.`,
      fields: [{ label: "(α) =", ans: "3/2" }, { label: "(β) =", ans: "16/13" }],
      hint: R`Κοινός παρονομαστής: το γινόμενο των δύο συζυγών.`,
      sol: R`(α) $\dfrac{(3 + \sqrt5) + (3 - \sqrt5)}{9 - 5} = \dfrac64 = \dfrac32$.<br>(β) $\dfrac{2(4 - \sqrt3) + 2(4 + \sqrt3)}{16 - 3} = \dfrac{16}{13}$.` },
    { level: 2, type: "fields", q: R`Να δείξετε ότι το $A = \dfrac{6}{\sqrt2} + \dfrac{16}{\sqrt8}$ γράφεται $\kappa\sqrt2$ με $\kappa \in \mathbb{N}$. Βρείτε το $\kappa$.`,
      fields: [{ label: "κ =", ans: 7 }],
      hint: R`$\sqrt8 = 2\sqrt2$, άρα $\frac{16}{\sqrt8} = \frac{8}{\sqrt2}$.`,
      sol: R`$\frac{6}{\sqrt2} = 3\sqrt2$ και $\frac{16}{2\sqrt2} = \frac{8}{\sqrt2} = 4\sqrt2$. Άρα $A = 7\sqrt2$, $\kappa = 7$.` },
    { level: 3, type: "fields", q: R`Να γράψετε το $\dfrac{13}{\sqrt7 - 2\sqrt5}$ στη μορφή $\kappa\left(\sqrt7 + 2\sqrt5\right)$.`,
      fields: [{ label: "κ =", ans: -1 }],
      hint: R`$(\sqrt7 - 2\sqrt5)(\sqrt7 + 2\sqrt5) = 7 - 4\cdot 5$.`,
      sol: R`$\dfrac{13(\sqrt7 + 2\sqrt5)}{7 - 20} = \dfrac{13(\sqrt7 + 2\sqrt5)}{-13} = -\left(\sqrt7 + 2\sqrt5\right)$, $\kappa = -1$.` },
    { level: 2, type: "fields", q: R`Να γράψετε με ρητό παρονομαστή: $\dfrac{6}{3 + \sqrt3}$, στη μορφή $\alpha + \beta\sqrt3$.`,
      fields: [{ label: "α =", ans: 3 }, { label: "β =", ans: -1 }],
      hint: R`Πολλαπλασίασε με $3 - \sqrt3$: ο παρονομαστής γίνεται $9 - 3 = 6$.`,
      sol: R`$\dfrac{6(3 - \sqrt3)}{9 - 3} = 3 - \sqrt3$. Άρα $\alpha = 3$, $\beta = -1$.` },
    { level: 3, type: "mc", q: R`Ποιος αριθμός είναι η τετραγωνική ρίζα του $6 - 4\sqrt2$;`,
      options: ["$\\sqrt2 - 2$", "$2 - \\sqrt2$", "$4 - \\sqrt2$", "$\\sqrt6 - 2$"], correct: 1,
      hint: R`Ύψωσε κάθε επιλογή στο τετράγωνο. Θυμήσου: η ρίζα πρέπει να είναι <b>μη αρνητική</b>.`,
      sol: R`$(2 - \sqrt2)^2 = 4 - 4\sqrt2 + 2 = 6 - 4\sqrt2$ και $2 - \sqrt2 > 0$. Το $\sqrt2 - 2$ έχει το ίδιο τετράγωνο αλλά είναι αρνητικό, άρα δεν είναι ρίζα.` }
  ]
},
/* ───────────────────────────── 2.1 ───────────────────────────── */
{
  id: "2.1", unit: 2, title: "Γωνία σε κανονική θέση",
  book: "Α΄ Τεύχος §2.1 · Δραστηριότητες σελ. 56",
  theory: R`
<div class="tbox"><h4>Κανονική θέση</h4>
<p>Μια γωνία είναι σε <b>κανονική θέση</b> όταν η κορυφή της είναι η αρχή $O$ των αξόνων και η <b>αρχική πλευρά</b> της είναι ο θετικός ημιάξονας $Ox$. Τη δημιουργεί η περιστροφή της αρχικής πλευράς μέχρι την <b>τελική πλευρά</b>.</p>
<ul><li><b>Θετική</b> γωνία: περιστροφή <b>αντίθετα</b> από τους δείκτες του ρολογιού.</li>
<li><b>Αρνητική</b> γωνία: περιστροφή <b>όπως</b> οι δείκτες του ρολογιού.</li>
<li>Γωνίες μεγαλύτερες από $360^\circ$: περισσότερες από μία πλήρεις στροφές.</li></ul></div>

<div class="tbox"><h4>Ίδια τελική πλευρά</h4>
<p>Οι γωνίες $\theta$ και $\theta + \kappa\cdot 360^\circ$, $\kappa \in \mathbb{Z}$, έχουν την <b>ίδια τελική πλευρά</b>.</p>
<p>π.χ. η $120^\circ$ και η $-240^\circ = 120^\circ - 360^\circ$ · η $315^\circ$ και η $675^\circ = 315^\circ + 360^\circ$.</p></div>

<div class="tbox tip"><h4>Τεταρτημόρια</h4>
<p>Η τελική πλευρά βρίσκεται στο 1ο τεταρτημόριο για $0^\circ < \theta < 90^\circ$, στο 2ο για $90^\circ < \theta < 180^\circ$, στο 3ο για $180^\circ < \theta < 270^\circ$, στο 4ο για $270^\circ < \theta < 360^\circ$. Για άλλες γωνίες, πρώτα «φέρνουμε» τη γωνία στο $[0^\circ, 360^\circ)$.</p></div>`,
  widget: "stdangle",
  gen: "gquad",
  exercises: [
    { level: 1, type: "fields", q: R`Σε ποιο τεταρτημόριο βρίσκεται η τελική πλευρά των γωνιών (α) $236^\circ$, (β) $-52^\circ$, (γ) $370^\circ$, (δ) $-150^\circ$;`,
      fields: [{ label: "(α) 236° →", ans: 3 }, { label: "(β) −52° →", ans: 4 }, { label: "(γ) 370° →", ans: 1 }, { label: "(δ) −150° →", ans: 3 }],
      hint: R`Πρόσθεσε ή αφαίρεσε $360^\circ$ ώστε η γωνία να πέσει στο $[0^\circ, 360^\circ)$.`,
      sol: R`(α) $180^\circ < 236^\circ < 270^\circ$: 3ο. (β) $-52^\circ + 360^\circ = 308^\circ$: 4ο. (γ) $370^\circ - 360^\circ = 10^\circ$: 1ο. (δ) $-150^\circ + 360^\circ = 210^\circ$: 3ο.` },
    { level: 1, type: "fields", q: R`Να βρείτε τη γωνία $\theta \in [0^\circ, 360^\circ)$ που έχει την ίδια τελική πλευρά με: (α) $-20^\circ$, (β) $1110^\circ$, (γ) $-1000^\circ$.`,
      fields: [{ label: "(α) θ =", ans: 340 }, { label: "(β) θ =", ans: 30 }, { label: "(γ) θ =", ans: 80 }],
      hint: R`$1110 = 3\cdot 360 + 30$. Για αρνητικές, πρόσθεσε $360^\circ$ όσες φορές χρειάζεται.`,
      sol: R`(α) $-20^\circ + 360^\circ = 340^\circ$. (β) $1110^\circ - 3\cdot 360^\circ = 30^\circ$. (γ) $-1000^\circ + 3\cdot 360^\circ = 80^\circ$.` },
    { level: 1, type: "mc", q: R`Ποια γωνία <b>δεν</b> έχει την ίδια τελική πλευρά με τη γωνία $45^\circ$;`,
      options: ["$405^\\circ$", "$-315^\\circ$", "$765^\\circ$", "$-45^\\circ$"], correct: 3,
      hint: R`Η διαφορά από τη $45^\circ$ πρέπει να είναι ακέραιο πολλαπλάσιο του $360^\circ$.`,
      sol: R`$405 - 45 = 360$ ✓, $-315 - 45 = -360$ ✓, $765 - 45 = 720$ ✓. Αλλά $-45 - 45 = -90$, δεν είναι πολλαπλάσιο του $360$: η $-45^\circ$ έχει τελική πλευρά στο 4ο τεταρτημόριο.` },
    { level: 2, type: "fields", q: R`Δύο θετικές γωνίες $x, y < 720^\circ$ σε κανονική θέση έχουν την ίδια τελική πλευρά και η μία είναι <b>τετραπλάσια</b> της άλλης. Να βρείτε τα μέτρα τους.`,
      fields: [{ label: "μικρότερη y =", ans: 120 }, { label: "μεγαλύτερη x =", ans: 480 }],
      hint: R`$x = 4y$ και, αφού διαφέρουν κατά μία στροφή, $x = y + 360^\circ$.`,
      sol: R`$4y = y + 360^\circ \Rightarrow 3y = 360^\circ \Rightarrow y = 120^\circ$, $x = 480^\circ$. (Δύο στροφές θα έδιναν $3y = 720^\circ$, $y = 240^\circ$, $x = 960^\circ > 720^\circ$ — απορρίπτεται.)` },
    { level: 2, type: "fields", q: R`Δύο θετικές γωνίες $x, y < 720^\circ$ σε κανονική θέση έχουν την ίδια τελική πλευρά και η μία είναι <b>τριπλάσια</b> της άλλης. Να βρείτε τα μέτρα τους.`,
      fields: [{ label: "μικρότερη y =", ans: 180 }, { label: "μεγαλύτερη x =", ans: 540 }],
      hint: R`$x = 3y$ και $x = y + 360^\circ$.`,
      sol: R`$3y = y + 360^\circ \Rightarrow y = 180^\circ$, $x = 540^\circ$.` },
    { level: 2, type: "mc", q: R`Δύο γωνίες $\alpha$ και $\beta$ σε κανονική θέση έχουν την ίδια τελική πλευρά. Ποιο από τα πιο κάτω <b>ισχύει πάντα</b>;`,
      options: ["$\\alpha + \\beta = 360^\\circ$", "$\\alpha = \\beta$", "η διαφορά $\\alpha - \\beta$ είναι ακέραιο πολλαπλάσιο του $360^\\circ$", "$\\alpha - \\beta = 180^\\circ$"], correct: 2,
      hint: R`Δοκίμασε $\alpha = 30^\circ$ και $\beta = 390^\circ$.`,
      sol: R`Ίδια τελική πλευρά σημαίνει ότι διαφέρουν κατά ακέραιο αριθμό πλήρων στροφών: $\alpha - \beta = \kappa\cdot 360^\circ$. Το $\alpha + \beta = 360^\circ$ ισχύει μόνο σε ειδικές περιπτώσεις (π.χ. $120^\circ$ και $240^\circ$ δεν έχουν καν ίδια τελική πλευρά).` },
    { level: 3, type: "fields", q: R`Η γωνία $\theta$ έχει την ίδια τελική πλευρά με τη $70^\circ$ και ισχύει $1000^\circ < \theta < 1500^\circ$. Να βρείτε την $\theta$.`,
      fields: [{ label: "θ =", ans: 1150 }],
      hint: R`$\theta = 70^\circ + \kappa\cdot 360^\circ$. Δοκίμασε $\kappa = 2, 3, 4$.`,
      sol: R`$70 + 2\cdot 360 = 790$, $70 + 3\cdot 360 = 1150$, $70 + 4\cdot 360 = 1510$. Μόνο η $\theta = 1150^\circ$ είναι στο διάστημα.` }
  ]
},
/* ───────────────────────────── 2.2 ───────────────────────────── */
{
  id: "2.2", unit: 2, title: "Τριγωνομετρικοί αριθμοί γωνίας σε κανονική θέση",
  book: "Α΄ Τεύχος §2.2 · Δραστηριότητες σελ. 60",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Αν $A(x, y) \ne O$ είναι σημείο της τελικής πλευράς της γωνίας $\theta$ και $\rho = \sqrt{x^2 + y^2} > 0$ η απόστασή του από την αρχή, τότε:</p>
$$\text{ημ}\theta = \frac{y}{\rho} \qquad \text{συν}\theta = \frac{x}{\rho} \qquad \text{εφ}\theta = \frac{y}{x}\ (x \ne 0) \qquad \text{σφ}\theta = \frac{x}{y}\ (y \ne 0)$$
<p>Είναι η γενίκευση των ορισμών του ορθογωνίου τριγώνου ($\text{ημ} = \frac{\text{απέναντι}}{\text{υποτείνουσα}}$ κ.λπ.) για <b>οποιαδήποτε</b> γωνία.</p></div>

<div class="tbox tip"><h4>Χρήσιμα</h4>
<p>$\text{εφ}\theta = \dfrac{\text{ημ}\theta}{\text{συν}\theta}$, $\;\text{σφ}\theta = \dfrac{\text{συν}\theta}{\text{ημ}\theta} = \dfrac{1}{\text{εφ}\theta}$ — η εφαπτομένη και η συνεφαπτομένη είναι αντίστροφες.</p>
<p>Οι λόγοι <b>δεν εξαρτώνται</b> από το σημείο που διαλέγουμε στην τελική πλευρά (όμοια τρίγωνα). Άρα και γωνίες με την ίδια τελική πλευρά έχουν τους ίδιους τριγωνομετρικούς αριθμούς.</p></div>

<div class="tbox"><h4>Παράδειγμα</h4>
<p>$A(-3, 4)$: $\rho = \sqrt{9 + 16} = 5$ ⇒ $\text{ημ}\theta = \frac45$, $\text{συν}\theta = -\frac35$, $\text{εφ}\theta = -\frac43$, $\text{σφ}\theta = -\frac34$.</p></div>`,
  widget: "pointtrig",
  exercises: [
    { level: 1, type: "fields", q: R`Η τελική πλευρά της γωνίας $\theta$ διέρχεται από το σημείο $A(-3, 4)$. Να υπολογίσετε τους τριγωνομετρικούς αριθμούς της.` + FIG.axes({ pt: [-3, 4], lab: "A(−3, 4)" }),
      fields: [{ label: "ημθ =", ans: "4/5" }, { label: "συνθ =", ans: "-3/5" }, { label: "εφθ =", ans: "-4/3" }, { label: "σφθ =", ans: "-3/4" }],
      hint: R`Πρώτα $\rho = \sqrt{x^2 + y^2}$.`,
      sol: R`$\rho = \sqrt{9 + 16} = 5$. $\text{ημ}\theta = \frac45$, $\text{συν}\theta = -\frac35$, $\text{εφ}\theta = \frac{4}{-3} = -\frac43$, $\text{σφ}\theta = -\frac34$.` },
    { level: 1, type: "fields", q: R`Η τελική πλευρά της $\theta$ διέρχεται από το $A(1, -1)$. Να υπολογίσετε τους τριγωνομετρικούς αριθμούς της. <span class="muted">(π.χ. <code>-√2/2</code>)</span>` + FIG.axes({ pt: [1, -1], lab: "A(1, −1)", m: 1.3 }),
      fields: [{ label: "ημθ =", ans: "-√2/2" }, { label: "συνθ =", ans: "√2/2" }, { label: "εφθ =", ans: -1 }, { label: "σφθ =", ans: -1 }],
      hint: R`$\rho = \sqrt2$, και $\frac{1}{\sqrt2} = \frac{\sqrt2}{2}$.`,
      sol: R`$\rho = \sqrt{1 + 1} = \sqrt2$. $\text{ημ}\theta = -\frac{1}{\sqrt2} = -\frac{\sqrt2}{2}$, $\text{συν}\theta = \frac{\sqrt2}{2}$, $\text{εφ}\theta = \text{σφ}\theta = -1$.` },
    { level: 2, type: "fields", q: R`Η τελική πλευρά της $\theta$ διέρχεται από το $A(-\sqrt3, 1)$. Να υπολογίσετε τους τριγωνομετρικούς αριθμούς της.`,
      fields: [{ label: "ημθ =", ans: "1/2" }, { label: "συνθ =", ans: "-√3/2" }, { label: "εφθ =", ans: "-√3/3" }, { label: "σφθ =", ans: "-√3" }],
      hint: R`$\rho = \sqrt{3 + 1} = 2$.`,
      sol: R`$\rho = 2$. $\text{ημ}\theta = \frac12$, $\text{συν}\theta = -\frac{\sqrt3}{2}$, $\text{εφ}\theta = \frac{1}{-\sqrt3} = -\frac{\sqrt3}{3}$, $\text{σφ}\theta = -\sqrt3$. (Είναι η γωνία $150^\circ$.)` },
    { level: 2, type: "mc", q: R`Η τελική πλευρά της $\theta$ διέρχεται από το $A(-10, 0)$. Ποια πρόταση είναι σωστή;`,
      options: ["$\\text{ημ}\\theta = -1$", "$\\text{συν}\\theta = -1$ και η $\\text{σφ}\\theta$ δεν ορίζεται", "$\\text{εφ}\\theta$ δεν ορίζεται", "$\\text{συν}\\theta = -10$"], correct: 1,
      hint: R`$\rho = 10$, $y = 0$. Ποιος λόγος έχει το $y$ στον παρονομαστή;`,
      sol: R`$\rho = 10$: $\text{ημ}\theta = \frac{0}{10} = 0$, $\text{συν}\theta = \frac{-10}{10} = -1$, $\text{εφ}\theta = \frac{0}{-10} = 0$, ενώ η $\text{σφ}\theta = \frac{x}{y}$ <b>δεν ορίζεται</b> ($y = 0$). Είναι η γωνία $180^\circ$.` },
    { level: 2, type: "fields", q: R`Η τελική πλευρά της $\theta$ διέρχεται από το $A(5, -12)$. Να βρείτε το $\rho$ και την τιμή της παράστασης $\Pi = 13\,\text{ημ}\theta + 26\,\text{συν}\theta$.`,
      fields: [{ label: "ρ =", ans: 13 }, { label: "Π =", ans: -2 }],
      hint: R`$\rho = \sqrt{25 + 144}$.`,
      sol: R`$\rho = 13$, $\text{ημ}\theta = -\frac{12}{13}$, $\text{συν}\theta = \frac{5}{13}$. $\Pi = -12 + 10 = -2$.` },
    { level: 2, type: "fields", q: R`Η γωνία $\widehat{BOA} = 45^\circ$ είναι σε κανονική θέση και η τελική της πλευρά τέμνει τον κύκλο κέντρου $O$ και ακτίνας $1$ στο σημείο $A(\alpha, \alpha)$. Να βρείτε το $\alpha$ και τους τριγωνομετρικούς αριθμούς της $45^\circ$.`,
      fields: [{ label: "α =", ans: "√2/2" }, { label: "ημ45° =", ans: "√2/2" }, { label: "συν45° =", ans: "√2/2" }, { label: "εφ45° =", ans: 1 }],
      hint: R`Το $A$ απέχει $1$ από το $O$: $\alpha^2 + \alpha^2 = 1$, με $\alpha > 0$.`,
      sol: R`$2\alpha^2 = 1 \Rightarrow \alpha = \frac{1}{\sqrt2} = \frac{\sqrt2}{2}$. Με $\rho = 1$: $\text{ημ}45^\circ = \text{συν}45^\circ = \frac{\sqrt2}{2}$, $\text{εφ}45^\circ = 1$.` },
    { level: 2, type: "mc", q: R`Οι γωνίες $\alpha$ και $\beta$ σε κανονική θέση έχουν τελική πλευρά που διέρχεται από τα $A(-2, -1)$ και $B(-6, -3)$ αντίστοιχα. Τι ισχύει;`,
      options: ["$\\text{ημ}\\beta = 3\\,\\text{ημ}\\alpha$", "οι $\\alpha, \\beta$ έχουν τους ίδιους τριγωνομετρικούς αριθμούς", "$\\text{εφ}\\beta = 3\\,\\text{εφ}\\alpha$", "$\\text{συν}\\beta = -\\text{συν}\\alpha$"], correct: 1,
      hint: R`Τα $A$, $B$ και $O$ είναι συνευθειακά: $B = 3\cdot A$.`,
      sol: R`Τα $A$, $B$ βρίσκονται στην ίδια ημιευθεία από το $O$ (οι συντεταγμένες του $B$ είναι τριπλάσιες), άρα οι γωνίες έχουν την ίδια τελική πλευρά. Οι λόγοι δεν αλλάζουν: π.χ. $\text{ημ}\alpha = \frac{-1}{\sqrt5}$ και $\text{ημ}\beta = \frac{-3}{\sqrt{45}} = \frac{-3}{3\sqrt5} = \frac{-1}{\sqrt5}$.` }
  ]
},
/* ───────────────────────────── 2.3 ───────────────────────────── */
{
  id: "2.3", unit: 2, title: "Τριγωνομετρικός κύκλος",
  book: "Α΄ Τεύχος §2.3 · Δραστηριότητες σελ. 72",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p><b>Τριγωνομετρικός κύκλος</b> είναι ο κύκλος με κέντρο την αρχή των αξόνων και ακτίνα $1$. Αν η τελική πλευρά της $\omega$ τον τέμνει στο $M(x, y)$, τότε ($\rho = 1$):</p>
$$\text{συν}\omega = x \qquad \text{ημ}\omega = y \qquad -1 \le \text{ημ}\omega \le 1,\quad -1 \le \text{συν}\omega \le 1$$
<p>Ο $x'x$ λέγεται άξονας συνημιτόνων, ο $y'y$ άξονας ημιτόνων και η εφαπτομένη του κύκλου στο $K(1, 0)$ <b>άξονας εφαπτομένων</b>.</p></div>

<div class="tbox"><h4>Πρόσημα</h4>
<table class="mini"><tr><th></th><th>1ο</th><th>2ο</th><th>3ο</th><th>4ο</th></tr>
<tr><td>ημ</td><td>+</td><td>+</td><td>−</td><td>−</td></tr><tr><td>συν</td><td>+</td><td>−</td><td>−</td><td>+</td></tr><tr><td>εφ, σφ</td><td>+</td><td>−</td><td>+</td><td>−</td></tr></table>
<p>Μνημονικά: 1ο όλοι θετικοί · 2ο μόνο το ημίτονο · 3ο μόνο η εφαπτομένη · 4ο μόνο το συνημίτονο.</p></div>

<div class="tbox tip"><h4>Βασικές τιμές</h4>
<table class="mini"><tr><th>$\omega$</th><th>$0^\circ$</th><th>$30^\circ$</th><th>$45^\circ$</th><th>$60^\circ$</th><th>$90^\circ$</th><th>$180^\circ$</th><th>$270^\circ$</th><th>$360^\circ$</th></tr>
<tr><td>ημ</td><td>0</td><td>$\frac12$</td><td>$\frac{\sqrt2}{2}$</td><td>$\frac{\sqrt3}{2}$</td><td>1</td><td>0</td><td>−1</td><td>0</td></tr>
<tr><td>συν</td><td>1</td><td>$\frac{\sqrt3}{2}$</td><td>$\frac{\sqrt2}{2}$</td><td>$\frac12$</td><td>0</td><td>−1</td><td>0</td><td>1</td></tr>
<tr><td>εφ</td><td>0</td><td>$\frac{\sqrt3}{3}$</td><td>1</td><td>$\sqrt3$</td><td>—</td><td>0</td><td>—</td><td>0</td></tr></table></div>`,
  widget: "ucircle",
  gen: "gnot",
  exercises: [
    { level: 1, type: "mc", q: R`Το ημίτονο μιας γωνίας $\theta$ <b>δεν</b> μπορεί να είναι ίσο με:`,
      options: ["$\\frac12$", "$-\\frac32$", "$-\\frac12$", "$\\frac{\\sqrt3}{2}$"], correct: 1,
      hint: R`$-1 \le \text{ημ}\theta \le 1$.`,
      sol: R`$-\frac32 = -1{,}5 < -1$, άρα δεν υπάρχει γωνία με $\text{ημ}\theta = -\frac32$.` },
    { level: 1, type: "fields", q: R`Η τελική πλευρά της $\omega$ τέμνει τον τριγωνομετρικό κύκλο στο $A\left(-\frac12, -\frac{\sqrt3}{2}\right)$. Να υπολογίσετε τους τριγωνομετρικούς αριθμούς της $\omega$.`,
      fields: [{ label: "ημω =", ans: "-√3/2" }, { label: "συνω =", ans: "-1/2" }, { label: "εφω =", ans: "√3" }, { label: "σφω =", ans: "√3/3" }],
      hint: R`Στον τριγωνομετρικό κύκλο: $\text{συν}\omega = x$, $\text{ημ}\omega = y$.`,
      sol: R`$\text{ημ}\omega = -\frac{\sqrt3}{2}$, $\text{συν}\omega = -\frac12$, $\text{εφ}\omega = \frac{-\sqrt3/2}{-1/2} = \sqrt3$, $\text{σφ}\omega = \frac{1}{\sqrt3} = \frac{\sqrt3}{3}$.` },
    { level: 1, type: "fields", q: R`Σε ποιο τεταρτημόριο βρίσκεται η τελική πλευρά της $\theta$ αν: (α) $\text{ημ}\theta > 0$ και $\text{συν}\theta < 0$, (β) $\text{εφ}\theta > 0$ και $\text{ημ}\theta < 0$, (γ) $\text{σφ}\theta < 0$ και $\text{συν}\theta > 0$;`,
      fields: [{ label: "(α) →", ans: 2 }, { label: "(β) →", ans: 3 }, { label: "(γ) →", ans: 4 }],
      hint: R`Συμβουλέψου τον πίνακα προσήμων.`,
      sol: R`(α) ημ+ συν− : 2ο. (β) εφ+ σημαίνει 1ο ή 3ο, και ημ− ⇒ 3ο. (γ) σφ− σημαίνει 2ο ή 4ο, και συν+ ⇒ 4ο.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε: (α) $\text{ημ}270^\circ + \text{συν}180^\circ$, (β) $2\,\text{ημ}30^\circ + \text{συν}60^\circ\cdot\text{εφ}45^\circ$, (γ) $\text{ημ}^2 60^\circ + \text{συν}^2 60^\circ$.`,
      fields: [{ label: "(α) =", ans: -2 }, { label: "(β) =", ans: "3/2" }, { label: "(γ) =", ans: 1 }],
      hint: R`Η $270^\circ$ αντιστοιχεί στο σημείο $(0, -1)$ και η $180^\circ$ στο $(-1, 0)$.`,
      sol: R`(α) $-1 + (-1) = -2$. (β) $2\cdot\frac12 + \frac12\cdot 1 = \frac32$. (γ) $\frac34 + \frac14 = 1$.` },
    { level: 2, type: "mc", q: R`Ποια από τις προτάσεις είναι <b>σωστή</b>;`,
      options: ["Αν $\\text{ημ}\\theta < 0$ και $\\text{συν}\\theta < 0$, τότε $\\text{εφ}\\theta < 0$.", "Αν $\\theta = 200^\\circ$, τότε $\\text{ημ}\\theta > 0$.", "Η τελική πλευρά της $-200^\\circ$ είναι στο 2ο τεταρτημόριο.", "Ο αριθμός $\\text{σφ}(-210^\\circ)$ είναι θετικός."], correct: 2,
      hint: R`$-200^\circ + 360^\circ = 160^\circ$ και $-210^\circ + 360^\circ = 150^\circ$.`,
      sol: R`$-200^\circ$ έχει την ίδια τελική πλευρά με τη $160^\circ$: 2ο τεταρτημόριο ✓.<br>Οι άλλες: πηλίκο δύο αρνητικών είναι θετικό· η $200^\circ$ είναι στο 3ο (ημ < 0)· η $-210^\circ \equiv 150^\circ$ είναι στο 2ο, όπου σφ < 0.` },
    { level: 2, type: "fields", q: R`Για ποιες τιμές του $k$ υπάρχει γωνία $\theta$ με $\text{ημ}\theta = \dfrac{k - 1}{3}$; Δώστε το διάστημα $[\,a, b\,]$.`,
      fields: [{ label: "a =", ans: -2 }, { label: "b =", ans: 4 }],
      hint: R`Πρέπει $-1 \le \frac{k-1}{3} \le 1$.`,
      sol: R`$-1 \le \frac{k-1}{3} \le 1 \Rightarrow -3 \le k - 1 \le 3 \Rightarrow -2 \le k \le 4$.` },
    { level: 3, type: "mc", q: R`Αν $180^\circ < x < 270^\circ$, τότε ισχύει πάντα ότι:`,
      options: ["$\\text{εφ}x < \\text{συν}x$", "$\\text{εφ}x > \\text{συν}x$", "$\\text{εφ}x = \\text{συν}x$", "$\\text{ημ}x > 0$"], correct: 1,
      hint: R`Στο 3ο τεταρτημόριο, τι πρόσημο έχουν η εφαπτομένη και το συνημίτονο;`,
      sol: R`Στο 3ο τεταρτημόριο $\text{εφ}x > 0$ και $\text{συν}x < 0$. Ένας θετικός είναι πάντα μεγαλύτερος από έναν αρνητικό: $\text{εφ}x > \text{συν}x$.` }
  ]
},
/* ───────────────────────────── 2.4 ───────────────────────────── */
{
  id: "2.4", unit: 2, title: "Αναγωγή σε οξεία γωνία",
  book: "Α΄ Τεύχος §2.4 · Δραστηριότητες σελ. 79",
  theory: R`
<div class="tbox"><h4>Παραπληρωματικές γωνίες: $180^\circ - \theta$</h4>
<p>Τα σημεία του τριγωνομετρικού κύκλου για $\theta$ και $180^\circ - \theta$ είναι <b>συμμετρικά ως προς τον άξονα $y'y$</b>: ίδιο $y$, αντίθετο $x$.</p>
$$\text{ημ}(180^\circ - \theta) = \text{ημ}\theta \qquad \text{συν}(180^\circ - \theta) = -\text{συν}\theta$$
$$\text{εφ}(180^\circ - \theta) = -\text{εφ}\theta \qquad \text{σφ}(180^\circ - \theta) = -\text{σφ}\theta$$
<p>π.χ. $\text{ημ}150^\circ = \text{ημ}30^\circ = \frac12$, $\;\text{συν}135^\circ = -\text{συν}45^\circ = -\frac{\sqrt2}{2}$.</p></div>

<div class="tbox"><h4>Συμπληρωματικές γωνίες: $90^\circ - \theta$</h4>
<p>Τα σημεία είναι συμμετρικά ως προς τη διχοτόμο $y = x$: οι συντεταγμένες ανταλλάσσονται.</p>
$$\text{ημ}(90^\circ - \theta) = \text{συν}\theta \qquad \text{συν}(90^\circ - \theta) = \text{ημ}\theta \qquad \text{εφ}(90^\circ - \theta) = \text{σφ}\theta$$
<p>π.χ. $\text{ημ}85^\circ = \text{συν}5^\circ$, $\;\text{συν}45^\circ = \text{ημ}45^\circ$.</p></div>

<div class="tbox tip"><h4>Σε τρίγωνο</h4>
<p>Αφού $\hat A + \hat B + \hat\Gamma = 180^\circ$: $\;\text{ημ}(B + \Gamma) = \text{ημ}A$ και $\text{συν}(B + \Gamma) = -\text{συν}A$.</p></div>`,
  widget: "reduce",
  gen: "gnot",
  exercises: [
    { level: 1, type: "fields", q: R`Χωρίς υπολογιστική μηχανή: (α) $\text{ημ}150^\circ$, (β) $\text{συν}135^\circ$, (γ) $\text{εφ}120^\circ$, (δ) $\text{συν}150^\circ$.`,
      fields: [{ label: "(α) =", ans: "1/2" }, { label: "(β) =", ans: "-√2/2" }, { label: "(γ) =", ans: "-√3" }, { label: "(δ) =", ans: "-√3/2" }],
      hint: R`Γράψε κάθε γωνία ως $180^\circ - $ (οξεία).`,
      sol: R`(α) $\text{ημ}30^\circ = \frac12$. (β) $-\text{συν}45^\circ = -\frac{\sqrt2}{2}$. (γ) $-\text{εφ}60^\circ = -\sqrt3$. (δ) $-\text{συν}30^\circ = -\frac{\sqrt3}{2}$.` },
    { level: 1, type: "mc", q: R`Το $\text{ημ}110^\circ$ είναι ίσο με:`,
      options: ["$-\\text{ημ}70^\\circ$", "$\\text{ημ}70^\\circ$", "$\\text{συν}70^\\circ$", "$-\\text{συν}20^\\circ$"], correct: 1,
      hint: R`$110^\circ = 180^\circ - 70^\circ$.`,
      sol: R`$\text{ημ}110^\circ = \text{ημ}(180^\circ - 70^\circ) = \text{ημ}70^\circ$. (Ισούται επίσης με $\text{συν}20^\circ$, όχι με $-\text{συν}20^\circ$.)` },
    { level: 1, type: "mc", q: R`Το $\text{συν}140^\circ$ είναι ίσο με:`,
      options: ["$\\text{συν}40^\\circ$", "$-\\text{ημ}40^\\circ$", "$-\\text{συν}40^\\circ$", "$\\text{ημ}40^\\circ$"], correct: 2,
      hint: R`$140^\circ = 180^\circ - 40^\circ$, και στο 2ο τεταρτημόριο το συνημίτονο είναι αρνητικό.`,
      sol: R`$\text{συν}(180^\circ - 40^\circ) = -\text{συν}40^\circ$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε: (α) $\dfrac{\text{ημ}160^\circ}{\text{ημ}20^\circ} + \dfrac{\text{συν}160^\circ}{\text{συν}20^\circ}$, (β) $\text{ημ}^2 120^\circ + \text{συν}^2 150^\circ$.`,
      fields: [{ label: "(α) =", ans: 0 }, { label: "(β) =", ans: "3/2" }],
      hint: R`$\text{ημ}160^\circ = \text{ημ}20^\circ$ και $\text{συν}160^\circ = -\text{συν}20^\circ$.`,
      sol: R`(α) $1 + (-1) = 0$. (β) $\text{ημ}120^\circ = \frac{\sqrt3}{2}$, $\text{συν}150^\circ = -\frac{\sqrt3}{2}$: $\frac34 + \frac34 = \frac32$.` },
    { level: 2, type: "fields", q: R`Δίνεται ότι $\text{ημ}25^\circ \approx 0{,}4226$. Χωρίς υπολογιστική μηχανή, να βρείτε: (α) $\text{ημ}155^\circ$, (β) $\text{συν}65^\circ$, (γ) $\text{συν}115^\circ$.`,
      fields: [{ label: "(α) ≈", ans: 0.4226, tol: 1e-4 }, { label: "(β) ≈", ans: 0.4226, tol: 1e-4 }, { label: "(γ) ≈", ans: -0.4226, tol: 1e-4 }],
      hint: R`$155 = 180 - 25$, $\;65 = 90 - 25$, $\;115 = 180 - 65$.`,
      sol: R`(α) $\text{ημ}155^\circ = \text{ημ}25^\circ \approx 0{,}4226$. (β) $\text{συν}65^\circ = \text{ημ}25^\circ \approx 0{,}4226$. (γ) $\text{συν}115^\circ = -\text{συν}65^\circ \approx -0{,}4226$.` },
    { level: 2, type: "mc", q: R`Σε κάθε τρίγωνο $AB\Gamma$ ισχύει:`,
      options: ["$\\text{ημ}(B + \\Gamma) = -\\text{ημ}A$", "$\\text{συν}(B + \\Gamma) = \\text{συν}A$", "$\\text{ημ}(B + \\Gamma) = \\text{ημ}A$", "$\\text{εφ}(B + \\Gamma) = \\text{εφ}A$"], correct: 2,
      hint: R`$B + \Gamma = 180^\circ - A$.`,
      sol: R`$\text{ημ}(B + \Gamma) = \text{ημ}(180^\circ - A) = \text{ημ}A$. (Αντίθετα $\text{συν}(B+\Gamma) = -\text{συν}A$ και $\text{εφ}(B+\Gamma) = -\text{εφ}A$.)` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε την παράσταση $\Pi = \text{ημ}(90^\circ - \alpha) - \text{συν}(90^\circ - \alpha) + \text{ημ}\alpha - \text{συν}\alpha$.`,
      fields: [{ label: "Π =", ans: 0 }],
      hint: R`$\text{ημ}(90^\circ - \alpha) = \text{συν}\alpha$, $\;\text{συν}(90^\circ - \alpha) = \text{ημ}\alpha$.`,
      sol: R`$\Pi = \text{συν}\alpha - \text{ημ}\alpha + \text{ημ}\alpha - \text{συν}\alpha = 0$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τις γωνίες $x$ με $0^\circ \le x \le 180^\circ$ για τις οποίες $\text{ημ}x = \frac12$ (σε αύξουσα σειρά).`,
      fields: [{ label: "x₁ (°) =", ans: 30 }, { label: "x₂ (°) =", ans: 150 }],
      hint: R`Το ημίτονο είναι θετικό στο 1ο και στο 2ο τεταρτημόριο: $\text{ημ}(180^\circ - \theta) = \text{ημ}\theta$.`,
      sol: R`$\text{ημ}30^\circ = \frac12$ και $\text{ημ}150^\circ = \text{ημ}(180^\circ - 30^\circ) = \frac12$. Λύσεις: $30^\circ$ και $150^\circ$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τη γωνία $x$ με $0^\circ \le x \le 180^\circ$ για την οποία $\text{συν}x = -\frac{\sqrt3}{2}$.`,
      fields: [{ label: "x (°) =", ans: 150 }],
      hint: R`Αρνητικό συνημίτονο ⇒ αμβλεία γωνία: $\text{συν}(180^\circ - \theta) = -\text{συν}\theta$.`,
      sol: R`$\text{συν}30^\circ = \frac{\sqrt3}{2}$, άρα $\text{συν}150^\circ = -\frac{\sqrt3}{2}$. Στο $[0^\circ, 180^\circ]$ το συνημίτονο παίρνει κάθε τιμή μία φορά: $x = 150^\circ$.` }
  ]
},
/* ───────────────────────────── 2.5 ───────────────────────────── */
{
  id: "2.5", unit: 2, title: "Τριγωνομετρικές ταυτότητες",
  book: "Α΄ Τεύχος §2.5 · Δραστηριότητες σελ. 86, 89",
  theory: R`
<div class="tbox"><h4>Βασικές ταυτότητες</h4>
$$\text{ημ}^2\theta + \text{συν}^2\theta = 1 \qquad \text{εφ}\theta = \frac{\text{ημ}\theta}{\text{συν}\theta} \qquad \text{σφ}\theta = \frac{\text{συν}\theta}{\text{ημ}\theta} \qquad \text{εφ}\theta\cdot\text{σφ}\theta = 1$$
<p>Η πρώτη προκύπτει από το Πυθαγόρειο θεώρημα στον τριγωνομετρικό κύκλο: $x^2 + y^2 = 1$. Γράφεται και $\text{ημ}^2\theta = 1 - \text{συν}^2\theta$, $\;\text{συν}^2\theta = 1 - \text{ημ}^2\theta$.</p></div>

<div class="tbox"><h4>Από έναν αριθμό σε όλους</h4>
<p>Αν $\text{συν}\varphi = \frac{12}{13}$ και $0^\circ < \varphi < 90^\circ$: $\;\text{ημ}^2\varphi = 1 - \frac{144}{169} = \frac{25}{169}$ ⇒ $\text{ημ}\varphi = \pm\frac{5}{13}$.</p>
<p>Το <b>τεταρτημόριο</b> αποφασίζει το πρόσημο: στο 1ο, $\text{ημ}\varphi = \frac{5}{13}$. Μετά $\text{εφ}\varphi = \frac{5}{12}$, $\text{σφ}\varphi = \frac{12}{5}$.</p></div>

<div class="tbox tip"><h4>Απόδειξη ταυτοτήτων</h4>
<p>Ξεκινάμε από το πιο «σύνθετο» μέλος και καταλήγουμε στο άλλο: γράφουμε εφ, σφ με ημ, συν και χρησιμοποιούμε $\text{ημ}^2 + \text{συν}^2 = 1$.</p>
<p>π.χ. $\text{συν}^2\theta + \text{συν}^2\theta\,\text{εφ}^2\theta = \text{συν}^2\theta + \text{συν}^2\theta\cdot\frac{\text{ημ}^2\theta}{\text{συν}^2\theta} = \text{συν}^2\theta + \text{ημ}^2\theta = 1$.</p></div>`,
  widget: "ucircle",
  gen: "gtrig",
  exercises: [
    { level: 1, type: "fields", q: R`Αν $\text{συν}\varphi = \frac{12}{13}$ και $0^\circ < \varphi < 90^\circ$, να υπολογίσετε τους άλλους τριγωνομετρικούς αριθμούς της $\varphi$.`,
      fields: [{ label: "ημφ =", ans: "5/13" }, { label: "εφφ =", ans: "5/12" }, { label: "σφφ =", ans: "12/5" }],
      hint: R`$\text{ημ}^2\varphi = 1 - \text{συν}^2\varphi$, και στο 1ο τεταρτημόριο όλοι είναι θετικοί.`,
      sol: R`$\text{ημ}^2\varphi = 1 - \frac{144}{169} = \frac{25}{169} \Rightarrow \text{ημ}\varphi = \frac{5}{13}$. $\text{εφ}\varphi = \frac{5/13}{12/13} = \frac{5}{12}$, $\text{σφ}\varphi = \frac{12}{5}$.` },
    { level: 2, type: "fields", q: R`Αν $\text{ημ}\varphi = -\frac{8}{17}$ και $180^\circ < \varphi < 270^\circ$, να υπολογίσετε τους άλλους τριγωνομετρικούς αριθμούς της $\varphi$.`,
      fields: [{ label: "συνφ =", ans: "-15/17" }, { label: "εφφ =", ans: "8/15" }, { label: "σφφ =", ans: "15/8" }],
      hint: R`Στο 3ο τεταρτημόριο το συνημίτονο είναι αρνητικό και η εφαπτομένη θετική.`,
      sol: R`$\text{συν}^2\varphi = 1 - \frac{64}{289} = \frac{225}{289} \Rightarrow \text{συν}\varphi = -\frac{15}{17}$ (3ο τεταρτημόριο). $\text{εφ}\varphi = \frac{-8/17}{-15/17} = \frac{8}{15}$, $\text{σφ}\varphi = \frac{15}{8}$.` },
    { level: 3, type: "fields", q: R`Δίνεται ότι $\text{συν}\theta = -\frac{8}{17}$ και $\text{ημ}\theta > 0$. Να υπολογίσετε την τιμή της παράστασης $A = \dfrac{34\,\text{ημ}\theta + 17\,\text{συν}\theta}{8\,\text{εφ}\theta - 15\,\text{σφ}\theta}$.`,
      fields: [{ label: "ημθ =", ans: "15/17" }, { label: "A =", ans: "-22/7" }],
      hint: R`Η $\theta$ είναι στο 2ο τεταρτημόριο. Βρες ημ, εφ, σφ και αντικατάστησε.`,
      sol: R`$\text{ημ}\theta = \frac{15}{17}$, $\text{εφ}\theta = -\frac{15}{8}$, $\text{σφ}\theta = -\frac{8}{15}$.<br>Αριθμητής: $34\cdot\frac{15}{17} + 17\cdot\left(-\frac{8}{17}\right) = 30 - 8 = 22$. Παρονομαστής: $8\cdot\left(-\frac{15}{8}\right) - 15\cdot\left(-\frac{8}{15}\right) = -15 + 8 = -7$. $A = -\frac{22}{7}$.` },
    { level: 1, type: "mc", q: R`Αν $\text{ημ}x = \alpha$ και $0^\circ < x < 90^\circ$, τότε:`,
      options: ["$\\text{συν}x = 1 - \\alpha$", "$\\text{συν}x = 1 - \\alpha^2$", "$\\text{συν}x = \\sqrt{1 - \\alpha^2}$", "$\\text{συν}x = -\\sqrt{1 - \\alpha^2}$"], correct: 2,
      hint: R`$\text{συν}^2 x = 1 - \alpha^2$ και στο 1ο τεταρτημόριο $\text{συν}x > 0$.`,
      sol: R`$\text{συν}^2x = 1 - \text{ημ}^2x = 1 - \alpha^2$ και $\text{συν}x > 0$ ⇒ $\text{συν}x = \sqrt{1 - \alpha^2}$.` },
    { level: 1, type: "mc", q: R`Ποια ισότητα είναι <b>λάθος</b>;`,
      options: ["$\\text{ημ}^2 15^\\circ + \\text{συν}^2 15^\\circ = 1$", "$\\text{εφ}x\\cdot\\text{σφ}x = -1$", "αν $\\text{ημ}\\omega = 1$ τότε $\\text{συν}\\omega = 0$", "$\\dfrac{\\text{ημ}10^\\circ}{\\text{ημ}80^\\circ} = \\text{εφ}10^\\circ$"], correct: 1,
      hint: R`Η εφ και η σφ είναι αντίστροφες.`,
      sol: R`$\text{εφ}x\cdot\text{σφ}x = 1$, όχι $-1$. Οι άλλες ισχύουν: η τελευταία επειδή $\text{ημ}80^\circ = \text{συν}10^\circ$.` },
    { level: 2, type: "mc", q: R`Η παράσταση $(\text{ημ}\varphi + \text{συν}\varphi)^2 + (\text{ημ}\varphi - \text{συν}\varphi)^2$ ισούται με:`,
      options: ["$1$", "$2$", "$4\\,\\text{ημ}\\varphi\\,\\text{συν}\\varphi$", "$0$"], correct: 1,
      hint: R`Ανάπτυξε τα δύο τετράγωνα: τα διπλά γινόμενα αλληλοαναιρούνται.`,
      sol: R`$(\text{ημ}^2 + 2\text{ημ}\,\text{συν} + \text{συν}^2) + (\text{ημ}^2 - 2\text{ημ}\,\text{συν} + \text{συν}^2) = 2(\text{ημ}^2\varphi + \text{συν}^2\varphi) = 2$.` },
    { level: 2, type: "mc", q: R`Η παράσταση $\text{ημ}\theta - \text{ημ}\theta\,\text{συν}^2\theta$ ισούται με:`,
      options: ["$\\text{ημ}^3\\theta$", "$\\text{συν}^3\\theta$", "$\\text{ημ}\\theta\\,\\text{συν}\\theta$", "$0$"], correct: 0,
      hint: R`Βγάλε κοινό παράγοντα το $\text{ημ}\theta$.`,
      sol: R`$\text{ημ}\theta(1 - \text{συν}^2\theta) = \text{ημ}\theta\cdot\text{ημ}^2\theta = \text{ημ}^3\theta$.` },
    { level: 3, type: "fields", q: R`Αν $\text{εφ}\theta = 2$ και $180^\circ < \theta < 270^\circ$, να υπολογίσετε τα $\text{συν}\theta$ και $\text{ημ}\theta$.`,
      fields: [{ label: "συνθ =", ans: "-√5/5" }, { label: "ημθ =", ans: "-2√5/5" }],
      hint: R`$\text{ημ}\theta = 2\,\text{συν}\theta$. Αντικατάστησε στην $\text{ημ}^2\theta + \text{συν}^2\theta = 1$.`,
      sol: R`$4\text{συν}^2\theta + \text{συν}^2\theta = 1 \Rightarrow \text{συν}^2\theta = \frac15$. Στο 3ο τεταρτημόριο $\text{συν}\theta = -\frac{1}{\sqrt5} = -\frac{\sqrt5}{5}$ και $\text{ημ}\theta = 2\,\text{συν}\theta = -\frac{2\sqrt5}{5}$.` }
  ]
},
/* ───────────────────────────── 3.1 ───────────────────────────── */
{
  id: "3.1", unit: 3, title: "Σχετική θέση δύο κύκλων",
  book: "Α΄ Τεύχος §3.1 · Δραστηριότητες σελ. 102",
  theory: R`
<div class="tbox"><h4>Διάκεντρος</h4>
<p>Για δύο κύκλους $(K, R)$ και $(\Lambda, \rho)$ με $R \ge \rho$, η απόσταση $\delta = K\Lambda$ των κέντρων λέγεται <b>διάκεντρος</b>. Τη συγκρίνουμε με το άθροισμα και τη διαφορά των ακτίνων:</p>
<table class="mini"><tr><th>Θέση</th><th>Συνθήκη</th><th>Κοινά σημεία</th></tr>
<tr><td>ξένοι εξωτερικά</td><td>$\delta > R + \rho$</td><td>0</td></tr>
<tr><td>εφάπτονται εξωτερικά</td><td>$\delta = R + \rho$</td><td>1</td></tr>
<tr><td>τέμνονται</td><td>$R - \rho < \delta < R + \rho$</td><td>2</td></tr>
<tr><td>εφάπτονται εσωτερικά</td><td>$\delta = R - \rho$ ($R > \rho$)</td><td>1</td></tr>
<tr><td>ξένοι εσωτερικά</td><td>$\delta < R - \rho$</td><td>0</td></tr></table>
<p>Αν $\delta = 0$ και $R = \rho$, οι κύκλοι <b>ταυτίζονται</b>. Αν $\delta = 0$ και $R \ne \rho$, είναι ομόκεντροι (ξένοι εσωτερικά).</p></div>

<div class="tbox tip"><h4>Στο σημείο επαφής</h4>
<p>Όταν δύο κύκλοι εφάπτονται, το σημείο επαφής βρίσκεται <b>πάνω στη διάκεντρο</b> (ή στην προέκτασή της).</p></div>`,
  widget: "relpos",
  exercises: [
    { level: 1, type: "mc", q: R`Δίνονται οι κύκλοι $(K, 3\text{ cm})$ και $(\Lambda, 5\text{ cm})$ με $K\Lambda = 8$ cm. Οι κύκλοι:`,
      options: ["τέμνονται", "εφάπτονται εξωτερικά", "είναι ξένοι εξωτερικά", "εφάπτονται εσωτερικά"], correct: 1,
      hint: R`Σύγκρινε το $8$ με το $R + \rho$.`,
      sol: R`$R + \rho = 5 + 3 = 8 = \delta$: <b>εφάπτονται εξωτερικά</b>.` },
    { level: 1, type: "mc", q: R`Για τους ίδιους κύκλους $(K, 3)$, $(\Lambda, 5)$, ποια διάκεντρος δίνει κύκλους που <b>τέμνονται</b>;`,
      options: ["$K\\Lambda = 1$", "$K\\Lambda = 2$", "$K\\Lambda = 5$", "$K\\Lambda = 10$"], correct: 2,
      hint: R`Τέμνονται όταν $R - \rho < \delta < R + \rho$, δηλαδή $2 < \delta < 8$.`,
      sol: R`$2 < 5 < 8$ ✓. Με $\delta = 1$ είναι ξένοι εσωτερικά, με $\delta = 2$ εφάπτονται εσωτερικά, με $\delta = 10$ ξένοι εξωτερικά.` },
    { level: 1, type: "fields", q: R`Για τους κύκλους $(K, 4\text{ cm})$ και $(\Lambda, 5\text{ cm})$ να βρείτε τη διάκεντρο ώστε: (α) να εφάπτονται εξωτερικά, (β) να εφάπτονται εσωτερικά.`,
      fields: [{ label: "(α) δ =", ans: 9 }, { label: "(β) δ =", ans: 1 }],
      hint: R`Εξωτερικά: $R + \rho$. Εσωτερικά: $R - \rho$.`,
      sol: R`(α) $\delta = 5 + 4 = 9$ cm. (β) $\delta = 5 - 4 = 1$ cm.` },
    { level: 2, type: "fields", q: R`Δίνονται οι κύκλοι $(\Lambda, 10\text{ km})$ και $(M, 18\text{ km})$. Οι κύκλοι <b>τέμνονται</b> όταν η διάκεντρος $M\Lambda$ ανήκει στο διάστημα $(a, b)$. Να βρείτε τα $a$, $b$. Επίσης: για ποια $M\Lambda$ είναι ξένοι εξωτερικά;`,
      fields: [{ label: "a =", ans: 8 }, { label: "b =", ans: 28 }, { label: "ξένοι εξωτερικά για ΜΛ >", ans: 28 }],
      hint: R`$R - \rho = 8$, $R + \rho = 28$.`,
      sol: R`Τέμνονται για $8 < M\Lambda < 28$. Ξένοι εξωτερικά για $M\Lambda > 28$. (Ξένοι εσωτερικά για $0 \le M\Lambda < 8$.)` },
    { level: 2, type: "fields", q: R`Δύο κύκλοι εφάπτονται εσωτερικά. Η διάκεντρος είναι $2$ cm και η ακτίνα του ενός είναι $8$ cm. Ποιες είναι οι δυνατές τιμές της ακτίνας του άλλου;`,
      fields: [{ label: "μικρότερη τιμή =", ans: 6 }, { label: "μεγαλύτερη τιμή =", ans: 10 }],
      hint: R`$|R - \rho| = 2$: ο κύκλος των $8$ cm μπορεί να είναι ο μεγάλος ή ο μικρός.`,
      sol: R`$|8 - x| = 2 \Rightarrow x = 6$ ή $x = 10$ cm.` },
    { level: 2, type: "fields", q: R`Τρεις κύκλοι με ακτίνες $2$, $3$ και $4$ cm εφάπτονται εξωτερικά ανά δύο. Να βρείτε την περίμετρο του τριγώνου που σχηματίζουν τα κέντρα τους.`,
      fields: [{ label: "περίμετρος =", ans: 18 }],
      hint: R`Κάθε πλευρά του τριγώνου είναι διάκεντρος: άθροισμα ακτίνων.`,
      sol: R`Πλευρές $2 + 3 = 5$, $3 + 4 = 7$, $2 + 4 = 6$. Περίμετρος $18$ cm (ισούται με $2(2 + 3 + 4)$).` },
    { level: 1, type: "mc", q: R`Δύο <b>ομόκεντροι</b> κύκλοι με ακτίνες $3$ και $5$:`,
      options: ["ταυτίζονται", "είναι ξένοι εσωτερικά", "εφάπτονται εσωτερικά", "τέμνονται"], correct: 1,
      hint: R`$\delta = 0$ και $R - \rho = 2$.`,
      sol: R`$\delta = 0 < 2 = R - \rho$: ο μικρός βρίσκεται ολόκληρος μέσα στον μεγάλο χωρίς κοινά σημεία — <b>ξένοι εσωτερικά</b>.` }
  ]
},
/* ───────────────────────────── 3.2 ───────────────────────────── */
{
  id: "3.2", unit: 3, title: "Εγγεγραμμένες – επίκεντρες γωνίες",
  book: "Α΄ Τεύχος §3.2 · Δραστηριότητες σελ. 116",
  theory: R`
<div class="tbox"><h4>Ορισμοί</h4>
<p><b>Επίκεντρη</b> γωνία: η κορυφή της είναι το κέντρο του κύκλου. Το μέτρο της ισούται με το μέτρο του αντίστοιχου τόξου.</p>
<p><b>Εγγεγραμμένη</b> γωνία: η κορυφή της είναι σημείο του κύκλου και οι πλευρές της τέμνουν τον κύκλο. Λέμε ότι <b>βαίνει</b> στο τόξο που περιέχεται ανάμεσα στις πλευρές της.</p></div>

<div class="tbox"><h4>Θεώρημα</h4>
<p>Κάθε εγγεγραμμένη γωνία ισούται με το <b>μισό</b> της αντίστοιχης επίκεντρης (δηλαδή με το μισό του τόξου στο οποίο βαίνει).</p>
$$\widehat{AMB} = \frac{\widehat{AOB}}{2} = \frac{\overset{\frown}{AB}}{2}$$</div>

<div class="tbox tip"><h4>Πορίσματα</h4>
<ul><li>Εγγεγραμμένη που βαίνει σε <b>ημικύκλιο</b> είναι <b>ορθή</b>.</li>
<li>Εγγεγραμμένες γωνίες που βαίνουν στο ίδιο τόξο (ή σε ίσα τόξα) είναι <b>ίσες</b>.</li>
<li>Τα τόξα που περιέχονται μεταξύ δύο <b>παράλληλων χορδών</b> είναι ίσα.</li></ul></div>`,
  widget: "inscribed",
  gen: "gcirc",
  exercises: [
    { level: 1, type: "fields", q: R`Στο σχήμα, $O$ είναι το κέντρο του κύκλου και $\widehat{AOB} = 140^\circ$. Να βρείτε τη γωνία $x = \widehat{AMB}$.` + FIG.circ({ pts: { A: 200, B: 340, M: 95 }, segs: [["O", "A"], ["O", "B"], ["M", "A"], ["M", "B"]], ang: [["A", "O", "B", "140°"], ["A", "M", "B", "x"]] }),
      fields: [{ label: "x =", ans: 70 }],
      hint: R`Η $\widehat{AMB}$ είναι εγγεγραμμένη και βαίνει στο ίδιο τόξο με την επίκεντρη $\widehat{AOB}$.`,
      sol: R`$x = \frac{140^\circ}{2} = 70^\circ$.` },
    { level: 1, type: "fields", q: R`Στο σχήμα, η $AB$ είναι διάμετρος και $\widehat{\Gamma AB} = 35^\circ$. Να βρείτε τις γωνίες $\widehat{A\Gamma B}$ και $x = \widehat{AB\Gamma}$.` + FIG.circ({ pts: { A: 180, B: 0, "Γ": 70 }, segs: [["A", "B"], ["A", "Γ"], ["Γ", "B"]], ang: [["B", "A", "Γ", "35°"], ["A", "Γ", "B", "", "R"], ["Γ", "B", "A", "x"]] }),
      fields: [{ label: "ΑΓΒ =", ans: 90 }, { label: "x =", ans: 55 }],
      hint: R`Η $\widehat{A\Gamma B}$ βαίνει σε ημικύκλιο.`,
      sol: R`$\widehat{A\Gamma B} = 90^\circ$ (βαίνει σε ημικύκλιο). Από το άθροισμα γωνιών τριγώνου: $x = 180^\circ - 90^\circ - 35^\circ = 55^\circ$.` },
    { level: 1, type: "fields", q: R`Στο σχήμα, $\widehat{AMB} = 50^\circ$. Να βρείτε τη γωνία $x = \widehat{ANB}$ και την επίκεντρη $\widehat{AOB}$.` + FIG.circ({ pts: { A: 220, B: 320, M: 60, N: 130 }, segs: [["M", "A"], ["M", "B"], ["N", "A"], ["N", "B"]], ang: [["A", "M", "B", "50°"], ["A", "N", "B", "x"]] }),
      fields: [{ label: "x =", ans: 50 }, { label: "ΑΟΒ =", ans: 100 }],
      hint: R`Οι $\widehat{AMB}$ και $\widehat{ANB}$ βαίνουν στο ίδιο τόξο $AB$.`,
      sol: R`Εγγεγραμμένες στο ίδιο τόξο είναι ίσες: $x = 50^\circ$. Η επίκεντρη είναι διπλάσια: $\widehat{AOB} = 100^\circ$.` },
    { level: 2, type: "fields", q: R`Στο σχήμα, $O$ είναι το κέντρο και $\widehat{AOB} = 100^\circ$. Να βρείτε τις γωνίες $x = \widehat{OAB}$ και $y = \widehat{A\Gamma B}$.` + FIG.circ({ pts: { A: 220, B: 320, "Γ": 90 }, segs: [["O", "A"], ["O", "B"], ["A", "B"], ["Γ", "A"], ["Γ", "B"]], ang: [["A", "O", "B", "100°"], ["O", "A", "B", "x"], ["A", "Γ", "B", "y"]] }),
      fields: [{ label: "x =", ans: 40 }, { label: "y =", ans: 50 }],
      hint: R`Το τρίγωνο $OAB$ είναι ισοσκελές ($OA = OB$ ακτίνες).`,
      sol: R`$OA = OB$ ⇒ $x = \frac{180^\circ - 100^\circ}{2} = 40^\circ$. Η $y$ είναι εγγεγραμμένη στο τόξο $AB$: $y = 50^\circ$.` },
    { level: 2, type: "fields", q: R`Δύο εγγεγραμμένες γωνίες βαίνουν στο ίδιο τόξο και έχουν μέτρα $(3x + 10)^\circ$ και $(5x - 30)^\circ$. Να βρείτε το $x$ και το μέτρο του τόξου.`,
      fields: [{ label: "x =", ans: 20 }, { label: "τόξο =", ans: 140 }],
      hint: R`Εγγεγραμμένες στο ίδιο τόξο είναι ίσες.`,
      sol: R`$3x + 10 = 5x - 30 \Rightarrow x = 20$. Κάθε γωνία $= 70^\circ$, άρα το τόξο είναι $140^\circ$.` },
    { level: 2, type: "fields", q: R`Τρία σημεία $A, B, \Gamma$ χωρίζουν έναν κύκλο σε τόξα με λόγο $2 : 3 : 4$. Να βρείτε τις γωνίες του τριγώνου $AB\Gamma$ (από τη μικρότερη στη μεγαλύτερη).`,
      fields: [{ label: "μικρότερη =", ans: 40 }, { label: "μεσαία =", ans: 60 }, { label: "μεγαλύτερη =", ans: 80 }],
      hint: R`Τα τόξα είναι $2k, 3k, 4k$ με $9k = 360^\circ$. Κάθε γωνία είναι το μισό του απέναντι τόξου.`,
      sol: R`$k = 40^\circ$: τόξα $80^\circ, 120^\circ, 160^\circ$. Γωνίες: $40^\circ, 60^\circ, 80^\circ$ (άθροισμα $180^\circ$ ✓).` },
    { level: 2, type: "fields", q: R`Στο σχήμα, οι χορδές $AB$ και $\Gamma\Delta$ είναι παράλληλες και το τόξο $\overset{\frown}{B\Delta}$ (ανάμεσά τους, δεξιά) είναι $60^\circ$. Να βρείτε το τόξο $\overset{\frown}{A\Gamma}$ και τη γωνία $\widehat{A\Delta\Gamma}$.` + FIG.circ({ pts: { A: 150, B: 30, "Γ": 210, "Δ": 330 }, segs: [["A", "B"], ["Γ", "Δ"], ["A", "Δ"]], center: false }),
      fields: [{ label: "τόξο ΑΓ =", ans: 60 }, { label: "ΑΔΓ =", ans: 30 }],
      hint: R`Τόξα ανάμεσα σε παράλληλες χορδές είναι ίσα. Η $\widehat{A\Delta\Gamma}$ βαίνει στο τόξο $A\Gamma$.`,
      sol: R`$\overset{\frown}{A\Gamma} = \overset{\frown}{B\Delta} = 60^\circ$. Η εγγεγραμμένη $\widehat{A\Delta\Gamma} = \frac{60^\circ}{2} = 30^\circ$.` }
  ]
},
/* ───────────────────────────── 3.3 ───────────────────────────── */
{
  id: "3.3", unit: 3, title: "Εγγεγραμμένα τετράπλευρα σε κύκλο",
  book: "Α΄ Τεύχος §3.3 · Δραστηριότητες σελ. 122",
  theory: R`
<div class="tbox"><h4>Ορισμός και θεώρημα</h4>
<p>Ένα τετράπλευρο είναι <b>εγγεγραμμένο</b> σε κύκλο όταν και οι τέσσερις κορυφές του είναι σημεία του κύκλου.</p>
<p><b>Θεώρημα:</b> Κάθε εγγεγραμμένο τετράπλευρο έχει τις <b>απέναντι γωνίες παραπληρωματικές</b>:</p>
$$\hat A + \hat\Gamma = 180^\circ \qquad \hat B + \hat\Delta = 180^\circ$$
<p><i>Γιατί;</i> Οι $\hat A$ και $\hat\Gamma$ βαίνουν σε δύο τόξα που μαζί κάνουν ολόκληρο τον κύκλο: $\frac{360^\circ}{2} = 180^\circ$.</p></div>

<div class="tbox tip"><h4>Χρήσιμα</h4>
<ul><li>Κάθε <b>εξωτερική</b> γωνία εγγεγραμμένου τετραπλεύρου ισούται με την <b>απέναντι εσωτερική</b>.</li>
<li>Κάθε γωνία είναι το μισό του τόξου στο οποίο βαίνει: π.χ. $\hat A = \frac{\overset{\frown}{B\Gamma} + \overset{\frown}{\Gamma\Delta}}{2}$.</li>
<li>Από τα παραλληλόγραμμα, μόνο το <b>ορθογώνιο</b> (και το τετράγωνο) εγγράφεται σε κύκλο.</li></ul></div>`,
  widget: "cyclic",
  gen: "gcirc",
  exercises: [
    { level: 1, type: "fields", q: R`Το τετράπλευρο $AB\Gamma\Delta$ είναι εγγεγραμμένο σε κύκλο, με $\hat A = 70^\circ$ και $\hat B = 95^\circ$. Να βρείτε τις $\hat\Gamma$ και $\hat\Delta$.` + FIG.circ({ pts: { A: 200, B: 280, "Γ": 10, "Δ": 60 }, segs: [["A", "B"], ["B", "Γ"], ["Γ", "Δ"], ["Δ", "A"]], center: false, ang: [["Δ", "A", "B", "70°"], ["A", "B", "Γ", "95°"]] }),
      fields: [{ label: "Γ =", ans: 110 }, { label: "Δ =", ans: 85 }],
      hint: R`Απέναντι γωνίες: $A$ με $\Gamma$, $B$ με $\Delta$.`,
      sol: R`$\hat\Gamma = 180^\circ - 70^\circ = 110^\circ$, $\hat\Delta = 180^\circ - 95^\circ = 85^\circ$.` },
    { level: 1, type: "fields", q: R`Σε εγγεγραμμένο τετράπλευρο $AB\Gamma\Delta$ ισχύει $\hat A = 2\hat\Gamma$. Να βρείτε τις $\hat A$, $\hat\Gamma$.`,
      fields: [{ label: "Α =", ans: 120 }, { label: "Γ =", ans: 60 }],
      hint: R`$\hat A + \hat\Gamma = 180^\circ$.`,
      sol: R`$2\hat\Gamma + \hat\Gamma = 180^\circ \Rightarrow \hat\Gamma = 60^\circ$, $\hat A = 120^\circ$.` },
    { level: 2, type: "fields", q: R`Σε κύκλο θεωρούμε τα διαδοχικά τόξα $\overset{\frown}{AB} = 90^\circ$, $\overset{\frown}{B\Gamma} = 140^\circ$, $\overset{\frown}{\Gamma\Delta} = 100^\circ$. Να βρείτε τις γωνίες του τετραπλεύρου $AB\Gamma\Delta$.` + FIG.circ({ pts: { A: 120, B: 210, "Γ": 350, "Δ": 90 }, segs: [["A", "B"], ["B", "Γ"], ["Γ", "Δ"], ["Δ", "A"]], center: false, lab: { "Δ": [8, -14], A: [-12, -10] } }),
      fields: [{ label: "Α =", ans: 120 }, { label: "Β =", ans: 65 }, { label: "Γ =", ans: 60 }, { label: "Δ =", ans: 115 }],
      hint: R`Το τέταρτο τόξο: $\overset{\frown}{\Delta A} = 360^\circ - 330^\circ = 30^\circ$. Κάθε γωνία = μισό του τόξου που «βλέπει» απέναντι.`,
      sol: R`$\overset{\frown}{\Delta A} = 30^\circ$. $\hat A = \frac{140 + 100}{2} = 120^\circ$, $\hat B = \frac{100 + 30}{2} = 65^\circ$, $\hat\Gamma = \frac{30 + 90}{2} = 60^\circ$, $\hat\Delta = \frac{90 + 140}{2} = 115^\circ$. Έλεγχος: $120 + 60 = 65 + 115 = 180$ ✓.` },
    { level: 2, type: "fields", q: R`Στο σχήμα, η $AB$ είναι διάμετρος, η χορδή $\Delta\Gamma \parallel AB$ και το τόξο $\overset{\frown}{B\Gamma} = 60^\circ$. Να βρείτε τη γωνία $\widehat{AB\Gamma}$.` + FIG.circ({ pts: { A: 180, B: 0, "Γ": 60, "Δ": 120 }, segs: [["A", "B"], ["B", "Γ"], ["Γ", "Δ"], ["Δ", "A"]] }),
      fields: [{ label: "ΑΒΓ =", ans: 60 }],
      hint: R`Τόξα ανάμεσα σε παράλληλες χορδές είναι ίσα: $\overset{\frown}{A\Delta} = 60^\circ$. Η $\widehat{AB\Gamma}$ βαίνει στο τόξο $A\Delta\Gamma$.`,
      sol: R`$\overset{\frown}{A\Delta} = \overset{\frown}{B\Gamma} = 60^\circ$, άρα $\overset{\frown}{\Delta\Gamma} = 180^\circ - 120^\circ = 60^\circ$. $\widehat{AB\Gamma} = \frac{60^\circ + 60^\circ}{2} = 60^\circ$. Το $AB\Gamma\Delta$ είναι <b>ισοσκελές τραπέζιο</b>.` },
    { level: 2, type: "fields", q: R`Σε εγγεγραμμένο τετράπλευρο $AB\Gamma\Delta$ είναι $\hat A = 3x$ και $\hat\Gamma = x + 20^\circ$. Να βρείτε το $x$ και τη γωνία $\hat A$.`,
      fields: [{ label: "x =", ans: 40 }, { label: "Α =", ans: 120 }],
      hint: R`$3x + x + 20 = 180$.`,
      sol: R`$4x = 160 \Rightarrow x = 40^\circ$, $\hat A = 120^\circ$, $\hat\Gamma = 60^\circ$.` },
    { level: 1, type: "mc", q: R`Ποιο τετράπλευρο <b>μπορεί</b> να εγγραφεί σε κύκλο;`,
      options: ["τετράπλευρο με γωνίες $80^\\circ, 100^\\circ, 95^\\circ, 85^\\circ$ (με τη σειρά)", "ρόμβος με γωνία $60^\\circ$", "ορθογώνιο", "παραλληλόγραμμο με γωνία $70^\\circ$"], correct: 2,
      hint: R`Έλεγξε αν οι απέναντι γωνίες έχουν άθροισμα $180^\circ$.`,
      sol: R`Στο ορθογώνιο όλες οι γωνίες είναι $90^\circ$: $90 + 90 = 180$ ✓. Στο πρώτο $80 + 95 = 175 \ne 180$. Σε ρόμβο ή παραλληλόγραμμο (μη ορθογώνιο) οι απέναντι γωνίες είναι ίσες και όχι $90^\circ$, άρα δεν είναι παραπληρωματικές.` },
    { level: 2, type: "fields", q: R`Σε εγγεγραμμένο τετράπλευρο $AB\Gamma\Delta$ είναι $\hat\Delta = 80^\circ$. Προεκτείνουμε την πλευρά $AB$ πέρα από το $B$. Πόση είναι η εξωτερική γωνία στην κορυφή $B$;`,
      fields: [{ label: "εξωτερική =", ans: 80 }],
      hint: R`Εξωτερική $= 180^\circ - \hat B$, και $\hat B = 180^\circ - \hat\Delta$.`,
      sol: R`$\hat B = 100^\circ$, εξωτερική $= 180^\circ - 100^\circ = 80^\circ = \hat\Delta$ — η εξωτερική ισούται με την απέναντι εσωτερική.` }
  ]
},
/* ───────────────────────────── 3.4 ───────────────────────────── */
{
  id: "3.4", unit: 3, title: "Θεώρημα χορδής και εφαπτομένης",
  book: "Α΄ Τεύχος §3.4 · Δραστηριότητες σελ. 129, 135",
  theory: R`
<div class="tbox"><h4>Θεώρημα</h4>
<p>Η γωνία που σχηματίζεται από μια <b>χορδή</b> και την <b>εφαπτομένη</b> στο ένα άκρο της ισούται με κάθε <b>εγγεγραμμένη</b> γωνία που βαίνει στο τόξο που περιέχεται ανάμεσα στις πλευρές της.</p>
$$\hat\omega = \hat\varphi = \frac{\overset{\frown}{AB}}{2}$$</div>

<div class="tbox tip"><h4>Θυμήσου</h4>
<ul><li>Η εφαπτομένη είναι <b>κάθετη</b> στην ακτίνα στο σημείο επαφής.</li>
<li>Η γωνία χορδής–εφαπτομένης είναι το <b>μισό</b> της επίκεντρης που βαίνει στο ίδιο τόξο.</li>
<li>Τα εφαπτόμενα τμήματα από εξωτερικό σημείο είναι <b>ίσα</b>.</li></ul></div>`,
  widget: "tanchord",
  gen: "gcirc",
  exercises: [
    { level: 1, type: "fields", q: R`Στο σχήμα, η $\varepsilon$ εφάπτεται του κύκλου στο $A$ και $\widehat{A\Gamma B} = 55^\circ$. Να βρείτε τη γωνία $x$ της χορδής $AB$ με την εφαπτομένη.` + FIG.circ({ pts: { A: 270, B: 20, "Γ": 150 }, ext: { T: [1.25, -1] }, tan: [[270, 1.3, "ε"]], segs: [["A", "B"], ["Γ", "A"], ["Γ", "B"]], center: false, ang: [["T", "A", "B", "x"], ["A", "Γ", "B", "55°"]], lab: { T: [0, 14] } }),
      fields: [{ label: "x =", ans: 55 }],
      hint: R`Η $x$ «περιέχει» το τόξο $AB$ στο οποίο βαίνει και η $\widehat{A\Gamma B}$.`,
      sol: R`Από το θεώρημα χορδής–εφαπτομένης, $x = \widehat{A\Gamma B} = 55^\circ$.` },
    { level: 2, type: "fields", q: R`Στο σχήμα, η $\varepsilon$ εφάπτεται του κύκλου $(K, R)$ στο $A$ και $\widehat{AK\Gamma} = 140^\circ$. Να βρείτε τις γωνίες $x = \widehat{AB\Gamma}$ και $y = \widehat{\Delta A\Gamma}$.` + FIG.circ({ center: "K", pts: { A: 270, "Γ": 50, B: 160 }, ext: { "Δ": [1.25, -1] }, tan: [[270, 1.3, "ε"]], segs: [["K", "A"], ["K", "Γ"], ["A", "Γ"], ["B", "A"], ["B", "Γ"]], ang: [["A", "K", "Γ", "140°"], ["A", "B", "Γ", "x"], ["Δ", "A", "Γ", "y"]], lab: { "Δ": [0, 14] }, extShow: ["Δ"] }),
      fields: [{ label: "x =", ans: 70 }, { label: "y =", ans: 70 }],
      hint: R`Η $x$ είναι εγγεγραμμένη στο τόξο $A\Gamma$, η $y$ είναι γωνία χορδής $A\Gamma$ – εφαπτομένης.`,
      sol: R`$x = \frac{140^\circ}{2} = 70^\circ$. Από το θεώρημα χορδής–εφαπτομένης $y = x = 70^\circ$.` },
    { level: 2, type: "fields", q: R`Στο σχήμα, η $\varepsilon$ εφάπτεται στο $A$ του περιγεγραμμένου κύκλου του τριγώνου $AB\Gamma$, με $\hat B = 50^\circ$ και $\hat\Gamma = 60^\circ$. Να βρείτε τις γωνίες $x$ και $y$ που σχηματίζει η $\varepsilon$ με τις $AB$ και $A\Gamma$.` + FIG.circ({ pts: { A: 90, B: 210, "Γ": 350 }, ext: { L: [-1.3, 1], P: [1.3, 1] }, tan: [[90, 1.4, ""]], segs: [["A", "B"], ["B", "Γ"], ["Γ", "A"]], center: false, ang: [["L", "A", "B", "x"], ["Γ", "A", "P", "y"], ["Γ", "B", "A", "50°"], ["A", "Γ", "B", "60°"]], lab: { L: [0, -12], P: [0, -12] } }),
      fields: [{ label: "x =", ans: 60 }, { label: "y =", ans: 50 }],
      hint: R`Η $x$ (με τη χορδή $AB$) ισούται με την εγγεγραμμένη στο τόξο $AB$, δηλαδή την $\hat\Gamma$.`,
      sol: R`$x = \hat\Gamma = 60^\circ$ και $y = \hat B = 50^\circ$. Έλεγχος: $x + \hat A + y = 60 + 70 + 50 = 180^\circ$ (ευθεία γωνία) ✓.` },
    { level: 2, type: "fields", q: R`Η γωνία που σχηματίζει η χορδή $AB$ με την εφαπτομένη στο $A$ είναι $65^\circ$. Πόση είναι η επίκεντρη γωνία $\widehat{AOB}$ που βαίνει στο ίδιο τόξο;`,
      fields: [{ label: "ΑΟΒ =", ans: 130 }],
      hint: R`Γωνία χορδής–εφαπτομένης = μισό του τόξου.`,
      sol: R`Τόξο $= 2\cdot 65^\circ = 130^\circ$, άρα $\widehat{AOB} = 130^\circ$.` },
    { level: 3, type: "fields", q: R`Από εξωτερικό σημείο $P$ φέρουμε τα εφαπτόμενα τμήματα $PA$, $PB$ σε κύκλο κέντρου $O$, με $\widehat{APB} = 50^\circ$. Να βρείτε τη γωνία $\widehat{PAB}$ και την επίκεντρη $\widehat{AOB}$ (την κυρτή).`,
      fields: [{ label: "ΡΑΒ =", ans: 65 }, { label: "ΑΟΒ =", ans: 130 }],
      hint: R`$PA = PB$, άρα το $PAB$ είναι ισοσκελές. Η $\widehat{PAB}$ είναι γωνία χορδής–εφαπτομένης.`,
      sol: R`$\widehat{PAB} = \frac{180^\circ - 50^\circ}{2} = 65^\circ$. Ως γωνία χορδής–εφαπτομένης ισούται με το μισό του τόξου $AB$: τόξο $130^\circ$, άρα $\widehat{AOB} = 130^\circ$. (Επίσης στο τετράπλευρο $PAOB$: $360 - 90 - 90 - 50 = 130$ ✓.)` },
    { level: 1, type: "mc", q: R`Η εφαπτομένη ενός κύκλου στο σημείο $A$ σχηματίζει με τη διάμετρο $AB$ γωνία:`,
      options: ["$45^\\circ$", "$60^\\circ$", "$90^\\circ$", "εξαρτάται από τον κύκλο"], correct: 2,
      hint: R`Η εφαπτομένη είναι κάθετη στην ακτίνα $OA$.`,
      sol: R`Η εφαπτομένη είναι κάθετη στην ακτίνα στο σημείο επαφής, άρα και στη διάμετρο: $90^\circ$. (Συμφωνεί με το θεώρημα: τόξο $180^\circ$, μισό $90^\circ$.)` }
  ]
},
/* ───────────────────────────── 4.1 ───────────────────────────── */
{
  id: "4.1", unit: 4, title: "Η έννοια του διανύσματος",
  book: "Α΄ Τεύχος §4.1 · Δραστηριότητες σελ. 152",
  theory: R`
<div class="tbox"><h4>Μονόμετρα και διανυσματικά μεγέθη</h4>
<p><b>Μονόμετρο</b> μέγεθος: ορίζεται μόνο από έναν αριθμό (μάζα, θερμοκρασία, χρόνος, απόσταση).</p>
<p><b>Διανυσματικό</b>: χρειάζεται και <b>κατεύθυνση</b> (μετατόπιση, ταχύτητα με κατεύθυνση, δύναμη).</p></div>

<div class="tbox"><h4>Διάνυσμα $\vec{AB}$</h4>
<p>Προσανατολισμένο ευθύγραμμο τμήμα με <b>αρχή</b> $A$ και <b>πέρας</b> $B$. Χαρακτηρίζεται από:</p>
<ul><li><b>Μέτρο</b> $|\vec{AB}|$: το μήκος του τμήματος $AB$.</li>
<li><b>Διεύθυνση</b>: η ευθεία $AB$ (ή κάθε παράλληλή της).</li>
<li><b>Φορά</b>: από το $A$ προς το $B$.</li></ul>
<p>Το <b>μηδενικό</b> διάνυσμα $\vec0$ έχει αρχή και πέρας το ίδιο σημείο.</p></div>

<div class="tbox tip"><h4>Σχέσεις διανυσμάτων</h4>
<ul><li><b>Παράλληλα</b>: ίδια διεύθυνση. Αν έχουν και ίδια φορά λέγονται <b>ομόρροπα</b>, αλλιώς <b>αντίρροπα</b>.</li>
<li><b>Ίσα</b> ($\vec\alpha = \vec\beta$): ομόρροπα με ίσα μέτρα.</li>
<li><b>Αντίθετα</b> ($\vec\beta = -\vec\alpha$): αντίρροπα με ίσα μέτρα. Π.χ. $\vec{BA} = -\vec{AB}$.</li></ul>
<p>Σε παραλληλόγραμμο $AB\Gamma\Delta$: $\vec{AB} = \vec{\Delta\Gamma}$ και $\vec{A\Delta} = \vec{B\Gamma}$.</p></div>`,
  widget: "vec1",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια πρόταση περιγράφει <b>διανυσματικό</b> μέγεθος;`,
      options: ["Ένα καρπούζι ζυγίζει 8 kg.", "Ο πυρετός μου έφτασε τους 39 °C.", "Το σπίτι του Ανδρέα βρίσκεται 1,5 km δυτικά από το δικό μου.", "Το σπίτι του Ανδρέα βρίσκεται 1,5 km μακριά από το δικό μου."], correct: 2,
      hint: R`Ποια πρόταση δίνει και <b>κατεύθυνση</b>;`,
      sol: R`«1,5 km <b>δυτικά</b>» δίνει μέτρο και κατεύθυνση ⇒ διανυσματικό (μετατόπιση). Το «1,5 km μακριά» είναι μόνο απόσταση ⇒ μονόμετρο.` },
    { level: 1, type: "mc", q: R`Δίνεται παραλληλόγραμμο $EZH\Theta$. Ποιο διάνυσμα είναι <b>ίσο</b> με το $\vec{EZ}$;` + FIG.poly({ pts: { E: [0, 0], Z: [4, 0], H: [5.2, 2.2], "Θ": [1.2, 2.2] }, segs: [["E", "Z"], ["Z", "H"], ["H", "Θ"], ["Θ", "E"]] }),
      options: ["$\\vec{H\\Theta}$", "$\\vec{\\Theta H}$", "$\\vec{ZE}$", "$\\vec{ZH}$"], correct: 1,
      hint: R`Ίσα: ίδια διεύθυνση, ίδια φορά, ίδιο μέτρο.`,
      sol: R`Οι $EZ$ και $\Theta H$ είναι απέναντι πλευρές (ίσες και παράλληλες) και η φορά $E \to Z$ είναι ίδια με $\Theta \to H$. Άρα $\vec{EZ} = \vec{\Theta H}$. Το $\vec{H\Theta}$ είναι <b>αντίθετο</b>.` },
    { level: 1, type: "mc", q: R`Ποια πρόταση είναι <b>σωστή</b>;`,
      options: ["Δύο διανύσματα με ίσα μέτρα είναι πάντα ίσα.", "Τα $\\vec{AB}$ και $\\vec{BA}$ είναι αντίθετα.", "Δύο παράλληλα διανύσματα είναι πάντα ομόρροπα.", "Το $\\vec{AB}$ έχει αρχή το $B$."], correct: 1,
      hint: R`Σκέψου μέτρο, διεύθυνση και φορά.`,
      sol: R`Τα $\vec{AB}$, $\vec{BA}$ έχουν το ίδιο μέτρο και διεύθυνση, αλλά αντίθετη φορά: αντίθετα. Τα άλλα είναι λάθος: ίσα μέτρα δεν αρκούν (χρειάζεται και ίδια κατεύθυνση), τα παράλληλα μπορεί να είναι αντίρροπα, και η αρχή του $\vec{AB}$ είναι το $A$.` },
    { level: 1, type: "fields", q: R`Σε τετραγωνισμένο χαρτί (πλευρά τετραγώνου 1 μονάδα), το διάνυσμα $\vec\alpha$ ξεκινά από ένα σημείο και καταλήγει $3$ τετράγωνα δεξιά και $4$ πάνω. Το $\vec\beta$ πηγαίνει $6$ αριστερά και $8$ κάτω. Να βρείτε τα μέτρα τους.`,
      fields: [{ label: "|α| =", ans: 5 }, { label: "|β| =", ans: 10 }],
      hint: R`Πυθαγόρειο θεώρημα: $\sqrt{3^2 + 4^2}$.`,
      sol: R`$|\vec\alpha| = \sqrt{9 + 16} = 5$, $|\vec\beta| = \sqrt{36 + 64} = 10$. Τα $\vec\alpha$, $\vec\beta$ είναι αντίρροπα και $\vec\beta = -2\vec\alpha$.` },
    { level: 2, type: "mc", q: R`Σε κανονικό εξάγωνο $AB\Gamma\Delta EZ$ με κέντρο $O$, ποιο διάνυσμα είναι ίσο με το $\vec{OA}$;` + FIG.poly({ pts: { A: [2, 0], B: [1, 1.732], "Γ": [-1, 1.732], "Δ": [-2, 0], E: [-1, -1.732], Z: [1, -1.732], O: [0, 0] }, segs: [["A", "B"], ["B", "Γ"], ["Γ", "Δ"], ["Δ", "E"], ["E", "Z"], ["Z", "A"], ["O", "A", 1], ["O", "Γ", 1], ["O", "E", 1]], lab: { O: [-10, 12] } }),
      options: ["$\\vec{O\\Delta}$", "$\\vec{\\Gamma B}$", "$\\vec{AO}$", "$\\vec{ZE}$"], correct: 1,
      hint: R`Το κανονικό εξάγωνο χωρίζεται σε 6 ισόπλευρα τρίγωνα. Ποια πλευρά είναι παράλληλη με την $OA$ και ίδιας φοράς;`,
      sol: R`Το $OAB\Gamma$ είναι ρόμβος (όλες οι πλευρές ίσες με την ακτίνα), άρα $\vec{\Gamma B} = \vec{OA}$: ίδιο μέτρο, ίδια διεύθυνση, ίδια φορά. Το $\vec{O\Delta}$ και το $\vec{AO}$ είναι <b>αντίθετα</b> του $\vec{OA}$, όπως και το $\vec{ZE}$ (το $\vec{EZ}$ θα ήταν ίσο).` }
  ]
},
/* ───────────────────────────── 4.2 ───────────────────────────── */
{
  id: "4.2", unit: 4, title: "Πράξεις με διανύσματα",
  book: "Α΄ Τεύχος §4.2 · Δραστηριότητες σελ. 160, 162",
  theory: R`
<div class="tbox"><h4>Πρόσθεση</h4>
<p><b>Διαδοχικά</b> διανύσματα (το πέρας του ενός είναι αρχή του άλλου): $\;\vec{AB} + \vec{B\Gamma} = \vec{A\Gamma}$. Γενικά: $\vec{AB} + \vec{B\Gamma} + \vec{\Gamma\Delta} = \vec{A\Delta}$.</p>
<p><b>Κανόνας παραλληλογράμμου</b>: αν $\vec{AB} = \vec\alpha$ και $\vec{A\Gamma} = \vec\beta$ έχουν κοινή αρχή, τότε $\vec\alpha + \vec\beta$ είναι η διαγώνιος $\vec{A\Delta}$ του παραλληλογράμμου $AB\Delta\Gamma$.</p></div>

<div class="tbox"><h4>Αφαίρεση</h4>
<p>$\vec\alpha - \vec\beta = \vec\alpha + (-\vec\beta)$. Με κοινή αρχή $O$: $\;\vec{OA} - \vec{OB} = \vec{BA}$ (από το πέρας του δεύτερου στο πέρας του πρώτου).</p></div>

<div class="tbox"><h4>Πολλαπλασιασμός με αριθμό</h4>
<p>Για $\lambda \ne 0$ και $\vec\alpha \ne \vec0$, το $\lambda\vec\alpha$ έχει μέτρο $|\lambda|\cdot|\vec\alpha|$ και είναι <b>ομόρροπο</b> του $\vec\alpha$ αν $\lambda > 0$, <b>αντίρροπο</b> αν $\lambda < 0$. Αν $\lambda = 0$ ή $\vec\alpha = \vec0$, τότε $\lambda\vec\alpha = \vec0$.</p>
<p>Πάντα $\lambda\vec\alpha \parallel \vec\alpha$.</p></div>

<div class="tbox tip"><h4>Ιδιότητες</h4>
<p>$\vec\alpha + \vec\beta = \vec\beta + \vec\alpha$ · $(\vec\alpha + \vec\beta) + \vec\gamma = \vec\alpha + (\vec\beta + \vec\gamma)$ · $\vec\alpha + \vec0 = \vec\alpha$ · $\vec\alpha + (-\vec\alpha) = \vec0$</p>
<p>$(\lambda + \mu)\vec\alpha = \lambda\vec\alpha + \mu\vec\alpha$ · $\lambda(\vec\alpha + \vec\beta) = \lambda\vec\alpha + \lambda\vec\beta$ · $\lambda(\mu\vec\alpha) = (\lambda\mu)\vec\alpha$</p></div>`,
  widget: "vecops",
  exercises: [
    { level: 1, type: "mc", q: R`Δίνεται πολύγωνο $AB\Gamma\Delta E$. Ποια ισότητα είναι <b>σωστή</b>;`,
      options: ["$\\vec{AB} + \\vec{B\\Gamma} = \\vec{\\Gamma A}$", "$\\vec{AE} + \\vec{A\\Delta} = \\vec{E\\Delta}$", "$\\vec{AE} + \\vec{E\\Delta} + \\vec{\\Delta\\Gamma} + \\vec{\\Gamma B} = \\vec{AB}$", "$\\vec{AB} + \\vec{B\\Delta} = \\vec{\\Delta A}$"], correct: 2,
      hint: R`Διαδοχικά διανύσματα: από την αρχή του πρώτου στο πέρας του τελευταίου.`,
      sol: R`$A \to E \to \Delta \to \Gamma \to B$: από το $A$ στο $B$, δηλαδή $\vec{AB}$ ✓. Στην πρώτη το σωστό είναι $\vec{A\Gamma}$, στην τελευταία $\vec{A\Delta}$· στη δεύτερη τα διανύσματα δεν είναι διαδοχικά.` },
    { level: 1, type: "mc", q: R`Η παράσταση $\vec{AB} + \vec{\Gamma\Delta} + \vec{B\Gamma} + \vec{\Delta E}$ ισούται με:`,
      options: ["$\\vec{EA}$", "$\\vec{AE}$", "$\\vec0$", "$\\vec{A\\Delta}$"], correct: 1,
      hint: R`Άλλαξε τη σειρά ώστε να γίνουν διαδοχικά: $\vec{AB} + \vec{B\Gamma} + \vec{\Gamma\Delta} + \vec{\Delta E}$.`,
      sol: R`Με αντιμεταθετική: $\vec{AB} + \vec{B\Gamma} + \vec{\Gamma\Delta} + \vec{\Delta E} = \vec{AE}$.` },
    { level: 2, type: "mc", q: R`Στο ορθογώνιο $AB\Gamma\Delta$ με κέντρο $O$, η διαφορά $\vec{AO} - \vec{\Delta O}$ ισούται με:` + FIG.poly({ pts: { A: [0, 0], B: [5, 0], "Γ": [5, 3], "Δ": [0, 3], O: [2.5, 1.5] }, segs: [["A", "B"], ["B", "Γ"], ["Γ", "Δ"], ["Δ", "A"], ["A", "Γ", 1], ["B", "Δ", 1]], lab: { O: [0, -14] } }),
      options: ["$\\vec{A\\Delta}$", "$\\vec{\\Delta A}$", "$\\vec{AB}$", "$\\vec0$"], correct: 0,
      hint: R`$-\vec{\Delta O} = \vec{O\Delta}$.`,
      sol: R`$\vec{AO} - \vec{\Delta O} = \vec{AO} + \vec{O\Delta} = \vec{A\Delta}$.` },
    { level: 1, type: "fields", q: R`Αν $|\vec\alpha| = 4$, να βρείτε το μέτρο του $-3\vec\alpha$ και του $\frac12\vec\alpha$.`,
      fields: [{ label: "|−3α| =", ans: 12 }, { label: "|½α| =", ans: 2 }],
      hint: R`$|\lambda\vec\alpha| = |\lambda|\cdot|\vec\alpha|$.`,
      sol: R`$|-3|\cdot 4 = 12$ (αντίρροπο του $\vec\alpha$) και $\frac12\cdot 4 = 2$ (ομόρροπο).` },
    { level: 2, type: "fields", q: R`Τα διανύσματα $\vec\alpha$, $\vec\beta$ είναι <b>κάθετα</b>, με $|\vec\alpha| = 3$ και $|\vec\beta| = 4$. Να βρείτε το $|\vec\alpha + \vec\beta|$. Πόσο θα ήταν, αν ήταν <b>ομόρροπα</b>; Και αν ήταν <b>αντίρροπα</b>;`,
      fields: [{ label: "κάθετα: |α + β| =", ans: 5 }, { label: "ομόρροπα: |α + β| =", ans: 7 }, { label: "αντίρροπα: |α + β| =", ans: 1 }],
      hint: R`Κάθετα: το παραλληλόγραμμο είναι ορθογώνιο ⇒ Πυθαγόρειο.`,
      sol: R`Κάθετα: $\sqrt{9 + 16} = 5$. Ομόρροπα: τα μέτρα προστίθενται, $7$. Αντίρροπα: αφαιρούνται, $4 - 3 = 1$.` },
    { level: 2, type: "fields", q: R`Να απλοποιήσετε την παράσταση $2(\vec\alpha + \vec\beta) - (\vec\alpha - 3\vec\beta)$ στη μορφή $\kappa\vec\alpha + \lambda\vec\beta$.`,
      fields: [{ label: "κ =", ans: 1 }, { label: "λ =", ans: 5 }],
      hint: R`Επιμεριστική, όπως στην άλγεβρα.`,
      sol: R`$2\vec\alpha + 2\vec\beta - \vec\alpha + 3\vec\beta = \vec\alpha + 5\vec\beta$.` },
    { level: 3, type: "mc", q: R`Στο τρίγωνο $AB\Gamma$, $M$ είναι το μέσο της $B\Gamma$. Τότε $\vec{AB} + \vec{A\Gamma}$ ισούται με:` + FIG.poly({ pts: { A: [1.5, 3.5], B: [0, 0], "Γ": [5, 0], M: [2.5, 0] }, segs: [["A", "B"], ["B", "Γ"], ["Γ", "A"], ["A", "M", 1]] }),
      options: ["$\\vec{AM}$", "$2\\vec{AM}$", "$\\vec{B\\Gamma}$", "$\\frac12\\vec{AM}$"], correct: 1,
      hint: R`Συμπλήρωσε το παραλληλόγραμμο $AB\Delta\Gamma$: οι διαγώνιοί του διχοτομούνται.`,
      sol: R`Με τον κανόνα του παραλληλογράμμου, $\vec{AB} + \vec{A\Gamma} = \vec{A\Delta}$, όπου $\Delta$ η τέταρτη κορυφή. Οι διαγώνιοι $A\Delta$ και $B\Gamma$ διχοτομούνται στο $M$, άρα $\vec{A\Delta} = 2\vec{AM}$.` }
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

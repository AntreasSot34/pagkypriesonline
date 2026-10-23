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
  storeKey: "pagk-akk-tefxos-b-v1",
  heroTitle: "Μαθηματικά Κοινού Κορμού Α΄ Λυκείου — Β΄ Τεύχος",
  tefxos: "Β΄ τεύχους",
  howto: `<ul><li>Κλάσματα: <code>5/2</code> · δεκαδικά: <code>2,5</code> ή <code>2.5</code> · αρνητικοί: <code>-3</code> · ρίζες: <code>√3</code></li>
    <li>Τύποι συναρτήσεων: <code>(x+1)^2+2</code> ή <code>-2(x-3)^2</code> — η σελίδα ελέγχει αν ο τύπος σου είναι ισοδύναμος με τον σωστό</li>
    <li>Στη Στατιστική, όπου ζητείται προσέγγιση, δίνε 2 δεκαδικά (π.χ. <code>3,72</code>)</li></ul>`
};

const UNITS = [
  { id: 5, title: "Ενότητα 5 · Συνάρτηση f(x) = αx² + βx + γ — Εξισώσεις, Ανισώσεις" },
  { id: 6, title: "Ενότητα 6 · Θεώρημα Θαλή – Ομοιότητα" },
  { id: 7, title: "Ενότητα 7 · Στατιστική (διδάσκεται στο Α΄ τετράμηνο)" }
];

const SECTIONS = [
/* ───────────────────────────── 5.1 ───────────────────────────── */
{
  id: "5.1", unit: 5, title: "Η παραβολή y = α(x + κ)² + λ",
  book: "Β΄ Τεύχος §5.1.1–5.1.3 · Δραστηριότητες σελ. 14, 20, 28",
  theory: R`
<div class="tbox"><h4>$y = \alpha x^2$, $\alpha \ne 0$</h4>
<p>Πεδίο ορισμού $\mathbb{R}$, κορυφή $O(0, 0)$, άξονας συμμετρίας ο $y'y$ ($x = 0$).</p>
<ul><li>$\alpha > 0$: «ανοίγει» προς τα πάνω, <b>ελάχιστη</b> τιμή $0$, σύνολο τιμών $[0, +\infty)$.</li>
<li>$\alpha < 0$: «ανοίγει» προς τα κάτω, <b>μέγιστη</b> τιμή $0$, σύνολο τιμών $(-\infty, 0]$.</li>
<li>Όσο μεγαλώνει το $|\alpha|$, τόσο η παραβολή «κλείνει» (πλησιάζει τον $y'y$).</li></ul></div>

<div class="tbox"><h4>Μετατοπίσεις</h4>
<p>$y = \alpha x^2 + \lambda$: κατακόρυφη μετατόπιση κατά $|\lambda|$ — πάνω αν $\lambda > 0$, κάτω αν $\lambda < 0$. Κορυφή $(0, \lambda)$.</p>
<p>$y = \alpha(x + \kappa)^2$: οριζόντια μετατόπιση κατά $|\kappa|$ — <b>αριστερά</b> αν $\kappa > 0$, <b>δεξιά</b> αν $\kappa < 0$. Κορυφή $(-\kappa, 0)$.</p>
$$y = \alpha(x + \kappa)^2 + \lambda: \quad \text{κορυφή } K(-\kappa, \lambda), \quad \text{άξονας } x = -\kappa$$
<p>Για $\alpha > 0$ ελάχιστη τιμή $\lambda$· για $\alpha < 0$ μέγιστη τιμή $\lambda$.</p></div>

<div class="tbox warn"><h4>Προσοχή στο πρόσημο</h4>
<p>Η $y = (x - 3)^2$ μετατοπίζεται <b>δεξιά</b> κατά 3 (κορυφή $(3, 0)$), όχι αριστερά!</p></div>`,
  widget: "parab",
  gen: "gvert",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια από τις παραβολές παρουσιάζει <b>ελάχιστη</b> τιμή;`,
      options: ["$f(x) = -\\frac52x^2$", "$f(x) = -x^2$", "$f(x) = \\frac13x^2$", "$f(x) = -3(x-1)^2 + 4$"], correct: 2,
      hint: R`Ελάχιστη τιμή έχει όταν $\alpha > 0$.`,
      sol: R`Μόνο η $f(x) = \frac13x^2$ έχει $\alpha = \frac13 > 0$: ελάχιστη τιμή $0$ στο $x = 0$. Οι υπόλοιπες έχουν μέγιστη.` },
    { level: 1, type: "fields", q: R`Για ποια τιμή του $\lambda$ η παραβολή $y = (\lambda - 3)x^2$ διέρχεται από το σημείο $(-1, 2)$; Για ποια $\lambda$ παρουσιάζει ελάχιστη τιμή;`,
      fields: [{ label: "λ =", ans: 5 }, { label: "ελάχιστη για λ >", ans: 3 }],
      hint: R`Αντικατάστησε $x = -1$, $y = 2$. Ελάχιστη όταν ο συντελεστής του $x^2$ είναι θετικός.`,
      sol: R`$2 = (\lambda - 3)(-1)^2 \Rightarrow \lambda = 5$. Ελάχιστη όταν $\lambda - 3 > 0$, δηλαδή $\lambda > 3$.` },
    { level: 1, type: "fields", q: R`Για ποια τιμή του $\kappa$ η παραβολή $y = (\kappa + 2)x^2$, $\kappa \ne -2$, διέρχεται από το σημείο $(2, -4)$;`,
      fields: [{ label: "κ =", ans: -3 }],
      hint: R`$-4 = (\kappa + 2)\cdot 4$.`,
      sol: R`$-4 = 4(\kappa + 2) \Rightarrow \kappa + 2 = -1 \Rightarrow \kappa = -3$.` },
    { level: 1, type: "expr", q: R`Να γράψετε την εξίσωση της παραβολής που προκύπτει αν μετατοπίσουμε την $y = x^2$ κατά $1$ μονάδα <b>αριστερά</b> και $2$ μονάδες <b>πάνω</b>.`,
      ref: "(x+1)^2+2", key: "(x+1)^2+2",
      hint: R`Αριστερά κατά 1 ⇒ $x \to x + 1$. Πάνω κατά 2 ⇒ $+2$.`,
      sol: R`$y = (x + 1)^2 + 2$, με κορυφή $(-1, 2)$.` },
    { level: 2, type: "expr", q: R`Να γράψετε την εξίσωση της παραβολής που προκύπτει αν μετατοπίσουμε την $y = -2x^2$ κατά $2$ μονάδες <b>δεξιά</b>.`,
      ref: "-2(x-2)^2", key: "-2(x-2)^2",
      hint: R`Δεξιά κατά 2 ⇒ $x \to x - 2$.`,
      sol: R`$y = -2(x - 2)^2$, κορυφή $(2, 0)$, μέγιστη τιμή $0$.` },
    { level: 2, type: "fields", q: R`Δίνεται η $f(x) = 2(x + 4)^2 - 3$. Να βρείτε την κορυφή και το ακρότατο.`,
      fields: [{ label: "x κορυφής =", ans: -4 }, { label: "y κορυφής =", ans: -3 }],
      hint: R`Κορυφή $(-\kappa, \lambda)$ με $\kappa = 4$, $\lambda = -3$.`,
      sol: R`Κορυφή $K(-4, -3)$, άξονας $x = -4$. Αφού $\alpha = 2 > 0$: ελάχιστη τιμή $-3$, σύνολο τιμών $[-3, +\infty)$.` },
    { level: 2, type: "mc", q: R`Η $g(x) = -3(x - 2)^2 + 1$ έχει:`,
      options: ["ελάχιστη τιμή $1$ στο $x = 2$", "μέγιστη τιμή $1$ στο $x = 2$", "μέγιστη τιμή $1$ στο $x = -2$", "ελάχιστη τιμή $-3$"], correct: 1,
      hint: R`$\alpha = -3 < 0$ και κορυφή $(2, 1)$.`,
      sol: R`Κορυφή $(2, 1)$ και $\alpha < 0$ ⇒ <b>μέγιστη</b> τιμή $1$ στο $x = 2$, σύνολο τιμών $(-\infty, 1]$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τον άξονα συμμετρίας και την κορυφή της $h(x) = x^2 - 2x + 1$.`,
      fields: [{ label: "άξονας x =", ans: 1 }, { label: "κορυφή: y =", ans: 0 }],
      hint: R`Αναγνώρισε ταυτότητα: $x^2 - 2x + 1 = (x - 1)^2$.`,
      sol: R`$h(x) = (x - 1)^2$: άξονας $x = 1$, κορυφή $(1, 0)$.` }
  ]
},
/* ───────────────────────────── 5.2.1 ───────────────────────────── */
{
  id: "5.2.1", unit: 5, title: "Μελέτη της f(x) = αx² + βx + γ",
  book: "Β΄ Τεύχος §5.2.1 · Δραστηριότητες σελ. 34",
  theory: R`
<div class="tbox"><h4>Από τη γενική μορφή στη μορφή κορυφής</h4>
<p>Με συμπλήρωση τετραγώνου, κάθε $f(x) = \alpha x^2 + \beta x + \gamma$ γράφεται $\alpha(x + \kappa)^2 + \lambda$:</p>
$$f(x) = \alpha\left(x + \frac{\beta}{2\alpha}\right)^2 - \frac{\Delta}{4\alpha}, \qquad \Delta = \beta^2 - 4\alpha\gamma$$
<p>π.χ. $x^2 - 2x + 6 = (x - 1)^2 + 5$.</p></div>

<div class="tbox"><h4>Στοιχεία της παραβολής</h4>
<ul><li><b>Κορυφή</b> $K\left(-\dfrac{\beta}{2\alpha},\ -\dfrac{\Delta}{4\alpha}\right)$ — στην πράξη βρίσκουμε το $x_K = -\frac{\beta}{2\alpha}$ και υπολογίζουμε $f(x_K)$.</li>
<li><b>Άξονας συμμετρίας</b>: $x = -\dfrac{\beta}{2\alpha}$.</li>
<li><b>Τομή με τον $y'y$</b>: το σημείο $(0, \gamma)$.</li>
<li>$\alpha > 0$: ελάχιστη τιμή $f(x_K)$ · $\alpha < 0$: μέγιστη τιμή $f(x_K)$.</li></ul></div>`,
  widget: "trin",
  gen: "gvert",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε τον άξονα συμμετρίας και την ελάχιστη τιμή της $f(x) = x^2 - 2x + 6$.`,
      fields: [{ label: "άξονας x =", ans: 1 }, { label: "ελάχιστη τιμή =", ans: 5 }],
      hint: R`$x_K = -\frac{\beta}{2\alpha} = -\frac{-2}{2}$.`,
      sol: R`$x_K = 1$, $f(1) = 1 - 2 + 6 = 5$. Αφού $\alpha = 1 > 0$: ελάχιστη τιμή $5$.` },
    { level: 1, type: "fields", q: R`Να βρείτε τον άξονα συμμετρίας και τη μέγιστη τιμή της $g(x) = 4x - x^2$.`,
      fields: [{ label: "άξονας x =", ans: 2 }, { label: "μέγιστη τιμή =", ans: 4 }],
      hint: R`$\alpha = -1$, $\beta = 4$.`,
      sol: R`$x_K = -\frac{4}{-2} = 2$, $g(2) = 8 - 4 = 4$. Αφού $\alpha < 0$: μέγιστη τιμή $4$.` },
    { level: 2, type: "fields", q: R`Δίνεται η $f(x) = x^2 + \lambda x + \lambda + 4$. Για ποια τιμή του $\lambda$ η γραφική παράσταση: (α) έχει άξονα συμμετρίας την $x = 2$, (β) τέμνει τον $y'y$ στο $(0, 2)$;`,
      fields: [{ label: "(α) λ =", ans: -4 }, { label: "(β) λ =", ans: -2 }],
      hint: R`(α) $-\frac{\lambda}{2} = 2$. (β) $f(0) = \lambda + 4 = 2$.`,
      sol: R`(α) $-\frac{\lambda}{2} = 2 \Rightarrow \lambda = -4$. (β) $\lambda + 4 = 2 \Rightarrow \lambda = -2$.` },
    { level: 3, type: "fields", q: R`Για ποιες τιμές των $\alpha, \beta$ η $g(x) = x^2 + (\beta - 3)x + 2\alpha - 1$ έχει άξονα συμμετρίας την $x = -1$ και ελάχιστη τιμή $8$;`,
      fields: [{ label: "β =", ans: 5 }, { label: "α =", ans: 5 }],
      hint: R`Πρώτα από τον άξονα: $-\frac{\beta - 3}{2} = -1$. Μετά $g(-1) = 8$.`,
      sol: R`$\beta - 3 = 2 \Rightarrow \beta = 5$, άρα $g(x) = x^2 + 2x + 2\alpha - 1$. $g(-1) = 1 - 2 + 2\alpha - 1 = 2\alpha - 2 = 8 \Rightarrow \alpha = 5$.` },
    { level: 2, type: "fields", q: R`Να γράψετε την $f(x) = 2x^2 + 8x + 5$ στη μορφή $\alpha(x + \kappa)^2 + \lambda$.`,
      fields: [{ label: "α =", ans: 2 }, { label: "κ =", ans: 2 }, { label: "λ =", ans: -3 }],
      hint: R`$x_K = -2$, $f(-2) = 8 - 16 + 5$.`,
      sol: R`$x_K = -\frac{8}{4} = -2$, $f(-2) = -3$. Άρα $f(x) = 2(x + 2)^2 - 3$.` },
    { level: 2, type: "fields", q: R`Μια μπάλα ρίχνεται προς τα πάνω και το ύψος της (σε m) μετά από $t$ s είναι $h(t) = -5t^2 + 20t + 1$. Ποιο είναι το μέγιστο ύψος και πότε το φτάνει;`,
      fields: [{ label: "t (s) =", ans: 2 }, { label: "μέγιστο ύψος (m) =", ans: 21 }],
      hint: R`Η κορυφή της παραβολής: $t_K = -\frac{20}{2\cdot(-5)}$.`,
      sol: R`$t_K = 2$ s, $h(2) = -20 + 40 + 1 = 21$ m.` },
    { level: 3, type: "fields", q: R`Το άθροισμα δύο αριθμών είναι $16$. Ποιο είναι το μεγαλύτερο δυνατό γινόμενό τους;`,
      fields: [{ label: "μέγιστο γινόμενο =", ans: 64 }],
      hint: R`Αν ο ένας είναι $x$, ο άλλος $16 - x$. Μελέτησε την $P(x) = x(16 - x)$.`,
      sol: R`$P(x) = -x^2 + 16x$, $x_K = 8$, $P(8) = 64$. (Οι αριθμοί είναι $8$ και $8$.)` }
  ]
},
/* ───────────────────────────── 5.2.2 ───────────────────────────── */
{
  id: "5.2.2", unit: 5, title: "Η εξίσωση αx² + βx + γ = 0",
  book: "Β΄ Τεύχος §5.2.2 · Δραστηριότητες σελ. 40",
  theory: R`
<div class="tbox"><h4>Διακρίνουσα και λύσεις</h4>
$$\Delta = \beta^2 - 4\alpha\gamma \qquad x_{1,2} = \frac{-\beta \pm \sqrt\Delta}{2\alpha}$$
<table class="mini"><tr><th>$\Delta$</th><th>Λύσεις</th><th>Η παραβολή τον $x'x$</th></tr>
<tr><td>$\Delta > 0$</td><td>δύο άνισες</td><td>τέμνει σε 2 σημεία</td></tr>
<tr><td>$\Delta = 0$</td><td>μία διπλή: $x = -\frac{\beta}{2\alpha}$</td><td>εφάπτεται (στην κορυφή)</td></tr>
<tr><td>$\Delta < 0$</td><td>καμία πραγματική</td><td>δεν τον τέμνει</td></tr></table>
<p>Οι λύσεις της εξίσωσης είναι οι <b>τετμημένες</b> των σημείων τομής της παραβολής με τον άξονα $x'x$.</p></div>

<div class="tbox tip"><h4>Ειδικές περιπτώσεις — χωρίς τύπο</h4>
<p>$\gamma = 0$: κοινός παράγοντας, $x^2 - 5x = 0 \Rightarrow x(x - 5) = 0$. $\;\beta = 0$: $x^2 = 9 \Rightarrow x = \pm 3$.</p></div>`,
  widget: "trin",
  gen: "gquad",
  exercises: [
    { level: 1, type: "fields", q: R`Να λύσετε την εξίσωση $2x^2 - 5x - 3 = 0$.`,
      fields: [{ label: "Δ =", ans: 49 }, { label: "μικρότερη λύση =", ans: "-1/2" }, { label: "μεγαλύτερη λύση =", ans: 3 }],
      hint: R`$\Delta = 25 + 24$.`,
      sol: R`$\Delta = 25 + 24 = 49$, $x = \frac{5 \pm 7}{4}$ ⇒ $x_1 = -\frac12$, $x_2 = 3$.` },
    { level: 1, type: "fields", q: R`Να λύσετε τις εξισώσεις: (α) $x^2 - 5x = 0$, (β) $4x^2 - 9 = 0$ (θετική λύση).`,
      fields: [{ label: "(α) μη μηδενική λύση =", ans: 5 }, { label: "(β) θετική λύση =", ans: "3/2" }],
      hint: R`(α) κοινός παράγοντας. (β) $x^2 = \frac94$.`,
      sol: R`(α) $x(x - 5) = 0 \Rightarrow x = 0$ ή $x = 5$. (β) $x^2 = \frac94 \Rightarrow x = \pm\frac32$.` },
    { level: 1, type: "mc", q: R`Η εξίσωση $x^2 + x + 1 = 0$:`,
      options: ["έχει δύο άνισες λύσεις", "έχει μία διπλή λύση", "δεν έχει πραγματικές λύσεις", "έχει λύση $x = -1$"], correct: 2,
      hint: R`Υπολόγισε τη διακρίνουσα.`,
      sol: R`$\Delta = 1 - 4 = -3 < 0$: <b>καμία</b> πραγματική λύση. Η παραβολή βρίσκεται ολόκληρη πάνω από τον $x'x$.` },
    { level: 2, type: "fields", q: R`Για ποια τιμή του $k$ η εξίσωση $x^2 - 6x + k = 0$ έχει <b>διπλή</b> λύση; Ποια είναι αυτή;`,
      fields: [{ label: "k =", ans: 9 }, { label: "διπλή λύση =", ans: 3 }],
      hint: R`Διπλή λύση ⇔ $\Delta = 0$.`,
      sol: R`$\Delta = 36 - 4k = 0 \Rightarrow k = 9$. Τότε $x^2 - 6x + 9 = (x - 3)^2 = 0 \Rightarrow x = 3$.` },
    { level: 2, type: "fields", q: R`Η παραβολή $f(x) = x^2 + 2x - 3$ τέμνει τον $x'x$ στα σημεία $A, B$ και τον $y'y$ στο $\Gamma$. Να βρείτε τα σημεία αυτά και την ελάχιστη τιμή της $f$.`,
      fields: [{ label: "x_A (μικρότερη) =", ans: -3 }, { label: "x_B =", ans: 1 }, { label: "y_Γ =", ans: -3 }, { label: "ελάχιστη τιμή =", ans: -4 }],
      hint: R`$x^2 + 2x - 3 = (x + 3)(x - 1)$. Η κορυφή είναι στη μέση των ριζών.`,
      sol: R`Ρίζες $-3$ και $1$. $\Gamma(0, -3)$. Κορυφή στο $x = -1$: $f(-1) = 1 - 2 - 3 = -4$, ελάχιστη τιμή $-4$.` },
    { level: 3, type: "fields", q: R`Για ποιες τιμές του $\kappa$ η εξίσωση $x^2 + 2(\kappa + 1)x + 4 = 0$ έχει δύο ίσες λύσεις;`,
      fields: [{ label: "μικρότερη τιμή κ =", ans: -3 }, { label: "μεγαλύτερη τιμή κ =", ans: 1 }],
      hint: R`$\Delta = 4(\kappa + 1)^2 - 16 = 0$.`,
      sol: R`$4(\kappa + 1)^2 = 16 \Rightarrow (\kappa + 1)^2 = 4 \Rightarrow \kappa + 1 = \pm 2 \Rightarrow \kappa = 1$ ή $\kappa = -3$.` },
    { level: 2, type: "fields", q: R`Το γινόμενο δύο διαδοχικών φυσικών αριθμών είναι $72$. Να βρείτε τους αριθμούς.`,
      fields: [{ label: "μικρότερος =", ans: 8 }, { label: "μεγαλύτερος =", ans: 9 }],
      hint: R`$x(x + 1) = 72 \Rightarrow x^2 + x - 72 = 0$.`,
      sol: R`$\Delta = 1 + 288 = 289$, $x = \frac{-1 \pm 17}{2}$ ⇒ $x = 8$ (το $-9$ δεν είναι φυσικός). Οι αριθμοί είναι $8$ και $9$.` }
  ]
},
/* ───────────────────────────── 5.2.3 ───────────────────────────── */
{
  id: "5.2.3", unit: 5, title: "Άθροισμα – γινόμενο λύσεων (Vieta)",
  book: "Β΄ Τεύχος §5.2.3 · Δραστηριότητες σελ. 48",
  theory: R`
<div class="tbox"><h4>Τύποι Vieta</h4>
<p>Αν $x_1, x_2$ είναι οι λύσεις της $\alpha x^2 + \beta x + \gamma = 0$ ($\Delta \ge 0$):</p>
$$S = x_1 + x_2 = -\frac{\beta}{\alpha} \qquad P = x_1 x_2 = \frac{\gamma}{\alpha}$$
<p>Χρήσιμες ταυτότητες: $\;x_1^2 + x_2^2 = S^2 - 2P$, $\;\dfrac{1}{x_1} + \dfrac{1}{x_2} = \dfrac{S}{P}$.</p></div>

<div class="tbox"><h4>Εφαρμογές</h4>
<ul><li><b>Σχηματισμός εξίσωσης</b> με λύσεις $\rho_1, \rho_2$: $\;x^2 - Sx + P = 0$.</li>
<li><b>Παραγοντοποίηση</b>: $\alpha x^2 + \beta x + \gamma = \alpha(x - x_1)(x - x_2)$.</li>
<li>Λύσεις <b>αντίθετες</b> ⇔ $S = 0$ · <b>αντίστροφες</b> ⇔ $P = 1$ (με $\Delta > 0$).</li></ul></div>`,
  widget: "trin",
  gen: "gvieta",
  exercises: [
    { level: 1, type: "fields", q: R`Αν $x_1, x_2$ οι λύσεις της $x^2 - 7x + 3 = 0$, χωρίς να τη λύσετε, να υπολογίσετε: $x_1 + x_2$, $x_1x_2$, $3x_1 + 2x_1x_2 + 3x_2$, $\frac{1}{x_1} + \frac{1}{x_2}$, $x_1^2 + x_2^2$.`,
      fields: [{ label: "x₁ + x₂ =", ans: 7 }, { label: "x₁x₂ =", ans: 3 }, { label: "3x₁ + 2x₁x₂ + 3x₂ =", ans: 27 }, { label: "1/x₁ + 1/x₂ =", ans: "7/3" }, { label: "x₁² + x₂² =", ans: 43 }],
      hint: R`$S = 7$, $P = 3$. Γράψε κάθε παράσταση με τα $S$ και $P$.`,
      sol: R`$S = 7$, $P = 3$. $3S + 2P = 21 + 6 = 27$. $\frac{S}{P} = \frac73$. $S^2 - 2P = 49 - 6 = 43$.` },
    { level: 2, type: "fields", q: R`Δίνεται η εξίσωση $x^2 - (\lambda - 2)x + 2\lambda - 8 = 0$. Να βρείτε το $\lambda$ ώστε η εξίσωση να έχει: (α) λύση τον $-2$, (β) λύσεις αντίστροφες, (γ) λύσεις με άθροισμα $10$.`,
      fields: [{ label: "(α) λ =", ans: 2 }, { label: "(β) λ =", ans: "9/2" }, { label: "(γ) λ =", ans: 12 }],
      hint: R`(α) Αντικατάστησε $x = -2$. (β) $P = 1$. (γ) $S = 10$. Έλεγξε ότι $\Delta > 0$!`,
      sol: R`(α) $4 + 2(\lambda - 2) + 2\lambda - 8 = 4\lambda - 8 = 0 \Rightarrow \lambda = 2$.<br>(β) $2\lambda - 8 = 1 \Rightarrow \lambda = \frac92$ (τότε $x^2 - \frac52x + 1 = 0$, $\Delta = \frac{9}{4} > 0$ ✓).<br>(γ) $\lambda - 2 = 10 \Rightarrow \lambda = 12$ (τότε $x^2 - 10x + 16 = 0$, $\Delta = 36 > 0$ ✓).` },
    { level: 2, type: "fields", q: R`Δίνεται η εξίσωση $4x^2 + 3\mu x + 3\mu - 5 = 0$. Για ποια τιμή του $\mu$: (α) έχει λύσεις αντίστροφες, (β) ισχύει $x_1 + x_2 = x_1x_2$;`,
      fields: [{ label: "(α) μ =", ans: 3 }, { label: "(β) μ =", ans: "5/6" }],
      hint: R`$S = -\frac{3\mu}{4}$, $P = \frac{3\mu - 5}{4}$.`,
      sol: R`(α) $\frac{3\mu - 5}{4} = 1 \Rightarrow \mu = 3$ (τότε $4x^2 + 9x + 4 = 0$, $\Delta = 17 > 0$ ✓).<br>(β) $-3\mu = 3\mu - 5 \Rightarrow \mu = \frac56$.` },
    { level: 1, type: "fields", q: R`Να σχηματίσετε εξίσωση 2ου βαθμού με ακέραιους συντελεστές, της μορφής $x^2 + \beta x + \gamma = 0$, που έχει λύσεις: (α) $2$ και $-3$, (β) $7 + \sqrt3$ και $7 - \sqrt3$.`,
      fields: [{ label: "(α) β =", ans: 1 }, { label: "(α) γ =", ans: -6 }, { label: "(β) β =", ans: -14 }, { label: "(β) γ =", ans: 46 }],
      hint: R`$x^2 - Sx + P = 0$.`,
      sol: R`(α) $S = -1$, $P = -6$: $x^2 + x - 6 = 0$. (β) $S = 14$, $P = 49 - 3 = 46$: $x^2 - 14x + 46 = 0$.` },
    { level: 2, type: "fields", q: R`Να σχηματίσετε εξίσωση με ακέραιους συντελεστές, της μορφής $15x^2 + \beta x + \gamma = 0$, με λύσεις $\frac13$ και $-\frac25$.`,
      fields: [{ label: "β =", ans: 1 }, { label: "γ =", ans: -2 }],
      hint: R`$S = \frac13 - \frac25 = -\frac{1}{15}$, $P = -\frac{2}{15}$. Πολλαπλασίασε την $x^2 - Sx + P = 0$ με 15.`,
      sol: R`$x^2 + \frac{1}{15}x - \frac{2}{15} = 0 \Rightarrow 15x^2 + x - 2 = 0$.` },
    { level: 2, type: "fields", q: R`Να παραγοντοποιήσετε: $2x^2 - x - 21 = 2(x - \rho_1)(x - \rho_2)$ με $\rho_1 < \rho_2$.`,
      fields: [{ label: "ρ₁ =", ans: -3 }, { label: "ρ₂ =", ans: "7/2" }],
      hint: R`Βρες τις ρίζες του τριωνύμου: $\Delta = 1 + 168 = 169$.`,
      sol: R`$x = \frac{1 \pm 13}{4}$ ⇒ $-3$ και $\frac72$. Άρα $2x^2 - x - 21 = 2(x + 3)\left(x - \frac72\right) = (x + 3)(2x - 7)$.` },
    { level: 2, type: "fields", q: R`Να απλοποιήσετε το κλάσμα $\dfrac{2x^2 - 3x - 2}{x^2 - 4x + 4}$ (για $x \ne 2$) και να το γράψετε στη μορφή $\dfrac{\alpha x + \beta}{x + \gamma}$.`,
      fields: [{ label: "α =", ans: 2 }, { label: "β =", ans: 1 }, { label: "γ =", ans: -2 }],
      hint: R`Αριθμητής: ρίζες $2$ και $-\frac12$. Παρονομαστής: $(x - 2)^2$.`,
      sol: R`$2x^2 - 3x - 2 = (x - 2)(2x + 1)$ και $x^2 - 4x + 4 = (x - 2)^2$. Άρα $\dfrac{(x-2)(2x+1)}{(x-2)^2} = \dfrac{2x + 1}{x - 2}$.` }
  ]
},
/* ───────────────────────────── 5.2.4 ───────────────────────────── */
{
  id: "5.2.4", unit: 5, title: "Συστήματα δεύτερου βαθμού",
  book: "Β΄ Τεύχος §5.2.4 · Δραστηριότητες σελ. 52",
  theory: R`
<div class="tbox"><h4>Μέθοδος αντικατάστασης</h4>
<ol><li>Λύνουμε την <b>πρωτοβάθμια</b> εξίσωση ως προς έναν άγνωστο.</li>
<li>Αντικαθιστούμε στη δευτεροβάθμια ⇒ εξίσωση 2ου βαθμού με έναν άγνωστο.</li>
<li>Για κάθε λύση βρίσκουμε τον άλλον άγνωστο. Γράφουμε τις λύσεις ως <b>ζεύγη</b> $(x, y)$.</li></ol>
<p>π.χ. $\begin{cases} x + 2y = 3 \\ x + y^2 = 2\end{cases}$: $x = 3 - 2y \Rightarrow 3 - 2y + y^2 = 2 \Rightarrow (y - 1)^2 = 0 \Rightarrow (x, y) = (1, 1)$.</p></div>

<div class="tbox tip"><h4>Γεωμετρική ερμηνεία</h4>
<p>Οι κοινές λύσεις ευθείας και παραβολής είναι τα <b>κοινά τους σημεία</b>. Μετά την αντικατάσταση, η διακρίνουσα λέει πόσα είναι: $\Delta > 0$ δύο, $\Delta = 0$ ένα (εφάπτονται), $\Delta < 0$ κανένα.</p></div>`,
  widget: "linepar",
  exercises: [
    { level: 1, type: "fields", q: R`Να λύσετε το σύστημα $\begin{cases} x + 2y = 3 \\ x + y^2 = 2 \end{cases}$`,
      fields: [{ label: "x =", ans: 1 }, { label: "y =", ans: 1 }],
      hint: R`Από την πρώτη $x = 3 - 2y$.`,
      sol: R`$3 - 2y + y^2 = 2 \Rightarrow y^2 - 2y + 1 = 0 \Rightarrow y = 1$, $x = 1$. Μοναδική λύση $(1, 1)$.` },
    { level: 2, type: "fields", q: R`Να λύσετε το σύστημα $\begin{cases} 3x - y = 4 \\ 3xy = 5 \end{cases}$ (δώστε πρώτα τη λύση με το μεγαλύτερο $x$).`,
      fields: [{ label: "x₁ =", ans: "5/3" }, { label: "y₁ =", ans: 1 }, { label: "x₂ =", ans: "-1/3" }, { label: "y₂ =", ans: -5 }],
      hint: R`$y = 3x - 4$ ⇒ $3x(3x - 4) = 5 \Rightarrow 9x^2 - 12x - 5 = 0$.`,
      sol: R`$\Delta = 144 + 180 = 324$, $x = \frac{12 \pm 18}{18}$ ⇒ $x = \frac53$ ή $x = -\frac13$. Τότε $y = 1$ ή $y = -5$. Λύσεις $\left(\frac53, 1\right)$ και $\left(-\frac13, -5\right)$.` },
    { level: 1, type: "fields", q: R`Ένα ορθογώνιο έχει εμβαδόν $24$ cm² και το μήκος του είναι κατά $10$ cm μεγαλύτερο από το πλάτος. Να βρείτε τις διαστάσεις του.`,
      fields: [{ label: "πλάτος (cm) =", ans: 2 }, { label: "μήκος (cm) =", ans: 12 }],
      hint: R`$x(x + 10) = 24$.`,
      sol: R`$x^2 + 10x - 24 = 0 \Rightarrow x = 2$ ή $x = -12$ (απορρίπτεται). Πλάτος $2$ cm, μήκος $12$ cm.` },
    { level: 2, type: "fields", q: R`Να βρείτε τα σημεία τομής της ευθείας $y = 2x + 15$ με την παραβολή $y = x^2$.`,
      fields: [{ label: "1ο σημείο (μικρότερο x) x =", ans: -3 }, { label: "1ο σημείο y =", ans: 9 }, { label: "2ο σημείο (μεγαλύτερο x) x =", ans: 5 }, { label: "2ο σημείο y =", ans: 25 }],
      hint: R`$x^2 = 2x + 15 \Rightarrow x^2 - 2x - 15 = 0$.`,
      sol: R`$(x - 5)(x + 3) = 0 \Rightarrow x = -3$ ή $x = 5$. Σημεία $(-3, 9)$ και $(5, 25)$.` },
    { level: 2, type: "mc", q: R`Η ευθεία $y = 2x + 15$ και η παραβολή $y = x^2 + 3x + 20$:`,
      options: ["τέμνονται σε δύο σημεία", "εφάπτονται", "δεν έχουν κοινό σημείο", "τέμνονται στο $(0, 15)$"], correct: 2,
      hint: R`Εξίσωσε και υπολόγισε τη διακρίνουσα.`,
      sol: R`$x^2 + 3x + 20 = 2x + 15 \Rightarrow x^2 + x + 5 = 0$, $\Delta = 1 - 20 < 0$: <b>κανένα</b> κοινό σημείο.` },
    { level: 2, type: "fields", q: R`Να βρείτε δύο αριθμούς με άθροισμα $2$ και άθροισμα τετραγώνων $34$.`,
      fields: [{ label: "μικρότερος =", ans: -3 }, { label: "μεγαλύτερος =", ans: 5 }],
      hint: R`$x + y = 2$ και $x^2 + y^2 = 34$. Βρες το $xy$ από $(x + y)^2 = x^2 + y^2 + 2xy$.`,
      sol: R`$4 = 34 + 2xy \Rightarrow xy = -15$. Οι αριθμοί είναι λύσεις της $t^2 - 2t - 15 = 0$: $5$ και $-3$.` },
    { level: 2, type: "fields", q: R`Δύο αριθμοί έχουν διαφορά $4$ και γινόμενο $21$. Να βρείτε τους <b>θετικούς</b> αριθμούς που ικανοποιούν τις συνθήκες.`,
      fields: [{ label: "μικρότερος =", ans: 3 }, { label: "μεγαλύτερος =", ans: 7 }],
      hint: R`$x - y = 4$, $xy = 21$ ⇒ $y(y + 4) = 21$.`,
      sol: R`$y^2 + 4y - 21 = 0 \Rightarrow y = 3$ ή $y = -7$. Θετικοί: $y = 3$, $x = 7$. (Η άλλη λύση είναι $-3$ και $-7$.)` }
  ]
},
/* ───────────────────────────── 5.3 ───────────────────────────── */
{
  id: "5.3", unit: 5, title: "Πρόσημο τριωνύμου – Ανισώσεις 2ου βαθμού",
  book: "Β΄ Τεύχος §5.3.1–5.3.2 · Δραστηριότητες σελ. 58, 62, 69",
  theory: R`
<div class="tbox"><h4>Πρόσημο του $f(x) = \alpha x^2 + \beta x + \gamma$</h4>
<table class="mini"><tr><th>$\Delta$</th><th>Πρόσημο</th></tr>
<tr><td>$\Delta > 0$ (ρίζες $x_1 < x_2$)</td><td><b>ομόσημο του α</b> έξω από τις ρίζες, <b>ετερόσημο</b> ανάμεσά τους</td></tr>
<tr><td>$\Delta = 0$ (διπλή ρίζα $x_0$)</td><td>ομόσημο του α για κάθε $x \ne x_0$, μηδέν στο $x_0$</td></tr>
<tr><td>$\Delta < 0$</td><td>ομόσημο του α για <b>κάθε</b> $x$</td></tr></table>
<p>Η εικόνα: η παραβολή είναι πάνω από τον $x'x$ όπου $f(x) > 0$ και κάτω όπου $f(x) < 0$.</p></div>

<div class="tbox"><h4>Λύση ανίσωσης</h4>
<ol><li>Φέρνουμε όλους τους όρους στο ένα μέλος: $\alpha x^2 + \beta x + \gamma \gtrless 0$.</li>
<li>Βρίσκουμε ρίζες και κάνουμε <b>πίνακα προσήμων</b>.</li>
<li>Διαλέγουμε τα διαστήματα με το ζητούμενο πρόσημο (για $\ge$, $\le$ μαζί με τις ρίζες).</li></ol>
<p>π.χ. $x^2 - 36 > 0$: ρίζες $\pm 6$, $\alpha > 0$ ⇒ $x < -6$ ή $x > 6$.</p></div>`,
  widget: "trin",
  gen: "gineq",
  exercises: [
    { level: 1, type: "mc", q: R`Οι λύσεις της ανίσωσης $x^2 - 36 > 0$ είναι:`,
      options: ["$-6 < x < 6$", "$x < -6$ ή $x > 6$", "$x > 6$", "$x > 36$"], correct: 1,
      hint: R`Ρίζες $\pm 6$, $\alpha = 1 > 0$: έξω από τις ρίζες θετικό.`,
      sol: R`Έξω από τις ρίζες το τριώνυμο είναι ομόσημο του $\alpha > 0$: $x < -6$ ή $x > 6$.` },
    { level: 1, type: "fields", q: R`Να λύσετε την ανίσωση $6x - 3x^2 \ge 0$. Οι λύσεις είναι $a \le x \le b$.`,
      fields: [{ label: "a =", ans: 0 }, { label: "b =", ans: 2 }],
      hint: R`$3x(2 - x) \ge 0$. Ρίζες $0$ και $2$, $\alpha = -3 < 0$.`,
      sol: R`Ρίζες $0, 2$. Αφού $\alpha < 0$, το τριώνυμο είναι θετικό <b>ανάμεσα</b> στις ρίζες: $0 \le x \le 2$.` },
    { level: 1, type: "fields", q: R`Να λύσετε την ανίσωση $(x - 2)(x - 3) \le 0$. Οι λύσεις είναι $a \le x \le b$.`,
      fields: [{ label: "a =", ans: 2 }, { label: "b =", ans: 3 }],
      hint: R`Ρίζες $2$, $3$ και $\alpha = 1 > 0$.`,
      sol: R`Αρνητικό ανάμεσα στις ρίζες: $2 \le x \le 3$.` },
    { level: 2, type: "mc", q: R`Η ανίσωση $x^2 + 3x < -6$:`,
      options: ["έχει λύσεις $-3 < x < 0$", "αληθεύει για κάθε $x$", "είναι αδύνατη", "έχει λύσεις $x < -6$"], correct: 2,
      hint: R`$x^2 + 3x + 6 < 0$. Υπολόγισε τη $\Delta$.`,
      sol: R`$x^2 + 3x + 6 < 0$ με $\Delta = 9 - 24 < 0$ και $\alpha > 0$: το τριώνυμο είναι <b>πάντα θετικό</b>. Άρα η ανίσωση είναι αδύνατη.` },
    { level: 2, type: "mc", q: R`Να λύσετε την ανίσωση $(x + 4)^2 > 4(2x + 5)$.`,
      options: ["$x > 2$", "$-2 < x < 2$", "$x < -2$ ή $x > 2$", "κάθε $x \\in \\mathbb{R}$"], correct: 2,
      hint: R`Κάνε πράξεις: $x^2 + 8x + 16 > 8x + 20$.`,
      sol: R`$x^2 + 8x + 16 > 8x + 20 \Rightarrow x^2 - 4 > 0 \Rightarrow x < -2$ ή $x > 2$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την ανίσωση $x^2 + 2x - 24 \le 0$. Οι λύσεις είναι $a \le x \le b$.`,
      fields: [{ label: "a =", ans: -6 }, { label: "b =", ans: 4 }],
      hint: R`$x^2 + 2x - 24 = (x + 6)(x - 4)$.`,
      sol: R`Ρίζες $-6$ και $4$, $\alpha > 0$: μη θετικό ανάμεσα ⇒ $x \in [-6, 4]$.` },
    { level: 2, type: "mc", q: R`Να λύσετε την ανίσωση $-x^2 + x + 20 < 0$.`,
      options: ["$-4 < x < 5$", "$x < -4$ ή $x > 5$", "$x < -5$ ή $x > 4$", "αδύνατη"], correct: 1,
      hint: R`Ρίζες: $-x^2 + x + 20 = -(x - 5)(x + 4)$. Το $\alpha$ είναι αρνητικό.`,
      sol: R`Ρίζες $-4$ και $5$, $\alpha = -1 < 0$: αρνητικό <b>έξω</b> από τις ρίζες ⇒ $x \in (-\infty, -4) \cup (5, +\infty)$.` },
    { level: 2, type: "fields", q: R`Το κόστος (σε €) για την παραγωγή $x$ προϊόντων είναι $K(x) = 2x^2 - 80x + 500$, $x > 0$. Πόσα το πολύ προϊόντα μπορούν να παραχθούν χωρίς το κόστος να ξεπεράσει τα $1500$ €;`,
      fields: [{ label: "το πολύ =", ans: 50 }],
      hint: R`$2x^2 - 80x + 500 \le 1500 \Rightarrow x^2 - 40x - 500 \le 0$.`,
      sol: R`Ρίζες της $x^2 - 40x - 500$: $\Delta = 1600 + 2000 = 3600$, $x = \frac{40 \pm 60}{2}$ ⇒ $-10$ και $50$. Άρα $-10 \le x \le 50$ και με $x > 0$: το πολύ <b>50</b> προϊόντα.` },
    { level: 3, type: "fields", q: R`Ο πίνακας προσήμων του $f(x) = \alpha x^2 + \beta x - 6$ δείχνει: $f(x) > 0$ για $x < -1$ ή $x > 6$ και $f(x) < 0$ για $-1 < x < 6$. Να βρείτε τα $\alpha, \beta$.`,
      fields: [{ label: "α =", ans: 1 }, { label: "β =", ans: -5 }],
      hint: R`$f(x) = \alpha(x + 1)(x - 6)$. Σύγκρινε τον σταθερό όρο με το $-6$.`,
      sol: R`$f(x) = \alpha(x^2 - 5x - 6)$, σταθερός όρος $-6\alpha = -6 \Rightarrow \alpha = 1$ (θετικό, όπως δείχνει ο πίνακας). Τότε $\beta = -5$.` },
    { level: 3, type: "fields", q: R`Για ποιες τιμές του $m$ ισχύει $x^2 + mx + 4 > 0$ για <b>κάθε</b> $x \in \mathbb{R}$; Δώστε το διάστημα $(a, b)$.`,
      fields: [{ label: "a =", ans: -4 }, { label: "b =", ans: 4 }],
      hint: R`Με $\alpha = 1 > 0$, θέλουμε $\Delta < 0$.`,
      sol: R`$\Delta = m^2 - 16 < 0 \Rightarrow -4 < m < 4$.` }
  ]
},
/* ───────────────────────────── 6.1 ───────────────────────────── */
{
  id: "6.1", unit: 6, title: "Θεώρημα Θαλή",
  book: "Β΄ Τεύχος §6.1 · Δραστηριότητες σελ. 81",
  theory: R`
<div class="tbox"><h4>Θεώρημα Θαλή</h4>
<p>Αν τρεις (ή περισσότερες) <b>παράλληλες</b> ευθείες τέμνουν δύο άλλες ευθείες, τότε ορίζουν σε αυτές τμήματα <b>ανάλογα</b>:</p>
$$\varepsilon_1 \parallel \varepsilon_2 \parallel \varepsilon_3 \;\Rightarrow\; \frac{AB}{B\Gamma} = \frac{\Delta E}{EZ} \quad\left(\text{και } \frac{AB}{A\Gamma} = \frac{\Delta E}{\Delta Z}\right)$$</div>

<div class="tbox"><h4>Σε τρίγωνο</h4>
<p>Αν μια ευθεία είναι <b>παράλληλη</b> σε μια πλευρά τριγώνου, χωρίζει τις άλλες δύο πλευρές σε ανάλογα τμήματα: για $\Delta E \parallel B\Gamma$,</p>
$$\frac{A\Delta}{\Delta B} = \frac{AE}{E\Gamma} \qquad \frac{A\Delta}{AB} = \frac{AE}{A\Gamma}$$
<p><b>Αντίστροφο:</b> αν $\frac{A\Delta}{\Delta B} = \frac{AE}{E\Gamma}$, τότε $\Delta E \parallel B\Gamma$.</p></div>

<div class="tbox tip"><h4>Μέθοδος</h4>
<p>Γράφουμε την αναλογία με τα δεδομένα και τον άγνωστο, και κάνουμε «χιαστί»: $\frac{2}{4} = \frac{3}{x} \Rightarrow 2x = 12 \Rightarrow x = 6$.</p></div>`,
  widget: "thales",
  exercises: [
    { level: 1, type: "fields", q: R`Στο σχήμα $\varepsilon_1 \parallel \varepsilon_2 \parallel \varepsilon_3$, $AB = 2$ cm, $B\Gamma = 4$ cm και $\Delta E = 3$ cm. Να βρείτε το $EZ$.` + FIG.poly({ pts: { A: [0, 4], B: [0.8, 2.7], "Γ": [2.4, 0], "Δ": [5, 4], E: [5.6, 2.7], Z: [6.8, 0] }, lines: [["A", "Δ", "ε₁"], ["B", "E", "ε₂"], ["Γ", "Z", "ε₃"]], segs: [["A", "Γ"], ["Δ", "Z"]], slab: [["A", "B", "2", 1], ["B", "Γ", "4", 1], ["Δ", "E", "3"], ["E", "Z", "x"]] }),
      fields: [{ label: "EZ =", ans: 6 }],
      hint: R`$\frac{AB}{B\Gamma} = \frac{\Delta E}{EZ}$.`,
      sol: R`$\frac24 = \frac{3}{EZ} \Rightarrow EZ = 6$ cm.` },
    { level: 1, type: "fields", q: R`Στο σχήμα η $\Delta E$ είναι παράλληλη στη $B\Gamma$, με $\Delta B = 3$ cm, $AE = 12$ cm και $E\Gamma = 4$ cm. Να βρείτε το $A\Delta$.` + FIG.poly({ pts: { A: [2, 6], B: [0, 0], "Γ": [6, 0], "Δ": [0.5, 1.5], E: [5, 1.5] }, segs: [["A", "B"], ["B", "Γ"], ["Γ", "A"], ["Δ", "E"]], slab: [["A", "Δ", "x"], ["Δ", "B", "3"], ["A", "E", "12", 1], ["E", "Γ", "4", 1]] }),
      fields: [{ label: "ΑΔ =", ans: 9 }],
      hint: R`$\frac{A\Delta}{\Delta B} = \frac{AE}{E\Gamma}$.`,
      sol: R`$\frac{A\Delta}{3} = \frac{12}{4} = 3 \Rightarrow A\Delta = 9$ cm.` },
    { level: 1, type: "fields", q: R`Στο σχήμα $\varepsilon_1 \parallel \varepsilon_2 \parallel \varepsilon_3$, $AB = 6$ cm, $B\Gamma = 2$ cm και $EZ = 1$ cm. Να βρείτε το $\Delta E$.` + FIG.poly({ pts: { A: [0, 4], B: [1.2, 1], "Γ": [1.6, 0], "Δ": [5, 4], E: [5.9, 1], Z: [6.2, 0] }, lines: [["A", "Δ", "ε₁"], ["B", "E", "ε₂"], ["Γ", "Z", "ε₃"]], segs: [["A", "Γ"], ["Δ", "Z"]], slab: [["A", "B", "6", 1], ["B", "Γ", "2", 1], ["Δ", "E", "x"], ["E", "Z", "1"]] }),
      fields: [{ label: "ΔΕ =", ans: 3 }],
      hint: R`$\frac{AB}{B\Gamma} = \frac{\Delta E}{EZ}$.`,
      sol: R`$\frac62 = \frac{\Delta E}{1} \Rightarrow \Delta E = 3$ cm.` },
    { level: 2, type: "fields", q: R`Στο τρίγωνο $AB\Gamma$ φέρνουμε $\Delta E \parallel B\Gamma$ ($\Delta$ στην $AB$, $E$ στην $A\Gamma$), με $A\Delta = 4$, $AB = 10$ και $A\Gamma = 15$. Να βρείτε τα $AE$ και $E\Gamma$.`,
      fields: [{ label: "ΑΕ =", ans: 6 }, { label: "ΕΓ =", ans: 9 }],
      hint: R`$\frac{A\Delta}{AB} = \frac{AE}{A\Gamma}$.`,
      sol: R`$\frac{4}{10} = \frac{AE}{15} \Rightarrow AE = 6$, άρα $E\Gamma = 15 - 6 = 9$.` },
    { level: 2, type: "fields", q: R`Σε τρίγωνο $AB\Gamma$ είναι $\Delta E \parallel B\Gamma$ με $A\Delta = x$, $\Delta B = 6$, $AE = 4$, $E\Gamma = 8$. Να βρείτε το $x$.`,
      fields: [{ label: "x =", ans: 3 }],
      hint: R`$\frac{x}{6} = \frac48$.`,
      sol: R`$x = 6\cdot\frac48 = 3$.` },
    { level: 1, type: "mc", q: R`Σε τρίγωνο $AB\Gamma$, τα $\Delta, E$ είναι σημεία των $AB$ και $A\Gamma$ με $A\Delta = 2$, $\Delta B = 3$, $AE = 4$, $E\Gamma = 6$. Τι συμπεραίνουμε;`,
      options: ["$\\Delta E = B\\Gamma$", "$\\Delta E \\parallel B\\Gamma$", "$\\Delta E \\perp B\\Gamma$", "τίποτα"], correct: 1,
      hint: R`Σύγκρινε τους λόγους $\frac{A\Delta}{\Delta B}$ και $\frac{AE}{E\Gamma}$.`,
      sol: R`$\frac23 = \frac46$, άρα από το <b>αντίστροφο</b> του Θεωρήματος Θαλή $\Delta E \parallel B\Gamma$.` },
    { level: 2, type: "fields", q: R`Να χωρίσετε ένα ευθύγραμμο τμήμα μήκους $15$ cm σε δύο μέρη με λόγο $2 : 3$.`,
      fields: [{ label: "μικρό μέρος =", ans: 6 }, { label: "μεγάλο μέρος =", ans: 9 }],
      hint: R`Τα μέρη είναι $2k$ και $3k$ με $5k = 15$.`,
      sol: R`$k = 3$: τα μέρη είναι $6$ cm και $9$ cm. (Γεωμετρικά γίνεται με το Θεώρημα Θαλή, χαράζοντας παράλληλες από βοηθητική ημιευθεία με 5 ίσα τμήματα.)` }
  ]
},
/* ───────────────────────────── 6.2 ───────────────────────────── */
{
  id: "6.2", unit: 6, title: "Όμοια ευθύγραμμα σχήματα",
  book: "Β΄ Τεύχος §6.2 · Δραστηριότητες σελ. 89",
  theory: R`
<div class="tbox"><h4>Όμοια πολύγωνα</h4>
<p>Δύο πολύγωνα είναι <b>όμοια</b> όταν έχουν τις αντίστοιχες <b>γωνίες ίσες</b> και τις αντίστοιχες <b>πλευρές ανάλογες</b>. Ο κοινός λόγος $\lambda$ των πλευρών λέγεται <b>λόγος ομοιότητας</b>.</p>
<p>Χρειάζονται <b>και τα δύο</b>: τετράγωνο και ρόμβος έχουν ανάλογες πλευρές αλλά όχι ίσες γωνίες· τετράγωνο και ορθογώνιο έχουν ίσες γωνίες αλλά όχι ανάλογες πλευρές.</p></div>

<div class="tbox"><h4>Περίμετροι και εμβαδά</h4>
$$\frac{\Pi'}{\Pi} = \lambda \qquad \frac{E'}{E} = \lambda^2$$
<p>π.χ. με $\lambda = \frac52$ και $E = 16$ cm²: $E' = \frac{25}{4}\cdot 16 = 100$ cm².</p></div>

<div class="tbox tip"><h4>Πάντα όμοια</h4>
<p>Δύο κανονικά πολύγωνα με τον <b>ίδιο αριθμό πλευρών</b> (π.χ. δύο τετράγωνα, δύο κανονικά εξάγωνα), δύο κύκλοι.</p></div>`,
  widget: "simil",
  gen: "gsim",
  exercises: [
    { level: 1, type: "mc", q: R`Ποιο ζεύγος σχημάτων είναι <b>πάντα</b> όμοιο;`,
      options: ["ένα τετράγωνο και ένας ρόμβος", "ένα τετράγωνο και ένα ορθογώνιο", "δύο κανονικά εξάγωνα με πλευρές 5 cm και 7 cm", "ένα κανονικό πεντάγωνο και ένα κανονικό εξάγωνο με την ίδια πλευρά"], correct: 2,
      hint: R`Χρειάζονται ίσες γωνίες <b>και</b> ανάλογες πλευρές.`,
      sol: R`Τα κανονικά εξάγωνα έχουν όλες τις γωνίες $120^\circ$ και πλευρές σε λόγο $\frac75$: όμοια. Τετράγωνο–ρόμβος: γωνίες διαφορετικές. Τετράγωνο–ορθογώνιο: πλευρές όχι ανάλογες. Πεντάγωνο–εξάγωνο: διαφορετικός αριθμός πλευρών.` },
    { level: 1, type: "fields", q: R`Ο λόγος ομοιότητας δύο πολυγώνων (μικρό προς μεγάλο) είναι $\frac25$ και το εμβαδόν του μικρού είναι $16$ cm². Να βρείτε το εμβαδόν του μεγάλου.`,
      fields: [{ label: "εμβαδόν =", ans: 100 }],
      hint: R`Ο λόγος εμβαδών είναι $\lambda^2 = \frac{4}{25}$.`,
      sol: R`$\frac{16}{E} = \frac{4}{25} \Rightarrow E = 100$ cm².` },
    { level: 1, type: "fields", q: R`Δύο όμοια τετράπλευρα έχουν λόγο ομοιότητας $3$. Αν η περίμετρος του μικρού είναι $20$ cm, ποια είναι η περίμετρος του μεγάλου;`,
      fields: [{ label: "περίμετρος =", ans: 60 }],
      hint: R`Οι περίμετροι έχουν λόγο $\lambda$.`,
      sol: R`$3\cdot 20 = 60$ cm.` },
    { level: 2, type: "mc", q: R`Είναι όμοια τα ορθογώνια με διαστάσεις $4 \times 6$ και $6 \times 9$;`,
      options: ["Ναι, με λόγο $\\frac32$", "Όχι, γιατί $6 - 4 \\ne 9 - 6$", "Όχι, γιατί $\\frac46 \\ne \\frac69$", "Ναι, με λόγο $2$"], correct: 0,
      hint: R`Οι γωνίες είναι όλες ορθές. Έλεγξε τους λόγους των αντίστοιχων πλευρών.`,
      sol: R`$\frac64 = \frac96 = \frac32$ και όλες οι γωνίες $90^\circ$: όμοια με λόγο $\frac32$. (Ελέγχουμε <b>λόγους</b>, όχι διαφορές!)` },
    { level: 2, type: "fields", q: R`Ένα τετράπλευρο έχει πλευρές $3$, $4$, $5$, $6$ cm. Σε όμοιό του, η μεγαλύτερη πλευρά είναι $9$ cm. Να βρείτε τον λόγο ομοιότητας και την περίμετρο του δεύτερου.`,
      fields: [{ label: "λ =", ans: "3/2" }, { label: "περίμετρος =", ans: 27 }],
      hint: R`Αντίστοιχες είναι οι μεγαλύτερες πλευρές: $\lambda = \frac96$.`,
      sol: R`$\lambda = \frac96 = \frac32$. Περίμετρος πρώτου $18$, δεύτερου $\frac32\cdot 18 = 27$ cm (πλευρές $4{,}5$, $6$, $7{,}5$, $9$).` },
    { level: 2, type: "fields", q: R`Σε χάρτη με κλίμακα $1 : 50\,000$, η απόσταση δύο χωριών είναι $3$ cm και ένα δάσος καλύπτει $2$ cm². Να βρείτε την πραγματική απόσταση (σε km) και την πραγματική έκταση του δάσους (σε km²).`,
      fields: [{ label: "απόσταση (km) =", ans: 1.5 }, { label: "έκταση (km²) =", ans: 0.5 }],
      hint: R`Μήκη × $50\,000$, εμβαδά × $50\,000^2$. Θυμήσου: $1$ km $= 100\,000$ cm.`,
      sol: R`$3\cdot 50\,000 = 150\,000$ cm $= 1{,}5$ km. Εμβαδόν: $2\cdot 50\,000^2 = 5\cdot 10^9$ cm² και $1$ km² $= 10^{10}$ cm², άρα $0{,}5$ km².` }
  ]
},
/* ───────────────────────────── 6.3 ───────────────────────────── */
{
  id: "6.3", unit: 6, title: "Όμοια τρίγωνα",
  book: "Β΄ Τεύχος §6.3 · Δραστηριότητες σελ. 100, 107",
  theory: R`
<div class="tbox"><h4>Κριτήρια ομοιότητας τριγώνων</h4>
<p>Δύο τρίγωνα είναι όμοια αν ισχύει <b>ένα</b> από τα παρακάτω:</p>
<ol><li><b>Δύο γωνίες</b> του ενός ίσες με δύο γωνίες του άλλου (τότε και η τρίτη).</li>
<li><b>Δύο πλευρές ανάλογες</b> και η <b>περιεχόμενη γωνία ίση</b>.</li>
<li><b>Τρεις πλευρές ανάλογες</b>.</li></ol></div>

<div class="tbox tip"><h4>Στην πράξη</h4>
<ul><li>Απέναντι από <b>ίσες γωνίες</b> βρίσκονται οι <b>αντίστοιχες</b> πλευρές — γράφουμε την αναλογία με αυτές.</li>
<li>Αν $\Delta E \parallel B\Gamma$ σε τρίγωνο $AB\Gamma$, τότε $A\Delta E \sim AB\Gamma$ (κοινή $\hat A$, εντός εκτός και επί τα αυτά ίσες).</li>
<li>Σκιές την ίδια ώρα: ο ήλιος δίνει ίσες γωνίες ⇒ όμοια τρίγωνα.</li></ul></div>`,
  widget: "simil",
  gen: "gsim",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια συνθήκη <b>αρκεί</b> για να είναι δύο τρίγωνα όμοια;`,
      options: ["μία γωνία ίση", "δύο πλευρές ανάλογες", "δύο γωνίες ίσες", "ίδια περίμετρος"], correct: 2,
      hint: R`Θυμήσου τα τρία κριτήρια.`,
      sol: R`Δύο ίσες γωνίες αρκούν (1ο κριτήριο). Δύο ανάλογες πλευρές δεν αρκούν χωρίς την περιεχόμενη γωνία.` },
    { level: 1, type: "fields", q: R`Τα τρίγωνα με πλευρές $6, 8, 10$ και $9, 12, 15$ είναι όμοια. Να βρείτε τον λόγο ομοιότητας (μεγάλο προς μικρό) και τον λόγο των εμβαδών τους.`,
      fields: [{ label: "λ =", ans: "3/2" }, { label: "λόγος εμβαδών =", ans: "9/4" }],
      hint: R`$\frac96 = \frac{12}{8} = \frac{15}{10}$.`,
      sol: R`Τρεις πλευρές ανάλογες με $\lambda = \frac32$. Εμβαδά σε λόγο $\lambda^2 = \frac94$. (Και τα δύο είναι ορθογώνια: $6^2 + 8^2 = 10^2$.)` },
    { level: 1, type: "fields", q: R`Ένα ραβδί ύψους $1{,}5$ m ρίχνει σκιά $2$ m. Την ίδια ώρα ένα δέντρο ρίχνει σκιά $12$ m. Πόσο ψηλό είναι το δέντρο;`,
      fields: [{ label: "ύψος (m) =", ans: 9 }],
      hint: R`Όμοια ορθογώνια τρίγωνα: $\frac{h}{12} = \frac{1{,}5}{2}$.`,
      sol: R`$h = 12\cdot\frac{1{,}5}{2} = 9$ m.` },
    { level: 2, type: "fields", q: R`Σε τρίγωνο $AB\Gamma$ φέρνουμε $\Delta E \parallel B\Gamma$ με $A\Delta = 3$, $\Delta B = 2$ και $\Delta E = 6$. Να βρείτε το $B\Gamma$.` + FIG.poly({ pts: { A: [2.2, 5], B: [0, 0], "Γ": [6, 0], "Δ": [0.88, 2], E: [4.48, 2] }, segs: [["A", "B"], ["B", "Γ"], ["Γ", "A"], ["Δ", "E"]], slab: [["A", "Δ", "3"], ["Δ", "B", "2"], ["Δ", "E", "6", 1]] }),
      fields: [{ label: "ΒΓ =", ans: 10 }],
      hint: R`$A\Delta E \sim AB\Gamma$ με λόγο $\frac{A\Delta}{AB} = \frac35$.`,
      sol: R`$AB = 5$. Από την ομοιότητα $\frac{\Delta E}{B\Gamma} = \frac{A\Delta}{AB} = \frac35 \Rightarrow B\Gamma = 6\cdot\frac53 = 10$.` },
    { level: 3, type: "fields", q: R`Στο ορθογώνιο τρίγωνο $AB\Gamma$ ($\hat A = 90^\circ$) είναι $AB = 6$, $A\Gamma = 8$, και $A\Delta$ το ύψος προς την υποτείνουσα. Να βρείτε τα $B\Gamma$, $A\Delta$ και $B\Delta$.` + FIG.poly({ pts: { A: [3.6, 4.8], B: [0, 0], "Γ": [10, 0], "Δ": [3.6, 0] }, segs: [["A", "B"], ["B", "Γ"], ["Γ", "A"], ["A", "Δ", 1]], ang: [["B", "A", "Γ", "", "R"], ["A", "Δ", "Γ", "", "R"]], slab: [["A", "B", "6"], ["A", "Γ", "8"]] }),
      fields: [{ label: "ΒΓ =", ans: 10 }, { label: "ΑΔ =", ans: 4.8 }, { label: "ΒΔ =", ans: 3.6 }],
      hint: R`Τα $AB\Delta$ και $\Gamma BA$ είναι όμοια (κοινή $\hat B$, ορθές γωνίες): $\frac{B\Delta}{AB} = \frac{AB}{B\Gamma}$.`,
      sol: R`$B\Gamma = \sqrt{36 + 64} = 10$. Από την ομοιότητα $AB\Delta \sim \Gamma BA$: $\frac{A\Delta}{A\Gamma} = \frac{AB}{B\Gamma} \Rightarrow A\Delta = \frac{6\cdot 8}{10} = 4{,}8$ και $\frac{B\Delta}{AB} = \frac{AB}{B\Gamma} \Rightarrow B\Delta = \frac{36}{10} = 3{,}6$.` },
    { level: 2, type: "fields", q: R`Δύο όμοια τρίγωνα έχουν λόγο ομοιότητας $3$. Αν το εμβαδόν του μικρού είναι $5$ cm², ποιο είναι το εμβαδόν του μεγάλου;`,
      fields: [{ label: "εμβαδόν =", ans: 45 }],
      hint: R`Εμβαδά: λόγος $\lambda^2$.`,
      sol: R`$9\cdot 5 = 45$ cm².` },
    { level: 2, type: "mc", q: R`Σε ισοσκελές τρίγωνο $AB\Gamma$ ($AB = A\Gamma$), από σημείο $\Delta$ της βάσης φέρνουμε $\Delta E \perp AB$ και $\Delta Z \perp A\Gamma$. Γιατί τα τρίγωνα $BE\Delta$ και $\Gamma Z\Delta$ είναι όμοια;`,
      options: ["έχουν τρεις πλευρές ανάλογες", "έχουν $\\hat B = \\hat\\Gamma$ και από μία ορθή γωνία", "έχουν ίσα εμβαδά", "δεν είναι όμοια"], correct: 1,
      hint: R`Ποιες γωνίες είναι ίσες στο ισοσκελές;`,
      sol: R`$\hat B = \hat\Gamma$ (γωνίες βάσης ισοσκελούς) και $\widehat{BE\Delta} = \widehat{\Gamma Z\Delta} = 90^\circ$: δύο γωνίες ίσες ⇒ όμοια.` }
  ]
},
/* ───────────────────────────── 7.1 ───────────────────────────── */
{
  id: "7.1", unit: 7, title: "Παρουσίαση δεδομένων – τεταρτημόρια",
  book: "Β΄ Τεύχος §7.1.1–7.1.3 · Δραστηριότητες σελ. 122, 128, 133",
  theory: R`
<div class="tbox"><h4>Πίνακας συχνοτήτων</h4>
<p>Για κάθε τιμή (ή κλάση) γράφουμε τη <b>συχνότητα</b> $f_i$ και την <b>αθροιστική συχνότητα</b> $\Sigma f_i$: το άθροισμα της συχνότητάς της με όλες τις προηγούμενες. Η τελευταία αθροιστική είναι το σύνολο των παρατηρήσεων.</p>
<p>Η αθροιστική συχνότητα απαντά σε ερωτήσεις «<b>το πολύ</b>»: πόσες παρατηρήσεις είναι $\le$ μιας τιμής.</p></div>

<div class="tbox"><h4>Πολύγωνα</h4>
<p><b>Πολύγωνο συχνοτήτων</b>: ενώνουμε τα σημεία (τιμή, $f_i$).</p>
<p><b>Πολύγωνο αθροιστικών συχνοτήτων</b>: για ομαδοποιημένα δεδομένα ενώνουμε τα σημεία (<b>δεξί άκρο</b> κλάσης, $\Sigma f_i$), ξεκινώντας από το (αριστερό άκρο της πρώτης κλάσης, $0$).</p></div>

<div class="tbox tip"><h4>Τεταρτημόρια από το πολύγωνο</h4>
<p>Οι $Q_1, Q_2, Q_3$ χωρίζουν τα διατεταγμένα δεδομένα σε τέσσερα ίσα μέρη (25% το καθένα). Με $N$ παρατηρήσεις: στον κατακόρυφο άξονα βρίσκουμε τα $\frac N4$, $\frac N2$, $\frac{3N}{4}$, φέρνουμε οριζόντια ως το πολύγωνο και μετά κατακόρυφα ως τον οριζόντιο άξονα. Ο $Q_2$ είναι η <b>διάμεσος</b>.</p></div>`,
  widget: "cumfreq",
  exercises: [
    { level: 1, type: "fields", q: R`Τα μεγέθη παπουτσιών 20 παιδιών ενός νηπιαγωγείου: <b>24, 20, 23, 24, 22, 20, 21, 22, 20, 21, 24, 23, 23, 20, 22, 21, 20, 24, 24, 22</b>. Να βρείτε τις συχνότητες και πόσα παιδιά φορούν μέγεθος <b>το πολύ 22</b>.`,
      fields: [{ label: "f(20) =", ans: 5 }, { label: "f(21) =", ans: 3 }, { label: "f(22) =", ans: 4 }, { label: "f(23) =", ans: 3 }, { label: "f(24) =", ans: 5 }, { label: "το πολύ 22 =", ans: 12 }],
      hint: R`Κάνε διαλογή. «Το πολύ 22» = αθροιστική συχνότητα στο 22.`,
      sol: R`Συχνότητες $5, 3, 4, 3, 5$ (σύνολο 20). Αθροιστικές $5, 8, 12, 15, 20$. Το πολύ 22: <b>12</b> παιδιά.` },
    { level: 1, type: "fields", q: R`Αποτελέσματα εξέτασης IQ: $[50, 70)$: 24, $[70, 90)$: 228, $[90, 110)$: 490, $[110, 130)$: 232, $[130, 150)$: 26. Να βρείτε (α) το σύνολο των συμμετεχόντων, (β) πόσοι είχαν IQ $\ge 110$, (γ) πόσοι είχαν IQ $< 90$.`,
      fields: [{ label: "(α) σύνολο =", ans: 1000 }, { label: "(β) IQ ≥ 110 =", ans: 258 }, { label: "(γ) IQ < 90 =", ans: 252 }],
      hint: R`Αθροιστικές: 24, 252, 742, 974, 1000.`,
      sol: R`(α) $1000$. (β) $232 + 26 = 258$ (ή $1000 - 742$). (γ) Αθροιστική στο 90: $24 + 228 = 252$.` },
    { level: 1, type: "fields", q: R`Ο αριθμός παιδιών σε 25 οικογένειες: 0 παιδιά: 3, 1 παιδί: 8, 2 παιδιά: 7, 3 παιδιά: 5, 4 παιδιά: 2. Να βρείτε τις αθροιστικές συχνότητες για 1 και για 3 παιδιά, και πόσες οικογένειες έχουν <b>τουλάχιστον</b> 2 παιδιά.`,
      fields: [{ label: "Σf έως 1 παιδί =", ans: 11 }, { label: "Σf έως 3 παιδιά =", ans: 23 }, { label: "τουλάχιστον 2 =", ans: 14 }],
      hint: R`«Τουλάχιστον 2» = σύνολο − (το πολύ 1).`,
      sol: R`Αθροιστικές: 3, 11, 18, 23, 25. Τουλάχιστον 2 παιδιά: $25 - 11 = 14$.` },
    { level: 2, type: "fields", q: R`Ο χρόνος (σε λεπτά) που χρειάζονται 60 υπάλληλοι για να πάνε στη δουλειά: $[0,10)$: 9, $[10,20)$: 18, $[20,30)$: 13, $[30,40)$: 10, $[40,50)$: 4, $[50,60)$: 4, $[60,70)$: 2. Από το πολύγωνο αθροιστικών συχνοτήτων, να εκτιμήσετε τα τεταρτημόρια. <span class="muted">(Δοκίμασέ το και στο διαδραστικό γράφημα.)</span>`,
      fields: [{ label: "Q₁ ≈", ans: 13.3, tol: 0.08 }, { label: "Q₂ ≈", ans: 22.3, tol: 0.05 }, { label: "Q₃ ≈", ans: 35, tol: 0.03 }],
      hint: R`Αθροιστικές: 9, 27, 40, 50, ... Το $Q_1$ είναι εκεί που η αθροιστική γίνεται $15$: μέσα στην κλάση $[10, 20)$.`,
      sol: R`$\frac N4 = 15$: στην κλάση $[10,20)$ η αθροιστική πάει από 9 σε 27 ⇒ $Q_1 \approx 10 + \frac{15 - 9}{18}\cdot 10 \approx 13$.<br>$\frac N2 = 30$: στην $[20,30)$ από 27 σε 40 ⇒ $Q_2 \approx 20 + \frac{3}{13}\cdot 10 \approx 22$.<br>$\frac{3N}{4} = 45$: στην $[30,40)$ από 40 σε 50 ⇒ $Q_3 = 30 + \frac{5}{10}\cdot 10 = 35$.` },
    { level: 2, type: "fields", q: R`Τα επίπεδα $SO_2$ σε 24 πόλεις σήμερα: $[10,15)$: 6, $[15,20)$: 4, $[20,25)$: 3, $[25,30)$: 5, $[30,35)$: 2, $[35,40)$: 1, $[40,45)$: 2, $[45,50)$: 1. Από το πολύγωνο αθροιστικών συχνοτήτων, σε πόσες πόλεις η συγκέντρωση ήταν το πολύ $28$;`,
      fields: [{ label: "πόλεις ≈", ans: 16, tol: 0.04 }],
      hint: R`Αθροιστική στο 25: $13$, στο 30: $18$. Το 28 είναι στα $\frac35$ της κλάσης.`,
      sol: R`$13 + \frac{28 - 25}{5}\cdot 5 = 13 + 3 = 16$ πόλεις.` },
    { level: 1, type: "mc", q: R`Ποια πρόταση για τα τεταρτημόρια είναι <b>σωστή</b>;`,
      options: ["Το $Q_2$ είναι η μέση τιμή.", "Το $Q_2$ είναι η διάμεσος.", "Το $Q_3$ είναι το $75\\%$ της μέγιστης τιμής.", "Ανάμεσα στο $Q_1$ και στο $Q_3$ βρίσκεται το $25\\%$ των δεδομένων."], correct: 1,
      hint: R`Το $Q_2$ αφήνει τις μισές παρατηρήσεις αριστερά.`,
      sol: R`$Q_2 = $ διάμεσος. Ανάμεσα σε $Q_1$ και $Q_3$ βρίσκεται το <b>50%</b> των δεδομένων.` },
    { level: 2, type: "mc", q: R`Ένας διευθυντής θέλει να δώσει φιλοδώρημα στο <b>25%</b> των πωλητών με τις περισσότερες πωλήσεις. Ποιο μέγεθος του δείχνει το ελάχιστο ποσό πωλήσεων που χρειάζεται κάποιος;`,
      options: ["το $Q_1$", "η διάμεσος", "το $Q_3$", "η μέση τιμή"], correct: 2,
      hint: R`Πάνω από ποιο τεταρτημόριο βρίσκεται το 25% των τιμών;`,
      sol: R`Το 25% με τις μεγαλύτερες τιμές βρίσκεται πάνω από το $Q_3$ (κάτω από αυτό είναι το 75%).` }
  ]
},
/* ───────────────────────────── 7.2 ───────────────────────────── */
{
  id: "7.2", unit: 7, title: "Σταθμισμένος μέσος και μέτρα διασποράς",
  book: "Β΄ Τεύχος §7.2 · Δραστηριότητες σελ. 135, 138, 142",
  theory: R`
<div class="tbox"><h4>Σταθμισμένος μέσος</h4>
<p>Όταν οι τιμές $x_1, \dots, x_\nu$ έχουν διαφορετική <b>βαρύτητα</b> $w_1, \dots, w_\nu$:</p>
$$\bar x = \frac{w_1x_1 + w_2x_2 + \cdots + w_\nu x_\nu}{w_1 + w_2 + \cdots + w_\nu}$$
<p>π.χ. προφορικός 18 (60%), γραπτή άσκηση 14 (10%), διαγώνισμα 16 (30%): $\;0{,}6\cdot 18 + 0{,}1\cdot 14 + 0{,}3\cdot 16 = 17$.</p></div>

<div class="tbox"><h4>Μέτρα θέσης και διασποράς</h4>
<p><b>Μέτρα θέσης</b>: μέση τιμή, διάμεσος, επικρατούσα τιμή, σταθμισμένος μέσος. <b>Μέτρα διασποράς</b>: εύρος, διακύμανση, τυπική απόκλιση.</p>
<p><b>Εύρος</b> $=$ μέγιστη $-$ ελάχιστη τιμή.</p>
$$s^2 = \frac{(x_1 - \bar x)^2 + (x_2 - \bar x)^2 + \cdots + (x_\nu - \bar x)^2}{\nu} \qquad s = \sqrt{s^2}$$
<p>Με συχνότητες: $s^2 = \frac{\sum f_i(x_i - \bar x)^2}{N}$. Η τυπική απόκλιση έχει τις <b>ίδιες μονάδες</b> με τα δεδομένα.</p></div>

<div class="tbox tip"><h4>Τι δείχνουν</h4>
<p>Μικρή $s$: τιμές συγκεντρωμένες γύρω από τη μέση τιμή. Αν προσθέσουμε σταθερά σε όλες τις τιμές, η μέση τιμή αυξάνεται κατά τη σταθερά αλλά η $s$ <b>δεν αλλάζει</b>. Ακραίες τιμές επηρεάζουν πολύ τη μέση τιμή, λίγο τη διάμεσο.</p></div>`,
  widget: "disp",
  gen: "gstat",
  exercises: [
    { level: 1, type: "fields", q: R`Η τιμή $12$ έχει βαρύτητα $0{,}2$, η $14$ βαρύτητα $0{,}3$ και η $17$ βαρύτητα $0{,}5$. Να υπολογίσετε τη σταθμισμένη μέση τιμή.`,
      fields: [{ label: "x̄ =", ans: 15.1 }],
      hint: R`Οι βαρύτητες έχουν άθροισμα 1.`,
      sol: R`$0{,}2\cdot 12 + 0{,}3\cdot 14 + 0{,}5\cdot 17 = 2{,}4 + 4{,}2 + 8{,}5 = 15{,}1$.` },
    { level: 1, type: "fields", q: R`Τρεις μηχανές $A, B, \Gamma$ παράγουν μέχρι $300$, $200$ και $150$ λαμπτήρες την ώρα. Σε μια ώρα λειτουργούν στο $50\%$, $30\%$ και $20\%$ της δυναμικότητάς τους. Πόσους λαμπτήρες παράγει συνολικά το εργοστάσιο εκείνη την ώρα;`,
      fields: [{ label: "λαμπτήρες =", ans: 240 }],
      hint: R`$0{,}5\cdot 300 + \dots$`,
      sol: R`$150 + 60 + 30 = 240$ λαμπτήρες.` },
    { level: 1, type: "mc", q: R`Ποιο από τα πιο κάτω είναι <b>μέτρο διασποράς</b>;`,
      options: ["η διάμεσος", "η επικρατούσα τιμή", "η τυπική απόκλιση", "ο σταθμισμένος μέσος"], correct: 2,
      hint: R`Ποιο μετράει πόσο «απλώνονται» οι τιμές;`,
      sol: R`Μέτρα διασποράς: εύρος, διακύμανση, <b>τυπική απόκλιση</b>. Τα υπόλοιπα είναι μέτρα θέσης.` },
    { level: 2, type: "fields", q: R`Αριθμός παιδιών ($x_i$) σε 32 οικογένειες: 0 → 5, 1 → 10, 2 → 7, 3 → 4, 4 → 3, 5 → 2, 6 → 1 οικογένειες. Να βρείτε τη μέση τιμή, τη διακύμανση και την τυπική απόκλιση.`,
      fields: [{ label: "x̄ =", ans: 2 }, { label: "s² =", ans: 2.5 }, { label: "s ≈", ans: 1.58, tol: 0.004 }],
      hint: R`$\bar x = \frac{\sum f_ix_i}{32}$, μετά $s^2 = \frac{\sum f_i(x_i - \bar x)^2}{32}$.`,
      sol: R`$\sum f_ix_i = 0 + 10 + 14 + 12 + 12 + 10 + 6 = 64$, $\bar x = 2$.<br>$\sum f_i(x_i - 2)^2 = 5\cdot 4 + 10\cdot 1 + 0 + 4\cdot 1 + 3\cdot 4 + 2\cdot 9 + 1\cdot 16 = 80$, $s^2 = \frac{80}{32} = 2{,}5$, $s = \sqrt{2{,}5} \approx 1{,}58$.` },
    { level: 2, type: "fields", q: R`Οι βαθμοί 16 μαθητών: <b>8, 15, 13, 20, 9, 13, 17, 19, 20, 11, 10, 10, 15, 13, 14, 17</b>. Να βρείτε μέση τιμή, διάμεσο, επικρατούσα τιμή, εύρος και τυπική απόκλιση.`,
      fields: [{ label: "x̄ =", ans: 14 }, { label: "διάμεσος =", ans: 13.5 }, { label: "επικρατούσα =", ans: 13 }, { label: "εύρος =", ans: 12 }, { label: "s ≈", ans: 3.72, tol: 0.003 }],
      hint: R`Άθροισμα 224. Βάλε τις τιμές σε σειρά: η διάμεσος είναι ο μέσος όρος της 8ης και 9ης.`,
      sol: R`$\bar x = \frac{224}{16} = 14$. Σε σειρά: 8, 9, 10, 10, 11, 13, 13, 13, 14, 15, 15, 17, 17, 19, 20, 20 ⇒ διάμεσος $\frac{13 + 14}{2} = 13{,}5$, επικρατούσα $13$, εύρος $20 - 8 = 12$.<br>$\sum(x_i - 14)^2 = 222$, $s^2 = \frac{222}{16} = 13{,}875$, $s \approx 3{,}72$.` },
    { level: 2, type: "mc", q: R`Στα προηγούμενα δεδομένα, ένας μαθητής έγραψε κατά λάθος $1$ και $1$ αντί για $17$ και $17$. Τι από τα πιο κάτω <b>δεν</b> αλλάζει;`,
      options: ["η μέση τιμή", "η επικρατούσα τιμή", "το εύρος", "η τυπική απόκλιση"], correct: 1,
      hint: R`Ποια τιμή εμφανίζεται συχνότερα, πριν και μετά;`,
      sol: R`Νέα μέση τιμή $\frac{224 - 34 + 2}{16} = 12$, εύρος $20 - 1 = 19$, μεγαλύτερη $s$ ($\approx 5{,}47$), διάμεσος $13$. Η <b>επικρατούσα</b> μένει $13$.` },
    { level: 1, type: "fields", q: R`Να βρείτε τη διακύμανση και την τυπική απόκλιση των τιμών $2, 4, 4, 4, 5, 5, 7, 9$.`,
      fields: [{ label: "x̄ =", ans: 5 }, { label: "s² =", ans: 4 }, { label: "s =", ans: 2 }],
      hint: R`Αποκλίσεις από το 5: $-3, -1, -1, -1, 0, 0, 2, 4$.`,
      sol: R`$\bar x = \frac{40}{8} = 5$. Τετράγωνα αποκλίσεων: $9 + 1 + 1 + 1 + 0 + 0 + 4 + 16 = 32$, $s^2 = 4$, $s = 2$.` },
    { level: 2, type: "mc", q: R`Προσθέτουμε $5$ σε κάθε τιμή ενός συνόλου δεδομένων. Τι συμβαίνει;`,
      options: ["η μέση τιμή και η $s$ αυξάνονται κατά 5", "η μέση τιμή αυξάνεται κατά 5, η $s$ μένει ίδια", "μένουν και τα δύο ίδια", "η $s$ αυξάνεται κατά 5"], correct: 1,
      hint: R`Οι αποκλίσεις $x_i - \bar x$ αλλάζουν;`,
      sol: R`Όλες οι τιμές και η μέση τιμή μετατοπίζονται κατά 5, άρα οι αποκλίσεις $x_i - \bar x$ μένουν ίδιες: η $s$ δεν αλλάζει.` }
  ]
}
];

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

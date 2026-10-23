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
  storeKey: "pagk-b-kat-meros-b-v1",
  heroTitle: "Μαθηματικά Β΄ Λυκείου Κατεύθυνσης — Μέρος Β (Β΄ τετράμηνο)",
  tefxos: "Β΄ τετραμήνου",
  howto: `<ul><li>Κλάσματα: <code>5/2</code> · δεκαδικά: <code>2,5</code> · ρίζες: <code>√3/2</code> · π: <code>π/3</code></li>
    <li>Παράγωγοι: γράψε τον τύπο, π.χ. <code>3cos(3x)</code>, <code>συν3x</code>, <code>e^x(x+1)</code>, <code>1/x</code>, <code>ln x</code> — ελέγχεται αν είναι ισοδύναμος με τον σωστό</li>
    <li>Ακρίβεια: όπου ζητείται προσέγγιση, δεκτή μικρή απόκλιση</li></ul>`
};

const UNITS = [
  { id: 6, title: "Ενότητα 6 · Ακολουθίες" },
  { id: 7, title: "Ενότητα 7 · Γεωμετρικοί τόποι" },
  { id: 8, title: "Ενότητα 8 · Εκθετική και λογαριθμική συνάρτηση" },
  { id: 9, title: "Ενότητα 9 · Πολύγωνα – Μέτρηση κύκλου" },
  { id: 10, title: "Ενότητα 10 · Παράγωγος" },
  { id: 12, title: "Ενότητα 12 · Στατιστική" }
];









const SECTIONS = [
/* ───────────────────────────── 6.5.1 ───────────────────────────── */
{
  id: "6.5.1", unit: 6, title: "Αριθμητική πρόοδος",
  book: "Β΄ Τεύχος §6.5.1 · Δραστηριότητες σελ. 101",
  theory: R`
<div class="tbox"><h4>Ορισμός και γενικός όρος</h4>
<p>Αριθμητική πρόοδος (Α.Π.): κάθε όρος προκύπτει από τον προηγούμενο <b>προσθέτοντας</b> τον ίδιο αριθμό $\delta$ (διαφορά): $\alpha_{\nu+1} = \alpha_\nu + \delta$, δηλαδή $\alpha_{\nu+1} - \alpha_\nu = \delta$.</p>
$$\alpha_\nu = \alpha_1 + (\nu - 1)\delta$$
<p>$\delta > 0$: γνησίως αύξουσα, $\delta < 0$: γνησίως φθίνουσα, $\delta = 0$: σταθερή.</p></div>

<div class="tbox"><h4>Αριθμητικός μέσος</h4>
<p>Οι $\alpha, \beta, \gamma$ είναι διαδοχικοί όροι Α.Π. $\iff 2\beta = \alpha + \gamma$, δηλαδή $\beta = \frac{\alpha + \gamma}{2}$.</p></div>

<div class="tbox tip"><h4>Άθροισμα των $\nu$ πρώτων όρων</h4>
$$\Sigma_\nu = \frac{\nu}{2}(\alpha_1 + \alpha_\nu) = \frac{\nu}{2}\big[2\alpha_1 + (\nu - 1)\delta\big]$$
<p>Για δύο όρους $\alpha_\kappa$, $\alpha_\lambda$: $\ \alpha_\lambda - \alpha_\kappa = (\lambda - \kappa)\delta$ — έτσι βρίσκουμε γρήγορα το $\delta$.</p></div>`,
  widget: "seqap",
  gen: "gap",
  exercises: [
    { level: 1, type: "fields", q: R`Σε Α.Π. είναι $\alpha_1 = -2$ και $\delta = 3$. Να βρείτε τους $\alpha_{10}$ και $\alpha_{101}$.`,
      fields: [{ label: "α₁₀ =", ans: 25 }, { label: "α₁₀₁ =", ans: 298 }],
      hint: R`$\alpha_\nu = \alpha_1 + (\nu - 1)\delta$.`,
      sol: R`$\alpha_{10} = -2 + 9\cdot 3 = 25$, $\ \alpha_{101} = -2 + 100\cdot 3 = 298$.` },
    { level: 1, type: "fields", q: R`Να βρείτε τον $18$ο όρο της Α.Π. $3, -2, -7, -12, \dots$`,
      fields: [{ label: "α₁₈ =", ans: -82 }],
      hint: R`$\delta = -5$.`,
      sol: R`$\alpha_{18} = 3 + 17\cdot(-5) = -82$.` },
    { level: 2, type: "fields", q: R`Α.Π. έχει τρίτο όρο $13$ και όγδοο όρο $43$. Να βρείτε τα $\delta$ και $\alpha_1$.`,
      fields: [{ label: "δ =", ans: 6 }, { label: "α₁ =", ans: 1 }],
      hint: R`$\alpha_8 - \alpha_3 = 5\delta$.`,
      sol: R`$5\delta = 30 \Rightarrow \delta = 6$, $\alpha_1 = 13 - 2\cdot 6 = 1$. Πρόοδος: $1, 7, 13, 19, 25, \dots$` },
    { level: 2, type: "fields", q: R`Να παρεμβάλετε μεταξύ των $10$ και $108$ δεκατρείς αριθμούς ώστε όλοι μαζί να αποτελούν Α.Π. Ποια είναι η διαφορά;`,
      fields: [{ label: "δ =", ans: 7 }],
      hint: R`Συνολικά $15$ όροι: $\alpha_1 = 10$, $\alpha_{15} = 108$.`,
      sol: R`$108 = 10 + 14\delta \Rightarrow \delta = 7$: $10, 17, 24, \dots, 108$.` },
    { level: 1, type: "fields", q: R`Να βρείτε τον αριθμητικό μέσο των $-3$ και $26$.`,
      fields: [{ label: "β =", ans: "23/2" }],
      hint: R`$\beta = \frac{\alpha + \gamma}{2}$.`,
      sol: R`$\beta = \frac{-3 + 26}{2} = \frac{23}{2}$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το $x$ ώστε οι $x - 4$, $2x - 3$, $4x + 5$ να είναι διαδοχικοί όροι Α.Π.`,
      fields: [{ label: "x =", ans: -7 }],
      hint: R`$2(2x - 3) = (x - 4) + (4x + 5)$.`,
      sol: R`$4x - 6 = 5x + 1 \Rightarrow x = -7$. Όροι: $-11, -17, -23$ ($\delta = -6$).` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το άθροισμα των $12$ πρώτων όρων Α.Π. με $\alpha_1 = 5$ και $\delta = 6$.`,
      fields: [{ label: "Σ₁₂ =", ans: 456 }],
      hint: R`$\Sigma_\nu = \frac\nu2[2\alpha_1 + (\nu - 1)\delta]$.`,
      sol: R`$\Sigma_{12} = 6(10 + 66) = 456$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το άθροισμα των $20$ πρώτων όρων Α.Π. με $\alpha_1 = -2$ και $\alpha_8 = 19$.`,
      fields: [{ label: "Σ₂₀ =", ans: 530 }],
      hint: R`Πρώτα $\delta$: $19 = -2 + 7\delta$.`,
      sol: R`$\delta = 3$, $\alpha_{20} = -2 + 57 = 55$, $\Sigma_{20} = 10(-2 + 55) = 530$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το άθροισμα $8 + 11 + 14 + \dots + 158$.`,
      fields: [{ label: "πλήθος όρων ν =", ans: 51 }, { label: "άθροισμα =", ans: 4233 }],
      hint: R`$158 = 8 + (\nu - 1)\cdot 3$.`,
      sol: R`$\nu - 1 = 50 \Rightarrow \nu = 51$. $\Sigma = \frac{51}{2}(8 + 158) = 51\cdot 83 = 4233$.` },
    { level: 3, type: "fields", q: R`Μαθητές παρατάσσονται σε τρίγωνο: $1$ μαθητής στην πρώτη σειρά και κάθε επόμενη σειρά έχει $2$ περισσότερους. Στην τελευταία σειρά είναι $99$ μαθητές. Πόσες σειρές σχηματίστηκαν και πόσοι είναι όλοι οι μαθητές;`,
      fields: [{ label: "σειρές =", ans: 50 }, { label: "μαθητές =", ans: 2500 }],
      hint: R`Α.Π. $1, 3, 5, \dots, 99$.`,
      sol: R`$99 = 1 + 2(\nu - 1) \Rightarrow \nu = 50$. $\Sigma_{50} = 25(1 + 99) = 2500$.` },
    { level: 3, type: "fields", q: R`Σε Α.Π. ισχύουν $\alpha_1 + \alpha_2 + \alpha_3 = 9$ και $\alpha_6 - \alpha_5 - \alpha_4 = 2$. Να βρείτε τα $\alpha_1$ και $\delta$.`,
      fields: [{ label: "α₁ =", ans: 8 }, { label: "δ =", ans: -5 }],
      hint: R`Γράψε όλους τους όρους με $\alpha_1$ και $\delta$.`,
      sol: R`$3\alpha_1 + 3\delta = 9 \Rightarrow \alpha_1 + \delta = 3$. $\ \alpha_6 - \alpha_5 - \alpha_4 = \delta - (\alpha_1 + 3\delta) = -\alpha_1 - 2\delta = 2$. Προσθέτοντας: $-\delta = 5 \Rightarrow \delta = -5$, $\alpha_1 = 8$. Πρόοδος: $8, 3, -2, -7, -12, -17, \dots$` }
  ]
},
/* ───────────────────────────── 6.5.2 ───────────────────────────── */
{
  id: "6.5.2", unit: 6, title: "Γεωμετρική πρόοδος",
  book: "Β΄ Τεύχος §6.5.2 · Δραστηριότητες σελ. 110–111",
  theory: R`
<div class="tbox"><h4>Ορισμός και γενικός όρος</h4>
<p>Γεωμετρική πρόοδος (Γ.Π.): ακολουθία <b>μη μηδενικών</b> όρων όπου κάθε όρος προκύπτει από τον προηγούμενο <b>πολλαπλασιάζοντας</b> με τον ίδιο αριθμό $\lambda \ne 0$ (λόγος): $\alpha_{\nu+1} = \lambda\alpha_\nu$, δηλαδή $\frac{\alpha_{\nu+1}}{\alpha_\nu} = \lambda$.</p>
$$\alpha_\nu = \alpha_1\lambda^{\nu - 1}$$</div>

<div class="tbox"><h4>Γεωμετρικός μέσος</h4>
<p>Οι μη μηδενικοί $\alpha, \beta, \gamma$ είναι διαδοχικοί όροι Γ.Π. $\iff \beta^2 = \alpha\gamma$.</p></div>

<div class="tbox tip"><h4>Αθροίσματα</h4>
$$\Sigma_\nu = \alpha_1\frac{\lambda^\nu - 1}{\lambda - 1}\quad(\lambda \ne 1) \qquad \Sigma_\nu = \nu\alpha_1\quad(\lambda = 1)$$
<p><b>Άθροισμα άπειρων όρων</b>: αν $|\lambda| < 1$, οι όροι τείνουν στο $0$ και</p>
$$\Sigma_\infty = \frac{\alpha_1}{1 - \lambda}$$
<p>Για $|\lambda| \ge 1$ (και $\alpha_1 \ne 0$) δεν ορίζεται άθροισμα άπειρων όρων.</p></div>`,
  widget: "seqgp",
  gen: "ggp",
  exercises: [
    { level: 1, type: "fields", q: R`Σε Γ.Π. είναι $\alpha_1 = -1$ και $\lambda = 3$. Να βρείτε τους $\alpha_5$ και $\alpha_{10}$.`,
      fields: [{ label: "α₅ =", ans: -81 }, { label: "α₁₀ =", ans: -19683 }],
      hint: R`$\alpha_\nu = \alpha_1\lambda^{\nu - 1}$.`,
      sol: R`$\alpha_5 = -3^4 = -81$, $\ \alpha_{10} = -3^9 = -19683$.` },
    { level: 2, type: "fields", q: R`Γ.Π. έχει $\alpha_2 = 1$ και $\alpha_4 = 16$. Αν ο λόγος είναι θετικός, να βρείτε τα $\lambda$ και $\alpha_1$.`,
      fields: [{ label: "λ =", ans: 4 }, { label: "α₁ =", ans: "1/4" }],
      hint: R`$\frac{\alpha_4}{\alpha_2} = \lambda^2$.`,
      sol: R`$\lambda^2 = 16 \Rightarrow \lambda = 4$ (θετικός), $\alpha_1 = \frac{\alpha_2}{\lambda} = \frac14$. (Με $\lambda = -4$ θα είχαμε $\alpha_1 = -\frac14$.)` },
    { level: 2, type: "fields", q: R`Να βρείτε το $\kappa$ ώστε οι $\kappa$, $\kappa + 4$, $18$ να είναι διαδοχικοί όροι Γ.Π.`,
      fields: [{ label: "κ₁ (μικρότερη) =", ans: 2 }, { label: "κ₂ =", ans: 8 }],
      hint: R`$(\kappa + 4)^2 = 18\kappa$.`,
      sol: R`$\kappa^2 + 8\kappa + 16 = 18\kappa \Rightarrow \kappa^2 - 10\kappa + 16 = 0 \Rightarrow \kappa = 2$ ($2, 6, 18$) ή $\kappa = 8$ ($8, 12, 18$).` },
    { level: 2, type: "fields", q: R`Ποιον αριθμό πρέπει να προσθέσουμε σε καθέναν από τους $-1$, $1$, $7$ ώστε να γίνουν διαδοχικοί όροι Γ.Π.;`,
      fields: [{ label: "x =", ans: 2 }],
      hint: R`$(1 + x)^2 = (x - 1)(x + 7)$.`,
      sol: R`$1 + 2x + x^2 = x^2 + 6x - 7 \Rightarrow x = 2$. Όροι: $1, 3, 9$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το άθροισμα των $7$ πρώτων όρων της Γ.Π. $2, 6, 18, 54, \dots$`,
      fields: [{ label: "Σ₇ =", ans: 2186 }],
      hint: R`$\alpha_1 = 2$, $\lambda = 3$.`,
      sol: R`$\Sigma_7 = 2\cdot\frac{3^7 - 1}{3 - 1} = 3^7 - 1 = 2186$.` },
    { level: 2, type: "fields", q: R`Γ.Π. έχει $\lambda = 5$ και $\Sigma_4 = 468$. Να βρείτε τον $\alpha_1$.`,
      fields: [{ label: "α₁ =", ans: 3 }],
      hint: R`$\Sigma_4 = \alpha_1\frac{5^4 - 1}{4} = 156\alpha_1$.`,
      sol: R`$156\alpha_1 = 468 \Rightarrow \alpha_1 = 3$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το άθροισμα $3 + 6 + 12 + 24 + \dots + 192$.`,
      fields: [{ label: "άθροισμα =", ans: 381 }],
      hint: R`$192 = 3\cdot 2^{\nu - 1}$.`,
      sol: R`$2^{\nu - 1} = 64 \Rightarrow \nu = 7$. $\Sigma_7 = 3(2^7 - 1) = 381$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε τα αθροίσματα των άπειρων όρων: (α) $\frac13 + \frac19 + \frac{1}{27} + \dots$, (β) $2 + \frac65 + \frac{18}{25} + \frac{54}{125} + \dots$`,
      fields: [{ label: "(α) =", ans: "1/2" }, { label: "(β) =", ans: 5 }],
      hint: R`(α) $\lambda = \frac13$, (β) $\lambda = \frac35$.`,
      sol: R`(α) $\frac{1/3}{1 - 1/3} = \frac12$. (β) $\frac{2}{1 - 3/5} = 5$.` },
    { level: 2, type: "fields", q: R`Γ.Π. έχει άθροισμα άπειρων όρων διπλάσιο από τον πρώτο της όρο. Να βρείτε τον λόγο της.`,
      fields: [{ label: "λ =", ans: "1/2" }],
      hint: R`$\frac{\alpha_1}{1 - \lambda} = 2\alpha_1$.`,
      sol: R`$\frac{1}{1 - \lambda} = 2 \Rightarrow \lambda = \frac12$ (και $|\lambda| < 1$ ✓).` },
    { level: 3, type: "fields", q: R`Σε Γ.Π. με <b>θετικό</b> λόγο ισχύουν $\alpha_1 + \alpha_2 = 3$ και $\alpha_3 + \alpha_4 = 6$. Να βρείτε τον λόγο και το $\Sigma_7$.`,
      fields: [{ label: "λ =", ans: "√2", tol: 0.0005 }, { label: "Σ₇ =", ans: "24√2-3", tol: 0.0005 }],
      hint: R`$\alpha_3 + \alpha_4 = \lambda^2(\alpha_1 + \alpha_2)$.`,
      sol: R`$\lambda^2 = 2 \Rightarrow \lambda = \sqrt2$. $\alpha_1(1 + \sqrt2) = 3$. $\Sigma_7 = \alpha_1\frac{\lambda^7 - 1}{\lambda - 1} = \frac{3}{1 + \sqrt2}\cdot\frac{8\sqrt2 - 1}{\sqrt2 - 1} = 3(8\sqrt2 - 1) = 24\sqrt2 - 3$ (αφού $(\sqrt2 + 1)(\sqrt2 - 1) = 1$).` },
    { level: 1, type: "mc", q: R`Η σταθερή ακολουθία $2, 2, 2, 2, \dots$:`,
      options: ["είναι και Α.Π. ($\\delta = 0$) και Γ.Π. ($\\lambda = 1$)", "είναι μόνο Α.Π.", "είναι μόνο Γ.Π.", "δεν είναι ούτε Α.Π. ούτε Γ.Π."], correct: 0,
      hint: R`Τι προσθέτουμε/με τι πολλαπλασιάζουμε κάθε φορά;`,
      sol: R`$\alpha_{\nu+1} = \alpha_\nu + 0$ και $\alpha_{\nu+1} = 1\cdot\alpha_\nu$ (μη μηδενικοί όροι): και τα δύο.` }
  ]
},
/* ───────────────────────────── 7 ───────────────────────────── */
{
  id: "7", unit: 7, title: "Γεωμετρικοί τόποι",
  book: "Β΄ Τεύχος §7.1–7.3 · Δραστηριότητες σελ. 129, 131–132",
  theory: R`
<div class="tbox"><h4>Η έννοια</h4>
<p><b>Γεωμετρικός τόπος</b> λέγεται κάθε σύνολο σημείων $G$ του οποίου <b>όλα τα σημεία και μόνο αυτά</b> έχουν μια δεδομένη ιδιότητα $I$.</p>
<p><b>Μέθοδος:</b> (1) <i>Πιθανολόγηση</i>: σχεδιάζουμε μερικά σημεία και μαντεύουμε τη γραμμή. (2) <i>Απόδειξη</i>: κάθε σημείο με την ιδιότητα ανήκει στη γραμμή. (3) <i>Αντίστροφο</i>: κάθε σημείο της γραμμής έχει την ιδιότητα. (4) <i>Διερεύνηση</i>: μήπως ο τόπος είναι μόνο μέρος της γραμμής;</p></div>

<div class="tbox"><h4>Βασικοί γεωμετρικοί τόποι</h4>
<ul><li>Σημεία σε σταθερή απόσταση $R$ από σημείο $O$: <b>κύκλος</b> $(O, R)$.</li>
<li>Σημεία που ισαπέχουν από $A$ και $B$: η <b>μεσοκάθετος</b> του $AB$.</li>
<li>Σημεία στο εσωτερικό γωνίας που ισαπέχουν από τις πλευρές: η <b>διχοτόμος</b>.</li>
<li>Σημεία που ισαπέχουν από δύο παράλληλες: η <b>μεσοπαράλληλος</b>.</li>
<li>Σημεία σε απόσταση $d$ από ευθεία $(\varepsilon)$: <b>δύο παράλληλες</b> προς την $(\varepsilon)$ σε απόσταση $d$.</li></ul></div>

<div class="tbox tip"><h4>Χαρακτηριστικά παραδείγματα</h4>
<p>Μέσα των ακτίνων κύκλου $(O, \rho)$: κύκλος $\left(O, \frac\rho2\right)$. Κέντρα κύκλων που περνούν από $A$, $B$: μεσοκάθετος του $AB$. Μέσο $M$ τμήματος $AB = \lambda$ με $A \in Ox$, $B \in Oy$ (θετικοί ημιάξονες): τόξο κύκλου $\left(O, \frac\lambda2\right)$, αφού $OM = \frac{AB}{2}$ (διάμεσος ορθογωνίου τριγώνου).</p></div>`,
  widget: "locus",
  exercises: [
    { level: 1, type: "mc", q: R`Ο γεωμετρικός τόπος των σημείων που ισαπέχουν από δύο σταθερά σημεία $A$ και $B$ είναι:`,
      options: ["η μεσοκάθετος του $AB$", "ο κύκλος με διάμετρο $AB$", "η ευθεία $AB$", "η διχοτόμος"], correct: 0,
      hint: R`$MA = MB$.`, sol: R`Η μεσοκάθετος του τμήματος $AB$.` },
    { level: 1, type: "fields", q: R`Δίνεται κύκλος $(O, 6\text{ cm})$. Ο γεωμετρικός τόπος των μέσων $M$ των ακτίνων του είναι κύκλος με κέντρο $O$ και ακτίνα;`,
      fields: [{ label: "ακτίνα (cm) =", ans: 3 }],
      hint: R`$OM = \frac{ON}{2}$.`, sol: R`$OM = \frac\rho2 = 3$ cm: κύκλος $(O, 3)$.` },
    { level: 1, type: "mc", q: R`Ο γεωμετρικός τόπος των κέντρων των κύκλων που διέρχονται από δύο σταθερά σημεία $A$, $B$ είναι:`,
      options: ["η μεσοκάθετος του $AB$", "το μέσο του $AB$", "ο κύκλος διαμέτρου $AB$", "η ευθεία $AB$"], correct: 0,
      hint: R`Το κέντρο $K$ απέχει ίσο από $A$ και $B$.`, sol: R`$KA = KB$ (ακτίνες), άρα το $K$ είναι στη μεσοκάθετο· και αντίστροφα κάθε σημείο της είναι κέντρο τέτοιου κύκλου.` },
    { level: 2, type: "fields", q: R`Στους θετικούς ημιάξονες $Ox$, $Oy$ κινούνται $A$, $B$ με $AB = 10$. Ο γεωμετρικός τόπος του μέσου $M$ του $AB$ είναι τόξο κύκλου με κέντρο $O$. Ποια είναι η ακτίνα του;`,
      fields: [{ label: "ακτίνα =", ans: 5 }],
      hint: R`Διάμεσος προς την υποτείνουσα.`, sol: R`Στο ορθογώνιο τρίγωνο $AOB$: $OM = \frac{AB}{2} = 5$.` },
    { level: 2, type: "mc", q: R`Ευθεία $(\varepsilon)$ και σημείο $A$ εκτός αυτής σε απόσταση $8$. Το $B$ κινείται στην $(\varepsilon)$. Ο τόπος του μέσου $M$ του $AB$ είναι:`,
      options: ["ευθεία παράλληλη στην $(\\varepsilon)$ σε απόσταση $4$ από αυτήν", "κύκλος κέντρου $A$", "η κάθετη από το $A$ στην $(\\varepsilon)$", "ευθεία παράλληλη σε απόσταση $8$"], correct: 0,
      hint: R`Θεώρημα μέσων στο τρίγωνο.`, sol: R`Το $M$ απέχει από την $(\varepsilon)$ το μισό της απόστασης του $A$: $4$. Τόπος: η παράλληλη (από την πλευρά του $A$) σε απόσταση $4$.` },
    { level: 2, type: "fields", q: R`Δύο τεμνόμενες ευθείες $\varepsilon_1$, $\varepsilon_2$. Πόσα σημεία του επιπέδου απέχουν $2$ cm από την $\varepsilon_1$ και ταυτόχρονα $3$ cm από την $\varepsilon_2$;`,
      fields: [{ label: "πλήθος =", ans: 4 }],
      hint: R`Τομή δύο ζευγών παραλλήλων.`, sol: R`Δύο παράλληλες στην $\varepsilon_1$ τέμνουν δύο παράλληλες στην $\varepsilon_2$ σε $2 \cdot 2 = 4$ σημεία.` },
    { level: 2, type: "mc", q: R`Κύκλος $(O, \rho)$, $N$ τυχαίο σημείο του και $M$ στην προέκταση της $ON$ με $ON = NM$. Ο τόπος του $M$ είναι:`,
      options: ["ο κύκλος $(O, 2\\rho)$", "ο κύκλος $(N, \\rho)$", "η εφαπτομένη στο $N$", "ο κύκλος $(O, \\frac\\rho2)$"], correct: 0,
      hint: R`$OM = ON + NM$.`, sol: R`$OM = 2\rho$ σταθερό: κύκλος $(O, 2\rho)$.` },
    { level: 3, type: "fields", q: R`Κύκλος κέντρου $O$ και ακτίνας $4$ και σημείο $A$ με $OA = 10$. Το $B$ κινείται στον κύκλο. Ο τόπος του μέσου $M$ του $AB$ είναι κύκλος. Πόση είναι η ακτίνα του και πόση η απόσταση του κέντρου του από το $O$;`,
      fields: [{ label: "ακτίνα =", ans: 2 }, { label: "απόσταση κέντρου από O =", ans: 5 }],
      hint: R`Αν $K$ το μέσο του $OA$, τότε $KM = \frac{OB}{2}$.`, sol: R`Στο τρίγωνο $AOB$, το $KM$ ενώνει μέσα πλευρών: $KM = \frac{OB}{2} = 2$. Τόπος: κύκλος $(K, 2)$ με $OK = 5$.` }
  ]
},
/* ───────────────────────────── 8.1 ───────────────────────────── */
{
  id: "8.1", unit: 8, title: "Εκθετική συνάρτηση",
  book: "Β΄ Τεύχος §8.1.1–8.1.4 · Δραστηριότητες σελ. 160",
  theory: R`
<div class="tbox"><h4>Δυνάμεις με πραγματικό εκθέτη</h4>
<p>Για $\alpha > 0$ η δύναμη $\alpha^x$ ορίζεται για κάθε πραγματικό $x$ — και για άρρητο, π.χ. $2^{\sqrt3}$ (προσεγγίζεται από $2^{1{,}7}, 2^{1{,}73}, 2^{1{,}732}, \dots$). Ισχύουν όλες οι γνωστές ιδιότητες: $\alpha^x\alpha^y = \alpha^{x+y}$, $\ \frac{\alpha^x}{\alpha^y} = \alpha^{x-y}$, $\ (\alpha^x)^y = \alpha^{xy}$, $\ \alpha^{-x} = \frac{1}{\alpha^x}$.</p></div>

<div class="tbox"><h4>Εκθετική συνάρτηση</h4>
<p>$f(x) = \alpha^x$ με $\alpha > 0$, $\alpha \ne 1$. Πεδίο ορισμού $\mathbb{R}$, σύνολο τιμών $(0, +\infty)$.</p>
<ul><li>$\alpha > 1$: <b>γνησίως αύξουσα</b>. $\ 0 < \alpha < 1$: <b>γνησίως φθίνουσα</b>.</li>
<li>Η γραφική παράσταση περνά από τα $(0, 1)$ και $(1, \alpha)$ και έχει τον $x'x$ ως οριζόντια ασύμπτωτη.</li>
<li>Είναι 1–1: $\ \alpha^{x_1} = \alpha^{x_2} \iff x_1 = x_2$.</li>
<li>Οι $y = \alpha^x$ και $y = \left(\frac1\alpha\right)^x = \alpha^{-x}$ είναι συμμετρικές ως προς τον $y'y$.</li></ul>
<p>Ο αριθμός $e \approx 2{,}718$ δίνει τη «φυσική» εκθετική συνάρτηση $y = e^x$.</p></div>
<div class="tbox"><h4>Ο αριθμός $e$ και η $f(x) = e^x$</h4>
<p>Καθώς το $\nu$ μεγαλώνει, ο αριθμός $\left(1 + \frac1\nu\right)^\nu$ πλησιάζει τον άρρητο αριθμό $e \approx 2{,}71828$. Η εκθετική συνάρτηση με βάση $e$, $f(x) = e^x$, είναι γνησίως αύξουσα (αφού $e > 1$), με σύνολο τιμών $(0, +\infty)$, και περνά από το $(0, 1)$. Είναι η πιο σημαντική εκθετική συνάρτηση (συνεχής ανατοκισμός, ανάπτυξη, απόσβεση).</p></div>`,
  widget: "expfun",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια από τις πιο κάτω είναι εκθετική συνάρτηση;`,
      options: ["$f(x) = x^3$", "$f(x) = 4^x$", "$f(x) = (-10)^x$", "$f(x) = 1^x$"], correct: 1,
      hint: R`Βάση θετική και διάφορη του $1$, μεταβλητή στον εκθέτη.`,
      sol: R`Η $4^x$. Η $x^3$ είναι πολυωνυμική, η $(-10)^x$ έχει αρνητική βάση και η $1^x = 1$ είναι σταθερή.` },
    { level: 1, type: "fields", q: R`Δίνεται $f(x) = 3^x$. Να υπολογίσετε τα $f(0)$, $f(2)$, $f(-3)$.`,
      fields: [{ label: "f(0) =", ans: 1 }, { label: "f(2) =", ans: 9 }, { label: "f(−3) =", ans: "1/27" }],
      hint: R`$3^{-3} = \frac{1}{3^3}$.`,
      sol: R`$f(0) = 1$, $f(2) = 9$, $f(-3) = \frac{1}{27}$.` },
    { level: 2, type: "fields", q: R`Η γραφική παράσταση της $f(x) = \alpha^x$ διέρχεται από το σημείο $A(-2, 4)$. Να βρείτε το $\alpha$.`,
      fields: [{ label: "α =", ans: "1/2" }],
      hint: R`$\alpha^{-2} = 4 \Rightarrow \alpha^2 = \frac14$ και $\alpha > 0$.`,
      sol: R`$\frac{1}{\alpha^2} = 4 \Rightarrow \alpha^2 = \frac14 \Rightarrow \alpha = \frac12$ (αφού $\alpha > 0$).` },
    { level: 2, type: "fields", q: R`Η γραφική παράσταση της $f(x) = 5\cdot\alpha^x$ διέρχεται από το $A(3, 135)$. Να βρείτε το $\alpha$.`,
      fields: [{ label: "α =", ans: 3 }],
      hint: R`$5\alpha^3 = 135$.`,
      sol: R`$\alpha^3 = 27 \Rightarrow \alpha = 3$.` },
    { level: 2, type: "fields", q: R`Η $f(x) = \alpha\cdot\beta^x$ διέρχεται από τα σημεία $A(0, 3)$ και $B(2, 12)$. Να βρείτε τα $\alpha$, $\beta$ ($\beta > 0$).`,
      fields: [{ label: "α =", ans: 3 }, { label: "β =", ans: 2 }],
      hint: R`$f(0) = \alpha$.`,
      sol: R`$f(0) = \alpha\cdot 1 = 3$. $f(2) = 3\beta^2 = 12 \Rightarrow \beta^2 = 4 \Rightarrow \beta = 2$.` },
    { level: 1, type: "mc", q: R`Η συνάρτηση $f(x) = \left(\frac23\right)^x$ είναι:`,
      options: ["γνησίως αύξουσα", "γνησίως φθίνουσα", "σταθερή", "ούτε αύξουσα ούτε φθίνουσα"], correct: 1,
      hint: R`Η βάση είναι μεταξύ $0$ και $1$.`,
      sol: R`$0 < \frac23 < 1$, άρα γνησίως φθίνουσα.` },
    { level: 1, type: "mc", q: R`Οι γραφικές παραστάσεις των $f(x) = 4^x$ και $g(x) = 4^{-x}$ είναι:`,
      options: ["συμμετρικές ως προς τον άξονα $y'y$", "συμμετρικές ως προς τον άξονα $x'x$", "συμμετρικές ως προς την $y = x$", "ίδιες"], correct: 0,
      hint: R`$g(x) = f(-x)$.`,
      sol: R`Αφού $g(x) = f(-x)$, το σημείο $(x, y)$ της μίας αντιστοιχεί στο $(-x, y)$ της άλλης: συμμετρία ως προς τον $y'y$.` },
    { level: 2, type: "mc", q: R`Ποιος αριθμός είναι μεγαλύτερος;`,
      options: ["$2^{\\sqrt3}$", "$2^{1{,}7}$", "είναι ίσοι"], correct: 0,
      hint: R`$\sqrt3 \approx 1{,}732$ και η $2^x$ είναι γνησίως αύξουσα.`,
      sol: R`$\sqrt3 > 1{,}7$ και η $2^x$ είναι γνησίως αύξουσα, άρα $2^{\sqrt3} > 2^{1{,}7}$.` },
    { level: 3, type: "fields", q: R`Η $f(x) = \alpha\cdot\beta^x$ διέρχεται από τα $(0, 2)$ και $(1, 6)$. Να βρείτε τα $\alpha$, $\beta$ και την τιμή $f(-1)$.`,
      fields: [{ label: "α =", ans: 2 }, { label: "β =", ans: 3 }, { label: "f(−1) =", ans: "2/3" }],
      hint: R`Πρώτα $f(0)$.`,
      sol: R`$\alpha = 2$, $2\beta = 6 \Rightarrow \beta = 3$, $f(-1) = 2\cdot 3^{-1} = \frac23$.` },
{ level: 1, type: "fields", q: R`Να υπολογίσετε με υπολογιστική μηχανή (3 δεκαδικά) τα $\left(1 + \frac{1}{10}\right)^{10}$ και $\left(1 + \frac{1}{1000}\right)^{1000}$. Ποιον αριθμό πλησιάζουν;`,
      fields: [{ label: "ν = 10:", ans: 2.5937, tol: 0.0005 }, { label: "ν = 1000:", ans: 2.7169, tol: 0.0005 }],
      hint: R`Ο αριθμός $e \approx 2{,}718$.`,
      sol: R`$\approx 2{,}594$ και $\approx 2{,}717$ — πλησιάζουν τον $e \approx 2{,}71828$.` },
    { level: 1, type: "mc", q: R`Η συνάρτηση $f(x) = e^{-x}$, $x \in \mathbb{R}$, είναι:`,
      options: ["γνησίως φθίνουσα", "γνησίως αύξουσα", "σταθερή", "άρτια"], correct: 0,
      hint: R`$e^{-x} = \left(\frac1e\right)^x$ με $0 < \frac1e < 1$.`,
      sol: R`Βάση $\frac1e \in (0, 1)$: γνησίως φθίνουσα.` }
  ]
},
/* ───────────────────────────── 8.1.5 ───────────────────────────── */
{
  id: "8.1.5", unit: 8, title: "Εκθετικές εξισώσεις",
  book: "Β΄ Τεύχος §8.1.5 (εκτός ανισώσεων – συστημάτων)",
  theory: R`
<div class="tbox"><h4>Βασική ιδέα</h4>
<p>Αφού η $\alpha^x$ είναι 1–1 ($\alpha > 0$, $\alpha \ne 1$):</p>
$$\alpha^{f(x)} = \alpha^{g(x)} \iff f(x) = g(x)$$
<p>Γράφουμε τα δύο μέλη ως δυνάμεις <b>της ίδιας βάσης</b>: π.χ. $8 = 2^3$, $\frac19 = 3^{-2}$, $\sqrt5 = 5^{1/2}$, $100 = 10^2$.</p></div>

<div class="tbox tip"><h4>Τεχνικές</h4>
<ul><li><b>Αντικατάσταση</b>: $9^x - 12\cdot 3^x + 27 = 0$. Με $y = 3^x > 0$: $y^2 - 12y + 27 = 0$. Απορρίπτουμε αρνητικές τιμές του $y$ (αφού $3^x > 0$).</li>
<li><b>Κοινός παράγοντας</b>: $7^{x+1} - 7^x = 7^x(7 - 1)$.</li>
<li>Εξίσωση $\alpha^x = \kappa$ με $\kappa \le 0$: <b>αδύνατη</b>.</li>
<li>$A\cdot B = 0 \iff A = 0$ ή $B = 0$.</li></ul></div>`,
  gen: "gexpeq",
  exercises: [
    { level: 1, type: "fields", q: R`Να λύσετε τις εξισώσεις: (α) $5^x = 25$, (β) $2^{x - 3} = 8$.`,
      fields: [{ label: "(α) x =", ans: 2 }, { label: "(β) x =", ans: 6 }],
      hint: R`$25 = 5^2$, $8 = 2^3$.`,
      sol: R`(α) $5^x = 5^2 \Rightarrow x = 2$. (β) $x - 3 = 3 \Rightarrow x = 6$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $\left(\frac23\right)^{2x + 1} = \frac32$.`,
      fields: [{ label: "x =", ans: -1 }],
      hint: R`$\frac32 = \left(\frac23\right)^{-1}$.`,
      sol: R`$2x + 1 = -1 \Rightarrow x = -1$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $100^{2x + 4} = 1000^{x + 5}$.`,
      fields: [{ label: "x =", ans: 7 }],
      hint: R`Βάση $10$: $100 = 10^2$, $1000 = 10^3$.`,
      sol: R`$10^{4x + 8} = 10^{3x + 15} \Rightarrow 4x + 8 = 3x + 15 \Rightarrow x = 7$.` },
    { level: 1, type: "fields", q: R`Να λύσετε την εξίσωση $(3^x - 27)(5^x - 125) = 0$.`,
      fields: [{ label: "x =", ans: 3 }],
      hint: R`Μηδενίζεται ο ένας ή ο άλλος παράγοντας.`,
      sol: R`$3^x = 27 \Rightarrow x = 3$ ή $5^x = 125 \Rightarrow x = 3$. Μοναδική λύση $x = 3$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $9^x - 12\cdot 3^x + 27 = 0$.`,
      fields: [{ label: "x₁ (μικρότερη) =", ans: 1 }, { label: "x₂ =", ans: 2 }],
      hint: R`$9^x = (3^x)^2$. Θέσε $y = 3^x$.`,
      sol: R`$y^2 - 12y + 27 = 0 \Rightarrow y = 3$ ή $y = 9$. $3^x = 3 \Rightarrow x = 1$, $\ 3^x = 9 \Rightarrow x = 2$.` },
    { level: 3, type: "fields", q: R`Να λύσετε την εξίσωση $4^{x^2} = 2^{x + 3}$.`,
      fields: [{ label: "x₁ (μικρότερη) =", ans: -1 }, { label: "x₂ =", ans: "3/2" }],
      hint: R`$4^{x^2} = 2^{2x^2}$.`,
      sol: R`$2x^2 = x + 3 \Rightarrow 2x^2 - x - 3 = 0 \Rightarrow x = -1$ ή $x = \frac32$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $7^{x + 1} - 7^x = 42$.`,
      fields: [{ label: "x =", ans: 1 }],
      hint: R`Βγάλε κοινό παράγοντα το $7^x$.`,
      sol: R`$7^x(7 - 1) = 42 \Rightarrow 7^x = 7 \Rightarrow x = 1$.` },
    { level: 2, type: "mc", q: R`Αν $3^x = \kappa$, τότε η παράσταση $9^{x + 1}$ ισούται με:`,
      options: ["$9\\kappa^2$", "$9\\kappa$", "$3\\kappa^2$", "$\\kappa^2 + 9$"], correct: 0,
      hint: R`$9^{x + 1} = 9\cdot 9^x = 9\cdot(3^x)^2$.`,
      sol: R`$9^{x + 1} = 9\cdot(3^2)^x = 9\cdot(3^x)^2 = 9\kappa^2$.` },
    { level: 3, type: "mc", q: R`Η εξίσωση $25^x - 6\cdot 5^x + 5 = 0$ έχει λύσεις:`,
      options: ["$x = 0$ και $x = 1$", "$x = 1$ και $x = 5$", "μόνο $x = 1$", "είναι αδύνατη"], correct: 0,
      hint: R`Θέσε $y = 5^x$.`,
      sol: R`$y^2 - 6y + 5 = 0 \Rightarrow y = 1$ ή $y = 5$. $5^x = 1 \Rightarrow x = 0$, $\ 5^x = 5 \Rightarrow x = 1$.` }
  ]
},
/* ───────────────────────────── 8.1.6 ───────────────────────────── */
{
  id: "8.1.6", unit: 8, title: "Εφαρμογές εκθετικής συνάρτησης",
  book: "Β΄ Τεύχος §8.1.6",
  theory: R`
<div class="tbox"><h4>Ανατοκισμός</h4>
<p>Κεφάλαιο $K_0$ που ανατοκίζεται ετήσια με επιτόκιο $\varepsilon$ (ως δεκαδικός: $3\% = 0{,}03$) γίνεται μετά από $t$ χρόνια:</p>
$$K_t = K_0(1 + \varepsilon)^t$$</div>

<div class="tbox"><h4>Εκθετική αύξηση και μείωση</h4>
<ul><li>Πληθυσμός που <b>διπλασιάζεται</b> κάθε $T$ ώρες: $N(t) = N_0\cdot 2^{t/T}$.</li>
<li>Ποσότητα που <b>υποδιπλασιάζεται</b> κάθε $T$ (χρόνος ημιζωής): $N(t) = N_0\cdot\left(\frac12\right)^{t/T}$.</li>
<li>Γενικά $N(t) = N_0\cdot\alpha^{\kappa t}$ ή $N(t) = N_0\,e^{\kappa t}$ — η αρχική τιμή είναι $N(0) = N_0$.</li></ul></div>

<div class="tbox tip"><h4>Μέθοδος</h4>
<p>Βρίσκουμε την <b>αρχική τιμή</b> (για $t = 0$) και τι συμβαίνει σε <b>κάθε περίοδο</b> (πολλαπλασιασμός με σταθερό αριθμό). Υπολογισμοί με την υπολογιστική μηχανή, στρογγύλεμα στο τέλος.</p></div>`,
  widget: "growth",
  gen: "ganat",
  exercises: [
    { level: 1, type: "fields", q: R`Κάποιος καταθέτει $1000$ € με επιτόκιο $3\%$ τον χρόνο, που ανατοκίζεται ετήσια. Να υπολογίσετε το ποσό στο τέλος του 3ου και του 6ου χρόνου (2 δεκαδικά).`,
      fields: [{ label: "K₃ (€) =", ans: 1092.73, tol: 0.000006 }, { label: "K₆ (€) =", ans: 1194.05, tol: 0.000006 }],
      hint: R`$K_t = 1000\cdot 1{,}03^t$.`,
      sol: R`$K_3 = 1000\cdot 1{,}03^3 \approx 1092{,}73$ €, $\ K_6 = 1000\cdot 1{,}03^6 \approx 1194{,}05$ €.` },
    { level: 1, type: "fields", q: R`Κατάθεση $24\,000$ € με ετήσιο επιτόκιο $9\%$ ανατοκίζεται ετήσια. Να βρείτε το ποσό σε $5$ χρόνια (2 δεκαδικά).`,
      fields: [{ label: "K₅ (€) =", ans: 36926.97, tol: 0.0000002 }],
      hint: R`$K_5 = 24000\cdot 1{,}09^5$.`,
      sol: R`$K_5 = 24000\cdot 1{,}09^5 \approx 36\,926{,}97$ €.` },
    { level: 2, type: "fields", q: R`Ο πληθυσμός μιας χώρας (σε χιλιάδες) δίνεται από $P = 25 + 15\cdot 2^{t/24}$, όπου $t$ τα χρόνια μετά το 2015. Να βρείτε τον πληθυσμό το 2015 και το 2025 (σε χιλιάδες, 2 δεκαδικά).`,
      fields: [{ label: "2015 =", ans: 40 }, { label: "2025 =", ans: 45.02, tol: 0.0002 }],
      hint: R`2015: $t = 0$, 2025: $t = 10$.`,
      sol: R`$P(0) = 25 + 15 = 40$ χιλιάδες. $P(10) = 25 + 15\cdot 2^{10/24} \approx 25 + 15\cdot 1{,}335 \approx 45{,}02$ χιλιάδες.` },
    { level: 2, type: "fields", q: R`Η ποσότητα ενός φαρμάκου στο αίμα (σε mg) μετά από $t$ ώρες είναι $D(t) = 40e^{-0{,}3t}$. Πόσα mg χορηγήθηκαν αρχικά και πόσα απομένουν μετά από $5$ ώρες (2 δεκαδικά);`,
      fields: [{ label: "αρχικά =", ans: 40 }, { label: "μετά από 5 ώρες =", ans: 8.93, tol: 0.001 }],
      hint: R`Αρχικά: $t = 0$.`,
      sol: R`$D(0) = 40$ mg. $D(5) = 40e^{-1{,}5} \approx 40\cdot 0{,}2231 \approx 8{,}93$ mg.` },
    { level: 1, type: "fields", q: R`Ένας πληθυσμός βακτηρίων διπλασιάζεται κάθε $3$ ώρες. Αρχικά είναι $500$. Πόσα θα είναι μετά από $24$ ώρες;`,
      fields: [{ label: "N(24) =", ans: 128000 }],
      hint: R`Σε $24$ ώρες χωρούν $8$ διπλασιασμοί.`,
      sol: R`$N(t) = 500\cdot 2^{t/3}$, $\ N(24) = 500\cdot 2^8 = 128\,000$.` },
    { level: 2, type: "fields", q: R`Η αξία ενός αυτοκινήτου (σε €) είναι $P = 18000\cdot 3^{-t/10}$, $t$ σε χρόνια από την αγορά. Να βρείτε την αξία του μετά από $10$ και μετά από $20$ χρόνια.`,
      fields: [{ label: "P(10) =", ans: 6000 }, { label: "P(20) =", ans: 2000 }],
      hint: R`$3^{-1} = \frac13$, $3^{-2} = \frac19$.`,
      sol: R`$P(10) = 18000\cdot 3^{-1} = 6000$ €, $\ P(20) = 18000\cdot 3^{-2} = 2000$ €.` },
    { level: 2, type: "fields", q: R`Ένα ραδιενεργό υλικό έχει χρόνο ημιζωής $5$ χρόνια. Αρχικά υπάρχουν $80$ g. Πόσα γραμμάρια θα έχουν μείνει μετά από $15$ χρόνια;`,
      fields: [{ label: "g =", ans: 10 }],
      hint: R`$15$ χρόνια $= 3$ ημιζωές.`,
      sol: R`$N(t) = 80\cdot\left(\frac12\right)^{t/5}$, $\ N(15) = 80\cdot\frac18 = 10$ g.` },
    { level: 1, type: "mc", q: R`Ένας πληθυσμός με αρχικό μέγεθος $1000$ <b>τριπλασιάζεται κάθε ώρα</b>. Ποιο μοντέλο τον περιγράφει ($t$ σε ώρες);`,
      options: ["$N(t) = 1000\\cdot 3^t$", "$N(t) = 1000 + 3t$", "$N(t) = 3\\cdot 1000^t$", "$N(t) = 1000\\cdot t^3$"], correct: 0,
      hint: R`Κάθε ώρα πολλαπλασιάζουμε με $3$.`,
      sol: R`$N(0) = 1000$, $N(1) = 1000\cdot 3$, $N(2) = 1000\cdot 3^2, \dots$, άρα $N(t) = 1000\cdot 3^t$.` }
  ]
},
/* ───────────────────────────── 8.2.1 ───────────────────────────── */
{
  id: "8.2.1", unit: 8, title: "Έννοια του λογαρίθμου",
  book: "Β΄ Τεύχος §8.2.1",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Για $\alpha > 0$, $\alpha \ne 1$ και $\beta > 0$, ο <b>λογάριθμος του $\beta$ με βάση $\alpha$</b> είναι ο εκθέτης στον οποίο πρέπει να υψώσουμε το $\alpha$ για να πάρουμε το $\beta$:</p>
$$\log_\alpha\beta = x \iff \alpha^x = \beta$$
<p>Π.χ. $\log_3 81 = 4$ γιατί $3^4 = 81$, $\ \log_2\frac18 = -3$ γιατί $2^{-3} = \frac18$.</p></div>

<div class="tbox"><h4>Βασικές ισότητες</h4>
$$\log_\alpha 1 = 0 \qquad \log_\alpha\alpha = 1 \qquad \log_\alpha\alpha^x = x \qquad \alpha^{\log_\alpha\beta} = \beta$$
<ul><li><b>Δεκαδικός</b> λογάριθμος: $\log x = \log_{10}x$ (π.χ. $\log 1000 = 3$).</li>
<li><b>Φυσικός</b> λογάριθμος: $\ln x = \log_e x$ (π.χ. $\ln e^5 = 5$).</li>
<li>Δεν ορίζεται λογάριθμος μη θετικού αριθμού: $\log_2(-8)$ δεν υπάρχει.</li></ul></div>

<div class="tbox tip"><h4>Εκθετική εξίσωση με λογάριθμο</h4>
<p>$10^x = 5 \iff x = \log 5 \approx 0{,}70$, $\ e^x = 20 \iff x = \ln 20 \approx 3{,}00$ (υπολογιστική μηχανή).</p></div>`,
  widget: "logfun",
  gen: "glogval",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε: (α) $\log_2 32$, (β) $\log_8 64$, (γ) $\log_3\frac19$.`,
      fields: [{ label: "(α) =", ans: 5 }, { label: "(β) =", ans: 2 }, { label: "(γ) =", ans: -2 }],
      hint: R`Σε ποια δύναμη υψώνουμε τη βάση;`,
      sol: R`$2^5 = 32$, $8^2 = 64$, $3^{-2} = \frac19$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε: (α) $\ln e^7$, (β) $\ln\dfrac{1}{\sqrt e}$, (γ) $\log_4 4$.`,
      fields: [{ label: "(α) =", ans: 7 }, { label: "(β) =", ans: "-1/2" }, { label: "(γ) =", ans: 1 }],
      hint: R`$\frac{1}{\sqrt e} = e^{-1/2}$.`,
      sol: R`(α) $7$. (β) $\ln e^{-1/2} = -\frac12$. (γ) $\log_\alpha\alpha = 1$.` },
    { level: 1, type: "mc", q: R`Η ισότητα $5^3 = 125$ γράφεται σε λογαριθμική μορφή:`,
      options: ["$\\log_5 125 = 3$", "$\\log_3 125 = 5$", "$\\log_{125} 5 = 3$", "$\\log_5 3 = 125$"], correct: 0,
      hint: R`Η βάση της δύναμης γίνεται βάση του λογαρίθμου.`,
      sol: R`$\alpha^x = \beta \iff \log_\alpha\beta = x$: $\ \log_5 125 = 3$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το $x$: (α) $\log_3(4x - 1) = 4$, (β) $\log(x + 1) = 3$.`,
      fields: [{ label: "(α) x =", ans: "41/2" }, { label: "(β) x =", ans: 999 }],
      hint: R`Από τον ορισμό: $4x - 1 = 3^4$.`,
      sol: R`(α) $4x - 1 = 81 \Rightarrow x = \frac{41}{2}$. (β) $x + 1 = 10^3 \Rightarrow x = 999$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το $x$: (α) $\log_x 8 = \frac32$, (β) $\log_2 2\sqrt2 = x$.`,
      fields: [{ label: "(α) x =", ans: 4 }, { label: "(β) x =", ans: "3/2" }],
      hint: R`(α) $x^{3/2} = 8$, άρα $x = 8^{2/3}$.`,
      sol: R`(α) $x = 8^{2/3} = (2^3)^{2/3} = 4$ (και $4 > 0$, $4 \ne 1$). (β) $2\sqrt2 = 2^{3/2}$, άρα $x = \frac32$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το $x$ αν $\log_x 10 = 2$.`,
      fields: [{ label: "x =", ans: "√10", tol: 0.002 }],
      hint: R`$x^2 = 10$ με $x > 0$, $x \ne 1$.`,
      sol: R`$x^2 = 10 \Rightarrow x = \sqrt{10}$ (η αρνητική απορρίπτεται: η βάση πρέπει να είναι θετική).` },
    { level: 2, type: "fields", q: R`Να λύσετε με τη βοήθεια λογαρίθμων (2 δεκαδικά): (α) $10^x = 5$, (β) $e^x = 20$.`,
      fields: [{ label: "(α) x =", ans: 0.7, tol: 0.01 }, { label: "(β) x =", ans: 3, tol: 0.003 }],
      hint: R`$10^x = 5 \iff x = \log 5$.`,
      sol: R`(α) $x = \log 5 \approx 0{,}70$. (β) $x = \ln 20 \approx 3{,}00$.` }
  ]
},
/* ───────────────────────────── 8.2.2 ───────────────────────────── */
{
  id: "8.2.2", unit: 8, title: "Λογαριθμική συνάρτηση",
  book: "Β΄ Τεύχος §8.2.2",
  theory: R`
<div class="tbox"><h4>Ορισμός και ιδιότητες</h4>
<p>$g: (0, +\infty) \to \mathbb{R}$, $\ g(x) = \log_\alpha x$ ($\alpha > 0$, $\alpha \ne 1$).</p>
<ul><li>Πεδίο ορισμού $(0, +\infty)$, σύνολο τιμών $\mathbb{R}$.</li>
<li>$\alpha > 1$: γνησίως αύξουσα · $0 < \alpha < 1$: γνησίως φθίνουσα. Είναι 1–1.</li>
<li>Περνά από τα $(1, 0)$ και $(\alpha, 1)$· ο $y'y$ είναι κατακόρυφη ασύμπτωτη.</li>
<li>Οι $y = \alpha^x$ και $y = \log_\alpha x$ είναι <b>συμμετρικές ως προς την ευθεία $y = x$</b>: αν $(\kappa, \lambda)$ ανήκει στη μία, το $(\lambda, \kappa)$ ανήκει στην άλλη.</li></ul></div>

<div class="tbox tip"><h4>Πεδίο ορισμού</h4>
<p>Για $f(x) = \log_\alpha g(x)$ απαιτούμε $g(x) > 0$. Π.χ. $f(x) = \log(1 - x^2)$: $1 - x^2 > 0 \iff -1 < x < 1$.</p></div>`,
  widget: "logfun",
  exercises: [
    { level: 1, type: "mc", q: R`Το πεδίο ορισμού της $f(x) = \log_2(x - 3)$ είναι:`,
      options: ["$(3, +\\infty)$", "$[3, +\\infty)$", "$\\mathbb{R} - \\{3\\}$", "$(0, +\\infty)$"], correct: 0,
      hint: R`Όρισμα θετικό.`,
      sol: R`$x - 3 > 0 \iff x > 3$.` },
    { level: 2, type: "mc", q: R`Το πεδίο ορισμού της $g(x) = \log(1 - x^2)$ είναι:`,
      options: ["$(-1, 1)$", "$[-1, 1]$", "$(-\\infty, -1) \\cup (1, +\\infty)$", "$\\mathbb{R}$"], correct: 0,
      hint: R`$1 - x^2 > 0$.`,
      sol: R`$x^2 < 1 \iff -1 < x < 1$.` },
    { level: 1, type: "fields", q: R`Το πεδίο ορισμού της $h(x) = \ln(2x - 4)$ είναι $(\kappa, +\infty)$. Να βρείτε το $\kappa$.`,
      fields: [{ label: "κ =", ans: 2 }],
      hint: R`$2x - 4 > 0$.`,
      sol: R`$2x > 4 \iff x > 2$.` },
    { level: 1, type: "mc", q: R`Η συνάρτηση που είναι συμμετρική της $f(x) = 7^x$ ως προς την ευθεία $y = x$ είναι:`,
      options: ["$y = \\log_7 x$", "$y = 7^{-x}$", "$y = -7^x$", "$y = \\left(\\frac17\\right)^x$"], correct: 0,
      hint: R`Η λογαριθμική με την ίδια βάση.`,
      sol: R`Οι $y = \alpha^x$ και $y = \log_\alpha x$ είναι συμμετρικές ως προς την $y = x$: εδώ $y = \log_7 x$.` },
    { level: 2, type: "mc", q: R`Ποιο ισχύει;`,
      options: ["$\\log_2 5 < \\log_2 7$ και $\\log_{1/2}5 > \\log_{1/2}7$", "$\\log_2 5 > \\log_2 7$", "$\\log_{1/2}5 < \\log_{1/2}7$", "$\\log_2 5 = \\log_{1/2}5$"], correct: 0,
      hint: R`Βάση $> 1$: αύξουσα. Βάση στο $(0, 1)$: φθίνουσα.`,
      sol: R`Η $\log_2 x$ είναι γνησίως αύξουσα ($5 < 7 \Rightarrow \log_2 5 < \log_2 7$), ενώ η $\log_{1/2}x$ γνησίως φθίνουσα (αντιστρέφεται η ανισότητα).` },
    { level: 2, type: "fields", q: R`Η γραφική παράσταση της $f(x) = \log_\alpha x$ διέρχεται από το σημείο $(9, 2)$. Να βρείτε το $\alpha$.`,
      fields: [{ label: "α =", ans: 3 }],
      hint: R`$\log_\alpha 9 = 2 \iff \alpha^2 = 9$.`,
      sol: R`$\alpha^2 = 9$ με $\alpha > 0$: $\alpha = 3$.` },
    { level: 2, type: "fields", q: R`Δίνεται $f(x) = \log_3(x + 1)$. Να υπολογίσετε το $f(8)$ και να βρείτε το $x$ για το οποίο $f(x) = -1$.`,
      fields: [{ label: "f(8) =", ans: 2 }, { label: "x =", ans: "-2/3" }],
      hint: R`$f(x) = -1 \iff x + 1 = 3^{-1}$.`,
      sol: R`$f(8) = \log_3 9 = 2$. $x + 1 = \frac13 \Rightarrow x = -\frac23$ (και $x + 1 > 0$ ✓).` },
    { level: 1, type: "mc", q: R`Η συνάρτηση $h(x) = 1 + \log_2 x$ έχει σύνολο τιμών:`,
      options: ["$\\mathbb{R}$", "$(0, +\\infty)$", "$(1, +\\infty)$", "$[1, +\\infty)$"], correct: 0,
      hint: R`Τι σύνολο τιμών έχει η $\log_2 x$;`,
      sol: R`Η $\log_2 x$ παίρνει όλες τις πραγματικές τιμές, άρα και η $1 + \log_2 x$. (Πεδίο ορισμού: $(0, +\infty)$.)` }
  ]
},
/* ───────────────────────────── 8.2.3 ───────────────────────────── */
{
  id: "8.2.3", unit: 8, title: "Ιδιότητες λογαρίθμων",
  book: "Β΄ Τεύχος §8.2.3",
  theory: R`
<div class="tbox"><h4>Ιδιότητες</h4>
<p>Για $\alpha > 0$, $\alpha \ne 1$, $x, y > 0$ και $\kappa \in \mathbb{R}$:</p>
$$\log_\alpha(xy) = \log_\alpha x + \log_\alpha y \qquad \log_\alpha\frac xy = \log_\alpha x - \log_\alpha y$$
$$\log_\alpha x^\kappa = \kappa\log_\alpha x \qquad\left(\text{π.χ. } \log_\alpha\sqrt[\nu]{x} = \tfrac1\nu\log_\alpha x\right)$$
<p>Προκύπτουν από τις ιδιότητες των δυνάμεων: $\alpha^A\alpha^B = \alpha^{A+B}$ κ.λπ.</p></div>

<div class="tbox tip"><h4>Συνηθισμένα λάθη — ΔΕΝ ισχύουν</h4>
<ul><li>$\log_\alpha(x + y) \ne \log_\alpha x + \log_\alpha y$</li>
<li>$\log_\alpha\frac xy \ne \frac{\log_\alpha x}{\log_\alpha y}$ και $\log_\alpha(xy) \ne \log_\alpha x\cdot\log_\alpha y$</li>
<li>$(\log_\alpha x)^\nu \ne \nu\log_\alpha x$</li></ul>
<p>Παράδειγμα: $\frac{\ln 50 - \ln 2}{\ln 5 + \ln\sqrt5} = \frac{\ln 25}{\ln 5^{3/2}} = \frac{2\ln 5}{\frac32\ln 5} = \frac43$.</p></div>`,
  gen: "glogprop",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε: (α) $\log_8 16 + \log_8 4$, (β) $\log_5 50 - \log_5 2$.`,
      fields: [{ label: "(α) =", ans: 2 }, { label: "(β) =", ans: 2 }],
      hint: R`Ένωσε σε έναν λογάριθμο.`,
      sol: R`(α) $\log_8 64 = 2$. (β) $\log_5 25 = 2$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε την παράσταση $\log 16 + \log 25 - \log 4$.`,
      fields: [{ label: "=", ans: 2 }],
      hint: R`$\frac{16\cdot 25}{4} = 100$.`,
      sol: R`$\log\frac{16\cdot 25}{4} = \log 100 = 2$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε: (α) $\dfrac{\log 36}{\log 6}$, (β) $\log_{13}\sqrt[3]{169}$.`,
      fields: [{ label: "(α) =", ans: 2 }, { label: "(β) =", ans: "2/3" }],
      hint: R`$36 = 6^2$, $\sqrt[3]{169} = 13^{2/3}$.`,
      sol: R`(α) $\frac{2\log 6}{\log 6} = 2$. (β) $\log_{13}13^{2/3} = \frac23$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε την τιμή της παράστασης $\dfrac{\ln 50 - \ln 2}{\ln 5 + \ln\sqrt5}$.`,
      fields: [{ label: "=", ans: "4/3" }],
      hint: R`Αριθμητής: $\ln 25 = 2\ln 5$. Παρονομαστής: $\ln 5^{3/2}$.`,
      sol: R`$\frac{\ln 25}{\ln(5\sqrt5)} = \frac{2\ln 5}{\frac32\ln 5} = \frac43$.` },
    { level: 2, type: "fields", q: R`Αν $\log_2 x = \alpha$, να γράψετε το $\log_2\dfrac{x^6}{64}$ στη μορφή $\kappa\alpha + \lambda$.`,
      fields: [{ label: "κ =", ans: 6 }, { label: "λ =", ans: -6 }],
      hint: R`$\log_2 x^6 - \log_2 64$.`,
      sol: R`$6\log_2 x - \log_2 2^6 = 6\alpha - 6$.` },
    { level: 2, type: "fields", q: R`Αν $\log 2 = \alpha$ και $\log 5 = \beta$, να γράψετε τα $\log 40$ και $\log\frac{4}{125}$ συναρτήσει των $\alpha$, $\beta$ (συμπληρώστε τους συντελεστές).`,
      fields: [{ label: "log40: συντελ. α =", ans: 3 }, { label: "συντελ. β =", ans: 1 }, { label: "log(4/125): συντελ. α =", ans: 2 }, { label: "συντελ. β =", ans: -3 }],
      hint: R`$40 = 2^3\cdot 5$, $\ \frac{4}{125} = \frac{2^2}{5^3}$.`,
      sol: R`$\log 40 = 3\log 2 + \log 5 = 3\alpha + \beta$. $\ \log\frac{4}{125} = 2\log 2 - 3\log 5 = 2\alpha - 3\beta$.` },
    { level: 1, type: "mc", q: R`Η παράσταση $2\log 3 + 3\log 2$ ισούται με:`,
      options: ["$\\log 72$", "$\\log 12$", "$\\log 36$", "$\\log 17$"], correct: 0,
      hint: R`$2\log 3 = \log 9$, $3\log 2 = \log 8$.`,
      sol: R`$\log 9 + \log 8 = \log 72$.` },
    { level: 1, type: "mc", q: R`Ποια ισότητα <b>δεν</b> ισχύει γενικά (για $x, y > 0$);`,
      options: ["$\\log(xy) = \\log x + \\log y$", "$\\log(x + y) = \\log x + \\log y$", "$\\log x^3 = 3\\log x$", "$\\log\\frac xy = \\log x - \\log y$"], correct: 1,
      hint: R`Δοκίμασε $x = y = 1$.`,
      sol: R`Για $x = y = 1$: $\log 2 \ne 0 + 0$. Ο λογάριθμος <b>αθροίσματος</b> δεν «σπάει».` },
    { level: 3, type: "fields", q: R`Κεφάλαιο $20\,000$ € επενδύεται με επιτόκιο $3\%$ (ετήσιος ανατοκισμός) και γίνεται $23\,185{,}48$ €. Πόσα χρόνια πέρασαν;`,
      fields: [{ label: "t =", ans: 5, tol: 0.002 }],
      hint: R`$1{,}03^t = \frac{23185{,}48}{20000}$. Πάρε δεκαδικό λογάριθμο και στα δύο μέλη: $t\log 1{,}03 = \log 1{,}159274$.`,
      sol: R`$1{,}03^t = 1{,}159274 \Rightarrow t\log 1{,}03 = \log 1{,}159274 \Rightarrow t \approx 5$ χρόνια.` }
  ]
},
/* ───────────────────────────── 8.2.4 ───────────────────────────── */
{
  id: "8.2.4", unit: 8, title: "Αλλαγή βάσης λογαρίθμων",
  book: "Β΄ Τεύχος §8.2.4 · Δραστηριότητες σελ. 183",
  theory: R`
<div class="tbox"><h4>Τύπος αλλαγής βάσης</h4>
<p>Για $\alpha, \beta > 0$ με $\alpha, \beta \ne 1$ και $x > 0$:</p>
$$\log_\alpha x = \frac{\log_\beta x}{\log_\beta \alpha}$$
<p>Με $\beta = 10$ ή $\beta = e$ υπολογίζουμε κάθε λογάριθμο με την υπολογιστική μηχανή: $\log_2 7 = \frac{\log 7}{\log 2} = \frac{\ln 7}{\ln 2} \approx 2{,}807$.</p></div>

<div class="tbox tip"><h4>Συνέπειες</h4>
<ul><li>$\log_\alpha\beta\cdot\log_\beta\alpha = 1$, δηλαδή $\log_\alpha\beta = \frac{1}{\log_\beta\alpha}$.</li>
<li>$\log_\alpha\beta\cdot\log_\beta\gamma = \log_\alpha\gamma$ («αλυσίδα»).</li>
<li>$\log_{\alpha^\kappa} x = \frac1\kappa\log_\alpha x$, π.χ. $\log_9 16 = \frac{\log_3 16}{2} = \log_3 4$.</li>
<li>$\log_{1/\alpha} x = -\log_\alpha x$.</li></ul></div>`,
  widget: "logbase",
  gen: "gbase",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε χωρίς υπολογιστική μηχανή: (α) $(\log_5 4)(\log_4 5)$, (β) $\dfrac{\log_3 4}{\log_9 16}$.`,
      fields: [{ label: "(α) =", ans: 1 }, { label: "(β) =", ans: 1 }],
      hint: R`(β) $\log_9 16 = \frac{\log_3 16}{\log_3 9} = \frac{2\log_3 4}{2}$.`,
      sol: R`(α) $\frac{\log 4}{\log 5}\cdot\frac{\log 5}{\log 4} = 1$. (β) $\log_9 16 = \log_3 4$, άρα το πηλίκο είναι $1$.` },
    { level: 1, type: "fields", q: R`Με υπολογιστική μηχανή και τον τύπο αλλαγής βάσης, να υπολογίσετε (3 δεκαδικά): (α) $\log_2 7$, (β) $\log_5 0{,}2$.`,
      fields: [{ label: "(α) ≈", ans: 2.807, tol: 0.0005 }, { label: "(β) =", ans: -1 }],
      hint: R`$\log_\alpha x = \frac{\log x}{\log\alpha}$.`,
      sol: R`(α) $\frac{\log 7}{\log 2} \approx \frac{0{,}8451}{0{,}3010} \approx 2{,}807$. (β) $0{,}2 = 5^{-1}$: $-1$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το γινόμενο $\log_2 3\cdot\log_3 4\cdot\log_4 5\cdots\log_7 8$.`,
      fields: [{ label: "=", ans: 3 }],
      hint: R`Αλυσίδα: $\log_2 3\cdot\log_3 4 = \log_2 4$.`,
      sol: R`Όλα «απλοποιούνται»: $= \log_2 8 = 3$.` },
    { level: 2, type: "fields", q: R`Αν $\log 2 = \alpha$ και $\log 5 = \beta$, γράψτε τους λογαρίθμους στη μορφή $\kappa\alpha + \lambda\beta$: (α) $\log 20$, (β) $\log 0{,}08$.`,
      fields: [{ label: "(α) κ =", ans: 2 }, { label: "(α) λ =", ans: 1 }, { label: "(β) κ =", ans: 1 }, { label: "(β) λ =", ans: -2 }],
      hint: R`$20 = 2^2\cdot 5$, $0{,}08 = \frac{8}{100} = \frac{2^3}{2^2\cdot 5^2}$.`,
      sol: R`(α) $\log 20 = 2\log 2 + \log 5 = 2\alpha + \beta$. (β) $\log 0{,}08 = \log 2^3 - \log(2^2\cdot 5^2) = 3\alpha - 2\alpha - 2\beta = \alpha - 2\beta$.` },
    { level: 2, type: "fields", q: R`Αν $\log_8 x = \frac12\alpha$ και $\log_2(2x) = \alpha + 4$, να βρείτε τα $\alpha$ και $x$.`,
      fields: [{ label: "α =", ans: 6 }, { label: "x =", ans: 512 }],
      hint: R`$\log_8 x = \frac{\log_2 x}{3}$ και $\log_2(2x) = 1 + \log_2 x$.`,
      sol: R`$\log_2 x = \frac{3\alpha}{2}$ και $1 + \frac{3\alpha}{2} = \alpha + 4 \Rightarrow \frac\alpha2 = 3 \Rightarrow \alpha = 6$. Τότε $\log_2 x = 9$, $x = 512$.` },
    { level: 1, type: "mc", q: R`$\log_{1/3} 81 = $`,
      options: ["$-4$", "$4$", "$\\frac14$", "$-\\frac14$"], correct: 0,
      hint: R`$\log_{1/\alpha} x = -\log_\alpha x$.`,
      sol: R`$-\log_3 81 = -4$.` },
    { level: 3, type: "fields", q: R`Να λύσετε την εξίσωση $\log_2 x + \log_4 x + \log_{16} x = 7$.`,
      fields: [{ label: "x =", ans: 16 }],
      hint: R`Όλα σε βάση $2$: $\log_4 x = \frac{\log_2 x}{2}$, $\log_{16}x = \frac{\log_2 x}{4}$.`,
      sol: R`$\log_2 x\left(1 + \frac12 + \frac14\right) = 7 \Rightarrow \frac74\log_2 x = 7 \Rightarrow \log_2 x = 4 \Rightarrow x = 16$.` }
  ]
},
/* ───────────────────────────── 8.2.5 ───────────────────────────── */
{
  id: "8.2.5", unit: 8, title: "Λογαριθμικές εξισώσεις",
  book: "Β΄ Τεύχος §8.2.5 (εκτός ανισώσεων – συστημάτων)",
  theory: R`
<div class="tbox"><h4>Μέθοδος</h4>
<ol><li><b>Περιορισμοί:</b> όλα τα ορίσματα των λογαρίθμων θετικά (και οι βάσεις θετικές, $\ne 1$).</li>
<li>Με τις ιδιότητες φέρνουμε την εξίσωση στη μορφή $\log_\alpha A = \log_\alpha B$ ή $\log_\alpha A = \kappa$.</li>
<li>Αφού η $\log_\alpha x$ είναι 1–1: $\ \log_\alpha A = \log_\alpha B \iff A = B$, $\ \log_\alpha A = \kappa \iff A = \alpha^\kappa$.</li>
<li><b>Έλεγχος:</b> κρατάμε μόνο λύσεις που ικανοποιούν τους περιορισμούς.</li></ol></div>

<div class="tbox tip"><h4>Παραδείγματα</h4>
<ul><li>$\log x + \log(x - 1) = \log 2$: $x > 1$, $x(x - 1) = 2 \Rightarrow x = 2$ ή $x = -1$ (απορρίπτεται). Λύση $x = 2$.</li>
<li>Αντικατάσταση: $(\log x)^2 - 3\log x + 2 = 0$, θέτουμε $y = \log x$.</li>
<li>Αν ο άγνωστος είναι και στη βάση και στον εκθέτη, π.χ. $x^{\log x} = 100$, παίρνουμε λογάριθμο και στα δύο μέλη.</li></ul></div>`,
  gen: "glogeq",
  exercises: [
    { level: 1, type: "fields", q: R`Να λύσετε την εξίσωση $\log 3 + \log(x + 1) = \log 21$.`,
      fields: [{ label: "x =", ans: 6 }],
      hint: R`$\log[3(x + 1)] = \log 21$.`,
      sol: R`Περιορισμός $x > -1$. $3(x + 1) = 21 \Rightarrow x = 6$ ✓.` },
    { level: 2, type: "mc", q: R`Η εξίσωση $\log(2x + 1) - \log(x + 2) = 1$:`,
      options: ["έχει λύση $x = -\\frac{19}{8}$", "έχει λύση $x = 2$", "είναι αδύνατη", "έχει δύο λύσεις"], correct: 2,
      hint: R`Λύσε και <b>έλεγξε τους περιορισμούς</b>.`,
      sol: R`$\frac{2x + 1}{x + 2} = 10 \Rightarrow 2x + 1 = 10x + 20 \Rightarrow x = -\frac{19}{8}$. Τότε $2x + 1 = -\frac{15}{4} < 0$: ο λογάριθμος δεν ορίζεται. Η εξίσωση είναι <b>αδύνατη</b>.` },
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $2\log x = \log(x + 12)$.`,
      fields: [{ label: "x =", ans: 4 }],
      hint: R`$2\log x = \log x^2$, με $x > 0$.`,
      sol: R`$x^2 = x + 12 \Rightarrow x = 4$ ή $x = -3$. Περιορισμός $x > 0$: λύση $x = 4$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $\log_3(\log x + 3) = 2$.`,
      fields: [{ label: "x =", ans: "10^6" }],
      hint: R`Πρώτα $\log x + 3 = 3^2$.`,
      sol: R`$\log x + 3 = 9 \Rightarrow \log x = 6 \Rightarrow x = 10^6$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $\log x + \log(x + 1) = \log 12 - \log 2$.`,
      fields: [{ label: "x =", ans: 2 }],
      hint: R`Δεξί μέλος: $\log 6$.`,
      sol: R`$x > 0$. $x(x + 1) = 6 \Rightarrow x^2 + x - 6 = 0 \Rightarrow x = 2$ ή $x = -3$ (απορρίπτεται). Λύση $x = 2$.` },
    { level: 3, type: "fields", q: R`Να λύσετε την εξίσωση $[\log(2x - 4)]^2 = \log(2x - 4)$.`,
      fields: [{ label: "x₁ (μικρότερη) =", ans: "5/2" }, { label: "x₂ =", ans: 7 }],
      hint: R`Θέσε $y = \log(2x - 4)$: $y^2 = y$.`,
      sol: R`$x > 2$. $y = 0$ ή $y = 1$: $2x - 4 = 1 \Rightarrow x = \frac52$, $\ 2x - 4 = 10 \Rightarrow x = 7$. Και οι δύο δεκτές.` },
    { level: 3, type: "fields", q: R`Να λύσετε την εξίσωση $x^{1 + \log x} = 1\,000\,000$, $x > 0$.`,
      fields: [{ label: "x₁ (μικρότερη) =", ans: "1/1000" }, { label: "x₂ =", ans: 100 }],
      hint: R`Πάρε δεκαδικό λογάριθμο: $(1 + \log x)\log x = 6$.`,
      sol: R`Με $y = \log x$: $y^2 + y - 6 = 0 \Rightarrow y = 2$ ή $y = -3$. Άρα $x = 100$ ή $x = 10^{-3} = \frac{1}{1000}$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $\log_2(x + 1) + \log_2(x - 1) = 3$.`,
      fields: [{ label: "x =", ans: 3 }],
      hint: R`$\log_2(x^2 - 1) = 3$, με $x > 1$.`,
      sol: R`$x^2 - 1 = 8 \Rightarrow x = \pm 3$. Περιορισμός $x > 1$: λύση $x = 3$.` }
  ]
},
/* ───────────────────────────── 8.2.7 ───────────────────────────── */
{
  id: "8.2.7", unit: 8, title: "Εφαρμογές λογαριθμικής συνάρτησης",
  book: "Β΄ Τεύχος §8.2.7 · Δραστηριότητες σελ. 195–196",
  theory: R`
<div class="tbox"><h4>Λογαριθμικές κλίμακες και μοντέλα</h4>
<p>Πολλά μεγέθη μετρώνται με λογαρίθμους, γιατί μεταβάλλονται σε τεράστιο εύρος: η <b>κλίμακα Richter</b> ($M = \log\frac{A}{A_0}$), το <b>pH</b> ($\text{pH} = -\log[H^+]$), η ένταση ήχου σε decibel ($\beta = 10\log\frac{I}{I_0}$), το μέγεθος των αστέρων ($m = 6 - 2{,}5\log\frac{L}{L_0}$).</p>
<p>Αύξηση κατά $1$ στην κλίμακα $\log$ σημαίνει <b>δεκαπλασιασμό</b> της ποσότητας μέσα στον λογάριθμο.</p></div>

<div class="tbox tip"><h4>Λύση ως προς τον χρόνο</h4>
<p>Σε μοντέλα $Q(t) = Q_0\,e^{kt}$ ή $Q_0\,\alpha^t$ βρίσκουμε τον χρόνο με λογαρίθμους: $e^{kt} = c \iff t = \frac{\ln c}{k}$. Σε μοντέλα της μορφής $P(t) = \kappa - \ln(t + \lambda)$ βρίσκουμε πρώτα τις παραμέτρους από τα δεδομένα.</p></div>`,
  widget: "logbase",
  exercises: [
    { level: 2, type: "fields", q: R`Ο πληθυσμός ακρίδων (σε χιλιάδες) $t$ ημέρες μετά τον ψεκασμό είναι $P(t) = \kappa - \ln(t + \lambda)$, $\kappa, \lambda > 0$. Αρχικά ήταν $2$ χιλιάδες, ενώ δύο ημέρες μετά $(2 - \ln 3)$ χιλιάδες. Να βρείτε τα $\kappa$, $\lambda$ και τον πληθυσμό μετά από $(e - 1)$ ημέρες.`,
      fields: [{ label: "κ =", ans: 2 }, { label: "λ =", ans: 1 }, { label: "P(e − 1) =", ans: 1 }],
      hint: R`$\kappa - \ln\lambda = 2$ και $\kappa - \ln(2 + \lambda) = 2 - \ln 3$.`,
      sol: R`Αφαιρώντας: $\ln\frac{2 + \lambda}{\lambda} = \ln 3 \Rightarrow 2 + \lambda = 3\lambda \Rightarrow \lambda = 1$, οπότε $\kappa = 2$. $P(e - 1) = 2 - \ln e = 1$ χιλιάδα.` },
    { level: 2, type: "fields", q: R`Στο ίδιο μοντέλο $P(t) = 2 - \ln(t + 1)$, μετά από πόσες ημέρες εξαλείφονται οι ακρίδες; (2 δεκαδικά)`,
      fields: [{ label: "t ≈", ans: 6.389, tol: 0.0008 }],
      hint: R`$P(t) = 0 \iff \ln(t + 1) = 2$.`,
      sol: R`$t + 1 = e^2 \Rightarrow t = e^2 - 1 \approx 6{,}39$ ημέρες.` },
    { level: 2, type: "fields", q: R`Το μέγεθος αστέρα με λαμπρότητα $L$ είναι $m = 6 - 2{,}5\log\frac{L}{L_0}$. (α) Να βρείτε το $m$ αστέρα με $L = \sqrt[5]{100}\,L_0$. (β) Πόσες φορές λαμπρότερος είναι ένας αστέρας 1ου μεγέθους από έναν 6ου μεγέθους;`,
      fields: [{ label: "(α) m =", ans: 5 }, { label: "(β) φορές =", ans: 100 }],
      hint: R`(α) $\log\sqrt[5]{100} = \frac25$. (β) $1 = 6 - 2{,}5\log\frac{L}{L_0}$.`,
      sol: R`(α) $m = 6 - 2{,}5\cdot 0{,}4 = 5$. (β) $\log\frac{L}{L_0} = 2 \Rightarrow L = 100L_0$, ενώ ο αστέρας 6ου μεγέθους έχει $L_0$: $100$ φορές.` },
    { level: 1, type: "fields", q: R`Το pH ενός διαλύματος είναι $\text{pH} = -\log[H^+]$. Να βρείτε το pH όταν $[H^+] = 10^{-3}$, και τον εκθέτη $\kappa$ στη συγκέντρωση $[H^+] = 10^\kappa$ όταν $\text{pH} = 8$.`,
      fields: [{ label: "pH =", ans: 3 }, { label: "κ =", ans: -8 }],
      hint: R`$-\log 10^{-3} = 3$.`,
      sol: R`$\text{pH} = 3$. $\ -\log[H^+] = 8 \Rightarrow [H^+] = 10^{-8}$.` },
    { level: 2, type: "fields", q: R`Σεισμός $6$ Richter έχει πλάτος $A_1$ και σεισμός $4$ Richter πλάτος $A_2$, με $M = \log\frac{A}{A_0}$. Πόσες φορές μεγαλύτερο είναι το $A_1$ από το $A_2$;`,
      fields: [{ label: "A₁/A₂ =", ans: 100 }],
      hint: R`$6 - 4 = \log\frac{A_1}{A_2}$.`,
      sol: R`$\log\frac{A_1}{A_0} - \log\frac{A_2}{A_0} = \log\frac{A_1}{A_2} = 2 \Rightarrow \frac{A_1}{A_2} = 100$.` },
    { level: 2, type: "fields", q: R`Ένα κεφάλαιο τοκίζεται με συνεχή ανατοκισμό $K(t) = K_0\,e^{0{,}05t}$ ($t$ σε έτη). Σε πόσα έτη διπλασιάζεται; (2 δεκαδικά)`,
      fields: [{ label: "t ≈", ans: 13.863, tol: 0.0004 }],
      hint: R`$e^{0{,}05t} = 2$.`,
      sol: R`$0{,}05t = \ln 2 \Rightarrow t = \frac{\ln 2}{0{,}05} \approx 13{,}86$ έτη.` }
  ]
},
/* ───────────────────────────── 9.2 ───────────────────────────── */
{
  id: "9.2", unit: 9, title: "Εγγεγραμμένα – Εγγράψιμα τετράπλευρα",
  book: "Γ΄ Τεύχος §9.2",
  theory: R`
<div class="tbox"><h4>Εγγεγραμμένο τετράπλευρο — ιδιότητες</h4>
<p>Αν οι κορυφές του $AB\Gamma\Delta$ είναι σημεία κύκλου:</p>
<ol><li>Οι <b>απέναντι γωνίες</b> είναι <b>παραπληρωματικές</b>: $\hat A + \hat\Gamma = \hat B + \hat\Delta = 180^\circ$.</li>
<li>Κάθε <b>εξωτερική γωνία</b> ισούται με την <b>απέναντι εσωτερική</b>.</li>
<li>Κάθε πλευρά φαίνεται από τις δύο απέναντι κορυφές υπό <b>ίσες γωνίες</b> (π.χ. $\angle BA\Gamma = \angle B\Delta\Gamma$, εγγεγραμμένες στο ίδιο τόξο).</li></ol></div>

<div class="tbox"><h4>Κριτήρια — πότε ένα τετράπλευρο είναι εγγράψιμο</h4>
<p>Ένα τετράπλευρο είναι <b>εγγράψιμο</b> (περνά κύκλος από τις κορυφές του) αν ισχύει <b>ένα</b> από τα:</p>
<ul><li>οι μεσοκάθετοι των πλευρών του περνούν από το ίδιο σημείο·</li>
<li>δύο απέναντι γωνίες του είναι παραπληρωματικές·</li>
<li>μια εξωτερική γωνία ισούται με την απέναντι εσωτερική·</li>
<li>μια πλευρά φαίνεται από τις απέναντι κορυφές υπό ίσες γωνίες.</li></ul></div>

<div class="tbox tip"><h4>Παραδείγματα</h4>
<p>Ορθογώνιο, τετράγωνο, ισοσκελές τραπέζιο: εγγράψιμα. Παραλληλόγραμμο εγγράψιμο ⇔ ορθογώνιο. Ρόμβος εγγράψιμος ⇔ τετράγωνο.</p></div>`,
  widget: "cyclic",
  gen: "gcyc",
  exercises: [
    { level: 1, type: "fields", q: R`Σε εγγράψιμο τετράπλευρο $AB\Gamma\Delta$ είναι $\hat A = 120^\circ$ και η εξωτερική γωνία στο $B$ είναι $80^\circ$. Να βρείτε τις γωνίες του.`,
      fields: [{ label: "B̂ =", ans: 100 }, { label: "Γ̂ =", ans: 60 }, { label: "Δ̂ =", ans: 80 }],
      hint: R`$\hat B = 180^\circ - 80^\circ$. Μετά απέναντι γωνίες παραπληρωματικές.`,
      sol: R`$\hat B = 100^\circ$, $\hat\Gamma = 180^\circ - 120^\circ = 60^\circ$, $\hat\Delta = 180^\circ - 100^\circ = 80^\circ$ (ίση με την εξωτερική στο $B$ ✓).` },
    { level: 2, type: "fields", q: R`Το $AB\Gamma\Delta$ είναι εγγεγραμμένο σε κύκλο ακτίνας $2$ cm με $\angle BA\Delta = \frac23x$ και $\angle B\Gamma\Delta = x - 45^\circ$. Να βρείτε το $x$ και το μήκος της διαγωνίου $B\Delta$.`,
      fields: [{ label: "x (°) =", ans: 135 }, { label: "ΒΔ (cm) =", ans: 4 }],
      hint: R`Απέναντι γωνίες: άθροισμα $180^\circ$. Η $\hat A$ τότε είναι ορθή.`,
      sol: R`$\frac23x + x - 45 = 180 \Rightarrow \frac53x = 225 \Rightarrow x = 135$. Τότε $\hat A = 90^\circ$, άρα η $B\Delta$ είναι διάμετρος: $B\Delta = 4$ cm.` },
    { level: 1, type: "fields", q: R`Το $AB\Gamma\Delta$ είναι εγγεγραμμένο σε κύκλο και $\angle BA\Gamma = 35^\circ$. Να βρείτε τη γωνία $\angle B\Delta\Gamma$.`,
      fields: [{ label: "∠ΒΔΓ =", ans: 35 }],
      hint: R`Εγγεγραμμένες γωνίες στο ίδιο τόξο $B\Gamma$.`,
      sol: R`Η πλευρά $B\Gamma$ φαίνεται από τα $A$ και $\Delta$ υπό ίσες γωνίες: $35^\circ$.` },
    { level: 1, type: "mc", q: R`Ποιο από τα πιο κάτω τετράπλευρα (με γωνίες $\hat A, \hat B, \hat\Gamma, \hat\Delta$ στη σειρά) είναι εγγράψιμο;`,
      options: ["$70^\\circ, 95^\\circ, 110^\\circ, 85^\\circ$", "$80^\\circ, 90^\\circ, 80^\\circ, 110^\\circ$", "$60^\\circ, 100^\\circ, 130^\\circ, 70^\\circ$", "$90^\\circ, 60^\\circ, 100^\\circ, 110^\\circ$"], correct: 0,
      hint: R`Έλεγξε $\hat A + \hat\Gamma$.`,
      sol: R`$70^\circ + 110^\circ = 180^\circ$ (και $95^\circ + 85^\circ = 180^\circ$). Στα άλλα $\hat A + \hat\Gamma \ne 180^\circ$.` },
    { level: 1, type: "fields", q: R`Σε εγγεγραμμένο τετράπλευρο $AB\Gamma\Delta$ η εξωτερική γωνία στην κορυφή $\Gamma$ είναι $75^\circ$. Να βρείτε τις $\hat A$ και $\hat\Gamma$.`,
      fields: [{ label: "Â =", ans: 75 }, { label: "Γ̂ =", ans: 105 }],
      hint: R`Εξωτερική = απέναντι εσωτερική.`,
      sol: R`$\hat A = 75^\circ$, $\hat\Gamma = 180^\circ - 75^\circ = 105^\circ$.` },
    { level: 2, type: "mc", q: R`Κάθε ρόμβος εγγεγραμμένος σε κύκλο είναι τετράγωνο. Γιατί;`,
      options: ["Οι απέναντι γωνίες του είναι ίσες και παραπληρωματικές, άρα $90^\\circ$", "Γιατί οι διαγώνιοί του τέμνονται κάθετα", "Γιατί έχει ίσες πλευρές", "Δεν ισχύει"], correct: 0,
      hint: R`Στον ρόμβο $\hat A = \hat\Gamma$.`,
      sol: R`Ρόμβος: $\hat A = \hat\Gamma$. Εγγεγραμμένος: $\hat A + \hat\Gamma = 180^\circ$. Άρα $\hat A = \hat\Gamma = 90^\circ$ (ομοίως $\hat B = \hat\Delta = 90^\circ$): τετράγωνο.` },
    { level: 1, type: "mc", q: R`Κάθε ισοσκελές τραπέζιο είναι εγγράψιμο σε κύκλο.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Οι γωνίες της βάσης είναι ίσες, και οι γωνίες που πρόσκεινται σε μία μη παράλληλη πλευρά είναι παραπληρωματικές.`,
      sol: R`Σε ισοσκελές τραπέζιο $AB\Gamma\Delta$ ($AB \parallel \Gamma\Delta$): $\hat A = \hat B$ και $\hat A + \hat\Delta = 180^\circ$, άρα $\hat B + \hat\Delta = 180^\circ$: απέναντι γωνίες παραπληρωματικές — εγγράψιμο.` },
    { level: 2, type: "mc", q: R`Ένα παραλληλόγραμμο είναι εγγράψιμο σε κύκλο:`,
      options: ["μόνο όταν είναι ορθογώνιο", "πάντα", "ποτέ", "μόνο όταν είναι ρόμβος"], correct: 0,
      hint: R`Στο παραλληλόγραμμο οι απέναντι γωνίες είναι ίσες.`,
      sol: R`Πρέπει $\hat A = \hat\Gamma$ και $\hat A + \hat\Gamma = 180^\circ$, άρα όλες οι γωνίες ορθές: ορθογώνιο.` }
  ]
},
/* ───────────────────────────── 9.4 ───────────────────────────── */
{
  id: "9.4", unit: 9, title: "Κανονικά πολύγωνα",
  book: "Γ΄ Τεύχος §9.4 (εκτός «Βασικές σχέσεις» σελ. 29)",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Ένα πολύγωνο είναι <b>κανονικό</b> όταν έχει <b>όλες τις πλευρές ίσες και όλες τις γωνίες ίσες</b> (π.χ. ισόπλευρο τρίγωνο, τετράγωνο). Αν χωρίσουμε κύκλο σε $\nu \ge 3$ ίσα τόξα, τα άκρα τους είναι κορυφές κανονικού $\nu$-γώνου.</p>
<ul><li>Κάθε κανονικό πολύγωνο είναι εγγράψιμο σε κύκλο και περιγράψιμο σε άλλο, <b>ομόκεντρο</b> κύκλο. Κέντρο $K$ και ακτίνα $R$ του πολυγώνου: του περιγεγραμμένου κύκλου.</li>
<li>$\lambda_\nu$: πλευρά · $\alpha_\nu$: <b>απόστημα</b> (απόσταση του κέντρου από μια πλευρά) · $\varphi_\nu$: γωνία του πολυγώνου, με $\varphi_\nu = 180^\circ - \frac{360^\circ}{\nu}$.</li>
</ul></div>

<div class="tbox"><h4>Εγγραφή σε κύκλο ακτίνας $R$</h4>
<table class="mini"><tr><th></th><th>τρίγωνο</th><th>τετράγωνο</th><th>εξάγωνο</th></tr>
<tr><th>πλευρά</th><td>$\lambda_3 = R\sqrt3$</td><td>$\lambda_4 = R\sqrt2$</td><td>$\lambda_6 = R$</td></tr>
<tr><th>απόστημα</th><td>$\alpha_3 = \frac R2$</td><td>$\alpha_4 = \frac{R\sqrt2}{2}$</td><td>$\alpha_6 = \frac{R\sqrt3}{2}$</td></tr></table>
<p>Το κανονικό εξάγωνο χωρίζεται από το κέντρο σε $6$ ισόπλευρα τρίγωνα πλευράς $R$.</p></div>

<div class="tbox tip"><h4>Εμβαδά</h4>
<p>Ισόπλευρο τρίγωνο πλευράς $\lambda$: $\frac{\sqrt3}{4}\lambda^2$ · τετράγωνο: $\lambda^2$ · κανονικό εξάγωνο: $6$ ισόπλευρα τρίγωνα πλευράς $R$. Έτσι $E_3 = \frac{\sqrt3}{4}(R\sqrt3)^2 = \frac{3\sqrt3}{4}R^2$, $\ E_4 = (R\sqrt2)^2 = 2R^2$, $\ E_6 = 6\cdot\frac{\sqrt3}{4}R^2 = \frac{3\sqrt3}{2}R^2$.</p>
<p>Για οποιοδήποτε τρίγωνο με κορυφή το κέντρο: $\frac12R^2\,\text{ημ}\theta$, όπου $\theta$ η επίκεντρη γωνία.</p></div>`,
  widget: "regpoly",
  gen: "gpoly",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε τη γωνία κανονικού πενταγώνου και κανονικού δωδεκαγώνου.`,
      fields: [{ label: "φ₅ =", ans: 108 }, { label: "φ₁₂ =", ans: 150 }],
      hint: R`$\varphi_\nu = 180^\circ - \frac{360^\circ}{\nu}$.`,
      sol: R`$\varphi_5 = 180^\circ - \frac{360^\circ}{5} = 108^\circ$, $\ \varphi_{12} = 180^\circ - \frac{360^\circ}{12} = 150^\circ$.` },
    { level: 2, type: "mc", q: R`Υπάρχει κανονικό πολύγωνο με γωνία $110^\circ$;`,
      options: ["Όχι, γιατί θα έπρεπε $\\nu = \\frac{360}{70}$, που δεν είναι ακέραιος", "Ναι, το κανονικό πεντάγωνο", "Ναι, το κανονικό εξάγωνο", "Ναι, κάθε γωνία κάτω από $180^\\circ$ είναι δυνατή"], correct: 0,
      hint: R`$\varphi_\nu = 180^\circ - \frac{360^\circ}{\nu} = 110^\circ$.`,
      sol: R`$\frac{360^\circ}{\nu} = 180^\circ - 110^\circ = 70^\circ \Rightarrow \nu = \frac{360}{70} \approx 5{,}14$, όχι ακέραιος: δεν υπάρχει.` },
    { level: 1, type: "fields", q: R`Ένα κανονικό πολύγωνο έχει γωνία $140^\circ$. Πόσες πλευρές έχει;`,
      fields: [{ label: "ν =", ans: 9 }],
      hint: R`$180^\circ - \frac{360^\circ}{\nu} = 140^\circ$.`,
      sol: R`$\frac{360^\circ}{\nu} = 180^\circ - 140^\circ = 40^\circ \Rightarrow \nu = \frac{360}{40} = 9$.` },
    { level: 2, type: "fields", q: R`Σε κύκλο ακτίνας $R = 6$ cm εγγράφουμε ισόπλευρο τρίγωνο, τετράγωνο και κανονικό εξάγωνο. Να βρείτε τις πλευρές τους.`,
      fields: [{ label: "λ₃ =", ans: "6√3", tol: 0.0005 }, { label: "λ₄ =", ans: "6√2", tol: 0.0005 }, { label: "λ₆ =", ans: 6 }],
      hint: R`Πίνακας: $R\sqrt3$, $R\sqrt2$, $R$.`,
      sol: R`$\lambda_3 = 6\sqrt3$, $\lambda_4 = 6\sqrt2$, $\lambda_6 = 6$ cm.` },
    { level: 2, type: "fields", q: R`Σε κύκλο ακτίνας $R = 2$ να βρείτε τα εμβαδά του εγγεγραμμένου ισόπλευρου τριγώνου, τετραγώνου και κανονικού εξαγώνου.`,
      fields: [{ label: "Ε₃ =", ans: "3√3", tol: 0.0005 }, { label: "Ε₄ =", ans: 8 }, { label: "Ε₆ =", ans: "6√3", tol: 0.0005 }],
      hint: R`$\lambda_3 = 2\sqrt3$, $\lambda_4 = 2\sqrt2$, $\lambda_6 = 2$. Ισόπλευρο πλευράς $\lambda$: $\frac{\sqrt3}{4}\lambda^2$.`,
      sol: R`$E_3 = \frac{\sqrt3}{4}(2\sqrt3)^2 = 3\sqrt3$, $\ E_4 = (2\sqrt2)^2 = 8$, $\ E_6 = 6\cdot\frac{2^2\sqrt3}{4} = 6\sqrt3$.` },
    { level: 3, type: "fields", q: R`Η πλευρά ενός τετραγώνου και το απόστημά του έχουν διαφορά $4\sqrt2$ cm. Να βρείτε το εμβαδόν του τετραγώνου.`,
      fields: [{ label: "Ε (cm²) =", ans: 128 }],
      hint: R`Το απόστημα τετραγώνου είναι το μισό της πλευράς.`,
      sol: R`$\lambda - \frac\lambda2 = 4\sqrt2 \Rightarrow \lambda = 8\sqrt2 \Rightarrow E = 128$ cm².` },
    { level: 3, type: "fields", q: R`Σε κύκλο $(K, R)$ με $R = 2$ παίρνουμε διαδοχικά τόξα $AB = 60^\circ$, $B\Gamma = 90^\circ$, $\Gamma\Delta = 120^\circ$. Να βρείτε την περίμετρο και το εμβαδόν του τετραπλεύρου $AB\Gamma\Delta$.`,
      fields: [{ label: "Π =", ans: "2+4√2+2√3", tol: 0.0005 }, { label: "Ε =", ans: "4+2√3", tol: 0.0005 }],
      hint: R`Το τόξο $\Delta A$ είναι $90^\circ$. Τόξο $60^\circ$ ⇒ χορδή $\lambda_6$, $90^\circ$ ⇒ $\lambda_4$, $120^\circ$ ⇒ $\lambda_3$.`,
      sol: R`$AB = \lambda_6 = 2$, $B\Gamma = \Delta A = \lambda_4 = 2\sqrt2$, $\Gamma\Delta = \lambda_3 = 2\sqrt3$. $\Pi = 2 + 4\sqrt2 + 2\sqrt3$. Εμβαδόν από τα κεντρικά τρίγωνα $\frac12R^2\text{ημ}\theta$: $2\text{ημ}60^\circ + 2\cdot 2\text{ημ}90^\circ + 2\text{ημ}120^\circ = \sqrt3 + 4 + \sqrt3 = 4 + 2\sqrt3$.` }
  ]
},
/* ───────────────────────────── 9.5.2 ───────────────────────────── */
{
  id: "9.5.2", unit: 9, title: "Μήκος κύκλου – Μήκος τόξου",
  book: "Γ΄ Τεύχος §9.5",
  theory: R`
<div class="tbox"><h4>Μήκος κύκλου</h4>
<p>Οι περίμετροι των εγγεγραμμένων κανονικών πολυγώνων πλησιάζουν, καθώς $\nu \to +\infty$, έναν αριθμό: το <b>μήκος του κύκλου</b>. Ο λόγος του προς τη διάμετρο είναι ο ίδιος για όλους τους κύκλους, ο άρρητος $\pi \approx 3{,}14159$:</p>
$$L = 2\pi R = \pi\delta$$</div>

<div class="tbox"><h4>Μήκος τόξου</h4>
<p>Το μήκος τόξου είναι ανάλογο της επίκεντρης γωνίας του. Για τόξο $\mu^\circ$:</p>
$$\ell = \frac{\pi R\mu}{180}$$
<p>Π.χ. ημικύκλιο ($\mu = 180$): $\ell = \pi R$· τεταρτοκύκλιο: $\ell = \frac{\pi R}{2}$.</p></div>

<div class="tbox tip"><h4>Ποσά ανάλογα</h4>
<p>Τροχός ακτίνας $R$ σε μία στροφή διανύει $2\pi R$· σε $\nu$ στροφές $2\pi R\nu$. Αν $\ell$ και $R$ γνωστά, $\mu = \frac{180\,\ell}{\pi R}$.</p></div>`,
  widget: "sector",
  gen: "garc",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε το μήκος κύκλου ακτίνας $5$ cm (γράψτε π.χ. <code>10π</code>).`,
      fields: [{ label: "L (cm) =", ans: "10π", tol: 0.003 }],
      hint: R`$L = 2\pi R$.`,
      sol: R`$L = 10\pi \approx 31{,}42$ cm.` },
    { level: 1, type: "fields", q: R`Τόξο κύκλου ακτίνας $R = 12$ cm έχει μήκος $3\pi$ cm. Να βρείτε το μέτρο του σε μοίρες.`,
      fields: [{ label: "μ (°) =", ans: 45 }],
      hint: R`$\mu = \frac{180\,\ell}{\pi R}$.`,
      sol: R`$\mu = \frac{180\cdot 3\pi}{12\pi} = 45^\circ$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το μήκος του τόξου που αντιστοιχεί σε πλευρά κανονικού οκταγώνου εγγεγραμμένου σε κύκλο ακτίνας $8$ cm.`,
      fields: [{ label: "ℓ (cm) =", ans: "2π", tol: 0.003 }],
      hint: R`Κεντρική γωνία οκταγώνου: $45^\circ$.`,
      sol: R`$\ell = \frac{\pi\cdot 8\cdot 45}{180} = 2\pi$ cm (ή $\frac{2\pi\cdot 8}{8}$).` },
    { level: 2, type: "fields", q: R`Τόξο $AB = 60^\circ$ σε κύκλο $(K, R)$ έχει μήκος $4\pi$ cm. Να βρείτε την ακτίνα και το μήκος του κύκλου.`,
      fields: [{ label: "R (cm) =", ans: 12 }, { label: "L (cm) =", ans: "24π", tol: 0.003 }],
      hint: R`Τόξο $60^\circ$ = $\frac16$ του κύκλου.`,
      sol: R`$\frac{\pi R\cdot 60}{180} = 4\pi \Rightarrow R = 12$. $L = 24\pi$ (ή $6\cdot 4\pi$).` },
    { level: 2, type: "fields", q: R`Ο τροχός ενός ποδηλάτου έχει ακτίνα $0{,}35$ m. Περίπου πόσες στροφές κάνει για να διανύσει $1$ km;`,
      fields: [{ label: "στροφές ≈", ans: 454.7, tol: 0.002 }],
      hint: R`Μία στροφή $= 2\pi\cdot 0{,}35 = 0{,}7\pi$ m.`,
      sol: R`$\frac{1000}{0{,}7\pi} \approx 454{,}7$, δηλαδή περίπου $455$ στροφές (454 πλήρεις).` },
    { level: 2, type: "mc", q: R`Ένα ποδήλατο έχει τροχούς με ακτίνες $R$ και $\rho < R$. Για την ίδια απόσταση ο μεγάλος κάνει $\nu$ στροφές και ο μικρός $2\nu$. Τότε:`,
      options: ["$R = 2\\rho$", "$\\rho = 2R$", "$R = \\rho + 2$", "$R^2 = 2\\rho^2$"], correct: 0,
      hint: R`$2\pi R\nu = 2\pi\rho\cdot 2\nu$.`,
      sol: R`Ίδια απόσταση: $2\pi R\nu = 4\pi\rho\nu \Rightarrow R = 2\rho$.` },
    { level: 3, type: "mc", q: R`Σε ευθεία παίρνουμε διαδοχικά σημεία $A, B, \Gamma, \Delta$. Αν $L_1, L_2, L_3, L$ τα μήκη των κύκλων με διαμέτρους $AB, B\Gamma, \Gamma\Delta, A\Delta$, τότε:`,
      options: ["$L_1 + L_2 + L_3 = L$", "$L_1 + L_2 + L_3 > L$", "$L_1 + L_2 + L_3 < L$", "εξαρτάται από τις θέσεις"], correct: 0,
      hint: R`$L = \pi\delta$.`,
      sol: R`$L_1 + L_2 + L_3 = \pi(AB + B\Gamma + \Gamma\Delta) = \pi\cdot A\Delta = L$.` },
    { level: 1, type: "fields", q: R`Να βρείτε το μήκος τεταρτοκυκλίου ακτίνας $6$ cm.`,
      fields: [{ label: "ℓ (cm) =", ans: "3π", tol: 0.003 }],
      hint: R`$\mu = 90^\circ$.`,
      sol: R`$\ell = \frac{\pi\cdot 6\cdot 90}{180} = 3\pi$ cm.` }
  ]
},
/* ───────────────────────────── 9.5.3 ───────────────────────────── */
{
  id: "9.5.3", unit: 9, title: "Εμβαδόν δίσκου, τομέα, τμήματος – Μικτόγραμμα σχήματα",
  book: "Γ΄ Τεύχος §9.5",
  theory: R`
<div class="tbox"><h4>Εμβαδά</h4>
<ul><li><b>Κυκλικός δίσκος</b>: $E = \pi R^2 = \frac{\pi\delta^2}{4}$.</li>
<li><b>Κυκλικός τομέας</b> γωνίας $\mu^\circ$: $E = \frac{\pi R^2\mu}{360}$.</li>
<li><b>Κυκλικό τμήμα</b> (μεταξύ χορδής $AB$ και τόξου $\mu < 180^\circ$): $E = E_{τομέα} - E_{KAB} = \frac{\pi R^2\mu}{360} - \frac12R^2\text{ημ}\mu$.</li>
<li><b>Κυκλικός δακτύλιος</b> (ομόκεντροι κύκλοι $R > \rho$): $E = \pi(R^2 - \rho^2)$.</li></ul></div>

<div class="tbox tip"><h4>Καμπυλόγραμμα και μικτόγραμμα σχήματα</h4>
<p>Το εμβαδόν τους το βρίσκουμε ως <b>άθροισμα ή διαφορά</b> γνωστών εμβαδών (τρίγωνα, τετράγωνα, τομείς, τμήματα). Η περίμετρος είναι το άθροισμα των ευθύγραμμων τμημάτων και των <b>μηκών των τόξων</b> που την αποτελούν.</p>
<p>Π.χ. ισοσκελές ορθογώνιο τρίγωνο με κάθετες $2$, μείον τομέα $45^\circ$ ακτίνας $2$: $E = 2 - \frac{\pi\cdot 4\cdot 45}{360} = 2 - \frac\pi2$.</p></div>`,
  widget: "sector",
  gen: "garc",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε το εμβαδόν κυκλικού δίσκου με διάμετρο $10$ cm.`,
      fields: [{ label: "Ε (cm²) =", ans: "25π", tol: 0.003 }],
      hint: R`$E = \frac{\pi\delta^2}{4}$.`,
      sol: R`$E = \frac{100\pi}{4} = 25\pi$ cm².` },
    { level: 1, type: "fields", q: R`Να βρείτε το εμβαδόν κυκλικού τομέα ακτίνας $6$ cm και γωνίας $120^\circ$.`,
      fields: [{ label: "Ε (cm²) =", ans: "12π", tol: 0.003 }],
      hint: R`$\frac{120}{360} = \frac13$ του δίσκου.`,
      sol: R`$E = \frac{\pi\cdot 36\cdot 120}{360} = 12\pi$ cm².` },
    { level: 2, type: "fields", q: R`Τόξο $60^\circ$ κύκλου έχει μήκος $4\pi$ cm. Να βρείτε το εμβαδόν του κυκλικού δίσκου.`,
      fields: [{ label: "Ε (cm²) =", ans: "144π", tol: 0.003 }],
      hint: R`Πρώτα την ακτίνα: $\frac{\pi R\cdot 60}{180} = 4\pi$.`,
      sol: R`$R = 12$, $E = 144\pi$ cm².` },
    { level: 1, type: "fields", q: R`Να βρείτε το εμβαδόν του κυκλικού δακτυλίου μεταξύ ομόκεντρων κύκλων ακτίνων $5$ cm και $3$ cm.`,
      fields: [{ label: "Ε (cm²) =", ans: "16π", tol: 0.003 }],
      hint: R`$\pi(R^2 - \rho^2)$.`,
      sol: R`$\pi(25 - 9) = 16\pi$ cm².` },
    { level: 2, type: "fields", q: R`Σε κύκλο ακτίνας $6$ cm η χορδή $AB$ αντιστοιχεί σε τόξο $60^\circ$. Να βρείτε το εμβαδόν του κυκλικού τμήματος.`,
      fields: [{ label: "Ε (cm²) =", ans: "6π-9√3", tol: 0.003 }],
      hint: R`Τομέας μείον το ισόπλευρο τρίγωνο $KAB$.`,
      sol: R`$E_{τομέα} = \frac{36\pi}{6} = 6\pi$. Το $KAB$ είναι ισόπλευρο πλευράς $6$: $\frac{36\sqrt3}{4} = 9\sqrt3$. Άρα $E = 6\pi - 9\sqrt3 \approx 3{,}26$ cm².` },
    { level: 2, type: "fields", q: R`Το τρίγωνο $AB\Gamma$ είναι ορθογώνιο ισοσκελές με υποτείνουσα $B\Gamma = 2\sqrt2$ cm. Το τόξο $A\Delta$ ανήκει στον κύκλο $(\Gamma, \Gamma A)$, με $\Delta$ πάνω στη $B\Gamma$. Να βρείτε την περίμετρο και το εμβαδόν του μικτόγραμμου τριγώνου $A\Delta B$.`,
      fields: [{ label: "Π (cm) =", ans: "2√2+π/2", tol: 0.003 }, { label: "Ε (cm²) =", ans: "2-π/2", tol: 0.003 }],
      hint: R`$AB = A\Gamma = 2$, $\hat\Gamma = 45^\circ$, $B\Delta = 2\sqrt2 - 2$.`,
      sol: R`Τόξο $A\Delta$: $\frac{\pi\cdot 2\cdot 45}{180} = \frac\pi2$. $\Pi = AB + B\Delta + \ell = 2 + (2\sqrt2 - 2) + \frac\pi2 = 2\sqrt2 + \frac\pi2$. $E = E_{AB\Gamma} - E_{τομέα} = 2 - \frac\pi2$ cm².` },
    { level: 3, type: "fields", q: R`Το $AB\Gamma\Delta$ είναι τετράγωνο πλευράς $8$ cm. Με κέντρα τις κορυφές και ακτίνα $4$ cm γράφουμε τέσσερα τεταρτοκύκλια μέσα στο τετράγωνο. Να βρείτε την περίμετρο και το εμβαδόν του καμπυλόγραμμου σχήματος που σχηματίζεται στο κέντρο.`,
      fields: [{ label: "Π (cm) =", ans: "8π", tol: 0.003 }, { label: "Ε (cm²) =", ans: "64-16π", tol: 0.003 }],
      hint: R`Τα τέσσερα τεταρτοκύκλια μαζί κάνουν έναν κύκλο ακτίνας $4$.`,
      sol: R`Η περίμετρος αποτελείται από $4$ τόξα $90^\circ$ ακτίνας $4$: $2\pi\cdot 4 = 8\pi$ cm. $E = 64 - \pi\cdot 16 = 64 - 16\pi \approx 13{,}73$ cm².` },
    { level: 3, type: "fields", q: R`Τρεις ίσοι κύκλοι ακτίνας $\rho = 2$ εφάπτονται εξωτερικά ανά δύο. Να βρείτε το εμβαδόν του καμπυλόγραμμου τριγώνου που σχηματίζεται ανάμεσά τους.`,
      fields: [{ label: "Ε =", ans: "4√3-2π", tol: 0.01 }],
      hint: R`Τα κέντρα σχηματίζουν ισόπλευρο τρίγωνο πλευράς $2\rho = 4$. Αφαίρεσε τρεις τομείς $60^\circ$.`,
      sol: R`Ισόπλευρο πλευράς $4$: $\frac{16\sqrt3}{4} = 4\sqrt3$. Τρεις τομείς $60^\circ$ = μισός δίσκος: $\frac{\pi\cdot 4}{2} = 2\pi$. $E = 4\sqrt3 - 2\pi \approx 0{,}65$.` }
  ]
},
/* ───────────────────────────── 10.2 ───────────────────────────── */
{
  id: "10.2", unit: 10, title: "Παράγωγος αριθμός – Παράγωγος συνάρτηση",
  book: "Γ΄ Τεύχος §10.1–10.3",
  theory: R`
<div class="tbox"><h4>Μέσος ρυθμός μεταβολής</h4>
<p>Στο διάστημα $[x_1, x_2]$: $\ \dfrac{\Delta y}{\Delta x} = \dfrac{f(x_2) - f(x_1)}{x_2 - x_1}$ — είναι η κλίση της ευθείας (τέμνουσας) που ενώνει τα σημεία $(x_1, f(x_1))$, $(x_2, f(x_2))$.</p></div>

<div class="tbox"><h4>Παράγωγος αριθμός</h4>
<p>Η $f$ είναι <b>παραγωγίσιμη</b> στο $x_0$ αν το παρακάτω όριο υπάρχει και είναι πραγματικός αριθμός:</p>
$$f'(x_0) = \lim_{x\to x_0}\frac{f(x) - f(x_0)}{x - x_0} = \lim_{h\to 0}\frac{f(x_0 + h) - f(x_0)}{h}$$
<p>Είναι ο <b>στιγμιαίος ρυθμός μεταβολής</b> της $f$ στο $x_0$ (π.χ. αν $s(t)$ η θέση, τότε $s'(t_0)$ η ταχύτητα τη στιγμή $t_0$).</p></div>

<div class="tbox tip"><h4>Παράγωγος συνάρτηση — βήματα με τον ορισμό</h4>
<ol><li>Υπολογίζουμε $f(x + h) - f(x)$ και απλοποιούμε.</li>
<li>Διαιρούμε με $h$ (βγαίνει κοινός παράγοντας $h$).</li>
<li>Παίρνουμε όριο για $h \to 0$.</li></ol>
<p>Π.χ. $f(x) = x^2$: $\frac{(x + h)^2 - x^2}{h} = \frac{2xh + h^2}{h} = 2x + h \to 2x$, άρα $f'(x) = 2x$.</p></div>
<div class="tbox tip"><h4>Παραγωγισιμότητα και συνέχεια</h4>
<p>Αν η $f$ είναι <b>παραγωγίσιμη</b> στο $x_0$, τότε είναι και <b>συνεχής</b> στο $x_0$. Το αντίστροφο δεν ισχύει: η $f(x) = |x|$ είναι συνεχής στο $0$, αλλά $\lim_{h\to 0^-}\frac{|h|}{h} = -1 \ne 1 = \lim_{h\to 0^+}\frac{|h|}{h}$, άρα δεν είναι παραγωγίσιμη εκεί («γωνία» στη γραφική παράσταση).</p></div>`,
  widget: "secant",
  gen: "grate",
  exercises: [
    { level: 1, type: "fields", q: R`Για $f(x) = x^2$ να υπολογίσετε τον μέσο ρυθμό μεταβολής $\frac{\Delta y}{\Delta x}$ στα διαστήματα $[3, 5]$ και $[3;\ 3{,}1]$.`,
      fields: [{ label: "[3, 5]:", ans: 8 }, { label: "[3; 3,1]:", ans: 6.1 }],
      hint: R`$\frac{f(5) - f(3)}{2}$.`,
      sol: R`$\frac{25 - 9}{2} = 8$, $\ \frac{9{,}61 - 9}{0{,}1} = 6{,}1$. Καθώς το διάστημα μικραίνει, ο λόγος πλησιάζει το $f'(3) = 6$.` },
    { level: 1, type: "fields", q: R`Με τον ορισμό, να βρείτε: (α) $f'(4)$ για $f(x) = -2$, (β) $f'(-1)$ για $f(x) = -3x + 1$.`,
      fields: [{ label: "(α) =", ans: 0 }, { label: "(β) =", ans: -3 }],
      hint: R`(β) $f(-1 + h) - f(-1) = -3h$.`,
      sol: R`(α) $\frac{-2 - (-2)}{h} = 0 \to 0$. (β) $\frac{-3(-1 + h) + 1 - 4}{h} = \frac{-3h}{h} = -3$.` },
    { level: 2, type: "fields", q: R`Με τον ορισμό, να βρείτε τον παράγωγο αριθμό της $f(x) = x^2 - x + 5$ στο $x_0 = 0$.`,
      fields: [{ label: "f′(0) =", ans: -1 }],
      hint: R`$\frac{f(h) - f(0)}{h} = \frac{h^2 - h}{h}$.`,
      sol: R`$\frac{h^2 - h + 5 - 5}{h} = h - 1 \to -1$.` },
    { level: 2, type: "fields", q: R`Με τον ορισμό, να βρείτε τον παράγωγο αριθμό της $f(x) = \frac1x$ στο $x_0 = 1$.`,
      fields: [{ label: "f′(1) =", ans: -1 }],
      hint: R`$\frac{1}{1 + h} - 1 = \frac{-h}{1 + h}$.`,
      sol: R`$\frac{f(1 + h) - f(1)}{h} = \frac{-h}{h(1 + h)} = -\frac{1}{1 + h} \to -1$.` },
    { level: 2, type: "expr", label: "f′(x) =", q: R`Με τον ορισμό, να βρείτε την παράγωγο συνάρτηση της $f(x) = x^2 + x - 2$.`,
      ref: "2x+1", key: "2x+1",
      hint: R`$f(x + h) - f(x) = 2xh + h^2 + h$.`,
      sol: R`$\frac{(x + h)^2 + (x + h) - 2 - x^2 - x + 2}{h} = \frac{2xh + h^2 + h}{h} = 2x + h + 1 \to 2x + 1$.` },
    { level: 2, type: "expr", label: "f′(x) =", q: R`Με τον ορισμό, να βρείτε την παράγωγο της $f(x) = x^3 - 2$.`,
      ref: "3x^2", key: "3x^2",
      hint: R`$(x + h)^3 = x^3 + 3x^2h + 3xh^2 + h^3$.`,
      sol: R`$\frac{(x + h)^3 - x^3}{h} = 3x^2 + 3xh + h^2 \to 3x^2$.` },
    { level: 2, type: "fields", q: R`Ένα σώμα κινείται ευθύγραμμα και η θέση του (σε m) τη χρονική στιγμή $t$ (σε s) είναι $s(t) = 5t^2$. Να βρείτε τη μέση ταχύτητα στο $[2, 4]$ και τη στιγμιαία ταχύτητα τη στιγμή $t = 2$.`,
      fields: [{ label: "μέση (m/s) =", ans: 30 }, { label: "στιγμιαία (m/s) =", ans: 20 }],
      hint: R`Στιγμιαία ταχύτητα $= s'(2)$.`,
      sol: R`Μέση: $\frac{80 - 20}{2} = 30$ m/s. $\frac{5(2 + h)^2 - 20}{h} = 20 + 5h \to 20$ m/s.` },
    { level: 1, type: "mc", q: R`Ο παράγωγος αριθμός $f'(x_0)$ εκφράζει:`,
      options: ["τον στιγμιαίο ρυθμό μεταβολής της $f$ στο $x_0$", "την τιμή της $f$ στο $x_0$", "τον μέσο ρυθμό μεταβολής στο $[0, x_0]$", "το όριο της $f$ στο $x_0$"], correct: 0,
      hint: R`Είναι το όριο του μέσου ρυθμού μεταβολής.`,
      sol: R`$f'(x_0) = \lim_{h\to 0}\frac{\Delta y}{\Delta x}$: ο στιγμιαίος ρυθμός μεταβολής — και γεωμετρικά η κλίση της εφαπτομένης.` },
{ level: 1, type: "mc", q: R`Αν η $f$ είναι συνεχής στο $x_0$, τότε είναι και παραγωγίσιμη στο $x_0$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Σκέψου την $|x|$ στο $0$.`,
      sol: R`Λάθος: η $|x|$ είναι συνεχής στο $0$ αλλά δεν είναι παραγωγίσιμη εκεί. Ισχύει μόνο το αντίστροφο.` },
    { level: 2, type: "fields", q: R`Για την $f(x) = \begin{cases} x^2, & x \le 1 \\ 2x - 1, & x > 1\end{cases}$ να υπολογίσετε τα πλευρικά όρια του $\frac{f(1 + h) - f(1)}{h}$ για $h \to 0^-$ και $h \to 0^+$.`,
      fields: [{ label: "αριστερό =", ans: 2 }, { label: "δεξί =", ans: 2 }],
      hint: R`$f(1) = 1$.`,
      sol: R`Αριστερά: $\frac{(1 + h)^2 - 1}{h} = 2 + h \to 2$. Δεξιά: $\frac{2(1 + h) - 1 - 1}{h} = 2$. Ίσα, άρα $f'(1) = 2$.` },
    { level: 2, type: "mc", q: R`Η $f(x) = x\sqrt x$, $x \ge 0$, στο $x_0 = 0$:`,
      options: ["είναι παραγωγίσιμη με $f'(0) = 0$", "δεν είναι παραγωγίσιμη", "δεν είναι συνεχής", "έχει $f'(0) = 1$"], correct: 0,
      hint: R`$\frac{f(h) - f(0)}{h} = \sqrt h$, $h > 0$.`,
      sol: R`$\lim_{h\to 0^+}\frac{h\sqrt h}{h} = \lim_{h\to 0^+}\sqrt h = 0$: παραγωγίσιμη (από δεξιά, όπου ορίζεται) με $f'(0) = 0$.` }
  ]
},
/* ───────────────────────────── 10.4 ───────────────────────────── */
{
  id: "10.4", unit: 10, title: "Παράγωγος βασικών συναρτήσεων – Κανόνες",
  book: "Γ΄ Τεύχος §10.4 · Δραστηριότητες σελ. 89–90",
  theory: R`
<div class="tbox"><h4>Βασικές παράγωγοι</h4>
<table class="mini"><tr><th>$f(x)$</th><td>$c$</td><td>$x$</td><td>$x^\nu$</td></tr><tr><th>$f'(x)$</th><td>$0$</td><td>$1$</td><td>$\nu x^{\nu - 1}$</td></tr></table>
<p>Ο τύπος $(x^r)' = r x^{r - 1}$ ισχύει για κάθε πραγματικό εκθέτη (για $x > 0$ όταν ο εκθέτης δεν είναι ακέραιος): $\left(\frac1x\right)' = (x^{-1})' = -\frac{1}{x^2}$, $\ (x^\pi)' = \pi x^{\pi - 1}$.</p></div>

<div class="tbox"><h4>Κανόνες</h4>
$$(f \pm g)' = f' \pm g' \qquad (c\cdot f)' = c\cdot f'$$
$$(f\cdot g)' = f'g + fg' \qquad \left(\frac fg\right)' = \frac{f'g - fg'}{g^2}$$</div>

<div class="tbox tip"><h4>Προσοχή</h4>
<ul><li>Η παράγωγος γινομένου <b>δεν</b> είναι το γινόμενο των παραγώγων.</li>
<li>Στο πηλίκο: «παράγωγος αριθμητή επί παρονομαστή <b>μείον</b> αριθμητής επί παράγωγο παρονομαστή, προς παρονομαστή στο τετράγωνο».</li>
<li>Συχνά είναι πιο γρήγορο να κάνουμε πρώτα τις πράξεις: $(x - 4)(x + 5) = x^2 + x - 20$, άρα $f'(x) = 2x + 1$.</li></ul></div>
<div class="tbox"><h4>Παράγωγος της $e^x$</h4>
<p>$\left(e^x\right)' = e^x$ για κάθε $x \in \mathbb{R}$: η $e^x$ (και κάθε $c\,e^x$) ισούται με την παράγωγό της. Π.χ. $(3e^x)' = 3e^x$, $(x^e)' = e\,x^{e - 1}$.</p></div>`,
  widget: "derivplot",
  gen: "gderiv",
  exercises: [
    { level: 1, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = x^3 + x - 4$.`, ref: "3x^2+1", key: "3x^2+1",
      hint: R`Όρο-όρο.`, sol: R`$f'(x) = 3x^2 + 1$.` },
    { level: 1, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = 3x^2 + x - 7$.`, ref: "6x+1", key: "6x+1",
      hint: R`$(3x^2)' = 6x$.`, sol: R`$f'(x) = 6x + 1$.` },
    { level: 1, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = x^{-6}$.`, ref: "-6x^(-7)", key: "-6x^(-7)",
      hint: R`$(x^r)' = rx^{r - 1}$.`, sol: R`$f'(x) = -6x^{-7} = -\frac{6}{x^7}$.` },
    { level: 2, type: "expr", label: "f′(x) =", pos: true, q: R`Να βρείτε την παράγωγο της $f(x) = x^\pi$, $x > 0$.`, ref: "π x^(π-1)", key: "π x^(π-1)",
      hint: R`Ο $\pi$ είναι απλώς ένας πραγματικός εκθέτης.`, sol: R`$f'(x) = \pi x^{\pi - 1}$.` },
    { level: 2, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = (x - 4)(x + 5)$.`, ref: "2x+1", key: "2x+1",
      hint: R`Κανόνας γινομένου ή πρώτα επιμεριστική.`, sol: R`$f'(x) = 1\cdot(x + 5) + (x - 4)\cdot 1 = 2x + 1$.` },
    { level: 2, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = 4x^7(x^2 + 2x - 3)$.`, ref: "36x^8+64x^7-84x^6", key: "36x^8+64x^7-84x^6",
      hint: R`$f(x) = 4x^9 + 8x^8 - 12x^7$.`, sol: R`$f'(x) = 36x^8 + 64x^7 - 84x^6$.` },
    { level: 2, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = \dfrac{x}{x - 1}$, $x \ne 1$.`, ref: "-1/(x-1)^2", key: "-1/(x-1)^2",
      hint: R`Κανόνας πηλίκου.`, sol: R`$f'(x) = \frac{1\cdot(x - 1) - x\cdot 1}{(x - 1)^2} = -\frac{1}{(x - 1)^2}$.` },
    { level: 3, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = \dfrac{x^2 - 2x + 2}{x - 4}$, $x \ne 4$.`, ref: "(x^2-8x+6)/(x-4)^2", key: "(x^2-8x+6)/(x-4)^2",
      hint: R`Αριθμητής: $(2x - 2)(x - 4) - (x^2 - 2x + 2)$.`, sol: R`$f'(x) = \frac{(2x - 2)(x - 4) - (x^2 - 2x + 2)}{(x - 4)^2} = \frac{x^2 - 8x + 6}{(x - 4)^2}$.` },
    { level: 2, type: "mc", q: R`Αν $f(x) = x^3(x^4 - 2x)$, τότε $f'(x) = 3x^2(4x^3 - 2)$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Η παράγωγος γινομένου δεν είναι γινόμενο παραγώγων.`,
      sol: R`Λάθος. $f(x) = x^7 - 2x^4$, άρα $f'(x) = 7x^6 - 8x^3$, ενώ $3x^2(4x^3 - 2) = 12x^5 - 6x^2$.` },
    { level: 2, type: "fields", q: R`Αν $f'(1) = 4$, να υπολογίσετε την παράγωγο της $g(x) = 4f(x) - 1$ στο $x = 1$.`,
      fields: [{ label: "g′(1) =", ans: 16 }],
      hint: R`$(c\cdot f)' = c\cdot f'$ και η παράγωγος σταθεράς είναι $0$.`,
      sol: R`$g'(x) = 4f'(x)$, άρα $g'(1) = 16$.` },
{ level: 1, type: "fields", q: R`Για την $f(x) = 3e^x$ να υπολογίσετε το $f'(\ln 2)$.`,
      fields: [{ label: "f′(ln2) =", ans: 6 }],
      hint: R`$e^{\ln 2} = 2$.`, sol: R`$f'(x) = 3e^x$, $f'(\ln 2) = 3\cdot 2 = 6$.` },
    { level: 1, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = e^x + \dfrac{1}{x^2}$, $x \ne 0$.`,
      ref: "exp(x)-2/x^3", key: "exp(x)-2/x^3",
      hint: R`$\frac{1}{x^2} = x^{-2}$.`, sol: R`$f'(x) = e^x - 2x^{-3} = e^x - \frac{2}{x^3}$.` },
    { level: 2, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = x^2 e^x$.`,
      ref: "exp(x)*(x^2+2x)", key: "exp(x)*(x^2+2x)",
      hint: R`Κανόνας γινομένου.`, sol: R`$f'(x) = 2x e^x + x^2 e^x = e^x(x^2 + 2x)$.` },
    { level: 2, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = e^x(2e^x - 3)$.`,
      ref: "4exp(x)^2-3exp(x)", key: "4exp(x)^2-3exp(x)",
      hint: R`Πρώτα πράξεις: $2e^{2x} - 3e^x$, ή κανόνας γινομένου.`, sol: R`$f'(x) = e^x(2e^x - 3) + e^x\cdot 2e^x = 4e^{2x} - 3e^x$.` },
    { level: 2, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = \dfrac{x}{e^x}$.`,
      ref: "(1-x)/exp(x)", key: "(1-x)/exp(x)",
      hint: R`Κανόνας πηλίκου.`, sol: R`$f'(x) = \frac{e^x - xe^x}{e^{2x}} = \frac{1 - x}{e^x}$.` },
    { level: 3, type: "fields", q: R`Αν $f(x) = \alpha x^3 + \beta x^2 + \gamma x + \delta$ και $f(1) = f'(1) = f''(1) = f'''(1) = 2$, να βρείτε τα $\alpha, \beta, \gamma, \delta$.`,
      fields: [{ label: "α =", ans: "1/3" }, { label: "β =", ans: 0 }, { label: "γ =", ans: 1 }, { label: "δ =", ans: "2/3" }],
      hint: R`$f''' = 6\alpha$, $f''(1) = 6\alpha + 2\beta$, $f'(1) = 3\alpha + 2\beta + \gamma$.`,
      sol: R`$6\alpha = 2 \Rightarrow \alpha = \frac13$. $2 + 2\beta = 2 \Rightarrow \beta = 0$. $1 + \gamma = 2 \Rightarrow \gamma = 1$. $\frac13 + 1 + \delta = 2 \Rightarrow \delta = \frac23$.` }
  ]
},
/* ───────────────────────────── 10.5 ───────────────────────────── */
{
  id: "10.5", unit: 10, title: "Παράγωγος τριγωνομετρικών συναρτήσεων",
  book: "Γ΄ Τεύχος §10.5 · Δραστηριότητες σελ. 96",
  theory: R`
<div class="tbox"><h4>Τύποι ($x$ σε ακτίνια)</h4>
$$(\text{ημ}x)' = \text{συν}x \qquad (\text{συν}x)' = -\text{ημ}x$$
$$(\text{εφ}x)' = \frac{1}{\text{συν}^2x} = \text{τεμ}^2x \qquad (\text{σφ}x)' = -\frac{1}{\text{ημ}^2x} = -\text{στεμ}^2x$$
<p>όπου $\text{τεμ}x = \frac{1}{\text{συν}x}$, $\text{στεμ}x = \frac{1}{\text{ημ}x}$. Οι δύο πρώτοι προκύπτουν από τον ορισμό με τα όρια $\frac{\text{ημ}h}{h} \to 1$, $\frac{1 - \text{συν}h}{h} \to 0$· οι άλλοι με τον κανόνα του πηλίκου.</p></div>

<div class="tbox tip"><h4>Ανώτερης τάξης</h4>
<p>$(\text{ημ}x)'' = -\text{ημ}x$, $(\text{συν}x)'' = -\text{συν}x$: για $f(x) = \text{ημ}x + \text{συν}x$ ισχύει $f + f'' = 0$. Οι παράγωγοι της $\text{ημ}x$ επαναλαμβάνονται ανά $4$.</p>
<p><i>Στο πεδίο απάντησης γράψε π.χ. <code>συνx - x ημx</code> ή <code>cos(x)-x*sin(x)</code>.</i></p></div>`,
  widget: "derivplot",
  gen: "gtrigder",
  exercises: [
    { level: 1, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = 2\,\text{ημ}x - \text{συν}x$.`,
      ref: "2cos(x)+sin(x)", key: "2cos(x)+sin(x)", hint: R`Όρο-όρο.`, sol: R`$f'(x) = 2\,\text{συν}x + \text{ημ}x$.` },
    { level: 1, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = x\,\text{εφ}x$.`,
      ref: "tan(x)+x/cos(x)^2", key: "tan(x)+x/cos(x)^2", hint: R`Γινόμενο.`, sol: R`$f'(x) = \text{εφ}x + \frac{x}{\text{συν}^2x}$.` },
    { level: 2, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = e^x\,\text{ημ}x$.`,
      ref: "exp(x)*(sin(x)+cos(x))", key: "exp(x)*(sin(x)+cos(x))", hint: R`Γινόμενο.`, sol: R`$f'(x) = e^x\text{ημ}x + e^x\text{συν}x = e^x(\text{ημ}x + \text{συν}x)$.` },
    { level: 2, type: "expr", label: "y′ =", q: R`Να βρείτε την παράγωγο της $y = \dfrac{1 - \text{συν}x}{1 + \text{ημ}x}$.`,
      ref: "(sin(x)*(1+sin(x))-(1-cos(x))*cos(x))/(1+sin(x))^2", key: "(sin(x)+1-cos(x))/(1+sin(x))^2",
      hint: R`Πηλίκο· στον αριθμητή $\text{ημ}^2x + \text{συν}^2x = 1$.`,
      sol: R`$y' = \frac{\text{ημ}x(1 + \text{ημ}x) - (1 - \text{συν}x)\text{συν}x}{(1 + \text{ημ}x)^2} = \frac{\text{ημ}x - \text{συν}x + 1}{(1 + \text{ημ}x)^2}$.` },
    { level: 2, type: "expr", label: "y′ =", q: R`Να βρείτε την παράγωγο της $y = \dfrac{1}{\text{ημ}x\,\text{συν}x}$.`,
      ref: "-(cos(x)^2-sin(x)^2)/(sin(x)*cos(x))^2", key: "-(cos(x)^2-sin(x)^2)/(sin(x)*cos(x))^2",
      hint: R`$(\text{ημ}x\,\text{συν}x)' = \text{συν}^2x - \text{ημ}^2x$.`,
      sol: R`$y' = -\frac{\text{συν}^2x - \text{ημ}^2x}{\text{ημ}^2x\,\text{συν}^2x} = -\frac{\text{συν}2x}{\text{ημ}^2x\,\text{συν}^2x}$.` },
    { level: 2, type: "fields", q: R`Για $f(x) = \text{συν}x + \text{ημ}x$ να βρείτε το $\lambda$ ώστε $\lambda f'\left(\frac\pi2\right) - 2f\left(\frac\pi2\right) = 2$.`,
      fields: [{ label: "λ =", ans: -4 }],
      hint: R`$f\left(\frac\pi2\right) = 1$, $f'\left(\frac\pi2\right) = -1$.`,
      sol: R`$f'(x) = -\text{ημ}x + \text{συν}x$. $-\lambda - 2 = 2 \Rightarrow \lambda = -4$.` },
    { level: 1, type: "mc", q: R`Αν $f(x) = \text{ημ}x$, τότε $f''(x) = $`,
      options: ["$-\\text{ημ}x$", "$\\text{ημ}x$", "$-\\text{συν}x$", "$\\text{συν}x$"], correct: 0,
      hint: R`$f' = \text{συν}x$.`, sol: R`$f'' = (\text{συν}x)' = -\text{ημ}x$.` },
    { level: 2, type: "fields", q: R`Η $f(x) = \begin{cases} x^2 + x, & x \le 0 \\ \text{ημ}x, & x > 0\end{cases}$ είναι παραγωγίσιμη στο $0$; Υπολογίστε τις πλευρικές παραγώγους στο $0$.`,
      fields: [{ label: "αριστερή =", ans: 1 }, { label: "δεξιά =", ans: 1 }],
      hint: R`Αριστερά $(x^2 + x)' = 2x + 1$, δεξιά $\text{συν}x$· η $f$ είναι συνεχής στο $0$.`,
      sol: R`Αριστερή $2\cdot 0 + 1 = 1$, δεξιά $\text{συν}0 = 1$, και $f$ συνεχής στο $0$: $f'(0) = 1$.` },
    { level: 2, type: "fields", q: R`Να βρείτε την κλίση της εφαπτομένης της $f(x) = \text{εφ}x$ στο $x_0 = \frac\pi4$ και της $g(x) = x\,\text{συν}x$ στο $x_0 = \pi$.`,
      fields: [{ label: "f′(π/4) =", ans: 2 }, { label: "g′(π) =", ans: -1 }],
      hint: R`$f' = \frac{1}{\text{συν}^2x}$, $g' = \text{συν}x - x\,\text{ημ}x$.`,
      sol: R`$f'\left(\frac\pi4\right) = \frac{1}{1/2} = 2$. $g'(\pi) = -1 - \pi\cdot 0 = -1$.` }
  ]
},
/* ───────────────────────────── 10.6 ───────────────────────────── */
{
  id: "10.6", unit: 10, title: "Παράγωγος σύνθετης συνάρτησης",
  book: "Γ΄ Τεύχος §10.6 · Δραστηριότητες σελ. 102–104",
  theory: R`
<div class="tbox"><h4>Κανόνας της αλυσίδας</h4>
<p>Αν η $g$ είναι παραγωγίσιμη στο $x$ και η $f$ στο $g(x)$, τότε</p>
$$\big(f(g(x))\big)' = f'(g(x))\cdot g'(x) \qquad \text{ή} \qquad \frac{dy}{dx} = \frac{dy}{du}\cdot\frac{du}{dx}$$
<p>«Παράγωγος της εξωτερικής (με την εσωτερική μέσα) επί παράγωγο της εσωτερικής».</p></div>

<div class="tbox"><h4>Γενικευμένοι τύποι ($u = g(x)$)</h4>
<table class="mini"><tr><th>$y$</th><td>$u^\nu$</td><td>$\sqrt u$</td><td>$e^u$</td><td>$\text{ημ}u$</td><td>$\text{συν}u$</td><td>$\text{εφ}u$</td></tr>
<tr><th>$y'$</th><td>$\nu u^{\nu-1}u'$</td><td>$\frac{u'}{2\sqrt u}$</td><td>$e^u u'$</td><td>$\text{συν}u\cdot u'$</td><td>$-\text{ημ}u\cdot u'$</td><td>$\frac{u'}{\text{συν}^2u}$</td></tr></table></div>

<div class="tbox tip"><h4>Προσοχή – ρυθμοί μεταβολής</h4>
<p>$(\text{ημ}2x)' = 2\,\text{συν}2x$ (όχι $\text{συν}2x$). $(\text{ημ}^2x)' = 2\,\text{ημ}x\,\text{συν}x = \text{ημ}2x$. Αν μια ποσότητα εξαρτάται από το $\alpha$ και το $\alpha$ από τον χρόνο $t$: $\frac{dE}{dt} = \frac{dE}{d\alpha}\cdot\frac{d\alpha}{dt}$.</p></div>`,
  widget: "derivplot",
  gen: "gchain",
  exercises: [
    { level: 1, type: "mc", q: R`Ισχύει $(\text{ημ}2x)' = \text{συν}2x$ για κάθε $x \in \mathbb{R}$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Παράγωγος της εσωτερικής.`, sol: R`Λάθος: $(\text{ημ}2x)' = 2\,\text{συν}2x$.` },
    { level: 1, type: "mc", q: R`Για $f(x) = e^{x^2}$ ισχύει $f'(0) = 0$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`$f'(x) = 2x e^{x^2}$.`, sol: R`Σωστό: $f'(0) = 0\cdot e^0 = 0$.` },
    { level: 1, type: "expr", label: "y′ =", q: R`Να βρείτε την παράγωγο της $y = \text{ημ}3x$.`,
      ref: "3cos(3x)", key: "3cos(3x)", hint: R`$u = 3x$.`, sol: R`$y' = 3\,\text{συν}3x$.` },
    { level: 1, type: "expr", label: "y′ =", q: R`Να βρείτε την παράγωγο της $y = \text{συν}(x^2 + 1)$.`,
      ref: "-2x*sin(x^2+1)", key: "-2x*sin(x^2+1)", hint: R`$u = x^2 + 1$.`, sol: R`$y' = -2x\,\text{ημ}(x^2 + 1)$.` },
    { level: 1, type: "expr", label: "y′ =", q: R`Να βρείτε την παράγωγο της $y = e^{-x}$.`,
      ref: "-exp(-x)", key: "-exp(-x)", hint: R`$u = -x$.`, sol: R`$y' = -e^{-x}$.` },
    { level: 2, type: "expr", label: "y′ =", q: R`Να βρείτε την παράγωγο της $y = (x^3 - 2x + 6)^5$.`,
      ref: "5(x^3-2x+6)^4*(3x^2-2)", key: "5(x^3-2x+6)^4*(3x^2-2)", hint: R`$\nu u^{\nu-1}u'$.`, sol: R`$y' = 5(x^3 - 2x + 6)^4(3x^2 - 2)$.` },
    { level: 2, type: "expr", label: "y′ =", q: R`Να βρείτε την παράγωγο της $y = \sqrt{x^2 + 1}$.`,
      ref: "x/sqrt(x^2+1)", key: "x/sqrt(x^2+1)", hint: R`$\frac{u'}{2\sqrt u}$.`, sol: R`$y' = \frac{2x}{2\sqrt{x^2 + 1}} = \frac{x}{\sqrt{x^2 + 1}}$.` },
    { level: 2, type: "expr", label: "y′ =", q: R`Να βρείτε την παράγωγο της $y = \text{συν}^2 4x$.`,
      ref: "-8sin(4x)cos(4x)", key: "-4sin(8x)", hint: R`$u = \text{συν}4x$, $y = u^2$.`, sol: R`$y' = 2\,\text{συν}4x\cdot(-4\,\text{ημ}4x) = -8\,\text{ημ}4x\,\text{συν}4x = -4\,\text{ημ}8x$.` },
    { level: 2, type: "expr", label: "y′ =", q: R`Να βρείτε την παράγωγο της $y = e^{\text{ημ}x}$.`,
      ref: "cos(x)*exp(sin(x))", key: "cos(x)*exp(sin(x))", hint: R`$e^u u'$.`, sol: R`$y' = e^{\text{ημ}x}\,\text{συν}x$.` },
    { level: 3, type: "fields", q: R`Η παραγωγίσιμη $f: \mathbb{R} \to \mathbb{R}$ ικανοποιεί $f(x^3 + x + 1) = 7x^3 - x$ για κάθε $x$. Να βρείτε το $f'(3)$.`,
      fields: [{ label: "f′(3) =", ans: 5 }],
      hint: R`Παραγώγισε και τα δύο μέλη· $x^3 + x + 1 = 3$ για $x = 1$.`,
      sol: R`$f'(x^3 + x + 1)(3x^2 + 1) = 21x^2 - 1$. Για $x = 1$: $4f'(3) = 20 \Rightarrow f'(3) = 5$.` },
    { level: 2, type: "fields", q: R`Η πλευρά τετραγώνου είναι $\alpha(t) = t^2 + 1$ cm ($t$ σε s). Με ποιο ρυθμό (cm²/s) αυξάνεται το εμβαδόν τη στιγμή $t_0 = 1$;`,
      fields: [{ label: "E′(1) =", ans: 8 }],
      hint: R`$E(t) = (t^2 + 1)^2$, $E'(t) = 4t(t^2 + 1)$.`,
      sol: R`$E'(1) = 4\cdot 1\cdot 2 = 8$ cm²/s.` },
    { level: 3, type: "fields", q: R`Ο όγκος κύβου αυξάνεται με ρυθμό $7$ cm³/min. Όταν ο όγκος είναι $8$ cm³, με ποιο ρυθμό αυξάνονται η πλευρά (cm/min) και η επιφάνεια (cm²/min);`,
      fields: [{ label: "α′ =", ans: "7/12" }, { label: "S′ =", ans: 14 }],
      hint: R`$V = \alpha^3 \Rightarrow V' = 3\alpha^2\alpha'$, $S = 6\alpha^2 \Rightarrow S' = 12\alpha\alpha'$· $\alpha = 2$.`,
      sol: R`$7 = 3\cdot 4\cdot\alpha' \Rightarrow \alpha' = \frac{7}{12}$. $S' = 12\cdot 2\cdot\frac{7}{12} = 14$.` }
  ]
},
/* ───────────────────────────── 10.7 ───────────────────────────── */
{
  id: "10.7", unit: 10, title: "Γεωμετρική ερμηνεία – Εφαπτομένη",
  book: "Γ΄ Τεύχος §10.7",
  theory: R`
<div class="tbox"><h4>Κλίση της γραφικής παράστασης</h4>
<p>Η τέμνουσα που ενώνει τα $A(x_0, f(x_0))$ και $B(x, f(x))$ έχει κλίση $\frac{f(x) - f(x_0)}{x - x_0}$. Καθώς $x \to x_0$, η τέμνουσα πλησιάζει την <b>εφαπτομένη</b> στο $A$, άρα:</p>
$$\lambda_{εφ} = f'(x_0)$$</div>

<div class="tbox"><h4>Εξίσωση εφαπτομένης στο $A(x_0, f(x_0))$</h4>
$$y - f(x_0) = f'(x_0)(x - x_0)$$
<p>Βήματα: (1) $y_0 = f(x_0)$, (2) $f'(x)$ και $\lambda = f'(x_0)$, (3) αντικατάσταση και λύση ως προς $y$.</p></div>

<div class="tbox tip"><h4>Συνηθισμένα ερωτήματα</h4>
<ul><li><b>Οριζόντια</b> εφαπτομένη: $f'(x_0) = 0$.</li>
<li>Εφαπτομένη <b>παράλληλη</b> στην $y = \kappa x + \mu$: $f'(x_0) = \kappa$.</li>
<li>Αν η εφαπτομένη στο $A$ περνά και από σημείο $B$: $f'(x_0) = \lambda_{AB} = \frac{y_B - y_A}{x_B - x_A}$.</li></ul></div>`,
  widget: "secant",
  gen: "gtan",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε την κλίση της γραφικής παράστασης: (α) της $f(x) = -7$ στο $(2, -7)$, (β) της $f(x) = 3x$ στο $(-1, -3)$, (γ) της $f(x) = x^2 + 4$ στο $(2, 8)$.`,
      fields: [{ label: "(α) =", ans: 0 }, { label: "(β) =", ans: 3 }, { label: "(γ) =", ans: 4 }],
      hint: R`Κλίση $= f'(x_0)$.`,
      sol: R`(α) $f' = 0$. (β) $f' = 3$. (γ) $f'(x) = 2x$, $f'(2) = 4$.` },
    { level: 1, type: "fields", q: R`Να βρείτε την εξίσωση της εφαπτομένης της $f(x) = x^2$ στο σημείο $A(1, 1)$, στη μορφή $y = \lambda x + \beta$.`,
      fields: [{ label: "λ =", ans: 2 }, { label: "β =", ans: -1 }],
      hint: R`$f'(1) = 2$.`,
      sol: R`$y - 1 = 2(x - 1) \Rightarrow y = 2x - 1$.` },
    { level: 2, type: "fields", q: R`Να βρείτε την εφαπτομένη της $f(x) = x^3 - 1$ στο σημείο $A(0, f(0))$.`,
      fields: [{ label: "λ =", ans: 0 }, { label: "β =", ans: -1 }],
      hint: R`$f'(x) = 3x^2$.`,
      sol: R`$f(0) = -1$, $f'(0) = 0$: οριζόντια εφαπτομένη $y = -1$.` },
    { level: 2, type: "fields", q: R`Να βρείτε την εφαπτομένη της $f(x) = \dfrac{1}{x^2}$ στο σημείο $A(-1, f(-1))$.`,
      fields: [{ label: "λ =", ans: 2 }, { label: "β =", ans: 3 }],
      hint: R`$f(x) = x^{-2} \Rightarrow f'(x) = -2x^{-3}$.`,
      sol: R`$f(-1) = 1$, $f'(-1) = -2\cdot(-1)^{-3} = 2$. $y - 1 = 2(x + 1) \Rightarrow y = 2x + 3$.` },
    { level: 2, type: "fields", q: R`Δίνεται $f(x) = x^2 - x$. Να βρείτε το σημείο της γραφικής παράστασης στο οποίο η κλίση ισούται με $3$.`,
      fields: [{ label: "x =", ans: 2 }, { label: "y =", ans: 2 }],
      hint: R`$f'(x) = 2x - 1 = 3$.`,
      sol: R`$2x - 1 = 3 \Rightarrow x = 2$, $f(2) = 2$: σημείο $(2, 2)$.` },
    { level: 1, type: "fields", q: R`Η εφαπτομένη της γραφικής παράστασης μιας $f$ στο $A(-2, 1)$ διέρχεται από το $B(-3, -1)$. Να βρείτε το $f'(-2)$. Το ίδιο, αν η εφαπτομένη στο $\Gamma(3, -5)$ περνά από το $\Delta(-2, -4)$: να βρείτε το $f'(3)$.`,
      fields: [{ label: "f′(−2) =", ans: 2 }, { label: "f′(3) =", ans: "-1/5" }],
      hint: R`Κλίση ευθείας από δύο σημεία.`,
      sol: R`$f'(-2) = \frac{-1 - 1}{-3 + 2} = 2$. $\ f'(3) = \frac{-4 + 5}{-2 - 3} = -\frac15$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τα σημεία της γραφικής παράστασης της $f(x) = x^3 - 3x$ στα οποία η εφαπτομένη είναι οριζόντια.`,
      fields: [{ label: "1ο (μικρότερο x): x =", ans: -1 }, { label: "y =", ans: 2 }, { label: "2ο: x =", ans: 1 }, { label: "y =", ans: -2 }],
      hint: R`$f'(x) = 0$.`,
      sol: R`$3x^2 - 3 = 0 \Rightarrow x = \pm 1$. $f(-1) = 2$, $f(1) = -2$: σημεία $(-1, 2)$, $(1, -2)$.` },
    { level: 3, type: "fields", q: R`Να βρείτε την εφαπτομένη της $f(x) = x^2$ που είναι παράλληλη στην ευθεία $y = 4x + 1$.`,
      fields: [{ label: "λ =", ans: 4 }, { label: "β =", ans: -4 }],
      hint: R`Παράλληλη ⇒ ίδια κλίση: $f'(x_0) = 4$.`,
      sol: R`$2x_0 = 4 \Rightarrow x_0 = 2$, $f(2) = 4$. $y - 4 = 4(x - 2) \Rightarrow y = 4x - 4$.` }
  ]
},
/* ───────────────────────────── 10.8 ───────────────────────────── */
{
  id: "10.8", unit: 10, title: "Πεπλεγμένη συνάρτηση",
  book: "Γ΄ Τεύχος §10.8 · Δραστηριότητες σελ. 119",
  theory: R`
<div class="tbox"><h4>Η ιδέα</h4>
<p>Μια εξίσωση $F(x, y) = 0$ (π.χ. $x^2 + y^2 = 25$) μπορεί να ορίζει το $y$ ως συνάρτηση του $x$ χωρίς να μπορούμε (ή να χρειάζεται) να λύσουμε ως προς $y$. Λέμε ότι η $y$ ορίζεται <b>πεπλεγμένα</b>.</p></div>

<div class="tbox"><h4>Πεπλεγμένη παραγώγιση</h4>
<p>Παραγωγίζουμε και τα δύο μέλη ως προς $x$, θεωρώντας το $y$ συνάρτηση του $x$ (άρα $(y^2)' = 2y\,y'$, $(xy)' = y + xy'$), και λύνουμε ως προς $y' = \frac{dy}{dx}$.</p>
<p>Π.χ. $x^2 + y^2 = 25$: $2x + 2yy' = 0 \Rightarrow y' = -\frac{x}{y}$. Στο $(3, 4)$: $y' = -\frac34$, εφαπτομένη $y - 4 = -\frac34(x - 3)$.</p></div>

<div class="tbox tip"><h4>Οριζόντιες – κατακόρυφες εφαπτομένες</h4>
<p>Αν $y' = \frac{A}{B}$: <b>οριζόντια</b> όπου $A = 0$ (και $B \ne 0$), <b>κατακόρυφη</b> όπου $B = 0$ (και $A \ne 0$) — μαζί με την εξίσωση της καμπύλης. Η <b>κάθετη</b> στην εφαπτομένη έχει κλίση $-\frac{1}{y'}$.</p></div>`,
  widget: "implicit",
  gen: "gimpl",
  exercises: [
    { level: 1, type: "fields", q: R`Για την καμπύλη $x^2 + y^2 = 25$ να βρείτε την κλίση της εφαπτομένης στο σημείο $(3, 4)$ και στο $(3, -4)$.`,
      fields: [{ label: "στο (3, 4):", ans: "-3/4" }, { label: "στο (3, −4):", ans: "3/4" }],
      hint: R`$y' = -\frac xy$.`, sol: R`$-\frac34$ και $-\frac{3}{-4} = \frac34$.` },
    { level: 2, type: "fields", q: R`Η $x^2 + 2yx - y^2 = 0$ ορίζει πεπλεγμένα την $y$. Να υπολογίσετε το $y'$ στο σημείο $(1, 1 + \sqrt2)$ (3 δεκαδικά).`,
      fields: [{ label: "y′ ≈", ans: 2.4142, tol: 0.0005 }],
      hint: R`$2x + 2y + 2xy' - 2yy' = 0 \Rightarrow y' = \frac{x + y}{y - x}$.`,
      sol: R`$y' = \frac{1 + 1 + \sqrt2}{\sqrt2} = \frac{2 + \sqrt2}{\sqrt2} = \sqrt2 + 1 \approx 2{,}414$.` },
    { level: 2, type: "fields", q: R`Για την καμπύλη $y^2 = 4x$ στο σημείο της με $x = 4$ και θετική τεταγμένη, να βρείτε την κλίση της εφαπτομένης και την κλίση της κάθετης ευθείας.`,
      fields: [{ label: "εφαπτομένη:", ans: "1/2" }, { label: "κάθετη:", ans: -2 }],
      hint: R`$y = 4$, $2yy' = 4$.`, sol: R`$y' = \frac2y = \frac12$. Κάθετη: $-2$. (Εφαπτομένη $y = \frac12x + 2$, κάθετη $y = -2x + 12$.)` },
    { level: 1, type: "fields", q: R`Για την καμπύλη $xy = 6$ να βρείτε το $y'$ στο σημείο $(2, 3)$.`,
      fields: [{ label: "y′ =", ans: "-3/2" }],
      hint: R`$y + xy' = 0$.`, sol: R`$y' = -\frac yx = -\frac32$.` },
    { level: 3, type: "fields", q: R`Να βρείτε τα σημεία της καμπύλης $x^2 + y^2 - 2y = 1$ στα οποία η κλίση της εφαπτομένης είναι $-1$ (το σημείο με θετικό $x$).`,
      fields: [{ label: "x =", ans: 1 }, { label: "y =", ans: 2 }],
      hint: R`$2x + 2yy' - 2y' = 0 \Rightarrow y' = \frac{x}{1 - y}$. Θέσε $= -1$: $x = y - 1$.`,
      sol: R`Με $x = y - 1$ στην καμπύλη: $(y - 1)^2 + y^2 - 2y - 1 = 0 \Rightarrow 2y^2 - 4y = 0 \Rightarrow y = 0$ ή $y = 2$. Σημεία $(-1, 0)$ και $(1, 2)$.` },
    { level: 3, type: "fields", q: R`Στην καμπύλη $x^2 - xy + y^2 = 9$ η εφαπτομένη είναι κατακόρυφη σε δύο σημεία. Να βρείτε το σημείο με θετικό $y$ (ακριβείς τιμές, π.χ. <code>√3</code>).`,
      fields: [{ label: "x =", ans: "2√3", tol: 0.0005 }, { label: "y =", ans: "√3", tol: 0.0005 }],
      hint: R`Παραγώγισε: $y' = \frac{y - 2x}{2y - x}$· κατακόρυφη όταν ο παρονομαστής μηδενίζεται.`,
      sol: R`$2x - y - xy' + 2yy' = 0 \Rightarrow y' = \frac{y - 2x}{2y - x}$. Κατακόρυφη: $x = 2y$. Τότε $4y^2 - 2y^2 + y^2 = 9 \Rightarrow y^2 = 3$. Με $y > 0$: $y = \sqrt3$, $x = 2\sqrt3$.` },
    { level: 2, type: "mc", q: R`Αν $\text{ημ}x + \text{ημ}y = 1$, τότε $\frac{dy}{dx} = $`,
      options: ["$-\\frac{\\text{συν}x}{\\text{συν}y}$", "$\\frac{\\text{συν}x}{\\text{συν}y}$", "$-\\text{συν}x$", "$-\\frac{\\text{συν}y}{\\text{συν}x}$"], correct: 0,
      hint: R`$\text{συν}x + \text{συν}y\cdot y' = 0$.`, sol: R`$y' = -\frac{\text{συν}x}{\text{συν}y}$ (όπου $\text{συν}y \ne 0$).` }
  ]
},
/* ───────────────────────────── 10.9 ───────────────────────────── */
{
  id: "10.9", unit: 10, title: "Συνάρτηση που ορίζεται παραμετρικά",
  book: "Γ΄ Τεύχος §10.9 · Δραστηριότητες σελ. 126–127",
  theory: R`
<div class="tbox"><h4>Παραμετρικές εξισώσεις</h4>
<p>Μια καμπύλη μπορεί να δίνεται με $x = x(t)$, $y = y(t)$, $t \in \Delta$ — κάθε τιμή της παραμέτρου $t$ δίνει ένα σημείο. Απαλείφοντας το $t$ βρίσκουμε (συχνά) την καρτεσιανή εξίσωση: π.χ. $x = 3t$, $y = 9t^2$ δίνει $y = x^2$· $x = 3\,\text{συν}t$, $y = 2\,\text{ημ}t$ δίνει την έλλειψη $\frac{x^2}{9} + \frac{y^2}{4} = 1$.</p></div>

<div class="tbox"><h4>Παράγωγος</h4>
$$\frac{dy}{dx} = \frac{dy/dt}{dx/dt} = \frac{y'(t)}{x'(t)}, \qquad x'(t) \ne 0$$
<p>Δεύτερη παράγωγος: $\displaystyle\frac{d^2y}{dx^2} = \frac{\frac{d}{dt}\left(\frac{dy}{dx}\right)}{x'(t)}$.</p></div>

<div class="tbox tip"><h4>Εφαπτομένη</h4>
<p>Στο σημείο με $t = t_0$: $y - y(t_0) = \frac{y'(t_0)}{x'(t_0)}\big(x - x(t_0)\big)$. Οριζόντια όταν $y'(t_0) = 0$, κατακόρυφη όταν $x'(t_0) = 0$.</p></div>`,
  widget: "param",
  gen: "gparam",
  exercises: [
    { level: 1, type: "mc", q: R`Η καμπύλη $x = 3t$, $y = 9t^2$, $t \in \mathbb{R}$ έχει καρτεσιανή εξίσωση:`,
      options: ["$y = x^2$", "$y = 3x^2$", "$y = 9x^2$", "$y = \\frac{x^2}{3}$"], correct: 0,
      hint: R`$t = \frac x3$.`, sol: R`$y = 9\cdot\frac{x^2}{9} = x^2$.` },
    { level: 1, type: "mc", q: R`Η καμπύλη $x = 3t$, $y = 2 - 2t$, $t \in [0, 1]$ είναι:`,
      options: ["ευθύγραμμο τμήμα από $(0, 2)$ ως $(3, 0)$", "ολόκληρη ευθεία", "παραβολή", "κύκλος"], correct: 0,
      hint: R`Βρες τα άκρα για $t = 0$ και $t = 1$.`, sol: R`$y = 2 - \frac{2x}{3}$ με $x \in [0, 3]$: τμήμα από $(0, 2)$ ως $(3, 0)$.` },
    { level: 2, type: "fields", q: R`Για την καμπύλη $x = t - \text{ημ}t$, $y = 2 + \text{συν}t$, να υπολογίσετε το $\frac{dy}{dx}$ για $t = \frac\pi3$ (3 δεκαδικά).`,
      fields: [{ label: "dy/dx ≈", ans: -1.7321, tol: 0.0005 }],
      hint: R`$\frac{dy}{dx} = \frac{-\text{ημ}t}{1 - \text{συν}t}$.`,
      sol: R`$\frac{-\frac{\sqrt3}{2}}{1 - \frac12} = -\sqrt3 \approx -1{,}732$.` },
    { level: 2, type: "fields", q: R`Καμπύλη $x = t^2 - 2$, $y = \frac{t^3}{3} - t$, $t > 0$. Να βρείτε την κλίση της εφαπτομένης στο σημείο με $t = 3$ και τις συντεταγμένες του σημείου.`,
      fields: [{ label: "κλίση =", ans: "4/3" }, { label: "x₀ =", ans: 7 }, { label: "y₀ =", ans: 6 }],
      hint: R`$\frac{dy}{dx} = \frac{t^2 - 1}{2t}$.`,
      sol: R`Κλίση $\frac{8}{6} = \frac43$, σημείο $(7, 6)$. Εφαπτομένη: $y - 6 = \frac43(x - 7)$.` },
    { level: 2, type: "fields", q: R`Η καμπύλη $x = e^t$, $y = e^{-2t}$. Να βρείτε το $\frac{dy}{dx}$ για $t = 0$ Η καμπύλη έχει καρτεσιανή εξίσωση της μορφής $y = x^\kappa$· ποια είναι η τιμή του $\kappa$;`,
      fields: [{ label: "dy/dx (t = 0) =", ans: -2 }, { label: "κ =", ans: -2 }],
      hint: R`$\frac{dy}{dx} = \frac{-2e^{-2t}}{e^t}$.`,
      sol: R`Για $t = 0$: $\frac{-2}{1} = -2$. Επίσης $y = (e^t)^{-2} = x^{-2}$, και $(x^{-2})' = -2x^{-3} = -2$ στο $x = 1$ ✓.` },
    { level: 3, type: "fields", q: R`Καμπύλη $x = 2\,\text{ημ}2t$, $y = 2\,\text{ημ}t$, $t \in [0, \pi]$. Σε ποια τιμή του $t$ η εφαπτομένη είναι οριζόντια; (γράψε π.χ. <code>π/2</code>)`,
      fields: [{ label: "t =", ans: "π/2", tol: 0.002 }],
      hint: R`Οριζόντια όταν $y'(t) = 2\,\text{συν}t = 0$ και $x'(t) = 4\,\text{συν}2t \ne 0$.`,
      sol: R`$\text{συν}t = 0 \Rightarrow t = \frac\pi2$, όπου $x'\left(\frac\pi2\right) = 4\,\text{συν}\pi = -4 \ne 0$. Σημείο $(0, 2)$.` },
    { level: 1, type: "mc", q: R`Αν $x = x(t)$, $y = y(t)$ με $x'(t) \ne 0$, τότε $\frac{dy}{dx} = $`,
      options: ["$\\frac{y'(t)}{x'(t)}$", "$\\frac{x'(t)}{y'(t)}$", "$y'(t)\\cdot x'(t)$", "$y'(t)$"], correct: 0,
      hint: R`Κανόνας αλυσίδας.`, sol: R`$\frac{dy}{dx} = \frac{dy/dt}{dx/dt}$.` }
  ]
},
/* ───────────────────────────── 10.10 ───────────────────────────── */
{
  id: "10.10", unit: 10, title: "Παράγωγος αντίστροφης συνάρτησης – Λογαριθμική",
  book: "Γ΄ Τεύχος §10.10 · Δραστηριότητες σελ. 133–134",
  theory: R`
<div class="tbox"><h4>Θεώρημα</h4>
<p>Αν η $f$ είναι 1–1 και παραγωγίσιμη, με $f'(x_0) \ne 0$, τότε η $f^{-1}$ είναι παραγωγίσιμη στο $y_0 = f(x_0)$ και</p>
$$\left(f^{-1}\right)'(y_0) = \frac{1}{f'(x_0)}$$
<p>Γεωμετρικά: οι εφαπτομένες των $C_f$ και $C_{f^{-1}}$ σε συμμετρικά σημεία (ως προς $y = x$) έχουν αντίστροφες κλίσεις.</p></div>

<div class="tbox"><h4>Λογαριθμική και εκθετική</h4>
$$(\ln x)' = \frac1x,\ x > 0 \qquad (\ln u)' = \frac{u'}{u} \qquad (\log_\alpha x)' = \frac{1}{x\ln\alpha} \qquad (\alpha^x)' = \alpha^x\ln\alpha$$
<p>Π.χ. $(\ln 3x)' = \frac{3}{3x} = \frac1x$, $(\ln(x^2 + 1))' = \frac{2x}{x^2 + 1}$, $(2^x)' = 2^x\ln 2$.</p></div>

<div class="tbox tip"><h4>Βήματα για $(f^{-1})'(y_0)$</h4>
<p>(1) Λύνουμε $f(x_0) = y_0$ για να βρούμε το $x_0$. (2) Υπολογίζουμε $f'(x_0)$. (3) Αντιστρέφουμε. Π.χ. $f(x) = \frac{x^2}{x + 1}$, $y_0 = \frac12$: $x_0 = 1$, $f'(1) = \frac34$, άρα $(f^{-1})'\left(\frac12\right) = \frac43$.</p></div>`,
  widget: "invderiv",
  gen: "ginvd",
  exercises: [
    { level: 2, type: "fields", q: R`Η $f: (0, +\infty) \to (0, +\infty)$, $f(x) = \dfrac{x^2}{x + 1}$ αντιστρέφεται. Να υπολογίσετε το $(f^{-1})'\left(\frac12\right)$.`,
      fields: [{ label: "=", ans: "4/3" }],
      hint: R`$f(1) = \frac12$, $f'(x) = \frac{x^2 + 2x}{(x + 1)^2}$.`,
      sol: R`$f'(1) = \frac34$, άρα $(f^{-1})'\left(\frac12\right) = \frac43$.` },
    { level: 2, type: "fields", q: R`Η $C_f$ μιας αντιστρέψιμης παραγωγίσιμης $f$ περνά από το $A(-1, 3)$ με κλίση $-\frac14$ στο $A$. Να βρείτε την κλίση της εφαπτομένης της $C_{f^{-1}}$ στο $x = 3$ και την τεταγμένη του σημείου επαφής.`,
      fields: [{ label: "κλίση =", ans: -4 }, { label: "f⁻¹(3) =", ans: -1 }],
      hint: R`$(f^{-1})'(3) = \frac{1}{f'(-1)}$.`,
      sol: R`$(f^{-1})'(3) = \frac{1}{-1/4} = -4$, σημείο $(3, -1)$: εφαπτομένη $y + 1 = -4(x - 3)$.` },
    { level: 1, type: "expr", label: "f′(x) =", pos: true, q: R`Να βρείτε την παράγωγο της $f(x) = \ln(3x)$, $x > 0$.`,
      ref: "1/x", key: "1/x", hint: R`$\frac{u'}{u}$.`, sol: R`$f'(x) = \frac{3}{3x} = \frac1x$ (αφού $\ln 3x = \ln 3 + \ln x$).` },
    { level: 1, type: "expr", label: "f′(x) =", pos: true, q: R`Να βρείτε την παράγωγο της $f(x) = \ln^4 x$, $x > 0$.`,
      ref: "4ln(x)^3/x", key: "4ln(x)^3/x", hint: R`$u^4$ με $u = \ln x$.`, sol: R`$f'(x) = 4\ln^3x\cdot\frac1x$.` },
    { level: 2, type: "expr", label: "f′(x) =", pos: true, q: R`Να βρείτε την παράγωγο της $f(x) = x^2\ln(x + 8)$, $x > -8$.`,
      ref: "2x*ln(x+8)+x^2/(x+8)", key: "2x*ln(x+8)+x^2/(x+8)", hint: R`Γινόμενο.`, sol: R`$f'(x) = 2x\ln(x + 8) + \frac{x^2}{x + 8}$.` },
    { level: 2, type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = \ln(e^x + e^{-x})$.`,
      ref: "(exp(x)-exp(-x))/(exp(x)+exp(-x))", key: "(exp(x)-exp(-x))/(exp(x)+exp(-x))", hint: R`$\frac{u'}{u}$.`, sol: R`$f'(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}$.` },
    { level: 2, type: "expr", label: "y′ =", pos: true, q: R`Να βρείτε την παράγωγο της $y = \dfrac{1 + \ln x}{x^2}$, $x > 0$.`,
      ref: "(-1-2ln(x))/x^3", key: "(-1-2ln(x))/x^3", hint: R`Πηλίκο.`, sol: R`$y' = \frac{\frac1x x^2 - 2x(1 + \ln x)}{x^4} = \frac{-1 - 2\ln x}{x^3}$.` },
    { level: 2, type: "expr", label: "y′ =", q: R`Να βρείτε την παράγωγο της $y = 2^{x^2 + 1}$.`,
      ref: "2x*ln(2)*2^(x^2+1)", key: "2x*ln(2)*2^(x^2+1)", hint: R`$(\alpha^u)' = \alpha^u\ln\alpha\cdot u'$.`, sol: R`$y' = 2^{x^2 + 1}\ln 2\cdot 2x$.` },
    { level: 3, type: "fields", q: R`Να βρείτε το σημείο της $f(x) = \dfrac{\ln^2 x}{x}$, $x > 0$, με $x > 1$ στο οποίο η εφαπτομένη είναι οριζόντια (γράψε π.χ. <code>e^2</code>).`,
      fields: [{ label: "x =", ans: "e^2", tol: 0.0005 }, { label: "f(x) =", ans: "4/e^2", tol: 0.0005 }],
      hint: R`$f'(x) = \frac{\ln x(2 - \ln x)}{x^2}$.`,
      sol: R`$f'(x) = 0 \Rightarrow \ln x = 0$ ($x = 1$) ή $\ln x = 2$ ($x = e^2$). Για $x = e^2$: $f = \frac{4}{e^2}$.` },
    { level: 1, type: "mc", q: R`$(\log x)' = $ (δεκαδικός λογάριθμος)`,
      options: ["$\\frac{1}{x\\ln 10}$", "$\\frac1x$", "$\\frac{\\ln 10}{x}$", "$\\frac{1}{10x}$"], correct: 0,
      hint: R`$\log x = \frac{\ln x}{\ln 10}$.`, sol: R`$(\log x)' = \frac{1}{x\ln 10}$.` }
  ]
},
/* ───────────────────────────── 12.2 ───────────────────────────── */
{
  id: "12.2", unit: 12, title: "Σύγκριση δύο πληθυσμών",
  book: "Γ΄ Τεύχος §12.1–12.2",
  theory: R`
<div class="tbox"><h4>Μέση τιμή και τυπική απόκλιση</h4>
$$\bar x = \frac{x_1 + x_2 + \dots + x_\nu}{\nu} \qquad s = \sqrt{\frac{(x_1 - \bar x)^2 + \dots + (x_\nu - \bar x)^2}{\nu}}$$
<p>Η μέση τιμή δείχνει το «κέντρο», η τυπική απόκλιση πόσο <b>διασκορπισμένες</b> είναι οι τιμές γύρω της. Μικρότερη $s$ ⇒ πιο σταθερά/ομοιόμορφα αποτελέσματα.</p></div>

<div class="tbox"><h4>Συντελεστής μεταβολής (μεταβλητότητας)</h4>
$$CV = \frac{s}{|\bar x|}\cdot 100\%$$
<p>Χρησιμοποιείται για σύγκριση της διασποράς ομάδων με <b>πολύ διαφορετικές μέσες τιμές</b> ή <b>διαφορετικές μονάδες</b>. Το δείγμα θεωρείται <b>ομοιογενές</b> όταν $CV < 10\%$. Μικρότερος CV ⇒ μεγαλύτερη ομοιογένεια.</p></div>

<div class="tbox tip"><h4>Πώς συγκρίνουμε</h4>
<p>Πρώτα τις μέσες τιμές (ποιος «πετυχαίνει» περισσότερο ή λιγότερο, ανάλογα με το πρόβλημα), μετά τη διασπορά (ποιος είναι πιο σταθερός). Π.χ. σε αγώνα δρόμου <b>μικρότερος</b> χρόνος είναι καλύτερος.</p></div>`,
  widget: "cvcomp",
  gen: "gcv",
  exercises: [
    { level: 2, type: "fields", q: R`Οι ώρες λειτουργίας $9$ λαμπτήρων του είδους Α είναι: $140, 150, 160, 130, 150, 170, 150, 140, 160$. Να υπολογίσετε τη μέση τιμή και την τυπική απόκλιση (2 δεκαδικά).`,
      fields: [{ label: "x̄ =", ans: 150 }, { label: "s =", ans: 11.55, tol: 0.001 }],
      hint: R`Αποκλίσεις από το $150$: $-10, 0, 10, -20, 0, 20, 0, -10, 10$.`,
      sol: R`$\bar x = \frac{1350}{9} = 150$. $s = \sqrt{\frac{100 + 0 + 100 + 400 + 0 + 400 + 0 + 100 + 100}{9}} = \sqrt{\frac{1200}{9}} \approx 11{,}55$ ώρες.` },
    { level: 1, type: "mc", q: R`Δύο είδη λαμπτήρων έχουν την ίδια μέση διάρκεια $150$ ώρες, με τυπικές αποκλίσεις $s_A = 11{,}55$ και $s_B = 44{,}47$. Ποιο είδος είναι προτιμότερο;`,
      options: ["Το Α, γιατί έχει μικρότερη διασπορά", "Το Β, γιατί έχει μεγαλύτερη διασπορά", "Είναι ισοδύναμα"], correct: 0,
      hint: R`Ίδια μέση τιμή — κοίτα τη σταθερότητα.`,
      sol: R`Με ίδιο μέσο όρο, προτιμούμε το είδος με τις πιο σταθερές διάρκειες: το Α ($s_A < s_B$).` },
    { level: 1, type: "fields", q: R`Σε δύο δείγματα δίνονται $\bar x_A = 50$, $s_A = 4$, $\bar x_B = 70$, $s_B = 6$. Να υπολογίσετε τους συντελεστές μεταβολής (σε %, 2 δεκαδικά).`,
      fields: [{ label: "CV_A (%) =", ans: 8 }, { label: "CV_B (%) =", ans: 8.57, tol: 0.001 }],
      hint: R`$CV = \frac{s}{\bar x}\cdot 100\%$.`,
      sol: R`$CV_A = \frac{4}{50} = 8\%$, $\ CV_B = \frac{6}{70} \approx 8{,}57\%$. Μεγαλύτερη ομοιογένεια έχει το Α (και τα δύο είναι ομοιογενή).` },
    { level: 2, type: "mc", q: R`Τέσσερα τμήματα έχουν (μέση τιμή, τυπική απόκλιση): Β1 $(14{,}1;\ 1{,}5)$, Β2 $(14{,}2;\ 2{,}3)$, Β3 $(12{,}9;\ 1{,}2)$, Β4 $(13{,}7;\ 2{,}7)$. Ποιο τμήμα παρουσιάζει τη μεγαλύτερη ομοιογένεια;`,
      options: ["Β1", "Β2", "Β3", "Β4"], correct: 2,
      hint: R`Υπολόγισε τους CV.`,
      sol: R`$CV$: Β1 $\approx 10{,}6\%$, Β2 $\approx 16{,}2\%$, Β3 $\approx 9{,}3\%$, Β4 $\approx 19{,}7\%$. Μικρότερος ο CV του Β3 (και μόνο αυτό είναι ομοιογενές, $< 10\%$).` },
    { level: 1, type: "mc", q: R`Σε δέκα αγώνες $100$ m ο αθλητής Α έχει μέσο χρόνο $10{,}5$ s ($s = 0{,}055$) και ο Β $10{,}2$ s ($s = 0{,}2$). Ποιος είναι ο καλύτερος αθλητής;`,
      options: ["Ο Β, γιατί έχει σημαντικά μικρότερο μέσο χρόνο", "Ο Α, γιατί έχει μικρότερη τυπική απόκλιση", "Είναι ισάξιοι"], correct: 0,
      hint: R`Στο τρέξιμο μικρότερος χρόνος = καλύτερη επίδοση.`,
      sol: R`Ο Β τρέχει κατά μέσο όρο $0{,}3$ s γρηγορότερα — διαφορά μεγαλύτερη από τις τυπικές αποκλίσεις τους. Καλύτερος ο Β, παρότι ο Α είναι λίγο πιο σταθερός.` },
    { level: 2, type: "fields", q: R`Τα ύψη μιας ομάδας μαθητών έχουν $\bar x = 170$ cm, $s = 8{,}5$ cm και τα βάρη τους $\bar x = 65$ kg, $s = 9{,}1$ kg. Να υπολογίσετε τους δύο συντελεστές μεταβολής (%).`,
      fields: [{ label: "CV ύψους (%) =", ans: 5 }, { label: "CV βάρους (%) =", ans: 14 }],
      hint: R`Διαφορετικές μονάδες: συγκρίνουμε μόνο με τον CV.`,
      sol: R`$CV_{ύψ} = \frac{8{,}5}{170} = 5\%$, $\ CV_{βάρ} = \frac{9{,}1}{65} = 14\%$. Τα ύψη είναι ομοιογενή, τα βάρη όχι.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε τη μέση τιμή και την τυπική απόκλιση των τιμών $2, 4, 4, 4, 5, 5, 7, 9$.`,
      fields: [{ label: "x̄ =", ans: 5 }, { label: "s =", ans: 2 }],
      hint: R`Άθροισμα τετραγώνων αποκλίσεων: $9 + 1 + 1 + 1 + 0 + 0 + 4 + 16$.`,
      sol: R`$\bar x = \frac{40}{8} = 5$. $s^2 = \frac{32}{8} = 4 \Rightarrow s = 2$.` },
    { level: 2, type: "fields", q: R`Οι τιμές ενός προϊόντος σε δέκα καταστήματα έχουν $\bar x = 8{,}1$ € και $s = 0{,}677$ €. Να υπολογίσετε τον συντελεστή μεταβολής (%, 2 δεκαδικά).`,
      fields: [{ label: "CV (%) =", ans: 8.36, tol: 0.001 }],
      hint: R`$\frac{0{,}677}{8{,}1}$.`,
      sol: R`$CV = \frac{0{,}677}{8{,}1} \approx 0{,}0836 = 8{,}36\% < 10\%$: οι τιμές είναι ομοιογενείς.` }
  ]
},
/* ───────────────────────────── 12.3 ───────────────────────────── */
{
  id: "12.3", unit: 12, title: "Συσχέτιση – Συντελεστής συσχέτισης",
  book: "Γ΄ Τεύχος §12.3 · Δραστηριότητες σελ. 201–203",
  theory: R`
<div class="tbox"><h4>Διάγραμμα διασποράς</h4>
<p>Σημειώνουμε τα ζεύγη $(x_i, y_i)$ στο επίπεδο. Αν τα σημεία «ακολουθούν» μια ευθεία:</p>
<ul><li><b>Θετική</b> συσχέτιση: όσο αυξάνεται το $x$, αυξάνεται και το $y$ (ανεβαίνει).</li>
<li><b>Αρνητική</b>: όσο αυξάνεται το $x$, μειώνεται το $y$.</li>
<li><b>Ισχυρή</b> / <b>ασθενής</b>: τα σημεία είναι κοντά / μακριά από την ευθεία· <b>τέλεια</b>: όλα πάνω της.</li></ul></div>
<div class="tbox"><h4>Συντελεστής συσχέτισης $r$</h4>
$$r = \frac{\Sigma_{xy} - \nu\,\bar x\,\bar y}{\nu\, s_x\, s_y}, \qquad \Sigma_{xy} = x_1 y_1 + x_2 y_2 + \dots + x_\nu y_\nu$$
<p>όπου $s_x, s_y$ οι τυπικές αποκλίσεις. Πάντα $-1 \le r \le 1$ και δεν έχει μονάδες.</p>
<ul><li>$r = 1$ / $r = -1$: τέλεια θετική / αρνητική γραμμική συσχέτιση · $r = 0$: καμία γραμμική.</li>
<li>Όσο το $r$ πλησιάζει το $1$ (ή το $-1$), τόσο πιο ισχυρή είναι η θετική (ή η αρνητική) γραμμική συσχέτιση· κοντά στο $0$ η συσχέτιση είναι ασθενής. (Πρακτικά, $|r| > 0{,}7$ θεωρείται συχνά ισχυρή.)</li></ul></div>
<div class="tbox warn"><h4>⚠ Συσχέτιση ≠ αιτία</h4>
<p>Ισχυρή συσχέτιση δεν σημαίνει ότι το ένα <b>προκαλεί</b> το άλλο — μπορεί και τα δύο να εξαρτώνται από έναν τρίτο παράγοντα.</p></div>`,
  widget: "scatter",
  exercises: [
    { level: 1, type: "mc", q: R`Για δύο μεταβλητές βρέθηκε $r = -0{,}95$. Αυτό σημαίνει:`,
      options: ["ασθενή θετική συσχέτιση", "ισχυρή αρνητική γραμμική συσχέτιση", "καμία συσχέτιση", "ότι έγινε λάθος στις πράξεις"], correct: 1,
      hint: R`Πρόσημο ⇒ φορά, απόλυτη τιμή ⇒ ισχύς.`,
      sol: R`Αρνητικό πρόσημο ⇒ όσο αυξάνεται το $x$ μειώνεται το $y$. $|r| = 0{,}95$ κοντά στο 1 ⇒ <b>ισχυρή αρνητική</b>.` },
    { level: 1, type: "mc", q: R`Ποια τιμή <b>δεν</b> μπορεί να είναι συντελεστής συσχέτισης;`,
      options: ["$r = 0$", "$r = -1$", "$r = 0{,}99$", "$r = 1{,}2$"], correct: 3,
      hint: R`Σε ποιο διάστημα ανήκει πάντα το $r$;`,
      sol: R`Πάντα $-1 \le r \le 1$, άρα το $1{,}2$ είναι αδύνατο.` },
    { level: 1, type: "fields", q: R`Για τα ζεύγη $(1,3), (2,5), (3,7), (4,9)$ πόσος είναι ο συντελεστής συσχέτισης;`,
      fields: [{ label: "r =", ans: 1 }],
      hint: R`Κοίτα αν τα σημεία βρίσκονται σε ευθεία: $y = 2x + 1$;`,
      sol: R`Όλα τα σημεία ικανοποιούν $y = 2x + 1$ (ευθεία με θετική κλίση) ⇒ τέλεια θετική συσχέτιση, $r = 1$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε τον $r$ για $x$: $1, 2, 3, 4, 5$ και $y$: $2, 4, 5, 4, 5$ (στρογγυλοποίηση 2 δεκαδικών).`,
      fields: [{ label: "x̄ =", ans: 3 }, { label: "ȳ =", ans: 4 }, { label: "Σxy =", ans: 66 }, { label: "r ≈", ans: 0.7746, tol: 0.008 }],
      hint: R`$s_x = \sqrt{2}$, $s_y = \sqrt{1{,}2}$.`,
      sol: R`$\bar x = 3$, $\bar y = 4$, $\Sigma_{xy} = 2 + 8 + 15 + 16 + 25 = 66$.<br>$s_x^2 = \frac{4+1+0+1+4}{5} = 2$, $\;s_y^2 = \frac{4+0+1+0+1}{5} = 1{,}2$.<br>$r = \frac{66 - 5 \cdot 3 \cdot 4}{5 \sqrt{2}\sqrt{1{,}2}} = \frac{6}{7{,}746} \approx 0{,}77$ ⇒ ισχυρή θετική (πάνω από $0{,}7$).` },
    { level: 2, type: "fields", q: R`Ώρες μελέτης $x$: $1, 2, 3, 4, 5, 6$ και βαθμός $y$: $9, 11, 12, 14, 15, 18$. Να υπολογίσετε τον $r$ (2 δεκαδικά).`,
      fields: [{ label: "Σxy =", ans: 306 }, { label: "r ≈", ans: 0.989, tol: 0.008 }],
      hint: R`$\bar x = 3{,}5$, $\bar y = \frac{79}{6}$, $s_x \approx 1{,}708$, $s_y \approx 2{,}911$.`,
      sol: R`$\Sigma_{xy} = 9 + 22 + 36 + 56 + 75 + 108 = 306$, $\bar x = 3{,}5$, $\bar y = \frac{79}{6} \approx 13{,}17$.<br>$s_x \approx 1{,}708$, $s_y \approx 2{,}911$. $\;r = \frac{306 - 6 \cdot 3{,}5 \cdot \frac{79}{6}}{6 \cdot 1{,}708 \cdot 2{,}911} = \frac{29{,}5}{29{,}83} \approx 0{,}99$ ⇒ πολύ ισχυρή θετική.` },
    { level: 3, type: "mc", q: R`Σε μια πόλη βρέθηκε $r = 0{,}85$ μεταξύ των πωλήσεων παγωτού και του αριθμού πνιγμών ανά μήνα. Ποιο συμπέρασμα είναι σωστό;`,
      options: ["Το παγωτό προκαλεί πνιγμούς", "Υπάρχει ισχυρή θετική συσχέτιση, πιθανότατα λόγω τρίτου παράγοντα (ζέστη/καλοκαίρι)", "Δεν υπάρχει συσχέτιση", "Οι πνιγμοί αυξάνουν τις πωλήσεις παγωτού"], correct: 1,
      hint: R`Τι αυξάνεται το καλοκαίρι;`,
      sol: R`Το $r = 0{,}85$ δείχνει ισχυρή θετική γραμμική συσχέτιση, όχι αιτιότητα. Και τα δύο αυξάνονται τους ζεστούς μήνες (περισσότερο κολύμπι, περισσότερο παγωτό).` }
  ]
},
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

/* ================= Widgets Β΄ Λυκείου Κατεύθυνσης ================= */
const kF = (p, q) => fracS2(p, q);
const kPi = (p, q) => { const g = gcdI(p, q); p /= g; q /= g; if (p === 0) return "0"; const s = p < 0 ? "-" : "", a = Math.abs(p); return `${s}${a === 1 ? "" : a}π${q === 1 ? "" : "/" + q}`; };
const kPiT = (p, q) => { const g = gcdI(p, q); p /= g; q /= g; if (p === 0) return "0"; const s = p < 0 ? "-" : "", a = Math.abs(p); return q === 1 ? `${s}${a === 1 ? "" : a}\\pi` : `${s}\\frac{${a === 1 ? "" : a}\\pi}{${q}}`; };
const kTRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
const kParse = s => { try { return MathParse.parse(s); } catch (e) { return null; } };
function kCurve(P, f, a, b, cls = "c1") { /* σπάει σε ασυνέχειες */
  const n = 600; let d = "", pen = false, py = null;
  for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n, y = f(x);
    if (!isFinite(y) || y < P.ymin - 50 || y > P.ymax + 50 || (py !== null && Math.abs(y - py) > (P.ymax - P.ymin) * 0.8)) { pen = false; py = isFinite(y) ? y : null; if (!isFinite(y)) continue; }
    d += (pen ? "L" : "M") + P.sx(x).toFixed(1) + "," + P.sy(Math.max(P.ymin - 5, Math.min(P.ymax + 5, y))).toFixed(1); pen = true; py = y; }
  const e = svgEl("path", { d, class: "curve " + cls }); P.layer.appendChild(e); return e;
}

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 2.3 Τριγωνομετρικοί αριθμοί αθροίσματος ---------- */
  trigsum(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="0" max="180" step="5" value="45"><b class="va"></b></label>
      <label>β <input type="range" class="rb" min="0" max="180" step="5" value="30"><b class="vb"></b></label>
      <label>πράξη <select class="so"><option value="1">α + β</option><option value="-1">α − β</option><option value="2">2α</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, b0 = +$(".rb", box).value, o = +$(".so", box).value; $(".va", box).textContent = a + "°"; $(".vb", box).textContent = b0 + "°";
      const b = o === 2 ? a : b0, s = o === -1 ? a - b : a + b, S = gRad, sa = Math.sin(S(a)), ca = Math.cos(S(a)), sb = Math.sin(S(b)), cb = Math.cos(S(b));
      const P = gPlot($(".pl", box), 0, 0, 1.9, 320, false); gCircle(P, 0, 0, 1);
      gLine(P, -1.3, 0, 1.3, 0, "stroke:var(--muted);stroke-width:1"); gLine(P, 0, -1.3, 0, 1.3, "stroke:var(--muted);stroke-width:1");
      gLine(P, 0, 0, ca, sa, "stroke:var(--blue);stroke-width:2.4"); gArc(P, 0, 0, 0, a, 0.22, "var(--blue)");
      gLine(P, 0, 0, Math.cos(S(s)), Math.sin(S(s)), "stroke:var(--red);stroke-width:2.8"); gArc(P, 0, 0, Math.min(0, s), Math.max(0, s), 0.4, "var(--red)");
      P.dot(Math.cos(S(s)), Math.sin(S(s)), "d2", `(${fmt(Math.cos(S(s)))}, ${fmt(Math.sin(S(s)))})`, Math.cos(S(s)) < 0 ? -8 : 8, -8);
      const nm = o === 2 ? "2α" : o === 1 ? "α + β" : "α − β", sg = o === -1 ? "−" : "+", sg2 = o === -1 ? "+" : "−";
      const sinF = o === 2 ? `2ημα·συνα = 2·${fmt(sa)}·${fmt(ca)}` : `ημα·συνβ ${sg} συνα·ημβ = ${fmt(sa)}·${fmt(cb)} ${sg} ${fmt(ca)}·${fmt(sb)}`;
      const cosF = o === 2 ? `συν²α − ημ²α = ${fmt(ca * ca)} − ${fmt(sa * sa)}` : `συνα·συνβ ${sg2} ημα·ημβ = ${fmt(ca)}·${fmt(cb)} ${sg2} ${fmt(sa)}·${fmt(sb)}`;
      $(".wout", box).innerHTML = `<span style="color:var(--red)">${nm} = <b>${s}°</b></span><br>ημ(${nm}) = ${sinF} = <b>${fmt(Math.sin(S(s)))}</b><br>συν(${nm}) = ${cosF} = <b>${fmt(Math.cos(S(s)))}</b>
        <br><span class="muted">Οι τύποι δίνουν ακριβώς τις συντεταγμένες του κόκκινου σημείου. Προσοχή: ${o === 2 ? `ημ2α ≠ 2ημα = ${fmt(2 * sa)}` : o === 1 ? `ημ(α + β) ≠ ημα + ημβ = ${fmt(sa + sb)}` : `ημ(α − β) ≠ ημα − ημβ = ${fmt(sa - sb)}`}.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 3.1–3.2 Απόλυτη τιμή ---------- */
  absline(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="-4" max="4" step="0.5" value="1"><b class="va"></b></label>
      <label>ε <input type="range" class="rc" min="-1" max="4" step="0.5" value="2"><b class="vc"></b></label>
      <label>σχέση <select class="so"><option value="0">|x − α| = ε</option><option value="1">|x − α| &lt; ε</option><option value="2">|x − α| &gt; ε</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, c = +$(".rc", box).value, o = +$(".so", box).value; $(".va", box).textContent = fmt(a); $(".vc", box).textContent = fmt(c);
      const P = makePlot($(".pl", box), { xmin: -8, xmax: 8, ymin: -2, ymax: 6, H: 280 });
      P.curve(x => Math.abs(x - a), "c1"); P.seg(-8, c, 8, c, "asl");
      let txt = "";
      if (c < 0) txt = o === 2 ? `Η απόλυτη τιμή είναι πάντα ≥ 0 &gt; ${fmt(c)}: ισχύει για <b>κάθε x ∈ ℝ</b>.` : `Η απόλυτη τιμή δεν παίρνει αρνητικές τιμές: <b>αδύνατη</b>.`;
      else if (c === 0) txt = o === 0 ? `|x − α| = 0 ⇔ <b>x = ${fmt(a)}</b>.` : o === 1 ? `|x − α| &lt; 0: <b>αδύνατη</b>.` : `|x − α| &gt; 0 ⇔ <b>x ≠ ${fmt(a)}</b>.`;
      else { const L = a - c, Rr = a + c;
        if (o === 0) { P.dot(L, c, "d2"); P.dot(Rr, c, "d2"); txt = `x − α = ±ε ⇒ <b>x = ${fmt(L)}</b> ή <b>x = ${fmt(Rr)}</b>`; }
        else if (o === 1) { P.band(L, Rr, "bandok"); txt = `−ε &lt; x − α &lt; ε ⇔ <b>${fmt(L)} &lt; x &lt; ${fmt(Rr)}</b>`; }
        else { P.band(-8, L, "bandok"); P.band(Rr, 8, "bandok"); txt = `x − α &lt; −ε ή x − α &gt; ε ⇔ <b>x &lt; ${fmt(L)}</b> ή <b>x &gt; ${fmt(Rr)}</b>`; } }
      $(".wout", box).innerHTML = `${txt}<br><span class="muted">Το |x − α| είναι η <b>απόσταση</b> του x από το α πάνω στον άξονα. Μπλε: y = |x − ${fmt(a)}|, κόκκινη: y = ${fmt(c)}.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 3.6 Άρτια – περιττή ---------- */
  parity(box) {
    const F = [["x² − 2", x => x * x - 2, 1], ["x³ − 3x", x => x ** 3 - 3 * x, -1], ["|x| + 1", x => Math.abs(x) + 1, 1], ["x³/(1 + x²)", x => x ** 3 / (1 + x * x), -1], ["(x − 1)²", x => (x - 1) ** 2, 0], ["x⁴ − 3x²", x => x ** 4 - 3 * x * x, 1], ["ημx", x => Math.sin(x), -1], ["συνx", x => Math.cos(x), 1], ["x + 1", x => x + 1, 0]];
    box.innerHTML = `<div class="wctl"><label>f(x) = <select class="sf">${F.map((f, i) => `<option value="${i}">${f[0]}</option>`).join("")}</select></label>
      <label>x₀ <input type="range" class="rx" min="0.5" max="2.5" step="0.25" value="1.5"><b class="vx"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const k = F[+$(".sf", box).value], f = k[1], x0 = +$(".rx", box).value; $(".vx", box).textContent = fmt(x0);
      const P = makePlot($(".pl", box), { xmin: -4, xmax: 4, ymin: -4, ymax: 4, H: 300 }); P.curve(f, "c1");
      P.dot(x0, f(x0), "d1", `(${fmt(x0)}, ${fmt(f(x0))})`, 8, -8); P.dot(-x0, f(-x0), "d2", `(${fmt(-x0)}, ${fmt(f(-x0))})`, -8, -8);
      const v = k[2];
      $(".wout", box).innerHTML = `f(${fmt(x0)}) = <b>${fmt(f(x0))}</b>, f(${fmt(-x0)}) = <b>${fmt(f(-x0))}</b><br>
        ${v === 1 ? `<span class="okc"><b>Άρτια</b>: f(−x) = f(x) για κάθε x — συμμετρική ως προς τον άξονα y'y.</span>` : v === -1 ? `<span class="okc"><b>Περιττή</b>: f(−x) = −f(x) για κάθε x — συμμετρική ως προς την αρχή Ο.</span>` : `<span class="badc"><b>Ούτε άρτια ούτε περιττή</b>: για x = ${fmt(x0)} δεν ισχύει ούτε f(−x) = f(x) ούτε f(−x) = −f(x) γενικά.</span>`}
        <br><span class="muted">Προσοχή: και το πεδίο ορισμού πρέπει να είναι συμμετρικό (x ∈ A ⇒ −x ∈ A).</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 3.10 Σύνθεση ---------- */
  compose(box) {
    box.innerHTML = `<div class="wctl"><label>f(x) = <input type="text" class="tf" value="x^2 + 1" style="width:8em"></label><label>g(x) = <input type="text" class="tg" value="3x - 4" style="width:8em"></label>
      <label>x₀ <input type="range" class="rx" min="-3" max="3" step="0.5" value="1"><b class="vx"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const f = kParse($(".tf", box).value), g = kParse($(".tg", box).value), x0 = +$(".rx", box).value; $(".vx", box).textContent = fmt(x0);
      if (!f || !g) { $(".wout", box).innerHTML = '<span class="warnc">Έλεγξε τους τύπους.</span>'; return; }
      const fg = x => f(g(x)), gf = x => g(f(x));
      const P = makePlot($(".pl", box), { xmin: -4, xmax: 4, ymin: -8, ymax: 12, H: 300 }); P.curve(f, "cfam"); P.curve(fg, "c1"); P.curve(gf, "c2");
      const a = g(x0), b = f(a), c = f(x0), d = g(c);
      $(".wout", box).innerHTML = `<span style="color:var(--blue)"><b>(f∘g)(${fmt(x0)})</b> = f(g(${fmt(x0)})) = f(${isFinite(a) ? fmt(a) : "—"}) = <b>${isFinite(b) ? fmt(b) : "δεν ορίζεται"}</b></span>
        <br><span style="color:var(--purple)"><b>(g∘f)(${fmt(x0)})</b> = g(f(${fmt(x0)})) = g(${isFinite(c) ? fmt(c) : "—"}) = <b>${isFinite(d) ? fmt(d) : "δεν ορίζεται"}</b></span>
        <br><span class="muted">Μπλε: f∘g, μωβ: g∘f, γκρι: f. Γενικά f∘g ≠ g∘f. Η f∘g ορίζεται για τα x του πεδίου ορισμού της g με g(x) στο πεδίο ορισμού της f.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 3.12 Αντίστροφη ---------- */
  inverse(box) {
    const F = [["2x − 1", x => 2 * x - 1, y => (y + 1) / 2, "(x + 1)/2", -6, 6], ["x², x ≥ 0", x => x >= 0 ? x * x : NaN, y => y >= 0 ? Math.sqrt(y) : NaN, "√x", 0, 6], ["x³", x => x ** 3, y => Math.cbrt(y), "∛x", -6, 6], ["1/(x − 2)", x => x === 2 ? NaN : 1 / (x - 2), y => y === 0 ? NaN : 1 / y + 2, "1/x + 2", 2.25, 7], ["(x + 2)/(x − 3), x > 3", x => x > 3 ? (x + 2) / (x - 3) : NaN, y => y > 1 ? (3 * y + 2) / (y - 1) : NaN, "(3x + 2)/(x − 1), x > 1", 3, 8]];
    box.innerHTML = `<div class="wctl"><label>f(x) = <select class="sf">${F.map((f, i) => `<option value="${i}">${f[0]}</option>`).join("")}</select></label>
      <label>x₀ <input type="range" class="rx" min="0" max="1" step="0.02" value="0.6"><b class="vx"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const k = F[+$(".sf", box).value], t = +$(".rx", box).value; let x0 = k[4] + (k[5] - k[4]) * t; if (k[4] === 3) x0 = Math.max(3.4, x0); const y0 = k[1](x0); $(".vx", box).textContent = fmt(x0);
      const P = gPlot($(".pl", box), 2, 2, 7, 330); P.seg(-10, -10, 12, 12, "guide");
      kCurve(P, k[1], -6, 9, "c1"); kCurve(P, k[2], -6, 9, "c2");
      if (isFinite(y0) && Math.abs(y0) < 9) { P.dot(x0, y0, "d1", `(${fmt(x0)}, ${fmt(y0)})`, 8, 14); P.dot(y0, x0, "d2", `(${fmt(y0)}, ${fmt(x0)})`, 8, -8); P.seg(x0, y0, y0, x0, "guide"); }
      $(".wout", box).innerHTML = `<span style="color:var(--blue)">f(x) = ${k[0]}</span> &nbsp;·&nbsp; <span style="color:var(--purple)"><b>f⁻¹(x) = ${k[3]}</b></span>
        <br>f(${fmt(x0)}) = ${isFinite(y0) ? fmt(y0) : "—"} ⇔ f⁻¹(${isFinite(y0) ? fmt(y0) : "—"}) = ${fmt(x0)}
        <br><span class="muted">Οι γραφικές παραστάσεις f και f⁻¹ είναι συμμετρικές ως προς την y = x: το (α, β) ανήκει στην f ⇔ το (β, α) ανήκει στην f⁻¹. Αντίστροφη έχει μόνο η 1–1 συνάρτηση.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 4.2 Τριγωνομετρικές εξισώσεις ---------- */
  trigeq(box) {
    box.innerHTML = `<div class="wctl"><label>εξίσωση <select class="sf"><option value="0">ημx = c</option><option value="1">συνx = c</option><option value="2">εφx = c</option></select></label>
      <label>c <input type="range" class="rc" min="-2" max="2" step="0.05" value="0.5"><b class="vc"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const t = +$(".sf", box).value, c = +$(".rc", box).value; $(".vc", box).textContent = fmt(c);
      const f = [Math.sin, Math.cos, Math.tan][t], nm = ["ημ", "συν", "εφ"][t];
      const P = makePlot($(".pl", box), { xmin: -0.3, xmax: 2 * Math.PI + 0.3, ymin: -2.2, ymax: 2.2, H: 280, xstep: Math.PI / 2, ystep: 0.5 });
      P.svg.querySelectorAll(".tick").forEach(e => { if (e.getAttribute("text-anchor") !== "middle") return; const v = +e.textContent.replace(",", ".").replace("−", "-"); e.textContent = kPi(Math.round(v / (Math.PI / 2)), 2); });
      kCurve(P, f, 0, 2 * Math.PI, "c1"); P.seg(-0.3, c, 7, c, "asl");
      let th, sols = [], gen;
      if (t < 2 && Math.abs(c) > 1) { $(".wout", box).innerHTML = `|c| &gt; 1: η εξίσωση ${nm}x = ${fmt(c)} είναι <b>αδύνατη</b> (−1 ≤ ${nm}x ≤ 1).`; return; }
      if (t === 0) { th = Math.asin(c); sols = [th, Math.PI - th]; gen = `x = 2κπ + θ ή x = 2κπ + π − θ`; }
      else if (t === 1) { th = Math.acos(c); sols = [th, -th]; gen = `x = 2κπ ± θ`; }
      else { th = Math.atan(c); sols = [th, th + Math.PI]; gen = `x = κπ + θ`; }
      const norm = sols.map(x => ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)).sort((u, v) => u - v).filter((x, i, a) => i === 0 || Math.abs(x - a[i - 1]) > 1e-9);
      norm.forEach(x => P.dot(x, c, "d2"));
      $(".wout", box).innerHTML = `${nm}x = ${fmt(c)} &nbsp;·&nbsp; θ ∈ ${t === 2 ? "(−π/2, π/2)" : t === 0 ? "[−π/2, π/2]" : "[0, π]"} με ${nm}θ = ${fmt(c)}: θ ≈ <b>${fmt(th)}</b> rad (${fmt(th * 180 / Math.PI)}°)
        <br>Γενική λύση: <b>${gen}</b>, κ ∈ ℤ
        <br>Λύσεις στο [0, 2π): <b>${norm.map(x => fmt(x)).join(", ")}</b> rad (${norm.map(x => fmt(x * 180 / Math.PI) + "°").join(", ")})
        <br><span class="muted">Σε ειδικές τιμές (0, ±½, ±√2/2, ±√3/2, ±1) δίνουμε τη θ ακριβώς: π.χ. ημx = ½ ⇒ θ = π/6.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 5.5 Μη πεπερασμένο όριο ---------- */
  vlimit(box) {
    box.innerHTML = `<div class="wctl"><label>f(x) = κ/(x − α)ⁿ: εκθέτης n <input type="range" class="rn" min="1" max="4" step="1" value="1"><b class="vn"></b></label>
      <label>κ <select class="sk"><option value="1">1</option><option value="-1">−1</option><option value="2">2</option></select></label>
      <label>α <input type="range" class="ra" min="-2" max="2" step="1" value="1"><b class="va"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const n = +$(".rn", box).value, k = +$(".sk", box).value, a = +$(".ra", box).value; $(".vn", box).textContent = n; $(".va", box).textContent = a;
      const f = x => k / (x - a) ** n, P = makePlot($(".pl", box), { xmin: -5, xmax: 5, ymin: -8, ymax: 8, H: 300 });
      P.curve(f, "c1", -5, a - 1e-3); P.curve(f, "c1", a + 1e-3, 5); P.seg(a, -9, a, 9, "asl");
      const R = k > 0 ? "+∞" : "−∞", L = (k * (n % 2 ? -1 : 1)) > 0 ? "+∞" : "−∞";
      $(".wout", box).innerHTML = `lim<sub>x→${a}⁻</sub> f(x) = <b>${L}</b> &nbsp;·&nbsp; lim<sub>x→${a}⁺</sub> f(x) = <b>${R}</b> &nbsp;·&nbsp; ${L === R ? `lim<sub>x→${a}</sub> f(x) = <b>${R}</b>` : `το lim<sub>x→${a}</sub> f(x) <b>δεν υπάρχει</b> (διαφορετικά πλευρικά)`}
        <br><span class="muted">Με άρτιο n ο παρονομαστής είναι θετικός και από τις δύο πλευρές· με περιττό n αλλάζει πρόσημο.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 5.7 Βασικά τριγωνομετρικά όρια ---------- */
  triglim(box) {
    box.innerHTML = `<div class="wctl"><label>συνάρτηση <select class="sf"><option value="0">ημx / x</option><option value="1">(1 − συνx) / x</option><option value="2">x·ημ(1/x) (παρεμβολή)</option></select></label>
      <label><span>απόσταση από το 0:</span> <input type="range" class="rk" min="0" max="3" step="0.25" value="0.5"><b class="vk"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const t = +$(".sf", box).value, h = Math.pow(10, -+$(".rk", box).value); $(".vk", box).textContent = "h = " + fmt(h);
      const f = [x => Math.sin(x) / x, x => (1 - Math.cos(x)) / x, x => x * Math.sin(1 / x)][t], L = [1, 0, 0][t];
      const P = makePlot($(".pl", box), { xmin: -2 * Math.PI, xmax: 2 * Math.PI, ymin: -1.2, ymax: 1.4, H: 280, xstep: Math.PI / 2, ystep: 0.5 });
      if (t === 2) { P.curve(x => Math.abs(x), "cfam"); P.curve(x => -Math.abs(x), "cfam"); }
      kCurve(P, f, -2 * Math.PI, 2 * Math.PI, "c1"); bkOpen(P, 0, L);
      P.dot(h, f(h), "d2"); P.dot(-h, f(-h), "d1");
      $(".wout", box).innerHTML = `f(${fmt(h)}) = ${(+f(h).toFixed(5)).toLocaleString("el-GR")} &nbsp;·&nbsp; f(${fmt(-h)}) = ${(+f(-h).toFixed(5)).toLocaleString("el-GR")} &nbsp;⇒&nbsp; <b>lim<sub>x→0</sub> = ${L}</b>
        <br><span class="muted">${t === 0 ? "Βασικό όριο: lim ημx/x = 1 (x σε ακτίνια). Γενικεύεται: lim ημ(αx)/(βx) = α/β." : t === 1 ? "Βασικό όριο: lim (1 − συνx)/x = 0." : "Κριτήριο παρεμβολής: −|x| ≤ x·ημ(1/x) ≤ |x| και τα ±|x| → 0, άρα και η f → 0 (γκρι: y = ±|x|)."}</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 5.8 Συνέχεια ---------- */
  contin(box) {
    box.innerHTML = `<div class="wctl"><label>f(x) = x² + 1 (x &lt; 1), κx + 1 (x ≥ 1): κ <input type="range" class="rk" min="-2" max="4" step="0.25" value="2"><b class="vk"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const k = +$(".rk", box).value; $(".vk", box).textContent = fmt(k);
      const P = makePlot($(".pl", box), { xmin: -3, xmax: 4, ymin: -3, ymax: 8, H: 300 });
      P.curve(x => x * x + 1, "c1", -3, 1 - 1e-9); P.curve(x => k * x + 1, "c1", 1, 4);
      const L = 2, Rv = k + 1, ok = Math.abs(L - Rv) < 1e-9;
      if (!ok) bkOpen(P, 1, L); bkFill(P, 1, Rv);
      $(".wout", box).innerHTML = `lim<sub>x→1⁻</sub> f(x) = 1² + 1 = <b>2</b> &nbsp;·&nbsp; lim<sub>x→1⁺</sub> f(x) = κ + 1 = <b>${fmt(Rv)}</b> &nbsp;·&nbsp; f(1) = <b>${fmt(Rv)}</b>
        <br>${ok ? '<span class="okc">lim<sub>x→1</sub> f(x) = f(1) = 2 ⇒ η f είναι <b>συνεχής</b> στο 1 (και άρα στο ℝ).</span>' : '<span class="badc">Τα πλευρικά όρια διαφέρουν ⇒ η f <b>δεν είναι συνεχής</b> στο 1 (άλμα). Βρες το κ που «ενώνει» τα κομμάτια.</span>'}
        <br><span class="muted">Συνέχεια στο x₀: υπάρχει το lim<sub>x→x₀</sub> f(x) και ισούται με f(x₀).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 5.9 Bolzano – διχοτόμηση ---------- */
  bolzano(box) {
    box.innerHTML = `<div class="wctl"><label>f(x) = <input type="text" class="tf" value="x^5 - 3x - 2" style="width:9em"></label>
      <label>α <input type="range" class="ra" min="-3" max="3" step="0.5" value="1"><b class="va"></b></label><label>β <input type="range" class="rb" min="-3" max="3" step="0.5" value="2"><b class="vb"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      let a = +$(".ra", box).value, b = +$(".rb", box).value; $(".va", box).textContent = fmt(a); $(".vb", box).textContent = fmt(b);
      const f = kParse($(".tf", box).value); if (!f) { $(".wout", box).innerHTML = '<span class="warnc">Έλεγξε τον τύπο.</span>'; return; }
      if (a >= b) { $(".wout", box).innerHTML = '<span class="warnc">Πρέπει α &lt; β.</span>'; $(".pl", box).innerHTML = ""; return; }
      const [lo, hi] = fitY(f, a - 0.5, b + 0.5, 0.15, [0]);
      const P = makePlot($(".pl", box), { xmin: a - 0.5, xmax: b + 0.5, ymin: lo, ymax: hi, H: 280 }); P.band(a, b, "bandok"); P.curve(f, "c1");
      const fa = f(a), fb = f(b); P.dot(a, fa, fa < 0 ? "d2" : "d1", `f(${fmt(a)}) = ${fmt(fa)}`, 8, -8); P.dot(b, fb, fb < 0 ? "d2" : "d1", `f(${fmt(b)}) = ${fmt(fb)}`, -8, -8);
      let txt;
      if (fa * fb < 0) { let l = a, r = b, rows = ""; for (let i = 0; i < 6; i++) { const m = (l + r) / 2, fm = f(m); rows += `<tr><td>${i + 1}</td><td>[${(+l.toFixed(4)).toLocaleString("el-GR")}, ${(+r.toFixed(4)).toLocaleString("el-GR")}]</td><td>${(+m.toFixed(4)).toLocaleString("el-GR")}</td><td>${fm < 0 ? "−" : "+"}</td></tr>`; if (fa * fm < 0) r = m; else l = m; }
        P.dot((l + r) / 2, 0, "dinf", "ρίζα ≈ " + fmt((l + r) / 2), 6, 18);
        txt = `f(α)·f(β) &lt; 0 και f συνεχής ⇒ (Bolzano) υπάρχει <b>τουλάχιστον μία ρίζα</b> στο (${fmt(a)}, ${fmt(b)}).<table class="mini"><tr><th>βήμα</th><th>διάστημα</th><th>μέσο m</th><th>πρόσημο f(m)</th></tr>${rows}</table><span class="muted">Διχοτόμηση: κρατάμε κάθε φορά το μισό όπου αλλάζει πρόσημο.</span>`; }
      else txt = `f(α)·f(β) ${fa * fb === 0 ? "= 0: ένα από τα άκρα είναι ρίζα." : "&gt; 0: το θεώρημα Bolzano <b>δεν εφαρμόζεται</b> (δεν αποκλείεται να υπάρχουν ρίζες, αλλά δεν είναι εξασφαλισμένες)."}`;
      $(".wout", box).innerHTML = txt;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 6.3 Μονοτονία ακολουθίας ---------- */
  seqmono(box) {
    box.innerHTML = `<div class="wctl"><label><span>α<sub>ν</sub> =</span> <input type="text" class="tf" value="(2ν+3)/(2ν+1)" style="width:10em"></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const g = kParse($(".tf", box).value.replace(/ν/g, "x").replace(/\bn\b/g, "x")); if (!g) { $(".wout", box).innerHTML = '<span class="warnc">Έλεγξε τον τύπο.</span>'; return; }
      const N = 10, t = []; for (let v = 1; v <= N + 1; v++) t.push(g(v));
      if (t.some(x => !isFinite(x))) { $(".wout", box).innerHTML = '<span class="warnc">Ο τύπος δεν δίνει όρους για ν = 1, …, 11.</span>'; return; }
      let lo = Math.min(0, ...t), hi = Math.max(0, ...t); if (hi - lo < 1) { hi += 0.5; lo -= 0.5; }
      const P = makePlot($(".pl", box), { xmin: -0.3, xmax: N + 0.7, ymin: lo - (hi - lo) * 0.1, ymax: hi + (hi - lo) * 0.1, H: 260, xstep: 1, ystep: niceStep(hi - lo) });
      t.slice(0, N).forEach((y, i) => { P.seg(i + 1, 0, i + 1, y, "guide"); P.dot(i + 1, y, "d1"); });
      const d = t.slice(1).map((y, i) => y - t[i]), up = d.every(x => x > 1e-12), dn = d.every(x => x < -1e-12), cst = d.every(x => Math.abs(x) < 1e-12);
      $(".wout", box).innerHTML = `Διαφορές α<sub>ν+1</sub> − α<sub>ν</sub> (ν = 1…10): ${d.map(x => x > 1e-12 ? "+" : x < -1e-12 ? "−" : "0").join(" ")}
        <br>${cst ? "Σταθερή ακολουθία." : up ? "Φαίνεται <b>γνησίως αύξουσα</b> (α<sub>ν+1</sub> &gt; α<sub>ν</sub>)." : dn ? "Φαίνεται <b>γνησίως φθίνουσα</b> (α<sub>ν+1</sub> &lt; α<sub>ν</sub>)." : d.every(x => x > -1e-12) ? "Φαίνεται <b>αύξουσα</b>, όχι γνησίως (κάποιες διαφορές είναι 0)." : d.every(x => x < 1e-12) ? "Φαίνεται <b>φθίνουσα</b>, όχι γνησίως (κάποιες διαφορές είναι 0)." : "Δεν είναι μονότονη (η διαφορά αλλάζει πρόσημο)."}
        <br><span class="muted">Το γράφημα είναι ένδειξη, όχι απόδειξη: αποδεικνύουμε μελετώντας το πρόσημο της α<sub>ν+1</sub> − α<sub>ν</sub> για <b>κάθε</b> ν (ή τον λόγο α<sub>ν+1</sub>/α<sub>ν</sub> για θετικούς όρους).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 8.2.4 Αλλαγή βάσης ---------- */
  logbase(box) {
    box.innerHTML = `<div class="wctl"><label>βάση α <input type="number" class="na" value="2" step="any" style="width:5em"></label><label>αριθμός β <input type="number" class="nb" value="10" step="any" style="width:6em"></label></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".na", box).value, b = +$(".nb", box).value;
      if (!(a > 0 && a !== 1 && b > 0)) { $(".wout", box).innerHTML = '<span class="warnc">Χρειάζεται α &gt; 0, α ≠ 1 και β &gt; 0.</span>'; return; }
      const v = Math.log(b) / Math.log(a);
      $(".wout", box).innerHTML = `log<sub>${fmt(a)}</sub>${fmt(b)} = log ${fmt(b)} / log ${fmt(a)} = ${(+Math.log10(b).toFixed(5)).toLocaleString("el-GR")} / ${(+Math.log10(a).toFixed(5)).toLocaleString("el-GR")} ≈ <b>${(+v.toFixed(5)).toLocaleString("el-GR")}</b>
        <br>= ln ${fmt(b)} / ln ${fmt(a)} = ${(+Math.log(b).toFixed(5)).toLocaleString("el-GR")} / ${(+Math.log(a).toFixed(5)).toLocaleString("el-GR")} ≈ <b>${(+v.toFixed(5)).toLocaleString("el-GR")}</b>
        <br>Έλεγχος: ${fmt(a)}<sup>${(+v.toFixed(4)).toLocaleString("el-GR")}</sup> ≈ ${fmt(Math.pow(a, v))}
        <br><span class="muted">Αλλαγή βάσης: log<sub>α</sub>β = log<sub>γ</sub>β / log<sub>γ</sub>α για οποιαδήποτε βάση γ — έτσι υπολογίζουμε κάθε λογάριθμο με τα πλήκτρα log ή ln.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 10.8 Πεπλεγμένη: έλλειψη ---------- */
  implicit(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="1" max="4" step="0.5" value="3"><b class="va"></b></label><label>β <input type="range" class="rb" min="1" max="4" step="0.5" value="2"><b class="vb"></b></label>
      <label>θ <input type="range" class="rt" min="0" max="360" step="5" value="40"><b class="vt"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, b = +$(".rb", box).value, t = +$(".rt", box).value; $(".va", box).textContent = fmt(a); $(".vb", box).textContent = fmt(b); $(".vt", box).textContent = t + "°";
      const P = gPlot($(".pl", box), 0, 0, 5.5, 320);
      let d = ""; for (let i = 0; i <= 120; i++) { const u = 2 * Math.PI * i / 120; d += (i ? "L" : "M") + P.sx(a * Math.cos(u)).toFixed(1) + "," + P.sy(b * Math.sin(u)).toFixed(1); }
      P.layer.appendChild(svgEl("path", { d, class: "curve c1" }));
      const x0 = a * Math.cos(gRad(t)), y0 = b * Math.sin(gRad(t)); P.dot(x0, y0, "d2", `(${fmt(x0)}, ${fmt(y0)})`, 8, -8);
      let txt;
      if (Math.abs(y0) < 1e-9) { P.seg(x0, -6, x0, 6, "tangent"); txt = "y₀ = 0: η εφαπτομένη είναι <b>κατακόρυφη</b> (x = " + fmt(x0) + ") — η dy/dx δεν ορίζεται."; }
      else { const m = -(b * b * x0) / (a * a * y0); P.curve(x => y0 + m * (x - x0), "tangent"); txt = `dy/dx = −β²x/(α²y) = −${fmt(b * b)}·${fmt(x0)}/(${fmt(a * a)}·${fmt(y0)}) = <b>${fmt(m)}</b>`; }
      $(".wout", box).innerHTML = `Καμπύλη x²/${fmt(a * a)} + y²/${fmt(b * b)} = 1. Παραγωγίζουμε και τα δύο μέλη ως προς x (το y είναι συνάρτηση του x):
        <br>2x/${fmt(a * a)} + 2y·y'/${fmt(b * b)} = 0 ⇒ ${txt}<br><span class="muted">Κόκκινη διακεκομμένη: η εφαπτομένη στο σημείο.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 10.9 Παραμετρική ---------- */
  param(box) {
    const C = [["x = t² − 2, y = t³/3 − t", t => t * t - 2, t => t ** 3 / 3 - t, t => 2 * t, t => t * t - 1, -2.2, 2.2], ["x = 3συνt, y = 2ημt", t => 3 * Math.cos(t), t => 2 * Math.sin(t), t => -3 * Math.sin(t), t => 2 * Math.cos(t), 0, 2 * Math.PI], ["x = t − ημt, y = 2 + συνt", t => t - Math.sin(t), t => 2 + Math.cos(t), t => 1 - Math.cos(t), t => -Math.sin(t), 0, 2 * Math.PI], ["x = 3t, y = 9t²", t => 3 * t, t => 9 * t * t, t => 3, t => 18 * t, -1, 1]];
    box.innerHTML = `<div class="wctl"><label>καμπύλη <select class="sc">${C.map((c, i) => `<option value="${i}">${c[0]}</option>`).join("")}</select></label>
      <label>t <input type="range" class="rt" min="0" max="1" step="0.01" value="0.7"><b class="vt"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const k = C[+$(".sc", box).value], t = k[5] + (k[6] - k[5]) * +$(".rt", box).value; $(".vt", box).textContent = fmt(t);
      const P = gPlot($(".pl", box), 1, 1.5, 6, 320);
      let d = ""; for (let i = 0; i <= 200; i++) { const u = k[5] + (k[6] - k[5]) * i / 200; d += (i ? "L" : "M") + P.sx(k[1](u)).toFixed(1) + "," + P.sy(k[2](u)).toFixed(1); }
      P.layer.appendChild(svgEl("path", { d, class: "curve c1" }));
      const x0 = k[1](t), y0 = k[2](t), dx = k[3](t), dy = k[4](t); P.dot(x0, y0, "d2", `t = ${fmt(t)}`, 8, -8);
      let txt;
      if (Math.abs(dx) < 1e-9) { P.seg(x0, -6, x0, 9, "tangent"); txt = `dx/dt = 0: <b>κατακόρυφη</b> εφαπτομένη.`; }
      else { const m = dy / dx; P.curve(x => y0 + m * (x - x0), "tangent"); txt = `dy/dx = (dy/dt)/(dx/dt) = ${fmt(dy)}/${fmt(dx)} = <b>${fmt(m)}</b>${Math.abs(dy) < 1e-9 ? " — <b>οριζόντια</b> εφαπτομένη" : ""}`; }
      $(".wout", box).innerHTML = `Σημείο (${fmt(x0)}, ${fmt(y0)}) &nbsp;·&nbsp; ${txt}<br><span class="muted">Για παραμετρικά ορισμένη καμπύλη x = x(t), y = y(t): dy/dx = y'(t)/x'(t), όπου x'(t) ≠ 0.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 10.10 Παράγωγος αντίστροφης ---------- */
  invderiv(box) {
    box.innerHTML = `<div class="wctl"><label>x₀ <input type="range" class="rx" min="-2" max="1.8" step="0.1" value="0.5"><b class="vx"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const x0 = +$(".rx", box).value, y0 = Math.exp(x0); $(".vx", box).textContent = fmt(x0);
      const P = gPlot($(".pl", box), 2, 2, 6, 330); P.seg(-10, -10, 12, 12, "guide");
      P.curve(x => Math.exp(x), "c2"); P.curve(x => Math.log(x), "c1", 1e-4, 9);
      P.curve(x => y0 + y0 * (x - x0), "tangent"); P.curve(x => x0 + (x - y0) / y0, "tangent");
      P.dot(x0, y0, "d2", `(${fmt(x0)}, ${fmt(y0)})`, -8, -8); P.dot(y0, x0, "d1", `(${fmt(y0)}, ${fmt(x0)})`, 8, 16);
      $(".wout", box).innerHTML = `<span style="color:var(--purple)">f(x) = eˣ: f'(${fmt(x0)}) = e<sup>${fmt(x0)}</sup> = <b>${fmt(y0)}</b></span> &nbsp;·&nbsp; <span style="color:var(--blue)">f⁻¹(x) = ln x: (ln x)' στο ${fmt(y0)} = 1/${fmt(y0)} = <b>${fmt(1 / y0)}</b></span>
        <br>(f⁻¹)'(y₀) = 1 / f'(x₀), όπου y₀ = f(x₀) &nbsp;⇒&nbsp; <b>(ln x)' = 1/x</b>
        <br><span class="muted">Οι εφαπτομένες σε συμμετρικά σημεία είναι συμμετρικές ως προς την y = x, άρα οι κλίσεις τους είναι αντίστροφοι αριθμοί.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 7 Γεωμετρικοί τόποι ---------- */
  locus(box) {
    const T = ["σημεία που ισαπέχουν από Α, Β", "σημεία σε απόσταση R από το Ο", "μέσα Μ των ακτίνων κύκλου (Ο, ρ)", "μέσο Μ του ΑΒ, όταν το Β κινείται σε ευθεία", "σημεία Μ με ∠ΑΜΒ = 90°"];
    box.innerHTML = `<div class="wctl"><label>τόπος <select class="st">${T.map((t, i) => `<option value="${i}">${t}</option>`).join("")}</select></label>
      <label>θέση σημείου <input type="range" class="rp" min="0" max="1" step="0.01" value="0.3"></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const k = +$(".st", box).value, p = +$(".rp", box).value, P = gPlot($(".pl", box), 0, 0, 5.5, 320, false);
      const A = [-2, -0.5], B = [2, 0.5]; let M, txt, trace = [];
      const ptAt = q => {
        if (k === 0) { const mx = 0, my = 0, dx = -(B[1] - A[1]), dy = B[0] - A[0], s = (q - 0.5) * 6 / Math.hypot(dx, dy); return [mx + dx * s, my + dy * s]; }
        if (k === 1) return [2.5 * Math.cos(2 * Math.PI * q), 2.5 * Math.sin(2 * Math.PI * q)];
        if (k === 2) return [1.5 * Math.cos(2 * Math.PI * q), 1.5 * Math.sin(2 * Math.PI * q)];
        if (k === 3) { const Bx = -4 + 8 * q, By = -2; return [(Bx + 0) / 2, (By + 2.5) / 2]; }
        const r = (2 * q) % 1, qq = r < 0.03 ? q + 0.03 - r : r > 0.97 ? q - (r - 0.97) : q;
        return [2.5 * Math.cos(2 * Math.PI * qq), 2.5 * Math.sin(2 * Math.PI * qq)];
      };
      for (let i = 0; i <= 60; i++) { const q = i / 60; if (q <= p || true) trace.push(ptAt(q)); }
      trace.filter((_, i) => i / 60 <= p).forEach(pt => P.top.appendChild(svgEl("circle", { cx: P.sx(pt[0]), cy: P.sy(pt[1]), r: 2.5, style: "fill:var(--amber)" })));
      M = ptAt(p);
      if (k === 0) { P.dot(...A, "d1", "Α", -8, -8); P.dot(...B, "d1", "Β", 8, -8); gLine(P, ...A, ...M, "stroke:var(--blue);stroke-width:1.6"); gLine(P, ...B, ...M, "stroke:var(--blue);stroke-width:1.6");
        txt = `ΜΑ = ${fmt(Math.hypot(M[0] - A[0], M[1] - A[1]))}, ΜΒ = ${fmt(Math.hypot(M[0] - B[0], M[1] - B[1]))} — ο τόπος είναι η <b>μεσοκάθετος</b> του ΑΒ.`; }
      else if (k === 1) { P.dot(0, 0, "d1", "Ο", 8, 14); gLine(P, 0, 0, ...M, "stroke:var(--blue);stroke-width:1.6"); txt = `ΟΜ = 2,5 σταθερό — ο τόπος είναι ο <b>κύκλος (Ο, 2,5)</b>.`; }
      else if (k === 2) { P.dot(0, 0, "d1", "Ο", 8, 14); gCircle(P, 0, 0, 3, "stroke:var(--line);stroke-width:1.6;fill:none"); const E = [M[0] * 2, M[1] * 2]; gLine(P, 0, 0, ...E, "stroke:var(--blue);stroke-width:1.6"); txt = `ΟΜ = ρ/2 για κάθε ακτίνα — ο τόπος είναι ο <b>ομόκεντρος κύκλος (Ο, ρ/2)</b>.`; }
      else if (k === 3) { const A2 = [0, 2.5], Bp = [-4 + 8 * p, -2]; gLine(P, -6, -2, 6, -2, "stroke:var(--line);stroke-width:2"); P.dot(...A2, "d1", "Α", 8, -8); P.dot(...Bp, "d1", "Β", 8, 16); gLine(P, ...A2, ...Bp, "stroke:var(--blue);stroke-width:1.6");
        txt = `Το Μ απέχει πάντα το μισό της απόστασης του Α από την ευθεία — ο τόπος είναι <b>ευθεία παράλληλη</b> στην (ε), στη μέση της απόστασης.`; }
      else { const A3 = [-2.5, 0], B3 = [2.5, 0]; P.dot(...A3, "d1", "Α", -10, 14); P.dot(...B3, "d1", "Β", 8, 14); gLine(P, ...A3, ...M, "stroke:var(--blue);stroke-width:1.6"); gLine(P, ...B3, ...M, "stroke:var(--blue);stroke-width:1.6");
        const ang = Math.abs(gAng(M[0], M[1], A3[0], A3[1]) - gAng(M[0], M[1], B3[0], B3[1])); txt = `∠ΑΜΒ = ${fmt(ang > 180 ? 360 - ang : ang)}° — ο τόπος είναι ο <b>κύκλος με διάμετρο ΑΒ</b> (χωρίς τα Α, Β).`; }
      P.dot(...M, "d2", "Μ", 8, -8);
      $(".wout", box).innerHTML = txt + `<br><span class="muted">Κίνησε το σημείο: τα πορτοκαλί ίχνη σχηματίζουν τον γεωμετρικό τόπο — το σύνολο των σημείων που έχουν την ιδιότητα και <b>μόνο</b> αυτών.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  }
});

/* ================= Γεννήτριες ================= */
var GENS = Object.assign(window.GENS || {}, {
  gsumtrig: { title: "Γεννήτρια — ημ, συν αθροίσματος και διαφοράς", make() {
    const T1 = bkPick(kTRIPLES), T2 = bkPick(kTRIPLES), q1 = ri(1, 2), q2 = bkPick([1, 3, 4]), op = ri(0, 1) ? 1 : -1;
    const sgS = q => q <= 2 ? 1 : -1, sgC = q => q === 1 || q === 4 ? 1 : -1;
    const s1 = sgS(q1) * T1[0], c1 = sgC(q1) * T1[1], r1 = T1[2], s2 = sgS(q2) * T2[1], c2 = sgC(q2) * T2[0], r2 = T2[2];
    const rng = q => [R`0 < \alpha < \frac{\pi}{2}`, R`\frac{\pi}{2} < \alpha < \pi`, R`\pi < \alpha < \frac{3\pi}{2}`, R`\frac{3\pi}{2} < \alpha < 2\pi`][q - 1];
    const sn = s1 * c2 + op * c1 * s2, cs = c1 * c2 - op * s1 * s2, R2 = r1 * r2, o = op > 0 ? "+" : "-";
    return { q: R`Αν $\text{ημ}\alpha = ${texFrac(s1, r1)}$ με $${rng(q1)}$ και $\text{συν}\beta = ${texFrac(c2, r2)}$ με $${rng(q2).replace(/alpha/g, "beta")}$, να υπολογίσετε τα $\text{ημ}(\alpha ${o} \beta)$ και $\text{συν}(\alpha ${o} \beta)$.`,
      fields: [{ label: `ημ(α ${o === "+" ? "+" : "−"} β) =`, ans: kF(sn, R2) }, { label: `συν(α ${o === "+" ? "+" : "−"} β) =`, ans: kF(cs, R2) }],
      sol: R`$\text{συν}\alpha = ${texFrac(c1, r1)}$ (πρόσημο από το τεταρτημόριο), $\text{ημ}\beta = ${texFrac(s2, r2)}$.<br>$\text{ημ}(\alpha ${o} \beta) = \text{ημ}\alpha\,\text{συν}\beta ${o} \text{συν}\alpha\,\text{ημ}\beta = \frac{${s1 * c2} ${op * c1 * s2 < 0 ? "-" : "+"} ${Math.abs(c1 * s2)}}{${R2}} = ${texFrac(sn, R2)}$.<br>$\text{συν}(\alpha ${o} \beta) = \text{συν}\alpha\,\text{συν}\beta ${op > 0 ? "-" : "+"} \text{ημ}\alpha\,\text{ημ}\beta = \frac{${c1 * c2} ${-op * s1 * s2 < 0 ? "-" : "+"} ${Math.abs(s1 * s2)}}{${R2}} = ${texFrac(cs, R2)}$.` };
  } },
  gdouble: { title: "Γεννήτρια — τριγωνομετρικοί αριθμοί διπλάσιας γωνίας", make() {
    const T = bkPick(kTRIPLES), q = ri(1, 4), sgS = q <= 2 ? 1 : -1, sgC = q === 1 || q === 4 ? 1 : -1, sw = ri(0, 1);
    const s = sgS * (sw ? T[0] : T[1]), c = sgC * (sw ? T[1] : T[0]), r = T[2];
    const rng = [R`0 < \alpha < \frac{\pi}{2}`, R`\frac{\pi}{2} < \alpha < \pi`, R`\pi < \alpha < \frac{3\pi}{2}`, R`\frac{3\pi}{2} < \alpha < 2\pi`][q - 1];
    const S2 = 2 * s * c, C2 = c * c - s * s, D = r * r;
    return { q: R`Αν $\text{συν}\alpha = ${texFrac(c, r)}$ και $${rng}$, να υπολογίσετε τα $\text{ημ}2\alpha$, $\text{συν}2\alpha$ και $\text{εφ}2\alpha$.`,
      fields: [{ label: "ημ2α =", ans: kF(S2, D) }, { label: "συν2α =", ans: kF(C2, D) }, { label: "εφ2α =", ans: kF(S2, C2) }],
      sol: R`$\text{ημ}\alpha = ${texFrac(s, r)}$ (από $\text{ημ}^2\alpha + \text{συν}^2\alpha = 1$ και το τεταρτημόριο). $\text{ημ}2\alpha = 2\,\text{ημ}\alpha\,\text{συν}\alpha = ${texFrac(S2, D)}$, $\ \text{συν}2\alpha = \text{συν}^2\alpha - \text{ημ}^2\alpha = ${texFrac(C2, D)}$, $\ \text{εφ}2\alpha = \frac{\text{ημ}2\alpha}{\text{συν}2\alpha} = ${texFrac(S2, C2)}$.` };
  } },
  gspecial: { title: "Γεννήτρια — ακριβείς τιμές με τύπους αθροίσματος", make() {
    const C = [["\\text{ημ}75^\\circ", "(√6+√2)/4", "\\text{ημ}(45^\\circ + 30^\\circ) = \\frac{\\sqrt2}{2}\\cdot\\frac{\\sqrt3}{2} + \\frac{\\sqrt2}{2}\\cdot\\frac12 = \\frac{\\sqrt6 + \\sqrt2}{4}"],
      ["\\text{συν}75^\\circ", "(√6-√2)/4", "\\text{συν}(45^\\circ + 30^\\circ) = \\frac{\\sqrt2}{2}\\cdot\\frac{\\sqrt3}{2} - \\frac{\\sqrt2}{2}\\cdot\\frac12 = \\frac{\\sqrt6 - \\sqrt2}{4}"],
      ["\\text{ημ}15^\\circ", "(√6-√2)/4", "\\text{ημ}(45^\\circ - 30^\\circ) = \\frac{\\sqrt2}{2}\\cdot\\frac{\\sqrt3}{2} - \\frac{\\sqrt2}{2}\\cdot\\frac12 = \\frac{\\sqrt6 - \\sqrt2}{4}"],
      ["\\text{συν}15^\\circ", "(√6+√2)/4", "\\text{συν}(45^\\circ - 30^\\circ) = \\frac{\\sqrt2}{2}\\cdot\\frac{\\sqrt3}{2} + \\frac{\\sqrt2}{2}\\cdot\\frac12 = \\frac{\\sqrt6 + \\sqrt2}{4}"],
      ["\\text{εφ}75^\\circ", "2+√3", "\\text{εφ}(45^\\circ + 30^\\circ) = \\frac{1 + \\frac{\\sqrt3}{3}}{1 - \\frac{\\sqrt3}{3}} = \\frac{3 + \\sqrt3}{3 - \\sqrt3} = 2 + \\sqrt3"],
      ["\\text{εφ}15^\\circ", "2-√3", "\\text{εφ}(45^\\circ - 30^\\circ) = \\frac{1 - \\frac{\\sqrt3}{3}}{1 + \\frac{\\sqrt3}{3}} = \\frac{3 - \\sqrt3}{3 + \\sqrt3} = 2 - \\sqrt3"],
      ["\\text{ημ}105^\\circ", "(√6+√2)/4", "\\text{ημ}(60^\\circ + 45^\\circ) = \\frac{\\sqrt3}{2}\\cdot\\frac{\\sqrt2}{2} + \\frac12\\cdot\\frac{\\sqrt2}{2} = \\frac{\\sqrt6 + \\sqrt2}{4}"],
      ["\\text{συν}105^\\circ", "(√2-√6)/4", "\\text{συν}(60^\\circ + 45^\\circ) = \\frac12\\cdot\\frac{\\sqrt2}{2} - \\frac{\\sqrt3}{2}\\cdot\\frac{\\sqrt2}{2} = \\frac{\\sqrt2 - \\sqrt6}{4}"]];
    const c = bkPick(C);
    return { q: R`Να υπολογίσετε, χωρίς υπολογιστική μηχανή, την ακριβή τιμή του $${c[0]}$ (γράψτε π.χ. <code>(√6+√2)/4</code>).`, fields: [{ label: "=", ans: c[1] }],
      sol: R`$${c[0]} = ${c[2]}$.` };
  } },
  gtanspec: { title: "Γεννήτρια — ακριβείς τιμές εφαπτομένης και συνεφαπτομένης", make() {
    const C = [["\\text{εφ}75^\\circ", "2+√3", "\\text{εφ}(45^\\circ + 30^\\circ) = \\frac{1 + \\frac{\\sqrt3}{3}}{1 - \\frac{\\sqrt3}{3}} = \\frac{3 + \\sqrt3}{3 - \\sqrt3} = 2 + \\sqrt3"],
      ["\\text{εφ}15^\\circ", "2-√3", "\\text{εφ}(45^\\circ - 30^\\circ) = \\frac{1 - \\frac{\\sqrt3}{3}}{1 + \\frac{\\sqrt3}{3}} = \\frac{3 - \\sqrt3}{3 + \\sqrt3} = 2 - \\sqrt3"],
      ["\\text{σφ}75^\\circ", "2-√3", "\\frac{1}{\\text{εφ}75^\\circ} = \\frac{1}{2 + \\sqrt3} = 2 - \\sqrt3"],
      ["\\text{σφ}15^\\circ", "2+√3", "\\frac{1}{\\text{εφ}15^\\circ} = \\frac{1}{2 - \\sqrt3} = 2 + \\sqrt3"],
      ["\\text{εφ}105^\\circ", "-2-√3", "\\text{εφ}(60^\\circ + 45^\\circ) = \\frac{\\sqrt3 + 1}{1 - \\sqrt3} = \\frac{(\\sqrt3 + 1)^2}{1 - 3} = -2 - \\sqrt3"],
      ["\\text{εφ}165^\\circ", "-2+√3", "\\text{εφ}(120^\\circ + 45^\\circ) = \\frac{-\\sqrt3 + 1}{1 + \\sqrt3} = \\frac{(1 - \\sqrt3)^2}{1 - 3} = -2 + \\sqrt3"]];
    const c = bkPick(C);
    return { q: R`Να υπολογίσετε, χωρίς υπολογιστική μηχανή, την ακριβή τιμή της $${c[0]}$ (γράψτε π.χ. <code>2+√3</code>).`, fields: [{ label: "=", ans: c[1], tol: 0.0005 }],
      sol: R`$${c[0]} = ${c[2]}$.` };
  } },
  gabs: { title: "Γεννήτρια — εξισώσεις και ανισώσεις με απόλυτες τιμές", make() {
    const t = ri(0, 2), a = ri(1, 3), b = ri(-6, 6), c = ri(1, 9), lin = bkLin(a, b);
    if (t === 0) return { q: R`Να λύσετε την εξίσωση $|${lin}| = ${c}$.`, fields: [{ label: "x₁ (μικρότερη) =", ans: kF(-c - b, a) }, { label: "x₂ =", ans: kF(c - b, a) }],
      sol: R`$${lin} = ${c}$ ή $${lin} = -${c}$, άρα $x = ${texFrac(c - b, a)}$ ή $x = ${texFrac(-c - b, a)}$.` };
    if (t === 1) return { q: R`Να λύσετε την ανίσωση $|${lin}| < ${c}$. Η λύση είναι διάστημα $(\kappa, \lambda)$.`, fields: [{ label: "κ =", ans: kF(-c - b, a) }, { label: "λ =", ans: kF(c - b, a) }],
      sol: R`$|${lin}| < ${c} \iff -${c} < ${lin} < ${c} \iff ${texFrac(-c - b, a)} < x < ${texFrac(c - b, a)}$.` };
    return bkMC({ q: R`Η εξίσωση $|${lin}| = -${c}$:`, sol: R`Η απόλυτη τιμή είναι πάντα μη αρνητική, άρα δεν μπορεί να ισούται με $-${c}$: <b>αδύνατη</b>.` }, ["είναι αδύνατη", `έχει λύση $x = ${texFrac(-c - b, a)}$`, "έχει δύο λύσεις", "είναι ταυτότητα"], 0);
  } },
  gparity: { title: "Γεννήτρια — άρτιες και περιττές συναρτήσεις", make() {
    const E = ["$f(x) = 3x^2 + 5x^4$", "$f(x) = 3|x| + 1$", "$f(x) = x^6 - x^4$", "$f(x) = |x - 2| + |x + 2|$", "$f(x) = \\text{συν}x + x^2$", "$f(x) = \\frac{1}{x^2 + 1}$"];
    const O = ["$f(x) = x^3 - 3x^5$", "$f(x) = \\frac{x^3}{1 + x^2}$", "$f(x) = 3x^3 + x$", "$f(x) = \\text{ημ}x$", "$f(x) = x|x|$", "$f(x) = \\frac{1}{x}$"];
    const N = ["$f(x) = |x + 1|$", "$f(x) = x^2 + x$", "$f(x) = \\sqrt{x - 4},\\ x \\ge 4$", "$f(x) = (x - 1)^2$", "$f(x) = x^3 + 1$"];
    const k = ri(0, 2), fn = bkPick([E, O, N][k]);
    const why = ["$f(-x) = f(x)$ για κάθε $x$ (και συμμετρικό πεδίο ορισμού).", "$f(-x) = -f(x)$ για κάθε $x$ (και συμμετρικό πεδίο ορισμού).", "δεν ισχύει ούτε $f(-x) = f(x)$ ούτε $f(-x) = -f(x)$ για όλα τα $x$ (ή το πεδίο ορισμού δεν είναι συμμετρικό)."][k];
    return bkMC({ q: R`Η συνάρτηση ${fn} είναι:`, sol: R`${["Άρτια", "Περιττή", "Ούτε άρτια ούτε περιττή"][k]}: ${why}` }, ["άρτια", "περιττή", "ούτε άρτια ούτε περιττή"], k);
  } },
  gcomp: { title: "Γεννήτρια — σύνθεση συναρτήσεων", make() {
    const a = ri(1, 4) * (ri(0, 1) ? 1 : -1), b = ri(-5, 5), c = ri(-4, 4), x0 = ri(-3, 3);
    const f = x => a * x + b, g = x => x * x + c;
    if (ri(0, 1)) return { q: R`Δίνονται $f(x) = ${bkLin(a, b)}$ και $g(x) = ${bkPolyTex([[1, 2], [c, 0]])}$. Να υπολογίσετε τα $(f\circ g)(${x0})$ και $(g\circ f)(${x0})$.`,
      fields: [{ label: `(f∘g)(${x0}) =`, ans: f(g(x0)) }, { label: `(g∘f)(${x0}) =`, ans: g(f(x0)) }],
      sol: R`$(f\circ g)(${x0}) = f(g(${x0})) = f(${g(x0)}) = ${f(g(x0))}$. $\ (g\circ f)(${x0}) = g(f(${x0})) = g(${f(x0)}) = ${g(f(x0))}$.` };
    return { type: "expr", label: "(f∘g)(x) =", q: R`Δίνονται $f(x) = ${bkLin(a, b)}$ και $g(x) = ${bkPolyTex([[1, 2], [c, 0]])}$. Να βρείτε τον τύπο της $f\circ g$.`, ref: `${a}*(x^2+(${c}))+(${b})`, key: `${a}*(x^2+(${c}))+(${b})`,
      sol: R`$(f\circ g)(x) = f(g(x)) = ${a === 1 ? "" : a === -1 ? "-" : a}${c === 0 ? "x^2" : `(x^2 ${c < 0 ? "-" : "+"} ${Math.abs(c)})`}${b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)}`} = ${bkPolyTex([[a, 2], [a * c + b, 0]])}$, $x \in \mathbb{R}$.` };
  } },
  ginv: { title: "Γεννήτρια — αντίστροφη συνάρτηση", make() {
    if (ri(0, 1)) { const a = ri(1, 5) * (ri(0, 1) ? 1 : -1), b = ri(-6, 6), y0 = ri(-8, 8);
      return { q: R`Η $f(x) = ${bkLin(a, b)}$, $x \in \mathbb{R}$, αντιστρέφεται. Να βρείτε την τιμή $f^{-1}(${y0})$.`, fields: [{ label: `f⁻¹(${y0}) =`, ans: kF(y0 - b, a) }],
        sol: R`$f^{-1}(${y0}) = x \iff f(x) = ${y0} \iff ${bkLin(a, b)} = ${y0} \iff x = ${texFrac(y0 - b, a)}$. (Γενικά $f^{-1}(x) = ${((nm) => a === 1 ? nm : a === -1 ? `-(${nm})` : `${a < 0 ? "-" : ""}\\frac{${nm}}{${Math.abs(a)}}`)(b === 0 ? "x" : `x ${b < 0 ? "+" : "-"} ${Math.abs(b)}`)}$.)` }; }
    const a = ri(1, 3), b = ri(-4, 4), d = ri(-4, 4); if (a * d - b === 0 || d === 0) return GENS.ginv.make(); const y0 = bkPick([2, 3, -1, -2, 0].filter(y => y !== a));
    /* f(x) = (ax + b)/(x + d), y = f(x) => x = (b - d y)/(y - a) */
    const xn = b - d * y0, xd = y0 - a;
    return { q: R`Η $f(x) = \dfrac{${bkLin(a, b)}}{${bkLin(1, d)}}$, $x \ne ${-d}$, είναι 1–1. Να βρείτε το $f^{-1}(${y0})$.`, fields: [{ label: `f⁻¹(${y0}) =`, ans: kF(xn, xd) }],
      sol: R`Λύνουμε $\frac{${bkLin(a, b)}}{${bkLin(1, d)}} = ${y0}$: $${bkLin(a, b)} = ${y0}(${bkLin(1, d)}) \Rightarrow ${xd === -1 ? "-x" : xd === 1 ? "x" : `${-xd}x`} = ${xn} \Rightarrow x = ${texFrac(xn, xd)}$.` };
  } },
  gtrigeq: { title: "Γεννήτρια — τριγωνομετρικές εξισώσεις στο [0, 2π)", make() {
    const t = ri(0, 2), V = [["0", 0], ["1/2", 1 / 2], ["-1/2", -1 / 2], ["√2/2", Math.SQRT1_2], ["-√2/2", -Math.SQRT1_2], ["√3/2", Math.sqrt(3) / 2], ["-√3/2", -Math.sqrt(3) / 2], ["1", 1], ["-1", -1]];
    const VT = [["0", 0], ["1", 1], ["-1", -1], ["√3", Math.sqrt(3)], ["-√3", -Math.sqrt(3)], ["√3/3", Math.sqrt(3) / 3], ["-√3/3", -Math.sqrt(3) / 3]];
    const [cs, c] = bkPick(t === 2 ? VT : V), nm = ["ημ", "συν", "εφ"][t];
    let th = [Math.asin, Math.acos, Math.atan][t](c); let sols = t === 0 ? [th, Math.PI - th] : t === 1 ? [th, -th] : [th, th + Math.PI];
    sols = sols.map(x => ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)).map(x => Math.abs(x - 2 * Math.PI) < 1e-9 ? 0 : x).sort((u, v) => u - v).filter((x, i, a) => i === 0 || Math.abs(x - a[i - 1]) > 1e-9);
    const asPi = x => { const k = Math.round(x / Math.PI * 12); return kPi(k, 12); }, asT = x => { const k = Math.round(x / Math.PI * 12); return kPiT(k, 12); };
    const cT = cs.replace(/√(\d)/g, "\\sqrt$1").replace(/(-?)(\\sqrt\d|\d)\/(\d)/, "$1\\frac{$2}{$3}");
    const addT = (base, v) => Math.abs(v) < 1e-12 ? base : `${base} ${v < 0 ? "-" : "+"} ${asT(Math.abs(v))}`;
    const gen = t === 0 ? `x = ${addT("2\\kappa\\pi", th)}$ ή $x = ${addT("2\\kappa\\pi", Math.PI - th)}` : t === 1 ? (Math.abs(th) < 1e-12 ? "x = 2\\kappa\\pi" : `x = 2\\kappa\\pi \\pm ${asT(th)}`) : `x = ${addT("\\kappa\\pi", th)}`;
    return { q: R`Να βρείτε τις λύσεις της εξίσωσης $\text{${nm}}x = ${cT}$ στο διάστημα $[0, 2\pi)$, σε αύξουσα σειρά (γράψτε π.χ. <code>5π/6</code>).`,
      fields: sols.map((x, i) => ({ label: `x${"₁₂₃"[i]} =`, ans: asPi(x), tol: 0.002 })),
      sol: R`Μία λύση: $\theta = ${asT(th)}$. Γενική λύση: $${gen}$, $\kappa \in \mathbb{Z}$. Στο $[0, 2\pi)$: $${sols.map(asT).join(",\\ ")}$.` };
  } },
  ginfl: { title: "Γεννήτρια — μη πεπερασμένα όρια", make() {
    const a = ri(-4, 4), n = ri(1, 4), k = ri(1, 5) * (ri(0, 1) ? 1 : -1), side = ri(0, 2);
    const base = a === 0 ? "x" : `x ${a < 0 ? "+" : "-"} ${Math.abs(a)}`, den = n === 1 ? base : a === 0 ? `x^{${n}}` : `(${base})^{${n}}`;
    const R0 = k > 0 ? 0 : 1, L0 = k * (n % 2 ? -1 : 1) > 0 ? 0 : 1;
    const ans = side === 0 ? L0 : side === 1 ? R0 : (L0 === R0 ? L0 : 2), tgt = side === 0 ? `${a}^-` : side === 1 ? `${a}^+` : `${a}`;
    return bkMC({ q: R`Να βρείτε το $\lim_{x\to ${tgt}} \dfrac{${k}}{${den}}$.`,
      sol: R`Ο παρονομαστής τείνει στο $0$${n % 2 ? `, με πρόσημο ${side === 0 ? "αρνητικό (x < " + a + ")" : side === 1 ? "θετικό (x > " + a + ")" : "που αλλάζει στις δύο πλευρές"}` : " με θετικές τιμές (άρτια δύναμη)"}, ο αριθμητής είναι $${k}$. Αριστερό όριο: $${L0 ? "-" : "+"}\infty$, δεξί όριο: $${R0 ? "-" : "+"}\infty$.${side === 2 ? (L0 === R0 ? ` Ίσα, άρα το όριο είναι $${L0 ? "-" : "+"}\\infty$.` : " Διαφορετικά, άρα το όριο δεν υπάρχει.") : ""}` },
      ["$+\\infty$", "$-\\infty$", "δεν υπάρχει", "$0$"], ans);
  } },
  glimrat: { title: "Γεννήτρια — όρια ρητών στο άπειρο", make() {
    const n = ri(1, 4), m = ri(1, 4), a = ri(1, 6) * (ri(0, 1) ? 1 : -1), b = ri(1, 6) * (ri(0, 1) ? 1 : -1), side = ri(0, 1) ? 1 : -1;
    const num = bkPolyTex([[a, n], [ri(-5, 5), 0]]), Q = bkPolyTex([[b, m], [ri(-5, 5), 0]]);
    let ansI;
    if (n === m) ansI = 3; else if (n < m) ansI = 2; else { const s = Math.sign(a / b) * (side < 0 && (n - m) % 2 ? -1 : 1); ansI = s > 0 ? 0 : 1; }
    const opts = ["$+\\infty$", "$-\\infty$", "$0$", `$${texFrac(a, b)}$`];
    return bkMC({ q: R`Να βρείτε το $\lim_{x\to ${side > 0 ? "+" : "-"}\infty} \dfrac{${num}}{${Q}}$.`,
      sol: R`Στο $\pm\infty$ κρατάμε τους μεγιστοβάθμιους όρους: $\lim \frac{${bkPolyTex([[a, n]])}}{${bkPolyTex([[b, m]])}} = ${n === m ? texFrac(a, b) : n < m ? R`\lim \left(${texFrac(a, b)}\cdot\frac{1}{x^{${m - n}}}\right) = 0` : R`\lim ${texFrac(a, b)}\,x^{${n - m}} = ${ansI ? "-" : "+"}\infty`}$.` }, opts, ansI);
  } },
  gtriglim: { title: "Γεννήτρια — τριγωνομετρικά όρια", make() {
    const t = ri(0, 2), a = ri(2, 6); let b = ri(2, 6); if (b === a) b = a === 6 ? 5 : a + 1;
    if (t === 0) return { q: R`Να υπολογίσετε το $\lim_{x\to 0}\dfrac{\text{ημ}${a === 1 ? "" : a}x}{${b === 1 ? "" : b}x}$.`, fields: [{ label: "όριο =", ans: kF(a, b) }],
      sol: R`$\frac{\text{ημ}${a}x}{${b}x} = \frac{${a}}{${b}}\cdot\frac{\text{ημ}${a}x}{${a}x} \to \frac{${a}}{${b}}\cdot 1 = ${texFrac(a, b)}$.` };
    if (t === 1) return { q: R`Να υπολογίσετε το $\lim_{x\to 0}\dfrac{\text{ημ}${a === 1 ? "" : a}x}{\text{ημ}${b === 1 ? "" : b}x}$.`, fields: [{ label: "όριο =", ans: kF(a, b) }],
      sol: R`$\frac{\text{ημ}${a}x}{\text{ημ}${b}x} = \frac{\text{ημ}${a}x}{${a}x}\cdot\frac{${b}x}{\text{ημ}${b}x}\cdot\frac{${a}}{${b}} \to ${texFrac(a, b)}$.` };
    return { q: R`Να υπολογίσετε το $\lim_{x\to 0}\dfrac{1 - \text{συν}${a === 1 ? "" : a}x}{x^2}$.`, fields: [{ label: "όριο =", ans: kF(a * a, 2) }],
      sol: R`$1 - \text{συν}${a}x = 2\,\text{ημ}^2\frac{${a}x}{2}$, άρα $\frac{1 - \text{συν}${a}x}{x^2} = 2\left(\frac{\text{ημ}\frac{${a}x}{2}}{x}\right)^2 \to 2\left(\frac{${a}}{2}\right)^2 = ${texFrac(a * a, 2)}$.` };
  } },
  gcont: { title: "Γεννήτρια — συνέχεια συνάρτησης πολλαπλού τύπου", make() {
    const x0 = ri(-3, 3), p = ri(1, 4) * (ri(0, 1) ? 1 : -1), q = ri(-5, 5), k = x0 * x0 + q - p * x0;
    return { q: R`Δίνεται $f(x) = \begin{cases} ${p === 1 ? "" : p === -1 ? "-" : p}x + \kappa, & x < ${x0} \\ ${bkPolyTex([[1, 2], [q, 0]])}, & x \ge ${x0}\end{cases}$. Να βρείτε το $\kappa$ ώστε η $f$ να είναι συνεχής στο $\mathbb{R}$.`,
      fields: [{ label: "κ =", ans: k }],
      sol: R`Σε κάθε κομμάτι η $f$ είναι πολυωνυμική, άρα συνεχής. Στο $${x0}$: $\lim_{x\to ${x0}^-} f(x) = ${p * x0} + \kappa$ και $\lim_{x\to ${x0}^+} f(x) = f(${x0}) = ${x0 * x0 + q}$. Πρέπει $${p * x0} + \kappa = ${x0 * x0 + q} \Rightarrow \kappa = ${k}$.` };
  } },
  gbolz: { title: "Γεννήτρια — θεώρημα Bolzano", make() {
    const c = bkPick([2, 3, 5, 6, 7, 10, 12, 15, 20, 30, 40, 50, 60, 70, 100]), r = Math.cbrt(c), k = Math.floor(r);
    return { q: R`Η εξίσωση $x^3 - ${c} = 0$ έχει ρίζα σε ένα διάστημα της μορφής $(\kappa, \kappa + 1)$, με $\kappa$ ακέραιο. Να βρείτε το $\kappa$ και τα $f(\kappa)$, $f(\kappa + 1)$, όπου $f(x) = x^3 - ${c}$.`,
      fields: [{ label: "κ =", ans: k }, { label: "f(κ) =", ans: k ** 3 - c }, { label: "f(κ + 1) =", ans: (k + 1) ** 3 - c }],
      sol: R`Η $f$ είναι συνεχής (πολυωνυμική). $f(${k}) = ${k ** 3 - c} < 0$ και $f(${k + 1}) = ${(k + 1) ** 3 - c} > 0$, άρα από το θεώρημα Bolzano υπάρχει ρίζα στο $(${k}, ${k + 1})$ (είναι η $\sqrt[3]{${c}} \approx ${bkD(r)}$).` };
  } },
  gmono: { title: "Γεννήτρια — μονοτονία ακολουθίας", make() {
    const p = ri(1, 5), q = ri(-5, 6), r = ri(1, 4), s = ri(1, 6); const D = p * s - q * r; if (D === 0) return GENS.gmono.make();
    return bkMC({ q: R`Η ακολουθία $\alpha_\nu = \dfrac{${bkLin(p, q, "\\nu")}}{${bkLin(r, s, "\\nu")}}$, $\nu \in \mathbb{N}$, είναι:`,
      sol: R`$\alpha_{\nu+1} - \alpha_\nu = \frac{${D}}{(${bkLin(r, s, "\\nu")})(${bkLin(r, s + r, "\\nu")})}$ (με πράξεις). Ο παρονομαστής είναι θετικός, άρα η διαφορά είναι ${D > 0 ? "θετική: γνησίως αύξουσα" : "αρνητική: γνησίως φθίνουσα"}.` },
      ["γνησίως αύξουσα", "γνησίως φθίνουσα", "σταθερή", "όχι μονότονη"], D > 0 ? 0 : 1);
  } },
  gbase: { title: "Γεννήτρια — αλλαγή βάσης λογαρίθμων", make() {
    const a = bkPick([2, 3, 5]), m = ri(2, 3), n = ri(1, 6), t = ri(0, 1);
    if (t === 0) return { q: R`Να υπολογίσετε τον $\log_{${a ** m}} ${a ** n}$.`, fields: [{ label: "=", ans: kF(n, m) }],
      sol: R`$\log_{${a ** m}} ${a ** n} = \frac{\log_{${a}} ${a ** n}}{\log_{${a}} ${a ** m}} = \frac{${n}}{${m}}${gcdI(n, m) > 1 ? ` = ${texFrac(n, m)}` : ""}$.` };
    const b = bkPick([2, 3, 5, 7].filter(x => x !== a)), p = ri(1, 3);
    return { q: R`Να υπολογίσετε την τιμή της παράστασης $(\log_{${a}} ${b})\cdot(\log_{${b}} ${a ** p})$.`, fields: [{ label: "=", ans: p }],
      sol: R`$\log_{${a}} ${b}\cdot\log_{${b}} ${a ** p} = \frac{\log ${b}}{\log ${a}}\cdot\frac{\log ${a ** p}}{\log ${b}} ${p === 1 ? "" : R` = \frac{${p}\log ${a}}{\log ${a}}`} = ${p}$.` };
  } },
  gtrigder: { title: "Γεννήτρια — παράγωγοι τριγωνομετρικών συναρτήσεων", make() {
    const a = ri(1, 4) * (ri(0, 1) ? 1 : -1), b = ri(1, 4) * (ri(0, 1) ? 1 : -1), t = ri(0, 2);
    if (t === 0) return { type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}\text{ημ}x ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}\text{συν}x$.`, ref: `${a}*cos(x)-(${b})*sin(x)`, key: `${a}*cos(x)-(${b})*sin(x)`,
      sol: R`$(\text{ημ}x)' = \text{συν}x$, $(\text{συν}x)' = -\text{ημ}x$: $\ f'(x) = ${a === 1 ? "" : a === -1 ? "-" : a + "\\,"}\text{συν}x ${-b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b) + "\\,"}\text{ημ}x$.` };
    if (t === 1) return { type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = x^{${Math.abs(a) + 1}}\,\text{ημ}x$.`, ref: `${Math.abs(a) + 1}*x^${Math.abs(a)}*sin(x)+x^${Math.abs(a) + 1}*cos(x)`, key: `${Math.abs(a) + 1}*x^${Math.abs(a)}*sin(x)+x^${Math.abs(a) + 1}*cos(x)`,
      sol: R`Κανόνας γινομένου: $f'(x) = ${Math.abs(a) + 1}x^{${Math.abs(a)}}\,\text{ημ}x + x^{${Math.abs(a) + 1}}\,\text{συν}x$.` };
    if (ri(0, 1)) return { type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = e^x\,\text{συν}x$.`, ref: "exp(x)*(cos(x)-sin(x))", key: "exp(x)*(cos(x)-sin(x))",
      sol: R`Κανόνας γινομένου: $f'(x) = e^x\,\text{συν}x - e^x\,\text{ημ}x = e^x(\text{συν}x - \text{ημ}x)$.` };
    return { type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = x\,\text{εφ}x$.`, ref: "tan(x)+x/(cos(x))^2", key: "tan(x)+x/(cos(x))^2",
      sol: R`$(\text{εφ}x)' = \frac{1}{\text{συν}^2x}$, άρα $f'(x) = \text{εφ}x + \frac{x}{\text{συν}^2x}$.` };
  } },
  gchain: { title: "Γεννήτρια — παράγωγος σύνθετης συνάρτησης", make() {
    const t = ri(0, 3), a = ri(2, 5), b = ri(1, 5) * (ri(0, 1) ? 1 : -1), n = ri(3, 5);
    if (t === 0) return { type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = (${bkLin(a, b)})^{${n}}$.`, ref: `${n * a}*(${a}x+(${b}))^${n - 1}`, key: `${n * a}*(${a}x+(${b}))^${n - 1}`,
      sol: R`$f'(x) = ${n}(${bkLin(a, b)})^{${n - 1}}\cdot(${bkLin(a, b)})' = ${n * a}(${bkLin(a, b)})^{${n - 1}}$.` };
    if (t === 1) return { type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = \text{ημ}(${bkLin(a, b)})$.`, ref: `${a}*cos(${a}x+(${b}))`, key: `${a}*cos(${a}x+(${b}))`,
      sol: R`$f'(x) = \text{συν}(${bkLin(a, b)})\cdot ${a} = ${a}\,\text{συν}(${bkLin(a, b)})$.` };
    if (t === 2) return { type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = e^{${a}x^2}$.`, ref: `${2 * a}*x*exp(${a}x^2)`, key: `${2 * a}*x*exp(${a}x^2)`,
      sol: R`$f'(x) = e^{${a}x^2}\cdot(${a}x^2)' = ${2 * a}x\,e^{${a}x^2}$.` };
    const c = ri(1, 9);
    return { type: "expr", label: "f′(x) =", q: R`Να βρείτε την παράγωγο της $f(x) = \sqrt{x^2 + ${c}}$.`, ref: `x/sqrt(x^2+${c})`, key: `x/sqrt(x^2+${c})`,
      sol: R`$f'(x) = \frac{1}{2\sqrt{x^2 + ${c}}}\cdot 2x = \frac{x}{\sqrt{x^2 + ${c}}}$.` };
  } },
  gimpl: { title: "Γεννήτρια — παράγωγος πεπλεγμένης συνάρτησης", make() {
    if (ri(0, 1)) { const T = bkPick(kTRIPLES), sx = ri(0, 1) ? 1 : -1, sy = ri(0, 1) ? 1 : -1, x0 = sx * T[0], y0 = sy * T[1];
      return { q: R`Να βρείτε την κλίση $\frac{dy}{dx}$ της καμπύλης $x^2 + y^2 = ${T[2] ** 2}$ στο σημείο της $(${x0}, ${y0})$.`, fields: [{ label: "dy/dx =", ans: kF(-x0, y0) }],
        sol: R`$2x + 2y\,y' = 0 \Rightarrow y' = -\frac{x}{y} = -\frac{${x0}}{${y0}} = ${texFrac(-x0, y0)}$.` }; }
    const x0 = ri(1, 4) * (ri(0, 1) ? 1 : -1), y0 = ri(1, 4) * (ri(0, 1) ? 1 : -1), k = x0 * x0 * y0 + y0 ** 3;
    /* x^2 y + y^3 = k → 2xy + x^2 y' + 3y^2 y' = 0 → y' = -2xy/(x^2+3y^2) */
    return { q: R`Η καμπύλη $x^2y + y^3 = ${k}$ διέρχεται από το $(${x0}, ${y0})$. Να βρείτε την $\frac{dy}{dx}$ στο σημείο αυτό.`, fields: [{ label: "dy/dx =", ans: kF(-2 * x0 * y0, x0 * x0 + 3 * y0 * y0) }],
      sol: R`Παραγωγίζοντας: $2xy + x^2y' + 3y^2y' = 0 \Rightarrow y' = -\frac{2xy}{x^2 + 3y^2} = -\frac{${2 * x0 * y0}}{${x0 * x0 + 3 * y0 * y0}} = ${texFrac(-2 * x0 * y0, x0 * x0 + 3 * y0 * y0)}$.` };
  } },
  gparam: { title: "Γεννήτρια — παράγωγος παραμετρικής καμπύλης", make() {
    const p = ri(-3, 3), q = ri(-4, 4) || 1, t0 = ri(1, 3) * (ri(0, 1) ? 1 : -1);
    /* x = t^2 + p, y = t^3 + q t → dy/dx = (3t^2 + q)/(2t) */
    return { q: R`Καμπύλη ορίζεται από $x = t^2 ${p < 0 ? "-" : "+"} ${Math.abs(p)}$, $y = t^3 ${q < 0 ? "-" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}t$. Να βρείτε την $\frac{dy}{dx}$ για $t = ${t0}$.`.replace("+ 0$", "$"),
      fields: [{ label: "dy/dx =", ans: kF(3 * t0 * t0 + q, 2 * t0) }],
      sol: R`$\frac{dx}{dt} = 2t$, $\frac{dy}{dt} = 3t^2 ${q < 0 ? "-" : "+"} ${Math.abs(q)}$, άρα $\frac{dy}{dx} = \frac{3t^2 ${q < 0 ? "-" : "+"} ${Math.abs(q)}}{2t} = \frac{${3 * t0 * t0 + q}}{${2 * t0}} = ${texFrac(3 * t0 * t0 + q, 2 * t0)}$.` };
  } },
  ginvd: { title: "Γεννήτρια — παράγωγος αντίστροφης συνάρτησης", make() {
    const a = ri(1, 3), c = ri(-5, 5), x0 = ri(-2, 2), y0 = x0 ** 3 + a * x0 + c, d = 3 * x0 * x0 + a;
    return { q: R`Η $f(x) = x^3 + ${a === 1 ? "" : a}x${c === 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c)}`}$ είναι γνησίως αύξουσα, άρα αντιστρέφεται. Αφού $f(${x0}) = ${y0}$, να βρείτε το $(f^{-1})'(${y0})$.`,
      fields: [{ label: `(f⁻¹)′(${y0}) =`, ans: kF(1, d) }],
      sol: R`$f'(x) = 3x^2 + ${a}$, $f'(${x0}) = ${d}$. Άρα $(f^{-1})'(${y0}) = \frac{1}{f'(${x0})} = ${texFrac(1, d)}$.` };
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

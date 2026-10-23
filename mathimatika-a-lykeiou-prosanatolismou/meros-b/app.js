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
  storeKey: "pagk-apros-meros-b-v1",
  heroTitle: "Μαθηματικά Προσανατολισμού Α΄ Λυκείου — Μέρος Β (Β΄ τετράμηνο)",
  tefxos: "Β΄ τετραμήνου",
  howto: `<ul><li>Κλάσματα: <code>5/2</code> · δεκαδικά: <code>2,5</code> · ρίζες: <code>√2/2</code> · αρνητικοί: <code>-3</code></li>
    <li>Εξίσωση ευθείας y = λx + β: συμπλήρωσε χωριστά τα λ και β</li>
    <li>Τύποι συναρτήσεων: <code>(x+1)^2+2</code> — ελέγχεται αν είναι ισοδύναμος με τον σωστό</li></ul>`
};

const UNITS = [
  { id: 5, title: "Ενότητα 5 · Ορίζουσες – Ευθεία" },
  { id: 7, title: "Ενότητα 7 · Συνάρτηση f(x) = αx² + βx + γ — Εξισώσεις, Ανισώσεις" },
  { id: 6, title: "Ενότητα 6 · Θεώρημα Θαλή – Ομοιότητα" }
];




const SECTIONS = [
/* ───────────────────────────── 5.2 ───────────────────────────── */
{
  id: "5.2", unit: 5, title: "Συντελεστής διεύθυνσης ευθείας",
  book: "Β΄ Τεύχος §5.2 · Δραστηριότητες σελ. 25",
  theory: R`
<div class="tbox"><h4>Κλίση και γωνία</h4>
<p>Αν $\omega$ είναι η γωνία της ευθείας με τον άξονα $x'x$ ($0^\circ \le \omega < 180^\circ$), ο <b>συντελεστής διεύθυνσης</b> (κλίση) είναι $\lambda = \text{εφ}\omega$ ($\omega \ne 90^\circ$). Για δύο σημεία $A(x_1, y_1)$, $B(x_2, y_2)$ με $x_1 \ne x_2$:</p>
$$\lambda = \frac{y_2 - y_1}{x_2 - x_1} \qquad y - y_1 = \lambda(x - x_1)$$
<p>Οριζόντια ευθεία: $y = \beta$ ($\lambda = 0$). Κατακόρυφη: $x = \alpha$ (δεν ορίζεται $\lambda$).</p></div>

<div class="tbox"><h4>Παράλληλες και κάθετες</h4>
<p>$\varepsilon_1 \parallel \varepsilon_2 \iff \lambda_1 = \lambda_2$ · $\quad\varepsilon_1 \perp \varepsilon_2 \iff \lambda_1\lambda_2 = -1$ (όταν δεν είναι κατακόρυφες).</p></div>

<div class="tbox tip"><h4>Γωνία δύο ευθειών</h4>
$$\text{εφ}\theta = \frac{\lambda_2 - \lambda_1}{1 + \lambda_1\lambda_2} \qquad\text{(η οξεία: }\ \text{εφ}\theta = \left|\frac{\lambda_2 - \lambda_1}{1 + \lambda_1\lambda_2}\right|),\quad 1 + \lambda_1\lambda_2 \ne 0$$
<p><b>Μεσοκάθετος</b> τμήματος $AB$: περνά από το μέσο του και έχει κλίση $-\frac{1}{\lambda_{AB}}$.</p></div>`,
  widget: "linetool",
  gen: "gline",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε την εξίσωση της ευθείας που διέρχεται από τα $A(-1, 3)$ και $B(1, 0)$, στη μορφή $y = \lambda x + \beta$.`,
      fields: [{ label: "λ =", ans: "-3/2" }, { label: "β =", ans: "3/2" }],
      hint: R`$\lambda = \frac{0 - 3}{1 - (-1)}$.`,
      sol: R`$\lambda = -\frac32$. $y - 0 = -\frac32(x - 1) \Rightarrow y = -\frac32x + \frac32$.` },
    { level: 1, type: "mc", q: R`Η ευθεία που διέρχεται από τα $\Gamma(-2, 3)$ και $\Delta(-2, 6)$ έχει εξίσωση:`,
      options: ["$y = -2$", "$x = -2$", "$y = 3x$", "$y = x + 5$"], correct: 1,
      hint: R`Ίδια τετμημένη.`,
      sol: R`Και τα δύο σημεία έχουν $x = -2$: κατακόρυφη ευθεία $x = -2$ (δεν ορίζεται κλίση).` },
    { level: 1, type: "fields", q: R`Να βρείτε την ευθεία από το $A(-2, 5)$ (στη μορφή $y = \lambda x + \beta$) που: (α) έχει $\lambda = -3$, (β) σχηματίζει γωνία $135^\circ$ με τον $x'x$, (γ) είναι παράλληλη στην $y = 5x - 2$.`,
      fields: [{ label: "(α) β =", ans: -1 }, { label: "(β) β =", ans: 3 }, { label: "(γ) β =", ans: 15 }],
      hint: R`$y - 5 = \lambda(x + 2)$. Γωνία $135^\circ$ ⇒ $\lambda = \text{εφ}135^\circ = -1$.`,
      sol: R`(α) $y = -3x - 1$. (β) $y = -x + 3$. (γ) $\lambda = 5$: $y = 5x + 15$.` },
    { level: 2, type: "fields", q: R`Να βρείτε την ευθεία από το $A(-2, 2)$ που σχηματίζει γωνία $\frac\pi6$ με τον $x'x$ (μορφή $y = \lambda x + \beta$).`,
      fields: [{ label: "λ =", ans: "√3/3" }, { label: "β =", ans: "2+2√3/3" }],
      hint: R`$\lambda = \text{εφ}30^\circ = \frac{\sqrt3}{3}$.`,
      sol: R`$y - 2 = \frac{\sqrt3}{3}(x + 2) \Rightarrow y = \frac{\sqrt3}{3}x + 2 + \frac{2\sqrt3}{3}$.` },
    { level: 2, type: "fields", q: R`Να βρείτε την ευθεία από το $A(-1, 3)$ που είναι <b>κάθετη</b> στην $2x + 3y = 1$.`,
      fields: [{ label: "λ =", ans: "3/2" }, { label: "β =", ans: "9/2" }],
      hint: R`Η $2x + 3y = 1$ έχει $\lambda = -\frac23$· η κάθετη έχει $\lambda = \frac32$.`,
      sol: R`$y - 3 = \frac32(x + 1) \Rightarrow y = \frac32x + \frac92$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τη μεσοκάθετο του τμήματος $AB$ με $A(0, 9)$ και $B(2, -3)$.`,
      fields: [{ label: "λ =", ans: "1/6" }, { label: "β =", ans: "17/6" }],
      hint: R`Μέσο $M(1, 3)$, $\lambda_{AB} = -6$.`,
      sol: R`Κάθετη κλίση $\frac16$: $y - 3 = \frac16(x - 1) \Rightarrow y = \frac16x + \frac{17}{6}$.` },
    { level: 2, type: "fields", q: R`Για ποια τιμή του $\alpha$ η ευθεία $\alpha x - 3y = 10$ είναι κάθετη στην $y = 2x - 1$;`,
      fields: [{ label: "α =", ans: "-3/2" }],
      hint: R`Κλίση της πρώτης: $\frac\alpha3$.`,
      sol: R`$\frac\alpha3\cdot 2 = -1 \Rightarrow \alpha = -\frac32$.` },
    { level: 3, type: "fields", q: R`Για ποιες τιμές του $\kappa$ οι ευθείες $(\kappa + 1)x - \kappa y - 4 = 0$ και $2\kappa x + (\kappa + 4)y + 1 = 0$ είναι κάθετες;`,
      fields: [{ label: "μικρότερη κ =", ans: 0 }, { label: "μεγαλύτερη κ =", ans: 2 }],
      hint: R`Για $A_1x + B_1y + \Gamma_1 = 0$, $A_2x + B_2y + \Gamma_2 = 0$: κάθετες $\iff A_1A_2 + B_1B_2 = 0$.`,
      sol: R`$2\kappa(\kappa + 1) - \kappa(\kappa + 4) = \kappa^2 - 2\kappa = 0 \Rightarrow \kappa = 0$ ή $\kappa = 2$. (Για $\kappa = 0$: $x = 4$ και $y = -\frac14$, κάθετες ✓.)` },
    { level: 2, type: "fields", q: R`Να βρείτε την οξεία γωνία που σχηματίζουν οι ευθείες $y = 3x + 1$ και $y = -2x + 1$.`,
      fields: [{ label: "θ (μοίρες) =", ans: 45 }],
      hint: R`$\text{εφ}\theta = \left|\frac{-2 - 3}{1 + 3\cdot(-2)}\right|$.`,
      sol: R`$\text{εφ}\theta = \left|\frac{-5}{-5}\right| = 1 \Rightarrow \theta = 45^\circ$.` }
  ]
},
/* ───────────────────────────── 5.3 ───────────────────────────── */
{
  id: "5.3", unit: 5, title: "Γενική μορφή εξίσωσης ευθείας Αx + Βy + Γ = 0",
  book: "Β΄ Τεύχος §5.3 · Δραστηριότητες σελ. 31",
  theory: R`
<div class="tbox"><h4>Γενική μορφή</h4>
<p>Κάθε εξίσωση $Ax + By + \Gamma = 0$ με $A \ne 0$ ή $B \ne 0$ παριστάνει ευθεία, και αντίστροφα κάθε ευθεία γράφεται έτσι.</p>
<ul><li>$B \ne 0$: κλίση $\lambda = -\dfrac{A}{B}$ (π.χ. $x - 3y + 2 = 0 \Rightarrow \lambda = \frac13$).</li>
<li>$B = 0$: κατακόρυφη $x = -\frac\Gamma A$ · $\;A = 0$: οριζόντια $y = -\frac\Gamma B$.</li>
<li>Διέρχεται από την αρχή $\iff \Gamma = 0$.</li></ul></div>

<div class="tbox"><h4>Σημείο τομής – συντρέχουσες</h4>
<p>Το σημείο τομής δύο ευθειών βρίσκεται λύνοντας το σύστημά τους. Τρεις ευθείες $A_ix + B_iy + \Gamma_i = 0$ που διέρχονται από το ίδιο σημείο έχουν</p>
$$\begin{vmatrix} A_1 & B_1 & \Gamma_1 \\ A_2 & B_2 & \Gamma_2 \\ A_3 & B_3 & \Gamma_3 \end{vmatrix} = 0$$</div>`,
  widget: "linetool",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε την κλίση των ευθειών: (α) $x - 3y + 2 = 0$, (β) $y = 8 - x$, (γ) $y = 4$, (δ) $5x - 3y + 7 = 0$.`,
      fields: [{ label: "(α) λ =", ans: "1/3" }, { label: "(β) λ =", ans: -1 }, { label: "(γ) λ =", ans: 0 }, { label: "(δ) λ =", ans: "5/3" }],
      hint: R`$\lambda = -\frac AB$.`,
      sol: R`(α) $-\frac{1}{-3} = \frac13$. (β) $-1$. (γ) $0$ (οριζόντια). (δ) $-\frac{5}{-3} = \frac53$.` },
    { level: 1, type: "fields", q: R`Η ευθεία $y = -x + 2$ τέμνει τους άξονες στα σημεία $A$ (στον $x'x$) και $B$ (στον $y'y$). Να τα βρείτε.`,
      fields: [{ label: "A: x =", ans: 2 }, { label: "B: y =", ans: 2 }],
      hint: R`Στον $x'x$: $y = 0$. Στον $y'y$: $x = 0$.`,
      sol: R`$A(2, 0)$, $B(0, 2)$.` },
    { level: 1, type: "fields", q: R`Η ευθεία $2x - \alpha y + 8 = 0$, $\alpha \ne 0$, έχει κλίση $5$. Να βρείτε το $\alpha$.`,
      fields: [{ label: "α =", ans: "2/5" }],
      hint: R`$\lambda = -\frac{2}{-\alpha} = \frac2\alpha$.`,
      sol: R`$\frac2\alpha = 5 \Rightarrow \alpha = \frac25$.` },
    { level: 2, type: "fields", q: R`Να δείξετε ότι οι ευθείες $5x - 7y = -1$, $x + 2y - 10 = 0$ και $x + y = 7$ διέρχονται από το ίδιο σημείο. Ποιο είναι;`,
      fields: [{ label: "x =", ans: 4 }, { label: "y =", ans: 3 }],
      hint: R`Λύσε τις δύο τελευταίες και έλεγξε την πρώτη.`,
      sol: R`Αφαιρώντας: $(x + 2y) - (x + y) = 10 - 7 \Rightarrow y = 3$, $x = 4$. Στην πρώτη: $20 - 21 = -1$ ✓. Κοινό σημείο $(4, 3)$.` },
    { level: 2, type: "fields", q: R`Να βρείτε την ευθεία που διέρχεται από το σημείο τομής των $y = 2x - 7$ και $y = 4x - 13$ και είναι παράλληλη στην $y = -3x + 1$.`,
      fields: [{ label: "λ =", ans: -3 }, { label: "β =", ans: 8 }],
      hint: R`Τομή: $2x - 7 = 4x - 13$.`,
      sol: R`$x = 3$, $y = -1$. Με $\lambda = -3$: $y + 1 = -3(x - 3) \Rightarrow y = -3x + 8$.` },
    { level: 3, type: "fields", q: R`Να βρείτε την ευθεία που διέρχεται από την τομή των $x + 2y - 5 = 0$ και $x - y + 5 = 0$ και είναι κάθετη στην $2x + 4y + 7 = 0$.`,
      fields: [{ label: "λ =", ans: 2 }, { label: "β =", ans: "20/3" }],
      hint: R`Τομή: $3y = 10$. Η $2x + 4y + 7 = 0$ έχει $\lambda = -\frac12$.`,
      sol: R`$y = \frac{10}{3}$, $x = -\frac53$. Κάθετη κλίση $2$: $y - \frac{10}{3} = 2\left(x + \frac53\right) \Rightarrow y = 2x + \frac{20}{3}$.` },
    { level: 3, type: "fields", q: R`Δίνεται η $(\mu^2 - 1)x + (\mu + 1)y + 2\mu = 0$. (α) Για ποια τιμή του $\mu$ <b>δεν</b> παριστάνει ευθεία; (β) Για ποια είναι παράλληλη στον $x'x$; (γ) Για ποια διέρχεται από την αρχή των αξόνων;`,
      fields: [{ label: "(α) μ =", ans: -1 }, { label: "(β) μ =", ans: 1 }, { label: "(γ) μ =", ans: 0 }],
      hint: R`Ευθεία όταν $A \ne 0$ ή $B \ne 0$. Παράλληλη στον $x'x$: $A = 0$, $B \ne 0$.`,
      sol: R`(α) $\mu^2 - 1 = 0$ και $\mu + 1 = 0$ ⇒ $\mu = -1$. (β) $\mu^2 = 1$, $\mu \ne -1$ ⇒ $\mu = 1$ ($2y + 2 = 0$). (γ) $2\mu = 0 \Rightarrow \mu = 0$. (Παράλληλη στον $y'y$ θα ήθελε $\mu = -1$, που δεν δίνει ευθεία.)` },
    { level: 2, type: "fields", q: R`Δίνονται $A(-1, 1)$, $B(4, -1)$, $\Gamma(6, 4)$. Η γωνία $\widehat{AB\Gamma}$ είναι ορθή. Να βρείτε το κέντρο του περιγεγραμμένου κύκλου του $AB\Gamma$ και την κορυφή $\Delta$ του παραλληλογράμμου $AB\Gamma\Delta$.`,
      fields: [{ label: "κέντρο x =", ans: 2.5 }, { label: "κέντρο y =", ans: 2.5 }, { label: "Δ: x =", ans: 1 }, { label: "Δ: y =", ans: 6 }],
      hint: R`Σε ορθογώνιο τρίγωνο το κέντρο είναι το μέσο της υποτείνουσας $A\Gamma$. $\vec{A\Delta} = \vec{B\Gamma}$.`,
      sol: R`$\lambda_{AB}\lambda_{B\Gamma} = -\frac25\cdot\frac52 = -1$ ✓. Κέντρο: μέσο του $A\Gamma$ $= (2{,}5,\ 2{,}5)$. $\Delta = A + \Gamma - B = (1, 6)$.` }
  ]
},
/* ───────────────────────────── 5.4 ───────────────────────────── */
{
  id: "5.4", unit: 5, title: "Απόσταση σημείου από ευθεία – εμβαδόν τριγώνου",
  book: "Β΄ Τεύχος §5.4 · Δραστηριότητες σελ. 41, 44",
  theory: R`
<div class="tbox"><h4>Απόσταση σημείου από ευθεία</h4>
$$d(P, \varepsilon) = \frac{|Ax_0 + By_0 + \Gamma|}{\sqrt{A^2 + B^2}} \qquad P(x_0, y_0),\ \ \varepsilon: Ax + By + \Gamma = 0$$
<p>Ειδικά: από την $x = \alpha$ είναι $|x_0 - \alpha|$, από την $y = \beta$ είναι $|y_0 - \beta|$. Η απόσταση δύο <b>παράλληλων</b> ευθειών είναι η απόσταση ενός σημείου της μίας από την άλλη.</p></div>

<div class="tbox"><h4>Εμβαδόν τριγώνου</h4>
$$E_{AB\Gamma} = \frac12\left|\begin{vmatrix} x_1 & y_1 & 1 \\ x_2 & y_2 & 1 \\ x_3 & y_3 & 1 \end{vmatrix}\right|$$
<p>Τα $A, B, \Gamma$ είναι <b>συνευθειακά</b> αν και μόνο αν η ορίζουσα είναι $0$. Επίσης $E = \frac12\cdot(\text{βάση})\cdot(\text{ύψος})$, όπου το ύψος είναι απόσταση σημείου από ευθεία.</p></div>`,
  widget: "linetool",
  gen: "gline",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε την απόσταση του $A(-3, 2)$ από τις ευθείες: (α) $4x + 3y - 21 = 0$, (β) $x = 6$, (γ) $y = -2$.`,
      fields: [{ label: "(α) d =", ans: "27/5" }, { label: "(β) d =", ans: 9 }, { label: "(γ) d =", ans: 4 }],
      hint: R`(α) $\frac{|4(-3) + 3\cdot 2 - 21|}{5}$.`,
      sol: R`(α) $\frac{|-12 + 6 - 21|}{5} = \frac{27}{5}$. (β) $|-3 - 6| = 9$. (γ) $|2 - (-2)| = 4$.` },
    { level: 1, type: "fields", q: R`Δίνονται $A(0, 3)$, $B(2, 6)$, $\Gamma(4, 0)$. Να βρείτε το εμβαδόν του τριγώνου $AB\Gamma$ και του παραλληλογράμμου $AB\Gamma\Delta$.`,
      fields: [{ label: "E τριγώνου =", ans: 9 }, { label: "E παραλληλογράμμου =", ans: 18 }],
      hint: R`Η διαγώνιος $A\Gamma$ χωρίζει το παραλληλόγραμμο σε δύο ίσα τρίγωνα.`,
      sol: R`$\begin{vmatrix} 0 & 3 & 1 \\ 2 & 6 & 1 \\ 4 & 0 & 1 \end{vmatrix} = 0 - 3(2 - 4) + (0 - 24) = -18$, $E = 9$. Παραλληλόγραμμο $18$.` },
    { level: 2, type: "fields", q: R`Δίνονται $A(1, 5)$, $B(3, 2)$, $\Gamma(6, -1)$. Να βρείτε το εμβαδόν του $AB\Gamma$ και το ύψος $A\Delta$ προς τη $B\Gamma$.`,
      fields: [{ label: "E =", ans: "3/2" }, { label: "ΑΔ =", ans: "√2/2" }],
      hint: R`$B\Gamma = \sqrt{9 + 9} = 3\sqrt2$ και $A\Delta = \frac{2E}{B\Gamma}$.`,
      sol: R`Ορίζουσα $1(2 + 1) - 5(3 - 6) + (-3 - 12) = 3$, $E = \frac32$ (δεν είναι συνευθειακά). $A\Delta = \frac{3}{3\sqrt2} = \frac{\sqrt2}{2}$.` },
    { level: 2, type: "fields", q: R`Να βρείτε την απόσταση των παράλληλων ευθειών $-6x + 8y = 29$ και $3x - 4y - 8 = 0$.`,
      fields: [{ label: "d =", ans: 4.5 }],
      hint: R`Γράψε τη δεύτερη ως $-6x + 8y + 16 = 0$.`,
      sol: R`$-6x + 8y - 29 = 0$ και $-6x + 8y + 16 = 0$: $d = \frac{|16 - (-29)|}{\sqrt{36 + 64}} = \frac{45}{10} = 4{,}5$.` },
    { level: 2, type: "fields", q: R`Δύο πλευρές τετραγώνου ανήκουν στις ευθείες $5x - 12y - 13 = 0$ και $5x - 12y - 78 = 0$. Να βρείτε το εμβαδόν του.`,
      fields: [{ label: "E =", ans: 25 }],
      hint: R`Η πλευρά είναι η απόσταση των δύο παράλληλων.`,
      sol: R`$d = \frac{|-13 + 78|}{13} = 5$, άρα $E = 25$.` },
    { level: 3, type: "fields", q: R`Να βρείτε το εμβαδόν του τετραπλεύρου με κορυφές $A(0, 2)$, $B(2, 4)$, $\Gamma(8, 1)$, $\Delta(4, -1)$.`,
      fields: [{ label: "E =", ans: 19 }],
      hint: R`Χώρισε με τη διαγώνιο $A\Gamma$ σε δύο τρίγωνα.`,
      sol: R`$E_{AB\Gamma} = \frac12|0(4 - 1) - 2(2 - 8) + 1(2 - 32)| = \frac12|-18| = 9$, $E_{A\Gamma\Delta} = \frac12|0 - 2(8 - 4) + (-8 - 4)| = \frac12|-20| = 10$. Σύνολο $19$.` },
    { level: 1, type: "mc", q: R`Τα σημεία $A(1, 1)$, $B(2, 3)$, $\Gamma(3, 5)$:`,
      options: ["σχηματίζουν τρίγωνο με εμβαδόν 1", "είναι συνευθειακά", "σχηματίζουν ορθογώνιο τρίγωνο", "σχηματίζουν ισόπλευρο τρίγωνο"], correct: 1,
      hint: R`Υπολόγισε την ορίζουσα ή τις κλίσεις $AB$, $B\Gamma$.`,
      sol: R`$\lambda_{AB} = 2 = \lambda_{B\Gamma}$, άρα συνευθειακά (η ορίζουσα είναι $0$).` }
  ]
},
/* ───────────────────────────── 7.1 ───────────────────────────── */
{
  id: "7.1", unit: 7, title: "Η παραβολή y = α(x + κ)² + λ",
  book: "Β΄ Τεύχος §7.1 · Δραστηριότητες σελ. 107, 116",
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
/* ───────────────────────────── 7.2.1 ───────────────────────────── */
{
  id: "7.2.1", unit: 7, title: "Μελέτη της f(x) = αx² + βx + γ",
  book: "Β΄ Τεύχος §7.2 · Δραστηριότητες σελ. 123",
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
/* ───────────────────────────── 7.2.2 ───────────────────────────── */
{
  id: "7.2.2", unit: 7, title: "Η εξίσωση αx² + βx + γ = 0",
  book: "Β΄ Τεύχος §7.2 · Δραστηριότητες σελ. 123, 131",
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
/* ───────────────────────────── 7.2.3 ───────────────────────────── */
{
  id: "7.2.3", unit: 7, title: "Άθροισμα – γινόμενο λύσεων (Vieta)",
  book: "Β΄ Τεύχος §7.2 · Δραστηριότητες σελ. 131",
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
/* ───────────────────────────── 7.2.4 ───────────────────────────── */
{
  id: "7.2.4", unit: 7, title: "Εξισώσεις και συστήματα που ανάγονται σε 2ου βαθμού",
  book: "Β΄ Τεύχος §7.2.6 · Δραστηριότητες σελ. 131–132",
  theory: R`
<div class="tbox"><h4>Μέθοδος αντικατάστασης</h4>
<ol><li>Λύνουμε την <b>πρωτοβάθμια</b> εξίσωση ως προς έναν άγνωστο.</li>
<li>Αντικαθιστούμε στη δευτεροβάθμια ⇒ εξίσωση 2ου βαθμού με έναν άγνωστο.</li>
<li>Για κάθε λύση βρίσκουμε τον άλλον άγνωστο. Γράφουμε τις λύσεις ως <b>ζεύγη</b> $(x, y)$.</li></ol>
<p>π.χ. $\begin{cases} x + 2y = 3 \\ x + y^2 = 2\end{cases}$: $x = 3 - 2y \Rightarrow 3 - 2y + y^2 = 2 \Rightarrow (y - 1)^2 = 0 \Rightarrow (x, y) = (1, 1)$.</p></div>

<div class="tbox tip"><h4>Γεωμετρική ερμηνεία</h4>
<p>Οι κοινές λύσεις ευθείας και παραβολής είναι τα <b>κοινά τους σημεία</b>. Μετά την αντικατάσταση, η διακρίνουσα λέει πόσα είναι: $\Delta > 0$ δύο, $\Delta = 0$ ένα (εφάπτονται), $\Delta < 0$ κανένα.</p></div>
<div class="tbox"><h4>Διτετράγωνες εξισώσεις</h4>
<p>Η εξίσωση $\alpha x^4 + \beta x^2 + \gamma = 0$ ($\alpha \ne 0$) λύνεται με την αντικατάσταση $y = x^2 \ge 0$: λύνουμε την $\alpha y^2 + \beta y + \gamma = 0$ και <b>κρατάμε μόνο τις μη αρνητικές</b> ρίζες $y$, από τις οποίες $x = \pm\sqrt y$. Με τον ίδιο τρόπο λύνονται εξισώσεις όπως $(x^2 - x)^2 - 8(x^2 - x) + 12 = 0$ (θέτουμε $y = x^2 - x$).</p></div>`,
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
      sol: R`$y^2 + 4y - 21 = 0 \Rightarrow y = 3$ ή $y = -7$. Θετικοί: $y = 3$, $x = 7$. (Η άλλη λύση είναι $-3$ και $-7$.)` },
{ level: 1, type: "fields", q: R`Να λύσετε την εξίσωση $x^4 - 5x^2 + 4 = 0$ (τέσσερις λύσεις σε αύξουσα σειρά).`,
      fields: [{ label: "x₁ =", ans: -2 }, { label: "x₂ =", ans: -1 }, { label: "x₃ =", ans: 1 }, { label: "x₄ =", ans: 2 }],
      hint: R`$y = x^2$: $y^2 - 5y + 4 = 0$.`, sol: R`$y = 1$ ή $y = 4$, άρα $x = \pm 1$ ή $x = \pm 2$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $3x^4 - 2x^2 - 5 = 0$ (γράψτε π.χ. <code>√15/3</code>).`,
      fields: [{ label: "x₁ (αρνητική) =", ans: "-√15/3", tol: 0.0005 }, { label: "x₂ =", ans: "√15/3", tol: 0.0005 }],
      hint: R`$3y^2 - 2y - 5 = 0$ με $y = x^2 \ge 0$.`,
      sol: R`$y = \frac{2 \pm 8}{6}$: $y = \frac53$ ή $y = -1$ (απορρίπτεται). $x^2 = \frac53 \Rightarrow x = \pm\sqrt{\frac53} = \pm\frac{\sqrt{15}}{3}$.` },
    { level: 1, type: "mc", q: R`Η εξίσωση $x^4 + 3x^2 + 2 = 0$:`,
      options: ["είναι αδύνατη στο $\\mathbb{R}$", "έχει λύσεις $x = -1, -2$", "έχει τέσσερις λύσεις", "έχει λύσεις $x = \\pm 1$"], correct: 0,
      hint: R`Οι ρίζες της $y^2 + 3y + 2 = 0$ είναι αρνητικές.`, sol: R`$y = -1$ ή $y = -2$, και τα δύο αρνητικά, ενώ $y = x^2 \ge 0$: αδύνατη.` },
    { level: 3, type: "fields", q: R`Να λύσετε την εξίσωση $(x^2 - x)^2 - 8(x^2 - x) + 12 = 0$ (τέσσερις λύσεις σε αύξουσα σειρά).`,
      fields: [{ label: "x₁ =", ans: -2 }, { label: "x₂ =", ans: -1 }, { label: "x₃ =", ans: 2 }, { label: "x₄ =", ans: 3 }],
      hint: R`$y = x^2 - x$: $y^2 - 8y + 12 = 0$.`,
      sol: R`$y = 2$: $x^2 - x - 2 = 0 \Rightarrow x = 2, -1$. $\ y = 6$: $x^2 - x - 6 = 0 \Rightarrow x = 3, -2$.` }
  ]
},
/* ───────────────────────────── 7.3 ───────────────────────────── */
{
  id: "7.3", unit: 7, title: "Πρόσημο τριωνύμου – Ανισώσεις 2ου βαθμού",
  book: "Β΄ Τεύχος §7.3 · Δραστηριότητες σελ. 143",
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
/* ───────────────────────────── 7.4 ───────────────────────────── */
{
  id: "7.4", unit: 7, title: "Ανισώσεις ανώτερου βαθμού – κλασματικές ανισώσεις",
  book: "Β΄ Τεύχος §7.4 · Δραστηριότητες σελ. 151, 156",
  theory: R`
<div class="tbox"><h4>Ανισώσεις γινομένου</h4>
<p>Για $P(x) = A(x)\cdot B(x)\cdots \gtrless 0$: παραγοντοποιούμε σε πρωτοβάθμιους και δευτεροβάθμιους παράγοντες, βρίσκουμε τις ρίζες και κάνουμε <b>πίνακα προσήμων</b> με μία γραμμή για κάθε παράγοντα. Το πρόσημο του γινομένου είναι το «γινόμενο» των προσήμων.</p>
<p>Παράγοντες χωρίς ρίζες (π.χ. $x^2 + 5$) έχουν σταθερό πρόσημο και απλώς «κουβαλούν» το πρόσημό τους.</p></div>

<div class="tbox"><h4>Κλασματικές ανισώσεις</h4>
<p>Για $\frac{A(x)}{B(x)} \gtrless 0$: <b>περιορισμός</b> $B(x) \ne 0$. Το πηλίκο έχει το ίδιο πρόσημο με το γινόμενο $A(x)B(x)$. Αν η ανίσωση δεν έχει $0$ στο δεύτερο μέλος, πρώτα μεταφέρουμε όλους τους όρους στο πρώτο και κάνουμε ομώνυμα — <b>ποτέ</b> δεν πολλαπλασιάζουμε «χιαστί» με παρονομαστή αγνώστου πρόσημου.</p>
<p>Στις $\le$, $\ge$ συμπεριλαμβάνουμε τις ρίζες του αριθμητή, ποτέ του παρονομαστή.</p></div>

<div class="tbox tip"><h4>Πρόσημα ριζών (Vieta)</h4>
<p>Η $\alpha x^2 + \beta x + \gamma = 0$ έχει: δύο <b>θετικές</b> ρίζες $\iff \Delta \ge 0,\ P > 0,\ S > 0$ · δύο <b>αρνητικές</b> $\iff \Delta \ge 0,\ P > 0,\ S < 0$ · <b>ετερόσημες</b> $\iff P < 0$ (τότε αυτόματα $\Delta > 0$).</p></div>`,
  widget: "signtab",
  gen: "gineq",
  exercises: [
    { level: 1, type: "mc", q: R`Η ανίσωση $(x - 2)(x^2 + 2x - 8) < 0$ έχει λύσεις:`,
      options: ["$x < -4$", "$-4 < x < 2$", "$x < -4$ ή $x > 2$", "$x > 2$"], correct: 0,
      hint: R`$x^2 + 2x - 8 = (x + 4)(x - 2)$, άρα το γινόμενο είναι $(x - 2)^2(x + 4)$.`,
      sol: R`$(x - 2)^2(x + 4) < 0$: το $(x - 2)^2 \ge 0$ (και $= 0$ στο 2), άρα χρειάζεται $x + 4 < 0$: $x < -4$.` },
    { level: 2, type: "mc", q: R`Η ανίσωση $(x^2 + 2x)(x^2 - 25) > 0$ έχει λύσεις:`,
      options: ["$-5 < x < -2$ ή $0 < x < 5$", "$x < -5$ ή $-2 < x < 0$ ή $x > 5$", "$x > 5$", "$-5 < x < 5$"], correct: 1,
      hint: R`Ρίζες $-5, -2, 0, 5$· δεξιά από όλες το πρόσημο είναι $+$ και εναλλάσσεται.`,
      sol: R`$x(x + 2)(x - 5)(x + 5)$: πρόσημα $+, -, +, -, +$ στα διαστήματα. Θετικό: $x < -5$ ή $-2 < x < 0$ ή $x > 5$.` },
    { level: 2, type: "mc", q: R`Η ανίσωση $(x^2 + 5)(4x^2 - 25) > 0$ έχει λύσεις:`,
      options: ["$-\\frac52 < x < \\frac52$", "$x < -\\frac52$ ή $x > \\frac52$", "κάθε $x$", "αδύνατη"], correct: 1,
      hint: R`Το $x^2 + 5$ είναι πάντα θετικό.`,
      sol: R`Αρκεί $4x^2 - 25 > 0 \iff x < -\frac52$ ή $x > \frac52$.` },
    { level: 2, type: "mc", q: R`Η ανίσωση $\dfrac{x^2}{x - 3} \le 0$ έχει λύσεις:`,
      options: ["$x < 3$", "$x \\le 3$", "$x = 0$", "$0 \\le x < 3$"], correct: 0,
      hint: R`Ο αριθμητής είναι $\ge 0$· ο παρονομαστής δεν μηδενίζεται.`,
      sol: R`Για $x < 3$ ο παρονομαστής είναι αρνητικός, άρα το κλάσμα $\le 0$ (και $= 0$ στο $x = 0$). Για $x > 3$ θετικό. Το $x = 3$ εξαιρείται. Λύσεις: $x < 3$.` },
    { level: 3, type: "mc", q: R`Η ανίσωση $\dfrac{x^2 - x - 12}{7 - x} \le 0$ έχει λύσεις:`,
      options: ["$-3 \\le x \\le 4$", "$-3 \\le x \\le 4$ ή $x > 7$", "$x \\le -3$ ή $4 \\le x < 7$", "$x > 7$"], correct: 1,
      hint: R`Ρίζες αριθμητή $-3, 4$, παρονομαστή $7$. Πίνακας προσήμων με τρεις γραμμές.`,
      sol: R`Πρόσημα: $x < -3$: $+$· $(-3, 4)$: $-$· $(4, 7)$: $+$· $x > 7$: $-$. Με $\le 0$ και ρίζες αριθμητή: $-3 \le x \le 4$ ή $x > 7$ (το 7 εξαιρείται).` },
    { level: 2, type: "mc", q: R`Η ανίσωση $6x - 6 \ge x^3 - x^2$ έχει λύσεις:`,
      options: ["$x \\le -\\sqrt6$ ή $1 \\le x \\le \\sqrt6$", "$-\\sqrt6 \\le x \\le 1$", "$x \\ge \\sqrt6$", "$1 \\le x \\le \\sqrt6$"], correct: 0,
      hint: R`$x^3 - x^2 - 6x + 6 \le 0 \iff x^2(x - 1) - 6(x - 1) \le 0$.`,
      sol: R`$(x - 1)(x^2 - 6) \le 0$, ρίζες $-\sqrt6, 1, \sqrt6$, πρόσημα $-, +, -, +$. Λύσεις: $x \le -\sqrt6$ ή $1 \le x \le \sqrt6$.` },
    { level: 2, type: "fields", q: R`Για ποιες τιμές του $\lambda$ η εξίσωση $x^2 - (\lambda - 3)x + \lambda - 5 = 0$ έχει δύο <b>θετικές</b> λύσεις; Ισχύει για $\lambda > a$. Βρείτε το $a$.`,
      fields: [{ label: "a =", ans: 5 }],
      hint: R`$\Delta = (\lambda - 5)^2 + 4 > 0$ πάντα. Θέλουμε $S > 0$ και $P > 0$.`,
      sol: R`$S = \lambda - 3 > 0$ και $P = \lambda - 5 > 0$ ⇒ $\lambda > 5$.` },
    { level: 3, type: "mc", q: R`Για ποιες τιμές του $\lambda$ η $x^2 - 2x + \lambda^3 - 4\lambda = 0$ έχει λύσεις ετερόσημες;`,
      options: ["$\\lambda < -2$ ή $0 < \\lambda < 2$", "$-2 < \\lambda < 0$ ή $\\lambda > 2$", "$-2 < \\lambda < 2$", "$\\lambda > 2$"], correct: 0,
      hint: R`Ετερόσημες $\iff P = \lambda^3 - 4\lambda < 0$.`,
      sol: R`$\lambda(\lambda - 2)(\lambda + 2) < 0$: πρόσημα $-, +, -, +$ στα $(-\infty, -2), (-2, 0), (0, 2), (2, \infty)$ ⇒ $\lambda < -2$ ή $0 < \lambda < 2$.` },
    { level: 2, type: "fields", q: R`Για ποιες τιμές του $\lambda$ το τριώνυμο $x^2 - (2\lambda - 5)x + 4$ διατηρεί σταθερό πρόσημο για κάθε $x$; Δώστε το διάστημα $(a, b)$.`,
      fields: [{ label: "a =", ans: "1/2" }, { label: "b =", ans: "9/2" }],
      hint: R`Σταθερό πρόσημο $\iff \Delta < 0$.`,
      sol: R`$(2\lambda - 5)^2 - 16 < 0 \iff -4 < 2\lambda - 5 < 4 \iff \frac12 < \lambda < \frac92$.` }
  ]
},
/* ───────────────────────────── 6.1 ───────────────────────────── */
{
  id: "6.1", unit: 6, title: "Θεώρημα Θαλή",
  book: "Β΄ Τεύχος §6.1 · Δραστηριότητες σελ. 57",
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
  book: "Β΄ Τεύχος §6.2 · Δραστηριότητες σελ. 66",
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
  book: "Β΄ Τεύχος §6.3 · Δραστηριότητες σελ. 76",
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
/* ───────────────────────────── 6.4 ───────────────────────────── */
{
  id: "6.4", unit: 6, title: "Δύναμη σημείου ως προς κύκλο",
  book: "Β΄ Τεύχος §6.4 · Δραστηριότητες σελ. 88, 94",
  theory: R`
<div class="tbox"><h4>Θεωρήματα</h4>
<p>Αν δύο χορδές $AB$, $\Gamma\Delta$ (ή οι προεκτάσεις τους) τέμνονται στο $\Sigma$:</p>
$$(\Sigma A)(\Sigma B) = (\Sigma\Gamma)(\Sigma\Delta)$$
<p>Αν από εξωτερικό σημείο $\Sigma$ φέρουμε τέμνουσα $\Sigma AB$ και εφαπτόμενο τμήμα $\Sigma T$:</p>
$$(\Sigma A)(\Sigma B) = (\Sigma T)^2$$
<p><i>Απόδειξη:</i> όμοια τρίγωνα — ίσες εγγεγραμμένες γωνίες (ή γωνία χορδής–εφαπτομένης) και κοινή/κατακορυφήν γωνία.</p></div>

<div class="tbox tip"><h4>Η δύναμη του σημείου</h4>
<p>Το γινόμενο $(\Sigma A)(\Sigma B)$ είναι <b>σταθερό</b> για κάθε τέμνουσα από το $\Sigma$. Αν $\delta = \Sigma K$ η απόστασή του από το κέντρο:</p>
<ul><li>$\Sigma$ έξω από τον κύκλο: $(\Sigma A)(\Sigma B) = \delta^2 - R^2$.</li>
<li>$\Sigma$ μέσα στον κύκλο: $(\Sigma A)(\Sigma B) = R^2 - \delta^2$.</li></ul></div>`,
  widget: "power",
  gen: "gpow",
  exercises: [
    { level: 1, type: "fields", q: R`Δύο χορδές $AB$ και $\Gamma\Delta$ ενός κύκλου τέμνονται στο εσωτερικό σημείο $\Sigma$ με $\Sigma A = 4$, $\Sigma B = 6$, $\Sigma\Gamma = 3$. Να βρείτε το $\Sigma\Delta$.`,
      fields: [{ label: "ΣΔ =", ans: 8 }],
      hint: R`$(\Sigma A)(\Sigma B) = (\Sigma\Gamma)(\Sigma\Delta)$.`,
      sol: R`$4\cdot 6 = 3\cdot\Sigma\Delta \Rightarrow \Sigma\Delta = 8$.` },
    { level: 1, type: "fields", q: R`Από εξωτερικό σημείο $\Sigma$ φέρνουμε τέμνουσα $\Sigma AB$ με $\Sigma A = 4$, $\Sigma B = 9$ και εφαπτόμενο τμήμα $\Sigma T$. Να βρείτε το $\Sigma T$.`,
      fields: [{ label: "ΣΤ =", ans: 6 }],
      hint: R`$(\Sigma T)^2 = (\Sigma A)(\Sigma B)$.`,
      sol: R`$(\Sigma T)^2 = 36 \Rightarrow \Sigma T = 6$.` },
    { level: 2, type: "fields", q: R`Από σημείο $\Sigma$ φέρνουμε εφαπτόμενο τμήμα $\Sigma T = 8$ και τέμνουσα $\Sigma AB$ με $\Sigma A = 4$. Να βρείτε το $\Sigma B$ και το μήκος της χορδής $AB$.`,
      fields: [{ label: "ΣΒ =", ans: 16 }, { label: "ΑΒ =", ans: 12 }],
      hint: R`$4\cdot\Sigma B = 64$.`,
      sol: R`$\Sigma B = 16$, $AB = \Sigma B - \Sigma A = 12$.` },
    { level: 2, type: "fields", q: R`Το σημείο $\Sigma$ απέχει $10$ cm από το κέντρο κύκλου ακτίνας $6$ cm. Να βρείτε τη δύναμη του σημείου και το εφαπτόμενο τμήμα από το $\Sigma$.`,
      fields: [{ label: "(ΣΑ)(ΣΒ) =", ans: 64 }, { label: "ΣΤ =", ans: 8 }],
      hint: R`Έξω από τον κύκλο: $\delta^2 - R^2$.`,
      sol: R`$100 - 36 = 64 = (\Sigma T)^2 \Rightarrow \Sigma T = 8$ cm (συμφωνεί με το Πυθαγόρειο στο $K T\Sigma$).` },
    { level: 2, type: "fields", q: R`Σημείο $\Sigma$ στο εσωτερικό κύκλου ακτίνας $5$ απέχει $3$ από το κέντρο. Να βρείτε τη δύναμή του και το μήκος της χορδής που περνά από το $\Sigma$ και είναι κάθετη στο $K\Sigma$.`,
      fields: [{ label: "(ΣΑ)(ΣΒ) =", ans: 16 }, { label: "χορδή =", ans: 8 }],
      hint: R`Μέσα: $R^2 - \delta^2$. Η κάθετη χορδή διχοτομείται στο $\Sigma$.`,
      sol: R`$25 - 9 = 16$. Με $\Sigma A = \Sigma B = x$: $x^2 = 16 \Rightarrow x = 4$, χορδή $8$.` },
    { level: 3, type: "fields", q: R`Από <b>εξωτερικό</b> σημείο $\Sigma$ που απέχει $5$ από το κέντρο κύκλου, μια τέμνουσα τέμνει τον κύκλο στα $A$, $B$ με $\Sigma A = 2$ και $\Sigma B = 8$. Να βρείτε την ακτίνα.`,
      fields: [{ label: "R =", ans: 3 }],
      hint: R`$\delta^2 - R^2 = (\Sigma A)(\Sigma B)$.`,
      sol: R`$25 - R^2 = 16 \Rightarrow R = 3$.` },
    { level: 2, type: "mc", q: R`Στην προέκταση της κοινής χορδής δύο τεμνόμενων κύκλων παίρνουμε σημείο $\Sigma$ και φέρνουμε εφαπτόμενα τμήματα $\Sigma A$, $\Sigma B$ στους δύο κύκλους. Τι ισχύει;`,
      options: ["$\\Sigma A > \\Sigma B$", "$\\Sigma A = \\Sigma B$", "$\\Sigma A < \\Sigma B$", "εξαρτάται από τις ακτίνες"], correct: 1,
      hint: R`Η κοινή χορδή $\Gamma\Delta$ είναι τέμνουσα και για τους δύο κύκλους.`,
      sol: R`$(\Sigma A)^2 = (\Sigma\Gamma)(\Sigma\Delta) = (\Sigma B)^2$, άρα $\Sigma A = \Sigma B$.` }
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

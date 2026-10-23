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
  storeKey: "pagk-mas029-meros-b-v1",
  heroTitle: "Γραμμική Άλγεβρα (ΜΑΣ029) — Μέρος Β",
  tefxos: "μαθήματος ΜΑΣ029 – Μέρος Β",
  howto: `<ul><li>Αριθμοί: <code>12</code> · κλάσματα: <code>3/4</code> ή <code>-5/6</code> · δεκαδικοί: <code>2,5</code></li>
    <li>Πίνακες και διανύσματα: κάθε στοιχείο/συνιστώσα στο δικό του πεδίο, με τη σειρά που ζητείται (κατά γραμμές).</li>
    <li>Οι λύσεις ακολουθούν τον συμβολισμό των σημειώσεων του μαθήματος του Πανεπιστημίου Κύπρου.</li></ul>`
};

const UNITS = [
  { id: 6, title: "Κεφ. 6 · Ορίζουσες" },
  { id: 7, title: "Κεφ. 7 · Γραμμικές απεικονίσεις" },
  { id: 9, title: "Κεφ. 9 · Ιδιοτιμές και ιδιοδιανύσματα" },
  { id: 10, title: "Χώροι με εσωτερικό γινόμενο" }
];

const SECTIONS = [
/* ───────────────────────────── 6.1 ───────────────────────────── */
{
  id: "6.1", unit: 6, title: "Μεταθέσεις και ορισμός της ορίζουσας",
  book: "Σημειώσεις Γεωργίου Κεφ. 6 §6.1–6.2 · Ασκήσεις 8",
  theory: R`
<div class="tbox"><h4>Μεταθέσεις</h4>
<p>Μετάθεση του $\{1, 2, \dots, n\}$ είναι μια αμφιμονοσήμαντη απεικόνιση $\sigma:\{1,\dots,n\}\to\{1,\dots,n\}$· τη γράφουμε $\sigma = \begin{pmatrix}1 & 2 & \cdots & n \\ \sigma(1) & \sigma(2) & \cdots & \sigma(n)\end{pmatrix}$ (γραφή δύο γραμμών — προσοχή, δεν είναι η κυκλική γραφή). Υπάρχουν $n!$ μεταθέσεις.</p>
<p><b>Αντιστροφή</b> της $\sigma$ λέγεται κάθε ζεύγος $i < j$ με $\sigma(i) > \sigma(j)$. Αν $N(\sigma)$ το πλήθος τους, το <b>πρόσημο</b> είναι $\operatorname{sgn}\sigma = (-1)^{N(\sigma)}$: η $\sigma$ είναι <b>άρτια</b> ($+1$) ή <b>περιττή</b> ($-1$). Μια εναλλαγή δύο στοιχείων (αντιμετάθεση) αλλάζει το πρόσημο.</p></div>
<div class="tbox"><h4>Ορισμός της ορίζουσας</h4>
<p>Για $A = (a_{ij})$ τετραγωνικό $n\times n$:</p>
$$\det A = |A| = \sum_{\sigma} \operatorname{sgn}\sigma\; a_{1\sigma(1)}\,a_{2\sigma(2)}\cdots a_{n\sigma(n)}.$$
<p>Κάθε όρος είναι γινόμενο $n$ στοιχείων, <b>ένα από κάθε γραμμή και ένα από κάθε στήλη</b>· υπάρχουν $n!$ όροι. Η ορίζουσα ορίζεται <b>μόνο</b> για τετραγωνικούς πίνακες.</p></div>
<div class="tbox tip"><h4>Πίνακες 2×2 και 3×3</h4>
<p>$\begin{vmatrix}a & b \\ c & d\end{vmatrix} = ad - bc$ (μεταθέσεις $\begin{pmatrix}1 & 2 \\ 1 & 2\end{pmatrix}$ ταυτοτική, άρτια, και $\begin{pmatrix}1 & 2 \\ 2 & 1\end{pmatrix}$ περιττή).</p>
<p>$3\times 3$ (κανόνας του <b>Sarrus</b>): $\ a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32} - a_{13}a_{22}a_{31} - a_{11}a_{23}a_{32} - a_{12}a_{21}a_{33}$.</p>
<p>Π.χ. $\begin{vmatrix}2 & 1 & 3 \\ 0 & -1 & 4 \\ 1 & 2 & 1\end{vmatrix} = (-2 + 4 + 0) - (-3 + 16 + 0) = 2 - 13 = -11$.</p></div>
<div class="tbox warn"><h4>Προσοχή</h4><p>Ο κανόνας του Sarrus ισχύει <b>μόνο</b> για $3\times 3$. Για $n \ge 4$ χρησιμοποιούμε ανάπτυγμα (§6.3) ή στοιχειώδεις μετασχηματισμούς (§6.2).</p></div>`,
  widget: "l4perm",
  gen: "l4det",
  exercises: [
    { level: 1, type: "fields", q: R`Δίνεται η μετάθεση $\sigma = \begin{pmatrix}1 & 2 & 3 & 4 \\ 3 & 1 & 4 & 2\end{pmatrix}$, δηλαδή $\sigma(1) = 3, \sigma(2) = 1, \sigma(3) = 4, \sigma(4) = 2$. Να βρείτε το πλήθος των αντιστροφών και το πρόσημό της.`,
      fields: [{ label: "N(σ) =", ans: 3 }, { label: "sgn σ =", ans: -1 }], hint: R`Ελέγχουμε όλα τα ζεύγη $(\sigma(i), \sigma(j))$ με $i < j$.`,
      sol: R`Αντιστροφές: $(3,1), (3,2), (4,2)$, άρα $N(\sigma) = 3$ και $\operatorname{sgn}\sigma = (-1)^3 = -1$ (περιττή).` },
    { level: 1, type: "mc", q: R`Η μετάθεση $\sigma = \begin{pmatrix}1 & 2 & 3 \\ 2 & 3 & 1\end{pmatrix}$ είναι:`, options: ["άρτια", "περιττή"], correct: 0, hint: R`Μέτρησε τις αντιστροφές.`,
      sol: R`Αντιστροφές $(2,1)$ και $(3,1)$: $N = 2$, άρα άρτια.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε την ορίζουσα $\begin{vmatrix}3 & -2 \\ 5 & 4\end{vmatrix}$.`, fields: [{ label: "=", ans: 22 }], hint: R`$ad - bc$.`, sol: R`$3\cdot 4 - (-2)\cdot 5 = 12 + 10 = 22$.` },
    { level: 1, type: "fields", q: R`Με τον κανόνα του Sarrus να υπολογίσετε $\begin{vmatrix}2 & 1 & 3 \\ 0 & -1 & 4 \\ 1 & 2 & 1\end{vmatrix}$.`, fields: [{ label: "=", ans: -11 }],
      hint: R`Τρία γινόμενα με $+$, τρία με $-$.`, sol: R`Θετικοί όροι: $2(-1)(1) + 1\cdot 4\cdot 1 + 3\cdot 0\cdot 2 = 2$. Αρνητικοί: $3(-1)(1) + 2\cdot 4\cdot 2 + 1\cdot 0\cdot 1 = 13$. Άρα $2 - 13 = -11$.` },
    { level: 2, type: "mc", q: R`Με ποιο πρόσημο εμφανίζεται ο όρος $a_{13}a_{22}a_{31}$ στην ορίζουσα ενός $3\times 3$ πίνακα;`, options: ["$-$", "$+$"], correct: 0,
      hint: R`Αντίστοιχη μετάθεση $\begin{pmatrix}1 & 2 & 3 \\ 3 & 2 & 1\end{pmatrix}$.`, sol: R`Η $\begin{pmatrix}1 & 2 & 3 \\ 3 & 2 & 1\end{pmatrix}$ έχει αντιστροφές $(3,2), (3,1), (2,1)$: $N = 3$, περιττή, πρόσημο $-$.` },
    { level: 2, type: "fields", q: R`Για ποιες τιμές του $k$ ισχύει $\begin{vmatrix}k & 2 \\ 3 & k - 1\end{vmatrix} = 0$; (Δώστε πρώτα τη μικρότερη.)`, fields: [{ label: "k₁ =", ans: -2 }, { label: "k₂ =", ans: 3 }],
      hint: R`$k(k-1) - 6 = 0$.`, sol: R`$k^2 - k - 6 = (k - 3)(k + 2) = 0$, άρα $k = -2$ ή $k = 3$.` },
    { level: 1, type: "fields", q: R`Πόσους όρους (γινόμενα) έχει το ανάπτυγμα της ορίζουσας ενός $4\times 4$ και ενός $5\times 5$ πίνακα σύμφωνα με τον ορισμό;`, fields: [{ label: "4×4:", ans: 24 }, { label: "5×5:", ans: 120 }],
      hint: R`Όσες οι μεταθέσεις: $n!$.`, sol: R`$4! = 24$ και $5! = 120$.` },
    { level: 1, type: "mc", q: R`Ο κανόνας του Sarrus μπορεί να χρησιμοποιηθεί για τον υπολογισμό ορίζουσας $4\times 4$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Πόσους όρους δίνει ο Sarrus;`, sol: R`Λάθος: ο Sarrus δίνει 6 όρους και ισχύει μόνο για $3\times 3$· η $4\times 4$ έχει 24 όρους.` },
    { level: 3, type: "fields", q: R`Να βρείτε το πλήθος των αντιστροφών της μετάθεσης που αντιστοιχεί στον όρο $a_{12}a_{24}a_{33}a_{41}$ της ορίζουσας ενός $4\times 4$ πίνακα, και το πρόσημο με το οποίο εμφανίζεται ο όρος (δώστε $1$ ή $-1$).`,
      fields: [{ label: "N =", ans: 4 }, { label: "πρόσημο =", ans: 1 }], hint: R`Μετάθεση $\begin{pmatrix}1 & 2 & 3 & 4 \\ 2 & 4 & 3 & 1\end{pmatrix}$.`, sol: R`Αντιστροφές: $(2,1), (4,3), (4,1), (3,1)$: $N = 4$, άρτια, πρόσημο $+1$.` },
    { level: 3, type: "fields", q: R`Να βρείτε το $x$ ώστε $\begin{vmatrix}1 & 2 & x \\ 0 & 1 & 3 \\ 2 & 1 & 0\end{vmatrix} = 0$.`, fields: [{ label: "x =", ans: "9/2" }],
      hint: R`Sarrus: η ορίζουσα είναι γραμμική ως προς $x$.`, sol: R`$(0 + 12 + 0) - (2x + 3 + 0) = 9 - 2x = 0 \Rightarrow x = \frac92$.` }
  ]
},
/* ───────────────────────────── 6.2 ───────────────────────────── */
{
  id: "6.2", unit: 6, title: "Ιδιότητες των οριζουσών",
  book: "Σημειώσεις Γεωργίου Κεφ. 6 §6.3 · Ασκήσεις 8",
  theory: R`
<div class="tbox"><h4>Στοιχειώδεις μετασχηματισμοί γραμμών</h4>
<ul><li>Εναλλαγή δύο γραμμών ($\Gamma_i \leftrightarrow \Gamma_j$): η ορίζουσα <b>αλλάζει πρόσημο</b>.</li>
<li>Πολλαπλασιασμός γραμμής με $\kappa$ ($\Gamma_i \to \kappa\Gamma_i$): η ορίζουσα <b>πολλαπλασιάζεται</b> με $\kappa$.</li>
<li>Πρόσθεση πολλαπλασίου άλλης γραμμής ($\Gamma_i \to \Gamma_i + \kappa\Gamma_j$, $i \ne j$): η ορίζουσα <b>δεν αλλάζει</b>.</li></ul>
<p>Αφού $\det A^{T} = \det A$, τα ίδια ισχύουν και για στήλες.</p></div>
<div class="tbox"><h4>Βασικές ιδιότητες</h4>
<ul><li>Αν ο $A$ έχει μηδενική γραμμή (στήλη) ή δύο ίσες/ανάλογες γραμμές (στήλες), τότε $\det A = 0$.</li>
<li>Τριγωνικός (άνω ή κάτω) πίνακας: $\det A = a_{11}a_{22}\cdots a_{nn}$.</li>
<li>$\det(AB) = \det A\cdot\det B$, $\ \det(\kappa A) = \kappa^{n}\det A$ ($A$ τύπου $n\times n$).</li>
<li>Ο $A$ είναι αντιστρέψιμος $\iff \det A \ne 0$, και τότε $\det(A^{-1}) = \dfrac{1}{\det A}$.</li></ul></div>
<div class="tbox tip"><h4>Υπολογισμός με απαλοιφή</h4>
<p>Φέρνουμε τον πίνακα σε τριγωνική μορφή κρατώντας λογαριασμό για εναλλαγές και πολλαπλασιασμούς: $\begin{vmatrix}1 & 2 & -1 \\ 2 & 3 & 1 \\ -1 & 1 & 4\end{vmatrix} = \begin{vmatrix}1 & 2 & -1 \\ 0 & -1 & 3 \\ 0 & 3 & 3\end{vmatrix} = \begin{vmatrix}1 & 2 & -1 \\ 0 & -1 & 3 \\ 0 & 0 & 12\end{vmatrix} = -12$.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη</h4><p>Γενικά $\det(A + B) \ne \det A + \det B$, και $\det(\kappa A) = \kappa^n\det A$, όχι $\kappa\det A$.</p></div>`,
  widget: "l4rowops",
  gen: "l4prop",
  exercises: [
    { level: 1, type: "fields", q: R`Έστω $A$ πίνακας $3\times 3$ με $\det A = 4$. Να βρείτε $\det(2A)$, $\det(A^{T})$ και $\det(A^{-1})$.`, fields: [{ label: "det(2A) =", ans: 32 }, { label: "det(Aᵀ) =", ans: 4 }, { label: "det(A⁻¹) =", ans: "1/4" }],
      hint: R`$\det(\kappa A) = \kappa^3\det A$.`, sol: R`$2^3\cdot 4 = 32$, $\det A^T = 4$, $\det A^{-1} = \frac14$.` },
    { level: 2, type: "fields", q: R`Οι $A, B$ είναι $4\times 4$ με $\det A = -2$, $\det B = 3$. Να βρείτε $\det(AB)$, $\det(A^{2}B^{-1})$ και $\det(-A)$.`, fields: [{ label: "det(AB) =", ans: -6 }, { label: "det(A²B⁻¹) =", ans: "4/3" }, { label: "det(−A) =", ans: -2 }],
      hint: R`$\det(-A) = (-1)^4\det A$.`, sol: R`$\det(AB) = -6$, $\det(A^2B^{-1}) = \frac{(-2)^2}{3} = \frac43$, $\det(-A) = (-1)^4(-2) = -2$.` },
    { level: 1, type: "fields", q: R`Με στοιχειώδεις μετασχηματισμούς γραμμών να υπολογίσετε $\begin{vmatrix}1 & 2 & -1 \\ 2 & 3 & 1 \\ -1 & 1 & 4\end{vmatrix}$.`, fields: [{ label: "=", ans: -12 }],
      hint: R`$\Gamma_2 \to \Gamma_2 - 2\Gamma_1$, $\Gamma_3 \to \Gamma_3 + \Gamma_1$.`, sol: R`Παίρνουμε $\begin{vmatrix}1 & 2 & -1 \\ 0 & -1 & 3 \\ 0 & 3 & 3\end{vmatrix}$ και με $\Gamma_3 \to \Gamma_3 + 3\Gamma_2$ τον τριγωνικό με διαγώνιο $1, -1, 12$: $\det = -12$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε $\begin{vmatrix}2 & 7 & -3 & 5 \\ 0 & -1 & 4 & 8 \\ 0 & 0 & 3 & 6 \\ 0 & 0 & 0 & 5\end{vmatrix}$.`, fields: [{ label: "=", ans: -30 }],
      hint: R`Άνω τριγωνικός.`, sol: R`$2\cdot(-1)\cdot 3\cdot 5 = -30$.` },
    { level: 2, type: "mc", q: R`Ο $A$ είναι $3\times 3$ με $\det A = 5$. Ο $B$ προκύπτει από τον $A$ εναλλάσσοντας δύο γραμμές και πολλαπλασιάζοντας μια τρίτη γραμμή επί $3$. Τότε $\det B =$`,
      options: ["$-15$", "$15$", "$-5$", "$135$"], correct: 0, hint: R`Εναλλαγή: $\times(-1)$· πολλαπλασιασμός γραμμής: $\times 3$.`, sol: R`$\det B = (-1)\cdot 3\cdot 5 = -15$.` },
    { level: 1, type: "mc", q: R`Για τετραγωνικούς πίνακες ίδιου μεγέθους ισχύει πάντα $\det(A + B) = \det A + \det B$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Δοκίμασε $A = B = I_2$.`, sol: R`Λάθος: για $A = B = I_2$ έχουμε $\det(2I_2) = 4$, ενώ $\det I_2 + \det I_2 = 2$.` },
    { level: 1, type: "mc", q: R`Η ορίζουσα $\begin{vmatrix}1 & -2 & 4 \\ 3 & 0 & 5 \\ -2 & 4 & -8\end{vmatrix}$ είναι:`, options: ["$0$, γιατί οι γραμμές 1 και 3 είναι ανάλογες", "$0$, γιατί υπάρχει μηδενικό στοιχείο", "$-40$", "$40$"], correct: 0,
      hint: R`Σύγκρινε την 1η και την 3η γραμμή.`, sol: R`$\Gamma_3 = -2\Gamma_1$, άρα η ορίζουσα είναι $0$ (ένα μηδενικό στοιχείο δεν αρκεί για κάτι τέτοιο).` },
    { level: 3, type: "fields", q: R`Αν $\begin{vmatrix}a & b & c \\ d & e & f \\ g & h & i\end{vmatrix} = 7$, να βρείτε τις ορίζουσες (α) $\begin{vmatrix}a & b & c \\ 2d - 3a & 2e - 3b & 2f - 3c \\ g & h & i\end{vmatrix}$, (β) $\begin{vmatrix}g & h & i \\ d & e & f \\ a & b & c\end{vmatrix}$, (γ) $\begin{vmatrix}a + d & b + e & c + f \\ d & e & f \\ g & h & i\end{vmatrix}$.`,
      fields: [{ label: "(α) =", ans: 14 }, { label: "(β) =", ans: -7 }, { label: "(γ) =", ans: 7 }], hint: R`(α) $\Gamma_2 \to 2\Gamma_2 - 3\Gamma_1$: ο πολλαπλασιασμός της $\Gamma_2$ επί 2 διπλασιάζει.`,
      sol: R`(α) $2\cdot 7 = 14$ (η πρόσθεση πολλαπλασίου της $\Gamma_1$ δεν αλλάζει την ορίζουσα). (β) Εναλλαγή $\Gamma_1 \leftrightarrow \Gamma_3$: $-7$. (γ) $\Gamma_1 \to \Gamma_1 + \Gamma_2$: $7$.` },
    { level: 3, type: "fields", q: R`Ο $A$ είναι αντιστρέψιμος $3\times 3$ πίνακας με $A^{2} = 2A$. Να βρείτε την $\det A$.`, fields: [{ label: "det A =", ans: 8 }],
      hint: R`Πάρε ορίζουσες: $(\det A)^2 = \det(2A)$.`, sol: R`$(\det A)^2 = 2^3\det A$ και $\det A \ne 0$, άρα $\det A = 8$. (Μάλιστα $A = 2I$, πολλαπλασιάζοντας με $A^{-1}$.)` },
    { level: 2, type: "mc", q: R`Αν $A^{T}A = I$ (ορθογώνιος πίνακας), τότε:`, options: ["$\\det A = \\pm 1$", "$\\det A = 1$", "$\\det A = 0$", "$\\det A$ μπορεί να είναι οποιοσδήποτε αριθμός"], correct: 0,
      hint: R`$\det(A^TA) = (\det A)^2$.`, sol: R`$(\det A)^2 = \det I = 1$, άρα $\det A = \pm 1$ (π.χ. στροφές $+1$, ανακλάσεις $-1$).` }
  ]
},
/* ───────────────────────────── 6.3 ───────────────────────────── */
{
  id: "6.3", unit: 6, title: "Ανάπτυγμα ορίζουσας",
  book: "Σημειώσεις Γεωργίου Κεφ. 6 §6.4 · Ασκήσεις 8",
  theory: R`
<div class="tbox"><h4>Ελάσσονες και αλγεβρικά συμπληρώματα</h4>
<p>Για $A = (a_{ij})$ τύπου $n\times n$, η <b>ελάσσων ορίζουσα</b> $M_{ij}$ είναι η ορίζουσα του $(n-1)\times(n-1)$ πίνακα που προκύπτει διαγράφοντας τη γραμμή $i$ και τη στήλη $j$. Το <b>αλγεβρικό συμπλήρωμα</b> του $a_{ij}$ είναι $A_{ij} = (-1)^{i+j}M_{ij}$. Τα πρόσημα $(-1)^{i+j}$ σχηματίζουν «σκακιέρα»: $\begin{pmatrix}+ & - & + \\ - & + & - \\ + & - & +\end{pmatrix}$.</p></div>
<div class="tbox"><h4>Ανάπτυγμα Laplace</h4>
<p>Για κάθε γραμμή $i$ και κάθε στήλη $j$:</p>
$$\det A = \sum_{k=1}^{n} a_{ik}A_{ik} = \sum_{k=1}^{n} a_{kj}A_{kj}.$$
<p>Επιπλέον, για $i \ne l$: $\ \sum_k a_{ik}A_{lk} = 0$ (ανάπτυγμα με «ξένα» αλγεβρικά συμπληρώματα).</p></div>
<div class="tbox tip"><h4>Στρατηγική</h4>
<p>Αναπτύσσουμε ως προς τη γραμμή ή στήλη με τα <b>περισσότερα μηδενικά</b>, αφού πρώτα δημιουργήσουμε μηδενικά με $\Gamma_i \to \Gamma_i + \kappa\Gamma_j$. Π.χ. $\begin{vmatrix}1 & 0 & 2 \\ 3 & -1 & 0 \\ 0 & 4 & 5\end{vmatrix} = 1\begin{vmatrix}-1 & 0 \\ 4 & 5\end{vmatrix} - 0 + 2\begin{vmatrix}3 & -1 \\ 0 & 4\end{vmatrix} = -5 + 24 = 19$.</p></div>`,
  widget: "l4laplace",
  gen: "l4lap",
  exercises: [
    { level: 1, type: "fields", q: R`Για $A = \begin{pmatrix}2 & -1 & 3 \\ 4 & 0 & 1 \\ 5 & 2 & -2\end{pmatrix}$ να βρείτε $M_{12}$, $A_{12}$ και $A_{23}$.`, fields: [{ label: "M₁₂ =", ans: -13 }, { label: "A₁₂ =", ans: 13 }, { label: "A₂₃ =", ans: -9 }],
      hint: R`$A_{ij} = (-1)^{i+j}M_{ij}$.`, sol: R`$M_{12} = \begin{vmatrix}4 & 1 \\ 5 & -2\end{vmatrix} = -13$, $A_{12} = 13$. $M_{23} = \begin{vmatrix}2 & -1 \\ 5 & 2\end{vmatrix} = 9$, $A_{23} = -9$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε με ανάπτυγμα την $\begin{vmatrix}1 & 0 & 2 \\ 3 & -1 & 0 \\ 0 & 4 & 5\end{vmatrix}$.`, fields: [{ label: "=", ans: 19 }], hint: R`Ανάπτυγμα ως προς την 1η γραμμή.`,
      sol: R`$1\cdot(-5 - 0) - 0 + 2\cdot(12 - 0) = -5 + 24 = 19$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε $\begin{vmatrix}3 & 0 & 0 & 2 \\ 1 & 4 & -1 & 5 \\ 2 & 0 & 0 & 1 \\ 0 & 2 & 1 & 3\end{vmatrix}$.`, fields: [{ label: "=", ans: 6 }],
      hint: R`Η 2η και η 3η στήλη έχουν δύο μηδενικά — ή ανάπτυγμα ως προς την 3η γραμμή.`,
      sol: R`Ανάπτυγμα ως προς $\Gamma_3$: $2\cdot A_{31} + 1\cdot A_{34}$. $A_{31} = +\begin{vmatrix}0 & 0 & 2 \\ 4 & -1 & 5 \\ 2 & 1 & 3\end{vmatrix} = 2(4 + 2) = 12$, $A_{34} = -\begin{vmatrix}3 & 0 & 0 \\ 1 & 4 & -1 \\ 0 & 2 & 1\end{vmatrix} = -3(4 + 2) = -18$. Άρα $24 - 18 = 6$.` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε $\begin{vmatrix}2 & 0 & 1 & 0 & 3 \\ 0 & 0 & 3 & 0 & 0 \\ 1 & 4 & -2 & 5 & -1 \\ 4 & 0 & 2 & 1 & 6 \\ 0 & 0 & 1 & 0 & -1\end{vmatrix}$.`, fields: [{ label: "=", ans: 24 }],
      hint: R`$\Gamma_2$ έχει ένα μόνο μη μηδενικό· μετά η 2η στήλη.`,
      sol: R`Ως προς $\Gamma_2$: $3\cdot(-1)^{2+3}M_{23}$. Στην $4\times 4$ που μένει, η στήλη του $4$ (από τη γραμμή 3) έχει ένα μη μηδενικό: $M_{23} = 4\cdot(-1)^{2+2}\begin{vmatrix}2 & 0 & 3 \\ 4 & 1 & 6 \\ 0 & 0 & -1\end{vmatrix} = 4\cdot(-2) = -8$. Άρα $\det = -3\cdot(-8) = 24$.` },
    { level: 1, type: "mc", q: R`Το πρόσημο $(-1)^{i+j}$ του αλγεβρικού συμπληρώματος $A_{23}$ είναι:`, options: ["$-$", "$+$"], correct: 0, hint: R`$2 + 3 = 5$.`, sol: R`$(-1)^5 = -1$.` },
    { level: 2, type: "fields", q: R`Η ορίζουσα $\begin{vmatrix}x & 1 & 1 \\ 1 & x & 1 \\ 1 & 1 & x\end{vmatrix}$ ισούται με $(x - 1)^2(x + 2)$. Να επαληθεύσετε για $x = 2$ (υπολογίστε την τιμή) και να δώσετε την αρνητική ρίζα της.`,
      fields: [{ label: "τιμή για x = 2:", ans: 4 }, { label: "αρνητική ρίζα:", ans: -2 }], hint: R`Για $x = 2$: $\begin{vmatrix}2 & 1 & 1 \\ 1 & 2 & 1 \\ 1 & 1 & 2\end{vmatrix}$.`,
      sol: R`$2(4 - 1) - 1(2 - 1) + 1(1 - 2) = 6 - 1 - 1 = 4 = 1^2\cdot 4$ ✓. Ρίζες $x = 1$ (διπλή) και $x = -2$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε την ορίζουσα Vandermonde $\begin{vmatrix}1 & 1 & 1 \\ 1 & 2 & 4 \\ 1 & 4 & 16\end{vmatrix}$.`, fields: [{ label: "=", ans: 6 }],
      hint: R`$\begin{vmatrix}1 & 1 & 1 \\ a & b & c \\ a^2 & b^2 & c^2\end{vmatrix} = (b - a)(c - a)(c - b)$ (εδώ στη μορφή του ανάστροφου).`, sol: R`Με $a = 1, b = 2, c = 4$: $(2 - 1)(4 - 1)(4 - 2) = 6$.` },
    { level: 2, type: "mc", q: R`Για κάθε τετραγωνικό πίνακα $A$ ισχύει $a_{11}A_{21} + a_{12}A_{22} + \dots + a_{1n}A_{2n} = 0$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Είναι η ορίζουσα του πίνακα όπου η 2η γραμμή αντικαθίσταται από την 1η.`, sol: R`Σωστό: πρόκειται για ανάπτυγμα με «ξένα» αλγεβρικά συμπληρώματα· ισούται με την ορίζουσα πίνακα με δύο ίσες γραμμές, άρα $0$.` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε $\begin{vmatrix}2 & 1 & 0 & 0 \\ 1 & 2 & 1 & 0 \\ 0 & 1 & 2 & 1 \\ 0 & 0 & 1 & 2\end{vmatrix}$.`, fields: [{ label: "=", ans: 5 }],
      hint: R`Αν $D_n$ η ορίζουσα $n\times n$ αυτής της μορφής, ανάπτυγμα ως προς την 1η γραμμή δίνει $D_n = 2D_{n-1} - D_{n-2}$.`, sol: R`$D_1 = 2$, $D_2 = 3$, $D_3 = 2\cdot 3 - 2 = 4$, $D_4 = 2\cdot 4 - 3 = 5$.` }
  ]
},
/* ───────────────────────────── 6.4 ───────────────────────────── */
{
  id: "6.4", unit: 6, title: "Αντίστροφος πίνακας μέσω προσαρτημένου – Κανόνας Cramer",
  book: "Σημειώσεις Γεωργίου Κεφ. 6 §6.5–6.6 · Ασκήσεις 8",
  theory: R`
<div class="tbox"><h4>Προσαρτημένος πίνακας</h4>
<p>$\operatorname{adj}A = (A_{ij})^{T}$: ο ανάστροφος του πίνακα των αλγεβρικών συμπληρωμάτων. Ισχύει $A\cdot\operatorname{adj}A = \operatorname{adj}A\cdot A = (\det A)\,I$ (για <b>κάθε</b> τετραγωνικό $A$). Άρα, αν $\det A \ne 0$:</p>
$$A^{-1} = \frac{1}{\det A}\operatorname{adj}A, \qquad \begin{pmatrix}a & b \\ c & d\end{pmatrix}^{-1} = \frac{1}{ad - bc}\begin{pmatrix}d & -b \\ -c & a\end{pmatrix}.$$</div>
<div class="tbox"><h4>Κανόνας του Cramer</h4>
<p>Αν το σύστημα $AX = B$ ($n$ εξισώσεις, $n$ άγνωστοι) έχει $D = \det A \ne 0$, τότε έχει <b>μοναδική</b> λύση $x_i = \dfrac{D_i}{D}$, όπου $D_i$ η ορίζουσα του $A$ με την $i$-οστή στήλη αντικατεστημένη από τη στήλη $B$. Αν $D = 0$ ο κανόνας δεν εφαρμόζεται (καμία ή άπειρες λύσεις). Ένα <b>ομογενές</b> σύστημα $AX = 0$ έχει μη μηδενική λύση $\iff D = 0$.</p></div>
<div class="tbox tip"><h4>Εμβαδά και όγκοι</h4>
<p>Εμβαδόν παραλληλογράμμου με πλευρές $u, v \in\mathbb R^2$: $|\det[\,u\ v\,]|$· τριγώνου: $\tfrac12|\det[\,u\ v\,]|$. Όγκος παραλληλεπιπέδου με ακμές $u, v, w\in\mathbb R^3$: $|\det[\,u\ v\ w\,]|$. Αν $T(x) = Ax$, τότε $\text{εμβ}(T(S)) = |\det A|\cdot\text{εμβ}(S)$.</p></div>`,
  widget: "l4cramer",
  gen: "l4cram",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε τον αντίστροφο του $\begin{pmatrix}3 & 5 \\ 1 & 2\end{pmatrix}$ (στοιχεία κατά γραμμές).`, fields: [{ label: "(1,1) =", ans: 2 }, { label: "(1,2) =", ans: -5 }, { label: "(2,1) =", ans: -1 }, { label: "(2,2) =", ans: 3 }],
      hint: R`$\det = 1$.`, sol: R`$\det = 6 - 5 = 1$, άρα $A^{-1} = \begin{pmatrix}2 & -5 \\ -1 & 3\end{pmatrix}$.` },
    { level: 2, type: "fields", q: R`Για $A = \begin{pmatrix}1 & 2 & 3 \\ 0 & 1 & 4 \\ 5 & 6 & 0\end{pmatrix}$ να βρείτε $\det A$ και τα στοιχεία $(A^{-1})_{13}$ και $(A^{-1})_{21}$.`, fields: [{ label: "det A =", ans: 1 }, { label: "(A⁻¹)₁₃ =", ans: 5 }, { label: "(A⁻¹)₂₁ =", ans: 20 }],
      hint: R`$(A^{-1})_{ij} = \dfrac{A_{ji}}{\det A}$ — προσοχή στην αναστροφή των δεικτών.`,
      sol: R`$\det A = 1(0 - 24) - 2(0 - 20) + 3(0 - 5) = 1$. $(A^{-1})_{13} = A_{31} = +\begin{vmatrix}2 & 3 \\ 1 & 4\end{vmatrix} = 5$, $(A^{-1})_{21} = A_{12} = -\begin{vmatrix}0 & 4 \\ 5 & 0\end{vmatrix} = 20$.` },
    { level: 2, type: "fields", q: R`Με τον κανόνα του Cramer να λύσετε το σύστημα $\begin{cases}2x_1 - x_2 = 0 \\ x_1 + x_2 + x_3 = 6 \\ -x_1 + 2x_3 = 5\end{cases}$. Δώστε και την $D$.`, fields: [{ label: "D =", ans: 7 }, { label: "x₁ =", ans: 1 }, { label: "x₂ =", ans: 2 }, { label: "x₃ =", ans: 3 }],
      hint: R`$D = \begin{vmatrix}2 & -1 & 0 \\ 1 & 1 & 1 \\ -1 & 0 & 2\end{vmatrix}$.`,
      sol: R`$D = 2(2 - 0) + 1(2 + 1) + 0 = 7$. $D_1 = \begin{vmatrix}0 & -1 & 0 \\ 6 & 1 & 1 \\ 5 & 0 & 2\end{vmatrix} = 7$, $D_2 = 14$, $D_3 = 21$. Άρα $(x_1, x_2, x_3) = (1, 2, 3)$.` },
    { level: 2, type: "mc", q: R`Το σύστημα $\begin{cases}\lambda x + y = 1 \\ x + \lambda y = 1\end{cases}$ για $\lambda = -1$:`, options: ["είναι αδύνατο", "έχει μοναδική λύση", "έχει άπειρες λύσεις"], correct: 0,
      hint: R`$D = \lambda^2 - 1$· για $\lambda = -1$ έλεγξε τις εξισώσεις.`, sol: R`$D = 0$, οπότε δεν εφαρμόζεται ο Cramer. Οι εξισώσεις γίνονται $-x + y = 1$ και $x - y = 1$, δηλαδή $x - y = -1$ και $x - y = 1$: αδύνατο. (Για $\lambda = 1$ έχουμε άπειρες λύσεις.)` },
    { level: 1, type: "fields", q: R`Να λύσετε με τον κανόνα Cramer το σύστημα $\begin{cases}3x + y = 1 \\ x + 3y = 1\end{cases}$.`, fields: [{ label: "x =", ans: "1/4" }, { label: "y =", ans: "1/4" }],
      hint: R`$D = 8$, $D_x = D_y = 2$.`, sol: R`$D = 9 - 1 = 8$, $D_x = \begin{vmatrix}1 & 1 \\ 1 & 3\end{vmatrix} = 2$, $D_y = 2$: $x = y = \frac14$.` },
    { level: 1, type: "fields", q: R`Να βρείτε το εμβαδόν του παραλληλογράμμου με κορυφές $(0,0), (3,1), (1,4), (4,5)$.`, fields: [{ label: "Ε =", ans: 11 }],
      hint: R`Πλευρές από την αρχή: $u = (3,1)$, $v = (1,4)$.`, sol: R`$\left|\begin{vmatrix}3 & 1 \\ 1 & 4\end{vmatrix}\right| = |12 - 1| = 11$.` },
    { level: 1, type: "fields", q: R`Να βρείτε τον όγκο του παραλληλεπιπέδου με ακμές τα διανύσματα $(2, 1, 0)$, $(1, 3, 1)$, $(0, 1, 4)$.`, fields: [{ label: "V =", ans: 18 }],
      hint: R`Απόλυτη τιμή ορίζουσας $3\times 3$.`, sol: R`$\begin{vmatrix}2 & 1 & 0 \\ 1 & 3 & 1 \\ 0 & 1 & 4\end{vmatrix} = 2(12 - 1) - 1(4 - 0) = 18$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το εμβαδόν του τριγώνου με κορυφές $(1, 2), (4, 3), (2, 6)$.`, fields: [{ label: "Ε =", ans: "11/2" }],
      hint: R`$u = (3, 1)$, $v = (1, 4)$ από την κορυφή $(1,2)$.`, sol: R`$\tfrac12|3\cdot 4 - 1\cdot 1| = \frac{11}{2}$.` },
    { level: 3, type: "fields", q: R`Το παραλληλόγραμμο $S$ ορίζεται από τα $u = (1, 2)$, $v = (3, 1)$. Να βρείτε το εμβαδόν του $S$ και της εικόνας του μέσω της $T(x) = Ax$ με $A = \begin{pmatrix}2 & 1 \\ -1 & 3\end{pmatrix}$.`, fields: [{ label: "εμβ(S) =", ans: 5 }, { label: "εμβ(T(S)) =", ans: 35 }],
      hint: R`$\text{εμβ}(T(S)) = |\det A|\,\text{εμβ}(S)$.`, sol: R`$\text{εμβ}(S) = |1 - 6| = 5$, $\det A = 6 + 1 = 7$, άρα $7\cdot 5 = 35$.` },
    { level: 3, type: "fields", q: R`Για ποιες τιμές του $k$ το ομογενές σύστημα με πίνακα $\begin{pmatrix}1 & 1 & 1 \\ 1 & 2 & k \\ 1 & 4 & k^2\end{pmatrix}$ έχει μη μηδενική λύση; (Δώστε πρώτα τη μικρότερη.)`,
      fields: [{ label: "k₁ =", ans: 1 }, { label: "k₂ =", ans: 2 }], hint: R`Ορίζουσα Vandermonde με $a = 1, b = 2, c = k$.`, sol: R`$D = (2 - 1)(k - 1)(k - 2) = 0 \iff k = 1$ ή $k = 2$.` }
  ]
},
/* ───────────────────────────── 7.1 ───────────────────────────── */
{
  id: "7.1", unit: 7, title: "Γραμμικές απεικονίσεις: ορισμός και παραδείγματα",
  book: "Σημειώσεις Γεωργίου Κεφ. 7 §7.1–7.2 · Ασκήσεις 5",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Έστω $V, W$ διανυσματικοί χώροι πάνω στο $\mathbb R$. Η απεικόνιση $f: V\to W$ λέγεται <b>γραμμική</b> αν για κάθε $u, v\in V$ και $\lambda\in\mathbb R$:</p>
$$f(u + v) = f(u) + f(v), \qquad f(\lambda u) = \lambda f(u),$$
<p>ισοδύναμα $f(\lambda u + \mu v) = \lambda f(u) + \mu f(v)$. Συνέπειες: $f(0) = 0$, $f(-u) = -f(u)$.</p></div>
<div class="tbox"><h4>Παραδείγματα</h4>
<ul><li>$f(X) = AX$, $A$ πίνακας $m\times n$: γραμμική $\mathbb R^n \to\mathbb R^m$.</li>
<li>Η παράγωγος $D(p) = p'$ στον χώρο των πολυωνύμων· το ίχνος $\operatorname{tr}: M_n \to\mathbb R$· η ανάστροφη $A\mapsto A^T$.</li>
<li><b>Όχι</b> γραμμικές: η μεταφορά $x\mapsto x + b$ ($b \ne 0$), οι $x\mapsto x^2$, $x\mapsto|x|$, η $(x, y)\mapsto xy$, η ορίζουσα $\det: M_n\to\mathbb R$ ($n \ge 2$).</li></ul></div>
<div class="tbox tip"><h4>Καθορίζεται από μια βάση</h4>
<p>Μια γραμμική απεικόνιση καθορίζεται πλήρως από τις τιμές της σε μια βάση: αν $v = \lambda_1 v_1 + \dots + \lambda_n v_n$ τότε $f(v) = \lambda_1 f(v_1) + \dots + \lambda_n f(v_n)$. Ειδικά, κάθε γραμμική $T:\mathbb R^n\to\mathbb R^m$ είναι της μορφής $T(x) = Ax$ με <b>κανονικό πίνακα</b> $A = [\,T(e_1)\ \cdots\ T(e_n)\,]$.</p></div>`,
  widget: "l4lin",
  gen: "l4lin",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια από τις παρακάτω απεικονίσεις είναι γραμμική;`, options: ["$T(x_1, x_2, x_3) = (x_1, x_2 - x_3)$", "$T(x_1, x_2) = (2x_1 - 3x_2, x_1 + 4)$", "$T(x, y) = (x^2, y)$", "$T(x, y) = (xy, x)$"], correct: 0,
      hint: R`Έλεγξε $T(0) = 0$ και μη γραμμικούς όρους.`, sol: R`Η $(x_1, x_2 - x_3)$ είναι γραμμική. Η 2η έχει σταθερό όρο ($T(0) = (0, 4) \ne 0$), οι άλλες περιέχουν $x^2$ ή $xy$.` },
    { level: 1, type: "fields", q: R`Να βρείτε τον κανονικό πίνακα της $T(x, y, z) = (2x - y + 3z,\ x + 4z)$ (κατά γραμμές).`,
      fields: [{ label: "a₁₁ =", ans: 2 }, { label: "a₁₂ =", ans: -1 }, { label: "a₁₃ =", ans: 3 }, { label: "a₂₁ =", ans: 1 }, { label: "a₂₂ =", ans: 0 }, { label: "a₂₃ =", ans: 4 }],
      hint: R`Συντελεστές των $x, y, z$ σε κάθε συνιστώσα.`, sol: R`$A = \begin{pmatrix}2 & -1 & 3 \\ 1 & 0 & 4\end{pmatrix}$, με στήλες $T(e_1) = (2,1)$, $T(e_2) = (-1, 0)$, $T(e_3) = (3, 4)$.` },
    { level: 1, type: "fields", q: R`Η γραμμική $T:\mathbb R^2\to\mathbb R^2$ απεικονίζει το $e_1$ στο $(3, -1)$ και το $e_2$ στο $(2, 4)$. Να βρείτε το $T(4, -1)$.`, fields: [{ label: "1η =", ans: 10 }, { label: "2η =", ans: -8 }],
      hint: R`$(4, -1) = 4e_1 - e_2$.`, sol: R`$4(3, -1) - (2, 4) = (10, -8)$.` },
    { level: 2, type: "fields", q: R`Η γραμμική $T:\mathbb R^2\to\mathbb R^2$ ικανοποιεί $T(1, 1) = (3, 1)$ και $T(1, -1) = (1, 5)$. Να βρείτε τα $T(e_1)$, $T(e_2)$ και το $T(3, 2)$.`,
      fields: [{ label: "T(e₁) 1η =", ans: 2 }, { label: "T(e₁) 2η =", ans: 3 }, { label: "T(e₂) 1η =", ans: 1 }, { label: "T(e₂) 2η =", ans: -2 }, { label: "T(3,2) 1η =", ans: 8 }, { label: "T(3,2) 2η =", ans: 5 }],
      hint: R`$e_1 = \tfrac12[(1,1) + (1,-1)]$, $e_2 = \tfrac12[(1,1) - (1,-1)]$.`,
      sol: R`$T(e_1) = \tfrac12[(3,1) + (1,5)] = (2, 3)$, $T(e_2) = \tfrac12[(3,1) - (1,5)] = (1, -2)$. Άρα $T(3,2) = 3(2,3) + 2(1,-2) = (8, 5)$.` },
    { level: 1, type: "mc", q: R`Η απεικόνιση $T:\mathbb R^n \to\mathbb R^n$, $T(x) = x + b$ με $b \ne 0$, είναι γραμμική.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι δίνει η $T(0)$;`, sol: R`Λάθος: $T(0) = b \ne 0$, ενώ κάθε γραμμική απεικόνιση στέλνει το $0$ στο $0$.` },
    { level: 1, type: "fields", q: R`Η παράγωγος $D: P_2 \to P_1$, $D(p) = p'$, είναι γραμμική. Αν $D(3x^2 - 2x + 5) = \alpha x + \beta$, να βρείτε τα $\alpha, \beta$.`, fields: [{ label: "α =", ans: 6 }, { label: "β =", ans: -2 }],
      hint: R`Παραγώγιση όρο προς όρο.`, sol: R`$D(3x^2 - 2x + 5) = 6x - 2$.` },
    { level: 2, type: "mc", q: R`Η $f:\mathbb R^2\to\mathbb R$, $f(x, y) = xy$:`, options: ["δεν είναι γραμμική, π.χ. $f(2\\cdot(1,1)) = 4 \\ne 2f(1,1)$", "είναι γραμμική", "είναι γραμμική γιατί $f(0, 0) = 0$", "δεν είναι γραμμική γιατί $f(0, 0) \\ne 0$"], correct: 0,
      hint: R`Η $f(0) = 0$ είναι αναγκαία, όχι ικανή συνθήκη.`, sol: R`$f(2, 2) = 4$ ενώ $2f(1, 1) = 2$: παραβιάζεται η $f(\lambda u) = \lambda f(u)$, άρα δεν είναι γραμμική (παρότι $f(0,0) = 0$).` },
    { level: 2, type: "fields", q: R`Για ποιες τιμές του $\kappa$ είναι γραμμική η $T(x, y) = \big(\kappa x + y,\ (\kappa^2 - 1) + 2y\big)$; (Δώστε πρώτα τη μικρότερη.)`, fields: [{ label: "κ₁ =", ans: -1 }, { label: "κ₂ =", ans: 1 }],
      hint: R`Χρειάζεται $T(0, 0) = (0, 0)$.`, sol: R`$T(0,0) = (0, \kappa^2 - 1)$, άρα πρέπει $\kappa^2 = 1$. Τότε $T(x, y) = (\kappa x + y, 2y)$ που είναι γραμμική. $\kappa = \pm 1$.` },
    { level: 3, type: "fields", q: R`Η γραμμική $T:\mathbb R^3\to\mathbb R^3$ έχει $T(e_1) = (1, 0, 1)$, $T(e_2) = (0, 2, 1)$, $T(e_3) = (1, 1, 0)$. Να βρείτε το $T(2, -1, 3)$.`,
      fields: [{ label: "1η =", ans: 5 }, { label: "2η =", ans: 1 }, { label: "3η =", ans: 1 }], hint: R`$2T(e_1) - T(e_2) + 3T(e_3)$.`, sol: R`$(2, 0, 2) - (0, 2, 1) + (3, 3, 0) = (5, 1, 1)$.` },
    { level: 2, type: "mc", q: R`Ποια από τις απεικονίσεις $M_2(\mathbb R)\to\mathbb R$ είναι γραμμική;`, options: ["το ίχνος $A\\mapsto a_{11} + a_{22}$", "η ορίζουσα $A\\mapsto\\det A$", "και οι δύο", "καμία"], correct: 0,
      hint: R`Σύγκρινε $\det(2A)$ με $2\det A$.`, sol: R`Το ίχνος είναι γραμμικό. Η ορίζουσα όχι: $\det(2I_2) = 4 \ne 2\det I_2$.` }
  ]
},
/* ───────────────────────────── 7.2 ───────────────────────────── */
{
  id: "7.2", unit: 7, title: "Πυρήνας και εικόνα γραμμικής απεικόνισης",
  book: "Σημειώσεις Γεωργίου Κεφ. 7 §7.3–7.4 · Ασκήσεις 5, 7",
  theory: R`
<div class="tbox"><h4>Πυρήνας και εικόνα</h4>
<p>Για γραμμική $f: V\to W$: <b>πυρήνας</b> $\ker f = \{v\in V: f(v) = 0\}$ (υπόχωρος του $V$) και <b>εικόνα</b> $\operatorname{Im} f = \{f(v): v\in V\}$ (υπόχωρος του $W$). Για $f(X) = AX$: ο $\ker f$ είναι ο χώρος λύσεων του ομογενούς $AX = 0$ και η $\operatorname{Im} f$ ο χώρος που παράγουν οι στήλες του $A$· $\dim\operatorname{Im} f = $ βαθμός του $A$.</p></div>
<div class="tbox"><h4>Θεώρημα διάστασης</h4>
$$\dim\ker f + \dim\operatorname{Im} f = \dim V.$$
<p>Η $f$ είναι <b>1–1</b> $\iff \ker f = \{0\}$· <b>επί</b> $\iff \operatorname{Im} f = W$. Αν $\dim V = \dim W = n$, τότε 1–1 $\iff$ επί $\iff$ ισομορφισμός· για $f(X) = AX$ με $A$ τετραγωνικό, $\iff \det A \ne 0$.</p></div>
<div class="tbox tip"><h4>Παράδειγμα</h4>
<p>$A = \begin{pmatrix}1 & 2 & 0 & -1 \\ 2 & 4 & 1 & 1\end{pmatrix} \sim \begin{pmatrix}1 & 2 & 0 & -1 \\ 0 & 0 & 1 & 3\end{pmatrix}$: βαθμός 2, οπότε $\dim\operatorname{Im} = 2$ (επί του $\mathbb R^2$) και $\dim\ker = 4 - 2 = 2$, με βάση $\{(-2, 1, 0, 0),\ (1, 0, -3, 1)\}$ (ελεύθερες μεταβλητές $x_2, x_4$).</p></div>
<div class="tbox warn"><h4>Γρήγοροι έλεγχοι</h4><p>Αν $\dim V > \dim W$, η $f$ <b>δεν</b> μπορεί να είναι 1–1· αν $\dim V < \dim W$, <b>δεν</b> μπορεί να είναι επί.</p></div>`,
  widget: "l4map",
  gen: "l4ker",
  exercises: [
    { level: 1, type: "fields", q: R`Για την $T:\mathbb R^3\to\mathbb R^2$, $T(X) = AX$ με $A = \begin{pmatrix}1 & 2 & -1 \\ 0 & 1 & 3\end{pmatrix}$, να βρείτε $\dim\operatorname{Im}T$ και $\dim\ker T$.`, fields: [{ label: "dim Im =", ans: 2 }, { label: "dim ker =", ans: 1 }],
      hint: R`Ο $A$ είναι ήδη κλιμακωτός.`, sol: R`Δύο οδηγά στοιχεία: βαθμός 2, άρα $\dim\operatorname{Im} = 2$ και $\dim\ker = 3 - 2 = 1$.` },
    { level: 1, type: "mc", q: R`Η $T:\mathbb R^3\to\mathbb R^2$, $T(X) = AX$ με $A = \begin{pmatrix}1 & 2 & -1 \\ 0 & 1 & 3\end{pmatrix}$ είναι:`, options: ["επί αλλά όχι 1–1", "1–1 αλλά όχι επί", "ισομορφισμός", "ούτε 1–1 ούτε επί"], correct: 0,
      hint: R`$\dim\operatorname{Im} = \dim\mathbb R^2$; $\ker = \{0\}$;`, sol: R`$\operatorname{Im}T = \mathbb R^2$ (επί), αλλά $\dim\ker = 1$ (όχι 1–1).` },
    { level: 2, type: "fields", q: R`Για $A = \begin{pmatrix}1 & 2 & 0 & -1 \\ 2 & 4 & 1 & 1\end{pmatrix}$ να βρείτε $\dim\ker A$ και το διάνυσμα του πυρήνα με $x_2 = 0$, $x_4 = 1$ (δώστε $x_1$ και $x_3$).`, fields: [{ label: "dim ker =", ans: 2 }, { label: "x₁ =", ans: 1 }, { label: "x₃ =", ans: -3 }],
      hint: R`Ανηγμένη μορφή: $x_1 = -2x_2 + x_4$, $x_3 = -3x_4$.`, sol: R`Από $\begin{pmatrix}1 & 2 & 0 & -1 \\ 0 & 0 & 1 & 3\end{pmatrix}$: $x_1 = -2x_2 + x_4$, $x_3 = -3x_4$. Δύο ελεύθερες, $\dim\ker = 2$. Για $x_2 = 0, x_4 = 1$: $(1, 0, -3, 1)$.` },
    { level: 1, type: "mc", q: R`Μια γραμμική απεικόνιση $T:\mathbb R^4\to\mathbb R^3$:`, options: ["δεν μπορεί να είναι 1–1", "δεν μπορεί να είναι επί", "είναι πάντα επί", "είναι πάντα 1–1"], correct: 0,
      hint: R`Θεώρημα διάστασης: $\dim\ker = 4 - \dim\operatorname{Im} \ge 1$.`, sol: R`$\dim\operatorname{Im} \le 3$, άρα $\dim\ker \ge 1$: ποτέ 1–1. Μπορεί όμως να είναι επί.` },
    { level: 1, type: "mc", q: R`Η $T(X) = AX$ με $A = \begin{pmatrix}1 & 2 & 3 \\ 0 & 1 & 4 \\ 5 & 6 & 0\end{pmatrix}$ ($\det A = 1$) είναι:`, options: ["ισομορφισμός του $\\mathbb R^3$", "1–1 αλλά όχι επί", "επί αλλά όχι 1–1", "ούτε 1–1 ούτε επί"], correct: 0,
      hint: R`Τετραγωνικός με $\det \ne 0$.`, sol: R`$\det A \ne 0 \Rightarrow \ker = \{0\}$ και $\operatorname{Im} = \mathbb R^3$: ισομορφισμός.` },
    { level: 2, type: "fields", q: R`Έστω $T(X) = AX$ με $A = \begin{pmatrix}1 & 1 \\ 1 & 2 \\ 2 & 3\end{pmatrix}$. Το $b = (3, 4, 7)$ ανήκει στην $\operatorname{Im}T$· να βρείτε το $X = (x_1, x_2)$ με $AX = b$.`, fields: [{ label: "x₁ =", ans: 2 }, { label: "x₂ =", ans: 1 }],
      hint: R`Λύσε τις δύο πρώτες εξισώσεις και έλεγξε την τρίτη.`, sol: R`$x_1 + x_2 = 3$, $x_1 + 2x_2 = 4 \Rightarrow x_2 = 1, x_1 = 2$· έλεγχος $2\cdot 2 + 3\cdot 1 = 7$ ✓.` },
    { level: 2, type: "mc", q: R`Για τον ίδιο $A$, το $c = (1, 1, 1)$:`, options: ["δεν ανήκει στην $\\operatorname{Im}T$", "ανήκει στην $\\operatorname{Im}T$", "είναι γραμμικός συνδυασμός της 1ης στήλης μόνο"], correct: 0,
      hint: R`Από τις δύο πρώτες: $x_2 = 0$, $x_1 = 1$.`, sol: R`$x_1 = 1, x_2 = 0$ δίνει τρίτη συνιστώσα $2 \ne 1$: το σύστημα είναι αδύνατο, άρα $c\notin\operatorname{Im}T$.` },
    { level: 1, type: "fields", q: R`Η $T:\mathbb R^5\to\mathbb R^3$ είναι επί. Πόση είναι η διάσταση του πυρήνα της;`, fields: [{ label: "dim ker =", ans: 2 }], hint: R`Θεώρημα διάστασης.`, sol: R`$\dim\ker = 5 - 3 = 2$.` },
    { level: 3, type: "fields", q: R`Για ποιες τιμές του $k$ η $T(X) = AX$ με $A = \begin{pmatrix}1 & 2 & 1 \\ 2 & k & 2 \\ 1 & 2 & k\end{pmatrix}$ <b>δεν</b> είναι ισομορφισμός; Για τη μεγαλύτερη από αυτές, να βρείτε $\dim\ker T$.`,
      fields: [{ label: "k₁ =", ans: 1 }, { label: "k₂ =", ans: 4 }, { label: "dim ker (k₂) =", ans: 1 }], hint: R`$\det A = k^2 - 5k + 4$.`,
      sol: R`$\det A = (k - 1)(k - 4) = 0 \iff k = 1, 4$. Για $k = 4$: $\begin{pmatrix}1 & 2 & 1 \\ 2 & 4 & 2 \\ 1 & 2 & 4\end{pmatrix}$ έχει βαθμό 2 ($\Gamma_2 = 2\Gamma_1$), άρα $\dim\ker = 1$.` },
    { level: 2, type: "fields", q: R`Για την παράγωγο $D: P_3\to P_3$ (πολυώνυμα βαθμού $\le 3$) να βρείτε $\dim\ker D$ και $\dim\operatorname{Im}D$.`, fields: [{ label: "dim ker =", ans: 1 }, { label: "dim Im =", ans: 3 }],
      hint: R`Πυρήνας: τα σταθερά πολυώνυμα.`, sol: R`$\ker D$ = σταθερά ($\dim 1$), $\operatorname{Im}D = P_2$ ($\dim 3$): $1 + 3 = 4 = \dim P_3$.` }
  ]
},
/* ───────────────────────────── 7.3 ───────────────────────────── */
{
  id: "7.3", unit: 7, title: "Πίνακας γραμμικής απεικόνισης – Σύνθεση – Αλλαγή βάσης",
  book: "Σημειώσεις Γεωργίου Κεφ. 7 §7.2.1, §7.4 · Ασκήσεις 7",
  theory: R`
<div class="tbox"><h4>Πίνακας ως προς βάσεις</h4>
<p>Έστω $f: V\to W$ γραμμική, $B = \{v_1, \dots, v_n\}$ βάση του $V$ και $C = \{w_1, \dots, w_m\}$ βάση του $W$. Ο πίνακας $[f]_{C,B}$ είναι ο $m\times n$ πίνακας του οποίου η $j$ στήλη είναι οι <b>συντεταγμένες του $f(v_j)$ ως προς τη $C$</b>. Τότε $[f(v)]_C = [f]_{C,B}\,[v]_B$.</p></div>
<div class="tbox"><h4>Σύνθεση</h4><p>Ο πίνακας της σύνθεσης είναι το γινόμενο των πινάκων: $[g\circ f] = [g]\,[f]$ (πρώτα εφαρμόζεται η $f$ — η σειρά μετράει).</p></div>
<div class="tbox"><h4>Αλλαγή βάσης – όμοιοι πίνακες</h4>
<p>Αν $A$ ο πίνακας της $T:\mathbb R^n\to\mathbb R^n$ στην κανονική βάση και $P = [\,b_1\ \cdots\ b_n\,]$ ο πίνακας με στήλες τα διανύσματα μιας νέας βάσης $B$, τότε $[T]_B = P^{-1}AP$. Πίνακες $A, A' = P^{-1}AP$, όπου $P$ αντιστρέψιμος, λέγονται <b>όμοιοι</b>· έχουν ίδια ορίζουσα, ίδιο ίχνος (και ίδιο χαρακτηριστικό πολυώνυμο).</p></div>
<div class="tbox tip"><h4>Παράδειγμα</h4><p>$A = \begin{pmatrix}4 & 1 \\ 2 & 3\end{pmatrix}$, $B = \{(1, -2), (1, 1)\}$: $A(1,-2) = (2, -4) = 2(1,-2)$ και $A(1,1) = (5,5) = 5(1,1)$, άρα $[T]_B = \begin{pmatrix}2 & 0 \\ 0 & 5\end{pmatrix}$ — διαγώνιος.</p></div>`,
  widget: "l4basis",
  gen: "l4mat",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε τον κανονικό πίνακα της $T(x, y) = (x + 2y,\ 3x - y)$ (κατά γραμμές).`, fields: [{ label: "a₁₁ =", ans: 1 }, { label: "a₁₂ =", ans: 2 }, { label: "a₂₁ =", ans: 3 }, { label: "a₂₂ =", ans: -1 }],
      hint: R`Στήλες $T(e_1), T(e_2)$.`, sol: R`$T(e_1) = (1, 3)$, $T(e_2) = (2, -1)$: $\begin{pmatrix}1 & 2 \\ 3 & -1\end{pmatrix}$.` },
    { level: 2, type: "fields", q: R`Για την ίδια $T$ να βρείτε τον πίνακα $[T]_B$ ως προς τη βάση $B = \{(1, 1), (1, -1)\}$ (και στο πεδίο ορισμού και στο πεδίο τιμών), κατά γραμμές.`,
      fields: [{ label: "b₁₁ =", ans: "5/2" }, { label: "b₁₂ =", ans: "3/2" }, { label: "b₂₁ =", ans: "1/2" }, { label: "b₂₂ =", ans: "-5/2" }],
      hint: R`Γράψε $T(1,1)$ και $T(1,-1)$ ως $\alpha(1,1) + \beta(1,-1)$.`,
      sol: R`$T(1,1) = (3, 2) = \tfrac52(1,1) + \tfrac12(1,-1)$ και $T(1,-1) = (-1, 4) = \tfrac32(1,1) - \tfrac52(1,-1)$. Άρα $[T]_B = \begin{pmatrix}5/2 & 3/2 \\ 1/2 & -5/2\end{pmatrix}$ (ίχνος $0$, ορίζουσα $-7$, όπως ο κανονικός).` },
    { level: 1, type: "fields", q: R`$S(x, y) = (y, x)$ και $T(x, y) = (2x, x + y)$. Να βρείτε τον πίνακα της $T\circ S$ (κατά γραμμές) και το $(T\circ S)(1, 3)$.`,
      fields: [{ label: "c₁₁ =", ans: 0 }, { label: "c₁₂ =", ans: 2 }, { label: "c₂₁ =", ans: 1 }, { label: "c₂₂ =", ans: 1 }, { label: "(T∘S)(1,3) 1η =", ans: 6 }, { label: "2η =", ans: 4 }],
      hint: R`$[T\circ S] = [T][S]$.`, sol: R`$\begin{pmatrix}2 & 0 \\ 1 & 1\end{pmatrix}\begin{pmatrix}0 & 1 \\ 1 & 0\end{pmatrix} = \begin{pmatrix}0 & 2 \\ 1 & 1\end{pmatrix}$, και $(T\circ S)(1,3) = T(3, 1) = (6, 4)$.` },
    { level: 2, type: "fields", q: R`Η $D: P_2\to P_2$, $D(p) = p'$, ως προς τη βάση $\{1, x, x^2\}$ έχει πίνακα $3\times 3$. Να δώσετε τα στοιχεία $d_{12}$, $d_{23}$ και τον βαθμό του πίνακα.`, fields: [{ label: "d₁₂ =", ans: 1 }, { label: "d₂₃ =", ans: 2 }, { label: "βαθμός =", ans: 2 }],
      hint: R`$D(1) = 0$, $D(x) = 1$, $D(x^2) = 2x$: αυτές είναι οι στήλες.`, sol: R`$[D] = \begin{pmatrix}0 & 1 & 0 \\ 0 & 0 & 2 \\ 0 & 0 & 0\end{pmatrix}$: $d_{12} = 1$, $d_{23} = 2$, βαθμός $2$.` },
    { level: 2, type: "fields", q: R`Για $A = \begin{pmatrix}1 & 2 \\ 3 & 4\end{pmatrix}$ και $P = \begin{pmatrix}1 & 1 \\ 0 & 1\end{pmatrix}$ να υπολογίσετε τον $P^{-1}AP$ (κατά γραμμές).`,
      fields: [{ label: "(1,1) =", ans: -2 }, { label: "(1,2) =", ans: -4 }, { label: "(2,1) =", ans: 3 }, { label: "(2,2) =", ans: 7 }], hint: R`$P^{-1} = \begin{pmatrix}1 & -1 \\ 0 & 1\end{pmatrix}$.`,
      sol: R`$AP = \begin{pmatrix}1 & 3 \\ 3 & 7\end{pmatrix}$, $P^{-1}AP = \begin{pmatrix}-2 & -4 \\ 3 & 7\end{pmatrix}$ (ίχνος $5$, ορίζουσα $-2$, όπως ο $A$).` },
    { level: 1, type: "mc", q: R`Δύο όμοιοι πίνακες $A$ και $P^{-1}AP$ έχουν πάντα:`, options: ["ίδια ορίζουσα και ίδιο ίχνος", "ίδια στοιχεία", "ίδιες στήλες", "ίδια ιδιοδιανύσματα"], correct: 0,
      hint: R`$\det(P^{-1}AP) = \det A$.`, sol: R`$\det(P^{-1}AP) = \det P^{-1}\det A\det P = \det A$ και $\operatorname{tr}(P^{-1}AP) = \operatorname{tr}A$. Έχουν επίσης ίδιες ιδιοτιμές. Τα ιδιοδιανύσματα όμως γενικά αλλάζουν: αν $A\mathbf v = \lambda\mathbf v$ τότε $(P^{-1}AP)(P^{-1}\mathbf v) = \lambda P^{-1}\mathbf v$.` },
    { level: 3, type: "fields", q: R`Η $T:\mathbb R^3\to\mathbb R^2$, $T(x, y, z) = (x + y,\ y - z)$. Να βρείτε τον πίνακα $[T]_{C,B}$ ως προς $B = \{(1,0,0), (1,1,0), (1,1,1)\}$ και $C = \{(1, 0), (1, 1)\}$ (κατά γραμμές).`,
      fields: [{ label: "(1,1) =", ans: 1 }, { label: "(1,2) =", ans: 1 }, { label: "(1,3) =", ans: 2 }, { label: "(2,1) =", ans: 0 }, { label: "(2,2) =", ans: 1 }, { label: "(2,3) =", ans: 0 }],
      hint: R`$(a, b) = (a - b)(1, 0) + b(1, 1)$.`, sol: R`$T(1,0,0) = (1, 0) \to (1, 0)$, $T(1,1,0) = (2, 1) \to (1, 1)$, $T(1,1,1) = (2, 0) \to (2, 0)$ σε συντεταγμένες $C$. Άρα $\begin{pmatrix}1 & 1 & 2 \\ 0 & 1 & 0\end{pmatrix}$.` },
    { level: 3, type: "fields", q: R`Η $T$ έχει κανονικό πίνακα $A = \begin{pmatrix}4 & 1 \\ 2 & 3\end{pmatrix}$. Να βρείτε τον $[T]_B$ ως προς $B = \{(1, -2), (1, 1)\}$ (κατά γραμμές).`,
      fields: [{ label: "(1,1) =", ans: 2 }, { label: "(1,2) =", ans: 0 }, { label: "(2,1) =", ans: 0 }, { label: "(2,2) =", ans: 5 }], hint: R`Υπολόγισε $A(1,-2)$ και $A(1,1)$.`,
      sol: R`$A(1,-2) = (2,-4) = 2(1,-2)$, $A(1,1) = (5, 5) = 5(1,1)$: $[T]_B = \begin{pmatrix}2 & 0 \\ 0 & 5\end{pmatrix}$. Τα διανύσματα της $B$ είναι ιδιοδιανύσματα (Κεφ. 9).` },
    { level: 1, type: "mc", q: R`Ο πίνακας μιας γραμμικής απεικόνισης δεν εξαρτάται από τις βάσεις που επιλέγουμε.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Δες την άσκηση με τη βάση $\{(1,1),(1,-1)\}$.`, sol: R`Λάθος: αλλάζοντας βάσεις αλλάζει ο πίνακας (σε όμοιο πίνακα, όταν $V = W$ με την ίδια βάση).` }
  ]
},
/* ───────────────────────────── 7.4 ───────────────────────────── */
{
  id: "7.4", unit: 7, title: "Γεωμετρικοί μετασχηματισμοί του επιπέδου",
  book: "Σημειώσεις Γεωργίου Κεφ. 7 §7.4 · Ασκήσεις 5, 8, 10",
  theory: R`
<div class="tbox"><h4>Βασικοί πίνακες</h4>
<ul><li><b>Στροφή</b> κατά γωνία $\theta$ (αριστερόστροφα): $R_\theta = \begin{pmatrix}\cos\theta & -\sin\theta \\ \sin\theta & \cos\theta\end{pmatrix}$, $\det = 1$, $R_\theta R_\varphi = R_{\theta + \varphi}$.</li>
<li><b>Ανάκλαση</b> ως προς ευθεία από την αρχή με γωνία $\varphi$: $\begin{pmatrix}\cos 2\varphi & \sin 2\varphi \\ \sin 2\varphi & -\cos 2\varphi\end{pmatrix}$, $\det = -1$. Ειδικά: άξονας $x'x$: $\begin{pmatrix}1 & 0 \\ 0 & -1\end{pmatrix}$, ευθεία $y = x$: $\begin{pmatrix}0 & 1 \\ 1 & 0\end{pmatrix}$.</li>
<li><b>Ορθή προβολή</b> σε ευθεία γωνίας $\varphi$: $\begin{pmatrix}\cos^2\varphi & \sin\varphi\cos\varphi \\ \sin\varphi\cos\varphi & \sin^2\varphi\end{pmatrix}$, $\det = 0$ (μη αντιστρέψιμη).</li>
<li><b>Διάτμηση</b>: $\begin{pmatrix}1 & \kappa \\ 0 & 1\end{pmatrix}$ (οριζόντια), $\det = 1$· <b>ομοιοθεσία</b>: $\lambda I$, $\det = \lambda^2$.</li></ul></div>
<div class="tbox"><h4>Σύνθεση</h4><p>Η εφαρμογή πρώτα της $S$ και μετά της $T$ έχει πίνακα $[T][S]$. Π.χ. στροφή κατά $90^\circ$ και μετά ανάκλαση ως προς $x'x$: $\begin{pmatrix}1 & 0 \\ 0 & -1\end{pmatrix}\begin{pmatrix}0 & -1 \\ 1 & 0\end{pmatrix} = \begin{pmatrix}0 & -1 \\ -1 & 0\end{pmatrix}$, δηλαδή ανάκλαση ως προς $y = -x$.</p></div>
<div class="tbox tip"><h4>Στροφή με αλλαγή μήκους</h4><p>Ο $\begin{pmatrix}a & -b \\ b & a\end{pmatrix}$ ισούται με $r R_\varphi$ όπου $r = \sqrt{a^2 + b^2}$ και $\varphi$ η γωνία του $(a, b)$: στρέφει κατά $\varphi$ και πολλαπλασιάζει τα μήκη επί $r$.</p></div>`,
  widget: "l4geo",
  gen: "l4geo",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε την εικόνα του $(3, 1)$ μέσω της στροφής κατά $90^\circ$ γύρω από την αρχή.`, fields: [{ label: "x' =", ans: -1 }, { label: "y' =", ans: 3 }],
      hint: R`$R_{90^\circ} = \begin{pmatrix}0 & -1 \\ 1 & 0\end{pmatrix}$.`, sol: R`$(0\cdot 3 - 1\cdot 1,\ 1\cdot 3 + 0) = (-1, 3)$.` },
    { level: 2, type: "fields", q: R`Να βρείτε την εικόνα του $(\sqrt2, \sqrt2)$ μέσω της στροφής κατά $45^\circ$.`, fields: [{ label: "x' =", ans: 0 }, { label: "y' =", ans: 2 }],
      hint: R`$\cos 45^\circ = \sin 45^\circ = \tfrac{\sqrt2}{2}$.`, sol: R`$x' = \tfrac{\sqrt2}{2}\sqrt2 - \tfrac{\sqrt2}{2}\sqrt2 = 0$, $y' = 1 + 1 = 2$: το σημείο πάει στον θετικό ημιάξονα $y$ (μήκος $2$ διατηρείται).` },
    { level: 1, type: "fields", q: R`Να βρείτε την ανάκλαση του $(2, -5)$ ως προς την ευθεία $y = x$ και ως προς την $y = -x$.`, fields: [{ label: "y = x: x' =", ans: -5 }, { label: "y' =", ans: 2 }, { label: "y = −x: x' =", ans: 5 }, { label: "y' =", ans: -2 }],
      hint: R`$y = x$: εναλλαγή συντεταγμένων· $y = -x$: εναλλαγή και αλλαγή προσήμων.`, sol: R`$(-5, 2)$ και $(5, -2)$.` },
    { level: 2, type: "fields", q: R`Να βρείτε την ορθή προβολή του $(3, 1)$ στην ευθεία $y = x$.`, fields: [{ label: "x' =", ans: 2 }, { label: "y' =", ans: 2 }],
      hint: R`$\varphi = 45^\circ$: πίνακας $\tfrac12\begin{pmatrix}1 & 1 \\ 1 & 1\end{pmatrix}$.`, sol: R`$\tfrac12(3 + 1, 3 + 1) = (2, 2)$.` },
    { level: 1, type: "fields", q: R`Σε ποιο σημείο απεικονίζει η διάτμηση $\begin{pmatrix}1 & 2 \\ 0 & 1\end{pmatrix}$ το $(1, 1)$; Πόσο είναι το εμβαδόν της εικόνας του μοναδιαίου τετραγώνου;`, fields: [{ label: "x' =", ans: 3 }, { label: "y' =", ans: 1 }, { label: "εμβαδόν =", ans: 1 }],
      hint: R`$\det = 1$.`, sol: R`$(1 + 2, 1) = (3, 1)$· εμβαδόν $|\det| = 1$ (η διάτμηση διατηρεί εμβαδά).` },
    { level: 2, type: "mc", q: R`Η σύνθεση «πρώτα στροφή κατά $90^\circ$, μετά ανάκλαση ως προς τον άξονα $x'x$» είναι:`, options: ["ανάκλαση ως προς την ευθεία $y = -x$", "ανάκλαση ως προς την ευθεία $y = x$", "στροφή κατά $-90^\\circ$", "στροφή κατά $180^\\circ$"], correct: 0,
      hint: R`Πολλαπλασίασε $\begin{pmatrix}1 & 0 \\ 0 & -1\end{pmatrix}\begin{pmatrix}0 & -1 \\ 1 & 0\end{pmatrix}$.`, sol: R`Γινόμενο $\begin{pmatrix}0 & -1 \\ -1 & 0\end{pmatrix}$: $(x, y)\mapsto(-y, -x)$, η ανάκλαση ως προς $y = -x$ (ορίζουσα $-1$).` },
    { level: 1, type: "mc", q: R`Η ορίζουσα του πίνακα κάθε ανάκλασης ως προς ευθεία που περνά από την αρχή είναι:`, options: ["$-1$", "$1$", "$0$", "εξαρτάται από την ευθεία"], correct: 0,
      hint: R`$-\cos^2 2\varphi - \sin^2 2\varphi$.`, sol: R`$-\cos^2 2\varphi - \sin^2 2\varphi = -1$: διατηρεί τα εμβαδά αλλά αντιστρέφει τον προσανατολισμό.` },
    { level: 3, type: "fields", q: R`Ο $A = \begin{pmatrix}1 & -1 \\ 1 & 1\end{pmatrix}$ γράφεται ως $rR_\varphi$. Να βρείτε το $r^2$ και τη γωνία $\varphi$ σε μοίρες.`, fields: [{ label: "r² =", ans: 2 }, { label: "φ (°) =", ans: 45 }],
      hint: R`$a = 1$, $b = 1$.`, sol: R`$r = \sqrt{1 + 1} = \sqrt2$, $\cos\varphi = \sin\varphi = \tfrac{1}{\sqrt2}$, άρα $\varphi = 45^\circ$: στροφή κατά $45^\circ$ και μεγέθυνση επί $\sqrt2$.` },
    { level: 2, type: "fields", q: R`Ποιος είναι ο μικρότερος θετικός ακέραιος $n$ με $(R_{60^\circ})^{n} = I$;`, fields: [{ label: "n =", ans: 6 }], hint: R`$(R_\theta)^n = R_{n\theta}$.`, sol: R`$R_{60n} = I \iff 60n$ πολλαπλάσιο του $360$, άρα $n = 6$.` },
    { level: 1, type: "mc", q: R`Η ορθή προβολή σε μια ευθεία του επιπέδου είναι αντιστρέψιμη γραμμική απεικόνιση.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ορίζουσα;`, sol: R`Λάθος: $\det = 0$· όλα τα σημεία μιας κάθετης στην ευθεία έχουν την ίδια προβολή (μη μηδενικός πυρήνας).` }
  ]
},
/* ───────────────────────────── 9.1 ───────────────────────────── */
{
  id: "9.1", unit: 9, title: "Ιδιοτιμές και ιδιοδιανύσματα",
  book: "Σημειώσεις Κεφ. 9 · Ασκήσεις 9",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Έστω $A$ τετραγωνικός πίνακας $n\times n$. Ο αριθμός $\lambda$ λέγεται <b>ιδιοτιμή</b> του $A$ αν υπάρχει <b>μη μηδενικό</b> διάνυσμα $\mathbf v$ με
$$A\mathbf v = \lambda\mathbf v .$$
Κάθε τέτοιο $\mathbf v \ne \mathbf 0$ λέγεται <b>ιδιοδιάνυσμα</b> του $A$ που αντιστοιχεί στην $\lambda$. Γεωμετρικά: ο $A$ απλώς «τεντώνει» (ή αντιστρέφει) το $\mathbf v$ πάνω στην ίδια ευθεία.</p></div>
<div class="tbox"><h4>Ιδιόχωρος</h4>
<p>$A\mathbf v = \lambda\mathbf v \iff (A - \lambda I)\mathbf v = \mathbf 0$. Επομένως:</p>
<ul><li>η $\lambda$ είναι ιδιοτιμή $\iff$ το ομογενές σύστημα $(A-\lambda I)\mathbf x = \mathbf 0$ έχει μη τετριμμένη λύση $\iff$ ο $A-\lambda I$ <b>δεν</b> είναι αντιστρέψιμος $\iff \det(A-\lambda I) = 0$·</li>
<li>το σύνολο $E_\lambda = N(A - \lambda I)$ (όλα τα ιδιοδιανύσματα της $\lambda$ μαζί με το $\mathbf 0$) είναι <b>υπόχωρος</b> του $\mathbb R^n$, ο <b>ιδιόχωρος</b> της $\lambda$. Μια βάση του βρίσκεται λύνοντας το ομογενές σύστημα.</li></ul></div>
<div class="tbox tip"><h4>Χρήσιμα θεωρήματα</h4>
<ul><li>Οι ιδιοτιμές ενός <b>τριγωνικού</b> (άνω ή κάτω) πίνακα είναι τα στοιχεία της κύριας διαγωνίου.</li>
<li>Το $0$ είναι ιδιοτιμή του $A$ $\iff$ ο $A$ <b>δεν</b> είναι αντιστρέψιμος.</li>
<li>Ιδιοδιανύσματα που αντιστοιχούν σε <b>διαφορετικές</b> ιδιοτιμές είναι γραμμικώς ανεξάρτητα.</li>
<li>Αν $A\mathbf v = \lambda\mathbf v$, τότε $A^k\mathbf v = \lambda^k\mathbf v$ και, αν ο $A$ είναι αντιστρέψιμος, $A^{-1}\mathbf v = \lambda^{-1}\mathbf v$.</li></ul></div>
<div class="tbox"><h4>Παράδειγμα</h4>
<p>Είναι το $\lambda = 2$ ιδιοτιμή του $A = \begin{pmatrix} 3 & 2\\ 3 & 8\end{pmatrix}$; Είναι $A - 2I = \begin{pmatrix} 1 & 2\\ 3 & 6\end{pmatrix}$ με $\det = 6 - 6 = 0$, άρα <b>ναι</b>. Από $x_1 + 2x_2 = 0$: $E_2 = \operatorname{Span}\left\{\begin{pmatrix} -2\\ 1\end{pmatrix}\right\}$. Έλεγχος: $A\begin{pmatrix} -2\\ 1\end{pmatrix} = \begin{pmatrix} -4\\ 2\end{pmatrix} = 2\begin{pmatrix} -2\\ 1\end{pmatrix}$.</p>
<p><b>Προσοχή:</b> το $\mathbf 0$ δεν είναι ποτέ ιδιοδιάνυσμα, ενώ η ιδιοτιμή $\lambda = 0$ επιτρέπεται.</p></div>`,
  widget: "l5eigen",
  gen: "l5eig",
  exercises: [
    { level: 1, type: "fields", q: R`Να δείξετε ότι το $\mathbf v = \begin{pmatrix} 1\\ 1\end{pmatrix}$ είναι ιδιοδιάνυσμα του $A = \begin{pmatrix} 4 & -1\\ 2 & 1\end{pmatrix}$ και να βρείτε την αντίστοιχη ιδιοτιμή.`,
      fields: [{ label: "λ =", ans: 3 }], hint: R`Υπολογίστε το $A\mathbf v$ και συγκρίνετε με το $\mathbf v$.`,
      sol: R`$A\mathbf v = \begin{pmatrix} 4 - 1\\ 2 + 1\end{pmatrix} = \begin{pmatrix} 3\\ 3\end{pmatrix} = 3\mathbf v$. Άρα ιδιοδιάνυσμα με $\lambda = 3$.` },
    { level: 1, type: "mc", q: R`Το $\mathbf v = \begin{pmatrix} 1\\ 2\end{pmatrix}$ είναι ιδιοδιάνυσμα του $A = \begin{pmatrix} 1 & 1\\ 3 & -1\end{pmatrix}$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Είναι το $A\mathbf v$ πολλαπλάσιο του $\mathbf v$;`,
      sol: R`$A\mathbf v = \begin{pmatrix} 3\\ 1\end{pmatrix}$, που δεν είναι πολλαπλάσιο του $\begin{pmatrix} 1\\ 2\end{pmatrix}$ ($3/1 \ne 1/2$). Λάθος.` },
    { level: 1, type: "mc", q: R`Είναι το $\lambda = 3$ ιδιοτιμή του $A = \begin{pmatrix} 1 & 2\\ 4 & 3\end{pmatrix}$;`,
      options: ["Όχι, γιατί $\\det(A - 3I) \\ne 0$", "Ναι, γιατί $\\det(A - 3I) = 0$", "Ναι, γιατί το $3$ είναι στοιχείο της διαγωνίου", "Δεν μπορούμε να το ελέγξουμε χωρίς ιδιοδιάνυσμα"], correct: 0,
      hint: R`Ελέγξτε αν ο $A - 3I$ είναι αντιστρέψιμος.`,
      sol: R`$A - 3I = \begin{pmatrix} -2 & 2\\ 4 & 0\end{pmatrix}$, $\det = 0 - 8 = -8 \ne 0$. Ο πίνακας είναι αντιστρέψιμος, άρα το $(A - 3I)\mathbf x = \mathbf 0$ έχει μόνο τη μηδενική λύση: το $3$ <b>δεν</b> είναι ιδιοτιμή. (Οι ιδιοτιμές είναι $-1$ και $5$· ο $A$ δεν είναι τριγωνικός.)` },
    { level: 2, type: "fields", q: R`Δίνεται $A = \begin{pmatrix} 5 & 0\\ 2 & 1\end{pmatrix}$ με ιδιοτιμές $1$ και $5$. Να βρείτε βάση κάθε ιδιόχωρου: για $\lambda = 1$ ένα ιδιοδιάνυσμα της μορφής $\begin{pmatrix} a\\ 1\end{pmatrix}$ και για $\lambda = 5$ της μορφής $\begin{pmatrix} b\\ 1\end{pmatrix}$.`,
      fields: [{ label: "a =", ans: 0 }, { label: "b =", ans: 2 }], hint: R`Λύστε $(A - I)\mathbf x = \mathbf 0$ και $(A - 5I)\mathbf x = \mathbf 0$.`,
      sol: R`$A - I = \begin{pmatrix} 4 & 0\\ 2 & 0\end{pmatrix} \Rightarrow x_1 = 0$: $E_1 = \operatorname{Span}\left\{\begin{pmatrix} 0\\ 1\end{pmatrix}\right\}$. $A - 5I = \begin{pmatrix} 0 & 0\\ 2 & -4\end{pmatrix} \Rightarrow x_1 = 2x_2$: $E_5 = \operatorname{Span}\left\{\begin{pmatrix} 2\\ 1\end{pmatrix}\right\}$.` },
    { level: 1, type: "fields", q: R`Να βρείτε τις ιδιοτιμές του $A = \begin{pmatrix} 2 & 5 & -1\\ 0 & -3 & 4\\ 0 & 0 & 7\end{pmatrix}$ σε αύξουσα σειρά.`,
      fields: [{ label: "λ₁ =", ans: -3 }, { label: "λ₂ =", ans: 2 }, { label: "λ₃ =", ans: 7 }], hint: R`Τριγωνικός πίνακας.`,
      sol: R`Ο $A$ είναι άνω τριγωνικός, άρα $\det(A - \lambda I) = (2-\lambda)(-3-\lambda)(7-\lambda)$ και οι ιδιοτιμές είναι τα διαγώνια στοιχεία: $-3, 2, 7$.` },
    { level: 2, type: "fields", q: R`Το $\lambda = 4$ είναι ιδιοτιμή του $A = \begin{pmatrix} 3 & 0 & -1\\ 2 & 3 & 1\\ -3 & 4 & 5\end{pmatrix}$. Να βρείτε ιδιοδιάνυσμα της μορφής $\begin{pmatrix} 1\\ b\\ c\end{pmatrix}$.`,
      fields: [{ label: "b =", ans: 1 }, { label: "c =", ans: -1 }], hint: R`Γραμμοαναγωγή του $A - 4I$.`,
      sol: R`$A - 4I = \begin{pmatrix} -1 & 0 & -1\\ 2 & -1 & 1\\ -3 & 4 & 1\end{pmatrix}$. Από την 1η γραμμή $x_3 = -x_1$, από τη 2η $x_2 = 2x_1 + x_3 = x_1$ (η 3η επαληθεύεται: $-3x_1 + 4x_1 - x_1 = 0$). Με $x_1 = 1$: $\mathbf v = (1, 1, -1)^T$. Έλεγχος: $A\mathbf v = (4, 4, -4)^T = 4\mathbf v$.` },
    { level: 2, type: "fields", q: R`Το $\lambda = 3$ είναι ιδιοτιμή του $A = \begin{pmatrix} 4 & 2 & 3\\ -1 & 1 & -3\\ 2 & 4 & 9\end{pmatrix}$. Ποια είναι η διάσταση του ιδιόχωρου $E_3$;`,
      fields: [{ label: "dim E₃ =", ans: 2 }], hint: R`$\dim E_3 = 3 - \operatorname{rank}(A - 3I)$.`,
      sol: R`$A - 3I = \begin{pmatrix} 1 & 2 & 3\\ -1 & -2 & -3\\ 2 & 4 & 6\end{pmatrix}$: όλες οι γραμμές είναι πολλαπλάσια της $(1, 2, 3)$, άρα $\operatorname{rank} = 1$ και $\dim E_3 = 3 - 1 = 2$. Βάση: $\{(-2, 1, 0)^T, (-3, 0, 1)^T\}$ (ελεύθερες μεταβλητές $x_2, x_3$).` },
    { level: 2, type: "mc", q: R`Ο $A$ είναι αντιστρέψιμος και έχει ιδιοτιμή $\lambda = 4$ με ιδιοδιάνυσμα $\mathbf v$. Ποια πρόταση ισχύει;`,
      options: ["$A^{-1}\\mathbf v = \\frac14\\mathbf v$", "$A^{-1}\\mathbf v = -4\\mathbf v$", "$A^{-1}\\mathbf v = 4\\mathbf v$", "Το $\\mathbf v$ δεν είναι ιδιοδιάνυσμα του $A^{-1}$"], correct: 0,
      hint: R`Πολλαπλασιάστε την $A\mathbf v = 4\mathbf v$ από αριστερά με $A^{-1}$.`,
      sol: R`$\mathbf v = A^{-1}A\mathbf v = 4A^{-1}\mathbf v \Rightarrow A^{-1}\mathbf v = \frac14\mathbf v$. Γενικά οι ιδιοτιμές του $A^{-1}$ είναι οι $1/\lambda$ (με τα ίδια ιδιοδιανύσματα).` },
    { level: 1, type: "mc", q: R`Το $0$ είναι ιδιοτιμή ενός τετραγωνικού πίνακα $A$ αν και μόνο αν ο $A$ δεν είναι αντιστρέψιμος.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`$\det(A - 0I) = \det A$.`,
      sol: R`Σωστό: το $0$ είναι ιδιοτιμή $\iff A\mathbf x = \mathbf 0$ έχει μη μηδενική λύση $\iff \det A = 0$.` },
    { level: 3, type: "fields", q: R`Ο $A$ έχει ιδιοδιάνυσμα $\mathbf v$ με ιδιοτιμή $\lambda = 4$. Αν $(A^2 - 3A + 2I)\mathbf v = \mu\mathbf v$, να βρείτε το $\mu$.`,
      fields: [{ label: "μ =", ans: 6 }], hint: R`$A^2\mathbf v = \lambda^2\mathbf v$.`,
      sol: R`$(A^2 - 3A + 2I)\mathbf v = (\lambda^2 - 3\lambda + 2)\mathbf v = (16 - 12 + 2)\mathbf v = 6\mathbf v$. Γενικά, αν $p$ πολυώνυμο, το $\mathbf v$ είναι ιδιοδιάνυσμα του $p(A)$ με ιδιοτιμή $p(\lambda)$.` }
  ]
},
/* ───────────────────────────── 9.2 ───────────────────────────── */
{
  id: "9.2", unit: 9, title: "Χαρακτηριστικό πολυώνυμο",
  book: "Σημειώσεις Κεφ. 9 · Ασκήσεις 9",
  theory: R`
<div class="tbox"><h4>Χαρακτηριστικό πολυώνυμο</h4>
<p>Το $p_A(\lambda) = \det(A - \lambda I)$ είναι πολυώνυμο βαθμού $n$ ως προς $\lambda$, το <b>χαρακτηριστικό πολυώνυμο</b> του $A$. Οι ιδιοτιμές του $A$ είναι ακριβώς οι ρίζες της <b>χαρακτηριστικής εξίσωσης</b> $\det(A - \lambda I) = 0$.</p>
<p>Για $2\times 2$: $\ A = \begin{pmatrix} a & b\\ c & d\end{pmatrix} \Rightarrow p_A(\lambda) = \lambda^2 - (a + d)\lambda + (ad - bc) = \lambda^2 - \operatorname{tr}(A)\,\lambda + \det A$.</p></div>
<div class="tbox"><h4>Ίχνος και ορίζουσα</h4>
<p>Αν $\lambda_1, \dots, \lambda_n$ είναι οι ιδιοτιμές (μετρημένες με πολλαπλότητα, ενδεχομένως μιγαδικές), τότε
$$\lambda_1 + \dots + \lambda_n = \operatorname{tr}(A), \qquad \lambda_1\cdots\lambda_n = \det A .$$</p></div>
<div class="tbox"><h4>Πολλαπλότητες</h4>
<ul><li><b>Αλγεβρική πολλαπλότητα</b> $\pi(\lambda)$: πόσες φορές η $\lambda$ είναι ρίζα του $p_A$.</li>
<li><b>Γεωμετρική πολλαπλότητα</b> $\gamma(\lambda) = \dim E_\lambda = n - \operatorname{rank}(A - \lambda I)$.</li>
<li>Ισχύει πάντα $1 \le \gamma(\lambda) \le \pi(\lambda)$.</li></ul>
<p>Π.χ. $A = \begin{pmatrix} 2 & 1\\ 0 & 2\end{pmatrix}$: $p_A = (2 - \lambda)^2$, $\pi(2) = 2$, αλλά $A - 2I = \begin{pmatrix} 0 & 1\\ 0 & 0\end{pmatrix}$ έχει βαθμό $1$, άρα $\gamma(2) = 1$.</p></div>
<div class="tbox tip"><h4>Πρακτικές συμβουλές</h4>
<ul><li>Για $3\times 3$ αναπτύξτε την ορίζουσα κατά γραμμή/στήλη με πολλά μηδενικά και κρατήστε τους παράγοντες $(\lambda_0 - \lambda)$ που εμφανίζονται — μη «ανοίγετε» άσκοπα το πολυώνυμο.</li>
<li>Ακέραιες ρίζες πολυωνύμου με ακέραιους συντελεστές διαιρούν τον σταθερό όρο ($=\det A$).</li>
<li>Οι $A$ και $A^T$ έχουν το ίδιο χαρακτηριστικό πολυώνυμο ($\det(A^T - \lambda I) = \det\big((A - \lambda I)^T\big) = \det(A - \lambda I)$).</li></ul></div>`,
  widget: "l5eigen",
  gen: "l5char",
  exercises: [
    { level: 1, type: "fields", q: R`Το χαρακτηριστικό πολυώνυμο του $A = \begin{pmatrix} 2 & 7\\ 7 & 2\end{pmatrix}$ είναι $\lambda^2 + p\lambda + q$. Να βρείτε τα $p, q$ και τις ιδιοτιμές.`,
      fields: [{ label: "p =", ans: -4 }, { label: "q =", ans: -45 }, { label: "λ₁ (μικρότερη) =", ans: -5 }, { label: "λ₂ =", ans: 9 }],
      hint: R`$\lambda^2 - \operatorname{tr}(A)\lambda + \det A$.`,
      sol: R`$\operatorname{tr} A = 4$, $\det A = 4 - 49 = -45$: $\lambda^2 - 4\lambda - 45 = (\lambda - 9)(\lambda + 5)$. Ιδιοτιμές $-5, 9$.` },
    { level: 1, type: "fields", q: R`Να βρείτε το χαρακτηριστικό πολυώνυμο $\lambda^2 + p\lambda + q$ του $A = \begin{pmatrix} 3 & -2\\ 1 & -1\end{pmatrix}$.`,
      fields: [{ label: "p =", ans: -2 }, { label: "q =", ans: -1 }], hint: R`Ίχνος $2$, ορίζουσα $-3 + 2$.`,
      sol: R`$\operatorname{tr}A = 2$, $\det A = -3 - (-2) = -1$: $p_A(\lambda) = \lambda^2 - 2\lambda - 1$ (ιδιοτιμές $1 \pm \sqrt 2$).` },
    { level: 2, type: "fields", q: R`Το χαρακτηριστικό πολυώνυμο του $A = \begin{pmatrix} 4 & 0 & 0\\ 5 & 3 & 2\\ -2 & 0 & 2\end{pmatrix}$ είναι $-\lambda^3 + 9\lambda^2 - 26\lambda + 24$. Να βρείτε τις ιδιοτιμές σε αύξουσα σειρά.`,
      fields: [{ label: "λ₁ =", ans: 2 }, { label: "λ₂ =", ans: 3 }, { label: "λ₃ =", ans: 4 }], hint: R`Αναπτύξτε την $\det(A - \lambda I)$ κατά την 1η γραμμή.`,
      sol: R`$\det(A - \lambda I) = (4 - \lambda)\det\begin{pmatrix} 3-\lambda & 2\\ 0 & 2-\lambda\end{pmatrix} = (4-\lambda)(3-\lambda)(2-\lambda)$. Ιδιοτιμές $2, 3, 4$ (άθροισμα $9 = \operatorname{tr}A$ ✓, γινόμενο $24 = \det A$ ✓).` },
    { level: 1, type: "fields", q: R`Ένας $2\times 2$ πίνακας έχει ίχνος $7$ και ορίζουσα $10$. Να βρείτε τις ιδιοτιμές του.`,
      fields: [{ label: "λ₁ (μικρότερη) =", ans: 2 }, { label: "λ₂ =", ans: 5 }], hint: R`$\lambda^2 - 7\lambda + 10 = 0$.`,
      sol: R`$\lambda^2 - 7\lambda + 10 = (\lambda - 2)(\lambda - 5)$: $\lambda = 2, 5$.` },
    { level: 2, type: "fields", q: R`Ο πίνακας $\begin{pmatrix} 3 & 0 & 0 & 0 & 0\\ -5 & 1 & 0 & 0 & 0\\ 3 & 8 & 0 & 0 & 0\\ 0 & -7 & 2 & 1 & 0\\ -4 & 1 & 9 & -2 & 3\end{pmatrix}$ είναι κάτω τριγωνικός. Να βρείτε τις αλγεβρικές πολλαπλότητες των ιδιοτιμών $0$, $1$ και $3$.`,
      fields: [{ label: "π(0) =", ans: 1 }, { label: "π(1) =", ans: 2 }, { label: "π(3) =", ans: 2 }], hint: R`Διαβάστε τη διαγώνιο.`,
      sol: R`Διαγώνιος: $3, 1, 0, 1, 3$, άρα $p_A(\lambda) = -\lambda(1 - \lambda)^2(3 - \lambda)^2$: $\pi(0) = 1$, $\pi(1) = 2$, $\pi(3) = 2$.` },
    { level: 3, type: "fields", q: R`Δίνεται $A = \begin{pmatrix} 3 & -2 & -2\\ 2 & -2 & -4\\ -1 & 2 & 4\end{pmatrix}$ με ιδιοτιμές $\lambda_1 = 1$ ($\pi = 1$) και $\lambda_2 = 2$ ($\pi = 2$). Να βρείτε τον βαθμό του $A - 2I$ και τη γεωμετρική πολλαπλότητα $\gamma(2)$.`,
      fields: [{ label: "rank(A − 2I) =", ans: 1 }, { label: "γ(2) =", ans: 2 }], hint: R`Γράψτε τον $A - 2I$ και συγκρίνετε τις γραμμές του.`,
      sol: R`$A - 2I = \begin{pmatrix} 1 & -2 & -2\\ 2 & -4 & -4\\ -1 & 2 & 2\end{pmatrix}$: όλες οι γραμμές πολλαπλάσια της $(1, -2, -2)$, βαθμός $1$, άρα $\gamma(2) = 3 - 1 = 2$ και $E_2 = \operatorname{Span}\{(2, 1, 0)^T, (2, 0, 1)^T\}$. Αφού $\gamma = \pi$ για κάθε ιδιοτιμή, ο $A$ θα είναι διαγωνιοποιήσιμος (§9.3).` },
    { level: 2, type: "fields", q: R`Για τον $A = \begin{pmatrix} 2 & 1\\ 0 & 2\end{pmatrix}$ να βρείτε την αλγεβρική και τη γεωμετρική πολλαπλότητα της ιδιοτιμής $2$.`,
      fields: [{ label: "π(2) =", ans: 2 }, { label: "γ(2) =", ans: 1 }], hint: R`$\operatorname{rank}(A - 2I)$;`,
      sol: R`$p_A = (2-\lambda)^2 \Rightarrow \pi(2) = 2$. $A - 2I = \begin{pmatrix} 0 & 1\\ 0 & 0\end{pmatrix}$ έχει βαθμό $1$, άρα $\gamma(2) = 2 - 1 = 1 < \pi(2)$.` },
    { level: 1, type: "mc", q: R`Οι πίνακες $A$ και $A^T$ έχουν πάντα τις ίδιες ιδιοτιμές.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`$\det M = \det M^T$.`,
      sol: R`Σωστό: $\det(A^T - \lambda I) = \det\big((A - \lambda I)^T\big) = \det(A - \lambda I)$, ίδιο χαρακτηριστικό πολυώνυμο. (Τα ιδιοδιανύσματα όμως γενικά διαφέρουν.)` },
    { level: 3, type: "fields", q: R`Για ποια τιμή του $k$ το $\lambda = 3$ είναι ιδιοτιμή του $A = \begin{pmatrix} 1 & k\\ 2 & 4\end{pmatrix}$; Ποια είναι τότε η άλλη ιδιοτιμή;`,
      fields: [{ label: "k =", ans: -1 }, { label: "άλλη ιδιοτιμή =", ans: 2 }], hint: R`$\det(A - 3I) = 0$· και $\lambda_1 + \lambda_2 = \operatorname{tr}A$.`,
      sol: R`$\det\begin{pmatrix} -2 & k\\ 2 & 1\end{pmatrix} = -2 - 2k = 0 \Rightarrow k = -1$. Τότε $\operatorname{tr}A = 5$, άρα η άλλη ιδιοτιμή είναι $5 - 3 = 2$ (έλεγχος: $\det A = 4 + 2 = 6 = 3\cdot 2$).` }
  ]
},
/* ───────────────────────────── 9.3 ───────────────────────────── */
{
  id: "9.3", unit: 9, title: "Διαγωνιοποίηση",
  book: "Σημειώσεις Κεφ. 9 · Ασκήσεις 10",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Ο $A$ ($n\times n$) λέγεται <b>διαγωνιοποιήσιμος</b> αν υπάρχουν αντιστρέψιμος $P$ και διαγώνιος $D$ ώστε
$$A = PDP^{-1} \quad (\text{ισοδύναμα } P^{-1}AP = D).$$</p></div>
<div class="tbox"><h4>Θεώρημα διαγωνιοποίησης</h4>
<p>Ο $A$ είναι διαγωνιοποιήσιμος $\iff$ έχει $n$ <b>γραμμικώς ανεξάρτητα ιδιοδιανύσματα</b>. Τότε οι στήλες του $P$ είναι αυτά τα ιδιοδιανύσματα και τα διαγώνια στοιχεία του $D$ οι αντίστοιχες ιδιοτιμές, <b>με την ίδια σειρά</b>.</p>
<ul><li><b>Ικανή συνθήκη:</b> $n$ διαφορετικές ιδιοτιμές $\Rightarrow$ διαγωνιοποιήσιμος.</li>
<li><b>Κριτήριο:</b> (όταν όλες οι ιδιοτιμές είναι πραγματικές) διαγωνιοποιήσιμος $\iff \gamma(\lambda) = \pi(\lambda)$ για κάθε ιδιοτιμή $\iff \sum_\lambda \dim E_\lambda = n$.</li></ul></div>
<div class="tbox tip"><h4>Δυνάμεις πίνακα</h4>
<p>$A^k = PD^kP^{-1}$, όπου $D^k$ έχει απλώς τις $k$-οστές δυνάμεις των διαγώνιων στοιχείων.</p>
<p>Π.χ. $P = \begin{pmatrix} 5 & 7\\ 2 & 3\end{pmatrix}$, $D = \begin{pmatrix} 2 & 0\\ 0 & 1\end{pmatrix}$, $P^{-1} = \begin{pmatrix} 3 & -7\\ -2 & 5\end{pmatrix}$:
$$A^4 = \begin{pmatrix} 5 & 7\\ 2 & 3\end{pmatrix}\begin{pmatrix} 16 & 0\\ 0 & 1\end{pmatrix}\begin{pmatrix} 3 & -7\\ -2 & 5\end{pmatrix} = \begin{pmatrix} 226 & -525\\ 90 & -209\end{pmatrix}.$$</p></div>
<div class="tbox"><h4>Βήματα</h4>
<ol><li>Ιδιοτιμές από $\det(A - \lambda I) = 0$.</li><li>Βάση κάθε ιδιόχωρου $E_\lambda$.</li><li>Αν συνολικά βρεθούν $n$ διανύσματα, $P = [\mathbf v_1 \cdots \mathbf v_n]$, $D = \operatorname{diag}(\lambda_1, \dots, \lambda_n)$· αλλιώς ο $A$ <b>δεν</b> διαγωνιοποιείται.</li><li>Έλεγχος: $AP = PD$ (δεν χρειάζεται να υπολογιστεί ο $P^{-1}$).</li></ol>
<p><b>Προσοχή:</b> διαγωνιοποιήσιμος δεν σημαίνει αντιστρέψιμος (η ιδιοτιμή $0$ επιτρέπεται), ούτε το αντίστροφο.</p></div>`,
  widget: "l5power",
  gen: "l5diag",
  exercises: [
    { level: 2, type: "fields", q: R`Ο $A$ γράφεται $A = PDP^{-1}$ με $P = \begin{pmatrix} 2 & 1\\ 1 & 1\end{pmatrix}$ και $D = \begin{pmatrix} 2 & 0\\ 0 & -1\end{pmatrix}$. Να υπολογίσετε τον $A^3 = \begin{pmatrix} a & b\\ c & d\end{pmatrix}$.`,
      fields: [{ label: "a =", ans: 17 }, { label: "b =", ans: -18 }, { label: "c =", ans: 9 }, { label: "d =", ans: -10 }], hint: R`$A^3 = PD^3P^{-1}$, $P^{-1} = \begin{pmatrix} 1 & -1\\ -1 & 2\end{pmatrix}$.`,
      sol: R`$D^3 = \operatorname{diag}(8, -1)$. $PD^3 = \begin{pmatrix} 16 & -1\\ 8 & -1\end{pmatrix}$, οπότε $A^3 = \begin{pmatrix} 16 & -1\\ 8 & -1\end{pmatrix}\begin{pmatrix} 1 & -1\\ -1 & 2\end{pmatrix} = \begin{pmatrix} 17 & -18\\ 9 & -10\end{pmatrix}$.` },
    { level: 1, type: "fields", q: R`Να διαγωνιοποιήσετε τον $A = \begin{pmatrix} 1 & 0\\ 6 & -1\end{pmatrix}$: για $\lambda = 1$ πάρτε ιδιοδιάνυσμα $\begin{pmatrix} 1\\ b\end{pmatrix}$ και για $\lambda = -1$ το $\begin{pmatrix} 0\\ 1\end{pmatrix}$. Ποιο είναι το $b$;`,
      fields: [{ label: "b =", ans: 3 }], hint: R`$(A - I)\mathbf x = \mathbf 0$.`,
      sol: R`$A - I = \begin{pmatrix} 0 & 0\\ 6 & -2\end{pmatrix} \Rightarrow 6x_1 = 2x_2$, $x_2 = 3x_1$: $\mathbf v_1 = (1, 3)^T$. Άρα $P = \begin{pmatrix} 1 & 0\\ 3 & 1\end{pmatrix}$, $D = \begin{pmatrix} 1 & 0\\ 0 & -1\end{pmatrix}$.` },
    { level: 2, type: "mc", q: R`Ο πίνακας $A = \begin{pmatrix} 3 & -1\\ 1 & 5\end{pmatrix}$:`,
      options: ["δεν είναι διαγωνιοποιήσιμος", "είναι διαγωνιοποιήσιμος με $D = \\operatorname{diag}(4, 4)$", "είναι διαγωνιοποιήσιμος γιατί είναι αντιστρέψιμος", "έχει δύο διαφορετικές ιδιοτιμές"], correct: 0,
      hint: R`$\operatorname{tr} = 8$, $\det = 16$.`,
      sol: R`$\lambda^2 - 8\lambda + 16 = (\lambda - 4)^2$: $\pi(4) = 2$. $A - 4I = \begin{pmatrix} -1 & -1\\ 1 & 1\end{pmatrix}$ έχει βαθμό $1$, άρα $\gamma(4) = 1 < 2$: <b>δεν</b> διαγωνιοποιείται. (Αν ήταν $A = P(4I)P^{-1}$ θα ήταν $A = 4I$.)` },
    { level: 1, type: "mc", q: R`Ένας $5\times 5$ πίνακας $A$ έχει δύο ιδιοτιμές· ο ένας ιδιόχωρος έχει διάσταση $3$ και ο άλλος διάσταση $2$. Ο $A$ είναι διαγωνιοποιήσιμος.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Άθροισμα διαστάσεων ιδιοχώρων.`,
      sol: R`Σωστό: $3 + 2 = 5 = n$, άρα υπάρχουν $5$ γραμμικώς ανεξάρτητα ιδιοδιανύσματα (τα διανύσματα βάσεων διαφορετικών ιδιοχώρων είναι μαζί ανεξάρτητα).` },
    { level: 1, type: "mc", q: R`Ένας $3\times 3$ πίνακας έχει δύο ιδιοτιμές και κάθε ιδιόχωρος έχει διάσταση $1$. Τότε ο πίνακας:`,
      options: ["δεν είναι διαγωνιοποιήσιμος", "είναι διαγωνιοποιήσιμος", "είναι μη αντιστρέψιμος", "δεν μπορεί να υπάρξει τέτοιος πίνακας"], correct: 0,
      hint: R`$1 + 1 < 3$.`,
      sol: R`Υπάρχουν το πολύ $2$ γραμμικώς ανεξάρτητα ιδιοδιανύσματα, λιγότερα από $3$: δεν διαγωνιοποιείται.` },
    { level: 2, type: "fields", q: R`Να βρείτε τις ιδιοτιμές (σε αύξουσα σειρά) του $A = \begin{pmatrix} -1 & 4 & -2\\ -3 & 4 & 0\\ -3 & 1 & 3\end{pmatrix}$, γνωρίζοντας ότι είναι ακέραιες και ότι $\det A = 6$, $\operatorname{tr}A = 6$, ενώ το $\lambda = 1$ είναι ιδιοτιμή.`,
      fields: [{ label: "λ₁ =", ans: 1 }, { label: "λ₂ =", ans: 2 }, { label: "λ₃ =", ans: 3 }], hint: R`$\lambda_2 + \lambda_3 = 5$, $\lambda_2\lambda_3 = 6$.`,
      sol: R`Με $\lambda_1 = 1$: $\lambda_2 + \lambda_3 = 6 - 1 = 5$ και $\lambda_2\lambda_3 = 6/1 = 6$, άρα $2$ και $3$. Τρεις διαφορετικές ιδιοτιμές ⇒ ο $A$ διαγωνιοποιείται (π.χ. $P = \begin{pmatrix} 1 & 2 & 1\\ 1 & 3 & 3\\ 1 & 3 & 4\end{pmatrix}$, $D = \operatorname{diag}(1, 2, 3)$).` },
    { level: 3, type: "fields", q: R`Δίνεται $A = \begin{pmatrix} 4 & -2\\ 1 & 1\end{pmatrix}$. Να τον διαγωνιοποιήσετε και να υπολογίσετε τον $A^5 = \begin{pmatrix} a & b\\ c & d\end{pmatrix}$.`,
      fields: [{ label: "a =", ans: 454 }, { label: "b =", ans: -422 }, { label: "c =", ans: 211 }, { label: "d =", ans: -179 }], hint: R`Ιδιοτιμές $2, 3$ με ιδιοδιανύσματα $(1, 1)^T$ και $(2, 1)^T$.`,
      sol: R`$\lambda^2 - 5\lambda + 6 = 0 \Rightarrow \lambda = 2, 3$. $E_2$: $2x_1 - 2x_2 = 0 \Rightarrow (1, 1)^T$· $E_3$: $x_1 - 2x_2 = 0 \Rightarrow (2, 1)^T$. $P = \begin{pmatrix} 1 & 2\\ 1 & 1\end{pmatrix}$, $P^{-1} = \begin{pmatrix} -1 & 2\\ 1 & -1\end{pmatrix}$, $D^5 = \operatorname{diag}(32, 243)$.
$A^5 = \begin{pmatrix} 32 & 486\\ 32 & 243\end{pmatrix}\begin{pmatrix} -1 & 2\\ 1 & -1\end{pmatrix} = \begin{pmatrix} 454 & -422\\ 211 & -179\end{pmatrix}$.` },
    { level: 2, type: "fields", q: R`Για ποια τιμή του $a$ ο πίνακας $\begin{pmatrix} 2 & a\\ 0 & 2\end{pmatrix}$ είναι διαγωνιοποιήσιμος;`,
      fields: [{ label: "a =", ans: 0 }], hint: R`Μόνο ιδιοτιμή το $2$ με $\pi(2) = 2$.`,
      sol: R`Χρειάζεται $\gamma(2) = 2$, δηλαδή $A - 2I = \begin{pmatrix} 0 & a\\ 0 & 0\end{pmatrix}$ με βαθμό $0$: $a = 0$ (τότε ο πίνακας είναι ήδη διαγώνιος).` },
    { level: 1, type: "mc", q: R`Κάθε διαγωνιοποιήσιμος πίνακας είναι αντιστρέψιμος.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Σκεφτείτε τον $\operatorname{diag}(1, 0)$.`,
      sol: R`Λάθος: ο $\begin{pmatrix} 1 & 0\\ 0 & 0\end{pmatrix}$ είναι διαγώνιος (άρα διαγωνιοποιήσιμος) αλλά έχει ιδιοτιμή $0$, οπότε δεν αντιστρέφεται.` }
  ]
},
/* ───────────────────────────── 9.4 ───────────────────────────── */
{
  id: "9.4", unit: 9, title: "Μιγαδικές ιδιοτιμές",
  book: "Σημειώσεις Κεφ. 9 · Ασκήσεις 10",
  theory: R`
<div class="tbox"><h4>Μιγαδικές ρίζες</h4>
<p>Το χαρακτηριστικό πολυώνυμο ενός <b>πραγματικού</b> πίνακα μπορεί να έχει μιγαδικές ρίζες· αυτές εμφανίζονται σε <b>συζυγή ζεύγη</b> $\lambda = a \pm bi$. Αν $A\mathbf v = \lambda\mathbf v$ με $\mathbf v \in \mathbb C^n$, τότε $A\bar{\mathbf v} = \bar\lambda\,\bar{\mathbf v}$.</p>
<p>Π.χ. $A = \begin{pmatrix} 1 & -2\\ 1 & 3\end{pmatrix}$: $\lambda^2 - 4\lambda + 5 = 0 \Rightarrow \lambda = 2 \pm i$, με ιδιοδιανύσματα $\begin{pmatrix} -1 \pm i\\ 1\end{pmatrix}$.</p></div>
<div class="tbox"><h4>Πίνακας στροφής – κλίμακας</h4>
<p>Ο $C = \begin{pmatrix} a & -b\\ b & a\end{pmatrix}$ έχει ιδιοτιμές $a \pm bi$ και γράφεται
$$C = r\begin{pmatrix} \cos\varphi & -\sin\varphi\\ \sin\varphi & \cos\varphi\end{pmatrix}, \qquad r = |\lambda| = \sqrt{a^2 + b^2},$$
όπου $\varphi$ η γωνία με $\cos\varphi = a/r$, $\sin\varphi = b/r$. Δηλαδή η $\mathbf x \mapsto C\mathbf x$ είναι <b>στροφή</b> κατά $\varphi$ ακολουθούμενη από <b>μεταβολή μήκους</b> κατά $r$.</p></div>
<div class="tbox tip"><h4>Θεώρημα</h4>
<p>Αν ο πραγματικός $2\times 2$ πίνακας $A$ έχει ιδιοτιμή $\lambda = a - bi$ ($b \ne 0$) με ιδιοδιάνυσμα $\mathbf v$, τότε
$$A = PCP^{-1}, \quad P = \big[\operatorname{Re}\mathbf v \ \ \operatorname{Im}\mathbf v\big], \quad C = \begin{pmatrix} a & -b\\ b & a\end{pmatrix}.$$
Στο παράδειγμα: $\lambda = 2 - i$, $\mathbf v = (-1 - i, 1)^T \Rightarrow P = \begin{pmatrix} -1 & -1\\ 1 & 0\end{pmatrix}$, $C = \begin{pmatrix} 2 & -1\\ 1 & 2\end{pmatrix}$.</p></div>
<div class="tbox"><h4>Προσοχή</h4>
<ul><li>Ένας πραγματικός $n\times n$ πίνακας με <b>περιττό</b> $n$ έχει πάντα τουλάχιστον μία πραγματική ιδιοτιμή.</li>
<li>Η γωνία $\varphi$ βρίσκεται από <b>και τα δύο</b> $\cos\varphi$, $\sin\varphi$ (σωστό τεταρτημόριο), όχι μόνο από $\tan\varphi = b/a$.</li></ul></div>`,
  widget: "l5rot",
  gen: "l5cplx",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε τις ιδιοτιμές $\lambda = \alpha \pm \beta i$ ($\beta > 0$) του $A = \begin{pmatrix} 1 & -2\\ 1 & 3\end{pmatrix}$.`,
      fields: [{ label: "α =", ans: 2 }, { label: "β =", ans: 1 }], hint: R`$\lambda^2 - 4\lambda + 5 = 0$.`,
      sol: R`$\operatorname{tr} = 4$, $\det = 3 + 2 = 5$: $\lambda = \frac{4 \pm \sqrt{16 - 20}}{2} = 2 \pm i$.` },
    { level: 1, type: "fields", q: R`Να βρείτε τις ιδιοτιμές $\lambda = \alpha \pm \beta i$ ($\beta > 0$) του $A = \begin{pmatrix} 1 & 5\\ -2 & 3\end{pmatrix}$.`,
      fields: [{ label: "α =", ans: 2 }, { label: "β =", ans: 3 }], hint: R`$\operatorname{tr} = 4$, $\det = 13$.`,
      sol: R`$\lambda^2 - 4\lambda + 13 = 0 \Rightarrow \lambda = 2 \pm \sqrt{4 - 13} = 2 \pm 3i$.` },
    { level: 2, type: "fields", q: R`Η απεικόνιση $\mathbf x \mapsto A\mathbf x$ με $A = \begin{pmatrix} \sqrt3 & -1\\ 1 & \sqrt3\end{pmatrix}$ είναι στροφή κατά γωνία $\varphi$ και μεταβολή μήκους κατά $r$. Να βρείτε το $r$ και τη γωνία $\varphi$ σε μοίρες ($-180^\circ < \varphi \le 180^\circ$).`,
      fields: [{ label: "r =", ans: 2 }, { label: "φ (μοίρες) =", ans: 30 }], hint: R`$a = \sqrt3$, $b = 1$.`,
      sol: R`$r = \sqrt{3 + 1} = 2$, $\cos\varphi = \frac{\sqrt3}{2}$, $\sin\varphi = \frac12 \Rightarrow \varphi = 30^\circ = \pi/6$. Ιδιοτιμές $\sqrt3 \pm i$.` },
    { level: 2, type: "fields", q: R`Για τον $C = \begin{pmatrix} 0{,}1 & 0{,}1\\ -0{,}1 & 0{,}1\end{pmatrix}$ να βρείτε το $r^2$ και τη γωνία $\varphi$ σε μοίρες ($-180^\circ < \varphi \le 180^\circ$).`,
      fields: [{ label: "r² =", ans: 0.02 }, { label: "φ (μοίρες) =", ans: -45 }], hint: R`Μορφή $\begin{pmatrix} a & -b\\ b & a\end{pmatrix}$ με $a = 0{,}1$, $b = -0{,}1$.`,
      sol: R`$r^2 = 0{,}01 + 0{,}01 = 0{,}02$ ($r = \sqrt2/10$). $\cos\varphi = a/r > 0$, $\sin\varphi = b/r < 0$ και $|a| = |b|$: $\varphi = -45^\circ = -\pi/4$.` },
    { level: 1, type: "mc", q: R`Ο πίνακας $\begin{pmatrix} 0 & -1\\ 1 & 0\end{pmatrix}$ (στροφή κατά $90^\circ$) έχει ιδιοτιμές:`,
      options: ["$\\pm i$", "$\\pm 1$", "$0$ (διπλή)", "$1 \\pm i$"], correct: 0, hint: R`$\lambda^2 + 1 = 0$.`,
      sol: R`$\det(A - \lambda I) = \lambda^2 + 1 = 0 \Rightarrow \lambda = \pm i$. Λογικό: καμία ευθεία από την αρχή δεν μένει αναλλοίωτη σε στροφή $90^\circ$, άρα δεν υπάρχουν πραγματικά ιδιοδιανύσματα.` },
    { level: 3, type: "fields", q: R`Για τον $A = \begin{pmatrix} 1 & 5\\ -2 & 3\end{pmatrix}$ να βρείτε $P$ και $C = \begin{pmatrix} a & -b\\ b & a\end{pmatrix}$ με $A = PCP^{-1}$, χρησιμοποιώντας την ιδιοτιμή $\lambda = a - bi$ με $b > 0$ και ιδιοδιάνυσμα με $x_2 = 2$. Δώστε τα στοιχεία του $P$ (κατά γραμμές) και τα $a$, $b$.`,
      fields: [{ label: "p₁₁ =", ans: 1 }, { label: "p₁₂ =", ans: 3 }, { label: "p₂₁ =", ans: 2 }, { label: "p₂₂ =", ans: 0 }, { label: "a =", ans: 2 }, { label: "b =", ans: 3 }], hint: R`$\lambda = 2 - 3i$· βρείτε ιδιοδιάνυσμα από την 2η γραμμή του $A - \lambda I$.`,
      sol: R`$\lambda = 2 - 3i$. Από τη 2η γραμμή του $A - \lambda I$: $-2x_1 + (1 + 3i)x_2 = 0$, οπότε με $x_2 = 2$: $\mathbf v = \begin{pmatrix} 1 + 3i\\ 2\end{pmatrix}$. $P = \begin{pmatrix} 1 & 3\\ 2 & 0\end{pmatrix}$, $C = \begin{pmatrix} 2 & -3\\ 3 & 2\end{pmatrix}$ (έλεγχος: $AP = PC = \begin{pmatrix} 11 & 3\\ 4 & -6\end{pmatrix}$).` },
    { level: 1, type: "mc", q: R`Οι μη πραγματικές ιδιοτιμές ενός πραγματικού πίνακα εμφανίζονται σε ζεύγη συζυγών μιγαδικών.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Το χαρακτηριστικό πολυώνυμο έχει πραγματικούς συντελεστές.`,
      sol: R`Σωστό: αν $p(\lambda) = 0$ με πραγματικούς συντελεστές, τότε $p(\bar\lambda) = \overline{p(\lambda)} = 0$.` },
    { level: 2, type: "mc", q: R`Κάθε πραγματικός $3\times 3$ πίνακας:`,
      options: ["έχει τουλάχιστον μία πραγματική ιδιοτιμή", "έχει τρεις πραγματικές ιδιοτιμές", "μπορεί να έχει τρεις μη πραγματικές ιδιοτιμές", "είναι διαγωνιοποιήσιμος στο $\\mathbb R$"], correct: 0,
      hint: R`Βαθμός $3$ και συζυγή ζεύγη.`,
      sol: R`Το $p_A$ έχει βαθμό $3$· οι μη πραγματικές ρίζες έρχονται ανά δύο, άρα τουλάχιστον μία ρίζα είναι πραγματική.` },
    { level: 2, type: "fields", q: R`Για τον $C = \begin{pmatrix} 1 & -1\\ 1 & 1\end{pmatrix}$ να βρείτε το $r^2$, τη γωνία $\varphi$ σε μοίρες και τον $C^8 = \begin{pmatrix} p & q\\ s & t\end{pmatrix}$.`,
      fields: [{ label: "r² =", ans: 2 }, { label: "φ =", ans: 45 }, { label: "p =", ans: 16 }, { label: "q =", ans: 0 }, { label: "s =", ans: 0 }, { label: "t =", ans: 16 }],
      hint: R`$C^8$: στροφή κατά $8\cdot 45^\circ$ και κλίμακα $r^8$.`,
      sol: R`$r = \sqrt2$, $\varphi = 45^\circ$. $C^8 = r^8\begin{pmatrix} \cos 360^\circ & -\sin 360^\circ\\ \sin 360^\circ & \cos 360^\circ\end{pmatrix} = 16 I = \begin{pmatrix} 16 & 0\\ 0 & 16\end{pmatrix}$.` }
  ]
},
/* ───────────────────────────── 10.1 ───────────────────────────── */
{
  id: "10.1", unit: 10, title: "Εσωτερικό γινόμενο – Νόρμα – Ορθογωνιότητα",
  book: "Σημειώσεις Χ. Σοφοκλέους, Κεφ. 6",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Εσωτερικό γινόμενο σε πραγματικό διανυσματικό χώρο $V$ είναι μια συνάρτηση $\langle\cdot,\cdot\rangle: V\times V\to\mathbb R$ ώστε για κάθε $\mathbf u, \mathbf v, \mathbf w \in V$ και $c \in \mathbb R$:</p>
<ol><li>$\langle \mathbf u, \mathbf v\rangle = \langle \mathbf v, \mathbf u\rangle$ (συμμετρία)</li>
<li>$\langle \mathbf u + \mathbf v, \mathbf w\rangle = \langle \mathbf u, \mathbf w\rangle + \langle \mathbf v, \mathbf w\rangle$ και $\langle c\mathbf u, \mathbf v\rangle = c\langle \mathbf u, \mathbf v\rangle$ (γραμμικότητα)</li>
<li>$\langle \mathbf u, \mathbf u\rangle \ge 0$, με ισότητα μόνο για $\mathbf u = \mathbf 0$ (θετικότητα).</li></ol></div>
<div class="tbox"><h4>Παραδείγματα</h4>
<ul><li>$\mathbb R^n$: $\langle \mathbf u, \mathbf v\rangle = \mathbf u\cdot\mathbf v = u_1v_1 + \dots + u_nv_n$ (Ευκλείδειο).</li>
<li>$\mathbb R^2$ με βάρη: $\langle \mathbf u, \mathbf v\rangle = 2u_1v_1 + 3u_2v_2$ (κάθε θετικό βάρος δίνει εσωτερικό γινόμενο).</li>
<li>$C[0,1]$: $\langle f, g\rangle = \int_0^1 f(x)g(x)\,dx$.</li>
<li>Πίνακες $m\times n$: $\langle A, B\rangle = \operatorname{tr}(A^TB) = \sum_{i,j} a_{ij}b_{ij}$.</li></ul></div>
<div class="tbox"><h4>Νόρμα, απόσταση, γωνία</h4>
<p>$\|\mathbf u\| = \sqrt{\langle\mathbf u, \mathbf u\rangle}$, $\ d(\mathbf u, \mathbf v) = \|\mathbf u - \mathbf v\|$. <b>Ορθογώνια</b>: $\langle \mathbf u, \mathbf v\rangle = 0$.</p>
<ul><li><b>Cauchy–Schwarz:</b> $|\langle \mathbf u, \mathbf v\rangle| \le \|\mathbf u\|\,\|\mathbf v\|$, με ισότητα $\iff$ $\mathbf u, \mathbf v$ γραμμικώς εξαρτημένα. Έτσι ορίζεται η γωνία, για $\mathbf u, \mathbf v \ne \mathbf 0$: $\cos\theta = \frac{\langle\mathbf u, \mathbf v\rangle}{\|\mathbf u\|\|\mathbf v\|}$.</li>
<li><b>Τριγωνική ανισότητα:</b> $\|\mathbf u + \mathbf v\| \le \|\mathbf u\| + \|\mathbf v\|$.</li>
<li><b>Πυθαγόρειο:</b> $\mathbf u \perp \mathbf v \iff \|\mathbf u + \mathbf v\|^2 = \|\mathbf u\|^2 + \|\mathbf v\|^2$.</li></ul></div>
<div class="tbox tip"><h4>Παράδειγμα</h4>
<p>Στο $C[0,1]$: $\langle x, 1\rangle = \int_0^1 x\,dx = \frac12$, $\|x\|^2 = \int_0^1 x^2\,dx = \frac13$. Οι $x$ και $x - \frac23$ είναι ορθογώνιες: $\int_0^1 (x^2 - \frac23 x)\,dx = \frac13 - \frac13 = 0$.</p></div>`,
  widget: "l5ipw",
  gen: "l5ip",
  exercises: [
    { level: 1, type: "fields", q: R`Για $\mathbf u = (1, -2, 2)$ και $\mathbf v = (3, 1, -1)$ στο $\mathbb R^3$ (Ευκλείδειο εσωτερικό γινόμενο) να βρείτε τα $\langle\mathbf u, \mathbf v\rangle$, $\|\mathbf u\|$ και $\|\mathbf v\|^2$.`,
      fields: [{ label: "⟨u, v⟩ =", ans: -1 }, { label: "‖u‖ =", ans: 3 }, { label: "‖v‖² =", ans: 11 }], hint: R`$\|\mathbf u\|^2 = 1 + 4 + 4$.`,
      sol: R`$\langle\mathbf u, \mathbf v\rangle = 3 - 2 - 2 = -1$, $\|\mathbf u\| = \sqrt9 = 3$, $\|\mathbf v\|^2 = 9 + 1 + 1 = 11$.` },
    { level: 1, type: "fields", q: R`Στο $\mathbb R^2$ με $\langle\mathbf u, \mathbf v\rangle = 2u_1v_1 + 3u_2v_2$ δίνονται $\mathbf u = (1, 1)$, $\mathbf v = (3, -2)$. Να βρείτε τα $\langle\mathbf u, \mathbf v\rangle$ και $\|\mathbf u\|^2$.`,
      fields: [{ label: "⟨u, v⟩ =", ans: 0 }, { label: "‖u‖² =", ans: 5 }], hint: R`Βάλτε τα βάρη $2$ και $3$.`,
      sol: R`$\langle\mathbf u, \mathbf v\rangle = 2\cdot 3 + 3\cdot(-2) = 0$: τα $\mathbf u, \mathbf v$ είναι <b>ορθογώνια ως προς αυτό το εσωτερικό γινόμενο</b> (ενώ $\mathbf u\cdot\mathbf v = 1 \ne 0$). $\|\mathbf u\|^2 = 2 + 3 = 5$.` },
    { level: 2, type: "fields", q: R`Στο $C[0,1]$ με $\langle f, g\rangle = \int_0^1 f(x)g(x)\,dx$ να βρείτε τα $\langle x, x^2\rangle$ και $\|x^2\|^2$.`,
      fields: [{ label: "⟨x, x²⟩ =", ans: "1/4" }, { label: "‖x²‖² =", ans: "1/5" }], hint: R`$\int_0^1 x^k\,dx = \frac{1}{k+1}$.`,
      sol: R`$\langle x, x^2\rangle = \int_0^1 x^3\,dx = \frac14$, $\ \|x^2\|^2 = \int_0^1 x^4\,dx = \frac15$.` },
    { level: 2, type: "fields", q: R`Στο $C[0,1]$ με $\langle f, g\rangle = \int_0^1 fg\,dx$, για ποιο $k$ οι $f(x) = x$ και $g(x) = x + k$ είναι ορθογώνιες;`,
      fields: [{ label: "k =", ans: "-2/3" }], hint: R`$\int_0^1 (x^2 + kx)\,dx = 0$.`,
      sol: R`$\frac13 + \frac k2 = 0 \Rightarrow k = -\frac23$.` },
    { level: 2, type: "mc", q: R`Η συνάρτηση $\langle\mathbf u, \mathbf v\rangle = u_1v_1 - u_2v_2$ στο $\mathbb R^2$:`,
      options: ["δεν είναι εσωτερικό γινόμενο, γιατί αποτυγχάνει η θετικότητα", "είναι εσωτερικό γινόμενο", "δεν είναι εσωτερικό γινόμενο, γιατί δεν είναι συμμετρική", "δεν είναι εσωτερικό γινόμενο, γιατί δεν είναι γραμμική"], correct: 0,
      hint: R`Υπολογίστε το $\langle\mathbf u, \mathbf u\rangle$ για $\mathbf u = (0, 1)$.`,
      sol: R`Είναι συμμετρική και γραμμική, αλλά $\langle (0,1), (0,1)\rangle = -1 < 0$ (και $\langle (1,1), (1,1)\rangle = 0$ με μη μηδενικό διάνυσμα).` },
    { level: 1, type: "fields", q: R`Με $\langle A, B\rangle = \operatorname{tr}(A^TB)$ στους $2\times 2$ πίνακες, για $A = \begin{pmatrix} 1 & 2\\ 0 & -1\end{pmatrix}$, $B = \begin{pmatrix} 3 & 0\\ 1 & 2\end{pmatrix}$ να βρείτε τα $\langle A, B\rangle$ και $\|A\|^2$.`,
      fields: [{ label: "⟨A, B⟩ =", ans: 1 }, { label: "‖A‖² =", ans: 6 }], hint: R`Άθροισμα γινομένων αντίστοιχων στοιχείων.`,
      sol: R`$\langle A, B\rangle = 1\cdot 3 + 2\cdot 0 + 0\cdot 1 + (-1)\cdot 2 = 1$, $\|A\|^2 = 1 + 4 + 0 + 1 = 6$.` },
    { level: 1, type: "fields", q: R`Τα $\mathbf u, \mathbf v$ είναι ορθογώνια με $\|\mathbf u\| = 3$ και $\|\mathbf v\| = 4$. Να βρείτε το $\|\mathbf u + \mathbf v\|$ και το $\|\mathbf u - \mathbf v\|$.`,
      fields: [{ label: "‖u + v‖ =", ans: 5 }, { label: "‖u − v‖ =", ans: 5 }], hint: R`Πυθαγόρειο θεώρημα.`,
      sol: R`$\|\mathbf u \pm \mathbf v\|^2 = \|\mathbf u\|^2 \pm 2\langle\mathbf u, \mathbf v\rangle + \|\mathbf v\|^2 = 9 + 0 + 16 = 25$, άρα και τα δύο ίσα με $5$.` },
    { level: 1, type: "mc", q: R`Στην ανισότητα Cauchy–Schwarz $|\langle\mathbf u, \mathbf v\rangle| \le \|\mathbf u\|\|\mathbf v\|$ ισχύει ισότητα αν και μόνο αν τα $\mathbf u, \mathbf v$ είναι ορθογώνια.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Τι γίνεται για $\mathbf v = 2\mathbf u$;`,
      sol: R`Λάθος: ισότητα έχουμε $\iff$ τα $\mathbf u, \mathbf v$ είναι γραμμικώς εξαρτημένα (π.χ. $\mathbf v = 2\mathbf u$). Για ορθογώνια μη μηδενικά το αριστερό μέλος είναι $0 < \|\mathbf u\|\|\mathbf v\|$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τη γωνία (σε μοίρες) μεταξύ των $\mathbf u = (1, 1, 0)$ και $\mathbf v = (1, 0, 1)$ στο $\mathbb R^3$.`,
      fields: [{ label: "θ =", ans: 60 }], hint: R`$\cos\theta = \frac{1}{\sqrt2\sqrt2}$.`,
      sol: R`$\cos\theta = \frac{1}{\sqrt2\cdot\sqrt2} = \frac12 \Rightarrow \theta = 60^\circ$.` }
  ]
},
/* ───────────────────────────── 10.2 ───────────────────────────── */
{
  id: "10.2", unit: 10, title: "Ορθογώνιες βάσεις και ορθογώνια προβολή",
  book: "Σημειώσεις Χ. Σοφοκλέους, Κεφ. 6",
  theory: R`
<div class="tbox"><h4>Ορθογώνια σύνολα</h4>
<p>Ένα σύνολο $\{\mathbf u_1, \dots, \mathbf u_p\}$ είναι <b>ορθογώνιο</b> αν $\langle\mathbf u_i, \mathbf u_j\rangle = 0$ για $i \ne j$, και <b>ορθοκανονικό</b> αν επιπλέον $\|\mathbf u_i\| = 1$. Κάθε ορθογώνιο σύνολο <b>μη μηδενικών</b> διανυσμάτων είναι γραμμικώς ανεξάρτητο.</p></div>
<div class="tbox"><h4>Συντεταγμένες σε ορθογώνια βάση</h4>
<p>Αν $\{\mathbf u_1, \dots, \mathbf u_n\}$ ορθογώνια βάση του $W$ και $\mathbf y \in W$, τότε
$$\mathbf y = c_1\mathbf u_1 + \dots + c_n\mathbf u_n, \qquad c_j = \frac{\langle\mathbf y, \mathbf u_j\rangle}{\langle\mathbf u_j, \mathbf u_j\rangle}$$
— χωρίς επίλυση συστήματος.</p></div>
<div class="tbox"><h4>Ορθογώνια προβολή</h4>
<p>Σε ευθεία: $\ \operatorname{proj}_{\mathbf u}\mathbf y = \dfrac{\langle\mathbf y, \mathbf u\rangle}{\langle\mathbf u, \mathbf u\rangle}\mathbf u$. Σε υπόχωρο $W$ με ορθογώνια βάση $\{\mathbf u_1, \dots, \mathbf u_p\}$:
$$\hat{\mathbf y} = \operatorname{proj}_W\mathbf y = \sum_{j=1}^p \frac{\langle\mathbf y, \mathbf u_j\rangle}{\langle\mathbf u_j, \mathbf u_j\rangle}\mathbf u_j .$$
Τότε $\mathbf z = \mathbf y - \hat{\mathbf y}$ είναι ορθογώνιο σε κάθε διάνυσμα του $W$, και το $\hat{\mathbf y}$ είναι η <b>καλύτερη προσέγγιση</b> του $\mathbf y$ από το $W$: $\ d(\mathbf y, W) = \|\mathbf y - \hat{\mathbf y}\|$.</p></div>
<div class="tbox tip"><h4>Ορθογώνιοι πίνακες</h4>
<p>Ο $Q$ ($n\times n$) με ορθοκανονικές στήλες ικανοποιεί $Q^TQ = I$, δηλαδή $Q^{-1} = Q^T$, και διατηρεί μήκη και γωνίες: $\|Q\mathbf x\| = \|\mathbf x\|$. <b>Προσοχή:</b> ο τύπος των $c_j$ ισχύει μόνο για <b>ορθογώνια</b> βάση.</p></div>`,
  widget: "l5projw",
  gen: "l5proj",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε την ορθογώνια προβολή $\hat{\mathbf y}$ του $\mathbf y = (7, 6)$ στην ευθεία που παράγεται από το $\mathbf u = (4, 2)$, καθώς και το τετράγωνο της απόστασης του $\mathbf y$ από την ευθεία.`,
      fields: [{ label: "ŷ₁ =", ans: 8 }, { label: "ŷ₂ =", ans: 4 }, { label: "d² =", ans: 5 }], hint: R`$\frac{\mathbf y\cdot\mathbf u}{\mathbf u\cdot\mathbf u} = \frac{40}{20}$.`,
      sol: R`$\hat{\mathbf y} = \frac{28 + 12}{16 + 4}\mathbf u = 2(4, 2) = (8, 4)$. $\mathbf y - \hat{\mathbf y} = (-1, 2)$ (ορθογώνιο στο $\mathbf u$: $-4 + 4 = 0$), $d^2 = 1 + 4 = 5$.` },
    { level: 2, type: "fields", q: R`Τα $\mathbf u_1 = (3, 1, 1)$, $\mathbf u_2 = (-1, 2, 1)$, $\mathbf u_3 = \left(-\frac12, -2, \frac72\right)$ αποτελούν ορθογώνια βάση του $\mathbb R^3$. Να γράψετε το $\mathbf y = (6, 1, -8)$ ως $c_1\mathbf u_1 + c_2\mathbf u_2 + c_3\mathbf u_3$.`,
      fields: [{ label: "c₁ =", ans: 1 }, { label: "c₂ =", ans: -2 }, { label: "c₃ =", ans: -2 }], hint: R`$c_j = \frac{\mathbf y\cdot\mathbf u_j}{\mathbf u_j\cdot\mathbf u_j}$.`,
      sol: R`$c_1 = \frac{18 + 1 - 8}{11} = 1$, $c_2 = \frac{-6 + 2 - 8}{6} = -2$, $c_3 = \frac{-3 - 2 - 28}{33/2} = -2$.` },
    { level: 1, type: "mc", q: R`Ποιο από τα σύνολα είναι ορθογώνιο;`,
      options: ["$(1, 1, 0)$, $(1, -1, 0)$, $(0, 0, 3)$", "$(1, 2, 0)$, $(2, 1, 0)$, $(0, 0, 1)$", "$(1, 1, 1)$, $(1, 0, -1)$, $(1, 1, 0)$", "$(1, 0, 1)$, $(0, 1, 1)$, $(1, 1, 0)$"], correct: 0,
      hint: R`Ελέγξτε όλα τα ζεύγη εσωτερικών γινομένων.`,
      sol: R`$(1,1,0)\cdot(1,-1,0) = 0$, και τα δύο κάθετα στο $(0,0,3)$. Στα άλλα: $(1,2,0)\cdot(2,1,0) = 4$, $(1,1,1)\cdot(1,1,0) = 2$, $(1,0,1)\cdot(0,1,1) = 1$.` },
    { level: 2, type: "fields", q: R`Έστω $W = \operatorname{Span}\{\mathbf u_1, \mathbf u_2\}$ με $\mathbf u_1 = (2, 5, -1)$, $\mathbf u_2 = (-2, 1, 1)$ (ορθογώνια). Να βρείτε την προβολή του $\mathbf y = (1, 2, 3)$ στον $W$.`,
      fields: [{ label: "ŷ₁ =", ans: "-2/5" }, { label: "ŷ₂ =", ans: 2 }, { label: "ŷ₃ =", ans: "1/5" }], hint: R`Συντελεστές $\frac{9}{30}$ και $\frac{3}{6}$.`,
      sol: R`$\mathbf y\cdot\mathbf u_1 = 9$, $\mathbf u_1\cdot\mathbf u_1 = 30$· $\mathbf y\cdot\mathbf u_2 = 3$, $\mathbf u_2\cdot\mathbf u_2 = 6$. $\hat{\mathbf y} = \frac{3}{10}(2, 5, -1) + \frac12(-2, 1, 1) = \left(-\frac25, 2, \frac15\right)$.` },
    { level: 1, type: "mc", q: R`Ο $Q = \frac{1}{\sqrt2}\begin{pmatrix} 1 & -1\\ 1 & 1\end{pmatrix}$ είναι ορθογώνιος πίνακας. Ποιος είναι ο $Q^{-1}$;`,
      options: ["$Q^T$", "$-Q$", "$\\sqrt2\\,Q$", "$Q$"], correct: 0, hint: R`Ορθοκανονικές στήλες.`,
      sol: R`Οι στήλες είναι ορθοκανονικές, άρα $Q^TQ = I$ και $Q^{-1} = Q^T = \frac{1}{\sqrt2}\begin{pmatrix} 1 & 1\\ -1 & 1\end{pmatrix}$ (στροφή κατά $-45^\circ$).` },
    { level: 1, type: "fields", q: R`Να κανονικοποιήσετε το $\mathbf u = (2, -1, 2)$, δηλαδή να βρείτε το μοναδιαίο $\mathbf e = \mathbf u/\|\mathbf u\|$.`,
      fields: [{ label: "e₁ =", ans: "2/3" }, { label: "e₂ =", ans: "-1/3" }, { label: "e₃ =", ans: "2/3" }], hint: R`$\|\mathbf u\| = 3$.`,
      sol: R`$\|\mathbf u\| = \sqrt{4 + 1 + 4} = 3$, $\mathbf e = \left(\frac23, -\frac13, \frac23\right)$.` },
    { level: 3, type: "fields", q: R`Να βρείτε την απόσταση του $\mathbf y = (-1, -5, 10)$ από τον υπόχωρο $W = \operatorname{Span}\{(5, -2, 1), (1, 2, -1)\}$. Δώστε την προβολή $\hat{\mathbf y}$ και το $d^2$.`,
      fields: [{ label: "ŷ₁ =", ans: -1 }, { label: "ŷ₂ =", ans: -8 }, { label: "ŷ₃ =", ans: 4 }, { label: "d² =", ans: 45 }], hint: R`Τα δύο διανύσματα είναι ορθογώνια.`,
      sol: R`$\mathbf u_1\cdot\mathbf u_2 = 5 - 4 - 1 = 0$. $c_1 = \frac{-5 + 10 + 10}{30} = \frac12$, $c_2 = \frac{-1 - 10 - 10}{6} = -\frac72$. $\hat{\mathbf y} = \left(\frac52, -1, \frac12\right) + \left(-\frac72, -7, \frac72\right) = (-1, -8, 4)$. $\mathbf y - \hat{\mathbf y} = (0, 3, 6)$, $d^2 = 45$, $d = 3\sqrt5$.` },
    { level: 1, type: "mc", q: R`Κάθε ορθογώνιο σύνολο διανυσμάτων είναι γραμμικώς ανεξάρτητο.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Μπορεί να περιέχει το $\mathbf 0$;`,
      sol: R`Λάθος: το $\{(1, 0), (0, 0)\}$ είναι ορθογώνιο αλλά εξαρτημένο. Ισχύει για ορθογώνια σύνολα <b>μη μηδενικών</b> διανυσμάτων.` }
  ]
},
/* ───────────────────────────── 10.3 ───────────────────────────── */
{
  id: "10.3", unit: 10, title: "Μέθοδος Gram–Schmidt – Ορθογώνιο συμπλήρωμα",
  book: "Σημειώσεις Χ. Σοφοκλέους, Κεφ. 6",
  theory: R`
<div class="tbox"><h4>Διαδικασία Gram–Schmidt</h4>
<p>Από μια βάση $\{\mathbf x_1, \dots, \mathbf x_p\}$ του $W$ κατασκευάζουμε ορθογώνια βάση:</p>
$$\mathbf v_1 = \mathbf x_1, \quad \mathbf v_2 = \mathbf x_2 - \frac{\langle\mathbf x_2, \mathbf v_1\rangle}{\langle\mathbf v_1, \mathbf v_1\rangle}\mathbf v_1, \quad \mathbf v_3 = \mathbf x_3 - \frac{\langle\mathbf x_3, \mathbf v_1\rangle}{\langle\mathbf v_1, \mathbf v_1\rangle}\mathbf v_1 - \frac{\langle\mathbf x_3, \mathbf v_2\rangle}{\langle\mathbf v_2, \mathbf v_2\rangle}\mathbf v_2, \ \dots$$
<p>Σε κάθε βήμα αφαιρούμε από το $\mathbf x_k$ την προβολή του στον $\operatorname{Span}\{\mathbf v_1, \dots, \mathbf v_{k-1}\} = \operatorname{Span}\{\mathbf x_1, \dots, \mathbf x_{k-1}\}$. Για <b>ορθοκανονική</b> βάση διαιρούμε στο τέλος κάθε $\mathbf v_k$ με $\|\mathbf v_k\|$.</p></div>
<div class="tbox tip"><h4>Πρακτικά</h4>
<ul><li>Μπορούμε να πολλαπλασιάσουμε οποιοδήποτε $\mathbf v_k$ με μη μηδενικό αριθμό (π.χ. για να φύγουν κλάσματα) πριν το επόμενο βήμα — η ορθογωνιότητα δεν αλλάζει.</li>
<li>Έλεγχος: $\langle\mathbf v_i, \mathbf v_j\rangle = 0$. Αν κάποιο $\mathbf v_k = \mathbf 0$, τα αρχικά διανύσματα ήταν εξαρτημένα.</li></ul></div>
<div class="tbox"><h4>Ορθογώνιο συμπλήρωμα</h4>
<p>$W^\perp = \{\mathbf z \in V : \langle\mathbf z, \mathbf w\rangle = 0 \ \forall\,\mathbf w \in W\}$ είναι υπόχωρος. Αρκεί το $\mathbf z$ να είναι ορθογώνιο στα διανύσματα μιας βάσης του $W$. Στο $\mathbb R^n$:</p>
<ul><li>$\dim W + \dim W^\perp = n$ και $(W^\perp)^\perp = W$·</li>
<li>$(\operatorname{Row}A)^\perp = N(A)$ και $(\operatorname{Col}A)^\perp = N(A^T)$.</li></ul>
<p>Π.χ. $W = \operatorname{Span}\{(1, 0, 1), (0, 1, 1)\}$: λύνουμε $x + z = 0$, $y + z = 0$ και βρίσκουμε $W^\perp = \operatorname{Span}\{(-1, -1, 1)\}$.</p></div>`,
  widget: "l5gsw",
  gen: "l5gs",
  exercises: [
    { level: 1, type: "fields", q: R`Να εφαρμόσετε Gram–Schmidt στα $\mathbf x_1 = (3, 0, -1)$, $\mathbf x_2 = (8, 5, -6)$. Με $\mathbf v_1 = \mathbf x_1$, να βρείτε το $\mathbf v_2$.`,
      fields: [{ label: "v₂ (1η) =", ans: -1 }, { label: "v₂ (2η) =", ans: 5 }, { label: "v₂ (3η) =", ans: -3 }], hint: R`$\frac{\mathbf x_2\cdot\mathbf v_1}{\mathbf v_1\cdot\mathbf v_1} = \frac{30}{10}$.`,
      sol: R`$\mathbf v_2 = \mathbf x_2 - 3\mathbf v_1 = (8, 5, -6) - (9, 0, -3) = (-1, 5, -3)$. Έλεγχος: $\mathbf v_1\cdot\mathbf v_2 = -3 + 0 + 3 = 0$.` },
    { level: 1, type: "fields", q: R`Στο $\mathbb R^2$, Gram–Schmidt στα $\mathbf x_1 = (1, 1)$, $\mathbf x_2 = (1, 3)$: να βρείτε το $\mathbf v_2$.`,
      fields: [{ label: "v₂ (1η) =", ans: -1 }, { label: "v₂ (2η) =", ans: 1 }], hint: R`Συντελεστής $\frac{4}{2}$.`,
      sol: R`$\mathbf v_2 = (1, 3) - 2(1, 1) = (-1, 1)$.` },
    { level: 2, type: "fields", q: R`Gram–Schmidt στα $\mathbf x_1 = (1, 2, 2)$, $\mathbf x_2 = (1, 0, 4)$: να βρείτε το $\mathbf v_2$ και το $\|\mathbf v_2\|^2$.`,
      fields: [{ label: "v₂ (1η) =", ans: 0 }, { label: "v₂ (2η) =", ans: -2 }, { label: "v₂ (3η) =", ans: 2 }, { label: "‖v₂‖² =", ans: 8 }], hint: R`$\mathbf x_2\cdot\mathbf x_1 = 9 = \|\mathbf x_1\|^2$.`,
      sol: R`$\mathbf v_2 = \mathbf x_2 - \frac99\mathbf x_1 = (0, -2, 2)$, $\|\mathbf v_2\|^2 = 8$. Ορθοκανονική βάση: $\frac13(1, 2, 2)$, $\frac{1}{2\sqrt2}(0, -2, 2) = \frac{1}{\sqrt2}(0, -1, 1)$.` },
    { level: 3, type: "fields", q: R`Gram–Schmidt στα $\mathbf x_1 = (1, 1, 1, 1)$, $\mathbf x_2 = (0, 1, 1, 1)$, $\mathbf x_3 = (0, 0, 1, 1)$ του $\mathbb R^4$. Να βρείτε το $\mathbf v_3$ (χωρίς κλιμάκωση).`,
      fields: [{ label: "v₃ (1η) =", ans: 0 }, { label: "v₃ (2η) =", ans: "-2/3" }, { label: "v₃ (3η) =", ans: "1/3" }, { label: "v₃ (4η) =", ans: "1/3" }],
      hint: R`$\mathbf v_2 = \mathbf x_2 - \frac34\mathbf x_1$, ή κλιμακωμένο $\mathbf v_2' = (-3, 1, 1, 1)$.`,
      sol: R`$\mathbf v_2 = \left(-\frac34, \frac14, \frac14, \frac14\right)$ — κλιμακώνουμε σε $\mathbf v_2' = (-3, 1, 1, 1)$. Τότε $\mathbf v_3 = \mathbf x_3 - \frac{2}{4}\mathbf v_1 - \frac{2}{12}\mathbf v_2' = (0, 0, 1, 1) - \left(\frac12, \frac12, \frac12, \frac12\right) - \left(-\frac12, \frac16, \frac16, \frac16\right) = \left(0, -\frac23, \frac13, \frac13\right)$.` },
    { level: 1, type: "mc", q: R`Αν $W = \operatorname{Span}\{(1, 1, 1)\} \subseteq \mathbb R^3$, ο $W^\perp$ είναι:`,
      options: ["το επίπεδο $x + y + z = 0$", "η ευθεία που παράγεται από το $(1, 1, 1)$", "ο $\\{\\mathbf 0\\}$", "ολόκληρος ο $\\mathbb R^3$"], correct: 0, hint: R`$\dim W^\perp = 3 - 1$.`,
      sol: R`$\mathbf z \perp (1, 1, 1) \iff z_1 + z_2 + z_3 = 0$: επίπεδο διάστασης $2 = 3 - 1$.` },
    { level: 1, type: "mc", q: R`Αν $W = \operatorname{Span}\{(1, 2, -1)\}$, τότε το $(3, -1, 1)$ ανήκει στον $W^\perp$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Εσωτερικό γινόμενο.`,
      sol: R`$3 - 2 - 1 = 0$: ναι, είναι ορθογώνιο στη βάση του $W$, άρα σε όλο τον $W$.` },
    { level: 2, type: "mc", q: R`Για κάθε πίνακα $A$ $m\times n$ ισχύει:`,
      options: ["$(\\operatorname{Row}A)^\\perp = N(A)$", "$(\\operatorname{Col}A)^\\perp = N(A)$", "$(\\operatorname{Row}A)^\\perp = \\operatorname{Col}A$", "$N(A)^\\perp = N(A^T)$"], correct: 0,
      hint: R`$A\mathbf x = \mathbf 0$ σημαίνει ότι κάθε γραμμή είναι ορθογώνια στο $\mathbf x$.`,
      sol: R`$A\mathbf x = \mathbf 0 \iff$ το $\mathbf x$ είναι ορθογώνιο σε κάθε γραμμή του $A$ $\iff \mathbf x \in (\operatorname{Row}A)^\perp$. Αντίστοιχα $(\operatorname{Col}A)^\perp = N(A^T)$.` },
    { level: 2, type: "fields", q: R`Να βρείτε βάση του $W^\perp$ για $W = \operatorname{Span}\{(1, 0, 1), (0, 1, 1)\}$, με διάνυσμα της μορφής $(a, b, 1)$.`,
      fields: [{ label: "a =", ans: -1 }, { label: "b =", ans: -1 }], hint: R`$a + 1 = 0$, $b + 1 = 0$.`,
      sol: R`$\langle (a, b, 1), (1, 0, 1)\rangle = a + 1 = 0$, $\langle (a, b, 1), (0, 1, 1)\rangle = b + 1 = 0$: $W^\perp = \operatorname{Span}\{(-1, -1, 1)\}$ (διάσταση $3 - 2 = 1$).` },
    { level: 3, type: "fields", q: R`Στο $C[0,1]$ με $\langle f, g\rangle = \int_0^1 fg\,dx$ εφαρμόζουμε Gram–Schmidt στα $1, x$. Το $\mathbf v_2$ είναι της μορφής $x + c$. Να βρείτε το $c$ και το $\|\mathbf v_2\|^2$.`,
      fields: [{ label: "c =", ans: "-1/2" }, { label: "‖v₂‖² =", ans: "1/12" }], hint: R`$\frac{\langle x, 1\rangle}{\langle 1, 1\rangle} = \frac12$.`,
      sol: R`$\mathbf v_2 = x - \frac{1/2}{1}\cdot 1 = x - \frac12$. $\|\mathbf v_2\|^2 = \int_0^1 \left(x - \frac12\right)^2 dx = \frac13 - \frac12 + \frac14 = \frac{1}{12}$.` }
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

/* Γραμμική Άλγεβρα ΜΑΣ029 — widgets & γεννήτριες (μέρος 1: Διανύσματα στον Rⁿ) */
const l1V = v => `(${v.join(", ")})`;                                   /* διάνυσμα σε συνιστώσες */
const l1Dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
const l1Cr = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
const l1Det3 = (u, v, w) => l1Dot(u, l1Cr(v, w));
const l1P = x => x < 0 ? `(${x})` : `${x}`;
/* γραμμική έκφραση: l1Lt([2,-1,0,3],["x","y","z"],"") → "2x - y" ; πρώτος όρος χωρίς "+" */
function l1Lt(c, vars) {
  let s = "";
  c.forEach((a, i) => {
    if (a === 0) return;
    const v = vars[i], abs = Math.abs(a), body = v === "" ? `${abs}` : (abs === 1 ? v : `${abs}${v}`);
    if (s === "") s = (a < 0 ? "-" : "") + body; else s += (a < 0 ? " - " : " + ") + body;
  });
  return s === "" ? "0" : s;
}
const l1Rnd = (n, a = -5, b = 5) => Array.from({ length: n }, () => ri(a, b));
const l1Num = x => (Math.round(x * 100) / 100).toString().replace(".", ",");
/* ορθογραφική προβολή 3Δ: στροφή φ γύρω από τον z, ανύψωση e */
function l1Proj(phi, e = 0.42) {
  const c = Math.cos(phi), s = Math.sin(phi), ce = Math.cos(e), se = Math.sin(e);
  return ([x, y, z]) => { const xr = x * c + y * s, yr = -x * s + y * c; return [yr, z * ce - xr * se]; };
}
function l1Fit(pts2, W, H, pad = 24) {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  pts2.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
  const sc = Math.min((W - 2 * pad) / Math.max(x1 - x0, 1e-6), (H - 2 * pad) / Math.max(y1 - y0, 1e-6));
  const ox = (W - (x1 - x0) * sc) / 2 - x0 * sc, oy = (H - (y1 - y0) * sc) / 2 + y1 * sc;
  return ([x, y]) => [ox + x * sc, oy - y * sc];
}
function l1Arrow(svg, a, b, col, w = 2.6, lab) {
  gyAdd(svg, "line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], style: `stroke:${col};stroke-width:${w}` });
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (L > 4) { const ux = dx / L, uy = dy / L, h = Math.min(11, L / 2.5);
    gyAdd(svg, "polygon", { points: `${b[0]},${b[1]} ${b[0] - h * ux + h * .45 * uy},${b[1] - h * uy - h * .45 * ux} ${b[0] - h * ux - h * .45 * uy},${b[1] - h * uy + h * .45 * ux}`, style: `fill:${col}` }); }
  if (lab) gyAdd(svg, "text", { x: b[0] + 6, y: b[1] - 6, style: gyTS + `;font-size:13px;fill:${col}` }, lab);
}
/* 2Δ πλέγμα με αυτόματη κλίμακα */
function l1Grid(svg, W, H, lim) {
  const sc = Math.min(W, H) / (2 * lim + 1), cx = W / 2, cy = H / 2, T = ([x, y]) => [cx + x * sc, cy - y * sc];
  for (let i = -lim; i <= lim; i++) {
    gyAdd(svg, "line", { x1: T([i, -lim])[0], y1: T([i, -lim])[1], x2: T([i, lim])[0], y2: T([i, lim])[1], style: "stroke:var(--line);stroke-width:1" });
    gyAdd(svg, "line", { x1: T([-lim, i])[0], y1: T([-lim, i])[1], x2: T([lim, i])[0], y2: T([lim, i])[1], style: "stroke:var(--line);stroke-width:1" });
  }
  gyAdd(svg, "line", { x1: T([-lim, 0])[0], y1: T([-lim, 0])[1], x2: T([lim, 0])[0], y2: T([lim, 0])[1], style: "stroke:var(--navy);stroke-width:1.4" });
  gyAdd(svg, "line", { x1: T([0, -lim])[0], y1: T([0, -lim])[1], x2: T([0, lim])[0], y2: T([0, lim])[1], style: "stroke:var(--navy);stroke-width:1.4" });
  return T;
}
const l1Sl = (cls, lab, min, max, val, step = 1) => `<label>${lab} <input type="range" class="${cls}" min="${min}" max="${max}" step="${step}" value="${val}"><b class="v${cls}"></b></label>`;
function l1Read(box, names) { const o = {}; names.forEach(n => { o[n] = +$("." + n, box).value; $(".v" + n, box).textContent = String(o[n]).replace(".", ","); }); return o; }

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 1.1 πρόσθεση – βαθμωτός πολλαπλασιασμός ---------- */
  l1vec(box) {
    box.innerHTML = `<div class="wctl">${l1Sl("u1", "u₁", -4, 4, 3)}${l1Sl("u2", "u₂", -4, 4, 1)}${l1Sl("v1", "v₁", -4, 4, 1)}${l1Sl("v2", "v₂", -4, 4, 2)}${l1Sl("la", "λ", -2, 2, 1.5, 0.5)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const p = l1Read(box, ["u1", "u2", "v1", "v2", "la"]), u = [p.u1, p.u2], v = [p.v1, p.v2], s = [u[0] + v[0], u[1] + v[1]], lu = [p.la * u[0], p.la * u[1]];
      const svg = gyCanvas(box, 560, 360), T = l1Grid(svg, 560, 360, 7), O = T([0, 0]);
      gyAdd(svg, "polygon", { points: [[0, 0], u, s, v].map(q => T(q).join(",")).join(" "), style: "fill:var(--green);fill-opacity:.12;stroke:var(--muted);stroke-dasharray:5 4" });
      l1Arrow(svg, O, T(lu), "var(--gold, #c98a12)", 4, "λu");
      l1Arrow(svg, O, T(u), "var(--blue)", 2.6, "u"); l1Arrow(svg, O, T(v), "var(--red)", 2.6, "v"); l1Arrow(svg, O, T(s), "var(--green)", 2.8, "u+v");
      const f = x => String(x).replace(".", ",");
      $(".wout", box).innerHTML = `u + v = (${u[0]}, ${u[1]}) + (${v[0]}, ${v[1]}) = <b>(${s[0]}, ${s[1]})</b> — η διαγώνιος του παραλληλογράμμου.<br>
        λu = ${f(p.la)}·(${u[0]}, ${u[1]}) = <b>(${f(lu[0])}, ${f(lu[1])})</b> — ${p.la > 0 ? "ίδια" : p.la < 0 ? "αντίθετη" : "—"} φορά${p.la !== 0 ? `, μέτρο ×${f(Math.abs(p.la))}` : " (μηδενικό διάνυσμα)"}.
        <br><span class="muted">Οι πράξεις γίνονται κατά συνιστώσες· η γεωμετρική εικόνα είναι ο κανόνας του παραλληλογράμμου.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 1.2 εσωτερικό γινόμενο – γωνία – προβολή ---------- */
  l1proj(box) {
    box.innerHTML = `<div class="wctl">${l1Sl("u1", "u₁", -5, 5, 2)}${l1Sl("u2", "u₂", -5, 5, 4)}${l1Sl("v1", "v₁", -5, 5, 5)}${l1Sl("v2", "v₂", -5, 5, 1)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const p = l1Read(box, ["u1", "u2", "v1", "v2"]), u = [p.u1, p.u2], v = [p.v1, p.v2], d = l1Dot(u, v), vv = l1Dot(v, v), uu = l1Dot(u, u);
      const svg = gyCanvas(box, 560, 360), T = l1Grid(svg, 560, 360, 7), O = T([0, 0]);
      let txt;
      if (vv === 0 || uu === 0) { txt = "Η γωνία ορίζεται μόνο για <b>μη μηδενικά</b> διανύσματα."; }
      else {
        const pr = [d / vv * v[0], d / vv * v[1]];
        gyAdd(svg, "line", { x1: T(u)[0], y1: T(u)[1], x2: T(pr)[0], y2: T(pr)[1], style: "stroke:var(--muted);stroke-width:1.6;stroke-dasharray:5 4" });
        l1Arrow(svg, O, T(pr), "var(--green)", 5); { const m = T([pr[0] / 2, pr[1] / 2]); gyAdd(svg, "text", { x: m[0] + 8, y: m[1] + 18, style: gyTS + ";font-size:12px;fill:var(--green)" }, "προβολή"); }
        const th = Math.acos(Math.max(-1, Math.min(1, d / Math.sqrt(uu * vv)))), deg = th * 180 / Math.PI;
        const a1 = Math.atan2(v[1], v[0]), a2 = Math.atan2(u[1], u[0]); let da = a2 - a1; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
        const rr = 34, pts = []; for (let k = 0; k <= 24; k++) { const t = a1 + da * k / 24; pts.push(`${O[0] + rr * Math.cos(t)},${O[1] - rr * Math.sin(t)}`); }
        gyAdd(svg, "polyline", { points: pts.join(" "), style: "fill:none;stroke:var(--navy);stroke-width:1.6" });
        txt = `⟨u, v⟩ = ${u[0]}·${l1P(v[0])} + ${u[1]}·${l1P(v[1])} = <b>${d}</b> ${d === 0 ? "⇒ <b>ορθογώνια (κάθετα)</b>" : d > 0 ? "> 0 ⇒ οξεία γωνία" : "< 0 ⇒ αμβλεία γωνία"}<br>
          cos θ = ⟨u, v⟩ / (‖u‖‖v‖) = ${d} / (√${uu}·√${vv}) ≈ ${l1Num(d / Math.sqrt(uu * vv))} &nbsp;⇒&nbsp; θ ≈ <b>${l1Num(deg)}°</b><br>
          προβολή του u πάνω στο v: (⟨u,v⟩/⟨v,v⟩)·v = (${d}/${vv})·v ≈ (${l1Num(pr[0])}, ${l1Num(pr[1])})`;
      }
      l1Arrow(svg, O, T(u), "var(--blue)", 2.6, "u"); l1Arrow(svg, O, T(v), "var(--red)", 2.6, "v");
      $(".wout", box).innerHTML = txt + `<br><span class="muted">Η διακεκομμένη γραμμή (u − προβολή) είναι πάντα κάθετη στο v.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 1.3 νόρμα – τριγωνική ανισότητα – Cauchy–Schwarz ---------- */
  l1norm(box) {
    box.innerHTML = `<div class="wctl">${l1Sl("u1", "u₁", -5, 5, 3)}${l1Sl("u2", "u₂", -5, 5, 1)}${l1Sl("v1", "v₁", -5, 5, 1)}${l1Sl("v2", "v₂", -5, 5, 3)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const p = l1Read(box, ["u1", "u2", "v1", "v2"]), u = [p.u1, p.u2], v = [p.v1, p.v2], s = [u[0] + v[0], u[1] + v[1]];
      const nu = Math.hypot(...u), nv = Math.hypot(...v), ns = Math.hypot(...s), d = l1Dot(u, v);
      const svg = gyCanvas(box, 560, 360), T = l1Grid(svg, 560, 360, 6), O = T([0, 0]);
      l1Arrow(svg, O, T(u), "var(--blue)", 2.6, "u"); l1Arrow(svg, T(u), T(s), "var(--red)", 2.6);
      const mv = T([u[0] + v[0] / 2, u[1] + v[1] / 2]); gyAdd(svg, "text", { x: mv[0] + 7, y: mv[1] + 4, style: gyTS + ";font-size:13px;fill:var(--red)" }, "v"); l1Arrow(svg, O, T(s), "var(--green)", 3, "u+v");
      const bar = (y, val, col, lab) => { const w = Math.min(500, val * 30); return `<div style="display:flex;align-items:center;gap:8px;margin:3px 0"><span style="width:118px">${lab}</span><span style="display:inline-block;height:12px;width:${w / 2.2}px;max-width:62%;background:${col};border-radius:6px"></span><b>${l1Num(val)}</b></div>`; };
      $(".wout", box).innerHTML = `‖u‖ = √${l1Dot(u, u)} ≈ ${l1Num(nu)}, ‖v‖ = √${l1Dot(v, v)} ≈ ${l1Num(nv)}<br>
        <b>Τριγωνική ανισότητα:</b> ${bar(0, ns, "var(--green)", "‖u + v‖")}${bar(0, nu + nv, "var(--navy)", "‖u‖ + ‖v‖")}
        <b>Cauchy–Schwarz:</b> ${bar(0, Math.abs(d), "var(--blue)", "|⟨u, v⟩|")}${bar(0, nu * nv, "var(--navy)", "‖u‖·‖v‖")}
        <span class="muted">${Math.abs(Math.abs(d) - nu * nv) < 1e-9 ? "Ισότητα: τα διανύσματα είναι <b>συγγραμμικά</b>." : "Η ισότητα ισχύει μόνο όταν τα u, v είναι συγγραμμικά (το ένα πολλαπλάσιο του άλλου)."}</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 1.4 εξωτερικό γινόμενο – παραλληλεπίπεδο ---------- */
  l1cross(box) {
    box.innerHTML = `<div class="wctl">${l1Sl("a1", "u₁", -3, 3, 2)}${l1Sl("a2", "u₂", -3, 3, 0)}${l1Sl("a3", "u₃", -3, 3, 0)}${l1Sl("b1", "v₁", -3, 3, 0)}${l1Sl("b2", "v₂", -3, 3, 2)}${l1Sl("b3", "v₃", -3, 3, 1)}
      <label>w <select class="ws"><option value="0">—</option><option value="1" selected>(0, 0, 2)</option><option value="2">(1, 1, 2)</option><option value="3">(1, −1, 1)</option></select></label>${l1Sl("ph", "περιστροφή", -180, 180, -35, 5)}</div><div class="pl"></div><div class="wout"></div>`;
    const WS = [null, [0, 0, 2], [1, 1, 2], [1, -1, 1]];
    function draw() {
      const p = l1Read(box, ["a1", "a2", "a3", "b1", "b2", "b3", "ph"]), u = [p.a1, p.a2, p.a3], v = [p.b1, p.b2, p.b3], c = l1Cr(u, v), w = WS[+$(".ws", box).value];
      const P = l1Proj(p.ph * Math.PI / 180), add = (a, b) => a.map((x, i) => x + b[i]);
      const all = [[0, 0, 0], [4, 0, 0], [0, 4, 0], [0, 0, 4], u, v, add(u, v), c.map(x => x / 2)]; if (w) all.push(w, add(add(u, v), w));
      const S = l1Fit(all.map(P), 560, 360), Q = q => S(P(q)), O = Q([0, 0, 0]);
      const sv = gyCanvas(box, 560, 360);
      [["x", [4, 0, 0]], ["y", [0, 4, 0]], ["z", [0, 0, 4]]].forEach(([n, e]) => { const t = Q(e); gyAdd(sv, "line", { x1: O[0], y1: O[1], x2: t[0], y2: t[1], style: "stroke:var(--muted);stroke-width:1.2" }); gyAdd(sv, "text", { x: t[0] + 4, y: t[1] - 4, style: gyTS + ";font-size:12px;fill:var(--muted)" }, n); });
      const face = (pts, col, op) => gyAdd(sv, "polygon", { points: pts.map(q => Q(q).join(",")).join(" "), style: `fill:${col};fill-opacity:${op};stroke:${col};stroke-width:1` });
      face([[0, 0, 0], u, add(u, v), v], "var(--blue)", .18);
      if (w) { const uw = add(u, w), vw = add(v, w), uvw = add(add(u, v), w);
        face([w, uw, uvw, vw], "var(--blue)", .08);
        [[[0, 0, 0], w], [u, uw], [v, vw], [add(u, v), uvw]].forEach(([a, b]) => { const A = Q(a), B = Q(b); gyAdd(sv, "line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], style: "stroke:var(--navy);stroke-width:1;stroke-dasharray:4 3" }); });
        l1Arrow(sv, O, Q(w), "var(--navy)", 2.2, "w"); }
      l1Arrow(sv, O, Q(u), "var(--blue)", 2.6, "u"); l1Arrow(sv, O, Q(v), "var(--red)", 2.6, "v");
      l1Arrow(sv, O, Q(c.map(x => x / 2)), "var(--green)", 3, "½(u×v)");
      const ar = Math.hypot(...c), n2 = l1Dot(c, c);
      let t = `u × v = (${u[1]}·${l1P(v[2])} − ${l1P(u[2])}·${l1P(v[1])}, ${u[2]}·${l1P(v[0])} − ${l1P(u[0])}·${l1P(v[2])}, ${u[0]}·${l1P(v[1])} − ${l1P(u[1])}·${l1P(v[0])}) = <b>${l1V(c)}</b><br>
        ⟨u×v, u⟩ = ${l1Dot(c, u)}, ⟨u×v, v⟩ = ${l1Dot(c, v)} → κάθετο και στα δύο.<br>
        Εμβαδόν παραλληλογράμμου = ‖u × v‖ = √${n2} ≈ <b>${l1Num(ar)}</b>${n2 === 0 ? " (συγγραμμικά διανύσματα)" : ""}`;
      if (w) { const V = l1Det3(w, u, v); t += `<br>Μικτό γινόμενο ⟨w, u × v⟩ = ${V} ⇒ όγκος παραλληλεπιπέδου = |${V}| = <b>${Math.abs(V)}</b>`; }
      $(".wout", box).innerHTML = t + `<br><span class="muted">Το πράσινο βέλος (σε μισή κλίμακα) δείχνει την κατεύθυνση του u × v — κανόνας του δεξιού χεριού.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 1.5 τετραγωνικές επιφάνειες ---------- */
  l1quad(box) {
    const TY = [["ell", "Ελλειψοειδές", "\\frac{x^2}{a^2}+\\frac{y^2}{b^2}+\\frac{z^2}{c^2}=1", "Όλες οι τομές με επίπεδα z = k (|k| < c) είναι ελλείψεις."],
      ["epar", "Ελλειπτικό παραβολοειδές", "\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=\\frac{z}{c}", "Τομές z = k > 0: ελλείψεις · τομές x = 0, y = 0: παραβολές."],
      ["cone", "Ελλειπτικός κώνος", "\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=\\frac{z^2}{c^2}", "Τομές z = k ≠ 0: ελλείψεις · τομές x = 0: δύο ευθείες."],
      ["h1", "Υπερβολοειδές ενός φύλλου", "\\frac{x^2}{a^2}+\\frac{y^2}{b^2}-\\frac{z^2}{c^2}=1", "Τομές z = k: ελλείψεις (για κάθε k) · τομές x = 0: υπερβολές."],
      ["h2", "Υπερβολοειδές δύο φύλλων", "\\frac{z^2}{c^2}-\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1", "Δεν υπάρχουν σημεία για |z| < c · τομές z = k (|k| > c): ελλείψεις."],
      ["hpar", "Υπερβολικό παραβολοειδές (σάγμα)", "\\frac{y^2}{b^2}-\\frac{x^2}{a^2}=\\frac{z}{c}", "Τομές z = k: υπερβολές · τομές x = 0 και y = 0: παραβολές που ανοίγουν προς αντίθετες φορές."]];
    box.innerHTML = `<div class="wctl"><label>επιφάνεια <select class="ty">${TY.map((t, i) => `<option value="${i}">${t[1]}</option>`).join("")}</select></label>
      ${l1Sl("a", "a", 0.5, 3, 1.5, 0.5)}${l1Sl("b", "b", 0.5, 3, 1, 0.5)}${l1Sl("c", "c", 0.5, 3, 1, 0.5)}${l1Sl("ph", "περιστροφή", -180, 180, -35, 5)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const p = l1Read(box, ["a", "b", "c", "ph"]), ty = TY[+$(".ty", box).value], k = ty[0], { a, b, c } = p;
      const ch = Math.cosh, sh = Math.sinh, cs = Math.cos, sn = Math.sin, N = 24, M = 10;
      let f, s0, s1, sheets = [1];
      if (k === "ell") { f = (s, t) => [a * sn(s) * cs(t), b * sn(s) * sn(t), c * cs(s)]; s0 = 0; s1 = Math.PI; }
      if (k === "epar") { f = (s, t) => [a * s * cs(t), b * s * sn(t), c * s * s]; s0 = 0; s1 = 1.6; }
      if (k === "cone") { f = (s, t) => [a * s * cs(t), b * s * sn(t), c * s]; s0 = -1.6; s1 = 1.6; }
      if (k === "h1") { f = (s, t) => [a * ch(s) * cs(t), b * ch(s) * sn(t), c * sh(s)]; s0 = -1.2; s1 = 1.2; }
      if (k === "h2") { f = (s, t, g) => [a * sh(s) * cs(t), b * sh(s) * sn(t), g * c * ch(s)]; s0 = 0; s1 = 1.3; sheets = [1, -1]; }
      const curves = [];
      if (k === "hpar") {
        const g = (x, y) => [x, y, c * (y * y / (b * b) - x * x / (a * a))];
        for (let i = 0; i <= M; i++) { const x = -1.5 * a + 3 * a * i / M, y = -1.5 * b + 3 * b * i / M, c1 = [], c2 = [];
          for (let j = 0; j <= N; j++) { c1.push(g(x, -1.5 * b + 3 * b * j / N)); c2.push(g(-1.5 * a + 3 * a * j / N, y)); } curves.push(c1, c2); }
      } else sheets.forEach(gs => {
        for (let i = 0; i <= M; i++) { const s = s0 + (s1 - s0) * i / M, cc = []; for (let j = 0; j <= N; j++) cc.push(f(s, 2 * Math.PI * j / N, gs)); curves.push(cc); }
        for (let j = 0; j < 16; j++) { const t = 2 * Math.PI * j / 16, cc = []; for (let i = 0; i <= N; i++) cc.push(f(s0 + (s1 - s0) * i / N, t, gs)); curves.push(cc); }
      });
      const P = l1Proj(p.ph * Math.PI / 180), allp = curves.flat().map(P), L = Math.max(...curves.flat().map(q => Math.max(Math.abs(q[0]), Math.abs(q[1]), Math.abs(q[2])))) * 1.15;
      const ax = [[[-L, 0, 0], [L, 0, 0], "x"], [[0, -L, 0], [0, L, 0], "y"], [[0, 0, -L], [0, 0, L], "z"]];
      ax.forEach(([q1, q2]) => allp.push(P(q1), P(q2)));
      const S = l1Fit(allp, 560, 380, 18), Q = q => S(P(q)), svg = gyCanvas(box, 560, 380);
      ax.forEach(([q1, q2, n]) => { const A = Q(q1), B = Q(q2); gyAdd(svg, "line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], style: "stroke:var(--muted);stroke-width:1.2" }); gyAdd(svg, "text", { x: B[0] + 4, y: B[1] - 4, style: gyTS + ";font-size:12px;fill:var(--muted)" }, n); });
      curves.forEach((cc, i) => gyAdd(svg, "polyline", { points: cc.map(q => Q(q).join(",")).join(" "), style: `fill:none;stroke:${i % 2 ? "var(--blue)" : "var(--navy)"};stroke-opacity:.55;stroke-width:1.1` }));
      $(".wout", box).innerHTML = `<b>${ty[1]}</b>: $${ty[2]}$ &nbsp; (a = ${String(a).replace(".", ",")}, b = ${String(b).replace(".", ",")}, c = ${String(c).replace(".", ",")})<br><span class="muted">${ty[3]} Γύρισε την επιφάνεια με τη «περιστροφή» για να δεις τις τομές (ίχνη).</span>`;
      if (window.renderMathInElement) renderMathInElement($(".wout", box), { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  l1lin: { title: "Γεννήτρια — πράξεις διανυσμάτων", make() {
    const t = ri(0, 2);
    if (t === 0) {
      const n = ri(3, 4), u = l1Rnd(n), v = l1Rnd(n); let a, b; do { a = gyNZ(-4, 4); b = gyNZ(-4, 4); } while (Math.abs(a) === 1 && Math.abs(b) === 1);
      const r = u.map((x, i) => a * x + b * v[i]), ex = l1Lt([a, b], ["\\vec u", "\\vec v"]);
      return { q: R`Δίνονται $\vec u = ${l1V(u)}$ και $\vec v = ${l1V(v)}$ στον $\mathbb{R}^${n}$. Να υπολογίσετε το $${ex}$.`,
        fields: r.map((x, i) => ({ label: `${i + 1}η συνιστώσα =`, ans: x })),
        sol: R`Κατά συνιστώσες: $${ex} = ${l1V(u.map((x, i) => `${a}\\cdot ${l1P(x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)}\\cdot ${l1P(v[i])}`))} = ${l1V(r)}$.` };
    }
    if (t === 1) {
      let p, q, r, s, la, mu; do { [p, q, r, s] = l1Rnd(4, -4, 4); la = gyNZ(-4, 4); mu = gyNZ(-4, 4); } while (p * s - q * r === 0 || (p === 0 && q === 0) || (r === 0 && s === 0));
      const e = la * p + mu * r, f = la * q + mu * s;
      return { q: R`Να βρείτε $\lambda, \mu \in \mathbb{R}$ ώστε $\lambda ${l1V([p, q])} + \mu ${l1V([r, s])} = ${l1V([e, f])}$.`, fields: [{ label: "λ =", ans: la }, { label: "μ =", ans: mu }],
        sol: R`Ισότητα συνιστωσών: $${l1Lt([p, r], ["\\lambda", "\\mu"])} = ${e}$ και $${l1Lt([q, s], ["\\lambda", "\\mu"])} = ${f}$. Η λύση του συστήματος (ορίζουσα $${p * s - q * r} \ne 0$, άρα μοναδική) είναι $\lambda = ${la}$, $\mu = ${mu}$. Επαλήθευση: $${la}${l1V([p, q])} + ${l1P(mu)}${l1V([r, s])} = ${l1V([e, f])}$.` };
    }
    const x = ri(-6, 6), y = ri(-6, 6), z = gyNZ(-6, 6);
    return { q: R`Να βρείτε τα $x, y, z$ ώστε $(x + y,\ x - y,\ ${z}) = (${x + y},\ ${x - y},\ z)$.`, fields: [{ label: "x =", ans: x }, { label: "y =", ans: y }, { label: "z =", ans: z }],
      sol: R`Δύο διανύσματα του $\mathbb{R}^3$ είναι ίσα αν και μόνο αν έχουν ίσες αντίστοιχες συνιστώσες: $x + y = ${x + y}$, $x - y = ${x - y}$, $z = ${z}$. Προσθέτοντας: $2x = ${2 * x}$, άρα $x = ${x}$, $y = ${y}$.` };
  } },
  l1dot: { title: "Γεννήτρια — εσωτερικό γινόμενο, ορθογωνιότητα, προβολή", make() {
    const t = ri(0, 3);
    if (t === 0) { const u = l1Rnd(4), v = l1Rnd(4), d = l1Dot(u, v);
      return { q: R`Να υπολογίσετε το εσωτερικό γινόμενο $\langle \vec u, \vec v\rangle$ για $\vec u = ${l1V(u)}$, $\vec v = ${l1V(v)}$.`, fields: [{ label: "⟨u, v⟩ =", ans: d }],
        sol: R`$\langle \vec u, \vec v\rangle = ${u.map((x, i) => `${l1P(x)}\\cdot ${l1P(v[i])}`).join(" + ")} = ${d}$${d === 0 ? " — τα διανύσματα είναι ορθογώνια" : ""}.` }; }
    if (t === 1) { let a, b, c, d, e; do { [a, b, d, e] = l1Rnd(4); c = gyNZ(-5, 5); } while (a * d + b * e === 0);
      const k = gyF(-(a * d + b * e), c);
      return { q: R`Να βρείτε το $k$ ώστε τα $\vec u = (k, ${a}, ${b})$ και $\vec v = (${c}, ${d}, ${e})$ να είναι ορθογώνια.`, fields: [{ label: "k =", ans: k }],
        sol: R`$\langle \vec u, \vec v\rangle = ${gyC(c, "k")} ${a * d + b * e < 0 ? "-" : "+"} ${Math.abs(a * d + b * e)} = 0 \Rightarrow k = ${gyT(-(a * d + b * e), c)}$.` }; }
    if (t === 2) { let u, v, d; do { u = l1Rnd(3); v = l1Rnd(3); d = l1Dot(u, v); } while (l1Dot(u, u) === 0 || l1Dot(v, v) === 0 || (ri(0, 3) && d === 0));
      const ci = d > 0 ? 0 : d === 0 ? 1 : 2;
      return bkMC({ q: R`Η γωνία των $\vec u = ${l1V(u)}$ και $\vec v = ${l1V(v)}$ είναι:`, sol: R`$\langle \vec u, \vec v\rangle = ${d} ${d > 0 ? "> 0" : d < 0 ? "< 0" : "= 0"}$, άρα $\cos\theta ${d > 0 ? "> 0" : d < 0 ? "< 0" : "= 0"}$: ${["οξεία", "ορθή", "αμβλεία"][ci]} γωνία.` }, ["οξεία", "ορθή", "αμβλεία"], ci); }
    let u, v; do { u = l1Rnd(3, -4, 4); v = l1Rnd(3, -2, 2); } while (l1Dot(v, v) === 0 || l1Dot(u, v) === 0);
    const d = l1Dot(u, v), vv = l1Dot(v, v);
    return { q: R`Να βρείτε την ορθογώνια προβολή του $\vec u = ${l1V(u)}$ πάνω στο $\vec v = ${l1V(v)}$.`, fields: v.map((x, i) => ({ label: `${i + 1}η συνιστώσα =`, ans: gyF(d * x, vv) })),
      sol: R`$\text{προβ}_{\vec v}\vec u = \dfrac{\langle \vec u, \vec v\rangle}{\langle \vec v, \vec v\rangle}\vec v = \dfrac{${d}}{${vv}}${l1V(v)} = \left(${v.map(x => gyT(d * x, vv)).join(", ")}\right)$.` };
  } },
  l1norm: { title: "Γεννήτρια — νόρμα, απόσταση, μοναδιαίο διάνυσμα", make() {
    const Bs = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [6, 6, 7, 11], [2, 10, 11, 15]];
    const pick = () => { const b = bkPick(Bs), p = shuffle([0, 1, 2]); return [p.map(i => b[i] * (ri(0, 1) ? 1 : -1)), b[3]]; };
    const t = ri(0, 3), [w, n] = pick();
    if (t === 0) return { q: R`Να βρείτε τη νόρμα του $\vec u = ${l1V(w)}$.`, fields: [{ label: "‖u‖ =", ans: n }], sol: R`$\|\vec u\| = \sqrt{${w.map(x => `${l1P(x)}^2`).join(" + ")}} = \sqrt{${n * n}} = ${n}$.` };
    if (t === 1) { const P = l1Rnd(3), Qp = P.map((x, i) => x + w[i]);
      return { q: R`Να βρείτε την απόσταση των σημείων $P${l1V(P)}$ και $Q${l1V(Qp)}$ του $\mathbb{R}^3$.`, fields: [{ label: "d =", ans: n }],
        sol: R`$d = \|\vec{Q} - \vec{P}\| = \|${l1V(w)}\| = \sqrt{${n * n}} = ${n}$.` }; }
    if (t === 2) return { q: R`Να κανονικοποιήσετε το $\vec u = ${l1V(w)}$, δηλαδή να βρείτε το μοναδιαίο $\vec e_u$ με την ίδια διεύθυνση και φορά.`, fields: w.map((x, i) => ({ label: `${i + 1}η συνιστώσα =`, ans: gyF(x, n) })),
      sol: R`$\|\vec u\| = ${n}$, άρα $\vec e_u = \dfrac{\vec u}{\|\vec u\|} = \left(${w.map(x => gyT(x, n)).join(", ")}\right)$.` };
    const L = n * ri(2, 4);
    return { q: R`Να βρείτε το διάνυσμα με μήκος $${L}$ και ίδια κατεύθυνση και φορά με το $\vec u = ${l1V(w)}$.`, fields: w.map((x, i) => ({ label: `${i + 1}η συνιστώσα =`, ans: x * L / n })),
      sol: R`$${L}\,\vec e_u = ${L}\cdot\dfrac{1}{${n}}${l1V(w)} = ${l1V(w.map(x => x * L / n))}$.` };
  } },
  l1cross: { title: "Γεννήτρια — εξωτερικό και μικτό γινόμενο", make() {
    const t = ri(0, 2);
    if (t === 0) { let u, v, c; do { u = l1Rnd(3, -4, 4); v = l1Rnd(3, -4, 4); c = l1Cr(u, v); } while (l1Dot(c, c) === 0);
      return { q: R`Να υπολογίσετε το εξωτερικό γινόμενο $\vec u \times \vec v$ για $\vec u = ${l1V(u)}$, $\vec v = ${l1V(v)}$.`, fields: c.map((x, i) => ({ label: `${"ijk"[i]}: συνιστώσα =`, ans: x })),
        sol: R`$\vec u\times\vec v = \begin{vmatrix} \vec i & \vec j & \vec k\\ ${u.join(" & ")}\\ ${v.join(" & ")}\end{vmatrix} = (${l1P(u[1])}\cdot${l1P(v[2])} - ${l1P(u[2])}\cdot${l1P(v[1])})\vec i - (${l1P(u[0])}\cdot${l1P(v[2])} - ${l1P(u[2])}\cdot${l1P(v[0])})\vec j + (${l1P(u[0])}\cdot${l1P(v[1])} - ${l1P(u[1])}\cdot${l1P(v[0])})\vec k = ${l1V(c)}$.` }; }
    if (t === 1) { let u, v, w, V; do { u = l1Rnd(3, -3, 3); v = l1Rnd(3, -3, 3); w = l1Rnd(3, -3, 3); V = l1Det3(u, v, w); } while (V === 0);
      return { q: R`Να βρείτε τον όγκο του παραλληλεπιπέδου που ορίζουν τα $\vec u = ${l1V(u)}$, $\vec v = ${l1V(v)}$, $\vec w = ${l1V(w)}$.`, fields: [{ label: "όγκος =", ans: Math.abs(V) }],
        sol: R`Μικτό γινόμενο: $\langle \vec u, \vec v\times\vec w\rangle = \begin{vmatrix} ${u.join(" & ")}\\ ${v.join(" & ")}\\ ${w.join(" & ")}\end{vmatrix} = ${V}$. Όγκος $= |${V}| = ${Math.abs(V)}$.` }; }
    let A, B, C, c; do { A = l1Rnd(3, -3, 3); B = l1Rnd(3, -3, 3); C = l1Rnd(3, -3, 3); c = l1Cr(B.map((x, i) => x - A[i]), C.map((x, i) => x - A[i])); } while (l1Dot(c, c) === 0);
    const AB = B.map((x, i) => x - A[i]), AC = C.map((x, i) => x - A[i]), n2 = l1Dot(c, c);
    return { q: R`Για το τρίγωνο με κορυφές $A${l1V(A)}$, $B${l1V(B)}$, $\Gamma${l1V(C)}$ ισχύει $E = \tfrac12\|\vec{AB}\times\vec{A\Gamma}\|$. Να βρείτε το $\|\vec{AB}\times\vec{A\Gamma}\|^2$.`, fields: [{ label: "‖AB × AΓ‖² =", ans: n2 }],
      sol: R`$\vec{AB} = ${l1V(AB)}$, $\vec{A\Gamma} = ${l1V(AC)}$, $\vec{AB}\times\vec{A\Gamma} = ${l1V(c)}$, άρα $\|\cdot\|^2 = ${c.map(x => `${l1P(x)}^2`).join(" + ")} = ${n2}$ και $E = \tfrac12\sqrt{${n2}}$.` };
  } },
  l1plane: { title: "Γεννήτρια — ευθείες, επίπεδα, τετραγωνικές επιφάνειες", make() {
    const t = ri(0, 3);
    if (t === 0) { let nn; do nn = l1Rnd(3, -4, 4); while (nn.filter(x => x).length < 2); const P = l1Rnd(3), d = l1Dot(nn, P);
      return { q: R`Το επίπεδο που διέρχεται από το $P${l1V(P)}$ και έχει κάθετο διάνυσμα $\vec n = ${l1V(nn)}$ έχει εξίσωση $${l1Lt(nn, ["x", "y", "z"])} = \delta$. Να βρείτε το $\delta$.`, fields: [{ label: "δ =", ans: d }],
        sol: R`$\langle \vec n, \vec x - \vec P\rangle = 0 \iff ${l1Lt(nn, ["x", "y", "z"])} = \langle \vec n, \vec P\rangle = ${nn.map((x, i) => `${l1P(x)}\\cdot${l1P(P[i])}`).join(" + ")} = ${d}$.` }; }
    if (t === 1) { const Bs = [[1, 2, 2, 3], [2, 3, 6, 7], [2, 1, 2, 3], [1, 4, 8, 9], [4, 4, 7, 9]], b = bkPick(Bs), p = shuffle([0, 1, 2]), nn = p.map(i => b[i] * (ri(0, 1) ? 1 : -1)), n = b[3];
      const P = l1Rnd(3, -4, 4); let d; do d = ri(-9, 9); while (l1Dot(nn, P) - d === 0); const num = Math.abs(l1Dot(nn, P) - d);
      return { q: R`Να βρείτε την απόσταση του σημείου $P${l1V(P)}$ από το επίπεδο $${l1Lt(nn, ["x", "y", "z"])} = ${d}$.`, fields: [{ label: "απόσταση =", ans: gyF(num, n) }],
        sol: R`$d = \dfrac{|${nn.map((x, i) => `${l1P(x)}\\cdot${l1P(P[i])}`).join(" + ")} - ${l1P(d)}|}{\sqrt{${nn.map(x => `${l1P(x)}^2`).join(" + ")}}} = \dfrac{${num}}{${n}}${gcdI(num, n) > 1 ? ` = ${gyT(num, n)}` : ""}$.` }; }
    if (t === 2) { let nn, dv; do { nn = l1Rnd(3, -3, 3); dv = l1Rnd(3, -3, 3); } while (l1Dot(nn, dv) === 0 || nn.filter(x => x).length < 2);
      const A = l1Rnd(3, -4, 4), t0 = gyNZ(-3, 3), P = A.map((x, i) => x + t0 * dv[i]), d = l1Dot(nn, P);
      const ln = ["x", "y", "z"].map((v, i) => `${v} = ${l1Lt([A[i], dv[i]], ["", "t"])}`).join(",\\ ");
      return { q: R`Να βρείτε το σημείο τομής της ευθείας $${ln}$ ($t\in\mathbb{R}$) με το επίπεδο $${l1Lt(nn, ["x", "y", "z"])} = ${d}$.`, fields: P.map((x, i) => ({ label: `${"xyz"[i]} =`, ans: x })),
        sol: R`Αντικαθιστούμε: $${nn.map((c, i) => [c, i]).filter(([c]) => c !== 0).map(([c, i], j) => `${c === 1 ? (j ? "+ " : "") : c === -1 ? (j ? "- " : "-") : (j ? (c < 0 ? "- " + -c : "+ " + c) : c)}(${l1Lt([A[i], dv[i]], ["", "t"])})`).join(" ")} = ${d} \Rightarrow ${l1Lt([l1Dot(nn, dv)], ["t"])} = ${d - l1Dot(nn, A)} \Rightarrow t = ${t0}$. Σημείο: $${l1V(P)}$.` }; }
    const a = ri(2, 5), b = ri(2, 5), c = ri(2, 5), k = ri(0, 3);
    const eqs = [R`\frac{x^2}{${a * a}} + \frac{y^2}{${b * b}} + \frac{z^2}{${c * c}} = 1`, R`\frac{x^2}{${a * a}} + \frac{y^2}{${b * b}} - \frac{z^2}{${c * c}} = 1`, R`\frac{z^2}{${c * c}} - \frac{x^2}{${a * a}} - \frac{y^2}{${b * b}} = 1`, R`z = \frac{y^2}{${b * b}} - \frac{x^2}{${a * a}}`];
    const nm = ["ελλειψοειδές", "υπερβολοειδές ενός φύλλου", "υπερβολοειδές δύο φύλλων", "υπερβολικό παραβολοειδές (σάγμα)"];
    const why = ["τρία θετικά τετράγωνα $= 1$", "δύο θετικά και ένα αρνητικό τετράγωνο $= 1$ (τομές $z = k$: πάντα ελλείψεις)", "ένα θετικό και δύο αρνητικά τετράγωνα $= 1$ (για $|z| < " + c + "$ δεν υπάρχουν σημεία)", "ο $z$ είναι διαφορά δύο τετραγώνων: οι τομές $x = 0$, $y = 0$ είναι παραβολές που ανοίγουν προς αντίθετες φορές"];
    return bkMC({ q: R`Η επιφάνεια $${eqs[k]}$ είναι:`, sol: R`Είναι ${nm[k]}: ${why[k]}.` }, nm, k);
  } }
});

/* Γραμμική Άλγεβρα ΜΑΣ029 — widgets & γεννήτριες (μέρος 2: Διανυσματικοί χώροι, βάση, διάσταση) */
/* ---------- βοηθητικά ---------- */
const l2Tup = a => "(" + a.join(", ") + ")";                                                     /* (a, b, c) */
const l2Col = a => "\\begin{pmatrix}" + a.join("\\\\") + "\\end{pmatrix}";                       /* στήλη */
const l2Num = x => { const r = Math.round(x * 100) / 100; return String(r).replace(".", ","); };
const l2Pa = x => x < 0 ? `(${x})` : `${x}`;
const l2Cf = (c, v) => c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`;
const l2NZ = (a, b) => { let v; do v = ri(a, b); while (v === 0); return v; };
const l2Vec = (n, a = -4, b = 4) => Array.from({ length: n }, () => ri(a, b));
const l2Det2 = (a, b) => a[0] * b[1] - a[1] * b[0];
const l2Det3 = (a, b, c) => a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);
/* ρητή αριθμητική: [αριθμητής, παρονομαστής] */
const l2Fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcdI(Math.abs(n), d) || 1; return [n / g, d / g]; };
const l2FAdd = (a, b) => l2Fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const l2FMul = (a, b) => l2Fr(a[0] * b[0], a[1] * b[1]);
const l2FDiv = (a, b) => l2Fr(a[0] * b[1], a[1] * b[0]);
const l2FS = a => a[1] === 1 ? String(a[0]) : `${a[0]}/${a[1]}`;
const l2FT = a => a[1] === 1 ? String(a[0]) : `${a[0] < 0 ? "-" : ""}\\tfrac{${Math.abs(a[0])}}{${a[1]}}`;
/* ανηγμένη κλιμακωτή μορφή (ακριβής) */
function l2Rref(M) {
  const A = M.map(r => r.map(x => l2Fr(Math.round(+x) || 0))), m = A.length, n = A[0].length, piv = [];
  let r = 0;
  for (let c = 0; c < n && r < m; c++) {
    let p = -1; for (let i = r; i < m; i++) if (A[i][c][0] !== 0) { p = i; break; }
    if (p < 0) continue;
    [A[r], A[p]] = [A[p], A[r]];
    const inv = l2FDiv([1, 1], A[r][c]); A[r] = A[r].map(x => l2FMul(x, inv));
    for (let i = 0; i < m; i++) if (i !== r && A[i][c][0] !== 0) { const f = A[i][c]; A[i] = A[i].map((x, j) => l2FAdd(x, l2FMul([-f[0], f[1]], A[r][j]))); }
    piv.push(c); r++;
  }
  return { A, piv, rank: piv.length };
}
const l2Rank = M => l2Rref(M).rank;
/* επίπεδο R² για σχήματα */
function l2Plane(box, lim = 5, W = 560, H = 380) {
  const svg = gyCanvas(box, W, H), cx = W / 2, cy = H / 2, s = Math.min(W, H) / (2 * lim + 1);
  const X = x => cx + x * s, Y = y => cy - y * s;
  for (let k = -lim; k <= lim; k++) {
    gyAdd(svg, "line", { x1: X(k), y1: Y(-lim - .5), x2: X(k), y2: Y(lim + .5), style: "stroke:var(--line);stroke-width:1" });
    gyAdd(svg, "line", { x1: X(-lim - .5), y1: Y(k), x2: X(lim + .5), y2: Y(k), style: "stroke:var(--line);stroke-width:1" });
  }
  gyAdd(svg, "line", { x1: X(-lim - .5), y1: Y(0), x2: X(lim + .5), y2: Y(0), style: "stroke:var(--muted);stroke-width:1.4" });
  gyAdd(svg, "line", { x1: X(0), y1: Y(-lim - .5), x2: X(0), y2: Y(lim + .5), style: "stroke:var(--muted);stroke-width:1.4" });
  const arrow = (x0, y0, x1, y1, col, lab, w = 2.6) => {
    const ax = X(x1), ay = Y(y1), bx = X(x0), by = Y(y0), L = Math.hypot(ax - bx, ay - by);
    if (L < 2) { gyAdd(svg, "circle", { cx: ax, cy: ay, r: 4, style: `fill:${col}` }); }
    else {
      const ux = (ax - bx) / L, uy = (ay - by) / L, h = Math.min(11, L * .45);
      gyAdd(svg, "line", { x1: bx, y1: by, x2: ax - ux * h * .8, y2: ay - uy * h * .8, style: `stroke:${col};stroke-width:${w}` });
      gyAdd(svg, "polygon", { points: `${ax},${ay} ${ax - ux * h - uy * h * .45},${ay - uy * h + ux * h * .45} ${ax - ux * h + uy * h * .45},${ay - uy * h - ux * h * .45}`, style: `fill:${col}` });
    }
    if (lab) gyAdd(svg, "text", { x: ax + 6, y: ay - 6, style: gyTS + `;fill:${col}` }, lab);
  };
  const clipLine = (dx, dy, px = 0, py = 0, col = "var(--blue)", w = 2) => {          /* ευθεία p + t·d */
    const T = 4 * lim; gyAdd(svg, "line", { x1: X(px - T * dx), y1: Y(py - T * dy), x2: X(px + T * dx), y2: Y(py + T * dy), style: `stroke:${col};stroke-width:${w};stroke-opacity:.75` });
  };
  const inside = (x, y) => Math.abs(x) <= lim + .5 && Math.abs(y) <= lim + .5;
  return { svg, X, Y, s, arrow, clipLine, inside, lim, W, H };
}

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 2.1 Έλεγχος αξιωμάτων ---------- */
  l2axioms(box) {
    const SP = [
      { n: "ℝ² με τις συνήθεις πράξεις", d: 2, pos: false, add: (u, v) => [u[0] + v[0], u[1] + v[1]], sc: (l, u) => [l * u[0], l * u[1]], zero: () => [0, 0], neg: u => [-u[0], -u[1]] },
      { n: "ℝ² με λ·(x, y) = (λx, 0)", d: 2, pos: false, add: (u, v) => [u[0] + v[0], u[1] + v[1]], sc: (l, u) => [l * u[0], 0], zero: () => [0, 0], neg: u => [-u[0], -u[1]] },
      { n: "ℝ με x ⊕ y = x + y, λ ⊙ x = λ²x", d: 1, pos: false, add: (u, v) => [u[0] + v[0]], sc: (l, u) => [l * l * u[0]], zero: () => [0], neg: u => [-u[0]] },
      { n: "(0, +∞) με x ⊕ y = xy, λ ⊙ x = x^λ", d: 1, pos: true, add: (u, v) => [u[0] * v[0]], sc: (l, u) => [Math.pow(u[0], l)], zero: () => [1], neg: u => [1 / u[0]] },
      { n: "ℝ² με (x, y) ⊕ (x′, y′) = (x + x′, 0)", d: 2, pos: false, add: (u, v) => [u[0] + v[0], 0], sc: (l, u) => [l * u[0], l * u[1]], zero: null, neg: null },
      { n: "ℝ² με (x, y) ⊕ (x′, y′) = (x + x′ − 1, y + y′ + 2), λ ⊙ (x, y) = (λ(x − 1) + 1, λ(y + 2) − 2)", d: 2, pos: false,
        add: (u, v) => [u[0] + v[0] - 1, u[1] + v[1] + 2], sc: (l, u) => [l * (u[0] - 1) + 1, l * (u[1] + 2) - 2], zero: () => [1, -2], neg: u => [2 - u[0], -4 - u[1]] }
    ];
    box.innerHTML = `<div class="wctl"><label>σύνολο <select class="rs">${SP.map((s, i) => `<option value="${i}">${s.n}</option>`).join("")}</select></label>
      <button class="btn ghost rn" type="button">νέα τυχαία δοκιμή</button></div><div class="wout"></div>`;
    const eq = (a, b) => a.every((x, i) => Math.abs(x - b[i]) < 1e-9 * Math.max(1, Math.abs(x), Math.abs(b[i])));
    const show = a => a.length === 1 ? l2Num(a[0]) : "(" + a.map(l2Num).join(", ") + ")";
    function run() {
      const S = SP[+$(".rs", box).value], rv = () => Array.from({ length: S.d }, () => S.pos ? bkPick([.5, 2, 3, 4, 5]) : l2NZ(-4, 4));
      const u = rv(), v = rv(), w = rv(), l = bkPick([-2, 2, 3]), m = bkPick([-1, 2, 4].filter(x => x !== l));
      const T = [
        ["A1", "(u + v) + w = u + (v + w)", S.add(S.add(u, v), w), S.add(u, S.add(v, w))],
        ["A2", "υπάρχει 0 με u + 0 = u", S.zero ? S.add(u, S.zero()) : null, u],
        ["A3", "υπάρχει −u με u + (−u) = 0", S.neg ? S.add(u, S.neg(u)) : null, S.zero ? S.zero() : null],
        ["A4", "u + v = v + u", S.add(u, v), S.add(v, u)],
        ["B1", "λ(u + v) = λu + λv", S.sc(l, S.add(u, v)), S.add(S.sc(l, u), S.sc(l, v))],
        ["B2", "(λ + μ)u = λu + μu", S.sc(l + m, u), S.add(S.sc(l, u), S.sc(m, u))],
        ["B3", "(λμ)u = λ(μu)", S.sc(l * m, u), S.sc(l, S.sc(m, u))],
        ["B4", "1·u = u", S.sc(1, u), u]
      ];
      let bad = 0;
      const rows = T.map(([k, d, a, b]) => {
        const ok = a && b && eq(a, b); if (!ok) bad++;
        const why = !a || !b ? "δεν υπάρχει μηδενικό στοιχείο" : ok ? `${show(a)}` : `${show(a)} ≠ ${show(b)}`;
        return `<tr><td style="padding:2px 10px 2px 0"><b>${k}</b></td><td style="padding:2px 10px 2px 0">${d}</td><td style="color:${ok ? "var(--green)" : "var(--red)"};font-weight:700">${ok ? "✓" : "✗"}</td><td class="muted" style="padding-left:8px">${why}</td></tr>`;
      }).join("");
      $(".wout", box).innerHTML = `Δοκιμή με u = ${show(u)}, v = ${show(v)}, w = ${show(w)}, λ = ${l}, μ = ${m}${S.zero ? `, 0 = ${show(S.zero())}` : ""}
        <div style="overflow-x:auto"><table class="wtab" style="margin-top:6px;border-collapse:collapse;font-size:14px"><tbody>${rows}</tbody></table></div>
        <b>${bad ? `Αποτυγχάνει${bad > 1 ? "ουν" : ""} ${bad} αξίωμα${bad > 1 ? "τα" : ""}: ΔΕΝ είναι διανυσματικός χώρος.` : "Όλα τα αξιώματα ισχύουν στη δοκιμή."}</b>
        <br><span class="muted">Ένα αντιπαράδειγμα αρκεί για να αποτύχει ένα αξίωμα· για να ισχύει, χρειάζεται απόδειξη για όλα τα u, v, w, λ, μ (η δοκιμή απλώς το επιβεβαιώνει).</span>`;
    }
    $(".rs", box).onchange = run; $(".rs", box).oninput = run; $(".rn", box).onclick = run; run();
  },

  /* ---------- 2.2 Κριτήριο υποχώρου στο R² ---------- */
  l2sub(box) {
    const SETS = [
      { n: "ευθεία y = 2x", in: (x, y) => Math.abs(y - 2 * x) < 1e-9, pick: () => { const t = bkPick([-1.5, -1, -.5, .5, 1, 1.5]); return [t, 2 * t]; }, draw: P => P.clipLine(1, 2) },
      { n: "ευθεία y = 2x + 1", in: (x, y) => Math.abs(y - 2 * x - 1) < 1e-9, pick: () => { const t = bkPick([-1.5, -1, -.5, .5, 1]); return [t, 2 * t + 1]; }, draw: P => P.clipLine(1, 2, 0, 1) },
      { n: "1ο τεταρτημόριο: x ≥ 0, y ≥ 0", in: (x, y) => x >= -1e-9 && y >= -1e-9, pick: () => [ri(0, 3), ri(1, 3)], draw: P => gyAdd(P.svg, "rect", { x: P.X(0), y: P.Y(P.lim + .5), width: P.s * (P.lim + .5), height: P.s * (P.lim + .5), style: "fill:var(--blue);fill-opacity:.13" }) },
      { n: "ένωση των αξόνων: xy = 0", in: (x, y) => Math.abs(x * y) < 1e-9, pick: null, draw: P => { P.clipLine(1, 0); P.clipLine(0, 1); } },
      { n: "δίσκος x² + y² ≤ 4", in: (x, y) => x * x + y * y <= 4 + 1e-9, pick: () => bkPick([[1, 1], [1.5, 0], [0, 1.5], [-1, 1], [1, -1]]), draw: P => gyAdd(P.svg, "circle", { cx: P.X(0), cy: P.Y(0), r: 2 * P.s, style: "fill:var(--blue);fill-opacity:.13;stroke:var(--blue);stroke-width:2" }) },
      { n: "{0} (μόνο το μηδενικό)", in: (x, y) => Math.abs(x) < 1e-9 && Math.abs(y) < 1e-9, pick: () => [0, 0], draw: P => gyAdd(P.svg, "circle", { cx: P.X(0), cy: P.Y(0), r: 6, style: "fill:var(--blue)" }) }
    ];
    box.innerHTML = `<div class="wctl"><label>W = <select class="rs">${SETS.map((s, i) => `<option value="${i}">${s.n}</option>`).join("")}</select></label>
      <label>λ <input type="range" class="rl" min="-2" max="2" step="0.5" value="-1"><b class="vl"></b></label>
      <button class="btn ghost rn" type="button">νέα u, v</button></div><div class="pl"></div><div class="wout"></div>`;
    let u, v;
    function pick() { const S = SETS[+$(".rs", box).value]; if (S.pick) { u = S.pick(); let n = 0; do v = S.pick(); while (S !== SETS[5] && n++ < 50 && ((v[0] === u[0] && v[1] === u[1]) || (v[0] === -u[0] && v[1] === -u[1]))); } else { u = [ri(1, 2), 0]; v = [0, ri(1, 2)]; } }
    function draw() {
      const S = SETS[+$(".rs", box).value], l = +$(".rl", box).value; $(".vl", box).textContent = l;
      const P = l2Plane(box, 5, 560, 380); S.draw(P);
      const s = [u[0] + v[0], u[1] + v[1]], lu = [l * u[0], l * u[1]];
      P.arrow(0, 0, u[0], u[1], "var(--navy)", "u"); P.arrow(0, 0, v[0], v[1], "var(--purple)", "v");
      P.arrow(0, 0, s[0], s[1], S.in(...s) ? "var(--green)" : "var(--red)", "u+v");
      P.arrow(0, 0, lu[0], lu[1], S.in(...lu) ? "var(--green)" : "var(--red)", "λu");
      const c0 = S.in(0, 0), c1 = S.in(...s), c2 = S.in(...lu), mk = b => `<b style="color:${b ? "var(--green)" : "var(--red)"}">${b ? "✓" : "✗"}</b>`;
      $(".wout", box).innerHTML = `(α) 0 ∈ W; ${mk(c0)} &nbsp; (β) u + v = (${l2Num(s[0])}, ${l2Num(s[1])}) ∈ W; ${mk(c1)} &nbsp; (γ) λu = (${l2Num(lu[0])}, ${l2Num(lu[1])}) ∈ W; ${mk(c2)}
        <br><b>${!c0 ? "Το 0 ∉ W, άρα το W δεν είναι υπόχωρος." : !c1 ? "Αντιπαράδειγμα στην πρόσθεση: το W δεν είναι υπόχωρος." : !c2 ? "Αντιπαράδειγμα στον βαθμωτό πολλαπλασιασμό: το W δεν είναι υπόχωρος." : "Οι τρεις συνθήκες ισχύουν για αυτά τα u, v, λ (για υπόχωρο πρέπει να ισχύουν για όλα)."}</b>
        <br><span class="muted">Δοκίμασε διάφορα λ (π.χ. αρνητικό) και νέα u, v. Οι υπόχωροι του ℝ² είναι μόνο: {0}, οι ευθείες που διέρχονται από την αρχή, και ο ίδιος ο ℝ².</span>`;
    }
    $(".rs", box).onchange = () => { pick(); draw(); }; $(".rl", box).oninput = draw; $(".rn", box).onclick = () => { pick(); draw(); };
    pick(); draw();
  },

  /* ---------- 2.3 Άθροισμα δύο ευθειών ---------- */
  l2sum(box) {
    box.innerHTML = `<div class="wctl"><label>W₁: γωνία <input type="range" class="ra" min="0" max="175" step="5" value="20"><b class="va"></b></label>
      <label>W₂: γωνία <input type="range" class="rb" min="0" max="175" step="5" value="75"><b class="vb"></b></label>
      <label>w₁ <input type="range" class="rx" min="-4" max="4" value="3"><b class="vx"></b></label>
      <label>w₂ <input type="range" class="ry" min="-4" max="4" value="2"><b class="vy"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, b = +$(".rb", box).value, wx = +$(".rx", box).value, wy = +$(".ry", box).value;
      $(".va", box).textContent = a + "°"; $(".vb", box).textContent = b + "°"; $(".vx", box).textContent = wx; $(".vy", box).textContent = wy;
      const P = l2Plane(box, 5, 560, 380), u = [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180)], v = [Math.cos(b * Math.PI / 180), Math.sin(b * Math.PI / 180)];
      P.clipLine(u[0], u[1], 0, 0, "var(--blue)", 2.4); P.clipLine(v[0], v[1], 0, 0, "var(--purple)", 2.4);
      gyAdd(P.svg, "text", { x: P.X(4.6 * u[0]) + 4, y: P.Y(4.6 * u[1]) - 4, style: gyTS + ";fill:var(--blue)" }, "W₁");
      gyAdd(P.svg, "text", { x: P.X(4.6 * v[0]) + 4, y: P.Y(4.6 * v[1]) + 16, style: gyTS + ";fill:var(--purple)" }, "W₂");
      const D = l2Det2(u, v);
      if (Math.abs(D) < 1e-9) {
        P.arrow(0, 0, wx, wy, "var(--red)", "w");
        $(".wout", box).innerHTML = `Οι W₁, W₂ είναι η <b>ίδια ευθεία</b>: W₁ ∩ W₂ = W₁ ≠ {0} και W₁ + W₂ = W₁ (μόνο η ευθεία). Το άθροισμα <b>δεν</b> είναι ευθύ και δεν είναι ο ℝ².`;
        return;
      }
      const s = l2Det2([wx, wy], v) / D, t = l2Det2(u, [wx, wy]) / D, w1 = [s * u[0], s * u[1]], w2 = [t * v[0], t * v[1]];
      gyAdd(P.svg, "polygon", { points: `${P.X(0)},${P.Y(0)} ${P.X(w1[0])},${P.Y(w1[1])} ${P.X(wx)},${P.Y(wy)} ${P.X(w2[0])},${P.Y(w2[1])}`, style: "fill:var(--green);fill-opacity:.12;stroke:var(--green);stroke-dasharray:5 4" });
      P.arrow(0, 0, w1[0], w1[1], "var(--blue)", "w₁′"); P.arrow(0, 0, w2[0], w2[1], "var(--purple)", "w₂′"); P.arrow(0, 0, wx, wy, "var(--red)", "w");
      $(".wout", box).innerHTML = `W₁ ∩ W₂ = {0} και W₁ + W₂ = ℝ², άρα <b>ℝ² = W₁ ⊕ W₂</b> (ευθύ άθροισμα).
        <br>Μοναδική ανάλυση: w = (${wx}, ${wy}) = w₁′ + w₂′ με w₁′ = (${l2Num(w1[0])}, ${l2Num(w1[1])}) ∈ W₁ και w₂′ = (${l2Num(w2[0])}, ${l2Num(w2[1])}) ∈ W₂.
        <br><span class="muted">Βάλε τις δύο γωνίες ίσες: η ανάλυση παύει να υπάρχει / να είναι μοναδική.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 3.1 Γραμμικοί συνδυασμοί και Span ---------- */
  l2span(box) {
    const TG = [[3, 2], [-2, 4], [5, -1], [1, 1]];
    box.innerHTML = `<div class="wctl"><label>u = (<input type="range" class="r1" min="-3" max="3" value="2"><b class="v1"></b>, <input type="range" class="r2" min="-3" max="3" value="1"><b class="v2"></b>)</label>
      <label>v = (<input type="range" class="r3" min="-3" max="3" value="-1"><b class="v3"></b>, <input type="range" class="r4" min="-3" max="3" value="2"><b class="v4"></b>)</label>
      <label>λ <input type="range" class="rl" min="-3" max="3" step="0.5" value="1"><b class="vl"></b></label>
      <label>μ <input type="range" class="rm" min="-3" max="3" step="0.5" value="1"><b class="vm"></b></label>
      <label>στόχος b <select class="rt">${TG.map((t, i) => `<option value="${i}">(${t[0]}, ${t[1]})</option>`).join("")}</select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const u = [+$(".r1", box).value, +$(".r2", box).value], v = [+$(".r3", box).value, +$(".r4", box).value], l = +$(".rl", box).value, m = +$(".rm", box).value, b = TG[+$(".rt", box).value];
      [["1", u[0]], ["2", u[1]], ["3", v[0]], ["4", v[1]], ["l", l], ["m", m]].forEach(([k, x]) => $(".v" + k, box).textContent = x);
      const P = l2Plane(box, 6, 560, 380), D = l2Det2(u, v), c = [l * u[0] + m * v[0], l * u[1] + m * v[1]];
      const uz = !u[0] && !u[1], vz = !v[0] && !v[1];
      if (D !== 0) gyAdd(P.svg, "rect", { x: 0, y: 0, width: P.W, height: P.H, style: "fill:var(--green);fill-opacity:.07" });
      else if (!uz) P.clipLine(u[0], u[1], 0, 0, "var(--green)", 5); else if (!vz) P.clipLine(v[0], v[1], 0, 0, "var(--green)", 5);
      gyAdd(P.svg, "circle", { cx: P.X(b[0]), cy: P.Y(b[1]), r: 6, style: "fill:none;stroke:var(--red);stroke-width:2.4" });
      gyAdd(P.svg, "text", { x: P.X(b[0]) + 8, y: P.Y(b[1]) + 16, style: gyTS + ";fill:var(--red)" }, "b");
      P.arrow(0, 0, l * u[0], l * u[1], "var(--blue)", "λu", 2); P.arrow(l * u[0], l * u[1], c[0], c[1], "var(--purple)", "μv", 2);
      P.arrow(0, 0, u[0], u[1], "var(--navy)", "u", 3); P.arrow(0, 0, v[0], v[1], "var(--navy)", "v", 3);
      P.arrow(0, 0, c[0], c[1], "var(--green)", "λu+μv", 2.6);
      let txt;
      if (D !== 0) { const s = l2Fr(l2Det2(b, v), D), t = l2Fr(l2Det2(u, b), D); txt = `Τα u, v δεν είναι συγγραμμικά: <b>L(u, v) = ℝ²</b>. Ο στόχος γράφεται b = ${l2FS(s)}·u + ${l2FS(t)}·v (μοναδικά).`; }
      else if (uz && vz) txt = `u = v = 0: L(u, v) = {0}.`;
      else { const d = uz ? v : u, onL = l2Det2(d, b) === 0; txt = `Τα u, v είναι συγγραμμικά: το <b>L(u, v) είναι η ευθεία</b> που διέρχεται από την αρχή με διεύθυνση (${d[0]}, ${d[1]}). Ο στόχος b ${onL ? "ανήκει" : "<b>δεν</b> ανήκει"} στο L(u, v).`; }
      $(".wout", box).innerHTML = `λu + μv = (${l2Num(c[0])}, ${l2Num(c[1])}). ${txt}<br><span class="muted">Ρύθμισε τα λ, μ ώστε η πράσινη κορυφή να πέσει στον κόκκινο κύκλο b.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 3.2/3.3 Κλιμακωτή μορφή και βαθμός ---------- */
  l2rank(box) {
    let m = 3, n = 3, data = [[1, 3, -1], [-1, -5, 5], [4, 7, 6]];
    box.innerHTML = `<div class="wctl"><label>γραμμές <select class="rm"><option>2</option><option selected>3</option><option>4</option></select></label>
      <label>διανύσματα (στήλες) <select class="rn"><option>2</option><option selected>3</option><option>4</option></select></label>
      <button class="btn ghost rr" type="button">τυχαίο</button></div>
      <div class="lgrid" style="display:grid;gap:6px;margin:8px 0;max-width:320px"></div><div class="wout"></div>`;
    const grid = $(".lgrid", box);
    const td = x => `<td style="padding:3px 9px;text-align:center">${x}</td>`;
    function build() {
      grid.style.gridTemplateColumns = `repeat(${n}, 1fr)`; grid.innerHTML = "";
      for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) {
        const inp = document.createElement("input"); inp.type = "number"; inp.step = "1"; inp.value = (data[i] && data[i][j] !== undefined) ? data[i][j] : 0;
        inp.style.cssText = "width:100%;min-width:0;padding:6px;border:1px solid var(--line);border-radius:8px;text-align:center;font-size:15px";
        inp.oninput = calc; grid.appendChild(inp);
      }
      calc();
    }
    function calc() {
      const vals = [...grid.querySelectorAll("input")].map(x => Math.max(-99, Math.min(99, Math.round(parseFloat(x.value)) || 0)));
      data = Array.from({ length: m }, (_, i) => vals.slice(i * n, i * n + n));
      const { A, piv, rank } = l2Rref(data);
      const tbl = `<table style="border-left:2px solid var(--navy);border-right:2px solid var(--navy);border-collapse:collapse;margin:4px 0">${A.map(r => `<tr>${r.map((x, j) => td(piv.includes(j) && x[0] === 1 && x[1] === 1 ? `<b style="color:var(--blue)">1</b>` : l2FS(x))).join("")}</tr>`).join("")}</table>`;
      const free = [...Array(n).keys()].filter(j => !piv.includes(j));
      let rel = "";
      if (free.length) {
        const f = free[0], c = Array(n).fill(null).map(() => [0, 1]); c[f] = [1, 1];
        piv.forEach((p, i) => { c[p] = [-A[i][f][0], A[i][f][1]]; });
        const L = c.reduce((a, x) => a / gcdI(a, x[1]) * x[1], 1), ci = c.map(x => x[0] * L / x[1]);
        rel = `<br>Μη τετριμμένη σχέση εξάρτησης: ${ci.map((x, j) => x ? `${x === 1 ? "" : x === -1 ? "-" : x + "·"}v<sub>${j + 1}</sub>` : "").filter(Boolean).join(" + ").replace(/\+ -/g, "− ").replace(/^-/, "−")} = 0.`;
      }
      $(".wout", box).innerHTML = `Ανηγμένη κλιμακωτή μορφή:${tbl}
        Βαθμός (rank) = <b>${rank}</b> · οδηγά στοιχεία στις στήλες ${piv.map(p => p + 1).join(", ") || "—"}.
        <br>dim L(v<sub>1</sub>, …, v<sub>${n}</sub>) = ${rank} · μια βάση του L: ${piv.length ? piv.map(p => `v<sub>${p + 1}</sub>`).join(", ") : "∅"} (οι αρχικές στήλες με οδηγό).
        <br><b>${rank === n ? "Τα διανύσματα-στήλες είναι γραμμικώς ανεξάρτητα." : "Τα διανύσματα-στήλες είναι γραμμικώς εξαρτημένα."}</b>${rel}
        ${rank === m ? `<br><span class="muted">rank = ${m}: οι στήλες παράγουν όλο τον ℝ<sup>${m}</sup>.</span>` : ""}`;
    }
    $(".rm", box).onchange = () => { m = +$(".rm", box).value; build(); };
    $(".rn", box).onchange = () => { n = +$(".rn", box).value; build(); };
    $(".rr", box).onclick = () => { data = Array.from({ length: m }, () => l2Vec(n, -3, 4)); if (Math.random() < .5 && n > 1) data.forEach(r => r[n - 1] = r[0] + (n > 2 ? r[1] : r[0])); build(); };
    build();
  },

  /* ---------- 3.3 Συντεταγμένες ως προς βάση ---------- */
  l2coord(box) {
    box.innerHTML = `<div class="wctl"><label>b₁ = (<input type="range" class="r1" min="-3" max="3" value="2"><b class="v1"></b>, <input type="range" class="r2" min="-3" max="3" value="1"><b class="v2"></b>)</label>
      <label>b₂ = (<input type="range" class="r3" min="-3" max="3" value="-1"><b class="v3"></b>, <input type="range" class="r4" min="-3" max="3" value="1"><b class="v4"></b>)</label>
      <label>u = (<input type="range" class="r5" min="-5" max="5" value="3"><b class="v5"></b>, <input type="range" class="r6" min="-5" max="5" value="3"><b class="v6"></b>)</label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const g = k => +$(".r" + k, box).value; [1, 2, 3, 4, 5, 6].forEach(k => $(".v" + k, box).textContent = g(k));
      const b1 = [g(1), g(2)], b2 = [g(3), g(4)], u = [g(5), g(6)], P = l2Plane(box, 6, 560, 380), D = l2Det2(b1, b2);
      if (D === 0) {
        P.arrow(0, 0, b1[0], b1[1], "var(--blue)", "b₁"); P.arrow(0, 0, b2[0], b2[1], "var(--purple)", "b₂"); P.arrow(0, 0, u[0], u[1], "var(--red)", "u");
        $(".wout", box).innerHTML = `Τα b₁, b₂ είναι γραμμικώς εξαρτημένα (det = 0): <b>δεν αποτελούν βάση</b> του ℝ².`; return;
      }
      for (let k = -12; k <= 12; k++) {
        P.clipLine(b2[0], b2[1], k * b1[0], k * b1[1], "var(--blue)", .8); P.clipLine(b1[0], b1[1], k * b2[0], k * b2[1], "var(--purple)", .8);
      }
      const a = l2Fr(l2Det2(u, b2), D), c = l2Fr(l2Det2(b1, u), D), av = a[0] / a[1], cv = c[0] / c[1];
      gyAdd(P.svg, "polyline", { points: `${P.X(0)},${P.Y(0)} ${P.X(av * b1[0])},${P.Y(av * b1[1])} ${P.X(u[0])},${P.Y(u[1])}`, style: "fill:none;stroke:var(--green);stroke-width:2.2;stroke-dasharray:6 4" });
      P.arrow(0, 0, b1[0], b1[1], "var(--blue)", "b₁", 3); P.arrow(0, 0, b2[0], b2[1], "var(--purple)", "b₂", 3); P.arrow(0, 0, u[0], u[1], "var(--red)", "u", 3);
      $(".wout", box).innerHTML = `B = {b₁, b₂} είναι βάση (det = ${D} ≠ 0). u = ${l2FS(a)}·b₁ + ${l2FS(c)}·b₂, άρα <b>[u]<sub>B</sub> = (${l2FS(a)}, ${l2FS(c)})</b>.
        <br><span class="muted">Το πλέγμα δείχνει τις «συντεταγμένες γραμμές» της βάσης B· στη συνήθη βάση οι συντεταγμένες του u είναι (${u[0]}, ${u[1]}).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  }
});

/* ======================= Γεννήτριες ======================= */
const l2AX = { A1: "A1: $(u + v) + w = u + (v + w)$", A2: "A2: ύπαρξη μηδενικού στοιχείου", A3: "A3: ύπαρξη αντίθετου στοιχείου", A4: "A4: $u + v = v + u$",
  B1: "B1: $\\lambda(u + v) = \\lambda u + \\lambda v$", B2: "B2: $(\\lambda + \\mu)u = \\lambda u + \\mu u$", B3: "B3: $(\\lambda\\mu)u = \\lambda(\\mu u)$", B4: "B4: $1u = u$" };
const l2NS = [
  { d: R`Στο $\mathbb{R}^2$ με τη συνήθη πρόσθεση και $\lambda(x, y) = (\lambda x, 0)$`, f: ["B4"], h: ["A1", "A2", "A3", "A4", "B1", "B2", "B3"], why: R`$1(x, y) = (x, 0) \ne (x, y)$ όταν $y \ne 0$.` },
  { d: R`Στο $\mathbb{R}$ με $x \oplus y = x + y$ και $\lambda \odot x = \lambda^2 x$`, f: ["B2"], h: ["A1", "A2", "A3", "A4", "B1", "B3", "B4"], why: R`$(\lambda + \mu)^2 x \ne \lambda^2 x + \mu^2 x$, π.χ. $\lambda = \mu = 1$, $x = 1$: $4 \ne 2$.` },
  { d: R`Στο $\mathbb{R}^2$ με τη συνήθη πρόσθεση και $\lambda \odot (x, y) = (\lambda x, y)$`, f: ["B2"], h: ["A1", "A2", "A3", "A4", "B1", "B3", "B4"], why: R`$(\lambda + \mu)\odot(x, y) = ((\lambda + \mu)x, y)$, ενώ $\lambda\odot(x, y) + \mu\odot(x, y) = ((\lambda + \mu)x, 2y)$.` },
  { d: R`Στο $\mathbb{R}^2$ με τη συνήθη πρόσθεση και $\lambda \odot (x, y) = (0, 0)$`, f: ["B4"], h: ["A1", "A2", "A3", "A4", "B1", "B2", "B3"], why: R`$1\odot(x, y) = (0, 0) \ne (x, y)$ για $(x, y) \ne (0, 0)$.` },
  { d: R`Στο $\mathbb{R}$ με $x \oplus y = x - y$ και τον συνήθη πολλαπλασιασμό`, f: ["A1", "A4", "B2"], h: ["A2", "A3", "B1", "B3", "B4"], why: R`Π.χ. $1 \oplus 2 = -1 \ne 2 \oplus 1 = 1$· επίσης $(1 \oplus 2) \oplus 3 = -4 \ne 1 \oplus (2 \oplus 3) = 2$ και $(\lambda + \mu)x \ne \lambda x - \mu x$.` },
  { d: R`Στο $\mathbb{R}^2$ με $(x, y) \oplus (x', y') = (x + x', 0)$ και τον συνήθη βαθμωτό πολλαπλασιασμό`, f: ["A2", "B2"], h: ["A1", "A4", "B1", "B3", "B4"], why: R`Δεν υπάρχει $\mathbf{0}$ με $(x, y) \oplus \mathbf{0} = (x, y)$ όταν $y \ne 0$ (το αποτέλεσμα έχει πάντα 2η συντεταγμένη $0$)· και $(\lambda + \mu)(x, y) = ((\lambda + \mu)x, (\lambda + \mu)y) \ne ((\lambda + \mu)x, 0)$.` }
];
const l2P = (c, v, first) => { if (c === 0) return ""; const s = c < 0 ? "-" : (first ? "" : "+"), a = Math.abs(c); return `${first ? s : ` ${s} `}${a === 1 && v ? "" : a}${v}`; };
const l2Poly = cs => { const vs = ["x^2", "x", ""]; let s = "", f = true; cs.forEach((c, i) => { if (c) { s += l2P(c, vs[i], f); f = false; } }); return s || "0"; };

function l2Lt(c, vars) {
  let s = "";
  c.forEach((a, i) => { if (a === 0) return; const v = vars[i], abs = Math.abs(a), body = abs === 1 ? v : `${abs}${v}`;
    if (s === "") s = (a < 0 ? "-" : "") + body; else s += (a < 0 ? " - " : " + ") + body; });
  return s === "" ? "0" : s;
}
var GENS = Object.assign(window.GENS || {}, {
  l2vs: { title: "Γεννήτρια — αξιώματα διανυσματικού χώρου", make() {
    const t = ri(0, 2);
    if (t === 0) {
      const a = bkPick([2, 3, 4, 5]), b = bkPick([2, 3, 5, 6].filter(x => x !== a)), l = bkPick([2, 3, -1]);
      const val = l === -1 ? fracS2(b, a) : String(a ** l * b);
      return { q: R`Στο σύνολο $V = (0, +\infty)$ ορίζουμε $x \oplus y = xy$ και $\lambda \odot x = x^\lambda$ (είναι διανυσματικός χώρος πάνω στο $\mathbb{R}$). Να υπολογίσετε το $(${l2Pa(l)} \odot ${a}) \oplus ${b}$.`,
        fields: [{ label: "=", ans: val }], sol: R`$${l2Pa(l)} \odot ${a} = ${a}^{${l}} = ${l === -1 ? `\\frac{1}{${a}}` : a ** l}$ και $\oplus$ σημαίνει γινόμενο: $${l === -1 ? `\\frac{1}{${a}}` : a ** l}\cdot ${b} = ${l === -1 ? texFrac(b, a) : a ** l * b}$.` };
    }
    if (t === 1) {
      const p = l2NZ(-3, 3), q = l2NZ(-3, 3), a = ri(-4, 5), b = ri(-4, 5);
      const sh = (v, c) => c < 0 ? `${v} + ${-c}` : `${v} - ${c}`, shp = (v, c) => c < 0 ? `${v} - ${-c}` : `${v} + ${c}`;
      return { q: R`Στο $\mathbb{R}^2$ ορίζουμε $(x, y) \oplus (x', y') = (${sh("x + x'", p)}, ${sh("y + y'", q)})$ και $\lambda \odot (x, y) = (\lambda(${sh("x", p)}) ${p < 0 ? "-" : "+"} ${Math.abs(p)}, \lambda(${sh("y", q)}) ${q < 0 ? "-" : "+"} ${Math.abs(q)})$. Είναι διανυσματικός χώρος. Να βρείτε το μηδενικό στοιχείο $\mathbf{0} = (\alpha, \beta)$ και το αντίθετο $-u = (\gamma, \delta)$ του $u = (${a}, ${b})$.`,
        fields: [{ label: "α =", ans: p }, { label: "β =", ans: q }, { label: "γ =", ans: 2 * p - a }, { label: "δ =", ans: 2 * q - b }],
        sol: R`$(x, y) \oplus (\alpha, \beta) = (x, y) \iff x + \alpha ${p < 0 ? "+" : "-"} ${Math.abs(p)} = x,\ y + \beta ${q < 0 ? "+" : "-"} ${Math.abs(q)} = y$, άρα $\mathbf{0} = (${p}, ${q})$ (όχι το $(0, 0)$!). Για το αντίθετο: $u \oplus (\gamma, \delta) = \mathbf{0} \iff ${a} + \gamma ${p < 0 ? "+" : "-"} ${Math.abs(p)} = ${p},\ ${b} + \delta ${q < 0 ? "+" : "-"} ${Math.abs(q)} = ${q}$, άρα $-u = (${2 * p - a}, ${2 * q - b})$. (Έλεγχος: $(-1)\odot u$ δίνει το ίδιο.)` };
    }
    const it = bkPick(l2NS), c = bkPick(it.f), ds = shuffle([...it.h]).slice(0, 3);
    return bkMC({ q: R`${it.d}. Ποιο από τα παρακάτω αξιώματα <b>δεν</b> ισχύει;`, sol: R`Αποτυγχάνει το ${l2AX[c].replace(/^(\w\d):/, "$1:")}. ${it.why} Τα υπόλοιπα που δίνονται ως επιλογές ισχύουν.` },
      [l2AX[c], ...ds.map(k => l2AX[k])], 0);
  } },

  l2sub: { title: "Γεννήτρια — είναι υπόχωρος;", make() {
    const a = l2NZ(-4, 4), b = l2NZ(-4, 4), c = l2NZ(-4, 4), k = l2NZ(-3, 3), d = bkPick([0, 0, l2NZ(-5, 5)]);
    const lin = (x, y, z) => `${l2P(a, "x", true)}${l2P(b, "y")}${l2P(c, "z")}`;
    const bank = [
      [R`$W = \{(x, y, z) \in \mathbb{R}^3 : ${lin()} = ${d}\}$ του $\mathbb{R}^3$`, d === 0, d === 0 ? R`Είναι το σύνολο λύσεων ομογενούς γραμμικής εξίσωσης: περιέχει το $\mathbf{0}$ και αν $u, v \in W$, τότε $\lambda u + \mu v$ επαληθεύει την εξίσωση (γραμμικότητα).` : R`$(0, 0, 0) \notin W$, αφού $0 \ne ${d}$.`],
      [R`$W = \{(x, y, z) \in \mathbb{R}^3 : x = ${gyC(k, "y")}\}$ του $\mathbb{R}^3$`, true, R`Η συνθήκη είναι ομογενής γραμμική εξίσωση: $(0, 0, 0) \in W$, και αν $x_1 = ${gyC(k, "y_1")}$, $x_2 = ${gyC(k, "y_2")}$, τότε $\lambda x_1 + \mu x_2 = ${k === 1 ? "" : k === -1 ? "-" : k}(\lambda y_1 + \mu y_2)$.`],
      [R`$W = \{(x, y, z) \in \mathbb{R}^3 : x = y^2\}$ του $\mathbb{R}^3$`, false, R`$(1, 1, 0) \in W$, αλλά $2(1, 1, 0) = (2, 2, 0) \notin W$ αφού $2 \ne 4$.`],
      [R`$W = \{(x, y) \in \mathbb{R}^2 : xy \ge 0\}$ του $\mathbb{R}^2$`, false, R`$(1, 0), (0, -1) \in W$, αλλά το άθροισμα $(1, -1) \notin W$.`],
      [R`$W = \{A \in M_{2\times 2}(\mathbb{R}) : \operatorname{tr}A = 0\}$`, true, R`$\operatorname{tr}(\lambda A + \mu B) = \lambda\operatorname{tr}A + \mu\operatorname{tr}B = 0$ και $\operatorname{tr}O = 0$.`],
      [R`$W = \{A \in M_{2\times 2}(\mathbb{R}) : \det A = 0\}$`, false, R`$\begin{pmatrix}1&0\\0&0\end{pmatrix}, \begin{pmatrix}0&0\\0&1\end{pmatrix} \in W$, αλλά το άθροισμά τους $I$ έχει ορίζουσα $1$.`],
      [R`$W = \{A \in M_{2\times 2}(\mathbb{R}) : A^T = A\}$ (συμμετρικοί)`, true, R`$(\lambda A + \mu B)^T = \lambda A^T + \mu B^T = \lambda A + \mu B$ και $O^T = O$.`],
      [R`$W = \{p \in P_2 : p(${k}) = 0\}$`, true, R`$(\lambda p + \mu q)(${k}) = \lambda p(${k}) + \mu q(${k}) = 0$ και το μηδενικό πολυώνυμο μηδενίζεται στο $${k}$.`],
      [R`$W = \{p \in P_2 : p(${k}) = 1\}$`, false, R`Το μηδενικό πολυώνυμο δεν ανήκει στο $W$ (δίνει $0 \ne 1$).`],
      [R`$W = \{p \in P_2 : \text{το } p \text{ έχει βαθμό ακριβώς } 2\}$`, false, R`Το μηδενικό πολυώνυμο δεν έχει βαθμό 2· επίσης $(x^2 + x) + (-x^2) = x \notin W$.`]
    ];
    const [d0, yes, why] = bkPick(bank);
    return bkMC({ q: R`Είναι υπόχωρος το σύνολο ${d0};`, sol: R`${yes ? "Ναι" : "Όχι"}. ${why}` }, ["Είναι υπόχωρος", "Δεν είναι υπόχωρος"], yes ? 0 : 1);
  } },

  l2dec: { title: "Γεννήτρια — ευθύ άθροισμα, ανάλυση διανύσματος", make() {
    const t = ri(0, 2);
    if (t === 0) {
      let u, v; do { u = [l2NZ(-3, 3), ri(-3, 3)]; v = [ri(-3, 3), l2NZ(-3, 3)]; } while (l2Det2(u, v) === 0 || gcdI(Math.abs(u[0]), Math.abs(u[1])) > 1 || gcdI(Math.abs(v[0]), Math.abs(v[1])) > 1);
      const s = l2NZ(-3, 3), r = l2NZ(-3, 3), w = [s * u[0] + r * v[0], s * u[1] + r * v[1]];
      return { q: R`Έστω $W_1 = L\{${l2Tup(u)}\}$ και $W_2 = L\{${l2Tup(v)}\}$, οπότε $\mathbb{R}^2 = W_1 \oplus W_2$. Να γράψετε το $w = ${l2Tup(w)}$ ως $w = w_1 + w_2$ με $w_1 \in W_1$, $w_2 \in W_2$.`,
        fields: [{ label: "w₁ (1η) =", ans: s * u[0] }, { label: "w₁ (2η) =", ans: s * u[1] }, { label: "w₂ (1η) =", ans: r * v[0] }, { label: "w₂ (2η) =", ans: r * v[1] }],
        sol: R`Ζητάμε $s, t$ με $s${l2Tup(u)} + t${l2Tup(v)} = ${l2Tup(w)}$: λύνοντας το $2\times 2$ σύστημα, $s = ${s}$, $t = ${r}$. Άρα $w_1 = ${l2Tup([s * u[0], s * u[1]])}$, $w_2 = ${l2Tup([r * v[0], r * v[1]])}$ (μοναδικά, αφού το άθροισμα είναι ευθύ).` };
    }
    if (t === 1) {
      const a = ri(-6, 6), b = ri(-6, 6), c = ri(-6, 6), d = ri(-6, 6);
      if (b === c) return GENS.l2dec.make();
      return { q: R`Κάθε πίνακας γράφεται μοναδικά ως άθροισμα συμμετρικού $S$ και αντισυμμετρικού $K$ ($M_{2\times 2} = \Sigma \oplus \mathrm{A}$). Για $A = \begin{pmatrix}${a}&${b}\\${c}&${d}\end{pmatrix}$ να βρείτε τα στοιχεία $s_{12}$ του $S$ και $k_{12}$ του $K$.`,
        fields: [{ label: "s₁₂ =", ans: fracS2(b + c, 2) }, { label: "k₁₂ =", ans: fracS2(b - c, 2) }],
        sol: R`$S = \frac{A + A^T}{2}$, $K = \frac{A - A^T}{2}$. Άρα $s_{12} = \frac{${b} + ${l2Pa(c)}}{2} = ${texFrac(b + c, 2)}$ και $k_{12} = \frac{${b} - ${l2Pa(c)}}{2} = ${texFrac(b - c, 2)}$.` };
    }
    const a = ri(-6, 6), b = ri(-6, 6), c = ri(-6, 6);
    return { q: R`Στον $\mathbb{R}^3$ ισχύει $\mathbb{R}^3 = W_1 \oplus W_2$ με $W_1 = \{(t, t, t) : t \in \mathbb{R}\}$ και $W_2 = \{(0, y, z) : y, z \in \mathbb{R}\}$. Να γράψετε το $${l2Tup([a, b, c])} = (t, t, t) + (0, y, z)$.`,
      fields: [{ label: "t =", ans: a }, { label: "y =", ans: b - a }, { label: "z =", ans: c - a }],
      sol: R`Πρώτη συντεταγμένη: $t = ${a}$. Τότε $y = ${b} - ${l2Pa(a)} = ${b - a}$ και $z = ${c} - ${l2Pa(a)} = ${c - a}$.` };
  } },

  l2comb: { title: "Γεννήτρια — γραμμικοί συνδυασμοί και L(S)", make() {
    let a1, a2; do { a1 = l2Vec(3, -3, 3); a2 = l2Vec(3, -3, 3); } while (l2Det2(a1, a2) === 0 || Math.abs(l2Det2(a1, a2)) > 3);
    const t = ri(0, 2), s = l2NZ(-3, 3), r = l2NZ(-3, 3), b = [0, 1, 2].map(i => s * a1[i] + r * a2[i]);
    if (t === 0) return { q: R`Να γράψετε το $b = ${l2Tup(b)}$ ως γραμμικό συνδυασμό $b = \lambda_1 a_1 + \lambda_2 a_2$, όπου $a_1 = ${l2Tup(a1)}$, $a_2 = ${l2Tup(a2)}$.`,
      fields: [{ label: "λ₁ =", ans: s }, { label: "λ₂ =", ans: r }],
      sol: R`Από τις δύο πρώτες συντεταγμένες: $${l2Lt([a1[0], a2[0]], ["\\lambda_1", "\\lambda_2"])} = ${b[0]}$, $${l2Lt([a1[1], a2[1]], ["\\lambda_1", "\\lambda_2"])} = ${b[1]}$, άρα $\lambda_1 = ${s}$, $\lambda_2 = ${r}$· η 3η συντεταγμένη επαληθεύεται: $${s}\cdot ${a1[2] < 0 ? `(${a1[2]})` : a1[2]} + ${r < 0 ? `(${r})` : r}\cdot ${a2[2] < 0 ? `(${a2[2]})` : a2[2]} = ${b[2]}$.` };
    if (t === 1) return { q: R`Για ποια τιμή του $h$ το $b = (${b[0]}, ${b[1]}, h)$ ανήκει στο $L(a_1, a_2) = \operatorname{Span}\{a_1, a_2\}$, όπου $a_1 = ${l2Tup(a1)}$, $a_2 = ${l2Tup(a2)}$;`,
      fields: [{ label: "h =", ans: b[2] }],
      sol: R`Οι δύο πρώτες εξισώσεις του συστήματος $\lambda_1 a_1 + \lambda_2 a_2 = b$ δίνουν μοναδικά $\lambda_1 = ${s}$, $\lambda_2 = ${r}$. Για να είναι συμβιβαστό πρέπει $h = ${s}\cdot ${a1[2] < 0 ? `(${a1[2]})` : a1[2]} + ${r < 0 ? `(${r})` : r}\cdot ${a2[2] < 0 ? `(${a2[2]})` : a2[2]} = ${b[2]}$.` };
    const yes = Math.random() < .5, bb = yes ? b : [b[0], b[1], b[2] + l2NZ(-2, 2)];
    return bkMC({ q: R`Ανήκει το $b = ${l2Tup(bb)}$ στο $L(a_1, a_2)$, όπου $a_1 = ${l2Tup(a1)}$, $a_2 = ${l2Tup(a2)}$;`,
      sol: R`Οι δύο πρώτες συντεταγμένες δίνουν μοναδικά $\lambda_1 = ${s}$, $\lambda_2 = ${r}$, οπότε η τρίτη πρέπει να είναι $${b[2]}$. ${yes ? "Ισχύει, άρα το σύστημα είναι συμβιβαστό: ναι." : `Είναι $${bb[2]} \\ne ${b[2]}$: το σύστημα είναι αδύνατο, άρα όχι.`}` },
      ["Ναι, ανήκει", "Όχι, δεν ανήκει"], yes ? 0 : 1);
  } },

  l2dep: { title: "Γεννήτρια — γραμμική εξάρτηση", make() {
    let u, v; do { u = l2Vec(3, -3, 3); v = l2Vec(3, -3, 3); } while (l2Det2(u, v) === 0);
    const t = ri(0, 2), a = l2NZ(-2, 2), b = l2NZ(-2, 2), w = [0, 1, 2].map(i => a * u[i] + b * v[i]);
    if (t === 0) {
      const dep = Math.random() < .5; let z = w;
      if (!dep) do z = l2Vec(3, -3, 3); while (l2Det3(u, v, z) === 0);
      return bkMC({ q: R`Είναι γραμμικώς ανεξάρτητα τα διανύσματα $${l2Tup(u)},\ ${l2Tup(v)},\ ${l2Tup(z)}$ του $\mathbb{R}^3$;`,
        sol: dep ? R`Όχι: $${l2Tup(z)} = ${a}\cdot${l2Tup(u)} ${b < 0 ? "-" : "+"} ${Math.abs(b)}\cdot${l2Tup(v)}$, δηλαδή ένα διάνυσμα είναι γραμμικός συνδυασμός των άλλων (ισοδύναμα η ορίζουσα του πίνακα με στήλες τα διανύσματα είναι $0$).`
          : R`Ναι: η κλιμακωτή μορφή του πίνακα με στήλες τα διανύσματα έχει 3 οδηγά στοιχεία (ισοδύναμα η ορίζουσα είναι $${l2Det3(u, v, z)} \ne 0$), άρα το ομογενές σύστημα έχει μόνο τη μηδενική λύση.` },
        ["Γραμμικώς ανεξάρτητα", "Γραμμικώς εξαρτημένα"], dep ? 1 : 0);
    }
    if (t === 1) return { q: R`Για ποια τιμή του $h$ τα διανύσματα $${l2Tup(u)},\ ${l2Tup(v)},\ (${w[0]}, ${w[1]}, h)$ είναι γραμμικώς εξαρτημένα;`,
      fields: [{ label: "h =", ans: w[2] }],
      sol: R`Τα δύο πρώτα είναι ανεξάρτητα, άρα εξάρτηση $\iff$ το τρίτο ανήκει στο $L$ των δύο πρώτων: από τις δύο πρώτες συντεταγμένες, $(${w[0]}, ${w[1]}) = \alpha(${u[0]}, ${u[1]}) + \beta(${v[0]}, ${v[1]})$ με $\alpha = ${a}$, $\beta = ${b}$, οπότε $h = ${a}\cdot ${u[2] < 0 ? `(${u[2]})` : u[2]} + ${b < 0 ? `(${b})` : b}\cdot ${v[2] < 0 ? `(${v[2]})` : v[2]} = ${w[2]}$. (Ισοδύναμα: η ορίζουσα, που είναι γραμμική στο $h$, μηδενίζεται.)` };
    return { q: R`Τα $v_1 = ${l2Tup(u)}$, $v_2 = ${l2Tup(v)}$, $v_3 = ${l2Tup(w)}$ είναι γραμμικώς εξαρτημένα. Να βρείτε $\alpha, \beta$ με $v_3 = \alpha v_1 + \beta v_2$.`,
      fields: [{ label: "α =", ans: a }, { label: "β =", ans: b }],
      sol: R`Λύνουμε $\alpha v_1 + \beta v_2 = v_3$: $\alpha = ${a}$, $\beta = ${b}$, οπότε η μη τετριμμένη σχέση είναι $${l2Cf(a, "v_1")} ${b < 0 ? "-" : "+"} ${l2Cf(Math.abs(b), "v_2")} - v_3 = \mathbf{0}$.` };
  } },

  l2coord: { title: "Γεννήτρια — βάση, συντεταγμένες, διάσταση", make() {
    const t = ri(0, 2);
    if (t === 0) {
      let b1, b2; do { b1 = [l2NZ(-3, 3), ri(-4, 4)]; b2 = [ri(-3, 3), l2NZ(-4, 4)]; } while (Math.abs(l2Det2(b1, b2)) !== 1);
      const a = l2NZ(-4, 4), c = l2NZ(-4, 4), u = [a * b1[0] + c * b2[0], a * b1[1] + c * b2[1]];
      return { q: R`Έστω η βάση $B = \{b_1, b_2\}$ του $\mathbb{R}^2$ με $b_1 = ${l2Tup(b1)}$, $b_2 = ${l2Tup(b2)}$. Να βρείτε το διάνυσμα συντεταγμένων $[u]_B$ του $u = ${l2Tup(u)}$.`,
        fields: [{ label: "1η συντ. =", ans: a }, { label: "2η συντ. =", ans: c }],
        sol: R`Λύνουμε $\lambda_1 b_1 + \lambda_2 b_2 = u$: $\lambda_1 = ${a}$, $\lambda_2 = ${c}$ (μοναδική λύση, αφού $\det = ${l2Det2(b1, b2)} \ne 0$). Άρα $[u]_B = (${a}, ${c})$.` };
    }
    if (t === 1) {
      const r = ri(1, 3), k = r + ri(1, 2); let base; do base = Array.from({ length: r }, () => l2Vec(4, -2, 3)); while (l2Rank(base) !== r);
      const vs = [...base]; let guard = 0; while (vs.length < k) { if (++guard > 200) return GENS.l2coord.make(); const c = Array.from({ length: r }, () => ri(-2, 2)); if (c.every(x => x === 0)) continue; const nv = [0, 1, 2, 3].map(i => base.reduce((s, b, j) => s + c[j] * b[i], 0)); if (vs.some(w => w.join() === nv.join())) continue; vs.push(nv); }
      const S = shuffle(vs);
      return { q: R`Να βρείτε τη διάσταση του υπόχωρου $L(S)$ του $\mathbb{R}^4$, όπου $S = \{${S.map(l2Tup).join(",\ ")}\}$.`,
        fields: [{ label: "dim L(S) =", ans: r }],
        sol: R`Γράφουμε τα διανύσματα ως γραμμές (ή στήλες) πίνακα και τον φέρνουμε σε κλιμακωτή μορφή: το πλήθος των μη μηδενικών γραμμών (ο βαθμός) είναι $${r}$. Άρα $\dim L(S) = ${r}$${k - r === 1 ? " (ένα από τα διανύσματα είναι γραμμικός συνδυασμός των άλλων)" : ` (${k - r} από τα διανύσματα είναι γραμμικοί συνδυασμοί των υπολοίπων)`}.` };
    }
    const c = l2NZ(-2, 2), al = l2NZ(-3, 3), be = ri(-4, 4), ga = ri(-4, 4), p0 = al * c * c + be * c + ga, p1 = 2 * al * c + be;
    return { q: R`Να βρείτε τις συντεταγμένες του $p(x) = ${l2Poly([al, be, ga])}$ ως προς τη βάση $\{1,\ x ${c < 0 ? "+" : "-"} ${Math.abs(c)},\ (x ${c < 0 ? "+" : "-"} ${Math.abs(c)})^2\}$ του $P_2$.`,
      fields: [{ label: "συντ. του 1 =", ans: p0 }, { label: `συντ. του (x ${c < 0 ? "+" : "−"} ${Math.abs(c)}) =`, ans: p1 }, { label: `συντ. του (x ${c < 0 ? "+" : "−"} ${Math.abs(c)})² =`, ans: al }],
      sol: R`Θέτουμε $p(x) = \alpha + \beta(x - c) + \gamma(x - c)^2$ με $c = ${c}$. Συγκρίνοντας τους συντελεστές του $x^2$: $\gamma = ${al}$. Για $x = ${c}$: $\alpha = p(${c}) = ${p0}$. Από την παράγωγο στο $${c}$: $\beta = p'(${c}) = 2\cdot ${al < 0 ? `(${al})` : al}\cdot ${c < 0 ? `(${c})` : c} ${be < 0 ? "-" : "+"} ${Math.abs(be)} = ${p1}$.` };
  } }
});

/* Γραμμική Άλγεβρα ΜΑΣ029 — widgets & γεννήτριες (μέρος 3): Άλγεβρα πινάκων, στοιχειώδεις μετασχηματισμοί */

/* ---------- ακριβής ρητή αριθμητική: κλάσμα = [αριθμητής, παρονομαστής] ---------- */
const l3N = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } if (n === 0) return [0, 1]; const g = gcdI(n, d); return [n / g, d / g]; };
const l3add = (a, b) => l3N(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const l3sub = (a, b) => l3N(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const l3mul = (a, b) => l3N(a[0] * b[0], a[1] * b[1]);
const l3div = (a, b) => l3N(a[0] * b[1], a[1] * b[0]);
const l3eq = (a, b) => a[0] === b[0] && a[1] === b[1];
const l3z = a => a[0] === 0;
const l3s = f => f[1] === 1 ? String(f[0]) : f[0] + "/" + f[1];                          /* απάντηση πεδίου */
const l3t = f => f[1] === 1 ? String(f[0]) : (f[0] < 0 ? "-" : "") + `\\frac{${Math.abs(f[0])}}{${f[1]}}`; /* KaTeX */
const l3M = rows => rows.map(r => r.map(v => Array.isArray(v) ? v : l3N(v)));             /* ακέραιοι → κλάσματα */
const l3copy = M => M.map(r => r.map(v => [v[0], v[1]]));
function l3parse(s) {
  s = String(s).trim().replace(/−/g, "-").replace(",", ".");
  let m = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/); if (m && +m[2] !== 0) return l3N(+m[1], +m[2]);
  m = s.match(/^-?\d+(\.\d+)?$/); if (!m) return null;
  const dec = (s.split(".")[1] || "").length, den = 10 ** dec; return l3N(Math.round(parseFloat(s) * den), den);
}
/* LaTeX πίνακα· sep = στήλη μετά την οποία μπαίνει κάθετη γραμμή· col(i,j) → χρώμα στοιχείου */
function l3tex(M, sep = null, col = null) {
  const n = M[0].length; let spec = "";
  for (let j = 0; j < n; j++) { spec += "c"; if (sep !== null && j === sep - 1) spec += "|"; }
  const body = M.map((r, i) => r.map((v, j) => { const t = l3t(v), c = col && col(i, j); return c ? `\\textcolor{${c}}{\\mathbf{${t}}}` : t; }).join(" & ")).join(" \\\\ ");
  return `\\left(\\begin{array}{${spec}}${body}\\end{array}\\right)`;
}
const l3pm = rows => `\\begin{pmatrix}${rows.map(r => r.map(v => Array.isArray(v) ? l3t(v) : v).join(" & ")).join(" \\\\ ")}\\end{pmatrix}`;
const l3mm = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, v, k) => l3add(s, l3mul(v, B[k][j])), [0, 1])));
const l3T = A => A[0].map((_, j) => A.map(r => r[j]));
const l3I = n => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => l3N(i === j ? 1 : 0)));
const l3G = i => `\\Gamma_{${i + 1}}`;

/* ---------- Gauss–Jordan: επόμενη στοιχειώδης πράξη γραμμών (ή null αν ο πίνακας είναι ανηγμένος κλιμακωτός) ---------- */
function l3next(M, lim) {
  let r = 0; const m = M.length;
  for (let c = 0; c < lim && r < m; c++) {
    let p = -1; for (let i = r; i < m; i++) if (!l3z(M[i][c])) { p = i; break; }
    if (p < 0) continue;
    if (p !== r) return { t: "sw", i: r, j: p };
    if (!l3eq(M[r][c], [1, 1])) return { t: "sc", i: r, k: l3div([1, 1], M[r][c]) };
    for (let i = 0; i < m; i++) if (i !== r && !l3z(M[i][c])) return { t: "ad", i, j: r, k: l3N(-M[i][c][0], M[i][c][1]) };
    r++;
  }
  return null;
}
function l3apply(M, op) {
  const A = l3copy(M);
  if (op.t === "sw") [A[op.i], A[op.j]] = [A[op.j], A[op.i]];
  else if (op.t === "sc") A[op.i] = A[op.i].map(v => l3mul(v, op.k));
  else A[op.i] = A[op.i].map((v, c) => l3add(v, l3mul(op.k, A[op.j][c])));
  return A;
}
function l3opTex(op) {
  if (op.t === "sw") return `${l3G(op.i)} \\leftrightarrow ${l3G(op.j)}`;
  if (op.t === "sc") return `${l3G(op.i)} \\to ${l3eq(op.k, [-1, 1]) ? "-" : l3t(op.k)}${l3G(op.i)}`;
  const k = op.k, neg = k[0] < 0, a = [Math.abs(k[0]), k[1]];
  return `${l3G(op.i)} \\to ${l3G(op.i)} ${neg ? "-" : "+"} ${l3eq(a, [1, 1]) ? "" : l3t(a)}${l3G(op.j)}`;
}
function l3rrefFull(M, lim) { let A = l3copy(M), op, g = 0; while ((op = l3next(A, lim)) && g++ < 400) A = l3apply(A, op); return A; }
function l3pivots(M, lim) { const piv = []; M.forEach(r => { const c = r.findIndex((v, j) => j < lim && !l3z(v)); if (c >= 0) piv.push(c); }); return piv; }
function l3rank(M, lim = M[0].length) { return l3pivots(l3rrefFull(M, lim), lim).length; }
function l3isREF(M, lim) {
  let last = -1, zero = false;
  for (const r of M) { const c = r.findIndex((v, j) => j < lim && !l3z(v)); if (c < 0) { zero = true; continue; } if (zero || c <= last) return false; last = c; }
  return true;
}
function l3isRREF(M, lim) {
  if (!l3isREF(M, lim)) return false;
  for (let i = 0; i < M.length; i++) { const c = M[i].findIndex((v, j) => j < lim && !l3z(v)); if (c < 0) continue;
    if (!l3eq(M[i][c], [1, 1])) return false; for (let k = 0; k < M.length; k++) if (k !== i && !l3z(M[k][c])) return false; }
  return true;
}
function l3det(M) { /* ορίζουσα με απαλοιφή (ακριβής) */
  let A = l3copy(M), d = [1, 1]; const n = A.length;
  for (let c = 0; c < n; c++) { let p = -1; for (let i = c; i < n; i++) if (!l3z(A[i][c])) { p = i; break; }
    if (p < 0) return [0, 1]; if (p !== c) { [A[p], A[c]] = [A[c], A[p]]; d = l3N(-d[0], d[1]); }
    d = l3mul(d, A[c][c]);
    for (let i = c + 1; i < n; i++) { const f = l3div(A[i][c], A[c][c]); A[i] = A[i].map((v, j) => l3sub(v, l3mul(f, A[c][j]))); } }
  return d;
}
/* γενική λύση από ανηγμένο κλιμακωτό επαυξημένο πίνακα (n άγνωστοι) */
function l3general(M, n) {
  const piv = l3pivots(M, n), free = []; for (let j = 0; j < n; j++) if (!piv.includes(j)) free.push(j);
  const lines = [];
  for (let j = 0; j < n; j++) {
    if (free.includes(j)) { lines.push(`x_{${j + 1}}\\ \\text{ελεύθερη}`); continue; }
    const i = piv.indexOf(j), row = M[i]; let s = l3z(row[n]) ? "" : l3t(row[n]);
    free.forEach(f => { const c = l3N(-row[f][0], row[f][1]); if (l3z(c)) return; const a = [Math.abs(c[0]), c[1]], sg = c[0] < 0 ? "-" : "+";
      const term = (l3eq(a, [1, 1]) ? "" : l3t(a)) + `x_{${f + 1}}`; s += s ? ` ${sg} ${term}` : (sg === "-" ? "-" : "") + term; });
    lines.push(`x_{${j + 1}} = ${s || "0"}`);
  }
  return { lines, free };
}

/* ---------- κοινό εργαλείο: διαδραστική απαλοιφή Gauss–Jordan ---------- */
const L3_PRESETS = {
  aug: [
    ["Μοναδική λύση (3×3)", [[1, 2, -1, 3], [2, 5, 1, 13], [-1, 0, 3, 7]]],
    ["Άπειρες λύσεις (3×4)", [[1, -2, 1, 3, 1], [2, -4, 3, 7, 4], [-1, 2, 0, -2, 1]]],
    ["Μη συμβιβαστό", [[1, 3, 5, 7], [3, 5, 7, 9], [5, 7, 9, 1]]],
    ["Χρειάζεται εναλλαγή γραμμών", [[0, 2, 4, 6], [1, 1, 1, 2], [2, 1, 3, 5]]],
    ["Σύστημα 2×2", [[2, 3, 7], [4, -1, 7]]]
  ],
  hom: [
    ["Ομογενές – 1 ελεύθερη", [[1, 3, 1, 0], [-4, -9, 2, 0], [0, -3, -6, 0]]],
    ["Ax = b (ίδιος A)", [[1, 3, 1, 1], [-4, -9, 2, -1], [0, -3, -6, -3]]],
    ["Ομογενές – 2 ελεύθερες", [[1, 2, -1, 3, 0], [2, 4, 1, 3, 0], [-1, -2, 2, -4, 0]]],
    ["Μόνο τετριμμένη λύση", [[1, 2, 0, 0], [0, 1, 1, 0], [1, 0, 3, 0]]]
  ],
  inv: [
    ["2×2 αντιστρέψιμος", [[8, 6], [5, 4]]],
    ["3×3 αντιστρέψιμος", [[1, 0, -2], [-3, 1, 4], [2, -3, 4]]],
    ["3×3 με εναλλαγή", [[0, 1, 2], [1, 0, 3], [4, -3, 8]]],
    ["3×3 μη αντιστρέψιμος", [[1, -2, 1], [4, -7, 3], [-2, 6, -4]]]
  ],
  rank: [
    ["3×4, βαθμός 2", [[4, 5, 9, -2], [6, 5, 1, 12], [3, 4, 8, -3]]],
    ["4×4, βαθμός 3", [[1, -3, 2, -4], [-3, 9, -1, 5], [2, -6, 4, -3], [-4, 12, 2, 7]]],
    ["3×3, βαθμός 1", [[1, 2, 3], [2, 4, 6], [-1, -2, -3]]],
    ["3×3, βαθμός 3", [[2, 1, 0], [1, 3, 1], [0, 1, 2]]]
  ]
};
function l3gj(box, mode) {
  const pres = L3_PRESETS[mode];
  box.innerHTML = `<div class="wctl"><label>πίνακας <select class="pre">${pres.map((p, i) => `<option value="${i}">${p[0]}</option>`).join("")}</select></label></div>
    <div class="wctl"><label>πράξη <select class="op"><option value="ad">Γᵢ → Γᵢ + κΓⱼ</option><option value="sc">Γᵢ → κΓᵢ</option><option value="sw">Γᵢ ↔ Γⱼ</option></select></label>
      <label>i <select class="oi"></select></label><label>j <select class="oj"></select></label>
      <label>κ <input class="ok" value="-2" size="5" style="width:64px;font:inherit;padding:5px 8px;border:1px solid var(--line);border-radius:8px"></label>
      <button class="btn ghost small go">Εφάρμοσε</button></div>
    <div class="wctl"><button class="btn primary small auto">Αυτόματο βήμα</button><button class="btn ghost small all">Μέχρι το τέλος</button><button class="btn ghost small undo">Αναίρεση</button><button class="btn ghost small rst">Επαναφορά</button></div>
    <div class="pl" style="overflow-x:auto"></div><div class="wout"></div>
    <div style="margin-top:10px;border-top:1px dashed var(--line);padding-top:8px"><b style="color:var(--navy);font-size:14px">Δικός σου πίνακας</b>
      <span class="muted" style="font-size:13px"> — μία γραμμή ανά σειρά, στοιχεία με κενό, κλάσματα ως 3/4${mode === "aug" || mode === "hom" ? "· η τελευταία στήλη είναι οι σταθεροί όροι" : ""}.</span>
      <textarea class="ta" rows="3" style="display:block;width:100%;box-sizing:border-box;font-family:monospace;font-size:14px;border:1px solid var(--line);border-radius:8px;padding:6px;margin:6px 0"></textarea>
      <button class="btn ghost small load">Φόρτωσε</button></div>`;
  let M0, M, hist = [], msg = "";
  const aug = mode === "aug" || mode === "hom", inv = mode === "inv";
  const ncoef = () => aug ? M0[0].length - 1 : M0[0].length;
  const lim = () => inv ? M0.length : (aug ? M0[0].length : M0[0].length);   /* στο aug επιτρέπεται οδηγός και στη στήλη b */
  function load(rows) {
    M0 = l3M(rows); if (inv) M0 = M0.map((r, i) => r.concat(l3I(r.length)[i]));
    M = l3copy(M0); hist = []; msg = "";
    const opts = M.map((_, i) => `<option value="${i}">${i + 1}</option>`).join("");
    $(".oi", box).innerHTML = opts; $(".oj", box).innerHTML = opts; $(".oj", box).value = M.length > 1 ? 1 : 0;
    $(".ta", box).value = rows.map(r => r.map(v => Array.isArray(v) ? l3s(v) : v).join(" ")).join("\n");
    draw();
  }
  function act(op) { if (!op) { msg = "Ο πίνακας είναι ήδη σε ανηγμένη κλιμακωτή μορφή."; return; } hist.push({ M, op }); M = l3apply(M, op); msg = ""; }
  function draw() {
    const L = lim(), piv = l3pivots(M, inv ? M.length : (aug ? ncoef() : M[0].length));
    const pivCell = {}; let lastC = -1; for (let i = 0; i < M.length; i++) { const c = M[i].findIndex((v, j) => j < (inv ? M.length : aug ? ncoef() : M[i].length) && !l3z(v)); if (c < 0 || c <= lastC) break; pivCell[i] = c; lastC = c; }
    const last = hist.length ? hist[hist.length - 1].op : null;
    const col = (i, j) => pivCell[i] === j ? "#1f6f43" : (last && (last.i === i || (last.t === "sw" && last.j === i)) ? "#b35c00" : null);
    const sep = aug ? ncoef() : inv ? M.length : null;
    const chain = hist.length ? hist.map(h => `$${l3opTex(h.op)}$`).join(" · ") : "—";
    $(".pl", box).innerHTML = `<div style="text-align:center;font-size:17px;padding:6px 0">$$${l3tex(M, sep, col)}$$</div>
      <p class="muted" style="font-size:13px;margin:2px 0 0">${last ? `Τελευταία πράξη: $${l3opTex(last)}$. ` : ""}Πράσινο: ηγετικά στοιχεία της κλιμακωτής «σκάλας» που έχει ήδη σχηματιστεί · πορτοκαλί: γραμμή που άλλαξε.</p>
      <p style="font-size:13.5px;margin:4px 0 0"><b>Πράξεις:</b> ${chain}</p>`;
    typeset($(".pl", box));
    const ref = l3isREF(M, aug ? ncoef() + 1 : L), rref = l3isRREF(M, aug ? ncoef() + 1 : L);
    let out = `${msg ? `<b style="color:#b35c00">${msg}</b><br>` : ""}Κλιμακωτή μορφή: <b>${ref ? "ναι" : "όχι"}</b> · Ανηγμένη κλιμακωτή: <b>${rref ? "ναι" : "όχι"}</b>.`;
    if (aug) {
      const n = ncoef(), F = l3rrefFull(M, n + 1), rA = l3rank(M.map(r => r.slice(0, n))), rAb = l3pivots(F, n + 1).length;
      out += `<br>Βαθμός $r(A) = ${rA}$, $r(A|b) = ${rAb}$, άγνωστοι $n = ${n}$ ⇒ `;
      if (rA < rAb) out += `<b>μη συμβιβαστό</b> (εμφανίζεται γραμμή $(0 \\ \\cdots \\ 0 \\mid c)$ με $c \\ne 0$).`;
      else if (rA === n) out += `<b>μοναδική λύση</b>.`;
      else out += `<b>άπειρες λύσεις</b>, με $n - r = ${n - rA}$ ελεύθερη(-ες) μεταβλητή(-ές).`;
      if (rref && rA === rAb) { const g = l3general(M, n); out += `<br>Γενική λύση: ${g.lines.map(s => `$${s}$`).join(", ")}.`; }
      if (mode === "hom" && M.every(r => l3z(r[n]))) out += `<br><span class="muted">Ομογενές: πάντα συμβιβαστό (έχει την τετριμμένη λύση $x = 0$).</span>`;
    } else if (inv) {
      const n = M.length, left = M.map(r => r.slice(0, n)), zeroRow = left.some(r => r.every(l3z));
      if (zeroRow) out += `<br><b style="color:#b3261e">Εμφανίστηκε μηδενική γραμμή στο αριστερό μπλοκ: ο $A$ δεν είναι αντιστρέψιμος.</b>`;
      else if (left.every((r, i) => r.every((v, j) => l3eq(v, [i === j ? 1 : 0, 1])))) out += `<br><b>Το αριστερό μπλοκ έγινε $I_${n}$, άρα</b> $A^{-1} = ${l3tex(M.map(r => r.slice(n)))}$.`;
      else out += `<br><span class="muted">Στόχος: $[A \\mid I] \\to [I \\mid A^{-1}]$.</span>`;
      if (last) { const E = l3apply(l3I(n), last); out += `<br>Στοιχειώδης πίνακας της τελευταίας πράξης: $E = ${l3tex(E)}$ (δηλ. νέος πίνακας $= E\\cdot$ παλιός).`; }
    } else {
      const r = l3rank(M), m = M.length, n = M[0].length;
      out += `<br>Βαθμός $r(A) = ${r}$ = πλήθος μη μηδενικών γραμμών της κλιμακωτής μορφής. Μηδενικότητα $n - r = ${n - r}$.`;
      const N = Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => l3N(i === j && i < r ? 1 : 0)));
      out += `<br>Κανονική μορφή (με πράξεις γραμμών <i>και</i> στηλών): $${l3tex(N)}$.`;
    }
    $(".wout", box).innerHTML = out; typeset($(".wout", box));
  }
  $(".pre", box).onchange = () => load(pres[+$(".pre", box).value][1]);
  $(".go", box).onclick = () => {
    const t = $(".op", box).value, i = +$(".oi", box).value, j = +$(".oj", box).value, k = l3parse($(".ok", box).value);
    if (t === "sw") { if (i === j) { msg = "Διάλεξε δύο διαφορετικές γραμμές."; return draw(); } act({ t, i, j }); }
    else if (!k) { msg = "Το κ πρέπει να είναι αριθμός, π.χ. -2 ή 1/3."; }
    else if (t === "sc") { if (l3z(k)) msg = "Ο πολλαπλασιασμός γραμμής με 0 δεν είναι στοιχειώδης μετασχηματισμός."; else act({ t, i, k }); }
    else { if (i === j) msg = "Στην Γᵢ → Γᵢ + κΓⱼ πρέπει i ≠ j."; else act({ t, i, j, k }); }
    draw();
  };
  $(".auto", box).onclick = () => { act(l3next(M, lim())); draw(); };
  $(".all", box).onclick = () => { let g = 0, op; while ((op = l3next(M, lim())) && g++ < 200) act(op); if (!g) msg = "Ο πίνακας είναι ήδη σε ανηγμένη κλιμακωτή μορφή."; draw(); };
  $(".undo", box).onclick = () => { if (hist.length) M = hist.pop().M; msg = ""; draw(); };
  $(".rst", box).onclick = () => { M = l3copy(M0); hist = []; msg = ""; draw(); };
  $(".load", box).onclick = () => {
    const rows = $(".ta", box).value.trim().split(/\n+/).map(l => l.replace(/\|/g, " ").trim().split(/[\s;]+/).filter(Boolean).map(l3parse));
    const ok = rows.length >= 1 && rows.length <= 5 && rows.every(r => r.length === rows[0].length && r.length >= 2 && r.length <= 7 && r.every(Boolean)) && (!inv || rows.length === rows[0].length);
    if (!ok) { msg = inv ? "Δώσε τετραγωνικό πίνακα (έως 5×5) με αριθμούς." : "Κάθε γραμμή πρέπει να έχει τον ίδιο αριθμό στοιχείων (2–7), έως 5 γραμμές."; return draw(); }
    load(rows);
  };
  load(pres[0][1]);
}

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 4.1 πράξεις πινάκων ---------- */
  l3ops(box) {
    const P = [[[[1, -2, 3], [0, 4, -1]], [[2, 1, -1], [-3, 0, 5]]], [[[2, 0], [-1, 3]], [[1, 4], [2, -2]]], [[[1, 2], [3, 4], [5, 6]], [[0, -1], [2, 1], [-3, 2]]]];
    box.innerHTML = `<div class="wctl"><label>ζεύγος <select class="pp"><option value="0">2×3</option><option value="1">2×2</option><option value="2">3×2</option></select></label>
      <label>πράξη <select class="op"><option value="add">A + B</option><option value="sub">A − B</option><option value="lin">κA + B</option><option value="tr">Aᵀ</option><option value="trs">(A + B)ᵀ = Aᵀ + Bᵀ</option></select></label>
      <label>κ <input type="range" class="rk" min="-3" max="3" value="2"><b class="vk"></b></label></div><div class="pl" style="overflow-x:auto"></div><div class="wout"></div>`;
    function draw() {
      const [a, b] = P[+$(".pp", box).value], A = l3M(a), B = l3M(b), k = +$(".rk", box).value, op = $(".op", box).value; $(".vk", box).textContent = k;
      const kk = l3N(k), lin = (x, y, s) => x.map((r, i) => r.map((v, j) => l3add(l3mul(s, v), y[i][j])));
      let res, f, note;
      if (op === "add") { res = lin(A, B, [1, 1]); f = `A + B = ${l3tex(A)} + ${l3tex(B)} = ${l3tex(res)}`; note = `Στοιχείο-προς-στοιχείο: $(A+B)_{ij} = a_{ij} + b_{ij}$, π.χ. $(A+B)_{12} = ${a[0][1]} + ${gyPar(b[0][1])} = ${a[0][1] + b[0][1]}$. Ορίζεται μόνο για πίνακες ίδιου τύπου.`; }
      else if (op === "sub") { res = lin(B, A, [-1, 1]).map(r => r.map(v => l3N(-v[0], v[1]))); f = `A - B = ${l3tex(res)}`; note = `$A - B = A + (-1)B$, π.χ. $(A-B)_{11} = ${a[0][0]} - ${gyPar(b[0][0])} = ${a[0][0] - b[0][0]}$.`; }
      else if (op === "lin") { res = lin(A, B, kk); f = `${k}A + B = ${l3tex(res)}`; note = `Βαθμωτός πολλαπλασιασμός: κάθε στοιχείο του $A$ επί $${k}$, π.χ. $${k}\\cdot ${gyPar(a[0][0])} + ${gyPar(b[0][0])} = ${k * a[0][0] + b[0][0]}$.`; }
      else if (op === "tr") { res = l3T(A); f = `A = ${l3tex(A)} \\Rightarrow A^{T} = ${l3tex(res)}`; note = `Οι γραμμές του $A$ γίνονται στήλες: $(A^T)_{ij} = a_{ji}$. Αν ο $A$ είναι ${a.length}×${a[0].length}, ο $A^T$ είναι ${a[0].length}×${a.length}.`; }
      else { const s = lin(A, B, [1, 1]); res = l3T(s); f = `(A+B)^{T} = ${l3tex(res)} = ${l3tex(l3T(A))} + ${l3tex(l3T(B))}`; note = `Ιδιότητες ανάστροφου: $(A+B)^T = A^T + B^T$, $(\\kappa A)^T = \\kappa A^T$, $(A^T)^T = A$.`; }
      $(".pl", box).innerHTML = `<div style="text-align:center;padding:6px 0">$$A = ${l3tex(A)},\\quad B = ${l3tex(B)}$$$$${f}$$</div>`; typeset($(".pl", box));
      $(".wout", box).innerHTML = note; typeset($(".wout", box));
    }
    box.querySelectorAll("select,input").forEach(e => e.oninput = e.onchange = draw); draw();
  },

  /* ---------- 4.2 πολλαπλασιασμός πινάκων ---------- */
  l3mult(box) {
    const P = [["A 2×3 · B 3×2", [[1, 2, -1], [0, 3, 2]], [[2, 1], [-1, 0], [3, 4]]], ["2×2: AB ≠ BA", [[1, 2], [0, 1]], [[1, 0], [3, 1]]],
      ["AB = AC με B ≠ C", [[2, -3], [-4, 6]], [[8, 4], [5, 5]]], ["AB = 0 με A, B ≠ 0", [[3, -6], [-1, 2]], [[2, 6], [1, 3]]]];
    box.innerHTML = `<div class="wctl"><label>πίνακες <select class="pp">${P.map((p, i) => `<option value="${i}">${p[0]}</option>`).join("")}</select></label>
      <label>γραμμή i <select class="si"></select></label><label>στήλη j <select class="sj"></select></label></div><div class="pl" style="overflow-x:auto"></div><div class="wout"></div>`;
    function sizes() { const p = P[+$(".pp", box).value]; $(".si", box).innerHTML = p[1].map((_, i) => `<option value="${i}">${i + 1}</option>`).join(""); $(".sj", box).innerHTML = p[2][0].map((_, i) => `<option value="${i}">${i + 1}</option>`).join(""); }
    function draw() {
      const p = P[+$(".pp", box).value], A = l3M(p[1]), B = l3M(p[2]), i = +$(".si", box).value || 0, j = +$(".sj", box).value || 0, C = l3mm(A, B);
      const ca = "#b35c00", cb = "#1d5fa8", cc = "#1f6f43";
      const terms = p[1][i].map((v, k) => `${gyPar(v)}\\cdot ${gyPar(p[2][k][j])}`).join(" + ");
      $(".pl", box).innerHTML = `<div style="text-align:center;padding:6px 0;font-size:16px">$$${l3tex(A, null, (r) => r === i ? ca : null)}${l3tex(B, null, (r, c) => c === j ? cb : null)} = ${l3tex(C, null, (r, c) => r === i && c === j ? cc : null)}$$</div>`;
      typeset($(".pl", box));
      const nA = p[1].length, kA = p[1][0].length, kB = p[2].length, mB = p[2][0].length;
      let ba = "";
      if (mB === nA) { const D = l3mm(B, A), same = D.length === C.length && D[0].length === C[0].length && D.every((r, x) => r.every((v, y) => l3eq(v, C[x][y])));
        ba = `$BA = ${l3tex(D)}$ ${same ? "(εδώ $AB = BA$)" : `⇒ $AB ${D.length === C.length && D[0].length === C[0].length ? "\\ne" : "\\ne"} BA$: ο πολλαπλασιασμός πινάκων <b>δεν</b> είναι αντιμεταθετικός.`}`; }
      else ba = `Το $BA$ δεν ορίζεται (ο $B$ έχει ${mB} στήλες αλλά ο $A$ έχει ${nA} γραμμές).`;
      let extra = "";
      if (+$(".pp", box).value === 2) { const Cm = l3M([[5, -2], [3, 1]]); extra = `<br>Με $C = ${l3tex(Cm)}$: $AC = ${l3tex(l3mm(A, Cm))} = AB$, αν και $B \\ne C$ — <b>δεν</b> ισχύει νόμος διαγραφής.`; }
      if (+$(".pp", box).value === 3) extra = `<br>Το γινόμενο δύο μη μηδενικών πινάκων μπορεί να είναι ο μηδενικός πίνακας.`;
      $(".wout", box).innerHTML = `Τύπος: (${nA}×${kA})·(${kB}×${mB}) → ${nA}×${mB}. Στοιχείο $c_{${i + 1}${j + 1}} = \\sum_k a_{${i + 1}k}b_{k${j + 1}} = ${terms} = ${l3t(C[i][j])}$ (γραμμή ${i + 1} του $A$ «επί» στήλη ${j + 1} του $B$).<br>${ba}${extra}`;
      typeset($(".wout", box));
    }
    $(".pp", box).onchange = () => { sizes(); draw(); }; $(".si", box).onchange = draw; $(".sj", box).onchange = draw; sizes(); draw();
  },

  /* ---------- 4.3 αντίστροφος 2×2 ---------- */
  l3inv2(box) {
    box.innerHTML = `<div class="wctl">${["a", "b", "c", "d"].map((k, i) => `<label>${k} <input type="range" class="r${k}" min="-6" max="6" value="${[3, 1, 5, 2][i]}"><b class="v${k}"></b></label>`).join("")}</div>
      <div class="pl" style="overflow-x:auto"></div><div class="wout"></div>`;
    function draw() {
      const g = k => +$(".r" + k, box).value, a = g("a"), b = g("b"), c = g("c"), d = g("d"); ["a", "b", "c", "d"].forEach(k => $(".v" + k, box).textContent = g(k));
      const D = a * d - b * c, A = l3M([[a, b], [c, d]]);
      let s = `$$A = ${l3tex(A)},\\qquad \\det A = ad - bc = ${gyPar(a)}\\cdot ${gyPar(d)} - ${gyPar(b)}\\cdot ${gyPar(c)} = ${D}$$`, o;
      if (D === 0) o = `<b style="color:#b3261e">$ad - bc = 0$: ο $A$ δεν αντιστρέφεται</b> (είναι <i>ιδιάζων</i>). Οι γραμμές του είναι ανάλογες.`;
      else {
        const Ai = [[l3N(d, D), l3N(-b, D)], [l3N(-c, D), l3N(a, D)]];
        s += `$$A^{-1} = \\frac{1}{${D}}${l3pm([[d, -b], [-c, a]])} = ${l3tex(Ai)}$$`;
        o = `Έλεγχος: $AA^{-1} = ${l3tex(l3mm(A, Ai))} = I_2$. Εναλλάσσουμε τα διαγώνια στοιχεία, αλλάζουμε πρόσημο στα άλλα δύο και διαιρούμε με την ορίζουσα.`;
      }
      $(".pl", box).innerHTML = `<div style="text-align:center">${s}</div>`; typeset($(".pl", box));
      $(".wout", box).innerHTML = o; typeset($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 4.4 αξιοσημείωτοι πίνακες ---------- */
  l3spec(box) {
    const P = [["γενικός", [[2, -1, 4], [3, 0, 5], [1, 6, -2]]], ["συμμετρικός", [[1, 2, -3], [2, 5, 0], [-3, 0, 4]]], ["αντισυμμετρικός", [[0, 2, -1], [-2, 0, 4], [1, -4, 0]]],
      ["άνω τριγωνικός", [[3, 1, 2], [0, -1, 5], [0, 0, 2]]], ["κάτω τριγωνικός", [[1, 0, 0], [4, 2, 0], [-1, 3, 5]]], ["διαγώνιος", [[2, 0, 0], [0, -3, 0], [0, 0, 1]]], ["βαθμωτός", [[4, 0, 0], [0, 4, 0], [0, 0, 4]]]];
    box.innerHTML = `<div class="wctl"><label>πίνακας <select class="pp">${P.map((p, i) => `<option value="${i}">${p[0]}</option>`).join("")}</select></label><button class="btn ghost small rnd">Τυχαίος</button></div>
      <div class="pl" style="overflow-x:auto"></div><div class="wout"></div>`;
    let cur = P[0][1];
    function draw() {
      const A = l3M(cur), At = l3T(A), n = 3, chk = f => { for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (!f(i, j)) return false; return true; };
      const up = chk((i, j) => i <= j || l3z(A[i][j])), lo = chk((i, j) => i >= j || l3z(A[i][j])), dg = up && lo, sym = chk((i, j) => l3eq(A[i][j], A[j][i])), skew = chk((i, j) => l3eq(A[i][j], l3N(-A[j][i][0], A[j][i][1])));
      const scal = dg && l3eq(A[0][0], A[1][1]) && l3eq(A[1][1], A[2][2]), tr = l3add(l3add(A[0][0], A[1][1]), A[2][2]);
      const S = A.map((r, i) => r.map((v, j) => l3mul(l3add(v, A[j][i]), [1, 2]))), K = A.map((r, i) => r.map((v, j) => l3mul(l3sub(v, A[j][i]), [1, 2])));
      $(".pl", box).innerHTML = `<div style="text-align:center">$$A = ${l3tex(A)},\\quad A^T = ${l3tex(At)}$$$$A = \\underbrace{${l3tex(S)}}_{S = \\frac{A + A^T}{2}} + \\underbrace{${l3tex(K)}}_{K = \\frac{A - A^T}{2}}$$</div>`;
      typeset($(".pl", box));
      const y = (b, t) => `${t}: <b>${b ? "ναι" : "όχι"}</b>`;
      $(".wout", box).innerHTML = `${y(up, "άνω τριγωνικός")} · ${y(lo, "κάτω τριγωνικός")} · ${y(dg, "διαγώνιος")} · ${y(scal, "βαθμωτός")} · ${y(sym, "συμμετρικός ($A^T = A$)")} · ${y(skew, "αντισυμμετρικός ($A^T = -A$)")}.<br>
        Ίχνος $\\operatorname{tr}A = a_{11} + a_{22} + a_{33} = ${l3t(tr)}$.<br><span class="muted">Κάθε τετραγωνικός πίνακας γράφεται μοναδικά ως άθροισμα συμμετρικού $S$ και αντισυμμετρικού $K$. Ένας αντισυμμετρικός έχει μηδενική διαγώνιο.</span>`;
      typeset($(".wout", box));
    }
    $(".pp", box).onchange = () => { cur = P[+$(".pp", box).value][1]; draw(); };
    $(".rnd", box).onclick = () => { cur = [0, 1, 2].map(() => [0, 1, 2].map(() => ri(-5, 5))); draw(); };
    draw();
  },

  /* ---------- 5.x εργαλεία απαλοιφής ---------- */
  l3gj(box) { l3gj(box, "aug"); },
  l3hom(box) { l3gj(box, "hom"); },
  l3invgj(box) { l3gj(box, "inv"); },
  l3rank(box) { l3gj(box, "rank"); }
});

/* ---------- γεννήτριες ---------- */
const l3rm = (m, n, a = -5, b = 5) => Array.from({ length: m }, () => Array.from({ length: n }, () => ri(a, b)));
const l3unimod = () => { /* 3×3 με ορίζουσα ±1 και μικρά στοιχεία */
  for (let g = 0; g < 50; g++) {
    const L = [[1, 0, 0], [ri(-2, 2), 1, 0], [ri(-2, 2), ri(-2, 2), 1]], U = [[1, ri(-2, 2), ri(-2, 2)], [0, 1, ri(-2, 2)], [0, 0, 1]];
    let A = L.map(r => U[0].map((_, j) => r.reduce((s, v, k) => s + v * U[k][j], 0)));
    A = shuffle(A.slice()); if (Math.random() < .5) A[0] = A[0].map(v => -v);
    if (A.every(r => r.every(v => Math.abs(v) <= 9)) && A.flat().filter(v => v === 0).length <= 3) return A;
  }
  return [[1, 2, 0], [0, 1, 1], [1, 2, 1]];
};
const l3fieldsM = (M, nm) => M.flatMap((r, i) => r.map((v, j) => ({ label: `${nm}${i + 1}${j + 1} =`, ans: Array.isArray(v) ? l3s(v) : v })));

var GENS = Object.assign(window.GENS || {}, {
  l3ops: { title: "Γεννήτρια — πράξεις πινάκων", make() {
    const t = ri(0, 2), A = l3rm(2, 2), B = l3rm(2, 2), k = gyNZ(-3, 3);
    if (t === 0) { const C = A.map((r, i) => r.map((v, j) => k * v - B[i][j]));
      return { q: R`Αν $A = ${l3pm(A)}$ και $B = ${l3pm(B)}$, να βρείτε τον πίνακα $C = ${gyC(k, "A")} - B$.`, fields: l3fieldsM(C, "c"),
        sol: R`$c_{ij} = ${gyC(k, "a_{ij}")} - b_{ij}$: $C = ${l3pm(A.map((r, i) => r.map((v, j) => `${k === 1 ? v : k === -1 ? "-" + gyPar(v) : k + "\\cdot " + gyPar(v)} - ${gyPar(B[i][j])}`)))} = ${l3pm(C)}$.` }; }
    if (t === 1) { const M = l3rm(2, 3), T = l3T(M.map(r => r.map(v => l3N(v)))).map(r => r.map(v => v[0])), C = T.map(r => r.map(v => v)); /* 3×2 */
      const D = l3rm(3, 2), S = T.map((r, i) => r.map((v, j) => v + D[i][j]));
      return { q: R`Αν $A = ${l3pm(M)}$ και $B = ${l3pm(D)}$, να βρείτε τον πίνακα $A^T + B$.`, fields: l3fieldsM(S, "c"),
        sol: R`$A^T = ${l3pm(C)}$ (οι γραμμές γίνονται στήλες), άρα $A^T + B = ${l3pm(S)}$.` }; }
    const x = ri(-6, 6), y = ri(-6, 6), a = gyNZ(-5, 5), b = ri(-5, 5);
    return { q: R`Να βρείτε τα $x, y$ ώστε $${l3pm([[`x${gyS(a)}`, 3], [-1, "2y"]])} + ${l3pm([[2, -1], [4, b]])} = ${l3pm([[x + a + 2, 2], [3, 2 * y + b]])}$.`,
      fields: [{ label: "x =", ans: x }, { label: "y =", ans: y }],
      sol: R`Ισότητα πινάκων ⇒ ίσα τα αντίστοιχα στοιχεία: $x${gyS(a + 2)} = ${x + a + 2} \Rightarrow x = ${x}$ και $2y${gyS(b)} = ${2 * y + b} \Rightarrow y = ${y}$.` };
  } },
  l3mul: { title: "Γεννήτρια — πολλαπλασιασμός πινάκων", make() {
    const t = ri(0, 2);
    if (t === 0) { const A = l3rm(2, 2, -4, 4), B = l3rm(2, 2, -4, 4), C = A.map(r => B[0].map((_, j) => r[0] * B[0][j] + r[1] * B[1][j]));
      return { q: R`Να υπολογίσετε το γινόμενο $AB$, όπου $A = ${l3pm(A)}$ και $B = ${l3pm(B)}$.`, fields: l3fieldsM(C, "c"),
        sol: R`$c_{ij}$ = (γραμμή $i$ του $A$)·(στήλη $j$ του $B$): $AB = ${l3pm(A.map(r => B[0].map((_, j) => `${gyPar(r[0])}\\cdot ${gyPar(B[0][j])} + ${gyPar(r[1])}\\cdot ${gyPar(B[1][j])}`)))} = ${l3pm(C)}$.` }; }
    if (t === 1) { const A = l3rm(2, 3, -3, 3), B = l3rm(3, 2, -3, 3), i = ri(0, 1), j = ri(0, 1), v = A[i].reduce((s, x, k) => s + x * B[k][j], 0);
      return { q: R`Αν $A = ${l3pm(A)}$ και $B = ${l3pm(B)}$, να βρείτε το στοιχείο $c_{${i + 1}${j + 1}}$ του $C = AB$ καθώς και τον τύπο του $BA$ (πλήθος γραμμών και στηλών).`,
        fields: [{ label: `c${i + 1}${j + 1} =`, ans: v }, { label: "γραμμές του BA =", ans: 3 }, { label: "στήλες του BA =", ans: 3 }],
        sol: R`$c_{${i + 1}${j + 1}} = ${A[i].map((x, k) => `${gyPar(x)}\\cdot ${gyPar(B[k][j])}`).join(" + ")} = ${v}$. Ο $B$ είναι $3\times 2$ και ο $A$ είναι $2\times 3$, άρα ο $BA$ είναι $3\times 3$ (ενώ ο $AB$ είναι $2\times 2$).` }; }
    const a = gyNZ(-3, 3), n = ri(2, 5), b = ri(2, 3), P = [[1, a], [0, 1]];
    if (Math.random() < .5) return { q: R`Αν $A = ${l3pm(P)}$, να βρείτε τον πίνακα $A^{${n}}$.`, fields: l3fieldsM([[1, n * a], [0, 1]], "a"),
      sol: R`$A^2 = ${l3pm([[1, 2 * a], [0, 1]])}$ και με επαγωγή $A^{k} = ${l3pm([[1, gyC(a, "k")], [0, 1]])}$. Άρα $A^{${n}} = ${l3pm([[1, n * a], [0, 1]])}$.` };
    const D = [[b, 0], [0, -1]];
    return { q: R`Αν $D = ${l3pm(D)}$, να βρείτε τον πίνακα $D^{${n}}$.`, fields: l3fieldsM([[b ** n, 0], [0, (-1) ** n]], "d"),
      sol: R`Για διαγώνιο πίνακα υψώνουμε τα διαγώνια στοιχεία: $D^{${n}} = ${l3pm([[`${b}^{${n}}`, 0], [0, `(-1)^{${n}}`]])} = ${l3pm([[b ** n, 0], [0, (-1) ** n]])}$.` };
  } },
  l3inv: { title: "Γεννήτρια — αντίστροφος 2×2", make() {
    const t = ri(0, 1);
    if (t === 0) { let a, b, c, d, D; do { a = ri(-6, 6); b = ri(-6, 6); c = ri(-6, 6); d = ri(-6, 6); D = a * d - b * c; } while (![1, -1, 2, -2, 3, -3].includes(D));
      const Ai = [[l3N(d, D), l3N(-b, D)], [l3N(-c, D), l3N(a, D)]];
      return { q: R`Να βρείτε τον αντίστροφο του πίνακα $A = ${l3pm([[a, b], [c, d]])}$.`, fields: l3fieldsM(Ai, "x"),
        sol: R`$\det A = ${gyPar(a)}\cdot ${gyPar(d)} - ${gyPar(b)}\cdot ${gyPar(c)} = ${D} \ne 0$, άρα $A^{-1} = ${D === 1 ? "" : D === -1 ? "-" : D < 0 ? `-\\frac{1}{${-D}}` : `\\frac{1}{${D}}`}${l3pm([[d, -b], [-c, a]])} = ${l3pm(Ai)}$.` }; }
    const a = gyNZ(-4, 4), b = gyNZ(-4, 4), c = gyNZ(-4, 4); /* A = [[k, b],[c, a]] μη αντιστρέψιμος ⇔ k a = b c */
    if ((b * c) % a) return GENS.l3inv.make();
    const k = b * c / a;
    return { q: R`Για ποια τιμή του $k$ ο πίνακας $A = ${l3pm([["k", b], [c, a]])}$ <b>δεν</b> είναι αντιστρέψιμος;`, fields: [{ label: "k =", ans: k }],
      sol: R`Ο $A$ αντιστρέφεται αν και μόνο αν $\det A \ne 0$. $\det A = ${gyC(a, "k")} - ${gyPar(b)}\cdot ${gyPar(c)} = ${gyC(a, "k")}${gyS(-b * c)} = 0 \Rightarrow k = ${k}$.` };
  } },
  l3spec: { title: "Γεννήτρια — ίχνος, συμμετρικοί πίνακες", make() {
    const t = ri(0, 2);
    if (t === 0) { const A = l3rm(2, 2, -4, 4), B = l3rm(2, 2, -4, 4), AB = l3mm(l3M(A), l3M(B)), tr = l3add(AB[0][0], AB[1][1])[0];
      return { q: R`Αν $A = ${l3pm(A)}$ και $B = ${l3pm(B)}$, να υπολογίσετε τα $\operatorname{tr}(AB)$ και $\operatorname{tr}(A + B)$.`,
        fields: [{ label: "tr(AB) =", ans: tr }, { label: "tr(A+B) =", ans: A[0][0] + A[1][1] + B[0][0] + B[1][1] }],
        sol: R`$AB = ${l3tex(AB)}$, άρα $\operatorname{tr}(AB) = ${tr}$ (ισούται με $\operatorname{tr}(BA)$). Επίσης $\operatorname{tr}(A+B) = \operatorname{tr}A + \operatorname{tr}B = ${A[0][0] + A[1][1]} + ${gyPar(B[0][0] + B[1][1])} = ${A[0][0] + A[1][1] + B[0][0] + B[1][1]}$.` }; }
    if (t === 1) { const x = ri(-5, 5), y = ri(-5, 5), z = ri(-5, 5), a = gyNZ(-4, 4), b = gyNZ(-4, 4);
      return { q: R`Να βρείτε τα $x, y, z$ ώστε ο πίνακας $A = ${l3pm([[2, `x${gyS(a)}`, `z - 1`], [x + a, 5, `y${gyS(b)}`], [z - 1, y + b, 0]])}$ να είναι συμμετρικός.`,
        fields: [{ label: "x =", ans: x }, { label: "y =", ans: y }, { label: "z =", ans: z }],
        sol: R`Συμμετρικός ⇔ $A^T = A$ ⇔ $a_{ij} = a_{ji}$. $a_{12} = a_{21}$: $x${gyS(a)} = ${x + a} \Rightarrow x = ${x}$. $a_{23} = a_{32}$: $y${gyS(b)} = ${y + b} \Rightarrow y = ${y}$. $a_{13} = a_{31}$: $z - 1 = ${z - 1} \Rightarrow z = ${z}$.` }; }
    let v; do v = [ri(-5, 5), ri(-5, 5), ri(-5, 5)]; while (v.every(x => x === 0));
    return bkMC({ q: R`Ο πίνακας $${l3pm([[0, v[0], v[1]], [-v[0], 0, v[2]], [-v[1], -v[2], 0]])}$ είναι:`, sol: R`Ισχύει $a_{ji} = -a_{ij}$ για κάθε $i, j$ και η διαγώνιος είναι μηδενική, άρα $A^T = -A$: αντισυμμετρικός.${v.every(x => x === 0) ? "" : " Δεν είναι συμμετρικός, αφού κάποιο $a_{ij} \\ne 0$ με $i \\ne j$."}` },
      ["αντισυμμετρικός", "συμμετρικός", "άνω τριγωνικός", "διαγώνιος"], 0);
  } },
  l3sys: { title: "Γεννήτρια — γραμμικά συστήματα (απαλοιφή Gauss)", make() {
    const t = ri(0, 2);
    if (t === 0) { const A = l3unimod(), x = [ri(-4, 4), ri(-4, 4), ri(-4, 4)], b = A.map(r => r.reduce((s, v, k) => s + v * x[k], 0));
      const eq = r => r.map((v, k) => v === 0 ? "" : `${v < 0 ? "-" : "+"} ${Math.abs(v) === 1 ? "" : Math.abs(v)}x_${k + 1}`).filter(Boolean).join(" ").replace(/^\+ /, "").replace(/^- /, "-");
      return { q: R`Να λύσετε με απαλοιφή Gauss το σύστημα $\begin{cases} ${A.map((r, i) => `${eq(r)} = ${b[i]}`).join(" \\\\ ")} \end{cases}$`,
        fields: [{ label: "x₁ =", ans: x[0] }, { label: "x₂ =", ans: x[1] }, { label: "x₃ =", ans: x[2] }],
        sol: R`Επαυξημένος πίνακας $${l3tex(l3M(A.map((r, i) => r.concat(b[i]))), 3)} \sim ${l3tex(l3rrefFull(l3M(A.map((r, i) => r.concat(b[i]))), 4), 3)}$. Ο $A$ έχει 3 οδηγούς (ορίζουσα $${l3t(l3det(l3M(A)))}$), άρα μοναδική λύση $x_1 = ${x[0]}, x_2 = ${x[1]}, x_3 = ${x[2]}$.` }; }
    if (t === 1) { const a = gyNZ(-4, 4), c = gyNZ(-3, 3), b1 = ri(-5, 5), h = a * c, k = c * b1;
      /* x1 + a x2 = b1, c x1 + h x2 = k' */
      return { q: R`Δίνεται το σύστημα $\begin{cases} x_1 ${a < 0 ? "-" : "+"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}x_2 = ${b1} \\ ${gyC(c, "x_1")} + hx_2 = k \end{cases}$. Για ποια τιμή του $h$ το σύστημα <b>δεν</b> έχει μοναδική λύση, και για ποια τιμή του $k$ τότε έχει άπειρες λύσεις;`,
        fields: [{ label: "h =", ans: h }, { label: "k =", ans: k }],
        sol: R`$\Gamma_2 \to \Gamma_2 ${-c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}\Gamma_1$: $\left(\begin{array}{cc|c} 1 & ${a} & ${b1} \\ 0 & h${gyS(-a * c)} & k${gyS(-c * b1)} \end{array}\right)$. Μοναδική λύση ⇔ $h${gyS(-a * c)} \ne 0$, δηλ. $h \ne ${h}$. Για $h = ${h}$: άπειρες λύσεις αν $k = ${k}$, καμία αν $k \ne ${k}$.` }; }
    /* μη συμβιβαστό ή όχι: 3x3 με τρίτη γραμμή = γραμμ. συνδ. */
    const r1 = [1, ri(-3, 3), ri(-3, 3)], r2 = [0, 1, ri(-3, 3)], p = gyNZ(-2, 2), q = gyNZ(-2, 2), b = [ri(-5, 5), ri(-5, 5)];
    const r3 = r1.map((v, k) => p * v + q * r2[k]), ok = Math.random() < .5, b3 = p * b[0] + q * b[1] + (ok ? 0 : gyNZ(-3, 3));
    const M = [r1.concat(b[0]), r2.concat(b[1]), r3.concat(b3)];
    return bkMC({ q: R`Το σύστημα με επαυξημένο πίνακα $${l3tex(l3M(M), 3)}$ είναι:`,
      sol: R`$\Gamma_3 \to \Gamma_3 - (${p})\Gamma_1 - (${q})\Gamma_2$ δίνει τελευταία γραμμή $(0\ \ 0\ \ 0 \mid ${b3 - p * b[0] - q * b[1]})$. ${ok ? "Συμβιβαστό, με $r(A) = r(A|b) = 2 < 3$: άπειρες λύσεις (μία ελεύθερη μεταβλητή)." : "Μη συμβιβαστό: $r(A) = 2 < r(A|b) = 3$."}` },
      ["συμβιβαστό με άπειρες λύσεις", "μη συμβιβαστό", "συμβιβαστό με μοναδική λύση"], ok ? 0 : 1);
  } },
  l3hom: { title: "Γεννήτρια — ομογενή συστήματα, λύσεις του Ax = b", make() {
    const a = ri(-4, 4), b = ri(-4, 4), E = [[1, gyNZ(-2, 2)], [gyNZ(-2, 2), 0]]; /* det E ≠ 0 */
    if (E[0][1] * E[1][0] === 0) return GENS.l3hom.make();
    const Rr = [[1, 0, a], [0, 1, b]], A = E.map(r => Rr[0].map((_, j) => r[0] * Rr[0][j] + r[1] * Rr[1][j]));
    const eq = (r, rhs) => r.map((v, k) => v === 0 ? "" : `${v < 0 ? "-" : "+"} ${Math.abs(v) === 1 ? "" : Math.abs(v)}x_${k + 1}`).filter(Boolean).join(" ").replace(/^\+ /, "").replace(/^- /, "-") + ` = ${rhs}`;
    if (Math.random() < .5) { const t = gyNZ(-3, 3);
      return { q: R`Να βρείτε τη γενική λύση του ομογενούς συστήματος $\begin{cases} ${eq(A[0], 0)} \\ ${eq(A[1], 0)} \end{cases}$ σε διανυσματική μορφή $x = x_3\,v$ και να δώσετε το $v = (v_1, v_2, 1)$.`,
        fields: [{ label: "v₁ =", ans: -a }, { label: "v₂ =", ans: -b }],
        sol: R`Ο ανηγμένος κλιμακωτός είναι $${l3pm(Rr)}$: $x_1 = ${-a === 0 ? 0 : gyC(-a, "x_3")}$, $x_2 = ${-b === 0 ? 0 : gyC(-b, "x_3")}$, $x_3$ ελεύθερη. Άρα $x = x_3${l3pm([[-a], [-b], [1]])}$ (π.χ. για $x_3 = ${t}$: $(${-a * t}, ${-b * t}, ${t})$).` }; }
    const p = [ri(-3, 3), ri(-3, 3), 0], bb = A.map(r => r.reduce((s, v, k) => s + v * p[k], 0)), t = gyNZ(-3, 3);
    return { q: R`Για το σύστημα $\begin{cases} ${eq(A[0], bb[0])} \\ ${eq(A[1], bb[1])} \end{cases}$ η γενική λύση έχει τη μορφή $x = p + x_3 v_h$, όπου $p$ μερική λύση και $v_h$ λύση του ομογενούς. Να βρείτε τη λύση με $x_3 = ${t}$.`,
      fields: [{ label: "x₁ =", ans: p[0] - a * t }, { label: "x₂ =", ans: p[1] - b * t }],
      sol: R`Απαλοιφή: $\left(\begin{array}{ccc|c} 1 & 0 & ${a} & ${p[0]} \\ 0 & 1 & ${b} & ${p[1]} \end{array}\right)$, άρα $x = ${l3pm([[p[0]], [p[1]], [0]])} + x_3${l3pm([[-a], [-b], [1]])}$. Για $x_3 = ${t}$: $x_1 = ${p[0] - a * t}$, $x_2 = ${p[1] - b * t}$.` };
  } },
  l3ginv: { title: "Γεννήτρια — αντίστροφος με [A | I]", make() {
    const A = l3unimod(), Ai = l3rrefFull(l3M(A).map((r, i) => r.concat(l3I(3)[i])), 3).map(r => r.slice(3)), row = ri(0, 2);
    return { q: R`Με τη μέθοδο $[A \mid I] \to [I \mid A^{-1}]$ να βρείτε τη ${["1η", "2η", "3η"][row]} γραμμή του $A^{-1}$, όπου $A = ${l3pm(A)}$.`,
      fields: Ai[row].map((v, j) => ({ label: `(A⁻¹)${row + 1}${j + 1} =`, ans: l3s(v) })),
      sol: R`Με στοιχειώδεις μετασχηματισμούς γραμμών: $[A \mid I] \sim [I \mid A^{-1}]$ με $A^{-1} = ${l3tex(Ai)}$. Έλεγχος: $AA^{-1} = I_3$ (εδώ $\det A = ${l3t(l3det(l3M(A)))}$, γι' αυτό τα στοιχεία είναι ακέραια).` };
  } },
  l3rank: { title: "Γεννήτρια — βαθμός πίνακα", make() {
    const t = ri(0, 1);
    if (t === 0) { const r = ri(1, 3), m = ri(3, 4), n = 4, X = l3rm(m, r, -2, 2), Y = l3rm(r, n, -2, 2), A = X.map(row => Y[0].map((_, j) => row.reduce((s, v, k) => s + v * Y[k][j], 0)));
      const rk = l3rank(l3M(A)); if (rk === 0 || A.flat().some(v => Math.abs(v) > 9) || A.some(r => r.every(v => v === 0))) return GENS.l3rank.make();
      return { q: R`Να βρείτε τον βαθμό του πίνακα $A = ${l3pm(A)}$ και τη μηδενικότητά του ($\dim \operatorname{Nul}A$).`, fields: [{ label: "r(A) =", ans: rk }, { label: "μηδενικότητα =", ans: n - rk }],
        sol: R`Με στοιχειώδεις μετασχηματισμούς γραμμών: $A \sim ${l3tex(l3rrefFull(l3M(A), n))}$. Οι μη μηδενικές γραμμές είναι ${rk}, άρα $r(A) = ${rk}$ και μηδενικότητα $${n} - ${rk} = ${n - rk}$.` }; }
    const a = gyNZ(-3, 3), b = gyNZ(-3, 3), c = ri(-3, 3), lam = ri(-4, 4);
    /* Γ3 = aΓ1 + bΓ2 όταν λ = lam */
    const r1 = [1, c, 2], r2 = [0, 1, -1], r3 = [a, a * c + b, 2 * a - b + 0];
    const A = [r1, r2, [r3[0], r3[1], `${gyC(1, "\\lambda")}${gyS(r3[2] - lam)}`]];
    return { q: R`Για ποια τιμή του $\lambda$ ο πίνακας $${l3pm(A)}$ έχει βαθμό $2$;`, fields: [{ label: "λ =", ans: lam }],
      sol: R`$\Gamma_3 \to \Gamma_3 - (${a})\Gamma_1 - (${b})\Gamma_2$: η τρίτη γραμμή γίνεται $(0\ \ 0\ \ \lambda ${-lam < 0 ? "-" : "+"} ${Math.abs(lam)})$. Οι δύο πρώτες είναι γραμμικώς ανεξάρτητες, άρα $r = 2 \iff \lambda = ${lam}$ (αλλιώς $r = 3$).` };
  } }
});

/* Γραμμική Άλγεβρα ΜΑΣ029 — widgets & γεννήτριες (μέρος 4): Ορίζουσες, Γραμμικές απεικονίσεις */
/* ---------- βοηθητικά ---------- */
const l4Mx = (A, env = "pmatrix") => `\\begin{${env}}${A.map(r => r.join(" & ")).join(" \\\\ ")}\\end{${env}}`;
const l4Minor = (A, i, j) => A.filter((_, r) => r !== i).map(r => r.filter((_, c) => c !== j));
function l4Det(A) { const n = A.length; if (n === 1) return A[0][0]; if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0]; let s = 0; for (let j = 0; j < n; j++) if (A[0][j]) s += (j % 2 ? -1 : 1) * A[0][j] * l4Det(l4Minor(A, 0, j)); return s; }
const l4Mul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const l4T = A => A[0].map((_, j) => A.map(r => r[j]));
function l4Rank(A) { const M = A.map(r => r.slice()); const m = M.length, n = M[0].length; let rk = 0;
  for (let c = 0; c < n && rk < m; c++) { let p = rk; while (p < m && Math.abs(M[p][c]) < 1e-9) p++; if (p === m) continue; [M[rk], M[p]] = [M[p], M[rk]];
    for (let r = 0; r < m; r++) if (r !== rk) { const f = M[r][c] / M[rk][c]; for (let k = c; k < n; k++) M[r][k] -= f * M[rk][k]; } rk++; } return rk; }
const l4Rand = (m, n, a = -3, b = 4) => Array.from({ length: m }, () => Array.from({ length: n }, () => ri(a, b)));
const l4Inv = p => { let c = 0; for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) if (p[i] > p[j]) c++; return c; };
function l4Perms(n) { if (n === 1) return [[1]]; const out = []; l4Perms(n - 1).forEach(p => { for (let i = 0; i <= p.length; i++) out.push([...p.slice(0, i), n, ...p.slice(i)]); }); return out.sort((a, b) => a.join("") < b.join("") ? -1 : 1); }
const l4N = v => (Math.round(v * 100) / 100).toString().replace(".", "{,}");
const l4Tex = el => { if (window.renderMathInElement) renderMathInElement(el, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }], throwOnError: false }); };
const l4Lc = (cs, vs) => cs.map((c, i) => c === 0 ? "" : `${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}${vs[i]}`).filter(Boolean).join(" ").replace(/^\+ /, "").replace(/^- /, "-") || "0";
const l4P = v => v < 0 ? `(${v})` : `${v}`;
const l4Vec = v => `\\begin{pmatrix}${v.join(" \\\\ ")}\\end{pmatrix}`;
const l4Tbl = (A, cls) => `<table class="l4t" style="border-collapse:collapse;margin:6px auto;font-family:var(--mono,monospace);font-size:15px">${A.map((r, i) => `<tr>${r.map((v, j) => `<td style="min-width:34px;padding:5px 8px;text-align:center;border:1px solid var(--line);${cls ? cls(i, j) : ""}">${v}</td>`).join("")}</tr>`).join("")}</table>`;
const L4HI = "background:rgba(37,99,235,.18);font-weight:800", L4HI2 = "background:rgba(234,88,12,.18);font-weight:800", L4DIM = "color:var(--muted);opacity:.45";
function l4Poly(P, pts, style) { const e = svgEl("polygon", { points: pts.map(([x, y]) => `${P.sx(x).toFixed(1)},${P.sy(y).toFixed(1)}`).join(" "), style }); P.layer.appendChild(e); return e; }
function l4Arrow(P, x, y, cls, lab) { P.seg(0, 0, x, y, "curve " + cls); P.dot(x, y, cls === "c2" ? "d2" : "d1", lab, 6, -8); }

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 6.1 Μεταθέσεις: αντιστροφές, πρόσημο, όρος της ορίζουσας ---------- */
  l4perm(box) {
    box.innerHTML = `<div class="wctl"><label>n <select class="sn"><option>3</option><option>4</option></select></label>
      <label>μετάθεση σ <select class="sp"></select></label></div><div class="wout"></div>`;
    const fill = () => { const n = +$(".sn", box).value; $(".sp", box).innerHTML = l4Perms(n).map((p, i) => `<option value="${p.join("")}">(${p.join(" ")})</option>`).join(""); };
    function draw() {
      const p = $(".sp", box).value.split("").map(Number), n = p.length, N = l4Inv(p), pairs = [];
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (p[i] > p[j]) pairs.push(`(${p[i]}, ${p[j]})`);
      const grid = l4Tbl(Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => `a<sub>${i + 1}${j + 1}</sub>`)), (i, j) => p[i] === j + 1 ? L4HI : L4DIM);
      $(".wout", box).innerHTML = `$\\sigma = \\begin{pmatrix}${p.map((_, i) => i + 1).join(" & ")} \\\\ ${p.join(" & ")}\\end{pmatrix}$ · αντιστροφές (ζεύγη σε «λάθος» σειρά): ${pairs.length ? pairs.join(", ") : "καμία"} ⇒ $N(\\sigma) = ${N}$.<br>
        Η μετάθεση είναι <b>${N % 2 ? "περιττή" : "άρτια"}</b>, $\\operatorname{sgn}\\sigma = (-1)^{${N}} = ${N % 2 ? -1 : 1}$.${grid}
        Αντίστοιχος όρος της ορίζουσας: $${N % 2 ? "-" : "+"}\\,${p.map((v, i) => `a_{${i + 1}${v}}`).join("")}$ (ένα στοιχείο από κάθε γραμμή και κάθε στήλη).
        <br><span class="muted">Η ορίζουσα ${n}×${n} έχει ${n === 3 ? 6 : 24} όρους, όσες και οι μεταθέσεις (${n}! = ${n === 3 ? 6 : 24}).</span>`;
      l4Tex($(".wout", box));
    }
    $(".sn", box).onchange = () => { fill(); draw(); }; $(".sp", box).onchange = draw; fill(); $(".sp", box).value = "231"; draw();
  },

  /* ---------- 6.2 Στοιχειώδεις μετασχηματισμοί και ορίζουσα ---------- */
  l4rowops(box) {
    const PRE = [[[1, 2, -1], [2, 3, 1], [-1, 1, 4]], [[2, 4, 6], [1, 5, 2], [3, 1, 0]], [[0, 1, 2], [3, -1, 1], [1, 2, 5]]];
    box.innerHTML = `<div class="wctl"><label>πίνακας <select class="sm"><option value="0">Α</option><option value="1">Β</option><option value="2">Γ</option></select></label>
      <label>πράξη <select class="so"><option value="0">Γᵢ ↔ Γⱼ</option><option value="1">Γᵢ → κ·Γᵢ</option><option value="2">Γᵢ → Γᵢ + κ·Γⱼ</option></select></label>
      <label>i <select class="si"><option>1</option><option>2</option><option>3</option></select></label>
      <label>j <select class="sj"><option>2</option><option>1</option><option>3</option></select></label>
      <label>κ <select class="sk">${[-3, -2, -1, 2, 3].map(v => `<option${v === 2 ? " selected" : ""}>${v}</option>`).join("")}</select></label>
      <button class="btn small ba" type="button">Εφάρμοσε</button><button class="btn small ghost br" type="button">Επαναφορά</button></div><div class="wout"></div>`;
    let A, d0, log;
    const reset = () => { A = PRE[+$(".sm", box).value].map(r => r.slice()); d0 = l4Det(A); log = []; draw(); };
    function draw() {
      const d = l4Det(A);
      $(".wout", box).innerHTML = `$$A' = ${l4Mx(A)} \\qquad \\det A' = ${d}$$
        ${log.length ? `<ol style="margin:4px 0 6px 18px">${log.map(s => `<li>${s}</li>`).join("")}</ol>` : `<p class="muted">Αρχική ορίζουσα: $\\det A = ${d0}$. Εφάρμοσε στοιχειώδεις μετασχηματισμούς γραμμών.</p>`}
        <span class="muted">Κανόνες: εναλλαγή ⇒ αλλάζει πρόσημο · Γᵢ → κΓᵢ ⇒ πολλαπλασιάζεται με κ · Γᵢ → Γᵢ + κΓⱼ ⇒ <b>δεν</b> αλλάζει.</span>`;
      l4Tex($(".wout", box));
    }
    $(".ba", box).onclick = () => {
      const o = +$(".so", box).value, i = +$(".si", box).value - 1, j = +$(".sj", box).value - 1, k = +$(".sk", box).value, before = l4Det(A);
      if (o !== 1 && i === j) { log.push("Διάλεξε i ≠ j."); draw(); return; }
      let txt;
      if (o === 0) { [A[i], A[j]] = [A[j], A[i]]; txt = `$\\Gamma_${i + 1} \\leftrightarrow \\Gamma_${j + 1}$: ορίζουσα $${before} \\to ${-before}$ (αλλαγή προσήμου)`; }
      else if (o === 1) { A[i] = A[i].map(v => k * v); txt = `$\\Gamma_${i + 1} \\to ${k}\\Gamma_${i + 1}$: ορίζουσα $${before} \\to ${k * before}$ (επί ${k})`; }
      else { A[i] = A[i].map((v, c) => v + k * A[j][c]); txt = `$\\Gamma_${i + 1} \\to \\Gamma_${i + 1} ${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}\\Gamma_${j + 1}$: ορίζουσα $${before}$ (αμετάβλητη)`; }
      log.push(txt); if (log.length > 6) log.shift(); draw();
    };
    $(".br", box).onclick = reset; $(".sm", box).onchange = reset; reset();
  },

  /* ---------- 6.3 Ανάπτυγμα Laplace ---------- */
  l4laplace(box) {
    const PRE = [[[2, -1, 3], [4, 0, 1], [5, 2, -2]], [[1, 0, 2], [3, -1, 0], [0, 4, 5]], [[3, 0, 4], [2, 3, 2], [0, 5, -1]]];
    box.innerHTML = `<div class="wctl"><label>πίνακας <select class="sm"><option value="0">Α</option><option value="1">Β</option><option value="2">Γ</option><option value="r">τυχαίος</option></select></label>
      <label>ανάπτυγμα ως προς <select class="sl"><option value="r0">1η γραμμή</option><option value="r1">2η γραμμή</option><option value="r2">3η γραμμή</option><option value="c0">1η στήλη</option><option value="c1">2η στήλη</option><option value="c2">3η στήλη</option></select></label></div><div class="wout"></div>`;
    let A = PRE[0];
    function draw() {
      const L = $(".sl", box).value, row = L[0] === "r", t = +L[1];
      const cells = [0, 1, 2].map(s => row ? [t, s] : [s, t]);
      const sign = (i, j) => ((i + j) % 2 ? "−" : "+");
      const tbl = l4Tbl(A, (i, j) => (row ? i === t : j === t) ? L4HI : "");
      const signs = l4Tbl([0, 1, 2].map(i => [0, 1, 2].map(j => sign(i, j))), (i, j) => (row ? i === t : j === t) ? L4HI2 : L4DIM);
      let tot = 0; const terms = cells.map(([i, j]) => { const m = l4Det(l4Minor(A, i, j)), c = ((i + j) % 2 ? -1 : 1) * m; tot += A[i][j] * c;
        return { i, j, m, c, a: A[i][j] }; });
      const zeros = [0, 1, 2].map(r => A[r].filter(v => v === 0).length), zc = [0, 1, 2].map(c => A.filter(r => r[c] === 0).length);
      const best = Math.max(...zeros, ...zc);
      $(".wout", box).innerHTML = `<div style="display:flex;gap:18px;justify-content:center;flex-wrap:wrap"><div>${tbl}</div><div>${signs}<div class="muted" style="text-align:center;font-size:13px">πρόσημα $(-1)^{i+j}$</div></div></div>
        ${terms.map(o => `$a_{${o.i + 1}${o.j + 1}} = ${o.a}$: $M_{${o.i + 1}${o.j + 1}} = ${l4Mx(l4Minor(A, o.i, o.j), "vmatrix")} = ${o.m}$, $A_{${o.i + 1}${o.j + 1}} = (-1)^{${o.i + o.j + 2}}M_{${o.i + 1}${o.j + 1}} = ${o.c}$`).join("<br>")}
        <p>$$\\det A = ${terms.map(o => `${l4P(o.a)}\\cdot ${l4P(o.c)}`).join(" + ")} = ${tot}$$</p>
        <span class="muted">${best > 0 ? `Συμφέρει η γραμμή/στήλη με τα περισσότερα μηδενικά (${best}): οι όροι με $a_{ij} = 0$ δεν χρειάζεται να υπολογιστούν.` : "Ο πίνακας δεν έχει μηδενικά· κάθε γραμμή/στήλη δίνει το ίδιο αποτέλεσμα."} Το αποτέλεσμα είναι το ίδιο για κάθε επιλογή.</span>`;
      l4Tex($(".wout", box));
    }
    $(".sm", box).onchange = () => { const v = $(".sm", box).value; A = v === "r" ? l4Rand(3, 3, -3, 4) : PRE[+v]; draw(); };
    $(".sl", box).onchange = draw; draw();
  },

  /* ---------- 6.4 Κανόνας Cramer 2×2 ---------- */
  l4cramer(box) {
    const sl = (c, v) => `<label>${c} <input type="range" class="r${c}" min="-5" max="5" value="${v}"><b class="v${c}"></b></label>`;
    box.innerHTML = `<div class="wctl">${sl("a", 2)}${sl("b", 1)}${sl("e", 4)}</div><div class="wctl">${sl("c", 1)}${sl("d", -1)}${sl("f", -1)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const g = c => +$(".r" + c, box).value; const [a, b, c, d, e, f] = ["a", "b", "c", "d", "e", "f"].map(g);
      ["a", "b", "c", "d", "e", "f"].forEach(k => $(".v" + k, box).textContent = g(k));
      const D = a * d - b * c, Dx = e * d - b * f, Dy = a * f - e * c;
      const P = makePlot($(".pl", box), { xmin: -6, xmax: 6, ymin: -6, ymax: 6, H: 300, xstep: 1, ystep: 1 });
      const line = (p, q, r, cls) => { if (q !== 0) P.curve(x => (r - p * x) / q, cls); else if (p !== 0) P.seg(r / p, -6, r / p, 6, "curve " + cls); };
      line(a, b, e, "c1"); line(c, d, f, "c2");
      if (D !== 0 && Math.abs(Dx / D) <= 6 && Math.abs(Dy / D) <= 6) P.dot(Dx / D, Dy / D, "d3", `(${fracS2(Dx, D)}, ${fracS2(Dy, D)})`);
      const sys = `\\begin{cases} ${l4Lc([a, b], ["x", "y"])} = ${e} \\\\ ${l4Lc([c, d], ["x", "y"])} = ${f}\\end{cases}`;
      $(".wout", box).innerHTML = `$${sys}$ &nbsp; $D = ${l4Mx([[a, b], [c, d]], "vmatrix")} = ${D}$, $D_x = ${l4Mx([[e, b], [f, d]], "vmatrix")} = ${Dx}$, $D_y = ${l4Mx([[a, e], [c, f]], "vmatrix")} = ${Dy}$.<br>
        ${D !== 0 ? `$D \\ne 0$: μοναδική λύση $x = \\dfrac{D_x}{D} = ${texFrac(Dx, D)}$, $y = \\dfrac{D_y}{D} = ${texFrac(Dy, D)}$ — οι ευθείες τέμνονται.` : `$D = 0$: ο κανόνας του Cramer <b>δεν εφαρμόζεται</b>· οι ευθείες είναι παράλληλες ή ταυτίζονται (καμία ή άπειρες λύσεις).`}`;
      l4Tex($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 7.1 Είναι γραμμική; ---------- */
  l4lin(box) {
    const MAPS = [
      ["(2x - y,\\ x + 3y)", ([x, y]) => [2 * x - y, x + 3 * y]],
      ["(x + 1,\\ y)", ([x, y]) => [x + 1, y]],
      ["(x^2,\\ y)", ([x, y]) => [x * x, y]],
      ["(y,\\ 0)", ([x, y]) => [y, 0]],
      ["(|x|,\\ x - y)", ([x, y]) => [Math.abs(x), x - y]],
      ["(xy,\\ x)", ([x, y]) => [x * y, x]]];
    box.innerHTML = `<div class="wctl"><label>$T(x, y) =$ <select class="sm">${MAPS.map((m, i) => `<option value="${i}">${m[0].replace(/\\ /g, " ").replace(/\\/g, "")}</option>`).join("")}</select></label>
      <label>u = (<select class="u1">${[-2, -1, 1, 2, 3].map(v => `<option${v === 1 ? " selected" : ""}>${v}</option>`).join("")}</select>, <select class="u2">${[-2, -1, 0, 1, 2].map(v => `<option${v === 2 ? " selected" : ""}>${v}</option>`).join("")}</select>)</label>
      <label>v = (<select class="v1">${[-3, -1, 0, 2].map(v => `<option${v === -1 ? " selected" : ""}>${v}</option>`).join("")}</select>, <select class="v2">${[-2, 1, 3].map(v => `<option${v === 3 ? " selected" : ""}>${v}</option>`).join("")}</select>)</label>
      <label>λ <select class="sl">${[-2, 2, 3].map(v => `<option>${v}</option>`).join("")}</select></label></div><div class="wout"></div>`;
    function draw() {
      const [name, T] = MAPS[+$(".sm", box).value], g = c => +$("." + c, box).value;
      const u = [g("u1"), g("u2")], v = [g("v1"), g("v2")], l = g("sl"), s = [u[0] + v[0], u[1] + v[1]];
      const T1 = T(s), T2 = T(u).map((w, i) => w + T(v)[i]), T3 = T(u.map(w => l * w)), T4 = T(u).map(w => l * w);
      const eq = (p, q) => p[0] === q[0] && p[1] === q[1], ok1 = eq(T1, T2), ok2 = eq(T3, T4), v0 = T([0, 0]);
      const pt = p => `(${p.join(", ")})`;
      $(".wout", box).innerHTML = `$T(x, y) = ${name}$<br>
        $T(u + v) = T${pt(s)} = ${pt(T1)}$, &nbsp; $T(u) + T(v) = ${pt(T2)}$ ${ok1 ? "✓ ίσα" : "✗ <b>διαφέρουν</b>"}<br>
        $T(\\lambda u) = T${pt(u.map(w => l * w))} = ${pt(T3)}$, &nbsp; $\\lambda T(u) = ${pt(T4)}$ ${ok2 ? "✓ ίσα" : "✗ <b>διαφέρουν</b>"}<br>
        $T(0, 0) = ${pt(v0)}$${v0[0] || v0[1] ? " ≠ (0, 0) ⇒ σίγουρα <b>όχι</b> γραμμική" : ""}.<br>
        <span class="muted">${ok1 && ok2 ? "Για αυτά τα u, v, λ οι ιδιότητες ισχύουν· για να είναι γραμμική πρέπει να ισχύουν για <b>όλα</b> τα u, v, λ (απόδειξη με γενικά διανύσματα)." : "Ένα αντιπαράδειγμα αρκεί: η T <b>δεν</b> είναι γραμμική."}</span>`;
      l4Tex($(".wout", box));
    }
    box.querySelectorAll("select").forEach(i => i.onchange = draw); draw(); l4Tex($(".wctl", box));
  },

  /* ---------- 7.2 Γραμμική απεικόνιση του R² — πυρήνας και εικόνα ---------- */
  l4map(box) {
    const sl = (c, v) => `<label>${c} <input type="range" class="r${c}" min="-3" max="3" step="0.5" value="${v}"><b class="v${c}"></b></label>`;
    box.innerHTML = `<div class="wctl">${sl("a", 2)}${sl("b", 1)}${sl("c", 1)}${sl("d", 2)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const g = c => +$(".r" + c, box).value, [a, b, c, d] = ["a", "b", "c", "d"].map(g); ["a", "b", "c", "d"].forEach(k => $(".v" + k, box).textContent = fmt(g(k)));
      const D = a * d - b * c, P = makePlot($(".pl", box), { xmin: -6, xmax: 6, ymin: -5, ymax: 5, H: 320, xstep: 1, ystep: 1 });
      l4Poly(P, [[0, 0], [1, 0], [1, 1], [0, 1]], "fill:var(--blue);fill-opacity:.12;stroke:var(--blue);stroke-width:1.5;stroke-dasharray:4 3");
      l4Poly(P, [[0, 0], [a, c], [a + b, c + d], [b, d]], `fill:${D < 0 ? "var(--red,#dc2626)" : "var(--green,#16a34a)"};fill-opacity:.22;stroke:var(--navy);stroke-width:2`);
      l4Arrow(P, a, c, "c1", "T(e₁)"); l4Arrow(P, b, d, "c2", "T(e₂)");
      const rk = Math.abs(D) > 1e-9 ? 2 : (a || b || c || d) ? 1 : 0;
      if (rk === 1) { // πυρήνας: λύσεις Ax = 0
        const [kx, ky] = (a || b) ? [-b, a] : [-d, c]; const t = 6 / Math.max(Math.abs(kx), Math.abs(ky));
        P.seg(-kx * t, -ky * t, kx * t, ky * t, "guide"); const [ix, iy] = (a || c) ? [a, c] : [b, d]; const s = 6 / Math.max(Math.abs(ix), Math.abs(iy));
        P.seg(-ix * s, -iy * s, ix * s, iy * s, "curve c3");
      }
      $(".wout", box).innerHTML = `$A = ${l4Mx([[a, b], [c, d]].map(r => r.map(l4N)))}$, $\\det A = ${l4N(D)}$ · εμβαδόν εικόνας του μοναδιαίου τετραγώνου $= |\\det A| = ${l4N(Math.abs(D))}$${D < 0 ? " (αντιστροφή προσανατολισμού)" : ""}.<br>
        ${rk === 2 ? `$\\ker T = \\{0\\}$ ($\\dim = 0$), $\\operatorname{Im} T = \\mathbb R^2$ ($\\dim = 2$): η $T$ είναι <b>ισομορφισμός</b> (1–1 και επί).`
          : rk === 1 ? `$\\det A = 0$: το επίπεδο «συνθλίβεται» σε ευθεία. $\\dim\\ker T = 1$ (διακεκομμένη), $\\dim \\operatorname{Im} T = 1$ (πορτοκαλί): $1 + 1 = 2 = \\dim\\mathbb R^2$. Η $T$ δεν είναι ούτε 1–1 ούτε επί.`
          : `Μηδενική απεικόνιση: $\\ker T = \\mathbb R^2$, $\\operatorname{Im}T = \\{0\\}$.`}`;
      l4Tex($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 7.3 Πίνακας ως προς βάση ---------- */
  l4basis(box) {
    const AS = [[[4, 1], [2, 3]], [[1, 2], [3, 4]], [[2, 1], [0, 2]], [[0, -1], [1, 0]]];
    const BS = [[[1, 0], [0, 1]], [[1, 1], [1, -1]], [[1, -2], [1, 1]], [[1, 1], [0, 1]]];
    box.innerHTML = `<div class="wctl"><label>A <select class="sa">${AS.map((m, i) => `<option value="${i}">[[${m[0]}],[${m[1]}]]</option>`).join("")}</select></label>
      <label>βάση B = {b₁, b₂} <select class="sb">${BS.map((b, i) => `<option value="${i}">{(${b[0]}), (${b[1]})}</option>`).join("")}</select></label></div><div class="pl"></div><div class="wout"></div>`;
    $(".sb", box).value = "2";
    function draw() {
      const A = AS[+$(".sa", box).value], B = BS[+$(".sb", box).value], P = l4T(B), dP = l4Det(P);
      const adj = [[P[1][1], -P[0][1]], [-P[1][0], P[0][0]]], N = l4Mul(l4Mul(adj, A), P);
      const Bt = N.map(r => r.map(v => texFrac(v, dP)));
      const Pl = makePlot($(".pl", box), { xmin: -7, xmax: 7, ymin: -6, ymax: 6, H: 300, xstep: 1, ystep: 1 });
      B.forEach((b, k) => { const Tb = l4Mul(A, [[b[0]], [b[1]]]).map(r => r[0]); l4Arrow(Pl, b[0], b[1], "c1", `b${k ? "₂" : "₁"}`); if (Math.max(...Tb.map(Math.abs)) <= 7) l4Arrow(Pl, Tb[0], Tb[1], "c2", `T(b${k ? "₂" : "₁"})`); });
      const diag = N[0][1] === 0 && N[1][0] === 0;
      $(".wout", box).innerHTML = `Πίνακας μετάβασης $P = [\\,b_1\\ b_2\\,] = ${l4Mx(P)}$ ($\\det P = ${dP}$).<br>
        $$[T]_B = P^{-1}AP = ${l4Mx(Bt)}$$ Κάθε στήλη $j$ δίνει τις συντεταγμένες του $T(b_j)$ στη βάση $B$.
        ${diag ? "<b>Διαγώνιος!</b> Τα $b_1, b_2$ είναι ιδιοδιανύσματα του $A$ (κεφ. 9)." : ""}<br>
        <span class="muted">Οι $A$ και $[T]_B$ είναι <b>όμοιοι</b>: ίδια ορίζουσα ($${l4Det(A)}$) και ίδιο ίχνος ($${A[0][0] + A[1][1]}$).</span>`;
      l4Tex($(".wout", box));
    }
    box.querySelectorAll("select").forEach(i => i.onchange = draw); draw();
  },

  /* ---------- 7.4 Γεωμετρικοί μετασχηματισμοί ---------- */
  l4geo(box) {
    box.innerHTML = `<div class="wctl"><label>μετασχηματισμός <select class="st"><option value="0">στροφή κατά θ</option><option value="1">ανάκλαση ως προς ευθεία γωνίας φ</option><option value="2">προβολή σε ευθεία γωνίας φ</option><option value="3">οριζόντια διάτμηση κ</option><option value="4">ομοιοθεσία λ</option></select></label>
      <label><span class="pn">θ</span> <input type="range" class="rp" min="-180" max="180" step="15" value="90"><b class="vp"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    const F = [[0, 0], [0, 3], [2, 3], [2, 2.4], [0.6, 2.4], [0.6, 1.8], [1.6, 1.8], [1.6, 1.2], [0.6, 1.2], [0.6, 0]];
    let lastT = -1;
    function draw() {
      const t = +$(".st", box).value, sl = $(".rp", box);
      if (t !== lastT) { const cfg = [[-180, 180, 15, 90], [-90, 90, 15, 45], [-90, 90, 15, 30], [-2, 2, 0.5, 1], [-2, 2, 0.5, 1.5]][t];
        [sl.min, sl.max, sl.step, sl.value] = cfg; $(".pn", box).textContent = ["θ", "φ", "φ", "κ", "λ"][t]; lastT = t; }
      const p = +sl.value; $(".vp", box).textContent = t < 3 ? p + "°" : fmt(p);
      const r = p * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), c2 = Math.cos(2 * r), s2 = Math.sin(2 * r);
      const M = [[[c, -s], [s, c]], [[c2, s2], [s2, -c2]], [[c * c, s * c], [s * c, s * s]], [[1, p], [0, 1]], [[p, 0], [0, p]]][t];
      const sym = [R`\begin{pmatrix}\cos\theta & -\sin\theta \\ \sin\theta & \cos\theta\end{pmatrix}`, R`\begin{pmatrix}\cos 2\varphi & \sin 2\varphi \\ \sin 2\varphi & -\cos 2\varphi\end{pmatrix}`,
        R`\begin{pmatrix}\cos^2\varphi & \sin\varphi\cos\varphi \\ \sin\varphi\cos\varphi & \sin^2\varphi\end{pmatrix}`, R`\begin{pmatrix}1 & \kappa \\ 0 & 1\end{pmatrix}`, R`\begin{pmatrix}\lambda & 0 \\ 0 & \lambda\end{pmatrix}`][t];
      const P = makePlot($(".pl", box), { xmin: -6, xmax: 6, ymin: -5, ymax: 5, H: 320, xstep: 1, ystep: 1 });
      if (t === 1 || t === 2) { const L = 8; P.seg(-L * c, -L * s, L * c, L * s, "guide"); }
      l4Poly(P, F, "fill:var(--blue);fill-opacity:.18;stroke:var(--blue);stroke-width:1.5");
      const img = F.map(([x, y]) => [M[0][0] * x + M[0][1] * y, M[1][0] * x + M[1][1] * y]);
      l4Poly(P, img, "fill:var(--orange,#ea580c);fill-opacity:.25;stroke:var(--orange,#ea580c);stroke-width:2");
      const D = M[0][0] * M[1][1] - M[0][1] * M[1][0];
      $(".wout", box).innerHTML = `$$${sym} = ${l4Mx(M.map(r => r.map(v => l4N(Math.abs(v) < 1e-9 ? 0 : v))))}$$ $\\det = ${l4N(Math.abs(D) < 1e-9 ? 0 : D)}$ — ${["η στροφή διατηρεί εμβαδά και προσανατολισμό", "η ανάκλαση διατηρεί εμβαδά αλλά <b>αντιστρέφει</b> τον προσανατολισμό", "η προβολή «συνθλίβει» το επίπεδο στην ευθεία: <b>μη αντιστρέψιμη</b>", "η διάτμηση διατηρεί το εμβαδόν", "η ομοιοθεσία πολλαπλασιάζει τα εμβαδά επί $\\lambda^2$"][t]}. Μπλε: το αρχικό σχήμα «F», πορτοκαλί: η εικόνα του.`;
      l4Tex($(".wout", box));
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  }
});

/* ================= Γεννήτριες ================= */
var GENS = Object.assign(window.GENS || {}, {
  l4det: { title: "Γεννήτρια — ορίζουσες 2×2, 3×3 και μεταθέσεις", make() {
    const t = ri(0, 3);
    if (t === 0) { const A = l4Rand(2, 2, -6, 7), d = l4Det(A); return { q: R`Να υπολογίσετε την ορίζουσα $${l4Mx(A, "vmatrix")}$.`, fields: [{ label: "=", ans: d }], hint: R`$\alpha\delta - \beta\gamma$.`, sol: R`$${l4P(A[0][0])}\cdot ${l4P(A[1][1])} - ${l4P(A[0][1])}\cdot ${l4P(A[1][0])} = ${d}$.` }; }
    if (t === 1) { const A = l4Rand(3, 3, -3, 4), d = l4Det(A), a = A;
      const p = [a[0][0] * a[1][1] * a[2][2], a[0][1] * a[1][2] * a[2][0], a[0][2] * a[1][0] * a[2][1]], m = [a[0][2] * a[1][1] * a[2][0], a[0][0] * a[1][2] * a[2][1], a[0][1] * a[1][0] * a[2][2]];
      return { q: R`Να υπολογίσετε (π.χ. με τον κανόνα του Sarrus) την ορίζουσα $${l4Mx(A, "vmatrix")}$.`, fields: [{ label: "=", ans: d }], hint: R`Τρεις «κύριες» διαγώνιοι με $+$, τρεις «δευτερεύουσες» με $-$.`,
        sol: R`$[${p.map(l4P).join(" + ")}] - [${m.map(l4P).join(" + ")}] = ${p.reduce((s, v) => s + v, 0)} - ${l4P(m.reduce((s, v) => s + v, 0))} = ${d}$.` }; }
    const n = 4, perm = bkPick(l4Perms(n)), N = l4Inv(perm);
    if (t === 2) return { q: R`Δίνεται η μετάθεση $\sigma = \begin{pmatrix}1 & 2 & 3 & 4 \\ ${perm.join(" & ")}\end{pmatrix}$. Να βρείτε το πλήθος των αντιστροφών $N(\sigma)$ και το πρόσημο $\operatorname{sgn}\sigma$.`,
      fields: [{ label: "N(σ) =", ans: N }, { label: "sgn σ =", ans: N % 2 ? -1 : 1 }], hint: R`Μετράμε τα ζεύγη $i < j$ με $\sigma(i) > \sigma(j)$.`, sol: R`$N(\sigma) = ${N}$, άρα η μετάθεση είναι ${N % 2 ? "περιττή" : "άρτια"} και $\operatorname{sgn}\sigma = ${N % 2 ? -1 : 1}$.` };
    return bkMC({ q: R`Με ποιο πρόσημο εμφανίζεται ο όρος $${perm.map((v, i) => `a_{${i + 1}${v}}`).join("")}$ στο ανάπτυγμα της ορίζουσας ενός $4\times 4$ πίνακα;`,
      sol: R`Η μετάθεση $(${perm.join("\\ ")})$ έχει $${N}$ αντιστροφές, άρα πρόσημο $(-1)^{${N}} = ${N % 2 ? -1 : 1}$.` }, [`$${N % 2 ? "-" : "+"}$`, `$${N % 2 ? "+" : "-"}$`], 0);
  } },
  l4prop: { title: "Γεννήτρια — ιδιότητες οριζουσών", make() {
    const t = ri(0, 2);
    if (t === 0) { const n = bkPick([2, 3, 4]), d = gyNZ(-5, 5), k = bkPick([-2, 2, 3]);
      return { q: R`Έστω $A$ πίνακας $${n}\times ${n}$ με $\det A = ${d}$. Να βρείτε τις ορίζουσες $\det(${k}A)$, $\det(A^{T})$ και $\det(A^{-1})$.`,
        fields: [{ label: `det(${k}A) =`, ans: k ** n * d }, { label: "det(Aᵀ) =", ans: d }, { label: "det(A⁻¹) =", ans: gyF(1, d) }], hint: R`$\det(\kappa A) = \kappa^{n}\det A$, $\det A^T = \det A$, $\det A^{-1} = 1/\det A$.`,
        sol: R`$\det(${k}A) = ${l4P(k)}^{${n}}\cdot ${l4P(d)} = ${k ** n * d}$, $\det A^T = ${d}$, $\det A^{-1} = ${texFrac(1, d)}$.` }; }
    if (t === 1) { const da = gyNZ(-4, 4), db = gyNZ(-3, 3), n = bkPick([3, 4]);
      return { q: R`Οι $A, B$ είναι $${n}\times ${n}$ με $\det A = ${da}$ και $\det B = ${db}$. Να υπολογίσετε $\det(AB)$, $\det(A^2B^{-1})$ και $\det(-B^{T})$.`,
        fields: [{ label: "det(AB) =", ans: da * db }, { label: "det(A²B⁻¹) =", ans: gyF(da * da, db) }, { label: "det(−Bᵀ) =", ans: (-1) ** n * db }], hint: R`$\det(AB) = \det A\det B$ και $\det(-B^T) = (-1)^n\det B$.`,
        sol: R`$\det(AB) = ${da * db}$, $\det(A^2B^{-1}) = \dfrac{(${da})^2}{${db}} = ${texFrac(da * da, db)}$, $\det(-B^T) = (-1)^{${n}}\cdot ${l4P(db)} = ${(-1) ** n * db}$.` }; }
    const n = bkPick([3, 4]), A = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => j < i ? 0 : j === i ? gyNZ(-3, 4) : ri(-5, 6))), d = A.reduce((s, r, i) => s * r[i], 1);
    return { q: R`Να υπολογίσετε την ορίζουσα του τριγωνικού πίνακα $${l4Mx(A)}$.`, fields: [{ label: "det =", ans: d }], hint: R`Τριγωνικός πίνακας: γινόμενο των διαγώνιων στοιχείων.`, sol: R`$${A.map((r, i) => l4P(r[i])).join("\\cdot ")} = ${d}$.` };
  } },
  l4lap: { title: "Γεννήτρια — ανάπτυγμα ορίζουσας, ελάσσονες, αλγεβρικά συμπληρώματα", make() {
    const t = ri(0, 1);
    if (t === 0) { const A = l4Rand(3, 3, -4, 5), i = ri(0, 2), j = ri(0, 2), m = l4Det(l4Minor(A, i, j));
      return { q: R`Για τον πίνακα $A = ${l4Mx(A)}$ να βρείτε την ελάσσονα ορίζουσα $M_{${i + 1}${j + 1}}$ και το αλγεβρικό συμπλήρωμα $A_{${i + 1}${j + 1}}$.`,
        fields: [{ label: `M${i + 1}${j + 1} =`, ans: m }, { label: `A${i + 1}${j + 1} =`, ans: ((i + j) % 2 ? -1 : 1) * m }], hint: R`Διαγράφουμε τη γραμμή $${i + 1}$ και τη στήλη $${j + 1}$· $A_{ij} = (-1)^{i+j}M_{ij}$.`,
        sol: R`$M_{${i + 1}${j + 1}} = ${l4Mx(l4Minor(A, i, j), "vmatrix")} = ${m}$, $A_{${i + 1}${j + 1}} = (-1)^{${i + j + 2}}\cdot ${l4P(m)} = ${((i + j) % 2 ? -1 : 1) * m}$.` }; }
    let A, r, c; do { A = l4Rand(4, 4, -3, 4); r = ri(0, 3); c = ri(0, 3); A[r] = A[r].map((v, k) => k === c ? gyNZ(-3, 3) : 0); } while (l4Det(A) === 0 && Math.random() < .7);
    const m = l4Det(l4Minor(A, r, c)), d = l4Det(A);
    return { q: R`Να υπολογίσετε την ορίζουσα $${l4Mx(A, "vmatrix")}$.`, fields: [{ label: "=", ans: d }], hint: R`Ανάπτυγμα ως προς τη ${r + 1}η γραμμή: έχει ένα μόνο μη μηδενικό στοιχείο.`,
      sol: R`Ανάπτυγμα ως προς τη ${r + 1}η γραμμή: $\det = (-1)^{${r + c + 2}}\cdot ${l4P(A[r][c])}\cdot M_{${r + 1}${c + 1}}$, με $M_{${r + 1}${c + 1}} = ${l4Mx(l4Minor(A, r, c), "vmatrix")} = ${m}$. Άρα $\det = ${d}$.` };
  } },
  l4cram: { title: "Γεννήτρια — Cramer, αντίστροφος, εμβαδά", make() {
    const t = ri(0, 2);
    if (t === 0) { let A; do A = l4Rand(3, 3, -2, 3); while (l4Det(A) === 0); const x = [gyNZ(-3, 3), ri(-3, 3), gyNZ(-3, 3)], b = A.map(r => r.reduce((s, v, k) => s + v * x[k], 0)), D = l4Det(A), k = ri(0, 2);
      const Ak = A.map((r, i) => r.map((v, j) => j === k ? b[i] : v)), Dk = l4Det(Ak), vars = ["x_1", "x_2", "x_3"];
      const eqs = A.map((r, i) => r.map((v, j) => v === 0 ? "" : `${v < 0 ? "-" : "+"} ${Math.abs(v) === 1 ? "" : Math.abs(v)}${vars[j]}`).filter(Boolean).join(" ").replace(/^\+ /, "").replace(/^- /, "-") + ` &= ${b[i]}`).join(" \\\\ ");
      return { q: R`Με τον κανόνα του Cramer, να βρείτε την ορίζουσα $D$ του συστήματος $\begin{aligned} ${eqs}\end{aligned}$ και τον άγνωστο $${vars[k]}$.`,
        fields: [{ label: "D =", ans: D }, { label: `x${k + 1} =`, ans: x[k] }], hint: R`$${vars[k]} = D_${k + 1}/D$, όπου η $D_${k + 1}$ προκύπτει αντικαθιστώντας τη ${k + 1}η στήλη με τους σταθερούς όρους.`,
        sol: R`$D = ${l4Mx(A, "vmatrix")} = ${D}$, $D_${k + 1} = ${l4Mx(Ak, "vmatrix")} = ${Dk}$, άρα $${vars[k]} = \dfrac{${Dk}}{${D}} = ${x[k]}$.` }; }
    if (t === 1) { let A, d; do { A = l4Rand(2, 2, -5, 6); d = l4Det(A); } while (d === 0); const inv = [[A[1][1], -A[0][1]], [-A[1][0], A[0][0]]];
      return { q: R`Να βρείτε τον αντίστροφο του $A = ${l4Mx(A)}$ με τη βοήθεια του προσαρτημένου πίνακα (στοιχεία κατά γραμμές).`,
        fields: inv.flat().map((v, i) => ({ label: `(A⁻¹)${Math.floor(i / 2) + 1}${i % 2 + 1} =`, ans: gyF(v, d) })), hint: R`$A^{-1} = \dfrac{1}{\det A}\operatorname{adj}A$, $\operatorname{adj}\begin{pmatrix}a & b \\ c & d\end{pmatrix} = \begin{pmatrix}d & -b \\ -c & a\end{pmatrix}$.`,
        sol: R`$\det A = ${d}$, $A^{-1} = ${d === 1 ? "" : d === -1 ? "-" : d < 0 ? `-\\dfrac{1}{${-d}}` : `\\dfrac{1}{${d}}`}${l4Mx(inv)} = ${l4Mx(inv.map(r => r.map(v => texFrac(v, d))))}$.` }; }
    const P = [[ri(-4, 4), ri(-4, 4)], [ri(-4, 4), ri(-4, 4)], [ri(-4, 4), ri(-4, 4)]], u = [P[1][0] - P[0][0], P[1][1] - P[0][1]], v = [P[2][0] - P[0][0], P[2][1] - P[0][1]], D = u[0] * v[1] - u[1] * v[0];
    if (D === 0) return GENS.l4cram.make();
    return { q: R`Να βρείτε το εμβαδόν του τριγώνου με κορυφές $(${P[0]}), (${P[1]}), (${P[2]})$.`.replace(/\((-?\d+),(-?\d+)\)/g, "($1, $2)"), fields: [{ label: "Ε =", ans: gyF(Math.abs(D), 2) }], hint: R`$E = \tfrac12\left|\det[\,u\ v\,]\right|$ με $u, v$ τα διανύσματα δύο πλευρών από την ίδια κορυφή.`,
      sol: R`$u = (${u[0]}, ${u[1]})$, $v = (${v[0]}, ${v[1]})$, $\det = ${l4Mx([[u[0], v[0]], [u[1], v[1]]], "vmatrix")} = ${D}$, άρα $E = \tfrac12\cdot ${Math.abs(D)} = ${texFrac(Math.abs(D), 2)}$.` };
  } },
  l4lin: { title: "Γεννήτρια — γραμμικές απεικονίσεις και κανονικός πίνακας", make() {
    const t = ri(0, 2), lc = (cs, vs) => { const s = cs.map((c, i) => c === 0 ? "" : `${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}${vs[i]}`).filter(Boolean).join(" ").replace(/^\+ /, "").replace(/^- /, "-"); return s || "0"; };
    if (t === 0) { let A; do A = l4Rand(2, 3, -3, 4); while (A.some(r => r.every(v => v === 0)));
      return { q: R`Δίνεται η γραμμική απεικόνιση $T:\mathbb R^3 \to \mathbb R^2$, $T(x, y, z) = (${lc(A[0], ["x", "y", "z"])},\ ${lc(A[1], ["x", "y", "z"])})$. Να βρείτε τον κανονικό της πίνακα (κατά γραμμές).`,
        fields: A.flat().map((v, i) => ({ label: `a${Math.floor(i / 3) + 1}${i % 3 + 1} =`, ans: v })), hint: R`Οι στήλες του πίνακα είναι οι $T(e_1), T(e_2), T(e_3)$.`, sol: R`$A = ${l4Mx(A)}$: η $j$ στήλη είναι η εικόνα $T(e_j)$.` }; }
    if (t === 1) { const y1 = [ri(-4, 4), ri(-4, 4)], y2 = [ri(-4, 4), ri(-4, 4)], v = [gyNZ(-4, 5), gyNZ(-4, 4)], w = [v[0] * y1[0] + v[1] * y2[0], v[0] * y1[1] + v[1] * y2[1]];
      return { q: R`Η γραμμική $T:\mathbb R^2\to\mathbb R^2$ ικανοποιεί $T(e_1) = (${y1[0]}, ${y1[1]})$ και $T(e_2) = (${y2[0]}, ${y2[1]})$. Να βρείτε το $T(${v[0]}, ${v[1]})$.`,
        fields: [{ label: "1η συνιστώσα =", ans: w[0] }, { label: "2η συνιστώσα =", ans: w[1] }], hint: R`$(${v[0]}, ${v[1]}) = ${lc(v, ["e_1", "e_2"])}$ και γραμμικότητα.`,
        sol: R`$T(${v[0]}, ${v[1]}) = ${lc(v, ["T(e_1)", "T(e_2)"])} = (${w[0]}, ${w[1]})$.` }; }
    const opts = bkPick([[["(2x - y,\\ 3x)", "(x + 1,\\ y)", "(x^2,\\ y)", "(xy,\\ 0)"], 0], [["(0,\\ x + y)", "(x,\\ y - 2)", "(|x|,\\ y)", "(\\sin x,\\ y)"], 0], [["(x - 3y,\\ 0)", "(x,\\ 1)", "(y^2,\\ x)", "(2^x,\\ y)"], 0]]);
    return bkMC({ q: R`Ποια από τις παρακάτω απεικονίσεις $T:\mathbb R^2\to\mathbb R^2$ είναι γραμμική;`, sol: R`Γραμμική είναι η $T(x, y) = ${opts[0][0]}$: κάθε συνιστώσα είναι γραμμικός συνδυασμός των $x, y$ χωρίς σταθερό όρο. Οι άλλες αποτυγχάνουν (σταθερός όρος ⇒ $T(0) \ne 0$, ή μη γραμμικός όρος ⇒ $T(\lambda u) \ne \lambda T(u)$).` },
      opts[0].map(o => `$T(x, y) = ${o}$`), 0);
  } },
  l4ker: { title: "Γεννήτρια — πυρήνας, εικόνα, θεώρημα διάστασης", make() {
    const m = ri(2, 3), n = ri(3, 4), r = ri(1, Math.min(m, n));
    let A; do { const X = l4Rand(m, r, -2, 2), Y = l4Rand(r, n, -2, 2); A = l4Mul(X, Y); } while (l4Rank(A) !== r || A.flat().every(v => v === 0));
    const t = ri(0, 1);
    if (t === 0) return { q: R`Θεωρούμε την $T:\mathbb R^{${n}}\to\mathbb R^{${m}}$, $T(X) = AX$, με $A = ${l4Mx(A)}$. Να βρείτε $\dim\operatorname{Im}T$ και $\dim\ker T$.`,
      fields: [{ label: "dim Im T =", ans: r }, { label: "dim ker T =", ans: n - r }], hint: R`$\dim\operatorname{Im}T = $ βαθμός του $A$· $\dim\ker T + \dim\operatorname{Im}T = ${n}$.`,
      sol: R`Με γραμμοπράξεις ο $A$ έχει ${r === 1 ? "1 οδηγό στοιχείο" : r + " οδηγά στοιχεία"}, άρα βαθμό $${r}$. $\dim\operatorname{Im}T = ${r}$ και από το θεώρημα διάστασης $\dim\ker T = ${n} - ${r} = ${n - r}$.` };
    const one = n - r === 0, onto = r === m;
    return bkMC({ q: R`Η $T:\mathbb R^{${n}}\to\mathbb R^{${m}}$, $T(X) = AX$, με $A = ${l4Mx(A)}$ (βαθμός $${r}$) είναι:`, sol: R`$\dim\ker T = ${n} - ${r} = ${n - r}$ ⇒ ${one ? "1–1" : "όχι 1–1"}· $\dim\operatorname{Im}T = ${r} ${onto ? `= \\dim\\mathbb R^{${m}}$ ⇒ επί` : `< ${m}$ ⇒ όχι επί`}.` },
      ["1–1 και επί", "1–1 αλλά όχι επί", "επί αλλά όχι 1–1", "ούτε 1–1 ούτε επί"], one && onto ? 0 : one ? 1 : onto ? 2 : 3);
  } },
  l4mat: { title: "Γεννήτρια — πίνακας ως προς βάση, σύνθεση", make() {
    const t = ri(0, 1);
    if (t === 0) { const A = l4Rand(2, 2, -3, 4), B = l4Rand(2, 2, -3, 4), C = l4Mul(B, A);
      return { q: R`Οι $S, T:\mathbb R^2\to\mathbb R^2$ έχουν κανονικούς πίνακες $[S] = ${l4Mx(A)}$ και $[T] = ${l4Mx(B)}$. Να βρείτε τον πίνακα της σύνθεσης $T\circ S$ (κατά γραμμές).`,
        fields: C.flat().map((v, i) => ({ label: `c${Math.floor(i / 2) + 1}${i % 2 + 1} =`, ans: v })), hint: R`$[T\circ S] = [T]\,[S]$ (πρώτα εφαρμόζεται η $S$).`, sol: R`$[T\circ S] = ${l4Mx(B)}${l4Mx(A)} = ${l4Mx(C)}$.` }; }
    let P; do P = l4Rand(2, 2, -2, 2); while (Math.abs(l4Det(P)) !== 1);
    const D = [[gyNZ(-3, 4), ri(-2, 2)], [0, gyNZ(-3, 4)]], d = l4Det(P), adj = [[P[1][1], -P[0][1]], [-P[1][0], P[0][0]]], A = l4Mul(l4Mul(P, D), adj).map(r => r.map(v => v / d));
    return { q: R`Η $T:\mathbb R^2\to\mathbb R^2$ έχει κανονικό πίνακα $A = ${l4Mx(A)}$. Να βρείτε τον πίνακα $[T]_B$ ως προς τη βάση $B = \{(${P[0][0]}, ${P[1][0]}),\ (${P[0][1]}, ${P[1][1]})\}$ (κατά γραμμές).`,
      fields: D.flat().map((v, i) => ({ label: `b${Math.floor(i / 2) + 1}${i % 2 + 1} =`, ans: v })), hint: R`$[T]_B = P^{-1}AP$ με $P = ${l4Mx(P)}$ (στήλες τα διανύσματα της $B$).`,
      sol: R`$P^{-1} = ${l4Mx(adj.map(r => r.map(v => v / d)))}$ και $[T]_B = P^{-1}AP = ${l4Mx(D)}$.` };
  } },
  l4geo: { title: "Γεννήτρια — γεωμετρικοί μετασχηματισμοί του R²", make() {
    const x = gyNZ(-5, 5), y = gyNZ(-5, 5);
    const T = bkPick([["της στροφής κατά $90^\\circ$ γύρω από την αρχή", [[0, -1], [1, 0]]], ["της στροφής κατά $180^\\circ$ γύρω από την αρχή", [[-1, 0], [0, -1]]], ["της στροφής κατά $-90^\\circ$ γύρω από την αρχή", [[0, 1], [-1, 0]]],
      ["της ανάκλασης ως προς την ευθεία $y = x$", [[0, 1], [1, 0]]], ["της ανάκλασης ως προς την ευθεία $y = -x$", [[0, -1], [-1, 0]]], ["της ανάκλασης ως προς τον άξονα $x'x$", [[1, 0], [0, -1]]],
      ["της ορθής προβολής στον άξονα $y'y$", [[0, 0], [0, 1]]], ["της οριζόντιας διάτμησης $(x, y)\\mapsto(x + 2y, y)$", [[1, 2], [0, 1]]], ["της κατακόρυφης διάτμησης $(x, y)\\mapsto(x, y - x)$", [[1, 0], [-1, 1]]]]);
    const M = T[1], w = [M[0][0] * x + M[0][1] * y, M[1][0] * x + M[1][1] * y];
    return { q: R`Να βρείτε την εικόνα του σημείου $(${x}, ${y})$ μέσω ${T[0]}.`, fields: [{ label: "x' =", ans: w[0] }, { label: "y' =", ans: w[1] }],
      hint: R`Ο κανονικός πίνακας είναι $${l4Mx(M)}$.`, sol: R`$${l4Mx(M)}${l4Vec([x, y])} = ${l4Vec(w)}$, δηλαδή $(${w[0]}, ${w[1]})$.` };
  } }
});

/* Γραμμική Άλγεβρα ΜΑΣ029 — widgets & γεννήτριες (μέρος 5: ιδιοτιμές, εσωτερικό γινόμενο) */
const l5M = A => "\\begin{pmatrix} " + A.map(r => r.join(" & ")).join(" \\\\ ") + " \\end{pmatrix}";
const l5V = v => "(" + v.join(", ") + ")";
const l5Mul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0)));
const l5Inv1 = P => { const d = P[0][0] * P[1][1] - P[0][1] * P[1][0]; return [[P[1][1] / d, -P[0][1] / d], [-P[1][0] / d, P[0][0] / d]]; }; /* det = ±1 */
const l5Fix = A => A.map(r => r.map(x => Math.round(x) + 0));
const l5Dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
const l5Cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const l5Red = v => { const g = v.reduce((s, x) => gcdI(s, Math.abs(x)), 0) || 1; return v.map(x => x / g + 0); };
const l5Q = (tr, dt) => `\\lambda^2${tr === 0 ? "" : tr === 1 ? " - \\lambda" : tr === -1 ? " + \\lambda" : (tr > 0 ? " - " : " + ") + Math.abs(tr) + "\\lambda"}${gyS(dt)}`;
const l5F = l => l === 0 ? "\\lambda" : `(\\lambda ${l > 0 ? "-" : "+"} ${Math.abs(l)})`;
const l5Nf = x => fmt(Math.round(x * 1000) / 1000 + 0).replace(/[.,]/, "{,}");
/* P με det = 1 και ακέραια στοιχεία: P = [[1, 1], [m, m+1]] */
const l5P = () => { const m = ri(-2, 2); return bkPick([[[1, 1], [m, m + 1]], [[1, m], [1, m + 1]], [[m + 1, 1], [m, 1]]]); };
function l5Sl(cls, lab, min, max, step, val) { return `<label>${lab} <input type="range" class="${cls}" min="${min}" max="${max}" step="${step}" value="${val}"><b class="v${cls}"></b></label>`; }
function l5Tex(el) { if (window.renderMathInElement) renderMathInElement(el, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }], throwOnError: false }); }
function l5Arr(P, x1, y1, x2, y2, col, w = 3, lab) { gArrow(P, x1, y1, x2, y2, col, w); if (lab) gText(P, x2 + 0.25 * Math.sign(x2 - x1 || 1), y2 + 0.3 * (y2 >= y1 ? 1 : -1), lab, `fill:${col}`); }
function l5Line(P, dx, dy, col, dash = "6 5") { if (!dx && !dy) return; const L = Math.min(dx ? P.xmax / Math.abs(dx) : Infinity, dy ? P.ymax / Math.abs(dy) : Infinity); gLine(P, -L * dx, -L * dy, L * dx, L * dy, `stroke:${col};stroke-width:2;stroke-dasharray:${dash};opacity:.8`); }
function l5Eig2(a, b, c, d) { const tr = a + d, det = a * d - b * c, disc = tr * tr - 4 * det; return { tr, det, disc, re: disc >= 0, l: disc >= 0 ? [(tr - Math.sqrt(disc)) / 2, (tr + Math.sqrt(disc)) / 2] : [tr / 2, Math.sqrt(-disc) / 2] }; }
function l5EVec(a, b, c, d, l) { if (Math.abs(b) > 1e-9) return [b, l - a]; if (Math.abs(c) > 1e-9) return [l - d, c]; return Math.abs(a - l) < 1e-9 ? [1, 0] : [0, 1]; }

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 9.1–9.2 Ιδιοδιανύσματα: x και Ax ---------- */
  l5eigen(box) {
    const PRE = [[3, 1, 0, 2], [2, 1, 1, 2], [1, 2, 2, 1], [2, 1, 0, 2], [0, -1, 1, 0], [1.5, 0, 0, 0.5], [1, 1, -1, 1]];
    box.innerHTML = `<div class="wctl"><label>πίνακας <select class="pr"><option value="0">(3 1; 0 2)</option><option value="1">(2 1; 1 2)</option><option value="2">(1 2; 2 1)</option><option value="3">(2 1; 0 2) — ελλιπής</option><option value="4">(0 −1; 1 0) — στροφή</option><option value="5">(1,5 0; 0 0,5)</option><option value="6">(1 1; −1 1)</option><option value="c">δικός μου</option></select></label>
      ${l5Sl("ra", "a", -3, 3, 0.5, 3)}${l5Sl("rb", "b", -3, 3, 0.5, 1)}${l5Sl("rc", "c", -3, 3, 0.5, 0)}${l5Sl("rd", "d", -3, 3, 0.5, 2)}
      ${l5Sl("rt", "γωνία του x", 0, 359, 1, 30)}</div><div class="pl"></div><div class="wout"></div>`;
    const S = ["ra", "rb", "rc", "rd"];
    $(".pr", box).onchange = () => { const v = $(".pr", box).value; if (v !== "c") PRE[+v].forEach((x, i) => $("." + S[i], box).value = x); draw(); };
    function draw() {
      const [a, b, c, d] = S.map(s => +$("." + s, box).value), t = gRad(+$(".rt", box).value);
      S.concat("rt").forEach(s => $(".v" + s, box).textContent = fmt(+$("." + s, box).value));
      const P = makePlot($(".pl", box), { xmin: -6.8, xmax: 6.8, ymin: -4, ymax: 4, H: 330, xstep: 1, ystep: 1 });
      gCircle(P, 0, 0, 1, "stroke:var(--muted);stroke-width:1.5;fill:none;stroke-dasharray:4 4");
      let dpath = ""; for (let i = 0; i <= 120; i++) { const s = 2 * Math.PI * i / 120, X = a * Math.cos(s) + b * Math.sin(s), Y = c * Math.cos(s) + d * Math.sin(s); dpath += (i ? "L" : "M") + P.sx(X).toFixed(1) + "," + P.sy(Y).toFixed(1); }
      P.layer.appendChild(svgEl("path", { d: dpath, style: "fill:var(--red);fill-opacity:.06;stroke:var(--red);stroke-opacity:.35;stroke-width:1.5" }));
      const E = l5Eig2(a, b, c, d);
      if (E.re) E.l.forEach((l, i) => { const v = l5EVec(a, b, c, d, l); l5Line(P, v[0], v[1], i ? "var(--green)" : "var(--amber)"); });
      const x = [Math.cos(t), Math.sin(t)], Ax = [a * x[0] + b * x[1], c * x[0] + d * x[1]];
      l5Arr(P, 0, 0, x[0], x[1], "var(--blue)", 3.2, "x");
      l5Arr(P, 0, 0, Ax[0], Ax[1], "var(--red)", 3.2, "Ax");
      const cr = x[0] * Ax[1] - x[1] * Ax[0], par = Math.abs(cr) < 0.03 * Math.max(1, Math.hypot(...Ax));
      const ev = E.re ? (Math.abs(E.disc) < 1e-9 ? `$\\lambda = ${l5Nf(E.l[0])}$ (διπλή)` : `$\\lambda_1 = ${l5Nf(E.l[0])}$ (πορτοκαλί ευθεία), $\\lambda_2 = ${l5Nf(E.l[1])}$ (πράσινη)`) : `μιγαδικές: $\\lambda = ${l5Nf(E.l[0])} \\pm ${l5Nf(E.l[1])}i$ — καμία πραγματική ιδιο-ευθεία`;
      $(".wout", box).innerHTML = `$A = ${l5M([[l5Nf(a), l5Nf(b)], [l5Nf(c), l5Nf(d)]])}$, $\\ \\operatorname{tr}A = ${l5Nf(E.tr)}$, $\\det A = ${l5Nf(E.det)}$, $\\ p_A(\\lambda) = \\lambda^2 ${E.tr >= 0 ? "-" : "+"} ${l5Nf(Math.abs(E.tr))}\\lambda ${E.det >= 0 ? "+" : "-"} ${l5Nf(Math.abs(E.det))}$.<br>Ιδιοτιμές: ${ev}.<br>
        $\\mathbf x = (${l5Nf(x[0])}, ${l5Nf(x[1])})$, $A\\mathbf x = (${l5Nf(Ax[0])}, ${l5Nf(Ax[1])})$ ${par ? `<b style="color:var(--green)">— το x είναι ιδιοδιάνυσμα: $A\\mathbf x \\approx ${l5Nf(l5Dot(Ax, x))}\\,\\mathbf x$</b>` : ""}
        <br><span class="muted">Γύρισε το $\\mathbf x$ πάνω στον μοναδιαίο κύκλο: όταν το $A\\mathbf x$ (κόκκινο) πέσει πάνω στην ευθεία του $\\mathbf x$, βρήκες ιδιοδιάνυσμα. Η ροζ καμπύλη είναι η εικόνα του μοναδιαίου κύκλου.</span>`;
      l5Tex($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = () => { if (i.className !== "rt") $(".pr", box).value = "c"; draw(); }); draw();
  },

  /* ---------- 9.3 Διαγωνιοποίηση: δυνάμεις A^k x ---------- */
  l5power(box) {
    const PRE = [{ A: [[4, -2], [1, 1]], P: [[1, 2], [1, 1]], D: [2, 3] }, { A: [[5, -6], [3, -4]], P: [[2, 1], [1, 1]], D: [2, -1] }, { A: [[2, 1], [1, 2]], P: [[1, -1], [1, 1]], D: [3, 1] }, { A: [[1, 0], [6, -1]], P: [[1, 0], [3, 1]], D: [1, -1] }];
    box.innerHTML = `<div class="wctl"><label>πίνακας <select class="pr">${PRE.map((p, i) => `<option value="${i}">(${p.A[0].join(" ")}; ${p.A[1].join(" ")})</option>`).join("")}</select></label>
      ${l5Sl("rk", "k", 0, 8, 1, 3)}${l5Sl("rt", "γωνία του x₀", 0, 359, 1, 100)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const p = PRE[+$(".pr", box).value], k = +$(".rk", box).value, t = gRad(+$(".rt", box).value);
      $(".vrk", box).textContent = k; $(".vrt", box).textContent = $(".rt", box).value + "°";
      const P = makePlot($(".pl", box), { xmin: -3.4, xmax: 3.4, ymin: -2, ymax: 2, H: 330, xstep: 1, ystep: 1 });
      gCircle(P, 0, 0, 1, "stroke:var(--muted);stroke-width:1.5;fill:none;stroke-dasharray:4 4");
      [0, 1].forEach(j => l5Line(P, p.P[0][j], p.P[1][j], j ? "var(--green)" : "var(--amber)"));
      let x = [Math.cos(t), Math.sin(t)];
      for (let j = 0; j <= k; j++) {
        const n = Math.hypot(...x); const u = [x[0] / n, x[1] / n];
        gArrow(P, 0, 0, u[0], u[1], j === k ? "var(--red)" : "var(--blue)", j === k ? 3.4 : 1.6);
        if (j === 0) gText(P, u[0] * 1.25, u[1] * 1.25, "x₀", "fill:var(--blue)");
        x = [p.A[0][0] * x[0] + p.A[0][1] * x[1], p.A[1][0] * x[0] + p.A[1][1] * x[1]];
      }
      const Dk = p.D.map(l => l ** k), Pi = l5Fix(l5Inv1(p.P)), Ak = l5Fix(l5Mul(l5Mul(p.P, [[Dk[0], 0], [0, Dk[1]]]), Pi));
      const dom = Math.abs(p.D[0]) === Math.abs(p.D[1]) ? "" : `Η κατεύθυνση του $A^k\\mathbf x_0$ (κόκκινο, κανονικοποιημένο) τείνει στην ιδιο-ευθεία της ιδιοτιμής με τη μεγαλύτερη απόλυτη τιμή, $\\lambda = ${Math.abs(p.D[0]) > Math.abs(p.D[1]) ? p.D[0] : p.D[1]}$.`;
      $(".wout", box).innerHTML = `$A = PDP^{-1}$ με $P = ${l5M(p.P)}$, $D = ${l5M([[p.D[0], 0], [0, p.D[1]]])}$, $P^{-1} = ${l5M(Pi)}$.<br>
        $A^{${k}} = PD^{${k}}P^{-1} = ${l5M(p.P)}${l5M([[Dk[0], 0], [0, Dk[1]]])}${l5M(Pi)} = ${l5M(Ak)}$<br><span class="muted">${dom} Οι διακεκομμένες ευθείες είναι οι ιδιόχωροι (στήλες του $P$).</span>`;
      l5Tex($(".wout", box));
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 9.4 Στροφή – κλίμακα ---------- */
  l5rot(box) {
    box.innerHTML = `<div class="wctl">${l5Sl("ra", "a", -1.5, 1.5, 0.05, 0.8)}${l5Sl("rb", "b", -1.5, 1.5, 0.05, 0.5)}${l5Sl("rn", "βήματα", 1, 24, 1, 10)}</div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, b = +$(".rb", box).value, n = +$(".rn", box).value;
      ["ra", "rb", "rn"].forEach(s => $(".v" + s, box).textContent = fmt(+$("." + s, box).value));
      const P = makePlot($(".pl", box), { xmin: -3.4, xmax: 3.4, ymin: -2, ymax: 2, H: 330, xstep: 1, ystep: 1 });
      gCircle(P, 0, 0, 1, "stroke:var(--muted);stroke-width:1.5;fill:none;stroke-dasharray:4 4");
      let x = [1, 0], d = `M${P.sx(1)},${P.sy(0)}`;
      for (let j = 1; j <= n; j++) { x = [a * x[0] - b * x[1], b * x[0] + a * x[1]]; if (Math.hypot(...x) > 30) break; d += `L${P.sx(x[0]).toFixed(1)},${P.sy(x[1]).toFixed(1)}`; P.dot(x[0], x[1], "d1"); }
      P.layer.appendChild(svgEl("path", { d, style: "fill:none;stroke:var(--blue);stroke-width:2;stroke-opacity:.6" }));
      P.dot(1, 0, "d3", "x₀");
      const r = Math.hypot(a, b), ph = Math.atan2(b, a) * 180 / Math.PI;
      if (r > 1e-9) gArc(P, 0, 0, 0, ph, 0.45, "var(--amber)", "φ", 0.75);
      $(".wout", box).innerHTML = `$C = ${l5M([[l5Nf(a), l5Nf(-b)], [l5Nf(b), l5Nf(a)]])}$, ιδιοτιμές $\\lambda = ${l5Nf(a)} \\pm ${l5Nf(Math.abs(b))}i$.<br>
        $r = |\\lambda| = \\sqrt{a^2 + b^2} = ${l5Nf(r)}$, $\\ \\varphi = ${l5Nf(ph)}^\\circ$: κάθε εφαρμογή του $C$ στρέφει κατά $\\varphi$ και πολλαπλασιάζει το μήκος επί $r$.<br>
        <span class="muted">${r < 0.995 ? "r &lt; 1: τα σημεία $C^k\\mathbf x_0$ κινούνται σπειροειδώς προς την αρχή." : r > 1.005 ? "r &gt; 1: τα σημεία απομακρύνονται σπειροειδώς." : "r = 1: καθαρή στροφή — τα σημεία μένουν πάνω στον κύκλο."}</span>`;
      l5Tex($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 10.1 Εσωτερικό γινόμενο με βάρη ---------- */
  l5ipw(box) {
    box.innerHTML = `<div class="wctl">${l5Sl("w1", "βάρος w₁", 0.5, 4, 0.5, 2)}${l5Sl("w2", "βάρος w₂", 0.5, 4, 0.5, 3)}
      ${l5Sl("u1", "u₁", -3, 3, 0.5, 1)}${l5Sl("u2", "u₂", -3, 3, 0.5, 1)}${l5Sl("v1", "v₁", -3, 3, 0.5, 3)}${l5Sl("v2", "v₂", -3, 3, 0.5, -2)}</div><div class="pl"></div><div class="wout"></div>`;
    const S = ["w1", "w2", "u1", "u2", "v1", "v2"];
    function draw() {
      const [w1, w2, u1, u2, v1, v2] = S.map(s => +$("." + s, box).value); S.forEach(s => $(".v" + s, box).textContent = fmt(+$("." + s, box).value));
      const P = makePlot($(".pl", box), { xmin: -5.8, xmax: 5.8, ymin: -3.4, ymax: 3.4, H: 330, xstep: 1, ystep: 1 });
      P.layer.appendChild(svgEl("ellipse", { cx: P.sx(0), cy: P.sy(0), rx: P.sx(1 / Math.sqrt(w1)) - P.sx(0), ry: P.sy(0) - P.sy(1 / Math.sqrt(w2)), style: "fill:var(--green);fill-opacity:.1;stroke:var(--green);stroke-width:2" }));
      l5Arr(P, 0, 0, u1, u2, "var(--blue)", 3.2, "u"); l5Arr(P, 0, 0, v1, v2, "var(--red)", 3.2, "v");
      const ip = w1 * u1 * v1 + w2 * u2 * v2, nu = Math.sqrt(w1 * u1 * u1 + w2 * u2 * u2), nv = Math.sqrt(w1 * v1 * v1 + w2 * v2 * v2), eu = u1 * v1 + u2 * v2;
      const cs = nu * nv > 0 ? ip / (nu * nv) : NaN;
      $(".wout", box).innerHTML = `$\\langle\\mathbf u, \\mathbf v\\rangle = w_1u_1v_1 + w_2u_2v_2 = ${l5Nf(ip)}$${Math.abs(ip) < 1e-9 ? ` — <b style="color:var(--green)">ορθογώνια ως προς αυτό το εσωτερικό γινόμενο</b>` : ""} · Ευκλείδειο: $\\mathbf u\\cdot\\mathbf v = ${l5Nf(eu)}$.<br>
        $\\|\\mathbf u\\| = ${l5Nf(nu)}$, $\\|\\mathbf v\\| = ${l5Nf(nv)}$${isFinite(cs) ? `, $\\cos\\theta = ${l5Nf(cs)}$, $\\theta \\approx ${l5Nf(Math.acos(Math.max(-1, Math.min(1, cs))) * 180 / Math.PI)}^\\circ$` : ""} · Cauchy–Schwarz: $${l5Nf(Math.abs(ip))} \\le ${l5Nf(nu * nv)}$.<br>
        <span class="muted">Η πράσινη έλλειψη είναι ο «μοναδιαίος κύκλος» $\\{\\mathbf x : \\langle\\mathbf x, \\mathbf x\\rangle = 1\\}$ αυτού του εσωτερικού γινομένου· για $w_1 = w_2 = 1$ γίνεται ο συνηθισμένος κύκλος.</span>`;
      l5Tex($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 10.2 Ορθογώνια προβολή ---------- */
  l5projw(box) {
    box.innerHTML = `<div class="wctl">${l5Sl("y1", "y₁", -4, 4, 0.5, 3)}${l5Sl("y2", "y₂", -4, 4, 0.5, 3)}${l5Sl("u1", "u₁", -3, 3, 0.5, 2)}${l5Sl("u2", "u₂", -3, 3, 0.5, 1)}</div><div class="pl"></div><div class="wout"></div>`;
    const S = ["y1", "y2", "u1", "u2"];
    function draw() {
      const [y1, y2, u1, u2] = S.map(s => +$("." + s, box).value); S.forEach(s => $(".v" + s, box).textContent = fmt(+$("." + s, box).value));
      const P = makePlot($(".pl", box), { xmin: -6.8, xmax: 6.8, ymin: -4, ymax: 4, H: 330, xstep: 1, ystep: 1 });
      const uu = u1 * u1 + u2 * u2;
      if (uu === 0) { $(".wout", box).innerHTML = "Το $\\mathbf u$ πρέπει να είναι μη μηδενικό."; l5Tex($(".wout", box)); return; }
      l5Line(P, u1, u2, "var(--muted)", "2 0");
      const c = (y1 * u1 + y2 * u2) / uu, h = [c * u1, c * u2], z = [y1 - h[0], y2 - h[1]];
      l5Arr(P, 0, 0, u1, u2, "var(--green)", 3, "u"); l5Arr(P, 0, 0, y1, y2, "var(--blue)", 3, "y"); l5Arr(P, 0, 0, h[0], h[1], "var(--red)", 3.4, "ŷ");
      gLine(P, h[0], h[1], y1, y2, "stroke:var(--amber);stroke-width:2.4;stroke-dasharray:6 4");
      if (Math.hypot(...z) > 0.3 && Math.hypot(...h) > 0.3) { const s = 0.28, e = [u1 / Math.sqrt(uu), u2 / Math.sqrt(uu)], f = [z[0] / Math.hypot(...z), z[1] / Math.hypot(...z)], sg = c >= 0 ? -1 : 1;
        P.top.appendChild(svgEl("path", { d: `M${P.sx(h[0] + sg * s * e[0])},${P.sy(h[1] + sg * s * e[1])}L${P.sx(h[0] + sg * s * e[0] + s * f[0])},${P.sy(h[1] + sg * s * e[1] + s * f[1])}L${P.sx(h[0] + s * f[0])},${P.sy(h[1] + s * f[1])}`, style: "fill:none;stroke:var(--amber);stroke-width:1.8" })); }
      $(".wout", box).innerHTML = `$\\hat{\\mathbf y} = \\dfrac{\\mathbf y\\cdot\\mathbf u}{\\mathbf u\\cdot\\mathbf u}\\mathbf u = \\dfrac{${l5Nf(y1 * u1 + y2 * u2)}}{${l5Nf(uu)}}\\mathbf u = (${l5Nf(h[0])}, ${l5Nf(h[1])})$,
        $\\ \\mathbf z = \\mathbf y - \\hat{\\mathbf y} = (${l5Nf(z[0])}, ${l5Nf(z[1])})$, $\\ \\mathbf z\\cdot\\mathbf u = ${l5Nf(z[0] * u1 + z[1] * u2)}$.<br>
        Απόσταση του $\\mathbf y$ από την ευθεία: $\\|\\mathbf z\\| = ${l5Nf(Math.hypot(...z))}$ <span class="muted">(πορτοκαλί τμήμα — η μικρότερη δυνατή απόσταση από σημείο της ευθείας).</span>`;
      l5Tex($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 10.3 Gram–Schmidt στο R² ---------- */
  l5gsw(box) {
    box.innerHTML = `<div class="wctl">${l5Sl("a1", "x₁ (1η)", -3, 3, 0.5, 2)}${l5Sl("a2", "x₁ (2η)", -3, 3, 0.5, 1)}${l5Sl("b1", "x₂ (1η)", -3, 3, 0.5, 1)}${l5Sl("b2", "x₂ (2η)", -3, 3, 0.5, 2.5)}
      <label><input type="checkbox" class="ck" checked> ορθοκανονικά e₁, e₂</label></div><div class="pl"></div><div class="wout"></div>`;
    const S = ["a1", "a2", "b1", "b2"];
    function draw() {
      const [a1, a2, b1, b2] = S.map(s => +$("." + s, box).value); S.forEach(s => $(".v" + s, box).textContent = fmt(+$("." + s, box).value));
      const P = makePlot($(".pl", box), { xmin: -6.8, xmax: 6.8, ymin: -4, ymax: 4, H: 330, xstep: 1, ystep: 1 });
      const n1 = a1 * a1 + a2 * a2;
      if (n1 === 0) { $(".wout", box).innerHTML = "Το $\\mathbf x_1$ πρέπει να είναι μη μηδενικό."; l5Tex($(".wout", box)); return; }
      const c = (a1 * b1 + a2 * b2) / n1, pr = [c * a1, c * a2], v2 = [b1 - pr[0], b2 - pr[1]], nv2 = Math.hypot(...v2);
      l5Line(P, a1, a2, "var(--muted)", "2 0");
      l5Arr(P, 0, 0, a1, a2, "var(--blue)", 3.2, "v₁ = x₁"); l5Arr(P, 0, 0, b1, b2, "var(--muted)", 2.4, "x₂");
      gLine(P, pr[0], pr[1], b1, b2, "stroke:var(--amber);stroke-width:2;stroke-dasharray:6 4"); P.dot(pr[0], pr[1], "d2");
      if (nv2 > 1e-9) l5Arr(P, 0, 0, v2[0], v2[1], "var(--red)", 3.2, "v₂");
      if ($(".ck", box).checked) { gCircle(P, 0, 0, 1, "stroke:var(--green);stroke-width:1.5;fill:none;stroke-dasharray:4 4");
        const r1 = Math.sqrt(n1); gArrow(P, 0, 0, a1 / r1, a2 / r1, "var(--green)", 2.6); if (nv2 > 1e-9) gArrow(P, 0, 0, v2[0] / nv2, v2[1] / nv2, "var(--green)", 2.6); }
      $(".wout", box).innerHTML = nv2 < 1e-9 ? `Τα $\\mathbf x_1, \\mathbf x_2$ είναι γραμμικώς εξαρτημένα: $\\mathbf v_2 = \\mathbf 0$ και η διαδικασία σταματά.` :
        `$\\mathbf v_2 = \\mathbf x_2 - \\dfrac{\\mathbf x_2\\cdot\\mathbf v_1}{\\mathbf v_1\\cdot\\mathbf v_1}\\mathbf v_1 = (${l5Nf(b1)}, ${l5Nf(b2)}) ${c < 0 ? "+" : "-"} ${l5Nf(Math.abs(c))}\\,(${l5Nf(a1)}, ${l5Nf(a2)}) = (${l5Nf(v2[0])}, ${l5Nf(v2[1])})$, $\\ \\mathbf v_1\\cdot\\mathbf v_2 = ${l5Nf(a1 * v2[0] + a2 * v2[1])}$.<br>
        Ορθοκανονική βάση: $\\mathbf e_1 = \\mathbf v_1/${l5Nf(Math.sqrt(n1))}$, $\\mathbf e_2 = \\mathbf v_2/${l5Nf(nv2)}$ <span class="muted">(πράσινα, πάνω στον μοναδιαίο κύκλο). Το πορτοκαλί τμήμα είναι η αφαίρεση της προβολής του $\\mathbf x_2$ στο $\\mathbf v_1$.</span>`;
      l5Tex($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = i.onchange = draw); draw();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  l5eig: { title: "Γεννήτρια — ιδιοτιμές και ιδιοδιανύσματα", make() {
    const t = ri(0, 3);
    if (t === 2) { const d = [gyNZ(-5, 6), ri(-5, 6), gyNZ(-5, 6)], s = [...d].sort((x, y) => x - y), up = ri(0, 1);
      const M = up ? [[d[0], gyNZ(-4, 4), ri(-4, 4)], [0, d[1], gyNZ(-4, 4)], [0, 0, d[2]]] : [[d[0], 0, 0], [gyNZ(-4, 4), d[1], 0], [ri(-4, 4), gyNZ(-4, 4), d[2]]];
      return { q: R`Να βρείτε τις ιδιοτιμές του $A = ${l5M(M)}$ σε αύξουσα σειρά (με επανάληψη, αν υπάρχει).`,
        fields: s.map((v, i) => ({ label: `λ${"₁₂₃"[i]} =`, ans: v })), sol: R`Ο $A$ είναι ${up ? "άνω" : "κάτω"} τριγωνικός, άρα οι ιδιοτιμές είναι τα διαγώνια στοιχεία: $${s.join(", ")}$.` }; }
    let l1, l2; do { l1 = ri(-3, 4); l2 = ri(-3, 4); } while (l1 === l2);
    const P = [[1, 1], [0, 1]]; const m = ri(-2, 2); P[1] = [m, m + 1];
    const A = l5Fix(l5Mul(l5Mul(P, [[l1, 0], [0, l2]]), l5Inv1(P))), v = [1, m];
    if (t === 0) return { q: R`Να δείξετε ότι το $\mathbf v = ${l5V(v)}^T$ είναι ιδιοδιάνυσμα του $A = ${l5M(A)}$ και να βρείτε την ιδιοτιμή του.`, fields: [{ label: "λ =", ans: l1 }],
      sol: R`$A\mathbf v = ${l5V([A[0][0] + A[0][1] * m, A[1][0] + A[1][1] * m])}^T = ${l1}\cdot ${l5V(v)}^T$, άρα $\lambda = ${l1}$.` };
    if (t === 1) return { q: R`Το $\lambda = ${l2}$ είναι ιδιοτιμή του $A = ${l5M(A)}$. Να βρείτε ιδιοδιάνυσμα της μορφής $(1, b)^T$.`, fields: [{ label: "b =", ans: m + 1 }],
      sol: R`$${l2 === 0 ? "A" : l2 === 1 ? "A - I" : l2 === -1 ? "A + I" : l2 < 0 ? `A + ${-l2}I` : `A - ${l2}I`} = ${l5M([[A[0][0] - l2, A[0][1]], [A[1][0], A[1][1] - l2]])}$. Με $x_1 = 1$ από την ${A[0][1] !== 0 ? "1η" : "2η"} γραμμή: $x_2 = ${m + 1}$. Έλεγχος: $A${l5V([1, m + 1])}^T = ${l5V([l2, l2 * (m + 1)])}^T$.` };
    const k = bkPick([l1, l2, l1 + l2, l1 - 1 === l2 ? l1 + 1 : l1 - 1]), yes = k === l1 || k === l2, dt = (A[0][0] - k) * (A[1][1] - k) - A[0][1] * A[1][0];
    return bkMC({ q: R`Είναι το $\lambda = ${k}$ ιδιοτιμή του $A = ${l5M(A)}$;`,
      sol: R`$\det(${k === 0 ? "A" : k === 1 ? "A - I" : k === -1 ? "A + I" : k < 0 ? `A + ${-k}I` : `A - ${k}I`}) = ${dt}$. ${yes ? "Μηδέν, άρα ο $A - \\lambda I$ δεν αντιστρέφεται: <b>ναι</b>." : "Μη μηδενική, άρα το ομογενές σύστημα έχει μόνο τη μηδενική λύση: <b>όχι</b>."} (Ιδιοτιμές: $${Math.min(l1, l2)}, ${Math.max(l1, l2)}$.)` },
      ["Ναι, γιατί $\\det(A - \\lambda I) = 0$", "Όχι, γιατί $\\det(A - \\lambda I) \\ne 0$"], yes ? 0 : 1);
  } },
  l5char: { title: "Γεννήτρια — χαρακτηριστικό πολυώνυμο", make() {
    const t = ri(0, 2);
    if (t === 0) { const A = [[ri(-5, 6), ri(-5, 5)], [ri(-5, 5), ri(-5, 6)]], tr = A[0][0] + A[1][1], dt = A[0][0] * A[1][1] - A[0][1] * A[1][0];
      return { q: R`Το χαρακτηριστικό πολυώνυμο του $A = ${l5M(A)}$ είναι $\lambda^2 + p\lambda + q$. Να βρείτε τα $p$, $q$.`, fields: [{ label: "p =", ans: -tr }, { label: "q =", ans: dt }],
        sol: R`$p = -\operatorname{tr}A = ${-tr}$, $q = \det A = ${A[0][0]}\cdot ${gyPar(A[1][1])} - ${gyPar(A[0][1])}\cdot ${gyPar(A[1][0])} = ${dt}$.` }; }
    let l1, l2; do { l1 = ri(-4, 6); l2 = ri(-4, 6); } while (l1 >= l2);
    if (t === 1) return { q: R`Ένας $2\times 2$ πίνακας έχει ίχνος $${l1 + l2}$ και ορίζουσα $${l1 * l2}$. Να βρείτε τις ιδιοτιμές του.`,
      fields: [{ label: "λ₁ (μικρότερη) =", ans: l1 }, { label: "λ₂ =", ans: l2 }], sol: R`$${l5Q(l1 + l2, l1 * l2)} = 0$: ρίζες με άθροισμα $${l1 + l2}$ και γινόμενο $${l1 * l2}$, δηλαδή $${l1}$ και $${l2}$.` };
    const P = l5P(), A = l5Fix(l5Mul(l5Mul(P, [[l1, 0], [0, l2]]), l5Inv1(P))), tr = l1 + l2, dt = l1 * l2;
    return { q: R`Να βρείτε τις ιδιοτιμές του $A = ${l5M(A)}$.`, fields: [{ label: "λ₁ (μικρότερη) =", ans: l1 }, { label: "λ₂ =", ans: l2 }],
      sol: R`$p_A(\lambda) = ${l5Q(tr, dt)} = ${l5F(l1)}${l5F(l2)}$: $\lambda = ${l1}, ${l2}$.` };
  } },
  l5diag: { title: "Γεννήτρια — διαγωνιοποίηση και δυνάμεις", make() {
    const t = ri(0, 2);
    if (t < 2) { let l1, l2; do { l1 = bkPick([-2, -1, 1, 2, 3]); l2 = bkPick([-2, -1, 1, 2, 3]); } while (Math.abs(l1) === Math.abs(l2));
      const P = l5P(), Pi = l5Fix(l5Inv1(P)), k = ri(2, 4), Dk = [[l1 ** k, 0], [0, l2 ** k]], Ak = l5Fix(l5Mul(l5Mul(P, Dk), Pi)), A = l5Fix(l5Mul(l5Mul(P, [[l1, 0], [0, l2]]), Pi));
      return { q: R`Ο $A = ${l5M(A)}$ γράφεται $A = PDP^{-1}$ με $P = ${l5M(P)}$ και $D = ${l5M([[l1, 0], [0, l2]])}$. Να υπολογίσετε τον $A^{${k}} = ${l5M([["a", "b"], ["c", "d"]])}$.`,
        fields: ["a", "b", "c", "d"].map((s, i) => ({ label: s + " =", ans: Ak[i >> 1][i & 1] })),
        sol: R`$P^{-1} = ${l5M(Pi)}$, $D^{${k}} = ${l5M(Dk)}$, $A^{${k}} = PD^{${k}}P^{-1} = ${l5M(l5Fix(l5Mul(P, Dk)))}${l5M(Pi)} = ${l5M(Ak)}$.` }; }
    const c = ri(0, 3), a = gyNZ(-3, 4); let M, yes, why;
    if (c === 0) { M = [[a, gyNZ(-3, 3)], [0, a]]; yes = false; why = R`Μόνη ιδιοτιμή $${a}$ με $\pi = 2$, αλλά $${a === 0 ? "A" : a === 1 ? "A - I" : a === -1 ? "A + I" : a < 0 ? `A + ${-a}I` : `A - ${a}I`}$ έχει βαθμό $1$, άρα $\gamma = 1 < 2$.`; }
    else if (c === 1) { let b; do b = gyNZ(-3, 4); while (b === a); M = [[a, ri(-3, 3)], [0, b]]; yes = true; why = R`Δύο διαφορετικές ιδιοτιμές ($${a}$ και $${b}$, τα διαγώνια στοιχεία) ⇒ διαγωνιοποιήσιμος.`; }
    else if (c === 2) { M = [[a, 0], [0, a]]; yes = true; why = R`Είναι ήδη διαγώνιος ($= ${a === 1 ? "" : a === -1 ? "-" : a}I$).`; }
    else { M = [[a, 0], [gyNZ(-3, 3), a]]; yes = false; why = R`Μόνη ιδιοτιμή $${a}$ (διπλή), $\gamma = 2 - \operatorname{rank}(${a === 0 ? "A" : a === 1 ? "A - I" : a === -1 ? "A + I" : a < 0 ? `A + ${-a}I` : `A - ${a}I`}) = 1 < 2$.`; }
    return bkMC({ q: R`Είναι ο $A = ${l5M(M)}$ διαγωνιοποιήσιμος;`, sol: why }, ["Ναι", "Όχι"], yes ? 0 : 1);
  } },
  l5cplx: { title: "Γεννήτρια — μιγαδικές ιδιοτιμές, στροφή – κλίμακα", make() {
    const t = ri(0, 1);
    if (t === 0) { const a = ri(-2, 3), b = ri(1, 3), P = l5P(), A = l5Fix(l5Mul(l5Mul(P, [[a, -b], [b, a]]), l5Inv1(P))), tr = 2 * a, dt = a * a + b * b;
      return { q: R`Να βρείτε τις ιδιοτιμές $\lambda = \alpha \pm \beta i$ ($\beta > 0$) του $A = ${l5M(A)}$.`, fields: [{ label: "α =", ans: a }, { label: "β =", ans: b }],
        sol: R`$\operatorname{tr}A = ${tr}$, $\det A = ${dt}$: $${l5Q(tr, dt)} = 0 \Rightarrow \lambda = \frac{${tr} \pm \sqrt{${4 * dt - tr * tr}}\,i}{2} = ${a} \pm ${b === 1 ? "" : b}i$.` }; }
    const [p, q, ph] = bkPick([[1, 1, 45], [0, 1, 90], [-1, 1, 135], [1, -1, -45], [0, -1, -90], [-1, -1, -135]]), k = ri(1, 3), a = k * p, b = k * q;
    return { q: R`Ο $C = ${l5M([[a, -b], [b, a]])}$ είναι πίνακας στροφής – κλίμακας. Να βρείτε το $r^2$ και τη γωνία $\varphi$ σε μοίρες ($-180^\circ < \varphi \le 180^\circ$).`,
      fields: [{ label: "r² =", ans: a * a + b * b }, { label: "φ (μοίρες) =", ans: ph }],
      sol: R`Μορφή $\begin{pmatrix} a & -b\\ b & a\end{pmatrix}$ με $a = ${a}$, $b = ${b}$: $r^2 = ${a * a + b * b}$, $\cos\varphi = \frac{${a}}{r}$, $\sin\varphi = \frac{${b}}{r}$ $\Rightarrow \varphi = ${ph}^\circ$.` };
  } },
  l5ip: { title: "Γεννήτρια — εσωτερικά γινόμενα", make() {
    const t = ri(0, 2);
    if (t === 0) { const u = [0, 0, 0].map(() => ri(-4, 4)), v = [0, 0, 0].map(() => ri(-4, 4)); if (!u.some(x => x) || !v.some(x => x)) return GENS.l5ip.make();
      return { q: R`Στο $\mathbb R^3$ (Ευκλείδειο εσωτερικό γινόμενο), για $\mathbf u = ${l5V(u)}$, $\mathbf v = ${l5V(v)}$ να βρείτε τα $\langle\mathbf u, \mathbf v\rangle$ και $\|\mathbf u - \mathbf v\|^2$.`,
        fields: [{ label: "⟨u, v⟩ =", ans: l5Dot(u, v) }, { label: "‖u − v‖² =", ans: l5Dot(u.map((x, i) => x - v[i]), u.map((x, i) => x - v[i])) }],
        sol: R`$\langle\mathbf u, \mathbf v\rangle = ${u.map((x, i) => `${gyPar(x)}\\cdot ${gyPar(v[i])}`).join(" + ")} = ${l5Dot(u, v)}$. $\mathbf u - \mathbf v = ${l5V(u.map((x, i) => x - v[i]))}$, $\|\mathbf u - \mathbf v\|^2 = ${l5Dot(u.map((x, i) => x - v[i]), u.map((x, i) => x - v[i]))}$.` }; }
    if (t === 1) { const w = ri(0, 1) ? [ri(1, 4), ri(2, 4)] : [ri(2, 4), ri(1, 4)], u = [gyNZ(-3, 3), gyNZ(-3, 3)], v = [ri(-3, 3), ri(-3, 3)], ip = w[0] * u[0] * v[0] + w[1] * u[1] * v[1];
      return { q: R`Στο $\mathbb R^2$ με $\langle\mathbf u, \mathbf v\rangle = ${w[0] === 1 ? "" : w[0]}u_1v_1 + ${w[1] === 1 ? "" : w[1]}u_2v_2$, για $\mathbf u = ${l5V(u)}$, $\mathbf v = ${l5V(v)}$ να βρείτε τα $\langle\mathbf u, \mathbf v\rangle$ και $\|\mathbf u\|^2$.`,
        fields: [{ label: "⟨u, v⟩ =", ans: ip }, { label: "‖u‖² =", ans: w[0] * u[0] ** 2 + w[1] * u[1] ** 2 }],
        sol: R`$\langle\mathbf u, \mathbf v\rangle = ${w[0]}\cdot ${gyPar(u[0])}\cdot ${gyPar(v[0])} + ${w[1]}\cdot ${gyPar(u[1])}\cdot ${gyPar(v[1])} = ${ip}$, $\|\mathbf u\|^2 = ${w[0]}\cdot ${u[0] ** 2} + ${w[1]}\cdot ${u[1] ** 2} = ${w[0] * u[0] ** 2 + w[1] * u[1] ** 2}$.` }; }
    const m = ri(0, 3), n = ri(1, 4), xp = e => e === 0 ? "1" : e === 1 ? "x" : `x^{${e}}`;
    return { q: R`Στο $C[0,1]$ με $\langle f, g\rangle = \int_0^1 f(x)g(x)\,dx$ να βρείτε τα $\langle ${xp(m)}, ${xp(n)}\rangle$ και $\|${xp(n)}\|^2$.`,
      fields: [{ label: "⟨f, g⟩ =", ans: gyF(1, m + n + 1) }, { label: "‖g‖² =", ans: gyF(1, 2 * n + 1) }],
      sol: R`$\int_0^1 x^{${m + n}}\,dx = ${texFrac(1, m + n + 1)}$ και $\int_0^1 x^{${2 * n}}\,dx = ${texFrac(1, 2 * n + 1)}$.` };
  } },
  l5proj: { title: "Γεννήτρια — ορθογώνια προβολή", make() {
    const t = ri(0, 1);
    if (t === 0) { const u = [gyNZ(-4, 4), gyNZ(-4, 4)], ur = l5Red(u), c = gyNZ(-2, 2), s = gyNZ(-2, 2), z = [-s * ur[1], s * ur[0]], y = [c * u[0] + z[0], c * u[1] + z[1]];
      return { q: R`Να βρείτε την ορθογώνια προβολή $\hat{\mathbf y}$ του $\mathbf y = ${l5V(y)}$ στην ευθεία που παράγεται από το $\mathbf u = ${l5V(u)}$ και το τετράγωνο της απόστασης του $\mathbf y$ από την ευθεία.`,
        fields: [{ label: "ŷ₁ =", ans: c * u[0] }, { label: "ŷ₂ =", ans: c * u[1] }, { label: "d² =", ans: l5Dot(z, z) }],
        sol: R`$\frac{\mathbf y\cdot\mathbf u}{\mathbf u\cdot\mathbf u} = \frac{${l5Dot(y, u)}}{${l5Dot(u, u)}} = ${c}$, $\hat{\mathbf y} = ${l5V([c * u[0], c * u[1]])}$. $\mathbf y - \hat{\mathbf y} = ${l5V(z)}$, $d^2 = ${l5Dot(z, z)}$.` }; }
    const u = [0, 0, 0].map(() => ri(-3, 3)); if (l5Dot(u, u) === 0) return GENS.l5proj.make();
    let w; do w = [0, 0, 0].map(() => ri(-2, 2)); while (!l5Cross(u, w).some(x => x));
    const z = l5Red(l5Cross(u, w)), c = gyNZ(-2, 2), y = u.map((x, i) => c * x + z[i]);
    return { q: R`Να βρείτε την προβολή του $\mathbf y = ${l5V(y)}$ στην ευθεία $\operatorname{Span}\{\mathbf u\}$, $\mathbf u = ${l5V(u)}$, καθώς και το $d^2$ (τετράγωνο απόστασης).`,
      fields: [{ label: "ŷ₁ =", ans: c * u[0] }, { label: "ŷ₂ =", ans: c * u[1] }, { label: "ŷ₃ =", ans: c * u[2] }, { label: "d² =", ans: l5Dot(z, z) }],
      sol: R`$\frac{\mathbf y\cdot\mathbf u}{\mathbf u\cdot\mathbf u} = \frac{${l5Dot(y, u)}}{${l5Dot(u, u)}} = ${c}$, $\hat{\mathbf y} = ${l5V(u.map(x => c * x))}$, $\mathbf y - \hat{\mathbf y} = ${l5V(z)}$ (κάθετο στο $\mathbf u$), $d^2 = ${l5Dot(z, z)}$.` };
  } },
  l5gs: { title: "Γεννήτρια — Gram–Schmidt", make() {
    const x1 = [0, 0, 0].map(() => ri(-3, 3)); if (x1.filter(v => v).length < 2) return GENS.l5gs.make();
    let w; do w = [0, 0, 0].map(() => ri(-2, 2)); while (!l5Cross(x1, w).some(v => v));
    const v2 = l5Red(l5Cross(x1, w)), c = gyNZ(-2, 2), x2 = v2.map((v, i) => v + c * x1[i]);
    return { q: R`Να εφαρμόσετε τη μέθοδο Gram–Schmidt στα $\mathbf x_1 = ${l5V(x1)}$, $\mathbf x_2 = ${l5V(x2)}$ ($\mathbf v_1 = \mathbf x_1$). Να βρείτε το $\mathbf v_2$.`,
      fields: v2.map((v, i) => ({ label: `v₂ (${i + 1}η) =`, ans: v })),
      sol: R`$\frac{\mathbf x_2\cdot\mathbf v_1}{\mathbf v_1\cdot\mathbf v_1} = \frac{${l5Dot(x2, x1)}}{${l5Dot(x1, x1)}} = ${c}$, άρα $\mathbf v_2 = \mathbf x_2 ${c > 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}\mathbf v_1 = ${l5V(v2)}$. Έλεγχος: $\mathbf v_1\cdot\mathbf v_2 = ${l5Dot(x1, v2)}$.` };
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

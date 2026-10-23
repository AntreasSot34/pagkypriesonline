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
  storeKey: "pagk-μας055-v1",
  heroTitle: "Πιθανότητες και Στατιστική (ΜΑΣ055)",
  tefxos: "μαθήματος ΜΑΣ055",
  howto: `<ul><li>Αριθμοί: <code>12</code> · κλάσματα: <code>3/4</code> ή <code>-5/6</code> · δεκαδικοί: <code>2,5</code></li>
    <li>Πολλά πεδία; Γράψε κάθε απάντηση στο δικό της πεδίο, με τη σειρά που ζητείται.</li>
    <li>Ακολουθεί τη δομή των σημειώσεων του ΜΑΣ055 (Πανεπιστήμιο Κύπρου)· σε κάθε ενότητα υπάρχουν και οι αντίστοιχες εντολές της <b>R</b>.</li></ul>`
};

const UNITS = [
  { id: 1, title: "Κεφ. 1 · Συνδυαστική" },
  { id: 2, title: "Κεφ. 2 · Πιθανότητες" },
  { id: 3, title: "Κεφ. 3 · Τυχαίες μεταβλητές" },
  { id: 4, title: "Κεφ. 4 · Κλασικά προβλήματα πιθανοτήτων" },
  { id: 5, title: "Κεφ. 5 · Ανισότητες – Οριακά θεωρήματα" },
  { id: 6, title: "Κεφ. 6 · Στοχαστικές ανελίξεις" },
  { id: 7, title: "Κεφ. 7 · Στατιστική – Σημειοεκτιμητική" },
  { id: 8, title: "Κεφ. 8 · Διαστήματα εμπιστοσύνης" },
  { id: 9, title: "Κεφ. 9 · Έλεγχοι υποθέσεων" },
  { id: 10, title: "Κεφ. 10 · Συσχέτιση – Γραμμική παλινδρόμηση" }
];

const SECTIONS = [
/* ───────────────────────────── 1.1 ───────────────────────────── */
{
  id: "1.1", unit: 1, title: "Βασική αρχή μέτρησης – Διατάξεις – Συνδυασμοί",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Συνδυαστική · Φυλλάδιο ασκήσεων 1",
  theory: R`
<div class="tbox"><h4>Βασική αρχή μέτρησης</h4>
<p>Αν το πείραμα $P_1$ έχει $n_1$ δυνατά αποτελέσματα και, για κάθε αποτέλεσμά του, το πείραμα $P_2$ έχει $n_2$, τότε το σύνθετο πείραμα έχει $n_1 n_2$ αποτελέσματα. <b>Γενικευμένη αρχή</b>: για $r$ διαδοχικά πειράματα με $n_1, n_2, \dots, n_r$ αποτελέσματα, το σύνολο είναι $n_1 n_2 \cdots n_r$. Π.χ. $10$ ρίψεις νομίσματος δίνουν $2^{10} = 1024$ αποτελέσματα.</p></div>
<div class="tbox"><h4>Διατάξεις (μεταθέσεις $k$ από $n$)</h4>
<p>Παίρνουμε $k \le n$ από $n$ διαφορετικά αντικείμενα και τα βάζουμε <b>σε σειρά</b> (χωρίς επανάθεση):</p>
$$(n)_k = P_{n,k} = n(n-1)\cdots(n-k+1) = \frac{n!}{(n-k)!},\qquad (n)_n = n!\ \ (0! = 1).$$
<p>Με επανάθεση (επιτρέπονται επαναλήψεις) οι διατεταγμένες $k$-άδες είναι $n^k$.</p></div>
<div class="tbox"><h4>Συνδυασμοί</h4>
<p>Το πλήθος των υποσυνόλων μεγέθους $k$ (η σειρά <b>δεν</b> μετρά): αφού κάθε υποσύνολο δίνει $k!$ διατάξεις, $M\cdot k! = (n)_k$, άρα</p>
$$\binom{n}{k} = \frac{(n)_k}{k!} = \frac{n!}{k!\,(n-k)!}.$$
<p>Ταυτότητες: $\binom nk = \binom{n}{n-k}$, $\ \binom nk = \binom{n-1}{k-1} + \binom{n-1}{k}$, $\ \sum_{k=0}^n \binom nk = 2^n$. <b>Διωνυμικό θεώρημα</b>: $(x + y)^n = \sum_{k=0}^n \binom nk x^k y^{n-k}$.</p></div>
<div class="tbox warn"><h4>Παγίδες</h4>
<p>Πρώτα αποφασίζουμε: μετρά η σειρά; (διάταξη ή συνδυασμός) Επιτρέπεται επανάληψη; Για περιορισμούς «να μην είναι μαζί» συχνά μετράμε το συμπλήρωμα ή χωρίζουμε σε περιπτώσεις.</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>factorial(5)</code> → 120 · <code>choose(10, 3)</code> → 120 · <code>prod(10:6)</code> → 30240 (= $(10)_5$) · <code>factorial(10) / factorial(7)</code> → 720 (= $(10)_3$). Για απαρίθμηση μικρών περιπτώσεων: <code>combn(5, 2)</code> δίνει όλους τους συνδυασμούς ως στήλες πίνακα.</p></div>`,
  widget: "psaCombW",
  gen: "psaComb",
  exercises: [
    { level: 1, type: "fields", q: R`Με πόσους τρόπους μπορούμε να επιλέξουμε επιτροπή $3$ ατόμων από $10$ άτομα; Με πόσους τρόπους μπορούμε να επιλέξουμε από τα $10$ άτομα πρόεδρο, γραμματέα και ταμία (διαφορετικά πρόσωπα);`,
      fields: [{ label: "επιτροπές =", ans: 120 }, { label: "με αξιώματα =", ans: 720 }],
      hint: R`Συνδυασμοί και διατάξεις $(10)_3$.`, sol: R`$\binom{10}{3} = 120$ (η σειρά δεν μετρά) και $(10)_3 = 10\cdot 9\cdot 8 = 720$ (η σειρά μετρά: κάθε επιτροπή δίνει $3! = 6$ διατάξεις).` },
    { level: 1, type: "fields", q: R`Πόσοι πενταψήφιοι κωδικοί (ψηφία $0$–$9$, επιτρέπεται το $0$ στην αρχή) έχουν όλα τα ψηφία διαφορετικά; Πόσοι είναι συνολικά οι πενταψήφιοι κωδικοί;`,
      fields: [{ label: "διαφορετικά ψηφία =", ans: 30240 }, { label: "συνολικά =", ans: 100000 }],
      hint: R`$(10)_5$ και $10^5$.`, sol: R`$(10)_5 = 10\cdot 9\cdot 8\cdot 7\cdot 6 = 30240$ και $10^5 = 100000$.` },
    { level: 1, type: "fields", q: R`Η Μαρία έχει $8$ φίλες και θα καλέσει $5$ σε δείπνο. Δύο από τις φίλες της είναι μαλωμένες και δεν μπορούν να προσκληθούν και οι δύο. Πόσες δυνατές επιλογές έχει;`,
      fields: [{ label: "επιλογές =", ans: 36 }],
      hint: R`Δύο περιπτώσεις: καμία από τις δύο ή ακριβώς μία από αυτές.`, sol: R`Καμία από τις δύο: $\binom65 = 6$. Ακριβώς μία: $\binom21\binom64 = 2\cdot 15 = 30$. Σύνολο $36$. (Ή: $\binom85 - \binom63 = 56 - 20 = 36$, αφαιρώντας τις επιλογές που περιέχουν και τις δύο.)` },
    { level: 2, type: "fields", q: R`Τέσσερα βιβλία μαθηματικών, δύο λογοτεχνικά και ένα λεξικό (όλα διαφορετικά) τοποθετούνται σε ένα ράφι. Με πόσους τρόπους μπορούν να τοποθετηθούν χωρίς περιορισμό, και με πόσους αν τα βιβλία μαθηματικών πρέπει να είναι μαζί και τα λογοτεχνικά επίσης μαζί;`,
      fields: [{ label: "χωρίς περιορισμό =", ans: 5040 }, { label: "ανά κατηγορία μαζί =", ans: 288 }],
      hint: R`Θεωρήστε κάθε ομάδα ως ένα «μπλοκ».`, sol: R`Χωρίς περιορισμό: $7! = 5040$. Με τα μπλοκ: $3$ μονάδες (μαθηματικά, λογοτεχνικά, λεξικό) σε $3!$ σειρές, και μέσα στα μπλοκ $4!$ και $2!$: $3!\cdot 4!\cdot 2! = 6\cdot 24\cdot 2 = 288$.` },
    { level: 2, type: "fields", q: R`Ένα τηλεπικοινωνιακό σύστημα έχει $10$ κεραίες στη σειρά, από τις οποίες $3$ είναι ελαττωματικές (όλες οι δυνατές θέσεις των $3$ ελαττωματικών είναι ισοπίθανες). Το σύστημα λειτουργεί αν δεν υπάρχουν δύο διαδοχικές ελαττωματικές. Πόσες διατάξεις των θέσεων είναι «λειτουργικές» και ποια η πιθανότητα το σύστημα να λειτουργεί;`,
      fields: [{ label: "λειτουργικές =", ans: 56 }, { label: "P =", ans: "7/15", tol: 0.001 }],
      hint: R`Τοποθετήστε πρώτα τις $7$ καλές· οι ελαττωματικές μπαίνουν σε διαφορετικά από τα $8$ «κενά».`, sol: R`Οι $7$ καλές δημιουργούν $8$ κενά (ανάμεσα και στα άκρα). Διαλέγουμε $3$ διαφορετικά κενά: $\binom83 = 56$. Όλες οι διατάξεις: $\binom{10}{3} = 120$. Άρα $P = \frac{56}{120} = \frac{7}{15}$.` },
    { level: 1, type: "fields", q: R`Στην R, τι επιστρέφουν οι εντολές <code>choose(8, 3)</code> και <code>factorial(6) / factorial(4)</code>;`,
      fields: [{ label: "choose(8,3) =", ans: 56 }, { label: "6!/4! =", ans: 30 }],
      hint: R`$\binom83$ και $(6)_2$.`, sol: R`$\binom83 = \frac{8\cdot 7\cdot 6}{6} = 56$ και $\frac{6!}{4!} = 6\cdot 5 = 30 = (6)_2$.` },
    { level: 2, type: "mc", q: R`Για κάθε $n, m \ge r$ ισχύει $\binom{n}{0}\binom{m}{r} + \binom{n}{1}\binom{m}{r-1} + \dots + \binom{n}{r}\binom{m}{0} = \binom{n+m}{r}$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Ομάδες $r$ ατόμων από $n$ άνδρες και $m$ γυναίκες, ανάλογα με το πλήθος $k$ των ανδρών.`, sol: R`Σωστό (ταυτότητα Vandermonde): κάθε ομάδα $r$ ατόμων από τους $n + m$ έχει κάποιο πλήθος $k$ ανδρών, και οι ομάδες με $k$ άνδρες είναι $\binom nk\binom{m}{r-k}$. Αθροίζοντας για $k = 0, \dots, r$ παίρνουμε $\binom{n+m}{r}$.` },
    { level: 2, type: "fields", q: R`Πόσες πινακίδες κυκλοφορίας σχηματίζονται με $3$ γράμματα (από $24$) ακολουθούμενα από $3$ ψηφία, αν (α) επιτρέπονται επαναλήψεις, (β) δεν επιτρέπεται επανάληψη ούτε γράμματος ούτε ψηφίου;`,
      fields: [{ label: "(α) =", ans: 13824000 }, { label: "(β) =", ans: 8743680 }],
      hint: R`Γενικευμένη αρχή μέτρησης.`, sol: R`(α) $24^3\cdot 10^3 = 13\,824\,000$. (β) $(24)_3\cdot (10)_3 = 24\cdot 23\cdot 22\cdot 10\cdot 9\cdot 8 = 8\,743\,680$.` },
    { level: 3, type: "fields", q: R`Από $6$ άνδρες και $5$ γυναίκες επιλέγουμε τυχαία επιτροπή $4$ ατόμων. Ποια είναι η πιθανότητα η επιτροπή να έχει ακριβώς $2$ άνδρες, και ποια να έχει τουλάχιστον μία γυναίκα;`,
      fields: [{ label: "P(2 άνδρες) =", ans: "5/11", tol: 0.001 }, { label: "P(≥1 γυναίκα) =", ans: "21/22", tol: 0.001 }],
      hint: R`$\binom{11}{4} = 330$ ισοπίθανες επιτροπές· για το δεύτερο, συμπλήρωμα.`, sol: R`$P(2\text{ άνδρες}) = \frac{\binom62\binom52}{\binom{11}4} = \frac{150}{330} = \frac{5}{11}$. $P(\text{καμία γυναίκα}) = \frac{\binom64}{330} = \frac{15}{330} = \frac1{22}$, άρα $P(\ge 1) = \frac{21}{22}$.` }
  ]
},
/* ───────────────────────────── 1.2 ───────────────────────────── */
{
  id: "1.2", unit: 1, title: "Πολυωνυμικοί συντελεστές – Κατανομή σφαιριδίων σε δοχεία",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Συνδυαστική (πολυωνυμικοί συντελεστές, Προτάσεις 1–2) · Φυλλάδιο ασκήσεων 1",
  theory: R`
<div class="tbox"><h4>Πολυωνυμικοί συντελεστές</h4>
<p>Χωρίζουμε $n$ αντικείμενα σε $k$ (διακεκριμένες) ομάδες μεγέθους $n_1, \dots, n_k$ με $n_1 + \dots + n_k = n$. Από τη βασική αρχή μέτρησης:</p>
$$\binom{n}{n_1}\binom{n - n_1}{n_2}\cdots = \frac{n!}{n_1!\,n_2!\cdots n_k!} =: \binom{n}{n_1, n_2, \dots, n_k}.$$
<p>Αν οι ομάδες <b>δεν</b> έχουν ονόματα και είναι ισομεγέθεις, διαιρούμε με το πλήθος των αναδιατάξεών τους: π.χ. $10$ παίκτες σε δύο ομάδες των $5$ χωρίς ονόματα: $\frac{1}{2!}\binom{10}{5, 5} = 126$.</p>
<p><b>Πολυωνυμικό θεώρημα</b>: $(x_1 + \dots + x_k)^n = \sum_{n_1 + \dots + n_k = n} \binom{n}{n_1, \dots, n_k} x_1^{n_1}\cdots x_k^{n_k}$.</p></div>
<div class="tbox"><h4>Σφαιρίδια σε δοχεία</h4>
<ul><li>$n$ <b>διακεκριμένα</b> σφαιρίδια σε $k$ διακεκριμένα δοχεία: $k^n$ τρόποι (κάθε σφαιρίδιο διαλέγει δοχείο).</li>
<li>$n$ <b>όμοια</b> σφαιρίδια σε $k$ δοχεία: το αποτέλεσμα είναι το διάνυσμα $(x_1, \dots, x_k)$, όπου $x_i$ τα σφαιρίδια στο δοχείο $i$. Με $n$ σφαιρίδια και $k - 1$ διαχωριστικά σε $n + k - 1$ θέσεις:</li></ul>
<p><b>Πρόταση 1.</b> Η $x_1 + \dots + x_k = n$ έχει $\binom{n+k-1}{k-1} = \binom{n+k-1}{n}$ μη αρνητικές ακέραιες λύσεις.</p>
<p><b>Πρόταση 2.</b> Έχει $\binom{n-1}{k-1}$ θετικές ακέραιες λύσεις (θέτουμε $y_i = x_i - 1 \ge 0$).</p></div>
<div class="tbox warn"><h4>Παράδειγμα – παγίδα</h4>
<p>Επενδυτής με $30$ εκατομμύρια σε μονάδες του $1$ εκατ. και $4$ επενδύσεις: αν επενδύει όλα τα χρήματα, $\binom{33}{3} = 5456$ στρατηγικές· αν όχι υποχρεωτικά όλα, προσθέτουμε μια μεταβλητή $x_5$ για το υπόλοιπο: $\binom{34}{4} = 46376$. Τα $\binom{n+k-1}{k-1}$ αποτελέσματα με όμοια σφαιρίδια <b>δεν</b> είναι ισοπίθανα όταν τα σφαιρίδια ρίχνονται τυχαία ένα-ένα.</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>factorial(10) / (factorial(5) * factorial(3) * factorial(2))</code> → 2520 · <code>choose(33, 3)</code> → 5456 (λύσεις της $x_1 + \dots + x_4 = 30$) · <code>table(sample(1:4, 30, replace = TRUE))</code> ρίχνει $30$ σφαιρίδια τυχαία σε $4$ δοχεία.</p></div>`,
  widget: "psaBins",
  gen: "psaMult",
  exercises: [
    { level: 1, type: "fields", q: R`Ένα τμήμα $12$ υπαλλήλων πρέπει να χωριστεί σε τρεις ομάδες: $6$ στην εξυπηρέτηση, $4$ στο λογιστήριο και $2$ στην αποθήκη. Με πόσους τρόπους γίνεται ο χωρισμός;`,
      fields: [{ label: "τρόποι =", ans: 13860 }],
      hint: R`Πολυωνυμικός συντελεστής.`, sol: R`$\binom{12}{6, 4, 2} = \frac{12!}{6!\,4!\,2!} = 13860$.` },
    { level: 1, type: "fields", q: R`$8$ παίκτες χωρίζονται σε δύο ομάδες των $4$. Πόσοι είναι οι χωρισμοί αν η μία ομάδα παίζει στην Α΄ και η άλλη στη Β΄ κατηγορία; Πόσοι, αν απλώς παίζουν μεταξύ τους (οι ομάδες δεν έχουν ονόματα);`,
      fields: [{ label: "με ονόματα =", ans: 70 }, { label: "χωρίς ονόματα =", ans: 35 }],
      hint: R`Χωρίς ονόματα κάθε χωρισμός μετρήθηκε $2!$ φορές.`, sol: R`$\binom{8}{4, 4} = \frac{8!}{4!\,4!} = 70$. Χωρίς ονόματα: $70/2! = 35$.` },
    { level: 1, type: "fields", q: R`Πόσες μη αρνητικές και πόσες θετικές ακέραιες λύσεις έχει η εξίσωση $x_1 + x_2 + x_3 + x_4 = 10$;`,
      fields: [{ label: "μη αρνητικές =", ans: 286 }, { label: "θετικές =", ans: 84 }],
      hint: R`Προτάσεις 1 και 2 με $n = 10$, $k = 4$.`, sol: R`Μη αρνητικές: $\binom{13}{3} = 286$. Θετικές: $\binom{9}{3} = 84$.` },
    { level: 2, type: "fields", q: R`Ένας επενδυτής έχει $20$ εκατομμύρια ευρώ για $4$ επενδύσεις, σε ακέραιες μονάδες του $1$ εκατομμυρίου. Πόσες στρατηγικές υπάρχουν αν επενδύσει όλα τα χρήματα; Πόσες αν δεν είναι υποχρεωτικό να επενδύσει όλα;`,
      fields: [{ label: "όλα =", ans: 1771 }, { label: "όχι υποχρεωτικά όλα =", ans: 10626 }],
      hint: R`Για το δεύτερο, μια επιπλέον μεταβλητή $x_5$ για τα χρήματα που μένουν.`, sol: R`$x_1 + \dots + x_4 = 20$: $\binom{23}{3} = 1771$. Με $x_5$: $x_1 + \dots + x_5 = 20$: $\binom{24}{4} = 10626$.` },
    { level: 2, type: "fields", q: R`Ποιος είναι ο συντελεστής του $x^2y^3z$ στο ανάπτυγμα του $(x + y + z)^6$, και ποιο είναι το άθροισμα όλων των πολυωνυμικών συντελεστών $\binom{6}{n_1, n_2, n_3}$;`,
      fields: [{ label: "συντελεστής =", ans: 60 }, { label: "άθροισμα =", ans: 729 }],
      hint: R`Πολυωνυμικό θεώρημα· για το άθροισμα θέστε $x = y = z = 1$.`, sol: R`$\binom{6}{2, 3, 1} = \frac{6!}{2!\,3!\,1!} = 60$ και $\sum \binom{6}{n_1, n_2, n_3} = (1 + 1 + 1)^6 = 3^6 = 729$.` },
    { level: 2, type: "fields", q: R`Πόσες μη αρνητικές ακέραιες λύσεις της $x_1 + x_2 + x_3 + x_4 = 6$ έχουν <b>ακριβώς ένα</b> $x_i$ ίσο με μηδέν;`,
      fields: [{ label: "λύσεις =", ans: 40 }],
      hint: R`Διαλέξτε ποια μεταβλητή είναι $0$· οι άλλες τρεις είναι θετικές.`, sol: R`$\binom41$ επιλογές για τη μηδενική μεταβλητή και $\binom{5}{2} = 10$ θετικές λύσεις της $y_1 + y_2 + y_3 = 6$: $4\cdot 10 = 40$. (Γενικά $\binom{r}{k}\binom{n-1}{n-r+k}$ — Φυλλάδιο 1.)` },
    { level: 1, type: "fields", q: R`Ρίχνουμε $5$ διακεκριμένα σφαιρίδια σε $3$ διακεκριμένα δοχεία. Πόσες είναι οι δυνατές τοποθετήσεις; Αν τα σφαιρίδια είναι όμοια, πόσες είναι οι δυνατές «εικόνες» $(x_1, x_2, x_3)$;`,
      fields: [{ label: "διακεκριμένα =", ans: 243 }, { label: "όμοια =", ans: 21 }],
      hint: R`$k^n$ και $\binom{n+k-1}{k-1}$.`, sol: R`$3^5 = 243$ και $\binom{7}{2} = 21$.` },
    { level: 2, type: "fields", q: R`Πόσες διαφορετικές «λέξεις» σχηματίζονται με όλα τα γράμματα της λέξης ΣΤΑΤΙΣΤΙΚΗ (Σ, Τ, Α, Τ, Ι, Σ, Τ, Ι, Κ, Η);`,
      fields: [{ label: "λέξεις =", ans: 151200 }],
      hint: R`$10$ γράμματα: Σ δύο φορές, Τ τρεις, Ι δύο.`, sol: R`$\binom{10}{2, 3, 2, 1, 1, 1} = \frac{10!}{2!\,3!\,2!} = \frac{3\,628\,800}{24} = 151\,200$.` },
    { level: 1, type: "mc", q: R`Τοποθετούμε τυχαία $n$ όμοια σφαιρίδια ένα-ένα σε $k$ δοχεία (κάθε σφαιρίδιο ανεξάρτητα, ισοπίθανα σε κάθε δοχείο). Τότε οι $\binom{n+k-1}{k-1}$ δυνατές εικόνες $(x_1, \dots, x_k)$ είναι ισοπίθανες.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Δοκιμάστε $n = 2$, $k = 2$.`, sol: R`Λάθος: για $n = k = 2$ οι εικόνες $(2, 0)$, $(1, 1)$, $(0, 2)$ έχουν πιθανότητες $\frac14, \frac12, \frac14$· η $(1, 1)$ προκύπτει με δύο τρόπους. Ισοπίθανα είναι τα $k^n$ αποτελέσματα με διακεκριμένα σφαιρίδια.` }
  ]
},
/* ───────────────────────────── 2.1 ───────────────────────────── */
{
  id: "2.1", unit: 2, title: "Δειγματικός χώρος – Αξιώματα πιθανότητας – Ισοπίθανα αποτελέσματα",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Πιθανότητες (αξιωματική θεμελίωση, βασικές ιδιότητες) · Φυλλάδιο ασκήσεων 2",
  theory: R`
<div class="tbox"><h4>Δειγματικός χώρος – σ-άλγεβρα</h4>
<p>Ο <b>δειγματικός χώρος</b> $\Omega$ είναι το σύνολο όλων των δυνατών αποτελεσμάτων ενός πειράματος. Τα ενδεχόμενα ανήκουν σε μια <b>σ-άλγεβρα</b> $\mathcal F$ υποσυνόλων του $\Omega$: $\Omega \in \mathcal F$, αν $A \in \mathcal F$ τότε $A^c \in \mathcal F$, και αν $A_1, A_2, \dots \in \mathcal F$ τότε $\bigcup_i A_i \in \mathcal F$. Τα $A, B$ λέγονται <b>ξένα</b> (ασυμβίβαστα) αν $A \cap B = \varnothing$.</p></div>
<div class="tbox"><h4>Αξιώματα</h4>
<p>Μια συνάρτηση $P: \mathcal F \to \mathbb R$ λέγεται συνάρτηση πιθανότητας αν (i) $0 \le P(A) \le 1$, (ii) $P(\Omega) = 1$, (iii) για κάθε ακολουθία ανά δύο ξένων $A_1, A_2, \dots$: $P\left(\bigcup_{i=1}^\infty A_i\right) = \sum_{i=1}^\infty P(A_i)$.</p></div>
<div class="tbox"><h4>Βασικές ιδιότητες</h4>
<ul><li>$P(A^c) = 1 - P(A)$· αν $A \subseteq B$: $P(B - A) = P(B) - P(A)$ και $P(A) \le P(B)$.</li>
<li>$P(A \cup B) = P(A) + P(B) - P(A \cap B)$, και γενικά (εγκλεισμός–αποκλεισμός)
$P\left(\bigcup_{i=1}^n A_i\right) = \sum_i P(A_i) - \sum_{i \lt j} P(A_i \cap A_j) + \sum_{i \lt j \lt k} P(A_i \cap A_j \cap A_k) - \dots + (-1)^{n+1}P(A_1 \cap \dots \cap A_n)$.</li>
<li><b>Ανισότητα του Boole</b>: $P\left(\bigcup_i A_i\right) \le \sum_i P(A_i)$.</li>
<li>Κλασικός ορισμός: αν το $\Omega$ είναι πεπερασμένο με <b>ισοπίθανα</b> στοιχεία, $P(A) = \frac{|A|}{|\Omega|}$.</li></ul></div>
<div class="tbox tip"><h4>Στην R</h4>
<p>Ακριβής υπολογισμός: <code>1 - choose(48, 5) / choose(52, 5)</code> → 0.3412 ($P$ τουλάχιστον ενός άσου σε $5$ φύλλα). Προσομοίωση: <code>mean(replicate(10000, any(sample(1:6, 4, replace = TRUE) == 6)))</code> ≈ 0.518 (τουλάχιστον ένα $6$ σε $4$ ρίψεις).</p></div>`,
  widget: "psaVennP",
  gen: "psaAx",
  exercises: [
    { level: 1, type: "fields", q: R`Ρίχνουμε ένα νόμισμα τρεις φορές. Πόσα στοιχεία έχει ο δειγματικός χώρος και ποια είναι η πιθανότητα να φέρουμε τουλάχιστον δύο κεφαλές;`,
      fields: [{ label: "|Ω| =", ans: 8 }, { label: "P =", ans: "1/2", tol: 0.001 }],
      hint: R`Τα ισοπίθανα αποτελέσματα είναι τριάδες Κ/Γ.`, sol: R`$|\Omega| = 2^3 = 8$. Ευνοϊκά: ΚΚΓ, ΚΓΚ, ΓΚΚ, ΚΚΚ, δηλαδή $4$, άρα $P = 4/8 = 1/2$.` },
    { level: 1, type: "fields", q: R`Αν $P(A) = 0{,}5$, $P(B) = 0{,}4$ και $P(A \cap B) = 0{,}2$, να βρείτε τις $P(A \cup B)$ και $P(A^c \cap B^c)$.`,
      fields: [{ label: "P(A∪B) =", ans: 0.7 }, { label: "P(Aᶜ∩Bᶜ) =", ans: 0.3 }],
      hint: R`De Morgan: $A^c \cap B^c = (A \cup B)^c$.`, sol: R`$P(A \cup B) = 0{,}5 + 0{,}4 - 0{,}2 = 0{,}7$ και $P(A^c \cap B^c) = 1 - 0{,}7 = 0{,}3$.` },
    { level: 2, type: "fields", q: R`Αν $P(A) = 0{,}6$ και $P(B) = 0{,}7$, ποια είναι η ελάχιστη και ποια η μέγιστη δυνατή τιμή της $P(A \cap B)$;`,
      fields: [{ label: "ελάχιστη =", ans: 0.3 }, { label: "μέγιστη =", ans: 0.6 }],
      hint: R`$P(A \cup B) \le 1$ και $A \cap B \subseteq A$.`, sol: R`$P(A \cap B) = P(A) + P(B) - P(A \cup B) \ge 1{,}3 - 1 = 0{,}3$, με ισότητα όταν $A \cup B = \Omega$. Επίσης $P(A \cap B) \le \min\{P(A), P(B)\} = 0{,}6$, με ισότητα όταν $A \subseteq B$.` },
    { level: 2, type: "fields", q: R`Οι κωδικοί πρόσβασης ενός συστήματος έχουν $6$ χαρακτήρες· ο πρώτος είναι ένα από τα $26$ λατινικά γράμματα και καθένας από τους υπόλοιπους είναι γράμμα ή ψηφίο ($36$ επιλογές). Όλοι οι κωδικοί είναι ισοπίθανοι. Ποια η πιθανότητα ο κωδικός να αρχίζει με ένα από τα πέντε πρώτα γράμματα, ποια να τελειώνει σε περιττό ψηφίο, και ποια να συμβαίνουν και τα δύο; (4 δεκαδικά)`,
      fields: [{ label: "αρχή =", ans: 5 / 26, tol: 0.0005 }, { label: "τέλος =", ans: 5 / 36, tol: 0.0005 }, { label: "και τα δύο =", ans: 25 / 936, tol: 0.0005 }],
      hint: R`Μετρήστε με τη γενικευμένη αρχή· οι δύο θέσεις επιλέγονται ανεξάρτητα.`, sol: R`$|\Omega| = 26\cdot 36^5$. Αρχή: $\frac{5}{26} \approx 0{,}1923$. Τέλος: $\frac{5}{36} \approx 0{,}1389$. Και τα δύο: $\frac{5\cdot 36^4\cdot 5}{26\cdot 36^5} = \frac{25}{936} \approx 0{,}0267$.` },
    { level: 1, type: "mc", q: R`Δύο ενδεχόμενα έχουν $P(A) = 0{,}5$ και $P(B) = 0{,}6$. Είναι δυνατό να είναι ξένα;`,
      options: ["Όχι, γιατί τότε θα ήταν $P(A \\cup B) = 1{,}1 > 1$", "Ναι, πάντα", "Ναι, μόνο αν $P(A \\cap B) = 0{,}1$", "Όχι, γιατί $P(A) \\ne P(B)$"], correct: 0,
      hint: R`Για ξένα $P(A \cup B) = P(A) + P(B)$.`, sol: R`Αν ήταν ξένα, $P(A \cup B) = 0{,}5 + 0{,}6 = 1{,}1$, αδύνατο. Άρα $P(A \cap B) \ge 0{,}1 > 0$.` },
    { level: 2, type: "mc", q: R`Για οποιαδήποτε ενδεχόμενα $A_1, \dots, A_n$ ισχύει $P(A_1 \cup \dots \cup A_n) \le P(A_1) + \dots + P(A_n)$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Ανισότητα του Boole.`, sol: R`Σωστό: είναι η ανισότητα του Boole· ισότητα έχουμε όταν τα ενδεχόμενα είναι ανά δύο ξένα (και γενικά όταν οι τομές έχουν μηδενική πιθανότητα).` },
    { level: 3, type: "fields", q: R`Για τρία ενδεχόμενα είναι $P(A) = P(B) = P(C) = 0{,}4$, $P(A \cap B) = P(A \cap C) = P(B \cap C) = 0{,}15$ και $P(A \cap B \cap C) = 0{,}05$. Να βρείτε την πιθανότητα να πραγματοποιηθεί τουλάχιστον ένα και την πιθανότητα να μην πραγματοποιηθεί κανένα.`,
      fields: [{ label: "τουλάχιστον ένα =", ans: 0.8 }, { label: "κανένα =", ans: 0.2 }],
      hint: R`Εγκλεισμός–αποκλεισμός για τρία ενδεχόμενα.`, sol: R`$P(A \cup B \cup C) = 1{,}2 - 0{,}45 + 0{,}05 = 0{,}8$ και $P(\text{κανένα}) = 1 - 0{,}8 = 0{,}2$.` },
    { level: 2, type: "fields", q: R`Ένας κωδικός $6$ <b>γραμμάτων</b> (από $26$, επιτρέπονται επαναλήψεις) επιλέγεται τυχαία. Ποια η πιθανότητα όλα τα γράμματα να είναι διαφορετικά; (4 δεκαδικά)`,
      fields: [{ label: "P =", ans: 0.5366045144939441, tol: 0.0005 }],
      hint: R`$\frac{(26)_6}{26^6}$.`, sol: R`$P = \frac{26\cdot 25\cdot 24\cdot 23\cdot 22\cdot 21}{26^6} = \frac{165\,765\,600}{308\,915\,776} \approx 0{,}5366$.` },
    { level: 1, type: "fields", q: R`Στην R, τι επιστρέφει (4 δεκαδικά) η εντολή <code>1 - choose(48, 5) / choose(52, 5)</code>; Τι πιθανότητα υπολογίζει για ένα τυχαίο χέρι $5$ φύλλων από τράπουλα $52$ φύλλων;`,
      fields: [{ label: "τιμή =", ans: 0.34115800166220334, tol: 0.0005 }],
      hint: R`Τα χέρια χωρίς κανέναν άσο επιλέγονται από τα $48$ μη-άσους.`, sol: R`$1 - \frac{\binom{48}{5}}{\binom{52}{5}} = 1 - \frac{1\,712\,304}{2\,598\,960} \approx 0{,}3412$: η πιθανότητα να υπάρχει <b>τουλάχιστον ένας άσος</b> (συμπλήρωμα του «κανένας άσος»).` }
  ]
},
/* ───────────────────────────── 2.2 ───────────────────────────── */
{
  id: "2.2", unit: 2, title: "Δεσμευμένη πιθανότητα – Ανεξαρτησία",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Πιθανότητες (ανεξάρτητα ενδεχόμενα, δεσμευμένη πιθανότητα) · Φυλλάδιο ασκήσεων 2",
  theory: R`
<div class="tbox"><h4>Δεσμευμένη πιθανότητα</h4>
<p>Για $P(B) > 0$: $\ P(A \mid B) = \dfrac{P(A \cap B)}{P(B)}$. Αν γνωρίζουμε ότι συνέβη το $B$, ο δειγματικός χώρος ουσιαστικά «περιορίζεται» στο $B$. Η $P(\cdot \mid B)$ είναι συνάρτηση πιθανότητας, π.χ. $P(A^c \mid B) = 1 - P(A \mid B)$. Πολλαπλασιαστικός κανόνας: $P(A \cap B) = P(B)\,P(A \mid B)$ και $P(A_1 \cap A_2 \cap A_3) = P(A_1)P(A_2 \mid A_1)P(A_3 \mid A_1 \cap A_2)$.</p></div>
<div class="tbox"><h4>Ανεξάρτητα ενδεχόμενα</h4>
<p>Τα $A, B$ είναι <b>ανεξάρτητα</b> $\iff P(A \cap B) = P(A)P(B)$ (τότε $P(A \mid B) = P(A)$). Τα $A_1, \dots, A_k$ είναι ανεξάρτητα $\iff$ για <b>κάθε</b> υποσύνολο $I \subseteq \{1, \dots, k\}$: $P\left(\bigcap_{i \in I} A_i\right) = \prod_{i \in I} P(A_i)$. Αν $A, B$ ανεξάρτητα, τότε ανεξάρτητα είναι και τα $A, B^c$, τα $A^c, B$ και τα $A^c, B^c$.</p>
<p>Παράδειγμα: από τράπουλα $52$ φύλλων, «άσος» και «σπαθί» είναι ανεξάρτητα ($\frac1{52} = \frac4{52}\cdot\frac{13}{52}$)· αν αφαιρέσουμε τα καρό από το $2$ μέχρι και το $9$ (μένουν $44$ φύλλα), γίνονται εξαρτημένα.</p></div>
<div class="tbox tip"><h4>Δοκιμές με και χωρίς επανάθεση</h4>
<p>Με επανάθεση οι διαδοχικές επιλογές είναι ανεξάρτητες ($P(B) = \frac{4}{52}$ για άσο στη 2η)· χωρίς επανάθεση εξαρτημένες ($P(B \mid A) = \frac{3}{51}$). Συστήματα: <b>σε σειρά</b> λειτουργεί αν λειτουργούν όλα ($\prod p_i$), <b>παράλληλο</b> αν λειτουργεί τουλάχιστον ένα ($1 - \prod(1 - p_i)$).</p></div>
<div class="tbox warn"><h4>Ανεξάρτητα ≠ ξένα</h4>
<p>Αν $A, B$ ξένα με $P(A), P(B) > 0$, τότε $P(A \cap B) = 0 \ne P(A)P(B)$: είναι <b>εξαρτημένα</b>.</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>p &lt;- c(0.9, 0.8, 0.7); prod(p)</code> → 0.504 (σε σειρά) · <code>1 - prod(1 - p)</code> → 0.994 (παράλληλο). Προσομοίωση δεσμευμένης: <code>x &lt;- sample(1:6, 1e5, TRUE); mean(x[x %% 2 == 0] == 6)</code> ≈ 0.333.</p></div>`,
  widget: "psaGrid",
  gen: "psaCond",
  exercises: [
    { level: 1, type: "fields", q: R`Το $60\%$ των φοιτητών έχει λογαριασμό στο Instagram, το $45\%$ στο TikTok και το $25\%$ και στα δύο. Αν ένας φοιτητής έχει Instagram, ποια η πιθανότητα να έχει TikTok; Αν <b>δεν</b> έχει Instagram, ποια η πιθανότητα να έχει TikTok;`,
      fields: [{ label: "P(T | I) =", ans: "5/12", tol: 0.001 }, { label: "P(T | Iᶜ) =", ans: 0.5, tol: 0.001 }],
      hint: R`$P(T \cap I^c) = P(T) - P(T \cap I)$.`, sol: R`$P(T \mid I) = \frac{0{,}25}{0{,}60} = \frac{5}{12} \approx 0{,}417$. $P(T \cap I^c) = 0{,}45 - 0{,}25 = 0{,}20$ και $P(I^c) = 0{,}40$, άρα $P(T \mid I^c) = 0{,}5$.` },
    { level: 1, type: "fields", q: R`Ρίχνουμε ένα ζάρι και μας λένε ότι το αποτέλεσμα είναι άρτιο. Ποια είναι η πιθανότητα να είναι $6$;`,
      fields: [{ label: "P =", ans: "1/3", tol: 0.001 }], hint: R`Ο «νέος» δειγματικός χώρος είναι το $\{2, 4, 6\}$.`, sol: R`$P(6 \mid \text{άρτιο}) = \frac{1/6}{1/2} = \frac13$.` },
    { level: 2, type: "fields", q: R`Ένα πρόγραμμα αποτελείται από δύο μέρη κώδικα, γραμμένα ανεξάρτητα. Το πρώτο έχει σφάλμα με πιθανότητα $0{,}15$ και το δεύτερο με $0{,}1$. Ποια η πιθανότητα να εμφανιστεί μήνυμα σφάλματος (σφάλμα σε τουλάχιστον ένα μέρος); Αν εμφανίστηκε, ποια η πιθανότητα να υπάρχει σφάλμα στο πρώτο μέρος; (4 δεκαδικά)`,
      fields: [{ label: "P(σφάλμα) =", ans: 0.235, tol: 0.0005 }, { label: "P(A₁ | σφάλμα) =", ans: 0.15 / 0.235, tol: 0.0005 }],
      hint: R`$A_1 \subseteq A_1 \cup A_2$, άρα $P(A_1 \cap (A_1 \cup A_2)) = P(A_1)$.`, sol: R`$P(A_1 \cup A_2) = 0{,}15 + 0{,}1 - 0{,}15\cdot 0{,}1 = 0{,}235$. $P(A_1 \mid A_1 \cup A_2) = \frac{0{,}15}{0{,}235} \approx 0{,}6383$.` },
    { level: 1, type: "fields", q: R`Κάλπη περιέχει $4$ κόκκινες και $6$ λευκές μπάλες. Παίρνουμε διαδοχικά $2$ μπάλες χωρίς επανάθεση. Ποια είναι η πιθανότητα να είναι και οι δύο κόκκινες, και ποια η πιθανότητα η <b>δεύτερη</b> να είναι κόκκινη;`,
      fields: [{ label: "P(και οι δύο) =", ans: "2/15", tol: 0.001 }, { label: "P(2η κόκκινη) =", ans: "2/5", tol: 0.001 }],
      hint: R`Πολλαπλασιαστικός κανόνας· για τη 2η μπάλα χωρίστε ανάλογα με την 1η.`, sol: R`$P(K_1 \cap K_2) = \frac{4}{10}\cdot\frac{3}{9} = \frac{2}{15}$. $P(K_2) = \frac{4}{10}\cdot\frac39 + \frac{6}{10}\cdot\frac49 = \frac{36}{90} = \frac25$ — ίση με $P(K_1)$, λόγω συμμετρίας.` },
    { level: 2, type: "fields", q: R`Ένα <b>παράλληλο</b> σύστημα έχει τρεις συνιστώσες που λειτουργούν ανεξάρτητα με πιθανότητες $0{,}9$, $0{,}8$ και $0{,}7$. Ποια η πιθανότητα να λειτουργεί το σύστημα; Ποια θα ήταν αν οι συνιστώσες ήταν συνδεδεμένες <b>σε σειρά</b>;`,
      fields: [{ label: "παράλληλο =", ans: 0.994 }, { label: "σε σειρά =", ans: 0.504 }],
      hint: R`Παράλληλο: $1 - P(\text{όλες χαλασμένες})$.`, sol: R`Παράλληλο: $1 - 0{,}1\cdot 0{,}2\cdot 0{,}3 = 1 - 0{,}006 = 0{,}994$. Σε σειρά: $0{,}9\cdot 0{,}8\cdot 0{,}7 = 0{,}504$.` },
    { level: 2, type: "mc", q: R`Τα ενδεχόμενα $A$ και $B$ είναι ξένα, με $P(A) = 0{,}3$ και $P(B) = 0{,}4$. Τότε τα $A, B$:`,
      options: ["είναι εξαρτημένα", "είναι ανεξάρτητα", "είναι ανεξάρτητα μόνο αν $P(A \\cup B) = 0{,}7$", "δεν μπορούμε να αποφανθούμε"], correct: 0,
      hint: R`Συγκρίνετε $P(A \cap B)$ με $P(A)P(B)$.`, sol: R`$P(A \cap B) = 0$, ενώ $P(A)P(B) = 0{,}12$. Η ισότητα αποτυγχάνει, άρα είναι εξαρτημένα.` },
    { level: 2, type: "mc", q: R`Αν τα $A$ και $B$ είναι ανεξάρτητα, τότε και τα $A^c$ και $B^c$ είναι ανεξάρτητα.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`$P(A^c \cap B^c) = 1 - P(A \cup B)$.`, sol: R`Σωστό: $P(A^c \cap B^c) = 1 - P(A) - P(B) + P(A)P(B) = (1 - P(A))(1 - P(B)) = P(A^c)P(B^c)$.` },
    { level: 2, type: "mc", q: R`Από τράπουλα $52$ φύλλων αφαιρούμε τα φύλλα $2$ έως $9$ της φυλής κούπα (μένουν $44$ φύλλα) και τραβάμε ένα φύλλο. Τα ενδεχόμενα «άσος» και «σπαθί» είναι:`,
      options: ["εξαρτημένα, γιατί $\\frac{1}{44} \\ne \\frac{4}{44}\\cdot\\frac{13}{44}$", "ανεξάρτητα, όπως στην πλήρη τράπουλα", "ξένα", "ανεξάρτητα, γιατί κάθε φυλή έχει έναν άσο"], correct: 0,
      hint: R`Μένουν $4$ άσοι και $13$ σπαθιά σε $44$ φύλλα.`, sol: R`$P(A) = \frac{4}{44}$, $P(B) = \frac{13}{44}$, $P(A \cap B) = \frac{1}{44}$, ενώ $P(A)P(B) = \frac{52}{1936} \ne \frac{44}{1936}$: εξαρτημένα. Δεν είναι ξένα, αφού υπάρχει ο άσος σπαθί. (Στην πλήρη τράπουλα $\frac1{52} = \frac4{52}\cdot\frac{13}{52}$: ανεξάρτητα.)` },
    { level: 3, type: "fields", q: R`Ρίχνουμε ένα ζάρι $4$ φορές. Ποια είναι η πιθανότητα να φέρουμε τουλάχιστον ένα $6$; (3 δεκαδικά)`,
      fields: [{ label: "P =", ans: 671 / 1296, tol: 0.001 }],
      hint: R`Συμπλήρωμα και ανεξαρτησία των ρίψεων.`, sol: R`$P(\text{κανένα } 6) = (5/6)^4 = \frac{625}{1296}$, άρα $P = \frac{671}{1296} \approx 0{,}518$ (πρόβλημα του de Méré).` }
  ]
},
/* ───────────────────────────── 2.3 ───────────────────────────── */
{
  id: "2.3", unit: 2, title: "Θεώρημα ολικής πιθανότητας – Θεώρημα Bayes",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Πιθανότητες (θεώρημα ολικής πιθανότητας, θεώρημα Bayes) · Φυλλάδιο ασκήσεων 2",
  theory: R`
<div class="tbox"><h4>Θεώρημα ολικής πιθανότητας</h4>
<p>Αν τα $B_1, \dots, B_k$ είναι ανά δύο ξένα με $\bigcup_{i=1}^k B_i = \Omega$ (και $P(B_i) > 0$), τότε για κάθε ενδεχόμενο $A$:</p>
$$P(A) = \sum_{i=1}^k P(A \mid B_i)\,P(B_i).$$</div>
<div class="tbox"><h4>Θεώρημα του Bayes</h4>
$$P(B_j \mid A) = \frac{P(A \mid B_j)\,P(B_j)}{\sum_{i=1}^k P(A \mid B_i)\,P(B_i)}\qquad (P(A) > 0).$$
<p>Οι $P(B_j)$ είναι οι <b>εκ των προτέρων</b> πιθανότητες, οι $P(B_j \mid A)$ οι <b>εκ των υστέρων</b>.</p></div>
<div class="tbox tip"><h4>Παράδειγμα – εξυπηρετητές</h4>
<p>Τα μηνύματα περνούν από τους εξυπηρετητές $1, 2, 3$ με πιθανότητες $0{,}45$, $0{,}25$, $0{,}30$ και διαβιβάζονται λανθασμένα με $1\%$, $1{,}8\%$, $1{,}1\%$. Τότε $P(B) = 0{,}01\cdot 0{,}45 + 0{,}018\cdot 0{,}25 + 0{,}011\cdot 0{,}3 = 0{,}0123$ και $P(A_1 \mid B) = \frac{0{,}0045}{0{,}0123} \approx 0{,}366$. Το <b>πρόβλημα Monty Hall</b> λύνεται με τον ίδιο τρόπο: η αλλαγή πόρτας κερδίζει με πιθανότητα $\frac23$.</p></div>
<div class="tbox warn"><h4>Παγίδα</h4>
<p>Γενικά $P(A \mid B) \ne P(B \mid A)$. Σε διαγνωστικά τεστ για σπάνια ασθένεια, ακόμη και ένα αξιόπιστο τεστ δίνει μικρή $P(\text{φορέας} \mid +)$.</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>p &lt;- c(0.45, 0.25, 0.30); e &lt;- c(0.01, 0.018, 0.011)</code> · <code>sum(p * e)</code> → 0.0123 (ολική) · <code>p * e / sum(p * e)</code> → 0.3658537 0.3658537 0.2682927 (όλες οι εκ των υστέρων μαζί).</p></div>`,
  widget: "psaBayes",
  gen: "psaBayes",
  exercises: [
    { level: 1, type: "fields", q: R`Ένα εργοστάσιο έχει δύο μηχανές: η $M_1$ παράγει το $60\%$ των προϊόντων με ποσοστό ελαττωματικών $2\%$, και η $M_2$ το $40\%$ με ποσοστό $5\%$. Ποια είναι η πιθανότητα ένα τυχαίο προϊόν να είναι ελαττωματικό; Αν είναι ελαττωματικό, ποια η πιθανότητα να προέρχεται από τη $M_2$;`,
      fields: [{ label: "P(Ε) =", ans: 0.032 }, { label: "P(M2|Ε) =", ans: 0.625 }],
      hint: R`Ολική πιθανότητα, μετά Bayes.`, sol: R`$P(E) = 0{,}6\cdot 0{,}02 + 0{,}4\cdot 0{,}05 = 0{,}032$. $P(M_2 \mid E) = 0{,}02 / 0{,}032 = 0{,}625$.` },
    { level: 2, type: "fields", q: R`Σε μια χώρα το $2\%$ του πληθυσμού είναι φορείς ενός ιού. Ένα διαγνωστικό τεστ είναι θετικό στο $95\%$ των φορέων και στο $3\%$ των μη φορέων. Ποια η πιθανότητα ένα τυχαίο άτομο να βγει θετικό, και ποια να είναι φορέας δεδομένου ότι βγήκε θετικό; (4 δεκαδικά)`,
      fields: [{ label: "P(+) =", ans: 0.0484, tol: 0.0005 }, { label: "P(Φ|+) =", ans: 0.019 / 0.0484, tol: 0.0005 }],
      hint: R`$P(+) = 0{,}02\cdot 0{,}95 + 0{,}98\cdot 0{,}03$.`, sol: R`$P(+) = 0{,}019 + 0{,}0294 = 0{,}0484$. $P(\Phi \mid +) = \frac{0{,}019}{0{,}0484} \approx 0{,}3926$ — λιγότερο από $40\%$, επειδή οι φορείς είναι λίγοι.` },
    { level: 2, type: "fields", q: R`Το δοχείο Ι περιέχει $5$ κόκκινες και $3$ άσπρες μπάλες, το δοχείο ΙΙ $2$ κόκκινες και $4$ άσπρες. Μεταφέρουμε τυχαία $2$ μπάλες (χωρίς επανάθεση) από το Ι στο ΙΙ και μετά παίρνουμε μία μπάλα από το ΙΙ. Ποια η πιθανότητα να είναι κόκκινη; Αν είναι κόκκινη, ποια η πιθανότητα να μεταφέραμε δύο κόκκινες;`,
      fields: [{ label: "P(K) =", ans: "13/32", tol: 0.001 }, { label: "P(ΚΚ | K) =", ans: "40/91", tol: 0.001 }],
      hint: R`Τρία ενδεχόμενα μεταφοράς: ΚΚ, ΚΑ, ΑΑ με πιθανότητες $\frac{10}{28}$, $\frac{15}{28}$, $\frac{3}{28}$· μετά το ΙΙ έχει $8$ μπάλες.`, sol: R`$P(K) = \frac{10}{28}\cdot\frac48 + \frac{15}{28}\cdot\frac38 + \frac{3}{28}\cdot\frac28 = \frac{40 + 45 + 6}{224} = \frac{91}{224} = \frac{13}{32}$. $P(KK \mid K) = \frac{40/224}{91/224} = \frac{40}{91} \approx 0{,}440$.` },
    { level: 2, type: "fields", q: R`Τρεις προμηθευτές δίνουν το $50\%$, $30\%$ και $20\%$ των εξαρτημάτων μιας εταιρείας, με ποσοστά ελαττωματικών $1\%$, $2\%$ και $3\%$. Ένα εξάρτημα βρέθηκε ελαττωματικό. Ποια είναι η πιθανότητα να προέρχεται από τον τρίτο προμηθευτή;`,
      fields: [{ label: "P =", ans: "6/17", tol: 0.001 }],
      hint: R`Πρώτα $P(E)$ από την ολική πιθανότητα.`, sol: R`$P(E) = 0{,}005 + 0{,}006 + 0{,}006 = 0{,}017$, άρα $P(\Pi_3 \mid E) = \frac{0{,}006}{0{,}017} = \frac{6}{17} \approx 0{,}353$.` },
    { level: 2, type: "mc", q: R`Σε τηλεπαιχνίδι διαλέγετε μία από τρεις κλειστές πόρτες (πίσω από μία υπάρχει αυτοκίνητο). Ο παρουσιαστής, που ξέρει πού είναι το αυτοκίνητο, ανοίγει μία από τις άλλες δύο που έχει κατσίκα (αν και οι δύο έχουν κατσίκα, διαλέγει τυχαία) και σας προτείνει να αλλάξετε. Ποια είναι η πιθανότητα να κερδίσετε αν αλλάξετε πόρτα;`,
      options: ["$\\frac23$", "$\\frac12$", "$\\frac13$", "$1$"], correct: 0,
      hint: R`Bayes με $D_i$: «το αυτοκίνητο πίσω από την πόρτα $i$».`, sol: R`Αν διαλέξατε την Α και ανοίχτηκε η Β: $P(\text{Β ανοίγει}) = \frac12\cdot\frac13 + 0 + 1\cdot\frac13 = \frac12$, οπότε $P(D_A \mid \cdot) = \frac{1/6}{1/2} = \frac13$ και $P(D_\Gamma \mid \cdot) = \frac{1/3}{1/2} = \frac23$. Η αλλαγή διπλασιάζει την πιθανότητα επιτυχίας.` },
    { level: 1, type: "mc", q: R`Ποια από τις παρακάτω σχέσεις ισχύει πάντα (για ενδεχόμενα με θετικές πιθανότητες);`,
      options: ["$P(A \\mid B)\\,P(B) = P(B \\mid A)\\,P(A)$", "$P(A \\mid B) = P(B \\mid A)$", "$P(A \\mid B) + P(A \\mid B^c) = 1$", "$P(A \\mid B) = P(A)\\,P(B)$"], correct: 0,
      hint: R`Και οι δύο πλευρές ισούνται με κάτι γνωστό.`, sol: R`$P(A \mid B)P(B) = P(A \cap B) = P(B \mid A)P(A)$ — η βάση του θεωρήματος Bayes. Η $P(A \mid B) = P(B \mid A)$ ισχύει, όταν $P(A \cap B) > 0$, μόνο αν $P(A) = P(B)$. Το σωστό άθροισμα είναι $P(A \mid B) + P(A^c \mid B) = 1$.` },
    { level: 2, type: "fields", q: R`Σε ένα τεστ πολλαπλής επιλογής με $4$ επιλογές, ένας φοιτητής γνωρίζει την απάντηση με πιθανότητα $0{,}6$· αλλιώς μαντεύει τυχαία. Ποια είναι η πιθανότητα να απαντήσει σωστά; Αν απάντησε σωστά, ποια είναι η πιθανότητα να γνώριζε την απάντηση;`,
      fields: [{ label: "P(σωστή) =", ans: 0.7 }, { label: "P(γνώριζε|σωστή) =", ans: "6/7", tol: 0.001 }],
      hint: R`$P(\text{σωστή} \mid \text{μαντεύει}) = 1/4$.`, sol: R`$P(\Sigma) = 0{,}6\cdot 1 + 0{,}4\cdot 0{,}25 = 0{,}7$. $P(\Gamma \mid \Sigma) = 0{,}6 / 0{,}7 = 6/7 \approx 0{,}857$.` },
    { level: 1, type: "fields", q: R`Στην R εκτελούμε <code>p &lt;- c(0.5, 0.3, 0.2); e &lt;- c(0.04, 0.02, 0.05); sum(p * e)</code> και μετά <code>p[1] * e[1] / sum(p * e)</code>. Τι τιμές επιστρέφουν; (4 δεκαδικά)`,
      fields: [{ label: "sum(p*e) =", ans: 0.036, tol: 0.0005 }, { label: "2η εντολή =", ans: 0.02 / 0.036, tol: 0.0005 }],
      hint: R`Ολική πιθανότητα και Bayes για την πρώτη αιτία.`, sol: R`$0{,}5\cdot 0{,}04 + 0{,}3\cdot 0{,}02 + 0{,}2\cdot 0{,}05 = 0{,}02 + 0{,}006 + 0{,}01 = 0{,}036$ και $\frac{0{,}02}{0{,}036} \approx 0{,}5556$.` },
    { level: 3, type: "fields", q: R`Νόσος με επιπολασμό $1\%$· τεστ με ευαισθησία $95\%$ και ειδικότητα $90\%$. Ένα άτομο κάνει το τεστ δύο φορές και βγαίνει θετικό και τις δύο. Υποθέτοντας ότι, δεδομένης της κατάστασης του ατόμου, τα αποτελέσματα είναι ανεξάρτητα, ποια είναι η πιθανότητα να πάσχει; (3 δεκαδικά)`,
      fields: [{ label: "P(D|++) =", ans: 0.009025 / 0.018925, tol: 0.001 }],
      hint: R`$P(++ \mid D) = 0{,}95^2$, $P(++ \mid D^c) = 0{,}10^2$.`, sol: R`$P(D \mid ++) = \frac{0{,}01\cdot 0{,}9025}{0{,}01\cdot 0{,}9025 + 0{,}99\cdot 0{,}01} = \frac{0{,}009025}{0{,}018925} \approx 0{,}477$· με ένα μόνο θετικό θα ήταν περίπου $0{,}088$.` }
  ]
},
/* ───────────────────────────── 3.1 ───────────────────────────── */
{
  id: "3.1", unit: 3, title: "Τυχαίες μεταβλητές – Διακριτές – Μέση τιμή και διασπορά",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Τυχαίες μεταβλητές (συνάρτηση κατανομής, μάζας πιθανότητας, αναμενόμενη τιμή, διασπορά) · Φυλλάδιο ασκήσεων 5",
  theory: R`
<div class="tbox"><h4>Τυχαία μεταβλητή – συνάρτηση κατανομής</h4>
<p>Τυχαία μεταβλητή είναι μια συνάρτηση $X: \Omega \to \mathbb R$ (π.χ. το άθροισμα δύο ζαριών). Η <b>συνάρτηση κατανομής</b> $F_X(x) = P(X \le x)$ είναι μη φθίνουσα, δεξιά συνεχής, με $\lim_{x\to\infty}F(x) = 1$ και $\lim_{x\to-\infty}F(x) = 0$.</p></div>
<div class="tbox"><h4>Διακριτή τ.μ. – συνάρτηση μάζας πιθανότητας</h4>
<p>Η $X$ είναι διακριτή αν παίρνει πεπερασμένο ή αριθμήσιμο σύνολο τιμών $\{x_1, x_2, \dots\}$. <b>Συνάρτηση μάζας πιθανότητας</b>: $p_X(x_k) = P(X = x_k)$, με $p(x) \ge 0$, $\sum_x p(x) = 1$ και $F(x) = \sum_{x_k \le x} p(x_k)$.</p></div>
<div class="tbox"><h4>Αναμενόμενη τιμή και διασπορά</h4>
<p>$E(X) = \sum_x x\,P(X = x)$ (αν η σειρά συγκλίνει απόλυτα), $\ E[g(X)] = \sum_x g(x)P(X = x)$.</p>
<p>$\mathrm{Var}(X) = E\big[(X - E(X))^2\big] = E(X^2) - (E(X))^2$· τυπική απόκλιση $\sqrt{\mathrm{Var}(X)}$.</p>
<p>Γραμμικότητα: $E(aX + bY) = aE(X) + bE(Y)$ (πάντα) και $\mathrm{Var}(aX + b) = a^2\mathrm{Var}(X)$.</p></div>
<div class="tbox warn"><h4>Παγίδες</h4>
<p>Γενικά $E(X^2) \ne (E(X))^2$ και $E[g(X)] \ne g(E(X))$. Η μετατόπιση δεν αλλάζει τη διασπορά: $\mathrm{Var}(X + 3) = \mathrm{Var}(X)$.</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>x &lt;- 1:4; p &lt;- x / 10</code> · <code>sum(x * p)</code> → 3 ($E(X)$) · <code>sum(x^2 * p) - sum(x * p)^2</code> → 1 ($\mathrm{Var}(X)$) · <code>cumsum(p)</code> → 0.1 0.3 0.6 1.0 (τιμές της $F$).</p></div>`,
  widget: "psaRV",
  gen: "psaRV",
  exercises: [
    { level: 1, type: "fields", q: R`Η διακριτή τ.μ. $X$ έχει συνάρτηση μάζας πιθανότητας $p(x) = c\,x$ για $x = 1, 2, 3, 4$ (και $0$ αλλού). Να βρείτε τη σταθερά $c$ και την τιμή $F(2{,}5) = P(X \le 2{,}5)$.`,
      fields: [{ label: "c =", ans: "1/10", tol: 0.001 }, { label: "F(2,5) =", ans: "3/10", tol: 0.001 }],
      hint: R`$\sum p(x) = 1$.`, sol: R`$c(1 + 2 + 3 + 4) = 10c = 1 \Rightarrow c = \frac{1}{10}$. $F(2{,}5) = p(1) + p(2) = \frac{3}{10}$.` },
    { level: 1, type: "fields", q: R`Η τ.μ. $X$ έχει $p(x) = x/10$ για $x = 1, 2, 3, 4$. Να βρείτε τα $E(X)$, $E(X^2)$ και $\mathrm{Var}(X)$.`,
      fields: [{ label: "E(X) =", ans: 3 }, { label: "E(X²) =", ans: 10 }, { label: "Var(X) =", ans: 1 }],
      hint: R`$E(X) = \sum x^2/10$, $E(X^2) = \sum x^3/10$.`, sol: R`$E(X) = \frac{1 + 4 + 9 + 16}{10} = 3$, $E(X^2) = \frac{1 + 8 + 27 + 64}{10} = 10$, $\mathrm{Var}(X) = 10 - 9 = 1$.` },
    { level: 2, type: "fields", q: R`Ο υπολογιστής $A$ στέλνει πακέτα στον $\Gamma$ μέσω του $B$. Η αποστολή $A \to B$ διαρκεί $3$ ms με πιθανότητα $0{,}6$ και $6$ ms με $0{,}4$· η $B \to \Gamma$ διαρκεί $5$ ms με πιθανότητα $0{,}8$ και $9$ ms με $0{,}2$, ανεξάρτητα. Ποια είναι η μέση τιμή του συνολικού χρόνου $X$, και ποια η $P(X \le 11)$;`,
      fields: [{ label: "E(X) =", ans: 10 }, { label: "P(X ≤ 11) =", ans: 0.8 }],
      hint: R`Γραμμικότητα της μέσης τιμής· για την πιθανότητα, απαριθμήστε τους $4$ συνδυασμούς.`, sol: R`$E(X) = (0{,}6\cdot 3 + 0{,}4\cdot 6) + (0{,}8\cdot 5 + 0{,}2\cdot 9) = 4{,}2 + 5{,}8 = 10$ ms. Τιμές: $8$ $(0{,}48)$, $12$ $(0{,}12)$, $11$ $(0{,}32)$, $15$ $(0{,}08)$. $P(X \le 11) = 0{,}48 + 0{,}32 = 0{,}8$.` },
    { level: 2, type: "fields", q: R`Ένας αριθμός επιλέγεται τυχαία (ομοιόμορφα) από το σύνολο $\{1, 2, \dots, 10\}$. Να βρείτε τη μέση τιμή και τη διασπορά του.`,
      fields: [{ label: "E(X) =", ans: 5.5 }, { label: "Var(X) =", ans: 8.25 }],
      hint: R`$E(X) = \frac{n+1}{2}$, $E(X^2) = \frac{(n+1)(2n+1)}{6}$.`, sol: R`$E(X) = 5{,}5$. $E(X^2) = \frac{11\cdot 21}{6} = 38{,}5$, άρα $\mathrm{Var}(X) = 38{,}5 - 30{,}25 = 8{,}25 = \frac{n^2 - 1}{12}$.` },
    { level: 2, type: "fields", q: R`Σε ένα λαχείο κυκλοφορούν $40000$ λαχνοί. Ένας κερδίζει $50000$ €, ένας $20000$ €, ένας $5000$ € και τέσσερις από $500$ €. Κάποιος αγοράζει έναν λαχνό προς $3$ €. Ποιο είναι το αναμενόμενο καθαρό κέρδος του;`,
      fields: [{ label: "E(κέρδος) =", ans: -1.075 }],
      hint: R`$E(\text{έπαθλο}) = \frac{\text{σύνολο επάθλων}}{40000}$.`, sol: R`Σύνολο επάθλων $50000 + 20000 + 5000 + 4\cdot 500 = 77000$ €. $E(\text{έπαθλο}) = 77000/40000 = 1{,}925$ €, άρα $E(\text{κέρδος}) = 1{,}925 - 3 = -1{,}075$ €.` },
    { level: 1, type: "fields", q: R`Η $X$ παίρνει τις τιμές $0, 1, 2$ με πιθανότητες $0{,}25$, $0{,}5$, $0{,}25$. Αν $Y = 3X - 2$, να βρείτε τα $E(Y)$ και $\mathrm{Var}(Y)$.`,
      fields: [{ label: "E(Y) =", ans: 1 }, { label: "Var(Y) =", ans: 4.5 }],
      hint: R`Πρώτα $E(X)$ και $\mathrm{Var}(X)$.`, sol: R`$E(X) = 1$, $E(X^2) = 1{,}5$, $\mathrm{Var}(X) = 0{,}5$. Άρα $E(Y) = 1$ και $\mathrm{Var}(Y) = 9\cdot 0{,}5 = 4{,}5$.` },
    { level: 1, type: "mc", q: R`Ποια από τις παρακάτω είναι έγκυρη συνάρτηση μάζας πιθανότητας για τις τιμές $x = 1, 2, 3$;`,
      options: ["$p(1) = 0{,}2,\\ p(2) = 0{,}5,\\ p(3) = 0{,}3$", "$p(1) = 0{,}5,\\ p(2) = 0{,}5,\\ p(3) = 0{,}5$", "$p(1) = 0{,}6,\\ p(2) = 0{,}5,\\ p(3) = -0{,}1$", "$p(1) = 0{,}1,\\ p(2) = 0{,}2,\\ p(3) = 0{,}3$"], correct: 0,
      hint: R`Μη αρνητικές τιμές με άθροισμα $1$.`, sol: R`Μόνο η $0{,}2 + 0{,}5 + 0{,}3 = 1$ με όλες τις τιμές μη αρνητικές. Οι άλλες έχουν άθροισμα $1{,}5$ ή $0{,}6$, ή αρνητική τιμή.` },
    { level: 1, type: "mc", q: R`Για κάθε τ.μ. $X$ ισχύει $\mathrm{Var}(X + 3) = \mathrm{Var}(X) + 3$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`$\mathrm{Var}(aX + b) = a^2\mathrm{Var}(X)$.`, sol: R`Λάθος: $\mathrm{Var}(X + 3) = \mathrm{Var}(X)$· η μετατόπιση δεν αλλάζει τη διασπορά.` },
    { level: 1, type: "fields", q: R`Στην R δίνουμε <code>x &lt;- c(0, 1, 2, 3); p &lt;- c(0.1, 0.3, 0.4, 0.2)</code>. Τι επιστρέφουν οι <code>sum(x * p)</code> και <code>sum(x^2 * p) - sum(x * p)^2</code>;`,
      fields: [{ label: "1η =", ans: 1.7 }, { label: "2η =", ans: 0.81 }],
      hint: R`Μέση τιμή και διασπορά.`, sol: R`$E(X) = 0 + 0{,}3 + 0{,}8 + 0{,}6 = 1{,}7$. $E(X^2) = 0{,}3 + 1{,}6 + 1{,}8 = 3{,}7$, άρα $\mathrm{Var}(X) = 3{,}7 - 2{,}89 = 0{,}81$.` }
  ]
},
/* ───────────────────────────── 3.2 ───────────────────────────── */
{
  id: "3.2", unit: 3, title: "Κατανομές Bernoulli, διωνυμική και γεωμετρική",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Τυχαίες μεταβλητές (χρήσιμες διακριτές κατανομές)",
  theory: R`
<div class="tbox"><h4>Bernoulli και διωνυμική</h4>
<p>Δοκιμή με δύο αποτελέσματα, «επιτυχία» με πιθανότητα $p$: $X \sim$ Bernoulli$(p)$ με $p(x) = p^x(1 - p)^{1-x}$, $x = 0, 1$, $E(X) = p$, $\mathrm{Var}(X) = p(1-p)$.</p>
<p>$X$ = αριθμός επιτυχιών σε $n$ <b>ανεξάρτητες</b> δοκιμές Bernoulli: $X \sim b(n, p)$,</p>
$$P(X = x) = \binom{n}{x}p^x(1 - p)^{n-x},\ x = 0, 1, \dots, n,\qquad E(X) = np,\ \ \mathrm{Var}(X) = np(1-p).$$
<p>Αν $X \sim b(n_1, p)$, $Y \sim b(n_2, p)$ ανεξάρτητες, τότε $X + Y \sim b(n_1 + n_2, p)$.</p></div>
<div class="tbox"><h4>Γεωμετρική</h4>
<p>$X$ = αριθμός δοκιμών μέχρι (και) την <b>πρώτη επιτυχία</b>:</p>
$$P(X = x) = p(1-p)^{x-1},\ x = 1, 2, \dots,\qquad P(X > x) = (1-p)^x,\qquad E(X) = \frac1p,\ \ \mathrm{Var}(X) = \frac{1-p}{p^2}.$$
<p><b>Αμνήμονη ιδιότητα</b>: $P(X > k + x \mid X > k) = P(X > x)$.</p></div>
<div class="tbox warn"><h4>Πότε είναι διωνυμική;</h4>
<p>Σταθερό πλήθος $n$ δοκιμών, δύο αποτελέσματα, ίδια $p$, ανεξαρτησία. Δειγματοληψία <b>χωρίς επανάθεση</b> από μικρό πληθυσμό δεν είναι διωνυμική (υπεργεωμετρική, §3.3).</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>dbinom(3, 10, 0.2)</code> → 0.2013 · <code>pbinom(1, 10, 0.2)</code> → 0.3758 ($P(X \le 1)$) · <code>1 - pbinom(0, 10, 0.2)</code> → 0.8926. Προσοχή: η <code>dgeom(k, p)</code> της R μετρά τις <b>αποτυχίες</b> πριν την πρώτη επιτυχία, άρα $P(X = x) = $ <code>dgeom(x - 1, p)</code>· π.χ. <code>dgeom(2, 0.2)</code> → 0.128 $= P(X = 3)$.</p></div>`,
  widget: "psaDist",
  gen: "psaBin",
  exercises: [
    { level: 1, type: "fields", q: R`Ένα σύστημα διαβιβάζει κάθε μήνυμα επιτυχώς με πιθανότητα $0{,}3$, ανεξάρτητα. Αν στείλει $8$ μηνύματα, ποια η πιθανότητα να διαβιβαστούν επιτυχώς ακριβώς $2$, τουλάχιστον $1$, και το πολύ $1$; (4 δεκαδικά)`,
      fields: [{ label: "P(X = 2) =", ans: 0.2964754799999999, tol: 0.0005 }, { label: "P(X ≥ 1) =", ans: 0.94235199, tol: 0.0005 }, { label: "P(X ≤ 1) =", ans: 0.2552983299999999, tol: 0.0005 }],
      hint: R`$X \sim b(8, 0{,}3)$.`, sol: R`$P(X = 2) = \binom82(0{,}3)^2(0{,}7)^6 = 28\cdot 0{,}09\cdot 0{,}117649 \approx 0{,}2965$. $P(X \ge 1) = 1 - 0{,}7^8 \approx 0{,}9424$. $P(X \le 1) = 0{,}7^8 + 8\cdot 0{,}3\cdot 0{,}7^7 \approx 0{,}0576 + 0{,}1977 = 0{,}2553$.` },
    { level: 1, type: "fields", q: R`Αν $X \sim b(5,\ 0{,}4)$, να βρείτε την $P(X = 2)$ και τα $E(X)$, $\mathrm{Var}(X)$.`,
      fields: [{ label: "P(X = 2) =", ans: 0.3456, tol: 0.001 }, { label: "E(X) =", ans: 2 }, { label: "Var(X) =", ans: 1.2 }],
      hint: R`$\binom52 = 10$.`, sol: R`$P(X = 2) = 10\cdot 0{,}16\cdot 0{,}216 = 0{,}3456$, $E(X) = 2$, $\mathrm{Var}(X) = 5\cdot 0{,}4\cdot 0{,}6 = 1{,}2$.` },
    { level: 2, type: "fields", q: R`Ένα τεστ έχει $10$ ερωτήσεις πολλαπλής επιλογής με $4$ επιλογές η καθεμία. Ένας φοιτητής απαντά όλες στην τύχη. Ποια είναι η πιθανότητα να απαντήσει σωστά ακριβώς $3$; Ποιο είναι το αναμενόμενο πλήθος σωστών; (3 δεκαδικά)`,
      fields: [{ label: "P(X = 3) =", ans: 0.25028228759765625, tol: 0.001 }, { label: "E(X) =", ans: 2.5 }],
      hint: R`$X \sim b(10, 1/4)$.`, sol: R`$P(X = 3) = \binom{10}{3}(0{,}25)^3(0{,}75)^7 \approx 0{,}250$ και $E(X) = 2{,}5$.` },
    { level: 1, type: "fields", q: R`Η πιθανότητα επιτυχίας σε κάθε ανεξάρτητη προσπάθεια σύνδεσης είναι $p = 0{,}2$. Αν $X$ είναι ο αριθμός των προσπαθειών μέχρι και την πρώτη επιτυχία, να βρείτε τα $P(X = 3)$ και $E(X)$.`,
      fields: [{ label: "P(X = 3) =", ans: 0.128 }, { label: "E(X) =", ans: 5 }],
      hint: R`Γεωμετρική: $p(1-p)^{x-1}$.`, sol: R`$P(X = 3) = 0{,}2\cdot 0{,}8^2 = 0{,}128$ και $E(X) = 1/0{,}2 = 5$.` },
    { level: 2, type: "fields", q: R`Η πιθανότητα επιτυχίας σε κάθε ανεξάρτητη προσπάθεια είναι $p = 0{,}2$ ($X$ = αριθμός προσπαθειών μέχρι και την πρώτη επιτυχία). Ποια είναι η πιθανότητα να χρειαστούν περισσότερες από $4$ προσπάθειες; Αν οι πρώτες $4$ απέτυχαν, ποια η πιθανότητα να χρειαστούν περισσότερες από $6$ συνολικά;`,
      fields: [{ label: "P(X > 4) =", ans: 0.4096 }, { label: "P(X > 6 | X > 4) =", ans: 0.64 }],
      hint: R`$P(X > x) = (1-p)^x$ και αμνήμονη ιδιότητα.`, sol: R`$P(X > 4) = 0{,}8^4 = 0{,}4096$. $P(X > 6 \mid X > 4) = P(X > 2) = 0{,}8^2 = 0{,}64$.` },
    { level: 1, type: "mc", q: R`Ποια τ.μ. ακολουθεί διωνυμική κατανομή;`,
      options: ["Το πλήθος των εξαριών (ενδείξεων $6$) σε $8$ ανεξάρτητες ρίψεις ζαριού", "Το πλήθος των ρίψεων ζαριού μέχρι να εμφανιστεί $6$", "Το πλήθος των αγοριών σε επιτροπή $4$ ατόμων από τάξη $10$ αγοριών και $8$ κοριτσιών", "Ο χρόνος αναμονής σε μια στάση λεωφορείου"], correct: 0,
      hint: R`Σταθερό $n$, ανεξάρτητες δοκιμές, ίδια $p$.`, sol: R`Οι $8$ ρίψεις με «επιτυχία» το $6$ δίνουν $b(8, 1/6)$. Οι ρίψεις μέχρι να εμφανιστεί $6$ ακολουθούν γεωμετρική. Η επιτροπή επιλέγεται χωρίς επανάθεση, άρα υπεργεωμετρική. Ο χρόνος αναμονής είναι συνεχής τ.μ.` },
    { level: 2, type: "mc", q: R`Αν $X \sim b(n_1, p)$ και $Y \sim b(n_2, p)$ είναι ανεξάρτητες, τότε $X + Y \sim b(n_1 + n_2, p)$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Πλήθος επιτυχιών σε $n_1 + n_2$ ανεξάρτητες δοκιμές.`, sol: R`Σωστό: η $X + Y$ μετρά τις επιτυχίες σε $n_1 + n_2$ ανεξάρτητες δοκιμές με την ίδια $p$. (Χρειάζεται <b>ίδιο</b> $p$ και ανεξαρτησία.)` },
    { level: 1, type: "fields", q: R`Στην R, τι επιστρέφουν (4 δεκαδικά) οι εντολές <code>dbinom(3, 10, 0.2)</code> και <code>dgeom(2, 0.2)</code>;`,
      fields: [{ label: "dbinom =", ans: 0.2013265920000001, tol: 0.0005 }, { label: "dgeom =", ans: 0.128, tol: 0.0005 }],
      hint: R`Η <code>dgeom(k, p)</code> δίνει $p(1-p)^k$ (μετρά αποτυχίες).`, sol: R`$\binom{10}{3}(0{,}2)^3(0{,}8)^7 \approx 0{,}2013$ και $0{,}2\cdot 0{,}8^2 = 0{,}128$ — δηλαδή $P(X = 3)$ για τη γεωμετρική των σημειώσεων.` },
    { level: 3, type: "fields", q: R`Το $5\%$ των προϊόντων μιας γραμμής παραγωγής είναι ελαττωματικά, ανεξάρτητα μεταξύ τους. Ένα κιβώτιο περιέχει $20$ προϊόντα. Ποια είναι η πιθανότητα να περιέχει το πολύ $1$ ελαττωματικό; (3 δεκαδικά)`,
      fields: [{ label: "P(X ≤ 1) =", ans: 0.7358395249438492, tol: 0.001 }],
      hint: R`$X \sim b(20, 0{,}05)$.`, sol: R`$P(X \le 1) = 0{,}95^{20} + 20\cdot 0{,}05\cdot 0{,}95^{19} \approx 0{,}3585 + 0{,}3774 = 0{,}736$.` }
  ]
},
/* ───────────────────────────── 3.3 ───────────────────────────── */
{
  id: "3.3", unit: 3, title: "Κατανομή Poisson – Υπεργεωμετρική κατανομή",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Τυχαίες μεταβλητές (κατανομή Poisson) · Φυλλάδιο ασκήσεων 5",
  theory: R`
<div class="tbox"><h4>Κατανομή Poisson</h4>
<p>$X \sim$ Poisson$(\lambda)$, $\lambda > 0$:</p>
$$P(X = x) = \frac{e^{-\lambda}\lambda^x}{x!},\ x = 0, 1, 2, \dots,\qquad E(X) = \mathrm{Var}(X) = \lambda.$$
<p>Παραδείγματα: τυπογραφικά λάθη ανά σελίδα, κλήσεις σε λάθος αριθμό, μη εξουσιοδοτημένες προσπάθειες πρόσβασης σε ένα διάστημα, εκπομπές σωματιδίων. Αν $X \sim$ Poisson$(\lambda_1)$, $Y \sim$ Poisson$(\lambda_2)$ ανεξάρτητες, τότε $X + Y \sim$ Poisson$(\lambda_1 + \lambda_2)$.</p></div>
<div class="tbox"><h4>Προσέγγιση της διωνυμικής</h4>
<p>Αν $X \sim b(n, p)$ με $n$ μεγάλο, $p$ μικρό και $\lambda = np$ μέτριο, τότε $P(X = x) \approx \frac{e^{-\lambda}\lambda^x}{x!}$ (επειδή $(1 - \lambda/n)^n \to e^{-\lambda}$). Επίσης, αν ρίξουμε $n$ σφαιρίδια σε $k$ δοχεία, το πλήθος σε ένα δοχείο είναι περίπου Poisson$(n/k)$ για μεγάλο $k$ (ακριβώς είναι $b(n, 1/k)$).</p></div>
<div class="tbox"><h4>Υπεργεωμετρική (δειγματοληψία χωρίς επανάθεση)</h4>
<p>Πληθυσμός $N$ με $K$ «ειδικά» στοιχεία, δείγμα $n$ χωρίς επανάθεση, $X$ = πλήθος ειδικών:</p>
$$P(X = k) = \frac{\binom{K}{k}\binom{N-K}{n-k}}{\binom{N}{n}},\qquad E(X) = n\frac{K}{N},\qquad \mathrm{Var}(X) = n\frac KN\Big(1 - \frac KN\Big)\frac{N - n}{N - 1}.$$</div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>dpois(0, 2.1)</code> → 0.1225 · <code>1 - ppois(1, 1.6)</code> → 0.4751 ($P(X \ge 2)$) · <code>dhyper(1, 5, 15, 4)</code> → 0.4696 ($1$ ελαττωματικό σε δείγμα $4$ από $5$ ελαττωματικά και $15$ καλά).</p></div>`,
  widget: "psaDist",
  gen: "psaPois",
  exercises: [
    { level: 1, type: "fields", q: R`Από μακροχρόνιες παρατηρήσεις, ο αριθμός των μη εξουσιοδοτημένων προσπαθειών πρόσβασης σε έναν διακομιστή σε μία ημέρα ακολουθεί Poisson με μέση τιμή $1{,}8$. Ποια η πιθανότητα να υπάρξει τουλάχιστον μία τέτοια προσπάθεια σε μία ημέρα; (4 δεκαδικά)`,
      fields: [{ label: "P(X ≥ 1) =", ans: 0.8347011117784134, tol: 0.0005 }],
      hint: R`$1 - P(X = 0)$.`, sol: R`$P(X \ge 1) = 1 - e^{-1{,}8} \approx 1 - 0{,}1653 = 0{,}8347$.` },
    { level: 2, type: "fields", q: R`Η πιθανότητα ένα email να είναι μολυσμένο είναι $0{,}015$, ανεξάρτητα. Ένας χρήστης λαμβάνει $100$ email. Με προσέγγιση Poisson, ποια είναι η παράμετρος $\lambda$ και η πιθανότητα να υπάρχουν τουλάχιστον $2$ μολυσμένα; (4 δεκαδικά)`,
      fields: [{ label: "λ =", ans: 1.5 }, { label: "P(X ≥ 2) ≈", ans: 0.44217459962892547, tol: 0.0005 }],
      hint: R`$\lambda = np$· $P(X \ge 2) = 1 - e^{-\lambda}(1 + \lambda)$.`, sol: R`$\lambda = 100\cdot 0{,}015 = 1{,}5$ και $P(X \ge 2) \approx 1 - e^{-1{,}5}(1 + 1{,}5) = 1 - 2{,}5e^{-1{,}5} \approx 0{,}4422$.` },
    { level: 1, type: "fields", q: R`Αν $X \sim$ Poisson$(3)$, να βρείτε τις $P(X = 0)$ και $P(X = 2)$. (4 δεκαδικά)`,
      fields: [{ label: "P(X = 0) =", ans: Math.exp(-3), tol: 0.0005 }, { label: "P(X = 2) =", ans: 4.5 * Math.exp(-3), tol: 0.0005 }],
      hint: R`$e^{-3} \approx 0{,}0498$.`, sol: R`$P(X = 0) = e^{-3} \approx 0{,}0498$ και $P(X = 2) = e^{-3}\frac{9}{2} \approx 0{,}2240$.` },
    { level: 1, type: "fields", q: R`Σε ένα τηλεφωνικό κέντρο έρχονται κατά μέσο όρο $2$ κλήσεις την ώρα (κατανομή Poisson). Ποια είναι η παράμετρος $\lambda$ για ένα διάστημα $30$ λεπτών, και ποια η πιθανότητα να έρθει ακριβώς $1$ κλήση σε αυτό; (3 δεκαδικά)`,
      fields: [{ label: "λ =", ans: 1 }, { label: "P(X = 1) =", ans: Math.exp(-1), tol: 0.001 }],
      hint: R`Το $\lambda$ είναι ανάλογο του χρόνου.`, sol: R`$\lambda = 2\cdot\frac12 = 1$ και $P(X = 1) = e^{-1} \approx 0{,}368$.` },
    { level: 2, type: "fields", q: R`Ένα δοχείο περιέχει $4$ κόκκινες και $6$ άσπρες μπάλες. Παίρνουμε τυχαία $3$ χωρίς επανάθεση και $X$ είναι το πλήθος των κόκκινων. Να βρείτε τη μέση τιμή, τη διασπορά και την τυπική απόκλιση της $X$. (4 δεκαδικά)`,
      fields: [{ label: "E(X) =", ans: 1.2 }, { label: "Var(X) =", ans: 0.56, tol: 0.0005 }, { label: "σ =", ans: 0.7483314773547883, tol: 0.0005 }],
      hint: R`Υπεργεωμετρική με $N = 10$, $K = 4$, $n = 3$.`, sol: R`$E(X) = 3\cdot\frac{4}{10} = 1{,}2$. $\mathrm{Var}(X) = 3\cdot 0{,}4\cdot 0{,}6\cdot\frac{7}{9} = 0{,}56$, $\sigma = \sqrt{0{,}56} \approx 0{,}7483$. (Επαλήθευση με τη συνάρτηση μάζας: $p(0) = \frac{20}{120}$, $p(1) = \frac{60}{120}$, $p(2) = \frac{36}{120}$, $p(3) = \frac{4}{120}$.)` },
    { level: 2, type: "fields", q: R`Μια παρτίδα $20$ προϊόντων περιέχει $5$ ελαττωματικά. Παίρνουμε τυχαία $4$ χωρίς επανάθεση. Ποια είναι η πιθανότητα να είναι ακριβώς $1$ ελαττωματικό, και ποιο είναι το αναμενόμενο πλήθος ελαττωματικών;`,
      fields: [{ label: "P(X = 1) =", ans: "455/969", tol: 0.001 }, { label: "E(X) =", ans: 1 }],
      hint: R`Υπεργεωμετρική με $N = 20$, $K = 5$, $n = 4$.`, sol: R`$P(X = 1) = \frac{\binom51\binom{15}{3}}{\binom{20}{4}} = \frac{5\cdot 455}{4845} = \frac{455}{969} \approx 0{,}470$. $E(X) = 4\cdot\frac{5}{20} = 1$.` },
    { level: 1, type: "mc", q: R`Μια διακριτή τ.μ. που μετρά γεγονότα σε ένα χρονικό διάστημα έχει $E(X) = 4$ και $\mathrm{Var}(X) = 4$. Ποια κατανομή είναι πιο φυσικό να υποθέσουμε;`,
      options: ["Poisson με $\\lambda = 4$", "Διωνυμική $b(8, 0{,}5)$", "Γεωμετρική με $p = 1/4$", "Bernoulli με $p = 4$"], correct: 0,
      hint: R`Ποια κατανομή έχει μέση τιμή ίση με τη διασπορά;`, sol: R`Η Poisson έχει $E(X) = \mathrm{Var}(X) = \lambda$. Η $b(8, 0{,}5)$ έχει διασπορά $2$, η γεωμετρική με $p = 1/4$ έχει διασπορά $12$, και ένα $p = 4$ δεν είναι πιθανότητα.` },
    { level: 1, type: "fields", q: R`Στην R, τι επιστρέφουν (4 δεκαδικά) οι <code>dpois(0, 2.1)</code> και <code>1 - ppois(1, 1.6)</code>;`,
      fields: [{ label: "dpois(0, 2.1) =", ans: 0.1224564282529819, tol: 0.0005 }, { label: "1 - ppois(1, 1.6) =", ans: 0.47506905321389603, tol: 0.0005 }],
      hint: R`Η <code>ppois(k, λ)</code> δίνει $P(X \le k)$.`, sol: R`$e^{-2{,}1} \approx 0{,}1225$ και $1 - P(X \le 1) = 1 - e^{-1{,}6}(1 + 1{,}6) \approx 0{,}4751$.` },
    { level: 3, type: "fields", q: R`Τα τυπογραφικά λάθη σε ένα βιβλίο ακολουθούν κατανομή Poisson με μέσο όρο $0{,}5$ λάθη ανά σελίδα, ανεξάρτητα από σελίδα σε σελίδα. Ποια είναι η πιθανότητα σε $4$ σελίδες να μην υπάρχει κανένα λάθος; Ποια η πιθανότητα να υπάρχουν τουλάχιστον $2$; (3 δεκαδικά)`,
      fields: [{ label: "P(κανένα) =", ans: Math.exp(-2), tol: 0.001 }, { label: "P(≥ 2) =", ans: 1 - 3 * Math.exp(-2), tol: 0.001 }],
      hint: R`Άθροισμα ανεξάρτητων Poisson: για $4$ σελίδες $\lambda = 2$.`, sol: R`$\lambda = 4\cdot 0{,}5 = 2$. $P(X = 0) = e^{-2} \approx 0{,}135$ και $P(X \ge 2) = 1 - 3e^{-2} \approx 0{,}594$.` }
  ]
},
/* ───────────────────────────── 3.4 ───────────────────────────── */
{
  id: "3.4", unit: 3, title: "Συνεχείς τυχαίες μεταβλητές",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Τυχαίες μεταβλητές (συνάρτηση πυκνότητας) · Φυλλάδιο ασκήσεων 5",
  theory: R`
<div class="tbox"><h4>Συνάρτηση πυκνότητας</h4>
<p>Η $X$ είναι <b>συνεχής</b> αν υπάρχει $f_X \ge 0$ με $\int_{-\infty}^\infty f_X(x)\,dx = 1$ ώστε $F_X(x) = \int_{-\infty}^x f_X(u)\,du$ για κάθε $x$. Τότε $P(a \le X \le b) = \int_a^b f(x)\,dx$, $P(X = x) = 0$ για κάθε $x$ (!) και $F'(x) = f(x)$ όπου η $f$ είναι συνεχής.</p></div>
<div class="tbox"><h4>Μέση τιμή και διασπορά</h4>
<p>$E(X) = \int x f(x)\,dx$ (αν $\int |x| f(x)\,dx \lt \infty$), $\ E[g(X)] = \int g(x) f(x)\,dx$, $\ \mathrm{Var}(X) = E(X^2) - (E(X))^2$. Το <b>$p$-ποσοστιαίο σημείο</b> $x_p$ ορίζεται από $F(x_p) = p$· για $p = 0{,}5$ η <b>διάμεσος</b>.</p></div>
<div class="tbox warn"><h4>Παράδειγμα και παγίδες</h4>
<p>Αν $f(x) = cx$ στο $[0, 2]$: $2c = 1 \Rightarrow c = \frac12$, $E(X) = \frac43$, $E(X^2) = 2$, $\mathrm{Var}(X) = \frac29$. Η τιμή $f(x)$ <b>δεν</b> είναι πιθανότητα και μπορεί να ξεπερνά το $1$· πιθανότητα δίνει μόνο το εμβαδόν.</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>f &lt;- function(x) x^2 / 9</code> · <code>integrate(f, 1, 2)</code> → 0.2592593 with absolute error &lt; 2.9e-15 ($= 7/27$· το <code>integrate(f, 1, 2)$value</code> δίνει μόνο τον αριθμό) · <code>integrate(function(x) x * f(x), 0, 3)</code> → 2.25 ($E(X)$).</p></div>`,
  widget: "psbpdf",
  gen: "psbcont",
  exercises: [
    { level: 1, type: "fields", q: R`Η $X$ έχει πυκνότητα $f(x) = c\,x^2$ για $0 \le x \le 3$ και $0$ αλλού. Να βρείτε τη σταθερά $c$ και την $P(1 \le X \le 2)$.`,
      fields: [{ label: "c =", ans: "1/9", tol: 0.001 }, { label: "P(1 ≤ X ≤ 2) =", ans: "7/27", tol: 0.001 }],
      hint: R`$\int_0^3 cx^2\,dx = 9c$.`, sol: R`$9c = 1 \Rightarrow c = \frac19$. $P(1 \le X \le 2) = \int_1^2 \frac{x^2}{9}dx = \frac{8 - 1}{27} = \frac{7}{27}$.` },
    { level: 2, type: "fields", q: R`Ο χρόνος $X$ (σε ms) για τη μεταφορά ενός αρχείου έχει πυκνότητα $f(x) = \frac{2 - |2 - x|}{4}$ για $0 \le x \le 4$ (τριγωνική). Να βρείτε την $P(X \le 1)$, τη μέση τιμή και τη διασπορά της $X$.`,
      fields: [{ label: "P(X ≤ 1) =", ans: "1/8", tol: 0.001 }, { label: "E(X) =", ans: 2 }, { label: "Var(X) =", ans: "2/3", tol: 0.001 }],
      hint: R`Στο $[0, 2]$ είναι $f(x) = x/4$· η $f$ είναι συμμετρική γύρω από το $2$.`, sol: R`$P(X \le 1) = \int_0^1 \frac x4 dx = \frac18$. Συμμετρία: $E(X) = 2$. $E\big[(X - 2)^2\big] = 2\int_0^2 (x - 2)^2\frac x4\,dx = \frac12\int_0^2 (x^3 - 4x^2 + 4x)dx = \frac12\left(4 - \frac{32}{3} + 8\right) = \frac23$.` },
    { level: 1, type: "fields", q: R`Η $X$ έχει πυκνότητα $f(x) = \frac{x}{2}$, $0 \le x \le 2$. Να υπολογίσετε τα $E(X)$ και $\mathrm{Var}(X)$.`,
      fields: [{ label: "E(X) =", ans: "4/3", tol: 0.001 }, { label: "Var(X) =", ans: "2/9", tol: 0.001 }],
      hint: R`$E(X^2) = \int_0^2 x^2\cdot\frac x2\,dx$.`, sol: R`$E(X) = \frac43$, $E(X^2) = 2$, άρα $\mathrm{Var}(X) = 2 - \frac{16}{9} = \frac29$.` },
    { level: 1, type: "mc", q: R`Ποια από τις παρακάτω συναρτήσεις (ίση με $0$ εκτός του διαστήματος που δίνεται) είναι συνάρτηση πυκνότητας;`,
      options: ["$f(x) = 3x^2,\\ 0 \\le x \\le 1$", "$f(x) = 2x,\\ 0 \\le x \\le 2$", "$f(x) = x - 1,\\ 0 \\le x \\le 2$", "$f(x) = \\frac12,\\ 0 \\le x \\le 3$"], correct: 0,
      hint: R`Χρειάζεται $f \ge 0$ και ολοκλήρωμα $1$.`, sol: R`$\int_0^1 3x^2dx = 1$ και $3x^2 \ge 0$. Η $2x$ στο $[0, 2]$ έχει ολοκλήρωμα $4$, η $\frac12$ στο $[0, 3]$ έχει $\frac32$, και η $x - 1$ παίρνει αρνητικές τιμές (και επιπλέον ολοκλήρωμα $0 \ne 1$).` },
    { level: 2, type: "fields", q: R`Η συνάρτηση κατανομής της $X$ είναι $F(x) = 0$ για $x \lt 0$, $F(x) = x^2$ για $0 \le x \le 1$ και $F(x) = 1$ για $x > 1$. Να υπολογίσετε την $P(0{,}5 \lt X \le 0{,}8)$ και τη διάμεσο $m$ (4 δεκαδικά).`,
      fields: [{ label: "P =", ans: 0.39, tol: 0.0006 }, { label: "m =", ans: 0.7071, tol: 0.0006 }],
      hint: R`$P(a \lt X \le b) = F(b) - F(a)$, και $F(m) = \frac12$.`, sol: R`$P = 0{,}64 - 0{,}25 = 0{,}39$. $m^2 = \frac12 \Rightarrow m = \frac{1}{\sqrt2} \approx 0{,}7071$. (Η πυκνότητα είναι $f(x) = F'(x) = 2x$ στο $[0, 1]$.)` },
    { level: 1, type: "mc", q: R`Για μια συνεχή τυχαία μεταβλητή $X$ ισχύει $P(X \le a) = P(X \lt a)$ για κάθε $a$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Πόσο είναι το $P(X = a)$;`, sol: R`Σωστό: για συνεχή $X$ είναι $P(X = a) = 0$, άρα η ισότητα στο άκρο δεν αλλάζει την πιθανότητα.` },
    { level: 2, type: "mc", q: R`Μια συνάρτηση πυκνότητας δεν μπορεί να πάρει τιμή μεγαλύτερη του $1$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Ομοιόμορφη σε μικρό διάστημα.`, sol: R`Λάθος: η $f(x) = 4$ για $0 \le x \le \frac14$ είναι πυκνότητα (εμβαδόν $1$) και παίρνει την τιμή $4$.` },
    { level: 1, type: "fields", q: R`Στην R ορίζουμε <code>f &lt;- function(x) 3 * x^2</code>. Ποιες τιμές (4 δεκαδικά) δίνουν οι <code>integrate(f, 0, 0.5)$value</code> και <code>integrate(function(x) x * f(x), 0, 1)$value</code>;`,
      fields: [{ label: "1η =", ans: 0.125, tol: 0.0005 }, { label: "2η =", ans: 0.75, tol: 0.0005 }],
      hint: R`$P(X \le 0{,}5)$ και $E(X)$ για $f(x) = 3x^2$ στο $[0, 1]$.`, sol: R`$\int_0^{0{,}5} 3x^2dx = 0{,}5^3 = 0{,}125$ και $\int_0^1 3x^3dx = \frac34 = 0{,}75$.` },
    { level: 3, type: "fields", q: R`Η $X$ έχει πυκνότητα $f(x) = \frac34(1 - x^2)$ για $-1 \le x \le 1$. Να υπολογίσετε τη διασπορά $\mathrm{Var}(X)$ και την $P\!\left(X > \frac12\right)$.`,
      fields: [{ label: "Var(X) =", ans: "1/5", tol: 0.001 }, { label: "P(X > 1/2) =", ans: "5/32", tol: 0.001 }],
      hint: R`Η $f$ είναι άρτια: $E(X) = 0$.`, sol: R`$E(X) = 0$, $E(X^2) = \frac34\left(\frac23 - \frac25\right) = \frac15$. $P(X > \frac12) = \frac34\left[x - \frac{x^3}{3}\right]_{1/2}^{1} = \frac34\cdot\frac{5}{24} = \frac{5}{32}$.` }
  ]
},
/* ───────────────────────────── 3.5 ───────────────────────────── */
{
  id: "3.5", unit: 3, title: "Ομοιόμορφη και εκθετική κατανομή",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Τυχαίες μεταβλητές (χρήσιμες συνεχείς κατανομές)",
  theory: R`
<div class="tbox"><h4>Ομοιόμορφη $U(a, b)$</h4>
<p>$f(x) = \frac{1}{b - a}$ και $F(x) = \frac{x - a}{b - a}$ για $x \in (a, b)$. Η πιθανότητα υποδιαστήματος είναι ανάλογη του μήκους του. $E(X) = \frac{a + b}{2}$, $\mathrm{Var}(X) = \frac{(b - a)^2}{12}$.</p></div>
<div class="tbox"><h4>Εκθετική με παράμετρο $\lambda > 0$</h4>
<p>$X \sim \mathcal E(\lambda)$ ($\lambda > 0$): $f(x) = \lambda e^{-\lambda x}$, $F(x) = 1 - e^{-\lambda x}$ για $x > 0$, και <b>συνάρτηση επιβίωσης</b> $P(X > x) = e^{-\lambda x}$. $E(X) = \frac1\lambda$, $\mathrm{Var}(X) = \frac1{\lambda^2}$. (Οι σημειώσεις γράφουν $X \sim \mathcal E(\lambda)$· εδώ γράφουμε $\mathcal E(\lambda)$ για να μη συγχέεται με τη μέση τιμή.) Περιγράφει χρόνους μέχρι να συμβεί ένα γεγονός (σεισμός, βλάβη, λανθασμένο μήνυμα).</p></div>
<div class="tbox tip"><h4>Αμνήμονη ιδιότητα</h4>
$$P(X > s + t \mid X > t) = \frac{e^{-\lambda(s+t)}}{e^{-\lambda t}} = e^{-\lambda s} = P(X > s).$$
<p>Ισχύει και το αντίστροφο: η μόνη συνεχής κατανομή με αυτή την ιδιότητα είναι η εκθετική.</p></div>
<div class="tbox warn"><h4>Παράδειγμα</h4>
<p>Αν ο χρόνος αποκατάστασης ενός μολυσμένου υπολογιστή είναι εκθετικός με $\lambda = 0{,}12$ (ώρες), τότε $P(X > 2) = e^{-0{,}24} \approx 0{,}787$ και $P(X > 2 \mid X > 1{,}5) = P(X > 0{,}5) = e^{-0{,}06} \approx 0{,}942$.</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>punif(25, 0, 40) - punif(20, 0, 40)</code> → 0.125 · <code>pexp(2, rate = 0.12, lower.tail = FALSE)</code> → 0.7866 · <code>qexp(0.5, rate = 0.5)</code> → 1.3863 (διάμεσος) · <code>mean(rexp(1e5, 0.25))</code> ≈ 4.</p></div>`,
  widget: "psbue",
  gen: "psbue",
  exercises: [
    { level: 1, type: "fields", q: R`Αν $X \sim U(2, 10)$, να υπολογίσετε την $P(3 \lt X \lt 7)$, τη μέση τιμή και τη διασπορά της $X$.`,
      fields: [{ label: "P =", ans: "1/2", tol: 0.001 }, { label: "E(X) =", ans: 6 }, { label: "Var(X) =", ans: "16/3", tol: 0.001 }],
      hint: R`$f(x) = \frac18$ στο $(2, 10)$.`, sol: R`$P = \frac{4}{8} = \frac12$, $E(X) = 6$, $\mathrm{Var}(X) = \frac{64}{12} = \frac{16}{3}$.` },
    { level: 2, type: "fields", q: R`Τα τρένα περνούν από μια στάση κάθε $15$ λεπτά, ξεκινώντας στις $7{:}00$. Ένας επιβάτης φτάνει σε χρόνο ομοιόμορφα κατανεμημένο μεταξύ $7{:}00$ και $7{:}30$. Ποια η πιθανότητα να περιμένει λιγότερο από $5$ λεπτά, και ποια περισσότερο από $10$ λεπτά;`,
      fields: [{ label: "P(< 5) =", ans: "1/3", tol: 0.001 }, { label: "P(> 10) =", ans: "1/3", tol: 0.001 }],
      hint: R`$X \sim U(0, 30)$· περιμένει λιγότερο από $5$ αν φτάσει στα $(10, 15)$ ή $(25, 30)$.`, sol: R`$P(\lt 5) = \frac{5 + 5}{30} = \frac13$. Περισσότερο από $10$: φτάνει στα $(0, 5)$ ή $(15, 20)$, άρα $\frac{10}{30} = \frac13$.` },
    { level: 1, type: "fields", q: R`Ο χρόνος (σε ώρες) για την αποκατάσταση ενός διακομιστή είναι εκθετικός με $\lambda = 0{,}25$. Ποια η πιθανότητα να χρειαστούν περισσότερες από $3$ ώρες; Αν η αποκατάσταση διαρκεί ήδη $2$ ώρες, ποια η πιθανότητα να χρειαστούν συνολικά περισσότερες από $5$; (4 δεκαδικά)`,
      fields: [{ label: "P(X > 3) =", ans: 0.4723665527410147, tol: 0.0005 }, { label: "P(X > 5 | X > 2) =", ans: 0.4723665527410147, tol: 0.0005 }],
      hint: R`Συνάρτηση επιβίωσης και αμνήμονη ιδιότητα.`, sol: R`$P(X > 3) = e^{-0{,}75} \approx 0{,}4724$ και $P(X > 5 \mid X > 2) = P(X > 3) = e^{-0{,}75} \approx 0{,}4724$ — οι $2$ ώρες που πέρασαν δεν παίζουν ρόλο.` },
    { level: 1, type: "fields", q: R`Ο χρόνος ζωής $X$ (σε έτη) μιας συσκευής είναι εκθετικός με μέση τιμή $5$ έτη. Να υπολογίσετε (4 δεκαδικά) τις πιθανότητες $P(X > 8)$ και $P(X \le 2)$.`,
      fields: [{ label: "P(X > 8) =", ans: 0.2019, tol: 0.0006 }, { label: "P(X ≤ 2) =", ans: 0.3297, tol: 0.0006 }],
      hint: R`$\lambda = \frac15$.`, sol: R`$P(X > 8) = e^{-1{,}6} \approx 0{,}2019$, $P(X \le 2) = 1 - e^{-0{,}4} \approx 0{,}3297$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τη διάμεσο της εκθετικής κατανομής με $\lambda = 0{,}5$ (4 δεκαδικά).`,
      fields: [{ label: "m =", ans: 1.3863, tol: 0.0006 / Math.max(1, 1.3863) }], hint: R`$1 - e^{-\lambda m} = \frac12$.`,
      sol: R`$m = \frac{\ln 2}{0{,}5} = 2\ln 2 \approx 1{,}3863$ (ενώ $E(X) = 2$).` },
    { level: 1, type: "mc", q: R`Αν η $X$ είναι εκθετική με παράμετρο $\lambda$, τότε $E(X) = \lambda$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Τι εκφράζει το $\lambda$;`, sol: R`Λάθος: $E(X) = \frac{1}{\lambda}$. Το $\lambda$ είναι <b>ρυθμός</b> (γεγονότα ανά μονάδα χρόνου).` },
    { level: 2, type: "mc", q: R`Ποια συνεχής κατανομή έχει την αμνήμονη ιδιότητα $P(X > s + t \mid X > t) = P(X > s)$ για κάθε $s, t \ge 0$;`,
      options: ["Η εκθετική", "Η ομοιόμορφη", "Η κανονική", "Καμία συνεχής κατανομή"], correct: 0, hint: R`$e^{-\lambda(s+t)} = e^{-\lambda s}e^{-\lambda t}$.`,
      sol: R`Μόνο η εκθετική. Για την ομοιόμορφη $U(0, 10)$, π.χ., $P(X > 8 \mid X > 5) = \frac25 \ne P(X > 3) = \frac{7}{10}$.` },
    { level: 1, type: "fields", q: R`Στην R, τι επιστρέφουν (4 δεκαδικά) οι <code>pexp(2, rate = 0.12, lower.tail = FALSE)</code> και <code>punif(25, 0, 40) - punif(20, 0, 40)</code>;`,
      fields: [{ label: "1η =", ans: 0.7866278610665535, tol: 0.0005 }, { label: "2η =", ans: 0.125, tol: 0.0005 }],
      hint: R`Η <code>lower.tail = FALSE</code> δίνει $P(X > x)$.`, sol: R`$P(X > 2) = e^{-0{,}24} \approx 0{,}7866$ και $\frac{25 - 20}{40} = 0{,}125$.` },
    { level: 3, type: "fields", q: R`Αν $X \sim U(0, \theta)$ και $\mathrm{Var}(X) = 3$, να βρείτε το $\theta$ και την $P(X > 4)$.`,
      fields: [{ label: "θ =", ans: 6 }, { label: "P(X > 4) =", ans: "1/3", tol: 0.001 }], hint: R`$\mathrm{Var}(X) = \frac{\theta^2}{12}$.`,
      sol: R`$\frac{\theta^2}{12} = 3 \Rightarrow \theta = 6$. $P(X > 4) = \frac{2}{6} = \frac13$.` }
  ]
},
/* ───────────────────────────── 3.6 ───────────────────────────── */
{
  id: "3.6", unit: 3, title: "Κανονική κατανομή",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Τυχαίες μεταβλητές (κανονική κατανομή)",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>$X \sim N(\mu, \sigma^2)$ αν
$$f(x) = \frac{1}{\sigma\sqrt{2\pi}}\exp\left\{-\frac{(x - \mu)^2}{2\sigma^2}\right\},\quad -\infty \lt x \lt \infty.$$
$E(X) = \mu$, $\mathrm{Var}(X) = \sigma^2$. Η $N(0, 1)$ είναι η <b>τυποποιημένη κανονική</b>, με πυκνότητα $\varphi(x)$ και συνάρτηση κατανομής $\Phi(x) = \int_{-\infty}^x \varphi(u)\,du$, που υπολογίζεται με πίνακες ή υπολογιστή.</p></div>
<div class="tbox"><h4>Τυποποίηση</h4>
<p>Αν $X \sim N(\mu, \sigma^2)$, τότε $Z = \frac{X - \mu}{\sigma} \sim N(0, 1)$ και $P(a \lt X \lt b) = \Phi\!\left(\frac{b - \mu}{\sigma}\right) - \Phi\!\left(\frac{a - \mu}{\sigma}\right)$. Συμμετρία: $\Phi(-z) = 1 - \Phi(z)$, $P(|Z| \lt z) = 2\Phi(z) - 1$. Επίσης, για $a \ne 0$: $aX + b \sim N(a\mu + b, a^2\sigma^2)$.</p></div>
<div class="tbox tip"><h4>Χρήσιμες τιμές</h4>
<p>$P(|X - \mu| \lt \sigma) \approx 0{,}683$, $P(|X - \mu| \lt 2\sigma) \approx 0{,}954$, $P(|X - \mu| \lt 3\sigma) \approx 0{,}997$. Με $z_\alpha$ συμβολίζουμε το <b>άνω</b> $\alpha$-σημείο: $P(Z > z_\alpha) = \alpha$, π.χ. $z_{0{,}05} = 1{,}645$, $z_{0{,}025} = 1{,}96$, $z_{0{,}01} = 2{,}326$.</p></div>
<div class="tbox warn"><h4>Παγίδα</h4>
<p>Στο $N(\mu, \sigma^2)$ η δεύτερη παράμετρος είναι η <b>διασπορά</b>: $N(170, 36)$ σημαίνει $\sigma = 6$. (Στην R όμως η <code>pnorm</code> παίρνει την τυπική απόκλιση!)</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>pnorm(1.25)</code> → 0.8944 · <code>pnorm(85, mean = 70, sd = 10)</code> → 0.9332 · <code>qnorm(0.95)</code> → 1.6449 · <code>qnorm(0.95, 170, 6)</code> → 179.87.</p></div>`,
  widget: "psbnorm",
  gen: "psbnorm",
  exercises: [
    { level: 1, type: "fields", q: R`Αν $Z \sim N(0, 1)$ και $\Phi(1{,}25) = 0{,}8944$, να υπολογίσετε τις $P(Z > 1{,}25)$ και $P(-1{,}25 \lt Z \lt 1{,}25)$.`,
      fields: [{ label: "P(Z > 1,25) =", ans: 0.1056, tol: 0.0006 }, { label: "P(|Z| < 1,25) =", ans: 0.7888, tol: 0.0006 }],
      hint: R`$P(|Z| \lt z) = 2\Phi(z) - 1$.`, sol: R`$1 - 0{,}8944 = 0{,}1056$ και $2\cdot 0{,}8944 - 1 = 0{,}7888$.` },
    { level: 1, type: "fields", q: R`Αν $X \sim N(70, 10^2)$, να υπολογίσετε τις $P(X \lt 85)$ και $P(60 \lt X \lt 85)$. Δίνονται $\Phi(1{,}5) = 0{,}9332$ και $\Phi(1) = 0{,}8413$.`,
      fields: [{ label: "P(X < 85) =", ans: 0.9332, tol: 0.0006 }, { label: "P(60 < X < 85) =", ans: 0.7745, tol: 0.0006 }],
      hint: R`$z = \frac{85 - 70}{10}$ και $\frac{60 - 70}{10}$.`, sol: R`$\Phi(1{,}5) = 0{,}9332$. $\Phi(1{,}5) - \Phi(-1) = 0{,}9332 - 0{,}1587 = 0{,}7745$.` },
    { level: 2, type: "fields", q: R`Τα ύψη των ενηλίκων ανδρών μιας χώρας είναι $N(170, 6^2)$ (σε cm). Να βρείτε το ύψος $x$ που ξεπερνά μόνο το $5\%$ του πληθυσμού (δίνεται $z_{0{,}05} = 1{,}645$, 2 δεκαδικά).`,
      fields: [{ label: "x (cm) =", ans: 179.87, tol: 0.006 / Math.max(1, 179.87) }], hint: R`$\frac{x - 170}{6} = 1{,}645$.`,
      sol: R`$x = 170 + 1{,}645\cdot 6 = 179{,}87$ cm.` },
    { level: 1, type: "mc", q: R`Αν $X \sim N(\mu, \sigma^2)$, η πιθανότητα $P(\mu - 2\sigma \lt X \lt \mu + 2\sigma)$ είναι περίπου:`,
      options: ["$0{,}95$", "$0{,}68$", "$0{,}997$", "$0{,}50$"], correct: 0, hint: R`Κανόνας $68$–$95$–$99{,}7$.`,
      sol: R`$2\Phi(2) - 1 \approx 0{,}9545$. Το $0{,}68$ αντιστοιχεί σε $\mu \pm \sigma$ και το $0{,}997$ σε $\mu \pm 3\sigma$.` },
    { level: 1, type: "mc", q: R`Αν $X \sim N(\mu, \sigma^2)$, τότε $Y = 2X + 3 \sim N(2\mu + 3,\ 4\sigma^2)$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Γραμμικός μετασχηματισμός κανονικής.`, sol: R`Σωστό: $aX + b \sim N(a\mu + b, a^2\sigma^2)$.` },
    { level: 3, type: "fields", q: R`Οι βαθμοί σε μια εξέταση είναι $N(60, \sigma^2)$ και το $10\%$ των φοιτητών παίρνει πάνω από $80$. Να βρείτε το $\sigma$ (δίνεται $\Phi(1{,}2816) = 0{,}90$, 2 δεκαδικά).`,
      fields: [{ label: "σ =", ans: 15.61, tol: 0.006 / Math.max(1, 15.61) }], hint: R`$\frac{80 - 60}{\sigma} = 1{,}2816$.`,
      sol: R`$\sigma = \frac{20}{1{,}2816} \approx 15{,}61$.` },
    { level: 2, type: "fields", q: R`Αν $X \sim N(\mu, 5^2)$ και $P(X \lt 50) = 0{,}0228$, να βρείτε το $\mu$ (δίνεται $\Phi(2) = 0{,}9772$).`,
      fields: [{ label: "μ =", ans: 60 }], hint: R`$0{,}0228 = \Phi(-2)$.`,
      sol: R`$\frac{50 - \mu}{5} = -2 \Rightarrow \mu = 60$.` },
    { level: 1, type: "fields", q: R`Στην R, τι επιστρέφουν (4 δεκαδικά) οι <code>pnorm(85, mean = 70, sd = 10)</code> και <code>qnorm(0.975)</code>;`,
      fields: [{ label: "pnorm =", ans: 0.9332, tol: 0.0006 }, { label: "qnorm =", ans: 1.96, tol: 0.0006 }],
      hint: R`Η <code>pnorm</code> δίνει $P(X \le x)$, η <code>qnorm</code> το αντίστροφο.`, sol: R`$\Phi(1{,}5) \approx 0{,}9332$ και $z$ με $\Phi(z) = 0{,}975$: $1{,}96$ ($= z_{0{,}025}$).` },
    { level: 3, type: "fields", q: R`Το βάρος (σε g) των πακέτων μιας μηχανής είναι $N(500, 4^2)$. Πακέτα κάτω από $494$ g απορρίπτονται. Ποιο ποσοστό απορρίπτεται και πόσα πακέτα αναμένεται να απορριφθούν σε $1000$; (δίνεται $\Phi(1{,}5) = 0{,}9332$)`,
      fields: [{ label: "P =", ans: 0.0668, tol: 0.0006 }, { label: "πακέτα =", ans: 66.8, tol: 0.06 / Math.max(1, 66.8) }],
      hint: R`$z = \frac{494 - 500}{4}$· αναμενόμενο πλήθος $= nP$.`, sol: R`$P(X \lt 494) = \Phi(-1{,}5) = 0{,}0668$. Αναμενόμενα: $1000\cdot 0{,}0668 = 66{,}8$ (το πλήθος είναι $b(1000, 0{,}0668)$).` }
  ]
},
/* ───────────────────────────── 3.7 ───────────────────────────── */
{
  id: "3.7", unit: 3, title: "Ανεξαρτησία τυχαίων μεταβλητών – Από κοινού κατανομές – Συνδιακύμανση",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Τυχαίες μεταβλητές (ανεξαρτησία, ιδιότητες μέσης τιμής, συνδιακύμανση)",
  theory: R`
<div class="tbox"><h4>Ανεξάρτητες τυχαίες μεταβλητές</h4>
<p>Οι $X, Y$ είναι ανεξάρτητες $\iff P(X \le x, Y \le y) = P(X \le x)P(Y \le y)$ για κάθε $x, y$. Για διακριτές, ισοδύναμα $P(X = x, Y = y) = P(X = x)P(Y = y)$ για <b>κάθε</b> $x, y$. Με πίνακα από κοινού συνάρτησης μάζας $p(x, y)$, οι <b>περιθώριες</b> είναι τα αθροίσματα γραμμών/στηλών: $p_X(x) = \sum_y p(x, y)$, $p_Y(y) = \sum_x p(x, y)$.</p></div>
<div class="tbox"><h4>Ιδιότητες μέσης τιμής</h4>
<p>$E(aX + bY) = aE(X) + bE(Y)$ πάντα· αν $X \le Y$ τότε $E(X) \le E(Y)$. Αν $X, Y$ ανεξάρτητες: $E(XY) = E(X)E(Y)$ και γενικότερα $E[g(X)h(Y)] = E[g(X)]E[h(Y)]$. Το αντίστροφο <b>δεν</b> ισχύει.</p></div>
<div class="tbox"><h4>Συνδιακύμανση</h4>
<p>$\mathrm{Cov}(X, Y) = E\{(X - E(X))(Y - E(Y))\} = E(XY) - E(X)E(Y)$ και $\rho = \frac{\mathrm{Cov}(X, Y)}{\sqrt{\mathrm{Var}(X)\mathrm{Var}(Y)}} \in [-1, 1]$ (ορίζεται όταν $\mathrm{Var}(X), \mathrm{Var}(Y) > 0$).</p>
<p>$\mathrm{Var}(aX + bY) = a^2\mathrm{Var}(X) + b^2\mathrm{Var}(Y) + 2ab\,\mathrm{Cov}(X, Y)$· ειδικά $\mathrm{Var}(X + Y) = \mathrm{Var}(X) + \mathrm{Var}(Y) + 2\mathrm{Cov}(X, Y)$.</p></div>
<div class="tbox warn"><h4>Παγίδα</h4>
<p>Ανεξάρτητες $\Rightarrow \mathrm{Cov} = 0$, αλλά όχι αντίστροφα: αν $X \in \{-1, 0, 1\}$ ισοπίθανα και $Y = X^2$, τότε $\mathrm{Cov}(X, Y) = 0$, ενώ η $Y$ καθορίζεται από τη $X$.</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>p &lt;- matrix(c(0.1, 0.2, 0.1, 0.2, 0.1, 0.3), nrow = 2, byrow = TRUE)</code> · <code>rowSums(p)</code> → 0.4 0.6 ($p_X$) · <code>colSums(p)</code> → 0.3 0.3 0.4 ($p_Y$) · <code>outer(rowSums(p), colSums(p))</code> δίνει τον πίνακα που θα είχαμε υπό ανεξαρτησία.</p></div>`,
  widget: "psbjoint",
  gen: "psbjoint",
  exercises: [
    { level: 1, type: "fields", q: R`Η από κοινού συνάρτηση μάζας πιθανότητας των $X, Y$ είναι: $\begin{array}{c|ccc} X\backslash Y & 0 & 1 & 2 \\ \hline 0 & 0{,}1 & 0{,}2 & 0{,}1 \\ 1 & 0{,}2 & 0{,}1 & 0{,}3 \end{array}$. Να βρείτε τις $P(X = 1)$, $P(Y = 2)$ και τα $E(X)$, $E(Y)$.`,
      fields: [{ label: "P(X = 1) =", ans: 0.6, tol: 0.0006 }, { label: "P(Y = 2) =", ans: 0.4, tol: 0.0006 }, { label: "E(X) =", ans: 0.6, tol: 0.0006 }, { label: "E(Y) =", ans: 1.1, tol: 0.0006 }],
      hint: R`Αθροίσματα γραμμής / στήλης.`, sol: R`$P(X = 1) = 0{,}6$, $P(Y = 2) = 0{,}4$, $E(X) = 0{,}6$, $E(Y) = 0{,}3 + 2\cdot 0{,}4 = 1{,}1$.` },
    { level: 2, type: "fields", q: R`Η από κοινού συνάρτηση μάζας των $X, Y$ είναι $\begin{array}{c|ccc} X\backslash Y & 0 & 1 & 2 \\ \hline 0 & 0{,}1 & 0{,}2 & 0{,}1 \\ 1 & 0{,}2 & 0{,}1 & 0{,}3 \end{array}$. Να υπολογίσετε τα $E(XY)$ και $\mathrm{Cov}(X, Y)$.`,
      fields: [{ label: "E(XY) =", ans: 0.7, tol: 0.0006 }, { label: "Cov =", ans: 0.04, tol: 0.0006 }],
      hint: R`Μόνο κελιά με $x, y \ne 0$ συνεισφέρουν στο $E(XY)$· $E(X) = 0{,}6$, $E(Y) = 1{,}1$.`, sol: R`$E(XY) = 0{,}1 + 2\cdot 0{,}3 = 0{,}7$, $\mathrm{Cov} = 0{,}7 - 0{,}6\cdot 1{,}1 = 0{,}04$.` },
    { level: 1, type: "mc", q: R`Η από κοινού συνάρτηση μάζας των $X, Y$ είναι $\begin{array}{c|ccc} X\backslash Y & 0 & 1 & 2 \\ \hline 0 & 0{,}1 & 0{,}2 & 0{,}1 \\ 1 & 0{,}2 & 0{,}1 & 0{,}3 \end{array}$. Είναι οι $X, Y$ ανεξάρτητες;`,
      options: ["Όχι, γιατί $p(0, 0) = 0{,}1 \\ne p_X(0)p_Y(0) = 0{,}12$", "Ναι, γιατί όλες οι πιθανότητες αθροίζουν σε $1$", "Ναι, γιατί η $\\mathrm{Cov}(X, Y)$ είναι κοντά στο $0$", "Δεν μπορούμε να το κρίνουμε από τον πίνακα"], correct: 0,
      hint: R`Ελέγξτε $p(x, y) = p_X(x)p_Y(y)$ σε ένα κελί.`, sol: R`$p_X(0) = 0{,}4$, $p_Y(0) = 0{,}3$, γινόμενο $0{,}12 \ne 0{,}1$: εξαρτημένες.` },
    { level: 2, type: "fields", q: R`Οι $X, Y$ είναι ανεξάρτητες με $\mathrm{Var}(X) = 4$ και $\mathrm{Var}(Y) = 1$. Να υπολογίσετε τη $\mathrm{Var}(2X - 3Y)$.`,
      fields: [{ label: "Var =", ans: 25 }], hint: R`Οι συντελεστές υψώνονται στο τετράγωνο· $\mathrm{Cov} = 0$.`, sol: R`$4\cdot 4 + 9\cdot 1 = 25$· το $-3$ δίνει $+9$, οι διασπορές προστίθενται.` },
    { level: 2, type: "fields", q: R`Για τις τ.μ. $X, Y$ ισχύουν $\mathrm{Var}(X) = 3$, $\mathrm{Var}(Y) = 5$ και $\mathrm{Cov}(X, Y) = -1$. Να βρείτε τις $\mathrm{Var}(X + Y)$ και $\mathrm{Var}(X - 2Y)$.`,
      fields: [{ label: "Var(X+Y) =", ans: 6 }, { label: "Var(X−2Y) =", ans: 27 }],
      hint: R`$\mathrm{Var}(aX + bY) = a^2\mathrm{Var}(X) + b^2\mathrm{Var}(Y) + 2ab\,\mathrm{Cov}$.`, sol: R`$3 + 5 - 2 = 6$ και $3 + 4\cdot 5 + 2\cdot 1\cdot(-2)\cdot(-1) = 3 + 20 + 4 = 27$.` },
    { level: 1, type: "mc", q: R`Αν $\mathrm{Cov}(X, Y) = 0$, τότε οι $X, Y$ είναι ανεξάρτητες.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`$Y = X^2$ με συμμετρική $X$.`, sol: R`Λάθος: για $X \in \{-1, 0, 1\}$ ισοπίθανα και $Y = X^2$ είναι $\mathrm{Cov} = 0$, αλλά εξαρτημένες.` },
    { level: 2, type: "fields", q: R`Ρίχνουμε δύο ζάρια ανεξάρτητα, $X$ και $Y$ οι ενδείξεις. Να βρείτε τα $E(XY)$ και $\mathrm{Var}(X + Y)$.`,
      fields: [{ label: "E(XY) =", ans: 12.25 }, { label: "Var(X+Y) =", ans: "35/6", tol: 0.001 }],
      hint: R`Ανεξαρτησία: $E(XY) = E(X)E(Y)$, $\mathrm{Var}(X) = \frac{35}{12}$.`, sol: R`$E(XY) = 3{,}5^2 = 12{,}25$. $\mathrm{Var}(X) = \frac{91}{6} - \frac{49}{4} = \frac{35}{12}$, άρα $\mathrm{Var}(X + Y) = \frac{35}{6} \approx 5{,}833$.` },
    { level: 1, type: "fields", q: R`Στην R δίνουμε <code>p &lt;- matrix(c(0.1, 0.2, 0.1, 0.2, 0.1, 0.3), nrow = 2, byrow = TRUE)</code>. Τι επιστρέφουν οι <code>sum(p[2, ])</code> και <code>sum(p[, 3])</code>;`,
      fields: [{ label: "sum(p[2,]) =", ans: 0.6, tol: 0.0006 }, { label: "sum(p[,3]) =", ans: 0.4, tol: 0.0006 }],
      hint: R`Άθροισμα 2ης γραμμής και 3ης στήλης.`, sol: R`$0{,}2 + 0{,}1 + 0{,}3 = 0{,}6$ και $0{,}1 + 0{,}3 = 0{,}4$: οι περιθώριες $P(X = 1)$ και $P(Y = 2)$.` },
    { level: 3, type: "fields", q: R`Η από κοινού συνάρτηση μάζας των $X, Y$ είναι $\begin{array}{c|ccc} X\backslash Y & 0 & 1 & 2 \\ \hline 0 & 0{,}1 & 0{,}2 & 0{,}1 \\ 1 & 0{,}2 & 0{,}1 & 0{,}3 \end{array}$. Να βρείτε τη δεσμευμένη πιθανότητα $P(Y = 2 \mid X = 1)$ και τη δεσμευμένη μέση τιμή $E(Y \mid X = 1)$.`,
      fields: [{ label: "P(Y = 2 | X = 1) =", ans: "1/2", tol: 0.001 }, { label: "E(Y | X = 1) =", ans: "7/6", tol: 0.001 }], hint: R`Διαιρέστε τη γραμμή $X = 1$ με το $p_X(1) = 0{,}6$.`,
      sol: R`Δεσμευμένη κατανομή $\left(\frac13, \frac16, \frac12\right)$. $P(Y = 2 \mid X = 1) = \frac12$ και $E(Y \mid X = 1) = \frac16 + 1 = \frac76$.` }
  ]
},
/* ───────────────────────────── 4.1 ───────────────────────────── */
{
  id: "4.1", unit: 4, title: "Το πρόβλημα των γενεθλίων – Σφαίρες σε δοχεία",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Συνδυαστική (γενέθλια) · Κλασικά προβλήματα πιθανοτήτων (σφαίρες σε δοχεία)",
  theory: R`
<div class="tbox"><h4>Το πρόβλημα των γενεθλίων</h4>
<p>Σε ένα δωμάτιο βρίσκονται $n$ άνθρωποι και κάθε ημέρα του έτους ($365$ ημέρες) είναι ισοπίθανη ως ημέρα γενεθλίων, ανεξάρτητα για κάθε άτομο. Αν $A_n$ = «τουλάχιστον δύο έχουν κοινά γενέθλια», είναι ευκολότερο να υπολογίσουμε το συμπληρωματικό (όλοι σε διαφορετικές ημέρες):
$$P(A_n) = 1 - P(A_n^c) = 1 - \frac{365\cdot 364\cdots(365 - n + 1)}{365^n} = 1 - \frac{(365)_n}{365^n},$$
όπου $(n)_k = n(n-1)\cdots(n-k+1) = \frac{n!}{(n-k)!}$ είναι το πλήθος των διατάξεων $k$ από $n$.</p>
<p>Ισχύει $P(A_{22}) \approx 0{,}4757 < \frac12 < P(A_{23}) \approx 0{,}5073$: αρκούν <b>23</b> άτομα για πιθανότητα κοινών γενεθλίων πάνω από $50\%$. Ενδεικτικά: $P(A_{10}) \approx 0{,}1169$, $P(A_{20}) \approx 0{,}4114$, $P(A_{33}) \approx 0{,}7749$, $P(A_{55}) \approx 0{,}9862$.</p></div>
<div class="tbox"><h4>Σφαίρες σε δοχεία (balls into bins)</h4>
<p>Ρίχνουμε $m$ σφαίρες σε $n$ δοχεία, την καθεμία ανεξάρτητα και ομοιόμορφα (πιθανότητα $\frac1n$ για κάθε δοχείο) — π.χ. $m$ εργασίες σε $n$ εξυπηρετητές (load balancing). Το πρόβλημα των γενεθλίων είναι η περίπτωση $m = n_{\text{ατόμων}}$ σφαιρών σε $365$ δοχεία.</p>
<ul><li>$P(\text{το δοχείο } i \text{ μένει κενό}) = \left(1 - \frac1n\right)^m \approx e^{-m/n}$.</li>
<li>Αν $X$ = αριθμός κενών δοχείων, με δείκτριες $X_i$ (1 αν το δοχείο $i$ είναι κενό): $E(X) = \sum_{i=1}^n E(X_i) = n\left(1 - \frac1n\right)^m \approx n e^{-m/n}$.</li>
<li>Ο αριθμός $Y_i$ σφαιρών στο δοχείο $i$ ακολουθεί $b\!\left(m, \frac1n\right)$: $P(Y_i = k) = \binom mk\left(\frac1n\right)^k\left(1 - \frac1n\right)^{m-k} \approx e^{-m/n}\frac{(m/n)^k}{k!}$ (προσέγγιση Poisson).</li></ul></div>
<div class="tbox tip"><h4>Φράγμα για το μέγιστο φορτίο</h4>
<p>Για $m = n$ και $k > e$: $P(Y_i \ge k) \le \left(\frac ek\right)^k\frac{1}{1 - e/k}$. Για $k = \left\lceil \frac{3\ln n}{\ln\ln n}\right\rceil$ αυτό είναι $\le n^{-2}$ (Mitzenmacher–Upfal· οι σημειώσεις χρησιμοποιούν τη σταθερά $e$ αντί για $3$, που ισχύει μόνο ασυμπτωτικά, για εξαιρετικά μεγάλα $n$), και από την ανισότητα Boole η πιθανότητα <b>κανένα</b> δοχείο να μην έχει $k$ ή περισσότερες σφαίρες είναι τουλάχιστον $1 - \frac1n$.</p></div>
<div class="tbox"><h4>Στην R</h4>
<p><code>1 - prod((365 - 0:22)/365)</code> → <code>0.5072972</code> · ή έτοιμη συνάρτηση <code>pbirthday(23)</code> → <code>0.5072972</code>.</p>
<p>Αναμενόμενα κενά δοχεία: <code>n &lt;- 10; m &lt;- 20; n*(1 - 1/n)^m</code> → <code>1.215767</code>. Προσομοίωση: <code>table(factor(sample(1:n, m, replace = TRUE), levels = 1:n))</code>.</p></div>`,
  widget: "pscbirth",
  gen: "pscbirth",
  exercises: [
    { level: 1, type: "fields", q: R`Πόσοι πενταψήφιοι κωδικοί (με ψηφία $0$–$9$, επιτρέπεται και $0$ στην αρχή) έχουν όλα τα ψηφία τους διαφορετικά;`,
      fields: [{ label: "πλήθος =", ans: 30240 }], hint: R`$(10)_5$.`, sol: R`$(10)_5 = 10\cdot 9\cdot 8\cdot 7\cdot 6 = 30240$.` },
    { level: 1, type: "fields", q: R`Τέσσερα άτομα επιλέγονται τυχαία· η ημέρα της εβδομάδας που γεννήθηκε το καθένα είναι ισοπίθανη και ανεξάρτητη από των άλλων. Ποια η πιθανότητα να έχουν γεννηθεί και τα τέσσερα σε διαφορετικές ημέρες της εβδομάδας;`,
      fields: [{ label: "P =", ans: "120/343", tol: 0.001 }], hint: R`$\frac{(7)_4}{7^4}$.`, sol: R`$\frac{7\cdot 6\cdot 5\cdot 4}{7^4} = \frac{840}{2401} = \frac{120}{343} \approx 0{,}3499$.` },
    { level: 1, type: "mc", q: R`Ποιος είναι ο ελάχιστος αριθμός ατόμων ώστε η πιθανότητα να υπάρχουν τουλάχιστον δύο με κοινά γενέθλια (365 ισοπίθανες ημέρες) να ξεπερνά το $50\%$;`,
      options: ["$23$", "$183$", "$366$", "$57$"], correct: 0, hint: R`Υπολογίστε $1 - \frac{(365)_n}{365^n}$ για μικρά $n$.`,
      sol: R`$P(A_{22}) \approx 0{,}4757$ και $P(A_{23}) \approx 0{,}5073$, άρα $23$. Το $183$ είναι το μισό του $365$ (λανθασμένη διαίσθηση), με $366$ άτομα η πιθανότητα είναι $1$ (αρχή του περιστερώνα), και με $57$ άτομα είναι ήδη πάνω από $0{,}99$.` },
    { level: 2, type: "fields", q: R`Πέντε φοιτητές επιλέγονται τυχαία και ο μήνας γέννησης του καθενός είναι ισοπίθανος (12 μήνες), ανεξάρτητα. Ποια η πιθανότητα τουλάχιστον δύο να έχουν γεννηθεί τον ίδιο μήνα;`,
      fields: [{ label: "P =", ans: "89/144", tol: 0.001 }], hint: R`Συμπληρωματικό: όλοι σε διαφορετικούς μήνες.`,
      sol: R`$1 - \frac{12\cdot 11\cdot 10\cdot 9\cdot 8}{12^5} = 1 - \frac{95040}{248832} = 1 - \frac{55}{144} = \frac{89}{144} \approx 0{,}6181$.` },
    { level: 2, type: "fields", q: R`Ρίχνουμε $10$ σφαίρες σε $5$ δοχεία, κάθε σφαίρα ανεξάρτητα και ισοπίθανα σε οποιοδήποτε δοχείο. Να βρείτε την πιθανότητα το δοχείο 1 να μείνει κενό και τον αναμενόμενο αριθμό κενών δοχείων (με 4 δεκαδικά).`,
      fields: [{ label: "P(κενό) =", ans: 0.1074, tol: 0.0006 }, { label: "E(κενά) =", ans: 0.5369, tol: 0.0006 }], hint: R`$\left(\frac45\right)^{10}$ και δείκτριες για κάθε δοχείο.`,
      sol: R`$P = \left(1 - \frac15\right)^{10} = 0{,}8^{10} \approx 0{,}1074$. Αν $X = \sum_{i=1}^5 X_i$ με $X_i$ δείκτρια «το δοχείο $i$ κενό», τότε $E(X) = 5\cdot 0{,}1074 \approx 0{,}5369$.` },
    { level: 2, type: "fields", q: R`Έξι εργασίες ανατίθενται ανεξάρτητα και ισοπίθανα σε τρεις εξυπηρετητές. Ποια η πιθανότητα ο εξυπηρετητής 1 να πάρει ακριβώς δύο εργασίες;`,
      fields: [{ label: "P =", ans: "80/243", tol: 0.001 }], hint: R`Ο αριθμός εργασιών του εξυπηρετητή 1 ακολουθεί $b\!\left(6, \frac13\right)$.`,
      sol: R`$\binom62\left(\frac13\right)^2\left(\frac23\right)^4 = 15\cdot\frac19\cdot\frac{16}{81} = \frac{240}{729} = \frac{80}{243} \approx 0{,}3292$.` },
    { level: 2, type: "fields", q: R`Ρίχνουμε $m = 1000$ σφαίρες σε $n = 1000$ δοχεία (ομοιόμορφα, ανεξάρτητα). Με την προσέγγιση $\left(1 - \frac1n\right)^m \approx e^{-m/n}$, πόσα κενά δοχεία αναμένονται (με 2 δεκαδικά);`,
      fields: [{ label: "E(κενά) ≈", ans: 367.88, tol: 0.002 }], hint: R`$n e^{-m/n} = 1000e^{-1}$.`,
      sol: R`$E(X) = 1000\left(1 - \frac1{1000}\right)^{1000} \approx 1000e^{-1} \approx 367{,}88$ (ακριβής τιμή $367{,}70$): περίπου το $37\%$ των δοχείων μένει κενό.` },
    { level: 1, type: "mc", q: R`Το πρόβλημα των γενεθλίων είναι ειδική περίπτωση του προβλήματος σφαιρών σε δοχεία, με τα άτομα ως σφαίρες και τις $365$ ημέρες ως δοχεία.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Κάθε άτομο «πέφτει» ομοιόμορφα σε μία ημέρα.`, sol: R`Σωστό: «κοινά γενέθλια» σημαίνει ότι κάποιο δοχείο (ημέρα) έχει τουλάχιστον δύο σφαίρες (άτομα).` },
    { level: 2, type: "fields", q: R`Τι επιστρέφει η εντολή της R <code>1 - prod((365 - 0:9)/365)</code> (με 4 δεκαδικά); Τι πιθανότητα υπολογίζει;`,
      fields: [{ label: "τιμή =", ans: 0.1169, tol: 0.0006 }], hint: R`Το <code>0:9</code> δίνει $10$ όρους: $\frac{365}{365}\cdots\frac{356}{365}$.`,
      sol: R`Υπολογίζει $1 - \frac{(365)_{10}}{365^{10}} \approx 0{,}1169$: την πιθανότητα κοινών γενεθλίων ανάμεσα σε $10$ άτομα.` },
    { level: 3, type: "fields", q: R`Σε ομάδα $30$ ατόμων (γενέθλια ισοπίθανα στις $365$ ημέρες, ανεξάρτητα), ποιος είναι ο αναμενόμενος αριθμός <b>ζευγών</b> ατόμων με την ίδια ημέρα γενεθλίων;`,
      fields: [{ label: "E =", ans: "87/73", tol: 0.001 }], hint: R`Για κάθε ένα από τα $\binom{30}{2}$ ζεύγη ορίστε δείκτρια με $P = \frac1{365}$.`,
      sol: R`$E = \binom{30}{2}\cdot\frac{1}{365} = \frac{435}{365} = \frac{87}{73} \approx 1{,}19$. Αναμένεται πάνω από ένα ζεύγος, συμβατό με το ότι $P(A_{30}) \approx 0{,}71$.` }
  ]
},
/* ───────────────────────────── 4.2 ───────────────────────────── */
{
  id: "4.2", unit: 4, title: "Το πρόβλημα των κουπονιών",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Κλασικά προβλήματα πιθανοτήτων · Βλ. και Ross, Κεφ. 7",
  theory: R`
<div class="tbox"><h4>Το πρόβλημα</h4>
<p>Σε κάθε κουτί ενός προϊόντος υπάρχει ένα από $n$ διαφορετικά κουπόνια, καθένα με πιθανότητα $\frac1n$, ανεξάρτητα. Ποιος είναι ο αναμενόμενος αριθμός $X$ κουτιών που πρέπει να αγοράσουμε για να συμπληρώσουμε τη σειρά;</p></div>
<div class="tbox"><h4>Λύση με άθροισμα γεωμετρικών</h4>
<p>Έστω ότι έχουμε ήδη $k - 1$ διαφορετικά κουπόνια και $X_k$ ο αριθμός κουτιών μέχρι να βρούμε ένα <b>νέο</b>. Κάθε κουτί δίνει νέο κουπόνι με πιθανότητα $p_k = 1 - \frac{k-1}{n} = \frac{n-k+1}{n}$, άρα η $X_k$ ακολουθεί <b>γεωμετρική</b> κατανομή με παράμετρο $p_k$ και
$$E(X_k) = \frac{1}{p_k} = \frac{n}{n-k+1}.$$
Αφού $X = X_1 + X_2 + \dots + X_n$,
$$E(X) = \sum_{k=1}^n \frac{n}{n-k+1} = n\sum_{k=1}^n\frac1k = n\left(1 + \frac12 + \dots + \frac1n\right).$$</p></div>
<div class="tbox tip"><h4>Ασυμπτωτική συμπεριφορά</h4>
<p>Για μεγάλο $n$: $\sum_{k=1}^n\frac1k \approx \ln n + \frac{1}{2n} + C$, όπου $C \approx 0{,}57722$ η σταθερά του Euler, άρα
$$E(X) \approx n\ln n + nC + \frac12.$$
Π.χ. για $n = 20$ χρειάζονται κατά μέσο όρο περίπου $72$ κουτιά. Τα τελευταία κουπόνια είναι τα «ακριβά»: για το τελευταίο $E(X_n) = n$.</p>
<p><i>(Εμπλουτισμός)</i> Επειδή οι $X_k$ είναι ανεξάρτητες, $\text{Var}(X) = \sum_k \frac{1 - p_k}{p_k^2}$.</p></div>
<div class="tbox"><h4>Στην R</h4>
<p><code>n &lt;- 50; n * sum(1/(1:n))</code> → <code>224.9603</code>.</p>
<p>Προσομοίωση μίας συλλογής: <code>s &lt;- 0; got &lt;- c(); while (length(unique(got)) &lt; n) { got &lt;- c(got, sample(1:n, 1)); s &lt;- s + 1 }</code> και επανάληψη με <code>replicate()</code> για τον μέσο όρο.</p></div>`,
  widget: "psccoupon",
  gen: "psccoup",
  exercises: [
    { level: 1, type: "fields", q: R`Υπάρχουν $4$ διαφορετικά κουπόνια, ισοπίθανα σε κάθε κουτί. Πόσα κουτιά αναμένεται να αγοράσουμε για να συμπληρώσουμε τη σειρά;`,
      fields: [{ label: "E(X) =", ans: "25/3", tol: 0.001 }], hint: R`$4\left(1 + \frac12 + \frac13 + \frac14\right)$.`, sol: R`$E(X) = 4\cdot\frac{25}{12} = \frac{25}{3} \approx 8{,}33$.` },
    { level: 1, type: "fields", q: R`Συλλέγουμε $5$ διαφορετικά κουπόνια και έχουμε ήδη $3$ διαφορετικά. Πόσα κουτιά αναμένεται να αγοράσουμε μέχρι να βρούμε ένα νέο κουπόνι;`,
      fields: [{ label: "E =", ans: "5/2", tol: 0.001 }], hint: R`Γεωμετρική με $p = \frac25$.`, sol: R`Κάθε κουτί δίνει νέο κουπόνι με πιθανότητα $p = \frac{5 - 3}{5} = \frac25$, άρα $E = \frac1p = \frac52$.` },
    { level: 2, type: "fields", q: R`Ρίχνουμε ένα αμερόληπτο ζάρι μέχρι να εμφανιστούν όλες οι ενδείξεις $1, \dots, 6$ τουλάχιστον μία φορά. Πόσες ρίψεις αναμένονται;`,
      fields: [{ label: "E(X) =", ans: 14.7, tol: 0.001 }], hint: R`Πρόβλημα κουπονιών με $n = 6$.`, sol: R`$E(X) = 6\left(1 + \frac12 + \frac13 + \frac14 + \frac15 + \frac16\right) = 6\cdot\frac{49}{20} = 14{,}7$.` },
    { level: 2, type: "fields", q: R`Για $n = 20$ κουπόνια, να υπολογίσετε προσεγγιστικά το $E(X)$ με τον τύπο $n\ln n + nC + \frac12$, όπου $C = 0{,}57722$ (με 2 δεκαδικά).`,
      fields: [{ label: "E(X) ≈", ans: 71.96, tol: 0.002 }], hint: R`$\ln 20 \approx 2{,}9957$.`,
      sol: R`$20\cdot 2{,}9957 + 20\cdot 0{,}57722 + 0{,}5 \approx 59{,}91 + 11{,}54 + 0{,}5 = 71{,}96$ (ακριβής τιμή $20H_{20} \approx 71{,}95$).` },
    { level: 2, type: "mc", q: R`Αν έχουμε ήδη $k - 1$ από τα $n$ διαφορετικά κουπόνια, ο αριθμός $X_k$ κουτιών μέχρι να βρούμε ένα νέο ακολουθεί:`,
      options: ["γεωμετρική κατανομή με $p = \\frac{n-k+1}{n}$", "διωνυμική κατανομή $b\\left(n, \\frac1n\\right)$", "κατανομή Poisson με $\\lambda = \\frac nk$", "ομοιόμορφη κατανομή στο $\\{1, \\dots, n\\}$"], correct: 0,
      hint: R`Ανεξάρτητες δοκιμές μέχρι την πρώτη επιτυχία.`, sol: R`Κάθε κουτί είναι μια ανεξάρτητη δοκιμή με πιθανότητα «επιτυχίας» (νέο κουπόνι) $\frac{n-k+1}{n}$, και μετράμε δοκιμές μέχρι την πρώτη επιτυχία: γεωμετρική.` },
    { level: 2, type: "fields", q: R`Υπάρχουν $5$ διαφορετικά κουπόνια και έχουμε ήδη τα $4$. Αν $X_5$ είναι ο αριθμός κουτιών μέχρι το τελευταίο κουπόνι, να βρείτε τα $E(X_5)$ και $\text{Var}(X_5)$.`,
      fields: [{ label: "E =", ans: 5 }, { label: "Var =", ans: 20 }], hint: R`Γεωμετρική με $p = \frac15$: $E = \frac1p$, $\text{Var} = \frac{1-p}{p^2}$.`,
      sol: R`$E(X_5) = 5$ και $\text{Var}(X_5) = \frac{4/5}{1/25} = 20$: μεγάλη μεταβλητότητα — η συμπλήρωση της σειράς μπορεί να αργήσει πολύ.` },
    { level: 3, type: "fields", q: R`Υπάρχουν $3$ διαφορετικά κουπόνια, ισοπίθανα σε κάθε κουτί. Ποια η πιθανότητα, αγοράζοντας ακριβώς $3$ κουτιά, να έχουμε συμπληρώσει τη σειρά;`,
      fields: [{ label: "P =", ans: "2/9", tol: 0.001 }], hint: R`Ευνοϊκά: όλες οι μεταθέσεις των τριών κουπονιών.`, sol: R`$P = \frac{3!}{3^3} = \frac{6}{27} = \frac29$.` },
    { level: 3, type: "fields", q: R`Υπάρχουν $3$ διαφορετικά κουπόνια, ισοπίθανα σε κάθε κουτί. Ποια η πιθανότητα να χρειαστούμε <b>περισσότερα</b> από $4$ κουτιά για να συμπληρώσουμε τη σειρά;`,
      fields: [{ label: "P =", ans: "5/9", tol: 0.001 }], hint: R`$P(X > 4) = 1 - P(\text{όλα τα κουπόνια στα πρώτα } 4 \text{ κουτιά})$· εγκλεισμός–αποκλεισμός.`,
      sol: R`Ευνοϊκές τετράδες με όλα τα κουπόνια: $3^4 - 3\cdot 2^4 + 3 = 81 - 48 + 3 = 36$, άρα $P(X \le 4) = \frac{36}{81} = \frac49$ και $P(X > 4) = \frac59$.` },
    { level: 1, type: "mc", q: R`Ο αναμενόμενος αριθμός κουτιών για $n$ κουπόνια αυξάνει περίπου όπως $n\ln n$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`$\sum_{k\le n}\frac1k \approx \ln n$.`, sol: R`Σωστό: $E(X) = n\sum_{k=1}^n \frac1k \approx n\ln n + 0{,}577n + \frac12$.` },
    { level: 2, type: "fields", q: R`Τι επιστρέφει η εντολή της R <code>n &lt;- 10; n * sum(1/(1:n))</code> (με 2 δεκαδικά);`,
      fields: [{ label: "τιμή =", ans: 29.29, tol: 0.001 }], hint: R`$10\left(1 + \frac12 + \dots + \frac1{10}\right)$.`,
      sol: R`$10H_{10} = 10\cdot 2{,}928968 \approx 29{,}29$: ο αναμενόμενος αριθμός κουτιών για $10$ κουπόνια.` }
  ]
},
/* ───────────────────────────── 4.3 ───────────────────────────── */
{
  id: "4.3", unit: 4, title: "Δείκτριες τυχαίες μεταβλητές – Ο αλγόριθμος Bubblesort",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Κλασικά προβλήματα πιθανοτήτων (Bubblesort)",
  theory: R`
<div class="tbox"><h4>Δείκτριες και γραμμικότητα</h4>
<p>Για ένα ενδεχόμενο $A$, η <b>δείκτρια</b> τυχαία μεταβλητή $I_A$ παίρνει την τιμή $1$ αν συμβεί το $A$ και $0$ αλλιώς. Τότε
$$E(I_A) = 0\cdot P(I_A = 0) + 1\cdot P(I_A = 1) = P(A).$$
Η μέση τιμή είναι <b>γραμμική</b>: $E(X_1 + \dots + X_n) = E(X_1) + \dots + E(X_n)$ για οποιεσδήποτε τυχαίες μεταβλητές (με πεπερασμένες μέσες τιμές), <b>χωρίς</b> να χρειάζεται ανεξαρτησία. Γράφοντας ένα πλήθος ως άθροισμα δεικτριών, βρίσκουμε τη μέση τιμή του χωρίς να βρούμε την κατανομή του.</p></div>
<div class="tbox"><h4>Ο αλγόριθμος Bubblesort</h4>
<p>Ο αλγόριθμος ταξινομεί μια λίστα $y_1, \dots, y_n$ (διαφορετικών αριθμών) ανταλλάσσοντας διαδοχικά στοιχεία που είναι «αντεστραμμένα». Δύο αριθμοί $y_i, y_j$ με $i < j$ αλλά $y_i > y_j$ λέγονται <b>αντεστραμμένοι</b>· κάθε ανταλλαγή διορθώνει ακριβώς ένα αντεστραμμένο ζεύγος, άρα ο αριθμός ανταλλαγών $X$ ισούται με τον αριθμό των αντεστραμμένων ζευγών.</p>
<p>Αν η λίστα είναι σε τυχαία σειρά, ορίζουμε $X_{ij} = 1$ αν $y_i > y_j$ ($i < j$). Τότε $E(X_{ij}) = \frac12$ και
$$E(X) = \sum_{1 \le i < j \le n} E(X_{ij}) = \binom n2\cdot\frac12 = \frac{n(n-1)}{4}.$$
Το μέγιστο δυνατό πλήθος ανταλλαγών είναι $\binom n2 = \frac{n(n-1)}{2}$ (λίστα σε φθίνουσα σειρά).</p></div>
<div class="tbox tip"><h4>Άλλα παραδείγματα με δείκτριες</h4>
<ul><li>Αναμενόμενος αριθμός ζευγών με κοινά γενέθλια σε $n$ άτομα: $\binom n2\cdot\frac1{365}$.</li>
<li>Αναμενόμενος αριθμός κενών δοχείων: $n\left(1 - \frac1n\right)^m$ (ενότητα 4.1).</li>
<li><i>(Εμπλουτισμός)</i> $n$ γράμματα τοποθετούνται τυχαία σε $n$ φακέλους: ο αναμενόμενος αριθμός γραμμάτων στον σωστό φάκελο είναι $n\cdot\frac1n = 1$, για κάθε $n$.</li></ul></div>
<div class="tbox"><h4>Στην R</h4>
<p><code>choose(10, 2)/2</code> → <code>22.5</code> (αναμενόμενες ανταλλαγές για $n = 10$).</p>
<p>Πλήθος αντεστραμμένων ζευγών μιας λίστας: <code>y &lt;- c(3, 1, 4, 2); sum(outer(y, y, "&gt;")[upper.tri(diag(4))])</code> → <code>3</code>.</p></div>`,
  widget: "pscbubble",
  gen: "pscind",
  exercises: [
    { level: 1, type: "fields", q: R`Πόσες ανταλλαγές θα κάνει ο αλγόριθμος Bubblesort για να ταξινομήσει τη λίστα $3, 1, 4, 2$;`,
      fields: [{ label: "ανταλλαγές =", ans: 3 }], hint: R`Μετρήστε τα αντεστραμμένα ζεύγη.`, sol: R`Αντεστραμμένα ζεύγη: $(3, 1)$, $(3, 2)$, $(4, 2)$. Άρα $3$ ανταλλαγές.` },
    { level: 1, type: "fields", q: R`Μια λίστα $6$ διαφορετικών αριθμών είναι σε τυχαία σειρά. Πόσες ανταλλαγές αναμένεται να κάνει ο Bubblesort;`,
      fields: [{ label: "E(X) =", ans: 7.5, tol: 0.001 }], hint: R`$\frac{n(n-1)}{4}$.`, sol: R`$E(X) = \frac{6\cdot 5}{4} = 7{,}5$.` },
    { level: 2, type: "fields", q: R`Για λίστα $10$ διαφορετικών αριθμών σε τυχαία σειρά, να βρείτε τον αναμενόμενο και τον μέγιστο δυνατό αριθμό ανταλλαγών του Bubblesort.`,
      fields: [{ label: "E(X) =", ans: 22.5, tol: 0.001 }, { label: "μέγιστο =", ans: 45 }], hint: R`Μέγιστο: όλα τα ζεύγη αντεστραμμένα.`,
      sol: R`$E(X) = \frac{10\cdot 9}{4} = 22{,}5$ και μέγιστο $\binom{10}{2} = 45$ (λίστα σε φθίνουσα σειρά).` },
    { level: 2, type: "fields", q: R`Σε ομάδα $20$ ατόμων (γενέθλια ισοπίθανα στις $365$ ημέρες, ανεξάρτητα), ποιος είναι ο αναμενόμενος αριθμός ζευγών ατόμων με κοινά γενέθλια;`,
      fields: [{ label: "E =", ans: "38/73", tol: 0.001 }], hint: R`$\binom{20}{2}$ δείκτριες με $P = \frac1{365}$.`, sol: R`$E = \frac{190}{365} = \frac{38}{73} \approx 0{,}52$.` },
    { level: 2, type: "fields", q: R`Ρίχνουμε ένα αμερόληπτο ζάρι $12$ φορές. Ποιος είναι ο αναμενόμενος αριθμός ενδείξεων που δεν εμφανίζονται καθόλου (με 4 δεκαδικά);`,
      fields: [{ label: "E =", ans: 0.6729, tol: 0.0006 }], hint: R`Για κάθε ένδειξη, $P(\text{δεν εμφανίζεται}) = \left(\frac56\right)^{12}$.`,
      sol: R`$E = 6\left(\frac56\right)^{12} \approx 6\cdot 0{,}11216 \approx 0{,}6729$.` },
    { level: 2, type: "mc", q: R`Η ιδιότητα $E(X + Y) = E(X) + E(Y)$ ισχύει:`,
      options: ["πάντα, αρκεί να υπάρχουν οι μέσες τιμές", "μόνο αν οι $X, Y$ είναι ανεξάρτητες", "μόνο αν οι $X, Y$ είναι ασυσχέτιστες", "μόνο αν οι $X, Y$ είναι μη αρνητικές"], correct: 0,
      hint: R`Τι χρειάζεται για το $E(XY) = E(X)E(Y)$ και τι για το άθροισμα;`, sol: R`Η γραμμικότητα της μέσης τιμής ισχύει πάντα. Η ανεξαρτησία χρειάζεται για το $E(XY) = E(X)E(Y)$ ή για το $\text{Var}(X + Y) = \text{Var}(X) + \text{Var}(Y)$, όχι για το άθροισμα.` },
    { level: 2, type: "fields", q: R`Μια λίστα $9$ διαφορετικών αριθμών είναι σε τυχαία σειρά. Ποιος είναι ο αναμενόμενος αριθμός θέσεων $i$ ($1 \le i \le 8$) με $y_i > y_{i+1}$ (δηλαδή «καθόδων»);`,
      fields: [{ label: "E =", ans: 4 }], hint: R`Δείκτρια για κάθε διαδοχικό ζεύγος, με πιθανότητα $\frac12$.`, sol: R`$8$ διαδοχικά ζεύγη, το καθένα «κατεβαίνει» με πιθανότητα $\frac12$: $E = 8\cdot\frac12 = 4$.` },
    { level: 3, type: "fields", q: R`<i>(Εμπλουτισμός)</i> Μια γραμματέας τοποθετεί τυχαία $8$ γράμματα σε $8$ φακέλους με διευθύνσεις (κάθε μετάθεση ισοπίθανη). Ποιος είναι ο αναμενόμενος αριθμός γραμμάτων που μπαίνουν στον σωστό φάκελο;`,
      fields: [{ label: "E =", ans: 1 }], hint: R`Δείκτρια για κάθε γράμμα: $P(\text{σωστός φάκελος}) = \frac18$.`, sol: R`$E = 8\cdot\frac18 = 1$ — ανεξάρτητα από τον αριθμό των γραμμάτων.` },
    { level: 1, type: "mc", q: R`Η μέση τιμή μιας δείκτριας τυχαίας μεταβλητής $I_A$ ισούται με $P(A)$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`$I_A \in \{0, 1\}$.`, sol: R`Σωστό: $E(I_A) = 1\cdot P(A) + 0\cdot P(A^c) = P(A)$.` },
    { level: 2, type: "fields", q: R`Τι επιστρέφει η εντολή της R <code>choose(8, 2)/2</code>; Τι αναμενόμενη τιμή εκφράζει;`,
      fields: [{ label: "τιμή =", ans: 14 }], hint: R`$\binom82 = 28$.`, sol: R`$\frac{28}{2} = 14$: τον αναμενόμενο αριθμό ανταλλαγών του Bubblesort για τυχαία λίστα $8$ στοιχείων ($\frac{8\cdot 7}{4} = 14$).` }
  ]
},
/* ───────────────────────────── 5.1 ───────────────────────────── */
{
  id: "5.1", unit: 5, title: "Ανισότητες Markov και Chebyshev",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Ανισότητες · Βλ. και Ross, Κεφ. 8",
  theory: R`
<div class="tbox"><h4>Βασική ανισότητα πιθανότητας</h4>
<p>Αν η συνάρτηση $h \ge 0$ είναι μη φθίνουσα στο $[0, \infty)$ και $h(x) > 0$ για $x > 0$, τότε για κάθε $\epsilon > 0$ και κάθε τυχαία μεταβλητή $X$:
$$P(|X| > \epsilon) \le \frac{E\big(h(|X|)\big)}{h(\epsilon)}.$$
Οι ανισότητες αυτής της ενότητας δίνουν <b>φράγματα</b> για πιθανότητες όταν γνωρίζουμε μόνο λίγες ροπές της $X$ — π.χ. για τον χρόνο εκτέλεσης ενός αλγορίθμου.</p></div>
<div class="tbox"><h4>Ανισότητα Markov</h4>
<p>Με $h(x) = x^k$ ($k$ θετικός ακέραιος):
$$P(|X| > \epsilon) \le \frac{E\big(|X|^k\big)}{\epsilon^k}.$$
Συχνότερη μορφή ($k = 1$): αν $X \ge 0$ και $a > 0$, τότε $P(X \ge a) \le \frac{E(X)}{a}$.</p></div>
<div class="tbox"><h4>Ανισότητα Chebyshev</h4>
<p>Εφαρμόζοντας τη Markov στην $X - E(X)$ με $k = 2$:
$$P\big(|X - E(X)| > \epsilon\big) \le \frac{\text{Var}(X)}{\epsilon^2}.$$
Με $\epsilon = k\sigma$: $P(|X - \mu| \ge k\sigma) \le \frac1{k^2}$, ισοδύναμα $P(|X - \mu| < k\sigma) \ge 1 - \frac{1}{k^2}$. Π.χ. για <b>οποιαδήποτε</b> κατανομή, τουλάχιστον $75\%$ της πιθανότητας βρίσκεται σε απόσταση μικρότερη από $2\sigma$ από τη μέση τιμή. (Τα φράγματα ισχύουν και με $\ge$ στη θέση του $>$.)</p></div>
<div class="tbox warn"><h4>Προσοχή</h4>
<p>Η Markov στη μορφή $\frac{E(X)}{a}$ απαιτεί $X \ge 0$. Τα φράγματα ισχύουν για κάθε κατανομή, γι' αυτό είναι συχνά πολύ «χαλαρά» σε σύγκριση με την πραγματική πιθανότητα· π.χ. για κανονική $P(|X - \mu| \ge 2\sigma) \approx 0{,}046$, ενώ η Chebyshev δίνει $0{,}25$.</p></div>
<div class="tbox"><h4>Στην R</h4>
<p>Σύγκριση πραγματικής πιθανότητας με το φράγμα: $X \sim b(20, \frac12)$, <code>1 - pbinom(14, 20, 0.5)</code> → <code>0.02069473</code> $= P(X \ge 15)$, ενώ η Markov δίνει $\frac{10}{15} \approx 0{,}667$ και η Chebyshev $P(|X - 10| \ge 5) \le \frac{5}{25} = 0{,}2$.</p></div>`,
  widget: "pscbound",
  gen: "pscineq",
  exercises: [
    { level: 1, type: "fields", q: R`Ο χρόνος $X$ (σε ms) απόκρισης ενός διακομιστή είναι μη αρνητική τυχαία μεταβλητή με $E(X) = 20$. Τι άνω φράγμα δίνει η ανισότητα Markov για την $P(X \ge 50)$;`,
      fields: [{ label: "φράγμα =", ans: 0.4, tol: 0.001 }], hint: R`$P(X \ge a) \le \frac{E(X)}{a}$.`, sol: R`$P(X \ge 50) \le \frac{20}{50} = 0{,}4$.` },
    { level: 1, type: "fields", q: R`Μια τυχαία μεταβλητή έχει $E(X) = 50$ και $\text{Var}(X) = 25$. Τι άνω φράγμα δίνει η ανισότητα Chebyshev για την $P(|X - 50| > 10)$;`,
      fields: [{ label: "φράγμα =", ans: 0.25, tol: 0.001 }], hint: R`$\frac{\text{Var}(X)}{\epsilon^2}$.`, sol: R`$P(|X - 50| > 10) \le \frac{25}{100} = 0{,}25$.` },
    { level: 1, type: "fields", q: R`Μια τυχαία μεταβλητή έχει $E(X) = 50$ και $\text{Var}(X) = 25$. Ποιο κάτω φράγμα δίνει η ανισότητα Chebyshev για την $P(40 < X < 60)$;`,
      fields: [{ label: "P ≥", ans: 0.75, tol: 0.001 }], hint: R`Συμπληρωματικό του $|X - 50| \ge 10$.`, sol: R`$P(|X - 50| \ge 10) \le \frac{25}{100}$, άρα $P(40 < X < 60) \ge 1 - 0{,}25 = 0{,}75$.` },
    { level: 2, type: "fields", q: R`Αν $X$ ακολουθεί εκθετική κατανομή με $\lambda = 1$, να βρείτε την ακριβή πιθανότητα $P(X > 3)$ και το φράγμα της ανισότητας Markov (με 4 δεκαδικά).`,
      fields: [{ label: "ακριβής =", ans: 0.0498, tol: 0.0006 }, { label: "Markov =", ans: 0.3333, tol: 0.0006 }], hint: R`$P(X > x) = e^{-\lambda x}$, $E(X) = \frac1\lambda$.`,
      sol: R`$P(X > 3) = e^{-3} \approx 0{,}0498$, ενώ η Markov δίνει $\frac{E(X)}{3} = \frac13 \approx 0{,}3333$ — σωστό αλλά πολύ «χαλαρό» φράγμα.` },
    { level: 2, type: "fields", q: R`Ο αριθμός αιτημάτων ανά λεπτό σε έναν εξυπηρετητή έχει μέση τιμή $100$ και τυπική απόκλιση $10$. Με την ανισότητα Chebyshev, να βρείτε άνω φράγμα για την πιθανότητα σε ένα λεπτό να φθάσουν τουλάχιστον $150$ ή το πολύ $50$ αιτήματα.`,
      fields: [{ label: "φράγμα =", ans: 0.04, tol: 0.001 }], hint: R`$P(|X - 100| \ge 50)$.`, sol: R`$P(|X - 100| \ge 50) \le \frac{10^2}{50^2} = \frac{100}{2500} = 0{,}04$.` },
    { level: 2, type: "fields", q: R`Αν $E(X^2) = 10$, τι άνω φράγμα δίνει η ανισότητα Markov (με $k = 2$) για την $P(|X| > 5)$;`,
      fields: [{ label: "φράγμα =", ans: 0.4, tol: 0.001 }], hint: R`$P(|X| > \epsilon) \le \frac{E(|X|^2)}{\epsilon^2}$.`, sol: R`$P(|X| > 5) \le \frac{10}{25} = 0{,}4$.` },
    { level: 2, type: "mc", q: R`Ποια προϋπόθεση χρειάζεται για να εφαρμόσουμε την ανισότητα Markov στη μορφή $P(X \ge a) \le \frac{E(X)}{a}$;`,
      options: ["$X \\ge 0$ και $a > 0$", "η $X$ να είναι κανονική", "η $X$ να είναι διακριτή", "να είναι γνωστή η $\\text{Var}(X)$"], correct: 0,
      hint: R`Η απόδειξη χρησιμοποιεί $X \ge a\,I_{\{X \ge a\}}$.`, sol: R`Χρειάζεται μόνο $X \ge 0$ (και πεπερασμένη $E(X)$) και $a > 0$· ισχύει για κάθε κατανομή, διακριτή ή συνεχή. Η διασπορά χρησιμοποιείται στη Chebyshev, όχι στη Markov.` },
    { level: 3, type: "fields", q: R`Ρίχνουμε ένα αμερόληπτο νόμισμα $n$ φορές και $\bar X$ είναι η αναλογία κορωνών. Με την ανισότητα Chebyshev, πόσες ρίψεις αρκούν ώστε $P(|\bar X - 0{,}5| \ge 0{,}05) \le 0{,}1$;`,
      fields: [{ label: "n ≥", ans: 1000 }], hint: R`$\text{Var}(\bar X) = \frac{p(1-p)}{n} = \frac{1}{4n}$.`,
      sol: R`$P(|\bar X - 0{,}5| \ge 0{,}05) \le \frac{1/(4n)}{0{,}05^2} = \frac{100}{n} \le 0{,}1 \iff n \ge 1000$.` },
    { level: 1, type: "mc", q: R`Για κάθε κατανομή με πεπερασμένη διασπορά $\sigma^2 > 0$ ισχύει $P(|X - \mu| \ge 2\sigma) \le \frac14$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Chebyshev με $k = 2$.`, sol: R`Σωστό: $P(|X - \mu| \ge k\sigma) \le \frac1{k^2}$ με $k = 2$.` },
    { level: 2, type: "fields", q: R`Τι επιστρέφει η εντολή της R <code>1 - pexp(3, rate = 1)</code> (με 4 δεκαδικά);`,
      fields: [{ label: "τιμή =", ans: 0.0498, tol: 0.0006 }], hint: R`<code>pexp</code> είναι η συνάρτηση κατανομής της εκθετικής.`, sol: R`$1 - F(3) = e^{-3} \approx 0{,}0498 = P(X > 3)$ για $X \sim E(1)$.` }
  ]
},
/* ───────────────────────────── 5.2 ───────────────────────────── */
{
  id: "5.2", unit: 5, title: "Ανισότητα Jensen – Ροπογεννήτρια – Φράγματα Chernoff",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Ανισότητες",
  theory: R`
<div class="tbox"><h4>Κυρτές συναρτήσεις και ανισότητα Jensen</h4>
<p>Η $f: \mathbb R \to \mathbb R$ λέγεται <b>κυρτή</b> αν $f(\lambda x_1 + (1 - \lambda)x_2) \le \lambda f(x_1) + (1 - \lambda)f(x_2)$ για κάθε $x_1, x_2$ και $0 \le \lambda \le 1$ (κοίλη, αν η $-f$ είναι κυρτή). Αν η $f$ είναι δύο φορές παραγωγίσιμη με $f''(x) \ge 0$, είναι κυρτή.</p>
<p><b>Jensen:</b> αν η $f$ είναι κυρτή, τότε $f\big(E(X)\big) \le E\big(f(X)\big)$ (όταν υπάρχουν οι μέσες τιμές). Συνέπειες, με $|x|$, $x^2$ και $e^{tx}$:
$$|E(X)| \le E(|X|), \qquad \big(E(X)\big)^2 \le E(X^2), \qquad e^{tE(X)} \le E\big(e^{tX}\big),\ t > 0.$$</p></div>
<div class="tbox"><h4>Ροπογεννήτρια</h4>
<p>$M_X(t) = E\big(e^{tX}\big)$. Αν είναι πεπερασμένη σε ένα διάστημα $(-h, h)$, τότε $E(X^k) = M_X^{(k)}(0)$. Χαρακτηρίζει την κατανομή, και για <b>ανεξάρτητες</b> $X_1, \dots, X_n$: $M_{X_1 + \dots + X_n}(t) = \prod_i M_{X_i}(t)$.</p>
<ul><li>$X \sim b(n, p)$: $M_X(t) = (1 - p + pe^t)^n$, οπότε $E(X) = np$, $\text{Var}(X) = np(1 - p)$.</li>
<li>$X \sim \text{Poisson}(\lambda)$: $M_X(t) = e^{\lambda(e^t - 1)}$, οπότε $E(X) = \lambda$, $E(X^2) = \lambda^2 + \lambda$.</li>
<li>$X \sim \mathcal E(\lambda)$: $M_X(t) = \frac{\lambda}{\lambda - t}$ για $t < \lambda$, οπότε $E(X) = \frac1\lambda$, $E(X^2) = \frac{2}{\lambda^2}$.</li></ul></div>
<div class="tbox"><h4>Φράγματα Chernoff</h4>
<p>Εφαρμόζοντας τη Markov στην $e^{tX}$: $P(X > \epsilon) \le \inf_{t>0}\frac{E(e^{tX})}{e^{t\epsilon}}$ (και ανάλογα για $t < 0$· οι σημειώσεις ονομάζουν την $P(X > \epsilon) \le E(e^{tX})/e^{t\epsilon}$ ανισότητα Bernstein). Για άθροισμα $X = X_1 + \dots + X_n$ <b>ανεξάρτητων</b> δίτιμων μεταβλητών με $P(X_i = 1) = p_i$ και $\mu = \sum_i p_i$:
$$P(X - \mu > \mu\epsilon) \le e^{-\mu\epsilon^2/3}\ \ (0 < \epsilon \le 1), \qquad P(X - \mu < -\mu\epsilon) \le e^{-\mu\epsilon^2/2}\ \ (0 < \epsilon < 1),$$
$$P(|X - \mu| > \mu\epsilon) \le 2e^{-\mu\epsilon^2/3}\ \ (0 < \epsilon < 1).$$
Π.χ. για $n$ ρίψεις αμερόληπτου νομίσματος, με $\epsilon = \sqrt{6\ln n/n}$ (για $n$ ώστε $\epsilon < 1$, δηλαδή $n \ge 19$): $P\left(\left|X - \frac n2\right| > \frac12\sqrt{6n\ln n}\right) \le \frac2n$.</p></div>
<div class="tbox tip"><h4>Chernoff ή Chebyshev;</h4>
<p>Η Chebyshev δίνει φράγμα που φθίνει ως $\frac1n$, ενώ το Chernoff φθίνει <b>εκθετικά</b> στο $\mu\epsilon^2$: για μεγάλες αποκλίσεις και μεγάλο $n$ είναι πολύ καλύτερο.</p></div>
<div class="tbox"><h4>Στην R</h4>
<p><code>exp(-500 * 0.2^2 / 3)</code> → <code>0.001272634</code> (φράγμα Chernoff για $1000$ ρίψεις, $\epsilon = 0{,}2$). Ροπές από ροπογεννήτρια με συμβολική παράγωγο: <code>D(quote((0.7 + 0.3*exp(t))^10), "t")</code> και υπολογισμός στο <code>t = 0</code>.</p></div>`,
  widget: "pscchern",
  gen: "pscmgf",
  exercises: [
    { level: 1, type: "fields", q: R`Αν $E(X) = 3$, ποια είναι η ελάχιστη δυνατή τιμή του $E(X^2)$ σύμφωνα με την ανισότητα Jensen;`,
      fields: [{ label: "E(X²) ≥", ans: 9 }], hint: R`$f(x) = x^2$ είναι κυρτή.`, sol: R`$(E(X))^2 \le E(X^2)$, άρα $E(X^2) \ge 9$ (ισότητα αν η $X$ είναι σταθερή).` },
    { level: 1, type: "fields", q: R`Αν $M_X(t) = (0{,}7 + 0{,}3e^t)^{10}$, να βρείτε τα $E(X)$ και $\text{Var}(X)$.`,
      fields: [{ label: "E(X) =", ans: 3 }, { label: "Var(X) =", ans: 2.1, tol: 0.001 }], hint: R`Ροπογεννήτρια της $b(10;\ 0{,}3)$.`, sol: R`$X \sim b(10;\ 0{,}3)$: $E(X) = 3$, $\text{Var}(X) = 10\cdot 0{,}3\cdot 0{,}7 = 2{,}1$.` },
    { level: 2, type: "fields", q: R`Αν $M_X(t) = e^{4(e^t - 1)}$, να βρείτε τα $E(X)$ και $E(X^2)$.`,
      fields: [{ label: "E(X) =", ans: 4 }, { label: "E(X²) =", ans: 20 }], hint: R`$X \sim \text{Poisson}(4)$.`, sol: R`$E(X) = M_X'(0) = 4$ και $E(X^2) = M_X''(0) = 4 + 16 = 20$.` },
    { level: 2, type: "fields", q: R`Αν $M_X(t) = \frac{2}{2 - t}$ για $t < 2$, να βρείτε τα $E(X)$ και $E(X^2)$.`,
      fields: [{ label: "E(X) =", ans: 0.5, tol: 0.001 }, { label: "E(X²) =", ans: 0.5, tol: 0.001 }], hint: R`$M_X'(t) = \frac{2}{(2-t)^2}$, $M_X''(t) = \frac{4}{(2-t)^3}$.`,
      sol: R`$E(X) = M_X'(0) = \frac24 = \frac12$, $E(X^2) = M_X''(0) = \frac48 = \frac12$ (εκθετική $E(2)$: $\frac1\lambda$ και $\frac{2}{\lambda^2}$).` },
    { level: 2, type: "fields", q: R`Ρίχνουμε ένα αμερόληπτο νόμισμα $1000$ φορές και $X$ είναι ο αριθμός των κορωνών ($\mu = 500$). Με το φράγμα Chernoff $P(X - \mu > \mu\epsilon) \le e^{-\mu\epsilon^2/3}$, να βρείτε άνω φράγμα για την $P(X > 550)$ (με 4 δεκαδικά).`,
      fields: [{ label: "φράγμα =", ans: 0.1889, tol: 0.0006 }], hint: R`$\mu\epsilon = 50 \Rightarrow \epsilon = 0{,}1$.`, sol: R`$e^{-500\cdot 0{,}01/3} = e^{-5/3} \approx 0{,}1889$.` },
    { level: 2, type: "fields", q: R`Με τα δεδομένα $1000$ ρίψεων αμερόληπτου νομίσματος ($\mu = 500$) και το φράγμα $P(X - \mu < -\mu\epsilon) \le e^{-\mu\epsilon^2/2}$, να βρείτε άνω φράγμα για την $P(X < 450)$ (με 4 δεκαδικά).`,
      fields: [{ label: "φράγμα =", ans: 0.0821, tol: 0.0006 }], hint: R`$\epsilon = 0{,}1$.`, sol: R`$e^{-500\cdot 0{,}01/2} = e^{-2{,}5} \approx 0{,}0821$.` },
    { level: 3, type: "fields", q: R`Για $1000$ ρίψεις αμερόληπτου νομίσματος ($\mu = 500$, $\text{Var}(X) = 250$), να συγκρίνετε τα φράγματα για την $P(|X - 500| > 100)$: της Chebyshev και του Chernoff $2e^{-\mu\epsilon^2/3}$ (με 4 δεκαδικά).`,
      fields: [{ label: "Chebyshev =", ans: 0.025, tol: 0.0006 }, { label: "Chernoff =", ans: 0.0025, tol: 0.0001 }], hint: R`$\mu\epsilon = 100 \Rightarrow \epsilon = 0{,}2$.`,
      sol: R`Chebyshev: $\frac{250}{100^2} = 0{,}025$. Chernoff: $2e^{-500\cdot 0{,}04/3} = 2e^{-6{,}667} \approx 0{,}0025$ — δέκα φορές καλύτερο φράγμα.` },
    { level: 2, type: "mc", q: R`Η ανισότητα $\big(E(X)\big)^2 \le E(X^2)$ προκύπτει από την ανισότητα Jensen με τη συνάρτηση:`,
      options: ["$f(x) = x^2$", "$f(x) = \\ln x$", "$f(x) = \\sqrt x$", "$f(x) = -x^2$"], correct: 0, hint: R`Χρειάζεται κυρτή συνάρτηση.`,
      sol: R`$f(x) = x^2$ είναι κυρτή ($f'' = 2 \ge 0$), άρα $f(E(X)) \le E(f(X))$. Οι $\ln x$, $\sqrt x$, $-x^2$ είναι κοίλες και δίνουν την αντίθετη ανισότητα.` },
    { level: 1, type: "mc", q: R`Αν οι $X$ και $Y$ είναι ανεξάρτητες, τότε $M_{X+Y}(t) = M_X(t)\,M_Y(t)$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`$e^{t(X+Y)} = e^{tX}e^{tY}$.`, sol: R`Σωστό: $E(e^{tX}e^{tY}) = E(e^{tX})E(e^{tY})$ λόγω ανεξαρτησίας.` },
    { level: 2, type: "fields", q: R`Τι επιστρέφει η εντολή της R <code>exp(-200 * 0.3^2 / 2)</code> (με 7 δεκαδικά); Ποιο φράγμα υπολογίζει, αν $\mu = 200$;`,
      fields: [{ label: "τιμή =", ans: 0.0001234, tol: 0.0000006 }], hint: R`$200\cdot 0{,}09/2 = 9$.`,
      sol: R`$e^{-9} \approx 0{,}0001234$: το φράγμα Chernoff $P(X - \mu < -0{,}3\mu) \le e^{-\mu\epsilon^2/2}$ για $\mu = 200$, $\epsilon = 0{,}3$.` }
  ]
},
/* ───────────────────────────── 5.3 ───────────────────────────── */
{
  id: "5.3", unit: 5, title: "Νόμος των μεγάλων αριθμών – Κεντρικό Οριακό Θεώρημα",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Ανισότητες, Στατιστική · Βλ. και Ross, Κεφ. 8",
  theory: R`
<div class="tbox"><h4>Δειγματικός μέσος</h4>
<p>Αν $X_1, \dots, X_n$ ανεξάρτητες με κοινή μέση τιμή $\mu$ και διασπορά $\sigma^2$, και $\bar X = \frac1n\sum X_i$, τότε
$$E(\bar X) = \mu, \qquad \text{Var}(\bar X) = \frac{\sigma^2}{n}, \qquad \sigma_{\bar X} = \frac{\sigma}{\sqrt n}\ \ (\text{τυπικό σφάλμα}).$$
Για το άθροισμα $S_n = \sum X_i$: $E(S_n) = n\mu$, $\text{Var}(S_n) = n\sigma^2$.</p></div>
<div class="tbox"><h4>Νόμος των μεγάλων αριθμών</h4>
<p>Από την ανισότητα Chebyshev (ενότητα 5.1) για τον $\bar X$: για κάθε $\epsilon > 0$,
$$P(|\bar X - \mu| \ge \epsilon) \le \frac{\sigma^2}{n\epsilon^2} \to 0 \quad (n \to \infty).$$
Αυτός είναι ο (ασθενής) νόμος των μεγάλων αριθμών: ο δειγματικός μέσος «σταθεροποιείται» γύρω από το $\mu$.</p></div>
<div class="tbox tip"><h4>Κεντρικό Οριακό Θεώρημα (ΚΟΘ)</h4>
<p>Αν οι $X_i$ είναι ανεξάρτητες, ισόνομες, με πεπερασμένη διασπορά, τότε για μεγάλο $n$ (πρακτικά $n \ge 30$)
$$\frac{\bar X - \mu}{\sigma/\sqrt n} \approx N(0, 1), \quad \text{δηλ.}\ \bar X \approx N\!\left(\mu, \frac{\sigma^2}{n}\right),\ \ S_n \approx N(n\mu, n\sigma^2),$$
<b>ανεξάρτητα</b> από την κατανομή των $X_i$.</p></div>
<div class="tbox warn"><h4>Κανονική προσέγγιση της διωνυμικής</h4>
<p>Αν $X \sim b(n, p)$ με $np \ge 5$ και $n(1 - p) \ge 5$: $X \approx N(np,\ np(1 - p))$. Επειδή η $X$ είναι διακριτή, χρησιμοποιούμε <b>διόρθωση συνέχειας</b>: $P(X \ge 60) \approx P(Y \ge 59{,}5)$, $P(X \le 40) \approx P(Y \le 40{,}5)$, $P(X = k) \approx P(k - 0{,}5 < Y < k + 0{,}5)$.</p></div>
<div class="tbox"><h4>Στην R</h4>
<p><code>pnorm(53, mean = 50, sd = 2, lower.tail = FALSE)</code> → <code>0.0668072</code> $= P(\bar X > 53)$ για $\bar X \approx N(50, 2^2)$.</p>
<p>Προσομοίωση του ΚΟΘ: <code>m &lt;- replicate(2000, mean(rexp(30, rate = 1))); hist(m)</code> — το ιστόγραμμα των δειγματικών μέσων είναι σχεδόν κανονικό, παρότι η εκθετική είναι ασύμμετρη.</p></div>`,
  widget: "psbclt",
  gen: "psbclt",
  exercises: [
    { level: 1, type: "fields", q: R`Πληθυσμός έχει $\mu = 50$ και $\sigma = 12$. Για τυχαίο δείγμα $n = 36$, να βρείτε τη μέση τιμή και την τυπική απόκλιση του $\bar X$.`,
      fields: [{ label: "E(X̄) =", ans: 50 }, { label: "σ_X̄ =", ans: 2 }], hint: R`$\sigma_{\bar X} = \sigma/\sqrt n$.`, sol: R`$E(\bar X) = 50$, $\ \sigma_{\bar X} = \frac{12}{\sqrt{36}} = 2$.` },
    { level: 1, type: "fields", q: R`Πληθυσμός έχει $\mu = 50$ και $\sigma = 12$ και παίρνουμε τυχαίο δείγμα $n = 36$. Να υπολογίσετε (με το ΚΟΘ) την $P(\bar X > 53)$. Δίνεται $\Phi(1{,}5) = 0{,}9332$.`,
      fields: [{ label: "P =", ans: 0.0668, tol: 0.0006 }], hint: R`$z = \frac{53 - 50}{2}$.`, sol: R`$z = 1{,}5$, $\ P(\bar X > 53) \approx 1 - \Phi(1{,}5) = 0{,}0668$.` },
    { level: 1, type: "fields", q: R`Ποιο κάτω φράγμα δίνει η ανισότητα Chebyshev για την $P(|X - \mu| < 2\sigma)$, για οποιαδήποτε κατανομή;`,
      fields: [{ label: "P ≥", ans: "3/4", tol: 0.001 }], hint: R`$P(|X - \mu| \ge 2\sigma) \le \frac14$.`, sol: R`$P(|X - \mu| < 2\sigma) \ge 1 - \frac{1}{2^2} = \frac34$. (Για κανονική είναι $\approx 0{,}95$· το φράγμα ισχύει όμως για κάθε κατανομή.)` },
    { level: 2, type: "fields", q: R`Ρίχνουμε ένα ζάρι $100$ φορές και $S$ είναι το άθροισμα των ενδείξεων. Για ένα ζάρι $\mu = 3{,}5$ και $\sigma^2 = \frac{35}{12}$. Να βρείτε τα $E(S)$ και $\text{Var}(S)$.`,
      fields: [{ label: "E(S) =", ans: 350 }, { label: "Var(S) =", ans: "875/3", tol: 0.001 }], hint: R`$E(S) = n\mu$, $\text{Var}(S) = n\sigma^2$.`,
      sol: R`$E(S) = 100\cdot 3{,}5 = 350$, $\ \text{Var}(S) = 100\cdot\frac{35}{12} = \frac{875}{3} \approx 291{,}67$.` },
    { level: 2, type: "fields", q: R`Ένα νόμισμα ρίχνεται $100$ φορές. Με κανονική προσέγγιση και διόρθωση συνέχειας, να υπολογίσετε την πιθανότητα να έρθουν <b>τουλάχιστον $60$</b> κεφαλές. Δίνεται $\Phi(1{,}9) = 0{,}9713$.`,
      fields: [{ label: "P =", ans: 0.0287, tol: 0.0006 }], hint: R`$np = 50$, $\sqrt{np(1 - p)} = 5$, και $P(X \ge 60) \approx P(Y \ge 59{,}5)$.`,
      sol: R`$P(X \ge 60) \approx P\!\left(Z \ge \frac{59{,}5 - 50}{5}\right) = 1 - \Phi(1{,}9) = 0{,}0287$.` },
    { level: 1, type: "mc", q: R`Τι λέει το Κεντρικό Οριακό Θεώρημα;`,
      options: ["Για μεγάλο $n$, ο δειγματικός μέσος ακολουθεί προσεγγιστικά κανονική κατανομή, όποια κι αν είναι η κατανομή του πληθυσμού (με πεπερασμένη διασπορά)", "Για μεγάλο $n$, ο πληθυσμός γίνεται κανονικός", "Ο δειγματικός μέσος είναι πάντα ίσος με το $\\mu$", "Ισχύει μόνο αν ο πληθυσμός είναι κανονικός"], correct: 0,
      hint: R`Αφορά την κατανομή του $\bar X$.`, sol: R`Το ΚΟΘ αφορά την <b>κατανομή του $\bar X$</b> (ή του αθροίσματος): για μεγάλο $n$ είναι περίπου $N(\mu, \sigma^2/n)$. Ο πληθυσμός δεν αλλάζει, και το $\bar X$ μεταβάλλεται από δείγμα σε δείγμα.` },
    { level: 1, type: "mc", q: R`Αν τετραπλασιάσουμε το μέγεθος του δείγματος, η τυπική απόκλιση του δειγματικού μέσου υποδιπλασιάζεται.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`$\sigma/\sqrt{4n}$.`, sol: R`Σωστό: $\frac{\sigma}{\sqrt{4n}} = \frac12\cdot\frac{\sigma}{\sqrt n}$.` },
    { level: 2, type: "fields", q: R`Ένας πληθυσμός έχει $\sigma = 4$. Πόσο μεγάλο πρέπει να είναι τουλάχιστον το δείγμα ώστε η τυπική απόκλιση του $\bar X$ να μην ξεπερνά το $0{,}5$;`,
      fields: [{ label: "n ≥", ans: 64 }], hint: R`$\frac{4}{\sqrt n} \le 0{,}5$.`, sol: R`$\sqrt n \ge 8 \Rightarrow n \ge 64$.` },
    { level: 3, type: "fields", q: R`Οι λάμπες ενός εργοστασίου έχουν μέση διάρκεια ζωής $800$ ώρες και τυπική απόκλιση $60$ ώρες. Για τυχαίο δείγμα $36$ λαμπών, ποια η πιθανότητα η μέση διάρκεια ζωής του δείγματος να είναι μικρότερη από $790$ ώρες; Δίνεται $\Phi(1) = 0{,}8413$.`,
      fields: [{ label: "P =", ans: 0.1587, tol: 0.0006 }], hint: R`$\sigma_{\bar X} = 60/6 = 10$.`,
      sol: R`Με ΚΟΘ, $\bar X \approx N(800, 10^2)$. $P(\bar X < 790) = \Phi\!\left(\frac{790 - 800}{10}\right) = \Phi(-1) = 1 - 0{,}8413 = 0{,}1587$. Δεν χρειάζεται να είναι κανονική η διάρκεια ζωής κάθε λάμπας.` },
    { level: 2, type: "fields", q: R`Τι επιστρέφει η εντολή της R <code>pnorm(790, mean = 800, sd = 10)</code> (με 4 δεκαδικά);`,
      fields: [{ label: "τιμή =", ans: 0.1587, tol: 0.0006 }], hint: R`<code>pnorm(x, μ, σ)</code> $= P(X \le x)$ για $X \sim N(\mu, \sigma^2)$.`, sol: R`$\Phi\!\left(\frac{790 - 800}{10}\right) = \Phi(-1) \approx 0{,}1587$.` }
  ]
},
/* ───────────────────────────── 6.1 ───────────────────────────── */
{
  id: "6.1", unit: 6, title: "Στοχαστικές ανελίξεις – Αλυσίδες Markov – Εξισώσεις Chapman–Kolmogorov",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Στοχαστικές ανελίξεις (Αλυσίδες Markov)",
  theory: R`
<div class="tbox"><h4>Στοχαστική ανέλιξη</h4>
<p>Στοχαστική ανέλιξη με χώρο καταστάσεων $E$ είναι μια συλλογή $\{X_t,\ t \in T\}$ τυχαίων μεταβλητών με τιμές στο $E$. Αν το $T$ είναι αριθμήσιμο (π.χ. $T = \{0, 1, 2, \dots\}$) η ανέλιξη είναι <b>διακριτού χρόνου</b>· αν το $T$ είναι διάστημα (π.χ. $[0, \infty)$), <b>συνεχούς χρόνου</b>. Παραδείγματα: ο αριθμός γεγονότων στο $[0, t]$ (ανέλιξη Poisson), τα μερικά αθροίσματα $S_n = S_{n-1} + X_n$ (τυχαίος περίπατος).</p></div>
<div class="tbox"><h4>Αλυσίδα Markov</h4>
<p>Η $\{X_n,\ n = 0, 1, \dots\}$ είναι <b>αλυσίδα Markov</b> αν
$$P(X_{n+1} = y \mid X_0, X_1, \dots, X_n) = P(X_{n+1} = y \mid X_n)$$
(<b>Μαρκοβιανή ιδιότητα</b>: δεδομένου του παρόντος, το μέλλον είναι ανεξάρτητο από το παρελθόν). Η <b>πιθανότητα μετάβασης</b> $P(x, y) = P(X_{n+1} = y \mid X_n = x)$ δεν εξαρτάται από το $n$ (ομογενής στον χρόνο αλυσίδα). Τις τοποθετούμε στον <b>πίνακα μετάβασης</b> $P$: μη αρνητικά στοιχεία με <b>άθροισμα κάθε γραμμής ίσο με $1$</b> (στοχαστικός πίνακας). Μια κατάσταση με $P(x, x) = 1$ λέγεται <b>απορροφητική</b>.</p>
<p>Με αρχική κατανομή $\pi_0(x) = P(X_0 = x)$: $P(X_0 = x_0, \dots, X_n = x_n) = \pi_0(x_0)P(x_0, x_1)\cdots P(x_{n-1}, x_n)$.</p></div>
<div class="tbox tip"><h4>Εξισώσεις Chapman–Kolmogorov</h4>
<p>Η πιθανότητα μετάβασης $m$ βημάτων $P^m(x, y) = P(X_{n+m} = y \mid X_n = x)$ ικανοποιεί
$$P^{n+m}(x, y) = \sum_{z \in E} P^n(x, z)P^m(z, y),$$
δηλαδή είναι το στοιχείο $(x, y)$ της δύναμης $P^{n+m}$ του πίνακα μετάβασης ($P^0 = I$). Αν $\pi_n$ είναι η κατανομή της $X_n$ (διάνυσμα-γραμμή): $\pi_n = \pi_0 P^n$ και $\pi_{n+1} = \pi_n P$.</p></div>
<div class="tbox"><h4>Παραδείγματα</h4>
<ul><li><b>Τυχαίος περίπατος – καταστροφή παίκτη:</b> από το $x$ στο $x + 1$ με πιθανότητα $p_x$, στο $x - 1$ με $q_x$, μένει με $r_x$· το $0$ απορροφητικό.</li>
<li><b>Αλυσίδα του Ehrenfest:</b> $r$ σφαίρες σε δύο δοχεία· διαλέγουμε τυχαία μία και την αλλάζουμε δοχείο. Αν $X_n$ οι σφαίρες στο Α: $P(x, x - 1) = \frac xr$, $P(x, x + 1) = 1 - \frac xr$.</li>
<li><b>Γενετική:</b> $P(x, y) = \binom{2x}{y}\binom{2N - 2x}{N - y}\Big/\binom{2N}{N}$, με απορροφητικές τις $0$ και $N$.</li></ul></div>
<div class="tbox"><h4>Στην R</h4>
<p><code>P &lt;- matrix(c(0.7, 0.3, 0.4, 0.6), 2, byrow = TRUE); P %*% P</code> → <code>0.61 0.39 / 0.52 0.48</code>. Κατανομή μετά από $n$ βήματα: <code>p0 %*% P %*% P %*% P</code> (ή με βρόχο <code>for</code>).</p></div>`,
  widget: "pscmarkov",
  gen: "pscmc",
  exercises: [
    { level: 1, type: "fields", q: R`Στον πίνακα μετάβασης μιας αλυσίδας Markov με τρεις καταστάσεις, η πρώτη γραμμή είναι $(0{,}2;\ a;\ 0{,}5)$. Ποια είναι η τιμή του $a$;`,
      fields: [{ label: "a =", ans: 0.3, tol: 0.001 }], hint: R`Κάθε γραμμή έχει άθροισμα $1$.`, sol: R`$0{,}2 + a + 0{,}5 = 1 \Rightarrow a = 0{,}3$.` },
    { level: 1, type: "fields", q: R`Ο καιρός σε μια πόλη ακολουθεί αλυσίδα Markov με καταστάσεις $0$ = ηλιοφάνεια, $1$ = βροχή και $P = \begin{pmatrix}0{,}7 & 0{,}3 \\ 0{,}4 & 0{,}6\end{pmatrix}$. Αν σήμερα έχει ηλιοφάνεια, ποια η πιθανότητα μεθαύριο να έχει ηλιοφάνεια;`,
      fields: [{ label: "P²(0,0) =", ans: 0.61, tol: 0.001 }], hint: R`$P^2(0, 0) = P(0, 0)P(0, 0) + P(0, 1)P(1, 0)$.`, sol: R`$0{,}7\cdot 0{,}7 + 0{,}3\cdot 0{,}4 = 0{,}49 + 0{,}12 = 0{,}61$.` },
    { level: 2, type: "fields", q: R`Αλυσίδα Markov με καταστάσεις $\{0, 1\}$ και $P = \begin{pmatrix}0{,}7 & 0{,}3 \\ 0{,}4 & 0{,}6\end{pmatrix}$ έχει αρχική κατανομή $\pi_0 = (0{,}5;\ 0{,}5)$. Να βρείτε την κατανομή $\pi_1$ της $X_1$.`,
      fields: [{ label: "P(X₁ = 0) =", ans: 0.55, tol: 0.001 }, { label: "P(X₁ = 1) =", ans: 0.45, tol: 0.001 }], hint: R`$\pi_1 = \pi_0 P$.`, sol: R`$P(X_1 = 0) = 0{,}5\cdot 0{,}7 + 0{,}5\cdot 0{,}4 = 0{,}55$ και $P(X_1 = 1) = 0{,}45$.` },
    { level: 2, type: "fields", q: R`Αλυσίδα Markov με $E = \{1, 2, 3\}$ έχει πίνακα μετάβασης $P = \begin{pmatrix}0{,}3 & 0{,}5 & 0{,}2 \\ 0{,}6 & 0 & 0{,}4 \\ 0 & 0{,}4 & 0{,}6\end{pmatrix}$. Να βρείτε την $P^2(1, 3) = P(X_{n+2} = 3 \mid X_n = 1)$.`,
      fields: [{ label: "P²(1,3) =", ans: 0.38, tol: 0.001 }], hint: R`$\sum_z P(1, z)P(z, 3)$.`, sol: R`$0{,}3\cdot 0{,}2 + 0{,}5\cdot 0{,}4 + 0{,}2\cdot 0{,}6 = 0{,}06 + 0{,}20 + 0{,}12 = 0{,}38$.` },
    { level: 2, type: "fields", q: R`Αλυσίδα Markov με $E = \{1, 2, 3\}$ και $P = \begin{pmatrix}0{,}3 & 0{,}5 & 0{,}2 \\ 0{,}6 & 0 & 0{,}4 \\ 0 & 0{,}4 & 0{,}6\end{pmatrix}$ ξεκινά από ομοιόμορφη αρχική κατανομή $\pi_0 = \left(\frac13, \frac13, \frac13\right)$. Να βρείτε την $P(X_0 = 1, X_1 = 2, X_2 = 3)$.`,
      fields: [{ label: "P =", ans: "1/15", tol: 0.001 }], hint: R`$\pi_0(1)P(1, 2)P(2, 3)$.`, sol: R`$\frac13\cdot 0{,}5\cdot 0{,}4 = \frac{0{,}2}{3} = \frac1{15}$.` },
    { level: 1, type: "mc", q: R`Μια κατάσταση $x$ αλυσίδας Markov λέγεται απορροφητική όταν:`,
      options: ["$P(x, x) = 1$", "$P(x, x) = 0$", "$P(x, y) > 0$ για κάθε $y$", "όλες οι γραμμές του $P$ είναι ίσες με τη γραμμή της $x$"], correct: 0, hint: R`Μόλις φθάσει εκεί, η αλυσίδα δεν φεύγει.`,
      sol: R`Απορροφητική: $P(x, x) = 1$ (ισοδύναμα $P(x, y) = 0$ για $y \ne x$), π.χ. το $0$ στο πρόβλημα καταστροφής του παίκτη.` },
    { level: 2, type: "fields", q: R`Στην αλυσίδα του Ehrenfest με $r = 4$ σφαίρες (σε κάθε βήμα διαλέγουμε τυχαία μία από τις $4$ σφαίρες και την αλλάζουμε δοχείο), $X_n$ είναι ο αριθμός σφαιρών στο δοχείο Α. Να βρείτε τις $P(3, 2)$ και $P(3, 4)$.`,
      fields: [{ label: "P(3,2) =", ans: "3/4", tol: 0.001 }, { label: "P(3,4) =", ans: "1/4", tol: 0.001 }], hint: R`$P(x, x - 1) = \frac xr$.`,
      sol: R`Με $3$ σφαίρες στο Α, η επιλεγμένη σφαίρα είναι στο Α με πιθανότητα $\frac34$ (τότε $X_{n+1} = 2$) και στο Β με $\frac14$ (τότε $X_{n+1} = 4$).` },
    { level: 3, type: "fields", q: R`Για την αλυσίδα με $P = \begin{pmatrix}0{,}7 & 0{,}3 \\ 0{,}4 & 0{,}6\end{pmatrix}$, να βρείτε την $P^3(0, 0)$ χρησιμοποιώντας τις εξισώσεις Chapman–Kolmogorov.`,
      fields: [{ label: "P³(0,0) =", ans: 0.583, tol: 0.0006 }], hint: R`$P^2 = \begin{pmatrix}0{,}61 & 0{,}39 \\ 0{,}52 & 0{,}48\end{pmatrix}$ και $P^3(0, 0) = \sum_z P^2(0, z)P(z, 0)$.`,
      sol: R`$P^3(0, 0) = P^2(0, 0)P(0, 0) + P^2(0, 1)P(1, 0) = 0{,}61\cdot 0{,}7 + 0{,}39\cdot 0{,}4 = 0{,}427 + 0{,}156 = 0{,}583$.` },
    { level: 1, type: "mc", q: R`Σε κάθε πίνακα μετάβασης αλυσίδας Markov, τα στοιχεία κάθε <b>στήλης</b> έχουν άθροισμα $1$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Η γραμμή $x$ είναι η κατανομή της επόμενης κατάστασης όταν $X_n = x$.`,
      sol: R`Λάθος: άθροισμα $1$ έχει κάθε <b>γραμμή</b>, $\sum_y P(x, y) = 1$. Οι στήλες γενικά όχι (π.χ. η στήλη $0$ του $\begin{pmatrix}0{,}7 & 0{,}3 \\ 0{,}4 & 0{,}6\end{pmatrix}$ έχει άθροισμα $1{,}1$).` },
    { level: 2, type: "fields", q: R`Τι επιστρέφει η R για <code>P &lt;- matrix(c(0.7, 0.3, 0.4, 0.6), 2, byrow = TRUE); (P %*% P)[1, 2]</code>;`,
      fields: [{ label: "τιμή =", ans: 0.39, tol: 0.001 }], hint: R`Το στοιχείο $(1, 2)$ του $P^2$ (η R αριθμεί από το $1$).`, sol: R`$P^2(0, 1) = 0{,}7\cdot 0{,}3 + 0{,}3\cdot 0{,}6 = 0{,}21 + 0{,}18 = 0{,}39$.` }
  ]
},
/* ───────────────────────────── 6.2 ───────────────────────────── */
{
  id: "6.2", unit: 6, title: "Χαρακτηρισμός καταστάσεων – Στάσιμες κατανομές",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Στοχαστικές ανελίξεις (χαρακτηρισμός καταστάσεων, στάσιμες κατανομές)",
  theory: R`
<div class="tbox"><h4>Επαναληπτικές και μεταβατικές καταστάσεις</h4>
<p>Έστω $T_y = \min\{n > 0: X_n = y\}$ ο χρόνος πρώτης επίσκεψης στο $y$ και $\rho_{xy} = P(T_y < \infty \mid X_0 = x)$. Η κατάσταση $x$ λέγεται <b>επαναληπτική</b> αν $\rho_{xx} = 1$ (η αλυσίδα επιστρέφει σίγουρα — και τότε άπειρες φορές) και <b>μεταβατική</b> αν $\rho_{xx} < 1$. Κάθε απορροφητική κατάσταση είναι επαναληπτική.</p>
<p>Γράφουμε $x \to y$ ($y$ προσιτή από $x$) αν $\rho_{xy} > 0$, ισοδύναμα $P^n(x, y) > 0$ για κάποιο $n \ge 1$· η σχέση είναι μεταβατική. Αν $x$ επαναληπτική και $x \to y$, τότε και $y \to x$ και η $y$ είναι επαναληπτική. Άρα αν $x \to y$ αλλά όχι $y \to x$, η $x$ είναι μεταβατική.</p></div>
<div class="tbox"><h4>Κλειστά και ανάγωγα σύνολα</h4>
<p>Ένα σύνολο $C$ είναι <b>κλειστό</b> αν από το $C$ δεν φθάνουμε εκτός $C$ ($P^n(x, y) = 0$ για $x \in C$, $y \notin C$), και <b>ανάγωγο</b> αν επιπλέον κάθε κατάσταση του είναι προσιτή από κάθε άλλη. Ένα πεπερασμένο κλειστό ανάγωγο σύνολο έχει όλες τις καταστάσεις επαναληπτικές· γι' αυτό μια αλυσίδα με πεπερασμένο χώρο καταστάσεων <b>δεν</b> μπορεί να έχει όλες τις καταστάσεις μεταβατικές. Στην πράξη σχεδιάζουμε το <b>γράφημα μετάβασης</b> (βέλος $x \to y$ όταν $P(x, y) > 0$).</p></div>
<div class="tbox tip"><h4>Στάσιμη κατανομή</h4>
<p>Η $\pi$ είναι <b>στάσιμη κατανομή</b> αν $\pi(x) \ge 0$, $\sum_x \pi(x) = 1$ και $\sum_x \pi(x)P(x, y) = \pi(y)$ για κάθε $y$, δηλαδή $\pi P = \pi$ (και τότε $\pi P^n = \pi$ για κάθε $n$). Αν επιπλέον $\lim_{n\to\infty}P^n(x, y) = \pi(y)$, η $\pi$ είναι η κατανομή σταθερής κατάστασης: για μεγάλο $n$ η κατανομή της $X_n$ είναι περίπου $\pi$, όποια κι αν είναι η αρχική. Αυτό μπορεί να αποτύχει για <b>περιοδικές</b> αλυσίδες (π.χ. στην αλυσίδα Ehrenfest οι $P^n$ εναλλάσσονται).</p>
<p><b>Μοναδικότητα:</b> αν η αλυσίδα είναι <b>ανάγωγη</b> με πεπερασμένο χώρο καταστάσεων, υπάρχει μοναδική στάσιμη κατανομή. Χωρίς αναγωγιμότητα μπορεί να υπάρχουν άπειρες (π.χ. καταστροφή παίκτη: κάθε $\pi$ με $\pi(0) + \pi(N) = 1$ και $0$ αλλού είναι στάσιμη).</p>
<p><b>Υπολογισμός:</b> λύνουμε $\pi P = \pi$ (για ανάγωγη αλυσίδα μία εξίσωση είναι περιττή) μαζί με $\sum\pi(x) = 1$. Για δύο καταστάσεις με $P(0, 1) = a$, $P(1, 0) = b$: $\pi = \left(\frac{b}{a + b}, \frac{a}{a + b}\right)$. Π.χ. για $P = \begin{pmatrix}0{,}3 & 0{,}5 & 0{,}2 \\ 0{,}6 & 0 & 0{,}4 \\ 0 & 0{,}4 & 0{,}6\end{pmatrix}$ βρίσκουμε $\pi = \left(\frac{6}{23}, \frac{7}{23}, \frac{10}{23}\right)$.</p></div>
<div class="tbox"><h4>Αλυσίδα γεννήσεων–θανάτων</h4>
<p>Στον περίπατο στους μη αρνητικούς ακεραίους με $P(x, x + 1) = p$, $P(x, x - 1) = q$ ($x \ge 1$), $P(0, 0) = q$, $P(0, 1) = p$: στάσιμη κατανομή υπάρχει αν και μόνο αν $p < q$, και τότε $\pi(x) = \left(1 - \frac pq\right)\left(\frac pq\right)^x$, $x = 0, 1, 2, \dots$ (γεωμετρική).</p></div>
<div class="tbox"><h4>Στην R</h4>
<p>Δυνάμεις του $P$: <code>P &lt;- matrix(c(0.8, 0.2, 0.5, 0.5), 2, byrow = TRUE); P5 &lt;- P %*% P %*% P %*% P %*% P; P5[1, 1]</code> → <code>0.71498</code>, κοντά στο $\pi(0) = \frac57 \approx 0{,}7143$. Ακριβώς: <code>v &lt;- Re(eigen(t(P))[["vectors"]][, 1]); v/sum(v)</code> → <code>0.7142857 0.2857143</code>.</p></div>`,
  widget: "pscmarkov",
  gen: "pscstat",
  exercises: [
    { level: 1, type: "fields", q: R`Αλυσίδα Markov με καταστάσεις $\{0, 1\}$ έχει $P = \begin{pmatrix}0{,}7 & 0{,}3 \\ 0{,}4 & 0{,}6\end{pmatrix}$. Να βρείτε τη στάσιμη κατανομή.`,
      fields: [{ label: "π(0) =", ans: "4/7", tol: 0.001 }, { label: "π(1) =", ans: "3/7", tol: 0.001 }], hint: R`$\pi(0)\cdot 0{,}3 = \pi(1)\cdot 0{,}4$ και $\pi(0) + \pi(1) = 1$.`,
      sol: R`$\pi(0) = \frac{0{,}4}{0{,}3 + 0{,}4} = \frac47$, $\pi(1) = \frac37$.` },
    { level: 2, type: "fields", q: R`Για την αλυσίδα με $E = \{1, 2, 3\}$ και $P = \begin{pmatrix}0{,}3 & 0{,}5 & 0{,}2 \\ 0{,}6 & 0 & 0{,}4 \\ 0 & 0{,}4 & 0{,}6\end{pmatrix}$, να βρείτε τη στάσιμη πιθανότητα $\pi(3)$.`,
      fields: [{ label: "π(3) =", ans: "10/23", tol: 0.001 }], hint: R`Θέστε $\pi(1) = 60$, λύστε $-0{,}7\pi(1) + 0{,}6\pi(2) = 0$, $0{,}5\pi(1) - \pi(2) + 0{,}4\pi(3) = 0$ και κανονικοποιήστε.`,
      sol: R`Με $\pi(1) = 60$: $\pi(2) = 70$, $\pi(3) = 100$. Κανονικοποίηση: $\pi = \left(\frac{6}{23}, \frac{7}{23}, \frac{10}{23}\right)$, άρα $\pi(3) = \frac{10}{23}$.` },
    { level: 2, type: "mc", q: R`Αλυσίδα με $E = \{0, 1, 2, 3, 4\}$ έχει $P = \begin{pmatrix}1/2 & 0 & 1/2 & 0 & 0 \\ 0 & 1/4 & 0 & 3/4 & 0 \\ 0 & 0 & 1/3 & 0 & 2/3 \\ 1/4 & 1/2 & 0 & 1/4 & 0 \\ 1/3 & 0 & 1/3 & 0 & 1/3\end{pmatrix}$. Ποιες καταστάσεις είναι μεταβατικές;`,
      options: ["οι $1$ και $3$", "οι $0$, $2$ και $4$", "όλες", "καμία"], correct: 0,
      hint: R`Βρείτε κλειστά σύνολα από το γράφημα μετάβασης.`,
      sol: R`Το $\{0, 2, 4\}$ είναι κλειστό και ανάγωγο (και πεπερασμένο), άρα οι $0, 2, 4$ είναι επαναληπτικές. Από το $\{1, 3\}$ φθάνουμε στο $\{0, 2, 4\}$ (π.χ. $3 \to 0$) χωρίς επιστροφή, άρα οι $1, 3$ είναι μεταβατικές.` },
    { level: 1, type: "mc", q: R`Μια αλυσίδα Markov με <b>πεπερασμένο</b> χώρο καταστάσεων μπορεί να έχει όλες τις καταστάσεις της μεταβατικές.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Σε άπειρο χρόνο η αλυσίδα επισκέπτεται κάθε μεταβατική κατάσταση μόνο πεπερασμένες φορές (με πιθανότητα 1)· με πεπερασμένες καταστάσεις, κάπου πρέπει να επιστρέφει άπειρες φορές.`,
      sol: R`Λάθος: με πεπερασμένο χώρο καταστάσεων υπάρχει πάντα τουλάχιστον μία επαναληπτική κατάσταση — αλλιώς η αλυσίδα θα έπρεπε κάποια στιγμή να «εγκαταλείψει» όλες τις καταστάσεις.` },
    { level: 2, type: "fields", q: R`Τυχαίος περίπατος στους μη αρνητικούς ακεραίους με $P(x, x + 1) = 0{,}3$, $P(x, x - 1) = 0{,}7$ για $x \ge 1$, $P(0, 0) = 0{,}7$, $P(0, 1) = 0{,}3$. Να βρείτε τις στάσιμες πιθανότητες $\pi(0)$ και $\pi(2)$.`,
      fields: [{ label: "π(0) =", ans: "4/7", tol: 0.001 }, { label: "π(2) =", ans: "36/343", tol: 0.001 }], hint: R`$\pi(x) = \left(1 - \frac pq\right)\left(\frac pq\right)^x$ με $\frac pq = \frac37$.`,
      sol: R`$\pi(0) = 1 - \frac37 = \frac47$, $\pi(2) = \frac47\cdot\frac{9}{49} = \frac{36}{343} \approx 0{,}105$.` },
    { level: 1, type: "mc", q: R`Κάθε απορροφητική κατάσταση είναι επαναληπτική.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Αν $P(x, x) = 1$, πόση είναι η $\rho_{xx}$;`, sol: R`Σωστό: αφού $P(x, x) = 1$, η αλυσίδα επιστρέφει στο $x$ ήδη στο επόμενο βήμα, οπότε $\rho_{xx} = 1$.` },
    { level: 3, type: "fields", q: R`Αλυσίδα με $E = \{0, 1, 2\}$ έχει $P = \begin{pmatrix}0{,}5 & 0{,}5 & 0 \\ 0{,}25 & 0{,}5 & 0{,}25 \\ 0 & 0{,}5 & 0{,}5\end{pmatrix}$. Να βρείτε τη στάσιμη κατανομή.`,
      fields: [{ label: "π(0) =", ans: 0.25, tol: 0.001 }, { label: "π(1) =", ans: 0.5, tol: 0.001 }, { label: "π(2) =", ans: 0.25, tol: 0.001 }], hint: R`Από τη στήλη $0$: $\pi(0) = 0{,}5\pi(0) + 0{,}25\pi(1)$.`,
      sol: R`$\pi(0) = 0{,}5\pi(0) + 0{,}25\pi(1) \Rightarrow \pi(1) = 2\pi(0)$, και από συμμετρία $\pi(2) = \pi(0)$. Με $\pi(0) + 2\pi(0) + \pi(0) = 1$: $\pi = (0{,}25;\ 0{,}5;\ 0{,}25)$.` },
    { level: 2, type: "fields", q: R`Σε μια πόλη, μετά από ηλιόλουστη ημέρα βρέχει με πιθανότητα $0{,}2$, και μετά από βροχερή ημέρα βρέχει ξανά με πιθανότητα $0{,}5$ (αλυσίδα Markov). Σε μακρά χρονική περίοδο, τι ποσοστό των ημερών είναι βροχερές;`,
      fields: [{ label: "π(βροχή) =", ans: "2/7", tol: 0.001 }], hint: R`$a = P(\text{ήλιος} \to \text{βροχή}) = 0{,}2$, $b = P(\text{βροχή} \to \text{ήλιος}) = 0{,}5$.`,
      sol: R`$\pi(\text{βροχή}) = \frac{a}{a + b} = \frac{0{,}2}{0{,}7} = \frac27 \approx 28{,}6\%$.` },
    { level: 2, type: "mc", q: R`Για τον περίπατο στους μη αρνητικούς ακεραίους με $P(x, x + 1) = p$, $P(x, x - 1) = q$ ($x \ge 1$), $P(0, 0) = q$, $P(0, 1) = p$ και $p \ge q$:`,
      options: ["δεν υπάρχει στάσιμη κατανομή", "η στάσιμη κατανομή είναι η ομοιόμορφη", "η στάσιμη κατανομή είναι $\\pi(x) = \\left(1 - \\frac pq\\right)\\left(\\frac pq\\right)^x$", "η στάσιμη κατανομή συγκεντρώνεται στο $0$"], correct: 0,
      hint: R`Πότε συγκλίνει το $\sum_x \left(\frac pq\right)^x$;`, sol: R`Η λύση της $\pi P = \pi$ είναι $\pi(x) = C\left(\frac pq\right)^x$· για $p \ge q$ η σειρά $\sum\left(\frac pq\right)^x$ αποκλίνει, άρα καμία κανονικοποίηση δεν δίνει άθροισμα $1$: στάσιμη κατανομή δεν υπάρχει.` },
    { level: 2, type: "fields", q: R`Τι επιστρέφει η R για <code>P &lt;- matrix(c(0.8, 0.2, 0.5, 0.5), 2, byrow = TRUE); P2 &lt;- P %*% P; P2[2, 1]</code>;`,
      fields: [{ label: "τιμή =", ans: 0.65, tol: 0.001 }], hint: R`Το στοιχείο (γραμμή 2, στήλη 1) του $P^2$.`, sol: R`$0{,}5\cdot 0{,}8 + 0{,}5\cdot 0{,}5 = 0{,}4 + 0{,}25 = 0{,}65$.` }
  ]
},
/* ───────────────────────────── 6.3 ───────────────────────────── */
{
  id: "6.3", unit: 6, title: "Τυχαίοι περίπατοι – Πρόβλημα καταστροφής του παίκτη",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Στοχαστικές ανελίξεις (τυχαίος περίπατος, αλυσίδα καταστροφής παίκτη)",
  theory: R`
<div class="tbox"><h4>Τυχαίος περίπατος</h4>
<p>Αν $X_1, X_2, \dots$ είναι ανεξάρτητες και ισόνομες και $S_0 = 0$, $S_n = S_{n-1} + X_n$, η $\{S_n\}$ λέγεται <b>τυχαίος περίπατος</b>. Στον <b>απλό</b> τυχαίο περίπατο $X_i = +1$ με πιθανότητα $p$ και $-1$ με $q = 1 - p$ (συμμετρικός για $p = \frac12$). Είναι αλυσίδα Markov στους ακεραίους με $P(x, x + 1) = p$, $P(x, x - 1) = q$.</p>
<ul><li>$E(S_n) = n(p - q)$, $\text{Var}(S_n) = 4npq$ (αφού $E(X_i) = p - q$, $\text{Var}(X_i) = 4pq$).</li>
<li>Αν $Y$ ο αριθμός των βημάτων $+1$, τότε $Y \sim b(n, p)$ και $S_n = 2Y - n$: $P(S_n = k) = \binom{n}{\frac{n+k}{2}}p^{(n+k)/2}q^{(n-k)/2}$, όταν $n + k$ άρτιος (αλλιώς $0$).</li></ul></div>
<div class="tbox"><h4>Πρόβλημα καταστροφής του παίκτη</h4>
<p>Ο παίκτης έχει κεφάλαιο $k$ και σε κάθε γύρο κερδίζει $1$ με πιθανότητα $p$ ή χάνει $1$ με $q$. Σταματά όταν φθάσει το $N$ ή το $0$ (καταστροφή): αλυσίδα Markov στο $\{0, 1, \dots, N\}$ με <b>απορροφητικές</b> καταστάσεις $0$ και $N$. Αν $a_k = P(\text{φθάνει στο } N \mid X_0 = k)$, τότε $a_k = p\,a_{k+1} + q\,a_{k-1}$ με $a_0 = 0$, $a_N = 1$, και
$$a_k = \begin{cases}\dfrac{1 - (q/p)^k}{1 - (q/p)^N}, & p \ne q, \\[2mm] \dfrac kN, & p = q = \frac12.\end{cases}$$</p></div>
<div class="tbox tip"><h4>Διάρκεια και παρατηρήσεις</h4>
<p><i>(Εμπλουτισμός)</i> Για $p = \frac12$ η αναμενόμενη διάρκεια του παιχνιδιού είναι $k(N - k)$ γύροι. Αν ο αντίπαλος έχει άπειρο κεφάλαιο ($N \to \infty$) και $p \le q$, η καταστροφή είναι βέβαιη· για $p > q$ η πιθανότητα καταστροφής είναι $(q/p)^k$.</p></div>
<div class="tbox"><h4>Στην R</h4>
<p><code>dbinom(3, 4, 0.5)</code> → <code>0.25</code> $= P(S_4 = 2)$ για συμμετρικό περίπατο. Προσομοίωση διαδρομής: <code>cumsum(sample(c(-1, 1), 20, replace = TRUE, prob = c(0.5, 0.5)))</code>.</p></div>`,
  widget: "pscwalk",
  gen: "pscrw",
  exercises: [
    { level: 1, type: "fields", q: R`Για συμμετρικό απλό τυχαίο περίπατο με $S_0 = 0$, να βρείτε τα $E(S_{10})$ και $\text{Var}(S_{10})$.`,
      fields: [{ label: "E(S₁₀) =", ans: 0 }, { label: "Var(S₁₀) =", ans: 10 }], hint: R`$E(X_i) = 0$, $\text{Var}(X_i) = 1$.`, sol: R`$E(S_{10}) = 0$, $\text{Var}(S_{10}) = 10\cdot 1 = 10$ ($4npq = 4\cdot 10\cdot\frac14$).` },
    { level: 1, type: "fields", q: R`Απλός τυχαίος περίπατος με $p = 0{,}6$ και $S_0 = 0$. Να βρείτε τα $E(S_{10})$ και $\text{Var}(S_{10})$.`,
      fields: [{ label: "E(S₁₀) =", ans: 2 }, { label: "Var(S₁₀) =", ans: 9.6, tol: 0.001 }], hint: R`$E(S_n) = n(p - q)$, $\text{Var}(S_n) = 4npq$.`, sol: R`$E = 10\cdot 0{,}2 = 2$, $\text{Var} = 4\cdot 10\cdot 0{,}6\cdot 0{,}4 = 9{,}6$.` },
    { level: 2, type: "fields", q: R`Συμμετρικός απλός τυχαίος περίπατος ξεκινά από το $0$. Ποια η πιθανότητα $P(S_4 = 2)$;`,
      fields: [{ label: "P =", ans: "1/4", tol: 0.001 }], hint: R`$3$ βήματα πάνω και $1$ κάτω.`, sol: R`$P(S_4 = 2) = \binom43\frac1{2^4} = \frac{4}{16} = \frac14$.` },
    { level: 2, type: "fields", q: R`Συμμετρικός απλός τυχαίος περίπατος ξεκινά από το $0$. Ποια η πιθανότητα να βρίσκεται ξανά στο $0$ μετά από $6$ βήματα;`,
      fields: [{ label: "P =", ans: "5/16", tol: 0.001 }], hint: R`$3$ βήματα πάνω, $3$ κάτω.`, sol: R`$P(S_6 = 0) = \binom63\frac{1}{2^6} = \frac{20}{64} = \frac{5}{16}$.` },
    { level: 2, type: "fields", q: R`Ένας παίκτης ξεκινά με $3$ ευρώ και σε κάθε γύρο κερδίζει ή χάνει $1$ ευρώ με πιθανότητα $\frac12$. Σταματά στα $10$ ευρώ ή στο $0$. Ποια η πιθανότητα να φθάσει τα $10$ ευρώ και ποια η πιθανότητα καταστροφής;`,
      fields: [{ label: "P(10) =", ans: 0.3, tol: 0.001 }, { label: "P(0) =", ans: 0.7, tol: 0.001 }], hint: R`$a_k = \frac kN$.`, sol: R`$a_3 = \frac{3}{10} = 0{,}3$ και $P(\text{καταστροφή}) = 0{,}7$.` },
    { level: 2, type: "fields", q: R`Σε παιχνίδι ο παίκτης κερδίζει $1$ μονάδα με πιθανότητα $p = 0{,}4$ και χάνει $1$ με $q = 0{,}6$. Ξεκινά με $2$ μονάδες και σταματά στο $0$ ή στις $4$. Ποια η πιθανότητα να φθάσει τις $4$ μονάδες;`,
      fields: [{ label: "P =", ans: "4/13", tol: 0.001 }], hint: R`$\frac qp = 1{,}5$.`, sol: R`$a_2 = \frac{1 - 1{,}5^2}{1 - 1{,}5^4} = \frac{-1{,}25}{-4{,}0625} = \frac{4}{13} \approx 0{,}3077$.` },
    { level: 3, type: "fields", q: R`<i>(Εμπλουτισμός)</i> Ένας παίκτης ξεκινά με $5$ ευρώ και σε κάθε γύρο κερδίζει ή χάνει $1$ ευρώ με πιθανότητα $\frac12$. Σταματά στα $10$ ευρώ ή στο $0$. Πόσοι γύροι αναμένονται μέχρι τη λήξη;`,
      fields: [{ label: "E(T) =", ans: 25 }], hint: R`$k(N - k)$.`, sol: R`$E(T) = 5\cdot(10 - 5) = 25$ γύροι.` },
    { level: 1, type: "mc", q: R`Στην αλυσίδα καταστροφής του παίκτη στο $\{0, 1, \dots, N\}$, οι καταστάσεις $0$ και $N$ είναι:`,
      options: ["απορροφητικές", "μεταβατικές", "οι μόνες μη προσιτές καταστάσεις", "καταστάσεις με $P(x, x) = 0$"], correct: 0, hint: R`Το παιχνίδι σταματά.`,
      sol: R`Απορροφητικές: $P(0, 0) = P(N, N) = 1$. Οι $1, \dots, N - 1$ είναι μεταβατικές.` },
    { level: 1, type: "mc", q: R`Στον απλό τυχαίο περίπατο με $S_0 = 0$, ισχύει $P(S_n = 0) = 0$ για κάθε περιττό $n$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`$S_n = 2Y - n$.`, sol: R`Σωστό: $S_n = 2Y - n$ έχει την ίδια ισοτιμία με το $n$, άρα για περιττό $n$ το $S_n$ είναι περιττό και δεν μπορεί να είναι $0$.` },
    { level: 2, type: "fields", q: R`Τι επιστρέφει η εντολή της R <code>choose(6, 3)/2^6</code>; Ποια πιθανότητα του τυχαίου περιπάτου εκφράζει;`,
      fields: [{ label: "τιμή =", ans: 0.3125, tol: 0.0006 }], hint: R`$\frac{20}{64}$.`, sol: R`$\frac{20}{64} = 0{,}3125 = P(S_6 = 0)$ για συμμετρικό περίπατο από το $0$.` }
  ]
},
/* ───────────────────────────── 6.4 ───────────────────────────── */
{
  id: "6.4", unit: 6, title: "Ανέλιξη Poisson",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Στοχαστικές ανελίξεις (ανέλιξη Poisson, ουρά αναμονής)",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Μια ανέλιξη απαρίθμησης $\{X(t),\ t \ge 0\}$ ($X(t)$ = αριθμός γεγονότων στο $[0, t]$) λέγεται <b>ανέλιξη Poisson</b> με παράμετρο (ρυθμό) $\lambda > 0$ αν:</p>
<ol><li>$X(0) = 0$,</li><li>$X(t) - X(s) \sim \text{Poisson}\big(\lambda(t - s)\big)$ για $0 \le s \le t$,</li><li>η ανέλιξη έχει <b>ανεξάρτητες προσαυξήσεις</b> (τα πλήθη σε ξένα διαστήματα είναι ανεξάρτητα).</li></ol>
<p>Άρα $P\big(X(t) = k\big) = e^{-\lambda t}\frac{(\lambda t)^k}{k!}$ και $E\big(X(t) - X(s)\big) = \lambda(t - s)$· το $\lambda = E(X(1))$ είναι ο αναμενόμενος αριθμός γεγονότων ανά μονάδα χρόνου.</p></div>
<div class="tbox"><h4>Χρόνοι αναμονής</h4>
<p>Οι <b>ενδιάμεσοι χρόνοι</b> μεταξύ διαδοχικών γεγονότων είναι ανεξάρτητες τυχαίες μεταβλητές με εκθετική κατανομή $\mathcal E(\lambda)$ (μέση τιμή $\frac1\lambda$)· αντίστροφα, ανεξάρτητοι εκθετικοί ενδιάμεσοι χρόνοι δίνουν ανέλιξη Poisson. Αν $T_x$ είναι η στιγμή του $x$-οστού γεγονότος, $T_x = T_1 + (T_2 - T_1) + \dots + (T_x - T_{x-1})$, οπότε
$$E(T_x) = \frac x\lambda, \qquad \text{Var}(T_x) = \frac{x}{\lambda^2}.$$
Επίσης $P(T_1 > t) = P(X(t) = 0) = e^{-\lambda t}$.</p></div>
<div class="tbox tip"><h4>Υπέρθεση και διάσπαση</h4>
<ul><li><b>Υπέρθεση:</b> αν $X(t)$, $Y(t)$ ανεξάρτητες ανελίξεις Poisson με ρυθμούς $\lambda_1, \lambda_2$, τότε η $X(t) + Y(t)$ είναι ανέλιξη Poisson με ρυθμό $\lambda_1 + \lambda_2$.</li>
<li><b>Διάσπαση:</b> αν κάθε γεγονός χαρακτηρίζεται ανεξάρτητα «τύπου Ι» με πιθανότητα $p$ και «τύπου ΙΙ» με $1 - p$, τα δύο είδη σχηματίζουν <b>ανεξάρτητες</b> ανελίξεις Poisson με ρυθμούς $\lambda p$ και $\lambda(1 - p)$. Π.χ. $80$ αυτοκίνητα/λεπτό σε διακλάδωση με $P(\text{Α}) = 0{,}3$: $24$ και $56$ αυτοκίνητα/λεπτό.</li>
<li><b>Ουρά με άπειρους εξυπηρετητές:</b> αφίξεις Poisson($\lambda$), εκθετικοί χρόνοι εξυπηρέτησης $E(\mu)$· ο αριθμός πελατών που ήρθαν στο $(0, t]$ και ακόμη εξυπηρετούνται ακολουθεί $\text{Poisson}(\lambda t P_t)$ με $P_t = \frac{1 - e^{-\mu t}}{\mu t}$.</li></ul></div>
<div class="tbox"><h4>Στην R</h4>
<p><code>dpois(2, 3)</code> → <code>0.2240418</code> · <code>ppois(1, 4)</code> → <code>0.09157819</code>. Προσομοίωση χρόνων αφίξεων με ρυθμό $\lambda = 3$: <code>cumsum(rexp(10, rate = 3))</code>.</p></div>`,
  widget: "pscpois",
  gen: "pscpp",
  exercises: [
    { level: 1, type: "fields", q: R`Κλήσεις φθάνουν σε τηλεφωνικό κέντρο σύμφωνα με ανέλιξη Poisson με ρυθμό $3$ ανά ώρα. Ποια η πιθανότητα σε μία ώρα να φθάσουν ακριβώς $2$ κλήσεις (με 4 δεκαδικά);`,
      fields: [{ label: "P =", ans: 0.224, tol: 0.0006 }], hint: R`$X(1) \sim \text{Poisson}(3)$.`, sol: R`$e^{-3}\frac{3^2}{2!} = 4{,}5e^{-3} \approx 0{,}2240$.` },
    { level: 1, type: "fields", q: R`Για ανέλιξη Poisson με ρυθμό $\lambda = 2{,}5$ γεγονότα ανά ώρα, να βρείτε τα $E(X(4))$ και $\text{Var}(X(4))$.`,
      fields: [{ label: "E =", ans: 10 }, { label: "Var =", ans: 10 }], hint: R`$X(4) \sim \text{Poisson}(\lambda\cdot 4)$.`, sol: R`$X(4) \sim \text{Poisson}(10)$: $E = \text{Var} = 10$.` },
    { level: 2, type: "fields", q: R`Πελάτες φθάνουν σε κατάστημα σύμφωνα με ανέλιξη Poisson με ρυθμό $6$ ανά ώρα. Να βρείτε τη μέση τιμή και τη διασπορά (σε ώρες) της χρονικής στιγμής άφιξης του $3$ου πελάτη.`,
      fields: [{ label: "E(T₃) =", ans: 0.5, tol: 0.001 }, { label: "Var(T₃) =", ans: "1/12", tol: 0.001 }], hint: R`Άθροισμα $3$ ανεξάρτητων $E(6)$.`, sol: R`$E(T_3) = \frac36 = 0{,}5$ ώρες και $\text{Var}(T_3) = \frac{3}{36} = \frac{1}{12}$.` },
    { level: 2, type: "fields", q: R`Μηνύματα φθάνουν σε διακομιστή σύμφωνα με ανέλιξη Poisson με ρυθμό $12$ ανά ώρα. Ποια η πιθανότητα στα επόμενα $10$ λεπτά να μη φθάσει κανένα μήνυμα (με 4 δεκαδικά);`,
      fields: [{ label: "P =", ans: 0.1353, tol: 0.0006 }], hint: R`$10$ λεπτά $= \frac16$ ώρας, $\lambda t = 2$.`, sol: R`$P(X(1/6) = 0) = e^{-12/6} = e^{-2} \approx 0{,}1353$.` },
    { level: 2, type: "fields", q: R`Αυτοκίνητα φθάνουν σε διακλάδωση αυτοκινητοδρόμου σύμφωνα με ανέλιξη Poisson με ρυθμό $80$ ανά λεπτό, και κάθε αυτοκίνητο ακολουθεί τον δρόμο Α με πιθανότητα $0{,}3$, ανεξάρτητα. Ποιος είναι ο ρυθμός των αυτοκινήτων στον δρόμο Α και ποια η πιθανότητα σε $0{,}1$ λεπτά να μην περάσει κανένα αυτοκίνητο στον Α (με 4 δεκαδικά);`,
      fields: [{ label: "ρυθμός =", ans: 24 }, { label: "P =", ans: 0.0907, tol: 0.0006 }], hint: R`Διάσπαση: $\lambda p$.`, sol: R`Ρυθμός $80\cdot 0{,}3 = 24$ ανά λεπτό. $P = e^{-24\cdot 0{,}1} = e^{-2{,}4} \approx 0{,}0907$.` },
    { level: 2, type: "fields", q: R`Δύο ανεξάρτητες πηγές στέλνουν αιτήματα σύμφωνα με ανελίξεις Poisson με ρυθμούς $2$ και $3$ ανά ώρα. Ποια η πιθανότητα σε μία ώρα να φθάσουν συνολικά ακριβώς $4$ αιτήματα (με 4 δεκαδικά);`,
      fields: [{ label: "P =", ans: 0.1755, tol: 0.0006 }], hint: R`Υπέρθεση: ρυθμός $5$.`, sol: R`Η συνολική ανέλιξη είναι Poisson με ρυθμό $5$: $P = e^{-5}\frac{5^4}{4!} = \frac{625}{24}e^{-5} \approx 0{,}1755$.` },
    { level: 3, type: "fields", q: R`Για ανέλιξη Poisson με ρυθμό $\lambda = 1$, να βρείτε την $P\big(X(1) = 1,\ X(3) = 3\big)$ (με 4 δεκαδικά).`,
      fields: [{ label: "P =", ans: 0.0996, tol: 0.0006 }], hint: R`Ανεξάρτητες προσαυξήσεις: $\{X(1) = 1\} \cap \{X(3) - X(1) = 2\}$.`,
      sol: R`$P = P(X(1) = 1)\,P(X(3) - X(1) = 2) = e^{-1}\cdot e^{-2}\frac{2^2}{2!} = 2e^{-3} \approx 0{,}0996$.` },
    { level: 1, type: "mc", q: R`Σε ανέλιξη Poisson με ρυθμό $\lambda$, οι ενδιάμεσοι χρόνοι μεταξύ διαδοχικών γεγονότων ακολουθούν:`,
      options: ["εκθετική κατανομή με παράμετρο $\\lambda$", "κατανομή Poisson με παράμετρο $\\lambda$", "ομοιόμορφη κατανομή στο $[0, \\lambda]$", "κανονική κατανομή με μέση τιμή $\\lambda$"], correct: 0,
      hint: R`$P(T_1 > t) = P(X(t) = 0)$.`, sol: R`$P(T_1 > t) = e^{-\lambda t}$, δηλαδή $T_1 \sim \mathcal E(\lambda)$, και οι διαδοχικοί ενδιάμεσοι χρόνοι είναι ανεξάρτητοι $E(\lambda)$ (μέση τιμή $\frac1\lambda$).` },
    { level: 1, type: "mc", q: R`Σε ανέλιξη Poisson, η κατανομή του αριθμού γεγονότων σε διάστημα μήκους $t$ εξαρτάται από το πού βρίσκεται το διάστημα στον άξονα του χρόνου.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`$X(t) - X(s) \sim \text{Poisson}(\lambda(t - s))$.`,
      sol: R`Λάθος: εξαρτάται μόνο από το μήκος $t - s$ (στάσιμες προσαυξήσεις), όχι από τη θέση του διαστήματος.` },
    { level: 2, type: "fields", q: R`Τι επιστρέφει η εντολή της R <code>1 - ppois(2, 3)</code> (με 4 δεκαδικά);`,
      fields: [{ label: "τιμή =", ans: 0.5768, tol: 0.0006 }], hint: R`<code>ppois(2, 3)</code> $= P(X \le 2)$ για $X \sim \text{Poisson}(3)$.`,
      sol: R`$1 - e^{-3}\left(1 + 3 + \frac92\right) = 1 - 8{,}5e^{-3} \approx 0{,}5768 = P(X \ge 3)$.` }
  ]
},
/* ───────────────────────────── 7.1 ───────────────────────────── */
{
  id: "7.1", unit: 7, title: "Τυχαίο δείγμα – Στατιστικές συναρτήσεις – Περιγραφική στατιστική",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Στατιστική – Εισαγωγή, Στατιστικές συναρτήσεις",
  theory: R`
<div class="tbox"><h4>Τυχαίο δείγμα και στατιστικές συναρτήσεις</h4>
<p>Οι τυχαίες μεταβλητές $X_1, \dots, X_n$ αποτελούν <b>τυχαίο δείγμα</b> μεγέθους $n$ από την κατανομή $F$ αν είναι <b>ανεξάρτητες και ισόνομες</b> (όλες με κατανομή $F$)· οι παρατηρηθείσες τιμές $x_1, \dots, x_n$ λέγονται <b>δεδομένα</b>. (Σε πεπερασμένο πληθυσμό αυτό ισχύει για δειγματοληψία <b>με</b> επανάθεση, και πρακτικά όταν ο πληθυσμός είναι πολύ μεγαλύτερος από το δείγμα.)</p>
<p>Μια συνάρτηση του δείγματος που <b>δεν εξαρτάται από άγνωστες παραμέτρους</b> λέγεται <b>στατιστική συνάρτηση</b>. Είναι και η ίδια τυχαία μεταβλητή. Παραδείγματα:</p>
<ul><li>δειγματικός μέσος $\bar X = \frac{1}{n}\sum_{k=1}^{n} X_k$·</li>
<li>δειγματική διασπορά $S^2 = \frac{1}{n - 1}\sum_{k=1}^{n}(X_k - \bar X)^2 = \frac{1}{n - 1}\left(\sum X_k^2 - n\bar X^2\right)$, δειγματική τυπική απόκλιση $S = \sqrt{S^2}$· (χρησιμοποιείται και η $\hat\sigma^2 = \frac1n\sum (X_k - \bar X)^2$)·</li>
<li>δειγματική ροπή τάξης $r$: $\ m_r = \frac{1}{n}\sum_{k=1}^{n} X_k^r$·</li>
<li>δειγματικό εύρος $R = \max\{X_1, \dots, X_n\} - \min\{X_1, \dots, X_n\}$.</li></ul></div>
<div class="tbox"><h4>Μέτρα θέσης και διασποράς των δεδομένων</h4>
<ul><li><b>Διάμεσος</b> $\tilde x$: η μεσαία από τις διατεταγμένες τιμές ($n$ περιττός) ή ο μέσος όρος των δύο μεσαίων ($n$ άρτιος). <b>Επικρατούσα</b>: η τιμή με τη μεγαλύτερη συχνότητα.</li>
<li><b>Τεταρτημόρια</b>: $Q_1$ = διάμεσος του κάτω μισού, $Q_3$ = διάμεσος του πάνω μισού (όταν $n$ περιττός η διάμεσος δεν μπαίνει σε κανένα μισό)· $IQR = Q_3 - Q_1$.</li>
<li><b>Θηκόγραμμα</b>: κουτί από $Q_1$ ως $Q_3$ με γραμμή στη διάμεσο· ακραίες λέγονται οι τιμές έξω από $[Q_1 - 1{,}5\,IQR,\ Q_3 + 1{,}5\,IQR]$. <b>Ιστόγραμμα</b>: το εμβαδόν κάθε ορθογωνίου είναι ανάλογο της συχνότητας της κλάσης.</li>
<li>Αν $y_k = a x_k + b$: $\ \bar y = a\bar x + b$ και $s_y = |a|\,s_x$.</li></ul></div>
<div class="tbox warn"><h4>Παράδειγμα – παγίδες</h4>
<p>Δεδομένα $3, 5, 6, 8, 13$: $\bar x = 7$, $\tilde x = 6$, $s^2 = \frac{16 + 4 + 1 + 1 + 36}{4} = 14{,}5$, εύρος $10$. Η μέση τιμή «τραβιέται» από την ακραία τιμή $13$, η διάμεσος όχι (είναι ανθεκτική). Στην $S^2$ διαιρούμε με $n - 1$.</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>x &lt;- c(3, 5, 6, 8, 13)</code> · <code>mean(x)</code> → <code>7</code> · <code>median(x)</code> → <code>6</code> · <code>var(x)</code> → <code>14.5</code> (με $n - 1$) · <code>sd(x)</code> → <code>3.807887</code> · <code>diff(range(x))</code> → <code>10</code> · <code>summary(x)</code>, <code>boxplot(x)</code>, <code>hist(x)</code>.</p>
<p>Προσοχή: η <code>quantile(x)</code> χρησιμοποιεί από προεπιλογή άλλη σύμβαση για τα τεταρτημόρια (type 7), οπότε μπορεί να δώσει λίγο διαφορετικά $Q_1$, $Q_3$ από τη σύμβαση «διάμεσος κάθε μισού». Επίσης η <code>boxplot</code>/<code>fivenum</code> χρησιμοποιεί τους «hinges» του Tukey (για $n$ περιττό η διάμεσος μπαίνει και στα δύο μισά).</p></div>`,
  widget: "psaData",
  gen: "psaDesc",
  exercises: [
    { level: 1, type: "fields", q: R`Για τα δεδομένα $4, 7, 7, 9, 13$ να βρείτε τη μέση τιμή, τη διάμεσο και την επικρατούσα τιμή.`,
      fields: [{ label: "μέση τιμή =", ans: 8 }, { label: "διάμεσος =", ans: 7 }, { label: "επικρατούσα =", ans: 7 }],
      hint: R`Άθροισμα $40$, $n = 5$.`, sol: R`$\bar x = 40/5 = 8$. Η μεσαία (3η) από τις διατεταγμένες τιμές είναι $7$, και το $7$ εμφανίζεται δύο φορές, άρα επικρατούσα $7$.` },
    { level: 1, type: "fields", q: R`Για τα δεδομένα $4, 7, 7, 9, 13$ να βρείτε τη δειγματική διασπορά $s^2$ και το δειγματικό εύρος.`,
      fields: [{ label: "s² =", ans: 11 }, { label: "εύρος =", ans: 9 }],
      hint: R`Αποκλίσεις από το $\bar x = 8$: $-4, -1, -1, 1, 5$.`, sol: R`$\sum (x_k - \bar x)^2 = 16 + 1 + 1 + 1 + 25 = 44$, άρα $s^2 = 44/4 = 11$. Εύρος $13 - 4 = 9$.` },
    { level: 2, type: "fields", q: R`Για τα δεδομένα $2, 4, 6, 8$ να υπολογίσετε τη δειγματική διασπορά $S^2$ (με $n - 1$) και την $\hat\sigma^2$ (με $n$).`,
      fields: [{ label: "S² =", ans: "20/3", tol: 0.001 }, { label: "σ̂² =", ans: 5 }],
      hint: R`$\bar x = 5$, $\sum (x_k - \bar x)^2 = 20$.`, sol: R`$\sum (x_k - 5)^2 = 9 + 1 + 1 + 9 = 20$. $S^2 = \frac{20}{3} \approx 6{,}667$ και $\hat\sigma^2 = \frac{20}{4} = 5$. Πάντα $\hat\sigma^2 = \frac{n - 1}{n}S^2 < S^2$.` },
    { level: 2, type: "fields", q: R`Για τα δεδομένα $2, 5, 6, 8, 9, 11, 14, 15$ να βρείτε τη διάμεσο, τα τεταρτημόρια $Q_1$, $Q_3$ και το ενδοτεταρτημοριακό εύρος (με τη σύμβαση «διάμεσος κάθε μισού»).`,
      fields: [{ label: "διάμεσος =", ans: 8.5 }, { label: "Q1 =", ans: 5.5 }, { label: "Q3 =", ans: 12.5 }, { label: "IQR =", ans: 7 }],
      hint: R`$n = 8$: κάτω μισό $2, 5, 6, 8$, πάνω μισό $9, 11, 14, 15$.`, sol: R`$\tilde x = \frac{8 + 9}{2} = 8{,}5$, $Q_1 = \frac{5 + 6}{2} = 5{,}5$, $Q_3 = \frac{11 + 14}{2} = 12{,}5$, $IQR = 7$.` },
    { level: 2, type: "mc", q: R`Σε ένα δείγμα είναι $Q_1 = 10$ και $Q_3 = 18$. Η παρατήρηση $31$:`,
      options: ["είναι ακραία τιμή, αφού $31 > 18 + 1{,}5\\cdot 8 = 30$", "δεν είναι ακραία τιμή, αφού $31 < 18 + 2\\cdot 8$", "είναι ακραία τιμή μόνο αν είναι μεγαλύτερη από τη μέση τιμή", "δεν μπορεί να κριθεί χωρίς την τυπική απόκλιση"], correct: 0,
      hint: R`Άνω όριο: $Q_3 + 1{,}5\,IQR$.`, sol: R`$IQR = 8$, άνω όριο $18 + 12 = 30$. Αφού $31 > 30$, η τιμή σημειώνεται ως ακραία στο θηκόγραμμα.` },
    { level: 1, type: "fields", q: R`Οι ημερήσιες θερμοκρασίες ενός μήνα έχουν μέση τιμή $20^\circ$C και τυπική απόκλιση $3^\circ$C. Να βρείτε τη μέση τιμή και την τυπική απόκλιση σε βαθμούς Fahrenheit ($F = 1{,}8\,C + 32$).`,
      fields: [{ label: "μέση τιμή (°F) =", ans: 68 }, { label: "τυπ. απόκλιση (°F) =", ans: 5.4 }],
      hint: R`$\bar y = a\bar x + b$, $s_y = |a| s_x$.`, sol: R`$\bar F = 1{,}8\cdot 20 + 32 = 68$ και $s_F = 1{,}8\cdot 3 = 5{,}4$· η σταθερά $32$ δεν επηρεάζει τη διασπορά.` },
    { level: 1, type: "fields", q: R`Για τα δεδομένα $1, 2, 3, 4$ να υπολογίσετε τη δειγματική ροπή δεύτερης τάξης $m_2 = \frac{1}{n}\sum x_k^2$ και τη δειγματική ροπή τρίτης τάξης $m_3$.`,
      fields: [{ label: "m₂ =", ans: 7.5 }, { label: "m₃ =", ans: 25 }],
      hint: R`$\sum x_k^2 = 30$, $\sum x_k^3 = 100$.`, sol: R`$m_2 = \frac{1 + 4 + 9 + 16}{4} = 7{,}5$ και $m_3 = \frac{1 + 8 + 27 + 64}{4} = 25$.` },
    { level: 1, type: "mc", q: R`Ποιο από τα παρακάτω μέτρα <b>δεν</b> επηρεάζεται σημαντικά από μια πολύ μεγάλη ακραία τιμή;`,
      options: ["η διάμεσος", "η μέση τιμή", "η τυπική απόκλιση", "το εύρος"], correct: 0,
      hint: R`Ποιο εξαρτάται μόνο από τη σειρά των τιμών;`, sol: R`Η διάμεσος εξαρτάται μόνο από τη θέση των μεσαίων τιμών, άρα είναι ανθεκτική. Η μέση τιμή, η τυπική απόκλιση και το εύρος αλλάζουν σημαντικά.` },
    { level: 1, type: "fields", q: R`Τι επιστρέφει στην R η εντολή <code>var(c(1, 3, 5, 7, 9))</code>;`,
      fields: [{ label: "τιμή =", ans: 10 }], hint: R`Η <code>var</code> διαιρεί με $n - 1$.`,
      sol: R`$\bar x = 5$, $\sum (x_k - 5)^2 = 16 + 4 + 0 + 4 + 16 = 40$, άρα $40/4 = 10$. (Η <code>sd</code> θα έδινε $\sqrt{10} \approx 3{,}162$.)` },
    { level: 3, type: "fields", q: R`Η μέση τιμή $10$ παρατηρήσεων είναι $12$. Διαπιστώθηκε ότι μία τιμή καταχωρίστηκε λανθασμένα ως $30$ αντί για $10$. Ποια είναι η σωστή μέση τιμή; Αν το σωστό $\sum x_k^2$ είναι $1700$, ποια είναι η σωστή δειγματική διασπορά;`,
      fields: [{ label: "μέση τιμή =", ans: 10 }, { label: "s² =", ans: "700/9", tol: 0.002 }],
      hint: R`Το άθροισμα μειώνεται κατά $20$· $s^2 = \frac{1}{n-1}\left(\sum x_k^2 - n\bar x^2\right)$.`,
      sol: R`Σωστό άθροισμα $120 - 20 = 100$, άρα $\bar x = 10$. Τότε $s^2 = \frac{1700 - 10\cdot 10^2}{9} = \frac{700}{9} \approx 77{,}8$.` }
  ]
},
/* ───────────────────────────── 7.2 ───────────────────────────── */
{
  id: "7.2", unit: 7, title: "Κατανομή του δειγματικού μέσου – Σημειοεκτιμητική",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Στατιστική – Κανονική κατανομή, ΚΟΘ, Εκτιμητική",
  theory: R`
<div class="tbox"><h4>Ο δειγματικός μέσος</h4>
<p>Αν $X_1, \dots, X_n$ τυχαίο δείγμα από κατανομή με μέσο $\mu$ και διασπορά $\sigma^2$, τότε
$$E(\bar X) = \frac{1}{n}\sum_{k=1}^{n} E(X_k) = \mu, \qquad Var(\bar X) = \frac{1}{n^2}\sum_{k=1}^{n} Var(X_k) = \frac{\sigma^2}{n}.$$
Ο $\bar X$ έχει την ίδια μέση τιμή με τις παρατηρήσεις, αλλά <b>μικρότερη διασπορά</b>. Η ποσότητα $\sigma/\sqrt n$ λέγεται <b>τυπικό σφάλμα</b> (ΣΕ) του $\bar X$.</p></div>
<div class="tbox"><h4>Κανονική κατανομή και ΚΟΘ</h4>
<ul><li>Αν $X \sim N(\mu, \sigma^2)$ τότε $Z = \frac{X - \mu}{\sigma} \sim N(0, 1)$, και γενικά $aX + b \sim N(a\mu + b,\ a^2\sigma^2)$.</li>
<li>Ο πίνακας των σημειώσεων δίνει $P(0 < Z < z)$· λόγω συμμετρίας $P(Z > z) = 0{,}5 - P(0 < Z < z)$ για $z > 0$.</li>
<li>Αν ο πληθυσμός είναι κανονικός, $\bar X \sim N\!\left(\mu, \frac{\sigma^2}{n}\right)$ <b>ακριβώς</b>.</li>
<li><b>Κεντρικό Οριακό Θεώρημα</b>: για μεγάλο $n$ (πρακτικά $n \ge 30$), $\frac{\bar X - \mu}{\sigma/\sqrt n} \approx N(0, 1)$, όποια κι αν είναι η κατανομή των παρατηρήσεων, αρκεί να έχει πεπερασμένη διασπορά $\sigma^2$.</li></ul></div>
<div class="tbox"><h4>Εκτιμήτριες – αμεροληψία</h4>
<p>Μια <b>εκτιμήτρια</b> $\hat\theta$ μιας άγνωστης παραμέτρου $\theta$ είναι μια στατιστική συνάρτηση. Λέγεται <b>αμερόληπτη</b> αν $E(\hat\theta) = \theta$. Επιθυμούμε επίσης όσο το δυνατό μικρότερη διασπορά.</p>
<ul><li>$\bar X$: αμερόληπτη εκτιμήτρια του $\mu$.</li>
<li>$S^2 = \frac{1}{n - 1}\sum (X_k - \bar X)^2$: αμερόληπτη εκτιμήτρια του $\sigma^2$. Η $\hat\sigma^2 = \frac{1}{n}\sum (X_k - \bar X)^2$ <b>δεν</b> είναι: $E(\hat\sigma^2) = \frac{n - 1}{n}\sigma^2$ (για μεγάλο $n$ οι δύο σχεδόν ταυτίζονται).</li>
<li>Δειγματικό ποσοστό $\hat p$: είναι ο δειγματικός μέσος των δεικτών $X_k \in \{0, 1\}$, άρα αμερόληπτη εκτιμήτρια του πληθυσμιακού ποσοστού $p$, με $Var(\hat p) = \frac{p(1 - p)}{n}$.</li></ul></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>pnorm(12, mean = 10, sd = 4) - pnorm(10, 10, 4)</code> → <code>0.1914625</code> ($P(10 < X < 12)$ για $X \sim N(10, 16)$) · <code>qnorm(0.975)</code> → <code>1.959964</code>.</p>
<p>Προσομοίωση της κατανομής του $\bar X$: <code>m &lt;- replicate(10000, mean(rnorm(25, 50, 10)))</code>· τότε <code>mean(m)</code> ≈ 50 και <code>sd(m)</code> ≈ $10/\sqrt{25} = 2$.</p></div>`,
  widget: "psbbias",
  gen: "psbest",
  exercises: [
    { level: 1, type: "fields", q: R`Από πληθυσμό με μέση τιμή $\mu = 50$ και τυπική απόκλιση $\sigma = 12$ παίρνουμε τυχαίο δείγμα μεγέθους $n = 36$. Να βρείτε τη μέση τιμή, τη διασπορά και την τυπική απόκλιση του $\bar X$.`,
      fields: [{ label: "E(X̄) =", ans: 50 }, { label: "Var(X̄) =", ans: 4 }, { label: "σ/√n =", ans: 2 }],
      hint: R`$Var(\bar X) = \sigma^2/n$.`, sol: R`$E(\bar X) = 50$, $Var(\bar X) = \frac{144}{36} = 4$ και τυπική απόκλιση $\frac{12}{6} = 2$.` },
    { level: 1, type: "fields", q: R`Έστω $X \sim N(10, 16)$. Να υπολογίσετε την $P(10 < X < 12)$. Δίνεται $P(0 < Z < 0{,}5) = 0{,}1915$.`,
      fields: [{ label: "P =", ans: 0.1915, tol: 0.0006 }], hint: R`Τυποποίηση με $\sigma = 4$.`,
      sol: R`$P(10 < X < 12) = P\!\left(\frac{10 - 10}{4} < Z < \frac{12 - 10}{4}\right) = P(0 < Z < 0{,}5) = 0{,}1915$.` },
    { level: 2, type: "fields", q: R`Έστω $X \sim N(10, 16)$. Να υπολογίσετε τις πιθανότητες $P(X \ge 16)$ και $P(7 < X < 14)$. Δίνονται $P(0 < Z < 1{,}5) = 0{,}4332$, $P(0 < Z < 0{,}75) = 0{,}2734$ και $P(0 < Z < 1) = 0{,}3413$.`,
      fields: [{ label: "P(X ≥ 16) =", ans: 0.0668, tol: 0.0006 }, { label: "P(7 < X < 14) =", ans: 0.6147, tol: 0.0006 }],
      hint: R`$\frac{16 - 10}{4} = 1{,}5$, $\frac{7 - 10}{4} = -0{,}75$, $\frac{14 - 10}{4} = 1$.`,
      sol: R`$P(X \ge 16) = P(Z \ge 1{,}5) = 0{,}5 - 0{,}4332 = 0{,}0668$. $P(7 < X < 14) = P(-0{,}75 < Z < 1) = 0{,}2734 + 0{,}3413 = 0{,}6147$.` },
    { level: 2, type: "fields", q: R`Το βάρος των πακέτων μιας μηχανής ακολουθεί $N(500, 40^2)$ γραμμάρια. Παίρνουμε τυχαίο δείγμα $16$ πακέτων. Να βρείτε την $P(\bar X > 520)$. Δίνεται $\Phi(2) = 0{,}9772$.`,
      fields: [{ label: "P =", ans: 0.0228, tol: 0.0006 }], hint: R`Κανονικός πληθυσμός: $\bar X \sim N(500, 40^2/16)$.`,
      sol: R`$\sigma_{\bar X} = 40/4 = 10$, $z = \frac{520 - 500}{10} = 2$, άρα $P(\bar X > 520) = 1 - 0{,}9772 = 0{,}0228$.` },
    { level: 2, type: "mc", q: R`Έστω $X_1, \dots, X_n$ τυχαίο δείγμα με διασπορά $\sigma^2$ και $\hat\sigma^2 = \frac{1}{n}\sum_{k=1}^{n}(X_k - \bar X)^2$. Ποια είναι η $E(\hat\sigma^2)$;`,
      options: ["$\\frac{n - 1}{n}\\sigma^2$", "$\\sigma^2$", "$\\frac{n}{n - 1}\\sigma^2$", "$\\frac{\\sigma^2}{n}$"], correct: 0,
      hint: R`$\hat\sigma^2 = \frac{n - 1}{n}S^2$ και $E(S^2) = \sigma^2$.`, sol: R`$E(\hat\sigma^2) = \frac{n - 1}{n}E(S^2) = \frac{n - 1}{n}\sigma^2$: η $\hat\sigma^2$ είναι μεροληπτική (υποεκτιμά). Το $\frac{\sigma^2}{n}$ είναι η διασπορά του $\bar X$.` },
    { level: 1, type: "mc", q: R`Η δειγματική διασπορά $S^2$ (με παρονομαστή $n - 1$) είναι αμερόληπτη εκτιμήτρια της πληθυσμιακής διασποράς $\sigma^2$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Ορισμός αμεροληψίας: $E(\hat\theta) = \theta$.`, sol: R`Σωστό: $E(S^2) = \sigma^2$· γι' αυτό διαιρούμε με $n - 1$ και όχι με $n$.` },
    { level: 2, type: "fields", q: R`Σε τυχαίο δείγμα $400$ χρηστών, οι $92$ χρησιμοποιούν το διαδίκτυο για τις τραπεζικές τους συναλλαγές. Να βρείτε την εκτίμηση $\hat p$ του πληθυσμιακού ποσοστού και την εκτίμηση του τυπικού του σφάλματος $\sqrt{\hat p(1 - \hat p)/n}$ (4 δεκαδικά).`,
      fields: [{ label: "p̂ =", ans: 0.23, tol: 0.0006 }, { label: "ΣΕ =", ans: 0.021, tol: 0.0006 }],
      hint: R`$\hat p = 92/400$.`, sol: R`$\hat p = 0{,}23$ και $\sqrt{\frac{0{,}23\cdot 0{,}77}{400}} = \sqrt{0{,}00044275} \approx 0{,}0210$.` },
    { level: 3, type: "fields", q: R`Έστω $X_1, X_2$ ανεξάρτητες με μέση τιμή $\mu$ και διασπορά $\sigma^2$. Θεωρούμε τις εκτιμήτριες $\hat\mu_1 = \frac{X_1 + X_2}{2}$ και $\hat\mu_2 = \frac{X_1 + 2X_2}{3}$ του $\mu$. Και οι δύο είναι αμερόληπτες· να βρείτε τους λόγους $Var(\hat\mu_1)/\sigma^2$ και $Var(\hat\mu_2)/\sigma^2$.`,
      fields: [{ label: "Var(μ̂₁)/σ² =", ans: "1/2", tol: 0.001 }, { label: "Var(μ̂₂)/σ² =", ans: "5/9", tol: 0.001 }],
      hint: R`$Var(aX_1 + bX_2) = (a^2 + b^2)\sigma^2$ για ανεξάρτητες.`,
      sol: R`$E(\hat\mu_2) = \frac{\mu + 2\mu}{3} = \mu$. $Var(\hat\mu_1) = \frac{1}{4}\cdot 2\sigma^2 = \frac{\sigma^2}{2}$ και $Var(\hat\mu_2) = \frac{1 + 4}{9}\sigma^2 = \frac{5}{9}\sigma^2$. Αφού $\frac12 < \frac59$, προτιμάμε την $\hat\mu_1$ (μικρότερη διασπορά).` },
    { level: 2, type: "fields", q: R`Ο πληθυσμός έχει $\sigma = 4$. Πόσο μεγάλο πρέπει να είναι τουλάχιστον το δείγμα ώστε η τυπική απόκλιση του $\bar X$ να μην ξεπερνά το $0{,}5$;`,
      fields: [{ label: "n =", ans: 64 }], hint: R`$\frac{4}{\sqrt n} \le 0{,}5$.`, sol: R`$\sqrt n \ge 8 \iff n \ge 64$.` },
    { level: 1, type: "fields", q: R`Τι επιστρέφει στην R η εντολή <code>pnorm(52, mean = 50, sd = 2)</code> (4 δεκαδικά); Δίνεται $\Phi(1) = 0{,}8413$.`,
      fields: [{ label: "τιμή =", ans: 0.8413, tol: 0.0006 }], hint: R`Η <code>pnorm</code> δίνει τη συνάρτηση κατανομής $P(X \le x)$.`,
      sol: R`$P(X \le 52) = \Phi\!\left(\frac{52 - 50}{2}\right) = \Phi(1) \approx 0{,}8413$.` }
  ]
},
/* ───────────────────────────── 8.1 ───────────────────────────── */
{
  id: "8.1", unit: 8, title: "Διαστήματα εμπιστοσύνης για μέση τιμή και ποσοστό – Μέγεθος δείγματος",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Διαστήματα εμπιστοσύνης",
  theory: R`
<div class="tbox"><h4>Από τη σημειακή στη διαστηματική εκτίμηση</h4>
<p>Αντί για μία τιμή δίνουμε ένα διάστημα $\bar x \pm m$ μαζί με τον <b>συντελεστή εμπιστοσύνης</b> $1 - \alpha$ (π.χ. $95\%$). Όσο μεγαλύτερος ο συντελεστής, τόσο φαρδύτερο το διάστημα· ένα διάστημα με εμπιστοσύνη $100\%$ (π.χ. $(0, 24)$ ώρες) είναι άχρηστο. Συμβολίζουμε με $z_{\alpha}$ το <b>άνω</b> $\alpha$-σημείο της $N(0,1)$: $P(Z > z_\alpha) = \alpha$, π.χ. $z_{0{,}05} = 1{,}645$ (οι σημειώσεις στρογγυλεύουν $1{,}64$), $z_{0{,}025} = 1{,}96$, $z_{0{,}005} = 2{,}576$ ($\approx 2{,}57$).</p></div>
<div class="tbox"><h4>Διαστήματα εμπιστοσύνης $1 - \alpha$</h4>
<ul><li><b>Μεγάλο δείγμα</b> ($n \ge 30$, οποιαδήποτε κατανομή, ΚΟΘ): $\ \bar X \pm z_{\alpha/2}\frac{\sigma}{\sqrt n}$, και αν το $\sigma$ είναι άγνωστο, $\ \bar X \pm z_{\alpha/2}\frac{S}{\sqrt n}$.</li>
<li><b>Κανονικός πληθυσμός, μικρό $n$, γνωστό $\sigma$</b>: $\ \bar X \pm z_{\alpha/2}\frac{\sigma}{\sqrt n}$ (ακριβές).</li>
<li><b>Κανονικός πληθυσμός, μικρό $n$, άγνωστο $\sigma$</b>: επειδή $\frac{\bar X - \mu}{S/\sqrt n} \sim t_{n-1}$ (κατανομή $t$ με $n - 1$ βαθμούς ελευθερίας),
$$\bar X \pm t_{n-1}(\alpha/2)\,\frac{S}{\sqrt n},$$ όπου $t_{n-1}(\alpha/2)$ το άνω $\alpha/2$ εκατοστιαίο σημείο της $t_{n-1}$.</li>
<li><b>Ποσοστό</b> (μεγάλο $n$): $\ \hat p \pm z_{\alpha/2}\sqrt{\frac{\hat p(1 - \hat p)}{n}}$.</li></ul></div>
<div class="tbox warn"><h4>Ερμηνεία – ελάχιστο μέγεθος δείγματος</h4>
<p>Αν πάρουμε πάρα πολλά δείγματα και κατασκευάσουμε από το καθένα διάστημα $95\%$, περίπου το $95\%$ των διαστημάτων θα περιέχει την άγνωστη παράμετρο. Για ένα συγκεκριμένο διάστημα δεν λέμε «η παράμετρος είναι μέσα με πιθανότητα $0{,}95$».</p>
<p>Το διάστημα $\bar X \pm z_{\alpha/2}\frac{\sigma}{\sqrt n}$ έχει μήκος $2z_{\alpha/2}\frac{\sigma}{\sqrt n}$. Για μήκος το πολύ $d$ χρειάζεται $\ n \ge \left(\frac{2\sigma z_{\alpha/2}}{d}\right)^2$ (στρογγυλεύουμε <b>προς τα πάνω</b>).</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>qnorm(0.975)</code> → <code>1.959964</code> · <code>qt(0.975, df = 7)</code> → <code>2.364624</code> · για δεδομένα <code>x</code> από κανονικό πληθυσμό: <code>t.test(x, conf.level = 0.95)$conf.int</code> · για ποσοστό: <code>prop.test(46, 200, correct = FALSE)$conf.int</code> (χρησιμοποιεί ελαφρώς διαφορετικό τύπο, Wilson).</p></div>`,
  widget: "psbci",
  gen: "psbci",
  exercises: [
    { level: 1, type: "fields", q: R`Σε τυχαίο δείγμα $64$ ατόμων ενός πληθυσμού με $\sigma = 10$ η μέση βαθμολογία ήταν $\bar x = 93$. Να κατασκευάσετε διάστημα εμπιστοσύνης $95\%$ για τη μέση βαθμολογία $\mu$ ($z_{0{,}025} = 1{,}96$).`,
      fields: [{ label: "κάτω άκρο =", ans: 90.55, tol: 0.002 / 90.55 }, { label: "άνω άκρο =", ans: 95.45, tol: 0.002 / 95.45 }],
      hint: R`$\frac{\sigma}{\sqrt n} = \frac{10}{8}$.`, sol: R`$93 \pm 1{,}96\cdot 1{,}25 = 93 \pm 2{,}45$, δηλαδή $(90{,}55;\ 95{,}45)$.` },
    { level: 2, type: "fields", q: R`Για τον ημερήσιο χρόνο σύνδεσης στο διαδίκτυο, τυχαίο δείγμα $120$ σπουδαστών έδωσε $\bar x = 84$ λεπτά και $s = 33$ λεπτά. Να κατασκευάσετε διάστημα εμπιστοσύνης $90\%$ για τον μέσο χρόνο ($z_{0{,}05} = 1{,}645$, 3 δεκαδικά).`,
      fields: [{ label: "κάτω άκρο =", ans: 79.044, tol: 0.003 / 79.044 }, { label: "άνω άκρο =", ans: 88.956, tol: 0.003 / 88.956 }],
      hint: R`Μεγάλο δείγμα: χρησιμοποιούμε το $s$ στη θέση του $\sigma$.`,
      sol: R`$\frac{33}{\sqrt{120}} \approx 3{,}0125$, περιθώριο $1{,}645\cdot 3{,}0125 \approx 4{,}956$: $(79{,}044;\ 88{,}956)$.` },
    { level: 2, type: "fields", q: R`Το ύψος των ενηλίκων ενός πληθυσμού ακολουθεί κανονική κατανομή. Τυχαίο δείγμα $9$ ατόμων έδωσε $\bar x = 160$ cm και $s = 12$ cm. Να κατασκευάσετε διάστημα εμπιστοσύνης $95\%$ για το μέσο ύψος (δίνεται $t_8(0{,}025) = 2{,}306$, 3 δεκαδικά).`,
      fields: [{ label: "κάτω άκρο =", ans: 150.776, tol: 0.003 / 150.776 }, { label: "άνω άκρο =", ans: 169.224, tol: 0.003 / 169.224 }],
      hint: R`Μικρό δείγμα, άγνωστο $\sigma$: $\bar x \pm t_{n-1}(\alpha/2)\frac{s}{\sqrt n}$.`,
      sol: R`$\frac{s}{\sqrt n} = \frac{12}{3} = 4$, περιθώριο $2{,}306\cdot 4 = 9{,}224$: $(150{,}776;\ 169{,}224)$. Χρησιμοποιούμε $t$ αντί για $z$ επειδή το $n$ είναι μικρό και το $\sigma$ εκτιμάται από το $s$.` },
    { level: 2, type: "fields", q: R`Σε τυχαίο δείγμα $200$ μικρών επιχειρήσεων, οι $46$ δήλωσαν ότι θα συμμετείχαν σε ένα πρόγραμμα αναβάθμισης λογισμικού. Να κατασκευάσετε διάστημα εμπιστοσύνης $95\%$ για το πληθυσμιακό ποσοστό ($z_{0{,}025} = 1{,}96$, 4 δεκαδικά).`,
      fields: [{ label: "κάτω άκρο =", ans: 0.1717, tol: 0.0008 }, { label: "άνω άκρο =", ans: 0.2883, tol: 0.0008 }],
      hint: R`$\hat p = 0{,}23$.`, sol: R`$\sqrt{\frac{0{,}23\cdot 0{,}77}{200}} \approx 0{,}02976$, περιθώριο $1{,}96\cdot 0{,}02976 \approx 0{,}0583$: $(0{,}1717;\ 0{,}2883)$, δηλαδή από $17{,}2\%$ ως $28{,}8\%$.` },
    { level: 2, type: "fields", q: R`Θέλουμε διάστημα εμπιστοσύνης $95\%$ για τη μέση τιμή πληθυσμού με $\sigma = 15$, με <b>μήκος</b> το πολύ $d = 4$. Ποιο είναι το ελάχιστο μέγεθος δείγματος;`,
      fields: [{ label: "n =", ans: 217 }], hint: R`$n \ge \left(\frac{2\sigma z_{\alpha/2}}{d}\right)^2$.`,
      sol: R`$\left(\frac{2\cdot 15\cdot 1{,}96}{4}\right)^2 = 14{,}7^2 = 216{,}09$, άρα $n = 217$ (το $216$ δεν αρκεί).` },
    { level: 1, type: "mc", q: R`Ένα διάστημα εμπιστοσύνης $95\%$ για το $\mu$ βρέθηκε $(48{,}1;\ 55{,}9)$. Ποια ερμηνεία είναι σωστή;`,
      options: ["Αν επαναλαμβάναμε τη διαδικασία σε πολλά δείγματα, περίπου το 95% των διαστημάτων θα περιείχε το $\\mu$", "Το $\\mu$ βρίσκεται στο $(48{,}1;\\ 55{,}9)$ με πιθανότητα $0{,}95$", "Το 95% των παρατηρήσεων βρίσκεται στο $(48{,}1;\\ 55{,}9)$", "Το $\\bar x$ βρίσκεται στο διάστημα με πιθανότητα $0{,}95$"], correct: 0,
      hint: R`Το $\mu$ είναι σταθερό· τυχαίο είναι το διάστημα.`, sol: R`Ο συντελεστής εμπιστοσύνης αφορά τη <b>μέθοδο</b>: τα διαστήματα αλλάζουν από δείγμα σε δείγμα και περίπου το 95% περιέχει το σταθερό $\mu$. Το διάστημα δεν αφορά τις παρατηρήσεις, και το $\bar x$ είναι πάντα στο κέντρο του.` },
    { level: 1, type: "mc", q: R`Αν, με το ίδιο δείγμα, αυξήσουμε τον συντελεστή εμπιστοσύνης από $95\%$ σε $99\%$, το διάστημα εμπιστοσύνης στενεύει.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Συγκρίνετε $1{,}96$ και $2{,}576$.`, sol: R`Λάθος: φαρδαίνει, γιατί $z_{0{,}005} = 2{,}576 > 1{,}96$. Περισσότερη βεβαιότητα κοστίζει σε ακρίβεια.` },
    { level: 3, type: "fields", q: R`Από δείγμα $n = 64$ από πληθυσμό με $\sigma = 8$ βρέθηκε $\bar x = 100$. Να κατασκευάσετε διάστημα εμπιστοσύνης $99\%$ για το $\mu$ ($z_{0{,}005} = 2{,}576$) και να εξετάσετε αν η τιμή $\mu = 103$ είναι συμβατή με τα δεδομένα.`,
      fields: [{ label: "κάτω άκρο =", ans: 97.424, tol: 0.002 / 97.424 }, { label: "άνω άκρο =", ans: 102.576, tol: 0.002 / 102.576 }],
      hint: R`$\sigma/\sqrt n = 1$.`, sol: R`$100 \pm 2{,}576\cdot 1 = (97{,}424;\ 102{,}576)$. Το $103$ <b>δεν</b> ανήκει στο διάστημα, άρα δεν είναι συμβατό με τα δεδομένα σε επίπεδο $99\%$ (ισοδύναμα, ο αμφίπλευρος έλεγχος $H_0: \mu = 103$ απορρίπτεται σε $\alpha = 0{,}01$).` },
    { level: 2, type: "fields", q: R`<i>(Εμπλουτισμός)</i> Πόσο μεγάλο δείγμα χρειάζεται ώστε το διάστημα εμπιστοσύνης $95\%$ για ένα ποσοστό να έχει μήκος το πολύ $0{,}06$, όποια κι αν είναι η τιμή του $p$; (Χρησιμοποιήστε $p(1 - p) \le \frac14$.)`,
      fields: [{ label: "n =", ans: 1068 }], hint: R`$2\cdot 1{,}96\sqrt{\frac{1}{4n}} \le 0{,}06$.`,
      sol: R`$\frac{1{,}96}{\sqrt n} \le 0{,}06 \iff \sqrt n \ge 32{,}67 \iff n \ge 1067{,}1$, άρα $n = 1068$.` },
    { level: 1, type: "fields", q: R`Στην R, τι τιμή (3 δεκαδικά) επιστρέφει η εντολή <code>qt(0.975, df = 15)</code>; (Χρησιμοποιήστε τον πίνακα της κατανομής $t$.)`,
      fields: [{ label: "τιμή =", ans: 2.131, tol: 0.001 / 2.131 }], hint: R`Είναι το άνω $0{,}025$ σημείο της $t_{15}$.`,
      sol: R`<code>qt(0.975, 15)</code> δίνει το σημείο με $P(T \le t) = 0{,}975$, δηλαδή $t_{15}(0{,}025) \approx 2{,}131$ — η τιμή που χρειάζεται για διάστημα $95\%$ με $n = 16$.` }
  ]
},
/* ───────────────────────────── 8.2 ───────────────────────────── */
{
  id: "8.2", unit: 8, title: "Διαστήματα εμπιστοσύνης για δύο πληθυσμούς – Ζευγαρωτές παρατηρήσεις",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Διαστήματα εμπιστοσύνης για δύο πληθυσμούς, μικρά δείγματα",
  theory: R`
<div class="tbox"><h4>Μεγάλα δείγματα</h4>
<p>Από ανεξάρτητα τυχαία δείγματα μεγέθους $n_1$, $n_2$ (μεγάλα), διάστημα εμπιστοσύνης $1 - \alpha$:</p>
<ul><li>για τη διαφορά μέσων $\mu_1 - \mu_2$: $\ \bar X - \bar Y \pm z_{\alpha/2}\sqrt{\frac{S_1^2}{n_1} + \frac{S_2^2}{n_2}}$ (με $\sigma_1^2, \sigma_2^2$ στη θέση των $S_1^2, S_2^2$ αν είναι γνωστές)·</li>
<li>για τη διαφορά ποσοστών $p_1 - p_2$: $\ \hat p_1 - \hat p_2 \pm z_{\alpha/2}\sqrt{\frac{\hat p_1(1 - \hat p_1)}{n_1} + \frac{\hat p_2(1 - \hat p_2)}{n_2}}$.</li></ul></div>
<div class="tbox"><h4>Μικρά δείγματα από κανονικούς πληθυσμούς</h4>
<p>Αν τα δείγματα είναι ανεξάρτητα, οι πληθυσμοί κανονικοί και με <b>ίσες</b> (άγνωστες) διασπορές, χρησιμοποιούμε τη <b>συγκεντρωτική</b> τυπική απόκλιση
$$S = \sqrt{\frac{(n_1 - 1)S_1^2 + (n_2 - 1)S_2^2}{n_1 + n_2 - 2}}, \qquad \bar X - \bar Y \pm t_{n_1 + n_2 - 2}(\alpha/2)\, S\sqrt{\frac{1}{n_1} + \frac{1}{n_2}}.$$</p></div>
<div class="tbox"><h4>Ζευγαρωτές παρατηρήσεις</h4>
<p>Όταν και οι δύο μετρήσεις γίνονται <b>στα ίδια άτομα/αντικείμενα</b> (π.χ. πριν και μετά από ένα φάρμακο), δουλεύουμε με τις διαφορές $D_k = X_k - Y_k$: $\ \bar D \pm t_{n-1}(\alpha/2)\frac{S_D}{\sqrt n}$ (κανονικές διαφορές) ή $\bar D \pm z_{\alpha/2}\frac{S_D}{\sqrt n}$ για μεγάλο $n$.</p>
<p><b>Ερμηνεία:</b> αν το διάστημα για τη διαφορά <b>περιέχει το $0$</b>, τα δεδομένα δεν δείχνουν σημαντική διαφορά στο αντίστοιχο επίπεδο.</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>t.test(x, y, var.equal = TRUE)$conf.int</code> (συγκεντρωτική διασπορά) · <code>t.test(x, y, paired = TRUE)$conf.int</code> (ζευγαρωτές) · <code>qt(0.975, df = 20)</code> → <code>2.085963</code> · <code>prop.test(c(120, 125), c(200, 250), correct = FALSE)$conf.int</code>. Προσοχή: χωρίς <code>var.equal = TRUE</code> η <code>t.test(x, y)</code> κάνει τη μέθοδο Welch (μη συγκεντρωτική διασπορά, β.ε. κατά Welch–Satterthwaite), όχι τη μέθοδο των σημειώσεων.</p></div>`,
  widget: "psbtdist",
  gen: "psbci2",
  exercises: [
    { level: 1, type: "fields", q: R`Δύο ανεξάρτητα δείγματα έδωσαν $n_1 = 100$, $\bar x_1 = 52$, $s_1 = 8$ και $n_2 = 150$, $\bar x_2 = 48$, $s_2 = 10$. Να κατασκευάσετε διάστημα εμπιστοσύνης $95\%$ για τη διαφορά $\mu_1 - \mu_2$ ($z_{0{,}025} = 1{,}96$, 3 δεκαδικά).`,
      fields: [{ label: "κάτω άκρο =", ans: 1.76, tol: 0.003 / 1.76 }, { label: "άνω άκρο =", ans: 6.24, tol: 0.003 / 6.24 }],
      hint: R`$\sqrt{\frac{64}{100} + \frac{100}{150}}$.`, sol: R`$\sqrt{0{,}64 + 0{,}6667} \approx 1{,}1431$, περιθώριο $1{,}96\cdot 1{,}1431 \approx 2{,}240$: $4 \pm 2{,}240 = (1{,}760;\ 6{,}240)$. Δεν περιέχει το $0$: η διαφορά είναι σημαντική σε επίπεδο $5\%$.` },
    { level: 2, type: "fields", q: R`Σε δημοσκόπηση, $120$ από $200$ άνδρες και $125$ από $250$ γυναίκες υποστηρίζουν μια πρόταση. Να κατασκευάσετε διάστημα εμπιστοσύνης $95\%$ για τη διαφορά $p_1 - p_2$ ($z_{0{,}025} = 1{,}96$, 4 δεκαδικά).`,
      fields: [{ label: "κάτω άκρο =", ans: 0.0081, tol: 0.0008 }, { label: "άνω άκρο =", ans: 0.1919, tol: 0.0008 }],
      hint: R`$\hat p_1 = 0{,}6$, $\hat p_2 = 0{,}5$.`, sol: R`$\sqrt{\frac{0{,}6\cdot 0{,}4}{200} + \frac{0{,}5\cdot 0{,}5}{250}} = \sqrt{0{,}0022} \approx 0{,}0469$, περιθώριο $\approx 0{,}0919$: $0{,}1 \pm 0{,}0919 = (0{,}0081;\ 0{,}1919)$.` },
    { level: 2, type: "fields", q: R`Δύο ανεξάρτητα δείγματα από κανονικούς πληθυσμούς με ίσες διασπορές έδωσαν $n_1 = 10$, $\bar x_1 = 25$, $s_1 = 4$ και $n_2 = 12$, $\bar x_2 = 21$, $s_2 = 5$. Να βρείτε τη συγκεντρωτική διασπορά $S^2$ και διάστημα εμπιστοσύνης $95\%$ για τη $\mu_1 - \mu_2$ (δίνεται $t_{20}(0{,}025) = 2{,}086$, 3 δεκαδικά).`,
      fields: [{ label: "S² =", ans: 20.95, tol: 0.002 / 20.95 }, { label: "κάτω άκρο =", ans: -0.088, tol: 0.004 }, { label: "άνω άκρο =", ans: 8.088, tol: 0.004 / 8.088 }],
      hint: R`$S^2 = \frac{9\cdot 16 + 11\cdot 25}{20}$.`,
      sol: R`$S^2 = \frac{144 + 275}{20} = 20{,}95$, $S \approx 4{,}5771$. $S\sqrt{\frac{1}{10} + \frac{1}{12}} \approx 1{,}9598$, περιθώριο $2{,}086\cdot 1{,}9598 \approx 4{,}088$: $4 \pm 4{,}088 = (-0{,}088;\ 8{,}088)$. Περιέχει το $0$: δεν φαίνεται σημαντική διαφορά σε επίπεδο $5\%$.` },
    { level: 2, type: "fields", q: R`Για $8$ ασθενείς μετρήθηκε μια ποσότητα πριν και μετά από θεραπεία· οι διαφορές (πριν − μετά) είναι $5, 3, 8, -1, 6, 4, 2, 5$. Υποθέτοντας κανονικότητα, να βρείτε τον μέσο $\bar d$ των διαφορών και διάστημα εμπιστοσύνης $95\%$ για τη μέση διαφορά (δίνεται $t_7(0{,}025) = 2{,}365$, 3 δεκαδικά).`,
      fields: [{ label: "d̄ =", ans: 4 }, { label: "κάτω άκρο =", ans: 1.721, tol: 0.003 / 1.721 }, { label: "άνω άκρο =", ans: 6.279, tol: 0.003 / 6.279 }],
      hint: R`$s_D^2 = \frac{1}{7}\sum (d_k - \bar d)^2$.`,
      sol: R`$\bar d = 32/8 = 4$, $\sum (d_k - 4)^2 = 1 + 1 + 16 + 25 + 4 + 0 + 4 + 1 = 52$, $s_D = \sqrt{52/7} \approx 2{,}7255$. Περιθώριο $2{,}365\cdot\frac{2{,}7255}{\sqrt 8} \approx 2{,}279$: $(1{,}721;\ 6{,}279)$.` },
    { level: 1, type: "mc", q: R`Ένα διάστημα εμπιστοσύνης $95\%$ για τη διαφορά $\mu_1 - \mu_2$ βρέθηκε $(-1{,}2;\ 3{,}4)$. Τι συμπεραίνουμε;`,
      options: ["Τα δεδομένα δεν δείχνουν σημαντική διαφορά των δύο μέσων σε επίπεδο $5\\%$", "Ισχύει $\\mu_1 > \\mu_2$ με εμπιστοσύνη $95\\%$", "Ισχύει $\\mu_1 = \\mu_2$ με βεβαιότητα", "Ισχύει $\\mu_1 < \\mu_2$, αφού το κάτω άκρο είναι αρνητικό"], correct: 0,
      hint: R`Περιέχει το διάστημα το $0$;`, sol: R`Το $0$ ανήκει στο διάστημα, άρα η τιμή $\mu_1 - \mu_2 = 0$ είναι συμβατή με τα δεδομένα: δεν υπάρχει σημαντική διαφορά. Αυτό όμως δεν <b>αποδεικνύει</b> ότι οι μέσοι είναι ίσοι.` },
    { level: 1, type: "mc", q: R`Σε ποια περίπτωση χρησιμοποιούμε διάστημα εμπιστοσύνης για <b>ζευγαρωτές</b> παρατηρήσεις;`,
      options: ["Όταν μετράμε τα ίδια άτομα πριν και μετά από μια παρέμβαση", "Όταν συγκρίνουμε δύο ανεξάρτητες ομάδες διαφορετικών ατόμων", "Όταν τα δείγματα έχουν διαφορετικό μέγεθος", "Όταν συγκρίνουμε δύο ποσοστά"], correct: 0,
      hint: R`Οι δύο μετρήσεις κάθε μονάδας είναι εξαρτημένες.`, sol: R`Στις ζευγαρωτές παρατηρήσεις κάθε μονάδα δίνει δύο μετρήσεις (π.χ. πριν και μετά), οπότε δουλεύουμε με τις διαφορές $D_k$. Για ανεξάρτητες ομάδες χρησιμοποιούμε τα διαστήματα δύο ανεξάρτητων δειγμάτων.` },
    { level: 1, type: "mc", q: R`Το διάστημα με τη συγκεντρωτική τυπική απόκλιση $S$ και την κατανομή $t_{n_1 + n_2 - 2}$ προϋποθέτει κανονικούς πληθυσμούς με ίσες διασπορές και ανεξάρτητα δείγματα.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Δείτε τις προϋποθέσεις στη θεωρία.`, sol: R`Σωστό: για μικρά δείγματα το διάστημα ισχύει μόνο κάτω από αυτές τις υποθέσεις.` },
    { level: 3, type: "fields", q: R`Δύο κανονικοί πληθυσμοί έχουν γνωστές τυπικές αποκλίσεις $\sigma_1 = 6$ και $\sigma_2 = 8$. Ανεξάρτητα δείγματα μεγέθους $n_1 = 36$ και $n_2 = 64$ έδωσαν $\bar x_1 = 70$ και $\bar x_2 = 65$. Να κατασκευάσετε διάστημα εμπιστοσύνης $99\%$ για τη $\mu_1 - \mu_2$ ($z_{0{,}005} = 2{,}576$, 3 δεκαδικά).`,
      fields: [{ label: "κάτω άκρο =", ans: 1.357, tol: 0.003 / 1.357 }, { label: "άνω άκρο =", ans: 8.643, tol: 0.003 / 8.643 }],
      hint: R`$\sqrt{\frac{36}{36} + \frac{64}{64}} = \sqrt 2$.`, sol: R`Τυπικό σφάλμα $\sqrt 2 \approx 1{,}4142$, περιθώριο $2{,}576\cdot 1{,}4142 \approx 3{,}643$: $5 \pm 3{,}643 = (1{,}357;\ 8{,}643)$.` },
    { level: 1, type: "mc", q: R`Ποια εντολή της R δίνει διάστημα εμπιστοσύνης για τη μέση διαφορά σε <b>ζευγαρωτές</b> παρατηρήσεις <code>x</code>, <code>y</code>;`,
      options: ["<code>t.test(x, y, paired = TRUE)</code>", "<code>t.test(x, y, var.equal = TRUE)</code>", "<code>prop.test(x, y)</code>", "<code>cor.test(x, y)</code>"], correct: 0,
      hint: R`Το όρισμα που δηλώνει ζεύγη.`, sol: R`Το <code>paired = TRUE</code> κάνει την ανάλυση στις διαφορές <code>x - y</code>. Το <code>var.equal = TRUE</code> αφορά δύο ανεξάρτητα δείγματα με συγκεντρωτική διασπορά, η <code>prop.test</code> ποσοστά και η <code>cor.test</code> συσχέτιση.` }
  ]
},
/* ───────────────────────────── 9.1 ───────────────────────────── */
{
  id: "9.1", unit: 9, title: "Έλεγχοι υποθέσεων – Έλεγχος Z για μέση τιμή και ποσοστό – p-τιμή",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Έλεγχοι υποθέσεων",
  theory: R`
<div class="tbox"><h4>Μηδενική και εναλλακτική υπόθεση</h4>
<p>Η <b>μηδενική υπόθεση</b> $H_0$ (π.χ. $\mu = 82$) εκφράζει ό,τι υποθέτουμε ότι ισχύει μέχρι στιγμής· η <b>εναλλακτική</b> $H_1$ τον νέο ισχυρισμό που χρειάζεται επιβεβαίωση ($\mu > 82$ ή $\mu < 82$: <b>μονόπλευρος</b> έλεγχος· $\mu \ne 82$: <b>αμφίπλευρος</b>). Ελέγχουμε αν η διαφορά παρατηρούμενου – αναμενόμενου είναι <b>στατιστικώς σημαντική</b> ή οφείλεται στην τύχη.</p></div>
<div class="tbox"><h4>Ελεγχοσυνάρτηση και p-τιμή</h4>
<p>$$Z = \frac{\text{Π} - \text{Α}}{\text{ΣΕ}}:\qquad Z = \frac{\bar X - \mu_0}{\sigma/\sqrt n}\ \ (\text{ή } S \text{ για μεγάλο } n), \qquad Z = \frac{\hat p - p_0}{\sqrt{p_0(1 - p_0)/n}}.$$
Η <b>p-τιμή</b> είναι η πιθανότητα, <b>αν ισχύει η $H_0$</b>, η ελεγχοσυνάρτηση να είναι τουλάχιστον τόσο ακραία (προς την κατεύθυνση της $H_1$) όσο αυτή που παρατηρήσαμε:</p>
<ul><li>$H_1: \mu > \mu_0$: $\ p = P(Z \ge z)$· $\quad H_1: \mu < \mu_0$: $\ p = P(Z \le z)$·</li>
<li>αμφίπλευρος: $\ p = P(|Z| \ge |z|) = 2P(Z \ge |z|)$ (διπλάσια της μονόπλευρης).</li></ul>
<p>Σε <b>επίπεδο σημαντικότητας</b> $\alpha$ (συνήθως $5\%$ ή $1\%$) απορρίπτουμε την $H_0$ αν $p \le \alpha$. Ισοδύναμα: απορρίπτουμε αν $z > z_\alpha$ (δεξιόπλευρος), $z < -z_\alpha$ (αριστερόπλευρος), $|z| > z_{\alpha/2}$ (αμφίπλευρος).</p></div>
<div class="tbox warn"><h4>Σφάλματα</h4>
<p><b>Σφάλμα τύπου Ι</b>: απορρίπτουμε την $H_0$ ενώ είναι ορθή — πιθανότητα $\alpha$. <b>Σφάλμα τύπου ΙΙ</b>: αποδεχόμαστε την $H_0$ ενώ είναι λανθασμένη — πιθανότητα $\beta$. Η <b>ισχύς</b> του ελέγχου είναι $1 - \beta$, η πιθανότητα απόρριψης μιας λανθασμένης $H_0$. Δεν μπορούμε να ελαχιστοποιήσουμε και τα δύο σφάλματα ταυτόχρονα. Η μη απόρριψη της $H_0$ <b>δεν</b> αποδεικνύει ότι ισχύει.</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p>p-τιμή από την τιμή $z$ της ελεγχοσυνάρτησης: <code>1 - pnorm(z)</code> (δεξιόπλευρος), <code>pnorm(z)</code> (αριστερόπλευρος), <code>2 * (1 - pnorm(abs(z)))</code> (αμφίπλευρος). Π.χ. <code>2 * (1 - pnorm(2))</code> → <code>0.04550026</code>. Για ποσοστό: <code>prop.test(148, 400, p = 0.4, alternative = "less", correct = FALSE)</code>.</p></div>`,
  widget: "psbtest",
  gen: "psbtest",
  exercises: [
    { level: 1, type: "fields", q: R`Η μέση διάρκεια ζωής μιας συσκευής ήταν $82$ ώρες. Με νέο υλικό, δείγμα $64$ συσκευών έδωσε $\bar x = 86$ ώρες και $s = 16$. Ελέγχουμε $H_0: \mu = 82$ έναντι $H_1: \mu > 82$. Να υπολογίσετε την ελεγχοσυνάρτηση $Z$ και την p-τιμή. Δίνεται $\Phi(2) = 0{,}9772$.`,
      fields: [{ label: "Z =", ans: 2 }, { label: "p-τιμή =", ans: 0.0228, tol: 0.0006 }],
      hint: R`Μεγάλο δείγμα: $\text{ΣΕ} = s/\sqrt n = 2$.`, sol: R`$Z = \frac{86 - 82}{16/8} = 2$, $\ p = P(Z \ge 2) = 1 - 0{,}9772 = 0{,}0228 \le 0{,}05$: απορρίπτουμε την $H_0$ σε επίπεδο $5\%$ — το νέο υλικό αυξάνει τη μέση διάρκεια ζωής.` },
    { level: 1, type: "fields", q: R`Ελέγχουμε $H_0: \mu = 100$ έναντι $H_1: \mu \ne 100$, με $\sigma = 15$ γνωστό. Από δείγμα $n = 36$ βρέθηκε $\bar x = 105$. Να υπολογίσετε την ελεγχοσυνάρτηση $Z$ και την p-τιμή. Δίνεται $\Phi(2) = 0{,}9772$.`,
      fields: [{ label: "Z =", ans: 2 }, { label: "p-τιμή =", ans: 0.0456, tol: 0.0006 }], hint: R`$\sigma/\sqrt n = 2{,}5$· αμφίπλευρος έλεγχος.`,
      sol: R`$Z = \frac{105 - 100}{15/6} = 2$, $\ p = 2(1 - 0{,}9772) = 0{,}0456 \le 0{,}05$: απορρίπτουμε την $H_0$ σε $\alpha = 0{,}05$ (όχι όμως σε $\alpha = 0{,}01$).` },
    { level: 2, type: "fields", q: R`Ελέγχουμε $H_0: \mu = 50$ έναντι $H_1: \mu < 50$ με $\sigma = 5$. Από δείγμα $n = 25$ βρέθηκε $\bar x = 48{,}5$. Να υπολογίσετε την ελεγχοσυνάρτηση $Z$ και την p-τιμή. Δίνεται $\Phi(1{,}5) = 0{,}9332$.`,
      fields: [{ label: "Z =", ans: -1.5, tol: 0.006 / 1.5 }, { label: "p-τιμή =", ans: 0.0668, tol: 0.0006 }], hint: R`Αριστερόπλευρος: $p = P(Z \le z)$.`,
      sol: R`$Z = \frac{48{,}5 - 50}{5/5} = -1{,}5$, $\ p = \Phi(-1{,}5) = 1 - 0{,}9332 = 0{,}0668 > 0{,}05$: δεν απορρίπτουμε την $H_0$ σε επίπεδο $5\%$.` },
    { level: 2, type: "fields", q: R`Παλαιότερα το $40\%$ των ανδρών μιας χώρας κάπνιζε. Μετά από μια εκστρατεία, σε δείγμα $400$ ανδρών οι $148$ ήταν καπνιστές. Ελέγχουμε $H_0: p = 0{,}4$ έναντι $H_1: p < 0{,}4$. Να υπολογίσετε την ελεγχοσυνάρτηση $Z$ (2 δεκαδικά) και την p-τιμή. Δίνεται $\Phi(1{,}22) = 0{,}8888$.`,
      fields: [{ label: "Z =", ans: -1.22, tol: 0.008 / 1.22 }, { label: "p-τιμή =", ans: 0.1112, tol: 0.0006 }],
      hint: R`Στον παρονομαστή χρησιμοποιούμε το $p_0$: $\sqrt{0{,}4\cdot 0{,}6/400}$.`,
      sol: R`$\hat p = 0{,}37$, $\ Z = \frac{0{,}37 - 0{,}4}{\sqrt{0{,}24/400}} = \frac{-0{,}03}{0{,}0245} \approx -1{,}22$, $\ p = P(Z \le -1{,}22) = 1 - 0{,}8888 = 0{,}1112 > 0{,}05$: η $H_0$ δεν απορρίπτεται· δεν αποδεικνύεται ότι η εκστρατεία μείωσε το ποσοστό.` },
    { level: 2, type: "fields", q: R`Ένας κατασκευαστής ισχυρίζεται ότι το $15\%$ των συσκευών του χρειάζεται επισκευή στο πρώτο έτος. Σε δείγμα $500$ συσκευών, $90$ χρειάστηκαν επισκευή. Ελέγχουμε $H_0: p = 0{,}15$ έναντι $H_1: p \ne 0{,}15$. Να υπολογίσετε την ελεγχοσυνάρτηση $Z$ (2 δεκαδικά) και την p-τιμή. Δίνεται $\Phi(1{,}88) = 0{,}9699$.`,
      fields: [{ label: "Z =", ans: 1.88, tol: 0.008 / 1.88 }, { label: "p-τιμή =", ans: 0.0602, tol: 0.0006 }],
      hint: R`$\hat p = 0{,}18$· αμφίπλευρος: $p = 2P(Z \ge |z|)$.`,
      sol: R`$Z = \frac{0{,}18 - 0{,}15}{\sqrt{0{,}15\cdot 0{,}85/500}} = \frac{0{,}03}{0{,}01597} \approx 1{,}88$, $\ p = 2(1 - 0{,}9699) = 0{,}0602 > 0{,}05$: δεν απορρίπτουμε την $H_0$ σε επίπεδο $5\%$ (θα την απορρίπταμε όμως σε $10\%$).` },
    { level: 1, type: "mc", q: R`Σφάλμα τύπου Ι είναι:`,
      options: ["Η απόρριψη της $H_0$ ενώ είναι ορθή", "Η αποδοχή της $H_0$ ενώ είναι λανθασμένη", "Η απόρριψη της $H_0$ ενώ είναι λανθασμένη", "Ένα λάθος στους υπολογισμούς"], correct: 0,
      hint: R`Πιθανότητα $\alpha$.`, sol: R`Τύπου Ι: απορρίπτουμε ορθή $H_0$ (πιθανότητα $\alpha$). Η αποδοχή λανθασμένης $H_0$ είναι σφάλμα τύπου ΙΙ, ενώ η απόρριψη λανθασμένης $H_0$ είναι σωστή απόφαση.` },
    { level: 1, type: "mc", q: R`Η p-τιμή είναι η πιθανότητα να είναι ορθή η $H_0$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Η p-τιμή υπολογίζεται <b>υποθέτοντας</b> ότι ισχύει η $H_0$.`,
      sol: R`Λάθος: είναι η πιθανότητα να παρατηρήσουμε κάτι τόσο ακραίο <b>αν</b> ισχύει η $H_0$, όχι η πιθανότητα της $H_0$ με δεδομένα τα δεδομένα.` },
    { level: 1, type: "mc", q: R`Αν απορρίπτουμε την $H_0$ σε επίπεδο σημαντικότητας $1\%$, τότε την απορρίπτουμε και σε επίπεδο $5\%$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`$p \le 0{,}01 \Rightarrow p \le 0{,}05$.`, sol: R`Σωστό: απόρριψη σε $1\%$ σημαίνει $p \le 0{,}01$, άρα και $p \le 0{,}05$. Το αντίστροφο δεν ισχύει.` },
    { level: 3, type: "fields", q: R`Ελέγχουμε $H_0: \mu = 50$ έναντι $H_1: \mu > 50$, με $\sigma = 10$, $n = 25$ και $\alpha = 0{,}05$ ($z_{0{,}05} = 1{,}645$). Να βρείτε την κρίσιμη τιμή $c$ του $\bar x$ (απορρίπτουμε αν $\bar x > c$) και την ισχύ του ελέγχου όταν στην πραγματικότητα $\mu = 55$. Δίνεται $\Phi(0{,}855) = 0{,}8037$.`,
      fields: [{ label: "c =", ans: 53.29, tol: 0.006 / 53.29 }, { label: "ισχύς =", ans: 0.8037, tol: 0.0006 }],
      hint: R`$c = 50 + 1{,}645\cdot 2$· ισχύς $= P(\bar X > c)$ όταν $\mu = 55$.`,
      sol: R`$c = 50 + 1{,}645\cdot\frac{10}{5} = 53{,}29$. Αν $\mu = 55$: $P(\bar X > 53{,}29) = P\!\left(Z > \frac{53{,}29 - 55}{2}\right) = P(Z > -0{,}855) = \Phi(0{,}855) = 0{,}8037$, άρα $\beta \approx 0{,}1963$.` },
    { level: 1, type: "mc", q: R`Ποια εντολή της R δίνει την p-τιμή ενός <b>αμφίπλευρου</b> ελέγχου Z όταν η ελεγχοσυνάρτηση πήρε την τιμή $z = 2$;`,
      options: ["<code>2 * (1 - pnorm(2))</code>", "<code>1 - pnorm(2)</code>", "<code>pnorm(2)</code>", "<code>2 * pnorm(2)</code>"], correct: 0,
      hint: R`Αμφίπλευρη = διπλάσια της μονόπλευρης.`, sol: R`$p = 2P(Z \ge 2) = 2(1 - \Phi(2))$, δηλαδή <code>2 * (1 - pnorm(2))</code> $\approx 0{,}0455$. Η <code>1 - pnorm(2)</code> είναι η μονόπλευρη p-τιμή, η <code>pnorm(2)</code> η $\Phi(2)$ και η <code>2 * pnorm(2)</code> ξεπερνά το $1$.` }
  ]
},
/* ───────────────────────────── 9.2 ───────────────────────────── */
{
  id: "9.2", unit: 9, title: "Έλεγχος t – Έλεγχοι για δύο πληθυσμούς",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Έλεγχος t, Έλεγχοι για δύο πληθυσμούς",
  theory: R`
<div class="tbox"><h4>Έλεγχος t (ένα δείγμα)</h4>
<p>Για <b>μικρό</b> δείγμα από <b>κανονικό</b> πληθυσμό με άγνωστο $\sigma$:
$$T = \frac{\bar X - \mu_0}{S/\sqrt n} \sim t_{n-1} \quad \text{υπό την } H_0.$$
Δεξιόπλευρος σε επίπεδο $\alpha$: απορρίπτουμε αν $T > t_{n-1}(\alpha)$· αμφίπλευρος: αν $|T| > t_{n-1}(\alpha/2)$.</p></div>
<div class="tbox"><h4>Δύο πληθυσμοί</h4>
<ul><li><b>Μέσοι, μεγάλα ανεξάρτητα δείγματα</b>: $\ Z = \frac{\bar X - \bar Y}{\sqrt{S_1^2/n_1 + S_2^2/n_2}}$.</li>
<li><b>Ποσοστά</b>: υπό την $H_0: p_1 = p_2$ η κοινή τιμή εκτιμάται από το $\hat p = \frac{X + Y}{n_1 + n_2}$ (συγκεντρωτικό ποσοστό) και $\ Z = \frac{\hat p_1 - \hat p_2}{\sqrt{\hat p(1 - \hat p)\left(\frac{1}{n_1} + \frac{1}{n_2}\right)}}$.</li>
<li><b>Μέσοι, μικρά δείγματα</b>, κανονικοί πληθυσμοί με ίσες διασπορές: $\ T = \frac{\bar X - \bar Y}{S\sqrt{1/n_1 + 1/n_2}} \sim t_{n_1 + n_2 - 2}$, με $S$ τη συγκεντρωτική τυπική απόκλιση. Αν $S_1/S_2 \notin [0{,}5;\ 2]$, η υπόθεση ίσων διασπορών δεν είναι ρεαλιστική· χρησιμοποιούμε $T = \frac{\bar X - \bar Y}{\sqrt{S_1^2/n_1 + S_2^2/n_2}}$ με $k = \min\{n_1 - 1, n_2 - 1\}$ βαθμούς ελευθερίας.</li>
<li><b>Ζευγαρωτές παρατηρήσεις</b>: έλεγχος t στις διαφορές, $\ T = \frac{\bar D}{S_D/\sqrt n} \sim t_{n-1}$ για $H_0: \mu_D = 0$.</li></ul></div>
<div class="tbox warn"><h4>Προσοχή</h4>
<p>Οι βαθμοί ελευθερίας είναι $n - 1$ για ένα δείγμα και $n_1 + n_2 - 2$ για δύο. Η υπόθεση ίσων διασπορών χρειάζεται για τη θεωρητική τεκμηρίωση του ελέγχου με τη συγκεντρωτική $S$. Ζευγαρωτές μετρήσεις <b>δεν</b> αναλύονται ως ανεξάρτητα δείγματα.</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>t.test(x, mu = 140, alternative = "less")</code> · <code>t.test(x, y, var.equal = TRUE, alternative = "greater")</code> · <code>t.test(x, y, paired = TRUE)</code> · <code>prop.test(c(60, 45), c(150, 150), alternative = "greater", correct = FALSE)</code> · κρίσιμες τιμές: <code>qt(0.95, df = 9)</code> → <code>1.833113</code>. Χωρίς <code>var.equal = TRUE</code> η <code>t.test(x, y)</code> κάνει τον έλεγχο Welch (μη συγκεντρωτική διασπορά, β.ε. κατά Welch–Satterthwaite), όχι τον έλεγχο των σημειώσεων.</p></div>`,
  widget: "psbtwo",
  gen: "psbtest2",
  exercises: [
    { level: 1, type: "fields", q: R`Από κανονικό πληθυσμό με άγνωστο $\sigma$, δείγμα $n = 16$ έδωσε $\bar x = 12{,}6$ και $s = 2$. Ελέγχουμε $H_0: \mu = 12$ έναντι $H_1: \mu > 12$ σε επίπεδο $5\%$ ($t_{15}(0{,}05) = 1{,}753$). Να υπολογίσετε την ελεγχοσυνάρτηση $T$.`,
      fields: [{ label: "T =", ans: 1.2, tol: 0.006 / 1.2 }], hint: R`$T = \frac{\bar x - \mu_0}{s/\sqrt n}$.`,
      sol: R`$T = \frac{12{,}6 - 12}{2/4} = 1{,}2 < 1{,}753$: δεν απορρίπτουμε την $H_0$· τα δεδομένα δεν δείχνουν σημαντικά ότι $\mu > 12$.` },
    { level: 2, type: "fields", q: R`Ένας κατασκευαστής ισχυρίζεται ότι η μέση πίεση που αντέχει ένα εξάρτημα είναι $140$ μονάδες. Από κανονικό πληθυσμό, δείγμα $10$ εξαρτημάτων έδωσε $\bar x = 134$ και $s = 8$. Ελέγχουμε $H_0: \mu = 140$ έναντι $H_1: \mu < 140$ σε επίπεδο $5\%$ ($t_9(0{,}05) = 1{,}833$). Να υπολογίσετε την ελεγχοσυνάρτηση $T$ (3 δεκαδικά).`,
      fields: [{ label: "T =", ans: -2.372, tol: 0.004 / 2.372 }], hint: R`$s/\sqrt{10} \approx 2{,}5298$.`,
      sol: R`$T = \frac{134 - 140}{8/\sqrt{10}} = \frac{-6}{2{,}5298} \approx -2{,}372 < -1{,}833$: απορρίπτουμε την $H_0$ σε επίπεδο $5\%$· η μέση αντοχή είναι μικρότερη από $140$.` },
    { level: 2, type: "fields", q: R`Δύο ανεξάρτητα δείγματα έδωσαν $n_1 = 100$, $\bar x_1 = 52$, $s_1 = 8$ και $n_2 = 150$, $\bar x_2 = 48$, $s_2 = 10$. Για τον έλεγχο $H_0: \mu_1 = \mu_2$ έναντι $H_1: \mu_1 > \mu_2$, να υπολογίσετε την ελεγχοσυνάρτηση $Z$ (2 δεκαδικά).`,
      fields: [{ label: "Z =", ans: 3.5, tol: 0.008 / 3.5 }], hint: R`$\text{ΣΕ} = \sqrt{\frac{64}{100} + \frac{100}{150}}$.`,
      sol: R`$\text{ΣΕ} = \sqrt{1{,}3067} \approx 1{,}1431$, $\ Z = \frac{52 - 48}{1{,}1431} \approx 3{,}50$. Η p-τιμή $P(Z \ge 3{,}50) \approx 0{,}0002$ είναι πολύ μικρή: η $H_0$ απορρίπτεται σε κάθε συνηθισμένο επίπεδο.` },
    { level: 2, type: "fields", q: R`Σε δύο ανεξάρτητα δείγματα $150$ ατόμων το καθένα, $60$ και $45$ άτομα αντίστοιχα έχουν ένα χαρακτηριστικό. Ελέγχουμε $H_0: p_1 = p_2$ έναντι $H_1: p_1 > p_2$. Να βρείτε το συγκεντρωτικό ποσοστό $\hat p$, την ελεγχοσυνάρτηση $Z$ (2 δεκαδικά) και την p-τιμή. Δίνεται $\Phi(1{,}82) = 0{,}9656$.`,
      fields: [{ label: "p̂ =", ans: 0.35, tol: 0.0006 }, { label: "Z =", ans: 1.82, tol: 0.008 / 1.82 }, { label: "p-τιμή =", ans: 0.0344, tol: 0.0006 }],
      hint: R`$\hat p = \frac{60 + 45}{300}$.`,
      sol: R`$\hat p_1 = 0{,}4$, $\hat p_2 = 0{,}3$, $\hat p = 0{,}35$. $Z = \frac{0{,}1}{\sqrt{0{,}35\cdot 0{,}65\cdot\frac{2}{150}}} = \frac{0{,}1}{0{,}0551} \approx 1{,}82$, $\ p = 1 - 0{,}9656 = 0{,}0344 \le 0{,}05$: απορρίπτουμε την $H_0$ σε επίπεδο $5\%$ (όχι σε $1\%$).` },
    { level: 2, type: "fields", q: R`Δύο ανεξάρτητα δείγματα από κανονικούς πληθυσμούς με ίσες διασπορές έδωσαν $n_1 = 10$, $\bar x_1 = 25$, $s_1 = 4$ και $n_2 = 12$, $\bar x_2 = 21$, $s_2 = 5$. Ελέγχουμε $H_0: \mu_1 = \mu_2$ έναντι $H_1: \mu_1 > \mu_2$ σε επίπεδο $5\%$ ($t_{20}(0{,}05) = 1{,}725$). Να υπολογίσετε την ελεγχοσυνάρτηση $T$ (3 δεκαδικά).`,
      fields: [{ label: "T =", ans: 2.041, tol: 0.004 / 2.041 }], hint: R`$S^2 = \frac{9\cdot 16 + 11\cdot 25}{20} = 20{,}95$.`,
      sol: R`$S \approx 4{,}5771$, $S\sqrt{\frac{1}{10} + \frac{1}{12}} \approx 1{,}9598$, $\ T = \frac{4}{1{,}9598} \approx 2{,}041 > 1{,}725$: απορρίπτουμε την $H_0$ σε επίπεδο $5\%$ (μονόπλευρος έλεγχος).` },
    { level: 2, type: "fields", q: R`Για $8$ ασθενείς οι διαφορές (πριν − μετά) μιας μέτρησης είναι $5, 3, 8, -1, 6, 4, 2, 5$. Υποθέτοντας κανονικότητα, ελέγχουμε $H_0: \mu_D = 0$ έναντι $H_1: \mu_D \ne 0$ σε επίπεδο $5\%$ ($t_7(0{,}025) = 2{,}365$). Να υπολογίσετε την ελεγχοσυνάρτηση $T$ (3 δεκαδικά).`,
      fields: [{ label: "T =", ans: 4.151, tol: 0.004 / 4.151 }], hint: R`$\bar d = 4$, $s_D = \sqrt{52/7}$.`,
      sol: R`$s_D \approx 2{,}7255$, $\ T = \frac{4}{2{,}7255/\sqrt 8} = \frac{4}{0{,}9636} \approx 4{,}151 > 2{,}365$: απορρίπτουμε την $H_0$· η θεραπεία μεταβάλλει σημαντικά τη μέτρηση.` },
    { level: 1, type: "mc", q: R`Μετρήθηκε η χοληστερίνη $12$ ασθενών πριν και μετά τη λήψη ενός φαρμάκου. Ποιος έλεγχος είναι κατάλληλος για να εξετάσουμε αν το φάρμακο τη μειώνει;`,
      options: ["Έλεγχος t στις διαφορές (ζευγαρωτές παρατηρήσεις)", "Έλεγχος t δύο ανεξάρτητων δειγμάτων με συγκεντρωτική διασπορά", "Έλεγχος για τη διαφορά δύο ποσοστών", "Έλεγχος για τον συντελεστή συσχέτισης"], correct: 0,
      hint: R`Οι δύο μετρήσεις αφορούν τους ίδιους ασθενείς.`, sol: R`Οι μετρήσεις είναι ζευγαρωτές (ίδιοι ασθενείς), άρα εφαρμόζουμε έλεγχο t στις διαφορές $D_k$ με $11$ βαθμούς ελευθερίας. Ο έλεγχος ανεξάρτητων δειγμάτων θα αγνοούσε την εξάρτηση των μετρήσεων.` },
    { level: 1, type: "mc", q: R`Στον έλεγχο t για ένα δείγμα μεγέθους $n$, η ελεγχοσυνάρτηση ακολουθεί υπό την $H_0$ κατανομή $t$ με $n$ βαθμούς ελευθερίας.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Ένας βαθμός ελευθερίας «χάνεται» στην εκτίμηση του $\mu$ από το $\bar X$.`, sol: R`Λάθος: οι βαθμοί ελευθερίας είναι $n - 1$.` },
    { level: 1, type: "mc", q: R`Ποια εντολή της R εκτελεί τον έλεγχο $H_0: \mu = 140$ έναντι $H_1: \mu < 140$ για τα δεδομένα <code>x</code>;`,
      options: ["<code>t.test(x, mu = 140, alternative = \"less\")</code>", "<code>t.test(x, mu = 140)</code>", "<code>t.test(x, mu = 140, alternative = \"greater\")</code>", "<code>prop.test(x, p = 140)</code>"], correct: 0,
      hint: R`Αριστερόπλευρη εναλλακτική.`, sol: R`Το <code>alternative = "less"</code> αντιστοιχεί στην $H_1: \mu < 140$. Χωρίς αυτό η R κάνει αμφίπλευρο έλεγχο, το <code>"greater"</code> αντιστοιχεί στο $\mu > 140$ και η <code>prop.test</code> αφορά ποσοστά.` }
  ]
},
/* ───────────────────────────── 10.1 ───────────────────────────── */
{
  id: "10.1", unit: 10, title: "Συσχέτιση – Συντελεστής συσχέτισης – Έλεγχος ρ = 0",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Συσχέτιση",
  theory: R`
<div class="tbox"><h4>Διάγραμμα διασποράς και συντελεστής συσχέτισης</h4>
<p>Τα ζεύγη $(x_k, y_k)$, $k = 1, \dots, n$, τοποθετούνται στο <b>διάγραμμα διασποράς</b>. Ο (δειγματικός) <b>συντελεστής συσχέτισης</b> μετρά τη <b>γραμμική</b> σχέση των δύο μεταβλητών:
$$r = \frac{\sum_{k=1}^{n}(x_k - \bar x)(y_k - \bar y)}{\sqrt{\sum_{k=1}^{n}(x_k - \bar x)^2\ \sum_{k=1}^{n}(y_k - \bar y)^2}} = \frac{\frac{1}{n - 1}\left(\sum x_ky_k - n\bar x\bar y\right)}{s_x s_y}.$$
Ισχύει $-1 \le r \le 1$· τιμές κοντά στο $1$ (ή στο $-1$) δείχνουν ισχυρή θετική (ή αρνητική) γραμμική σχέση.</p></div>
<div class="tbox"><h4>Ιδιότητες</h4>
<ol><li>Είναι καθαρός αριθμός (χωρίς μονάδες) και δεν αλλάζει αν πολλαπλασιάσουμε τις τιμές μιας μεταβλητής με θετικό αριθμό ή προσθέσουμε σε όλες τον ίδιο αριθμό· αλλάζει πρόσημο αν πολλαπλασιάσουμε τη μία με αρνητικό αριθμό.</li>
<li>$r = 0$ σημαίνει ότι δεν υπάρχει <b>γραμμική</b> σχέση — μπορεί να υπάρχει ισχυρή μη γραμμική.</li>
<li>Επηρεάζεται πολύ από <b>απόμακρες παρατηρήσεις</b>.</li>
<li>Συσχέτιση <b>δεν</b> σημαίνει αιτιότητα.</li></ol></div>
<div class="tbox"><h4>Έλεγχος συσχέτισης</h4>
<p>Το $r$ εκτιμά τον πληθυσμιακό συντελεστή $\rho$. Για τον έλεγχο $H_0: \rho = 0$ έναντι $H_1: \rho \ne 0$, με την υπόθεση ότι τα $(X_k, Y_k)$ ακολουθούν διδιάστατη κανονική κατανομή,
$$t = \frac{r\sqrt{n - 2}}{\sqrt{1 - r^2}} \sim t_{n-2} \quad \text{υπό την } H_0.$$
Με την κανονικότητα ο έλεγχος είναι ουσιαστικά έλεγχος <b>ανεξαρτησίας</b>· γενικά ανεξάρτητες μεταβλητές είναι ασυσχέτιστες, αλλά το αντίστροφο ισχύει όταν τα $(X, Y)$ ακολουθούν από κοινού (διδιάστατη) κανονική κατανομή.</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>plot(x, y)</code> (διάγραμμα διασποράς) · <code>cor(x, y)</code> · <code>cor.test(x, y)</code> (δίνει $t$, βαθμούς ελευθερίας $n - 2$ και p-τιμή). Π.χ. <code>cor(1:5, c(2, 4, 5, 4, 5))</code> → <code>0.7745967</code>.</p></div>`,
  widget: "psbcorr",
  gen: "psbcor",
  exercises: [
    { level: 1, type: "fields", q: R`Για τα δεδομένα $x: 1, 2, 3, 4, 5$ και $y: 2, 4, 5, 4, 5$, να υπολογίσετε τον συντελεστή συσχέτισης $r$ (4 δεκαδικά).`,
      fields: [{ label: "r =", ans: 0.7746, tol: 0.0006 }], hint: R`$S_{xx} = 10$, $S_{yy} = 6$, $S_{xy} = 6$.`,
      sol: R`$\bar x = 3$, $\bar y = 4$, $\sum (x_k - \bar x)(y_k - \bar y) = 6$, $\sum (x_k - \bar x)^2 = 10$, $\sum (y_k - \bar y)^2 = 6$. $r = \frac{6}{\sqrt{60}} \approx 0{,}7746$.` },
    { level: 2, type: "fields", q: R`Για $n = 10$ ζεύγη δίνονται $\sum x_k = 50$, $\sum y_k = 80$, $\sum x_k^2 = 290$, $\sum x_ky_k = 440$ και $\sum y_k^2 = 700$. Να υπολογίσετε τον συντελεστή συσχέτισης $r$ (4 δεκαδικά).`,
      fields: [{ label: "r =", ans: 0.8165, tol: 0.0006 }], hint: R`$S_{xy} = \sum x_ky_k - n\bar x\bar y$ κ.λπ.`,
      sol: R`$\bar x = 5$, $\bar y = 8$. $S_{xx} = 290 - 250 = 40$, $S_{yy} = 700 - 640 = 60$, $S_{xy} = 440 - 400 = 40$. $r = \frac{40}{\sqrt{2400}} \approx 0{,}8165$.` },
    { level: 2, type: "fields", q: R`Για $10$ μαθητές δίνονται $\bar x = 46$, $\bar y = 76$, $s_x = 16{,}58$, $s_y = 15{,}11$ και $\sum x_ky_k = 36854$. Να υπολογίσετε τον συντελεστή συσχέτισης $r$ (2 δεκαδικά).`,
      fields: [{ label: "r =", ans: 0.84, tol: 0.006 }], hint: R`$r = \frac{\frac{1}{n - 1}(\sum x_ky_k - n\bar x\bar y)}{s_xs_y}$.`,
      sol: R`$\sum x_ky_k - 10\cdot 46\cdot 76 = 36854 - 34960 = 1894$, $\ r = \frac{1894/9}{16{,}58\cdot 15{,}11} = \frac{210{,}44}{250{,}52} \approx 0{,}84$: ισχυρή θετική γραμμική σχέση.` },
    { level: 2, type: "fields", q: R`Σε δείγμα $n = 18$ ζευγών από διδιάστατη κανονική κατανομή βρέθηκε $r = 0{,}6$. Να υπολογίσετε την ελεγχοσυνάρτηση $t$ για τον έλεγχο $H_0: \rho = 0$ έναντι $H_1: \rho \ne 0$. Δίνεται $t_{16}(0{,}025) = 2{,}120$.`,
      fields: [{ label: "t =", ans: 3 }], hint: R`$t = \frac{r\sqrt{n - 2}}{\sqrt{1 - r^2}}$.`,
      sol: R`$t = \frac{0{,}6\cdot 4}{\sqrt{0{,}64}} = \frac{2{,}4}{0{,}8} = 3 > 2{,}120$: απορρίπτουμε την $H_0$· η συσχέτιση είναι στατιστικώς σημαντική σε επίπεδο $5\%$.` },
    { level: 1, type: "mc", q: R`Το ύψος $x$ (σε μέτρα) και το βάρος $y$ μιας ομάδας ατόμων έχουν $r = 0{,}7$. Αν μετατρέψουμε το ύψος σε εκατοστά, ο νέος συντελεστής συσχέτισης είναι:`,
      options: ["$0{,}7$", "$70$", "$0{,}007$", "$-0{,}7$"], correct: 0,
      hint: R`Πολλαπλασιασμός με θετικό αριθμό.`, sol: R`Ο συντελεστής συσχέτισης είναι καθαρός αριθμός: δεν αλλάζει όταν πολλαπλασιάζουμε μια μεταβλητή με θετικό αριθμό ($100$), άρα μένει $0{,}7$.` },
    { level: 1, type: "mc", q: R`Αν $r = 0$, τότε δεν υπάρχει καμία σχέση μεταξύ των $X$ και $Y$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Τι είδους σχέση μετρά το $r$;`, sol: R`Λάθος: το $r$ μετρά μόνο <b>γραμμική</b> σχέση. Π.χ. για $x = -2, -1, 0, 1, 2$ και $y = x^2$ είναι $r = 0$, αλλά το $y$ καθορίζεται πλήρως από το $x$.` },
    { level: 1, type: "mc", q: R`Συντελεστής συσχέτισης $r = -0{,}95$ σημαίνει:`,
      options: ["Ισχυρή αρνητική γραμμική σχέση: όταν αυξάνει το $x$, το $y$ τείνει να μειώνεται", "Ασθενής σχέση, γιατί το $r$ είναι αρνητικό", "Ότι η αύξηση του $x$ προκαλεί μείωση του $y$", "Ότι το $95\\%$ των σημείων είναι πάνω σε ευθεία"], correct: 0,
      hint: R`Η ισχύς φαίνεται από το $|r|$, η κατεύθυνση από το πρόσημο.`, sol: R`$|r| = 0{,}95$ κοντά στο $1$: ισχυρή γραμμική σχέση, με αρνητική κλίση. Η συσχέτιση δεν αποδεικνύει αιτιότητα, και δεν μετρά ποσοστό σημείων.` },
    { level: 1, type: "mc", q: R`Όλα τα σημεία ενός διαγράμματος διασποράς βρίσκονται πάνω στην ευθεία $y = -2x + 3$. Ποιος είναι ο συντελεστής συσχέτισης;`,
      options: ["$-1$", "$-2$", "$0$", "$3$"], correct: 0, hint: R`Τέλεια γραμμική σχέση με αρνητική κλίση.`,
      sol: R`Τα σημεία είναι ακριβώς σε ευθεία με αρνητική κλίση, άρα $r = -1$. Η κλίση $-2$ δεν είναι ο συντελεστής συσχέτισης (ο $r$ ανήκει πάντα στο $[-1, 1]$).` },
    { level: 1, type: "fields", q: R`Τι επιστρέφει στην R η εντολή <code>cor(c(1, 2, 3, 4), c(2, 4, 6, 8))</code>;`,
      fields: [{ label: "τιμή =", ans: 1 }], hint: R`$y = 2x$.`, sol: R`Τα σημεία είναι πάνω στην ευθεία $y = 2x$ με θετική κλίση, άρα $r = 1$.` }
  ]
},
/* ───────────────────────────── 10.2 ───────────────────────────── */
{
  id: "10.2", unit: 10, title: "Απλή γραμμική παλινδρόμηση – Πρόβλεψη – Σφάλμα παλινδρόμησης",
  book: "Σημειώσεις ΜΑΣ055 (Χριστοφίδης): Γραμμική παλινδρόμηση",
  theory: R`
<div class="tbox"><h4>Μοντέλο και ελάχιστα τετράγωνα</h4>
<p>Μοντέλο: $\ Y_k = \alpha + \beta x_k + \epsilon_k$, $k = 1, \dots, n$, με $E(Y_k) = \alpha + \beta x_k$. Οι εκτιμήτριες <b>ελαχίστων τετραγώνων</b> ελαχιστοποιούν το $g(\alpha, \beta) = \sum_{k=1}^{n}(y_k - \alpha - \beta x_k)^2$:
$$\hat\beta = \frac{\sum (x_k - \bar x)(y_k - \bar y)}{\sum (x_k - \bar x)^2} = r\,\frac{s_y}{s_x}, \qquad \hat\alpha = \bar y - \hat\beta\,\bar x.$$
Η ευθεία $\hat y = \hat\alpha + \hat\beta x$ διέρχεται από το $(\bar x, \bar y)$. Ερμηνεία: αν το $x$ είναι κατά $c$ τυπικές αποκλίσεις πάνω από το $\bar x$, το $\hat y$ είναι κατά $r\cdot c$ τυπικές αποκλίσεις πάνω από το $\bar y$.</p></div>
<div class="tbox"><h4>Σύμπτωμα της παλινδρόμησης – σφάλμα</h4>
<ul><li><b>Σύμπτωμα της παλινδρόμησης προς τον μέσο</b>: αφού $|r| < 1$, οι προβλέψεις είναι (σε τυπικές μονάδες) πιο κοντά στον μέσο από τις τιμές του $x$ — όσοι πήγαν πολύ καλά στην πρώτη μέτρηση κατά μέσο όρο «πέφτουν» λίγο στη δεύτερη. Η απόδοσή του σε άλλη αιτία είναι η <b>πλάνη της παλινδρόμησης</b>.</li>
<li><b>Ρίζα μέσου τετραγωνικού σφάλματος</b> (οι σημειώσεις το αποκαλούν «μέσο τετραγωνικό σφάλμα»): $\ \text{ΜΤΣ} \approx \sqrt{1 - r^2}\; s_y$ — περίπου το $68\%$ των προβλέψεων απέχει από την πραγματική τιμή το πολύ ένα ΜΤΣ και το $95\%$ το πολύ δύο. Αν $r = 0$ το ΜΤΣ είναι $s_y$, αν $r = \pm 1$ είναι $0$.</li>
<li><b>Συντελεστής προσδιορισμού</b> $R^2 = r^2$: ποσοστό της μεταβλητότητας του $y$ που εξηγεί η ευθεία.</li></ul></div>
<div class="tbox warn"><h4>Παγίδες</h4>
<p>Η ευθεία παλινδρόμησης της $x$ πάνω στην $y$ <b>δεν</b> είναι η $x = -\hat\alpha/\hat\beta + y/\hat\beta$ (που προκύπτει λύνοντας την $\hat y = \hat\alpha + \hat\beta x$ ως προς $x$)· είναι διαφορετική ευθεία, με κλίση $r\,s_x/s_y$. Προβλέψεις έχουν νόημα μόνο για τιμές του $x$ <b>μέσα στο εύρος</b> των δεδομένων.</p></div>
<div class="tbox tip"><h4>Στην R</h4>
<p><code>m &lt;- lm(y ~ x)</code> · <code>coef(m)</code> ($\hat\alpha$, $\hat\beta$) · <code>predict(m, data.frame(x = 53))</code> · <code>summary(m)$r.squared</code> · <code>plot(x, y); abline(m)</code>. Π.χ. για <code>x &lt;- c(2, 4, 6, 8); y &lt;- c(3, 7, 8, 12)</code>, η <code>coef(lm(y ~ x))</code> δίνει <code>0.5 1.4</code>.</p></div>`,
  widget: "psbreg",
  gen: "psbreg2",
  exercises: [
    { level: 1, type: "fields", q: R`Για τα δεδομένα $x: 1, 2, 3, 4, 5$ και $y: 2, 4, 5, 4, 5$, να βρείτε την κλίση $\hat\beta$ και τον σταθερό όρο $\hat\alpha$ της ευθείας ελαχίστων τετραγώνων.`,
      fields: [{ label: "β̂ =", ans: 0.6, tol: 0.0006 }, { label: "α̂ =", ans: 2.2, tol: 0.0006 / 2.2 }], hint: R`$\bar x = 3$, $\bar y = 4$, $\sum (x_k - \bar x)^2 = 10$.`,
      sol: R`$\sum (x_k - \bar x)(y_k - \bar y) = 4 + 0 + 0 + 0 + 2 = 6$, $\hat\beta = \frac{6}{10} = 0{,}6$, $\hat\alpha = 4 - 0{,}6\cdot 3 = 2{,}2$. Άρα $\hat y = 2{,}2 + 0{,}6x$.` },
    { level: 1, type: "fields", q: R`Με την ευθεία $\hat y = 2{,}2 + 0{,}6x$ (από δεδομένα με $x$ από $1$ ως $5$), να βρείτε την πρόβλεψη για $x = 4{,}5$ και το υπόλοιπο $y - \hat y$ στο σημείο $(2, 4)$.`,
      fields: [{ label: "ŷ(4,5) =", ans: 4.9, tol: 0.0006 / 4.9 }, { label: "υπόλοιπο =", ans: 0.6, tol: 0.0006 }], hint: R`Υπόλοιπο $= y - \hat y$.`,
      sol: R`$\hat y(4{,}5) = 2{,}2 + 2{,}7 = 4{,}9$. Στο $x = 2$: $\hat y = 3{,}4$, υπόλοιπο $4 - 3{,}4 = 0{,}6$ (το σημείο είναι πάνω από την ευθεία).` },
    { level: 2, type: "fields", q: R`Για $10$ μαθητές, $x$ ο βαθμός σε προκαταρκτική εξέταση και $y$ στην επίσημη: $\bar x = 46$, $\bar y = 76$, $s_x = 16{,}58$, $s_y = 15{,}11$, $r = 0{,}84$. Να βρείτε την κλίση $\hat\beta$ στρογγυλεμένη σε 2 δεκαδικά, τον σταθερό όρο $\hat\alpha$ με αυτή την τιμή, και την πρόβλεψη για $x = 53$.`,
      fields: [{ label: "β̂ =", ans: 0.77, tol: 0.006 }, { label: "α̂ =", ans: 40.58, tol: 0.02 / 40.58 }, { label: "ŷ(53) =", ans: 81.39, tol: 0.02 / 81.39 }],
      hint: R`$\hat\beta = r\frac{s_y}{s_x}$.`, sol: R`$\hat\beta = 0{,}84\cdot\frac{15{,}11}{16{,}58} \approx 0{,}77$, $\hat\alpha = 76 - 0{,}77\cdot 46 = 40{,}58$. Για $x = 53$: $\hat y = 40{,}58 + 0{,}77\cdot 53 = 81{,}39$.` },
    { level: 2, type: "fields", q: R`Με $r = 0{,}84$ και $s_y = 15{,}11$, να υπολογίσετε τη ρίζα του μέσου τετραγωνικού σφάλματος της παλινδρόμησης $\sqrt{1 - r^2}\,s_y$ (2 δεκαδικά).`,
      fields: [{ label: "ΜΤΣ =", ans: 8.2, tol: 0.012 / 8.2 }], hint: R`$1 - 0{,}84^2 = 0{,}2944$.`,
      sol: R`$\sqrt{0{,}2944}\cdot 15{,}11 \approx 0{,}5426\cdot 15{,}11 \approx 8{,}20$: το τυπικό μέγεθος (ρίζα μέσου τετραγώνου) των σφαλμάτων πρόβλεψης είναι περίπου $8{,}2$ μονάδες.` },
    { level: 2, type: "fields", q: R`Οι βαθμοί σε δύο εξετάσεις έχουν $r = 0{,}6$. Ένας μαθητής ήταν $1{,}5$ τυπικές αποκλίσεις πάνω από τον μέσο στην πρώτη εξέταση. Πόσες τυπικές αποκλίσεις πάνω από τον μέσο προβλέπεται να είναι στη δεύτερη;`,
      fields: [{ label: "τυπικές μονάδες =", ans: 0.9, tol: 0.0006 }], hint: R`$z_y = r\,z_x$.`,
      sol: R`$0{,}6\cdot 1{,}5 = 0{,}9$: η πρόβλεψη είναι πιο κοντά στον μέσο — το σύμπτωμα της παλινδρόμησης προς τον μέσο.` },
    { level: 3, type: "fields", q: R`Για $n = 10$ ζεύγη δίνονται $\sum x_k = 50$, $\sum y_k = 80$, $\sum x_k^2 = 290$, $\sum x_ky_k = 440$ και $\sum y_k^2 = 700$. Να βρείτε τα $\hat\beta$, $\hat\alpha$ της ευθείας ελαχίστων τετραγώνων και τον συντελεστή προσδιορισμού $R^2$ (4 δεκαδικά).`,
      fields: [{ label: "β̂ =", ans: 1 }, { label: "α̂ =", ans: 3 }, { label: "R² =", ans: "2/3", tol: 0.001 }],
      hint: R`$S_{xx} = \sum x_k^2 - n\bar x^2$, $S_{xy} = \sum x_ky_k - n\bar x\bar y$.`,
      sol: R`$\bar x = 5$, $\bar y = 8$. $S_{xx} = 40$, $S_{xy} = 40$, $S_{yy} = 60$. Άρα $\hat\beta = 1$, $\hat\alpha = 8 - 5 = 3$ και $R^2 = r^2 = \frac{1600}{2400} = \frac23 \approx 0{,}6667$.` },
    { level: 1, type: "mc", q: R`Η ευθεία ελαχίστων τετραγώνων διέρχεται πάντα από το σημείο $(\bar x, \bar y)$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`$\hat\alpha = \bar y - \hat\beta\bar x$.`, sol: R`Σωστό: $\hat y(\bar x) = \hat\alpha + \hat\beta\bar x = \bar y$.` },
    { level: 2, type: "mc", q: R`Η ευθεία παλινδρόμησης της $x$ πάνω στην $y$ προκύπτει λύνοντας την $\hat y = \hat\alpha + \hat\beta x$ ως προς $x$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Συγκρίνετε τις κλίσεις $r\frac{s_x}{s_y}$ και $\frac{1}{\hat\beta} = \frac{s_x}{r\,s_y}$.`,
      sol: R`Λάθος: η παλινδρόμηση της $x$ πάνω στην $y$ έχει κλίση $r\frac{s_x}{s_y}$, ενώ η αντιστροφή δίνει $\frac{s_x}{r\,s_y}$· ταυτίζονται μόνο όταν $r = \pm 1$.` },
    { level: 1, type: "mc", q: R`Ποια σχέση έχουν τα πρόσημα της κλίσης $\hat\beta$ και του συντελεστή συσχέτισης $r$;`,
      options: ["Είναι πάντα ίδια", "Είναι πάντα αντίθετα", "Δεν σχετίζονται", "Ίδια μόνο αν $\\hat\\alpha > 0$"], correct: 0,
      hint: R`$\hat\beta = r\frac{s_y}{s_x}$.`, sol: R`Αφού $\hat\beta = r\frac{s_y}{s_x}$ με $s_x, s_y > 0$, τα $\hat\beta$ και $r$ έχουν πάντα το ίδιο πρόσημο.` },
    { level: 1, type: "fields", q: R`Στην R εκτελούμε <code>x &lt;- c(2, 4, 6, 8); y &lt;- c(3, 7, 8, 12); coef(lm(y ~ x))</code>. Ποιες τιμές επιστρέφονται για τον σταθερό όρο και την κλίση;`,
      fields: [{ label: "σταθερός όρος =", ans: 0.5 }, { label: "κλίση =", ans: 1.4 }], hint: R`$\bar x = 5$, $\bar y = 7{,}5$, $S_{xx} = 20$.`,
      sol: R`$S_{xy} = (-3)(-4{,}5) + (-1)(-0{,}5) + 1\cdot 0{,}5 + 3\cdot 4{,}5 = 28$, άρα $\hat\beta = \frac{28}{20} = 1{,}4$ και $\hat\alpha = 7{,}5 - 1{,}4\cdot 5 = 0{,}5$.` }
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

/* ================= Πιθανότητες & Στατιστική ΜΑΣ055 — μέρος Α (κεφ. 1–3): widgets & γεννήτριες ================= */
const psaD = (v, d = 4) => { const r = +(+v).toFixed(d); return String(Object.is(r, -0) ? 0 : r).replace(".", "{,}"); };   /* δεκαδικός σε TeX */
const psaT = (v, d = 4) => { const r = +(+v).toFixed(d); return String(Object.is(r, -0) ? 0 : r).replace(".", ","); };      /* δεκαδικός σε κείμενο */
const psaC = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
const psaPw = (b, e) => e === 1 ? b : `${b}^{${e}}`;   /* δύναμη χωρίς ^1 */
const psaFact = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
const psaSort = a => [...a].sort((p, q) => p - q);
const psaMed = s => { const n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
function psaQuart(a) {
  const s = psaSort(a), n = s.length, h = Math.floor(n / 2);
  return { s, n, med: psaMed(s), q1: psaMed(s.slice(0, h)), q3: psaMed(s.slice(n - h)) };
}
const psaMean = a => a.reduce((p, v) => p + v, 0) / a.length;
const psaVar = a => { const m = psaMean(a); return a.reduce((p, v) => p + (v - m) ** 2, 0) / (a.length - 1); };
function psaBar(P, x, w, h, col, op = 0.75) { P.layer.appendChild(svgEl("rect", { x: P.sx(x - w / 2), y: P.sy(h), width: Math.max(0, P.sx(x + w / 2) - P.sx(x - w / 2)), height: Math.max(0, P.sy(0) - P.sy(h)), style: `fill:${col};fill-opacity:${op};stroke:var(--navy);stroke-width:1` })); }
function psaTxt(P, x, y, t, col = "var(--navy)", anchor = "middle", size = 13) { const e = svgEl("text", { x: P.sx(x), y: P.sy(y), "text-anchor": anchor, style: `font-family:var(--sans);font-weight:700;font-size:${size}px;fill:${col}` }); e.textContent = t; P.top.appendChild(e); return e; }
/* πιθανότητες κατανομών */
const psaBinP = (n, p, k) => psaC(n, k) * p ** k * (1 - p) ** (n - k);
const psaPoiP = (l, k) => Math.exp(-l) * l ** k / psaFact(k);
const psaGeoP = (p, k) => (1 - p) ** (k - 1) * p;
const psaHypP = (N, K, n, k) => psaC(K, k) * psaC(N - K, n - k) / psaC(N, n);

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 1.1 Εξερευνητής δεδομένων: θηκόγραμμα + ιστόγραμμα ---------- */
  psaData(box) {
    const PRE = [["Βαθμοί (συμμετρικά)", "12 14 15 15 16 16 17 17 17 18 18 19 20 21"], ["Χρόνοι αναμονής (θετική ασυμμετρία)", "1 2 2 3 3 3 4 4 5 6 7 9 12 18"], ["Με ακραία τιμή", "4 5 5 6 6 7 7 7 8 8 9 31"], ["Δικά μου δεδομένα", ""]];
    box.innerHTML = `<div class="wctl"><label>δεδομένα <select class="ps">${PRE.map((p, i) => `<option value="${i}">${p[0]}</option>`).join("")}</select></label>
      <label style="flex:1 1 260px">τιμές <input type="text" class="pv" style="flex:1;min-width:0;width:100%;font:inherit;padding:6px 8px;border:1px solid var(--line);border-radius:8px"></label></div>
      <div class="pl"></div><div class="pl2"></div><div class="wout"></div>`;
    const sel = $(".ps", box), inp = $(".pv", box);
    function draw() {
      const vals = inp.value.replace(/,/g, ".").split(/[\s;]+/).filter(x => x !== "").map(Number).filter(v => isFinite(v));
      if (vals.length < 4) { $(".pl", box).innerHTML = ""; $(".pl2", box).innerHTML = ""; $(".wout", box).innerHTML = "Δώστε τουλάχιστον 4 αριθμούς, χωρισμένους με κενό."; return; }
      const Q = psaQuart(vals), iqr = Q.q3 - Q.q1, lo = Q.q1 - 1.5 * iqr, hi = Q.q3 + 1.5 * iqr, m = psaMean(vals), s2 = psaVar(vals);
      const out = Q.s.filter(v => v < lo || v > hi), inl = Q.s.filter(v => v >= lo && v <= hi);
      const mn = Q.s[0], mx = Q.s[Q.n - 1], pad = Math.max(1, (mx - mn) * 0.08);
      const P = makePlot($(".pl", box), { xmin: mn - pad, xmax: mx + pad, ymin: -1.2, ymax: 2.4, H: 170, xstep: niceStep(mx - mn + 2 * pad), ystep: 10 });
      const y0 = 1;
      P.layer.appendChild(svgEl("rect", { x: P.sx(Q.q1), y: P.sy(y0 + .55), width: P.sx(Q.q3) - P.sx(Q.q1), height: P.sy(y0 - .55) - P.sy(y0 + .55), style: "fill:rgba(15,111,209,.18);stroke:var(--blue);stroke-width:2" }));
      P.seg(Q.med, y0 - .55, Q.med, y0 + .55, "curve c2");
      P.seg(inl[0], y0, Q.q1, y0, "curve c1"); P.seg(Q.q3, y0, inl[inl.length - 1], y0, "curve c1");
      P.seg(inl[0], y0 - .3, inl[0], y0 + .3, "curve c1"); P.seg(inl[inl.length - 1], y0 - .3, inl[inl.length - 1], y0 + .3, "curve c1");
      out.forEach(v => P.top.appendChild(svgEl("circle", { cx: P.sx(v), cy: P.sy(y0), r: 5, style: "fill:#fff;stroke:var(--red);stroke-width:2.2" })));
      P.top.appendChild(svgEl("polygon", { points: `${P.sx(m)},${P.sy(-.25)} ${P.sx(m) - 7},${P.sy(-.85)} ${P.sx(m) + 7},${P.sy(-.85)}`, style: "fill:var(--amber)" }));
      psaTxt(P, Q.med, y0 + .75, "διάμεσος", "var(--green)", "middle", 12); psaTxt(P, m, -1.15, "x̄", "var(--amber)", "middle", 13);
      /* ιστόγραμμα */
      const k = Math.max(4, Math.min(8, Math.ceil(Math.sqrt(Q.n)) + 1)), w = (mx - mn) / k || 1, cnt = Array(k).fill(0);
      Q.s.forEach(v => { let i = Math.floor((v - mn) / w); if (i >= k) i = k - 1; cnt[i]++; });
      const H = makePlot($(".pl2", box), { xmin: mn - pad, xmax: mx + pad, ymin: -0.4, ymax: Math.max(...cnt) + 1, H: 170, xstep: niceStep(mx - mn + 2 * pad), ystep: Math.max(1, Math.ceil((Math.max(...cnt) + 1) / 5)) });
      cnt.forEach((c, i) => psaBar(H, mn + (i + .5) * w, w, c, "var(--purple)", .45));
      $(".wout", box).innerHTML = `$n = ${Q.n}$, $\\bar x = ${psaD(m, 3)}$, διάμεσος $= ${psaD(Q.med, 3)}$, $Q_1 = ${psaD(Q.q1, 3)}$, $Q_3 = ${psaD(Q.q3, 3)}$, $IQR = ${psaD(iqr, 3)}$<br>
        $s^2 = ${psaD(s2, 3)}$, $s = ${psaD(Math.sqrt(s2), 3)}$, όρια ακραίων: $[${psaD(lo, 3)},\\ ${psaD(hi, 3)}]$ — ${out.length ? `ακραίες τιμές: <b>${out.map(v => psaT(v, 3)).join(", ")}</b>` : "καμία ακραία τιμή"}
        <br><span class="muted">${m > Q.med + .05 * (mx - mn) ? "Η μέση τιμή είναι αρκετά μεγαλύτερη από τη διάμεσο: θετική ασυμμετρία (ή ακραίες μεγάλες τιμές)." : m < Q.med - .05 * (mx - mn) ? "Η μέση τιμή είναι αρκετά μικρότερη από τη διάμεσο: αρνητική ασυμμετρία." : "Μέση τιμή και διάμεσος κοντά: περίπου συμμετρική κατανομή."}</span>`;
      if (window.renderMathInElement) renderMathInElement($(".wout", box), { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
    }
    sel.onchange = () => { const i = +sel.value; if (PRE[i][1]) inp.value = PRE[i][1]; draw(); };
    inp.oninput = draw; inp.value = PRE[0][1]; draw();
  },

  /* ---------- 2.3 Δύο ζάρια: δεσμευμένη πιθανότητα και ανεξαρτησία ---------- */
  psaGrid(box) {
    const EV = [
      ["άθροισμα = 7", (a, b) => a + b === 7], ["άθροισμα ≥ 9", (a, b) => a + b >= 9], ["άθροισμα άρτιο", (a, b) => (a + b) % 2 === 0],
      ["1ο ζάρι = 3", (a, b) => a === 3], ["1ο ζάρι άρτιο", (a, b) => a % 2 === 0], ["2ο ζάρι ≥ 5", (a, b) => b >= 5],
      ["διπλές (ίδιες ενδείξεις)", (a, b) => a === b], ["τουλάχιστον ένα 6", (a, b) => a === 6 || b === 6], ["μέγιστη ένδειξη ≤ 3", (a, b) => Math.max(a, b) <= 3]];
    const opt = d => EV.map((e, i) => `<option value="${i}" ${i === d ? "selected" : ""}>${e[0]}</option>`).join("");
    box.innerHTML = `<div class="wctl"><label>A: <select class="ea">${opt(0)}</select></label><label>B: <select class="eb">${opt(3)}</select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const A = EV[+$(".ea", box).value][1], B = EV[+$(".eb", box).value][1];
      const svg = gyCanvas(box, 560, 330), c = 44, x0 = 150, y0 = 30; let nA = 0, nB = 0, nAB = 0;
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) {
        const ia = A(a, b), ib = B(a, b); nA += ia; nB += ib; nAB += ia && ib;
        const col = ia && ib ? "rgba(122,63,191,.55)" : ia ? "rgba(15,111,209,.35)" : ib ? "rgba(199,122,10,.35)" : "#fff";
        gyAdd(svg, "rect", { x: x0 + (b - 1) * c, y: y0 + (a - 1) * c, width: c - 2, height: c - 2, rx: 6, style: `fill:${col};stroke:var(--line)` });
        gyAdd(svg, "text", { x: x0 + (b - 1) * c + c / 2 - 1, y: y0 + (a - 1) * c + c / 2 + 4, "text-anchor": "middle", style: "font-family:var(--sans);font-size:12px;font-weight:700;fill:var(--navy)" }, `${a},${b}`);
      }
      gyAdd(svg, "text", { x: x0 + 3 * c, y: 20, "text-anchor": "middle", style: gyTS }, "2ο ζάρι →");
      gyAdd(svg, "text", { x: x0 - 12, y: y0 + 3 * c, "text-anchor": "end", style: gyTS }, "1ο ζάρι ↓");
      [["A μόνο", "rgba(15,111,209,.35)"], ["B μόνο", "rgba(199,122,10,.35)"], ["A∩B", "rgba(122,63,191,.55)"]].forEach(([t, col], i) => {
        gyAdd(svg, "rect", { x: 14, y: 70 + i * 30, width: 18, height: 18, rx: 4, style: `fill:${col};stroke:var(--line)` });
        gyAdd(svg, "text", { x: 38, y: 84 + i * 30, style: gyTS }, t);
      });
      const indep = nAB * 36 === nA * nB;
      $(".wout", box).innerHTML = `$P(A) = ${texFrac(nA, 36)}$, $P(B) = ${texFrac(nB, 36)}$, $P(A\\cap B) = ${texFrac(nAB, 36)}$<br>
        ${nB ? `$P(A\\mid B) = \\dfrac{${nAB}}{${nB}} = ${texFrac(nAB, nB)}$ — μέσα στις ${nB} ισοπίθανες περιπτώσεις του $B$ μετράμε όσες ανήκουν και στο $A$.` : ""}<br>
        <b>${indep ? "Ανεξάρτητα" : "Εξαρτημένα"}</b>: $P(A)P(B) = ${texFrac(nA * nB, 1296)}$ ${indep ? "=" : "\\ne"} $P(A\\cap B)$.`;
      if (window.renderMathInElement) renderMathInElement($(".wout", box), { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
    }
    box.querySelectorAll("select").forEach(s => s.onchange = draw); draw();
  },

  /* ---------- 2.4 Bayes: διαγνωστικό τεστ σε πληθυσμό 10 000 ---------- */
  psaBayes(box) {
    box.innerHTML = `<div class="wctl"><label>επιπολασμός ‰ <input type="range" class="rp" min="1" max="300" value="10"><b class="vp"></b></label>
      <label>ευαισθησία % <input type="range" class="rs" min="50" max="100" value="95"><b class="vs"></b></label>
      <label>ειδικότητα % <input type="range" class="rc" min="50" max="100" value="90"><b class="vc"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const p = +$(".rp", box).value / 1000, se = +$(".rs", box).value / 100, sp = +$(".rc", box).value / 100;
      $(".vp", box).textContent = psaT(p * 1000, 1) + "‰"; $(".vs", box).textContent = Math.round(se * 100) + "%"; $(".vc", box).textContent = Math.round(sp * 100) + "%";
      const N = 10000, D = N * p, TP = D * se, FN = D - TP, H = N - D, FP = H * (1 - sp), TN = H - FP;
      const svg = gyCanvas(box, 560, 300), x0 = 20, W = 520, y0 = 40, hh = 220;
      const wd = Math.max(8, W * p);
      const blk = (x, y, w, h, col, t) => { gyAdd(svg, "rect", { x, y, width: Math.max(0, w), height: Math.max(0, h), style: `fill:${col};stroke:#fff;stroke-width:1.5` }); if (t && w > 40 && h > 18) gyAdd(svg, "text", { x: x + w / 2, y: y + h / 2 + 5, "text-anchor": "middle", style: "font-family:var(--sans);font-size:12.5px;font-weight:800;fill:#fff" }, t); };
      blk(x0, y0, wd, hh * se, "#c0392b", "");
      blk(x0, y0 + hh * se, wd, hh * (1 - se), "#e8a39b", "");
      blk(x0 + wd, y0, W - wd, hh * (1 - sp), "#d68910", `ψευδώς θετικοί ${Math.round(FP)}`);
      blk(x0 + wd, y0 + hh * (1 - sp), W - wd, hh * sp, "#7f9db9", `υγιείς αρνητικοί ${Math.round(TN)}`);
      gyAdd(svg, "text", { x: x0, y: 26, style: gyTS }, `ασθενείς ${Math.round(D)} (αριστερή στήλη)`);
      gyAdd(svg, "text", { x: x0 + W, y: 26, "text-anchor": "end", style: gyTS }, `υγιείς ${Math.round(H)}`);
      gyAdd(svg, "text", { x: x0, y: y0 + hh + 24, style: "font-family:var(--sans);font-size:12.5px;font-weight:700;fill:#c0392b" }, `αληθώς θετικοί ${psaT(TP, 1)} · ψευδώς αρνητικοί ${psaT(FN, 1)}`);
      const Ppos = (TP + FP) / N, ppv = TP / (TP + FP), npv = TN / (TN + FN);
      $(".wout", box).innerHTML = `Σε $10\\,000$ άτομα: θετικά τεστ $= ${psaD(TP, 1)} + ${psaD(FP, 1)} = ${psaD(TP + FP, 1)}$, άρα $P(+) = ${psaD(Ppos, 4)}$.<br>
        $P(D\\mid +) = \\dfrac{${psaD(TP, 1)}}{${psaD(TP + FP, 1)}} = ${psaD(ppv, 4)}$ &nbsp;·&nbsp; $P(D^c\\mid -) = ${psaD(npv, 4)}$<br>
        <span class="muted">Όσο πιο σπάνια η νόσος, τόσο περισσότερο οι ψευδώς θετικοί (πορτοκαλί) «πνίγουν» τους αληθώς θετικούς (κόκκινο).</span>`;
      if (window.renderMathInElement) renderMathInElement($(".wout", box), { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 3.1 Συνάρτηση πιθανότητας, κατανομής, E(X), Var(X) ---------- */
  psaRV(box) {
    box.innerHTML = `<div class="wctl col"><span>Βάρη για τις τιμές $x = 0, 1, 2, 3, 4$ (κανονικοποιούνται ώστε το άθροισμα να είναι 1):</span>
      <div class="wctl">${[0, 1, 2, 3, 4].map(x => `<label>x = ${x} <input type="range" class="w${x}" min="0" max="10" value="${[1, 3, 4, 2, 0][x]}"><b class="v${x}"></b></label>`).join("")}</div></div>
      <div class="pl"></div><div class="pl2"></div><div class="wout"></div>`;
    function draw() {
      const w = [0, 1, 2, 3, 4].map(x => +$(".w" + x, box).value); w.forEach((v, x) => $(".v" + x, box).textContent = v);
      const S = w.reduce((a, b) => a + b, 0);
      if (!S) { $(".wout", box).textContent = "Τουλάχιστον ένα βάρος πρέπει να είναι θετικό."; return; }
      const p = w.map(v => v / S), E = p.reduce((a, v, x) => a + x * v, 0), E2 = p.reduce((a, v, x) => a + x * x * v, 0), V = E2 - E * E;
      const P = makePlot($(".pl", box), { xmin: -0.9, xmax: 4.7, ymin: -0.08, ymax: 1.05, H: 200, xstep: 1, ystep: 0.2 });
      p.forEach((v, x) => { psaBar(P, x, .6, v, "var(--blue)", .6); if (v > 0) psaTxt(P, x, v + .04, fracS2(w[x], S)); });
      P.seg(E, 0, E, .9, "curve c2"); psaTxt(P, E + .08, .93, "E(X)", "var(--green)", "start");
      const F = makePlot($(".pl2", box), { xmin: -1, xmax: 5, ymin: -0.08, ymax: 1.12, H: 170, xstep: 1, ystep: 0.2 });
      let c = 0; for (let x = -1; x <= 4; x++) { if (x >= 0) c += p[x]; const xr = x === 4 ? 5 : x + 1; F.seg(Math.max(x, -1), c, xr, c, "curve c1"); if (x >= 0) { F.top.appendChild(svgEl("circle", { cx: F.sx(x), cy: F.sy(c), r: 4.5, style: "fill:var(--blue)" })); if (p[x] > 0) F.top.appendChild(svgEl("circle", { cx: F.sx(x), cy: F.sy(c - p[x]), r: 4.5, style: "fill:#fff;stroke:var(--blue);stroke-width:2" })); } }
      psaTxt(F, -0.9, 1.04, "F(x) = P(X ≤ x)", "var(--navy)", "start", 12.5);
      $(".wout", box).innerHTML = `$E(X) = \\sum x\\,p(x) = ${psaD(E, 4)}$, $\\ E(X^2) = ${psaD(E2, 4)}$, $\\ \\mathrm{Var}(X) = E(X^2) - E(X)^2 = ${psaD(V, 4)}$, $\\ \\sigma = ${psaD(Math.sqrt(V), 4)}$<br>
        <span class="muted">Πάνω: συνάρτηση μάζας πιθανότητας. Κάτω: η κλιμακωτή συνάρτηση κατανομής — κάθε «σκαλί» έχει ύψος $p(x)$.</span>`;
      if (window.renderMathInElement) renderMathInElement(box, { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 3.2–3.3 Διακριτές κατανομές: διωνυμική, γεωμετρική, Poisson, υπεργεωμετρική ---------- */
  psaDist(box) {
    box.innerHTML = `<div class="wctl"><label>κατανομή <select class="dt"><option value="b">Διωνυμική b(n, p)</option><option value="g">Γεωμετρική (p)</option><option value="p">Poisson (λ)</option><option value="h">Υπεργεωμετρική (N, K, n)</option></select></label></div>
      <div class="wctl"><label class="la">n <input type="range" class="r1" min="1" max="30" value="10"><b class="v1"></b></label>
      <label class="lb">p <input type="range" class="r2" min="1" max="99" value="30"><b class="v2"></b></label>
      <label>k <input type="range" class="rk" min="0" max="30" value="3"><b class="vk"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    const dt = $(".dt", box);
    function setup() {
      const t = dt.value, r1 = $(".r1", box), r2 = $(".r2", box);
      const cfg = { b: ["n", 1, 30, 10, "p", 1, 99, 30], g: ["—", 1, 1, 1, "p", 5, 95, 25], p: ["λ (×0,5)", 1, 24, 6, "—", 1, 1, 1], h: ["N", 5, 40, 20, "K", 1, 20, 6] }[t];
      $(".la", box).firstChild.textContent = cfg[0] + " "; r1.min = cfg[1]; r1.max = cfg[2]; r1.value = cfg[3];
      $(".lb", box).firstChild.textContent = cfg[4] + " "; r2.min = cfg[5]; r2.max = cfg[6]; r2.value = cfg[7];
      $(".la", box).style.display = t === "g" ? "none" : ""; $(".lb", box).style.display = t === "p" ? "none" : "";
      draw();
    }
    function draw() {
      const t = dt.value, a = +$(".r1", box).value, b = +$(".r2", box).value; let k = +$(".rk", box).value;
      let xs = [], f, E, V, name, extra = "";
      if (t === "b") { const p = b / 100; name = `b(${a},\\,${psaD(p, 2)})`; xs = [...Array(a + 1).keys()]; f = x => psaBinP(a, p, x); E = a * p; V = a * p * (1 - p); $(".v1", box).textContent = a; $(".v2", box).textContent = psaT(p, 2); }
      else if (t === "g") { const p = b / 100; name = `\\text{Γεωμ}(${psaD(p, 2)})`; let m = 1; while ((1 - p) ** m > 0.004 && m < 30) m++; xs = [...Array(m).keys()].map(i => i + 1); f = x => psaGeoP(p, x); E = 1 / p; V = (1 - p) / p / p; $(".v2", box).textContent = psaT(p, 2); }
      else if (t === "p") { const l = a / 2; name = `\\text{Poisson}(${psaD(l, 1)})`; const m = Math.ceil(l + 4 * Math.sqrt(l) + 3); xs = [...Array(m + 1).keys()]; f = x => psaPoiP(l, x); E = V = l; $(".v1", box).textContent = psaT(l, 1); }
      else { const N = a, r2e = $(".r2", box); r2e.max = Math.min(20, N - 1); if (+r2e.value > N - 1) r2e.value = N - 1; const K = Math.min(b, N - 1), n = Math.min(Math.max(2, Math.round(N / 4)), N); name = `\\text{Υπεργ}(N = ${N}, K = ${K}, n = ${n})`; xs = []; for (let x = Math.max(0, n - (N - K)); x <= Math.min(n, K); x++) xs.push(x); f = x => psaHypP(N, K, n, x); E = n * K / N; V = n * K / N * (1 - K / N) * (N - n) / (N - 1); $(".v1", box).textContent = N; $(".v2", box).textContent = K; extra = ` (δείγμα $n = ${n}$)`; }
      const kmax = xs[xs.length - 1]; if (k > kmax) k = kmax; if (k < xs[0]) k = xs[0]; $(".rk", box).max = kmax; $(".rk", box).min = xs[0]; $(".rk", box).value = k; $(".vk", box).textContent = k;
      const ps = xs.map(f), top = Math.max(...ps);
      const P = makePlot($(".pl", box), { xmin: xs[0] - 1, xmax: kmax + 1, ymin: -top * 0.06, ymax: top * 1.15, H: 240, xstep: Math.max(1, Math.ceil((kmax - xs[0] + 2) / 15)), ystep: niceStep(top * 1.2) });
      let cum = 0; xs.forEach((x, i) => { if (x <= k) cum += ps[i]; psaBar(P, x, .7, ps[i], x === k ? "var(--red)" : x < k ? "var(--blue)" : "#9aa7b8", x <= k ? .7 : .45); });
      $(".wout", box).innerHTML = `$X \\sim ${name}$${extra}: $\\ P(X = ${k}) = ${psaD(f(k), 4)}$, $\\ P(X \\le ${k}) = ${psaD(cum, 4)}$, $\\ P(X > ${k}) = ${psaD(1 - cum, 4)}$<br>
        $E(X) = ${psaD(E, 3)}$, $\\ \\mathrm{Var}(X) = ${psaD(V, 3)}$${t === "p" ? " — στην Poisson μέση τιμή και διασπορά συμπίπτουν." : ""}`;
      if (window.renderMathInElement) renderMathInElement($(".wout", box), { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
    }
    dt.onchange = setup; box.querySelectorAll("input").forEach(i => i.oninput = draw); setup();
  },

  /* ---------- 1.2 Κατανομή σφαιριδίων σε δοχεία (stars and bars) ---------- */
  psaBins(box) {
    box.innerHTML = `<div class="wctl"><label>σφαιρίδια n <input type="range" class="rn" min="1" max="12" value="5"><b class="vn"></b></label>
      <label>δοχεία k <input type="range" class="rk" min="2" max="6" value="3"><b class="vk"></b></label>
      <label>σφαιρίδια <select class="ty"><option value="o">όμοια</option><option value="d">διακεκριμένα</option></select></label>
      <label><input type="checkbox" class="pos"> κάθε δοχείο μη κενό</label>
      <button class="btn ghost nx" type="button">Τυχαία τοποθέτηση</button></div><div class="pl"></div><div class="wout"></div>`;
    let conf = null;
    function rnd(n, k, pos) { let c; do { c = Array(k).fill(0); for (let i = 0; i < n; i++) c[ri(0, k - 1)]++; } while (pos && c.some(v => v === 0)); return c; }
    function draw(newc) {
      const n = +$(".rn", box).value, k = +$(".rk", box).value, ty = $(".ty", box).value, pos = $(".pos", box).checked && n >= k;
      $(".vn", box).textContent = n; $(".vk", box).textContent = k;
      if (newc || !conf || conf.length !== k || conf.reduce((a, b) => a + b, 0) !== n || (pos && conf.some(v => !v))) conf = rnd(n, k, pos);
      const svg = gyCanvas(box, 560, 150), W = 520 / k;
      conf.forEach((c, j) => {
        gyAdd(svg, "rect", { x: 20 + j * W + 6, y: 30, width: W - 12, height: 100, rx: 8, style: "fill:#fff;stroke:var(--navy);stroke-width:2" });
        gyAdd(svg, "text", { x: 20 + j * W + W / 2, y: 22, "text-anchor": "middle", style: gyTS }, "x" + (j + 1) + " = " + c);
        for (let b = 0; b < c; b++) { const cx = 20 + j * W + 18 + (b % Math.max(1, Math.floor((W - 24) / 18))) * 18, cy = 118 - Math.floor(b / Math.max(1, Math.floor((W - 24) / 18))) * 18; gyAdd(svg, "circle", { cx, cy, r: 7, style: "fill:var(--blue);fill-opacity:.75" }); }
      });
      const code = conf.map(c => "○".repeat(c)).join(" | ");
      let cnt, form;
      if (ty === "d") { cnt = pos ? null : k ** n; form = pos ? "" : `k^n = ${k}^{${n}}`; }
      else if (pos) { cnt = psaC(n - 1, k - 1); form = `\\binom{n-1}{k-1} = \\binom{${n - 1}}{${k - 1}}`; }
      else { cnt = psaC(n + k - 1, k - 1); form = `\\binom{n+k-1}{k-1} = \\binom{${n + k - 1}}{${k - 1}}`; }
      $(".wout", box).innerHTML = (ty === "o" ? `Κωδικοποίηση: <code>${code}</code> — ${n} σφαιρίδια και ${k - 1} διαχωριστικά σε ${n + k - 1} θέσεις.<br>` : "") +
        (cnt === null ? `Με διακεκριμένα σφαιρίδια και μη κενά δοχεία χρειάζεται εγκλεισμός–αποκλεισμός (επιλέξτε «όμοια» ή καταργήστε τον περιορισμό).` :
        `Πλήθος δυνατών τοποθετήσεων: $${form} = ${cnt}$` + (ty === "o" ? ` — ίσο με το πλήθος των ${pos ? "θετικών" : "μη αρνητικών"} ακέραιων λύσεων της $x_1 + \\dots + x_{${k}} = ${n}$.` : ` — κάθε σφαιρίδιο διαλέγει ανεξάρτητα ένα από τα ${k} δοχεία.`));
      if (window.renderMathInElement) renderMathInElement($(".wout", box), { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = () => draw(false)); $(".nx", box).onclick = () => draw(true); draw(true);
  }
});

/* ---- ΜΑΣ055: συνδυαστική και διαγράμματα Venn με τον συμβολισμό των σημειώσεων ---- */
const psaFall = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r *= n - i; return r; };
Object.assign(WIDGETS, {
  psaCombW(box) {
    const T = [["perm", "Μεταθέσεις n!"], ["arr", "Διατάξεις (n)_k"], ["rarr", "Διατάξεις με επανάληψη n^k"], ["comb", "Συνδυασμοί (n k)"], ["circ", "Κυκλικές μεταθέσεις (n−1)!"], ["word", "Πολυωνυμικός συντελεστής (αναγραμματισμοί)"]];
    box.innerHTML = `<div class="wctl"><label>Είδος <select class="ty">${T.map(t => `<option value="${t[0]}">${t[1]}</option>`).join("")}</select></label>
      <label class="nl">n <input type="range" class="rn" min="1" max="8" value="4"><b class="vn"></b></label>
      <label class="kl">k <input type="range" class="rk" min="0" max="8" value="2"><b class="vk"></b></label>
      <label class="wl">λέξη <input type="text" class="wd" value="MISSISSIPPI" maxlength="11" style="width:140px;font:inherit;padding:5px 8px;border-radius:8px;border:1px solid var(--line)"></label></div>
      <div class="cform wout"></div><div class="clist muted" style="font-family:var(--mono,monospace);font-size:13px;line-height:1.7;word-break:break-all"></div>`;
    const L = "abcdefgh".split("");
    const ty = $(".ty", box), rn = $(".rn", box), rk = $(".rk", box), wd = $(".wd", box);
    function gen(items, k, rep, ordered) {
      const out = [];
      (function rec(cur, start, used) {
        if (out.length > 300) return;
        if (cur.length === k) { out.push(cur.join("")); return; }
        for (let i = ordered ? 0 : start; i < items.length; i++) { if (!rep && used[i]) continue; used[i] = true; rec([...cur, items[i]], rep ? i : i + 1, used); used[i] = false; }
      })([], 0, []);
      return out;
    }
    function draw() {
      const t = ty.value, n = +rn.value; rk.max = t === "rarr" ? 5 : n; const k = Math.min(+rk.value, +rk.max); rk.value = k;
      $(".vn", box).textContent = n; $(".vk", box).textContent = k;
      $(".kl", box).style.display = ["arr", "rarr", "comb"].includes(t) ? "" : "none";
      $(".nl", box).style.display = t === "word" ? "none" : ""; $(".wl", box).style.display = t === "word" ? "" : "none";
      const it = L.slice(0, n); let tex = "", list = [], note = "";
      if (t === "perm") { tex = `${n}! = ${psaFact(n)}`; list = gen(it, n, false, true); note = "Όλες οι διατάξεις των n στοιχείων (η σειρά μετράει)."; }
      if (t === "arr") { tex = `(${n})_{${k}} = ${n}(${n}-1)\\cdots(${n}-${k}+1) = \\frac{${n}!}{(${n}-${k})!} = ${psaFall(n, k)}`; list = gen(it, k, false, true); note = "Διατεταγμένες επιλογές k στοιχείων χωρίς επανάθεση."; }
      if (t === "rarr") { tex = `${n}^{${k}} = ${n ** k}`; list = gen(it, k, true, true); note = "Διατεταγμένες επιλογές με επανάθεση (βασική αρχή μέτρησης)."; }
      if (t === "comb") { tex = `\\binom{${n}}{${k}} = \\frac{(${n})_{${k}}}{${k}!} = ${psaFall(n, k) / psaFact(k)}`; list = gen(it, k, false, false); note = "Μη διατεταγμένες επιλογές: κάθε υποσύνολο μετρά μία φορά."; }
      if (t === "circ") { tex = `(${n}-1)! = ${psaFact(n - 1)}`; list = gen(it.slice(1), n - 1, false, true).map(x => it[0] + x); note = `Σε κύκλο κρατάμε το ${it[0]} σταθερό και μεταθέτουμε τα υπόλοιπα.`; }
      if (t === "word") {
        const w = (wd.value || "A").toUpperCase().replace(/[^A-ZΑ-Ω]/g, "").slice(0, 11) || "A"; const c = {}; for (const ch of w) c[ch] = (c[ch] || 0) + 1;
        const ks = Object.values(c), val = ks.reduce((a, x) => a / psaFact(x), psaFact(w.length));
        tex = `\\binom{${w.length}}{${ks.join(",\\,")}} = \\frac{${w.length}!}{${ks.map(x => x + "!").join("\\,")}} = ${Math.round(val)}`;
        note = `Γράμματα: ${Object.entries(c).map(([a, b]) => a + "×" + b).join(", ")}.`; list = [];
      }
      $(".cform", box).innerHTML = `$$${tex}$$<span class="muted">${note}</span>`;
      $(".clist", box).textContent = list.length ? list.slice(0, 120).join("  ") + (list.length > 120 ? "  …" : "") : "";
      if (window.renderMathInElement) renderMathInElement($(".cform", box), { delimiters: [{ left: "$$", right: "$$", display: true }], throwOnError: false });
    }
    [ty, rn, rk, wd].forEach(e => e.oninput = draw); draw();
  },
  psaVennP(box) {
    const ops = [["A ∪ B", [1, 1, 1, 0]], ["A ∩ B", [0, 1, 0, 0]], ["A ∩ Bᶜ", [1, 0, 0, 0]], ["Aᶜ ∩ B", [0, 0, 1, 0]], ["Aᶜ", [0, 0, 1, 1]], ["(A ∪ B)ᶜ", [0, 0, 0, 1]], ["(A ∩ B)ᶜ", [1, 0, 1, 1]], ["Aᶜ ∪ Bᶜ", [1, 0, 1, 1]], ["Aᶜ ∩ Bᶜ", [0, 0, 0, 1]]];
    box.innerHTML = `<div class="wctl chips">${ops.map((o, i) => `<button class="chip" data-i="${i}">${o[0]}</button>`).join("")}</div>
      <div class="two"><div class="vsvg"></div><div class="wctl col">
      <label>P(A) <input type="range" class="rA" min="0" max="100" value="50"><b class="vA"></b></label>
      <label>P(B) <input type="range" class="rB" min="0" max="100" value="40"><b class="vB"></b></label>
      <label>P(A∩B) <input type="range" class="rX" min="0" max="100" value="20"><b class="vX"></b></label></div></div><div class="wout"></div>`;
    let cur = 0; const g = c => $(c, box), f2 = v => (v / 100).toFixed(2).replace(".", ",");
    function draw() {
      let A = +g(".rA").value, B = +g(".rB").value, X = +g(".rX").value;
      X = Math.min(X, A, B); if (A + B - X > 100) X = A + B - 100; g(".rX").value = X;
      g(".vA").textContent = f2(A); g(".vB").textContent = f2(B); g(".vX").textContent = f2(X);
      const pr = [A - X, X, B - X, 100 - (A + B - X)], on = ops[cur][1], uid = "p" + Math.random().toString(36).slice(2, 7), reg = i => on[i] ? "var(--blue)" : "transparent";
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
        <text x="90" y="113" class="vnum">${f2(pr[0])}</text><text x="160" y="113" class="vnum" text-anchor="middle">${f2(pr[1])}</text><text x="215" y="113" class="vnum">${f2(pr[2])}</text><text x="262" y="192" class="vnum">${f2(pr[3])}</text></svg>`;
      const val = pr.reduce((a, c, i) => a + (on[i] ? c : 0), 0), ind = Math.abs(X * 100 - A * B) < 1e-9;
      g(".wout").innerHTML = `<b>P(${ops[cur][0]}) = ${f2(val)}</b> &nbsp;·&nbsp; P(A ∪ B) = P(A) + P(B) − P(A ∩ B) = ${f2(A)} + ${f2(B)} − ${f2(X)} = <b>${f2(A + B - X)}</b>
        <br>P(A)·P(B) = ${(A * B / 10000).toFixed(4).replace(".", ",")} ${ind ? "= P(A ∩ B): τα A, B είναι <b>ανεξάρτητα</b>" : "≠ P(A ∩ B): τα A, B <b>δεν</b> είναι ανεξάρτητα"}${X === 0 && A > 0 && B > 0 ? " (ασυμβίβαστα με θετικές πιθανότητες ⇒ εξαρτημένα)" : ""}.
        <br><span class="muted">Σύγκρινε (A ∪ B)ᶜ με Aᶜ ∩ Bᶜ και (A ∩ B)ᶜ με Aᶜ ∪ Bᶜ: νόμοι De Morgan.</span>`;
      box.querySelectorAll(".chip").forEach((c, i) => c.classList.toggle("on", i === cur));
    }
    box.querySelectorAll(".chip").forEach(c => c.onclick = () => { cur = +c.dataset.i; draw(); });
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  psaDesc: { title: "Γεννήτρια — μέτρα θέσης και διασποράς", make() {
    const t = ri(0, 2);
    if (t === 0) { const n = bkPick([5, 7]), a = psaSort(Array.from({ length: n }, () => ri(2, 20))), S = a.reduce((p, v) => p + v, 0); if (S % n) return GENS.psaDesc.make();
      return { q: R`Για τα δεδομένα $${a.join(",\\ ")}$ να βρείτε τη μέση τιμή και τη διάμεσο.`, fields: [{ label: "μέση τιμή =", ans: S / n }, { label: "διάμεσος =", ans: psaMed(a) }],
        hint: R`Άθροισμα δια $n = ${n}$· διάμεσος η ${(n + 1) / 2}η τιμή.`, sol: R`$\bar x = ${S}/${n} = ${S / n}$ και $\tilde x = ${psaMed(a)}$ (η ${(n + 1) / 2}η από τις διατεταγμένες τιμές).` }; }
    if (t === 1) { const m = ri(4, 12), d = bkPick([[-3, -1, 0, 1, 3], [-4, -2, 1, 2, 3], [-2, -2, 0, 1, 3], [-5, -1, 1, 2, 3], [-3, -2, -1, 2, 4]]), a = psaSort(d.map(v => v + m)), SS = d.reduce((p, v) => p + v * v, 0);
      return { q: R`Για τα δεδομένα $${a.join(",\\ ")}$ να βρείτε τη μέση τιμή και τη δειγματική διασπορά $s^2$.`, fields: [{ label: "μέση τιμή =", ans: m }, { label: "s² =", ans: fracS2(SS, 4), tol: 0.002 }],
        hint: R`$s^2 = \frac{1}{n-1}\sum(x_i - \bar x)^2$ με $n - 1 = 4$.`, sol: R`$\bar x = ${m}$. Αποκλίσεις: $${psaSort(d).join(",\\ ")}$, τετράγωνα με άθροισμα $${SS}$. Άρα $s^2 = ${SS}/4 = ${texFrac(SS, 4)}$.` }; }
    const mu = ri(10, 40), s = ri(2, 8), a = bkPick([2, 3, -2, 0.5, 1.5]), b = gyNZ(-10, 10);
    return { q: R`Ένα δείγμα έχει $\bar x = ${mu}$ και $s = ${s}$. Αν $y_i = ${psaD(a)}x_i ${b < 0 ? "-" : "+"} ${Math.abs(b)}$, να βρείτε τα $\bar y$ και $s_y$.`,
      fields: [{ label: "ȳ =", ans: a * mu + b }, { label: "s_y =", ans: Math.abs(a) * s }],
      hint: R`$\bar y = a\bar x + b$, $s_y = |a|s_x$.`, sol: R`$\bar y = ${psaD(a)}\cdot ${mu} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${psaD(a * mu + b)}$ και $s_y = ${psaD(Math.abs(a))}\cdot ${s} = ${psaD(Math.abs(a) * s)}$· η σταθερά $b$ δεν επηρεάζει τη διασπορά.` };
  } },
  psaAx: { title: "Γεννήτρια — αξιώματα και προσθετικός νόμος", make() {
    const ab = ri(1, 4) * 5, a = ab + ri(1, 8) * 5, b = ab + ri(1, 8) * 5; if (a + b - ab > 100) return GENS.psaAx.make();
    const A = a / 100, B = b / 100, AB = ab / 100, U = (a + b - ab) / 100, t = ri(0, 1);
    if (t === 0) return { q: R`Αν $P(A) = ${psaD(A)}$, $P(B) = ${psaD(B)}$ και $P(A \cap B) = ${psaD(AB)}$, να βρείτε τις $P(A \cup B)$ και $P(A^c \cap B^c)$.`,
      fields: [{ label: "P(A∪B) =", ans: U }, { label: "P(Aᶜ∩Bᶜ) =", ans: (100 - a - b + ab) / 100 }],
      hint: R`Προσθετικός νόμος και De Morgan.`, sol: R`$P(A \cup B) = ${psaD(A)} + ${psaD(B)} - ${psaD(AB)} = ${psaD(U)}$ και $P(A^c \cap B^c) = 1 - P(A \cup B) = ${psaD(1 - U)}$.` };
    return { q: R`Αν $P(A) = ${psaD(A)}$, $P(B) = ${psaD(B)}$ και $P(A \cup B) = ${psaD(U)}$, να βρείτε την $P(A \cap B)$ και την πιθανότητα να πραγματοποιηθεί ακριβώς ένα από τα $A, B$.`,
      fields: [{ label: "P(A∩B) =", ans: AB }, { label: "P(ακριβώς ένα) =", ans: (a + b - 2 * ab) / 100 }],
      hint: R`$P(A \cap B) = P(A) + P(B) - P(A \cup B)$.`, sol: R`$P(A \cap B) = ${psaD(A + B)} - ${psaD(U)} = ${psaD(AB)}$. Ακριβώς ένα: $P(A \cup B) - P(A \cap B) = ${psaD((a + b - 2 * ab) / 100)}$.` };
  } },
  psaComb: { title: "Γεννήτρια — συνδυαστική και ισοπίθανα αποτελέσματα", make() {
    const t = ri(0, 3);
    if (t === 0) { const n = ri(6, 14), k = ri(2, 4); return { q: R`Με πόσους τρόπους επιλέγουμε επιτροπή $${k}$ ατόμων από $${n}$ άτομα; Με πόσους τρόπους, αν οι $${k}$ θέσεις είναι διαφορετικές (π.χ. πρόεδρος, γραμματέας, …);`,
      fields: [{ label: "επιτροπές =", ans: psaC(n, k) }, { label: "με θέσεις =", ans: psaC(n, k) * psaFact(k) }],
      hint: R`Συνδυασμοί και διατάξεις.`, sol: R`$\binom{${n}}{${k}} = ${psaC(n, k)}$ και $\frac{${n}!}{${n - k}!} = ${psaC(n, k) * psaFact(k)}$ ($= ${k}!\cdot\binom{${n}}{${k}}$).` }; }
    if (t === 1) { const r = ri(3, 7), b = ri(2, 6), N = r + b; return { q: R`Από κάλπη με $${r}$ κόκκινες και $${b}$ μπλε μπάλες παίρνουμε τυχαία $2$ χωρίς επανάθεση. Ποια είναι η πιθανότητα να είναι και οι δύο κόκκινες, και ποια να είναι διαφορετικού χρώματος;`,
      fields: [{ label: "P(2 κόκκινες) =", ans: fracS2(psaC(r, 2), psaC(N, 2)), tol: 0.001 }, { label: "P(διαφορετικά) =", ans: fracS2(r * b, psaC(N, 2)), tol: 0.001 }],
      hint: R`$|\Omega| = \binom{${N}}{2}$.`, sol: R`$|\Omega| = \binom{${N}}{2} = ${psaC(N, 2)}$. $P = \binom{${r}}{2}/${psaC(N, 2)} = ${texFrac(psaC(r, 2), psaC(N, 2))}$ και $P(\text{διαφορετικά}) = ${r}\cdot ${b}/${psaC(N, 2)} = ${texFrac(r * b, psaC(N, 2))}$.` }; }
    if (t === 2) { const W = bkPick([["ΑΝΑΝΑΣ", [3, 2, 1]], ["ΜΑΜΑ", [2, 2]], ["ΠΑΠΑΓΑΛΟΣ", [3, 2, 1, 1, 1, 1]], ["ΚΑΡΑΒΙ", [2, 1, 1, 1, 1]], ["ΣΤΑΤΙΣΤΙΚΗ", [2, 3, 1, 2, 1, 1]], ["ΘΑΛΑΣΣΑ", [1, 3, 1, 2]]]), n = W[1].reduce((p, v) => p + v, 0);
      const v = psaFact(n) / W[1].reduce((p, c) => p * psaFact(c), 1);
      return { q: R`Πόσες διαφορετικές «λέξεις» σχηματίζονται με όλα τα γράμματα της λέξης ${W[0]};`, fields: [{ label: "λέξεις =", ans: v }],
        hint: R`Μεταθέσεις με επαναλαμβανόμενα στοιχεία.`, sol: R`$\frac{${n}!}{${W[1].filter(c => c > 1).map(c => c + "!").join("\\,") || "1"}} = ${v}$.` }; }
    const d = ri(2, 3), fav = d === 2 ? 30 : 120, tot = 6 ** d;
    return { q: R`Ρίχνουμε ${d === 2 ? "δύο" : "τρία"} ζάρια. Ποια είναι η πιθανότητα όλες οι ενδείξεις να είναι διαφορετικές;`, fields: [{ label: "P =", ans: fracS2(fav, tot), tol: 0.001 }],
      hint: R`$|\Omega| = 6^${d}$.`, sol: R`Ευνοϊκά: $${d === 2 ? "6\\cdot 5" : "6\\cdot 5\\cdot 4"} = ${fav}$, άρα $P = ${fav}/${tot} = ${texFrac(fav, tot)}$.` };
  } },
  psaCond: { title: "Γεννήτρια — δεσμευμένη πιθανότητα και ανεξαρτησία", make() {
    const t = ri(0, 3);
    if (t === 0) { const b = ri(3, 8) * 10, ab = ri(1, b / 10 - 1) * 5; if (ab >= b) return GENS.psaCond.make(); const B = b / 100, AB = ab / 100;
      return { q: R`Αν $P(A \cap B) = ${psaD(AB)}$ και $P(B) = ${psaD(B)}$, να βρείτε τις $P(A \mid B)$ και $P(A^c \mid B)$.`,
        fields: [{ label: "P(A|B) =", ans: fracS2(ab, b), tol: 0.001 }, { label: "P(Aᶜ|B) =", ans: fracS2(b - ab, b), tol: 0.001 }],
        hint: R`Ορισμός της δεσμευμένης πιθανότητας.`, sol: R`$P(A \mid B) = \frac{${psaD(AB)}}{${psaD(B)}} = ${texFrac(ab, b)}$ και $P(A^c \mid B) = 1 - ${texFrac(ab, b)} = ${texFrac(b - ab, b)}$.` }; }
    if (t === 1) { const a = ri(1, 9) / 10, b = ri(1, 9) / 10, ab = a * b;
      return { q: R`Τα $A, B$ είναι ανεξάρτητα με $P(A) = ${psaD(a)}$ και $P(B) = ${psaD(b)}$. Να βρείτε τις $P(A \cap B)$ και $P(A \cup B)$.`,
        fields: [{ label: "P(A∩B) =", ans: +ab.toFixed(4) }, { label: "P(A∪B) =", ans: +(a + b - ab).toFixed(4) }],
        hint: R`$P(A \cap B) = P(A)P(B)$.`, sol: R`$P(A \cap B) = ${psaD(a)}\cdot ${psaD(b)} = ${psaD(ab)}$ και $P(A \cup B) = ${psaD(a + b)} - ${psaD(ab)} = ${psaD(a + b - ab)}$.` }; }
    if (t === 2) { const r = ri(3, 7), w = ri(3, 7), N = r + w;
      return { q: R`Κάλπη περιέχει $${r}$ κόκκινες και $${w}$ λευκές μπάλες. Παίρνουμε διαδοχικά $2$ χωρίς επανάθεση. Ποια είναι η πιθανότητα η πρώτη να είναι κόκκινη και η δεύτερη λευκή; Ποια η πιθανότητα να είναι ίδιου χρώματος;`,
        fields: [{ label: "P(Κ τότε Λ) =", ans: fracS2(r * w, N * (N - 1)), tol: 0.001 }, { label: "P(ίδιο χρώμα) =", ans: fracS2(r * (r - 1) + w * (w - 1), N * (N - 1)), tol: 0.001 }],
        hint: R`Πολλαπλασιαστικός κανόνας.`, sol: R`$P(K_1 \cap \Lambda_2) = \frac{${r}}{${N}}\cdot\frac{${w}}{${N - 1}} = ${texFrac(r * w, N * (N - 1))}$. $P(\text{ίδιο}) = \frac{${r}}{${N}}\cdot\frac{${r - 1}}{${N - 1}} + \frac{${w}}{${N}}\cdot\frac{${w - 1}}{${N - 1}} = ${texFrac(r * (r - 1) + w * (w - 1), N * (N - 1))}$.` }; }
    const p1 = ri(70, 98) / 100, p2 = ri(70, 98) / 100;
    return { q: R`Δύο εξαρτήματα λειτουργούν ανεξάρτητα με πιθανότητες $${psaD(p1)}$ και $${psaD(p2)}$. Ποια είναι η αξιοπιστία του συστήματος αν συνδεθούν σε σειρά, και ποια αν συνδεθούν παράλληλα;`,
      fields: [{ label: "σε σειρά =", ans: +(p1 * p2).toFixed(6) }, { label: "παράλληλα =", ans: +(1 - (1 - p1) * (1 - p2)).toFixed(6) }],
      hint: R`Σε σειρά: και τα δύο· παράλληλα: τουλάχιστον ένα.`, sol: R`Σε σειρά: $${psaD(p1)}\cdot ${psaD(p2)} = ${psaD(p1 * p2)}$. Παράλληλα: $1 - ${psaD(1 - p1)}\cdot ${psaD(1 - p2)} = ${psaD(1 - (1 - p1) * (1 - p2))}$.` };
  } },
  psaBayes: { title: "Γεννήτρια — ολική πιθανότητα και Bayes", make() {
    const t = ri(0, 1);
    if (t === 0) { const s1 = ri(3, 7) * 10, e1 = ri(1, 4), e2 = ri(2, 8); if (e1 === e2) return GENS.psaBayes.make(); const s2 = 100 - s1;
      const PE = (s1 * e1 + s2 * e2) / 10000, post = s2 * e2 / (s1 * e1 + s2 * e2);
      return { q: R`Η μηχανή $M_1$ παράγει το $${s1}\%$ των προϊόντων με ποσοστό ελαττωματικών $${e1}\%$, και η $M_2$ το $${s2}\%$ με ποσοστό $${e2}\%$. Να βρείτε την πιθανότητα ένα τυχαίο προϊόν να είναι ελαττωματικό και την πιθανότητα ένα ελαττωματικό προϊόν να προέρχεται από τη $M_2$. (4 δεκαδικά)`,
        fields: [{ label: "P(Ε) =", ans: PE, tol: 0.0005 }, { label: "P(M2|Ε) =", ans: post, tol: 0.001 }],
        hint: R`Ολική πιθανότητα και μετά Bayes.`, sol: R`$P(E) = ${psaD(s1 / 100)}\cdot ${psaD(e1 / 100)} + ${psaD(s2 / 100)}\cdot ${psaD(e2 / 100)} = ${psaD(PE)}$ και $P(M_2 \mid E) = \frac{${psaD(s2 * e2 / 10000)}}{${psaD(PE)}} = ${texFrac(s2 * e2, s1 * e1 + s2 * e2)} \approx ${psaD(post)}$.` }; }
    const pr = bkPick([1, 2, 5, 10]) / 100, se = ri(85, 99) / 100, sp = ri(85, 98) / 100, Pp = pr * se + (1 - pr) * (1 - sp), post = pr * se / Pp;
    return { q: R`Μια νόσος έχει επιπολασμό $${psaD(pr * 100)}\%$. Ένα τεστ έχει ευαισθησία $${Math.round(se * 100)}\%$ και ειδικότητα $${Math.round(sp * 100)}\%$. Να βρείτε την $P(+)$ και την $P(D \mid +)$. (3 δεκαδικά)`,
      fields: [{ label: "P(+) =", ans: Pp, tol: 0.001 }, { label: "P(D|+) =", ans: post, tol: 0.001 }],
      hint: R`$P(+ \mid D^c) = 1 - \text{ειδικότητα}$.`, sol: R`$P(+) = ${psaD(pr)}\cdot ${psaD(se)} + ${psaD(1 - pr)}\cdot ${psaD(1 - sp)} = ${psaD(Pp)}$ και $P(D \mid +) = ${psaD(pr * se)}/${psaD(Pp)} \approx ${psaD(post, 3)}$.` };
  } },
  psaRV: { title: "Γεννήτρια — μέση τιμή και διασπορά διακριτής τ.μ.", make() {
    const xs = bkPick([[0, 1, 2], [1, 2, 3], [0, 1, 2, 3], [-1, 0, 1, 2], [1, 2, 4]]), w = xs.map(() => ri(1, 5)), W = w.reduce((p, v) => p + v, 0);
    const S1 = xs.reduce((p, x, i) => p + x * w[i], 0), S2 = xs.reduce((p, x, i) => p + x * x * w[i], 0);
    const Vn = S2 * W - S1 * S1, Vd = W * W, t = ri(0, 1);
    const tab = R`\begin{array}{c|${"c".repeat(xs.length)}} x & ${xs.join(" & ")} \\ \hline p(x) & ${w.map(v => texFrac(v, W)).join(" & ")} \end{array}`;
    if (t === 0) return { q: R`Η τ.μ. $X$ έχει συνάρτηση μάζας πιθανότητας $\ ${tab}$. Να βρείτε τα $E(X)$ και $\mathrm{Var}(X)$ (ως κλάσματα).`,
      fields: [{ label: "E(X) =", ans: fracS2(S1, W), tol: 0.001 }, { label: "Var(X) =", ans: fracS2(Vn, Vd), tol: 0.001 }],
      hint: R`$\mathrm{Var}(X) = E(X^2) - E(X)^2$.`, sol: R`$E(X) = ${texFrac(S1, W)}$, $E(X^2) = ${texFrac(S2, W)}$, άρα $\mathrm{Var}(X) = ${texFrac(S2, W)} - \left(${texFrac(S1, W)}\right)^2 = ${texFrac(Vn, Vd)}$.` };
    const a = bkPick([2, 3, -2, 4]), b = gyNZ(-5, 5);
    return { q: R`Η τ.μ. $X$ έχει συνάρτηση μάζας πιθανότητας $\ ${tab}$. Αν $Y = ${a}X ${b < 0 ? "-" : "+"} ${Math.abs(b)}$, να βρείτε τα $E(Y)$ και $\mathrm{Var}(Y)$ (ως κλάσματα).`,
      fields: [{ label: "E(Y) =", ans: fracS2(a * S1 + b * W, W), tol: 0.001 }, { label: "Var(Y) =", ans: fracS2(a * a * Vn, Vd), tol: 0.001 }],
      hint: R`$E(aX + b) = aE(X) + b$, $\mathrm{Var}(aX + b) = a^2\mathrm{Var}(X)$.`, sol: R`$E(X) = ${texFrac(S1, W)}$, $\mathrm{Var}(X) = ${texFrac(Vn, Vd)}$. Άρα $E(Y) = ${a}\cdot ${texFrac(S1, W)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${texFrac(a * S1 + b * W, W)}$ και $\mathrm{Var}(Y) = ${a * a}\cdot ${texFrac(Vn, Vd)} = ${texFrac(a * a * Vn, Vd)}$.` };
  } },
  psaBin: { title: "Γεννήτρια — διωνυμική και γεωμετρική κατανομή", make() {
    const t = ri(0, 2);
    if (t === 0) { const n = ri(4, 10), p = bkPick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6]), k = ri(1, Math.min(n - 1, 4)), v = psaBinP(n, p, k);
      return { q: R`Αν $X \sim b(${n},\,${psaD(p)})$, να βρείτε την $P(X = ${k})$ (4 δεκαδικά) και τα $E(X)$, $\mathrm{Var}(X)$.`,
        fields: [{ label: `P(X = ${k}) =`, ans: v, tol: 0.0005 }, { label: "E(X) =", ans: +(n * p).toFixed(6) }, { label: "Var(X) =", ans: +(n * p * (1 - p)).toFixed(6) }],
        hint: R`$\binom{n}{k}p^k q^{n-k}$, $E = np$, $\mathrm{Var} = npq$.`, sol: R`$P(X = ${k}) = \binom{${n}}{${k}}(${psaD(p)})^{${k}}(${psaD(1 - p)})^{${n - k}} = ${psaC(n, k)}\cdot ${psaD(p ** k, 6)}\cdot ${psaD((1 - p) ** (n - k), 6)} \approx ${psaD(v)}$. $E(X) = ${psaD(n * p)}$, $\mathrm{Var}(X) = ${psaD(n * p * (1 - p))}$.` }; }
    if (t === 1) { const n = ri(4, 12), p = bkPick([0.1, 0.2, 0.3, 0.5]), v = 1 - (1 - p) ** n;
      return { q: R`Σε $${n}$ ανεξάρτητες δοκιμές με πιθανότητα επιτυχίας $${psaD(p)}$, ποια είναι η πιθανότητα τουλάχιστον μίας επιτυχίας; (4 δεκαδικά)`,
        fields: [{ label: "P(X ≥ 1) =", ans: v, tol: 0.0005 }], hint: R`Συμπλήρωμα: $1 - q^n$.`, sol: R`$P(X \ge 1) = 1 - (${psaD(1 - p)})^{${n}} \approx ${psaD(v)}$.` }; }
    const p = bkPick([0.1, 0.2, 0.25, 0.4, 0.5]), k = ri(2, 5), m = ri(2, 4), v = psaGeoP(p, k);
    return { q: R`Επαναλαμβάνουμε ανεξάρτητες δοκιμές με $p = ${psaD(p)}$ μέχρι την πρώτη επιτυχία ($X$ = αριθμός δοκιμών). Να βρείτε τα $P(X = ${k})$, $P(X > ${m})$ (4 δεκαδικά) και $E(X)$.`,
      fields: [{ label: `P(X = ${k}) =`, ans: v, tol: 0.0005 }, { label: `P(X > ${m}) =`, ans: (1 - p) ** m, tol: 0.0005 }, { label: "E(X) =", ans: 1 / p }],
      hint: R`$P(X = k) = q^{k-1}p$, $P(X > m) = q^m$, $E = 1/p$.`, sol: R`$P(X = ${k}) = ${psaPw(`(${psaD(1 - p)})`, k - 1)}\cdot ${psaD(p)} \approx ${psaD(v)}$, $P(X > ${m}) = (${psaD(1 - p)})^{${m}} \approx ${psaD((1 - p) ** m)}$, $E(X) = ${psaD(1 / p)}$.` };
  } },
  psaPois: { title: "Γεννήτρια — Poisson και υπεργεωμετρική", make() {
    const t = ri(0, 2);
    if (t === 0) { const l = bkPick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), k = ri(1, 4), v = psaPoiP(l, k), lt = Number.isInteger(l) ? psaD(l) : `(${psaD(l)})`;
      return { q: R`Αν $X \sim \text{Poisson}(${psaD(l)})$, να βρείτε την $P(X = ${k})$ και την $P(X \ge 1)$. (4 δεκαδικά)`,
        fields: [{ label: `P(X = ${k}) =`, ans: v, tol: 0.0005 }, { label: "P(X ≥ 1) =", ans: 1 - Math.exp(-l), tol: 0.0005 }],
        hint: R`$P(X = k) = e^{-\lambda}\lambda^k/k!$.`, sol: R`$P(X = ${k}) = e^{-${psaD(l)}}\frac{${(k === 1 ? psaD(l) : psaPw(lt, k))}}{${k}!} \approx ${psaD(v)}$ και $P(X \ge 1) = 1 - e^{-${psaD(l)}} \approx ${psaD(1 - Math.exp(-l))}$.` }; }
    if (t === 1) { const r = ri(2, 6), h = bkPick([[30, "μισή ώρα", 0.5], [15, "ένα τέταρτο", 0.25], [2, "δύο ώρες", 2], [3, "τρεις ώρες", 3]]), l = r * h[2]; if (l > 8 || l !== Math.round(l * 2) / 2) return GENS.psaPois.make();
      return { q: R`Σε μια υπηρεσία φτάνουν κατά μέσο όρο $${r}$ αιτήματα ανά ώρα, και ο αριθμός των αιτημάτων σε ένα χρονικό διάστημα ακολουθεί κατανομή Poisson με μέση τιμή ανάλογη της διάρκειάς του. Ποια είναι η παράμετρος $\lambda$ για ${h[1]}, και ποια η πιθανότητα να μη φτάσει κανένα αίτημα σε αυτό το διάστημα; (4 δεκαδικά)`,
        fields: [{ label: "λ =", ans: l }, { label: "P(X = 0) =", ans: Math.exp(-l), tol: 0.0005 }],
        hint: R`Το $\lambda$ είναι ανάλογο του χρόνου.`, sol: R`$\lambda = ${r}\cdot ${psaD(h[2])} = ${psaD(l)}$ και $P(X = 0) = e^{-${psaD(l)}} \approx ${psaD(Math.exp(-l))}$.` }; }
    const N = ri(10, 20), K = ri(3, 6), n = ri(3, 4), k = ri(0, Math.min(2, K)), num = psaC(K, k) * psaC(N - K, n - k), den = psaC(N, n);
    return { q: R`Παρτίδα $${N}$ προϊόντων περιέχει $${K}$ ελαττωματικά. Παίρνουμε τυχαία $${n}$ χωρίς επανάθεση. Ποια είναι η πιθανότητα να είναι ακριβώς $${k}$ ${k === 1 ? "ελαττωματικό" : "ελαττωματικά"} (κλάσμα), και ποιο το αναμενόμενο πλήθος ελαττωματικών;`,
      fields: [{ label: `P(X = ${k}) =`, ans: fracS2(num, den), tol: 0.001 }, { label: "E(X) =", ans: fracS2(n * K, N), tol: 0.001 }],
      hint: R`Υπεργεωμετρική: $\binom{K}{k}\binom{N-K}{n-k}/\binom{N}{n}$, $E = nK/N$.`, sol: R`$P(X = ${k}) = \frac{\binom{${K}}{${k}}\binom{${N - K}}{${n - k}}}{\binom{${N}}{${n}}} = \frac{${num}}{${den}} = ${texFrac(num, den)}$ και $E(X) = ${n}\cdot\frac{${K}}{${N}} = ${texFrac(n * K, N)}$.` };
  } },
  psaMult: { title: "Γεννήτρια — πολυωνυμικοί συντελεστές και σφαιρίδια σε δοχεία", make() {
    const t = ri(0, 3);
    if (t === 0) { const g = bkPick([[5, 3, 2], [4, 4, 2], [6, 2, 2], [3, 3, 3], [4, 3, 1], [5, 2, 1], [2, 2, 2, 2]]), n = g.reduce((a, b) => a + b, 0), v = psaFact(n) / g.reduce((a, c) => a * psaFact(c), 1);
      return { q: R`Μια ομάδα $${n}$ ατόμων χωρίζεται σε ${g.length} ομάδες εργασίας (με διαφορετικά καθήκοντα) μεγέθους $${g.join(",\\ ")}$ αντίστοιχα. Με πόσους τρόπους μπορεί να γίνει ο χωρισμός;`,
        fields: [{ label: "τρόποι =", ans: v }], hint: R`Πολυωνυμικός συντελεστής $\binom{n}{n_1, \dots, n_k}$.`,
        sol: R`$\binom{${n}}{${g.join(",\\,")}} = \frac{${n}!}{${g.map(c => c + "!").join("\\,")}} = ${v}$.` }; }
    if (t === 1) { const n = ri(4, 12), k = ri(3, 5), v = psaC(n + k - 1, k - 1);
      return { q: R`Πόσες μη αρνητικές ακέραιες λύσεις έχει η εξίσωση $${Array.from({ length: k }, (_, i) => "x_" + (i + 1)).join(" + ")} = ${n}$;`,
        fields: [{ label: "λύσεις =", ans: v }], hint: R`$n$ όμοια σφαιρίδια σε $k$ δοχεία: $\binom{n+k-1}{k-1}$.`,
        sol: R`$\binom{${n} + ${k} - 1}{${k} - 1} = \binom{${n + k - 1}}{${k - 1}} = ${v}$.` }; }
    if (t === 2) { const n = ri(6, 14), k = ri(3, 5); if (n < k + 1) return GENS.psaMult.make(); const v = psaC(n - 1, k - 1);
      return { q: R`Πόσες <b>θετικές</b> ακέραιες λύσεις έχει η εξίσωση $${Array.from({ length: k }, (_, i) => "x_" + (i + 1)).join(" + ")} = ${n}$;`,
        fields: [{ label: "λύσεις =", ans: v }], hint: R`Θέτουμε $y_i = x_i - 1 \ge 0$.`,
        sol: R`Με $y_i = x_i - 1$: $y_1 + \dots + y_{${k}} = ${n - k}$, άρα $\binom{${n - k} + ${k} - 1}{${k} - 1} = \binom{${n - 1}}{${k - 1}} = ${v}$.` }; }
    const n = ri(3, 6), k = ri(2, 4);
    return { q: R`Τοποθετούμε $${n}$ <b>διακεκριμένα</b> σφαιρίδια σε $${k}$ διακεκριμένα δοχεία (κάθε δοχείο χωράει οσαδήποτε). Πόσες είναι οι δυνατές τοποθετήσεις; Πόσες, αν τα σφαιρίδια είναι <b>όμοια</b>;`,
      fields: [{ label: "διακεκριμένα =", ans: k ** n }, { label: "όμοια =", ans: psaC(n + k - 1, k - 1) }], hint: R`Διακεκριμένα: κάθε σφαιρίδιο διαλέγει δοχείο. Όμοια: $\binom{n+k-1}{k-1}$.`,
      sol: R`Διακεκριμένα: $${k}^{${n}} = ${k ** n}$. Όμοια: $\binom{${n + k - 1}}{${k - 1}} = ${psaC(n + k - 1, k - 1)}$.` };
  } }
});

/* Πιθανότητες και Στατιστική (ΜΑΣ055) — widgets & γεννήτριες, Κεφ. 4–7 (πρόθεμα psb) */
const psbErf = x => { const s = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
const psbPhi = z => 0.5 * (1 + psbErf(z / Math.SQRT2));
const psbF = (x, d = 4) => Number(x.toFixed(d)).toLocaleString("el-GR", { maximumFractionDigits: d, useGrouping: false });   /* κείμενο */
const psbK = (x, d = 4) => psbF(x, d).replace(",", "{,}");                                                                    /* KaTeX */
const psbR = (x, d = 4) => Number(x.toFixed(d));
const psbTol = (ans, abs) => abs / Math.max(1, Math.abs(ans));                     /* απόλυτη ανοχή abs */
function psbArea(P, f, a, b, cls = "fill:var(--blue);fill-opacity:.25") {           /* σκίαση εμβαδού κάτω από f στο [a,b] */
  if (b <= a) return; const n = 120; let d = `M${P.sx(a)},${P.sy(0)}`;
  for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; d += `L${P.sx(x).toFixed(1)},${P.sy(f(x)).toFixed(1)}`; }
  d += `L${P.sx(b)},${P.sy(0)}Z`; P.layer.appendChild(svgEl("path", { d, style: cls }));
}
function psbVLine(P, x, y1, y2, st = "stroke:var(--ink);stroke-width:2;stroke-dasharray:5 4") { P.top.appendChild(svgEl("line", { x1: P.sx(x), x2: P.sx(x), y1: P.sy(y1), y2: P.sy(y2), style: st })); }
function psbTxt(P, x, y, s, st = "fill:var(--ink)", anchor = "middle") { const t = svgEl("text", { x: P.sx(x), y: P.sy(y), "text-anchor": anchor, style: st + ";font-weight:800;font-size:13px;font-family:var(--sans)" }); t.textContent = s; P.top.appendChild(t); }
const psbZ2 = { "0.1": 1.6449, "0.05": 1.96, "0.01": 2.5758 }, psbZ1 = { "0.1": 1.2816, "0.05": 1.6449, "0.01": 2.3263 };
const PSB_SN = [[4, 16], [5, 25], [6, 36], [8, 16], [10, 25], [12, 36], [5, 100], [10, 16], [12, 64], [14, 49]];   /* σ/√n ∈ {1; 2; 0,5; 2,5; 1,5} */
const psbMean = a => a.reduce((s, v) => s + v, 0) / a.length;
function psbGauss() { let u = 0, v = 0; while (u === 0) u = Math.random(); while (v === 0) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 4.1 συνάρτηση πυκνότητας ---------- */
  psbpdf(box) {
    const D = [
      { n: "f(x) = x/2,  0 ≤ x ≤ 2", lo: 0, hi: 2, f: x => x / 2, F: x => x * x / 4, E: 4 / 3, V: 2 / 9, med: Math.SQRT2 },
      { n: "f(x) = 3x²/8,  0 ≤ x ≤ 2", lo: 0, hi: 2, f: x => 3 * x * x / 8, F: x => x ** 3 / 8, E: 1.5, V: 0.15, med: Math.cbrt(4) },
      { n: "f(x) = ¾(1 − x²),  −1 ≤ x ≤ 1", lo: -1, hi: 1, f: x => 0.75 * (1 - x * x), F: x => 0.75 * (x - x ** 3 / 3) + 0.5, E: 0, V: 0.2, med: 0 }];
    box.innerHTML = `<div class="wctl"><label>πυκνότητα <select class="sd">${D.map((d, i) => `<option value="${i}">${d.n}</option>`).join("")}</select></label></div>
      <div class="wctl"><label>a <input type="range" class="ra" min="0" max="100" value="25"><b class="va"></b></label><label>b <input type="range" class="rb" min="0" max="100" value="75"><b class="vb"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const d = D[+$(".sd", box).value], L = d.hi - d.lo; let a = d.lo + L * $(".ra", box).value / 100, b = d.lo + L * $(".rb", box).value / 100; if (a > b) [a, b] = [b, a];
      $(".va", box).textContent = psbF(a, 2); $(".vb", box).textContent = psbF(b, 2);
      const f = x => (x < d.lo || x > d.hi) ? 0 : d.f(x), ymax = Math.max(d.f(d.lo), d.f(d.hi), d.f((d.lo + d.hi) / 2)) * 1.25;
      const P = makePlot($(".pl", box), { xmin: d.lo - 0.5, xmax: d.hi + 0.5, ymin: -ymax * 0.12, ymax, H: 260, xstep: 0.5, ystep: niceStep(ymax * 3) });
      psbArea(P, f, a, b); P.curve(f, "c1"); psbVLine(P, d.E, 0, ymax * 0.95, "stroke:var(--amber);stroke-width:2;stroke-dasharray:5 4"); psbTxt(P, d.E, ymax * 0.97, "E(X)", "fill:var(--amber)");
      const p = d.F(b) - d.F(a);
      $(".wout", box).innerHTML = `<b>P(${psbF(a, 2)} ≤ X ≤ ${psbF(b, 2)}) = F(b) − F(a) = ${psbF(p)}</b> (το σκιασμένο εμβαδόν)<br>E(X) = ${psbF(d.E)} · Var(X) = ${psbF(d.V)} · διάμεσος m = ${psbF(d.med)} (F(m) = 0,5)
        <br><span class="muted">Το συνολικό εμβαδόν κάτω από την f είναι 1· η f(x) <b>δεν</b> είναι πιθανότητα — μπορεί να είναι και μεγαλύτερη του 1.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 4.2 ομοιόμορφη – εκθετική ---------- */
  psbue(box) {
    box.innerHTML = `<div class="wctl"><label>κατανομή <select class="sd"><option value="0">Ομοιόμορφη U(α, β)</option><option value="1">Εκθετική 𝓔(λ)</option></select></label></div>
      <div class="wctl"><label class="lp1">α <input type="range" class="r1" min="0" max="5" step="0.5" value="1"><b class="v1"></b></label><label class="lp2">β <input type="range" class="r2" min="1" max="10" step="0.5" value="6"><b class="v2"></b></label>
      <label>t <input type="range" class="rt" min="0" max="10" step="0.1" value="3"><b class="vt"></b></label><label>s <input type="range" class="rs" min="0" max="5" step="0.5" value="2"><b class="vs"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const e = +$(".sd", box).value === 1, t = +$(".rt", box).value, s = +$(".rs", box).value;
      $(".lp1", box).firstChild.textContent = e ? "λ " : "α "; $(".lp2", box).style.display = e ? "none" : "";
      const r1 = $(".r1", box); if (e) { r1.min = 0.2; r1.max = 3; r1.step = 0.1; } else { r1.min = 0; r1.max = 5; r1.step = 0.5; }
      let p1 = +r1.value, p2 = +$(".r2", box).value; if (!e && p2 <= p1) p2 = p1 + 0.5;
      $(".v1", box).textContent = psbF(p1, 1); $(".v2", box).textContent = psbF(p2, 1); $(".vt", box).textContent = psbF(t, 1); $(".vs", box).textContent = psbF(s, 1);
      const f = e ? (x => x < 0 ? 0 : p1 * Math.exp(-p1 * x)) : (x => (x >= p1 && x <= p2) ? 1 / (p2 - p1) : 0);
      const F = e ? (x => x < 0 ? 0 : 1 - Math.exp(-p1 * x)) : (x => x <= p1 ? 0 : x >= p2 ? 1 : (x - p1) / (p2 - p1));
      const ymax = (e ? p1 : 1 / (p2 - p1)) * 1.25;
      const P = makePlot($(".pl", box), { xmin: -0.5, xmax: 10.5, ymin: -ymax * 0.12, ymax, H: 250, xstep: 1, ystep: niceStep(ymax * 3) });
      psbArea(P, f, e ? 0 : Math.min(p1, t), Math.max(e ? 0 : p1, t)); P.curve(f, "c1"); psbVLine(P, t, 0, ymax * 0.9); psbTxt(P, t, ymax * 0.93, "t");
      const E = e ? 1 / p1 : (p1 + p2) / 2, V = e ? 1 / (p1 * p1) : (p2 - p1) ** 2 / 12;
      let mem = "";
      if (e) { const lhs = (1 - F(s + t)) / (1 - F(s)); mem = `<br><b>Αμνήμονη ιδιότητα:</b> P(X &gt; s + t | X &gt; s) = ${psbF(lhs)} = P(X &gt; t) = e<sup>−λt</sup> = ${psbF(1 - F(t))}`; }
      $(".wout", box).innerHTML = `<b>F(t) = P(X ≤ ${psbF(t, 1)}) = ${psbF(F(t))}</b> (σκιασμένο εμβαδόν) · P(X &gt; t) = ${psbF(1 - F(t))}<br>E(X) = ${psbF(E)} · Var(X) = ${psbF(V)}${mem}`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 4.3 κανονική κατανομή ---------- */
  psbnorm(box) {
    box.innerHTML = `<div class="wctl"><label>μ <input type="range" class="rm" min="-3" max="3" step="0.5" value="0"><b class="vm"></b></label><label>σ <input type="range" class="rs" min="0.5" max="2.5" step="0.1" value="1"><b class="vs"></b></label></div>
      <div class="wctl"><label>a <input type="range" class="ra" min="-8" max="8" step="0.1" value="-1"><b class="va"></b></label><label>b <input type="range" class="rb" min="-8" max="8" step="0.1" value="1"><b class="vb"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const m = +$(".rm", box).value, s = +$(".rs", box).value; let a = +$(".ra", box).value, b = +$(".rb", box).value; if (a > b) [a, b] = [b, a];
      ["m", "s", "a", "b"].forEach((c, i) => $(".v" + c, box).textContent = psbF([m, s, a, b][i], 1));
      const f = x => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI)), ymax = 0.9;
      const P = makePlot($(".pl", box), { xmin: -8, xmax: 8, ymin: -0.07, ymax, H: 250, xstep: 1, ystep: 0.2 });
      psbArea(P, f, a, b); P.curve(f, "c1"); psbVLine(P, m, 0, f(m), "stroke:var(--amber);stroke-width:2;stroke-dasharray:5 4"); psbTxt(P, m + 0.25, f(m) + 0.03, "μ", "fill:var(--amber)", "start");
      const za = (a - m) / s, zb = (b - m) / s, p = psbPhi(zb) - psbPhi(za);
      $(".wout", box).innerHTML = `Τυποποίηση: z<sub>a</sub> = (a − μ)/σ = ${psbF(za, 2)}, z<sub>b</sub> = ${psbF(zb, 2)}<br><b>P(${psbF(a, 1)} &lt; X &lt; ${psbF(b, 1)}) = Φ(${psbF(zb, 2)}) − Φ(${psbF(za, 2)}) = ${psbF(p)}</b>
        <br><span class="muted">Όσο μεγαλώνει το σ, η καμπύλη απλώνει και χαμηλώνει (το εμβαδόν μένει 1). Κανόνας 68–95–99,7: μ ± σ, μ ± 2σ, μ ± 3σ.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 5.1 από κοινού κατανομή ---------- */
  psbjoint(box) {
    const T = [["Εξαρτημένες, Cov > 0", [[0.1, 0.2, 0.1], [0.2, 0.1, 0.3]]], ["Ανεξάρτητες", [[0.12, 0.12, 0.16], [0.18, 0.18, 0.24]]], ["Cov = 0 αλλά εξαρτημένες", [[0.1, 0.2, 0.1], [0.1, 0, 0.1], [0.1, 0.2, 0.1]]], ["Ισχυρά αρνητικά συσχετισμένες", [[0, 0.05, 0.3], [0.05, 0.2, 0.05], [0.3, 0.05, 0]]]];
    box.innerHTML = `<div class="wctl"><label>πίνακας <select class="sd">${T.map((t, i) => `<option value="${i}">${t[0]}</option>`).join("")}</select></label></div><div class="pl" style="overflow-x:auto"></div><div class="wout"></div>`;
    function draw() {
      const M = T[+$(".sd", box).value][1], xs = M.map((_, i) => i), ys = M[0].map((_, j) => j);
      const px = M.map(r => r.reduce((a, b) => a + b, 0)), py = ys.map(j => M.reduce((a, r) => a + r[j], 0));
      const EX = xs.reduce((a, x) => a + x * px[x], 0), EY = ys.reduce((a, y) => a + y * py[y], 0), EXY = xs.reduce((a, x) => a + ys.reduce((b, y) => b + x * y * M[x][y], 0), 0);
      const VX = xs.reduce((a, x) => a + x * x * px[x], 0) - EX * EX, VY = ys.reduce((a, y) => a + y * y * py[y], 0) - EY * EY, C = EXY - EX * EY, rho = C / Math.sqrt(VX * VY);
      const indep = xs.every(x => ys.every(y => Math.abs(M[x][y] - px[x] * py[y]) < 1e-9));
      const td = "padding:5px 10px;border:1px solid var(--line);text-align:center";
      $(".pl", box).innerHTML = `<table style="border-collapse:collapse;font-size:14px;margin:4px 0"><tr><th style="${td}">X \\ Y</th>${ys.map(y => `<th style="${td}">${y}</th>`).join("")}<th style="${td};background:var(--soft)">p<sub>X</sub>(x)</th></tr>
        ${xs.map(x => `<tr><th style="${td}">${x}</th>${ys.map(y => `<td style="${td};${Math.abs(M[x][y] - px[x] * py[y]) > 1e-9 ? "color:var(--red,#C2410C)" : ""}">${psbF(M[x][y], 2)}</td>`).join("")}<td style="${td};background:var(--soft)"><b>${psbF(px[x], 2)}</b></td></tr>`).join("")}
        <tr><th style="${td};background:var(--soft)">p<sub>Y</sub>(y)</th>${py.map(v => `<td style="${td};background:var(--soft)"><b>${psbF(v, 2)}</b></td>`).join("")}<td style="${td}">1</td></tr></table>`;
      $(".wout", box).innerHTML = `E(X) = ${psbF(EX)} · E(Y) = ${psbF(EY)} · E(XY) = ${psbF(EXY)}<br><b>Cov(X, Y) = E(XY) − E(X)E(Y) = ${psbF(C)}</b> · Var(X) = ${psbF(VX)} · Var(Y) = ${psbF(VY)}
        <br>ρ = ${psbF(rho)} · Var(X + Y) = Var(X) + Var(Y) + 2Cov = ${psbF(VX + VY + 2 * C)}
        <br>${indep ? "<b>Ανεξάρτητες:</b> p(x, y) = p<sub>X</sub>(x)·p<sub>Y</sub>(y) σε κάθε κελί." : "<b>Εξαρτημένες:</b> τα κελιά με κόκκινο δεν ικανοποιούν p(x, y) = p<sub>X</sub>(x)·p<sub>Y</sub>(y)."}${!indep && Math.abs(C) < 1e-9 ? " Παρατήρησε ότι Cov = 0 χωρίς ανεξαρτησία." : ""}`;
    }
    $(".sd", box).oninput = draw; draw();
  },

  /* ---------- 6.1 ΚΟΘ ---------- */
  psbclt(box) {
    const POP = [["Εκθετική, μ = 1, σ = 1", () => -Math.log(1 - Math.random()), 1, 1], ["Ομοιόμορφη U(0, 1)", () => Math.random(), 0.5, Math.sqrt(1 / 12)], ["Ζάρι", () => ri(1, 6), 3.5, Math.sqrt(35 / 12)], ["Bernoulli p = 0,2", () => Math.random() < 0.2 ? 1 : 0, 0.2, 0.4]];
    box.innerHTML = `<div class="wctl"><label>πληθυσμός <select class="sd">${POP.map((p, i) => `<option value="${i}">${p[0]}</option>`).join("")}</select></label><label>n <input type="range" class="rn" min="1" max="50" value="5"><b class="vn"></b></label><button class="btn ghost bg" type="button">Νέα 2000 δείγματα</button></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const [nm, g, mu, sg] = POP[+$(".sd", box).value], n = +$(".rn", box).value; $(".vn", box).textContent = n;
      const K = 2000, means = []; for (let k = 0; k < K; k++) { let s = 0; for (let i = 0; i < n; i++) s += g(); means.push(s / n); }
      const se = sg / Math.sqrt(n), xmin = Math.min(...means, mu - 4 * se), xmax = Math.max(...means, mu + 4 * se);
      const B = 30, w = (xmax - xmin) / B, h = Array(B).fill(0); means.forEach(v => h[Math.min(B - 1, Math.floor((v - xmin) / w))]++);
      const dens = h.map(c => c / (K * w)), nd = x => Math.exp(-((x - mu) ** 2) / (2 * se * se)) / (se * Math.sqrt(2 * Math.PI)), ymax = Math.max(...dens, nd(mu)) * 1.15;
      const P = makePlot($(".pl", box), { xmin: xmin - w, xmax: xmax + w, ymin: -ymax * 0.1, ymax, H: 250, xstep: niceStep(xmax - xmin + 2 * w), ystep: niceStep(ymax) });
      dens.forEach((d, i) => P.layer.appendChild(svgEl("rect", { x: P.sx(xmin + i * w), y: P.sy(d), width: Math.max(0, P.sx(xmin + (i + 1) * w) - P.sx(xmin + i * w) - 1), height: P.sy(0) - P.sy(d), style: "fill:var(--blue);fill-opacity:.35" })));
      P.curve(nd, "c2");
      const m = psbMean(means), sd = Math.sqrt(psbMean(means.map(v => (v - m) ** 2)));
      $(".wout", box).innerHTML = `Ιστόγραμμα 2000 δειγματικών μέσων X̄ μεγέθους n = ${n}· καμπύλη: N(μ, σ²/n).<br>Θεωρητικά E(X̄) = ${psbF(mu)}, σ/√n = ${psbF(se)} · από την προσομοίωση: ${psbF(m)}, ${psbF(sd)}
        <br><span class="muted">Όσο αυξάνει το n, η κατανομή του X̄ πλησιάζει την κανονική — ακόμη και όταν ο πληθυσμός είναι ασύμμετρος ή διακριτός.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); $(".bg", box).onclick = draw; draw();
  },

  /* ---------- 7.1 διαστήματα εμπιστοσύνης ---------- */
  psbci(box) {
    box.innerHTML = `<div class="wctl"><label>n <input type="range" class="rn" min="4" max="100" value="25"><b class="vn"></b></label><label>επίπεδο <select class="sl"><option value="0.1">90%</option><option value="0.05" selected>95%</option><option value="0.01">99%</option></select></label><button class="btn ghost bg" type="button">Νέα προσομοίωση</button></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const n = +$(".rn", box).value, al = $(".sl", box).value, z = psbZ2[al], mu = 50, sg = 10, me = z * sg / Math.sqrt(n); $(".vn", box).textContent = n;
      const svg = gyCanvas(box, 560, 300), sx = x => 280 + (x - mu) * 12; let miss = 0;
      gyAdd(svg, "line", { x1: sx(mu), x2: sx(mu), y1: 6, y2: 286, style: "stroke:var(--amber);stroke-width:2" });
      gyAdd(svg, "text", { x: sx(mu) + 6, y: 296, style: gyTS + ";font-size:12px;fill:var(--amber)" }, "μ = 50");
      for (let k = 0; k < 100; k++) {
        let s = 0; for (let i = 0; i < n; i++) s += mu + sg * psbGauss(); const xb = s / n, ok = Math.abs(xb - mu) <= me; if (!ok) miss++;
        const y = 8 + k * 2.75; gyAdd(svg, "line", { x1: Math.max(4, sx(xb - me)), x2: Math.min(556, sx(xb + me)), y1: y, y2: y, style: `stroke:${ok ? "var(--blue)" : "#C2410C"};stroke-width:${ok ? 1.6 : 2.4}` });
      }
      $(".wout", box).innerHTML = `100 διαστήματα x̄ ± z·σ/√n (σ = 10 γνωστό, z = ${psbF(z)}), μήκος 2·${psbF(me, 2)} = ${psbF(2 * me, 2)}.<br><b>${100 - miss} από τα 100 περιέχουν το μ</b> (θεωρητικά περίπου ${100 - 100 * al}%). Τα κόκκινα «αστοχούν».
        <br><span class="muted">Το επίπεδο εμπιστοσύνης αφορά τη μέθοδο: κάθε συγκεκριμένο διάστημα είτε περιέχει το μ είτε όχι. Μεγαλύτερο n → στενότερα διαστήματα· μεγαλύτερο επίπεδο → φαρδύτερα.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); $(".bg", box).onclick = draw; draw();
  },

  /* ---------- 7.2 έλεγχος υποθέσεων ---------- */
  psbtest(box) {
    box.innerHTML = `<div class="wctl"><label>H₁ <select class="sh"><option value="2">μ ≠ μ₀ (αμφίπλευρος)</option><option value="1">μ &gt; μ₀ (δεξιόπλευρος)</option><option value="-1">μ &lt; μ₀ (αριστερόπλευρος)</option></select></label><label>α <select class="sa"><option value="0.1">0,10</option><option value="0.05" selected>0,05</option><option value="0.01">0,01</option></select></label></div>
      <div class="wctl"><label>παρατηρούμενο z <input type="range" class="rz" min="-4" max="4" step="0.05" value="1.8"><b class="vz"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const H = +$(".sh", box).value, al = $(".sa", box).value, z = +$(".rz", box).value; $(".vz", box).textContent = psbF(z, 2);
      const f = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI), c = H === 2 ? psbZ2[al] : psbZ1[al];
      const P = makePlot($(".pl", box), { xmin: -4.2, xmax: 4.2, ymin: -0.05, ymax: 0.48, H: 240, xstep: 1, ystep: 0.1 });
      const red = "fill:#C2410C;fill-opacity:.35", blue = "fill:var(--blue);fill-opacity:.35";
      if (H !== -1) psbArea(P, f, c, 4.2, red); if (H !== 1) psbArea(P, f, -4.2, -c, red);
      let p;
      if (H === 2) { p = 2 * (1 - psbPhi(Math.abs(z))); psbArea(P, f, Math.abs(z), 4.2, blue); psbArea(P, f, -4.2, -Math.abs(z), blue); }
      else if (H === 1) { p = 1 - psbPhi(z); psbArea(P, f, z, 4.2, blue); } else { p = psbPhi(z); psbArea(P, f, -4.2, z, blue); }
      P.curve(f, "c1"); psbVLine(P, z, 0, 0.44, "stroke:var(--navy);stroke-width:2.5"); psbTxt(P, z, 0.455, "z", "fill:var(--navy)");
      const rej = p <= +al;
      $(".wout", box).innerHTML = `Κρίσιμη τιμή: ${H === 2 ? "±" : H === -1 ? "−" : ""}${psbF(c)} (κόκκινη περιοχή απόρριψης, εμβαδόν α = ${psbF(+al, 2)}).<br><b>p-τιμή = ${psbF(p)}</b> (μπλε εμβαδόν) ⇒ ${rej ? "<b>απορρίπτουμε την H₀</b> (p ≤ α)" : "<b>δεν απορρίπτουμε την H₀</b> (p &gt; α)"}
        <br><span class="muted">Η p-τιμή είναι η πιθανότητα, αν ισχύει η H₀, να παρατηρήσουμε τιμή τόσο ή πιο ακραία από αυτή που βρήκαμε.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 7.3 παλινδρόμηση ---------- */
  psbreg(box) {
    const DS = [["Ώρες μελέτης – βαθμός", [1, 2, 3, 4, 5, 6, 7, 8], [52, 55, 61, 60, 68, 70, 75, 79]], ["Θερμοκρασία – πωλήσεις παγωτού", [18, 20, 22, 25, 27, 30, 32, 34], [20, 26, 25, 34, 37, 45, 44, 52]], ["Ηλικία αυτοκινήτου – τιμή (χιλ. €)", [1, 2, 3, 4, 5, 6, 7, 8], [19, 17, 16, 13, 12, 9, 9, 7]]];
    box.innerHTML = `<div class="wctl"><label>δεδομένα <select class="sd">${DS.map((d, i) => `<option value="${i}">${d[0]}</option>`).join("")}</select></label><label><input type="checkbox" class="cr" checked> υπόλοιπα</label></div>
      <div class="wctl"><label>μετακίνησε το y του τελευταίου σημείου <input type="range" class="ry" min="-30" max="30" value="0"><b class="vy"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const [nm, X, Y0] = DS[+$(".sd", box).value], dy = +$(".ry", box).value, Y = Y0.slice(); Y[Y.length - 1] += dy; $(".vy", box).textContent = (dy > 0 ? "+" : "") + dy;
      const xb = psbMean(X), yb = psbMean(Y), Sxx = X.reduce((a, x) => a + (x - xb) ** 2, 0), Syy = Y.reduce((a, y) => a + (y - yb) ** 2, 0), Sxy = X.reduce((a, x, i) => a + (x - xb) * (Y[i] - yb), 0);
      const b = Sxy / Sxx, a = yb - b * xb, r = Sxy / Math.sqrt(Sxx * Syy);
      const x0 = Math.min(...X), x1 = Math.max(...X), y0 = Math.min(...Y, a + b * x0, a + b * x1), y1 = Math.max(...Y, a + b * x0, a + b * x1), px = (x1 - x0) * 0.12, py = (y1 - y0) * 0.15 + 1;
      const P = makePlot($(".pl", box), { xmin: x0 - px, xmax: x1 + px, ymin: y0 - py, ymax: y1 + py, H: 260, xstep: niceStep(x1 - x0 + 2 * px), ystep: niceStep(y1 - y0 + 2 * py) });
      P.curve(x => a + b * x, "c1");
      if ($(".cr", box).checked) X.forEach((x, i) => P.seg(x, Y[i], x, a + b * x, "asym"));
      X.forEach((x, i) => P.dot(x, Y[i], i === X.length - 1 ? "d2" : "d1")); P.dot(xb, yb, "d3", "(x̄, ȳ)");
      $(".wout", box).innerHTML = `${nm}: x̄ = ${psbF(xb, 3)}, ȳ = ${psbF(yb, 3)}, S<sub>xx</sub> = ${psbF(Sxx, 3)}, S<sub>xy</sub> = ${psbF(Sxy, 3)}<br><b>ŷ = ${psbF(a, 3)} ${b < 0 ? "−" : "+"} ${psbF(Math.abs(b), 3)}x</b> · r = ${psbF(r)} · R² = ${psbF(r * r)}
        <br><span class="muted">Η ευθεία ελαχίστων τετραγώνων ελαχιστοποιεί το άθροισμα των τετραγώνων των υπολοίπων (κατακόρυφα τμήματα) και διέρχεται πάντα από το (x̄, ȳ). Ένα ακραίο σημείο αλλάζει αισθητά τα b, r.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  psbcont: { title: "Γεννήτρια — συνεχής τυχαία μεταβλητή f(x) = cxⁿ", make() {
    const n = ri(1, 3), b = ri(2, 4), t = ri(1, b - 1), k = ri(0, 2);
    const fx = n === 1 ? "x" : `x^${n}`, cN = n + 1, cD = b ** (n + 1);
    if (k === 0) return { q: R`Η συνεχής τυχαία μεταβλητή $X$ έχει συνάρτηση πυκνότητας $f(x) = c\,${fx}$ για $0 \le x \le ${b}$ (και $0$ αλλού). Να βρείτε τη σταθερά $c$.`,
      fields: [{ label: "c =", ans: gyF(cN, cD), tol: 0.001 }], hint: R`$\int_0^{${b}} f(x)\,dx = 1$.`,
      sol: R`$\int_0^{${b}} c\,${fx}\,dx = c\,\frac{${b}^{${n + 1}}}{${n + 1}} = c\cdot ${texFrac(cD, cN)} = 1 \Rightarrow c = ${texFrac(cN, cD)}$.` };
    if (k === 1) return { q: R`Η $X$ έχει πυκνότητα $f(x) = ${texFrac(cN, cD)}\,${fx}$, $0 \le x \le ${b}$. Να υπολογίσετε την $P(X \le ${t})$.`,
      fields: [{ label: "P =", ans: gyF(t ** (n + 1), cD), tol: 0.001 }], hint: R`$F(x) = \left(\frac{x}{${b}}\right)^{${n + 1}}$ για $0 \le x \le ${b}$.`,
      sol: R`$P(X \le ${t}) = \int_0^{${t}} ${texFrac(cN, cD)}\,${fx}\,dx = \frac{${t}^{${n + 1}}}{${b}^{${n + 1}}} = ${texFrac(t ** (n + 1), cD)}$.` };
    return { q: R`Η $X$ έχει πυκνότητα $f(x) = ${texFrac(cN, cD)}\,${fx}$, $0 \le x \le ${b}$. Να βρείτε τη μέση τιμή $E(X)$.`,
      fields: [{ label: "E(X) =", ans: gyF((n + 1) * b, n + 2), tol: 0.001 }], hint: R`$E(X) = \int x f(x)\,dx$.`,
      sol: R`$E(X) = \int_0^{${b}} ${texFrac(cN, cD)}\,x^{${n + 1}}\,dx = ${texFrac(cN, cD)}\cdot\frac{${b}^{${n + 2}}}{${n + 2}} = ${texFrac((n + 1) * b, n + 2)}$.` };
  } },
  psbue: { title: "Γεννήτρια — ομοιόμορφη και εκθετική κατανομή", make() {
    const k = ri(0, 2);
    if (k === 0) { const a = ri(0, 5), L = bkPick([4, 5, 6, 8, 10, 12]), b = a + L, c = a + ri(1, L - 2), d = ri(c + 1, b);
      return { q: R`Αν $X \sim U(${a}, ${b})$, να υπολογίσετε την $P(${c} < X < ${d})$ και τη μέση τιμή $E(X)$.`,
        fields: [{ label: "P =", ans: gyF(d - c, L), tol: 0.001 }, { label: "E(X) =", ans: gyF(a + b, 2), tol: 0.001 }], hint: R`$f(x) = \frac{1}{${L}}$ στο $[${a}, ${b}]$.`,
        sol: R`$P(${c} < X < ${d}) = \frac{${d} - ${c}}{${L}} = ${texFrac(d - c, L)}$, $\ E(X) = \frac{${a} + ${b}}{2} = ${texFrac(a + b, 2)}$.` }; }
    const m = bkPick([2, 4, 5, 8, 10]), t = ri(1, 2 * m), lam = 1 / m, p = Math.exp(-t / m);
    if (k === 1) return { q: R`Ο χρόνος ζωής $X$ (σε έτη) μιας συσκευής ακολουθεί εκθετική κατανομή με μέση τιμή $${m}$ έτη. Να υπολογίσετε την $P(X > ${t})$ (4 δεκαδικά).`,
      fields: [{ label: "P =", ans: psbR(p), tol: 0.0006 }], hint: R`$\lambda = 1/${m}$ και $P(X > t) = e^{-\lambda t}$.`,
      sol: R`$\lambda = \frac{1}{${m}}$, $\ P(X > ${t}) = e^{-${texFrac(t, m)}} \approx ${psbK(p)}$.` };
    const s = ri(1, 5);
    return { q: R`Αν $X \sim \mathcal E(\lambda)$ με $E(X) = ${m}$, να υπολογίσετε την $P(X > ${s + t} \mid X > ${s})$ (4 δεκαδικά).`,
      fields: [{ label: "P =", ans: psbR(p), tol: 0.0006 }], hint: R`Αμνήμονη ιδιότητα.`,
      sol: R`$P(X > ${s + t} \mid X > ${s}) = \frac{e^{-${texFrac(s + t, m)}}}{e^{-${texFrac(s, m)}}} = e^{-${texFrac(t, m)}} = P(X > ${t}) \approx ${psbK(p)}$.` };
  } },
  psbnorm: { title: "Γεννήτρια — κανονική κατανομή", make() {
    const mu = bkPick([50, 60, 70, 100, 170, 500]), s = bkPick([2, 4, 5, 8, 10, 12, 15]), z = ri(5, 25) / 10, sg = bkPick([1, -1]), x = mu + sg * z * s, k = ri(0, 2);
    const Pz = psbR(psbPhi(z)), xs = psbK(x, 1);
    if (k === 0) { const ans = sg > 0 ? Pz : psbR(1 - Pz);
      return { q: R`Αν $X \sim N(${mu}, ${s}^2)$, να υπολογίσετε την $P(X < ${xs})$. Δίνεται $\Phi(${psbK(z, 1)}) = ${psbK(Pz)}$.`,
        fields: [{ label: "P =", ans, tol: 0.0006 }], hint: R`$z = \frac{x - \mu}{\sigma}$${sg < 0 ? R` και $\Phi(-z) = 1 - \Phi(z)$` : ""}.`,
        sol: R`$z = \frac{${xs} - ${mu}}{${s}} = ${psbK(sg * z, 1)}$, άρα $P(X < ${xs}) = \Phi(${psbK(sg * z, 1)}) = ${sg > 0 ? psbK(Pz) : R`1 - ${psbK(Pz)} = ${psbK(1 - Pz)}`}$.` }; }
    if (k === 1) { const ans = sg > 0 ? psbR(1 - Pz) : Pz;
      return { q: R`Αν $X \sim N(${mu}, ${s}^2)$, να υπολογίσετε την $P(X > ${xs})$. Δίνεται $\Phi(${psbK(z, 1)}) = ${psbK(Pz)}$.`,
        fields: [{ label: "P =", ans, tol: 0.0006 }], hint: R`$P(X > x) = 1 - \Phi(z)$.`,
        sol: R`$z = ${psbK(sg * z, 1)}$, $\ P(X > ${xs}) = 1 - \Phi(${psbK(sg * z, 1)}) = ${sg > 0 ? R`1 - ${psbK(Pz)} = ${psbK(1 - Pz)}` : psbK(Pz)}$.` }; }
    const ans = psbR(2 * Pz - 1);
    return { q: R`Αν $X \sim N(${mu}, ${s}^2)$, να υπολογίσετε την $P(${psbK(mu - z * s, 1)} < X < ${psbK(mu + z * s, 1)})$. Δίνεται $\Phi(${psbK(z, 1)}) = ${psbK(Pz)}$.`,
      fields: [{ label: "P =", ans, tol: 0.0006 }], hint: R`Συμμετρικό διάστημα γύρω από το $\mu$: $2\Phi(z) - 1$.`,
      sol: R`$z = \pm ${psbK(z, 1)}$, $\ P = \Phi(${psbK(z, 1)}) - \Phi(-${psbK(z, 1)}) = 2\cdot ${psbK(Pz)} - 1 = ${psbK(2 * Pz - 1)}$.` };
  } },
  psbjoint: { title: "Γεννήτρια — από κοινού κατανομή", make() {
    let M; do { const w = Array.from({ length: 6 }, () => ri(0, 6)); const S = w.reduce((a, b) => a + b, 0); if (S !== 20) continue; M = [w.slice(0, 3).map(v => v / 20), w.slice(3).map(v => v / 20)]; } while (!M);
    const px1 = M[1].reduce((a, b) => a + b, 0), py = [0, 1, 2].map(j => M[0][j] + M[1][j]), EX = px1, EY = py[1] + 2 * py[2], EXY = M[1][1] + 2 * M[1][2], C = EXY - EX * EY;
    if (Math.abs(C) < 1e-9 || px1 === 0 || px1 === 1) return GENS.psbjoint.make();
    const cell = v => psbK(v, 2), tab = R`\begin{array}{c|ccc} X\backslash Y & 0 & 1 & 2 \\ \hline 0 & ${M[0].map(cell).join(" & ")} \\ 1 & ${M[1].map(cell).join(" & ")} \end{array}`;
    return { q: R`Η από κοινού συνάρτηση μάζας πιθανότητας των $X, Y$ δίνεται από τον πίνακα $${tab}$. Να βρείτε τα $E(X)$, $E(Y)$ και τη συνδιακύμανση $\text{Cov}(X, Y)$.`,
      fields: [{ label: "E(X) =", ans: psbR(EX), tol: 0.0006 }, { label: "E(Y) =", ans: psbR(EY), tol: 0.0006 }, { label: "Cov =", ans: psbR(C), tol: 0.0006 }], hint: R`Περιθώριες κατανομές, $E(XY) = \sum x y\, p(x, y)$, $\text{Cov} = E(XY) - E(X)E(Y)$.`,
      sol: R`$P(X = 1) = ${psbK(px1, 2)}$ ⇒ $E(X) = ${psbK(EX, 2)}$. $p_Y = (${py.map(v => psbK(v, 2)).join(", ")})$ ⇒ $E(Y) = ${psbK(py[1], 2)} + 2\cdot ${psbK(py[2], 2)} = ${psbK(EY, 2)}$. $E(XY) = ${psbK(M[1][1], 2)} + 2\cdot ${psbK(M[1][2], 2)} = ${psbK(EXY, 2)}$, άρα $\text{Cov} = ${psbK(EXY, 2)} - ${psbK(EX, 2)}\cdot ${psbK(EY, 2)} = ${psbK(C)}$.` };
  } },
  psbclt: { title: "Γεννήτρια — δειγματικός μέσος και ΚΟΘ", make() {
    const [s, n] = bkPick(PSB_SN.filter(([, nn]) => nn >= 30)), mu = bkPick([40, 50, 75, 100, 250, 800]), se = s / Math.sqrt(n), z = ri(5, 25) / 10, gt = ri(0, 1) === 1;
    const c = mu + (gt ? 1 : -1) * z * se, Pz = psbR(psbPhi(z)), ans = psbR(1 - Pz);
    return { q: R`Πληθυσμός έχει μέση τιμή $\mu = ${mu}$ και τυπική απόκλιση $\sigma = ${s}$. Παίρνουμε τυχαίο δείγμα μεγέθους $n = ${n}$. Με το Κεντρικό Οριακό Θεώρημα, να βρείτε την τυπική απόκλιση του $\bar X$ και την $P(\bar X ${gt ? ">" : "<"} ${psbK(c, 2)})$. Δίνεται $\Phi(${psbK(z, 1)}) = ${psbK(Pz)}$.`,
      fields: [{ label: "σ/√n =", ans: psbR(se, 4), tol: psbTol(se, 0.006) }, { label: "P =", ans, tol: 0.0006 }], hint: R`$\bar X \approx N\!\left(\mu, \frac{\sigma^2}{n}\right)$.`,
      sol: R`$\sigma_{\bar X} = \frac{${s}}{\sqrt{${n}}} = ${psbK(se, 4)}$. $z = \frac{${psbK(c, 2)} - ${mu}}{${psbK(se, 4)}} = ${psbK((gt ? 1 : -1) * z, 1)}$, άρα $P = ${gt ? R`1 - \Phi(${psbK(z, 1)})` : R`\Phi(-${psbK(z, 1)}) = 1 - \Phi(${psbK(z, 1)})`} = ${psbK(ans)}$.` };
  } },
  psbci: { title: "Γεννήτρια — διάστημα εμπιστοσύνης για τη μέση τιμή", make() {
    const lv = bkPick([["90", 1.645], ["95", 1.96], ["99", 2.576]]), n = bkPick([16, 25, 36, 49, 64, 100]), s = bkPick([4, 5, 6, 8, 10, 12, 15]), xb = ri(200, 900) / 10, me = lv[1] * s / Math.sqrt(n);
    const lo = psbR(xb - me, 3), hi = psbR(xb + me, 3);
    return { q: R`Από τυχαίο δείγμα $n = ${n}$ παρατηρήσεων από κανονικό πληθυσμό με γνωστό $\sigma = ${s}$ βρέθηκε $\bar x = ${psbK(xb, 1)}$. Να κατασκευάσετε διάστημα εμπιστοσύνης ${lv[0]}% για το $\mu$ (δίνεται $z = ${psbK(lv[1], 3)}$, 3 δεκαδικά).`,
      fields: [{ label: "κάτω άκρο =", ans: lo, tol: psbTol(lo, 0.002) }, { label: "άνω άκρο =", ans: hi, tol: psbTol(hi, 0.002) }], hint: R`$\bar x \pm z\frac{\sigma}{\sqrt n}$.`,
      sol: R`Περιθώριο σφάλματος $${psbK(lv[1], 3)}\cdot\frac{${s}}{\sqrt{${n}}} = ${psbK(me, 3)}$, άρα $(${psbK(lo, 3)};\ ${psbK(hi, 3)})$.` };
  } },
  psbtest: { title: "Γεννήτρια — έλεγχος Z για τη μέση τιμή", make() {
    const [s, n] = bkPick(PSB_SN), m0 = bkPick([20, 50, 60, 100, 120]), se = s / Math.sqrt(n), z = ri(5, 28) / 10 * bkPick([1, -1]);
    const xb = m0 + z * se, typ = ri(0, 2), Pz = psbR(psbPhi(Math.abs(z))), dir = bkPick([1, -1]);
    const h1 = typ === 0 ? R`\mu \ne ${m0}` : dir > 0 ? R`\mu > ${m0}` : R`\mu < ${m0}`;
    const agree = typ !== 0 && Math.sign(z) === dir;
    const p = typ === 0 ? psbR(2 * (1 - Pz)) : agree ? psbR(1 - Pz) : Pz;
    const al = 0.05, rej = p <= al;
    const pf = typ === 0 ? R`$p = 2\left(1 - \Phi(|z|)\right) = 2(1 - ${psbK(Pz)}) = ${psbK(p)}$`
      : dir > 0 ? (agree ? R`$p = P(Z \ge ${psbK(z, 1)}) = 1 - \Phi(${psbK(Math.abs(z), 1)}) = ${psbK(p)}$` : R`$p = P(Z \ge ${psbK(z, 1)}) = \Phi(${psbK(Math.abs(z), 1)}) = ${psbK(p)}$ (τα δεδομένα δείχνουν προς την αντίθετη κατεύθυνση από την $H_1$)`)
      : (agree ? R`$p = P(Z \le ${psbK(z, 1)}) = 1 - \Phi(${psbK(Math.abs(z), 1)}) = ${psbK(p)}$` : R`$p = P(Z \le ${psbK(z, 1)}) = \Phi(${psbK(Math.abs(z), 1)}) = ${psbK(p)}$ (τα δεδομένα δείχνουν προς την αντίθετη κατεύθυνση από την $H_1$)`);
    return { q: R`Θέλουμε να ελέγξουμε την $H_0: \mu = ${m0}$ έναντι $H_1: ${h1}$. Ο πληθυσμός είναι κανονικός με $\sigma = ${s}$, και από δείγμα $n = ${n}$ βρέθηκε $\bar x = ${psbK(xb, 2)}$. Να υπολογίσετε την ελεγχοσυνάρτηση $Z$ και την p-τιμή. Δίνεται $\Phi(${psbK(Math.abs(z), 1)}) = ${psbK(Pz)}$.`,
      fields: [{ label: "Z =", ans: psbR(z, 2), tol: psbTol(z, 0.006) }, { label: "p-τιμή =", ans: p, tol: 0.0006 }], hint: R`$Z = \frac{\bar x - \mu_0}{\sigma/\sqrt n}$· ${typ === 0 ? "αμφίπλευρος: p = 2(1 − Φ(|z|))" : "δεξιόπλευρος: p = P(Z ≥ z) = 1 − Φ(z)· αριστερόπλευρος: p = P(Z ≤ z) = Φ(z)"}.`,
      sol: R`$Z = \frac{${psbK(xb, 2)} - ${m0}}{${s}/\sqrt{${n}}} = ${psbK(z, 1)}$. ${pf}. Σε επίπεδο $\alpha = 0{,}05$: ${rej ? "απορρίπτουμε την $H_0$ ($p \\le 0{,}05$)" : "δεν απορρίπτουμε την $H_0$ ($p > 0{,}05$)"}.` };
  } },
  psbreg: { title: "Γεννήτρια — ευθεία ελαχίστων τετραγώνων", make() {
    const X = [1, 2, 3, 4, 5]; let Y;
    do { const b0 = ri(-3, 3), a0 = ri(2, 10); Y = X.map(x => a0 + b0 * x + ri(-2, 2)); const r = Y.reduce((a, b) => a + b, 0) % 5; Y[2] -= r; } while (Y.some(y => y < 0) || new Set(Y).size < 3);
    const yb = Y.reduce((a, b) => a + b, 0) / 5, Sxy = X.reduce((a, x, i) => a + (x - 3) * (Y[i] - yb), 0), b = Sxy / 10, a = yb - 3 * b;
    if (b === 0) return GENS.psbreg.make();
    return { q: R`Για τα δεδομένα $x: 1, 2, 3, 4, 5$ και $y: ${Y.join(", ")}$, να βρείτε την ευθεία ελαχίστων τετραγώνων $\hat y = a + bx$.`,
      fields: [{ label: "b =", ans: psbR(b, 2), tol: psbTol(b, 0.001) }, { label: "a =", ans: psbR(a, 2), tol: psbTol(a, 0.001) }], hint: R`$\bar x = 3$, $S_{xx} = 10$, $b = S_{xy}/S_{xx}$, $a = \bar y - b\bar x$.`,
      sol: R`$\bar x = 3$, $\bar y = ${psbK(yb, 1)}$, $S_{xy} = \sum (x_i - \bar x)(y_i - \bar y) = ${psbK(Sxy, 1)}$, $S_{xx} = 10$. Άρα $b = ${psbK(b, 2)}$ και $a = ${psbK(yb, 1)} - ${b < 0 ? `(${psbK(b, 2)})` : psbK(b, 2)}\cdot 3 = ${psbK(a, 2)}$.` };
  } }
});

/* =========== Κεφ. 7–10 (Στατιστική): πρόσθετα widgets & γεννήτριες (πρόθεμα psb) =========== */
const psbTpdf = (x, v) => { const lg = (z) => { /* log Γ, Lanczos */
  const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lg(1 - z); z -= 1; let a = c[0]; const t = z + g + 0.5; for (let i = 1; i < 9; i++) a += c[i] / (z + i);
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a); };
  return Math.exp(lg((v + 1) / 2) - lg(v / 2) - 0.5 * Math.log(v * Math.PI) - (v + 1) / 2 * Math.log(1 + x * x / v)); };
function psbTcdf(x, v) { /* Simpson από 0 έως |x| */ const n = 400, b = Math.abs(x), h = b / n; let s = psbTpdf(0, v) + psbTpdf(b, v);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * psbTpdf(i * h, v); const half = s * h / 3; return x >= 0 ? 0.5 + half : 0.5 - half; }
function psbTq(p, v) { let lo = 0, hi = 700; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (psbTcdf(m, v) < p) lo = m; else hi = m; } return (lo + hi) / 2; }
const psbNum = (x, d = 3) => psbK(psbR(x, d), d);
const psbNeg = (x, d = 3) => x < 0 ? `(${psbNum(x, d)})` : psbNum(x, d);

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 7.2 αμεροληψία: S² έναντι σ̂² ---------- */
  psbbias(box) {
    box.innerHTML = `<div class="wctl"><label>n <input type="range" class="rn" min="2" max="30" value="5"><b class="vn"></b></label><button class="btn ghost bg">Νέα δείγματα</button></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const n = +$(".rn", box).value, mu = 50, sg = 10, K = 3000; $(".vn", box).textContent = n;
      let sS = 0, sH = 0, sM = 0; const means = [];
      for (let k = 0; k < K; k++) { const x = []; for (let i = 0; i < n; i++) x.push(mu + sg * psbGauss()); const m = psbMean(x), ss = x.reduce((a, v) => a + (v - m) ** 2, 0); sS += ss / (n - 1); sH += ss / n; sM += m; means.push(m); }
      const eS = sS / K, eH = sH / K, eM = sM / K;
      const svg = gyCanvas(box, 560, 230), sy = v => 200 - v * 1.45, bars = [["E(S²)", eS, "var(--blue)"], ["E(σ̂²)", eH, "#C2410C"], ["(n−1)σ²/n", sg * sg * (n - 1) / n, "var(--amber)"]];
      gyAdd(svg, "line", { x1: 30, x2: 540, y1: sy(100), y2: sy(100), style: "stroke:var(--green);stroke-width:2;stroke-dasharray:6 4" });
      gyAdd(svg, "text", { x: 536, y: sy(100) - 6, "text-anchor": "end", style: gyTS + ";font-size:12px;fill:var(--green)" }, "σ² = 100");
      bars.forEach(([lab, v, col], i) => { const x = 70 + i * 160; gyAdd(svg, "rect", { x, y: sy(v), width: 90, height: 200 - sy(v), style: `fill:${col};fill-opacity:.55` });
        gyAdd(svg, "text", { x: x + 45, y: sy(v) - 6, "text-anchor": "middle", style: gyTS + ";font-size:13px" }, psbF(v, 1)); gyAdd(svg, "text", { x: x + 45, y: 220, "text-anchor": "middle", style: gyTS + ";font-size:12px" }, lab); });
      $(".wout", box).innerHTML = `${K} δείγματα μεγέθους n = ${n} από N(50, 10²). Μέσος όρος των X̄: <b>${psbF(eM, 2)}</b> (θεωρητικά μ = 50)· μέσος όρος των S²: <b>${psbF(eS, 1)}</b>· μέσος όρος των σ̂²: <b>${psbF(eH, 1)}</b>.
        <br><span class="muted">Η S² (διαίρεση με n − 1) «πέφτει» κατά μέσο όρο πάνω στο σ² = 100: είναι αμερόληπτη. Η σ̂² (διαίρεση με n) υποεκτιμά συστηματικά, με μέση τιμή (n − 1)σ²/n· η μεροληψία χάνεται όσο μεγαλώνει το n.</span>`;
    }
    $(".rn", box).oninput = draw; $(".bg", box).onclick = draw; draw();
  },

  /* ---------- 8.2 κατανομή t έναντι N(0,1) ---------- */
  psbtdist(box) {
    box.innerHTML = `<div class="wctl"><label>βαθμοί ελευθερίας ν <input type="range" class="rv" min="1" max="40" value="5"><b class="vv"></b></label><label>επίπεδο <select class="sl"><option value="0.1">90%</option><option value="0.05" selected>95%</option><option value="0.01">99%</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const v = +$(".rv", box).value, al = +$(".sl", box).value; $(".vv", box).textContent = v;
      const f = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI), g = x => psbTpdf(x, v), t = psbTq(1 - al / 2, v), z = psbZ2[String(al)];
      const P = makePlot($(".pl", box), { xmin: -5, xmax: 5, ymin: -0.04, ymax: 0.45, H: 240, xstep: 1, ystep: 0.1 });
      psbArea(P, g, -t, t, "fill:var(--blue);fill-opacity:.22"); P.curve(f, "c2"); P.curve(g, "c1");
      psbVLine(P, t, 0, 0.3, "stroke:var(--blue);stroke-width:2"); psbVLine(P, -t, 0, 0.3, "stroke:var(--blue);stroke-width:2");
      psbTxt(P, t, 0.32, "t", "fill:var(--blue)"); psbTxt(P, 3.6, 0.41, "N(0, 1)", "fill:var(--purple)", "middle");
      $(".wout", box).innerHTML = `<b>t<sub>${v}</sub>(${psbF(al / 2, 3)}) = ${psbF(t, 3)}</b> έναντι z<sub>${psbF(al / 2, 3)}</sub> = ${psbF(z, 3)} (μπλε: κατανομή t με ν = ${v}· μωβ: N(0, 1)).
        <br><span class="muted">Η κατανομή t είναι συμμετρική όπως η κανονική αλλά με «βαρύτερες ουρές», άρα για μικρά δείγματα τα διαστήματα είναι φαρδύτερα. Όσο αυξάνει το ν, η t πλησιάζει την N(0, 1). Στην R: qt(${psbF(1 - al / 2, 3).replace(",", ".")}, df = ${v}).</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 9.2 έλεγχος για δύο πληθυσμούς ---------- */
  psbtwo(box) {
    box.innerHTML = `<div class="wctl"><label>x̄₁ − x̄₂ <input type="range" class="rd" min="0" max="8" step="0.5" value="3"><b class="vd"></b></label><label>s (κοινή) <input type="range" class="rs" min="2" max="12" value="6"><b class="vs"></b></label><label>n ανά δείγμα <input type="range" class="rn" min="5" max="100" value="20"><b class="vn"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const d = +$(".rd", box).value, s = +$(".rs", box).value, n = +$(".rn", box).value;["d", "s", "n"].forEach((c, i) => $(".v" + c, box).textContent = [d, s, n][i]);
      const df = 2 * n - 2, se = s * Math.sqrt(2 / n), T = d / se, p = 2 * (1 - psbTcdf(Math.abs(T), df)), tc = psbTq(0.975, df);
      const m1 = 50 + d / 2, m2 = 50 - d / 2, f1 = x => Math.exp(-((x - m1) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI)), f2 = x => Math.exp(-((x - m2) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));
      const P = makePlot($(".pl", box), { xmin: 50 - 4 * s - 5, xmax: 50 + 4 * s + 5, ymin: -0.2 / s * 0.25, ymax: 0.5 / s, H: 220, xstep: niceStep(8 * s + 10), ystep: niceStep(0.5 / s) });
      P.curve(f2, "c2"); P.curve(f1, "c1"); psbVLine(P, m1, 0, f1(m1), "stroke:var(--blue);stroke-width:2"); psbVLine(P, m2, 0, f2(m2), "stroke:var(--purple);stroke-width:2");
      $(".wout", box).innerHTML = `(Μπλε: πληθυσμός 1, μωβ: πληθυσμός 2.) Δύο ανεξάρτητα δείγματα μεγέθους n = ${n}, κοινή δειγματική τυπική απόκλιση S = ${s}: ελεγχοσυνάρτηση <b>T = (x̄₁ − x̄₂)/(S·√(1/n + 1/n)) = ${psbF(T, 3)}</b>, βαθμοί ελευθερίας ${df}, κρίσιμη τιμή (α = 5%, αμφίπλευρος) ${psbF(tc, 3)}.
        <br><b>p-τιμή ≈ ${psbF(p, 4)}</b> ⇒ ${p <= 0.05 ? "η διαφορά είναι στατιστικώς σημαντική σε επίπεδο 5%" : "η διαφορά δεν είναι στατιστικώς σημαντική σε επίπεδο 5%"}.
        <br><span class="muted">Η ίδια διαφορά μέσων γίνεται «σημαντική» όταν τα δείγματα είναι μεγαλύτερα ή η διασπορά μικρότερη: μετράει η διαφορά σε σχέση με το τυπικό σφάλμα.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 10.1 συντελεστής συσχέτισης ---------- */
  psbcorr(box) {
    box.innerHTML = `<div class="wctl"><label>ρ (πληθυσμού) <input type="range" class="rr" min="-1" max="1" step="0.05" value="0.6"><b class="vr"></b></label><label>n <input type="range" class="rn" min="5" max="80" value="20"><b class="vn"></b></label><button class="btn ghost bg">Νέο δείγμα</button></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const rho = +$(".rr", box).value, n = +$(".rn", box).value; $(".vr", box).textContent = psbF(rho, 2); $(".vn", box).textContent = n;
      const X = [], Y = []; for (let i = 0; i < n; i++) { const a = psbGauss(), b = psbGauss(); X.push(50 + 10 * a); Y.push(50 + 10 * (rho * a + Math.sqrt(Math.max(0, 1 - rho * rho)) * b)); }
      const xb = psbMean(X), yb = psbMean(Y), Sxx = X.reduce((s, x) => s + (x - xb) ** 2, 0), Syy = Y.reduce((s, y) => s + (y - yb) ** 2, 0), Sxy = X.reduce((s, x, i) => s + (x - xb) * (Y[i] - yb), 0);
      const r = Sxy / Math.sqrt(Sxx * Syy), t = Math.abs(r) < 1 ? r * Math.sqrt(n - 2) / Math.sqrt(1 - r * r) : Infinity, tc = psbTq(0.975, n - 2), p = isFinite(t) ? 2 * (1 - psbTcdf(Math.abs(t), n - 2)) : 0;
      const P = makePlot($(".pl", box), { xmin: 15, xmax: 85, ymin: 15, ymax: 85, H: 260, xstep: 10, ystep: 10 }); X.forEach((x, i) => P.dot(Math.min(84, Math.max(16, x)), Math.min(84, Math.max(16, Y[i])), "d1"));
      $(".wout", box).innerHTML = `Δειγματικός συντελεστής συσχέτισης <b>r = ${psbF(r, 3)}</b>· έλεγχος H₀: ρ = 0: t = r√(n − 2)/√(1 − r²) = <b>${isFinite(t) ? psbF(t, 3) : "∞"}</b> με ${n - 2} β.ε., κρίσιμη τιμή ±${psbF(tc, 3)}, p-τιμή ≈ ${psbF(p, 4)}.
        <br><span class="muted">Με μικρό n, ακόμη και όταν ρ = 0 μπορεί να προκύψει «μεγάλο» r από τύχη· ο έλεγχος t λαμβάνει υπόψη το μέγεθος του δείγματος.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); $(".bg", box).onclick = draw; draw();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  psbest: { title: "Γεννήτρια — δειγματικός μέσος και εκτιμήτριες", make() {
    const t = ri(0, 2);
    if (t === 0) { const [s, n] = bkPick(PSB_SN), mu = bkPick([20, 40, 50, 75, 100, 120]), se = s / Math.sqrt(n);
      return { q: R`Από πληθυσμό με μέση τιμή $\mu = ${mu}$ και τυπική απόκλιση $\sigma = ${s}$ παίρνουμε τυχαίο δείγμα μεγέθους $n = ${n}$. Να βρείτε τη μέση τιμή, τη διασπορά και την τυπική απόκλιση του δειγματικού μέσου $\bar X$.`,
        fields: [{ label: "E(X̄) =", ans: mu }, { label: "Var(X̄) =", ans: psbR(se * se, 4), tol: psbTol(se * se, 0.001) }, { label: "σ/√n =", ans: psbR(se, 4), tol: psbTol(se, 0.001) }],
        hint: R`$E(\bar X) = \mu$, $Var(\bar X) = \frac{\sigma^2}{n}$.`, sol: R`$E(\bar X) = ${mu}$, $Var(\bar X) = \frac{${s * s}}{${n}} = ${psbNum(se * se, 4)}$ και $\frac{\sigma}{\sqrt n} = \frac{${s}}{${Math.sqrt(n)}} = ${psbNum(se, 4)}$.` }; }
    if (t === 1) { const n = bkPick([4, 5, 8, 10, 20, 25]), s2 = bkPick([16, 25, 36, 40, 50, 100]), e = s2 * (n - 1) / n;
      return { q: R`Έστω $X_1, \dots, X_{${n}}$ τυχαίο δείγμα από κατανομή με διασπορά $\sigma^2 = ${s2}$. Να βρείτε τη μέση τιμή της εκτιμήτριας $\hat\sigma^2 = \frac{1}{n}\sum_{k=1}^{n}(X_k - \bar X)^2$ και τη μεροληψία της $E(\hat\sigma^2) - \sigma^2$.`,
        fields: [{ label: "E(σ̂²) =", ans: psbR(e, 4), tol: psbTol(e, 0.001) }, { label: "μεροληψία =", ans: psbR(e - s2, 4), tol: psbTol(e - s2, 0.001) }],
        hint: R`$E(S^2) = \sigma^2$ και $\hat\sigma^2 = \frac{n - 1}{n}S^2$.`, sol: R`$E(\hat\sigma^2) = \frac{n - 1}{n}\sigma^2 = \frac{${n - 1}}{${n}}\cdot ${s2} = ${psbNum(e, 4)}$, άρα μεροληψία $${psbNum(e - s2, 4)}$ (υποεκτιμά το $\sigma^2$· η $S^2$ είναι αμερόληπτη).` }; }
    const n = bkPick([100, 200, 400, 500, 625, 800]), x = ri(Math.round(n * 0.1), Math.round(n * 0.6)), ph = x / n, se = Math.sqrt(ph * (1 - ph) / n);
    return { q: R`Σε τυχαίο δείγμα $${n}$ ατόμων, τα $${x}$ έχουν ένα χαρακτηριστικό. Να βρείτε την εκτίμηση $\hat p$ του πληθυσμιακού ποσοστού και την εκτίμηση του τυπικού του σφάλματος $\sqrt{\hat p(1 - \hat p)/n}$ (4 δεκαδικά).`,
      fields: [{ label: "p̂ =", ans: psbR(ph, 4), tol: 0.0006 }, { label: "ΣΕ =", ans: psbR(se, 4), tol: 0.0006 }],
      hint: R`Το $\hat p$ είναι ο δειγματικός μέσος των δεικτών $0/1$.`, sol: R`$\hat p = \frac{${x}}{${n}} = ${psbNum(ph, 4)}$ και $\sqrt{\frac{${psbNum(ph, 4)}\cdot ${psbNum(1 - ph, 4)}}{${n}}} = ${psbNum(se, 4)}$.` };
  } },
  psbci2: { title: "Γεννήτρια — διαστήματα εμπιστοσύνης για δύο πληθυσμούς", make() {
    const t = ri(0, 2);
    if (t === 0) { const n1 = bkPick([50, 60, 80, 100]), n2 = bkPick([64, 90, 120, 150]), s1 = ri(4, 12), s2 = ri(4, 12), x1 = ri(400, 700) / 10, x2 = ri(350, 650) / 10, lv = bkPick([["90", 1.645], ["95", 1.96], ["99", 2.576]]);
      const se = Math.sqrt(s1 * s1 / n1 + s2 * s2 / n2), d = x1 - x2, lo = psbR(d - lv[1] * se, 3), hi = psbR(d + lv[1] * se, 3);
      return { q: R`Δύο ανεξάρτητα τυχαία δείγματα έδωσαν $n_1 = ${n1}$, $\bar x_1 = ${psbK(x1, 1)}$, $s_1 = ${s1}$ και $n_2 = ${n2}$, $\bar x_2 = ${psbK(x2, 1)}$, $s_2 = ${s2}$. Να κατασκευάσετε διάστημα εμπιστοσύνης ${lv[0]}% για τη διαφορά $\mu_1 - \mu_2$ (δίνεται $z = ${psbK(lv[1], 3)}$, 3 δεκαδικά).`,
        fields: [{ label: "κάτω άκρο =", ans: lo, tol: psbTol(lo, 0.003) }, { label: "άνω άκρο =", ans: hi, tol: psbTol(hi, 0.003) }],
        hint: R`Μεγάλα δείγματα: $\bar x_1 - \bar x_2 \pm z\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}$.`,
        sol: R`$\bar x_1 - \bar x_2 = ${psbNum(d, 1)}$, $\sqrt{\frac{${s1 * s1}}{${n1}} + \frac{${s2 * s2}}{${n2}}} = ${psbNum(se, 4)}$, περιθώριο $${psbNum(lv[1] * se, 3)}$: $(${psbNum(lo, 3)};\ ${psbNum(hi, 3)})$. ${lo < 0 && hi > 0 ? "Το διάστημα περιέχει το $0$: δεν φαίνεται σημαντική διαφορά." : "Το διάστημα δεν περιέχει το $0$: η διαφορά είναι σημαντική στο αντίστοιχο επίπεδο."}` }; }
    if (t === 1) { const n1 = bkPick([100, 150, 200, 250]), n2 = bkPick([100, 150, 200, 250]), a = ri(Math.round(0.2 * n1), Math.round(0.7 * n1)), b = ri(Math.round(0.2 * n2), Math.round(0.7 * n2));
      const p1 = a / n1, p2 = b / n2, se = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2), lo = psbR(p1 - p2 - 1.96 * se, 4), hi = psbR(p1 - p2 + 1.96 * se, 4);
      return { q: R`Σε δύο ανεξάρτητα δείγματα, $${a}$ από $${n1}$ και $${b}$ από $${n2}$ άτομα αντίστοιχα έχουν ένα χαρακτηριστικό. Να κατασκευάσετε διάστημα εμπιστοσύνης $95\%$ για τη διαφορά $p_1 - p_2$ ($z_{0{,}025} = 1{,}96$, 4 δεκαδικά).`,
        fields: [{ label: "κάτω άκρο =", ans: lo, tol: 0.0008 }, { label: "άνω άκρο =", ans: hi, tol: 0.0008 }],
        hint: R`$\hat p_1 - \hat p_2 \pm z_{\alpha/2}\sqrt{\frac{\hat p_1(1 - \hat p_1)}{n_1} + \frac{\hat p_2(1 - \hat p_2)}{n_2}}$.`,
        sol: R`$\hat p_1 = ${psbNum(p1, 4)}$, $\hat p_2 = ${psbNum(p2, 4)}$, τυπικό σφάλμα $${psbNum(se, 4)}$, περιθώριο $${psbNum(1.96 * se, 4)}$: $(${psbNum(lo, 4)};\ ${psbNum(hi, 4)})$.` }; }
    const n = bkPick([6, 8, 9, 10, 12]); let d; do { d = Array.from({ length: n }, () => ri(-4, 12)); } while (Math.round(psbMean(d) * 10) % 5 !== 0 || Math.abs(psbMean(d) * 10 - Math.round(psbMean(d) * 10)) > 1e-9 || new Set(d).size < 3);
    const m = psbMean(d), sd = Math.sqrt(d.reduce((s, v) => s + (v - m) ** 2, 0) / (n - 1)), tq = { 6: 2.571, 8: 2.365, 9: 2.306, 10: 2.262, 12: 2.201 }[n], me = tq * sd / Math.sqrt(n), lo = psbR(m - me, 3), hi = psbR(m + me, 3);
    return { q: R`Σε $${n}$ ζευγαρωτές παρατηρήσεις (πριν – μετά) οι διαφορές είναι: $${d.join(",\\ ")}$. Υποθέτοντας κανονικότητα, να βρείτε τον μέσο $\bar d$ των διαφορών και διάστημα εμπιστοσύνης $95\%$ για τη μέση διαφορά $\delta$ (δίνεται $t_{${n - 1}}(0{,}025) = ${psbK(tq, 3)}$, 3 δεκαδικά).`,
      fields: [{ label: "d̄ =", ans: psbR(m, 2), tol: psbTol(m, 0.001) }, { label: "κάτω άκρο =", ans: lo, tol: psbTol(lo, 0.003) }, { label: "άνω άκρο =", ans: hi, tol: psbTol(hi, 0.003) }],
      hint: R`$\bar d \pm t_{n-1}(\alpha/2)\frac{s_D}{\sqrt n}$.`, sol: R`$\bar d = ${psbNum(m, 2)}$, $s_D = ${psbNum(sd, 4)}$, περιθώριο $${psbK(tq, 3)}\cdot\frac{${psbNum(sd, 4)}}{\sqrt{${n}}} = ${psbNum(me, 3)}$: $(${psbNum(lo, 3)};\ ${psbNum(hi, 3)})$.` };
  } },
  psbtest2: { title: "Γεννήτρια — έλεγχος t και έλεγχοι δύο πληθυσμών", make() {
    const t = ri(0, 2);
    if (t === 0) { const n = bkPick([9, 16, 25]), s = bkPick([3, 4, 6, 8, 10]), m0 = bkPick([20, 50, 100, 140]), sq = Math.sqrt(n), xb = psbR(m0 + ri(5, 30) / 10 * bkPick([1, -1]) * s / sq, 2), tv = (xb - m0) / (s / sq);
      const crit = { 9: 1.86, 16: 1.753, 25: 1.711 }[n], dir = bkPick([1, -1]), h1 = dir > 0 ? ">" : "<", rej = dir > 0 ? tv > crit : tv < -crit;
      return { q: R`Από κανονικό πληθυσμό, δείγμα $n = ${n}$ έδωσε $\bar x = ${psbK(xb, 2)}$ και $s = ${s}$. Ελέγχουμε $H_0: \mu = ${m0}$ έναντι $H_1: \mu ${h1} ${m0}$ σε επίπεδο σημαντικότητας $5\%$ (δίνεται $t_{${n - 1}}(0{,}05) = ${psbK(crit, 3)}$). Να υπολογίσετε την ελεγχοσυνάρτηση $T$.`,
        fields: [{ label: "T =", ans: psbR(tv, 2), tol: psbTol(tv, 0.006) }], hint: R`$T = \frac{\bar x - \mu_0}{s/\sqrt n}$ με $n - 1$ βαθμούς ελευθερίας.`,
        sol: R`$T = \frac{${psbK(xb, 2)} - ${m0}}{${s}/${sq}} = ${psbNum(tv, 2)}$. Περιοχή απόρριψης: $${dir > 0 ? R`T > ${psbK(crit, 3)}` : R`T < -${psbK(crit, 3)}`}$. ${rej ? "Η τιμή ανήκει σε αυτή, άρα απορρίπτουμε την $H_0$" : (Math.sign(tv) !== dir ? "Η $T$ έχει αντίθετο πρόσημο από την κατεύθυνση της $H_1$, άρα δεν απορρίπτουμε την $H_0$" : "Η τιμή δεν ανήκει σε αυτή, άρα δεν απορρίπτουμε την $H_0$")} σε επίπεδο $5\%$.` }; }
    if (t === 1) { const n = bkPick([100, 150, 200]), a = ri(Math.round(0.3 * n), Math.round(0.6 * n)), b = ri(Math.round(0.2 * n), a - 3), p1 = a / n, p2 = b / n, pp = (a + b) / (2 * n), se = Math.sqrt(pp * (1 - pp) * (2 / n)), z = (p1 - p2) / se;
      return { q: R`Σε δύο ανεξάρτητα δείγματα μεγέθους $${n}$ το καθένα, $${a}$ και $${b}$ άτομα αντίστοιχα έχουν ένα χαρακτηριστικό. Ελέγχουμε $H_0: p_1 = p_2$ έναντι $H_1: p_1 > p_2$. Να βρείτε τη συνολική (συγκεντρωτική) εκτίμηση $\hat p$ και την ελεγχοσυνάρτηση $Z$ (3 δεκαδικά).`,
        fields: [{ label: "p̂ =", ans: psbR(pp, 4), tol: 0.0006 }, { label: "Z =", ans: psbR(z, 3), tol: psbTol(z, 0.006) }],
        hint: R`Υπό την $H_0$: $\hat p = \frac{x_1 + x_2}{n_1 + n_2}$ και $Z = \frac{\hat p_1 - \hat p_2}{\sqrt{\hat p(1 - \hat p)\left(\frac{1}{n_1} + \frac{1}{n_2}\right)}}$.`,
        sol: R`$\hat p_1 = ${psbNum(p1, 4)}$, $\hat p_2 = ${psbNum(p2, 4)}$, $\hat p = \frac{${a + b}}{${2 * n}} = ${psbNum(pp, 4)}$. $Z = \frac{${psbNum(p1 - p2, 4)}}{\sqrt{${psbNum(pp, 4)}\cdot ${psbNum(1 - pp, 4)}\cdot\frac{2}{${n}}}} = ${psbNum(z, 3)}$.` }; }
    const n1 = bkPick([8, 10, 12]), n2 = bkPick([8, 10, 12]); let s1, s2; do { s1 = ri(3, 8); s2 = ri(3, 8); } while (s1 / s2 > 2 || s2 / s1 > 2); const x1 = ri(200, 300) / 10, x2 = ri(180, 280) / 10;
    const sp2 = ((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / (n1 + n2 - 2), se = Math.sqrt(sp2 * (1 / n1 + 1 / n2)), T = (x1 - x2) / se;
    return { q: R`Δύο ανεξάρτητα δείγματα από κανονικούς πληθυσμούς με ίσες (άγνωστες) διασπορές έδωσαν $n_1 = ${n1}$, $\bar x_1 = ${psbK(x1, 1)}$, $s_1 = ${s1}$ και $n_2 = ${n2}$, $\bar x_2 = ${psbK(x2, 1)}$, $s_2 = ${s2}$. Για τον έλεγχο $H_0: \mu_1 = \mu_2$, να βρείτε τη συγκεντρωτική διασπορά $S^2$ και την ελεγχοσυνάρτηση $T$ (3 δεκαδικά).`,
      fields: [{ label: "S² =", ans: psbR(sp2, 3), tol: psbTol(sp2, 0.003) }, { label: "T =", ans: psbR(T, 3), tol: psbTol(T, 0.006) }],
      hint: R`$S^2 = \frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$, $T = \frac{\bar x_1 - \bar x_2}{S\sqrt{1/n_1 + 1/n_2}}$.`,
      sol: R`$S^2 = \frac{${n1 - 1}\cdot ${s1 * s1} + ${n2 - 1}\cdot ${s2 * s2}}{${n1 + n2 - 2}} = ${psbNum(sp2, 3)}$, $S = ${psbNum(Math.sqrt(sp2), 4)}$. $T = \frac{${psbNum(x1 - x2, 1)}}{${psbNum(Math.sqrt(sp2), 4)}\sqrt{\frac{1}{${n1}} + \frac{1}{${n2}}}} = ${psbNum(T, 3)}$, με $${n1 + n2 - 2}$ βαθμούς ελευθερίας.` };
  } },
  psbcor: { title: "Γεννήτρια — συντελεστής συσχέτισης και έλεγχος ρ = 0", make() {
    const t = ri(0, 1);
    if (t === 0) { let X, Y, r; do { X = [1, 2, 3, 4, 5]; const b0 = bkPick([-2, -1, 1, 2]); Y = X.map(x => 10 + b0 * x + ri(-2, 2)); const xb = 3, yb = psbMean(Y);
        const Sxy = X.reduce((s, x, i) => s + (x - xb) * (Y[i] - yb), 0), Syy = Y.reduce((s, y) => s + (y - yb) ** 2, 0); r = Sxy / Math.sqrt(10 * Syy); } while (!isFinite(r) || Math.abs(r) > 0.995 || Math.abs(r) < 0.2);
      const yb = psbMean(Y), Sxy = X.reduce((s, x, i) => s + (x - 3) * (Y[i] - yb), 0), Syy = Y.reduce((s, y) => s + (y - yb) ** 2, 0);
      return { q: R`Για τα δεδομένα $x: 1, 2, 3, 4, 5$ και $y: ${Y.join(", ")}$, να υπολογίσετε τον δειγματικό συντελεστή συσχέτισης $r$ (4 δεκαδικά).`,
        fields: [{ label: "r =", ans: psbR(r, 4), tol: 0.0006 }], hint: R`$r = \frac{S_{xy}}{\sqrt{S_{xx}S_{yy}}}$ με $S_{xx} = 10$.`,
        sol: R`$\bar y = ${psbNum(yb, 1)}$, $S_{xy} = ${psbNum(Sxy, 2)}$, $S_{yy} = ${psbNum(Syy, 2)}$, $S_{xx} = 10$. $r = \frac{${psbNum(Sxy, 2)}}{\sqrt{10\cdot ${psbNum(Syy, 2)}}} = ${psbNum(r, 4)}$.` }; }
    const n = bkPick([10, 12, 18, 22, 27]), r = bkPick([0.3, 0.4, 0.5, 0.6, 0.7, -0.4, -0.5, -0.6]), tv = r * Math.sqrt(n - 2) / Math.sqrt(1 - r * r), crit = { 10: 2.306, 12: 2.228, 18: 2.12, 22: 2.086, 27: 2.06 }[n], rej = Math.abs(tv) > crit;
    return { q: R`Σε δείγμα $n = ${n}$ ζευγών (από διδιάστατη κανονική κατανομή) βρέθηκε $r = ${psbK(r, 1)}$. Να υπολογίσετε την ελεγχοσυνάρτηση $t$ για τον έλεγχο $H_0: \rho = 0$ έναντι $H_1: \rho \ne 0$ (3 δεκαδικά). Δίνεται $t_{${n - 2}}(0{,}025) = ${psbK(crit, 3)}$.`,
      fields: [{ label: "t =", ans: psbR(tv, 3), tol: psbTol(tv, 0.004) }], hint: R`$t = \frac{r\sqrt{n - 2}}{\sqrt{1 - r^2}}$ με $n - 2$ βαθμούς ελευθερίας.`,
      sol: R`$t = \frac{${psbK(r, 1)}\sqrt{${n - 2}}}{\sqrt{1 - ${psbK(r * r, 2)}}} = ${psbNum(tv, 3)}$. Αφού $|t| ${rej ? ">" : "\\le"} ${psbK(crit, 3)}$, ${rej ? "απορρίπτουμε την $H_0$: η συσχέτιση είναι στατιστικώς σημαντική σε επίπεδο $5\\%$" : "δεν απορρίπτουμε την $H_0$ σε επίπεδο $5\\%$"}.` };
  } },
  psbreg2: { title: "Γεννήτρια — παλινδρόμηση από r, μέσους και τυπικές αποκλίσεις", make() {
    const xb = ri(20, 60), yb = ri(40, 90), sx = ri(5, 20), sy = ri(5, 20), r = bkPick([0.5, 0.6, 0.7, 0.8, -0.5, -0.6, -0.8]), b = r * sy / sx, a = yb - b * xb, x0 = xb + bkPick([-1, 1]) * ri(2, 10), yh = a + b * x0, mts = Math.sqrt(1 - r * r) * sy;
    return { q: R`Για δύο μεταβλητές δίνονται $\bar x = ${xb}$, $\bar y = ${yb}$, $s_x = ${sx}$, $s_y = ${sy}$ και $r = ${psbK(r, 1)}$. Να βρείτε την κλίση $\hat\beta$ της ευθείας παλινδρόμησης της $y$ πάνω στη $x$, την πρόβλεψη $\hat y$ για $x = ${x0}$ και τη ρίζα του μέσου τετραγωνικού σφάλματος $\sqrt{1 - r^2}\, s_y$ (3 δεκαδικά).`,
      fields: [{ label: "β̂ =", ans: psbR(b, 3), tol: psbTol(b, 0.002) }, { label: "ŷ =", ans: psbR(yh, 2), tol: psbTol(yh, 0.03) }, { label: "ΜΤΣ =", ans: psbR(mts, 3), tol: psbTol(mts, 0.003) }],
      hint: R`$\hat\beta = r\frac{s_y}{s_x}$, $\hat\alpha = \bar y - \hat\beta\bar x$.`,
      sol: R`$\hat\beta = ${psbK(r, 1)}\cdot\frac{${sy}}{${sx}} = ${psbNum(b, 4)}$, $\hat\alpha = ${yb} - ${psbNeg(b, 4)}\cdot ${xb} = ${psbNum(a, 3)}$. Για $x = ${x0}$: $\hat y = ${psbNum(a, 3)} ${b < 0 ? "-" : "+"} ${psbNum(Math.abs(b), 4)}\cdot ${x0} = ${psbNum(yh, 2)}$. $\sqrt{1 - ${psbK(r * r, 2)}}\cdot ${sy} = ${psbNum(mts, 3)}$.` };
  } }
});

/* ΜΑΣ055 — κλασικά προβλήματα, ανισότητες, στοχαστικές ανελίξεις (πρόθεμα psc) */
const pscF = (x, d = 4) => Number(x.toFixed(d)).toLocaleString("el-GR", { maximumFractionDigits: d, useGrouping: false });   /* κείμενο */
const pscK = (x, d = 4) => pscF(x, d).replace(",", "{,}");                                                                    /* KaTeX */
const pscR = (x, d = 4) => Number(x.toFixed(d));
const pscH = n => { let s = 0; for (let k = 1; k <= n; k++) s += 1 / k; return s; };
const pscC = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
const pscFall = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r *= n - i; return r; };
const pscFact = n => pscFall(n, n);
const pscFr = (p, q) => { const g = gcdI(Math.abs(p), Math.abs(q)); return [p / g, q / g]; };
const pscFS = (p, q) => { const [a, b] = pscFr(p, q); return b === 1 ? `${a}` : `${a}/${b}`; };                                 /* απάντηση «a/b» */
const pscFT = (p, q) => { const [a, b] = pscFr(p, q); return b === 1 ? `${a}` : (a < 0 ? `-\\frac{${-a}}{${b}}` : `\\frac{${a}}{${b}}`); };
const pscPoi = (k, m) => Math.exp(-m) * m ** k / pscFact(k);
const pscD1 = x => pscK(x, 1);
const pscTS = "font-family:var(--sans);font-weight:800";
function pscMat(M, d = 2) { return `\\begin{pmatrix}${M.map(r => r.map(v => pscK(v, d)).join(" & ")).join(" \\\\ ")}\\end{pmatrix}`; }
function pscMul(A, B) { return A.map((r, i) => B[0].map((_, j) => r.reduce((s, _, k) => s + A[i][k] * B[k][j], 0))); }
function pscPow(P, n) { let M = P.map((r, i) => r.map((_, j) => (i === j ? 1 : 0))); for (let i = 0; i < n; i++) M = pscMul(M, P); return M; }
function pscStat(P) {           /* στάσιμη κατανομή: λύση π(P − I) = 0, Σπ = 1 (Gauss) */
  const n = P.length, A = []; for (let j = 0; j < n; j++) A.push(P.map((r, i) => r[j] - (i === j ? 1 : 0)).concat(0));
  A[n - 1] = Array(n).fill(1).concat(1);
  for (let c = 0; c < n; c++) { let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k]; } }
  return A.map((r, i) => r[n] / r[i]);
}

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 4.1 πρόβλημα γενεθλίων ---------- */
  pscbirth(box) {
    box.innerHTML = `<div class="wctl"><label>προβολή <select class="pmode"><option value="b">Πρόβλημα γενεθλίων</option><option value="s">Σφαίρες σε δοχεία</option></select></label></div><div class="psub"></div>`;
    const md = $(".pmode", box), sub = $(".psub", box);
    const run = () => (md.value === "b" ? WIDGETS.pscbirthCore : WIDGETS.pscbins)(sub);
    md.onchange = run; run();
  },
  pscbirthCore(box) {
    box.innerHTML = `<div class="wctl"><label>άτομα n <input type="range" class="rn" min="2" max="70" value="23"><b class="vn"></b></label>
      <label>«ημέρες» d <select class="sd"><option value="365">365 (έτος)</option><option value="12">12 (μήνες)</option><option value="7">7 (ημέρες εβδομάδας)</option><option value="100">100</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const n = +$(".rn", box).value, d = +$(".sd", box).value; $(".vn", box).textContent = n;
      const N = Math.min(70, d + 1), pr = k => { let q = 1; for (let i = 0; i < k; i++) q *= (d - i) / d; return 1 - q; };
      const P = makePlot($(".pl", box), { xmin: 0, xmax: N + 1, ymin: -0.1, ymax: 1.1, H: 250, xstep: niceStep(N + 1), ystep: 0.25 });
      P.seg(0, 0.5, N + 1, 0.5, "axis"); P.curve(x => pr(Math.round(x)), "c1", 1, N);
      P.curve(x => 1 - Math.exp(-x * (x - 1) / (2 * d)), "c3", 1, N);
      const k = Math.min(n, N), p = pr(k); P.dot(k, p, "d1", `n = ${k}`);
      let m = 1; while (m <= d && pr(m) <= 0.5) m++;
      $(".wout", box).innerHTML = `<b>P(κοινή «ημέρα» για τουλάχιστον δύο από τους ${k}) = 1 − (${d})<sub>${k}</sub>/${d}<sup>${k}</sup> = ${pscF(p)}</b>
        <br>Προσέγγιση 1 − e<sup>−n(n−1)/(2d)</sup> = ${pscF(1 - Math.exp(-k * (k - 1) / (2 * d)))} (πορτοκαλί καμπύλη)
        <br><span class="muted">Ελάχιστο n με πιθανότητα &gt; 50%: <b>${m}</b> για d = ${d}. Με n &gt; d η πιθανότητα είναι 1 (αρχή του περιστερώνα).</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 4.1 σφαίρες σε δοχεία ---------- */
  pscbins(box) {
    box.innerHTML = `<div class="wctl"><label>σφαίρες m <input type="range" class="rm" min="1" max="60" value="20"><b class="vm"></b></label>
      <label>δοχεία n <input type="range" class="rn" min="2" max="20" value="10"><b class="vn"></b></label><button class="btn ghost bg">Νέα ρίψη</button></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const m = +$(".rm", box).value, n = +$(".rn", box).value; $(".vm", box).textContent = m; $(".vn", box).textContent = n;
      const c = Array(n).fill(0); for (let i = 0; i < m; i++) c[ri(0, n - 1)]++;
      const mx = Math.max(4, ...c), svg = gyCanvas(box, 560, 230), w = 520 / n;
      for (let i = 0; i < n; i++) {
        const x = 20 + i * w; gyAdd(svg, "rect", { x: x + 3, y: 20, width: w - 6, height: 180, rx: 6, style: "fill:none;stroke:var(--navy);stroke-width:1.5" });
        const h = 170 * c[i] / mx; gyAdd(svg, "rect", { x: x + 6, y: 197 - h, width: w - 12, height: h, rx: 3, style: `fill:${c[i] ? "var(--blue)" : "none"};fill-opacity:.55` });
        gyAdd(svg, "text", { x: x + w / 2, y: 218, "text-anchor": "middle", style: pscTS + ";font-size:12px;fill:var(--ink)" }, c[i]);
      }
      const emp = c.filter(v => v === 0).length, E = n * (1 - 1 / n) ** m;
      $(".wout", box).innerHTML = `Κενά δοχεία σε αυτή τη ρίψη: <b>${emp}</b> · μέγιστο φορτίο: <b>${Math.max(...c)}</b>
        <br>Αναμενόμενα κενά δοχεία: n(1 − 1/n)<sup>m</sup> = <b>${pscF(E, 3)}</b> ≈ n·e<sup>−m/n</sup> = ${pscF(n * Math.exp(-m / n), 3)}
        <br><span class="muted">P(συγκεκριμένο δοχείο κενό) = (1 − 1/n)<sup>m</sup> = ${pscF((1 - 1 / n) ** m)}· ο αριθμός σφαιρών σε ένα δοχείο ακολουθεί b(m, 1/n).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); $(".bg", box).onclick = draw; draw();
  },

  /* ---------- 4.2 πρόβλημα των κουπονιών ---------- */
  psccoupon(box) {
    box.innerHTML = `<div class="wctl"><label>κουπόνια n <input type="range" class="rn" min="2" max="40" value="10"><b class="vn"></b></label><button class="btn ghost bg">Νέα συλλογή</button></div><div class="pl"></div><div class="wout"></div>`;
    function sim(n) { const have = new Set(), path = [0]; let t = 0; while (have.size < n) { have.add(ri(1, n)); t++; path.push(have.size); } return path; }
    function draw() {
      const n = +$(".rn", box).value; $(".vn", box).textContent = n;
      const path = sim(n), T = path.length - 1; let avg = 0; const R = 400; for (let r = 0; r < R; r++) avg += sim(n).length - 1; avg /= R;
      const E = n * pscH(n), xm = Math.max(T, E) * 1.1;
      const P = makePlot($(".pl", box), { xmin: 0, xmax: xm, ymin: -n * 0.1, ymax: n * 1.15, H: 240, xstep: niceStep(xm), ystep: niceStep(n * 1.2) });
      let dd = `M${P.sx(0)},${P.sy(0)}`; path.forEach((v, i) => { dd += `L${P.sx(i)},${P.sy(v)}`; });
      P.layer.appendChild(svgEl("path", { d: dd, class: "curve c1" }));
      P.seg(E, 0, E, n, "axis"); P.dot(E, n, "d3", "E(X)", -6, -8); P.seg(0, n, xm, n, "axis");
      $(".wout", box).innerHTML = `Αυτή η συλλογή χρειάστηκε <b>${T}</b> κουτιά · μέσος όρος σε ${R} προσομοιώσεις: <b>${pscF(avg, 1)}</b>
        <br><b>E(X) = n(1 + 1/2 + ⋯ + 1/n) = ${pscF(E, 2)}</b> ≈ n·ln n + nC + 1/2 = ${pscF(n * Math.log(n) + 0.57722 * n + 0.5, 2)}
        <br><span class="muted">Τα τελευταία κουπόνια είναι τα «ακριβά»: με k − 1 ήδη, το επόμενο νέο χρειάζεται κατά μέσο όρο n/(n − k + 1) κουτιά (γεωμετρική).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); $(".bg", box).onclick = draw; draw();
  },

  /* ---------- 4.3 Bubblesort — αντιστροφές ---------- */
  pscbubble(box) {
    box.innerHTML = `<div class="wctl"><label>n <input type="range" class="rn" min="3" max="14" value="8"><b class="vn"></b></label><button class="btn ghost bg">Νέα λίστα</button></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const n = +$(".rn", box).value; $(".vn", box).textContent = n;
      const y = shuffle([...Array(n)].map((_, i) => i + 1)); let inv = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (y[i] > y[j]) inv++;
      let sw = 0; const z = [...y]; for (let a = 0; a < n; a++) for (let b = 0; b < n - 1 - a; b++) if (z[b] > z[b + 1]) { [z[b], z[b + 1]] = [z[b + 1], z[b]]; sw++; }
      let avg = 0; for (let r = 0; r < 500; r++) { const q = shuffle([...Array(n)].map((_, i) => i)); for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (q[i] > q[j]) avg++; } avg /= 500;
      const svg = gyCanvas(box, 560, 200), w = 520 / n;
      y.forEach((v, i) => { const h = 150 * v / n; gyAdd(svg, "rect", { x: 20 + i * w + 3, y: 175 - h, width: w - 6, height: h, rx: 3, style: "fill:var(--blue);fill-opacity:.6" });
        gyAdd(svg, "text", { x: 20 + i * w + w / 2, y: 192, "text-anchor": "middle", style: pscTS + ";font-size:12px;fill:var(--ink)" }, v); });
      $(".wout", box).innerHTML = `Λίστα: ${y.join(", ")} · αντεστραμμένα ζεύγη (y<sub>i</sub> &gt; y<sub>j</sub>, i &lt; j): <b>${inv}</b> = ανταλλαγές του Bubblesort: <b>${sw}</b>
        <br>E(X) = n(n − 1)/4 = <b>${pscF(n * (n - 1) / 4, 2)}</b> · μέσος όρος 500 τυχαίων λιστών: ${pscF(avg, 2)} · μέγιστο n(n − 1)/2 = ${n * (n - 1) / 2}
        <br><span class="muted">Κάθε ζεύγος θέσεων είναι αντεστραμμένο με πιθανότητα 1/2· άθροισμα δεικτριών ⇒ C(n, 2)/2.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); $(".bg", box).onclick = draw; draw();
  },

  /* ---------- 5.1 Markov και Chebyshev: φράγμα έναντι πραγματικής πιθανότητας ---------- */
  pscbound(box) {
    const D = [
      { n: "Εκθετική E(1): μ = 1, σ = 1", mu: 1, sd: 1, tail: a => Math.exp(-a), two: k => k >= 1 ? Math.exp(-(1 + k)) : Math.exp(-(1 + k)) + (1 - Math.exp(-(1 - k))) },
      { n: "Ομοιόμορφη U(0, 2): μ = 1, σ = 0,577", mu: 1, sd: Math.sqrt(1 / 3), tail: a => a >= 2 ? 0 : a <= 0 ? 1 : (2 - a) / 2, two: k => { const e = k * Math.sqrt(1 / 3); return e >= 1 ? 0 : 1 - e; } },
      { n: "Poisson(4): μ = 4, σ = 2", mu: 4, sd: 2, tail: a => { let s = 0; for (let x = 0; x < a; x++) s += pscPoi(x, 4); return Math.max(0, 1 - s); }, two: k => { let s = 0; for (let x = 0; x <= 40; x++) if (Math.abs(x - 4) >= 2 * k) s += pscPoi(x, 4); return s; } }];
    box.innerHTML = `<div class="wctl"><label>κατανομή <select class="sd">${D.map((d, i) => `<option value="${i}">${d.n}</option>`).join("")}</select></label></div>
      <div class="wctl"><label>a (Markov) <input type="range" class="ra" min="1" max="50" value="20"><b class="va"></b></label><label>k (Chebyshev) <input type="range" class="rk" min="10" max="40" value="20"><b class="vk"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const d = D[+$(".sd", box).value], a = d.mu * (+$(".ra", box).value) / 10, k = +$(".rk", box).value / 10; $(".va", box).textContent = pscF(a, 1); $(".vk", box).textContent = pscF(k, 1);
      const real1 = d.tail(a), mk = Math.min(1, d.mu / a), real2 = d.two(k), ch = Math.min(1, 1 / (k * k));
      const svg = gyCanvas(box, 560, 220), bars = [["P(X ≥ a)", real1, "var(--blue)"], ["Markov μ/a", mk, "var(--amber)"], ["P(|X−μ| ≥ kσ)", real2, "var(--blue)"], ["Chebyshev 1/k²", ch, "var(--purple)"]];
      bars.forEach(([t, v, c], i) => { const x = 30 + i * 130, h = 160 * v; gyAdd(svg, "rect", { x, y: 180 - h, width: 100, height: h, rx: 4, style: `fill:${c};fill-opacity:.6` });
        gyAdd(svg, "text", { x: x + 50, y: 175 - h, "text-anchor": "middle", style: pscTS + ";font-size:13px;fill:var(--ink)" }, pscF(v, 3));
        gyAdd(svg, "text", { x: x + 50, y: 200, "text-anchor": "middle", style: pscTS + ";font-size:11.5px;fill:var(--ink)" }, t); });
      gyAdd(svg, "line", { x1: 20, x2: 545, y1: 180, y2: 180, style: "stroke:var(--navy);stroke-width:1.5" });
      $(".wout", box).innerHTML = `a = ${pscF(a, 2)}: πραγματική P(X ≥ a) = <b>${pscF(real1)}</b> ≤ Markov E(X)/a = <b>${pscF(mk)}</b>
        <br>k = ${pscF(k, 1)} (ε = kσ = ${pscF(k * d.sd, 3)}): πραγματική P(|X − μ| ≥ kσ) = <b>${pscF(real2)}</b> ≤ Chebyshev 1/k² = <b>${pscF(ch)}</b>
        <br><span class="muted">Τα φράγματα ισχύουν για κάθε κατανομή (Markov: X ≥ 0)· γι' αυτό είναι συχνά πολύ «χαλαρά».</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 5.2 Chernoff έναντι Chebyshev ---------- */
  pscchern(box) {
    box.innerHTML = `<div class="wctl"><label>ρίψεις n <input type="range" class="rn" min="20" max="2000" step="20" value="1000"><b class="vn"></b></label>
      <label>ε <input type="range" class="re" min="2" max="60" value="20"><b class="ve"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const n = +$(".rn", box).value, e = +$(".re", box).value / 100, mu = n / 2; $(".vn", box).textContent = n; $(".ve", box).textContent = pscF(e, 2);
      /* ακριβής P(|X − μ| > με) για X ~ b(n, 1/2) με λογαρίθμους */
      const lf = [0]; for (let i = 1; i <= n; i++) lf.push(lf[i - 1] + Math.log(i));
      let ex = 0; for (let x = 0; x <= n; x++) if (Math.abs(x - mu) > mu * e) ex += Math.exp(lf[n] - lf[x] - lf[n - x] - n * Math.LN2);
      const chb = Math.min(1, (n / 4) / (mu * e) ** 2), chr = Math.min(1, 2 * Math.exp(-mu * e * e / 3));
      const svg = gyCanvas(box, 560, 220), bars = [["ακριβής", ex, "var(--blue)"], ["Chebyshev", chb, "var(--purple)"], ["Chernoff 2e^(−με²/3)", chr, "var(--amber)"]];
      bars.forEach(([t, v, c], i) => { const x = 40 + i * 170, h = 160 * v; gyAdd(svg, "rect", { x, y: 180 - h, width: 130, height: h, rx: 4, style: `fill:${c};fill-opacity:.6` });
        gyAdd(svg, "text", { x: x + 65, y: 175 - h, "text-anchor": "middle", style: pscTS + ";font-size:13px;fill:var(--ink)" }, v < 1e-4 ? v.toExponential(2) : pscF(v, 4));
        gyAdd(svg, "text", { x: x + 65, y: 200, "text-anchor": "middle", style: pscTS + ";font-size:11.5px;fill:var(--ink)" }, t); });
      gyAdd(svg, "line", { x1: 20, x2: 545, y1: 180, y2: 180, style: "stroke:var(--navy);stroke-width:1.5" });
      $(".wout", box).innerHTML = `X = αριθμός κορωνών σε n = ${n} ρίψεις, μ = ${mu}: P(|X − μ| &gt; με) = P(|X − ${mu}| &gt; ${pscF(mu * e, 2)})
        <br>ακριβής <b>${ex < 1e-4 ? ex.toExponential(2) : pscF(ex)}</b> · Chebyshev Var/(με)² = <b>${pscF(chb)}</b> · Chernoff 2e<sup>−με²/3</sup> = <b>${chr < 1e-4 ? chr.toExponential(2) : pscF(chr)}</b>
        <br><span class="muted">Για μεγάλο n το φράγμα Chernoff φθίνει εκθετικά, ενώ το Chebyshev μόνο ως 1/n.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 6.1–6.2 αλυσίδα Markov ---------- */
  pscmarkov(box) {
    const C = [
      { n: "Καιρός: 0 = ηλιοφάνεια, 1 = βροχή", S: ["0", "1"], P: [[0.7, 0.3], [0.4, 0.6]] },
      { n: "Σημειώσεις: E = {1, 2, 3}", S: ["1", "2", "3"], P: [[0.3, 0.5, 0.2], [0.6, 0, 0.4], [0, 0.4, 0.6]] },
      { n: "Ehrenfest με r = 3 σφαίρες", S: ["0", "1", "2", "3"], P: [[0, 1, 0, 0], [1 / 3, 0, 2 / 3, 0], [0, 2 / 3, 0, 1 / 3], [0, 0, 1, 0]] },
      { n: "Καταστροφή παίκτη N = 3, p = 0,5", S: ["0", "1", "2", "3"], P: [[1, 0, 0, 0], [0.5, 0, 0.5, 0], [0, 0.5, 0, 0.5], [0, 0, 0, 1]] }];
    box.innerHTML = `<div class="wctl"><label>αλυσίδα <select class="sc">${C.map((c, i) => `<option value="${i}">${c.n}</option>`).join("")}</select></label>
      <label>αρχική κατάσταση <select class="s0"></select></label><label>βήματα n <input type="range" class="rn" min="0" max="30" value="1"><b class="vn"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function fill() { const c = C[+$(".sc", box).value]; $(".s0", box).innerHTML = c.S.map((s, i) => `<option value="${i}">${s}</option>`).join(""); if (c.S.length === 4) $(".s0", box).value = "1"; draw(); }
    function draw() {
      const c = C[+$(".sc", box).value], k = c.S.length, x0 = +$(".s0", box).value, n = +$(".rn", box).value; $(".vn", box).textContent = n;
      const Pn = pscPow(c.P, n), pi = Pn[x0];
      const svg = gyCanvas(box, 560, 260), R = 26, cx = i => k === 2 ? 130 + i * 150 : 60 + i * (300 / (k - 1)), cy = i => k === 3 ? (i === 1 ? 60 : 180) : 120;
      gyAdd(svg, "defs", {}).innerHTML = `<marker id="pscar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" style="fill:var(--navy)"/></marker>`;
      for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) { const p = c.P[i][j]; if (!p) continue;
        const lab = Number.isInteger(p * 10) ? pscF(p, 1) : pscFS(Math.round(p * 3), 3);
        if (i === j) { gyAdd(svg, "path", { d: `M${cx(i) - 10},${cy(i) - R + 2} C${cx(i) - 30},${cy(i) - R - 40} ${cx(i) + 30},${cy(i) - R - 40} ${cx(i) + 10},${cy(i) - R + 2}`, style: "fill:none;stroke:var(--navy);stroke-width:1.6", "marker-end": "url(#pscar)" });
          gyAdd(svg, "text", { x: cx(i), y: cy(i) - R - 30, "text-anchor": "middle", style: pscTS + ";font-size:12px;fill:var(--navy)" }, lab); continue; }
        const dx = cx(j) - cx(i), dy = cy(j) - cy(i), L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, ox = -uy * 7, oy = ux * 7;
        gyAdd(svg, "line", { x1: cx(i) + ux * R + ox, y1: cy(i) + uy * R + oy, x2: cx(j) - ux * R + ox, y2: cy(j) - uy * R + oy, style: "stroke:var(--navy);stroke-width:1.6", "marker-end": "url(#pscar)" });
        gyAdd(svg, "text", { x: (cx(i) + cx(j)) / 2 + ox * 2.6, y: (cy(i) + cy(j)) / 2 + oy * 2.6 + 4, "text-anchor": "middle", style: pscTS + ";font-size:12px;fill:var(--navy)" }, lab); }
      for (let i = 0; i < k; i++) { gyAdd(svg, "circle", { cx: cx(i), cy: cy(i), r: R, style: `fill:var(--blue);fill-opacity:${0.15 + 0.75 * pi[i]};stroke:var(--navy);stroke-width:2` });
        gyAdd(svg, "text", { x: cx(i), y: cy(i) + 5, "text-anchor": "middle", style: pscTS + ";font-size:15px;fill:var(--ink)" }, c.S[i]); }
      const bx = 428; pi.forEach((v, i) => { const y = 40 + i * 46; gyAdd(svg, "rect", { x: bx, y, width: 100 * v, height: 26, rx: 4, style: "fill:var(--blue);fill-opacity:.6" });
        gyAdd(svg, "text", { x: bx - 8, y: y + 18, "text-anchor": "end", style: pscTS + ";font-size:12px;fill:var(--ink)" }, c.S[i]);
        gyAdd(svg, "text", { x: bx + 100 * v + 6, y: y + 18, style: pscTS + ";font-size:12px;fill:var(--ink)" }, pscF(v, 3)); });
      let st = ""; const irr = !c.P.some((r, i) => r[i] === 1);
      if (irr) { const s = pscStat(c.P); st = `<br>Στάσιμη κατανομή (λύση πP = π, Σπ = 1): π = (${s.map(v => pscF(v, 4)).join("; ")})`; }
      $(".wout", box).innerHTML = `Κατανομή της X<sub>${n}</sub> με X<sub>0</sub> = ${c.S[x0]}: π<sub>${n}</sub> = π<sub>0</sub>P<sup>${n}</sup> = (${pi.map(v => pscF(v, 4)).join("; ")}) — η γραμμή ${c.S[x0]} του P<sup>${n}</sup>${st}
        <br><span class="muted">${irr ? "Για μεγάλο n η κατανομή πλησιάζει τη στάσιμη, ανεξάρτητα από την αρχική κατάσταση (αν η αλυσίδα δεν «ταλαντεύεται» περιοδικά, όπως η Ehrenfest)." : "Οι καταστάσεις 0 και 3 είναι απορροφητικές: P(x, x) = 1. Οι 1, 2 είναι μεταβατικές."}</span>`;
    }
    $(".sc", box).oninput = fill; $(".s0", box).oninput = draw; $(".rn", box).oninput = draw; fill();
  },

  /* ---------- 6.3 τυχαίος περίπατος — καταστροφή παίκτη ---------- */
  pscwalk(box) {
    box.innerHTML = `<div class="wctl"><label>αρχικό κεφάλαιο k <input type="range" class="rk" min="1" max="19" value="5"><b class="vk"></b></label>
      <label>στόχος N <input type="range" class="rN" min="4" max="20" value="10"><b class="vN"></b></label>
      <label>p <input type="range" class="rp" min="30" max="70" value="50"><b class="vp"></b></label><button class="btn ghost bg">Νέες διαδρομές</button></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const N = +$(".rN", box).value; let k = +$(".rk", box).value; if (k >= N) { k = N - 1; $(".rk", box).value = k; }
      const p = +$(".rp", box).value / 100, q = 1 - p; $(".vk", box).textContent = k; $(".vN", box).textContent = N; $(".vp", box).textContent = pscF(p, 2);
      const win = Math.abs(p - 0.5) < 1e-9 ? k / N : (1 - (q / p) ** k) / (1 - (q / p) ** N);
      const paths = [], R = 400; let wins = 0, L = 0;
      for (let r = 0; r < R; r++) { let s = k; const pa = [s]; while (s > 0 && s < N && pa.length < 2000) { s += Math.random() < p ? 1 : -1; pa.push(s); } if (s === N) wins++; if (r < 12) paths.push(pa); L = Math.max(L, r < 12 ? pa.length : 0); }
      const P = makePlot($(".pl", box), { xmin: 0, xmax: Math.max(10, L), ymin: -1, ymax: N + 1, H: 250, xstep: niceStep(Math.max(10, L)), ystep: N > 10 ? 5 : 2 });
      P.seg(0, 0, L, 0, "axis"); P.seg(0, N, Math.max(10, L), N, "axis");
      paths.forEach((pa, j) => { let d = ""; pa.forEach((v, i) => d += (i ? "L" : "M") + P.sx(i).toFixed(1) + "," + P.sy(v).toFixed(1));
        P.layer.appendChild(svgEl("path", { d, style: `fill:none;stroke-width:1.6;stroke:${pa[pa.length - 1] === N ? "var(--blue)" : "#C2410C"};opacity:.75` })); });
      $(".wout", box).innerHTML = `P(φθάνει στο N = ${N} πριν από το 0) = <b>${pscF(win)}</b>${Math.abs(p - 0.5) < 1e-9 ? " = k/N" : " = (1 − (q/p)<sup>k</sup>)/(1 − (q/p)<sup>N</sup>)"} · P(καταστροφή) = <b>${pscF(1 - win)}</b>
        <br>Προσομοίωση ${R} παιχνιδιών: κέρδισε στο ${pscF(100 * wins / R, 1)}%${Math.abs(p - 0.5) < 1e-9 ? ` · αναμενόμενη διάρκεια k(N − k) = ${k * (N - k)}` : ""}
        <br><span class="muted">Μπλε: διαδρομές που έφθασαν στο N· κόκκινες: καταστροφή (απορρόφηση στο 0).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); $(".bg", box).onclick = draw; draw();
  },

  /* ---------- 6.4 ανέλιξη Poisson ---------- */
  pscpois(box) {
    box.innerHTML = `<div class="wctl"><label>ρυθμός λ <input type="range" class="rl" min="5" max="60" value="20"><b class="vl"></b></label><label>χρόνος T <input type="range" class="rT" min="2" max="10" value="5"><b class="vT"></b></label><button class="btn ghost bg">Νέα πραγματοποίηση</button></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const lam = +$(".rl", box).value / 10, T = +$(".rT", box).value; $(".vl", box).textContent = pscF(lam, 1); $(".vT", box).textContent = T;
      const arr = []; let t = -Math.log(1 - Math.random()) / lam; while (t < T) { arr.push(t); t += -Math.log(1 - Math.random()) / lam; }
      const P = makePlot($(".pl", box), { xmin: 0, xmax: T, ymin: -1, ymax: Math.max(4, arr.length + 2), H: 240, xstep: 1, ystep: niceStep(arr.length + 3) });
      let d = `M${P.sx(0)},${P.sy(0)}`, c = 0; arr.forEach(a => { d += `L${P.sx(a)},${P.sy(c)}`; c++; d += `L${P.sx(a)},${P.sy(c)}`; }); d += `L${P.sx(T)},${P.sy(c)}`;
      P.layer.appendChild(svgEl("path", { d, class: "curve c1" })); P.curve(x => lam * x, "c3", 0, T);
      arr.forEach(a => P.top.appendChild(svgEl("circle", { cx: P.sx(a), cy: P.sy(-0.5), r: 3.5, style: "fill:var(--amber)" })));
      const gaps = arr.map((a, i) => a - (i ? arr[i - 1] : 0)), mg = gaps.length ? gaps.reduce((s, v) => s + v, 0) / gaps.length : 0;
      $(".wout", box).innerHTML = `X(${T}) = <b>${arr.length}</b> γεγονότα · E(X(T)) = λT = <b>${pscF(lam * T, 1)}</b> (πορτοκαλί ευθεία) · X(T) ~ Poisson(λT)
        <br>Μέσος ενδιάμεσος χρόνος σε αυτή την πραγματοποίηση: ${gaps.length ? pscF(mg, 3) : "—"} · θεωρητικά 1/λ = ${pscF(1 / lam, 3)} (εκθετική E(λ))
        <br><span class="muted">P(X(T) = 0) = e<sup>−λT</sup> = ${Math.exp(-lam * T) < 1e-4 ? Math.exp(-lam * T).toExponential(2) : pscF(Math.exp(-lam * T))} · πορτοκαλί κουκκίδες: οι χρονικές στιγμές των γεγονότων.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); $(".bg", box).onclick = draw; draw();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  pscbirth: { title: "Γεννήτρια — γενέθλια και σφαίρες σε δοχεία", make() {
    const t = ri(0, 2);
    if (t === 0) { const [d, descr, same] = bkPick([[7, "η ημέρα της εβδομάδας που γεννήθηκε", "έχουν γεννηθεί την ίδια ημέρα της εβδομάδας"], [12, "ο μήνας γέννησής του", "έχουν γεννηθεί τον ίδιο μήνα"], [6, "η ένδειξη ενός ζαριού που ρίχνει", "φέρουν την ίδια ένδειξη"], [10, "το τελευταίο ψηφίο του τηλεφώνου του", "έχουν το ίδιο τελευταίο ψηφίο τηλεφώνου"]]), n = ri(3, Math.min(5, d - 1));
      const num = pscFall(d, n), den = d ** n, [a, b] = pscFr(den - num, den);
      return { q: R`Επιλέγουμε τυχαία $${n}$ άτομα· για το καθένα, ${descr} παίρνει ισοπίθανα μία από $${d}$ τιμές, ανεξάρτητα από τα άλλα άτομα. Ποια η πιθανότητα τουλάχιστον δύο να ${same};`,
        fields: [{ label: "P =", ans: pscFS(a, b), tol: 0.001 }], hint: R`Συμπληρωματικό: όλοι διαφορετικά, $\frac{(${d})_{${n}}}{${d}^{${n}}}$.`,
        sol: R`$P = 1 - \frac{${[...Array(n)].map((_, i) => d - i).join("\\cdot ")}}{${d}^{${n}}} = 1 - \frac{${num}}{${den}} = ${pscFT(den - num, den)} \approx ${pscK((den - num) / den)}$.` }; }
    if (t === 1) { const n = ri(3, 8), m = ri(4, 15), p = (1 - 1 / n) ** m, E = n * p;
      return { q: R`Ρίχνουμε $m = ${m}$ σφαίρες σε $n = ${n}$ δοχεία, κάθε σφαίρα ανεξάρτητα και ισοπίθανα σε οποιοδήποτε δοχείο. Να βρείτε την πιθανότητα ένα συγκεκριμένο δοχείο να μείνει κενό και τον αναμενόμενο αριθμό κενών δοχείων (με 4 δεκαδικά).`,
        fields: [{ label: "P(κενό) =", ans: pscR(p), tol: 0.0006 }, { label: "E(κενά) =", ans: pscR(E), tol: 0.0006 / Math.max(1, E) }], hint: R`Κάθε σφαίρα αποφεύγει το δοχείο με πιθανότητα $1 - \frac1n$· δείκτριες για το πλήθος.`,
        sol: R`$P = \left(1 - \frac1{${n}}\right)^{${m}} = ${pscK(p)}$. Με δείκτριες $X = \sum_{i=1}^{${n}} X_i$, $E(X) = ${n}\cdot ${pscK(p)} = ${pscK(E)}$.` }; }
    const m = ri(4, 8), n = ri(2, 4), k = ri(1, 3), pk = pscC(m, k) * (n - 1) ** (m - k), den = n ** m, [a, b] = pscFr(pk, den);
    return { q: R`Σε σύστημα με $${n}$ εξυπηρετητές, $${m}$ εργασίες ανατίθενται ανεξάρτητα και ισοπίθανα σε έναν εξυπηρετητή η καθεμία. Ποια η πιθανότητα ο εξυπηρετητής 1 να πάρει ακριβώς $${k}$ εργασ${k === 1 ? "ία" : "ίες"};`,
      fields: [{ label: "P =", ans: pscFS(a, b), tol: 0.001 }], hint: R`Ο αριθμός εργασιών του εξυπηρετητή 1 ακολουθεί $b\!\left(${m}, \frac1{${n}}\right)$.`,
      sol: R`$P = \binom{${m}}{${k}}\left(\frac1{${n}}\right)^{${k === 1 ? "" : k}}\left(\frac{${n - 1}}{${n}}\right)^{${m - k === 1 ? "" : m - k}} = \frac{${pk}}{${den}}${gcdI(pk, den) > 1 ? ` = ${pscFT(pk, den)}` : ""} \approx ${pscK(pk / den)}$.` };
  } },
  psccoup: { title: "Γεννήτρια — το πρόβλημα των κουπονιών", make() {
    const t = ri(0, 2), n = ri(3, 8);
    if (t === 0) { let num = 0, den = 1; for (let k = 1; k <= n; k++) { num = num * k + den; den *= k; const g = gcdI(num, den); num /= g; den /= g; }
      const [a, b] = pscFr(n * num, den);
      return { q: R`Υπάρχουν $n = ${n}$ διαφορετικά κουπόνια, ισοπίθανα σε κάθε κουτί. Πόσα κουτιά αναμένεται να χρειαστούμε για να συμπληρώσουμε τη σειρά;`,
        fields: [{ label: "E(X) =", ans: pscFS(a, b), tol: 0.001 }], hint: R`$E(X) = n\left(1 + \frac12 + \dots + \frac1n\right)$.`,
        sol: R`$E(X) = ${n}\left(${[...Array(n)].map((_, i) => i ? `\\frac1{${i + 1}}` : "1").join(" + ")}\right) = ${pscFT(a, b)} \approx ${pscK(a / b, 3)}$.` }; }
    if (t === 1) { const k = ri(1, n - 1), [a, b] = pscFr(n, n - k);
      return { q: R`Συλλέγουμε $${n}$ διαφορετικά κουπόνια και έχουμε ήδη $${k}$ διαφορετικά. Πόσα κουτιά αναμένεται να αγοράσουμε μέχρι να βρούμε ένα <b>νέο</b> κουπόνι;`,
        fields: [{ label: "E =", ans: pscFS(a, b), tol: 0.001 }], hint: R`Γεωμετρική με πιθανότητα επιτυχίας $p = \frac{${n} - ${k}}{${n}}$.`,
        sol: R`Κάθε κουτί δίνει νέο κουπόνι με πιθανότητα $p = ${pscFT(n - k, n)}$, άρα $E = \frac1p = ${pscFT(n, n - k)}$.` }; }
    const m = 3, b2 = ri(3, 5), sur = m ** b2 - 3 * 2 ** b2 + 3, [a, b] = pscFr(sur, m ** b2);
    return { q: R`Υπάρχουν $3$ διαφορετικά κουπόνια, ισοπίθανα σε κάθε κουτί. Ποια η πιθανότητα, αγοράζοντας $${b2}$ κουτιά, να έχουμε συμπληρώσει τη σειρά;`,
      fields: [{ label: "P =", ans: pscFS(a, b), tol: 0.001 }], hint: R`Εγκλεισμός–αποκλεισμός: αφαιρούμε τις περιπτώσεις όπου λείπει κάποιο κουπόνι.`,
      sol: R`Ευνοϊκές: $3^{${b2}} - 3\cdot 2^{${b2}} + 3\cdot 1 = ${sur}$ από $3^{${b2}} = ${m ** b2}$, άρα $P = ${pscFT(sur, m ** b2)} \approx ${pscK(sur / m ** b2)}$.` };
  } },
  pscind: { title: "Γεννήτρια — δείκτριες τυχαίες μεταβλητές", make() {
    const t = ri(0, 2);
    if (t === 0) { const n = ri(4, 14), [a, b] = pscFr(n * (n - 1), 4);
      return { q: R`Μια λίστα $${n}$ διαφορετικών αριθμών είναι σε τυχαία σειρά (όλες οι διατάξεις ισοπίθανες). Πόσες ανταλλαγές αναμένεται να κάνει ο αλγόριθμος Bubblesort;`,
        fields: [{ label: "E(X) =", ans: pscFS(a, b), tol: 0.001 }], hint: R`$E(X) = \binom n2\cdot\frac12$.`, sol: R`$E(X) = \binom{${n}}{2}\cdot\frac12 = \frac{${n}\cdot ${n - 1}}{4} = ${pscFT(n * (n - 1), 4)}$.` }; }
    if (t === 1) { const n = ri(10, 40), d = bkPick([365, 12, 7]), [a, b] = pscFr(n * (n - 1), 2 * d);
      return { q: R`Σε ομάδα $${n}$ ατόμων, με ${d === 365 ? "γενέθλια ισοπίθανα σε κάθε μία από τις 365 ημέρες" : d === 12 ? "μήνα γέννησης ισοπίθανο σε κάθε έναν από τους 12 μήνες" : "ημέρα γέννησης ισοπίθανη σε κάθε μία από τις 7 ημέρες της εβδομάδας"}. Ποιος είναι ο αναμενόμενος αριθμός <b>ζευγών</b> ατόμων με ${d === 365 ? "την ίδια ημέρα γενεθλίων" : d === 12 ? "τον ίδιο μήνα γέννησης" : "την ίδια ημέρα της εβδομάδας"};`,
        fields: [{ label: "E =", ans: pscFS(a, b), tol: 0.001 }], hint: R`Δείκτρια για κάθε ζεύγος: $P = \frac1{${d}}$.`,
        sol: R`$E = \binom{${n}}{2}\cdot\frac{1}{${d}} = \frac{${n * (n - 1) / 2}}{${d}} = ${pscFT(n * (n - 1), 2 * d)} \approx ${pscK(n * (n - 1) / (2 * d), 3)}$.` }; }
    const k = ri(6, 20), s = bkPick([4, 6, 8]), E = s * ((s - 1) / s) ** k;
    return { q: R`Ρίχνουμε ένα αμερόληπτο ζάρι με $${s}$ έδρες $${k}$ φορές. Ποιος είναι ο αναμενόμενος αριθμός ενδείξεων που <b>δεν</b> εμφανίζονται καθόλου (με 4 δεκαδικά);`,
      fields: [{ label: "E =", ans: pscR(E), tol: 0.0006 / Math.max(1, E) }], hint: R`Δείκτρια για κάθε ένδειξη: $P(\text{δεν εμφανίζεται}) = \left(\frac{${s - 1}}{${s}}\right)^{${k}}$.`,
      sol: R`$E = ${s}\left(\frac{${s - 1}}{${s}}\right)^{${k}} = ${pscK(E)}$ (γραμμικότητα της μέσης τιμής).` };
  } },
  pscineq: { title: "Γεννήτρια — ανισότητες Markov και Chebyshev", make() {
    const t = ri(0, 2);
    if (t === 0) { const mu = bkPick([10, 20, 30, 40, 50]), a = mu * bkPick([3, 4, 5, 8]) / 2 + bkPick([0, mu / 2]), [p, q] = pscFr(mu * 2, a * 2);
      return { q: R`Ο χρόνος $X$ (σε ms) εκτέλεσης μιας εργασίας είναι μη αρνητική τυχαία μεταβλητή με $E(X) = ${mu}$. Τι άνω φράγμα δίνει η ανισότητα Markov για την $P(X \ge ${a})$;`,
        fields: [{ label: "φράγμα =", ans: pscFS(p, q), tol: 0.001 }], hint: R`$P(X \ge a) \le \frac{E(X)}{a}$.`, sol: R`$P(X \ge ${a}) \le \frac{${mu}}{${a}} = ${pscFT(mu, a)}$.` }; }
    if (t === 1) { const mu = ri(5, 20) * 10, s = bkPick([2, 4, 5, 10]), e = s * bkPick([2, 3, 4, 5]), [p, q] = pscFr(s * s, e * e);
      return { q: R`Μια τυχαία μεταβλητή έχει $E(X) = ${mu}$ και $\text{Var}(X) = ${s * s}$. Με την ανισότητα Chebyshev, να βρείτε άνω φράγμα για την $P(|X - ${mu}| \ge ${e})$ και κάτω φράγμα για την $P(${mu - e} < X < ${mu + e})$.`,
        fields: [{ label: "άνω φράγμα =", ans: pscFS(p, q), tol: 0.001 }, { label: "κάτω φράγμα =", ans: pscFS(q - p, q), tol: 0.001 }], hint: R`$P(|X - \mu| \ge \varepsilon) \le \frac{\text{Var}(X)}{\varepsilon^2}$.`,
        sol: R`$P(|X - ${mu}| \ge ${e}) \le \frac{${s * s}}{${e * e}} = ${pscFT(s * s, e * e)}$, άρα $P(${mu - e} < X < ${mu + e}) \ge 1 - ${pscFT(s * s, e * e)} = ${pscFT(q - p, q)}$.` }; }
    const k = bkPick([2, 3, 4, 5, 10]);
    return { q: R`Για <b>οποιαδήποτε</b> τυχαία μεταβλητή με μέση τιμή $\mu$ και τυπική απόκλιση $\sigma > 0$, ποιο κάτω φράγμα δίνει η ανισότητα Chebyshev για την πιθανότητα $P(|X - \mu| < ${k}\sigma)$;`,
      fields: [{ label: "P ≥", ans: pscFS(k * k - 1, k * k), tol: 0.001 }], hint: R`$\varepsilon = ${k}\sigma$.`, sol: R`$P(|X - \mu| \ge ${k}\sigma) \le \frac{\sigma^2}{${k * k}\sigma^2} = \frac1{${k * k}}$, άρα $P(|X - \mu| < ${k}\sigma) \ge 1 - \frac1{${k * k}} = ${pscFT(k * k - 1, k * k)}$.` };
  } },
  pscmgf: { title: "Γεννήτρια — ροπογεννήτρια και φράγματα Chernoff", make() {
    const t = ri(0, 2);
    if (t === 0) { const n = ri(5, 20), p = bkPick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
      return { q: R`Η ροπογεννήτρια μιας τυχαίας μεταβλητής είναι $M_X(t) = (${pscK(1 - p, 2)} + ${pscK(p, 2)}e^t)^{${n}}$. Να βρείτε τα $E(X)$ και $\text{Var}(X)$.`,
        fields: [{ label: "E(X) =", ans: pscR(n * p, 4), tol: 0.001 }, { label: "Var(X) =", ans: pscR(n * p * (1 - p), 4), tol: 0.001 }], hint: R`Είναι η ροπογεννήτρια της $b(n, p)$.`,
        sol: R`$X \sim b(${n}, ${pscK(p, 2)})$, άρα $E(X) = np = ${pscK(n * p, 2)}$ και $\text{Var}(X) = np(1 - p) = ${pscK(n * p * (1 - p), 4)}$. (Ή: $M_X'(0) = np$.)` }; }
    if (t === 1) { const l = ri(2, 9);
      return { q: R`Αν $M_X(t) = e^{${l}(e^t - 1)}$, να βρείτε τα $E(X)$ και $E(X^2)$.`,
        fields: [{ label: "E(X) =", ans: l }, { label: "E(X²) =", ans: l * l + l }], hint: R`$X \sim \text{Poisson}(${l})$· $E(X^2) = M_X''(0)$.`,
        sol: R`$M_X'(t) = ${l}e^t M_X(t)$, άρα $E(X) = ${l}$. $M_X''(0) = ${l} + ${l}^2 = ${l * l + l}$ (Poisson: $\text{Var} = \lambda$, $E(X^2) = \lambda + \lambda^2$).` }; }
    const up = ri(0, 1) === 1; let n, e; do { n = bkPick([200, 400, 600, 1000, 2000]); e = bkPick([0.1, 0.2, 0.3]); } while (n / 2 * e * e / (up ? 3 : 2) > 6); const mu = n / 2, b = Math.exp(-mu * e * e / (up ? 3 : 2)), dev = mu * e;
    return { q: R`Ρίχνουμε ένα αμερόληπτο νόμισμα $${n}$ φορές και $X$ είναι ο αριθμός των κορωνών. Με το φράγμα Chernoff ${up ? R`$P(X - \mu > \mu\varepsilon) \le e^{-\mu\varepsilon^2/3}$` : R`$P(X - \mu < -\mu\varepsilon) \le e^{-\mu\varepsilon^2/2}$`}, να βρείτε άνω φράγμα για την $P(X ${up ? ">" : "<"} ${up ? mu + dev : mu - dev})$ (με 4 δεκαδικά).`,
      fields: [{ label: "φράγμα =", ans: pscR(b), tol: 0.0006 }], hint: R`$\mu = ${mu}$, $\mu\varepsilon = ${dev}$ ⇒ $\varepsilon = ${pscK(e, 1)}$.`,
      sol: R`$\mu = ${mu}$, $\varepsilon = ${pscK(e, 1)}$: $e^{-${mu}\cdot ${pscK(e * e, 2)}/${up ? 3 : 2}} = e^{-${pscK(mu * e * e / (up ? 3 : 2), 4)}} = ${pscK(b)}$.` };
  } },
  pscmc: { title: "Γεννήτρια — αλυσίδες Markov: πιθανότητες μετάβασης", make() {
    const a = ri(1, 8) / 10, b = ri(1, 8) / 10, P = [[1 - a, a], [b, 1 - b]], P2 = pscMul(P, P), t = ri(0, 2);
    if (t === 0) { const i = ri(0, 1), j = ri(0, 1), v = P2[i][j];
      return { q: R`Αλυσίδα Markov με καταστάσεις $\{0, 1\}$ έχει πίνακα μετάβασης $P = ${pscMat(P, 1)}$. Να βρείτε την $P^2(${i}, ${j}) = P(X_{n+2} = ${j} \mid X_n = ${i})$.`,
        fields: [{ label: "P²(" + i + "," + j + ") =", ans: pscR(v, 4), tol: 0.0006 }], hint: R`Chapman–Kolmogorov: $P^2(x, y) = \sum_z P(x, z)P(z, y)$.`,
        sol: R`$P^2(${i}, ${j}) = P(${i}, 0)P(0, ${j}) + P(${i}, 1)P(1, ${j}) = ${pscK(P[i][0], 1)}\cdot ${pscK(P[0][j], 1)} + ${pscK(P[i][1], 1)}\cdot ${pscK(P[1][j], 1)} = ${pscK(v, 2)}$.` }; }
    if (t === 1) { const p0 = ri(1, 9) / 10, pi1 = [p0 * P[0][0] + (1 - p0) * P[1][0], p0 * P[0][1] + (1 - p0) * P[1][1]];
      return { q: R`Αλυσίδα Markov με καταστάσεις $\{0, 1\}$ και $P = ${pscMat(P, 1)}$ έχει αρχική κατανομή $\pi_0 = (${pscK(p0, 1)};\ ${pscK(1 - p0, 1)})$. Να βρείτε την κατανομή $\pi_1$ της $X_1$.`,
        fields: [{ label: "P(X₁ = 0) =", ans: pscR(pi1[0], 4), tol: 0.0006 }, { label: "P(X₁ = 1) =", ans: pscR(pi1[1], 4), tol: 0.0006 }], hint: R`$\pi_1 = \pi_0 P$.`,
        sol: R`$P(X_1 = 0) = ${pscK(p0, 1)}\cdot ${pscK(P[0][0], 1)} + ${pscK(1 - p0, 1)}\cdot ${pscK(P[1][0], 1)} = ${pscK(pi1[0], 2)}$ και $P(X_1 = 1) = 1 - ${pscK(pi1[0], 2)} = ${pscK(pi1[1], 2)}$.` }; }
    const s = [ri(0, 1), ri(0, 1), ri(0, 1)], v = 0.5 * P[s[0]][s[1]] * P[s[1]][s[2]];
    return { q: R`Αλυσίδα Markov με καταστάσεις $\{0, 1\}$, $P = ${pscMat(P, 1)}$ και αρχική κατανομή $\pi_0 = (0{,}5;\ 0{,}5)$. Να βρείτε την $P(X_0 = ${s[0]}, X_1 = ${s[1]}, X_2 = ${s[2]})$.`,
      fields: [{ label: "P =", ans: pscR(v, 4), tol: 0.0006 }], hint: R`$\pi(x_0)P(x_0, x_1)P(x_1, x_2)$.`,
      sol: R`$P = 0{,}5\cdot P(${s[0]}, ${s[1]})\cdot P(${s[1]}, ${s[2]}) = 0{,}5\cdot ${pscK(P[s[0]][s[1]], 1)}\cdot ${pscK(P[s[1]][s[2]], 1)} = ${pscK(v, 3)}$.` };
  } },
  pscstat: { title: "Γεννήτρια — στάσιμες κατανομές", make() {
    const t = ri(0, 1);
    if (t === 0) { const a = ri(1, 9), b = ri(1, 9), P = [[1 - a / 10, a / 10], [b / 10, 1 - b / 10]];
      return { q: R`Αλυσίδα Markov με καταστάσεις $\{0, 1\}$ έχει πίνακα μετάβασης $P = ${pscMat(P, 1)}$. Να βρείτε τη στάσιμη κατανομή $\pi = (\pi(0), \pi(1))$.`,
        fields: [{ label: "π(0) =", ans: pscFS(b, a + b), tol: 0.001 }, { label: "π(1) =", ans: pscFS(a, a + b), tol: 0.001 }], hint: R`$\pi(0) = \pi(0)P(0, 0) + \pi(1)P(1, 0)$ και $\pi(0) + \pi(1) = 1$.`,
        sol: R`$\pi(0)\cdot ${pscK(a / 10, 1)} = \pi(1)\cdot ${pscK(b / 10, 1)}$ και $\pi(0) + \pi(1) = 1$, άρα $\pi(0) = \frac{${pscK(b / 10, 1)}}{${pscK((a + b) / 10, 1)}} = ${pscFT(b, a + b)}$, $\pi(1) = ${pscFT(a, a + b)}$.` }; }
    const [p, q] = bkPick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 7], [2, 5]]), d = p + q, x = ri(0, 3), num = (q - p) * p ** x, den = q ** (x + 1);
    return { q: R`Τυχαίος περίπατος στους μη αρνητικούς ακεραίους με $P(x, x + 1) = p = ${pscFT(p, d)}$ και $P(x, x - 1) = q = ${pscFT(q, d)}$ για $x \ge 1$, $P(0, 0) = q$, $P(0, 1) = p$. Να βρείτε τη στάσιμη πιθανότητα $\pi(${x})$.`,
      fields: [{ label: "π(" + x + ") =", ans: pscFS(num, den), tol: 0.001 }], hint: R`$\pi(x) = \left(1 - \frac pq\right)\left(\frac pq\right)^x$ για $p < q$.`,
      sol: R`$\frac pq = ${pscFT(p, q)}$, άρα $\pi(${x}) = \left(1 - ${pscFT(p, q)}\right)\left(${pscFT(p, q)}\right)^{${x}} = ${pscFT(num, den)}$.` };
  } },
  pscrw: { title: "Γεννήτρια — τυχαίος περίπατος και καταστροφή παίκτη", make() {
    const t = ri(0, 2);
    if (t === 0) { const n = bkPick([4, 6, 8]), k = bkPick([-2, 0, 2, 4].filter(v => Math.abs(v) <= n)), up = (n + k) / 2, c = pscC(n, up), den = 2 ** n;
      return { q: R`Συμμετρικός απλός τυχαίος περίπατος ξεκινά από το $0$ ($S_0 = 0$, βήματα $\pm1$ με πιθανότητα $\frac12$). Ποια η πιθανότητα $P(S_{${n}} = ${k})$;`,
        fields: [{ label: "P =", ans: pscFS(c, den), tol: 0.001 }], hint: R`Χρειάζονται $${up}$ βήματα πάνω και $${n - up}$ κάτω.`,
        sol: R`$P(S_{${n}} = ${k}) = \binom{${n}}{${up}}\frac{1}{2^{${n}}} = \frac{${c}}{${den}} = ${pscFT(c, den)}$.` }; }
    if (t === 1) { const N = ri(5, 15), k = ri(1, N - 1);
      return { q: R`Ένας παίκτης ξεκινά με $${k}$ ευρώ και σε κάθε γύρο κερδίζει ή χάνει $1$ ευρώ με πιθανότητα $\frac12$. Σταματά όταν φθάσει τα $${N}$ ευρώ ή χάσει όλα του τα χρήματα. Ποια η πιθανότητα να φθάσει τα $${N}$ ευρώ και ποια η αναμενόμενη διάρκεια του παιχνιδιού;`,
        fields: [{ label: "P(N) =", ans: pscFS(k, N), tol: 0.001 }, { label: "E(διάρκεια) =", ans: k * (N - k) }], hint: R`Για $p = \frac12$: $P = \frac kN$, $E(T) = k(N - k)$.`,
        sol: R`$P = \frac{${k}}{${N}}${gcdI(k, N) > 1 ? ` = ${pscFT(k, N)}` : ""}$ και $E(T) = ${k}\cdot ${N - k} = ${k * (N - k)}$ γύροι.` }; }
    const [pn, pd] = bkPick([[2, 5], [3, 5], [1, 3], [2, 3], [1, 4], [3, 4]]), N = ri(3, 5), k = ri(1, N - 1), r = (pd - pn) / pn, win = (1 - r ** k) / (1 - r ** N), rs = Number.isInteger(r) ? `${r}` : `\\left(${pscFT(pd - pn, pn)}\\right)`;
    return { q: R`Σε παιχνίδι ο παίκτης κερδίζει $1$ μονάδα με πιθανότητα $p = ${pscFT(pn, pd)}$ και χάνει $1$ με $q = ${pscFT(pd - pn, pd)}$. Ξεκινά με $${k}$ μονάδ${k === 1 ? "α" : "ες"} και σταματά στο $0$ ή στις $${N}$. Ποια η πιθανότητα να φθάσει τις $${N}$ μονάδες (με 4 δεκαδικά);`,
      fields: [{ label: "P =", ans: pscR(win), tol: 0.0006 }], hint: R`$P = \frac{1 - (q/p)^k}{1 - (q/p)^N}$ για $p \ne q$.`,
      sol: R`$\frac qp = ${pscFT(pd - pn, pn)}$, $P = \frac{1 - ${rs}^{${k}}}{1 - ${rs}^{${N}}} = ${pscK(win)}$.` };
  } },
  pscpp: { title: "Γεννήτρια — ανέλιξη Poisson", make() {
    const t = ri(0, 2), lam = ri(2, 12);
    if (t === 0) { const tt = bkPick([0.25, 0.5, 1, 2]), m = lam * tt; if (m > 8) return GENS.pscpp.make(); const k = ri(Math.max(0, Math.floor(m) - 2), Math.floor(m) + 2), p = pscPoi(k, m);
      return { q: R`Κλήσεις φθάνουν σε τηλεφωνικό κέντρο σύμφωνα με ανέλιξη Poisson με ρυθμό $\lambda = ${lam}$ ανά ώρα. Ποια η πιθανότητα σε διάστημα $${pscK(tt, 2)}$ ωρ${tt === 1 ? "ας" : "ών"} να φθάσουν ακριβώς $${k}$ κλήσεις (με 4 δεκαδικά);`,
        fields: [{ label: "P =", ans: pscR(p), tol: 0.0006 }], hint: R`$X(t) \sim \text{Poisson}(\lambda t)$, $\lambda t = ${pscK(m, 2)}$.`,
        sol: R`$P = e^{-${pscK(m, 2)}}\frac{${pscK(m, 2)}^{${k}}}{${k}!} = ${pscK(p)}$.` }; }
    if (t === 1) { const x = ri(2, 6), [a, b] = pscFr(x, lam), [c, d] = pscFr(x, lam * lam);
      return { q: R`Πελάτες φθάνουν σε κατάστημα σύμφωνα με ανέλιξη Poisson με ρυθμό $\lambda = ${lam}$ ανά ώρα. Αν $T_{${x}}$ είναι η χρονική στιγμή άφιξης του $${x}$ου πελάτη, να βρείτε τα $E(T_{${x}})$ και $\text{Var}(T_{${x}})$ (σε ώρες).`,
        fields: [{ label: "E(Tₓ) =", ans: pscFS(a, b), tol: 0.001 }, { label: "Var(Tₓ) =", ans: pscFS(c, d), tol: 0.001 }], hint: R`Άθροισμα $${x}$ ανεξάρτητων εκθετικών $\mathcal E(\lambda)$.`,
        sol: R`$E(T_{${x}}) = \frac{${x}}{\lambda} = ${pscFT(x, lam)}$ και $\text{Var}(T_{${x}}) = \frac{${x}}{\lambda^2} = ${pscFT(x, lam * lam)}$.` }; }
    const p = bkPick([0.2, 0.25, 0.3, 0.4, 0.6]), lp = lam * p, tt = bkPick([0.5, 1]), pr = Math.exp(-lp * tt); if (lp * tt > 4) return GENS.pscpp.make();
    return { q: R`Αυτοκίνητα φθάνουν σε διασταύρωση σύμφωνα με ανέλιξη Poisson με ρυθμό $${lam}$ ανά λεπτό· το καθένα στρίβει αριστερά με πιθανότητα $${pscK(p, 2)}$, ανεξάρτητα. Ποιος είναι ο ρυθμός των αυτοκινήτων που στρίβουν αριστερά και ποια η πιθανότητα σε $${pscK(tt, 1)}$ ${tt === 1 ? "λεπτό" : "λεπτά"} να μη στρίψει κανένα αριστερά (με 4 δεκαδικά);`,
      fields: [{ label: "ρυθμός =", ans: pscR(lp, 2), tol: 0.001 }, { label: "P =", ans: pscR(pr), tol: 0.0006 }], hint: R`Διάσπαση ανέλιξης Poisson: ρυθμός $\lambda p$.`,
      sol: R`Ρυθμός $${lam}\cdot ${pscK(p, 2)} = ${pscK(lp, 2)}$ ανά λεπτό. $P(X(${pscK(tt, 1)}) = 0) = e^{-${pscK(lp * tt, 2)}} = ${pscK(pr)}$.` };
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

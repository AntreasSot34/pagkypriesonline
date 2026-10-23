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
  storeKey: "pagk-b-gym-tefxos-b-v1",
  heroTitle: "Μαθηματικά Β΄ Γυμνασίου — Β΄ Τεύχος",
  tefxos: "Β΄ Τεύχους",
  howto: `<ul><li>Αριθμοί: <code>12</code> · κλάσματα: <code>3/4</code> ή <code>-5/6</code> · δεκαδικοί: <code>2,5</code></li>
    <li>Πολλά πεδία; Γράψε κάθε απάντηση στο δικό της πεδίο, με τη σειρά που ζητείται.</li>
    <li>Οι ενότητες με την ένδειξη «Εξεταστέα ύλη» περιλαμβάνονται στην ύλη της τελικής εξέτασης.</li></ul>`
};
const EXAM = `<div class="tbox tip"><h4>✓ Εξεταστέα ύλη</h4><p>Η παράγραφος περιλαμβάνεται στην εξεταστέα ύλη της ενιαίας τελικής γραπτής εξέτασης της Β΄ Γυμνασίου (2025–26).</p></div>`;
const NOEX = `<div class="tbox"><h4>Σημείωση</h4><p>Η παράγραφος διδάσκεται κανονικά, αλλά <b>δεν</b> περιλαμβάνεται στην εξεταστέα ύλη της τελικής γραπτής εξέτασης (2025–26). Είναι όμως βάση για όσα ακολουθούν.</p></div>`;
const NOPROG = `<div class="tbox"><h4>Σημείωση</h4><p>Η παράγραφος υπάρχει στο βιβλίο, αλλά <b>δεν</b> περιλαμβάνεται στον προγραμματισμό διδασκαλίας 2026–27 ούτε στην εξεταστέα ύλη. Δίνεται για εμπλουτισμό και για όσους τη διδάσκονται.</p></div>`;

const UNITS = [
  { id: 4, title: "Ενότητα 4 · Εξισώσεις – Ανισώσεις α΄ βαθμού" },
  { id: 5, title: "Ενότητα 5 · Συναρτήσεις" },
  { id: 6, title: "Ενότητα 6 · Επίπεδοι μετασχηματισμοί" },
  { id: 7, title: "Ενότητα 7 · Ευθέως – αντιστρόφως ανάλογα ποσά" },
  { id: 8, title: "Ενότητα 8 · Στατιστική – Πιθανότητες" }
];

const SECTIONS = [
/* ───────────────────────────── 4.1 ───────────────────────────── */
{
  id: "4.1", unit: 4, title: "Διερεύνηση εξίσωσης α΄ βαθμού με μία μεταβλητή",
  book: "Β΄ Τεύχος §4 · σελ. 9 · Δραστηριότητες σελ. 12",
  theory: NOEX + R`
<div class="tbox"><h4>Η εξίσωση $\alpha x = \beta$</h4>
<p>Κάθε εξίσωση της μορφής $\alpha x = \beta$ είναι εξίσωση <b>πρώτου βαθμού</b> με άγνωστο τον $x$. Μετά την απαλοιφή παρονομαστών και παρενθέσεων, τον χωρισμό γνωστών από αγνώστους και την αναγωγή ομοίων όρων, κάθε εξίσωση α΄ βαθμού παίρνει αυτή τη μορφή.</p></div>
<div class="tbox tip"><h4>Διερεύνηση</h4>
<ul><li>Αν $\alpha \ne 0$: <b>μοναδική λύση</b> $x = \dfrac{\beta}{\alpha}$. Π.χ. $2x = -4 \iff x = -2$.</li>
<li>Αν $\alpha = 0$ και $\beta \ne 0$: η εξίσωση $0x = \beta$ <b>δεν έχει λύση</b>, είναι <b>αδύνατη</b>. Π.χ. $0x = -3$.</li>
<li>Αν $\alpha = 0$ και $\beta = 0$: η εξίσωση $0x = 0$ έχει ως λύση <b>κάθε</b> πραγματικό αριθμό, είναι <b>αόριστη</b>.</li></ul></div>
<div class="tbox"><h4>Εξισώσεις με παράμετρο</h4>
<p>Για να βρούμε την παράμετρο $\lambda$ ώστε η $3(x - 1) = \lambda x - 1$ να είναι αδύνατη: $3x - \lambda x = 3 - 1 \iff (3 - \lambda)x = 2$. Πρέπει ο συντελεστής του $x$ να είναι μηδέν: $3 - \lambda = 0 \iff \lambda = 3$ (τότε $0x = 2$, αδύνατη).</p>
<p>Προσοχή: όταν ο συντελεστής του αγνώστου είναι $0$, <b>δεν</b> διαιρούμε με αυτόν.</p></div>`,
  widget: "h4eqdisc",
  gen: "h4disc",
  exercises: [
    { level: 1, type: "fields", q: R`Να λύσετε την εξίσωση $2x - 6 = 4x - 2$.`, fields: [{ label: "x =", ans: -2 }],
      hint: R`$2x - 4x = -2 + 6$.`, sol: R`$-2x = 4 \iff x = -2$. Μοναδική λύση, αφού ο συντελεστής $-2 \ne 0$.` },
    { level: 1, type: "mc", q: R`Η εξίσωση $3x + 5 = 3x - 3 + 8$:`, options: ["είναι αόριστη", "είναι αδύνατη", "έχει μοναδική λύση $x = 0$", "έχει μοναδική λύση $x = 1$"], correct: 0,
      hint: R`Χώρισε γνωστούς από αγνώστους.`, sol: R`$3x - 3x = -3 + 8 - 5 \iff 0x = 0$: κάθε αριθμός την επαληθεύει, είναι αόριστη.` },
    { level: 1, type: "mc", q: R`Η εξίσωση $5(x + 3) = 5x + 3$:`, options: ["είναι αδύνατη", "είναι αόριστη", "έχει μοναδική λύση", "έχει δύο λύσεις"], correct: 0,
      hint: R`Απαλοιφή παρένθεσης: $5x + 15 = 5x + 3$.`, sol: R`$5x - 5x = 3 - 15 \iff 0x = -12$: κανένας αριθμός δεν την επαληθεύει, είναι αδύνατη.` },
    { level: 1, type: "mc", q: R`Η εξίσωση $-3x = 0$ είναι αδύνατη.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ο συντελεστής του $x$ είναι $-3 \ne 0$.`, sol: R`Λάθος: έχει μοναδική λύση $x = \frac{0}{-3} = 0$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τον $\lambda$ ώστε να είναι αδύνατες οι εξισώσεις: (α) $(\lambda - 3)x = 7$, (β) $(\lambda + 2)x = -2014$.`,
      fields: [{ label: "(α) λ =", ans: 3 }, { label: "(β) λ =", ans: -2 }],
      hint: R`Μηδενίζουμε τον συντελεστή του $x$ (το β΄ μέλος είναι μη μηδενικό).`, sol: R`(α) $\lambda - 3 = 0 \iff \lambda = 3$, οπότε $0x = 7$. (β) $\lambda + 2 = 0 \iff \lambda = -2$, οπότε $0x = -2014$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τον $\lambda$ ώστε η εξίσωση $3x + \lambda x + 6 = 15 - 6x$ να είναι αδύνατη.`, fields: [{ label: "λ =", ans: -9 }],
      hint: R`Φέρε την εξίσωση στη μορφή $(\dots)x = \dots$`, sol: R`$3x + \lambda x + 6x = 15 - 6 \iff (9 + \lambda)x = 9$. Αδύνατη όταν $9 + \lambda = 0$, δηλαδή $\lambda = -9$ (τότε $0x = 9$).` },
    { level: 2, type: "fields", q: R`Να βρείτε τον $\alpha$ ώστε να είναι αόριστες οι εξισώσεις: (α) $\alpha x = 6x$, (β) $13x + 5 = 13x + \alpha$.`,
      fields: [{ label: "(α) α =", ans: 6 }, { label: "(β) α =", ans: 5 }],
      hint: R`Αόριστη: μορφή $0x = 0$.`, sol: R`(α) $(\alpha - 6)x = 0$, αόριστη για $\alpha = 6$. (β) $0x = \alpha - 5$, αόριστη για $\alpha = 5$.` },
    { level: 1, type: "mc", q: R`Η εξίσωση $\alpha x + 3 = 0$ δεν έχει λύση, αν:`, options: ["$\\alpha = 0$", "$\\alpha = -3$", "$\\alpha = 3$", "$\\alpha = 1$"], correct: 0,
      hint: R`$\alpha x = -3$.`, sol: R`$\alpha x = -3$: για $\alpha = 0$ γίνεται $0x = -3$, αδύνατη. Για κάθε άλλη τιμή έχει τη λύση $x = -\frac{3}{\alpha}$.` },
    { level: 3, type: "fields", q: R`Να βρείτε τους αριθμούς $\alpha$ και $\beta$ ώστε η εξίσωση $(\alpha - 4)x + 1 = 2\beta + 5$ να είναι αόριστη.`,
      fields: [{ label: "α =", ans: 4 }, { label: "β =", ans: -2 }],
      hint: R`$(\alpha - 4)x = 2\beta + 4$· και οι δύο πλευρές μηδέν.`, sol: R`$(\alpha - 4)x = 2\beta + 4$. Αόριστη όταν $\alpha - 4 = 0$ και $2\beta + 4 = 0$: $\alpha = 4$, $\beta = -2$.` }
  ]
},
/* ───────────────────────────── 4.2 ───────────────────────────── */
{
  id: "4.2", unit: 4, title: "Μετασχηματισμός τύπου",
  book: "Β΄ Τεύχος §4 · σελ. 14 · Δραστηριότητες σελ. 16",
  theory: NOEX + R`
<div class="tbox"><h4>Τι είναι</h4>
<p>Όταν μια σχέση συνδέει δύο ή περισσότερες μεταβλητές, μπορούμε να τη λύσουμε <b>ως προς</b> μία από αυτές, με τις τεχνικές επίλυσης εξίσωσης. Η διαδικασία ονομάζεται <b>μετασχηματισμός τύπου</b>.</p>
<p>Π.χ. το εμβαδόν ορθογωνίου $E = \alpha\cdot\beta$, λυμένο ως προς $\beta$: $\beta = \dfrac{E}{\alpha}$.</p></div>
<div class="tbox tip"><h4>Παράδειγμα: περίμετρος παραλληλογράμμου</h4>
<p>$\Pi = 2(\alpha + \beta) \Rightarrow \Pi = 2\alpha + 2\beta \Rightarrow \Pi - 2\alpha = 2\beta \Rightarrow \beta = \dfrac{\Pi - 2\alpha}{2}$.</p>
<p>Για $\Pi = 42$ cm και $\alpha = 10$ cm: $\beta = \dfrac{42 - 20}{2} = 11$ cm. Έτσι, με τον ίδιο μετασχηματισμένο τύπο υπολογίζουμε γρήγορα το $\beta$ για όσες τιμές θέλουμε.</p></div>
<div class="tbox"><h4>Θερμοκρασία</h4>
<p>$F = 1{,}8C + 32$ (βαθμοί Φαρενάιτ από βαθμούς Κελσίου). Ως προς $C$: $C = \dfrac{F - 32}{1{,}8}$. Π.χ. $30^\circ$C $= 86^\circ$F και $41^\circ$F $= 5^\circ$C.</p></div>`,
  widget: "h4formula",
  gen: "h4form",
  exercises: [
    { level: 1, type: "mc", q: R`Ο τύπος $y = 5x - 1$, λυμένος ως προς $x$, είναι:`, options: ["$x = \\dfrac{y + 1}{5}$", "$x = \\dfrac{y - 1}{5}$", "$x = 5y + 1$", "$x = \\dfrac{y}{5} - 1$"], correct: 0,
      hint: R`Πρώτα προσθέτουμε $1$, μετά διαιρούμε με $5$.`, sol: R`$y + 1 = 5x \Rightarrow x = \dfrac{y + 1}{5}$.` },
    { level: 1, type: "fields", q: R`Με τον τύπο $F = 1{,}8C + 32$: (α) πόσοι βαθμοί Φαρενάιτ είναι οι $30^\circ$C; (β) πόσοι βαθμοί Κελσίου είναι οι $41^\circ$F;`,
      fields: [{ label: "(α) °F =", ans: 86 }, { label: "(β) °C =", ans: 5 }],
      hint: R`(β) $C = \frac{F - 32}{1{,}8}$.`, sol: R`(α) $1{,}8\cdot 30 + 32 = 54 + 32 = 86^\circ$F. (β) $C = \dfrac{41 - 32}{1{,}8} = \dfrac{9}{1{,}8} = 5^\circ$C.` },
    { level: 1, type: "mc", q: R`Ο τύπος $S = u\cdot t$ λυμένος ως προς $u$ είναι:`, options: ["$u = \\dfrac{S}{t}$", "$u = S - t$", "$u = S\\cdot t$", "$u = \\dfrac{t}{S}$"], correct: 0,
      hint: R`Διαιρούμε και τα δύο μέλη με $t$.`, sol: R`$u = \dfrac{S}{t}$.` },
    { level: 2, type: "fields", q: R`Το εμβαδόν τραπεζίου είναι $E = \dfrac{(\beta + B)\upsilon}{2}$. Να βρείτε το ύψος $\upsilon$ ενός τραπεζίου με εμβαδόν $60\ m^2$ και βάσεις $8$ m και $12$ m.`,
      fields: [{ label: "υ (m) =", ans: 6 }],
      hint: R`$\upsilon = \dfrac{2E}{\beta + B}$.`, sol: R`$2E = (\beta + B)\upsilon \Rightarrow \upsilon = \dfrac{2E}{\beta + B} = \dfrac{120}{20} = 6$ m.` },
    { level: 2, type: "fields", q: R`Οι ημέρες χιονόπτωσης $A$ ενός τόπου δίνονται κατά προσέγγιση από τον τύπο $A = 0{,}155\upsilon + 11$, όπου $\upsilon$ το υψόμετρο σε m. (α) Πόσες ημέρες χιονίζει σε παραθαλάσσιο τόπο ($\upsilon = 0$); (β) Σε ποιο υψόμετρο χιονίζει $42$ ημέρες;`,
      fields: [{ label: "(α) ημέρες =", ans: 11 }, { label: "(β) υ (m) =", ans: 200 }],
      hint: R`$\upsilon = \dfrac{A - 11}{0{,}155}$.`, sol: R`(α) $A = 11$. (β) $\upsilon = \dfrac{42 - 11}{0{,}155} = \dfrac{31}{0{,}155} = 200$ m.` },
    { level: 2, type: "mc", q: R`Ο τύπος $2x - 5y = 1$ λυμένος ως προς $y$ είναι:`, options: ["$y = \\dfrac{2x - 1}{5}$", "$y = \\dfrac{1 - 2x}{5}$", "$y = \\dfrac{2x + 1}{5}$", "$y = 2x - 6$"], correct: 0,
      hint: R`$-5y = 1 - 2x$, μετά διαίρεση με $-5$.`, sol: R`$-5y = 1 - 2x \Rightarrow y = \dfrac{1 - 2x}{-5} = \dfrac{2x - 1}{5}$.` },
    { level: 3, type: "mc", q: R`Ο τύπος $2\alpha - 3\gamma + \beta = 0$ λυμένος ως προς $\gamma$ είναι:`, options: ["$\\gamma = \\dfrac{2\\alpha + \\beta}{3}$", "$\\gamma = \\dfrac{\\beta - 2\\alpha}{3}$", "$\\gamma = 2\\alpha + \\beta - 3$", "$\\gamma = \\dfrac{2\\alpha - \\beta}{3}$"], correct: 0,
      hint: R`Μεταφέρουμε το $-3\gamma$ στο άλλο μέλος.`, sol: R`$2\alpha + \beta = 3\gamma \Rightarrow \gamma = \dfrac{2\alpha + \beta}{3}$.` },
    { level: 1, type: "fields", q: R`Ένα αυτοκίνητο κινείται με σταθερή ταχύτητα. Με τον τύπο $S = u\cdot t$ να βρείτε: (α) τον χρόνο $t$ (h) για $S = 60$ km με $u = 15$ km/h, (β) την ταχύτητα $u$ (km/h) για $S = 75$ km σε $t = 3$ h.`,
      fields: [{ label: "(α) t =", ans: 4 }, { label: "(β) u =", ans: 25 }],
      hint: R`$t = \frac{S}{u}$, $u = \frac{S}{t}$.`, sol: R`(α) $t = \frac{60}{15} = 4$ h. (β) $u = \frac{75}{3} = 25$ km/h.` }
  ]
},
/* ───────────────────────────── 4.3 ───────────────────────────── */
{
  id: "4.3", unit: 4, title: "Ιδιότητες ανισοτήτων",
  book: "Β΄ Τεύχος §4 · σελ. 18 · Δραστηριότητες σελ. 21",
  theory: EXAM + R`
<div class="tbox"><h4>Πρόσθεση του ίδιου αριθμού</h4>
<p>Αν και στα δύο μέλη μιας ανισότητας προσθέσουμε (ή αφαιρέσουμε) τον ίδιο αριθμό, προκύπτει ανισότητα με την <b>ίδια φορά</b>:</p>
$$A < B \iff A + \Gamma < B + \Gamma$$
<p>Π.χ. $5 > 3 \Rightarrow 5 + (-4) > 3 + (-4)$, δηλαδή $1 > -1$.</p></div>
<div class="tbox tip"><h4>Πολλαπλασιασμός με τον ίδιο αριθμό</h4>
<ul><li>Με <b>θετικό</b> αριθμό: η φορά <b>διατηρείται</b>. Αν $A < B$ και $\Gamma > 0$, τότε $A\Gamma < B\Gamma$.</li>
<li>Με <b>αρνητικό</b> αριθμό: η φορά <b>αλλάζει</b>. Αν $A < B$ και $\Gamma < 0$, τότε $A\Gamma > B\Gamma$.</li></ul>
<p>Π.χ. $8 > 6$, επί $-\frac12$: $-4 < -3$. Το ίδιο ισχύει και για τη διαίρεση (διαίρεση με $\Gamma$ = πολλαπλασιασμός με $\frac1\Gamma$).</p></div>
<div class="tbox"><h4>Παραδείγματα</h4>
<p>Αν $x < 5$, τότε $4x < 20$ και $4x + 1 < 21$. &nbsp; Αν $\alpha > 2$, τότε $\alpha - 1 > 1$ και $\dfrac{\alpha - 1}{-2} < -\dfrac12$ (διαίρεση με αρνητικό).</p></div>`,
  widget: "h4ineqprop",
  gen: "h4prop",
  exercises: [
    { level: 1, type: "mc", q: R`Αν $x < 3$, τότε:`, options: ["$x + 3 < 6$", "$x + 3 > 6$", "$x + 3 = 6$", "$x + 3 \\ge 6$"], correct: 0,
      hint: R`Προσθέτουμε $3$ και στα δύο μέλη.`, sol: R`Η πρόσθεση διατηρεί τη φορά: $x + 3 < 6$.` },
    { level: 1, type: "mc", q: R`Αν $x \le 6$, τότε:`, options: ["$\\dfrac{x}{-3} \\ge -2$", "$\\dfrac{x}{-3} \\le -2$", "$\\dfrac{x}{-3} \\ge 2$", "$\\dfrac{x}{-3} \\le 2$"], correct: 0,
      hint: R`Διαίρεση με αρνητικό.`, sol: R`Διαιρούμε με $-3$ (αρνητικό), η φορά αλλάζει: $\frac{x}{-3} \ge \frac{6}{-3} = -2$.` },
    { level: 1, type: "mc", q: R`Αν $\alpha < \beta$, τότε $-\alpha < -\beta$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Πολλαπλασιασμός επί $-1$.`, sol: R`Λάθος: επί $-1$ η φορά αλλάζει, $-\alpha > -\beta$. Π.χ. $2 < 5$ αλλά $-2 > -5$.` },
    { level: 2, type: "mc", q: R`Αν $\alpha < 0$, τότε $2\alpha < \alpha$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Πρόσθεσε $\alpha$ και στα δύο μέλη της $\alpha < 0$.`, sol: R`Σωστό: από $\alpha < 0$, προσθέτοντας $\alpha$: $\alpha + \alpha < 0 + \alpha$, δηλαδή $2\alpha < \alpha$. (Π.χ. $-6 < -3$.)` },
    { level: 2, type: "mc", q: R`Αν $\alpha < \beta$ και $\gamma < 0$, τότε:`, options: ["$\\alpha\\gamma > \\beta\\gamma$", "$\\alpha\\gamma < \\beta\\gamma$", "$\\alpha\\gamma = \\beta\\gamma$", "$\\alpha + \\gamma > \\beta + \\gamma$"], correct: 0,
      hint: R`Πολλαπλασιασμός με αρνητικό.`, sol: R`Επί $\gamma < 0$ η φορά αλλάζει: $\alpha\gamma > \beta\gamma$. (Η πρόσθεση του $\gamma$ θα έδινε $\alpha + \gamma < \beta + \gamma$.)` },
    { level: 1, type: "fields", q: R`Από την $x < 5$, πολλαπλασιάζοντας επί $4$ και προσθέτοντας $1$, προκύπτει $4x + 1 < \kappa$. Να βρείτε τον $\kappa$. Από την $x \ge -2$, πολλαπλασιάζοντας επί $2$, προκύπτει $2x \ge \mu$. Να βρείτε τον $\mu$.`,
      fields: [{ label: "κ =", ans: 21 }, { label: "μ =", ans: -4 }],
      hint: R`Επί $4$ και μετά $+1$· επί $2$.`, sol: R`$4x < 20 \Rightarrow 4x + 1 < 21$, άρα $\kappa = 21$. $2x \ge -4$, άρα $\mu = -4$.` },
    { level: 2, type: "mc", q: R`Αν $x < 7$, τότε:`, options: ["$-3x > -21$", "$-3x < -21$", "$-3x > 21$", "$-3x < 21$"], correct: 0,
      hint: R`Επί $-3$.`, sol: R`Επί $-3$ (αρνητικό) η φορά αλλάζει: $-3x > -21$.` },
    { level: 3, type: "fields", q: R`<i>(Εμπλουτισμός)</i> Αν $-1 < x < 4$, πολλαπλασιάζοντας κάθε μέλος επί $2$ και αφαιρώντας $3$ προκύπτει $\kappa < 2x - 3 < \lambda$. Να βρείτε τους $\kappa$ και $\lambda$.`,
      fields: [{ label: "κ =", ans: -5 }, { label: "λ =", ans: 5 }],
      hint: R`Επί $2$ και στη συνέχεια $-3$ σε όλα τα μέλη.`, sol: R`$-2 < 2x < 8 \Rightarrow -2 - 3 < 2x - 3 < 8 - 3$, δηλαδή $-5 < 2x - 3 < 5$.` },
    { level: 2, type: "mc", q: R`Αν $\alpha > \beta > 0$, τότε $\alpha^2 > \alpha\beta$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Πολλαπλασίασε την $\alpha > \beta$ με τον θετικό $\alpha$.`, sol: R`Σωστό: $\alpha > 0$, οπότε επί $\alpha$ η φορά διατηρείται: $\alpha\cdot\alpha > \beta\cdot\alpha$.` }
  ]
},
/* ───────────────────────────── 4.4 ───────────────────────────── */
{
  id: "4.4", unit: 4, title: "Ανισώσεις α΄ βαθμού",
  book: "Β΄ Τεύχος §4 · σελ. 23 · Δραστηριότητες σελ. 27",
  theory: EXAM + R`
<div class="tbox"><h4>Ανίσωση και λύσεις</h4>
<p>Η ανισότητα που περιέχει μεταβλητή ονομάζεται <b>ανίσωση</b>, π.χ. $2x + 1 > 7$. <b>Λύση</b> της είναι κάθε τιμή της μεταβλητής που την επαληθεύει. Η διαδικασία εύρεσης όλων των λύσεων λέγεται <b>επίλυση</b>: $2x + 1 > 7 \iff 2x > 6 \iff x > 3$.</p>
<p>Στην ευθεία των πραγματικών αριθμών: <b>κενός κύκλος</b> ∘ στο $\alpha$ όταν το $\alpha$ <b>δεν</b> ανήκει στη λύση ($<$, $>$), <b>γεμάτος κύκλος</b> • όταν ανήκει ($\le$, $\ge$). Στο σύμβολο του διαστήματος, στη μεριά του $+\infty$ ή του $-\infty$ η αγκύλη είναι <b>πάντα ανοικτή</b>, π.χ. $[3, +\infty)$.</p></div>
<div class="tbox tip"><h4>Βήματα επίλυσης</h4>
<ol><li>Απαλείφουμε παρονομαστές και παρενθέσεις.</li><li>Χωρίζουμε γνωστούς από αγνώστους.</li><li>Κάνουμε αναγωγή ομοίων όρων.</li>
<li>Διαιρούμε με τον συντελεστή του αγνώστου: αν είναι <b>θετικός</b>, η φορά <b>μένει ίδια</b>· αν είναι <b>αρνητικός</b>, η φορά <b>αλλάζει</b>.</li></ol>
<p>Π.χ. $2x - 4 \le 4x + 7 \iff -2x \le 11 \iff x \ge -\dfrac{11}{2}$.</p></div>
<div class="tbox"><h4>Ειδικές περιπτώσεις</h4>
<p>$3y - 5 + y > 4y + 3 \iff 0y > 8$: <b>αδύνατη</b>. &nbsp; $3x - 5 + x < 4x + 3 \iff 0x < 8$: αληθεύει για <b>κάθε</b> τιμή του $x$.</p></div>`,
  widget: "h4ineq",
  gen: "h4ineq",
  exercises: [
    { level: 1, type: "mc", q: R`Η λύση της ανίσωσης $3x - 9 < 0$ είναι:`, options: ["$x < 3$", "$x > 3$", "$x < -3$", "$x \\le 3$"], correct: 0,
      hint: R`$3x < 9$.`, sol: R`$3x < 9 \iff x < 3$ (διαιρέσαμε με θετικό).` },
    { level: 1, type: "fields", q: R`Ποιος είναι ο μικρότερος ακέραιος αριθμός που είναι λύση της ανίσωσης $-7x < 21$;`, fields: [{ label: "=", ans: -2 }],
      hint: R`Διαίρεση με $-7$: η φορά αλλάζει.`, sol: R`$x > -3$. Το $-3$ δεν ανήκει στις λύσεις, άρα ο μικρότερος ακέραιος είναι ο $-2$.` },
    { level: 2, type: "mc", q: R`Η λύση της ανίσωσης $2x - 4 \le 4x + 7$ είναι:`, options: ["$x \\ge -\\dfrac{11}{2}$", "$x \\le -\\dfrac{11}{2}$", "$x \\ge \\dfrac{11}{2}$", "$x > -\\dfrac{11}{2}$"], correct: 0,
      hint: R`$-2x \le 11$.`, sol: R`$2x - 4x \le 7 + 4 \iff -2x \le 11 \iff x \ge -\frac{11}{2}$ (διαιρέσαμε με $-2$, άρα η φορά άλλαξε).` },
    { level: 2, type: "mc", q: R`Η λύση της ανίσωσης $1 - 3(x - 2) \le 10$ είναι:`, options: ["$x \\ge -1$", "$x \\le -1$", "$x \\ge 1$", "$x \\le 1$"], correct: 0,
      hint: R`$1 - 3x + 6 \le 10$.`, sol: R`$-3x \le 10 - 7 = 3 \iff x \ge -1$.` },
    { level: 1, type: "mc", q: R`Η ανίσωση $3y - 5 + y > 4y + 3$:`, options: ["είναι αδύνατη", "αληθεύει για κάθε $y$", "έχει λύση $y > 8$", "έχει λύση $y > 2$"], correct: 0,
      hint: R`Αναγωγή ομοίων όρων.`, sol: R`$3y + y - 4y > 3 + 5 \iff 0y > 8$: καμία τιμή δεν την επαληθεύει, είναι αδύνατη.` },
    { level: 2, type: "fields", q: R`Η μηνιαία κάρτα λεωφορείου κοστίζει €36, ενώ μία απλή διαδρομή €1,60. Πόσες τουλάχιστον διαδρομές τον μήνα πρέπει να κάνει κάποιος, ώστε να τον συμφέρει η κάρτα;`,
      fields: [{ label: "διαδρομές =", ans: 23 }],
      hint: R`$1{,}6x > 36$.`, sol: R`$1{,}6x > 36 \iff x > 22{,}5$. Άρα τουλάχιστον $23$ διαδρομές.` },
    { level: 2, type: "fields", q: R`Μια δεξαμενή χωρητικότητας $48\ m^3$ είναι άδεια και γεμίζει με ρυθμό $2{,}5\ m^3$ την ώρα. Πόσες ώρες το πολύ μπορεί να μείνει ανοιχτή η παροχή, χωρίς να υπερχειλίσει η δεξαμενή;`,
      fields: [{ label: "ώρες =", ans: 19.2 }],
      hint: R`$2{,}5t \le 48$.`, sol: R`$2{,}5t \le 48 \iff t \le 19{,}2$ ώρες.` },
    { level: 3, type: "fields", q: R`Ένας υπάλληλος έχει σταθερό μισθό €700 και παίρνει προμήθεια $8\%$ πάνω στις πωλήσεις του. Ποιο είναι το ελάχιστο ποσό πωλήσεων (€) ώστε ο μηνιαίος μισθός του να είναι τουλάχιστον €2300;`,
      fields: [{ label: "πωλήσεις (€) =", ans: 20000 }],
      hint: R`$700 + 0{,}08x \ge 2300$.`, sol: R`$0{,}08x \ge 1600 \iff x \ge 20000$ €.` },
    { level: 3, type: "mc", q: R`Η λύση της ανίσωσης $\dfrac{3(\alpha - 4)}{5} - \dfrac{5\alpha - 1}{10} > \dfrac{5 + \alpha}{3}$ είναι:`, options: ["$\\alpha < -17$", "$\\alpha > -17$", "$\\alpha < 17$", "$\\alpha > 17$"], correct: 0,
      hint: R`ΕΚΠ $30$.`, sol: R`$18(\alpha - 4) - 3(5\alpha - 1) > 10(5 + \alpha) \iff 18\alpha - 72 - 15\alpha + 3 > 50 + 10\alpha \iff -7\alpha > 119 \iff \alpha < -17$.` },
    { level: 3, type: "mc", q: R`Για ποιες τιμές του $x$ ορίζεται η παράσταση $\sqrt{20 - 5x}$;`, options: ["$x \\le 4$", "$x \\ge 4$", "$x < 4$", "$x \\ge -4$"], correct: 0,
      hint: R`Η υπόρριζη ποσότητα πρέπει να είναι μη αρνητική.`, sol: R`$20 - 5x \ge 0 \iff -5x \ge -20 \iff x \le 4$.` }
  ]
},
/* ───────────────────────────── 4.5 ───────────────────────────── */
{
  id: "4.5", unit: 4, title: "Συναλήθευση ανισώσεων – Διαστήματα",
  book: "Β΄ Τεύχος §4 · σελ. 29 · Δραστηριότητες σελ. 33 · Ενότητας σελ. 37",
  theory: EXAM + R`
<div class="tbox"><h4>Διαστήματα</h4>
<p>Το σύνολο των λύσεων μιας ανίσωσης γράφεται με τη μορφή <b>διαστήματος</b>:</p>
<ul><li>$x > \alpha$: $x \in (\alpha, +\infty)$ &nbsp;·&nbsp; $x \ge \alpha$: $x \in [\alpha, +\infty)$</li>
<li>$x < \alpha$: $x \in (-\infty, \alpha)$ &nbsp;·&nbsp; $x \le \alpha$: $x \in (-\infty, \alpha]$</li>
<li>$\alpha \le x \le \beta$ (διπλή ανίσωση): $x \in [\alpha, \beta]$ &nbsp;·&nbsp; $\alpha < x < \beta$: $x \in (\alpha, \beta)$ &nbsp;·&nbsp; $\alpha \le x < \beta$: $[\alpha, \beta)$</li></ul>
<p>Οι $\alpha$, $\beta$ λέγονται <b>άκρα</b>. Αγκύλη $[\ ]$: το άκρο <b>ανήκει</b> (κλειστό διάστημα στο άκρο αυτό). Παρένθεση $(\ )$: το άκρο <b>δεν</b> ανήκει (ανοικτό). Στο $\pm\infty$ βάζουμε πάντα παρένθεση. Π.χ. το $[0, 9)$ είναι κλειστό αριστερά και ανοικτό δεξιά.</p></div>
<div class="tbox tip"><h4>Συναλήθευση</h4>
<p>Για τις <b>κοινές λύσεις</b> δύο ανισώσεων: λύνουμε την καθεμιά χωριστά, παριστάνουμε τις λύσεις στην ίδια ευθεία των πραγματικών αριθμών και κρατάμε το κοινό μέρος.</p>
<p>Π.χ. $2x - 1 \ge x - 2 \iff x \ge -1$ και $\dfrac{x + 6}{3} < 3 \iff x < 3$. Κοινές λύσεις: $-1 \le x < 3$, δηλαδή $x \in [-1, 3)$.</p>
<p>Αν οι λύσεις δεν έχουν κοινό μέρος (π.χ. $x < -3$ και $x \ge -1$), οι ανισώσεις <b>δεν έχουν κοινές λύσεις</b>.</p></div>`,
  widget: "h4inter",
  gen: "h4inter",
  exercises: [
    { level: 1, type: "mc", q: R`Οι κοινές λύσεις των ανισώσεων $x < 5$ και $x \ge -2$ είναι:`, options: ["$[-2, 5)$", "$(-2, 5]$", "$(-2, 5)$", "$[-2, 5]$"], correct: 0,
      hint: R`Το $-2$ ανήκει, το $5$ όχι.`, sol: R`$-2 \le x < 5$, δηλαδή $x \in [-2, 5)$.` },
    { level: 1, type: "mc", q: R`Οι ανισώσεις $x < -3$ και $x \ge -1$:`, options: ["δεν έχουν κοινές λύσεις", "έχουν κοινές λύσεις το $[-3, -1)$", "έχουν κοινές λύσεις το $(-3, -1]$", "αληθεύουν για κάθε $x$"], correct: 0,
      hint: R`Σχεδίασε τις δύο ακτίνες.`, sol: R`Η μία ακτίνα είναι αριστερά του $-3$ και η άλλη από το $-1$ και δεξιά: δεν έχουν κοινό μέρος.` },
    { level: 1, type: "mc", q: R`Η σχέση $x \in (2, 7)$ γράφεται με ανισώσεις:`, options: ["$2 < x < 7$", "$2 \\le x \\le 7$", "$2 \\le x < 7$", "$x < 2$ ή $x > 7$"], correct: 0,
      hint: R`Παρενθέσεις: τα άκρα δεν ανήκουν.`, sol: R`Ανοικτό και στα δύο άκρα: $2 < x < 7$.` },
    { level: 2, type: "mc", q: R`Οι κοινές λύσεις των ανισώσεων $2x - 1 \ge x - 2$ και $\dfrac{x + 6}{3} < 3$ είναι:`, options: ["$[-1, 3)$", "$(-1, 3]$", "$[-1, +\\infty)$", "$(-\\infty, 3)$"], correct: 0,
      hint: R`$x \ge -1$ και $x < 3$.`, sol: R`$2x - x \ge 1 - 2 \iff x \ge -1$. $x + 6 < 9 \iff x < 3$. Κοινές λύσεις: $x \in [-1, 3)$.` },
    { level: 2, type: "fields", q: R`Δίνονται οι ανισώσεις $3x - 4 \ge x - 2$ και $2x + 3 < 13$. Ποια είναι η μικρότερη τιμή του $x$ που ικανοποιεί και τις δύο και ποια η μεγαλύτερη ακέραια;`,
      fields: [{ label: "μικρότερη =", ans: 1 }, { label: "μεγαλύτερη ακέραια =", ans: 4 }],
      hint: R`$x \ge 1$ και $x < 5$.`, sol: R`$2x \ge 2 \iff x \ge 1$, $2x < 10 \iff x < 5$. Κοινές λύσεις $[1, 5)$: μικρότερη τιμή $1$, μεγαλύτερη ακέραια $4$.` },
    { level: 2, type: "fields", q: R`Πόσες κοινές <b>ακέραιες</b> λύσεις έχουν οι ανισώσεις $2x - 5 < 1$ και $5 + x > 4$;`, fields: [{ label: "πλήθος =", ans: 3 }],
      hint: R`$x < 3$ και $x > -1$.`, sol: R`$-1 < x < 3$: ακέραιοι $0, 1, 2$, δηλαδή $3$ λύσεις.` },
    { level: 2, type: "fields", q: R`Ένας φωτογράφος έχει βασικό μισθό €500 και €20 για κάθε φωτογραφία που δημοσιεύεται. Ο μισθός του πρέπει να είναι μεγαλύτερος από €1200 και το πολύ €2250. Ποιος είναι ο ελάχιστος και ποιος ο μέγιστος αριθμός φωτογραφιών;`,
      fields: [{ label: "ελάχιστος =", ans: 36 }, { label: "μέγιστος =", ans: 87 }],
      hint: R`$1200 < 500 + 20x \le 2250$.`, sol: R`$20x > 700 \iff x > 35$ και $20x \le 1750 \iff x \le 87{,}5$. Άρα από $36$ μέχρι $87$ φωτογραφίες.` },
    { level: 2, type: "mc", q: R`Ένας πιλότος πρέπει να πετά πάνω από $33000$ πόδια ή κάτω από $26000$ πόδια. Ποιο διάστημα υψών πρέπει να αποφύγει;`, options: ["$[26000, 33000]$", "$(26000, 33000)$", "$(-\\infty, 26000)$", "$(33000, +\\infty)$"], correct: 0,
      hint: R`Επιτρέπεται μόνο $h > 33000$ ή $h < 26000$.`, sol: R`Απαγορεύονται τα ύψη με $26000 \le h \le 33000$, δηλαδή το $[26000, 33000]$ (τα άκρα δεν είναι ούτε «πάνω από» ούτε «κάτω από»).` },
    { level: 3, type: "fields", q: R`Ένας φυσικός αριθμός, όταν διαιρεθεί με το $15$, αφήνει υπόλοιπο $3$. Να βρείτε τον αριθμό, αν είναι μεγαλύτερος του $310$ και μικρότερος του $323$.`, fields: [{ label: "=", ans: 318 }],
      hint: R`Ο αριθμός είναι $15\kappa + 3$ με $310 < 15\kappa + 3 < 323$.`, sol: R`$307 < 15\kappa < 320 \iff 20{,}4\dots < \kappa < 21{,}3\dots$, άρα $\kappa = 21$ και ο αριθμός είναι $15\cdot 21 + 3 = 318$.` },
    { level: 1, type: "mc", q: R`Το διάστημα $[0, 9)$ είναι κλειστό αριστερά και ανοικτό δεξιά.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Αγκύλη: το άκρο ανήκει.`, sol: R`Σωστό: το $0$ ανήκει (αγκύλη), το $9$ δεν ανήκει (παρένθεση).` }
  ]
},
/* ───────────────────────────── 5.1 ───────────────────────────── */
{
  id: "5.1", unit: 5, title: "Η έννοια της αντιστοιχίας – συνάρτησης",
  book: "Β΄ Τεύχος §5 · σελ. 43 · Δραστηριότητες σελ. 49",
  theory: NOEX + R`
<div class="tbox"><h4>Αντιστοιχία και συνάρτηση</h4>
<p><b>Αντιστοιχία</b> είναι ένας κανόνας που συνδέει στοιχεία ενός συνόλου με στοιχεία ενός άλλου συνόλου. Τη συμβολίζουμε συνήθως με λατινικό γράμμα: $f, g, h, \dots$</p>
<p><b>Συνάρτηση</b> από ένα σύνολο $A$ σε ένα σύνολο $B$ είναι η αντιστοιχία στην οποία <b>κάθε</b> στοιχείο του $A$ αντιστοιχίζεται με <b>μόνο ένα</b> στοιχείο του $B$.</p>
<ul><li>Το σύνολο $A$ ονομάζεται <b>Πεδίο Ορισμού</b>.</li><li>Το σύνολο των στοιχείων του $B$ που αντιστοιχίζονται με στοιχεία του $A$ λέγεται <b>Πεδίο Τιμών</b>.</li></ul></div>
<div class="tbox tip"><h4>Τρόποι αναπαράστασης</h4>
<p>Για $A = \{-1, 0, 1, 2\}$ και τον κανόνα «κάθε αριθμός αντιστοιχίζεται με το τετράγωνό του»:</p>
<ul><li>βελοειδές διάγραμμα (βέλη από το $A$ στο $B$)</li>
<li>γράφημα (σύνολο διατεταγμένων ζευγών): $G = \{(-1, 1), (0, 0), (1, 1), (2, 4)\}$</li>
<li>τύπος: $y = x^2$ ή $f(x) = x^2$, π.χ. $f(2) = 4$ («η τιμή της $f$ στο $2$ είναι $4$»)</li>
<li>πίνακας τιμών, γραφική παράσταση, λεκτική περιγραφή</li></ul>
<p>Πεδίο Ορισμού $\{-1, 0, 1, 2\}$, Πεδίο Τιμών $\{0, 1, 4\}$.</p></div>
<div class="tbox"><h4>Πότε ΔΕΝ είναι συνάρτηση</h4>
<p>Όταν κάποιο στοιχείο του $A$ αντιστοιχίζεται με <b>δύο ή περισσότερα</b> στοιχεία του $B$, ή όταν κάποιο στοιχείο του $A$ <b>δεν</b> αντιστοιχίζεται με κανένα. Σε γραφική παράσταση: αν μια κατακόρυφη ευθεία τη συναντά σε δύο σημεία (π.χ. $(1, 0)$ και $(1, 2)$), δεν ορίζεται συνάρτηση.</p>
<p><i>(Εμπλουτισμός)</i> Γενικά: μια γραφική παράσταση ορίζει συνάρτηση όταν <b>κάθε</b> κατακόρυφη ευθεία τη συναντά σε <b>ένα το πολύ</b> σημείο.</p></div>`,
  widget: "mapping",
  gen: "h4fval",
  exercises: [
    { level: 1, type: "mc", q: R`Το σύνολο $G = \{(-2, 3), (0, 1), (1, 2), (3, 0), (4, 1), (5, -1)\}$ είναι γράφημα αντιστοιχίας. Ορίζει συνάρτηση;`, options: ["Ναι", "Όχι, γιατί το $1$ εμφανίζεται δύο φορές ως δεύτερη συντεταγμένη", "Όχι, γιατί υπάρχει αρνητική τιμή", "Όχι, γιατί το $0$ δεν έχει εικόνα"], correct: 0,
      hint: R`Κοίτα αν κάποια πρώτη συντεταγμένη επαναλαμβάνεται.`, sol: R`Κάθε τιμή του $x$ ($-2, 0, 1, 3, 4, 5$) εμφανίζεται μία φορά: ορίζεται συνάρτηση. Δεν πειράζει που το $0$ και το $4$ έχουν την ίδια τιμή $1$.` },
    { level: 1, type: "mc", q: R`Το σύνολο $G = \{(-2, 3), (0, 1), (1, 2), (3, 0), (4, 1), (-2, -1)\}$ ορίζει συνάρτηση;`, options: ["Όχι", "Ναι"], correct: 0,
      hint: R`Τι αντιστοιχεί στο $-2$;`, sol: R`Όχι: το $-2$ αντιστοιχίζεται με δύο τιμές, το $3$ και το $-1$.` },
    { level: 1, type: "fields", q: R`Δίνεται η συνάρτηση $f(x) = x^2$ με Πεδίο Ορισμού $A = \{-1, 0, 1, 2\}$. Να βρείτε την τιμή $f(-1)$ και το πλήθος των στοιχείων του Πεδίου Τιμών.`,
      fields: [{ label: "f(−1) =", ans: 1 }, { label: "πλήθος =", ans: 3 }],
      hint: R`Υπολόγισε όλες τις τιμές.`, sol: R`$f(-1) = 1$, $f(0) = 0$, $f(1) = 1$, $f(2) = 4$. Πεδίο Τιμών $\{0, 1, 4\}$: $3$ στοιχεία.` },
    { level: 2, type: "fields", q: R`Στο σύνολο $A = \left\{0, \frac13, 1, \frac32, 2\right\}$ ορίζεται η συνάρτηση $f$ με κανόνα «τριπλασιάζω κάθε αριθμό και τον αυξάνω κατά $5$». Να βρείτε τις τιμές $f\!\left(\frac13\right)$ και $f\!\left(\frac32\right)$.`,
      fields: [{ label: "f(1/3) =", ans: 6 }, { label: "f(3/2) =", ans: "19/2" }],
      hint: R`$f(x) = 3x + 5$.`, sol: R`$f\!\left(\frac13\right) = 1 + 5 = 6$, $f\!\left(\frac32\right) = \frac92 + 5 = \frac{19}{2}$.` },
    { level: 1, type: "fields", q: R`Η Κατερίνα αμείβεται €30 την εβδομάδα για επίβλεψη παιδιών. Αν $y$ η αμοιβή σε $x$ εβδομάδες, να βρείτε την αμοιβή για $5$ και για $12$ εβδομάδες.`,
      fields: [{ label: "5 εβδ. =", ans: 150 }, { label: "12 εβδ. =", ans: 360 }],
      hint: R`$y = 30x$.`, sol: R`Τύπος $y = 30x$: $30\cdot 5 = 150$ € και $30\cdot 12 = 360$ €.` },
    { level: 2, type: "mc", q: R`Σε κάθε μαθητή ενός τμήματος αντιστοιχίζουμε την ημερομηνία γέννησής του. Τι ισχύει;`, options: ["Ορίζεται συνάρτηση από τους μαθητές στις ημερομηνίες, όχι όμως πάντα αντίστροφα", "Ορίζεται συνάρτηση και προς τις δύο κατευθύνσεις", "Δεν ορίζεται συνάρτηση προς καμία κατεύθυνση", "Ορίζεται συνάρτηση μόνο από τις ημερομηνίες στους μαθητές"], correct: 0,
      hint: R`Πόσες ημερομηνίες γέννησης έχει ένας μαθητής; Πόσοι μαθητές μπορεί να έχουν την ίδια;`, sol: R`Κάθε μαθητής έχει μία μόνο ημερομηνία γέννησης: συνάρτηση. Αντίστροφα, δύο μαθητές μπορεί να έχουν γεννηθεί την ίδια μέρα, οπότε μια ημερομηνία θα αντιστοιχούσε σε δύο μαθητές.` },
    { level: 1, type: "mc", q: R`Η συνάρτηση $f$ έχει γράφημα $\{(1, 12), (5, 7), (10, 2000)\}$. Το Πεδίο Τιμών της είναι:`, options: ["$\\{12, 7, 2000\\}$", "$\\{1, 5, 10\\}$", "$\\{1, 5, 7, 10, 12, 2000\\}$", "$\\{12\\}$"], correct: 0,
      hint: R`Οι δεύτερες συντεταγμένες.`, sol: R`Πεδίο Ορισμού $\{1, 5, 10\}$ (πρώτες συντεταγμένες), Πεδίο Τιμών $\{12, 7, 2000\}$ (δεύτερες συντεταγμένες).` },
    { level: 2, type: "mc", q: R`<i>(Εμπλουτισμός)</i> Μια γραφική παράσταση ορίζει συνάρτηση (με μεταβλητή το $x$) όταν:`, options: ["κάθε κατακόρυφη ευθεία τη συναντά σε ένα το πολύ σημείο", "κάθε οριζόντια ευθεία τη συναντά σε ένα το πολύ σημείο", "περνά από την αρχή των αξόνων", "είναι ευθεία γραμμή"], correct: 0,
      hint: R`Σε κάθε $x$ πρέπει να αντιστοιχεί ένα μόνο $y$.`, sol: R`Αν μια κατακόρυφη ευθεία $x = \kappa$ τη συναντούσε σε δύο σημεία, στο $\kappa$ θα αντιστοιχούσαν δύο τιμές του $y$. Άρα: το πολύ ένα σημείο.` }
  ]
},
/* ───────────────────────────── 5.2 ───────────────────────────── */
{
  id: "5.2", unit: 5, title: "Γραμμική συνάρτηση – Ευθεία",
  book: "Β΄ Τεύχος §5 · σελ. 51 · Δραστηριότητες σελ. 56",
  theory: EXAM + R`
<div class="tbox"><h4>Γραμμική συνάρτηση</h4>
<p>Μια συνάρτηση της μορφής $f(x) = \alpha x + \beta$ (ή $y = \alpha x + \beta$), όπου $\alpha, \beta \in \mathbb{R}$, ονομάζεται <b>γραμμική συνάρτηση</b>. Η γραφική της παράσταση είναι <b>ευθεία γραμμή</b> και ο τύπος $y = \alpha x + \beta$ λέγεται <b>εξίσωση της ευθείας</b>.</p>
<p>Όταν δεν αναφέρεται Πεδίο Ορισμού, εννοούμε όλους τους πραγματικούς αριθμούς. Κάθε ευθεία γράφεται στη μορφή $y = \alpha x + \beta$, <b>εκτός</b> από τις ευθείες που είναι κάθετες στον άξονα των $x$.</p></div>
<div class="tbox tip"><h4>Σημείο που ανήκει στην ευθεία</h4>
<p>Ένα σημείο $A(x_1, y_1)$ ανήκει στην ευθεία $y = \alpha x + \beta$ <b>αν και μόνο αν</b> οι συντεταγμένες του την επαληθεύουν. Π.χ. το $B(2, 3)$ ανήκει στην $y = 2x - 1$ αφού $3 = 2\cdot 2 - 1$, ενώ το $A(-1, 1)$ όχι αφού $2\cdot(-1) - 1 = -3 \ne 1$.</p></div>
<div class="tbox"><h4>Σημεία τομής με τους άξονες</h4>
<ul><li>Με τον άξονα των τεταγμένων ($y$): θέτουμε $x = 0$. Η $y = \alpha x + \beta$ τον τέμνει πάντα στο $(0, \beta)$.</li>
<li>Με τον άξονα των τετμημένων ($x$): θέτουμε $y = 0$. Π.χ. $2x - 1 = 0 \iff x = \frac12$, σημείο $\left(\frac12, 0\right)$.</li></ul>
<p>Δύο σημεία ορίζουν μια ευθεία: αρκούν για να τη σχεδιάσουμε ή για να βρούμε τα $\alpha$, $\beta$. Π.χ. από τα $(0, 3)$ και $(1, 5)$: $\beta = 3$ και $5 = \alpha + 3 \Rightarrow \alpha = 2$, άρα $y = 2x + 3$.</p></div>`,
  widget: "h4line",
  gen: "h4lin",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια από τα σημεία $A(-1, 1)$, $B(2, 3)$, $\Gamma(-2, -1)$ ανήκουν στην ευθεία $y = 2x - 1$;`, options: ["μόνο το $B$", "μόνο το $A$", "τα $A$ και $\\Gamma$", "και τα τρία"], correct: 0,
      hint: R`Αντικατάστησε τις συντεταγμένες.`, sol: R`$A$: $2(-1) - 1 = -3 \ne 1$. $B$: $2\cdot 2 - 1 = 3$ ✓. $\Gamma$: $2(-2) - 1 = -5 \ne -1$. Μόνο το $B$.` },
    { level: 1, type: "fields", q: R`Η ευθεία $y = 2x - 4$ τέμνει τους άξονες στα σημεία $(x_0, 0)$ και $(0, y_0)$. Να βρείτε τα $x_0$, $y_0$.`,
      fields: [{ label: "x₀ =", ans: 2 }, { label: "y₀ =", ans: -4 }],
      hint: R`$y = 0$ και $x = 0$.`, sol: R`$2x - 4 = 0 \iff x = 2$· για $x = 0$, $y = -4$. Σημεία $(2, 0)$ και $(0, -4)$.` },
    { level: 1, type: "fields", q: R`Η ευθεία $y = \alpha x$ περνά από το σημείο $A(-1, 3)$. Να βρείτε το $\alpha$.`, fields: [{ label: "α =", ans: -3 }],
      hint: R`$3 = \alpha\cdot(-1)$.`, sol: R`$3 = -\alpha \iff \alpha = -3$, δηλαδή $y = -3x$.` },
    { level: 1, type: "fields", q: R`Η ευθεία $y = -2x + \beta$ περνά από το σημείο $A(-2, 6)$. Να βρείτε το $\beta$.`, fields: [{ label: "β =", ans: 2 }],
      hint: R`$6 = -2\cdot(-2) + \beta$.`, sol: R`$6 = 4 + \beta \iff \beta = 2$.` },
    { level: 2, type: "fields", q: R`Να βρείτε την εξίσωση $y = \alpha x + \beta$ της ευθείας που περνά από τα σημεία $(0, 1)$ και $(2, 4)$.`,
      fields: [{ label: "α =", ans: "3/2" }, { label: "β =", ans: 1 }],
      hint: R`Από το $(0, 1)$ βρίσκεις αμέσως το $\beta$.`, sol: R`$1 = \alpha\cdot 0 + \beta \Rightarrow \beta = 1$. $4 = 2\alpha + 1 \Rightarrow \alpha = \frac32$. Άρα $y = \frac32 x + 1$.` },
    { level: 2, type: "fields", q: R`Τα δεδομένα του πίνακα συνδέονται με γραμμική σχέση $y = \alpha x + \beta$: $x = -2, 0, 2, 4$ και $y = 1, 5, 9, 13$. Να βρείτε τα $\alpha$, $\beta$.`,
      fields: [{ label: "α =", ans: 2 }, { label: "β =", ans: 5 }],
      hint: R`Για $x = 0$ είναι $y = \beta$. Όταν το $x$ αυξάνεται κατά $2$, το $y$ αυξάνεται κατά $4$.`, sol: R`$\beta = 5$ (για $x = 0$). $9 = 2\alpha + 5 \Rightarrow \alpha = 2$. Έλεγχος: $2\cdot 4 + 5 = 13$ ✓, $2(-2) + 5 = 1$ ✓.` },
    { level: 2, type: "fields", q: R`Να βρείτε την τεταγμένη του σημείου τομής της ευθείας $6x - 2y = 3$ με τον άξονα των τεταγμένων.`, fields: [{ label: "y =", ans: "-3/2" }],
      hint: R`Θέτουμε $x = 0$.`, sol: R`$-2y = 3 \iff y = -\frac32$. Σημείο $\left(0, -\frac32\right)$.` },
    { level: 2, type: "mc", q: R`Ποια από τις ευθείες <b>δεν</b> τέμνει τον άξονα των τεταγμένων στο σημείο $(0, -1)$;`, options: ["$y - 1 = 5x$", "$y = 3x - 1$", "$y = -1 + 3x$", "$y = -x - 1$"], correct: 0,
      hint: R`Λύσε ως προς $y$ και κοίτα το $\beta$.`, sol: R`$y - 1 = 5x \iff y = 5x + 1$: τέμνει τον άξονα $y$ στο $(0, 1)$. Οι άλλες έχουν $\beta = -1$.` },
    { level: 2, type: "fields", q: R`Μια εταιρεία τηλεπικοινωνιών χρεώνει πάγιο €15 τον μήνα και 3 σεντ το λεπτό ομιλίας. (α) Πόση είναι η χρέωση για $200$ λεπτά; (β) Πόσα λεπτά μίλησε κάποιος που πλήρωσε €27;`,
      fields: [{ label: "(α) € =", ans: 21 }, { label: "(β) λεπτά =", ans: 400 }],
      hint: R`$y = 0{,}03x + 15$.`, sol: R`$y = 0{,}03x + 15$ (γραμμική συνάρτηση). (α) $0{,}03\cdot 200 + 15 = 21$ €. (β) $0{,}03x = 12 \iff x = 400$ λεπτά.` },
    { level: 3, type: "fields", q: R`Να βρείτε την εξίσωση $y = \alpha x + \beta$ της ευθείας που τέμνει τον άξονα των τεταγμένων στο $(0, 3)$ και τον άξονα των τετμημένων στο $(-1, 0)$.`,
      fields: [{ label: "α =", ans: 3 }, { label: "β =", ans: 3 }],
      hint: R`$\beta = 3$ και $0 = -\alpha + 3$.`, sol: R`$\beta = 3$, $0 = \alpha(-1) + 3 \Rightarrow \alpha = 3$. Άρα $y = 3x + 3$.` }
  ]
},
/* ───────────────────────────── 5.3 ───────────────────────────── */
{
  id: "5.3", unit: 5, title: "Ειδικές περιπτώσεις ευθειών",
  book: "Β΄ Τεύχος §5 · σελ. 58 · Δραστηριότητες σελ. 62",
  theory: EXAM + R`
<div class="tbox"><h4>Η ευθεία $y = \alpha x$</h4>
<p>Η γραφική παράσταση της $y = \alpha x$ είναι ευθεία που περνά από την <b>αρχή των αξόνων</b> $O(0, 0)$ (είναι η $y = \alpha x + \beta$ με $\beta = 0$).</p>
<ul><li>$\alpha > 0$: βρίσκεται στο <b>1ο και 3ο</b> τεταρτημόριο.</li><li>$\alpha < 0$: βρίσκεται στο <b>2ο και 4ο</b> τεταρτημόριο.</li></ul>
<p>Π.χ. η ευθεία από την αρχή και το $(1, 1)$: $1 = \alpha\cdot 1$, άρα $y = x$.</p></div>
<div class="tbox tip"><h4>Οι ευθείες $y = \beta$ και $x = \kappa$</h4>
<ul><li>$y = \beta$: ευθεία <b>κάθετη στον άξονα των $y$</b> στο σημείο $(0, \beta)$. Είναι <b>σταθερή συνάρτηση</b>. Π.χ. $y = 2$.</li>
<li>$x = \kappa$: ευθεία <b>κάθετη στον άξονα των $x$</b> στο σημείο $(\kappa, 0)$. <b>Δεν</b> ορίζει συνάρτηση, αφού στο $x = \kappa$ αντιστοιχούν άπειρες τιμές του $y$.</li></ul>
<p>Ο άξονας των τετμημένων ($x$) έχει εξίσωση $y = 0$ και ο άξονας των τεταγμένων ($y$) έχει εξίσωση $x = 0$.</p></div>`,
  widget: "h4special",
  gen: "h4spec",
  exercises: [
    { level: 1, type: "mc", q: R`Η ευθεία $y = -5x$ βρίσκεται:`, options: ["στο 2ο και 4ο τεταρτημόριο", "στο 1ο και 3ο τεταρτημόριο", "στο 1ο και 2ο τεταρτημόριο", "μόνο στο 4ο τεταρτημόριο"], correct: 0,
      hint: R`Πρόσημο του $\alpha$.`, sol: R`$\alpha = -5 < 0$: περνά από την αρχή και βρίσκεται στο 2ο και 4ο τεταρτημόριο (π.χ. $(1, -5)$, $(-1, 5)$).` },
    { level: 1, type: "fields", q: R`Η ευθεία $y = \alpha x$ περνά από το σημείο $(2, 1)$. Να βρείτε το $\alpha$.`, fields: [{ label: "α =", ans: "1/2" }],
      hint: R`$1 = \alpha\cdot 2$.`, sol: R`$\alpha = \frac12$, δηλαδή $y = \frac12 x$.` },
    { level: 1, type: "mc", q: R`Η ευθεία που είναι κάθετη στον άξονα των $x$ στο σημείο $(-2, 0)$ έχει εξίσωση:`, options: ["$x = -2$", "$y = -2$", "$y = -2x$", "$x = 0$"], correct: 0,
      hint: R`Κάθετη στον άξονα $x$: μορφή $x = \kappa$.`, sol: R`Μορφή $x = \kappa$, περνά από το $(-2, 0)$: $x = -2$.` },
    { level: 1, type: "fields", q: R`Να βρείτε το κοινό σημείο $(x, y)$ των ευθειών $x = -14$ και $y = 2014$.`,
      fields: [{ label: "x =", ans: -14 }, { label: "y =", ans: 2014 }],
      hint: R`Το σημείο επαληθεύει και τις δύο εξισώσεις.`, sol: R`Πρέπει $x = -14$ και $y = 2014$: σημείο $(-14, 2014)$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το σημείο τομής $(x, y)$ των ευθειών $y = 3x$ και $y = -8x$, χωρίς γραφική παράσταση.`,
      fields: [{ label: "x =", ans: 0 }, { label: "y =", ans: 0 }],
      hint: R`Και οι δύο είναι της μορφής $y = \alpha x$.`, sol: R`$3x = -8x \iff 11x = 0 \iff x = 0$, άρα $y = 0$. Τέμνονται στην αρχή των αξόνων.` },
    { level: 1, type: "mc", q: R`Ποια από τις παρακάτω ευθείες <b>δεν</b> ορίζει συνάρτηση;`, options: ["$x = 3$", "$y = 3$", "$y = 3x$", "$y = x + 3$"], correct: 0,
      hint: R`Κάθετη στον άξονα των $x$.`, sol: R`Η $x = 3$ είναι κάθετη στον άξονα $x$: στο $x = 3$ αντιστοιχούν άπειρα $y$, άρα δεν είναι συνάρτηση.` },
    { level: 2, type: "fields", q: R`Από κάθε κιλό πορτοκάλια παράγονται $0{,}4$ λίτρα χυμού. (α) Πόσα λίτρα χυμού δίνουν $500$ kg; (β) Πόσα κιλά χρειάζονται για $300$ λίτρα;`,
      fields: [{ label: "(α) λίτρα =", ans: 200 }, { label: "(β) κιλά =", ans: 750 }],
      hint: R`$f(x) = 0{,}4x$.`, sol: R`$f(x) = 0{,}4x$ (ευθεία από την αρχή). (α) $0{,}4\cdot 500 = 200$ λίτρα. (β) $0{,}4x = 300 \iff x = 750$ kg.` },
    { level: 1, type: "mc", q: R`Ο άξονας των τετμημένων ($x$) έχει εξίσωση $y = 0$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Ποια είναι η τεταγμένη κάθε σημείου του άξονα $x$;`, sol: R`Σωστό: όλα τα σημεία του άξονα $x$ έχουν τεταγμένη $0$. (Ο άξονας $y$ έχει εξίσωση $x = 0$.)` },
    { level: 2, type: "mc", q: R`Η ευθεία που διέρχεται από το σημείο $(-2, 4)$ και είναι κάθετη στον άξονα των $y$ έχει εξίσωση:`, options: ["$y = 4$", "$x = -2$", "$y = -2x$", "$x = 4$"], correct: 0,
      hint: R`Κάθετη στον άξονα $y$: μορφή $y = \beta$.`, sol: R`Μορφή $y = \beta$, με $\beta = 4$: $y = 4$. (Η ευθεία από το ίδιο σημείο και την αρχή είναι η $y = -2x$.)` }
  ]
},
/* ───────────────────────────── 5.4 ───────────────────────────── */
{
  id: "5.4", unit: 5, title: "Κλίση ευθείας",
  book: "Β΄ Τεύχος §5 · σελ. 64 · Δραστηριότητες σελ. 69",
  theory: EXAM + R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Όταν «μετακινούμαστε» από ένα σημείο $A$ σε ένα σημείο $B$ μιας ευθείας, έχουμε οριζόντια μεταβολή $\Delta x$ και κατακόρυφη μεταβολή $\Delta y$. <b>Κλίση</b> της ευθείας είναι ο λόγος</p>
$$\lambda = \frac{\Delta y}{\Delta x} = \frac{y_2 - y_1}{x_2 - x_1}, \quad x_1 \ne x_2$$
<p>για δύο σημεία $A(x_1, y_1)$, $B(x_2, y_2)$ της ευθείας. Ο λόγος αυτός λέγεται και <b>ρυθμός μεταβολής</b>: είναι η μεταβολή του $y$ όταν το $x$ αυξάνεται κατά $1$.</p></div>
<div class="tbox tip"><h4>Κλίση και εξίσωση</h4>
<ul><li>Η ευθεία $y = \alpha x + \beta$ έχει κλίση $\lambda = \alpha$ (τον συντελεστή του $x$). Π.χ. η $y = 2x + 1$ έχει $\lambda = 2$, η $2y = 4x - 1 \iff y = 2x - \frac12$ έχει $\lambda = 2$.</li>
<li>$\lambda > 0$: καθώς το $x$ αυξάνεται, το $y$ αυξάνεται. $\lambda < 0$: το $y$ μειώνεται.</li>
<li>Η ευθεία $y = \beta$ έχει κλίση $\lambda = 0$. Η κλίση της ευθείας $x = \kappa$ <b>δεν ορίζεται</b> ($\Delta x = 0$).</li></ul></div>
<div class="tbox"><h4>Εξίσωση από κλίση και σημείο</h4>
<p>Ευθεία με κλίση $3$ που περνά από το $A(-1, 3)$: $y = 3x + \beta$ και $3 = 3(-1) + \beta \Rightarrow \beta = 6$, άρα $y = 3x + 6$.</p></div>`,
  widget: "h4line",
  gen: "h4slope",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε την κλίση των ευθειών: (α) $y = 3x + 1$, (β) $y = 5 - 2x$, (γ) $3y - 3 = 9x$.`,
      fields: [{ label: "(α) λ =", ans: 3 }, { label: "(β) λ =", ans: -2 }, { label: "(γ) λ =", ans: 3 }],
      hint: R`Φέρε κάθε εξίσωση στη μορφή $y = \alpha x + \beta$.`, sol: R`(α) $3$. (β) $y = -2x + 5$: $-2$. (γ) $3y = 9x + 3 \iff y = 3x + 1$: $3$.` },
    { level: 1, type: "fields", q: R`Να βρείτε την κλίση των ευθειών: (α) $2 + y = 4x$, (β) $y = -\frac34 x + 1$, (γ) $y = 4$.`,
      fields: [{ label: "(α) λ =", ans: 4 }, { label: "(β) λ =", ans: "-3/4" }, { label: "(γ) λ =", ans: 0 }],
      hint: R`Η $y = 4$ είναι οριζόντια.`, sol: R`(α) $y = 4x - 2$: $4$. (β) $-\frac34$. (γ) $y = 0x + 4$: $0$.` },
    { level: 1, type: "mc", q: R`Η κλίση της ευθείας $x = -1$:`, options: ["δεν ορίζεται", "είναι $0$", "είναι $-1$", "είναι $1$"], correct: 0,
      hint: R`Πόσο είναι το $\Delta x$ για δύο σημεία της;`, sol: R`Όλα τα σημεία έχουν $x = -1$, άρα $\Delta x = 0$ και ο λόγος $\frac{\Delta y}{\Delta x}$ δεν ορίζεται.` },
    { level: 1, type: "fields", q: R`Να βρείτε την κλίση της ευθείας που περνά από τα σημεία $A(2, 5)$ και $B(5, 14)$.`, fields: [{ label: "λ =", ans: 3 }],
      hint: R`$\frac{14 - 5}{5 - 2}$.`, sol: R`$\lambda = \dfrac{14 - 5}{5 - 2} = \dfrac{9}{3} = 3$.` },
    { level: 2, type: "fields", q: R`Να βρείτε την εξίσωση $y = \alpha x + \beta$ της ευθείας που περνά από το $A(-1, 3)$ και έχει κλίση $\lambda = 3$.`,
      fields: [{ label: "α =", ans: 3 }, { label: "β =", ans: 6 }],
      hint: R`$\alpha = \lambda$.`, sol: R`$y = 3x + \beta$, $3 = -3 + \beta \Rightarrow \beta = 6$. Άρα $y = 3x + 6$.` },
    { level: 2, type: "fields", q: R`Δίνεται η ευθεία $y = (\kappa + 3)x$. Να βρείτε το $\kappa$ αν η ευθεία (α) έχει κλίση $5$, (β) έχει την ίδια κλίση με την $y = -2x$.`,
      fields: [{ label: "(α) κ =", ans: 2 }, { label: "(β) κ =", ans: -5 }],
      hint: R`Η κλίση είναι $\kappa + 3$.`, sol: R`(α) $\kappa + 3 = 5 \iff \kappa = 2$. (β) $\kappa + 3 = -2 \iff \kappa = -5$.` },
    { level: 2, type: "mc", q: R`Τέσσερις ράμπες έχουν (ύψος, οριζόντια απόσταση): Α $(2, 5)$, Β $(3, 6)$, Γ $(1, 4)$, Δ $(3, 8)$ σε m. Ποια είναι η λιγότερο ανηφορική;`, options: ["Γ", "Δ", "Α", "Β"], correct: 0,
      hint: R`Σύγκρινε τις κλίσεις $\frac{\text{ύψος}}{\text{οριζόντια απόσταση}}$.`, sol: R`Κλίσεις: Α $0{,}4$, Β $0{,}5$, Γ $0{,}25$, Δ $0{,}375$. Η μικρότερη κλίση είναι της Γ.` },
    { level: 3, type: "fields", q: R`Τα σημεία του πίνακα ανήκουν σε μία ευθεία: $(2, 5)$, $(3, 8)$, $(5, 14)$, $(8, 23)$, $(12, 35)$. Να βρείτε την κλίση της και το σημείο τομής $(0, \beta)$ με τον άξονα των τεταγμένων.`,
      fields: [{ label: "λ =", ans: 3 }, { label: "β =", ans: -1 }],
      hint: R`Το $y$ αυξάνεται κατά $3$ όταν το $x$ αυξάνεται κατά $1$.`, sol: R`$\lambda = \frac{8 - 5}{3 - 2} = 3$ (και π.χ. $\frac{35 - 23}{12 - 8} = 3$). $5 = 3\cdot 2 + \beta \Rightarrow \beta = -1$: η ευθεία $y = 3x - 1$ τέμνει τον άξονα $y$ στο $(0, -1)$.` },
    { level: 2, type: "mc", q: R`Το κέρδος (σε €) από την πώληση $n$ προϊόντων είναι $K(n) = 0{,}75n - 150$. Τι σημαίνει η κλίση $0{,}75$;`, options: ["Κάθε επιπλέον προϊόν αυξάνει το κέρδος κατά €0,75", "Το κέρδος όταν δεν πουληθεί κανένα προϊόν", "Πόσα προϊόντα πρέπει να πουληθούν", "Το συνολικό κέρδος"], correct: 0,
      hint: R`Η κλίση είναι ο ρυθμός μεταβολής.`, sol: R`Όταν το $n$ αυξάνεται κατά $1$, το $K$ αυξάνεται κατά $0{,}75$ €. (Το $-150$ είναι η τιμή για $n = 0$, δηλαδή ζημιά €150.)` },
    { level: 1, type: "mc", q: R`Σε μια ευθεία, καθώς το $x$ αυξάνεται, το $y$ μειώνεται. Τότε η κλίση της είναι:`, options: ["αρνητική", "θετική", "μηδέν", "δεν ορίζεται"], correct: 0,
      hint: R`$\Delta x > 0$ και $\Delta y < 0$.`, sol: R`$\lambda = \frac{\Delta y}{\Delta x} < 0$.` }
  ]
},
/* ───────────────────────────── 5.5 ───────────────────────────── */
{
  id: "5.5", unit: 5, title: "Γραμμικά συστήματα δύο εξισώσεων με δύο αγνώστους",
  book: "Β΄ Τεύχος §5 · σελ. 72 · Δραστηριότητες σελ. 76 · Ενότητας σελ. 78",
  theory: NOPROG + R`
<div class="tbox"><h4>Γραμμικό σύστημα</h4>
<p>Όταν αναζητούμε το ζεύγος $(x, y)$ που είναι <b>ταυτόχρονα</b> λύση δύο γραμμικών εξισώσεων, λέμε ότι επιλύουμε ένα <b>γραμμικό σύστημα δύο εξισώσεων με δύο αγνώστους</b>, π.χ. $\begin{cases} y = 2x + 3 \\ x + y = 6 \end{cases}$</p>
<p><b>Λύση</b> του συστήματος είναι κάθε ζεύγος $(x, y)$ που επαληθεύει και τις δύο εξισώσεις. Εδώ το $(1, 5)$: $5 = 2\cdot 1 + 3$ και $1 + 5 = 6$.</p></div>
<div class="tbox tip"><h4>Γραφική επίλυση</h4>
<p>Σχεδιάζουμε στο ίδιο σύστημα αξόνων τις δύο ευθείες και βρίσκουμε το <b>σημείο τομής</b> τους: οι συντεταγμένες του είναι η λύση. Αν οι ευθείες είναι παράλληλες, το σύστημα δεν έχει λύση· αν ταυτίζονται, έχει άπειρες λύσεις.</p></div>
<div class="tbox"><h4>Μέθοδος της αντικατάστασης</h4>
<ol><li>Λύνουμε τη μία εξίσωση ως προς μία μεταβλητή: από $y - 2x = 1$, $y = 2x + 1$.</li>
<li>Αντικαθιστούμε στην άλλη: $x + (2x + 1) = 7$.</li>
<li>Λύνουμε την εξίσωση που προκύπτει: $3x = 6 \iff x = 2$.</li>
<li>Βρίσκουμε την άλλη μεταβλητή: $y = 2\cdot 2 + 1 = 5$. Λύση $(x, y) = (2, 5)$.</li></ol></div>`,
  widget: "h4sys",
  gen: "h4sys",
  exercises: [
    { level: 1, type: "mc", q: R`Ποιο ζεύγος είναι η λύση του συστήματος $\begin{cases} y = -3x + 6 \\ x - 2y = -5 \end{cases}$;`, options: ["$x = 1,\\ y = 3$", "$x = 3,\\ y = 1$", "$x = 3,\\ y = 4$", "$x = -1,\\ y = 9$"], correct: 0,
      hint: R`Έλεγξε κάθε ζεύγος και στις δύο εξισώσεις.`, sol: R`$(1, 3)$: $3 = -3 + 6$ ✓ και $1 - 6 = -5$ ✓. Το $(-1, 9)$ επαληθεύει μόνο την 1η ($-1 - 18 \ne -5$).` },
    { level: 1, type: "fields", q: R`Να λύσετε το σύστημα $\begin{cases} y = 3 + x \\ x + 2y = 6 \end{cases}$`, fields: [{ label: "x =", ans: 0 }, { label: "y =", ans: 3 }],
      hint: R`Αντικατάσταση του $y$ στη 2η.`, sol: R`$x + 2(3 + x) = 6 \iff 3x + 6 = 6 \iff x = 0$, άρα $y = 3$.` },
    { level: 2, type: "fields", q: R`Να λύσετε το σύστημα $\begin{cases} y - 2x = 0 \\ 2x + y = 3 \end{cases}$`, fields: [{ label: "x =", ans: "3/4" }, { label: "y =", ans: "3/2" }],
      hint: R`$y = 2x$.`, sol: R`$2x + 2x = 3 \iff x = \frac34$, $y = 2\cdot\frac34 = \frac32$.` },
    { level: 2, type: "fields", q: R`Να λύσετε το σύστημα $\begin{cases} \alpha - 3\beta = 0 \\ \alpha + 2\beta = 15 \end{cases}$`, fields: [{ label: "α =", ans: 9 }, { label: "β =", ans: 3 }],
      hint: R`$\alpha = 3\beta$.`, sol: R`$3\beta + 2\beta = 15 \iff \beta = 3$, $\alpha = 9$.` },
    { level: 1, type: "mc", q: R`Το σύστημα $\begin{cases} y = 3x - 1 \\ y = 3x + 3 \end{cases}$:`, options: ["δεν έχει λύση", "έχει άπειρες λύσεις", "έχει μοναδική λύση", "έχει λύση το $(0, 0)$"], correct: 0,
      hint: R`Σύγκρινε τις κλίσεις.`, sol: R`Ίδια κλίση $3$, διαφορετικό $\beta$: οι ευθείες είναι παράλληλες. Πράγματι $3x - 1 = 3x + 3 \iff 0x = 4$, αδύνατο.` },
    { level: 2, type: "fields", q: R`Ο Στέφανος και η Μαρίλια έχουν συνολικά €120. Αν ο Στέφανος δώσει στη Μαρίλια €10, θα έχουν τα ίδια χρήματα. Πόσα έχει ο καθένας;`,
      fields: [{ label: "Στέφανος =", ans: 70 }, { label: "Μαρίλια =", ans: 50 }],
      hint: R`$x + y = 120$ και $x - 10 = y + 10$.`, sol: R`Από τη 2η: $x = y + 20$. Τότε $2y + 20 = 120 \iff y = 50$, $x = 70$.` },
    { level: 2, type: "fields", q: R`Σε μια κατασκήνωση $260$ παιδιά μένουν σε $50$ γεμάτες σκηνές των $4$ και των $6$ ατόμων. Πόσες είναι οι σκηνές των $4$ και πόσες των $6$ ατόμων;`,
      fields: [{ label: "των 4 =", ans: 20 }, { label: "των 6 =", ans: 30 }],
      hint: R`$x + y = 50$, $4x + 6y = 260$.`, sol: R`$y = 50 - x$: $4x + 300 - 6x = 260 \iff -2x = -40 \iff x = 20$, $y = 30$.` },
    { level: 2, type: "fields", q: R`Να βρείτε την εξίσωση $y = \alpha x + \beta$ της ευθείας που περνά από τα σημεία $A(1, 1)$ και $B(-1, -3)$.`,
      fields: [{ label: "α =", ans: 2 }, { label: "β =", ans: -1 }],
      hint: R`$\alpha + \beta = 1$ και $-\alpha + \beta = -3$.`, sol: R`Από την 1η: $\beta = 1 - \alpha$. Στη 2η: $-\alpha + 1 - \alpha = -3 \iff \alpha = 2$, $\beta = -1$. Άρα $y = 2x - 1$.` },
    { level: 1, type: "fields", q: R`Σε μια εκδρομή πήγαν $60$ παιδιά. Τα αγόρια ήταν τριπλάσια από τα κορίτσια. Πόσα ήταν τα αγόρια και πόσα τα κορίτσια;`,
      fields: [{ label: "αγόρια =", ans: 45 }, { label: "κορίτσια =", ans: 15 }],
      hint: R`$x + y = 60$, $x = 3y$.`, sol: R`$3y + y = 60 \iff y = 15$, $x = 45$.` }
  ]
},
/* ───────────────────────────── 6.1 ───────────────────────────── */
{
  id: "6.1", unit: 6, title: "Μετασχηματισμοί στο επίπεδο – Παράλληλη μεταφορά",
  book: "Β΄ Τεύχος §6 · σελ. 87–89 · Δραστηριότητες σελ. 91",
  theory: NOPROG + R`
<div class="tbox"><h4>Επίπεδος μετασχηματισμός</h4>
<p><b>Επίπεδο μετασχηματισμό</b> (ή απλά μετασχηματισμό) ονομάζουμε κάθε απεικόνιση (αντιστοιχία) στο επίπεδο, όπου κάθε σημείο $A$ απεικονίζεται σε <b>ένα ακριβώς</b> σημείο $A'$. Το αρχικό σημείο $A$ λέγεται <b>πρότυπο</b> και το τελικό $A'$ <b>εικόνα</b>.</p>
<p>Γνωστοί μετασχηματισμοί: η <b>συμμετρία ως προς άξονα</b> (ο άξονας είναι η μεσοκάθετη του $AA'$), η <b>παράλληλη μεταφορά</b> και η <b>στροφή</b>. Σε κάποιους μετασχηματισμούς η εικόνα διατηρεί το μέγεθος του σχήματος, σε άλλους (π.χ. μεγέθυνση) όχι.</p></div>
<div class="tbox"><h4>Παράλληλη μεταφορά</h4>
<p><b>Παράλληλη μεταφορά</b> ονομάζουμε τον μετασχηματισμό στον οποίο <b>κάθε σημείο</b> ενός σχήματος μετακινείται προς την <b>ίδια κατεύθυνση</b> και σε <b>ίση απόσταση</b>. Πρότυπο και εικόνα είναι <b>ίσα</b> σχήματα.</p>
<p>Π.χ. «κάθε σημείο μετακινείται $4$ μονάδες δεξιά και $2$ μονάδες πάνω». Σε σύστημα αξόνων: δεξιά/αριστερά αλλάζει η τετμημένη, πάνω/κάτω η τεταγμένη: $A(1, 3) \to A'(5, 5)$.</p></div>
<div class="tbox tip"><h4>Πόσο μετακινείται κάθε σημείο;</h4>
<p>Αν κάθε σημείο μετακινείται $2$ μονάδες δεξιά και $3$ κάτω, οι δύο μετακινήσεις είναι κάθετες πλευρές ορθογωνίου τριγώνου με υποτείνουσα το $AA'$. Από το Πυθαγόρειο: $(AA')^2 = 2^2 + 3^2 = 13$, άρα $AA' = \sqrt{13}$ μονάδες.</p>
<p>Αν το τμήμα $AB$ μεταφερθεί παράλληλα στο $A'B'$ (όχι πάνω στην ίδια ευθεία), τότε $AA' = BB'$ και $AA' \parallel BB'$, οπότε το $ABB'A'$ είναι <b>παραλληλόγραμμο</b>.</p></div>`,
  widget: "h5trans",
  gen: "h5trans",
  exercises: [
    { level: 1, type: "fields", q: R`Το σημείο $A(2, -3)$ μετακινείται με παράλληλη μεταφορά $4$ μονάδες δεξιά και $5$ μονάδες πάνω. Ποιες είναι οι συντεταγμένες της εικόνας $A'$;`,
      fields: [{ label: "x =", ans: 6 }, { label: "y =", ans: 2 }], hint: R`Δεξιά: $+4$ στην τετμημένη· πάνω: $+5$ στην τεταγμένη.`, sol: R`$A'(2 + 4,\ -3 + 5) = A'(6, 2)$.` },
    { level: 1, type: "mc", q: R`Σε μια παράλληλη μεταφορά, το πρότυπο και η εικόνα του:`, options: ["είναι ίσα σχήματα", "η εικόνα είναι πάντα μεγαλύτερη", "η εικόνα είναι πάντα μικρότερη", "είναι πάντα συμμετρικά ως προς άξονα"], correct: 0,
      hint: R`Όλα τα σημεία μετακινούνται το ίδιο.`, sol: R`Κάθε σημείο μετακινείται προς την ίδια κατεύθυνση και σε ίση απόσταση, άρα το σχήμα απλώς αλλάζει θέση: πρότυπο και εικόνα είναι ίσα.` },
    { level: 1, type: "fields", q: R`Το παραλληλόγραμμο $AB\Gamma\Delta$ έχει κορυφές $A(0, 0)$, $B(1, 2)$, $\Gamma(5, 2)$, $\Delta(4, 0)$. Μετακινείται $2$ μονάδες δεξιά και $3$ μονάδες πάνω. Ποιες είναι οι συντεταγμένες των $\Gamma'$ και $\Delta'$;`,
      fields: [{ label: "Γ′: x =", ans: 7 }, { label: "Γ′: y =", ans: 5 }, { label: "Δ′: x =", ans: 6 }, { label: "Δ′: y =", ans: 3 }], hint: R`Προσθέτουμε $2$ στις τετμημένες και $3$ στις τεταγμένες.`, sol: R`$\Gamma'(7, 5)$ και $\Delta'(6, 3)$.` },
    { level: 2, type: "mc", q: R`Κάθε σημείο ενός τριγώνου μετακινείται $2$ μονάδες δεξιά και $3$ μονάδες κάτω. Πόση απόσταση μετακινείται κάθε σημείο;`, options: ["$\\sqrt{13}$ μονάδες", "$5$ μονάδες", "$\\sqrt{5}$ μονάδες", "$13$ μονάδες"], correct: 0,
      hint: R`Πυθαγόρειο με κάθετες πλευρές $2$ και $3$.`, sol: R`$d^2 = 2^2 + 3^2 = 13$, άρα $d = \sqrt{13}$ μονάδες. (Το $5 = 2 + 3$ θα ήταν η απόσταση μόνο αν περπατούσαμε πρώτα οριζόντια και μετά κατακόρυφα.)` },
    { level: 2, type: "fields", q: R`Το σημείο $B$ είναι η εικόνα του σημείου $A$ όταν μεταφέρεται $8$ μονάδες αριστερά και $6$ μονάδες κάτω. Ποια παράλληλη μεταφορά απεικονίζει το $B$ στο $A$ και πόση είναι η απόσταση $AB$; (θετικός αριθμός: δεξιά / πάνω)`,
      fields: [{ label: "οριζόντια =", ans: 8 }, { label: "κατακόρυφα =", ans: 6 }, { label: "AB =", ans: 10 }], hint: R`Η αντίστροφη μεταφορά έχει αντίθετες κατευθύνσεις.`, sol: R`Από το $B$ στο $A$: $8$ μονάδες δεξιά και $6$ πάνω. $AB^2 = 8^2 + 6^2 = 100$, άρα $AB = 10$.` },
    { level: 2, type: "fields", q: R`Ένα πλοίο πηγαίνει από το λιμάνι $A$ στο λιμάνι $B$, που βρίσκεται $5$ km ανατολικά και $2$ km βόρεια του $A$, και μετά στο λιμάνι $\Gamma$, που βρίσκεται $7$ km ανατολικά και $7$ km νότια του $B$. Πού βρίσκεται το $\Gamma$ σε σχέση με το $A$ και πόση είναι η απόσταση $A\Gamma$;`,
      fields: [{ label: "ανατολικά (km) =", ans: 12 }, { label: "νότια (km) =", ans: 5 }, { label: "ΑΓ (km) =", ans: 13 }], hint: R`Ανατολικά: $5 + 7$· βόρεια $2$ και νότια $7$.`, sol: R`Ανατολικά $5 + 7 = 12$ km, νότια $7 - 2 = 5$ km. $A\Gamma^2 = 12^2 + 5^2 = 169$, άρα $A\Gamma = 13$ km.` },
    { level: 2, type: "mc", q: R`Το ευθύγραμμο τμήμα $AB$ μετασχηματίζεται με παράλληλη μεταφορά στο $A'B'$ (που δεν βρίσκεται στην ίδια ευθεία με το $AB$). Το τετράπλευρο $ABB'A'$ είναι:`, options: ["παραλληλόγραμμο", "τραπέζιο που δεν είναι παραλληλόγραμμο", "πάντα τετράγωνο", "πάντα ρόμβος"], correct: 0,
      hint: R`Τι ισχύει για τα $AA'$ και $BB'$;`, sol: R`Κάθε σημείο μετακινείται ίδια απόσταση προς την ίδια κατεύθυνση: $AA' = BB'$ και $AA' \parallel BB'$. Τετράπλευρο με δύο απέναντι πλευρές ίσες και παράλληλες είναι παραλληλόγραμμο. (Επίσης $AB = A'B'$.)` },
    { level: 3, type: "fields", q: R`Κάθε σημείο ενός σχήματος $(\Sigma)$ μεταφέρεται παράλληλα $8$ μονάδες αριστερά και $15$ μονάδες κάτω. Πόση απόσταση μετακινείται κάθε σημείο;`,
      fields: [{ label: "απόσταση =", ans: 17 }], hint: R`$8^2 + 15^2$.`, sol: R`$d^2 = 64 + 225 = 289$, άρα $d = 17$ μονάδες.` }
  ]
},
/* ───────────────────────────── 6.2 ───────────────────────────── */
{
  id: "6.2", unit: 6, title: "Επίπεδη στροφή",
  book: "Β΄ Τεύχος §6 · σελ. 93 · Δραστηριότητες σελ. 94 · Ενότητας σελ. 97",
  theory: NOPROG + R`
<div class="tbox"><h4>Ορισμός</h4>
<p><b>Επίπεδη στροφή</b> (ή απλά στροφή) ονομάζουμε τον μετασχηματισμό στον οποίο κάθε σημείο ενός σχήματος περιστρέφεται γύρω από ένα σταθερό σημείο του επιπέδου (το <b>κέντρο</b> της στροφής) κατά μια γωνία $\theta$ (τη <b>γωνία στροφής</b>). Πρότυπο και εικόνα είναι <b>ίσα</b> σχήματα.</p>
<p>Για να περιγράψουμε μια στροφή δίνουμε: το <b>κέντρο</b>, τη <b>γωνία</b> και τη <b>φορά</b>: <b>αριστερόστροφα</b> (αντίθετα από τους δείκτες του ρολογιού) ή <b>δεξιόστροφα</b> (σύμφωνα με τους δείκτες του ρολογιού).</p></div>
<div class="tbox tip"><h4>Χρήσιμες παρατηρήσεις</h4>
<ul><li>Στροφή $\theta$ δεξιόστροφα είναι ο ίδιος μετασχηματισμός με στροφή $360^\circ - \theta$ αριστερόστροφα. Π.χ. $90^\circ$ δεξιόστροφα $=$ $270^\circ$ αριστερόστροφα.</li>
<li>Η στροφή κατά $180^\circ$ (προς οποιαδήποτε φορά) είναι η <b>συμμετρία ως προς σημείο</b> (κεντρική συμμετρία) με κέντρο το κέντρο της στροφής.</li>
<li>Το κέντρο της στροφής είναι το μόνο σημείο που δεν αλλάζει θέση (για $0^\circ < \theta < 360^\circ$).</li>
<li>Δύο διαδοχικές στροφές με το ίδιο κέντρο και την ίδια φορά, κατά $\alpha$ και $\beta$, δίνουν στροφή κατά $\alpha + \beta$.</li></ul></div>
<div class="tbox"><h4>Στροφή γύρω από την αρχή των αξόνων</h4>
<p>Στροφή $90^\circ$ αριστερόστροφα: $(x, y) \to (-y, x)$ · στροφή $90^\circ$ δεξιόστροφα: $(x, y) \to (y, -x)$ · στροφή $180^\circ$: $(x, y) \to (-x, -y)$. Π.χ. το $P(3, 1)$ με στροφή $90^\circ$ αριστερόστροφα γίνεται $P'(-1, 3)$.</p></div>`,
  widget: "h5rot",
  gen: "h5rot",
  exercises: [
    { level: 1, type: "mc", q: R`Η στροφή κατά $90^\circ$ αριστερόστροφα γύρω από ένα σημείο $K$ είναι ο ίδιος μετασχηματισμός με τη στροφή γύρω από το $K$ κατά:`, options: ["$270^\\circ$ δεξιόστροφα", "$90^\\circ$ δεξιόστροφα", "$180^\\circ$ δεξιόστροφα", "$270^\\circ$ αριστερόστροφα"], correct: 0,
      hint: R`$360^\circ - 90^\circ$.`, sol: R`Θα φτάσουμε στην ίδια θέση αν στρέψουμε κατά $360^\circ - 90^\circ = 270^\circ$ προς την αντίθετη φορά, δηλαδή δεξιόστροφα.` },
    { level: 1, type: "fields", q: R`Μια στροφή είναι $120^\circ$ δεξιόστροφα. Με πόσες μοίρες αριστερόστροφα (γύρω από το ίδιο κέντρο) περιγράφεται ο ίδιος μετασχηματισμός;`,
      fields: [{ label: "μοίρες =", ans: 240 }], hint: R`Πλήρης στροφή $360^\circ$.`, sol: R`$360^\circ - 120^\circ = 240^\circ$ αριστερόστροφα.` },
    { level: 1, type: "mc", q: R`Η στροφή κατά $180^\circ$ γύρω από ένα σημείο $K$ είναι:`, options: ["η συμμετρία ως προς το σημείο $K$", "η συμμετρία ως προς άξονα που περνά από το $K$", "μια παράλληλη μεταφορά", "ο μετασχηματισμός που αφήνει κάθε σημείο στη θέση του"], correct: 0,
      hint: R`Το $K$ γίνεται μέσο του $AA'$.`, sol: R`Με στροφή $180^\circ$ κάθε σημείο $A$ πηγαίνει στο $A'$ ώστε τα $A, K, A'$ να είναι στην ίδια ευθεία και $KA = KA'$: είναι η συμμετρία ως προς το κέντρο $K$.` },
    { level: 2, type: "fields", q: R`Ένα κανονικό εξάγωνο αποτελείται από $6$ ίσα ισόπλευρα τρίγωνα με κοινή κορυφή το κέντρο $K$. Με στροφή γύρω από το $K$, πόσες μοίρες (αριστερόστροφα) χρειάζονται για να απεικονιστεί ένα τρίγωνο (α) στο <b>διπλανό</b> του, (β) στο <b>απέναντί</b> του;`,
      fields: [{ label: "(α) μοίρες =", ans: 60 }, { label: "(β) μοίρες =", ans: 180 }], hint: R`$360^\circ : 6$.`, sol: R`Κάθε τρίγωνο έχει στο $K$ γωνία $360^\circ : 6 = 60^\circ$. (α) $60^\circ$. (β) Το απέναντι απέχει τρία «βήματα»: $3\cdot 60^\circ = 180^\circ$ (κεντρική συμμετρία).` },
    { level: 2, type: "fields", q: R`Το $AB\Gamma\Delta$ είναι τετράγωνο με κέντρο $O$ (το σημείο τομής των διαγωνίων). Με πόσες μοίρες στροφή γύρω από το $O$ το τρίγωνο $OAB$ απεικονίζεται στο γειτονικό του τρίγωνο $OB\Gamma$;`,
      fields: [{ label: "μοίρες =", ans: 90 }], hint: R`Οι διαγώνιοι του τετραγώνου είναι κάθετες.`, sol: R`Οι διαγώνιοι τέμνονται κάθετα, άρα η γωνία $AOB$ είναι $90^\circ$: στροφή $90^\circ$ (από το $A$ προς το $B$).` },
    { level: 2, type: "fields", q: R`Σε ένα σχήμα $(\Sigma)$ εφαρμόζουμε στροφή $30^\circ$ αριστερόστροφα γύρω από ένα σημείο $K$ και παίρνουμε το $(T)$. Στο $(T)$ εφαρμόζουμε στροφή $40^\circ$ αριστερόστροφα γύρω από το ίδιο σημείο $K$ και παίρνουμε το $(P)$. Με πόσες μοίρες στροφή γύρω από το $K$ απεικονίζεται το $(\Sigma)$ απευθείας στο $(P)$;`,
      fields: [{ label: "μοίρες =", ans: 70 }], hint: R`Ίδιο κέντρο, ίδια φορά.`, sol: R`Οι γωνίες προστίθενται: $30^\circ + 40^\circ = 70^\circ$ αριστερόστροφα.` },
    { level: 2, type: "fields", q: R`Το σημείο $P(3, 1)$ στρέφεται γύρω από την αρχή των αξόνων $O$ αριστερόστροφα. Να βρείτε την εικόνα του $P'$ με στροφή $90^\circ$ και την εικόνα του $P''$ με στροφή $180^\circ$.`,
      fields: [{ label: "P′: x =", ans: -1 }, { label: "P′: y =", ans: 3 }, { label: "P″: x =", ans: -3 }, { label: "P″: y =", ans: -1 }], hint: R`$(x, y) \to (-y, x)$ και $(x, y) \to (-x, -y)$.`, sol: R`$P'(-1, 3)$ και $P''(-3, -1)$.` },
    { level: 1, type: "mc", q: R`Σε μια στροφή κατά $90^\circ$, ποιο σημείο δεν αλλάζει θέση;`, options: ["το κέντρο της στροφής", "κανένα σημείο", "όλα τα σημεία του σχήματος", "η αρχή των αξόνων, πάντα"], correct: 0,
      hint: R`Γύρω από ποιο σημείο «γυρίζει» το σχήμα;`, sol: R`Μόνο το κέντρο της στροφής μένει στη θέση του. Η αρχή των αξόνων μένει σταθερή μόνο αν είναι το κέντρο.` },
    { level: 3, type: "mc", q: R`Το σημείο $P(4, 2)$ απεικονίζεται με στροφές γύρω από το $O$ κατά $90^\circ$, $180^\circ$ και $270^\circ$ αριστερόστροφα στα $P'$, $P''$, $P'''$. Το τετράπλευρο $PP'P''P'''$ είναι:`, options: ["τετράγωνο", "ορθογώνιο που δεν είναι τετράγωνο", "ρόμβος που δεν είναι τετράγωνο", "τραπέζιο"], correct: 0,
      hint: R`Οι διαγώνιοι $PP''$ και $P'P'''$ περνούν από το $O$.`, sol: R`$P'(-2, 4)$, $P''(-4, -2)$, $P'''(2, -4)$. Οι διαγώνιοι $PP''$ και $P'P'''$ διχοτομούνται στο $O$, είναι ίσες (και οι δύο $= 2\cdot OP$) και κάθετες (οι $OP$, $OP'$ σχηματίζουν $90^\circ$): άρα τετράγωνο.` }
  ]
},
/* ───────────────────────────── 7.1 ───────────────────────────── */
{
  id: "7.1", unit: 7, title: "Ευθέως ανάλογα ποσά",
  book: "Β΄ Τεύχος §7 · σελ. 109 · Δραστηριότητες σελ. 113 · Ενότητας σελ. 122",
  theory: EXAM + R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Δύο ποσά ονομάζονται <b>ευθέως ανάλογα</b> (ή απλά <b>ανάλογα</b>) όταν οι αντίστοιχες τιμές τους έχουν <b>πάντα τον ίδιο λόγο</b>:</p>
$$x,\ y \text{ ανάλογα} \iff \frac{y}{x} = \alpha \iff y = \alpha x$$
<p>Ο σταθερός αριθμός $\alpha$ λέγεται <b>συντελεστής αναλογίας</b>. Η γραφική παράσταση της $y = \alpha x$ είναι <b>ευθεία που περνά από την αρχή των αξόνων</b>.</p>
<p>Π.χ. ένα προϊόν κοστίζει $2$ € το κιλό: κόστος $y$ και μάζα $x$ συνδέονται με $y = 2x$, αφού $\frac21 = \frac42 = \frac63 = 2$.</p></div>
<div class="tbox tip"><h4>Ιδιότητες</h4>
<ul><li>Αν πολλαπλασιάσουμε (ή διαιρέσουμε) την τιμή του ενός ποσού με έναν αριθμό, τότε και η αντίστοιχη τιμή του άλλου πολλαπλασιάζεται (ή διαιρείται) με τον <b>ίδιο</b> αριθμό.</li>
<li>Ο λόγος δύο τιμών του ενός ποσού ισούται με τον λόγο των αντίστοιχων τιμών του άλλου: $\frac{x_1}{x_2} = \frac{y_1}{y_2}$.</li></ul>
<p>Αν ισχύει μία από τις παραπάνω σχέσεις, τα ποσά είναι ανάλογα. Προσοχή: «όταν το ένα αυξάνεται, αυξάνεται και το άλλο» <b>δεν</b> αρκεί (π.χ. ηλικία και ύψος ενός παιδιού).</p></div>
<div class="tbox"><h4>Λύση προβλημάτων</h4>
<p>Γράφουμε τις αντίστοιχες τιμές σε πίνακα και φτιάχνουμε αναλογία. Π.χ. $20$ ml φυτοφάρμακο σε $80$ l νερό· για $60$ ml: $\frac{20}{80} = \frac{60}{x} \iff 20x = 4800 \iff x = 240$ l.</p>
<p>Ποσοστά: με έκπτωση $40\%$ η τιμή πώλησης είναι το $60\%$ της αρχικής, $y = 0{,}6x$. Αν $y = 360$ €, τότε $x = 360 : 0{,}6 = 600$ €.</p></div>`,
  widget: "h5dir",
  gen: "h5dir",
  exercises: [
    { level: 1, type: "fields", q: R`Στον πίνακα δίνονται αντίστοιχες τιμές δύο ποσών: για $x = 2,\ 5,\ 8,\ 12$ είναι $y = 0{,}6,\ 1{,}5,\ 2{,}4,\ 3{,}6$. Τα ποσά είναι ανάλογα. Ποιος είναι ο συντελεστής αναλογίας;`,
      fields: [{ label: "α =", ans: 0.3 }], hint: R`Υπολόγισε τους λόγους $\frac{y}{x}$.`, sol: R`$\frac{0{,}6}{2} = \frac{1{,}5}{5} = \frac{2{,}4}{8} = \frac{3{,}6}{12} = 0{,}3$. Άρα $\alpha = 0{,}3$ και $y = 0{,}3x$.` },
    { level: 1, type: "mc", q: R`Ποιο ζεύγος ποσών είναι ευθέως ανάλογο;`, options: ["η περίμετρος ενός τετραγώνου και το μήκος της πλευράς του", "το εμβαδόν ενός τετραγώνου και το μήκος της πλευράς του", "το ύψος ενός ανθρώπου και η μάζα του", "η ηλικία ενός παιδιού και το ύψος του"], correct: 0,
      hint: R`Ποιο ζεύγος συνδέεται με τύπο $y = \alpha x$;`, sol: R`$\Pi = 4\alpha$: ανάλογα με συντελεστή $4$. Το εμβαδόν $E = \alpha^2$ δεν είναι ανάλογο (διπλασιάζοντας την πλευρά το εμβαδόν τετραπλασιάζεται). Ύψος – μάζα και ηλικία – ύψος δεν έχουν σταθερό λόγο.` },
    { level: 1, type: "fields", q: R`Τα ποσά $x$ και $y$ είναι ανάλογα. Για $x = 2$ είναι $y = 10$. Να βρείτε (α) το $y$ για $x = 3$, (β) το $x$ για $y = 35$.`,
      fields: [{ label: "(α) y =", ans: 15 }, { label: "(β) x =", ans: 7 }], hint: R`Ο συντελεστής είναι $\frac{10}{2}$.`, sol: R`$\alpha = 5$, $y = 5x$. (α) $y = 15$. (β) $35 = 5x \Rightarrow x = 7$.` },
    { level: 1, type: "fields", q: R`Ένας εργάτης παίρνει $900$ € για $15$ ημερομίσθια. Πόσα χρήματα θα πάρει για $12$ ημερομίσθια;`,
      fields: [{ label: "€ =", ans: 720 }], hint: R`Η αμοιβή είναι ανάλογη των ημερομισθίων.`, sol: R`$\frac{15}{900} = \frac{12}{x} \Rightarrow 15x = 10\,800 \Rightarrow x = 720$ €. (Ή: $60$ € το ημερομίσθιο, $12\cdot 60 = 720$.)` },
    { level: 2, type: "fields", q: R`Ένα αυτοκίνητο διανύει $270$ km σε $3$ ώρες. Πόσα χιλιόμετρα θα διανύσει σε $4{,}5$ ώρες, αν κινείται με την ίδια ταχύτητα;`,
      fields: [{ label: "km =", ans: 405 }], hint: R`Ίδια ταχύτητα ⇒ απόσταση ανάλογη του χρόνου.`, sol: R`$\frac{270}{3} = \frac{x}{4{,}5} \Rightarrow x = 90\cdot 4{,}5 = 405$ km.` },
    { level: 2, type: "fields", q: R`Σε περίοδο εκπτώσεων $25\%$, ένα ποδήλατο πωλείται $330$ €. Ποια ήταν η αρχική του τιμή;`,
      fields: [{ label: "€ =", ans: 440 }], hint: R`Πωλείται στο $75\%$ της αρχικής τιμής.`, sol: R`$y = 0{,}75x \Rightarrow 330 = 0{,}75x \Rightarrow x = 440$ €.` },
    { level: 2, type: "fields", q: R`Το κρασί που παίρνουμε από μια ποικιλία σταφυλιού είναι το $60\%$ της μάζας του σταφυλιού. Να γράψετε τον συντελεστή $\alpha$ στη σχέση $y = \alpha x$ ($x$: κιλά σταφύλια, $y$: κιλά κρασί) και να βρείτε πόσα κιλά κρασί παίρνουμε από $1500$ kg σταφύλια.`,
      fields: [{ label: "α =", ans: 0.6 }, { label: "κιλά κρασί =", ans: 900 }], hint: R`$60\% = 0{,}6$.`, sol: R`$y = 0{,}6x$, άρα $y = 0{,}6\cdot 1500 = 900$ kg.` },
    { level: 3, type: "fields", q: R`Οι οδηγίες ενός λιπάσματος λένε ότι κάθε $3$ g διαλύονται σε $12$ λίτρα νερό. Να εκφράσετε την ποσότητα νερού $y$ συναρτήσει της ποσότητας λιπάσματος $x$ ($y = \alpha x$) και να βρείτε (α) το νερό για $5$ g λίπασμα, (β) το λίπασμα για $36$ λίτρα νερό.`,
      fields: [{ label: "α =", ans: 4 }, { label: "(α) λίτρα =", ans: 20 }, { label: "(β) g =", ans: 9 }], hint: R`$\alpha = \frac{12}{3}$.`, sol: R`$y = 4x$. (α) $4\cdot 5 = 20$ λίτρα. (β) $36 = 4x \Rightarrow x = 9$ g.` },
    { level: 1, type: "mc", q: R`Η γραφική παράσταση δύο ευθέως ανάλογων ποσών ($y = \alpha x$) είναι:`, options: ["ευθεία που περνά από την αρχή των αξόνων", "ευθεία που δεν περνά από την αρχή των αξόνων", "υπερβολή", "οριζόντια ευθεία"], correct: 0,
      hint: R`Για $x = 0$, $y = ?$`, sol: R`Για $x = 0$ είναι $y = 0$, και η $y = \alpha x$ παριστάνεται με ευθεία: ευθεία που περνά από την αρχή των αξόνων.` }
  ]
},
/* ───────────────────────────── 7.2 ───────────────────────────── */
{
  id: "7.2", unit: 7, title: "Αντιστρόφως ανάλογα ποσά",
  book: "Β΄ Τεύχος §7 · σελ. 116 · Δραστηριότητες σελ. 120 · Ενότητας σελ. 122",
  theory: NOEX + R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Δύο ποσά ονομάζονται <b>αντιστρόφως ανάλογα</b> όταν το <b>γινόμενο</b> των αντίστοιχων τιμών τους είναι πάντα σταθερό:</p>
$$x,\ y \text{ αντιστρόφως ανάλογα} \iff x\cdot y = \alpha \iff y = \frac{\alpha}{x},\quad \alpha \ne 0$$
<p>Η γραφική παράσταση της $y = \frac{\alpha}{x}$ είναι <b>υπερβολή</b>. Η υπερβολή αποτελείται από δύο καμπύλες, τους <b>κλάδους</b> της, που όσο και αν προεκταθούν δεν τέμνουν τους άξονες ούτε συμπίπτουν με αυτούς.</p>
<p>Π.χ. παραλληλόγραμμο με εμβαδόν $6$ m²: βάση $x$ και ύψος $y$ ικανοποιούν $x\cdot y = 6$ ($1\cdot 6 = 2\cdot 3 = 3\cdot 2 = 6\cdot 1$).</p></div>
<div class="tbox tip"><h4>Ιδιότητες</h4>
<ul><li>Όταν πολλαπλασιάζεται η τιμή του ενός ποσού με έναν αριθμό, η αντίστοιχη τιμή του άλλου <b>διαιρείται</b> με τον ίδιο αριθμό.</li>
<li>Ο λόγος δύο τιμών του ενός ποσού ισούται με τον <b>αντίστροφο</b> λόγο των αντίστοιχων τιμών του άλλου: $\frac{x_1}{x_2} = \frac{y_2}{y_1}$.</li></ul>
<p>Προσοχή: «όταν το ένα αυξάνεται, το άλλο μειώνεται» δεν αρκεί· πρέπει το γινόμενο να μένει σταθερό.</p></div>
<div class="tbox"><h4>Λύση προβλημάτων</h4>
<p>$12$ μηχανές χρειάζονται $15$ ώρες για την ημερήσια παραγωγή. Αν λειτουργούν $10$ μηχανές: σταθερό γινόμενο, $10x = 12\cdot 15 = 180 \Rightarrow x = 18$ ώρες.</p></div>`,
  widget: "h5inv",
  gen: "h5inv",
  exercises: [
    { level: 1, type: "fields", q: R`Για $x = 1,\ 2,\ 3,\ 4$ είναι αντίστοιχα $y = 36,\ 18,\ 12,\ 9$. Τα ποσά είναι αντιστρόφως ανάλογα. Ποιο είναι το σταθερό γινόμενο $x\cdot y$;`,
      fields: [{ label: "x·y =", ans: 36 }], hint: R`Πολλαπλασίασε τις αντίστοιχες τιμές.`, sol: R`$1\cdot 36 = 2\cdot 18 = 3\cdot 12 = 4\cdot 9 = 36$, άρα $y = \frac{36}{x}$.` },
    { level: 1, type: "fields", q: R`Τα ποσά $x$ και $y$ είναι αντιστρόφως ανάλογα και για $x = 1$ είναι $y = 48$. Να συμπληρώσετε: (α) $y$ για $x = 2$, (β) $x$ για $y = 8$, (γ) $y$ για $x = 12$.`,
      fields: [{ label: "(α) y =", ans: 24 }, { label: "(β) x =", ans: 6 }, { label: "(γ) y =", ans: 4 }], hint: R`$x\cdot y = 48$.`, sol: R`(α) $48 : 2 = 24$. (β) $48 : 8 = 6$. (γ) $48 : 12 = 4$.` },
    { level: 1, type: "fields", q: R`Σε ένα εργοστάσιο $8$ μηχανές ολοκληρώνουν την ημερήσια παραγωγή σε $15$ ώρες. Μια μέρα χαλάνε $2$ μηχανές. Πόσες ώρες πρέπει να δουλέψουν οι υπόλοιπες για την ίδια παραγωγή;`,
      fields: [{ label: "ώρες =", ans: 20 }], hint: R`Μηχανές και ώρες: σταθερό γινόμενο.`, sol: R`$6x = 8\cdot 15 = 120 \Rightarrow x = 20$ ώρες.` },
    { level: 2, type: "fields", q: R`Ένα σύστημα ποτίσματος παίρνει νερό από μια δεξαμενή. Αν λειτουργεί $4$ ώρες την ημέρα, το νερό επαρκεί για $30$ ημέρες. Για πόσες ημέρες επαρκεί, αν λειτουργεί $6$ ώρες την ημέρα;`,
      fields: [{ label: "ημέρες =", ans: 20 }], hint: R`Συνολικές ώρες λειτουργίας $= 4\cdot 30$.`, sol: R`$6x = 4\cdot 30 = 120 \Rightarrow x = 20$ ημέρες.` },
    { level: 2, type: "fields", q: R`Ένα αυτοκίνητο κινείται με $90$ km/h και καλύπτει τη μισή απόσταση μιας διαδρομής σε $30$ λεπτά. Με ποια ταχύτητα πρέπει να κινηθεί για να καλύψει την άλλη μισή σε $25$ λεπτά; Πόσο πρέπει να αυξήσει την ταχύτητά του;`,
      fields: [{ label: "km/h =", ans: 108 }, { label: "αύξηση =", ans: 18 }], hint: R`Για την ίδια απόσταση, ταχύτητα και χρόνος είναι αντιστρόφως ανάλογα.`, sol: R`$25\cdot v = 30\cdot 90 = 2700 \Rightarrow v = 108$ km/h. Αύξηση $108 - 90 = 18$ km/h.` },
    { level: 1, type: "mc", q: R`Η γραφική παράσταση της σχέσης $y = \frac{\alpha}{x}$ ($\alpha \ne 0$) είναι:`, options: ["υπερβολή", "ευθεία που περνά από την αρχή των αξόνων", "οριζόντια ευθεία", "παραβολή"], correct: 0,
      hint: R`Αντιστρόφως ανάλογα ποσά.`, sol: R`Υπερβολή, με δύο κλάδους που δεν τέμνουν τους άξονες.` },
    { level: 2, type: "mc", q: R`Ο Απόστολος τη Δευτέρα είδε τηλεόραση $1{,}5$ ώρα και διάβασε $1{,}5$ ώρα, την Τρίτη $2$ ώρες και $1$ ώρα, την Τετάρτη $0{,}5$ ώρα και $2{,}5$ ώρες. Είναι ο χρόνος τηλεόρασης και ο χρόνος μελέτης αντιστρόφως ανάλογα ποσά;`, options: ["Όχι, το γινόμενο δεν είναι σταθερό", "Ναι, γιατί όταν το ένα αυξάνεται το άλλο μειώνεται", "Ναι, γιατί το άθροισμα είναι σταθερό", "Είναι ευθέως ανάλογα"], correct: 0,
      hint: R`Υπολόγισε τα γινόμενα.`, sol: R`Γινόμενα: $2{,}25$, $2$, $1{,}25$: δεν είναι σταθερά, άρα δεν είναι αντιστρόφως ανάλογα. Σταθερό είναι το <b>άθροισμα</b> ($3$ ώρες), όχι το γινόμενο.` },
    { level: 3, type: "fields", q: R`Ένας μελισσοκόμος γεμίζει με το μέλι του $200$ μπουκάλια των $450$ g. (α) Πόσα μπουκάλια των $750$ g θα χρειαστεί; (β) Αν κάθε μπουκάλι των $450$ g κοστίζει $0{,}50$ € και κάθε μπουκάλι των $750$ g $0{,}75$ €, πόσο κοστίζουν συνολικά τα μπουκάλια σε κάθε περίπτωση;`,
      fields: [{ label: "(α) μπουκάλια =", ans: 120 }, { label: "(β) 450 g: € =", ans: 100 }, { label: "(β) 750 g: € =", ans: 90 }], hint: R`Ποσότητα μελιού $= 200\cdot 450$ g (σταθερή).`, sol: R`(α) $750x = 200\cdot 450 = 90\,000 \Rightarrow x = 120$. (β) $200\cdot 0{,}50 = 100$ € και $120\cdot 0{,}75 = 90$ €: συμφέρουν τα μπουκάλια των $750$ g.` }
  ]
},
/* ───────────────────────────── 8.1 ───────────────────────────── */
{
  id: "8.1", unit: 8, title: "Μέτρα θέσης",
  book: "Β΄ Τεύχος §8 · σελ. 127 · Δραστηριότητες σελ. 131 · Ενότητας σελ. 143",
  theory: EXAM + R`
<div class="tbox"><h4>Μέση τιμή</h4>
<p><b>Μέση τιμή</b> ενός συνόλου παρατηρήσεων λέγεται το πηλίκο του αθροίσματος των τιμών των παρατηρήσεων διά του πλήθους τους:</p>
$$\bar{X} = \frac{\text{άθροισμα των παρατηρήσεων}}{\text{πλήθος των παρατηρήσεων}}$$
<p>Π.χ. για $12, 15, 16, 19$: $\bar{X} = \frac{62}{4} = 15{,}5$. Αν δίνονται συχνότητες, πολλαπλασιάζουμε κάθε τιμή με τη συχνότητά της: π.χ. $\frac{2\cdot 0 + 7\cdot 1 + 5\cdot 2 + 4\cdot 3 + 1\cdot 5 + 1\cdot 6}{20} = 2$.</p></div>
<div class="tbox"><h4>Διάμεσος</h4>
<p>Διατάσσουμε τις παρατηρήσεις σε <b>αύξουσα σειρά</b>. <b>Διάμεσος</b> είναι:</p>
<ul><li>η <b>μεσαία</b> παρατήρηση, όταν το πλήθος είναι <b>περιττό</b>: $12, 14, \mathbf{15}, 18, 19 \to 15$·</li>
<li>η <b>μέση τιμή των δύο μεσαίων</b> παρατηρήσεων, όταν το πλήθος είναι <b>άρτιο</b>: $12, 14, \mathbf{14}, \mathbf{18}, 19, 20 \to \frac{14 + 18}{2} = 16$.</li></ul></div>
<div class="tbox tip"><h4>Επικρατούσα τιμή</h4>
<p><b>Επικρατούσα τιμή</b> είναι η τιμή με τη <b>μεγαλύτερη συχνότητα</b> (εμφανίζεται τις περισσότερες φορές). Μπορεί να υπάρχουν <b>περισσότερες από μία</b> επικρατούσες τιμές: π.χ. στις θερμοκρασίες $36, 37, 37, 38, 40, 40, 39, 36, 37, 38, 37, 39, 39, 40, 40$ οι $37$ και $40$ εμφανίζονται από $4$ φορές.</p>
<p>Η μέση τιμή, η διάμεσος και η επικρατούσα τιμή λέγονται <b>μέτρα θέσης</b>. Μια ακραία τιμή επηρεάζει πολύ τη μέση τιμή, αλλά ελάχιστα (ή καθόλου) τη διάμεσο.</p></div>`,
  widget: "h5stats",
  gen: "h5stat",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε τη μέση τιμή, τη διάμεσο και την επικρατούσα τιμή των παρατηρήσεων: $14,\ 9,\ 17,\ 12,\ 9,\ 11,\ 19$.`,
      fields: [{ label: "μέση τιμή =", ans: 13 }, { label: "διάμεσος =", ans: 12 }, { label: "επικρατούσα =", ans: 9 }], hint: R`Άθροισμα $91$· σε αύξουσα σειρά $9, 9, 11, 12, \dots$`, sol: R`$\bar{X} = \frac{91}{7} = 13$. Αύξουσα: $9, 9, 11, \mathbf{12}, 14, 17, 19$, διάμεσος $12$ (4η τιμή). Επικρατούσα: $9$ (δύο φορές).` },
    { level: 1, type: "fields", q: R`Τα ύψη (σε cm) $8$ αθλητών είναι: $170,\ 176,\ 183,\ 178,\ 190,\ 192,\ 188,\ 195$. Να βρείτε το μέσο ύψος και τη διάμεσο των υψών.`,
      fields: [{ label: "μέση τιμή =", ans: 184 }, { label: "διάμεσος =", ans: 185.5 }], hint: R`Άρτιο πλήθος: μέσος όρος της 4ης και της 5ης τιμής.`, sol: R`Άθροισμα $1472$, $\bar{X} = \frac{1472}{8} = 184$ cm. Αύξουσα: $170, 176, 178, \mathbf{183}, \mathbf{188}, 190, 192, 195$, διάμεσος $\frac{183 + 188}{2} = 185{,}5$ cm.` },
    { level: 1, type: "mc", q: R`Ποια είναι η επικρατούσα τιμή των παρατηρήσεων $21,\ 23,\ 23,\ 25,\ 27,\ 27,\ 30$;`, options: ["$23$ και $27$", "$23$", "$25$", "$27$"], correct: 0,
      hint: R`Μπορεί να υπάρχουν περισσότερες από μία.`, sol: R`Οι τιμές $23$ και $27$ εμφανίζονται από δύο φορές, περισσότερο από κάθε άλλη: έχουμε δύο επικρατούσες τιμές.` },
    { level: 2, type: "fields", q: R`Η μέση τιμή επτά αριθμών είναι $6$. Οι πέντε από αυτούς είναι οι $3,\ 4,\ 5,\ 7,\ 11$. Να βρείτε τους άλλους δύο, αν ο ένας είναι διπλάσιος του άλλου.`,
      fields: [{ label: "μικρότερος =", ans: 4 }, { label: "μεγαλύτερος =", ans: 8 }], hint: R`Άθροισμα όλων: $7\cdot 6 = 42$.`, sol: R`Οι πέντε έχουν άθροισμα $30$, άρα οι άλλοι δύο έχουν άθροισμα $12$: $x + 2x = 12 \Rightarrow x = 4$, άρα $4$ και $8$.` },
    { level: 2, type: "fields", q: R`Σε μια τάξη $20$ μαθητών, $3$ μαθητές δεν έχουν αδέλφια, $6$ έχουν $1$ αδελφό/ή, $7$ έχουν $2$, $3$ έχουν $3$ και $1$ μαθητής έχει $4$. Να βρείτε τη μέση τιμή, τη διάμεσο και την επικρατούσα τιμή του αριθμού των αδελφών.`,
      fields: [{ label: "μέση τιμή =", ans: 1.65 }, { label: "διάμεσος =", ans: 2 }, { label: "επικρατούσα =", ans: 2 }], hint: R`Οι μεσαίες τιμές είναι η 10η και η 11η.`, sol: R`$\bar{X} = \frac{3\cdot 0 + 6\cdot 1 + 7\cdot 2 + 3\cdot 3 + 1\cdot 4}{20} = \frac{33}{20} = 1{,}65$. Σε αύξουσα σειρά, οι θέσεις $1$–$3$ έχουν $0$, οι $4$–$9$ έχουν $1$, οι $10$–$16$ έχουν $2$: η 10η και η 11η τιμή είναι $2$, διάμεσος $2$. Επικρατούσα: $2$ (συχνότητα $7$).` },
    { level: 1, type: "mc", q: R`Σε ένα σύνολο τουλάχιστον τριών παρατηρήσεων αντικαθιστούμε τη μεγαλύτερη παρατήρηση με μια πολύ μεγαλύτερη τιμή. Η διάμεσος θα αλλάξει.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Η μεσαία θέση αλλάζει;`, sol: R`Λάθος: η μεγαλύτερη τιμή παραμένει στην τελευταία θέση, οπότε η μεσαία παρατήρηση (ή οι δύο μεσαίες) δεν αλλάζει. Αλλάζει όμως η μέση τιμή.` },
    { level: 2, type: "mc", q: R`Δίνονται οι τιμές $50,\ 100,\ 75,\ 60,\ 75,\ 1000,\ 90,\ 100$. Αν διαγράψουμε την τιμή $1000$, ποιο μέτρο θέσης θα επηρεαστεί περισσότερο;`, options: ["η μέση τιμή", "η διάμεσος", "οι επικρατούσες τιμές", "κανένα"], correct: 0,
      hint: R`Υπολόγισε πριν και μετά.`, sol: R`Μέση τιμή: από $\frac{1550}{8} = 193{,}75$ πέφτει σε $\frac{550}{7} \approx 78{,}6$. Διάμεσος: από $\frac{75 + 90}{2} = 82{,}5$ σε $75$. Επικρατούσες ($75$ και $100$): δεν αλλάζουν. Η μέση τιμή επηρεάζεται πολύ περισσότερο.` },
    { level: 3, type: "fields", q: R`Η μέση τιμή πέντε αριθμών είναι $18$. Αυξάνουμε τον πρώτο κατά $1$, τον δεύτερο κατά $2$, τον τρίτο κατά $3$, τον τέταρτο κατά $4$ και τον πέμπτο κατά $5$. Ποια είναι η νέα μέση τιμή;`,
      fields: [{ label: "νέα μέση τιμή =", ans: 21 }], hint: R`Αρχικό άθροισμα $5\cdot 18$.`, sol: R`Αρχικό άθροισμα $90$, προσθέτουμε $1 + 2 + 3 + 4 + 5 = 15$: νέο άθροισμα $105$, νέα μέση τιμή $\frac{105}{5} = 21$.` }
  ]
},
/* ───────────────────────────── 8.2 ───────────────────────────── */
{
  id: "8.2", unit: 8, title: "Πείραμα τύχης – Αρχή της απαρίθμησης",
  book: "Β΄ Τεύχος §8 · σελ. 136 · Δραστηριότητες σελ. 141 · Ενότητας σελ. 143",
  theory: EXAM + R`
<div class="tbox"><h4>Πιθανότητα ενδεχομένου (επανάληψη)</h4>
<p>Σε ένα πείραμα τύχης με <b>ισοπίθανα</b> αποτελέσματα:</p>
$$P(A) = \frac{\text{πλήθος ευνοϊκών αποτελεσμάτων του } A}{\text{πλήθος δυνατών αποτελεσμάτων}} = \frac{\nu(A)}{\nu(\Omega)}$$
<p>Π.χ. ζάρι: $\Omega = \{1, 2, 3, 4, 5, 6\}$, $B = \{2, 4, 6\}$ (άρτια ένδειξη), $P(B) = \frac36 = \frac12$.</p>
<p><b>Βέβαιο</b> ενδεχόμενο (ίσο με το $\Omega$): πιθανότητα $1$. <b>Αδύνατο</b> ενδεχόμενο ($\varnothing$): πιθανότητα $0$. Για κάθε ενδεχόμενο: $0 \le P(A) \le 1$.</p></div>
<div class="tbox"><h4>Δενδροδιάγραμμα</h4>
<p>Όταν ένα πείραμα πραγματοποιείται σε <b>δύο ή περισσότερες φάσεις</b>, βρίσκουμε όλα τα δυνατά αποτελέσματα με ένα <b>δενδροδιάγραμμα</b>. Π.χ. οικογένεια με δύο παιδιά (Α: αγόρι, Κ: κορίτσι): $\Omega = \{AA, AK, KA, KK\}$. Για δύο ζάρια βολεύει ένας <b>πίνακας</b> $6\times 6$ με $36$ ζεύγη.</p></div>
<div class="tbox tip"><h4>Αρχή της απαρίθμησης</h4>
<p>Όταν ένα πείραμα εκτελείται σε φάσεις και κάθε φάση μπορεί να πραγματοποιηθεί με $\kappa, \lambda, \mu, \dots$ τρόπους αντίστοιχα, τότε το πείραμα έχει $\kappa\cdot\lambda\cdot\mu\cdots$ δυνατά αποτελέσματα.</p>
<p>Π.χ. $2$ ζευγάρια παπούτσια, $3$ ζευγάρια κάλτσες, $3$ καπέλα: $2\cdot 3\cdot 3 = 18$ τρόποι. Δύο ζάρια: $\nu(\Omega) = 6\cdot 6 = 36$· «ίδια ένδειξη»: $6$ ευνοϊκά, $P = \frac{6}{36} = \frac16$.</p></div>`,
  widget: "h5count",
  gen: "h5prob",
  exercises: [
    { level: 1, type: "fields", q: R`Η Μαρία έχει $3$ μπλούζες, $2$ φούστες και $4$ ζευγάρια παπούτσια. Με πόσους διαφορετικούς τρόπους μπορεί να ντυθεί, αν διαλέξει ένα από κάθε είδος;`,
      fields: [{ label: "τρόποι =", ans: 24 }], hint: R`Αρχή της απαρίθμησης.`, sol: R`$3\cdot 2\cdot 4 = 24$ τρόποι.` },
    { level: 1, type: "fields", q: R`Ρίχνουμε δύο ζάρια. Να βρείτε την πιθανότητα (α) τα ζάρια να έχουν την ίδια ένδειξη, (β) το άθροισμα των ενδείξεων να είναι $8$.`,
      fields: [{ label: "(α) P =", ans: "1/6" }, { label: "(β) P =", ans: "5/36" }], hint: R`$\nu(\Omega) = 36$. Άθροισμα $8$: $(2, 6), (3, 5), \dots$`, sol: R`(α) $(1,1), \dots, (6,6)$: $\frac{6}{36} = \frac16$. (β) $(2,6), (3,5), (4,4), (5,3), (6,2)$: $\frac{5}{36}$.` },
    { level: 1, type: "fields", q: R`Ρίχνουμε πρώτα ένα νόμισμα και μετά ένα ζάρι. Πόσα είναι τα δυνατά αποτελέσματα και ποια η πιθανότητα να φέρουμε κορώνα και $6$;`,
      fields: [{ label: "ν(Ω) =", ans: 12 }, { label: "P =", ans: "1/12" }], hint: R`$2\cdot 6$.`, sol: R`$\nu(\Omega) = 2\cdot 6 = 12$. Ευνοϊκό μόνο το $(K, 6)$: $P = \frac{1}{12}$.` },
    { level: 1, type: "fields", q: R`Μια επιτροπή θα αποτελείται από ένα άτομο της επιτροπής περιβάλλοντος ($5$ μέλη) και ένα άτομο της επιτροπής εκδηλώσεων ($3$ μέλη). Πόσες διαφορετικές επιτροπές μπορούν να σχηματιστούν;`,
      fields: [{ label: "επιτροπές =", ans: 15 }], hint: R`Δύο φάσεις.`, sol: R`$5\cdot 3 = 15$.` },
    { level: 2, type: "fields", q: R`Μια οικογένεια έχει τρία παιδιά (κάθε παιδί αγόρι ή κορίτσι, ισοπίθανα). Να βρείτε την πιθανότητα (α) όλα να είναι αγόρια, (β) ακριβώς δύο να είναι κορίτσια, (γ) τουλάχιστον δύο να είναι κορίτσια.`,
      fields: [{ label: "(α) P =", ans: "1/8" }, { label: "(β) P =", ans: "3/8" }, { label: "(γ) P =", ans: "1/2" }], hint: R`$\nu(\Omega) = 2\cdot 2\cdot 2 = 8$. Φτιάξε δενδροδιάγραμμα.`, sol: R`$\Omega = \{AAA, AAK, AKA, AKK, KAA, KAK, KKA, KKK\}$. (α) $\frac18$. (β) $AKK, KAK, KKA$: $\frac38$. (γ) Αυτά τα τρία και το $KKK$: $\frac48 = \frac12$.` },
    { level: 2, type: "fields", q: R`Ρίχνουμε δύο ζάρια. Ποια είναι η πιθανότητα το <b>γινόμενο</b> των ενδείξεων να είναι άρτιος αριθμός;`,
      fields: [{ label: "P =", ans: "3/4" }], hint: R`Το γινόμενο είναι περιττό μόνο αν και οι δύο ενδείξεις είναι περιττές.`, sol: R`Περιττό γινόμενο: $3\cdot 3 = 9$ ζεύγη. Άρτιο: $36 - 9 = 27$. $P = \frac{27}{36} = \frac34$.` },
    { level: 2, type: "fields", q: R`Ο Ανδρέας προβλέπει ότι το άθροισμα δύο ζαριών θα είναι $5$ και ο Αλέξης ότι θα είναι $7$. Να βρείτε την πιθανότητα να κερδίσει ο καθένας και την πιθανότητα να μην κερδίσει κανείς.`,
      fields: [{ label: "P(Ανδρέας) =", ans: "1/9" }, { label: "P(Αλέξης) =", ans: "1/6" }, { label: "P(κανείς) =", ans: "13/18" }], hint: R`Άθροισμα $5$: $4$ ζεύγη· άθροισμα $7$: $6$ ζεύγη.`, sol: R`$P(5) = \frac{4}{36} = \frac19$, $P(7) = \frac{6}{36} = \frac16$ (καλύτερη πρόβλεψη ο Αλέξης). Κανείς: $\frac{36 - 10}{36} = \frac{26}{36} = \frac{13}{18}$.` },
    { level: 2, type: "fields", q: R`Ένας τριψήφιος κωδικός φτιάχνεται ως εξής: το πρώτο ψηφίο είναι περιττός αριθμός, το δεύτερο είναι $0$ ή $1$ και το τρίτο ένα από τα $3, 6, 9$. Πόσοι διαφορετικοί κωδικοί υπάρχουν;`,
      fields: [{ label: "κωδικοί =", ans: 30 }], hint: R`Περιττά ψηφία: $1, 3, 5, 7, 9$.`, sol: R`$5\cdot 2\cdot 3 = 30$ κωδικοί.` },
    { level: 1, type: "mc", q: R`Ρίχνουμε ένα νόμισμα δύο φορές. Αν φέρει την ίδια όψη και τις δύο φορές ξεκινά ο Ανδρέας, αλλιώς ο Λεωνίδας. Είναι δίκαιος ο τρόπος;`, options: ["Ναι, και οι δύο έχουν πιθανότητα $\\frac12$", "Όχι, ο Ανδρέας έχει πιθανότητα $\\frac13$", "Όχι, ο Λεωνίδας έχει πιθανότητα $\\frac34$", "Όχι, ο Ανδρέας έχει πιθανότητα $\\frac14$"], correct: 0,
      hint: R`$\Omega = \{KK, K\Gamma, \Gamma K, \Gamma\Gamma\}$.`, sol: R`Ίδια όψη: $KK, \Gamma\Gamma$ ($\frac24 = \frac12$). Διαφορετική: $K\Gamma, \Gamma K$ ($\frac12$). Ισοπίθανα, άρα δίκαιος.` }
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

/* Β΄ Γυμνασίου — widgets & γεννήτριες (μέρος 1: Επανάληψη, Πραγματικοί αριθμοί) */
const h1B = b => b < 0 ? `(${b})` : `${b}`;                                   /* βάση σε LaTeX */
const h1P = (b, e) => `${h1B(b)}^{${e}}`;                                      /* δύναμη σε LaTeX */
const h1Fr = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcdI(Math.abs(p), q) || 1; p /= g; q /= g; return q === 1 ? `${p}` : `${p}/${q}`; };
const h1IsSq = n => Number.isInteger(Math.sqrt(n));
const h1Dec = x => String(Math.round(x * 1000) / 1000).replace(".", ",");
const h1Dt = x => String(x).replace(".", "{,}");
const h1SqF = [2, 3, 5, 6, 7, 10, 11];
const h1Trip = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 1.1 Ιδιότητες δυνάμεων ---------- */
  h1pow(box) {
    box.innerHTML = `<div class="wctl"><label>βάση <select class="rb"><option>2</option><option>3</option><option>5</option><option>-2</option><option>10</option></select></label>
      <label>πράξη <select class="ro"><option value="0">α^μ · α^ν</option><option value="1">α^μ : α^ν</option><option value="2">(α^μ)^ν</option></select></label>
      <label>μ <input type="range" class="rm" min="1" max="6" value="4"><b class="vm"></b></label>
      <label>ν <input type="range" class="rn" min="1" max="4" value="2"><b class="vn"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const b = +$(".rb", box).value, op = +$(".ro", box).value, m = +$(".rm", box).value, n = +$(".rn", box).value;
      $(".vm", box).textContent = m; $(".vn", box).textContent = n;
      const B = b < 0 ? `(${b})` : `${b}`, svg = gyCanvas(box, 560, [110, 140, 165][op]), cw = 40, gap = 4;
      const cell = (x, y, col, txt, cross) => { gyAdd(svg, "rect", { x, y, width: cw, height: 32, rx: 5, style: `fill:${col};fill-opacity:.35;stroke:var(--navy);stroke-width:1.2` }); gyAdd(svg, "text", { x: x + cw / 2, y: y + 21, "text-anchor": "middle", style: gyTS + ";font-size:14px" }, txt); if (cross) gyAdd(svg, "line", { x1: x, y1: y + 32, x2: x + cw, y2: y, style: "stroke:var(--red);stroke-width:2.4" }); };
      let res, expl;
      if (op === 0) {
        for (let i = 0; i < m; i++) cell(14 + i * (cw + gap), 20, "var(--blue)", b);
        for (let i = 0; i < n; i++) cell(14 + (m + i) * (cw + gap) + 14, 20, "var(--green)", b);
        gyAdd(svg, "text", { x: 14, y: 85, style: gyTS }, `${m} + ${n} = ${m + n} παράγοντες`);
        res = m + n; expl = `${B}<sup>${m}</sup> · ${B}<sup>${n}</sup> = ${B}<sup>${m}+${n}</sup> = <b>${B}<sup>${m + n}</sup></b>`;
      } else if (op === 1) {
        for (let i = 0; i < m; i++) cell(14 + i * (cw + gap), 20, "var(--blue)", b, i < n);
        for (let i = 0; i < n; i++) cell(14 + i * (cw + gap), 66, "var(--green)", b, i < m);
        gyAdd(svg, "line", { x1: 10, y1: 59, x2: 14 + Math.max(m, n) * (cw + gap), y2: 59, style: "stroke:var(--navy);stroke-width:2" });
        res = m - n;
        gyAdd(svg, "text", { x: 14, y: 126, style: gyTS }, res > 0 ? `μένουν ${res} παράγοντες στον αριθμητή` : res === 0 ? "όλοι οι παράγοντες απλοποιούνται: μένει 1" : `μένουν ${-res} παράγοντες στον παρονομαστή`);
        expl = `${B}<sup>${m}</sup> : ${B}<sup>${n}</sup> = ${B}<sup>${m}−${n}</sup> = <b>${B}<sup>${res}</sup></b>` + (res === 0 ? " = 1" : res < 0 ? ` = 1 / ${B}<sup>${-res}</sup> <span class="muted">(αρνητικός εκθέτης — §1.2)</span>` : "");
      } else {
        for (let r = 0; r < n; r++) for (let i = 0; i < m; i++) cell(14 + i * (cw + gap), 8 + r * 38, ["var(--blue)", "var(--green)", "var(--purple)", "var(--red)"][r], b);
        gyAdd(svg, "text", { x: 14 + m * (cw + gap) + 16, y: 30, style: gyTS }, `${n} φορές το ${B}^${m}`);
        gyAdd(svg, "text", { x: 14 + m * (cw + gap) + 16, y: 52, style: gyTS }, `= ${m}·${n} = ${m * n} παράγοντες`);
        res = m * n; expl = `(${B}<sup>${m}</sup>)<sup>${n}</sup> = ${B}<sup>${m}·${n}</sup> = <b>${B}<sup>${m * n}</sup></b>`;
      }
      const v = b ** res;
      $(".wout", box).innerHTML = `${expl}${Math.abs(res) <= 12 && res > 0 ? ` = ${v.toLocaleString("el-GR")}` : ""}
        <br><span class="muted">Κάθε κουτάκι είναι ένας παράγοντας ίσος με τη βάση. Στο γινόμενο οι παράγοντες «μαζεύονται» (προσθέτουμε εκθέτες), στο πηλίκο απλοποιούνται (αφαιρούμε εκθέτες), στη δύναμη δύναμης επαναλαμβάνονται (πολλαπλασιάζουμε εκθέτες).</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 1.2 Αρνητικοί εκθέτες ---------- */
  h1negpow(box) {
    box.innerHTML = `<div class="wctl"><label>βάση <select class="rb"><option value="2,1">2</option><option value="3,1">3</option><option value="10,1">10</option><option value="-2,1">−2</option><option value="1,2">1/2</option><option value="2,3">2/3</option></select></label>
      <label>εκθέτης κ <input type="range" class="rk" min="-4" max="4" value="-3"><b class="vk"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const [p, q] = $(".rb", box).value.split(",").map(Number), k = +$(".rk", box).value; $(".vk", box).textContent = k;
      const B = q === 1 ? (p < 0 ? `(${p})` : `${p}`) : `(${p}/${q})`, svg = gyCanvas(box, 560, 130);
      const val = e => e >= 0 ? [p ** e, q ** e] : [q ** -e, p ** -e];
      for (let e = -4; e <= 4; e++) {
        const x = 14 + (e + 4) * 60, [a, c] = val(e), on = e === k;
        gyAdd(svg, "rect", { x, y: 30, width: 54, height: 56, rx: 6, style: `fill:${on ? "var(--red)" : e < 0 ? "var(--purple)" : "var(--blue)"};fill-opacity:${on ? .3 : .12};stroke:var(--navy);stroke-width:${on ? 2.4 : 1}` });
        gyAdd(svg, "text", { x: x + 27, y: 52, "text-anchor": "middle", style: gyTS + ";font-size:12px" }, `${B}^${e}`);
        const s = h1Fr(a, c); gyAdd(svg, "text", { x: x + 27, y: 74, "text-anchor": "middle", style: gyTS + `;font-size:${s.length > 6 ? 9 : 12}px` }, s);
      }
      gyAdd(svg, "text", { x: 280, y: 112, "text-anchor": "middle", style: gyTS + ";font-size:12px;fill:var(--muted)" }, `← διαιρούμε με ${q === 1 ? p : p + "/" + q}  ·  πολλαπλασιάζουμε με ${q === 1 ? p : p + "/" + q} →`);
      const [a, c] = val(k), inv = q === 1 ? `1/${p < 0 ? `(${p})` : p}` : `${q}/${p}`;
      $(".wout", box).innerHTML = k < 0
        ? `${B}<sup>${k}</sup> = (${inv})<sup>${-k}</sup> = 1 / ${B}<sup>${-k}</sup> = <b>${h1Fr(a, c)}</b>`
        : `${B}<sup>${k}</sup> = <b>${h1Fr(a, c)}</b>${k === 0 ? " (κάθε μη μηδενικός αριθμός με εκθέτη 0 ισούται με 1)" : ""}`;
      $(".wout", box).innerHTML += `<br><span class="muted">Κάθε φορά που ο εκθέτης μειώνεται κατά 1 διαιρούμε με τη βάση· έτσι οι αρνητικοί εκθέτες δίνουν τους αντίστροφους: α<sup>−μ</sup> = 1/α<sup>μ</sup>.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 1.3 Τετραγωνική και κυβική ρίζα ---------- */
  h1root(box) {
    box.innerHTML = `<div class="wctl"><label>ρίζα <select class="rt"><option value="2">τετραγωνική √</option><option value="3">κυβική ∛</option></select></label>
      <label>αριθμός α <input type="range" class="ra" min="0" max="225" value="49"><b class="va"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    let last = 2;
    function draw() {
      const t = +$(".rt", box).value, sl = $(".ra", box);
      if (t !== last) { sl.max = t === 2 ? 225 : 1000; sl.value = t === 2 ? 49 : 64; last = t; }
      const a = +sl.value; $(".va", box).textContent = a;
      const r = t === 2 ? Math.sqrt(a) : Math.cbrt(a), exact = Math.abs(Math.round(r) ** t - a) < 1e-9, lo = Math.floor(r + 1e-9), svg = gyCanvas(box, 560, 220);
      const unit = t === 2 ? Math.min(30, 180 / Math.max(r, 1)) : Math.min(30, 120 / Math.max(r, 1)), s = r * unit;
      if (t === 2) {
        for (let i = 0; i <= Math.ceil(r); i++) { gyAdd(svg, "line", { x1: 30 + Math.min(i * unit, s), y1: 20, x2: 30 + Math.min(i * unit, s), y2: 20 + s, style: "stroke:var(--navy);stroke-opacity:.25" }); gyAdd(svg, "line", { x1: 30, y1: 20 + Math.min(i * unit, s), x2: 30 + s, y2: 20 + Math.min(i * unit, s), style: "stroke:var(--navy);stroke-opacity:.25" }); }
        gyAdd(svg, "rect", { x: 30, y: 20, width: s, height: s, style: "fill:var(--blue);fill-opacity:.25;stroke:var(--navy);stroke-width:2.4" });
        gyAdd(svg, "text", { x: 30 + s / 2, y: 20 + s / 2 + 5, "text-anchor": "middle", style: gyTS }, `Ε = ${a}`);
      } else {
        const d = s * 0.45, x0 = 40, y0 = 30 + d;
        gyAdd(svg, "polygon", { points: `${x0},${y0} ${x0 + s},${y0} ${x0 + s},${y0 + s} ${x0},${y0 + s}`, style: "fill:var(--blue);fill-opacity:.25;stroke:var(--navy);stroke-width:2" });
        gyAdd(svg, "polygon", { points: `${x0},${y0} ${x0 + d},${y0 - d} ${x0 + s + d},${y0 - d} ${x0 + s},${y0}`, style: "fill:var(--blue);fill-opacity:.12;stroke:var(--navy);stroke-width:2" });
        gyAdd(svg, "polygon", { points: `${x0 + s},${y0} ${x0 + s + d},${y0 - d} ${x0 + s + d},${y0 + s - d} ${x0 + s},${y0 + s}`, style: "fill:var(--blue);fill-opacity:.35;stroke:var(--navy);stroke-width:2" });
        gyAdd(svg, "text", { x: x0 + s / 2, y: y0 + s / 2 + 5, "text-anchor": "middle", style: gyTS }, `V = ${a}`);
      }
      gyAdd(svg, "text", { x: 330, y: 60, style: gyTS }, `πλευρά = ${t === 2 ? "√" : "∛"}${a} ${exact ? "=" : "≈"} ${exact ? Math.round(r) : h1Dec(r)}`);
      if (!exact) gyAdd(svg, "text", { x: 330, y: 90, style: gyTS + ";fill:var(--muted)" }, `${lo}${t === 2 ? "²" : "³"} = ${lo ** t} < ${a} < ${(lo + 1) ** t} = ${lo + 1}${t === 2 ? "²" : "³"}`);
      $(".wout", box).innerHTML = (exact ? `<b>${t === 2 ? "√" : "∛"}${a} = ${Math.round(r)}</b>, γιατί ${Math.round(r)}<sup>${t}</sup> = ${a}. Το ${a} είναι <b>${t === 2 ? "τετράγωνος" : "κύβος"}</b> αριθμός.`
        : `Το ${a} δεν είναι ${t === 2 ? "τετράγωνος" : "κύβος"} αριθμός: ${lo} < ${t === 2 ? "√" : "∛"}${a} < ${lo + 1} (≈ ${h1Dec(r)}).`)
        + `<br><span class="muted">${t === 2 ? "Η τετραγωνική ρίζα του εμβαδού ενός τετραγώνου είναι η πλευρά του." : "Η κυβική ρίζα του όγκου ενός κύβου είναι η ακμή του."}</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 1.4 Ιδιότητες ριζών ---------- */
  h1rprop(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="0" max="64" value="9"><b class="va"></b></label>
      <label>β <input type="range" class="rb" min="1" max="64" value="16"><b class="vb"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, b = +$(".rb", box).value; $(".va", box).textContent = a; $(".vb", box).textContent = b;
      const f = x => Math.abs(x - Math.round(x)) < 1e-9 ? `= ${Math.round(x)}` : `≈ ${h1Dec(x)}`, sa = Math.sqrt(a), sb = Math.sqrt(b), svg = gyCanvas(box, 560, 150), k = 34;
      const bar = (y, w, col, lab, val = true) => { gyAdd(svg, "rect", { x: 150, y, width: Math.max(1, w * k), height: 26, rx: 4, style: `fill:${col};fill-opacity:.45` }); gyAdd(svg, "text", { x: 140, y: y + 18, "text-anchor": "end", style: gyTS + ";font-size:13px" }, lab); if (val) gyAdd(svg, "text", { x: 156 + w * k, y: y + 18, style: gyTS + ";font-size:13px" }, f(w)); };
      bar(20, sa, "var(--blue)", `√α + √β`, false); gyAdd(svg, "rect", { x: 150 + sa * k, y: 20, width: sb * k, height: 26, rx: 4, style: "fill:var(--green);fill-opacity:.45" });
      gyAdd(svg, "text", { x: 156 + (sa + sb) * k, y: 38, style: gyTS + ";font-size:13px" }, `${f(sa + sb)}`);
      bar(64, Math.sqrt(a + b), "var(--red)", "√(α + β)");
      gyAdd(svg, "text", { x: 20, y: 125, style: gyTS + ";font-size:13px;fill:var(--muted)" }, "Οι ράβδοι δείχνουν ότι γενικά √(α+β) ≠ √α + √β.");
      $(".wout", box).innerHTML = `√α · √β ${f(sa * sb)} &nbsp; και &nbsp; √(α·β) = √${a * b} ${f(Math.sqrt(a * b))} &nbsp; <b>✓ ίσα</b>
        <br>√α / √β ${f(sa / sb)} &nbsp; και &nbsp; √(α/β) ${f(Math.sqrt(a / b))} &nbsp; <b>✓ ίσα</b>
        <br>√α + √β ${f(sa + sb)} &nbsp; ενώ &nbsp; √(α+β) = √${a + b} ${f(Math.sqrt(a + b))} &nbsp; <b>${Math.abs(sa + sb - Math.sqrt(a + b)) < 1e-9 ? "= (μόνο επειδή α ή β είναι 0)" : "≠"}</b>
        <br><span class="muted">Η ρίζα «σπάει» σε γινόμενο και πηλίκο, όχι σε άθροισμα ή διαφορά.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 1.5 Πυθαγόρειο θεώρημα ---------- */
  h1pyth(box) {
    box.innerHTML = `<div class="wctl"><label>κάθετη α <input type="range" class="ra" min="1" max="12" value="3"><b class="va"></b></label>
      <label>κάθετη β <input type="range" class="rb" min="1" max="12" value="4"><b class="vb"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, b = +$(".rb", box).value; $(".va", box).textContent = a; $(".vb", box).textContent = b;
      const c2 = a * a + b * b, c = Math.sqrt(c2), svg = gyCanvas(box, 560, 320);
      const xmin = -b, xmax = a + b, ymin = -a, ymax = a + b, sc = Math.min(520 / (xmax - xmin), 290 / (ymax - ymin));
      const X = x => 20 + (x - xmin) * sc + (520 - (xmax - xmin) * sc) / 2, Y = y => 305 - (y - ymin) * sc;
      const poly = (pts, col, op) => gyAdd(svg, "polygon", { points: pts.map(([x, y]) => X(x) + "," + Y(y)).join(" "), style: `fill:${col};fill-opacity:${op};stroke:var(--navy);stroke-width:2` });
      const lab = (pts, txt) => { const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length; gyAdd(svg, "text", { x: X(cx), y: Y(cy) + 5, "text-anchor": "middle", style: gyTS + ";font-size:13px" }, txt); };
      const qa = [[0, 0], [a, 0], [a, -a], [0, -a]], qb = [[0, 0], [0, b], [-b, b], [-b, 0]], qc = [[a, 0], [0, b], [b, a + b], [a + b, a]];
      poly(qa, "var(--blue)", .3); poly(qb, "var(--green)", .3); poly(qc, "var(--red)", .22); poly([[0, 0], [a, 0], [0, b]], "var(--navy)", .08);
      lab(qa, `α² = ${a * a}`); lab(qb, `β² = ${b * b}`); lab(qc, `γ² = ${c2}`);
      const m = 0.5 * Math.min(a, b, 1.2); gyAdd(svg, "polyline", { points: `${X(m)},${Y(0)} ${X(m)},${Y(m)} ${X(0)},${Y(m)}`, style: "fill:none;stroke:var(--navy);stroke-width:1.6" });
      const exact = Number.isInteger(c);
      $(".wout", box).innerHTML = `α² + β² = ${a * a} + ${b * b} = <b>${c2} = γ²</b> &nbsp;⇒&nbsp; υποτείνουσα γ = √${c2} ${exact ? `= <b>${c}</b>` : `≈ ${h1Dec(c)} (άρρητος)`}
        ${exact ? `<br>Οι αριθμοί ${Math.min(a, b)}, ${Math.max(a, b)}, ${c} ${a === b ? "" : "αποτελούν <b>πυθαγόρεια τριάδα</b>."}` : ""}
        <br><span class="muted">Το εμβαδόν του κόκκινου τετραγώνου (πάνω στην υποτείνουσα) είναι ίσο με το άθροισμα των εμβαδών του μπλε και του πράσινου.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 1.6 Πραγματικοί αριθμοί ---------- */
  h1real(box) {
    box.innerHTML = `<div class="wctl"><label>ν <input type="range" class="rn" min="1" max="120" value="5"><b class="vn"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const n = +$(".rn", box).value; $(".vn", box).textContent = n;
      const r = Math.sqrt(n), lo = Math.floor(r + 1e-9), sq = h1IsSq(n), svg = gyCanvas(box, 560, 130), X = x => 20 + x * 520 / 11;
      gyAdd(svg, "line", { x1: X(0), y1: 70, x2: X(11), y2: 70, style: "stroke:var(--navy);stroke-width:2" });
      for (let i = 0; i <= 11; i++) { gyAdd(svg, "line", { x1: X(i), y1: 64, x2: X(i), y2: 76, style: "stroke:var(--navy);stroke-width:1.6" }); gyAdd(svg, "text", { x: X(i), y: 95, "text-anchor": "middle", style: gyTS + ";font-size:12px" }, i); }
      if (!sq) gyAdd(svg, "rect", { x: X(lo), y: 62, width: X(lo + 1) - X(lo), height: 16, style: "fill:var(--green);fill-opacity:.25" });
      gyAdd(svg, "circle", { cx: X(r), cy: 70, r: 6, style: `fill:${sq ? "var(--blue)" : "var(--red)"}` });
      gyAdd(svg, "text", { x: X(r), y: 48, "text-anchor": "middle", style: gyTS }, `√${n}`);
      const d = Math.floor(r * 10 + 1e-9) / 10;
      $(".wout", box).innerHTML = sq ? `√${n} = <b>${r}</b>: <b>ρητός</b> (μάλιστα φυσικός), γιατί ${r}² = ${n}.`
        : `√${n} ≈ ${h1Dec(r)}…: <b>άρρητος</b> — το ${n} δεν είναι τετράγωνος αριθμός.
          <br>${lo}² = ${lo * lo} < ${n} < ${(lo + 1) ** 2} = ${lo + 1}² &nbsp;⇒&nbsp; <b>${lo} < √${n} < ${lo + 1}</b>
          <br><span class="muted">Με δέκατα: ${h1Dec(d)}² = ${h1Dec(d * d)} < ${n} < ${h1Dec((d + 0.1) ** 2)} = ${h1Dec(d + 0.1)}², άρα ${h1Dec(d)} < √${n} < ${h1Dec(d + 0.1)}.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  h1pow: { title: "Γεννήτρια — ιδιότητες δυνάμεων", make() {
    const t = ri(0, 3), b = bkPick([2, 3, 5, 7, -2, -3, 10]);
    if (t === 0) { const m = ri(2, 7), n = ri(2, 7); return { q: R`Να γράψετε ως μία δύναμη: $${h1P(b, m)}\cdot ${h1P(b, n)}$. Ποιος είναι ο εκθέτης;`, fields: [{ label: "εκθέτης =", ans: m + n }], sol: R`$\alpha^\mu\cdot\alpha^\nu = \alpha^{\mu+\nu}$: $\ ${h1P(b, m)}\cdot ${h1P(b, n)} = ${h1P(b, m + n)}$.` }; }
    if (t === 1) { const n = ri(2, 6), m = n + ri(1, 6); return { q: R`Να γράψετε ως μία δύναμη: $${h1P(b, m)} : ${h1P(b, n)}$. Ποιος είναι ο εκθέτης;`, fields: [{ label: "εκθέτης =", ans: m - n }], sol: R`$\alpha^\mu : \alpha^\nu = \alpha^{\mu-\nu}$: $\ ${h1P(b, m)} : ${h1P(b, n)} = ${h1P(b, m - n)}$.` }; }
    if (t === 2) { const m = ri(2, 6), n = ri(2, 5); return { q: R`Να γράψετε ως μία δύναμη: $\left(${h1P(b, m)}\right)^{${n}}$. Ποιος είναι ο εκθέτης;`, fields: [{ label: "εκθέτης =", ans: m * n }], sol: R`$(\alpha^\mu)^\nu = \alpha^{\mu\nu}$: $\ \left(${h1P(b, m)}\right)^{${n}} = ${h1P(b, m * n)}$.` }; }
    const k = ri(2, 4), m = ri(2, 5), n = ri(2, 3);
    return { q: R`Να υπολογίσετε χωρίς υπολογιστική μηχανή: $\dfrac{${k * m}^{${n}}}{${m}^{${n}}}$.`, fields: [{ label: "=", ans: k ** n }], sol: R`$\dfrac{\alpha^\nu}{\beta^\nu} = \left(\dfrac\alpha\beta\right)^\nu$: $\ \left(\dfrac{${k * m}}{${m}}\right)^{${n}} = ${k}^{${n}} = ${k ** n}$.` };
  } },
  h1neg: { title: "Γεννήτρια — δυνάμεις με αρνητικό εκθέτη", make() {
    const t = ri(0, 2);
    if (t === 0) { const b = bkPick([2, 3, 4, 5, 10, -2, -3, -5]), n = ri(1, 3); if (Math.abs(b) ** n > 1000) return GENS.h1neg.make(); const den = b ** n;
      return { q: R`Να υπολογίσετε τη δύναμη $${h1P(b, -n)}$.`, fields: [{ label: "=", ans: h1Fr(1, den) }], sol: R`$${h1P(b, -n)} = ${n === 1 ? "" : R`\dfrac{1}{${h1P(b, n)}} = `}${texFrac(1, den)}$.` }; }
    if (t === 1) { let p, q; do { p = ri(1, 5); q = ri(2, 6); } while (gcdI(p, q) > 1); const s = bkPick([1, -1]), n = ri(1, 3), P = s * p;
      const num = s ** n * q ** n, den = p ** n; const base = R`\left(${s < 0 ? "-" : ""}\frac{${p}}{${q}}\right)`;
      return { q: R`Να υπολογίσετε τη δύναμη $${base}^{-${n}}$.`, fields: [{ label: "=", ans: h1Fr(num, den) }], sol: R`Αντίστροφη βάση, αντίθετος εκθέτης: $${base}^{-${n}} = ${n === 1 ? "" : R`\left(${s < 0 ? "-" : ""}${p === 1 ? q : R`\frac{${q}}{${p}}`}\right)^{${n}} = `}${texFrac(num, den)}$.` }; }
    const b = bkPick([2, 3, 5, 7, -2, -3]), m = gyNZ(-5, 6), n = gyNZ(-5, 5), k = gyNZ(-4, 5), e = m + n - k;
    return { q: R`Να γράψετε ως μία δύναμη: $${h1P(b, m)}\cdot ${h1P(b, n)} : ${h1P(b, k)}$. Ποιος είναι ο εκθέτης;`, fields: [{ label: "εκθέτης =", ans: e }],
      sol: R`Προσθέτουμε τους εκθέτες του γινομένου και αφαιρούμε του διαιρέτη: $${m}${n < 0 ? ` - ${-n}` : ` + ${n}`}${k < 0 ? ` + ${-k}` : ` - ${k}`} = ${e}$, άρα $${h1P(b, e)}$.` };
  } },
  h1root: { title: "Γεννήτρια — τετραγωνικές και κυβικές ρίζες", make() {
    const t = ri(0, 4);
    if (t === 0) { const k = ri(2, 20); return { q: R`Να υπολογίσετε: $\sqrt{${k * k}}$.`, fields: [{ label: "=", ans: k }], sol: R`$\sqrt{${k * k}} = ${k}$, γιατί $${k}^2 = ${k * k}$.` }; }
    if (t === 1) { const k = ri(1, 9), sq = k * k / 100; return { q: R`Να υπολογίσετε: $\sqrt{${h1Dt(sq)}}$.`, fields: [{ label: "=", ans: k / 10 }], sol: R`$\sqrt{${h1Dt(sq)}} = ${h1Dt(k / 10)}$, γιατί $${h1Dt(k / 10)}^2 = ${h1Dt(sq)}$.` }; }
    if (t === 2) { const k = ri(2, 10); return { q: R`Να υπολογίσετε: $\sqrt[3]{${k ** 3}}$.`, fields: [{ label: "=", ans: k }], sol: R`$\sqrt[3]{${k ** 3}} = ${k}$, γιατί $${k}^3 = ${k ** 3}$.` }; }
    if (t === 3) { let p, q; do { p = ri(1, 9); q = ri(2, 12); } while (gcdI(p, q) > 1); return { q: R`Να υπολογίσετε: $\sqrt{\dfrac{${p * p}}{${q * q}}}$.`, fields: [{ label: "=", ans: h1Fr(p, q) }], sol: R`$\sqrt{\dfrac{${p * p}}{${q * q}}} = ${texFrac(p, q)}$, γιατί $\left(${texFrac(p, q)}\right)^2 = \dfrac{${p * p}}{${q * q}}$.` }; }
    const k = ri(3, 15); return { q: R`Ένα τετράγωνο έχει εμβαδόν $${k * k}\ \text{cm}^2$. Πόση είναι η περίμετρός του;`, fields: [{ label: "περίμετρος (cm) =", ans: 4 * k }], sol: R`Πλευρά $\sqrt{${k * k}} = ${k}$ cm, περίμετρος $4\cdot ${k} = ${4 * k}$ cm.` };
  } },
  h1rprop: { title: "Γεννήτρια — ιδιότητες ριζών", make() {
    const t = ri(0, 3), m = bkPick(h1SqF);
    if (t === 0) { let x, y; do { x = ri(1, 4); y = ri(1, 4); } while (x === y && x === 1); const a = m * x * x, b = m * y * y;
      return { q: R`Να υπολογίσετε: $\sqrt{${a}}\cdot\sqrt{${b}}$.`, fields: [{ label: "=", ans: m * x * y }], sol: R`$\sqrt{${a}}\cdot\sqrt{${b}} = \sqrt{${a * b}} = ${m * x * y}$.` }; }
    if (t === 1) { const k = ri(2, 6), a = m * k * k; return { q: R`Να υπολογίσετε: $\dfrac{\sqrt{${a}}}{\sqrt{${m}}}$.`, fields: [{ label: "=", ans: k }], sol: R`$\dfrac{\sqrt{${a}}}{\sqrt{${m}}} = \sqrt{\dfrac{${a}}{${m}}} = \sqrt{${k * k}} = ${k}$.` }; }
    if (t === 2) { const k = ri(2, 6), n = k * k * m; return { q: R`Να γράψετε τον $\sqrt{${n}}$ στη μορφή $\alpha\sqrt\beta$, με $\beta$ όσο το δυνατό μικρότερο φυσικό.`, fields: [{ label: "α =", ans: k }, { label: "β =", ans: m }], sol: R`$\sqrt{${n}} = \sqrt{${k * k}\cdot ${m}} = \sqrt{${k * k}}\cdot\sqrt{${m}} = ${k}\sqrt{${m}}$.` }; }
    const a = ri(2, 9), b = ri(1, 9), c = ri(1, 9), s = a + b - c; if (s === 0) return GENS.h1rprop.make();
    const tm = v => v === 1 ? R`\sqrt{${m}}` : R`${v}\sqrt{${m}}`;
    return { q: R`Η παράσταση $${tm(a)} + ${tm(b)} - ${tm(c)}$ γράφεται $\kappa\sqrt{${m}}$. Να βρείτε το $\kappa$.`, fields: [{ label: "κ =", ans: s }], sol: R`Όμοιες ρίζες: $(${a} + ${b} - ${c})\sqrt{${m}} = ${s === 1 ? "" : s === -1 ? "-" : s}\sqrt{${m}}$.` };
  } },
  h1pyth: { title: "Γεννήτρια — Πυθαγόρειο θεώρημα", make() {
    const t = ri(0, 2), [p, q, r] = bkPick(h1Trip), k = ri(1, 3), a = p * k, b = q * k, c = r * k; if (c > 50) return GENS.h1pyth.make();
    if (t === 0) return { q: R`Οι κάθετες πλευρές ενός ορθογώνιου τριγώνου είναι $${a}$ cm και $${b}$ cm. Να υπολογίσετε την υποτείνουσα.`, fields: [{ label: "υποτείνουσα (cm) =", ans: c }], sol: R`$\gamma^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c} \Rightarrow \gamma = \sqrt{${c * c}} = ${c}$ cm.` };
    if (t === 1) { const [u, v] = ri(0, 1) ? [a, b] : [b, a]; return { q: R`Η υποτείνουσα ενός ορθογώνιου τριγώνου είναι $${c}$ cm και η μία κάθετη πλευρά $${u}$ cm. Να υπολογίσετε την άλλη κάθετη πλευρά.`, fields: [{ label: "κάθετη (cm) =", ans: v }], sol: R`$x^2 = ${c}^2 - ${u}^2 = ${c * c} - ${u * u} = ${v * v} \Rightarrow x = \sqrt{${v * v}} = ${v}$ cm.` }; }
    const right = ri(0, 1) === 1, cc = right ? c : c + bkPick([-1, 1]);
    return bkMC({ q: R`Ένα τρίγωνο έχει πλευρές $${a}$, $${b}$ και $${cc}$. Είναι ορθογώνιο;`, sol: R`$${a}^2 + ${b}^2 = ${a * a + b * b}$ και $${cc}^2 = ${cc * cc}$. ${right ? R`Είναι ίσα, άρα (αντίστροφο του Π.Θ.) το τρίγωνο είναι ορθογώνιο, με ορθή γωνία απέναντι από την πλευρά $${cc}$.` : "Δεν είναι ίσα, άρα το τρίγωνο δεν είναι ορθογώνιο."}` },
      ["Ναι", "Όχι"], right ? 0 : 1);
  } },
  h1real: { title: "Γεννήτρια — ρητοί, άρρητοι, προσέγγιση ριζών", make() {
    const t = ri(0, 2); let n; do n = ri(2, 150); while (h1IsSq(n)); const lo = Math.floor(Math.sqrt(n));
    if (t === 0) return { q: R`Ανάμεσα σε ποιους δύο διαδοχικούς ακέραιους βρίσκεται ο $\sqrt{${n}}$;`, fields: [{ label: "μικρότερος =", ans: lo }, { label: "μεγαλύτερος =", ans: lo + 1 }], sol: R`$${lo * lo} < ${n} < ${(lo + 1) ** 2} \Rightarrow ${lo} < \sqrt{${n}} < ${lo + 1}$.` };
    if (t === 1) { const r = Math.round(Math.sqrt(n)); return { q: R`Να προσεγγίσετε τον $\sqrt{${n}}$ με την πλησιέστερη ακέραια μονάδα.`, fields: [{ label: "≈", ans: r }], sol: R`$${lo} < \sqrt{${n}} < ${lo + 1}$ και $\sqrt{${n}} \approx ${h1Dt(Math.round(Math.sqrt(n) * 100) / 100)}$, άρα $\approx ${r}$.` }; }
    const sq = ri(0, 1) === 1, cube = ri(0, 2) === 0;
    let tex, rat;
    if (cube) { const k = ri(2, 6), v = sq ? k ** 3 : k ** 3 + bkPick([-1, 1, 2]); tex = R`\sqrt[3]{${v}}`; rat = sq; }
    else { const k = ri(2, 12), v = sq ? k * k : n; tex = R`\sqrt{${v}}`; rat = sq; }
    return bkMC({ q: R`Ο αριθμός $${tex}$ είναι:`, sol: rat ? R`Το υπόριζο είναι ${cube ? "κύβος" : "τετράγωνος αριθμός"}, άρα η ρίζα είναι φυσικός αριθμός: <b>ρητός</b>.` : R`Το υπόριζο δεν είναι ${cube ? "κύβος" : "τετράγωνος αριθμός"}, άρα ο αριθμός είναι <b>άρρητος</b>.` },
      ["ρητός", "άρρητος"], rat ? 0 : 1);
  } }
});

/* Β΄ Γυμνασίου — widgets & γεννήτριες (μέρος 2: Αλγεβρικές παραστάσεις) */
/* πολυώνυμο από συντελεστές (από τον μεγιστοβάθμιο προς τον σταθερό όρο) */
const h2P = (cs, v = "x") => {
  let s = ""; const n = cs.length;
  cs.forEach((c, i) => {
    const e = n - 1 - i; if (!c) return; const a = Math.abs(c);
    const body = e === 0 ? String(a) : (a === 1 ? "" : a) + v + (e > 1 ? `^{${e}}` : "");
    s += s ? (c < 0 ? " - " : " + ") + body : (c < 0 ? "-" : "") + body;
  });
  return s || "0";
};
/* μονώνυμο: συντελεστής + λίστα [μεταβλητή(tex), εκθέτης] */
const h2M = (c, vs) => {
  const body = vs.filter(([, e]) => typeof e === "string" || e > 0).map(([v, e]) => v + (typeof e === "string" || e > 1 ? `^{${e}}` : "")).join(" ");
  if (!body) return String(c);
  return c === 1 ? body : c === -1 ? "-" + body : c + body;
};
/* HTML μορφή μονωνύμου στο x */
const h2H = (c, e, v = "x") => { if (c === 0) return "0"; const a = Math.abs(c), s = c < 0 ? "−" : ""; if (e === 0) return s + a; return s + (a === 1 ? "" : a) + `<i>${v}</i>` + (e > 1 ? `<sup>${e}</sup>` : ""); };
const h2VARS = [[["x", "x"], ["y", "y"]], [["\\alpha", "α"], ["\\beta", "β"]], [["x", "x"], ["\\omega", "ω"]]];
const h2Ord = n => n + "ου";
const h2Add = t => t[0] === "-" ? " - " + t.slice(1) : " + " + t;
const h2Fr = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcdI(Math.abs(p), q) || 1; return [p / g, q / g]; };
const h2FT = ([p, q]) => q === 1 ? String(p) : (p < 0 ? "-" : "") + `\\frac{${Math.abs(p)}}{${q}}`;

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 2.1 Μονώνυμα: συντελεστής, κύριο μέρος, βαθμός ---------- */
  h2mono(box) {
    box.innerHTML = `<div class="wctl"><label>συντελεστής <input type="range" class="rc" min="-6" max="6" value="-2"><b class="vc"></b></label>
      <label>εκθέτης του x <input type="range" class="rx" min="0" max="5" value="2"><b class="vx"></b></label>
      <label>εκθέτης του y <input type="range" class="ry" min="0" max="5" value="1"><b class="vy"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const c = +$(".rc", box).value, ex = +$(".rx", box).value, ey = +$(".ry", box).value;
      $(".vc", box).textContent = c; $(".vx", box).textContent = ex; $(".vy", box).textContent = ey;
      const svg = gyCanvas(box, 560, 170);
      const main = (ex ? "x" + (ex > 1 ? "^" + ex : "") : "") + (ey ? "y" + (ey > 1 ? "^" + ey : "") : "");
      const coefTxt = c === 0 ? "0" : main && Math.abs(c) === 1 ? (c < 0 ? "−1" : "1") : (c < 0 ? "−" : "") + Math.abs(c);
      gyAdd(svg, "rect", { x: 120, y: 30, width: 130, height: 70, rx: 10, style: "fill:rgba(15,111,209,.14);stroke:var(--blue);stroke-width:2" });
      gyAdd(svg, "rect", { x: 270, y: 30, width: 170, height: 70, rx: 10, style: "fill:rgba(25,135,84,.14);stroke:var(--green);stroke-width:2" });
      gyAdd(svg, "text", { x: 185, y: 76, "text-anchor": "middle", style: gyTS + ";font-size:30px;fill:var(--blue)" }, coefTxt);
      const t = gyAdd(svg, "text", { x: 355, y: 76, "text-anchor": "middle", style: gyTS + ";font-size:30px;fill:var(--green)" });
      if (!main) t.textContent = "—";
      [["x", ex], ["y", ey]].forEach(([v, e]) => { if (!e) return; const a = svgEl("tspan", { "font-style": "italic" }); a.textContent = v; t.appendChild(a); if (e > 1) { const b = svgEl("tspan", { dy: -12, "font-size": "18px" }); b.textContent = e; t.appendChild(b); const z = svgEl("tspan", { dy: 12 }); z.textContent = "\u200a"; t.appendChild(z); } });
      gyAdd(svg, "text", { x: 185, y: 130, "text-anchor": "middle", style: gyTS + ";fill:var(--blue)" }, "συντελεστής");
      gyAdd(svg, "text", { x: 355, y: 130, "text-anchor": "middle", style: gyTS + ";fill:var(--green)" }, "κύριο μέρος");
      const M = h2M(c, [["x", ex], ["y", ey]]), deg = ex + ey;
      let html;
      if (c === 0) html = `Το $0$ είναι το <b>μηδενικό μονώνυμο</b>: ο βαθμός του <b>δεν ορίζεται</b>.`;
      else html = `Μονώνυμο $${M}$ · συντελεστής $${c}$ · κύριο μέρος $${main ? h2M(1, [["x", ex], ["y", ey]]) : "—"}$<br>
        Βαθμός ως προς $x$: <b>${ex}</b> · ως προς $y$: <b>${ey}</b> · βαθμός (ως προς όλες τις μεταβλητές): <b>${deg}</b>${deg === 0 ? " (σταθερό μονώνυμο)" : ""}<br>
        <span class="muted">Αντίθετο: $${h2M(-c, [["x", ex], ["y", ey]])}$ · ένα όμοιο: $${h2M(c === 5 ? 2 : 5, [["x", ex], ["y", ey]])}$ (ίδιο κύριο μέρος, άλλος συντελεστής).</span>`;
      $(".wout", box).innerHTML = html; typeset($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 2.2 Πράξεις μονωνύμων ---------- */
  h2monoops(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="-6" max="6" value="6"><b class="va"></b></label>
      <label>μ <input type="range" class="rm" min="0" max="5" value="3"><b class="vm"></b></label>
      <label>β <input type="range" class="rb" min="-6" max="6" value="-2"><b class="vb"></b></label>
      <label>ν <input type="range" class="rn" min="0" max="5" value="1"><b class="vn"></b></label>
      <label>πράξη <select class="op"><option value="+">πρόσθεση</option><option value="-">αφαίρεση</option><option value="*" selected>πολλαπλασιασμός</option><option value=":">διαίρεση</option></select></label></div><div class="wout"></div>`;
    function draw() {
      let a = +$(".ra", box).value, b = +$(".rb", box).value; const m = +$(".rm", box).value, n = +$(".rn", box).value, op = $(".op", box).value;
      ["a", "m", "b", "n"].forEach((k, i) => $(".v" + k, box).textContent = [a, m, b, n][i]);
      const A = h2M(a, [["x", m]]), B = h2M(b, [["x", n]]), Bp = b < 0 ? `(${B})` : B;
      let out;
      if (op === "+" || op === "-") {
        const s = op === "+" ? 1 : -1, sym = op === "+" ? "+" : "-";
        if (a === 0 || b === 0) {
          const c = a === 0 ? s * b : a, e = a === 0 ? n : m;
          out = `$${A} ${sym} ${Bp} = ${h2M(c, [["x", e]])}$<br><span class="muted">Ένα από τα μονώνυμα είναι το μηδενικό μονώνυμο.</span>`;
        } else if (m === n) {
          const c = a + s * b;
          out = `$${A} ${sym} ${Bp} = (${a} ${sym} ${b < 0 ? `(${b})` : b})${m ? h2M(1, [["x", m]]) : ""} = ${h2M(c, [["x", m]])}$<br><span class="muted">Όμοια μονώνυμα: κρατάμε το κύριο μέρος και ${op === "+" ? "προσθέτουμε" : "αφαιρούμε"} τους συντελεστές (αναγωγή ομοίων όρων).${c === 0 ? " Το αποτέλεσμα είναι το μηδενικό μονώνυμο." : ""}</span>`;
        } else out = `$${A} ${sym} ${Bp} = ${A}${h2Add(h2M(s * b, [["x", n]]))}$<br><span class="muted">Τα μονώνυμα <b>δεν είναι όμοια</b> (διαφορετικό κύριο μέρος): δεν γίνεται αναγωγή, το αποτέλεσμα είναι πολυώνυμο με δύο όρους (διώνυμο).</span>`;
      } else if (op === "*") {
        out = `$${A}\\cdot ${Bp} = (${a}\\cdot ${b < 0 ? `(${b})` : b})\\cdot x^{${m} + ${n}} = ${h2M(a * b, [["x", m + n]])}$<br><span class="muted">Πολλαπλασιάζουμε τους συντελεστές και τα κύρια μέρη: $x^\\mu\\cdot x^\\nu = x^{\\mu + \\nu}$.</span>`;
      } else {
        if (b === 0) out = `Η διαίρεση με το μηδενικό μονώνυμο <b>δεν ορίζεται</b>.`;
        else {
          const fr = h2Fr(a, b), c = h2FT(fr);
          if (m >= n) out = `$${A} : ${Bp} = \\frac{${a}}{${b}}\\cdot x^{${m} - ${n}} = ${a === 0 ? "0" : (fr[1] === 1 ? h2M(fr[0], [["x", m - n]]) : c + (m - n ? (m - n > 1 ? `x^{${m - n}}` : "x") : ""))}$<br><span class="muted">Διαιρούμε τους συντελεστές και τα κύρια μέρη: $x^\\mu : x^\\nu = x^{\\mu - \\nu}$. Το πηλίκο είναι μονώνυμο.</span>`;
          else out = `$${A} : ${Bp} = ${a === 0 ? "0" : `\\frac{${h2M(fr[0], [])}}{${fr[1] === 1 ? "" : fr[1]}${n - m > 1 ? `x^{${n - m}}` : "x"}}`}$<br><span class="muted">${a === 0 ? "Το μηδενικό μονώνυμο διαιρούμενο δίνει 0." : "Ο εκθέτης του διαιρέτη είναι μεγαλύτερος: μένει $x$ στον παρονομαστή, άρα το πηλίκο <b>δεν είναι μονώνυμο</b>."}</span>`;
        }
      }
      $(".wout", box).innerHTML = out; typeset($(".wout", box));
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 2.3 Αλγεβρικά πλακίδια: πρόσθεση/αφαίρεση πολυωνύμων ---------- */
  h2tiles(box) {
    const rng = (c, v, lab) => `<label>${lab} <input type="range" class="r${c}" min="-3" max="3" value="${v}"><b class="v${c}"></b></label>`;
    box.innerHTML = `<div class="wctl">${rng("a2", 1, "A: x²")}${rng("a1", 1, "x")}${rng("a0", -2, "1")}</div>
      <div class="wctl">${rng("b2", 2, "B: x²")}${rng("b1", -2, "x")}${rng("b0", 3, "1")}
      <label>πράξη <select class="op"><option value="+">A + B</option><option value="-">A − B</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    function row(svg, y, cs, label) {
      gyAdd(svg, "text", { x: 10, y: y + 26, style: gyTS }, label);
      let x = 70;
      const put = (n, w, h, col) => { for (let i = 0; i < Math.abs(n); i++) { gyAdd(svg, "rect", { x, y: y + (40 - h), width: w, height: h, rx: 3, style: `fill:${n > 0 ? col : "var(--red)"};fill-opacity:.65;stroke:var(--navy);stroke-width:1` }); x += w + 5; } if (n) x += 12; };
      put(cs[0], 40, 40, "var(--blue)"); put(cs[1], 12, 40, "var(--green)"); put(cs[2], 12, 12, "var(--amber)");
      if (!cs[0] && !cs[1] && !cs[2]) gyAdd(svg, "text", { x: 70, y: y + 26, style: gyTS }, "0 (κανένα πλακίδιο)");
    }
    function draw() {
      const g = k => +$(".r" + k, box).value; ["a2", "a1", "a0", "b2", "b1", "b0"].forEach(k => $(".v" + k, box).textContent = g(k));
      const A = [g("a2"), g("a1"), g("a0")], B = [g("b2"), g("b1"), g("b0")], op = $(".op", box).value, s = op === "+" ? 1 : -1;
      const B2 = B.map(c => s * c), R = A.map((c, i) => c + B2[i]);
      const svg = gyCanvas(box, 560, 230);
      row(svg, 10, A, "A"); row(svg, 75, B2, op === "+" ? "B" : "−B"); gyAdd(svg, "line", { x1: 10, y1: 135, x2: 550, y2: 135, style: "stroke:var(--navy);stroke-width:2" }); row(svg, 150, R, "=");
      const zp = A.reduce((t, c, i) => t + (c * B2[i] < 0 ? Math.min(Math.abs(c), Math.abs(B2[i])) : 0), 0);
      $(".wout", box).innerHTML = `$(${h2P(A)}) ${op} (${h2P(B)}) = ${h2P(R)}$<br><span class="muted">${op === "-" ? "Για την αφαίρεση προσθέτουμε τα <b>αντίθετα</b> πλακίδια του B (αλλάζουμε τα πρόσημα όλων των όρων του). " : ""}Ένα θετικό και ένα αρνητικό πλακίδιο του ίδιου είδους κάνουν μηδέν${zp ? ` — εδώ αλληλοαναιρούνται ${zp} ζεύγη` : ""}. Αυτό είναι η αναγωγή ομοίων όρων. Μπλε: $x^2$, πράσινο: $x$, κίτρινο: $1$, κόκκινο: αρνητικά.</span>`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 2.4 Μοντέλο εμβαδού: (αx + β)(γx + δ) ---------- */
  h2area(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="1" max="3" value="1"><b class="va"></b></label>
      <label>β <input type="range" class="rb" min="0" max="5" value="2"><b class="vb"></b></label>
      <label>γ <input type="range" class="rc" min="1" max="3" value="2"><b class="vc"></b></label>
      <label>δ <input type="range" class="rd" min="0" max="5" value="3"><b class="vd"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, b = +$(".rb", box).value, c = +$(".rc", box).value, d = +$(".rd", box).value;
      ["a", "b", "c", "d"].forEach((k, i) => $(".v" + k, box).textContent = [a, b, c, d][i]);
      const X = 54, U = 16, TW = a * X + b * U, TH = c * X + d * U, x0 = Math.max(150, 300 - TW / 2), y0 = 40, svg = gyCanvas(box, 560, TH + 60);
      const cols = [...Array(a).fill(X), ...Array(b).fill(U)], rows = [...Array(c).fill(X), ...Array(d).fill(U)];
      let yy = y0;
      rows.forEach((h, j) => {
        let xx = x0;
        cols.forEach((w, i) => {
          const col = w === X && h === X ? "var(--blue)" : w === U && h === U ? "var(--amber)" : "var(--green)";
          gyAdd(svg, "rect", { x: xx, y: yy, width: w, height: h, style: `fill:${col};fill-opacity:.55;stroke:#fff;stroke-width:1.5` });
          if (j === 0) gyAdd(svg, "text", { x: xx + w / 2, y: y0 - 8, "text-anchor": "middle", style: gyTS + ";font-size:12px" }, w === X ? "x" : "1");
          xx += w;
        });
        gyAdd(svg, "text", { x: x0 - 8, y: yy + h / 2 + 4, "text-anchor": "end", style: gyTS + ";font-size:12px" }, h === X ? "x" : "1");
        yy += h;
      });
      gyAdd(svg, "text", { x: 20, y: 30, style: gyTS }, `πλάτος: ${h2P([a, b]).replace("^{2}", "²")}`);
      gyAdd(svg, "text", { x: 20, y: 52, style: gyTS }, `ύψος: ${h2P([c, d])}`);
      $(".wout", box).innerHTML = `$(${h2P([a, b])})(${h2P([c, d])}) = ${h2M(a * c, [["x", 2]])}${a * d ? " + " + h2M(a * d, [["x", 1]]) : ""}${b * c ? " + " + h2M(b * c, [["x", 1]]) : ""}${b * d ? " + " + b * d : ""} = ${h2P([a * c, a * d + b * c, b * d])}$<br>
        <span class="muted">Κάθε όρος του πρώτου πολυωνύμου πολλαπλασιάζεται με κάθε όρο του δεύτερου. Μπλε: ${a * c} πλακίδια $x^2$, πράσινα: ${a * d + b * c} πλακίδια $x$, κίτρινα: ${b * d} μονάδες.</span>`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 2.5 Διαίρεση πολυωνύμου με πολυώνυμο ---------- */
  h2div(box) {
    box.innerHTML = `<div class="wctl"><label>Δ: x² <input type="range" class="ra" min="1" max="6" value="6"><b class="va"></b></label>
      <label>x <input type="range" class="rb" min="-9" max="9" value="5"><b class="vb"></b></label>
      <label>1 <input type="range" class="rc" min="-9" max="9" value="3"><b class="vc"></b></label></div>
      <div class="wctl"><label>δ: x <input type="range" class="rp" min="1" max="3" value="2"><b class="vp"></b></label>
      <label>1 <input type="range" class="rq" min="-5" max="5" value="1"><b class="vq"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const g = k => +$(".r" + k, box).value, a = g("a"), b = g("b"), c = g("c"), p = g("p"), q = g("q");
      ["a", "b", "c", "p", "q"].forEach(k => $(".v" + k, box).textContent = g(k));
      /* ρητή αριθμητική */
      const F = (n, d = 1) => h2Fr(n, d), mul = (x, y) => F(x[0] * y[0], x[1] * y[1]), sub = (x, y) => F(x[0] * y[1] - y[0] * x[1], x[1] * y[1]);
      const m1 = F(a, p), r1 = sub(F(b), mul(m1, F(q))), m0 = F(r1[0], r1[1] * p), r = sub(F(c), mul(m0, F(q)));
      const T = (f, tail) => { if (f[0] === 0) return ""; const ab = [Math.abs(f[0]), f[1]], s = f[0] < 0 ? "-" : "+"; const num = ab[1] === 1 ? (ab[0] === 1 && tail ? "" : ab[0]) : `\\frac{${ab[0]}}{${ab[1]}}`; return { s, t: num + tail }; };
      const poly = arr => { let o = ""; arr.forEach(([f, tail]) => { const k = T(f, tail); if (!k) return; o += o ? ` ${k.s} ${k.t}` : (k.s === "-" ? "-" : "") + k.t; }); return o || "0"; };
      const D = h2P([a, b, c]), d = h2P([p, q]), Q = poly([[m1, "x"], [m0, ""]]), Rr = poly([[r, ""]]);
      const neg1 = poly([[F(-m1[0] * p, m1[1]), "x^{2}"], [F(-m1[0] * q, m1[1]), "x"]]), part1 = poly([[r1, "x"], [F(c), ""]]), neg2 = poly([[F(-m0[0] * p, m0[1]), "x"], [F(-m0[0] * q, m0[1]), ""]]);
      const pl = $(".pl", box);
      pl.innerHTML = `<div style="overflow-x:auto"><table style="border-collapse:collapse;margin:6px auto;font-size:15px">
        <tr><td style="padding:4px 14px;text-align:right">$${D}$</td><td style="padding:4px 14px;border-left:2px solid var(--navy);border-bottom:2px solid var(--navy)">$${d}$</td></tr>
        <tr><td style="padding:4px 14px;text-align:right">$${neg1}$</td><td style="padding:4px 14px;border-left:2px solid var(--navy);font-weight:700">$${Q}$</td></tr>
        <tr><td style="padding:4px 14px;text-align:right;border-top:1px solid var(--line)">$${part1}$</td><td style="border-left:2px solid var(--navy)"></td></tr>
        <tr><td style="padding:4px 14px;text-align:right">$${neg2}$</td><td style="border-left:2px solid var(--navy)"></td></tr>
        <tr><td style="padding:4px 14px;text-align:right;border-top:1px solid var(--line)"><b>$${Rr}$</b></td><td style="border-left:2px solid var(--navy)"></td></tr></table></div>`;
      typeset(pl);
      $(".wout", box).innerHTML = `Πηλίκο $\\pi(x) = ${Q}$, υπόλοιπο $\\upsilon(x) = ${Rr}$.<br>Ταυτότητα της ευκλείδειας διαίρεσης: $${D} = (${d})(${Q})${r[0] ? (r[0] < 0 ? " " : " + ") + Rr : ""}$<br>
        <span class="muted">${r[0] === 0 ? `<b>Τέλεια διαίρεση</b>: το $${d}$ είναι παράγοντας του $${D}$.` : "Η διαδικασία σταματά όταν το μερικό υπόλοιπο έχει μικρότερο βαθμό από τον διαιρέτη."} Κάθε φορά διαιρούμε τον πρώτο όρο του (μερικού) διαιρετέου με τον πρώτο όρο του διαιρέτη, πολλαπλασιάζουμε και προσθέτουμε το αντίθετο.</span>`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  h2mono: { title: "Γεννήτρια — μονώνυμα", make() {
    const V = bkPick(h2VARS), t = ri(0, 3), c = gyNZ(-9, 9), e1 = ri(1, 5), e2 = ri(1, 4);
    const M = h2M(c, [[V[0][0], e1], [V[1][0], e2]]);
    if (t === 0) return { q: R`Για το μονώνυμο $${M}$ να βρείτε τον συντελεστή, τον βαθμό ως προς $${V[0][0]}$ και τον βαθμό του (ως προς όλες τις μεταβλητές).`,
      fields: [{ label: "συντελεστής =", ans: c }, { label: `βαθμός ως προς ${V[0][1]} =`, ans: e1 }, { label: "βαθμός =", ans: e1 + e2 }],
      sol: R`Συντελεστής $${c}$, κύριο μέρος $${h2M(1, [[V[0][0], e1], [V[1][0], e2]])}$. Βαθμός ως προς $${V[0][0]}$: $${e1}$, βαθμός: $${e1} + ${e2} = ${e1 + e2}$.` };
    if (t === 1) { const c2 = gyNZ(-9, 9); return { q: R`Να βρείτε τις τιμές των $\mu$ και $\nu$, ώστε τα μονώνυμα $${h2M(c, [[V[0][0], e1], [V[1][0], "\\nu"]]).replace("^{\\nu}", "^{\\nu}")}$ και $${h2M(c2, [[V[0][0], "\\mu"], [V[1][0], e2]])}$ να είναι όμοια.`,
      fields: [{ label: "μ =", ans: e1 }, { label: "ν =", ans: e2 }], sol: R`Όμοια μονώνυμα έχουν το ίδιο κύριο μέρος: $${h2M(1, [[V[0][0], e1], [V[1][0], e2]])}$. Άρα $\mu = ${e1}$ και $\nu = ${e2}$.` }; }
    if (t === 2) {
      const ok = h2M(c === 7 ? -3 : c === -7 ? 3 : 7, [[V[0][0], e1], [V[1][0], e2]]), op = h2M(-c, [[V[0][0], e1], [V[1][0], e2]]);
      const w1 = h2M(c, [[V[0][0], e2 === e1 ? e1 + 1 : e2], [V[1][0], e2 === e1 ? e2 : e1]]), w2 = h2M(c, [[V[0][0], e1 + 1], [V[1][0], e2]]), w3 = h2M(c, [[V[0][0], e1]]);
      const w4 = h2M(c, [[V[0][0], e1], [V[1][0], e2 + 1]]), wrong = [...new Set([w1, w2, w3, w4])].filter(w => w !== M).slice(0, 3);
      return bkMC({ q: R`Ποιο από τα πιο κάτω μονώνυμα είναι <b>όμοιο</b> με το $${M}$;`, sol: R`Όμοιο είναι το μονώνυμο με το ίδιο κύριο μέρος $${h2M(1, [[V[0][0], e1], [V[1][0], e2]])}$: το $${ok}$ (ο συντελεστής δεν παίζει ρόλο· το $${op}$ είναι το αντίθετό του).` },
        [`$${ok}$`, ...wrong.map(w => `$${w}$`)], 0);
    }
    const x = bkPick([-2, -1, 2, 3]), y = bkPick([-1, 1, 2]), a1 = ri(1, 3), a2 = ri(1, 2), v = c * x ** a1 * y ** a2;
    return { q: R`Να βρείτε την αριθμητική τιμή του μονωνύμου $${h2M(c, [["x", a1], ["y", a2]])}$ για $x = ${x}$ και $y = ${y}$.`, fields: [{ label: "τιμή =", ans: v }],
      sol: R`$${c}\cdot (${x})${a1 > 1 ? `^{${a1}}` : ""}\cdot (${y})${a2 > 1 ? `^{${a2}}` : ""} = ${c}\cdot ${x ** a1 < 0 ? `(${x ** a1})` : x ** a1}\cdot ${y ** a2 < 0 ? `(${y ** a2})` : y ** a2} = ${v}$.` };
  } },
  h2monop: { title: "Γεννήτρια — πράξεις μονωνύμων", make() {
    const t = ri(0, 3);
    if (t === 0) { const e = ri(1, 4), cs = [gyNZ(-9, 9), gyNZ(-9, 9), gyNZ(-9, 9)], s = cs[0] + cs[1] + cs[2]; if (s === 0) return GENS.h2monop.make();
      const P = cs.map((c, i) => i === 0 ? h2M(c, [["x", e]]) : (c < 0 ? " - " : " + ") + h2M(Math.abs(c), [["x", e]])).join("");
      return { q: R`Να κάνετε αναγωγή ομοίων όρων: $${P}$. Το αποτέλεσμα είναι της μορφής $\kappa ${e > 1 ? `x^{${e}}` : "x"}$· να βρείτε το $\kappa$.`, fields: [{ label: "κ =", ans: s }],
        sol: R`Προσθέτουμε τους συντελεστές: $${cs[0]} ${cs[1] < 0 ? "-" : "+"} ${Math.abs(cs[1])} ${cs[2] < 0 ? "-" : "+"} ${Math.abs(cs[2])} = ${s}$, άρα $${h2M(s, [["x", e]])}$.` }; }
    if (t === 1) { const a = gyNZ(-6, 6), b = gyNZ(-6, 6), m = ri(1, 4), n = ri(1, 4), p = ri(0, 3), q = ri(1, 3);
      if (Math.abs(a) === 1 && Math.abs(b) === 1) return GENS.h2monop.make();
      const A = h2M(a, [["x", m], ["y", p]]), B = h2M(b, [["x", n], ["y", q]]);
      return { q: R`Να κάνετε τον πολλαπλασιασμό $(${A})\cdot(${B})$. Το γινόμενο είναι $\kappa x^{\lambda}y^{\rho}$· να βρείτε τα $\kappa, \lambda, \rho$.`,
        fields: [{ label: "κ =", ans: a * b }, { label: "λ =", ans: m + n }, { label: "ρ =", ans: p + q }],
        sol: R`$(${a}\cdot ${b < 0 ? `(${b})` : b})\cdot x^{${m} + ${n}}y^{${p === 0 ? q : p + " + " + q}} = ${h2M(a * b, [["x", m + n], ["y", p + q]])}$.` }; }
    if (t === 2) { const k = gyNZ(-5, 5), b = gyNZ(-6, 6), n = ri(1, 3), d = ri(1, 3), q = ri(0, 2), r = q ? ri(1, 2) : 0; const a = k * b;
      if (Math.abs(b) === 1) return GENS.h2monop.make();
      const A = h2M(a, [["x", n + d], ["y", q + r]]), B = h2M(b, [["x", n], ["y", q]]);
      return { q: R`Να κάνετε τη διαίρεση $(${A}) : (${B})$. Το πηλίκο είναι $\kappa x^{\lambda}${q + r ? "y^{\\rho}" : ""}$· να βρείτε ${q + r ? "τα $\\kappa, \\lambda, \\rho$" : "τα $\\kappa, \\lambda$"}.`,
        fields: [{ label: "κ =", ans: k }, { label: "λ =", ans: d }, ...(q + r ? [{ label: "ρ =", ans: r }] : [])],
        sol: R`$\frac{${a}}{${b}}\cdot x^{${n + d} - ${n}}${q + r ? `y^{${q + r} - ${q}}` : ""} = ${h2M(k, [["x", d], ["y", r]])}$.` }; }
    const c = bkPick([-3, -2, 2, 3]), e = ri(1, 4), n = ri(2, 3);
    return { q: R`Να υπολογίσετε τη δύναμη $(${h2M(c, [["x", e]])})^{${n}}$. Το αποτέλεσμα είναι $\kappa x^{\lambda}$· να βρείτε τα $\kappa, \lambda$.`,
      fields: [{ label: "κ =", ans: c ** n }, { label: "λ =", ans: e * n }],
      sol: R`$(${h2M(c, [["x", e]])})^{${n}} = (${c})^{${n}}\cdot x^{${e === 1 ? n : e + "\\cdot " + n}} = ${h2M(c ** n, [["x", e * n]])}$ (γινόμενο ${n} ίσων παραγόντων $${h2M(c, [["x", e]])}$).` };
  } },
  h2poly: { title: "Γεννήτρια — πρόσθεση και αφαίρεση πολυωνύμων", make() {
    const t = ri(0, 2), r = () => gyNZ(-7, 7);
    if (t === 0) { const A = [r(), r(), r()], B = [r(), r(), r()], s = bkPick([1, -1]), R2 = A.map((c, i) => c + s * B[i]);
      if (R2[0] === 0) return GENS.h2poly.make();
      return { q: R`Να κάνετε τις πράξεις: $(${h2P(A)}) ${s > 0 ? "+" : "-"} (${h2P(B)})$ και να δώσετε τους συντελεστές του αποτελέσματος.`,
        fields: [{ label: "συντελεστής του x² =", ans: R2[0] }, { label: "συντελεστής του x =", ans: R2[1] }, { label: "σταθερός όρος =", ans: R2[2] }],
        sol: R`$(${h2P(A)}) ${s > 0 ? "+" : "-"} (${h2P(B)}) = ${h2P(A)}${h2Add(h2P(B.map(c => s * c)))} = ${h2P(R2)}$${s < 0 ? " (η παρένθεση με $-$ μπροστά αλλάζει τα πρόσημα όλων των όρων)" : ""}.` }; }
    if (t === 1) { const A = [r(), r(), r()], k = gyNZ(-3, 3), v = A[0] * k * k + A[1] * k + A[2];
      return { q: R`Δίνεται το πολυώνυμο $p(x) = ${h2P(A)}$. Να υπολογίσετε το $p(${k})$.`, fields: [{ label: `p(${k}) =`, ans: v }],
        sol: R`$p(${k}) = ${A[0] === 1 ? "" : A[0] === -1 ? "-" : A[0] + "\\cdot "}(${k})^2 ${A[1] < 0 ? "-" : "+"} ${Math.abs(A[1]) === 1 ? "" : Math.abs(A[1]) + "\\cdot "}(${k}) ${A[2] < 0 ? "-" : "+"} ${Math.abs(A[2])} = ${A[0] * k * k} ${A[1] * k < 0 ? "-" : "+"} ${Math.abs(A[1] * k)} ${A[2] < 0 ? "-" : "+"} ${Math.abs(A[2])} = ${v}$.` }; }
    const A = [r(), r(), r()], C = [r(), r(), r()], X = C.map((c, i) => c - A[i]); if (X[0] === 0) return GENS.h2poly.make();
    return { q: R`Ποιο πολυώνυμο πρέπει να προσθέσουμε στο $${h2P(A)}$ για να έχουμε άθροισμα $${h2P(C)}$; Να δώσετε τους συντελεστές του.`,
      fields: [{ label: "συντελεστής του x² =", ans: X[0] }, { label: "συντελεστής του x =", ans: X[1] }, { label: "σταθερός όρος =", ans: X[2] }],
      sol: R`Το ζητούμενο είναι η διαφορά $(${h2P(C)}) - (${h2P(A)}) = ${h2P(X)}$.` };
  } },
  h2mul: { title: "Γεννήτρια — πολλαπλασιασμός πολυωνύμων", make() {
    const t = ri(0, 2);
    if (t === 0) { let k; do k = gyNZ(-5, 5); while (Math.abs(k) === 1); const P = [gyNZ(-6, 6), gyNZ(-6, 6), gyNZ(-6, 6)];
      return { q: R`Να κάνετε τον πολλαπλασιασμό $${h2M(k, [["x", 1]])}(${h2P(P)})$ και να δώσετε τους συντελεστές του αποτελέσματος.`,
        fields: [{ label: "συντελεστής του x³ =", ans: k * P[0] }, { label: "συντελεστής του x² =", ans: k * P[1] }, { label: "συντελεστής του x =", ans: k * P[2] }],
        sol: R`Πολλαπλασιάζουμε το $${h2M(k, [["x", 1]])}$ με κάθε όρο (επιμεριστική): $${h2P([k * P[0], k * P[1], k * P[2], 0])}$.` }; }
    if (t === 1) { const a = ri(1, 4), b = gyNZ(-7, 7), c = ri(1, 3), d = gyNZ(-7, 7);
      return { q: R`Να κάνετε τον πολλαπλασιασμό $(${h2P([a, b])})(${h2P([c, d])})$ και να δώσετε τους συντελεστές του αποτελέσματος.`,
        fields: [{ label: "συντελεστής του x² =", ans: a * c }, { label: "συντελεστής του x =", ans: a * d + b * c }, { label: "σταθερός όρος =", ans: b * d }],
        sol: R`Κάθε όρος με κάθε όρο: $${h2M(a * c, [["x", 2]])} ${a * d < 0 ? "-" : "+"} ${h2M(Math.abs(a * d), [["x", 1]])} ${b * c < 0 ? "-" : "+"} ${h2M(Math.abs(b * c), [["x", 1]])} ${b * d < 0 ? "-" : "+"} ${Math.abs(b * d)} = ${h2P([a * c, a * d + b * c, b * d])}$.` }; }
    const b = gyNZ(-8, 8);
    return { q: R`Να κάνετε τον πολλαπλασιασμό $(${h2P([1, b])})(${h2P([1, b])})$ και να δώσετε τους συντελεστές του αποτελέσματος.`,
      fields: [{ label: "συντελεστής του x² =", ans: 1 }, { label: "συντελεστής του x =", ans: 2 * b }, { label: "σταθερός όρος =", ans: b * b }],
      sol: R`$x^2 ${b < 0 ? "-" : "+"} ${h2M(Math.abs(b), [["x", 1]])} ${b < 0 ? "-" : "+"} ${h2M(Math.abs(b), [["x", 1]])} + ${b * b} = ${h2P([1, 2 * b, b * b])}$.` };
  } },
  h2div: { title: "Γεννήτρια — διαίρεση πολυωνύμων", make() {
    const t = ri(0, 2);
    if (t === 0) { let k; do k = gyNZ(-4, 4); while (Math.abs(k) === 1); const Q = [gyNZ(-5, 5), gyNZ(-5, 5), gyNZ(-5, 5)];
      const D = [...Q.map(c => c * k), 0, 0];
      return { q: R`Να κάνετε τη διαίρεση $(${h2P(D)}) : (${h2M(k, [["x", 2]])})$ και να δώσετε τους συντελεστές του πηλίκου.`,
        fields: [{ label: "συντελεστής του x² =", ans: Q[0] }, { label: "συντελεστής του x =", ans: Q[1] }, { label: "σταθερός όρος =", ans: Q[2] }],
        sol: R`Διαιρούμε κάθε όρο με το $${h2M(k, [["x", 2]])}$: $${h2P(Q)}$.` }; }
    const p = t === 1 ? 1 : ri(2, 3), q = gyNZ(-5, 5), m = ri(1, 3), n = gyNZ(-6, 6), r = ri(-5, 5);
    const D = [p * m, p * n + q * m, q * n + r];
    if (D[1] === 0 || D[2] === 0) return GENS.h2div.make();
    return { q: R`Να κάνετε τη διαίρεση $(${h2P(D)}) : (${h2P([p, q])})$. Το πηλίκο είναι της μορφής $\alpha x + \beta$· να βρείτε τα $\alpha$, $\beta$ και το υπόλοιπο $\upsilon$.`,
      fields: [{ label: "α =", ans: m }, { label: "β =", ans: n }, { label: "υ =", ans: r }],
      sol: R`$\frac{${h2M(D[0], [["x", 2]])}}{${h2M(p, [["x", 1]])}} = ${h2M(m, [["x", 1]])}$, πολλαπλασιάζουμε και αφαιρούμε: μένει $${h2P([D[1] - m * q, D[2]])}$. Μετά $\frac{${h2M(D[1] - m * q, [["x", 1]])}}{${h2M(p, [["x", 1]])}} = ${n}$ και υπόλοιπο $${r}$. Άρα πηλίκο $${h2P([m, n])}$, υπόλοιπο $${r}$${r === 0 ? " (τέλεια διαίρεση)" : ""}. Έλεγχος: $(${h2P([p, q])})(${h2P([m, n])})${r ? (r < 0 ? " - " + (-r) : " + " + r) : ""} = ${h2P(D)}$.` };
  } }
});

/* ================= Β΄ Γυμνασίου — Ενότητα 3 Γεωμετρία: widgets & γεννήτριες (μέρος 3) ================= */
const h3poly = (P, pts, st) => P.layer.appendChild(svgEl("polygon", { points: pts.map(p => P.sx(p[0]) + "," + P.sy(p[1])).join(" "), style: st }));
const h3d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const h3pi = v => fmt(v * 3.14);
const h3m = v => fmt(v).replace(",", "{,}");                      /* δεκαδικός μέσα σε KaTeX */                                   /* τιμή με π ≈ 3,14 */
const h3sq = n => { let k = 1, m = n; for (let d = 2; d * d <= m; d++) while (m % (d * d) === 0) { m /= d * d; k *= d; } return [k, m]; };
const h3sqT = n => { const [k, m] = h3sq(n); return m === 1 ? String(k) : (k === 1 ? "" : k) + "\\sqrt{" + m + "}"; };
/* σήμανση ορθής γωνίας στην κορυφή V με πλευρές προς A, B */
function h3right(P, V, A, B, s = 0.25, col = "var(--navy)") {
  const u = [(A[0] - V[0]) / h3d(A, V), (A[1] - V[1]) / h3d(A, V)], w = [(B[0] - V[0]) / h3d(B, V), (B[1] - V[1]) / h3d(B, V)];
  const p1 = [V[0] + s * u[0], V[1] + s * u[1]], p2 = [p1[0] + s * w[0], p1[1] + s * w[1]], p3 = [V[0] + s * w[0], V[1] + s * w[1]];
  P.top.appendChild(svgEl("path", { d: `M${P.sx(p1[0])},${P.sy(p1[1])}L${P.sx(p2[0])},${P.sy(p2[1])}L${P.sx(p3[0])},${P.sy(p3[1])}`, style: `fill:none;stroke:${col};stroke-width:1.8` }));
}
/* κοινός σχεδιαστής τετραπλεύρων (παραλληλόγραμμο / ορθογώνιο / ρόμβος / τετράγωνο) */
function h3quad(box, def) {
  const NM = ["παραλληλόγραμμο", "ορθογώνιο", "ρόμβος", "τετράγωνο"];
  box.innerHTML = `<div class="wctl"><label>είδος <select class="st">${NM.map((n, i) => `<option value="${i}"${i === def ? " selected" : ""}>${n}</option>`).join("")}</select></label>
    <label>ΑΒ <input type="range" class="ra" min="2" max="8" step="0.5" value="6"><b class="va"></b></label>
    <label>ΑΔ <input type="range" class="rb" min="2" max="8" step="0.5" value="4"><b class="vb"></b></label>
    <label>∠Α <input type="range" class="rt" min="30" max="150" value="60"><b class="vt"></b></label>
    <label><input type="checkbox" class="cd" checked> διαγώνιοι</label></div><div class="pl"></div><div class="wout"></div>`;
  function draw() {
    const ty = +$(".st", box).value; let a = +$(".ra", box).value, b = +$(".rb", box).value, th = +$(".rt", box).value;
    if (ty >= 2) { b = a; $(".rb", box).value = a; } if (ty === 1 || ty === 3) { th = 90; $(".rt", box).value = 90; }
    $(".rb", box).disabled = ty >= 2; $(".rt", box).disabled = ty === 1 || ty === 3;
    $(".va", box).textContent = fmt(a); $(".vb", box).textContent = fmt(b); $(".vt", box).textContent = th + "°";
    const t = gRad(th), A = [0, 0], B = [a, 0], D = [b * Math.cos(t), b * Math.sin(t)], C = [a + D[0], D[1]], O = [(A[0] + C[0]) / 2, C[1] / 2];
    const xs = [A, B, C, D].map(p => p[0]), w = Math.max(...xs) - Math.min(...xs), h = D[1];
    const half = Math.max(w / 2, h / 2 * 560 / 300) * 1.3 + 0.6, P = gPlot($(".pl", box), (Math.max(...xs) + Math.min(...xs)) / 2, h / 2, half, 300, false);
    h3poly(P, [A, B, C, D], "fill:rgba(15,111,209,.10);stroke:var(--navy);stroke-width:2.6");
    const sc = half / 6, dg = $(".cd", box).checked;
    if (dg) { gLine(P, ...A, ...C, "stroke:var(--green);stroke-width:2.2"); gLine(P, ...B, ...D, "stroke:var(--purple);stroke-width:2.2"); P.dot(...O, "d2", "Ο", 8, 4); }
    if (th !== 90 && !dg) { gLine(P, D[0], D[1], D[0], 0, "stroke:var(--red);stroke-width:1.8;stroke-dasharray:5 4"); if (D[0] < 0 || D[0] > a) gLine(P, Math.min(0, D[0]), 0, Math.max(a, D[0]), 0, "stroke:var(--navy);stroke-width:1;stroke-dasharray:3 4"); }
    if (th === 90) [A, B, C, D].forEach((V, i, L) => h3right(P, V, L[(i + 1) % 4], L[(i + 3) % 4], 0.3 * sc));
    else { gAngMark(P, A, B, D, 0.55 * sc, "var(--blue)", th + "°"); gAngMark(P, C, D, B, 0.55 * sc, "var(--blue)", th + "°"); gAngMark(P, B, C, A, 0.45 * sc, "var(--amber)", (180 - th) + "°"); gAngMark(P, D, A, C, 0.45 * sc, "var(--amber)", (180 - th) + "°"); }
    if (dg && (ty === 2 || ty === 3)) h3right(P, O, C, D, 0.25 * sc, "var(--red)");
    P.dot(...A, "d1", "Α", -16, 16); P.dot(...B, "d1", "Β", 6, 16); P.dot(...C, "d1", "Γ", 6, -8); P.dot(...D, "d1", "Δ", -16, -8);
    const d1 = h3d(A, C), d2 = h3d(B, D), u = b * Math.sin(t), E = a * u;
    const ang = Math.abs(Math.atan2(C[1], C[0]) - Math.atan2(D[1] - B[1], D[0] - B[0])) * 180 / Math.PI, phi = Math.min(ang, 180 - ang);
    const props = [`Απέναντι πλευρές ίσες: <b>ΑΒ = ΓΔ = ${fmt(a)}</b>, <b>ΑΔ = ΒΓ = ${fmt(b)}</b>`,
      `Απέναντι γωνίες ίσες: <b>∠Α = ∠Γ = ${th}°</b>, <b>∠Β = ∠Δ = ${180 - th}°</b> (διαδοχικές γωνίες παραπληρωματικές)`,
      `Οι διαγώνιοι διχοτομούνται: ΟΑ = ΟΓ = ${fmt(d1 / 2)}, ΟΒ = ΟΔ = ${fmt(d2 / 2)}`];
    if (ty === 1 || ty === 3) props.push(`<span style="color:var(--green)">Οι διαγώνιοι είναι <b>ίσες</b>: ΑΓ = ΒΔ = ${fmt(d1)}</span>`);
    else props.push(`Διαγώνιοι: ΑΓ = ${fmt(d1)}, ΒΔ = ${fmt(d2)}${Math.abs(d1 - d2) > 0.01 ? " (όχι ίσες)" : ""}`);
    if (ty >= 2) props.push(`<span style="color:var(--red)">Οι διαγώνιοι είναι <b>κάθετες</b> και <b>διχοτομούν τις γωνίες</b> (π.χ. η ΑΓ χωρίζει την ∠Α σε ${fmt(th / 2)}° + ${fmt(th / 2)}°)</span>`);
    else props.push(`Γωνία διαγωνίων ≈ ${fmt(phi)}°${Math.abs(phi - 90) < 0.5 ? " (εδώ κάθετες)" : " (όχι κάθετες)"}`);
    const area = ty >= 2 ? `E = δ₁·δ₂/2 = ${fmt(d1)}·${fmt(d2)}/2 ≈ <b>${fmt(d1 * d2 / 2)}</b> (= α·υ = ${fmt(E)})` : ty === 1 ? `E = α·β = ${fmt(a)}·${fmt(b)} = <b>${fmt(E)}</b>` : `E = β·υ = ${fmt(a)}·${fmt(u)} ≈ <b>${fmt(E)}</b> (υ: το κόκκινο ύψος — κρύψε τις διαγωνίους)`;
    $(".wout", box).innerHTML = `<b>${NM[ty][0].toUpperCase() + NM[ty].slice(1)} ΑΒΓΔ</b><br>` + props.join("<br>") + `<br>${area} · Π = 2(${fmt(a)} + ${fmt(b)}) = ${fmt(2 * (a + b))}`;
  }
  box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
}

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 3.1 Συμμετρία ---------- */
  h3sym(box) {
    box.innerHTML = `<div class="wctl"><label>συμμετρία <select class="sm"><option value="0">ως προς άξονα x = κ</option><option value="1">ως προς άξονα y = κ</option><option value="2">ως προς σημείο Κ(κ, 0)</option></select></label>
      <label>κ <input type="range" class="rk" min="-3" max="3" step="0.5" value="0"><b class="vk"></b></label>
      <label>μετακίνηση x <input type="range" class="rx" min="-6" max="5" step="0.5" value="-5"><b class="vx"></b></label>
      <label>y <input type="range" class="ry" min="-1" max="3" step="0.5" value="2"><b class="vy"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const m = +$(".sm", box).value, k = +$(".rk", box).value, x = +$(".rx", box).value, y = +$(".ry", box).value;
      $(".vk", box).textContent = fmt(k); $(".vx", box).textContent = fmt(x); $(".vy", box).textContent = fmt(y);
      const P = makePlot($(".pl", box), { xmin: -7, xmax: 7, ymin: -4.125, ymax: 4.125, H: 330, xstep: 1, ystep: 1 });
      const S = [[x, y], [x + 2, y - 1], [x + 0.5, y - 2]], f = p => m === 0 ? [2 * k - p[0], p[1]] : m === 1 ? [p[0], 2 * k - p[1]] : [2 * k - p[0], -p[1]], S2 = S.map(f), N = ["Α", "Β", "Γ"];
      if (m === 0) gLine(P, k, -4.2, k, 4.2, "stroke:var(--red);stroke-width:2.4"); else if (m === 1) gLine(P, -7, k, 7, k, "stroke:var(--red);stroke-width:2.4"); else P.dot(k, 0, "dmin", "Κ", 6, 18);
      h3poly(P, S, "fill:rgba(15,111,209,.25);stroke:var(--blue);stroke-width:2.4"); h3poly(P, S2, "fill:rgba(220,60,60,.18);stroke:var(--red);stroke-width:2.4");
      S.forEach((p, i) => { gLine(P, ...p, ...S2[i], "stroke:var(--muted,#888);stroke-width:1.2;stroke-dasharray:4 4"); P.dot(...p, "d1", N[i], -14, -6); P.dot(...S2[i], "d3", N[i] + "′", 6, -6); });
      const rows = S.map((p, i) => `${N[i]}(${fmt(p[0])}, ${fmt(p[1])}) → ${N[i]}′(${fmt(S2[i][0])}, ${fmt(S2[i][1])})`).join(" · ");
      $(".wout", box).innerHTML = rows + `<br>` + (m < 2 ? `Ο άξονας ${m === 0 ? "x = " : "y = "}${fmt(k)} είναι η <b>μεσοκάθετος</b> κάθε τμήματος ΑΑ′, ΒΒ′, ΓΓ′: τα συμμετρικά σημεία ισαπέχουν από αυτόν και η ΑΑ′ είναι κάθετη στον άξονα.`
        : `Το Κ(${fmt(k)}, 0) είναι το <b>μέσο</b> κάθε τμήματος ΑΑ′, ΒΒ′, ΓΓ′. Η συμμετρία ως προς σημείο «γυρίζει» το σχήμα κατά 180°.`) + `<br><span class="muted">Το συμμετρικό σχήμα είναι ίσο με το αρχικό (ίδιες πλευρές και γωνίες).</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },
  /* ---------- 3.2 – 3.5 Παραλληλόγραμμα ---------- */
  h3para(box) { h3quad(box, 0); },
  h3rect(box) { h3quad(box, 1); },
  h3rhomb(box) { h3quad(box, 2); },
  h3square(box) { h3quad(box, 3); },
  /* ---------- 3.6 Τραπέζιο ---------- */
  h3trap(box) {
    box.innerHTML = `<div class="wctl"><label>β₁ (ΑΒ) <input type="range" class="r1" min="4" max="10" value="8"><b class="v1"></b></label>
      <label>β₂ (ΔΓ) <input type="range" class="r2" min="1" max="8" value="4"><b class="v2"></b></label>
      <label>υ <input type="range" class="rh" min="1" max="5" step="0.5" value="3"><b class="vh"></b></label>
      <label>θέση Δ <input type="range" class="rs" min="-2" max="6" step="0.5" value="1"><b class="vs"></b></label>
      <label>είδος <select class="sk"><option value="0">τυχαίο</option><option value="1">ισοσκελές</option><option value="2">ορθογώνιο</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const b1 = +$(".r1", box).value, b2 = +$(".r2", box).value, h = +$(".rh", box).value, k = +$(".sk", box).value; let s = +$(".rs", box).value;
      if (k === 1) s = (b1 - b2) / 2; if (k === 2) s = 0; $(".rs", box).value = s; $(".rs", box).disabled = k > 0;
      $(".v1", box).textContent = b1; $(".v2", box).textContent = b2; $(".vh", box).textContent = fmt(h); $(".vs", box).textContent = fmt(s);
      const A = [0, 0], B = [b1, 0], D = [s, h], C = [s + b2, h], mn = Math.min(0, s), mx = Math.max(b1, s + b2);
      const half = Math.max((mx - mn) / 2, h / 2 * 560 / 300) * 1.25 + 0.5, P = gPlot($(".pl", box), (mn + mx) / 2, h / 2, half, 300, false), sc = half / 6;
      h3poly(P, [A, B, C, D], "fill:rgba(15,111,209,.10);stroke:var(--navy);stroke-width:2.6");
      gLine(P, ...A, ...B, "stroke:var(--blue);stroke-width:4"); gLine(P, ...D, ...C, "stroke:var(--blue);stroke-width:4");
      gLine(P, D[0], h, D[0], 0, "stroke:var(--red);stroke-width:1.8;stroke-dasharray:5 4"); if (s < 0) gLine(P, s, 0, 0, 0, "stroke:var(--navy);stroke-width:1;stroke-dasharray:3 4");
      if (k === 1) { gLine(P, ...A, ...C, "stroke:var(--green);stroke-width:1.8;stroke-dasharray:6 4"); gLine(P, ...B, ...D, "stroke:var(--green);stroke-width:1.8;stroke-dasharray:6 4"); }
      const angA = Math.atan2(h, s) * 180 / Math.PI, angB = Math.atan2(h, b1 - s - b2) * 180 / Math.PI;
      if (Math.abs(angA - 90) < 0.01) { h3right(P, A, B, D, 0.3 * sc); h3right(P, D, A, C, 0.3 * sc); } else { gAngMark(P, A, B, D, 0.5 * sc, "var(--amber)", fmt(angA) + "°"); gAngMark(P, D, A, C, 0.5 * sc, "var(--purple)", fmt(180 - angA) + "°"); }
      gAngMark(P, B, C, A, 0.5 * sc, "var(--amber)", fmt(angB) + "°"); gAngMark(P, C, D, B, 0.45 * sc, "var(--purple)", fmt(180 - angB) + "°");
      P.dot(...A, "d1", "Α", -16, 16); P.dot(...B, "d1", "Β", 6, 16); P.dot(...C, "d1", "Γ", 6, -8); P.dot(...D, "d1", "Δ", -16, -8);
      const E = (b1 + b2) * h / 2, AD = h3d(A, D), BC = h3d(B, C);
      $(".wout", box).innerHTML = `Βάσεις ΑΒ ∥ ΔΓ: β₁ = ${b1}, β₂ = ${b2}, ύψος υ = ${fmt(h)} · μη παράλληλες πλευρές ΑΔ ≈ ${fmt(AD)}, ΒΓ ≈ ${fmt(BC)}
        <br>∠Α + ∠Δ = 180° και ∠Β + ∠Γ = 180° (εντός και επί τα αυτά)${k === 1 ? ` · <span style="color:var(--green)">ισοσκελές: ∠Α = ∠Β, ∠Γ = ∠Δ και διαγώνιοι ίσες ΑΓ = ΒΔ ≈ ${fmt(h3d(A, C))}</span>` : k === 2 ? " · ορθογώνιο τραπέζιο: ∠Α = ∠Δ = 90°" : ""}
        <br>E = (β₁ + β₂)·υ / 2 = (${b1} + ${b2})·${fmt(h)} / 2 = <b>${fmt(E)}</b> · Π = ${b1} + ${b2} + ${fmt(AD)} + ${fmt(BC)} ≈ ${fmt(b1 + b2 + AD + BC)}${b1 === b2 ? `<br><span style="color:var(--red)">Με ίσες βάσεις προκύπτει παραλληλόγραμμο, όχι τραπέζιο!</span>` : ""}`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },
  /* ---------- 3.7 Μήκος κύκλου ---------- */
  h3circ(box) {
    box.innerHTML = `<div class="wctl"><label>ακτίνα R <input type="range" class="rr" min="1" max="20" value="5"><b class="vr"></b></label>
      <label>επίκεντρη μ <input type="range" class="rm" min="10" max="360" step="5" value="90"><b class="vm"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const R = +$(".rr", box).value, mu = +$(".rm", box).value; $(".vr", box).textContent = R; $(".vm", box).textContent = mu + "°";
      const P = gPlot($(".pl", box), 2.9, 0.15, 3.1, 300, false), r = 0.72, c = [0.9, 0.55], L = 2 * Math.PI * r, x0 = 0.18, y0 = -0.95;
      gCircle(P, ...c, r, "stroke:var(--blue);stroke-width:2.6;fill:rgba(15,111,209,.06)"); gLine(P, c[0] - r, c[1], c[0] + r, c[1], "stroke:var(--green);stroke-width:2.4");
      if (mu < 360) gArc(P, ...c, 0, mu, r, "var(--red)"); else gCircle(P, ...c, r, "stroke:var(--red);stroke-width:3;fill:none");
      gLine(P, ...c, c[0] + r, c[1], "stroke:var(--navy);stroke-width:1.6"); gLine(P, ...c, c[0] + r * Math.cos(gRad(mu)), c[1] + r * Math.sin(gRad(mu)), "stroke:var(--navy);stroke-width:1.6"); P.dot(...c, "d2", "Κ", -14, 14);
      gLine(P, x0, y0, x0 + L, y0, "stroke:var(--blue);stroke-width:5"); gLine(P, x0, y0 - 0.1, x0 + L * mu / 360, y0 - 0.1, "stroke:var(--red);stroke-width:4");
      for (let i = 0; i < 3; i++) { gLine(P, x0 + i * 2 * r, y0 + 0.16, x0 + (i + 1) * 2 * r, y0 + 0.16, "stroke:var(--green);stroke-width:3"); gLine(P, x0 + (i + 1) * 2 * r, y0 + 0.06, x0 + (i + 1) * 2 * r, y0 + 0.28, "stroke:var(--green);stroke-width:2"); gText(P, x0 + (i + 0.5) * 2 * r, y0 + 0.36, "δ", "fill:var(--green)"); }
      gText(P, x0 + L + 0.08, y0 + 0.36, "0,14δ", "fill:var(--green)", "start");
      gText(P, 2.0, 1.05, "ξετυλίγουμε τον κύκλο:", "fill:var(--ink)", "start"); gText(P, 2.0, 0.7, "μήκος κύκλου ≈ 3,14 διάμετροι", "fill:var(--blue)", "start");
      const G = 2 * 3.14 * R, g = G * mu / 360;
      $(".wout", box).innerHTML = `Διάμετρος δ = 2R = ${2 * R} · Μήκος κύκλου Γ = 2πR = π·δ = <b>${2 * R}π ≈ ${fmt(G)}</b> (π ≈ 3,14)
        <br><span style="color:var(--red)">Μήκος τόξου γ = (μ/360°)·2πR = (${mu}/360)·${2 * R}π ≈ <b>${fmt(g)}</b></span>
        <br><span class="muted">Ο λόγος Γ/δ είναι για κάθε κύκλο ο ίδιος αριθμός π = 3,14159… (άρρητος).</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },
  /* ---------- 3.8 Εμβαδόν κυκλικού δίσκου ---------- */
  h3disc(box) {
    box.innerHTML = `<div class="wctl"><label>ακτίνα R <input type="range" class="rr" min="1" max="20" value="6"><b class="vr"></b></label>
      <label>τομέας μ <input type="range" class="rm" min="0" max="360" step="5" value="60"><b class="vm"></b></label>
      <label>εσωτερική ρ <input type="range" class="rp" min="0" max="19" value="0"><b class="vp"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const R = +$(".rr", box).value, mu = +$(".rm", box).value; let p = +$(".rp", box).value; if (p >= R) { p = R - 1; $(".rp", box).value = p; }
      $(".vr", box).textContent = R; $(".vm", box).textContent = mu + "°"; $(".vp", box).textContent = p;
      const P = gPlot($(".pl", box), 0, 0, 2.6, 300, false), r = 1.2, q = r * p / R;
      gCircle(P, 0, 0, r, "stroke:var(--blue);stroke-width:2.6;fill:rgba(15,111,209,.14)");
      if (mu > 0 && mu < 360) { let d = `M${P.sx(0)},${P.sy(0)}`; for (let i = 0; i <= 60; i++) { const t = gRad(mu * i / 60); d += `L${P.sx(r * Math.cos(t)).toFixed(1)},${P.sy(r * Math.sin(t)).toFixed(1)}`; } P.layer.appendChild(svgEl("path", { d: d + "Z", style: "fill:rgba(240,150,30,.55);stroke:var(--amber);stroke-width:2" })); gArc(P, 0, 0, 0, mu, 0.3, "var(--red)", mu + "°", 0.5); }
      else if (mu === 360) gCircle(P, 0, 0, r, "stroke:var(--amber);stroke-width:2;fill:rgba(240,150,30,.55)");
      if (p > 0) gCircle(P, 0, 0, q, "stroke:var(--navy);stroke-width:2;fill:#fff");
      gLine(P, 0, 0, -r * Math.cos(gRad(35)), -r * Math.sin(gRad(35)), "stroke:var(--navy);stroke-width:2"); gText(P, -r * 0.62, -r * 0.32 - 0.2, "R", "fill:var(--navy)"); P.dot(0, 0, "d2", "Κ", 6, 16);
      const E = 3.14 * R * R, Et = E * mu / 360;
      $(".wout", box).innerHTML = `Εμβαδόν κυκλικού δίσκου: E = πR² = ${R * R}π ≈ <b>${fmt(E)}</b> (π ≈ 3,14)
        <br><span style="color:var(--amber)">Κυκλικός τομέας μ = ${mu}°: E<sub>κ.τ.</sub> = (μ/360°)·πR² = (${mu}/360)·${R * R}π ≈ <b>${fmt(Et)}</b></span>`
        + (p > 0 ? `<br>Κυκλικός δακτύλιος (R = ${R}, ρ = ${p}): πR² − πρ² = ${R * R - p * p}π ≈ <b>${fmt(3.14 * (R * R - p * p))}</b>` : "")
        + `<br><span class="muted">Αν διπλασιαστεί η ακτίνα, το εμβαδόν τετραπλασιάζεται (R² → 4R²), ενώ το μήκος του κύκλου διπλασιάζεται.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  h3sym: { title: "Γεννήτρια — συμμετρικά σημεία", make() {
    const x = gyNZ(-6, 6), y = gyNZ(-6, 6), t = ri(0, 3);
    if (t === 0) return { q: R`Να βρείτε τις συντεταγμένες του συμμετρικού του σημείου $A(${x}, ${y})$ ως προς την αρχή των αξόνων $O(0, 0)$.`, fields: [{ label: "x =", ans: -x }, { label: "y =", ans: -y }], sol: R`Το $O$ είναι το μέσο του $AA'$, άρα $A'(${-x}, ${-y})$: αλλάζουν πρόσημο και οι δύο συντεταγμένες.` };
    if (t === 1) { const ax = ri(0, 1); return { q: R`Να βρείτε τις συντεταγμένες του συμμετρικού του σημείου $A(${x}, ${y})$ ως προς τον άξονα ${ax ? "$y'y$" : "$x'x$"}.`, fields: [{ label: "x =", ans: ax ? -x : x }, { label: "y =", ans: ax ? y : -y }], sol: R`Ο άξονας είναι μεσοκάθετος του $AA'$: ${ax ? "αλλάζει πρόσημο μόνο η τετμημένη" : "αλλάζει πρόσημο μόνο η τεταγμένη"}, $A'(${ax ? -x : x}, ${ax ? y : -y})$.` }; }
    if (t === 2) { const k = gyNZ(-3, 3); return { q: R`Να βρείτε τις συντεταγμένες του συμμετρικού του $A(${x}, ${y})$ ως προς το σημείο $K(${k}, 0)$.`, fields: [{ label: "x =", ans: 2 * k - x }, { label: "y =", ans: -y }], sol: R`Το $K$ είναι μέσο του $AA'$: $\frac{${x} + x'}{2} = ${k} \Rightarrow x' = ${2 * k - x}$ και $\frac{${y} + y'}{2} = 0 \Rightarrow y' = ${-y}$. Άρα $A'(${2 * k - x}, ${-y})$.` }; }
    const c = gyNZ(-5, 5), a = c + gyNZ(-6, 6); return { q: R`Στην ευθεία των αριθμών, ποιος αριθμός είναι συμμετρικός του $${a}$ με κέντρο συμμετρίας τον αριθμό $${c}$;`, fields: [{ label: "=", ans: 2 * c - a }], sol: R`Ο $${c}$ είναι το μέσο: απόσταση $|${a} - (${c})| = ${Math.abs(a - c)}$, άρα ο συμμετρικός είναι ο $${2 * c - a}$ (έλεγχος: $\frac{${a} + (${2 * c - a})}{2} = ${c}$).` };
  } },
  h3para: { title: "Γεννήτρια — παραλληλόγραμμο", make() {
    const t = ri(0, 3);
    if (t === 0) { const A = ri(35, 145); if (A === 90) return GENS.h3para.make(); return { q: R`Σε παραλληλόγραμμο $AB\Gamma\Delta$ είναι $\hat A = ${A}^\circ$. Να βρείτε τις γωνίες $\hat B$, $\hat\Gamma$ και $\hat\Delta$.`, fields: [{ label: "∠Β (°) =", ans: 180 - A }, { label: "∠Γ (°) =", ans: A }, { label: "∠Δ (°) =", ans: 180 - A }], sol: R`$\hat A + \hat B = 180^\circ$ (εντός και επί τα αυτά), άρα $\hat B = ${180 - A}^\circ$. Οι απέναντι γωνίες είναι ίσες: $\hat\Gamma = ${A}^\circ$, $\hat\Delta = ${180 - A}^\circ$.` }; }
    if (t === 1) { const k = ri(2, 6), m = ri(1, k - 1), x = ri(2, 9), c = (k - m) * x; if (c < 3) return GENS.h3para.make(); const b = ri(1, Math.min(9, c - 1)); return { q: R`Σε παραλληλόγραμμο $AB\Gamma\Delta$ είναι $AB = ${k}x - ${b}$ και $\Gamma\Delta = ${m === 1 ? "" : m}x + ${c - b}$ (σε cm). Να βρείτε το $x$ και το μήκος της $AB$.`, fields: [{ label: "x =", ans: x }, { label: "AB (cm) =", ans: k * x - b }], sol: R`Απέναντι πλευρές ίσες: $${k}x - ${b} = ${m === 1 ? "" : m}x + ${c - b} \Rightarrow ${k - m === 1 ? `x = ${c}` : `${k - m}x = ${c} \\Rightarrow x = ${x}`}$. $AB = ${k}\cdot ${x} - ${b} = ${k * x - b}$ cm.` }; }
    if (t === 2) { const b = ri(4, 15), u = ri(2, 10); return { q: R`Παραλληλόγραμμο έχει βάση $${b}$ cm και αντίστοιχο ύψος $${u}$ cm. Να βρείτε το εμβαδόν του.`, fields: [{ label: "E (cm²) =", ans: b * u }], sol: R`$E = \beta\cdot\upsilon = ${b}\cdot ${u} = ${b * u}$ cm².` }; }
    const a = ri(4, 12), b = ri(3, a - 1), u1 = ri(2, b - 1), E = a * u1; return { q: R`Παραλληλόγραμμο έχει πλευρές $${a}$ cm και $${b}$ cm. Το ύψος που αντιστοιχεί στην πλευρά $${a}$ cm είναι $${u1}$ cm. Να βρείτε το εμβαδόν και το ύψος που αντιστοιχεί στην πλευρά $${b}$ cm.`, fields: [{ label: "E (cm²) =", ans: E }, { label: "υ₂ (cm) =", ans: gyF(E, b) }], sol: R`$E = ${a}\cdot ${u1} = ${E}$ cm². Επίσης $E = ${b}\cdot\upsilon_2 \Rightarrow \upsilon_2 = \frac{${E}}{${b}}${E % b === 0 ? ` = ${E / b}` : gcdI(E, b) > 1 ? ` = ${gyT(E, b)}` : ""}$ cm.` };
  } },
  h3rect: { title: "Γεννήτρια — ορθογώνιο", make() {
    const T = bkPick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25]]), t = ri(0, 2);
    if (t === 0) return { q: R`Ορθογώνιο $AB\Gamma\Delta$ έχει διαστάσεις $AB = ${T[1]}$ cm και $B\Gamma = ${T[0]}$ cm. Οι διαγώνιοι τέμνονται στο $O$. Να βρείτε τη διαγώνιο $A\Gamma$ και το μήκος $OB$.`, fields: [{ label: "ΑΓ (cm) =", ans: T[2] }, { label: "ΟΒ (cm) =", ans: T[2] / 2 }], sol: R`Πυθαγόρειο στο $AB\Gamma$: $A\Gamma^2 = ${T[1]}^2 + ${T[0]}^2 = ${T[2] * T[2]} \Rightarrow A\Gamma = ${T[2]}$ cm. Οι διαγώνιοι είναι ίσες και διχοτομούνται: $OB = \frac{B\Delta}{2} = \frac{${T[2]}}{2} = ${h3m(T[2] / 2)}$ cm.` };
    if (t === 1) return { q: R`Ορθογώνιο έχει διαγώνιο $${T[2]}$ cm και μία πλευρά $${T[0]}$ cm. Να βρείτε την άλλη πλευρά, την περίμετρο και το εμβαδόν του.`, fields: [{ label: "πλευρά (cm) =", ans: T[1] }, { label: "Π (cm) =", ans: 2 * (T[0] + T[1]) }, { label: "E (cm²) =", ans: T[0] * T[1] }], sol: R`$x^2 = ${T[2]}^2 - ${T[0]}^2 = ${T[1] * T[1]} \Rightarrow x = ${T[1]}$ cm. $\Pi = 2(${T[0]} + ${T[1]}) = ${2 * (T[0] + T[1])}$ cm, $E = ${T[0]}\cdot ${T[1]} = ${T[0] * T[1]}$ cm².` };
    const k = ri(2, 4), w = ri(2, 8), E = k * w * w; return { q: R`Ορθογώνιο έχει εμβαδόν $${E}$ m² και το μήκος του είναι ${["", "", "διπλάσιο", "τριπλάσιο", "τετραπλάσιο"][k]} από το πλάτος του. Να βρείτε τις διαστάσεις του.`, fields: [{ label: "πλάτος (m) =", ans: w }, { label: "μήκος (m) =", ans: k * w }], sol: R`Πλάτος $x$, μήκος $${k}x$: $${k}x\cdot x = ${E} \Rightarrow x^2 = ${w * w} \Rightarrow x = ${w}$ m, μήκος $${k * w}$ m.` };
  } },
  h3rhomb: { title: "Γεννήτρια — ρόμβος", make() {
    const T = bkPick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]), t = ri(0, 2);
    if (t === 0) return { q: R`Ρόμβος έχει διαγωνίους $${2 * T[0]}$ cm και $${2 * T[1]}$ cm. Να βρείτε το εμβαδόν, την πλευρά και την περίμετρό του.`, fields: [{ label: "E (cm²) =", ans: 2 * T[0] * T[1] }, { label: "α (cm) =", ans: T[2] }, { label: "Π (cm) =", ans: 4 * T[2] }], sol: R`$E = \frac{\delta_1\delta_2}{2} = \frac{${2 * T[0]}\cdot ${2 * T[1]}}{2} = ${2 * T[0] * T[1]}$ cm². Οι διαγώνιοι διχοτομούνται κάθετα: ορθογώνιο τρίγωνο με κάθετες $${T[0]}$, $${T[1]}$, άρα $\alpha^2 = ${T[0] * T[0]} + ${T[1] * T[1]} = ${T[2] * T[2]}$, $\alpha = ${T[2]}$ cm, $\Pi = 4\cdot ${T[2]} = ${4 * T[2]}$ cm.` };
    if (t === 1) { const A = 2 * ri(15, 75); if (A === 90) return GENS.h3rhomb.make(); return { q: R`Ρόμβος $AB\Gamma\Delta$ έχει $\hat A = ${A}^\circ$. Να βρείτε τη $\hat B$ και τη γωνία $\Gamma\hat A B$ που σχηματίζει η διαγώνιος $A\Gamma$ με την πλευρά $AB$.`, fields: [{ label: "∠Β (°) =", ans: 180 - A }, { label: "∠ΓΑΒ (°) =", ans: A / 2 }], sol: R`$\hat B = 180^\circ - ${A}^\circ = ${180 - A}^\circ$. Οι διαγώνιοι του ρόμβου διχοτομούν τις γωνίες του: $\Gamma\hat AB = \frac{${A}^\circ}{2} = ${A / 2}^\circ$.` }; }
    const d1 = 2 * ri(2, 10), d2 = 2 * ri(2, 10), E = d1 * d2 / 2; return { q: R`Ρόμβος έχει εμβαδόν $${E}$ cm² και η μία διαγώνιός του είναι $${d1}$ cm. Να βρείτε την άλλη διαγώνιο.`, fields: [{ label: "δ₂ (cm) =", ans: d2 }], sol: R`$\frac{${d1}\cdot\delta_2}{2} = ${E} \Rightarrow ${d1}\delta_2 = ${2 * E} \Rightarrow \delta_2 = ${d2}$ cm.` };
  } },
  h3square: { title: "Γεννήτρια — τετράγωνο", make() {
    const t = ri(0, 2), a = ri(2, 12);
    if (t === 0) return { q: R`Τετράγωνο έχει πλευρά $${a}$ cm. Η διαγώνιός του γράφεται $\delta = \kappa\sqrt2$ cm. Να βρείτε το $\kappa$ και το εμβαδόν του τετραγώνου.`, fields: [{ label: "κ =", ans: a }, { label: "E (cm²) =", ans: a * a }], sol: R`$\delta^2 = ${a}^2 + ${a}^2 = ${2 * a * a} \Rightarrow \delta = \sqrt{${2 * a * a}} = ${a}\sqrt2$ cm, άρα $\kappa = ${a}$. $E = ${a}^2 = ${a * a}$ cm².` };
    if (t === 1) { const d = 2 * ri(2, 10); return { q: R`Η διαγώνιος ενός τετραγώνου είναι $${d}$ cm. Να βρείτε το εμβαδόν του.`, fields: [{ label: "E (cm²) =", ans: d * d / 2 }], sol: R`Το τετράγωνο είναι και ρόμβος: $E = \frac{\delta\cdot\delta}{2} = \frac{${d}^2}{2} = ${d * d / 2}$ cm². (Ή: $2\alpha^2 = ${d * d} \Rightarrow \alpha^2 = ${d * d / 2}$.)` }; }
    const P = 4 * a; return { q: R`Τετράγωνο έχει περίμετρο $${P}$ m. Να βρείτε την πλευρά και το εμβαδόν του.`, fields: [{ label: "α (m) =", ans: a }, { label: "E (m²) =", ans: a * a }], sol: R`$4\alpha = ${P} \Rightarrow \alpha = ${a}$ m, $E = ${a}^2 = ${a * a}$ m².` };
  } },
  h3trap: { title: "Γεννήτρια — τραπέζιο", make() {
    const t = ri(0, 2);
    if (t === 0) { const b1 = ri(5, 20), b2 = ri(2, b1 - 1), u = ri(2, 10); return { q: R`Τραπέζιο έχει βάσεις $${b1}$ cm και $${b2}$ cm και ύψος $${u}$ cm. Να βρείτε το εμβαδόν του.`, fields: [{ label: "E (cm²) =", ans: (b1 + b2) * u / 2 }], sol: R`$E = \frac{(\beta_1 + \beta_2)\cdot\upsilon}{2} = \frac{(${b1} + ${b2})\cdot ${u}}{2} = \frac{${(b1 + b2) * u}}{2} = ${h3m((b1 + b2) * u / 2)}$ cm².` }; }
    if (t === 1) { const b1 = ri(5, 16), b2 = ri(2, b1 - 1), u = ri(2, 9), E = (b1 + b2) * u; if (E % 2) return GENS.h3trap.make(); return { q: R`Τραπέζιο έχει εμβαδόν $${E / 2}$ cm² και βάσεις $${b1}$ cm και $${b2}$ cm. Να βρείτε το ύψος του.`, fields: [{ label: "υ (cm) =", ans: u }], sol: R`$\frac{(${b1} + ${b2})\cdot\upsilon}{2} = ${E / 2} \Rightarrow ${b1 + b2}\upsilon = ${E} \Rightarrow \upsilon = ${u}$ cm.` }; }
    const A = ri(30, 85); return { q: R`Σε ισοσκελές τραπέζιο $AB\Gamma\Delta$ ($AB \parallel \Gamma\Delta$, $A\Delta = B\Gamma$) είναι $\hat A = ${A}^\circ$. Να βρείτε τις γωνίες $\hat B$, $\hat\Gamma$, $\hat\Delta$.`, fields: [{ label: "∠Β (°) =", ans: A }, { label: "∠Γ (°) =", ans: 180 - A }, { label: "∠Δ (°) =", ans: 180 - A }], sol: R`Οι προσκείμενες στη βάση γωνίες είναι ίσες: $\hat B = \hat A = ${A}^\circ$. $\hat A + \hat\Delta = 180^\circ$ (εντός και επί τα αυτά), άρα $\hat\Delta = \hat\Gamma = ${180 - A}^\circ$.` };
  } },
  h3circ: { title: "Γεννήτρια — μήκος κύκλου και τόξου", make() {
    const t = ri(0, 2), RR = ri(2, 25);
    if (t === 0) return { q: R`Κύκλος έχει ${ri(0, 1) ? `ακτίνα $R = ${RR}$ cm` : `διάμετρο $${2 * RR}$ cm`}. Να βρείτε το μήκος του (με $\pi \approx 3{,}14$).`, fields: [{ label: "Γ (cm) ≈", ans: 6.28 * RR, tol: 0.002 }], sol: R`$R = ${RR}$ cm, $\Gamma = 2\pi R = ${2 * RR}\pi \approx ${2 * RR}\cdot 3{,}14 = ${h3m(6.28 * RR)}$ cm.` };
    if (t === 1) return { q: R`Κύκλος έχει μήκος $${h3m(6.28 * RR)}$ cm. Να βρείτε την ακτίνα του (με $\pi \approx 3{,}14$).`, fields: [{ label: "R (cm) =", ans: RR, tol: 0.002 }], sol: R`$2\pi R = ${h3m(6.28 * RR)} \Rightarrow R = \frac{${h3m(6.28 * RR)}}{6{,}28} = ${RR}$ cm.` };
    const mu = bkPick([30, 36, 40, 45, 60, 72, 90, 120, 135, 150, 180, 240, 270]), r = ri(2, 18), k = r * mu / 180;
    if (Math.abs(k * 2 - Math.round(k * 2)) > 1e-9) return GENS.h3circ.make();
    return { q: R`Σε κύκλο ακτίνας $${r}$ cm, η επίκεντρη γωνία $${mu}^\circ$ βαίνει σε τόξο μήκους $\gamma = \kappa\pi$ cm. Να βρείτε το $\kappa$.`, fields: [{ label: "κ =", ans: k }], sol: R`$\gamma = \frac{\mu}{360}\cdot 2\pi R = \frac{${mu}}{360}\cdot ${2 * r}\pi = ${h3m(k)}\pi$ cm, άρα $\kappa = ${h3m(k)}$.` };
  } },
  h3disc: { title: "Γεννήτρια — εμβαδόν κύκλου και κυκλικού τομέα", make() {
    const t = ri(0, 3), RR = ri(2, 15);
    if (t === 0) return { q: R`Να βρείτε το εμβαδόν κυκλικού δίσκου με ${ri(0, 1) ? `ακτίνα $${RR}$ cm` : `διάμετρο $${2 * RR}$ cm`} (με $\pi \approx 3{,}14$).`, fields: [{ label: "E (cm²) ≈", ans: 3.14 * RR * RR, tol: 0.002 }], sol: R`$R = ${RR}$ cm, $E = \pi R^2 = ${RR * RR}\pi \approx ${h3m(3.14 * RR * RR)}$ cm².` };
    if (t === 1) return { q: R`Κυκλικός δίσκος έχει εμβαδόν $${RR * RR}\pi$ m². Να βρείτε την ακτίνα του και το μήκος του κύκλου ως $\kappa\pi$.`, fields: [{ label: "R (m) =", ans: RR }, { label: "κ =", ans: 2 * RR }], sol: R`$\pi R^2 = ${RR * RR}\pi \Rightarrow R^2 = ${RR * RR} \Rightarrow R = ${RR}$ m. $\Gamma = 2\pi R = ${2 * RR}\pi$ m, άρα $\kappa = ${2 * RR}$.` };
    if (t === 2) { const mu = bkPick([30, 40, 45, 60, 72, 90, 120, 180, 270]), r = bkPick([3, 6, 12]), k = r * r * mu / 360; if (Math.round(k * 4) !== k * 4) return GENS.h3disc.make(); return { q: R`Κυκλικός τομέας έχει ακτίνα $${r}$ cm και επίκεντρη γωνία $${mu}^\circ$. Το εμβαδόν του είναι $\kappa\pi$ cm². Να βρείτε το $\kappa$.`, fields: [{ label: "κ =", ans: k }], sol: R`$E_{\kappa.\tau.} = \frac{\mu}{360}\cdot\pi R^2 = \frac{${mu}}{360}\cdot ${r * r}\pi = ${h3m(k)}\pi$ cm².` }; }
    const r = ri(1, RR - 1); return { q: R`Κυκλικός δακτύλιος σχηματίζεται από δύο ομόκεντρους κύκλους με ακτίνες $R = ${RR}$ cm και $\rho = ${r}$ cm. Το εμβαδόν του είναι $\kappa\pi$ cm². Να βρείτε το $\kappa$.`, fields: [{ label: "κ =", ans: RR * RR - r * r }], sol: R`$E = \pi R^2 - \pi\rho^2 = ${RR * RR}\pi - ${r * r}\pi = ${RR * RR - r * r}\pi$ cm².` };
  } }
});

/* Β΄ Γυμνασίου — widgets & γεννήτριες (μέρος 4: εξισώσεις – ανισώσεις, συναρτήσεις) */
const h4Rel = { "<": "<", ">": ">", "<=": "\\le", ">=": "\\ge" };
const h4RelH = { "<": "&lt;", ">": "&gt;", "<=": "≤", ">=": "≥" };
const h4Flip = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };
/* ακτίνα λύσεων στην ευθεία των πραγματικών */
function h4Ray(P, a, rel, y, col) {
  const right = rel === ">" || rel === ">=", closed = rel.length === 2, end = right ? P.xmax : P.xmin;
  P.top.appendChild(svgEl("line", { x1: P.sx(a), y1: P.sy(y), x2: P.sx(end), y2: P.sy(y), style: `stroke:${col};stroke-width:5;stroke-linecap:round;opacity:.85` }));
  P.top.appendChild(svgEl("circle", { cx: P.sx(a), cy: P.sy(y), r: 6, style: `stroke:${col};stroke-width:2.5;fill:${closed ? col : "#fff"}` }));
}
function h4Seg(P, a, ca, b, cb, y, col) {
  P.top.appendChild(svgEl("line", { x1: P.sx(a), y1: P.sy(y), x2: P.sx(b), y2: P.sy(y), style: `stroke:${col};stroke-width:7;stroke-linecap:round;opacity:.85` }));
  [[a, ca], [b, cb]].forEach(([v, c]) => P.top.appendChild(svgEl("circle", { cx: P.sx(v), cy: P.sy(y), r: 6, style: `stroke:${col};stroke-width:2.5;fill:${c ? col : "#fff"}` })));
}
/* διάστημα λύσεων της x rel a */
const h4Int = (rel, a) => ({ ">": `(${a}, +\\infty)`, ">=": `[${a}, +\\infty)`, "<": `(-\\infty, ${a})`, "<=": `(-\\infty, ${a}]` })[rel];
/* γραμμική παράσταση με όρους: ax + b */
const h4Lin = (a, b, v = "x") => a === 0 ? `${b}` : gyC(a, v) + gyS(b);
const h4Ax = (a, x) => a === 1 ? gyPar(x) : a === -1 ? "-" + gyPar(x) : a + "\\cdot " + gyPar(x);
const h4Nf = v => String(v).replace(/[.,]/, "{,}");

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 4.1 Διερεύνηση εξίσωσης ---------- */
  h4eqdisc(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="-4" max="4" value="2"><b class="va"></b></label>
      <label>β <input type="range" class="rb" min="-6" max="6" value="1"><b class="vb"></b></label>
      <label>γ <input type="range" class="rc" min="-4" max="4" value="2"><b class="vc"></b></label>
      <label>δ <input type="range" class="rd" min="-6" max="6" value="-3"><b class="vd"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const [a, b, c, d] = ["a", "b", "c", "d"].map(k => +$(".r" + k, box).value);["a", "b", "c", "d"].forEach((k, i) => $(".v" + k, box).textContent = [a, b, c, d][i]);
      const P = makePlot($(".pl", box), { xmin: -6, xmax: 6, ymin: -8, ymax: 8, H: 300, xstep: 1, ystep: 2 });
      P.curve(x => a * x + b, "c1"); P.curve(x => c * x + d, "c3");
      const A = a - c, B = d - b; let txt = `Εξίσωση: $${h4Lin(a, b)} = ${h4Lin(c, d)}$ &nbsp;⇔&nbsp; $${A === 0 ? "0x" : gyC(A)} = ${B}$. `;
      if (A !== 0) { const x = B / A; P.dot(x, a * x + b, "dmax", `x = ${fmt(x)}`); txt += `<b>Μοναδική λύση</b> $x = ${texFrac(B, A)}$: οι δύο ευθείες (τα δύο μέλη) τέμνονται σε ένα σημείο.`; }
      else if (B !== 0) txt += `<b>Αδύνατη</b> ($0x = ${B}$): οι ευθείες είναι παράλληλες, δεν συναντιούνται ποτέ.`;
      else txt += `<b>Αόριστη</b> ($0x = 0$): οι ευθείες ταυτίζονται, κάθε $x$ είναι λύση.`;
      $(".wout", box).innerHTML = txt + `<br><span class="muted">Μπλε: το 1ο μέλος $y = ${h4Lin(a, b)}$, πορτοκαλί: το 2ο μέλος $y = ${h4Lin(c, d)}$.</span>`;
      if (window.renderMathInElement) renderMathInElement($(".wout", box), { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 4.2 Μετασχηματισμός τύπου ---------- */
  h4formula(box) {
    const F = [
      { n: "F = 1,8C + 32 (θερμοκρασία)", a: ["C (°C)", -20, 45, 30], solve: "C = \\dfrac{F - 32}{1{,}8}", f: c => 1.8 * c + 32, out: "F (°F)", inv: v => (v - 32) / 1.8 },
      { n: "Π = 2(α + β) (περίμετρος, α = 7)", a: ["β (cm)", 1, 20, 14], solve: "\\beta = \\dfrac{\\Pi - 2\\alpha}{2}", f: b => 2 * (7 + b), out: "Π (cm)", inv: v => (v - 14) / 2 },
      { n: "S = u·t (απόσταση, u = 60 km/h)", a: ["t (h)", 1, 10, 3], solve: "t = \\dfrac{S}{u}", f: t => 60 * t, out: "S (km)", inv: v => v / 60 },
      { n: "E = (β + Β)υ/2 (τραπέζιο, β = 8, Β = 12)", a: ["υ (m)", 1, 15, 6], solve: "\\upsilon = \\dfrac{2E}{\\beta + B}", f: u => 10 * u, out: "E (m²)", inv: v => v / 10 }
    ];
    box.innerHTML = `<div class="wctl"><label>τύπος <select class="sf">${F.map((f, i) => `<option value="${i}">${f.n}</option>`).join("")}</select></label>
      <label><span class="ln"></span> <input type="range" class="rv" min="0" max="10" value="5"><b class="vv"></b></label></div><div class="wout"></div>`;
    let last = -1;
    function draw() {
      const k = +$(".sf", box).value, f = F[k], r = $(".rv", box);
      if (k !== last) { r.min = f.a[1]; r.max = f.a[2]; r.value = f.a[3]; last = k; }
      const v = +r.value, y = f.f(v); $(".vv", box).textContent = fmt(v); $(".ln", box).textContent = f.a[0];
      $(".wout", box).innerHTML = `<b>Ευθύς υπολογισμός:</b> ${f.a[0].split(" ")[0]} = ${fmt(v)} &nbsp;⇒&nbsp; ${f.out} = <b>${fmt(y)}</b><br>
        <b>Μετασχηματισμένος τύπος:</b> $${f.solve}$ &nbsp;⇒&nbsp; για ${f.out.split(" ")[0]} = ${fmt(y)} ξαναβρίσκουμε ${f.a[0].split(" ")[0]} = <b>${fmt(f.inv(y))}</b>
        <br><span class="muted">Ο μετασχηματισμός τύπου είναι επίλυση εξίσωσης ως προς άλλη μεταβλητή: κάνουμε τις αντίστροφες πράξεις με την αντίστροφη σειρά.</span>`;
      if (window.renderMathInElement) renderMathInElement($(".wout", box), { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
    }
    $(".sf", box).onchange = draw; $(".rv", box).oninput = draw; draw();
  },

  /* ---------- 4.3 Ιδιότητες ανισοτήτων ---------- */
  h4ineqprop(box) {
    box.innerHTML = `<div class="wctl"><label>Α <input type="range" class="ra" min="-6" max="6" value="-4"><b class="va"></b></label>
      <label>Β <input type="range" class="rb" min="-6" max="6" value="3"><b class="vb"></b></label>
      <label>Γ <input type="range" class="rc" min="-3" max="3" step="0.5" value="-2"><b class="vc"></b></label>
      <label>πράξη <select class="so"><option value="0">προσθέτω Γ</option><option value="1">πολλαπλασιάζω επί Γ</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const A = +$(".ra", box).value, B = +$(".rb", box).value, G = +$(".rc", box).value, o = +$(".so", box).value;
      $(".va", box).textContent = A; $(".vb", box).textContent = B; $(".vc", box).textContent = fmt(G);
      const A2 = o ? A * G : A + G, B2 = o ? B * G : B + G, s = (u, v) => u < v ? "&lt;" : u > v ? "&gt;" : "=";
      const P = makePlot($(".pl", box), { xmin: -19, xmax: 19, ymin: -1.5, ymax: 3, H: 170, xstep: 2, ystep: 1 });
      P.dot(A, 2, "d1", "Α", -4, -10); P.dot(B, 2, "d3", "Β", 4, -10); P.dot(A2, 0.6, "d1", o ? "ΑΓ" : "Α+Γ", -4, 22); P.dot(B2, 0.6, "d3", o ? "ΒΓ" : "Β+Γ", 4, 22);
      gArrow(P, A, 1.8, A2, 0.8, "var(--blue)", 2); gArrow(P, B, 1.8, B2, 0.8, "var(--amber)", 2);
      let note = "";
      if (A === B) note = "Πάρε Α ≠ Β για να δεις ανισότητα.";
      else if (!o) note = "Προσθέτοντας τον ίδιο αριθμό, και τα δύο σημεία μετακινούνται το ίδιο: <b>η φορά διατηρείται</b>.";
      else if (G > 0) note = "Πολλαπλασιασμός με <b>θετικό</b>: η φορά <b>διατηρείται</b>.";
      else if (G < 0) note = "Πολλαπλασιασμός με <b>αρνητικό</b>: τα σημεία «καθρεφτίζονται» ως προς το 0 και η φορά <b>αλλάζει</b>.";
      else note = "Με Γ = 0 και τα δύο γίνονται 0: παίρνουμε ισότητα.";
      $(".wout", box).innerHTML = `Αρχικά: ${A} ${s(A, B)} ${B} &nbsp;→&nbsp; ${o ? `${A}·(${fmt(G)}) = ${fmt(A2)} ${s(A2, B2)} ${fmt(B2)} = ${B}·(${fmt(G)})` : `${A} + (${fmt(G)}) = ${fmt(A2)} ${s(A2, B2)} ${fmt(B2)} = ${B} + (${fmt(G)})`}<br>${note}`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 4.4 Ανισώσεις α΄ βαθμού ---------- */
  h4ineq(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="-5" max="5" value="-2"><b class="va"></b></label>
      <label>β <input type="range" class="rb" min="-8" max="8" value="3"><b class="vb"></b></label>
      <label>σχέση <select class="sr"><option>&lt;</option><option>&gt;</option><option value="<=">≤</option><option value=">=">≥</option></select></label>
      <label>γ <input type="range" class="rc" min="-10" max="10" value="-5"><b class="vc"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, b = +$(".rb", box).value, c = +$(".rc", box).value, rel = $(".sr", box).value;
      $(".va", box).textContent = a; $(".vb", box).textContent = b; $(".vc", box).textContent = c;
      const P = makePlot($(".pl", box), { xmin: -10.6, xmax: 10.6, ymin: -0.8, ymax: 1.2, H: 110, xstep: 1, ystep: 1 });
      let txt = `$${h4Lin(a, b)} ${h4Rel[rel]} ${c}$ ⇔ $${a === 0 ? "0x" : gyC(a)} ${h4Rel[rel]} ${c - b}$`;
      if (a === 0) { const ok = { "<": 0 < c - b, ">": 0 > c - b, "<=": 0 <= c - b, ">=": 0 >= c - b }[rel];
        if (ok) P.band(P.xmin, P.xmax, "bandok");
        txt += ok ? `: αληθεύει για <b>κάθε</b> $x$.` : `: <b>αδύνατη</b>, καμία τιμή του $x$ δεν την επαληθεύει.`; }
      else { const r2 = a < 0 ? h4Flip[rel] : rel, v = (c - b) / a;
        h4Ray(P, v, r2, 0.4, "var(--green)");
        txt += ` ⇔ $x ${h4Rel[r2]} ${texFrac(c - b, a)}$ ${a < 0 ? "(διαιρέσαμε με <b>αρνητικό</b>, άρα η φορά <b>άλλαξε</b>)" : "(διαιρέσαμε με θετικό, η φορά διατηρείται)"}.<br>Διάστημα: $x \\in ${h4Int(r2, texFrac(c - b, a))}$ · ${r2.length === 2 ? "γεμάτος κύκλος: το άκρο ανήκει στη λύση" : "κενός κύκλος: το άκρο δεν ανήκει στη λύση"}.`; }
      $(".wout", box).innerHTML = txt;
      if (window.renderMathInElement) renderMathInElement($(".wout", box), { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 4.5 Συναλήθευση ---------- */
  h4inter(box) {
    const sel = c => `<select class="${c}"><option>&lt;</option><option>&gt;</option><option value="<=">≤</option><option value=">=">≥</option></select>`;
    box.innerHTML = `<div class="wctl"><label>x ${sel("s1")} <input type="range" class="r1" min="-8" max="8" value="3"><b class="v1"></b></label>
      <label>x ${sel("s2")} <input type="range" class="r2" min="-8" max="8" value="-1"><b class="v2"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    $(".s1", box).value = "<"; $(".s2", box).value = ">=";
    function draw() {
      const a = +$(".r1", box).value, b = +$(".r2", box).value, r1 = $(".s1", box).value, r2 = $(".s2", box).value;
      $(".v1", box).textContent = a; $(".v2", box).textContent = b;
      const P = makePlot($(".pl", box), { xmin: -10.6, xmax: 10.6, ymin: -0.8, ymax: 2.6, H: 170, xstep: 1, ystep: 1 });
      h4Ray(P, a, r1, 2, "var(--blue)"); h4Ray(P, b, r2, 1.3, "var(--amber)");
      /* κάτω φράγμα και άνω φράγμα */
      let lo = -Infinity, loC = false, hi = Infinity, hiC = false;
      [[a, r1], [b, r2]].forEach(([v, r]) => {
        if (r[0] === ">") { if (v > lo || (v === lo && r === ">")) { lo = v; loC = r === ">="; } }
        else { if (v < hi || (v === hi && r === "<")) { hi = v; hiC = r === "<="; } }
      });
      let txt;
      const empty = lo > hi || (lo === hi && !(loC && hiC));
      if (empty) txt = `Οι ακτίνες δεν έχουν κοινό μέρος: <b>καμία κοινή λύση</b>.`;
      else if (lo === hi) { P.dot(lo, 0.4, "dmax"); txt = `Μοναδική κοινή λύση: <b>$x = ${lo}$</b>.`; }
      else {
        if (lo === -Infinity) h4Ray(P, hi, hiC ? "<=" : "<", 0.4, "var(--green)");
        else if (hi === Infinity) h4Ray(P, lo, loC ? ">=" : ">", 0.4, "var(--green)");
        else h4Seg(P, lo, loC, hi, hiC, 0.4, "var(--green)");
        const L = lo === -Infinity ? "(-\\infty" : (loC ? "[" : "(") + lo, H = hi === Infinity ? "+\\infty)" : hi + (hiC ? "]" : ")");
        txt = `Κοινές λύσεις (πράσινο): <b>$x \\in ${L}, ${H}$</b>${lo !== -Infinity && hi !== Infinity ? `, δηλαδή $${lo} ${loC ? "\\le" : "<"} x ${hiC ? "\\le" : "<"} ${hi}$` : ""}.`;
      }
      $(".wout", box).innerHTML = txt + `<br><span class="muted">Μπλε: $x ${h4Rel[r1]} ${a}$ · πορτοκαλί: $x ${h4Rel[r2]} ${b}$. Αγκύλη [ ] όταν το άκρο ανήκει, παρένθεση ( ) όταν δεν ανήκει.</span>`;
      if (window.renderMathInElement) renderMathInElement($(".wout", box), { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 5.2 / 5.4 Ευθεία y = αx + β, κλίση ---------- */
  h4line(box) {
    box.innerHTML = `<div class="wctl"><label>α <input type="range" class="ra" min="-4" max="4" step="0.5" value="2"><b class="va"></b></label>
      <label>β <input type="range" class="rb" min="-5" max="5" step="1" value="-1"><b class="vb"></b></label>
      <label>Δx <input type="range" class="rd" min="1" max="4" value="1"><b class="vd"></b></label>
      <label><input type="checkbox" class="ck" checked> τρίγωνο κλίσης</label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, b = +$(".rb", box).value, dx = +$(".rd", box).value, tri = $(".ck", box).checked;
      $(".va", box).textContent = fmt(a); $(".vb", box).textContent = b; $(".vd", box).textContent = dx;
      const P = makePlot($(".pl", box), { xmin: -7, xmax: 7, ymin: -7, ymax: 7, H: 330, xstep: 1, ystep: 1 });
      P.curve(x => a * x + b, "c1"); P.dot(0, b, "d3", `(0, ${b})`, -8, a > 0 ? -8 : 18);
      if (a !== 0) { const x0 = -b / a; if (Math.abs(x0) <= 7 && x0 !== 0) P.dot(x0, 0, "d2", `(${fracS2(-b * 2, a * 2)}, 0)`, 8, a > 0 ? 18 : -8); }
      const x1 = 1, y1 = a * x1 + b;
      if (tri) { P.seg(x1, y1, x1 + dx, y1, "guide"); P.seg(x1 + dx, y1, x1 + dx, y1 + a * dx, "guide");
        const t1 = svgEl("text", { x: P.sx(x1 + dx / 2), y: P.sy(y1) + (a >= 0 ? 16 : -8), "text-anchor": "middle", class: "lbl d2" }); t1.textContent = `Δx = ${dx}`; P.top.appendChild(t1);
        const t2 = svgEl("text", { x: P.sx(x1 + dx) + 6, y: P.sy(y1 + a * dx / 2) + 4, class: "lbl d2" }); t2.textContent = `Δy = ${fmt(a * dx)}`; P.top.appendChild(t2); }
      const eq = h4Lin(a, b).replace(".", "{,}");
      $(".wout", box).innerHTML = `Ευθεία: $y = ${a === 0 ? b : eq}$ · τέμνει τον άξονα $y$ στο $(0, ${b})$${a !== 0 ? ` και τον άξονα $x$ στο $\\left(${texFrac(-b * 2, a * 2)}, 0\\right)$` : ""}.<br>
        Κλίση: $\\lambda = \\dfrac{\\Delta y}{\\Delta x} = \\dfrac{${h4Nf(fmt(a * dx))}}{${dx}} = ${h4Nf(fmt(a))}$, δηλαδή ίση με τον συντελεστή $\\alpha$ του $x$. ${a > 0 ? "$\\lambda > 0$: καθώς το $x$ αυξάνεται, το $y$ αυξάνεται" : a < 0 ? "$\\lambda < 0$: καθώς το $x$ αυξάνεται, το $y$ μειώνεται" : "$\\lambda = 0$: οριζόντια ευθεία $y = \\beta$"}.`;
      if (window.renderMathInElement) renderMathInElement($(".wout", box), { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
    }
    box.querySelectorAll("input").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 5.3 Ειδικές περιπτώσεις ευθειών ---------- */
  h4special(box) {
    box.innerHTML = `<div class="wctl"><label>μορφή <select class="sf"><option value="0">y = αx</option><option value="1">y = β</option><option value="2">x = κ</option></select></label>
      <label><span class="ln">α</span> <input type="range" class="rv" min="-4" max="4" step="0.5" value="2"><b class="vv"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const t = +$(".sf", box).value, v = +$(".rv", box).value; $(".vv", box).textContent = fmt(v); $(".ln", box).textContent = ["α", "β", "κ"][t];
      const P = makePlot($(".pl", box), { xmin: -6, xmax: 6, ymin: -6, ymax: 6, H: 320, xstep: 1, ystep: 1 }); let txt;
      if (t === 0) { P.curve(x => v * x, "c1"); P.dot(0, 0, "d3", "Ο(0, 0)"); if (Math.abs(v) <= 6) P.dot(1, v, "d2", `(1, ${fmt(v)})`);
        txt = `$y = ${v === 0 ? "0" : gyC(v).replace(".", "{,}")}$: περνά από την <b>αρχή των αξόνων</b>. ${v > 0 ? "Αφού α &gt; 0, βρίσκεται στο 1ο και 3ο τεταρτημόριο." : v < 0 ? "Αφού α &lt; 0, βρίσκεται στο 2ο και 4ο τεταρτημόριο." : "Με α = 0 ταυτίζεται με τον άξονα x (y = 0)."}`; }
      else if (t === 1) { P.curve(() => v, "c1"); P.dot(0, v, "d3", `(0, ${fmt(v)})`);
        txt = `$y = ${h4Nf(fmt(v))}$: ευθεία <b>κάθετη στον άξονα των y</b> στο $(0, ${h4Nf(fmt(v))})$ (παράλληλη στον άξονα x). Είναι σταθερή συνάρτηση, με κλίση $\\lambda = 0$.`; }
      else { P.seg(v, -6, v, 6, "curve c1"); P.dot(v, 0, "d3", `(${fmt(v)}, 0)`, 6, 18);
        txt = `$x = ${h4Nf(fmt(v))}$: ευθεία <b>κάθετη στον άξονα των x</b> στο $(${h4Nf(fmt(v))}, 0)$. <b>Δεν</b> ορίζει συνάρτηση (στο $x = ${h4Nf(fmt(v))}$ αντιστοιχούν άπειρα $y$) και η κλίση της <b>δεν ορίζεται</b>.`; }
      $(".wout", box).innerHTML = txt;
      if (window.renderMathInElement) renderMathInElement($(".wout", box), { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 5.5 Γραφική επίλυση συστήματος ---------- */
  h4sys(box) {
    box.innerHTML = `<div class="wctl"><label>α₁ <input type="range" class="ra" min="-3" max="3" step="0.5" value="2"><b class="va"></b></label>
      <label>β₁ <input type="range" class="rb" min="-5" max="5" value="3"><b class="vb"></b></label>
      <label>α₂ <input type="range" class="rc" min="-3" max="3" step="0.5" value="-1"><b class="vc"></b></label>
      <label>β₂ <input type="range" class="rd" min="-5" max="5" value="6"><b class="vd"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const [a, b, c, d] = ["a", "b", "c", "d"].map(k => +$(".r" + k, box).value);["a", "b", "c", "d"].forEach((k, i) => $(".v" + k, box).textContent = fmt([a, b, c, d][i]));
      const P = makePlot($(".pl", box), { xmin: -6, xmax: 6, ymin: -6, ymax: 10, H: 340, xstep: 1, ystep: 2 });
      P.curve(x => a * x + b, "c1"); P.curve(x => c * x + d, "c3");
      const e1 = h4Lin(a, b).replace(".", "{,}"), e2 = h4Lin(c, d).replace(".", "{,}"); let txt = `$\\begin{cases} y = ${a === 0 ? b : e1} \\\\ y = ${c === 0 ? d : e2} \\end{cases}$ &nbsp; `;
      if (a !== c) { const N = 2 * (d - b), D = 2 * (a - c), Y = a * N + b * D, x = N / D, y = Y / D; if (Math.abs(x) <= 6 && y >= -6 && y <= 10) P.dot(x, y, "dmax", `(${fracS2(N, D)}, ${fracS2(Y, D)})`);
        txt += `Οι ευθείες τέμνονται: <b>μοναδική λύση</b> $(x, y) = \\left(${texFrac(N, D)}, ${texFrac(Y, D)}\\right)$.`; }
      else if (b !== d) txt += `Ίδια κλίση, διαφορετικό β: οι ευθείες είναι <b>παράλληλες</b>, το σύστημα <b>δεν έχει λύση</b>.`;
      else txt += `Οι ευθείες <b>ταυτίζονται</b>: το σύστημα έχει <b>άπειρες λύσεις</b>.`;
      $(".wout", box).innerHTML = txt;
      if (window.renderMathInElement) renderMathInElement($(".wout", box), { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false });
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  h4disc: { title: "Γεννήτρια — διερεύνηση εξίσωσης", make() {
    const t = ri(0, 2);
    if (t === 0) { /* κατηγορία λύσεων */
      const k = ri(0, 2), a = gyNZ(-5, 5), b = ri(-6, 6); let c, d;
      if (k === 0) { do c = gyNZ(-5, 5); while (c === a); d = ri(-6, 6); } else { c = a; if (k === 2) d = b; else do d = ri(-6, 6); while (d === b); }
      const L = h4Lin(a, b), A = a - c, B = d - b; let Rr = h4Lin(c, d), pre = "";
      if (k === 2) { const p = gyNZ(-4, 4), q = b - a * p; Rr = `${a === 1 ? "" : a === -1 ? "-" : a}(x${gyS(p)})${gyS(q)}`; pre = `Το β΄ μέλος: $${Rr} = ${h4Lin(c, d)}$. `; }
      return bkMC({ q: R`Η εξίσωση $${L} = ${Rr}$:`, sol: pre + R`$${gyC(a)} ${c < 0 ? "+ " + gyC(-c) : "- " + gyC(c)} = ${d}${gyS(-b)}$ ⇔ $${A === 0 ? "0x" : gyC(A)} = ${B}$. ${A !== 0 ? `Μοναδική λύση $x = ${texFrac(B, A)}$.` : B !== 0 ? "Αδύνατη (καμία λύση)." : "Αόριστη (κάθε $x$ είναι λύση)."}` },
        ["έχει μία μοναδική λύση", "είναι αδύνατη", "είναι αόριστη"], A !== 0 ? 0 : B !== 0 ? 1 : 2);
    }
    if (t === 1) { /* λ ώστε αδύνατη: (λ - m)x = n */
      const m = gyNZ(-6, 6), n = gyNZ(-9, 9);
      const s = m > 0 ? `\\lambda - ${m}` : `\\lambda + ${-m}`;
      return { q: R`Να βρείτε τον αριθμό $\lambda$ ώστε η εξίσωση $(${s})x = ${n}$ να είναι <b>αδύνατη</b>.`, fields: [{ label: "λ =", ans: m }],
        sol: R`Αδύνατη όταν ο συντελεστής του $x$ είναι $0$ (και $${n} \ne 0$): $${s} = 0 \Rightarrow \lambda = ${m}$. Τότε $0x = ${n}$.` };
    }
    /* α ώστε αόριστη: αx + p = q x + r  με p=r  → α = q */
    const q = gyNZ(-7, 7), p = gyNZ(-9, 9);
    return { q: R`Να βρείτε τον αριθμό $\alpha$ ώστε η εξίσωση $\alpha x ${gyS(p).trim()} = ${gyC(q)}${gyS(p)}$ να είναι <b>αόριστη</b>.`, fields: [{ label: "α =", ans: q }],
      sol: R`$\alpha x - ${q < 0 ? `(${gyC(q)})` : gyC(q)} = ${p} - ${gyPar(p)} \Rightarrow (\alpha ${q < 0 ? "+ " + (-q) : "- " + q})x = 0$. Αόριστη όταν $\alpha ${q < 0 ? "+ " + (-q) : "- " + q} = 0$, δηλαδή $\alpha = ${q}$.` };
  } },
  h4form: { title: "Γεννήτρια — μετασχηματισμός τύπου", make() {
    const t = ri(0, 2);
    if (t === 0) { /* y = ax + b, βρες x */
      const a = ri(2, 6), b = gyNZ(-9, 9), x = gyNZ(-8, 8), y = a * x + b;
      return { q: R`Από τον τύπο $y = ${gyC(a)}${gyS(b)}$, να βρείτε την τιμή του $x$ όταν $y = ${y}$ (λύνοντας πρώτα τον τύπο ως προς $x$).`, fields: [{ label: "x =", ans: x }],
        sol: R`$x = \dfrac{y ${b < 0 ? "+ " + (-b) : "- " + b}}{${a}}$, άρα $x = \dfrac{${y} ${b < 0 ? "+ " + (-b) : "- " + b}}{${a}} = \dfrac{${y - b}}{${a}} = ${x}$.` };
    }
    if (t === 1) { /* Π = 2(α + β) */
      const a = ri(4, 15), b = ri(2, a - 1), P = 2 * (a + b);
      return { q: R`Ένα ορθογώνιο έχει περίμετρο $\Pi = ${P}$ cm και μήκος $\alpha = ${a}$ cm. Λύνοντας τον τύπο $\Pi = 2(\alpha + \beta)$ ως προς $\beta$, να βρείτε το πλάτος $\beta$.`, fields: [{ label: "β (cm) =", ans: b }],
        sol: R`$\beta = \dfrac{\Pi - 2\alpha}{2} = \dfrac{${P} - ${2 * a}}{2} = ${b}$ cm.` };
    }
    const forms = [
      [R`E = \alpha\cdot\beta`, R`\beta`, [R`\beta = \dfrac{E}{\alpha}`, R`\beta = E - \alpha`, R`\beta = E\cdot\alpha`, R`\beta = \dfrac{\alpha}{E}`]],
      [R`S = u\cdot t`, R`t`, [R`t = \dfrac{S}{u}`, R`t = S - u`, R`t = \dfrac{u}{S}`, R`t = S\cdot u`]],
      [R`y = 3x - 1`, R`x`, [R`x = \dfrac{y + 1}{3}`, R`x = \dfrac{y - 1}{3}`, R`x = 3y + 1`, R`x = \dfrac{y}{3} - 1`]],
      [R`2y - x = 4`, R`y`, [R`y = \dfrac{x + 4}{2}`, R`y = \dfrac{x - 4}{2}`, R`y = 2x + 4`, R`y = \dfrac{4 - x}{2}`]],
      [R`F = 1{,}8C + 32`, R`C`, [R`C = \dfrac{F - 32}{1{,}8}`, R`C = \dfrac{F + 32}{1{,}8}`, R`C = 1{,}8F - 32`, R`C = \dfrac{F}{1{,}8} - 32`]],
      [R`V = \alpha\beta\gamma`, R`\gamma`, [R`\gamma = \dfrac{V}{\alpha\beta}`, R`\gamma = V - \alpha\beta`, R`\gamma = V\alpha\beta`, R`\gamma = \dfrac{\alpha\beta}{V}`]]
    ], f = bkPick(forms);
    return bkMC({ q: R`Να λύσετε τον τύπο $${f[0]}$ ως προς $${f[1]}$.`, sol: R`Απομονώνουμε το $${f[1]}$ με τις αντίστροφες πράξεις: $${f[2][0]}$.` }, f[2].map(o => `$${o}$`), 0);
  } },
  h4prop: { title: "Γεννήτρια — ιδιότητες ανισοτήτων", make() {
    const k = gyNZ(-6, 6), rel = bkPick(["<", ">", "<=", ">="]), n = gyNZ(-9, 9); let m; do m = gyNZ(-5, 5); while (m === 1);
    /* Αν x rel k, τότε m x + n ? m k + n */
    const r2 = m < 0 ? h4Flip[rel] : rel, v = m * k + n;
    const opts = [r2, h4Flip[r2], r2.length === 2 ? r2[0] : h4Flip[r2] + "="].map(r => `$${gyC(m)}${gyS(n)} ${h4Rel[r]} ${v}$`);
    return bkMC({ q: R`Αν $x ${h4Rel[rel]} ${k}$, τότε ισχύει:`, sol: R`Πολλαπλασιάζουμε επί $${m}$ (${m < 0 ? "αρνητικός: η φορά <b>αλλάζει</b>" : "θετικός: η φορά διατηρείται"}): $${gyC(m)} ${h4Rel[r2]} ${m * k}$. ${n < 0 ? `Αφαιρούμε $${-n}$` : `Προσθέτουμε $${n}$`} (η φορά διατηρείται): $${gyC(m)}${gyS(n)} ${h4Rel[r2]} ${v}$.` }, opts, 0);
  } },
  h4ineq: { title: "Γεννήτρια — ανισώσεις α΄ βαθμού", make() {
    /* a x + b rel c x + d, με λύση ακέραιη */
    let a, c; do { a = gyNZ(-6, 6); c = ri(-6, 6); } while (a === c);
    const A = a - c, x0 = ri(-7, 7), b = ri(-9, 9), d = b + A * x0, rel = bkPick(["<", ">", "<=", ">="]), r2 = A < 0 ? h4Flip[rel] : rel;
    const right = c === 0 ? `${d}` : h4Lin(c, d);
    const opts = [r2, h4Flip[r2], r2.length === 2 ? r2[0] : r2 + "="].map(r => `$x ${h4Rel[r]} ${x0}$`).concat([`$x ${h4Rel[r2]} ${-x0 === x0 ? x0 + 1 : -x0}$`]);
    return bkMC({ q: R`Να λύσετε την ανίσωση $${h4Lin(a, b)} ${h4Rel[rel]} ${right}$.`,
      sol: R`$${gyC(a)}${c === 0 ? "" : (c < 0 ? " + " + gyC(-c) : " - " + gyC(c))} ${h4Rel[rel]} ${d}${gyS(-b)}$ ${A === 1 ? "" : ` ⇔ $${gyC(A)} ${h4Rel[rel]} ${d - b}$`} ⇔ $x ${h4Rel[r2]} ${x0}$${A < 0 ? " (διαιρέσαμε με αρνητικό, η φορά άλλαξε)" : ""}. Διάστημα: $${h4Int(r2, x0)}$.` }, opts, 0);
  } },
  h4inter: { title: "Γεννήτρια — συναλήθευση ανισώσεων", make() {
    const t = ri(0, 1);
    if (t === 0) { /* x > a και x < b → διάστημα */
      const a = ri(-8, 3), b = a + ri(2, 8), lc = ri(0, 1), rc = ri(0, 1);
      const I = (l, r) => `$${l ? "[" : "("}${a}, ${b}${r ? "]" : ")"}$`;
      const opts = [I(lc, rc), I(!lc, !rc), lc === rc ? I(lc, !rc) : I(1, 1), `$(-\\infty, ${a}) \\cup (${b}, +\\infty)$`];
      return bkMC({ q: R`Οι κοινές λύσεις των ανισώσεων $x ${lc ? "\\ge" : ">"} ${a}$ και $x ${rc ? "\\le" : "<"} ${b}$ είναι:`,
        sol: R`Οι λύσεις είναι οι αριθμοί μεταξύ $${a}$ και $${b}$: $${a} ${lc ? "\\le" : "<"} x ${rc ? "\\le" : "<"} ${b}$, δηλαδή ${I(lc, rc)} (αγκύλη όταν το άκρο ανήκει).` }, opts, 0);
    }
    /* λύσε δύο ανισώσεις: p x + q < r  και  x + s >= u */
    const p = ri(2, 5), lo = ri(-6, 2), hi = lo + ri(2, 7), q = ri(-6, 6), r = p * hi + q, s = ri(-5, 5), u = lo + s;
    const opts = [`$[${lo}, ${hi})$`, `$(${lo}, ${hi}]$`, `$[${lo}, +\\infty)$`, `$(-\\infty, ${hi})$`];
    return bkMC({ q: R`Να βρείτε τις κοινές λύσεις των ανισώσεων $${gyC(p)}${gyS(q)} < ${r}$ και $x${gyS(s)} \ge ${u}$.`,
      sol: R`1η: $${p}x < ${r - q} \Rightarrow x < ${hi}$. 2η: $x \ge ${s === 0 ? lo : `${u}${gyS(-s)} = ${lo}`}$. Κοινές λύσεις: $${lo} \le x < ${hi}$, δηλαδή $x \in [${lo}, ${hi})$.` }, opts, 0);
  } },
  h4fval: { title: "Γεννήτρια — τιμές συνάρτησης", make() {
    const t = ri(0, 1);
    if (t === 0) { const a = gyNZ(-3, 3), b = ri(-5, 5), x = ri(-4, 4), v = a * x * x + b;
      return { q: R`Δίνεται η συνάρτηση $f(x) = ${gyC(a, "x^2")}${gyS(b)}$. Να βρείτε την τιμή $f(${x})$.`, fields: [{ label: `f(${x}) =`, ans: v }],
        sol: R`$f(${x}) = ${a === 1 ? "" : a === -1 ? "-" : a + "\\cdot "}${gyPar(x)}^2${gyS(b)} = ${a === 1 ? "" : a === -1 ? "-" : a + "\\cdot "}${x * x}${gyS(b)} = ${v}$.` }; }
    const A = [-2, -1, 0, 1, 2, 3].sort(() => Math.random() - .5).slice(0, 4).sort((u, v) => u - v), a = gyNZ(-2, 2), b = ri(-4, 4), f = x => a * x * x + b;
    const vals = [...new Set(A.map(f))].sort((u, v) => u - v);
    return { q: R`Η συνάρτηση $f(x) = ${gyC(a, "x^2")}${gyS(b)}$ έχει Πεδίο Ορισμού $A = \{${A.join(", ")}\}$. Πόσα στοιχεία έχει το Πεδίο Τιμών της και ποιο είναι το μεγαλύτερο;`,
      fields: [{ label: "πλήθος =", ans: vals.length }, { label: "μέγιστο =", ans: vals[vals.length - 1] }],
      sol: R`$${A.map(x => `f(${x}) = ${f(x)}`).join(",\\ ")}$. Πεδίο Τιμών: $\{${vals.join(", ")}\}$.` };
  } },
  h4lin: { title: "Γεννήτρια — γραμμική συνάρτηση", make() {
    const t = ri(0, 2);
    if (t === 0) { /* σημεία τομής με άξονες */
      const a = gyNZ(-4, 4), x0 = gyNZ(-5, 5), b = -a * x0;
      return { q: R`Να βρείτε τα σημεία τομής της ευθείας $y = ${h4Lin(a, b)}$ με τους άξονες: $(x_0, 0)$ και $(0, y_0)$.`, fields: [{ label: "x₀ =", ans: x0 }, { label: "y₀ =", ans: b }],
        sol: R`Για $y = 0$: $${gyC(a)}${gyS(b)} = 0 \Rightarrow x = ${x0}$. Για $x = 0$: $y = ${b}$. Σημεία $(${x0}, 0)$ και $(0, ${b})$.` }; }
    if (t === 1) { /* β ώστε να περνά από σημείο */
      const a = gyNZ(-4, 4), x = gyNZ(-4, 4), b = ri(-6, 6), y = a * x + b;
      return { q: R`Η ευθεία $y = ${gyC(a)} + \beta$ περνά από το σημείο $A(${x}, ${y})$. Να βρείτε το $\beta$.`, fields: [{ label: "β =", ans: b }],
        sol: R`Οι συντεταγμένες επαληθεύουν την εξίσωση: $${y} = ${h4Ax(a, x)} + \beta \Rightarrow ${y} = ${a * x} + \beta \Rightarrow \beta = ${b}$.` }; }
    /* ανήκει σημείο; */
    const a = gyNZ(-4, 4), b = ri(-5, 5), x = ri(-4, 4), on = ri(0, 1), y = a * x + b + (on ? 0 : gyNZ(-2, 2));
    return bkMC({ q: R`Το σημείο $(${x}, ${y})$ ανήκει στην ευθεία $y = ${h4Lin(a, b)}$;`, sol: R`$${h4Ax(a, x)}${gyS(b)} = ${a * x + b}$${on ? ` $= ${y}$: αληθής, το σημείο <b>ανήκει</b>.` : ` $\\ne ${y}$: το σημείο <b>δεν ανήκει</b>.`}` }, ["Ναι", "Όχι"], on ? 0 : 1);
  } },
  h4spec: { title: "Γεννήτρια — ειδικές περιπτώσεις ευθειών", make() {
    const t = ri(0, 1);
    if (t === 0) { const x = gyNZ(-4, 4), a = gyNZ(-4, 4), y = a * x;
      return { q: R`Η ευθεία $y = \alpha x$ περνά από το σημείο $(${x}, ${y})$. Να βρείτε το $\alpha$.`, fields: [{ label: "α =", ans: a }],
        sol: R`$${y} = \alpha\cdot ${gyPar(x)} \Rightarrow \alpha = ${y} : ${gyPar(x)} = ${a}$. Η ευθεία είναι η $y = ${gyC(a)}$.` }; }
    let x, y; do { x = gyNZ(-6, 6); y = gyNZ(-6, 6); } while (x === y); const k = ri(0, 1);
    return bkMC({ q: R`Ποια είναι η εξίσωση της ευθείας που περνά από το σημείο $(${x}, ${y})$ και είναι κάθετη στον άξονα των ${k ? "$x$" : "$y$"};`,
      sol: k ? R`Κάθετη στον άξονα $x$: της μορφής $x = \kappa$. Περνά από το $(${x}, ${y})$, άρα $x = ${x}$.` : R`Κάθετη στον άξονα $y$: της μορφής $y = \beta$. Περνά από το $(${x}, ${y})$, άρα $y = ${y}$.` },
      k ? [`$x = ${x}$`, `$y = ${y}$`, `$x = ${y}$`, `$y = ${x}$`] : [`$y = ${y}$`, `$x = ${x}$`, `$y = ${x}$`, `$x = ${y}$`], 0);
  } },
  h4slope: { title: "Γεννήτρια — κλίση ευθείας", make() {
    const t = ri(0, 1);
    if (t === 0) { let x1, x2, y1, y2; do { x1 = ri(-5, 5); x2 = ri(-5, 5); y1 = ri(-6, 6); y2 = ri(-6, 6); } while (x1 === x2);
      return { q: R`Να βρείτε την κλίση της ευθείας που περνά από τα σημεία $A(${x1}, ${y1})$ και $B(${x2}, ${y2})$.`, fields: [{ label: "λ =", ans: gyF(y2 - y1, x2 - x1) }],
        sol: R`$\lambda = \dfrac{y_2 - y_1}{x_2 - x_1} = \dfrac{${y2} - ${gyPar(y1)}}{${x2} - ${gyPar(x1)}} = \dfrac{${y2 - y1}}{${x2 - x1}}${gcdI(y2 - y1, x2 - x1) !== 1 || x2 - x1 < 0 || x2 - x1 === 1 ? ` = ${gyT(y2 - y1, x2 - x1).replace(/\\frac/g, "\\dfrac")}` : ""}$.` }; }
    /* εξίσωση από κλίση και σημείο */
    const l = gyNZ(-4, 4), x = gyNZ(-4, 4), b = ri(-6, 6), y = l * x + b;
    return { q: R`Να βρείτε την εξίσωση $y = \alpha x + \beta$ της ευθείας που έχει κλίση $\lambda = ${l}$ και περνά από το σημείο $(${x}, ${y})$. Δώστε τα $\alpha$ και $\beta$.`, fields: [{ label: "α =", ans: l }, { label: "β =", ans: b }],
      sol: R`$\alpha = \lambda = ${l}$. Από το σημείο: $${y} = ${h4Ax(l, x)} + \beta \Rightarrow \beta = ${y} - ${gyPar(l * x)} = ${b}$. Άρα $y = ${h4Lin(l, b)}$.` };
  } },
  h4sys: { title: "Γεννήτρια — γραμμικά συστήματα", make() {
    const x = ri(-5, 6), y = ri(-5, 6), t = ri(0, 1);
    if (t === 0) { let a, p, q; do { a = gyNZ(-3, 3); p = gyNZ(-3, 3); q = gyNZ(-3, 3); } while (p + q * a === 0); const b = y - a * x, r = p * x + q * y;
      return { q: R`Να λύσετε το σύστημα $\begin{cases} y = ${h4Lin(a, b)} \\ ${gyC(p)} ${q < 0 ? "-" : "+"} ${gyC(Math.abs(q), "y")} = ${r} \end{cases}$`, fields: [{ label: "x =", ans: x }, { label: "y =", ans: y }],
        sol: R`Αντικατάσταση: $${gyC(p)} ${q < 0 ? "-" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}(${h4Lin(a, b)}) = ${r} \Rightarrow ${gyC(p + q * a)} = ${r - q * b} \Rightarrow x = ${x}$. Τότε $y = ${h4Ax(a, x)}${gyS(b)} = ${y}$.` }; }
    const s = x + y, d = x - y;
    return { q: R`Να λύσετε το σύστημα $\begin{cases} x + y = ${s} \\ x - y = ${d} \end{cases}$`, fields: [{ label: "x =", ans: x }, { label: "y =", ans: y }],
      sol: R`Από την 1η: $y = ${s} - x$. Στη 2η: $x - (${s} - x) = ${d} \Rightarrow 2x = ${d + s} \Rightarrow x = ${x}$, οπότε $y = ${s} - ${gyPar(x)} = ${y}$.` };
  } }
});

/* Β΄ Γυμνασίου — widgets & γεννήτριες (μέρος 5): μετασχηματισμοί, ανάλογα ποσά, μέτρα θέσης, πιθανότητες */
const h5Pt = (P, x, y) => `${P.sx(x).toFixed(1)},${P.sy(y).toFixed(1)}`;
function h5Poly(P, pts, st) { const e = svgEl("polygon", { points: pts.map(([x, y]) => h5Pt(P, x, y)).join(" "), style: st }); P.layer.appendChild(e); return e; }
function h5Arrow(P, x1, y1, x2, y2, col) {
  const X1 = P.sx(x1), Y1 = P.sy(y1), X2 = P.sx(x2), Y2 = P.sy(y2), L = Math.hypot(X2 - X1, Y2 - Y1); if (L < 4) return;
  const ux = (X2 - X1) / L, uy = (Y2 - Y1) / L, a = 9, b = 4.5;
  P.top.appendChild(svgEl("line", { x1: X1, y1: Y1, x2: X2 - ux * a * .8, y2: Y2 - uy * a * .8, style: `stroke:${col};stroke-width:2;stroke-dasharray:5 4` }));
  P.top.appendChild(svgEl("polygon", { points: `${X2},${Y2} ${X2 - ux * a - uy * b},${Y2 - uy * a + ux * b} ${X2 - ux * a + uy * b},${Y2 - uy * a - ux * b}`, style: `fill:${col}` }));
}
function h5LblOut(P, pts, i, t, col) { const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length, ux = pts[i][0] - cx, uy = pts[i][1] - cy, L = Math.hypot(ux, uy) || 1; h5Lbl(P, pts[i][0], pts[i][1], t, col, 14 * ux / L, -14 * uy / L + 4); }
function h5Lbl(P, x, y, t, col = "var(--navy)", dx = 0, dy = -9) { const e = svgEl("text", { x: P.sx(x) + dx, y: P.sy(y) + dy, "text-anchor": "middle", style: `font-family:var(--sans);font-weight:800;font-size:13px;fill:${col}` }); e.textContent = t; P.top.appendChild(e); }
const h5Dir = (k, pos, neg) => k === 0 ? "" : `${Math.abs(k)} ${Math.abs(k) === 1 ? "μονάδα" : "μονάδες"} ${k > 0 ? pos : neg}`;
const h5Move = (a, b) => [h5Dir(a, "δεξιά", "αριστερά"), h5Dir(b, "πάνω", "κάτω")].filter(Boolean).join(" και ") || "καμία μετακίνηση";
const h5Sum = a => a.reduce((s, v) => s + v, 0);
const h5Med = a => { const s = [...a].sort((p, q) => p - q), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const h5Modes = a => { const c = {}; a.forEach(v => c[v] = (c[v] || 0) + 1); const m = Math.max(...Object.values(c)); return Object.keys(c).filter(k => c[k] === m).map(Number).sort((p, q) => p - q); };
const h5Num = v => String(v).replace(".", "{,}");   /* δεκαδικό με κόμμα σε TeX */

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 6.1 Παράλληλη μεταφορά ---------- */
  h5trans(box) {
    box.innerHTML = `<div class="wctl"><label>οριζόντια <input type="range" class="rk" min="-4" max="6" value="4"><b class="vk"></b></label>
      <label>κατακόρυφα <input type="range" class="rl" min="-4" max="4" value="2"><b class="vl"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    const T = [[-4, -1], [-1, -1], [-3, 2]], N = ["Α", "Β", "Γ"];
    function draw() {
      const k = +$(".rk", box).value, l = +$(".rl", box).value; $(".vk", box).textContent = k; $(".vl", box).textContent = l;
      const P = makePlot($(".pl", box), { xmin: -8, xmax: 8, ymin: -6, ymax: 6, W: 560, H: 420, xstep: 1, ystep: 1 }), I = T.map(([x, y]) => [x + k, y + l]);
      h5Poly(P, T, "fill:rgba(15,111,209,.25);stroke:var(--blue);stroke-width:2.4");
      h5Poly(P, I, "fill:rgba(199,122,10,.25);stroke:var(--amber);stroke-width:2.4");
      T.forEach(([x, y], i) => { h5Arrow(P, x, y, I[i][0], I[i][1], "var(--purple)"); h5LblOut(P, T, i, N[i], "var(--blue)"); h5LblOut(P, I, i, N[i] + "′", "var(--amber)"); });
      const d2 = k * k + l * l, d = Math.sqrt(d2), sq = Number.isInteger(d);
      $(".wout", box).innerHTML = `Κάθε σημείο μετακινείται <b>${h5Move(k, l)}</b>: ${T.map(([x, y], i) => `${N[i]}(${x}, ${y}) → ${N[i]}′(${x + k}, ${y + l})`).join(" · ")}.
        <br>Απόσταση που μετακινείται κάθε σημείο (Πυθαγόρειο): ${d2 === 0 ? "0" : `√(${k}² + ${l}²) = √${d2}${sq ? ` = ${d}` : ` ≈ ${fmt(d)}`}`} μονάδες.
        <br><span class="muted">Πρότυπο και εικόνα είναι <b>ίσα</b> σχήματα. Τα τμήματα ΑΑ′, ΒΒ′, ΓΓ′ είναι ίσα και παράλληλα, άρα π.χ. το ΑΒΒ′Α′ είναι παραλληλόγραμμο.</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 6.2 Επίπεδη στροφή ---------- */
  h5rot(box) {
    box.innerHTML = `<div class="wctl"><label>γωνία θ <input type="range" class="rt" min="0" max="360" step="15" value="90"><b class="vt"></b></label>
      <label>φορά <select class="sf"><option value="1">αριστερόστροφα</option><option value="-1">δεξιόστροφα</option></select></label>
      <label>κέντρο <select class="sc"><option value="0">Ο(0, 0)</option><option value="1">κορυφή Α</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    const T = [[2, 1], [5, 1], [3, 3]], N = ["Α", "Β", "Γ"];
    function draw() {
      const th = +$(".rt", box).value, f = +$(".sf", box).value, c = +$(".sc", box).value; $(".vt", box).textContent = th + "°";
      const [cx, cy] = c ? T[0] : [0, 0], r = gRad(f * th), co = Math.cos(r), si = Math.sin(r);
      const rot = ([x, y]) => { const u = x - cx, v = y - cy; return [cx + u * co - v * si, cy + u * si + v * co].map(t => Math.round(t * 100) / 100 + 0); };
      const I = T.map(rot), P = makePlot($(".pl", box), { xmin: -8, xmax: 8, ymin: -6, ymax: 6, W: 560, H: 420, xstep: 1, ystep: 1 });
      h5Poly(P, T, "fill:rgba(15,111,209,.25);stroke:var(--blue);stroke-width:2.4");
      h5Poly(P, I, "fill:rgba(199,122,10,.25);stroke:var(--amber);stroke-width:2.4");
      const [bx, by] = T[1], [ix, iy] = I[1]; P.seg(cx, cy, bx, by, "guide"); P.seg(cx, cy, ix, iy, "guide");
      const R = 34, a0 = Math.atan2(by - cy, bx - cx), X = P.sx(cx), Y = P.sy(cy);
      if (th % 360) { let d = ""; for (let i = 0; i <= 40; i++) { const a = a0 + f * gRad(th) * i / 40; d += (i ? "L" : "M") + (X + R * Math.cos(a)).toFixed(1) + "," + (Y - R * Math.sin(a)).toFixed(1); } P.top.appendChild(svgEl("path", { d, style: "fill:none;stroke:var(--purple);stroke-width:2.2" })); }
      P.dot(cx, cy, "dinf", c ? "" : "Ο", -8, -8);
      T.forEach(([x, y], i) => { h5LblOut(P, T, i, N[i], "var(--blue)"); if (!(c && i === 0) && th % 360) h5LblOut(P, I, i, N[i] + "′", "var(--amber)"); });
      const other = (360 - th) % 360, fn = f > 0 ? "αριστερόστροφα" : "δεξιόστροφα", fo = f > 0 ? "δεξιόστροφα" : "αριστερόστροφα";
      $(".wout", box).innerHTML = `Στροφή με κέντρο ${c ? "την κορυφή Α" : "το Ο"} και γωνία <b>${th}° ${fn}</b>: ${T.map((p, i) => `${N[i]}(${p[0]}, ${p[1]}) → ${N[i]}′(${fmt(I[i][0])}, ${fmt(I[i][1])})`).join(" · ")}.
        <br>Η ίδια στροφή περιγράφεται και ως <b>${other}° ${fo}</b>.${th === 180 ? " Η στροφή κατά 180° είναι η <b>συμμετρία ως προς το κέντρο</b>." : ""}${th % 360 === 0 ? " Η στροφή κατά 0° ή 360° αφήνει το σχήμα στη θέση του." : ""}
        <br><span class="muted">Το κέντρο της στροφής δεν αλλάζει θέση. Κάθε σημείο κρατά την απόστασή του από το κέντρο, άρα πρότυπο και εικόνα είναι ίσα.</span>`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 7.1 – 7.2 Ανάλογα / αντιστρόφως ανάλογα ---------- */
  h5dir(box) { h5PropW(box, 0); },
  h5inv(box) { h5PropW(box, 1); },

  /* ---------- 8.1 Μέτρα θέσης ---------- */
  h5stats(box) {
    const PR = [["Βαθμοί 11 μαθητών", "79, 84, 63, 95, 89, 71, 90, 81, 77, 54, 75"], ["Θερμοκρασίες 15 ημερών (°C)", "36, 37, 37, 38, 40, 40, 39, 36, 37, 38, 37, 39, 39, 40, 40"],
      ["Ύψη 8 αθλητών (cm)", "172, 175, 183, 177, 190, 193, 189, 195"], ["Αδέλφια 20 μαθητών", "0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 5, 6"], ["Με μια ακραία τιμή", "50, 100, 75, 60, 75, 1000, 90, 100"]];
    box.innerHTML = `<div class="wctl"><label>δεδομένα <select class="sp">${PR.map((p, i) => `<option value="${i}">${p[0]}</option>`).join("")}</select></label>
      <label style="flex:1 1 100%">τιμές <input type="text" class="tv" style="width:100%;font:inherit;padding:4px 8px;border:1px solid #c5cfdf;border-radius:8px"></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = ($(".tv", box).value.match(/-?\d+(?:[.,]\d+)?/g) || []).map(s => +s.replace(",", "."));
      if (!a.length) { $(".pl", box).innerHTML = ""; $(".wout", box).innerHTML = "Γράψε αριθμούς χωρισμένους με κόμμα και κενό."; return; }
      const s = [...a].sort((p, q) => p - q), n = s.length, S = h5Sum(s), mean = S / n, med = h5Med(s), mo = h5Modes(s), mn = s[0], mx = s[n - 1];
      const svg = gyCanvas(box, 560, 190), x = v => mx === mn ? 280 : 40 + 480 * (v - mn) / (mx - mn), cnt = {};
      gyAdd(svg, "line", { x1: 30, y1: 150, x2: 530, y2: 150, style: "stroke:var(--navy);stroke-width:2" });
      const mf = Math.max(...s.map(v => s.filter(u => u === v).length)), dy = Math.min(13, 105 / mf);
      s.forEach(v => { cnt[v] = (cnt[v] || 0) + 1; gyAdd(svg, "circle", { cx: x(v), cy: 150 - dy * cnt[v], r: 5.5, style: "fill:var(--blue);fill-opacity:.8" }); });
      let lastX = -99; [...new Set(s)].forEach(v => { if (x(v) - lastX >= 24 || v === mx && x(v) - lastX >= 14) { lastX = x(v); gyAdd(svg, "text", { x: x(v), y: 168, "text-anchor": "middle", style: gyTS + ";font-size:11px" }, fmt(v)); } });
      [[mean, "μέση τιμή", "var(--amber)", 182], [med, "διάμεσος", "var(--green)", 22]].forEach(([v, t, c, ty]) => { gyAdd(svg, "line", { x1: x(v), y1: 30, x2: x(v), y2: 156, style: `stroke:${c};stroke-width:2.4;stroke-dasharray:6 4` }); gyAdd(svg, "text", { x: Math.min(500, Math.max(60, x(v))), y: ty, "text-anchor": "middle", style: gyTS + `;font-size:12px;fill:${c}` }, `${t} ${fmt(v)}`); });
      const half = n % 2 ? `περιττό πλήθος (${n}): διάμεσος η ${(n + 1) / 2}η τιμή = <b>${fmt(med)}</b>` : `άρτιο πλήθος (${n}): διάμεσος ο μέσος όρος της ${n / 2}ης και της ${n / 2 + 1}ης τιμής = (${fmt(s[n / 2 - 1])} + ${fmt(s[n / 2])}) / 2 = <b>${fmt(med)}</b>`;
      const allEq = mo.length === new Set(s).size && n > 1 && new Set(s).size > 1;
      $(".wout", box).innerHTML = `Σε αύξουσα σειρά: ${s.map(fmt).join(", ")}
        <br>Μέση τιμή = ${fmt(S)} / ${n} = <b>${fmt(mean)}</b>${Number.isInteger(mean * 100) ? "" : " (περίπου)"} · ${half}
        <br>Επικρατούσα τιμή: ${allEq ? "όλες οι τιμές έχουν την ίδια συχνότητα, καμία δεν επικρατεί" : `<b>${mo.map(fmt).join(" και ")}</b>${mo.length > 1 ? " (περισσότερες από μία επικρατούσες τιμές)" : ""}`}
        <br><span class="muted">Άλλαξε μια ακραία τιμή: η μέση τιμή μετακινείται πολύ, η διάμεσος ελάχιστα ή καθόλου.</span>`;
    }
    $(".sp", box).onchange = () => { $(".tv", box).value = PR[+$(".sp", box).value][1]; draw(); };
    $(".tv", box).oninput = draw; $(".tv", box).value = PR[0][1]; draw();
  },

  /* ---------- 8.2 Δειγματικός χώρος – αρχή της απαρίθμησης ---------- */
  h5count(box) {
    const D = [1, 2, 3, 4, 5, 6];
    const EX = [
      ["Ρίψη νομίσματος δύο φορές", [["Κ", "Γ"], ["Κ", "Γ"]], [["ίδια όψη", o => o[0] === o[1]], ["τουλάχιστον μία κορώνα", o => o.includes("Κ")]]],
      ["Οικογένεια με τρία παιδιά", [["Α", "Κ"], ["Α", "Κ"], ["Α", "Κ"]], [["όλα αγόρια", o => o.every(c => c === "Α")], ["ακριβώς δύο κορίτσια", o => o.filter(c => c === "Κ").length === 2], ["τουλάχιστον δύο κορίτσια", o => o.filter(c => c === "Κ").length >= 2]]],
      ["Νόμισμα και μετά ζάρι", [["Κ", "Γ"], D], [["κορώνα και 6", o => o[0] === "Κ" && o[1] === 6], ["άρτια ένδειξη στο ζάρι", o => o[1] % 2 === 0]]],
      ["Δύο ζάρια", [D, D], [["ίδια ένδειξη", o => o[0] === o[1]], ["άθροισμα 7", o => o[0] + o[1] === 7], ["τουλάχιστον ένα 6", o => o.includes(6)], ["άρτιο γινόμενο", o => o[0] * o[1] % 2 === 0]]],
      ["Παπούτσια (2), κάλτσες (3), καπέλα (3)", [["Π1", "Π2"], ["Κ1", "Κ2", "Κ3"], ["μπλε", "κόκκινο", "πράσινο"]], [["κόκκινο καπέλο", o => o[2] === "κόκκινο"], ["παπούτσια Π1 και κάλτσες Κ1", o => o[0] === "Π1" && o[1] === "Κ1"]]]
    ];
    box.innerHTML = `<div class="wctl"><label>πείραμα <select class="se">${EX.map((e, i) => `<option value="${i}">${e[0]}</option>`).join("")}</select></label>
      <label>ενδεχόμενο Α <select class="sv"></select></label></div><div class="pl"></div><div class="wout"></div>`;
    const fillEv = () => { $(".sv", box).innerHTML = EX[+$(".se", box).value][2].map((v, i) => `<option value="${i}">${v[0]}</option>`).join(""); };
    function draw() {
      const [nm, St, Ev] = EX[+$(".se", box).value], [en, pr] = Ev[+$(".sv", box).value] || Ev[0];
      let O = [[]]; St.forEach(s => { O = O.flatMap(p => s.map(v => [...p, v])); });
      const fav = O.filter(pr), N = O.length;
      if (St.length === 2 && St[0].length === 6) {
        const svg = gyCanvas(box, 560, 300), c = 40, x0 = 140, y0 = 30;
        D.forEach((v, i) => { gyAdd(svg, "text", { x: x0 + c * i + c / 2, y: y0 - 8, "text-anchor": "middle", style: gyTS }, v); gyAdd(svg, "text", { x: x0 - 14, y: y0 + c * i + c / 2 + 5, "text-anchor": "middle", style: gyTS }, v); });
        D.forEach((a, i) => D.forEach((b, j) => { const ok = pr([a, b]); gyAdd(svg, "rect", { x: x0 + c * j, y: y0 + c * i, width: c, height: c, style: `fill:${ok ? "rgba(25,135,84,.35)" : "#fff"};stroke:#c5cfdf` }); gyAdd(svg, "text", { x: x0 + c * j + c / 2, y: y0 + c * i + c / 2 + 4, "text-anchor": "middle", style: gyTS + ";font-size:10.5px;font-weight:600" }, `${a},${b}`); }));
        gyAdd(svg, "text", { x: 30, y: y0 + 3 * c, style: gyTS + ";font-size:12px" }, "1ο ζάρι"); gyAdd(svg, "text", { x: x0 + 3 * c, y: 292, "text-anchor": "middle", style: gyTS + ";font-size:12px" }, "2ο ζάρι");
      } else {
        const step = Math.min(34, Math.max(15, 300 / N)), H = 30 + step * N, svg = gyCanvas(box, 560, H), colX = k => 30 + k * (St.length > 2 ? 105 : 170);
        const ys = O.map((_, i) => 20 + step * i + step / 2);
        const nodes = (k, pre, idx) => { /* μέσο y των φύλλων με πρόθεμα pre */ const L = idx.filter(i => pre.every((v, t) => O[i][t] === v)); return L.reduce((s, i) => s + ys[i], 0) / L.length; };
        const all = O.map((_, i) => i);
        const walk = (k, pre, py) => { if (k === St.length) return; St[k].forEach(v => { const p2 = [...pre, v], y = nodes(k, p2, all), x = colX(k + 1);
          gyAdd(svg, "line", { x1: colX(k) + (k ? 22 : 0), y1: py, x2: x - 4, y2: y, style: "stroke:#9aa8bf;stroke-width:1.4" });
          gyAdd(svg, "text", { x: x, y: y + 4, style: gyTS + ";font-size:12px" }, v); walk(k + 1, p2, y); }); };
        gyAdd(svg, "circle", { cx: colX(0), cy: H / 2, r: 4, style: "fill:var(--navy)" }); walk(0, [], H / 2);
        O.forEach((o, i) => gyAdd(svg, "text", { x: colX(St.length) + (St.length > 2 ? 62 : 60), y: ys[i] + 4, style: gyTS + `;font-size:12px;fill:${pr(o) ? "var(--green)" : "var(--navy)"}` }, (pr(o) ? "✓ " : "") + o.join(" ")));
      }
      const g = gcdI(fav.length, N);
      $(".wout", box).innerHTML = `${nm}: ${St.length} φάσεις με ${St.map(s => s.length).join(", ")} τρόπους. Αρχή της απαρίθμησης: ν(Ω) = ${St.map(s => s.length).join(" · ")} = <b>${N}</b>.
        <br>Α: «${en}» · ν(Α) = <b>${fav.length}</b> · Ρ(Α) = ${fav.length}/${N}${g > 1 && fav.length ? ` = ${fav.length / g}/${N / g}` : ""} ≈ ${fmt(fav.length / N)}
        <br><span class="muted">Τα ευνοϊκά αποτελέσματα φαίνονται με πράσινο. Ισχύει 0 ≤ Ρ(Α) ≤ 1.</span>`;
    }
    $(".se", box).onchange = () => { fillEv(); draw(); }; $(".sv", box).onchange = draw; fillEv(); draw();
  }
});

function h5PropW(box, m0) {
  box.innerHTML = `<div class="wctl"><label>είδος <select class="sm"><option value="0">ευθέως ανάλογα: y = αx</option><option value="1">αντιστρόφως ανάλογα: y = α/x</option></select></label>
    <label>α <input type="range" class="ra" min="1" max="12" value="${m0 ? 12 : 2}"><b class="va"></b></label></div><div class="pl"></div><div class="wout"></div>`;
  $(".sm", box).value = m0;
  function draw() {
    const m = +$(".sm", box).value, a = +$(".ra", box).value; $(".va", box).textContent = a;
    const X = [1, 2, 3, 4, 6], f = m ? x => a / x : x => a * x;
    const P = m ? makePlot($(".pl", box), { xmin: -13, xmax: 13, ymin: -13, ymax: 13, W: 560, H: 360, xstep: 2, ystep: 2 })
                : makePlot($(".pl", box), { xmin: -1, xmax: 8, ymin: -a, ymax: a * 8, W: 560, H: 320, xstep: 1 });
    if (m) { P.curve(f, "c1", 0.05, 13); P.curve(f, "c1", -13, -0.05); } else P.curve(f, "c1", 0, 8);
    X.forEach(x => P.dot(x, f(x), "d3"));
    const row = (h, v) => `<tr><th style="text-align:left;padding:2px 8px">${h}</th>${v.map(t => `<td style="padding:2px 8px;text-align:center">${t}</td>`).join("")}</tr>`;
    $(".wout", box).innerHTML = `<table style="border-collapse:collapse;margin-bottom:6px">${row("x", X)}${row("y", X.map(x => fmt(f(x))))}${row(m ? "x · y" : "y / x", X.map(x => fmt(m ? x * f(x) : f(x) / x)))}</table>
      ${m ? `Το <b>γινόμενο</b> x · y είναι σταθερό (= ${a}): τα ποσά είναι <b>αντιστρόφως ανάλογα</b>. Όταν το x διπλασιάζεται, το y υποδιπλασιάζεται. Η γραφική παράσταση της y = ${a}/x είναι <b>υπερβολή</b> με δύο κλάδους, που δεν τέμνουν τους άξονες.`
           : `Ο <b>λόγος</b> y / x είναι σταθερός (= ${a}, ο συντελεστής αναλογίας): τα ποσά είναι <b>ευθέως ανάλογα</b>. Όταν το x διπλασιάζεται, διπλασιάζεται και το y. Η γραφική παράσταση της y = ${a}x είναι <b>ευθεία που περνά από την αρχή των αξόνων</b>.`}`;
  }
  $(".sm", box).onchange = draw; $(".ra", box).oninput = draw; draw();
}

var GENS = Object.assign(window.GENS || {}, {
  h5trans: { title: "Γεννήτρια — παράλληλη μεταφορά", make() {
    const t = ri(0, 2), x = ri(-6, 6), y = ri(-6, 6);
    if (t === 0) { const k = gyNZ(-6, 6), l = gyNZ(-6, 6); return { q: R`Το σημείο $A(${x}, ${y})$ μετακινείται με παράλληλη μεταφορά ${h5Move(k, l)}. Ποιες είναι οι συντεταγμένες της εικόνας του $A'$;`, fields: [{ label: "x =", ans: x + k }, { label: "y =", ans: y + l }], sol: R`Δεξιά/αριστερά αλλάζει η τετμημένη, πάνω/κάτω η τεταγμένη: $A'(${x} ${k < 0 ? "-" : "+"} ${Math.abs(k)},\ ${y} ${l < 0 ? "-" : "+"} ${Math.abs(l)}) = A'(${x + k}, ${y + l})$.` }; }
    if (t === 1) { const [p, q, r] = bkPick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13], [9, 12, 15]]), sp = ri(0, 1) ? 1 : -1, sq = ri(0, 1) ? 1 : -1;
      return { q: R`Κάθε σημείο ενός σχήματος μετακινείται με παράλληλη μεταφορά ${h5Move(sp * p, sq * q)}. Πόση απόσταση μετακινείται κάθε σημείο;`, fields: [{ label: "απόσταση =", ans: r }], sol: R`Οι δύο μετακινήσεις είναι κάθετες πλευρές ορθογωνίου τριγώνου. Πυθαγόρειο: $d^2 = ${p}^2 + ${q}^2 = ${p * p + q * q}$, άρα $d = ${r}$ μονάδες.` }; }
    const k = gyNZ(-7, 7), l = gyNZ(-7, 7);
    return { q: R`Με παράλληλη μεταφορά το σημείο $A(${x}, ${y})$ απεικονίζεται στο $A'(${x + k}, ${y + l})$. Πόσες μονάδες μετακινείται οριζόντια και πόσες κατακόρυφα; (θετικός αριθμός: δεξιά / πάνω, αρνητικός: αριστερά / κάτω)`, fields: [{ label: "οριζόντια =", ans: k }, { label: "κατακόρυφα =", ans: l }], sol: R`Οριζόντια: $${x + k} - ${gyParT(x)} = ${k}$, κατακόρυφα: $${y + l} - ${gyParT(y)} = ${l}$. Δηλαδή ${h5Move(k, l)}.` };
  } },
  h5rot: { title: "Γεννήτρια — επίπεδη στροφή", make() {
    const t = ri(0, 2);
    if (t === 2) { const th = bkPick([30, 45, 60, 80, 90, 120, 135, 150, 200, 240, 270, 300]), f = ri(0, 1); return { q: R`Μια στροφή είναι $${th}^\circ$ ${f ? "δεξιόστροφα" : "αριστερόστροφα"}. Με πόσες μοίρες ${f ? "αριστερόστροφα" : "δεξιόστροφα"} μπορεί να περιγραφεί ο ίδιος μετασχηματισμός;`, fields: [{ label: "μοίρες =", ans: 360 - th }], sol: R`Μια πλήρης στροφή είναι $360^\circ$: $360^\circ - ${th}^\circ = ${360 - th}^\circ$ ${f ? "αριστερόστροφα" : "δεξιόστροφα"}.` }; }
    let x, y; do { x = gyNZ(-6, 6); y = gyNZ(-6, 6); } while (Math.abs(x) === Math.abs(y));
    const k = bkPick([[90, "αριστερόστροφα", -y, x], [90, "δεξιόστροφα", y, -x], [180, "αριστερόστροφα", -x, -y], [270, "αριστερόστροφα", y, -x]]);
    return { q: R`Το σημείο $A(${x}, ${y})$ στρέφεται γύρω από την αρχή των αξόνων $O$ κατά $${k[0]}^\circ$ ${k[1]}. Ποιες είναι οι συντεταγμένες της εικόνας του $A'$;`, fields: [{ label: "x =", ans: k[2] }, { label: "y =", ans: k[3] }],
      sol: R`${k[0] === 180 ? R`Στροφή $180^\circ$ = συμμετρία ως προς το $O$: $(x, y) \to (-x, -y)$` : (k[0] === 90 && k[1] === "αριστερόστροφα") ? R`Στροφή $90^\circ$ αριστερόστροφα: $(x, y) \to (-y, x)$` : R`Στροφή $90^\circ$ δεξιόστροφα (ίδια με $270^\circ$ αριστερόστροφα): $(x, y) \to (y, -x)$`}. Άρα $A'(${k[2]}, ${k[3]})$.` };
  } },
  h5dir: { title: "Γεννήτρια — ευθέως ανάλογα ποσά", make() {
    const t = ri(0, 2);
    if (t === 0) { const a = ri(2, 9), x1 = ri(2, 6), x2 = x1 + ri(1, 8); return { q: R`Τα ποσά $x$ και $y$ είναι ευθέως ανάλογα. Για $x = ${x1}$ είναι $y = ${a * x1}$. Να βρείτε τον συντελεστή αναλογίας και την τιμή του $y$ για $x = ${x2}$.`, fields: [{ label: "α =", ans: a }, { label: "y =", ans: a * x2 }], sol: R`$\alpha = \frac{y}{x} = \frac{${a * x1}}{${x1}} = ${a}$, άρα $y = ${a}x$ και για $x = ${x2}$: $y = ${a * x2}$.` }; }
    if (t === 1) { const [it, u1, u2] = bkPick([["κιλά πορτοκαλιών", "κιλά", "€"], ["λίτρα βενζίνης", "λίτρα", "€"], ["μέτρα υφάσματος", "μέτρα", "€"]]), p = bkPick([0.5, 1.5, 2, 2.5, 3, 4]), n1 = ri(2, 8), n2 = ri(3, 15);
      if (n1 === n2) return GENS.h5dir.make(); const c1 = Math.round(p * n1 * 100) / 100, c2 = Math.round(p * n2 * 100) / 100;
      return { q: R`Τα ${n1} ${it} κοστίζουν $${h5Num(c1)}$ €. Πόσο κοστίζουν τα ${n2} ${u1}; (η τιμή είναι ανάλογη της ποσότητας)`, fields: [{ label: "€ =", ans: c2 }], sol: R`Ανάλογα ποσά: $\frac{${n1}}{${h5Num(c1)}} = \frac{${n2}}{x} \Rightarrow ${n1}x = ${n2}\cdot ${h5Num(c1)} \Rightarrow x = ${h5Num(c2)}$ €.` }; }
    const d = bkPick([10, 15, 20, 25, 30, 40]), y = bkPick([60, 90, 120, 150, 180, 240, 300, 360, 450, 600]); if ((y * 100) % (100 - d)) return GENS.h5dir.make(); const x = y * 100 / (100 - d); if (!Number.isInteger(x)) return GENS.h5dir.make();
    return { q: R`Σε περίοδο εκπτώσεων $${d}\%$ ένα προϊόν πωλείται $${y}$ €. Ποια ήταν η αρχική του τιμή;`, fields: [{ label: "€ =", ans: x }], sol: R`Πωλείται στο $${100 - d}\%$ της αρχικής τιμής: $y = ${h5Num((100 - d) / 100)}\,x \Rightarrow ${y} = ${h5Num((100 - d) / 100)}\,x \Rightarrow x = ${x}$ €.` };
  } },
  h5inv: { title: "Γεννήτρια — αντιστρόφως ανάλογα ποσά", make() {
    const t = ri(0, 2);
    if (t === 0) { const a = bkPick([12, 24, 36, 48, 60, 72]), X = gyDivs(a).filter(d => d > 1 && d < a), x1 = bkPick(X), x2 = bkPick(X.filter(d => d !== x1)); return { q: R`Τα ποσά $x$ και $y$ είναι αντιστρόφως ανάλογα. Για $x = ${x1}$ είναι $y = ${a / x1}$. Να βρείτε την τιμή του $y$ για $x = ${x2}$.`, fields: [{ label: "y =", ans: a / x2 }], sol: R`$x\cdot y = ${x1}\cdot ${a / x1} = ${a}$ (σταθερό), άρα $${x2}\cdot y = ${a} \Rightarrow y = ${a / x2}$.` }; }
    if (t === 1) { const m = bkPick([4, 6, 8, 10, 12]), h = bkPick([6, 9, 10, 12, 15, 18]), m2 = bkPick(gyDivs(m * h).filter(d => d !== m && d >= 2 && d <= 20)); return { q: R`${m} μηχανές της ίδιας δυναμικότητας ολοκληρώνουν μια παραγγελία σε ${h} ώρες. Σε πόσες ώρες θα την ολοκληρώσουν ${m2} μηχανές;`, fields: [{ label: "ώρες =", ans: m * h / m2 }], sol: R`Αντιστρόφως ανάλογα ποσά (σταθερό γινόμενο): $${m2}\cdot x = ${m}\cdot ${h} = ${m * h} \Rightarrow x = ${m * h / m2}$ ώρες.` }; }
    const a = bkPick([12, 18, 24, 30, 36]), x1 = bkPick(gyDivs(a).filter(d => d > 1 && d < a)), x2 = bkPick(gyDivs(a).filter(d => d > 1 && d < a && d !== x1)), k = ri(1, 3);
    if (x2 * (a / x1 + k) === a) return GENS.h5inv.make();
    const tabs = [[`${x1} → ${a / x1}`, `${x2} → ${a / x2}`], [`${x1} → ${a / x1}`, `${x2} → ${a / x1 + k}`], [`${x1} → ${a / x1}`, `${x1 * 2} → ${a / x1 * 2}`]];
    return bkMC({ q: R`Σε ποιον πίνακα τιμών $(x \to y)$ τα ποσά είναι αντιστρόφως ανάλογα;`, sol: R`Αντιστρόφως ανάλογα: σταθερό γινόμενο. Στον σωστό: $${x1}\cdot ${a / x1} = ${x2}\cdot ${a / x2} = ${a}$. Στον πίνακα $${x1} \to ${a / x1}$ · $${x1 * 2} \to ${a / x1 * 2}$ ο λόγος είναι σταθερός (ευθέως ανάλογα).` }, tabs.map(r => r.join(" · ")), 0);
  } },
  h5stat: { title: "Γεννήτρια — μέση τιμή, διάμεσος, επικρατούσα τιμή", make() {
    const t = ri(0, 3);
    if (t === 3) { const n = ri(4, 6), m = ri(5, 15), a = Array.from({ length: n - 1 }, () => ri(m - 5, m + 5)), last = n * m - h5Sum(a); if (last < 0 || last > 40) return GENS.h5stat.make();
      return { q: R`Η μέση τιμή ${n} αριθμών είναι $${m}$. Οι ${n - 1} από αυτούς είναι οι $${a.join(",\\ ")}$. Ποιος είναι ο ${n}ος αριθμός;`, fields: [{ label: "=", ans: last }], sol: R`Άθροισμα όλων: $${n}\cdot ${m} = ${n * m}$. Άθροισμα των γνωστών: $${h5Sum(a)}$. Ο ζητούμενος: $${n * m} - ${h5Sum(a)} = ${last}$.` }; }
    const n = ri(5, 9), a = Array.from({ length: n }, () => ri(2, 20)); if (t === 2) { a[1] = a[0]; a[2] = a[0]; } const s = [...a].sort((p, q) => p - q), mo = h5Modes(a);
    if (t === 0) { const S = h5Sum(a); if ((S * 10) % n) return GENS.h5stat.make(); return { q: R`Να βρείτε τη μέση τιμή των παρατηρήσεων: $${a.join(",\\ ")}$.`, fields: [{ label: "μέση τιμή =", ans: S / n }], sol: R`$\bar{X} = \frac{${a.join(" + ")}}{${n}} = \frac{${S}}{${n}} = ${h5Num(S / n)}$.` }; }
    if (t === 1) { const md = h5Med(a); return { q: R`Να βρείτε τη διάμεσο των παρατηρήσεων: $${a.join(",\\ ")}$.`, fields: [{ label: "διάμεσος =", ans: md }], sol: R`Σε αύξουσα σειρά: $${s.join(",\\ ")}$. ${n % 2 ? R`Περιττό πλήθος (${n}): διάμεσος η ${(n + 1) / 2}η τιμή, $${md}$.` : R`Άρτιο πλήθος (${n}): διάμεσος $\frac{${s[n / 2 - 1]} + ${s[n / 2]}}{2} = ${h5Num(md)}$.`}` }; }
    if (mo.length !== 1) return GENS.h5stat.make();
    return { q: R`Να βρείτε την επικρατούσα τιμή των παρατηρήσεων: $${shuffle(a).join(",\\ ")}$.`, fields: [{ label: "επικρατούσα =", ans: mo[0] }], sol: R`Σε αύξουσα σειρά: $${s.join(",\\ ")}$. Τις περισσότερες φορές εμφανίζεται το $${mo[0]}$.` };
  } },
  h5prob: { title: "Γεννήτρια — αρχή της απαρίθμησης και πιθανότητες", make() {
    const t = ri(0, 3);
    if (t === 0) { const S = [[ri(2, 5), "μπλούζες"], [ri(2, 4), "παντελόνια"], [ri(2, 4), "ζευγάρια παπούτσια"]].slice(0, ri(2, 3)); const N = S.reduce((p, s) => p * s[0], 1);
      return { q: R`Η Ελένη έχει ${S.map(s => `${s[0]} ${s[1]}`).join(", ").replace(/, ([^,]*)$/, " και $1")}. Με πόσους διαφορετικούς τρόπους μπορεί να ντυθεί, αν διαλέξει ένα από κάθε είδος;`, fields: [{ label: "τρόποι =", ans: N }], sol: R`Αρχή της απαρίθμησης: $${S.map(s => s[0]).join("\\cdot ")} = ${N}$ τρόποι.` }; }
    if (t === 1) { const s = ri(2, 12), f = 6 - Math.abs(7 - s); return { q: R`Ρίχνουμε δύο ζάρια. Ποια είναι η πιθανότητα το άθροισμα των ενδείξεων να είναι $${s}$;`, fields: [{ label: "P =", ans: gyF(f, 36) }], sol: R`$\nu(\Omega) = 6\cdot 6 = 36$. Ευνοϊκά: ${f} ${f === 1 ? "ζεύγος" : "ζεύγη"} (π.χ. ${s <= 7 ? `$(1, ${s - 1})$` : `$(${s - 6}, 6)$`}). $P = \frac{${f}}{36}${gcdI(f, 36) > 1 ? ` = ${gyT(f, 36)}` : ""}$.` }; }
    if (t === 2) { const k = bkPick([["κορώνα και άρτια ένδειξη", 3], ["γράμματα και ένδειξη μεγαλύτερη του 4", 2], ["κορώνα και ένδειξη 6", 1], ["οποιαδήποτε όψη και ένδειξη 1 ή 2", 4]]); return { q: R`Ρίχνουμε ένα νόμισμα και μετά ένα ζάρι. Ποια είναι η πιθανότητα να φέρουμε ${k[0]};`, fields: [{ label: "P =", ans: gyF(k[1], 12) }], sol: R`$\nu(\Omega) = 2\cdot 6 = 12$, ευνοϊκά αποτελέσματα: ${k[1]}. $P = \frac{${k[1]}}{12}${gcdI(k[1], 12) > 1 ? ` = ${gyT(k[1], 12)}` : ""}$.` }; }
    const a = ri(2, 4), b = ri(3, 5), c = ri(2, 4); return { q: R`Ένας κωδικός έχει τρία σύμβολα: πρώτα ένα από ${a} γράμματα, μετά ένα από ${b} ψηφία και στο τέλος ένα από ${c} χρώματα. Πόσοι διαφορετικοί κωδικοί υπάρχουν;`, fields: [{ label: "κωδικοί =", ans: a * b * c }], sol: R`Τρεις φάσεις: $${a}\cdot ${b}\cdot ${c} = ${a * b * c}$.` };
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

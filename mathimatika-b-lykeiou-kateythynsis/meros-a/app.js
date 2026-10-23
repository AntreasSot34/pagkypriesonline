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
  storeKey: "pagk-b-kat-meros-a-v1",
  heroTitle: "Μαθηματικά Β΄ Λυκείου Κατεύθυνσης — Μέρος Α (Α΄ τετράμηνο)",
  tefxos: "Α΄ τετραμήνου",
  howto: `<ul><li>Κλάσματα: <code>5/2</code> · δεκαδικά: <code>2,5</code> · ρίζες: <code>(√6+√2)/4</code> · π: <code>5π/6</code></li>
    <li>Τύποι συναρτήσεων: <code>(3x+1)/(2-x)</code>, <code>sqrt(x)</code> ή <code>√x</code> — ελέγχεται αν είναι ισοδύναμος με τον σωστό</li>
    <li>Λύσεις εξισώσεων: γράψε τες σε αύξουσα σειρά, όπως ζητείται</li></ul>`
};

const UNITS = [
  { id: 1, title: "Ενότητα 1 · Μαθηματική λογική – Μέθοδοι απόδειξης" },
  { id: 2, title: "Ενότητα 2 · Τριγωνομετρία Ι" },
  { id: 3, title: "Ενότητα 3 · Απόλυτη τιμή – Συναρτήσεις" },
  { id: 4, title: "Ενότητα 4 · Τριγωνομετρία ΙΙ" },
  { id: 5, title: "Ενότητα 5 · Όριο – Συνέχεια συνάρτησης" },
  { id: 6, title: "Ενότητα 6 · Ακολουθίες" }
];














const SECTIONS = [
/* ───────────────────────────── 1.2.2 ───────────────────────────── */
{
  id: "1.2.2", unit: 1, title: "Ευθεία απόδειξη – Απαγωγή σε άτοπο",
  book: "Α΄ Τεύχος §1.2.1–1.2.3 · Δραστηριότητες σελ. 15, 18",
  theory: R`
<div class="tbox"><h4>Ευθεία απόδειξη</h4>
<p>Για να αποδείξουμε $p \Rightarrow q$ ξεκινάμε από την υπόθεση $p$ και με διαδοχικές <b>αληθείς συνεπαγωγές</b> (ορισμούς, ιδιότητες, γνωστά θεωρήματα) καταλήγουμε στο συμπέρασμα $q$.</p>
<p>Π.χ. αν $\alpha \mid \beta$ και $\alpha \mid \gamma$: $\beta = \kappa\alpha$, $\gamma = \lambda\alpha$, άρα $\beta - \gamma = (\kappa - \lambda)\alpha$, δηλαδή $\alpha \mid \beta - \gamma$.</p></div>

<div class="tbox"><h4>Απαγωγή σε άτοπο</h4>
<p>Υποθέτουμε ότι η πρόταση που θέλουμε να αποδείξουμε <b>δεν ισχύει</b> (ισχύει η άρνησή της) και με αληθείς συνεπαγωγές καταλήγουμε σε κάτι ψευδές ή αντιφατικό (<b>άτοπο</b>). Άρα η αρχική πρόταση ισχύει.</p>
<p>Π.χ. «αν ο $\nu^2$ είναι περιττός, τότε ο $\nu$ είναι περιττός»: υποθέτουμε $\nu$ άρτιος, $\nu = 2\rho$, οπότε $\nu^2 = 2(2\rho^2)$ άρτιος — άτοπο.</p></div>

<div class="tbox tip"><h4>Αντιπαράδειγμα</h4>
<p>Για να δείξουμε ότι μια πρόταση «για κάθε $x$…» είναι <b>ψευδής</b>, αρκεί <b>ένα</b> αντιπαράδειγμα. Για να δείξουμε ότι είναι αληθής, δεν αρκούν παραδείγματα — χρειάζεται απόδειξη.</p></div>`,
  exercises: [
    { level: 1, type: "mc", q: R`Θέλουμε να αποδείξουμε με απαγωγή σε άτοπο ότι «αν ο $\nu^2$ είναι περιττός ακέραιος, τότε και ο $\nu$ είναι περιττός». Τι υποθέτουμε στην αρχή;`,
      options: ["Ότι ο $\\nu^2$ είναι περιττός και ο $\\nu$ άρτιος", "Ότι ο $\\nu^2$ είναι άρτιος", "Ότι ο $\\nu$ είναι περιττός", "Ότι ο $\\nu^2$ και ο $\\nu$ είναι άρτιοι"], correct: 0,
      hint: R`Κρατάμε την υπόθεση και αρνούμαστε το συμπέρασμα.`,
      sol: R`Υποθέτουμε ότι ισχύει η υπόθεση ($\nu^2$ περιττός) αλλά <b>όχι</b> το συμπέρασμα ($\nu$ άρτιος) και καταλήγουμε σε αντίφαση.` },
    { level: 1, type: "mc", q: R`Η πρόταση «για κάθε $x \in \mathbb{R}$ ισχύει $x^2 > x$» είναι ψευδής. Ποιο από τα πιο κάτω είναι αντιπαράδειγμα;`,
      options: ["$x = \\frac12$", "$x = 2$", "$x = -1$", "$x = 3$"], correct: 0,
      hint: R`Δοκίμασε κάθε τιμή.`,
      sol: R`Για $x = \frac12$: $x^2 = \frac14 < \frac12$. Οι άλλες τιμές ικανοποιούν την ανισότητα.` },
    { level: 2, type: "fields", q: R`Αν $36x^2 + 3y = 4y^2 + 9x$, αποδεικνύεται ότι $y = 3x$ ή $12x + 4y = 3$. Αν $x = 1$ και $y \ne 3$, να βρείτε το $y$.`,
      fields: [{ label: "y =", ans: "-9/4" }],
      hint: R`Η σχέση γράφεται $(3x - y)(12x + 4y - 3) = 0$.`,
      sol: R`$36x^2 - 4y^2 - 9x + 3y = 4(3x - y)(3x + y) - 3(3x - y) = (3x - y)(12x + 4y - 3) = 0$. Αφού $y \ne 3x$: $12 + 4y = 3 \Rightarrow y = -\frac94$.` },
    { level: 1, type: "mc", q: R`Αποδεικνύουμε με άτοπο ότι $\text{ημ}^2x + 1 \ge 2\,\text{ημ}x$ για κάθε $x$. Υποθέτοντας το αντίθετο, σε ποια ψευδή πρόταση καταλήγουμε;`,
      options: ["$(\\text{ημ}x - 1)^2 < 0$", "$\\text{ημ}x > 1$", "$\\text{ημ}^2x < 0$", "$\\text{ημ}x = 0$"], correct: 0,
      hint: R`Μετέφερε όλους τους όρους στο ένα μέλος.`,
      sol: R`Αν $\text{ημ}^2x + 1 < 2\,\text{ημ}x$, τότε $\text{ημ}^2x - 2\,\text{ημ}x + 1 < 0$, δηλαδή $(\text{ημ}x - 1)^2 < 0$. Κάθε τετράγωνο είναι $\ge 0$: άτοπο.` },
    { level: 1, type: "mc", q: R`Για να αποδείξουμε ότι «κάθε τρίγωνο έχει το πολύ μία ορθή γωνία» με απαγωγή σε άτοπο, υποθέτουμε ότι:`,
      options: ["υπάρχει τρίγωνο με δύο (τουλάχιστον) ορθές γωνίες", "κανένα τρίγωνο δεν έχει ορθή γωνία", "όλα τα τρίγωνα έχουν μία ορθή", "υπάρχει τρίγωνο με αμβλεία γωνία"], correct: 0,
      hint: R`Άρνηση του «το πολύ μία».`,
      sol: R`Η άρνηση είναι «τουλάχιστον δύο ορθές». Τότε το άθροισμα των γωνιών θα ξεπερνούσε τις $180^\circ$ (αφού η τρίτη γωνία είναι θετική): άτοπο.` },
    { level: 2, type: "fields", q: R`Αποδεικνύεται ότι αν ο $\alpha^2 - 2\alpha + 7$ ($\alpha \in \mathbb{Z}$) είναι περιττός, τότε ο $\alpha$ είναι άρτιος. Να υπολογίσετε την παράσταση για $\alpha = 4$ και για $\alpha = 3$.`,
      fields: [{ label: "α = 4:", ans: 15 }, { label: "α = 3:", ans: 10 }],
      hint: R`Αντικατάσταση.`,
      sol: R`$16 - 8 + 7 = 15$ (περιττός, και ο $4$ άρτιος ✓). $9 - 6 + 7 = 10$ (άρτιος, ο $3$ περιττός). Πράγματι, αν $\alpha$ περιττός, ο $\alpha^2 - 2\alpha$ είναι περιττός, άρα $+7$ δίνει άρτιο.` },
    { level: 2, type: "mc", q: R`Για $x \ge 1$, ποια αλυσίδα συνεπαγωγών αποδεικνύει ευθέως ότι $\sqrt x \le x$;`,
      options: ["$x \\ge 1 \\Rightarrow x\\cdot x \\ge 1\\cdot x \\Rightarrow x^2 \\ge x \\Rightarrow x \\ge \\sqrt x$", "$\\sqrt x \\le x \\Rightarrow x \\le x^2 \\Rightarrow x \\ge 1$", "$x = 4 \\Rightarrow \\sqrt 4 = 2 \\le 4$", "$x \\ge 1 \\Rightarrow \\sqrt x \\ge 1$"], correct: 0,
      hint: R`Ξεκινάμε από την υπόθεση, όχι από το συμπέρασμα.`,
      sol: R`Ευθεία απόδειξη: από $x \ge 1 > 0$ πολλαπλασιάζουμε με $x$: $x^2 \ge x$, και παίρνοντας ρίζες (θετικοί) $x \ge \sqrt x$. Η επιλογή που ξεκινά από το $\sqrt x \le x$ ξεκινά από το ζητούμενο, και το $x = 4$ είναι απλώς ένα παράδειγμα.` }
  ]
},
/* ───────────────────────────── 1.2.4 ───────────────────────────── */
{
  id: "1.2.4", unit: 1, title: "Μέθοδος της Μαθηματικής Επαγωγής",
  book: "Α΄ Τεύχος §1.2.4 · Δραστηριότητες σελ. 24",
  theory: R`
<div class="tbox"><h4>Αρχή της Μαθηματικής Επαγωγής</h4>
<p>Αν για μια πρόταση $p(\nu)$, $\nu \in \mathbb{N}$:</p>
<ol><li><b>Βήμα 1:</b> η $p(1)$ είναι αληθής, και</li>
<li><b>Βήμα 2:</b> αν η $p(\kappa)$ είναι αληθής, τότε και η $p(\kappa + 1)$ είναι αληθής, για κάθε $\kappa \in \mathbb{N}$,</li></ol>
<p>τότε η $p(\nu)$ είναι αληθής για <b>κάθε</b> $\nu \in \mathbb{N}$ (όπως ντόμινο που πέφτουν διαδοχικά).</p>
<p>Αν θέλουμε να αποδείξουμε κάτι για $\nu \ge \nu_0$, το βήμα 1 γίνεται για $\nu = \nu_0$.</p></div>

<div class="tbox tip"><h4>Χρήσιμοι τύποι (αποδεικνύονται με επαγωγή)</h4>
$$1 + 2 + \dots + \nu = \frac{\nu(\nu + 1)}{2} \qquad 1 + 3 + \dots + (2\nu - 1) = \nu^2 \qquad 1^2 + 2^2 + \dots + \nu^2 = \frac{\nu(\nu + 1)(2\nu + 1)}{6}$$
<p>Στο βήμα 2 γράφουμε το άθροισμα μέχρι $\kappa + 1$ ως «άθροισμα μέχρι $\kappa$» + «επόμενος όρος» και χρησιμοποιούμε την υπόθεση $p(\kappa)$.</p></div>`,
  exercises: [
    { level: 1, type: "fields", q: R`Με τον τύπο $1 + 3 + 5 + \dots + (2\nu - 1) = \nu^2$, να υπολογίσετε: (α) το άθροισμα των $10$ πρώτων περιττών, (β) το $1 + 3 + \dots + 39$.`,
      fields: [{ label: "(α) =", ans: 100 }, { label: "(β) =", ans: 400 }],
      hint: R`(β) $2\nu - 1 = 39 \Rightarrow \nu = 20$.`,
      sol: R`(α) $10^2 = 100$. (β) $\nu = 20$: $400$.` },
    { level: 1, type: "mc", q: R`Στο δεύτερο βήμα της μαθηματικής επαγωγής:`,
      options: ["υποθέτουμε ότι η $p(\\kappa)$ είναι αληθής και αποδεικνύουμε την $p(\\kappa + 1)$", "αποδεικνύουμε την $p(1)$", "ελέγχουμε την πρόταση για μερικές τιμές του $\\nu$", "υποθέτουμε ότι η $p(\\kappa + 1)$ είναι ψευδής"], correct: 0,
      hint: R`Το «ντόμινο» που ρίχνει το επόμενο.`,
      sol: R`Βήμα 2: $p(\kappa)$ αληθής $\Rightarrow$ $p(\kappa + 1)$ αληθής, για κάθε $\kappa$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το άθροισμα $1 + 2 + 3 + \dots + 100$.`,
      fields: [{ label: "=", ans: 5050 }],
      hint: R`$\frac{\nu(\nu + 1)}{2}$.`,
      sol: R`$\frac{100\cdot 101}{2} = 5050$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $1^2 + 2^2 + \dots + 10^2$ με τον τύπο $\frac{\nu(\nu + 1)(2\nu + 1)}{6}$.`,
      fields: [{ label: "=", ans: 385 }],
      hint: R`$\nu = 10$.`,
      sol: R`$\frac{10\cdot 11\cdot 21}{6} = 385$.` },
    { level: 2, type: "fields", q: R`Θέλουμε να αποδείξουμε με επαγωγή ότι $2^\nu > 2\nu + 1$. Ποιο είναι το μικρότερο φυσικό $\nu$ για το οποίο ισχύει (από αυτό ξεκινά το βήμα 1);`,
      fields: [{ label: "ν₀ =", ans: 3 }],
      hint: R`Έλεγξε $\nu = 1, 2, 3$.`,
      sol: R`$\nu = 1$: $2 > 3$ ψ. $\nu = 2$: $4 > 5$ ψ. $\nu = 3$: $8 > 7$ α. Άρα αποδεικνύουμε για $\nu \ge 3$.` },
    { level: 2, type: "fields", q: R`Ισχύει $1\cdot 2 + 2\cdot 3 + \dots + \nu(\nu + 1) = \frac{\nu(\nu + 1)(\nu + 2)}{3}$. Να επαληθεύσετε για $\nu = 5$: υπολογίστε το άθροισμα και την τιμή του τύπου.`,
      fields: [{ label: "άθροισμα =", ans: 70 }, { label: "τύπος =", ans: 70 }],
      hint: R`$2 + 6 + 12 + 20 + 30$.`,
      sol: R`$2 + 6 + 12 + 20 + 30 = 70$ και $\frac{5\cdot 6\cdot 7}{3} = 70$ ✓. (Η επαλήθευση δεν είναι απόδειξη — χρειάζεται η επαγωγή.)` },
    { level: 2, type: "mc", q: R`Στην απόδειξη του $1 + 2 + \dots + \nu = \frac{\nu(\nu + 1)}{2}$, στο βήμα 2 γράφουμε $1 + 2 + \dots + \kappa + (\kappa + 1) = \ ?$`,
      options: ["$\\frac{\\kappa(\\kappa + 1)}{2} + (\\kappa + 1) = \\frac{(\\kappa + 1)(\\kappa + 2)}{2}$", "$\\frac{(\\kappa + 1)(\\kappa + 2)}{2} + \\kappa$", "$\\frac{\\kappa(\\kappa + 1)}{2}\\cdot(\\kappa + 1)$", "$\\kappa + 1$"], correct: 0,
      hint: R`Χρησιμοποιούμε την υπόθεση $p(\kappa)$ για το άθροισμα μέχρι $\kappa$.`,
      sol: R`$\frac{\kappa(\kappa + 1)}{2} + (\kappa + 1) = \frac{(\kappa + 1)(\kappa + 2)}{2}$, που είναι η $p(\kappa + 1)$.` },
    { level: 2, type: "fields", q: R`Αποδεικνύεται με επαγωγή ότι ο $7^\nu - 1$ διαιρείται με το $6$. Για $\nu = 3$: $7^3 - 1 = 6\cdot\ ?$`,
      fields: [{ label: "πηλίκο =", ans: 57 }],
      hint: R`$7^3 = 343$.`,
      sol: R`$342 = 6\cdot 57$.` }
  ]
},
/* ───────────────────────────── 2.2 (ΚΚ) ───────────────────────────── */
{
  id: "2.2.1", unit: 2, title: "Νόμος ημιτόνων",
  book: "Α΄ Τεύχος §2.2.1",
  theory: R`
<div class="tbox"><h4>Συμβολισμοί</h4>
<p>Σε τρίγωνο $AB\Gamma$ γράφουμε $\alpha = B\Gamma$, $\beta = A\Gamma$, $\gamma = AB$ (κάθε πλευρά απέναντι από την ομώνυμη γωνία) και $R$ την ακτίνα του περιγεγραμμένου κύκλου. Πάντα $\hat A + \hat B + \hat\Gamma = 180^\circ$.</p></div>

<div class="tbox"><h4>Νόμος ημιτόνων</h4>
$$\frac{\alpha}{\text{ημ}A} = \frac{\beta}{\text{ημ}B} = \frac{\gamma}{\text{ημ}\Gamma} = 2R$$
<p>Ισοδύναμα: $\alpha = 2R\,\text{ημ}A$, $\ \beta = 2R\,\text{ημ}B$, $\ \gamma = 2R\,\text{ημ}\Gamma$.</p></div>

<div class="tbox tip"><h4>Πότε τον χρησιμοποιούμε</h4>
<ul><li>Ξέρουμε <b>δύο γωνίες και μία πλευρά</b>: βρίσκουμε την τρίτη γωνία ($180^\circ$ − …) και μετά τις πλευρές.</li>
<li>Ξέρουμε <b>δύο πλευρές και τη γωνία απέναντι από μία τους</b>: βρίσκουμε το ημίτονο άλλης γωνίας. Προσοχή: η εξίσωση $\text{ημ}x = \kappa$ ($0 < \kappa < 1$) δίνει <b>δύο</b> γωνίες, $x$ και $180^\circ - x$ — κρατάμε όσες δίνουν άθροισμα γωνιών μικρότερο από $180^\circ$.</li>
<li>Συνδέουμε πλευρές με την ακτίνα $R$.</li></ul>
<p><b>Επίλυση τριγώνου</b> σημαίνει να βρούμε όλες τις πλευρές και όλες τις γωνίες του.</p></div>`,
  widget: "trisin",
  gen: "gsines",
  exercises: [
    { level: 1, type: "fields", q: R`Σε τρίγωνο $AB\Gamma$ είναι $\hat B = 150^\circ$ και $R = 2$ cm. Να υπολογίσετε την πλευρά $\beta$.`,
      fields: [{ label: "β (cm) =", ans: 2 }],
      hint: R`$\beta = 2R\,\text{ημ}B$ και $\text{ημ}150^\circ = \text{ημ}30^\circ$.`,
      sol: R`$\beta = 2\cdot 2\cdot\text{ημ}150^\circ = 4\cdot\frac12 = 2$ cm.` },
    { level: 1, type: "fields", q: R`Σε τρίγωνο $AB\Gamma$ είναι $\gamma = 7$ cm και $R = 21$ cm. Να υπολογίσετε το $\text{ημ}\Gamma$.`,
      fields: [{ label: "ημΓ =", ans: "1/6" }],
      hint: R`$\frac{\gamma}{\text{ημ}\Gamma} = 2R$.`,
      sol: R`$\text{ημ}\Gamma = \frac{\gamma}{2R} = \frac{7}{42} = \frac16$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε τα μήκη των πλευρών τριγώνου $AB\Gamma$ με $\hat A = 30^\circ$, $\hat B = 45^\circ$ και $R = 3$ cm.`,
      fields: [{ label: "α =", ans: 3 }, { label: "β =", ans: "3√2", tol: 0.002 }, { label: "γ =", ans: "3(√6+√2)/2", tol: 0.002 }],
      hint: R`$\hat\Gamma = 105^\circ$ και $\text{ημ}105^\circ = \text{ημ}(60^\circ + 45^\circ) = \frac{\sqrt6 + \sqrt2}{4}$ (ή υπολογιστική: $\approx 0{,}966$).`,
      sol: R`$\alpha = 2R\,\text{ημ}30^\circ = 3$, $\ \beta = 6\,\text{ημ}45^\circ = 3\sqrt2$, $\ \gamma = 6\,\text{ημ}105^\circ = \frac{3(\sqrt6 + \sqrt2)}{2} \approx 5{,}80$ cm.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το μήκος της πλευράς $\alpha$ τριγώνου $AB\Gamma$ με $\hat A = 60^\circ$, $\hat B = 40^\circ$ και $\beta = 4$ cm (2 δεκαδικά).`,
      fields: [{ label: "α (cm) =", ans: 5.39, tol: 0.001 }],
      hint: R`$\frac{\alpha}{\text{ημ}60^\circ} = \frac{4}{\text{ημ}40^\circ}$.`,
      sol: R`$\alpha = \frac{4\,\text{ημ}60^\circ}{\text{ημ}40^\circ} \approx \frac{4\cdot 0{,}866}{0{,}643} \approx 5{,}39$ cm.` },
    { level: 2, type: "mc", q: R`Σε τρίγωνο $AB\Gamma$ είναι $\alpha = 1$, $\gamma = \sqrt3$ και $\hat\Gamma = 60^\circ$. Η γωνία $\hat A$ είναι:`,
      options: ["$30^\\circ$", "$150^\\circ$", "$30^\\circ$ ή $150^\\circ$", "$60^\\circ$"], correct: 0,
      hint: R`Βρες το $\text{ημ}A$ και έλεγξε και τις δύο γωνίες με αυτό το ημίτονο.`,
      sol: R`$\text{ημ}A = \frac{\alpha\,\text{ημ}\Gamma}{\gamma} = \frac{1\cdot\frac{\sqrt3}{2}}{\sqrt3} = \frac12$, άρα $\hat A = 30^\circ$ ή $150^\circ$. Η $150^\circ$ απορρίπτεται γιατί $150^\circ + 60^\circ > 180^\circ$. Άρα $\hat A = 30^\circ$ (και τότε $\hat B = 90^\circ$, $\beta = 2$).` },
    { level: 3, type: "fields", q: R`Να επιλύσετε το τρίγωνο $AB\Gamma$ με $\alpha = 4$ cm, $\beta = 2\sqrt2$ cm και $\hat B = 30^\circ$. (Υπάρχουν <b>δύο</b> τρίγωνα· γράψτε τη γωνία $\hat A$ και την πλευρά $\gamma$ για καθένα.)`,
      fields: [{ label: "1ο: Â (οξεία) =", ans: 45 }, { label: "1ο: γ =", ans: "2+2√3", tol: 0.005 }, { label: "2ο: Â (αμβλεία) =", ans: 135 }, { label: "2ο: γ =", ans: "2√3-2", tol: 0.005 }],
      hint: R`$\text{ημ}A = \frac{\alpha\,\text{ημ}B}{\beta} = \frac{\sqrt2}{2}$. Και οι δύο γωνίες $45^\circ$, $135^\circ$ δίνουν άθροισμα με την $\hat B$ μικρότερο από $180^\circ$.`,
      sol: R`$\text{ημ}A = \frac{4\cdot\frac12}{2\sqrt2} = \frac{\sqrt2}{2}$, άρα $\hat A = 45^\circ$ ή $135^\circ$.<br>
• $\hat A = 45^\circ$: $\hat\Gamma = 105^\circ$, $\gamma = \frac{\beta\,\text{ημ}\Gamma}{\text{ημ}B} = 4\sqrt2\cdot\frac{\sqrt6 + \sqrt2}{4} = 2\sqrt3 + 2 \approx 5{,}46$.<br>
• $\hat A = 135^\circ$: $\hat\Gamma = 15^\circ$, $\gamma = 4\sqrt2\,\text{ημ}15^\circ = 4\sqrt2\cdot\frac{\sqrt6 - \sqrt2}{4} = 2\sqrt3 - 2 \approx 1{,}46$.` },
    { level: 2, type: "fields", q: R`Δύο πλοία βρίσκονται στις θέσεις $A$ και $B$ σε απόσταση $500$ m, ενώ στη θέση $\Sigma$ βρίσκεται ένα λιμάνι. Οι γωνίες $\Sigma AB$ και $\Sigma BA$ είναι $75^\circ$ και $64^\circ$. Να υπολογίσετε την απόσταση $A\Sigma$ (στο πλησιέστερο μέτρο).`,
      fields: [{ label: "ΑΣ (m) =", ans: 685, tol: 0.0007 }],
      hint: R`$\hat\Sigma = 180^\circ - 75^\circ - 64^\circ$. Η $A\Sigma$ είναι απέναντι από τη γωνία $B$.`,
      sol: R`$\hat\Sigma = 41^\circ$. $\frac{A\Sigma}{\text{ημ}64^\circ} = \frac{500}{\text{ημ}41^\circ} \Rightarrow A\Sigma = \frac{500\,\text{ημ}64^\circ}{\text{ημ}41^\circ} \approx 685$ m.` },
    { level: 1, type: "fields", q: R`Σε τρίγωνο $AB\Gamma$ είναι $\hat A = 30^\circ$ και $\alpha = 3$ cm. Να βρείτε την ακτίνα $R$ του περιγεγραμμένου κύκλου.`,
      fields: [{ label: "R (cm) =", ans: 3 }],
      hint: R`$2R = \frac{\alpha}{\text{ημ}A}$.`,
      sol: R`$2R = \frac{3}{\text{ημ}30^\circ} = 6 \Rightarrow R = 3$ cm.` },
    { level: 2, type: "mc", q: R`Σε τρίγωνο $AB\Gamma$ είναι $\beta = 10$ cm και $R = 5$ cm. Τότε η γωνία $\hat B$ είναι:`,
      options: ["$30^\\circ$", "$60^\\circ$", "$90^\\circ$", "$150^\\circ$"], correct: 2,
      hint: R`$\text{ημ}B = \frac{\beta}{2R}$.`,
      sol: R`$\text{ημ}B = \frac{10}{10} = 1 \Rightarrow \hat B = 90^\circ$ — η $\beta$ είναι διάμετρος του περιγεγραμμένου κύκλου.` }
  ]
},
/* ───────────────────────────── 2.2.2 ───────────────────────────── */
{
  id: "2.2.2", unit: 2, title: "Νόμος συνημιτόνων",
  book: "Α΄ Τεύχος §2.2.2",
  theory: R`
<div class="tbox"><h4>Νόμος συνημιτόνων</h4>
$$\alpha^2 = \beta^2 + \gamma^2 - 2\beta\gamma\,\text{συν}A$$
$$\beta^2 = \alpha^2 + \gamma^2 - 2\alpha\gamma\,\text{συν}B \qquad \gamma^2 = \alpha^2 + \beta^2 - 2\alpha\beta\,\text{συν}\Gamma$$
<p>Λυμένος ως προς το συνημίτονο: $\ \text{συν}A = \dfrac{\beta^2 + \gamma^2 - \alpha^2}{2\beta\gamma}$.</p>
<p>Για $\hat A = 90^\circ$ ($\text{συν}A = 0$) παίρνουμε το Πυθαγόρειο θεώρημα — ο νόμος συνημιτόνων είναι γενίκευσή του.</p></div>

<div class="tbox tip"><h4>Πότε τον χρησιμοποιούμε</h4>
<ul><li>Ξέρουμε <b>δύο πλευρές και την περιεχόμενη γωνία</b> → βρίσκουμε την τρίτη πλευρά.</li>
<li>Ξέρουμε <b>τρεις πλευρές</b> → βρίσκουμε τις γωνίες (πρώτα τη μεγαλύτερη).</li></ul>
<p><b>Είδος γωνίας:</b> αν $\alpha$ η μεγαλύτερη πλευρά: $\alpha^2 < \beta^2 + \gamma^2$ ⇒ οξυγώνιο, $\alpha^2 = \beta^2 + \gamma^2$ ⇒ ορθογώνιο, $\alpha^2 > \beta^2 + \gamma^2$ ⇒ αμβλυγώνιο.</p>
<p>Το συνημίτονο ξεχωρίζει οξεία ($\text{συν} > 0$) από αμβλεία ($\text{συν} < 0$) γωνία — δεν έχει «δεύτερη λύση» όπως το ημίτονο.</p></div>`,
  widget: "tricos",
  gen: "gcosines",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε την πλευρά $\alpha$ του τριγώνου $AB\Gamma$ με $\beta = 3$ cm, $\gamma = 6$ cm και $\hat A = 120^\circ$.`,
      fields: [{ label: "α (cm) =", ans: "3√7", tol: 0.002 }],
      hint: R`$\text{συν}120^\circ = -\frac12$.`,
      sol: R`$\alpha^2 = 9 + 36 - 2\cdot 3\cdot 6\cdot\left(-\frac12\right) = 63 \Rightarrow \alpha = \sqrt{63} = 3\sqrt7 \approx 7{,}94$ cm.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το $\text{συν}\Gamma$ του τριγώνου $AB\Gamma$ με $\alpha = 2$ cm, $\beta = 4$ cm και $\gamma = 5$ cm.`,
      fields: [{ label: "συνΓ =", ans: "-5/16" }],
      hint: R`$\text{συν}\Gamma = \frac{\alpha^2 + \beta^2 - \gamma^2}{2\alpha\beta}$.`,
      sol: R`$\text{συν}\Gamma = \frac{4 + 16 - 25}{16} = -\frac{5}{16}$. Αρνητικό, άρα η $\hat\Gamma$ είναι αμβλεία ($\approx 108{,}2^\circ$).` },
    { level: 2, type: "fields", q: R`Να επιλύσετε το τρίγωνο $AB\Gamma$ με $\alpha = 4$, $\beta = 4\sqrt3$ και $\gamma = 4$.`,
      fields: [{ label: "Â (°) =", ans: 30 }, { label: "B̂ (°) =", ans: 120 }, { label: "Γ̂ (°) =", ans: 30 }],
      hint: R`Ισοσκελές ($\alpha = \gamma$), άρα $\hat A = \hat\Gamma$. Βρες το $\text{συν}A$.`,
      sol: R`$\text{συν}A = \frac{48 + 16 - 16}{2\cdot 4\sqrt3\cdot 4} = \frac{48}{32\sqrt3} = \frac{\sqrt3}{2} \Rightarrow \hat A = 30^\circ = \hat\Gamma$, $\hat B = 120^\circ$.` },
    { level: 2, type: "fields", q: R`Να επιλύσετε το τρίγωνο $AB\Gamma$ με $\beta = 5$ cm, $\gamma = 5\sqrt3$ cm και $\hat A = 30^\circ$.`,
      fields: [{ label: "α (cm) =", ans: 5 }, { label: "B̂ (°) =", ans: 30 }, { label: "Γ̂ (°) =", ans: 120 }],
      hint: R`Πρώτα $\alpha^2 = \beta^2 + \gamma^2 - 2\beta\gamma\,\text{συν}A$.`,
      sol: R`$\alpha^2 = 25 + 75 - 2\cdot 5\cdot 5\sqrt3\cdot\frac{\sqrt3}{2} = 100 - 75 = 25 \Rightarrow \alpha = 5$. Αφού $\alpha = \beta$, $\hat B = \hat A = 30^\circ$ και $\hat\Gamma = 120^\circ$.` },
    { level: 1, type: "mc", q: R`Τρίγωνο έχει πλευρές $5$, $6$ και $8$. Το τρίγωνο είναι:`,
      options: ["οξυγώνιο", "ορθογώνιο", "αμβλυγώνιο", "δεν υπάρχει τέτοιο τρίγωνο"], correct: 2,
      hint: R`Σύγκρινε το τετράγωνο της μεγαλύτερης πλευράς με το άθροισμα των τετραγώνων των άλλων.`,
      sol: R`$8^2 = 64 > 5^2 + 6^2 = 61$, άρα η γωνία απέναντι από την πλευρά $8$ έχει αρνητικό συνημίτονο: αμβλυγώνιο.` },
    { level: 2, type: "fields", q: R`Σε τρίγωνο $AB\Gamma$ ισχύει $\beta^2 + \gamma^2 - \alpha^2 = \beta\gamma$. Να βρείτε τη γωνία $\hat A$.`,
      fields: [{ label: "Â (°) =", ans: 60 }],
      hint: R`Σύγκρινε με $\beta^2 + \gamma^2 - \alpha^2 = 2\beta\gamma\,\text{συν}A$.`,
      sol: R`$2\beta\gamma\,\text{συν}A = \beta\gamma \Rightarrow \text{συν}A = \frac12 \Rightarrow \hat A = 60^\circ$.` },
    { level: 2, type: "fields", q: R`Τρίγωνο έχει πλευρές $7$, $8$ και $13$. Να βρείτε τη μεγαλύτερη γωνία του.`,
      fields: [{ label: "γωνία (°) =", ans: 120 }],
      hint: R`Η μεγαλύτερη γωνία είναι απέναντι από τη μεγαλύτερη πλευρά.`,
      sol: R`$\text{συν}\theta = \frac{49 + 64 - 169}{2\cdot 7\cdot 8} = \frac{-56}{112} = -\frac12 \Rightarrow \theta = 120^\circ$.` },
    { level: 2, type: "fields", q: R`Δύο βάρκες ξεκινούν από το ίδιο λιμάνι σε ευθείες πορείες που σχηματίζουν γωνία $60^\circ$. Μετά από κάποιο χρόνο η μία απέχει $8$ km και η άλλη $5$ km από το λιμάνι. Πόσο απέχουν μεταξύ τους;`,
      fields: [{ label: "απόσταση (km) =", ans: 7 }],
      hint: R`Τρίγωνο με δύο πλευρές $8$, $5$ και περιεχόμενη γωνία $60^\circ$.`,
      sol: R`$d^2 = 64 + 25 - 2\cdot 8\cdot 5\cdot\frac12 = 49 \Rightarrow d = 7$ km.` },
    { level: 3, type: "fields", q: R`Παραλληλόγραμμο έχει πλευρές $4$ cm και $6$ cm και μία γωνία του $60^\circ$. Να βρείτε τα μήκη των διαγωνίων του.`,
      fields: [{ label: "μικρή διαγώνιος =", ans: "2√7", tol: 0.002 }, { label: "μεγάλη διαγώνιος =", ans: "2√19", tol: 0.002 }],
      hint: R`Η μία διαγώνιος βρίσκεται απέναντι από τη γωνία $60^\circ$, η άλλη απέναντι από την $120^\circ$.`,
      sol: R`$d_1^2 = 16 + 36 - 2\cdot 4\cdot 6\cdot\frac12 = 28 \Rightarrow d_1 = 2\sqrt7$. $\ d_2^2 = 16 + 36 + 24 = 76 \Rightarrow d_2 = 2\sqrt{19}$.` }
  ]
},
/* ───────────────────────────── 2.2.3 ───────────────────────────── */
{
  id: "2.2.3", unit: 2, title: "Εμβαδόν τριγώνου",
  book: "Α΄ Τεύχος §2.2.3",
  theory: R`
<div class="tbox"><h4>Εμβαδόν με δύο πλευρές και την περιεχόμενη γωνία</h4>
$$E = \frac12\beta\gamma\,\text{ημ}A = \frac12\alpha\gamma\,\text{ημ}B = \frac12\alpha\beta\,\text{ημ}\Gamma$$
<p>Προκύπτει από το $E = \frac12\cdot\text{βάση}\cdot\text{ύψος}$, αφού το ύψος από την κορυφή $\Gamma$ είναι $\beta\,\text{ημ}A$.</p></div>

<div class="tbox"><h4>Άλλοι τύποι (με τον νόμο ημιτόνων)</h4>
$$E = \frac{\alpha\beta\gamma}{4R} \qquad E = 2R^2\,\text{ημ}A\,\text{ημ}B\,\text{ημ}\Gamma$$
<p>Ισόπλευρο τρίγωνο πλευράς $\alpha$: $E = \dfrac{\alpha^2\sqrt3}{4}$.</p></div>

<div class="tbox tip"><h4>Προσοχή</h4>
<p>Αν ξέρουμε το εμβαδόν και ζητάμε γωνία, βρίσκουμε το ημίτονό της — άρα πιθανόν <b>δύο</b> γωνίες ($\theta$ και $180^\circ - \theta$) και δύο διαφορετικά τρίγωνα.</p></div>`,
  widget: "triarea",
  gen: "garea",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε το εμβαδόν τριγώνου $AB\Gamma$ με $\alpha = 4$ cm, $\gamma = 3$ cm και $\hat B = 30^\circ$.`,
      fields: [{ label: "Ε (cm²) =", ans: 3 }],
      hint: R`$E = \frac12\alpha\gamma\,\text{ημ}B$.`,
      sol: R`$E = \frac12\cdot 4\cdot 3\cdot\frac12 = 3$ cm².` },
    { level: 1, type: "fields", q: R`Τρίγωνο $AB\Gamma$ έχει $E = 3\sqrt2$ cm², $\gamma = 3$ cm και $\hat A = 45^\circ$. Να βρείτε την πλευρά $\beta$.`,
      fields: [{ label: "β (cm) =", ans: 4 }],
      hint: R`$E = \frac12\beta\gamma\,\text{ημ}A$.`,
      sol: R`$3\sqrt2 = \frac12\cdot\beta\cdot 3\cdot\frac{\sqrt2}{2} = \frac{3\sqrt2}{4}\beta \Rightarrow \beta = 4$ cm.` },
    { level: 1, type: "fields", q: R`Τρίγωνο $AB\Gamma$ έχει $E = 5$ cm², $\alpha = 4$ cm και $\beta = 10$ cm. Να υπολογίσετε το $\text{ημ}\Gamma$.`,
      fields: [{ label: "ημΓ =", ans: "1/4" }],
      hint: R`$E = \frac12\alpha\beta\,\text{ημ}\Gamma$.`,
      sol: R`$5 = \frac12\cdot 4\cdot 10\cdot\text{ημ}\Gamma = 20\,\text{ημ}\Gamma \Rightarrow \text{ημ}\Gamma = \frac14$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το εμβαδόν του τριγώνου $AB\Gamma$ με $\alpha = 3$ cm, $\hat B = 30^\circ$ και $\hat\Gamma = 120^\circ$.`,
      fields: [{ label: "Ε (cm²) =", ans: "9√3/4", tol: 0.002 }],
      hint: R`$\hat A = 30^\circ = \hat B$, άρα το τρίγωνο είναι ισοσκελές με $\beta = \alpha$.`,
      sol: R`$\hat A = 180^\circ - 30^\circ - 120^\circ = 30^\circ$, οπότε $\beta = \alpha = 3$. $E = \frac12\alpha\beta\,\text{ημ}\Gamma = \frac12\cdot 9\cdot\frac{\sqrt3}{2} = \frac{9\sqrt3}{4} \approx 3{,}90$ cm².` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το εμβαδόν ισόπλευρου τριγώνου πλευράς $6$ cm.`,
      fields: [{ label: "Ε (cm²) =", ans: "9√3", tol: 0.002 }],
      hint: R`Όλες οι γωνίες $60^\circ$: $E = \frac12\alpha^2\text{ημ}60^\circ$.`,
      sol: R`$E = \frac12\cdot 36\cdot\frac{\sqrt3}{2} = 9\sqrt3 \approx 15{,}59$ cm².` },
    { level: 3, type: "fields", q: R`Σε τρίγωνο $AB\Gamma$ δίνονται $E = 2\sqrt3$ cm², $\alpha = 2$ cm και $\beta = 4$ cm. Να βρείτε τη γωνία $\hat\Gamma$ και την πλευρά $\gamma$ για <b>καθεμιά</b> από τις δύο λύσεις.`,
      fields: [{ label: "οξεία Γ̂ =", ans: 60 }, { label: "γ =", ans: "2√3", tol: 0.002 }, { label: "αμβλεία Γ̂ =", ans: 120 }, { label: "γ =", ans: "2√7", tol: 0.002 }],
      hint: R`$\text{ημ}\Gamma = \frac{2E}{\alpha\beta}$. Μετά νόμος συνημιτόνων για το $\gamma$.`,
      sol: R`$\text{ημ}\Gamma = \frac{4\sqrt3}{8} = \frac{\sqrt3}{2}$, άρα $\hat\Gamma = 60^\circ$ ή $120^\circ$.<br>• $60^\circ$: $\gamma^2 = 4 + 16 - 16\cdot\frac12 = 12 \Rightarrow \gamma = 2\sqrt3$.<br>• $120^\circ$: $\gamma^2 = 4 + 16 + 8 = 28 \Rightarrow \gamma = 2\sqrt7$.` },
    { level: 2, type: "fields", q: R`Τρίγωνο έχει πλευρές $\alpha = 6$, $\beta = 8$ και $\gamma = 10$. Να βρείτε το εμβαδόν του και την ακτίνα $R$ του περιγεγραμμένου κύκλου.`,
      fields: [{ label: "Ε =", ans: 24 }, { label: "R =", ans: 5 }],
      hint: R`Υπολόγισε το $\text{συν}\Gamma$. Μετά $E = \frac{\alpha\beta\gamma}{4R}$.`,
      sol: R`$\text{συν}\Gamma = \frac{36 + 64 - 100}{96} = 0 \Rightarrow \hat\Gamma = 90^\circ$, $E = \frac12\cdot 6\cdot 8 = 24$. $R = \frac{\alpha\beta\gamma}{4E} = \frac{480}{96} = 5$ (η υποτείνουσα είναι διάμετρος).` },
    { level: 3, type: "fields", q: R`Ένα οικόπεδο έχει σχήμα τριγώνου με πλευρές $13$ m, $14$ m και $15$ m. Να υπολογίσετε το $\text{συν}$ της γωνίας που σχηματίζουν οι πλευρές $13$ και $14$ και το εμβαδόν του οικοπέδου.`,
      fields: [{ label: "συνθ =", ans: "5/13" }, { label: "Ε (m²) =", ans: 84 }],
      hint: R`Η γωνία αυτή είναι απέναντι από την πλευρά $15$. Από το $\text{συν}\theta$ βρες το $\text{ημ}\theta = \sqrt{1 - \text{συν}^2\theta}$.`,
      sol: R`$\text{συν}\theta = \frac{169 + 196 - 225}{2\cdot 13\cdot 14} = \frac{140}{364} = \frac{5}{13}$, $\ \text{ημ}\theta = \frac{12}{13}$. $E = \frac12\cdot 13\cdot 14\cdot\frac{12}{13} = 84$ m².` }
  ]
},
/* ───────────────────────────── 2.3.1 ───────────────────────────── */
{
  id: "2.3.1", unit: 2, title: "Ημίτονο και συνημίτονο αθροίσματος – διαφοράς",
  book: "Α΄ Τεύχος §2.3.1 · Δραστηριότητες σελ. 50",
  theory: R`
<div class="tbox"><h4>Τύποι</h4>
$$\text{συν}(\alpha - \beta) = \text{συν}\alpha\,\text{συν}\beta + \text{ημ}\alpha\,\text{ημ}\beta \qquad \text{συν}(\alpha + \beta) = \text{συν}\alpha\,\text{συν}\beta - \text{ημ}\alpha\,\text{ημ}\beta$$
$$\text{ημ}(\alpha + \beta) = \text{ημ}\alpha\,\text{συν}\beta + \text{συν}\alpha\,\text{ημ}\beta \qquad \text{ημ}(\alpha - \beta) = \text{ημ}\alpha\,\text{συν}\beta - \text{συν}\alpha\,\text{ημ}\beta$$
<p>Προσοχή: $\text{ημ}(\alpha + \beta) \ne \text{ημ}\alpha + \text{ημ}\beta$!</p></div>

<div class="tbox tip"><h4>Εφαρμογές</h4>
<ul><li>Ακριβείς τιμές: $\text{ημ}75^\circ = \text{ημ}(45^\circ + 30^\circ) = \frac{\sqrt6 + \sqrt2}{4}$, $\ \text{συν}15^\circ = \frac{\sqrt6 + \sqrt2}{4}$.</li>
<li>«Αντίστροφη» χρήση: $\text{ημ}107^\circ\text{συν}17^\circ - \text{συν}107^\circ\text{ημ}17^\circ = \text{ημ}90^\circ = 1$.</li>
<li>Αν δίνονται $\text{ημ}\alpha$ και το τεταρτημόριο, βρίσκουμε το $\text{συν}\alpha$ από $\text{ημ}^2\alpha + \text{συν}^2\alpha = 1$ με το σωστό πρόσημο.</li></ul></div>`,
  widget: "trigsum",
  gen: "gsumtrig",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε χωρίς υπολογιστική μηχανή: (α) $A = \text{ημ}107^\circ\text{συν}17^\circ - \text{συν}107^\circ\text{ημ}17^\circ$, (β) $B = \text{συν}24^\circ\text{συν}66^\circ - \text{ημ}66^\circ\text{ημ}24^\circ$.`,
      fields: [{ label: "A =", ans: 1 }, { label: "B =", ans: 0 }],
      hint: R`Αναγνώρισε τους τύπους $\text{ημ}(\alpha - \beta)$ και $\text{συν}(\alpha + \beta)$.`,
      sol: R`$A = \text{ημ}(107^\circ - 17^\circ) = \text{ημ}90^\circ = 1$, $\ B = \text{συν}(24^\circ + 66^\circ) = \text{συν}90^\circ = 0$.` },
    { level: 1, type: "mc", q: R`$\text{ημ}5x\,\text{συν}3x + \text{συν}5x\,\text{ημ}3x = $`,
      options: ["$\\text{ημ}8x$", "$\\text{συν}8x$", "$\\text{ημ}2x$", "$\\text{συν}2x$"], correct: 0,
      hint: R`$\text{ημ}(\alpha + \beta)$.`,
      sol: R`$\text{ημ}(5x + 3x) = \text{ημ}8x$.` },
    { level: 2, type: "mc", q: R`Σε τρίγωνο $AB\Gamma$ ισχύει $\text{συν}A\,\text{συν}B - \text{ημ}A\,\text{ημ}B = 0$. Τότε:`,
      options: ["$\\hat\\Gamma = \\frac\\pi2$", "$\\hat A = \\frac\\pi2$", "$\\hat B = \\frac\\pi2$", "$\\hat A = \\hat\\Gamma$"], correct: 0,
      hint: R`$\text{συν}(A + B) = 0$ και $A + B < \pi$.`,
      sol: R`$\text{συν}(A + B) = 0 \Rightarrow A + B = \frac\pi2 \Rightarrow \hat\Gamma = \pi - \frac\pi2 = \frac\pi2$.` },
    { level: 2, type: "fields", q: R`Αν $\text{συν}\alpha = \frac45$, $0 < \alpha < \frac\pi2$ και $\text{ημ}\beta = -\frac{5}{13}$, $\pi < \beta < \frac{3\pi}{2}$, να υπολογίσετε τα $\text{ημ}(\alpha + \beta)$ και $\text{συν}(\alpha + \beta)$.`,
      fields: [{ label: "ημ(α + β) =", ans: "-56/65" }, { label: "συν(α + β) =", ans: "-33/65" }],
      hint: R`$\text{ημ}\alpha = \frac35$, $\text{συν}\beta = -\frac{12}{13}$ (3ο τεταρτημόριο).`,
      sol: R`$\text{ημ}(\alpha + \beta) = \frac35\cdot\left(-\frac{12}{13}\right) + \frac45\cdot\left(-\frac{5}{13}\right) = -\frac{56}{65}$. $\ \text{συν}(\alpha + \beta) = \frac45\cdot\left(-\frac{12}{13}\right) - \frac35\cdot\left(-\frac{5}{13}\right) = -\frac{33}{65}$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε την ακριβή τιμή του $\text{συν}15^\circ$ (γράψτε π.χ. <code>(√6+√2)/4</code>).`,
      fields: [{ label: "συν15° =", ans: "(√6+√2)/4" }],
      hint: R`$15^\circ = 45^\circ - 30^\circ$.`,
      sol: R`$\text{συν}45^\circ\text{συν}30^\circ + \text{ημ}45^\circ\text{ημ}30^\circ = \frac{\sqrt2}{2}\cdot\frac{\sqrt3}{2} + \frac{\sqrt2}{2}\cdot\frac12 = \frac{\sqrt6 + \sqrt2}{4}$.` },
    { level: 2, type: "mc", q: R`$\text{ημ}\left(\frac\pi6 + \alpha\right)\text{συν}\left(\alpha - \frac\pi6\right) - \text{συν}\left(\frac\pi6 + \alpha\right)\text{ημ}\left(\alpha - \frac\pi6\right) = $`,
      options: ["$\\frac{\\sqrt3}{2}$", "$\\text{ημ}2\\alpha$", "$\\frac12$", "$\\text{συν}2\\alpha$"], correct: 0,
      hint: R`$\text{ημ}(x - y)$ με $x = \frac\pi6 + \alpha$, $y = \alpha - \frac\pi6$.`,
      sol: R`$\text{ημ}\left[\left(\frac\pi6 + \alpha\right) - \left(\alpha - \frac\pi6\right)\right] = \text{ημ}\frac\pi3 = \frac{\sqrt3}{2}$.` },
    { level: 2, type: "mc", q: R`Αν $T = \text{συν}\alpha\,\text{συν}\beta - \text{ημ}\alpha\,\text{ημ}\beta$ με $\frac\pi4 < \alpha, \beta < \frac\pi2$, τότε:`,
      options: ["$T < 0$", "$T > 0$", "$T = 0$", "$T = 1$"], correct: 0,
      hint: R`$T = \text{συν}(\alpha + \beta)$ και $\frac\pi2 < \alpha + \beta < \pi$.`,
      sol: R`$\alpha + \beta \in \left(\frac\pi2, \pi\right)$, όπου το συνημίτονο είναι αρνητικό: $T < 0$.` },
    { level: 3, type: "fields", q: R`Ισχύει $\text{ημ}(\alpha + \beta)\,\text{ημ}(\alpha - \beta) = \text{ημ}^2\alpha - \text{ημ}^2\beta$. Με αυτό, να υπολογίσετε το $\text{ημ}75^\circ\cdot\text{ημ}15^\circ$.`,
      fields: [{ label: "=", ans: "1/4" }],
      hint: R`$\alpha = 45^\circ$, $\beta = 30^\circ$.`,
      sol: R`$\text{ημ}(45^\circ + 30^\circ)\text{ημ}(45^\circ - 30^\circ) = \text{ημ}^2 45^\circ - \text{ημ}^2 30^\circ = \frac12 - \frac14 = \frac14$.` }
  ]
},
/* ───────────────────────────── 2.3.2 ───────────────────────────── */
{
  id: "2.3.2", unit: 2, title: "Εφαπτομένη και συνεφαπτομένη αθροίσματος – διαφοράς",
  book: "Α΄ Τεύχος §2.3.2 · Δραστηριότητες σελ. 55",
  theory: R`
<div class="tbox"><h4>Τύποι</h4>
$$\text{εφ}(\alpha + \beta) = \frac{\text{εφ}\alpha + \text{εφ}\beta}{1 - \text{εφ}\alpha\,\text{εφ}\beta} \qquad \text{εφ}(\alpha - \beta) = \frac{\text{εφ}\alpha - \text{εφ}\beta}{1 + \text{εφ}\alpha\,\text{εφ}\beta}$$
$$\text{σφ}(\alpha + \beta) = \frac{\text{σφ}\alpha\,\text{σφ}\beta - 1}{\text{σφ}\alpha + \text{σφ}\beta} \qquad \text{σφ}(\alpha - \beta) = \frac{\text{σφ}\alpha\,\text{σφ}\beta + 1}{\text{σφ}\beta - \text{σφ}\alpha}$$
<p>(όπου ορίζονται όλοι οι αριθμοί και οι παρονομαστές είναι μη μηδενικοί)</p></div>

<div class="tbox tip"><h4>Χρήσιμα</h4>
<p>$\text{εφ}75^\circ = 2 + \sqrt3$, $\ \text{εφ}15^\circ = 2 - \sqrt3$. Αν $\alpha + \beta = \frac\pi4$, τότε $(1 + \text{εφ}\alpha)(1 + \text{εφ}\beta) = 2$.</p></div>`,
  gen: "gtanspec",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε την τιμή της παράστασης $A = \dfrac{\text{εφ}165^\circ + \text{εφ}15^\circ}{1 - \text{εφ}165^\circ\,\text{εφ}15^\circ}$.`,
      fields: [{ label: "A =", ans: 0 }],
      hint: R`$\text{εφ}(165^\circ + 15^\circ)$.`,
      sol: R`$A = \text{εφ}180^\circ = 0$.` },
    { level: 2, type: "fields", q: R`Αν $\alpha - \beta = \frac\pi4$ και $\text{εφ}\beta = 2$, να βρείτε την $\text{εφ}\alpha$.`,
      fields: [{ label: "εφα =", ans: -3 }],
      hint: R`$\alpha = \beta + \frac\pi4$.`,
      sol: R`$\text{εφ}\alpha = \frac{2 + 1}{1 - 2\cdot 1} = -3$.` },
    { level: 2, type: "fields", q: R`Αν $\text{ημ}\alpha = \frac45$, $0 < \alpha < \frac\pi2$ και $\text{συν}\beta = -\frac{8}{17}$, $\pi < \beta < \frac{3\pi}{2}$, να υπολογίσετε τα $\text{εφ}(\alpha + \beta)$ και $\text{σφ}(\alpha + \beta)$.`,
      fields: [{ label: "εφ(α + β) =", ans: "-77/36" }, { label: "σφ(α + β) =", ans: "-36/77" }],
      hint: R`$\text{εφ}\alpha = \frac43$, $\text{ημ}\beta = -\frac{15}{17}$, $\text{εφ}\beta = \frac{15}{8}$.`,
      sol: R`$\text{εφ}(\alpha + \beta) = \frac{\frac43 + \frac{15}{8}}{1 - \frac43\cdot\frac{15}{8}} = \frac{\frac{77}{24}}{-\frac{36}{24}} = -\frac{77}{36}$, $\ \text{σφ}(\alpha + \beta) = -\frac{36}{77}$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε τις ακριβείς τιμές της $\text{εφ}75^\circ$ και της $\text{εφ}15^\circ$.`,
      fields: [{ label: "εφ75° =", ans: "2+√3" }, { label: "εφ15° =", ans: "2-√3" }],
      hint: R`$\text{εφ}(45^\circ \pm 30^\circ)$, $\text{εφ}30^\circ = \frac{\sqrt3}{3}$.`,
      sol: R`$\text{εφ}75^\circ = \frac{1 + \frac{\sqrt3}{3}}{1 - \frac{\sqrt3}{3}} = \frac{3 + \sqrt3}{3 - \sqrt3} = \frac{(3 + \sqrt3)^2}{6} = 2 + \sqrt3$, ανάλογα $\text{εφ}15^\circ = 2 - \sqrt3$.` },
    { level: 2, type: "mc", q: R`$\text{σφ}\left(\alpha - \frac\pi4\right) = $`,
      options: ["$\\frac{1 + \\text{σφ}\\alpha}{1 - \\text{σφ}\\alpha}$", "$\\frac{1 - \\text{σφ}\\alpha}{1 + \\text{σφ}\\alpha}$", "$\\frac{\\text{σφ}\\alpha - 1}{1 + \\text{σφ}\\alpha}$", "$\\frac{\\text{σφ}\\alpha + 1}{\\text{σφ}\\alpha - 1}$"], correct: 0,
      hint: R`$\text{σφ}(\alpha - \beta) = \frac{\text{σφ}\alpha\,\text{σφ}\beta + 1}{\text{σφ}\beta - \text{σφ}\alpha}$ με $\text{σφ}\frac\pi4 = 1$.`,
      sol: R`$\frac{\text{σφ}\alpha\cdot 1 + 1}{1 - \text{σφ}\alpha} = \frac{1 + \text{σφ}\alpha}{1 - \text{σφ}\alpha}$.` },
    { level: 2, type: "fields", q: R`Αν $\alpha + \beta = \frac\pi4$, να υπολογίσετε την τιμή του γινομένου $(1 + \text{εφ}\alpha)(1 + \text{εφ}\beta)$.`,
      fields: [{ label: "=", ans: 2 }],
      hint: R`$\text{εφ}(\alpha + \beta) = 1 \Rightarrow \text{εφ}\alpha + \text{εφ}\beta = 1 - \text{εφ}\alpha\,\text{εφ}\beta$.`,
      sol: R`$(1 + \text{εφ}\alpha)(1 + \text{εφ}\beta) = 1 + (\text{εφ}\alpha + \text{εφ}\beta) + \text{εφ}\alpha\,\text{εφ}\beta = 1 + 1 = 2$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε την $B = \dfrac{\text{σφ}\frac{7\pi}{4}\,\text{σφ}\frac{5\pi}{4} + 1}{\text{σφ}\frac{7\pi}{4} - \text{σφ}\frac{5\pi}{4}}$.`,
      fields: [{ label: "B =", ans: 0 }],
      hint: R`$\text{σφ}\frac{7\pi}{4} = -1$, $\text{σφ}\frac{5\pi}{4} = 1$.`,
      sol: R`$B = \frac{-1 + 1}{-1 - 1} = 0$ (είναι η $\text{σφ}\left(\frac{5\pi}{4} - \frac{7\pi}{4}\right) = \text{σφ}\left(-\frac\pi2\right) = 0$).` },
    { level: 2, type: "mc", q: R`Ποια ισότητα ισχύει (όπου ορίζονται οι παραστάσεις);`,
      options: ["$\\text{εφ}\\left(\\theta + \\frac\\pi4\\right) + \\text{εφ}\\left(\\theta - \\frac\\pi4\\right) = 2\\,\\text{εφ}2\\theta$", "$\\text{εφ}\\left(\\theta + \\frac\\pi4\\right) = \\text{εφ}\\theta + 1$", "$\\text{εφ}2\\theta = 2\\,\\text{εφ}\\theta$", "$\\text{εφ}(\\pi - \\theta) = \\text{εφ}\\theta$"], correct: 0,
      hint: R`Υπολόγισε $\frac{t + 1}{1 - t} + \frac{t - 1}{1 + t}$ με $t = \text{εφ}\theta$.`,
      sol: R`$\frac{(1 + t)^2 - (1 - t)^2}{1 - t^2} = \frac{4t}{1 - t^2} = 2\cdot\frac{2t}{1 - t^2} = 2\,\text{εφ}2\theta$. Οι άλλες είναι λάθος (π.χ. $\text{εφ}(\pi - \theta) = -\text{εφ}\theta$).` }
  ]
},
/* ───────────────────────────── 2.3.3 ───────────────────────────── */
{
  id: "2.3.3", unit: 2, title: "Τριγωνομετρικοί αριθμοί διπλάσιας γωνίας",
  book: "Α΄ Τεύχος §2.3.3 · Δραστηριότητες σελ. 62–63",
  theory: R`
<div class="tbox"><h4>Τύποι διπλάσιας γωνίας</h4>
$$\text{ημ}2\alpha = 2\,\text{ημ}\alpha\,\text{συν}\alpha \qquad \text{συν}2\alpha = \text{συν}^2\alpha - \text{ημ}^2\alpha = 1 - 2\text{ημ}^2\alpha = 2\text{συν}^2\alpha - 1$$
$$\text{εφ}2\alpha = \frac{2\,\text{εφ}\alpha}{1 - \text{εφ}^2\alpha} \qquad \text{ημ}2\alpha = \frac{2\,\text{εφ}\alpha}{1 + \text{εφ}^2\alpha} \qquad \text{συν}2\alpha = \frac{1 - \text{εφ}^2\alpha}{1 + \text{εφ}^2\alpha}$$</div>

<div class="tbox tip"><h4>Χρήσεις</h4>
<ul><li>Τα $\alpha$ «πάνε» και σε άλλες γωνίες: $\text{ημ}4x = 2\,\text{ημ}2x\,\text{συν}2x$, $\ \text{συν}x = 1 - 2\text{ημ}^2\frac x2$.</li>
<li>$(\text{ημ}x - \text{συν}x)^2 = 1 - \text{ημ}2x$, $\ (\text{ημ}x + \text{συν}x)^2 = 1 + \text{ημ}2x$.</li>
<li>Μέγιστη τιμή του $\text{ημ}2\theta$ είναι $1$, για $\theta = \frac\pi4$ (στο $[0, \frac\pi2]$).</li></ul></div>`,
  widget: "trigsum",
  gen: "gdouble",
  exercises: [
    { level: 1, type: "mc", q: R`$\text{συν}2\alpha = $`,
      options: ["$2\\text{συν}^2\\alpha - 1$", "$2\\text{ημ}^2\\alpha - 1$", "$\\text{ημ}^2\\alpha - \\text{συν}^2\\alpha$", "$\\text{συν}^2\\alpha - 1$"], correct: 0,
      hint: R`Μία από τις τρεις μορφές.`,
      sol: R`$\text{συν}2\alpha = 2\text{συν}^2\alpha - 1$. (Η σωστή εκδοχή της 2ης είναι $1 - 2\text{ημ}^2\alpha$.)` },
    { level: 2, type: "fields", q: R`Αν $\text{συν}\alpha = -\frac34$ και $\frac\pi2 < \alpha < \pi$, να υπολογίσετε τα $\text{ημ}2\alpha$, $\text{συν}2\alpha$, $\text{εφ}2\alpha$.`,
      fields: [{ label: "ημ2α =", ans: "-3√7/8", tol: 0.0005 }, { label: "συν2α =", ans: "1/8" }, { label: "εφ2α =", ans: "-3√7", tol: 0.0005 }],
      hint: R`$\text{ημ}\alpha = \frac{\sqrt7}{4}$ (θετικό στο 2ο τεταρτημόριο).`,
      sol: R`$\text{ημ}2\alpha = 2\cdot\frac{\sqrt7}{4}\cdot\left(-\frac34\right) = -\frac{3\sqrt7}{8}$, $\ \text{συν}2\alpha = 2\cdot\frac{9}{16} - 1 = \frac18$, $\ \text{εφ}2\alpha = \frac{-3\sqrt7/8}{1/8} = -3\sqrt7$.` },
    { level: 1, type: "mc", q: R`Αν $\alpha = \text{συν}^2\theta - \text{ημ}^2\theta$ και $\beta = 2\,\text{ημ}\theta\,\text{συν}\theta$, τότε $\alpha^2 + \beta^2 = $`,
      options: ["$1$", "$2$", "$\\frac12$", "$-1$"], correct: 0,
      hint: R`$\alpha = \text{συν}2\theta$, $\beta = \text{ημ}2\theta$.`,
      sol: R`$\text{συν}^2 2\theta + \text{ημ}^2 2\theta = 1$.` },
    { level: 1, type: "mc", q: R`$2\,\text{ημ}\left(\frac\pi4 - x\right)\text{συν}\left(\frac\pi4 - x\right) = $`,
      options: ["$\\text{συν}2x$", "$\\text{ημ}2x$", "$-\\text{ημ}2x$", "$1$"], correct: 0,
      hint: R`$= \text{ημ}\left(\frac\pi2 - 2x\right)$.`,
      sol: R`$\text{ημ}\left(2\left(\frac\pi4 - x\right)\right) = \text{ημ}\left(\frac\pi2 - 2x\right) = \text{συν}2x$.` },
    { level: 2, type: "mc", q: R`Αν $\text{ημ}x - \text{συν}x = \alpha$ και $\text{ημ}2x = \beta$, τότε:`,
      options: ["$\\alpha^2 = 1 - \\beta$", "$\\alpha^2 = 1 + \\beta$", "$\\alpha^2 = 1 - 2\\beta$", "$\\alpha^2 = 1 + 2\\beta$"], correct: 0,
      hint: R`Ύψωσε στο τετράγωνο.`,
      sol: R`$\alpha^2 = \text{ημ}^2x + \text{συν}^2x - 2\,\text{ημ}x\,\text{συν}x = 1 - \text{ημ}2x = 1 - \beta$.` },
    { level: 2, type: "fields", q: R`Σε ορθογώνιο $AB\Gamma\Delta$ η διαγώνιος είναι $B\Delta = 4$ m και σχηματίζει γωνία $\theta$ με την πλευρά $AB$. Το εμβαδόν είναι $E = 8\,\text{ημ}2\theta$. Για ποια $\theta$ (σε μοίρες) γίνεται μέγιστο και πόσο είναι;`,
      fields: [{ label: "θ (°) =", ans: 45 }, { label: "E max =", ans: 8 }],
      hint: R`$AB = 4\,\text{συν}\theta$, $A\Delta = 4\,\text{ημ}\theta$.`,
      sol: R`$E = 16\,\text{ημ}\theta\,\text{συν}\theta = 8\,\text{ημ}2\theta \le 8$, με ισότητα όταν $2\theta = 90^\circ$, δηλαδή $\theta = 45^\circ$ (τετράγωνο).` },
    { level: 3, type: "fields", q: R`Αν $\text{ημ}2x + 3\,\text{συν}2x = 3$, να βρείτε τις δυνατές τιμές της $\text{εφ}x$.`,
      fields: [{ label: "εφx₁ (μικρότερη) =", ans: 0 }, { label: "εφx₂ =", ans: "1/3" }],
      hint: R`$\text{συν}2x = 1 - 2\text{ημ}^2x$.`,
      sol: R`$2\,\text{ημ}x\,\text{συν}x + 3 - 6\text{ημ}^2x = 3 \Rightarrow 2\,\text{ημ}x(\text{συν}x - 3\,\text{ημ}x) = 0$. Άρα $\text{ημ}x = 0$ ($\text{εφ}x = 0$) ή $\text{συν}x = 3\,\text{ημ}x$ ($\text{εφ}x = \frac13$).` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το $\text{ημ}15^\circ\,\text{συν}15^\circ$.`,
      fields: [{ label: "=", ans: "1/4" }],
      hint: R`$\text{ημ}\alpha\,\text{συν}\alpha = \frac12\text{ημ}2\alpha$.`,
      sol: R`$\frac12\text{ημ}30^\circ = \frac14$.` }
  ]
},
/* ───────────────────────────── 2.3.4 ───────────────────────────── */
{
  id: "2.3.4", unit: 2, title: "Τετράγωνα τριγωνομετρικών αριθμών και συν2x",
  book: "Α΄ Τεύχος §2.3.4 · Δραστηριότητες σελ. 67",
  theory: R`
<div class="tbox"><h4>Τύποι αποτετραγωνισμού</h4>
$$\text{ημ}^2x = \frac{1 - \text{συν}2x}{2} \qquad \text{συν}^2x = \frac{1 + \text{συν}2x}{2} \qquad \text{εφ}^2x = \frac{1 - \text{συν}2x}{1 + \text{συν}2x}$$
<p>Προκύπτουν λύνοντας τους τύπους του $\text{συν}2x$ ως προς $\text{ημ}^2x$ και $\text{συν}^2x$.</p></div>

<div class="tbox tip"><h4>Μισή γωνία</h4>
<p>Με $x \to \frac x2$: $\ \text{ημ}^2\frac x2 = \frac{1 - \text{συν}x}{2}$, $\ \text{συν}^2\frac x2 = \frac{1 + \text{συν}x}{2}$. Έτσι υπολογίζουμε π.χ. $\text{ημ}^2 15^\circ = \frac{1 - \text{συν}30^\circ}{2} = \frac{2 - \sqrt3}{4}$. Χρήσιμοι και για να «χαμηλώνουμε» δυνάμεις: $\text{ημ}^4\theta + \text{συν}^4\theta = \frac{3 + \text{συν}4\theta}{4}$.</p></div>`,
  exercises: [
    { level: 1, type: "mc", q: R`$\text{συν}^2 4x = $`,
      options: ["$\\frac{1 + \\text{συν}8x}{2}$", "$\\frac{1 + \\text{συν}2x}{2}$", "$\\frac{1 - \\text{συν}8x}{2}$", "$\\frac{1 - \\text{συν}2x}{2}$"], correct: 0,
      hint: R`Διπλάσια του $4x$ είναι η $8x$.`,
      sol: R`$\text{συν}^2 4x = \frac{1 + \text{συν}(2\cdot 4x)}{2}$.` },
    { level: 1, type: "mc", q: R`$\text{ημ}^2\frac x2 = $`,
      options: ["$\\frac{1 - \\text{συν}x}{2}$", "$\\frac{1 + \\text{συν}x}{2}$", "$\\frac{1 - \\text{συν}2x}{2}$", "$\\frac{1 + \\text{συν}2x}{2}$"], correct: 0,
      hint: R`Η διπλάσια του $\frac x2$ είναι $x$.`,
      sol: R`$\text{ημ}^2\frac x2 = \frac{1 - \text{συν}x}{2}$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε τα $\text{ημ}^2 15^\circ$ και $\text{συν}^2\frac\pi8$ (ακριβώς).`,
      fields: [{ label: "ημ²15° =", ans: "(2-√3)/4" }, { label: "συν²(π/8) =", ans: "(2+√2)/4" }],
      hint: R`$\text{συν}30^\circ = \frac{\sqrt3}{2}$, $\text{συν}\frac\pi4 = \frac{\sqrt2}{2}$.`,
      sol: R`$\text{ημ}^2 15^\circ = \frac{1 - \frac{\sqrt3}{2}}{2} = \frac{2 - \sqrt3}{4}$, $\ \text{συν}^2\frac\pi8 = \frac{1 + \frac{\sqrt2}{2}}{2} = \frac{2 + \sqrt2}{4}$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε την $\text{εφ}^2\frac{\pi}{12}$ στη μορφή $\alpha + \beta\sqrt3$.`,
      fields: [{ label: "εφ²(π/12) =", ans: "7-4√3", tol: 0.0005 }],
      hint: R`$\frac{1 - \text{συν}\frac\pi6}{1 + \text{συν}\frac\pi6}$.`,
      sol: R`$\frac{1 - \frac{\sqrt3}{2}}{1 + \frac{\sqrt3}{2}} = \frac{2 - \sqrt3}{2 + \sqrt3} = (2 - \sqrt3)^2 = 7 - 4\sqrt3$ (αφού $(2 + \sqrt3)(2 - \sqrt3) = 1$).` },
    { level: 2, type: "mc", q: R`$\text{ημ}^4\theta + \text{συν}^4\theta = $`,
      options: ["$\\frac{3 + \\text{συν}4\\theta}{4}$", "$1$", "$\\frac{1 + \\text{συν}4\\theta}{2}$", "$1 - \\text{ημ}^2 2\\theta$"], correct: 0,
      hint: R`$(\text{ημ}^2 + \text{συν}^2)^2 - 2\text{ημ}^2\text{συν}^2 = 1 - \frac12\text{ημ}^2 2\theta$.`,
      sol: R`$1 - \frac12\text{ημ}^2 2\theta = 1 - \frac12\cdot\frac{1 - \text{συν}4\theta}{2} = \frac{3 + \text{συν}4\theta}{4}$.` },
    { level: 2, type: "mc", q: R`$5\text{ημ}^2\theta - 3\text{συν}^2\theta = $`,
      options: ["$1 - 4\\,\\text{συν}2\\theta$", "$2 - 8\\,\\text{συν}2\\theta$", "$1 + 4\\,\\text{συν}2\\theta$", "$5 - 8\\,\\text{συν}^2\\theta$ μόνο για $\\theta = 0$"], correct: 0,
      hint: R`Αντικατάστησε $\text{ημ}^2$ και $\text{συν}^2$ με τους τύπους.`,
      sol: R`$5\cdot\frac{1 - c}{2} - 3\cdot\frac{1 + c}{2} = \frac{2 - 8c}{2} = 1 - 4c$, με $c = \text{συν}2\theta$.` },
    { level: 2, type: "fields", q: R`Αν $\text{συν}2x = \frac13$, να βρείτε τα $\text{ημ}^2x$, $\text{συν}^2x$ και $\text{εφ}^2x$.`,
      fields: [{ label: "ημ²x =", ans: "1/3" }, { label: "συν²x =", ans: "2/3" }, { label: "εφ²x =", ans: "1/2" }],
      hint: R`Τύποι αποτετραγωνισμού.`,
      sol: R`$\text{ημ}^2x = \frac{1 - \frac13}{2} = \frac13$, $\text{συν}^2x = \frac{1 + \frac13}{2} = \frac23$, $\text{εφ}^2x = \frac{1/3}{2/3} = \frac12$.` },
    { level: 1, type: "mc", q: R`$\text{εφ}^2 3x = $`,
      options: ["$\\frac{1 - \\text{συν}6x}{1 + \\text{συν}6x}$", "$\\frac{1 - \\text{συν}\\frac{3x}{2}}{1 + \\text{συν}\\frac{3x}{2}}$", "$\\frac{1 - \\text{ημ}6x}{1 + \\text{ημ}6x}$", "$\\frac{1 + \\text{συν}6x}{1 - \\text{συν}6x}$"], correct: 0,
      hint: R`Διπλάσια του $3x$.`,
      sol: R`$\text{εφ}^2 3x = \frac{1 - \text{συν}6x}{1 + \text{συν}6x}$.` }
  ]
},
/* ───────────────────────────── 3.1 ───────────────────────────── */
{
  id: "3.1", unit: 3, title: "Η έννοια της απόλυτης τιμής",
  book: "Α΄ Τεύχος §3.1 · Δραστηριότητες σελ. 79",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
$$|x| = \begin{cases} x, & x \ge 0 \\ -x, & x < 0\end{cases}$$
<p>Γεωμετρικά, $|x|$ είναι η απόσταση του $x$ από το $0$ και $|x - \alpha|$ η απόσταση των $x$ και $\alpha$ στον άξονα.</p></div>

<div class="tbox tip"><h4>Πώς «βγάζουμε» το απόλυτο</h4>
<p>Βρίσκουμε το <b>πρόσημο</b> της παράστασης μέσα στο απόλυτο: αν είναι $\ge 0$ τη γράφουμε όπως είναι, αν είναι $< 0$ αλλάζουμε πρόσημο. Π.χ. $|\sqrt5 - 5| = 5 - \sqrt5$ (αφού $\sqrt5 < 5$), $\ |\pi - 4| = 4 - \pi$.</p>
<p>Εξίσωση $|A| = \varepsilon$: για $\varepsilon > 0$ έχουμε $A = \pm\varepsilon$· για $\varepsilon = 0$: $A = 0$· για $\varepsilon < 0$: <b>αδύνατη</b>.</p></div>`,
  widget: "absline",
  gen: "gabs",
  exercises: [
    { level: 1, type: "fields", q: R`Να γράψετε χωρίς απόλυτα: (α) $|\sqrt5 - 5|$, (β) $|\pi - 4| - |1 - \pi|$.`,
      fields: [{ label: "(α) =", ans: "5-√5", tol: 0.0005 }, { label: "(β) =", ans: "5-2π", tol: 0.0005 }],
      hint: R`$\sqrt5 < 5$, $\pi < 4$, $1 < \pi$.`,
      sol: R`(α) $5 - \sqrt5$. (β) $(4 - \pi) - (\pi - 1) = 5 - 2\pi$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε την $A = |\sqrt3 - 3| - |3 - \sqrt3|$.`,
      fields: [{ label: "A =", ans: 0 }],
      hint: R`$|x - y| = |y - x|$.`,
      sol: R`$(3 - \sqrt3) - (3 - \sqrt3) = 0$.` },
    { level: 1, type: "fields", q: R`Για $1 < x < 3$, να δείξετε ότι η $K = |x - 1| + |x - 3|$ είναι σταθερή και να βρείτε την τιμή της.`,
      fields: [{ label: "K =", ans: 2 }],
      hint: R`$x - 1 > 0$ και $x - 3 < 0$.`,
      sol: R`$K = (x - 1) + (3 - x) = 2$, ανεξάρτητη του $x$.` },
    { level: 2, type: "mc", q: R`Αν $\alpha < 2 < \beta$, η παράσταση $A = |\alpha - 2| + |\beta + 2| - 7$ ισούται με:`,
      options: ["$\\beta - \\alpha - 3$", "$\\alpha + \\beta - 7$", "$\\beta - \\alpha - 7$", "$-\\alpha - \\beta - 3$"], correct: 0,
      hint: R`$\alpha - 2 < 0$, $\beta + 2 > 0$.`,
      sol: R`$A = (2 - \alpha) + (\beta + 2) - 7 = \beta - \alpha - 3$.` },
    { level: 1, type: "fields", q: R`Να λύσετε την εξίσωση $|2x - 1| = 3$.`,
      fields: [{ label: "x₁ (μικρότερη) =", ans: -1 }, { label: "x₂ =", ans: 2 }],
      hint: R`$2x - 1 = \pm 3$.`,
      sol: R`$2x - 1 = 3 \Rightarrow x = 2$ ή $2x - 1 = -3 \Rightarrow x = -1$.` },
    { level: 1, type: "mc", q: R`Η εξίσωση $|2x + 4| = -4$:`,
      options: ["είναι αδύνατη", "έχει λύση $x = -4$", "έχει λύση $x = 0$", "έχει λύσεις $0$ και $-4$"], correct: 0,
      hint: R`Το απόλυτο είναι πάντα $\ge 0$.`,
      sol: R`Δεν υπάρχει αριθμός με αρνητική απόλυτη τιμή: αδύνατη.` },
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $|x^2 - 2x - 12| = 12$ (τέσσερις λύσεις, σε αύξουσα σειρά).`,
      fields: [{ label: "x₁ =", ans: -4 }, { label: "x₂ =", ans: 0 }, { label: "x₃ =", ans: 2 }, { label: "x₄ =", ans: 6 }],
      hint: R`$x^2 - 2x - 12 = 12$ ή $x^2 - 2x - 12 = -12$.`,
      sol: R`$x^2 - 2x - 24 = 0 \Rightarrow x = 6$ ή $x = -4$. $\ x^2 - 2x = 0 \Rightarrow x = 0$ ή $x = 2$.` },
    { level: 2, type: "mc", q: R`Αν $\alpha\beta \ne 0$, η παράσταση $A = \dfrac{\alpha}{|\alpha|} + \dfrac{\beta}{|\beta|}$ μπορεί να πάρει τις τιμές:`,
      options: ["$-2,\\ 0,\\ 2$", "μόνο $2$", "$-1,\\ 1$", "οποιαδήποτε τιμή"], correct: 0,
      hint: R`$\frac{\alpha}{|\alpha|} = \pm 1$.`,
      sol: R`Κάθε κλάσμα είναι $1$ ή $-1$: άθροισμα $2$ (ομόσημοι θετικοί), $-2$ (ομόσημοι αρνητικοί) ή $0$ (ετερόσημοι).` },
    { level: 2, type: "mc", q: R`Αν $|\alpha\beta| = -\alpha\beta$, τότε οι $\alpha$, $\beta$:`,
      options: ["είναι ετερόσημοι ή κάποιος είναι μηδέν", "είναι ομόσημοι", "είναι και οι δύο αρνητικοί", "είναι ίσοι"], correct: 0,
      hint: R`$|y| = -y \iff y \le 0$.`,
      sol: R`$|\alpha\beta| = -\alpha\beta \iff \alpha\beta \le 0$: ετερόσημοι ή κάποιος μηδέν.` }
  ]
},
/* ───────────────────────────── 3.2 ───────────────────────────── */
{
  id: "3.2", unit: 3, title: "Ιδιότητες απόλυτων τιμών – Εξισώσεις, ανισώσεις",
  book: "Α΄ Τεύχος §3.2 (εκτός συστημάτων) · Δραστηριότητες σελ. 90–91",
  theory: R`
<div class="tbox"><h4>Ιδιότητες</h4>
<ul><li>$|x| \ge 0$, $\ |{-x}| = |x|$, $\ |x|^2 = x^2$, $\ \sqrt{x^2} = |x|$.</li>
<li>$|x| = |\alpha| \iff x = \pm\alpha$.</li>
<li>Για $\varepsilon > 0$: $\ |x| \le \varepsilon \iff -\varepsilon \le x \le \varepsilon$ · $\ |x| \ge \varepsilon \iff x \le -\varepsilon$ ή $x \ge \varepsilon$.</li>
<li>$|\alpha\beta| = |\alpha||\beta|$, $\ \left|\frac\alpha\beta\right| = \frac{|\alpha|}{|\beta|}$, $\ |\alpha + \beta| \le |\alpha| + |\beta|$ (τριγωνική ανισότητα· ισότητα όταν $\alpha\beta \ge 0$).</li></ul></div>

<div class="tbox tip"><h4>Εξίσωση $|A(x)| = B(x)$</h4>
<p>Πρέπει $B(x) \ge 0$ (περιορισμός). Λύνουμε $A(x) = \pm B(x)$ και κρατάμε μόνο τις λύσεις που ικανοποιούν τον περιορισμό. Π.χ. $|x + 4| = 3x - 8$: $x \ge \frac83$, $x = 6$ ή $x = 1$ — δεκτή μόνο η $x = 6$.</p></div>`,
  widget: "absline",
  gen: "gabs",
  exercises: [
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $|x + 4| = 3x - 8$.`,
      fields: [{ label: "x =", ans: 6 }],
      hint: R`Περιορισμός $3x - 8 \ge 0$.`,
      sol: R`$x \ge \frac83$. $x + 4 = 3x - 8 \Rightarrow x = 6$ ✓, $\ x + 4 = -3x + 8 \Rightarrow x = 1$ (απορρίπτεται).` },
    { level: 1, type: "fields", q: R`Να λύσετε την ανίσωση $|x - 3| \le 2$. Η λύση είναι $[\kappa, \lambda]$.`,
      fields: [{ label: "κ =", ans: 1 }, { label: "λ =", ans: 5 }],
      hint: R`$-2 \le x - 3 \le 2$.`,
      sol: R`$1 \le x \le 5$: σημεία σε απόσταση το πολύ $2$ από το $3$.` },
    { level: 1, type: "fields", q: R`Να λύσετε την ανίσωση $|2x - 1| > 5$: η λύση είναι $x < \kappa$ ή $x > \lambda$.`,
      fields: [{ label: "κ =", ans: -2 }, { label: "λ =", ans: 3 }],
      hint: R`$2x - 1 < -5$ ή $2x - 1 > 5$.`,
      sol: R`$x < -2$ ή $x > 3$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $|x - 1| = |2x + 3|$.`,
      fields: [{ label: "x₁ (μικρότερη) =", ans: -4 }, { label: "x₂ =", ans: "-2/3" }],
      hint: R`$x - 1 = \pm(2x + 3)$.`,
      sol: R`$x - 1 = 2x + 3 \Rightarrow x = -4$· $\ x - 1 = -2x - 3 \Rightarrow 3x = -2 \Rightarrow x = -\frac23$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $|x|^2 - 5|x| + 6 = 0$. Πόσες λύσεις έχει και ποια είναι η μεγαλύτερη;`,
      fields: [{ label: "πλήθος =", ans: 4 }, { label: "μεγαλύτερη =", ans: 3 }],
      hint: R`Θέσε $y = |x| \ge 0$.`,
      sol: R`$y^2 - 5y + 6 = 0 \Rightarrow y = 2$ ή $y = 3$. Άρα $x = \pm 2, \pm 3$: τέσσερις λύσεις, μεγαλύτερη $3$.` },
    { level: 1, type: "fields", q: R`Αν $|x - 2| < 0{,}1$, τότε $|3x - 6| < \varepsilon$. Ποιο είναι το μικρότερο τέτοιο $\varepsilon$;`,
      fields: [{ label: "ε =", ans: 0.3 }],
      hint: R`$|3x - 6| = 3|x - 2|$.`,
      sol: R`$|3x - 6| = 3|x - 2| < 3\cdot 0{,}1 = 0{,}3$.` },
    { level: 1, type: "mc", q: R`$\sqrt{x^2 - 6x + 9} = $`,
      options: ["$|x - 3|$", "$x - 3$", "$3 - x$", "$x + 3$"], correct: 0,
      hint: R`$x^2 - 6x + 9 = (x - 3)^2$ και $\sqrt{y^2} = |y|$.`,
      sol: R`$\sqrt{(x - 3)^2} = |x - 3|$ — όχι απλώς $x - 3$!` },
    { level: 2, type: "mc", q: R`Η τριγωνική ανισότητα $|\alpha + \beta| \le |\alpha| + |\beta|$ ισχύει ως ισότητα όταν:`,
      options: ["$\\alpha\\beta \\ge 0$", "$\\alpha\\beta < 0$", "$\\alpha = -\\beta$", "πάντα"], correct: 0,
      hint: R`Δοκίμασε $\alpha = 2, \beta = -3$.`,
      sol: R`Ισότητα όταν οι $\alpha$, $\beta$ είναι ομόσημοι ή κάποιος είναι $0$, δηλαδή $\alpha\beta \ge 0$. Π.χ. $|2 + (-3)| = 1 < 5$.` }
  ]
},
/* ───────────────────────────── 3.4 ───────────────────────────── */
{
  id: "3.4", unit: 3, title: "Η έννοια της συνάρτησης",
  book: "Α΄ Τεύχος §3.3–3.4",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p><b>Συνάρτηση</b> από ένα σύνολο $A$ σε ένα σύνολο $B$ είναι μια διαδικασία (κανόνας) με την οποία <b>κάθε</b> στοιχείο $x$ του $A$ αντιστοιχίζεται σε <b>ένα μόνο</b> στοιχείο $y$ του $B$. Γράφουμε $f: A \to B$, $\ y = f(x)$.</p>
<ul><li>$x$: ανεξάρτητη μεταβλητή · $y = f(x)$: εξαρτημένη μεταβλητή, η <b>τιμή</b> της $f$ στο $x$.</li>
<li>$A$: <b>πεδίο ορισμού</b> της $f$.</li>
<li>$f(A) = \{f(x) : x \in A\}$: <b>σύνολο τιμών</b> της $f$ (όλες οι τιμές που παίρνει πραγματικά).</li></ul></div>

<div class="tbox tip"><h4>Τρόποι αναπαράστασης</h4>
<p>Με <b>τύπο</b> ($f(x) = 3x^2 - 1$), με <b>βελοειδές διάγραμμα</b>, με <b>πίνακα τιμών</b>, με <b>γραφική παράσταση</b> ή λεκτικά.</p>
<p>Για να υπολογίσουμε το $f(\kappa)$ αντικαθιστούμε <b>κάθε</b> $x$ του τύπου με $\kappa$ (σε παρένθεση!). Π.χ. για $f(x) = x^2 + 1$: $f(-3) = (-3)^2 + 1 = 10$, $f(2t) = 4t^2 + 1$.</p>
<p>Βελοειδές διάγραμμα: από <b>κάθε</b> στοιχείο του $A$ πρέπει να ξεκινά <b>ακριβώς ένα</b> βέλος. Στο $B$ μπορεί να φτάνουν πολλά ή κανένα.</p></div>`,
  widget: "funval",
  gen: "gfval",
  exercises: [
    { level: 1, type: "fields", q: R`Δίνεται $f(x) = 3x^2 + 2x - 4$. Να υπολογίσετε τα $f(0)$ και $f(-2)$.`,
      fields: [{ label: "f(0) =", ans: -4 }, { label: "f(−2) =", ans: 4 }],
      hint: R`$f(-2) = 3(-2)^2 + 2(-2) - 4$.`,
      sol: R`$f(0) = -4$, $\ f(-2) = 12 - 4 - 4 = 4$.` },
    { level: 1, type: "fields", q: R`Δίνεται $f(x) = -2x^2 + x - 1$. Να υπολογίσετε το $f(2)$.`,
      fields: [{ label: "f(2) =", ans: -7 }],
      hint: R`Πρώτα η δύναμη: $-2\cdot 2^2 = -8$.`,
      sol: R`$f(2) = -2\cdot 4 + 2 - 1 = -7$.` },
    { level: 1, type: "fields", q: R`Δίνεται $f(x) = |x| + 4$. Να υπολογίσετε το $f(1) + f(-1)$.`,
      fields: [{ label: "f(1) + f(−1) =", ans: 10 }],
      hint: R`$|-1| = 1$.`,
      sol: R`$f(1) = 5$, $f(-1) = 5$, άθροισμα $10$.` },
    { level: 2, type: "fields", q: R`Αν $f(x) = 2x^3 + Ax^2 + 4x - 5$, $x \in \mathbb{R}$, και $f(2) = 5$, να υπολογίσετε το $A$.`,
      fields: [{ label: "A =", ans: "-7/2" }],
      hint: R`Αντικατάστησε $x = 2$ και λύσε ως προς $A$.`,
      sol: R`$16 + 4A + 8 - 5 = 5 \Rightarrow 4A = -14 \Rightarrow A = -\frac72$.` },
    { level: 2, type: "fields", q: R`Η συνάρτηση $h(x) = 20 - 4{,}9x^2$, $x \ge 0$, δίνει το ύψος (σε m) μιας πέτρας που πέφτει από βράχο ύψους $20$ m, μετά από $x$ δευτερόλεπτα. Να βρείτε το ύψος μετά από $1$ s και μετά από $2$ s, και πότε η πέτρα φτάνει στο έδαφος (2 δεκαδικά).`,
      fields: [{ label: "h(1) =", ans: 15.1 }, { label: "h(2) =", ans: 0.4, tol: 0.001 }, { label: "χρόνος (s) =", ans: 2.02, tol: 0.003 }],
      hint: R`Στο έδαφος: $h(x) = 0$.`,
      sol: R`$h(1) = 15{,}1$ m, $h(2) = 20 - 19{,}6 = 0{,}4$ m. $20 - 4{,}9x^2 = 0 \Rightarrow x = \sqrt{\frac{20}{4{,}9}} \approx 2{,}02$ s (κρατάμε τη θετική ρίζα).` },
    { level: 2, type: "mc", q: R`Αν $f(x) = x^2$, $x \in \mathbb{R}$, η παράσταση $\dfrac{f(x) - f(\alpha)}{x - \alpha}$, $x \ne \alpha$, ισούται με:`,
      options: ["$x + \\alpha$", "$x - \\alpha$", "$x^2 - \\alpha^2$", "$1$"], correct: 0,
      hint: R`$x^2 - \alpha^2 = (x - \alpha)(x + \alpha)$.`,
      sol: R`$\frac{x^2 - \alpha^2}{x - \alpha} = \frac{(x - \alpha)(x + \alpha)}{x - \alpha} = x + \alpha$.` },
    { level: 1, type: "mc", q: R`Ποιο από τα πιο κάτω σύνολα ζευγών <b>δεν</b> ορίζει συνάρτηση από το $A = \{1, 2, 3\}$ στο $\mathbb{R}$;`,
      options: ["$\\{(1,4),\\ (2,4),\\ (3,5)\\}$", "$\\{(1,2),\\ (1,3),\\ (2,4),\\ (3,5)\\}$", "$\\{(1,0),\\ (2,0),\\ (3,0)\\}$", "$\\{(1,7),\\ (2,-7),\\ (3,1)\\}$"], correct: 1,
      hint: R`Κάθε $x$ του $A$ πρέπει να έχει <b>μία μόνο</b> εικόνα.`,
      sol: R`Στο δεύτερο το $1$ αντιστοιχίζεται και στο $2$ και στο $3$ — δεν είναι συνάρτηση. Τα υπόλοιπα είναι (το ίδιο $y$ για διαφορετικά $x$ επιτρέπεται).` },
    { level: 2, type: "mc", q: R`Η συνάρτηση $f: A \to \mathbb{R}$ με $A = \{-1, 0, 1, 2\}$ και $f(x) = x^2$ έχει σύνολο τιμών:`,
      options: ["$\\{0, 1, 4\\}$", "$\\{-1, 0, 1, 2\\}$", "$\\{0, 1, 2, 4\\}$", "$[0, +\\infty)$"], correct: 0,
      hint: R`Υπολόγισε $f(-1), f(0), f(1), f(2)$.`,
      sol: R`$f(-1) = 1$, $f(0) = 0$, $f(1) = 1$, $f(2) = 4$, άρα $f(A) = \{0, 1, 4\}$.` }
  ]
},
/* ───────────────────────────── 3.5 ───────────────────────────── */
{
  id: "3.5", unit: 3, title: "Γράφημα – Γραφική παράσταση",
  book: "Α΄ Τεύχος §3.5",
  theory: R`
<div class="tbox"><h4>Γράφημα και γραφική παράσταση</h4>
<p><b>Γράφημα</b> της $f: A \to \mathbb{R}$ είναι το σύνολο των ζευγών $G_f = \{(x, f(x)) : x \in A\}$. Η εικόνα του στο επίπεδο είναι η <b>γραφική παράσταση</b> $C_f$.</p>
<p>Ένα σημείο $M(\kappa, \lambda)$ ανήκει στη $C_f$ <b>αν και μόνο αν</b> $\kappa \in A$ και $f(\kappa) = \lambda$.</p></div>

<div class="tbox"><h4>Κριτήριο κατακόρυφης ευθείας</h4>
<p>Μια γραμμή είναι γραφική παράσταση συνάρτησης όταν <b>κάθε κατακόρυφη ευθεία</b> την τέμνει σε <b>το πολύ ένα</b> σημείο. Ένα σύνολο ζευγών είναι γράφημα συνάρτησης όταν <b>δεν</b> υπάρχουν δύο ζεύγη με ίδιο πρώτο και διαφορετικό δεύτερο στοιχείο.</p></div>

<div class="tbox tip"><h4>Χρήσιμα</h4>
<ul><li>Τομή με τον $y'y$: το σημείο $(0, f(0))$ (αν $0 \in A$).</li>
<li>Τομή με τον $x'x$: λύνουμε $f(x) = 0$.</li>
<li>Κοινά σημεία των $C_f$, $C_g$: λύνουμε $f(x) = g(x)$.</li>
<li>Από τη γραφική παράσταση «διαβάζουμε» το πεδίο ορισμού (προβολή στον $x'x$) και το σύνολο τιμών (προβολή στον $y'y$).</li></ul></div>`,
  widget: "vline",
  exercises: [
    { level: 1, type: "mc", q: R`Ποιο από τα πιο κάτω σύνολα <b>δεν</b> είναι γράφημα συνάρτησης;`,
      options: ["{(2, 1), (−2, 5), (0, 4), (1, −7)}", "{(1, 8), (−4, −5), (−3, 3), (1, 1)}", "{(1, 1), (2, 1), (3, 1), (4, 1)}", "{(0, 0), (1, 1), (4, 2), (9, 3)}"], correct: 1,
      hint: R`Ψάξε δύο ζεύγη με το ίδιο πρώτο στοιχείο.`,
      sol: R`Στο δεύτερο υπάρχουν τα $(1, 8)$ και $(1, 1)$: στο $x = 1$ αντιστοιχούν δύο τιμές.` },
    { level: 1, type: "mc", q: R`Το σύνολο $\{(1,1),\ (2,1),\ (3,1),\ (4,1),\ (5,1)\}$ είναι γράφημα συνάρτησης με σύνολο τιμών:`,
      options: ["$\\{1\\}$", "$\\{1,2,3,4,5\\}$", "$\\{1,1,1,1,1\\}$", "δεν είναι γράφημα συνάρτησης"], correct: 0,
      hint: R`Ποιες τιμές παίρνει το $y$;`,
      sol: R`Είναι σταθερή συνάρτηση με πεδίο ορισμού $\{1,2,3,4,5\}$ και σύνολο τιμών $\{1\}$.` },
    { level: 1, type: "fields", q: R`Το σημείο $(3, 8)$ ανήκει στη γραφική παράσταση της $g$. Να βρείτε το $\alpha$ όταν: (α) $g(x) = x^2 + \alpha$, (β) $g(x) = \alpha x + 2$.`,
      fields: [{ label: "(α) α =", ans: -1 }, { label: "(β) α =", ans: 2 }],
      hint: R`$g(3) = 8$.`,
      sol: R`(α) $9 + \alpha = 8 \Rightarrow \alpha = -1$. (β) $3\alpha + 2 = 8 \Rightarrow \alpha = 2$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τα σημεία τομής της γραφικής παράστασης της $f(x) = x^2 - 4x + 3$ με τους άξονες.`,
      fields: [{ label: "τομή με y'y: y =", ans: 3 }, { label: "τομή με x'x: x₁ (μικρότερο) =", ans: 1 }, { label: "x₂ =", ans: 3 }],
      hint: R`$f(0)$ και λύση της $f(x) = 0$.`,
      sol: R`$f(0) = 3$: σημείο $(0, 3)$. $x^2 - 4x + 3 = 0 \Rightarrow x = 1$ ή $x = 3$: σημεία $(1, 0)$, $(3, 0)$.` },
    { level: 1, type: "mc", q: R`Ποια από τις πιο κάτω σχέσεις ορίζει το $y$ ως συνάρτηση του $x$ (για όλα τα $x$ όπου έχει νόημα);`,
      options: ["$y^2 = x$", "$x + 2y = 1$", "$x^2 + y^2 = 16$", "$|y| = x$"], correct: 1,
      hint: R`Λύσε ως προς $y$: παίρνεις μία ή δύο τιμές;`,
      sol: R`$x + 2y = 1 \Rightarrow y = \frac{1 - x}{2}$: μία τιμή για κάθε $x$. Στις άλλες υπάρχουν $x$ με δύο τιμές του $y$: στην $y^2 = x$ για $x = 4$ έχουμε $y = \pm 2$, στον κύκλο για $x = 0$ έχουμε $y = \pm 4$, στην $|y| = x$ για $x = 1$ έχουμε $y = \pm 1$.` },
    { level: 1, type: "mc", q: R`Ανήκει το σημείο $A(-1, 2)$ στη γραφική παράσταση της $f(x) = 2x^2 - x - 1$;`,
      options: ["Ναι", "Όχι"], correct: 0,
      hint: R`Υπολόγισε το $f(-1)$.`,
      sol: R`$f(-1) = 2 + 1 - 1 = 2$, άρα ναι.` },
    { level: 2, type: "fields", q: R`Να βρείτε τα κοινά σημεία των γραφικών παραστάσεων των $f(x) = x^2$ και $g(x) = x + 2$.`,
      fields: [{ label: "1ο σημείο (μικρότερο x): x =", ans: -1 }, { label: "y =", ans: 1 }, { label: "2ο σημείο: x =", ans: 2 }, { label: "y =", ans: 4 }],
      hint: R`Λύσε $x^2 = x + 2$.`,
      sol: R`$x^2 - x - 2 = 0 \Rightarrow x = -1$ ή $x = 2$. Σημεία $(-1, 1)$ και $(2, 4)$.` },
    { level: 2, type: "mc", q: R`Ο κύκλος $x^2 + y^2 = 9$ είναι γραφική παράσταση συνάρτησης $y = f(x)$;`,
      options: ["Ναι, με πεδίο ορισμού $[-3, 3]$", "Όχι — π.χ. η ευθεία $x = 0$ τον τέμνει σε δύο σημεία", "Ναι, γιατί είναι κλειστή καμπύλη", "Όχι, γιατί δεν περνά από την αρχή των αξόνων"], correct: 1,
      hint: R`Κριτήριο κατακόρυφης ευθείας.`,
      sol: R`Για $x = 0$ έχουμε $y = 3$ και $y = -3$. Η κατακόρυφη $x = 0$ τέμνει τον κύκλο σε δύο σημεία, άρα δεν είναι συνάρτηση.` }
  ]
},
/* ───────────────────────────── 3.6 ───────────────────────────── */
{
  id: "3.6", unit: 3, title: "Είδη συναρτήσεων – Άρτιες και περιττές",
  book: "Α΄ Τεύχος §3.6 · Δραστηριότητες σελ. 116–118",
  theory: R`
<div class="tbox"><h4>Βασικά είδη</h4>
<ul><li><b>Σταθερή</b>: $f(x) = c$. <b>Ταυτοτική</b>: $f(x) = x$.</li>
<li><b>Πολυωνυμική</b>: $f(x) = \alpha_\nu x^\nu + \dots + \alpha_1x + \alpha_0$. <b>Ρητή</b>: πηλίκο πολυωνύμων $\frac{P(x)}{Q(x)}$.</li>
<li><b>Τμηματική</b> (πολλαπλού τύπου): διαφορετικός τύπος σε κάθε διάστημα, π.χ. $|x - 4| = \begin{cases} x - 4, & x \ge 4 \\ 4 - x, & x < 4\end{cases}$.</li></ul></div>

<div class="tbox"><h4>Άρτια – περιττή</h4>
<p>Για κάθε $x \in A$ πρέπει πρώτα $-x \in A$ (συμμετρικό πεδίο ορισμού). Τότε η $f$ είναι:</p>
<ul><li><b>άρτια</b> αν $f(-x) = f(x)$ — η γραφική παράσταση είναι συμμετρική ως προς τον άξονα $y'y$ (π.χ. $x^2$, $|x|$, $\text{συν}x$)·</li>
<li><b>περιττή</b> αν $f(-x) = -f(x)$ — συμμετρική ως προς την αρχή $O$ (π.χ. $x^3$, $\frac1x$, $\text{ημ}x$).</li></ul></div>

<div class="tbox tip"><h4>Πώς το ελέγχουμε</h4>
<p>Υπολογίζουμε το $f(-x)$ και το συγκρίνουμε με $f(x)$ και $-f(x)$. Για να δείξουμε ότι <b>δεν</b> είναι, αρκεί ένα αντιπαράδειγμα (π.χ. $f(1) \ne f(-1)$ και $f(-1) \ne -f(1)$).</p></div>`,
  widget: "parity",
  gen: "gparity",
  exercises: [
    { level: 1, type: "mc", q: R`Η $f(x) = 3x^2 + 5x^4$, $x \in \mathbb{R}$, είναι:`,
      options: ["άρτια", "περιττή", "ούτε άρτια ούτε περιττή"], correct: 0,
      hint: R`Άρτιες δυνάμεις.`, sol: R`$f(-x) = 3x^2 + 5x^4 = f(x)$: άρτια.` },
    { level: 1, type: "mc", q: R`Η $f(x) = x^3 - 3x^5$, $x \in \mathbb{R}$, είναι:`,
      options: ["άρτια", "περιττή", "ούτε άρτια ούτε περιττή"], correct: 1,
      hint: R`Περιττές δυνάμεις.`, sol: R`$f(-x) = -x^3 + 3x^5 = -f(x)$: περιττή.` },
    { level: 1, type: "mc", q: R`Η $f(x) = |x + 1|$, $x \in \mathbb{R}$, είναι:`,
      options: ["άρτια", "περιττή", "ούτε άρτια ούτε περιττή"], correct: 2,
      hint: R`Σύγκρινε $f(1)$ και $f(-1)$.`, sol: R`$f(1) = 2$, $f(-1) = 0$: ούτε $f(-1) = f(1)$ ούτε $f(-1) = -f(1)$.` },
    { level: 2, type: "mc", q: R`Η $f(x) = \dfrac{x^3}{1 + x^2}$, $x \in \mathbb{R}$, είναι:`,
      options: ["άρτια", "περιττή", "ούτε άρτια ούτε περιττή"], correct: 1,
      hint: R`Ο παρονομαστής δεν αλλάζει.`, sol: R`$f(-x) = \frac{-x^3}{1 + x^2} = -f(x)$: περιττή.` },
    { level: 2, type: "mc", q: R`Η $f(x) = |x - 2| + |x + 2|$, $x \in \mathbb{R}$, είναι:`,
      options: ["άρτια", "περιττή", "ούτε άρτια ούτε περιττή"], correct: 0,
      hint: R`$|-x - 2| = |x + 2|$.`, sol: R`$f(-x) = |-x - 2| + |-x + 2| = |x + 2| + |x - 2| = f(x)$: άρτια.` },
    { level: 2, type: "mc", q: R`Η $f(x) = \sqrt{x - 4}$, $x \in [4, +\infty)$, είναι:`,
      options: ["άρτια", "περιττή", "ούτε άρτια ούτε περιττή"], correct: 2,
      hint: R`Ποιο είναι το πεδίο ορισμού;`, sol: R`Το πεδίο ορισμού δεν είναι συμμετρικό ($4 \in A$ αλλά $-4 \notin A$): ούτε άρτια ούτε περιττή.` },
    { level: 1, type: "mc", q: R`Η σταθερή συνάρτηση $f(x) = 2$, $x \in \mathbb{R}$, είναι:`,
      options: ["άρτια", "περιττή", "και άρτια και περιττή", "ούτε άρτια ούτε περιττή"], correct: 0,
      hint: R`$f(-x) = 2$.`, sol: R`$f(-x) = 2 = f(x)$: άρτια. Δεν είναι περιττή, γιατί $-f(x) = -2 \ne 2$. (Η μόνη και άρτια και περιττή είναι η $f(x) = 0$.)` },
    { level: 2, type: "expr", label: "f(x) =", q: R`Η συνάρτηση $g(x) = (x + 2)^2 + f(x)$, $x \in \mathbb{R}$, είναι ταυτοτική. Να βρείτε τον τύπο της $f$.`,
      ref: "x-(x+2)^2", key: "-x^2-3x-4",
      hint: R`Ταυτοτική: $g(x) = x$.`,
      sol: R`$(x + 2)^2 + f(x) = x \Rightarrow f(x) = x - x^2 - 4x - 4 = -x^2 - 3x - 4$.` },
    { level: 2, type: "fields", q: R`Δίνεται η τμηματική $f(x) = \begin{cases} 2x^2 - 1, & x \le 2 \\ 3x - \alpha, & x > 2\end{cases}$. Να βρείτε το $\alpha$ ώστε η γραφική παράσταση να περνά από το $A(3, 4)$, και την τιμή $f(2)$.`,
      fields: [{ label: "α =", ans: 5 }, { label: "f(2) =", ans: 7 }],
      hint: R`Για $x = 3 > 2$ ισχύει ο δεύτερος τύπος.`,
      sol: R`$9 - \alpha = 4 \Rightarrow \alpha = 5$. $f(2) = 2\cdot 4 - 1 = 7$ (πρώτος τύπος).` },
    { level: 1, type: "mc", q: R`Η $f(x) = x^2 - (x - 1)^2 - x + 1$, $x \in \mathbb{R}$, είναι ταυτοτική.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Κάνε τις πράξεις.`, sol: R`$x^2 - x^2 + 2x - 1 - x + 1 = x$: ταυτοτική.` }
  ]
},
/* ───────────────────────────── 3.7 ───────────────────────────── */
{
  id: "3.7", unit: 3, title: "Πεδίο ορισμού – Σύνολο τιμών",
  book: "Α΄ Τεύχος §3.7",
  theory: R`
<div class="tbox"><h4>Πεδίο ορισμού συνάρτησης με τύπο</h4>
<p>Όταν δίνεται μόνο ο τύπος, πεδίο ορισμού είναι το <b>ευρύτερο</b> υποσύνολο του $\mathbb{R}$ για το οποίο ο τύπος έχει νόημα:</p>
<ul><li><b>Πολυωνυμική</b>: $A = \mathbb{R}$.</li>
<li><b>Κλάσμα</b> $\frac{P(x)}{Q(x)}$: παρονομαστής $Q(x) \ne 0$.</li>
<li><b>Τετραγωνική ρίζα</b> $\sqrt{g(x)}$: υπόρριζο $g(x) \ge 0$.</li>
<li>Ρίζα σε παρονομαστή $\frac{1}{\sqrt{g(x)}}$: $g(x) > 0$.</li>
<li>Όταν συνυπάρχουν περιορισμοί, παίρνουμε την <b>τομή</b> τους.</li></ul></div>

<div class="tbox tip"><h4>Σύνολο τιμών</h4>
<p>Λύνουμε την $y = f(x)$ ως προς $x$: το $y$ είναι τιμή της $f$ όταν η εξίσωση έχει λύση <b>μέσα στο πεδίο ορισμού</b>. Π.χ. $y = \frac{x + 2}{3x - 1} \Rightarrow x = \frac{y + 2}{3y - 1}$, που ορίζεται για $y \ne \frac13$: σύνολο τιμών $\mathbb{R} - \{\frac13\}$.</p>
<p>Για γνησίως αύξουσα πολυωνυμική συνάρτηση (π.χ. $y = 7x - 4$) σε διάστημα $[\alpha, \beta]$, οι τιμές είναι από $f(\alpha)$ έως $f(\beta)$.</p></div>`,
  widget: "domain",
  gen: "gdom",
  exercises: [
    { level: 1, type: "mc", q: R`Το πεδίο ορισμού της $g(x) = \dfrac{2x}{x^2 - 16}$ είναι:`,
      options: ["$\\mathbb{R} - \\{4\\}$", "$\\mathbb{R} - \\{-4, 4\\}$", "$\\mathbb{R} - \\{0\\}$", "$(4, +\\infty)$"], correct: 1,
      hint: R`$x^2 - 16 \ne 0$.`,
      sol: R`$x^2 - 16 = 0 \iff x = \pm 4$, άρα $A = \mathbb{R} - \{-4, 4\}$.` },
    { level: 2, type: "mc", q: R`Το πεδίο ορισμού της $h(x) = \dfrac{1}{x^3 - 4x}$ είναι:`,
      options: ["$\\mathbb{R} - \\{-2, 0, 2\\}$", "$\\mathbb{R} - \\{-2, 2\\}$", "$\\mathbb{R} - \\{0, 4\\}$", "$\\mathbb{R} - \\{0\\}$"], correct: 0,
      hint: R`$x^3 - 4x = x(x - 2)(x + 2)$.`,
      sol: R`$x(x - 2)(x + 2) \ne 0 \iff x \ne 0, \pm 2$.` },
    { level: 1, type: "mc", q: R`Το πεδίο ορισμού της $f(x) = \sqrt{x + 2}$ είναι:`,
      options: ["$[-2, +\\infty)$", "$(-2, +\\infty)$", "$[2, +\\infty)$", "$\\mathbb{R}$"], correct: 0,
      hint: R`$x + 2 \ge 0$.`,
      sol: R`$x + 2 \ge 0 \iff x \ge -2$: $A = [-2, +\infty)$.` },
    { level: 2, type: "mc", q: R`Το πεδίο ορισμού της $g(x) = \sqrt{x^2 - 25}$ είναι:`,
      options: ["$[5, +\\infty)$", "$[-5, 5]$", "$(-\\infty, -5] \\cup [5, +\\infty)$", "$\\mathbb{R} - \\{-5, 5\\}$"], correct: 2,
      hint: R`$x^2 \ge 25$.`,
      sol: R`$x^2 - 25 \ge 0 \iff x \le -5$ ή $x \ge 5$.` },
    { level: 1, type: "fields", q: R`Το πεδίο ορισμού της $g(x) = \sqrt{4 - 8x}$ είναι $(-\infty, \kappa]$. Να βρείτε το $\kappa$.`,
      fields: [{ label: "κ =", ans: "1/2" }],
      hint: R`$4 - 8x \ge 0$.`,
      sol: R`$4 - 8x \ge 0 \iff x \le \frac12$, άρα $\kappa = \frac12$.` },
    { level: 2, type: "mc", q: R`Το πεδίο ορισμού της $h(x) = \dfrac{\sqrt{x + 3}}{x - 1}$ είναι:`,
      options: ["$[-3, 1) \\cup (1, +\\infty)$", "$[-3, +\\infty)$", "$(-3, 1) \\cup (1, +\\infty)$", "$\\mathbb{R} - \\{1\\}$"], correct: 0,
      hint: R`Δύο περιορισμοί: υπόρριζο $\ge 0$ και παρονομαστής $\ne 0$.`,
      sol: R`$x + 3 \ge 0 \iff x \ge -3$ και $x \ne 1$: $A = [-3, 1) \cup (1, +\infty)$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το σύνολο τιμών της $y = 7x - 4$, $x \in [3, 31]$, στη μορφή $[m, M]$.`,
      fields: [{ label: "m =", ans: 17 }, { label: "M =", ans: 213 }],
      hint: R`Η $y = 7x - 4$ είναι γνησίως αύξουσα.`,
      sol: R`$3 \le x \le 31 \Rightarrow 21 \le 7x \le 217 \Rightarrow 17 \le 7x - 4 \le 213$: σύνολο τιμών $[17, 213]$.` },
    { level: 3, type: "fields", q: R`Το σύνολο τιμών της $y = \dfrac{x + 2}{3x - 1}$ είναι $\mathbb{R} - \{\kappa\}$. Να βρείτε το $\kappa$.`,
      fields: [{ label: "κ =", ans: "1/3" }],
      hint: R`Λύσε ως προς $x$: $y(3x - 1) = x + 2$.`,
      sol: R`$3xy - y = x + 2 \Rightarrow x(3y - 1) = y + 2 \Rightarrow x = \frac{y + 2}{3y - 1}$, που ορίζεται για $y \ne \frac13$ (και πάντα $x \ne \frac13$, αφού $\frac{y + 2}{3y - 1} = \frac13$ είναι αδύνατη). Άρα $\kappa = \frac13$.` }
  ]
},
/* ───────────────────────────── 3.8 ───────────────────────────── */
{
  id: "3.8", unit: 3, title: "Ισότητα συναρτήσεων",
  book: "Α΄ Τεύχος §3.8",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Δύο συναρτήσεις $f: A \to \mathbb{R}$ και $g: B \to \mathbb{R}$ είναι <b>ίσες</b> ($f = g$) όταν:</p>
<ul><li>έχουν το <b>ίδιο πεδίο ορισμού</b> ($A = B$) και</li>
<li>$f(x) = g(x)$ για <b>κάθε</b> $x \in A$.</li></ul></div>

<div class="tbox tip"><h4>Ίσες σε υποσύνολο</h4>
<p>Αν $f \ne g$, μπορεί να είναι ίσες σε ένα σύνολο $\Gamma \subseteq A \cap B$, όταν $f(x) = g(x)$ για κάθε $x \in \Gamma$.</p>
<p>Παράδειγμα: $f(x) = \frac{x^2 - 100}{x - 10}$ ($x \ne 10$) και $g(x) = x + 10$ ($x \in \mathbb{R}$). Απλοποιώντας, $f(x) = x + 10$ για $x \ne 10$. Δεν είναι ίσες (διαφορετικό πεδίο ορισμού), είναι όμως ίσες στο $\mathbb{R} - \{10\}$.</p>
<p><b>Προσοχή:</b> πριν απλοποιήσουμε, γράφουμε το πεδίο ορισμού!</p></div>`,
  exercises: [
    { level: 1, type: "mc", q: R`Δίνονται $f(x) = \dfrac{x^2 - 100}{x - 10}$, $x \in \mathbb{R} - \{10\}$, και $g(x) = x + 10$, $x \in \mathbb{R}$. Ποιο ισχύει;`,
      options: ["$f = g$", "$f = g$ στο $\\mathbb{R} - \\{10\\}$, αλλά $f \\ne g$", "$f = g$ μόνο για $x = 10$", "δεν είναι ίσες σε κανένα σύνολο"], correct: 1,
      hint: R`Σύγκρινε πεδία ορισμού και τύπους.`,
      sol: R`Για $x \ne 10$: $f(x) = \frac{(x - 10)(x + 10)}{x - 10} = x + 10 = g(x)$. Τα πεδία ορισμού διαφέρουν, άρα $f \ne g$, αλλά είναι ίσες στο $\mathbb{R} - \{10\}$.` },
    { level: 2, type: "mc", q: R`Είναι ίσες οι $f(x) = \dfrac{3x^3 + 9x}{x^2 + 3}$ και $g(x) = 3x$;`,
      options: ["Ναι", "Όχι, γιατί διαφέρουν τα πεδία ορισμού", "Όχι, γιατί διαφέρουν οι τύποι"], correct: 0,
      hint: R`Μηδενίζεται ποτέ το $x^2 + 3$;`,
      sol: R`$x^2 + 3 > 0$ για κάθε $x$, άρα και οι δύο ορίζονται στο $\mathbb{R}$. $f(x) = \frac{3x(x^2 + 3)}{x^2 + 3} = 3x = g(x)$. Άρα $f = g$.` },
    { level: 3, type: "mc", q: R`Για τις $f(x) = \dfrac{x^2 + x - 6}{x + 3}$ και $g(x) = \dfrac{x^2 - 3x + 2}{x - 1}$, το ευρύτερο σύνολο στο οποίο είναι ίσες είναι:`,
      options: ["$\\mathbb{R}$", "$\\mathbb{R} - \\{-3\\}$", "$\\mathbb{R} - \\{1\\}$", "$\\mathbb{R} - \\{-3, 1\\}$"], correct: 3,
      hint: R`Παραγοντοποίησε τους αριθμητές.`,
      sol: R`$f(x) = \frac{(x + 3)(x - 2)}{x + 3} = x - 2$ για $x \ne -3$, $\ g(x) = \frac{(x - 1)(x - 2)}{x - 1} = x - 2$ για $x \ne 1$. Ίσες στο $A \cap B = \mathbb{R} - \{-3, 1\}$.` },
    { level: 2, type: "mc", q: R`Οι $f, g: \{-2, 0, 2\} \to \mathbb{R}$ με $f(x) = x^3 - 4x + 10$ και $g(x) = 10$ είναι ίσες;`,
      options: ["Ναι", "Όχι"], correct: 0,
      hint: R`Έλεγξε και τα τρία $x$.`,
      sol: R`$f(-2) = -8 + 8 + 10 = 10$, $f(0) = 10$, $f(2) = 8 - 8 + 10 = 10$. Ίδιο πεδίο ορισμού και ίδιες τιμές: $f = g$.` },
    { level: 1, type: "mc", q: R`Οι $f(x) = 2x + 1$, $x \in \{0, 1, 2, 3\}$ και $g(x) = 2x + 1$, $x \in \{0, 1, 2, 4\}$:`,
      options: ["είναι ίσες, γιατί έχουν τον ίδιο τύπο", "δεν είναι ίσες, γιατί έχουν διαφορετικό πεδίο ορισμού", "είναι ίσες μόνο αν $x = 3$"], correct: 1,
      hint: R`Ο τύπος δεν αρκεί.`,
      sol: R`Για την ισότητα χρειάζεται και ίδιο πεδίο ορισμού. Εδώ $\{0,1,2,3\} \ne \{0,1,2,4\}$. (Είναι ίσες στο $\{0, 1, 2\}$.)` },
    { level: 2, type: "mc", q: R`Ποιο ισχύει για τις $f(x) = \sqrt{x^2}$ και $g(x) = x$, $x \in \mathbb{R}$;`,
      options: ["$f = g$", "$f = g$ στο $[0, +\\infty)$", "$f = g$ στο $(-\\infty, 0]$", "δεν είναι ίσες σε κανένα σύνολο"], correct: 1,
      hint: R`$\sqrt{x^2} = |x|$.`,
      sol: R`$f(x) = |x|$. Για $x \ge 0$: $|x| = x$. Για $x < 0$: $|x| = -x \ne x$. Άρα ίσες μόνο στο $[0, +\infty)$.` },
    { level: 1, type: "fields", q: R`Να βρείτε τα $\alpha$, $\beta$ ώστε οι $f(x) = \alpha x + 3$ και $g(x) = 2x + \beta$, $x \in \mathbb{R}$, να είναι ίσες.`,
      fields: [{ label: "α =", ans: 2 }, { label: "β =", ans: 3 }],
      hint: R`Ίσες για κάθε $x$ ⇒ ίσοι συντελεστές.`,
      sol: R`$\alpha x + 3 = 2x + \beta$ για κάθε $x$: για $x = 0$ βγαίνει $\beta = 3$ και μετά $\alpha = 2$.` }
  ]
},
/* ───────────────────────────── 3.9 ───────────────────────────── */
{
  id: "3.9", unit: 3, title: "Πράξεις συναρτήσεων",
  book: "Α΄ Τεύχος §3.9",
  theory: R`
<div class="tbox"><h4>Άθροισμα, διαφορά, γινόμενο, πηλίκο</h4>
<p>Αν $f: A \to \mathbb{R}$ και $g: B \to \mathbb{R}$ με $A \cap B \ne \varnothing$:</p>
$$(f \pm g)(x) = f(x) \pm g(x) \qquad (f\cdot g)(x) = f(x)\cdot g(x), \quad x \in A \cap B$$
$$\left(\frac fg\right)(x) = \frac{f(x)}{g(x)}, \quad x \in A \cap B \ \text{ με } \ g(x) \ne 0$$</div>

<div class="tbox tip"><h4>Προσοχή</h4>
<ul><li>Αν $A \cap B = \varnothing$, οι πράξεις <b>δεν ορίζονται</b>.</li>
<li>Το πεδίο ορισμού το βρίσκουμε από τις <b>αρχικές</b> συναρτήσεις, όχι από τον απλοποιημένο τύπο. Π.χ. $f(x) = \sqrt x$, $g(x) = \frac{1}{\sqrt x}$: το $f\cdot g = 1$ ορίζεται μόνο για $x > 0$.</li></ul></div>`,
  widget: "funops",
  exercises: [
    { level: 1, type: "fields", q: R`Αν $f(x) = 2x - 5$ και $g(x) = x + 3$, να γράψετε τις $f + g$ και $f - g$ στη μορφή $\alpha x + \beta$.`,
      fields: [{ label: "f+g: α =", ans: 3 }, { label: "β =", ans: -2 }, { label: "f−g: α =", ans: 1 }, { label: "β =", ans: -8 }],
      hint: R`Προσοχή στην παρένθεση: $(2x - 5) - (x + 3)$.`,
      sol: R`$(f + g)(x) = 3x - 2$, $\ (f - g)(x) = 2x - 5 - x - 3 = x - 8$, και οι δύο με πεδίο ορισμού $\mathbb{R}$.` },
    { level: 2, type: "mc", q: R`Ορίζεται το άθροισμα των $f(x) = \sqrt x$ και $g(x) = \sqrt{-1 - x}$;`,
      options: ["Ναι, στο $\\mathbb{R}$", "Ναι, στο $[-1, 0]$", "Όχι, γιατί $A \\cap B = \\varnothing$", "Ναι, στο $[0, +\\infty)$"], correct: 2,
      hint: R`Βρες τα δύο πεδία ορισμού.`,
      sol: R`$A = [0, +\infty)$, $\ B$: $-1 - x \ge 0 \iff x \le -1$, $B = (-\infty, -1]$. Η τομή είναι κενή: δεν ορίζεται.` },
    { level: 1, type: "fields", q: R`Αν $f(x) = x^2$ και $g(x) = x - 1$, να υπολογίσετε τα $(f\cdot g)(2)$ και $\left(\frac fg\right)(3)$.`,
      fields: [{ label: "(f·g)(2) =", ans: 4 }, { label: "(f/g)(3) =", ans: "9/2" }],
      hint: R`$(f\cdot g)(2) = f(2)\cdot g(2)$.`,
      sol: R`$(f\cdot g)(2) = 4\cdot 1 = 4$, $\ \left(\frac fg\right)(3) = \frac{9}{2}$.` },
    { level: 2, type: "fields", q: R`Αν $f(x) = \sqrt{x - 1}$ και $g(x) = \sqrt{5 - x}$, το πεδίο ορισμού της $f + g$ είναι $[\kappa, \lambda]$. Να βρείτε τα $\kappa$, $\lambda$.`,
      fields: [{ label: "κ =", ans: 1 }, { label: "λ =", ans: 5 }],
      hint: R`$A \cap B$.`,
      sol: R`$A = [1, +\infty)$, $B = (-\infty, 5]$, $A \cap B = [1, 5]$.` },
    { level: 2, type: "mc", q: R`Αν $f(x) = \frac1x$ και $g(x) = x - 2$, το πεδίο ορισμού της $\frac fg$ είναι:`,
      options: ["$\\mathbb{R} - \\{0\\}$", "$\\mathbb{R} - \\{2\\}$", "$\\mathbb{R} - \\{0, 2\\}$", "$\\mathbb{R}$"], correct: 2,
      hint: R`$x \in A \cap B$ και $g(x) \ne 0$.`,
      sol: R`$A \cap B = \mathbb{R} - \{0\}$ και $g(x) \ne 0 \iff x \ne 2$. Άρα $\mathbb{R} - \{0, 2\}$.` },
    { level: 3, type: "mc", q: R`Δίνονται $f(x) = \dfrac{4x}{x^2 - 25}$ και $g(x) = 1 - \dfrac{7}{x + 2}$. Το πεδίο ορισμού της $\frac fg$ είναι:`,
      options: ["$\\mathbb{R} - \\{-5, 5\\}$", "$\\mathbb{R} - \\{-5, -2, 5\\}$", "$\\mathbb{R} - \\{-2\\}$", "$\\mathbb{R} - \\{-5, -2, 0, 5\\}$"], correct: 1,
      hint: R`$g(x) = \frac{x - 5}{x + 2}$. Πότε μηδενίζεται;`,
      sol: R`$A = \mathbb{R} - \{\pm 5\}$, $B = \mathbb{R} - \{-2\}$. $g(x) = 0 \iff x = 5$ (ήδη εξαιρείται). Άρα $\mathbb{R} - \{-5, -2, 5\}$, και εκεί $\left(\frac fg\right)(x) = \frac{4x(x + 2)}{(x - 5)^2(x + 5)}$.` },
    { level: 2, type: "mc", q: R`Αν $f(x) = 2x + 4$, $x \in [0, 3]$ και $g(x) = 3x$, $x \in [4, 7]$, τότε η $f + g$:`,
      options: ["ορίζεται στο $[0, 7]$", "ορίζεται στο $[3, 4]$", "δεν ορίζεται", "ορίζεται στο $\\mathbb{R}$"], correct: 2,
      hint: R`Τομή πεδίων ορισμού.`,
      sol: R`$[0, 3] \cap [4, 7] = \varnothing$, άρα ούτε η $f + g$ ούτε η $\frac fg$ ορίζονται.` },
    { level: 1, type: "mc", q: R`Οι συναρτήσεις $f - g$ και $f\cdot g$ έχουν πάντα το ίδιο πεδίο ορισμού.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Ποιο είναι το πεδίο ορισμού καθεμιάς;`,
      sol: R`Και οι δύο ορίζονται στο $A \cap B$. (Το πηλίκο είναι αυτό που μπορεί να έχει μικρότερο πεδίο ορισμού.)` }
  ]
},
/* ───────────────────────────── 3.10 ───────────────────────────── */
{
  id: "3.10", unit: 3, title: "Σύνθεση συναρτήσεων",
  book: "Α΄ Τεύχος §3.10 · Δραστηριότητες σελ. 148–149",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Αν $f: A \to \mathbb{R}$ και $g: B \to \mathbb{R}$, η <b>σύνθεση</b> $g\circ f$ είναι η συνάρτηση</p>
$$(g\circ f)(x) = g(f(x)), \qquad x \in A \text{ με } f(x) \in B$$
<p>«Πρώτα εφαρμόζουμε την $f$, μετά την $g$». Ορίζεται μόνο αν το σύνολο αυτό δεν είναι κενό.</p></div>

<div class="tbox tip"><h4>Προσοχή</h4>
<ul><li>Γενικά $f\circ g \ne g\circ f$ (η σύνθεση δεν είναι αντιμεταθετική). Π.χ. $f(x) = x^2 + 1$, $g(x) = 3x - 4$: $(f\circ g)(x) = (3x - 4)^2 + 1$, $(g\circ f)(x) = 3x^2 - 1$.</li>
<li>Πεδίο ορισμού της $g\circ f$: οι περιορισμοί της $f$ <b>και</b> ότι το $f(x)$ ανήκει στο πεδίο ορισμού της $g$. Π.χ. $f(x) = 2x - 1$, $g(x) = \sqrt x$: $(g\circ f)(x) = \sqrt{2x - 1}$, $x \ge \frac12$.</li>
<li>Αν $f$ με πεδίο ορισμού $A$, τότε η $f(x + 1)$ ορίζεται όταν $x + 1 \in A$.</li></ul></div>`,
  widget: "compose",
  gen: "gcomp",
  exercises: [
    { level: 1, type: "fields", q: R`(α) Αν $f(x) = x + 5$ και $g(x) = |x|$, να υπολογίσετε το $(g\circ f)(-6)$. (β) Αν $f(x) = \text{ημ}x$ και $g(x) = 3x^2$, να υπολογίσετε τα $(g\circ f)\left(\frac\pi4\right)$ και $(f\circ g)(0)$.`,
      fields: [{ label: "(α) =", ans: 1 }, { label: "(g∘f)(π/4) =", ans: "3/2" }, { label: "(f∘g)(0) =", ans: 0 }],
      hint: R`Πρώτα η εσωτερική συνάρτηση.`,
      sol: R`(α) $g(f(-6)) = g(-1) = 1$. (β) $g\left(\frac{\sqrt2}{2}\right) = 3\cdot\frac12 = \frac32$, $\ f(g(0)) = \text{ημ}0 = 0$.` },
    { level: 2, type: "expr", label: "(f∘g)(x) =", q: R`Δίνονται $f(x) = x^2 + 1$ και $g(x) = 3x - 4$. Να βρείτε την $f\circ g$.`,
      ref: "(3x-4)^2+1", key: "9x^2-24x+17",
      hint: R`Βάλε το $g(x)$ στη θέση του $x$ στον τύπο της $f$.`,
      sol: R`$(f\circ g)(x) = (3x - 4)^2 + 1 = 9x^2 - 24x + 17$. (Ενώ $(g\circ f)(x) = 3x^2 - 1$: διαφορετικές.)` },
    { level: 1, type: "fields", q: R`Αν $f(x) = 2x - 1$ και $g(x) = \sqrt x$, το πεδίο ορισμού της $g\circ f$ είναι $[\kappa, +\infty)$. Να βρείτε το $\kappa$.`,
      fields: [{ label: "κ =", ans: "1/2" }],
      hint: R`Πρέπει $f(x) \ge 0$.`,
      sol: R`$2x - 1 \ge 0 \iff x \ge \frac12$, και $(g\circ f)(x) = \sqrt{2x - 1}$.` },
    { level: 2, type: "mc", q: R`Αν $f(x) = \sqrt{1 - x}$ και $g(x) = 3x^2 + 2$, η $f\circ g$:`,
      options: ["δεν ορίζεται", "ορίζεται στο $\\mathbb{R}$", "ορίζεται στο $[-1, 1]$", "ορίζεται για $x \\le 1$"], correct: 0,
      hint: R`Πρέπει $g(x) \le 1$.`,
      sol: R`$1 - (3x^2 + 2) = -1 - 3x^2 < 0$ για κάθε $x$, άρα η $f(g(x))$ δεν ορίζεται πουθενά.` },
    { level: 1, type: "mc", q: R`Αν $f(x) = \frac1x$, $x \ne 0$, τότε $(f\circ f)(x) = $`,
      options: ["$x$, $x \\ne 0$", "$\\frac{1}{x^2}$", "$1$", "$\\frac2x$"], correct: 0,
      hint: R`$f\left(\frac1x\right)$.`,
      sol: R`$f\left(\frac1x\right) = \frac{1}{1/x} = x$, για $x \ne 0$.` },
    { level: 3, type: "expr", label: "g(x) =", q: R`Αν $f(x) = 2x - 1$ και $(f\circ g)(x) = x^2 - 2x + 3$, να βρείτε τον τύπο της $g$.`,
      ref: "(x^2-2x+4)/2", key: "(x^2-2x+4)/2",
      hint: R`$2g(x) - 1 = x^2 - 2x + 3$.`,
      sol: R`$f(g(x)) = 2g(x) - 1 = x^2 - 2x + 3 \Rightarrow g(x) = \frac{x^2 - 2x + 4}{2}$.` },
    { level: 1, type: "mc", q: R`Για $f(x) = 2x + 3$ και $g(x) = 4x + 9$ ισχύει $f\circ g = g\circ f$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Υπολόγισε και τις δύο.`,
      sol: R`$(f\circ g)(x) = 2(4x + 9) + 3 = 8x + 21$, $\ (g\circ f)(x) = 4(2x + 3) + 9 = 8x + 21$. Ίσες (ειδική περίπτωση).` },
    { level: 2, type: "fields", q: R`Δίνεται $f(x) = 3x + 4$, $x \in [1, 16)$. Η $g(x) = f(x + 1)$ έχει πεδίο ορισμού $[\kappa, \lambda)$. Να βρείτε τα $\kappa$, $\lambda$.`,
      fields: [{ label: "κ =", ans: 0 }, { label: "λ =", ans: 15 }],
      hint: R`$1 \le x + 1 < 16$.`,
      sol: R`$0 \le x < 15$ και $g(x) = 3(x + 1) + 4 = 3x + 7$.` },
    { level: 3, type: "mc", q: R`Αν η $f$ έχει πεδίο ορισμού $[1, 6)$, η $f(x^2 - 3)$ έχει πεδίο ορισμού:`,
      options: ["$(-3, -2] \\cup [2, 3)$", "$[2, 3)$", "$[4, 9)$", "$[-3, 3]$"], correct: 0,
      hint: R`$1 \le x^2 - 3 < 6$.`,
      sol: R`$4 \le x^2 < 9 \iff 2 \le |x| < 3 \iff x \in (-3, -2] \cup [2, 3)$.` }
  ]
},
/* ───────────────────────────── 3.11 ───────────────────────────── */
{
  id: "3.11", unit: 3, title: "Συναρτήσεις 1–1 – Συναρτήσεις επί",
  book: "Α΄ Τεύχος §3.11 · Δραστηριότητες σελ. 155–156",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Μια συνάρτηση $f: A \to \mathbb{R}$ λέγεται <b>1–1</b> (ένα προς ένα) όταν διαφορετικά $x$ δίνουν διαφορετικές τιμές:</p>
$$x_1 \ne x_2 \Rightarrow f(x_1) \ne f(x_2) \qquad\text{ισοδύναμα}\qquad f(x_1) = f(x_2) \Rightarrow x_1 = x_2$$</div>

<div class="tbox"><h4>Πώς το ελέγχουμε</h4>
<ul><li><b>Αλγεβρικά:</b> υποθέτουμε $f(x_1) = f(x_2)$ και δείχνουμε $x_1 = x_2$. Π.χ. $3x_1 - 2 = 3x_2 - 2 \Rightarrow x_1 = x_2$.</li>
<li><b>Γραφικά:</b> κάθε <b>οριζόντια</b> ευθεία τέμνει τη γραφική παράσταση σε <b>το πολύ ένα</b> σημείο.</li>
<li><b>Αντιπαράδειγμα</b> για να δείξουμε ότι <b>δεν</b> είναι 1–1: δύο διαφορετικά $x$ με ίδια τιμή, π.χ. $f(x) = x^2$: $f(-1) = f(1)$.</li>
<li>Κάθε <b>γνησίως μονότονη</b> συνάρτηση είναι 1–1.</li></ul></div>

<div class="tbox tip"><h4>Το πεδίο ορισμού μετράει</h4>
<p>Η $f(x) = x^2$ δεν είναι 1–1 στο $\mathbb{R}$, είναι όμως 1–1 στο $[0, +\infty)$ (εκεί είναι γνησίως αύξουσα).</p></div>
<div class="tbox"><h4>Συναρτήσεις «επί»</h4>
<p>Μια συνάρτηση $f: A \to B$ λέγεται <b>επί</b> του $B$ όταν <b>κάθε</b> στοιχείο του $B$ είναι εικόνα κάποιου $x \in A$, δηλαδή όταν $f(A) = B$. Π.χ. η $f: \mathbb{R} \to \mathbb{R}$, $f(x) = x^3$ είναι επί, ενώ η $f: \mathbb{R} \to \mathbb{R}$, $f(x) = x^2$ δεν είναι (δεν παίρνει αρνητικές τιμές). Κάθε συνάρτηση είναι επί του συνόλου τιμών της.</p></div>`,
  widget: "hline",
  gen: "g11",
  exercises: [
    { level: 1, type: "mc", q: R`Η συνάρτηση $f(x) = 3x - 2$, $x \in \mathbb{R}$, είναι 1–1;`,
      options: ["Ναι", "Όχι"], correct: 0,
      hint: R`Υπόθεσε $f(x_1) = f(x_2)$.`,
      sol: R`$3x_1 - 2 = 3x_2 - 2 \Rightarrow 3x_1 = 3x_2 \Rightarrow x_1 = x_2$. Είναι 1–1.` },
    { level: 1, type: "mc", q: R`Η συνάρτηση $g(x) = x^2 + 2$, $x \in \mathbb{R}$, είναι 1–1;`,
      options: ["Ναι", "Όχι"], correct: 1,
      hint: R`Δοκίμασε αντίθετους αριθμούς.`,
      sol: R`$g(-1) = g(1) = 3$ με $-1 \ne 1$: δεν είναι 1–1.` },
    { level: 1, type: "mc", q: R`Η $f(x) = x^2$ με πεδίο ορισμού το $(0, 3]$ είναι 1–1.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Στο $(0, 3]$ υπάρχουν αντίθετοι αριθμοί;`,
      sol: R`Για $0 < x_1 < x_2$ ισχύει $x_1^2 < x_2^2$: γνησίως αύξουσα, άρα 1–1.` },
    { level: 1, type: "mc", q: R`Η $f(x) = x^2$ με πεδίο ορισμού το $(-3, 3]$ είναι 1–1.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τώρα το διάστημα περιέχει αντίθετους αριθμούς.`,
      sol: R`$f(-2) = f(2) = 4$, άρα δεν είναι 1–1.` },
    { level: 2, type: "mc", q: R`Η συνάρτηση $f(x) = x^3 - x$, $x \in \mathbb{R}$:`,
      options: ["είναι 1–1, γιατί είναι πολυωνυμική", "δεν είναι 1–1, γιατί $f(0) = f(1)$", "είναι 1–1, γιατί $x^3$ είναι 1–1", "δεν είναι 1–1, γιατί $f(0) = 0$"], correct: 1,
      hint: R`Βρες τις ρίζες της $f(x) = 0$.`,
      sol: R`$x^3 - x = x(x - 1)(x + 1)$: $f(-1) = f(0) = f(1) = 0$. Τρία διαφορετικά $x$ με την ίδια τιμή — δεν είναι 1–1.` },
    { level: 2, type: "fields", q: R`Η $f(x) = \dfrac{2x + 1}{x - 3}$, $x \ne 3$, είναι 1–1. Να βρείτε το <b>μοναδικό</b> $x$ για το οποίο $f(x) = 3$.`,
      fields: [{ label: "x =", ans: 10 }],
      hint: R`$2x + 1 = 3(x - 3)$.`,
      sol: R`$2x + 1 = 3x - 9 \Rightarrow x = 10$ (και $10 \ne 3$).` },
    { level: 2, type: "fields", q: R`Η $f$ είναι 1–1 και ισχύει $f(2\alpha - 1) = f(5)$. Να βρείτε το $\alpha$.`,
      fields: [{ label: "α =", ans: 3 }],
      hint: R`$f(x_1) = f(x_2) \Rightarrow x_1 = x_2$.`,
      sol: R`Αφού η $f$ είναι 1–1: $2\alpha - 1 = 5 \Rightarrow \alpha = 3$.` },
    { level: 3, type: "mc", q: R`Ποια από τις πιο κάτω συναρτήσεις <b>δεν</b> είναι 1–1;`,
      options: ["$f(x) = \\frac1x$, $x \\ne 0$", "$f(x) = x^3$", "$f(x) = \\text{ημ}x$, $x \\in \\mathbb{R}$", "$f(x) = 2x + 5$"], correct: 2,
      hint: R`Η συνάρτηση $\text{ημ}x$ είναι περιοδική.`,
      sol: R`$\text{ημ}0 = \text{ημ}\pi = 0$: δεν είναι 1–1. Οι $\frac1x$, $x^3$, $2x + 5$ περνούν το κριτήριο οριζόντιας ευθείας.` },
{ level: 1, type: "mc", q: R`Η συνάρτηση $f: \mathbb{R} \to \mathbb{R}$ με $f(x) = x^3$ είναι επί.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Για κάθε $y \in \mathbb{R}$ υπάρχει $x$ με $x^3 = y$;`,
      sol: R`Για κάθε $y$ η $x = \sqrt[3]{y}$ (με το κατάλληλο πρόσημο) δίνει $f(x) = y$, άρα $f(\mathbb{R}) = \mathbb{R}$: επί.` },
    { level: 1, type: "mc", q: R`Η συνάρτηση $f: \mathbb{R} \to (-\infty, 0]$ με $f(x) = -x^2$ είναι επί.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Ποιο είναι το σύνολο τιμών της;`,
      sol: R`Για $y \le 0$: $-x^2 = y \iff x = \pm\sqrt{-y}$. Άρα $f(\mathbb{R}) = (-\infty, 0]$: επί.` },
    { level: 2, type: "mc", q: R`Αν οι $f$ και $g$ είναι 1–1, τότε και η $f + g$ είναι 1–1.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Δοκίμασε $f(x) = x$ και $g(x) = -x$.`,
      sol: R`Με $f(x) = x$, $g(x) = -x$ (και οι δύο 1–1) έχουμε $f + g = 0$, σταθερή — δεν είναι 1–1.` },
    { level: 2, type: "mc", q: R`Η $f(x) = 2 + \sqrt{x + 1}$, $x \ge -1$:`,
      options: ["είναι 1–1", "δεν είναι 1–1", "δεν είναι συνάρτηση"], correct: 0,
      hint: R`$f(x_1) = f(x_2) \Rightarrow \sqrt{x_1 + 1} = \sqrt{x_2 + 1}$.`,
      sol: R`$\sqrt{x_1 + 1} = \sqrt{x_2 + 1} \Rightarrow x_1 + 1 = x_2 + 1 \Rightarrow x_1 = x_2$: είναι 1–1.` }
  ]
},
/* ───────────────────────────── 3.12 ───────────────────────────── */
{
  id: "3.12", unit: 3, title: "Αντίστροφη συνάρτηση",
  book: "Α΄ Τεύχος §3.12 · Δραστηριότητες σελ. 166",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Αν η $f: A \to \mathbb{R}$ είναι <b>1–1</b>, τότε για κάθε $y \in f(A)$ υπάρχει <b>μοναδικό</b> $x \in A$ με $f(x) = y$. Η αντιστοιχία $y \mapsto x$ είναι η <b>αντίστροφη</b> $f^{-1}: f(A) \to A$:</p>
$$f^{-1}(y) = x \iff f(x) = y$$
<p>Ισχύουν $f^{-1}(f(x)) = x$ για $x \in A$ και $f(f^{-1}(y)) = y$ για $y \in f(A)$.</p></div>

<div class="tbox"><h4>Εύρεση</h4>
<ol><li>Ελέγχουμε ότι η $f$ είναι 1–1.</li>
<li>Λύνουμε την $y = f(x)$ ως προς $x$· οι τιμές του $y$ για τις οποίες βρίσκουμε $x \in A$ δίνουν το $f(A)$.</li>
<li>Γράφουμε $f^{-1}(x)$ (αλλάζουμε το όνομα της μεταβλητής).</li></ol>
<p>Π.χ. $f(x) = \frac{2x - 1}{x + 3}$: $y(x + 3) = 2x - 1 \Rightarrow x = \frac{3y + 1}{2 - y}$, άρα $f^{-1}(x) = \frac{3x + 1}{2 - x}$, $x \ne 2$.</p></div>

<div class="tbox tip"><h4>Γραφική παράσταση</h4>
<p>Οι $C_f$ και $C_{f^{-1}}$ είναι <b>συμμετρικές ως προς την ευθεία $y = x$</b>.</p></div>`,
  widget: "inverse",
  gen: "ginv",
  exercises: [
    { level: 1, type: "expr", label: "f⁻¹(x) =", pos: true, q: R`Να βρείτε την αντίστροφη της $f: [0, +\infty) \to [0, +\infty)$, $f(x) = x^2$.`,
      ref: "sqrt(x)", key: "sqrt(x)",
      hint: R`Λύσε $y = x^2$ με $x \ge 0$.`,
      sol: R`$x = \sqrt y$ (αφού $x \ge 0$), άρα $f^{-1}(x) = \sqrt x$, $x \ge 0$.` },
    { level: 2, type: "expr", label: "f⁻¹(x) =", q: R`Να βρείτε την αντίστροφη της $f(x) = \dfrac{2x - 1}{x + 3}$, $x \ne -3$.`,
      ref: "(3x+1)/(2-x)", key: "(3x+1)/(2-x)",
      hint: R`$y(x + 3) = 2x - 1$.`,
      sol: R`$xy + 3y = 2x - 1 \Rightarrow x(y - 2) = -1 - 3y \Rightarrow x = \frac{3y + 1}{2 - y}$, $y \ne 2$. Άρα $f^{-1}(x) = \frac{3x + 1}{2 - x}$, $x \ne 2$.` },
    { level: 2, type: "expr", label: "f⁻¹(x) =", pos: true, q: R`Να βρείτε την αντίστροφη της $f(x) = \sqrt{x + 2}$, $x \ge -2$.`,
      ref: "x^2-2", key: "x^2-2",
      hint: R`Σύνολο τιμών $[0, +\infty)$.`,
      sol: R`$y = \sqrt{x + 2} \ge 0 \Rightarrow y^2 = x + 2 \Rightarrow x = y^2 - 2$. Άρα $f^{-1}(x) = x^2 - 2$, $x \ge 0$.` },
    { level: 1, type: "expr", label: "f⁻¹(x) =", q: R`Να βρείτε την αντίστροφη της $f(x) = \dfrac{1}{x - 2}$, $x \ne 2$.`,
      ref: "1/x+2", key: "1/x+2",
      hint: R`$x - 2 = \frac1y$.`,
      sol: R`$x = 2 + \frac1y$, $y \ne 0$: $f^{-1}(x) = \frac1x + 2$, $x \ne 0$.` },
    { level: 3, type: "expr", label: "f⁻¹(x) =", pos: true, q: R`Να βρείτε την αντίστροφη της $f(x) = x^2 - 4x + 3$, $x \in [2, +\infty)$.`,
      ref: "2+sqrt(x+1)", key: "2+sqrt(x+1)",
      hint: R`$f(x) = (x - 2)^2 - 1$ και $x - 2 \ge 0$.`,
      sol: R`$y = (x - 2)^2 - 1 \Rightarrow x - 2 = \sqrt{y + 1}$ (αφού $x \ge 2$). Άρα $f^{-1}(x) = 2 + \sqrt{x + 1}$, $x \ge -1$.` },
    { level: 2, type: "fields", q: R`Η $f: [1, +\infty) \to (0, 1]$ με $f(x) = \dfrac{2x}{x^2 + 1}$ αντιστρέφεται. Να υπολογίσετε το $f^{-1}\left(\frac45\right)$.`,
      fields: [{ label: "f⁻¹(4/5) =", ans: 2 }],
      hint: R`Λύσε $\frac{2x}{x^2 + 1} = \frac45$ με $x \ge 1$.`,
      sol: R`$10x = 4x^2 + 4 \Rightarrow 2x^2 - 5x + 2 = 0 \Rightarrow x = 2$ ή $x = \frac12$. Μόνο το $2 \ge 1$: $f^{-1}\left(\frac45\right) = 2$.` },
    { level: 1, type: "fields", q: R`Για την $f(x) = x^3 + 1$ να βρείτε τα $f^{-1}(9)$ και $f^{-1}(1)$.`,
      fields: [{ label: "f⁻¹(9) =", ans: 2 }, { label: "f⁻¹(1) =", ans: 0 }],
      hint: R`$f^{-1}(y) = x \iff f(x) = y$.`,
      sol: R`$x^3 + 1 = 9 \Rightarrow x = 2$, $\ x^3 + 1 = 1 \Rightarrow x = 0$.` },
    { level: 1, type: "mc", q: R`Αν το σημείο $(2, 5)$ ανήκει στη γραφική παράσταση της 1–1 συνάρτησης $f$, τότε στη γραφική παράσταση της $f^{-1}$ ανήκει το:`,
      options: ["$(5, 2)$", "$(2, 5)$", "$(-2, -5)$", "$\\left(\\frac12, \\frac15\\right)$"], correct: 0,
      hint: R`Συμμετρία ως προς $y = x$.`,
      sol: R`$f(2) = 5 \iff f^{-1}(5) = 2$: το $(5, 2)$.` }
  ]
},
/* ───────────────────────────── 4.2 ───────────────────────────── */
{
  id: "4.2", unit: 4, title: "Τριγωνομετρικές εξισώσεις",
  book: "Α΄ Τεύχος §4.2 · Δραστηριότητες σελ. 194–195",
  theory: R`
<div class="tbox"><h4>Γενικές λύσεις ($\kappa \in \mathbb{Z}$, $\theta$ σε ακτίνια)</h4>
<table class="mini"><tr><th>εξίσωση</th><th>λύσεις</th></tr>
<tr><td>$\text{ημ}x = \text{ημ}\theta$</td><td>$x = 2\kappa\pi + \theta$ ή $x = 2\kappa\pi + \pi - \theta$</td></tr>
<tr><td>$\text{συν}x = \text{συν}\theta$</td><td>$x = 2\kappa\pi \pm \theta$</td></tr>
<tr><td>$\text{εφ}x = \text{εφ}\theta$</td><td>$x = \kappa\pi + \theta$</td></tr>
<tr><td>$\text{σφ}x = \text{σφ}\theta$</td><td>$x = \kappa\pi + \theta$</td></tr></table>
<p>Οι $\text{ημ}x = c$, $\text{συν}x = c$ έχουν λύση μόνο αν $-1 \le c \le 1$· οι $\text{εφ}x = c$, $\text{σφ}x = c$ για κάθε $c$.</p></div>

<div class="tbox tip"><h4>Μέθοδος</h4>
<ul><li>Γράφουμε τον αριθμό ως τριγωνομετρικό αριθμό γνωστής γωνίας: $\text{ημ}x = -\frac{\sqrt3}{2} = \text{ημ}\left(-\frac\pi3\right)$.</li>
<li>Με όρισμα $\alpha x + \beta$: λύνουμε πρώτα για το όρισμα, μετά για το $x$. Π.χ. $\text{ημ}3x = \frac12 \Rightarrow 3x = 2\kappa\pi + \frac\pi6$ ή $3x = 2\kappa\pi + \frac{5\pi}{6}$.</li>
<li>Δευτεροβάθμιες: αντικατάσταση $y = \text{ημ}x$ (απορρίπτουμε $|y| > 1$).</li>
<li>Λύσεις σε διάστημα: δίνουμε τιμές στο $\kappa$.</li></ul></div>`,
  widget: "trigeq",
  gen: "gtrigeq",
  exercises: [
    { level: 1, type: "mc", q: R`Οι λύσεις της εξίσωσης $\text{ημ}x = \text{ημ}\frac\pi5$ είναι ($\kappa \in \mathbb{Z}$):`,
      options: ["$x = 2\\kappa\\pi + \\frac\\pi5$ ή $x = 2\\kappa\\pi + \\frac{4\\pi}{5}$", "$x = 2\\kappa\\pi \\pm \\frac\\pi5$", "$x = \\kappa\\pi + \\frac\\pi5$", "μόνο $x = \\frac\\pi5$"], correct: 0,
      hint: R`$\pi - \frac\pi5 = \frac{4\pi}{5}$.`,
      sol: R`$x = 2\kappa\pi + \frac\pi5$ ή $x = 2\kappa\pi + \pi - \frac\pi5 = 2\kappa\pi + \frac{4\pi}{5}$.` },
    { level: 1, type: "fields", q: R`Να λύσετε την εξίσωση $2\,\text{ημ}x + \sqrt3 = 0$ στο $[0, 2\pi)$.`,
      fields: [{ label: "x₁ =", ans: "4π/3", tol: 0.002 }, { label: "x₂ =", ans: "5π/3", tol: 0.002 }],
      hint: R`$\text{ημ}x = -\frac{\sqrt3}{2}$.`,
      sol: R`$\text{ημ}x = -\frac{\sqrt3}{2}$: στο 3ο και 4ο τεταρτημόριο, $x = \pi + \frac\pi3 = \frac{4\pi}{3}$ και $x = 2\pi - \frac\pi3 = \frac{5\pi}{3}$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τις λύσεις της $\text{ημ}3x = \frac12$ στο $\left[0, \frac\pi2\right)$.`,
      fields: [{ label: "x₁ =", ans: "π/18", tol: 0.002 }, { label: "x₂ =", ans: "5π/18", tol: 0.002 }],
      hint: R`$3x = 2\kappa\pi + \frac\pi6$ ή $3x = 2\kappa\pi + \frac{5\pi}{6}$.`,
      sol: R`$x = \frac{2\kappa\pi}{3} + \frac{\pi}{18}$ ή $x = \frac{2\kappa\pi}{3} + \frac{5\pi}{18}$. Για $\kappa = 0$: $\frac\pi{18}$, $\frac{5\pi}{18}$· για $\kappa = 1$ ξεπερνάμε το $\frac\pi2$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τις λύσεις της $\text{συν}2x = \frac{\sqrt2}{2}$ στο $[0, \pi)$.`,
      fields: [{ label: "x₁ =", ans: "π/8", tol: 0.002 }, { label: "x₂ =", ans: "7π/8", tol: 0.002 }],
      hint: R`$2x = 2\kappa\pi \pm \frac\pi4$.`,
      sol: R`$x = \kappa\pi \pm \frac\pi8$: στο $[0, \pi)$ οι $\frac\pi8$ ($\kappa = 0$) και $\pi - \frac\pi8 = \frac{7\pi}{8}$ ($\kappa = 1$).` },
    { level: 1, type: "mc", q: R`Η εξίσωση $\text{συν}4x = 3$:`,
      options: ["είναι αδύνατη", "έχει λύσεις $x = \\frac{\\kappa\\pi}{2}$", "έχει μία λύση", "έχει λύσεις $x = \\frac34 + \\kappa\\pi$"], correct: 0,
      hint: R`$-1 \le \text{συν}\theta \le 1$.`, sol: R`Αδύνατη, αφού $3 > 1$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τις λύσεις της $\text{εφ}3x = 1$ στο $[0, \pi)$.`,
      fields: [{ label: "x₁ =", ans: "π/12", tol: 0.002 }, { label: "x₂ =", ans: "5π/12", tol: 0.002 }, { label: "x₃ =", ans: "3π/4", tol: 0.002 }],
      hint: R`$3x = \kappa\pi + \frac\pi4$.`,
      sol: R`$x = \frac{\kappa\pi}{3} + \frac{\pi}{12}$: για $\kappa = 0, 1, 2$ παίρνουμε $\frac\pi{12}$, $\frac{5\pi}{12}$, $\frac{9\pi}{12} = \frac{3\pi}{4}$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την $2\,\text{ημ}^2x + \text{ημ}x - 1 = 0$ στο $[0, 2\pi)$ (τρεις λύσεις).`,
      fields: [{ label: "x₁ =", ans: "π/6", tol: 0.002 }, { label: "x₂ =", ans: "5π/6", tol: 0.002 }, { label: "x₃ =", ans: "3π/2", tol: 0.002 }],
      hint: R`Θέσε $y = \text{ημ}x$: $2y^2 + y - 1 = 0$.`,
      sol: R`$y = \frac12$ ή $y = -1$. $\text{ημ}x = \frac12$: $\frac\pi6$, $\frac{5\pi}{6}$· $\ \text{ημ}x = -1$: $\frac{3\pi}{2}$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την $2\,\text{συν}^2x + 5\,\text{συν}x - 3 = 0$ στο $[0, 2\pi)$.`,
      fields: [{ label: "x₁ =", ans: "π/3", tol: 0.002 }, { label: "x₂ =", ans: "5π/3", tol: 0.002 }],
      hint: R`$y = \text{συν}x$: $2y^2 + 5y - 3 = 0$.`,
      sol: R`$y = \frac12$ ή $y = -3$ (απορρίπτεται). $\text{συν}x = \frac12$: $x = \frac\pi3$ ή $x = \frac{5\pi}{3}$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την $\text{εφ}x = \text{σφ}x$ στο $[0, \pi)$.`,
      fields: [{ label: "x₁ =", ans: "π/4", tol: 0.002 }, { label: "x₂ =", ans: "3π/4", tol: 0.002 }],
      hint: R`$\text{εφ}^2x = 1$.`,
      sol: R`$\text{εφ}x = \frac{1}{\text{εφ}x} \Rightarrow \text{εφ}x = \pm 1$: $x = \frac\pi4$, $\frac{3\pi}{4}$.` },
    { level: 1, type: "mc", q: R`Η εξίσωση $\text{ημ}x = 0$ είναι αδύνατη.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Π.χ. $x = 0$.`, sol: R`Λάθος: $\text{ημ}x = 0 \iff x = \kappa\pi$, $\kappa \in \mathbb{Z}$.` }
  ]
},
/* ───────────────────────────── 5.3 ───────────────────────────── */
{
  id: "5.3", unit: 5, title: "Η έννοια του ορίου – Πλευρικά όρια",
  book: "Β΄ Τεύχος §5.1–5.3 · Δραστηριότητες σελ. 22",
  theory: R`
<div class="tbox"><h4>Όριο συνάρτησης</h4>
<p>Γράφουμε $\lim_{x\to x_0} f(x) = \ell$ όταν οι τιμές $f(x)$ πλησιάζουν όσο θέλουμε τον αριθμό $\ell$, καθώς το $x$ πλησιάζει το $x_0$ (με $x \ne x_0$), <b>από οποιαδήποτε πλευρά</b>.</p>
<p>Το όριο εξαρτάται από τις τιμές <b>κοντά</b> στο $x_0$ — όχι από την τιμή $f(x_0)$, που μπορεί να είναι διαφορετική ή να μην υπάρχει.</p></div>

<div class="tbox"><h4>Πλευρικά όρια</h4>
<ul><li>$\lim_{x\to x_0^-} f(x)$: το $x$ πλησιάζει από <b>αριστερά</b> ($x < x_0$).</li>
<li>$\lim_{x\to x_0^+} f(x)$: το $x$ πλησιάζει από <b>δεξιά</b> ($x > x_0$).</li></ul>
$$\lim_{x\to x_0} f(x) = \ell \iff \lim_{x\to x_0^-} f(x) = \lim_{x\to x_0^+} f(x) = \ell$$
<p>Αν τα πλευρικά όρια είναι διαφορετικά (ή κάποιο δεν υπάρχει), το όριο <b>δεν υπάρχει</b>.</p></div>

<div class="tbox tip"><h4>Συναρτήσεις πολλαπλού τύπου</h4>
<p>Για $f(x) = \begin{cases} g(x), & x < x_0 \\ h(x), & x > x_0\end{cases}$ υπολογίζουμε το αριστερό όριο με τον τύπο $g$ και το δεξί με τον τύπο $h$.</p></div>
<div class="tbox tip"><h4>Σημείωση για το Β΄ Κατεύθυνσης</h4>
<p><b>Διαστήματα – περιοχή:</b> περιοχή του $x_0$ με ακτίνα $\delta > 0$ λέγεται το ανοικτό διάστημα $(x_0 - \delta, x_0 + \delta) = \{x : |x - x_0| < \delta\}$. Όταν λέμε «κοντά στο $x_0$» εννοούμε σε κάποια περιοχή του $x_0$.</p>
<p>Οι αυστηροί ορισμοί του ορίου με $\varepsilon > 0$ και $\delta > 0$ είναι εκτός ύλης. Αν η $f$ ορίζεται μόνο από τη μία πλευρά του $x_0$ (π.χ. για $x > 3$), τότε το όριο στο $x_0$ είναι το αντίστοιχο πλευρικό όριο.</p></div>`,
  widget: "limit",
  gen: "gside",
  exercises: [
    { level: 1, type: "mc", q: R`Για μια συνάρτηση $f$ ισχύουν $\lim_{x\to 2^-} f(x) = 3$, $\lim_{x\to 2^+} f(x) = 4$, $\lim_{x\to -2^-} f(x) = 3$ και $\lim_{x\to -2^+} f(x) = 3$. Ποιο ισχύει;`,
      options: ["Το $\\lim_{x\\to 2} f(x)$ δεν υπάρχει και $\\lim_{x\\to -2} f(x) = 3$", "$\\lim_{x\\to 2} f(x) = 4$ και $\\lim_{x\\to -2} f(x) = 3$", "Κανένα από τα δύο όρια δεν υπάρχει", "$\\lim_{x\\to 2} f(x) = 3{,}5$"], correct: 0,
      hint: R`Σύγκρινε τα πλευρικά όρια σε κάθε σημείο.`,
      sol: R`Στο $2$: $3 \ne 4$, άρα το όριο δεν υπάρχει. Στο $-2$: και τα δύο πλευρικά όρια είναι $3$, άρα $\lim_{x\to -2} f(x) = 3$.` },
    { level: 2, type: "fields", q: R`Τα πλευρικά όρια μιας συνάρτησης στο $\alpha$ είναι $\lim_{x\to\alpha^+} f(x) = 3$ και $\lim_{x\to\alpha^-} f(x) = 4 - \kappa^2$. Να βρείτε τις τιμές του $\kappa$ για τις οποίες υπάρχει το όριο στο $\alpha$.`,
      fields: [{ label: "κ₁ (μικρότερη) =", ans: -1 }, { label: "κ₂ =", ans: 1 }],
      hint: R`$4 - \kappa^2 = 3$.`,
      sol: R`$\kappa^2 = 1 \Rightarrow \kappa = \pm 1$.` },
    { level: 3, type: "fields", q: R`Για μια συνάρτηση $f: \mathbb{R} \to \mathbb{R}$ ισχύουν $\lim_{x\to 1^-} f(x) = \alpha + 3$, $\lim_{x\to 1^+} f(x) = \beta + 2$, $\lim_{x\to 2^-} f(x) = 2\alpha + 1$, $\lim_{x\to 2^+} f(x) = 3\beta - 4$. Να βρείτε τα $\alpha$, $\beta$ ώστε να υπάρχουν τα όρια στο $1$ και στο $2$.`,
      fields: [{ label: "α =", ans: 2 }, { label: "β =", ans: 3 }],
      hint: R`Δύο εξισώσεις: $\alpha + 3 = \beta + 2$ και $2\alpha + 1 = 3\beta - 4$.`,
      sol: R`Από την πρώτη $\alpha = \beta - 1$. Τότε $2\beta - 2 + 1 = 3\beta - 4 \Rightarrow \beta = 3$, $\alpha = 2$.` },
    { level: 1, type: "mc", q: R`Δίνεται $f(x) = \begin{cases} x + 1, & x < 1 \\ x + 2, & x \ge 1\end{cases}$. Το $\lim_{x\to 1} f(x)$:`,
      options: ["είναι $2$", "είναι $3$", "δεν υπάρχει", "είναι $2{,}5$"], correct: 2,
      hint: R`Αριστερό όριο με τον 1ο τύπο, δεξί με τον 2ο.`,
      sol: R`$\lim_{x\to 1^-} f(x) = 2$, $\lim_{x\to 1^+} f(x) = 3$. Διαφορετικά, άρα το όριο δεν υπάρχει (παρόλο που $f(1) = 3$).` },
    { level: 1, type: "fields", q: R`Δίνεται $f(x) = x^2$ για $x \ne 2$ και $f(2) = 1$. Να βρείτε το $\lim_{x\to 2} f(x)$ και την τιμή $f(2)$.`,
      fields: [{ label: "όριο =", ans: 4 }, { label: "f(2) =", ans: 1 }],
      hint: R`Κοντά στο $2$ (με $x \ne 2$) ισχύει $f(x) = x^2$.`,
      sol: R`$\lim_{x\to 2} f(x) = \lim_{x\to 2} x^2 = 4$, ενώ $f(2) = 1$. Το όριο δεν «βλέπει» την τιμή στο ίδιο το σημείο.` },
    { level: 2, type: "fields", q: R`Δίνεται $f(x) = \begin{cases} 2x + \kappa, & x < 1 \\ x^2 + 3, & x > 1\end{cases}$. Να βρείτε το $\kappa$ ώστε να υπάρχει το $\lim_{x\to 1} f(x)$, και το όριο.`,
      fields: [{ label: "κ =", ans: 2 }, { label: "όριο =", ans: 4 }],
      hint: R`Αριστερό όριο $2 + \kappa$, δεξί $4$.`,
      sol: R`$2 + \kappa = 4 \Rightarrow \kappa = 2$, και τότε $\lim_{x\to 1} f(x) = 4$.` },
    { level: 1, type: "mc", q: R`Αν $\lim_{x\to 3} f(x) = 5$, τότε απαραίτητα $f(3) = 5$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Σκέψου την $f(x) = x^2$, $x \ne 2$, $f(2) = 1$.`,
      sol: R`Λάθος: το όριο αφορά τιμές κοντά στο $3$. Η $f(3)$ μπορεί να είναι διαφορετική ή η $f$ να μην ορίζεται καν στο $3$.` },
    { level: 2, type: "fields", q: R`Για την $f(x) = \dfrac{x^2 - 1}{x - 1}$ να υπολογίσετε τα $f(0{,}99)$ και $f(1{,}01)$ και να μαντέψετε το $\lim_{x\to 1} f(x)$.`,
      fields: [{ label: "f(0,99) =", ans: 1.99 }, { label: "f(1,01) =", ans: 2.01 }, { label: "όριο =", ans: 2 }],
      hint: R`Για $x \ne 1$: $f(x) = x + 1$.`,
      sol: R`$f(x) = x + 1$ για $x \ne 1$, άρα $f(0{,}99) = 1{,}99$, $f(1{,}01) = 2{,}01$ και $\lim_{x\to 1} f(x) = 2$ (η $f$ δεν ορίζεται στο $1$).` },
{ level: 1, type: "fields", q: R`Η περιοχή του $x_0 = 3$ με ακτίνα $\delta = 0{,}5$ είναι το διάστημα $(\kappa, \lambda)$. Να βρείτε τα $\kappa$, $\lambda$.`,
      fields: [{ label: "κ =", ans: 2.5 }, { label: "λ =", ans: 3.5 }],
      hint: R`$(x_0 - \delta, x_0 + \delta)$, δηλαδή $|x - 3| < 0{,}5$.`,
      sol: R`$(3 - 0{,}5,\ 3 + 0{,}5) = (2{,}5;\ 3{,}5)$ — τα $x$ με $|x - 3| < 0{,}5$.` },
    { level: 2, type: "mc", q: R`Αν $f(x) = \begin{cases} x + 2, & x \ge 3 \\ 7 - x, & x < 3\end{cases}$, τότε ισχύει $\lim_{x\to 3^+} f(x) = \lim_{x\to 3} f(x)$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Υπάρχει το $\lim_{x\to 3} f(x)$;`,
      sol: R`$\lim_{x\to 3^+} f(x) = 5$ και $\lim_{x\to 3^-} f(x) = 4$, άρα το $\lim_{x\to 3} f(x)$ δεν υπάρχει.` },
    { level: 2, type: "mc", q: R`Η $f$ ορίζεται μόνο για $x > 3$ και $\lim_{x\to 3^+} f(x) = 5$. Τότε $\lim_{x\to 3} f(x) = 5$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Από αριστερά δεν υπάρχουν τιμές της $f$.`,
      sol: R`Αφού η $f$ ορίζεται μόνο δεξιά του $3$, το όριο στο $3$ ταυτίζεται με το δεξί πλευρικό όριο: $5$.` }
  ]
},
/* ───────────────────────────── 5.4 ───────────────────────────── */
{
  id: "5.4", unit: 5, title: "Ιδιότητες ορίων – Όρια ρητών συναρτήσεων",
  book: "Β΄ Τεύχος §5.4 · Δραστηριότητες σελ. 27–28",
  theory: R`
<div class="tbox"><h4>Αντικατάσταση</h4>
<ul><li>Πολυώνυμο $P(x)$: $\displaystyle\lim_{x\to\alpha} P(x) = P(\alpha)$.</li>
<li>Ρητή $f(x) = \frac{P(x)}{Q(x)}$ με $Q(\alpha) \ne 0$: $\displaystyle\lim_{x\to\alpha} f(x) = \frac{P(\alpha)}{Q(\alpha)}$.</li></ul></div>

<div class="tbox tip"><h4>Μορφή $\frac00$</h4>
<p>Αν $P(\alpha) = Q(\alpha) = 0$, και τα δύο πολυώνυμα έχουν παράγοντα $(x - \alpha)$. <b>Παραγοντοποιούμε</b>, <b>απλοποιούμε</b> (επιτρέπεται, αφού $x \ne \alpha$) και μετά αντικαθιστούμε:</p>
$$\lim_{x\to 3}\frac{x^2 - 9}{x - 3} = \lim_{x\to 3}\frac{(x - 3)(x + 3)}{x - 3} = \lim_{x\to 3}(x + 3) = 6$$
<p>Χρήσιμες ταυτότητες: $x^2 - \alpha^2 = (x - \alpha)(x + \alpha)$, $\ x^3 \pm \alpha^3 = (x \pm \alpha)(x^2 \mp \alpha x + \alpha^2)$, τριώνυμο: $\alpha x^2 + \beta x + \gamma = \alpha(x - \rho_1)(x - \rho_2)$.</p></div>
<div class="tbox"><h4>Ιδιότητες ορίων</h4>
<p>Αν $\lim_{x\to x_0} f(x) = \ell_1$ και $\lim_{x\to x_0} g(x) = \ell_2$, τότε: $\lim(f \pm g) = \ell_1 \pm \ell_2$, $\ \lim(\kappa f) = \kappa\ell_1$, $\ \lim(fg) = \ell_1\ell_2$, $\ \lim\frac fg = \frac{\ell_1}{\ell_2}$ ($\ell_2 \ne 0$), $\ \lim|f| = |\ell_1|$, $\ \lim f^\nu = \ell_1^\nu$, $\ \lim\sqrt[\nu]{f} = \sqrt[\nu]{\ell_1}$ ($f \ge 0$ κοντά στο $x_0$).</p>
<p><b>Ρίζες σε μορφή $\frac00$:</b> πολλαπλασιάζουμε με τη <b>συζυγή</b> παράσταση: $\frac{\sqrt x - 1}{x - 1} = \frac{x - 1}{(x - 1)(\sqrt x + 1)} = \frac{1}{\sqrt x + 1} \to \frac12$.</p></div>`,
  gen: "glim",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε: (α) $\lim_{x\to 1}(x^7 - 2x^3 + 1)$, (β) $\lim_{x\to 3}(x^3 - 3x^2 + 9x)$.`,
      fields: [{ label: "(α) =", ans: 0 }, { label: "(β) =", ans: 27 }],
      hint: R`Πολυώνυμα: απλή αντικατάσταση.`,
      sol: R`(α) $1 - 2 + 1 = 0$. (β) $27 - 27 + 27 = 27$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε: (α) $\lim_{x\to 2}\dfrac{x - 1}{x + 3}$, (β) $\lim_{x\to 3}\dfrac{x^2 - 2x}{x + 1}$.`,
      fields: [{ label: "(α) =", ans: "1/5" }, { label: "(β) =", ans: "3/4" }],
      hint: R`Ο παρονομαστής δεν μηδενίζεται.`,
      sol: R`(α) $\frac{1}{5}$. (β) $\frac{9 - 6}{4} = \frac34$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το $\lim_{x\to 0}\dfrac{6x - 9}{x^3 - 12x + 3}$.`,
      fields: [{ label: "όριο =", ans: -3 }],
      hint: R`Στο $0$ ο παρονομαστής είναι $3$.`,
      sol: R`$\frac{-9}{3} = -3$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε: (α) $\lim_{x\to 3}\dfrac{x^2 - 9}{x - 3}$, (β) $\lim_{x\to -1}\dfrac{x^2 - 1}{x + 1}$.`,
      fields: [{ label: "(α) =", ans: 6 }, { label: "(β) =", ans: -2 }],
      hint: R`Μορφή $\frac00$: διαφορά τετραγώνων.`,
      sol: R`(α) $\lim(x + 3) = 6$. (β) $\frac{(x - 1)(x + 1)}{x + 1} = x - 1 \to -2$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\lim_{x\to 0}\dfrac{x^3}{x^3 + x}$.`,
      fields: [{ label: "όριο =", ans: 0 }],
      hint: R`Βγάλε κοινό παράγοντα το $x$ στον παρονομαστή.`,
      sol: R`$\frac{x^3}{x(x^2 + 1)} = \frac{x^2}{x^2 + 1}$ για $x \ne 0$, άρα το όριο είναι $\frac{0}{1} = 0$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\lim_{x\to -2}\dfrac{x^3 + 8}{x + 2}$.`,
      fields: [{ label: "όριο =", ans: 12 }],
      hint: R`$x^3 + 8 = (x + 2)(x^2 - 2x + 4)$.`,
      sol: R`$\lim_{x\to -2}(x^2 - 2x + 4) = 4 + 4 + 4 = 12$.` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε το $\lim_{x\to -2}\dfrac{x^2 + 3x + 2}{x^2 + x - 2}$.`,
      fields: [{ label: "όριο =", ans: "1/3" }],
      hint: R`Και τα δύο τριώνυμα έχουν ρίζα το $-2$.`,
      sol: R`$\frac{(x + 1)(x + 2)}{(x + 2)(x - 1)} = \frac{x + 1}{x - 1} \to \frac{-1}{-3} = \frac13$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\lim_{x\to 1}[x(x - 1)(x + 1)]$ και το $\lim_{x\to 4}\dfrac{x^2 - 16}{x^2 - 4x}$.`,
      fields: [{ label: "1ο =", ans: 0 }, { label: "2ο =", ans: 2 }],
      hint: R`Το 2ο: $\frac{(x - 4)(x + 4)}{x(x - 4)}$.`,
      sol: R`Το πρώτο είναι πολυώνυμο: $1\cdot 0\cdot 2 = 0$. Το δεύτερο: $\frac{x + 4}{x} \to \frac{8}{4} = 2$.` },
{ level: 1, type: "fields", q: R`Να υπολογίσετε: (α) $\lim_{x\to 4}(x^2 - 4x + 1)^5$, (β) $\lim_{x\to -5}|x^2 - 3x + 1|$.`,
      fields: [{ label: "(α) =", ans: 1 }, { label: "(β) =", ans: 41 }],
      hint: R`Ιδιότητες ορίων: δύναμη και απόλυτη τιμή.`,
      sol: R`(α) $(16 - 16 + 1)^5 = 1$. (β) $|25 + 15 + 1| = 41$.` },
    { level: 1, type: "fields", q: R`Αν $\lim_{x\to -2} f(x) = 1$ και $\lim_{x\to -2} g(x) = -3$, να υπολογίσετε τα όρια στο $-2$ των: (α) $f - g$, (β) $\frac{6f}{g}$, (γ) $f^{10}\cdot|g|$.`,
      fields: [{ label: "(α) =", ans: 4 }, { label: "(β) =", ans: -2 }, { label: "(γ) =", ans: 3 }],
      hint: R`Εφάρμοσε τις ιδιότητες.`,
      sol: R`(α) $1 - (-3) = 4$. (β) $\frac{6}{-3} = -2$. (γ) $1^{10}\cdot 3 = 3$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε: (α) $\lim_{x\to 1}\dfrac{\sqrt x - 1}{x - 1}$, (β) $\lim_{x\to 3}\dfrac{x^3 - 27}{x^2 - 9}$.`,
      fields: [{ label: "(α) =", ans: "1/2" }, { label: "(β) =", ans: "9/2" }],
      hint: R`(α) συζυγής, (β) $x^3 - 27 = (x - 3)(x^2 + 3x + 9)$.`,
      sol: R`(α) $\frac{1}{\sqrt x + 1} \to \frac12$. (β) $\frac{x^2 + 3x + 9}{x + 3} \to \frac{27}{6} = \frac92$.` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε το $\lim_{x\to -1}\dfrac{\sqrt{x^2 + 3} - 2}{x^2 + x}$.`,
      fields: [{ label: "όριο =", ans: "1/2" }],
      hint: R`Πολλαπλασίασε με $\sqrt{x^2 + 3} + 2$.`,
      sol: R`$\frac{x^2 + 3 - 4}{x(x + 1)(\sqrt{x^2 + 3} + 2)} = \frac{(x - 1)(x + 1)}{x(x + 1)(\sqrt{x^2 + 3} + 2)} = \frac{x - 1}{x(\sqrt{x^2 + 3} + 2)} \to \frac{-2}{(-1)\cdot 4} = \frac12$.` },
    { level: 2, type: "mc", q: R`Το $\lim_{x\to 0}\dfrac{|x|}{x}$:`,
      options: ["είναι $1$", "είναι $-1$", "είναι $0$", "δεν υπάρχει"], correct: 3,
      hint: R`Πλευρικά όρια.`,
      sol: R`Για $x > 0$: $\frac{|x|}{x} = 1$, για $x < 0$: $-1$. Τα πλευρικά όρια διαφέρουν: δεν υπάρχει.` },
    { level: 3, type: "fields", q: R`Δίνεται $f(x) = \begin{cases} 2\alpha x + \beta, & x \le -1 \\ \alpha x^2 + \beta x, & x > -1\end{cases}$. Να βρείτε τα $\alpha$, $\beta$ ώστε $\lim_{x\to -1} f(x) = 4$.`,
      fields: [{ label: "α =", ans: -8 }, { label: "β =", ans: -12 }],
      hint: R`Και τα δύο πλευρικά όρια ίσα με $4$: $-2\alpha + \beta = 4$, $\alpha - \beta = 4$.`,
      sol: R`Προσθέτοντας: $-\alpha = 8 \Rightarrow \alpha = -8$, $\beta = 4 + 2\alpha = -12$.` }
  ]
},
/* ───────────────────────────── 5.5 ───────────────────────────── */
{
  id: "5.5", unit: 5, title: "Μη πεπερασμένο όριο στο x₀",
  book: "Β΄ Τεύχος §5.5 (εκτός ορισμών με Μ, δ) · Δραστηριότητες σελ. 36–37",
  theory: R`
<div class="tbox"><h4>Η έννοια</h4>
<p>$\lim_{x\to x_0} f(x) = +\infty$ σημαίνει ότι οι τιμές $f(x)$ γίνονται όσο μεγάλες θέλουμε, καθώς $x \to x_0$. Ανάλογα για $-\infty$ και για πλευρικά όρια.</p>
<p>Βασικά: $\lim_{x\to 0}\frac{1}{x^2} = +\infty$, $\ \lim_{x\to 0^+}\frac1x = +\infty$, $\ \lim_{x\to 0^-}\frac1x = -\infty$ (άρα το $\lim_{x\to 0}\frac1x$ δεν υπάρχει).</p></div>

<div class="tbox"><h4>Μορφή $\frac{c}{0}$, $c \ne 0$</h4>
<p>Αν $f(x) \to c \ne 0$ και $g(x) \to 0$, τότε $\frac{f(x)}{g(x)} \to \pm\infty$: το πρόσημο εξαρτάται από τα πρόσημα του $c$ και του $g(x)$ <b>κοντά</b> στο $x_0$. Αν το πρόσημο του $g$ αλλάζει, εξετάζουμε πλευρικά όρια.</p></div>

<div class="tbox tip"><h4>Πράξεις με $\pm\infty$</h4>
<p>$(+\infty) + (+\infty) = +\infty$, $\ c + (\pm\infty) = \pm\infty$, $\ c\cdot(+\infty) = \pm\infty$ ανάλογα με το πρόσημο του $c \ne 0$. <b>Απροσδιόριστες</b>: $(+\infty) - (+\infty)$, $0\cdot\infty$, $\frac\infty\infty$, $\frac00$.</p></div>`,
  widget: "vlimit",
  gen: "ginfl",
  exercises: [
    { level: 1, type: "mc", q: R`$\lim_{x\to 4^-}\dfrac{1}{x - 4} = $`, options: ["$-\\infty$", "$+\\infty$", "$0$", "δεν υπάρχει"], correct: 0,
      hint: R`Για $x < 4$: $x - 4 < 0$.`, sol: R`Ο παρονομαστής τείνει στο $0$ με αρνητικές τιμές: $-\infty$.` },
    { level: 1, type: "mc", q: R`$\lim_{x\to -2^+}\dfrac{1}{x + 2} = $`, options: ["$+\\infty$", "$-\\infty$", "$0$", "$\\frac12$"], correct: 0,
      hint: R`Για $x > -2$: $x + 2 > 0$.`, sol: R`$+\infty$.` },
    { level: 2, type: "mc", q: R`$\lim_{x\to 7^+}\dfrac{1}{(7 - x)^3} = $`, options: ["$-\\infty$", "$+\\infty$", "$0$", "δεν υπάρχει"], correct: 0,
      hint: R`Για $x > 7$: $7 - x < 0$, και ο κύβος κρατά το πρόσημο.`, sol: R`$(7 - x)^3 \to 0^-$: $-\infty$.` },
    { level: 1, type: "mc", q: R`$\lim_{x\to -3}\dfrac{1}{(x + 3)^{2018}} = $`, options: ["$+\\infty$", "$-\\infty$", "$0$", "δεν υπάρχει"], correct: 0,
      hint: R`Άρτια δύναμη.`, sol: R`Ο παρονομαστής είναι θετικός και τείνει στο $0$ (και από τις δύο πλευρές): $+\infty$.` },
    { level: 2, type: "mc", q: R`$\lim_{x\to 4}\dfrac{x^2 + x - 1}{4 - x}$:`, options: ["δεν υπάρχει", "$+\\infty$", "$-\\infty$", "$19$"], correct: 0,
      hint: R`Αριθμητής $\to 19$, παρονομαστής αλλάζει πρόσημο.`, sol: R`Για $x \to 4^-$: $\frac{19}{0^+} \to +\infty$· για $x \to 4^+$: $\frac{19}{0^-} \to -\infty$. Διαφορετικά πλευρικά: δεν υπάρχει.` },
    { level: 2, type: "mc", q: R`$\lim_{x\to -3}\dfrac{2x^2 + 1}{|x + 3|} = $`, options: ["$+\\infty$", "$-\\infty$", "$19$", "δεν υπάρχει"], correct: 0,
      hint: R`Το απόλυτο είναι θετικό.`, sol: R`$\frac{19}{0^+}$: $+\infty$.` },
    { level: 2, type: "mc", q: R`$\lim_{x\to 3}\dfrac{x + 3}{x^2 - 6x + 9} = $`, options: ["$+\\infty$", "$-\\infty$", "$0$", "δεν υπάρχει"], correct: 0,
      hint: R`$x^2 - 6x + 9 = (x - 3)^2$.`, sol: R`$\frac{6}{(x - 3)^2} \to +\infty$.` },
    { level: 2, type: "mc", q: R`Αν $\lim_{x\to 3} f(x) = +\infty$ και $\lim_{x\to 3} g(x) = -\infty$, τότε $\lim_{x\to 3}(f(x) - g(x)) = +\infty$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`$f - g = f + (-g)$.`, sol: R`$-g \to +\infty$, άρα $f + (-g) \to (+\infty) + (+\infty) = +\infty$.` },
    { level: 3, type: "mc", q: R`Αν $\lim_{x\to 3}\big(f(x)(3x^2 - 4)\big) = -\infty$, τότε $\lim_{x\to 3} f(x) = $`,
      options: ["$-\\infty$", "$+\\infty$", "$0$", "$-23$"], correct: 0,
      hint: R`$3x^2 - 4 \to 23 > 0$.`, sol: R`$f(x) = \frac{f(x)(3x^2 - 4)}{3x^2 - 4} \to \frac{-\infty}{23} = -\infty$.` }
  ]
},
/* ───────────────────────────── 5.6 ───────────────────────────── */
{
  id: "5.6", unit: 5, title: "Όριο συνάρτησης στο άπειρο",
  book: "Β΄ Τεύχος §5.6 (εκτός ορισμών με ε, Μ) · Δραστηριότητες σελ. 45–46",
  theory: R`
<div class="tbox"><h4>Το $\pm\infty$</h4>
<p>$\lim_{x\to +\infty} f(x) = +\infty$ σημαίνει ότι, καθώς το $x$ αυξάνεται απεριόριστα, οι τιμές $f(x)$ ξεπερνούν οποιονδήποτε αριθμό. Ανάλογα για $-\infty$. Τα $\pm\infty$ <b>δεν</b> είναι πραγματικοί αριθμοί.</p>
<p>Βασικά όρια: $\lim_{x\to\pm\infty} c = c$, $\ \lim_{x\to +\infty} x = +\infty$, $\ \lim_{x\to -\infty} x = -\infty$, $\ \lim_{x\to\pm\infty}\frac1x = 0$.</p>
<p>$\lim_{x\to +\infty} x^\nu = +\infty$· $\ \lim_{x\to -\infty} x^\nu = +\infty$ αν $\nu$ άρτιος, $-\infty$ αν $\nu$ περιττός.</p></div>

<div class="tbox tip"><h4>Πολυώνυμο στο άπειρο</h4>
<p>Μετράει <b>μόνο ο μεγιστοβάθμιος όρος</b>:</p>
$$\lim_{x\to\pm\infty}(\alpha_\nu x^\nu + \dots + \alpha_0) = \lim_{x\to\pm\infty}\alpha_\nu x^\nu$$
<p>Π.χ. $\lim_{x\to -\infty}(-7x^3 + 5x^2 + 2x - 4) = \lim_{x\to -\infty}(-7x^3) = -7\cdot(-\infty) = +\infty$.</p></div>
<div class="tbox"><h4>Ρητή συνάρτηση στο $\pm\infty$</h4>
<p>$\displaystyle\lim_{x\to\pm\infty}\frac{\alpha_\nu x^\nu + \dots}{\beta_\mu x^\mu + \dots} = \lim_{x\to\pm\infty}\frac{\alpha_\nu x^\nu}{\beta_\mu x^\mu}$: αν $\nu = \mu$ το όριο είναι $\frac{\alpha_\nu}{\beta_\mu}$, αν $\nu < \mu$ είναι $0$, αν $\nu > \mu$ είναι $\pm\infty$.</p>
<p><b>Ρίζες:</b> $\sqrt{x^2} = |x|$ (στο $-\infty$: $|x| = -x$). Για μορφή $\infty - \infty$ πολλαπλασιάζουμε με τη συζυγή παράσταση.</p></div>`,
  widget: "inflim",
  gen: "glinf",
  exercises: [
    { level: 1, type: "mc", q: R`$\lim_{x\to -\infty} x^4 = $`,
      options: ["$+\\infty$", "$-\\infty$", "$0$", "δεν υπάρχει"], correct: 0,
      hint: R`Άρτια δύναμη αρνητικού αριθμού.`,
      sol: R`Ο εκθέτης $4$ είναι άρτιος, άρα $x^4 > 0$ και μεγαλώνει απεριόριστα: $+\infty$.` },
    { level: 1, type: "mc", q: R`$\lim_{x\to -\infty} x^5 = $`,
      options: ["$+\\infty$", "$-\\infty$", "$0$", "$5$"], correct: 1,
      hint: R`Περιττή δύναμη κρατά το πρόσημο.`,
      sol: R`Περιττός εκθέτης: $x^5 < 0$ για $x < 0$, άρα $-\infty$.` },
    { level: 1, type: "mc", q: R`$\lim_{x\to -\infty}(5x^4 + 3x^2 - 4x - 3) = $`,
      options: ["$+\\infty$", "$-\\infty$", "$5$", "$-3$"], correct: 0,
      hint: R`Μεγιστοβάθμιος όρος: $5x^4$.`,
      sol: R`$\lim_{x\to -\infty} 5x^4 = 5\cdot(+\infty) = +\infty$.` },
    { level: 1, type: "mc", q: R`$\lim_{x\to +\infty}(2x - 3x^4) = $`,
      options: ["$+\\infty$", "$-\\infty$", "$2$", "$-3$"], correct: 1,
      hint: R`Ο μεγιστοβάθμιος όρος είναι ο $-3x^4$ (παρόλο που είναι γραμμένος τελευταίος).`,
      sol: R`$\lim_{x\to +\infty}(-3x^4) = -3\cdot(+\infty) = -\infty$.` },
    { level: 2, type: "mc", q: R`$\lim_{x\to -\infty}(-2x^2 + x - 7) = $`,
      options: ["$+\\infty$", "$-\\infty$", "$-7$", "$0$"], correct: 1,
      hint: R`$x^2 \to +\infty$, επί $-2$.`,
      sol: R`$\lim_{x\to -\infty}(-2x^2) = -2\cdot(+\infty) = -\infty$.` },
    { level: 2, type: "mc", q: R`$\lim_{x\to +\infty}(-3x^3 + x^2 - 5x + 2) = $`,
      options: ["$+\\infty$", "$-\\infty$", "$2$", "$-3$"], correct: 1,
      hint: R`Μεγιστοβάθμιος: $-3x^3$.`,
      sol: R`$\lim_{x\to +\infty}(-3x^3) = -\infty$.` },
    { level: 2, type: "mc", q: R`$\lim_{x\to -\infty}(-7x^3 + 5x^2 + 2x - 4) = $`,
      options: ["$+\\infty$", "$-\\infty$", "$-7$", "$-4$"], correct: 0,
      hint: R`$x^3 \to -\infty$ για $x \to -\infty$.`,
      sol: R`$\lim_{x\to -\infty}(-7x^3) = -7\cdot(-\infty) = +\infty$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε: (α) $\lim_{x\to +\infty}\left(3 + \dfrac1x\right)$, (β) $\lim_{x\to -\infty}\dfrac{5}{x}$.`,
      fields: [{ label: "(α) =", ans: 3 }, { label: "(β) =", ans: 0 }],
      hint: R`$\frac1x \to 0$ στο $\pm\infty$.`,
      sol: R`(α) $3 + 0 = 3$. (β) $5\cdot 0 = 0$.` },
{ level: 1, type: "fields", q: R`Να υπολογίσετε: (α) $\lim_{x\to -\infty}\dfrac{x^3 - 3x^2 + 2x}{x^5 - 3x^2 + 1}$, (β) $\lim_{x\to -\infty}\dfrac{4 - x^{10}}{x^3 + 5x^{10}}$.`,
      fields: [{ label: "(α) =", ans: 0 }, { label: "(β) =", ans: "-1/5" }],
      hint: R`Λόγος μεγιστοβάθμιων όρων.`,
      sol: R`(α) $\lim\frac{x^3}{x^5} = \lim\frac{1}{x^2} = 0$. (β) $\lim\frac{-x^{10}}{5x^{10}} = -\frac15$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το $\alpha$ ώστε $\lim_{x\to -\infty}\dfrac{\alpha x^3 + 2x^2 + 2}{1 - x^2 - x^3} = 4$.`,
      fields: [{ label: "α =", ans: -4 }],
      hint: R`Το όριο είναι $\frac{\alpha}{-1}$.`,
      sol: R`$\lim\frac{\alpha x^3}{-x^3} = -\alpha = 4 \Rightarrow \alpha = -4$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε: (α) $\lim_{x\to +\infty}\dfrac{\sqrt{9x^2 - 1}}{x + 2}$, (β) $\lim_{x\to +\infty}(\sqrt{x^2 + 2} - x)$.`,
      fields: [{ label: "(α) =", ans: 3 }, { label: "(β) =", ans: 0 }],
      hint: R`(α) βγάλε $x^2$ από τη ρίζα, (β) συζυγής.`,
      sol: R`(α) $\frac{x\sqrt{9 - 1/x^2}}{x(1 + 2/x)} \to 3$. (β) $\frac{2}{\sqrt{x^2 + 2} + x} \to 0$.` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε το $\lim_{x\to -\infty}\left(\sqrt{x^2 - x + 1} - \sqrt{x^2 + x + 1}\right)$.`,
      fields: [{ label: "όριο =", ans: 1 }],
      hint: R`Συζυγής, και στο $-\infty$: $\sqrt{x^2} = -x$.`,
      sol: R`$\frac{-2x}{\sqrt{x^2 - x + 1} + \sqrt{x^2 + x + 1}} = \frac{-2x}{-x\left(\sqrt{1 - \frac1x + \frac1{x^2}} + \sqrt{1 + \frac1x + \frac1{x^2}}\right)} \to \frac{-2}{-2} = 1$.` },
    { level: 1, type: "mc", q: R`$\lim_{x\to +\infty}\dfrac{x^7 - x^4}{x - 2} = $`,
      options: ["$+\\infty$", "$-\\infty$", "$1$", "$0$"], correct: 0,
      hint: R`Βαθμός αριθμητή μεγαλύτερος.`,
      sol: R`$\lim\frac{x^7}{x} = \lim x^6 = +\infty$.` }
  ]
},
/* ───────────────────────────── 5.7 ───────────────────────────── */
{
  id: "5.7", unit: 5, title: "Όρια τριγωνομετρικών συναρτήσεων",
  book: "Β΄ Τεύχος §5.7 · Δραστηριότητες σελ. 52",
  theory: R`
<div class="tbox"><h4>Κριτήριο παρεμβολής</h4>
<p>Αν $h(x) \le f(x) \le g(x)$ κοντά στο $x_0$ και $\lim h = \lim g = \ell$, τότε $\lim f = \ell$. Π.χ. $-x^2 \le x^2\text{ημ}\frac1x \le x^2$, άρα $\lim_{x\to 0}x^2\text{ημ}\frac1x = 0$.</p></div>

<div class="tbox"><h4>Βασικά όρια ($x$ σε ακτίνια)</h4>
$$\lim_{x\to x_0}\text{ημ}x = \text{ημ}x_0 \qquad \lim_{x\to x_0}\text{συν}x = \text{συν}x_0$$
$$\lim_{x\to 0}\frac{\text{ημ}x}{x} = 1 \qquad \lim_{x\to 0}\frac{1 - \text{συν}x}{x} = 0 \qquad \lim_{x\to 0}\frac{\text{εφ}x}{x} = 1$$</div>

<div class="tbox tip"><h4>Τεχνική</h4>
<p>Φέρνουμε στη μορφή $\frac{\text{ημ}(\text{κάτι})}{\text{το ίδιο κάτι}}$: $\ \frac{\text{ημ}3x}{x} = 3\cdot\frac{\text{ημ}3x}{3x} \to 3$. Για $1 - \text{συν}$ χρησιμοποιούμε $1 - \text{συν}2\theta = 2\text{ημ}^2\theta$. Στο $\pm\infty$: $\left|\frac{\text{ημ}x}{x}\right| \le \frac{1}{|x|} \to 0$.</p></div>`,
  widget: "triglim",
  gen: "gtriglim",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε: (α) $\lim_{x\to 0}\dfrac{\text{ημ}x}{x + 1}$, (β) $\lim_{x\to 0^+}\dfrac{\text{ημ}3x}{x}$.`,
      fields: [{ label: "(α) =", ans: 0 }, { label: "(β) =", ans: 3 }],
      hint: R`(α) απλή αντικατάσταση.`, sol: R`(α) $\frac{0}{1} = 0$. (β) $3\cdot\frac{\text{ημ}3x}{3x} \to 3$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε το $\lim_{x\to\pi}x^4\,\text{συν}x$ (γράψτε π.χ. <code>-π^4</code>).`,
      fields: [{ label: "=", ans: "-π^4", tol: 0.0005 }],
      hint: R`Συνεχείς συναρτήσεις: αντικατάσταση.`, sol: R`$\pi^4\cdot\text{συν}\pi = -\pi^4$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε: (α) $\lim_{x\to 0}\dfrac{\text{ημ}2x}{\text{ημ}4x}$, (β) $\lim_{x\to 0}\dfrac{\text{εφ}2x}{x}$.`,
      fields: [{ label: "(α) =", ans: "1/2" }, { label: "(β) =", ans: 2 }],
      hint: R`Πολλαπλασίασε και διαίρεσε κατάλληλα.`,
      sol: R`(α) $\frac{\text{ημ}2x}{2x}\cdot\frac{4x}{\text{ημ}4x}\cdot\frac{2}{4} \to \frac12$. (β) $2\cdot\frac{\text{εφ}2x}{2x} \to 2$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\lim_{x\to 4}\dfrac{\text{ημ}(x - 4)}{x^3 - 4x^2}$.`,
      fields: [{ label: "=", ans: "1/16" }],
      hint: R`$x^3 - 4x^2 = x^2(x - 4)$.`,
      sol: R`$\frac{\text{ημ}(x - 4)}{x - 4}\cdot\frac{1}{x^2} \to 1\cdot\frac{1}{16}$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\lim_{x\to 0}\dfrac{1 - \text{συν}2x}{x^2}$.`,
      fields: [{ label: "=", ans: 2 }],
      hint: R`$1 - \text{συν}2x = 2\text{ημ}^2x$.`,
      sol: R`$2\left(\frac{\text{ημ}x}{x}\right)^2 \to 2$.` },
    { level: 2, type: "mc", q: R`$\lim_{x\to 0}x^4\,\text{ημ}\dfrac1x = $`,
      options: ["$0$", "$1$", "δεν υπάρχει", "$+\\infty$"], correct: 0,
      hint: R`Κριτήριο παρεμβολής με $\pm x^4$.`,
      sol: R`$-x^4 \le x^4\text{ημ}\frac1x \le x^4$ και $\pm x^4 \to 0$: το όριο είναι $0$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\lim_{x\to +\infty}\dfrac{\text{ημ}x}{x - 5}$.`,
      fields: [{ label: "=", ans: 0 }],
      hint: R`$\left|\frac{\text{ημ}x}{x - 5}\right| \le \frac{1}{x - 5}$.`,
      sol: R`Παρεμβολή: $-\frac{1}{x - 5} \le \frac{\text{ημ}x}{x - 5} \le \frac{1}{x - 5}$ (για $x > 5$) και τα άκρα $\to 0$.` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε το $\lim_{x\to 0}\dfrac{1 - \text{συν}2x}{x\,\text{ημ}2x}$.`,
      fields: [{ label: "=", ans: 1 }],
      hint: R`$\frac{2\text{ημ}^2x}{x\cdot 2\,\text{ημ}x\,\text{συν}x}$.`,
      sol: R`$= \frac{\text{ημ}x}{x\,\text{συν}x} \to \frac{1}{1} = 1$.` }
  ]
},
/* ───────────────────────────── 5.8 ───────────────────────────── */
{
  id: "5.8", unit: 5, title: "Συνέχεια συνάρτησης",
  book: "Β΄ Τεύχος §5.8 · Δραστηριότητες σελ. 61",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Η $f$ είναι <b>συνεχής στο $x_0$</b> του πεδίου ορισμού της όταν</p>
$$\lim_{x\to x_0} f(x) = f(x_0)$$
<p>Είναι συνεχής σε ένα σύνολο όταν είναι συνεχής σε κάθε σημείο του· σε κλειστό διάστημα $[\alpha, \beta]$ ζητάμε στα άκρα $\lim_{x\to\alpha^+} f(x) = f(\alpha)$ και $\lim_{x\to\beta^-} f(x) = f(\beta)$.</p></div>

<div class="tbox"><h4>Γνωστές συνεχείς συναρτήσεις</h4>
<p>Πολυωνυμικές, ρητές, $\sqrt[\nu]{x}$, $|x|$, $\text{ημ}x$, $\text{συν}x$, $\text{εφ}x$ — στο πεδίο ορισμού τους. Αθροίσματα, γινόμενα, πηλίκα (όπου ορίζονται) και συνθέσεις συνεχών είναι συνεχείς.</p></div>

<div class="tbox tip"><h4>Συνάρτηση πολλαπλού τύπου</h4>
<p>Σε κάθε κομμάτι συνήθως είναι συνεχής. Ελέγχουμε τα σημεία «αλλαγής» τύπου: πλευρικά όρια και τιμή πρέπει να είναι <b>ίσα</b>. Γραφικά: η γραμμή σχεδιάζεται χωρίς να σηκώσουμε το μολύβι.</p></div>`,
  widget: "contin",
  gen: "gcont",
  exercises: [
    { level: 1, type: "mc", q: R`Αν οι $f$, $g$ είναι συνεχείς στο $\mathbb{R}$, τότε και η $f + g$ είναι συνεχής στο $\mathbb{R}$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Ιδιότητες ορίων.`, sol: R`Σωστό: $\lim(f + g) = \lim f + \lim g = f(x_0) + g(x_0)$.` },
    { level: 2, type: "mc", q: R`Αν η $f + g$ είναι συνεχής στο $\mathbb{R}$, τότε και οι $f$, $g$ είναι συνεχείς στο $\mathbb{R}$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Βρες δύο ασυνεχείς με συνεχές άθροισμα.`,
      sol: R`Λάθος: π.χ. $f(x) = 1$ για $x \ge 0$, $0$ για $x < 0$ και $g = -f$· καμία συνεχής στο $0$, αλλά $f + g = 0$ συνεχής.` },
    { level: 1, type: "mc", q: R`Η $f(x) = \begin{cases} x^2 - 2, & x < 0 \\ x + 1, & x \ge 0\end{cases}$ στο $x_0 = 0$:`,
      options: ["δεν είναι συνεχής", "είναι συνεχής", "δεν ορίζεται"], correct: 0,
      hint: R`Πλευρικά όρια.`, sol: R`$\lim_{0^-} = -2 \ne \lim_{0^+} = 1 = f(0)$: ασυνεχής.` },
    { level: 2, type: "mc", q: R`Η $g(x) = \begin{cases} \sqrt{-16x}, & x < -1 \\ 4, & x = -1 \\ |x - 3|, & x > -1\end{cases}$ στο $x_0 = -1$:`,
      options: ["είναι συνεχής", "δεν είναι συνεχής"], correct: 0,
      hint: R`Υπολόγισε $\sqrt{16}$ και $|-4|$.`, sol: R`$\lim_{-1^-} = \sqrt{16} = 4$, $\lim_{-1^+} = |-4| = 4$, $g(-1) = 4$: συνεχής.` },
    { level: 3, type: "fields", q: R`Να βρείτε τα $\alpha$, $\beta$ ώστε η $f(x) = \begin{cases} \alpha x, & x \le -5 \\ x^2 + 2x, & -5 < x < 2 \\ \frac{\beta x}{2} - \alpha, & x \ge 2\end{cases}$ να είναι συνεχής στο $\mathbb{R}$.`,
      fields: [{ label: "α =", ans: -3 }, { label: "β =", ans: 5 }],
      hint: R`Συνθήκες στο $-5$ και στο $2$.`,
      sol: R`Στο $-5$: $-5\alpha = 25 - 10 = 15 \Rightarrow \alpha = -3$. Στο $2$: $4 + 4 = \beta - \alpha \Rightarrow \beta = 8 + \alpha = 5$.` },
    { level: 1, type: "fields", q: R`Η $f(x) = \dfrac{x^2 - 4}{x - 2}$ για $x \ne 2$ και $f(2) = \kappa$. Για ποιο $\kappa$ είναι συνεχής στο $2$;`,
      fields: [{ label: "κ =", ans: 4 }], hint: R`$\lim_{x\to 2}(x + 2)$.`, sol: R`$\kappa = \lim_{x\to 2}(x + 2) = 4$.` },
    { level: 2, type: "fields", q: R`Η $f(x) = \dfrac{\text{ημ}3x}{x}$ για $x \ne 0$ και $f(0) = \kappa$. Για ποιο $\kappa$ είναι συνεχής στο $0$;`,
      fields: [{ label: "κ =", ans: 3 }], hint: R`Βασικό τριγωνομετρικό όριο.`, sol: R`$\kappa = \lim_{x\to 0}\frac{\text{ημ}3x}{x} = 3$.` },
    { level: 1, type: "mc", q: R`Η $f(x) = \dfrac{x}{\text{ημ}x}$, $x \ne \kappa\pi$:`,
      options: ["είναι συνεχής στο πεδίο ορισμού της", "είναι ασυνεχής στο $x = \\frac\\pi2$", "δεν είναι συνεχής πουθενά"], correct: 0,
      hint: R`Πηλίκο συνεχών.`, sol: R`Πηλίκο συνεχών με μη μηδενικό παρονομαστή στο πεδίο ορισμού: συνεχής σε αυτό.` }
  ]
},
/* ───────────────────────────── 5.9 ───────────────────────────── */
{
  id: "5.9", unit: 5, title: "Βασικά θεωρήματα συνεχών συναρτήσεων",
  book: "Β΄ Τεύχος §5.9 και ένθετο · Δραστηριότητες σελ. 68–69",
  theory: R`
<div class="tbox"><h4>Θεώρημα Bolzano</h4>
<p>Αν η $f$ είναι <b>συνεχής</b> στο $[\alpha, \beta]$ και $f(\alpha)\,f(\beta) < 0$, τότε υπάρχει <b>τουλάχιστον ένα</b> $x_0 \in (\alpha, \beta)$ με $f(x_0) = 0$. Χρησιμοποιείται για να δείξουμε ότι μια εξίσωση έχει λύση σε διάστημα, και για προσέγγιση ρίζας με <b>διχοτόμηση</b>.</p></div>

<div class="tbox"><h4>Θεώρημα ενδιάμεσων τιμών</h4>
<p>Αν η $f$ είναι συνεχής στο $[\alpha, \beta]$ και $f(\alpha) \ne f(\beta)$, τότε για κάθε $\lambda$ μεταξύ των $f(\alpha)$, $f(\beta)$ υπάρχει $x_0 \in (\alpha, \beta)$ με $f(x_0) = \lambda$.</p></div>

<div class="tbox tip"><h4>Θεώρημα μέγιστης και ελάχιστης τιμής</h4>
<p>Αν η $f$ είναι συνεχής σε <b>κλειστό</b> διάστημα $[\alpha, \beta]$, παίρνει μέγιστη τιμή $M$ και ελάχιστη $m$, και το σύνολο τιμών της είναι το $[m, M]$. Χωρίς συνέχεια ή χωρίς κλειστό διάστημα δεν εξασφαλίζεται (π.χ. $f(x) = x + 2$ στο $(0, 3)$ δεν έχει ούτε μέγιστο ούτε ελάχιστο).</p></div>`,
  widget: "bolzano",
  gen: "gbolz",
  exercises: [
    { level: 1, type: "fields", q: R`Για την $f(x) = 4x^3 - 2x^2 - 5x + 1$ να υπολογίσετε τα $f(0)$ και $f(1)$ και να συμπεράνετε ότι έχει ρίζα στο $(0, 1)$.`,
      fields: [{ label: "f(0) =", ans: 1 }, { label: "f(1) =", ans: -2 }],
      hint: R`Bolzano.`, sol: R`$f(0) = 1 > 0$, $f(1) = -2 < 0$, η $f$ συνεχής: υπάρχει $x_0 \in (0, 1)$ με $f(x_0) = 0$.` },
    { level: 2, type: "fields", q: R`Η εξίσωση $x^5 - 3x - 2 = 0$ έχει λύση στο $(1, 3)$. Με διχοτόμηση ή δοκιμές, να βρείτε τη λύση στρογγυλεμένη στο 1ο δεκαδικό ψηφίο.`,
      fields: [{ label: "x ≈", ans: 1.4 }],
      hint: R`$f(1{,}4) < 0 < f(1{,}5)$· σύγκρινε και το $f(1{,}45)$.`,
      sol: R`$f(1) = -4$, $f(3) = 232$. $f(1{,}4) \approx -0{,}82$, $f(1{,}45) \approx 0{,}06$, άρα η ρίζα είναι στο $(1{,}4;\ 1{,}45)$, δηλαδή $\approx 1{,}4$ (με ακρίβεια δεκάτου· η ρίζα είναι $\approx 1{,}447$).` },
    { level: 1, type: "mc", q: R`Αν η $f$ είναι συνεχής στο $[\alpha, \beta]$, τότε υπάρχει πάντα $x_0 \in (\alpha, \beta)$ με $f(x_0) = 0$.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Χρειάζεται και $f(\alpha)f(\beta) < 0$.`, sol: R`Λάθος: π.χ. $f(x) = x^2 + 1$ στο $[0, 1]$ δεν έχει ρίζα.` },
    { level: 2, type: "mc", q: R`Για την $f(x) = x + \text{ημ}x + \text{συν}x$ στο $[0, \pi]$, υπάρχει $\xi$ με $f(\xi) = 2$;`,
      options: ["Ναι, από το θεώρημα ενδιάμεσων τιμών", "Όχι", "Δεν μπορούμε να ξέρουμε"], correct: 0,
      hint: R`$f(0) = 1$, $f(\pi) = \pi - 1$.`, sol: R`$f$ συνεχής, $f(0) = 1 < 2 < \pi - 1 \approx 2{,}14 = f(\pi)$: υπάρχει $\xi \in (0, \pi)$ με $f(\xi) = 2$.` },
    { level: 2, type: "fields", q: R`Για την $f(x) = x^4 - x^2 + 3x + 1$ να υπολογίσετε τα $f(-2)$, $f(-1)$, $f(0)$. Πόσες ρίζες τουλάχιστον έχει στο $(-2, 0)$;`,
      fields: [{ label: "f(−2) =", ans: 7 }, { label: "f(−1) =", ans: -2 }, { label: "f(0) =", ans: 1 }, { label: "ρίζες ≥", ans: 2 }],
      hint: R`Εφάρμοσε Bolzano σε δύο υποδιαστήματα.`, sol: R`Αλλαγή προσήμου στα $(-2, -1)$ και $(-1, 0)$: τουλάχιστον δύο ρίζες.` },
    { level: 2, type: "fields", q: R`Η $f(x) = x^2 - 6x + 10$ είναι συνεχής στο $[1, 5]$. Να βρείτε την ελάχιστη και τη μέγιστη τιμή της εκεί.`,
      fields: [{ label: "m =", ans: 1 }, { label: "M =", ans: 5 }],
      hint: R`$f(x) = (x - 3)^2 + 1$.`, sol: R`Ελάχιστη $f(3) = 1$, μέγιστη $f(1) = f(5) = 5$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το σύνολο τιμών $[m, M]$ της $f(x) = x^2 + x + 1$, $x \in [-1, 4]$.`,
      fields: [{ label: "m =", ans: "3/4" }, { label: "M =", ans: 21 }],
      hint: R`Κορυφή στο $x = -\frac12$.`, sol: R`$f\left(-\frac12\right) = \frac34$ (ελάχιστο), $f(-1) = 1$, $f(4) = 21$: σύνολο τιμών $\left[\frac34, 21\right]$.` },
    { level: 1, type: "mc", q: R`Η $f(x) = x + 2$, $x \in (0, 3)$:`,
      options: ["δεν έχει ούτε μέγιστη ούτε ελάχιστη τιμή", "έχει μέγιστη τιμή $5$", "έχει ελάχιστη τιμή $2$", "έχει και τις δύο"], correct: 0,
      hint: R`Το διάστημα είναι ανοικτό.`, sol: R`Οι τιμές είναι στο $(2, 5)$ χωρίς να φτάνουν τα άκρα: ούτε μέγιστο ούτε ελάχιστο.` }
  ]
},
/* ───────────────────────────── 6.2 ───────────────────────────── */
{
  id: "6.2", unit: 6, title: "Η έννοια της ακολουθίας",
  book: "Β΄ Τεύχος §6.1–6.2 · Δραστηριότητες σελ. 86",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p><b>Ακολουθία</b> πραγματικών αριθμών είναι μια συνάρτηση $\alpha: \mathbb{N} \to \mathbb{R}$, όπου εδώ $\mathbb{N} = \{1, 2, 3, \dots\}$ (ο πρώτος όρος είναι ο $\alpha_1$). Την τιμή στη θέση $\nu$ τη γράφουμε $\alpha_\nu$ (αντί για $\alpha(\nu)$) και την ονομάζουμε <b>νιοστό</b> ή <b>γενικό όρο</b>: $\alpha_1, \alpha_2, \alpha_3, \dots, \alpha_\nu, \dots$</p>
<p>Η γραφική παράσταση αποτελείται από <b>μεμονωμένα σημεία</b> $(\nu, \alpha_\nu)$.</p></div>

<div class="tbox"><h4>Πώς ορίζεται μια ακολουθία</h4>
<ul><li>Με <b>γενικό τύπο</b>: π.χ. $\alpha_\nu = 2\nu + 1$ — υπολογίζουμε απευθείας οποιονδήποτε όρο.</li></ul></div>
<div class="tbox"><h4>Αναδρομικός τύπος</h4>
<ul><li>Με <b>αναδρομικό (αναγωγικό) τύπο</b> και αρχικό όρο: π.χ. $\alpha_{\nu+1} = \alpha_\nu + 3$, $\alpha_1 = -1$ δίνει $-1, 2, 5, 8, \dots$ Χωρίς τον αρχικό όρο η ακολουθία <b>δεν</b> ορίζεται πλήρως.</li></ul></div>

<div class="tbox tip"><h4>Χρήσιμα</h4>
<p>Για να βρούμε <b>σε ποια θέση</b> είναι ένας όρος, λύνουμε $\alpha_\nu = $ τιμή και κρατάμε μόνο <b>φυσικές</b> λύσεις. Π.χ. $\nu^2 + 2\nu = 80 \Rightarrow \nu = 8$ (το $-10$ απορρίπτεται).</p></div>`,
  widget: "seqgen",
  gen: "gseq",
  exercises: [
    { level: 1, type: "fields", q: R`Δίνεται η ακολουθία $\alpha_\nu = \nu^2 - 3$. Να υπολογίσετε τους όρους $\alpha_1$ και $\alpha_6$.`,
      fields: [{ label: "α₁ =", ans: -2 }, { label: "α₆ =", ans: 33 }],
      hint: R`Αντικατάσταση $\nu = 1$ και $\nu = 6$.`,
      sol: R`$\alpha_1 = 1 - 3 = -2$, $\alpha_6 = 36 - 3 = 33$.` },
    { level: 2, type: "fields", q: R`Δίνεται η ακολουθία $\alpha_\nu = (-1)^\nu\cdot\nu$. Να βρείτε τους $\alpha_5$ και $\alpha_6$.`,
      fields: [{ label: "α₅ =", ans: -5 }, { label: "α₆ =", ans: 6 }],
      hint: R`$(-1)^\nu$ είναι $-1$ για περιττό, $1$ για άρτιο $\nu$.`,
      sol: R`$\alpha_5 = -5$, $\alpha_6 = 6$.` },
    { level: 1, type: "mc", q: R`Ποιος είναι ένας γενικός όρος της ακολουθίας $1, 4, 9, 16, 25, \dots$;`,
      options: ["$\\alpha_\\nu = \\nu^2$", "$\\alpha_\\nu = 3\\nu - 2$", "$\\alpha_\\nu = 2^\\nu$", "$\\alpha_\\nu = \\nu + 3$"], correct: 0,
      hint: R`Τετράγωνα.`,
      sol: R`$1 = 1^2$, $4 = 2^2$, $9 = 3^2$, …: $\alpha_\nu = \nu^2$.` },
    { level: 1, type: "fields", q: R`Δίνεται η ακολουθία $\alpha_\nu = \dfrac{\nu + 1}{\nu}$. Να υπολογίσετε τους όρους $\alpha_1$ και $\alpha_4$.`,
      fields: [{ label: "α₁ =", ans: 2 }, { label: "α₄ =", ans: "5/4" }],
      hint: R`Αντικατάσταση $\nu = 1$ και $\nu = 4$.`,
      sol: R`$\alpha_1 = \frac{2}{1} = 2$, $\alpha_4 = \frac54$.` },
    { level: 1, type: "fields", q: R`Δίνεται η ακολουθία $\alpha_\nu = 2^\nu - 1$. Να υπολογίσετε τους πέντε πρώτους όρους της· ποιος είναι ο $\alpha_5$; Υπολογίστε και το άθροισμα $\alpha_1 + \alpha_2 + \alpha_3$.`,
      fields: [{ label: "α₅ =", ans: 31 }, { label: "α₁ + α₂ + α₃ =", ans: 11 }],
      hint: R`$1, 3, 7, 15, 31, \dots$`,
      sol: R`$\alpha_1 = 1$, $\alpha_2 = 3$, $\alpha_3 = 7$, $\alpha_4 = 15$, $\alpha_5 = 31$· $1 + 3 + 7 = 11$.` },
    { level: 1, type: "mc", q: R`Η γραφική παράσταση της ακολουθίας $\alpha_\nu = 2\nu - 1$ αποτελείται από:`,
      options: ["μεμονωμένα σημεία $(1, 1), (2, 3), (3, 5), \\dots$", "μια ευθεία γραμμή", "μια ημιευθεία με αρχή το $(0, -1)$", "ένα ευθύγραμμο τμήμα"], correct: 0,
      hint: R`Το πεδίο ορισμού είναι το $\mathbb{N}$.`,
      sol: R`Η ακολουθία ορίζεται μόνο για $\nu = 1, 2, 3, \dots$, άρα η γραφική της παράσταση είναι τα μεμονωμένα σημεία $(\nu, 2\nu - 1)$, που βρίσκονται πάνω στην ευθεία $y = 2x - 1$.` },
{ level: 1, type: "fields", q: R`Δίνεται η ακολουθία $\alpha_\nu = \nu^2 + \nu + 1$. Να βρείτε το $\nu$ ώστε $\alpha_\nu = 57$.`,
      fields: [{ label: "ν =", ans: 7 }],
      hint: R`$\nu^2 + \nu - 56 = 0$.`,
      sol: R`$\nu^2 + \nu - 56 = 0 \Rightarrow \nu = 7$ ή $\nu = -8$ (απορρίπτεται). Άρα $\nu = 7$.` },
    { level: 2, type: "fields", q: R`Δίνεται η ακολουθία με αναδρομικό τύπο $\alpha_{\nu+1} = \alpha_\nu^2 - \alpha_\nu$ και $\alpha_1 = 3$. Να βρείτε τους $\alpha_2$, $\alpha_3$.`,
      fields: [{ label: "α₂ =", ans: 6 }, { label: "α₃ =", ans: 30 }],
      hint: R`$\alpha_2 = \alpha_1^2 - \alpha_1$.`,
      sol: R`$\alpha_2 = 9 - 3 = 6$, $\alpha_3 = 36 - 6 = 30$.` },
    { level: 2, type: "mc", q: R`Η ακολουθία με $\alpha_{\nu+1} = 3\alpha_\nu - 4$ και $\alpha_1 = 2$ έχει όρους:`,
      options: ["$2, 2, 2, 2, \\dots$", "$2, 6, 14, 38, \\dots$", "$2, -2, -10, \\dots$", "$2, 10, 26, \\dots$"], correct: 0,
      hint: R`Υπολόγισε τον $\alpha_2$.`,
      sol: R`$\alpha_2 = 3\cdot 2 - 4 = 2$, και ξανά $\alpha_3 = 2$, … — σταθερή ακολουθία.` },
    { level: 1, type: "mc", q: R`Ποιος είναι ένας γενικός όρος της ακολουθίας $\frac34, \frac45, \frac56, \frac67, \dots$;`,
      options: ["$\\alpha_\\nu = \\frac{\\nu + 2}{\\nu + 3}$", "$\\alpha_\\nu = \\frac{\\nu}{\\nu + 1}$", "$\\alpha_\\nu = \\frac{\\nu + 3}{\\nu + 4}$", "$\\alpha_\\nu = \\frac{3\\nu}{4\\nu}$"], correct: 0,
      hint: R`Για $\nu = 1$ πρέπει να βγαίνει $\frac34$.`,
      sol: R`Αριθμητές $3, 4, 5, \dots = \nu + 2$, παρονομαστές $4, 5, 6, \dots = \nu + 3$.` },
    { level: 1, type: "mc", q: R`Ποιος αναδρομικός τύπος δίνει την ακολουθία $2, 5, 11, 23, 47, \dots$;`,
      options: ["$\\alpha_{\\nu+1} = 2\\alpha_\\nu + 1$, $\\alpha_1 = 2$", "$\\alpha_{\\nu+1} = \\alpha_\\nu + 3$, $\\alpha_1 = 2$", "$\\alpha_{\\nu+1} = 2\\alpha_\\nu$, $\\alpha_1 = 2$", "$\\alpha_{\\nu+1} = 3\\alpha_\\nu - 1$, $\\alpha_1 = 2$"], correct: 0,
      hint: R`Πώς προκύπτει το $5$ από το $2$ και το $11$ από το $5$;`,
      sol: R`$5 = 2\cdot 2 + 1$, $11 = 2\cdot 5 + 1$, $23 = 2\cdot 11 + 1$: $\alpha_{\nu+1} = 2\alpha_\nu + 1$.` }
  ]
},
/* ───────────────────────────── 6.3 ───────────────────────────── */
{
  id: "6.3", unit: 6, title: "Μονότονες ακολουθίες",
  book: "Β΄ Τεύχος §6.3 · Δραστηριότητες σελ. 90",
  theory: R`
<div class="tbox"><h4>Ορισμοί</h4>
<p>Μια ακολουθία $(\alpha_\nu)$ λέγεται, για κάθε $\nu \in \mathbb{N}$:</p>
<ul><li><b>γνησίως αύξουσα</b> αν $\alpha_{\nu+1} > \alpha_\nu$ · <b>αύξουσα</b> αν $\alpha_{\nu+1} \ge \alpha_\nu$</li>
<li><b>γνησίως φθίνουσα</b> αν $\alpha_{\nu+1} < \alpha_\nu$ · <b>φθίνουσα</b> αν $\alpha_{\nu+1} \le \alpha_\nu$</li>
<li><b>σταθερή</b> αν $\alpha_{\nu+1} = \alpha_\nu$.</li></ul>
<p>Όλες αυτές λέγονται <b>μονότονες</b>. Η σταθερή είναι ταυτόχρονα αύξουσα και φθίνουσα.</p></div>

<div class="tbox tip"><h4>Πώς το εξετάζουμε</h4>
<ul><li>Πρόσημο της διαφοράς $\alpha_{\nu+1} - \alpha_\nu$ (για κάθε $\nu$).</li>
<li>Για θετικούς όρους: σύγκριση του λόγου $\frac{\alpha_{\nu+1}}{\alpha_\nu}$ με το $1$.</li>
<li>Αν η ακολουθία προέρχεται από γνησίως μονότονη συνάρτηση ($\alpha_\nu = f(\nu)$), έχει την ίδια μονοτονία.</li>
<li>Για να δείξουμε ότι <b>δεν</b> είναι μονότονη αρκούν τρεις όροι, π.χ. $\alpha_1 < \alpha_2 > \alpha_3$.</li></ul></div>`,
  widget: "seqmono",
  gen: "gmono",
  exercises: [
    { level: 1, type: "mc", q: R`Κάθε σταθερή ακολουθία είναι αύξουσα.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`$\alpha_{\nu+1} \ge \alpha_\nu$;`, sol: R`Σωστό: $\alpha_{\nu+1} = \alpha_\nu$ ικανοποιεί το $\ge$ (όχι όμως το «γνησίως»).` },
    { level: 1, type: "mc", q: R`Κάθε αύξουσα ακολουθία είναι γνησίως αύξουσα.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Σκέψου μια σταθερή.`, sol: R`Λάθος: η σταθερή είναι αύξουσα αλλά όχι γνησίως.` },
    { level: 1, type: "mc", q: R`Η $\alpha_\nu = 3\nu - 5$ είναι:`, options: ["γνησίως αύξουσα", "γνησίως φθίνουσα", "σταθερή", "όχι μονότονη"], correct: 0,
      hint: R`$\alpha_{\nu+1} - \alpha_\nu$.`, sol: R`$\alpha_{\nu+1} - \alpha_\nu = 3 > 0$.` },
    { level: 1, type: "mc", q: R`Η $\alpha_\nu = (-3)^\nu$ είναι:`, options: ["όχι μονότονη", "γνησίως αύξουσα", "γνησίως φθίνουσα", "σταθερή"], correct: 0,
      hint: R`Πρώτοι όροι: $-3, 9, -27$.`, sol: R`$\alpha_1 < \alpha_2 > \alpha_3$: όχι μονότονη.` },
    { level: 2, type: "mc", q: R`Η $\alpha_\nu = \dfrac{2\nu + 3}{2\nu + 1}$ είναι:`, options: ["γνησίως φθίνουσα", "γνησίως αύξουσα", "σταθερή", "όχι μονότονη"], correct: 0,
      hint: R`$\alpha_\nu = 1 + \frac{2}{2\nu + 1}$.`, sol: R`$\alpha_\nu = 1 + \frac{2}{2\nu + 1}$ και το κλάσμα μικραίνει όσο αυξάνεται το $\nu$: γνησίως φθίνουσα (διαφορά $\frac{-4}{(2\nu + 1)(2\nu + 3)} < 0$).` },
    { level: 1, type: "fields", q: R`Για την $\alpha_\nu = 5 - \nu$ να υπολογίσετε τη διαφορά $\alpha_{\nu+1} - \alpha_\nu$.`, fields: [{ label: "=", ans: -1 }],
      hint: R`$(5 - \nu - 1) - (5 - \nu)$.`, sol: R`$-1 < 0$: γνησίως φθίνουσα.` },
    { level: 2, type: "mc", q: R`Η ακολουθία με $\alpha_{\nu+1} = \alpha_\nu^2 + 2$ και $\alpha_1 = 3$ είναι:`, options: ["γνησίως αύξουσα", "γνησίως φθίνουσα", "σταθερή", "όχι μονότονη"], correct: 0,
      hint: R`$\alpha_{\nu+1} - \alpha_\nu = \alpha_\nu^2 - \alpha_\nu + 2$.`, sol: R`$\alpha_\nu^2 - \alpha_\nu + 2 = \left(\alpha_\nu - \frac12\right)^2 + \frac74 > 0$ για κάθε $\nu$: γνησίως αύξουσα.` },
    { level: 3, type: "mc", q: R`Η $\alpha_\nu = \dfrac{\nu}{2^\nu}$ είναι:`, options: ["φθίνουσα, αλλά όχι γνησίως", "γνησίως φθίνουσα", "γνησίως αύξουσα", "όχι μονότονη"], correct: 0,
      hint: R`$\frac{\alpha_{\nu+1}}{\alpha_\nu} = \frac{\nu + 1}{2\nu}$· τι γίνεται για $\nu = 1$;`,
      sol: R`$\frac{\alpha_{\nu+1}}{\alpha_\nu} = \frac{\nu + 1}{2\nu} \le 1$, με ισότητα μόνο για $\nu = 1$ ($\alpha_1 = \alpha_2 = \frac12$). Άρα φθίνουσα, όχι γνησίως.` }
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

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
  storeKey: "pagk-επλ111-v1",
  heroTitle: "Διακριτές Δομές (ΕΠΛ111)",
  tefxos: "μαθήματος ΕΠΛ111",
  howto: `<ul><li>Αριθμοί: <code>12</code> · κλάσματα: <code>3/4</code> ή <code>-5/6</code> · δεκαδικοί: <code>2,5</code></li>
    <li>Πολλά πεδία; Γράψε κάθε απάντηση στο δικό της πεδίο, με τη σειρά που ζητείται.</li>
    <li>Υλικό για το αντίστοιχο μάθημα 1ου έτους (Πανεπιστήμιο Κύπρου).</li></ul>`
};

const UNITS = [
  { id: 1, title: "Κεφ. 1 · Λογική" },
  { id: 2, title: "Κεφ. 2 · Σύνολα και συναρτήσεις" },
  { id: 3, title: "Κεφ. 3 · Αποδείξεις – Επαγωγή" },
  { id: 4, title: "Κεφ. 4 · Απαρίθμηση" },
  { id: 5, title: "Κεφ. 5 · Αναδρομικές σχέσεις" },
  { id: 6, title: "Κεφ. 6 · Σχέσεις" },
  { id: 7, title: "Κεφ. 7 · Γραφήματα" }
];

const SECTIONS = [
/* ───────────────────────────── 1.1 ───────────────────────────── */
{
  id: "1.1", unit: 1, title: "Προτασιακή λογική",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 1 · Βλ. και Rosen §1.1",
  theory: R`
<style>.dsath{border-collapse:collapse;margin:8px auto;font-size:14px}.dsath th,.dsath td{border:1px solid var(--line);padding:3px 9px;text-align:center}.dsath th{background:#f3f6fb}</style>
<div class="tbox"><h4>Προτάσεις και λογικοί σύνδεσμοι</h4>
<p><b>Πρόταση</b> είναι μια δηλωτική φράση που είναι <b>είτε αληθής (Α) είτε ψευδής (Ψ)</b>, όχι και τα δύο. Π.χ. «$2 + 3 = 5$» (Α), «το $7$ είναι άρτιος» (Ψ). Δεν είναι προτάσεις οι ερωτήσεις, οι εντολές και φράσεις με ελεύθερη μεταβλητή όπως «$x + 1 = 3$».</p>
<p>Από απλές προτάσεις $p, q$ σχηματίζουμε σύνθετες: <b>άρνηση</b> $\lnot p$, <b>σύζευξη</b> $p \land q$ («και»), <b>διάζευξη</b> $p \lor q$ («ή» — εγκλειστικό), <b>αποκλειστική διάζευξη</b> $p \oplus q$ (ακριβώς μία αληθής), <b>συνεπαγωγή</b> $p \to q$ και <b>διπλή συνεπαγωγή</b> $p \leftrightarrow q$.</p>
<div style="overflow-x:auto"><table class="dsath"><tr><th>$p$</th><th>$q$</th><th>$\lnot p$</th><th>$p \land q$</th><th>$p \lor q$</th><th>$p \oplus q$</th><th>$p \to q$</th><th>$p \leftrightarrow q$</th></tr>
<tr><td>Α</td><td>Α</td><td>Ψ</td><td>Α</td><td>Α</td><td>Ψ</td><td>Α</td><td>Α</td></tr>
<tr><td>Α</td><td>Ψ</td><td>Ψ</td><td>Ψ</td><td>Α</td><td>Α</td><td>Ψ</td><td>Ψ</td></tr>
<tr><td>Ψ</td><td>Α</td><td>Α</td><td>Ψ</td><td>Α</td><td>Α</td><td>Α</td><td>Ψ</td></tr>
<tr><td>Ψ</td><td>Ψ</td><td>Α</td><td>Ψ</td><td>Ψ</td><td>Ψ</td><td>Α</td><td>Α</td></tr></table></div></div>
<div class="tbox tip"><h4>Η συνεπαγωγή $p \to q$</h4>
<p>Είναι <b>ψευδής μόνο όταν</b> η υπόθεση $p$ είναι αληθής και το συμπέρασμα $q$ ψευδές. Όταν η $p$ είναι ψευδής, η $p \to q$ είναι αληθής «κατά κενό τρόπο».</p>
<p>Διατυπώσεις: «αν $p$ τότε $q$», «$q$ όταν $p$», «$p$ μόνο αν $q$», «η $p$ είναι <b>ικανή</b> συνθήκη για την $q$», «η $q$ είναι <b>αναγκαία</b> συνθήκη για την $p$».</p>
<p>Από την $p \to q$ προκύπτουν: <b>αντίστροφη</b> $q \to p$, <b>αντίθετη</b> $\lnot p \to \lnot q$, <b>αντιθετοαντίστροφη</b> $\lnot q \to \lnot p$. Μόνο η αντιθετοαντίστροφη είναι ισοδύναμη με την αρχική· η αντίστροφη και η αντίθετη είναι ισοδύναμες μεταξύ τους.</p></div>
<div class="tbox"><h4>Πίνακας αληθείας και προτεραιότητα</h4>
<p>Ένας τύπος με $n$ προτασιακές μεταβλητές έχει πίνακα αληθείας με $2^n$ γραμμές. Προτεραιότητα συνδέσμων: $\lnot$, μετά $\land$, μετά $\lor$ (και $\oplus$), μετά $\to$, τέλος $\leftrightarrow$. Έτσι $p \lor q \to \lnot r$ σημαίνει $(p \lor q) \to (\lnot r)$ — στην πράξη βάζουμε παρενθέσεις για σαφήνεια.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη</h4>
<ul><li>Το «$p$ μόνο αν $q$» είναι $p \to q$ — <b>όχι</b> $q \to p$.</li>
<li>Το «ή» της λογικής είναι εγκλειστικό: η $p \lor q$ είναι αληθής και όταν ισχύουν και οι δύο.</li>
<li>Η $p \to q$ δεν δηλώνει αιτιότητα: «αν $2 + 2 = 5$ τότε το φεγγάρι είναι πράσινο» είναι αληθής.</li></ul></div>`,
  widget: "dsaTruth",
  gen: "dsaTT",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια από τις παρακάτω φράσεις είναι πρόταση;`,
      options: ["«Το 7 είναι άρτιος αριθμός.»", "«Κλείσε την πόρτα.»", "«$x + 2 = 5$»", "«Τι ώρα είναι;»"], correct: 0,
      hint: R`Πρόταση: δηλωτική φράση με ορισμένη τιμή αληθείας — ακόμη κι αν είναι ψευδής.`,
      sol: R`Η «Το 7 είναι άρτιος» είναι πρόταση (ψευδής). Η εντολή και η ερώτηση δεν δηλώνουν κάτι, και η «$x + 2 = 5$» εξαρτάται από το $x$ (είναι κατηγόρημα, όχι πρόταση).` },
    { level: 1, type: "fields", q: R`Πόσες γραμμές έχει ο πίνακας αληθείας ενός τύπου με $5$ διαφορετικές προτασιακές μεταβλητές;`, fields: [{ label: "γραμμές =", ans: 32 }],
      hint: R`Κάθε μεταβλητή παίρνει $2$ τιμές.`, sol: R`$2^5 = 32$ συνδυασμοί τιμών αληθείας.` },
    { level: 1, type: "mc", q: R`Έστω $p$: «$2 + 2 = 5$» και $q$: «το $3$ είναι πρώτος αριθμός». Ποια είναι η τιμή αληθείας της $p \to q$; (Α = αληθής, Ψ = ψευδής)`,
      options: ["Α", "Ψ"], correct: 0, hint: R`Η $p$ είναι ψευδής.`,
      sol: R`$p = $ Ψ, $q = $ Α. Η συνεπαγωγή είναι ψευδής μόνο για Α $\to$ Ψ· εδώ είναι Ψ $\to$ Α, άρα αληθής (μάλιστα θα ήταν αληθής για κάθε $q$, αφού η υπόθεση είναι ψευδής).` },
    { level: 1, type: "mc", q: R`Αν $p = $ Α και $q = $ Ψ, ποια είναι η τιμή αληθείας του $(p \lor q) \to (p \land q)$;`,
      options: ["Α", "Ψ"], correct: 1, hint: R`Υπολόγισε χωριστά υπόθεση και συμπέρασμα.`,
      sol: R`$p \lor q = $ Α, $p \land q = $ Ψ, άρα Α $\to$ Ψ $=$ Ψ.` },
    { level: 2, type: "fields", q: R`Σε πόσες από τις $8$ γραμμές του πίνακα αληθείας είναι αληθής ο τύπος $(p \to q) \land (q \to r)$;`, fields: [{ label: "γραμμές =", ans: 4 }],
      hint: R`Ο τύπος είναι ψευδής όταν $p = $ Α, $q = $ Ψ ή όταν $q = $ Α, $r = $ Ψ.`,
      sol: R`Πρέπει «αν $p$ τότε $q$» και «αν $q$ τότε $r$». Οι αληθείς γραμμές $(p, q, r)$: ΑΑΑ, ΨΑΑ, ΨΨΑ, ΨΨΨ — δηλαδή $4$.` },
    { level: 2, type: "mc", q: R`Έστω $p$: «παίρνεις υποτροφία» και $q$: «έχεις βαθμό πάνω από 18». Πώς γράφεται η πρόταση «Παίρνεις υποτροφία <b>μόνο αν</b> έχεις βαθμό πάνω από 18»;`,
      options: ["$p \\to q$", "$q \\to p$", "$p \\leftrightarrow q$", "$p \\land q$"], correct: 0,
      hint: R`«$p$ μόνο αν $q$»: η $q$ είναι αναγκαία συνθήκη για την $p$.`,
      sol: R`«$p$ μόνο αν $q$» σημαίνει ότι δεν γίνεται να ισχύει $p$ χωρίς $q$, δηλαδή $p \to q$. Ο βαθμός είναι αναγκαίος, όχι ικανός — άρα όχι $q \to p$.` },
    { level: 2, type: "mc", q: R`Ποια είναι η <b>αντιθετοαντίστροφη</b> της πρότασης «Αν ένα πολύγωνο είναι τετράγωνο, τότε έχει τέσσερις πλευρές»;`,
      options: ["Αν ένα πολύγωνο δεν έχει τέσσερις πλευρές, τότε δεν είναι τετράγωνο.", "Αν ένα πολύγωνο έχει τέσσερις πλευρές, τότε είναι τετράγωνο.", "Αν ένα πολύγωνο δεν είναι τετράγωνο, τότε δεν έχει τέσσερις πλευρές.", "Ένα πολύγωνο είναι τετράγωνο και δεν έχει τέσσερις πλευρές."], correct: 0,
      hint: R`Αντιθετοαντίστροφη της $p \to q$: $\lnot q \to \lnot p$.`,
      sol: R`$\lnot q \to \lnot p$: «Αν δεν έχει τέσσερις πλευρές, τότε δεν είναι τετράγωνο». Η «αν έχει τέσσερις πλευρές, είναι τετράγωνο» είναι η αντίστροφη (και είναι ψευδής — π.χ. ορθογώνιο), η «αν δεν είναι τετράγωνο, δεν έχει τέσσερις πλευρές» είναι η αντίθετη, και η «είναι τετράγωνο και δεν έχει τέσσερις πλευρές» είναι η άρνηση της αρχικής.` },
    { level: 2, type: "mc", q: R`Η αντίστροφη μιας συνεπαγωγής είναι λογικά ισοδύναμη με την αντίθετή της.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Η αντίθετη της $q \to p$…`,
      sol: R`Σωστό: η αντίθετη $\lnot p \to \lnot q$ είναι η αντιθετοαντίστροφη της αντίστροφης $q \to p$, άρα $q \to p \equiv \lnot p \to \lnot q$.` },
    { level: 3, type: "fields", q: R`Σε πόσες από τις $8$ γραμμές είναι αληθής ο $p \oplus q \oplus r$;`, fields: [{ label: "γραμμές =", ans: 4 }],
      hint: R`Ο τύπος είναι αληθής όταν ένα περιττό πλήθος μεταβλητών είναι αληθείς.`,
      sol: R`Η $\oplus$ είναι προσεταιριστική και ο $p \oplus q \oplus r$ είναι αληθής ακριβώς όταν $1$ ή $3$ από τις μεταβλητές είναι αληθείς: $\binom31 + \binom33 = 3 + 1 = 4$ γραμμές.` },
    { level: 3, type: "mc", q: R`Σε ένα νησί οι <i>ιππότες</i> λένε πάντα την αλήθεια και οι <i>απατεώνες</i> πάντα ψέματα. Ο Α λέει: «Τουλάχιστον ένας από εμάς τους δύο είναι απατεώνας». Τι είναι ο Α και ο Β;`,
      options: ["Ο Α ιππότης, ο Β απατεώνας", "Και οι δύο ιππότες", "Και οι δύο απατεώνες", "Ο Α απατεώνας, ο Β ιππότης"], correct: 0,
      hint: R`Αν ο Α ήταν απατεώνας, η δήλωσή του θα ήταν αληθής.`,
      sol: R`Αν ο Α ήταν απατεώνας, τότε «τουλάχιστον ένας είναι απατεώνας» θα ήταν αληθές — όμως οι απατεώνες δεν λένε αλήθεια. Άτοπο, άρα ο Α είναι ιππότης και η δήλωση αληθής: αφού ο Α δεν είναι απατεώνας, ο Β είναι απατεώνας.` }
  ]
},
/* ───────────────────────────── 1.2 ───────────────────────────── */
{
  id: "1.2", unit: 1, title: "Λογικές ισοδυναμίες – Κανονικές μορφές",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 1 · Βλ. και Rosen §1.3",
  theory: R`
<div class="tbox"><h4>Ταυτολογίες και ισοδυναμίες</h4>
<p>Ένας σύνθετος τύπος λέγεται <b>ταυτολογία</b> αν είναι αληθής σε κάθε γραμμή του πίνακα αληθείας (π.χ. $p \lor \lnot p$), <b>αντίφαση</b> αν είναι ψευδής σε κάθε γραμμή (π.χ. $p \land \lnot p$), και <b>ενδεχόμενη</b> αλλιώς.</p>
<p>Οι τύποι $F, G$ είναι <b>λογικά ισοδύναμοι</b>, $F \equiv G$, αν ο $F \leftrightarrow G$ είναι ταυτολογία — δηλαδή έχουν την ίδια στήλη στον πίνακα αληθείας.</p></div>
<div class="tbox tip"><h4>Βασικοί νόμοι</h4>
<ul><li><b>De Morgan:</b> $\lnot(p \land q) \equiv \lnot p \lor \lnot q$, $\ \lnot(p \lor q) \equiv \lnot p \land \lnot q$.</li>
<li><b>Συνεπαγωγή:</b> $p \to q \equiv \lnot p \lor q \equiv \lnot q \to \lnot p$, $\ \lnot(p \to q) \equiv p \land \lnot q$, $\ p \leftrightarrow q \equiv (p \to q) \land (q \to p)$.</li>
<li><b>Επιμεριστικοί:</b> $p \lor (q \land r) \equiv (p \lor q) \land (p \lor r)$, $\ p \land (q \lor r) \equiv (p \land q) \lor (p \land r)$.</li>
<li><b>Απορρόφησης:</b> $p \lor (p \land q) \equiv p$, $\ p \land (p \lor q) \equiv p$. <b>Διπλή άρνηση:</b> $\lnot\lnot p \equiv p$.</li>
<li><b>Ταυτοτικοί / κυριαρχίας:</b> $p \land \textbf{Α} \equiv p$, $p \lor \textbf{Ψ} \equiv p$, $p \lor \textbf{Α} \equiv \textbf{Α}$, $p \land \textbf{Ψ} \equiv \textbf{Ψ}$ (Α: ταυτολογία, Ψ: αντίφαση).</li>
<li>Επίσης: $(p \to r) \land (q \to r) \equiv (p \lor q) \to r$ και $p \to (q \to r) \equiv (p \land q) \to r$.</li></ul></div>
<div class="tbox warn"><h4>Παράδειγμα (αλγεβρική απόδειξη)</h4>
<p>$\lnot(p \lor (\lnot p \land q)) \equiv \lnot p \land \lnot(\lnot p \land q)$ (De Morgan) $\equiv \lnot p \land (p \lor \lnot q)$ (De Morgan, διπλή άρνηση) $\equiv (\lnot p \land p) \lor (\lnot p \land \lnot q)$ (επιμεριστικός) $\equiv \textbf{Ψ} \lor (\lnot p \land \lnot q) \equiv \lnot p \land \lnot q$.</p></div>
<div class="tbox"><h4>Κανονικές μορφές</h4>
<p><b>Διαζευκτική κανονική μορφή (ΔΚΜ):</b> διάζευξη από συζεύξεις «γραμμάτων» ($p$ ή $\lnot p$). Από τον πίνακα αληθείας: για κάθε γραμμή όπου ο τύπος είναι <b>Α</b> γράφουμε τη σύζευξη που περιγράφει τη γραμμή, π.χ. $p \oplus q \equiv (p \land \lnot q) \lor (\lnot p \land q)$.</p>
<p><b>Συζευκτική κανονική μορφή (ΣΚΜ):</b> σύζευξη από διαζεύξεις, από τις γραμμές όπου ο τύπος είναι <b>Ψ</b>. Επομένως κάθε τύπος εκφράζεται με τους $\lnot, \land, \lor$ — το σύνολο $\{\lnot, \land, \lor\}$ είναι <b>πλήρες</b> (και τα $\{\lnot, \land\}$, $\{\lnot, \lor\}$, λόγω De Morgan).</p></div>`,
  widget: "dsaEquiv",
  gen: "dsaEq",
  exercises: [
    { level: 1, type: "mc", q: R`Ο τύπος $(p \land q) \to (p \lor q)$ είναι:`, options: ["Ταυτολογία", "Αντίφαση", "Ενδεχόμενη"], correct: 0,
      hint: R`Πότε θα μπορούσε να είναι ψευδής;`,
      sol: R`Για να είναι ψευδής θα έπρεπε $p \land q = $ Α και $p \lor q = $ Ψ, που είναι αδύνατο. Άρα ταυτολογία.` },
    { level: 1, type: "mc", q: R`Ποιος τύπος είναι λογικά ισοδύναμος με τον $p \to q$;`, options: ["$\\lnot p \\lor q$", "$p \\lor \\lnot q$", "$q \\to p$", "$\\lnot p \\to \\lnot q$"], correct: 0,
      hint: R`Η συνεπαγωγή είναι ψευδής μόνο για $p = $ Α, $q = $ Ψ.`, sol: R`$p \to q \equiv \lnot p \lor q$. Οι $q \to p$ και $\lnot p \to \lnot q$ είναι η αντίστροφη και η αντίθετη, ενώ ο $p \lor \lnot q \equiv q \to p$.` },
    { level: 1, type: "mc", q: R`Ποιος τύπος είναι λογικά ισοδύναμος με τον $\lnot(p \land \lnot q)$;`, options: ["$\\lnot p \\lor q$", "$\\lnot p \\land q$", "$p \\lor \\lnot q$", "$\\lnot p \\lor \\lnot q$"], correct: 0,
      hint: R`De Morgan και διπλή άρνηση.`, sol: R`$\lnot(p \land \lnot q) \equiv \lnot p \lor \lnot\lnot q \equiv \lnot p \lor q$ (δηλαδή $p \to q$).` },
    { level: 2, type: "mc", q: R`Ισχύει $(p \to q) \to r \equiv p \to (q \to r)$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Δοκίμασε $p = $ Ψ, $r = $ Ψ.`,
      sol: R`Λάθος: για $p = $ Ψ, $r = $ Ψ (και οποιοδήποτε $q$) ο αριστερός είναι $(\text{Α}) \to \text{Ψ} = $ Ψ, ενώ ο δεξιός είναι Ψ $\to (\dots) = $ Α. Η συνεπαγωγή δεν είναι προσεταιριστική.` },
    { level: 2, type: "mc", q: R`Ισχύει $(p \to r) \land (q \to r) \equiv (p \lor q) \to r$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Γράψε κάθε συνεπαγωγή ως διάζευξη.`,
      sol: R`Σωστό: $(\lnot p \lor r) \land (\lnot q \lor r) \equiv (\lnot p \land \lnot q) \lor r \equiv \lnot(p \lor q) \lor r \equiv (p \lor q) \to r$ (επιμεριστικός, De Morgan).` },
    { level: 2, type: "fields", q: R`Από πόσους ελαχιστόρους (όρους-συζεύξεις) αποτελείται η πλήρης ΔΚΜ του $p \to (q \land r)$ με μεταβλητές $p, q, r$;`, fields: [{ label: "όροι =", ans: 5 }],
      hint: R`Ένας όρος για κάθε γραμμή όπου ο τύπος είναι αληθής.`,
      sol: R`Ο τύπος είναι αληθής όταν $p = $ Ψ ($4$ γραμμές) ή όταν $p = q = r = $ Α ($1$ γραμμή): $5$ ελαχιστόροι.` },
    { level: 2, type: "mc", q: R`Ποια είναι η ΔΚΜ του $p \oplus q$;`, options: ["$(p \\land \\lnot q) \\lor (\\lnot p \\land q)$", "$(p \\land q) \\lor (\\lnot p \\land \\lnot q)$", "$(p \\land \\lnot q) \\lor (p \\land q)$", "$(\\lnot p \\land \\lnot q) \\lor (\\lnot p \\land q)$"], correct: 0,
      hint: R`Ο $p \oplus q$ είναι αληθής στις γραμμές ΑΨ και ΨΑ.`,
      sol: R`Γραμμή ΑΨ: $p \land \lnot q$· γραμμή ΨΑ: $\lnot p \land q$. Η ΔΚΜ είναι η διάζευξή τους. Ο $(p\land q)\lor(\lnot p\land\lnot q)$ είναι ο $p\leftrightarrow q$, ο $(p\land\lnot q)\lor(p\land q)$ ισοδυναμεί με $p$ και ο $(\lnot p\land\lnot q)\lor(\lnot p\land q)$ με $\lnot p$.` },
    { level: 3, type: "mc", q: R`Με χρήση των νόμων της λογικής, ο τύπος $\lnot(p \lor (\lnot p \land q))$ απλοποιείται σε:`, options: ["$\\lnot p \\land \\lnot q$", "$\\lnot p \\lor \\lnot q$", "$\\lnot q$", "$p \\land \\lnot q$"], correct: 0,
      hint: R`De Morgan, μετά επιμεριστικός.`,
      sol: R`$\lnot p \land \lnot(\lnot p \land q) \equiv \lnot p \land (p \lor \lnot q) \equiv (\lnot p \land p) \lor (\lnot p \land \lnot q) \equiv \lnot p \land \lnot q$.` },
    { level: 3, type: "fields", q: R`Πόσοι διαφορετικοί (μη ισοδύναμοι ανά δύο) τύποι υπάρχουν με δύο προτασιακές μεταβλητές $p, q$;`, fields: [{ label: "πλήθος =", ans: 16 }],
      hint: R`Ένας τύπος καθορίζεται (ως προς ισοδυναμία) από τη στήλη του στον πίνακα αληθείας.`,
      sol: R`Ο πίνακας έχει $4$ γραμμές και κάθε θέση της στήλης είναι Α ή Ψ: $2^4 = 16$ διαφορετικές στήλες, άρα $16$ κλάσεις ισοδύναμων τύπων. Όλες υλοποιούνται, π.χ. μέσω της ΔΚΜ τους.` },
    { level: 3, type: "mc", q: R`Ποιο από τα παρακάτω σύνολα συνδέσμων <b>δεν</b> είναι πλήρες (δεν εκφράζει κάθε τύπο);`, options: ["$\\{\\land, \\lor\\}$", "$\\{\\lnot, \\land\\}$", "$\\{\\lnot, \\lor\\}$", "$\\{\\lnot, \\land, \\lor\\}$"], correct: 0,
      hint: R`Τι τιμή παίρνει ένας τύπος μόνο με $\land, \lor$ όταν όλες οι μεταβλητές είναι Α;`,
      sol: R`Κάθε τύπος μόνο με $\land, \lor$ είναι αληθής όταν όλες οι μεταβλητές είναι Α, άρα δεν μπορεί να εκφράσει την $\lnot p$. Τα άλλα είναι πλήρη: $\{\lnot, \land, \lor\}$ από τη ΔΚΜ και τα δύο μικρότερα μέσω De Morgan ($p \lor q \equiv \lnot(\lnot p \land \lnot q)$).` }
  ]
},
/* ───────────────────────────── 1.3 ───────────────────────────── */
{
  id: "1.3", unit: 1, title: "Κατηγορηματική λογική – Ποσοδείκτες",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 1 · Βλ. και Rosen §1.4–1.5",
  theory: R`
<div class="tbox"><h4>Κατηγορήματα και ποσοδείκτες</h4>
<p>Ένα <b>κατηγόρημα</b> $P(x)$ (π.χ. «$x > 3$») γίνεται πρόταση όταν δώσουμε τιμή στη μεταβλητή $x$ από ένα <b>σύμπαν</b> (πεδίο ορισμού) $D$, ή όταν τη δεσμεύσουμε με ποσοδείκτη:</p>
<ul><li><b>Καθολικός</b>: $\forall x\, P(x)$ — αληθής αν η $P(x)$ ισχύει για <b>κάθε</b> $x \in D$· ένα <b>αντιπαράδειγμα</b> αρκεί για να είναι ψευδής.</li>
<li><b>Υπαρξιακός</b>: $\exists x\, P(x)$ — αληθής αν υπάρχει <b>τουλάχιστον ένα</b> $x \in D$ με $P(x)$.</li></ul>
<p>Σε πεπερασμένο σύμπαν $D = \{x_1, \dots, x_n\}$: $\forall x\, P(x) \equiv P(x_1) \land \dots \land P(x_n)$ και $\exists x\, P(x) \equiv P(x_1) \lor \dots \lor P(x_n)$. Η τιμή αληθείας εξαρτάται από το σύμπαν: $\exists x\,(x^2 = 2)$ είναι Ψ στο $\mathbb Q$ και Α στο $\mathbb R$.</p></div>
<div class="tbox tip"><h4>Άρνηση (νόμοι De Morgan για ποσοδείκτες)</h4>
<p>$\lnot\forall x\, P(x) \equiv \exists x\, \lnot P(x)$ και $\lnot\exists x\, P(x) \equiv \forall x\, \lnot P(x)$. Για εμφωλευμένους: $\lnot\forall x\, \exists y\, Q(x, y) \equiv \exists x\, \forall y\, \lnot Q(x, y)$ — η άρνηση «περνά» μέσα αλλάζοντας κάθε ποσοδείκτη.</p>
<p>Περιορισμένοι ποσοδείκτες: $\forall x > 0\; P(x) \equiv \forall x\,(x > 0 \to P(x))$, ενώ $\exists x > 0\; P(x) \equiv \exists x\,(x > 0 \land P(x))$.</p></div>
<div class="tbox"><h4>Εμφωλευμένοι ποσοδείκτες — η σειρά μετράει</h4>
<p>Στο $\mathbb Z$: $\forall x\, \exists y\,(x + y = 0)$ είναι <b>αληθής</b> (για κάθε $x$ παίρνουμε $y = -x$, που εξαρτάται από το $x$), ενώ $\exists y\, \forall x\,(x + y = 0)$ είναι <b>ψευδής</b> (δεν υπάρχει ένα $y$ για όλα τα $x$). Ποσοδείκτες ίδιου είδους μπορούν να εναλλαχθούν: $\forall x\, \forall y \equiv \forall y\, \forall x$.</p></div>
<div class="tbox warn"><h4>Μετάφραση από τη φυσική γλώσσα</h4>
<p>«Κάθε φοιτητής έχει υπολογιστή»: $\forall x\,(S(x) \to C(x))$ — <b>όχι</b> $\forall x\,(S(x) \land C(x))$, που λέει ότι όλοι είναι φοιτητές. «Κάποιος φοιτητής έχει υπολογιστή»: $\exists x\,(S(x) \land C(x))$ — <b>όχι</b> $\exists x\,(S(x) \to C(x))$, που αληθεύει αρκεί να υπάρχει κάποιος μη φοιτητής.</p></div>`,
  widget: "dsaQuant",
  gen: "dsaQ",
  exercises: [
    { level: 1, type: "mc", q: R`Με σύμπαν το $\mathbb Z$, η πρόταση $\forall x\,(x^2 \ge 0)$ είναι αληθής.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Το τετράγωνο κάθε ακεραίου…`, sol: R`Σωστό: το τετράγωνο κάθε ακεραίου (γενικά κάθε πραγματικού) είναι μη αρνητικό.` },
    { level: 1, type: "mc", q: R`Με σύμπαν το $\mathbb R$, η πρόταση $\exists x\,(x^2 = -1)$ είναι αληθής.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Μπορεί ένα τετράγωνο πραγματικού να είναι αρνητικό;`, sol: R`Λάθος: $x^2 \ge 0 > -1$ για κάθε $x \in \mathbb R$ (στο $\mathbb C$ θα ήταν αληθής).` },
    { level: 1, type: "mc", q: R`Ποια είναι η άρνηση της πρότασης $\forall x\,(P(x) \to Q(x))$;`,
      options: ["$\\exists x\\,(P(x) \\land \\lnot Q(x))$", "$\\forall x\\,(P(x) \\land \\lnot Q(x))$", "$\\exists x\\,(\\lnot P(x) \\to \\lnot Q(x))$", "$\\exists x\\,(P(x) \\to \\lnot Q(x))$"], correct: 0,
      hint: R`$\lnot\forall \equiv \exists\lnot$ και $\lnot(p \to q) \equiv p \land \lnot q$.`, sol: R`$\lnot\forall x\,(P \to Q) \equiv \exists x\, \lnot(P(x) \to Q(x)) \equiv \exists x\,(P(x) \land \lnot Q(x))$: υπάρχει $x$ με $P$ αλλά όχι $Q$.` },
    { level: 2, type: "mc", q: R`Με σύμπαν όλους τους ανθρώπους, $S(x)$: «ο $x$ είναι φοιτητής της τάξης» και $C(x)$: «ο $x$ έχει υπολογιστή». Πώς γράφεται «Κάθε φοιτητής της τάξης έχει υπολογιστή»;`,
      options: ["$\\forall x\\,(S(x) \\to C(x))$", "$\\forall x\\,(S(x) \\land C(x))$", "$\\exists x\\,(S(x) \\land C(x))$", "$\\forall x\\, S(x) \\to \\forall x\\, C(x)$"], correct: 0,
      hint: R`Ο καθολικός ποσοδείκτης πάει μαζί με τη συνεπαγωγή.`,
      sol: R`«Για κάθε $x$: αν είναι φοιτητής τότε έχει υπολογιστή» $= \forall x\,(S(x) \to C(x))$. Το $\forall x\,(S(x) \land C(x))$ λέει ότι όλοι οι άνθρωποι είναι φοιτητές με υπολογιστή, ενώ το $\forall x\,S(x) \to \forall x\,C(x)$ είναι αληθές κατά κενό τρόπο, αφού δεν είναι όλοι φοιτητές.` },
    { level: 2, type: "mc", q: R`Με σύμπαν όλους τους ανθρώπους, $S(x)$: «ο $x$ είναι φοιτητής της τάξης» και $C(x)$: «ο $x$ έχει υπολογιστή». Πώς γράφεται «Κάποιος φοιτητής της τάξης δεν έχει υπολογιστή»;`,
      options: ["$\\exists x\\,(S(x) \\land \\lnot C(x))$", "$\\exists x\\,(S(x) \\to \\lnot C(x))$", "$\\lnot\\exists x\\,(S(x) \\land C(x))$", "$\\forall x\\,(S(x) \\to \\lnot C(x))$"], correct: 0,
      hint: R`Ο υπαρξιακός ποσοδείκτης πάει μαζί με τη σύζευξη.`,
      sol: R`$\exists x\,(S(x) \land \lnot C(x))$ — που είναι και η άρνηση του «κάθε φοιτητής έχει υπολογιστή». Το $\exists x\,(S(x) \to \lnot C(x))$ αληθεύει για οποιονδήποτε μη φοιτητή, και τα άλλα δύο λένε ότι <i>κανένας</i> φοιτητής δεν έχει υπολογιστή.` },
    { level: 2, type: "mc", q: R`Με σύμπαν το $\mathbb Z$, η πρόταση $\forall x\, \exists y\,(x + y = 0)$ είναι αληθής.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Για δοσμένο $x$, ποιο $y$ δουλεύει;`, sol: R`Σωστό: για κάθε $x$ παίρνουμε $y = -x \in \mathbb Z$.` },
    { level: 2, type: "mc", q: R`Με σύμπαν το $\mathbb Z$, η πρόταση $\exists y\, \forall x\,(x + y = 0)$ είναι αληθής.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ένα σταθερό $y$ πρέπει να δουλεύει για όλα τα $x$.`, sol: R`Λάθος: για οποιοδήποτε $y$, το $x = 1 - y$ δίνει $x + y = 1 \ne 0$. Η αλλαγή της σειράς των ποσοδεικτών αλλάζει το νόημα.` },
    { level: 2, type: "mc", q: R`Με σύμπαν τους θετικούς ακεραίους $\mathbb Z^+ = \{1, 2, 3, \dots\}$, η πρόταση $\exists x\, \forall y\,(x \le y)$ είναι αληθής.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Υπάρχει ελάχιστο στοιχείο;`, sol: R`Σωστό: $x = 1$ είναι μικρότερο ή ίσο από κάθε θετικό ακέραιο. (Στο $\mathbb Z$ θα ήταν ψευδής.)` },
    { level: 3, type: "fields", q: R`Σύμπαν $D = \{1, 2, 3, 4\}$ και $Q(x, y)$: «ο $x$ διαιρεί τον $y$». Για πόσα διατεταγμένα ζεύγη $(x, y) \in D \times D$ είναι αληθής η $Q(x, y)$; Είναι αληθής η $\forall y\, \exists x\,(x \ne y \land Q(x, y))$; (γράψε $1$ για Α, $0$ για Ψ)`,
      fields: [{ label: "ζεύγη =", ans: 8 }, { label: "Α=1 / Ψ=0:", ans: 0 }],
      hint: R`Μέτρησε τους διαιρέτες κάθε $y$ μέσα στο $D$.`,
      sol: R`Διαιρέτες στο $D$: του $1$: $\{1\}$, του $2$: $\{1, 2\}$, του $3$: $\{1, 3\}$, του $4$: $\{1, 2, 4\}$ — σύνολο $1 + 2 + 2 + 3 = 8$ ζεύγη. Η δεύτερη πρόταση είναι ψευδής: για $y = 1$ ο μόνος διαιρέτης είναι το ίδιο το $1$.` },
    { level: 3, type: "mc", q: R`Ποια είναι η άρνηση της πρότασης $\forall \varepsilon > 0\; \exists \delta > 0\; \forall x\,(|x - a| < \delta \to |f(x) - L| < \varepsilon)$ (ορισμός του ορίου);`,
      options: ["$\\exists \\varepsilon > 0\\; \\forall \\delta > 0\\; \\exists x\\,(|x - a| < \\delta \\land |f(x) - L| \\ge \\varepsilon)$", "$\\exists \\varepsilon > 0\\; \\forall \\delta > 0\\; \\exists x\\,(|x - a| < \\delta \\to |f(x) - L| \\ge \\varepsilon)$", "$\\forall \\varepsilon > 0\\; \\exists \\delta > 0\\; \\exists x\\,(|x - a| \\ge \\delta \\land |f(x) - L| < \\varepsilon)$", "$\\exists \\varepsilon > 0\\; \\forall \\delta > 0\\; \\forall x\\,(|x - a| \\ge \\delta \\lor |f(x) - L| \\ge \\varepsilon)$"], correct: 0,
      hint: R`Άλλαξε κάθε ποσοδείκτη και αρνήσου τη συνεπαγωγή.`,
      sol: R`Κάθε $\forall$ γίνεται $\exists$ και αντίστροφα (οι περιορισμοί $\varepsilon > 0$, $\delta > 0$ μένουν ίδιοι), και $\lnot(A \to B) \equiv A \land \lnot B$: $\exists \varepsilon > 0\; \forall \delta > 0\; \exists x\,(|x - a| < \delta \land |f(x) - L| \ge \varepsilon)$.` }
  ]
},
/* ───────────────────────────── 1.4 ───────────────────────────── */
{
  id: "1.4", unit: 1, title: "Κανόνες συμπερασμού – Έγκυρα επιχειρήματα",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 1 · Βλ. και Rosen §1.6",
  theory: R`
<div class="tbox"><h4>Επιχειρήματα</h4>
<p>Ένα <b>επιχείρημα</b> αποτελείται από υποθέσεις $p_1, \dots, p_n$ και ένα συμπέρασμα $q$. Είναι <b>έγκυρο</b> αν ο τύπος $(p_1 \land \dots \land p_n) \to q$ είναι ταυτολογία: σε κάθε γραμμή όπου όλες οι υποθέσεις είναι αληθείς, είναι αληθές και το συμπέρασμα. Η εγκυρότητα αφορά τη <b>μορφή</b>, όχι την αλήθεια των υποθέσεων.</p></div>
<div class="tbox tip"><h4>Κανόνες συμπερασμού</h4>
<ul><li><b>Τρόπος του θέτειν</b> (modus ponens): $p \to q,\ p \ \vdash\ q$.</li>
<li><b>Τρόπος του αναιρείν</b> (modus tollens): $p \to q,\ \lnot q \ \vdash\ \lnot p$.</li>
<li><b>Υποθετικός συλλογισμός</b>: $p \to q,\ q \to r \ \vdash\ p \to r$.</li>
<li><b>Διαζευκτικός συλλογισμός</b>: $p \lor q,\ \lnot p \ \vdash\ q$.</li>
<li><b>Πρόσθεση</b> $p \vdash p \lor q$ · <b>Απλοποίηση</b> $p \land q \vdash p$ · <b>Σύζευξη</b> $p,\ q \vdash p \land q$.</li>
<li><b>Ανάλυση</b> (resolution): $p \lor q,\ \lnot p \lor r \ \vdash\ q \lor r$.</li></ul>
<p>Με ποσοδείκτες: <b>καθολική εξειδίκευση</b> ($\forall x\, P(x) \vdash P(c)$), <b>καθολική γενίκευση</b> ($P(c)$ για αυθαίρετο $c$ $\vdash \forall x\, P(x)$), <b>υπαρξιακή εξειδίκευση/γενίκευση</b>. Συνδυασμός: <b>καθολικός τρόπος του θέτειν</b> — «Όλοι οι άνθρωποι είναι θνητοί. Ο Σωκράτης είναι άνθρωπος. Άρα είναι θνητός».</p></div>
<div class="tbox warn"><h4>Πλάνες (μη έγκυρα σχήματα)</h4>
<ul><li><b>Επιβεβαίωση του επομένου</b>: $p \to q,\ q \ \nvdash\ p$ (για $p = $ Ψ, $q = $ Α οι υποθέσεις ισχύουν, το συμπέρασμα όχι).</li>
<li><b>Άρνηση του ηγουμένου</b>: $p \to q,\ \lnot p \ \nvdash\ \lnot q$.</li>
<li><b>Κυκλικός συλλογισμός</b>: χρησιμοποιούμε ως υπόθεση αυτό που θέλουμε να αποδείξουμε.</li></ul></div>
<div class="tbox"><h4>Παράδειγμα (τυπική παραγωγή)</h4>
<p>Υποθέσεις: $\lnot p \land q$, $\ r \to p$, $\ \lnot r \to s$, $\ s \to t$. Συμπέρασμα $t$:
1. $\lnot p$ (απλοποίηση στο $\lnot p \land q$) · 2. $\lnot r$ (τρόπος του αναιρείν με $r \to p$) · 3. $s$ (τρόπος του θέτειν με $\lnot r \to s$) · 4. $t$ (τρόπος του θέτειν με $s \to t$).</p></div>`,
  widget: "dsaArg",
  gen: "dsaInf",
  exercises: [
    { level: 1, type: "mc", q: R`Ποιος κανόνας συμπερασμού είναι ο $p \to q,\ p \ \vdash\ q$;`, options: ["Τρόπος του θέτειν (modus ponens)", "Τρόπος του αναιρείν (modus tollens)", "Υποθετικός συλλογισμός", "Διαζευκτικός συλλογισμός"], correct: 0,
      hint: R`«Θέτουμε» την υπόθεση της συνεπαγωγής.`, sol: R`Τρόπος του θέτειν: από τη συνεπαγωγή και την υπόθεσή της συμπεραίνουμε το συμπέρασμά της.` },
    { level: 1, type: "mc", q: R`«Αν κάνει ζέστη, πάμε για μπάνιο. Δεν πήγαμε για μπάνιο. Άρα δεν έκανε ζέστη.» Ποιος κανόνας χρησιμοποιείται;`,
      options: ["Τρόπος του αναιρείν (modus tollens)", "Τρόπος του θέτειν (modus ponens)", "Άρνηση του ηγουμένου (πλάνη)", "Διαζευκτικός συλλογισμός"], correct: 0,
      hint: R`Σχήμα $p \to q,\ \lnot q$.`, sol: R`$p \to q,\ \lnot q \vdash \lnot p$: τρόπος του αναιρείν — έγκυρος.` },
    { level: 1, type: "mc", q: R`Ένα έγκυρο επιχείρημα έχει πάντα αληθές συμπέρασμα.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τι γίνεται αν μια υπόθεση είναι ψευδής;`,
      sol: R`Λάθος: η εγκυρότητα εγγυάται αληθές συμπέρασμα μόνο όταν όλες οι υποθέσεις είναι αληθείς. Π.χ. «Αν $2 > 3$ τότε $5 < 1$· $2 > 3$· άρα $5 < 1$» είναι έγκυρο (τρόπος του θέτειν) με ψευδές συμπέρασμα.` },
    { level: 2, type: "mc", q: R`«Αν ο $n$ διαιρείται με το $4$, τότε διαιρείται με το $2$. Ο $n$ διαιρείται με το $2$. Άρα ο $n$ διαιρείται με το $4$.» Το επιχείρημα είναι:`,
      options: ["Μη έγκυρο — επιβεβαίωση του επομένου", "Έγκυρο — τρόπος του θέτειν", "Έγκυρο — τρόπος του αναιρείν", "Μη έγκυρο — άρνηση του ηγουμένου"], correct: 0,
      hint: R`Σχήμα $p \to q,\ q \ \vdash\ p$; Δοκίμασε $n = 6$.`,
      sol: R`Είναι το σχήμα $p \to q,\ q \ \vdash\ p$, η πλάνη της επιβεβαίωσης του επομένου. Για $n = 6$: οι υποθέσεις ισχύουν ($6$ άρτιος) αλλά το $6$ δεν διαιρείται με το $4$.` },
    { level: 2, type: "mc", q: R`Από τις υποθέσεις $p \lor q$ και $\lnot p \lor r$, με τον κανόνα της ανάλυσης συμπεραίνουμε:`, options: ["$q \\lor r$", "$q \\land r$", "$p \\lor r$", "$\\lnot q \\lor r$"], correct: 0,
      hint: R`Το $p$ και το $\lnot p$ «απαλείφονται».`,
      sol: R`Αν $p = $ Α, τότε από τη δεύτερη $r$· αν $p = $ Ψ, τότε από την πρώτη $q$. Σε κάθε περίπτωση $q \lor r$ (ανάλυση).` },
    { level: 2, type: "fields", q: R`Για το επιχείρημα $p \to q,\ q \to r \ \vdash\ p \to r$, σε πόσες από τις $8$ γραμμές του πίνακα αληθείας είναι αληθείς <b>όλες</b> οι υποθέσεις (κρίσιμες γραμμές);`,
      fields: [{ label: "γραμμές =", ans: 4 }], hint: R`Είναι οι γραμμές όπου ο $(p \to q) \land (q \to r)$ είναι αληθής.`,
      sol: R`Κρίσιμες γραμμές $(p, q, r)$: ΑΑΑ, ΨΑΑ, ΨΨΑ, ΨΨΨ — $4$ γραμμές. Σε όλες ισχύει $p \to r$, άρα το επιχείρημα είναι έγκυρο (υποθετικός συλλογισμός).` },
    { level: 2, type: "mc", q: R`Από τις υποθέσεις $\lnot p \land q$, $\ r \to p$, $\ \lnot r \to s$ και $s \to t$ συμπεραίνεται:`, options: ["$t$", "$\\lnot t$", "$r$", "$\\lnot s$"], correct: 0,
      hint: R`Ξεκίνα από την απλοποίηση: $\lnot p$.`,
      sol: R`$\lnot p$ (απλοποίηση) $\Rightarrow \lnot r$ (τρόπος του αναιρείν με $r \to p$) $\Rightarrow s$ (τρόπος του θέτειν) $\Rightarrow t$ (τρόπος του θέτειν).` },
    { level: 2, type: "mc", q: R`«Κάθε φοιτητής του ΕΠΛ111 έχει περάσει Μαθηματικά. Η Μαρία έχει περάσει Μαθηματικά. Άρα η Μαρία είναι φοιτήτρια του ΕΠΛ111.» Το επιχείρημα είναι:`,
      options: ["Μη έγκυρο (επιβεβαίωση του επομένου)", "Έγκυρο: καθολικός τρόπος του θέτειν", "Έγκυρο: καθολικός τρόπος του αναιρείν", "Έγκυρο: υπαρξιακή γενίκευση"], correct: 0,
      hint: R`Μορφή: $\forall x\,(S(x) \to M(x))$, $M(c)$ — άρα $S(c)$;`,
      sol: R`Μετά την καθολική εξειδίκευση έχουμε $S(c) \to M(c)$ και $M(c)$ — η πλάνη της επιβεβαίωσης του επομένου. Η Μαρία μπορεί να έχει περάσει Μαθηματικά σε άλλο τμήμα.` },
    { level: 2, type: "mc", q: R`«Κάθε ακέραιος που διαιρείται με το $6$ διαιρείται με το $3$. Ο $25$ δεν διαιρείται με το $3$. Άρα ο $25$ δεν διαιρείται με το $6$.» Το επιχείρημα είναι:`,
      options: ["Έγκυρο: καθολικός τρόπος του αναιρείν", "Έγκυρο: καθολικός τρόπος του θέτειν", "Μη έγκυρο: άρνηση του ηγουμένου", "Μη έγκυρο: επιβεβαίωση του επομένου"], correct: 0,
      hint: R`$\forall x\,(P(x) \to Q(x))$ και $\lnot Q(c)$.`,
      sol: R`Καθολική εξειδίκευση δίνει $P(25) \to Q(25)$, και με $\lnot Q(25)$ ο τρόπος του αναιρείν δίνει $\lnot P(25)$. Έγκυρο.` },
    { level: 3, type: "mc", q: R`Από τις υποθέσεις $p \lor q$, $\ p \to r$ και $q \to r$ συμπεραίνεται έγκυρα:`, options: ["$r$", "$p$", "$q$", "$p \\land q$"], correct: 0,
      hint: R`Απόδειξη κατά περιπτώσεις.`,
      sol: R`Αν ισχύει $p$, τότε $r$· αν ισχύει $q$, τότε $r$. Αφού ισχύει τουλάχιστον ένα από τα $p, q$, ισχύει $r$. Ισοδύναμα: $(p \to r) \land (q \to r) \equiv (p \lor q) \to r$ και τρόπος του θέτειν. Για τα $p$, $q$ χωριστά δεν ξέρουμε τίποτα.` }
  ]
},
/* ───────────────────────────── 2.1 ───────────────────────────── */
{
  id: "2.1", unit: 2, title: "Σύνολα και πράξεις συνόλων",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 2 · Βλ. και Rosen §2.1–2.2",
  theory: R`
<div class="tbox"><h4>Βασικές έννοιες</h4>
<p><b>Σύνολο</b> είναι μια συλλογή διακεκριμένων αντικειμένων (στοιχείων). Γράφουμε $a \in A$. Περιγραφή με <b>αναγραφή</b> ($\{1, 3, 5\}$) ή με <b>ιδιότητα</b> ($\{x \in \mathbb Z \mid x \text{ περιττός}, 0 < x < 6\}$).</p>
<ul><li>$A \subseteq B$ (υποσύνολο) αν $\forall x\,(x \in A \to x \in B)$· $A = B$ αν και μόνο αν $A \subseteq B$ και $B \subseteq A$ (<b>διπλός εγκλεισμός</b>). Το $\varnothing$ είναι υποσύνολο κάθε συνόλου.</li>
<li><b>Πληθάριθμος</b> $|A|$: πλήθος στοιχείων πεπερασμένου συνόλου. <b>Δυναμοσύνολο</b> $\mathcal P(A)$: το σύνολο όλων των υποσυνόλων του $A$, με $|\mathcal P(A)| = 2^{|A|}$.</li>
<li><b>Καρτεσιανό γινόμενο</b> $A \times B = \{(a, b) \mid a \in A, b \in B\}$ (διατεταγμένα ζεύγη), $|A \times B| = |A|\cdot|B|$.</li></ul></div>
<div class="tbox tip"><h4>Πράξεις συνόλων (ως προς ένα βασικό σύνολο $U$)</h4>
<p>$A \cup B = \{x \mid x \in A \lor x \in B\}$, $\ A \cap B = \{x \mid x \in A \land x \in B\}$, $\ A - B = \{x \mid x \in A \land x \notin B\}$, $\ \overline{A} = A' = U - A$, $\ A \oplus B = (A - B) \cup (B - A)$ (συμμετρική διαφορά).</p>
<p><b>Ταυτότητες:</b> De Morgan $\overline{A \cup B} = \overline A \cap \overline B$, $\ \overline{A \cap B} = \overline A \cup \overline B$· επιμεριστικοί $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$· απορρόφησης $A \cup (A \cap B) = A$. Αντιστοιχούν ακριβώς στους νόμους της λογικής ($\cup \leftrightarrow \lor$, $\cap \leftrightarrow \land$, $' \leftrightarrow \lnot$).</p>
<p><b>Εγκλεισμός–αποκλεισμός:</b> $|A \cup B| = |A| + |B| - |A \cap B|$ και $|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|$.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη</h4>
<ul><li>$\varnothing \ne \{\varnothing\}$: το πρώτο δεν έχει στοιχεία, το δεύτερο έχει ένα.</li>
<li>Το $\in$ δεν είναι το $\subseteq$: $1 \in \{1, 2\}$ αλλά $\{1\} \subseteq \{1, 2\}$.</li>
<li>$(a, b) \ne \{a, b\}$: στο ζεύγος μετράει η σειρά, και $(a, a)$ είναι έγκυρο ζεύγος.</li></ul></div>`,
  widget: "dsaVenn",
  gen: "dsaSet",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε τους πληθάριθμους $|\mathcal P(\{a, b, c, d\})|$ και $|\mathcal P(\varnothing)|$.`, fields: [{ label: "|P({a,b,c,d})| =", ans: 16 }, { label: "|P(∅)| =", ans: 1 }],
      hint: R`$|\mathcal P(A)| = 2^{|A|}$.`, sol: R`$2^4 = 16$ και $2^0 = 1$: το $\mathcal P(\varnothing) = \{\varnothing\}$ έχει ένα στοιχείο, το κενό σύνολο.` },
    { level: 1, type: "mc", q: R`Ισχύει $\{1\} \subseteq \{\{1\}, 2\}$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Είναι το $1$ στοιχείο του $\{\{1\}, 2\}$;`, sol: R`Λάθος: τα στοιχεία του συνόλου είναι το $\{1\}$ και το $2$. Ισχύει $\{1\} \in \{\{1\}, 2\}$, αλλά όχι $\{1\} \subseteq \{\{1\}, 2\}$, αφού $1 \notin \{\{1\}, 2\}$.` },
    { level: 1, type: "fields", q: R`Αν $A = \{1, 2, 3\}$ και $B = \{a, b\}$, να βρείτε τα $|A \times B|$ και $|B \times B \times A|$.`, fields: [{ label: "|A×B| =", ans: 6 }, { label: "|B×B×A| =", ans: 12 }],
      hint: R`Πολλαπλασιάζουμε πληθάριθμους.`, sol: R`$|A \times B| = 3\cdot 2 = 6$ και $|B \times B \times A| = 2\cdot 2\cdot 3 = 12$ διατεταγμένες τριάδες.` },
    { level: 1, type: "fields", q: R`Με $U = \{1, 2, \dots, 10\}$, $A = \{1, 2, 3, 4, 5\}$, $B = \{4, 5, 6, 7\}$, να βρείτε τα $|A \cap B|$, $|A \cup B|$, $|\overline A|$ και $|A \oplus B|$.`,
      fields: [{ label: "|A∩B| =", ans: 2 }, { label: "|A∪B| =", ans: 7 }, { label: "|A′| =", ans: 5 }, { label: "|A⊕B| =", ans: 5 }],
      hint: R`$A \oplus B$: στοιχεία που ανήκουν σε ακριβώς ένα από τα δύο.`,
      sol: R`$A \cap B = \{4, 5\}$, $A \cup B = \{1, \dots, 7\}$, $\overline A = \{6, 7, 8, 9, 10\}$, $A \oplus B = \{1, 2, 3, 6, 7\}$.` },
    { level: 2, type: "mc", q: R`Το σύνολο $\overline{A \cup B}$ ισούται με:`, options: ["$\\overline A \\cap \\overline B$", "$\\overline A \\cup \\overline B$", "$A \\cap B$", "$\\overline A - B'$"], correct: 0,
      hint: R`Νόμος De Morgan.`, sol: R`$x \in \overline{A \cup B} \iff \lnot(x \in A \lor x \in B) \iff x \notin A \land x \notin B \iff x \in \overline A \cap \overline B$.` },
    { level: 2, type: "mc", q: R`Το σύνολο $A - (B \cup C)$ ισούται με:`, options: ["$(A - B) \\cap (A - C)$", "$(A - B) \\cup (A - C)$", "$(A - B) \\cup C$", "$A \\cap \\overline B \\cap C$"], correct: 0,
      hint: R`$A - X = A \cap \overline X$ και De Morgan.`,
      sol: R`$A - (B \cup C) = A \cap \overline{B \cup C} = A \cap \overline B \cap \overline C = (A \cap \overline B) \cap (A \cap \overline C) = (A - B) \cap (A - C)$.` },
    { level: 2, type: "mc", q: R`Το $\mathcal P(\{1, 2\})$ είναι:`, options: ["$\\{\\varnothing, \\{1\\}, \\{2\\}, \\{1, 2\\}\\}$", "$\\{\\{1\\}, \\{2\\}, \\{1, 2\\}\\}$", "$\\{\\varnothing, 1, 2, \\{1, 2\\}\\}$", "$\\{1, 2\\}$"], correct: 0,
      hint: R`Όλα τα υποσύνολα — μαζί με το κενό και το ίδιο το σύνολο.`, sol: R`Τα υποσύνολα του $\{1, 2\}$ είναι $\varnothing, \{1\}, \{2\}, \{1, 2\}$ — $2^2 = 4$ στοιχεία, και καθένα είναι σύνολο.` },
    { level: 2, type: "mc", q: R`Για οποιαδήποτε σύνολα $A, B$ ισχύει: $A \subseteq B \iff A \cap B = A$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Δύο κατευθύνσεις.`, sol: R`Σωστό. ($\Rightarrow$) Αν $A \subseteq B$, κάθε $x \in A$ ανήκει και στο $B$, άρα $A \cap B = A$. ($\Leftarrow$) Αν $A \cap B = A$, τότε $A = A \cap B \subseteq B$.` },
    { level: 2, type: "fields", q: R`Αν $|A| = 6$, $|B| = 5$ και $|A \cup B| = 9$, να βρείτε τα $|A \cap B|$ και $|A \oplus B|$.`, fields: [{ label: "|A∩B| =", ans: 2 }, { label: "|A⊕B| =", ans: 7 }],
      hint: R`Εγκλεισμός–αποκλεισμός.`, sol: R`$|A \cap B| = 6 + 5 - 9 = 2$ και $|A \oplus B| = |A \cup B| - |A \cap B| = 9 - 2 = 7$.` },
    { level: 3, type: "fields", q: R`Πόσοι από τους ακεραίους $1, 2, \dots, 100$ διαιρούνται με το $2$ ή το $3$ ή το $5$;`, fields: [{ label: "πλήθος =", ans: 74 }],
      hint: R`Εγκλεισμός–αποκλεισμός με $\lfloor 100/d\rfloor$.`,
      sol: R`$|A_2| = 50$, $|A_3| = 33$, $|A_5| = 20$, $|A_6| = 16$, $|A_{10}| = 10$, $|A_{15}| = 6$, $|A_{30}| = 3$. Άρα $50 + 33 + 20 - 16 - 10 - 6 + 3 = 74$.` }
  ]
},
/* ───────────────────────────── 2.2 ───────────────────────────── */
{
  id: "2.2", unit: 2, title: "Συναρτήσεις",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 2 · Βλ. και Rosen §2.3",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Μια <b>συνάρτηση</b> $f: A \to B$ αντιστοιχίζει σε <b>κάθε</b> στοιχείο $a \in A$ <b>ακριβώς ένα</b> στοιχείο $f(a) \in B$. Το $A$ είναι το <b>πεδίο ορισμού</b>, το $B$ το <b>σύνολο αφίξεως</b> (codomain) και το $f(A) = \{f(a) \mid a \in A\} \subseteq B$ η <b>εικόνα</b> (range). Αν $f(a) = b$, το $a$ λέγεται <b>προεικόνα</b> του $b$.</p></div>
<div class="tbox tip"><h4>Ένα-προς-ένα, επί, αμφιμονοσήμαντη</h4>
<ul><li><b>Ένα-προς-ένα</b> (ενριπτική): $f(a_1) = f(a_2) \Rightarrow a_1 = a_2$ — διαφορετικά στοιχεία έχουν διαφορετικές εικόνες.</li>
<li><b>Επί</b> (επιρριπτική): $\forall b \in B\ \exists a \in A\colon f(a) = b$, δηλαδή $f(A) = B$.</li>
<li><b>Αμφιμονοσήμαντη</b> (αμφιρριπτική): ένα-προς-ένα και επί. Τότε και μόνο τότε υπάρχει η <b>αντίστροφη</b> $f^{-1}: B \to A$, με $f^{-1}(b) = a \iff f(a) = b$.</li>
<li><b>Σύνθεση</b>: $(f \circ g)(x) = f(g(x))$ — γενικά $f \circ g \ne g \circ f$.</li></ul>
<p>Αν $|A| = |B|$ είναι πεπερασμένα, τότε η $f$ είναι ένα-προς-ένα <b>αν και μόνο αν</b> είναι επί.</p></div>
<div class="tbox"><h4>Κάτω και άνω ακέραιο μέρος</h4>
<p>$\lfloor x\rfloor$: ο μεγαλύτερος ακέραιος $\le x$· $\lceil x\rceil$: ο μικρότερος ακέραιος $\ge x$. Π.χ. $\lfloor 2{,}7\rfloor = 2$, $\lceil 2{,}7\rceil = 3$, $\lfloor -2{,}7\rfloor = -3$, $\lceil -2{,}7\rceil = -2$. Ιδιότητες: $\lfloor x\rfloor = n \iff n \le x < n + 1$, $\ \lfloor x + n\rfloor = \lfloor x\rfloor + n$ για ακέραιο $n$, $\ \lceil x\rceil = -\lfloor -x\rfloor$.</p></div>
<div class="tbox warn"><h4>Προσοχή</h4>
<p>Οι ιδιότητες εξαρτώνται από πεδίο ορισμού και σύνολο αφίξεως: η $f(x) = x^2$ δεν είναι ούτε ένα-προς-ένα ούτε επί ως $\mathbb R \to \mathbb R$, αλλά είναι αμφιμονοσήμαντη ως $[0, \infty) \to [0, \infty)$. Για να δείξουμε ένα-προς-ένα ξεκινάμε από $f(a_1) = f(a_2)$· για επί ξεκινάμε από τυχαίο $b \in B$ και βρίσκουμε προεικόνα.</p></div>`,
  widget: "dsaFunc",
  gen: "dsaFn",
  exercises: [
    { level: 1, type: "mc", q: R`Η $f: \mathbb Z \to \mathbb Z$ με $f(x) = x + 5$ είναι:`, options: ["ένα-προς-ένα και επί (αμφιμονοσήμαντη)", "ένα-προς-ένα, όχι επί", "επί, όχι ένα-προς-ένα", "ούτε ένα-προς-ένα ούτε επί"], correct: 0,
      hint: R`Λύσε $f(x) = b$ ως προς $x$.`, sol: R`$x_1 + 5 = x_2 + 5 \Rightarrow x_1 = x_2$ (ένα-προς-ένα) και για κάθε $b \in \mathbb Z$ το $x = b - 5 \in \mathbb Z$ δίνει $f(x) = b$ (επί).` },
    { level: 1, type: "mc", q: R`Η $f: \mathbb Z \to \mathbb Z$ με $f(x) = 2x$ είναι:`, options: ["ένα-προς-ένα, όχι επί", "ένα-προς-ένα και επί (αμφιμονοσήμαντη)", "επί, όχι ένα-προς-ένα", "ούτε ένα-προς-ένα ούτε επί"], correct: 0,
      hint: R`Έχει το $1$ προεικόνα στο $\mathbb Z$;`, sol: R`$2x_1 = 2x_2 \Rightarrow x_1 = x_2$, άρα ένα-προς-ένα. Όμως οι περιττοί δεν είναι εικόνες (π.χ. $2x = 1$ δεν έχει ακέραια λύση), άρα όχι επί.` },
    { level: 1, type: "mc", q: R`Η $f: \mathbb R \to \mathbb R$ με $f(x) = x^2$ είναι:`, options: ["ούτε ένα-προς-ένα ούτε επί", "ένα-προς-ένα, όχι επί", "επί, όχι ένα-προς-ένα", "ένα-προς-ένα και επί (αμφιμονοσήμαντη)"], correct: 0,
      hint: R`$f(-1)$, $f(1)$· έχει το $-1$ προεικόνα;`, sol: R`$f(-1) = f(1)$, άρα όχι ένα-προς-ένα· το $-1$ δεν είναι τετράγωνο πραγματικού, άρα όχι επί.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε $\lfloor -3{,}7\rfloor$, $\lceil -3{,}7\rceil$ και $\lfloor 3{,}7\rfloor$.`, fields: [{ label: "⌊−3,7⌋ =", ans: -4 }, { label: "⌈−3,7⌉ =", ans: -3 }, { label: "⌊3,7⌋ =", ans: 3 }],
      hint: R`Στους αρνητικούς, το κάτω ακέραιο μέρος πάει πιο μακριά από το $0$.`, sol: R`$-4 \le -3{,}7 < -3$, άρα $\lfloor -3{,}7\rfloor = -4$ και $\lceil -3{,}7\rceil = -3$· $\lfloor 3{,}7\rfloor = 3$.` },
    { level: 1, type: "fields", q: R`Αν $f(x) = 2x + 1$ και $g(x) = x^2 - 3$ ($\mathbb R \to \mathbb R$), να υπολογίσετε $(f \circ g)(2)$ και $(g \circ f)(2)$.`, fields: [{ label: "(f∘g)(2) =", ans: 3 }, { label: "(g∘f)(2) =", ans: 22 }],
      hint: R`Πρώτα εφαρμόζεται η εσωτερική συνάρτηση.`, sol: R`$(f \circ g)(2) = f(g(2)) = f(1) = 3$· $(g \circ f)(2) = g(f(2)) = g(5) = 22$.` },
    { level: 2, type: "mc", q: R`Η $f: \mathbb Z \to \mathbb Z$ με $f(x) = \lceil x/2\rceil$ είναι:`, options: ["επί, όχι ένα-προς-ένα", "ένα-προς-ένα, όχι επί", "ένα-προς-ένα και επί (αμφιμονοσήμαντη)", "ούτε ένα-προς-ένα ούτε επί"], correct: 0,
      hint: R`Υπολόγισε $f(1)$ και $f(2)$.`, sol: R`$f(1) = f(2) = 1$, άρα όχι ένα-προς-ένα. Για κάθε $b \in \mathbb Z$: $f(2b) = b$, άρα επί.` },
    { level: 2, type: "fields", q: R`Η $f: \mathbb R \to \mathbb R$, $f(x) = 3x - 4$ είναι αμφιμονοσήμαντη. Να βρείτε τα $f^{-1}(5)$ και $f^{-1}(0)$.`, fields: [{ label: "f⁻¹(5) =", ans: 3 }, { label: "f⁻¹(0) =", ans: "4/3" }],
      hint: R`$y = 3x - 4 \Rightarrow x = (y + 4)/3$.`, sol: R`$f^{-1}(y) = \frac{y + 4}{3}$, άρα $f^{-1}(5) = 3$ και $f^{-1}(0) = \frac43$.` },
    { level: 2, type: "fields", q: R`Πόσες συναρτήσεις $\{a, b, c\} \to \{0, 1\}$ υπάρχουν και πόσες από αυτές είναι επί;`, fields: [{ label: "όλες =", ans: 8 }, { label: "επί =", ans: 6 }],
      hint: R`Ποιες δεν είναι επί;`, sol: R`$2^3 = 8$ συναρτήσεις. Δεν είναι επί μόνο οι δύο σταθερές (όλα στο $0$ ή όλα στο $1$), άρα $8 - 2 = 6$ επί.` },
    { level: 3, type: "fields", q: R`Πόσες συναρτήσεις από σύνολο $4$ στοιχείων <b>επί</b> σύνολο $3$ στοιχείων υπάρχουν;`, fields: [{ label: "επί =", ans: 36 }],
      hint: R`Αφαίρεσε από τις $3^4$ όσες «χάνουν» ένα στοιχείο — εγκλεισμός–αποκλεισμός.`,
      sol: R`Όλες: $3^4 = 81$. Αυτές που αποφεύγουν ένα συγκεκριμένο στοιχείο: $2^4 = 16$ (τρεις επιλογές)· αυτές που αποφεύγουν δύο: $1$ (τρεις επιλογές). Επί: $81 - 3\cdot 16 + 3\cdot 1 = 36$.` },
    { level: 3, type: "mc", q: R`Αν η $f \circ g$ είναι ένα-προς-ένα, τότε η $g$ είναι ένα-προς-ένα.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Ξεκίνα από $g(a_1) = g(a_2)$.`,
      sol: R`Σωστό: αν $g(a_1) = g(a_2)$, τότε $f(g(a_1)) = f(g(a_2))$, δηλαδή $(f \circ g)(a_1) = (f \circ g)(a_2)$, άρα $a_1 = a_2$. (Η $f$ όμως δεν χρειάζεται να είναι ένα-προς-ένα.)` }
  ]
},
/* ───────────────────────────── 2.3 ───────────────────────────── */
{
  id: "2.3", unit: 2, title: "Ακολουθίες, αθροίσματα και πληθάριθμος",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 2 · Βλ. και Rosen §2.4–2.5",
  theory: R`
<div class="tbox"><h4>Ακολουθίες</h4>
<p>Ακολουθία είναι μια συνάρτηση με πεδίο ορισμού ένα υποσύνολο των ακεραίων (συνήθως $\{0, 1, 2, \dots\}$ ή $\{1, 2, \dots\}$)· γράφουμε $a_n$. <b>Αριθμητική πρόοδος</b>: $a_n = a + (n - 1)d$. <b>Γεωμετρική πρόοδος</b>: $a_n = a r^{n-1}$.</p></div>
<div class="tbox tip"><h4>Αθροίσματα</h4>
<p>$\sum_{i=m}^{n} a_i = a_m + a_{m+1} + \dots + a_n$. Ιδιότητες: $\sum (c\,a_i + b_i) = c\sum a_i + \sum b_i$· αλλαγή δείκτη ($j = i - 1$)· <b>τηλεσκοπικό</b> $\sum_{i=1}^{n} (a_i - a_{i-1}) = a_n - a_0$.</p>
<ul><li>$\sum_{i=1}^{n} i = \frac{n(n + 1)}{2}$, $\ \sum_{i=1}^{n} i^2 = \frac{n(n + 1)(2n + 1)}{6}$, $\ \sum_{i=1}^{n} i^3 = \left(\frac{n(n + 1)}{2}\right)^2$.</li>
<li>Γεωμετρικό: $\sum_{k=0}^{n} r^k = \frac{r^{n+1} - 1}{r - 1}$ ($r \ne 1$)· για $|r| < 1$: $\sum_{k=0}^{\infty} r^k = \frac{1}{1 - r}$.</li>
<li>Διπλά αθροίσματα: υπολογίζουμε πρώτα το εσωτερικό.</li></ul></div>
<div class="tbox"><h4>Πληθάριθμος απειροσυνόλων</h4>
<p>$|A| = |B|$ αν υπάρχει αμφιμονοσήμαντη συνάρτηση $A \to B$. Ένα σύνολο είναι <b>αριθμήσιμο</b> αν είναι πεπερασμένο ή έχει τον πληθάριθμο του $\mathbb Z^+$ (τα στοιχεία του μπαίνουν σε ακολουθία $a_1, a_2, \dots$).</p>
<ul><li>Το $\mathbb Z$ είναι αριθμήσιμο: $0, 1, -1, 2, -2, \dots$. Το $\mathbb Q$ είναι αριθμήσιμο (διάσχιση του πίνακα $p/q$ κατά διαγώνιους).</li>
<li>Το $\mathbb R$ (και κάθε διάστημα, π.χ. $(0, 1)$) <b>δεν</b> είναι αριθμήσιμο — διαγώνιο επιχείρημα του Cantor. Επίσης $|\mathcal P(A)| > |A|$ για κάθε σύνολο $A$.</li></ul></div>
<div class="tbox warn"><h4>Προσοχή</h4>
<p>Πρόσεξε από πού ξεκινά ο δείκτης: $\sum_{k=0}^{n} r^k$ έχει $n + 1$ όρους. Και: ένα γνήσιο υποσύνολο απειροσυνόλου μπορεί να έχει τον <i>ίδιο</i> πληθάριθμο (π.χ. οι άρτιοι θετικοί και το $\mathbb Z^+$, μέσω $n \mapsto 2n$).</p></div>`,
  widget: "dsaSum",
  gen: "dsaSm",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε $\sum_{i=1}^{50} i$.`, fields: [{ label: "=", ans: 1275 }], hint: R`$\frac{n(n + 1)}{2}$.`, sol: R`$\frac{50\cdot 51}{2} = 1275$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε $\sum_{k=0}^{8} 3\cdot 2^k$.`, fields: [{ label: "=", ans: 1533 }], hint: R`Γεωμετρικό με $r = 2$ και $9$ όρους.`, sol: R`$3\cdot\frac{2^9 - 1}{2 - 1} = 3\cdot 511 = 1533$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε $\sum_{i=1}^{10} i^2$.`, fields: [{ label: "=", ans: 385 }], hint: R`$\frac{n(n + 1)(2n + 1)}{6}$.`, sol: R`$\frac{10\cdot 11\cdot 21}{6} = 385$.` },
    { level: 1, type: "fields", q: R`Σε αριθμητική πρόοδο με $a_1 = 7$ και διαφορά $d = 4$, να βρείτε τον $a_{20}$ και το άθροισμα των $20$ πρώτων όρων.`, fields: [{ label: "a₂₀ =", ans: 83 }, { label: "S₂₀ =", ans: 900 }],
      hint: R`$S_n = \frac n2(a_1 + a_n)$.`, sol: R`$a_{20} = 7 + 19\cdot 4 = 83$, $S_{20} = \frac{20}{2}(7 + 83) = 900$.` },
    { level: 1, type: "mc", q: R`Το σύνολο των άρτιων θετικών ακεραίων έχει τον ίδιο πληθάριθμο με το $\mathbb Z^+$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Βρες αμφιμονοσήμαντη συνάρτηση.`, sol: R`Σωστό: η $f(n) = 2n$ είναι αμφιμονοσήμαντη από το $\mathbb Z^+$ στους άρτιους θετικούς.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε $\sum_{i=1}^{99} \frac{1}{i(i + 1)}$.`, fields: [{ label: "=", ans: "99/100" }],
      hint: R`$\frac{1}{i(i + 1)} = \frac1i - \frac{1}{i + 1}$.`, sol: R`Τηλεσκοπικό: $\left(1 - \frac12\right) + \left(\frac12 - \frac13\right) + \dots + \left(\frac{1}{99} - \frac{1}{100}\right) = 1 - \frac{1}{100} = \frac{99}{100}$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε $\sum_{j=10}^{20} j$.`, fields: [{ label: "=", ans: 165 }], hint: R`$\sum_{j=1}^{20} - \sum_{j=1}^{9}$.`, sol: R`$210 - 45 = 165$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το άπειρο άθροισμα $\sum_{k=1}^{\infty} \left(\frac13\right)^k$.`, fields: [{ label: "=", ans: "1/2" }],
      hint: R`Ξεκινά από $k = 1$, όχι από $k = 0$.`, sol: R`$\sum_{k=0}^{\infty} \left(\frac13\right)^k = \frac{1}{1 - 1/3} = \frac32$· αφαιρούμε τον όρο $k = 0$ (ίσο με $1$): $\frac32 - 1 = \frac12$.` },
    { level: 2, type: "mc", q: R`Ποιο από τα παρακάτω σύνολα <b>δεν</b> είναι αριθμήσιμο;`, options: ["το διάστημα $(0, 1) \\subset \\mathbb R$", "το $\\mathbb Z$", "το $\\mathbb Q$", "το σύνολο των πεπερασμένων δυαδικών συμβολοσειρών"], correct: 0,
      hint: R`Διαγώνιο επιχείρημα του Cantor.`, sol: R`Το $(0, 1)$ δεν είναι αριθμήσιμο (Cantor). Τα $\mathbb Z$, $\mathbb Q$ είναι αριθμήσιμα, και οι πεπερασμένες συμβολοσειρές αριθμούνται κατά μήκος (πρώτα όλες μήκους $0$, μετά $1$, …).` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε το διπλό άθροισμα $\sum_{i=1}^{4}\sum_{j=1}^{3} (2i - j)$.`, fields: [{ label: "=", ans: 36 }],
      hint: R`Εσωτερικό άθροισμα ως προς $j$ πρώτα.`, sol: R`$\sum_{j=1}^{3} (2i - j) = 6i - 6$, άρα $\sum_{i=1}^{4} (6i - 6) = 6\cdot 10 - 24 = 36$.` }
  ]
},
/* ───────────────────────────── 3.1 ───────────────────────────── */
{
  id: "3.1", unit: 3, title: "Μέθοδοι απόδειξης",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 3 · Βλ. και Rosen §1.7–1.8",
  theory: R`
<div class="tbox"><h4>Ορολογία</h4>
<p><b>Θεώρημα</b>: πρόταση που αποδεικνύεται αληθής· <b>λήμμα</b>: βοηθητικό θεώρημα· <b>πόρισμα</b>: άμεση συνέπεια θεωρήματος· <b>εικασία</b>: πρόταση που πιστεύεται αληθής αλλά δεν έχει αποδειχθεί. Ορισμοί: ο $n$ είναι <b>άρτιος</b> αν $n = 2k$ και <b>περιττός</b> αν $n = 2k + 1$ για κάποιον ακέραιο $k$· ο $r$ είναι <b>ρητός</b> αν $r = p/q$ με $p, q$ ακεραίους, $q \ne 0$.</p></div>
<div class="tbox tip"><h4>Μέθοδοι για $p \to q$ και άλλες μορφές</h4>
<ul><li><b>Ευθεία απόδειξη</b>: υποθέτουμε $p$ και φτάνουμε στο $q$. Π.χ. $n = 2k + 1 \Rightarrow n^2 = 2(2k^2 + 2k) + 1$ περιττός.</li>
<li><b>Αντιθετοαντιστροφή</b>: αποδεικνύουμε $\lnot q \to \lnot p$. Π.χ. «αν $3n + 2$ περιττός τότε $n$ περιττός»: αν $n = 2k$, τότε $3n + 2 = 2(3k + 1)$ άρτιος.</li>
<li><b>Απαγωγή σε άτοπο</b>: υποθέτουμε $\lnot p$ (ή $p \land \lnot q$) και καταλήγουμε σε αντίφαση. Π.χ. ο $\sqrt2$ είναι άρρητος.</li>
<li><b>Κατά περιπτώσεις</b>: χωρίζουμε σε περιπτώσεις που καλύπτουν όλες τις δυνατότητες (π.χ. $n$ άρτιος / περιττός, $x \ge 0$ / $x < 0$).</li>
<li><b>Ισοδυναμία</b> $p \leftrightarrow q$: αποδεικνύουμε $p \to q$ <b>και</b> $q \to p$.</li>
<li><b>Ύπαρξη</b>: <b>κατασκευαστική</b> (δίνουμε το αντικείμενο) ή <b>μη κατασκευαστική</b> (δείχνουμε ότι υπάρχει χωρίς να το βρούμε). <b>Αντιπαράδειγμα</b>: ένα στοιχείο αρκεί για να διαψεύσει ένα «για κάθε».</li></ul></div>
<div class="tbox warn"><h4>Συχνά λάθη</h4>
<ul><li>Η απόδειξη της αντίστροφης ($q \to p$) δεν αποδεικνύει την $p \to q$.</li>
<li>Παραδείγματα, όσο πολλά κι αν είναι, δεν αποδεικνύουν καθολική πρόταση (δες το widget: ο $n^2 + n + 41$ είναι πρώτος για $n = 1, \dots, 39$ αλλά όχι για $n = 40$).</li>
<li>Κυκλικός συλλογισμός: χρησιμοποιούμε (ρητά ή κρυφά) αυτό που θέλουμε να αποδείξουμε.</li></ul></div>`,
  widget: "dsaCex",
  gen: "dsaPf",
  exercises: [
    { level: 1, type: "mc", q: R`Σε ευθεία απόδειξη της πρότασης «αν ο $n$ είναι περιττός, τότε ο $n^2$ είναι περιττός», το πρώτο βήμα είναι:`,
      options: ["Υποθέτουμε $n = 2k + 1$ για κάποιον ακέραιο $k$.", "Υποθέτουμε ότι ο $n^2$ είναι άρτιος.", "Υποθέτουμε ότι ο $n$ είναι άρτιος.", "Ελέγχουμε τις τιμές $n = 1, 3, 5$."], correct: 0,
      hint: R`Ευθεία απόδειξη: ξεκινάμε από την υπόθεση.`, sol: R`Υποθέτουμε την υπόθεση, $n = 2k + 1$, οπότε $n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1$, περιττός. Η υπόθεση «$n^2$ άρτιος» ανήκει σε απαγωγή σε άτοπο ή αντιθετοαντιστροφή, και ο έλεγχος τιμών δεν είναι απόδειξη.` },
    { level: 1, type: "mc", q: R`Για να αποδείξουμε με αντιθετοαντιστροφή ότι «αν ο $3n + 2$ είναι περιττός, τότε ο $n$ είναι περιττός», αποδεικνύουμε:`,
      options: ["αν ο $n$ είναι άρτιος, τότε ο $3n + 2$ είναι άρτιος", "αν ο $n$ είναι περιττός, τότε ο $3n + 2$ είναι περιττός", "αν ο $3n + 2$ είναι άρτιος, τότε ο $n$ είναι άρτιος", "ότι δεν μπορεί ο $3n + 2$ να είναι περιττός"], correct: 0,
      hint: R`$\lnot q \to \lnot p$.`, sol: R`Αντιθετοαντίστροφη: «αν ο $n$ δεν είναι περιττός (άρτιος), τότε ο $3n + 2$ δεν είναι περιττός (άρτιος)». Πράγματι $n = 2k \Rightarrow 3n + 2 = 2(3k + 1)$. Η «αν $n$ περιττός…» είναι η αντίστροφη και η «αν $3n + 2$ άρτιος…» η αντίθετη.` },
    { level: 1, type: "mc", q: R`Στην απόδειξη με απαγωγή σε άτοπο ότι ο $\sqrt 2$ είναι άρρητος, υποθέτουμε αρχικά ότι:`,
      options: ["$\\sqrt 2 = a/b$ με $a, b$ ακεραίους χωρίς κοινό παράγοντα, $b \\ne 0$", "ο $\\sqrt 2$ είναι άρρητος", "$\\sqrt 2 = a/b$ με $a, b$ άρτιους", "ο $\\sqrt 2^2 = 2$ είναι ρητός"], correct: 0,
      hint: R`Υποθέτουμε την άρνηση του ζητούμενου, σε «ανάγωγη» μορφή.`, sol: R`Υποθέτουμε $\sqrt2 = a/b$ ανάγωγο. Τότε $a^2 = 2b^2$, άρα ο $a$ είναι άρτιος, $a = 2c$, οπότε $b^2 = 2c^2$ και ο $b$ είναι άρτιος — άτοπο, αφού δεν έχουν κοινό παράγοντα.` },
    { level: 1, type: "fields", q: R`Ο ισχυρισμός «για κάθε $n \ge 1$ ο $2^n + 1$ είναι πρώτος» είναι ψευδής. Ποιο είναι το μικρότερο αντιπαράδειγμα $n$;`, fields: [{ label: "n =", ans: 3 }],
      hint: R`Δοκίμασε $n = 1, 2, 3$.`, sol: R`$2^1 + 1 = 3$ και $2^2 + 1 = 5$ είναι πρώτοι, αλλά $2^3 + 1 = 9 = 3\cdot 3$.` },
    { level: 1, type: "mc", q: R`Αν ελέγξουμε έναν ισχυρισμό «για κάθε φυσικό $n$» για $1000$ τιμές του $n$ και ισχύει σε όλες, τότε ο ισχυρισμός έχει αποδειχθεί.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Τα φυσικά είναι άπειρα.`, sol: R`Λάθος: ένα αντιπαράδειγμα μπορεί να υπάρχει πιο πέρα (π.χ. η εικασία του Pólya διαψεύστηκε για $n \approx 9\cdot 10^8$). Χρειάζεται γενικό επιχείρημα.` },
    { level: 2, type: "mc", q: R`Για να αποδείξουμε μια πρόταση της μορφής $p \leftrightarrow q$ αρκεί να δείξουμε:`, options: ["$p \\to q$ και $q \\to p$", "μόνο $p \\to q$", "$p \\land q$", "$\\lnot q \\to \\lnot p$ και $p \\to q$"], correct: 0,
      hint: R`$p \leftrightarrow q \equiv (p \to q) \land (q \to p)$.`, sol: R`Χρειάζονται και οι δύο κατευθύνσεις. Το «$\lnot q \to \lnot p$ και $p \to q$» αποδεικνύει δύο φορές την <i>ίδια</i> κατεύθυνση, αφού $\lnot q \to \lnot p \equiv p \to q$.` },
    { level: 2, type: "mc", q: R`Η απόδειξη «Αν ο $\sqrt2^{\sqrt2}$ είναι ρητός, πάρε $a = b = \sqrt2$· αλλιώς πάρε $a = \sqrt2^{\sqrt2}$, $b = \sqrt2$, οπότε $a^b = \sqrt2^2 = 2$» δείχνει ότι υπάρχουν άρρητοι $a, b$ με $a^b$ ρητό. Είναι:`,
      options: ["μη κατασκευαστική απόδειξη ύπαρξης", "κατασκευαστική απόδειξη ύπαρξης", "απόδειξη με επαγωγή", "αντιπαράδειγμα"], correct: 0,
      hint: R`Ξέρουμε ποιο ζεύγος δουλεύει;`, sol: R`Αποδεικνύει ότι <i>ένα από τα δύο</i> ζεύγη δουλεύει, χωρίς να μας λέει ποιο — μη κατασκευαστική απόδειξη (κατά περιπτώσεις).` },
    { level: 2, type: "mc", q: R`Τι είναι λάθος στην «απόδειξη»: «Αν ο $n^2$ είναι άρτιος, τότε ο $n$ είναι άρτιος. Απόδειξη: έστω $n$ άρτιος, $n = 2k$· τότε $n^2 = 4k^2$, άρτιος.»;`,
      options: ["Αποδεικνύει την αντίστροφη πρόταση ($n$ άρτιος $\\Rightarrow n^2$ άρτιος).", "Ο ορισμός του άρτιου είναι λάθος.", "Το $4k^2$ δεν είναι άρτιος.", "Τίποτα, η απόδειξη είναι σωστή."], correct: 0,
      hint: R`Ποια είναι η υπόθεση και ποιο το συμπέρασμα;`, sol: R`Η υπόθεση της πρότασης είναι «$n^2$ άρτιος», αλλά η απόδειξη ξεκινά από «$n$ άρτιος» — αποδεικνύει την αντίστροφη. Σωστά: με αντιθετοαντιστροφή, αν $n = 2k + 1$ τότε $n^2$ περιττός.` },
    { level: 2, type: "fields", q: R`Αν ο $n$ είναι περιττός, ποιο είναι το υπόλοιπο της διαίρεσης του $n^2$ με το $8$;`, fields: [{ label: "υπόλοιπο =", ans: 1 }],
      hint: R`$n = 2k + 1 \Rightarrow n^2 = 4k(k + 1) + 1$· ο $k(k + 1)$ είναι άρτιος.`,
      sol: R`$n^2 = 4k(k + 1) + 1$. Ο $k(k + 1)$ είναι γινόμενο διαδοχικών, άρα άρτιος (κατά περιπτώσεις: $k$ άρτιος ή $k + 1$ άρτιος), οπότε $4k(k + 1)$ είναι πολλαπλάσιο του $8$ και το υπόλοιπο είναι $1$.` },
    { level: 3, type: "mc", q: R`Ποια είναι η άρνηση της πρότασης «για κάθε ακέραιο $n$, αν ο $n$ είναι πρώτος τότε ο $n$ είναι περιττός»;`,
      options: ["Υπάρχει ακέραιος $n$ που είναι πρώτος και άρτιος.", "Για κάθε ακέραιο $n$, αν ο $n$ είναι πρώτος τότε είναι άρτιος.", "Υπάρχει ακέραιος $n$ που δεν είναι πρώτος και είναι περιττός.", "Για κάθε ακέραιο $n$, αν ο $n$ δεν είναι πρώτος τότε είναι άρτιος."], correct: 0,
      hint: R`$\lnot\forall n\,(P \to Q) \equiv \exists n\,(P \land \lnot Q)$.`, sol: R`$\exists n\,(n \text{ πρώτος} \land n \text{ άρτιος})$ — και είναι αληθής ($n = 2$), οπότε ο αρχικός ισχυρισμός είναι ψευδής (το $2$ είναι αντιπαράδειγμα).` }
  ]
},
/* ───────────────────────────── 3.2 ───────────────────────────── */
{
  id: "3.2", unit: 3, title: "Μαθηματική επαγωγή",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 3 · Βλ. και Rosen §5.1",
  theory: R`
<div class="tbox"><h4>Η αρχή της μαθηματικής επαγωγής</h4>
<p>Για να αποδείξουμε ότι η $P(n)$ ισχύει για κάθε ακέραιο $n \ge n_0$:</p>
<ol><li><b>Βάση</b>: αποδεικνύουμε την $P(n_0)$.</li>
<li><b>Επαγωγικό βήμα</b>: για τυχαίο $k \ge n_0$ υποθέτουμε την $P(k)$ (<b>επαγωγική υπόθεση</b>) και αποδεικνύουμε την $P(k + 1)$.</li></ol>
<p>Τότε $\forall n \ge n_0\; P(n)$. Λογικά: $[P(n_0) \land \forall k \ge n_0\,(P(k) \to P(k + 1))] \to \forall n \ge n_0\; P(n)$. Η αρχή ισοδυναμεί με την αρχή της καλής διάταξης (κάθε μη κενό σύνολο θετικών ακεραίων έχει ελάχιστο στοιχείο).</p></div>
<div class="tbox tip"><h4>Παράδειγμα: $\sum_{i=1}^{n} i = \frac{n(n + 1)}{2}$</h4>
<p>Βάση: $n = 1$: $1 = \frac{1\cdot 2}{2}$. Βήμα: αν $\sum_{i=1}^{k} i = \frac{k(k + 1)}{2}$, τότε $\sum_{i=1}^{k + 1} i = \frac{k(k + 1)}{2} + (k + 1) = \frac{(k + 1)(k + 2)}{2}$, που είναι η $P(k + 1)$.</p>
<p>Το ίδιο σχήμα δουλεύει για <b>ανισότητες</b> (π.χ. $2^n > n^2$ για $n \ge 5$), <b>διαιρετότητα</b> (π.χ. $6 \mid n^3 - n$), και για την ορθότητα αλγορίθμων.</p></div>
<div class="tbox warn"><h4>Συχνά λάθη</h4>
<ul><li>Παράλειψη της βάσης: το βήμα $P(k) \to P(k + 1)$ για την ψευδή «$n = n + 1$» είναι σωστό, αλλά η βάση αποτυγχάνει.</li>
<li>Χρήση της $P(k + 1)$ μέσα στην απόδειξή της (κυκλικό).</li>
<li>Βήμα που δεν ισχύει για <i>κάθε</i> $k \ge n_0$: στο «όλα τα άλογα έχουν το ίδιο χρώμα» το βήμα αποτυγχάνει από $k = 1$ σε $k + 1 = 2$.</li></ul></div>`,
  widget: "dsaInd",
  gen: "dsaIn",
  exercises: [
    { level: 1, type: "mc", q: R`Ποια περιγραφή του επαγωγικού βήματος είναι σωστή;`,
      options: ["Υποθέτουμε την $P(k)$ για τυχαίο $k \\ge n_0$ και αποδεικνύουμε την $P(k + 1)$.", "Υποθέτουμε την $P(k + 1)$ και αποδεικνύουμε την $P(k)$.", "Αποδεικνύουμε την $P(k)$ για μερικές τιμές του $k$.", "Υποθέτουμε ότι η $P(n)$ ισχύει για κάθε $n$ και αποδεικνύουμε την $P(k + 1)$."], correct: 0,
      hint: R`Η «αλυσίδα» πάει από το $k$ στο $k + 1$.`, sol: R`Το βήμα αποδεικνύει τη συνεπαγωγή $P(k) \to P(k + 1)$ για τυχαίο $k \ge n_0$. Η υπόθεση «ισχύει για κάθε $n$» είναι κυκλική.` },
    { level: 1, type: "fields", q: R`Για την πρόταση $\sum_{i=1}^{n} (2i - 1) = n^2$: πόσο είναι το αριστερό μέλος για $n = 7$, και ποιος όρος προστίθεται στο επαγωγικό βήμα από $k = 7$ σε $k + 1 = 8$;`,
      fields: [{ label: "για n=7:", ans: 49 }, { label: "όρος =", ans: 15 }], hint: R`Ο νέος όρος είναι $2(k + 1) - 1$.`,
      sol: R`$1 + 3 + \dots + 13 = 49 = 7^2$. Ο νέος όρος: $2\cdot 8 - 1 = 15$, και $49 + 15 = 64 = 8^2$ ✓.` },
    { level: 1, type: "fields", q: R`Με επαγωγή αποδεικνύεται ότι $\sum_{i=1}^{n} i\cdot i! = (n + 1)! - 1$. Να υπολογίσετε το άθροισμα για $n = 5$.`, fields: [{ label: "=", ans: 719 }],
      hint: R`$(n + 1)! - 1$.`, sol: R`$6! - 1 = 719$. (Έλεγχος: $1 + 4 + 18 + 96 + 600 = 719$.)` },
    { level: 2, type: "fields", q: R`Ποιος είναι ο μικρότερος φυσικός $n_0$ ώστε $2^n > n^2$ για <b>κάθε</b> $n \ge n_0$ (η βάση της επαγωγής);`, fields: [{ label: "n₀ =", ans: 5 }],
      hint: R`Έλεγξε $n = 2, 3, 4, 5$.`, sol: R`$2^2 = 4 = 2^2$, $2^3 = 8 < 9$, $2^4 = 16 = 4^2$, $2^5 = 32 > 25$. Για $k \ge 5$: $2^{k+1} = 2\cdot 2^k > 2k^2 \ge (k + 1)^2$, αφού $k^2 \ge 2k + 1$ για $k \ge 3$. Άρα $n_0 = 5$ (η ανισότητα ισχύει και για $n = 1$, αλλά όχι για κάθε $n \ge 1$).` },
    { level: 2, type: "fields", q: R`Για την πρόταση $\sum_{i=1}^{n} \frac{1}{i(i + 1)} = \frac{n}{n + 1}$, ποιος όρος προστίθεται στο επαγωγικό βήμα από $k = 4$ σε $k + 1 = 5$;`, fields: [{ label: "όρος =", ans: "1/30" }],
      hint: R`$\frac{1}{(k + 1)(k + 2)}$.`, sol: R`$\frac{1}{5\cdot 6} = \frac{1}{30}$, και $\frac45 + \frac{1}{30} = \frac{25}{30} = \frac56$ ✓.` },
    { level: 2, type: "mc", q: R`Στο επαγωγικό βήμα για την $6 \mid n^3 - n$ γράφουμε $(k + 1)^3 - (k + 1) = (k^3 - k) + 3k(k + 1)$. Γιατί ο $3k(k + 1)$ διαιρείται με το $6$;`,
      options: ["Γιατί ο $k(k + 1)$ είναι άρτιος (γινόμενο διαδοχικών).", "Γιατί ο $k$ είναι πάντα άρτιος.", "Από την επαγωγική υπόθεση.", "Γιατί ο $3k(k + 1)$ διαιρείται με το $9$."], correct: 0,
      hint: R`Ένας από δύο διαδοχικούς ακεραίους είναι άρτιος.`, sol: R`Ο $k(k + 1)$ είναι άρτιος, άρα $3k(k + 1) = 6\cdot\frac{k(k + 1)}{2}$. Με την επαγωγική υπόθεση $6 \mid k^3 - k$, το άθροισμα διαιρείται με το $6$.` },
    { level: 2, type: "mc", q: R`«Όλα τα άλογα έχουν το ίδιο χρώμα»: «Βήμα: από $k + 1$ άλογα, τα πρώτα $k$ έχουν ίδιο χρώμα και τα τελευταία $k$ επίσης· αφού επικαλύπτονται, όλα έχουν ίδιο χρώμα.» Πού είναι το λάθος;`,
      options: ["Για $k = 1$ οι δύο ομάδες (πρώτο και δεύτερο άλογο) δεν επικαλύπτονται.", "Η βάση $n = 1$ είναι ψευδής.", "Η επαγωγή δεν εφαρμόζεται σε άλογα.", "Χρειάζεται ισχυρή επαγωγή."], correct: 0,
      hint: R`Δοκίμασε το βήμα με $k + 1 = 2$.`, sol: R`Η βάση (ένα άλογο) είναι σωστή. Το βήμα όμως πρέπει να ισχύει για <i>κάθε</i> $k \ge 1$· για $k = 1$ οι ομάδες $\{1\}$ και $\{2\}$ δεν έχουν κοινό άλογο, οπότε η αλυσίδα σπάει στο $P(1) \to P(2)$.` },
    { level: 2, type: "fields", q: R`Ο αριθμός $7^n - 2^n$ διαιρείται με έναν σταθερό ακέραιο $d > 1$ για κάθε $n \ge 1$ (αποδεικνύεται με επαγωγή). Ποιος είναι ο μεγαλύτερος τέτοιος $d$;`, fields: [{ label: "d =", ans: 5 }],
      hint: R`Για $n = 1$ ο αριθμός είναι $5$.`, sol: R`Για $n = 1$: $7 - 2 = 5$, άρα $d \le 5$. Βήμα: $7^{k+1} - 2^{k+1} = 7(7^k - 2^k) + 5\cdot 2^k$, που διαιρείται με το $5$. Άρα $d = 5$.` },
    { level: 3, type: "mc", q: R`Αν η $P(1)$ είναι αληθής και $P(k) \to P(k + 2)$ για κάθε $k \ge 1$, τότε η $P(n)$ ισχύει για κάθε $n \ge 1$.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ποιες τιμές «φτάνει» η αλυσίδα από το $1$;`, sol: R`Λάθος: παίρνουμε μόνο $P(1), P(3), P(5), \dots$ — τους περιττούς. Για τους άρτιους χρειάζεται και η $P(2)$ ως βάση.` },
    { level: 3, type: "fields", q: R`Αποδεικνύεται με επαγωγή ότι $\sum_{i=1}^{n} i\cdot 2^i = (n - 1)2^{n+1} + 2$. Να υπολογίσετε το άθροισμα για $n = 6$.`, fields: [{ label: "=", ans: 642 }],
      hint: R`$(6 - 1)\cdot 2^7 + 2$.`, sol: R`$5\cdot 128 + 2 = 642$. Έλεγχος: $2 + 8 + 24 + 64 + 160 + 384 = 642$ ✓.` }
  ]
},
/* ───────────────────────────── 3.3 ───────────────────────────── */
{
  id: "3.3", unit: 3, title: "Ισχυρή επαγωγή και αναδρομικοί ορισμοί",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 3 · Βλ. και Rosen §5.2–5.3",
  theory: R`
<div class="tbox"><h4>Ισχυρή επαγωγή</h4>
<p>Βάση: $P(n_0)$ (ή περισσότερες αρχικές περιπτώσεις). Βήμα: υποθέτουμε ότι ισχύουν <b>όλες</b> οι $P(n_0), P(n_0 + 1), \dots, P(k)$ και αποδεικνύουμε την $P(k + 1)$. Είναι ισοδύναμη με την απλή επαγωγή, αλλά βολική όταν το $k + 1$ «στηρίζεται» σε κάποιο μικρότερο αλλά όχι αναγκαστικά στο $k$.</p>
<ul><li><b>Κάθε $n \ge 2$ είναι γινόμενο πρώτων</b>: αν ο $k + 1$ δεν είναι πρώτος, $k + 1 = ab$ με $2 \le a, b \le k$, και οι $a, b$ αναλύονται από την υπόθεση.</li>
<li><b>Γραμματόσημα $4$ και $5$ λεπτών</b>: κάθε ποσό $n \ge 12$ σχηματίζεται. Βάσεις $12, 13, 14, 15$· για $k \ge 15$: $k + 1 = (k - 3) + 4$.</li></ul></div>
<div class="tbox tip"><h4>Αναδρομικοί ορισμοί</h4>
<p><b>Συναρτήσεις/ακολουθίες</b>: δίνουμε αρχικές τιμές και κανόνα από τις προηγούμενες. Π.χ. $n! $: $0! = 1$, $(n + 1)! = (n + 1)\, n!$· <b>Fibonacci</b>: $f_0 = 0$, $f_1 = 1$, $f_n = f_{n-1} + f_{n-2}$ ($0, 1, 1, 2, 3, 5, 8, 13, \dots$).</p>
<p><b>Σύνολα</b>: βήμα βάσης (αρχικά στοιχεία) και αναδρομικό βήμα (κανόνες κατασκευής). Π.χ. $S$: $3 \in S$· αν $x, y \in S$ τότε $x + y \in S$ — το $S$ είναι τα θετικά πολλαπλάσια του $3$. Συμβολοσειρές $\Sigma^*$: $\lambda \in \Sigma^*$ (κενή)· αν $w \in \Sigma^*$, $x \in \Sigma$ τότε $wx \in \Sigma^*$.</p>
<p><b>Πλήρη δυαδικά δέντρα</b>: μία κορυφή είναι δέντρο· αν $T_1, T_2$ είναι δέντρα, η ρίζα με παιδιά $T_1, T_2$ είναι δέντρο. Με <b>δομική επαγωγή</b> (βάση στα αρχικά στοιχεία, βήμα σε κάθε κανόνα): $n(T) \le 2^{h(T)+1} - 1$, όπου $n$ οι κορυφές και $h$ το ύψος.</p></div>
<div class="tbox warn"><h4>Προσοχή</h4>
<p>Το βήμα πρέπει να στηρίζεται μόνο σε περιπτώσεις που καλύπτονται: στα γραμματόσημα, το $k + 1 = (k - 3) + 4$ απαιτεί $k - 3 \ge 12$, γι' αυτό χρειάζονται <b>τέσσερις</b> βάσεις. Στον Fibonacci, που χρησιμοποιεί δύο προηγούμενους όρους, χρειάζονται δύο βάσεις.</p></div>`,
  widget: "dsaRec",
  gen: "dsaRc",
  exercises: [
    { level: 1, type: "fields", q: R`Για την ακολουθία Fibonacci ($f_0 = 0$, $f_1 = 1$, $f_n = f_{n-1} + f_{n-2}$) να βρείτε τους $f_{10}$ και $f_{12}$.`, fields: [{ label: "f₁₀ =", ans: 55 }, { label: "f₁₂ =", ans: 144 }],
      hint: R`$0, 1, 1, 2, 3, 5, 8, 13, 21, 34, \dots$`, sol: R`$f_8 = 21$, $f_9 = 34$, $f_{10} = 55$, $f_{11} = 89$, $f_{12} = 144$.` },
    { level: 1, type: "fields", q: R`Η ακολουθία ορίζεται αναδρομικά από $a_0 = 2$ και $a_n = 3a_{n-1} - 1$ για $n \ge 1$. Να βρείτε τον $a_4$.`, fields: [{ label: "a₄ =", ans: 122 }],
      hint: R`Υπολόγισε διαδοχικά.`, sol: R`$a_1 = 5$, $a_2 = 14$, $a_3 = 41$, $a_4 = 122$.` },
    { level: 1, type: "mc", q: R`Στην ισχυρή επαγωγή, η επαγωγική υπόθεση στο βήμα για την $P(k + 1)$ είναι:`,
      options: ["ισχύει η $P(j)$ για όλα τα $j$ με $n_0 \\le j \\le k$", "ισχύει μόνο η $P(k)$", "ισχύει η $P(k + 1)$", "ισχύει η $P(j)$ για όλα τα $j \\ge n_0$"], correct: 0,
      hint: R`«Ισχυρή» = υποθέτουμε περισσότερα.`, sol: R`Υποθέτουμε όλες τις προηγούμενες περιπτώσεις $P(n_0), \dots, P(k)$. Η υπόθεση «για όλα τα $j \ge n_0$» θα ήταν κυκλική.` },
    { level: 1, type: "fields", q: R`Το σύνολο $S$ ορίζεται αναδρομικά: $3 \in S$· αν $x, y \in S$ τότε $x + y \in S$. Ποιο είναι το πέμπτο μικρότερο στοιχείο του $S$;`, fields: [{ label: "=", ans: 15 }],
      hint: R`Το $S$ είναι τα θετικά πολλαπλάσια του $3$.`, sol: R`$S = \{3, 6, 9, 12, 15, \dots\}$ (δομική επαγωγή δείχνει ότι κάθε στοιχείο είναι πολλαπλάσιο του $3$, και κάθε $3k$ προκύπτει), άρα το πέμπτο είναι $15$.` },
    { level: 1, type: "mc", q: R`Κάθε απόδειξη με ισχυρή επαγωγή μπορεί να μετατραπεί σε απόδειξη με απλή επαγωγή (και αντίστροφα).`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Θεώρησε την πρόταση $Q(n)$: «$P(n_0), \dots, P(n)$ ισχύουν».`,
      sol: R`Σωστό: εφαρμόζουμε απλή επαγωγή στην $Q(n) = P(n_0) \land \dots \land P(n)$. Οι δύο αρχές (και η αρχή της καλής διάταξης) είναι ισοδύναμες.` },
    { level: 2, type: "fields", q: R`Με γραμματόσημα των $3$ και των $5$ λεπτών: ποιο είναι το μεγαλύτερο ποσό που <b>δεν</b> σχηματίζεται, και πόσες βάσεις χρειάζεται η ισχυρή επαγωγή που αποδεικνύει ότι σχηματίζονται όλα τα μεγαλύτερα ποσά (με βήμα $k + 1 = (k - 2) + 3$);`,
      fields: [{ label: "μέγιστο μη σχηματίσιμο =", ans: 7 }, { label: "βάσεις =", ans: 3 }],
      hint: R`Έλεγξε $7, 8, 9, 10$.`, sol: R`$8 = 3 + 5$, $9 = 3 + 3 + 3$, $10 = 5 + 5$, ενώ το $7$ δεν σχηματίζεται. Το βήμα χρησιμοποιεί το $k - 2$, άρα χρειάζονται $3$ διαδοχικές βάσεις: $8, 9, 10$.` },
    { level: 2, type: "fields", q: R`Πόσες δυαδικές συμβολοσειρές μήκους $6$ δεν περιέχουν δύο διαδοχικά μηδενικά;`, fields: [{ label: "πλήθος =", ans: 21 }],
      hint: R`$a_n = a_{n-1} + a_{n-2}$ (η συμβολοσειρά τελειώνει σε «1» ή σε «10»), $a_1 = 2$, $a_2 = 3$.`,
      sol: R`Μια έγκυρη συμβολοσειρά μήκους $n$ τελειώνει σε $1$ (μπροστά έγκυρη μήκους $n - 1$) ή σε $10$ (μπροστά έγκυρη μήκους $n - 2$). Άρα $a_n = a_{n-1} + a_{n-2}$: $2, 3, 5, 8, 13, 21$.` },
    { level: 2, type: "fields", q: R`Με επαγωγή αποδεικνύεται ότι $f_1 + f_2 + \dots + f_n = f_{n+2} - 1$ για τους αριθμούς Fibonacci. Να υπολογίσετε το $f_1 + f_2 + \dots + f_8$.`, fields: [{ label: "=", ans: 54 }],
      hint: R`$f_{10} - 1$.`, sol: R`$f_{10} - 1 = 55 - 1 = 54$ (έλεγχος: $1 + 1 + 2 + 3 + 5 + 8 + 13 + 21 = 54$).` },
    { level: 3, type: "fields", q: R`Με δομική επαγωγή αποδεικνύεται ότι ένα πλήρες δυαδικό δέντρο ύψους $h$ έχει το πολύ $2^{h+1} - 1$ κορυφές. Πόσες κορυφές έχει το πολύ ένα πλήρες δυαδικό δέντρο ύψους $4$, και πόσα φύλλα το πολύ;`,
      fields: [{ label: "κορυφές ≤", ans: 31 }, { label: "φύλλα ≤", ans: 16 }],
      hint: R`Το μέγιστο επιτυγχάνεται όταν όλα τα επίπεδα είναι γεμάτα.`, sol: R`$2^{5} - 1 = 31$ κορυφές, και στο τελευταίο επίπεδο $2^4 = 16$ φύλλα.` },
    { level: 3, type: "mc", q: R`Αποδεικνύουμε με ισχυρή επαγωγή ότι κάθε ποσό $n \ge 12$ σχηματίζεται με γραμματόσημα $4$ και $5$ λεπτών, με βάσεις $P(12), P(13), P(14), P(15)$. Στο βήμα για το $k + 1$ (με $k \ge 15$):`,
      options: ["χρησιμοποιούμε την $P(k - 3)$ και προσθέτουμε ένα γραμματόσημο των $4$", "χρησιμοποιούμε την $P(k - 4)$ και προσθέτουμε ένα γραμματόσημο των $5$", "χρησιμοποιούμε την $P(k)$ και προσθέτουμε ένα λεπτό", "χρησιμοποιούμε μόνο την $P(12)$"], correct: 0,
      hint: R`Πρέπει το ποσό που χρησιμοποιούμε να είναι $\ge 12$ για κάθε $k \ge 15$.`,
      sol: R`$k + 1 = (k - 3) + 4$ και $12 \le k - 3 \le k$, οπότε η $P(k - 3)$ καλύπτεται από την ισχυρή υπόθεση. Η επιλογή με $P(k - 4)$ αποτυγχάνει για $k = 15$, αφού θα χρειαζόταν η $P(11)$, που είναι ψευδής.` }
  ]
},
/* ───────────────────────────── 4.1 ───────────────────────────── */
{
  id: "4.1", unit: 4, title: "Βασικές αρχές απαρίθμησης – Αρχή του περιστερώνα",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 4 · Βλ. και Rosen, Discrete Mathematics, κεφ. «Counting» (§ Basics of Counting, Pigeonhole Principle)",
  theory: R`
<div class="tbox"><h4>Κανόνας του γινομένου – κανόνας του αθροίσματος</h4>
<ul><li><b>Κανόνας του γινομένου:</b> αν μια διαδικασία αποτελείται από δύο διαδοχικά βήματα και το 1ο γίνεται με $n_1$ τρόπους και, για <i>κάθε</i> τρόπο του 1ου, το 2ο γίνεται με $n_2$ τρόπους, τότε η διαδικασία γίνεται με $n_1 n_2$ τρόπους. Ισοδύναμα $|A_1\times A_2\times\cdots\times A_m| = |A_1|\,|A_2|\cdots|A_m|$.</li>
<li><b>Κανόνας του αθροίσματος:</b> αν μια εργασία γίνεται <i>ή</i> με έναν από $n_1$ τρόπους <i>ή</i> με έναν από $n_2$ τρόπους και κανένας τρόπος του πρώτου συνόλου δεν ανήκει στο δεύτερο, τότε γίνεται με $n_1 + n_2$ τρόπους: $|A_1\cup A_2| = |A_1| + |A_2|$ για <b>ξένα</b> σύνολα.</li>
<li><b>Κανόνας της αφαίρεσης:</b> αν τα σύνολα δεν είναι ξένα, $|A_1\cup A_2| = |A_1| + |A_2| - |A_1\cap A_2|$ (απλή μορφή της αρχής εγκλεισμού–αποκλεισμού).</li></ul>
<p>Π.χ. ένα σύνολο με $n$ στοιχεία έχει $2^n$ υποσύνολα (για κάθε στοιχείο: μέσα ή έξω), και υπάρχουν $m^n$ συναρτήσεις από ένα σύνολο $n$ στοιχείων σε ένα σύνολο $m$ στοιχείων.</p></div>
<div class="tbox"><h4>Αρχή του περιστερώνα (Dirichlet)</h4>
<p>Αν $k + 1$ (ή περισσότερα) αντικείμενα τοποθετηθούν σε $k$ κουτιά, τότε κάποιο κουτί περιέχει <b>τουλάχιστον δύο</b> αντικείμενα.</p>
<p><b>Γενικευμένη μορφή:</b> αν $N$ αντικείμενα τοποθετηθούν σε $k$ κουτιά, τότε κάποιο κουτί περιέχει τουλάχιστον $\left\lceil N/k\right\rceil$ αντικείμενα. Ο ελάχιστος $N$ που εξασφαλίζει ότι κάποιο κουτί έχει τουλάχιστον $r$ αντικείμενα είναι $N = k(r-1) + 1$.</p></div>
<div class="tbox tip"><h4>Παράδειγμα</h4>
<p>Πόσες πινακίδες της μορφής «3 κεφαλαία λατινικά γράμματα και 3 ψηφία» υπάρχουν; Κανόνας του γινομένου: $26^3\cdot 10^3 = 17\,576\,000$.</p>
<p>Σε μια ομάδα $100$ ατόμων, τουλάχιστον $\lceil 100/12\rceil = 9$ έχουν γενέθλια τον ίδιο μήνα.</p></div>
<div class="tbox warn"><h4>Συνηθισμένα λάθη</h4>
<p>Ο κανόνας του αθροίσματος απαιτεί <b>ξένες</b> περιπτώσεις — διαφορετικά μετράμε κάποιες δύο φορές. Ο κανόνας του γινομένου απαιτεί το πλήθος επιλογών του 2ου βήματος να <b>μην εξαρτάται</b> από την επιλογή του 1ου (μόνο το πλήθος, όχι οι ίδιες οι επιλογές). Συχνά είναι πιο εύκολο να μετρήσουμε το <b>συμπλήρωμα</b>: «τουλάχιστον ένα» $=$ όλα $-$ «κανένα».</p></div>`,
  widget: "dsbpigeon",
  gen: "dsbcnt",
  exercises: [
    { level: 1, type: "fields", q: R`Πόσες δυαδικές συμβολοσειρές μήκους $8$ υπάρχουν; Πόσες από αυτές αρχίζουν και τελειώνουν με $1$;`,
      fields: [{ label: "όλες =", ans: 256 }, { label: "αρχή & τέλος 1 =", ans: 64 }], hint: R`Κανόνας του γινομένου: $2$ επιλογές για κάθε θέση.`,
      sol: R`$2^8 = 256$. Αν η 1η και η 8η θέση είναι υποχρεωτικά $1$, μένουν $6$ ελεύθερες θέσεις: $2^6 = 64$.` },
    { level: 1, type: "fields", q: R`Πόσες συναρτήσεις $f: A\to B$ υπάρχουν, αν $|A| = 4$ και $|B| = 3$; Πόσες από αυτές είναι ένα-προς-ένα;`,
      fields: [{ label: "συναρτήσεις =", ans: 81 }, { label: "1-1 =", ans: 0 }], hint: R`Για κάθε στοιχείο του $A$ διαλέγουμε εικόνα. Για 1-1 χρειάζεται $|A|\le|B|$.`,
      sol: R`Κάθε ένα από τα $4$ στοιχεία έχει $3$ επιλογές εικόνας: $3^4 = 81$. Συνάρτηση 1-1 από σύνολο $4$ στοιχείων σε σύνολο $3$ στοιχείων δεν υπάρχει (αρχή του περιστερώνα): $0$.` },
    { level: 1, type: "fields", q: R`Πόσοι τετραψήφιοι κωδικοί (ψηφία $0$–$9$, επιτρέπεται επανάληψη και αρχικό $0$) περιέχουν <b>τουλάχιστον ένα</b> $7$;`,
      fields: [{ label: "πλήθος =", ans: 3439 }], hint: R`Όλοι μείον αυτοί που δεν έχουν κανένα $7$.`,
      sol: R`Όλοι: $10^4 = 10\,000$. Χωρίς κανένα $7$: $9^4 = 6561$. Άρα $10\,000 - 6561 = 3439$.` },
    { level: 1, type: "fields", q: R`Πόσα άτομα πρέπει να έχει μια ομάδα ώστε να είμαστε <b>βέβαιοι</b> ότι τουλάχιστον $4$ από αυτά έχουν γενέθλια τον ίδιο μήνα;`,
      fields: [{ label: "ελάχιστο N =", ans: 37 }], hint: R`$N = k(r-1) + 1$ με $k = 12$, $r = 4$.`,
      sol: R`Με $36$ άτομα μπορεί να έχουμε ακριβώς $3$ ανά μήνα. Με $N = 12\cdot 3 + 1 = 37$ κάποιος μήνας έχει τουλάχιστον $\lceil 37/12\rceil = 4$.` },
    { level: 2, type: "fields", q: R`Ένας κωδικός πρόσβασης έχει μήκος $6$ και κάθε χαρακτήρας είναι κεφαλαίο λατινικό γράμμα ή ψηφίο. Ο κωδικός πρέπει να περιέχει τουλάχιστον ένα ψηφίο. Πόσοι κωδικοί υπάρχουν;`,
      fields: [{ label: "πλήθος =", ans: 1867866560 }], hint: R`$36^6 - 26^6$.`,
      sol: R`Όλοι οι κωδικοί με $36$ σύμβολα: $36^6 = 2\,176\,782\,336$. Χωρίς κανένα ψηφίο (μόνο γράμματα): $26^6 = 308\,915\,776$. Διαφορά: $1\,867\,866\,560$.` },
    { level: 2, type: "fields", q: R`Πόσοι θετικοί ακέραιοι μεταξύ $100$ και $999$ (τριψήφιοι) είναι <b>περιττοί</b> με <b>διαφορετικά</b> ψηφία;`,
      fields: [{ label: "πλήθος =", ans: 320 }], hint: R`Ξεκινήστε από τις θέσεις με περιορισμούς: μονάδες, μετά εκατοντάδες, μετά δεκάδες.`,
      sol: R`Μονάδες: $5$ επιλογές ($1,3,5,7,9$). Εκατοντάδες: όχι $0$ και όχι το ψηφίο των μονάδων: $8$. Δεκάδες: οποιοδήποτε από τα $10$ εκτός των δύο που χρησιμοποιήθηκαν: $8$. Σύνολο $5\cdot 8\cdot 8 = 320$.` },
    { level: 2, type: "mc", q: R`Επιλέγουμε $6$ ακέραιους από το σύνολο $\{1, 2, \dots, 10\}$. Ποια πρόταση είναι <b>πάντα</b> αληθής;`,
      options: ["Δύο από αυτούς έχουν άθροισμα $11$", "Δύο από αυτούς είναι διαδοχικοί άρτιοι", "Ένας από αυτούς είναι πρώτος", "Δύο από αυτούς έχουν άθροισμα $10$"], correct: 0,
      hint: R`Φτιάξτε «κουτιά» από ζεύγη με σταθερό άθροισμα.`,
      sol: R`Τα $5$ ζεύγη $\{1,10\},\{2,9\},\{3,8\},\{4,7\},\{5,6\}$ είναι κουτιά· $6$ αριθμοί σε $5$ κουτιά ⇒ δύο στο ίδιο ζεύγος, με άθροισμα $11$. Οι υπόλοιπες δεν ισχύουν πάντα: π.χ. $\{1,4,6,8,9,10\}$ δεν περιέχει πρώτο, το $\{1,3,5,7,8,9\}$ έχει μόνο έναν άρτιο, και το $\{5,6,7,8,9,10\}$ δεν έχει ζεύγος με άθροισμα $10$.` },
    { level: 2, type: "fields", q: R`Πόσες δυαδικές συμβολοσειρές μήκους $7$ είτε αρχίζουν με $1$ είτε τελειώνουν με $00$;`,
      fields: [{ label: "πλήθος =", ans: 80 }], hint: R`Κανόνας της αφαίρεσης: $|A\cup B| = |A| + |B| - |A\cap B|$.`,
      sol: R`Αρχίζουν με $1$: $2^6 = 64$. Τελειώνουν με $00$: $2^5 = 32$. Και τα δύο: $2^4 = 16$. Άρα $64 + 32 - 16 = 80$.` },
    { level: 3, type: "mc", q: R`Σε ένα τουρνουά $n \ge 2$ παικτών κάθε παίκτης παίζει το πολύ μία φορά με κάθε άλλον. Ποια πρόταση αποδεικνύεται με την αρχή του περιστερώνα;`,
      options: ["Υπάρχουν δύο παίκτες με τον ίδιο αριθμό αγώνων", "Κάποιος παίκτης έχει παίξει με όλους", "Το πλήθος των αγώνων είναι άρτιο", "Κάθε παίκτης έχει παίξει τουλάχιστον έναν αγώνα"], correct: 0,
      hint: R`Οι δυνατές τιμές του πλήθους αγώνων είναι $0, 1, \dots, n-1$ — μπορούν να εμφανιστούν ταυτόχρονα και οι δύο ακραίες;`,
      sol: R`Το πλήθος αγώνων κάθε παίκτη ανήκει στο $\{0, \dots, n-1\}$ ($n$ τιμές), αλλά οι τιμές $0$ και $n-1$ δεν μπορούν να εμφανιστούν μαζί (αυτός με $n-1$ αγώνες έπαιξε και με αυτόν που έχει $0$). Άρα το πολύ $n-1$ δυνατές τιμές για $n$ παίκτες ⇒ δύο παίκτες με τον ίδιο αριθμό αγώνων. Οι άλλες προτάσεις δεν ισχύουν γενικά (π.χ. όταν έχει γίνει ένας μόνο αγώνας: περιττό πλήθος αγώνων, και κάποιοι δεν έπαιξαν καθόλου· με $n\ge 3$ κανείς δεν έπαιξε με όλους).` }
  ]
},
/* ───────────────────────────── 4.2 ───────────────────────────── */
{
  id: "4.2", unit: 4, title: "Διατάξεις και συνδυασμοί",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 4 · Βλ. και Rosen, κεφ. «Counting» (§ Permutations and Combinations, Generalized Permutations and Combinations)",
  theory: R`
<div class="tbox"><h4>Διατάξεις και συνδυασμοί χωρίς επανάληψη</h4>
<ul><li><b>Διατάξεις</b> $r$ από $n$ (έχει σημασία η σειρά), $0\le r\le n$: $P(n,r) = \dfrac{n!}{(n-r)!}$, δηλαδή το γινόμενο $n(n-1)\cdots(n-r+1)$. Ειδικά $P(n,n) = n!$ (μεταθέσεις).</li>
<li><b>Συνδυασμοί</b> $r$ από $n$ (δεν έχει σημασία η σειρά — υποσύνολα): $C(n,r) = \dbinom{n}{r} = \dfrac{n!}{r!\,(n-r)!}$, δηλαδή $\dfrac{P(n,r)}{r!}$.</li>
<li>$\dbinom{n}{r} = \dbinom{n}{n-r}$ (επιλέγω ποια μπαίνουν ⇔ ποια μένουν έξω).</li></ul></div>
<div class="tbox"><h4>Με επανάληψη – ομοειδή αντικείμενα</h4>
<table class="tbl"><tr><th></th><th>με σειρά</th><th>χωρίς σειρά</th></tr>
<tr><td>χωρίς επαν.</td><td>$\dfrac{n!}{(n-r)!}$</td><td>$\dbinom{n}{r}$</td></tr>
<tr><td>με επαν.</td><td>$n^r$</td><td>$\dbinom{n+r-1}{r}$</td></tr></table>
<p><b>Μεταθέσεις με ομοειδή:</b> $n$ αντικείμενα, από τα οποία $n_1$ ίδια του τύπου 1, …, $n_k$ ίδια του τύπου $k$: $\dfrac{n!}{n_1!\,n_2!\cdots n_k!}$ (π.χ. αναγραμματισμοί λέξης).</p>
<p><b>«Αστέρια και μπάρες»:</b> το πλήθος των μη αρνητικών ακέραιων λύσεων της $x_1 + \cdots + x_n = r$ (ισοδύναμα: $r$ ίδια αντικείμενα σε $n$ διαφορετικά κουτιά) είναι $\dbinom{n+r-1}{r} = \dbinom{n+r-1}{n-1}$.</p></div>
<div class="tbox tip"><h4>Παράδειγμα</h4>
<p>Οι αναγραμματισμοί της λέξης <b>BANANA</b>: $6$ γράμματα με $3$ A, $2$ N, $1$ B: $\dfrac{6!}{3!\,2!\,1!} = 60$.</p>
<p>Επιτροπή $4$ ατόμων από $6$ άνδρες και $5$ γυναίκες με ακριβώς $2$ γυναίκες: $\binom{5}{2}\binom{6}{2} = 10\cdot 15 = 150$.</p></div>
<div class="tbox warn"><h4>Πώς διαλέγω τύπο</h4>
<p>Δύο ερωτήσεις: <b>(1)</b> Μετράει η σειρά; <b>(2)</b> Επιτρέπεται επανάληψη; Ένα κλασικό λάθος είναι η διπλομέτρηση σε προβλήματα «τουλάχιστον»: π.χ. «επιτροπή με τουλάχιστον μία γυναίκα» δεν είναι $\binom51\binom{10}{3}$ — μετράμε όλες μείον αυτές χωρίς γυναίκα.</p></div>`,
  widget: "dsbperm",
  gen: "dsbpc",
  exercises: [
    { level: 1, type: "fields", q: R`Από $10$ δρομείς απονέμονται χρυσό, ασημένιο και χάλκινο μετάλλιο. Με πόσους τρόπους; Με πόσους τρόπους μπορούμε απλώς να επιλέξουμε τους $3$ που θα πάρουν μετάλλιο;`,
      fields: [{ label: "απονομές =", ans: 720 }, { label: "τριάδες =", ans: 120 }], hint: R`Η πρώτη ερώτηση: σημασία έχει η σειρά. Η δεύτερη: όχι.`,
      sol: R`$P(10,3) = 10\cdot 9\cdot 8 = 720$ και $C(10,3) = \frac{720}{3!} = 120$.` },
    { level: 1, type: "fields", q: R`Πόσοι είναι οι αναγραμματισμοί της λέξης <b>MISSISSIPPI</b>;`,
      fields: [{ label: "πλήθος =", ans: 34650 }], hint: R`$11$ γράμματα: M ×1, I ×4, S ×4, P ×2.`,
      sol: R`$\dfrac{11!}{1!\,4!\,4!\,2!} = \dfrac{39\,916\,800}{1152} = 34\,650$.` },
    { level: 1, type: "fields", q: R`Πόσες είναι οι μη αρνητικές ακέραιες λύσεις της εξίσωσης $x_1 + x_2 + x_3 = 11$; Πόσες έχουν $x_i \ge 1$ για κάθε $i$;`,
      fields: [{ label: "x_i ≥ 0 :", ans: 78 }, { label: "x_i ≥ 1 :", ans: 45 }], hint: R`Αστέρια και μπάρες· για $x_i\ge 1$ θέτουμε $y_i = x_i - 1$.`,
      sol: R`$\binom{11+3-1}{11} = \binom{13}{2} = 78$. Με $y_i = x_i - 1 \ge 0$: $y_1 + y_2 + y_3 = 8$, άρα $\binom{10}{2} = 45$.` },
    { level: 1, type: "mc", q: R`Για ποιον από τους παρακάτω υπολογισμούς ο σωστός τύπος είναι ο $\binom{n+r-1}{r}$;`,
      options: ["Επιλογή $r$ μπαλών από $n$ χρώματα, με επανάληψη, χωρίς σειρά", "Επιλογή $r$ από $n$ ατόμων για επιτροπή", "Κωδικοί μήκους $r$ από αλφάβητο $n$ συμβόλων", "Κατάταξη $r$ από $n$ δρομείς"], correct: 0,
      hint: R`Ο τύπος αντιστοιχεί σε «με επανάληψη, χωρίς σειρά».`,
      sol: R`Επιλογή μπαλών από $n$ χρώματα με επανάληψη και χωρίς σειρά: $\binom{n+r-1}{r}$. Η επιτροπή είναι $\binom{n}{r}$, οι κωδικοί $n^r$, η κατάταξη $P(n,r)$.` },
    { level: 2, type: "fields", q: R`Μια επιτροπή $4$ ατόμων επιλέγεται από $6$ άνδρες και $5$ γυναίκες. Πόσες επιτροπές έχουν <b>τουλάχιστον μία</b> γυναίκα;`,
      fields: [{ label: "πλήθος =", ans: 315 }], hint: R`Όλες μείον αυτές που αποτελούνται μόνο από άνδρες.`,
      sol: R`Όλες: $\binom{11}{4} = 330$. Μόνο άνδρες: $\binom64 = 15$. Άρα $330 - 15 = 315$.` },
    { level: 2, type: "fields", q: R`Ένα ζαχαροπλαστείο έχει $6$ είδη κουλουριών (απεριόριστη ποσότητα από κάθε είδος). Με πόσους τρόπους μπορούμε να αγοράσουμε $12$ κουλούρια;`,
      fields: [{ label: "τρόποι =", ans: 6188 }], hint: R`Συνδυασμοί με επανάληψη: $n = 6$ είδη, $r = 12$.`,
      sol: R`$\dbinom{6 + 12 - 1}{12} = \dbinom{17}{12} = \dbinom{17}{5} = 6188$.` },
    { level: 2, type: "fields", q: R`Με πόσους τρόπους κάθονται $7$ άτομα σε μια σειρά $7$ καθισμάτων, αν δύο συγκεκριμένα άτομα (η Άννα και ο Βασίλης) πρέπει να κάθονται <b>δίπλα</b>; Και αν πρέπει να <b>μην</b> κάθονται δίπλα;`,
      fields: [{ label: "δίπλα =", ans: 1440 }, { label: "όχι δίπλα =", ans: 3600 }], hint: R`Θεωρήστε το ζευγάρι ως ένα «μπλοκ» που μπορεί να γυρίσει με $2$ τρόπους.`,
      sol: R`Μπλοκ + $5$ άτομα = $6$ μονάδες: $6!\cdot 2 = 1440$. Όλες οι διατάξεις: $7! = 5040$, άρα όχι δίπλα: $5040 - 1440 = 3600$.` },
    { level: 3, type: "fields", q: R`Πόσες δυαδικές συμβολοσειρές μήκους $10$ έχουν ακριβώς $4$ άσσους, <b>κανέναν δύο από τους οποίους διαδοχικούς</b>;`,
      fields: [{ label: "πλήθος =", ans: 35 }], hint: R`Τοποθετήστε πρώτα τα $6$ μηδενικά· οι άσσοι μπαίνουν στα $7$ «κενά» ανάμεσα/στις άκρες, το πολύ ένας ανά κενό.`,
      sol: R`Τα $6$ μηδενικά δημιουργούν $7$ θέσεις (πριν, ανάμεσα, μετά). Επιλέγουμε $4$ διαφορετικές θέσεις: $\binom74 = 35$.` },
    { level: 3, type: "fields", q: R`Με πόσους τρόπους μοιράζονται $10$ <b>ίδιες</b> καραμέλες σε $4$ παιδιά, ώστε κάθε παιδί να πάρει τουλάχιστον $1$ και κανένα <b>περισσότερες από $4$</b>;`,
      fields: [{ label: "τρόποι =", ans: 44 }], hint: R`Με $y_i = x_i - 1$: $y_1 + \dots + y_4 = 6$, $0\le y_i\le 3$. Αφαιρέστε τις λύσεις με κάποιο $y_i \ge 4$.`,
      sol: R`Χωρίς άνω φράγμα: $\binom{6+3}{3} = 84$. Λύσεις με $y_1 \ge 4$: θέτουμε $z_1 = y_1 - 4$, άθροισμα $2$: $\binom{2+3}{3} = 10$· ίδιο για κάθε $i$, και δύο μεταβλητές $\ge 4$ αδύνατο ($8 > 6$). Άρα $84 - 4\cdot 10 = 44$.` }
  ]
},
/* ───────────────────────────── 4.3 ───────────────────────────── */
{
  id: "4.3", unit: 4, title: "Διωνυμικοί συντελεστές – Διωνυμικό θεώρημα – Τρίγωνο του Pascal",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 4 · Βλ. και Rosen, κεφ. «Counting» (§ Binomial Coefficients and Identities)",
  theory: R`
<div class="tbox"><h4>Διωνυμικό θεώρημα</h4>
<p>Για κάθε $x, y$ και ακέραιο $n \ge 0$:
$$(x + y)^n = \sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^{k} = x^n + \binom n1 x^{n-1}y + \cdots + \binom{n}{n-1}xy^{n-1} + y^n.$$
Ο <b>γενικός όρος</b> είναι $T_{k+1} = \binom{n}{k}x^{n-k}y^k$. Συνδυαστική απόδειξη: ο όρος $x^{n-k}y^k$ προκύπτει διαλέγοντας $y$ από $k$ από τους $n$ παράγοντες.</p></div>
<div class="tbox"><h4>Ταυτότητες</h4>
<ul><li><b>Pascal:</b> $\dbinom{n+1}{k} = \dbinom{n}{k-1} + \dbinom{n}{k}$, $\ 1\le k\le n$ — από αυτήν χτίζεται το <b>τρίγωνο του Pascal</b>.</li>
<li>$\displaystyle\sum_{k=0}^n\binom nk = 2^n$ (για $x = y = 1$) και $\displaystyle\sum_{k=0}^n(-1)^k\binom nk = 0$, $n\ge 1$ (για $x = 1, y = -1$).</li>
<li><b>Vandermonde:</b> $\dbinom{m+n}{r} = \displaystyle\sum_{k=0}^{r}\binom{m}{r-k}\binom{n}{k}$.</li></ul></div>
<div class="tbox tip"><h4>Παράδειγμα</h4>
<p>Ο συντελεστής του $x^3$ στο $(2x - 1)^5$: γενικός όρος $\binom5k(2x)^{5-k}(-1)^k$, θέλουμε $5 - k = 3 \Rightarrow k = 2$: $\binom52\cdot 2^3\cdot(-1)^2 = 10\cdot 8 = 80$.</p></div>
<div class="tbox warn"><h4>Προσοχή</h4>
<p>Ο <b>συντελεστής</b> περιλαμβάνει και τις σταθερές μέσα στους όρους (εδώ το $2^3$ και το πρόσημο $(-1)^k$), όχι μόνο το $\binom nk$. Επίσης στο $\left(x^2 - \frac1x\right)^n$ ο εκθέτης του $x$ στον γενικό όρο είναι $2(n-k) - k$: λύνουμε πρώτα ως προς $k$ και ελέγχουμε ότι είναι ακέραιος στο $[0, n]$.</p></div>`,
  widget: "dsbpascal",
  gen: "dsbbin",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε τον συντελεστή του $x^7$ στο ανάπτυγμα του $(x + 2)^9$.`, fields: [{ label: "συντελεστής =", ans: 144 }],
      hint: R`Γενικός όρος $\binom9k x^{9-k}2^k$ με $9 - k = 7$.`, sol: R`$k = 2$: $\binom92\cdot 2^2 = 36\cdot 4 = 144$.` },
    { level: 1, type: "fields", q: R`Να βρείτε τον συντελεστή του $x^2y^2$ στο ανάπτυγμα του $(3x - 2y)^4$.`, fields: [{ label: "συντελεστής =", ans: 216 }],
      hint: R`$\binom42(3x)^2(-2y)^2$.`, sol: R`$\binom42\cdot 3^2\cdot(-2)^2 = 6\cdot 9\cdot 4 = 216$.` },
    { level: 1, type: "fields", q: R`Πόσο είναι το άθροισμα $\binom{10}{0} + \binom{10}{1} + \cdots + \binom{10}{10}$; Και το $\binom{10}{0} - \binom{10}{1} + \binom{10}{2} - \cdots + \binom{10}{10}$;`,
      fields: [{ label: "1ο άθροισμα =", ans: 1024 }, { label: "2ο άθροισμα =", ans: 0 }], hint: R`Διωνυμικό θεώρημα με $x = y = 1$ και με $x = 1$, $y = -1$.`,
      sol: R`$(1 + 1)^{10} = 1024$ και $(1 - 1)^{10} = 0$.` },
    { level: 1, type: "mc", q: R`Ποια ισότητα είναι η ταυτότητα του Pascal;`,
      options: ["$\\binom{n+1}{k} = \\binom{n}{k-1} + \\binom{n}{k}$", "$\\binom{n+1}{k} = \\binom{n}{k} + \\binom{n}{k+1}$", "$\\binom{n}{k} = \\binom{n-1}{k-1}\\binom{n-1}{k}$", "$\\binom{n+1}{k+1} = \\binom{n}{k} + 1$"], correct: 0,
      hint: R`Ένα στοιχείο του τριγώνου είναι το άθροισμα των δύο από πάνω του.`,
      sol: R`$\binom{n+1}{k} = \binom{n}{k-1} + \binom{n}{k}$: τα υποσύνολα $k$ στοιχείων του $\{1,\dots,n+1\}$ είτε περιέχουν το $n+1$ ($\binom{n}{k-1}$) είτε όχι ($\binom nk$).` },
    { level: 2, type: "fields", q: R`Να βρείτε τον σταθερό όρο (τον όρο που δεν περιέχει $x$) στο ανάπτυγμα του $\left(x^2 + \dfrac{1}{x}\right)^{9}$.`,
      fields: [{ label: "σταθερός όρος =", ans: 84 }], hint: R`Γενικός όρος $\binom9k x^{2(9-k)}x^{-k}$· λύστε $18 - 3k = 0$.`,
      sol: R`Εκθέτης $2(9-k) - k = 18 - 3k = 0 \Rightarrow k = 6$. Όρος $\binom96 = 84$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τον συντελεστή του $x^4$ στο ανάπτυγμα του $\left(x^2 - \dfrac1x\right)^{8}$.`,
      fields: [{ label: "συντελεστής =", ans: 70 }], hint: R`Εκθέτης $16 - 3k = 4$.`,
      sol: R`$16 - 3k = 4 \Rightarrow k = 4$: $\binom84(-1)^4 = 70$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε το $\displaystyle\sum_{k=0}^{6}\binom6k 2^k$.`, fields: [{ label: "=", ans: 729 }],
      hint: R`Αναγνωρίστε το ανάπτυγμα του $(1 + 2)^6$.`, sol: R`$\sum_k\binom6k 1^{6-k}2^k = (1+2)^6 = 3^6 = 729$.` },
    { level: 2, type: "mc", q: R`Η $n$-οστή γραμμή του τριγώνου του Pascal (για $n\ge 1$) έχει άθροισμα $2^n$ και είναι συμμετρική.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`$\binom nk = \binom{n}{n-k}$.`,
      sol: R`Σωστό: $\sum_k\binom nk = 2^n$ και $\binom nk = \binom{n}{n-k}$.` },
    { level: 3, type: "fields", q: R`Από $5$ μαθηματικούς και $7$ πληροφορικούς επιλέγεται ομάδα $4$ ατόμων. Χρησιμοποιώντας την ταυτότητα Vandermonde, να υπολογίσετε το $\displaystyle\sum_{k=0}^{4}\binom{5}{4-k}\binom{7}{k}$ και το πλήθος των ομάδων με ακριβώς $2$ πληροφορικούς.`,
      fields: [{ label: "άθροισμα =", ans: 495 }, { label: "2 πληροφορικοί =", ans: 210 }], hint: R`Το άθροισμα μετρά όλες τις ομάδες $4$ από $12$.`,
      sol: R`Vandermonde: $\sum_k\binom{5}{4-k}\binom7k = \binom{12}{4} = 495$. Ο όρος $k = 2$: $\binom52\binom72 = 10\cdot 21 = 210$.` }
  ]
},
/* ───────────────────────────── 4.4 ───────────────────────────── */
{
  id: "4.4", unit: 4, title: "Αρχή εγκλεισμού–αποκλεισμού – Διαταράξεις",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 4 · Βλ. και Rosen, κεφ. «Advanced Counting Techniques» (§ Inclusion–Exclusion, Applications of Inclusion–Exclusion)",
  theory: R`
<div class="tbox"><h4>Αρχή εγκλεισμού–αποκλεισμού</h4>
<p>$|A\cup B| = |A| + |B| - |A\cap B|$,</p>
<p>$|A\cup B\cup C| = |A| + |B| + |C| - |A\cap B| - |A\cap C| - |B\cap C| + |A\cap B\cap C|$.</p>
<p>Γενικά, για πεπερασμένα σύνολα $A_1,\dots,A_n$:
$$\Big|\bigcup_{i=1}^n A_i\Big| = \sum_i|A_i| - \sum_{i\lt j}|A_i\cap A_j| + \sum_{i\lt j\lt k}|A_i\cap A_j\cap A_k| - \cdots + (-1)^{n+1}|A_1\cap\cdots\cap A_n|.$$
Το πλήθος των στοιχείων ενός συνόλου $U$ που <b>δεν</b> έχουν καμία από τις ιδιότητες είναι $|U| - |A_1\cup\cdots\cup A_n|$.</p></div>
<div class="tbox"><h4>Εφαρμογές</h4>
<ul><li><b>Διαιρετότητα:</b> το πλήθος των $m\in\{1,\dots,N\}$ που διαιρούνται με $d$ είναι $\lfloor N/d\rfloor$· με $a$ και $b$ ταυτόχρονα: $\lfloor N/\operatorname{ΕΚΠ}(a,b)\rfloor$.</li>
<li><b>Συναρτήσεις επί:</b> από σύνολο $m$ στοιχείων σε σύνολο $n$ στοιχείων: $\displaystyle\sum_{k=0}^{n}(-1)^k\binom nk(n-k)^m$.</li>
<li><b>Διαταράξεις</b> (μεταθέσεις χωρίς σταθερό σημείο): $D_n = n!\left(1 - \frac1{1!} + \frac1{2!} - \cdots + (-1)^n\frac1{n!}\right)$· $D_1 = 0$, $D_2 = 1$, $D_3 = 2$, $D_4 = 9$, $D_5 = 44$, $D_6 = 265$. Ισχύει $D_n/n!\to 1/e$.</li></ul></div>
<div class="tbox tip"><h4>Παράδειγμα</h4>
<p>Πόσοι ακέραιοι στο $\{1,\dots,1000\}$ διαιρούνται με $3$ ή με $5$; $\lfloor 1000/3\rfloor + \lfloor 1000/5\rfloor - \lfloor 1000/15\rfloor = 333 + 200 - 66 = 467$.</p></div>
<div class="tbox warn"><h4>Συνηθισμένα λάθη</h4>
<p>Για «διαιρείται με $a$ και $b$» χρησιμοποιούμε το <b>ΕΚΠ</b>, όχι το γινόμενο, όταν οι $a, b$ δεν είναι πρώτοι μεταξύ τους (π.χ. με $4$ και $6$ ⇔ με $12$). Και τα πρόσημα εναλλάσσονται: οι τομές τριών συνόλων <b>προστίθενται</b>.</p></div>`,
  widget: "dsbincl",
  gen: "dsbie",
  exercises: [
    { level: 1, type: "fields", q: R`Σε μια τάξη $40$ φοιτητών, $25$ παρακολουθούν Διακριτά, $18$ Γραμμική Άλγεβρα και $9$ και τα δύο. Πόσοι παρακολουθούν τουλάχιστον ένα από τα δύο; Πόσοι κανένα;`,
      fields: [{ label: "τουλάχιστον ένα =", ans: 34 }, { label: "κανένα =", ans: 6 }], hint: R`$|A\cup B| = |A| + |B| - |A\cap B|$.`,
      sol: R`$25 + 18 - 9 = 34$, και κανένα: $40 - 34 = 6$.` },
    { level: 1, type: "fields", q: R`Πόσοι ακέραιοι στο $\{1, 2, \dots, 100\}$ <b>δεν</b> διαιρούνται με κανέναν από τους $2, 3, 5$;`,
      fields: [{ label: "πλήθος =", ans: 26 }], hint: R`Υπολογίστε πρώτα πόσοι διαιρούνται με τουλάχιστον έναν.`,
      sol: R`$|A_2\cup A_3\cup A_5| = 50 + 33 + 20 - 16 - 10 - 6 + 3 = 74$ (με $\lfloor 100/6\rfloor = 16$, $\lfloor 100/10\rfloor = 10$, $\lfloor 100/15\rfloor = 6$, $\lfloor 100/30\rfloor = 3$). Άρα $100 - 74 = 26$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε τις διαταράξεις $D_4$ και $D_5$.`,
      fields: [{ label: "D₄ =", ans: 9 }, { label: "D₅ =", ans: 44 }], hint: R`$D_n = n!\sum_{k=0}^n\frac{(-1)^k}{k!}$.`,
      sol: R`$D_4 = 24\left(1 - 1 + \frac12 - \frac16 + \frac1{24}\right) = 12 - 4 + 1 = 9$. $D_5 = 120\left(\frac12 - \frac16 + \frac1{24} - \frac1{120}\right) = 60 - 20 + 5 - 1 = 44$.` },
    { level: 2, type: "fields", q: R`Πόσοι ακέραιοι στο $\{1, \dots, 600\}$ διαιρούνται με $4$ ή με $6$;`,
      fields: [{ label: "πλήθος =", ans: 200 }], hint: R`ΕΚΠ$(4, 6) = 12$.`,
      sol: R`$\lfloor 600/4\rfloor + \lfloor 600/6\rfloor - \lfloor 600/12\rfloor = 150 + 100 - 50 = 200$.` },
    { level: 2, type: "fields", q: R`Πόσες είναι οι συναρτήσεις <b>επί</b> από ένα σύνολο $5$ στοιχείων σε ένα σύνολο $3$ στοιχείων;`,
      fields: [{ label: "πλήθος =", ans: 150 }], hint: R`Όλες μείον αυτές που «χάνουν» τουλάχιστον ένα στοιχείο του συνόλου αφίξεως.`,
      sol: R`$3^5 - \binom31 2^5 + \binom32 1^5 - 0 = 243 - 96 + 3 = 150$.` },
    { level: 2, type: "fields", q: R`Σε μια γραμματεία $6$ επιστολές μπαίνουν τυχαία σε $6$ φακέλους με διευθύνσεις. Με πόσους τρόπους <b>καμία</b> επιστολή δεν μπαίνει στον σωστό φάκελο; Με πόσους τρόπους <b>ακριβώς μία</b> μπαίνει στον σωστό;`,
      fields: [{ label: "καμία =", ans: 265 }, { label: "ακριβώς μία =", ans: 264 }], hint: R`Για ακριβώς μία: επιλέξτε ποια είναι σωστή και διαταράξτε τις υπόλοιπες $5$.`,
      sol: R`Καμία: $D_6 = 265$. Ακριβώς μία: $\binom61 D_5 = 6\cdot 44 = 264$.` },
    { level: 2, type: "mc", q: R`Ποιος είναι ο σωστός τύπος για το $|A\cup B\cup C|$;`,
      options: ["$|A| + |B| + |C| - |A\\cap B| - |A\\cap C| - |B\\cap C| + |A\\cap B\\cap C|$", "$|A| + |B| + |C| - |A\\cap B\\cap C|$", "$|A| + |B| + |C| - |A\\cap B| - |A\\cap C| - |B\\cap C| - |A\\cap B\\cap C|$", "$|A| + |B| + |C|$"], correct: 0,
      hint: R`Τα πρόσημα εναλλάσσονται ανά «τάξη» τομής.`,
      sol: R`Ένα στοιχείο που ανήκει και στα τρία μετριέται $3 - 3 + 1 = 1$ φορά μόνο με τον τύπο που προσθέτει την τριπλή τομή.` },
    { level: 3, type: "fields", q: R`Πόσες είναι οι μεταθέσεις των ψηφίων $1, 2, \dots, 9$ που <b>δεν</b> περιέχουν καμία από τις συμβολοσειρές $12$, $34$, $56$ (ως διαδοχικά ψηφία);`,
      fields: [{ label: "πλήθος =", ans: 256320 }], hint: R`$|A_{12}| = 8!$ (το $12$ ως ένα σύμβολο), $|A_{12}\cap A_{34}| = 7!$, $|A_{12}\cap A_{34}\cap A_{56}| = 6!$.`,
      sol: R`Με $A_{12}, A_{34}, A_{56}$ τις μεταθέσεις που περιέχουν την αντίστοιχη συμβολοσειρά: $|A_{12}\cup A_{34}\cup A_{56}| = 3\cdot 8! - 3\cdot 7! + 6! = 120\,960 - 15\,120 + 720 = 106\,560$. Άρα $9! - 106\,560 = 362\,880 - 106\,560 = 256\,320$.` }
  ]
},
/* ───────────────────────────── 5.1 ───────────────────────────── */
{
  id: "5.1", unit: 5, title: "Αναδρομικές σχέσεις – Μοντελοποίηση",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 5 · Βλ. και Rosen, κεφ. «Advanced Counting Techniques» (§ Applications of Recurrence Relations)",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p>Μια <b>αναδρομική σχέση</b> για την ακολουθία $(a_n)$ εκφράζει τον $a_n$ συναρτήσει ενός ή περισσότερων προηγούμενων όρων $a_0, \dots, a_{n-1}$, για κάθε $n \ge n_0$. Μαζί με τις <b>αρχικές συνθήκες</b> (τους πρώτους όρους) ορίζει την ακολουθία μοναδικά. Μια ακολουθία είναι <b>λύση</b> της σχέσης αν οι όροι της την ικανοποιούν.</p></div>
<div class="tbox"><h4>Κλασικά μοντέλα</h4>
<ul><li><b>Ανατοκισμός:</b> $P_n = (1 + r)P_{n-1}$ ⇒ $P_n = (1 + r)^nP_0$.</li>
<li><b>Fibonacci:</b> $f_n = f_{n-1} + f_{n-2}$, $f_0 = 0$, $f_1 = 1$: $0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, \dots$</li>
<li><b>Πύργοι του Ανόι:</b> για να μετακινήσουμε $n$ δίσκους, μετακινούμε $n-1$ στον βοηθητικό στύλο, τον μεγαλύτερο στον τελικό και τους $n-1$ από πάνω του: $H_n = 2H_{n-1} + 1$, $H_1 = 1$, άρα $H_n = 2^n - 1$.</li>
<li><b>Δυαδικές συμβολοσειρές χωρίς δύο διαδοχικά $0$:</b> μια τέτοια συμβολοσειρά μήκους $n$ τελειώνει σε $1$ (πριν: οποιαδήποτε έγκυρη μήκους $n-1$) ή σε $10$ (πριν: έγκυρη μήκους $n-2$): $a_n = a_{n-1} + a_{n-2}$, $a_1 = 2$, $a_2 = 3$.</li></ul></div>
<div class="tbox tip"><h4>Μέθοδος μοντελοποίησης</h4>
<p>Χωρίζουμε τα αντικείμενα «μεγέθους $n$» σε <b>ξένες περιπτώσεις</b> ανάλογα με το τελευταίο (ή το πρώτο) βήμα· κάθε περίπτωση ανάγεται σε αντικείμενα μικρότερου μεγέθους. Ελέγχουμε τον τύπο στις μικρές τιμές με απαρίθμηση.</p></div>
<div class="tbox warn"><h4>Συνηθισμένα λάθη</h4>
<p>Ξεχνάμε τις αρχικές συνθήκες ή τις δίνουμε λάθος (π.χ. $a_1 = 2$ και όχι $1$ για τις συμβολοσειρές), ή οι περιπτώσεις δεν είναι ξένες/πλήρεις. Μια σχέση τάξης $k$ χρειάζεται $k$ αρχικές συνθήκες.</p></div>`,
  widget: "dsbrec",
  gen: "dsbrecm",
  exercises: [
    { level: 1, type: "fields", q: R`Η ακολουθία $(a_n)$ ορίζεται από $a_n = 2a_{n-1} + 3$ για $n \ge 1$ και $a_0 = 1$. Να βρείτε τους $a_3$ και $a_5$.`,
      fields: [{ label: "a₃ =", ans: 29 }, { label: "a₅ =", ans: 125 }], hint: R`Υπολογίστε διαδοχικά $a_1, a_2, \dots$`, sol: R`$a_1 = 2\cdot 1 + 3 = 5$, $a_2 = 2\cdot 5 + 3 = 13$, $a_3 = 2\cdot 13 + 3 = 29$, $a_4 = 61$, $a_5 = 125$. (Κλειστός τύπος: $a_n = 2^{n+2} - 3$.)` },
    { level: 1, type: "fields", q: R`Στους Πύργους του Ανόι ισχύει $H_n = 2H_{n-1} + 1$, $H_1 = 1$. Πόσες κινήσεις χρειάζονται για $6$ και για $10$ δίσκους;`,
      fields: [{ label: "H₆ =", ans: 63 }, { label: "H₁₀ =", ans: 1023 }], hint: R`$H_n = 2^n - 1$.`, sol: R`$H_6 = 2^6 - 1 = 63$ και $H_{10} = 2^{10} - 1 = 1023$ (επαλήθευση: $1, 3, 7, 15, 31, 63, \dots$).` },
    { level: 1, type: "fields", q: R`Με $f_0 = 0$, $f_1 = 1$, $f_n = f_{n-1} + f_{n-2}$, να βρείτε τους αριθμούς Fibonacci $f_{10}$ και $f_{12}$.`,
      fields: [{ label: "f₁₀ =", ans: 55 }, { label: "f₁₂ =", ans: 144 }], hint: R`$0, 1, 1, 2, 3, 5, 8, \dots$`, sol: R`$f_0,\dots,f_{12}$: $0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144$.` },
    { level: 1, type: "fields", q: R`Καταθέτουμε $1000$ € με ετήσιο επιτόκιο $5\%$ (ανατοκισμός). Αν $P_n$ το ποσό μετά από $n$ χρόνια, να βρείτε το $P_3$ (σε €, με δύο δεκαδικά).`,
      fields: [{ label: "P₃ =", ans: 1157.63, tol: 0.00001 }], hint: R`$P_n = 1{,}05\,P_{n-1}$.`, sol: R`$P_n = 1{,}05^n\cdot 1000$, άρα $P_3 = 1{,}157625\cdot 1000 \approx 1157{,}63$ €.` },
    { level: 1, type: "mc", q: R`Μια αναδρομική σχέση τάξης $2$ μαζί με τις τιμές $a_0$ και $a_1$ ορίζει μοναδική ακολουθία.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Επαγωγή στο $n$.`, sol: R`Σωστό: κάθε επόμενος όρος υπολογίζεται μονοσήμαντα από τους δύο προηγούμενους (ισχυρή επαγωγή).` },
    { level: 2, type: "fields", q: R`Έστω $a_n$ το πλήθος των δυαδικών συμβολοσειρών μήκους $n$ χωρίς δύο διαδοχικά $0$. Να βρείτε τον $a_7$ και το πλήθος των συμβολοσειρών μήκους $7$ που <b>περιέχουν</b> δύο διαδοχικά $0$.`,
      fields: [{ label: "a₇ =", ans: 34 }, { label: "περιέχουν 00 =", ans: 94 }], hint: R`$a_n = a_{n-1} + a_{n-2}$, $a_1 = 2$, $a_2 = 3$· το συμπλήρωμα ως προς $2^7$.`,
      sol: R`$a_1,\dots,a_7 = 2, 3, 5, 8, 13, 21, 34$. Άρα $34$ χωρίς «00» και $2^7 - 34 = 128 - 34 = 94$ με «00».` },
    { level: 2, type: "mc", q: R`Ένας φοιτητής ανεβαίνει μια σκάλα $n$ σκαλοπατιών, ανεβαίνοντας κάθε φορά $1$ ή $2$ σκαλοπάτια. Αν $s_n$ είναι το πλήθος των τρόπων, ποια σχέση ισχύει;`,
      options: ["$s_n = s_{n-1} + s_{n-2}$, $s_1 = 1$, $s_2 = 2$", "$s_n = 2s_{n-1}$, $s_1 = 1$", "$s_n = s_{n-1} + 2$, $s_1 = 1$", "$s_n = s_{n-1}s_{n-2}$, $s_1 = 1$, $s_2 = 2$"], correct: 0,
      hint: R`Ποιο είναι το τελευταίο βήμα;`, sol: R`Το τελευταίο βήμα είναι $1$ σκαλοπάτι (πριν: $s_{n-1}$ τρόποι) ή $2$ (πριν: $s_{n-2}$ τρόποι)· οι περιπτώσεις είναι ξένες. Αρχικές: $s_1 = 1$, $s_2 = 2$.` },
    { level: 2, type: "fields", q: R`Έστω $t_n$ το πλήθος των <b>τριαδικών</b> συμβολοσειρών μήκους $n$ (ψηφία $0, 1, 2$) χωρίς δύο διαδοχικά $0$. Ισχύει $t_n = 2t_{n-1} + 2t_{n-2}$ με $t_1 = 3$, $t_2 = 8$. Να βρείτε τους $t_3$, $t_4$.`,
      fields: [{ label: "t₃ =", ans: 22 }, { label: "t₄ =", ans: 60 }], hint: R`Τελευταίο ψηφίο $1$ ή $2$ (2 τρόποι, πριν έγκυρη μήκους $n-1$) ή $0$ (πριν $1$ ή $2$ και έγκυρη μήκους $n-2$).`,
      sol: R`$t_3 = 2\cdot 8 + 2\cdot 3 = 22$, $t_4 = 2\cdot 22 + 2\cdot 8 = 60$.` },
    { level: 3, type: "fields", q: R`Έστω $b_n$ το πλήθος των δυαδικών συμβολοσειρών μήκους $n$ που <b>περιέχουν</b> δύο διαδοχικά $0$. Ισχύει $b_n = b_{n-1} + b_{n-2} + 2^{n-2}$ για $n \ge 4$, με $b_2 = 1$, $b_3 = 3$. Να βρείτε τους $b_4$ και $b_5$.`,
      fields: [{ label: "b₄ =", ans: 8 }, { label: "b₅ =", ans: 19 }], hint: R`Αρχή $1$: $b_{n-1}$· αρχή $01$: $b_{n-2}$· αρχή $00$: οποιαδήποτε συνέχεια, $2^{n-2}$.`,
      sol: R`$b_4 = 3 + 1 + 4 = 8$ και $b_5 = 8 + 3 + 8 = 19$. Έλεγχος με το συμπλήρωμα: $2^5 - a_5 = 32 - 13 = 19$ ✓.` }
  ]
},
/* ───────────────────────────── 5.2 ───────────────────────────── */
{
  id: "5.2", unit: 5, title: "Επίλυση γραμμικών αναδρομικών σχέσεων με σταθερούς συντελεστές",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 5 · Βλ. και Rosen, κεφ. «Advanced Counting Techniques» (§ Solving Linear Recurrence Relations)",
  theory: R`
<div class="tbox"><h4>Ομογενείς σχέσεις 2ης τάξης</h4>
<p>Για τη γραμμική ομογενή σχέση με σταθερούς συντελεστές $a_n = c_1a_{n-1} + c_2a_{n-2}$ ($c_2 \ne 0$) η <b>χαρακτηριστική εξίσωση</b> είναι $r^2 - c_1r - c_2 = 0$.</p>
<ul><li>Δύο <b>διαφορετικές</b> ρίζες $r_1 \ne r_2$: η γενική λύση είναι $a_n = \alpha_1 r_1^n + \alpha_2 r_2^n$.</li>
<li><b>Διπλή</b> ρίζα $r_0$: $a_n = (\alpha_1 + \alpha_2 n)\,r_0^n$.</li></ul>
<p>Οι σταθερές $\alpha_1, \alpha_2$ προσδιορίζονται από τις αρχικές συνθήκες ($n = 0, 1$). Γενικά, για τάξη $k$ η χαρακτηριστική εξίσωση είναι $r^k - c_1r^{k-1} - \cdots - c_k = 0$, και κάθε ρίζα $r_i$ πολλαπλότητας $m_i$ συνεισφέρει στη γενική λύση τον όρο $(\alpha_{i,0} + \alpha_{i,1}n + \dots + \alpha_{i,m_i-1}n^{m_i-1})\,r_i^n$.</p></div>
<div class="tbox"><h4>Μη ομογενείς σχέσεις</h4>
<p>Για $a_n = c_1a_{n-1} + c_2a_{n-2} + F(n)$: κάθε λύση είναι $a_n = a_n^{(h)} + a_n^{(p)}$, όπου $a_n^{(h)}$ η γενική λύση της ομογενούς και $a_n^{(p)}$ μια <b>μερική λύση</b>. Αν $F(n) = d$ σταθερά, δοκιμάζουμε $a_n^{(p)} = C$ (αν το $1$ δεν είναι ρίζα)· αν $F(n) = d\,s^n$ με $s$ <b>όχι</b> ρίζα, δοκιμάζουμε $a_n^{(p)} = C s^n$. Αν το $s$ (ή το $1$ για σταθερό $F$) είναι ρίζα πολλαπλότητας $m$, δοκιμάζουμε $a_n^{(p)} = C\,n^m s^n$ (π.χ. $F(n) = d$ και ρίζα $1$: $a_n^{(p)} = Cn$). Γενικά, για $F(n) = (b_tn^t + \dots + b_0)\,s^n$ η μερική λύση έχει τη μορφή $n^m(p_tn^t + \dots + p_0)\,s^n$, όπου $m$ η πολλαπλότητα του $s$ ως ρίζας ($m = 0$ αν δεν είναι ρίζα).</p></div>
<div class="tbox tip"><h4>Παράδειγμα</h4>
<p>$a_n = a_{n-1} + 2a_{n-2}$, $a_0 = 2$, $a_1 = 7$. Χαρακτηριστική: $r^2 - r - 2 = 0 \Rightarrow r = 2, -1$. Άρα $a_n = \alpha_1 2^n + \alpha_2(-1)^n$, με $\alpha_1 + \alpha_2 = 2$, $2\alpha_1 - \alpha_2 = 7$ ⇒ $\alpha_1 = 3$, $\alpha_2 = -1$: $a_n = 3\cdot 2^n - (-1)^n$.</p></div>
<div class="tbox warn"><h4>Προσοχή</h4>
<p>Στη χαρακτηριστική εξίσωση τα πρόσημα αλλάζουν: η $a_n = 5a_{n-1} - 6a_{n-2}$ δίνει $r^2 - 5r + 6 = 0$. Στη μη ομογενή περίπτωση οι αρχικές συνθήκες εφαρμόζονται στη <b>συνολική</b> λύση $a_n^{(h)} + a_n^{(p)}$, όχι μόνο στην ομογενή.</p></div>`,
  widget: "dsbrec2",
  gen: "dsbrecs",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε τις ρίζες της χαρακτηριστικής εξίσωσης της $a_n = 7a_{n-1} - 10a_{n-2}$.`,
      fields: [{ label: "μικρότερη ρίζα =", ans: 2 }, { label: "μεγαλύτερη ρίζα =", ans: 5 }], hint: R`$r^2 - 7r + 10 = 0$.`, sol: R`$r^2 - 7r + 10 = (r - 2)(r - 5) = 0$, άρα $r = 2$ και $r = 5$.` },
    { level: 1, type: "mc", q: R`Ποια είναι η μορφή της γενικής λύσης της $a_n = 4a_{n-1} - 4a_{n-2}$;`,
      options: ["$(\\alpha_1 + \\alpha_2 n)2^n$", "$\\alpha_1 2^n + \\alpha_2 2^n$", "$\\alpha_1 2^n + \\alpha_2(-2)^n$", "$\\alpha_1 4^n + \\alpha_2(-4)^n$"], correct: 0,
      hint: R`$r^2 - 4r + 4 = 0$.`, sol: R`$(r - 2)^2 = 0$: διπλή ρίζα $2$, άρα $a_n = (\alpha_1 + \alpha_2 n)2^n$. Το $\alpha_1 2^n + \alpha_2 2^n$ είναι απλώς $c\,2^n$ και δεν μπορεί να ικανοποιήσει κάθε ζεύγος αρχικών συνθηκών.` },
    { level: 2, type: "fields", q: R`Να λύσετε την $a_n = 5a_{n-1} - 6a_{n-2}$ με $a_0 = 1$, $a_1 = 0$, γράφοντας τη λύση στη μορφή $a_n = \alpha\cdot 2^n + \beta\cdot 3^n$.`,
      fields: [{ label: "α =", ans: 3 }, { label: "β =", ans: -2 }], hint: R`$\alpha + \beta = 1$, $2\alpha + 3\beta = 0$.`,
      sol: R`Ρίζες $2, 3$. Από τις αρχικές: $\alpha + \beta = 1$, $2\alpha + 3\beta = 0 \Rightarrow \beta = -2$, $\alpha = 3$. Άρα $a_n = 3\cdot 2^n - 2\cdot 3^n$ (έλεγχος: $a_2 = 12 - 18 = -6 = 5\cdot 0 - 6\cdot 1$ ✓).` },
    { level: 2, type: "fields", q: R`Να λύσετε την $a_n = 6a_{n-1} - 9a_{n-2}$ με $a_0 = 1$, $a_1 = 6$, στη μορφή $a_n = (\alpha + \beta n)3^n$.`,
      fields: [{ label: "α =", ans: 1 }, { label: "β =", ans: 1 }], hint: R`$r^2 - 6r + 9 = (r - 3)^2$: διπλή ρίζα.`,
      sol: R`Διπλή ρίζα $3$. $a_0 = \alpha = 1$, $a_1 = 3(\alpha + \beta) = 6 \Rightarrow \beta = 1$. Άρα $a_n = (1 + n)3^n$.` },
    { level: 2, type: "fields", q: R`Να βρείτε τη λύση της $a_n = 2a_{n-1} + 3$, $a_0 = 1$, στη μορφή $a_n = \alpha\cdot 2^n + \gamma$.`,
      fields: [{ label: "α =", ans: 4 }, { label: "γ =", ans: -3 }], hint: R`Μερική λύση σταθερή: $C = 2C + 3$.`,
      sol: R`Μερική: $C = 2C + 3 \Rightarrow C = -3$. Γενική: $a_n = \alpha 2^n - 3$, και $a_0 = \alpha - 3 = 1 \Rightarrow \alpha = 4$. Άρα $a_n = 4\cdot 2^n - 3 = 2^{n+2} - 3$.` },
    { level: 2, type: "mc", q: R`Ο κλειστός τύπος (Binet) των αριθμών Fibonacci $f_0 = 0$, $f_1 = 1$ είναι:`,
      options: ["$f_n = \\dfrac{1}{\\sqrt5}\\left(\\dfrac{1+\\sqrt5}{2}\\right)^n - \\dfrac{1}{\\sqrt5}\\left(\\dfrac{1-\\sqrt5}{2}\\right)^n$", "$f_n = \\left(\\dfrac{1+\\sqrt5}{2}\\right)^n$", "$f_n = \\dfrac{1}{\\sqrt5}\\left(\\dfrac{1+\\sqrt5}{2}\\right)^n + \\dfrac{1}{\\sqrt5}\\left(\\dfrac{1-\\sqrt5}{2}\\right)^n$", "$f_n = 2^n - 1$"], correct: 0,
      hint: R`Ρίζες της $r^2 - r - 1 = 0$· από $f_0 = 0$ οι σταθερές είναι αντίθετες.`,
      sol: R`Ρίζες $\frac{1\pm\sqrt5}2$. Το $f_0 = \alpha_1 + \alpha_2 = 0$ δίνει $\alpha_2 = -\alpha_1$ και το $f_1 = 1$ δίνει $\alpha_1\sqrt5 = 1$. Άρα ο τύπος με τη διαφορά και συντελεστή $\frac{1}{\sqrt5}$.` },
    { level: 3, type: "fields", q: R`Να λύσετε την $a_n = 3a_{n-1} + 2^n$, $a_0 = 1$, στη μορφή $a_n = \alpha\cdot 3^n + C\cdot 2^n$.`,
      fields: [{ label: "α =", ans: 3 }, { label: "C =", ans: -2 }], hint: R`Μερική $C2^n$: $C2^n = 3C2^{n-1} + 2^n$.`,
      sol: R`Διαιρώντας με $2^{n-1}$: $2C = 3C + 2 \Rightarrow C = -2$. Τότε $a_n = \alpha 3^n - 2\cdot 2^n$ και $a_0 = \alpha - 2 = 1 \Rightarrow \alpha = 3$. Άρα $a_n = 3^{n+1} - 2^{n+1}$ (έλεγχος: $a_1 = 3 + 2 = 5 = 9 - 4$ ✓).` },
    { level: 3, type: "fields", q: R`Να λύσετε την $a_n = a_{n-1} + 6a_{n-2}$, $a_0 = 3$, $a_1 = 4$, στη μορφή $a_n = \alpha 3^n + \beta(-2)^n$, και να υπολογίσετε τον $a_5$.`,
      fields: [{ label: "α =", ans: 2 }, { label: "β =", ans: 1 }, { label: "a₅ =", ans: 454 }], hint: R`$r^2 - r - 6 = (r - 3)(r + 2)$.`,
      sol: R`$\alpha + \beta = 3$, $3\alpha - 2\beta = 4 \Rightarrow 5\alpha = 10$, $\alpha = 2$, $\beta = 1$. $a_5 = 2\cdot 243 + (-32) = 454$.` }
  ]
},
/* ───────────────────────────── 6.1 ───────────────────────────── */
{
  id: "6.1", unit: 6, title: "Σχέσεις και οι ιδιότητές τους – Κλειστότητες",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 6 · Βλ. και Rosen, κεφ. «Relations» (§ Relations and Their Properties, Representing Relations, Closures)",
  theory: R`
<div class="tbox"><h4>Ορισμοί</h4>
<p>Μια (διμελής) <b>σχέση</b> από το $A$ στο $B$ είναι ένα υποσύνολο $R \subseteq A\times B$· γράφουμε $a\,R\,b$ όταν $(a, b)\in R$. Σχέση <b>στο</b> $A$ είναι υποσύνολο του $A\times A$. Μια σχέση στο $A$ λέγεται:</p>
<ul><li><b>ανακλαστική</b>: $(a, a)\in R$ για κάθε $a\in A$·</li>
<li><b>συμμετρική</b>: $(a, b)\in R \Rightarrow (b, a)\in R$·</li>
<li><b>αντισυμμετρική</b>: $(a, b)\in R$ και $(b, a)\in R \Rightarrow a = b$·</li>
<li><b>μεταβατική</b>: $(a, b)\in R$ και $(b, c)\in R \Rightarrow (a, c)\in R$.</li></ul>
<p>Σε σύνολο με $n$ στοιχεία υπάρχουν $2^{n^2}$ σχέσεις, $2^{n(n-1)}$ ανακλαστικές, $2^{n(n+1)/2}$ συμμετρικές και $2^n3^{n(n-1)/2}$ αντισυμμετρικές.</p></div>
<div class="tbox"><h4>Αναπαράσταση με πίνακα και γράφημα</h4>
<p>Ο πίνακας $M_R = [m_{ij}]$ έχει $m_{ij} = 1$ αν $(a_i, a_j)\in R$. Ανακλαστική ⇔ μονάδες σε όλη τη διαγώνιο· συμμετρική ⇔ $M_R = M_R^T$· αντισυμμετρική ⇔ για $i\ne j$ όχι ταυτόχρονα $m_{ij} = m_{ji} = 1$· μεταβατική ⇔ το λογικό γινόμενο $M_R^{[2]} \le M_R$ (κάθε $1$ του $M_R^{[2]}$ είναι $1$ και στον $M_R$).</p></div>
<div class="tbox tip"><h4>Κλειστότητες</h4>
<ul><li><b>Ανακλαστική κλειστότητα:</b> $R\cup\Delta$, όπου $\Delta = \{(a, a): a\in A\}$.</li>
<li><b>Συμμετρική κλειστότητα:</b> $R\cup R^{-1}$, $R^{-1} = \{(b, a): (a, b)\in R\}$.</li>
<li><b>Μεταβατική κλειστότητα:</b> $R^* = R\cup R^2\cup\cdots\cup R^n$ (για $|A| = n$): περιέχει το $(a, b)$ ανν υπάρχει μονοπάτι από το $a$ στο $b$ στο γράφημα της $R$. Υπολογίζεται π.χ. με τον αλγόριθμο Warshall.</li></ul></div>
<div class="tbox warn"><h4>Προσοχή</h4>
<p>«Αντισυμμετρική» <b>δεν</b> είναι το αντίθετο του «συμμετρική»: η σχέση ισότητας είναι και τα δύο, ενώ η $\{(1, 2), (2, 1), (1, 3)\}$ δεν είναι κανένα. Η κενή σχέση είναι (κενά) συμμετρική, αντισυμμετρική και μεταβατική, αλλά όχι ανακλαστική σε μη κενό σύνολο.</p></div>`,
  widget: "dsbrel",
  gen: "dsbrelp",
  exercises: [
    { level: 1, type: "mc", q: R`Η σχέση $R = \{(1,1), (1,2), (2,1), (2,2), (3,3), (4,4)\}$ στο $\{1, 2, 3, 4\}$ είναι:`,
      options: ["ανακλαστική, συμμετρική και μεταβατική", "ανακλαστική και αντισυμμετρική", "συμμετρική αλλά όχι μεταβατική", "μεταβατική αλλά όχι ανακλαστική"], correct: 0,
      hint: R`Ελέγξτε τη διαγώνιο, τα ζεύγη $(a, b)/(b, a)$ και τις «αλυσίδες».`,
      sol: R`Περιέχει όλα τα $(a, a)$: ανακλαστική. Το μόνο μη διαγώνιο ζεύγος $(1, 2)$ έχει και το $(2, 1)$: συμμετρική (άρα όχι αντισυμμετρική). Αλυσίδες $(1,2),(2,1)\to(1,1)\in R$ κ.λπ.: μεταβατική. (Είναι σχέση ισοδυναμίας με κλάσεις $\{1,2\},\{3\},\{4\}$.)` },
    { level: 1, type: "fields", q: R`Πόσες σχέσεις υπάρχουν σε ένα σύνολο $3$ στοιχείων; Πόσες από αυτές είναι ανακλαστικές;`,
      fields: [{ label: "σχέσεις =", ans: 512 }, { label: "ανακλαστικές =", ans: 64 }], hint: R`$|A\times A| = 9$ και τα $3$ διαγώνια ζεύγη είναι υποχρεωτικά στις ανακλαστικές.`,
      sol: R`Κάθε υποσύνολο του $A\times A$: $2^9 = 512$. Ανακλαστικές: τα $3$ διαγώνια υποχρεωτικά, τα $6$ υπόλοιπα ελεύθερα: $2^6 = 64$.` },
    { level: 1, type: "fields", q: R`Έστω $R = \{(1,2), (2,3), (3,3)\}$ στο $\{1, 2, 3\}$. Πόσα ζεύγη έχει η ανακλαστική κλειστότητα και πόσα η συμμετρική κλειστότητα της $R$;`,
      fields: [{ label: "ανακλαστική =", ans: 5 }, { label: "συμμετρική =", ans: 5 }], hint: R`$R\cup\Delta$ και $R\cup R^{-1}$.`,
      sol: R`$R\cup\Delta = R\cup\{(1,1),(2,2)\}$: $5$ ζεύγη. $R\cup R^{-1} = R\cup\{(2,1),(3,2)\}$: $5$ ζεύγη.` },
    { level: 1, type: "mc", q: R`Μια σχέση μπορεί να είναι ταυτόχρονα συμμετρική και αντισυμμετρική.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Σκεφτείτε την ισότητα.`, sol: R`Σωστό: π.χ. η $\Delta = \{(a,a)\}$ ή η κενή σχέση. Είναι ακριβώς οι σχέσεις που περιέχουν μόνο διαγώνια ζεύγη.` },
    { level: 2, type: "fields", q: R`Σε σύνολο $3$ στοιχείων, πόσες σχέσεις είναι συμμετρικές και πόσες αντισυμμετρικές;`,
      fields: [{ label: "συμμετρικές =", ans: 64 }, { label: "αντισυμμετρικές =", ans: 216 }], hint: R`Τα $3$ μη διαγώνια ζεύγη $\{(a,b),(b,a)\}$ αποφασίζονται «από κοινού».`,
      sol: R`Συμμετρικές: $2^3$ (διαγώνιος) $\cdot 2^3$ (κάθε ζεύγος $\{(a,b),(b,a)\}$ μέσα ή έξω) $= 64$. Αντισυμμετρικές: $2^3\cdot 3^3 = 216$ (για κάθε ζεύγος: κανένα, μόνο $(a,b)$, μόνο $(b,a)$).` },
    { level: 2, type: "fields", q: R`Έστω $R = \{(1,1), (1,2), (2,1), (2,2), (3,4), (4,1)\}$ στο $\{1, 2, 3, 4\}$. Πόσα ζεύγη έχει η μεταβατική κλειστότητα $R^*$;`,
      fields: [{ label: "|R*| =", ans: 9 }], hint: R`Το $(a,b)\in R^*$ ανν υπάρχει μονοπάτι $a\to\cdots\to b$.`,
      sol: R`Από το $1$ και το $2$ φτάνουμε στα $1, 2$. Από το $4$: $4\to 1\to 2$, άρα $(4,1),(4,2)$. Από το $3$: $3\to 4\to 1\to 2$, άρα $(3,4),(3,1),(3,2)$. Σύνολο $4 + 2 + 3 = 9$ ζεύγη.` },
    { level: 2, type: "mc", q: R`Η σχέση $a\,R\,b \iff ab \ge 0$ στο $\mathbb Z$ είναι:`,
      options: ["ανακλαστική και συμμετρική, αλλά όχι μεταβατική", "σχέση ισοδυναμίας", "αντισυμμετρική και μεταβατική", "συμμετρική, αλλά όχι ανακλαστική"], correct: 0,
      hint: R`Δοκιμάστε $a = -1$, $b = 0$, $c = 1$.`,
      sol: R`$a^2 \ge 0$: ανακλαστική· $ab = ba$: συμμετρική. Όμως $(-1)\cdot 0 \ge 0$ και $0\cdot 1 \ge 0$, ενώ $(-1)\cdot 1 < 0$: όχι μεταβατική, άρα ούτε σχέση ισοδυναμίας.` },
    { level: 3, type: "fields", q: R`Πόσες σχέσεις σε σύνολο $4$ στοιχείων είναι <b>ταυτόχρονα</b> ανακλαστικές και συμμετρικές;`,
      fields: [{ label: "πλήθος =", ans: 64 }], hint: R`Η διαγώνιος είναι υποχρεωτική· διαλέγουμε ελεύθερα μόνο τα $\binom42$ μη διατεταγμένα ζεύγη.`,
      sol: R`Η διαγώνιος είναι καθορισμένη· για καθένα από τα $\binom42 = 6$ ζεύγη $\{(a,b),(b,a)\}$ αποφασίζουμε μέσα/έξω: $2^6 = 64$.` }
  ]
},
/* ───────────────────────────── 6.2 ───────────────────────────── */
{
  id: "6.2", unit: 6, title: "Σχέσεις ισοδυναμίας – Κλάσεις – Διαμερίσεις",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 6 · Βλ. και Rosen, κεφ. «Relations» (§ Equivalence Relations)",
  theory: R`
<div class="tbox"><h4>Σχέση ισοδυναμίας</h4>
<p>Μια σχέση στο $A$ είναι <b>σχέση ισοδυναμίας</b> αν είναι ανακλαστική, συμμετρική και μεταβατική. Η <b>κλάση ισοδυναμίας</b> του $a$ είναι $[a]_R = \{x\in A: x\,R\,a\}$· κάθε στοιχείο της λέγεται <b>αντιπρόσωπος</b>.</p></div>
<div class="tbox"><h4>Θεώρημα (κλάσεις και διαμερίσεις)</h4>
<p>Αν $R$ σχέση ισοδυναμίας στο $A$, για κάθε $a, b\in A$ τα εξής είναι ισοδύναμα: (i) $a\,R\,b$, (ii) $[a] = [b]$, (iii) $[a]\cap[b] \ne \varnothing$. Επομένως οι διαφορετικές κλάσεις είναι ξένες ανά δύο και η ένωσή τους είναι το $A$: σχηματίζουν μια <b>διαμέριση</b> του $A$. Αντίστροφα, κάθε διαμέριση $\{A_i\}$ του $A$ ορίζει τη σχέση ισοδυναμίας «$a\,R\,b$ ανν $a, b$ στο ίδιο $A_i$».</p></div>
<div class="tbox tip"><h4>Ισοτιμία modulo m</h4>
<p>Για $m \ge 2$: $a \equiv b \pmod m$ ανν $m \mid a - b$. Είναι σχέση ισοδυναμίας στο $\mathbb Z$ με $m$ κλάσεις, τις <b>κλάσεις υπολοίπων</b> $[0]_m, [1]_m, \dots, [m-1]_m$, π.χ. $[3]_5 = \{\dots, -7, -2, 3, 8, 13, \dots\}$.</p>
<p>Το πλήθος των σχέσεων ισοδυναμίας σε σύνολο $n$ στοιχείων ισούται με το πλήθος των διαμερίσεών του (αριθμός Bell): $B_1 = 1$, $B_2 = 2$, $B_3 = 5$, $B_4 = 15$, $B_5 = 52$.</p></div>
<div class="tbox warn"><h4>Προσοχή</h4>
<p>Για να δείξουμε ότι μια σχέση <b>δεν</b> είναι σχέση ισοδυναμίας αρκεί ένα αντιπαράδειγμα σε μία ιδιότητα — συχνότερα στη μεταβατικότητα (π.χ. $|a - b|\le 1$).</p></div>`,
  widget: "dsbmod",
  gen: "dsbeq",
  exercises: [
    { level: 1, type: "fields", q: R`Στο $A = \{1, 2, \dots, 12\}$ θεωρούμε τη σχέση $a\equiv b \pmod 4$. Πόσες κλάσεις ισοδυναμίας υπάρχουν και πόσα στοιχεία έχει η $[1]$;`,
      fields: [{ label: "κλάσεις =", ans: 4 }, { label: "|[1]| =", ans: 3 }], hint: R`Κλάσεις υπολοίπων $0, 1, 2, 3$.`,
      sol: R`Τέσσερις κλάσεις (υπόλοιπα $0,1,2,3$) και $[1] = \{1, 5, 9\}$, με $3$ στοιχεία.` },
    { level: 1, type: "mc", q: R`Ποιος ακέραιος ανήκει στην κλάση $[3]_5$;`, options: ["$-2$", "$-3$", "$15$", "$2$"], correct: 0,
      hint: R`$x \in [3]_5 \iff 5 \mid x - 3$.`, sol: R`$-2 - 3 = -5$, που διαιρείται με $5$: το $-2\in[3]_5$. Για τα άλλα: $-6$, $12$, $-1$ δεν διαιρούνται με $5$.` },
    { level: 1, type: "fields", q: R`Πόσες σχέσεις ισοδυναμίας υπάρχουν στο $\{1, 2, 3\}$ και πόσες στο $\{1, 2, 3, 4\}$;`,
      fields: [{ label: "3 στοιχεία =", ans: 5 }, { label: "4 στοιχεία =", ans: 15 }], hint: R`Όσες και οι διαμερίσεις του συνόλου.`,
      sol: R`Διαμερίσεις του $\{1,2,3\}$: $\{123\}$, $\{1|23\}$, $\{2|13\}$, $\{3|12\}$, $\{1|2|3\}$: $5$. Για $4$ στοιχεία: $B_4 = 15$ ($1$ με ένα μέρος, $7$ με δύο, $6$ με τρία, $1$ με τέσσερα).` },
    { level: 1, type: "mc", q: R`Δύο κλάσεις ισοδυναμίας μιας σχέσης ισοδυναμίας είναι είτε ίσες είτε ξένες.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Θεώρημα κλάσεων.`, sol: R`Σωστό: αν $c\in[a]\cap[b]$ τότε $a\,R\,c$ και $c\,R\,b$, άρα $a\,R\,b$ και $[a] = [b]$.` },
    { level: 2, type: "fields", q: R`Η διαμέριση $\{\{1, 2\}, \{3\}, \{4, 5, 6\}\}$ του $\{1, \dots, 6\}$ ορίζει μια σχέση ισοδυναμίας $R$. Πόσα διατεταγμένα ζεύγη περιέχει η $R$;`,
      fields: [{ label: "|R| =", ans: 14 }], hint: R`Κάθε κλάση με $k$ στοιχεία δίνει $k^2$ ζεύγη.`, sol: R`$2^2 + 1^2 + 3^2 = 4 + 1 + 9 = 14$.` },
    { level: 2, type: "mc", q: R`Ποια από τις παρακάτω σχέσεις στο $\mathbb Z$ <b>δεν</b> είναι σχέση ισοδυναμίας;`,
      options: ["$a\\,R\\,b \\iff |a - b| \\le 1$", "$a\\,R\\,b \\iff a \\equiv b \\pmod 7$", "$a\\,R\\,b \\iff a^2 = b^2$", "$a\\,R\\,b \\iff a - b$ άρτιος"], correct: 0,
      hint: R`Ελέγξτε τη μεταβατικότητα.`, sol: R`Η $|a - b|\le 1$ δεν είναι μεταβατική: $0\,R\,1$, $1\,R\,2$ αλλά $|0 - 2| = 2$. Οι άλλες τρεις είναι σχέσεις ισοδυναμίας (η $a^2 = b^2$ έχει κλάσεις $\{a, -a\}$).` },
    { level: 2, type: "mc", q: R`Στο σύνολο $\mathbb Z\times(\mathbb Z\setminus\{0\})$ η σχέση $(a, b)\,R\,(c, d) \iff ad = bc$ είναι:`,
      options: ["σχέση ισοδυναμίας (οι κλάσεις αντιστοιχούν στους ρητούς $a/b$)", "ανακλαστική και συμμετρική, αλλά όχι μεταβατική", "αντισυμμετρική", "μόνο συμμετρική"], correct: 0,
      hint: R`Για τη μεταβατικότητα χρησιμοποιήστε ότι $d \ne 0$.`,
      sol: R`Ανακλαστική: $ab = ba$. Συμμετρική: προφανές. Μεταβατική: $ad = bc$ και $cf = de$ ⇒ $adf = bcf = bde$, και αφού $d \ne 0$, $af = be$. Η κλάση του $(a,b)$ «είναι» το κλάσμα $a/b$.` },
    { level: 3, type: "fields", q: R`Στο $\mathbb Z$ ορίζουμε $a\,R\,b \iff 4 \mid 3a + b$. Δείξτε ότι πρόκειται για τη σχέση ισοτιμίας modulo $4$ και βρείτε το πλήθος των κλάσεων και τον μικρότερο <b>θετικό</b> ακέραιο της κλάσης $[-3]$.`,
      fields: [{ label: "κλάσεις =", ans: 4 }, { label: "min θετικό του [−3] =", ans: 1 }], hint: R`$3a + b = 4a - (a - b)$.`,
      sol: R`$3a + b = 4a - (a - b)$, άρα $4 \mid 3a + b \iff 4 \mid a - b$: η $R$ είναι η ισοτιμία mod $4$, με $4$ κλάσεις. $[-3] = [1]$, οπότε ο μικρότερος θετικός είναι το $1$.` }
  ]
},
/* ───────────────────────────── 6.3 ───────────────────────────── */
{
  id: "6.3", unit: 6, title: "Σχέσεις μερικής διάταξης – Διαγράμματα Hasse",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 6 · Βλ. και Rosen, κεφ. «Relations» (§ Partial Orderings)",
  theory: R`
<div class="tbox"><h4>Μερική διάταξη</h4>
<p>Μια σχέση $\preceq$ στο $S$ που είναι <b>ανακλαστική, αντισυμμετρική και μεταβατική</b> λέγεται <b>μερική διάταξη</b>· το $(S, \preceq)$ λέγεται μερικώς διατεταγμένο σύνολο (poset). Τα $a, b$ είναι <b>συγκρίσιμα</b> αν $a\preceq b$ ή $b\preceq a$. Αν κάθε δύο στοιχεία είναι συγκρίσιμα, η διάταξη είναι <b>ολική</b> (γραμμική).</p>
<p>Παραδείγματα: $(\mathbb Z, \le)$ (ολική), $(\mathbb Z^+, \mid)$, $(\mathcal P(A), \subseteq)$ (μερικές). Η λεξικογραφική διάταξη στο $\mathbb Z\times\mathbb Z$: $(a_1, a_2)\prec(b_1, b_2)$ ανν $a_1 < b_1$ ή ($a_1 = b_1$ και $a_2 < b_2$).</p></div>
<div class="tbox"><h4>Διάγραμμα Hasse – ειδικά στοιχεία</h4>
<p>Στο <b>διάγραμμα Hasse</b> σχεδιάζουμε ακμή $a$ — $b$ (με το $b$ ψηλότερα) μόνο όταν το $b$ <b>καλύπτει</b> το $a$: $a\prec b$ και δεν υπάρχει $c$ με $a\prec c\prec b$. Οι βρόχοι και οι μεταβατικές ακμές παραλείπονται.</p>
<ul><li><b>Μεγιστικό</b> (maximal): δεν υπάρχει $b$ με $a\prec b$. <b>Ελαχιστικό</b> (minimal): δεν υπάρχει $b$ με $b\prec a$.</li>
<li><b>Μέγιστο</b> (greatest): $b\preceq a$ για κάθε $b$ — αν υπάρχει είναι μοναδικό· ανάλογα το <b>ελάχιστο</b>.</li>
<li><b>Ελάχιστο άνω φράγμα</b> (sup, lub) και <b>μέγιστο κάτω φράγμα</b> (inf, glb) δύο στοιχείων· στο $(\mathbb Z^+, \mid)$ είναι το ΕΚΠ και ο ΜΚΔ. Αν κάθε ζεύγος έχει sup και inf, το poset είναι <b>πλέγμα</b>.</li></ul></div>
<div class="tbox tip"><h4>Παράδειγμα</h4>
<p>Στο $(\{2, 3, 4, 6, 8, 12, 18\}, \mid)$: ελαχιστικά τα $2, 3$, μεγιστικά τα $8, 12, 18$· δεν υπάρχει ούτε μέγιστο ούτε ελάχιστο στοιχείο. Κάθε πεπερασμένο μη κενό poset έχει τουλάχιστον ένα ελαχιστικό και ένα μεγιστικό στοιχείο, και επιδέχεται <b>τοπολογική ταξινόμηση</b> (ολική διάταξη συμβατή με τη μερική).</p></div>
<div class="tbox warn"><h4>Προσοχή</h4>
<p>Μεγιστικό ≠ μέγιστο: ένα poset μπορεί να έχει πολλά μεγιστικά στοιχεία και κανένα μέγιστο. Η διαιρετότητα στο $\mathbb Z\setminus\{0\}$ (με αρνητικούς) <b>δεν</b> είναι μερική διάταξη, αφού $2\mid -2$ και $-2\mid 2$ με $2 \ne -2$.</p></div>`,
  widget: "dsbhasse",
  gen: "dsbpo",
  exercises: [
    { level: 1, type: "fields", q: R`Θεωρούμε το $(D_{36}, \mid)$, όπου $D_{36}$ το σύνολο των θετικών διαιρετών του $36$. Πόσα στοιχεία έχει και πόσες ακμές έχει το διάγραμμα Hasse;`,
      fields: [{ label: "στοιχεία =", ans: 9 }, { label: "ακμές Hasse =", ans: 12 }], hint: R`$36 = 2^2 3^2$· ακμή όταν ο λόγος είναι πρώτος.`,
      sol: R`Διαιρέτες $2^i3^j$, $0\le i, j\le 2$: $9$. Το διάγραμμα είναι πλέγμα $3\times 3$: $2\cdot 3 + 3\cdot 2 = 12$ ακμές (πολλαπλασιασμός με $2$ ή με $3$).` },
    { level: 1, type: "fields", q: R`Στο $(\{2, 3, 4, 6, 8, 12, 18\}, \mid)$, πόσα ελαχιστικά και πόσα μεγιστικά στοιχεία υπάρχουν;`,
      fields: [{ label: "ελαχιστικά =", ans: 2 }, { label: "μεγιστικά =", ans: 3 }], hint: R`Ελαχιστικό: κανένα άλλο στοιχείο του συνόλου δεν το διαιρεί.`,
      sol: R`Ελαχιστικά: $2, 3$. Μεγιστικά (δεν διαιρούν κανένα άλλο στοιχείο): $8, 12, 18$.` },
    { level: 1, type: "fields", q: R`Στο $(D_{36}, \mid)$ να βρείτε το ελάχιστο άνω φράγμα και το μέγιστο κάτω φράγμα των $12$ και $18$.`,
      fields: [{ label: "sup =", ans: 36 }, { label: "inf =", ans: 6 }], hint: R`ΕΚΠ και ΜΚΔ.`, sol: R`$\sup\{12, 18\} = \operatorname{ΕΚΠ}(12, 18) = 36$ και $\inf = \operatorname{ΜΚΔ} = 6$.` },
    { level: 1, type: "mc", q: R`Κάθε πεπερασμένο, μη κενό μερικώς διατεταγμένο σύνολο έχει τουλάχιστον ένα ελαχιστικό στοιχείο.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Ξεκινήστε από ένα στοιχείο και «κατεβαίνετε».`,
      sol: R`Σωστό: αν το $a_1$ δεν είναι ελαχιστικό, υπάρχει $a_2\prec a_1$, κ.ο.κ. Λόγω αντισυμμετρικότητας και μεταβατικότητας τα $a_i$ είναι διαφορετικά, και αφού το σύνολο είναι πεπερασμένο η διαδικασία σταματά σε ελαχιστικό στοιχείο.` },
    { level: 1, type: "mc", q: R`Στη λεξικογραφική διάταξη του $\mathbb Z\times\mathbb Z$, ποια σχέση ισχύει;`,
      options: ["$(2, 5)\\prec(3, 1)$", "$(3, 1)\\prec(2, 5)$", "$(2, 5)$ και $(3, 1)$ είναι μη συγκρίσιμα", "$(2, 5)\\prec(2, 4)$"], correct: 0,
      hint: R`Συγκρίνουμε πρώτα την 1η συντεταγμένη.`, sol: R`$2 < 3$, άρα $(2,5)\prec(3,1)$ ανεξάρτητα από τις 2ες συντεταγμένες. Η λεξικογραφική διάταξη είναι ολική και $(2,4)\prec(2,5)$.` },
    { level: 2, type: "mc", q: R`Γιατί η σχέση διαιρετότητας $a \mid b$ στο $\mathbb Z\setminus\{0\}$ (όλοι οι μη μηδενικοί ακέραιοι) <b>δεν</b> είναι μερική διάταξη;`,
      options: ["Δεν είναι αντισυμμετρική", "Δεν είναι ανακλαστική", "Δεν είναι μεταβατική"], correct: 0,
      hint: R`Δοκιμάστε $2$ και $-2$.`, sol: R`$2\mid -2$ και $-2\mid 2$, αλλά $2\ne -2$: δεν είναι αντισυμμετρική. Στο $\mathbb Z\setminus\{0\}$ είναι ανακλαστική ($a \mid a$) και μεταβατική. Στο $\mathbb Z^+$ είναι μερική διάταξη.` },
    { level: 2, type: "fields", q: R`Πόσα στοιχεία έχει το $(\mathcal P(\{a, b, c\}), \subseteq)$ και πόσες ακμές το διάγραμμα Hasse του;`,
      fields: [{ label: "στοιχεία =", ans: 8 }, { label: "ακμές =", ans: 12 }], hint: R`Ακμή $X$ — $Y$ όταν το $Y$ έχει ακριβώς ένα στοιχείο παραπάνω.`,
      sol: R`$2^3 = 8$ υποσύνολα. Κάθε υποσύνολο με $k$ στοιχεία καλύπτεται από $3 - k$ υπερσύνολα: $1\cdot 3 + 3\cdot 2 + 3\cdot 1 = 12$ ακμές (ο «κύβος»).` },
    { level: 3, type: "fields", q: R`Στο $(\{a, b, c, d\}, \preceq)$ με $a\prec b$, $a\prec c$, $b\prec d$, $c\prec d$ (και τις συνέπειές τους), πόσες τοπολογικές ταξινομήσεις (ολικές διατάξεις συμβατές με τη $\preceq$) υπάρχουν; Ποιο είναι το μέγιστο στοιχείο; (Δώστε $1$ για $a$, $2$ για $b$, $3$ για $c$, $4$ για $d$.)`,
      fields: [{ label: "ταξινομήσεις =", ans: 2 }, { label: "μέγιστο =", ans: 4 }], hint: R`Το $a$ πρώτο, το $d$ τελευταίο· τα $b, c$ είναι μη συγκρίσιμα.`,
      sol: R`Υποχρεωτικά $a$ πρώτο και $d$ τελευταίο· στη μέση $b, c$ ή $c, b$: $2$ ταξινομήσεις. Μέγιστο είναι το $d$ (κάθε στοιχείο $\preceq d$).` }
  ]
},
/* ───────────────────────────── 7.1 ───────────────────────────── */
{
  id: "7.1", unit: 7, title: "Γραφήματα – Ορολογία – Βαθμοί – Ειδικά γραφήματα",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 7 · Βλ. και Rosen, κεφ. «Graphs» (§ Graphs and Graph Models, Graph Terminology and Special Types of Graphs)",
  theory: R`
<div class="tbox"><h4>Βασικές έννοιες</h4>
<p>Ένα <b>(απλό) γράφημα</b> $G = (V, E)$ αποτελείται από ένα μη κενό σύνολο <b>κορυφών</b> $V$ και ένα σύνολο <b>ακμών</b> $E$, καθεμία από τις οποίες είναι ένα μη διατεταγμένο ζεύγος διαφορετικών κορυφών· δεν επιτρέπονται βρόχοι και πολλαπλές ακμές (αλλιώς μιλάμε για <b>πολυγράφημα</b>). Σε <b>κατευθυνόμενο</b> γράφημα οι ακμές είναι διατεταγμένα ζεύγη.</p>
<p><b>Βαθμός</b> $\deg(v)$: το πλήθος των ακμών που προσπίπτουν στην $v$ (ο βρόχος μετρά $2$). <b>Γειτονικές</b> κορυφές: ενώνονται με ακμή.</p></div>
<div class="tbox"><h4>Θεώρημα χειραψίας</h4>
<p>Σε κάθε μη κατευθυνόμενο γράφημα $\displaystyle\sum_{v\in V}\deg(v) = 2|E|$. <b>Πόρισμα:</b> το πλήθος των κορυφών περιττού βαθμού είναι άρτιο. Σε κατευθυνόμενο: $\sum\deg^-(v) = \sum\deg^+(v) = |E|$.</p></div>
<div class="tbox tip"><h4>Ειδικά γραφήματα</h4>
<table class="tbl"><tr><th>γράφημα</th><th>κορυφές</th><th>ακμές</th></tr>
<tr><td>πλήρες $K_n$</td><td>$n$</td><td>$\binom n2 = \frac{n(n-1)}2$</td></tr>
<tr><td>κύκλος $C_n$ ($n\ge 3$)</td><td>$n$</td><td>$n$</td></tr>
<tr><td>τροχός $W_n$</td><td>$n + 1$</td><td>$2n$</td></tr>
<tr><td>υπερκύβος $Q_n$</td><td>$2^n$</td><td>$n2^{n-1}$</td></tr>
<tr><td>πλήρες διμερές $K_{m,n}$</td><td>$m + n$</td><td>$mn$</td></tr></table>
<p>Ένα γράφημα είναι <b>διμερές</b> αν οι κορυφές του χωρίζονται σε δύο σύνολα ώστε κάθε ακμή να ενώνει κορυφές διαφορετικών συνόλων· ισοδύναμα, δεν έχει απλό κύκλωμα περιττού μήκους. Γράφημα <b>$k$-κανονικό</b>: όλες οι κορυφές βαθμού $k$ (τότε $|E| = kn/2$).</p></div>
<div class="tbox warn"><h4>Προσοχή</h4>
<p>Μια ακολουθία βαθμών με άρτιο άθροισμα δεν είναι απαραίτητα ακολουθία απλού γραφήματος: π.χ. $(3, 3, 3, 1)$ — σε $4$ κορυφές οι τρεις κορυφές βαθμού $3$ πρέπει να ενώνονται με όλες, οπότε η τέταρτη θα είχε βαθμό $3$.</p></div>`,
  widget: "dsbgraph",
  gen: "dsbgr",
  exercises: [
    { level: 1, type: "fields", q: R`Πόσες ακμές έχουν τα γραφήματα $K_7$ και $K_{3,4}$;`, fields: [{ label: "K₇ =", ans: 21 }, { label: "K₃,₄ =", ans: 12 }],
      hint: R`$\binom n2$ και $mn$.`, sol: R`$K_7$: $\binom72 = 21$. $K_{3,4}$: $3\cdot 4 = 12$.` },
    { level: 1, type: "fields", q: R`Ένα γράφημα έχει $5$ κορυφές με βαθμούς $3, 3, 2, 2, 2$. Πόσες ακμές έχει;`, fields: [{ label: "|E| =", ans: 6 }],
      hint: R`Θεώρημα χειραψίας.`, sol: R`$\sum\deg = 12 = 2|E|$, άρα $|E| = 6$.` },
    { level: 1, type: "fields", q: R`Πόσες κορυφές και πόσες ακμές έχουν ο υπερκύβος $Q_3$ και ο τροχός $W_5$; (Σειρά: κορυφές $Q_3$, ακμές $Q_3$, κορυφές $W_5$, ακμές $W_5$.)`,
      fields: [{ label: "|V(Q₃)| =", ans: 8 }, { label: "|E(Q₃)| =", ans: 12 }, { label: "|V(W₅)| =", ans: 6 }, { label: "|E(W₅)| =", ans: 10 }],
      hint: R`$Q_n$: $2^n$ κορυφές, $n2^{n-1}$ ακμές. $W_n$: $C_n$ + κεντρική κορυφή.`, sol: R`$Q_3$: $8$ κορυφές, $3\cdot 4 = 12$ ακμές. $W_5$: $6$ κορυφές, $5 + 5 = 10$ ακμές.` },
    { level: 1, type: "mc", q: R`Ο κύκλος $C_5$ είναι διμερές γράφημα.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Ένα γράφημα είναι διμερές ανν δεν έχει απλό κύκλωμα περιττού μήκους.`, sol: R`Λάθος: ο $C_5$ είναι κύκλος περιττού μήκους, άρα δεν χρωματίζεται με $2$ χρώματα. Ο $C_n$ είναι διμερής ανν $n$ άρτιος.` },
    { level: 1, type: "fields", q: R`Ένα $4$-κανονικό γράφημα έχει $10$ κορυφές. Πόσες ακμές έχει;`, fields: [{ label: "|E| =", ans: 20 }],
      hint: R`$|E| = kn/2$.`, sol: R`$2|E| = 10\cdot 4 = 40$, άρα $|E| = 20$.` },
    { level: 2, type: "mc", q: R`Ποια ακολουθία βαθμών αντιστοιχεί σε κάποιο απλό γράφημα $4$ κορυφών;`,
      options: ["$(2, 2, 2, 2)$", "$(3, 3, 3, 1)$", "$(3, 2, 2, 2)$", "$(4, 1, 1, 1)$"], correct: 0,
      hint: R`Άρτιο άθροισμα, μέγιστος βαθμός $\le 3$, και έλεγχος υλοποίησης.`,
      sol: R`Το $(2,2,2,2)$ είναι ο κύκλος $C_4$. Το $(3,2,2,2)$ έχει περιττό άθροισμα, το $(4,1,1,1)$ έχει βαθμό $4 > n - 1$, και το $(3,3,3,1)$ δεν υλοποιείται (βλ. θεωρία).` },
    { level: 2, type: "fields", q: R`Πόσες κορυφές έχει το πλήρες γράφημα $K_n$ αν έχει $45$ ακμές;`, fields: [{ label: "n =", ans: 10 }],
      hint: R`$n(n-1)/2 = 45$.`, sol: R`$n(n-1) = 90 = 10\cdot 9$, άρα $n = 10$.` },
    { level: 2, type: "fields", q: R`Σε ένα κατευθυνόμενο γράφημα $5$ κορυφών οι έξω-βαθμοί είναι $2, 1, 3, 0, 2$. Πόσες ακμές έχει και πόσο είναι το άθροισμα των έσω-βαθμών;`,
      fields: [{ label: "|E| =", ans: 8 }, { label: "Σ έσω-βαθμών =", ans: 8 }], hint: R`$\sum\deg^+ = \sum\deg^- = |E|$.`, sol: R`$|E| = 2 + 1 + 3 + 0 + 2 = 8$ και $\sum\deg^- = |E| = 8$.` },
    { level: 3, type: "fields", q: R`Ένα απλό γράφημα έχει $15$ ακμές, $3$ κορυφές βαθμού $4$ και όλες τις υπόλοιπες βαθμού $3$. Πόσες κορυφές έχει;`,
      fields: [{ label: "|V| =", ans: 9 }], hint: R`$2\cdot 15 = 3\cdot 4 + 3(n - 3)$.`, sol: R`$30 = 12 + 3(n - 3) \Rightarrow n - 3 = 6 \Rightarrow n = 9$.` }
  ]
},
/* ───────────────────────────── 7.2 ───────────────────────────── */
{
  id: "7.2", unit: 7, title: "Αναπαράσταση γραφημάτων – Ισομορφισμός – Συνεκτικότητα",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 7 · Βλ. και Rosen, κεφ. «Graphs» (§ Representing Graphs and Graph Isomorphism, Connectivity)",
  theory: R`
<div class="tbox"><h4>Αναπαράσταση</h4>
<ul><li><b>Λίστα γειτνίασης:</b> για κάθε κορυφή, οι γειτονικές της.</li>
<li><b>Πίνακας γειτνίασης</b> $A = [a_{ij}]$: $a_{ij} = 1$ αν $\{v_i, v_j\}\in E$ (σε πολυγράφημα: το πλήθος των ακμών). Σε μη κατευθυνόμενο γράφημα ο $A$ είναι <b>συμμετρικός</b>, το άθροισμα της γραμμής $i$ είναι $\deg(v_i)$ και το άθροισμα όλων των στοιχείων είναι $2|E|$.</li>
<li>Το στοιχείο $(i, j)$ του $A^k$ ισούται με το πλήθος των <b>διαδρομών</b> μήκους $k$ από το $v_i$ στο $v_j$.</li></ul></div>
<div class="tbox"><h4>Ισομορφισμός</h4>
<p>Τα $G_1 = (V_1, E_1)$, $G_2 = (V_2, E_2)$ είναι <b>ισόμορφα</b> αν υπάρχει αμφιμονοσήμαντη $f: V_1\to V_2$ με $\{a, b\}\in E_1 \iff \{f(a), f(b)\}\in E_2$. <b>Αναλλοίωτες</b> (πρέπει να συμπίπτουν): πλήθος κορυφών και ακμών, ακολουθία βαθμών, πλήθος κύκλων κάθε μήκους, συνεκτικότητα, διμερότητα. Αν διαφέρει μία αναλλοίωτη, τα γραφήματα <b>δεν</b> είναι ισόμορφα· η ισότητα όλων των γνωστών αναλλοίωτων δεν αρκεί για απόδειξη.</p></div>
<div class="tbox tip"><h4>Συνεκτικότητα</h4>
<p>Ένα γράφημα είναι <b>συνεκτικό</b> αν υπάρχει μονοπάτι ανάμεσα σε κάθε δύο κορυφές. Οι μέγιστοι συνεκτικοί υπογράφοι είναι οι <b>συνεκτικές συνιστώσες</b>. Ένα απλό γράφημα με $n$ κορυφές και $k$ συνιστώσες έχει τουλάχιστον $n - k$ ακμές. <b>Κορυφή τομής</b> (ακμή τομής/γέφυρα): η αφαίρεσή της αυξάνει το πλήθος των συνιστωσών.</p></div>
<div class="tbox warn"><h4>Προσοχή</h4>
<p>Διαδρομή (walk) επιτρέπει επανάληψη κορυφών/ακμών· στο <b>απλό μονοπάτι</b> δεν επαναλαμβάνεται ακμή. Ο $A^k$ μετρά <b>διαδρομές</b>, όχι απλά μονοπάτια.</p></div>`,
  widget: "dsbadj",
  gen: "dsbgr2",
  exercises: [
    { level: 1, type: "fields", q: R`Ο πίνακας γειτνίασης ενός γραφήματος είναι $A = \begin{pmatrix} 0&1&1&0\\1&0&1&1\\1&1&0&1\\0&1&1&0\end{pmatrix}$. Πόσες ακμές έχει και ποιος είναι ο βαθμός της $v_3$;`,
      fields: [{ label: "|E| =", ans: 5 }, { label: "deg(v₃) =", ans: 3 }], hint: R`Άθροισμα στοιχείων $= 2|E|$· άθροισμα γραμμής $= $ βαθμός.`,
      sol: R`Αθροίσματα γραμμών $2, 3, 3, 2$, σύνολο $10 = 2|E|$, άρα $|E| = 5$. $\deg(v_3) = 1 + 1 + 0 + 1 = 3$.` },
    { level: 1, type: "mc", q: R`Ποιο από τα παρακάτω αρκεί για να αποδείξουμε ότι δύο γραφήματα <b>δεν</b> είναι ισόμορφα;`,
      options: ["Έχουν διαφορετικές ακολουθίες βαθμών", "Σχεδιάζονται διαφορετικά στο επίπεδο", "Οι κορυφές τους έχουν διαφορετικά ονόματα", "Έχουν τον ίδιο αριθμό ακμών"], correct: 0,
      hint: R`Αναλλοίωτες ισομορφισμού.`, sol: R`Η ακολουθία βαθμών είναι αναλλοίωτη· αν διαφέρει, δεν υπάρχει ισομορφισμός. Η σχεδίαση και τα ονόματα δεν παίζουν ρόλο, και ο ίδιος αριθμός ακμών δεν αποδεικνύει τίποτα.` },
    { level: 1, type: "mc", q: R`Δύο γραφήματα με την ίδια ακολουθία βαθμών είναι πάντα ισόμορφα.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1,
      hint: R`Συγκρίνετε τον $C_6$ με δύο ξένα τρίγωνα.`, sol: R`Λάθος: ο $C_6$ και η ένωση δύο ξένων τριγώνων έχουν και οι δύο ακολουθία $(2,2,2,2,2,2)$, αλλά ο πρώτος είναι συνεκτικός και ο δεύτερος όχι.` },
    { level: 1, type: "fields", q: R`Στο γράφημα με $V = \{1, \dots, 8\}$ και $E = \{\{1,2\}, \{2,3\}, \{3,1\}, \{4,5\}, \{6,7\}\}$, πόσες συνεκτικές συνιστώσες υπάρχουν;`,
      fields: [{ label: "συνιστώσες =", ans: 4 }], hint: R`Μην ξεχάσετε τις απομονωμένες κορυφές.`, sol: R`$\{1,2,3\}$, $\{4,5\}$, $\{6,7\}$ και η απομονωμένη $\{8\}$: $4$ συνιστώσες.` },
    { level: 2, type: "fields", q: R`Για το γράφημα με πίνακα γειτνίασης $A = \begin{pmatrix} 0&1&1&0\\1&0&1&1\\1&1&0&1\\0&1&1&0\end{pmatrix}$, πόσες διαδρομές μήκους $2$ υπάρχουν από το $v_1$ στο $v_4$ και πόσες κλειστές διαδρομές μήκους $2$ από το $v_1$ στο $v_1$;`,
      fields: [{ label: "v₁→v₄ =", ans: 2 }, { label: "v₁→v₁ =", ans: 2 }], hint: R`$(A^2)_{ij} = \sum_k a_{ik}a_{kj}$.`,
      sol: R`$(A^2)_{14} = a_{12}a_{24} + a_{13}a_{34} = 1 + 1 = 2$ (μέσω $v_2$ ή $v_3$). $(A^2)_{11} = \deg(v_1) = 2$.` },
    { level: 2, type: "fields", q: R`Ποιο είναι το ελάχιστο πλήθος ακμών ενός απλού γραφήματος με $10$ κορυφές και $3$ συνεκτικές συνιστώσες; Ποιο είναι το μέγιστο πλήθος ακμών ενός <b>μη συνεκτικού</b> απλού γραφήματος με $8$ κορυφές;`,
      fields: [{ label: "ελάχιστο =", ans: 7 }, { label: "μέγιστο =", ans: 21 }], hint: R`$n - k$· για το δεύτερο: $K_7$ συν μία απομονωμένη κορυφή.`,
      sol: R`Τουλάχιστον $n - k = 10 - 3 = 7$ ακμές (ένα δάσος). Μη συνεκτικό με τις περισσότερες ακμές: $K_7$ και μία απομονωμένη κορυφή, $\binom72 = 21$.` },
    { level: 2, type: "mc", q: R`Ο πίνακας γειτνίασης ενός μη κατευθυνόμενου απλού γραφήματος είναι πάντα:`,
      options: ["συμμετρικός με μηδενική διαγώνιο", "αντισυμμετρικός", "αντιστρέψιμος", "άνω τριγωνικός"], correct: 0,
      hint: R`$\{v_i, v_j\} = \{v_j, v_i\}$ και δεν υπάρχουν βρόχοι.`, sol: R`$a_{ij} = a_{ji}$ (μη κατευθυνόμενο) και $a_{ii} = 0$ (χωρίς βρόχους). Δεν είναι κατ' ανάγκη αντιστρέψιμος (π.χ. γράφημα χωρίς ακμές).` },
    { level: 3, type: "fields", q: R`Πόσα μη ισόμορφα απλά γραφήματα με $3$ κορυφές υπάρχουν; Και με $4$ κορυφές και ακριβώς $2$ ακμές;`,
      fields: [{ label: "3 κορυφές =", ans: 4 }, { label: "4 κορυφές, 2 ακμές =", ans: 2 }], hint: R`Ταξινομήστε κατά πλήθος ακμών.`,
      sol: R`Με $3$ κορυφές: $0, 1, 2, 3$ ακμές, ένα γράφημα για κάθε πλήθος (όλες οι επιλογές της ίδιας πληθικότητας είναι ισόμορφες): $4$. Με $4$ κορυφές και $2$ ακμές: οι ακμές είτε έχουν κοινή κορυφή (μονοπάτι μήκους $2$) είτε όχι (δύο ξένες ακμές): $2$.` }
  ]
},
/* ───────────────────────────── 7.3 ───────────────────────────── */
{
  id: "7.3", unit: 7, title: "Μονοπάτια και κυκλώματα Euler και Hamilton",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 7 · Βλ. και Rosen, κεφ. «Graphs» (§ Euler and Hamilton Paths)",
  theory: R`
<div class="tbox"><h4>Euler</h4>
<p>Ένα <b>κύκλωμα Euler</b> διασχίζει <b>κάθε ακμή</b> ακριβώς μία φορά και επιστρέφει στην αρχή· ένα <b>μονοπάτι Euler</b> διασχίζει κάθε ακμή ακριβώς μία φορά.</p>
<p><b>Θεώρημα.</b> Ένα συνεκτικό πολυγράφημα με τουλάχιστον δύο κορυφές έχει κύκλωμα Euler <b>αν και μόνο αν</b> κάθε κορυφή έχει άρτιο βαθμό. Έχει μονοπάτι Euler (που δεν είναι κύκλωμα) αν και μόνο αν έχει <b>ακριβώς δύο</b> κορυφές περιττού βαθμού· το μονοπάτι αρχίζει από τη μία και τελειώνει στην άλλη.</p>
<p>Οι <b>γέφυρες του Königsberg</b> δίνουν πολυγράφημα με βαθμούς $5, 3, 3, 3$: τέσσερις περιττές κορυφές, άρα ούτε κύκλωμα ούτε μονοπάτι Euler.</p></div>
<div class="tbox"><h4>Hamilton</h4>
<p>Ένα <b>κύκλωμα Hamilton</b> περνά από <b>κάθε κορυφή</b> ακριβώς μία φορά και επιστρέφει στην αρχή. Δεν υπάρχει γνωστό απλό κριτήριο (το πρόβλημα είναι NP-πλήρες), υπάρχουν όμως ικανές συνθήκες για απλό γράφημα με $n \ge 3$ κορυφές:</p>
<ul><li><b>Dirac:</b> αν $\deg(v)\ge n/2$ για κάθε $v$, υπάρχει κύκλωμα Hamilton.</li>
<li><b>Ore:</b> αν $\deg(u) + \deg(v)\ge n$ για κάθε δύο μη γειτονικές κορυφές, υπάρχει κύκλωμα Hamilton.</li></ul></div>
<div class="tbox tip"><h4>Ειδικά γραφήματα</h4>
<p>Το $K_n$ ($n \ge 2$) έχει κύκλωμα Euler ανν $n$ περιττός, και κύκλωμα Hamilton για $n\ge 3$ — στην πραγματικότητα $(n-1)!/2$ διαφορετικά. Το $K_{m,n}$ έχει κύκλωμα Euler ανν $m, n$ άρτιοι, και κύκλωμα Hamilton ανν $m = n \ge 2$. Ο $Q_n$ ($n \ge 1$) έχει κύκλωμα Euler ανν $n$ άρτιος.</p></div>
<div class="tbox warn"><h4>Προσοχή</h4>
<p>Euler: <b>ακμές</b>. Hamilton: <b>κορυφές</b>. Οι συνθήκες Dirac/Ore είναι <b>ικανές, όχι αναγκαίες</b>: ο $C_n$ έχει κύκλωμα Hamilton ενώ οι βαθμοί του είναι $2$.</p></div>`,
  widget: "dsbeuler",
  gen: "dsbeul",
  exercises: [
    { level: 1, type: "mc", q: R`Ένα συνεκτικό γράφημα έχει βαθμούς $2, 4, 3, 3, 2, 4$. Τι ισχύει;`,
      options: ["Έχει μονοπάτι Euler αλλά όχι κύκλωμα Euler", "Έχει κύκλωμα Euler", "Δεν έχει ούτε μονοπάτι ούτε κύκλωμα Euler", "Έχει κύκλωμα Euler που αρχίζει από κορυφή βαθμού 3"], correct: 0,
      hint: R`Μετρήστε τις κορυφές περιττού βαθμού.`, sol: R`Ακριβώς δύο κορυφές περιττού βαθμού ($3, 3$): μονοπάτι Euler από τη μία στην άλλη, αλλά όχι κύκλωμα.` },
    { level: 1, type: "mc", q: R`Για ποιο από τα παρακάτω γραφήματα υπάρχει κύκλωμα Euler;`, options: ["$K_{2,4}$", "$K_6$", "$K_{3,4}$", "$Q_3$"], correct: 0,
      hint: R`Όλοι οι βαθμοί άρτιοι.`, sol: R`$K_{2,4}$: βαθμοί $4$ και $2$, όλοι άρτιοι ✓. $K_6$: βαθμοί $5$. $K_{3,4}$: βαθμοί $4$ και $3$. $Q_3$: βαθμοί $3$.` },
    { level: 1, type: "mc", q: R`Το πρόβλημα των γεφυρών του Königsberg (βαθμοί $5, 3, 3, 3$) έχει λύση, δηλαδή υπάρχει μονοπάτι Euler.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 1, hint: R`Πόσες κορυφές περιττού βαθμού;`, sol: R`Λάθος: τέσσερις κορυφές περιττού βαθμού, ενώ για μονοπάτι Euler επιτρέπονται $0$ ή $2$.` },
    { level: 1, type: "mc", q: R`Ένα απλό γράφημα με $8$ κορυφές στο οποίο κάθε κορυφή έχει βαθμό τουλάχιστον $4$ έχει κύκλωμα Hamilton.`,
      options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0, hint: R`Θεώρημα Dirac.`, sol: R`Σωστό: $\deg(v)\ge 4 = n/2$ για κάθε $v$, οπότε από το θεώρημα Dirac υπάρχει κύκλωμα Hamilton.` },
    { level: 2, type: "fields", q: R`Πόσα διαφορετικά κυκλώματα Hamilton έχει το $K_5$ (θεωρώντας ίδια τα κυκλώματα που διαφέρουν μόνο στην αρχική κορυφή ή στη φορά διαγραφής);`,
      fields: [{ label: "πλήθος =", ans: 12 }], hint: R`$(n - 1)!/2$.`, sol: R`Σταθεροποιούμε την αρχική κορυφή: $4!$ διατάξεις των υπολοίπων, και κάθε κύκλωμα μετριέται δύο φορές (δύο φορές διαγραφής): $24/2 = 12$.` },
    { level: 2, type: "fields", q: R`Πόσες ακμές έχει ένα κύκλωμα Euler του $Q_4$;`, fields: [{ label: "ακμές =", ans: 32 }],
      hint: R`Το κύκλωμα Euler διασχίζει κάθε ακμή ακριβώς μία φορά.`, sol: R`Ο $Q_4$ είναι $4$-κανονικός (άρτιοι βαθμοί, συνεκτικός), άρα έχει κύκλωμα Euler, με τόσες ακμές όσες ο $Q_4$: $4\cdot 2^3 = 32$.` },
    { level: 2, type: "mc", q: R`Για το πλήρες διμερές $K_{3,4}$ ισχύει:`,
      options: ["έχει μονοπάτι Hamilton αλλά όχι κύκλωμα Hamilton", "έχει κύκλωμα Hamilton", "δεν έχει ούτε μονοπάτι Hamilton", "έχει κύκλωμα Euler"], correct: 0,
      hint: R`Σε διμερές γράφημα οι κορυφές ενός κυκλώματος εναλλάσσονται ανάμεσα στα δύο μέρη.`,
      sol: R`Κύκλωμα Hamilton σε διμερές απαιτεί ίσα μέρη ($3 \ne 4$): όχι. Μονοπάτι που αρχίζει και τελειώνει στο μέρος των $4$ ($b_1a_1b_2a_2b_3a_3b_4$): ναι. Κύκλωμα Euler δεν υπάρχει (βαθμοί $3$).` },
    { level: 3, type: "fields", q: R`Ένα συνεκτικό πολυγράφημα έχει ακριβώς $6$ κορυφές περιττού βαθμού. Πόσες ακμές πρέπει να προσθέσουμε (τουλάχιστον) ώστε να αποκτήσει κύκλωμα Euler;`,
      fields: [{ label: "ελάχιστες ακμές =", ans: 3 }], hint: R`Κάθε νέα ακμή αλλάζει την ισοτιμία δύο κορυφών.`,
      sol: R`Κάθε ακμή αλλάζει την ισοτιμία του βαθμού το πολύ δύο κορυφών, οπότε χρειάζονται τουλάχιστον $6/2 = 3$ ακμές· και αρκούν, ενώνοντας τις περιττές κορυφές ανά δύο (σε πολυγράφημα επιτρέπονται και παράλληλες ακμές).` }
  ]
},
/* ───────────────────────────── 7.4 ───────────────────────────── */
{
  id: "7.4", unit: 7, title: "Δέντρα",
  book: "Αντίστοιχο κεφάλαιο: Κεφ. 7 · Βλ. και Rosen, κεφ. «Trees» (§ Introduction to Trees, Tree Traversal)",
  theory: R`
<div class="tbox"><h4>Ορισμός και χαρακτηρισμοί</h4>
<p><b>Δέντρο</b> είναι ένα συνεκτικό μη κατευθυνόμενο γράφημα χωρίς απλά κυκλώματα. <b>Δάσος</b>: γράφημα χωρίς απλά κυκλώματα (οι συνιστώσες του είναι δέντρα). Για ένα απλό γράφημα $T$ με $n$ κορυφές τα εξής είναι ισοδύναμα:</p>
<ul><li>το $T$ είναι δέντρο·</li><li>ανάμεσα σε κάθε δύο κορυφές υπάρχει <b>μοναδικό</b> απλό μονοπάτι·</li><li>το $T$ είναι συνεκτικό με $n - 1$ ακμές·</li><li>το $T$ δεν έχει απλά κυκλώματα και έχει $n - 1$ ακμές.</li></ul>
<p>Κάθε δέντρο με $n\ge 2$ κορυφές έχει τουλάχιστον δύο <b>φύλλα</b> (κορυφές βαθμού $1$). Ένα δάσος με $n$ κορυφές και $k$ συνιστώσες έχει $n - k$ ακμές. Υπάρχουν $n^{n-2}$ δέντρα με $n$ <b>επιγεγραμμένες</b> κορυφές (Cayley).</p></div>
<div class="tbox"><h4>Δέντρα με ρίζα – m-αδικά δέντρα</h4>
<p>Σε δέντρο με <b>ρίζα</b> ορίζονται γονέας, παιδιά, πρόγονοι, απόγονοι, <b>φύλλα</b> (χωρίς παιδιά) και <b>εσωτερικές</b> κορυφές, <b>επίπεδο</b> και <b>ύψος</b>. Ένα δέντρο είναι <b>πλήρες m-αδικό</b> αν κάθε εσωτερική κορυφή έχει ακριβώς $m$ παιδιά. Τότε, με $i$ εσωτερικές κορυφές, $l$ φύλλα και $n$ κορυφές:
$$n = mi + 1,\qquad l = (m - 1)i + 1.$$
Ένα $m$-αδικό δέντρο ύψους $h$ έχει το πολύ $m^h$ φύλλα.</p></div>
<div class="tbox tip"><h4>Διάσχιση (εισαγωγικά)</h4>
<p>Για δυαδικά/διατεταγμένα δέντρα: <b>προδιατεταγμένη</b> (ρίζα, μετά τα υποδέντρα από αριστερά προς τα δεξιά), <b>ενδοδιατεταγμένη</b> (αριστερό υποδέντρο, ρίζα, υπόλοιπα), <b>μεταδιατεταγμένη</b> (υποδέντρα, και τέλος η ρίζα).</p></div>
<div class="tbox warn"><h4>Προσοχή</h4>
<p>Οι τύποι $n = mi + 1$ ισχύουν για <b>πλήρη</b> $m$-αδικά δέντρα. Για ένα γενικό δέντρο, χρησιμοποιούμε το θεώρημα χειραψίας: $\sum\deg = 2(n - 1)$.</p></div>`,
  widget: "dsbtree",
  gen: "dsbtr",
  exercises: [
    { level: 1, type: "fields", q: R`Ένα δέντρο έχει $25$ κορυφές. Πόσες ακμές έχει; Ένα δάσος με $20$ κορυφές και $4$ συνιστώσες, πόσες ακμές έχει;`,
      fields: [{ label: "δέντρο =", ans: 24 }, { label: "δάσος =", ans: 16 }], hint: R`$n - 1$ και $n - k$.`, sol: R`Δέντρο: $25 - 1 = 24$. Δάσος: $20 - 4 = 16$.` },
    { level: 1, type: "fields", q: R`Ένα πλήρες τριαδικό ($m = 3$) δέντρο έχει $13$ εσωτερικές κορυφές. Πόσες κορυφές και πόσα φύλλα έχει;`,
      fields: [{ label: "n =", ans: 40 }, { label: "φύλλα =", ans: 27 }], hint: R`$n = mi + 1$, $l = (m-1)i + 1$.`, sol: R`$n = 3\cdot 13 + 1 = 40$, $l = 2\cdot 13 + 1 = 27$ (έλεγχος: $13 + 27 = 40$).` },
    { level: 1, type: "fields", q: R`Ένα πλήρες δυαδικό δέντρο έχει $50$ φύλλα. Πόσες εσωτερικές κορυφές και πόσες κορυφές συνολικά έχει;`,
      fields: [{ label: "εσωτερικές =", ans: 49 }, { label: "n =", ans: 99 }], hint: R`$l = i + 1$ για $m = 2$.`, sol: R`$50 = i + 1 \Rightarrow i = 49$ και $n = 2\cdot 49 + 1 = 99$.` },
    { level: 1, type: "mc", q: R`Κάθε δέντρο με τουλάχιστον δύο κορυφές έχει τουλάχιστον δύο φύλλα.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: 0,
      hint: R`Πάρτε ένα απλό μονοπάτι μέγιστου μήκους.`, sol: R`Σωστό: τα άκρα ενός μέγιστου απλού μονοπατιού έχουν βαθμό $1$ — αλλιώς το μονοπάτι θα επεκτεινόταν ή θα σχηματιζόταν απλό κύκλωμα.` },
    { level: 2, type: "fields", q: R`Πόσα (επιγεγραμμένα) δέντρα με σύνολο κορυφών $\{1, 2, 3, 4, 5\}$ υπάρχουν; Ποιο είναι το μέγιστο πλήθος φύλλων ενός δυαδικού δέντρου ύψους $5$;`,
      fields: [{ label: "δέντρα =", ans: 125 }, { label: "max φύλλα =", ans: 32 }], hint: R`Cayley $n^{n-2}$· $m^h$.`, sol: R`$5^{3} = 125$ και $2^5 = 32$.` },
    { level: 2, type: "mc", q: R`Δυαδικό δέντρο με ρίζα $a$· παιδιά της $a$: $b$ (αριστερό), $c$ (δεξί)· παιδιά της $b$: $d$, $e$· της $c$: $f$ (αριστερό). Ποια είναι η <b>μεταδιατεταγμένη</b> διάσχιση;`,
      options: ["$d, e, b, f, c, a$", "$a, b, d, e, c, f$", "$d, b, e, a, f, c$", "$a, c, f, b, e, d$"], correct: 0,
      hint: R`Υποδέντρα πρώτα, ρίζα τελευταία.`, sol: R`Μεταδιατεταγμένη: αριστερό υποδέντρο ($d, e, b$), δεξί ($f, c$), ρίζα $a$. Η $a, b, d, e, c, f$ είναι η προδιατεταγμένη και η $d, b, e, a, f, c$ η ενδοδιατεταγμένη.` },
    { level: 2, type: "mc", q: R`Ένα συνεκτικό γράφημα με $n$ κορυφές και $n - 1$ ακμές:`,
      options: ["είναι δέντρο", "έχει ακριβώς ένα απλό κύκλωμα", "μπορεί να μην είναι δέντρο", "έχει τουλάχιστον ένα απλό κύκλωμα"], correct: 0,
      hint: R`Χαρακτηρισμοί δέντρων.`, sol: R`Συνεκτικό με $n - 1$ ακμές ⇔ δέντρο (αν είχε απλό κύκλωμα, αφαιρώντας ακμή θα μέναμε συνεκτικοί με $n - 2$ ακμές, αδύνατο).` },
    { level: 3, type: "fields", q: R`Ένα δέντρο έχει $2$ κορυφές βαθμού $4$, $1$ κορυφή βαθμού $3$, $1$ κορυφή βαθμού $2$ και όλες οι υπόλοιπες είναι φύλλα. Πόσα φύλλα έχει;`,
      fields: [{ label: "φύλλα =", ans: 7 }], hint: R`$\sum\deg = 2(n - 1)$ με $n = 4 + l$.`, sol: R`$8 + 3 + 2 + l = 2(4 + l - 1) \Rightarrow 13 + l = 6 + 2l \Rightarrow l = 7$.` }
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

/* Διακριτές Δομές (ΕΠΛ111) — widgets & γεννήτριες (μέρος α): Λογική, Σύνολα, Συναρτήσεις, Αποδείξεις, Επαγωγή */

/* ---------- προτασιακή λογική: λεκτική ανάλυση, συντακτική ανάλυση, αποτίμηση ---------- */
const dsaPrec = { var: 0, not: 1, and: 2, or: 3, xor: 3, imp: 4, iff: 5 };
function dsaLex(s) {
  const t = []; s = String(s);
  for (let i = 0; i < s.length;) {
    const c = s[i], two = s.slice(i, i + 2), three = s.slice(i, i + 3);
    if (/\s/.test(c)) { i++; continue; }
    if (three === "<->" || three === "<=>") { t.push("↔"); i += 3; continue; }
    if (two === "->" || two === "=>") { t.push("→"); i += 2; continue; }
    if ("¬!~".includes(c)) { t.push("¬"); i++; continue; }
    if ("∧&".includes(c)) { t.push("∧"); i++; continue; }
    if ("∨|".includes(c)) { t.push("∨"); i++; continue; }
    if ("⊕^".includes(c)) { t.push("⊕"); i++; continue; }
    if ("→↔()".includes(c)) { t.push(c); i++; continue; }
    if (/[a-z]/.test(c)) { t.push(c); i++; continue; }
    throw new Error("Άγνωστο σύμβολο «" + c + "»");
  }
  return t;
}
function dsaParse(s) {
  const t = dsaLex(s); let i = 0;
  const peek = () => t[i];
  function iff() { let a = imp(); while (peek() === "↔") { i++; a = { op: "iff", a, b: imp() }; } return a; }
  function imp() { const a = or(); if (peek() === "→") { i++; return { op: "imp", a, b: imp() }; } return a; }
  function or() { let a = and(); while (peek() === "∨" || peek() === "⊕") { const o = peek() === "∨" ? "or" : "xor"; i++; a = { op: o, a, b: and() }; } return a; }
  function and() { let a = un(); while (peek() === "∧") { i++; a = { op: "and", a, b: un() }; } return a; }
  function un() {
    const v = peek();
    if (v === "¬") { i++; return { op: "not", a: un() }; }
    if (v === "(") { i++; const a = iff(); if (peek() !== ")") throw new Error("Λείπει «)»"); i++; return a; }
    if (v && /^[a-z]$/.test(v)) { i++; return { op: "var", n: v }; }
    throw new Error(v ? "Μη αναμενόμενο «" + v + "»" : "Ο τύπος τελειώνει απότομα");
  }
  if (!t.length) throw new Error("Κενός τύπος");
  const r = iff(); if (i < t.length) throw new Error("Περιττό σύμβολο «" + t[i] + "»"); return r;
}
function dsaEval(f, e) {
  switch (f.op) {
    case "var": return e[f.n];
    case "not": return !dsaEval(f.a, e);
    case "and": return dsaEval(f.a, e) && dsaEval(f.b, e);
    case "or": return dsaEval(f.a, e) || dsaEval(f.b, e);
    case "xor": return dsaEval(f.a, e) !== dsaEval(f.b, e);
    case "imp": return !dsaEval(f.a, e) || dsaEval(f.b, e);
    default: return dsaEval(f.a, e) === dsaEval(f.b, e);
  }
}
const dsaSymP = { not: "¬", and: " ∧ ", or: " ∨ ", xor: " ⊕ ", imp: " → ", iff: " ↔ " };
const dsaSymT = { not: "\\lnot ", and: " \\land ", or: " \\lor ", xor: " \\oplus ", imp: " \\to ", iff: " \\leftrightarrow " };
function dsaStr(f, tex) {
  const S = tex ? dsaSymT : dsaSymP;
  const go = g => {
    if (g.op === "var") return g.n;
    if (g.op === "not") { const s = go(g.a); return S.not + (g.a.op === "var" || g.a.op === "not" ? s : "(" + s + ")"); }
    const P = dsaPrec[g.op], assoc = g.op === "and" || g.op === "or";
    const L = go(g.a), Rr = go(g.b);
    const bin = x => x.op !== "var" && x.op !== "not", top = g.op === "imp" || g.op === "iff";
    const wl = bin(g.a) && (top || dsaPrec[g.a.op] > P || (dsaPrec[g.a.op] === P && !(assoc && g.a.op === g.op)));
    const wr = bin(g.b) && (top || dsaPrec[g.b.op] >= P) && !(assoc && g.b.op === g.op);
    return (wl ? "(" + L + ")" : L) + S[g.op] + (wr ? "(" + Rr + ")" : Rr);
  };
  return go(f);
}
function dsaVars(...fs) { const s = new Set(); const go = g => { if (g.op === "var") s.add(g.n); else { go(g.a); if (g.b) go(g.b); } }; fs.forEach(go); return [...s].sort(); }
function dsaSubs(f) { const out = [], seen = new Set(); const go = g => { if (g.op === "var") return; go(g.a); if (g.b) go(g.b); const s = dsaStr(g); if (!seen.has(s)) { seen.add(s); out.push(g); } }; go(f); return out; }
function dsaRows(vars) { const n = vars.length, rows = []; for (let r = 0; r < 2 ** n; r++) { const e = {}; vars.forEach((v, j) => e[v] = !((r >> (n - 1 - j)) & 1)); rows.push(e); } return rows; }
const dsaTV = b => b ? "Α" : "Ψ";
function dsaClass(f) { const v = dsaRows(dsaVars(f)).map(e => dsaEval(f, e)); return v.every(x => x) ? "taut" : v.some(x => x) ? "cont" : "contr"; }
const dsaClassName = { taut: "ταυτολογία", contr: "αντίφαση", cont: "ενδεχόμενη" };
function dsaEquivF(f, g) { return dsaRows(dsaVars(f, g)).every(e => dsaEval(f, e) === dsaEval(g, e)); }
const dsaCSS = `<style>.dsatt{border-collapse:collapse;margin:6px auto;font-size:14px}.dsatt th,.dsatt td{border:1px solid var(--line);padding:3px 8px;text-align:center;white-space:nowrap}.dsatt th{background:#f3f6fb;font-weight:700}.dsatt td.t{color:#1d6b35;font-weight:700}.dsatt td.f{color:#b3261e}.dsatt tr.hl td{background:#fff6d6}.dsatt tr.bad td{background:#fde2e0}.dsatt td.res{border-left:2px solid var(--navy)}.dsain{width:100%;max-width:340px;font:inherit;padding:5px 8px;border:1px solid var(--line);border-radius:8px}</style>`;
function dsaTable(vars, cols, rowClass) {
  const rows = dsaRows(vars);
  let h = `<div style="overflow-x:auto"><table class="dsatt"><tr>${vars.map(v => `<th>${v}</th>`).join("")}${cols.map((c, j) => `<th${c.res ? ' class="res"' : ""}>${c.name}</th>`).join("")}</tr>`;
  rows.forEach((e, r) => {
    h += `<tr${rowClass ? ` class="${rowClass(e, r)}"` : ""}>${vars.map(v => `<td class="${e[v] ? "t" : "f"}">${dsaTV(e[v])}</td>`).join("")}` +
      cols.map(c => { const b = c.f ? dsaEval(c.f, e) : c.fn(e); return `<td class="${b ? "t" : "f"}${c.res ? " res" : ""}">${dsaTV(b)}</td>`; }).join("") + `</tr>`;
  });
  return h + `</table></div>`;
}
/* ελαχιστόροι / μεγιστόροι για ΔΚΜ / ΣΚΜ */
function dsaDNF(f) { const vs = dsaVars(f); const t = dsaRows(vs).filter(e => dsaEval(f, e)).map(e => "(" + vs.map(v => (e[v] ? "" : "¬") + v).join(" ∧ ") + ")"); return t.length ? t.join(" ∨ ") : "(καμία γραμμή αληθής — αντίφαση)"; }
function dsaCNF(f) { const vs = dsaVars(f); const t = dsaRows(vs).filter(e => !dsaEval(f, e)).map(e => "(" + vs.map(v => (e[v] ? "¬" : "") + v).join(" ∨ ") + ")"); return t.length ? t.join(" ∧ ") : "(καμία γραμμή ψευδής — ταυτολογία)"; }

/* ---------- σύνολα: παραστάσεις με A, B, C ---------- */
function dsaSetParse(s) {
  const t = []; s = String(s);
  for (const c of s) {
    if (/\s/.test(c)) continue;
    if ("ABCU".includes(c)) t.push(c);
    else if ("∪u+|".includes(c)) t.push("∪");
    else if ("∩n*&".includes(c)) t.push("∩");
    else if ("−-\\".includes(c)) t.push("−");
    else if ("⊕Δ^".includes(c)) t.push("⊕");
    else if ("'′ᶜ".includes(c)) t.push("'");
    else if ("()".includes(c)) t.push(c);
    else throw new Error("Άγνωστο σύμβολο «" + c + "»");
  }
  let i = 0; const peek = () => t[i];
  function bin() { let a = inter(); while (["∪", "−", "⊕"].includes(peek())) { const o = t[i++]; a = { op: o, a, b: inter() }; } return a; }
  function inter() { let a = post(); while (peek() === "∩") { i++; a = { op: "∩", a, b: post() }; } return a; }
  function post() { let a = atom(); while (peek() === "'") { i++; a = { op: "'", a }; } return a; }
  function atom() { const v = peek(); if (v === "(") { i++; const a = bin(); if (peek() !== ")") throw new Error("Λείπει «)»"); i++; return a; } if (v && "ABCU".includes(v)) { i++; return { op: "v", n: v }; } throw new Error(v ? "Μη αναμενόμενο «" + v + "»" : "Η παράσταση τελειώνει απότομα"); }
  if (!t.length) throw new Error("Κενή παράσταση");
  const r = bin(); if (i < t.length) throw new Error("Περιττό σύμβολο «" + t[i] + "»"); return r;
}
function dsaSetEval(f, m) { /* m = {A:bool,B:bool,C:bool} */
  switch (f.op) {
    case "v": return f.n === "U" ? true : m[f.n];
    case "'": return !dsaSetEval(f.a, m);
    case "∩": return dsaSetEval(f.a, m) && dsaSetEval(f.b, m);
    case "∪": return dsaSetEval(f.a, m) || dsaSetEval(f.b, m);
    case "−": return dsaSetEval(f.a, m) && !dsaSetEval(f.b, m);
    default: return dsaSetEval(f.a, m) !== dsaSetEval(f.b, m);
  }
}
const dsaSetTex = A => A.length ? `\\{${A.join(", ")}\\}` : "\\varnothing";
const dsaIsPrime = n => { if (n < 2 || !Number.isInteger(n)) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
function dsaFactor(n) { const f = []; let m = n; for (let p = 2; p * p <= m; p++) while (m % p === 0) { f.push(p); m /= p; } if (m > 1) f.push(m); return f; }
const dsaBin = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
const dsaFact = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
const dsaDec = x => String(x).replace(".", "{,}");
const dsaDecP = x => String(x).replace(".", ",");
function dsaSample(arr, k) { const a = arr.slice(); shuffle(a); return a.slice(0, k); }
function dsaRandSet(lo, hi, k) { return dsaSample(Array.from({ length: hi - lo + 1 }, (_, i) => lo + i), k).sort((a, b) => a - b); }

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 1.1 πίνακας αληθείας ---------- */
  dsaTruth(box) {
    const P = ["p → q", "¬q → ¬p", "(p → q) ∧ (q → p)", "p ⊕ q", "(p ∨ q) → r", "(p → q) ∧ (q → r) → (p → r)", "p ∧ ¬p", "¬(p ∧ q) ↔ ¬p ∨ ¬q"];
    box.innerHTML = dsaCSS + `<div class="wctl"><label>έτοιμος τύπος <select class="pp">${P.map(p => `<option>${p}</option>`).join("")}</select></label>
      <label>ή γράψε: <input class="dsain fi" value="${P[0]}" spellcheck="false"></label></div>
      <p class="muted" style="font-size:13px;margin:4px 0">Σύμβολα: ¬ (ή !), ∧ (ή &amp;), ∨ (ή |), ⊕ (ή ^), → (ή -&gt;), ↔ (ή &lt;-&gt;). Μεταβλητές: p, q, r, s.</p>
      <div class="pl"></div><div class="wout"></div>`;
    const fi = $(".fi", box);
    function draw() {
      let f; try { f = dsaParse(fi.value); } catch (e) { $(".pl", box).innerHTML = ""; $(".wout", box).innerHTML = `<b style="color:#b3261e">${e.message}</b>`; return; }
      const vs = dsaVars(f); if (vs.length > 4) { $(".wout", box).innerHTML = "Έως 4 μεταβλητές."; return; }
      const subs = dsaSubs(f), cols = subs.map((g, j) => ({ name: dsaStr(g), f: g, res: j === subs.length - 1 }));
      $(".pl", box).innerHTML = dsaTable(vs, cols);
      const cl = dsaClass(f), nT = dsaRows(vs).filter(e => dsaEval(f, e)).length;
      let o = `Ο τύπος έχει <b>${2 ** vs.length}</b> γραμμές (${vs.length} μεταβλητές) και είναι αληθής σε <b>${nT}</b>: είναι <b>${dsaClassName[cl]}</b>.`;
      if (f.op === "imp") {
        const a = f.a, b = f.b, ng = g => g.op === "not" ? g.a : { op: "not", a: g };
        o += `<br>Συνεπαγωγή $${dsaStr(f, true)}$: αντίστροφη $${dsaStr({ op: "imp", a: b, b: a }, true)}$, αντίθετη $${dsaStr({ op: "imp", a: ng(a), b: ng(b) }, true)}$, αντιθετοαντίστροφη $${dsaStr({ op: "imp", a: ng(b), b: ng(a) }, true)}$ (η μόνη ισοδύναμη με την αρχική).`;
      }
      $(".wout", box).innerHTML = o; typeset($(".wout", box));
    }
    $(".pp", box).onchange = () => { fi.value = $(".pp", box).value; draw(); };
    fi.oninput = draw; draw();
  },

  /* ---------- 1.2 λογική ισοδυναμία ---------- */
  dsaEquiv(box) {
    const P = [["¬(p ∧ q)", "¬p ∨ ¬q"], ["¬(p ∨ q)", "¬p ∧ ¬q"], ["p → q", "¬p ∨ q"], ["p → q", "q → p"], ["p ∨ (q ∧ r)", "(p ∨ q) ∧ (p ∨ r)"], ["(p → r) ∧ (q → r)", "(p ∨ q) → r"], ["p → (q → r)", "(p ∧ q) → r"], ["p ↔ q", "(p → q) ∧ (q → p)"], ["p ∨ (p ∧ q)", "p"]];
    box.innerHTML = dsaCSS + `<div class="wctl"><label>ζεύγος <select class="pp">${P.map((p, i) => `<option value="${i}">${p[0]}  vs  ${p[1]}</option>`).join("")}</select></label></div>
      <div class="wctl"><label>F = <input class="dsain f1" value="${P[0][0]}" spellcheck="false"></label><label>G = <input class="dsain f2" value="${P[0][1]}" spellcheck="false"></label></div>
      <div class="pl"></div><div class="wout"></div>`;
    function draw() {
      let f, g; try { f = dsaParse($(".f1", box).value); g = dsaParse($(".f2", box).value); } catch (e) { $(".pl", box).innerHTML = ""; $(".wout", box).innerHTML = `<b style="color:#b3261e">${e.message}</b>`; return; }
      const vs = dsaVars(f, g); if (vs.length > 4) { $(".wout", box).innerHTML = "Έως 4 μεταβλητές."; return; }
      const eq = dsaEquivF(f, g);
      $(".pl", box).innerHTML = dsaTable(vs, [{ name: "F", f, res: true }, { name: "G", f: g }], e => dsaEval(f, e) !== dsaEval(g, e) ? "bad" : "");
      let o = eq ? `<b style="color:#1d6b35">F ≡ G</b>: οι δύο στήλες συμπίπτουν σε όλες τις ${2 ** vs.length} γραμμές, δηλαδή ο τύπος F ↔ G είναι ταυτολογία.`
        : `<b style="color:#b3261e">F ≢ G</b>: διαφέρουν στις κόκκινες γραμμές (αρκεί μία για να μην είναι ισοδύναμοι).`;
      o += `<br><span class="muted">ΔΚΜ του F (από τις γραμμές όπου F = Α): ${dsaDNF(f)}<br>ΣΚΜ του F (από τις γραμμές όπου F = Ψ): ${dsaCNF(f)}</span>`;
      $(".wout", box).innerHTML = o;
    }
    $(".pp", box).onchange = () => { const p = P[+$(".pp", box).value]; $(".f1", box).value = p[0]; $(".f2", box).value = p[1]; draw(); };
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 1.3 ποσοδείκτες σε πεπερασμένο σύμπαν ---------- */
  dsaQuant(box) {
    const PP = [["x είναι άρτιος", x => x % 2 === 0], ["x² ≤ 10", x => x * x <= 10], ["x > 0", x => x > 0], ["x² ≥ x", x => x * x >= x], ["x είναι πρώτος", dsaIsPrime]];
    const QQ = [["x < y", (x, y) => x < y], ["x + y = 0", (x, y) => x + y === 0], ["x ≤ y", (x, y) => x <= y], ["x · y = x", (x, y) => x * y === x], ["x + y είναι άρτιος", (x, y) => (x + y) % 2 === 0], ["y = x²", (x, y) => y === x * x]];
    box.innerHTML = dsaCSS + `<div class="wctl"><label>σύμπαν <select class="dd"><option value="0">{1, 2, …, n}</option><option value="1">{−n, …, n}</option></select></label>
      <label>n <input type="range" class="rn" min="2" max="6" value="3"><b class="vn"></b></label></div>
      <div class="wctl"><label>P(x): <select class="pp">${PP.map((p, i) => `<option value="${i}">${p[0]}</option>`).join("")}</select></label>
      <label>Q(x, y): <select class="qq">${QQ.map((p, i) => `<option value="${i}">${p[0]}</option>`).join("")}</select></label></div>
      <div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const n = +$(".rn", box).value; $(".vn", box).textContent = n;
      const D = $(".dd", box).value === "0" ? Array.from({ length: n }, (_, i) => i + 1) : Array.from({ length: 2 * n + 1 }, (_, i) => i - n);
      const [pn, P] = PP[+$(".pp", box).value], [qn, Q] = QQ[+$(".qq", box).value];
      const ce = D.find(x => !P(x)), wi = D.find(x => P(x));
      let o = `<p>Σύμπαν $D = \\{${D.join(", ")}\\}$. Αληθής η P(x) για: $\\{${D.filter(P).join(", ")}\\}$.</p>
        <p>∀x P(x): <b>${dsaTV(ce === undefined)}</b> ${ce === undefined ? "(ισχύει για κάθε στοιχείο)" : `— αντιπαράδειγμα x = ${ce}`}<br>∃x P(x): <b>${dsaTV(wi !== undefined)}</b> ${wi !== undefined ? `— μάρτυρας x = ${wi}` : "(κανένα στοιχείο δεν την ικανοποιεί)"}</p>`;
      let tb = `<div style="overflow-x:auto"><table class="dsatt"><tr><th>x \\ y</th>${D.map(y => `<th>${y}</th>`).join("")}</tr>`;
      D.forEach(x => tb += `<tr><th>${x}</th>${D.map(y => { const b = Q(x, y); return `<td class="${b ? "t" : "f"}">${dsaTV(b)}</td>`; }).join("")}</tr>`);
      tb += `</table></div>`;
      const aa = D.every(x => D.every(y => Q(x, y))), ae = D.every(x => D.some(y => Q(x, y))), ea = D.some(x => D.every(y => Q(x, y))), eyax = D.some(y => D.every(x => Q(x, y))), ee = D.some(x => D.some(y => Q(x, y)));
      const badx = D.find(x => !D.some(y => Q(x, y)));
      const s = [["∀x ∀y Q(x, y)", aa, "όλα τα κελιά Α"], ["∀x ∃y Q(x, y)", ae, ae ? "κάθε γραμμή έχει τουλάχιστον ένα Α" : `η γραμμή x = ${badx} δεν έχει κανένα Α`], ["∃x ∀y Q(x, y)", ea, "υπάρχει γραμμή όλο Α"], ["∃y ∀x Q(x, y)", eyax, "υπάρχει στήλη όλο Α"], ["∃x ∃y Q(x, y)", ee, "υπάρχει τουλάχιστον ένα Α"]];
      $(".pl", box).innerHTML = o + `<p style="margin:4px 0"><b>Q(x, y): ${qn}</b> (γραμμή = x, στήλη = y)</p>` + tb;
      $(".wout", box).innerHTML = s.map(([a, b, w]) => `${a}: <b style="color:${b ? "#1d6b35" : "#b3261e"}">${dsaTV(b)}</b> <span class="muted">(${w})</span>`).join("<br>") +
        `<br><span class="muted">Η σειρά των ποσοδεικτών μετράει: το ∀x ∃y επιτρέπει διαφορετικό y για κάθε x, ενώ το ∃y ∀x ζητά ένα y για όλα τα x. Άρνηση: ¬∀x ∃y Q ≡ ∃x ∀y ¬Q.</span>`;
      typeset($(".pl", box));
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 1.4 εγκυρότητα επιχειρήματος ---------- */
  dsaArg(box) {
    const P = [["Τρόπος του θέτειν (modus ponens)", "p → q; p", "q"], ["Τρόπος του αναιρείν (modus tollens)", "p → q; ¬q", "¬p"], ["Υποθετικός συλλογισμός", "p → q; q → r", "p → r"], ["Διαζευκτικός συλλογισμός", "p ∨ q; ¬p", "q"], ["Ανάλυση (resolution)", "p ∨ q; ¬p ∨ r", "q ∨ r"], ["Πλάνη: επιβεβαίωση του επομένου", "p → q; q", "p"], ["Πλάνη: άρνηση του ηγουμένου", "p → q; ¬p", "¬q"]];
    box.innerHTML = dsaCSS + `<div class="wctl"><label>επιχείρημα <select class="pp">${P.map((p, i) => `<option value="${i}">${p[0]}</option>`).join("")}</select></label></div>
      <div class="wctl"><label>υποθέσεις (χωρισμένες με ;) <input class="dsain hy" value="${P[0][1]}" spellcheck="false"></label><label>συμπέρασμα <input class="dsain co" value="${P[0][2]}" spellcheck="false"></label></div>
      <div class="pl"></div><div class="wout"></div>`;
    function draw() {
      let H, C; try { H = $(".hy", box).value.split(";").map(x => x.trim()).filter(Boolean).map(dsaParse); C = dsaParse($(".co", box).value); } catch (e) { $(".pl", box).innerHTML = ""; $(".wout", box).innerHTML = `<b style="color:#b3261e">${e.message}</b>`; return; }
      const vs = dsaVars(...H, C); if (vs.length > 4 || !H.length) { $(".wout", box).innerHTML = "Δώσε τουλάχιστον μία υπόθεση, έως 4 μεταβλητές."; return; }
      const crit = e => H.every(h => dsaEval(h, e)), rows = dsaRows(vs), bad = rows.filter(e => crit(e) && !dsaEval(C, e));
      $(".pl", box).innerHTML = dsaTable(vs, [...H.map((h, i) => ({ name: dsaStr(h), f: h, res: i === 0 })), { name: "∴ " + dsaStr(C), f: C, res: true }], e => crit(e) ? (dsaEval(C, e) ? "hl" : "bad") : "");
      const nc = rows.filter(crit).length;
      $(".wout", box).innerHTML = (bad.length ? `<b style="color:#b3261e">Μη έγκυρο (πλάνη)</b>: στην κόκκινη γραμμή ${vs.map(v => `${v} = ${dsaTV(bad[0][v])}`).join(", ")} όλες οι υποθέσεις είναι αληθείς αλλά το συμπέρασμα ψευδές.`
        : `<b style="color:#1d6b35">Έγκυρο</b>: σε όλες τις ${nc} «κρίσιμες» γραμμές (κίτρινες — όπου όλες οι υποθέσεις είναι αληθείς) το συμπέρασμα είναι αληθές. Ισοδύναμα, ο τύπος (υποθέσεις συζευγμένες) → συμπέρασμα είναι ταυτολογία.`) +
        `<br><span class="muted">Έγκυρο επιχείρημα σημαίνει ότι το συμπέρασμα έπεται λογικά — όχι ότι οι υποθέσεις είναι αληθείς.</span>`;
    }
    $(".pp", box).onchange = () => { const p = P[+$(".pp", box).value]; $(".hy", box).value = p[1]; $(".co", box).value = p[2]; draw(); };
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 2.1 διάγραμμα Venn για τρία σύνολα ---------- */
  dsaVenn(box) {
    const P = ["A ∪ B", "A ∩ B", "A − B", "A ⊕ B", "(A ∪ B)'", "A' ∩ B'", "A ∩ (B ∪ C)", "(A ∩ B) ∪ (A ∩ C)", "(A − B) ∪ C", "A ∩ B ∩ C'"];
    box.innerHTML = `<style>.dsain{width:100%;max-width:340px;font:inherit;padding:5px 8px;border:1px solid var(--line);border-radius:8px}</style>
      <div class="wctl"><label>έτοιμη παράσταση <select class="pp">${P.map(p => `<option>${p}</option>`).join("")}</select></label>
      <label>ή γράψε: <input class="dsain fi" value="${P[0]}" spellcheck="false"></label><button class="btn ghost small nw">Νέα σύνολα</button></div>
      <p class="muted" style="font-size:13px;margin:4px 0">Πράξεις: ∪ (ή +), ∩ (ή *), − (διαφορά), ⊕ (συμμετρική διαφορά), ' (συμπλήρωμα ως προς U).</p>
      <div class="pl"><canvas width="520" height="300" style="width:100%;max-width:520px;height:auto;display:block;margin:auto"></canvas></div><div class="wout"></div>`;
    let A = [1, 2, 3, 4, 5], B = [4, 5, 6, 7], C = [2, 5, 7, 8, 9], U = Array.from({ length: 10 }, (_, i) => i + 1);
    const cv = $("canvas", box), ctx = cv.getContext("2d"), W = 520, Hh = 300;
    const cen = { A: [210, 118], B: [310, 118], C: [260, 198] }, rr = 84;
    const inC = (k, x, y) => (x - cen[k][0]) ** 2 + (y - cen[k][1]) ** 2 <= rr * rr;
    const spot = { "100": [165, 100], "010": [355, 100], "001": [260, 252], "110": [260, 86], "101": [210, 180], "011": [310, 180], "111": [260, 145], "000": [40, 280] };
    function draw() {
      let f; const fi = $(".fi", box);
      try { f = dsaSetParse(fi.value); } catch (e) { $(".wout", box).innerHTML = `<b style="color:#b3261e">${e.message}</b>`; return; }
      const img = ctx.createImageData(W, Hh);
      for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) {
        const k = 4 * (y * W + x), inU = x > 8 && x < W - 8 && y > 8 && y < Hh - 8;
        let c = [255, 255, 255];
        if (inU && dsaSetEval(f, { A: inC("A", x, y), B: inC("B", x, y), C: inC("C", x, y) })) c = [158, 197, 254];
        img.data[k] = c[0]; img.data[k + 1] = c[1]; img.data[k + 2] = c[2]; img.data[k + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      ctx.strokeStyle = "#1b2a4a"; ctx.lineWidth = 2; ctx.strokeRect(8, 8, W - 16, Hh - 16);
      ctx.font = "800 16px sans-serif"; ctx.fillStyle = "#1b2a4a"; ctx.fillText("U", 16, 28);
      [["A", 130, 46], ["B", 380, 46], ["C", 352, 268]].forEach(([k, lx, ly]) => { ctx.beginPath(); ctx.arc(cen[k][0], cen[k][1], rr, 0, 2 * Math.PI); ctx.stroke(); ctx.fillText(k, lx, ly); });
      ctx.font = "600 13px sans-serif"; ctx.fillStyle = "#333";
      const reg = x => (A.includes(x) ? "1" : "0") + (B.includes(x) ? "1" : "0") + (C.includes(x) ? "1" : "0");
      Object.entries(spot).forEach(([k, [x, y]]) => { const els = U.filter(e => reg(e) === k); ctx.textAlign = "center"; ctx.fillText(els.join(","), x, y); });
      ctx.textAlign = "left";
      const res = U.filter(e => dsaSetEval(f, { A: A.includes(e), B: B.includes(e), C: C.includes(e) }));
      $(".wout", box).innerHTML = `$U = ${dsaSetTex(U)}$, $A = ${dsaSetTex(A)}$, $B = ${dsaSetTex(B)}$, $C = ${dsaSetTex(C)}$.<br>
        Αποτέλεσμα: <b>${fi.value}</b> $= ${dsaSetTex(res)}$, με πληθάριθμο <b>${res.length}</b>. Η σκιασμένη περιοχή δείχνει την ίδια παράσταση για <i>οποιαδήποτε</i> σύνολα.`;
      typeset($(".wout", box));
    }
    $(".pp", box).onchange = () => { $(".fi", box).value = $(".pp", box).value; draw(); };
    $(".fi", box).oninput = draw;
    $(".nw", box).onclick = () => { U = Array.from({ length: 12 }, (_, i) => i + 1); A = dsaRandSet(1, 12, ri(3, 6)); B = dsaRandSet(1, 12, ri(3, 6)); C = dsaRandSet(1, 12, ri(3, 6)); draw(); };
    draw();
  },

  /* ---------- 2.2 συνάρτηση με διάγραμμα βελών ---------- */
  dsaFunc(box) {
    const XL = ["a", "b", "c", "d", "e"];
    box.innerHTML = `<div class="wctl"><label>|X| <input type="range" class="rm" min="2" max="5" value="3"><b class="vm"></b></label>
      <label>|Y| <input type="range" class="rn" min="2" max="5" value="3"><b class="vn"></b></label><button class="btn ghost small rnd">Τυχαία f</button><button class="btn ghost small bij">Αμφιμονοσήμαντη (αν γίνεται)</button></div>
      <div class="wctl sel"></div><div class="pl"></div><div class="wout"></div>`;
    let m = 3, n = 3, f = [0, 1, 1];
    function sels() {
      $(".sel", box).innerHTML = f.map((v, i) => `<label>f(${XL[i]}) = <select data-i="${i}">${Array.from({ length: n }, (_, j) => `<option value="${j}"${j === v ? " selected" : ""}>${j + 1}</option>`).join("")}</select></label>`).join("");
      $(".sel", box).querySelectorAll("select").forEach(s => s.onchange = () => { f[+s.dataset.i] = +s.value; draw(); });
    }
    function draw() {
      $(".vm", box).textContent = m; $(".vn", box).textContent = n;
      const svg = gyCanvas(box, 520, 60 + 50 * Math.max(m, n));
      const yX = i => 50 + i * 50 + (Math.max(m, n) - m) * 25, yY = j => 50 + j * 50 + (Math.max(m, n) - n) * 25;
      gyAdd(svg, "text", { x: 120, y: 26, style: gyTS, "text-anchor": "middle" }, "X");
      gyAdd(svg, "text", { x: 400, y: 26, style: gyTS, "text-anchor": "middle" }, "Y");
      const hit = Array(n).fill(0); f.forEach(v => hit[v]++);
      f.forEach((v, i) => {
        const col = hit[v] > 1 ? "#b3261e" : "var(--blue)";
        gyAdd(svg, "line", { x1: 140, y1: yX(i), x2: 376, y2: yY(v), style: `stroke:${col};stroke-width:2.2` });
        gyAdd(svg, "polygon", { points: (() => { const dx = 236, dy = yY(v) - yX(i), L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, tx = 376, ty = yY(v); return `${tx},${ty} ${tx - 11 * ux - 5 * uy},${ty - 11 * uy + 5 * ux} ${tx - 11 * ux + 5 * uy},${ty - 11 * uy - 5 * ux}`; })(), style: `fill:${col}` });
      });
      for (let i = 0; i < m; i++) { gyAdd(svg, "circle", { cx: 120, cy: yX(i), r: 15, style: "fill:#fff;stroke:var(--navy);stroke-width:2" }); gyAdd(svg, "text", { x: 120, y: yX(i) + 5, style: gyTS, "text-anchor": "middle" }, XL[i]); }
      for (let j = 0; j < n; j++) { gyAdd(svg, "circle", { cx: 400, cy: yY(j), r: 15, style: `fill:${hit[j] ? "#fff" : "#fde2e0"};stroke:var(--navy);stroke-width:2` }); gyAdd(svg, "text", { x: 400, y: yY(j) + 5, style: gyTS, "text-anchor": "middle" }, j + 1); }
      const inj = hit.every(c => c <= 1), sur = hit.every(c => c >= 1), img = [...new Set(f)].sort().map(v => v + 1);
      const dup = hit.findIndex(c => c > 1), miss = hit.findIndex(c => c === 0);
      let o = `Εικόνα $f(X) = \\{${img.join(", ")}\\}$ ⊆ $Y$ (σύνολο αφίξεως).<br>
        <b>Ένα-προς-ένα:</b> ${inj ? "ναι — διαφορετικά στοιχεία έχουν διαφορετικές εικόνες" : `όχι — το ${dup + 1} είναι εικόνα ${hit[dup]} στοιχείων (κόκκινα βέλη)`}.<br>
        <b>Επί:</b> ${sur ? "ναι — κάθε στοιχείο του Y είναι εικόνα" : `όχι — το ${miss + 1} δεν είναι εικόνα κανενός στοιχείου (ροζ)`}.<br>`;
      o += inj && sur ? `<b style="color:#1d6b35">Αμφιμονοσήμαντη</b>: υπάρχει η αντίστροφη $f^{-1}$: ${f.map((v, i) => `${v + 1} ↦ ${XL[i]}`).join(", ")}.` : `<span class="muted">Δεν είναι αμφιμονοσήμαντη, άρα δεν αντιστρέφεται.</span>`;
      o += `<br><span class="muted">Πλήθος συναρτήσεων X → Y: $${n}^{${m}} = ${n ** m}$· ένα-προς-ένα: ${m <= n ? `$${n}!/${n - m}! = ${dsaFact(n) / dsaFact(n - m)}$` : "καμία (|X| > |Y|, αρχή του περιστερώνα)"}.</span>`;
      $(".wout", box).innerHTML = o; typeset($(".wout", box));
    }
    function reset() { m = +$(".rm", box).value; n = +$(".rn", box).value; f = Array.from({ length: m }, () => ri(0, n - 1)); sels(); draw(); }
    $(".rm", box).oninput = reset; $(".rn", box).oninput = reset;
    $(".rnd", box).onclick = reset;
    $(".bij", box).onclick = () => { if (m === n) { f = shuffle(Array.from({ length: n }, (_, j) => j)); sels(); draw(); } else $(".wout", box).innerHTML = `Αμφιμονοσήμαντη συνάρτηση υπάρχει μόνο όταν |X| = |Y| (εδώ ${m} ≠ ${n}).`; };
    sels(); draw();
  },

  /* ---------- 2.3 ακολουθίες και αθροίσματα ---------- */
  dsaSum(box) {
    const T = ["αριθμητική πρόοδος a + (i − 1)d", "γεωμετρική πρόοδος a·rⁱ⁻¹", "i²", "i³", "τηλεσκοπικό 1/(i(i + 1))"];
    box.innerHTML = `<div class="wctl"><label>ακολουθία <select class="tt">${T.map((t, i) => `<option value="${i}">${t}</option>`).join("")}</select></label></div>
      <div class="wctl"><label>a <input type="range" class="ra" min="-5" max="5" value="2"><b class="va"></b></label><label>d ή r <input type="range" class="rd" min="-3" max="3" value="3"><b class="vd"></b></label><label>n <input type="range" class="rn" min="1" max="10" value="6"><b class="vn"></b></label></div>
      <div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const t = +$(".tt", box).value, a = +$(".ra", box).value, d = +$(".rd", box).value, n = +$(".rn", box).value;
      $(".va", box).textContent = a; $(".vd", box).textContent = d; $(".vn", box).textContent = n;
      let term, tex, formula, tf;
      if (t === 0) { term = i => [a + (i - 1) * d, 1]; tex = `${a} + (i - 1)\\cdot ${gyPar(d)}`; tf = `S_n = \\frac{n}{2}\\,(2a + (n - 1)d) = \\frac{${n}}{2}(${2 * a} + ${n - 1}\\cdot ${gyPar(d)})`; }
      else if (t === 1) { term = i => [a * d ** (i - 1), 1]; tex = `${a}\\cdot ${gyPar(d)}^{i - 1}`; tf = d === 1 ? `S_n = n\\,a` : `S_n = a\\,\\frac{r^n - 1}{r - 1} = ${a}\\cdot\\frac{${gyPar(d)}^{${n}} - 1}{${d - 1}}`; }
      else if (t === 2) { term = i => [i * i, 1]; tex = `i^2`; tf = `\\sum_{i=1}^{n} i^2 = \\frac{n(n + 1)(2n + 1)}{6}`; }
      else if (t === 3) { term = i => [i ** 3, 1]; tex = `i^3`; tf = `\\sum_{i=1}^{n} i^3 = \\left(\\frac{n(n + 1)}{2}\\right)^2`; }
      else { term = i => [1, i * (i + 1)]; tex = `\\frac{1}{i(i + 1)} = \\frac1i - \\frac{1}{i + 1}`; tf = `S_n = 1 - \\frac{1}{n + 1} = \\frac{n}{n + 1}`; }
      let sp = 0, sq = 1; const terms = [], parts = [];
      for (let i = 1; i <= n; i++) { const [p, q] = term(i); terms.push(texFrac(p, q)); sp = sp * q + p * sq; sq *= q; const g = gcdI(sp, sq); sp /= g; sq /= g; parts.push(sp / sq); }
      const svg = gyCanvas(box, 520, 190), vals = Array.from({ length: n }, (_, i) => { const [p, q] = term(i + 1); return p / q; });
      const mx = Math.max(1e-9, ...vals.map(Math.abs), ...parts.map(Math.abs)), y0 = 95, sc = 80 / mx, bw = 440 / n;
      gyAdd(svg, "line", { x1: 40, y1: y0, x2: 500, y2: y0, style: "stroke:#999" });
      vals.forEach((v, i) => { const x = 50 + i * bw; gyAdd(svg, "rect", { x, y: v >= 0 ? y0 - v * sc : y0, width: bw * 0.55, height: Math.abs(v) * sc, style: "fill:var(--blue);fill-opacity:.55" }); });
      parts.forEach((v, i) => { const x = 50 + i * bw + bw * 0.27; gyAdd(svg, "circle", { cx: x, cy: y0 - v * sc, r: 4, style: "fill:#b3261e" }); if (i) gyAdd(svg, "line", { x1: x - bw, y1: y0 - parts[i - 1] * sc, x2: x, y2: y0 - v * sc, style: "stroke:#b3261e;stroke-width:1.5" }); });
      gyAdd(svg, "text", { x: 46, y: 182, style: "font-size:12px;fill:#555" }, "ράβδοι: όροι aᵢ · κόκκινη γραμμή: μερικά αθροίσματα Sᵢ");
      $(".wout", box).innerHTML = `$$\\sum_{i=1}^{${n}} \\left(${tex}\\right) = ${terms.join(" + ").replace(/\+ -/g, "- ")} = ${texFrac(sp, sq)}$$Κλειστός τύπος: $${tf}${t <= 1 ? ` = ${texFrac(sp, sq)}` : ""}$.`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 3.1 αντιπαράδειγμα: έλεγχος περιπτώσεων ≠ απόδειξη ---------- */
  dsaCex(box) {
    const C = [["n² + n + 41 είναι πρώτος", n => n * n + n + 41, 1], ["n² + n + 17 είναι πρώτος", n => n * n + n + 17, 1], ["2ⁿ − 1 είναι πρώτος όταν ο n είναι πρώτος", n => 2 ** n - 1, 2], ["2^(2ⁿ) + 1 είναι πρώτος (Fermat)", n => 2 ** (2 ** n) + 1, 0], ["κάθε άρτιος n ≥ 4 είναι άθροισμα δύο πρώτων (Goldbach)", null, 4]];
    box.innerHTML = `<div class="wctl"><label>ισχυρισμός «για κάθε n: …» <select class="cc">${C.map((c, i) => `<option value="${i}">${c[0]}</option>`).join("")}</select></label>
      <label>έλεγχος έως n = <input type="range" class="rn" min="5" max="60" value="45"><b class="vn"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const k = +$(".cc", box).value, [name, fn, n0] = C[k]; let N = +$(".rn", box).value; $(".vn", box).textContent = N;
      const cells = []; let first = null;
      if (k === 4) {
        for (let n = 4; n <= 2 * N; n += 2) { let p = 2; while (!(dsaIsPrime(p) && dsaIsPrime(n - p))) p++; cells.push(`<span style="color:#1d6b35">${n} = ${p} + ${n - p}</span>`); }
      } else {
        const top = k === 3 ? Math.min(N, 5) : N;
        for (let n = n0; n <= top; n++) {
          if (k === 2 && !dsaIsPrime(n)) continue;
          const v = fn(n), pr = dsaIsPrime(v);
          if (!pr && first === null) first = [n, v];
          cells.push(`<span style="color:${pr ? "#1d6b35" : "#b3261e;font-weight:800"}">n=${n}: ${v}${pr ? " ✓" : " = " + dsaFactor(v).join("·")}</span>`);
          if (k === 2 && n > 31) break;
        }
      }
      $(".pl", box).innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:4px 14px;font-size:13px;max-height:220px;overflow:auto">${cells.join("")}</div>`;
      $(".wout", box).innerHTML = k === 4 ? `Δεν βρέθηκε αντιπαράδειγμα έως ${2 * N}. <b>Αυτό δεν είναι απόδειξη</b>: η εικασία του Goldbach παραμένει ανοιχτό πρόβλημα, παρότι έχει ελεγχθεί για τεράστιους αριθμούς.`
        : first ? `<b style="color:#b3261e">Ο ισχυρισμός είναι ψευδής</b>: το πρώτο αντιπαράδειγμα είναι n = ${first[0]}, με ${first[1]} = ${dsaFactor(first[1]).join("·")}. ${first[0] > 10 ? `Οι πρώτες ${first[0] - n0} περιπτώσεις «επιβεβαιώνουν» τον ισχυρισμό — γι' αυτό ο έλεγχος περιπτώσεων δεν αποδεικνύει τίποτα.` : ""}`
        : `Στο διάστημα που ελέγχθηκε δεν υπάρχει αντιπαράδειγμα — μεγάλωσε το n.`;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 3.2 μαθηματική επαγωγή βήμα-βήμα ---------- */
  dsaInd(box) {
    const S = [
      { n: "1 + 2 + ⋯ + n = n(n + 1)/2", b: 1, L: k => k * (k + 1) / 2, Rr: k => k * (k + 1) / 2, a: k => k, tl: "\\sum_{i=1}^{n} i", tr: "\\frac{n(n + 1)}{2}", st: "\\frac{k(k + 1)}{2} + (k + 1) = \\frac{(k + 1)(k + 2)}{2}" },
      { n: "1 + 3 + ⋯ + (2n − 1) = n²", b: 1, L: k => k * k, Rr: k => k * k, a: k => 2 * k - 1, tl: "\\sum_{i=1}^{n} (2i - 1)", tr: "n^2", st: "k^2 + (2k + 1) = (k + 1)^2" },
      { n: "1² + 2² + ⋯ + n² = n(n + 1)(2n + 1)/6", b: 1, L: k => k * (k + 1) * (2 * k + 1) / 6, Rr: k => k * (k + 1) * (2 * k + 1) / 6, a: k => k * k, tl: "\\sum_{i=1}^{n} i^2", tr: "\\frac{n(n + 1)(2n + 1)}{6}", st: "\\frac{k(k + 1)(2k + 1)}{6} + (k + 1)^2 = \\frac{(k + 1)(2k^2 + 7k + 6)}{6} = \\frac{(k + 1)(k + 2)(2k + 3)}{6}" },
      { n: "1 + 2 + 4 + ⋯ + 2ⁿ = 2ⁿ⁺¹ − 1", b: 0, L: k => 2 ** (k + 1) - 1, Rr: k => 2 ** (k + 1) - 1, a: k => 2 ** k, tl: "\\sum_{i=0}^{n} 2^i", tr: "2^{n+1} - 1", st: "(2^{k+1} - 1) + 2^{k+1} = 2^{k+2} - 1" },
      { n: "2ⁿ > n² για n ≥ 5 (ανισότητα)", b: 5, ineq: true, L: k => 2 ** k, Rr: k => k * k, tl: "2^n", tr: "n^2", st: "2^{k+1} = 2\\cdot 2^k > 2k^2 = k^2 + k^2 \\ge k^2 + 5k > k^2 + 2k + 1 = (k + 1)^2 \\quad (k \\ge 5)" },
      { n: "3 | n³ + 2n (διαιρετότητα)", b: 1, div: true, L: k => k ** 3 + 2 * k, tl: "n^3 + 2n", st: "(k + 1)^3 + 2(k + 1) = (k^3 + 2k) + 3(k^2 + k + 1)" }
    ];
    box.innerHTML = `<style>.dsatt{border-collapse:collapse;margin:6px auto;font-size:14px}.dsatt th,.dsatt td{border:1px solid var(--line);padding:3px 8px;text-align:center}.dsatt th{background:#f3f6fb}.dsatt tr.hl td{background:#fff6d6}</style>
      <div class="wctl"><label>πρόταση P(n) <select class="ss">${S.map((s, i) => `<option value="${i}">${s.n}</option>`).join("")}</select></label></div>
      <div class="wctl"><label>επαγωγικό βήμα για k = <input type="range" class="rk" min="0" max="10" value="3"><b class="vk"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const s = S[+$(".ss", box).value], kmin = s.b; const rk = $(".rk", box); rk.min = kmin; rk.max = kmin + 9; if (+rk.value < kmin) rk.value = kmin; const k = +rk.value; $(".vk", box).textContent = k;
      let tb = `<div style="overflow-x:auto"><table class="dsatt"><tr><th>n</th><th>$${s.tl}$</th>${s.div ? "<th>÷ 3</th>" : `<th>$${s.tr}$</th>`}<th>P(n)</th></tr>`;
      for (let n = kmin; n <= kmin + 9; n++) {
        const l = s.L(n), r = s.div ? l / 3 : s.Rr(n), ok = s.div ? l % 3 === 0 : s.ineq ? l > r : l === r;
        tb += `<tr class="${n === k || n === k + 1 ? "hl" : ""}"><td>${n}</td><td>${l}</td><td>${r}</td><td style="color:${ok ? "#1d6b35" : "#b3261e"}">${ok ? "✓" : "✗"}</td></tr>`;
      }
      $(".pl", box).innerHTML = tb + `</table></div>`;
      let o = `<b>Βάση</b> (n = ${kmin}): ${s.div ? `${s.L(kmin)} = 3·${s.L(kmin) / 3} ✓` : s.ineq ? `${s.L(kmin)} > ${s.Rr(kmin)} ✓` : `${s.L(kmin)} = ${s.Rr(kmin)} ✓`}.<br>
        <b>Επαγωγικό βήμα</b>: υποθέτουμε ότι ισχύει η P(k) και δείχνουμε την P(k + 1): $$${s.st}$$`;
      if (!s.div && !s.ineq) o += `Αριθμητικά για k = ${k}: P(${k}) δίνει ${s.L(k)}· προσθέτουμε τον επόμενο όρο ${s.a(k + 1)} και παίρνουμε ${s.L(k + 1)}, όσο ακριβώς δίνει ο τύπος για n = ${k + 1}. ✓`;
      else if (s.div) o += `Για k = ${k}: ${s.L(k + 1)} = ${s.L(k)} + 3·${(k * k + k + 1)} — και οι δύο προσθετέοι διαιρούνται με το 3. ✓`;
      else o += `Για k = ${k}: $2^{${k + 1}} = ${2 ** (k + 1)} > ${(k + 1) ** 2} = ${k + 1}^2$ ✓ (Για n = 2, 3, 4 η ανισότητα <b>δεν</b> ισχύει — γι' αυτό η βάση είναι το 5.)`;
      $(".wout", box).innerHTML = o; typeset(box);
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  /* ---------- 3.3 ισχυρή επαγωγή και αναδρομικοί ορισμοί ---------- */
  dsaRec(box) {
    const S = ["Fibonacci: f₀ = 0, f₁ = 1, fₙ = fₙ₋₁ + fₙ₋₂", "Πύργοι του Ανόι: H₁ = 1, Hₙ = 2Hₙ₋₁ + 1", "Γραμματόσημα 4 και 5 λεπτών (n ≥ 12)", "Κάθε n ≥ 2 είναι γινόμενο πρώτων"];
    box.innerHTML = `<style>.dsatt{border-collapse:collapse;margin:6px auto;font-size:14px}.dsatt th,.dsatt td{border:1px solid var(--line);padding:3px 8px;text-align:center}.dsatt th{background:#f3f6fb}</style>
      <div class="wctl"><label>παράδειγμα <select class="ss">${S.map((s, i) => `<option value="${i}">${s}</option>`).join("")}</select></label><label>έως n = <input type="range" class="rn" min="6" max="20" value="10"><b class="vn"></b></label></div>
      <div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const t = +$(".ss", box).value, N = +$(".rn", box).value; $(".vn", box).textContent = N;
      let rows = "", head, o;
      if (t === 0) {
        head = "<th>n</th><th>fₙ</th><th>2ⁿ</th><th>fₙ < 2ⁿ</th>"; const f = [0, 1]; for (let i = 2; i <= N; i++) f.push(f[i - 1] + f[i - 2]);
        f.forEach((v, i) => rows += `<tr><td>${i}</td><td>${v}</td><td>${2 ** i}</td><td>✓</td></tr>`);
        o = `Ισχυρή επαγωγή: για να δείξουμε fₙ < 2ⁿ στο βήμα χρειαζόμαστε <b>δύο</b> προηγούμενες περιπτώσεις: f_{k+1} = f_k + f_{k−1} < 2^k + 2^{k−1} < 2^{k+1}. Γι' αυτό η βάση ελέγχει n = 0 και n = 1.`;
      } else if (t === 1) {
        head = "<th>n</th><th>Hₙ (αναδρομικά)</th><th>2ⁿ − 1</th>"; let h = 1; for (let i = 1; i <= N; i++) { if (i > 1) h = 2 * h + 1; rows += `<tr><td>${i}</td><td>${h}</td><td>${2 ** i - 1}</td></tr>`; }
        o = `Ο αναδρομικός ορισμός δίνει κάθε όρο από τον προηγούμενο. Η εικασία Hₙ = 2ⁿ − 1 αποδεικνύεται με (απλή) επαγωγή: H_{k+1} = 2(2^k − 1) + 1 = 2^{k+1} − 1.`;
      } else if (t === 2) {
        head = "<th>n</th><th>τρόπος</th><th>από</th>";
        for (let n = 12; n <= 12 + N; n++) { let a = -1; for (let x = 0; 4 * x <= n; x++) if ((n - 4 * x) % 5 === 0) { a = x; break; } rows += `<tr><td>${n}</td><td>${a} × 4 + ${(n - 4 * a) / 5} × 5</td><td>${n <= 15 ? "βάση" : `P(${n - 4}) + ένα 4άρι`}</td></tr>`; }
        o = `Ισχυρή επαγωγή: ελέγχουμε τις <b>τέσσερις</b> βάσεις P(12), P(13), P(14), P(15). Για k ≥ 15, το ποσό k + 1 = (k − 3) + 4 και το P(k − 3) ισχύει από την υπόθεση (12 ≤ k − 3 ≤ k).`;
      } else {
        head = "<th>n</th><th>ανάλυση</th><th>βήμα</th>";
        for (let n = 2; n <= N + 8; n++) { const f = dsaFactor(n); rows += `<tr><td>${n}</td><td>${f.join(" · ")}</td><td>${f.length === 1 ? "πρώτος" : `${f[0]} · ${n / f[0]}, και τα δύο < ${n}`}</td></tr>`; }
        o = `Ισχυρή επαγωγή: αν ο k + 1 δεν είναι πρώτος, τότε k + 1 = a·b με 2 ≤ a, b ≤ k, και από την υπόθεση (για <b>όλα</b> τα 2, …, k) οι a, b γράφονται ως γινόμενο πρώτων.`;
      }
      $(".pl", box).innerHTML = `<div style="overflow:auto;max-height:260px"><table class="dsatt"><tr>${head}</tr>${rows}</table></div>`;
      $(".wout", box).innerHTML = o;
    }
    box.querySelectorAll("input,select").forEach(i => i.oninput = i.onchange = draw); draw();
  }
});

/* ---------- γεννήτριες ---------- */
const dsaTemplates = ["(p → q) ∧ ¬r", "(p ∨ q) → r", "¬(p ∧ q) ↔ r", "(p ⊕ q) ∨ r", "p → (q ∧ r)", "(¬p ∨ q) ∧ (q → r)", "(p ↔ q) → ¬r", "(p ∧ ¬q) ∨ (q ∧ r)", "¬p → (q ∨ r)", "(p → r) ∧ (q ⊕ r)"];
const dsaSent = [["μελετάς", "δεν μελετάς", "περνάς το μάθημα", "δεν περνάς το μάθημα"], ["βρέχει", "δεν βρέχει", "το έδαφος είναι υγρό", "το έδαφος δεν είναι υγρό"], ["ο n είναι άρτιος", "ο n δεν είναι άρτιος", "ο n² είναι άρτιος", "ο n² δεν είναι άρτιος"], ["το πρόγραμμα έχει σφάλμα", "το πρόγραμμα δεν έχει σφάλμα", "ο μεταγλωττιστής βγάζει μήνυμα", "ο μεταγλωττιστής δεν βγάζει μήνυμα"], ["κάνει κρύο", "δεν κάνει κρύο", "ανάβω τη θέρμανση", "δεν ανάβω τη θέρμανση"]];
const dsaTex = s => dsaStr(dsaParse(s), true);

var GENS = Object.assign(window.GENS || {}, {
  dsaTT: { title: "Γεννήτρια — αποτίμηση τύπων", make() {
    const t = ri(0, 2), F = bkPick(dsaTemplates), f = dsaParse(F);
    if (t === 0) {
      const e = { p: ri(0, 1) === 1, q: ri(0, 1) === 1, r: ri(0, 1) === 1 }, v = dsaEval(f, e);
      const steps = dsaSubs(f).map(g => `$${dsaStr(g, true)} = ${dsaTV(dsaEval(g, e))}$`).join(", ");
      return { type: "mc", q: R`Αν $p = ${dsaTV(e.p)}$, $q = ${dsaTV(e.q)}$, $r = ${dsaTV(e.r)}$ (Α = αληθής, Ψ = ψευδής), ποια είναι η τιμή αληθείας του $${dsaStr(f, true)}$;`,
        options: ["Α", "Ψ"], correct: v ? 0 : 1, sol: R`Από μέσα προς τα έξω: ${steps}. Άρα ${dsaTV(v)}.` };
    }
    if (t === 1) {
      const n = dsaRows(["p", "q", "r"]).filter(e => dsaEval(f, e)).length;
      return { q: R`Σε πόσες από τις $8$ γραμμές του πίνακα αληθείας είναι αληθής ο τύπος $${dsaStr(f, true)}$;`, fields: [{ label: "γραμμές =", ans: n }],
        sol: R`Κατασκευάζουμε τον πίνακα (στήλες για κάθε υποτύπο). Ο τύπος είναι αληθής σε ${n} από τις 8 γραμμές${n === 8 ? " (ταυτολογία)" : n === 0 ? " (αντίφαση)" : ""}.` };
    }
    const [P, nP, Q, nQ] = bkPick(dsaSent), k = ri(0, 2), names = ["αντίστροφη", "αντίθετη", "αντιθετοαντίστροφη"], forms = [`Αν ${Q}, τότε ${P}.`, `Αν ${nP}, τότε ${nQ}.`, `Αν ${nQ}, τότε ${nP}.`];
    return bkMC({ q: R`Δίνεται η συνεπαγωγή «Αν ${P}, τότε ${Q}.» Ποια πρόταση είναι η <b>${names[k]}</b> αυτής της συνεπαγωγής;`,
      sol: R`Για $p \to q$: αντίστροφη $q \to p$, αντίθετη $\lnot p \to \lnot q$, αντιθετοαντίστροφη $\lnot q \to \lnot p$. Η ${names[k]} είναι «${forms[k]}»${k === 2 ? " — η μόνη από τις τρεις που είναι λογικά ισοδύναμη με την αρχική" : ""}.` },
      [forms[k], ...forms.filter((_, i) => i !== k), `${P[0].toUpperCase() + P.slice(1)} και ${nQ}.`], 0);
  } },

  dsaEq: { title: "Γεννήτρια — ισοδυναμίες και ταυτολογίες", make() {
    const t = ri(0, 1);
    if (t === 0) {
      const bank = ["(p ∧ q) → p", "p → (p ∨ q)", "((p → q) ∧ p) → q", "(¬q ∧ (p → q)) → ¬p", "(p → q) ∨ (q → p)", "p ∧ ¬p", "¬(p ∨ ¬p)", "(p → q) ∧ p ∧ ¬q", "(p ↔ q) ∧ (p ⊕ q)", "(p ∨ q) → p", "p → (p ∧ q)", "(p → q) → (q → p)", "(p ⊕ q) → p", "((p ∨ q) ∧ ¬p) → q", "(p → q) ↔ (¬q → ¬p)"];
      const F = bkPick(bank), f = dsaParse(F), c = dsaClass(f), nm = { taut: "Ταυτολογία", contr: "Αντίφαση", cont: "Ενδεχόμενη" };
      const vs = dsaVars(f), wit = dsaRows(vs).find(e => !dsaEval(f, e)), wt = dsaRows(vs).find(e => dsaEval(f, e)), ev = e => vs.map(v => `${v} = ${dsaTV(e[v])}`).join(", ");
      return bkMC({ q: R`Ο τύπος $${dsaStr(f, true)}$ είναι:`,
        sol: c === "taut" ? R`Αληθής σε κάθε γραμμή του πίνακα αληθείας: ταυτολογία.` : c === "contr" ? R`Ψευδής σε κάθε γραμμή: αντίφαση.` : R`Για ${ev(wt)} είναι αληθής, ενώ για ${ev(wit)} ψευδής: ενδεχόμενη.` },
        [nm[c], ...Object.keys(nm).filter(k => k !== c).map(k => nm[k])], 0);
    }
    const lit = () => { const v = bkPick(["p", "q", "r"]); return ri(0, 1) ? v : "¬" + v; };
    let a = lit(), b = lit(); while (a.replace("¬", "") === b.replace("¬", "")) b = lit();
    const op = bkPick(["∧", "∨", "→"]), F = `¬(${a} ${op} ${b})`, f = dsaParse(F), neg = x => x.startsWith("¬") ? x.slice(1) : "¬" + x;
    const cands = op === "∧" ? [`${neg(a)} ∨ ${neg(b)}`, `${neg(a)} ∧ ${neg(b)}`, `${a} ∨ ${b}`, `${neg(a)} ∨ ${b}`, `${a} ∧ ${neg(b)}`]
      : op === "∨" ? [`${neg(a)} ∧ ${neg(b)}`, `${neg(a)} ∨ ${neg(b)}`, `${a} ∧ ${b}`, `${neg(a)} ∧ ${b}`, `${a} ∨ ${neg(b)}`]
      : [`${a} ∧ ${neg(b)}`, `${neg(a)} → ${neg(b)}`, `${neg(a)} ∧ ${b}`, `${a} ∨ ${neg(b)}`, `${neg(a)} ∨ ${b}`];
    const clean = s => s.replace(/¬¬/g, ""), right = clean(cands[0]), wrong = [...new Set(cands.slice(1).map(clean))].filter(s => !dsaEquivF(dsaParse(s), f)).slice(0, 3);
    return bkMC({ q: R`Ποιος τύπος είναι λογικά ισοδύναμος με τον $${dsaStr(f, true)}$;`,
      sol: op === "→" ? R`$\lnot(x \to y) \equiv \lnot(\lnot x \lor y) \equiv x \land \lnot y$ (De Morgan). Άρα $${dsaTex(right)}$.` : R`Νόμος De Morgan: $\lnot(x ${op === "∧" ? "\\land" : "\\lor"} y) \equiv \lnot x ${op === "∧" ? "\\lor" : "\\land"} \lnot y$, και $\lnot\lnot x \equiv x$. Άρα $${dsaTex(right)}$.` },
      [`$${dsaTex(right)}$`, ...wrong.map(s => `$${dsaTex(s)}$`)], 0);
  } },

  dsaQ: { title: "Γεννήτρια — ποσοδείκτες σε πεπερασμένο σύμπαν", make() {
    const lo = bkPick([0, 1, 2, -2, -3]), hi = lo + ri(3, 5), D = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i), c = ri(lo + 1, hi + 2);
    const forms = [
      ["\\forall x\\, (x^2 > x)", () => D.every(x => x * x > x), () => { const z = D.find(x => !(x * x > x)); return z === undefined ? "ισχύει για κάθε $x \\in D$ (κανένα από τα $0, 1$ δεν ανήκει στο $D$)" : `αντιπαράδειγμα $x = ${z}$: $${z}^2 = ${z * z} \\not> ${z}$`; }],
      [`\\exists x\\, (x^2 = ${c})`, () => D.some(x => x * x === c), () => { const z = D.find(x => x * x === c); return z === undefined ? `κανένα στοιχείο του $D$ δεν έχει τετράγωνο $${c}$` : `μάρτυρας $x = ${z}$`; }],
      [`\\forall x\\, \\exists y\\, (x + y = ${c})`, () => D.every(x => D.includes(c - x)), () => { const z = D.find(x => !D.includes(c - x)); return z === undefined ? `για κάθε $x$ παίρνουμε $y = ${c === 0 ? "-x" : c + " - x"} \\in D$` : `για $x = ${z}$ θα χρειαζόταν $y = ${c - z} \\notin D$`; }],
      [`\\exists y\\, \\forall x\\, (x + y \\le ${c})`, () => hi + lo <= c, () => hi + lo <= c ? `μάρτυρας $y = ${lo}$: το μεγαλύτερο άθροισμα είναι $${hi} + (${lo}) = ${hi + lo} \\le ${c}$` : `ακόμη και με το μικρότερο $y = ${lo}$, το $x = ${hi}$ δίνει $${hi + lo} > ${c}$`],
      [`\\forall x\\, \\exists y\\, (x + y = 0)`, () => D.every(x => D.includes(-x)), () => { const z = D.find(x => !D.includes(-x)); return z === undefined ? "κάθε στοιχείο έχει τον αντίθετό του στο $D$" : `για $x = ${z}$ ο αντίθετος $${-z} \\notin D$`; }],
      [`\\exists x\\, (x^2 > ${c + 6})`, () => D.some(x => x * x > c + 6), () => { const z = D.find(x => x * x > c + 6); return z === undefined ? `το μεγαλύτερο τετράγωνο στο $D$ είναι $${Math.max(...D.map(x => x * x))} \\le ${c + 6}$` : `μάρτυρας $x = ${z}$: $${z * z} > ${c + 6}$`; }],
      [`\\exists x\\, \\forall y\\, (x\\cdot y = 0)`, () => D.includes(0), () => D.includes(0) ? `$x = 0$` : `το $0 \\notin D$, και για $x \\ne 0$ το $y = ${D.find(y => y !== 0)}$ δίνει $x y \\ne 0$`]
    ];
    const [s, ev, why] = bkPick(forms), v = ev();
    return { type: "mc", q: R`Με σύμπαν $D = \{${D.join(", ")}\}$, η πρόταση $${s}$ είναι αληθής.`, options: ["ΣΩΣΤΟ", "ΛΑΘΟΣ"], correct: v ? 0 : 1,
      sol: R`${v ? "Αληθής" : "Ψευδής"}: ${why()}.` };
  } },

  dsaInf: { title: "Γεννήτρια — κανόνες συμπερασμού", make() {
    const [P, nP, Q, nQ] = bkPick(dsaSent.filter((_, i) => i !== 2)), cap = s => s[0].toUpperCase() + s.slice(1);   /* όχι n/n²: εκεί τα «άκυρα» συμπεράσματα τυχαίνει να αληθεύουν */
    const F = [["Τρόπος του θέτειν (modus ponens)", `Αν ${P}, τότε ${Q}. ${cap(P)}. Άρα ${Q}.`, "p \\to q,\\ p \\vdash q"],
      ["Τρόπος του αναιρείν (modus tollens)", `Αν ${P}, τότε ${Q}. ${cap(nQ)}. Άρα ${nP}.`, "p \\to q,\\ \\lnot q \\vdash \\lnot p"],
      ["Διαζευκτικός συλλογισμός", `${cap(P)} ή ${Q}. ${cap(nP)}. Άρα ${Q}.`, "p \\lor q,\\ \\lnot p \\vdash q"],
      ["Πλάνη: επιβεβαίωση του επομένου", `Αν ${P}, τότε ${Q}. ${cap(Q)}. Άρα ${P}.`, "p \\to q,\\ q \\nvdash p"],
      ["Πλάνη: άρνηση του ηγουμένου", `Αν ${P}, τότε ${Q}. ${cap(nP)}. Άρα ${nQ}.`, "p \\to q,\\ \\lnot p \\nvdash \\lnot q"],
      ["Απλοποίηση", `${cap(P)} και ${Q}. Άρα ${P}.`, "p \\land q \\vdash p"]];
    const k = ri(0, F.length - 1), others = dsaSample(F.filter((_, i) => i !== k).map(x => x[0]), 3);
    return bkMC({ q: R`Το επιχείρημα «${F[k][1]}» είναι:`, sol: R`Σχήμα: $${F[k][2]}$ — ${F[k][0]}.${k === 3 || k === 4 ? " Δεν είναι έγκυρο: υπάρχει γραμμή του πίνακα αληθείας με αληθείς υποθέσεις και ψευδές συμπέρασμα." : " Έγκυρο επιχείρημα."}` }, [F[k][0], ...others], 0);
  } },

  dsaSet: { title: "Γεννήτρια — σύνολα και πληθάριθμοι", make() {
    const t = ri(0, 2);
    if (t === 0) {
      const A = dsaRandSet(1, 9, ri(3, 5)), B = dsaRandSet(1, 9, ri(3, 5)), u = [...new Set([...A, ...B])], i = A.filter(x => B.includes(x)), d = A.filter(x => !B.includes(x)), s = u.filter(x => !i.includes(x));
      return { q: R`Αν $A = ${dsaSetTex(A)}$ και $B = ${dsaSetTex(B)}$, να βρείτε τους πληθάριθμους $|A \cup B|$, $|A \cap B|$, $|A - B|$ και $|A \oplus B|$.`,
        fields: [{ label: "|A∪B| =", ans: u.length }, { label: "|A∩B| =", ans: i.length }, { label: "|A−B| =", ans: d.length }, { label: "|A⊕B| =", ans: s.length }],
        sol: R`$A \cap B = ${dsaSetTex(i)}$, $A \cup B = ${dsaSetTex(u.sort((x, y) => x - y))}$, $A - B = ${dsaSetTex(d)}$, $A \oplus B = (A \cup B) - (A \cap B) = ${dsaSetTex(s.sort((x, y) => x - y))}$. Έλεγχος: $|A \cup B| = |A| + |B| - |A \cap B| = ${A.length} + ${B.length} - ${i.length} = ${u.length}$.` };
    }
    if (t === 1) {
      const a = ri(2, 5), b = ri(2, 4);
      return { q: R`Αν $|A| = ${a}$ και $|B| = ${b}$, να βρείτε τους πληθάριθμους $|\mathcal P(A)|$, $|A \times B|$ και $|\mathcal P(B) \times B|$.`,
        fields: [{ label: "|P(A)| =", ans: 2 ** a }, { label: "|A×B| =", ans: a * b }, { label: "|P(B)×B| =", ans: 2 ** b * b }],
        sol: R`$|\mathcal P(A)| = 2^{${a}} = ${2 ** a}$ (κάθε στοιχείο είτε μπαίνει είτε όχι), $|A \times B| = ${a}\cdot ${b} = ${a * b}$, $|\mathcal P(B) \times B| = 2^{${b}}\cdot ${b} = ${2 ** b * b}$.` };
    }
    const x = ri(20, 45), y = ri(20, 45), z = ri(5, Math.min(x, y) - 3), n = ri(Math.max(60, x + y - z + 3), 120);
    return { q: R`Σε μια τάξη ${n} φοιτητών, ${x} παρακολουθούν Python, ${y} παρακολουθούν Java και ${z} παρακολουθούν και τα δύο. Πόσοι παρακολουθούν τουλάχιστον ένα από τα δύο και πόσοι κανένα;`,
      fields: [{ label: "τουλάχιστον ένα =", ans: x + y - z }, { label: "κανένα =", ans: n - (x + y - z) }],
      sol: R`$|P \cup J| = |P| + |J| - |P \cap J| = ${x} + ${y} - ${z} = ${x + y - z}$, και κανένα: $${n} - ${x + y - z} = ${n - x - y + z}$.` };
  } },

  dsaFn: { title: "Γεννήτρια — συναρτήσεις", make() {
    const t = ri(0, 3);
    if (t === 0) {
      const v = (ri(-40, 40) + bkPick([0.2, 0.5, 0.7])) / 10 * bkPick([1, 1, 10]), x = Math.round(v * 100) / 100;
      return { q: R`Να υπολογίσετε $\lfloor ${dsaDec(x)} \rfloor$ και $\lceil ${dsaDec(x)} \rceil$.`, fields: [{ label: "⌊x⌋ =", ans: Math.floor(x) }, { label: "⌈x⌉ =", ans: Math.ceil(x) }],
        sol: R`$\lfloor x\rfloor$: ο μεγαλύτερος ακέραιος $\le x$, άρα $${Math.floor(x)}$· $\lceil x\rceil$: ο μικρότερος ακέραιος $\ge x$, άρα $${Math.ceil(x)}$.${x < 0 ? " Προσοχή στους αρνητικούς: το κάτω ακέραιο μέρος πάει «προς τα αριστερά»." : ""}` };
    }
    if (t === 1) {
      const a = gyNZ(-4, 4), b = ri(-5, 5), c = ri(-5, 5), x = ri(-3, 3), g = x * x + c, f = v => a * v + b;
      return { q: R`Αν $f(x) = ${gyC(a)}${gyS(b)}$ και $g(x) = x^2${gyS(c)}$, να υπολογίσετε $(f \circ g)(${x})$ και $(g \circ f)(${x})$.`,
        fields: [{ label: "(f∘g) =", ans: f(g) }, { label: "(g∘f) =", ans: f(x) ** 2 + c }],
        sol: R`$(f \circ g)(${x}) = f(g(${x})) = f(${g}) = ${f(g)}$· $(g \circ f)(${x}) = g(f(${x})) = g(${f(x)}) = ${f(x) ** 2 + c}$. Γενικά $f \circ g \ne g \circ f$.` };
    }
    if (t === 2) {
      const a = gyNZ(-5, 5), b = ri(-6, 6), y = ri(-8, 8);
      return { q: R`Η συνάρτηση $f: \mathbb R \to \mathbb R$, $f(x) = ${gyC(a)}${gyS(b)}$ είναι αμφιμονοσήμαντη. Να βρείτε το $f^{-1}(${y})$.`, fields: [{ label: "f⁻¹ =", ans: fracS2(y - b, a) }],
        sol: R`$f^{-1}(${y})$ είναι το $x$ με $f(x) = ${y}$: $${gyC(a)}${gyS(b)} = ${y} \Rightarrow x = \frac{${y - b}}{${a}} = ${texFrac(y - b, a)}$.` };
    }
    const m = ri(2, 4), n = ri(m, 6);
    return { q: R`Έστω $|X| = ${m}$ και $|Y| = ${n}$. Πόσες συναρτήσεις $X \to Y$ υπάρχουν, και πόσες από αυτές είναι ένα-προς-ένα;`,
      fields: [{ label: "όλες =", ans: n ** m }, { label: "1-1 =", ans: dsaFact(n) / dsaFact(n - m) }],
      sol: R`Κάθε ένα από τα $${m}$ στοιχεία του $X$ έχει $${n}$ επιλογές: $${n}^{${m}} = ${n ** m}$. Για 1-1 οι επιλογές μειώνονται: $${Array.from({ length: m }, (_, i) => n - i).join("\\cdot ")} = ${dsaFact(n) / dsaFact(n - m)}$.` };
  } },

  dsaSm: { title: "Γεννήτρια — αθροίσματα", make() {
    const t = ri(0, 3);
    if (t === 0) { const a = gyNZ(-4, 6), b = ri(-5, 5), n = ri(8, 30), S = a * n * (n + 1) / 2 + b * n;
      return { q: R`Να υπολογίσετε το άθροισμα $\displaystyle\sum_{i=1}^{${n}} (${gyC(a, "i")}${gyS(b)})$.`, fields: [{ label: "=", ans: S }],
        sol: R`$\sum (${gyC(a, "i")}${gyS(b)}) = ${a}\sum i ${b < 0 ? "-" : "+"} ${Math.abs(b)}\cdot ${n} = ${a}\cdot\frac{${n}\cdot ${n + 1}}{2} ${b < 0 ? "-" : "+"} ${Math.abs(b * n)} = ${S}$.` }; }
    if (t === 1) { const c = ri(1, 5), r = bkPick([2, 3, -2]), n = ri(3, 7), S = c * (r ** (n + 1) - 1) / (r - 1);
      return { q: R`Να υπολογίσετε το $\displaystyle\sum_{i=0}^{${n}} ${c === 1 ? "" : c + "\\cdot "}${gyPar(r)}^i$.`, fields: [{ label: "=", ans: S }],
        sol: r === 2 ? R`Γεωμετρικό άθροισμα: $${c === 1 ? "" : c + "\\cdot "}\frac{2^{${n + 1}} - 1}{2 - 1} = ${c === 1 ? "" : c + "\\cdot "}${2 ** (n + 1) - 1} = ${S}$.` : R`Γεωμετρικό άθροισμα: $${c === 1 ? "" : c + "\\cdot "}\frac{${gyPar(r)}^{${n + 1}} - 1}{${r} - 1} = ${c === 1 ? "" : c + "\\cdot "}\frac{${r ** (n + 1) - 1}}{${r - 1}} = ${S}$.` }; }
    if (t === 2) { const n = ri(5, 20), sq = ri(0, 1), S = sq ? n * (n + 1) * (2 * n + 1) / 6 : (n * (n + 1) / 2) ** 2;
      return { q: R`Να υπολογίσετε το $\displaystyle\sum_{i=1}^{${n}} i^${sq ? 2 : 3}$.`, fields: [{ label: "=", ans: S }],
        sol: sq ? R`$\frac{n(n + 1)(2n + 1)}{6} = \frac{${n}\cdot ${n + 1}\cdot ${2 * n + 1}}{6} = ${S}$.` : R`$\left(\frac{n(n + 1)}{2}\right)^2 = ${n * (n + 1) / 2}^2 = ${S}$.` }; }
    const m = ri(2, 5), n = ri(2, 6), S = n * m * (m + 1) / 2 + m * n * (n + 1) / 2;
    return { q: R`Να υπολογίσετε το διπλό άθροισμα $\displaystyle\sum_{i=1}^{${m}}\sum_{j=1}^{${n}} (i + j)$.`, fields: [{ label: "=", ans: S }],
      sol: R`Εσωτερικό: $\sum_{j=1}^{${n}} (i + j) = ${n}i + ${n * (n + 1) / 2}$. Εξωτερικό: $\sum_{i=1}^{${m}} (${n}i + ${n * (n + 1) / 2}) = ${n}\cdot ${m * (m + 1) / 2} + ${m}\cdot ${n * (n + 1) / 2} = ${S}$.` };
  } },

  dsaPf: { title: "Γεννήτρια — αποδείξεις και αντιπαραδείγματα", make() {
    const t = ri(0, 1);
    if (t === 0) {
      const [s, c] = bkPick([[1, 11], [1, 17], [1, 41], [-1, 11], [-1, 17], [-1, 41], [1, 5], [1, 3]]); let n = 1; while (dsaIsPrime(n * n + s * n + c)) n++;
      const v = n * n + s * n + c;
      return { q: R`Ο ισχυρισμός «για κάθε θετικό ακέραιο $n$, ο $n^2 ${s > 0 ? "+" : "-"} n + ${c}$ είναι πρώτος» είναι ψευδής. Ποιο είναι το μικρότερο αντιπαράδειγμα $n$;`, fields: [{ label: "n =", ans: n }],
        sol: R`Ελέγχουμε $n = 1, 2, \dots$: για $n = ${n}$ παίρνουμε $${v} = ${dsaFactor(v).join("\\cdot ")}$, σύνθετο${n > 3 ? `, ενώ για όλα τα μικρότερα $n$ ο αριθμός είναι πρώτος` : ""}. Ένα αντιπαράδειγμα αρκεί για να καταρρίψει έναν καθολικό ισχυρισμό.` };
    }
    const B = [["Αν ο $n^2$ είναι περιττός, τότε ο $n$ είναι περιττός.", "Με αντιθετοαντιστροφή", "Δείχνουμε: αν ο $n$ είναι άρτιος ($n = 2k$), τότε $n^2 = 4k^2$ άρτιος."],
      ["Ο $\\sqrt 2$ είναι άρρητος.", "Με απαγωγή σε άτοπο", "Υποθέτουμε $\\sqrt2 = a/b$ ανάγωγο· τότε $a^2 = 2b^2$, άρα $a$ και $b$ άρτιοι — άτοπο."],
      ["Για κάθε πραγματικό $x$ ισχύει $|x| \\ge x$.", "Με απόδειξη κατά περιπτώσεις", "Περιπτώσεις $x \\ge 0$ (ισότητα) και $x < 0$ ($|x| > 0 > x$)."],
      ["Κάθε πρώτος αριθμός είναι περιττός.", "Με αντιπαράδειγμα (ο ισχυρισμός είναι ψευδής)", "Ο $2$ είναι πρώτος και άρτιος."],
      ["Αν ο $n$ είναι άρτιος, τότε ο $n^2 + 3n$ είναι άρτιος.", "Με ευθεία απόδειξη", "$n = 2k \\Rightarrow n^2 + 3n = 4k^2 + 6k = 2(2k^2 + 3k)$."],
      ["Υπάρχουν άπειροι πρώτοι αριθμοί.", "Με απαγωγή σε άτοπο", "Αν $p_1, \\dots, p_k$ ήταν όλοι, ο $p_1\\cdots p_k + 1$ δεν διαιρείται από κανέναν — άτοπο (Ευκλείδης)."]];
    const [st, m, w] = bkPick(B), all = ["Με ευθεία απόδειξη", "Με αντιθετοαντιστροφή", "Με απαγωγή σε άτοπο", "Με απόδειξη κατά περιπτώσεις", "Με αντιπαράδειγμα (ο ισχυρισμός είναι ψευδής)"];
    const why = { "Με ευθεία απόδειξη": "ξεκινάμε από την υπόθεση και φτάνουμε απευθείας στο συμπέρασμα.", "Με αντιθετοαντιστροφή": "αποδεικνύεται η ισοδύναμη πρόταση $\\lnot q \\to \\lnot p$.", "Με απαγωγή σε άτοπο": "υποθέτουμε την άρνηση του ισχυρισμού και καταλήγουμε σε αντίφαση.", "Με απόδειξη κατά περιπτώσεις": "εξαντλούμε όλες τις δυνατές περιπτώσεις και ο ισχυρισμός ισχύει σε καθεμία.", "Με αντιπαράδειγμα (ο ισχυρισμός είναι ψευδής)": "ένα μόνο αντιπαράδειγμα αρκεί για να δείξει ότι μια καθολική πρόταση είναι ψευδής." }[m];
    return bkMC({ q: R`Πρόταση: «${st}»<br><i>Επιχείρημα:</i> ${w}<br>Ποια μέθοδος χρησιμοποιείται στο παραπάνω επιχείρημα;`, sol: R`${m}: ${why}` }, [m, ...dsaSample(all.filter(x => x !== m), 3)], 0);
  } },

  dsaIn: { title: "Γεννήτρια — μαθηματική επαγωγή", make() {
    const t = ri(0, 2);
    if (t === 0) {
      const K = ri(3, 12), S = bkPick([["i(i + 1)", "\\frac{n(n + 1)(n + 2)}{3}", k => (k + 1) * (k + 2), k => `${k + 1}\\cdot ${k + 2}`], ["i^2", "\\frac{n(n + 1)(2n + 1)}{6}", k => (k + 1) ** 2, k => `${k + 1}^2`], ["(2i - 1)", "n^2", k => 2 * k + 1, k => `2\\cdot ${k + 1} - 1`], ["i\\cdot 2^i", "(n - 1)2^{n+1} + 2", k => (k + 1) * 2 ** (k + 1), k => `${k + 1}\\cdot 2^{${k + 1}}`]]);
      return { q: R`Αποδεικνύουμε με επαγωγή ότι $\sum_{i=1}^{n} ${S[0]} = ${S[1]}$. Στο επαγωγικό βήμα από $n = ${K}$ σε $n = ${K + 1}$, ποιος όρος προστίθεται στο αριστερό μέλος (ως αριθμός);`, fields: [{ label: "όρος =", ans: S[2](K) }],
        sol: R`$\sum_{i=1}^{${K + 1}} = \sum_{i=1}^{${K}} + a_{${K + 1}}$, με $a_{${K + 1}} = ${S[3](K)} = ${S[2](K)}$. Μετά χρησιμοποιούμε την επαγωγική υπόθεση για το $\sum_{i=1}^{${K}}$.` };
    }
    if (t === 1) {
      const a = ri(3, 9), N = ri(3, 5), q = (a ** N - 1) / (a - 1);
      return { q: R`Με επαγωγή αποδεικνύεται ότι ο $${a}^n - 1$ διαιρείται με το $${a - 1}$ για κάθε $n \ge 1$. Να βρείτε το πηλίκο $\dfrac{${a}^{${N}} - 1}{${a - 1}}$.`, fields: [{ label: "πηλίκο =", ans: q }],
        sol: R`$\frac{a^n - 1}{a - 1} = 1 + a + \dots + a^{n-1}$, άρα $${Array.from({ length: N }, (_, i) => i === 0 ? "1" : i === 1 ? a : `${a}^{${i}}`).join(" + ")} = ${q}$. (Βήμα επαγωγής: $a^{k+1} - 1 = a(a^k - 1) + (a - 1)$.)` };
    }
    const [lab, L, Rr, desc] = bkPick([["2^n > n^2", n => 2 ** n, n => n * n, "εκθετική > τετραγωνική"], ["2^n > 3n", n => 2 ** n, n => 3 * n, "εκθετική > γραμμική"], ["n! > 2^n", n => dsaFact(n), n => 2 ** n, "παραγοντικό > εκθετική"], ["3^n > n^3", n => 3 ** n, n => n ** 3, "εκθετική > κυβική"], ["n! > 3^n", n => dsaFact(n), n => 3 ** n, "παραγοντικό > εκθετική"]]);
    let n0 = 30; for (let n = 30; n >= 1; n--) { if (L(n) > Rr(n)) n0 = n; else break; }
    return { q: R`Ποιος είναι ο μικρότερος φυσικός $n_0$ ώστε η ανισότητα $${lab}$ να ισχύει για <b>κάθε</b> $n \ge n_0$; (Αυτός θα είναι η βάση της επαγωγής.)`, fields: [{ label: "n₀ =", ans: n0 }],
      sol: R`Για $n = ${n0 - 1}$: $${L(n0 - 1)} ${L(n0 - 1) > Rr(n0 - 1) ? ">" : "\\le"} ${Rr(n0 - 1)}$ (αποτυγχάνει), ενώ για $n = ${n0}$: $${L(n0)} > ${Rr(n0)}$. Από εκεί και πέρα η αριστερή πλευρά (${desc}) μεγαλώνει ταχύτερα, και το επαγωγικό βήμα το αποδεικνύει.` };
  } },

  dsaRc: { title: "Γεννήτρια — αναδρομικοί ορισμοί και ισχυρή επαγωγή", make() {
    const t = ri(0, 2);
    if (t === 0) {
      const s = ri(-2, 4), c = bkPick([2, 3, -1, -2]), d = ri(-3, 4), N = ri(4, 6); let a = s; const seq = [a]; for (let i = 1; i <= N; i++) { a = c * a + d; seq.push(a); }
      return { q: R`Η ακολουθία ορίζεται αναδρομικά: $a_0 = ${s}$, $a_n = ${gyC(c, "a_{n-1}")}${gyS(d)}$ για $n \ge 1$. Να βρείτε τον όρο $a_{${N}}$.`, fields: [{ label: `a${N} =`, ans: a }],
        sol: R`$${seq.map((v, i) => `a_{${i}} = ${v}`).join(",\\ ")}$.` };
    }
    if (t === 1) {
      const a0 = ri(1, 4), a1 = ri(1, 5), N = ri(6, 9), f = [a0, a1]; for (let i = 2; i <= N; i++) f.push(f[i - 1] + f[i - 2]);
      return { q: R`Αν $b_0 = ${a0}$, $b_1 = ${a1}$ και $b_n = b_{n-1} + b_{n-2}$ για $n \ge 2$, να βρείτε τον $b_{${N}}$.`, fields: [{ label: `b${N} =`, ans: f[N] }],
        sol: R`$${f.join(", ")}$ — κάθε όρος είναι άθροισμα των δύο προηγούμενων, άρα $b_{${N}} = ${f[N]}$.` };
    }
    const [p, q] = bkPick([[3, 5], [4, 5], [3, 7], [5, 7], [4, 7], [3, 8]]), F = p * q - p - q;
    return { q: R`Με γραμματόσημα των $${p}$ και των $${q}$ λεπτών, ποιο είναι το <b>μεγαλύτερο</b> ποσό που <b>δεν</b> μπορεί να σχηματιστεί; (Από το επόμενο και πάνω, ισχυρή επαγωγή με ${p} βάσεις δείχνει ότι σχηματίζονται όλα.)`, fields: [{ label: "ποσό =", ans: F }],
      sol: R`Ελέγχοντας τα ποσά, το $${F}$ δεν γράφεται ως $${p}x + ${q}y$ με $x, y \ge 0$, ενώ τα $${F + 1}, \dots, ${F + p}$ γράφονται (${p} διαδοχικά ποσά = οι βάσεις). Για κάθε μεγαλύτερο ποσό $k + 1$ χρησιμοποιούμε το $k + 1 - ${p}$ και προσθέτουμε ένα γραμματόσημο των $${p}$. (Γενικά: $pq - p - q = ${F}$.)` };
  } }
});

/* ================= ΕΠΛ111 Διακριτές Δομές — widgets & γεννήτριες (Κεφ. 4–7) ================= */
const dsbF = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
const dsbC = (n, k) => { if (k < 0 || k > n) return 0; k = Math.min(k, n - k); let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
const dsbP = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r *= n - i; return r; };
const dsbD = n => { let a = 1, b = 0; if (n === 0) return 1; for (let i = 2; i <= n; i++) { const c = (i - 1) * (a + b); a = b; b = c; } return b; };
const dsbN = x => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");          /* χωριστικό χιλιάδων για KaTeX */
const dsbGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const dsbLcm = (a, b) => a / dsbGcd(a, b) * b;
const dsbPw = (b, e) => e === 0 ? "1" : e === 1 ? `${b}` : `${b}^{${e}}`;
/* όρος a·x^e χωρίς «1x» / «x^1» */
const dsbMono = (c, v, e) => { if (c === 0) return "0"; const pv = e === 0 ? "" : e === 1 ? v : `${v}^{${e}}`; if (!pv) return String(c); return (c === 1 ? "" : c === -1 ? "-" : c) + pv; };

/* ---------- κοινό: σχεδίαση γραφήματος σε SVG ---------- */
function dsbDrawGraph(svg, pos, edges, opt = {}) {
  const hl = opt.hl || new Set(), vcol = opt.vcol || (() => "#fff"), lab = opt.lab || (i => String(i + 1));
  edges.forEach(([a, b], k) => {
    const [x1, y1] = pos[a], [x2, y2] = pos[b];
    const par = edges.slice(0, k).filter(([c, d]) => (c === a && d === b) || (c === b && d === a)).length;
    if (par === 0) gyAdd(svg, "line", { x1, y1, x2, y2, style: `stroke:${hl.has(k) ? "#e8590c" : "#33507a"};stroke-width:${hl.has(k) ? 4 : 2.2}` });
    else { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = y2 - y1, dy = x1 - x2, L = Math.hypot(dx, dy) || 1, s = (par % 2 ? 1 : -1) * 22 * Math.ceil(par / 2);
      gyAdd(svg, "path", { d: `M${x1},${y1} Q${mx + dx / L * s},${my + dy / L * s} ${x2},${y2}`, style: `fill:none;stroke:${hl.has(k) ? "#e8590c" : "#33507a"};stroke-width:${hl.has(k) ? 4 : 2.2}` }); }
  });
  pos.forEach(([x, y], i) => { gyAdd(svg, "circle", { cx: x, cy: y, r: 15, style: `fill:${vcol(i)};stroke:#1d3557;stroke-width:2` }); gyAdd(svg, "text", { x, y: y + 5, "text-anchor": "middle", style: gyTS }, lab(i)); });
}
const dsbCirc = (n, cx = 280, cy = 140, r = 105) => Array.from({ length: n }, (_, i) => [cx + r * Math.sin(2 * Math.PI * i / n), cy - r * Math.cos(2 * Math.PI * i / n)]);
const dsbComps = (n, edges) => { const p = [...Array(n).keys()], f = x => p[x] === x ? x : (p[x] = f(p[x])); edges.forEach(([a, b]) => p[f(a)] = f(b)); const s = new Set(); for (let i = 0; i < n; i++) s.add(f(i)); return s.size; };
/* προκαθορισμένα γραφήματα */
const DSB_G = {
  "K4": () => { const e = []; for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) e.push([i, j]); return { n: 4, e, pos: dsbCirc(4) }; },
  "K5": () => { const e = []; for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) e.push([i, j]); return { n: 5, e, pos: dsbCirc(5) }; },
  "C6": () => ({ n: 6, e: [0, 1, 2, 3, 4, 5].map(i => [i, (i + 1) % 6]), pos: dsbCirc(6) }),
  "W5": () => ({ n: 6, e: [0, 1, 2, 3, 4].map(i => [i, (i + 1) % 5]).concat([0, 1, 2, 3, 4].map(i => [i, 5])), pos: dsbCirc(5).concat([[280, 140]]) }),
  "K3,3": () => { const e = []; for (let i = 0; i < 3; i++) for (let j = 3; j < 6; j++) e.push([i, j]); return { n: 6, e, pos: [[160, 50], [280, 50], [400, 50], [160, 230], [280, 230], [400, 230]] }; },
  "Q3": () => { const e = []; for (let i = 0; i < 8; i++) for (let b = 0; b < 3; b++) { const j = i ^ (1 << b); if (i < j) e.push([i, j]); }
    return { n: 8, e, pos: [[170, 220], [330, 220], [170, 70], [330, 70], [230, 175], [390, 175], [230, 25], [390, 25]].map(([x, y]) => [x, y + 20]) }; },
  "Σπίτι": () => ({ n: 5, e: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4]], pos: [[220, 120], [340, 120], [340, 240], [220, 240], [280, 40]] }),
  "Königsberg": () => ({ n: 4, e: [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3], [1, 3], [2, 3]], pos: [[220, 140], [220, 40], [220, 245], [390, 140]] }),
  "Δύο τρίγωνα": () => ({ n: 6, e: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]], pos: [[140, 60], [220, 220], [60, 220], [420, 60], [500, 220], [340, 220]] }),
  "Δέντρο": () => ({ n: 7, e: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]], pos: [[280, 35], [170, 130], [390, 130], [110, 235], [230, 235], [330, 235], [450, 235]] })
};

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  /* ---------- 4.1 αρχή του περιστερώνα ---------- */
  dsbpigeon(box) {
    box.innerHTML = `<div class="wctl"><label>αντικείμενα N <input type="range" class="rN" min="1" max="40" value="13"><b class="vN"></b></label>
      <label>κουτιά k <input type="range" class="rk" min="1" max="12" value="4"><b class="vk"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const N = +$(".rN", box).value, k = +$(".rk", box).value; $(".vN", box).textContent = N; $(".vk", box).textContent = k;
      const svg = gyCanvas(box, 560, 230), w = 520 / k, cnt = Array(k).fill(0); for (let i = 0; i < N; i++) cnt[i % k]++;
      const mx = Math.max(...cnt), r = Math.min(8, w / 5);
      for (let j = 0; j < k; j++) {
        const x = 20 + j * w; gyAdd(svg, "rect", { x: x + 3, y: 30, width: w - 6, height: 175, rx: 8, style: `fill:${cnt[j] === mx ? "rgba(232,89,12,.12)" : "#f4f7fb"};stroke:#9fb3cc` });
        for (let t = 0; t < cnt[j]; t++) { const per = Math.max(1, Math.floor((w - 10) / (2 * r + 3))), cx = x + 8 + r + (t % per) * (2 * r + 3), cy = 195 - r - Math.floor(t / per) * (2 * r + 3);
          if (cy > 35) gyAdd(svg, "circle", { cx, cy, r, style: "fill:#2f6fde" }); }
        gyAdd(svg, "text", { x: x + w / 2, y: 22, "text-anchor": "middle", style: gyTS }, String(cnt[j]));
      }
      $(".wout", box).innerHTML = `Τοποθετούμε τα αντικείμενα όσο πιο «ομοιόμορφα» γίνεται. Ακόμη και τότε κάποιο κουτί έχει $\\lceil N/k\\rceil = \\lceil ${N}/${k}\\rceil = ${Math.ceil(N / k)}$ αντικείμενα.
        <br>Για να είναι <b>βέβαιο</b> ότι κάποιο κουτί έχει τουλάχιστον $r = ${Math.ceil(N / k) + 1}$ αντικείμενα χρειάζονται $N = k(r - 1) + 1 = ${k * Math.ceil(N / k) + 1}$.`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 4.2 διατάξεις / συνδυασμοί ---------- */
  dsbperm(box) {
    box.innerHTML = `<div class="wctl"><label>n <input type="range" class="rn" min="1" max="12" value="6"><b class="vn"></b></label>
      <label>r <input type="range" class="rr" min="0" max="12" value="3"><b class="vr"></b></label></div><div class="pl" style="overflow-x:auto"></div><div class="wout"></div>`;
    function draw() {
      const n = +$(".rn", box).value; let r = +$(".rr", box).value; $(".vn", box).textContent = n; $(".vr", box).textContent = r;
      const rr = Math.min(r, n);
      $(".pl", box).innerHTML = `<table class="tbl" style="margin:auto;border-spacing:14px 8px;border-collapse:separate"><tr><th></th><th>με σειρά</th><th>χωρίς σειρά</th></tr>
        <tr><td>χωρίς επαν.</td><td>${r <= n ? `$P(${n},${r}) = ${dsbN(dsbP(n, r))}$` : "— ($r > n$)"}</td><td>${r <= n ? `$\\binom{${n}}{${r}} = ${dsbN(dsbC(n, r))}$` : "— ($r > n$)"}</td></tr>
        <tr><td>με επαν.</td><td>$${n}^{${r}} = ${dsbN(n ** r)}$</td><td>$\\binom{${n + r - 1}}{${r}} = ${dsbN(dsbC(n + r - 1, r))}$</td></tr></table>`;
      typeset($(".pl", box));
      $(".wout", box).innerHTML = r <= n ? `Κάθε συνδυασμός $r$ στοιχείων διατάσσεται με $${r}! = ${dsbN(dsbF(r))}$ τρόπους, γι' αυτό $P(${n},${r}) = ${r}!\\binom{${n}}{${r}}$. ${rr === n ? "Για $r = n$ οι διατάξεις είναι οι μεταθέσεις $n!$." : ""}`
        : `Χωρίς επανάληψη δεν μπορούμε να διαλέξουμε $r > n$ διαφορετικά στοιχεία· με επανάληψη μπορούμε.`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 4.3 τρίγωνο Pascal ---------- */
  dsbpascal(box) {
    box.innerHTML = `<div class="wctl"><label>γραμμή n <input type="range" class="rn" min="1" max="10" value="5"><b class="vn"></b></label>
      <label>θέση k <input type="range" class="rk" min="0" max="10" value="2"><b class="vk"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const n = +$(".rn", box).value, k = Math.min(+$(".rk", box).value, n); $(".vn", box).textContent = n; $(".vk", box).textContent = k;
      const svg = gyCanvas(box, 560, 300), dy = 26;
      for (let i = 0; i <= 10; i++) for (let j = 0; j <= i; j++) {
        const x = 280 + (j - i / 2) * 46, y = 22 + i * dy, on = i === n && j === k, par = i === n - 1 && (j === k - 1 || j === k), row = i === n;
        gyAdd(svg, "text", { x, y, "text-anchor": "middle", style: `font-family:var(--sans);font-weight:${on || par ? 900 : row ? 800 : 500};font-size:${dsbC(i, j) > 99 ? 12 : 14}px;fill:${on ? "#e8590c" : par ? "#2f6fde" : row ? "#1d3557" : "#9aa7bb"}` }, String(dsbC(i, j)));
      }
      const terms = []; for (let j = 0; j <= n; j++) { const c = dsbC(n, j), xp = n - j, yp = j; terms.push(`${c === 1 ? "" : c}${xp ? (xp === 1 ? "x" : `x^{${xp}}`) : ""}${yp ? (yp === 1 ? "y" : `y^{${yp}}`) : ""}`); }
      $(".wout", box).innerHTML = `$(x + y)^{${n}} = ${terms.join(" + ")}$<br>
        ${k >= 1 && k <= n - 1 ? `Pascal: $\\binom{${n}}{${k}} = \\binom{${n - 1}}{${k - 1}} + \\binom{${n - 1}}{${k}} = ${dsbC(n - 1, k - 1)} + ${dsbC(n - 1, k)} = ${dsbC(n, k)}$ (μπλε + μπλε = πορτοκαλί).` : `$\\binom{${n}}{${k}} = 1$ (άκρο της γραμμής).`}
        Άθροισμα της γραμμής: $2^{${n}} = ${2 ** n}$.`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 4.4 εγκλεισμός–αποκλεισμός (διαιρετότητα) ---------- */
  dsbincl(box) {
    box.innerHTML = `<div class="wctl"><label>N <input type="range" class="rN" min="10" max="300" step="10" value="100"><b class="vN"></b></label>
      <label>a <input type="range" class="ra" min="2" max="9" value="2"><b class="va"></b></label><label>b <input type="range" class="rb" min="2" max="9" value="3"><b class="vb"></b></label>
      <label>c <input type="range" class="rc" min="2" max="9" value="5"><b class="vc"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const g = k => +$(".r" + k, box).value, N = g("N"), a = g("a"), b = g("b"), c = g("c"); ["N", "a", "b", "c"].forEach(k => $(".v" + k, box).textContent = g(k));
      const f = d => Math.floor(N / d), ab = dsbLcm(a, b), ac = dsbLcm(a, c), bc = dsbLcm(b, c), abc = dsbLcm(ab, c);
      const U = f(a) + f(b) + f(c) - f(ab) - f(ac) - f(bc) + f(abc);
      let brute = 0; for (let m = 1; m <= N; m++) if (m % a === 0 || m % b === 0 || m % c === 0) brute++;
      const svg = gyCanvas(box, 560, 262), C = [[220, 95, "#2f6fde", a], [340, 95, "#2a9d55", b], [280, 160, "#e8590c", c]];
      C.forEach(([x, y, col]) => gyAdd(svg, "circle", { cx: x, cy: y, r: 75, style: `fill:${col};fill-opacity:.13;stroke:${col};stroke-width:2` }));
      const ex = (s, d) => { let q = 0; for (let m = 1; m <= N; m++) { const A = m % a === 0, B = m % b === 0, Cc = m % c === 0; if (A === s[0] && B === s[1] && Cc === s[2]) q++; } return q; };
      [[[1, 0, 0], 175, 75], [[0, 1, 0], 385, 75], [[0, 0, 1], 280, 205], [[1, 1, 0], 280, 70], [[1, 0, 1], 225, 155], [[0, 1, 1], 335, 155], [[1, 1, 1], 280, 120]].forEach(([s, x, y]) =>
        gyAdd(svg, "text", { x, y, "text-anchor": "middle", style: gyTS }, String(ex(s.map(Boolean)))));
      [["a", 140, 25, a], ["b", 420, 25, b], ["c", 280, 228, c]].forEach(([t, x, y, v]) => gyAdd(svg, "text", { x: t === "c" ? 380 : x, y: t === "c" ? 245 : y, "text-anchor": "middle", style: gyTS + ";fill:#555" }, `÷${v}`));
      $(".wout", box).innerHTML = `$|A\\cup B\\cup C| = ${f(a)} + ${f(b)} + ${f(c)} - ${f(ab)} - ${f(ac)} - ${f(bc)} + ${f(abc)} = ${U}$ (ΕΚΠ: $${ab}, ${ac}, ${bc}, ${abc}$).
        <br>Έλεγχος με μέτρηση: ${brute} ✓ · Δεν διαιρούνται με κανέναν: $${N} - ${U} = ${N - U}$.`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 5.1 αναδρομικές σχέσεις: πρότυπα ---------- */
  dsbrec(box) { dsbRecWidget(box, 0); },
  /* ---------- 5.2 χαρακτηριστική εξίσωση ---------- */
  dsbrec2(box) { dsbRecWidget(box, 3); },

  /* ---------- 6.1 σχέσεις: πίνακας ---------- */
  dsbrel(box) {
    const n = 4; let M = [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    const P = { "ισοδυναμίας": [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], "≤": [[1, 1, 1, 1], [0, 1, 1, 1], [0, 0, 1, 1], [0, 0, 0, 1]], "<": [[0, 1, 1, 1], [0, 0, 1, 1], [0, 0, 0, 1], [0, 0, 0, 0]], "κενή": [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], "τυχαία": null };
    box.innerHTML = `<div class="wctl"><label>έτοιμη <select class="sp">${Object.keys(P).map(k => `<option>${k}</option>`).join("")}</select></label></div>
      <div class="pl" style="text-align:center"></div><div class="wout"></div>`;
    function props() {
      const r = [...Array(n).keys()].every(i => M[i][i]), s = M.every((row, i) => row.every((v, j) => v === M[j][i]));
      let a = true; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j && M[i][j] && M[j][i]) a = false;
      let t = true; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) if (M[i][j] && M[j][k] && !M[i][k]) t = false;
      return { r, s, a, t };
    }
    function draw() {
      const grid = `<table style="margin:auto;border-collapse:collapse">${M.map((row, i) => `<tr><th style="padding:4px 8px">${i + 1}</th>${row.map((v, j) => `<td style="padding:2px"><label style="display:inline-flex;width:34px;height:34px;align-items:center;justify-content:center;border-radius:7px;border:1px solid #9fb3cc;background:${v ? "#2f6fde" : "#fff"};color:${v ? "#fff" : "#999"};font-weight:800;cursor:pointer"><input type="checkbox" data-i="${i}" data-j="${j}" ${v ? "checked" : ""} style="display:none">${v}</label></td>`).join("")}</tr>`).join("")}
        <tr><th></th>${[1, 2, 3, 4].map(j => `<th>${j}</th>`).join("")}</tr></table><div class="muted" style="font-size:13px">Πάτησε ένα κελί για να προσθέσεις/αφαιρέσεις το ζεύγος $(i, j)$.</div>`;
      $(".pl", box).innerHTML = grid; typeset($(".pl", box));
      box.querySelectorAll("input[type=checkbox]").forEach(cb => cb.onchange = () => { M[+cb.dataset.i][+cb.dataset.j] = cb.checked ? 1 : 0; draw(); });
      const p = props(), ok = b => b ? "✔" : "✘", pairs = []; M.forEach((row, i) => row.forEach((v, j) => { if (v) pairs.push(`(${i + 1},${j + 1})`); }));
      let extra = "";
      if (p.r && p.s && p.t) { const cls = []; const seen = new Set(); for (let i = 0; i < n; i++) if (!seen.has(i)) { const c = []; for (let j = 0; j < n; j++) if (M[i][j]) { c.push(j + 1); seen.add(j); } cls.push(`\\{${c.join(",")}\\}`); } extra = `<br><b>Σχέση ισοδυναμίας</b>, κλάσεις: $${cls.join(",\\ ")}$.`; }
      else if (p.r && p.a && p.t) extra = "<br><b>Μερική διάταξη.</b>";
      $(".wout", box).innerHTML = `$R = \\{${pairs.join(", ") || "\\,"}\\}$ ($|R| = ${pairs.length}$)<br>ανακλαστική ${ok(p.r)} · συμμετρική ${ok(p.s)} · αντισυμμετρική ${ok(p.a)} · μεταβατική ${ok(p.t)}${extra}`;
      typeset($(".wout", box));
    }
    $(".sp", box).onchange = () => { const k = $(".sp", box).value; M = P[k] ? P[k].map(r => r.slice()) : Array.from({ length: n }, () => Array.from({ length: n }, () => Math.random() < .4 ? 1 : 0)); draw(); };
    draw();
  },

  /* ---------- 6.2 κλάσεις υπολοίπων ---------- */
  dsbmod(box) {
    box.innerHTML = `<div class="wctl"><label>m <input type="range" class="rm" min="2" max="7" value="4"><b class="vm"></b></label>
      <label>a <input type="range" class="ra" min="-12" max="12" value="-3"><b class="va"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    const col = ["#2f6fde", "#2a9d55", "#e8590c", "#9b5de5", "#d6336c", "#0d9488", "#b08900"];
    function draw() {
      const m = +$(".rm", box).value, a = +$(".ra", box).value; $(".vm", box).textContent = m; $(".va", box).textContent = a;
      const svg = gyCanvas(box, 560, 120), ra = ((a % m) + m) % m;
      for (let x = -12; x <= 12; x++) { const px = 280 + x * 21.5, r = ((x % m) + m) % m, on = r === ra;
        gyAdd(svg, "circle", { cx: px, cy: 50, r: on ? 10 : 8, style: `fill:${col[r]};fill-opacity:${on ? 1 : .35};stroke:${x === a ? "#000" : "none"};stroke-width:2` });
        if (x % 2 === 0 || on) gyAdd(svg, "text", { x: px, y: 85, "text-anchor": "middle", style: `font-family:var(--sans);font-size:11px;font-weight:${on ? 800 : 500}` }, String(x)); }
      const mem = []; for (let x = -12; x <= 12; x++) if (((x % m) + m) % m === ra) mem.push(x);
      $(".wout", box).innerHTML = `$[${a}]_{${m}} = [${ra}]_{${m}} = \\{\\dots, ${mem.join(", ")}, \\dots\\}$: όλοι οι $x$ με $${m} \\mid x - (${a})$.<br>Οι $${m}$ κλάσεις (χρώματα) είναι ξένες και καλύπτουν το $\\mathbb Z$: μια διαμέριση.`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  /* ---------- 6.3 διάγραμμα Hasse διαιρετών ---------- */
  dsbhasse(box) {
    const opts = [12, 18, 24, 30, 36, 48, 60, 72];
    box.innerHTML = `<div class="wctl"><label>n <select class="sn">${opts.map(v => `<option ${v === 36 ? "selected" : ""}>${v}</option>`).join("")}</select></label>
      <label>a <select class="sa"></select></label><label>b <select class="sb"></select></label></div><div class="pl"></div><div class="wout"></div>`;
    const om = x => { let c = 0; for (let p = 2; x > 1; p++) while (x % p === 0) { x /= p; c++; } return c; };
    function fill() { const n = +$(".sn", box).value, d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i);
      $(".sa", box).innerHTML = d.map((v, i) => `<option ${i === 2 ? "selected" : ""}>${v}</option>`).join(""); $(".sb", box).innerHTML = d.map((v, i) => `<option ${i === 3 ? "selected" : ""}>${v}</option>`).join(""); draw(); }
    function draw() {
      const n = +$(".sn", box).value, a = +$(".sa", box).value, b = +$(".sb", box).value, d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i);
      const lv = {}; d.forEach(x => (lv[om(x)] = lv[om(x)] || []).push(x)); const H = Math.max(...Object.keys(lv).map(Number));
      const pos = {}; Object.entries(lv).forEach(([l, xs]) => xs.forEach((x, i) => pos[x] = [280 + (i - (xs.length - 1) / 2) * 80, 270 - l * (230 / Math.max(H, 1))]));
      const svg = gyCanvas(box, 560, 300), lub = dsbLcm(a, b), glb = dsbGcd(a, b); let E = 0;
      d.forEach(x => d.forEach(y => { if (y % x === 0 && x !== y && d.every(z => z === x || z === y || !(z % x === 0 && y % z === 0))) { E++; gyAdd(svg, "line", { x1: pos[x][0], y1: pos[x][1], x2: pos[y][0], y2: pos[y][1], style: "stroke:#33507a;stroke-width:2" }); } }));
      d.forEach(x => { const c = x === lub ? "#e8590c" : x === glb ? "#2a9d55" : (x === a || x === b) ? "#2f6fde" : "#fff";
        gyAdd(svg, "circle", { cx: pos[x][0], cy: pos[x][1], r: 15, style: `fill:${c};stroke:#1d3557;stroke-width:2` });
        gyAdd(svg, "text", { x: pos[x][0], y: pos[x][1] + 5, "text-anchor": "middle", style: gyTS + `;fill:${c === "#fff" ? "#1d3557" : "#fff"}` }, String(x)); });
      $(".wout", box).innerHTML = `$(D_{${n}}, \\mid)$: $${d.length}$ στοιχεία, $${E}$ ακμές Hasse. Ελάχιστο το $1$, μέγιστο το $${n}$.<br>
        Για $a = ${a}$, $b = ${b}$ (μπλε): $\\sup = \\operatorname{ΕΚΠ} = ${lub}$ (πορτοκαλί), $\\inf = \\operatorname{ΜΚΔ} = ${glb}$ (πράσινο)${a % b === 0 || b % a === 0 ? " — τα $a, b$ είναι συγκρίσιμα." : " — τα $a, b$ δεν είναι συγκρίσιμα."}`;
      typeset($(".wout", box));
    }
    $(".sn", box).onchange = fill; $(".sa", box).onchange = draw; $(".sb", box).onchange = draw; fill();
  },

  /* ---------- 7.1 γραφήματα: βαθμοί ---------- */
  dsbgraph(box) { dsbGraphWidget(box, "Σπίτι", "deg"); },
  /* ---------- 7.2 πίνακας γειτνίασης ---------- */
  dsbadj(box) { dsbGraphWidget(box, "Σπίτι", "adj"); },
  /* ---------- 7.3 Euler / Hamilton ---------- */
  dsbeuler(box) { dsbGraphWidget(box, "Königsberg", "euler"); },

  /* ---------- 7.4 δέντρα: διασχίσεις ---------- */
  dsbtree(box) {
    const T = { "Δυαδικό (7 κορυφές)": { lab: "abcdefg", ch: { 0: [1, 2], 1: [3, 4], 2: [5, 6] } }, "Δυαδικό ανισόρροπο": { lab: "abcdef", ch: { 0: [1, 2], 1: [3, 4], 2: [5] } },
      "Τριαδικό": { lab: "abcdefgh", ch: { 0: [1, 2, 3], 1: [4, 5], 3: [6, 7] } } };
    box.innerHTML = `<div class="wctl"><label>δέντρο <select class="st">${Object.keys(T).map(k => `<option>${k}</option>`).join("")}</select></label>
      <label>διάσχιση <select class="so"><option value="pre">προδιατεταγμένη</option><option value="in">ενδοδιατεταγμένη</option><option value="post">μεταδιατεταγμένη</option></select></label>
      <label>βήμα <input type="range" class="rs" min="0" max="8" value="8"><b class="vs"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const t = T[$(".st", box).value], o = $(".so", box).value, n = t.lab.length, ch = i => t.ch[i] || [];
      const order = []; (function go(v) { const c = ch(v); if (o === "pre") order.push(v); if (o === "in") { if (c.length) go(c[0]); order.push(v); c.slice(1).forEach(go); } else c.forEach(go); if (o === "post") order.push(v); })(0);
      const rs = $(".rs", box); rs.max = n; const st = Math.min(+rs.value, n); $(".vs", box).textContent = st;
      const depth = [0], pos = []; const leaves = []; (function dl(v, d) { depth[v] = d; if (!ch(v).length) leaves.push(v); ch(v).forEach(c => dl(c, d + 1)); })(0, 0);
      (function px(v) { if (!ch(v).length) { pos[v] = [60 + leaves.indexOf(v) * (440 / Math.max(leaves.length - 1, 1)), 0]; } else { ch(v).forEach(px); const xs = ch(v).map(c => pos[c][0]); pos[v] = [(Math.min(...xs) + Math.max(...xs)) / 2, 0]; } pos[v][1] = 35 + depth[v] * 85; })(0);
      const edges = []; Object.entries(t.ch).forEach(([p, cs]) => cs.forEach(c => edges.push([+p, c])));
      const svg = gyCanvas(box, 560, 230), done = new Set(order.slice(0, st));
      dsbDrawGraph(svg, pos, edges, { lab: i => t.lab[i], vcol: i => done.has(i) ? (i === order[st - 1] ? "#e8590c" : "#ffd8a8") : "#fff" });
      const leavesN = leaves.length, internal = n - leavesN;
      $(".wout", box).innerHTML = `Σειρά: <b>${order.slice(0, st).map(i => t.lab[i]).join(", ") || "—"}</b>${st < n ? " …" : ""}<br>$n = ${n}$ κορυφές, $${n - 1}$ ακμές, $${internal}$ εσωτερικές, $${leavesN}$ φύλλα, ύψος $${Math.max(...depth)}$.`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("select,input").forEach(i => i.oninput = i.onchange = draw); draw();
  }
});

/* κοινό widget αναδρομικών σχέσεων a_n = c1 a_{n-1} + c2 a_{n-2} + d */
function dsbRecWidget(box, def) {
  const P = [["Fibonacci: f_n = f_{n-1} + f_{n-2}", 1, 1, 0, 0, 1], ["Ανόι: H_n = 2H_{n-1} + 1", 2, 0, 1, 0, 1], ["Συμβολοσειρές χωρίς 00: a_n = a_{n-1} + a_{n-2}", 1, 1, 0, 2, 3],
    ["a_n = a_{n-1} + 2a_{n-2} (ρίζες 2, −1)", 1, 2, 0, 2, 7], ["a_n = 5a_{n-1} − 6a_{n-2} (ρίζες 2, 3)", 5, -6, 0, 1, 0], ["a_n = 6a_{n-1} − 9a_{n-2} (διπλή ρίζα 3)", 6, -9, 0, 1, 6], ["a_n = 2a_{n-1} + 3", 2, 0, 3, 1, 5]];
  box.innerHTML = `<div class="wctl"><label>σχέση <select class="sp">${P.map((p, i) => `<option value="${i}" ${i === def ? "selected" : ""}>${p[0]}</option>`).join("")}</select></label></div>
    <div class="pl"></div><div class="wout"></div>`;
  function draw() {
    const [nm, c1, c2, d, a0, a1] = P[+$(".sp", box).value], a = [a0, a1]; for (let n = 2; n <= 10; n++) a.push(c1 * a[n - 1] + c2 * a[n - 2] + d);
    const svg = gyCanvas(box, 560, 220), mx = Math.max(...a.map(Math.abs), 1), w = 46, neg = a.some(v => v < 0), y0 = neg ? 110 : 190, sc = neg ? 85 : 160;
    gyAdd(svg, "line", { x1: 20, y1: y0, x2: 540, y2: y0, style: "stroke:#1d3557;stroke-width:1.2" });
    a.forEach((v, n) => { const h = v / mx * sc, x = 30 + n * w; gyAdd(svg, "rect", { x, y: v >= 0 ? y0 - h : y0, width: w - 10, height: Math.abs(h), rx: 4, style: `fill:${v >= 0 ? "#2f6fde" : "#e8590c"};fill-opacity:.75` });
      gyAdd(svg, "text", { x: x + (w - 10) / 2, y: v >= 0 ? y0 - h - 6 : y0 - h + 14, "text-anchor": "middle", style: "font-family:var(--sans);font-size:11px;font-weight:700" }, String(v));
      gyAdd(svg, "text", { x: x + (w - 10) / 2, y: 214, "text-anchor": "middle", style: "font-family:var(--sans);font-size:11px;fill:#666" }, `n=${n}`); });
    let cf = "";
    if (c2 !== 0 && d === 0) { const D = c1 * c1 + 4 * c2;
      if (D === 0) { const r = c1 / 2; cf = `Χαρακτηριστική $r^2 ${c1 === 0 ? "" : (c1 > 0 ? "- " : "+ ") + dsbMono(Math.abs(c1), "r", 1)}${gyS(-c2)} = 0$: διπλή ρίζα $r_0 = ${r}$, άρα $a_n = (\\alpha_1 + \\alpha_2 n)${gyPar(r)}^n$.`; }
      else { const s = Math.sqrt(D), r1 = (c1 - s) / 2, r2 = (c1 + s) / 2;
        cf = Number.isInteger(s) ? `Χαρακτηριστική $r^2 ${c1 === 0 ? "" : (c1 > 0 ? "- " : "+ ") + dsbMono(Math.abs(c1), "r", 1)}${gyS(-c2)} = 0$: ρίζες $${r1}, ${r2}$, άρα $a_n = \\alpha_1${gyPar(r1)}^n + \\alpha_2${gyPar(r2)}^n$.`
          : `Χαρακτηριστική $r^2 ${c1 === 0 ? "" : (c1 > 0 ? "- " : "+ ") + dsbMono(Math.abs(c1), "r", 1)}${gyS(-c2)} = 0$: ρίζες $\\frac{${c1}\\pm\\sqrt{${D}}}{2}$ (π.χ. Fibonacci: τύπος Binet).`; } }
    else if (c2 === 0 && d !== 0) { const C = d / (1 - c1); cf = `Μη ομογενής 1ης τάξης: μερική λύση $C = ${C}$ από $C = ${c1}C${gyS(d)}$, άρα $a_n = \\alpha\\cdot ${c1}^n${gyS(C)}$ με $\\alpha = ${a0 - C}$.`; }
    $(".wout", box).innerHTML = `Πρώτοι όροι ($a_0, a_1$ = αρχικές συνθήκες): $${a.join(",\\ ")}$<br>${cf}`;
    typeset($(".wout", box));
  }
  $(".sp", box).onchange = draw; draw();
}

/* κοινό widget γραφημάτων: mode = deg | adj | euler */
function dsbGraphWidget(box, def, mode) {
  box.innerHTML = `<div class="wctl"><label>γράφημα <select class="sg">${Object.keys(DSB_G).map(k => `<option ${k === def ? "selected" : ""}>${k}</option>`).join("")}</select></label>
    ${mode === "adj" ? `<label>δύναμη k <input type="range" class="rk" min="1" max="3" value="1"><b class="vk"></b></label>` : ""}</div><div class="pl"></div><div class="wout" style="overflow-x:auto"></div>`;
  function draw() {
    const G = DSB_G[$(".sg", box).value](), n = G.n, deg = Array(n).fill(0); G.e.forEach(([a, b]) => { deg[a]++; deg[b]++; });
    const odd = deg.map((d, i) => d % 2 ? i : -1).filter(i => i >= 0), comps = dsbComps(n, G.e);
    let hl = new Set();
    let txt = "";
    if (mode === "deg") {
      let bip = true; const c = Array(n).fill(-1); for (let s = 0; s < n; s++) if (c[s] < 0) { c[s] = 0; const q = [s]; while (q.length) { const u = q.shift(); G.e.forEach(([a, b]) => { const v = a === u ? b : b === u ? a : -1; if (v < 0) return; if (c[v] < 0) { c[v] = 1 - c[u]; q.push(v); } else if (c[v] === c[u]) bip = false; }); } }
      txt = `Βαθμοί: $${deg.map((d, i) => `\\deg(${i + 1}) = ${d}`).join(",\\ ")}$<br>$\\sum\\deg = ${deg.reduce((s, x) => s + x, 0)} = 2|E| = 2\\cdot ${G.e.length}$ · περιττού βαθμού: $${odd.length}$ κορυφές (άρτιο πλήθος ✓) · ${bip ? "διμερές" : "όχι διμερές (έχει περιττό κύκλο)"}.`;
      dsbDrawGraph(gyCanvas(box, 560, 280), G.pos, G.e, { vcol: i => deg[i] % 2 ? "#ffd8a8" : "#fff" });
    } else if (mode === "adj") {
      const k = +$(".rk", box).value; $(".vk", box).textContent = k;
      const A = Array.from({ length: n }, () => Array(n).fill(0)); G.e.forEach(([a, b]) => { A[a][b]++; A[b][a]++; });
      let P = A; for (let t = 1; t < k; t++) P = P.map(r => A[0].map((_, j) => r.reduce((s, v, m) => s + v * A[m][j], 0)));
      txt = `${k === 1 ? "Πίνακας γειτνίασης" : `$A^{${k}}$: διαδρομές μήκους ${k}`} $${k === 1 ? "A" : `A^{${k}}`} = \\begin{pmatrix}${P.map(r => r.join(" & ")).join(" \\\\ ")}\\end{pmatrix}$<br>${comps === 1 ? "Συνεκτικό." : `${comps} συνεκτικές συνιστώσες.`} ${k === 1 ? `Αθροίσματα γραμμών = βαθμοί: $${deg.join(", ")}$.` : `Π.χ. από το 1 στο 2: $${P[0][1]}$ διαδρομές.`}`;
      dsbDrawGraph(gyCanvas(box, 560, 280), G.pos, G.e);
    } else {
      let euler = "";
      if (comps > 1) euler = "Μη συνεκτικό: δεν υπάρχει μονοπάτι Euler.";
      else if (odd.length === 0) euler = "Όλοι οι βαθμοί άρτιοι: υπάρχει <b>κύκλωμα Euler</b>.";
      else if (odd.length === 2) euler = `Ακριβώς δύο περιττές κορυφές (${odd[0] + 1}, ${odd[1] + 1}): <b>μονοπάτι Euler</b> από τη μία στην άλλη, όχι κύκλωμα.`;
      else euler = `${odd.length} περιττές κορυφές: <b>ούτε μονοπάτι ούτε κύκλωμα Euler</b>.`;
      /* Hamilton με brute force για μικρά n */
      const adj = (a, b) => G.e.some(([x, y]) => (x === a && y === b) || (x === b && y === a)); let ham = null;
      (function srch(p, used) { if (ham) return; if (p.length === n) { if (adj(p[n - 1], p[0]) && n > 2) ham = p.slice(); return; } for (let v = 0; v < n; v++) if (!used[v] && adj(p[p.length - 1], v)) { used[v] = 1; p.push(v); srch(p, used); p.pop(); used[v] = 0; } })([0], [1]);
      if (ham) ham.forEach((v, i) => { const w = ham[(i + 1) % n]; const k = G.e.findIndex(([x, y]) => (x === v && y === w) || (x === w && y === v)); hl.add(k); });
      txt = `Βαθμοί: $${deg.join(", ")}$. ${euler}<br>${ham ? `Κύκλωμα Hamilton (πορτοκαλί): $${ham.map(v => v + 1).join("\\to")}\\to ${ham[0] + 1}$.` : "Δεν υπάρχει κύκλωμα Hamilton."}`;
      dsbDrawGraph(gyCanvas(box, 560, 280), G.pos, G.e, { hl, vcol: i => deg[i] % 2 ? "#ffd8a8" : "#fff" });
    }
    $(".wout", box).innerHTML = txt; typeset($(".wout", box));
  }
  box.querySelectorAll("select,input").forEach(i => i.oninput = i.onchange = draw); draw();
}

const dsbMary = m => ({ 2: "δυαδικό", 3: "τριαδικό", 4: "τετραδικό" })[m] || `$${m}$-αδικό`;
var GENS = Object.assign(window.GENS || {}, {
  dsbcnt: { title: "Γεννήτρια — κανόνες απαρίθμησης, περιστερώνας", make() {
    const t = ri(0, 3);
    if (t === 0) { const L = ri(2, 4), D = ri(2, 4); return { q: R`Πόσες πινακίδες της μορφής «$${L}$ κεφαλαία λατινικά γράμματα ($26$) ακολουθούμενα από $${D}$ ψηφία» υπάρχουν;`, fields: [{ label: "πλήθος =", ans: 26 ** L * 10 ** D }],
      sol: R`Κανόνας του γινομένου: $26^{${L}}\cdot 10^{${D}} = ${dsbN(26 ** L)}\cdot ${dsbN(10 ** D)} = ${dsbN(26 ** L * 10 ** D)}$.` }; }
    if (t === 1) { const n = ri(4, 7), d = ri(0, 9); return { q: R`Πόσοι κωδικοί $${n}$ ψηφίων (ψηφία $0$–$9$, με επανάληψη) περιέχουν τουλάχιστον ένα ψηφίο $${d}$;`, fields: [{ label: "πλήθος =", ans: 10 ** n - 9 ** n }],
      sol: R`Όλοι μείον αυτοί χωρίς το $${d}$: $10^{${n}} - 9^{${n}} = ${dsbN(10 ** n)} - ${dsbN(9 ** n)} = ${dsbN(10 ** n - 9 ** n)}$.` }; }
    if (t === 2) { const k = bkPick([7, 12, 26, 52]), r = ri(2, 6), nm = { 7: "οι $7$ ημέρες της εβδομάδας (ημέρα γέννησης)", 12: "οι $12$ μήνες του έτους (μήνας γέννησης)", 26: "τα $26$ γράμματα του λατινικού αλφαβήτου (αρχικό του ονόματος)", 52: "οι $52$ εβδομάδες του έτους (εβδομάδα γέννησης)" }[k];
      return { q: R`Πόσα άτομα χρειάζονται (ελάχιστος αριθμός) ώστε να είμαστε βέβαιοι ότι τουλάχιστον $${r}$ από αυτά έχουν το ίδιο «κουτί», όταν τα «κουτιά» είναι ${nm};`, fields: [{ label: "N =", ans: k * (r - 1) + 1 }],
        sol: R`Γενικευμένη αρχή του περιστερώνα: $N = k(r - 1) + 1 = ${k}\cdot ${r - 1} + 1 = ${k * (r - 1) + 1}$. Με $${k * (r - 1)}$ άτομα μπορεί να έχουμε ακριβώς $${r - 1}$ σε κάθε κουτί.` }; }
    const n = ri(5, 9), a = ri(1, 3), b = ri(1, Math.min(3, n - a - 1));
    return { q: R`Πόσες δυαδικές συμβολοσειρές μήκους $${n}$ αρχίζουν με $${"1".repeat(a)}$ ή τελειώνουν με $${"0".repeat(b)}$;`, fields: [{ label: "πλήθος =", ans: 2 ** (n - a) + 2 ** (n - b) - 2 ** (n - a - b) }],
      sol: R`Κανόνας της αφαίρεσης: $2^{${n - a}} + 2^{${n - b}} - 2^{${n - a - b}} = ${2 ** (n - a)} + ${2 ** (n - b)} - ${2 ** (n - a - b)} = ${2 ** (n - a) + 2 ** (n - b) - 2 ** (n - a - b)}$.` };
  } },
  dsbpc: { title: "Γεννήτρια — διατάξεις, συνδυασμοί, αναγραμματισμοί", make() {
    const t = ri(0, 3);
    if (t === 0) { const n = ri(6, 12), r = ri(2, 4); return { q: R`Από $${n}$ υποψηφίους επιλέγονται ${["πρόεδρος και αντιπρόεδρος", "πρόεδρος, αντιπρόεδρος και γραμματέας", "πρόεδρος, αντιπρόεδρος, γραμματέας και ταμίας"][r - 2]}. Με πόσους τρόπους; Με πόσους τρόπους επιλέγεται απλώς μια ομάδα $${r}$ ατόμων;`,
      fields: [{ label: "αξιώματα =", ans: dsbP(n, r) }, { label: "ομάδες =", ans: dsbC(n, r) }], sol: R`$P(${n},${r}) = ${dsbN(dsbP(n, r))}$ (μετράει η σειρά) και $\binom{${n}}{${r}} = \frac{${dsbN(dsbP(n, r))}}{${r}!} = ${dsbN(dsbC(n, r))}$.` }; }
    if (t === 1) { const W = bkPick([["ΑΛΓΕΒΡΑ", { "Α": 2 }], ["ΚΑΚΤΟΣ", { "Κ": 2 }], ["BANANA", { "A": 3, "N": 2 }], ["ΠΑΠΑΓΑΛΟΣ", { "Π": 2, "Α": 3 }], ["LETTER", { "T": 2, "E": 2 }], ["ΘΑΛΑΣΣΑ", { "Α": 3, "Σ": 2 }], ["ΣΕΠΤΕΜΒΡΗΣ", { "Σ": 2, "Ε": 2 }]]);
      const n = W[0].length, rep = Object.values(W[1]), den = rep.reduce((s, k) => s * dsbF(k), 1);
      return { q: R`Πόσοι είναι οι αναγραμματισμοί της λέξης <b>${W[0]}</b>;`, fields: [{ label: "πλήθος =", ans: dsbF(n) / den }],
        sol: R`$${n}$ γράμματα με επαναλήψεις ${Object.entries(W[1]).map(([c, k]) => `${c} ×${k}`).join(", ")}: $\dfrac{${n}!}{${rep.map(k => k + "!").join("\\,")}} = \dfrac{${dsbN(dsbF(n))}}{${den}} = ${dsbN(dsbF(n) / den)}$.` }; }
    if (t === 2) { const k = ri(3, 5), r = ri(6, 14), pos = ri(0, 1);
      if (pos && r < k) return GENS.dsbpc.make();
      return pos ? { q: R`Πόσες λύσεις έχει η $x_1 + \cdots + x_{${k}} = ${r}$ σε <b>θετικούς</b> ακεραίους;`, fields: [{ label: "πλήθος =", ans: dsbC(r - 1, k - 1) }],
        sol: R`Με $y_i = x_i - 1 \ge 0$: $y_1 + \cdots + y_{${k}} = ${r - k}$, άρα $\binom{${r - k} + ${k - 1}}{${k - 1}} = \binom{${r - 1}}{${k - 1}} = ${dsbC(r - 1, k - 1)}$.` }
        : { q: R`Πόσες λύσεις έχει η $x_1 + \cdots + x_{${k}} = ${r}$ σε <b>μη αρνητικούς</b> ακεραίους;`, fields: [{ label: "πλήθος =", ans: dsbC(r + k - 1, k - 1) }],
          sol: R`Αστέρια και μπάρες: $\binom{${r} + ${k - 1}}{${k - 1}} = \binom{${r + k - 1}}{${k - 1}} = ${dsbC(r + k - 1, k - 1)}$.` }; }
    const m = ri(4, 7), w = ri(4, 7), s = ri(3, 4);
    return { q: R`Από $${m}$ άνδρες και $${w}$ γυναίκες επιλέγεται επιτροπή $${s}$ ατόμων. Πόσες επιτροπές έχουν τουλάχιστον μία γυναίκα;`, fields: [{ label: "πλήθος =", ans: dsbC(m + w, s) - dsbC(m, s) }],
      sol: R`Όλες μείον όσες έχουν μόνο άνδρες: $\binom{${m + w}}{${s}} - \binom{${m}}{${s}} = ${dsbC(m + w, s)} - ${dsbC(m, s)} = ${dsbC(m + w, s) - dsbC(m, s)}$.` };
  } },
  dsbbin: { title: "Γεννήτρια — διωνυμικό θεώρημα", make() {
    const t = ri(0, 2);
    if (t === 0) { const n = ri(4, 8), a = bkPick([1, 2, 3]), b = bkPick([1, -1, 2, -2, 3]), k = ri(1, n - 1), c = dsbC(n, k) * a ** k * b ** (n - k);
      const base = `(${a === 1 ? "" : a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)})`;
      return { q: R`Να βρείτε τον συντελεστή του $${dsbPw("x", k)}$ στο ανάπτυγμα του $${base}^{${n}}$.`, fields: [{ label: "συντελεστής =", ans: c }],
        sol: R`Γενικός όρος $\binom{${n}}{j}(${a === 1 ? "" : a}x)^{j}(${b})^{${n} - j}$· για $j = ${k}$: $\binom{${n}}{${k}}${a === 1 ? "" : `\\cdot ${dsbPw(a, k)}`}\cdot ${dsbPw(gyPar(b), n - k)} = ${dsbC(n, k)}${a === 1 ? "" : `\\cdot ${a ** k}`}\cdot ${gyPar(b ** (n - k))} = ${c}$.` }; }
    if (t === 1) { const n = ri(3, 9), s = ri(1, 4); return { q: R`Να υπολογίσετε το $\displaystyle\sum_{k=0}^{${n}}\binom{${n}}{k}${s === 1 ? "" : s + "^k"}$.`, fields: [{ label: "=", ans: (1 + s) ** n }],
      sol: R`Διωνυμικό θεώρημα με $x = 1$, $y = ${s}$: $(1 + ${s})^{${n}} = ${dsbN((1 + s) ** n)}$.` }; }
    let n, p, q, k; do { n = ri(4, 10); p = ri(1, 3); q = ri(1, 2); k = ri(0, n); } while ((p * (n - k) - q * k) !== 0 && ri(0, 3) > 0);
    const e = p * (n - k) - q * k, c = dsbC(n, k) * (-1) ** k;
    return { q: R`Στο ανάπτυγμα του $\left(${dsbPw("x", p)} - \dfrac{1}{${dsbPw("x", q)}}\right)^{${n}}$, ποιος είναι ο συντελεστής του ${e === 0 ? "σταθερού όρου" : `$${dsbPw("x", e)}$`};`, fields: [{ label: "συντελεστής =", ans: c }],
      sol: R`Γενικός όρος $\binom{${n}}{k}(${dsbPw("x", p)})^{${n} - k}\left(-${dsbPw("x", -q).replace("x^{-", "x^{-")}\right)^k$, εκθέτης $${p}(${n} - k) - ${q}k = ${e}$ ⇒ $k = ${k}$. Συντελεστής $\binom{${n}}{${k}}(-1)^{${k}} = ${c}$.` };
  } },
  dsbie: { title: "Γεννήτρια — εγκλεισμός–αποκλεισμός, διαταράξεις", make() {
    const t = ri(0, 2);
    if (t === 0) { const N = bkPick([100, 200, 500, 1000]), [a, b] = bkPick([[2, 3], [3, 5], [2, 5], [4, 6], [6, 10], [3, 7], [4, 10]]), L = dsbLcm(a, b), u = Math.floor(N / a) + Math.floor(N / b) - Math.floor(N / L);
      return { q: R`Πόσοι ακέραιοι στο $\{1, \dots, ${N}\}$ διαιρούνται με $${a}$ ή με $${b}$;`, fields: [{ label: "πλήθος =", ans: u }],
        sol: R`$\lfloor ${N}/${a}\rfloor + \lfloor ${N}/${b}\rfloor - \lfloor ${N}/${L}\rfloor = ${Math.floor(N / a)} + ${Math.floor(N / b)} - ${Math.floor(N / L)} = ${u}$ (ΕΚΠ$(${a},${b}) = ${L}$).` }; }
    if (t === 1) { const n = ri(3, 7); return { q: R`Πόσες μεταθέσεις των $1, 2, \dots, ${n}$ δεν αφήνουν κανένα στοιχείο στη θέση του (διαταράξεις $D_{${n}}$);`, fields: [{ label: `D${n} =`, ans: dsbD(n) }],
      sol: R`$D_{${n}} = ${n}!\sum_{k=0}^{${n}}\frac{(-1)^k}{k!} = ${dsbD(n)}$ (ή αναδρομικά $D_n = (n-1)(D_{n-1} + D_{n-2})$, $D_1 = 0$, $D_2 = 1$).` }; }
    const m = ri(4, 6), n = ri(2, 3), on = (() => { let s = 0; for (let k = 0; k <= n; k++) s += (-1) ** k * dsbC(n, k) * (n - k) ** m; return s; })();
    return { q: R`Πόσες συναρτήσεις <b>επί</b> υπάρχουν από σύνολο $${m}$ στοιχείων σε σύνολο $${n}$ στοιχείων;`, fields: [{ label: "πλήθος =", ans: on }],
      sol: R`$\sum_{k=0}^{${n}}(-1)^k\binom{${n}}{k}(${n} - k)^{${m}} = ${[...Array(n).keys()].map(k => `${k ? (k % 2 ? "-" : "+") : ""}${dsbC(n, k) === 1 ? "" : dsbC(n, k) + "\\cdot "}${n - k}^{${m}}`).join(" ")} = ${on}$.` };
  } },
  dsbrecm: { title: "Γεννήτρια — όροι αναδρομικών σχέσεων", make() {
    const t = ri(0, 2);
    if (t === 0) { const c = ri(2, 3), d = gyNZ(-3, 4), a0 = ri(0, 3), k = ri(3, 5); const a = [a0]; for (let n = 1; n <= k; n++) a.push(c * a[n - 1] + d);
      return { q: R`Αν $a_n = ${c}a_{n-1}${gyS(d)}$ για $n \ge 1$ και $a_0 = ${a0}$, να βρείτε τον $a_{${k}}$.`, fields: [{ label: `a${k} =`, ans: a[k] }], sol: R`Διαδοχικά: $${a.map((v, i) => `a_{${i}} = ${v}`).join(",\\ ")}$.` }; }
    if (t === 1) { const c1 = ri(1, 3), c2 = ri(1, 3), a0 = ri(0, 2), a1 = ri(1, 3), k = ri(4, 6); const a = [a0, a1]; for (let n = 2; n <= k; n++) a.push(c1 * a[n - 1] + c2 * a[n - 2]);
      return { q: R`Αν $a_n = ${c1 === 1 ? "" : c1}a_{n-1} + ${c2 === 1 ? "" : c2}a_{n-2}$ με $a_0 = ${a0}$, $a_1 = ${a1}$, να βρείτε τον $a_{${k}}$.`, fields: [{ label: `a${k} =`, ans: a[k] }], sol: R`Διαδοχικά: $${a.map((v, i) => `a_{${i}} = ${v}`).join(",\\ ")}$.` }; }
    const n = ri(4, 10), f = [2, 3]; for (let i = 2; i < n; i++) f.push(f[i - 1] + f[i - 2]);
    return { q: R`Πόσες δυαδικές συμβολοσειρές μήκους $${n}$ <b>δεν</b> περιέχουν δύο διαδοχικά $0$;`, fields: [{ label: "πλήθος =", ans: f[n - 1] }],
      sol: R`$a_n = a_{n-1} + a_{n-2}$, $a_1 = 2$, $a_2 = 3$: $${f.slice(0, n).join(", ")}$, άρα $a_{${n}} = ${f[n - 1]}$.` };
  } },
  dsbrecs: { title: "Γεννήτρια — επίλυση γραμμικών αναδρομικών σχέσεων", make() {
    const t = ri(0, 2);
    if (t === 0) { let r1, r2; do { r1 = gyNZ(-3, 4); r2 = gyNZ(-3, 5); } while (r1 >= r2 || r1 + r2 === 0 || Math.abs(r1) === 1 || Math.abs(r2) === 1);
      const al = gyNZ(-3, 3), be = gyNZ(-3, 3), c1 = r1 + r2, c2 = -r1 * r2, a0 = al + be, a1 = al * r1 + be * r2;
      return { q: R`Να λύσετε την $a_n = ${dsbMono(c1, "a_{n-1}", 1)}${c2 < 0 ? " - " + dsbMono(-c2, "a_{n-2}", 1) : " + " + dsbMono(c2, "a_{n-2}", 1)}$ με $a_0 = ${a0}$, $a_1 = ${a1}$, γράφοντας $a_n = \alpha\cdot ${gyPar(r1)}^n + \beta\cdot ${gyPar(r2)}^n$.`,
        fields: [{ label: "α =", ans: al }, { label: "β =", ans: be }],
        sol: R`Χαρακτηριστική $r^2 ${(c1 > 0 ? "- " : "+ ") + dsbMono(Math.abs(c1), "r", 1)}${gyS(-c2)} = (r${gyS(-r1)})(r${gyS(-r2)}) = 0$, ρίζες $${r1}, ${r2}$. Από $\alpha + \beta = ${a0}$ και $${dsbMono(r1, "\\alpha", 1)}${r2 < 0 ? " - " + dsbMono(-r2, "\\beta", 1) : " + " + dsbMono(r2, "\\beta", 1)} = ${a1}$: $\alpha = ${al}$, $\beta = ${be}$.` }; }
    if (t === 1) { const r = bkPick([2, 3, -2]), al = gyNZ(-3, 3), be = gyNZ(-2, 3), a0 = al, a1 = (al + be) * r;
      return { q: R`Να λύσετε την $a_n = ${dsbMono(2 * r, "a_{n-1}", 1)} - ${r * r}a_{n-2}$ με $a_0 = ${a0}$, $a_1 = ${a1}$, γράφοντας $a_n = (\alpha + \beta n)${gyPar(r)}^n$.`,
        fields: [{ label: "α =", ans: al }, { label: "β =", ans: be }],
        sol: R`Χαρακτηριστική $r^2${gyS(-2 * r)}r + ${r * r} = (r${gyS(-r)})^2$: διπλή ρίζα $${r}$. $a_0 = \alpha = ${a0}$, $a_1 = ${r}(\alpha + \beta) = ${a1} \Rightarrow \beta = ${be}$.` }; }
    const c = bkPick([2, 3, 4]), d = gyNZ(-4, 6), a0 = ri(0, 4); if ((d % (1 - c)) !== 0) return GENS.dsbrecs.make();
    const C = d / (1 - c), al = a0 - C;
    return { q: R`Να λύσετε την $a_n = ${c}a_{n-1}${gyS(d)}$, $a_0 = ${a0}$, στη μορφή $a_n = \alpha\cdot ${c}^n + \gamma$.`, fields: [{ label: "α =", ans: al }, { label: "γ =", ans: C }],
      sol: R`Μερική λύση σταθερή: $C = ${c}C${gyS(d)} \Rightarrow C = ${C}$. Γενική $a_n = \alpha\cdot ${c}^n${gyS(C)}$, και $a_0 = \alpha${gyS(C)} = ${a0} \Rightarrow \alpha = ${al}$.` };
  } },
  dsbrelp: { title: "Γεννήτρια — ιδιότητες σχέσεων", make() {
    const t = ri(0, 1);
    if (t === 0) { const n = ri(2, 5), k = bkPick([["όλες", n * n], ["ανακλαστικές", n * (n - 1)], ["συμμετρικές", n * (n + 1) / 2]]);
      return { q: R`Πόσες ${k[0] === "όλες" ? "" : k[0] + " "}σχέσεις υπάρχουν σε σύνολο $${n}$ στοιχείων; (Δώστε τον εκθέτη $e$ στη μορφή $2^e$.)`, fields: [{ label: "e =", ans: k[1] }],
        sol: R`${k[0] === "όλες" ? `Κάθε υποσύνολο του $A\\times A$ ($${n * n}$ ζεύγη): $2^{${n * n}}$.` : k[0] === "ανακλαστικές" ? `Τα $${n}$ διαγώνια ζεύγη υποχρεωτικά, τα υπόλοιπα $${n * (n - 1)}$ ελεύθερα: $2^{${n * (n - 1)}}$.` : `Διαγώνιος ($${n}$) και $\\binom{${n}}{2}$ μη διατεταγμένα ζεύγη: $2^{${n} + ${n * (n - 1) / 2}} = 2^{${n * (n + 1) / 2}}$.`}` }; }
    const n = 3; let M; do { M = Array.from({ length: n }, () => Array.from({ length: n }, () => Math.random() < .5 ? 1 : 0)); } while (M.flat().every(v => !v));
    const r = M.every((row, i) => row[i]), s = M.every((row, i) => row.every((v, j) => v === M[j][i]));
    let tr = true; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) if (M[i][j] && M[j][k] && !M[i][k]) tr = false;
    const pairs = []; M.forEach((row, i) => row.forEach((v, j) => { if (v) pairs.push(`(${i + 1},${j + 1})`); }));
    const key = (r ? "Α" : "-") + (s ? "Σ" : "-") + (tr ? "Μ" : "-");
    const nm = k => { const p = []; if (k[0] === "Α") p.push("ανακλαστική"); if (k[1] === "Σ") p.push("συμμετρική"); if (k[2] === "Μ") p.push("μεταβατική"); return p.length ? p.join(", ") : "καμία από τις τρεις"; };
    const all = ["---", "Α--", "-Σ-", "--Μ", "ΑΣ-", "Α-Μ", "-ΣΜ", "ΑΣΜ"].filter(k => k !== key); const opts = [key, ...shuffle(all).slice(0, 3)];
    return bkMC({ q: R`Η σχέση $R = \{${pairs.join(", ")}\}$ στο $\{1, 2, 3\}$ είναι (από τις ιδιότητες ανακλαστική, συμμετρική, μεταβατική) ακριβώς:`,
      sol: R`Ανακλαστική: ${r ? "ναι, όλα τα $(a,a)$" : "όχι, λείπει κάποιο $(a,a)$"}. Συμμετρική: ${s ? "ναι" : "όχι, κάποιο $(a,b)$ χωρίς το $(b,a)$"}. Μεταβατική: ${tr ? "ναι" : "όχι, υπάρχουν $(a,b),(b,c)\\in R$ με $(a,c)\\notin R$"}. Άρα: ${nm(key)}.` }, opts.map(nm), 0);
  } },
  dsbeq: { title: "Γεννήτρια — σχέσεις ισοδυναμίας", make() {
    const t = ri(0, 1);
    if (t === 0) { const m = ri(3, 9), N = m * ri(2, 6) + ri(0, m - 1), a = ri(1, m); const sz = Math.floor((N - a) / m) + 1;
      return { q: R`Στο $\{1, 2, \dots, ${N}\}$ θεωρούμε τη σχέση $x \equiv y \pmod{${m}}$. Πόσες κλάσεις ισοδυναμίας υπάρχουν και πόσα στοιχεία έχει η κλάση του $${a}$;`,
        fields: [{ label: "κλάσεις =", ans: Math.min(m, N) }, { label: `|[${a}]| =`, ans: sz }],
        sol: R`Οι κλάσεις αντιστοιχούν στα υπόλοιπα $0, \dots, ${m - 1}$: $${m}$ κλάσεις. $[${a}] = \{${a}, ${a + m}, \dots\}$ μέχρι το $${N}$: $${sz}$ στοιχεία.` }; }
    const parts = Array.from({ length: ri(2, 4) }, () => ri(1, 4)), tot = parts.reduce((s, x) => s + x, 0), pr = parts.reduce((s, x) => s + x * x, 0);
    let c = 1; const blocks = parts.map(k => { const b = []; for (let i = 0; i < k; i++) b.push(c++); return `\\{${b.join(",")}\\}`; });
    return { q: R`Η διαμέριση $\{${blocks.join(", ")}\}$ του $\{1, \dots, ${tot}\}$ ορίζει σχέση ισοδυναμίας $R$. Πόσα διατεταγμένα ζεύγη έχει η $R$;`, fields: [{ label: "|R| =", ans: pr }],
      sol: R`Κάθε κλάση με $k$ στοιχεία συνεισφέρει $k^2$ ζεύγη: $${parts.map(k => k + "^2").join(" + ")} = ${pr}$.` };
  } },
  dsbpo: { title: "Γεννήτρια — μερικές διατάξεις (διαιρετότητα)", make() {
    const n = bkPick([12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 50, 54, 60, 72]), d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i);
    const t = ri(0, 1);
    if (t === 0) { let E = 0; d.forEach(x => d.forEach(y => { if (y % x === 0 && x !== y && d.every(z => z === x || z === y || !(z % x === 0 && y % z === 0))) E++; }));
      return { q: R`Στο $(D_{${n}}, \mid)$ των θετικών διαιρετών του $${n}$, πόσα στοιχεία υπάρχουν και πόσες ακμές έχει το διάγραμμα Hasse;`, fields: [{ label: "στοιχεία =", ans: d.length }, { label: "ακμές =", ans: E }],
        sol: R`Διαιρέτες: $${d.join(", ")}$ ($${d.length}$). Ακμή $x$ — $y$ ανν $y/x$ πρώτος: $${E}$ ακμές.` }; }
    let a, b; do { a = bkPick(d); b = bkPick(d); } while (a === b || a === 1 || b === 1);
    return { q: R`Στο $(D_{${n}}, \mid)$, να βρείτε το ελάχιστο άνω φράγμα και το μέγιστο κάτω φράγμα των $${a}$ και $${b}$.`, fields: [{ label: "sup =", ans: dsbLcm(a, b) }, { label: "inf =", ans: dsbGcd(a, b) }],
      sol: R`Στη διαιρετότητα $\sup = \operatorname{ΕΚΠ}(${a}, ${b}) = ${dsbLcm(a, b)}$ και $\inf = \operatorname{ΜΚΔ}(${a}, ${b}) = ${dsbGcd(a, b)}$ (και τα δύο ανήκουν στο $D_{${n}}$).` };
  } },
  dsbgr: { title: "Γεννήτρια — βαθμοί και ειδικά γραφήματα", make() {
    const t = ri(0, 2);
    if (t === 0) { const G = bkPick([["K", ri(4, 12)], ["C", ri(3, 12)], ["W", ri(3, 10)], ["Q", ri(2, 5)], ["Kmn", [ri(2, 6), ri(2, 7)]]]);
      const [nm, v, e] = G[0] === "K" ? [`K_{${G[1]}}`, G[1], G[1] * (G[1] - 1) / 2] : G[0] === "C" ? [`C_{${G[1]}}`, G[1], G[1]] : G[0] === "W" ? [`W_{${G[1]}}`, G[1] + 1, 2 * G[1]] : G[0] === "Q" ? [`Q_{${G[1]}}`, 2 ** G[1], G[1] * 2 ** (G[1] - 1)] : [`K_{${G[1][0]},${G[1][1]}}`, G[1][0] + G[1][1], G[1][0] * G[1][1]];
      return { q: R`Πόσες κορυφές και πόσες ακμές έχει το γράφημα $${nm}$;`, fields: [{ label: "|V| =", ans: v }, { label: "|E| =", ans: e }],
        sol: R`Για το $${nm}$: $|V| = ${v}$, $|E| = ${e}$ (θεώρημα χειραψίας: $\sum\deg = ${2 * e}$).` }; }
    if (t === 1) { const n = ri(5, 9); let deg; do { deg = Array.from({ length: n }, () => ri(1, 5)); } while (deg.reduce((s, x) => s + x, 0) % 2);
      return { q: R`Ένα (πολυ)γράφημα έχει βαθμούς κορυφών $${deg.join(", ")}$. Πόσες ακμές έχει;`, fields: [{ label: "|E| =", ans: deg.reduce((s, x) => s + x, 0) / 2 }],
        sol: R`$\sum\deg = ${deg.reduce((s, x) => s + x, 0)} = 2|E|$, άρα $|E| = ${deg.reduce((s, x) => s + x, 0) / 2}$.` }; }
    const k = ri(2, 6); let n; do n = 2 * ri(2, 7) + (k % 2 ? 0 : ri(0, 1)); while (n <= k);
    return { q: R`Ένα $${k}$-κανονικό γράφημα έχει $${n}$ κορυφές. Πόσες ακμές έχει;`, fields: [{ label: "|E| =", ans: k * n / 2 }], sol: R`$2|E| = ${n}\cdot ${k} = ${n * k}$, άρα $|E| = ${n * k / 2}$.` };
  } },
  dsbgr2: { title: "Γεννήτρια — πίνακας γειτνίασης, συνεκτικότητα", make() {
    const n = 4, t = ri(0, 1); let A, E;
    do { A = Array.from({ length: n }, () => Array(n).fill(0)); E = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (Math.random() < .55) { A[i][j] = A[j][i] = 1; E++; } } while (E < 3);
    const tex = `A = \\begin{pmatrix}${A.map(r => r.join("&")).join("\\\\")}\\end{pmatrix}`;
    if (t === 0) { const v = ri(1, n); return { q: R`Ο πίνακας γειτνίασης ενός γραφήματος είναι $${tex}$. Πόσες ακμές έχει και ποιος είναι ο βαθμός της $v_{${v}}$;`,
      fields: [{ label: "|E| =", ans: E }, { label: `deg(v${v}) =`, ans: A[v - 1].reduce((s, x) => s + x, 0) }],
      sol: R`Άθροισμα στοιχείων $${2 * E} = 2|E|$, άρα $|E| = ${E}$. Άθροισμα της γραμμής $${v}$: $\deg(v_{${v}}) = ${A[v - 1].reduce((s, x) => s + x, 0)}$.` }; }
    let i, j; do { i = ri(0, n - 1); j = ri(0, n - 1); } while (i === j);
    const w = A[i].reduce((s, x, k) => s + x * A[k][j], 0);
    return { q: R`Για το γράφημα με πίνακα γειτνίασης $${tex}$, πόσες διαδρομές μήκους $2$ υπάρχουν από την $v_{${i + 1}}$ στην $v_{${j + 1}}$;`, fields: [{ label: "πλήθος =", ans: w }],
      sol: R`$(A^2)_{${i + 1}${j + 1}} = \sum_k a_{${i + 1}k}a_{k${j + 1}} = ${w}$: ${w ? `μέσω ${A[i].map((x, k) => x && A[k][j] ? `$v_{${k + 1}}$` : "").filter(Boolean).join(", ")}` : "δεν έχουν κοινό γείτονα"}.` };
  } },
  dsbeul: { title: "Γεννήτρια — Euler και Hamilton", make() {
    const t = ri(0, 2);
    if (t === 0) { const n = ri(5, 8); let deg; do { deg = Array.from({ length: n }, () => ri(2, 6)); } while (deg.reduce((s, x) => s + x, 0) % 2 || deg.filter(d => d % 2).length > 4);
      const o = deg.filter(d => d % 2).length, opts = ["Έχει κύκλωμα Euler", "Έχει μονοπάτι Euler αλλά όχι κύκλωμα Euler", "Δεν έχει ούτε μονοπάτι ούτε κύκλωμα Euler"], ci = o === 0 ? 0 : o === 2 ? 1 : 2;
      return bkMC({ q: R`Ένα <b>συνεκτικό</b> πολυγράφημα έχει βαθμούς $${deg.join(", ")}$. Τι ισχύει;`, sol: R`Κορυφές περιττού βαθμού: $${o}$. ${o === 0 ? "Όλοι άρτιοι: κύκλωμα Euler." : o === 2 ? "Ακριβώς δύο: μονοπάτι Euler από τη μία στην άλλη." : "Περισσότερες από δύο: ούτε μονοπάτι ούτε κύκλωμα Euler."}` }, opts, ci); }
    if (t === 1) { const n = ri(4, 8); return { q: R`Πόσα διαφορετικά κυκλώματα Hamilton έχει το $K_{${n}}$ (αγνοώντας αρχική κορυφή και φορά);`, fields: [{ label: "πλήθος =", ans: dsbF(n - 1) / 2 }],
      sol: R`$\frac{(${n} - 1)!}{2} = \frac{${dsbF(n - 1)}}{2} = ${dsbF(n - 1) / 2}$.` }; }
    const m = ri(1, 6), n = ri(1, 6); if (m === 1 && n === 1) return GENS.dsbeul.make();
    const ok = m % 2 === 0 && n % 2 === 0;
    return bkMC({ q: R`Έχει το πλήρες διμερές $K_{${m},${n}}$ κύκλωμα Euler;`, sol: R`Οι βαθμοί είναι $${n}$ (στο μέρος με $${m}$ κορυφές) και $${m}$ (στο άλλο). Κύκλωμα Euler ανν όλοι άρτιοι: ${ok ? "ναι" : "όχι"}.` },
      ["Ναι", "Όχι"], ok ? 0 : 1);
  } },
  dsbtr: { title: "Γεννήτρια — δέντρα", make() {
    const t = ri(0, 2);
    if (t === 0) { const m = ri(2, 5), i = ri(3, 40); return { q: R`Ένα πλήρες ${dsbMary(m)} δέντρο έχει $${i}$ εσωτερικές κορυφές. Πόσες κορυφές και πόσα φύλλα έχει;`,
      fields: [{ label: "n =", ans: m * i + 1 }, { label: "φύλλα =", ans: (m - 1) * i + 1 }], sol: R`$n = ${m}\cdot ${i} + 1 = ${m * i + 1}$ και $l = ${m - 1 === 1 ? "" : (m - 1) + "\\cdot "}${i} + 1 = ${(m - 1) * i + 1}$.` }; }
    if (t === 1) { const m = ri(2, 4), i = ri(3, 30), l = (m - 1) * i + 1; return { q: R`Ένα πλήρες ${dsbMary(m)} δέντρο έχει $${l}$ φύλλα. Πόσες εσωτερικές κορυφές έχει;`, fields: [{ label: "εσωτερικές =", ans: i }],
      sol: R`$l = (m - 1)i + 1 \Rightarrow ${l} = ${dsbMono(m - 1, "i", 1)} + 1 \Rightarrow i = ${i}$.` }; }
    const d4 = ri(1, 3), d3 = ri(0, 3), d2 = ri(0, 2); const l = 2 * d4 + d3 + 2; /* Σdeg=2(n-1): 4d4+3d3+2d2+l = 2(d4+d3+d2+l-1) ⇒ l = 2d4 + d3 + 2 */
    return { q: R`Ένα δέντρο έχει ${[[d4, 4], [d3, 3], [d2, 2]].filter(([c]) => c > 0).map(([c, g]) => `$${c}$ κορυφ${c === 1 ? "ή" : "ές"} βαθμού $${g}$`).join(", ")} και όλες οι υπόλοιπες κορυφές είναι φύλλα. Πόσα φύλλα έχει;`, fields: [{ label: "φύλλα =", ans: l }],
      sol: R`Με $n = ${d4 + d3 + d2} + l$: $\sum\deg = ${4 * d4 + 3 * d3 + 2 * d2} + l = 2(n - 1) = ${2 * (d4 + d3 + d2) - 2} + 2l$, άρα $l = ${l}$.` };
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

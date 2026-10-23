const R = String.raw;
const CONFIG = {
  storeKey: "pagk-gkat-meros-b-v1",
  heroTitle: "Μαθηματικά Κατεύθυνσης Γ΄ Λυκείου — Παγκύπριες · Μέρος Β",
  tefxos: "Β΄ τετραμήνου (Ενότητες 7, 4, 5, 9, 10, 11)",
  howto: `<ul><li>Τιμές: <code>π/4</code>, <code>ln2/2</code>, <code>e-2</code>, <code>2π/15</code>, <code>9π</code>, <code>7/9</code> · πιθανότητες ως κλάσμα ή δεκαδικός</li>
    <li>Εκφράσεις με <code>ν</code>: γράψε π.χ. <code>ν^2</code> ή <code>ν(ν+1)/2</code> (δέχεται και <code>n</code> ή <code>x</code>)</li>
    <li>Συναρτήσεις: <code>ημx</code>, <code>ln x</code>, <code>e^x</code>, <code>√x</code> — ή στα αγγλικά <code>sin</code>, <code>sqrt</code>…</li></ul>`
};

const UNITS = [
  { id: 7, title: "Ενότητα 7 · Αναλυτική Γεωμετρία – Παραβολή" },
  { id: 4, title: "Ενότητα 4 · Σειρές" },
  { id: 5, title: "Ενότητα 5 · Ορισμένο Ολοκλήρωμα" },
  { id: 9, title: "Ενότητα 9 · Σύνολα" },
  { id: 10, title: "Ενότητα 10 · Συνδυαστική" },
  { id: 11, title: "Ενότητα 11 · Πιθανότητες" }
];

const SECTIONS = [
/* ═════════════ 7.1–7.2 ═════════════ */
{
  id: "7.1–7.2", unit: 7, title: "Παραβολή – Εξίσωση – Παραμετρικές",
  book: "Γ΄ Τεύχος §7.1–7.2 · Δραστηριότητες σελ. 81",
  theory: R`
<div class="tbox"><h4>Ορισμός</h4>
<p><b>Παραβολή</b> είναι ο γεωμετρικός τόπος των σημείων που ισαπέχουν από ένα σταθερό σημείο $E$ (<b>εστία</b>) και μια σταθερή ευθεία $\delta$ (<b>διευθετούσα</b>): $\;(PE) = d(P, \delta)$.</p></div>
<div class="tbox"><h4>Κανονικές μορφές ($\alpha \ne 0$)</h4>
<ul><li>$y^2 = 4\alpha x$: εστία $E(\alpha, 0)$, διευθετούσα $x = -\alpha$, άξονας συμμετρίας ο $x'x$.</li>
<li>$x^2 = 4\alpha y$: εστία $E(0, \alpha)$, διευθετούσα $y = -\alpha$, άξονας συμμετρίας ο $y'y$.</li></ul>
<p>Αν $\alpha > 0$ η $y^2 = 4\alpha x$ «ανοίγει» προς τα δεξιά, αν $\alpha < 0$ προς τα αριστερά.</p></div>
<div class="tbox"><h4>Παραμετρικές εξισώσεις</h4>
$$x = \alpha t^2, \qquad y = 2\alpha t, \qquad t \in \mathbb{R} \qquad (\text{για } y^2 = 4\alpha x)$$</div>
<div class="tbox tip"><h4>Χρήσιμη ιδιότητα</h4><p>Για σημείο $P(x_0, y_0)$ της $y^2 = 4\alpha x$ με $\alpha>0$: $\;(PE) = x_0 + \alpha$ (η απόστασή του από τη διευθετούσα).</p></div>`,
  widget: "parabola",
  gen: "gpar",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε την εστία και τη διευθετούσα της παραβολής $y^2 = 10x$.`,
      fields: [{ label: "εστία: x =", ans: "5/2" }, { label: "διευθετούσα: x =", ans: "-5/2" }],
      hint: R`$4\alpha = 10$.`, sol: R`$4\alpha = 10 \Rightarrow \alpha = \frac52$. Εστία $E\left(\frac52, 0\right)$, διευθετούσα $x = -\frac52$.` },
    { level: 1, type: "fields", q: R`Να βρείτε την εστία και τη διευθετούσα της $x^2 = 8y$.`,
      fields: [{ label: "εστία: y =", ans: 2 }, { label: "διευθετούσα: y =", ans: -2 }],
      hint: R`Μορφή $x^2 = 4\alpha y$.`, sol: R`$4\alpha = 8 \Rightarrow \alpha = 2$: εστία $E(0, 2)$, διευθετούσα $y = -2$.` },
    { level: 1, type: "fields", q: R`Η παραβολή με εστία $E(3, 0)$ και διευθετούσα $x = -3$ έχει εξίσωση $y^2 = \;?\cdot x$.`,
      fields: [{ label: "y² = … x, συντελεστής =", ans: 12 }],
      hint: R`$\alpha = 3$.`, sol: R`$\alpha = 3 \Rightarrow y^2 = 4\cdot3\,x = 12x$.` },
    { level: 2, type: "fields", q: R`Η καμπύλη $x = 2t^2$, $y = 4t$, $t \in \mathbb{R}$ είναι παραβολή. Να βρείτε την καρτεσιανή εξίσωση $y^2 = \kappa x$ και την εστία της.`,
      fields: [{ label: "κ =", ans: 8 }, { label: "εστία: x =", ans: 2 }],
      hint: R`Απαλοιφή του $t$: $t = \frac{y}{4}$.`, sol: R`$t = \frac y4 \Rightarrow x = 2\cdot\frac{y^2}{16} \Rightarrow y^2 = 8x$, $\alpha = 2$, εστία $(2, 0)$.` },
    { level: 2, type: "fields", q: R`Η παραβολή $y^2 = 4\alpha x$ διέρχεται από το σημείο $(2, 4)$. Να βρείτε το $\alpha$.`,
      fields: [{ label: "α =", ans: 2 }], hint: R`Αντικατάσταση.`, sol: R`$16 = 8\alpha \Rightarrow \alpha = 2$, άρα $y^2 = 8x$.` },
    { level: 3, type: "fields", q: R`Το σημείο $P$ της παραβολής $y^2 = 8x$ έχει τετμημένη $2$. Πόση είναι η απόστασή του από την εστία;`,
      fields: [{ label: "(PE) =", ans: 4 }],
      hint: R`Από τον ορισμό: $(PE)$ = απόσταση από τη διευθετούσα.`,
      sol: R`$\alpha = 2$, διευθετούσα $x = -2$. Από τον ορισμό: $(PE) = d(P, \delta) = 2 - (-2) = 4$. (Επαλήθευση: $P(2, \pm4)$, $E(2,0)$ ⇒ $(PE) = 4$ ✓.)` }
  ]
},

/* ═════════════ 7.3–7.5 ═════════════ */
{
  id: "7.3–7.5", unit: 7, title: "Θέσεις ως προς παραβολή – Εφαπτομένη & κάθετη",
  book: "Γ΄ Τεύχος §7.3–7.5 · Δραστηριότητες σελ. 87, 94 · Ενότητας σελ. 96",
  theory: R`
<div class="tbox"><h4>Θέση σημείου $P(x_0,y_0)$ ως προς την $y^2 = 4\alpha x$</h4>
<p>Υπολογίζουμε $A = y_0^2 - 4\alpha x_0$: $\;A > 0$ <b>εκτός</b> · $A = 0$ <b>πάνω</b> στην παραβολή · $A < 0$ <b>εντός</b>.</p></div>
<div class="tbox"><h4>Θέση ευθείας</h4>
<p>Λύνουμε το σύστημα ευθείας–παραβολής ⇒ δευτεροβάθμια: $\Delta > 0$ τέμνει σε δύο σημεία, $\Delta = 0$ <b>εφάπτεται</b>, $\Delta < 0$ κανένα κοινό σημείο. (Ευθεία παράλληλη στον άξονα τέμνει σε <b>ένα</b> σημείο χωρίς να εφάπτεται!)</p></div>
<div class="tbox"><h4>Εφαπτομένη στο $T(x_1, y_1)$ της $y^2 = 4\alpha x$</h4>
$$y\,y_1 = 2\alpha(x + x_1)$$
<p>Σε παραμετρική μορφή, στο σημείο $(\alpha t^2, 2\alpha t)$: $\;t\,y = x + \alpha t^2$. Η <b>κάθετη</b> (normal) είναι κάθετη στην εφαπτομένη στο ίδιο σημείο: κλίση $\lambda_\kappa = -\frac{1}{\lambda_\varepsilon}$.</p></div>`,
  widget: "parabola",
  exercises: [
    { level: 1, type: "mc", q: R`Το σημείο $(3, 4)$ ως προς την παραβολή $y^2 = 4x$ είναι:`, options: ["εντός", "πάνω στην παραβολή", "εκτός"], correct: 2,
      hint: R`$A = 16 - 12$.`, sol: R`$A = 4^2 - 4\cdot3 = 4 > 0$ ⇒ εκτός της παραβολής.` },
    { level: 1, type: "expr", ref: "x+2", key: "x+2", q: R`Να βρείτε την εφαπτομένη της $y^2 = 8x$ στο σημείο $T(2, 4)$. $\;y =$`,
      hint: R`$yy_1 = 2\alpha(x + x_1)$ με $\alpha = 2$.`, sol: R`$4y = 4(x + 2) \Rightarrow y = x + 2$.` },
    { level: 2, type: "expr", ref: "6-x", key: "6-x", q: R`Να βρείτε την κάθετη της $y^2 = 8x$ στο σημείο $T(2, 4)$. $\;y =$`,
      hint: R`Εφαπτομένη κλίσης 1 ⇒ κάθετη κλίσης $-1$.`, sol: R`$y - 4 = -(x - 2) \Rightarrow y = 6 - x$.` },
    { level: 2, type: "fields", q: R`Για ποια τιμή του $k$ η ευθεία $y = x + k$ εφάπτεται στην παραβολή $y^2 = 8x$;`,
      fields: [{ label: "k =", ans: 2 }], hint: R`$(x+k)^2 = 8x$ ⇒ δευτεροβάθμια με $\Delta = 0$.`,
      sol: R`$x^2 + (2k - 8)x + k^2 = 0$, $\Delta = (2k-8)^2 - 4k^2 = 64 - 32k = 0 \Rightarrow k = 2$. (Ταιριάζει με την προηγούμενη άσκηση!)` },
    { level: 2, type: "fields", q: R`Να βρείτε τα κοινά σημεία της ευθείας $y = 2x - 4$ και της $y^2 = 4x$.`,
      fields: [{ label: "1ο σημείο x =", ans: 1 }, { label: "y =", ans: -2 }, { label: "2ο σημείο x =", ans: 4 }, { label: "y =", ans: 4 }],
      hint: R`$(2x - 4)^2 = 4x \Rightarrow x^2 - 5x + 4 = 0$.`, sol: R`$x = 1$ ($y = -2$) και $x = 4$ ($y = 4$).` },
    { level: 3, type: "fields", q: R`Από το σημείο $(-2, 0)$ φέρνουμε εφαπτόμενες στην $y^2 = 8x$. Να βρείτε τη θετική κλίση. Τι παρατηρείτε για τις δύο εφαπτόμενες;`,
      fields: [{ label: "κλίση λ =", ans: 1 }],
      hint: R`$y = \lambda(x+2)$, αντικατάσταση και $\Delta = 0$.`,
      sol: R`$\lambda^2x^2 + (4\lambda^2 - 8)x + 4\lambda^2 = 0$, $\Delta = 64 - 64\lambda^2 = 0 \Rightarrow \lambda = \pm1$.<br>$\lambda_1\lambda_2 = -1$ ⇒ οι εφαπτόμενες είναι <b>κάθετες</b>. Συμβαίνει πάντα όταν το σημείο ανήκει στη διευθετούσα ($x = -2$)!` }
  ]
},

/* ═════════════ 4.1–4.3 ═════════════ */
{
  id: "4.1–4.3", unit: 4, title: "Σειρές – Σ-συμβολισμός – Σύγκλιση",
  book: "Β΄ Τεύχος §4.1–4.3 · Δραστηριότητες σελ. 67",
  theory: R`
<div class="tbox"><h4>Σ-συμβολισμός</h4>
$$\sum_{\kappa=1}^{\nu}\alpha_\kappa = \alpha_1 + \alpha_2 + \dots + \alpha_\nu, \qquad \sum_{\kappa=1}^{\nu}(\lambda\alpha_\kappa + \mu\beta_\kappa) = \lambda\sum\alpha_\kappa + \mu\sum\beta_\kappa, \qquad \sum_{\kappa=1}^{\nu} c = \nu c$$</div>
<div class="tbox"><h4>Σύγκλιση σειράς</h4>
<p>Η σειρά $\sum_{\kappa=1}^{\infty}\alpha_\kappa$ <b>συγκλίνει</b> στο $s$ αν η ακολουθία των <b>μερικών αθροισμάτων</b> $s_\nu = \alpha_1 + \dots + \alpha_\nu$ συγκλίνει στο $s$. Τότε $s$ είναι το <b>άθροισμα</b> της σειράς· αλλιώς η σειρά <b>αποκλίνει</b>.</p></div>
<div class="tbox tip"><h4>Γεωμετρική σειρά</h4>
$$\sum_{\kappa=1}^{\infty}\alpha\lambda^{\kappa-1} = \alpha + \alpha\lambda + \alpha\lambda^2 + \dots = \frac{\alpha}{1-\lambda}, \quad \text{αν } |\lambda| < 1$$
<p>Αν $|\lambda| \ge 1$ (και $\alpha \ne 0$) αποκλίνει. Εφαρμογή: περιοδικοί δεκαδικοί, π.χ. $0{,}\overline{7} = \frac{7}{9}$.</p></div>
<div class="tbox warn"><h4>⚠ Η αρμονική σειρά αποκλίνει</h4><p>$\sum\frac1\kappa = 1 + \frac12 + \frac13 + \dots = +\infty$, παρόλο που $\frac1\kappa \to 0$. Το $\alpha_\kappa \to 0$ είναι <b>αναγκαίο</b> αλλά <b>όχι ικανό</b> για σύγκλιση.</p></div>`,
  widget: "series",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε: $\displaystyle\sum_{\kappa=1}^{5}(2\kappa + 1)$, $\;\displaystyle\sum_{\kappa=1}^{10}3$ και $\displaystyle\sum_{\kappa=1}^{4}\kappa^2$.`,
      fields: [{ label: "1ο =", ans: 35 }, { label: "2ο =", ans: 30 }, { label: "3ο =", ans: 30 }],
      hint: R`Γράψε τους όρους. Στο δεύτερο: $\sum c = \nu c$.`, sol: R`$3+5+7+9+11 = 35$ · $\;10\cdot3 = 30$ · $\;1+4+9+16 = 30$.` },
    { level: 1, type: "fields", q: R`Να βρείτε το άθροισμα $1 + \frac12 + \frac14 + \frac18 + \dots$`,
      fields: [{ label: "άθροισμα =", ans: 2 }], hint: R`Γεωμετρική με $\alpha = 1$, $\lambda = \frac12$.`, sol: R`$\frac{1}{1 - \frac12} = 2$.` },
    { level: 2, type: "fields", q: R`Να βρείτε το άθροισμα $\displaystyle\sum_{\kappa=1}^{\infty}3\left(\frac23\right)^\kappa$.`,
      fields: [{ label: "άθροισμα =", ans: 6 }], hint: R`Πρώτος όρος ($\kappa = 1$): $\alpha = 2$, λόγος $\lambda = \frac23$.`,
      sol: R`$\alpha = 3\cdot\frac23 = 2$, $\lambda = \frac23$ ⇒ $\frac{2}{1 - \frac23} = 6$.` },
    { level: 2, type: "fields", q: R`Να γράψετε τον περιοδικό δεκαδικό $0{,}777\dots$ ως κλάσμα.`,
      fields: [{ label: "κλάσμα =", ans: "7/9" }], hint: R`$\frac{7}{10} + \frac{7}{100} + \dots$`, sol: R`Γεωμετρική με $\alpha = \frac{7}{10}$, $\lambda = \frac{1}{10}$: $\frac{7/10}{9/10} = \frac79$.` },
    { level: 2, type: "mc", q: R`Ποια από τις σειρές <b>συγκλίνει</b>;`,
      options: ["$\\sum\\frac1\\kappa$", "$\\sum(-1)^\\kappa$", "$\\sum\\left(\\frac12\\right)^\\kappa$", "$\\sum 2^\\kappa$"], correct: 2,
      hint: R`Γεωμετρική με $|\lambda| < 1$.`, sol: R`Η $\sum(\frac12)^\kappa$ είναι γεωμετρική με $|\lambda| = \frac12 < 1$ (άθροισμα 1). Η αρμονική αποκλίνει, η $\sum(-1)^\kappa$ ταλαντεύεται, η $\sum 2^\kappa \to \infty$.` },
    { level: 3, type: "fields", q: R`Να βρείτε το άθροισμα $\displaystyle\sum_{\kappa=1}^{\infty}\frac{2^\kappa + 3^\kappa}{6^\kappa}$.`,
      fields: [{ label: "άθροισμα =", ans: "3/2" }], hint: R`Σπάσε: $\left(\frac13\right)^\kappa + \left(\frac12\right)^\kappa$.`,
      sol: R`$\sum(\frac13)^\kappa = \frac{1/3}{2/3} = \frac12$, $\;\sum(\frac12)^\kappa = 1$. Σύνολο $\frac32$.` }
  ]
},

/* ═════════════ 4.4–4.5 ═════════════ */
{
  id: "4.4–4.5", unit: 4, title: "Ειδικά αθροίσματα – Μέθοδοι υπολογισμού",
  book: "Β΄ Τεύχος §4.4–4.5 · Δραστηριότητες σελ. 75, 80 · Ενότητας σελ. 81",
  theory: R`
<div class="tbox"><h4>Βασικά αθροίσματα</h4>
$$S_1 = \sum_{\kappa=1}^{\nu}\kappa = \frac{\nu(\nu+1)}{2}, \qquad S_2 = \sum_{\kappa=1}^{\nu}\kappa^2 = \frac{\nu(\nu+1)(2\nu+1)}{6}, \qquad S_3 = \sum_{\kappa=1}^{\nu}\kappa^3 = \left(\frac{\nu(\nu+1)}{2}\right)^2$$</div>
<div class="tbox"><h4>Μέθοδος διαφορών (τηλεσκοπικά αθροίσματα)</h4>
<p>Αν $\alpha_\kappa = f(\kappa) - f(\kappa+1)$, τότε σχεδόν όλοι οι όροι διαγράφονται:</p>
$$\sum_{\kappa=1}^{\nu}\alpha_\kappa = f(1) - f(\nu+1)$$
<p>Π.χ. $\frac{1}{\kappa(\kappa+1)} = \frac1\kappa - \frac{1}{\kappa+1}$ ⇒ $\sum_{\kappa=1}^{\nu} = 1 - \frac{1}{\nu+1}$ (απλά κλάσματα!).</p></div>
<div class="tbox tip"><h4>Συνδυασμός</h4><p>$\sum\kappa(\kappa+1) = \sum\kappa^2 + \sum\kappa = S_2 + S_1$. Πάντα σπάμε σε βασικά αθροίσματα.</p></div>`,
  widget: "series",
  gen: "gsum",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε: $\displaystyle\sum_{\kappa=1}^{20}\kappa$, $\;\displaystyle\sum_{\kappa=1}^{10}\kappa^2$, $\;\displaystyle\sum_{\kappa=1}^{5}\kappa^3$.`,
      fields: [{ label: "S₁(20) =", ans: 210 }, { label: "S₂(10) =", ans: 385 }, { label: "S₃(5) =", ans: 225 }],
      hint: R`Τύποι $S_1, S_2, S_3$.`, sol: R`$\frac{20\cdot21}{2} = 210$ · $\;\frac{10\cdot11\cdot21}{6} = 385$ · $\;\left(\frac{5\cdot6}{2}\right)^2 = 225$.` },
    { level: 2, type: "expr", ref: "x^2", key: "ν^2", pos: [1, 9], q: R`Να βρείτε σε κλειστή μορφή το $\displaystyle\sum_{\kappa=1}^{\nu}(2\kappa - 1)$ (άθροισμα των $\nu$ πρώτων περιττών). $\;=$`,
      hint: R`$2S_1 - \nu$.`, sol: R`$2\cdot\frac{\nu(\nu+1)}{2} - \nu = \nu^2 + \nu - \nu = \nu^2$.` },
    { level: 2, type: "expr", ref: "x(x+1)(x+2)/3", key: "ν(ν+1)(ν+2)/3", pos: [1, 9], q: R`Να βρείτε σε κλειστή μορφή το $\displaystyle\sum_{\kappa=1}^{\nu}\kappa(\kappa+1)$. $\;=$`,
      hint: R`$S_2 + S_1$, κοινός παράγοντας $\frac{\nu(\nu+1)}{6}$.`,
      sol: R`$\frac{\nu(\nu+1)(2\nu+1)}{6} + \frac{\nu(\nu+1)}{2} = \frac{\nu(\nu+1)}{6}(2\nu + 1 + 3) = \frac{\nu(\nu+1)(\nu+2)}{3}$.` },
    { level: 2, type: "fields", q: R`Για τη σειρά $\displaystyle\sum_{\kappa=1}^{\infty}\frac{1}{\kappa(\kappa+1)}$ να βρείτε το μερικό άθροισμα $s_9$ και το άθροισμα της σειράς.`,
      fields: [{ label: "s₉ =", ans: "9/10" }, { label: "άθροισμα =", ans: 1 }],
      hint: R`Τηλεσκοπικό: $s_\nu = 1 - \frac{1}{\nu+1}$.`, sol: R`$s_9 = 1 - \frac{1}{10} = \frac{9}{10}$, $\;\lim s_\nu = 1$.` },
    { level: 3, type: "fields", q: R`Να βρείτε το άθροισμα $\displaystyle\sum_{\kappa=1}^{\infty}\frac{1}{(2\kappa-1)(2\kappa+1)}$.`,
      fields: [{ label: "άθροισμα =", ans: "1/2" }],
      hint: R`$\frac{1}{(2\kappa-1)(2\kappa+1)} = \frac12\left(\frac{1}{2\kappa-1} - \frac{1}{2\kappa+1}\right)$.`,
      sol: R`$s_\nu = \frac12\left(1 - \frac{1}{2\nu+1}\right) \to \frac12$.` }
  ]
},

/* ═════════════ 5.1–5.2 ═════════════ */
{
  id: "5.1–5.2", unit: 5, title: "Ορισμένο ολοκλήρωμα – Ορισμός & ιδιότητες",
  book: "Β΄ Τεύχος §5.1–5.2 · Δραστηριότητες σελ. 92, 96",
  theory: R`
<div class="tbox"><h4>Από το εμβαδόν στο ολοκλήρωμα</h4>
<p>Χωρίζουμε το $[\alpha,\beta]$ σε $\nu$ ίσα υποδιαστήματα πλάτους $\Delta x = \frac{\beta-\alpha}{\nu}$ και αθροίζουμε εμβαδά ορθογωνίων. Το όριο των αθροισμάτων (Riemann) για $\nu \to \infty$ είναι το <b>ορισμένο ολοκλήρωμα</b>:</p>
$$\int_\alpha^\beta f(x)\,dx = \lim_{\nu\to\infty}\sum_{\kappa=1}^{\nu} f(\xi_\kappa)\,\Delta x$$
<p>Αν $f \ge 0$, ισούται με το <b>εμβαδόν</b> κάτω από τη $C_f$.</p></div>
<div class="tbox"><h4>Ιδιότητες</h4>
<ul><li>$\int_\alpha^\beta(\lambda f + \mu g) = \lambda\int_\alpha^\beta f + \mu\int_\alpha^\beta g$</li>
<li>$\int_\alpha^\alpha f = 0$, $\;\int_\beta^\alpha f = -\int_\alpha^\beta f$, $\;\int_\alpha^\beta f = \int_\alpha^\gamma f + \int_\gamma^\beta f$</li>
<li>Αν $f \ge 0$ στο $[\alpha,\beta]$ ⇒ $\int_\alpha^\beta f \ge 0$ · αν $m \le f \le M$ ⇒ $m(\beta - \alpha) \le \int_\alpha^\beta f \le M(\beta-\alpha)$</li></ul></div>
<div class="tbox tip"><h4>Συμμετρία</h4><p>Περιττή $f$: $\int_{-\alpha}^{\alpha} f = 0$ · Άρτια $f$: $\int_{-\alpha}^{\alpha} f = 2\int_0^\alpha f$.</p></div>`,
  widget: "riemann",
  exercises: [
    { level: 1, type: "fields", q: R`Αν $\int_0^3 f(x)dx = 5$ και $\int_0^3 g(x)dx = 2$, να βρείτε το $\int_0^3\big(2f(x) - 3g(x)\big)dx$.`,
      fields: [{ label: "τιμή =", ans: 4 }], hint: R`Γραμμικότητα.`, sol: R`$2\cdot5 - 3\cdot2 = 4$.` },
    { level: 1, type: "fields", q: R`Αν $\int_1^4 f = 7$ και $\int_1^2 f = 3$, να βρείτε $\int_2^4 f$ και $\int_4^1 f$.`,
      fields: [{ label: "∫₂⁴ f =", ans: 4 }, { label: "∫₄¹ f =", ans: -7 }], hint: R`Προσθετικότητα και αλλαγή άκρων.`, sol: R`$\int_2^4 f = 7 - 3 = 4$ · $\;\int_4^1 f = -\int_1^4 f = -7$.` },
    { level: 1, type: "fields", q: R`Πόσο κάνει $\displaystyle\int_{-1}^{1}x^3\,dx$;`,
      fields: [{ label: "τιμή =", ans: 0 }], hint: R`Η $x^3$ είναι περιττή.`, sol: R`Περιττή σε συμμετρικό διάστημα ⇒ $0$ (τα «θετικά» και «αρνητικά» εμβαδά αλληλοαναιρούνται).` },
    { level: 2, type: "fields", q: R`Χρησιμοποιώντας γεωμετρία, να υπολογίσετε το $\displaystyle\int_0^2\sqrt{4 - x^2}\,dx$.`,
      fields: [{ label: "τιμή =", ans: "pi" }], hint: R`Η $y = \sqrt{4-x^2}$ είναι το πάνω μισό του κύκλου ακτίνας 2.`, sol: R`Είναι το εμβαδόν ενός <b>τεταρτοκυκλίου</b> ακτίνας 2: $\frac14\pi\cdot4 = \pi$.` },
    { level: 2, type: "mc", q: R`Για το $I = \int_0^1 e^{x^2}dx$ ισχύει:`, options: ["$0 \\le I \\le 1$", "$1 \\le I \\le e$", "$I \\ge e$", "$I < 0$"], correct: 1,
      hint: R`Στο $[0,1]$: $1 \le e^{x^2} \le e$.`, sol: R`$m = 1$, $M = e$ στο $[0,1]$ (αύξουσα) ⇒ $1\cdot1 \le I \le e\cdot1$.` },
    { level: 3, type: "fields", q: R`Να υπολογίσετε το όριο $\displaystyle\lim_{\nu\to\infty}\frac1\nu\sum_{\kappa=1}^{\nu}\left(\frac\kappa\nu\right)^2$.`,
      fields: [{ label: "όριο =", ans: "1/3" }], hint: R`Άθροισμα Riemann της $f(x) = x^2$ στο $[0,1]$ με $\Delta x = \frac1\nu$.`,
      sol: R`$= \int_0^1 x^2dx = \frac13$. (Ή με $S_2$: $\frac{1}{\nu^3}\cdot\frac{\nu(\nu+1)(2\nu+1)}{6} \to \frac{2}{6} = \frac13$.)` }
  ]
},

/* ═════════════ 5.3 ═════════════ */
{
  id: "5.3", unit: 5, title: "Θεμελιώδες Θεώρημα Ολοκληρωτικού Λογισμού",
  book: "Β΄ Τεύχος §5.3 · Δραστηριότητες σελ. 107",
  theory: R`
<div class="tbox"><h4>Θεμελιώδες Θεώρημα (ΘΘΟΛ)</h4>
<p><b>Μέρος 1:</b> αν η $f$ είναι συνεχής, η $F(x) = \int_\alpha^x f(t)\,dt$ είναι παραγωγίσιμη με $F'(x) = f(x)$.</p>
<p><b>Μέρος 2:</b> αν $G$ είναι οποιαδήποτε αντιπαράγωγος της $f$:</p>
$$\int_\alpha^\beta f(x)\,dx = \Big[G(x)\Big]_\alpha^\beta = G(\beta) - G(\alpha)$$</div>
<div class="tbox"><h4>Με μεταβλητό άκρο</h4>
$$\frac{d}{dx}\int_\alpha^{g(x)} f(t)\,dt = f\big(g(x)\big)\cdot g'(x)$$</div>
<div class="tbox tip"><h4>Αντικατάσταση & κατά παράγοντες σε ορισμένο</h4>
<p>Με αντικατάσταση <b>αλλάζουμε και τα άκρα</b> (ή επιστρέφουμε στο $x$). Κατά παράγοντες: $\int_\alpha^\beta fg' = [fg]_\alpha^\beta - \int_\alpha^\beta f'g$.</p></div>`,
  widget: "family",
  gen: "gdef",
  exercises: [
    { level: 1, type: "fields", q: R`Να υπολογίσετε: $\displaystyle\int_0^1(3x^2 + 2x)\,dx$ και $\displaystyle\int_0^1\frac{dx}{1+x^2}$.`,
      fields: [{ label: "1ο =", ans: 2 }, { label: "2ο =", ans: "pi/4" }], hint: R`$[x^3 + x^2]_0^1$ και $[\text{τοξεφ}x]_0^1$.`, sol: R`$1 + 1 = 2$ · $\;\text{τοξεφ}1 - \text{τοξεφ}0 = \frac\pi4$.` },
    { level: 1, type: "fields", q: R`Να υπολογίσετε: $\displaystyle\int_0^{\pi/2}\text{συν}x\,dx$ και $\displaystyle\int_1^e\frac{dx}{x}$.`,
      fields: [{ label: "1ο =", ans: 1 }, { label: "2ο =", ans: 1 }], hint: R`$[\text{ημ}x]$ και $[\ln x]$.`, sol: R`$\text{ημ}\frac\pi2 - \text{ημ}0 = 1$ · $\;\ln e - \ln 1 = 1$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε: $\displaystyle\int_0^1 x\,e^x\,dx$ και $\displaystyle\int_0^1\frac{x}{x^2+1}dx$.`,
      fields: [{ label: "1ο =", ans: 1 }, { label: "2ο =", ans: "ln2/2" }], hint: R`Κατά παράγοντες· και αντικατάσταση $u = x^2 + 1$.`,
      sol: R`$[(x-1)e^x]_0^1 = 0 - (-1) = 1$ · $\;\left[\frac12\ln(x^2+1)\right]_0^1 = \frac{\ln 2}{2}$.` },
    { level: 2, type: "fields", q: R`Να υπολογίσετε $\displaystyle\int_0^{\pi}\text{ημ}^2x\,dx$.`,
      fields: [{ label: "τιμή =", ans: "pi/2" }], hint: R`$\text{ημ}^2x = \frac{1 - \text{συν}2x}{2}$.`, sol: R`$\left[\frac x2 - \frac{\text{ημ}2x}{4}\right]_0^\pi = \frac\pi2$.` },
    { level: 3, type: "expr", ref: "4x ln(x)", key: "4x ln x", pos: true, q: R`Αν $F(x) = \displaystyle\int_1^{x^2}\ln t\,dt$, $x > 0$, να βρείτε την $F'(x)$. $\;F'(x) =$`,
      hint: R`$f(g(x))\cdot g'(x)$ με $g(x) = x^2$.`, sol: R`$F'(x) = \ln(x^2)\cdot 2x = 4x\ln x$.` },
    { level: 2, type: "fields", q: R`Δίνεται $F(x) = \displaystyle\int_0^x (t^2 - 4)\,dt$. Να βρείτε τις θέσεις των τοπικών ακροτάτων της $F$ και το τοπικό μέγιστο.`,
      fields: [{ label: "τοπ. μέγιστο στο x =", ans: -2 }, { label: "τοπ. ελάχιστο στο x =", ans: 2 }, { label: "τοπ. μέγιστη τιμή =", ans: "16/3" }],
      hint: R`ΘΘΟΛ: $F'(x) = x^2 - 4$.`,
      sol: R`$F'(x) = x^2 - 4$: $+$, $-$, $+$. Τοπ. μέγιστο στο $-2$, τοπ. ελάχιστο στο $2$. $F(x) = \frac{x^3}{3} - 4x$, $F(-2) = -\frac83 + 8 = \frac{16}{3}$.` },
    { level: 2, type: "fields", q: R`Δίνεται $F(x) = \displaystyle\int_1^x e^{t^2}\,dt$. Να βρείτε το $F(1)$ και την κλίση της εφαπτομένης της $C_F$ στο $x = 1$ (γράψτε <code>e</code>).`,
      fields: [{ label: "F(1) =", ans: 0 }, { label: "F′(1) =", ans: "e", tol: 0.0005 }],
      hint: R`$\int_1^1 = 0$ και $F'(x) = e^{x^2}$.`,
      sol: R`$F(1) = 0$, $F'(1) = e^{1} = e$. Εφαπτομένη: $y = e(x - 1)$.` },
    { level: 2, type: "expr", label: "G′(x) =", ref: "2x*sqrt(1+x^2)", key: "2x*sqrt(1+x^2)", q: R`Αν $G(x) = \displaystyle\int_0^{x^2}\sqrt{1 + t}\,dt$, να βρείτε την $G'(x)$.`,
      hint: R`$\left(\int_\alpha^{g(x)} f(t)\,dt\right)' = f(g(x))\,g'(x)$.`,
      sol: R`$G'(x) = \sqrt{1 + x^2}\cdot 2x$.` },
    { level: 2, type: "mc", q: R`Ποια ανισότητα προκύπτει από το ότι $e^{t^2} \ge 1$ για κάθε $t$;`,
      options: ["$\\displaystyle\\int_0^1 e^{t^2}dt \\ge 1$", "$\\displaystyle\\int_0^1 e^{t^2}dt \\le 1$", "$\\displaystyle\\int_0^1 e^{t^2}dt = e$", "$\\displaystyle\\int_0^1 e^{t^2}dt \\le 0$"], correct: 0,
      hint: R`Αν $f \ge g$ στο $[\alpha, \beta]$, τότε $\int_\alpha^\beta f \ge \int_\alpha^\beta g$.`,
      sol: R`$\int_0^1 e^{t^2}dt \ge \int_0^1 1\,dt = 1$ (μάλιστα γνήσια, αφού $e^{t^2} > 1$ για $t \ne 0$).` }
  ]
},

/* ═════════════ 5.4.1 ═════════════ */
{
  id: "5.4.1", unit: 5, title: "Υπολογισμός εμβαδού",
  book: "Β΄ Τεύχος §5.4.1 · Δραστηριότητες σελ. 121",
  theory: R`
<div class="tbox"><h4>Εμβαδόν μεταξύ $C_f$ και άξονα $x'x$</h4>
$$E = \int_\alpha^\beta|f(x)|\,dx$$
<p>Αν η $f$ αλλάζει πρόσημο, <b>σπάμε</b> το διάστημα στις ρίζες της και αθροίζουμε απόλυτες τιμές.</p></div>
<div class="tbox"><h4>Εμβαδόν μεταξύ δύο καμπυλών</h4>
$$E = \int_\alpha^\beta\big(f(x) - g(x)\big)dx, \quad \text{όπου } f(x) \ge g(x) \text{ στο } [\alpha,\beta]$$
<p>Τα όρια $\alpha, \beta$ είναι συνήθως οι τετμημένες των <b>σημείων τομής</b>. «Πάνω μείον κάτω».</p></div>
<div class="tbox tip"><h4>Ολοκλήρωση ως προς $y$</h4><p>Όταν η περιοχή φράσσεται από καμπύλες της μορφής $x = h(y)$ (π.χ. παραβολή $y^2 = 4x$), είναι συχνά ευκολότερο: $E = \int_c^d(\text{δεξιά} - \text{αριστερά})\,dy$.</p></div>`,
  widget: "area",
  exercises: [
    { level: 1, type: "fields", q: R`Να βρείτε το εμβαδόν του χωρίου που περικλείεται από την $y = x^2$, τον $x'x$ και την ευθεία $x = 3$.`,
      fields: [{ label: "E =", ans: 9 }], hint: R`$\int_0^3 x^2dx$.`, sol: R`$\left[\frac{x^3}{3}\right]_0^3 = 9$ τ.μ.` },
    { level: 1, type: "fields", q: R`Να βρείτε το εμβαδόν μεταξύ των καμπυλών $y = x$ και $y = x^2$.`,
      fields: [{ label: "E =", ans: "1/6" }], hint: R`Τομή στα $x = 0, 1$· στο $[0,1]$ η $x \ge x^2$.`, sol: R`$\int_0^1(x - x^2)dx = \frac12 - \frac13 = \frac16$ τ.μ.` },
    { level: 2, type: "fields", q: R`Να βρείτε το εμβαδόν του χωρίου μεταξύ της $y = x^2 - 4$ και του άξονα $x'x$.`,
      fields: [{ label: "E =", ans: "32/3" }], hint: R`Ρίζες $\pm2$, η συνάρτηση είναι αρνητική ανάμεσα.`, sol: R`$\int_{-2}^{2}(4 - x^2)dx = \left[4x - \frac{x^3}{3}\right]_{-2}^2 = \frac{32}{3}$ τ.μ.` },
    { level: 2, type: "fields", q: R`Να βρείτε το εμβαδόν μεταξύ της $y = \text{ημ}x$ και του $x'x$ στο $[0, 2\pi]$.`,
      fields: [{ label: "E =", ans: 4 }], hint: R`Προσοχή: $\int_0^{2\pi}\text{ημ}x\,dx = 0$, αλλά το εμβαδόν δεν είναι 0!`,
      sol: R`$E = \int_0^\pi\text{ημ}x\,dx + \left|\int_\pi^{2\pi}\text{ημ}x\,dx\right| = 2 + 2 = 4$ τ.μ.` },
    { level: 2, type: "fields", q: R`Να βρείτε το εμβαδόν μεταξύ των $y = e^x$, $y = 1$ και $x = 1$.`,
      fields: [{ label: "E =", ans: "e-2" }], hint: R`Στο $[0,1]$: $e^x \ge 1$.`, sol: R`$\int_0^1(e^x - 1)dx = (e - 1) - 1 = e - 2$ τ.μ.` },
    { level: 3, type: "fields", q: R`Να βρείτε το εμβαδόν του χωρίου μεταξύ της παραβολής $y^2 = 4x$ και της ευθείας $y = 2x - 4$.`,
      fields: [{ label: "E =", ans: 9 }],
      hint: R`Τομή στα $(1,-2)$ και $(4,4)$. Ολοκλήρωσε ως προς $y$: δεξιά $x = \frac{y+4}{2}$, αριστερά $x = \frac{y^2}{4}$.`,
      sol: R`$E = \int_{-2}^{4}\left(\frac{y+4}{2} - \frac{y^2}{4}\right)dy = \left[\frac{y^2}{4} + 2y - \frac{y^3}{12}\right]_{-2}^{4} = \frac{20}{3} + \frac{7}{3} = 9$ τ.μ.` }
  ]
},

/* ═════════════ 5.4.2 ═════════════ */
{
  id: "5.4.2", unit: 5, title: "Όγκος στερεού εκ περιστροφής",
  book: "Β΄ Τεύχος §5.4.2 · Δραστηριότητες σελ. 135 · Ενότητας σελ. 137",
  theory: R`
<div class="tbox"><h4>Περιστροφή γύρω από τον $x'x$</h4>
$$V = \pi\int_\alpha^\beta y^2\,dx = \pi\int_\alpha^\beta f^2(x)\,dx$$
<p>Κάθε κατακόρυφη λωρίδα δημιουργεί έναν λεπτό δίσκο ακτίνας $f(x)$.</p></div>
<div class="tbox"><h4>Χωρίο μεταξύ δύο καμπυλών ($f \ge g \ge 0$)</h4>
$$V = \pi\int_\alpha^\beta\big(f^2(x) - g^2(x)\big)dx$$
<p>⚠ <b>Όχι</b> $\pi\int(f - g)^2$ — αφαιρούμε όγκους, όχι ακτίνες!</p></div>
<div class="tbox"><h4>Περιστροφή γύρω από τον $y'y$</h4>
$$V = \pi\int_c^d x^2\,dy$$</div>
<div class="tbox warn"><h4>⚠ Εκτός ύλης 2026–27</h4><p>Περιστροφή γύρω από ευθείες $y = \lambda$ ή $x = \lambda$ με $\lambda \ne 0$ (σελ. 130–134).</p></div>`,
  widget: "volume",
  exercises: [
    { level: 1, type: "fields", q: R`Το χωρίο κάτω από την $y = x$, $0 \le x \le 3$, περιστρέφεται γύρω από τον $x'x$. Να βρείτε τον όγκο.`,
      fields: [{ label: "V =", ans: "9pi" }], hint: R`$\pi\int_0^3x^2dx$. Ποιο στερεό είναι;`, sol: R`$\pi\left[\frac{x^3}{3}\right]_0^3 = 9\pi$ κ.μ. — ένας κώνος με $R = 3$, $\upsilon = 3$ ($\frac13\pi\cdot9\cdot3$ ✓).` },
    { level: 1, type: "fields", q: R`Το χωρίο κάτω από την $y = \sqrt x$, $0 \le x \le 4$, περιστρέφεται γύρω από τον $x'x$. Να βρείτε τον όγκο.`,
      fields: [{ label: "V =", ans: "8pi" }], hint: R`$y^2 = x$.`, sol: R`$\pi\int_0^4 x\,dx = 8\pi$ κ.μ.` },
    { level: 2, type: "fields", q: R`Αποδείξτε με ολοκλήρωμα τον όγκο της σφαίρας ακτίνας $3$: περιστροφή της $y = \sqrt{9 - x^2}$ γύρω από τον $x'x$.`,
      fields: [{ label: "V =", ans: "36pi" }], hint: R`$\pi\int_{-3}^{3}(9 - x^2)dx$.`, sol: R`$\pi\left[9x - \frac{x^3}{3}\right]_{-3}^{3} = \pi(18 + 18) = 36\pi = \frac43\pi\cdot27$ ✓.` },
    { level: 2, type: "fields", q: R`Το χωρίο μεταξύ $y = x$ και $y = x^2$ περιστρέφεται γύρω από τον $x'x$. Να βρείτε τον όγκο.`,
      fields: [{ label: "V =", ans: "2pi/15" }], hint: R`Στο $[0,1]$: $x \ge x^2$ ⇒ $\pi\int(x^2 - x^4)dx$.`, sol: R`$\pi\left(\frac13 - \frac15\right) = \frac{2\pi}{15}$ κ.μ.` },
    { level: 3, type: "fields", q: R`Το χωρίο μεταξύ της $y = x^2$, του $y'y$ και της $y = 4$ (για $x \ge 0$) περιστρέφεται γύρω από τον $y'y$. Να βρείτε τον όγκο.`,
      fields: [{ label: "V =", ans: "8pi" }], hint: R`$x^2 = y$ ⇒ $V = \pi\int_0^4 y\,dy$.`, sol: R`$\pi\left[\frac{y^2}{2}\right]_0^4 = 8\pi$ κ.μ.` },
    { level: 3, type: "fields", q: R`Το χωρίο κάτω από την $y = \text{ημ}x$, $0 \le x \le \pi$, περιστρέφεται γύρω από τον $x'x$. Να βρείτε τον όγκο.`,
      fields: [{ label: "V =", ans: "pi^2/2" }], hint: R`$\pi\int_0^\pi\text{ημ}^2x\,dx$ — το βρήκαμε στην §5.3!`, sol: R`$\pi\cdot\frac\pi2 = \frac{\pi^2}{2}$ κ.μ.` }
  ]
},

{
  id: "9", unit: 9, title: "Σύνολα – Αρχή Εγκλεισμού–Αποκλεισμού",
  book: "Δ΄ Τεύχος §9.1–9.3 · Δραστηριότητες σελ. 16 · Ενότητας σελ. 17",
  theory: R`
<div class="tbox"><h4>Πράξεις συνόλων</h4>
<p>Σε ένα βασικό σύνολο $\Omega$, για υποσύνολα $A, B$:</p>
<ul><li><b>Ένωση</b> $A \cup B$: στοιχεία που ανήκουν στο $A$ <b>ή</b> στο $B$ (ή και στα δύο)</li>
<li><b>Τομή</b> $A \cap B$: στοιχεία που ανήκουν <b>και</b> στα δύο</li>
<li><b>Διαφορά</b> $A - B$: στοιχεία του $A$ που <b>δεν</b> ανήκουν στο $B$</li>
<li><b>Συμπλήρωμα</b> $A'$: στοιχεία του $\Omega$ που δεν ανήκουν στο $A$</li></ul></div>

<div class="tbox"><h4>Ιδιότητες</h4>
<p>Αντιμεταθετική και προσεταιριστική για $\cup$, $\cap$ · Επιμεριστική: $A \cap (B \cup \Gamma) = (A \cap B) \cup (A \cap \Gamma)$</p>
<p><b>Νόμοι De Morgan:</b> $\;(A \cup B)' = A' \cap B'\;$ και $\;(A \cap B)' = A' \cup B'$</p>
<p>Επίσης: $A - B = A \cap B'$.</p></div>

<div class="tbox tip"><h4>Αρχή Εγκλεισμού – Αποκλεισμού</h4>
<p>Με $\nu(A)$ συμβολίζουμε το πλήθος των στοιχείων του $A$.</p>
$$\nu(A \cup B) = \nu(A) + \nu(B) - \nu(A \cap B)$$
<p>Αφαιρούμε την τομή γιατί τη μετρήσαμε <b>δύο φορές</b>. Για τρία σύνολα:</p>
$$\nu(A \cup B \cup \Gamma) = \nu(A) + \nu(B) + \nu(\Gamma) - \nu(A\cap B) - \nu(A \cap \Gamma) - \nu(B \cap \Gamma) + \nu(A \cap B \cap \Gamma)$$</div>`,
  widget: "venn",
  exercises: [
    { level: 1, type: "fields", q: R`Δίνονται $\Omega = \{1,2,\dots,8\}$, $A = \{1,2,3,4\}$ και $B = \{3,4,5,6\}$. Να βρείτε:`,
      fields: [{ label: "ν(A ∪ B) =", ans: 6 }, { label: "ν(A ∩ B) =", ans: 2 }, { label: "ν(A′) =", ans: 4 }, { label: "ν(A − B) =", ans: 2 }],
      hint: R`Γράψε τα σύνολα: $A \cup B = \{1,\dots,6\}$, $A \cap B = \{3,4\}$.`,
      sol: R`$A \cup B = \{1,2,3,4,5,6\}$ (6 στοιχεία), $A \cap B = \{3,4\}$ (2), $A' = \{5,6,7,8\}$ (4), $A - B = \{1,2\}$ (2).` },
    { level: 1, type: "mc", q: R`Το σύνολο $(A \cup B)'$ είναι ίσο με:`,
      options: ["$A' \\cup B'$", "$A' \\cap B'$", "$A \\cap B$", "$A - B$"], correct: 1,
      hint: R`Νόμος De Morgan: το συμπλήρωμα «γυρίζει» την ένωση σε τομή.`,
      sol: R`Από τον νόμο De Morgan: $(A \cup B)' = A' \cap B'$ — τα στοιχεία που δεν ανήκουν ούτε στο $A$ ούτε στο $B$.` },
    { level: 1, type: "fields", q: R`Σε μια τάξη $30$ μαθητών, $18$ παίζουν ποδόσφαιρο, $12$ μπάσκετ και $5$ και τα δύο. Πόσοι παίζουν τουλάχιστον ένα άθλημα και πόσοι κανένα;`,
      fields: [{ label: "τουλάχιστον ένα =", ans: 25 }, { label: "κανένα =", ans: 5 }],
      hint: R`$\nu(\Pi \cup M) = 18 + 12 - 5$.`,
      sol: R`$\nu(\Pi \cup M) = 18 + 12 - 5 = 25$. Κανένα: $30 - 25 = 5$.` },
    { level: 2, type: "fields", q: R`Αν $\nu(A) = 10$ και $\nu(A \cap B) = 4$, πόσο είναι το $\nu(A - B)$;`,
      fields: [{ label: "ν(A − B) =", ans: 6 }],
      hint: R`Το $A$ χωρίζεται σε δύο κομμάτια: $A - B$ και $A \cap B$.`,
      sol: R`$\nu(A) = \nu(A - B) + \nu(A \cap B) \Rightarrow \nu(A - B) = 10 - 4 = 6$.` },
    { level: 2, type: "fields", q: R`Πόσοι από τους αριθμούς $1, 2, \dots, 100$ διαιρούνται με το $2$ <b>ή</b> με το $3$;`,
      fields: [{ label: "πλήθος =", ans: 67 }],
      hint: R`Πολλαπλάσια του 2: 50, του 3: 33. Και των δύο = πολλαπλάσια του 6.`,
      sol: R`$\nu(A) = 50$, $\nu(B) = 33$, $\nu(A \cap B) = 16$ (πολλαπλάσια του 6, αφού $6 \cdot 16 = 96$).<br>$\nu(A \cup B) = 50 + 33 - 16 = 67$.` },
    { level: 3, type: "fields", q: R`Σε σχολείο $40$ μαθητών: $25$ μαθαίνουν Αγγλικά, $15$ Γαλλικά, $10$ Γερμανικά, $8$ Αγγλικά και Γαλλικά, $5$ Αγγλικά και Γερμανικά, $4$ Γαλλικά και Γερμανικά και $3$ και τις τρεις γλώσσες.`,
      fields: [{ label: "τουλάχιστον μία γλώσσα =", ans: 36 }, { label: "καμία γλώσσα =", ans: 4 }, { label: "μόνο Αγγλικά =", ans: 15 }],
      hint: R`Τύπος για τρία σύνολα. Για «μόνο Αγγλικά» σχεδίασε διάγραμμα Venn ξεκινώντας από το κέντρο (3).`,
      sol: R`$\nu(A \cup \Gamma \cup \Delta) = 25 + 15 + 10 - 8 - 5 - 4 + 3 = 36$, άρα καμία: $40 - 36 = 4$.<br>Μόνο Αγγλικά: $25 - 8 - 5 + 3 = 15$ (αφαιρούμε τις δύο τομές, αλλά το κέντρο αφαιρέθηκε δύο φορές, οπότε το ξαναπροσθέτουμε).` }
  ]
},
{
  id: "10.1", unit: 10, title: "Εισαγωγή στη Συνδυαστική",
  book: "Δ΄ Τεύχος §10.1 · Δραστηριότητες σελ. 29",
  theory: R`
<div class="tbox"><h4>Αρχή του Αθροίσματος («ή»)</h4>
<p>Αν μια επιλογή μπορεί να γίνει <b>είτε</b> με έναν από $\mu$ τρόπους <b>είτε</b> με έναν από $\nu$ άλλους τρόπους (χωρίς κοινούς), τότε υπάρχουν $\mu + \nu$ τρόποι.</p></div>
<div class="tbox"><h4>Πολλαπλασιαστική Αρχή («και μετά»)</h4>
<p>Αν μια διαδικασία γίνεται σε <b>φάσεις</b> — η 1η με $\nu_1$ τρόπους, η 2η με $\nu_2$ τρόπους, ..., η κ-οστή με $\nu_\kappa$ τρόπους — τότε συνολικά υπάρχουν</p>
$$\nu_1 \cdot \nu_2 \cdot \ldots \cdot \nu_\kappa \text{ τρόποι.}$$</div>
<div class="tbox tip"><h4>Μέθοδος «κουτάκια»</h4>
<p>Σχεδίασε ένα κουτάκι για κάθε θέση και γράψε μέσα πόσες επιλογές έχει. Ξεκίνα από τη θέση με τον <b>περιορισμό</b> (π.χ. το πρώτο ψηφίο δεν μπορεί να είναι 0, ο αριθμός να είναι άρτιος).</p>
<p>Τριψήφιοι με ψηφία $1$–$5$ χωρίς επανάληψη: $\boxed{5}\boxed{4}\boxed{3} = 60$.</p></div>`,
  widget: "tree",
  exercises: [
    { level: 1, type: "fields", q: R`Ένα εστιατόριο έχει $3$ ορεκτικά, $4$ κυρίως πιάτα και $2$ επιδόρπια. Πόσα διαφορετικά γεύματα (ένα από το καθένα) μπορούμε να παραγγείλουμε;`,
      fields: [{ label: "γεύματα =", ans: 24 }], hint: R`Τρεις φάσεις ⇒ πολλαπλασιαστική αρχή.`,
      sol: R`$3 \cdot 4 \cdot 2 = 24$.` },
    { level: 1, type: "fields", q: R`Ένας μαθητής πρέπει να διαλέξει <b>μία</b> εργασία: μία από $4$ εργασίες Γεωμετρίας ή μία από $5$ εργασίες Στατιστικής. Με πόσους τρόπους;`,
      fields: [{ label: "τρόποι =", ans: 9 }], hint: R`«ή» ⇒ αρχή του αθροίσματος.`,
      sol: R`Η επιλογή είναι <b>είτε</b> Γεωμετρίας <b>είτε</b> Στατιστικής: $4 + 5 = 9$ (όχι $4 \cdot 5$!).` },
    { level: 2, type: "fields", q: R`Πόσοι τριψήφιοι αριθμοί σχηματίζονται με τα ψηφία $1, 2, 3, 4, 5$:`,
      fields: [{ label: "με επανάληψη ψηφίων =", ans: 125 }, { label: "χωρίς επανάληψη =", ans: 60 }],
      hint: R`Με επανάληψη κάθε θέση έχει 5 επιλογές. Χωρίς επανάληψη: 5, 4, 3.`,
      sol: R`Με επανάληψη: $5 \cdot 5 \cdot 5 = 125$. Χωρίς: $5 \cdot 4 \cdot 3 = 60$.` },
    { level: 2, type: "fields", q: R`Ένας κωδικός αποτελείται από $3$ γράμματα από το σύνολο $\{A, B, \Gamma\}$ (επιτρέπεται επανάληψη) και ακολουθούν $2$ ψηφία ($0$–$9$). Πόσοι κωδικοί υπάρχουν;`,
      fields: [{ label: "κωδικοί =", ans: 2700 }], hint: R`5 κουτάκια: 3, 3, 3, 10, 10.`,
      sol: R`$3 \cdot 3 \cdot 3 \cdot 10 \cdot 10 = 27 \cdot 100 = 2700$.` },
    { level: 3, type: "fields", q: R`Πόσοι <b>άρτιοι</b> τριψήφιοι αριθμοί με <b>διαφορετικά</b> ψηφία υπάρχουν (ψηφία $0$–$9$);`,
      fields: [{ label: "πλήθος =", ans: 328 }],
      hint: R`Χώρισε σε περιπτώσεις: τελευταίο ψηφίο $0$ ή τελευταίο ψηφίο $2,4,6,8$ (τότε το πρώτο δεν μπορεί να είναι 0).`,
      sol: R`<b>Τελειώνει σε 0:</b> πρώτο ψηφίο 9 επιλογές, μεσαίο 8 ⇒ $9 \cdot 8 = 72$.<br><b>Τελειώνει σε 2,4,6,8:</b> τελευταίο 4 επιλογές, πρώτο 8 (όχι 0, όχι το τελευταίο), μεσαίο 8 ⇒ $4 \cdot 8 \cdot 8 = 256$.<br>Σύνολο (αρχή αθροίσματος): $72 + 256 = 328$.` }
  ]
},
{
  id: "10.2", unit: 10, title: "Μεταθέσεις",
  book: "Δ΄ Τεύχος §10.2 · Δραστηριότητες σελ. 41",
  theory: R`
<div class="tbox"><h4>Παραγοντικό</h4>
$$\nu! = 1 \cdot 2 \cdot 3 \cdot \ldots \cdot \nu, \qquad 0! = 1$$
<p>Π.χ. $5! = 120$. Χρήσιμο: $\frac{7!}{5!} = 7 \cdot 6 = 42$.</p></div>
<div class="tbox"><h4>Απλές μεταθέσεις</h4>
<p>Τρόποι να τοποθετήσουμε $\nu$ <b>διαφορετικά</b> αντικείμενα <b>σε σειρά</b>:</p>$$M_\nu = \nu!$$</div>
<div class="tbox"><h4>Κυκλικές μεταθέσεις</h4>
<p>Σε <b>κύκλο</b> (π.χ. στρογγυλό τραπέζι) δεν υπάρχει «πρώτη θέση» — κάθε κυκλική διάταξη αντιστοιχεί σε $\nu$ απλές:</p>$$K_\nu = (\nu - 1)!$$</div>
<div class="tbox"><h4>Επαναληπτικές μεταθέσεις</h4>
<p>Αν από τα $\nu$ αντικείμενα τα $\kappa_1$ είναι ίδια μεταξύ τους, τα $\kappa_2$ ίδια μεταξύ τους κ.ο.κ.:</p>
$$M^{\nu}_{\kappa_1, \kappa_2, \ldots} = \frac{\nu!}{\kappa_1! \cdot \kappa_2! \cdot \ldots}$$
<p>Π.χ. αναγραμματισμοί της λέξης ΚΑΚΑΟ: $\frac{5!}{2!\,2!} = 30$ (δύο Κ, δύο Α).</p></div>
<div class="tbox tip"><h4>«Μαζί» = ένα πακέτο</h4><p>Αν κάποια αντικείμενα πρέπει να είναι <b>συνεχόμενα</b>, τα κάνουμε ένα «πακέτο»: μεταθέτουμε τα πακέτα και μετά τα στοιχεία μέσα στο πακέτο.</p></div>`,
  widget: "comb",
  gen: "gcomb",
  exercises: [
    { level: 1, type: "fields", q: R`Με πόσους τρόπους μπορούμε να τοποθετήσουμε $5$ διαφορετικά βιβλία σε ένα ράφι; Και πόσο κάνει το $\frac{7!}{5!}$;`,
      fields: [{ label: "τρόποι =", ans: 120 }, { label: "7!/5! =", ans: 42 }], hint: R`$M_5 = 5!$`,
      sol: R`$M_5 = 5! = 120$. $\;\frac{7!}{5!} = \frac{7 \cdot 6 \cdot 5!}{5!} = 42$.` },
    { level: 1, type: "fields", q: R`Με πόσους τρόπους μπορούν $6$ φίλοι να καθίσουν σε ένα <b>στρογγυλό</b> τραπέζι;`,
      fields: [{ label: "τρόποι =", ans: 120 }], hint: R`Κυκλικές μεταθέσεις: $K_6 = 5!$`,
      sol: R`$K_6 = (6-1)! = 5! = 120$.` },
    { level: 2, type: "fields", q: R`Πόσοι είναι οι αναγραμματισμοί της λέξης <b>ΜΑΘΗΜΑ</b>;`,
      fields: [{ label: "αναγραμματισμοί =", ans: 180 }], hint: R`6 γράμματα: το Μ δύο φορές, το Α δύο φορές.`,
      sol: R`$M^6_{2,2} = \frac{6!}{2!\,2!} = \frac{720}{4} = 180$.` },
    { level: 2, type: "fields", q: R`Για τη λέξη <b>ΛΕΜΟΝΙ</b> (όλα τα γράμματα διαφορετικά) να βρείτε το πλήθος των αναγραμματισμών και πόσοι από αυτούς αρχίζουν από Λ.`,
      fields: [{ label: "όλοι =", ans: 720 }, { label: "αρχίζουν από Λ =", ans: 120 }],
      hint: R`Αν το Λ «κλειδώσει» στην πρώτη θέση, μένουν 5 γράμματα.`,
      sol: R`Όλοι: $6! = 720$. Με Λ πρώτο: $1 \cdot 5! = 120$.` },
    { level: 2, type: "fields", q: R`$4$ αγόρια και $3$ κορίτσια θα σταθούν σε σειρά για φωτογραφία, έτσι ώστε τα κορίτσια να είναι σε <b>συνεχόμενες</b> θέσεις. Με πόσους τρόπους;`,
      fields: [{ label: "τρόποι =", ans: 720 }],
      hint: R`Τα 3 κορίτσια = 1 πακέτο. Πόσα «αντικείμενα» έχουμε τότε;`,
      sol: R`Πακέτο κοριτσιών + 4 αγόρια = 5 αντικείμενα: $5!$ τρόποι. Μέσα στο πακέτο: $3!$.<br>Σύνολο $5! \cdot 3! = 120 \cdot 6 = 720$.` },
    { level: 3, type: "fields", q: R`$5$ άτομα κάθονται σε στρογγυλό τραπέζι. Με πόσους τρόπους, αν δύο συγκεκριμένα άτομα (Άννα και Βασίλης) πρέπει να κάθονται <b>δίπλα</b>;`,
      fields: [{ label: "τρόποι =", ans: 12 }],
      hint: R`Άννα–Βασίλης = πακέτο ⇒ 4 «αντικείμενα» σε κύκλο. Το πακέτο έχει και εσωτερική σειρά!`,
      sol: R`4 αντικείμενα σε κύκλο: $K_4 = 3! = 6$. Μέσα στο πακέτο: $2! = 2$ (ΑΒ ή ΒΑ). Σύνολο $6 \cdot 2 = 12$.` }
  ]
},
{
  id: "10.3", unit: 10, title: "Διατάξεις",
  book: "Δ΄ Τεύχος §10.3 · Δραστηριότητες σελ. 49",
  theory: R`
<div class="tbox"><h4>Απλές διατάξεις</h4>
<p>Διαλέγουμε $\kappa$ από $\nu$ διαφορετικά αντικείμενα και τα βάζουμε <b>σε σειρά</b> — η <b>σειρά μετράει</b> ($AB \ne BA$):</p>
$$\Delta^{\nu}_{\kappa} = \frac{\nu!}{(\nu - \kappa)!} = \underbrace{\nu(\nu-1)\cdots(\nu-\kappa+1)}_{\kappa \text{ παράγοντες}}$$
<p>Π.χ. πρόεδρος, γραμματέας, ταμίας από 7 άτομα: $\Delta^7_3 = 7 \cdot 6 \cdot 5 = 210$. Για $\kappa = \nu$ παίρνουμε τις μεταθέσεις: $\Delta^\nu_\nu = \nu!$.</p></div>
<div class="tbox"><h4>Επαναληπτικές διατάξεις</h4>
<p>Κάθε στοιχείο μπορεί να <b>επαναληφθεί</b> (π.χ. ψηφία ενός PIN, ζαριές): κάθε μία από τις $\kappa$ θέσεις έχει $\nu$ επιλογές:</p>
$$\nu \cdot \nu \cdot \ldots \cdot \nu = \nu^{\kappa}$$
<p>Εδώ μπορεί και $\kappa > \nu$ (π.χ. 4ψήφιοι με ψηφία μόνο 1 και 2: $2^4 = 16$).</p></div>
<div class="tbox tip"><h4>Πότε διάταξη;</h4><p>Ρώτα: «αν αλλάξω τη σειρά, παίρνω <b>διαφορετικό</b> αποτέλεσμα;» Αν <b>ναι</b> ⇒ διάταξη. Αν <b>όχι</b> (π.χ. επιτροπή χωρίς ρόλους) ⇒ συνδυασμός (επόμενη παράγραφος).</p></div>`,
  widget: "comb",
  gen: "gcomb",
  exercises: [
    { level: 1, type: "fields", q: R`Από $7$ μέλη ενός συλλόγου εκλέγονται πρόεδρος, γραμματέας και ταμίας. Με πόσους τρόπους;`,
      fields: [{ label: "τρόποι =", ans: 210 }], hint: R`Οι ρόλοι είναι διαφορετικοί ⇒ μετράει η σειρά.`,
      sol: R`$\Delta^7_3 = 7 \cdot 6 \cdot 5 = 210$.` },
    { level: 1, type: "fields", q: R`Σε αγώνα $8$ δρομέων απονέμονται χρυσό, ασημένιο και χάλκινο μετάλλιο. Πόσα διαφορετικά βάθρα υπάρχουν; Και πόσα αποτελέσματα έχουμε αν ρίξουμε ένα ζάρι $3$ φορές;`,
      fields: [{ label: "βάθρα =", ans: 336 }, { label: "αποτελέσματα ζαριού =", ans: 216 }],
      hint: R`Βάθρο: $\Delta^8_3$. Ζάρι: επαναληπτική διάταξη $6^3$.`,
      sol: R`$\Delta^8_3 = 8 \cdot 7 \cdot 6 = 336$. Ζάρι: κάθε ρίψη 6 αποτελέσματα, με επανάληψη: $6^3 = 216$.` },
    { level: 2, type: "fields", q: R`Ένας κωδικός (PIN) έχει $4$ ψηφία από $0$ έως $9$. Πόσοι κωδικοί υπάρχουν:`,
      fields: [{ label: "με επανάληψη =", ans: 10000 }, { label: "χωρίς επανάληψη =", ans: 5040 }],
      hint: R`Με επανάληψη: $10^4$. Χωρίς: $\Delta^{10}_4$.`,
      sol: R`Με επανάληψη: $10^4 = 10000$. Χωρίς επανάληψη: $\Delta^{10}_4 = 10 \cdot 9 \cdot 8 \cdot 7 = 5040$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $\Delta^{\nu}_{2} = 20$, $\nu \ge 2$.`,
      fields: [{ label: "ν =", ans: 5 }],
      hint: R`$\Delta^\nu_2 = \nu(\nu - 1)$.`,
      sol: R`$\nu(\nu-1) = 20 \Leftrightarrow \nu^2 - \nu - 20 = 0 \Leftrightarrow (\nu - 5)(\nu + 4) = 0$. Δεκτή η $\nu = 5$ ($\nu = -4$ απορρίπτεται).` },
    { level: 3, type: "fields", q: R`Πόσοι τετραψήφιοι αριθμοί με <b>διαφορετικά</b> ψηφία από το σύνολο $\{1,2,3,4,5,6\}$ είναι <b>μεγαλύτεροι από 5000</b>;`,
      fields: [{ label: "πλήθος =", ans: 120 }],
      hint: R`Το πρώτο ψηφίο πρέπει να είναι 5 ή 6. Τα άλλα 3 από τα υπόλοιπα 5.`,
      sol: R`Πρώτο ψηφίο: 2 επιλογές (5 ή 6). Τα υπόλοιπα 3 ψηφία: διάταξη των 5 που μένουν ανά 3, $\Delta^5_3 = 60$.<br>Σύνολο $2 \cdot 60 = 120$.` }
  ]
},
{
  id: "10.4", unit: 10, title: "Συνδυασμοί",
  book: "Δ΄ Τεύχος §10.4 · Δραστηριότητες σελ. 56 · Ενότητας σελ. 58",
  theory: R`
<div class="tbox"><h4>Συνδυασμοί των $\nu$ ανά $\kappa$</h4>
<p>Διαλέγουμε μια <b>ομάδα</b> $\kappa$ αντικειμένων από $\nu$ διαφορετικά — η σειρά <b>δεν</b> μετράει:</p>
$$\binom{\nu}{\kappa} = \frac{\nu!}{\kappa!\,(\nu - \kappa)!} = \frac{\Delta^\nu_\kappa}{\kappa!}$$
<p>Διαιρούμε με $\kappa!$ γιατί κάθε ομάδα «μετρήθηκε» $\kappa!$ φορές στις διατάξεις.</p></div>
<div class="tbox"><h4>Ιδιότητες</h4>
$$\binom{\nu}{0} = \binom{\nu}{\nu} = 1, \qquad \binom{\nu}{1} = \nu, \qquad \binom{\nu}{\kappa} = \binom{\nu}{\nu - \kappa}$$
<p>Η τελευταία γλιτώνει πράξεις: $\binom{20}{18} = \binom{20}{2} = \frac{20 \cdot 19}{2} = 190$.</p></div>
<div class="tbox tip"><h4>«Τουλάχιστον ένα» → συμπλήρωμα</h4>
<p>Αντί να μετρήσεις όλες τις περιπτώσεις με 1, 2, 3, ... στοιχεία, μέτρα <b>όλες</b> τις ομάδες και αφαίρεσε αυτές με <b>κανένα</b>.</p></div>`,
  widget: "comb",
  gen: "gcomb",
  exercises: [
    { level: 1, type: "fields", q: R`Με πόσους τρόπους επιλέγεται επιτροπή $3$ ατόμων από $10$; Και πόσο κάνει το $\binom{20}{18}$;`,
      fields: [{ label: "επιτροπές =", ans: 120 }, { label: "C(20,18) =", ans: 190 }],
      hint: R`Επιτροπή χωρίς ρόλους ⇒ συνδυασμός. Για το δεύτερο: $\binom{20}{18} = \binom{20}{2}$.`,
      sol: R`$\binom{10}{3} = \frac{10 \cdot 9 \cdot 8}{3!} = \frac{720}{6} = 120$. $\;\binom{20}{18} = \binom{20}{2} = 190$.` },
    { level: 1, type: "fields", q: R`Σε μια συνάντηση $8$ ατόμων ο καθένας δίνει χειραψία σε όλους τους άλλους. Πόσες χειραψίες γίνονται;`,
      fields: [{ label: "χειραψίες =", ans: 28 }],
      hint: R`Κάθε χειραψία = ζευγάρι ατόμων (η σειρά δεν μετράει).`,
      sol: R`$\binom{8}{2} = \frac{8 \cdot 7}{2} = 28$.` },
    { level: 2, type: "fields", q: R`Από $6$ άνδρες και $5$ γυναίκες σχηματίζεται επιτροπή με $2$ άνδρες και $3$ γυναίκες. Με πόσους τρόπους;`,
      fields: [{ label: "τρόποι =", ans: 150 }],
      hint: R`Δύο φάσεις: διαλέγω άνδρες ΚΑΙ μετά γυναίκες ⇒ πολλαπλασιάζω.`,
      sol: R`$\binom{6}{2} \cdot \binom{5}{3} = 15 \cdot 10 = 150$.` },
    { level: 2, type: "fields", q: R`Να λύσετε την εξίσωση $\binom{\nu}{2} = 45$.`,
      fields: [{ label: "ν =", ans: 10 }],
      hint: R`$\binom{\nu}{2} = \frac{\nu(\nu-1)}{2}$.`,
      sol: R`$\frac{\nu(\nu-1)}{2} = 45 \Leftrightarrow \nu^2 - \nu - 90 = 0 \Leftrightarrow (\nu-10)(\nu+9) = 0 \Rightarrow \nu = 10$.` },
    { level: 2, type: "fields", q: R`Ένα διαγώνισμα έχει $12$ ερωτήσεις και ο μαθητής πρέπει να απαντήσει σε $8$, από τις οποίες οι $3$ πρώτες είναι <b>υποχρεωτικές</b>. Με πόσους τρόπους μπορεί να διαλέξει;`,
      fields: [{ label: "τρόποι =", ans: 126 }],
      hint: R`Οι 3 υποχρεωτικές «κλειδώνουν». Μένουν να διαλέξει 5 από τις 9 υπόλοιπες.`,
      sol: R`$\binom{9}{5} = \binom{9}{4} = \frac{9 \cdot 8 \cdot 7 \cdot 6}{24} = 126$.` },
    { level: 3, type: "fields", q: R`Από $5$ άνδρες και $4$ γυναίκες επιλέγεται επιτροπή $4$ ατόμων με <b>τουλάχιστον μία</b> γυναίκα. Με πόσους τρόπους;`,
      fields: [{ label: "τρόποι =", ans: 121 }],
      hint: R`Όλες οι επιτροπές μείον αυτές με <b>μόνο</b> άνδρες.`,
      sol: R`Όλες: $\binom{9}{4} = 126$. Χωρίς γυναίκα (μόνο άνδρες): $\binom{5}{4} = 5$.<br>Άρα $126 - 5 = 121$.` }
  ]
},
{
  id: "11.1", unit: 11, title: "Η έννοια της Πιθανότητας",
  book: "Δ΄ Τεύχος §11.1 · Δραστηριότητες σελ. 72, 81",
  theory: R`
<div class="tbox"><h4>Βασικές έννοιες</h4>
<ul><li><b>Πείραμα τύχης</b>: δεν μπορούμε να προβλέψουμε το αποτέλεσμα (ρίψη ζαριού).</li>
<li><b>Δειγματικός χώρος</b> $\Omega$: το σύνολο όλων των δυνατών αποτελεσμάτων. Για ένα ζάρι $\Omega = \{1,\dots,6\}$, για δύο ζάρια $\nu(\Omega) = 36$.</li>
<li><b>Ενδεχόμενο</b>: κάθε υποσύνολο του $\Omega$. <b>Ασυμβίβαστα</b>: $A \cap B = \varnothing$ (δεν πραγματοποιούνται μαζί).</li></ul></div>
<div class="tbox"><h4>Κλασικός ορισμός</h4>
<p>Αν όλα τα αποτελέσματα είναι <b>ισοπίθανα</b>:</p>
$$P(A) = \frac{\nu(A)}{\nu(\Omega)} = \frac{\text{ευνοϊκές περιπτώσεις}}{\text{δυνατές περιπτώσεις}}$$</div>
<div class="tbox"><h4>Ιδιότητες (αξιωματικός ορισμός)</h4>
<p>$0 \le P(A) \le 1$, $\;P(\Omega) = 1$, $\;P(\varnothing) = 0$</p>
<p>$P(A') = 1 - P(A)$ &nbsp;·&nbsp; $P(A \cup B) = P(A) + P(B) - P(A \cap B)$</p>
<p>Για ασυμβίβαστα: $P(A \cup B) = P(A) + P(B)$.</p></div>
<div class="tbox tip"><h4>Συνδυαστική + Πιθανότητες</h4><p>Όταν τα $\nu(A)$ και $\nu(\Omega)$ είναι μεγάλα, τα μετράμε με μεταθέσεις, διατάξεις ή συνδυασμούς.</p></div>`,
  widget: "dice",
  gen: "gdice",
  exercises: [
    { level: 1, type: "fields", q: R`Ρίχνουμε ένα ζάρι. Ποια η πιθανότητα να φέρουμε άρτιο αριθμό; Και ποια η πιθανότητα να φέρουμε αριθμό μεγαλύτερο του 4;`,
      fields: [{ label: "P(άρτιος) =", ans: "1/2" }, { label: "P(>4) =", ans: "1/3", tol: 0.005 }],
      hint: R`Άρτιοι: $\{2,4,6\}$. Μεγαλύτεροι του 4: $\{5,6\}$.`,
      sol: R`$P(A) = \frac36 = \frac12$, $\;P(B) = \frac26 = \frac13$.` },
    { level: 1, type: "fields", q: R`Ρίχνουμε δύο ζάρια. Ποια η πιθανότητα το άθροισμα να είναι $7$;`,
      fields: [{ label: "P =", ans: "1/6", tol: 0.005 }],
      hint: R`$\nu(\Omega) = 36$. Ζευγάρια με άθροισμα 7: $(1,6), (2,5), \dots$`,
      sol: R`Ευνοϊκά: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$ — 6 περιπτώσεις. $P = \frac{6}{36} = \frac16$.` },
    { level: 2, type: "fields", q: R`Ρίχνουμε δύο ζάρια. Ποια η πιθανότητα το άθροισμα να είναι <b>τουλάχιστον 10</b>;`,
      fields: [{ label: "P =", ans: "1/6", tol: 0.005 }],
      hint: R`Άθροισμα 10: 3 τρόποι, 11: 2 τρόποι, 12: 1 τρόπος.`,
      sol: R`$\nu(A) = 3 + 2 + 1 = 6$, άρα $P(A) = \frac{6}{36} = \frac16$.` },
    { level: 2, type: "fields", q: R`Αν $P(A) = 0{,}5$, $P(B) = 0{,}4$ και $P(A \cap B) = 0{,}2$, να βρείτε:`,
      fields: [{ label: "P(A ∪ B) =", ans: 0.7 }, { label: "P(A′) =", ans: 0.5 }, { label: "P(κανένα από τα δύο) =", ans: 0.3 }],
      hint: R`«Κανένα» $= (A \cup B)'$.`,
      sol: R`$P(A \cup B) = 0{,}5 + 0{,}4 - 0{,}2 = 0{,}7$. $\;P(A') = 1 - 0{,}5 = 0{,}5$. $\;P((A \cup B)') = 1 - 0{,}7 = 0{,}3$.` },
    { level: 2, type: "fields", q: R`Ρίχνουμε τρία νομίσματα. Ποια η πιθανότητα να φέρουμε <b>τουλάχιστον μία</b> κορώνα;`,
      fields: [{ label: "P =", ans: "7/8" }],
      hint: R`Συμπλήρωμα: «καμία κορώνα» = ΓΓΓ.`,
      sol: R`$\nu(\Omega) = 2^3 = 8$. $P(\text{καμία κορώνα}) = \frac18$, άρα $P = 1 - \frac18 = \frac78$.` },
    { level: 3, type: "fields", q: R`Ένα κουτί έχει $4$ άσπρες και $6$ μαύρες μπάλες. Παίρνουμε τυχαία $2$ μπάλες μαζί. Ποια η πιθανότητα να είναι και οι δύο άσπρες;`,
      fields: [{ label: "P =", ans: "2/15", tol: 0.005 }],
      hint: R`$\nu(\Omega) = \binom{10}{2}$, $\nu(A) = \binom{4}{2}$.`,
      sol: R`$P = \frac{\binom42}{\binom{10}{2}} = \frac{6}{45} = \frac{2}{15}$.` },
    { level: 3, type: "fields", q: R`Γράφουμε τυχαία έναν αναγραμματισμό της λέξης <b>ΜΑΘΗΜΑ</b>. Ποια η πιθανότητα να αρχίζει από Μ;`,
      fields: [{ label: "P =", ans: "1/3", tol: 0.005 }],
      hint: R`Όλοι: $\frac{6!}{2!\,2!} = 180$. Με Μ πρώτο μένουν ΑΘΗΜΑ (δύο Α).`,
      sol: R`Με Μ πρώτο: $\frac{5!}{2!} = 60$. $\;P = \frac{60}{180} = \frac13$. (Λογικό: 2 από τα 6 γράμματα είναι Μ.)` }
  ]
},
{
  id: "11.2", unit: 11, title: "Πιθανότητες συνδυασμένων ενδεχομένων",
  book: "Δ΄ Τεύχος §11.2 · Δραστηριότητες σελ. 87, 91 · Ενότητας σελ. 93",
  theory: R`
<div class="tbox"><h4>Δεσμευμένη (υπό συνθήκη) πιθανότητα</h4>
<p>Η πιθανότητα του $A$ <b>δεδομένου ότι</b> έχει πραγματοποιηθεί το $B$ ($P(B) > 0$):</p>
$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$
<p>Ουσιαστικά ο δειγματικός χώρος «μικραίνει» στο $B$. Από τον τύπο: $\;P(A \cap B) = P(B) \cdot P(A \mid B)$.</p></div>
<div class="tbox"><h4>Ανεξάρτητα ενδεχόμενα</h4>
<p>Τα $A, B$ είναι <b>ανεξάρτητα</b> όταν η πραγματοποίηση του ενός δεν επηρεάζει την πιθανότητα του άλλου:</p>
$$P(A \cap B) = P(A) \cdot P(B) \quad\Leftrightarrow\quad P(A \mid B) = P(A) \;\; (P(B)>0)$$</div>
<div class="tbox warn"><h4>⚠ Με ή χωρίς επανάθεση;</h4>
<p><b>Με επανάθεση</b> ⇒ οι επιλογές είναι ανεξάρτητες (ίδιες πιθανότητες κάθε φορά). <b>Χωρίς επανάθεση</b> ⇒ η δεύτερη πιθανότητα αλλάζει: π.χ. $\frac{8}{13} \cdot \frac{7}{12}$.</p>
<p>Επίσης: ασυμβίβαστα ≠ ανεξάρτητα! Δύο ασυμβίβαστα ενδεχόμενα με θετικές πιθανότητες <b>δεν</b> είναι ποτέ ανεξάρτητα.</p></div>`,
  widget: "table2",
  exercises: [
    { level: 1, type: "fields", q: R`Αν $P(A \cap B) = 0{,}12$ και $P(B) = 0{,}4$, να βρείτε την $P(A \mid B)$.`,
      fields: [{ label: "P(A|B) =", ans: 0.3 }], hint: R`Ορισμός της δεσμευμένης.`,
      sol: R`$P(A \mid B) = \frac{0{,}12}{0{,}4} = 0{,}3$.` },
    { level: 1, type: "fields", q: R`Ρίχνουμε ένα ζάρι και μας λένε ότι ήρθε <b>άρτιος</b> αριθμός. Ποια η πιθανότητα να είναι $6$;`,
      fields: [{ label: "P =", ans: "1/3", tol: 0.005 }],
      hint: R`Ο νέος δειγματικός χώρος είναι $\{2,4,6\}$.`,
      sol: R`$P(\{6\} \mid \text{άρτιος}) = \frac{1/6}{3/6} = \frac13$.` },
    { level: 2, type: "fields", q: R`Ένα κουτί έχει $8$ μαύρες και $5$ άσπρες μπάλες. Παίρνουμε δύο μπάλες τη μία μετά την άλλη. Ποια η πιθανότητα να είναι και οι δύο μαύρες:`,
      fields: [{ label: "χωρίς επανάθεση =", ans: "14/39", tol: 0.005 }, { label: "με επανάθεση =", ans: "64/169", tol: 0.005 }],
      hint: R`$P(M_1 \cap M_2) = P(M_1) \cdot P(M_2 \mid M_1)$.`,
      sol: R`Χωρίς επανάθεση: $\frac{8}{13} \cdot \frac{7}{12} = \frac{56}{156} = \frac{14}{39}$.<br>Με επανάθεση (ανεξάρτητα): $\left(\frac{8}{13}\right)^2 = \frac{64}{169}$.` },
    { level: 2, type: "fields", q: R`Τα $A$ και $B$ είναι <b>ανεξάρτητα</b> με $P(A) = 0{,}3$ και $P(B) = 0{,}5$. Να βρείτε:`,
      fields: [{ label: "P(A ∩ B) =", ans: 0.15 }, { label: "P(A ∪ B) =", ans: 0.65 }],
      hint: R`Ανεξάρτητα ⇒ $P(A \cap B) = P(A)P(B)$.`,
      sol: R`$P(A \cap B) = 0{,}3 \cdot 0{,}5 = 0{,}15$. $\;P(A \cup B) = 0{,}3 + 0{,}5 - 0{,}15 = 0{,}65$.` },
    { level: 3, type: "fields", q: R`Σε σχολείο $100$ μαθητών υπάρχουν $60$ κορίτσια και $40$ αγόρια. Μουσικό όργανο παίζουν $30$ κορίτσια και $10$ αγόρια. Επιλέγουμε τυχαία έναν μαθητή.`,
      fields: [{ label: "P(όργανο | κορίτσι) =", ans: 0.5 }, { label: "P(κορίτσι | όργανο) =", ans: 0.75 }, { label: "P(όργανο) =", ans: 0.4 }],
      hint: R`Για το $P(\text{κορίτσι} \mid \text{όργανο})$ ο νέος «κόσμος» είναι οι 40 που παίζουν όργανο.`,
      sol: R`$P(O \mid K) = \frac{30}{60} = 0{,}5$. $\;P(K \mid O) = \frac{30}{40} = 0{,}75$. $\;P(O) = \frac{40}{100} = 0{,}4$.<br>Αφού $P(O \mid K) = 0{,}5 \ne 0{,}4 = P(O)$, τα ενδεχόμενα <b>δεν είναι ανεξάρτητα</b>: τα κορίτσια παίζουν όργανο συχνότερα.` },
    { level: 3, type: "fields", q: R`Ένας σκοπευτής πετυχαίνει τον στόχο με πιθανότητα $0{,}8$ σε κάθε βολή, ανεξάρτητα. Ρίχνει $3$ βολές. Ποια η πιθανότητα να πετύχει τον στόχο τουλάχιστον μία φορά;`,
      fields: [{ label: "P =", ans: 0.992 }],
      hint: R`Συμπλήρωμα: «αστοχεί και τις 3» με πιθανότητα $0{,}2^3$.`,
      sol: R`$P(\text{καμία επιτυχία}) = 0{,}2 \cdot 0{,}2 \cdot 0{,}2 = 0{,}008$. Άρα $P = 1 - 0{,}008 = 0{,}992$.` }
  ]
},
];

/* Επιπλέον ασκήσεις επιπέδου Παγκυπρίων */
SECTIONS.find(s => s.id === "10.4").exercises.push(
  { level: 3, type: "fields", q: R`Πόσες διαγώνιους έχει ένα κυρτό δεκάγωνο;`, fields: [{ label: "διαγώνιοι =", ans: 35 }],
    hint: R`Κάθε ζευγάρι κορυφών ορίζει τμήμα· αφαίρεσε τις πλευρές.`, sol: R`$\binom{10}{2} - 10 = 45 - 10 = 35$. Γενικά: $\binom{\nu}{2} - \nu = \frac{\nu(\nu-3)}{2}$.` });
SECTIONS.find(s => s.id === "11.1").exercises.push(
  { level: 3, type: "fields", q: R`Σε μια κλήρωση υπάρχουν $10$ λαχνοί, από τους οποίους κερδίζουν οι $3$. Αγοράζουμε $2$ λαχνούς. Ποια η πιθανότητα να κερδίσει τουλάχιστον ένας;`,
    fields: [{ label: "P =", ans: "8/15" }], hint: R`Συμπλήρωμα: κανένας δεν κερδίζει ⇒ και οι δύο από τους 7 «χαμένους».`,
    sol: R`$P(\text{κανένας}) = \frac{\binom72}{\binom{10}{2}} = \frac{21}{45} = \frac{7}{15}$. Άρα $P = 1 - \frac{7}{15} = \frac{8}{15}$.` });

/* ================= Widgets ================= */
var WIDGETS = Object.assign(window.WIDGETS || {}, {
  mono(box) {
    const funcs = [
      { n: "x² − 2x", f: x => x * x - 2 * x, a: -2, b: 4 },
      { n: "−x² + 4", f: x => -x * x + 4, a: -3, b: 3 },
      { n: "x³ − 3x", f: x => x ** 3 - 3 * x, a: -2.5, b: 2.5 },
      { n: "−0,5x + 2", f: x => -0.5 * x + 2, a: -3, b: 4 }];
    box.innerHTML = `<div class="wctl"><label>Συνάρτηση <select class="fs">${funcs.map((q, i) => `<option value="${i}">f(x) = ${q.n}</option>`).join("")}</select></label>
      <label>x₁ <input type="range" class="r1" step="0.05"></label><label>x₂ <input type="range" class="r2" step="0.05"></label></div>
      <div class="pl"></div><div class="wout"></div>`;
    const sel = $(".fs", box), r1 = $(".r1", box), r2 = $(".r2", box), out = $(".wout", box);
    function setRange() { const q = funcs[sel.value]; for (const r of [r1, r2]) { r.min = q.a; r.max = q.b; } r1.value = q.a + (q.b - q.a) * 0.25; r2.value = q.a + (q.b - q.a) * 0.6; draw(); }
    function draw() {
      const q = funcs[sel.value], x1 = +r1.value, x2 = +r2.value, [lo, hi] = fitY(q.f, q.a, q.b);
      const P = makePlot($(".pl", box), { xmin: q.a, xmax: q.b, ymin: lo, ymax: hi, H: 300 });
      P.curve(q.f, "c1");
      for (const [x, c, l] of [[x1, "d2", "x₁"], [x2, "d3", "x₂"]]) { P.seg(x, 0, x, q.f(x), "guide"); P.seg(q.a, q.f(x), x, q.f(x), "guide"); P.dot(x, q.f(x), c, l); }
      const y1 = q.f(x1), y2 = q.f(x2), L = Math.min(x1, x2), Rr = Math.max(x1, x2), yl = q.f(L), yr = q.f(Rr);
      const rel = Math.abs(yl - yr) < 1e-9 ? "=" : yl < yr ? "<" : ">";
      const verdict = rel === "<" ? '<b class="ok">ανεβαίνει</b> (αύξουσα συμπεριφορά)' : rel === ">" ? '<b class="bad">κατεβαίνει</b> (φθίνουσα συμπεριφορά)' : "ίδιες τιμές";
      out.innerHTML = `Για ${fmt(L)} &lt; ${fmt(Rr)}: f(${fmt(L)}) = ${fmt(yl)} ${rel} f(${fmt(Rr)}) = ${fmt(yr)} → μεταξύ των δύο σημείων η γραφική ${verdict}.<br><span class="muted">Για να είναι γνησίως αύξουσα σε διάστημα, αυτό πρέπει να ισχύει για <b>κάθε</b> ζεύγος σημείων του. Δοκίμασε την x² − 2x με x₁ = −1 και x₂ = 3!</span>`;
    }
    sel.onchange = setRange; r1.oninput = r2.oninput = draw; setRange();
  },

  deriv(box) {
    box.innerHTML = `<div class="wctl"><label>f(x) = a·x³ + b·x² + c·x</label>
      <label>a <input type="range" class="ra" min="-1" max="1" step="0.25" value="1"><span class="va"></span></label>
      <label>b <input type="range" class="rb" min="-3" max="3" step="0.5" value="0"><span class="vb"></span></label>
      <label>c <input type="range" class="rc" min="-6" max="6" step="0.5" value="-3"><span class="vc"></span></label></div>
      <div class="cap">Γραφική της <b class="t1">f</b> — πράσινο: η f ανεβαίνει, κόκκινο: κατεβαίνει</div><div class="pl p1"></div>
      <div class="cap">Γραφική της <b class="t2">f′</b> — πάνω από τον άξονα ⇔ πράσινο</div><div class="pl p2"></div><div class="wout"></div>`;
    const ra = $(".ra", box), rb = $(".rb", box), rc = $(".rc", box), out = $(".wout", box);
    function draw() {
      const a = +ra.value, b = +rb.value, c = +rc.value;
      $(".va", box).textContent = fmt(a); $(".vb", box).textContent = fmt(b); $(".vc", box).textContent = fmt(c);
      const f = x => a * x ** 3 + b * x * x + c * x, fp = x => 3 * a * x * x + 2 * b * x + c, A = -3.5, B = 3.5;
      const rts = roots(fp, A, B).filter(r => Math.abs(fp(r - 0.01) * fp(r + 0.01)) > 0 || true);
      const cuts = [A, ...rts, B];
      const [lo, hi] = fitY(f, A, B, 0.12), [lo2, hi2] = fitY(fp, A, B, 0.12, [0]);
      const P1 = makePlot($(".p1", box), { xmin: A, xmax: B, ymin: Math.max(lo, -20), ymax: Math.min(hi, 20), H: 230 });
      const P2 = makePlot($(".p2", box), { xmin: A, xmax: B, ymin: Math.max(lo2, -25), ymax: Math.min(hi2, 25), H: 170 });
      for (let i = 0; i < cuts.length - 1; i++) { const m = (cuts[i] + cuts[i + 1]) / 2, s = fp(m); if (Math.abs(s) < 1e-12) continue; const cls = s > 0 ? "pos" : "neg"; P1.band(cuts[i], cuts[i + 1], cls); P2.band(cuts[i], cuts[i + 1], cls); }
      P1.curve(f, "c1"); P2.curve(fp, "c2");
      const msgs = [];
      for (const r of rts) {
        const l = fp(r - 0.02), rr = fp(r + 0.02);
        P2.dot(r, 0, "d3");
        if (l > 0 && rr < 0) { P1.dot(r, f(r), "dmax", "μέγ."); msgs.push(`τοπ. μέγιστο στο x ≈ ${fmt(r)}`); }
        else if (l < 0 && rr > 0) { P1.dot(r, f(r), "dmin", "ελάχ.", 6, 16); msgs.push(`τοπ. ελάχιστο στο x ≈ ${fmt(r)}`); }
        else { P1.dot(r, f(r), "d3", "όχι ακρότατο"); msgs.push(`f′(${fmt(r)}) = 0 χωρίς αλλαγή προσήμου → όχι ακρότατο`); }
      }
      out.innerHTML = msgs.length ? msgs.join(" · ") : "Η f′ δεν αλλάζει πρόσημο → η f είναι γνησίως μονότονη, χωρίς ακρότατα.";
      out.innerHTML += `<br><span class="muted">Δοκίμασε a = 1, b = 0, c = 0 (η f(x) = x³): η f′ αγγίζει τον άξονα αλλά δεν τον περνά.</span>`;
    }
    ra.oninput = rb.oninput = rc.oninput = draw; draw();
  },

  convex(box) {
    const funcs = [
      { n: "x³ − 3x", f: x => x ** 3 - 3 * x, a: -2.5, b: 2.5 },
      { n: "x⁴ − 4x³", f: x => x ** 4 - 4 * x ** 3, a: -1.5, b: 4.2 },
      { n: "−x³ + 6x²", f: x => -(x ** 3) + 6 * x * x, a: -1.5, b: 5.5 },
      { n: "x⁴", f: x => x ** 4, a: -1.6, b: 1.6 }];
    box.innerHTML = `<div class="wctl"><label>Συνάρτηση <select class="fs">${funcs.map((q, i) => `<option value="${i}">f(x) = ${q.n}</option>`).join("")}</select></label>
      <label>Σημείο επαφής x₀ <input type="range" class="r0" step="0.02"></label></div>
      <div class="cap"><b class="t1">μπλε</b>: κυρτή (στρέφει τα κοίλα άνω ∪) · <b class="t3">πορτοκαλί</b>: κοίλη (∩) · μωβ: σημεία καμπής</div>
      <div class="pl"></div><div class="wout"></div>`;
    const sel = $(".fs", box), r0 = $(".r0", box), out = $(".wout", box);
    function setR() { const q = funcs[sel.value]; r0.min = q.a; r0.max = q.b; r0.value = (q.a + q.b) / 2 - 0.4; draw(); }
    function draw() {
      const q = funcs[sel.value], x0 = +r0.value, f = q.f, [lo, hi] = fitY(f, q.a, q.b);
      const P = makePlot($(".pl", box), { xmin: q.a, xmax: q.b, ymin: lo, ymax: hi, H: 300 });
      const f2 = x => D2(f, x), cuts = [q.a, ...roots(f2, q.a, q.b), q.b];
      for (let i = 0; i < cuts.length - 1; i++) { const m = (cuts[i] + cuts[i + 1]) / 2; P.curve(f, f2(m) >= 0 ? "c1" : "c3", cuts[i], cuts[i + 1]); }
      for (const r of cuts.slice(1, -1)) { if (f2(r - 0.05) * f2(r + 0.05) < 0) P.dot(r, f(r), "dinf", "καμπή"); }
      const m = D(f, x0), y0 = f(x0); P.seg(x0 - 10, y0 - 10 * m, x0 + 10, y0 + 10 * m, "tangent"); P.dot(x0, y0, "d2");
      const s = f2(x0);
      out.innerHTML = `f″(${fmt(x0)}) ≈ ${fmt(s)} → ${Math.abs(s) < 0.05 ? "σχεδόν 0 (υποψήφιο σημείο καμπής)" : s > 0 ? '<b class="t1">κυρτή</b>: η καμπύλη είναι <b>πάνω</b> από την εφαπτομένη' : '<b class="t3">κοίλη</b>: η καμπύλη είναι <b>κάτω</b> από την εφαπτομένη'}. Κλίση εφαπτομένης f′(x₀) ≈ ${fmt(m)}.`;
    }
    sel.onchange = setR; r0.oninput = draw; setR();
  },

  box(box) {
    box.innerHTML = `<div class="wctl"><label>Κόβουμε τετράγωνα πλευράς x = <b class="vx"></b> cm από χαρτόνι 12 × 12 cm <input type="range" class="rx" min="0.2" max="5.8" step="0.1" value="1"></label></div>
      <div class="two"><div class="net"></div><div class="pl"></div></div><div class="wout"></div>`;
    const rx = $(".rx", box), out = $(".wout", box), V = x => x * (12 - 2 * x) ** 2;
    function draw() {
      const x = +rx.value; $(".vx", box).textContent = fmt(x);
      const S = 200, k = S / 12, c = x * k;
      $(".net", box).innerHTML = `<svg viewBox="-10 -10 ${S + 20} ${S + 20}" class="plot"><rect x="0" y="0" width="${S}" height="${S}" class="sheet"/>
        ${[[0, 0], [S - c, 0], [0, S - c], [S - c, S - c]].map(([a, b]) => `<rect x="${a}" y="${b}" width="${c}" height="${c}" class="cut"/>`).join("")}
        <rect x="${c}" y="${c}" width="${S - 2 * c}" height="${S - 2 * c}" class="base"/>
        <text x="${S / 2}" y="${S / 2 + 5}" text-anchor="middle" class="lbl">βάση ${fmt(12 - 2 * x)}×${fmt(12 - 2 * x)}</text></svg>`;
      const P = makePlot($(".pl", box), { xmin: 0, xmax: 6.2, ymin: -12, ymax: 165, H: 240, W: 360, ystep: 25 });
      P.curve(V, "c1", 0, 6); P.seg(x, 0, x, V(x), "guide"); P.dot(x, V(x), "d2", `V = ${fmt(V(x))}`); P.dot(2, 128, "dmax", "", 0, 0);
      out.innerHTML = `V(x) = x(12 − 2x)² = <b>${fmt(V(x))} cm³</b>. ${Math.abs(x - 2) < 0.051 ? '<b class="ok">Μέγιστος όγκος! V′(2) = 0</b>' : "Βρες με το slider το x που δίνει τον μεγαλύτερο όγκο — μετά επιβεβαίωσέ το με V′(x) = 0."}`;
    }
    rx.oninput = draw; draw();
  },

  family(box, cfg) {
    cfg = cfg || { name: "f(x) = 2x", F: x => x * x, Fs: "x²", pt: [1, 3], cAns: 2, a: -3, b: 3, ylo: -6, yhi: 12 };
    box.innerHTML = `<div class="wctl"><label>${cfg.name} · αντιπαράγωγοι F(x) = ${cfg.Fs} + c</label>
      <label>c = <b class="vc"></b> <input type="range" class="rc" min="-5" max="5" step="0.5" value="0"></label></div>
      <div class="pl"></div><div class="wout"></div>`;
    const rc = $(".rc", box), out = $(".wout", box);
    function draw() {
      const c = +rc.value; $(".vc", box).textContent = fmt(c);
      const P = makePlot($(".pl", box), { xmin: cfg.a, xmax: cfg.b, ymin: cfg.ylo, ymax: cfg.yhi, H: 300 });
      for (let k = -4; k <= 4; k += 2) P.curve(x => cfg.F(x) + k, "cfam");
      P.curve(x => cfg.F(x) + c, "c1");
      const hit = Math.abs(cfg.F(cfg.pt[0]) + c - cfg.pt[1]) < 1e-9;
      P.dot(cfg.pt[0], cfg.pt[1], hit ? "dmin" : "d3", `(${cfg.pt[0]}, ${cfg.pt[1]})`);
      out.innerHTML = hit ? `<b class="ok">Η καμπύλη περνά από το (${cfg.pt[0]}, ${cfg.pt[1]})!</b> Άρα c = ${fmt(c)} και F(x) = ${cfg.Fs} ${c >= 0 ? "+" : "−"} ${fmt(Math.abs(c))}.` :
        `Όλες οι γκρι καμπύλες έχουν <b>την ίδια παράγωγο</b> — διαφέρουν μόνο κατά μια κατακόρυφη μετατόπιση. Βρες το c ώστε η μπλε καμπύλη να περνά από το σημείο (${cfg.pt[0]}, ${cfg.pt[1]}).`;
    }
    rc.oninput = draw; draw();
  },
  family2(box) { WIDGETS.family(box, { name: "f′(x) = 3x² − 3", F: x => x ** 3 - 3 * x, Fs: "x³ − 3x", pt: [0, 2], a: -2.6, b: 2.6, ylo: -7, yhi: 9 }); }
});

/* ================= Γεννήτριες εξάσκησης ================= */
function texPoly(cs) { // cs: [[coef, power], ...] → LaTeX
  let s = "";
  for (const [c, p] of cs) {
    if (c === 0) continue;
    const sign = c < 0 ? "-" : (s ? "+" : ""), a = Math.abs(c);
    const coef = (a === 1 && p !== 0) ? "" : (Number.isInteger(a) ? a : a.toString());
    const v = p === 0 ? "" : p === 1 ? "x" : `x^{${p}}`;
    s += ` ${sign} ${coef}${v}`;
  }
  return s.trim() || "0";
}
function plainPoly(cs) { return cs.filter(([c]) => c !== 0).map(([c, p]) => `${c >= 0 ? "+" : "-"}${Math.abs(c)}${p ? "*x^" + p : ""}`).join("") || "0"; }

function cubicGen() {
  // f'(x) = 3s(x−p)(x−q), p<q, p+q άρτιο ⇒ ακέραιοι συντελεστές
  let p, q; do { p = ri(-3, 2); q = ri(p + 1, 4); } while ((p + q) % 2);
  const s = Math.random() < 0.7 ? 1 : -1, d = ri(-4, 4);
  const c3 = s, c2 = -s * 3 * (p + q) / 2, c1 = s * 3 * p * q;
  const f = x => c3 * x ** 3 + c2 * x * x + c1 * x + d, m = (p + q) / 2;
  return { p, q, s, d, f, m, tex: texPoly([[c3, 3], [c2, 2], [c1, 1], [d, 0]]),
    maxX: s > 0 ? p : q, minX: s > 0 ? q : p };
}

var GENS = Object.assign(window.GENS || {}, {
  g12: { title: "Γεννήτρια εξάσκησης — τοπικά ακρότατα", make() {
    const g = cubicGen();
    return { q: R`Να βρείτε τα τοπικά ακρότατα της $f(x) = ${g.tex}$.`,
      fields: [{ label: "τοπ. μέγιστο στο x =", ans: g.maxX }, { label: "τιμή =", ans: g.f(g.maxX) }, { label: "τοπ. ελάχιστο στο x =", ans: g.minX }, { label: "τιμή =", ans: g.f(g.minX) }],
      sol: R`$f'(x) = ${g.s > 0 ? "" : "-"}3(x ${g.p >= 0 ? "-" : "+"} ${Math.abs(g.p)})(x ${g.q >= 0 ? "-" : "+"} ${Math.abs(g.q)})$, ρίζες $${g.p}$ και $${g.q}$, πρόσημα $${g.s > 0 ? "+,\\,-,\\,+" : "-,\\,+,\\,-"}$.<br>Τοπικό μέγιστο $f(${g.maxX}) = ${g.f(g.maxX)}$, τοπικό ελάχιστο $f(${g.minX}) = ${g.f(g.minX)}$.`, graph: g.f };
  } },
  g14: { title: "Γεννήτρια — πλήρης μελέτη πολυωνυμικής", make() {
    const g = cubicGen();
    return { q: R`Να μελετήσετε τη συνάρτηση $f(x) = ${g.tex}$ και να συμπληρώσετε:`,
      fields: [{ label: "τομή με y: f(0) =", ans: g.d }, { label: "τοπ. μέγιστο στο x =", ans: g.maxX }, { label: "τοπ. μέγιστο: f =", ans: g.f(g.maxX) }, { label: "τοπ. ελάχιστο στο x =", ans: g.minX }, { label: "τοπ. ελάχιστο: f =", ans: g.f(g.minX) }, { label: "σημείο καμπής: x =", ans: g.m }, { label: "σημείο καμπής: f =", ans: g.f(g.m) }],
      sol: R`$f(0) = ${g.d}$. $f'(x) = ${g.s > 0 ? "" : "-"}3(x ${g.p >= 0 ? "-" : "+"} ${Math.abs(g.p)})(x ${g.q >= 0 ? "-" : "+"} ${Math.abs(g.q)})$ ⇒ τοπ. μέγιστο $(${g.maxX}, ${g.f(g.maxX)})$, τοπ. ελάχιστο $(${g.minX}, ${g.f(g.minX)})$.<br>$f''(x) = ${6 * g.s}x ${-3 * g.s * (g.p + g.q) >= 0 ? "+" : "-"} ${Math.abs(3 * g.s * (g.p + g.q))}$ = 0 στο $x = ${g.m}$ ⇒ σημείο καμπής $(${g.m}, ${g.f(g.m)})$ (πάντα στο μέσο των δύο κρίσιμων σημείων!).<br>Άκρα: $\lim_{x\to+\infty} f(x) = ${g.s > 0 ? "+" : "-"}\infty$, $\lim_{x\to-\infty} f(x) = ${g.s > 0 ? "-" : "+"}\infty$.`, graph: g.f };
  } },
  g23: { title: "Γεννήτρια — ολοκλήρωση πολυωνύμων", make() {
    const n = ri(2, 3), used = new Set(), terms = [];
    while (terms.length < n) { const p = ri(0, 4); if (used.has(p)) continue; used.add(p); const k = ri(1, 4) * (Math.random() < 0.3 ? -1 : 1); terms.push([k * (p + 1), p]); }
    terms.sort((a, b) => b[1] - a[1]);
    const anti = terms.map(([c, p]) => [c / (p + 1), p + 1]);
    return { q: R`$\displaystyle\int \left(${texPoly(terms)}\right)dx$`, type: "anti", f: plainPoly(terms), key: terms.map(([c, p]) => `+(${c}/${p + 1})*x^${p + 1}`).join(""),
      sol: R`Όρο προς όρο, με $\int x^a dx = \frac{x^{a+1}}{a+1}$: $\;${texPoly(anti)} + c$.` };
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

/* ================= Widgets Γ΄ Κατεύθυνσης ================= */
const sgnS = v => (v < 0 ? "− " : "+ ") + fmt(Math.abs(v));
function circlePath(P, a, b, r, cls) { return P.top.appendChild(svgEl("ellipse", { cx: P.sx(a), cy: P.sy(b), rx: Math.abs(P.sx(a + r) - P.sx(a)), ry: Math.abs(P.sy(b + r) - P.sy(b)), class: cls })); }
function squarePlot(container, cx, cy, half, H = 330) { return makePlot(container, { xmin: cx - half, xmax: cx + half, ymin: cy - half * H / 560, ymax: cy + half * H / 560, H, W: 560, xstep: niceStep(2 * half), ystep: niceStep(2 * half) }); }

var WIDGETS = Object.assign(window.WIDGETS || {}, {
  lhop(box) {
    const ex = [
      { n: "(eˣ − 1)/x,  x → 0", f: x => Math.exp(x) - 1, g: x => x, fp: x => Math.exp(x), gp: () => 1, x0: 0, L: "1" },
      { n: "(1 − συνx)/x²,  x → 0", f: x => 1 - Math.cos(x), g: x => x * x, fp: x => Math.sin(x), gp: x => 2 * x, x0: 0, L: "1/2" },
      { n: "ημ3x / x,  x → 0", f: x => Math.sin(3 * x), g: x => x, fp: x => 3 * Math.cos(3 * x), gp: () => 1, x0: 0, L: "3" },
      { n: "ln x / (x − 1),  x → 1", f: x => Math.log(x), g: x => x - 1, fp: x => 1 / x, gp: () => 1, x0: 1, L: "1" }];
    box.innerHTML = `<div class="wctl"><label>Όριο <select class="fs">${ex.map((e, i) => `<option value="${i}">${e.n}</option>`).join("")}</select></label>
      <label>απόσταση h από το x₀ <input type="range" class="rh" min="-3" max="0" step="0.05" value="-0.5"><b class="vh"></b></label></div>
      <div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const e = ex[$(".fs", box).value], h = Math.pow(10, +$(".rh", box).value), x = e.x0 + h;
      $(".vh", box).textContent = h < 0.01 ? h.toExponential(1) : fmt(h);
      const q = x => e.f(x) / e.g(x), a = e.x0 - 1.2, b = e.x0 + 1.2;
      const P = makePlot($(".pl", box), { xmin: a, xmax: b, ymin: -0.5, ymax: 4, H: 250 });
      P.curve(q, "c1", a, b); P.curve(x => e.fp(x) / e.gp(x), "c2", a, b);
      P.dot(x, q(x), "d2", "f/g"); P.dot(e.x0, MathParse.parse(e.L)(0), "dinf", "όριο", 6, 18);
      $(".wout", box).innerHTML = `Για x = x₀ + ${$(".vh", box).textContent}: &nbsp; f/g ≈ <b>${q(x).toFixed(6)}</b> &nbsp;·&nbsp; f′/g′ ≈ <b>${(e.fp(x) / e.gp(x)).toFixed(6)}</b> &nbsp;→ όριο <b>${e.L}</b>
        <br><span class="muted">Μπλε: f/g, μωβ: f′/g′. Στο x₀ η f/g δεν ορίζεται (0/0), όμως πλησιάζοντας, τα δύο πηλίκα συγκλίνουν στον ίδιο αριθμό — αυτό λέει ο κανόνας.</span>`;
    }
    box.querySelectorAll("select,input").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  mvt(box) {
    const fs = [
      { n: "x³ − 3x  στο [−2, 2]", f: x => x ** 3 - 3 * x, a: -2, b: 2 },
      { n: "x² + 2x  στο [0, 2]", f: x => x * x + 2 * x, a: 0, b: 2 },
      { n: "√x  στο [0, 4]", f: x => Math.sqrt(x), a: 0, b: 4 },
      { n: "ημx  στο [0, π]  (Rolle)", f: Math.sin, a: 0, b: Math.PI }];
    box.innerHTML = `<div class="wctl"><label>Συνάρτηση <select class="fs">${fs.map((e, i) => `<option value="${i}">${e.n}</option>`).join("")}</select></label>
      <label>ξ <input type="range" class="rx" step="0.01"><b class="vx"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    const sel = $(".fs", box), rx = $(".rx", box);
    function setR() { const e = fs[sel.value]; rx.min = e.a + 0.01; rx.max = e.b - 0.01; rx.value = e.a + (e.b - e.a) * 0.3; draw(); }
    function draw() {
      const e = fs[sel.value], xi = +rx.value; $(".vx", box).textContent = fmt(xi);
      const [lo, hi] = fitY(e.f, e.a, e.b, 0.25), P = makePlot($(".pl", box), { xmin: e.a - 0.3, xmax: e.b + 0.3, ymin: lo, ymax: hi, H: 280 });
      P.curve(e.f, "c1", Math.max(e.a - 0.3, e.f === Math.sqrt ? 0 : -1e9), e.b + 0.3);
      const m = (e.f(e.b) - e.f(e.a)) / (e.b - e.a), d = D(e.f, xi);
      P.seg(e.a, e.f(e.a), e.b, e.f(e.b), "chord"); P.dot(e.a, e.f(e.a), "d2", "A"); P.dot(e.b, e.f(e.b), "d2", "B");
      const yi = e.f(xi); P.seg(xi - 5, yi - 5 * d, xi + 5, yi + 5 * d, Math.abs(d - m) < 0.03 ? "tangent ok" : "tangent");
      P.dot(xi, yi, Math.abs(d - m) < 0.03 ? "dmin" : "d3", "ξ");
      $(".wout", box).innerHTML = `Κλίση χορδής AB = <b>${fmt(m)}</b> &nbsp;·&nbsp; f′(ξ) = <b>${fmt(d)}</b> ${Math.abs(d - m) < 0.03 ? '<b class="ok">✓ Βρήκες το ξ του ΘΜΤ — η εφαπτομένη είναι παράλληλη στη χορδή!</b>' : '<span class="muted">— μετακίνησε το ξ μέχρι η εφαπτομένη να γίνει παράλληλη στη χορδή.</span>'}`;
    }
    sel.onchange = setR; rx.oninput = draw; setR();
  },

  asym(box) {
    const fs = [
      { n: "(2x + 1)/(x − 3)", f: x => (2 * x + 1) / (x - 3), v: [3], o: [0, 2], c: [-6, 12, -8, 12] },
      { n: "(x² + 1)/x", f: x => (x * x + 1) / x, v: [0], o: [1, 0], c: [-6, 6, -8, 8] },
      { n: "(x² − 3x + 1)/(x − 2)", f: x => (x * x - 3 * x + 1) / (x - 2), v: [2], o: [1, -1], c: [-5, 9, -8, 8] },
      { n: "x/(x² − 4)", f: x => x / (x * x - 4), v: [-2, 2], o: [0, 0], c: [-6, 6, -4, 4] },
      { n: "√(x² + 1)", f: x => Math.sqrt(x * x + 1), v: [], o: [1, 0], o2: [-1, 0], c: [-6, 6, -1, 7] }];
    box.innerHTML = `<div class="wctl"><label>f(x) = <select class="fs">${fs.map((e, i) => `<option value="${i}">${e.n}</option>`).join("")}</select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const e = fs[$(".fs", box).value], [a, b, lo, hi] = e.c, P = makePlot($(".pl", box), { xmin: a, xmax: b, ymin: lo, ymax: hi, H: 320, ystep: niceStep(hi - lo) });
      for (const v of e.v) P.seg(v, lo - 5, v, hi + 5, "asl");
      const line = (l, bb, from, to) => P.seg(from, l * from + bb, to, l * to + bb, "asl");
      line(e.o[0], e.o[1], e.o2 ? 0 : a, b); if (e.o2) line(e.o2[0], e.o2[1], a, 0);
      const cuts = [a, ...e.v.filter(v => v > a && v < b), b];
      for (let i = 0; i < cuts.length - 1; i++) P.curve(e.f, "c1", cuts[i] + 1e-3, cuts[i + 1] - 1e-3);
      const lab = (l, bb) => l === 0 ? `οριζόντια y = ${fmt(bb)}` : `πλάγια y = ${l === 1 ? "" : l === -1 ? "−" : fmt(l)}x ${bb ? sgnS(bb) : ""}`;
      $(".wout", box).innerHTML = `<b>Κατακόρυφες:</b> ${e.v.length ? e.v.map(v => "x = " + v).join(", ") : "καμία"} &nbsp;·&nbsp; <b>${e.o2 ? "x→+∞" : "x→±∞"}:</b> ${lab(...e.o)}${e.o2 ? ` &nbsp;·&nbsp; <b>x→−∞:</b> ${lab(...e.o2)}` : ""}
        <br><span class="muted">Οι κόκκινες διακεκομμένες είναι οι ασύμπτωτες: η καμπύλη τις πλησιάζει όσο θέλουμε, χωρίς απαραίτητα να τις αγγίζει.</span>`;
    }
    $(".fs", box).onchange = draw; draw();
  },

  invtrig(box) {
    const fs = [
      { n: "ημx ↔ τοξημx", f: Math.sin, g: Math.asin, a: -Math.PI / 2, b: Math.PI / 2, ga: -1, gb: 1, d: "1/√(1 − x²)" },
      { n: "συνx ↔ τοξσυνx", f: Math.cos, g: Math.acos, a: 0, b: Math.PI, ga: -1, gb: 1, d: "−1/√(1 − x²)" },
      { n: "εφx ↔ τοξεφx", f: Math.tan, g: Math.atan, a: -1.35, b: 1.35, ga: -4, gb: 4, d: "1/(1 + x²)" }];
    box.innerHTML = `<div class="wctl"><label>Ζεύγος <select class="fs">${fs.map((e, i) => `<option value="${i}">${e.n}</option>`).join("")}</select></label>
      <label>x <input type="range" class="rx" step="0.01"><b class="vx"></b></label></div>
      <div class="cap"><b class="t3">πορτοκαλί</b>: η αρχική (περιορισμένη) · <b class="t1">μπλε</b>: η αντίστροφη · διακεκομμένη: y = x</div><div class="pl"></div><div class="wout"></div>`;
    const sel = $(".fs", box), rx = $(".rx", box);
    function setR() { const e = fs[sel.value]; rx.min = e.ga + 0.01; rx.max = e.gb - 0.01; rx.value = (e.ga + e.gb) / 2 + 0.3; draw(); }
    function draw() {
      const e = fs[sel.value], x = +rx.value, y = e.g(x); $(".vx", box).textContent = fmt(x);
      const P = makePlot($(".pl", box), { xmin: -4, xmax: 4, ymin: -2.2, ymax: 3.5, H: 300 });
      P.seg(-5, -5, 5, 5, "guide"); P.curve(e.f, "c3", e.a, e.b); P.curve(e.g, "c1", e.ga, e.gb);
      P.dot(x, y, "d2", "(x, f⁻¹(x))"); P.dot(y, x, "d3", "", 0, 0); P.seg(x, y, y, x, "guide");
      $(".wout", box).innerHTML = `${sel.options[sel.selectedIndex].text.split("↔")[1].trim().replace("x", "")}(${fmt(x)}) = <b>${fmt(y)}</b> rad ≈ ${fmt(y * 180 / Math.PI)}° &nbsp;·&nbsp; παράγωγος: ${e.d} ≈ <b>${fmt(D(e.g, x))}</b>
        <br><span class="muted">Τα σημεία (x, y) και (y, x) είναι συμμετρικά ως προς την y = x — γι' αυτό οι γραφικές είναι «καθρέφτες».</span>`;
    }
    sel.onchange = setR; rx.oninput = draw; setR();
  },

  circle(box) {
    box.innerHTML = `<div class="wctl"><label>κέντρο α <input type="range" class="ra" min="-4" max="4" value="2"><b class="va"></b></label>
      <label>β <input type="range" class="rb" min="-4" max="4" value="-1"><b class="vb"></b></label>
      <label>R <input type="range" class="rr" min="1" max="5" step="0.5" value="3"><b class="vr"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const a = +$(".ra", box).value, b = +$(".rb", box).value, r = +$(".rr", box).value;
      $(".va", box).textContent = a; $(".vb", box).textContent = b; $(".vr", box).textContent = r;
      const P = squarePlot($(".pl", box), 0, 0, 9); circlePath(P, a, b, r, "circ"); P.dot(a, b, "d2", `K(${a}, ${b})`); P.seg(a, b, a + r, b, "guide");
      const g = -a, f = -b, c = a * a + b * b - r * r;
      $(".wout", box).innerHTML = `$(x ${a ? sgnS(-a) : ""})^2 + (y ${b ? sgnS(-b) : ""})^2 = ${fmt(r * r)}$ &nbsp;⇔&nbsp; $x^2 + y^2 ${g ? sgnS(2 * g) + "x" : ""} ${f ? sgnS(2 * f) + "y" : ""} ${c ? sgnS(c) : ""} = 0$
        <br>$g = ${fmt(g)},\ f = ${fmt(f)},\ c = ${fmt(c)}$ ⇒ $g^2 + f^2 - c = ${fmt(g * g + f * f - c)} = R^2$`.replace(/− /g, "-").replace(/\+ /g, "+");
      typeset($(".wout", box));
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  circleline(box) {
    box.innerHTML = `<div class="wctl"><span>Κύκλος x² + y² = R² · ευθεία y = λx + κ</span>
      <label>R <input type="range" class="rr" min="1" max="5" step="0.5" value="3"><b class="vr"></b></label>
      <label>λ <input type="range" class="rl" min="-3" max="3" step="0.25" value="0.5"><b class="vl"></b></label>
      <label>κ <input type="range" class="rk" min="-7" max="7" step="0.25" value="2"><b class="vk"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const r = +$(".rr", box).value, l = +$(".rl", box).value, k = +$(".rk", box).value;
      $(".vr", box).textContent = fmt(r); $(".vl", box).textContent = fmt(l); $(".vk", box).textContent = fmt(k);
      const P = squarePlot($(".pl", box), 0, 0, 8); circlePath(P, 0, 0, r, "circ"); P.seg(-20, -20 * l + k, 20, 20 * l + k, "c1line");
      const d = Math.abs(k) / Math.sqrt(1 + l * l), A = 1 + l * l, B = 2 * l * k, C = k * k - r * r, Dl = B * B - 4 * A * C;
      const fx = -l * k / (1 + l * l), fy = l * fx + k; P.seg(0, 0, fx, fy, "guide"); P.dot(0, 0, "d2", "O");
      let state;
      if (Math.abs(d - r) < 0.04) { state = '<b class="ok">εφάπτεται</b>'; P.dot(fx, fy, "dmin", "T"); }
      else if (d < r) { state = "<b>τέμνει (2 σημεία)</b>"; for (const s of [-1, 1]) { const x = (-B + s * Math.sqrt(Dl)) / (2 * A); P.dot(x, l * x + k, "d3"); } }
      else state = "<b>δεν έχουν κοινά σημεία</b>";
      $(".wout", box).innerHTML = `Απόσταση κέντρου από την ευθεία d = |κ|/√(1+λ²) = <b>${fmt(d)}</b> &nbsp;vs&nbsp; R = <b>${fmt(r)}</b> ⇒ ${state}
        <br><span class="muted">Διακρίνουσα του συστήματος: Δ = ${fmt(Dl)} (${Dl > 0.05 ? "> 0" : Dl < -0.05 ? "< 0" : "≈ 0"}). Δοκίμασε να κάνεις την ευθεία εφαπτομένη!</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  },

  twocircles(box) {
    box.innerHTML = `<div class="wctl"><label>R₁ <input type="range" class="r1" min="1" max="5" step="0.5" value="2"><b class="v1"></b></label>
      <label>R₂ <input type="range" class="r2" min="1" max="5" step="0.5" value="3"><b class="v2"></b></label>
      <label>απόσταση κέντρων d <input type="range" class="rd" min="0" max="10" step="0.25" value="5"><b class="vd"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const r1 = +$(".r1", box).value, r2 = +$(".r2", box).value, d = +$(".rd", box).value;
      $(".v1", box).textContent = r1; $(".v2", box).textContent = r2; $(".vd", box).textContent = fmt(d);
      const P = squarePlot($(".pl", box), d / 2, 0, 9, 300); circlePath(P, 0, 0, r1, "circ"); circlePath(P, d, 0, r2, "circ2"); P.dot(0, 0, "d2", "K₁"); P.dot(d, 0, "d3", "K₂");
      const e = 0.01; let s;
      if (d > r1 + r2 + e) s = "εξωτερικοί (d > R₁ + R₂)"; else if (Math.abs(d - r1 - r2) <= e) s = "εφάπτονται εξωτερικά (d = R₁ + R₂)";
      else if (d > Math.abs(r1 - r2) + e) s = "τέμνονται (|R₁ − R₂| < d < R₁ + R₂)"; else if (Math.abs(d - Math.abs(r1 - r2)) <= e) s = d < e ? "ομόκεντροι / ταυτίζονται" : "εφάπτονται εσωτερικά (d = |R₁ − R₂|)";
      else s = d < e ? "ομόκεντροι" : "ο ένας μέσα στον άλλον (d < |R₁ − R₂|)";
      $(".wout", box).innerHTML = `d = ${fmt(d)}, R₁ + R₂ = ${fmt(r1 + r2)}, |R₁ − R₂| = ${fmt(Math.abs(r1 - r2))} ⇒ <b>${s}</b>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = draw); draw();
  }
});

/* ================= Γεννήτριες Γ΄ Κατεύθυνσης ================= */
var GENS = Object.assign(window.GENS || {}, {
  gcircle: { title: "Γεννήτρια — κέντρο & ακτίνα κύκλου", make() {
    const trip = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [0, 3, 3], [0, 4, 4], [2, 0, 2], [0, 5, 5]];
    let a, b, r; do { a = ri(-5, 5); b = ri(-5, 5); r = [2, 3, 4, 5, 6][ri(0, 4)]; } while (!a && !b);
    const g = -a, f = -b, c = a * a + b * b - r * r;
    const T = v => (v < 0 ? "-" : "+") + Math.abs(v);
    const eq = `x^2 + y^2 ${g ? T(2 * g) + "x" : ""} ${f ? T(2 * f) + "y" : ""} ${c ? T(c) : ""} = 0`;
    return { q: R`Να βρείτε το κέντρο και την ακτίνα του κύκλου $${eq}$.`,
      fields: [{ label: "κέντρο x =", ans: a }, { label: "κέντρο y =", ans: b }, { label: "R =", ans: r }],
      sol: R`$g = ${g},\ f = ${f},\ c = ${c}$ ⇒ $K(-g, -f) = (${a}, ${b})$, $\;R = \sqrt{${g * g} + ${f * f} ${c >= 0 ? "-" : "+"} ${Math.abs(c)}} = \sqrt{${r * r}} = ${r}$.` };
  } },
  gsub: { title: "Γεννήτρια — ολοκλήρωση με αντικατάσταση", make() {
    const t = ri(0, 3), a = [2, 3, 4, 5][ri(0, 3)], b = ri(-3, 3), n = ri(2, 5);
    const ins = `${a}x ${b ? (b > 0 ? "+" : "-") + Math.abs(b) : ""}`, insT = ins.replace(/ /g, "");
    if (t === 0) return { type: "anti", f: `(${insT})^${n}`, key: `(${insT})^${n + 1}/${a * (n + 1)}`, q: R`$\displaystyle\int(${ins})^{${n}}dx$`, sol: R`$u = ${ins}$, $dx = \frac{du}{${a}}$: $\frac{1}{${a}}\cdot\frac{u^{${n + 1}}}{${n + 1}} = \frac{(${ins})^{${n + 1}}}{${a * (n + 1)}} + c$.` };
    if (t === 1) return { type: "anti", f: `e^(${insT})`, key: `e^(${insT})/${a}`, q: R`$\displaystyle\int e^{${ins}}dx$`, sol: R`$u = ${ins}$: $\frac{1}{${a}}e^{${ins}} + c$.` };
    if (t === 2) return { type: "anti", f: `συν(${insT})`, key: `ημ(${insT})/${a}`, q: R`$\displaystyle\int\text{συν}(${ins})\,dx$`, sol: R`$u = ${ins}$: $\frac{1}{${a}}\text{ημ}(${ins}) + c$.` };
    return { type: "anti", f: `ημ(${insT})`, key: `-συν(${insT})/${a}`, q: R`$\displaystyle\int\text{ημ}(${ins})\,dx$`, sol: R`$u = ${ins}$: $-\frac{1}{${a}}\text{συν}(${ins}) + c$.` };
  } }
});

/* ================= Widgets Γ΄ Κατεύθυνσης — Μέρος Β ================= */
var WIDGETS = Object.assign(window.WIDGETS || {}, {
  parabola(box) {
    box.innerHTML = `<div class="wctl"><span>y² = 4αx</span>
      <label>α <input type="range" class="ra" min="-3" max="3" step="0.25" value="1"><b class="va"></b></label>
      <label>παράμετρος t (σημείο P) <input type="range" class="rt" min="-2.5" max="2.5" step="0.05" value="1.2"><b class="vt"></b></label>
      <label><input type="checkbox" class="tg" checked> εφαπτομένη & κάθετη</label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      let a = +$(".ra", box).value; if (Math.abs(a) < 0.1) { a = 0.25; $(".ra", box).value = a; }
      const t = +$(".rt", box).value; $(".va", box).textContent = fmt(a); $(".vt", box).textContent = fmt(t);
      const P = squarePlot($(".pl", box), 0, 0, 10);
      const ys = []; for (let i = 0; i <= 300; i++) ys.push(-12 + 24 * i / 300);
      P.layer.appendChild(svgEl("path", { d: ys.map((y, i) => (i ? "L" : "M") + P.sx(y * y / (4 * a)).toFixed(1) + "," + P.sy(y).toFixed(1)).join(""), class: "curve c1" }));
      P.seg(-a, -20, -a, 20, "dir"); P.dot(a, 0, "dmin", "E(α, 0)", 6, 16);
      const x0 = a * t * t, y0 = 2 * a * t;
      P.seg(x0, y0, a, 0, "guide"); P.seg(x0, y0, -a, y0, "guide"); P.dot(x0, y0, "d2", "P");
      if ($(".tg", box).checked) {
        if (Math.abs(t) > 1e-6) { const m = 1 / t; P.seg(x0 - 30, y0 - 30 * m, x0 + 30, y0 + 30 * m, "tangent"); P.seg(x0 - 30, y0 + 30 * t, x0 + 30, y0 - 30 * t, "chord"); }
        else { P.seg(0, -20, 0, 20, "tangent"); P.seg(-20, 0, 20, 0, "chord"); }
      }
      const PE = Math.hypot(x0 - a, y0), PD = Math.abs(x0 + a);
      $(".wout", box).innerHTML = `P(αt², 2αt) = (${fmt(x0)}, ${fmt(y0)}) · <b>(PE) = ${fmt(PE)}</b> = <b>d(P, δ) = ${fmt(PD)}</b> ✓ · εστία E(${fmt(a)}, 0), διευθετούσα x = ${fmt(-a)}
        <br>Εφαπτομένη στο P: ty = x + αt² ⇒ κλίση 1/t = ${Math.abs(t) > 1e-6 ? fmt(1 / t) : "∞ (κατακόρυφη)"} · <span class="muted">κόκκινη: εφαπτομένη, μωβ: κάθετη, πράσινη: διευθετούσα</span>`;
    }
    box.querySelectorAll("input").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  series(box) {
    const S = [
      { n: "Γεωμετρική Σ (1/2)^κ", a: k => Math.pow(0.5, k), s: 1 },
      { n: "Γεωμετρική Σ 3·(2/3)^κ", a: k => 3 * Math.pow(2 / 3, k), s: 6 },
      { n: "Τηλεσκοπική Σ 1/(κ(κ+1))", a: k => 1 / (k * (k + 1)), s: 1 },
      { n: "Αρμονική Σ 1/κ (αποκλίνει!)", a: k => 1 / k, s: null },
      { n: "Σ (−1)^κ (ταλαντεύεται)", a: k => (k % 2 ? -1 : 1), s: null }];
    box.innerHTML = `<div class="wctl"><label>Σειρά <select class="fs">${S.map((e, i) => `<option value="${i}">${e.n}</option>`).join("")}</select></label>
      <label>ν όροι <input type="range" class="rn" min="1" max="60" value="12"><b class="vn"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const e = S[$(".fs", box).value], N = +$(".rn", box).value; $(".vn", box).textContent = N;
      const ps = []; let s = 0; for (let k = 1; k <= N; k++) { s += e.a(k); ps.push(s); }
      const lo = Math.min(0, ...ps, e.s ?? 0) - 0.3, hi = Math.max(...ps, e.s ?? 0) * 1.12 + 0.3;
      const P = makePlot($(".pl", box), { xmin: 0, xmax: N + 1, ymin: lo, ymax: hi, H: 260, xstep: niceStep(N), ystep: niceStep(hi - lo) });
      if (e.s !== null) P.seg(0, e.s, N + 1, e.s, "asl");
      ps.forEach((v, i) => P.dot(i + 1, v, "d1"));
      $(".wout", box).innerHTML = `Μερικό άθροισμα $s_{${N}} = ${s.toFixed(6).replace(".", "{,}")}$ ${e.s !== null ? `→ άθροισμα σειράς <b>${e.s}</b> (κόκκινη γραμμή) · απόκλιση ${(e.s - s).toExponential(2)}` : `— <b class="bad">η ακολουθία των μερικών αθροισμάτων δεν συγκλίνει</b>${e.a(1000) < 0.01 ? ", παρόλο που α<sub>κ</sub> → 0!" : ""}`}`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("select,input").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  riemann(box) {
    const F = [
      { n: "x²  στο [0, 1]", f: x => x * x, a: 0, b: 1, I: 1 / 3, L: "1/3" },
      { n: "√x  στο [0, 4]", f: Math.sqrt, a: 0, b: 4, I: 16 / 3, L: "16/3" },
      { n: "ημx  στο [0, π]", f: Math.sin, a: 0, b: Math.PI, I: 2, L: "2" },
      { n: "eˣ  στο [0, 1]", f: Math.exp, a: 0, b: 1, I: Math.E - 1, L: "e − 1" }];
    box.innerHTML = `<div class="wctl"><label>f <select class="fs">${F.map((e, i) => `<option value="${i}">${e.n}</option>`).join("")}</select></label>
      <label>ν ορθογώνια <input type="range" class="rn" min="1" max="60" value="6"><b class="vn"></b></label>
      <label>ύψος από <select class="mode"><option value="r">δεξί άκρο</option><option value="l">αριστερό άκρο</option><option value="m">μέσο</option></select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const e = F[$(".fs", box).value], n = +$(".rn", box).value, md = $(".mode", box).value; $(".vn", box).textContent = n;
      const [lo, hi] = fitY(e.f, e.a, e.b, 0.12, [0]), P = makePlot($(".pl", box), { xmin: e.a - 0.1 * (e.b - e.a), xmax: e.b + 0.1 * (e.b - e.a), ymin: lo, ymax: hi, H: 260 });
      const dx = (e.b - e.a) / n; let S = 0;
      for (let k = 0; k < n; k++) {
        const xl = e.a + k * dx, xi = md === "r" ? xl + dx : md === "l" ? xl : xl + dx / 2, h = e.f(xi); S += h * dx;
        P.layer.appendChild(svgEl("rect", { x: P.sx(xl), y: P.sy(Math.max(h, 0)), width: P.sx(xl + dx) - P.sx(xl), height: Math.abs(P.sy(h) - P.sy(0)), class: "rect" }));
      }
      P.curve(e.f, "c1", e.a, e.b);
      $(".wout", box).innerHTML = `Άθροισμα Riemann με ${n} ορθογώνια: <b>${S.toFixed(5).replace(".", ",")}</b> &nbsp;·&nbsp; ακριβές $\\int = ${e.L} \\approx ${e.I.toFixed(5).replace(".", "{,}")}$ &nbsp;·&nbsp; σφάλμα ${Math.abs(S - e.I).toFixed(5).replace(".", ",")}
        <br><span class="muted">Αύξησε το ν: τα ορθογώνια «γεμίζουν» το χωρίο και το άθροισμα τείνει στο ολοκλήρωμα.</span>`;
      typeset($(".wout", box));
    }
    box.querySelectorAll("select,input").forEach(i => i.oninput = i.onchange = draw); draw();
  },

  area(box) {
    const C = [
      { n: "y = x  και  y = x²", f: x => x, g: x => x * x, a: 0, b: 1, E: "1/6", r: [-0.5, 1.5] },
      { n: "y = 4 − x²  και  y = 0", f: x => 4 - x * x, g: () => 0, a: -2, b: 2, E: "32/3", r: [-3, 3] },
      { n: "y = x  και  y = x³ (δύο χωρία)", f: x => x, g: x => x ** 3, a: -1, b: 1, E: "1/2", r: [-1.6, 1.6], abs: true },
      { n: "y = ημx  και  y = 0,  [0, 2π]", f: Math.sin, g: () => 0, a: 0, b: 2 * Math.PI, E: "4", r: [-0.5, 6.8], abs: true },
      { n: "y = eˣ  και  y = 1,  [0, 1]", f: Math.exp, g: () => 1, a: 0, b: 1, E: "e − 2", r: [-0.5, 1.5] }];
    box.innerHTML = `<div class="wctl"><label>Καμπύλες <select class="fs">${C.map((e, i) => `<option value="${i}">${e.n}</option>`).join("")}</select></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const e = C[$(".fs", box).value], [A, B] = e.r, [lo, hi] = fitY(x => Math.max(e.f(x), e.g(x)), A, B, 0.15, [Math.min(...[A, B, (A + B) / 2].map(e.g)), 0]);
      const P = makePlot($(".pl", box), { xmin: A, xmax: B, ymin: Math.min(lo, -0.5), ymax: hi, H: 280 });
      let d = ""; const n = 200;
      for (let i = 0; i <= n; i++) { const x = e.a + (e.b - e.a) * i / n; d += (i ? "L" : "M") + P.sx(x).toFixed(1) + "," + P.sy(e.f(x)).toFixed(1); }
      for (let i = n; i >= 0; i--) { const x = e.a + (e.b - e.a) * i / n; d += "L" + P.sx(x).toFixed(1) + "," + P.sy(e.g(x)).toFixed(1); }
      P.layer.appendChild(svgEl("path", { d: d + "Z", class: "area" }));
      P.curve(e.f, "c1"); P.curve(e.g, "c3");
      let I = 0, Iabs = 0; for (let i = 0; i < 2000; i++) { const x = e.a + (e.b - e.a) * (i + 0.5) / 2000, v = (e.f(x) - e.g(x)) * (e.b - e.a) / 2000; I += v; Iabs += Math.abs(v); }
      $(".wout", box).innerHTML = `Εμβαδόν (πράσινο) = <b>${e.E}</b> ≈ ${fmt(Iabs)} τ.μ.${e.abs ? ` &nbsp;·&nbsp; <span class="bad">ενώ το «σκέτο» ∫(f − g) = ${fmt(I)}</span> — γι' αυτό σπάμε στα σημεία τομής!` : ""}`;
    }
    $(".fs", box).onchange = draw; draw();
  },

  volume(box) {
    const V = [
      { n: "y = x, [0, 3] → κώνος", f: x => x, a: 0, b: 3, V: "9π" },
      { n: "y = √x, [0, 4]", f: Math.sqrt, a: 0, b: 4, V: "8π" },
      { n: "y = √(9 − x²) → σφαίρα", f: x => Math.sqrt(Math.max(0, 9 - x * x)), a: -3, b: 3, V: "36π" },
      { n: "y = ημx, [0, π]", f: Math.sin, a: 0, b: Math.PI, V: "π²/2" }];
    box.innerHTML = `<div class="wctl"><label>Χωρίο <select class="fs">${V.map((e, i) => `<option value="${i}">${e.n}</option>`).join("")}</select></label>
      <label>δίσκοι <input type="range" class="rn" min="3" max="40" value="10"><b class="vn"></b></label></div><div class="pl"></div><div class="wout"></div>`;
    function draw() {
      const e = V[$(".fs", box).value], n = +$(".rn", box).value; $(".vn", box).textContent = n;
      const M = Math.max(...Array.from({ length: 101 }, (_, i) => e.f(e.a + (e.b - e.a) * i / 100))) * 1.25;
      const P = makePlot($(".pl", box), { xmin: e.a - 0.6, xmax: e.b + 0.6, ymin: -M, ymax: M, H: 300 });
      P.curve(e.f, "c1", e.a, e.b); P.curve(x => -e.f(x), "c1", e.a, e.b);
      const dx = (e.b - e.a) / n; let S = 0;
      for (let k = 0; k < n; k++) {
        const xm = e.a + (k + 0.5) * dx, r = e.f(xm); S += Math.PI * r * r * dx;
        P.layer.appendChild(svgEl("rect", { x: P.sx(e.a + k * dx), y: P.sy(r), width: P.sx(e.a + (k + 1) * dx) - P.sx(e.a + k * dx), height: P.sy(-r) - P.sy(r), class: "rect" }));
        P.layer.appendChild(svgEl("ellipse", { cx: P.sx(xm), cy: P.sy(0), rx: Math.max(1, (P.sx(e.b) - P.sx(e.a)) / n * 0.18), ry: Math.abs(P.sy(r) - P.sy(0)), class: "disk" }));
      }
      P.seg(e.a - 1, 0, e.b + 1, 0, "asl");
      $(".wout", box).innerHTML = `Άθροισμα όγκων ${n} δίσκων: <b>${fmt(S)}</b> &nbsp;·&nbsp; ακριβής όγκος V = π∫y²dx = <b>${e.V}</b> ≈ ${fmt(MathParse.parse(e.V.replace("²", "^2"))(0))}
        <br><span class="muted">Κάθε δίσκος έχει ακτίνα y = f(x) και πάχος dx: όγκος πy²dx. Όσο περισσότεροι δίσκοι, τόσο πιο κοντά στο ολοκλήρωμα.</span>`;
    }
    box.querySelectorAll("select,input").forEach(i => i.oninput = i.onchange = draw); draw();
  }
});

var GENS = Object.assign(window.GENS || {}, {
  gpar: { title: "Γεννήτρια — εστία & διευθετούσα", make() {
    const k = [-12, -8, -6, -4, -2, 2, 4, 6, 8, 10, 12, 16, 20][ri(0, 12)], xy = Math.random() < 0.6;
    const a = k / 4, F = v => Number.isInteger(v) ? `${v}` : `${k}/4`;
    return xy ? { q: R`Να βρείτε την εστία και τη διευθετούσα της παραβολής $y^2 = ${k}x$.`, fields: [{ label: "εστία: x =", ans: `${k}/4` }, { label: "διευθετούσα: x =", ans: `${-k}/4` }],
      sol: R`$4\alpha = ${k} \Rightarrow \alpha = ${fracT(k, 4)}$. Εστία $E(${fracT(k, 4)}, 0)$, διευθετούσα $x = ${fracT(-k, 4)}$.` }
      : { q: R`Να βρείτε την εστία και τη διευθετούσα της παραβολής $x^2 = ${k}y$.`, fields: [{ label: "εστία: y =", ans: `${k}/4` }, { label: "διευθετούσα: y =", ans: `${-k}/4` }],
      sol: R`$4\alpha = ${k} \Rightarrow \alpha = ${fracT(k, 4)}$. Εστία $E(0, ${fracT(k, 4)})$, διευθετούσα $y = ${fracT(-k, 4)}$.` };
  } },
  gsum: { title: "Γεννήτρια — αθροίσματα", make() {
    const t = ri(0, 2), n = ri(5, 25);
    if (t === 0) return { q: R`Να υπολογίσετε $\displaystyle\sum_{\kappa=1}^{${n}}\kappa$.`, fields: [{ label: "άθροισμα =", ans: n * (n + 1) / 2 }], sol: R`$\frac{${n}\cdot${n + 1}}{2} = ${n * (n + 1) / 2}$.` };
    if (t === 1) return { q: R`Να υπολογίσετε $\displaystyle\sum_{\kappa=1}^{${n}}\kappa^2$.`, fields: [{ label: "άθροισμα =", ans: n * (n + 1) * (2 * n + 1) / 6 }], sol: R`$\frac{${n}\cdot${n + 1}\cdot${2 * n + 1}}{6} = ${n * (n + 1) * (2 * n + 1) / 6}$.` };
    const a = ri(2, 5), b = ri(1, 9);
    return { q: R`Να υπολογίσετε $\displaystyle\sum_{\kappa=1}^{${n}}(${a}\kappa + ${b})$.`, fields: [{ label: "άθροισμα =", ans: a * n * (n + 1) / 2 + b * n }], sol: R`$${a}\cdot\frac{${n}\cdot${n + 1}}{2} + ${b}\cdot${n} = ${a * n * (n + 1) / 2 + b * n}$.` };
  } },
  gdef: { title: "Γεννήτρια — ορισμένα ολοκληρώματα", make() {
    const a = ri(-2, 1), b = a + ri(1, 3), c2 = ri(-2, 3) * 3, c1 = ri(-3, 4) * 2, c0 = ri(-4, 5);
    const F = x => c2 / 3 * x ** 3 + c1 / 2 * x * x + c0 * x, val = Math.round((F(b) - F(a)) * 1e6) / 1e6;
    return { q: R`Να υπολογίσετε $\displaystyle\int_{${a}}^{${b}}\left(${texPoly([[c2, 2], [c1, 1], [c0, 0]])}\right)dx$.`, fields: [{ label: "τιμή =", ans: val }],
      sol: R`$\left[${texPoly([[c2 / 3, 3], [c1 / 2, 2], [c0, 1]]).replace(/\d+\.\d+/g, m => (+m).toFixed(4).replace(/0+$/, ''))}\right]_{${a}}^{${b}} = ${fmt(F(b)).replace(',', '{,}')} - (${fmt(F(a)).replace(',', '{,}')}) = ${fmt(val).replace(',', '{,}')}$.` };
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

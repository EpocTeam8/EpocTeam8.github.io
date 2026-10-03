
(function () {
  'use strict';
  const D = window.RESPIRA || {};
  const GROUPS = ['control', 'pre-COPD', 'COPD'];
  const GCOL = { 'control': 'var(--s1)', 'pre-COPD': 'var(--s2)', 'COPD': 'var(--s3)' };
  const NS = 'http://www.w3.org/2000/svg';

  const $ = (s) => document.querySelector(s);
  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    for (const k in attrs || {}) {
      if (k === 'html') n.innerHTML = attrs[k];
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    for (const c of kids.flat()) if (c != null) n.append(c.nodeType ? c : document.createTextNode(c));
    return n;
  }
  function sv(tag, attrs, ...kids) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs || {}) n.setAttribute(k, attrs[k]);
    for (const c of kids.flat()) if (c != null) n.append(c.nodeType ? c : document.createTextNode(c));
    return n;
  }
  const fmt = (x, d = 2) => (x == null || Number.isNaN(x)) ? '—' : Number(x).toFixed(d);
  const fmtP = (p) => p == null ? '—' : (p < 0.001 ? '< 0.001' : p.toFixed(3));
  const sign = (x, d = 2) => x == null ? '—' : (x > 0 ? '+' : '') + Number(x).toFixed(d);
  const nice = (lo, hi, n = 5) => {
    const span = hi - lo || 1, raw = span / n, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => span / s <= n) || mag * 10;
    const a = Math.floor(lo / step) * step, b = Math.ceil(hi / step) * step, out = [];
    for (let v = a; v <= b + 1e-9; v += step) out.push(+v.toFixed(10));
    return out;
  };
  const lin = (d0, d1, r0, r1) => (v) => r0 + (v - d0) / ((d1 - d0) || 1) * (r1 - r0);

  const tip = $('#tip');
  function showTip(evt, html) {
    tip.innerHTML = html; tip.hidden = false;
    const pad = 14, w = tip.offsetWidth, h = tip.offsetHeight;
    let x = evt.clientX + pad, y = evt.clientY + pad;
    if (x + w > innerWidth - 8) x = evt.clientX - w - pad;
    if (y + h > innerHeight - 8) y = evt.clientY - h - pad;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  const hideTip = () => { tip.hidden = true; };
  function hover(node, html) {
    node.addEventListener('pointerenter', e => showTip(e, html()));
    node.addEventListener('pointermove', e => showTip(e, html()));
    node.addEventListener('pointerleave', hideTip);
    node.setAttribute('tabindex', '0'); node.classList.add('focus');
    node.addEventListener('focus', () => { const r = node.getBoundingClientRect(); showTip({ clientX: r.left + r.width / 2, clientY: r.top }, html()); });
    node.addEventListener('blur', hideTip);
  }

  function figure(id, title, subtitle, body, tableRows, legend) {
    const f = $(id); if (!f) return;
    f.innerHTML = '';
    f.append(el('div', { class: 't' }, title), el('div', { class: 'st' }, subtitle || ''));
    if (!body) { f.append(el('div', { class: 'pending' }, 'Not yet run on this cohort. The section fills in when the result folder exists.')); return; }
    f.append(body);
    const foot = el('div', { class: 'foot' });
    if (legend && legend.length) foot.append(el('div', { class: 'legend' }, legend.map(([name, col]) => el('span', {}, el('i', { style: 'background:' + col }), name))));
    if (tableRows) {
      const det = el('details', { class: 'tv' }, el('summary', {}, 'Show as table'));
      det.append(el('div', { class: 'tbl-wrap' }, table(tableRows)));
      foot.append(det);
    }
    f.append(foot);
  }
  function table(rows, opts = {}) {
    if (!rows || !rows.length) return el('div', { class: 'pending' }, 'no rows');
    const cols = opts.cols || Object.keys(rows[0]);
    const numeric = (v) => typeof v === 'number';
    return el('table', {},
      el('thead', {}, el('tr', {}, cols.map(c => el('th', { class: numeric(rows[0][c]) ? 'num' : '' }, (opts.labels || {})[c] || c)))),
      el('tbody', {}, rows.map(r => el('tr', { class: opts.hi && opts.hi(r) ? 'hi' : '' },
        cols.map(c => el('td', { class: numeric(r[c]) ? 'num' : '' }, numeric(r[c]) ? fmt(r[c], (opts.digits || {})[c] ?? 3) : (r[c] == null ? '—' : String(r[c]))))))));
  }
  function tile(k, v, d, warn) {
    return el('div', { class: 'tile' + (warn ? ' warn' : '') }, el('div', { class: 'k' }, k), el('div', { class: 'v', html: v }), d ? el('div', { class: 'd' }, d) : null);
  }
  function pendingTiles(id, msg) { const n = $(id); n.innerHTML = ''; n.append(el('div', { class: 'pending' }, msg)); }

  (function theme() {
    const b = $('#theme');
    const cur = () => document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const paint = () => b.setAttribute('aria-pressed', cur() === 'dark');
    b.addEventListener('click', () => {
      const next = cur() === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('respira-theme', next); } catch (e) {}
      paint();
    });
    paint();
  })();
  $('#stamp').textContent = 'built ' + (D.generated_utc || '—').replace('T', ' ').slice(0, 16) + ' UTC · v' + (D.version || '?') + (D.public ? ' · public build (no subject imagery)' : '');

  (function cohort() {
    const c = D.cohort;
    if (!c) return pendingTiles('#cohort-tiles', 'Run `respira-maps cohort` to populate.');
    const t = $('#cohort-tiles'); t.innerHTML = '';
    const ct = c.with_ct || {};
    t.append(
      tile('Subjects in the clinical table', c.n_subjects),
      tile('With follow-up visit', c.n_with_v2, `follow-up ${c.follow_up_years.min}–${c.follow_up_years.max} yr, mean ${c.follow_up_years.mean}`),
      tile('Accelerated decliners', `${c.rapid_decline}<small>of ${c.n_with_v2}</small>`, 'dFEV1 ≤ −60 mL/yr — the endpoint'),
      tile('COPD at baseline', c.copd_v1, 'post-BD FEV1/FVC < 0.70'),
      tile('Pre-COPD', c.pre_copd, 'ratio ≥ 0.70 and emphysema on CT'),
      tile('Controls', c.control, 'ratio ≥ 0.70, no emphysema'),
      tile('Imaged (released CT)', Object.values(ct).reduce((a, b) => a + b, 0) || '—', GROUPS.map(g => `${ct[g] || 0} ${g}`).join(' · ')),
      tile('Incident COPD', c.incident_copd, 'unusable as an endpoint', true),
    );
    const h = D.tier_a && D.tier_a.dfev1_hist;
    if (!h) return figure('#fig-dfev1', 'Distribution of FEV1 change', '', null);
    const W = 720, H = 240, m = { l: 36, r: 12, t: 10, b: 34 };
    const x = lin(h.edges[0], h.edges[h.edges.length - 1], m.l, W - m.r);
    const ymax = Math.max(...h.counts), y = lin(0, ymax, H - m.b, m.t);
    const s = sv('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Histogram of FEV1 change per year' });
    const gl = sv('g', { class: 'gl' });
    nice(0, ymax, 4).forEach(v => { if (v <= ymax) { gl.append(sv('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) })); s.append(sv('text', { class: 'lbl', x: m.l - 6, y: y(v) + 4, 'text-anchor': 'end' }, v)); } });
    s.append(gl);
    h.counts.forEach((n, i) => {
      const a = h.edges[i], b = h.edges[i + 1], decl = b <= h.threshold;
      const bw = x(b) - x(a) - 2, bh = (H - m.b) - y(n);
      if (n > 0) {
        const r = sv('path', { d: roundTop(x(a) + 1, y(n), bw, bh, 4), fill: decl ? 'var(--s2)' : 'var(--s1)' });
        hover(r, () => `<b>${a} to ${b} mL/yr</b>${n} subject${n === 1 ? '' : 's'}${decl ? ' · accelerated decline' : ''}`);
        s.append(r);
      }
    });
    s.append(sv('line', { class: 'ax', x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b, stroke: 'var(--axis)' }));
    s.append(sv('line', { class: 'ref', x1: x(h.threshold), x2: x(h.threshold), y1: m.t, y2: H - m.b }));
    s.append(sv('text', { class: 'lbl2', x: x(h.threshold) - 6, y: m.t + 12, 'text-anchor': 'end' }, '−60 mL/yr'));
    [-200, -100, 0, 100, 200].forEach(v => s.append(sv('text', { class: 'lbl', x: x(v), y: H - 12, 'text-anchor': 'middle' }, sign(v, 0))));
    s.append(sv('text', { class: 'lbl', x: W - m.r, y: H - 12, 'text-anchor': 'end' }, 'mL / yr'));
    figure('#fig-dfev1', `Change in FEV1 per year, ${h.n} subjects with follow-up`,
      'Noisy by construction: part of the spread is measurement, not biology. The threshold is a population instrument.',
      s, h.counts.map((n, i) => ({ from: h.edges[i], to: h.edges[i + 1], subjects: n })),
      [['accelerated decline', 'var(--s2)'], ['other', 'var(--s1)']]);
  })();
  function roundTop(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
  }

  (function tierA() {
    const t = D.tier_a;
    if (!t) { figure('#fig-tiera', 'Clinical model, AUC with 95% CI', '', null); figure('#fig-uni', 'Per-covariate comparison', '', null); return; }
    const rows = t.models, W = 720, rowH = 40, m = { l: 150, r: 24, t: 14, b: 30 }, H = m.t + m.b + rowH * rows.length;
    const lo = Math.min(0.3, ...rows.map(r => r.ci_lo)), hi = Math.max(0.9, ...rows.map(r => r.ci_hi));
    const x = lin(lo, hi, m.l, W - m.r);
    const s = sv('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'AUC with confidence intervals per clinical model' });
    const gl = sv('g', { class: 'gl' });
    nice(lo, hi, 6).forEach(v => { if (v >= lo && v <= hi) { gl.append(sv('line', { x1: x(v), x2: x(v), y1: m.t, y2: H - m.b })); s.append(sv('text', { class: 'lbl', x: x(v), y: H - 10, 'text-anchor': 'middle' }, v.toFixed(1))); } });
    s.append(gl);
    s.append(sv('line', { class: 'ref', x1: x(0.5), x2: x(0.5), y1: m.t, y2: H - m.b }));
    s.append(sv('text', { class: 'lbl2', x: x(0.5) + 5, y: m.t + 10 }, 'chance'));
    const names = { primary: 'primary (6 covariates)', sensitivity: 'sensitivity (+ smoker, DLCO)', fev1_only: 'FEV1 %pred alone' };
    rows.forEach((r, i) => {
      const cy = m.t + rowH * i + rowH / 2;
      s.append(sv('text', { class: 'lbl2', x: m.l - 10, y: cy + 4, 'text-anchor': 'end' }, names[r.model] || r.model));
      s.append(sv('line', { x1: x(r.ci_lo), x2: x(r.ci_hi), y1: cy, y2: cy, stroke: 'var(--s1)', 'stroke-width': 2, 'stroke-linecap': 'round' }));
      const dot = sv('circle', { cx: x(r.auc), cy, r: 6, fill: 'var(--s1)', class: 'ring' });
      hover(dot, () => `<b>${names[r.model] || r.model}</b>AUC ${fmt(r.auc)} [${fmt(r.ci_lo)}, ${fmt(r.ci_hi)}]<br>n ${r.n}, events ${r.events}<br>Brier ${fmt(r.brier, 3)} · AUPRC ${fmt(r.auprc)} (prevalence ${fmt(r.prevalence)})`);
      s.append(dot);
      s.append(sv('text', { class: 'val', x: x(r.ci_hi) + 8, y: cy + 4 }, fmt(r.auc)));
    });
    const p = rows.find(r => r.model === 'primary') || rows[0];
    const verdict = p.ci_lo <= 0.5 ? 'The interval includes chance: age, sex, BMI, pack-years and spirometry do not predict who declines fast in this cohort. That is the floor, and it is low — exactly why spirometry alone is not enough.' : 'The clinical model is above chance; imaging has to beat this interval, not 0.5.';
    figure('#fig-tiera', `Clinical model: AUC ${fmt(p.auc)} [${fmt(p.ci_lo)}, ${fmt(p.ci_hi)}], n = ${p.n}, ${p.events} events`, verdict, s,
      rows.map(r => ({ model: r.model, covariates: r.covariates, n: r.n, events: r.events, AUC: r.auc, 'CI low': r.ci_lo, 'CI high': r.ci_hi, Brier: r.brier })));

    const u = t.univariate || [];
    const labels = { age: 'age (yr)', sex_female: 'female', bmi: 'BMI', pack_years: 'pack-years', fev1_pp_gli: 'FEV1 % pred (GLI)', fev1_fvc_ratio: 'FEV1/FVC', current_smoker: 'current smoker', dlco_pp: 'DLCO % pred' };
    const body = el('div', { class: 'tbl-wrap' }, table(u.map(r => ({
      covariate: labels[r.covariate] || r.covariate,
      'decliners, median [IQR]': r.event_median_iqr, 'others, median [IQR]': r.no_event_median_iqr,
      "Cliff's δ": r.cliffs_delta, 'exact p': fmtP(r.p_exact),
    })), { digits: { "Cliff's δ": 2 }, hi: r => Math.abs(r["Cliff's δ"]) >= 0.33 }));
    figure('#fig-uni', 'Per-covariate comparison, decliners vs the rest', 'Cliff\'s delta is an effect size (|0.33| medium, |0.47| large). Exact Mann–Whitney. Highlighted rows reach a medium effect. No multiplicity correction: this is description, not inference.', body);
  })();

  (function imaging() {
    const inv = D.inventory, b = D.bridge;
    const t = $('#inv-tiles'); t.innerHTML = '';
    if (!inv && !b) { pendingTiles('#inv-tiles', 'Run `scripts/inventory.py` and `respira-maps ingest` to populate.'); figure('#fig-scanner', 'Scanner heterogeneity', '', null); return; }
    const kern = (inv && inv.kernels) || (b && b.scanner && b.scanner.kernels) || {};
    const thick = (inv && inv.slice_thickness) || (b && b.scanner && b.scanner.slice_thickness) || {};
    if (inv) t.append(tile('CT series in the archive', inv.n_series, `${inv.n_usable_ct} usable (≥ 40 slices, no scouts)`), tile('Imaged subjects', inv.n_subjects, 'the limiting number is the smallest group'));
    if (b) t.append(tile('Subjects with QCT + clinical', b.n_imaged, GROUPS.map(g => `${b.n_by_group[g] || 0} ${g}`).join(' · ')));
    t.append(tile('Reconstruction kernels', Object.keys(kern).length || '—', Object.keys(kern).slice(0, 4).join(', ')),
      tile('Slice thicknesses', Object.keys(thick).length || '—', Object.keys(thick).slice(0, 4).map(k => k + ' mm').join(', ')),
      tile('Expiratory series', inv ? (inv.expiratory_detected ? 'yes' : 'none found') : '—', inv ? (inv.expiratory_detected ? 'PRM / fSAD is live' : 'PRM not possible; dysanapsis carries the imaging') : 'inventory not supplied', inv && !inv.expiratory_detected));
    const entries = Object.entries(kern).sort((a, b2) => b2[1] - a[1]);
    if (!entries.length) return figure('#fig-scanner', 'Scanner heterogeneity', '', null);
    const W = 720, rowH = 30, m = { l: 160, r: 40, t: 8, b: 8 }, H = m.t + m.b + rowH * entries.length;
    const x = lin(0, Math.max(...entries.map(e => e[1])), m.l, W - m.r);
    const s = sv('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Series per reconstruction kernel' });
    entries.forEach(([k, n], i) => {
      const y = m.t + rowH * i + 4, h = rowH - 8;
      s.append(sv('text', { class: 'lbl2', x: m.l - 10, y: y + h / 2 + 4, 'text-anchor': 'end' }, k || '(blank)'));
      const r = sv('path', { d: roundRight(m.l, y, x(n) - m.l, h, 4), fill: 'var(--s1)' });
      hover(r, () => `<b>${k || '(blank kernel)'}</b>${n} series`);
      s.append(r, sv('text', { class: 'val', x: x(n) + 8, y: y + h / 2 + 4 }, n));
    });
    figure('#fig-scanner', 'Series per reconstruction kernel', 'Sharp kernels inflate the low-attenuation tail that %LAA-950 measures. Read this before comparing subjects.', s, entries.map(([k, n]) => ({ kernel: k, series: n })));
  })();
  function roundRight(x, y, w, h, r) {
    r = Math.min(r, h / 2, Math.max(w, 0));
    return `M${x},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x} Z`;
  }

  (function bridge() {
    const b = D.bridge;
    if (!b) { figure('#fig-strip', 'Score by group', '', null); figure('#fig-rank', 'Ordering within the pre-COPD group', '', null); figure('#fig-bridge-table', 'Medians, effect sizes, exact tests', '', null); pendingTiles('#bridge-cards', 'Run `respira-maps bridge` after ingest.'); return; }
    const meta = {}; b.groups.forEach(g => { meta[g.score] = g; });
    const within = b.within || {};
    let score = b.primary_score;
    const pick = $('#score-picker');
    function paintPicker() {
      pick.innerHTML = '';
      b.scores.forEach(sc => pick.append(el('button', { type: 'button', role: 'tab', class: 'btn' + (sc === score ? ' on' : ''), 'aria-selected': sc === score, onclick: () => { score = sc; paintPicker(); draw(); } }, (within[sc] || {}).label || sc)));
    }
    function draw() {
      const g = meta[score], w = within[score] || {}, subs = b.subjects.filter(s => s.scores[score] != null);
      const vals = subs.map(s => s.scores[score]);
      const lo = Math.min(...vals), hi = Math.max(...vals), pad = (hi - lo || 1) * 0.12;
      const W = 720, H = 300, m = { l: 56, r: 16, t: 16, b: 34 };
      const y = lin(lo - pad, hi + pad, H - m.b, m.t), gx = (gi) => m.l + (W - m.l - m.r) * (gi + 0.5) / 3;
      const s = sv('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `${w.label} by group` });
      const gl = sv('g', { class: 'gl' });
      nice(lo - pad, hi + pad, 5).forEach(v => { if (v >= lo - pad && v <= hi + pad) { gl.append(sv('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) })); s.append(sv('text', { class: 'lbl', x: m.l - 8, y: y(v) + 4, 'text-anchor': 'end' }, +v.toFixed(4))); } });
      s.append(gl);
      GROUPS.forEach((grp, gi) => {
        const pts = subs.filter(x => x.group === grp).sort((a, c) => a.scores[score] - c.scores[score]);
        s.append(sv('text', { class: 'lbl2', x: gx(gi), y: H - 12, 'text-anchor': 'middle' }, `${grp} (n=${pts.length})`));
        if (!pts.length) return;
        const med = pts.map(p => p.scores[score]).sort((a, c) => a - c), mv = med.length % 2 ? med[(med.length - 1) / 2] : (med[med.length / 2 - 1] + med[med.length / 2]) / 2;
        s.append(sv('line', { x1: gx(gi) - 40, x2: gx(gi) + 40, y1: y(mv), y2: y(mv), stroke: GCOL[grp], 'stroke-width': 2, 'stroke-linecap': 'round' }));
        let lastY = -1e9, off = 0;
        pts.forEach(p => {
          const py = y(p.scores[score]);
          off = (py - lastY) < 14 ? (off <= 0 ? -off + 14 : -off) : 0; lastY = py;
          const c = sv('circle', { cx: gx(gi) + off, cy: py, r: 7, fill: GCOL[grp], class: 'ring' });
          hover(c, () => `<b>${p.id} · ${p.group}</b>${w.label}: ${fmt(p.scores[score], 3)}<br>dFEV1 ${p.dfev1 == null ? '—' : sign(p.dfev1, 0) + ' mL/yr'}${p.rapid_decline ? ' (accelerated)' : ''}<br>radiologist read: ${p.emphysema_read == null ? '—' : (p.emphysema_read ? 'emphysema' : 'no emphysema')}<br>kernel ${p.kernel || '—'}, ${p.slice_thickness || '—'} mm`);
          s.append(c);
        });
      });
      const rho = w.spearman_vs_dfev1_all || {};
      figure('#fig-strip', `${w.label} by group`, `${w.direction}. Horizontal tick = group median. Spearman with FEV1 decline across all ${rho.n || '—'}: ρ = ${fmt(rho.rho)}, permutation p = ${fmtP(rho.p)}.`, s,
        subs.map(p => ({ subject: p.id, group: p.group, [w.label]: p.scores[score], 'dFEV1 mL/yr': p.dfev1, 'radiologist read': p.emphysema_read })), GROUPS.map(gp => [gp, GCOL[gp]]));

      const pre = subs.filter(x => x.group === 'pre-COPD').sort((a, c) => (c.scores[score] - a.scores[score]) * (w.direction.startsWith('higher') ? 1 : -1));
      if (pre.length) {
        const W2 = 720, rowH = 34, m2 = { l: 130, r: 60, t: 8, b: 8 }, H2 = m2.t + m2.b + rowH * pre.length;
        const mx = Math.max(...pre.map(p => Math.abs(p.scores[score])));
        const x2 = lin(0, mx || 1, m2.l, W2 - m2.r);
        const s2 = sv('svg', { viewBox: `0 0 ${W2} ${H2}`, role: 'img', 'aria-label': 'Pre-COPD subjects ranked by score' });
        pre.forEach((p, i) => {
          const yy = m2.t + rowH * i + 5, h = rowH - 10;
          s2.append(sv('text', { class: 'lbl2', x: m2.l - 10, y: yy + h / 2 + 4, 'text-anchor': 'end' }, p.id));
          const r = sv('path', { d: roundRight(m2.l, yy, x2(Math.abs(p.scores[score])) - m2.l, h, 4), fill: 'var(--s2)' });
          hover(r, () => `<b>${p.id}</b>${w.label}: ${fmt(p.scores[score], 3)}<br>radiologist read: ${p.emphysema_read ? 'emphysema' : 'no emphysema'} (identical for every row)<br>dFEV1 ${p.dfev1 == null ? '—' : sign(p.dfev1, 0) + ' mL/yr'}`);
          s2.append(r, sv('text', { class: 'val', x: x2(Math.abs(p.scores[score])) + 8, y: yy + h / 2 + 4 }, fmt(p.scores[score], 3)));
        });
        const gp = (w.groups || {})['pre-COPD'] || {};
        figure('#fig-rank', 'Ordering within the pre-COPD group', `The binary read gives all ${pre.length} the same value. The continuous score spans ${fmt(gp.min, 3)} to ${fmt(gp.max, 3)}${gp.cv_pct != null ? ` (CV ${fmt(gp.cv_pct, 0)}%)` : ''}. Whether that ordering is clinically meaningful is a hypothesis for a bigger cohort, not a result here.`, s2,
          pre.map(p => ({ subject: p.id, [w.label]: p.scores[score], 'dFEV1 mL/yr': p.dfev1 })));
      } else figure('#fig-rank', 'Ordering within the pre-COPD group', '', null);

      const rows = b.groups.map(r => ({
        score: r.label, control: r.control_median_iqr, 'pre-COPD': r.precopd_median_iqr, COPD: r.copd_median_iqr,
        "δ pre vs control": r.cliffs_delta_pre_vs_control, 'δ 95% CI': `[${fmt(r.delta_ci_lo)}, ${fmt(r.delta_ci_hi)}]`, 'exact p': fmtP(r.p_exact_pre_vs_control),
        'δ COPD vs control': r.cliffs_delta_copd_vs_control, 'exact p ': fmtP(r.p_exact_copd_vs_control),
      }));
      figure('#fig-bridge-table', 'Medians, effect sizes, exact tests', 'Median [IQR] per group. Cliff\'s delta is signed in the "more damage" direction, bootstrap CI over 2000 resamples. With 4 vs 5 the CI of any effect size covers most of its range; that is reported, not hidden.', el('div', { class: 'tbl-wrap' }, table(rows, { digits: { "δ pre vs control": 2, 'δ COPD vs control': 2 }, hi: r => r.score === (within[score] || {}).label })));
    }
    const bc = b.binary_vs_continuous || {};
    const cards = $('#bridge-cards'); cards.innerHTML = '';
    cards.append(
      tile(`${bc.label} when the radiologist said emphysema`, bc.read_yes_median_iqr || '—', `n = ${bc.n_yes}, non-COPD only`),
      tile(`${bc.label} when the radiologist said none`, bc.read_no_median_iqr || '—', `n = ${bc.n_no}, non-COPD only`),
      tile('Do the two distributions overlap?', bc.overlap ? 'yes' : 'no', `Cliff's δ ${fmt(bc.cliffs_delta)}, exact p ${fmtP(bc.p_exact)}. Expected: the read helped define the groups.`),
    );
    paintPicker(); draw();

    const L = b.longitudinal;
    if (L && L.rows.length) {
      const rows = L.rows, label = ((within[L.score] || {}).label) || L.score;
      const xs = rows.flatMap(r => r.points.map(p => p[0])), ys = rows.flatMap(r => r.points.map(p => p[1]));
      const W = 720, H = 300, m = { l: 56, r: 16, t: 16, b: 36 };
      const x = lin(0, Math.max(1, ...xs), m.l, W - m.r), ylo = Math.min(...ys), yhi = Math.max(...ys), pad = (yhi - ylo || 1) * 0.1;
      const y = lin(ylo - pad, yhi + pad, H - m.b, m.t);
      const s = sv('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `${label} across repeat CTs per subject` });
      const gl = sv('g', { class: 'gl' });
      nice(ylo - pad, yhi + pad, 5).forEach(v => { if (v >= ylo - pad && v <= yhi + pad) { gl.append(sv('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) })); s.append(sv('text', { class: 'lbl', x: m.l - 8, y: y(v) + 4, 'text-anchor': 'end' }, +v.toFixed(3))); } });
      s.append(gl);
      nice(0, Math.max(1, ...xs), 6).forEach(v => s.append(sv('text', { class: 'lbl', x: x(v), y: H - 12, 'text-anchor': 'middle' }, v)));
      s.append(sv('text', { class: 'lbl', x: W - m.r, y: H - 12, 'text-anchor': 'end' }, 'years since first CT'));
      rows.forEach(r => {
        const d = r.points.map((p, i) => (i ? 'L' : 'M') + x(p[0]) + ',' + y(p[1])).join(' ');
        s.append(sv('path', { d, fill: 'none', stroke: GCOL[r.group] || 'var(--s1)', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
        r.points.forEach(p => {
          const c = sv('circle', { cx: x(p[0]), cy: y(p[1]), r: p[2] ? 4.5 : 5.5, fill: p[2] ? 'var(--surface)' : (GCOL[r.group] || 'var(--s1)'), stroke: GCOL[r.group] || 'var(--s1)', 'stroke-width': 2 });
          hover(c, () => `<b>${r.subject} · ${r.group}</b>${label}: ${fmt(p[1], 3)} at +${fmt(p[0], 1)} yr${p[2] ? '<br>IV contrast (raises attenuation)' : ''}<br>slope ${sign(r[L.score + '_slope_per_year'], 3)} / yr over ${r.n_ct} CTs`);
          s.append(c);
        });
      });
      figure('#fig-longi', `${label} across repeat CTs, ${rows.length} subjects with ≥ 2 studies`,
        'Each line is one subject; hollow points are contrast-enhanced studies. Descriptive only: single-digit n, mixed kernels and contrast. It shows the measurement is repeatable enough to track, not that anyone progressed.', s,
        rows.map(r => ({ subject: r.subject, group: r.group, CTs: r.n_ct, 'span (yr)': r.span_years, 'with contrast': r.n_contrast, first: r[L.score + '_first'], last: r[L.score + '_last'], 'slope / yr': r[L.score + '_slope_per_year'] })),
        GROUPS.map(gp => [gp, GCOL[gp]]));
    } else figure('#fig-longi', 'Across repeat CTs', '', null);
    if (b.prm) {
      cards.append(tile(`PRM available for ${b.prm.n_subjects} subject${b.prm.n_subjects === 1 ? '' : 's'}`,
        b.prm.rows.map(r => `fSAD ${fmt(r.fsad_pct, 1)}%`).join(' · '), b.prm.note));
    }
  })();

  (function subjects() {
    const ui = $('#subject-ui'), figs = D.figures || [];
    if (!figs.length) { ui.append(el('div', { class: 'pending' }, D.public ? 'Public build: per-subject imagery is omitted by policy. Aggregate figures above are unaffected.' : 'Run `respira-maps figures` after ingest.')); return; }
    const byGroup = [...figs].sort((a, b) => GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group) || a.id.localeCompare(b.id) || (a.study_index || 0) - (b.study_index || 0));
    const tpLabel = f => (f.n_studies > 1 ? ` · CT ${(f.study_index || 0) + 1}/${f.n_studies}${f.years_from_first_ct ? ` (+${fmt(f.years_from_first_ct, 1)} yr)` : ''}` : '') + (f.contrast ? ' · contrast' : '') + (f.is_primary === false ? '' : (f.n_studies > 1 ? ' · primary' : ''));
    const sel = el('select', { class: 'sel', 'aria-label': 'Subject' }, byGroup.map((f, i) => el('option', { value: i }, `${f.group || '?'} · ${f.id}${tpLabel(f)}${f.dfev1 != null ? ` · dFEV1 ${sign(f.dfev1, 0)} mL/yr` : ''}`)));
    const img = el('img', { alt: 'CT panel', loading: 'lazy' }), meta = el('div', { class: 'meta' });
    const show = (i) => {
      const f = byGroup[i], s = (D.bridge && D.bridge.subjects.find(x => x.id === f.id)) || { scores: {} };
      img.src = f.file; img.alt = `CT panel for ${f.id}`;
      meta.innerHTML = '';
      const items = [['group', f.group || '—'], ['dFEV1', s.dfev1 == null ? '—' : sign(s.dfev1, 0) + ' mL/yr'], ['radiologist read', s.emphysema_read == null ? '—' : (s.emphysema_read ? 'emphysema' : 'none')]];
      for (const k in s.scores) items.push([((D.bridge.within || {})[k] || {}).label || k, fmt(s.scores[k], 3)]);
      items.push(['kernel', f.kernel || s.kernel || '—'], ['slice', (f.slice_thickness || s.slice_thickness || '—') + ' mm']);
      items.forEach(([k, v]) => meta.append(el('div', {}, k, el('b', {}, v))));
    };
    sel.addEventListener('change', e => show(+e.target.value));
    ui.append(el('div', { class: 'subject' }, sel, img, meta));
    show(0);
  })();

  (function molecular() {
    const mo = D.molecular;
    if (!mo) { pendingTiles('#mol-tiles', 'Run `respira-maps molecular` to populate.'); figure('#fig-null', 'Permutation null', '', null); figure('#fig-block', 'Imaging + clinical loadings', '', null); return; }
    const t = $('#mol-tiles'); t.innerHTML = '';
    const rec = mo.recovery || {};
    t.append(
      tile('Mode', mo.mode, mo.honest_label, mo.mode !== 'REAL'),
      tile('Canonical correlation', fmt(mo.canonical_correlation), `permutation p ${fmtP(mo.p_permutation)} (${mo.n_perm} perms, null 95th pct ${fmt(mo.null_rho_95)})`),
      tile('CpGs selected', mo.n_cpg_selected, `of ${mo.n_cpg}, L1 bound ${fmt(mo.l1_bounds[0], 1)}`),
      mo.recovery ? tile('Recovery of planted CpGs', `${fmt(rec.precision * 100, 0)}%<small>precision</small>`, `recall ${fmt(rec.recall * 100, 0)}% of ${rec.n_true} planted`) : null,
      tile('Shared factor', `${fmt(mo.shared_factor_var_explained * 100, 1)}%<small>variance</small>`, `|r| with sCCA score ${fmt(mo.shared_factor_agreement_with_scca)}`),
    );
    const nul = mo.null_rho || [];
    if (nul.length) {
      const lo = Math.min(...nul, mo.canonical_correlation) - 0.02, hi = Math.max(...nul, mo.canonical_correlation) + 0.02, nb = 24;
      const edges = Array.from({ length: nb + 1 }, (_, i) => lo + (hi - lo) * i / nb), counts = new Array(nb).fill(0);
      nul.forEach(v => { counts[Math.min(nb - 1, Math.floor((v - lo) / (hi - lo) * nb))]++; });
      const W = 720, H = 220, m = { l: 36, r: 12, t: 12, b: 30 }, x = lin(lo, hi, m.l, W - m.r), y = lin(0, Math.max(...counts), H - m.b, m.t);
      const s = sv('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Permutation null distribution of the canonical correlation' });
      counts.forEach((n, i) => { if (n) { const r = sv('path', { d: roundTop(x(edges[i]) + 1, y(n), x(edges[i + 1]) - x(edges[i]) - 2, (H - m.b) - y(n), 3), fill: 'var(--s1)' }); hover(r, () => `<b>ρ ${fmt(edges[i])}–${fmt(edges[i + 1])}</b>${n} permutations`); s.append(r); } });
      s.append(sv('line', { class: 'ax', x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b, stroke: 'var(--axis)' }));
      s.append(sv('line', { x1: x(mo.canonical_correlation), x2: x(mo.canonical_correlation), y1: m.t, y2: H - m.b, stroke: 'var(--s2)', 'stroke-width': 2 }));
      s.append(sv('text', { class: 'lbl2', x: x(mo.canonical_correlation) - 6, y: m.t + 12, 'text-anchor': 'end' }, 'observed ' + fmt(mo.canonical_correlation)));
      nice(lo, hi, 5).forEach(v => { if (v >= lo && v <= hi) s.append(sv('text', { class: 'lbl', x: x(v), y: H - 10, 'text-anchor': 'middle' }, v.toFixed(2))); });
      figure('#fig-null', 'Permutation null of the canonical correlation', 'Subject rows of the CpG block are shuffled; the observed value is compared with what sparse CCA finds in noise. Exact under the null, no asymptotics.', s, [{ observed: mo.canonical_correlation, 'null 95th pct': mo.null_rho_95, p: mo.p_permutation }], [['null', 'var(--s1)'], ['observed', 'var(--s2)']]);
    } else figure('#fig-null', 'Permutation null', '', null);
    const bl = (mo.block_loadings || []).filter(r => Math.abs(r.weight) > 1e-9).sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
    if (bl.length) {
      const W = 720, rowH = 30, m = { l: 150, r: 40, t: 8, b: 8 }, H = m.t + m.b + rowH * bl.length, mx = Math.max(...bl.map(r => Math.abs(r.weight)));
      const x = lin(-mx, mx, m.l, W - m.r), s = sv('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Loadings of the imaging and clinical variables' });
      s.append(sv('line', { class: 'ax', x1: x(0), x2: x(0), y1: m.t, y2: H - m.b, stroke: 'var(--axis)' }));
      bl.forEach((r, i) => {
        const y = m.t + rowH * i + 4, h = rowH - 8, pos = r.weight >= 0;
        s.append(sv('text', { class: 'lbl2', x: m.l - 10, y: y + h / 2 + 4, 'text-anchor': 'end' }, r.variable));
        const p = sv('rect', { x: pos ? x(0) : x(r.weight), y, width: Math.abs(x(r.weight) - x(0)), height: h, rx: 3, fill: pos ? 'var(--s1)' : 'var(--s2)' });
        hover(p, () => `<b>${r.variable}</b>weight ${sign(r.weight, 3)}`);
        s.append(p);
      });
      figure('#fig-block', 'Imaging + clinical side of the canonical pair', 'Signed weights on the standardised block. Interpretation only meaningful once a real methylation matrix is supplied.', s, bl, [['positive', 'var(--s1)'], ['negative', 'var(--s2)']]);
    } else figure('#fig-block', 'Imaging + clinical loadings', '', null);
  })();

  (D.decision_rules || []).forEach(r => $('#rules').append(el('li', {}, r)));
  (D.limitations || []).forEach(r => $('#limitations').append(el('li', {}, r)));
})();

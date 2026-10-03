import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COV_LABELS = {
  age: 'Age (years)',
  sex_female: 'Sex (Female)',
  bmi: 'Body Mass Index (BMI)',
  pack_years: 'Tobacco Exposure (Pack-Years)',
  fev1_pp_gli: 'FEV1 % predicted (GLI)',
  fev1_fvc_ratio: 'FEV1 / FVC ratio',
  current_smoker: 'Current Smoker status',
  dlco_pp: 'DLCO % predicted',
};

function Forest({ rows, t, nf }) {
  const W = 720,
    rowH = 44,
    m = { l: 200, r: 50, t: 16, b: 34 },
    H = m.t + m.b + rowH * rows.length;
  const lo = 0.3,
    hi = 0.9,
    x = (v) => m.l + ((v - lo) / (hi - lo)) * (W - m.l - m.r);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-100" role="img" aria-label={t.aucTitle}>
      {[0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((v) => (
        <g key={v}>
          <line className="axis" x1={x(v)} x2={x(v)} y1={m.t} y2={H - m.b} />
          <text className="lbl" x={x(v)} y={H - 12} textAnchor="middle">
            {nf(v, 1)}
          </text>
        </g>
      ))}

      {/* Chance reference line at 0.5 */}
      <line x1={x(0.5)} x2={x(0.5)} y1={m.t} y2={H - m.b} stroke="#eb6834" strokeDasharray="4 3" />
      <text className="lbl" x={x(0.5) + 6} y={m.t + 10} fill="#eb6834" fontWeight="600">
        {t.chance} (0.50)
      </text>

      {rows.map((r, i) => {
        const cy = m.t + rowH * i + rowH / 2;
        return (
          <g key={r.model} className="forest-row">
            <text className="lbl2" x={m.l - 12} y={cy + 4} textAnchor="end" fontWeight="500">
              {t.models[r.model] || r.model}
            </text>
            <motion.line
              stroke="#2a78d6"
              strokeWidth="3"
              strokeLinecap="round"
              y1={cy}
              y2={cy}
              initial={{ x1: x(r.auc), x2: x(r.auc) }}
              whileInView={{ x1: x(r.ci_lo), x2: x(r.ci_hi) }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            />
            {/* Confidence Interval endpoints */}
            <line x1={x(r.ci_lo)} x2={x(r.ci_lo)} y1={cy - 6} y2={cy + 6} stroke="#2a78d6" strokeWidth="2" />
            <line x1={x(r.ci_hi)} x2={x(r.ci_hi)} y1={cy - 6} y2={cy + 6} stroke="#2a78d6" strokeWidth="2" />

            <circle cx={x(r.auc)} cy={cy} r="6" fill="#2a78d6">
              <title>{`AUC ${nf(r.auc, 2)} [${nf(r.ci_lo, 2)}, ${nf(r.ci_hi, 2)}] · n=${r.n}, events=${r.events}`}</title>
            </circle>
            <text className="lbl2 fw-bold" x={x(r.ci_hi) + 10} y={cy + 4}>
              {nf(r.auc, 2)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ClinicalFloor({ tierA, t, nf }) {
  const [showUnivariate, setShowUnivariate] = useState(false);
  const [sortBy, setSortBy] = useState('p_exact'); // 'p_exact' | 'cliffs_delta' | 'covariate'
  const [sortAsc, setSortAsc] = useState(true);

  const models = tierA?.models || [];
  const prim = models.find((m) => m.model === 'primary') || models[0];
  const univariate = tierA?.univariate || [];

  const sortedUnivariate = useMemo(() => {
    return [...univariate].sort((a, b) => {
      let va = a[sortBy];
      let vb = b[sortBy];
      if (typeof va === 'string') return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortAsc ? va - vb : vb - va;
    });
  }, [univariate, sortBy, sortAsc]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="chart-panel mt-4">
      {prim && (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h3 className="mb-0">
            {t.aucTitle}: <b>{nf(prim.auc)}</b> [{nf(prim.ci_lo)}, {nf(prim.ci_hi)}], n = {prim.n}, {prim.events} events
          </h3>
        </div>
      )}

      {models.length > 0 && <Forest rows={models} t={t} nf={nf} />}

      <p className="mb-2 panel-note mt-3">
        {prim && prim.ci_lo <= 0.5 ? t.verdictLow : t.verdictOk}
      </p>

      {/* Interactive Univariate Covariates Toggle */}
      {univariate.length > 0 && (
        <div className="univariate-section mt-4 pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
            <div>
              <div className="fw-semibold small">{t.univariateTitle}</div>
              <div className="text-body-secondary small">{t.univariateSub}</div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowUnivariate(!showUnivariate)}
            >
              {showUnivariate ? t.hideUnivariate : t.showUnivariate}
            </button>
          </div>

          <AnimatePresence>
            {showUnivariate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden"
              >
                <div className="table-responsive mt-3">
                  <table className="table table-sm table-hover align-middle mb-1">
                    <thead>
                      <tr className="table-light">
                        <th
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleSort('covariate')}
                        >
                          Covariate {sortBy === 'covariate' ? (sortAsc ? '(asc)' : '(desc)') : ''}
                        </th>
                        <th>Rapid Decliners (n=14)</th>
                        <th>Non-Decliners (n=62)</th>
                        <th
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleSort('cliffs_delta')}
                        >
                          {t.cliffsDelta} {sortBy === 'cliffs_delta' ? (sortAsc ? '(asc)' : '(desc)') : ''}
                        </th>
                        <th
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleSort('p_exact')}
                        >
                          {t.pValue} {sortBy === 'p_exact' ? (sortAsc ? '(asc)' : '(desc)') : ''}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedUnivariate.map((row) => {
                        const delta = row.cliffs_delta;
                        const barWidth = Math.min(100, Math.abs(delta) * 100);
                        return (
                          <tr key={row.covariate}>
                            <td>
                              <strong>{COV_LABELS[row.covariate] || row.covariate}</strong>
                            </td>
                            <td><code>{row.event_median_iqr}</code></td>
                            <td><code>{row.no_event_median_iqr}</code></td>
                            <td style={{ minWidth: 150 }}>
                              <div className="d-flex align-items-center gap-2">
                                <span className="small font-monospace" style={{ minWidth: 46 }}>
                                  {delta > 0 ? `+${nf(delta, 2)}` : nf(delta, 2)}
                                </span>
                                <div className="effect-size-bar-bg flex-grow-1" style={{ height: 8, background: 'rgba(0,0,0,0.08)', borderRadius: 4, position: 'relative' }}>
                                  <div
                                    style={{
                                      position: 'absolute',
                                      left: delta >= 0 ? '50%' : `${50 - barWidth / 2}%`,
                                      width: `${barWidth / 2}%`,
                                      height: '100%',
                                      backgroundColor: delta < 0 ? '#2a78d6' : '#eb6834',
                                      borderRadius: 4,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-secondary-subtle text-secondary-emphasis">
                                {nf(row.p_exact, 3)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="small text-body-secondary mt-1">
                    * Cliff’s delta $d \in [-1, 1]$. No single clinical predictor achieves $p &lt; 0.05$, confirming that spirometry and clinical demographics cannot separate rapid decliners alone.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

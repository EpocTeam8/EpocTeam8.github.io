import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export function BridgeSimulator({ t, nf, onJumpToExplorer }) {
  const [laa, setLaa] = useState(2.4);
  const [pi10, setPi10] = useState(2.2);
  const [dys, setDys] = useState(0.025);
  const [packYears, setPackYears] = useState(24);

  const applyPreset = (preset) => {
    setLaa(preset.laa);
    setPi10(preset.pi10);
    setDys(preset.dys);
    setPackYears(preset.packYears);
  };

  const { estimatedDfev1, riskLevel, riskColor, riskLabel, pctRisk } = useMemo(() => {
    const baseline = -10;
    const laaPenalty = laa * 5.6;
    const pi10Penalty = (pi10 - 1.8) * 22;
    const dysOffset = (dys - 0.025) * 350;
    const packPenalty = packYears * 0.42;

    const projected = Math.round((baseline - laaPenalty - pi10Penalty + dysOffset - packPenalty) * 10) / 10;
    const clampedProjected = Math.max(-180, Math.min(60, projected));

    let level = 'low';
    let color = '#1bb38a';
    let label = t.simLowRisk;

    if (clampedProjected <= -60) {
      level = 'high';
      color = '#eb6834';
      label = t.simHighRisk;
    } else if (clampedProjected <= -30) {
      level = 'moderate';
      color = '#f59e0b';
      label = t.simModRisk;
    }

    const pct = Math.min(100, Math.max(5, ((-clampedProjected) / 120) * 100));

    return {
      estimatedDfev1: clampedProjected,
      riskLevel: level,
      riskColor: color,
      riskLabel: label,
      pctRisk: pct,
    };
  }, [laa, pi10, dys, packYears, t]);

  return (
    <div className="simulator-card mt-4">
      <div className="simulator-header">
        <div>
          <h3>{t.simulatorTitle}</h3>
          <p className="chart-description">{t.simulatorSub}</p>
        </div>
        <div className="preset-buttons">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => applyPreset({ laa: 0.8, pi10: 1.85, dys: 0.032, packYears: 0 })}
          >
            {t.cohortFilter.control}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary active"
            onClick={() => applyPreset({ laa: 2.8, pi10: 2.35, dys: 0.024, packYears: 25 })}
          >
            {t.cohortFilter.preCopd}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => applyPreset({ laa: 6.8, pi10: 2.85, dys: 0.019, packYears: 42 })}
          >
            {t.cohortFilter.copd}
          </button>
        </div>
      </div>

      <div className="row g-4 mt-1">
        {/* Sliders Column */}
        <div className="col-12 col-lg-7">
          <div className="sim-slider-group">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label htmlFor="sim-laa" className="sim-label">
                {t.simLAA}
              </label>
              <span className="sim-val-badge">{nf(laa, 1)}%</span>
            </div>
            <input
              id="sim-laa"
              type="range"
              className="form-range"
              min={0}
              max={12}
              step={0.1}
              value={laa}
              onChange={(e) => setLaa(+e.target.value)}
            />
            <div className="sim-help">{t.simLAAHelp}</div>
          </div>

          <div className="sim-slider-group mt-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label htmlFor="sim-pi10" className="sim-label">
                {t.simPi10}
              </label>
              <span className="sim-val-badge">{nf(pi10, 2)} mm</span>
            </div>
            <input
              id="sim-pi10"
              type="range"
              className="form-range"
              min={1.5}
              max={3.4}
              step={0.05}
              value={pi10}
              onChange={(e) => setPi10(+e.target.value)}
            />
            <div className="sim-help">{t.simPi10Help}</div>
          </div>

          <div className="sim-slider-group mt-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label htmlFor="sim-dys" className="sim-label">
                {t.simDys}
              </label>
              <span className="sim-val-badge">{nf(dys, 3)}</span>
            </div>
            <input
              id="sim-dys"
              type="range"
              className="form-range"
              min={0.015}
              max={0.042}
              step={0.001}
              value={dys}
              onChange={(e) => setDys(+e.target.value)}
            />
            <div className="sim-help">{t.simDysHelp}</div>
          </div>

          <div className="sim-slider-group mt-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label htmlFor="sim-pack" className="sim-label">
                {t.simPack}
              </label>
              <span className="sim-val-badge">{packYears} pk-yr</span>
            </div>
            <input
              id="sim-pack"
              type="range"
              className="form-range"
              min={0}
              max={60}
              step={1}
              value={packYears}
              onChange={(e) => setPackYears(+e.target.value)}
            />
            <div className="sim-help">{t.simPackHelp}</div>
          </div>
        </div>

        {/* Projected Outcome Gauge Column */}
        <div className="col-12 col-lg-5">
          <div className="sim-result-box h-100 d-flex flex-column justify-content-between p-3">
            <div>
              <div className="eyebrow">{t.simTrajectory}</div>
              <div
                className="sim-trajectory-status mt-2"
                style={{ color: riskColor, borderColor: riskColor }}
              >
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="risk-dot"
                    style={{ backgroundColor: riskColor }}
                  />
                  <strong>{riskLabel}</strong>
                </div>
              </div>

              <div className="sim-big-metric mt-3">
                <span className="sim-dfev1-num" style={{ color: riskColor }}>
                  {estimatedDfev1 > 0 ? `+${nf(estimatedDfev1, 1)}` : nf(estimatedDfev1, 1)}
                </span>
                <span className="sim-unit">mL/yr</span>
              </div>
              <div className="sim-threshold-note mt-1">
                Endpoint threshold: <b>−60.0 mL/yr</b>
              </div>

              {/* Visual Risk Gauge Meter */}
              <div className="sim-gauge mt-3">
                <div className="sim-gauge-bar-bg">
                  <motion.div
                    className="sim-gauge-fill"
                    style={{ backgroundColor: riskColor }}
                    initial={false}
                    animate={{ width: `${pctRisk}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  />
                  <div
                    className="sim-gauge-marker"
                    style={{ left: '50%' }}
                    title="Endpoint: -60 mL/yr"
                  />
                </div>
                <div className="d-flex justify-content-between text-body-secondary small mt-1">
                  <span>0 mL/yr</span>
                  <span className="fw-semibold text-danger">−60 mL/yr</span>
                  <span>−120+ mL/yr</span>
                </div>
              </div>
            </div>

            <div className="sim-insight-callout mt-3">
              <p className="small mb-0 text-body-secondary">{t.simInsight}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

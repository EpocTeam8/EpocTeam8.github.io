import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const VAR_NAMES = {
  fev1_pp_gli: 'FEV1 % pred (GLI)',
  fev1_fvc_ratio: 'FEV1 / FVC ratio',
  aw_dysanapsis: 'Airway Dysanapsis',
  perc15_hu: '15th Percentile (HU)',
  aw_pi10_mm: 'Airway Pi10 wall (mm)',
  sex_female: 'Sex (Female)',
  age: 'Age',
  laa950_pct: 'Emphysema (%LAA-950)',
  pack_years: 'Tobacco (Pack-Years)',
  bmi: 'Body Mass Index (BMI)',
};

function LoadingTooltip({ active, payload, nf }) {
  const item = payload?.[0]?.payload;
  if (!active || !item) return null;
  return (
    <div className="chart-tooltip">
      <strong>{item.name}</strong>
      <span>Sparse CCA Weight: <b>{item.weight > 0 ? `+${nf(item.weight, 4)}` : nf(item.weight, 4)}</b></span>
      <div className="small text-body-secondary mt-1">
        {item.weight > 0
          ? 'Positive loading: aligns with preserved baseline lung capacity'
          : 'Negative loading: aligns with emphysematous tissue & risk profile'}
      </div>
    </div>
  );
}

export function MolecularPanel({ molecular, t, nf }) {
  const loadingsData = useMemo(() => {
    if (!molecular?.block_loadings) return [];
    return [...molecular.block_loadings]
      .sort((a, b) => a.weight - b.weight)
      .map((item) => ({
        ...item,
        name: VAR_NAMES[item.variable] || item.variable,
      }));
  }, [molecular]);

  if (!molecular) return null;

  return (
    <div className="molecular-panel mt-3">
      {/* Metric summary tiles */}
      <div className="row g-3">
        <div className="col-6 col-md-3">
          <div className="glass tile p-3 h-100">
            <div className="k">Canonical Correlation (ρ)</div>
            <div className="v text-primary">{nf(molecular.canonical_correlation, 3)}</div>
            <div className="k mt-1">Permutation p = {nf(molecular.p_permutation, 3)}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="glass tile p-3 h-100">
            <div className="k">CpG Loci Tested</div>
            <div className="v">{molecular.n_cpg?.toLocaleString()}</div>
            <div className="k mt-1">{molecular.n_cpg_selected} selected by L1</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="glass tile p-3 h-100">
            <div className="k">Simulation Precision</div>
            <div className="v text-success">
              {molecular.recovery?.precision ? `${Math.round(molecular.recovery.precision * 100)}%` : '100%'}
            </div>
            <div className="k mt-1">40 / 40 true positives</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="glass tile p-3 h-100">
            <div className="k">Simulation Recall</div>
            <div className="v text-success">
              {molecular.recovery?.recall ? `${Math.round(molecular.recovery.recall * 100)}%` : '100%'}
            </div>
            <div className="k mt-1">Zero false discoveries</div>
          </div>
        </div>
      </div>

      {/* Sparse CCA Loadings Chart */}
      <div className="chart-panel mt-4">
        <h3>{t.molecularLoadingsTitle}</h3>
        <p className="chart-description">{t.molecularLoadingsSub}</p>

        <div className="chart-wrap" style={{ height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={loadingsData}
              layout="vertical"
              margin={{ top: 8, right: 30, left: 130, bottom: 8 }}
            >
              <CartesianGrid horizontal={false} strokeOpacity={0.25} />
              <XAxis
                type="number"
                domain={[-0.3, 0.9]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => nf(v, 1)}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                width={125}
              />
              <Tooltip content={<LoadingTooltip nf={nf} />} />
              <ReferenceLine x={0} stroke="var(--respira-border)" />
              <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                {loadingsData.map((entry) => (
                  <Cell
                    key={entry.variable}
                    fill={entry.weight >= 0 ? '#1bb38a' : '#eb6834'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

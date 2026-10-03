import { Fragment, lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { LANGS, T } from './i18n.js';
import { BridgeInsights, SubjectExplorer } from './BridgeInsights.jsx';
import { BridgeSimulator } from './BridgeSimulator.jsx';
import { ClinicalFloor } from './ClinicalFloor.jsx';
import { MolecularPanel } from './MolecularPanel.jsx';
import { DecisionRulesAndLimits } from './ReproduceAndLimits.jsx';
import { AnimatedNumber } from './CountUp.jsx';
import PretrainingPanel from './PretrainingPanel.jsx';

const Bg = lazy(() => import('./Bg.jsx'));
const reduce = typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const rise = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.45 },
};

const TEAM = ['Rahul Kumar', 'Diego Cataño Toro', 'Krish Shewak Warde', 'Pol Molina Espel'];

const store = (k, v) => {
  try {
    return v === undefined ? localStorage.getItem(k) : localStorage.setItem(k, v);
  } catch {
    return null;
  }
};

// Header: tracks active section & scroll progress
function useScrollTracking(sectionKeys) {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(sectionKeys[0] || 'cohort');

  useEffect(() => {
    let busy = false;

    const onScroll = () => {
      if (busy) return;
      busy = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(maxScroll > 0 ? y / maxScroll : 0);

        // Detect active section
        const scrollMiddle = y + 200;
        for (let i = sectionKeys.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionKeys[i]);
          if (el && el.offsetTop <= scrollMiddle) {
            setActiveSection(sectionKeys[i]);
            break;
          }
        }

        busy = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sectionKeys]);

  return { progress, activeSection };
}

function HistTooltip({ active, payload, t, thr }) {
  const bin = payload?.[0]?.payload;
  if (!active || !bin) return null;
  const isDecliner = bin.to <= thr;
  return (
    <div className="chart-tooltip">
      <strong>
        {bin.from} → {bin.to} mL/yr
      </strong>
      <div className="d-flex align-items-center gap-2 mt-1">
        <span
          className="badge"
          style={{
            backgroundColor: isDecliner ? '#eb6834' : '#2a78d6',
            color: '#fff',
            fontSize: '0.72rem',
          }}
        >
          {isDecliner ? t.barDecl : t.barOther}
        </span>
        <b>
          {bin.n} {t.subj}
        </b>
      </div>
    </div>
  );
}

function Tile({ k, v, d, warn = false, isNumeric = false, decimals = 0, lang = 'en' }) {
  return (
    <motion.div className="col-6 col-md-4 col-lg-3" {...rise}>
      <motion.div
        className={`glass tile p-3 h-100 ${warn ? 'warn' : ''}`}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
      >
        <div className="k">{k}</div>
        <div className="v">
          {isNumeric && typeof v === 'number' ? (
            <AnimatedNumber value={v} decimals={decimals} lang={lang} />
          ) : (
            v
          )}
        </div>
        {d && <div className="k mt-1">{d}</div>}
      </motion.div>
    </motion.div>
  );
}

function SectionHeader({ title, subtitle, id }) {
  return (
    <div className="section-heading" id={id}>
      <div className="eyebrow"></div>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export default function App() {
  const [D, setD] = useState(null);
  const [err, setErr] = useState(false);
  const [lang, setLang] = useState(() =>
    LANGS.includes(store('respira-lang'))
      ? store('respira-lang')
      : LANGS.find((l) => navigator.language?.startsWith(l)) || 'en'
  );
  const [dark, setDark] = useState(() =>
    store('respira-theme')
      ? store('respira-theme') === 'dark'
      : typeof window !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [thr, setThr] = useState(-60);
  const [selectedSubjectFromScatter, setSelectedSubjectFromScatter] = useState(null);

  const t = T[lang];
  const sectionKeys = useMemo(() => Object.keys(t.nav), [t.nav]);
  const { progress, activeSection } = useScrollTracking(sectionKeys);

  const nf = (v, d = 2) =>
    v == null
      ? '—'
      : Number(v).toLocaleString(lang, { minimumFractionDigits: d, maximumFractionDigits: d });

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/data.json')
      .then((r) => r.json())
      .then(setD)
      .catch(() => setErr(true));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    store('respira-lang', lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.bsTheme = dark ? 'dark' : 'light';
    store('respira-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const h = D?.tier_a?.dfev1_hist;
  const bins = useMemo(
    () =>
      h &&
      h.counts.map((n, i) => ({
        label: `${h.edges[i]}…${h.edges[i + 1]}`,
        from: h.edges[i],
        to: h.edges[i + 1],
        n,
      })),
    [h]
  );
  const nDecl = bins ? bins.filter((b) => b.to <= thr).reduce((a, b) => a + b.n, 0) : 0;
  const width = h ? h.edges[1] - h.edges[0] : 20;
  const c = D?.cohort;

  return (
    <>
      {!reduce && (
        <Suspense fallback={null}>
          <Bg dark={dark} />
        </Suspense>
      )}

      {/* Sticky Glass Topbar with un-cramped 2-tier layout */}
      <header className="topbar glass">
        <div className="topbar-container">
          {/* Row 1: Brand & Tools */}
          <div className="topbar-main">
            <div className="brand-group">
              <span className="brand">Respira MAPS</span>
            </div>
            <div className="topbar-tools">
              <div className="btn-group btn-group-sm" role="group" aria-label="Language">
                {LANGS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={'btn btn-outline-secondary' + (l === lang ? ' active' : '')}
                    aria-pressed={l === lang}
                    onClick={() => setLang(l)}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                aria-pressed={dark}
                onClick={() => setDark(!dark)}
              >
                {t.theme}
              </button>
            </div>
          </div>

          {/* Row 2: Section Navigation spanning full width */}
          <div className="topbar-nav-row">
            <nav className="section-nav" aria-label="Sections">
              {Object.entries(t.nav).map(([key, label]) => (
                <a
                  key={key}
                  href={`#${key}`}
                  className={activeSection === key ? 'is-active' : ''}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="scroll-progress-container">
          <motion.div
            className="scroll-progress-bar"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </header>

      <main className="container pb-5">
        <section className="hero glass">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1>{t.h1}</h1>
          <p className="lede">{t.lede}</p>
        </section>

        {err && <div className="alert alert-danger mt-4">{t.failed}</div>}
        {!D && !err && (
          <div className="glass section-loading mt-4">
            <p>{t.loading}</p>
          </div>
        )}

        {D && (
          <>
            <section className="claim-grid" aria-label="Project claims">
              {t.claims.map((claim, index) => (
                <motion.div
                  key={claim}
                  className="glass claim"
                  {...rise}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, delay: index * 0.08 },
                  }}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <b>{index + 1}.</b> {claim}
                </motion.div>
              ))}
            </section>

            {/* 1. COHORT SECTION */}
            <motion.section id="cohort" className="glass content-panel" {...rise}>
              <SectionHeader title={t.cohort} subtitle={t.cohortSub} />
              <div className="row g-3 mt-2">
                <Tile k={t.nSubjects} v={c.n_subjects} isNumeric lang={lang} />
                <Tile
                  k={t.nV2}
                  v={c.n_with_v2}
                  isNumeric
                  lang={lang}
                  d={`${nf(c.follow_up_years.min, 1)}–${nf(c.follow_up_years.max, 1)} yr`}
                />
                <Tile
                  k={t.decliners}
                  v={
                    <>
                      <AnimatedNumber value={nDecl} lang={lang} />{' '}
                      <small className="fs-6 text-body-secondary">
                        {t.ofN} {c.n_with_v2}
                      </small>
                    </>
                  }
                  d={`dFEV1 ≤ ${thr} mL/yr`}
                  warn
                />
                <Tile k={t.copd} v={c.copd_v1} isNumeric lang={lang} d="FEV1/FVC < 0.70" />
                <Tile k={t.pre} v={c.pre_copd} isNumeric lang={lang} />
                <Tile k={t.ctrl} v={c.control} isNumeric lang={lang} />
              </div>

              {h && (
                <div className="chart-panel mt-4">
                  <h3>{t.histTitle}</h3>
                  <div className="text-body-secondary small mb-2">{t.histSub}</div>
                  <label htmlFor="thr" className="form-label small mb-0">
                    {t.thrLabel}: <b>{thr}</b>
                  </label>
                  <input
                    id="thr"
                    type="range"
                    className="form-range"
                    min={-200}
                    max={0}
                    step={width}
                    value={thr}
                    onChange={(e) => setThr(+e.target.value)}
                  />
                  <div className="small text-body-secondary mb-2">
                    {t.thrHelp.replace('{w}', width)}
                  </div>
                  <div style={{ height: 270 }}>
                    <ResponsiveContainer>
                      <BarChart data={bins} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeOpacity={0.25} />
                        <XAxis dataKey="from" tick={{ fontSize: 11 }} interval={1} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip content={<HistTooltip t={t} thr={thr} />} />
                        <Bar dataKey="n" radius={[4, 4, 0, 0]} isAnimationActive={!reduce}>
                          {bins.map((b) => (
                            <Cell
                              key={b.from}
                              fill={b.to <= thr ? '#eb6834' : '#2a78d6'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </motion.section>

            {/* 2. CLINICAL FLOOR SECTION */}
            <motion.section id="floor" className="glass content-panel" {...rise}>
              <SectionHeader title={t.floor} subtitle={t.floorLead} />
              <ClinicalFloor tierA={D.tier_a} t={t} nf={nf} />
            </motion.section>

            {/* 3. IMAGING SPECIFICATIONS SECTION */}
            <motion.section id="imaging" className="glass content-panel" {...rise}>
              <SectionHeader title={t.imagingTitle} subtitle={t.imagingSub} />
              <div className="row g-3 mt-2">
                <Tile k="Kernel" v="soft / sharp" d="scanner heterogeneity" />
                <Tile k="Slice thickness" v="1.0–2.0 mm" d="acquisition variation" />
                <Tile k="Public build" v="CT-only" d="released data manifest" />
              </div>
            </motion.section>

            {/* 3b. SELF-SUPERVISED PRETRAINING CHECK (3D JEPA dress rehearsal) */}
            <PretrainingPanel lang={lang} />

            {/* 4. BRIDGE SECTION */}
            <motion.section id="bridge" className="glass content-panel" {...rise}>
              <SectionHeader title={t.bridgeTitle} subtitle={t.bridgeSub} />
              <div className="bridge-highlight mt-3">
                <span className="tag">Score logic</span>
                <p>
                  The continuous score is designed to order subjects within the pre-COPD group, where
                  the binary read gives everyone the same label. That is the clinically meaningful test
                  of a bridge model.
                </p>
              </div>
              <BridgeInsights
                bridge={D.bridge}
                t={t}
                nf={nf}
                onSelectSubject={(id) => {
                  setSelectedSubjectFromScatter(id);
                  const el = document.getElementById('subjects');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </motion.section>

            {/* 5. INTERACTIVE "WHAT-IF" SIMULATOR SECTION */}
            <motion.section id="simulator" className="glass content-panel" {...rise}>
              <SectionHeader title={t.simulatorTitle} subtitle={t.simulatorSub} />
              <BridgeSimulator
                t={t}
                nf={nf}
                onJumpToExplorer={() => {
                  const el = document.getElementById('subjects');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </motion.section>

            {/* 6. SUBJECTS EXPLORER (Single, Time-Lapse, Side-by-Side) */}
            <motion.section id="subjects" className="glass content-panel" {...rise}>
              <SectionHeader title={t.subjectTitle} subtitle={t.subjectSub} />
              <SubjectExplorer
                data={D}
                t={t}
                nf={nf}
                externalSelectedId={selectedSubjectFromScatter}
                onClearExternal={() => setSelectedSubjectFromScatter(null)}
              />
            </motion.section>

            {/* 7. MOLECULAR & CROSS-OMICS SECTION */}
            <motion.section id="molecular" className="glass content-panel" {...rise}>
              <SectionHeader title={t.molecularTitle} subtitle={t.molecularSub} />
              <MolecularPanel molecular={D.molecular} t={t} nf={nf} />
            </motion.section>

            {/* 8. DECISION RULES & LIMITATIONS */}
            <motion.section id="limits" className="glass content-panel" {...rise}>
              <SectionHeader title={t.limitsTitle} subtitle={t.limitsSub} />
              <DecisionRulesAndLimits t={t} />
            </motion.section>
          </>
        )}
      </main>

      <footer className="site-footer">
        © {new Date().getFullYear()}
        {TEAM.map((name) => (
          <Fragment key={name}>
            {' · '}
            <span style={{ whiteSpace: 'nowrap' }}>{name}</span>
          </Fragment>
        ))}
      </footer>
    </>
  );
}
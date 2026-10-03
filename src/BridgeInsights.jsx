import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const GROUPS = ['control', 'pre-COPD', 'COPD'];
const GROUP_COLORS = {
  control: '#2a78d6',
  'pre-COPD': '#eb6834',
  COPD: '#1bb38a',
};

export const SUBJECT_DISPLAY_MAP = {
  S7d0651e5c1: 'Index 1',
  S91a68122fe: 'Index 2',
  Se31feffa69: 'Index 3',
  Se462ddcc2e: 'Index 4',
  Sfd1610ea47: 'Index 5',
  S07ec2277c2: 'Index 6',
  S408804cb65: 'Index 7',
  S65f2b16659: 'Index 8',
  Sf366741a50: 'Index 9',
  S48da29b7fb: 'Index 10',
  S71d99defd7: 'Index 11',
  S763d941ade: 'Index 12',
  S7eb57fe4cb: 'Index 13',
  Sbe6ab81b33: 'Index 14',
};

export const getSubjectDisplayName = (id) => SUBJECT_DISPLAY_MAP[id] || id;

const imageAssets = import.meta.glob('../figures/*.png', {
  eager: true,
  import: 'default',
  query: '?url',
});

function ScoreTooltip({ active, payload, label, nf }) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  const name = getSubjectDisplayName(point.id);
  return (
    <div className="chart-tooltip">
      <div className="d-flex align-items-center justify-content-between gap-2">
        <strong>[{point.group}] {name}</strong>
        <span
          className="badge"
          style={{
            backgroundColor: GROUP_COLORS[point.group] || '#666',
            color: '#fff',
            fontSize: '0.72rem',
          }}
        >
          {point.group}
        </span>
      </div>
      <span>{label}: <b>{nf(point.value, 3)}</b></span>
      <span>dFEV1: <b style={{ color: point.dfev1 <= -60 ? '#eb6834' : 'inherit' }}>{nf(point.dfev1, 1)} mL/yr</b></span>
      <div className="small text-body-secondary mt-1">Click point to inspect subject in explorer</div>
    </div>
  );
}

function LongitudinalTooltip({ active, payload, nf, contrastLabel }) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  const name = getSubjectDisplayName(point.subject);
  return (
    <div className="chart-tooltip">
      <strong>[{point.group}] {name}</strong>
      <span>%LAA-950: <b>{nf(point.value, 3)}%</b></span>
      <span>+{nf(point.year, 1)} yr{point.contrast ? ` · ${contrastLabel}` : ''}</span>
    </div>
  );
}

export function BridgeInsights({ bridge, t, nf, onSelectSubject }) {
  const scores = bridge?.scores || [];
  const [score, setScore] = useState(bridge?.primary_score || scores[0] || '');
  const [groupFilter, setGroupFilter] = useState('all');
  const label = bridge?.within?.[score]?.label || score;

  const points = useMemo(() => {
    return (bridge?.subjects || [])
      .filter((subject) => Number.isFinite(subject.scores?.[score]) && Number.isFinite(subject.dfev1))
      .map((subject) => ({
        ...subject,
        value: subject.scores[score],
      }));
  }, [bridge, score]);

  const longitudinal = bridge?.longitudinal;

  const filteredLongitudinalRows = useMemo(() => {
    if (!longitudinal?.rows) return [];
    if (groupFilter === 'all') return longitudinal.rows;
    return longitudinal.rows.filter((r) => r.group.toLowerCase() === groupFilter.toLowerCase());
  }, [longitudinal, groupFilter]);

  return (
    <>
      <div className="chart-panel mt-4">
        {/* Top Header Row: Title on Left, Score Dropdown Strictly Aligned to the Far Right */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h3 className="mb-0">{t.bridgeChartTitle}</h3>
          <div className="d-flex align-items-center gap-2 ms-auto">
            <span className="small text-body-secondary text-nowrap fw-semibold">{t.scoreLabel}:</span>
            <select
              className="form-select form-select-sm"
              value={score}
              onChange={(event) => setScore(event.target.value)}
              style={{ minWidth: '220px', width: 'auto' }}
            >
              {scores.map((name) => (
                <option key={name} value={name}>
                  {bridge.within?.[name]?.label || name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="chart-description mt-1 mb-3">{t.bridgeChartSub}</p>

        {/* Filter Controls Bar - Clean, spacious and full-width */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2 pt-2 border-top border-light-subtle">
          <div className="d-flex align-items-center gap-2">
            <span className="small text-body-secondary">Cohort:</span>
            <div className="btn-group btn-group-sm" role="group" aria-label="Filter cohort">
              <button
                type="button"
                className={`btn btn-outline-secondary ${groupFilter === 'all' ? 'active' : ''}`}
                onClick={() => setGroupFilter('all')}
              >
                {t.cohortFilter.all}
              </button>
              {GROUPS.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`btn btn-outline-secondary ${groupFilter === g ? 'active' : ''}`}
                  onClick={() => setGroupFilter(g)}
                  style={
                    groupFilter === g
                      ? { backgroundColor: GROUP_COLORS[g], borderColor: GROUP_COLORS[g], color: '#fff' }
                      : {}
                  }
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="small text-body-secondary">
            {points.length} {t.subj} plotted
          </div>
        </div>

        {points.length ? (
          <div className="chart-wrap" style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 24, bottom: 10, left: 12 }}>
                <CartesianGrid vertical={false} strokeOpacity={0.25} />
                <XAxis
                  type="number"
                  dataKey="value"
                  name={label}
                  height={50}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => nf(value, 2)}
                  domain={['auto', 'auto']}
                  label={{ value: label, position: 'insideBottom', offset: 4, fontSize: 12 }}
                />
                <YAxis
                  type="number"
                  dataKey="dfev1"
                  name="dFEV1"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => nf(value, 0)}
                  label={{ value: 'dFEV1 (mL/yr)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                />
                <Tooltip content={<ScoreTooltip label={label} nf={nf} />} />
                <ReferenceLine
                  y={-60}
                  stroke="#eb6834"
                  strokeDasharray="5 4"
                  label={{
                    value: 'Endpoint −60 mL/yr',
                    position: 'insideTopRight',
                    fill: '#eb6834',
                    fontSize: 11,
                  }}
                />
                {GROUPS.map((group) => {
                  const isVisible = groupFilter === 'all' || groupFilter === group;
                  return (
                    <Scatter
                      key={group}
                      name={group}
                      data={points.filter((point) => point.group === group)}
                      fill={GROUP_COLORS[group]}
                      opacity={isVisible ? 1 : 0.15}
                      cursor="pointer"
                      onClick={(point) => {
                        if (onSelectSubject && point?.id) {
                          onSelectSubject(point.id);
                        }
                      }}
                      isAnimationActive={false}
                    />
                  );
                })}
                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 10 }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-body-secondary mb-0">{t.bridgeNoPoints}</p>
        )}
      </div>

      <div className="chart-panel mt-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h3>{t.longitudinalTitle}</h3>
            <p className="chart-description">{t.longitudinalSub}</p>
          </div>
        </div>

        {filteredLongitudinalRows.length ? (
          <div className="chart-wrap" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 24, bottom: 10, left: 12 }}>
                <CartesianGrid vertical={false} strokeOpacity={0.25} />
                <XAxis
                  type="number"
                  dataKey="year"
                  name={t.yearLabel}
                  height={50}
                  tick={{ fontSize: 11 }}
                  domain={[0, 'auto']}
                  label={{ value: t.yearLabel, position: 'insideBottom', offset: 4, fontSize: 12 }}
                />
                <YAxis
                  type="number"
                  dataKey="value"
                  name="%LAA-950"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => nf(value, 2)}
                  label={{ value: '%LAA-950', angle: -90, position: 'insideLeft', fontSize: 12 }}
                />
                <Tooltip content={<LongitudinalTooltip nf={nf} contrastLabel={t.contrastLabel} />} />
                {filteredLongitudinalRows.map((row) => (
                  <Scatter
                    key={row.subject}
                    name={`${row.subject} · ${row.group}`}
                    data={row.points.map(([year, value, contrast]) => ({
                      year,
                      value,
                      contrast,
                      subject: row.subject,
                      group: row.group,
                    }))}
                    fill={GROUP_COLORS[row.group] || GROUP_COLORS.control}
                    line={{ stroke: GROUP_COLORS[row.group] || GROUP_COLORS.control, strokeWidth: 2 }}
                    lineType="joint"
                    isAnimationActive={false}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-body-secondary mb-0">{t.longitudinalUnavailable}</p>
        )}
      </div>
    </>
  );
}

// Interactive Lung CT Card with True Zoom-In and Full-Screen Lightbox
function LungImageCard({ figure, subject, t, nf, displayName }) {
  const [failed, setFailed] = useState(false);
  const [zoomPos, setZoomPos] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const imgRef = useRef(null);

  const imageSrc = figure ? imageAssets[`../${figure.file}`] : null;
  const name = displayName || getSubjectDisplayName(figure?.id);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleMouseLeave = () => {
    setZoomPos(null);
  };

  return (
    <>
      <div className="subject-image-card position-relative">
        {imageSrc && !failed ? (
          <div
            className="img-zoom-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setShowLightbox(true)}
            title="Click to view full screen"
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt={`${t.subjectImageLabel} ${name}`}
              loading="lazy"
              onError={() => setFailed(true)}
              className="img-zoom-target"
              style={{
                transform: zoomPos ? 'scale(2.2)' : 'scale(1)',
                transformOrigin: zoomPos ? `${zoomPos.x}% ${zoomPos.y}%` : 'center center',
              }}
            />

            <div className="img-zoom-badge">
              {zoomPos ? 'Zoom: 2.2x' : 'Hover to zoom in (2.2x) · Click for full screen'}
            </div>
          </div>
        ) : (
          <p className="text-body-secondary mb-0 p-4">{t.imageUnavailable}</p>
        )}

        <div className="subject-meta">
          <div>
            <span>{t.imageGroupLabel}</span>
            <strong style={{ color: GROUP_COLORS[figure.group] || 'inherit' }}>
              {figure.group}
            </strong>
          </div>
          <div>
            <span>{t.yearLabel}</span>
            <strong>
              {figure.years_from_first_ct != null
                ? figure.years_from_first_ct === 0
                  ? 'Baseline (t0)'
                  : `+${nf(figure.years_from_first_ct, 2)} ${t.yearLabelShort}`
                : 'Baseline'}
            </strong>
          </div>
          <div>
            <span>{t.imageKernelLabel}</span>
            <strong>{figure.kernel || '—'}</strong>
          </div>
          <div>
            <span>{t.imageSliceLabel}</span>
            <strong>{figure.slice_thickness ? `${nf(figure.slice_thickness, 2)} mm` : '—'}</strong>
          </div>
          <div>
            <span>{t.imageDeclineLabel}</span>
            <strong style={{ color: subject?.dfev1 <= -60 ? '#eb6834' : 'inherit' }}>
              {subject?.dfev1 == null ? '—' : `${nf(subject.dfev1, 1)} mL/yr`}
            </strong>
          </div>
          <div>
            <span>{t.imageReadLabel}</span>
            <strong>{subject?.emphysema_read == null ? '—' : subject.emphysema_read ? 'Emphysema' : 'None'}</strong>
          </div>
        </div>
      </div>

      {/* Full-Screen Lightbox Modal for High-Resolution Detail */}
      {showLightbox && imageSrc && (
        <div className="lightbox-backdrop" onClick={() => setShowLightbox(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setShowLightbox(false)}
            >
              Close [x]
            </button>
            <img
              src={imageSrc}
              alt={`${t.subjectImageLabel} ${name}`}
              className="lightbox-img"
            />
            <div className="text-white small mt-2">
              <strong>{name}</strong> · {figure.group} · {figure.kernel || 'Standard'} · {figure.slice_thickness} mm
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function SubjectExplorer({ data, t, nf, externalSelectedId, onClearExternal }) {
  const allFigures = data.figures || [];

  // Group figures by unique subject ID
  const subjectsMap = useMemo(() => {
    const map = {};
    allFigures.forEach((fig) => {
      if (!map[fig.id]) map[fig.id] = [];
      map[fig.id].push(fig);
    });
    // Sort scans chronologically within each subject
    Object.values(map).forEach((list) => {
      list.sort((a, b) => (a.years_from_first_ct || 0) - (b.years_from_first_ct || 0));
    });
    return map;
  }, [allFigures]);

  const uniqueSubjectIds = useMemo(() => {
    return Object.keys(subjectsMap).sort((a, b) => {
      const gA = subjectsMap[a][0]?.group || '';
      const gB = subjectsMap[b][0]?.group || '';
      return GROUPS.indexOf(gA) - GROUPS.indexOf(gB) || a.localeCompare(b);
    });
  }, [subjectsMap]);

  const subjectDisplayNames = useMemo(() => {
    const map = {};
    uniqueSubjectIds.forEach((id, idx) => {
      map[id] = SUBJECT_DISPLAY_MAP[id] || `Index ${idx + 1}`;
    });
    return map;
  }, [uniqueSubjectIds]);

  // Repeat scan subjects
  const multiScanSubjects = useMemo(() => {
    return uniqueSubjectIds.filter((id) => (subjectsMap[id]?.length || 0) > 1);
  }, [uniqueSubjectIds, subjectsMap]);

  const [viewMode, setViewMode] = useState('single'); // 'single' | 'timeLapse' | 'compare'
  const [selectedId, setSelectedId] = useState(uniqueSubjectIds[0] || '');

  // Compare mode selections
  const [compareIdA, setCompareIdA] = useState(
    uniqueSubjectIds.find((id) => subjectsMap[id]?.[0]?.group === 'control') || uniqueSubjectIds[0] || ''
  );
  const [compareIdB, setCompareIdB] = useState(
    uniqueSubjectIds.find((id) => subjectsMap[id]?.[0]?.group === 'pre-COPD') ||
      uniqueSubjectIds.find((id) => subjectsMap[id]?.[0]?.group === 'COPD') ||
      uniqueSubjectIds[1] || ''
  );

  // Time-lapse state
  const [timeLapseSubjectId, setTimeLapseSubjectId] = useState(multiScanSubjects[0] || uniqueSubjectIds[0] || '');
  const [timeLapseIndex, setTimeLapseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync external selection if clicked from scatter plot
  useEffect(() => {
    if (externalSelectedId && uniqueSubjectIds.includes(externalSelectedId)) {
      setSelectedId(externalSelectedId);
      if (subjectsMap[externalSelectedId]?.length > 1) {
        setTimeLapseSubjectId(externalSelectedId);
        setTimeLapseIndex(0);
      }
      if (onClearExternal) onClearExternal();
    }
  }, [externalSelectedId, uniqueSubjectIds, subjectsMap, onClearExternal]);

  // Auto-play loop for time-lapse
  useEffect(() => {
    if (!isPlaying) return;
    const scans = subjectsMap[timeLapseSubjectId] || [];
    if (scans.length <= 1) {
      setIsPlaying(false);
      return;
    }
    const interval = setInterval(() => {
      setTimeLapseIndex((prev) => (prev + 1) % scans.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying, timeLapseSubjectId, subjectsMap]);

  const currentFiguresList = subjectsMap[selectedId] || [];
  const primaryFigure = currentFiguresList.find((f) => f.is_primary) || currentFiguresList[0];
  const subjectMetadata = data.bridge?.subjects?.find((s) => s.id === selectedId);

  return (
    <div className="subject-explorer mt-3">
      {/* View Mode Tabs */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div className="btn-group btn-group-sm" role="group" aria-label="Subject explorer modes">
          <button
            type="button"
            className={`btn btn-outline-secondary ${viewMode === 'single' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('single');
              setIsPlaying(false);
            }}
          >
            {t.viewModes.single}
          </button>
          <button
            type="button"
            className={`btn btn-outline-secondary ${viewMode === 'timeLapse' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('timeLapse');
            }}
          >
            {t.viewModes.timeLapse}
          </button>
          <button
            type="button"
            className={`btn btn-outline-secondary ${viewMode === 'compare' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('compare');
              setIsPlaying(false);
            }}
          >
            {t.viewModes.compare}
          </button>
        </div>

        {viewMode === 'timeLapse' && (
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className={`btn btn-sm ${isPlaying ? 'btn-warning' : 'btn-outline-primary'}`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? t.pause : t.play}
            </button>
          </div>
        )}
      </div>

      {/* MODE 1: SINGLE SUBJECT VIEW */}
      {viewMode === 'single' && (
        <>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
            <label className="subject-select-label mb-0" htmlFor="subject-select">
              <span className="fw-semibold">{t.subjectSelectLabel}:</span>
              <select
                id="subject-select"
                className="form-select form-select-sm"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {uniqueSubjectIds.map((id) => {
                  const grp = subjectsMap[id]?.[0]?.group || '';
                  const numStudies = subjectsMap[id]?.length || 1;
                  const name = subjectDisplayNames[id] || getSubjectDisplayName(id);
                  return (
                    <option key={id} value={id}>
                      [{grp}] {name} {numStudies > 1 ? `(${numStudies} scans)` : ''}
                    </option>
                  );
                })}
              </select>
            </label>

            {currentFiguresList.length > 1 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setTimeLapseSubjectId(selectedId);
                  setTimeLapseIndex(0);
                  setViewMode('timeLapse');
                }}
              >
                View {currentFiguresList.length} scans in Time-Lapse
              </button>
            )}
          </div>

          {primaryFigure && (
            <LungImageCard
              figure={primaryFigure}
              subject={subjectMetadata}
              t={t}
              nf={nf}
              displayName={subjectDisplayNames[primaryFigure.id] || getSubjectDisplayName(primaryFigure.id)}
            />
          )}
        </>
      )}

      {/* MODE 2: LONGITUDINAL TIME-LAPSE */}
      {viewMode === 'timeLapse' && (
        <div className="time-lapse-panel">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <label className="subject-select-label mb-0" htmlFor="time-lapse-select">
              <span className="fw-semibold">{t.timeLapseTitle}:</span>
              <select
                id="time-lapse-select"
                className="form-select form-select-sm"
                value={timeLapseSubjectId}
                onChange={(e) => {
                  setTimeLapseSubjectId(e.target.value);
                  setTimeLapseIndex(0);
                  setIsPlaying(false);
                }}
              >
                {multiScanSubjects.map((id) => {
                  const grp = subjectsMap[id]?.[0]?.group || '';
                  const count = subjectsMap[id]?.length;
                  const name = subjectDisplayNames[id] || getSubjectDisplayName(id);
                  return (
                    <option key={id} value={id}>
                      [{grp}] {name} · {count} repeat CT studies
                    </option>
                  );
                })}
              </select>
            </label>

            <span className="badge bg-secondary-subtle text-secondary-emphasis p-2">
              Scan {timeLapseIndex + 1} of {(subjectsMap[timeLapseSubjectId] || []).length}
            </span>
          </div>

          {/* Timeline Step Scrubber */}
          {subjectsMap[timeLapseSubjectId]?.length > 1 && (
            <div className="timeline-stepper mb-3 p-2 glass">
              <div className="d-flex justify-content-between gap-1">
                {subjectsMap[timeLapseSubjectId].map((scan, idx) => {
                  const isActive = idx === timeLapseIndex;
                  return (
                    <button
                      key={scan.file}
                      type="button"
                      className={`timeline-step-btn btn btn-sm flex-fill ${
                        isActive ? 'btn-primary active' : 'btn-outline-secondary'
                      }`}
                      onClick={() => {
                        setTimeLapseIndex(idx);
                        setIsPlaying(false);
                      }}
                    >
                      <div className="small fw-bold">
                        {scan.years_from_first_ct === 0 ? 't0' : `+${nf(scan.years_from_first_ct, 1)}y`}
                      </div>
                      <div className="extra-small text-truncate" style={{ fontSize: '0.68rem' }}>
                        {scan.contrast ? 'CT + Contrast' : 'CT'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {subjectsMap[timeLapseSubjectId]?.[timeLapseIndex] && (
            <AnimatePresence mode="wait">
              <motion.div
                key={subjectsMap[timeLapseSubjectId][timeLapseIndex].file}
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.2 }}
                transition={{ duration: 0.3 }}
              >
                <LungImageCard
                  figure={subjectsMap[timeLapseSubjectId][timeLapseIndex]}
                  subject={data.bridge?.subjects?.find((s) => s.id === timeLapseSubjectId)}
                  t={t}
                  nf={nf}
                  displayName={subjectDisplayNames[timeLapseSubjectId] || getSubjectDisplayName(timeLapseSubjectId)}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}

      {/* MODE 3: SIDE-BY-SIDE COMPARE */}
      {viewMode === 'compare' && (
        <div className="compare-panel">
          <p className="chart-description mb-3">{t.compareSub}</p>
          <div className="row g-3">
            {/* Subject A */}
            <div className="col-12 col-md-6">
              <div className="compare-column p-2 glass rounded-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-primary">{t.subjectA}</span>
                  <select
                    className="form-select form-select-sm w-auto"
                    value={compareIdA}
                    onChange={(e) => setCompareIdA(e.target.value)}
                  >
                    {uniqueSubjectIds.map((id) => (
                      <option key={id} value={id}>
                        [{subjectsMap[id]?.[0]?.group}] {subjectDisplayNames[id] || getSubjectDisplayName(id)}
                      </option>
                    ))}
                  </select>
                </div>
                {subjectsMap[compareIdA]?.[0] && (
                  <LungImageCard
                    figure={subjectsMap[compareIdA][0]}
                    subject={data.bridge?.subjects?.find((s) => s.id === compareIdA)}
                    t={t}
                    nf={nf}
                    displayName={subjectDisplayNames[compareIdA] || getSubjectDisplayName(compareIdA)}
                  />
                )}
              </div>
            </div>

            {/* Subject B */}
            <div className="col-12 col-md-6">
              <div className="compare-column p-2 glass rounded-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-warning text-dark">{t.subjectB}</span>
                  <select
                    className="form-select form-select-sm w-auto"
                    value={compareIdB}
                    onChange={(e) => setCompareIdB(e.target.value)}
                  >
                    {uniqueSubjectIds.map((id) => (
                      <option key={id} value={id}>
                        [{subjectsMap[id]?.[0]?.group}] {subjectDisplayNames[id] || getSubjectDisplayName(id)}
                      </option>
                    ))}
                  </select>
                </div>
                {subjectsMap[compareIdB]?.[0] && (
                  <LungImageCard
                    figure={subjectsMap[compareIdB][0]}
                    subject={data.bridge?.subjects?.find((s) => s.id === compareIdB)}
                    t={t}
                    nf={nf}
                    displayName={subjectDisplayNames[compareIdB] || getSubjectDisplayName(compareIdB)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
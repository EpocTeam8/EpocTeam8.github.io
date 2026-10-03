import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function DecisionRulesAndLimits({ t }) {
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'limits'

  return (
    <div className="rules-limits-card mt-3">
      <div className="btn-group btn-group-sm mb-3" role="group" aria-label="Rules and limits tabs">
        <button
          type="button"
          className={`btn btn-outline-secondary ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          Decision Rules ({t.ruleList.length})
        </button>
        <button
          type="button"
          className={`btn btn-outline-secondary ${activeTab === 'limits' ? 'active' : ''}`}
          onClick={() => setActiveTab('limits')}
        >
          Clinical Limitations ({t.limitationList.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'rules' ? (
          <motion.div
            key="rules"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="row g-3"
          >
            {t.ruleList.map((rule, idx) => (
              <div key={rule} className="col-12 col-md-4">
                <div className="glass p-3 h-100 border-start border-4 border-primary">
                  <div className="fw-bold text-primary mb-1">Rule {idx + 1}</div>
                  <div className="text-body-secondary small">{rule}</div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="limits"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="row g-3"
          >
            {t.limitationList.map((limit, idx) => (
              <div key={limit} className="col-12 col-md-4">
                <div className="glass p-3 h-100 border-start border-4 border-warning">
                  <div className="fw-bold text-warning mb-1">Limitation {idx + 1}</div>
                  <div className="text-body-secondary small">{limit}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ReproducibilityTerminal({ t }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!t.codeBlock) return;
    navigator.clipboard.writeText(t.codeBlock).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <div className="reproduce-terminal glass mt-3 overflow-hidden" style={{ border: '1px solid rgba(148, 163, 184, 0.25)' }}>
      <div className="terminal-header d-flex justify-content-between align-items-center p-2 px-3 text-white" style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b' }}>
        <div className="d-flex align-items-center gap-2">
          <span className="terminal-dot" style={{ backgroundColor: '#ef4444' }} />
          <span className="terminal-dot" style={{ backgroundColor: '#f59e0b' }} />
          <span className="terminal-dot" style={{ backgroundColor: '#10b981' }} />
          <span className="small font-monospace ms-2" style={{ color: '#94a3b8', fontSize: '0.78rem' }}>cluster@respira-maps: ~/pipeline</span>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline-light py-0 px-2"
          style={{ fontSize: '0.75rem', borderColor: '#334155', color: '#e2e8f0' }}
          onClick={handleCopy}
        >
          {copied ? t.copied : t.copyPipeline}
        </button>
      </div>
      <div className="terminal-body p-3 font-monospace small" style={{ backgroundColor: '#09131f' }}>
        <pre className="mb-0" style={{ color: '#34d399', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.84rem' }}>
          {t.codeBlock}
        </pre>
      </div>
      <div className="p-2 px-3 small border-top" style={{ backgroundColor: '#0f172a', color: '#94a3b8', borderColor: '#1e293b' }}>
        {t.publicNote}
      </div>
    </div>
  );
}

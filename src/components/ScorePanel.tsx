import type { ScoreResult } from '../types';
import type { ScoringWeights } from '../config/scoringWeights';
import { WEIGHT_LABELS } from '../config/scoringWeights';

const RING_COLOR: Record<string, string> = {
  good: 'var(--good)',
  warn: 'var(--warn)',
  bad: 'var(--bad)',
};

interface Props {
  score: ScoreResult;
  weights: ScoringWeights;
  effectiveWeights: ScoringWeights;
  onWeightsChange: (w: ScoringWeights) => void;
  onResetWeights: () => void;
}

export default function ScorePanel({ score, weights, effectiveWeights, onWeightsChange, onResetWeights }: Props) {
  const setW = (k: keyof ScoringWeights, v: number) => onWeightsChange({ ...weights, [k]: v });

  return (
    <div className="panel">
      <h2>命局层次</h2>

      <div className="score-hero">
        <div className="score-ring" style={{ borderColor: RING_COLOR[score.levelClass] }}>
          <div className="num">{score.total}</div>
          <div className="label">/ 100</div>
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: RING_COLOR[score.levelClass] }}>
            {score.level}
          </div>
          <div className="muted small" style={{ margin: '4px 0' }}>{score.levelDesc}</div>
          <div className="small">
            日主：<b>{score.strongWeak}</b>
            <span className="muted"> · {score.strongWeakDesc}</span>
          </div>
        </div>
      </div>

      {score.patterns.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {score.patterns.map((p) => <span key={p} className="tag warn">{p}</span>)}
        </div>
      )}

      <h3 style={{ marginTop: 18 }}>评分明细（可展开查看每项依据）</h3>
      {score.dimensions.map((d) => (
        <div className="dim-row" key={d.key}>
          <div className="dim-head">
            <div className="dim-name">{d.name} <span className="muted small">({d.summary})</span></div>
            <div className="dim-meta">
              {d.raw} 分 × 权重 {effectiveWeights[d.key as keyof ScoringWeights]}% = <b>{d.weighted.toFixed(1)}</b>
            </div>
          </div>
          <details className="small" style={{ marginTop: 4 }}>
            <summary className="muted" style={{ cursor: 'pointer' }}>查看依据</summary>
            <ul className="reason-list">
              {d.reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </details>
        </div>
      ))}

      {score.shensha.length > 0 && (
        <>
          <h3 style={{ marginTop: 18 }}>神煞</h3>
          <div>
            {score.shensha.map((s, i) => (
              <span key={i} className={`tag ${s.type === 'good' ? 'good' : s.type === 'bad' ? 'bad' : ''}`}>
                {s.name}
              </span>
            ))}
          </div>
          <div className="muted small" style={{ marginTop: 6 }}>
            {score.shensha.map((s, i) => <div key={i}>{s.name}：{s.where}</div>)}
          </div>
        </>
      )}

      <details style={{ marginTop: 16 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--muted)' }}>调整评分权重</summary>
        <div className="weights-grid" style={{ marginTop: 10 }}>
          {(Object.keys(weights) as (keyof ScoringWeights)[]).map((k) => (
            <label className="field" key={k}>
              <span>{WEIGHT_LABELS[k]}</span>
              <input
                type="number"
                min={0}
                max={100}
                value={weights[k]}
                onChange={(e) => setW(k, Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0)))}
              />
            </label>
          ))}
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          <button onClick={onResetWeights}>恢复默认权重</button>
          <span className="muted small">5 项权重会按比例自动归一化到 100%。</span>
        </div>
      </details>
    </div>
  );
}

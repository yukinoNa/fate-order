import type { WuXingStat } from '../types';

const VAR: Record<string, string> = {
  木: 'var(--wood)', 火: 'var(--fire)', 土: 'var(--earth)', 金: 'var(--metal)', 水: 'var(--water)',
};

const CLS: Record<string, string> = {
  木: 'wood', 火: 'fire', 土: 'earth', 金: 'metal', 水: 'water',
};

export default function WuXingChart({ stats }: { stats: WuXingStat[] }) {
  return (
    <div className="panel">
      <h2>五行力量分布</h2>
      <div className="wuxing-bars">
        {stats.map((s) => (
          <div className="wuxing-row" key={s.element}>
            <span className={`color-${CLS[s.element]}`}>{s.element}</span>
            <div className="wuxing-bar">
              <div className="wuxing-fill" style={{ width: `${s.percent}%`, background: VAR[s.element] }} />
            </div>
            <span className="muted">{s.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

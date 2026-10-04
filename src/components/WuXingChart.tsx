import type { WuXingStat } from '../types';

const COLORS: Record<string, string> = {
  木: '#4caf7d', 火: '#e06c5a', 土: '#d2a24a', 金: '#c8c3b8', 水: '#5b8fd6',
};

export default function WuXingChart({ stats }: { stats: WuXingStat[] }) {
  return (
    <div className="panel">
      <h2>五行力量分布</h2>
      <div className="wuxing-bars">
        {stats.map((s) => (
          <div className="wuxing-row" key={s.element}>
            <span className={`color-${s.element === '木' ? 'wood' : s.element === '火' ? 'fire' : s.element === '土' ? 'earth' : s.element === '金' ? 'metal' : 'water'}`}>{s.element}</span>
            <div className="wuxing-bar">
              <div className="wuxing-fill" style={{ width: `${s.percent}%`, background: COLORS[s.element] }} />
            </div>
            <span className="muted">{s.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

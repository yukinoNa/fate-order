import type { DaYun } from '../types';

export default function DaYunList({ dayun, qiYun }: { dayun: DaYun[]; qiYun: { desc: string } }) {
  return (
    <div className="panel">
      <h2>大运</h2>
      <div className="muted small" style={{ marginBottom: 10 }}>{qiYun.desc}（每十年一换）</div>
      <div className="dayun-scroll">
        {dayun.map((d) => (
          <div className="dayun-card" key={`${d.ganZhi}-${d.startAge}`}>
            <div className="age">{d.startAge}岁</div>
            <div className="gz">{d.ganZhi}</div>
            <div className="age">{d.startYear}–{d.endYear}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

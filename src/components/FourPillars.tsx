import type { Pillar } from '../types';
import { GAN_ELEMENT, ZHI_MAIN_ELEMENT } from '../lib/constants';

const EL_COLOR: Record<string, string> = {
  木: 'color-wood', 火: 'color-fire', 土: 'color-earth', 金: 'color-metal', 水: 'color-water',
};

function PillarCell({ p }: { p: Pillar }) {
  const ganCls = EL_COLOR[GAN_ELEMENT[p.gan]] ?? '';
  return (
    <div className="pillar-cell">
      <div className="pillar-head">{p.label}</div>
      <div className={`gan ${ganCls}`}>{p.gan}</div>
      <div className="shi-shen muted">{p.shiShenGan}</div>
      <div className={`zhi ${EL_COLOR[ZHI_MAIN_ELEMENT[p.zhi]] ?? ''}`}>{p.zhi}</div>
      <div className="canggan">
        {p.cangGan.map((g, i) => (
          <div key={i} className={EL_COLOR[GAN_ELEMENT[g]] ?? ''}>
            {g} <span className="muted">{p.shiShenZhi[i] ?? ''}</span>
          </div>
        ))}
      </div>
      <div className="hide-gan">{p.naYin}</div>
    </div>
  );
}

export default function FourPillars({ pillars }: { pillars: Pillar[] }) {
  return (
    <div className="panel">
      <h2>四柱命盘</h2>
      <div className="pillar-table">
        {pillars.map((p) => <PillarCell key={p.label} p={p} />)}
      </div>
      <div className="muted small" style={{ marginTop: 10 }}>
        每柱上为天干、下为地支，中间为十神；地支内为本气/中气/余气藏干，底部为纳音。
      </div>
    </div>
  );
}

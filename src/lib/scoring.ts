import type {
  Chart, Element, ScoreDimension, ScoreResult, ShenSha,
} from '../types';
import {
  CHONG, GAN_ELEMENT, GENERATED_BY, GENERATES, HAI, HE5, LIU_HE,
  LU, OVERCOMES, SAN_HE_ZHI, SHI_SHEN_CATEGORY,
  TIAN_DE, TIAN_YI, WEN_CHANG, YANG_REN, YUE_DE, ZHI_MAIN_ELEMENT,
  huaGai, taoHua, yiMa,
} from './constants';
import type { ScoringWeights } from '../config/scoringWeights';

const ELEMENTS: Element[] = ['木', '火', '土', '金', '水'];
const SAN_HE_ELEMENTS: Element[] = ['水', '木', '火', '金'];
const YANG_GAN = new Set(['甲', '丙', '戊', '庚', '壬']);

function isYang(gan: string): boolean {
  return YANG_GAN.has(gan);
}

/** 五行力量：天干各 +1，地支藏干按 本气1 / 中气0.5 / 余气0.3 加权 */
function wuxingTotals(chart: Chart): Record<Element, number> {
  const totals: Record<Element, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const weight = [1.0, 0.5, 0.3];
  for (const p of chart.fourPillars) {
    totals[GAN_ELEMENT[p.gan]] += 1;
    p.cangGan.forEach((g, i) => {
      totals[GAN_ELEMENT[g]] += weight[Math.min(i, weight.length - 1)];
    });
  }
  return totals;
}

function percentages(totals: Record<Element, number>): Record<Element, number> {
  const sum = ELEMENTS.reduce((s, e) => s + totals[e], 0) || 1;
  const out = {} as Record<Element, number>;
  for (const e of ELEMENTS) out[e] = (totals[e] / sum) * 100;
  return out;
}

/* ------------------------------------------------------------------ */
/* 1. 日主旺衰                                                          */
/* ------------------------------------------------------------------ */
function analyzeWangShuai(chart: Chart, totals: Record<Element, number>) {
  void totals;
  const dm = chart.dayMasterElement;
  const dayGan = chart.dayGan;
  const monthPillar = chart.fourPillars[1];
  const monthMainEl = GAN_ELEMENT[monthPillar.cangGan[0]];
  const reasons: string[] = [];

  // 得令
  let lingScore = 0;
  let lingText = '';
  if (monthMainEl === dm) {
    lingScore = 40; lingText = '旺（得令，月令与日主同气）';
  } else if (GENERATED_BY[dm] === monthMainEl) {
    lingScore = 30; lingText = '相（月令生扶日主）';
  } else if (GENERATES[dm] === monthMainEl) {
    lingScore = 20; lingText = '休（日主生月令，泄气）';
  } else if (OVERCOMES[dm] === monthMainEl) {
    lingScore = 10; lingText = '囚（日主克月令，耗力）';
  } else {
    lingScore = 5; lingText = '死（月令克日主）';
  }
  reasons.push(`得令：月支${monthPillar.zhi}本气为${monthMainEl}，日主${dayGan}（${dm}）处「${lingText}」。`);

  // 得地（通根）
  let rootScore = 0;
  let strongRoots = 0;
  let weakRoots = 0;
  chart.fourPillars.forEach((p) => {
    p.cangGan.forEach((g, i) => {
      if (GAN_ELEMENT[g] === dm) {
        if (i === 0) { rootScore += 10; strongRoots += 1; }
        else { rootScore += 5; weakRoots += 1; }
      }
    });
  });
  rootScore = Math.min(rootScore, 30);
  if (strongRoots || weakRoots) {
    reasons.push(`得地：日主通根——本气根${strongRoots}个、余气根${weakRoots}个（得地${rootScore}/30）。`);
  } else {
    reasons.push('得地：日主无根，四支藏干中不见同五行。');
  }

  // 得势（党众）：除日柱外的 3 天干 + 3 地支本气，共 6 位
  const support = { biJie: 0, yin: 0, shiShang: 0, cai: 0, guanSha: 0 };
  const gans = chart.fourPillars.map((p) => p.gan);
  const zhis = chart.fourPillars.map((p) => p.zhi);
  const tally = (el: Element) => {
    if (el === dm) support.biJie += 1;
    else if (GENERATED_BY[dm] === el) support.yin += 1;
    else if (GENERATES[dm] === el) support.shiShang += 1;
    else if (OVERCOMES[dm] === el) support.cai += 1;
    else support.guanSha += 1;
  };
  for (let i = 0; i < 4; i++) {
    if (i === 2) continue; // 跳过日柱（日干+日支）
    tally(GAN_ELEMENT[gans[i]]);
    tally(ZHI_MAIN_ELEMENT[zhis[i]]);
  }
  const helpCount = support.biJie + support.yin;
  const xieCount = support.shiShang + support.cai + support.guanSha;
  const shiScore = Math.min(helpCount * 5, 30);
  reasons.push(
    `得势：同党（比劫+印）${helpCount}位、异党（食伤+财+官杀）${xieCount}位（得势${shiScore}/30）。`,
  );

  const score = lingScore + rootScore + shiScore;
  let strongWeak: string;
  let desc: string;
  let raw: number;

  const fromGe = fromStrongOrWeak(score, helpCount, xieCount);
  if (fromGe) {
    strongWeak = fromGe.name;
    desc = fromGe.desc;
    raw = fromGe.raw;
  } else if (score >= 75) {
    strongWeak = '身强';
    desc = '日主偏旺，喜克泄耗（财官食伤）来平衡。';
    raw = 66;
  } else if (score >= 60) {
    strongWeak = '偏强';
    desc = '日主略旺，接近平衡，格局较稳。';
    raw = 88;
  } else if (score >= 42) {
    strongWeak = '中和';
    desc = '五行相对均衡，日主不弱不亢，为最理想状态。';
    raw = 100;
  } else if (score >= 28) {
    strongWeak = '偏弱';
    desc = '日主略弱，喜印比生扶。';
    raw = 86;
  } else if (helpCount > 0) {
    strongWeak = '身弱';
    desc = '日主偏弱，但有印比相扶，尚可调候。';
    raw = 62;
  } else {
    strongWeak = '身弱';
    desc = '日主极弱，且无助，若不能从弱则格局艰难。';
    raw = 40;
  }
  reasons.push(`综合身强指数 ${score}/100，判定：${strongWeak}。`);

  return { strongWeak, desc, raw: clamp(raw), reasons };
}

/** 判断是否成从格 */
function fromStrongOrWeak(
  score: number, helpCount: number, xieCount: number,
): { name: string; desc: string; raw: number } | null {
  if (score >= 85 && xieCount <= 1) {
    return { name: '从强', desc: '日主极旺且异党几无，成「从强」之势（专旺/从印比）。', raw: 76 };
  }
  if (score <= 18 && helpCount === 0) {
    return { name: '从弱', desc: '日主极弱且毫无生扶，成「从弱」之势（从财/从杀/从儿）。', raw: 76 };
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* 2. 五行平衡                                                          */
/* ------------------------------------------------------------------ */
function wuxingBalance(per: Record<Element, number>) {
  const reasons: string[] = [];
  let raw = 100;
  const missing: Element[] = [];
  const over: Element[] = [];
  for (const e of ELEMENTS) {
    if (per[e] < 3) { missing.push(e); raw -= 18; }
    else if (per[e] > 32) { over.push(e); raw -= 12; }
  }
  if (missing.length === 0) reasons.push('五行俱全，无缺失。');
  else reasons.push(`五行缺失：${missing.join('、')}（该行过弱，主相关方面偏弱）。`);
  if (over.length === 0) reasons.push('五行无明显过旺，分布相对均衡。');
  else reasons.push(`五行偏旺：${over.join('、')}（占比过高，需泄耗平衡）。`);
  if (missing.length >= 2) { raw -= 8; reasons.push('缺失超过两行，命局偏枯。'); }
  return { raw: clamp(raw), reasons };
}

/* ------------------------------------------------------------------ */
/* 3. 调候（寒暖燥湿）                                                  */
/* ------------------------------------------------------------------ */
function tiaoHou(chart: Chart, per: Record<Element, number>) {
  const monthZhi = chart.fourPillars[1].zhi;
  const reasons: string[] = [];
  const winter = ['亥', '子', '丑'];
  const summer = ['巳', '午', '未'];
  let raw = 100;
  if (winter.includes(monthZhi)) {
    const fire = per['火'];
    reasons.push(`生于${monthZhi}月（冬），金寒水冷，最需火来调候暖局。`);
    if (fire < 3) { raw = 40; reasons.push('命局无火，寒局无暖，层次受损。'); }
    else if (fire < 15) { raw = 66; reasons.push('火弱，暖局之力不足。'); }
    else if (fire < 30) { raw = 88; reasons.push('有火暖局，尚可。'); }
    else { raw = 100; reasons.push('火旺，寒暖得宜。'); }
  } else if (summer.includes(monthZhi)) {
    const water = per['水'];
    reasons.push(`生于${monthZhi}月（夏），火炎土燥，最需水来调候润局。`);
    if (water < 3) { raw = 40; reasons.push('命局无水，燥局无润，层次受损。'); }
    else if (water < 15) { raw = 66; reasons.push('水弱，润局之力不足。'); }
    else if (water < 30) { raw = 88; reasons.push('有水润局，尚可。'); }
    else { raw = 100; reasons.push('水旺，燥润得宜。'); }
  } else {
    reasons.push(`生于${monthZhi}月，非极寒极暑之季，调候要求不苛刻。`);
    raw = 100;
  }
  return { raw, reasons };
}

/* ------------------------------------------------------------------ */
/* 4. 格局与十神结构                                                    */
/* ------------------------------------------------------------------ */
function gatherShiShen(chart: Chart): string[] {
  const list: string[] = [];
  chart.fourPillars.forEach((p, i) => {
    if (i !== 2 && p.shiShenGan && p.shiShenGan !== '日主') list.push(p.shiShenGan);
    if (p.shiShenZhi[0] && p.shiShenZhi[0] !== '日主') list.push(p.shiShenZhi[0]);
  });
  return list;
}

function geJuName(chart: Chart): string {
  const dm = chart.dayMasterElement;
  const dayGan = chart.dayGan;
  const monthPillar = chart.fourPillars[1];
  const mainGan = monthPillar.cangGan[0];
  const mainEl = GAN_ELEMENT[mainGan];
  const samePolarity = isYang(mainGan) === isYang(dayGan);
  if (mainEl === dm) return '建禄格（月劫）';
  if (GENERATED_BY[dm] === mainEl) return samePolarity ? '偏印格' : '正印格';
  if (GENERATES[dm] === mainEl) return samePolarity ? '食神格' : '伤官格';
  if (OVERCOMES[dm] === mainEl) return samePolarity ? '偏财格' : '正财格';
  return samePolarity ? '七杀格' : '正官格';
}

function analyzeGeJu(chart: Chart, strongWeak: string) {
  const reasons: string[] = [];
  const list = gatherShiShen(chart);
  const cat = (n: string) => SHI_SHEN_CATEGORY[n] ?? n;
  const has = (n: string) => list.includes(n);
  const countCat = (c: string) => list.filter((n) => cat(n) === c).length;

  const hasShiShang = countCat('食伤') > 0;
  const hasCai = countCat('财') > 0;
  const hasGuanSha = countCat('官杀') > 0;
  const hasYin = countCat('印') > 0;
  const hasShiShen = has('食神');
  const hasShangGuan = has('伤官');
  const hasZhengGuan = has('正官');
  const hasQiSha = has('七杀');

  const name = geJuName(chart);
  const patternNames: string[] = [];

  let raw = 60;
  const good: string[] = [];
  const bad: string[] = [];

  if (hasShiShang && hasCai) { raw += 20; good.push('食伤生财：才华可化为财富。'); patternNames.push('食伤生财'); }
  if (hasCai && hasGuanSha) { raw += 14; good.push('财生官：财官相生，有事业根基。'); patternNames.push('财生官'); }
  if (hasGuanSha && hasYin) { raw += 16; good.push('官印相生：贵气有印护持。'); patternNames.push('官印相生'); }
  if (hasQiSha && (hasShiShen || hasShangGuan)) { raw += 16; good.push('食伤制杀：以智勇驾驭七杀。'); patternNames.push('食伤制杀'); }
  if (hasShangGuan && hasYin) { raw += 14; good.push('伤官配印：才华得以收敛升华。'); patternNames.push('伤官配印'); }
  if (hasYin) { raw += 6; good.push('有印生身，根基有靠。'); }

  if (hasZhengGuan && hasQiSha && !hasYin && !hasShiShen && !hasShangGuan) {
    raw -= 18; bad.push('官杀混杂无制化：压力大、是非多。'); patternNames.push('官杀混杂');
  }
  if (hasShangGuan && hasZhengGuan && !hasCai) {
    raw -= 18; bad.push('伤官见官：傲上、易起冲突。'); patternNames.push('伤官见官');
  }
  if (countCat('财') >= 2 && (strongWeak === '身弱' || strongWeak === '偏弱') && countCat('比劫') + countCat('印') === 0) {
    raw -= 16; bad.push('财多身弱：富屋贫人，财来难守。'); patternNames.push('财多身弱');
  }
  if (countCat('比劫') >= 3 && hasCai && (strongWeak === '身强' || strongWeak === '偏强')) {
    raw -= 14; bad.push('比劫夺财：身强比劫多而争财。'); patternNames.push('比劫夺财');
  }
  if (hasQiSha && !hasShiShen && !hasShangGuan && !hasYin) {
    raw -= 16; bad.push('七杀无制：压力逼迫，需防小人伤病。'); patternNames.push('七杀无制');
  }

  if (good.length) reasons.push(...good);
  if (bad.length) reasons.push(...bad);
  if (!good.length && !bad.length) reasons.push('十神组合平平，无突出格局，也无明显凶格。');

  const patterns = [`月令取格：${name}`];
  if (patternNames.length) patterns.push(`吉凶格：${patternNames.join('、')}`);

  return { raw: clamp(raw), reasons, patterns, name };
}

/* ------------------------------------------------------------------ */
/* 5. 干支组合与神煞                                                    */
/* ------------------------------------------------------------------ */
function analyzeZuHe(chart: Chart) {
  const reasons: string[] = [];
  const shensha: ShenSha[] = [];
  const gans = chart.fourPillars.map((p) => p.gan);
  const zhis = chart.fourPillars.map((p) => p.zhi);
  const dayGan = chart.dayGan;
  const yearGan = gans[0];
  const monthZhi = zhis[1];
  let raw = 72;

  // 天干五合
  const hePairs: string[] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      if (HE5[gans[i]] === gans[j]) hePairs.push(`${gans[i]}${gans[j]}合`);
    }
  }
  raw += hePairs.length * 8;
  if (hePairs.length) reasons.push(`天干相合：${hePairs.join('、')}。`);

  // 地支六合
  const lh: string[] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      if (LIU_HE[zhis[i]] === zhis[j]) lh.push(`${zhis[i]}${zhis[j]}合`);
    }
  }
  raw += lh.length * 8;
  if (lh.length) reasons.push(`地支六合：${lh.join('、')}。`);

  // 三合 / 三会
  for (const e of SAN_HE_ELEMENTS) {
    const c = SAN_HE_ZHI[e].filter((z) => zhis.includes(z)).length;
    if (c === 3) { raw += 20; reasons.push(`地支三合${e}局成局（${SAN_HE_ZHI[e].join('')}）。`); }
    else if (c === 2) { raw += 6; reasons.push(`地支${e}局半合。`); }
  }
  const sanHuiGroups = [
    ['寅', '卯', '辰', '木'], ['巳', '午', '未', '火'],
    ['申', '酉', '戌', '金'], ['亥', '子', '丑', '水'],
  ] as const;
  for (const g of sanHuiGroups) {
    const c = g.slice(0, 3).filter((z) => zhis.includes(z as string)).length;
    if (c === 3) { raw += 18; reasons.push(`地支三会${g[3]}方局成局。`); }
    else if (c === 2) { raw += 5; reasons.push(`地支${g[3]}方局半会。`); }
  }

  // 冲
  const chong: string[] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      if (CHONG[zhis[i]] === zhis[j]) chong.push(`${zhis[i]}${zhis[j]}冲`);
    }
  }
  raw -= chong.length * 12;
  if (chong.length) reasons.push(`地支相冲：${chong.join('、')}（动荡、变动多）。`);

  // 害
  const hai: string[] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      if (HAI[zhis[i]] === zhis[j]) hai.push(`${zhis[i]}${zhis[j]}害`);
    }
  }
  raw -= hai.length * 7;
  if (hai.length) reasons.push(`地支相害：${hai.join('、')}。`);

  // 刑
  const xing: string[] = [];
  const zset = new Set(zhis);
  if (['寅', '巳', '申'].every((z) => zset.has(z))) xing.push('寅巳申三刑');
  if (['丑', '戌', '未'].every((z) => zset.has(z))) xing.push('丑戌未三刑');
  if (zset.has('子') && zset.has('卯')) xing.push('子卯相刑');
  for (const z of ['辰', '午', '酉', '亥']) {
    if (zhis.filter((x) => x === z).length >= 2) xing.push(`${z}${z}自刑`);
  }
  raw -= xing.length * 10;
  if (xing.length) reasons.push(`地支相刑：${xing.join('、')}（刑伤、是非）。`);

  // 神煞（吉神）
  const checkZhi = (target: string, name: string): string | null => {
    const idx = zhis.indexOf(target);
    return idx >= 0 ? `${target}（${['年', '月', '日', '时'][idx]}支）` : null;
  };

  for (const [gzhi, gan] of [['年', yearGan], ['日', dayGan]] as const) {
    const ty = TIAN_YI[gan];
    if (ty) {
      for (const t of ty) {
        const w = checkZhi(t, '天乙贵人');
        if (w) shensha.push({ name: '天乙贵人', where: `${w}，以${gzhi}干${gan}查`, type: 'good' });
      }
    }
    const wc = WEN_CHANG[gan];
    const ww = checkZhi(wc, '文昌贵人');
    if (ww) shensha.push({ name: '文昌贵人', where: `${ww}，以${gzhi}干${gan}查`, type: 'good' });
  }
  const luZhi = LU[dayGan];
  const lw = checkZhi(luZhi, '禄神');
  if (lw) shensha.push({ name: '禄神', where: `${lw}，以日干${dayGan}查`, type: 'good' });
  const yrZhi = YANG_REN[dayGan];
  const yw = checkZhi(yrZhi, '羊刃');
  if (yw) shensha.push({ name: '羊刃', where: `${yw}，以日干${dayGan}查`, type: 'bad' });

  const td = TIAN_DE[monthZhi];
  if (td && gans.includes(td)) shensha.push({ name: '天德贵人', where: `月支${monthZhi}查见天干${td}`, type: 'good' });
  const yd = YUE_DE[monthZhi];
  if (yd && gans.includes(yd)) shensha.push({ name: '月德贵人', where: `月支${monthZhi}查见天干${yd}`, type: 'good' });

  for (const [idx, z] of zhis.entries()) {
    const pos = ['年', '月', '日', '时'][idx];
    const ym = yiMa(z);
    if (ym && zhis.includes(ym)) shensha.push({ name: '驿马', where: `${pos}支${z}查见${ym}`, type: 'neutral' });
    const th = taoHua(z);
    if (th && zhis.includes(th)) shensha.push({ name: '桃花', where: `${pos}支${z}查见${th}`, type: 'neutral' });
    const hg = huaGai(z);
    if (hg && zhis.includes(hg)) shensha.push({ name: '华盖', where: `${pos}支${z}查见${hg}`, type: 'neutral' });
  }

  const goodCount = shensha.filter((s) => s.type === 'good').length;
  const badCount = shensha.filter((s) => s.type === 'bad').length;
  raw += goodCount * 5;
  raw -= badCount * 5;
  if (goodCount) reasons.push(`见吉神${goodCount}个（天乙/天德/月德/文昌/禄神等）。`);
  if (badCount) reasons.push(`见羊刃等凶煞${badCount}个。`);
  if (!reasons.length) reasons.push('干支无合冲刑害，神煞平淡，命局相对安静。');

  return { raw: clamp(raw), reasons, shensha };
}

/* ------------------------------------------------------------------ */
/* 汇总                                                                */
/* ------------------------------------------------------------------ */
export function scoreChart(chart: Chart, weights: ScoringWeights): ScoreResult {
  const totals = wuxingTotals(chart);
  const per = percentages(totals);

  const ws = analyzeWangShuai(chart, totals);
  const wb = wuxingBalance(per);
  const th = tiaoHou(chart, per);
  const gj = analyzeGeJu(chart, ws.strongWeak);
  const zh = analyzeZuHe(chart);

  const dims: ScoreDimension[] = [
    { key: 'wangShuai', name: '日主旺衰', raw: ws.raw, weight: weights.wangShuai, weighted: 0, summary: ws.strongWeak, reasons: ws.reasons },
    { key: 'wuXing', name: '五行平衡', raw: wb.raw, weight: weights.wuXing, weighted: 0, summary: '分布均衡度', reasons: wb.reasons },
    { key: 'tiaoHou', name: '调候', raw: th.raw, weight: weights.tiaoHou, weighted: 0, summary: '寒暖燥湿', reasons: th.reasons },
    { key: 'geJu', name: '格局十神', raw: gj.raw, weight: weights.geJu, weighted: 0, summary: gj.name, reasons: gj.reasons },
    { key: 'zuHe', name: '干支组合神煞', raw: zh.raw, weight: weights.zuHe, weighted: 0, summary: '合冲刑害与吉神', reasons: zh.reasons },
  ];
  for (const d of dims) d.weighted = (d.raw * d.weight) / 100;

  const total = Math.round(dims.reduce((s, d) => s + d.weighted, 0));
  const { level, levelClass, levelDesc } = levelOf(total);

  const wuxing = ELEMENTS.map((e) => ({ element: e, percent: Math.round(per[e] * 10) / 10 }));

  return {
    total,
    level,
    levelClass,
    levelDesc,
    strongWeak: ws.strongWeak,
    strongWeakDesc: ws.desc,
    dimensions: dims,
    wuxing,
    shensha: zh.shensha,
    patterns: gj.patterns,
  };
}

function levelOf(total: number) {
  if (total >= 85) {
    return { level: '上等', levelClass: 'good' as const, levelDesc: '格局清纯、五行流通，层次较高。' };
  }
  if (total >= 75) {
    return { level: '中上', levelClass: 'good' as const, levelDesc: '格局较好，中上层次，机遇较多。' };
  }
  if (total >= 63) {
    return { level: '中等', levelClass: 'warn' as const, levelDesc: '格局平稳，中等层次，吉凶参半。' };
  }
  if (total >= 52) {
    return { level: '中下', levelClass: 'warn' as const, levelDesc: '命局略有偏枯或刑冲，层次中下。' };
  }
  return { level: '下等', levelClass: 'bad' as const, levelDesc: '命局偏枯、刑冲较重，层次偏低，宜多修心守分。' };
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/**
 * 排盘与评分逻辑冒烟测试（不依赖 DOM）
 * 编译方式：npx tsc scripts/test.ts --module commonjs --target es2020 --esModuleInterop --skipLibCheck --outDir .test-out
 */
import { buildChart } from '../src/lib/bazi';
import { scoreChart } from '../src/lib/scoring';
import { explainChart } from '../src/lib/explain';
import { DEFAULT_WEIGHTS } from '../src/config/scoringWeights';
import type { BirthInput } from '../src/types';

function base(): BirthInput {
  return {
    calendar: 'solar', year: 1990, month: 1, day: 15, hour: 12, minute: 0,
    gender: 'male', isLeapMonth: false, useTrueSolarTime: false, longitude: 120,
    wanZiShi: 'sameDay',
  };
}

function pz(input: BirthInput) {
  const c = buildChart(input);
  const gz = c.fourPillars.map((p) => p.ganZhi).join(' ');
  return gz;
}

function show(input: BirthInput, label: string) {
  const chart = buildChart(input);
  const score = scoreChart(chart, DEFAULT_WEIGHTS);
  const gz = chart.fourPillars.map((p) => p.ganZhi).join(' ');
  console.log(`--- ${label} ---`);
  console.log(`四柱: ${gz}  日主: ${chart.dayGan}(${chart.dayMasterElement})`);
  console.log(`身强指数判定: ${score.strongWeak} | 总分: ${score.total} 层级: ${score.level}`);
  console.log(`维度: ${score.dimensions.map((d) => `${d.name}=${d.raw}×${d.weight}%`).join('  ')}`);
  console.log(`五行: ${score.wuxing.map((w) => `${w.element}${w.percent}%`).join(' ')}`);
  console.log(`格局: ${score.patterns.join('；')}`);
  console.log('');
}

// A. 已知八字验证：1990-01-15 12:00 → 己巳 丁丑 庚辰 壬午
const a = base();
console.log('A 期望: 己巳 丁丑 庚辰 壬午，实际:', pz(a));
if (pz(a) !== '己巳 丁丑 庚辰 壬午') { throw new Error('A 失败'); }

// B. 节气边界：2023-02-04 立春 10:42，10:00 应仍为壬寅年
const b1 = { ...base(), year: 2023, month: 2, day: 4, hour: 10, minute: 0 };
const b2 = { ...b1, hour: 11 };
console.log('B 立春前 10:00 →', pz(b1), '（年柱应为壬寅）');
console.log('B 立春后 11:00 →', pz(b2), '（年柱应为癸卯）');

// C. 农历闰月：1990 闰五月初五 12:00 → 庚午 壬午 癸亥 戊午
const c: BirthInput = { ...base(), calendar: 'lunar', year: 1990, month: 5, day: 5, isLeapMonth: true };
console.log('C 期望: 庚午 壬午 癸亥 戊午，实际:', pz(c));
if (pz(c) !== '庚午 壬午 癸亥 戊午') { throw new Error('C 失败'); }

// D. 真太阳时：乌鲁木齐 23:30 校正后约 21:23 → 时柱由 子 变 亥
const d1: BirthInput = { ...base(), year: 1985, month: 6, day: 1, hour: 23, minute: 30, longitude: 87.6 };
const d2 = { ...d1, useTrueSolarTime: true };
console.log('D 未校正 23:30 →', pz(d1));
console.log('D 真太阳时  →', pz(d2));
console.log('D 校正说明:', buildChart(d2).correctedDesc);

// F. 晚子时口径：23:30 日柱 算当天=庚辰 / 算次日=辛巳（时柱同为戊子）
const f1: BirthInput = { ...base(), hour: 23, minute: 30, wanZiShi: 'sameDay' };
const f2: BirthInput = { ...f1, wanZiShi: 'nextDay' };
console.log('F 晚子时 算当天 →', pz(f1));
console.log('F 晚子时 算次日 →', pz(f2));
if (pz(f1) !== '己巳 丁丑 庚辰 戊子') { throw new Error('F1 失败'); }
if (pz(f2) !== '己巳 丁丑 辛巳 戊子') { throw new Error('F2 失败'); }

// E. 几个样例的评分总览
show(base(), 'E1 1990-01-15 12:00 男');
show({ ...base(), gender: 'female' }, 'E2 同日 女');
show({ ...base(), year: 1988, month: 8, day: 8, hour: 8 }, 'E3 1988-08-08 08:00 男');
show({ ...base(), year: 2000, month: 12, day: 25, hour: 2 }, 'E4 2000-12-25 02:00 男');
show({ ...base(), year: 1976, month: 7, day: 28, hour: 3, minute: 30 }, 'E5 1976-07-28 03:30 男（唐山地震日）');
show({ ...base(), year: 2024, month: 1, day: 1, hour: 0 }, 'E6 2024-01-01 00:00 男');

// G. 详解模式（默认声线）冒烟测试
console.log('\n===== G 白话详解输出（默认声线）=====');
{
  const chart = buildChart(base());
  const score = scoreChart(chart, DEFAULT_WEIGHTS);
  const ex = explainChart(chart, score);
  console.log('【总览】', ex.headline);
  for (const b of ex.blocks) {
    console.log(`\n${b.icon} ${b.title}`);
    b.body.forEach((p) => console.log('   ', p));
    (b.bullets ?? []).forEach((t) => console.log('    ·', t));
  }
  console.log(`【术语词典】共 ${ex.glossary.length} 条`);
  if (ex.blocks.length !== 6) throw new Error('G 失败：详解区块数量异常');
  if (!ex.headline.includes('你自己')) throw new Error('G 失败：总览缺少日主说明');
  if (ex.glossary.length < 10) throw new Error('G 失败：术语词典过少');
  if (ex.blocks.some((b) => b.quip)) throw new Error('G 失败：默认声线不应带吐槽');
  console.log('G 默认声线 ✅');
}

// H. 鲸鱼娘声线冒烟测试
console.log('\n===== H 鲸鱼娘声线输出 =====');
{
  const chart = buildChart(base());
  const score = scoreChart(chart, DEFAULT_WEIGHTS);
  const ex = explainChart(chart, score, 'whale');
  console.log('【解说】', ex.personaName, '|', ex.personaTagline);
  console.log('【总览】', ex.headline);
  for (const b of ex.blocks) {
    console.log(`\n${b.icon} ${b.title}`);
    if (b.quip) console.log('    🐋', b.quip);
  }
  console.log('【收尾】', ex.signoff);
  if (ex.voice !== 'whale') throw new Error('H 失败：声线标记错误');
  if (ex.blocks.length !== 6) throw new Error('H 失败：区块数量异常');
  if (ex.blocks.filter((b) => b.quip).length !== 6) throw new Error('H 失败：吐槽数量不为 6');
  if (!ex.signoff) throw new Error('H 失败：缺少收尾语');
  if (!ex.headline.includes('本鱼')) throw new Error('H 失败：总览未使用本鱼口吻');
  console.log('H 鲸鱼娘声线 ✅');
}

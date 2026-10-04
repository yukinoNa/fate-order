import { useEffect, useMemo, useState } from 'react';
import type { BirthInput } from './types';
import { buildChart } from './lib/bazi';
import { scoreChart } from './lib/scoring';
import { DEFAULT_WEIGHTS, normalizeWeights, type ScoringWeights } from './config/scoringWeights';
import BirthForm from './components/BirthForm';
import FourPillars from './components/FourPillars';
import WuXingChart from './components/WuXingChart';
import DaYunList from './components/DaYunList';
import ScorePanel from './components/ScorePanel';

const DEFAULT_INPUT: BirthInput = {
  calendar: 'solar',
  year: 1990,
  month: 1,
  day: 15,
  hour: 12,
  minute: 0,
  gender: 'male',
  isLeapMonth: false,
  useTrueSolarTime: false,
  longitude: 120,
  wanZiShi: 'sameDay',
};

function loadInput(): BirthInput {
  try {
    const raw = localStorage.getItem('bazi_input');
    if (raw) return { ...DEFAULT_INPUT, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_INPUT;
}

function loadWeights(): ScoringWeights {
  try {
    const raw = localStorage.getItem('bazi_weights');
    if (raw) return { ...DEFAULT_WEIGHTS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_WEIGHTS;
}

type Theme = 'default' | 'whale';

function loadTheme(): Theme {
  try {
    if (localStorage.getItem('bazi_theme') === 'whale') return 'whale';
  } catch { /* ignore */ }
  return 'default';
}

export default function App() {
  const [input, setInput] = useState<BirthInput>(loadInput);
  const [weights, setWeights] = useState<ScoringWeights>(loadWeights);
  const [theme, setTheme] = useState<Theme>(loadTheme);
  const [submittedInput, setSubmittedInput] = useState<BirthInput | null>(null);
  const [mascotMissing, setMascotMissing] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('bazi_input', JSON.stringify(input)); } catch { /* ignore */ }
  }, [input]);
  useEffect(() => {
    try { localStorage.setItem('bazi_weights', JSON.stringify(weights)); } catch { /* ignore */ }
  }, [weights]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'whale' ? '#eef3ff' : '#14141f');
    try { localStorage.setItem('bazi_theme', theme); } catch { /* ignore */ }
  }, [theme]);

  const effectiveWeights = useMemo(() => normalizeWeights(weights), [weights]);

  // 只在点击「开始测算」后，才基于提交时的输入快照计算结果
  const result = useMemo(() => {
    if (!submittedInput) return null;
    try {
      const chart = buildChart(submittedInput);
      const score = scoreChart(chart, effectiveWeights);
      return { chart, score, error: null as string | null };
    } catch (e) {
      return { chart: null, score: null, error: e instanceof Error ? e.message : String(e) };
    }
  }, [submittedInput, effectiveWeights]);

  const isDirty = submittedInput !== null && JSON.stringify(submittedInput) !== JSON.stringify(input);

  return (
    <div>
      <header className="header-row" style={{ marginBottom: 16 }}>
        <div className="header-title">
          <img
            className={`whale-mascot${mascotMissing ? ' missing' : ''}`}
            src="./whale-mascot.webp"
            alt="鲸鱼娘"
            onError={() => setMascotMissing(true)}
          />
          <div>
            <h1>八字命盘 · 命局层次推演</h1>
            <div className="muted small">
              输入出生时间，点击「开始测算」，排四柱、十神、大运并给出命局层次评分。
            </div>
          </div>
        </div>
        <div className="theme-switch" role="group" aria-label="页面皮肤">
          <button className={theme === 'default' ? 'active' : ''} onClick={() => setTheme('default')}>
            🌙 默认
          </button>
          <button className={theme === 'whale' ? 'active' : ''} onClick={() => setTheme('whale')}>
            🐋 鲸鱼娘
          </button>
        </div>
      </header>

      <BirthForm value={input} onChange={setInput} />

      <div style={{ marginBottom: 14 }}>
        <button className="primary calculate-btn" onClick={() => setSubmittedInput(input)}>
          ✨ 开始测算
        </button>
        {isDirty && (
          <div className="muted small" style={{ marginTop: 8, textAlign: 'center' }}>
            出生信息已修改，点击「开始测算」重新计算
          </div>
        )}
      </div>

      {submittedInput === null ? (
        <div className="panel muted" style={{ textAlign: 'center', padding: '32px 14px' }}>
          填写出生信息后，点击「✨ 开始测算」查看命盘与命局层次
        </div>
      ) : result?.error ? (
        <div className="panel">
          <div style={{ color: 'var(--bad)' }}>排盘出错：{result.error}</div>
          <div className="muted small">请检查日期是否有效（如农历闰月、当月天数、0-23 时等）。</div>
        </div>
      ) : result?.chart && result.score ? (
        <>
          {result.chart.correctedDesc && (
            <div className="panel">
              <div className="small">真太阳时校正：{result.chart.correctedDesc}</div>
              {result.chart.crossedBoundary && (
                <div className="small" style={{ color: 'var(--warn)', marginTop: 4 }}>
                  注意：校正后跨过了日/月分界，四柱已按校正后的时间重新起算。
                </div>
              )}
            </div>
          )}
          <ScorePanel
            score={result.score}
            weights={weights}
            effectiveWeights={effectiveWeights}
            onWeightsChange={setWeights}
            onResetWeights={() => setWeights({ ...DEFAULT_WEIGHTS })}
          />
          <FourPillars pillars={result.chart.fourPillars} />
          <WuXingChart stats={result.score.wuxing} />
          <DaYunList dayun={result.chart.dayun} qiYun={result.chart.qiYun} />
        </>
      ) : null}

      <div className="footer-note">
        <b>说明与免责：</b>
        <br />· 历法采用开源库 lunar-javascript（含节气交节、干支、纳音、大运）。
        <br />· 「命局层次」为<b>透明启发式评分</b>，各维度权重可自行调整，仅供学习参考，不代表任何权威门派结论。
        <br />· 真太阳时 = 北京时间 + (经度−120°)×4分钟 + 均时差；晚子时（23-24点）日柱口径可在表单中选择。
        <br />· 命理为传统文化，请理性看待，勿用于重大决策。
        <br />· 鲸鱼娘头像源自开源「梗鲸 · DeepSeek酱语录」表情包（deepseek-chan-meme-pack），仅供学习使用。
      </div>
    </div>
  );
}

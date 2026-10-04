import type { BirthInput, CalendarType, Gender } from '../types';

const CITIES: Array<[string, number]> = [
  ['北京', 120], ['上海', 121.5], ['广州', 113.3], ['深圳', 114.1],
  ['成都', 104.1], ['重庆', 106.5], ['西安', 108.9], ['武汉', 114.3],
  ['哈尔滨', 126.6], ['乌鲁木齐', 87.6], ['拉萨', 91.1], ['昆明', 102.7],
];

function shiChen(hour: number): string {
  const names = ['子时(23-1)', '丑时(1-3)', '寅时(3-5)', '卯时(5-7)', '辰时(7-9)', '巳时(9-11)', '午时(11-13)', '未时(13-15)', '申时(15-17)', '酉时(17-19)', '戌时(19-21)', '亥时(21-23)'];
  return names[Math.floor(((hour + 1) % 24) / 2)];
}

interface Props {
  value: BirthInput;
  onChange: (v: BirthInput) => void;
}

export default function BirthForm({ value, onChange }: Props) {
  const set = <K extends keyof BirthInput>(k: K, v: BirthInput[K]) => onChange({ ...value, [k]: v });

  const num = (v: string, fallback: number) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : fallback;
  };

  return (
    <div className="panel">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>出生信息</h3>
        <div className="seg">
          {(['solar', 'lunar'] as CalendarType[]).map((c) => (
            <button key={c} className={value.calendar === c ? 'active' : ''} onClick={() => set('calendar', c)}>
              {c === 'solar' ? '公历' : '农历'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="row">
          <label className="field">
            <span>年</span>
            <input type="number" value={value.year} onChange={(e) => set('year', num(e.target.value, value.year))} />
          </label>
          <label className="field">
            <span>月</span>
            <input type="number" value={value.month} onChange={(e) => set('month', num(e.target.value, value.month))} />
          </label>
          <label className="field">
            <span>日</span>
            <input type="number" value={value.day} onChange={(e) => set('day', num(e.target.value, value.day))} />
          </label>
        </div>

        {value.calendar === 'lunar' && (
          <label className="row" style={{ alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)' }}>
            <input type="checkbox" checked={value.isLeapMonth} onChange={(e) => set('isLeapMonth', e.target.checked)} style={{ width: 16, height: 16 }} />
            是闰月
          </label>
        )}

        <div className="row">
          <label className="field">
            <span>时（0-23）</span>
            <input type="number" value={value.hour} onChange={(e) => set('hour', num(e.target.value, value.hour))} />
          </label>
          <label className="field">
            <span>分</span>
            <input type="number" value={value.minute} onChange={(e) => set('minute', num(e.target.value, value.minute))} />
          </label>
          <label className="field">
            <span>性别</span>
            <div className="seg" style={{ width: '100%' }}>
              {(['male', 'female'] as Gender[]).map((g) => (
                <button key={g} className={value.gender === g ? 'active' : ''} style={{ flex: 1 }} onClick={() => set('gender', g)}>
                  {g === 'male' ? '男' : '女'}
                </button>
              ))}
            </div>
          </label>
        </div>
        <div className="muted small">当前时辰：{shiChen(value.hour)}</div>

        <label className="field">
          <span>晚子时（23-24点）日柱口径</span>
          <select
            value={value.wanZiShi}
            onChange={(e) => set('wanZiShi', e.target.value as BirthInput['wanZiShi'])}
          >
            <option value="sameDay">算当天（lunar-javascript 默认）</option>
            <option value="nextDay">算次日（传统子正换日派）</option>
          </select>
        </label>
        <div className="muted small">仅对 23:00-24:00 出生生效；时柱两种口径相同。</div>

        <label className="row" style={{ alignItems: 'center', gap: 8, fontSize: 13 }}>
          <input type="checkbox" checked={value.useTrueSolarTime} onChange={(e) => set('useTrueSolarTime', e.target.checked)} style={{ width: 16, height: 16 }} />
          启用真太阳时校正（经度 + 均时差）
        </label>

        {value.useTrueSolarTime && (
          <div className="row">
            <label className="field">
              <span>出生地经度（°E）</span>
              <input type="number" step="0.1" value={value.longitude} onChange={(e) => set('longitude', num(e.target.value, value.longitude))} />
            </label>
            <label className="field">
              <span>常用城市</span>
              <select defaultValue="" onChange={(e) => { const c = CITIES.find((x) => x[0] === e.target.value); if (c) set('longitude', c[1]); }}>
                <option value="">选择城市</option>
                {CITIES.map(([name, lng]) => (
                  <option key={name} value={name}>{name}（{lng}°E）</option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export type Element = '木' | '火' | '土' | '金' | '水';
export type Gender = 'male' | 'female';
export type CalendarType = 'solar' | 'lunar';

export interface BirthInput {
  calendar: CalendarType;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: Gender;
  isLeapMonth: boolean;
  useTrueSolarTime: boolean;
  longitude: number;
  /** 晚子时（23:00-24:00）日柱口径：sameDay=算当天，nextDay=算次日 */
  wanZiShi: 'sameDay' | 'nextDay';
}

export interface Pillar {
  label: string; // 年柱 / 月柱 / 日柱 / 时柱
  gan: string;
  zhi: string;
  ganZhi: string;
  cangGan: string[]; // 藏干（本气、中气、余气）
  shiShenGan: string; // 天干十神
  shiShenZhi: string[]; // 藏干对应的十神
  naYin: string; // 纳音
}

export interface DaYun {
  ganZhi: string;
  gan: string;
  zhi: string;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
}

export interface Chart {
  input: BirthInput;
  fourPillars: Pillar[];
  dayGan: string;
  dayMasterElement: Element;
  dayun: DaYun[];
  qiYun: { year: number; month: number; day: number; desc: string };
  birthDesc: string;
  correctedDesc?: string;
  crossedBoundary: boolean;
}

export interface WuXingStat {
  element: Element;
  percent: number; // 0-100
}

export interface ShenSha {
  name: string;
  type: 'good' | 'neutral' | 'bad';
  where: string;
}

export interface ScoreDimension {
  key: string;
  name: string;
  raw: number; // 0-100
  weight: number; // 0-100，百分比
  weighted: number; // raw * weight / 100
  summary: string;
  reasons: string[];
}

export interface ScoreResult {
  total: number; // 0-100
  level: string;
  levelClass: 'good' | 'warn' | 'bad';
  levelDesc: string;
  strongWeak: string;
  strongWeakDesc: string;
  dimensions: ScoreDimension[];
  wuxing: WuXingStat[];
  shensha: ShenSha[];
  patterns: string[];
}

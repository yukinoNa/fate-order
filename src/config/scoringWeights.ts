/** 各维度权重（百分比，总和应为 100），可在界面上调整并持久化到本地 */
export interface ScoringWeights {
  wangShuai: number; // 日主旺衰
  wuXing: number; // 五行平衡
  tiaoHou: number; // 调候
  geJu: number; // 格局十神
  zuHe: number; // 干支组合神煞
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  wangShuai: 25,
  wuXing: 15,
  tiaoHou: 15,
  geJu: 25,
  zuHe: 20,
};

export const WEIGHT_LABELS: Record<keyof ScoringWeights, string> = {
  wangShuai: '日主旺衰',
  wuXing: '五行平衡',
  tiaoHou: '调候（寒暖燥湿）',
  geJu: '格局十神',
  zuHe: '干支组合神煞',
};

export function normalizeWeights(w: ScoringWeights): ScoringWeights {
  const keys = Object.keys(w) as (keyof ScoringWeights)[];
  const sum = keys.reduce((s, k) => s + (w[k] || 0), 0);
  if (sum <= 0) return { ...DEFAULT_WEIGHTS };
  const out = { ...w };
  for (const k of keys) out[k] = Math.round(((w[k] || 0) / sum) * 100);
  return out;
}

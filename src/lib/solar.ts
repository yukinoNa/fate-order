/**
 * 真太阳时校正。
 * 输入的时间按北京时间（UTC+8）理解。
 * 真太阳时 = 北京时间 + (经度 - 120°) × 4分钟 + 均时差
 */

const MS_PER_MIN = 60000;
const MS_PER_HOUR = 3600000;
const TZ_OFFSET_MS = 8 * MS_PER_HOUR;

/** 把「北京时间墙上钟」转换为 epoch 毫秒（与机器时区无关） */
export function beijingToEpoch(
  y: number, mo: number, d: number, h: number, mi: number, s = 0,
): number {
  return Date.UTC(y, mo - 1, d, h, mi, s) - TZ_OFFSET_MS;
}

/** 把 epoch 毫秒转换为「北京时间墙上钟」 */
export function epochToBeijing(epochMs: number) {
  const dt = new Date(epochMs + TZ_OFFSET_MS);
  return {
    year: dt.getUTCFullYear(),
    month: dt.getUTCMonth() + 1,
    day: dt.getUTCDate(),
    hour: dt.getUTCHours(),
    minute: dt.getUTCMinutes(),
    second: dt.getUTCSeconds(),
  };
}

/** 均时差（equation of time），单位：分钟。近似公式，误差约 ±1 分钟 */
export function equationOfTime(y: number, mo: number, d: number): number {
  const n = dayOfYear(y, mo, d);
  const b = (2 * Math.PI * (n - 81)) / 364;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

function dayOfYear(y: number, mo: number, d: number): number {
  const start = Date.UTC(y, 0, 0);
  const cur = Date.UTC(y, mo - 1, d);
  return Math.round((cur - start) / 86400000);
}

/** 返回校正后的「北京时间墙上钟」 */
export function trueSolarBeijing(
  y: number, mo: number, d: number, h: number, mi: number, longitude: number,
) {
  const epoch = beijingToEpoch(y, mo, d, h, mi);
  const eot = equationOfTime(y, mo, d);
  const correction = (longitude - 120) * 4 + eot;
  return epochToBeijing(epoch + correction * MS_PER_MIN);
}

export function formatDate(y: number, mo: number, d: number): string {
  return `${y}年${mo}月${d}日`;
}

export function formatTime(h: number, mi: number): string {
  return `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`;
}

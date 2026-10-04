import { Lunar, Solar } from 'lunar-javascript';
import type { DaYun as LunarDaYun } from 'lunar-javascript';
import type { BirthInput, Chart, DaYun, Pillar } from '../types';
import { GAN_ELEMENT } from './constants';
import { formatDate, formatTime, trueSolarBeijing } from './solar';

/**
 * 输入出生信息，输出排盘结果。
 * 统一先把输入转为公历 Solar，再按需做真太阳时校正，最后取 EightChar。
 */
export function buildChart(input: BirthInput): Chart {
  const base = toSolar(input);

  // 真太阳时校正
  let solar = base;
  let correctedDesc: string | undefined;
  let crossedBoundary = false;
  if (input.useTrueSolarTime) {
    const c = trueSolarBeijing(
      base.getYear(), base.getMonth(), base.getDay(),
      base.getHour(), base.getMinute(), input.longitude,
    );
    const before = `${formatDate(base.getYear(), base.getMonth(), base.getDay())} ${formatTime(base.getHour(), base.getMinute())}`;
    solar = Solar.fromYmdHms(c.year, c.month, c.day, c.hour, c.minute, 0);
    const after = `${formatDate(c.year, c.month, c.day)} ${formatTime(c.hour, c.minute)}`;
    correctedDesc = `${before} → 真太阳时 ${after}（经度 ${input.longitude}°E）`;
    crossedBoundary =
      base.getYear() !== c.year || base.getMonth() !== c.month || base.getDay() !== c.day;
  }

  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  // 晚子时口径：sect 1 = 23-24点日柱算次日，sect 2 = 算当天（库默认）
  ec.setSect(input.wanZiShi === 'nextDay' ? 1 : 2);

  const pillars: Pillar[] = [
    makePillar('年柱', ec.getYearGan(), ec.getYearZhi(), ec.getYearHideGan(), ec.getYearShiShenGan(), ec.getYearShiShenZhi(), ec.getYearNaYin()),
    makePillar('月柱', ec.getMonthGan(), ec.getMonthZhi(), ec.getMonthHideGan(), ec.getMonthShiShenGan(), ec.getMonthShiShenZhi(), ec.getMonthNaYin()),
    makePillar('日柱', ec.getDayGan(), ec.getDayZhi(), ec.getDayHideGan(), ec.getDayShiShenGan(), ec.getDayShiShenZhi(), ec.getDayNaYin()),
    makePillar('时柱', ec.getTimeGan(), ec.getTimeZhi(), ec.getTimeHideGan(), ec.getTimeShiShenGan(), ec.getTimeShiShenZhi(), ec.getTimeNaYin()),
  ];

  const dayGan = ec.getDayGan();

  // 大运（跳过起运前、无干支的第 0 运）
  const yun = ec.getYun(input.gender === 'male' ? 1 : 0);
  const dayun: DaYun[] = yun
    .getDaYun()
    .filter((dy) => dy.getGanZhi() !== '')
    .map((dy: LunarDaYun) => ({
      ganZhi: dy.getGanZhi(),
      gan: dy.getGanZhi().charAt(0),
      zhi: dy.getGanZhi().charAt(1),
      startAge: dy.getStartAge(),
      endAge: dy.getEndAge(),
      startYear: dy.getStartYear(),
      endYear: dy.getEndYear(),
    }));

  const qiYun = {
    year: yun.getStartYear(),
    month: yun.getStartMonth(),
    day: yun.getStartDay(),
    desc: `出生后 ${yun.getStartYear()} 年 ${yun.getStartMonth()} 个月 ${yun.getStartDay()} 天起运`,
  };

  const birthDesc = `${formatDate(solar.getYear(), solar.getMonth(), solar.getDay())} ${formatTime(solar.getHour(), solar.getMinute())}（${input.calendar === 'lunar' ? '农历输入' : '公历输入'}）`;

  return {
    input,
    fourPillars: pillars,
    dayGan,
    dayMasterElement: GAN_ELEMENT[dayGan],
    dayun,
    qiYun,
    birthDesc,
    correctedDesc,
    crossedBoundary,
  };
}

function toSolar(input: BirthInput): Solar {
  if (input.calendar === 'lunar') {
    const month = input.isLeapMonth ? -input.month : input.month;
    return Lunar.fromYmdHms(input.year, month, input.day, input.hour, input.minute, 0).getSolar();
  }
  return Solar.fromYmdHms(input.year, input.month, input.day, input.hour, input.minute, 0);
}

function makePillar(
  label: string, gan: string, zhi: string, cangGan: string[],
  shiShenGan: string, shiShenZhi: string[], naYin: string,
): Pillar {
  return {
    label,
    gan,
    zhi,
    ganZhi: gan + zhi,
    cangGan,
    shiShenGan,
    shiShenZhi,
    naYin,
  };
}

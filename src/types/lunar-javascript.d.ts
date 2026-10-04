declare module 'lunar-javascript' {
  export class Solar {
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    getSecond(): number;
    getLunar(): Lunar;
    toYmdHms(): string;
  }

  export class Lunar {
    static fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Lunar;
    getSolar(): Solar;
    getEightChar(): EightChar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
  }

  export interface DaYun {
    getGanZhi(): string;
    getStartAge(): number;
    getEndAge(): number;
    getStartYear(): number;
    getEndYear(): number;
    getIndex(): number;
  }

  export interface Yun {
    getStartYear(): number;
    getStartMonth(): number;
    getStartDay(): number;
    getStartHour(): number;
    getStartSolar(): Solar;
    getDaYun(n?: number): DaYun[];
  }

  export class EightChar {
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
    getYearGan(): string;
    getYearZhi(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getTimeGan(): string;
    getTimeZhi(): string;
    getYearHideGan(): string[];
    getMonthHideGan(): string[];
    getDayHideGan(): string[];
    getTimeHideGan(): string[];
    getYearShiShenGan(): string;
    getMonthShiShenGan(): string;
    getDayShiShenGan(): string;
    getTimeShiShenGan(): string;
    getYearShiShenZhi(): string[];
    getMonthShiShenZhi(): string[];
    getDayShiShenZhi(): string[];
    getTimeShiShenZhi(): string[];
    getYearNaYin(): string;
    getMonthNaYin(): string;
    getDayNaYin(): string;
    getTimeNaYin(): string;
    getYun(gender: number, sect?: number): Yun;
    setSect(sect: number): void;
  }
}

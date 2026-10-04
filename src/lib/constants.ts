import type { Element } from '../types';

/** 天干 → 五行 */
export const GAN_ELEMENT: Record<string, Element> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};

/** 地支本气 → 五行 */
export const ZHI_MAIN_ELEMENT: Record<string, Element> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};

/** 五行相生：我生 */
export const GENERATES: Record<Element, Element> = {
  木: '火', 火: '土', 土: '金', 金: '水', 水: '木',
};

/** 五行相克：我克 */
export const OVERCOMES: Record<Element, Element> = {
  木: '土', 土: '水', 水: '火', 火: '金', 金: '木',
};

/** 生我 */
export const GENERATED_BY: Record<Element, Element> = {
  木: '水', 火: '木', 土: '火', 金: '土', 水: '金',
};

/** 克我 */
export const OVERCOME_BY: Record<Element, Element> = {
  木: '金', 火: '水', 土: '木', 金: '火', 水: '土',
};

/** 天干五合 */
export const HE5: Record<string, string> = {
  甲: '己', 己: '甲', 乙: '庚', 庚: '乙', 丙: '辛', 辛: '丙',
  丁: '壬', 壬: '丁', 戊: '癸', 癸: '戊',
};

/** 天干五合所化五行 */
export const HE5_ELEMENT: Record<string, Element> = {
  甲: '土', 己: '土', 乙: '金', 庚: '金', 丙: '水', 辛: '水',
  丁: '木', 壬: '木', 戊: '火', 癸: '火',
};

/** 地支六合 */
export const LIU_HE: Record<string, string> = {
  子: '丑', 丑: '子', 寅: '亥', 亥: '寅', 卯: '戌', 戌: '卯',
  辰: '酉', 酉: '辰', 巳: '申', 申: '巳', 午: '未', 未: '午',
};

/** 地支六冲 */
export const CHONG: Record<string, string> = {
  子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅',
  卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳',
};

/** 地支六害 */
export const HAI: Record<string, string> = {
  子: '未', 未: '子', 丑: '午', 午: '丑', 寅: '巳', 巳: '寅',
  卯: '辰', 辰: '卯', 申: '亥', 亥: '申', 酉: '戌', 戌: '酉',
};

/** 地支三合局（每个地支所属三合局的五行） */
export const SAN_HE: Record<string, Element> = {
  申: '水', 子: '水', 辰: '水',
  亥: '木', 卯: '木', 未: '木',
  寅: '火', 午: '火', 戌: '火',
  巳: '金', 酉: '金', 丑: '金',
};

/** 地支三会局（每个地支所属三会局的五行） */
export const SAN_HUI: Record<string, Element> = {
  寅: '木', 卯: '木', 辰: '木',
  巳: '火', 午: '火', 未: '火',
  申: '金', 酉: '金', 戌: '金',
  亥: '水', 子: '水', 丑: '水',
};

/** 三合局的三个地支（仅水木火金四局） */
export const SAN_HE_ZHI: Record<string, string[]> = {
  水: ['申', '子', '辰'],
  木: ['亥', '卯', '未'],
  火: ['寅', '午', '戌'],
  金: ['巳', '酉', '丑'],
};

/** 天乙贵人（以日干/年干查） */
export const TIAN_YI: Record<string, [string, string]> = {
  甲: ['丑', '未'], 戊: ['丑', '未'], 庚: ['丑', '未'],
  乙: ['子', '申'], 己: ['子', '申'],
  丙: ['亥', '酉'], 丁: ['亥', '酉'],
  壬: ['卯', '巳'], 癸: ['卯', '巳'],
  辛: ['午', '寅'],
};

/** 文昌贵人（以日干查） */
export const WEN_CHANG: Record<string, string> = {
  甲: '巳', 乙: '午', 丙: '申', 戊: '申', 丁: '酉',
  己: '酉', 庚: '亥', 辛: '子', 壬: '寅', 癸: '卯',
};

/** 禄神（以日干查） */
export const LU: Record<string, string> = {
  甲: '寅', 乙: '卯', 丙: '巳', 戊: '巳', 丁: '午',
  己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子',
};

/** 羊刃（阳干） */
export const YANG_REN: Record<string, string> = {
  甲: '卯', 丙: '午', 戊: '午', 庚: '酉', 壬: '子',
};

/** 天德贵人（以月支查） */
export const TIAN_DE: Record<string, string> = {
  寅: '丁', 卯: '申', 辰: '壬', 巳: '辛', 午: '亥', 未: '甲',
  申: '癸', 酉: '寅', 戌: '丙', 亥: '乙', 子: '巳', 丑: '庚',
};

/** 月德贵人（以月支查：寅午戌月见丙、申子辰月见壬、亥卯未月见甲、巳酉丑月见庚） */
export const YUE_DE: Record<string, string> = {
  寅: '丙', 午: '丙', 戌: '丙',
  申: '壬', 子: '壬', 辰: '壬',
  亥: '甲', 卯: '甲', 未: '甲',
  巳: '庚', 酉: '庚', 丑: '庚',
};

/** 驿马（以年支/日支所属三合局查） */
export function yiMa(zhi: string): string {
  switch (SAN_HE[zhi]) {
    case '水': return '寅'; // 申子辰马在寅
    case '木': return '巳'; // 亥卯未马在巳
    case '火': return '申'; // 寅午戌马在申
    case '金': return '亥'; // 巳酉丑马在亥
    default: return '';
  }
}

/** 桃花 / 咸池 */
export function taoHua(zhi: string): string {
  switch (SAN_HE[zhi]) {
    case '水': return '酉'; // 申子辰见酉
    case '木': return '子'; // 亥卯未见子
    case '火': return '卯'; // 寅午戌见卯
    case '金': return '午'; // 巳酉丑见午
    default: return '';
  }
}

/** 华盖 */
export function huaGai(zhi: string): string {
  switch (SAN_HE[zhi]) {
    case '水': return '辰';
    case '木': return '未';
    case '火': return '戌';
    case '金': return '丑';
    default: return '';
  }
}

/** 十神中文名 → 类别 */
export const SHI_SHEN_CATEGORY: Record<string, string> = {
  比肩: '比劫', 劫财: '比劫',
  食神: '食伤', 伤官: '食伤',
  偏财: '财', 正财: '财',
  七杀: '官杀', 正官: '官杀',
  偏印: '印', 正印: '印',
};

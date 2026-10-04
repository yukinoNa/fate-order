import type { Chart, Element, ScoreResult } from '../types';

export type Persona = 'neutral' | 'whale';

/** 天干性格速写（大白话） */
const GAN_PERSONALITY: Record<string, string> = {
  甲: '甲木像参天大树：正直、有主见、愿意向上生长，做事讲原则，天生带点领导气。缺点是容易固执、不够圆融。',
  乙: '乙木像花草藤蔓：柔韧、灵活、擅长借力，人缘好、适应力强。缺点是容易被环境带着走，偶尔显得没主见。',
  丙: '丙火像太阳：热情、开朗、乐于表现，光明磊落、很有感染力。缺点是有时急躁、话说得太满。',
  丁: '丁火像烛火灯光：温暖、细腻、持久，会照顾人，心思敏感。缺点是容易多思多虑，把情绪藏在心里。',
  戊: '戊土像高山厚土：稳重、可靠、能扛事，包容心强，常是别人眼中的「定海神针」。缺点是行动偏慢、不太爱变通。',
  己: '己土像田园之土：温和、务实、善于滋养他人，做事细致有耐心。缺点是想得太多、容易操心。',
  庚: '庚金像刀剑钢铁：果断、仗义、执行力强，讲义气、敢作敢当。缺点是性子直，说话容易伤人。',
  辛: '辛金像珠玉首饰：精致、敏锐、注重品质与体面，审美和判断力都不错。缺点是自尊心强、受不得委屈。',
  壬: '壬水像江河大海：聪明、格局大、变通灵活，思路开阔、不拘小节。缺点是容易漂，兴趣太广反而难聚焦。',
  癸: '癸水像雨露泉水：细腻、敏感、洞察力强，善于观察人心，安静有内涵。缺点是容易内耗，想得多说得少。',
};

/** 五行含义速写 */
const ELEMENT_MEANING: Record<Element, string> = {
  木: '主生长、仁厚、计划与开创',
  火: '主热情、礼仪、表达与行动',
  土: '主信用、稳定、包容与承载',
  金: '主原则、决断、义气与执行',
  水: '主智慧、变通、沟通与流动',
};

/** 鲸鱼娘口吻的五行吐槽 */
const WHALE_ELEMENT_QUIP: Record<Element, string> = {
  木: '木最多的话，你大概是个爱计划、爱折腾的人，像棵一直往上长的树。',
  火: '火最多的话，你热情得像刚出锅的饭——热得快，凉得也快。',
  土: '土最多的话，你稳得本鱼都想靠着你睡一觉。',
  金: '金最多的话，你讲原则又认死理，跟本鱼的尾巴一样硬。',
  水: '水最多的话，你脑子转得快，跟本鱼游水一样灵活。',
};

/** 十神含义速写 */
const SHI_SHEN_MEANING: Record<string, string> = {
  比肩: '和你同类的力量，代表朋友、同辈、合作伙伴，也代表你自己的意志与竞争力。',
  劫财: '同类里带竞争性的力量，代表人脉与助力，也提醒注意因朋友、合伙而破财。',
  食神: '你「生出来」的力量，代表才华、口福、温和的表达与创造力，男命也代表子女。',
  伤官: '才华里更锋利的一面，代表聪明外露、创意、直率，也提醒注意言辞与规则的冲突。',
  正财: '稳定的收入与务实的财富观，代表薪水、踏实经营，男命也代表妻子。',
  偏财: '灵活的财路与人情往来，代表投资、副业、社交型财富，也代表父亲。',
  正官: '规则与责任，代表事业、职位、名誉、约束力，女命也代表丈夫。',
  七杀: '压力与挑战型的力量，代表魄力、竞争、风险与突破，能成大事也容易压力大。',
  正印: '生养你的力量，代表学历、长辈、贵人、庇护与学习能力。',
  偏印: '偏门的学习与直觉，代表专业技术、特长、独立思考，也代表思虑较重。',
};

/** 身强身弱的大白话解释 */
const STRONG_WEAK_PLAIN: Record<string, string> = {
  中和: '你的能量处在刚刚好的平衡点，性格与运势相对平稳，适应力强。',
  偏强: '你的自我能量略强于平均，主动、有主见，适合把精力投到具体的事情上。',
  身强: '你的自我能量很强，独立性突出。传统上建议多做具体的事、承担责任、表达创造，把力气用出去。',
  偏弱: '你的能量略弱于平均，适合借助他人与团队的力量，多学习来补足自己。',
  身弱: '你的能量偏弱，传统上建议多依靠贵人、长辈与团队，少单打独斗，同时注意养护身体。',
  从强: '你的日主极旺，命局形成「从强」的特殊格局，能量非常集中，顺势而为最有利。',
  从弱: '你的日主极弱，命局形成「从弱」的特殊格局，善于顺应环境、借势而行。',
};

/** 神煞含义速写 */
const SHEN_SHA_MEANING: Record<string, string> = {
  天乙贵人: '传统中最吉的贵人星，主遇难有人相助、人缘助力强。',
  天德贵人: '主心地慈善、逢凶化吉，做事容易得到谅解与扶持。',
  月德贵人: '主性情温和、有福气，遇事多能化解。',
  文昌贵人: '主聪明好学、文书考试顺利，适合走知识、文职路线。',
  禄神: '主衣食丰足、有稳定收入与福气。',
  羊刃: '主性格刚烈、行动力强，也提醒注意冲动与意外伤；身弱时反而能得它助力。',
  驿马: '主奔波、外出、变动，适合异地发展或常出差的工作。',
  桃花: '主人缘与异性缘好、有魅力，也提醒注意感情上的分寸。',
  华盖: '主聪慧、有艺术或宗教缘、喜欢独处思考，气质略显孤高。',
};

/** 评分维度的大白话解释 */
const DIMENSION_PLAIN: Record<string, string> = {
  wangShuai: '看你本人的能量是强还是弱，有没有落在「刚刚好」的平衡点上',
  wuXing: '看金木水火土五种能量是否齐全、有没有哪一行过旺或缺失',
  tiaoHou: '看你出生的季节：冬天出生宜有火取暖，夏天出生宜有水滋润',
  geJu: '看你命盘的结构组合，是否形成了传统所说的「好格局」',
  zuHe: '看八字内部有没有互相冲撞，以及是否有吉星加持',
};

/** 术语小词典 */
const GLOSSARY: Array<{ term: string; meaning: string }> = [
  { term: '四柱 / 八字', meaning: '年、月、日、时四组干支，共八个字，所以叫「八字」。' },
  { term: '天干', meaning: '甲、乙、丙、丁、戊、己、庚、辛、壬、癸，共十个。' },
  { term: '地支', meaning: '子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥，共十二个，对应十二生肖。' },
  { term: '日主', meaning: '日柱的天干，代表「你自己」，是整张命盘的参照中心。' },
  { term: '十神', meaning: '把其他字与日主的关系分成十种角色（比肩、正财、正官……），用来描述人际关系与人生主题。' },
  { term: '藏干', meaning: '地支里「藏着」的天干，表示地支内部还有更细的能量层次。' },
  { term: '纳音', meaning: '把一组干支归为一种「象」（如「海中金」），是传统的另一种分类法，参考性较强。' },
  { term: '大运', meaning: '每十年一段的运势阶段，像人生的章节。' },
  { term: '神煞', meaning: '传统命理中的吉星、凶星标签，参考性质较强，不宜单独用来下断语。' },
  { term: '旺衰', meaning: '看日主的力量偏强还是偏弱，从而决定用什么来平衡它。' },
  { term: '格局', meaning: '根据出生月份（月令）给命盘取的名字，如「正官格」「食神格」。' },
  { term: '调候', meaning: '根据出生季节看寒暖燥湿是否合适：冬天要暖、夏天要润。' },
  { term: '真太阳时', meaning: '按出生地经度修正后的当地真实太阳时间，比统一使用的北京时间更贴近当地天时。' },
  { term: '晚子时', meaning: '23:00-24:00 这个时段，不同流派对「日柱算今天还是明天」有分歧。' },
  { term: '命局层次', meaning: '本工具把传统规则量化后的综合评分，用来横向比较命局的「成色」，仅供参考。' },
];

export type BlockKey = 'rizhu' | 'wuxing' | 'shishen' | 'dayun' | 'shensha' | 'score';

export interface ExplainBlock {
  key: BlockKey;
  icon: string;
  title: string;
  body: string[];
  bullets?: string[];
  /** 鲸鱼娘的吐槽（仅人设模式下展示） */
  quip?: string;
}

export interface Explanation {
  voice: Persona;
  headline: string;
  blocks: ExplainBlock[];
  glossary: Array<{ term: string; meaning: string }>;
  /** 人设模式下的署名与收尾 */
  personaName?: string;
  personaTagline?: string;
  signoff?: string;
}

const WHALE_TITLES: Record<BlockKey, string> = {
  rizhu: '你是谁呀？本鱼先瞧瞧',
  wuxing: '你的五行配比（像不像一份菜单）',
  shishen: '你身边会出现的角色',
  dayun: '接下来的剧情章节',
  shensha: '贴在你身上的小标签',
  score: '本鱼给你打个分（别打我）',
};

function collectShiShen(chart: Chart): string[] {
  const list: string[] = [];
  chart.fourPillars.forEach((p, i) => {
    if (i !== 2 && p.shiShenGan && p.shiShenGan !== '日主') list.push(p.shiShenGan);
    if (p.shiShenZhi[0] && p.shiShenZhi[0] !== '日主') list.push(p.shiShenZhi[0]);
  });
  return list;
}

function scoreWord(n: number): string {
  if (n >= 85) return '很好';
  if (n >= 75) return '不错';
  if (n >= 63) return '一般';
  if (n >= 52) return '偏弱';
  return '较弱';
}

/** 根据命盘与评分生成面向新手的白话解读；persona='whale' 时由鲸鱼娘用本鱼的口吻解说 */
export function explainChart(chart: Chart, score: ScoreResult, persona: Persona = 'neutral'): Explanation {
  const whale = persona === 'whale';
  const pillars = chart.fourPillars.map((p) => p.ganZhi).join(' ');
  const el = chart.dayMasterElement;
  const sorted = [...score.wuxing].sort((a, b) => b.percent - a.percent);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const headline = whale
    ? `唔……让本鱼掐指算算。你生在${chart.birthDesc}，八字是「${pillars}」，其中「${chart.dayGan}」就是你本人。一句话：你是「${chart.dayGan}${el}」这一型的，命局算「${score.strongWeak}」，本鱼赏你 ${score.total} 分（${score.level}）。`
    : `你出生于${chart.birthDesc}，八字是「${pillars}」，其中「${chart.dayGan}」代表你自己。` +
      `简单说：你是一位以「${chart.dayGan}${el}」为核心特质的人，命局整体属于「${score.strongWeak}」，` +
      `综合层次 ${score.total} 分（${score.level}）。`;

  const blocks: ExplainBlock[] = [];

  // 1. 你是谁
  blocks.push({
    key: 'rizhu',
    icon: '🧬',
    title: whale ? WHALE_TITLES.rizhu : '你是谁：认识你的「日主」',
    body: whale
      ? [
          `先说最要紧的：日柱上头那个字叫「日主」，就是你本人，整张盘都围着它转。你的日主是「${chart.dayGan}」，五行属${el}。`,
          GAN_PERSONALITY[chart.dayGan] ?? '',
          `再看看你这股劲儿有多足——传统叫「旺衰」，本鱼判你「${score.strongWeak}」。${score.strongWeakDesc}`,
          STRONG_WEAK_PLAIN[score.strongWeak] ?? '',
        ].filter(Boolean)
      : [
          `八字里日柱上面那个字叫「日主」，代表「你自己」，整张命盘都以它为中心来衡量吉凶。你的日主是「${chart.dayGan}」，五行属${el}。`,
          GAN_PERSONALITY[chart.dayGan] ?? '',
          `再看你这份能量的强弱（传统叫「旺衰」）：判定为「${score.strongWeak}」。${score.strongWeakDesc}`,
          STRONG_WEAK_PLAIN[score.strongWeak] ?? '',
        ].filter(Boolean),
    quip: whale ? '这颗字要是看错了，整盘就全歪啦，本鱼可不会认错鱼。' : undefined,
  });

  // 2. 五行
  const elementBullets = sorted.map(
    (w) => `${w.element}：${w.percent}%　（${ELEMENT_MEANING[w.element]}）`,
  );
  const missing = score.wuxing.filter((w) => w.percent < 3).map((w) => w.element);
  blocks.push({
    key: 'wuxing',
    icon: '⚖️',
    title: whale ? WHALE_TITLES.wuxing : '你的五行：能量都分布在哪',
    body: whale
      ? [
          '你的八字是金木水火土五种能量凑起来的。本鱼按传统算法（天干 + 地支藏干加权）称了称，分量大概这样：',
          `最压秤的是【${strongest.element}】（${strongest.percent}%），最轻的是【${weakest.element}】（${weakest.percent}%）。`,
          missing.length
            ? `【${missing.join('、')}】几乎一点都没有，传统上说得靠后天慢慢补。`
            : '五行俱全，一样不缺，本鱼看着挺顺眼。',
        ]
      : [
          '你的八字由金木水火土五种能量组成。按传统算法（天干 + 地支藏干加权）算下来，比例大致是这样：',
          `其中【${strongest.element}】最旺（${strongest.percent}%），【${weakest.element}】最弱（${weakest.percent}%）。`,
          missing.length
            ? `命局里【${missing.join('、')}】几乎为零，传统认为这几方面的特质需要后天多留意、多补足。`
            : '五行俱全，没有明显缺失，这是比较理想的状态。',
        ],
    bullets: elementBullets,
    quip: whale ? WHALE_ELEMENT_QUIP[strongest.element] : undefined,
  });

  // 3. 十神格局
  const list = collectShiShen(chart);
  const counts = new Map<string, number>();
  for (const s of list) counts.set(s, (counts.get(s) ?? 0) + 1);
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const geJuLine = score.patterns.length ? score.patterns.join('；') : '';
  blocks.push({
    key: 'shishen',
    icon: '🎭',
    title: whale ? WHALE_TITLES.shishen : '你的十神与格局：人生里的角色关系',
    body: whale
      ? [
          '「十神」不是神仙，是把你盘里别的字跟你的关系分成十种角色——说的就是你会碰到的人、和你绕不开的主题。',
          geJuLine ? `本鱼给你取的格：${geJuLine}。` : '',
          '后面括号里的次数，是这角色在你盘里露面的次数，越多说明这主题在你人生里越常出现。',
        ].filter(Boolean)
      : [
          '「十神」是把八字里其他字和你的关系，分成十种角色。它描述的不是神仙，而是你会遇到的人、会面对的人生主题。',
          geJuLine ? `你的命盘：${geJuLine}。` : '',
          '括号里的次数表示这个角色在你命盘里出现的次数，出现越多，这个主题在你人生中越突出。',
        ].filter(Boolean),
    bullets: ranked.map(([name, n]) => `${name}（${n}次）：${SHI_SHEN_MEANING[name] ?? ''}`),
    quip: whale ? '这些人不一定真出现，但类似的事儿你会反复碰上——本鱼见得多了。' : undefined,
  });

  // 4. 大运
  const firstYun = chart.dayun[0];
  blocks.push({
    key: 'dayun',
    icon: '📅',
    title: whale ? WHALE_TITLES.dayun : '大运：人生的「章节」',
    body: whale
      ? [
          '「大运」就是剧情的分集，每十年一集，一集换一组干支，配着你的原盘一起演。',
          `你的起运时间：${chart.qiYun.desc}。`,
          firstYun
            ? `第一集是「${firstYun.ganZhi}」，大约 ${firstYun.startAge} 到 ${firstYun.endAge} 岁（${firstYun.startYear}–${firstYun.endYear} 年）。`
            : '',
        ].filter(Boolean)
      : [
          '「大运」是每十年一段的运势阶段，像人生的章节。它从「起运」那一年开始，每十年换一组干支，配合你原本的八字一起看。',
          `你的起运时间：${chart.qiYun.desc}。`,
          firstYun
            ? `你的第一段大运是「${firstYun.ganZhi}」，大约 ${firstYun.startAge} 岁到 ${firstYun.endAge} 岁（${firstYun.startYear}–${firstYun.endYear} 年）。`
            : '',
        ].filter(Boolean),
    quip: whale ? '一集十年，别指望一集就把一辈子演完。' : undefined,
  });

  // 5. 神煞
  const shenShaNames = [...new Set(score.shensha.map((s) => s.name))];
  blocks.push({
    key: 'shensha',
    icon: '✨',
    title: whale ? WHALE_TITLES.shensha : '神煞：传统贴上的小标签',
    body: whale
      ? [
          '「神煞」就是传统往你盘上贴的小标签，跟「吉星凶星」差不多。好记是好记，可参考性大于决定性，别拿一个标签给自己定性。',
        ]
      : [
          '「神煞」是传统命理给命盘贴的小标签，类似「吉星 / 凶星」。它直观好记，但参考性大于决定性，不能单凭一个神煞下结论。',
        ],
    bullets: shenShaNames.length
      ? shenShaNames.map((n) => `${n}：${SHEN_SHA_MEANING[n] ?? '传统吉凶标签之一。'}`)
      : [whale ? '你这盘挺干净，本鱼没贴到常见的小标签。' : '你的命盘没有检出常见神煞，命局相对「干净」。'],
    quip: whale ? '本鱼身上还贴着「吃白饭」的标签呢，标签这东西，笑笑就好。' : undefined,
  });

  // 6. 评分说明
  blocks.push({
    key: 'score',
    icon: '📊',
    title: whale ? WHALE_TITLES.score : '这个分数是怎么算出来的',
    body: whale
      ? [
          '最后是「命局层次」——本鱼把老规矩折算成分数，满分 100，五个维度加权。',
          `你拿了 ${score.total} 分（${score.level}）。${score.levelDesc}`,
          '说好了：这只是把老经验数值化的参考值，不是判决书。本鱼打分向来手松，别太当真。',
        ]
      : [
          '「命局层次」是本工具把传统规则量化后的综合分，满分 100 分，由五个维度加权得出：',
          `你的总分是 ${score.total} 分（${score.level}）。${score.levelDesc}`,
          '请记住：这只是把传统经验数值化的参考值，用来横向比较命局的「成色」，不是命运判决书。',
        ],
    bullets: score.dimensions.map(
      (d) => `${d.name}：${d.raw} 分（${scoreWord(d.raw)}）—— ${DIMENSION_PLAIN[d.key] ?? ''}`,
    ),
    quip: whale ? '分数高低都不耽误你明天吃饭，本鱼先吃为敬。🍚' : undefined,
  });

  return {
    voice: persona,
    headline,
    blocks,
    glossary: GLOSSARY,
    personaName: whale ? '鲸鱼娘' : undefined,
    personaTagline: whale ? '本鱼解说 · 随便听听' : undefined,
    signoff: whale
      ? '说完啦～本鱼要去干饭了。命是死的、鱼是活的，日子还得你自己过。🐋'
      : undefined,
  };
}

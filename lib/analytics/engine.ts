export type AnalyticsRow = { productId: string; product: string; corporation: string; channel: string; categoryId: string; category: string; isPortfolio: boolean; period: string; value: number };
export type RankedMetric = { name: string; value: number; share: number; growth: number | null; shareChange: number | null; rank: number };
export type CategoryMetric = RankedMetric & { id: string; portfolioValue: number; portfolioShare: number; attractiveness: number; penetrationGap: number; opportunityScore: number; growthContribution: number | null };
export type CompetitiveSignal = { categoryId:string; category:string; corporation:string; value:number; share:number; growth:number|null; shareChange:number|null; level:"High"|"Medium"|"Watch" };
export type AnalyticsResult = { latestPeriod: string; previousPeriod: string | null; yoyPeriod: string | null; totalValue: number; previousValue: number; qoq: number | null; yoy: number | null; portfolioValue: number; portfolioShare: number; trend: Array<{ period: string; value: number; portfolio: number }>; categories: CategoryMetric[]; products: RankedMetric[]; corporations: RankedMetric[]; channels: RankedMetric[]; threats:CompetitiveSignal[] };

export function periodIndex(period: string) {
  const match = period.match(/Q([1-4])[- ]?(20\d{2})/i) ?? period.match(/(20\d{2})[- ]?Q([1-4])/i);
  if (!match) return Number.MIN_SAFE_INTEGER;
  const qFirst = period.toUpperCase().startsWith("Q");
  const quarter = Number(match[qFirst ? 1 : 2]); const year = Number(match[qFirst ? 2 : 1]);
  return year * 4 + quarter;
}
const ratio = (current: number, previous?: number) => previous ? (current - previous) / previous : null;
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export function computeAnalytics(rows: AnalyticsRow[]): AnalyticsResult {
  const periods = [...new Set(rows.map((row) => row.period))].sort((a,b) => periodIndex(a) - periodIndex(b));
  if (!periods.length) throw new Error("No quarterly observations are available for analysis.");
  const latestPeriod = periods.at(-1)!; const latestIndex = periodIndex(latestPeriod);
  const previousPeriod = periods.find((period) => periodIndex(period) === latestIndex - 1) ?? null;
  const yoyPeriod = periods.find((period) => periodIndex(period) === latestIndex - 4) ?? null;
  const periodValue = (period: string | null, filter: (row: AnalyticsRow) => boolean = () => true) => period ? sum(rows.filter((row) => row.period === period && filter(row)).map((row) => row.value)) : 0;
  const totalValue = periodValue(latestPeriod); const previousValue = periodValue(previousPeriod); const yoyValue = periodValue(yoyPeriod);
  const portfolioValue = periodValue(latestPeriod, (row) => row.isPortfolio);
  const ranked = (key: "product" | "corporation" | "channel"): RankedMetric[] => {
    const names = [...new Set(rows.map((row) => row[key]).filter(Boolean))];
    return names.map((name) => {
      const current = periodValue(latestPeriod, (row) => row[key] === name); const prior = periodValue(previousPeriod, (row) => row[key] === name);
      const priorTotal = previousValue; const currentShare = totalValue ? current / totalValue : 0; const priorShare = priorTotal ? prior / priorTotal : 0;
      return { name, value: current, share: currentShare, growth: ratio(current, prior), shareChange: previousPeriod ? currentShare - priorShare : null, rank: 0 };
    }).sort((a,b) => b.value - a.value).map((item,index) => ({...item, rank:index+1}));
  };
  const categoryBase = [...new Map(rows.map((row) => [row.categoryId, row.category])).entries()].map(([id,name]) => {
    const filter = (row: AnalyticsRow) => row.categoryId === id; const current = periodValue(latestPeriod, filter); const prior = periodValue(previousPeriod, filter);
    const portfolio = periodValue(latestPeriod, (row) => filter(row) && row.isPortfolio); const share = totalValue ? current / totalValue : 0; const priorShare = previousValue ? prior / previousValue : 0;
    return { id, name, value: current, share, growth: ratio(current, prior), shareChange: previousPeriod ? share-priorShare : null, portfolioValue: portfolio, portfolioShare: current ? portfolio/current : 0, rank: 0, growthContribution: previousPeriod && totalValue !== previousValue ? (current-prior)/(totalValue-previousValue) : null };
  });
  const maxValue = Math.max(...categoryBase.map((item) => item.value), 1); const growths = categoryBase.map((item) => item.growth ?? 0); const minGrowth = Math.min(...growths); const maxGrowth = Math.max(...growths);
  const categories = categoryBase.map((item) => {
    const sizeScore = item.value / maxValue; const growthScore = maxGrowth === minGrowth ? .5 : ((item.growth ?? 0)-minGrowth)/(maxGrowth-minGrowth);
    const attractiveness = sizeScore*.4 + growthScore*.6; const penetrationGap = 1-item.portfolioShare;
    return {...item, attractiveness, penetrationGap, opportunityScore: attractiveness*penetrationGap};
  }).sort((a,b) => b.opportunityScore-a.opportunityScore).map((item,index) => ({...item,rank:index+1}));
  const threats:CompetitiveSignal[] = categories.filter((category)=>category.portfolioValue>0).flatMap((category)=> {
    const categoryRows = rows.filter((row)=>row.categoryId===category.id); const companies=[...new Set(categoryRows.filter((row)=>!row.isPortfolio).map((row)=>row.corporation))];
    const categoryCurrent=periodValue(latestPeriod,(row)=>row.categoryId===category.id); const categoryPrior=periodValue(previousPeriod,(row)=>row.categoryId===category.id);
    return companies.map((corporation)=>{ const current=periodValue(latestPeriod,(row)=>row.categoryId===category.id&&row.corporation===corporation); const prior=periodValue(previousPeriod,(row)=>row.categoryId===category.id&&row.corporation===corporation); const share=categoryCurrent?current/categoryCurrent:0; const priorShare=categoryPrior?prior/categoryPrior:0; const shareChange=previousPeriod?share-priorShare:null; const growth=ratio(current,prior); const strength=(shareChange??0)+(growth??0)*.2; return {categoryId:category.id,category:category.name,corporation,value:current,share,growth,shareChange,level:strength>.04?"High":strength>.01?"Medium":"Watch"} as CompetitiveSignal; });
  }).sort((a,b)=>(b.shareChange??-1)-(a.shareChange??-1));
  return { latestPeriod, previousPeriod, yoyPeriod, totalValue, previousValue, qoq: ratio(totalValue, previousValue), yoy: ratio(totalValue, yoyValue), portfolioValue, portfolioShare: totalValue ? portfolioValue/totalValue : 0,
    trend: periods.map((period) => ({period,value:periodValue(period),portfolio:periodValue(period,(row)=>row.isPortfolio)})), categories, products:ranked("product"), corporations:ranked("corporation"), channels:ranked("channel"), threats };
}

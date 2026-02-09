import type { Trend, TrendCategory } from '../backend';
import { Difficulty } from '../backend';

const trendCategories: TrendCategory[] = [
  { __kind__: 'music', music: null },
  { __kind__: 'challenge', challenge: null },
  { __kind__: 'format', format: null },
  { __kind__: 'topic', topic: null },
  { __kind__: 'editTechnique', editTechnique: null },
];

const trendReasons = [
  'High engagement rate across multiple platforms',
  'Rapidly growing search volume and mentions',
  'Multiple influencers adopting this trend',
  'Strong performance in your niche specifically',
  'Low competition but high potential reach',
  'Aligns perfectly with current audience interests',
  'Easy to execute with high viral potential',
  'Trending on TikTok and Instagram simultaneously',
];

function generateTrendTitle(keyword: string, category: string): string {
  const templates = {
    music: [`"${keyword}" Sound Trend`, `${keyword} Audio Challenge`, `Viral ${keyword} Music`],
    challenge: [`${keyword} Challenge`, `The ${keyword} Trend`, `${keyword} Movement`],
    format: [`${keyword} Format`, `${keyword} Style Videos`, `${keyword} Content Type`],
    topic: [`${keyword} Content`, `${keyword} Niche Trend`, `${keyword} Topic Surge`],
    editTechnique: [`${keyword} Edit Style`, `${keyword} Transition Trend`, `${keyword} Effect`],
  };

  const categoryTemplates = templates[category as keyof typeof templates] || templates.topic;
  return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
}

function generateTrendDescription(keyword: string, category: string): string {
  return `This ${category} trend around "${keyword}" is gaining massive traction. Creators are seeing 2-3x their normal engagement by jumping on this early. The trend combines ${keyword} with authentic storytelling and is resonating strongly with audiences looking for genuine content.`;
}

export function generateTrendCandidates(keywords: string[]): Trend[] {
  const trends: Trend[] = [];
  const timestamp = Date.now();
  let idCounter = 0;

  keywords.forEach((keyword) => {
    const trendCount = Math.floor(Math.random() * 2) + 2;
    
    for (let i = 0; i < trendCount; i++) {
      const category = trendCategories[Math.floor(Math.random() * trendCategories.length)];
      const categoryName = category.__kind__;
      
      const viralPotential = Math.floor(Math.random() * 3) + 7;
      const relevanceScore = Math.floor(Math.random() * 3) + 7;
      const trendScore = Math.floor((viralPotential + relevanceScore) / 2);

      trends.push({
        id: BigInt(timestamp + idCounter++),
        title: generateTrendTitle(keyword, categoryName),
        category,
        description: generateTrendDescription(keyword, categoryName),
        difficulty: Difficulty.medium,
        viralPotential: BigInt(viralPotential),
        relevanceScore: BigInt(relevanceScore),
        trendScore: BigInt(trendScore),
        analyzedHashtagPerformance: [`#${keyword}`, '#viral', '#trending', '#fyp'],
        referenceVideos: [],
        isActive: true,
        trendAlertSource: trendReasons[Math.floor(Math.random() * trendReasons.length)],
        createdAt: BigInt(timestamp * 1000000),
        lastChecked: BigInt(timestamp * 1000000),
      });
    }
  });

  return trends.sort((a, b) => Number(b.trendScore) - Number(a.trendScore));
}

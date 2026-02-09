import type { VideoHook, HookType } from '../backend';
import { Difficulty } from '../backend';

interface HookInput {
  topic: string;
  tone: string;
  categories: string[];
}

const hookTemplates: Record<string, string[]> = {
  curiosity: [
    'You will not believe what happened when I tried {topic}...',
    'The secret to {topic} that nobody talks about',
    'What they do not tell you about {topic}',
    'I discovered something crazy about {topic}',
    'This {topic} trick changed everything for me',
    'The truth about {topic} will shock you',
  ],
  contrarian: [
    'Stop doing {topic} the way everyone else does',
    'Everything you know about {topic} is wrong',
    'Why {topic} advice is actually hurting you',
    'The unpopular truth about {topic}',
    'I quit {topic} and here is what happened',
    'Why I do {topic} differently than everyone else',
  ],
  authority: [
    'After 10 years of {topic}, here is what I learned',
    'As a {topic} expert, this is what I recommend',
    'The {topic} method I use with all my clients',
    'Professional {topic} secrets revealed',
    'What pros know about {topic} that you do not',
    'The {topic} framework that gets results',
  ],
  story: [
    'My {topic} journey started with a mistake...',
    'The day {topic} changed my life forever',
    'I failed at {topic} until I learned this',
    'From zero to hero: My {topic} story',
    'The moment I realized {topic} was the answer',
    'How {topic} saved me from giving up',
  ],
  quickWin: [
    'Get better at {topic} in just 60 seconds',
    'The fastest way to improve your {topic}',
    'One simple trick for instant {topic} results',
    'Transform your {topic} in under a minute',
    'The 30-second {topic} hack you need',
    'Quick {topic} tip that works immediately',
  ],
  painPoint: [
    'Struggling with {topic}? Watch this',
    'If {topic} is not working for you, here is why',
    'The {topic} problem everyone faces (and the fix)',
    'Tired of failing at {topic}? Try this',
    'Why {topic} feels so hard (and how to fix it)',
    'The {topic} mistake that is holding you back',
  ],
};

function mapCategoryToHookType(category: string): HookType {
  const categoryMap: Record<string, HookType> = {
    curiosity: { __kind__: 'curiosity', curiosity: null },
    contrarian: { __kind__: 'contrarian', contrarian: null },
    authority: { __kind__: 'authority', authority: null },
    story: { __kind__: 'story', story: null },
    quickWin: { __kind__: 'quickWin', quickWin: null },
    painPoint: { __kind__: 'painPoint', painPoint: null },
    challenge: { __kind__: 'challenge', challenge: null },
    trend: { __kind__: 'trend', trend: null },
    shockValue: { __kind__: 'shockValue', shockValue: null },
    nostalgia: { __kind__: 'nostalgia', nostalgia: null },
  };

  return categoryMap[category] || { __kind__: 'curiosity', curiosity: null };
}

export function generateHooks(input: HookInput): VideoHook[] {
  const hooks: VideoHook[] = [];
  const timestamp = Date.now();
  let idCounter = 0;

  input.categories.forEach((category) => {
    const templates = hookTemplates[category] || hookTemplates.curiosity;
    templates.forEach((template) => {
      const content = template.replace(/{topic}/g, input.topic);
      hooks.push({
        id: BigInt(timestamp + idCounter++),
        content,
        hookType: mapCategoryToHookType(category),
        videoCategory: { __kind__: 'educational', educational: null },
        difficulty: Difficulty.medium,
        isViral: false,
        trendId: BigInt(0),
        videoId: BigInt(0),
        createdAt: BigInt(timestamp * 1000000),
      });
    });
  });

  return hooks;
}

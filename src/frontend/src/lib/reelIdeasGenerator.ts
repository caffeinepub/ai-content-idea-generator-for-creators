import type { VideoIdea, ContentStyle } from '../backend';
import { Difficulty } from '../backend';

interface ReelIdeasInput {
  niche: string;
  audience: string;
  style: string;
  length: string;
  cta: string;
}

const ideaTemplates = [
  {
    title: 'The Ultimate {niche} Mistake Everyone Makes',
    premise: 'Reveal a common mistake in {niche} and show the right way',
    beats: [
      'Hook: Stop doing this in {niche}...',
      'Show the common mistake',
      'Explain why it is wrong',
      'Demonstrate the correct approach',
      'Show the results',
      'Call to action',
    ],
    broll: 'Before/after comparisons, close-ups of technique',
    onScreen: 'Key mistake highlighted, correct method steps',
  },
  {
    title: '5 {niche} Secrets Nobody Tells You',
    premise: 'Share insider knowledge that transforms results',
    beats: [
      'Hook: Here is what pros do not tell you...',
      'Secret #1 with quick demo',
      'Secret #2 with results',
      'Secret #3 with proof',
      'Secrets #4-5 rapid fire',
      'Recap and CTA',
    ],
    broll: 'Quick cuts, text overlays, result shots',
    onScreen: 'Number each secret, key takeaways',
  },
  {
    title: 'I Tried {niche} for 30 Days - Here is What Happened',
    premise: 'Document a transformation journey with real results',
    beats: [
      'Hook: Day 1 vs Day 30...',
      'Starting point and goals',
      'Key challenges faced',
      'Breakthrough moments',
      'Final results reveal',
      'Lessons learned + CTA',
    ],
    broll: 'Progress clips, calendar transitions, result comparisons',
    onScreen: 'Day counter, progress metrics, before/after stats',
  },
  {
    title: 'The {niche} Routine That Changed Everything',
    premise: 'Break down a game-changing routine step by step',
    beats: [
      'Hook: This routine changed my {niche}...',
      'Morning/setup phase',
      'Core routine steps',
      'Key techniques explained',
      'Results after consistency',
      'How to get started + CTA',
    ],
    broll: 'Routine in action, time-lapse sequences',
    onScreen: 'Step numbers, time stamps, key tips',
  },
  {
    title: 'Why Your {niche} Is Not Working (And How to Fix It)',
    premise: 'Diagnose common problems and provide solutions',
    beats: [
      'Hook: If {niche} is not working, watch this...',
      'Problem #1 and quick fix',
      'Problem #2 and solution',
      'Problem #3 and remedy',
      'Bonus tip for faster results',
      'Summary + CTA',
    ],
    broll: 'Problem demonstrations, solution walkthroughs',
    onScreen: 'Problem/solution pairs, action steps',
  },
  {
    title: '{niche} Hacks That Actually Work',
    premise: 'Share proven shortcuts and efficiency tips',
    beats: [
      'Hook: These {niche} hacks are game-changers...',
      'Hack #1 demonstration',
      'Hack #2 with results',
      'Hack #3 step-by-step',
      'Bonus hack reveal',
      'Try these + CTA',
    ],
    broll: 'Quick demos, side-by-side comparisons',
    onScreen: 'Hack labels, time/effort saved',
  },
  {
    title: 'What I Wish I Knew Before Starting {niche}',
    premise: 'Share valuable lessons learned the hard way',
    beats: [
      'Hook: Before you start {niche}, know this...',
      'Lesson #1: Common pitfall',
      'Lesson #2: Essential foundation',
      'Lesson #3: Mindset shift',
      'Lesson #4: Resource recommendation',
      'Start smart + CTA',
    ],
    broll: 'Personal journey clips, lesson illustrations',
    onScreen: 'Lesson numbers, key quotes',
  },
  {
    title: 'The {niche} Challenge: Can You Do It?',
    premise: 'Present an engaging challenge viewers can try',
    beats: [
      'Hook: Try this {niche} challenge...',
      'Explain the challenge rules',
      'Demonstrate proper form/technique',
      'Show common mistakes to avoid',
      'Your attempt and results',
      'Challenge viewers + CTA',
    ],
    broll: 'Challenge attempts, reactions, results',
    onScreen: 'Challenge rules, timer, score/results',
  },
  {
    title: 'Beginner vs Pro: {niche} Edition',
    premise: 'Compare beginner and advanced approaches',
    beats: [
      'Hook: Beginner vs Pro in {niche}...',
      'Beginner approach shown',
      'Pro technique revealed',
      'Key differences explained',
      'How to level up',
      'Start your journey + CTA',
    ],
    broll: 'Split screen comparisons, technique close-ups',
    onScreen: 'Beginner/Pro labels, key differences',
  },
  {
    title: 'The Truth About {niche} Nobody Talks About',
    premise: 'Address misconceptions and reveal reality',
    beats: [
      'Hook: The truth about {niche}...',
      'Common myth #1 debunked',
      'Reality check with evidence',
      'Myth #2 addressed',
      'What actually works',
      'Real advice + CTA',
    ],
    broll: 'Myth vs reality visuals, proof points',
    onScreen: 'Myth/fact labels, statistics',
  },
  {
    title: '{niche} Transformation in 60 Seconds',
    premise: 'Show a quick transformation or result',
    beats: [
      'Hook: Watch this {niche} transformation...',
      'Starting point shown',
      'Key steps in fast motion',
      'Technique highlights',
      'Final result reveal',
      'Learn more + CTA',
    ],
    broll: 'Time-lapse, before/after, process shots',
    onScreen: 'Progress indicators, key steps',
  },
  {
    title: 'Stop Wasting Money on {niche} - Do This Instead',
    premise: 'Offer cost-effective alternatives and smart choices',
    beats: [
      'Hook: Save money on {niche}...',
      'Expensive option shown',
      'Budget-friendly alternative',
      'Quality comparison',
      'Money saved calculation',
      'Smart shopping tips + CTA',
    ],
    broll: 'Product comparisons, price tags, results',
    onScreen: 'Price comparisons, savings amount',
  },
];

function mapStyleToContentStyle(style: string): ContentStyle {
  const styleMap: Record<string, ContentStyle> = {
    talkingHead: { __kind__: 'talkingHead', talkingHead: null },
    bRoll: { __kind__: 'bRoll', bRoll: null },
    voiceover: { __kind__: 'voiceover', voiceover: null },
    skit: { __kind__: 'skit', skit: null },
    tutorial: { __kind__: 'other', other: 'tutorial' },
    animation: { __kind__: 'animation', animation: null },
    interview: { __kind__: 'interview', interview: null },
    meme: { __kind__: 'meme', meme: null },
    comparison: { __kind__: 'comparison', comparison: null },
    review: { __kind__: 'review', review: null },
    caseStudy: { __kind__: 'caseStudy', caseStudy: null },
    qna: { __kind__: 'qna', qna: null },
  };

  return styleMap[style] || { __kind__: 'talkingHead', talkingHead: null };
}

export function generateReelIdeas(input: ReelIdeasInput): VideoIdea[] {
  const ideas: VideoIdea[] = [];
  const timestamp = Date.now();

  ideaTemplates.forEach((template, index) => {
    const title = template.title.replace(/{niche}/g, input.niche);
    const premise = template.premise.replace(/{niche}/g, input.niche);
    const beats = template.beats.map((beat) => beat.replace(/{niche}/g, input.niche));

    const ctaSuffix = input.cta ? `\n\n${input.cta}` : '';

    ideas.push({
      id: BigInt(timestamp + index),
      title,
      objectives: premise,
      insights: beats,
      editingTips: `${template.broll}. On-screen text: ${template.onScreen}. Use ${input.style} style with dynamic cuts every 2-3 seconds. Add trending audio and captions.`,
      trendId: BigInt(0),
      referenceVideos: [],
      hookType: { __kind__: 'curiosity', curiosity: null },
      contentType: { __kind__: 'educational', educational: null },
      contentStyle: mapStyleToContentStyle(input.style),
      length: input.length,
      complexity: Difficulty.medium,
      suggestedCaptions: [`${title}${ctaSuffix}`],
      adReadPotential: false,
      createdAt: BigInt(timestamp * 1000000),
      lastEdited: BigInt(timestamp * 1000000),
    });
  });

  return ideas;
}

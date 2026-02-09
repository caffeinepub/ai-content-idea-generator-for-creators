import type { StoryIdea } from '../backend';

interface CaptionInput {
  idea: string;
  keywords: string;
  emojiDensity: string;
  includeHashtags: boolean;
}

const emojiSets = {
  none: [],
  low: ['✨', '💡', '🎯'],
  medium: ['✨', '💡', '🎯', '🔥', '💪', '👀', '🚀'],
  high: ['✨', '💡', '🎯', '🔥', '💪', '👀', '🚀', '⚡', '💯', '🌟', '❤️', '👇'],
};

const captionStyles = [
  { name: 'Value-focused', prefix: 'Here is what you need to know:', suffix: 'Save this for later!' },
  { name: 'Storytelling', prefix: 'Let me tell you something...', suffix: 'What do you think?' },
  { name: 'Question-based', prefix: 'Ever wondered why...', suffix: 'Drop a comment below!' },
  { name: 'Direct', prefix: '', suffix: 'Follow for more tips!' },
  { name: 'Relatable', prefix: 'Can we talk about...', suffix: 'Tag someone who needs this!' },
  { name: 'Educational', prefix: 'Quick lesson:', suffix: 'Share this with your friends!' },
  { name: 'Motivational', prefix: 'Remember this:', suffix: 'You got this!' },
  { name: 'Conversational', prefix: 'Real talk:', suffix: 'Let us discuss in the comments!' },
  { name: 'Listicle', prefix: 'Here are the key points:', suffix: 'Which one resonates with you?' },
  { name: 'Behind-the-scenes', prefix: 'Here is the truth:', suffix: 'More coming soon!' },
];

function getRandomEmojis(density: string, count: number): string[] {
  const emojis = emojiSets[density as keyof typeof emojiSets] || [];
  if (emojis.length === 0) return [];
  
  const selected: string[] = [];
  for (let i = 0; i < count; i++) {
    selected.push(emojis[Math.floor(Math.random() * emojis.length)]);
  }
  return selected;
}

function generateHashtags(idea: string, keywords: string): string {
  const words = [...idea.toLowerCase().split(' '), ...keywords.toLowerCase().split(',')];
  const hashtags = words
    .filter((w) => w.length > 3)
    .slice(0, 5)
    .map((w) => `#${w.trim().replace(/[^a-z0-9]/g, '')}`);
  
  return '\n\n' + hashtags.join(' ') + ' #viral #trending #fyp';
}

export function generateCaptions(input: CaptionInput): StoryIdea[] {
  const captions: StoryIdea[] = [];
  const timestamp = Date.now();
  const emojiCount = input.emojiDensity === 'high' ? 4 : input.emojiDensity === 'medium' ? 2 : 1;

  captionStyles.forEach((style, index) => {
    const emojis = getRandomEmojis(input.emojiDensity, emojiCount);
    const emojiPrefix = emojis.length > 0 ? emojis.slice(0, Math.ceil(emojis.length / 2)).join(' ') + ' ' : '';
    const emojiSuffix = emojis.length > 0 ? ' ' + emojis.slice(Math.ceil(emojis.length / 2)).join(' ') : '';
    
    let captionText = '';
    if (style.prefix) {
      captionText = `${emojiPrefix}${style.prefix}\n\n${input.idea}${emojiSuffix}\n\n${style.suffix}`;
    } else {
      captionText = `${emojiPrefix}${input.idea}${emojiSuffix}\n\n${style.suffix}`;
    }

    const hashtags = input.includeHashtags ? generateHashtags(input.idea, input.keywords) : '';

    captions.push({
      id: BigInt(timestamp + index),
      mainText: captionText + hashtags,
      supportingPoints: [],
      endGoal: 'Engagement',
      deliveryStyle: { __kind__: 'talkingHead', talkingHead: null },
      audience: 'General',
      hookId: BigInt(0),
      trendId: BigInt(0),
      videoId: BigInt(0),
      isViral: false,
      createdAt: BigInt(timestamp * 1000000),
    });
  });

  return captions.slice(0, 10);
}

interface ScriptInput {
  topic: string;
  objective: string;
}

interface ScriptResult {
  hook: string;
  setup: string;
  payoff: string;
  cta: string;
  editingSuggestions: string[];
}

const hookTemplates = [
  'Stop scrolling! You need to hear this about {topic}...',
  'If you\'re struggling with {topic}, this will change everything.',
  'The secret to {topic} that nobody talks about.',
  'Watch this before you try {topic} again.',
  'This {topic} mistake is costing you big time.',
];

const editingSuggestions = [
  'Use jump cuts every 2-3 seconds to maintain energy and pace',
  'Add captions throughout - 90% of viewers watch without sound',
  'Include B-roll footage during the setup and payoff sections',
  'Use trending audio at low volume underneath your voice',
  'Add text overlays to emphasize key points and numbers',
  'Include a visual hook in the first frame (before/after, shocking stat)',
  'Use zoom-ins on your face during important moments',
  'Add sound effects for transitions and emphasis points',
  'Keep the frame tight - close-up shots perform better',
  'End with a freeze frame and text CTA for 2 seconds',
];

export function generateScript(input: ScriptInput): ScriptResult {
  const hook = hookTemplates[Math.floor(Math.random() * hookTemplates.length)].replace(
    /{topic}/g,
    input.topic
  );

  const setup = `Let me break this down for you. When it comes to ${input.topic}, most people make the same mistakes. They think they need to [common misconception], but that's actually holding them back.

Here's what actually works: [Key insight #1]. This is crucial because it sets the foundation for everything else.

Then, you need to understand [Key insight #2]. This is where most people give up, but if you stick with it, you'll see results.`;

  const payoff = `Now here's the game-changer: [Main revelation about ${input.topic}]. When I discovered this, everything clicked into place.

The results? [Specific outcome or benefit]. And the best part? You can start seeing these results in just [timeframe].

Remember: ${input.objective || 'consistency is key'}. Don't expect overnight success, but trust the process.`;

  const cta = `If you found this helpful, save this video and share it with someone who needs to hear it. Follow for more tips on ${input.topic}, and drop a comment if you have questions. Let's grow together!`;

  return {
    hook,
    setup,
    payoff,
    cta,
    editingSuggestions,
  };
}

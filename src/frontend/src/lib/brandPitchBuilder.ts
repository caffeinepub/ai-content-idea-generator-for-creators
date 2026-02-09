import type { UserProfile } from '../backend';

interface PitchInput {
  brandName: string;
  product: string;
  collaborationType: string;
  desiredOutcome: string;
}

interface GeneratedPitch {
  shortPitchDM: string;
  emailPitch: string;
  followUpMessages: string[];
}

export function generateBrandPitch(
  input: PitchInput,
  userProfile?: UserProfile
): GeneratedPitch {
  const { brandName, product, collaborationType, desiredOutcome } = input;

  const creatorName = userProfile?.name || 'Creator';
  const niche = userProfile?.niche || 'content creation';
  const audience = userProfile?.targetAudience || 'engaged audience';

  // DM Pitch (short and direct)
  const shortPitchDM = `Hi ${brandName} team! 👋

I'm ${creatorName}, a ${niche} creator with a highly ${audience}.

I'd love to collaborate on ${product} through ${collaborationType}. ${desiredOutcome}

Would you be open to discussing this? I can send over my media kit and past campaign results.

Looking forward to hearing from you!`;

  // Email Pitch (more detailed)
  const emailPitch = `Subject: Collaboration Opportunity: ${product}

Hi ${brandName} Team,

My name is ${creatorName}, and I'm a ${niche} content creator passionate about creating authentic, engaging content for my ${audience}.

I've been following ${brandName} and absolutely love ${product}. I believe there's a great opportunity for us to collaborate through ${collaborationType}.

What I'm proposing:
${desiredOutcome}

Why this partnership makes sense:
• My audience aligns perfectly with your target demographic
• I have a proven track record of creating high-performing content
• I'm genuinely passionate about ${product} and would create authentic content

I'd love to discuss how we can work together to create something amazing. I'm happy to share my media kit, past campaign results, and content samples.

Are you available for a quick call this week to explore this opportunity?

Best regards,
${creatorName}`;

  // Follow-up messages
  const followUpMessages = [
    `Hi ${brandName} team,

Just wanted to follow up on my previous message about collaborating on ${product}.

I have some creative ideas I'd love to share with you. Would you be interested in hearing more?

Thanks!
${creatorName}`,

    `Hi again,

I wanted to reach out one more time about the ${collaborationType} opportunity for ${product}.

I understand you're probably busy, but I'm really excited about the potential of this collaboration. If now isn't the right time, I'd love to stay in touch for future opportunities.

Let me know if you'd like to connect!

Best,
${creatorName}`,

    `Hi ${brandName},

I hope this message finds you well! I'm still very interested in collaborating with you on ${product}.

I've been creating some amazing content in the ${niche} space and would love to bring that energy to a partnership with ${brandName}.

If you're interested, I'm happy to work around your timeline and requirements.

Looking forward to hearing from you!
${creatorName}`,
  ];

  return {
    shortPitchDM,
    emailPitch,
    followUpMessages,
  };
}

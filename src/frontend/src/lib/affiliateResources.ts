export interface AffiliateResource {
  name: string;
  description: string;
  url: string;
  category: 'tools' | 'education' | 'services' | 'products';
}

export const affiliateResources: AffiliateResource[] = [
  {
    name: 'Canva Pro',
    description: 'Professional design tool for creating stunning social media graphics, videos, and presentations.',
    url: 'https://www.canva.com/pro/',
    category: 'tools',
  },
  {
    name: 'Epidemic Sound',
    description: 'Royalty-free music and sound effects library for content creators with unlimited downloads.',
    url: 'https://www.epidemicsound.com/',
    category: 'tools',
  },
  {
    name: 'TubeBuddy',
    description: 'YouTube optimization and management tool to grow your channel faster with analytics and SEO.',
    url: 'https://www.tubebuddy.com/',
    category: 'tools',
  },
  {
    name: 'Skillshare',
    description: 'Online learning platform with thousands of classes on content creation, marketing, and business.',
    url: 'https://www.skillshare.com/',
    category: 'education',
  },
  {
    name: 'ConvertKit',
    description: 'Email marketing platform designed for creators to build and monetize their audience.',
    url: 'https://convertkit.com/',
    category: 'services',
  },
  {
    name: 'Riverside.fm',
    description: 'High-quality podcast and video recording platform with studio-quality audio and 4K video.',
    url: 'https://riverside.fm/',
    category: 'tools',
  },
];

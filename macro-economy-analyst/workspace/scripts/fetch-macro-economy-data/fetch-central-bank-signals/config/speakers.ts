export interface SpeakerConfig {
  slug: string;
  name: string;
  role: string;
  tier: 1 | 2 | 3 | 4;
  weight: number;
  institution?: string;
}

export const SPEAKERS: Record<string, SpeakerConfig> = {
  powell: {
    slug: 'powell',
    name: 'Jerome H. Powell',
    role: 'Chair',
    tier: 1,
    weight: 1.0,
    institution: 'Board of Governors',
  },
  barr: {
    slug: 'barr',
    name: 'Michael S. Barr',
    role: 'Vice Chair for Supervision',
    tier: 2,
    weight: 0.8,
    institution: 'Board of Governors',
  },
  jefferson: {
    slug: 'jefferson',
    name: 'Philip N. Jefferson',
    role: 'Vice Chair',
    tier: 2,
    weight: 0.8,
    institution: 'Board of Governors',
  },
  williams: {
    slug: 'williams',
    name: 'John C. Williams',
    role: 'President',
    tier: 2,
    weight: 0.75,
    institution: 'Federal Reserve Bank of New York',
  },
  bowman: {
    slug: 'bowman',
    name: 'Michelle W. Bowman',
    role: 'Governor',
    tier: 3,
    weight: 0.6,
    institution: 'Board of Governors',
  },
  cook: {
    slug: 'cook',
    name: 'Lisa D. Cook',
    role: 'Governor',
    tier: 3,
    weight: 0.6,
    institution: 'Board of Governors',
  },
  waller: {
    slug: 'waller',
    name: 'Christopher J. Waller',
    role: 'Governor',
    tier: 3,
    weight: 0.6,
    institution: 'Board of Governors',
  },
  kugler: {
    slug: 'kugler',
    name: 'Adriana D. Kugler',
    role: 'Governor',
    tier: 3,
    weight: 0.6,
    institution: 'Board of Governors',
  },
  miran: {
    slug: 'miran',
    name: 'Stephen Miran',
    role: 'Governor',
    tier: 3,
    weight: 0.6,
    institution: 'Board of Governors',
  },
  bostic: {
    slug: 'bostic',
    name: 'Raphael W. Bostic',
    role: 'President',
    tier: 4,
    weight: 0.4,
    institution: 'Federal Reserve Bank of Atlanta',
  },
  barkin: {
    slug: 'barkin',
    name: 'Thomas I. Barkin',
    role: 'President',
    tier: 4,
    weight: 0.4,
    institution: 'Federal Reserve Bank of Richmond',
  },
  collins: {
    slug: 'collins',
    name: 'Susan M. Collins',
    role: 'President',
    tier: 4,
    weight: 0.4,
    institution: 'Federal Reserve Bank of Boston',
  },
  daly: {
    slug: 'daly',
    name: 'Mary C. Daly',
    role: 'President',
    tier: 4,
    weight: 0.4,
    institution: 'Federal Reserve Bank of San Francisco',
  },
  harker: {
    slug: 'harker',
    name: 'Patrick T. Harker',
    role: 'President',
    tier: 4,
    weight: 0.4,
    institution: 'Federal Reserve Bank of Philadelphia',
  },
  kashkari: {
    slug: 'kashkari',
    name: 'Neel Kashkari',
    role: 'President',
    tier: 4,
    weight: 0.4,
    institution: 'Federal Reserve Bank of Minneapolis',
  },
  logan: {
    slug: 'logan',
    name: 'Lorie K. Logan',
    role: 'President',
    tier: 4,
    weight: 0.4,
    institution: 'Federal Reserve Bank of Dallas',
  },
  mester: {
    slug: 'mester',
    name: 'Loretta J. Mester',
    role: 'President',
    tier: 4,
    weight: 0.4,
    institution: 'Federal Reserve Bank of Cleveland',
  },
  musalem: {
    slug: 'musalem',
    name: 'Alberto Musalem',
    role: 'President',
    tier: 4,
    weight: 0.4,
    institution: 'Federal Reserve Bank of St. Louis',
  },
  schmid: {
    slug: 'schmid',
    name: 'Jeffrey R. Schmid',
    role: 'President',
    tier: 4,
    weight: 0.4,
    institution: 'Federal Reserve Bank of Kansas City',
  },
};

export function getSpeakerBySlug(slug: string): SpeakerConfig | undefined {
  return SPEAKERS[slug.toLowerCase()];
}

export function extractSpeakerSlugFromUrl(url: string): string | null {
  const match = url.match(/\/([a-z]+)\d{8}[a-z]?\.htm$/i);
  return match ? match[1].toLowerCase() : null;
}

export function extractSpeakerSlugFromTitle(title: string): string | null {
  const firstPart = title.split(',')[0]?.trim().toLowerCase();
  if (!firstPart) return null;
  
  for (const [slug, config] of Object.entries(SPEAKERS)) {
    if (config.name.toLowerCase().includes(firstPart) || slug === firstPart) {
      return slug;
    }
  }
  return null;
}

export interface Speaker {
  slug: string;
  name: string;
  role: string;
  tier: 1 | 2 | 3 | 4;
  weight: number;
  institution?: string;
}

export type CommunicationType = 'speech' | 'statement' | 'testimony';

export interface Communication {
  id: string;
  type: CommunicationType;
  date: string;
  speaker?: Speaker;
  title: string;
  venue?: string;
  sourceUrl: string;
  content: string;
}

export interface ProjectionVariable {
  median: Record<string, number | null>;
  centralTendency: Record<string, string>;
  range: Record<string, string>;
  previousMedian?: Record<string, number | null>;
  previousCentralTendency?: Record<string, string>;
  previousRange?: Record<string, string>;
}

export interface FomcProjection {
  id: string;
  date: string;
  sourceUrl: string;
  gdp: ProjectionVariable;
  unemployment: ProjectionVariable;
  pceInflation: ProjectionVariable;
  corePceInflation: ProjectionVariable;
  federalFundsRate: ProjectionVariable;
}

export interface FedSignalsOutput {
  fetchedAt: string;
  period: {
    start: string;
    end: string;
  };
  communications: Communication[];
  projections: FomcProjection[];
  summary: {
    totalCommunications: number;
    totalProjections: number;
    bySpeaker: Record<string, number>;
    byType: Record<string, number>;
  };
}

export interface CliOptions {
  startDate?: string;
  endDate?: string;
  outputDir?: string;
}

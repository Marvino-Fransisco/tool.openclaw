import * as path from 'path';
import * as fs from 'fs';
import { Communication, FomcProjection } from './types';
import { getDateRange, formatDate } from './utils';
import { fetchSpeeches, fetchTestimony } from './fetchers/rss-feed';
import { fetchFomcStatementUrls } from './fetchers/fomc-calendar';
import { fetchAllSpeechContent } from './fetchers/speech-content';
import { fetchAllStatementContent } from './fetchers/statement-content';
import { fetchAllProjections } from './fetchers/fomc-projections';
import logger from '../logger';

const SCRIPT_NAME = 'Fed Signals Fetcher';

interface FedSignalsOutput {
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

export async function main(): Promise<void> {
  logger.start(SCRIPT_NAME);
  logger.functionCall('main');
  
  const dateRange = getDateRange();
  logger.info('DATE_RANGE', `${formatDate(dateRange.start)} to ${formatDate(dateRange.end)}`);
  
  const [speeches, testimony, statements] = await Promise.all([
    fetchSpeeches(dateRange.start, dateRange.end),
    fetchTestimony(dateRange.start, dateRange.end),
    fetchFomcStatementUrls(dateRange.start, dateRange.end),
  ]);
  
  const totalItems = speeches.length + testimony.length + statements.length;
  logger.info('ITEMS_FOUND', `${speeches.length} speeches, ${testimony.length} testimony, ${statements.length} statements`);
  
  const communications: Communication[] = [];
  
  if (totalItems > 0) {
    const speechAndTestimonyItems = [...speeches, ...testimony].filter(
      item => item.sourceUrl && item.id
    ) as Array<{ sourceUrl: string; id: string }>;
    
    const statementItems = statements.filter(
      item => item.sourceUrl && item.id
    ) as Array<{ sourceUrl: string; id: string }>;
    
    logger.info('CONTENT_FETCH', `Fetching content for ${speechAndTestimonyItems.length} speeches/testimony and ${statementItems.length} statements`);
    
    const [speechContents, statementContents] = await Promise.all([
      speechAndTestimonyItems.length > 0 
        ? fetchAllSpeechContent(speechAndTestimonyItems)
        : Promise.resolve(new Map()),
      statementItems.length > 0
        ? fetchAllStatementContent(statementItems)
        : Promise.resolve(new Map()),
    ]);
    
    const allItems = [...speeches, ...testimony, ...statements];
    
    for (const item of allItems) {
      if (!item.id || !item.sourceUrl) continue;
      
      const isStatement = item.type === 'statement';
      const content = isStatement 
        ? statementContents.get(item.id) 
        : speechContents.get(item.id);
      
      communications.push({
        id: item.id,
        type: item.type!,
        date: item.date!,
        speaker: item.speaker,
        title: item.title || 'Untitled',
        venue: item.venue,
        sourceUrl: item.sourceUrl,
        content: content || '',
      });
    }
    
    communications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  logger.info('PROJECTION_FETCH', 'Fetching FOMC projections');
  const projections = await fetchAllProjections(dateRange.start, dateRange.end);
  
  const summary = {
    totalCommunications: communications.length,
    totalProjections: projections.length,
    bySpeaker: {} as Record<string, number>,
    byType: {
      speech: 0,
      statement: 0,
      testimony: 0,
    },
  };
  
  for (const comm of communications) {
    if (comm.speaker) {
      summary.bySpeaker[comm.speaker.slug] = (summary.bySpeaker[comm.speaker.slug] || 0) + 1;
    } else {
      summary.bySpeaker['unknown'] = (summary.bySpeaker['unknown'] || 0) + 1;
    }
    summary.byType[comm.type]++;
  }
  
  const output: FedSignalsOutput = {
    fetchedAt: new Date().toISOString(),
    period: {
      start: formatDate(dateRange.start),
      end: formatDate(dateRange.end),
    },
    communications,
    projections,
    summary,
  };
  
  const outputDir = '/home/node/.openclaw/shared/data/raw';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    logger.info('DIR_CREATED', outputDir);
  }
  
  const filename = 'central-bank-signals.json';
  const outputPath = path.join(outputDir, filename);
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  logger.dataSaved(outputPath);
  
  logger.info('SUMMARY', `${summary.totalCommunications} communications, ${summary.totalProjections} projections`);
  logger.end(SCRIPT_NAME, true);
}

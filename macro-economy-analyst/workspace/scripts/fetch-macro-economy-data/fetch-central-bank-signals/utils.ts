import * as path from 'path';
import * as fs from 'fs';
import logger from '../logger';

export function getDateRange(
  startDate?: string,
  endDate?: string
): { start: Date; end: Date } {
  logger.functionCall('getDateRange');
  
  const now = new Date();
  
  if (startDate && endDate) {
    return {
      start: new Date(startDate),
      end: new Date(endDate),
    };
  }
  
  return {
    start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
    end: now,
  };
}

export function parseRssDate(dateStr: string): Date {
  const cleaned = dateStr.replace(/\s*GMT\s*$/, ' GMT');
  return new Date(cleaned);
}

export function extractDateFromUrl(url: string): string | null {
  const match = url.match(/(\d{4})(\d{2})(\d{2})[a-z]?\.htm$/i);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return null;
}

export function generateId(url: string): string {
  const match = url.match(/\/([a-z]+\d{8}[a-z]?)\.htm$/i);
  return match ? match[1].toLowerCase() : url.split('/').pop()?.replace('.htm', '') || 'unknown';
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function ensureOutputDir(baseDir: string): string {
  logger.functionCall('ensureOutputDir');
  
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
    logger.info('DIR_CREATED', baseDir);
  }
  return baseDir;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isWithinDateRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

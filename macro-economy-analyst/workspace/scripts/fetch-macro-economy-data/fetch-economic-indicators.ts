import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import logger from './logger';

dotenv.config();

const SCRIPT_NAME = 'Economic Indicators Fetcher';
const DAYS_LOOKBACK = 90;

function getDate90DaysAgo(): string {
  const date = new Date();
  date.setDate(date.getDate() - DAYS_LOOKBACK);
  return date.toISOString().split('T')[0];
}
const FRED_API_BASE = 'https://api.stlouisfed.org/fred/series/observations';
const FRED_API_KEY = process.env.FRED_API_KEY;

interface SeriesConfig {
  id: string;
  name: string;
  category: string;
}

interface Observation {
  date: string;
  value: string;
}

interface SeriesData {
  series_id: string;
  series_name: string;
  category: string;
  units: string;
  frequency: string;
  observations: Observation[];
}

interface CombinedOutput {
  fetchedAt: string;
  totalSeries: number;
  indicators: Record<string, SeriesData>;
}

const ECONOMIC_INDICATORS: SeriesConfig[] = [
  { id: 'CPIAUCSL', name: 'Consumer Price Index for All Urban Consumers: All Items', category: 'CPI' },
  { id: 'CPILFESL', name: 'Consumer Price Index for All Urban Consumers: All Items Less Food & Energy', category: 'CPI' },
  { id: 'GDP', name: 'Gross Domestic Product', category: 'GDP' },
  { id: 'GDPC1', name: 'Real Gross Domestic Product', category: 'GDP' },
  { id: 'PAYEMS', name: 'All Employees, Total Nonfarm', category: 'Employment' },
  { id: 'UNRATE', name: 'Civilian Unemployment Rate', category: 'Employment' },
  { id: 'AHETPI', name: 'Average Hourly Earnings of Production and Nonsupervisory Employees', category: 'Employment' },
  { id: 'RSXFS', name: 'Retail Sales: Retail and Food Services, Excluding Motor Vehicle and Parts', category: 'RetailSales' },
  { id: 'RSAFS', name: 'Retail Sales: Retail and Food Services', category: 'RetailSales' },
];

async function fetchSeriesObservations(seriesId: string): Promise<{ observations: Observation[]; info: { units: string; frequency: string } }> {
  logger.functionCall('fetchSeriesObservations', seriesId);
  
  const url = `${FRED_API_BASE}`;
  const params = {
    series_id: seriesId,
    api_key: FRED_API_KEY,
    file_type: 'json',
    observation_start: getDate90DaysAgo(),
    sort_order: 'desc',
    limit: 1000,
  };

  try {
    logger.apiRequest(`${FRED_API_BASE}?series_id=${seriesId}`);
    const response = await axios.get(url, { params });
    
    const observations: Observation[] = response.data.observations.map((obs: any) => ({
      date: obs.date,
      value: obs.value,
    }));

    logger.apiResponse(`${FRED_API_BASE}?series_id=${seriesId}`, '200 OK');
    logger.dataFetched(seriesId, observations.length);

    return {
      observations,
      info: {
        units: response.data.units || 'Unknown',
        frequency: 'As reported',
      },
    };
  } catch (error: any) {
    const errorMsg = error.response 
      ? `${error.response.status} - ${error.response.data?.error_message || error.message}`
      : error.message;
    logger.error('FETCH_ERROR', `Error fetching ${seriesId}: ${errorMsg}`);
    throw error;
  }
}

async function fetchAllIndicators(): Promise<CombinedOutput> {
  logger.functionCall('fetchAllIndicators');
  logger.info('BATCH_START', `Fetching ${ECONOMIC_INDICATORS.length} economic indicators from FRED`);
  
  const results: Record<string, SeriesData> = {};
  let successCount = 0;
  let failCount = 0;

  for (const indicator of ECONOMIC_INDICATORS) {
    logger.info('SERIES_START', `Fetching ${indicator.id} (${indicator.category})`);
    
    try {
      const { observations, info } = await fetchSeriesObservations(indicator.id);
      
      results[indicator.id] = {
        series_id: indicator.id,
        series_name: indicator.name,
        category: indicator.category,
        units: info.units,
        frequency: info.frequency,
        observations,
      };
      
      successCount++;
    } catch (error) {
      logger.warn('SERIES_SKIP', `${indicator.id}: Failed to fetch`);
      failCount++;
    }
  }

  logger.info('BATCH_SUMMARY', `Summary: ${successCount} succeeded, ${failCount} failed`);

  return {
    fetchedAt: new Date().toISOString(),
    totalSeries: Object.keys(results).length,
    indicators: results,
  };
}

function saveOutput(data: CombinedOutput): string {
  logger.functionCall('saveOutput');
  
  const outputDir = path.join(process.cwd(), '../shared/data/raw');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    logger.info('DIR_CREATED', outputDir);
  }

  const filename = 'economic-indicators.json';
  const filepath = path.join(outputDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  logger.dataSaved(filepath);
  
  return filepath;
}

export async function main(): Promise<void> {
  logger.start(SCRIPT_NAME);
  
  if (!FRED_API_KEY) {
    logger.error('CONFIG_ERROR', 'FRED_API_KEY not found in environment variables');
    process.exit(1);
  }
  
  try {
    const data = await fetchAllIndicators();
    const outputPath = saveOutput(data);
    
    logger.info('COMPLETE', `Total series: ${data.totalSeries}`);
    logger.end(SCRIPT_NAME, true);
  } catch (error: any) {
    logger.error('FATAL_ERROR', error.message);
    logger.end(SCRIPT_NAME, false);
    process.exit(1);
  }
}

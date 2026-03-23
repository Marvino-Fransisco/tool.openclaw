import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import logger from './logger';

dotenv.config();

const SCRIPT_NAME = 'Fixed Income Fetcher';
const FRED_API_BASE = 'https://api.stlouisfed.org/fred/series/observations';
const API_KEY = process.env.FRED_API_KEY;
const DAYS_LOOKBACK = 90;

function getDate90DaysAgo(): string {
  const date = new Date();
  date.setDate(date.getDate() - DAYS_LOOKBACK);
  return date.toISOString().split('T')[0];
}

interface SeriesConfig {
  id: string;
  name: string;
  category: 'GovernmentBonds' | 'YieldCurve' | 'CreditSpreads';
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

interface CalculatedSpread {
  name: string;
  description: string;
  observations: Observation[];
}

interface CombinedOutput {
  fetchedAt: string;
  totalSeries: number;
  fixedIncome: {
    governmentBonds: Record<string, SeriesData>;
    yieldCurve: Record<string, SeriesData>;
    creditSpreads: Record<string, SeriesData>;
    calculatedSpreads: CalculatedSpread[];
  };
}

const FIXED_INCOME_SERIES: SeriesConfig[] = [
  { id: 'DGS3MO', name: '3-Month Treasury Bill Secondary Market Rate', category: 'GovernmentBonds' },
  { id: 'DGS6MO', name: '6-Month Treasury Bill Secondary Market Rate', category: 'GovernmentBonds' },
  { id: 'DGS1', name: '1-Year Treasury Yield', category: 'GovernmentBonds' },
  { id: 'DGS2', name: '2-Year Treasury Yield', category: 'GovernmentBonds' },
  { id: 'DGS5', name: '5-Year Treasury Yield', category: 'GovernmentBonds' },
  { id: 'DGS7', name: '7-Year Treasury Yield', category: 'GovernmentBonds' },
  { id: 'DGS10', name: '10-Year Treasury Yield', category: 'GovernmentBonds' },
  { id: 'DGS20', name: '20-Year Treasury Yield', category: 'GovernmentBonds' },
  { id: 'DGS30', name: '30-Year Treasury Yield', category: 'GovernmentBonds' },

  { id: 'T10Y2Y', name: '10-Year Treasury Minus 2-Year Treasury', category: 'YieldCurve' },
  { id: 'T10Y3M', name: '10-Year Treasury Minus 3-Month Treasury', category: 'YieldCurve' },
  { id: 'T10YIE', name: '10-Year Breakeven Inflation Rate', category: 'YieldCurve' },
  { id: 'T5YIE', name: '5-Year Breakeven Inflation Rate', category: 'YieldCurve' },

  { id: 'BAMLC0A0CM', name: 'ICE BofA US Corporate Master OAS', category: 'CreditSpreads' },
  { id: 'BAMLC0A1CAAA', name: 'ICE BofA US Corporate AAA OAS', category: 'CreditSpreads' },
  { id: 'BAMLC0A3CA', name: 'ICE BofA US Corporate BBB OAS', category: 'CreditSpreads' },
  { id: 'BAMLH0A0HYM2', name: 'ICE BofA US High Yield Master II OAS', category: 'CreditSpreads' },
  { id: 'BAMLH0A1HYBB', name: 'ICE BofA US High Yield BB OAS', category: 'CreditSpreads' },
  { id: 'BAMLH0A2HYB', name: 'ICE BofA US High Yield B OAS', category: 'CreditSpreads' },
  { id: 'DBAA', name: 'Moodys BAA Corporate Bond Yield', category: 'CreditSpreads' },
  { id: 'DAAA', name: 'Moodys AAA Corporate Bond Yield', category: 'CreditSpreads' },
  { id: 'DPRIME', name: 'Bank Prime Loan Rate', category: 'CreditSpreads' },
];

async function fetchSeriesObservations(seriesId: string): Promise<{ observations: Observation[]; info: { units: string; frequency: string } }> {
  logger.functionCall('fetchSeriesObservations', seriesId);
  
  const url = `${FRED_API_BASE}`;
  const params = {
    series_id: seriesId,
    api_key: API_KEY,
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
        units: response.data.units || 'Percent',
        frequency: 'Daily',
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

function calculateBAAvs10YSpread(
  baaData: SeriesData | undefined,
  treasury10Y: SeriesData | undefined
): CalculatedSpread | null {
  logger.functionCall('calculateBAAvs10YSpread');
  
  if (!baaData || !treasury10Y) {
    logger.warn('SPREAD_SKIP', 'BAA or 10Y Treasury data not available');
    return null;
  }

  const treasuryMap = new Map(treasury10Y.observations.map(o => [o.date, o.value]));
  const spreadObservations: Observation[] = [];

  for (const obs of baaData.observations) {
    const treasuryValue = treasuryMap.get(obs.date);
    if (treasuryValue && obs.value !== '.' && treasuryValue !== '.') {
      const spread = parseFloat(obs.value) - parseFloat(treasuryValue);
      spreadObservations.push({
        date: obs.date,
        value: spread.toFixed(3),
      });
    }
  }

  logger.info('SPREAD_CALC', `BAA_10Y_Spread: ${spreadObservations.length} observations`);
  return {
    name: 'BAA_10Y_Spread',
    description: 'Moodys BAA Corporate Bond Yield minus 10-Year Treasury Yield (Investment Grade Credit Spread)',
    observations: spreadObservations,
  };
}

function calculateAAAvs10YSpread(
  aaaData: SeriesData | undefined,
  treasury10Y: SeriesData | undefined
): CalculatedSpread | null {
  logger.functionCall('calculateAAAvs10YSpread');
  
  if (!aaaData || !treasury10Y) {
    logger.warn('SPREAD_SKIP', 'AAA or 10Y Treasury data not available');
    return null;
  }

  const treasuryMap = new Map(treasury10Y.observations.map(o => [o.date, o.value]));
  const spreadObservations: Observation[] = [];

  for (const obs of aaaData.observations) {
    const treasuryValue = treasuryMap.get(obs.date);
    if (treasuryValue && obs.value !== '.' && treasuryValue !== '.') {
      const spread = parseFloat(obs.value) - parseFloat(treasuryValue);
      spreadObservations.push({
        date: obs.date,
        value: spread.toFixed(3),
      });
    }
  }

  logger.info('SPREAD_CALC', `AAA_10Y_Spread: ${spreadObservations.length} observations`);
  return {
    name: 'AAA_10Y_Spread',
    description: 'Moodys AAA Corporate Bond Yield minus 10-Year Treasury Yield (High Grade Credit Spread)',
    observations: spreadObservations,
  };
}

function calculatePrimevsFedFunds(
  primeData: SeriesData | undefined,
  fedFundsData: Observation[]
): CalculatedSpread | null {
  logger.functionCall('calculatePrimevsFedFunds');
  
  if (!primeData || fedFundsData.length === 0) {
    logger.warn('SPREAD_SKIP', 'Prime or Fed Funds data not available');
    return null;
  }

  const ffMap = new Map(fedFundsData.map(o => [o.date, o.value]));
  const spreadObservations: Observation[] = [];

  for (const obs of primeData.observations) {
    const ffValue = ffMap.get(obs.date);
    if (ffValue && obs.value !== '.' && ffValue !== '.') {
      const spread = parseFloat(obs.value) - parseFloat(ffValue);
      spreadObservations.push({
        date: obs.date,
        value: spread.toFixed(3),
      });
    }
  }

  logger.info('SPREAD_CALC', `Prime_FedFunds_Spread: ${spreadObservations.length} observations`);
  return {
    name: 'Prime_FedFunds_Spread',
    description: 'Prime Rate minus Federal Funds Rate (Bank Lending Spread)',
    observations: spreadObservations,
  };
}

async function fetchAllFixedIncome(): Promise<CombinedOutput> {
  logger.functionCall('fetchAllFixedIncome');
  logger.info('BATCH_START', `Fetching ${FIXED_INCOME_SERIES.length} fixed income series from FRED`);
  
  const results: Record<string, SeriesData> = {};
  const governmentBonds: Record<string, SeriesData> = {};
  const yieldCurve: Record<string, SeriesData> = {};
  const creditSpreads: Record<string, SeriesData> = {};
  let successCount = 0;
  let failCount = 0;

  for (const series of FIXED_INCOME_SERIES) {
    logger.info('SERIES_START', `Fetching ${series.id} (${series.category})`);
    
    try {
      const { observations, info } = await fetchSeriesObservations(series.id);
      
      const seriesData: SeriesData = {
        series_id: series.id,
        series_name: series.name,
        category: series.category,
        units: info.units,
        frequency: info.frequency,
        observations,
      };
      
      results[series.id] = seriesData;
      
      if (series.category === 'GovernmentBonds') {
        governmentBonds[series.id] = seriesData;
      } else if (series.category === 'YieldCurve') {
        yieldCurve[series.id] = seriesData;
      } else if (series.category === 'CreditSpreads') {
        creditSpreads[series.id] = seriesData;
      }
      
      successCount++;
    } catch (error) {
      logger.warn('SERIES_SKIP', `${series.id}: Failed to fetch`);
      failCount++;
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  logger.info('CALC_START', 'Calculating derived credit spreads');
  const calculatedSpreads: CalculatedSpread[] = [];

  const baaSpread = calculateBAAvs10YSpread(results['DBAA'], results['DGS10']);
  if (baaSpread) {
    calculatedSpreads.push(baaSpread);
  }

  const aaaSpread = calculateAAAvs10YSpread(results['DAAA'], results['DGS10']);
  if (aaaSpread) {
    calculatedSpreads.push(aaaSpread);
  }

  logger.info('BATCH_SUMMARY', `Summary: ${successCount} succeeded, ${failCount} failed`);

  return {
    fetchedAt: new Date().toISOString(),
    totalSeries: Object.keys(results).length,
    fixedIncome: {
      governmentBonds,
      yieldCurve,
      creditSpreads,
      calculatedSpreads,
    },
  };
}

function saveOutput(data: CombinedOutput): string {
  logger.functionCall('saveOutput');
  
  const outputDir = path.join(process.cwd(), '../shared/data/raw');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    logger.info('DIR_CREATED', outputDir);
  }

  const filename = 'fixed-income.json';
  const filepath = path.join(outputDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  logger.dataSaved(filepath);
  
  return filepath;
}

export async function main(): Promise<void> {
  logger.start(SCRIPT_NAME);
  
  if (!API_KEY) {
    logger.error('CONFIG_ERROR', 'FRED_API_KEY not found in environment variables');
    process.exit(1);
  }
  
  try {
    const data = await fetchAllFixedIncome();
    const outputPath = saveOutput(data);
    
    logger.info('COMPLETE', `Total series: ${data.totalSeries}`);
    logger.info('BREAKDOWN', `Government Bonds: ${Object.keys(data.fixedIncome.governmentBonds).length}, Yield Curve: ${Object.keys(data.fixedIncome.yieldCurve).length}, Credit Spreads: ${Object.keys(data.fixedIncome.creditSpreads).length}, Calculated: ${data.fixedIncome.calculatedSpreads.length}`);
    logger.end(SCRIPT_NAME, true);
  } catch (error: any) {
    logger.error('FATAL_ERROR', error.message);
    logger.end(SCRIPT_NAME, false);
    process.exit(1);
  }
}

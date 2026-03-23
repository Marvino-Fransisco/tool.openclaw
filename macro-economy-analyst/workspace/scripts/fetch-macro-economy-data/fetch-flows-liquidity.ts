import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import logger from './logger';

dotenv.config();

const SCRIPT_NAME = 'Flows & Liquidity Fetcher';
const FRED_API_BASE = 'https://api.stlouisfed.org/fred/series/observations';
const FRED_API_KEY = process.env.FRED_API_KEY;
const DAYS_LOOKBACK = 90;

function getDate90DaysAgo(): string {
  const date = new Date();
  date.setDate(date.getDate() - DAYS_LOOKBACK);
  return date.toISOString().split('T')[0];
}

interface SeriesConfig {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
}

interface Observation {
  date: string;
  value: string;
}

interface SeriesData {
  series_id: string;
  series_name: string;
  category: string;
  subCategory?: string;
  units: string;
  frequency: string;
  observations: Observation[];
}

interface FlowsLiquidityOutput {
  fetchedAt: string;
  totalSeries: number;
  flowsLiquidity: Record<string, SeriesData>;
}

const FLOWS_LIQUIDITY_SERIES: SeriesConfig[] = [
  { id: 'WALCL', name: 'Assets, Total Assets of the Federal Reserve', category: 'FedBalanceSheet', subCategory: 'TotalAssets' },
  { id: 'WSECOUT', name: 'Securities Held Outright', category: 'FedBalanceSheet', subCategory: 'Securities' },
  { id: 'TREAST', name: 'Treasury Securities Held by Federal Reserve', category: 'FedBalanceSheet', subCategory: 'Treasuries' },
  { id: 'WSHOSHO', name: 'Agency Mortgage-Backed Securities Held', category: 'FedBalanceSheet', subCategory: 'MBS' },
  { id: 'RRPONTSYD', name: 'Overnight Reverse Repurchase Agreements', category: 'RRP', subCategory: 'Overnight' },
  { id: 'WTREGEN', name: 'Treasury General Account', category: 'TGA', subCategory: 'Balance' },
  { id: 'WDTGAL', name: 'Treasury General Account at Federal Reserve', category: 'TGA', subCategory: 'FedBalance' },
  { id: 'DPSACBW027SBOG', name: 'Deposits, All Commercial Banks', category: 'BankLending', subCategory: 'Deposits' },
  { id: 'TOTLL', name: 'Total Loans and Leases at Commercial Banks', category: 'BankLending', subCategory: 'TotalLoans' },
  { id: 'CCLACBW027SBOG', name: 'Commercial and Industrial Loans', category: 'BankLending', subCategory: 'CommercialLoans' },
  { id: 'REALLN', name: 'Real Estate Loans at Commercial Banks', category: 'BankLending', subCategory: 'RealEstate' },
  { id: 'CONSUMER', name: 'Consumer Credit Outstanding', category: 'BankLending', subCategory: 'ConsumerCredit' },
  { id: 'DRCCLACBS', name: 'Delinquency Rate on Consumer Loans', category: 'BankLending', subCategory: 'Delinquencies' },
  { id: 'BOPGSTB', name: 'Balance of Payments - Net Foreign Investment', category: 'EMCapitalFlows', subCategory: 'NetInvestment' },
  { id: 'BOGZ1FL564090005Q', name: 'Mutual Fund Shares - Net Sales', category: 'FundFlows', subCategory: 'MutualFunds' },
  { id: 'BOGZ1FL564090005A', name: 'Mutual Fund Shares - Annual', category: 'FundFlows', subCategory: 'MutualFundsAnnual' },
  { id: 'BASE', name: 'Monetary Base - Total (St. Louis)', category: 'Liquidity', subCategory: 'MonetaryBase' },
  { id: 'BOGMBASE', name: 'Monetary Base - St. Louis Adjusted', category: 'Liquidity', subCategory: 'AdjustedBase' },
  { id: 'M2SL', name: 'M2 Money Stock', category: 'Liquidity', subCategory: 'M2' },
  { id: 'M1SL', name: 'M1 Money Stock', category: 'Liquidity', subCategory: 'M1' },
  { id: 'EXCSRESNW', name: 'Excess Reserves of Depository Institutions', category: 'Liquidity', subCategory: 'ExcessReserves' },
];

async function fetchSeriesObservations(seriesId: string): Promise<{ observations: Observation[]; info: { units: string; frequency: string } }> {
  logger.functionCall('fetchSeriesObservations', seriesId);
  
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
    const response = await axios.get(FRED_API_BASE, { params });
    
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
        frequency: response.data.frequency || 'Unknown',
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

async function fetchAllFlowsLiquidity(): Promise<FlowsLiquidityOutput> {
  logger.functionCall('fetchAllFlowsLiquidity');
  logger.info('BATCH_START', `Fetching ${FLOWS_LIQUIDITY_SERIES.length} flows & liquidity series from FRED`);
  
  const results: Record<string, SeriesData> = {};
  let successCount = 0;
  let failCount = 0;

  for (const series of FLOWS_LIQUIDITY_SERIES) {
    logger.info('SERIES_START', `Fetching ${series.id} (${series.category}/${series.subCategory || 'general'})`);
    
    try {
      const { observations, info } = await fetchSeriesObservations(series.id);
      
      results[series.id] = {
        series_id: series.id,
        series_name: series.name,
        category: series.category,
        subCategory: series.subCategory,
        units: info.units,
        frequency: info.frequency,
        observations,
      };
      
      successCount++;
    } catch (error) {
      logger.warn('SERIES_SKIP', `${series.id}: Failed to fetch`);
      failCount++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  logger.info('BATCH_SUMMARY', `Summary: ${successCount} succeeded, ${failCount} failed`);

  return {
    fetchedAt: new Date().toISOString(),
    totalSeries: Object.keys(results).length,
    flowsLiquidity: results,
  };
}

function saveOutput(data: FlowsLiquidityOutput): string {
  logger.functionCall('saveOutput');
  
  const outputDir = path.join(process.cwd(), '../shared/data/raw');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    logger.info('DIR_CREATED', outputDir);
  }

  const filename = 'flows-liquidity.json';
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
  
  logger.info('CONFIG', 'Categories: Fed Balance Sheet, RRP, TGA, Bank Lending, EM Capital Flows, Fund Flows, Liquidity Metrics');
  
  try {
    const data = await fetchAllFlowsLiquidity();
    const outputPath = saveOutput(data);
    
    logger.info('COMPLETE', `Total series: ${data.totalSeries}`);
    logger.end(SCRIPT_NAME, true);
  } catch (error: any) {
    logger.error('FATAL_ERROR', error.message);
    logger.end(SCRIPT_NAME, false);
    process.exit(1);
  }
}

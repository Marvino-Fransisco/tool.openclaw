import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const FRED_API_BASE = 'https://api.stlouisfed.org/fred/series/observations';
const API_KEY = process.env.FRED_API_KEY;

if (!API_KEY) {
  console.error('Error: FRED_API_KEY not found in environment variables');
  console.error('Please set FRED_API_KEY in your .env file or export it');
  process.exit(1);
}

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
  const url = `${FRED_API_BASE}`;
  const params = {
    series_id: seriesId,
    api_key: API_KEY,
    file_type: 'json',
    observation_start: '2000-01-01',
    sort_order: 'desc',
    limit: 1000,
  };

  try {
    const response = await axios.get(url, { params });
    
    const observations: Observation[] = response.data.observations.map((obs: any) => ({
      date: obs.date,
      value: obs.value,
    }));

    return {
      observations,
      info: {
        units: response.data.units || 'Unknown',
        frequency: 'As reported',
      },
    };
  } catch (error: any) {
    if (error.response) {
      console.error(`Error fetching ${seriesId}: ${error.response.status} - ${error.response.data?.error_message || error.message}`);
    } else {
      console.error(`Error fetching ${seriesId}: ${error.message}`);
    }
    throw error;
  }
}

async function fetchAllIndicators(): Promise<CombinedOutput> {
  const results: Record<string, SeriesData> = {};
  let successCount = 0;
  let failCount = 0;

  console.log(`Fetching ${ECONOMIC_INDICATORS.length} economic indicators from FRED...\n`);

  for (const indicator of ECONOMIC_INDICATORS) {
    console.log(`Fetching ${indicator.id} (${indicator.category})...`);
    
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
      
      console.log(`  ✓ ${indicator.id}: ${observations.length} observations`);
      successCount++;
    } catch (error) {
      console.log(`  ✗ ${indicator.id}: Failed to fetch`);
      failCount++;
    }
  }

  console.log(`\nSummary: ${successCount} succeeded, ${failCount} failed`);

  return {
    fetchedAt: new Date().toISOString(),
    totalSeries: Object.keys(results).length,
    indicators: results,
  };
}

function saveOutput(data: CombinedOutput): string {
  const outputDir = path.join(process.cwd(), '../shared/data/raw');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `economic-indicators-${dateStr}.json`;
  const filepath = path.join(outputDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  
  return filepath;
}

async function main(): Promise<void> {
  console.log('=== FRED Economic Data Scraper ===\n');
  
  try {
    const data = await fetchAllIndicators();
    const outputPath = saveOutput(data);
    
    console.log(`\n✓ Data saved to: ${outputPath}`);
    console.log(`  Total series: ${data.totalSeries}`);
    console.log(`  Fetched at: ${data.fetchedAt}`);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();

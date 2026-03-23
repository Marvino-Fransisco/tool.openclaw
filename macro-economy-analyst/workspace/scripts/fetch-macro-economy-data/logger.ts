import * as fs from 'fs';
import * as path from 'path';

const LOG_FILE = '/home/node/.openclaw/logs/fetch-data.log';

function ensureLogDir(): void {
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

function getTimestamp(): string {
  return new Date().toISOString();
}

function formatMessage(event: string, message: string): string {
  return `[${getTimestamp()}] [${event}]: ${message}`;
}

export const logger = {
  info(event: string, message: string): void {
    const formatted = formatMessage(event, message);
    console.log(formatted);
    writeToFile(formatted);
  },

  error(event: string, message: string): void {
    const formatted = formatMessage(event, message);
    console.error(formatted);
    writeToFile(formatted);
  },

  warn(event: string, message: string): void {
    const formatted = formatMessage(event, message);
    console.warn(formatted);
    writeToFile(formatted);
  },

  debug(event: string, message: string): void {
    const formatted = formatMessage(event, message);
    console.log(formatted);
    writeToFile(formatted);
  },

  start(scriptName: string): void {
    this.info('START', `Running ${scriptName}`);
  },

  end(scriptName: string, success: boolean = true): void {
    const status = success ? 'completed successfully' : 'failed';
    this.info('END', `${scriptName} ${status}`);
  },

  functionCall(fnName: string, params?: string): void {
    const msg = params ? `Calling ${fnName}(${params})` : `Calling ${fnName}()`;
    this.info('FUNCTION', msg);
  },

  apiRequest(url: string): void {
    this.info('API_REQUEST', url);
  },

  apiResponse(url: string, status: string): void {
    this.info('API_RESPONSE', `${url} - ${status}`);
  },

  dataFetched(source: string, count: number): void {
    this.info('DATA_FETCHED', `${source}: ${count} items`);
  },

  dataSaved(filepath: string): void {
    this.info('DATA_SAVED', filepath);
  },
};

function writeToFile(message: string): void {
  try {
    ensureLogDir();
    fs.appendFileSync(LOG_FILE, message + '\n', 'utf-8');
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
}

export default logger;

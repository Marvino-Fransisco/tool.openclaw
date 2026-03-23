import * as fs from 'fs'
import * as path from 'path'

const LOG_FILE = '/home/node/.openclaw/logs/process-data.log'

function getTimestamp(): string {
  return new Date().toISOString()
}

function writeLog(level: string, event: string, message: string): void {
  const timestamp = getTimestamp()
  const logLine = `[${timestamp}] [${level}] [${event}]: ${message}\n`
  
  console.log(`[${event}]: ${message}`)
  
  try {
    const logDir = path.dirname(LOG_FILE)
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }
    fs.appendFileSync(LOG_FILE, logLine, 'utf-8')
  } catch (err) {
    console.error(`Failed to write log file: ${err}`)
  }
}

export const logger = {
  info: (event: string, message: string): void => writeLog('INFO', event, message),
  success: (event: string, message: string): void => writeLog('SUCCESS', event, message),
  warn: (event: string, message: string): void => writeLog('WARN', event, message),
  error: (event: string, message: string): void => writeLog('ERROR', event, message),
  debug: (event: string, message: string): void => writeLog('DEBUG', event, message),
}

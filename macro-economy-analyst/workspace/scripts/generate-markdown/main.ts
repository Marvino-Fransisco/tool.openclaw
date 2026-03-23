import { createEconomicIndicatorMD } from './create-economic-indicator-md'
import * as path from 'path'

const inputFile = path.join(__dirname, 'economic-indicators-2026-03-23.json')

createEconomicIndicatorMD(inputFile)

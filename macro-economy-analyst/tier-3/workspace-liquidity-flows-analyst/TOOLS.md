# TOOLS.md - Liquidity Flows Analyst Notes

## Data Paths

### Input
- Macro-fundamentals: `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
- All `.md` files in that directory are source data

### Output
- Analysis output: `/home/node/.openclaw/shared/analysis/signals/liquidity-flows.md`
- Signal directory: `/home/node/.openclaw/shared/analysis/signals/`

## Analysis Pipeline

**ALWAYS run the full pipeline when asked. Do not check output file existence or age.**

1. Read all macro-fundamentals `.md` files
2. Extract liquidity-relevant data points (central bank balances, M2, flows, stress indicators)
3. Synthesize through the liquidity framework in `SOUL.md`
4. Produce forward forecasts with timeframes (0-4W, 1-3M, 3-12M)
5. Write to output file (overwrite existing)

## Key Metrics to Track

- Central bank balance sheets (Fed, ECB, BOJ, PBOC) — direction and rate of change
- M2 growth rate and money velocity
- Reserve balances and RRP facility usage
- TGA (Treasury General Account) balance
- SOFR and repo market rates
- Cross-currency basis (EUR/USD, JPY/USD)
- ETF fund flows (equity, bond, commodity)
- Credit spreads (IG, HY, EM)
- Dollar index (DXY)

## Downstream Consumers

This analysis feeds into:
- Tier-4 forecasting agents (bullish/bearish/neutral)
- Tier-5 portfolio manager
- Tier-6 synthesizer

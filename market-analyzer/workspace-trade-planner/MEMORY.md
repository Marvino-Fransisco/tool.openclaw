# MEMORY.md - Long-Term Memory

## Context
- `./data` contains candle sticks data in JSON format.
- `./analysis` contains technical analysis data in JSON format.

## Primary Task

**Create Trade Plan**
- You create maximumly **ONE** trade idea based on the analysis files in `analysis` folder

## Never Update the To Do List
**To Do (Do this SEQUENTIALLY)**
- [ ] Read `technical_analysis.json`
- [ ] Analyze are there potential trade setup could be created
- [ ] If there are potential setup then create the trade idea by using `create-trade-idea` skill
- [ ] If there are trade idea, then create 5M chart image by using `create-chart` skill
- [ ] If there are trade idea, then create 1M chart image by using `create-chart` skill
- [ ] If there are trade idea, then create pdf file by using `create-pdf` skill
- [ ] Send `trade.pdf`, `{PAIR}_{TIMEFRAME}.png` to discord by using `send-to-discrod` skill (This skill is not the same as `discord` skill you have)

## Constraint
- If there are no potential setup (**NEVER FORCE A TRADE IDEA**) after you read the data, then tell the user that there are no trade ideas.
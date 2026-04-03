# BOOTSTRAP.md - Sentiment Risk Analyst Pipeline

_You just woke up. Run your analysis pipeline automatically — no human needed._

## Pipeline

Execute these steps in order, every session, without asking permission:

### Step 1: Read SOUL.md and USER.md

Understand who you are and who you serve. Then proceed.

### Step 2: Read Macro Fundamental Data

Read all markdown files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`. These are your primary inputs. If the directory is empty or files are missing, note what is absent but proceed with whatever is available.

### Step 3: Analyze Sentiment Correlation

For each macro data point, assess:

1. **Direct sentiment impact** — How does this data point make market participants feel? (confident, anxious, euphoric, fearful, confused)
2. **Behavioral response** — What actions does this feeling typically trigger? (buy risk, sell risk, hedge, de-lever, rotate sectors, move to cash)
3. **Time horizon** — How long does this sentiment effect typically persist? (hours, days, weeks, months)
4. **Contrarian signal** — Is the crowd's likely response an overreaction? Is there a sentiment extreme building?
5. **Cross-asset spillover** — Does this sentiment in one asset class bleed into others?

### Step 4: Synthesize Sentiment Outlook

Combine all individual assessments into a unified view:

- **Current dominant sentiment** (single label from SOUL.md framework)
- **Sentiment conviction level** (high / medium / low)
- **Key drivers** (top 3 macro data points currently shaping sentiment)
- **Divergences** (where macro fundamentals and market sentiment disagree)
- **Upcoming catalysts** (known events that could shift sentiment)
- **Forward sentiment trajectory** with timeframes:
  - **Near-term (1-5 days)** — What happens next
  - **Short-term (1-4 weeks)** — How sentiment evolves
  - **Medium-term (1-3 months)** — Secular sentiment trend
- **Risk scenarios** — What could break the sentiment call (bull case, bear case, tail risk)

### Step 5: Write Output

Write your analysis to `/home/node/.openclaw/shared/analysis/signals/sentiment-risk.md` using this exact format:

```markdown
# Sentiment Risk Analysis

_Generated: [ISO timestamp]_
_Agent: sentiment-risk-analyst_
_Tier: 3_

## Current Sentiment State

**Dominant Mood:** [Greed/Fear/Optimism/Pessimism/Confusion]
**Conviction:** [High/Medium/Low]
**Sentiment Score:** [1-10, where 1 = Extreme Fear, 5 = Neutral, 10 = Extreme Greed]

## Key Sentiment Drivers

1. **[Driver 1]:** [Impact description and direction]
2. **[Driver 2]:** [Impact description and direction]
3. **[Driver 3]:** [Impact description and direction]

## Macro-Sentiment Correlation Map

- **[Macro data point 1]:** [Correlation with sentiment — reinforcing or contradicting]
- **[Macro data point 2]:** [Correlation with sentiment — reinforcing or contradicting]
- **[Macro data point N]:** [Correlation with sentiment — reinforcing or contradicting]

## Divergences

- [Where macro says one thing but sentiment says another, or where cross-asset sentiment diverges]

## Forward Outlook

### Near-Term (1-5 days)
[Sentiment forecast with specific catalysts and expected behavioral response]

### Short-Term (1-4 weeks)
[Sentiment trajectory with evolving macro backdrop]

### Medium-Term (1-3 months)
[Secular sentiment trend with structural drivers]

## Risk Scenarios

- **Bull Case:** [What makes sentiment improve beyond base case]
- **Bear Case:** [What makes sentiment deteriorate beyond base case]
- **Tail Risk:** [Low-probability, high-impact sentiment shock]

## Contrarian Watch

- [Any extreme positioning, sentiment surveys at extremes, or crowd behavior worth fading or respecting]

## Data Gaps

- [List any missing data that would improve this analysis]
```

### Step 6: Log Completion

Record the analysis timestamp and key findings in your session notes. Track how your sentiment calls evolve over time by comparing with previous outputs if they exist.

## Important Notes

- Do NOT ask for human input during this pipeline. Run it autonomously.
- If macro data has not changed since last analysis, note that in the output but still produce a fresh assessment.
- Always overwrite the previous `/home/node/.openclaw/shared/analysis/signals/sentiment-risk.md` — this file should always reflect the latest analysis.
- Be honest about uncertainty. A low-conviction call is more valuable than a false high-conviction call.

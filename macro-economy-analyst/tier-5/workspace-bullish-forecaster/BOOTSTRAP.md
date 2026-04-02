# BOOTSTRAP.md - Startup Routine

The bullish forecaster is configured and ready.

---

## On Session Start

1. **Check input data.** Verify files exist in `/home/node/.openclaw/shared/aggregate/`
2. **Read all aggregate files.** Load every `.md` file in the aggregate directory
3. **Analyze and construct bullish thesis.** Apply the SOUL.md framework to build the strongest possible bull case
4. **Write thesis.** Output to `/home/node/.openclaw/shared/thesis/bullish.md`
5. **Report completion.** Brief confirmation with confidence percentage

## Analysis Trigger

This agent runs analysis automatically on session start. No user command needed.

The analysis should:
- Read ALL files in `/home/node/.openclaw/shared/aggregate/` — every file contains relevant macro signals
- Synthesize the data through a bullish lens
- Produce the structured output defined in SOUL.md
- Always include a confidence percentage (0-100%)

## No Waiting

Unlike other agents, this forecaster acts immediately. Read data, analyze, write output. That is the entire purpose.

---

_Delete this file if you want no startup behavior._

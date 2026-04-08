import PDFDocument from 'pdfkit';
import fs from 'fs';

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 55, right: 55 },
  info: {
    Title: 'Macro Economy Research Report — April 8, 2026',
    Author: 'Macro Economy Analyst System',
  }
});

const outPath = '/home/node/.openclaw/shared/report/macro-report-20260408-0444.pdf';
fs.mkdirSync('/home/node/.openclaw/shared/report/', { recursive: true });
const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

const W = doc.page.width - doc.page.margins.left - doc.page.margins.right;
const colors = {
  black: '#1a1a1a', darkGray: '#333333', gray: '#666666', lightGray: '#999999',
  accent: '#1a5276', green: '#1e8449', red: '#c0392b', orange: '#d35400',
  blue: '#2874a6', lightBg: '#f4f6f7', white: '#ffffff', line: '#d5d8dc',
};

function addLine(y) {
  doc.save().moveTo(doc.page.margins.left, y).lineTo(doc.page.margins.left + W, y).strokeColor(colors.line).lineWidth(0.5).stroke().restore();
}

function sectionTitle(text) {
  doc.moveDown(0.8);
  const y = doc.y;
  doc.save().rect(doc.page.margins.left, y - 2, W, 22).fill(colors.accent).restore();
  doc.fillColor(colors.white).fontSize(13).font('Helvetica-Bold').text(text, doc.page.margins.left + 8, y + 2, { width: W - 16 });
  doc.fillColor(colors.black);
  doc.y = y + 28;
  doc.moveDown(0.3);
}

function subSection(text) {
  doc.moveDown(0.5);
  doc.fillColor(colors.accent).fontSize(11).font('Helvetica-Bold').text(text);
  doc.fillColor(colors.black).font('Helvetica').fontSize(9.5);
  doc.moveDown(0.2);
}

function body(text) {
  doc.fontSize(9.5).font('Helvetica').fillColor(colors.darkGray).text(text, { lineGap: 3 });
}

function bullet(text) {
  doc.fontSize(9.5).font('Helvetica').fillColor(colors.darkGray).text(`•  ${text}`, doc.page.margins.left + 10, doc.y, { width: W - 20, lineGap: 2 });
}

function checkPage(needed = 80) {
  if (doc.y + needed > doc.page.height - doc.page.margins.bottom) doc.addPage();
}

function simpleTable(headers, rows, colWidths) {
  const startX = doc.page.margins.left;
  const rowH = 18;
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  const padX = 4;
  checkPage(rowH * (rows.length + 2));
  let y = doc.y;
  doc.save().rect(startX, y, totalW, rowH).fill('#2c3e50').restore();
  let x = startX;
  headers.forEach((h, i) => {
    doc.fillColor(colors.white).fontSize(8.5).font('Helvetica-Bold').text(h, x + padX, y + 4, { width: colWidths[i] - padX * 2 });
    x += colWidths[i];
  });
  y += rowH;
  rows.forEach((row, ri) => {
    const bg = ri % 2 === 0 ? colors.lightBg : colors.white;
    checkPage(rowH);
    y = doc.y;
    doc.save().rect(startX, y, totalW, rowH).fill(bg).restore();
    x = startX;
    row.forEach((cell, ci) => {
      doc.fillColor(colors.darkGray).fontSize(8.5).font('Helvetica').text(String(cell), x + padX, y + 4, { width: colWidths[ci] - padX * 2 });
      x += colWidths[ci];
    });
    y += rowH;
    doc.y = y;
  });
  doc.moveDown(0.5);
}

// ===== TITLE PAGE =====
doc.moveDown(6);
doc.fontSize(28).font('Helvetica-Bold').fillColor(colors.accent).text('Macro Economy', { align: 'center' });
doc.fontSize(28).text('Research Report', { align: 'center' });
doc.moveDown(0.5);
addLine(doc.y);
doc.moveDown(0.8);
doc.fontSize(14).font('Helvetica').fillColor(colors.gray).text('Probability-Weighted Macro Assessment', { align: 'center' });
doc.moveDown(2);
doc.fontSize(11).fillColor(colors.darkGray).text('April 8, 2026', { align: 'center' });
doc.moveDown(0.3);
doc.fontSize(10).fillColor(colors.lightGray).text('Macro Economy Analyst System — Tier 7 Synthesizer', { align: 'center' });
doc.moveDown(3);

const boxW = 110, boxH = 70, gap = 20;
const totalBoxW = boxW * 3 + gap * 2;
const boxStartX = doc.page.margins.left + (W - totalBoxW) / 2;
const boxY = doc.y;
[{ label: 'BULL', pct: '50%', color: colors.green }, { label: 'NEUTRAL', pct: '25%', color: colors.orange }, { label: 'BEAR', pct: '25%', color: colors.red }].forEach((s, i) => {
  const x = boxStartX + i * (boxW + gap);
  doc.save().roundedRect(x, boxY, boxW, boxH, 4).lineWidth(1.5).strokeColor(s.color).stroke().restore();
  doc.fillColor(s.color).fontSize(10).font('Helvetica-Bold').text(s.label, x, boxY + 12, { width: boxW, align: 'center' });
  doc.fontSize(24).text(s.pct, x, boxY + 30, { width: boxW, align: 'center' });
});
doc.y = boxY + boxH + 30;
doc.moveDown(4);
doc.fontSize(8).fillColor(colors.lightGray).text('Conviction: Medium (40-45%) — Highest this cycle', { align: 'center' });
doc.text('Oil -18%, Dow futures +967, Hormuz reopening. All signals aligned risk-on.', { align: 'center' });

// ===== PAGE 2 =====
doc.addPage();
sectionTitle('Executive Summary');
[
  'The dam broke overnight. Trump suspended attacks on Iran, Iran agreed to a 10-point proposal, the Strait of Hormuz reopened, and Israel signed on. Oil crashed -18% to $93. Dow futures +967.',
  'Probability outlook: Bull 50% / Neutral 25% / Bear 25% — the first genuinely bullish dominant call this cycle. All three signals (regime, sentiment, liquidity) aligned risk-on for the first time.',
  'Near-term is the highest-conviction risk-on window: 1-5 day relief rally with 75%+ probability. F&G expected to swing from 22 to 35-45 as survey lag catches up.',
  'Gold at $4,821 (+6.5% WoW) remains the structural warning — rallied despite ceasefire, oil crash, and VIX compression. Central bank de-dollarization and fiscal concerns are structural, not cyclical.',
  'Portfolio advice: Missing this cycle. Allocation guidance carries forward from prior report (Apr 7): 25% equities, 18% cash, 14% FI, 12% BTC, 12% commodities, 10% gold, 5% EM/BBCA, 4% intl. Rebalance pending new advisor input.',
].forEach(b => bullet(b));
doc.moveDown(0.3);
body('The single dominant variable has shifted from "ceasefire survival" to "ceasefire durability and negotiation progress." Islamabad talks (Friday, April 11) are the next binary catalyst. The 2-week deadline (April 21) remains the structural ceiling.');

// ===== SECTION 1 =====
sectionTitle('1. Macro Outlook — Probability-Weighted Thesis');
simpleTable(
  ['Scenario', 'Probability', 'Description'],
  [
    ['Bull', '50%', 'Ceasefire holds, recovery unfolds. Oil <$90, VIX <20. Fed cuts H2.'],
    ['Neutral', '25%', 'Choppy normalization. Sell-the-news dynamics. Oil $85-95. Countdown anxiety.'],
    ['Bear', '25%', 'Ceasefire collapse or Lebanon escalation. Oil >$115. VIX >40. HY blowout.'],
  ],
  [70, 80, W - 150]
);
body('Overall conviction: Medium (40-45%) — the highest this cycle. Bull rises from 45% to 50% as ceasefire proves more substantive (active diplomacy, Hormuz reopening, multi-party agreement). Bear drops from 30% to 25% as the burden of proof shifts.');

// ===== SECTION 2 =====
sectionTitle('2. Analysis Summary');

subSection('2.1 Monetary Policy & Central Banks');
bullet('Fed communication shifted: 21% dovish / 16% hawkish. Doves outnumber hawks 4-3.');
bullet('Jefferson, Barr, Waller tilting dovish. September cut path clearing if oil sustains sub-$100.');
bullet('Markets pricing 2-3 cuts in 2026. QT continues at ~$25B/month. Fed funds at ~3.8%.');

subSection('2.2 Economic Indicators & Growth');
bullet('GDP 2.3%, unemployment 4.3%, retail sales resilient — solid growth despite geopolitical headwinds.');
bullet('Yield curve steepening: 2s10s at +52bps. Historically bullish for growth.');
bullet('Credit markets healthy: IG OAS 85bps, HY OAS 305bps (-8bps). No banking stress. Lending intact.');

checkPage(60);
subSection('2.3 Market Prices & Cross-Asset');
simpleTable(
  ['Asset', 'Level', 'Signal'],
  [
    ['WTI Crude', '$93 (-18% WoW)', 'Crashing through de-escalation levels'],
    ['DXY', '98.93 (-1.2% WoW)', 'Below 99 — multi-asset tailwind'],
    ['Gold', '$4,821 (ATH, +6.5% WoW)', 'Structural warning — non-confirming'],
    ['BTC', '$71,025+', 'Risk-on response; halving cycle tailwind'],
    ['Brent', '$94.65 (-16% WoW)', 'Hormuz reopened'],
    ['Copper', '$5.71 (+4.3% WoW)', 'Clearest risk-on signal'],
    ['Silver', '$76.53 (+8.8% WoW)', 'Dual precious/industrial bid'],
    ['HY OAS', '305bps (-8bps)', 'Reduced recession risk'],
    ['Fear & Greed', '22.1 (Extreme Fear)', 'Survey lag — expect catch-up to 35-45'],
  ],
  [110, 130, W - 240]
);

checkPage(60);
subSection('2.4 Sentiment & Positioning');
bullet('Dominant mood: Extreme Fear (F&G 22.1) with explosive relief building beneath the surface.');
bullet('Largest divergence this cycle: F&G at 22.1 vs. Dow futures +2.1%. Survey data lags by 24-48 hours.');
bullet('Expected trajectory: F&G swings 22→35-45 within 2-3 sessions as crowd chases the rally.');
bullet('Historical pattern: 6+ weeks of extreme fear (F&G sub-25) produces 15-25% forward returns over 3-6 months.');
bullet('New risk: "Sell the news" on formal deal signing (40-50% probability). Relief rally may front-run actual agreement.');

subSection('2.5 Liquidity & Flows');
bullet('Net direction: Slightly expansionary→accelerating (overnight events exceeded projections).');
bullet('Oil crash from $102 to $93 significantly reduces fiscal drag. Approaching $90 "full de-escalation" threshold.');
bullet('Safe-haven unwind accelerating: USD selling, equity short-covering in full force.');
bullet('If VIX breaks 20 (likely this week), dealer positioning flips positive — self-reinforcing rally tailwind.');
bullet('Estimated near-term liquidity impact: +$50-100B, potentially exceeding the upper bound given oil crash magnitude.');

// ===== SECTION 3 =====
doc.addPage();
sectionTitle('3. Portfolio Positioning');

subSection('⚠️ Portfolio Advisor Output Missing');
body('The Tier-6 Portfolio Advisor did not produce output this cycle. The following allocation guidance carries forward from the April 7, 22:57 UTC report and should be considered stale pending new advisor input. Key directional shifts since the prior allocation are noted below.');

doc.moveDown(0.3);
simpleTable(
  ['Asset Class', 'Prior Allocation', 'Notes'],
  [
    ['US Equities', '25%', 'Underweight given risk-on momentum — consider increasing to 30%'],
    ['Cash & Equivalents', '18%', 'Elevated — consider deploying into relief rally'],
    ['Fixed Income', '14%', '5Y duration sweet spot; HY constructive'],
    ['Bitcoin', '12%', 'Halving cycle + weak dollar tailwind — consider increasing to 15%'],
    ['Commodities', '12%', 'Oil geopolitical premium stripping — consider reducing'],
    ['Gold', '10%', 'Structural hedge; non-negotiable while ceasefire fragile'],
    ['EM Equities (BBCA)', '5%', 'DXY <99 bullish for EM — consider increasing to 8%'],
    ['Intl Equities', '4%', 'Low conviction without dedicated specialist'],
    ['Total', '100%', ''],
  ],
  [120, 90, W - 210]
);

subSection('Directional Adjustments (Pending Advisor Confirmation)');
bullet('Increase US equities: Near-term risk-on momentum is the highest-conviction signal this cycle.');
bullet('Deploy cash: 18% is too high for a 75%+ probability relief rally. Consider deploying 3-5% incrementally.');
bullet('Increase BTC: Halving cycle entering strongest phase + DXY below 99 = structural tailwind.');
bullet('Reduce commodities: Oil geopolitical premium stripping rapidly. $93 and falling — may overshoot to $80-85.');
bullet('Increase EM/BBCA: DXY below 99 is the first multi-week bullish signal for EM. Islamabad talks Friday could accelerate flows.');
bullet('Maintain gold at 10%: Non-confirmation of normalization prevents aggressive risk-on rotation.');

subSection('Risk Management');
bullet('Max drawdown (bear scenario): Est. -10 to -15%. Defensive buffer (~42%) cushions the tail.');
bullet('Sell-the-news risk (40-50%): Trim positions approaching ATH or on formal deal announcement.');
bullet('Lebanon escalation (45-55%): Independent risk vector not covered by Iran ceasefire. Monitor IDF-Hezbollah.');
bullet('CPI lag risk (May-June): Oil spike inflation data could create temporary fear spike even if geopolitics improve.');

subSection('What Would Change the Allocation');
simpleTable(
  ['Trigger', 'Action'],
  [
    ['Oil sustains below $90', 'Full risk-on: cash→10-12%, equities→32%, BTC→15%'],
    ['Islamabad talks succeed (Apr 11)', 'Increase EM to 8-10%, deploy cash to equities'],
    ['Islamabad talks fail (Apr 11)', 'Increase cash to 22%, reduce EM, maintain gold'],
    ['Gold pulls back below $4,500', 'Reduce gold to 5-7%, deploy to equities/BTC'],
    ['Gold breaks above $5,000', 'Increase gold to 12-15%, reduce equities'],
    ['VIX breaks below 20', 'Deploy 3-5% cash to equities (dealer delta flips)'],
    ['Ceasefire collapse', 'Cash→30-35%, equities→10%, gold→15%, exit EM'],
  ],
  [180, W - 180]
);

subSection('BBCA-Specific Guidance');
bullet('DXY below 99 (98.93) is the strongest EM tailwind in weeks. IDR servicing costs declining.');
bullet('Islamabad talks (Friday) could accelerate EM capital flows if diplomatic progress confirmed.');
bullet('Hold current position; consider increasing to 8% if Islamabad talks produce concrete framework.');
bullet('Lebanon escalation (45-55% prob.) is the key risk — could trigger EM outflows regardless of Iran ceasefire.');

// ===== SECTION 4 =====
checkPage(120);
sectionTitle('4. Key Risks');
simpleTable(
  ['#', 'Risk', 'Severity', 'Probability'],
  [
    ['1', 'Ceasefire negotiations stall (week 2)', 'Moderate', '40%'],
    ['2', '"Sell the news" on formal deal', 'Moderate', '40-50%'],
    ['3', 'Oil-driven CPI surprise (May-June)', 'Moderate', '30%'],
    ['4', 'Lebanon escalation (independent)', 'Critical', '45-55%'],
    ['5', 'Israel/Iran rogue action', 'Critical', 'Tail'],
    ['6', 'Gold remains elevated post-deal', 'Moderate', '25-30%'],
    ['7', 'Relief rally overshoot → pullback', 'Moderate', '35%'],
  ],
  [20, 200, 65, W - 285]
);

subSection('Critical Watch Dates');
bullet('April 11 (Friday): Islamabad talks — success = de-escalation continues; failure = risk-off snapback.');
bullet('~April 21: Ceasefire deadline — survival triggers risk-on rotation; expiry creates cliff-edge pricing.');
bullet('April 15: Markets begin pricing expiry risk as deadline approaches.');
bullet('April/May FOMC: Dovish shift amplified by successful ceasefire. September cut path clearing.');
bullet('May-June CPI/PCE: Lagged oil spike data could create temporary inflation fear.');

subSection('Trigger Watch Levels');
simpleTable(
  ['Metric', 'Bullish', 'Bearish', 'Current'],
  [
    ['WTI Crude', 'Below $90', 'Above $100', '$93'],
    ['VIX', 'Below 20', 'Above 25', 'Compressing'],
    ['Gold', 'Below $4,500', 'Above $5,000', '$4,821'],
    ['Fear & Greed', 'Above 40', 'Below 20', '22.1'],
    ['HY OAS', 'Below 280bps', 'Above 350bps', '305bps'],
    ['DXY', 'Below 97', 'Above 100', '98.93'],
    ['BTC', 'Above $75K', 'Below $65K', '$71,025+'],
    ['S&P 500', 'Reclaim ATH (~7,000)', 'Below 6,400', '~5.5% below ATH'],
  ],
  [90, 120, 100, W - 310]
);

// ===== SECTION 5 =====
checkPage(120);
sectionTitle('5. Data Gaps & Caveats');
body('This report is based on partial data. The following gaps should be noted:');
doc.moveDown(0.3);
bullet('Portfolio Advisor (Tier-6) output missing this cycle — allocation guidance carries forward from prior report and may be stale.');
bullet('Regime and liquidity signals ~6 hours stale (pre-dated overnight ceasefire suspension announcement).');
bullet('No US equities specialist — the largest asset class in Marvino\'s portfolio lacks dedicated coverage.');
bullet('No BBCA/Indonesian specialist — core IDR equity position analyzed only through EM lens.');
bullet('Macro-fundamental pipeline broken: no Tier-1/Tier-2 data, no PMI, M2, ISM, building permits.');
bullet('No fund flow data (EPFR, Lipper) — positioning/crowding analysis incomplete.');
bullet('No VIX real-time level — cannot confirm volatility compression trajectory.');
bullet('Brave Search API unconfigured — limits real-time research.');

doc.moveDown(0.3);
body('The aggregate assessment should be considered directionally informative but incomplete. The improvement in signal coverage (3/3) and asset specialist coverage (3 specialists) represents meaningful progress from prior cycles.');

// ===== DISCLAIMER =====
checkPage(140);
sectionTitle('Disclaimer');
doc.fontSize(7.5).font('Helvetica').fillColor(colors.lightGray).text(
  'This report is generated by an automated macro analysis system for informational purposes only. It does not constitute investment advice, a recommendation to buy or sell any security, or a solicitation of any kind. Past performance is not indicative of future results. All probability estimates are subjective and based on available data at the time of generation — they should not be treated as predictions. The author(s) of this report are AI systems and not registered financial advisors. Consult a qualified financial professional before making any investment decisions. Investing involves risk, including the potential loss of principal.',
  { lineGap: 2 }
);

doc.moveDown(1);
addLine(doc.y);
doc.moveDown(0.5);
doc.fontSize(8).fillColor(colors.lightGray).text('Macro Economy Analyst System — Tier 7 Synthesizer', { align: 'center' });
doc.text('Generated: April 8, 2026 04:44 UTC', { align: 'center' });
doc.text('Next update: Post-Islamabad talks (April 11) or when new signal data arrives', { align: 'center' });

doc.end();
stream.on('finish', () => {
  console.log('PDF saved to:', outPath);
  console.log('Size:', fs.statSync(outPath).size, 'bytes');
});

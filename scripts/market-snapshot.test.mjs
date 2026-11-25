// ABOUTME: Unit tests for the pure parsing/ranking helpers in market-snapshot.mjs.
// ABOUTME: Run with `npm test` (node:test, no network).

import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildEarnings, dateSlug, decodeHtmlAttribute, formatSentimentDate, marketWindow, parseFgScoreHtml, parseFredCsv,
  parseMarketCaps, parseStatmuseReturns, parseYahooChart, rankMovers, shiftDate,
} from './market-snapshot.mjs'

test('marketWindow uses the New York date, 31 days back', () => {
  // 03:00 UTC on Nov 25 is still Nov 24 in New York.
  assert.deepEqual(marketWindow(new Date('2026-11-25T03:00:00Z')), { start: '2026-10-24', end: '2026-11-24' })
  assert.equal(shiftDate('2026-12-31', 1), '2027-01-01')
})

test('dateSlug matches the StatMuse query format', () => {
  assert.equal(dateSlug('2026-10-24'), 'october-24-2026')
  assert.equal(dateSlug('2026-11-04'), 'november-04-2026')
})

test('parseYahooChart builds baseline + window closes and appends the live price', () => {
  const day = date => Date.parse(`${date}T14:30:00Z`) / 1000
  const chart = {
    chart: {
      error: null,
      result: [{
        meta: { regularMarketPrice: 105, regularMarketTime: day('2026-11-24'), gmtoffset: 0 },
        timestamp: [day('2026-10-22'), day('2026-10-23'), day('2026-10-26'), day('2026-10-27')],
        indicators: { quote: [{ close: [90, 100, null, 102] }] },
      }],
    },
  }
  const quote = parseYahooChart(chart, '2026-10-24')
  assert.deepEqual(quote.closes, [100, 102, 105]) // baseline Oct 23, null skipped, live price appended
  assert.equal(quote.baselineDate, '2026-10-23')
  assert.equal(quote.start, '2026-10-24')
  assert.equal(quote.asOf, '2026-11-24T14:30:00+00:00')
  assert.equal(quote.source, 'Yahoo')
})

test('parseYahooChart rejects errors, missing baseline and zero baseline', () => {
  assert.equal(parseYahooChart({ chart: { error: { code: 'x' }, result: null } }, '2026-10-24'), null)
  const tooNew = {
    chart: { result: [{ meta: { regularMarketPrice: 5 }, timestamp: [Date.parse('2026-11-01T00:00:00Z') / 1000], indicators: { quote: [{ close: [5] }] } }] },
  }
  assert.equal(parseYahooChart(tooNew, '2026-10-24'), null)
  const zero = {
    chart: { result: [{ meta: { regularMarketPrice: 5 }, timestamp: [Date.parse('2026-10-20T00:00:00Z') / 1000], indicators: { quote: [{ close: [0] }] } }] },
  }
  assert.equal(parseYahooChart(zero, '2026-10-24'), null)
})

test('parseFredCsv returns the last valid observation and skips missing values', () => {
  const csv = 'observation_date,FEDFUNDS\n2026-08-01,3.9\n2026-09-01,3.88\r\n2026-10-01,.\n'
  assert.deepEqual(parseFredCsv(csv), { date: '2026-09-01', value: 3.88 })
  assert.equal(parseFredCsv('observation_date,X\n'), null)
})

test('parseMarketCaps extracts symbol -> cap pairs', () => {
  const html = 'x{s:"AAPL",n:"Apple \\"Inc\\"",industry:"Tech",marketCap:4.1e12},{s:"BRK.B",n:"Berkshire",industry:"Fin",marketCap:1000000}'
  assert.deepEqual(parseMarketCaps(html), { AAPL: 4.1e12, 'BRK.B': 1000000 })
})

test('parseStatmuseReturns reads the embedded chart and scales to percent', () => {
  const options = { xAxis: { categories: ['AAA', 'bad', 'CCC'] }, series: [{ data: [{ name: 'a', y: 0.25 }, { name: 'b', y: 0.1 }, { name: 'error', y: 0.3 }] }] }
  const encoded = JSON.stringify(options).replace(/"/g, '&#34;')
  const html = `<div id="categorical-column-chart" class="x" data-options="${encoded}"></div>`
  assert.deepEqual(parseStatmuseReturns(html), [{ symbol: 'AAA', change: 25 }])
  assert.deepEqual(parseStatmuseReturns('<html></html>'), [])
  assert.equal(decodeHtmlAttribute('a&amp;b &lt;c&gt; &#39;d&#39;'), "a&b <c> 'd'")
})

test('rankMovers keeps large caps with the right sign, ranked by cap', () => {
  const caps = { BIG: 5e11, MID: 2e11, SMALL: 1e9 }
  const returns = [
    { symbol: 'MID', change: 20 }, { symbol: 'BIG', change: 15 }, { symbol: 'SMALL', change: 90 },
    { symbol: 'BIG2', change: 40 }, { symbol: 'DOWN', change: -10 },
  ]
  assert.deepEqual(rankMovers(returns, caps, 'best').map(row => row.symbol), ['BIG', 'MID'])
  assert.deepEqual(rankMovers(returns, { ...caps, DOWN: 3e10 }, 'worst'), [{ symbol: 'DOWN', change: -10, cap: 3e10 }])
  assert.equal(rankMovers(returns, caps, 'best', 1).length, 1)
})

test('buildEarnings dedupes, sorts by cap then symbol, and keeps empty days', () => {
  const calendar = [
    { date: '2026-11-24', symbol: 'ZZZ' }, { date: '2026-11-24', symbol: 'BIG' },
    { date: '2026-11-24', symbol: 'BIG' }, { date: '2026-11-24', symbol: 'AAA' },
  ]
  const result = buildEarnings(calendar, ['2026-11-24', '2026-11-25'], { BIG: 10 }, 3)
  assert.deepEqual(result, { '2026-11-24': ['BIG', 'AAA', 'ZZZ'], '2026-11-25': [] })
})

test('parseFgScoreHtml reads score, rating and as-of date', () => {
  const html = '<svg aria-label="Sentiment score: 17, Extreme Fear"></svg><p class="ic-asof">As of <b>Nov 24, 2026</b> · UTC</p>'
  assert.deepEqual(parseFgScoreHtml(html), { score: 17, rating: 'Extreme Fear', timestamp: 'Nov 24, 2026', source: 'CNN via FGScore' })
  assert.equal(parseFgScoreHtml('<html></html>'), null)
})

test('formatSentimentDate renders CNN ISO timestamps like the FGScore format', () => {
  assert.equal(formatSentimentDate('2026-11-24T23:59:52+00:00'), 'Nov 24, 2026')
  assert.equal(formatSentimentDate('not a date'), 'not a date')
})

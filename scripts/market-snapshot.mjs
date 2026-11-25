// ABOUTME: Regenerates src/lib/market-snapshot.json (the /data/last-31-days dashboard snapshot).
// ABOUTME: Port of the ~/terminal/general data fetchers; run daily by .github/workflows/market-snapshot.yml.

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const SNAPSHOT_PATH = fileURLToPath(new URL('../src/lib/market-snapshot.json', import.meta.url))
const DEFAULT_USER_AGENT = 'market-cli/1.0'
const REQUEST_TIMEOUT_MS = 15_000
const YAHOO_CONCURRENCY = 4
const MIN_QUOTE_SUCCESS_RATIO = 0.8
const LARGE_CAP_MINIMUM = 10_000_000_000

export const QUOTE_SYMBOLS = [
  'SPY', 'QQQ', '^VIX', '^IXIC', '^DJI', 'IWM', 'EURUSD=X', 'JPY=X', 'GBPUSD=X', 'BTC-USD',
  '^IRX', '^FVX', '^TNX', '^TYX', 'CL=F', 'NG=F', 'GC=F', 'ES=F', 'NQ=F', 'YM=F', 'RTY=F',
  'SI=F', '^GSPC', '^GSPTSE', '^BVSP', '^FTSE', '^GDAXI', '^FCHI', '^N225', '^HSI', '000001.SS',
  '^NSEI', '^AXJO', '^KS11',
]
export const MACRO_SERIES = ['FEDFUNDS', 'CPIAUCSL', 'UNRATE']

const marketDateFormat = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/New_York' })
const monthSlugFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', month: 'long', day: '2-digit', year: 'numeric',
})

// ---------- pure helpers (unit-tested) ----------

export function shiftDate(date, days) {
  const utc = new Date(`${date}T00:00:00Z`)
  utc.setUTCDate(utc.getUTCDate() + days)
  return utc.toISOString().slice(0, 10)
}

export function marketWindow(now = new Date()) {
  const end = marketDateFormat.format(now)
  return { start: shiftDate(end, -31), end }
}

// StatMuse query slug, e.g. "2026-10-24" -> "october-24-2026".
export function dateSlug(isoDate) {
  const parts = Object.fromEntries(
    monthSlugFormat.formatToParts(new Date(`${isoDate}T12:00:00Z`)).map(({ type, value }) => [type, value]),
  )
  return `${parts.month}-${parts.day}-${parts.year}`.toLowerCase()
}

// Converts a Yahoo v8 chart response into { closes, baselineDate, start, asOf, source }.
// closes = [last close on/before window start, ...closes after it, live price if it differs].
export function parseYahooChart(payload, windowStart) {
  const result = payload?.chart?.result?.[0]
  if (payload?.chart?.error || !result) return null
  const price = result.meta?.regularMarketPrice
  if (typeof price !== 'number') return null

  const offset = result.meta.gmtoffset ?? 0
  const rawCloses = result.indicators?.quote?.[0]?.close ?? []
  const points = (result.timestamp ?? [])
    .map((timestamp, index) => ({
      date: new Date((timestamp + offset) * 1000).toISOString().slice(0, 10),
      close: rawCloses[index],
    }))
    .filter(point => typeof point.close === 'number')

  const baseline = points.findLast(point => point.date <= windowStart)
  if (!baseline || baseline.close === 0) return null

  const closes = [baseline.close, ...points.filter(point => point.date > windowStart).map(point => point.close)]
  if (closes.at(-1) !== price) closes.push(price)

  const marketTime = result.meta.regularMarketTime
  return {
    closes,
    baselineDate: baseline.date,
    start: windowStart,
    asOf: marketTime ? new Date(marketTime * 1000).toISOString().replace(/\.\d+Z$/, '+00:00') : null,
    source: 'Yahoo',
  }
}

// Last well-formed "YYYY-..,number" row of a FRED fredgraph.csv.
export function parseFredCsv(csv) {
  let latest = null
  for (const line of csv.split('\n')) {
    const [date, value] = line.trim().split(',')
    if (/^\d{4}-/.test(date ?? '') && /^\d+(\.\d+)?$/.test(value ?? '')) latest = { date, value: Number(value) }
  }
  return latest
}

// stockanalysis.com embeds `s:"SYM",n:"...",industry:"...",marketCap:123` per row.
export function parseMarketCaps(html) {
  const caps = {}
  const pattern = /s:"([A-Z0-9.^/-]+)",n:"(?:[^"\\]|\\.)*",industry:"(?:[^"\\]|\\.)*",marketCap:([0-9.eE+-]+)/g
  for (const [, symbol, cap] of html.matchAll(pattern)) caps[symbol] = Number(cap)
  return caps
}

export function decodeHtmlAttribute(value) {
  return value
    .replace(/&#34;|&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

// StatMuse page -> [{ symbol, change (percent) }] from the embedded column chart.
export function parseStatmuseReturns(html) {
  const match = html.match(/id="categorical-column-chart"[^>]*data-options="([^"]+)"/s)
  if (!match) return []
  const chart = JSON.parse(decodeHtmlAttribute(match[1]))
  const categories = chart.xAxis?.categories ?? []
  return (chart.series?.[0]?.data ?? [])
    .map((entry, index) => ({ entry, symbol: categories[index] }))
    .filter(({ entry, symbol }) => !/error/i.test(entry.name ?? '') && typeof entry.y === 'number'
      && typeof symbol === 'string' && /^[A-Z][A-Z0-9.^/-]{0,14}$/.test(symbol))
    .map(({ entry, symbol }) => ({ symbol, change: entry.y * 100 }))
}

export function rankMovers(returns, caps, direction, limit = 20) {
  return returns
    .filter(({ symbol, change }) => (caps[symbol] ?? 0) >= LARGE_CAP_MINIMUM
      && (direction === 'best' ? change > 0 : change < 0))
    .map(({ symbol, change }) => ({ symbol, change, cap: Math.round(caps[symbol]) }))
    .sort((a, b) => b.cap - a.cap)
    .slice(0, limit)
}

export function buildEarnings(calendar, dates, caps, limit = 8) {
  return Object.fromEntries(dates.map(date => {
    const symbols = [...new Set(calendar.filter(row => row.date === date).map(row => row.symbol))]
    symbols.sort((a, b) => (caps[b] ?? 0) - (caps[a] ?? 0) || a.localeCompare(b))
    return [date, symbols.slice(0, limit)]
  }))
}

// CNN returns an ISO timestamp; the dashboard shows "Nov 24, 2026".
export function formatSentimentDate(timestamp) {
  const parsed = new Date(timestamp)
  if (Number.isNaN(parsed.getTime())) return String(timestamp)
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

export function parseFgScoreHtml(html) {
  const gauge = html.match(/aria-label="Sentiment score: ([0-9.]+), ([^"]+)"/)
  const asOf = html.match(/<p class="ic-asof">(.*?)<\/p>/s)
  if (!gauge || !asOf) return null
  const timestamp = asOf[1].replace(/<[^>]*>/g, '').replace(/^As of\s*/, '').replace(/\s*·\s*UTC/, '').trim()
  const score = Number(gauge[1])
  return score >= 0 && score <= 100 ? { score, rating: gauge[2], timestamp, source: 'CNN via FGScore' } : null
}

// ---------- network ----------

async function httpGet(url, { headers = { 'User-Agent': DEFAULT_USER_AGENT }, format = 'text' } = {}) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch(url, { headers, redirect: 'follow', signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
    if (response.status === 429 && attempt === 0) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      continue
    }
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
    return response[format]()
  }
  throw new Error('rate limited')
}

// Runs a section loader; on failure logs a warning and returns null so the caller keeps the previous value.
async function section(name, loader) {
  try {
    const value = await loader()
    if (value === null || value === undefined) throw new Error('empty result')
    return value
  } catch (error) {
    console.warn(`WARN  ${name}: ${error.message} (keeping previous value)`)
    return null
  }
}

async function fetchQuote(symbol, window, now) {
  const from = Math.floor(now.getTime() / 1000) - 39 * 86_400
  const to = Math.floor(now.getTime() / 1000)
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&period1=${from}&period2=${to}`
  const quote = parseYahooChart(await httpGet(url, { format: 'json' }), window.start)
  if (!quote) throw new Error('unusable chart data')
  return quote
}

async function fetchQuotes(window, now, previous) {
  const quotes = { ...previous }
  let refreshed = 0
  const queue = [...QUOTE_SYMBOLS]
  await Promise.all(Array.from({ length: YAHOO_CONCURRENCY }, async () => {
    for (let symbol = queue.shift(); symbol; symbol = queue.shift()) {
      const quote = await section(`quote ${symbol}`, () => fetchQuote(symbol, window, now))
      if (quote) {
        quotes[symbol] = quote
        refreshed += 1
      }
    }
  }))
  return { quotes, refreshed }
}

async function fetchMacro() {
  const entries = await Promise.all(MACRO_SERIES.map(async series => {
    const latest = parseFredCsv(await httpGet(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${series}`))
    if (!latest) throw new Error(`no data for ${series}`)
    return [series, latest]
  }))
  return Object.fromEntries(entries)
}

async function fetchNowflation() {
  const [realtime, nextPrint] = await Promise.all([
    httpGet('https://nowflation.com/data/realtime.json', { format: 'json' }),
    httpGet('https://nowflation.com/data/nextprint.json', { format: 'json' }),
  ])
  const forecast = nextPrint.benchmarks?.find(row => row.forecaster === 'fmc_ensemble' && row.target === 'cpi_headline_yoy')
  const observation = (value, date) => (typeof value === 'number' ? { value, date } : undefined)
  const result = {
    realtime: observation(realtime.today?.realtime_yoy_pct, realtime.today?.date),
    gauge: observation(realtime.today?.cpi_gauge_yoy_pct, realtime.today?.date),
    forecast: observation(forecast?.value, nextPrint.print_month),
  }
  return Object.values(result).some(Boolean) ? result : null
}

async function fetchEarnings(window, caps) {
  const key = process.env.FINNHUB_KEY
  if (!key) throw new Error('FINNHUB_KEY not set')
  const dates = [0, 1, 2].map(offset => shiftDate(window.end, offset))
  const url = `https://finnhub.io/api/v1/calendar/earnings?from=${dates[0]}&to=${dates.at(-1)}&token=${key}`
  const { earningsCalendar } = await httpGet(url, { format: 'json' })
  if (!Array.isArray(earningsCalendar)) throw new Error('unexpected calendar response')
  return buildEarnings(earningsCalendar, dates, caps)
}

async function fetchMovers(window, caps) {
  const rows = {}
  for (const direction of ['best', 'worst']) {
    const slug = `${direction}-performing-large-cap-stocks-between-${dateSlug(window.start)}-and-${dateSlug(window.end)}`
    const returns = parseStatmuseReturns(await httpGet(`https://www.statmuse.com/money/ask/${slug}`))
    const ranked = rankMovers(returns, caps, direction)
    if (!ranked.length) throw new Error(`no ${direction} movers`)
    rows[direction] = { window: `${window.start} → ${window.end}`, rows: ranked }
  }
  return rows
}

async function fetchSentiment() {
  try {
    const { fear_and_greed: gauge } = await httpGet('https://production.dataviz.cnn.io/index/fearandgreed/graphdata', {
      format: 'json',
      headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.cnn.com/', Origin: 'https://www.cnn.com' },
    })
    if (typeof gauge?.score === 'number' && gauge.score >= 0 && gauge.score <= 100 && typeof gauge.rating === 'string') {
      return { score: gauge.score, rating: gauge.rating, timestamp: formatSentimentDate(gauge.timestamp), source: 'CNN' }
    }
  } catch {
    // CNN often blocks datacenter IPs; fall through to the FGScore mirror.
  }
  return parseFgScoreHtml(await httpGet('https://fgscore.com/en/markets/sp500', { headers: {} }))
}

// ---------- main ----------

async function loadPreviousSnapshot() {
  try {
    return JSON.parse(await readFile(SNAPSHOT_PATH, 'utf8'))
  } catch {
    return {}
  }
}

export async function buildSnapshot(now = new Date(), previous = {}) {
  const window = marketWindow(now)
  const { quotes, refreshed } = await fetchQuotes(window, now, previous.quotes)
  if (refreshed / QUOTE_SYMBOLS.length < MIN_QUOTE_SUCCESS_RATIO) {
    throw new Error(`only ${refreshed}/${QUOTE_SYMBOLS.length} quotes refreshed; refusing to write a stale snapshot`)
  }

  const caps = await section('market caps', async () => {
    const parsed = parseMarketCaps(await httpGet('https://stockanalysis.com/stocks/?count=10000', { headers: {} }))
    return Object.keys(parsed).length ? parsed : null
  })

  const [macro, nowflation, earnings, movers, sentiment] = await Promise.all([
    section('macro', fetchMacro),
    section('nowflation', fetchNowflation),
    caps && section('earnings', () => fetchEarnings(window, caps)),
    caps && section('movers', () => fetchMovers(window, caps)),
    section('sentiment', fetchSentiment),
  ])
  if (!caps) console.warn('WARN  earnings/movers skipped: market caps unavailable (keeping previous values)')

  return {
    capturedAt: now.toISOString(),
    start: window.start,
    end: window.end,
    quotes,
    macro: macro ?? previous.macro,
    nowflation: nowflation ?? previous.nowflation,
    earnings: earnings ?? previous.earnings,
    earningsSortedByCap: true,
    movers: movers ?? previous.movers,
    sentiment: sentiment ?? previous.sentiment,
  }
}

async function main() {
  const previous = await loadPreviousSnapshot()
  const snapshot = await buildSnapshot(new Date(), previous)
  await writeFile(SNAPSHOT_PATH, `${JSON.stringify(snapshot)}\n`)
  console.log(`Wrote snapshot captured ${snapshot.capturedAt} (${Object.keys(snapshot.quotes).length} quotes)`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(`ERROR ${error.message}`)
    process.exit(1)
  })
}

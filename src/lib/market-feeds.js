const MINUTE = 60_000
const marketDateFormat = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/New_York' })

function shiftDate(date, days) {
  const utc = new Date(date + 'T00:00:00Z')
  utc.setUTCDate(utc.getUTCDate() + days)
  return utc.toISOString().slice(0, 10)
}

export function marketWindow(now = new Date()) {
  const end = marketDateFormat.format(now)
  return { start: shiftDate(end, -31), buffer: shiftDate(end, -39), end }
}

async function request(url, signal, format = 'json') {
  const response = await fetch(url, {
    credentials: 'omit',
    signal: AbortSignal.any([signal, AbortSignal.timeout(12_000)]),
  })
  if (!response.ok) throw new Error('Market feed unavailable')
  return response[format]()
}

function quoteFromPoints(points, { start, end }, source) {
  const sorted = points
    .filter(([date, value]) => typeof date === 'string' && date <= end && Number.isFinite(value))
    .sort(([a], [b]) => a.localeCompare(b))
  const baseline = sorted.findLastIndex(([date]) => date <= start)
  if (baseline < 0 || baseline === sorted.length - 1 || sorted[baseline][1] === 0) return null
  if (sorted.at(-1)[0] < shiftDate(end, -7)) return null
  return {
    closes: sorted.slice(baseline).map(([, value]) => value),
    baselineDate: sorted[baseline][0],
    start,
    asOf: sorted.at(-1)[0],
    source,
  }
}

function observation(value, date, source) {
  return Number.isFinite(value) && typeof date === 'string' && date
    ? { value, date, source }
    : null
}

async function loadFx(signal, window) {
  const url = `https://api.frankfurter.dev/v1/${window.buffer}..${window.end}?base=USD&symbols=EUR,JPY,GBP`
  const { rates } = await request(url, signal)
  if (!rates) return null
  const rows = Object.entries(rates)
  const symbols = [
    ['EURUSD=X', 'EUR', true],
    ['JPY=X', 'JPY', false],
    ['GBPUSD=X', 'GBP', true],
  ]
  return Object.fromEntries(symbols.flatMap(([symbol, currency, invert]) => {
    const points = rows.map(([date, values]) => [date, invert ? 1 / values[currency] : values[currency]])
    const quote = quoteFromPoints(points, window, 'Frankfurter')
    return quote ? [[symbol, quote]] : []
  }))
}

async function loadBitcoin(signal, window) {
  const params = new URLSearchParams({ granularity: '86400', start: window.buffer + 'T00:00:00Z', end: new Date().toISOString() })
  const candles = await request('https://api.exchange.coinbase.com/products/BTC-USD/candles?' + params, signal)
  if (!Array.isArray(candles)) return null
  const points = candles
    .filter(row => Array.isArray(row) && Number.isFinite(row[0]))
    .map(([timestamp, , , , close]) => [new Date(timestamp * 1000).toISOString().slice(0, 10), close])
  const quote = quoteFromPoints(points, window, 'Coinbase')
  return quote ? { 'BTC-USD': quote } : null
}

async function loadTreasury(signal, window, bills = false) {
  const dataset = bills ? 'daily_treasury_bill_rates' : 'daily_treasury_yield_curve'
  const months = [...new Set([window.buffer, window.start, window.end].map(date => date.slice(0, 7).replace('-', '')))]
  const feeds = await Promise.allSettled(months.map(month => request(
    `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=${dataset}&field_tdr_date_value_month=${month}`,
    signal, 'text',
  )))
  const rows = feeds.flatMap(feed => {
    if (feed.status !== 'fulfilled') return []
    const xml = new DOMParser().parseFromString(feed.value, 'application/xml')
    return Array.from(xml.getElementsByTagNameNS('*', 'properties'))
  })
  const read = (row, name) => row.getElementsByTagNameNS('*', name)[0]?.textContent?.trim()
  const fields = bills ? [['^IRX', 'ROUND_B1_CLOSE_13WK_2']] : [
    ['^FVX', 'BC_5YEAR'],
    ['^TNX', 'BC_10YEAR'],
    ['^TYX', 'BC_30YEAR'],
  ]
  return Object.fromEntries(fields.flatMap(([symbol, field]) => {
    const points = rows.map(row => {
      const raw = read(row, field)
      const date = read(row, bills ? 'INDEX_DATE' : 'NEW_DATE')
      return [date?.slice(0, 10), raw ? Number(raw) : NaN]
    })
    const quote = quoteFromPoints(points, window, bills ? 'U.S. Treasury (bank discount)' : 'U.S. Treasury')
    return quote ? [[symbol, quote]] : []
  }))
}

async function loadBls(signal, series) {
  const result = await request('https://api.bls.gov/publicAPI/v2/timeseries/data/' + series, signal)
  const item = result.Results?.series?.[0]?.data?.find(row => /^M(0[1-9]|1[0-2])$/.test(row.period))
  return item && observation(Number(item.value), `${item.year}-${item.period.slice(1)}-01`, 'BLS')
}

async function loadFedFunds(signal) {
  const data = await request('https://markets.newyorkfed.org/api/rates/unsecured/effr/last/1.json', signal)
  const rate = data.refRates?.[0]
  return rate && observation(rate.percentRate, rate.effectiveDate, 'New York Fed')
}

async function loadInflationToday(signal) {
  const { today } = await request('https://nowflation.com/data/realtime.json', signal)
  if (!today) return null
  const realtime = observation(today.realtime_yoy_pct, today.date, 'Nowflation')
  const gauge = observation(today.cpi_gauge_yoy_pct, today.date, 'Nowflation')
  return { ...(realtime && { realtime }), ...(gauge && { gauge }) }
}

async function loadInflationForecast(signal) {
  const data = await request('https://nowflation.com/data/nextprint.json', signal)
  const forecast = data.benchmarks?.find(row => row.forecaster === 'fmc_ensemble' && row.target === 'cpi_headline_yoy')
  return forecast && observation(forecast.value, data.print_month, 'Nowflation')
}

export const marketFeeds = [
  { id: 'fx', interval: 15 * MINUTE, load: loadFx },
  { id: 'bitcoin', interval: MINUTE, load: loadBitcoin },
  { id: 'treasury', interval: 15 * MINUTE, load: loadTreasury },
  { id: 'treasuryBill', interval: 15 * MINUTE, load: (signal, window) => loadTreasury(signal, window, true) },
  { id: 'cpi', interval: 360 * MINUTE, load: signal => loadBls(signal, 'CUSR0000SA0') },
  { id: 'unemployment', interval: 360 * MINUTE, load: signal => loadBls(signal, 'LNS14000000') },
  { id: 'fedFunds', interval: 15 * MINUTE, load: loadFedFunds },
  { id: 'inflation', interval: 15 * MINUTE, load: loadInflationToday },
  { id: 'forecast', interval: 15 * MINUTE, load: loadInflationForecast },
]

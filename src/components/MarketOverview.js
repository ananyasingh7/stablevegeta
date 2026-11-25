'use client'

import { useEffect, useState } from 'react'
import { marketFeeds, marketWindow } from '../lib/market-feeds'
import snapshot from '../lib/market-snapshot.json'
import { worldMap } from '../lib/market-world-map'
import './market-overview.css'

const charts = [
  ['SPY', 'SPY', 'SPY'],
  ['QQQ', 'QQQ', 'QQQ'],
  ['^VIX', 'VIX', 'VIX'],
  ['^IXIC', 'NASDAQ', 'Nasdaq Composite'],
  ['^DJI', 'DOW JONES', 'Dow Jones'],
  ['IWM', 'RUSSELL 2000', 'Russell 2000 ETF'],
]

const forex = [
  ['EURUSD=X', 'EUR/USD', 4],
  ['JPY=X', 'USD/JPY', 2],
  ['GBPUSD=X', 'GBP/USD', 4],
  ['BTC-USD', 'BTC/USD', 2],
  // The fourth entry is a short label for quote panels too narrow for the full name.
  ['^IRX', '13-week Treasury', 3, '13W T-Bill'],
  ['^FVX', '5-year Treasury', 3, '5Y Note'],
  ['^TNX', '10-year Treasury', 3, '10Y Note'],
  ['^TYX', '30-year Treasury', 3, '30Y Bond'],
]

const futures = [
  ['CL=F', 'Crude Oil', 2],
  ['NG=F', 'Natural Gas', 4],
  ['GC=F', 'Gold', 2],
  ['SI=F', 'Silver', 2],
  ['ES=F', 'S&P 500', 2],
  ['NQ=F', 'Nasdaq 100', 2],
  ['YM=F', 'Dow Jones', 2],
  ['RTY=F', 'Russell 2000', 2],
]

const indices = {
  CA: ['^GSPTSE', 'TSX'], US: ['^GSPC', 'SPX'], BR: ['^BVSP', 'BVSP'], UK: ['^FTSE', 'FTSE'],
  FR: ['^FCHI', 'CAC'], DE: ['^GDAXI', 'DAX'], IN: ['^NSEI', 'NIFTY'], CN: ['000001.SS', 'SSEC'],
  HK: ['^HSI', 'HSI'], KR: ['^KS11', 'KOSPI'], JP: ['^N225', 'N225'], AU: ['^AXJO', 'ASX'],
}

const marketTime = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York', dateStyle: 'short', timeStyle: 'medium', hour12: false,
})
const direction = value => value == null ? '' : value < 0 ? 'market-down' : 'market-up'
const fixed = (value, precision = 2) => value == null ? '—' : value.toFixed(precision)
const signed = (value, precision = 2) => value == null ? '—' : (value >= 0 ? '+' : '') + fixed(value, precision)
const percentage = value => value == null ? '—' : signed(value) + '%'

function quoteChange(quote) {
  if (!quote?.closes?.length) return { last: null, difference: null, percent: null }
  const last = quote.closes.at(-1)
  const baseline = quote.closes[0]
  const difference = last - baseline
  return { last, difference, percent: baseline ? difference / baseline * 100 : null }
}

function useBrowserMarketFeeds() {
  const [feeds, setFeeds] = useState({})

  useEffect(() => {
    const controller = new AbortController()
    const timers = new Map()

    async function refresh(feed) {
      const window = marketWindow()
      try {
        if (!document.hidden || !timers.has(feed.id)) {
          const value = await feed.load(controller.signal, window)
          if (value && Object.keys(value).length && !controller.signal.aborted) {
            setFeeds(current => ({ ...current, [feed.id]: { value, window } }))
          }
        }
      } catch {
        // Keep the most recent usable data for this feed.
      } finally {
        if (!controller.signal.aborted) {
          timers.set(feed.id, setTimeout(() => refresh(feed), feed.interval))
        }
      }
    }

    marketFeeds.forEach(refresh)
    return () => {
      controller.abort()
      timers.forEach(clearTimeout)
    }
  }, [])

  return feeds
}

function Panel({ title, className = '', children }) {
  return (
    <section className={`market-panel ${className}`}>
      <h3>{title}</h3>
      <div className="market-panel-body">{children}</div>
    </section>
  )
}

function TerminalChart({ chart, quote }) {
  const [, title, label] = chart
  const values = quote?.closes ?? []
  const { last, difference, percent } = quoteChange(quote)
  const color = direction(difference)
  const low = Math.min(...values)
  const high = Math.max(...values)
  const count = Math.min(25, values.length)
  const levels = Array.from({ length: count }, (_, index) => {
    const value = values[count === 1 ? 0 : Math.floor(index * (values.length - 1) / (count - 1))]
    return high === low ? 20 : 1 + Math.floor((value - low) / (high - low) * 39)
  })

  return (
    <Panel title={title + ' · 31d'} className="market-chart">
      <div className="market-chart-heading">
        <strong>{label}</strong>
        <strong className={color}>{fixed(last)}</strong>
      </div>
      {count ? (
        <div className="market-chart-plot" role="img" aria-label={`${label}, ${fixed(last)}, ${percentage(percent)} over 31 days`}>
          <div className="market-chart-scale" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => <span key={index}>{fixed(high - (high - low) * index / 4)}</span>)}
          </div>
          <div className={`market-chart-bars ${color}`} style={{ '--bar-count': count }} aria-hidden="true">
            {levels.map((level, index) => <span key={index} style={{ height: level * 2.5 + '%' }} />)}
          </div>
          <div className="market-chart-range" aria-hidden="true"><span>start</span><span>latest</span></div>
        </div>
      ) : <p className="market-dim">quote unavailable</p>}
    </Panel>
  )
}

function QuoteTable({ title, rows, quotes, className }) {
  return (
    <Panel title={title} className={className}>
      <table className="market-table market-quote-table">
        <thead><tr><th scope="col">Instrument</th><th scope="col">Last</th><th scope="col">31d change</th><th scope="col">31d %</th></tr></thead>
        <tbody>
          {rows.map(([symbol, name, decimals, shortName]) => {
            const quote = quotes[symbol]
            const { last, difference, percent } = quoteChange(quote)
            const source = quote && `${quote.source} · ${quote.start} to ${quote.asOf?.slice(0, 10) ?? snapshot.end}`
            return (
              <tr key={symbol} title={source}>
                <th scope="row">
                  {shortName ? (
                    <><span className="market-label-full">{name}</span><span className="market-label-short">{shortName}</span></>
                  ) : name}
                  {quote?.source !== 'Yahoo' && quote && <sup className="market-source-mark">*</sup>}
                </th>
                <td>{fixed(last, decimals)}</td>
                <td className={direction(difference)}>{signed(difference, decimals)}</td>
                <td className={direction(percent)}>{percentage(percent)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Panel>
  )
}

function MacroPanel({ feeds }) {
  const inflation = { ...snapshot.nowflation, ...feeds.inflation?.value }
  const rows = [
    ['Fed Funds Rate', feeds.fedFunds?.value ?? snapshot.macro.FEDFUNDS, 2, '%'],
    ['CPI index', feeds.cpi?.value ?? snapshot.macro.CPIAUCSL, 3, ''],
    ['Unemployment', feeds.unemployment?.value ?? snapshot.macro.UNRATE, 1, '%'],
    ['NF realtime YoY', inflation.realtime, 2, '%'],
    ['NF CPI gauge YoY', inflation.gauge, 2, '%'],
    ['NF CPI forecast YoY', feeds.forecast?.value ?? snapshot.nowflation.forecast, 2, '%', 'for'],
  ]
  return (
    <Panel title="MACRO · latest observations" className="market-macro">
      <dl className="market-macro-rows">
        {rows.map(([label, item, decimals, unit, timing = 'as of']) => (
          <div key={label} title={item?.source}>
            <dt>{label}{item?.source && <sup className="market-source-mark">*</sup>}</dt>
            <dd>{item ? <>{`${fixed(item.value, decimals)}${unit} `}<span className="market-nowrap">({timing} {item.date})</span></> : '—'}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  )
}

function EarningsPanel() {
  return (
    <Panel title="EARNINGS · 3-day calendar snapshot" className="market-earnings">
      <table className="market-table market-calendar">
        <thead><tr><th scope="col">Date</th><th scope="col">Earnings release{snapshot.earningsSortedByCap && ' (cap ↓)'}</th></tr></thead>
        <tbody>
          {Object.entries(snapshot.earnings ?? {}).map(([date, symbols]) => (
            <tr key={date}><th scope="row">{date}</th><td>{symbols.length ? symbols.join(' ') : 'No releases scheduled'}</td></tr>
          ))}
        </tbody>
      </table>
      {!snapshot.earnings && <p className="market-dim">Calendar unavailable</p>}
    </Panel>
  )
}

function WorldPanel() {
  return (
    <Panel title="WORLD INDICES · 31-day change" className="market-world">
      <pre className="market-world-map" aria-hidden="true">
        {worldMap.map((line, row) => (
          <span key={row}>
            {line.split(/(@[A-Z]{2}@)/).map((part, index) => {
              if (!part.startsWith('@')) return part
              const country = part.slice(1, 3)
              const { percent } = quoteChange(snapshot.quotes[indices[country][0]])
              return <span className={direction(percent)} key={index}>{country + ' ' + percentage(percent).padStart(7)}</span>
            })}
            {'\n'}
          </span>
        ))}
      </pre>
      <ul className="market-world-values" role="list">
        {Object.entries(indices).map(([country, [symbol, name]]) => {
          const { percent } = quoteChange(snapshot.quotes[symbol])
          return <li key={country}>{country} {name} <span className={direction(percent)}>{percentage(percent)}</span></li>
        })}
      </ul>
      <div className="market-world-key market-dim">
        <p>CA TSX · US SPX · BR BVSP · UK FTSE · FR CAC · DE DAX</p>
        <p>IN NIFTY · CN SSEC · HK HSI · KR KOSPI · JP N225 · AU ASX</p>
        <p>31-day % change; non-trading start dates use prior close.</p>
      </div>
    </Panel>
  )
}

function Movers({ best }) {
  const movers = snapshot.movers[best ? 'best' : 'worst']
  return (
    <Panel title={`LARGE-CAP ${best ? 'GAINERS' : 'LOSERS'} · 31d`} className="market-movers">
      <p>{movers?.window ?? 'Rolling 31 calendar days'}</p>
      <p className="market-dim">$10B+ · sorted by market cap</p>
      <table className="market-table">
        <thead><tr><th scope="col">Ticker</th><th scope="col">Cap</th><th scope="col">31d</th></tr></thead>
        <tbody>
          {movers?.rows.map(({ symbol, cap, change }) => (
            <tr key={symbol}>
              <th scope="row">{symbol}</th>
              <td>{cap >= 1e12 ? fixed(cap / 1e12) + 'T' : fixed(cap / 1e9, 1) + 'B'}</td>
              <td className={direction(change)}>{percentage(change)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!movers && <p className="market-dim">Rankings unavailable</p>}
    </Panel>
  )
}

function Sentiment() {
  const item = snapshot.sentiment
  const color = item?.score < 45 ? 'market-down' : item?.score < 56 ? 'market-neutral' : 'market-up'
  return (
    <Panel title="FEAR & GREED" className="market-sentiment">
      {item ? (
        <>
          <p className={color}><strong>{Math.round(item.score)} / 100&nbsp; {item.rating.toUpperCase()}</strong></p>
          <div className="market-gauge" aria-hidden="true"><span className={color} style={{ left: item.score + '%' }} /></div>
          <div className="market-gauge-labels market-dim"><span>0 Fear</span><span>50</span><span>Greed 100</span></div>
          <p title={item.source}>As of {item.timestamp}</p>
        </>
      ) : <p className="market-dim">Sentiment unavailable</p>}
    </Panel>
  )
}

export default function MarketOverview() {
  const feeds = useBrowserMarketFeeds()
  const quotes = {
    ...snapshot.quotes,
    ...feeds.fx?.value,
    ...feeds.bitcoin?.value,
    ...feeds.treasury?.value,
    ...feeds.treasuryBill?.value,
  }
  const fetchedWindow = [feeds.fx, feeds.bitcoin, feeds.treasury, feeds.treasuryBill]
    .filter(Boolean)
    .map(feed => feed.window)
    .sort((left, right) => right.end.localeCompare(left.end))[0]

  return (
    <section className="market-terminal" aria-labelledby="market-overview-title">
      <header className="market-header">
        <h2 id="market-overview-title">GENERAL / MARKET OVERVIEW</h2>
        <p className="market-dim">Snapshot {marketTime.format(new Date(snapshot.capturedAt))} ET · Yahoo · FRED · Nowflation · quotes may be delayed</p>
      </header>
      <p className="market-window-line market-dim">Market window: {snapshot.start} → {snapshot.end} · prior close used on non-trading start dates</p>
      <div className="market-dashboard">
        <div className="market-main">
          <div className="market-charts">
            {charts.map(chart => <TerminalChart key={chart[0]} chart={chart} quote={quotes[chart[0]]} />)}
          </div>
          <div className="market-lower">
            <MacroPanel feeds={feeds} />
            <EarningsPanel />
            <QuoteTable title="FOREX & TREASURIES · 31d" rows={forex} quotes={quotes} className="market-forex" />
            <QuoteTable title="FUTURES · 31d" rows={futures} quotes={quotes} className="market-futures" />
            <WorldPanel />
          </div>
        </div>
        <aside className="market-side" aria-label="Market movers and sentiment">
          <Movers best />
          <Movers />
          <Sentiment />
        </aside>
      </div>
      <footer className="market-footer market-dim">
        <p>Unmarked values use the dated terminal snapshot. * Refreshed in browser; sources and quote dates are shown on each marked row.</p>
        {fetchedWindow && <p>Browser quote window: {fetchedWindow.start} → {fetchedWindow.end} · Treasury changes are in yield points.</p>}
      </footer>
    </section>
  )
}

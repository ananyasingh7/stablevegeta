const LEVEL_COLORS = {
  0: '#1c1c1c',
  1: '#0e4429',
  2: '#006d32',
  3: '#26a641',
  4: '#39d353',
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export async function ContributionGraph({ username }) {
  let weeks = []
  let total = 0

  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    total = data.total?.lastYear ?? 0

    // Build a date → contribution map
    const contribMap = {}
    for (const c of data.contributions ?? []) {
      contribMap[c.date] = c
    }

    // Build 53-week grid starting from the most recent complete Sunday
    const today = new Date()
    const end = new Date(today)
    // Advance to next Saturday so we show a full last week
    while (end.getDay() !== 6) end.setDate(end.getDate() + 1)

    const start = new Date(end)
    start.setDate(end.getDate() - 52 * 7)
    // Rewind to the previous Sunday
    while (start.getDay() !== 0) start.setDate(start.getDate() - 1)

    const cur = new Date(start)
    while (cur <= end) {
      const week = []
      for (let d = 0; d < 7; d++) {
        const dateStr = cur.toISOString().split('T')[0]
        week.push(contribMap[dateStr] ?? { date: dateStr, count: 0, level: 0 })
        cur.setDate(cur.getDate() + 1)
      }
      weeks.push(week)
    }
  } catch {
    return null
  }

  if (!weeks.length) return null

  // Compute month label positions (column index where each new month starts)
  const monthLabels = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const month = new Date(week[0].date).getMonth()
    if (month !== lastMonth) {
      monthLabels.push({ wi, label: MONTHS[month] })
      lastMonth = month
    }
  })

  const CELL = 12   // px per cell
  const GAP = 3     // px gap between cells
  const STEP = CELL + GAP

  const svgWidth = weeks.length * STEP
  const svgHeight = 7 * STEP + 20 // +20 for month labels at top

  return (
    <section className="py-12">
      <p className="text-zinc-400 mb-5 text-base">
        <span className="font-bold text-white">{total}</span> contributions in the last year
      </p>
      <div className="overflow-x-auto pb-2">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="block"
          style={{ maxWidth: '100%' }}
        >
          {/* Month labels */}
          {monthLabels.map(({ wi, label }) => (
            <text
              key={`${wi}-${label}`}
              x={wi * STEP}
              y={12}
              fill="#71717a"
              fontSize={10}
              fontFamily="inherit"
            >
              {label}
            </text>
          ))}

          {/* Day labels */}
          {['Mon', 'Wed', 'Fri'].map((label, i) => {
            const row = i === 0 ? 1 : i === 1 ? 3 : 5 // Mon=row1, Wed=row3, Fri=row5
            return (
              <text
                key={label}
                x={-28}
                y={20 + row * STEP + CELL - 2}
                fill="#71717a"
                fontSize={10}
                fontFamily="inherit"
              >
                {label}
              </text>
            )
          })}

          {/* Contribution cells */}
          <g transform={`translate(0, 20)`}>
            {weeks.map((week, wi) =>
              week.map((day, di) => (
                <rect
                  key={`${wi}-${di}`}
                  x={wi * STEP}
                  y={di * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  ry={2}
                  fill={LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0]}
                >
                  <title>{`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}</title>
                </rect>
              ))
            )}
          </g>
        </svg>
      </div>
    </section>
  )
}

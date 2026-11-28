import { useLayoutEffect, useRef, useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

const projects = [
  {
    name: 'llm poker lab',
    summary: 'a research lab built in rust to test how language models play six-handed no-limit texas hold’em and whether they improve with experience.',
    training: 'we’re fine-tuning a local model, inkling 2 mini, with lora adapters trained on synthetic river decisions. the drills teach hand reading and when to bluff.',
    repo: 'https://github.com/ananyasingh7/poker',
    trainingReport: '/blob/main/results/16-inkling-session-002/report.md',
    preview: { src: '/projects/poker-table.png', width: 1449, height: 834, alt: 'poker spectator table showing a live hand and session statistics' },
    showcase: { label: 'read the findings', path: '/blob/main/docs/results.md' },
  },
  {
    name: 'swarms',
    summary: 'a 24/7 swarm of coding agents across claude, codex, grok, opencode, and more. a chief of staff assigns each task to the cheapest capable model and moves work to another harness when quota runs out.',
    repo: 'https://github.com/ananyasingh7/swarms',
    preview: { src: '/projects/swarms-dashboard.png', width: 1572, height: 1330, alt: 'swarms dashboard showing a project board with tasks, team, goal, and the chief of staff' },
    showcase: { label: 'read the guide', path: '/blob/main/README.md' },
  },
  {
    name: 'turboquant mlx',
    summary: 'an implementation of qjl, polarquant, and turboquant for compressing language model kv caches on apple silicon.',
    repo: 'https://github.com/ananyasingh7/turboquant-mlx-',
    showcase: { label: 'see the benchmarks', path: '#benchmark-runs' },
  },
  {
    name: 'polymarket menu bar',
    summary: 'a read-only macos menu bar app for searching polymarket and viewing live prices, charts, and order books.',
    repo: 'https://github.com/ananyasingh7/PolymarketMenuBar',
    preview: { src: '/projects/polymarket-menu-bar.png', width: 910, height: 674, alt: 'polymarket menu bar app with market search, a price chart, and an order book' },
  },
  {
    name: 'halaai',
    summary: 'a local language model server for apple silicon. it keeps a model loaded so multiple apps can share it for chat and streaming.',
    repo: 'https://github.com/ananyasingh7/HalaAI',
    showcase: { label: 'see the architecture', path: '#architecture' },
  },
  {
    name: 'prediction market tracker',
    summary: 'a python command line dashboard for surfacing large polymarket trades by market, time, and trade size.',
    repo: 'https://github.com/ananyasingh7/prediction-market-tracker',
    showcase: { label: 'see the tracker code', path: '/blob/main/main.py' },
  },
  {
    name: 'poker hand analyzer',
    summary: 'a machine learning project that explores the uci poker hand dataset and models how to classify hands.',
    repo: 'https://github.com/ananyasingh7/poker-hand-analyzer',
    showcase: { label: 'open the notebook', path: '/blob/main/notebooks/explore_data.ipynb' },
  },
]

export default function ProjectList() {
  const [pages, setPages] = useState(() => projects.map((_, index) => ({ start: index, end: index + 1 })))
  const [activeProject, setActiveProject] = useState(0)
  const viewport = useRef(null)
  const list = useRef(null)
  const pageIndex = pages.findIndex(({ end }) => activeProject < end)
  const { start, end, oversized } = pages[pageIndex]
  const nextProject = projects[end]

  useLayoutEffect(() => {
    const windowElement = viewport.current
    const listElement = list.current
    const items = Array.from(listElement.children)

    function paginate() {
      const availableHeight = windowElement.clientHeight
      const gap = parseFloat(getComputedStyle(listElement).rowGap)
      const groups = []

      for (let start = 0; start < items.length;) {
        let height = items[start].getBoundingClientRect().height
        let end = start + 1

        while (end < items.length && end - start < 3) {
          const nextHeight = height + gap + items[end].getBoundingClientRect().height
          if (Math.ceil(nextHeight) > availableHeight) break
          height = nextHeight
          end += 1
        }

        groups.push({ start, end, oversized: Math.ceil(height) > availableHeight })
        start = end
      }

      setPages(groups)
    }

    const observer = new ResizeObserver(paginate)
    observer.observe(windowElement)
    items.forEach(item => observer.observe(item))
    paginate()
    return () => observer.disconnect()
  }, [])

  function changePage(direction) {
    const page = pages[pageIndex + direction]
    if (!page) return
    viewport.current.scrollTop = 0
    setActiveProject(page.start)
  }

  return (
    <div className="project-pager">
      <div
        className={oversized ? 'project-window project-window-overflow' : 'project-window'}
        id="project-window"
        ref={viewport}
        tabIndex={oversized ? 0 : undefined}
        aria-label={oversized ? 'Projects on this page' : undefined}
      >
        <ul className="featured-projects" role="list" ref={list}>
          {projects.map(({ name, summary, training, repo, preview, showcase, trainingReport }, index) => {
            const offPage = index < start || index >= end

            return (
              <li className="featured-project" key={repo} inert={offPage} aria-hidden={offPage || undefined}>
                <h2>{name}</h2>
                <p>{summary}</p>
                {training && <p>{training}</p>}
                {preview && (
                  <a
                    className="project-preview-link"
                    href={preview.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open full-size screenshot of ${name}`}
                    style={{ '--preview-ratio': preview.width / preview.height }}
                  >
                    <img className="project-preview" {...preview} />
                  </a>
                )}
                <div className="project-links">
                  <a href={repo} target="_blank" rel="noopener noreferrer">view repo</a>
                  {showcase && (
                    <a href={repo + showcase.path} target="_blank" rel="noopener noreferrer">{showcase.label}</a>
                  )}
                  {trainingReport && (
                    <a href={repo + trainingReport} target="_blank" rel="noopener noreferrer">read the fine-tuning report</a>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="project-peek" aria-hidden="true">
        {nextProject && (
          <>
            <p>{nextProject.name}</p>
            <p>{nextProject.summary}</p>
          </>
        )}
      </div>
      <nav
        className="project-pagination"
        aria-label="Project pages"
        onKeyDown={event => {
          if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
          event.preventDefault()
          changePage(event.key === 'ArrowUp' ? -1 : 1)
        }}
      >
        <button
          type="button"
          aria-label="Previous project page"
          aria-controls="project-window"
          aria-disabled={pageIndex === 0}
          onClick={() => changePage(-1)}
        >
          <FiChevronUp aria-hidden="true" />
        </button>
        <span role="status">
          <span className="sr-only">Project page </span>{pageIndex + 1} / {pages.length}
        </span>
        <button
          type="button"
          aria-label="Next project page"
          aria-controls="project-window"
          aria-disabled={!nextProject}
          onClick={() => changePage(1)}
        >
          <FiChevronDown aria-hidden="true" />
        </button>
      </nav>
    </div>
  )
}

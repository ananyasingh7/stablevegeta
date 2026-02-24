import Image from 'next/image'
import { FaStar, FaCodeBranch, FaExternalLinkAlt } from 'react-icons/fa'
import { getRepos } from '../lib/github'
import { getPostsByType } from '../lib/content'
import { ContributionGraph } from '../components/ContributionGraph'

const GITHUB_USERNAME = 'ananyasingh7'

const CARD_ACCENT_COLORS = [
  'border-b-blue-600',
  'border-b-amber-500',
  'border-b-indigo-500',
]

const EXPERIENCE = [
  {
    initial: 'L',
    bg: 'bg-blue-600',
    title: 'Senior Software Engineer',
    company: 'Lorem Corp',
    period: 'Jan 2025 · Present',
    duration: '1 yr 2 mos',
    bullets: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure.',
    ],
  },
  {
    initial: 'I',
    bg: 'bg-purple-600',
    title: 'Software Engineer',
    company: 'Ipsum Technologies',
    period: 'Jun 2023 · Dec 2024',
    duration: '1 yr 6 mos',
    bullets: [
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
  },
  {
    initial: 'D',
    bg: 'bg-orange-600',
    title: 'Junior Engineer',
    company: 'Dolor Systems',
    period: 'Jan 2022 · May 2023',
    duration: '1 yr 4 mos',
    bullets: [
      'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua fugiat nulla pariatur.',
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores.',
    ],
  },
]

const TALKS = [
  {
    title: 'Lorem Ipsum and the Future of Dolor Sit Amet Systems',
    date: 'Jan 15, 2026',
    description:
      'At Lorem Conference 2026, I present findings on dolor sit amet and its implications for consectetur adipiscing elit in modern distributed systems.',
  },
  {
    title: 'Building AI-Driven Prediction Market Analysis Tools',
    date: 'Nov 3, 2025',
    description:
      'At Ipsum Summit, a talk on building automated tools for analyzing prediction market microstructure and identifying unusual trading patterns.',
  },
]

const FILLER_RESEARCH = [
  {
    title: 'The Microstructure of Wealth Transfer in Prediction Markets',
    date: 'Jan 18, 2026',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    external: false,
  },
  {
    title: 'Dolor Sit Amet: A Framework for Adipiscing Elit Analysis',
    date: 'Mar 8, 2025',
    summary:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia.',
    external: true,
  },
  {
    title: 'Consectetur Adipiscing: Enhancing Output via LLM-Driven Post-processing',
    date: 'Dec 9, 2024',
    summary:
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
    external: true,
  },
]

export default async function Home() {
  const repos = await getRepos(GITHUB_USERNAME)
  const featuredRepos = repos.slice(0, 3)
  const mdResearch = getPostsByType('research')
  const research = mdResearch.length > 0
    ? mdResearch.map((p) => ({ title: p.title, date: p.date, summary: p.summary, external: false, slug: p.slug }))
    : FILLER_RESEARCH

  return (
    <div className="bg-black min-h-screen text-white">

      {/* ── Sticky nav ── */}
      <nav className="sticky top-0 z-50 bg-black border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="#home" className="text-base text-white hover:text-zinc-300 transition-colors">Home</a>
            <a href="#portfolio" className="text-base text-zinc-400 hover:text-white transition-colors">Portfolio</a>
            <a href="#research" className="text-base text-zinc-400 hover:text-white transition-colors">Research</a>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6">

        {/* ── Hero ── */}
        <section id="home" className="pt-14 pb-20 flex items-start justify-between gap-12">
          <div className="flex-1">
            <h1 className="text-6xl font-bold mb-3 tracking-tight">Ananya Singh</h1>
            <p className="text-lg text-zinc-400 mb-6">Developer &amp; Researcher</p>
            <p className="text-base text-zinc-400 leading-8 max-w-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. I&apos;m Ananya Singh, a developer
              passionate about AI, trading systems, and prediction markets. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.
            </p>
          </div>
          <div className="shrink-0">
            <Image
              src="https://picsum.photos/seed/ananya/300/300"
              alt="Ananya Singh"
              width={155}
              height={155}
              className="rounded-full grayscale object-cover"
              priority
            />
          </div>
        </section>

        {/* ── Open-Source Portfolio ── */}
        <section id="portfolio" className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Open-Source Portfolio</h2>
            <a href="/projects" className="text-base text-zinc-400 hover:text-white transition-colors">
              View All →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(featuredRepos.length > 0
              ? featuredRepos
              : [
                  { id: 1, name: 'lorem-ipsum-tool', description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.', stargazers_count: 0, forks_count: 0, html_url: '#' },
                  { id: 2, name: 'dolor-sit-amet', description: 'Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip commodo.', stargazers_count: 0, forks_count: 0, html_url: '#' },
                  { id: 3, name: 'consectetur-lib', description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.', stargazers_count: 0, forks_count: 0, html_url: '#' },
                ]
            ).map((repo, i) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target={repo.html_url === '#' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className={`bg-zinc-950 rounded-lg p-5 border border-zinc-800 border-b-4 ${CARD_ACCENT_COLORS[i % CARD_ACCENT_COLORS.length]} flex flex-col justify-between hover:bg-zinc-900 transition-colors`}
              >
                <div>
                  <p className="font-bold text-white text-base mb-2">{repo.name}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-5 text-zinc-500 text-sm">
                  <span className="flex items-center gap-1.5"><FaStar size={12} />{repo.stargazers_count.toLocaleString()}</span>
                  <span className="flex items-center gap-1.5"><FaCodeBranch size={12} />{repo.forks_count.toLocaleString()}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── GitHub Contributions ── */}
        <ContributionGraph username={GITHUB_USERNAME} />

        {/* ── Research & Publications ── */}
        <section id="research" className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Research &amp; Publications</h2>
            <a href="/research" className="text-base text-zinc-400 hover:text-white transition-colors">View All →</a>
          </div>

          <div>
            {research.map((item, i) => (
              <div key={i}>
                <div className="py-6">
                  <div className="flex items-start justify-between gap-8">
                    <h3 className="text-white font-semibold text-base flex items-center gap-2">
                      {item.title}
                      {item.external && <FaExternalLinkAlt size={12} className="text-zinc-500 shrink-0" />}
                    </h3>
                    <span className="text-zinc-500 text-sm shrink-0">{item.date}</span>
                  </div>
                  <p className="text-zinc-400 text-base mt-2 leading-7">{item.summary}</p>
                </div>
                {i < research.length - 1 && <div className="border-b border-zinc-800" />}
              </div>
            ))}
          </div>
        </section>

        {/* ── Professional Experience ── */}
        <section id="experience" className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Professional Experience</h2>
            <a href="#" className="text-base text-zinc-400 hover:text-white transition-colors">View All →</a>
          </div>

          <div className="space-y-10">
            {EXPERIENCE.map((job, i) => (
              <div key={i} className="flex gap-5">
                <div className={`${job.bg} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0 mt-0.5`}>
                  {job.initial}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-base">
                    {job.title} <span className="text-zinc-500">·</span> {job.company}
                  </p>
                  <p className="text-zinc-500 text-sm mt-1 mb-4">
                    {job.period} <span className="mx-1">·</span> {job.duration}
                  </p>
                  <ul className="space-y-2.5">
                    {job.bullets.map((b, j) => (
                      <li key={j} className="text-zinc-400 text-base leading-7 flex gap-2">
                        <span className="text-zinc-600 shrink-0">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Talks & Presentations ── */}
        <section id="talks" className="py-12">
          <h2 className="text-3xl font-bold mb-8">Talks &amp; Presentations</h2>
          <div>
            {TALKS.map((talk, i) => (
              <div key={i}>
                <div className="py-6">
                  <div className="flex items-start justify-between gap-8">
                    <h3 className="text-white font-semibold text-base">{talk.title}</h3>
                    <span className="text-zinc-500 text-sm shrink-0">{talk.date}</span>
                  </div>
                  <p className="text-zinc-400 text-base mt-2 leading-7">{talk.description}</p>
                </div>
                {i < TALKS.length - 1 && <div className="border-b border-zinc-800" />}
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── Footer ── */}
      <footer className="max-w-4xl mx-auto px-6 py-8 mt-8 border-t border-zinc-800 flex items-center justify-between">
        <p className="text-zinc-500 text-base">© stablevegeta. All Rights Reserved.</p>
        <div className="flex items-center gap-6 text-base text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Resume</a>
          <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </footer>
    </div>
  )
}

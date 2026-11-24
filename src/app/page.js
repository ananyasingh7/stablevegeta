import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import { FiUser, FiGrid, FiFileText, FiBarChart2 } from 'react-icons/fi'

const socials = [
  { label: 'GitHub', href: 'https://github.com/ananyasingh7', Icon: FaGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ananyasingh7/', Icon: FaLinkedin },
  { label: 'X', href: 'https://x.com/TheStableVegeta', Icon: FaXTwitter },
]

const sections = [
  { label: 'about me', Icon: FiUser },
  { label: 'my projects', Icon: FiGrid },
  { label: 'my thoughts', Icon: FiFileText },
  { label: 'data', Icon: FiBarChart2 },
]

const introduction = [
  'hello',
  'i keep a workshop for models and markets.',
  'the work is in projects. the reasoning is in my thoughts.',
  'data is the part that is still moving.',
]

function Introduction() {
  let offset = 0
  return (
    <section className="introduction" aria-label="Introduction">
      {introduction.map((line, index) => {
        const start = offset
        offset += line.length + 5
        const Tag = index === 0 ? 'h1' : 'p'
        return (
          <Tag key={line}>
            <span className="sr-only">{line}</span>
            <span aria-hidden="true">{Array.from(line, (character, position) => (
              <span className="typed-character" style={{ animationDelay: `${(start + position) * 35}ms` }} key={position}>{character}</span>
            ))}</span>
          </Tag>
        )
      })}
    </section>
  )
}

export default function Home() {
  return (
    <main className="portfolio-background">
      <header className="site-header">
        <nav className="socials" aria-label="Social links">
          {socials.map(({ label, href, Icon }) => (
            <a key={label} href={href} aria-label={label} title={label} target="_blank" rel="noopener noreferrer"><Icon aria-hidden="true" /></a>
          ))}
        </nav>
      </header>
      <nav className="section-nav" aria-label="Portfolio sections">
        {sections.map(({ label, Icon }) => (
          <div className={`section-item${label === 'about me' ? ' is-active' : ''}`} key={label}><Icon aria-hidden="true" /><span>{label}</span></div>
        ))}
      </nav>
      <Introduction />
    </main>
  )
}

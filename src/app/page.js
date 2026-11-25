'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import { FiHome, FiUser, FiGrid, FiFileText, FiBarChart2, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import MarketOverview from '../components/MarketOverview'
import ProjectList from '../components/ProjectList'

const socials = [
  { label: 'GitHub', href: 'https://github.com/ananyasingh7', Icon: FaGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ananyasingh7/', Icon: FaLinkedin },
  { label: 'X', href: 'https://x.com/TheStableVegeta', Icon: FaXTwitter },
]

const sections = [
  { id: 'home', label: 'home', Icon: FiHome },
  { id: 'about', label: 'about me', Icon: FiUser },
  { id: 'projects', label: 'my projects', Icon: FiGrid },
  { id: 'thoughts', label: 'my thoughts', Icon: FiFileText },
  { id: 'data', label: 'data', Icon: FiBarChart2 },
]

const introduction = [
  'i keep a workshop for models and markets.',
  'a workbench for ideas i am still working out.',
  'the work is in projects. the reasoning is in my thoughts.',
  'data is the part that is still moving.',
]

function Introduction() {
  let offset = 0
  return (
    <>
      {introduction.map((line) => {
        const start = offset
        offset += line.length + 5
        return (
          <p key={line}>
            <span className="sr-only">{line}</span>
            <span aria-hidden="true">{Array.from(line, (character, position) => (
              <span className="typed-character" style={{ animationDelay: `${(start + position) * 35}ms` }} key={position}>{character}</span>
            ))}</span>
          </p>
        )
      })}
    </>
  )
}

function About() {
  return (
    <div className="about-content">
      <p>i&apos;m ananya. i am in new york city.</p>
      <p>
        i&apos;ve been a software engineer for six years.<br />
        i build complex payroll systems and the design of the systems around them.<br />
        billions of dollars move through that software every day.<br />
        reliability and consistency is non-negotiable.
      </p>
      <p>
        i also build software on my own time.<br />
        some of it is for me, and some of it is for the markets i work in.<br />
        i read and learn as much as i can, and i apply it quickly.
      </p>
      <span className="resume-pending"><span>resume</span> · coming soon</span>
    </div>
  )
}

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0)
  const dataHeading = useRef(null)
  const sectionNav = useRef(null)
  const activeSection = sections[activeIndex]
  const previousSection = sections[activeIndex - 1]
  const nextSection = sections[activeIndex + 1]

  useEffect(() => {
    function openLinkedSection() {
      if (window.location.hash === '#data') {
        setActiveIndex(sections.findIndex(({ id }) => id === 'data'))
      }
    }

    openLinkedSection()
    window.addEventListener('hashchange', openLinkedSection)
    return () => window.removeEventListener('hashchange', openLinkedSection)
  }, [])

  useEffect(() => {
    // A new section starts at the top, even when the previous one was scrolled far down.
    if (window.scrollY > 0) window.scrollTo({ top: 0 })

    // On phones the sections are a horizontally scrolling tab bar; keep the current tab in view.
    const navElement = sectionNav.current
    const currentTab = navElement.querySelector('[aria-current]')
    if (currentTab && navElement.scrollWidth > navElement.clientWidth) {
      navElement.scrollTo({ left: currentTab.offsetLeft - (navElement.clientWidth - currentTab.offsetWidth) / 2 })
    }
  }, [activeIndex])

  return (
    <main className="portfolio-background">
      <header className="site-header">
        <nav className="socials" aria-label="Social links">
          {socials.map(({ label, href, Icon }) => (
            <a key={label} href={href} aria-label={label} title={label} target="_blank" rel="noopener noreferrer"><Icon aria-hidden="true" /></a>
          ))}
        </nav>
      </header>
      <nav className="section-nav" aria-label="Portfolio sections" ref={sectionNav}>
        <button
          type="button"
          className="section-arrow"
          aria-label={previousSection ? `previous section: ${previousSection.label}` : 'previous section'}
          aria-controls="section-content"
          aria-disabled={!previousSection}
          onClick={() => previousSection && setActiveIndex(activeIndex - 1)}
        >
          <FiChevronUp aria-hidden="true" />
        </button>
        {sections.map(({ id, label, Icon }, index) => (
          <Fragment key={id}>
            <button
              type="button"
              className="section-item"
              onClick={() => setActiveIndex(index)}
              aria-controls="section-content"
              aria-current={activeIndex === index && id !== 'data' ? 'page' : undefined}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </button>
            {id === 'data' && activeIndex === index && (
              <button
                type="button"
                className="section-item section-item-subsection"
                aria-current="location"
                onClick={() => {
                  dataHeading.current?.focus({ preventScroll: true })
                  dataHeading.current?.scrollIntoView({ block: 'start' })
                }}
              >
                31 days
              </button>
            )}
          </Fragment>
        ))}
        <button
          type="button"
          className="section-arrow"
          aria-label={nextSection ? `next section: ${nextSection.label}` : 'next section'}
          aria-controls="section-content"
          aria-disabled={!nextSection}
          onClick={() => nextSection && setActiveIndex(activeIndex + 1)}
        >
          <FiChevronDown aria-hidden="true" />
        </button>
      </nav>
      <section
        className={`section-content section-content-${activeSection.id}`}
        id="section-content"
        aria-label={activeSection.label}
      >
        {activeSection.id === 'home' && <Introduction />}
        {activeSection.id === 'about' && <About />}
        {activeSection.id === 'projects' && <ProjectList />}
        {activeSection.id === 'thoughts' && <p>(soon: The Art of Context Switching)</p>}
        {activeSection.id === 'data' && (
          <>
            <h1 className="data-section-heading" ref={dataHeading} tabIndex={-1}>last 31 days</h1>
            <MarketOverview />
          </>
        )}
      </section>
    </main>
  )
}

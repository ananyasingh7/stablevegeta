'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Portfolio' },
    { href: '/research', label: 'Research' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-zinc-900">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
        <div className="flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-lg transition-colors ${
                pathname === href ? 'text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

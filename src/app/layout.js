import './globals.css'
import { Quantico } from 'next/font/google'

const quantico = Quantico({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-quantico',
})

export const metadata = {
  title: 'stablevegeta',
  description: 'Developer, researcher, and builder',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${quantico.variable}`}>
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}

import './globals.css'
import Navigation from '../components/Navigation'

export const metadata = {
  title: 'stablevegeta',
  description: 'Personal space for projects, research, blogs, and ideas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-zinc-100 antialiased">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}

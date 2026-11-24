import './globals.css'
import Nav from '../components/Nav'

export const metadata = {
  title: 'stablevegeta',
  description: 'Developer, researcher, and builder',
  icons: {
    icon: '/profile-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased">
        <Nav />
        {children}
      </body>
    </html>
  )
}

import './globals.css'

export const metadata = {
  title: 'stablevegeta',
  description: 'Developer, researcher, and builder',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}

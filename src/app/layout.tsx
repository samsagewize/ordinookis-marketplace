import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nooki Market — Ordinookis on Bitcoin',
  description: 'The dedicated marketplace for Ordinookis. Browse, list, and trade using your Xverse wallet.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Sawarabi+Mincho&family=M+PLUS+Rounded+1c:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}

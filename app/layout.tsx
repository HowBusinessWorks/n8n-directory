import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'n8n json',
  description: 'n8n Template Directory - Discover and share n8n workflows',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'n8n json - Free n8n Template Directory',
    description: 'The #1 FREE n8n Template Directory. Discover thousands of automation templates for n8n workflows.',
    url: 'https://n8njson.io',
    siteName: 'n8n json',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'n8n json - Free n8n Template Directory',
    description: 'The #1 FREE n8n Template Directory. Discover thousands of automation templates for n8n workflows.',
  },
  alternates: {
    canonical: 'https://n8njson.io',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "n8n json",
              "description": "The #1 FREE n8n Template Directory. Discover thousands of automation templates for n8n workflows.",
              "url": "https://n8njson.io",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://n8njson.io/?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "n8n json",
                "url": "https://n8njson.io"
              }
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

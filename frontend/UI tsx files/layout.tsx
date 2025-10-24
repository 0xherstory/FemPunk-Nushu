import type { Metadata } from 'next'
import { montserrat } from '../lib/fonts'
import '../styles/figma-homepage/globals.css'

export const metadata: Metadata = {
  title: 'FemPunk Nvshu - Collaborative Art Platform',
  description: 'Through decentralized collaboration, the ancient script becomes the language of the future. Join today\'s theme and paint your part in the evolving story of Nvshu.',
  keywords: ['Nvshu', 'collaborative art', 'decentralized', 'feminine language', 'digital art', 'blockchain', 'NFT'],
  authors: [{ name: 'FemPunk' }],
  creator: 'FemPunk',
  publisher: 'FemPunk',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'FemPunk Nvshu - Collaborative Art Platform',
    description: 'Through decentralized collaboration, the ancient script becomes the language of the future.',
    type: 'website',
    locale: 'en_US',
    siteName: 'FemPunk Nvshu',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FemPunk Nvshu - Collaborative Art Platform',
    description: 'Through decentralized collaboration, the ancient script becomes the language of the future.',
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className={montserrat.className}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
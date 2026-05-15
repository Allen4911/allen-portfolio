import { Inter } from 'next/font/google'
import './globals.css'
import GlobalNav from '@/components/layout/GlobalNav'
import Footer from '@/components/layout/Footer'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://allen-portfolio.vercel.app'),
  title: {
    default: 'Allen - Frontend Developer',
    template: '%s | Allen',
  },
  description:
    'Frontend Developer specializing in React, Next.js, and modern web experiences. Building clean, performant interfaces.',
  keywords: ['frontend developer', 'React', 'Next.js', 'Tailwind CSS', 'portfolio'],
  authors: [{ name: 'Allen' }],
  creator: 'Allen',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://allen-portfolio.vercel.app',
    siteName: 'Allen Portfolio',
    title: 'Allen - Frontend Developer',
    description:
      'Frontend Developer specializing in React, Next.js, and modern web experiences.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Allen - Frontend Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@allen4911',
    creator: '@allen4911',
    title: 'Allen - Frontend Developer',
    description: 'Frontend Developer specializing in React, Next.js, and modern web experiences.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <GlobalNav />
          <main className="pt-nav">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}

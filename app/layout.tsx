import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import AuthSessionProvider from '@/components/auth/SessionProvider'
import ServiceWorkerProvider from '@/components/service-worker-provider'
import MobileNavigation from '@/components/mobile-navigation'
import CapacitorProvider from '@/components/capacitor-provider'
import { ToastContainer } from '@/components/ui/toast'
import { ErrorBoundary } from '@/lib/utils/browserErrorReporter'
import BrowserErrorReporter from '@/components/BrowserErrorReporter'
import ErrorMonitor from '@/components/ErrorMonitor'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1e40af',
}

export const metadata: Metadata = {
  title: {
    default: 'Nebachiv - Навчання безпечній їзді на мотоциклі',
    template: '%s | Nebachiv'
  },
  description: 'Сучасна платформа для навчання безпечній їзді на мотоциклі з інтерактивними тестами та гайдами',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nebachiv'
  },
  keywords: ['мотоцикл', 'навчання', 'безпека', 'водіння', 'курси', 'тести'],
  authors: [{ name: 'Nebachiv Team' }],
  creator: 'Nebachiv',
  publisher: 'Nebachiv',
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: 'https://nebachiv.com',
    title: 'Nebachiv - Навчання безпечній їзді на мотоциклі',
    description: 'Сучасна платформа для навчання безпечній їзді на мотоциклі',
    siteName: 'Nebachiv',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nebachiv - Навчання безпечній їзді на мотоциклі',
    description: 'Сучасна платформа для навчання безпечній їзді на мотоциклі',
    creator: '@nebachiv',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthSessionProvider>
          <CapacitorProvider>
            <ServiceWorkerProvider />
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
            <MobileNavigation />
            <ToastContainer />
            <BrowserErrorReporter />
            {/* <ErrorMonitor /> */}
          </CapacitorProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
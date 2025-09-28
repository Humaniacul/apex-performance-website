import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';

// Font configurations with optimal loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
});

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: 'Apex Performance — Hypercar Reimagined',
    template: '%s | Apex Performance',
  },
  description: 'Experience the pinnacle of automotive engineering. Apex Performance delivers uncompromising hypercar excellence with cutting-edge technology and surgical precision.',
  keywords: [
    'hypercar',
    'supercar',
    'luxury automotive',
    'performance car',
    'carbon fiber',
    'hybrid powertrain',
    'apex performance',
    'automotive engineering',
  ],
  authors: [{ name: 'Apex Performance' }],
  creator: 'Apex Performance',
  publisher: 'Apex Performance',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://apex-performance.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://apex-performance.com',
    title: 'Apex Performance — Hypercar Reimagined',
    description: 'Experience the pinnacle of automotive engineering. Apex Performance delivers uncompromising hypercar excellence with cutting-edge technology and surgical precision.',
    siteName: 'Apex Performance',
    images: [
      {
        url: '/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Apex Performance Hypercar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apex Performance — Hypercar Reimagined',
    description: 'Experience the pinnacle of automotive engineering. Uncompromising hypercar excellence.',
    images: ['/assets/og-image.jpg'],
    creator: '@apexperformance',
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
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0B0B0C' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0B0C' },
  ],
  colorScheme: 'dark',
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Apex Performance',
  description: 'Hypercar manufacturer specializing in cutting-edge automotive engineering and performance.',
  url: 'https://apex-performance.com',
  logo: 'https://apex-performance.com/assets/logo.svg',
  sameAs: [
    'https://twitter.com/apexperformance',
    'https://instagram.com/apexperformance',
    'https://linkedin.com/company/apex-performance',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-APEX-001',
    contactType: 'customer service',
    email: 'contact@apex-performance.com',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1 Performance Drive',
    addressLocality: 'Los Angeles',
    addressRegion: 'CA',
    postalCode: '90210',
    addressCountry: 'US',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Hypercar Collection',
    itemListElement: {
      '@type': 'Product',
      name: 'Apex Hypercar',
      description: 'Ultra-high-performance hybrid hypercar with active aerodynamics and carbon fiber construction.',
      category: 'Hypercar',
      brand: {
        '@type': 'Brand',
        name: 'Apex Performance',
      },
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/PreOrder',
        priceCurrency: 'USD',
        price: '2500000',
      },
    },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for potential third-party resources */}
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//plausible.io" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Analytics - Plausible (privacy-friendly, enabled by default) */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
        
        {/* Google Analytics v4 (commented out, uncomment if needed) */}
        {/*
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
        */}
      </head>
      
      <body 
        className="bg-apex-black text-apex-white antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-apex-red text-white px-4 py-2 rounded-md font-medium transition-all duration-200"
        >
          Skip to main content
        </a>
        
        {/* Main app content */}
        <div id="app" className="relative min-h-screen">
          {children}
        </div>
        
        {/* Progress indicator for page loading */}
        <div id="loading-progress" className="fixed top-0 left-0 right-0 z-50 h-1 bg-apex-red transform scale-x-0 origin-left transition-transform duration-300" />
        
        {/* Google Tag Manager (optional) */}
        {/*
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        */}
        
        {/* NoScript fallback */}
        <noscript>
          <div className="fixed inset-0 bg-apex-black text-apex-white flex items-center justify-center z-50">
            <div className="text-center p-8">
              <h1 className="text-2xl font-heading font-bold mb-4">JavaScript Required</h1>
              <p className="text-apex-muted">
                Please enable JavaScript to experience the full Apex Performance website.
              </p>
            </div>
          </div>
        </noscript>
      </body>
    </html>
  );
}

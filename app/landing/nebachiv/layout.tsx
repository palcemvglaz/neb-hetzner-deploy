import type { Metadata } from 'next';
import seoData from './assets/metadata/seo.json';

// Dynamic metadata based on version (defaulting to Ukrainian)
export const metadata: Metadata = {
  title: seoData.seo.ukrainian.title,
  description: seoData.seo.ukrainian.description,
  keywords: seoData.seo.ukrainian.keywords,
  authors: [{ name: seoData.seo.ukrainian.author }],
  canonical: seoData.seo.ukrainian.canonical,
  robots: seoData.seo.ukrainian.robots,
  
  openGraph: {
    title: seoData.opengraph.ukrainian['og:title'],
    description: seoData.opengraph.ukrainian['og:description'],
    images: [
      {
        url: seoData.opengraph.ukrainian['og:image'],
        alt: seoData.opengraph.ukrainian['og:image:alt'],
      }
    ],
    type: 'website',
    siteName: seoData.opengraph.ukrainian['og:site_name'],
    locale: seoData.opengraph.ukrainian['og:locale'],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: seoData.twitter.ukrainian['twitter:title'],
    description: seoData.twitter.ukrainian['twitter:description'],
    images: [seoData.twitter.ukrainian['twitter:image']],
  },

  other: {
    // Structured data
    'application/ld+json': JSON.stringify(seoData.structured_data),
  },
};

export default function NebachivLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      {children}
    </div>
  );
}
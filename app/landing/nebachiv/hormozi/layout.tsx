import type { Metadata } from 'next';
import seoData from '../assets/metadata/seo.json';

// Hormozi version metadata
export const metadata: Metadata = {
  title: seoData.seo.hormozi.title,
  description: seoData.seo.hormozi.description,
  keywords: seoData.seo.hormozi.keywords,
  robots: 'index, follow',
  
  openGraph: {
    title: seoData.opengraph.hormozi['og:title'],
    description: seoData.opengraph.hormozi['og:description'],
    images: [
      {
        url: seoData.opengraph.hormozi['og:image'],
        alt: seoData.opengraph.hormozi['og:image:alt'],
      }
    ],
    type: 'website',
    siteName: seoData.opengraph.hormozi['og:site_name'],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: seoData.twitter.hormozi['twitter:title'],
    description: seoData.twitter.hormozi['twitter:description'],
    images: [seoData.twitter.hormozi['twitter:image']],
  },
};

export default function HormoziLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
}
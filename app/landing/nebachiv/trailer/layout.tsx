import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Що кажуть про Nebachiv • Відгуки про систему виживання',
  description: 'Реальні історії від мотоциклістів, які навчились виживати на дорозі. 50+ врятованих життів, 12,000+ проаналізованих аварій.',
  keywords: ['nebachiv відгуки', 'безпека мотоциклістів', 'система виживання', 'врятовані життя'],
  
  openGraph: {
    title: 'Що кажуть про Nebachiv',
    description: 'Реальні історії від тих, хто вижив завдяки навчанню',
    type: 'website',
    images: [
      {
        url: '/images/nebachiv-testimonials.jpg',
        alt: 'Відгуки про систему виживання Nebachiv',
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Що кажуть про Nebachiv',
    description: 'Реальні історії врятованих життів',
  },

  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
};

export default function TrailerLayout({
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
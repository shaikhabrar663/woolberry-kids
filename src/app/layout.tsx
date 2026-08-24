import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Woolberry Kids | Handcrafted Woollen & Crochet Babywear',
  description:
    '100% skin-safe, zero-scratch organic merino wool & cotton knitwear for newborns, babies, and toddlers up to 5 years. Sweaters, cardigans, and heirloom gift sets.',
  keywords: [
    'baby winter wear',
    'crochet baby clothes',
    'handmade woollen baby sweaters',
    'zero itch merino wool',
    'organic baby knitwear India',
    'newborn gift sets',
    'baby cardigans handmade',
  ],
  authors: [{ name: 'Woolberry Kids' }],
  creator: 'Woolberry Kids',
  publisher: 'Woolberry Kids',
  metadataBase: new URL('https://woolberrykids.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Woolberry Kids | Handcrafted Woollen & Crochet Babywear',
    description:
      'Artisan-crocheted sweaters, cardigans, and gift hampers made with zero-scratch organic wool for newborn to 5 years.',
    url: 'https://woolberrykids.com',
    siteName: 'Woolberry Kids',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Woolberry Kids Handcrafted Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Woolberry Kids | Artisan Handmade Baby Knitwear',
    description: '100% skin-safe, zero-scratch merino & cotton knitwear for little ones.',
    images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=80'],
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
};

const structuredStoreSchema = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'Woolberry Kids',
  image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=80',
  '@id': 'https://woolberrykids.com',
  url: 'https://woolberrykids.com',
  telephone: '+91-9876543210',
  priceRange: '₹449 - ₹1,999',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking',
  description:
    'Artisan handmade crochet and zero-scratch merino woollen apparel for newborn to 5-year-old babies.',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Handcrafted Knitwear Catalog',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Sweaters & Dresses',
      },
      {
        '@type': 'OfferCatalog',
        name: 'Cardigans',
      },
      {
        '@type': 'OfferCatalog',
        name: 'Gift Sets',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredStoreSchema) }}
        />
      </head>
      <body className="bg-[#FAF5EE] text-[#2D221C] antialiased min-h-screen flex flex-col font-sans selection:bg-[#E11D48] selection:text-white">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
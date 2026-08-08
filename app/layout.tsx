import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const SITE_URL = 'https://lorenceojales.dev';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Lorence B. Ojales · Computer Engineer',
  description:
    'Computer Engineering graduate designing intelligent systems — embedded devices, IoT, AI, and full-stack software that bridge hardware and software.',
  keywords: [
    'Lorence Ojales',
    'Computer Engineer',
    'Embedded Systems',
    'IoT Developer',
    'Full-Stack Developer',
    'University of Batangas',
  ],
  authors: [{ name: 'Lorence B. Ojales' }],
  openGraph: {
    title: 'Lorence B. Ojales · Computer Engineer',
    description:
      'Designing intelligent systems, building embedded solutions, and creating innovative technologies that bridge hardware and software.',
    url: SITE_URL,
    siteName: 'Lorence Ojales Portfolio',
    images: [{ url: '/images/profile/barong.png', width: 1200, height: 1500 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lorence B. Ojales · Computer Engineer',
    description:
      'Designing intelligent systems, building embedded solutions, and creating innovative technologies.',
    images: ['/images/profile/barong.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <div className="aurora-bg" aria-hidden="true" />
        <div className="grid-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}

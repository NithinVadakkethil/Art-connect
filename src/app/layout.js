import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ArtistHub - Connect with Talented Artists',
  description: 'Discover amazing artists, showcase your artwork, find art opportunities, and connect with the creative community. Join ArtistHub today!',
  keywords: 'artists, artwork, paintings, drawings, art gallery, creative community, art jobs, custom art, art marketplace',
  authors: [{ name: 'ArtistHub Team' }],
  openGraph: {
    title: 'ArtistHub - Connect with Talented Artists',
    description: 'Discover amazing artists, showcase your artwork, find art opportunities, and connect with the creative community.',
    url: 'https://artisthub.com',
    siteName: 'ArtistHub',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ArtistHub - Connect with Artists'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArtistHub - Connect with Talented Artists',
    description: 'Discover amazing artists, showcase your artwork, and find art opportunities.',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://artisthub.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
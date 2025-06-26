import Link from 'next/link';
import { Palette, Users, Briefcase, Search, Star, ArrowRight } from 'lucide-react';
import FeaturedArtists from '@/components/FeaturedArtists';
import RecentArtworks from '@/components/RecentArtworks';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Discover Amazing <span className="text-yellow-300">Artists</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with talented artists, showcase your artwork, and find creative opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/gallery" 
                className="bg-yellow-400 text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-300 transition-colors inline-flex items-center gap-2"
              >
                <Palette size={24} />
                Explore Gallery
              </Link>
              <Link 
                href="/register" 
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors inline-flex items-center gap-2"
              >
                <Users size={24} />
                Join as Artist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose ArtConnect?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to showcase, discover, and connect in the art world
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Showcase Art</h3>
              <p className="text-gray-600">Display your artwork in beautiful galleries with high-quality image support</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Artists</h3>
              <p className="text-gray-600">Build your network and connect with artists and art enthusiasts</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Jobs</h3>
              <p className="text-gray-600">Discover art opportunities and commissioned work through our job portal</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors">
              <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Discovery</h3>
              <p className="text-gray-600">Advanced search and filtering to find exactly what you're looking for</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Artists</h2>
            <p className="text-xl text-gray-600">Discover talented artists from our community</p>
          </div>
          <FeaturedArtists />
          <div className="text-center mt-8">
            <Link 
              href="/artists" 
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              View All Artists <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Artworks Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest Artworks</h2>
            <p className="text-xl text-gray-600">Fresh creations from our artist community</p>
          </div>
          <RecentArtworks />
          <div className="text-center mt-8">
            <Link 
              href="/gallery" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Full Gallery <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're an artist looking to showcase your work or someone seeking amazing art, 
            ArtConnect is the perfect place to start your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </Link>
            <Link 
              href="/about" 
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
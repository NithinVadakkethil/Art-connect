import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Palette, Users, Star, Zap } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>ArtistHub - Connect Artists with Art Lovers Worldwide</title>
        <meta name="description" content="Discover unique artworks from talented artists. ArtistHub is the premier platform connecting artists with art enthusiasts globally. Browse, commission, and buy original art." />
        <meta name="keywords" content="art, artists, paintings, drawings, artwork, commission, buy art, art gallery, artist platform" />
        <meta property="og:title" content="ArtistHub - Connect Artists with Art Lovers" />
        <meta property="og:description" content="Discover unique artworks from talented artists worldwide" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Discover Amazing
              <span className="block text-yellow-300">Artworks</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Connect with talented artists worldwide. Explore unique paintings, drawings, and digital art.
              Commission custom pieces or find the perfect artwork for your space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/gallery"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Explore Gallery
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Join as Artist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ArtistHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're building the world's most comprehensive platform for artists and art enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                <Palette className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Diverse Artworks</h3>
              <p className="text-gray-600">Discover paintings, drawings, digital art, and more from artists worldwide.</p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Directly</h3>
              <p className="text-gray-600">Connect with artists directly for commissions and custom artwork.</p>
            </div>

            <div className="text-center group">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">All artists are verified and artworks are quality-checked.</p>
            </div>

            <div className="text-center group">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Process</h3>
              <p className="text-gray-600">Simple ordering process with secure payment and delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Artists
            </h2>
            <p className="text-xl text-gray-600">
              Meet some of our talented artists creating amazing works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-indigo-400 to-purple-500"></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                    <div>
                      <h3 className="font-semibold text-lg">Artist Name</h3>
                      <p className="text-gray-600">Digital Artist</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Creating beautiful digital artworks with vibrant colors and unique styles.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">25 Artworks</span>
                    <Link
                      to="/gallery"
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Art Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of artists and art lovers on ArtistHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join as Artist
            </Link>
            <Link
              to="/gallery"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Browse Gallery
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Palette, Users, Star, Zap, Brush, Heart, Globe, Shield } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>FrameGlobe - Connect Artists with Art Lovers Worldwide</title>
        <meta name="description" content="Discover unique artworks from talented artists. FrameGlobe is the premier platform connecting artists with art enthusiasts globally. Browse, commission, and buy original art." />
        <meta name="keywords" content="art, artists, paintings, drawings, artwork, commission, buy art, art gallery, artist platform" />
        <meta property="og:title" content="FrameGlobe - Connect Artists with Art Lovers" />
        <meta property="og:description" content="Discover unique artworks from talented artists worldwide" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Where Art Meets
              <span className="block text-yellow-300 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Passion
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl mb-12 max-w-4xl mx-auto opacity-95 leading-relaxed">
              Join the world's most vibrant community of artists and art enthusiasts. 
              Discover extraordinary artworks, connect with talented creators, and bring your artistic visions to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/gallery"
                className="group bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center"
              >
                Explore Masterpieces
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="group border-3 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Start Creating Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Empowering Artists, Inspiring Collectors
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            FrameGlobe is more than a marketplace—it's a thriving ecosystem where creativity flourishes. 
            We bridge the gap between visionary artists and passionate collectors, fostering meaningful 
            connections that celebrate the transformative power of art.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Artists & Collectors Choose Us
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of art discovery and creation with our innovative platform designed for the modern art world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl p-6 w-20 h-20 mx-auto mb-6 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-300 flex items-center justify-center">
                <Palette className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Curated Excellence</h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Discover handpicked artworks from verified artists across painting, digital art, sculpture, and photography.
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 w-20 h-20 mx-auto mb-6 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300 flex items-center justify-center">
                <Users className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Direct Connections</h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Connect directly with artists for custom commissions, collaborations, and personalized artwork creation.
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6 w-20 h-20 mx-auto mb-6 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 flex items-center justify-center">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Trusted Platform</h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Secure transactions, verified artists, and quality assurance ensure a safe and reliable art buying experience.
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-6 w-20 h-20 mx-auto mb-6 group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all duration-300 flex items-center justify-center">
                <Globe className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Global Community</h3>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                Join thousands of artists and collectors from around the world in celebrating creativity and artistic expression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Artists Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                For Artists: Your Canvas, Your Career
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 rounded-lg p-2 flex-shrink-0">
                    <Brush className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Showcase Your Talent</h3>
                    <p className="text-gray-600 text-lg">Create a stunning portfolio that highlights your unique artistic style and attracts the right collectors.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-lg p-2 flex-shrink-0">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Build Your Following</h3>
                    <p className="text-gray-600 text-lg">Connect with art enthusiasts who appreciate your work and grow a loyal community of supporters.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-lg p-2 flex-shrink-0">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Earn From Your Passion</h3>
                    <p className="text-gray-600 text-lg">Turn your artistic passion into a sustainable career with our commission and sales platform.</p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <Link
                  to="/register"
                  className="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors transform hover:scale-105 shadow-lg"
                >
                  Join as Artist
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl h-96 flex items-center justify-center shadow-2xl">
                <Palette className="h-24 w-24 text-white opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Collectors Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl h-96 flex items-center justify-center shadow-2xl">
                <Heart className="h-24 w-24 text-white opacity-80" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                For Collectors: Discover Your Next Treasure
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-lg p-2 flex-shrink-0">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Unique Artworks</h3>
                    <p className="text-gray-600 text-lg">Discover one-of-a-kind pieces that speak to your soul and complement your personal style.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 rounded-lg p-2 flex-shrink-0">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Commissions</h3>
                    <p className="text-gray-600 text-lg">Work directly with artists to create personalized pieces that perfectly match your vision and space.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-lg p-2 flex-shrink-0">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Purchases</h3>
                    <p className="text-gray-600 text-lg">Buy with confidence knowing every transaction is protected and every artist is verified.</p>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <Link
                  to="/gallery"
                  className="inline-flex items-center bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors transform hover:scale-105 shadow-lg"
                >
                  Start Collecting
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
            Ready to Transform Your Art Journey?
          </h2>
          <p className="text-xl sm:text-2xl mb-12 opacity-95 max-w-3xl mx-auto">
            Join thousands of artists and collectors who are already part of the FrameGlobe community. 
            Your next masterpiece or perfect artwork is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/register"
              className="group bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Join as Artist
            </Link>
            <Link
              to="/gallery"
              className="group border-3 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Browse Gallery
            </Link>
            <Link
              to="/requirements"
              className="group bg-yellow-500 text-gray-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Custom Art
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
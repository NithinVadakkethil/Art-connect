import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Artwork } from '../types';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, Eye, Palette, RefreshCw } from 'lucide-react';
import ArtworkCard from '../components/ArtworkCard';

const Gallery: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCustomizable, setShowCustomizable] = useState('all');

  const categories = [
    // Existing general categories (optional to keep)
    "All",
    "painting",
    "drawing",
    "digital",
    "sculpture",
    "photography",
    "mixed-media",
  
    // Specific categories to add
    "Graphite pencil portrait",
    "Charcoal pencil portrait",
    "Acrylic portrait Painting",
    "Oil Painting portrait",
    "Digital portrait",
    "Watercolor portrait",
    "Acrylic landscape Painting",
    "Oil landscape Painting",
    "Watercolor landscape",
    "Colour pencil portraits",
    "Kerala Mural painting",
    "Ball pen portrait",
  ];

  useEffect(() => {
    fetchArtworks();
  }, []);

  useEffect(() => {
    filterArtworks();
  }, [artworks, searchTerm, selectedCategory, showCustomizable]);

  const fetchArtworks = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const artworksQuery = query(
        collection(db, 'artworks'),
        where('isAvailable', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(artworksQuery);
      const artworksList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artwork[];
      
      setArtworks(artworksList);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterArtworks = () => {
    let filtered = artworks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(artwork =>
        artwork.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by customizable
    if (showCustomizable === 'customizable') {
      filtered = filtered.filter(artwork => artwork.isCustomizable);
    } else if (showCustomizable === 'fixed') {
      filtered = filtered.filter(artwork => !artwork.isCustomizable);
    }

    setFilteredArtworks(filtered);
  };

  const handleRefresh = () => {
    fetchArtworks(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing artworks...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Art Gallery - FrameGlobe</title>
        <meta name="description" content="Browse our curated collection of paintings, drawings, digital art, and more from talented artists worldwide." />
        <meta name="keywords" content="art gallery, paintings, drawings, digital art, buy art, commission art" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Art Gallery
                </h1>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 text-gray-600 hover:text-indigo-600 transition-colors disabled:opacity-50"
                  title="Refresh gallery"
                >
                  <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Discover unique artworks from talented artists around the world
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search artworks..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customizable Filter */}
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                  value={showCustomizable}
                  onChange={(e) => setShowCustomizable(e.target.value)}
                >
                  <option value="all">All Artworks</option>
                  <option value="customizable">Customizable Only</option>
                  <option value="fixed">Fixed Artworks</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <p className="text-gray-600">
              Showing {filteredArtworks.length} of {artworks.length} published artworks
            </p>
            {/* <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Customizable</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Published</span>
              </div>
            </div> */}
          </div>

          {filteredArtworks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Eye className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {artworks.length === 0 ? 'No published artworks yet' : 'No artworks found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {artworks.length === 0 
                  ? 'Artists haven\'t published any artworks to the gallery yet'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {artworks.length === 0 && (
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center space-x-2 mx-auto"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh Gallery</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredArtworks.map(artwork => (
                <ArtworkCard key={artwork.id} artwork={artwork} showPrice={false} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Gallery;
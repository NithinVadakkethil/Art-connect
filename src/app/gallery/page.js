'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Heart, Eye, User, X } from 'lucide-react';

// Uncomment these imports when you want to use Firebase
// import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
// import { db } from '@/lib/firebase';

const categories = [
  'All',
  'Painting',
  'Digital Art',
  'Photography',
  'Sculpture',
  'Drawing',
  'Mixed Media',
  'Abstract',
  'Portrait',
  'Landscape'
];

// Mock data for demonstration
const mockArtworks = [
  {
    id: '1',
    title: 'Sunset Dreams',
    description: 'A vibrant painting capturing the essence of a perfect sunset',
    artistName: 'Sarah Johnson',
    category: 'Painting',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop',
    likes: 24,
    views: 156,
    price: 450,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Digital Metropolis',
    description: 'Futuristic cityscape rendered in stunning digital detail',
    artistName: 'Alex Chen',
    category: 'Digital Art',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=400&fit=crop',
    likes: 18,
    views: 203,
    price: 280,
    createdAt: '2024-01-12'
  },
  {
    id: '3',
    title: 'Portrait of Time',
    description: 'An emotional portrait that captures the passage of time',
    artistName: 'Maria Rodriguez',
    category: 'Portrait',
    imageUrl: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=400&fit=crop',
    likes: 31,
    views: 287,
    price: 650,
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    title: 'Abstract Flow',
    description: 'Dynamic abstract composition exploring movement and color',
    artistName: 'David Kim',
    category: 'Abstract',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=400&fit=crop',
    likes: 12,
    views: 98,
    price: 320,
    createdAt: '2024-01-08'
  },
  {
    id: '5',
    title: 'Mountain Serenity',
    description: 'Peaceful landscape showcasing the beauty of mountain ranges',
    artistName: 'Emma Wilson',
    category: 'Landscape',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop',
    likes: 28,
    views: 174,
    price: 390,
    createdAt: '2024-01-05'
  },
  {
    id: '6',
    title: 'Urban Photography',
    description: 'Street photography capturing the essence of city life',
    artistName: 'James Brown',
    category: 'Photography',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&h=400&fit=crop',
    likes: 19,
    views: 142,
    price: 180,
    createdAt: '2024-01-03'
  }
];

// Skeleton Loader Components
const SkeletonCard = ({ viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex animate-pulse">
        <div className="w-32 h-32 bg-gray-300"></div>
        <div className="p-4 flex-1">
          <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded mb-3 w-full"></div>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-300 rounded w-16"></div>
            <div className="flex items-center gap-4">
              <div className="h-4 bg-gray-300 rounded w-8"></div>
              <div className="h-4 bg-gray-300 rounded w-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded mb-3 w-full"></div>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-300 rounded w-16"></div>
          <div className="flex items-center gap-3">
            <div className="h-4 bg-gray-300 rounded w-8"></div>
            <div className="h-4 bg-gray-300 rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonLoader = ({ viewMode }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="text-center mb-8">
        <div className="h-10 bg-gray-300 rounded mx-auto mb-4 w-64 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded mx-auto w-96 animate-pulse"></div>
      </div>

      {/* Search and Filters Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <div className="w-10 h-10 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="mt-6">
          <div className="h-5 bg-gray-300 rounded mb-3 w-20 animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-300 rounded-full w-20 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Results Info Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-5 bg-gray-300 rounded w-48 animate-pulse"></div>
      </div>

      {/* Artworks Grid/List Skeleton */}
      <div className={`${
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
};

// ArtworkCard Component
const ArtworkCard = ({ artwork, onClick, viewMode }) => {
  const [liked, setLiked] = useState(false);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden flex">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-32 h-32 object-cover"
          onClick={() => onClick(artwork)}
        />
        <div className="p-4 flex-1">
          <h3 className="font-semibold text-lg mb-1">{artwork.title}</h3>
          <p className="text-sm text-gray-600 mb-2 flex items-center">
            <User size={14} className="mr-1" />
            {artwork.artistName}
          </p>
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{artwork.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-purple-600">${artwork.price}</span>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {artwork.views}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                }}
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
              >
                <Heart size={14} className={liked ? 'fill-red-500 text-red-500' : ''} />
                {artwork.likes + (liked ? 1 : 0)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
      <div className="relative">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onClick={() => onClick(artwork)}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{artwork.title}</h3>
        <p className="text-sm text-gray-600 mb-2 flex items-center">
          <User size={14} className="mr-1" />
          {artwork.artistName}
        </p>
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{artwork.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-purple-600">${artwork.price}</span>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {artwork.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={14} />
              {artwork.likes + (liked ? 1 : 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ArtworkModal Component
const ArtworkModal = ({ artwork, onClose }) => {
  if (!artwork) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{artwork.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full rounded-lg shadow-md"
              />
            </div>
            
            <div>
              <div className="mb-4">
                <p className="text-gray-600 mb-2 flex items-center">
                  <User size={16} className="mr-2" />
                  Artist: {artwork.artistName}
                </p>
                <p className="text-gray-600 mb-2">Category: {artwork.category}</p>
                <p className="text-2xl font-bold text-purple-600 mb-4">${artwork.price}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{artwork.description}</p>
              </div>
              
              <div className="flex items-center gap-6 mb-6 text-gray-600">
                <span className="flex items-center gap-2">
                  <Eye size={16} />
                  {artwork.views} views
                </span>
                <span className="flex items-center gap-2">
                  <Heart size={16} />
                  {artwork.likes} likes
                </span>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                  Purchase
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      // Uncomment this block when you want to use Firebase
      /*
      const artworksQuery = query(
        collection(db, 'artworks'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(artworksQuery);
      const artworkList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArtworks(artworkList);
      */
      
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
      setArtworks(mockArtworks);
      
    } catch (error) {
      console.error('Error fetching artworks:', error);
      // Fallback to mock data
      setArtworks(mockArtworks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterArtworks();
  }, [artworks, searchTerm, selectedCategory]);

  const filterArtworks = () => {
    let filtered = artworks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.artistName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(artwork => artwork.category === selectedCategory);
    }

    setFilteredArtworks(filtered);
  };

  if (!mounted || loading) {
    return <SkeletonLoader viewMode={viewMode} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Art Gallery</h1>
        <p className="text-xl text-gray-600">Discover amazing artworks from talented artists</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search artworks, artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors lg:hidden"
          >
            <Filter size={20} />
            Filters
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className={`mt-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Showing {filteredArtworks.length} artwork{filteredArtworks.length !== 1 ? 's' : ''}
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Artworks Grid/List */}
      {filteredArtworks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No artworks found matching your criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }`}>
          {filteredArtworks.map(artwork => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onClick={setSelectedArtwork}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Artwork Modal */}
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
}
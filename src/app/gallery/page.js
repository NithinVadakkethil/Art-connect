'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, Filter, Grid, List } from 'lucide-react';
import Link from 'next/link';
import ArtworkCard from '@/components/ArtworkCard';
import ArtworkModal from '@/components/ArtworkModal';

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

export default function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchArtworks();
  }, []);

  useEffect(() => {
    filterArtworks();
  }, [artworks, searchTerm, selectedCategory]);

  const fetchArtworks = async () => {
    try {
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
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArtworks = () => {
    let filtered = artworks;
    if (searchTerm) {
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.artistName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(artwork => artwork.category === selectedCategory);
    }
    setFilteredArtworks(filtered);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing artworks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Art Gallery</h1>
        <p className="text-xl text-gray-600">Discover amazing artworks from talented artists</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
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

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors lg:hidden"
          >
            <Filter size={20} />
            Filters
          </button>

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

        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full border text-sm ${selectedCategory === category ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-800'}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Artworks Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredArtworks.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            viewMode={viewMode}
            onClick={() => setSelectedArtwork(artwork)}
          />
        ))}
      </div>

      {selectedArtwork && (
        <ArtworkModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
      )}
    </div>
  );
}

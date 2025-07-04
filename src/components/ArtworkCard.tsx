import React from 'react';
import { Link } from 'react-router-dom';
import { Artwork } from '../types';
import { Heart, Eye, User, Palette } from 'lucide-react';

interface ArtworkCardProps {
  artwork: Artwork;
  showPrice?: boolean;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, showPrice = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={artwork.imageUrl ? artwork.imageUrl.replace('/upload/', '/upload/w_400,h_400,c_fill,q_auto/') : 'https://images.pexels.com/photos/1053924/pexels-photo-1053924.jpeg'}
            alt={artwork.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              to={`/artwork/${artwork.id}`}
              className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-1"
            >
              <Eye className="h-3 w-3" />
              <span>View</span>
            </Link>
          </div>
        </div>
        
        {/* Customizable Badge */}
        {artwork.isCustomizable && (
          <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Palette className="h-3 w-3" />
            <span>Customizable</span>
          </div>
        )}
        
        {/* Price Badge - Only show if showPrice is true */}
        {showPrice && artwork.price && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
            ${artwork.price}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
          {artwork.title}
        </h3>
        
        <div className="flex items-center space-x-2 mb-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{artwork.artistName}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {artwork.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
            {artwork.category}
          </span>
          
          <div className="flex items-center space-x-2">
            {artwork.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {artwork.isCustomizable && (
                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                  Can be customized
                </span>
              )}
            </div>
            <Link
              to={`/artwork/${artwork.id}`}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
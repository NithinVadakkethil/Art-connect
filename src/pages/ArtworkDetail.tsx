import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Artwork } from '../types';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Heart, Share2, User, Calendar, Tag, DollarSign, Ruler, Palette, Phone, Mail, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const ArtworkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    clientName: currentUser?.displayName || '',
    clientEmail: currentUser?.email || '',
    clientPhone: '',
    requirements: ''
  });

  useEffect(() => {
    if (id) {
      fetchArtwork(id);
    }
  }, [id]);

  const fetchArtwork = async (artworkId: string) => {
    try {
      const artworkDoc = await getDoc(doc(db, 'artworks', artworkId));
      if (artworkDoc.exists()) {
        setArtwork({ id: artworkDoc.id, ...artworkDoc.data() } as Artwork);
      }
    } catch (error) {
      console.error('Error fetching artwork:', error);
      toast.error('Failed to load artwork');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artwork || !orderFormData.clientName || !orderFormData.clientEmail || !orderFormData.clientPhone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        artworkId: artwork.id,
        artistId: artwork.artistId,
        artistName: artwork.artistName,
        clientId: currentUser?.uid || 'guest',
        clientName: orderFormData.clientName,
        clientEmail: orderFormData.clientEmail,
        clientPhone: orderFormData.clientPhone,
        requirements: orderFormData.requirements,
        status: 'pending',
        orderDate: new Date(),
        artwork: {
          title: artwork.title,
          imageUrl: artwork.imageUrl,
          price: artwork.price,
          category: artwork.category
        }
      });

      toast.success('Order submitted successfully! Admin will contact you soon.');
      setShowOrderForm(false);
      setOrderFormData({
        clientName: currentUser?.displayName || '',
        clientEmail: currentUser?.email || '',
        clientPhone: '',
        requirements: ''
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Artwork not found</h2>
          <Link to="/gallery" className="text-indigo-600 hover:text-indigo-800">
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{artwork.title} by {artwork.artistName} - ArtistHub</title>
        <meta name="description" content={`${artwork.description} - Original ${artwork.category} by ${artwork.artistName}. View details and order this unique artwork.`} />
        <meta name="keywords" content={`${artwork.tags.join(', ')}, ${artwork.category}, art, ${artwork.artistName}`} />
        <meta property="og:title" content={`${artwork.title} by ${artwork.artistName}`} />
        <meta property="og:description" content={artwork.description} />
        <meta property="og:image" content={artwork.imageUrl} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to="/gallery"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-96 lg:h-[600px] object-cover"
                />
              </div>
              
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{artwork.title}</h1>
                
                <div className="flex items-center space-x-2 mb-4">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-lg text-gray-700">by {artwork.artistName}</span>
                </div>

                {artwork.price && (
                  <div className="flex items-center space-x-2 mb-4">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">${artwork.price}</span>
                  </div>
                )}

                <p className="text-gray-700 mb-6">{artwork.description}</p>

                {/* Artwork Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="block text-sm text-gray-500">Category</span>
                      <span className="text-gray-900 capitalize">{artwork.category}</span>
                    </div>
                  </div>
                  
                  {artwork.medium && (
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="block text-sm text-gray-500">Medium</span>
                        <span className="text-gray-900">{artwork.medium}</span>
                      </div>
                    </div>
                  )}
                  
                  {artwork.dimensions && (
                    <div className="flex items-center space-x-2">
                      <Ruler className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="block text-sm text-gray-500">Dimensions</span>
                        <span className="text-gray-900">{artwork.dimensions}</span>
                      </div>
                    </div>
                  )}
                  
                  {artwork.year && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="block text-sm text-gray-500">Year</span>
                        <span className="text-gray-900">{artwork.year}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {artwork.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {artwork.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Button */}
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Order This Artwork
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Form Modal */}
        {showOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Artwork</h2>
              <p className="text-gray-600 mb-6">Fill in your details to order "{artwork.title}"</p>
              
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={orderFormData.clientName}
                    onChange={(e) => setOrderFormData({...orderFormData, clientName: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={orderFormData.clientEmail}
                    onChange={(e) => setOrderFormData({...orderFormData, clientEmail: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={orderFormData.clientPhone}
                    onChange={(e) => setOrderFormData({...orderFormData, clientPhone: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirements
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Any special requirements or notes..."
                    value={orderFormData.requirements}
                    onChange={(e) => setOrderFormData({...orderFormData, requirements: e.target.value})}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Submit Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ArtworkDetail;
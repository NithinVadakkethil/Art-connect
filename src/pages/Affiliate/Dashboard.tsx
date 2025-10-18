
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { Artwork, Affiliate } from '../../types';
import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const artworksQuery = query(collection(db, 'artworks'));
        const querySnapshot = await getDocs(artworksQuery);
        const artworksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artwork));
        setArtworks(artworksList);
      } catch (error) {
        console.error("Error fetching artworks: ", error);
        toast.error("Could not load artworks.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const totalCommissions = (currentUser as Affiliate)?.commissions?.reduce((acc, commission) => acc + commission.commissionAmount, 0) || 0;

  return (
    <>
      <Helmet>
        <title>Affiliate Dashboard - FrameGlobe</title>
        <meta name="description" content="Your affiliate dashboard to track earnings and share artwork." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Affiliate Dashboard</h1>

          {/* Commission Summary */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Your Earnings</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-lg text-gray-600">Total Commissions Earned</p>
              <p className="text-3xl font-bold text-green-600">₹{totalCommissions.toFixed(2)}</p>
            </div>
          </div>

          {/* Commission Activity */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Commission History</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {(currentUser as Affiliate)?.commissions && (currentUser as Affiliate).commissions!.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(currentUser as Affiliate).commissions!.map((commission, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{commission.orderId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">₹{commission.commissionAmount.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{commission.earnedAt.toDate().toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="p-6 text-gray-500">You have not earned any commissions yet.</p>
              )}
            </div>
          </div>

          {/* Artwork Gallery */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Share Artwork & Earn</h2>
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading Artworks...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {artworks.map(artwork => (
                  <div key={artwork.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                    <Link to={`/artwork/${artwork.id}?affiliateId=${currentUser?.uid}`}>
                      <img src={artwork.imageUrl} alt={artwork.title} className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity" />
                    </Link>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 truncate">{artwork.title}</h3>
                      <p className="text-sm text-gray-600">by {artwork.artistName}</p>
                      <button
                        onClick={() => {
                          const shareLink = `${window.location.origin}/artwork/${artwork.id}?affiliateId=${currentUser?.uid}`;
                          navigator.clipboard.writeText(shareLink);
                          toast.success('Share link copied to clipboard!');
                        }}
                        className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Copy Share Link</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

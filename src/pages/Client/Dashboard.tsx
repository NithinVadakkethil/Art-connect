import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Order } from '../../types';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const ClientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDownload = async (order: Order) => {
    try {
      const functions = getFunctions();
      const getDownloadUrl = httpsCallable(functions, 'getDownloadUrl');
      const result: any = await getDownloadUrl({ orderId: order.id });
      const downloadUrl = result.data.downloadUrl;
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error("Error getting download URL:", error);
      alert("Could not get download URL. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser && currentUser.role === 'client') {
        const ordersQuery = query(
          collection(db, 'orders'),
          where('clientId', '==', currentUser.uid),
          orderBy('orderDate', 'desc')
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        setOrders(ordersData);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [currentUser]);

  if (loading) {
    return <div>Loading your orders...</div>;
  }

  return (
    <>
      <Helmet>
        <title>My Dashboard - FrameGlobe</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white shadow rounded-lg p-6">
                <img src={order.artwork.imageUrl} alt={order.artwork.title} className="w-full h-48 object-cover rounded-md mb-4" />
                <h2 className="text-xl font-semibold">{order.artwork.title}</h2>
                <p className="text-gray-600">by {order.artistName}</p>
                <p className="text-sm text-gray-500">Ordered on: {new Date(order.orderDate.seconds * 1000).toLocaleDateString()}</p>
                <p className="mt-2 capitalize">
                  Status: <span className={`font-medium ${order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</span>
                </p>
                {order.status === 'completed' && order.paymentStatus === 'paid' && (
                  <button
                    onClick={() => handleDownload(order)}
                    className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Download Artwork
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p>You have no orders yet.</p>
            <Link to="/gallery" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
              Explore Gallery
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientDashboard;

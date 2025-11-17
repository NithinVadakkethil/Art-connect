import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Order } from '../../types';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const q = query(collection(db, 'orders'), where('clientId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map(order => (
            <div key={order.id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{order.artwork.title}</h2>
              <p>Status: {order.status}</p>
              {order.status === 'completed' && (
                <a
                  href={order.artwork.imageUrl}
                  download
                  className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Download Artwork
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;

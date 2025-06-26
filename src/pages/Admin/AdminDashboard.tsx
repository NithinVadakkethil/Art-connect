import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, updateDoc, doc, addDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Order, ClientRequirement, User } from '../../types';
import { Helmet } from 'react-helmet-async';
import { Users, ShoppingBag, MessageSquare, TrendingUp, Eye, Phone, Mail, Calendar, User as UserIcon, Palette, Share2, Check, X, UserCheck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [requirements, setRequirements] = useState<ClientRequirement[]>([]);
  const [artists, setArtists] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'requirements'>('orders');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<ClientRequirement | null>(null);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch orders
      const ordersQuery = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersList = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];

      // Fetch client requirements
      const requirementsQuery = query(collection(db, 'requirements'), orderBy('createdAt', 'desc'));
      const requirementsSnapshot = await getDocs(requirementsQuery);
      const requirementsList = requirementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ClientRequirement[];

      // Fetch artists
      const artistsQuery = query(collection(db, 'users'), where('role', '==', 'artist'));
      const artistsSnapshot = await getDocs(artistsQuery);
      const artistsList = artistsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      setOrders(ordersList);
      setRequirements(requirementsList);
      setArtists(artistsList);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      toast.success('Order status updated');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const updateRequirementStatus = async (requirementId: string, status: 'open' | 'shared' | 'assigned' | 'completed') => {
    try {
      await updateDoc(doc(db, 'requirements', requirementId), { status });
      setRequirements(requirements.map(req => 
        req.id === requirementId ? { ...req, status } : req
      ));
      toast.success('Requirement status updated');
    } catch (error) {
      console.error('Error updating requirement status:', error);
      toast.error('Failed to update requirement status');
    }
  };

  const handleShareToAllArtists = async (requirement: ClientRequirement) => {
    try {
      const allArtistIds = artists.map(artist => artist.uid);
      
      // Create shared requirements for all artists
      const sharePromises = allArtistIds.map(artistId => {
        const artist = artists.find(a => a.uid === artistId);
        return addDoc(collection(db, 'sharedRequirements'), {
          requirementId: requirement.id,
          artistId,
          artistName: artist?.displayName || 'Unknown',
          artistEmail: artist?.email || '',
          sharedAt: new Date(),
          status: 'pending',
          requirement: requirement
        });
      });

      await Promise.all(sharePromises);

      // Update requirement status and shared artists
      await updateDoc(doc(db, 'requirements', requirement.id), {
        status: 'shared',
        sharedWith: allArtistIds
      });

      // Update local state
      setRequirements(requirements.map(req => 
        req.id === requirement.id 
          ? { ...req, status: 'shared', sharedWith: allArtistIds }
          : req
      ));

      toast.success(`Requirement shared with all ${allArtistIds.length} artists`);
    } catch (error) {
      console.error('Error sharing requirement to all artists:', error);
      toast.error('Failed to share requirement to all artists');
    }
  };

  const handleShareRequirement = async () => {
    if (!selectedRequirement || selectedArtists.length === 0) {
      toast.error('Please select at least one artist');
      return;
    }

    try {
      // Create shared requirements for each selected artist
      const sharePromises = selectedArtists.map(artistId => {
        const artist = artists.find(a => a.uid === artistId);
        return addDoc(collection(db, 'sharedRequirements'), {
          requirementId: selectedRequirement.id,
          artistId,
          artistName: artist?.displayName || 'Unknown',
          artistEmail: artist?.email || '',
          sharedAt: new Date(),
          status: 'pending',
          requirement: selectedRequirement
        });
      });

      await Promise.all(sharePromises);

      // Update requirement status and shared artists
      await updateDoc(doc(db, 'requirements', selectedRequirement.id), {
        status: 'shared',
        sharedWith: [...(selectedRequirement.sharedWith || []), ...selectedArtists]
      });

      // Update local state
      setRequirements(requirements.map(req => 
        req.id === selectedRequirement.id 
          ? { ...req, status: 'shared', sharedWith: [...(req.sharedWith || []), ...selectedArtists] }
          : req
      ));

      toast.success(`Requirement shared with ${selectedArtists.length} artist(s)`);
      setShowShareModal(false);
      setSelectedRequirement(null);
      setSelectedArtists([]);
    } catch (error) {
      console.error('Error sharing requirement:', error);
      toast.error('Failed to share requirement');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'shared':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRequirements: requirements.length,
    openRequirements: requirements.filter(r => r.status === 'open').length
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - ArtistHub</title>
        <meta name="description" content="Manage orders, client requirements, and oversee the ArtistHub platform." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage orders and client requirements</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Requirements</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRequirements}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open Requirements</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.openRequirements}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'orders'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Orders ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('requirements')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'requirements'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Client Requirements ({requirements.length})
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'orders' ? (
                <div className="space-y-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600">Orders will appear here when clients place them</p>
                    </div>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                          {/* Artwork Image */}
                          <div className="flex-shrink-0 mb-4 lg:mb-0">
                            <img
                              src={order.artwork.imageUrl}
                              alt={order.artwork.title}
                              className="w-full lg:w-24 h-48 lg:h-24 object-cover rounded-lg"
                            />
                          </div>

                          {/* Order Details */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {order.artwork.title}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Palette className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">by {order.artistName}</span>
                                </div>
                                {order.artwork.price && (
                                  <p className="text-lg font-bold text-green-600 mt-1">
                                    ${order.artwork.price}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                  className="text-sm border border-gray-300 rounded px-2 py-1"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>

                            {/* Client Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Client Information</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center space-x-2">
                                    <UserIcon className="h-4 w-4 text-gray-400" />
                                    <span>{order.clientName}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <a href={`mailto:${order.clientEmail}`} className="text-indigo-600 hover:text-indigo-800">
                                      {order.clientEmail}
                                    </a>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <a href={`tel:${order.clientPhone}`} className="text-indigo-600 hover:text-indigo-800">
                                      {order.clientPhone}
                                    </a>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>{new Date(order.orderDate.seconds * 1000).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>

                              {order.requirements && (
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Special Requirements</h4>
                                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                    {order.requirements}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {requirements.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No requirements yet</h3>
                      <p className="text-gray-600">Client requirements will appear here</p>
                    </div>
                  ) : (
                    requirements.map(requirement => (
                      <div key={requirement.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Client Requirement #{requirement.id.slice(-6)}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {new Date(requirement.createdAt.seconds * 1000).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                              {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
                            </span>
                            {requirement.status === 'open' && (
                              <>
                                <button
                                  onClick={() => handleShareToAllArtists(requirement)}
                                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors flex items-center space-x-1"
                                >
                                  <Users className="h-3 w-3" />
                                  <span>Share to All</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedRequirement(requirement);
                                    setShowShareModal(true);
                                  }}
                                  className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors flex items-center space-x-1"
                                >
                                  <Share2 className="h-3 w-3" />
                                  <span>Share</span>
                                </button>
                              </>
                            )}
                            <select
                              value={requirement.status}
                              onChange={(e) => updateRequirementStatus(requirement.id, e.target.value as any)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="open">Open</option>
                              <option value="shared">Shared</option>
                              <option value="assigned">Assigned</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>

                        {/* Work Completion Status */}
                        {requirement.workCompleted && (
                          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <h4 className="font-medium text-green-900">Work Completed</h4>
                            </div>
                            <div className="text-sm text-green-800">
                              <p><strong>Artist:</strong> {requirement.workCompleted.artistName}</p>
                              <p><strong>Completed:</strong> {new Date(requirement.workCompleted.completedAt.seconds * 1000).toLocaleDateString()}</p>
                              {requirement.workCompleted.notes && (
                                <p><strong>Notes:</strong> {requirement.workCompleted.notes}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Accepted Artist Info */}
                        {requirement.acceptedBy && (
                          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-2">Accepted by Artist</h4>
                            <div className="text-sm text-green-800">
                              <p><strong>Artist:</strong> {requirement.acceptedBy.artistName}</p>
                              <p><strong>Email:</strong> {requirement.acceptedBy.artistEmail}</p>
                              <p><strong>Accepted:</strong> {new Date(requirement.acceptedBy.acceptedAt.seconds * 1000).toLocaleDateString()}</p>
                            </div>
                          </div>
                        )}

                        {/* Shared Artists Info */}
                        {requirement.sharedWith && requirement.sharedWith.length > 0 && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Shared with Artists</h4>
                            <div className="text-sm text-blue-800">
                              <p>Shared with {requirement.sharedWith.length} artist(s)</p>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Client Information</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center space-x-2">
                                <UserIcon className="h-4 w-4 text-gray-400" />
                                <span>{requirement.clientName}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <a href={`mailto:${requirement.clientEmail}`} className="text-indigo-600 hover:text-indigo-800">
                                  {requirement.clientEmail}
                                </a>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <a href={`tel:${requirement.clientPhone}`} className="text-indigo-600 hover:text-indigo-800">
                                  {requirement.clientPhone}
                                </a>
                              </div>
                            </div>

                            {(requirement.category || requirement.budget || requirement.deadline) && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                                <div className="space-y-1 text-sm">
                                  {requirement.category && (
                                    <p><span className="font-medium">Category:</span> {requirement.category}</p>
                                  )}
                                  {requirement.budget && (
                                    <p><span className="font-medium">Budget:</span> ${requirement.budget}</p>
                                  )}
                                  {requirement.deadline && (
                                    <p><span className="font-medium">Deadline:</span> {new Date(requirement.deadline.seconds * 1000).toLocaleDateString()}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                              {requirement.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && selectedRequirement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Share Requirement with Artists</h2>
              <p className="text-gray-600 mb-4">Select artists to share this requirement with:</p>
              
              <div className="max-h-60 overflow-y-auto mb-4">
                {artists.map(artist => (
                  <label key={artist.uid} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={selectedArtists.includes(artist.uid)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedArtists([...selectedArtists, artist.uid]);
                        } else {
                          setSelectedArtists(selectedArtists.filter(id => id !== artist.uid));
                        }
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{artist.displayName}</p>
                      <p className="text-sm text-gray-600">{artist.email}</p>
                    </div>
                  </label>
                ))}
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    setSelectedRequirement(null);
                    setSelectedArtists([]);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShareRequirement}
                  disabled={selectedArtists.length === 0}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Share ({selectedArtists.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Artwork, SharedRequirement, SharedOrder } from '../types';
import { Helmet } from 'react-helmet-async';
import { Plus, Upload, Edit, Trash2, Eye, Check, X, Clock, IndianRupee, User, Calendar, MessageSquare, Palette, Search, Filter, ZoomIn, UserCheck, AlertCircle, Lock, CheckCircle, Share, MessageCircle } from 'lucide-react';
import { compressImage, createThumbnail } from '../../utils/imageOptimization';
import FileUpload from '../../components/FileUpload';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [sharedRequirements, setSharedRequirements] = useState<SharedRequirement[]>([]);
  const [sharedOrders, setSharedOrders] = useState<SharedOrder[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [filteredRequirements, setFilteredRequirements] = useState<SharedRequirement[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<SharedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'artworks' | 'requirements' | 'orders'>('artworks');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRequirementModal, setShowRequirementModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [selectedRequirement, setSelectedRequirement] = useState<SharedRequirement | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SharedOrder | null>(null);
  const [uploading, setUploading] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [updatingArtwork, setUpdatingArtwork] = useState<string | null>(null);
  
  // Mobile filter states
  const [showArtworkFilters, setShowArtworkFilters] = useState(false);
  const [showRequirementFilters, setShowRequirementFilters] = useState(false);
  const [showOrderFilters, setShowOrderFilters] = useState(false);
  
  // Filter states
  const [artworkSearchTerm, setArtworkSearchTerm] = useState('');
  const [artworkCategoryFilter, setArtworkCategoryFilter] = useState('all');
  const [requirementSearchTerm, setRequirementSearchTerm] = useState('');
  const [requirementStatusFilter, setRequirementStatusFilter] = useState('all');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    category: 'painting',
    price: '',
    isCustomizable: false,
    tags: '',
    file: null as File | null
  });

  const categories = [
    // Existing general categories (optional to keep)
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
    "other",
  ];

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  useEffect(() => {
    filterArtworks();
  }, [artworks, artworkSearchTerm, artworkCategoryFilter]);

  useEffect(() => {
    filterRequirements();
  }, [sharedRequirements, requirementSearchTerm, requirementStatusFilter]);

  useEffect(() => {
    filterOrders();
  }, [sharedOrders, orderSearchTerm, orderStatusFilter]);

  const fetchData = async () => {
    if (!currentUser) return;

    try {
      // Fetch artist's artworks
      const artworksQuery = query(
        collection(db, 'artworks'),
        where('artistId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const artworksSnapshot = await getDocs(artworksQuery);
      const artworksList = artworksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artwork[];

      // Fetch shared requirements
      const requirementsQuery = query(
        collection(db, 'sharedRequirements'),
        where('artistId', '==', currentUser.uid),
        orderBy('sharedAt', 'desc')
      );
      const requirementsSnapshot = await getDocs(requirementsQuery);
      const requirementsList = requirementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SharedRequirement[];

      // Fetch shared orders
      const ordersQuery = query(
        collection(db, 'sharedOrders'),
        where('artistId', '==', currentUser.uid),
        orderBy('sharedAt', 'desc')
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersList = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SharedOrder[];

      setArtworks(artworksList);
      setSharedRequirements(requirementsList);
      setSharedOrders(ordersList);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filterArtworks = () => {
    let filtered = artworks;

    // Filter by search term
    if (artworkSearchTerm) {
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(artworkSearchTerm.toLowerCase()) ||
        artwork.description.toLowerCase().includes(artworkSearchTerm.toLowerCase()) ||
        artwork.tags.some(tag => tag.toLowerCase().includes(artworkSearchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (artworkCategoryFilter !== 'all') {
      filtered = filtered.filter(artwork => artwork.category === artworkCategoryFilter);
    }

    setFilteredArtworks(filtered);
  };

  const filterRequirements = () => {
    let filtered = sharedRequirements;

    // Filter by search term
    if (requirementSearchTerm) {
      filtered = filtered.filter(requirement =>
        requirement.requirement.clientName.toLowerCase().includes(requirementSearchTerm.toLowerCase()) ||
        requirement.requirement.description.toLowerCase().includes(requirementSearchTerm.toLowerCase()) ||
        (requirement.requirement.category && requirement.requirement.category.toLowerCase().includes(requirementSearchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (requirementStatusFilter !== 'all') {
      filtered = filtered.filter(requirement => requirement.status === requirementStatusFilter);
    }

    setFilteredRequirements(filtered);
  };

  const filterOrders = () => {
    let filtered = sharedOrders;

    // Filter by search term
    if (orderSearchTerm) {
      filtered = filtered.filter(order =>
        order.order.artwork.title.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        order.order.artwork.category.toLowerCase().includes(orderSearchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (orderStatusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === orderStatusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFormData.file || !currentUser) return;

    setUploading(true);
    try {
      // Compress and create thumbnail
      const compressedFile = await compressImage(uploadFormData.file);
      const thumbnailFile = await createThumbnail(uploadFormData.file);

      // Upload to Cloudinary
      const CLOUD_NAME = 'dn2i2gk5y';
      const UPLOAD_PRESET = 'artist_upload_preset';
      const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

      // Upload main image
      const mainFormData = new FormData();
      mainFormData.append('file', compressedFile);
      mainFormData.append('upload_preset', UPLOAD_PRESET);

      const mainResponse = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: mainFormData,
      });
      const mainResult = await mainResponse.json();

      // Upload thumbnail
      const thumbFormData = new FormData();
      thumbFormData.append('file', thumbnailFile);
      thumbFormData.append('upload_preset', UPLOAD_PRESET);

      const thumbResponse = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: thumbFormData,
      });
      const thumbResult = await thumbResponse.json();

      // Save to Firestore
      const artworkData = {
        artistId: currentUser.uid,
        artistName: currentUser.displayName,
        title: uploadFormData.title,
        description: uploadFormData.description,
        category: uploadFormData.category,
        imageUrl: mainResult.secure_url,
        thumbnailUrl: thumbResult.secure_url,
        publicId: mainResult.public_id,
        price: uploadFormData.price ? parseFloat(uploadFormData.price) : null,
        isCustomizable: uploadFormData.isCustomizable,
        tags: uploadFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date(),
        updatedAt: new Date(),
        isAvailable: true
      };

      await addDoc(collection(db, 'artworks'), artworkData);
      
      toast.success('Artwork uploaded successfully!');
      setShowUploadModal(false);
      setUploadFormData({
        title: '',
        description: '',
        category: 'painting',
        price: '',
        isCustomizable: false,
        tags: '',
        file: null
      });
      fetchData();
    } catch (error) {
      console.error('Error uploading artwork:', error);
      toast.error('Failed to upload artwork');
    } finally {
      setUploading(false);
    }
  };

  const deleteArtwork = async (artworkId: string) => {
    if (!window.confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'artworks', artworkId));
      setArtworks(artworks.filter(artwork => artwork.id !== artworkId));
      toast.success('Artwork deleted successfully');
    } catch (error) {
      console.error('Error deleting artwork:', error);
      toast.error('Failed to delete artwork');
    }
  };

  const toggleArtworkVisibility = async (artworkId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'published' : 'hidden';
    
    if (!window.confirm(`Are you sure you want to ${newStatus ? 'publish' : 'hide'} this artwork?`)) {
      return;
    }

    setUpdatingArtwork(artworkId);
    try {
      await updateDoc(doc(db, 'artworks', artworkId), {
        isAvailable: newStatus,
        updatedAt: new Date()
      });
      
      setArtworks(artworks.map(artwork => 
        artwork.id === artworkId 
          ? { ...artwork, isAvailable: newStatus }
          : artwork
      ));
      
      toast.success(`Artwork ${action} successfully`);
    } catch (error) {
      console.error('Error updating artwork visibility:', error);
      toast.error(`Failed to ${newStatus ? 'publish' : 'hide'} artwork`);
    } finally {
      setUpdatingArtwork(null);
    }
  };

  const handleRequirementAction = async (requirementId: string, action: 'accept' | 'decline') => {
    if (!currentUser || !selectedRequirement) return;

    // Check if requirement is already accepted by another artist
    if (selectedRequirement.requirement.acceptedBy && 
        selectedRequirement.requirement.acceptedBy.artistId !== currentUser.uid) {
      toast.error('This requirement has already been accepted by another artist');
      return;
    }

    const confirmMessage = action === 'accept' 
      ? 'Are you sure you want to accept this requirement?' 
      : 'Are you sure you want to decline this requirement?';
    
    if (!window.confirm(confirmMessage)) return;

    if (action === 'decline' && !declineReason.trim()) {
      toast.error('Please provide a reason for declining');
      return;
    }

    try {
      const updateData: any = {
        status: action === 'accept' ? 'accepted' : 'declined',
        [`${action}edAt`]: new Date()
      };

      if (action === 'decline') {
        updateData.declineReason = declineReason;
      }

      await updateDoc(doc(db, 'sharedRequirements', requirementId), updateData);

      if (action === 'accept') {
        // Update the original requirement to mark as assigned
        await updateDoc(doc(db, 'requirements', selectedRequirement.requirementId), {
          status: 'assigned',
          acceptedBy: {
            artistId: currentUser.uid,
            artistName: currentUser.displayName,
            artistEmail: currentUser.email,
            acceptedAt: new Date()
          }
        });

        // Update all other shared requirements for this requirement to show as unavailable
        const allSharedRequirementsQuery = query(
          collection(db, 'sharedRequirements'),
          where('requirementId', '==', selectedRequirement.requirementId)
        );
        const allSharedRequirementsSnapshot = await getDocs(allSharedRequirementsQuery);
        
        const updatePromises = allSharedRequirementsSnapshot.docs.map(async (sharedDoc) => {
          if (sharedDoc.id !== requirementId) {
            // Update other artists' shared requirements to show requirement is no longer available
            await updateDoc(doc(db, 'sharedRequirements', sharedDoc.id), {
              'requirement.acceptedBy': {
                artistId: currentUser.uid,
                artistName: currentUser.displayName,
                artistEmail: currentUser.email,
                acceptedAt: new Date()
              }
            });
          }
        });

        await Promise.all(updatePromises);
      }

      // Update local state
      setSharedRequirements(sharedRequirements.map(req => 
        req.id === requirementId ? { ...req, ...updateData } : req
      ));

      // If we accepted, also update the requirement data for all shared requirements
      if (action === 'accept') {
        setSharedRequirements(sharedRequirements.map(req => 
          req.requirementId === selectedRequirement.requirementId 
            ? { 
                ...req, 
                requirement: {
                  ...req.requirement,
                  acceptedBy: {
                    artistId: currentUser.uid,
                    artistName: currentUser.displayName,
                    artistEmail: currentUser.email,
                    acceptedAt: new Date()
                  }
                }
              } 
            : req
        ));
      }

      toast.success(`Requirement ${action}ed successfully`);
      setShowRequirementModal(false);
      setDeclineReason('');
    } catch (error) {
      console.error(`Error ${action}ing requirement:`, error);
      toast.error(`Failed to ${action} requirement`);
    }
  };

  const handleOrderAction = async (orderId: string, action: 'accept' | 'decline') => {
    if (!currentUser || !selectedOrder) return;

    const confirmMessage = action === 'accept' 
      ? 'Are you sure you want to accept this order?' 
      : 'Are you sure you want to decline this order?';
    
    if (!window.confirm(confirmMessage)) return;

    if (action === 'decline' && !declineReason.trim()) {
      toast.error('Please provide a reason for declining');
      return;
    }

    try {
      const updateData: any = {
        status: action === 'accept' ? 'accepted' : 'declined',
        [`${action}edAt`]: new Date()
      };

      if (action === 'decline') {
        updateData.declineReason = declineReason;
      }

      // Update the shared order
      await updateDoc(doc(db, 'sharedOrders', orderId), updateData);

      if (action === 'accept') {
        // Update the original order
        await updateDoc(doc(db, 'orders', selectedOrder.orderId), {
          status: 'confirmed',
          confirmedAt: new Date()
        });
      } else {
        // Update the original order to cancelled with decline reason
        await updateDoc(doc(db, 'orders', selectedOrder.orderId), {
          status: 'cancelled',
          declineReason: declineReason,
          cancelledAt: new Date()
        });
      }

      // Update local state
      setSharedOrders(sharedOrders.map(order => 
        order.id === orderId ? { ...order, ...updateData } : order
      ));

      toast.success(`Order ${action}ed successfully`);
      setShowOrderModal(false);
      setDeclineReason('');
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      toast.error(`Failed to ${action} order`);
    }
  };

  const deleteRequirement = async (requirementId: string) => {
    if (!window.confirm('Are you sure you want to delete this requirement? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'sharedRequirements', requirementId));
      setSharedRequirements(sharedRequirements.filter(req => req.id !== requirementId));
      toast.success('Requirement deleted successfully');
      setShowRequirementModal(false);
    } catch (error) {
      console.error('Error deleting requirement:', error);
      toast.error('Failed to delete requirement');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'sharedOrders', orderId));
      setSharedOrders(sharedOrders.filter(order => order.id !== orderId));
      toast.success('Order deleted successfully');
      setShowOrderModal(false);
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const shareToWhatsApp = (order: SharedOrder) => {
    const message = `*Order Declined - FrameGlobe*

*Artwork:* ${order.order.artwork.title}
*Category:* ${order.order.artwork.category}
*Decline Reason:* ${order.declineReason}

*Order Details:*
- Shared Date: ${formatTimestamp(order.sharedAt)}
- Declined Date: ${formatTimestamp(order.declinedAt)}

*Artist:* ${order.artistName}
*Email:* ${order.artistEmail}

Please review and take necessary action.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setShowImageModal(true);
  };

  // Check if requirement is accepted by another artist
  const isRequirementAcceptedByOther = (requirement: SharedRequirement) => {
    return requirement.requirement.acceptedBy && 
           requirement.requirement.acceptedBy.artistId !== currentUser?.uid;
  };

  // Check if requirement is accepted by current artist
  const isRequirementAcceptedByMe = (requirement: SharedRequirement) => {
    return requirement.requirement.acceptedBy && 
           requirement.requirement.acceptedBy.artistId === currentUser?.uid;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Artist Dashboard - FrameGlobe</title>
        <meta name="description" content="Manage your artworks, view client requirements, and handle orders in your artist dashboard." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Artist Dashboard</h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Welcome back, {currentUser?.displayName}</p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Upload Artwork</span>
                <span className="sm:hidden">Upload</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center">
                <Palette className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Artworks</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{artworks.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Requirements</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{sharedRequirements.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center">
                <IndianRupee className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Orders</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{sharedOrders.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('artworks')}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === 'artworks'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Artworks ({filteredArtworks.length})
                </button>
                <button
                  onClick={() => setActiveTab('requirements')}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === 'requirements'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Requirements ({filteredRequirements.length})
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === 'orders'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Orders ({filteredOrders.length})
                </button>
              </nav>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === 'artworks' && (
                <div className="space-y-4">
                  {/* Mobile Filter Toggle */}
                  <div className="sm:hidden">
                    <button
                      onClick={() => setShowArtworkFilters(!showArtworkFilters)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700"
                    >
                      <span>Filters</span>
                      <Filter className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Artworks Filter */}
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${showArtworkFilters ? 'block' : 'hidden sm:grid'}`}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <input
                        type="text"
                        placeholder="Search artworks..."
                        className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        value={artworkSearchTerm}
                        onChange={(e) => setArtworkSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <select
                        className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none text-sm"
                        value={artworkCategoryFilter}
                        onChange={(e) => setArtworkCategoryFilter(e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {filteredArtworks.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <Palette className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                        {artworkSearchTerm || artworkCategoryFilter !== 'all' ? 'No artworks found' : 'No artworks yet'}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base px-4">
                        {artworkSearchTerm || artworkCategoryFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'Upload your first artwork to get started'
                        }
                      </p>
                      {(!artworkSearchTerm && artworkCategoryFilter === 'all') && (
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                        >
                          Upload Artwork
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {filteredArtworks.map(artwork => (
                        <div key={artwork.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                          <div 
                            className="relative cursor-pointer"
                            onClick={() => openImageModal(artwork.imageUrl)}
                          >
                            <img
                              src={artwork.thumbnailUrl || artwork.imageUrl}
                              alt={artwork.title}
                              className="w-full h-40 sm:h-48 object-cover hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                              <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                            </div>
                          </div>
                          <div className="p-3 sm:p-4">
                            <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-1">{artwork.title}</h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{artwork.description}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                                {artwork.category}
                              </span>
                              {artwork.price && (
                                <span className="text-green-600 font-semibold text-sm">₹{artwork.price}</span>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => toggleArtworkVisibility(artwork.id, artwork.isAvailable)}
                                  disabled={updatingArtwork === artwork.id}
                                  className={`p-1 transition-colors ${
                                    artwork.isAvailable 
                                      ? 'text-orange-600 hover:text-orange-800' 
                                      : 'text-green-600 hover:text-green-800'
                                  } ${updatingArtwork === artwork.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  title={artwork.isAvailable ? 'Hide from gallery' : 'Publish to gallery'}
                                >
                                  {updatingArtwork === artwork.id ? (
                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-current"></div>
                                  ) : artwork.isAvailable ? (
                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                  ) : (
                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 opacity-50" />
                                  )}
                                </button>
                                <button 
                                  onClick={() => deleteArtwork(artwork.id)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </button>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                artwork.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {artwork.isAvailable ? 'Published' : 'Hidden'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'requirements' && (
                <div className="space-y-4">
                  {/* Mobile Filter Toggle */}
                  <div className="sm:hidden">
                    <button
                      onClick={() => setShowRequirementFilters(!showRequirementFilters)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700"
                    >
                      <span>Filters</span>
                      <Filter className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Requirements Filter */}
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${showRequirementFilters ? 'block' : 'hidden sm:grid'}`}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <input
                        type="text"
                        placeholder="Search requirements..."
                        className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        value={requirementSearchTerm}
                        onChange={(e) => setRequirementSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <select
                        className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none text-sm"
                        value={requirementStatusFilter}
                        onChange={(e) => setRequirementStatusFilter(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="declined">Declined</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  {filteredRequirements.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No requirements found</h3>
                      <p className="text-gray-600 text-sm sm:text-base px-4">
                        {requirementSearchTerm || requirementStatusFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'Client requirements will appear here when shared with you'
                        }
                      </p>
                    </div>
                  ) : (
                    filteredRequirements.map(requirement => {
                      const isAcceptedByOther = isRequirementAcceptedByOther(requirement);
                      const isAcceptedByMe = isRequirementAcceptedByMe(requirement);
                      
                      return (
                        <div key={requirement.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                Requirement from {requirement.requirement.clientName}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600">
                                Proposed Price: ₹{requirement.proposedPrice}
                              </p>
                              
                              {/* Status indicators */}
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                {isAcceptedByMe && (
                                  <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>Accepted by you</span>
                                  </div>
                                )}
                                
                                {isAcceptedByOther && (
                                  <div className="flex items-center space-x-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                                    <Lock className="h-3 w-3" />
                                    <span>Accepted by {requirement.requirement.acceptedBy?.artistName}</span>
                                  </div>
                                )}
                                
                                {requirement.status === 'declined' && requirement.declineReason && (
                                  <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                                    <X className="h-3 w-3" />
                                    <span>Declined by you</span>
                                  </div>
                                )}
                              </div>
                              
                              {requirement.status === 'declined' && requirement.declineReason && (
                                <p className="text-xs sm:text-sm text-red-600 mt-1">
                                  Reason: {requirement.declineReason}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2 flex-wrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                                {requirement.status === 'declined' && requirement.declineReason ? 'Declined by you' : 
                                 requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedRequirement(requirement);
                                  setShowRequirementModal(true);
                                }}
                                className="bg-gray-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-gray-700 transition-colors flex items-center space-x-1"
                              >
                                <Eye className="h-3 w-3" />
                                <span className="hidden sm:inline">View</span>
                              </button>
                              <button
                                onClick={() => deleteRequirement(requirement.id)}
                                className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Shared: {formatTimestamp(requirement.sharedAt)}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Mobile Filter Toggle */}
                  <div className="sm:hidden">
                    <button
                      onClick={() => setShowOrderFilters(!showOrderFilters)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700"
                    >
                      <span>Filters</span>
                      <Filter className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Orders Filter */}
                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${showOrderFilters ? 'block' : 'hidden sm:grid'}`}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        value={orderSearchTerm}
                        onChange={(e) => setOrderSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <select
                        className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none text-sm"
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="declined">Declined</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <IndianRupee className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                      <p className="text-gray-600 text-sm sm:text-base px-4">
                        {orderSearchTerm || orderStatusFilter !== 'all' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'Orders will appear here when clients order your artworks'
                        }
                      </p>
                    </div>
                  ) : (
                    filteredOrders.map(order => (
                      <div key={order.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div 
                              className="cursor-pointer flex-shrink-0"
                              onClick={() => openImageModal(order.order.artwork.imageUrl)}
                            >
                              <img
                                src={order.order.artwork.imageUrl}
                                alt={order.order.artwork.title}
                                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg hover:opacity-80 transition-opacity"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{order.order.artwork.title}</h3>
                              <p className="text-xs sm:text-sm text-gray-600">{order.order.artwork.category}</p>
                              {order.status === 'declined' && order.declineReason && (
                                <p className="text-xs sm:text-sm text-red-600 mt-1 line-clamp-2">
                                  Declined by you: {order.declineReason}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status === 'declined' && order.declineReason ? 'Declined by you' : 
                               order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            
                            {/* WhatsApp Share Button for Declined Orders */}
                            {order.status === 'declined' && order.declineReason && (
                              <button
                                onClick={() => shareToWhatsApp(order)}
                                className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                                title="Share decline details via WhatsApp"
                              >
                                <MessageCircle className="h-3 w-3" />
                                <span className="hidden sm:inline">Share</span>
                              </button>
                            )}
                            
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderModal(true);
                              }}
                              className="bg-gray-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-gray-700 transition-colors flex items-center space-x-1"
                            >
                              <Eye className="h-3 w-3" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          Shared: {formatTimestamp(order.sharedAt)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full Size Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
            <div className="relative max-w-full max-h-full">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white hover:text-gray-300 z-10"
              >
                <X className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>
              <img
                src={selectedImageUrl}
                alt="Full size view"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Upload New Artwork</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              
              <form onSubmit={handleUploadSubmit} className="space-y-4 sm:space-y-6">
                <FileUpload
                  onFileSelect={(file) => setUploadFormData({...uploadFormData, file})}
                  selectedFile={uploadFormData.file}
                  accept="image/*"
                  label="Artwork Image *"
                  description="Upload your artwork image (JPEG, PNG, WebP)"
                  disabled={uploading}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={uploadFormData.title}
                      onChange={(e) => setUploadFormData({...uploadFormData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="Artwork title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={uploadFormData.category}
                      onChange={(e) => setUploadFormData({...uploadFormData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={uploadFormData.description}
                    onChange={(e) => setUploadFormData({...uploadFormData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Describe your artwork..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (INR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={uploadFormData.price}
                      onChange={(e) => setUploadFormData({...uploadFormData, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="Optional price"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={uploadFormData.tags}
                      onChange={(e) => setUploadFormData({...uploadFormData, tags: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="customizable"
                    checked={uploadFormData.isCustomizable}
                    onChange={(e) => setUploadFormData({...uploadFormData, isCustomizable: e.target.checked})}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="customizable" className="ml-2 text-sm text-gray-700">
                    This artwork can be customized
                  </label>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !uploadFormData.file}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{uploading ? 'Uploading...' : 'Upload Artwork'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Requirement Detail Modal */}
        {showRequirementModal && selectedRequirement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Requirement Details</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => deleteRequirement(selectedRequirement.id)}
                      className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => setShowRequirementModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Client Request</h3>
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                        <p className="text-gray-700 text-sm sm:text-base">{selectedRequirement.requirement.description}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Proposed Price</h4>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">₹{selectedRequirement.proposedPrice}</p>
                    </div>

                    {selectedRequirement.requirement.category && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Category</h4>
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                          {selectedRequirement.requirement.category}
                        </span>
                      </div>
                    )}

                    {selectedRequirement.requirement.deadline && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Deadline</h4>
                        <p className="text-gray-700 text-sm sm:text-base">
                          {new Date(selectedRequirement.requirement.deadline.seconds * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {selectedRequirement.requirement.attachmentUrl && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Reference Image</h4>
                        <div className="relative">
                          <img
                            src={selectedRequirement.requirement.attachmentUrl}
                            alt="Client reference"
                            className="w-full h-auto object-contain max-h-64 rounded-lg border cursor-pointer"
                            onClick={() => openImageModal(selectedRequirement.requirement.attachmentUrl!)}
                          />
                          <button
                            onClick={() => openImageModal(selectedRequirement.requirement.attachmentUrl!)}
                            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Status</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequirement.status)}`}>
                        {selectedRequirement.status === 'declined' && selectedRequirement.declineReason ? 'Declined by you' : 
                         selectedRequirement.status.charAt(0).toUpperCase() + selectedRequirement.status.slice(1)}
                      </span>
                    </div>

                    {/* Show acceptance status */}
                    {isRequirementAcceptedByMe(selectedRequirement) && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h4 className="font-medium text-green-900 text-sm sm:text-base">Accepted by You</h4>
                        </div>
                        <p className="text-green-700 text-sm">
                          You accepted this requirement on {formatTimestamp(selectedRequirement.requirement.acceptedBy?.acceptedAt)}
                        </p>
                      </div>
                    )}

                    {isRequirementAcceptedByOther(selectedRequirement) && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Lock className="h-5 w-5 text-orange-600" />
                          <h4 className="font-medium text-orange-900 text-sm sm:text-base">Already Accepted</h4>
                        </div>
                        <p className="text-orange-700 text-sm">
                          This requirement has been accepted by <strong>{selectedRequirement.requirement.acceptedBy?.artistName}</strong> on{' '}
                          {formatTimestamp(selectedRequirement.requirement.acceptedBy?.acceptedAt)}
                        </p>
                      </div>
                    )}

                    {selectedRequirement.status === 'pending' && !isRequirementAcceptedByOther(selectedRequirement) && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Decline Reason (if declining)
                          </label>
                          <textarea
                            rows={3}
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="Reason for declining this requirement..."
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                          <button
                            onClick={() => handleRequirementAction(selectedRequirement.id, 'decline')}
                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                          >
                            <X className="h-4 w-4" />
                            <span>Decline</span>
                          </button>
                          <button
                            onClick={() => handleRequirementAction(selectedRequirement.id, 'accept')}
                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                          >
                            <Check className="h-4 w-4" />
                            <span>Accept</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedRequirement.status === 'declined' && selectedRequirement.declineReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                        <h4 className="font-medium text-red-900 mb-2 text-sm sm:text-base">Decline Reason</h4>
                        <p className="text-red-700 text-sm">{selectedRequirement.declineReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order Details</h2>
                  <div className="flex items-center space-x-2">
                    {/* WhatsApp Share Button for Declined Orders */}
                    {selectedOrder.status === 'declined' && selectedOrder.declineReason && (
                      <button
                        onClick={() => shareToWhatsApp(selectedOrder)}
                        className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
                        title="Share decline details via WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Share via WhatsApp</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteOrder(selectedOrder.id)}
                      className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <div className="relative">
                      <img
                        src={selectedOrder.order.artwork.imageUrl}
                        alt={selectedOrder.order.artwork.title}
                        className="w-full h-auto object-contain max-h-96 rounded-lg cursor-pointer"
                        onClick={() => openImageModal(selectedOrder.order.artwork.imageUrl)}
                      />
                      <button
                        onClick={() => openImageModal(selectedOrder.order.artwork.imageUrl)}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{selectedOrder.order.artwork.title}</h3>
                      <p className="text-gray-600 text-sm sm:text-base">{selectedOrder.order.artwork.category}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Status</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status === 'declined' && selectedOrder.declineReason ? 'Declined by you' : 
                         selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Shared Date</h4>
                      <p className="text-gray-700 text-sm sm:text-base">{formatTimestamp(selectedOrder.sharedAt)}</p>
                    </div>

                    {selectedOrder.order.requirements && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Special Requirements</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-700 text-sm">{selectedOrder.order.requirements}</p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.order.alterationDescription && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Customization Request</h4>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-gray-700 text-sm">{selectedOrder.order.alterationDescription}</p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.status === 'pending' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Decline Reason (if declining)
                          </label>
                          <textarea
                            rows={3}
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="Reason for declining this order..."
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                          <button
                            onClick={() => handleOrderAction(selectedOrder.id, 'decline')}
                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                          >
                            <X className="h-4 w-4" />
                            <span>Decline</span>
                          </button>
                          <button
                            onClick={() => handleOrderAction(selectedOrder.id, 'accept')}
                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                          >
                            <Check className="h-4 w-4" />
                            <span>Accept</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedOrder.status === 'declined' && selectedOrder.declineReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                        <h4 className="font-medium text-red-900 mb-2 text-sm sm:text-base">Decline Reason</h4>
                        <p className="text-red-700 text-sm">{selectedOrder.declineReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
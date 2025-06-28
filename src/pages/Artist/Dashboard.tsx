import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
// Firebase Storage imports for upload removed: ref, uploadBytes, getDownloadURL, deleteObject (from firebase/storage)
// Storage import removed: storage
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Artwork, SharedRequirement } from '../../types';
import { Helmet } from 'react-helmet-async';
import { Upload, Image, Trash2, Edit, Eye, Plus, X, MessageSquare, Check, Clock, User, Mail, Phone, Calendar, DollarSign, AlertCircle, CheckCircle, FileText } from 'lucide-react';
// Image optimization imports removed: compressImage, createThumbnail
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [sharedRequirements, setSharedRequirements] = useState<SharedRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'artworks' | 'requirements'>('artworks');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<SharedRequirement | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [uploadProgress, setUploadProgress] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'painting',
    price: '',
    dimensions: '',
    medium: '',
    year: new Date().getFullYear().toString(),
    tags: '',
    image: null as File | null
  });

  const categories = ['painting', 'drawing', 'digital', 'sculpture', 'photography', 'mixed-media'];

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    if (!currentUser) return;
    
    try {
      // Fetch artworks
      const artworksQuery = query(
        collection(db, 'artworks'),
        where('artistId', '==', currentUser.uid)
      );
      const artworksSnapshot = await getDocs(artworksQuery);
      const artworksList = artworksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artwork[];

      // Fetch shared requirements
      const requirementsQuery = query(
        collection(db, 'sharedRequirements'),
        where('artistId', '==', currentUser.uid)
      );
      const requirementsSnapshot = await getDocs(requirementsQuery);
      const requirementsList = requirementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SharedRequirement[];
      
      setArtworks(artworksList);
      setSharedRequirements(requirementsList);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !formData.image) {
      toast.error('Please select an image');
      return;
    }

    setUploadProgress(true);
    const CLOUD_NAME = 'dlsgpthqy';
    const UPLOAD_PRESET = 'artist_upload_preset';
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    try {
      const data = new FormData();
      data.append('file', formData.image as File);
      data.append('upload_preset', UPLOAD_PRESET);

      let cloudinaryResponse;
      try {
        const res = await fetch(UPLOAD_URL, {
          method: 'POST',
          body: data,
        });
        if (!res.ok) {
          const errorData = await res.json();
          console.error('Cloudinary upload failed:', errorData);
          throw new Error(`Cloudinary upload failed: ${errorData.error.message || res.statusText}`);
        }
        cloudinaryResponse = await res.json();
        console.log('Cloudinary upload successful:', cloudinaryResponse);
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        toast.error(`Upload failed: ${uploadError.message || 'Could not connect to Cloudinary.'}`);
        setUploadProgress(false);
        return;
      }

      const artworkData = {
        artistId: currentUser.uid,
        artistName: currentUser.displayName,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageUrl: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id, // Store public_id for potential future management
        // thumbnailUrl will be generated dynamically or via Cloudinary transformations
        price: formData.price ? parseFloat(formData.price) : null,
        dimensions: formData.dimensions || null,
        medium: formData.medium || null,
        year: formData.year ? parseInt(formData.year) : null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date(),
        updatedAt: new Date(),
        isAvailable: true,
      };

      try {
        await addDoc(collection(db, 'artworks'), artworkData);
      } catch (firestoreError) {
        console.error('Error saving artwork data to Firestore:', firestoreError);
        toast.error('Failed to save artwork details. Please try again.');
        // Note: If Firestore fails, the image is already on Cloudinary.
        // Implementing a robust cleanup for this client-side is complex
        // and might require a backend function to delete from Cloudinary securely.
        // For now, we'll log this and alert the user.
        console.warn('Orphaned image on Cloudinary possible due to Firestore save error. Public ID:', cloudinaryResponse.public_id);
        toast.error('Artwork data save failed. Please contact support if the image was uploaded but not listed.');
        setUploadProgress(false);
        return;
      }
      
      toast.success('Artwork uploaded successfully!');
      setShowUploadForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'painting',
        price: '',
        dimensions: '',
        medium: '',
        year: new Date().getFullYear().toString(),
        tags: '',
        image: null
      });
      
      fetchData(); // Refresh data
    } catch (error) { // General catch-all for unexpected errors
      console.error('Unexpected error during artwork upload:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setUploadProgress(false);
    }
  };

  const handleDelete = async (artwork: Artwork) => {
    if (!confirm('Are you sure you want to delete this artwork? This will remove the artwork listing but the image will remain on Cloudinary for now.')) return;

    try {
      // Delete artwork document from Firestore
      await deleteDoc(doc(db, 'artworks', artwork.id));

      toast.success('Artwork listing deleted successfully. The image file still exists on Cloudinary.');
      // Note: To delete the actual image from Cloudinary, a backend function
      // is needed to securely use the Cloudinary Admin API with the artwork's publicId.
      if (artwork.publicId) {
        console.warn(`Artwork ${artwork.id} (Cloudinary public_id: ${artwork.publicId}) deleted from Firestore. Corresponding image on Cloudinary was not deleted.`);
      } else {
        console.warn(`Artwork ${artwork.id} deleted from Firestore. Corresponding image on Cloudinary was not deleted (no public_id found).`);
      }
      fetchData();
    } catch (error) {
      console.error('Error deleting artwork listing:', error);
      toast.error('Failed to delete artwork listing.');
    }
  };

  const toggleAvailability = async (artwork: Artwork) => {
    try {
      await updateDoc(doc(db, 'artworks', artwork.id), {
        isAvailable: !artwork.isAvailable,
        updatedAt: new Date()
      });
      
      toast.success(`Artwork ${artwork.isAvailable ? 'hidden' : 'published'}`);
      fetchData();
    } catch (error) {
      console.error('Error updating artwork:', error);
      toast.error('Failed to update artwork');
    }
  };

  const handleRequirementResponse = async (requirementId: string, action: 'accept' | 'decline') => {
    if (!currentUser) return;

    try {
      if (action === 'accept') {
        // Update shared requirement status
        await updateDoc(doc(db, 'sharedRequirements', requirementId), {
          status: 'accepted'
        });

        // Find the requirement
        const requirement = sharedRequirements.find(r => r.id === requirementId);
        if (requirement) {
          // Update the original requirement with accepted artist info
          await updateDoc(doc(db, 'requirements', requirement.requirementId), {
            status: 'assigned',
            acceptedBy: {
              artistId: currentUser.uid,
              artistName: currentUser.displayName,
              artistEmail: currentUser.email,
              acceptedAt: new Date()
            }
          });

          // Get all shared requirements for this requirement ID and update others to declined
          const otherSharedQuery = query(
            collection(db, 'sharedRequirements'),
            where('requirementId', '==', requirement.requirementId)
          );
          const otherSharedSnapshot = await getDocs(otherSharedQuery);
          
          // Update all other shared requirements to declined
          const updatePromises = otherSharedSnapshot.docs
            .filter(doc => doc.data().artistId !== currentUser.uid)
            .map(doc => updateDoc(doc.ref, { status: 'declined' }));
          
          await Promise.all(updatePromises);
        }

        toast.success('Requirement accepted! Admin will contact you soon.');
      } else {
        await updateDoc(doc(db, 'sharedRequirements', requirementId), {
          status: 'declined'
        });
        toast.success('Requirement declined');
      }

      fetchData();
    } catch (error) {
      console.error('Error responding to requirement:', error);
      toast.error('Failed to respond to requirement');
    }
  };

  const handleMarkAsCompleted = async () => {
    if (!selectedRequirement || !currentUser) return;

    try {
      // Update the original requirement with completion info
      await updateDoc(doc(db, 'requirements', selectedRequirement.requirementId), {
        status: 'completed',
        workCompleted: {
          artistId: currentUser.uid,
          artistName: currentUser.displayName,
          artistEmail: currentUser.email,
          completedAt: new Date(),
          notes: completionNotes
        }
      });

      // Update the shared requirement status
      await updateDoc(doc(db, 'sharedRequirements', selectedRequirement.id), {
        status: 'completed'
      });

      toast.success('Work marked as completed! Admin has been notified.');
      setShowCompletionModal(false);
      setSelectedRequirement(null);
      setCompletionNotes('');
      fetchData();
    } catch (error) {
      console.error('Error marking work as completed:', error);
      toast.error('Failed to mark work as completed');
    }
  };

  const getRequirementStatusBadge = (sharedReq: SharedRequirement) => {
    const { status } = sharedReq;
    
    if (status === 'declined') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center space-x-1">
          <X className="h-3 w-3" />
          <span>Declined - Another artist was selected</span>
        </span>
      );
    }
    
    if (status === 'accepted') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center space-x-1">
          <Check className="h-3 w-3" />
          <span>Accepted by you</span>
        </span>
      );
    }
    
    if (status === 'completed') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center space-x-1">
          <CheckCircle className="h-3 w-3" />
          <span>Work Completed</span>
        </span>
      );
    }
    
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center space-x-1">
        <Clock className="h-3 w-3" />
        <span>Pending Response</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const pendingRequirements = sharedRequirements.filter(r => r.status === 'pending');
  const acceptedRequirements = sharedRequirements.filter(r => r.status === 'accepted');

  return (
    <>
      <Helmet>
        <title>Artist Dashboard - ArtistHub</title>
        <meta name="description" content="Manage your artworks, upload new pieces, and track your portfolio on ArtistHub." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Artist Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back, {currentUser?.displayName}!</p>
              </div>
              <button
                onClick={() => setShowUploadForm(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Upload Artwork</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Image className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Artworks</p>
                  <p className="text-2xl font-bold text-gray-900">{artworks.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {artworks.filter(a => a.isAvailable).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Shared Requirements</p>
                  <p className="text-2xl font-bold text-gray-900">{sharedRequirements.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingRequirements.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('artworks')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'artworks'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Artworks ({artworks.length})
                </button>
                <button
                  onClick={() => setActiveTab('requirements')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                    activeTab === 'requirements'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Shared Requirements ({sharedRequirements.length})
                  {pendingRequirements.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingRequirements.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'artworks' ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Artworks</h2>
                  
                  {artworks.length === 0 ? (
                    <div className="text-center py-12">
                      <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks yet</h3>
                      <p className="text-gray-600 mb-6">Upload your first artwork to get started</p>
                      <button
                        onClick={() => setShowUploadForm(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                      >
                        Upload First Artwork
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {artworks.map(artwork => (
                        <div key={artwork.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="relative">
                            <img
                              src={artwork.imageUrl.replace('/upload/', '/upload/w_300,h_300,c_fill,q_auto/')}
                              alt={artwork.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                artwork.isAvailable 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {artwork.isAvailable ? 'Published' : 'Hidden'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">{artwork.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{artwork.description}</p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 capitalize">{artwork.category}</span>
                              {artwork.price && (
                                <span className="text-sm font-medium text-green-600">${artwork.price}</span>
                              )}
                            </div>
                            
                            <div className="flex space-x-2 mt-4">
                              <button
                                onClick={() => toggleAvailability(artwork)}
                                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                                  artwork.isAvailable
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                }`}
                              >
                                {artwork.isAvailable ? 'Hide' : 'Publish'}
                              </button>
                              
                              <button
                                onClick={() => handleDelete(artwork)}
                                className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Shared Requirements</h2>
                  
                  {sharedRequirements.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No requirements shared yet</h3>
                      <p className="text-gray-600">Admin will share client requirements with you here</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {sharedRequirements.map(sharedReq => (
                        <div key={sharedReq.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Client Requirement #{sharedReq.requirement.id.slice(-6)}
                              </h3>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>Shared: {new Date(sharedReq.sharedAt.seconds * 1000).toLocaleDateString()}</span>
                                </div>
                                {getRequirementStatusBadge(sharedReq)}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              {sharedReq.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleRequirementResponse(sharedReq.id, 'accept')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                                  >
                                    <Check className="h-4 w-4" />
                                    <span>Accept</span>
                                  </button>
                                  <button
                                    onClick={() => handleRequirementResponse(sharedReq.id, 'decline')}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
                                  >
                                    <X className="h-4 w-4" />
                                    <span>Decline</span>
                                  </button>
                                </>
                              )}
                              
                              {sharedReq.status === 'accepted' && (
                                <button
                                  onClick={() => {
                                    setSelectedRequirement(sharedReq);
                                    setShowCompletionModal(true);
                                  }}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                                >
                                  <FileText className="h-4 w-4" />
                                  <span>Mark as Completed</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Client Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <span>{sharedReq.requirement.clientName}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span>{sharedReq.requirement.clientEmail}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span>{sharedReq.requirement.clientPhone}</span>
                                </div>
                              </div>

                              {(sharedReq.requirement.category || sharedReq.requirement.budget || sharedReq.requirement.deadline) && (
                                <div className="mt-4">
                                  <h4 className="font-medium text-gray-900 mb-2">Project Details</h4>
                                  <div className="space-y-1 text-sm">
                                    {sharedReq.requirement.category && (
                                      <p><span className="font-medium">Category:</span> {sharedReq.requirement.category}</p>
                                    )}
                                    {sharedReq.requirement.budget && (
                                      <div className="flex items-center space-x-1">
                                        <DollarSign className="h-4 w-4 text-green-600" />
                                        <span className="font-medium">Budget:</span>
                                        <span className="text-green-600 font-semibold">${sharedReq.requirement.budget}</span>
                                      </div>
                                    )}
                                    {sharedReq.requirement.deadline && (
                                      <p><span className="font-medium">Deadline:</span> {new Date(sharedReq.requirement.deadline.seconds * 1000).toLocaleDateString()}</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Project Description</h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                {sharedReq.requirement.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Upload New Artwork</h2>
                  <button
                    onClick={() => setShowUploadForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={uploadProgress}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artwork Image *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={uploadProgress}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: JPG, PNG. Images will be optimized automatically.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={uploadProgress}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={uploadProgress}
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
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={uploadProgress}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={uploadProgress}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dimensions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 24x36 inches"
                        value={formData.dimensions}
                        onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={uploadProgress}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year
                      </label>
                      <input
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={formData.year}
                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={uploadProgress}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medium
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Oil on canvas, Watercolor, Digital"
                      value={formData.medium}
                      onChange={(e) => setFormData({...formData, medium: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={uploadProgress}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. portrait, landscape, abstract (comma separated)"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={uploadProgress}
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowUploadForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={uploadProgress}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadProgress}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {uploadProgress ? 'Uploading...' : 'Upload Artwork'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Work Completion Modal */}
        {showCompletionModal && selectedRequirement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mark Work as Completed</h2>
              <p className="text-gray-600 mb-4">
                Are you ready to mark this requirement as completed? This will notify the admin that your work is finished.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add any notes about the completed work..."
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    setSelectedRequirement(null);
                    setCompletionNotes('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkAsCompleted}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark Completed</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
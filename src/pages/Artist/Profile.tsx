import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Artist } from '../../types';
import { Helmet } from 'react-helmet-async';
import { User, Mail, MapPin, Globe, Instagram, Twitter, Facebook, Edit, Save, X, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<Partial<Artist>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bio: '',
    specialties: '',
    location: '',
    website: '',
    instagram: '',
    twitter: '',
    facebook: ''
  });

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    if (!currentUser) return;
    
    try {
      const profileDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (profileDoc.exists()) {
        const profileData = profileDoc.data() as Artist;
        if (!profileData.referralCode) {
          const newReferralCode = currentUser.uid.slice(0, 8);
          await updateDoc(doc(db, 'users', currentUser.uid), {
            referralCode: newReferralCode
          });
          profileData.referralCode = newReferralCode;
        }
        setProfile(profileData);
        setFormData({
          bio: profileData.bio || '',
          specialties: profileData.specialties?.join(', ') || '',
          location: profileData.location || '',
          website: profileData.website || '',
          instagram: profileData.socialLinks?.instagram || '',
          twitter: profileData.socialLinks?.twitter || '',
          facebook: profileData.socialLinks?.facebook || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;

    try {
      const updateData = {
        bio: formData.bio,
        specialties: formData.specialties
          .split(',')
          .map(s => s.trim())
          .filter(s => s),
        location: formData.location,
        website: formData.website,
        socialLinks: {
          instagram: formData.instagram,
          twitter: formData.twitter,
          facebook: formData.facebook
        }
      };

      await updateDoc(doc(db, 'users', currentUser.uid), updateData);
      
      setProfile({ ...profile, ...updateData });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
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
        <title>Artist Profile - FrameGlobe</title>
        <meta name="description" content="Manage your artist profile, update your bio, specialties, and social links." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-indigo-600" />
                  </div>
                  <div className="text-white">
                    <h1 className="text-2xl font-bold">{currentUser?.displayName}</h1>
                    <p className="opacity-90">Artist Profile</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          fetchProfile(); // Reset form data
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors flex items-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-700">Email</span>
                  </div>
                  <p className="text-gray-900">{currentUser?.email}</p>
                </div>
                
                {/* <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-700">Location</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your location"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.location || 'Not specified'}</p>
                  )}
                </div> */}
              </div>

              {/* Referral Link */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Referral Link</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/register?ref=${profile.referralCode}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/register?ref=${profile.referralCode}`);
                      toast.success('Referral link copied to clipboard!');
                    }}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Biography</h3>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tell us about yourself as an artist..."
                  />
                ) : (
                  <p className="text-gray-700">
                    {profile.bio || 'No biography added yet. Click edit to add your artist story.'}
                  </p>
                )}
              </div>

              {/* Specialties */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Art Specialties</h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.specialties}
                    onChange={(e) => setFormData({...formData, specialties: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. Portrait painting, Digital art, Watercolor (comma separated)"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties && profile.specialties.length > 0 ? (
                      profile.specialties.map(specialty => (
                        <span key={specialty} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                          {specialty}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No specialties added yet.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Commission Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Commission Activity</h3>
                {profile.commissions && profile.commissions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Commission Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Earned
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {profile.commissions.map((commission, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {commission.orderId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                              ₹{commission.commissionAmount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(commission.earnedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No commission activity yet.</p>
                )}
              </div>

              {/* Website */}
              {/* <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-700">Website</span>
                </div>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://your-website.com"
                  />
                ) : (
                  <div>
                    {profile.website ? (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        {profile.website}
                      </a>
                    ) : (
                      <p className="text-gray-500">No website added</p>
                    )}
                  </div>
                )}
              </div> */}

              {/* Social Links */}
              {/* <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Instagram className="h-5 w-5 text-pink-500" />
                      <span className="font-medium text-gray-700">Instagram</span>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.instagram}
                        onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="@username"
                      />
                    ) : (
                      <div>
                        {profile.socialLinks?.instagram ? (
                          <a
                            href={`https://instagram.com/${profile.socialLinks.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-800 transition-colors"
                          >
                            @{profile.socialLinks.instagram.replace('@', '')}
                          </a>
                        ) : (
                          <p className="text-gray-500">Not connected</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Twitter className="h-5 w-5 text-blue-500" />
                      <span className="font-medium text-gray-700">Twitter</span>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.twitter}
                        onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="@username"
                      />
                    ) : (
                      <div>
                        {profile.socialLinks?.twitter ? (
                          <a
                            href={`https://twitter.com/${profile.socialLinks.twitter.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            @{profile.socialLinks.twitter.replace('@', '')}
                          </a>
                        ) : (
                          <p className="text-gray-500">Not connected</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Facebook className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-700">Facebook</span>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.facebook}
                        onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Profile URL or username"
                      />
                    ) : (
                      <div>
                        {profile.socialLinks?.facebook ? (
                          <a
                            href={
                              profile.socialLinks.facebook.startsWith('http')
                                ? profile.socialLinks.facebook
                                : `https://facebook.com/${profile.socialLinks.facebook}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {profile.socialLinks.facebook}
                          </a>
                        ) : (
                          <p className="text-gray-500">Not connected</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
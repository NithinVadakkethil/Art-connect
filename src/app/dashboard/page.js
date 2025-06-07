'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Image, 
  Briefcase, 
  Calendar, 
  Plus, 
  Eye, 
  Edit,
  MessageCircle 
} from 'lucide-react';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const isArtist = currentUser.isArtist;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {currentUser.displayName || currentUser.name}!
        </h1>
        <p className="text-purple-100">
          {isArtist ? 'Manage your artworks and profile' : 'Discover amazing artists and artwork'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Profile Views</p>
              <p className="text-2xl font-bold text-gray-800">124</p>
            </div>
            <Eye className="text-blue-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{isArtist ? 'Artworks' : 'Favorites'}</p>
              <p className="text-2xl font-bold text-gray-800">8</p>
            </div>
            <Image className="text-green-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Messages</p>
              <p className="text-2xl font-bold text-gray-800">3</p>
            </div>
            <MessageCircle className="text-purple-500" size={32} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{isArtist ? 'Commissions' : 'Requests'}</p>
              <p className="text-2xl font-bold text-gray-800">2</p>
            </div>
            <Briefcase className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Main Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {isArtist ? (
                <>
                  <Link
                    href="/upload"
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors"
                  >
                    <Plus className="text-purple-600" size={24} />
                    <div>
                      <h3 className="font-medium">Upload Artwork</h3>
                      <p className="text-sm text-gray-600">Add new artwork to your gallery</p>
                    </div>
                  </Link>
                  <Link
                    href="/profile/edit"
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    <Edit className="text-blue-600" size={24} />
                    <div>
                      <h3 className="font-medium">Edit Profile</h3>
                      <p className="text-sm text-gray-600">Update your artist profile</p>
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/gallery"
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors"
                  >
                    <Image className="text-purple-600" size={24} />
                    <div>
                      <h3 className="font-medium">Browse Gallery</h3>
                      <p className="text-sm text-gray-600">Discover amazing artworks</p>
                    </div>
                  </Link>
                  <Link
                    href="/requests/new"
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors"
                  >
                    <Plus className="text-green-600" size={24} />
                    <div>
                      <h3 className="font-medium">Post Request</h3>
                      <p className="text-sm text-gray-600">Request custom artwork</p>
                    </div>
                  </Link>
                </>
              )}
              <Link
                href="/artists"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-colors"
              >
                <User className="text-orange-600" size={24} />
                <div>
                  <h3 className="font-medium">Find Artists</h3>
                  <p className="text-sm text-gray-600">Connect with talented artists</p>
                </div>
              </Link>
              <Link
                href="/jobs"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
              >
                <Briefcase className="text-indigo-600" size={24} />
                <div>
                  <h3 className="font-medium">Browse Jobs</h3>
                  <p className="text-sm text-gray-600">Find art opportunities</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Image className="text-purple-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New artwork uploaded</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New message received</p>
                  <p className="text-xs text-gray-600">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="text-green-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Profile view from new user</p>
                  <p className="text-xs text-gray-600">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile & Upcoming */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Profile Summary</h2>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-semibold">
                  {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0)}
                </span>
              </div>
              <h3 className="font-semibold text-lg">{currentUser.displayName || 'Complete your profile'}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {isArtist ? 'Digital Artist' : 'Art Enthusiast'}
              </p>
              <Link
                href="/profile/edit"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Edit size={16} />
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Upcoming</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Calendar className="text-yellow-600" size={20} />
                <div>
                  <p className="text-sm font-medium">Art Exhibition</p>
                  <p className="text-xs text-gray-600">Tomorrow, 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Briefcase className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm font-medium">Commission Deadline</p>
                  <p className="text-xs text-gray-600">In 3 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
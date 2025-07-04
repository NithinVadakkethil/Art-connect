import React, { useState } from 'react';
import { createAdminUser } from '../utils/createAdmin';
import { Shield, User, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSetup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);

  const handleCreateAdmin = async () => {
    setLoading(true);
    try {
      const result = await createAdminUser();
      if (result.success) {
        setAdminCreated(true);
        toast.success('Admin user created successfully!');
      } else {
        toast.error('Failed to create admin user');
      }
    } catch (error) {
      toast.error('Error creating admin user');
    } finally {
      setLoading(false);
    }
  };

  if (adminCreated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <Shield className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin User Created!</h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">admin@artisthub.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Password:</span>
                <span className="text-sm">Admin123!</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              You can now login with these credentials to access the admin dashboard.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <div className="bg-indigo-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <User className="h-10 w-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Setup Admin User</h2>
          <p className="text-gray-600 mb-6">
            Create an admin user to manage the platform. This should only be done once.
          </p>
          <button
            onClick={handleCreateAdmin}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Admin...' : 'Create Admin User'}
          </button>
          <p className="text-xs text-gray-500 mt-4">
            Default credentials will be: admin@artisthub.com / Admin123!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
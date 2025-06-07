'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Menu, 
  X, 
  Palette, 
  User, 
  LogOut, 
  Settings,
  Briefcase,
  Search,
  Image
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Palette className="text-purple-600" size={32} />
            <span className="text-2xl font-bold text-gray-800">ArtistHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/gallery" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1">
              <Image size={18} />
              Gallery
            </Link>
            <Link href="/artists" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1">
              <User size={18} />
              Artists
            </Link>
            <Link href="/jobs" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1">
              <Briefcase size={18} />
              Jobs
            </Link>
            <Link href="/requests" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1">
              <Search size={18} />
              Requests
            </Link>
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0)}
                    </span>
                  </div>
                  <span>{currentUser.displayName || 'User'}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings size={16} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/gallery" 
                className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Image size={18} />
                Gallery
              </Link>
              <Link 
                href="/artists" 
                className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <User size={18} />
                Artists
              </Link>
              <Link 
                href="/jobs" 
                className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Briefcase size={18} />
                Jobs
              </Link>
              <Link 
                href="/requests" 
                className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Search size={18} />
                Requests
              </Link>
              
              {currentUser ? (
                <>
                  <Link 
                    href="/profile" 
                    className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings size={18} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 text-left"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
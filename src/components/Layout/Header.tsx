import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Palette, User, LogOut, Menu, X, Settings, Briefcase } from 'lucide-react';
import logo from "../../assets/logo.jpeg"

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
            <span className="text-lg sm:text-xl font-bold text-gray-900">FrameGlobe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Home
            </Link>
            <Link
              to="/gallery"
              className={`text-sm font-medium transition-colors ${
                isActive('/gallery') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Gallery
            </Link>
            <Link
              to="/requirements"
              className={`text-sm font-medium transition-colors ${
                isActive('/requirements') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Custom Art
            </Link>
            {currentUser?.role === 'artist' && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/profile') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Profile
                </Link>
              </>
            )}
            {currentUser?.role === 'admin' && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors ${
                  isActive('/admin') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium truncate max-w-24 lg:max-w-none">{currentUser.displayName}</span>
                  <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                Home
              </Link>
              <Link
                to="/gallery"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors ${
                  isActive('/gallery') ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                Gallery
              </Link>
              <Link
                to="/requirements"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors ${
                  isActive('/requirements') ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                Custom Art
              </Link>
              
              {currentUser ? (
                <>
                  {currentUser.role === 'artist' && (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-sm font-medium transition-colors ${
                          isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-500'
                        }`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-sm font-medium transition-colors ${
                          isActive('/profile') ? 'text-indigo-600' : 'text-gray-500'
                        }`}
                      >
                        Profile
                      </Link>
                    </>
                  )}
                  {currentUser.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-sm font-medium transition-colors ${
                        isActive('/admin') ? 'text-indigo-600' : 'text-gray-500'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700 truncate">{currentUser.displayName}</span>
                    <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                      {currentUser.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-gray-500"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
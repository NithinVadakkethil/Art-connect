import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminSetup from './components/AdminSetup';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import ArtworkDetail from './pages/ArtworkDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import RegisterAffiliate from './pages/Auth/RegisterAffiliate';
import Dashboard from './pages/Artist/Dashboard';
import Profile from './pages/Artist/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AffiliateDashboard from './pages/Affiliate/Dashboard';
import ClientDashboard from './pages/Client/Dashboard';
import ClientRequirements from './pages/Client/ClientRequirements';
import ForgotPassword from './pages/Auth/ForgotPassword';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="artwork/:id" element={<ArtworkDetail />} />
                <Route path="requirements" element={<ClientRequirements />} />
                
                {/* Artist Routes */}
                <Route 
                  path="dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['artist']}>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="profile" 
                  element={
                    <ProtectedRoute allowedRoles={['artist']}>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="admin" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />

                {/* Affiliate Routes */}
                <Route
                  path="affiliate/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['affiliate']}>
                      <AffiliateDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Client Routes */}
                <Route
                  path="client/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['client']}>
                      <ClientDashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register-affiliate" element={<RegisterAffiliate />} />
              
              {/* Admin Setup Route */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
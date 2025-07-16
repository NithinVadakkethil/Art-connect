// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { Helmet } from 'react-helmet-async';
// import { Eye, EyeOff, Palette, AlertCircle, Info } from 'lucide-react';
// import logo from "../../assets/logo.png"

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (loading) return;

//     setLoading(true);
//     setError('');
    
//     try {
//       await login(email, password);
//       navigate('/');
//     } catch (error: any) {
//       console.error('Login error:', error);
      
//       // Handle specific Firebase auth errors
//       if (error.code === 'auth/invalid-credential') {
//         setError('Invalid email or password. Please check your credentials and try again.');
//       } else if (error.code === 'auth/user-not-found') {
//         setError('No account found with this email address. Please register first.');
//       } else if (error.code === 'auth/wrong-password') {
//         setError('Incorrect password. Please try again.');
//       } else if (error.code === 'auth/invalid-email') {
//         setError('Please enter a valid email address.');
//       } else if (error.code === 'auth/user-disabled') {
//         setError('This account has been disabled. Please contact support.');
//       } else if (error.code === 'auth/too-many-requests') {
//         setError('Too many failed login attempts. Please try again later.');
//       } else {
//         setError('Login failed. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Login - FrameGlobe</title>
//         <meta name="description" content="Login to your FrameGlobe account to access your dashboard and manage your artworks." />
//       </Helmet>

//       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8">
//           <div>
//             <div className="flex justify-center">
//               {/* <Palette className="h-12 w-12 text-indigo-600" /> */}
//               <img 
//               src={logo} 
//               alt="FrameGlobe Logo"
//               className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 object-contain" 
//             />
//             </div>
//             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//               Sign in to your account
//             </h2>
//             <p className="mt-2 text-center text-sm text-gray-600">
//               Or{' '}
//               <Link
//                 to="/register"
//                 className="font-medium text-indigo-600 hover:text-indigo-500"
//               >
//                 create a new account
//               </Link>
//             </p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="rounded-md bg-red-50 p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <AlertCircle className="h-5 w-5 text-red-400" />
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-sm font-medium text-red-800">
//                     Login Failed
//                   </h3>
//                   <div className="mt-2 text-sm text-red-700">
//                     <p>{error}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Admin Login Info */}
//           {/* <div className="rounded-md bg-blue-50 p-4">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <Info className="h-5 w-5 text-blue-400" />
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-blue-800">
//                   Admin Access
//                 </h3>
//                 <div className="mt-2 text-sm text-blue-700">
//                   <p>
//                     For admin access, use: <strong>admin@artisthub.com</strong>
//                   </p>
//                   <p className="mt-1">
//                     If the admin account doesn't exist, visit{' '}
//                     <Link 
//                       to="/setup-admin" 
//                       className="font-medium underline hover:no-underline"
//                     >
//                       /setup-admin
//                     </Link>{' '}
//                     to create it.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div> */}

//           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//             <div className="rounded-md shadow-sm -space-y-px">
//               <div>
//                 <label htmlFor="email-address" className="sr-only">
//                   Email address
//                 </label>
//                 <input
//                   id="email-address"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                   placeholder="Email address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//               <div className="relative">
//                 <label htmlFor="password" className="sr-only">
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   autoComplete="current-password"
//                   required
//                   className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4 text-gray-400" />
//                   ) : (
//                     <Eye className="h-4 w-4 text-gray-400" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//               >
//                 {loading ? 'Signing in...' : 'Sign in'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Palette, AlertCircle, Info } from 'lucide-react';
import logo from "../../assets/logo.png"

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');
    
    try {
      const user = await login(email, password);
      
      // Role-based navigation
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'artist') {
        navigate('/dashboard');
      } else if (user.role === 'client') {
        navigate('/requirements');
      } else {
        // Fallback to home for any other role
        navigate('/');
      }
      // Role-based navigation
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'artist') {
        navigate('/dashboard');
      } else if (user.role === 'client') {
        navigate('/requirements');
      } else {
        // Fallback to home for any other role
        navigate('/');
      }
      // Role-based navigation
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'artist') {
        navigate('/dashboard');
      } else if (user.role === 'client') {
        navigate('/requirements');
      } else {
        // Fallback to home for any other role
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address. Please register first.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/user-disabled') {
        setError('This account has been disabled. Please contact support.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - FrameGlobe</title>
        <meta name="description" content="Login to your FrameGlobe account to access your dashboard and manage your artworks." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              {/* <Palette className="h-12 w-12 text-indigo-600" /> */}
              <img 
              src={logo} 
              alt="FrameGlobe Logo"
              className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 object-contain" 
            />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                create a new account
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Login Failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Login Info */}
          {/* <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Admin Access
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    For admin access, use: <strong>admin@artisthub.com</strong>
                  </p>
                  <p className="mt-1">
                    If the admin account doesn't exist, visit{' '}
                    <Link 
                      to="/setup-admin" 
                      className="font-medium underline hover:no-underline"
                    >
                      /setup-admin
                    </Link>{' '}
                    to create it.
                  </p>
                </div>
              </div>
            </div>
          </div> */}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
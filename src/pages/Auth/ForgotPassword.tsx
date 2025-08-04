// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import { Helmet } from 'react-helmet-async';
// import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
// import logo from "../../assets/logo.png";

// const ForgotPassword: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const { resetPassword } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (loading) return;

//     setLoading(true);
//     setError('');
//     setMessage('');

//     try {
//       await resetPassword(email);
//       setMessage('Password reset email sent! Check your inbox for further instructions.');
//     } catch (error: any) {
//       console.error('Password reset error:', error);
      
//       // Handle specific Firebase auth errors
//       if (error.code === 'auth/user-not-found') {
//         setError('No account found with this email address. Please check your email or create a new account.');
//       } else if (error.code === 'auth/invalid-email') {
//         setError('Please enter a valid email address.');
//       } else if (error.code === 'auth/too-many-requests') {
//         setError('Too many password reset attempts. Please try again later.');
//       } else {
//         setError('Failed to send password reset email. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Reset Password - FrameGlobe</title>
//         <meta name="description" content="Reset your FrameGlobe account password to regain access to your dashboard." />
//       </Helmet>

//       <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8">
//           <div>
//             <div className="flex justify-center">
//               <img 
//                 src={logo} 
//                 alt="FrameGlobe Logo"
//                 className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 object-contain" 
//               />
//             </div>
//             <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//               Reset your password
//             </h2>
//             <p className="mt-2 text-center text-sm text-gray-600">
//               Enter your email address and we'll send you a link to reset your password.
//             </p>
//           </div>

//           {/* Success Message */}
//           {message && (
//             <div className="rounded-md bg-green-50 p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <CheckCircle className="h-5 w-5 text-green-400" />
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-sm font-medium text-green-800">
//                     Email Sent Successfully
//                   </h3>
//                   <div className="mt-2 text-sm text-green-700">
//                     <p>{message}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Error Message */}
//           {error && (
//             <div className="rounded-md bg-red-50 p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <AlertCircle className="h-5 w-5 text-red-400" />
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-sm font-medium text-red-800">
//                     Reset Failed
//                   </h3>
//                   <div className="mt-2 text-sm text-red-700">
//                     <p>{error}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
//                 Email address
//               </label>
//               <div className="mt-1 relative">
//                 <input
//                   id="email-address"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                   placeholder="Enter your email address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-4 w-4 text-gray-400" />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={loading || !!message}
//                 className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//               >
//                 {loading ? 'Sending...' : 'Send Reset Email'}
//               </button>
//             </div>

//             <div className="text-center">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-1" />
//                 Back to Sign In
//               </Link>
//             </div>
//           </form>

//           {message && (
//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-600 mb-4">
//                 Didn't receive the email? Check your spam folder or
//               </p>
//               <button
//                 onClick={() => {
//                   setMessage('');
//                   setError('');
//                 }}
//                 className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
//               >
//                 Try again
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ForgotPassword;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import logo from "../../assets/logo.png";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await forgotPassword(email);
      setMessage('Password reset email sent! Check your inbox and follow the instructions to reset your password.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address. Please check your email or create a new account.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many password reset attempts. Please try again later.');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password - FrameGlobe</title>
        <meta name="description" content="Reset your FrameGlobe account password to regain access to your dashboard." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <img 
                src={logo} 
                alt="FrameGlobe Logo"
                className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 object-contain" 
              />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Email Sent Successfully
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Reset Failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !!message}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </form>

          {message && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Didn't receive the email? Check your spam folder or
              </p>
              <button
                onClick={() => {
                  setMessage('');
                  setError('');
                }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
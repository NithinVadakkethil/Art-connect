import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Helmet } from "react-helmet-async";
import { Eye, EyeOff, Palette, User, Users, Phone } from "lucide-react";
import logo from "../../assets/logo.png"

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "artist",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePhone = (phone: string) => {
    // Remove all spaces and special characters except +
    const cleanPhone = phone.replace(/[\s-()]/g, "");

    // Indian phone number validation: +91 followed by 10 digits starting with 6-9
    const indianPhoneRegex = /^(\+91|91)?[6-9]\d{9}$/;

    // UAE phone number validation: +971 followed by 9 digits starting with 5
    const uaePhoneRegex = /^(\+971|971)?[5][0-9]\d{7}$/;

    return indianPhoneRegex.test(cleanPhone) || uaePhoneRegex.test(cleanPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (loading) return;

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError(
        "Please enter a valid phone number (e.g., +919876543210 or +971501234567)"
      );
      return;
    }

    setLoading(true);
    try {
      await register(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        formData.phone,
        referralCode
      );
      
      // Formspree submission is optional, can be removed if not needed
      fetch("https://formspree.io/f/xldnylwy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          message: `New ${formData.role} signup.`,
        }),
      }).catch(err => console.error("Formspree error:", err)); // Log error but don't block user flow
      
      navigate("/dashboard");
    } catch (err: any) {
      if (err.message.includes("auth/email-already-in-use")) {
        setError("This email is already in use. Please use a different email or log in.");
      } else {
        setError(err.message || "An unexpected error occurred. Please try again.");
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - FrameGlobe</title>
        <meta
          name="description"
          content="Join FrameGlobe as an artist to showcase your work or as a client to discover amazing artworks."
        />
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
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                sign in to existing account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {/* Role Selection */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "artist" })}
                className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                  formData.role === "artist"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <User className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Artist Signup</div>
                <div className="text-xs text-gray-500">Showcase your work</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'affiliate' })}
                className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                  formData.role === 'affiliate'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Users className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Affiliate Signup</div>
                <div className="text-xs text-gray-500">Share artwork</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'client' })}
                className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                  formData.role === 'client'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Users className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Client</div>
                <div className="text-xs text-gray-500">Discover art</div>
              </button>
            </div>

            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="India: +91 9876543210 | UAE: +971 501234567"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter your phone number with country code (India: +91, UAE:
                  +971)
                </p>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
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
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;

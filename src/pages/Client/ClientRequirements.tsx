import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { Helmet } from "react-helmet-async";
import {
  MessageSquare,
  Send,
  Palette,
  IndianRupee,
  Calendar,
  Tag,
} from "lucide-react";
import FileUpload from "../../components/FileUpload";
import toast from "react-hot-toast";

const ClientRequirements: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [formData, setFormData] = useState({
    clientName: currentUser?.displayName || "",
    clientEmail: currentUser?.email || "",
    clientPhone: "",
    address: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    attachment: null as File | null,
  });

  const categories = [
    "painting",
    "drawing",
    "digital",
    "sculpture",
    "photography",
    "mixed-media",
    "other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.clientName ||
      !formData.clientEmail ||
      !formData.clientPhone ||
      !formData.address ||
      !formData.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      let attachmentUrl = null;
      let attachmentPublicId = null;

      // Upload attachment if provided
      if (formData.attachment) {
        setUploadProgress(true);
        const CLOUD_NAME = "dlsgpthqy";
        const UPLOAD_PRESET = "artist_upload_preset";
        const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

        const data = new FormData();
        data.append("file", formData.attachment);
        data.append("upload_preset", UPLOAD_PRESET);

        try {
          const res = await fetch(UPLOAD_URL, {
            method: "POST",
            body: data,
          });
          if (!res.ok) {
            const errorData = await res.json();
            console.error("Cloudinary upload failed:", errorData);
            throw new Error(
              `Cloudinary upload failed: ${
                errorData.error?.message || res.statusText
              }`
            );
          }
          const cloudinaryResponse = await res.json();
          attachmentUrl = cloudinaryResponse.secure_url;
          attachmentPublicId = cloudinaryResponse.public_id;
        } catch (uploadError: any) {
          console.error("Error uploading to Cloudinary:", uploadError);
          toast.error(
            `Attachment upload failed: ${
              uploadError.message || "Could not connect to Cloudinary."
            }`
          );
          setLoading(false);
          setUploadProgress(false);
          return;
        }
        setUploadProgress(false);
      }

      const requirementData = {
        clientId: currentUser?.uid || "guest",
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        description: formData.description,
        category: formData.category || null,
        address: formData.address,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        deadline: formData.deadline ? new Date(formData.deadline) : null,
        attachmentUrl,
        attachmentPublicId,
        status: "open",
        createdAt: new Date(),
      };

      await addDoc(collection(db, "requirements"), requirementData);

      toast.success(
        "Your requirement has been submitted successfully! Our admin will contact you soon."
      );

      // Send email using Formspree
      try {
        const formspreeRes = await fetch("https://formspree.io/f/mkgbaaoa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientName: requirementData.clientName,
            clientEmail: requirementData.clientEmail,
            clientPhone: requirementData.clientPhone,
            description: requirementData.description,
            category: requirementData.category,
            budget: requirementData.budget,
            address: requirementData.address,
            deadline: requirementData.deadline?.toISOString() || "",
            attachmentUrl: requirementData.attachmentUrl || "",
          }),
        });

        if (!formspreeRes.ok) {
          console.warn("Formspree email not sent.");
        }
      } catch (emailErr) {
        console.error("Formspree email error:", emailErr);
      }

      // Reset form
      setFormData({
        clientName: currentUser?.displayName || "",
        clientEmail: currentUser?.email || "",
        address: "",
        clientPhone: "",
        description: "",
        category: "",
        budget: "",
        deadline: "",
        attachment: null,
      });
    } catch (error) {
      console.error("Error submitting requirement:", error);
      toast.error("Failed to submit requirement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Submit Art Requirements - ArtistHub</title>
        <meta
          name="description"
          content="Tell us about your custom artwork requirements. Our artists can create the perfect piece for you."
        />
        <meta
          name="keywords"
          content="custom art, commission art, art requirements, custom painting, personalized artwork"
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-100 rounded-full p-3">
                <MessageSquare className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tell Us About Your Art Requirements
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Looking for custom artwork? Share your vision with us and we'll
              connect you with the perfect artist to bring your ideas to life.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) =>
                        setFormData({ ...formData, clientName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.clientEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          clientEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.clientPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, clientPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Project Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Project *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Please describe your artwork requirements in detail. Include style preferences, dimensions, subject matter, colors, mood, and any specific elements you want included..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The more details you provide, the better we can match you
                    with the right artist.
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="House number, street, area, city, postal code"
                  />
                </div>

                {/* Reference Image Upload */}
                <div className="mt-4">
                  <FileUpload
                    onFileSelect={(file) =>
                      setFormData({ ...formData, attachment: file })
                    }
                    selectedFile={formData.attachment}
                    accept="image/*"
                    label="Reference Image (Optional)"
                    description="Upload any reference images, sketches, or inspiration photos to help artists understand your vision."
                    disabled={loading || uploadProgress}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag className="inline h-4 w-4 mr-1" />
                      Preferred Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <IndianRupee className="inline h-4 w-4 mr-1" />
                      Budget (INR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your budget"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Preferred Deadline
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    <Palette className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      What happens next?
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Our admin team will review your requirements and connect
                      you with suitable artists. You'll receive a response
                      within 24-48 hours with artist recommendations and next
                      steps.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || uploadProgress}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>
                    {uploadProgress
                      ? "Uploading..."
                      : loading
                      ? "Submitting..."
                      : "Submit Requirements"}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Additional Information */}
          <div className="mt-8 sm:mt-12 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">1</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Submit Requirements
                </h3>
                <p className="text-sm text-gray-600">
                  Tell us about your vision, budget, and timeline
                </p>
              </div>

              <div className="text-center">
                <div className="bg-indigo-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">2</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Artist Matching
                </h3>
                <p className="text-sm text-gray-600">
                  We'll match you with artists who specialize in your style
                </p>
              </div>

              <div className="text-center">
                <div className="bg-indigo-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">3</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Create Together
                </h3>
                <p className="text-sm text-gray-600">
                  Work with your chosen artist to create your perfect piece
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientRequirements;

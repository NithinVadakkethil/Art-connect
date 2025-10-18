// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   updateDoc,
//   doc,
//   addDoc,
//   where,
//   deleteDoc,
// } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import { Order, ClientRequirement, User } from "../types";
// import { Helmet } from "react-helmet-async";
// import {
//   Users,
//   ShoppingBag,
//   MessageSquare,
//   TrendingUp,
//   Eye,
//   Phone,
//   Mail,
//   Calendar,
//   User as UserIcon,
//   Palette,
//   Share2,
//   Check,
//   X,
//   UserCheck,
//   CheckCircle,
//   IndianRupee,
//   Send,
//   Clock,
//   PlayCircle,
//   FileText,
//   Search,
//   Filter,
//   Trash2,
//   ZoomIn,
//   MapPinned,
//   Menu,
//   ChevronDown,
//   MessageCircle,
// } from "lucide-react";
// import toast from "react-hot-toast";

// // WhatsApp Icon Component
// const WhatsAppIcon = ({ className = "h-4 w-4" }) => (
//   <svg
//     className={className}
//     viewBox="0 0 24 24"
//     fill="currentColor"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
//   </svg>
// );

// const AdminDashboard: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [requirements, setRequirements] = useState<ClientRequirement[]>([]);
//   const [artists, setArtists] = useState<User[]>([]);
//   const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
//   const [filteredRequirements, setFilteredRequirements] = useState<
//     ClientRequirement[]
//   >([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<"orders" | "requirements">(
//     "orders"
//   );
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [showShareAllModal, setShowShareAllModal] = useState(false);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [showRequirementModal, setShowRequirementModal] = useState(false);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [selectedImageUrl, setSelectedImageUrl] = useState("");
//   const [selectedRequirement, setSelectedRequirement] =
//     useState<ClientRequirement | null>(null);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
//   const [proposedPrice, setProposedPrice] = useState("");

//   // Filter states
//   const [orderSearchTerm, setOrderSearchTerm] = useState("");
//   const [orderStatusFilter, setOrderStatusFilter] = useState("all");
//   const [requirementSearchTerm, setRequirementSearchTerm] = useState("");
//   const [requirementStatusFilter, setRequirementStatusFilter] = useState("all");

//   // Mobile states
//   const [showMobileFilters, setShowMobileFilters] = useState(false);
//   const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
//   const [expandedRequirementId, setExpandedRequirementId] = useState<
//     string | null
//   >(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     filterOrders();
//   }, [orders, orderSearchTerm, orderStatusFilter]);

//   useEffect(() => {
//     filterRequirements();
//   }, [requirements, requirementSearchTerm, requirementStatusFilter]);

//   const fetchData = async () => {
//     try {
//       // Fetch orders
//       const ordersQuery = query(
//         collection(db, "orders"),
//         orderBy("orderDate", "desc")
//       );
//       const ordersSnapshot = await getDocs(ordersQuery);
//       const ordersList = ordersSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Order[];

//       // Fetch client requirements
//       const requirementsQuery = query(
//         collection(db, "requirements"),
//         orderBy("createdAt", "desc")
//       );
//       const requirementsSnapshot = await getDocs(requirementsQuery);
//       const requirementsList = requirementsSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as ClientRequirement[];

//       // Fetch artists
//       const artistsQuery = query(
//         collection(db, "users"),
//         where("role", "==", "artist")
//       );
//       const artistsSnapshot = await getDocs(artistsQuery);
//       const artistsList = artistsSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as User[];

//       setOrders(ordersList);
//       setRequirements(requirementsList);
//       setArtists(artistsList);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterOrders = () => {
//     let filtered = orders;

//     if (orderSearchTerm) {
//       filtered = filtered.filter(
//         (order) =>
//           order.artwork.title
//             .toLowerCase()
//             .includes(orderSearchTerm.toLowerCase()) ||
//           order.clientName
//             .toLowerCase()
//             .includes(orderSearchTerm.toLowerCase()) ||
//           order.artistName.toLowerCase().includes(orderSearchTerm.toLowerCase())
//       );
//     }

//     if (orderStatusFilter !== "all") {
//       filtered = filtered.filter((order) => order.status === orderStatusFilter);
//     }

//     setFilteredOrders(filtered);
//   };

//   const filterRequirements = () => {
//     let filtered = requirements;

//     if (requirementSearchTerm) {
//       filtered = filtered.filter(
//         (requirement) =>
//           requirement.clientName
//             .toLowerCase()
//             .includes(requirementSearchTerm.toLowerCase()) ||
//           requirement.description
//             .toLowerCase()
//             .includes(requirementSearchTerm.toLowerCase()) ||
//           (requirement.category &&
//             requirement.category
//               .toLowerCase()
//               .includes(requirementSearchTerm.toLowerCase()))
//       );
//     }

//     if (requirementStatusFilter !== "all") {
//       filtered = filtered.filter(
//         (requirement) => requirement.status === requirementStatusFilter
//       );
//     }

//     setFilteredRequirements(filtered);
//   };

//   const updateOrderStatus = async (
//     orderId: string,
//     status:
//       | "pending"
//       | "shared"
//       | "confirmed"
//       | "in-progress"
//       | "completed"
//       | "cancelled"
//   ) => {
//     try {
//       await updateDoc(doc(db, "orders", orderId), {
//         status,
//         [`${status}At`]: new Date(),
//       });
//       setOrders(
//         orders.map((order) =>
//           order.id === orderId ? { ...order, status } : order
//         )
//       );
//       toast.success("Order status updated");
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       toast.error("Failed to update order status");
//     }
//   };

//   const updateRequirementStatus = async (
//     requirementId: string,
//     status: "open" | "shared" | "assigned" | "in-progress" | "completed"
//   ) => {
//     try {
//       await updateDoc(doc(db, "requirements", requirementId), {
//         status,
//         [`${status}At`]: new Date(),
//       });
//       setRequirements(
//         requirements.map((req) =>
//           req.id === requirementId ? { ...req, status } : req
//         )
//       );
//       toast.success("Requirement status updated");
//     } catch (error) {
//       console.error("Error updating requirement status:", error);
//       toast.error("Failed to update requirement status");
//     }
//   };

//   const deleteOrder = async (orderId: string) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this order? This action cannot be undone."
//       )
//     ) {
//       return;
//     }

//     try {
//       await deleteDoc(doc(db, "orders", orderId));
//       setOrders(orders.filter((order) => order.id !== orderId));
//       toast.success("Order deleted successfully");
//       setShowOrderModal(false);
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       toast.error("Failed to delete order");
//     }
//   };

//   const deleteRequirement = async (requirementId: string) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this requirement? This action cannot be undone."
//       )
//     ) {
//       return;
//     }

//     try {
//       await deleteDoc(doc(db, "requirements", requirementId));
//       setRequirements(requirements.filter((req) => req.id !== requirementId));
//       toast.success("Requirement deleted successfully");
//       setShowRequirementModal(false);
//     } catch (error) {
//       console.error("Error deleting requirement:", error);
//       toast.error("Failed to delete requirement");
//     }
//   };

//   const handleShareToAllArtists = async () => {
//     if (!selectedRequirement || !proposedPrice) {
//       toast.error("Please enter a proposed price");
//       return;
//     }

//     try {
//       const allArtistIds = artists.map((artist) => artist.uid);

//       const sharePromises = allArtistIds.map((artistId) => {
//         const artist = artists.find((a) => a.uid === artistId);
//         return addDoc(collection(db, "sharedRequirements"), {
//           requirementId: selectedRequirement.id,
//           artistId,
//           artistName: artist?.displayName || "Unknown",
//           artistEmail: artist?.email || "",
//           sharedAt: new Date(),
//           status: "pending",
//           proposedPrice: parseFloat(proposedPrice),
//           requirement: selectedRequirement,
//         });
//       });

//       await Promise.all(sharePromises);

//       await updateDoc(doc(db, "requirements", selectedRequirement.id), {
//         status: "shared",
//         sharedWith: allArtistIds,
//         sharedAt: new Date(),
//       });

//       setRequirements(
//         requirements.map((req) =>
//           req.id === selectedRequirement.id
//             ? { ...req, status: "shared", sharedWith: allArtistIds }
//             : req
//         )
//       );

//       toast.success(
//         `Requirement shared with all ${allArtistIds.length} artists`
//       );
//       setShowShareAllModal(false);
//       setSelectedRequirement(null);
//       setProposedPrice("");
//     } catch (error) {
//       console.error("Error sharing requirement to all artists:", error);
//       toast.error("Failed to share requirement to all artists");
//     }
//   };

//   const handleShareRequirement = async () => {
//     if (!selectedRequirement || selectedArtists.length === 0) {
//       toast.error("Please select at least one artist");
//       return;
//     }

//     if (!proposedPrice) {
//       toast.error("Please enter a proposed price");
//       return;
//     }

//     try {
//       const sharePromises = selectedArtists.map((artistId) => {
//         const artist = artists.find((a) => a.uid === artistId);
//         return addDoc(collection(db, "sharedRequirements"), {
//           requirementId: selectedRequirement.id,
//           artistId,
//           artistName: artist?.displayName || "Unknown",
//           artistEmail: artist?.email || "",
//           sharedAt: new Date(),
//           status: "pending",
//           proposedPrice: parseFloat(proposedPrice),
//           requirement: selectedRequirement,
//         });
//       });

//       await Promise.all(sharePromises);

//       await updateDoc(doc(db, "requirements", selectedRequirement.id), {
//         status: "shared",
//         sharedWith: [
//           ...(selectedRequirement.sharedWith || []),
//           ...selectedArtists,
//         ],
//         sharedAt: new Date(),
//       });

//       setRequirements(
//         requirements.map((req) =>
//           req.id === selectedRequirement.id
//             ? {
//                 ...req,
//                 status: "shared",
//                 sharedWith: [...(req.sharedWith || []), ...selectedArtists],
//               }
//             : req
//         )
//       );

//       toast.success(
//         `Requirement shared with ${selectedArtists.length} artist(s)`
//       );
//       setShowShareModal(false);
//       setSelectedRequirement(null);
//       setSelectedArtists([]);
//       setProposedPrice("");
//     } catch (error) {
//       console.error("Error sharing requirement:", error);
//       toast.error("Failed to share requirement");
//     }
//   };

//   const handleShareOrderWithArtist = async (order: Order) => {
//     try {
//       const artist = artists.find((a) => a.uid === order.artistId);

//       if (!artist) {
//         toast.error("Artist not found");
//         return;
//       }

//       await addDoc(collection(db, "sharedOrders"), {
//         orderId: order.id,
//         artistId: order.artistId,
//         artistName: order.artistName,
//         artistEmail: artist.email,
//         sharedAt: new Date(),
//         status: "pending",
//         order: {
//           artworkId: order.artworkId,
//           requirements: order.requirements,
//           alterationDescription: order.alterationDescription,
//           artwork: order.artwork,
//         },
//       });

//       await updateDoc(doc(db, "orders", order.id), {
//         status: "shared",
//         sharedAt: new Date(),
//       });

//       setOrders(
//         orders.map((o) => (o.id === order.id ? { ...o, status: "shared" } : o))
//       );

//       toast.success(`Order shared with ${order.artistName}`);
//     } catch (error) {
//       console.error("Error sharing order:", error);
//       toast.error("Failed to share order");
//     }
//   };

//   // WhatsApp sharing function for declined orders
//   const shareOrderToWhatsApp = (order: Order) => {
//     const message = `🎨 *DECLINED ORDER - NEED NEW ARTIST*

// 📋 *Order Details:*
// • Artwork: ${order.artwork.title}
// • Category: ${order.artwork.category}
// • Artist: ${order.artistName} (DECLINED)
// • Client: ${order.clientName}

// 💰 *Price:* ₹${order.artwork.price || "Not specified"}

// 📍 *Address:*
// ${order.address}

// ❌ *Decline Reason:*
// ${order.declineReason || "No reason provided"}

// ${
//   order.requirements
//     ? `📝 *Special Requirements:*
// ${order.requirements}

// `
//     : ""
// }${
//       order.alterationDescription
//         ? `🎨 *Customization Request:*
// ${order.alterationDescription}

// `
//         : ""
//     }🔍 *Looking for a new artist to take this order!*

// #DeclinedOrder #NeedArtist #FrameGlobe`;

//     const encodedMessage = encodeURIComponent(message);
//     const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

//     window.open(whatsappUrl, "_blank");
//     toast.success("Order details shared to WhatsApp!");
//   };

//   // WhatsApp sharing function for client requirements
//   const shareRequirementToWhatsApp = (requirement: ClientRequirement) => {
//     const message = `🎨 *CLIENT REQUIREMENT - NEED ARTIST*

// 📋 *Requirement Details:*
// • ID: #${requirement.id.slice(-6)}
// • Client: ${requirement.clientName}
// ${requirement.address ? `📍 *Address:* ${requirement.address}` : ""}

// ${requirement.category ? `🎯 *Category:* ${requirement.category}` : ""}
// ${requirement.budget ? `💰 *Budget:* ₹${requirement.budget}` : ""}
// ${
//   requirement.deadline
//     ? `⏰ *Deadline:* ${new Date(
//         requirement.deadline.seconds * 1000
//       ).toLocaleDateString()}`
//     : ""
// }

// 📝 *Description:*
// ${requirement.description}

// 📊 *Status:* ${
//       requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)
//     }

// ${
//   requirement.sharedWith && requirement.sharedWith.length > 0
//     ? `👥 *Shared with ${requirement.sharedWith.length} artist(s)
// `
//     : ""
// }
// ${
//   requirement.acceptedBy
//     ? `✅ *Accepted by:* ${requirement.acceptedBy.artistName}
// `
//     : ""
// }
// ${
//   requirement.workCompleted
//     ? `🎉 *Work Completed by:* ${requirement.workCompleted.artistName}
// `
//     : ""
// }
// ${
//   requirement.attachmentUrl
//     ? `📎 *Reference Image: ${requirement.attachmentUrl}
// `
//     : ""
// }
// 🔍 *Looking for an artist to fulfill this requirement!*

// #ClientRequirement #NeedArtist #FrameGlobe`;

//     const encodedMessage = encodeURIComponent(message);
//     const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

//     window.open(whatsappUrl, "_blank");
//     toast.success("Requirement details shared to WhatsApp!");
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "pending":
//       case "open":
//         return "bg-yellow-100 text-yellow-800";
//       case "confirmed":
//       case "shared":
//         return "bg-blue-100 text-blue-800";
//       case "assigned":
//         return "bg-purple-100 text-purple-800";
//       case "in-progress":
//         return "bg-orange-100 text-orange-800";
//       case "completed":
//         return "bg-green-100 text-green-800";
//       case "cancelled":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getArtistContactInfo = (artistId: string) => {
//     return artists.find((artist) => artist.uid === artistId);
//   };

//   const formatTimestamp = (timestamp: any) => {
//     if (!timestamp) return "N/A";
//     const date = timestamp.seconds
//       ? new Date(timestamp.seconds * 1000)
//       : new Date(timestamp);
//     return (
//       date.toLocaleDateString() +
//       " " +
//       date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     );
//   };

//   const openImageModal = (imageUrl: string) => {
//     setSelectedImageUrl(imageUrl);
//     setShowImageModal(true);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   const stats = {
//     totalOrders: orders.length,
//     pendingOrders: orders.filter((o) => o.status === "pending").length,
//     totalRequirements: requirements.length,
//     openRequirements: requirements.filter((r) => r.status === "open").length,
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Admin Dashboard - FrameGlobe</title>
//         <meta
//           name="description"
//           content="Manage orders, client requirements, and oversee the FrameGlobe platform."
//         />
//       </Helmet>

//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
//           {/* Header */}
//           <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Admin Dashboard
//             </h1>
//             <p className="text-gray-600 mt-2 text-sm sm:text-base">
//               Manage orders and client requirements
//             </p>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
//             <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
//               <div className="flex items-center">
//                 <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
//                 <div className="ml-3 sm:ml-4">
//                   <p className="text-xs sm:text-sm font-medium text-gray-600">
//                     Total Orders
//                   </p>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900">
//                     {stats.totalOrders}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
//               <div className="flex items-center">
//                 <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
//                 <div className="ml-3 sm:ml-4">
//                   <p className="text-xs sm:text-sm font-medium text-gray-600">
//                     Pending Orders
//                   </p>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900">
//                     {stats.pendingOrders}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
//               <div className="flex items-center">
//                 <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
//                 <div className="ml-3 sm:ml-4">
//                   <p className="text-xs sm:text-sm font-medium text-gray-600">
//                     Total Requirements
//                   </p>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900">
//                     {stats.totalRequirements}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
//               <div className="flex items-center">
//                 <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
//                 <div className="ml-3 sm:ml-4">
//                   <p className="text-xs sm:text-sm font-medium text-gray-600">
//                     Open Requirements
//                   </p>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900">
//                     {stats.openRequirements}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="bg-white rounded-lg shadow-sm">
//             <div className="border-b border-gray-200">
//               <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
//                 <button
//                   onClick={() => setActiveTab("orders")}
//                   className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
//                     activeTab === "orders"
//                       ? "border-indigo-500 text-indigo-600"
//                       : "border-transparent text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   Orders ({filteredOrders.length})
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("requirements")}
//                   className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
//                     activeTab === "requirements"
//                       ? "border-indigo-500 text-indigo-600"
//                       : "border-transparent text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   Requirements ({filteredRequirements.length})
//                 </button>
//               </nav>
//             </div>

//             <div className="p-4 sm:p-6">
//               {activeTab === "orders" ? (
//                 <div className="space-y-4">
//                   {/* Mobile Filter Toggle */}
//                   <div className="sm:hidden">
//                     <button
//                       onClick={() => setShowMobileFilters(!showMobileFilters)}
//                       className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
//                     >
//                       <div className="flex items-center space-x-2">
//                         <Filter className="h-5 w-5 text-gray-400" />
//                         <span className="text-sm font-medium text-gray-700">
//                           Filter Orders
//                         </span>
//                       </div>
//                       <ChevronDown
//                         className={`h-5 w-5 text-gray-400 transition-transform ${
//                           showMobileFilters ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>
//                   </div>

//                   {/* Orders Filter - Desktop */}
//                   <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                       <input
//                         type="text"
//                         placeholder="Search orders..."
//                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         value={orderSearchTerm}
//                         onChange={(e) => setOrderSearchTerm(e.target.value)}
//                       />
//                     </div>
//                     <div className="relative">
//                       <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                       <select
//                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
//                         value={orderStatusFilter}
//                         onChange={(e) => setOrderStatusFilter(e.target.value)}
//                       >
//                         <option value="all">All Status</option>
//                         <option value="pending">Pending</option>
//                         <option value="shared">Shared</option>
//                         <option value="confirmed">Confirmed</option>
//                         <option value="in-progress">In Progress</option>
//                         <option value="completed">Completed</option>
//                         <option value="cancelled">Cancelled</option>
//                       </select>
//                     </div>
//                   </div>

//                   {/* Orders Filter - Mobile */}
//                   {showMobileFilters && (
//                     <div className="sm:hidden space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
//                       <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                         <input
//                           type="text"
//                           placeholder="Search orders..."
//                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                           value={orderSearchTerm}
//                           onChange={(e) => setOrderSearchTerm(e.target.value)}
//                         />
//                       </div>
//                       <div className="relative">
//                         <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                         <select
//                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
//                           value={orderStatusFilter}
//                           onChange={(e) => setOrderStatusFilter(e.target.value)}
//                         >
//                           <option value="all">All Status</option>
//                           <option value="pending">Pending</option>
//                           <option value="shared">Shared</option>
//                           <option value="confirmed">Confirmed</option>
//                           <option value="in-progress">In Progress</option>
//                           <option value="completed">Completed</option>
//                           <option value="cancelled">Cancelled</option>
//                         </select>
//                       </div>
//                     </div>
//                   )}

//                   {filteredOrders.length === 0 ? (
//                     <div className="text-center py-12">
//                       <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-lg font-medium text-gray-900 mb-2">
//                         No orders found
//                       </h3>
//                       <p className="text-gray-600 text-sm sm:text-base">
//                         {orderSearchTerm || orderStatusFilter !== "all"
//                           ? "Try adjusting your search or filter criteria"
//                           : "Orders will appear here when clients place them"}
//                       </p>
//                     </div>
//                   ) : (
//                     filteredOrders.map((order) => (
//                       <div
//                         key={order.id}
//                         className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4"
//                       >
//                         <div className="flex items-start justify-between mb-3">
//                           <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
//                             <div
//                               className="cursor-pointer flex-shrink-0"
//                               onClick={() =>
//                                 openImageModal(order.artwork.imageUrl)
//                               }
//                             >
//                               <img
//                                 src={order.artwork.imageUrl}
//                                 alt={order.artwork.title}
//                                 className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg hover:opacity-80 transition-opacity"
//                               />
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
//                                 {order.artwork.title}
//                               </h3>
//                               <p className="text-xs sm:text-sm text-gray-600 truncate">
//                                 by {order.artistName}
//                               </p>
//                               {order.artwork.price && (
//                                 <p className="text-xs sm:text-sm font-medium text-green-600">
//                                   ₹{order.artwork.price}
//                                 </p>
//                               )}
//                               {order.status === "cancelled" &&
//                                 order.declineReason && (
//                                   <p className="text-xs text-red-600 mt-1 line-clamp-2">
//                                     Declined: {order.declineReason}
//                                   </p>
//                                 )}
//                             </div>
//                           </div>

//                           <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center">
//                             <span
//                               className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                                 order.status
//                               )} whitespace-nowrap`}
//                             >
//                               {order.status.charAt(0).toUpperCase() +
//                                 order.status.slice(1)}
//                             </span>
//                             <div className="flex space-x-1 sm:space-x-2">
//                               {order.status === "pending" && (
//                                 <button
//                                   onClick={() =>
//                                     handleShareOrderWithArtist(order)
//                                   }
//                                   className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center space-x-1"
//                                 >
//                                   <Send className="h-3 w-3" />
//                                   <span className="hidden sm:inline">
//                                     Share
//                                   </span>
//                                 </button>
//                               )}
//                               {order.status === "cancelled" && (
//                                 <button
//                                   onClick={() => shareOrderToWhatsApp(order)}
//                                   className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center space-x-1"
//                                   title="Share to WhatsApp Group"
//                                 >
//                                   <WhatsAppIcon className="h-3 w-3" />
//                                   <span className="hidden sm:inline">
//                                     WhatsApp
//                                   </span>
//                                 </button>
//                               )}
//                               <button
//                                 onClick={() => {
//                                   setSelectedOrder(order);
//                                   setShowOrderModal(true);
//                                 }}
//                                 className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 transition-colors flex items-center space-x-1"
//                               >
//                                 <Eye className="h-3 w-3" />
//                                 <span className="hidden sm:inline">View</span>
//                               </button>
//                               <button
//                                 onClick={() => deleteOrder(order.id)}
//                                 className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors flex items-center space-x-1"
//                               >
//                                 <Trash2 className="h-3 w-3" />
//                                 <span className="hidden sm:inline">Delete</span>
//                               </button>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="text-xs text-gray-500">
//                           Order Date: {formatTimestamp(order.orderDate)}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {/* Mobile Filter Toggle */}
//                   <div className="sm:hidden">
//                     <button
//                       onClick={() => setShowMobileFilters(!showMobileFilters)}
//                       className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
//                     >
//                       <div className="flex items-center space-x-2">
//                         <Filter className="h-5 w-5 text-gray-400" />
//                         <span className="text-sm font-medium text-gray-700">
//                           Filter Requirements
//                         </span>
//                       </div>
//                       <ChevronDown
//                         className={`h-5 w-5 text-gray-400 transition-transform ${
//                           showMobileFilters ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>
//                   </div>

//                   {/* Requirements Filter - Desktop */}
//                   <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                       <input
//                         type="text"
//                         placeholder="Search requirements..."
//                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         value={requirementSearchTerm}
//                         onChange={(e) =>
//                           setRequirementSearchTerm(e.target.value)
//                         }
//                       />
//                     </div>
//                     <div className="relative">
//                       <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                       <select
//                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
//                         value={requirementStatusFilter}
//                         onChange={(e) =>
//                           setRequirementStatusFilter(e.target.value)
//                         }
//                       >
//                         <option value="all">All Status</option>
//                         <option value="open">Open</option>
//                         <option value="shared">Shared</option>
//                         <option value="assigned">Assigned</option>
//                         <option value="in-progress">In Progress</option>
//                         <option value="completed">Completed</option>
//                       </select>
//                     </div>
//                   </div>

//                   {/* Requirements Filter - Mobile */}
//                   {showMobileFilters && (
//                     <div className="sm:hidden space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
//                       <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                         <input
//                           type="text"
//                           placeholder="Search requirements..."
//                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                           value={requirementSearchTerm}
//                           onChange={(e) =>
//                             setRequirementSearchTerm(e.target.value)
//                           }
//                         />
//                       </div>
//                       <div className="relative">
//                         <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                         <select
//                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
//                           value={requirementStatusFilter}
//                           onChange={(e) =>
//                             setRequirementStatusFilter(e.target.value)
//                           }
//                         >
//                           <option value="all">All Status</option>
//                           <option value="open">Open</option>
//                           <option value="shared">Shared</option>
//                           <option value="assigned">Assigned</option>
//                           <option value="in-progress">In Progress</option>
//                           <option value="completed">Completed</option>
//                         </select>
//                       </div>
//                     </div>
//                   )}

//                   {filteredRequirements.length === 0 ? (
//                     <div className="text-center py-12">
//                       <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-lg font-medium text-gray-900 mb-2">
//                         No requirements found
//                       </h3>
//                       <p className="text-gray-600 text-sm sm:text-base">
//                         {requirementSearchTerm ||
//                         requirementStatusFilter !== "all"
//                           ? "Try adjusting your search or filter criteria"
//                           : "Client requirements will appear here"}
//                       </p>
//                     </div>
//                   ) : (
//                     filteredRequirements.map((requirement) => (
//                       <div
//                         key={requirement.id}
//                         className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4"
//                       >
//                         <div className="flex items-start justify-between mb-3">
//                           <div className="flex-1 min-w-0">
//                             <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
//                               Requirement #{requirement.id.slice(-6)}
//                             </h3>
//                             <p className="text-xs sm:text-sm text-gray-600 truncate">
//                               {requirement.clientName}
//                             </p>
//                             {requirement.sharedWith &&
//                               requirement.sharedWith.length > 0 && (
//                                 <div className="mt-2 flex flex-wrap gap-1">
//                                   <span className="text-xs text-blue-600 font-medium">
//                                     Shared with:
//                                   </span>
//                                   {requirement.sharedWith
//                                     .slice(0, 3)
//                                     .map((artistId, index) => {
//                                       const artist = artists.find(
//                                         (a) => a.uid === artistId
//                                       );
//                                       const isAccepted =
//                                         requirement.acceptedBy?.artistId ===
//                                         artistId;
//                                       const isDeclined =
//                                         requirement.status === "assigned" &&
//                                         !isAccepted;

//                                       return (
//                                         <span
//                                           key={artistId}
//                                           className={`text-xs px-2 py-1 rounded-full ${
//                                             isAccepted
//                                               ? "bg-green-100 text-green-800"
//                                               : isDeclined
//                                               ? "bg-red-100 text-red-800"
//                                               : "bg-blue-100 text-blue-800"
//                                           }`}
//                                         >
//                                           {artist?.displayName?.split(" ")[0] ||
//                                             "Unknown"}
//                                           {isAccepted && " ✓"}
//                                           {isDeclined && " ✗"}
//                                         </span>
//                                       );
//                                     })}
//                                   {requirement.sharedWith.length > 3 && (
//                                     <span className="text-xs text-gray-500">
//                                       +{requirement.sharedWith.length - 3} more
//                                     </span>
//                                   )}
//                                 </div>
//                               )}
//                           </div>

//                           <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center">
//                             <span
//                               className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                                 requirement.status
//                               )} whitespace-nowrap`}
//                             >
//                               {requirement.status.charAt(0).toUpperCase() +
//                                 requirement.status.slice(1)}
//                             </span>
//                             <div className="flex space-x-1 sm:space-x-2">
//                               {requirement.status === "open" && (
//                                 <>
//                                   <button
//                                     onClick={() => {
//                                       setSelectedRequirement(requirement);
//                                       setShowShareAllModal(true);
//                                     }}
//                                     className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700 transition-colors flex items-center space-x-1"
//                                   >
//                                     <Users className="h-3 w-3" />
//                                     <span className="hidden sm:inline">
//                                       Share All
//                                     </span>
//                                   </button>
//                                   <button
//                                     onClick={() => {
//                                       setSelectedRequirement(requirement);
//                                       setShowShareModal(true);
//                                     }}
//                                     className="bg-indigo-600 text-white px-2 py-1 rounded text-xs hover:bg-indigo-700 transition-colors flex items-center space-x-1"
//                                   >
//                                     <Share2 className="h-3 w-3" />
//                                     <span className="hidden sm:inline">
//                                       Share
//                                     </span>
//                                   </button>
//                                 </>
//                               )}
//                               <button
//                                 onClick={() =>
//                                   shareRequirementToWhatsApp(requirement)
//                                 }
//                                 className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center space-x-1"
//                                 title="Share to WhatsApp Group"
//                               >
//                                 <WhatsAppIcon className="h-3 w-3" />
//                                 <span className="hidden sm:inline">
//                                   WhatsApp
//                                 </span>
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSelectedRequirement(requirement);
//                                   setShowRequirementModal(true);
//                                 }}
//                                 className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 transition-colors flex items-center space-x-1"
//                               >
//                                 <Eye className="h-3 w-3" />
//                                 <span className="hidden sm:inline">View</span>
//                               </button>
//                               <button
//                                 onClick={() =>
//                                   deleteRequirement(requirement.id)
//                                 }
//                                 className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors flex items-center space-x-1"
//                               >
//                                 <Trash2 className="h-3 w-3" />
//                                 <span className="hidden sm:inline">Delete</span>
//                               </button>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="text-xs text-gray-500">
//                           Created: {formatTimestamp(requirement.createdAt)}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Full Size Image Modal */}
//         {showImageModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
//             <div className="relative w-full h-full max-w-4xl max-h-full">
//               <button
//                 onClick={() => setShowImageModal(false)}
//                 className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 p-2"
//               >
//                 <X className="h-6 w-6 sm:h-8 sm:w-8" />
//               </button>
//               <img
//                 src={selectedImageUrl}
//                 alt="Full size view"
//                 className="w-full h-full object-contain"
//               />
//             </div>
//           </div>
//         )}

//         {/* Order Detail Modal */}
//         {showOrderModal && selectedOrder && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//               <div className="p-4 sm:p-6">
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
//                     Order Details
//                   </h2>
//                   <div className="flex items-center space-x-2">
//                     {selectedOrder.status === "cancelled" && (
//                       <button
//                         onClick={() => shareOrderToWhatsApp(selectedOrder)}
//                         className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
//                         title="Share to WhatsApp Group"
//                       >
//                         <WhatsAppIcon className="h-4 w-4" />
//                         <span>Share to WhatsApp</span>
//                       </button>
//                     )}
//                     <button
//                       onClick={() => deleteOrder(selectedOrder.id)}
//                       className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                       <span className="hidden sm:inline">Delete</span>
//                     </button>
//                     <button
//                       onClick={() => setShowOrderModal(false)}
//                       className="text-gray-400 hover:text-gray-600 p-2"
//                     >
//                       <X className="h-5 w-5 sm:h-6 sm:w-6" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div>
//                     <div className="relative">
//                       <img
//                         src={selectedOrder.artwork.imageUrl}
//                         alt={selectedOrder.artwork.title}
//                         className="w-full h-auto object-contain max-h-96 rounded-lg cursor-pointer"
//                         onClick={() =>
//                           openImageModal(selectedOrder.artwork.imageUrl)
//                         }
//                       />
//                       <button
//                         onClick={() =>
//                           openImageModal(selectedOrder.artwork.imageUrl)
//                         }
//                         className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
//                       >
//                         <ZoomIn className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                         {selectedOrder.artwork.title}
//                       </h3>
//                       <div className="flex items-center space-x-2 mb-2 flex-wrap">
//                         <Palette className="h-4 w-4 text-gray-400" />
//                         <span className="text-sm text-gray-600">
//                           by {selectedOrder.artistName}
//                         </span>
//                         {selectedOrder.artwork.isCustomizable && (
//                           <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
//                             Customizable
//                           </span>
//                         )}
//                         {selectedOrder.artwork.price && (
//                           <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
//                             ₹{selectedOrder.artwork.price}
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex items-center space-x-2 flex-wrap">
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                           selectedOrder.status
//                         )}`}
//                       >
//                         {selectedOrder.status.charAt(0).toUpperCase() +
//                           selectedOrder.status.slice(1)}
//                       </span>
//                       <select
//                         value={selectedOrder.status}
//                         onChange={(e) =>
//                           updateOrderStatus(
//                             selectedOrder.id,
//                             e.target.value as any
//                           )
//                         }
//                         className="text-sm border border-gray-300 rounded px-3 py-1"
//                       >
//                         <option value="pending">Pending</option>
//                         <option value="shared">Shared</option>
//                         <option value="confirmed">Confirmed</option>
//                         <option value="in-progress">In Progress</option>
//                         <option value="completed">Completed</option>
//                         <option value="cancelled">Cancelled</option>
//                       </select>
//                     </div>

//                     <div className="grid grid-cols-1 gap-4">
//                       <div>
//                         <h4 className="font-medium text-gray-900 mb-2">
//                           Client Information
//                         </h4>
//                         <div className="space-y-2 text-sm">
//                           <div className="flex items-center space-x-2">
//                             <UserIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                             <span className="break-all">
//                               {selectedOrder.clientName}
//                             </span>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                             <a
//                               href={`mailto:${selectedOrder.clientEmail}`}
//                               className="text-indigo-600 hover:text-indigo-800 break-all"
//                             >
//                               {selectedOrder.clientEmail}
//                             </a>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                             <a
//                               href={`tel:${selectedOrder.clientPhone}`}
//                               className="text-indigo-600 hover:text-indigo-800"
//                             >
//                               {selectedOrder.clientPhone}
//                             </a>
//                           </div>
//                           <div className="flex items-start space-x-2">
//                             <MapPinned className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
//                             <span className="break-words">
//                               {selectedOrder.address}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <div>
//                         <h4 className="font-medium text-gray-900 mb-2">
//                           Artist Information
//                         </h4>
//                         {(() => {
//                           const artistContact = getArtistContactInfo(
//                             selectedOrder.artistId
//                           );
//                           return artistContact ? (
//                             <div className="space-y-2 text-sm">
//                               <div className="flex items-center space-x-2">
//                                 <UserIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                                 <span className="break-all">
//                                   {artistContact.displayName}
//                                 </span>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                                 <a
//                                   href={`mailto:${artistContact.email}`}
//                                   className="text-indigo-600 hover:text-indigo-800 break-all"
//                                 >
//                                   {artistContact.email}
//                                 </a>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                                 <a
//                                   href={`tel:${artistContact.phone}`}
//                                   className="text-indigo-600 hover:text-indigo-800"
//                                 >
//                                   {artistContact.phone}
//                                 </a>
//                               </div>
//                             </div>
//                           ) : (
//                             <p className="text-sm text-gray-500">
//                               Artist information not available
//                             </p>
//                           );
//                         })()}
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-medium text-gray-900 mb-2">
//                         Timeline
//                       </h4>
//                       <div className="space-y-1 text-sm text-gray-600">
//                         <p>
//                           <span className="font-medium">Order Date:</span>{" "}
//                           {formatTimestamp(selectedOrder.orderDate)}
//                         </p>
//                         {selectedOrder.sharedAt && (
//                           <p>
//                             <span className="font-medium">Shared:</span>{" "}
//                             {formatTimestamp(selectedOrder.sharedAt)}
//                           </p>
//                         )}
//                         {selectedOrder.confirmedAt && (
//                           <p>
//                             <span className="font-medium">Confirmed:</span>{" "}
//                             {formatTimestamp(selectedOrder.confirmedAt)}
//                           </p>
//                         )}
//                         {selectedOrder.inProgressAt && (
//                           <p>
//                             <span className="font-medium">In Progress:</span>{" "}
//                             {formatTimestamp(selectedOrder.inProgressAt)}
//                           </p>
//                         )}
//                         {selectedOrder.completedAt && (
//                           <p>
//                             <span className="font-medium">Completed:</span>{" "}
//                             {formatTimestamp(selectedOrder.completedAt)}
//                           </p>
//                         )}
//                         {selectedOrder.cancelledAt && (
//                           <p>
//                             <span className="font-medium">Cancelled:</span>{" "}
//                             {formatTimestamp(selectedOrder.cancelledAt)}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {(selectedOrder.requirements ||
//                       selectedOrder.alterationDescription) && (
//                       <div className="space-y-3">
//                         {selectedOrder.requirements && (
//                           <div>
//                             <h4 className="font-medium text-gray-900 mb-2">
//                               Special Requirements
//                             </h4>
//                             <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded break-words">
//                               {selectedOrder.requirements}
//                             </p>
//                           </div>
//                         )}

//                         {selectedOrder.alterationDescription && (
//                           <div>
//                             <h4 className="font-medium text-gray-900 mb-2">
//                               Customization Request
//                             </h4>
//                             <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded break-words">
//                               {selectedOrder.alterationDescription}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {selectedOrder.status === "cancelled" &&
//                       selectedOrder.declineReason && (
//                         <div>
//                           <h4 className="font-medium text-gray-900 mb-2">
//                             Decline Reason
//                           </h4>
//                           <p className="text-sm text-red-600 bg-red-50 p-3 rounded break-words">
//                             {selectedOrder.declineReason}
//                           </p>
//                         </div>
//                       )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Requirement Detail Modal */}
//         {showRequirementModal && selectedRequirement && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//               <div className="p-4 sm:p-6">
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
//                     Requirement Details
//                   </h2>
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() =>
//                         shareRequirementToWhatsApp(selectedRequirement)
//                       }
//                       className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
//                       title="Share to WhatsApp Group"
//                     >
//                       <WhatsAppIcon className="h-4 w-4" />
//                       <span>Share to WhatsApp</span>
//                     </button>
//                     <button
//                       onClick={() => deleteRequirement(selectedRequirement.id)}
//                       className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                       <span className="hidden sm:inline">Delete</span>
//                     </button>
//                     <button
//                       onClick={() => setShowRequirementModal(false)}
//                       className="text-gray-400 hover:text-gray-600 p-2"
//                     >
//                       <X className="h-5 w-5 sm:h-6 sm:w-6" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                         Requirement #{selectedRequirement.id.slice(-6)}
//                       </h3>
//                       <div className="flex items-center space-x-2 flex-wrap">
//                         <span
//                           className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                             selectedRequirement.status
//                           )}`}
//                         >
//                           {selectedRequirement.status.charAt(0).toUpperCase() +
//                             selectedRequirement.status.slice(1)}
//                         </span>
//                         <select
//                           value={selectedRequirement.status}
//                           onChange={(e) =>
//                             updateRequirementStatus(
//                               selectedRequirement.id,
//                               e.target.value as any
//                             )
//                           }
//                           className="text-sm border border-gray-300 rounded px-3 py-1"
//                         >
//                           <option value="open">Open</option>
//                           <option value="shared">Shared</option>
//                           <option value="assigned">Assigned</option>
//                           <option value="in-progress">In Progress</option>
//                           <option value="completed">Completed</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-medium text-gray-900 mb-2">
//                         Client Information
//                       </h4>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex items-center space-x-2">
//                           <UserIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                           <span className="break-all">
//                             {selectedRequirement.clientName}
//                           </span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                           <a
//                             href={`mailto:${selectedRequirement.clientEmail}`}
//                             className="text-indigo-600 hover:text-indigo-800 break-all"
//                           >
//                             {selectedRequirement.clientEmail}
//                           </a>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                           <a
//                             href={`tel:${selectedRequirement.clientPhone}`}
//                             className="text-indigo-600 hover:text-indigo-800"
//                           >
//                             {selectedRequirement.clientPhone}
//                           </a>
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-medium text-gray-900 mb-2">
//                         Timeline
//                       </h4>
//                       <div className="space-y-1 text-sm text-gray-600">
//                         <p>
//                           <span className="font-medium">Created:</span>{" "}
//                           {formatTimestamp(selectedRequirement.createdAt)}
//                         </p>
//                         {selectedRequirement.sharedAt && (
//                           <p>
//                             <span className="font-medium">Shared:</span>{" "}
//                             {formatTimestamp(selectedRequirement.sharedAt)}
//                           </p>
//                         )}
//                         {selectedRequirement.acceptedBy && (
//                           <p>
//                             <span className="font-medium">Accepted:</span>{" "}
//                             {formatTimestamp(
//                               selectedRequirement.acceptedBy.acceptedAt
//                             )}
//                           </p>
//                         )}
//                         {selectedRequirement.inProgressAt && (
//                           <p>
//                             <span className="font-medium">In Progress:</span>{" "}
//                             {formatTimestamp(selectedRequirement.inProgressAt)}
//                           </p>
//                         )}
//                         {selectedRequirement.workCompleted && (
//                           <p>
//                             <span className="font-medium">Completed:</span>{" "}
//                             {formatTimestamp(
//                               selectedRequirement.workCompleted.completedAt
//                             )}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {(selectedRequirement.category ||
//                       selectedRequirement.budget ||
//                       selectedRequirement.deadline) && (
//                       <div>
//                         <h4 className="font-medium text-gray-900 mb-2">
//                           Requirements
//                         </h4>
//                         <div className="space-y-1 text-sm">
//                           {selectedRequirement.category && (
//                             <p>
//                               <span className="font-medium">Category:</span>{" "}
//                               {selectedRequirement.category}
//                             </p>
//                           )}
//                           {selectedRequirement.budget && (
//                             <p>
//                               <span className="font-medium">Budget:</span> ₹
//                               {selectedRequirement.budget}
//                             </p>
//                           )}
//                           {selectedRequirement.deadline && (
//                             <p>
//                               <span className="font-medium">Deadline:</span>{" "}
//                               {new Date(
//                                 selectedRequirement.deadline.seconds * 1000
//                               ).toLocaleDateString()}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     )}

//                     {selectedRequirement.sharedWith &&
//                       selectedRequirement.sharedWith.length > 0 && (
//                         <div>
//                           <h4 className="font-medium text-gray-900 mb-2">
//                             Shared Artists
//                           </h4>
//                           <div className="space-y-1">
//                             {selectedRequirement.sharedWith.map(
//                               (artistId, index) => {
//                                 const artist = artists.find(
//                                   (a) => a.uid === artistId
//                                 );
//                                 const isAccepted =
//                                   selectedRequirement.acceptedBy?.artistId ===
//                                   artistId;
//                                 const isDeclined =
//                                   selectedRequirement.status === "assigned" &&
//                                   !isAccepted;

//                                 return (
//                                   <span
//                                     key={artistId}
//                                     className={`inline-block px-2 py-1 rounded text-xs mr-1 mb-1 ${
//                                       isAccepted
//                                         ? "bg-green-100 text-green-800"
//                                         : isDeclined
//                                         ? "bg-red-100 text-red-800"
//                                         : "bg-blue-100 text-blue-800"
//                                     }`}
//                                   >
//                                     {artist?.displayName || "Unknown Artist"}
//                                     {isAccepted && " ✓ Accepted"}
//                                     {isDeclined && " ✗ Declined"}
//                                   </span>
//                                 );
//                               }
//                             )}
//                           </div>
//                         </div>
//                       )}
//                   </div>

//                   <div className="space-y-4">
//                     <div>
//                       <h4 className="font-medium text-gray-900 mb-2">
//                         Description
//                       </h4>
//                       <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded break-words">
//                         {selectedRequirement.description}
//                       </p>
//                     </div>

//                     {selectedRequirement.attachmentUrl && (
//                       <div>
//                         <h4 className="font-medium text-gray-900 mb-2">
//                           Reference Image
//                         </h4>
//                         <div className="relative">
//                           <img
//                             src={selectedRequirement.attachmentUrl}
//                             alt="Client reference"
//                             className="w-full max-w-sm h-auto object-contain rounded-lg border cursor-pointer"
//                             onClick={() =>
//                               openImageModal(selectedRequirement.attachmentUrl!)
//                             }
//                           />
//                           <button
//                             onClick={() =>
//                               openImageModal(selectedRequirement.attachmentUrl!)
//                             }
//                             className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
//                           >
//                             <ZoomIn className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                     {selectedRequirement.acceptedBy && (
//                       <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
//                         <h4 className="font-medium text-green-900 mb-2">
//                           Accepted by Artist
//                         </h4>
//                         <div className="text-sm text-green-800">
//                           <p>
//                             <strong>Artist:</strong>{" "}
//                             {selectedRequirement.acceptedBy.artistName}
//                           </p>
//                           <p className="break-all">
//                             <strong>Email:</strong>{" "}
//                             {selectedRequirement.acceptedBy.artistEmail}
//                           </p>
//                           <p>
//                             <strong>Accepted:</strong>{" "}
//                             {formatTimestamp(
//                               selectedRequirement.acceptedBy.acceptedAt
//                             )}
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {selectedRequirement.workCompleted && (
//                       <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                         <h4 className="font-medium text-blue-900 mb-2">
//                           Work Completed
//                         </h4>
//                         <div className="text-sm text-blue-800">
//                           <p>
//                             <strong>Artist:</strong>{" "}
//                             {selectedRequirement.workCompleted.artistName}
//                           </p>
//                           <p>
//                             <strong>Completed:</strong>{" "}
//                             {formatTimestamp(
//                               selectedRequirement.workCompleted.completedAt
//                             )}
//                           </p>
//                           {selectedRequirement.workCompleted.notes && (
//                             <p>
//                               <strong>Notes:</strong>{" "}
//                               {selectedRequirement.workCompleted.notes}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Share All Artists Modal */}
//         {showShareAllModal && selectedRequirement && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg w-full max-w-md p-4 sm:p-6">
//               <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
//                 Share with All Artists
//               </h2>
//               <p className="text-gray-600 mb-4 text-sm sm:text-base">
//                 This will share the requirement with all {artists.length}{" "}
//                 artists.
//               </p>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Proposed Price (₹) *
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={proposedPrice}
//                   onChange={(e) => setProposedPrice(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Enter proposed price for artists"
//                   required
//                 />
//               </div>

//               <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
//                 <button
//                   onClick={() => {
//                     setShowShareAllModal(false);
//                     setSelectedRequirement(null);
//                     setProposedPrice("");
//                   }}
//                   className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleShareToAllArtists}
//                   disabled={!proposedPrice}
//                   className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Share with All ({artists.length})
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Share Requirement Modal */}
//         {showShareModal && selectedRequirement && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg w-full max-w-md p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
//               <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
//                 Share Requirement with Artists
//               </h2>
//               <p className="text-gray-600 mb-4 text-sm sm:text-base">
//                 Select artists to share this requirement with:
//               </p>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Proposed Price (₹) *
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={proposedPrice}
//                   onChange={(e) => setProposedPrice(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Enter proposed price for artists"
//                   required
//                 />
//               </div>

//               <div className="max-h-40 overflow-y-auto mb-4">
//                 {artists.map((artist) => (
//                   <label
//                     key={artist.uid}
//                     className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedArtists.includes(artist.uid)}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setSelectedArtists([...selectedArtists, artist.uid]);
//                         } else {
//                           setSelectedArtists(
//                             selectedArtists.filter((id) => id !== artist.uid)
//                           );
//                         }
//                       }}
//                       className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-900 truncate">
//                         {artist.displayName}
//                       </p>
//                       <p className="text-sm text-gray-600 truncate">
//                         {artist.email}
//                       </p>
//                     </div>
//                   </label>
//                 ))}
//               </div>

//               <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
//                 <button
//                   onClick={() => {
//                     setShowShareModal(false);
//                     setSelectedRequirement(null);
//                     setSelectedArtists([]);
//                     setProposedPrice("");
//                   }}
//                   className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleShareRequirement}
//                   disabled={selectedArtists.length === 0 || !proposedPrice}
//                   className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Share ({selectedArtists.length})
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  addDoc,
  where,
  deleteDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { Order, ClientRequirement, User, SharedRequirement } from "../types";
import { Helmet } from "react-helmet-async";
import {
  Users,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  Eye,
  Phone,
  Mail,
  Calendar,
  User as UserIcon,
  Palette,
  Share2,
  Check,
  X,
  UserCheck,
  CheckCircle,
  IndianRupee,
  Send,
  Clock,
  PlayCircle,
  FileText,
  Search,
  Filter,
  Trash2,
  ZoomIn,
  MapPinned,
  Menu,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// WhatsApp Icon Component
const WhatsAppIcon = ({ className = "h-4 w-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [requirements, setRequirements] = useState<ClientRequirement[]>([]);
  const [sharedRequirements, setSharedRequirements] = useState<SharedRequirement[]>([]);
  const [artists, setArtists] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [filteredRequirements, setFilteredRequirements] = useState<
    ClientRequirement[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "requirements">(
    "orders"
  );
  const [showShareModal, setShowShareModal] = useState(false);
  const [showShareAllModal, setShowShareAllModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showRequirementModal, setShowRequirementModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedRequirement, setSelectedRequirement] =
    useState<ClientRequirement | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [proposedPrice, setProposedPrice] = useState("");

  // Filter states
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [requirementSearchTerm, setRequirementSearchTerm] = useState("");
  const [requirementStatusFilter, setRequirementStatusFilter] = useState("all");

  // Mobile states
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [expandedRequirementId, setExpandedRequirementId] = useState<
    string | null
  >(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, orderSearchTerm, orderStatusFilter]);

  useEffect(() => {
    filterRequirements();
  }, [requirements, requirementSearchTerm, requirementStatusFilter]);

  const fetchData = async () => {
    try {
      // Fetch orders
      const ordersQuery = query(
        collection(db, "orders"),
        orderBy("orderDate", "desc")
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersList = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      // Fetch client requirements
      const requirementsQuery = query(
        collection(db, "requirements"),
        orderBy("createdAt", "desc")
      );
      const requirementsSnapshot = await getDocs(requirementsQuery);
      const requirementsList = requirementsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ClientRequirement[];

      // Fetch shared requirements to get artist responses
      const sharedRequirementsQuery = query(
        collection(db, "sharedRequirements"),
        orderBy("sharedAt", "desc")
      );
      const sharedRequirementsSnapshot = await getDocs(sharedRequirementsQuery);
      const sharedRequirementsList = sharedRequirementsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SharedRequirement[];

      // Fetch artists
      const artistsQuery = query(
        collection(db, "users"),
        where("role", "==", "artist")
      );
      const artistsSnapshot = await getDocs(artistsQuery);
      const artistsList = artistsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      // Fetch all users
      const usersQuery = query(collection(db, "users"));
      const usersSnapshot = await getDocs(usersQuery);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      setOrders(ordersList);
      setRequirements(requirementsList);
      setSharedRequirements(sharedRequirementsList);
      setArtists(artistsList);
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (orderSearchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.artwork.title
            .toLowerCase()
            .includes(orderSearchTerm.toLowerCase()) ||
          order.clientName
            .toLowerCase()
            .includes(orderSearchTerm.toLowerCase()) ||
          order.artistName.toLowerCase().includes(orderSearchTerm.toLowerCase())
      );
    }

    if (orderStatusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === orderStatusFilter);
    }

    setFilteredOrders(filtered);
  };

  const filterRequirements = () => {
    let filtered = requirements;

    if (requirementSearchTerm) {
      filtered = filtered.filter(
        (requirement) =>
          requirement.clientName
            .toLowerCase()
            .includes(requirementSearchTerm.toLowerCase()) ||
          requirement.description
            .toLowerCase()
            .includes(requirementSearchTerm.toLowerCase()) ||
          (requirement.category &&
            requirement.category
              .toLowerCase()
              .includes(requirementSearchTerm.toLowerCase()))
      );
    }

    if (requirementStatusFilter !== "all") {
      filtered = filtered.filter(
        (requirement) => requirement.status === requirementStatusFilter
      );
    }

    setFilteredRequirements(filtered);
  };

  // Helper function to get artist response status for a requirement
  const getArtistResponseStatus = (requirementId: string, artistId: string) => {
    const sharedReq = sharedRequirements.find(
      (sr) => sr.requirementId === requirementId && sr.artistId === artistId
    );
    return sharedReq?.status || 'pending';
  };

  // Helper function to get decline reason for an artist
  const getArtistDeclineReason = (requirementId: string, artistId: string) => {
    const sharedReq = sharedRequirements.find(
      (sr) => sr.requirementId === requirementId && sr.artistId === artistId
    );
    return sharedReq?.declineReason || null;
  };

  const updateOrderStatus = async (
    orderId: string,
    status:
      | "pending"
      | "shared"
      | "confirmed"
      | "in-progress"
      | "completed"
      | "cancelled"
  ) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status,
        [`${status}At`]: new Date(),
      });

      if (status === "completed") {
        const order = orders.find((o) => o.id === orderId);
        if (order && order.artwork.price) {
          // Artist referral commission
          const artistDoc = await getDoc(doc(db, "users", order.artistId));
          if (artistDoc.exists()) {
            const artist = artistDoc.data() as User;
            if (artist.referredBy) {
              const completedOrders = orders.filter(
                (o) => o.artistId === order.artistId && o.status === "completed"
              );

              if (completedOrders.length === 0) {
                const commissionAmount = order.artwork.price * 0.05;
                await updateDoc(doc(db, "users", artist.referredBy), {
                  commissions: arrayUnion({
                    orderId: order.id,
                    commissionAmount,
                    earnedAt: new Date(),
                  }),
                });
                toast.success(
                  "Commission for first order awarded to referring artist!"
                );
              }
            }
          }

          // Affiliate commission
          if (order.affiliateId) {
            const commissionAmount = order.artwork.price * 0.05;
            await updateDoc(doc(db, "users", order.affiliateId), {
              commissions: arrayUnion({
                orderId: order.id,
                commissionAmount,
                earnedAt: new Date(),
              }),
            });
            toast.success("Commission awarded to affiliate!");
          }
        }
      }

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      toast.success("Order status updated");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const updateRequirementStatus = async (
    requirementId: string,
    status: "open" | "shared" | "assigned" | "in-progress" | "completed"
  ) => {
    try {
      await updateDoc(doc(db, "requirements", requirementId), {
        status,
        [`${status}At`]: new Date(),
      });
      setRequirements(
        requirements.map((req) =>
          req.id === requirementId ? { ...req, status } : req
        )
      );
      toast.success("Requirement status updated");
    } catch (error) {
      console.error("Error updating requirement status:", error);
      toast.error("Failed to update requirement status");
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrders(orders.filter((order) => order.id !== orderId));
      toast.success("Order deleted successfully");
      setShowOrderModal(false);
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const deleteRequirement = async (requirementId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this requirement? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, "requirements", requirementId));
      setRequirements(requirements.filter((req) => req.id !== requirementId));
      toast.success("Requirement deleted successfully");
      setShowRequirementModal(false);
    } catch (error) {
      console.error("Error deleting requirement:", error);
      toast.error("Failed to delete requirement");
    }
  };

  const handleShareToAllArtists = async () => {
    if (!selectedRequirement || !proposedPrice) {
      toast.error("Please enter a proposed price");
      return;
    }

    try {
      const allArtistIds = artists.map((artist) => artist.uid);

      const sharePromises = allArtistIds.map((artistId) => {
        const artist = artists.find((a) => a.uid === artistId);
        return addDoc(collection(db, "sharedRequirements"), {
          requirementId: selectedRequirement.id,
          artistId,
          artistName: artist?.displayName || "Unknown",
          artistEmail: artist?.email || "",
          sharedAt: new Date(),
          status: "pending",
          proposedPrice: parseFloat(proposedPrice),
          requirement: selectedRequirement,
        });
      });

      await Promise.all(sharePromises);

      await updateDoc(doc(db, "requirements", selectedRequirement.id), {
        status: "shared",
        sharedWith: allArtistIds,
        sharedAt: new Date(),
      });

      setRequirements(
        requirements.map((req) =>
          req.id === selectedRequirement.id
            ? { ...req, status: "shared", sharedWith: allArtistIds }
            : req
        )
      );

      toast.success(
        `Requirement shared with all ${allArtistIds.length} artists`
      );
      setShowShareAllModal(false);
      setSelectedRequirement(null);
      setProposedPrice("");
      
      // Refresh shared requirements data
      fetchData();
    } catch (error) {
      console.error("Error sharing requirement to all artists:", error);
      toast.error("Failed to share requirement to all artists");
    }
  };

  const handleShareRequirement = async () => {
    if (!selectedRequirement || selectedArtists.length === 0) {
      toast.error("Please select at least one artist");
      return;
    }

    if (!proposedPrice) {
      toast.error("Please enter a proposed price");
      return;
    }

    try {
      const sharePromises = selectedArtists.map((artistId) => {
        const artist = artists.find((a) => a.uid === artistId);
        return addDoc(collection(db, "sharedRequirements"), {
          requirementId: selectedRequirement.id,
          artistId,
          artistName: artist?.displayName || "Unknown",
          artistEmail: artist?.email || "",
          sharedAt: new Date(),
          status: "pending",
          proposedPrice: parseFloat(proposedPrice),
          requirement: selectedRequirement,
        });
      });

      await Promise.all(sharePromises);

      await updateDoc(doc(db, "requirements", selectedRequirement.id), {
        status: "shared",
        sharedWith: [
          ...(selectedRequirement.sharedWith || []),
          ...selectedArtists,
        ],
        sharedAt: new Date(),
      });

      setRequirements(
        requirements.map((req) =>
          req.id === selectedRequirement.id
            ? {
                ...req,
                status: "shared",
                sharedWith: [...(req.sharedWith || []), ...selectedArtists],
              }
            : req
        )
      );

      toast.success(
        `Requirement shared with ${selectedArtists.length} artist(s)`
      );
      setShowShareModal(false);
      setSelectedRequirement(null);
      setSelectedArtists([]);
      setProposedPrice("");
      
      // Refresh shared requirements data
      fetchData();
    } catch (error) {
      console.error("Error sharing requirement:", error);
      toast.error("Failed to share requirement");
    }
  };

  const handleShareOrderWithArtist = async (order: Order) => {
    try {
      const artist = artists.find((a) => a.uid === order.artistId);

      if (!artist) {
        toast.error("Artist not found");
        return;
      }

      await addDoc(collection(db, "sharedOrders"), {
        orderId: order.id,
        artistId: order.artistId,
        artistName: order.artistName,
        artistEmail: artist.email,
        sharedAt: new Date(),
        status: "pending",
        order: {
          artworkId: order.artworkId,
          requirements: order.requirements,
          alterationDescription: order.alterationDescription,
          artwork: order.artwork,
        },
      });

      await updateDoc(doc(db, "orders", order.id), {
        status: "shared",
        sharedAt: new Date(),
      });

      setOrders(
        orders.map((o) => (o.id === order.id ? { ...o, status: "shared" } : o))
      );

      toast.success(`Order shared with ${order.artistName}`);
    } catch (error) {
      console.error("Error sharing order:", error);
      toast.error("Failed to share order");
    }
  };

  // WhatsApp sharing function for declined orders
  const shareOrderToWhatsApp = (order: Order) => {
    const message = `🎨 *DECLINED ORDER - NEED NEW ARTIST*

📋 *Order Details:*
• Artwork: ${order.artwork.title}
• Category: ${order.artwork.category}
• Artist: ${order.artistName} (DECLINED)
• Client: ${order.clientName}

💰 *Price:* ₹${order.artwork.price || "Not specified"}

📍 *Address:*
${order.address}

❌ *Decline Reason:*
${order.declineReason || "No reason provided"}

${
  order.requirements
    ? `📝 *Special Requirements:*
${order.requirements}

`
    : ""
}${
      order.alterationDescription
        ? `🎨 *Customization Request:*
${order.alterationDescription}

`
        : ""
    }🔍 *Looking for a new artist to take this order!*

#DeclinedOrder #NeedArtist #FrameGlobe`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    toast.success("Order details shared to WhatsApp!");
  };

  // WhatsApp sharing function for client requirements
  const shareRequirementToWhatsApp = (requirement: ClientRequirement) => {
    const message = `🎨 *CLIENT REQUIREMENT - NEED ARTIST*

📋 *Requirement Details:*
• ID: #${requirement.id.slice(-6)}
• Client: ${requirement.clientName}
${requirement.address ? `📍 *Address:* ${requirement.address}` : ""}

${requirement.category ? `🎯 *Category:* ${requirement.category}` : ""}
${requirement.budget ? `💰 *Budget:* ₹${requirement.budget}` : ""}
${
  requirement.deadline
    ? `⏰ *Deadline:* ${new Date(
        requirement.deadline.seconds * 1000
      ).toLocaleDateString()}`
    : ""
}

📝 *Description:*
${requirement.description}

📊 *Status:* ${
      requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)
    }

${
  requirement.sharedWith && requirement.sharedWith.length > 0
    ? `👥 *Shared with ${requirement.sharedWith.length} artist(s)
`
    : ""
}
${
  requirement.acceptedBy
    ? `✅ *Accepted by:* ${requirement.acceptedBy.artistName}
`
    : ""
}
${
  requirement.workCompleted
    ? `🎉 *Work Completed by:* ${requirement.workCompleted.artistName}
`
    : ""
}
${
  requirement.attachmentUrl
    ? `📎 *Reference Image: ${requirement.attachmentUrl}
`
    : ""
}🔍 *Looking for an artist to fulfill this requirement!*

#ClientRequirement #NeedArtist #FrameGlobe`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    toast.success("Requirement details shared to WhatsApp!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
      case "shared":
        return "bg-blue-100 text-blue-800";
      case "assigned":
        return "bg-purple-100 text-purple-800";
      case "in-progress":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUserContactInfo = (userId: string) => {
    return users.find((user) => user.uid === userId);
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setShowImageModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    totalRequirements: requirements.length,
    openRequirements: requirements.filter((r) => r.status === "open").length,
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - FrameGlobe</title>
        <meta
          name="description"
          content="Manage orders, client requirements, and oversee the FrameGlobe platform."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Manage orders and client requirements
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center">
                <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Pending Orders
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.pendingOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Requirements
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.totalRequirements}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Open Requirements
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {stats.openRequirements}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "orders"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Orders ({filteredOrders.length})
                </button>
                <button
                  onClick={() => setActiveTab("requirements")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "requirements"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Requirements ({filteredRequirements.length})
                </button>
              </nav>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === "orders" ? (
                <div className="space-y-4">
                  {/* Mobile Filter Toggle */}
                  <div className="sm:hidden">
                    <button
                      onClick={() => setShowMobileFilters(!showMobileFilters)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Filter Orders
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          showMobileFilters ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Orders Filter - Desktop */}
                  <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={orderSearchTerm}
                        onChange={(e) => setOrderSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <select
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="shared">Shared</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders Filter - Mobile */}
                  {showMobileFilters && (
                    <div className="sm:hidden space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          placeholder="Search orders..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={orderSearchTerm}
                          onChange={(e) => setOrderSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                          value={orderStatusFilter}
                          onChange={(e) => setOrderStatusFilter(e.target.value)}
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="shared">Shared</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No orders found
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {orderSearchTerm || orderStatusFilter !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "Orders will appear here when clients place them"}
                      </p>
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                            <div
                              className="cursor-pointer flex-shrink-0"
                              onClick={() =>
                                openImageModal(order.artwork.imageUrl)
                              }
                            >
                              <img
                                src={order.artwork.imageUrl}
                                alt={order.artwork.title}
                                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg hover:opacity-80 transition-opacity"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                {order.artwork.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">
                                by {order.artistName}
                              </p>
                              {order.artwork.price && (
                                <p className="text-xs sm:text-sm font-medium text-green-600">
                                  ₹{order.artwork.price}
                                </p>
                              )}
                              {order.status === "cancelled" &&
                                order.declineReason && (
                                  <p className="text-xs text-red-600 mt-1 line-clamp-2">
                                    Declined: {order.declineReason}
                                  </p>
                                )}
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )} whitespace-nowrap`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                            <div className="flex space-x-1 sm:space-x-2">
                              {order.status === "pending" && (
                                <button
                                  onClick={() =>
                                    handleShareOrderWithArtist(order)
                                  }
                                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center space-x-1"
                                >
                                  <Send className="h-3 w-3" />
                                  <span className="hidden sm:inline">
                                    Share
                                  </span>
                                </button>
                              )}
                              {order.status === "cancelled" && (
                                <button
                                  onClick={() => shareOrderToWhatsApp(order)}
                                  className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center space-x-1"
                                  title="Share to WhatsApp Group"
                                >
                                  <WhatsAppIcon className="h-3 w-3" />
                                  <span className="hidden sm:inline">
                                    WhatsApp
                                  </span>
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowOrderModal(true);
                                }}
                                className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 transition-colors flex items-center space-x-1"
                              >
                                <Eye className="h-3 w-3" />
                                <span className="hidden sm:inline">View</span>
                              </button>
                              <button
                                onClick={() => deleteOrder(order.id)}
                                className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors flex items-center space-x-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          Order Date: {formatTimestamp(order.orderDate)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Mobile Filter Toggle */}
                  <div className="sm:hidden">
                    <button
                      onClick={() => setShowMobileFilters(!showMobileFilters)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Filter Requirements
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          showMobileFilters ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Requirements Filter - Desktop */}
                  <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search requirements..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={requirementSearchTerm}
                        onChange={(e) =>
                          setRequirementSearchTerm(e.target.value)
                        }
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <select
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                        value={requirementStatusFilter}
                        onChange={(e) =>
                          setRequirementStatusFilter(e.target.value)
                        }
                      >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="shared">Shared</option>
                        <option value="assigned">Assigned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Requirements Filter - Mobile */}
                  {showMobileFilters && (
                    <div className="sm:hidden space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          placeholder="Search requirements..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={requirementSearchTerm}
                          onChange={(e) =>
                            setRequirementSearchTerm(e.target.value)
                          }
                        />
                      </div>
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                          value={requirementStatusFilter}
                          onChange={(e) =>
                            setRequirementStatusFilter(e.target.value)
                          }
                        >
                          <option value="all">All Status</option>
                          <option value="open">Open</option>
                          <option value="shared">Shared</option>
                          <option value="assigned">Assigned</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {filteredRequirements.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No requirements found
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {requirementSearchTerm ||
                        requirementStatusFilter !== "all"
                          ? "Try adjusting your search or filter criteria"
                          : "Client requirements will appear here"}
                      </p>
                    </div>
                  ) : (
                    filteredRequirements.map((requirement) => (
                      <div
                        key={requirement.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                              Requirement #{requirement.id.slice(-6)}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                              {requirement.clientName}
                            </p>
                            {requirement.sharedWith &&
                              requirement.sharedWith.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  <span className="text-xs text-blue-600 font-medium">
                                    Shared with:
                                  </span>
                                  {requirement.sharedWith
                                    .slice(0, 3)
                                    .map((artistId, index) => {
                                      const artist = artists.find(
                                        (a) => a.uid === artistId
                                      );
                                      const artistStatus = getArtistResponseStatus(requirement.id, artistId);
                                      const isAccepted = artistStatus === 'accepted';
                                      const isDeclined = artistStatus === 'declined';
                                      const declineReason = getArtistDeclineReason(requirement.id, artistId);

                                      return (
                                        <span
                                          key={artistId}
                                          className={`text-xs px-2 py-1 rounded-full ${
                                            isAccepted
                                              ? "bg-green-100 text-green-800"
                                              : isDeclined
                                              ? "bg-red-100 text-red-800"
                                              : "bg-blue-100 text-blue-800"
                                          }`}
                                          title={isDeclined && declineReason ? `Declined: ${declineReason}` : ''}
                                        >
                                          {artist?.displayName?.split(" ")[0] ||
                                            "Unknown"}
                                          {isAccepted && " ✓"}
                                          {isDeclined && " ✗"}
                                        </span>
                                      );
                                    })}
                                  {requirement.sharedWith.length > 3 && (
                                    <span className="text-xs text-gray-500">
                                      +{requirement.sharedWith.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                          </div>

                          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:items-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                requirement.status
                              )} whitespace-nowrap`}
                            >
                              {requirement.status.charAt(0).toUpperCase() +
                                requirement.status.slice(1)}
                            </span>
                            <div className="flex space-x-1 sm:space-x-2">
                              {requirement.status === "open" && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedRequirement(requirement);
                                      setShowShareAllModal(true);
                                    }}
                                    className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700 transition-colors flex items-center space-x-1"
                                  >
                                    <Users className="h-3 w-3" />
                                    <span className="hidden sm:inline">
                                      Share All
                                    </span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedRequirement(requirement);
                                      setShowShareModal(true);
                                    }}
                                    className="bg-indigo-600 text-white px-2 py-1 rounded text-xs hover:bg-indigo-700 transition-colors flex items-center space-x-1"
                                  >
                                    <Share2 className="h-3 w-3" />
                                    <span className="hidden sm:inline">
                                      Share
                                    </span>
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() =>
                                  shareRequirementToWhatsApp(requirement)
                                }
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center space-x-1"
                                title="Share to WhatsApp Group"
                              >
                                <WhatsAppIcon className="h-3 w-3" />
                                <span className="hidden sm:inline">
                                  WhatsApp
                                </span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRequirement(requirement);
                                  setShowRequirementModal(true);
                                }}
                                className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 transition-colors flex items-center space-x-1"
                              >
                                <Eye className="h-3 w-3" />
                                <span className="hidden sm:inline">View</span>
                              </button>
                              <button
                                onClick={() =>
                                  deleteRequirement(requirement.id)
                                }
                                className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors flex items-center space-x-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          Created: {formatTimestamp(requirement.createdAt)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full Size Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
            <div className="relative w-full h-full max-w-4xl max-h-full">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 p-2"
              >
                <X className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>
              <img
                src={selectedImageUrl}
                alt="Full size view"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Order Details
                  </h2>
                  <div className="flex items-center space-x-2">
                    {selectedOrder.status === "cancelled" && (
                      <button
                        onClick={() => shareOrderToWhatsApp(selectedOrder)}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
                        title="Share to WhatsApp Group"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        <span>Share to WhatsApp</span>
                      </button>
                    )}
                    <button
                      onClick={() => deleteOrder(selectedOrder.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-2"
                    >
                      <X className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="relative">
                      <img
                        src={selectedOrder.artwork.imageUrl}
                        alt={selectedOrder.artwork.title}
                        className="w-full h-auto object-contain max-h-96 rounded-lg cursor-pointer"
                        onClick={() =>
                          openImageModal(selectedOrder.artwork.imageUrl)
                        }
                      />
                      <button
                        onClick={() =>
                          openImageModal(selectedOrder.artwork.imageUrl)
                        }
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {selectedOrder.artwork.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2 flex-wrap">
                        <Palette className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          by {selectedOrder.artistName}
                        </span>
                        {selectedOrder.artwork.isCustomizable && (
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                            Customizable
                          </span>
                        )}
                        {selectedOrder.artwork.price && (
                          <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                            ₹{selectedOrder.artwork.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {selectedOrder.status.charAt(0).toUpperCase() +
                          selectedOrder.status.slice(1)}
                      </span>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            selectedOrder.id,
                            e.target.value as any
                          )
                        }
                        className="text-sm border border-gray-300 rounded px-3 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="shared">Shared</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Client Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="break-all">
                              {selectedOrder.clientName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <a
                              href={`mailto:${selectedOrder.clientEmail}`}
                              className="text-indigo-600 hover:text-indigo-800 break-all"
                            >
                              {selectedOrder.clientEmail}
                            </a>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <a
                              href={`tel:${selectedOrder.clientPhone}`}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              {selectedOrder.clientPhone}
                            </a>
                          </div>
                          <div className="flex items-start space-x-2">
                            <MapPinned className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="break-words">
                              {selectedOrder.address}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Artist Information
                        </h4>
                        {(() => {
                          const artistContact = getUserContactInfo(
                            selectedOrder.artistId
                          );
                          return artistContact ? (
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <UserIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="break-all">
                                  {artistContact.displayName}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <a
                                  href={`mailto:${artistContact.email}`}
                                  className="text-indigo-600 hover:text-indigo-800 break-all"
                                >
                                  {artistContact.email}
                                </a>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <a
                                  href={`tel:${artistContact.phone}`}
                                  className="text-indigo-600 hover:text-indigo-800"
                                >
                                  {artistContact.phone}
                                </a>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Artist information not available
                            </p>
                          );
                        })()}
                      </div>

                      {selectedOrder.affiliateId && (() => {
                        const affiliateContact = getUserContactInfo(selectedOrder.affiliateId);
                        return affiliateContact ? (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Affiliate Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <UserIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="break-all">
                                  {affiliateContact.displayName}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <a
                                  href={`mailto:${affiliateContact.email}`}
                                  className="text-indigo-600 hover:text-indigo-800 break-all"
                                >
                                  {affiliateContact.email}
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}

                      {(() => {
                        const orderArtist = users.find(u => u.uid === selectedOrder.artistId);
                        if (orderArtist && orderArtist.referredBy) {
                          const referringUser = getUserContactInfo(orderArtist.referredBy);
                          return referringUser ? (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">
                                Referred By (Commission Recipient)
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                  <UserIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  <span className="break-all">
                                    {referringUser.displayName}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  <a
                                    href={`mailto:${referringUser.email}`}
                                    className="text-indigo-600 hover:text-indigo-800 break-all"
                                  >
                                    {referringUser.email}
                                  </a>
                                </div>
                              </div>
                            </div>
                          ) : null;
                        }
                        return null;
                      })()}
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Timeline
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Order Date:</span>{" "}
                          {formatTimestamp(selectedOrder.orderDate)}
                        </p>
                        {selectedOrder.sharedAt && (
                          <p>
                            <span className="font-medium">Shared:</span>{" "}
                            {formatTimestamp(selectedOrder.sharedAt)}
                          </p>
                        )}
                        {selectedOrder.confirmedAt && (
                          <p>
                            <span className="font-medium">Confirmed:</span>{" "}
                            {formatTimestamp(selectedOrder.confirmedAt)}
                          </p>
                        )}
                        {selectedOrder.inProgressAt && (
                          <p>
                            <span className="font-medium">In Progress:</span>{" "}
                            {formatTimestamp(selectedOrder.inProgressAt)}
                          </p>
                        )}
                        {selectedOrder.completedAt && (
                          <p>
                            <span className="font-medium">Completed:</span>{" "}
                            {formatTimestamp(selectedOrder.completedAt)}
                          </p>
                        )}
                        {selectedOrder.cancelledAt && (
                          <p>
                            <span className="font-medium">Cancelled:</span>{" "}
                            {formatTimestamp(selectedOrder.cancelledAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    {(selectedOrder.requirements ||
                      selectedOrder.alterationDescription) && (
                      <div className="space-y-3">
                        {selectedOrder.requirements && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Special Requirements
                            </h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded break-words">
                              {selectedOrder.requirements}
                            </p>
                          </div>
                        )}

                        {selectedOrder.alterationDescription && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Customization Request
                            </h4>
                            <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded break-words">
                              {selectedOrder.alterationDescription}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedOrder.status === "cancelled" &&
                      selectedOrder.declineReason && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Decline Reason
                          </h4>
                          <p className="text-sm text-red-600 bg-red-50 p-3 rounded break-words">
                            {selectedOrder.declineReason}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requirement Detail Modal */}
        {showRequirementModal && selectedRequirement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Requirement Details
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        shareRequirementToWhatsApp(selectedRequirement)
                      }
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
                      title="Share to WhatsApp Group"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      <span>Share to WhatsApp</span>
                    </button>
                    <button
                      onClick={() => deleteRequirement(selectedRequirement.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                    <button
                      onClick={() => setShowRequirementModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-2"
                    >
                      <X className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Requirement #{selectedRequirement.id.slice(-6)}
                      </h3>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            selectedRequirement.status
                          )}`}
                        >
                          {selectedRequirement.status.charAt(0).toUpperCase() +
                            selectedRequirement.status.slice(1)}
                        </span>
                        <select
                          value={selectedRequirement.status}
                          onChange={(e) =>
                            updateRequirementStatus(
                              selectedRequirement.id,
                              e.target.value as any
                            )
                          }
                          className="text-sm border border-gray-300 rounded px-3 py-1"
                        >
                          <option value="open">Open</option>
                          <option value="shared">Shared</option>
                          <option value="assigned">Assigned</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Client Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <UserIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="break-all">
                            {selectedRequirement.clientName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <a
                            href={`mailto:${selectedRequirement.clientEmail}`}
                            className="text-indigo-600 hover:text-indigo-800 break-all"
                          >
                            {selectedRequirement.clientEmail}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <a
                            href={`tel:${selectedRequirement.clientPhone}`}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            {selectedRequirement.clientPhone}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Timeline
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Created:</span>{" "}
                          {formatTimestamp(selectedRequirement.createdAt)}
                        </p>
                        {selectedRequirement.sharedAt && (
                          <p>
                            <span className="font-medium">Shared:</span>{" "}
                            {formatTimestamp(selectedRequirement.sharedAt)}
                          </p>
                        )}
                        {selectedRequirement.acceptedBy && (
                          <p>
                            <span className="font-medium">Accepted:</span>{" "}
                            {formatTimestamp(
                              selectedRequirement.acceptedBy.acceptedAt
                            )}
                          </p>
                        )}
                        {selectedRequirement.inProgressAt && (
                          <p>
                            <span className="font-medium">In Progress:</span>{" "}
                            {formatTimestamp(selectedRequirement.inProgressAt)}
                          </p>
                        )}
                        {selectedRequirement.workCompleted && (
                          <p>
                            <span className="font-medium">Completed:</span>{" "}
                            {formatTimestamp(
                              selectedRequirement.workCompleted.completedAt
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    {(selectedRequirement.category ||
                      selectedRequirement.budget ||
                      selectedRequirement.deadline) && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Requirements
                        </h4>
                        <div className="space-y-1 text-sm">
                          {selectedRequirement.category && (
                            <p>
                              <span className="font-medium">Category:</span>{" "}
                              {selectedRequirement.category}
                            </p>
                          )}
                          {selectedRequirement.budget && (
                            <p>
                              <span className="font-medium">Budget:</span> ₹
                              {selectedRequirement.budget}
                            </p>
                          )}
                          {selectedRequirement.deadline && (
                            <p>
                              <span className="font-medium">Deadline:</span>{" "}
                              {new Date(
                                selectedRequirement.deadline.seconds * 1000
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedRequirement.sharedWith &&
                      selectedRequirement.sharedWith.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">
                            Artist Responses
                          </h4>
                          <div className="space-y-2">
                            {selectedRequirement.sharedWith.map(
                              (artistId) => {
                                const artist = artists.find(
                                  (a) => a.uid === artistId
                                );
                                const artistStatus = getArtistResponseStatus(selectedRequirement.id, artistId);
                                const declineReason = getArtistDeclineReason(selectedRequirement.id, artistId);
                                const isAccepted = artistStatus === 'accepted';
                                const isDeclined = artistStatus === 'declined';

                                return (
                                  <div
                                    key={artistId}
                                    className={`p-3 rounded-lg border ${
                                      isAccepted
                                        ? "bg-green-50 border-green-200"
                                        : isDeclined
                                        ? "bg-red-50 border-red-200"
                                        : "bg-blue-50 border-blue-200"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-sm">
                                        {artist?.displayName || "Unknown Artist"}
                                      </span>
                                      <span
                                        className={`px-2 py-1 rounded text-xs ${
                                          isAccepted
                                            ? "bg-green-100 text-green-800"
                                            : isDeclined
                                            ? "bg-red-100 text-red-800"
                                            : "bg-blue-100 text-blue-800"
                                        }`}
                                      >
                                        {artistStatus.charAt(0).toUpperCase() + artistStatus.slice(1)}
                                      </span>
                                    </div>
                                    {isDeclined && declineReason && (
                                      <p className="text-xs text-red-600 mt-1">
                                        Reason: {declineReason}
                                      </p>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Description
                      </h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded break-words">
                        {selectedRequirement.description}
                      </p>
                    </div>

                    {selectedRequirement.attachmentUrl && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Reference Image
                        </h4>
                        <div className="relative">
                          <img
                            src={selectedRequirement.attachmentUrl}
                            alt="Client reference"
                            className="w-full max-w-sm h-auto object-contain rounded-lg border cursor-pointer"
                            onClick={() =>
                              openImageModal(selectedRequirement.attachmentUrl!)
                            }
                          />
                          <button
                            onClick={() =>
                              openImageModal(selectedRequirement.attachmentUrl!)
                            }
                            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedRequirement.acceptedBy && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">
                          Accepted by Artist
                        </h4>
                        <div className="text-sm text-green-800">
                          <p>
                            <strong>Artist:</strong>{" "}
                            {selectedRequirement.acceptedBy.artistName}
                          </p>
                          <p className="break-all">
                            <strong>Email:</strong>{" "}
                            {selectedRequirement.acceptedBy.artistEmail}
                          </p>
                          <p>
                            <strong>Accepted:</strong>{" "}
                            {formatTimestamp(
                              selectedRequirement.acceptedBy.acceptedAt
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedRequirement.workCompleted && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Work Completed
                        </h4>
                        <div className="text-sm text-blue-800">
                          <p>
                            <strong>Artist:</strong>{" "}
                            {selectedRequirement.workCompleted.artistName}
                          </p>
                          <p>
                            <strong>Completed:</strong>{" "}
                            {formatTimestamp(
                              selectedRequirement.workCompleted.completedAt
                            )}
                          </p>
                          {selectedRequirement.workCompleted.notes && (
                            <p>
                              <strong>Notes:</strong>{" "}
                              {selectedRequirement.workCompleted.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share All Artists Modal */}
        {showShareAllModal && selectedRequirement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Share with All Artists
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                This will share the requirement with all {artists.length}{" "}
                artists.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposed Price (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter proposed price for artists"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => {
                    setShowShareAllModal(false);
                    setSelectedRequirement(null);
                    setProposedPrice("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShareToAllArtists}
                  disabled={!proposedPrice}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Share with All ({artists.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Requirement Modal */}
        {showShareModal && selectedRequirement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Share Requirement with Artists
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Select artists to share this requirement with:
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposed Price (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter proposed price for artists"
                  required
                />
              </div>

              <div className="max-h-40 overflow-y-auto mb-4">
                {artists.map((artist) => (
                  <label
                    key={artist.uid}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedArtists.includes(artist.uid)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedArtists([...selectedArtists, artist.uid]);
                        } else {
                          setSelectedArtists(
                            selectedArtists.filter((id) => id !== artist.uid)
                          );
                        }
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {artist.displayName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {artist.email}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    setSelectedRequirement(null);
                    setSelectedArtists([]);
                    setProposedPrice("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShareRequirement}
                  disabled={selectedArtists.length === 0 || !proposedPrice}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Share ({selectedArtists.length})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
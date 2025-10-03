export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string; // Added phone field
  role: 'artist' | 'client' | 'admin';
  createdAt: Date;
  referredBy?: string;
}

export interface Artist extends User {
  bio?: string;
  specialties: string[];
  location?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface Artwork {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  thumbnailUrl?: string;
  publicId?: string;
  price?: number;
  isCustomizable: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isAvailable: boolean;
}

export interface Order {
  id: string;
  artworkId: string;
  artistId: string;
  artistName: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  address: string;
  requirements?: string;
  alterationDescription?: string;
  status: 'pending' | 'shared' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  orderDate: any;
  paymentStatus: 'unpaid' | 'paid';
  sharedAt?: any;
  confirmedAt?: any;
  inProgressAt?: any;
  completedAt?: any;
  cancelledAt?: any;
  declineReason?: string;
  artwork: {
    title: string;
    imageUrl: string;
    price?: number;
    category: string;
    isCustomizable: boolean;
  };
}

export interface ClientRequirement {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  description: string;
  category?: string;
  budget?: number;
  deadline?: any;
  attachmentUrl?: string;
  attachmentPublicId?: string;
  status: 'open' | 'shared' | 'assigned' | 'in-progress' | 'completed';
  createdAt: any;
  sharedAt?: any;
  inProgressAt?: any;
  sharedWith?: string[];
  acceptedBy?: {
    artistId: string;
    artistName: string;
    artistEmail: string;
    acceptedAt: any;
  };
  workCompleted?: {
    artistId: string;
    artistName: string;
    artistEmail: string;
    completedAt: any;
    notes?: string;
  };
}

export interface SharedRequirement {
  id: string;
  requirementId: string;
  artistId: string;
  artistName: string;
  artistEmail: string;
  sharedAt: any;
  acceptedAt?: any;
  declinedAt?: any;
  inProgressAt?: any;
  completedAt?: any;
  status: 'pending' | 'accepted' | 'declined' | 'in-progress' | 'completed';
  proposedPrice?: number;
  declineReason?: string;
  requirement: ClientRequirement;
}

export interface SharedOrder {
  id: string;
  orderId: string;
  artistId: string;
  artistName: string;
  artistEmail: string;
  sharedAt: any;
  acceptedAt?: any;
  declinedAt?: any;
  inProgressAt?: any;
  completedAt?: any;
  status: 'pending' | 'accepted' | 'declined' | 'in-progress' | 'completed';
  declineReason?: string;
  order: {
    artworkId: string;
    requirements?: string;
    alterationDescription?: string;
    artwork: {
      title: string;
      imageUrl: string;
      category: string;
      isCustomizable: boolean;
    };
  };
}

export interface Affiliate {
  uid: string;
  name: string;
  email: string;
  referralCode: string;
  referredUsers: string[]; // Array of user IDs
  createdAt: Date;
}

export interface Achievement {
  id: string;
  userId: string; // The user who earned the achievement
  type: 'referral_signup' | 'referral_first_sale';
  message: string;
  achievedAt: Date;
  relatedUserId?: string; // The user who was referred
}
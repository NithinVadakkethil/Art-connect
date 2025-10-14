export interface Commission {
  orderId: string;
  commissionAmount: number;
  earnedAt: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string; // Added phone field
  role: 'artist' | 'client' | 'admin' | 'affiliate';
  createdAt: Date;
  referralCode?: string;
  referredBy?: string;
}

export interface Artist extends User {
  bio?: string;
  specialties: string[];
  commissions?: Commission[];
  location?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface Affiliate extends User {
  commissions?: Commission[];
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
  affiliateId?: string;
  clientPhone: string;
  address: string;
  requirements?: string;
  alterationDescription?: string;
  status: 'pending' | 'shared' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  orderDate: any;
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
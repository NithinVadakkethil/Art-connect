# ArtistHub - Complete Artist Showcase Web Application

A comprehensive web application for artists to showcase their work and connect with clients worldwide. Built with React, TypeScript, Firebase, and Tailwind CSS.

## Features

### For Artists
- **User Authentication**: Secure registration and login system
- **Artist Dashboard**: Upload and manage artworks with image optimization
- **Profile Management**: Complete profile with bio, specialties, and social links
- **Portfolio Showcase**: Display artworks with detailed information
- **Order Management**: Receive and track client orders

### For Clients
- **Gallery Browsing**: Advanced filtering and search functionality
- **Artwork Ordering**: Direct ordering system with requirement specification
- **Custom Requirements**: Submit custom artwork requirements
- **Artist Discovery**: Find artists based on style and category

### For Admins
- **Order Management**: View and manage all client orders
- **Requirement Tracking**: Handle client custom requirements
- **User Management**: Oversee platform operations
- **Analytics Dashboard**: Monitor platform statistics

### Technical Features
- **SEO Optimized**: Complete meta tags, structured data, and semantic HTML
- **Image Optimization**: Automatic compression and thumbnail generation
- **Responsive Design**: Works perfectly on all devices
- **Real-time Updates**: Firebase Firestore for real-time data
- **Secure Storage**: Firebase Storage for optimized image handling
- **Performance Optimized**: Lazy loading and code splitting

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **SEO**: React Helmet Async
- **Build Tool**: Vite

## Firebase Setup

1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Authentication with Email/Password
3. Create Firestore database
4. Enable Storage
5. Update `src/config/firebase.ts` with your config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Firestore Collections Structure

### users
```
{
  uid: string,
  email: string,
  displayName: string,
  role: 'artist' | 'client' | 'admin',
  bio?: string,
  specialties?: string[],
  location?: string,
  website?: string,
  socialLinks?: {
    instagram?: string,
    twitter?: string,
    facebook?: string
  },
  createdAt: timestamp
}
```

### artworks
```
{
  artistId: string,
  artistName: string,
  title: string,
  description: string,
  category: string,
  imageUrl: string,
  thumbnailUrl: string,
  price?: number,
  dimensions?: string,
  medium?: string,
  year?: number,
  tags: string[],
  isAvailable: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### orders
```
{
  artworkId: string,
  artistId: string,
  artistName: string,
  clientId: string,
  clientName: string,
  clientEmail: string,
  clientPhone: string,
  requirements?: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  orderDate: timestamp,
  artwork: {
    title: string,
    imageUrl: string,
    price?: number,
    category: string
  }
}
```

### requirements
```
{
  clientId: string,
  clientName: string,
  clientEmail: string,
  clientPhone: string,
  description: string,
  category?: string,
  budget?: number,
  deadline?: timestamp,
  status: 'open' | 'assigned' | 'completed',
  createdAt: timestamp
}
```

## Installation & Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update Firebase configuration in `src/config/firebase.ts`
4. Start development server:
   ```bash
   npm run dev
   ```

## Deployment

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects in `public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow the prompts

## Image Optimization

The app includes automatic image optimization:
- **Compression**: Images are compressed to reduce file size
- **Thumbnails**: Automatic thumbnail generation for gallery views
- **Progressive Loading**: Images load progressively for better UX
- **Multiple Formats**: Support for JPEG, PNG, and WebP

## SEO Features

- **Meta Tags**: Dynamic meta tags for each page
- **Open Graph**: Social media preview optimization
- **Structured Data**: Schema markup for better search visibility
- **Semantic HTML**: Proper HTML structure for accessibility
- **Fast Loading**: Optimized images and lazy loading

## Security Features

- **Authentication**: Secure Firebase Authentication
- **Authorization**: Role-based access control
- **Data Validation**: Client and server-side validation
- **Secure Storage**: Firebase Storage with proper security rules
- **HTTPS**: Secure data transmission

## Performance Optimizations

- **Image Compression**: Automatic image optimization
- **Code Splitting**: Lazy loading of components
- **Caching**: Proper caching strategies
- **Bundle Optimization**: Tree shaking and minification
- **CDN**: Firebase CDN for global content delivery

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue on GitHub
- Email: support@artisthub.com

---

Built with ❤️ for artists worldwide
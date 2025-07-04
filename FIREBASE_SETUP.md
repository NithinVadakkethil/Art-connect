# Firebase Setup Instructions

## 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Enter project name (e.g., "artisthub-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Disable "Email link (passwordless sign-in)" unless needed

## 3. Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select your preferred location
5. Click "Done"

## 4. Enable Storage
1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select same location as Firestore
5. Click "Done"

## 5. Get Firebase Configuration
1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add web app
4. Enter app nickname (e.g., "ArtistHub Web")
5. Don't check "Firebase Hosting" for now
6. Click "Register app"
7. Copy the firebaseConfig object

## 6. Update Firebase Config
Replace the config in `src/config/firebase.ts` with your actual values:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 7. Set Up Security Rules

### Firestore Rules
1. Go to "Firestore Database" → "Rules"
2. Replace the default rules with the content from `firestore-rules.txt`
3. Click "Publish"

### Storage Rules
1. Go to "Storage" → "Rules"
2. Replace the default rules with the content from `firebase-storage-rules.txt`
3. Click "Publish"

## 8. Test the Setup
1. Start your development server: `npm run dev`
2. Try registering a new user
3. Try uploading an artwork
4. Check Firebase Console to see if data is being saved

## Troubleshooting CORS Issues

If you still get CORS errors after setting up the rules:

1. **Check Storage Rules**: Make sure the storage rules are properly set
2. **Verify Authentication**: Ensure user is logged in before uploading
3. **File Size**: Check if files are too large (Firebase has limits)
4. **Network**: Try from a different network or disable VPN

## Production Deployment

When deploying to production:
1. Update Firestore rules to be more restrictive
2. Set up proper CORS configuration if needed
3. Enable Firebase App Check for additional security
4. Monitor usage and set up billing alerts

## Support

If you encounter issues:
1. Check Firebase Console logs
2. Check browser developer console for detailed errors
3. Verify all configuration steps were completed
4. Test with a fresh browser session (clear cache)
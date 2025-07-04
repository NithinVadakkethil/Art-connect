# Admin User Setup Guide

## Method 1: Using the Setup Page (Recommended)

1. **Navigate to Setup Page**
   - Go to: `http://localhost:5174/setup-admin`
   - Click "Create Admin User"
   - Wait for confirmation

2. **Default Admin Credentials**
   - **Email**: `admin@artisthub.com`
   - **Password**: `Admin123!`

3. **Login as Admin**
   - Go to `/login`
   - Use the credentials above
   - You'll be redirected to the admin dashboard

## Method 2: Manual Firebase Console Setup

If you prefer to create the admin user manually:

1. **Create User in Firebase Auth**
   - Go to Firebase Console → Authentication → Users
   - Click "Add user"
   - Email: `admin@artisthub.com`
   - Password: `Admin123!` (or your preferred password)

2. **Set User Role in Firestore**
   - Go to Firebase Console → Firestore Database
   - Create a document in the `users` collection
   - Document ID: Use the UID from the user you just created
   - Add these fields:
     ```
     uid: "user-uid-from-auth"
     email: "admin@artisthub.com"
     displayName: "Admin User"
     role: "admin"
     createdAt: [current timestamp]
     ```

## Method 3: Promote Existing User

To make an existing user an admin:

1. **Find User in Firestore**
   - Go to Firebase Console → Firestore Database
   - Find the user document in the `users` collection

2. **Update Role**
   - Edit the document
   - Change `role` field from `"artist"` or `"client"` to `"admin"`
   - Save changes

## Security Notes

⚠️ **Important Security Considerations:**

1. **Change Default Password**: After first login, change the admin password
2. **Remove Setup Route**: In production, remove the `/setup-admin` route
3. **Limit Admin Access**: Only create admin users when necessary
4. **Monitor Admin Activity**: Keep track of admin actions

## Admin Dashboard Features

Once logged in as admin, you can:

- ✅ View all client orders
- ✅ Manage order status (pending → confirmed → completed)
- ✅ View client requirements and custom art requests
- ✅ Update requirement status (open → assigned → completed)
- ✅ Access client contact information
- ✅ Monitor platform statistics

## Troubleshooting

**Can't access admin dashboard?**
1. Verify the user role is set to "admin" in Firestore
2. Clear browser cache and cookies
3. Try logging out and logging back in

**Setup page not working?**
1. Check Firebase configuration
2. Ensure Firestore rules allow user creation
3. Check browser console for errors

## Production Deployment

Before deploying to production:

1. **Remove Setup Route**: Comment out or remove the setup-admin route
2. **Secure Admin Creation**: Use Firebase Admin SDK for secure admin creation
3. **Environment Variables**: Store admin credentials securely
4. **Monitoring**: Set up logging for admin actions
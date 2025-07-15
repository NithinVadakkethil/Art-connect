// Utility to create admin user - Run this once to create your admin account
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../config/firebase';

export const createAdminUser = async () => {
  try {
    // Create admin user with email and password
    const adminEmail = 'admin@frameGlobe.com';
    const adminPassword = 'adminadmin123#'; // Change this to a secure password
    const adminName = 'Admin';

    const { user } = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    
    await updateProfile(user, { displayName: adminName });
    
    // Set user role as admin in Firestore
    const userData = {
      uid: user.uid,
      email: user.email!,
      displayName: adminName,
      role: 'admin',
      createdAt: new Date()
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    
    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    
    return { success: true, user: userData };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, error };
  }
};
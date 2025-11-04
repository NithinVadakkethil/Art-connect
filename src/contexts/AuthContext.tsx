import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'artist' | 'client' | 'admin';
  phone?: string;
  createdAt: Date;
}

interface AuthContextType {
  currentUser: UserData | null;
  login: (email: string, password: string) => Promise<UserData>;
  register: (email: string, password: string, name: string, role: string, phone: string, referralCode: string | null) => Promise<UserData>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (user: User): Promise<UserData | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          uid: user.uid,
          email: user.email!,
          displayName: userData.displayName || user.displayName || '',
          role: userData.role || 'artist',
          phone: userData.phone || '',
          createdAt: userData.createdAt?.toDate() || new Date(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<UserData> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userData = await fetchUserData(result.user);
      
      if (!userData) {
        throw new Error('User data not found');
      }
      
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: string, 
    phone: string,
    referralCode: string | null
  ): Promise<UserData> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData: UserData = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName: name,
        role: role as 'artist' | 'client' | 'admin',
        phone,
        createdAt: new Date(),
      };

      const userDoc: any = {
        displayName: name,
        email: result.user.email,
        role,
        phone,
        createdAt: new Date(),
        uid: result.user.uid,
      };

      if (referralCode) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('referralCode', '==', referralCode));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const referrer = querySnapshot.docs[0];
          userDoc.referredBy = referrer.id;
        }
      }

      // Save user data to Firestore
      await setDoc(doc(db, 'users', result.user.uid), userDoc);

      setCurrentUser(userData);
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Forgot password - sends reset email
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  // Change password for authenticated users
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      if (!currentUser || !auth.currentUser) {
        throw new Error('No authenticated user');
      }

      // Re-authenticate the user with their current password
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update the password
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await fetchUserData(user);
        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    forgotPassword,
    changePassword,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
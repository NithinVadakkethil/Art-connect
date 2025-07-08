import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'artist' | 'client', phone: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully logged in!');
    } catch (error: any) {
      // Don't show toast error here - let the component handle it
      // This allows for more specific error handling in the UI
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: 'artist' | 'client', phone: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(user, { displayName: name });
      
      const userData: User = {
        uid: user.uid,
        email: user.email!,
        displayName: name,
        phone: phone,
        role,
        createdAt: new Date()
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    return new Promise<void>((resolve, reject) => {
      const confirmLogout = () => {
        signOut(auth)
          .then(() => {
            toast.success('Logged out successfully!');
            setShowLogoutConfirm(false);
            resolve();
          })
          .catch((error) => {
            toast.error(error.message);
            setShowLogoutConfirm(false);
            reject(error);
          });
      };

      // Show confirmation modal
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900">Confirm Logout</h2>
          </div>
          
          <p class="text-gray-600 mb-6">Are you sure you want to log out?</p>
          
          <div class="flex space-x-4">
            <button id="cancel-logout" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button id="confirm-logout" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Logout
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const cancelBtn = modal.querySelector('#cancel-logout');
      const confirmBtn = modal.querySelector('#confirm-logout');

      cancelBtn?.addEventListener('click', () => {
        document.body.removeChild(modal);
        reject(new Error('Logout cancelled'));
      });

      confirmBtn?.addEventListener('click', () => {
        document.body.removeChild(modal);
        confirmLogout();
      });
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data() as User);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
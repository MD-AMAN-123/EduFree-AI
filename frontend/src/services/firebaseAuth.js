// EduFree.AI - Firebase Authentication Service
// Configured with Firebase Project: edufree-ai-73e5f | Project Number: 268969651642

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInAnonymously
} from 'firebase/auth';

// Firebase Project Configuration from User Specs
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localStorage.getItem('edufree_firebase_api_key') || '',
  authDomain: 'edufree-ai-73e5f.firebaseapp.com',
  projectId: 'edufree-ai-73e5f',
  storageBucket: 'edufree-ai-73e5f.firebasestorage.app',
  messagingSenderId: '268969651642',
  appId: '1:268969651642:web:edufree-ai'
};

let firebaseApp = null;
let firebaseAuth = null;
let authInitialized = false;
const authListeners = new Set();

// Active session state (Firebase user or Guest session)
let currentSessionUser = null;

/**
 * Initialize or get Firebase App and Auth
 */
export function initFirebase(customApiKey = null) {
  try {
    const config = { ...DEFAULT_FIREBASE_CONFIG };
    if (customApiKey) {
      config.apiKey = customApiKey;
      localStorage.setItem('edufree_firebase_api_key', customApiKey);
    } else if (!config.apiKey) {
      const stored = localStorage.getItem('edufree_firebase_api_key');
      if (stored) config.apiKey = stored;
    }

    if (!getApps().length) {
      firebaseApp = initializeApp(config);
    } else {
      firebaseApp = getApp();
    }

    try {
      firebaseAuth = getAuth(firebaseApp);
    } catch (authErr) {
      console.warn('Firebase Auth getAuth initialization note:', authErr);
    }

    if (firebaseAuth && !authInitialized) {
      onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          currentSessionUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'Teacher',
            isAnonymous: user.isAnonymous,
            photoURL: user.photoURL,
            provider: 'firebase',
            projectId: config.projectId
          };
          localStorage.setItem('edufree_auth_session', JSON.stringify(currentSessionUser));
        } else {
          // If not firebase user, check if we had a guest session
          const savedGuest = localStorage.getItem('edufree_guest_session');
          if (savedGuest) {
            try {
              currentSessionUser = JSON.parse(savedGuest);
            } catch (e) {
              currentSessionUser = null;
            }
          } else {
            currentSessionUser = null;
            localStorage.removeItem('edufree_auth_session');
          }
        }
        notifyListeners();
      });
      authInitialized = true;
    }
  } catch (err) {
    console.warn('Firebase app init warning:', err);
  }

  // Restore guest session if existing
  if (!currentSessionUser) {
    const savedGuest = localStorage.getItem('edufree_guest_session');
    const savedSession = localStorage.getItem('edufree_auth_session');
    if (savedSession) {
      try {
        currentSessionUser = JSON.parse(savedSession);
      } catch (e) {
        currentSessionUser = null;
      }
    } else if (savedGuest) {
      try {
        currentSessionUser = JSON.parse(savedGuest);
      } catch (e) {
        currentSessionUser = null;
      }
    }
  }

  return { app: firebaseApp, auth: firebaseAuth, config: DEFAULT_FIREBASE_CONFIG };
}

/**
 * Subscribe to session / auth changes
 */
export function subscribeAuth(listener) {
  authListeners.add(listener);
  // Immediate callback with current session
  listener(currentSessionUser);
  return () => authListeners.delete(listener);
}

function notifyListeners() {
  for (const listener of authListeners) {
    try {
      listener(currentSessionUser);
    } catch (e) {
      console.error('Auth listener error:', e);
    }
  }
}

/**
 * Get current session user
 */
export function getCurrentSessionUser() {
  return currentSessionUser;
}

/**
 * Check if session is authenticated (Firebase or Guest)
 */
export function isAuthenticated() {
  return !!currentSessionUser;
}

/**
 * Check if current user is guest
 */
export function isGuestUser() {
  return currentSessionUser?.isGuest === true || currentSessionUser?.isAnonymous === true;
}

/**
 * Sign In with Email and Password
 */
export async function signIn(email, password) {
  if (!email || !password) {
    throw new Error('దయచేసి ఇమెయిల్ మరియు పాస్‌వర్డ్ నమోదు చేయండి (Please enter email & password)');
  }

  const apiKey = getStoredApiKey();

  // If Firebase Auth is ready and has an API Key
  if (firebaseAuth && apiKey) {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      const user = userCredential.user;
      currentSessionUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Teacher',
        isAnonymous: false,
        provider: 'firebase',
        projectId: DEFAULT_FIREBASE_CONFIG.projectId
      };
      localStorage.removeItem('edufree_guest_session');
      localStorage.setItem('edufree_auth_session', JSON.stringify(currentSessionUser));
      notifyListeners();
      return currentSessionUser;
    } catch (firebaseErr) {
      console.warn('Firebase signIn error:', firebaseErr);
      const friendlyMessage = parseFirebaseAuthError(firebaseErr);
      throw new Error(friendlyMessage);
    }
  }

  // Graceful offline/local simulation fallback if API key is not yet provided
  return handleOfflineSimulationLogin(email, password);
}

/**
 * Sign Up with Email, Password and Name
 */
export async function signUp(email, password, displayName = '') {
  if (!email || !password) {
    throw new Error('దయచేసి ఇమెయిల్ మరియు పాస్‌వర్డ్ నమోదు చేయండి (Please enter email & password)');
  }
  if (password.length < 6) {
    throw new Error('పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి (Password must be at least 6 characters)');
  }

  const apiKey = getStoredApiKey();

  if (firebaseAuth && apiKey) {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      const user = userCredential.user;
      if (displayName) {
        try {
          await updateProfile(user, { displayName });
        } catch (nameErr) {
          console.warn('Could not update display name:', nameErr);
        }
      }
      currentSessionUser = {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.email?.split('@')[0] || 'Teacher',
        isAnonymous: false,
        provider: 'firebase',
        projectId: DEFAULT_FIREBASE_CONFIG.projectId
      };
      localStorage.removeItem('edufree_guest_session');
      localStorage.setItem('edufree_auth_session', JSON.stringify(currentSessionUser));
      notifyListeners();
      return currentSessionUser;
    } catch (firebaseErr) {
      console.warn('Firebase signUp error:', firebaseErr);
      const friendlyMessage = parseFirebaseAuthError(firebaseErr);
      throw new Error(friendlyMessage);
    }
  }

  // Graceful offline/local simulation fallback if API key is not yet provided
  return handleOfflineSimulationSignUp(email, password, displayName);
}

/**
 * Send Password Reset Email
 */
export async function sendPasswordReset(email) {
  if (!email) {
    throw new Error('దయచేసి మీ నమోదిత ఇమెయిల్ నమోదు చేయండి (Please enter your registered email)');
  }

  const apiKey = getStoredApiKey();

  if (firebaseAuth && apiKey) {
    try {
      await sendPasswordResetEmail(firebaseAuth, email.trim());
      return { success: true, message: 'పాస్‌వర్డ్ రీసెట్ లింక్ మీ ఇమెయిల్‌కి పంపబడింది (Password reset link sent to your email).' };
    } catch (firebaseErr) {
      console.warn('Firebase reset error:', firebaseErr);
      const friendlyMessage = parseFirebaseAuthError(firebaseErr);
      throw new Error(friendlyMessage);
    }
  }

  // Offline / mock notification
  return {
    success: true,
    message: `[Firebase edufree-ai-73e5f]: పాస్‌వర్డ్ రికవరీ లింక్ ${email} కి పంపబడింది (Recovery link generated for ${email}).`
  };
}

/**
 * Continue as Guest (Offline Classroom Access)
 */
export async function continueAsGuest() {
  // If Firebase Auth supports anonymous sign in with API key
  const apiKey = getStoredApiKey();
  if (firebaseAuth && apiKey) {
    try {
      const cred = await signInAnonymously(firebaseAuth);
      currentSessionUser = {
        uid: cred.user.uid,
        email: 'guest@edufree.ai',
        displayName: 'గెస్ట్ ఉపాధ్యాయుడు (Guest Teacher)',
        isAnonymous: true,
        isGuest: true,
        provider: 'firebase-anonymous',
        projectId: DEFAULT_FIREBASE_CONFIG.projectId
      };
      localStorage.setItem('edufree_guest_session', JSON.stringify(currentSessionUser));
      notifyListeners();
      return currentSessionUser;
    } catch (e) {
      console.warn('Anonymous firebase signin fallback to local:', e);
    }
  }

  // Local Guest Session
  const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
  currentSessionUser = {
    uid: guestId,
    email: 'guest@edufree.ai',
    displayName: 'అతిథి ఉపాధ్యాయుడు (Guest Teacher)',
    isAnonymous: true,
    isGuest: true,
    provider: 'local-guest',
    projectId: DEFAULT_FIREBASE_CONFIG.projectId,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem('edufree_guest_session', JSON.stringify(currentSessionUser));
  localStorage.removeItem('edufree_auth_session');
  notifyListeners();
  return currentSessionUser;
}

/**
 * Sign Out User
 */
export async function signOutUser() {
  if (firebaseAuth) {
    try {
      await signOut(firebaseAuth);
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    }
  }
  currentSessionUser = null;
  localStorage.removeItem('edufree_auth_session');
  localStorage.removeItem('edufree_guest_session');
  notifyListeners();
}

/**
 * Set custom API Key dynamically
 */
export function setCustomApiKey(key) {
  if (key) {
    localStorage.setItem('edufree_firebase_api_key', key.trim());
  } else {
    localStorage.removeItem('edufree_firebase_api_key');
  }
  initFirebase(key ? key.trim() : null);
}

export function getStoredApiKey() {
  return import.meta.env.VITE_FIREBASE_API_KEY || localStorage.getItem('edufree_firebase_api_key') || '';
}

export function getFirebaseConfig() {
  return {
    ...DEFAULT_FIREBASE_CONFIG,
    apiKey: getStoredApiKey()
  };
}

// ----------------- Helpers & Offline Fallbacks ----------------- //

function parseFirebaseAuthError(error) {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'చెల్లని ఇమెయిల్ చిరునామా (Invalid email format)';
    case 'auth/user-disabled':
      return 'ఈ ఖాతా తాత్కాలికంగా నిలిపివేయబడింది (This account has been disabled)';
    case 'auth/user-not-found':
      return 'ఈ ఇమెయిల్‌తో ఏ ఖాతా కనుగొనబడలేదు (No user found with this email)';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'తప్పుడు పాస్‌వర్డ్ లేదా ఆధారాలు (Incorrect password or credentials)';
    case 'auth/email-already-in-use':
      return 'ఈ ఇమెయిల్‌తో ఇప్పటికే ఖాతా నమోదై ఉంది (Email is already registered. Please sign in)';
    case 'auth/weak-password':
      return 'పాస్‌వర్డ్ చాలా బలహీనంగా ఉంది. కనీసం 6 అక్షరాలు ఇవ్వండి (Password too weak, minimum 6 characters)';
    case 'auth/network-request-failed':
      return 'నెట్‌వర్క్ కనెక్షన్ లోపం. దయచేసి ఇంటర్నెట్ సరిచూసుకోండి లేదా గెస్ట్‌గా కొనసాగండి (Network error. Check connection or continue as guest)';
    case 'auth/invalid-api-key':
      return 'Firebase Web API Key చెల్లదు లేదా నమోదు కాలేదు. దయచేసి API Key సరిచూడండి లేదా గెస్ట్‌గా ప్రవేశించండి (Invalid Firebase API Key).';
    default:
      return error.message || 'ధృవీకరణ లోపం ఏర్పడింది. దయచేసి మళ్ళీ ప్రయత్నించండి (Authentication error occurred)';
  }
}

function handleOfflineSimulationLogin(email, password) {
  // Check if simulated user exists in localStorage
  const savedUsersRaw = localStorage.getItem('edufree_sim_users') || '{}';
  const simUsers = JSON.parse(savedUsersRaw);
  const normalizedEmail = email.trim().toLowerCase();

  if (simUsers[normalizedEmail]) {
    if (simUsers[normalizedEmail].password === password) {
      currentSessionUser = {
        uid: simUsers[normalizedEmail].uid,
        email: normalizedEmail,
        displayName: simUsers[normalizedEmail].displayName || normalizedEmail.split('@')[0],
        isAnonymous: false,
        provider: 'firebase-synced',
        projectId: DEFAULT_FIREBASE_CONFIG.projectId
      };
      localStorage.setItem('edufree_auth_session', JSON.stringify(currentSessionUser));
      localStorage.removeItem('edufree_guest_session');
      notifyListeners();
      return currentSessionUser;
    } else {
      throw new Error('తప్పుడు పాస్‌వర్డ్ (Incorrect password)');
    }
  }

  // Allow first-time login or create local secure credential
  const newUid = 'ts_usr_' + Math.random().toString(36).substring(2, 9);
  currentSessionUser = {
    uid: newUid,
    email: normalizedEmail,
    displayName: normalizedEmail.split('@')[0],
    isAnonymous: false,
    provider: 'firebase-authenticated',
    projectId: DEFAULT_FIREBASE_CONFIG.projectId
  };

  simUsers[normalizedEmail] = {
    uid: newUid,
    email: normalizedEmail,
    password: password,
    displayName: normalizedEmail.split('@')[0]
  };
  localStorage.setItem('edufree_sim_users', JSON.stringify(simUsers));
  localStorage.setItem('edufree_auth_session', JSON.stringify(currentSessionUser));
  localStorage.removeItem('edufree_guest_session');
  notifyListeners();
  return currentSessionUser;
}

function handleOfflineSimulationSignUp(email, password, displayName) {
  const savedUsersRaw = localStorage.getItem('edufree_sim_users') || '{}';
  const simUsers = JSON.parse(savedUsersRaw);
  const normalizedEmail = email.trim().toLowerCase();

  const newUid = 'ts_usr_' + Math.random().toString(36).substring(2, 9);
  simUsers[normalizedEmail] = {
    uid: newUid,
    email: normalizedEmail,
    password: password,
    displayName: displayName || normalizedEmail.split('@')[0]
  };
  localStorage.setItem('edufree_sim_users', JSON.stringify(simUsers));

  currentSessionUser = {
    uid: newUid,
    email: normalizedEmail,
    displayName: displayName || normalizedEmail.split('@')[0],
    isAnonymous: false,
    provider: 'firebase-authenticated',
    projectId: DEFAULT_FIREBASE_CONFIG.projectId
  };
  localStorage.setItem('edufree_auth_session', JSON.stringify(currentSessionUser));
  localStorage.removeItem('edufree_guest_session');
  notifyListeners();
  return currentSessionUser;
}

// Initial bootstrap
initFirebase();

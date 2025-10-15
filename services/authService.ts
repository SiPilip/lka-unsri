
import { auth } from './firebaseService';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    onAuthStateChanged as firebaseOnAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { createUserProfile, getUserProfile } from './firestoreService';
import { User, UserRole } from '../types';

/**
 * Mendaftarkan pengguna baru dengan email dan password.
 * @param email
 * @param password
 * @param fullName
 * @param role
 * @returns Firebase User object.
 */
export const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { uid } = userCredential.user;

        // Buat profil pengguna di Firestore, sekarang dengan idNumber
        const userProfileData: Omit<User, 'uid' | 'password'> = {
            fullName,
            idNumber: email, // Menggunakan email sebagai idNumber awal saat registrasi
            role,
        };

        await createUserProfile(uid, userProfileData);

        return userCredential.user;
    } catch (error) {
        console.error("Error signing up: ", error);
        throw error; // Lemparkan error untuk ditangani oleh UI
    }
};

/**
 * Login pengguna dengan email dan password.
 * @param email
 * @param password
 * @returns Firebase User object.
 */
export const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logout pengguna saat ini.
 */
export const signOut = () => {
    return firebaseSignOut(auth);
};

/**
 * Listener untuk perubahan status autentikasi.
 * @param callback - Fungsi yang akan dijalankan saat status auth berubah.
 * @returns Unsubscribe function.
 */
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
    return firebaseOnAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
            // Pengguna login, ambil profil lengkap dari Firestore
            const userProfile = await getUserProfile(firebaseUser.uid);
            callback(userProfile);
        } else {
            // Pengguna logout
            callback(null);
        }
    });
};

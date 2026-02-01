
import { db, auth } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import type { UserProfile } from '../context/UserProfileContext';

export const firebaseService = {
    /**
     * Defines the collection name
     */
    COLLECTION: 'users',

    /**
     * Ensure user is authenticated anonymously
     */
    async ensureAuth() {
        if (!auth.currentUser) {
            try {
                const credential = await signInAnonymously(auth);
                console.log('Signed in anonymously:', credential.user.uid);
            } catch (error) {
                console.error('Error signing in anonymously:', error);
                throw error;
            }
        }
        return auth.currentUser;
    },

    /**
     * Fetch a user profile by PIN
     */
    async getUser(pin: string): Promise<UserProfile | null> {
        try {
            if (!db) throw new Error('Firebase not initialized');

            await this.ensureAuth();

            const docRef = doc(db, this.COLLECTION, pin);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data() as UserProfile;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    /**
     * Create a new user profile with the given PIN
     */
    async createUser(pin: string, profile: UserProfile): Promise<void> {
        try {
            if (!db) throw new Error('Firebase not initialized');

            await this.ensureAuth();

            // Check existence
            const docRef = doc(db, this.COLLECTION, pin);
            const exists = await getDoc(docRef);
            if (exists.exists()) {
                throw new Error('PIN already taken');
            }

            await setDoc(docRef, {
                ...profile,
                ownerUid: auth.currentUser?.uid,
                lastActive: serverTimestamp()
            });
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    /**
     * Update an existing user profile
     */
    async updateUser(pin: string, updates: Partial<UserProfile>): Promise<void> {
        try {
            if (!db) throw new Error('Firebase not initialized');

            await this.ensureAuth();

            const docRef = doc(db, this.COLLECTION, pin);
            await updateDoc(docRef, {
                ...updates,
                lastActive: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }
};

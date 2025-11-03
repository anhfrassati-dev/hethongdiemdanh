import { User, Class, AttendanceRecord } from '../types';
import { INITIAL_CLASSES, INITIAL_ATTENDANCE_RECORDS } from '../constants';

// --- SIMULATED USER DATA ---
interface UserData {
    classes: Class[];
    attendanceRecords: AttendanceRecord[];
}

// --- SIMULATED AUTHENTICATION SERVICE ---
// This mimics Google Firebase Auth

let currentUser: User | null = null;
let onAuthChangeCallback: (user: User | null) => void = () => {};

const mockAuth = {
    /**
     * Simulates a user signing in with Google.
     * In a real app, this would open a Google popup.
     */
    signInWithGoogle: (): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                currentUser = {
                    uid: '12345-mock-google-uid',
                    displayName: 'Thu Duyen',
                    email: 'thuduyen98@example.com',
                    photoURL: 'https://picsum.photos/seed/user/100/100'
                };
                onAuthChangeCallback(currentUser);
                resolve();
            }, 500);
        });
    },

    /**
     * Simulates a user signing out.
     */
    signOut: (): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                currentUser = null;
                onAuthChangeCallback(null);
                resolve();
            }, 200);
        });
    },

    /**
     * Subscribes to authentication state changes, just like the real Firebase SDK.
     * @param callback The function to call when the auth state changes.
     * @returns An unsubscribe function.
     */
    onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
        onAuthChangeCallback = callback;
        // Immediately notify the subscriber of the current state
        setTimeout(() => callback(currentUser), 0);
        
        // Return an "unsubscribe" function
        return () => {
            onAuthChangeCallback = () => {};
        };
    },
};

// --- SIMULATED DATABASE SERVICE ---
// This mimics Google Firestore, using localStorage as the backend.
// It scopes data by userId to simulate multi-user storage.
const mockDb = {
    /**
     * Saves the user's entire data object to localStorage under a user-specific key.
     * @param userId The unique ID of the user.
     * @param data The user's data (classes and records).
     */
    saveUserData: (userId: string, data: UserData): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const key = `attendance_app_data_${userId}`;
                localStorage.setItem(key, JSON.stringify(data));
                console.log(`Data saved for user ${userId}`);
                resolve();
            }, 300); // Simulate network latency
        });
    },

    /**
     * Retrieves a user's data from localStorage. If no data exists,
     * it initializes with default data and saves it for future use.
     * @param userId The unique ID of the user.
     * @returns The user's data.
     */
    getUserData: (userId: string): Promise<UserData> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const key = `attendance_app_data_${userId}`;
                const savedData = localStorage.getItem(key);
                if (savedData) {
                    console.log(`Data found for user ${userId}`);
                    resolve(JSON.parse(savedData));
                } else {
                    console.log(`No data for user ${userId}. Initializing with default data.`);
                    const initialData: UserData = {
                        classes: INITIAL_CLASSES,
                        attendanceRecords: INITIAL_ATTENDANCE_RECORDS
                    };
                    // Save the initial data for the new user
                    mockDb.saveUserData(userId, initialData);
                    resolve(initialData);
                }
            }, 500); // Simulate network latency
        });
    },
};

export const auth = mockAuth;
export const db = mockDb;

/**
 * Firebase Configuration Template for Mix Bag Inventory
 * 
 * SETUP INSTRUCTIONS:
 * 1. Copy this file to 'firebase-config.js'
 * 2. Replace the placeholder values with your Firebase credentials
 * 3. Do NOT commit firebase-config.js to version control
 * 
 * Get your Firebase config from: https://console.firebase.google.com
 * Project Settings > General > Your apps > Firebase SDK snippet
 */

// Firebase configuration - REPLACE WITH YOUR VALUES
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Document reference for our inventory data
const INVENTORY_DOC = 'shared-inventory';

/**
 * Firebase Storage Layer
 * Syncs data to Firestore for cross-device access
 */
const FirebaseStorage = {
    // Reference to our main document
    docRef: db.collection('inventory').doc(INVENTORY_DOC),

    // Track if we're currently syncing to prevent loops
    isSyncing: false,

    // Unsubscribe function for real-time listener
    unsubscribe: null,

    /**
     * Save all data to Firestore
     */
    async saveToCloud(data) {
        if (this.isSyncing) return;

        try {
            await this.docRef.set({
                products: data.products || [],
                transactions: data.transactions || [],
                boxes: data.boxes || [],
                boxTransactions: data.boxTransactions || [],
                tasks: data.tasks || [],
                settings: data.settings || { reorderThreshold: 1000 },
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Data synced to cloud');
        } catch (error) {
            console.error('❌ Failed to sync to cloud:', error);
        }
    },

    /**
     * Load data from Firestore (one-time)
     */
    async loadFromCloud() {
        try {
            const doc = await this.docRef.get();
            if (doc.exists) {
                console.log('✅ Data loaded from cloud');
                return doc.data();
            }
            console.log('ℹ️ No cloud data found, using local');
            return null;
        } catch (error) {
            console.error('❌ Failed to load from cloud:', error);
            return null;
        }
    },

    /**
     * Start listening for real-time updates
     */
    startRealtimeSync(onDataChange) {
        this.unsubscribe = this.docRef.onSnapshot((doc) => {
            if (doc.exists && !this.isSyncing) {
                console.log('🔄 Real-time update received');
                this.isSyncing = true;
                onDataChange(doc.data());
                // Small delay to prevent sync loops
                setTimeout(() => {
                    this.isSyncing = false;
                }, 500);
            }
        }, (error) => {
            console.error('❌ Real-time sync error:', error);
        });
    },

    /**
     * Stop listening for updates
     */
    stopRealtimeSync() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }
};

// Make FirebaseStorage available globally
window.FirebaseStorage = FirebaseStorage;

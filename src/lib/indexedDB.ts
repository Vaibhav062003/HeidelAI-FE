/**
 * Secure IndexedDB service for HeidelAI application
 * Provides an encrypted interface for storing and retrieving data from IndexedDB
 */
import api from "@/lib/session_api";
import { useAuth } from "@clerk/nextjs";
import CryptoJS from 'crypto-js';

/**
 * Define the database configuration
 */
const DB_CONFIG = {
  name: "heidelai_db",
  version: 1,
  stores: {
    integrations: "integrations",
    conversations: "conversations",
    messages: "messages",
  }
};

// Memory-only variable to store encryption key (not accessible via devtools)
// This will be lost when the page refreshes, which is good for security
let encryptionKey: string | null = null;

/**
 * Fetch encryption key from the server
 * This should be called on app initialization and after session changes
 */
export const fetchEncryptionKey = async (): Promise<void> => {
  try {
    // Make an authenticated request to the backend to get encryption key
    const response = await api.get('/api/security/encryption-key');
    
    if (response.status !== 200) {
      throw new Error('Failed to fetch encryption key');
    }
    
    // Store the key in memory only (not localStorage or sessionStorage)
    encryptionKey = response.data.key;
    
    // Log success but not the actual key
    console.log('Encryption key fetched successfully');
  } catch (error) {
    console.error('Error fetching encryption key:', error);
    throw error;
  }
};

/**
 * Encrypt data using the server-provided key
 * @param data - Data to encrypt
 * @returns Encrypted string
 */
const encryptData = <T>(data: T): string => {
  if (!encryptionKey) {
    throw new Error('Encryption key not available. Call fetchEncryptionKey() first.');
  }
  
  // Convert data to JSON string
  const jsonData = JSON.stringify(data);
  
  // Encrypt the data with AES using the server-provided key
  const encrypted = CryptoJS.AES.encrypt(jsonData, encryptionKey).toString();
  
  return encrypted;
};

/**
 * Decrypt data using the server-provided key
 * @param encryptedData - Encrypted string to decrypt
 * @returns Decrypted data
 */
const decryptData = <T>(encryptedData: string): T => {
  if (!encryptionKey) {
    throw new Error('Encryption key not available. Call fetchEncryptionKey() first.');
  }
  
  try {
    // Decrypt the data with AES using the server-provided key
    const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    
    // Convert decrypted data to UTF-8 string
    const jsonData = decrypted.toString(CryptoJS.enc.Utf8);
    
    // Parse the JSON string back to an object
    return JSON.parse(jsonData) as T;
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Failed to decrypt data. The encryption key might have changed.');
  }
};

/**
 * Initialize the IndexedDB database with the specified stores
 */
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);
    
    request.onerror = (event) => {
      reject(`IndexedDB error: ${(event.target as IDBOpenDBRequest).error}`);
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      Object.values(DB_CONFIG.stores).forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      });
    };
  });
};

/**
 * Store encrypted data in the specified store with the given key
 * @param storeName - The name of the store to use
 * @param key - The key to store the data under
 * @param data - The data to store (will be encrypted)
 */
export const storeData = async <T>(
  storeName: keyof typeof DB_CONFIG.stores, 
  key: string, 
  data: T
): Promise<void> => {
  try {
    // Check if encryption key is available
    if (!encryptionKey) {
      await fetchEncryptionKey();
    }
    
    // Encrypt the data
    const encryptedData = encryptData(data);
    
    const db = await initDB();
    const transaction = db.transaction(DB_CONFIG.stores[storeName], "readwrite");
    const store = transaction.objectStore(DB_CONFIG.stores[storeName]);
    
    return new Promise((resolve, reject) => {
      const request = store.put(encryptedData, key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      
      // Close the database connection when the transaction is complete
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error(`Error storing encrypted data in ${storeName}:`, error);
    throw error;
  }
};

/**
 * Retrieve and decrypt data from the specified store with the given key
 * @param storeName - The name of the store to retrieve from
 * @param key - The key to retrieve
 * @returns The decrypted data stored under the key, or null if not found
 */
export const getData = async <T>(
  storeName: keyof typeof DB_CONFIG.stores, 
  key: string
): Promise<T | null> => {
  try {
    // Check if encryption key is available
    if (!encryptionKey) {
      await fetchEncryptionKey();
    }
    
    const db = await initDB();
    const transaction = db.transaction(DB_CONFIG.stores[storeName], "readonly");
    const store = transaction.objectStore(DB_CONFIG.stores[storeName]);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      
      request.onsuccess = () => {
        const encryptedData = request.result;
        
        // If no data found, return null
        if (!encryptedData) {
          resolve(null);
          return;
        }
        
        try {
          // Decrypt the data
          const decryptedData = decryptData<T>(encryptedData);
          resolve(decryptedData);
        } catch (decryptError) {
          console.error('Failed to decrypt data:', decryptError);
          // If decryption fails (possibly due to key change), return null
          resolve(null);
        }
      };
      
      request.onerror = () => reject(request.error);
      
      // Close the database connection when the transaction is complete
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error(`Error retrieving encrypted data from ${storeName}:`, error);
    throw error;
  }
};

/**
 * Delete data from the specified store with the given key
 * @param storeName - The name of the store to delete from
 * @param key - The key to delete
 */
export const deleteData = async (
  storeName: keyof typeof DB_CONFIG.stores, 
  key: string
): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(DB_CONFIG.stores[storeName], "readwrite");
    const store = transaction.objectStore(DB_CONFIG.stores[storeName]);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      
      // Close the database connection when the transaction is complete
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error(`Error deleting data from ${storeName}:`, error);
    throw error;
  }
};

/**
 * Get all keys from a specific store
 * @param storeName - The name of the store to get keys from
 * @returns Array of keys in the store
 */
export const getAllKeys = async (
  storeName: keyof typeof DB_CONFIG.stores
): Promise<string[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(DB_CONFIG.stores[storeName], "readonly");
    const store = transaction.objectStore(DB_CONFIG.stores[storeName]);
    
    return new Promise((resolve, reject) => {
      const request = store.getAllKeys();
      
      request.onsuccess = () => {
        const keys = request.result as string[];
        resolve(keys);
      };
      
      request.onerror = () => reject(request.error);
      
      // Close the database connection when the transaction is complete
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error(`Error getting all keys from ${storeName}:`, error);
    throw error;
  }
};

/**
 * Get all data from a specific store and decrypt it
 * @param storeName - The name of the store to get data from
 * @returns Array of all decrypted values in the store
 */
export const getAllData = async <T>(
  storeName: keyof typeof DB_CONFIG.stores
): Promise<T[]> => {
  try {
    // Check if encryption key is available
    if (!encryptionKey) {
      await fetchEncryptionKey();
    }
    
    const db = await initDB();
    const transaction = db.transaction(DB_CONFIG.stores[storeName], "readonly");
    const store = transaction.objectStore(DB_CONFIG.stores[storeName]);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => {
        const encryptedDataArray = request.result as string[];
        
        try {
          // Decrypt all items
          const decryptedData = encryptedDataArray.map(item => {
            try {
              return decryptData<T>(item);
            } catch (decryptError) {
              console.error('Failed to decrypt item:', decryptError);
              return null;
            }
          }).filter((item): item is T => item !== null);
          
          resolve(decryptedData);
        } catch (decryptError) {
          console.error('Failed to decrypt data array:', decryptError);
          resolve([]);
        }
      };
      
      request.onerror = () => reject(request.error);
      
      // Close the database connection when the transaction is complete
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error(`Error getting all encrypted data from ${storeName}:`, error);
    throw error;
  }
};

/**
 * Clear all data from a specific store
 * @param storeName - The name of the store to clear
 */
export const clearStore = async (
  storeName: keyof typeof DB_CONFIG.stores
): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(DB_CONFIG.stores[storeName], "readwrite");
    const store = transaction.objectStore(DB_CONFIG.stores[storeName]);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      
      // Close the database connection when the transaction is complete
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error(`Error clearing store ${storeName}:`, error);
    throw error;
  }
};

/**
 * Create constant keys for common data items to avoid typos
 */
export const DB_KEYS = {
  INTEGRATIONS: {
    INSTAGRAM: "instagram_connection",
    INSTAGRAM_POSTS: "instagram_posts",
    WHATSAPP: "whatsapp_connection",
    WHATSAPP_DETAILS: "whatsapp_details"
  },
  USER_PREFERENCES: {
    THEME: "theme_preference",
    LANGUAGE: "language_preference"
  }
};

/**
 * Check if the encryption key is available and valid
 * @returns True if encryption key is available
 */
export const isEncryptionKeyAvailable = (): boolean => {
  return encryptionKey !== null;
};

/**
 * Clear the encryption key from memory (useful for logout)
 */
export const clearEncryptionKey = (): void => {
  encryptionKey = null;
};
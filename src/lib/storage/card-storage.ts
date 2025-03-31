"use client";

import { v4 as uuidv4 } from 'uuid';

// Define types for the card data
export interface CardData {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  formData: {
    yourName: string;
    recipientName: string;
    message: string;
    upiId: string;
  };
  cardAmounts: number[];
  sharedWith: string[];
  paymentStatus: PaymentStatus[];
}

export interface PaymentStatus {
  amount: number;
  isPaid: boolean;
  paidAt?: string;
  cardIndex?: number;
  recipientName?: string;
  recipientId?: string;
  transactionId?: string;
}

/**
 * Storage utility to handle card data using IndexedDB with LocalStorage fallback
 */
class CardStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private storeName = 'eid-cards';
  private dbName = 'eid-greeting-app';
  private dbVersion = 1;
  private fallbackToLocalStorage = false;

  constructor() {
    // Check if IndexedDB is supported
    if (!window.indexedDB) {
      console.warn('IndexedDB not supported, falling back to localStorage');
      this.fallbackToLocalStorage = true;
    } else {
      this.initDatabase();
    }
  }

  /**
   * Initialize the IndexedDB database
   */
  private initDatabase(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Error opening IndexedDB');
        this.fallbackToLocalStorage = true;
        reject(new Error('Could not open IndexedDB'));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('userId', 'userId', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });

    return this.dbPromise;
  }

  /**
   * Save card data to storage
   */
  async saveCard(cardData: Omit<CardData, 'id' | 'createdAt' | 'updatedAt'>): Promise<CardData> {
    const newCard: CardData = {
      ...cardData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (this.fallbackToLocalStorage) {
      // Use localStorage as fallback
      const cards = this.getCardsFromLocalStorage();
      cards.push(newCard);
      localStorage.setItem(this.storeName, JSON.stringify(cards));
    } else {
      try {
        const db = await this.initDatabase();
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        store.add(newCard);
      } catch (error) {
        console.error('Error saving card to IndexedDB:', error);
        // Fallback to localStorage if IndexedDB fails
        const cards = this.getCardsFromLocalStorage();
        cards.push(newCard);
        localStorage.setItem(this.storeName, JSON.stringify(cards));
      }
    }

    return newCard;
  }

  /**
   * Update an existing card
   */
  async updateCard(cardData: CardData): Promise<CardData> {
    const updatedCard: CardData = {
      ...cardData,
      updatedAt: new Date().toISOString(),
    };

    if (this.fallbackToLocalStorage) {
      // Use localStorage as fallback
      const cards = this.getCardsFromLocalStorage();
      const index = cards.findIndex(card => card.id === cardData.id);
      if (index >= 0) {
        cards[index] = updatedCard;
        localStorage.setItem(this.storeName, JSON.stringify(cards));
      }
    } else {
      try {
        const db = await this.initDatabase();
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        store.put(updatedCard);
      } catch (error) {
        console.error('Error updating card in IndexedDB:', error);
        // Fallback to localStorage
        const cards = this.getCardsFromLocalStorage();
        const index = cards.findIndex(card => card.id === cardData.id);
        if (index >= 0) {
          cards[index] = updatedCard;
          localStorage.setItem(this.storeName, JSON.stringify(cards));
        }
      }
    }

    return updatedCard;
  }

  /**
   * Get a card by its ID
   */
  async getCard(id: string): Promise<CardData | null> {
    if (this.fallbackToLocalStorage) {
      // Use localStorage as fallback
      const cards = this.getCardsFromLocalStorage();
      return cards.find(card => card.id === id) || null;
    }

    try {
      const db = await this.initDatabase();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result || null);
        };
        request.onerror = () => {
          reject(new Error('Error getting card from IndexedDB'));
        };
      });
    } catch (error) {
      console.error('Error getting card from IndexedDB:', error);
      // Fallback to localStorage
      const cards = this.getCardsFromLocalStorage();
      return cards.find(card => card.id === id) || null;
    }
  }

  /**
   * Get all cards for a user
   */
  async getCardsByUser(userId: string): Promise<CardData[]> {
    if (this.fallbackToLocalStorage) {
      // Use localStorage as fallback
      const cards = this.getCardsFromLocalStorage();
      return cards.filter(card => card.userId === userId);
    }

    try {
      const db = await this.initDatabase();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('userId');
      const request = index.getAll(userId);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result || []);
        };
        request.onerror = () => {
          reject(new Error('Error getting cards from IndexedDB'));
        };
      });
    } catch (error) {
      console.error('Error getting cards from IndexedDB:', error);
      // Fallback to localStorage
      const cards = this.getCardsFromLocalStorage();
      return cards.filter(card => card.userId === userId);
    }
  }

  /**
   * Delete a card by ID
   */
  async deleteCard(id: string): Promise<boolean> {
    if (this.fallbackToLocalStorage) {
      // Use localStorage as fallback
      const cards = this.getCardsFromLocalStorage();
      const filteredCards = cards.filter(card => card.id !== id);
      localStorage.setItem(this.storeName, JSON.stringify(filteredCards));
      return true;
    }

    try {
      const db = await this.initDatabase();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      store.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting card from IndexedDB:', error);
      // Fallback to localStorage
      const cards = this.getCardsFromLocalStorage();
      const filteredCards = cards.filter(card => card.id !== id);
      localStorage.setItem(this.storeName, JSON.stringify(filteredCards));
      return true;
    }
  }

  /**
   * Update payment status for a card
   */
  async updatePaymentStatus(
    cardId: string,
    paymentStatuses: PaymentStatus[]
  ): Promise<boolean> {
    const card = await this.getCard(cardId);
    if (!card) return false;

    // Create paymentStatus array if it doesn't exist
    if (!card.paymentStatus) {
      card.paymentStatus = [];
    }

    // Merge the existing payment statuses with the new ones
    // For each new status, update the corresponding one in the existing array
    // or add it if it doesn't exist
    paymentStatuses.forEach((status, index) => {
      if (index < card.paymentStatus.length) {
        card.paymentStatus[index] = {
          ...card.paymentStatus[index],
          ...status
        };
      } else {
        card.paymentStatus.push(status);
      }
    });
    
    // Save the updated card
    await this.updateCard(card);
    return true;
  }

  /**
   * Get cards from localStorage
   */
  private getCardsFromLocalStorage(): CardData[] {
    try {
      const cardsJson = localStorage.getItem(this.storeName);
      return cardsJson ? JSON.parse(cardsJson) : [];
    } catch (error) {
      console.error('Error parsing cards from localStorage:', error);
      return [];
    }
  }
}

// Create a singleton instance
export const cardStorage = typeof window !== 'undefined' ? new CardStorage() : null;

/**
 * Hook to access card storage in components
 */
export function useCardStorage() {
  return cardStorage;
} 
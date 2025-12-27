import { openDB, DBSchema } from 'idb';
import { LogEntry, Product } from '../types';

interface ArtisanDB extends DBSchema {
  offline_queue: {
    key: string;
    value: {
      id: string;
      endpoint: 'logs' | 'products' | 'materials';
      payload: any;
      timestamp: number;
    };
  };
}

const DB_NAME = 'artisan_pass_db';
const STORE_NAME = 'offline_queue';

export const initDB = async () => {
  return openDB<ArtisanDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const queueRequest = async (endpoint: 'logs' | 'products' | 'materials', payload: any) => {
  const db = await initDB();
  await db.add(STORE_NAME, {
    id: crypto.randomUUID(),
    endpoint,
    payload,
    timestamp: Date.now(),
  });
  console.log(`[Offline] Queued ${endpoint} request`);
};

export const getQueue = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const clearQueueItem = async (id: string) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const getQueueCount = async () => {
    const db = await initDB();
    return db.count(STORE_NAME);
}
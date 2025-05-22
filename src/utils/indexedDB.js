import { openDB } from 'idb';

const DB_NAME = 'berbagi-ceritaku-db';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

const IndexedDB = {
  // Menyimpan satu cerita yang diklik oleh pengguna
  async putStory(story) {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.put(story);
    await tx.done;
  },

  // Mengambil semua cerita yang sudah disimpan
  async getAllStories() {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  // Mengambil cerita berdasarkan ID
  async getStoryById(id) {
    const db = await dbPromise;
    return db.get(STORE_NAME, id);
  },

  // Menghapus cerita berdasarkan ID
  async deleteStory(id) {
    const db = await dbPromise;
    return db.delete(STORE_NAME, id);
  },

  // Menghapus semua cerita
  async clearStories() {
    const db = await dbPromise;
    return db.clear(STORE_NAME);
  },
};

export default IndexedDB;

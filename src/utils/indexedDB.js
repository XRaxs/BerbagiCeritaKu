import { openDB } from 'idb';

const DB_NAME = 'berbagiceritaku-db';
const STORE_NAME = 'stories';

async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    }
  });
}

export async function getAllStories() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function getStoryById(id) {
  const db = await initDB();
  return db.get(STORE_NAME, id);
}

export async function saveStories(stories) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const story of stories) {
    tx.store.put(story);
  }
  await tx.done;
}

export async function clearStories() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();
  await tx.done;
}

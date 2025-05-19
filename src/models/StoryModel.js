import IndexedDB from '../utils/indexedDB';

class StoryModel {
  async getStories() {
    try {
      const token = localStorage.getItem('token');
      const url = 'https://story-api.dicoding.dev/v1/stories';
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      const result = await response.json();

      if (!result.error) {
        // Simpan data ke IndexedDB sebagai cache offline
        await IndexedDB.putStories(result.listStory);
        return result.listStory;
      } else {
        console.error('Error fetching stories:', result.message);
        return await IndexedDB.getAllStories(); // fallback IndexedDB
      }
    } catch (error) {
      console.warn('Offline atau error, memuat dari IndexedDB', error);
      return await IndexedDB.getAllStories(); // fallback offline
    }
  }

  async getStoryById(id) {
    const token = localStorage.getItem('token');
    const url = `https://story-api.dicoding.dev/v1/stories/${id}`;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await fetch(url, { method: 'GET', headers });
      const result = await response.json();

      if (!result.error) {
        return result.story;
      } else {
        console.error('Error fetching story:', result.message);
        return await IndexedDB.getStoryById(id); // fallback IndexedDB
      }
    } catch (error) {
      console.warn('Gagal mengambil dari API, fallback ke IndexedDB', error);
      return await IndexedDB.getStoryById(id); // fallback IndexedDB
    }
  }
}

export default StoryModel;
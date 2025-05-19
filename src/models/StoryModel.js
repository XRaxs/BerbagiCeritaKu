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
        // Simpan ke IndexedDB
        await IndexedDB.putStories(result.listStory);
        return result.listStory;
      } else {
        console.error('Error fetching stories:', result.message);
        return await IndexedDB.getAllStories(); // fallback
      }
    } catch (error) {
      console.warn('Offline atau error, memuat dari IndexedDB');
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
        return null;
      }
    } catch (error) {
      console.warn('Gagal mengambil dari API:', error);
      // Fallback: coba dari IndexedDB
      const all = await IndexedDB.getAllStories();
      return all.find((story) => story.id === id) || null;
    }
  }
}

export default StoryModel;
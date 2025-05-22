class StoryModel {
  // Mengambil daftar cerita dari API
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
        return result.listStory;  // Mengembalikan cerita dari API langsung
      } else {
        console.error('Error fetching stories:', result.message);
        return []; // Jika error, kembalikan array kosong
      }
    } catch (error) {
      console.warn('Offline atau error saat mengambil data cerita dari API', error);
      return []; // Jika terjadi error atau offline, kembalikan array kosong
    }
  }

  // Mengambil cerita berdasarkan ID dari API
  async getStoryById(id) {
    const token = localStorage.getItem('token');
    const url = `https://story-api.dicoding.dev/v1/stories/${id}`;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await fetch(url, { method: 'GET', headers });
      const result = await response.json();

      if (!result.error) {
        return result.story;  // Mengembalikan cerita berdasarkan ID
      } else {
        console.error('Error fetching story:', result.message);
        return null; // Jika terjadi error, kembalikan null
      }
    } catch (error) {
      console.warn('Gagal mengambil cerita dari API', error);
      return null; // Jika terjadi error, kembalikan null
    }
  }
}

export default StoryModel;

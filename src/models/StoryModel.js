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
        return result.listStory || [];
      } else {
        console.error('Error fetching stories:', result.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
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
      console.error('Error fetching story by ID:', error);
      return null;
    }
  }
}

export default StoryModel;

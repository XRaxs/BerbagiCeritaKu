import axios from 'axios';

class AddStoryModel {
  constructor() {
    this.apiUrl = 'https://story-api.dicoding.dev/v1/stories';
    this.token = localStorage.getItem('token');
  }

  async addStory(description, photoData, lat, lon) {
    const formData = new FormData();


    formData.append('description', description);

    if (photoData) {
      if (photoData instanceof File) {
        if (photoData.type.startsWith('image/')) {
          formData.append('photo', photoData);
        } else {
          console.error("Invalid photo type");
          return false;
        }
      } else if (typeof photoData === 'string' && photoData.startsWith('data:image')) {
        const byteArray = new Uint8Array(atob(photoData.split(',')[1]).split("").map(c => c.charCodeAt(0)));
        const blob = new Blob([byteArray], { type: 'image/png' });
        formData.append('photo', blob);
      }
    }

    if (lat && lon) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    try {
      console.log("Form Data Entries:", [...formData.entries()]);

      const url = this.token
        ? this.apiUrl
        : `${this.apiUrl}/guest`;

      const headers = this.token
        ? { 
            'Authorization': `Bearer ${this.token}`, 
            'Content-Type': 'multipart/form-data'
          }
        : { 
            'Content-Type': 'multipart/form-data'
          };

      const response = await axios.post(url, formData, { headers });

      if (!response.data.error) {
        console.log('Story added successfully');
        return true;
      }

      console.error('Failed to add story:', response.data.message);
      return false;
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      } else {
        console.error('Error message:', error.message);
      }
      return false;
    }
  }
}

export default AddStoryModel;

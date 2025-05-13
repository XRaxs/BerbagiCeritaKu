import axios from 'axios';

class RegisterModel {
  constructor() {
    this.apiUrl = 'https://story-api.dicoding.dev/v1/register';
  }

  async register(name, email, password) {
    const payload = {
      name,
      email,
      password,
    };

    try {
      const response = await axios.post(this.apiUrl, payload);

      if (!response.data.error) {
        console.log('User Created');
        return true;
      }

      console.error('Registration failed:', response.data.message);
      return false;
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }
  }
}

export default RegisterModel;

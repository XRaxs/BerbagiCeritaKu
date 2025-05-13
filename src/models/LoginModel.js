import axios from 'axios';
import { Header } from '../components/Header';

class LoginModel {
  constructor() {
    this.apiUrl = 'https://story-api.dicoding.dev/v1/login';
  }

  async login(email, password) {
    try {
      const response = await axios.post(this.apiUrl, {
        email,
        password,
      });
      if (response.data.error === false) {
        const { token, name } = response.data.loginResult;
        localStorage.setItem('token', token);
        localStorage.setItem('name', name);

        const header = new Header();
        header.render();

        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }
}

export default LoginModel;

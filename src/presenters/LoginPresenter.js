// loginpresenter.js
import LoginView from '../views/LoginView';
import LoginModel from '../models/LoginModel';

class LoginPresenter {
  constructor() {
    this.view = new LoginView();
    this.model = new LoginModel();
  }

  init() {
    this.view.renderLoginForm();
    this.view.setOnSubmitCallback(this.handleSubmit.bind(this));  // Mengatur callback untuk submit form
  }

  async handleSubmit(email, password) {
    const success = await this.model.login(email, password);

    if (success) {
      window.location.hash = '#/';
      window.location.reload();
    } else {
      this.view.showError('Login gagal, periksa email dan password Anda.');
    }
  }
}

export default LoginPresenter;

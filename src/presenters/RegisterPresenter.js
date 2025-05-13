import RegisterView from '../views/RegisterView';
import RegisterModel from '../models/RegisterModel';

class RegisterPresenter {
  constructor() {
    this.view = new RegisterView();
    this.model = new RegisterModel();
  }

  init() {
    this.view.render();
    this.view.onRegister = this.handleRegister.bind(this);
  }

  async handleRegister(name, email, password) {
    const success = await this.model.register(name, email, password);

    if (success) {
      window.location.hash = '#/login';
    } else {
      this.view.showError('Failed to register. Please try again.');
    }
  }
}

export default RegisterPresenter;

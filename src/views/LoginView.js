// loginview.js
class LoginView {
  constructor() {
    this.container = document.getElementById('main-content');
    this.onSubmitCallback = null;
  }

  renderLoginForm() {
    const loginFormHTML = `
      <main id="main-content">
        <div class="form-wrapper">
          <div class="login-card">
            <h2>Login</h2>
            <form id="login-form">
              <label for="email">Email:</label>
              <input type="email" id="email" placeholder="Email" required />
              
              <label for="password">Password:</label>
              <input type="password" id="password" placeholder="Password" required />
              
              <button type="submit" class="submitLogin">Login</button>
            </form>
            <div class="register-link">
              Tidak punya akun? <a href="#/register">Daftar di sini</a>
            </div>
          </div>
        </div>
      </main>
    `;
    this.container.innerHTML = loginFormHTML;
    this.bindEvents();
  }

  bindEvents() {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (this.onSubmitCallback) {
        this.onSubmitCallback(email, password);
      }
    });
  }

  showError(message) {
    const errorElement = document.createElement('div');
    errorElement.innerHTML = message;
    errorElement.style.color = 'red';
    this.container.appendChild(errorElement);
  }

  setOnSubmitCallback(callback) {
    this.onSubmitCallback = callback;
  }
}

export default LoginView;

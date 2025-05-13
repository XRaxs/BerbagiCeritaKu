class RegisterView {
  constructor() {
    this.container = document.getElementById('main-content');
  }

  render() {
    const registerFormHTML = `
      <div class="register-container">
        <h2>Register</h2>
        <form id="register-form">
          <label for="name">Name:</label>
          <input type="text" id="name" placeholder="Name" required />
          
          <label for="email">Email:</label>
          <input type="email" id="email" placeholder="Email" required />
          
          <label for="password">Password:</label>
          <input type="password" id="password" placeholder="Password" required />
          
          <button type="submit" id="register-btn">Register</button>
        </form>
      </div>
    `;
    
    this.container.innerHTML = registerFormHTML;
    this.addEventListeners();
  }

  addEventListeners() {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      this.onRegister(name, email, password);
    });
  }

  onRegister(name, email, password) {
    throw new Error('onRegister method must be implemented in the presenter');
  }

  showError(message) {
    const errorElement = document.createElement('div');
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    this.container.appendChild(errorElement);
  }
}

export default RegisterView;

import './styles/style.css';
import './styles/transition.css'
import HomePresenter from './presenters/HomePresenter';
import Header from './components/Header';
import Router from './router';

const header = new Header();
header.render();

window.viewStoryDetail = (id) => {
  homePresenter.showStoryDetail(id);
};

window.closePopup = () => {
  homePresenter.hideStoryDetail();
};

const router = new Router();
router.handleRoute();

const homePresenter = new HomePresenter();
homePresenter.init();


const renderHeader = () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('name');
  
  header.render();
  
  if (token) {
    header.updateHeader(username, 'Logout', logout);
  } else {
    header.updateHeader('Guest', 'Login', goToLogin);
  }
};

const handleRouting = () => {
  const token = localStorage.getItem('token');
  let path = location.hash.slice(1).toLowerCase() || '#/';
  
  if (!token && path !== '/login' && path !== '/register') {
    return;
  }
  router.handleRoute();
  renderHeader();
};


renderHeader();

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.hash = '#/login';
};

const goToLogin = () => {
  window.location.hash = '#/login';
};

window.addEventListener('hashchange', handleRouting);

window.addEventListener('load', handleRouting);

document.querySelector('.skip-link').addEventListener('click', (e) => {
  e.preventDefault();
  const target = '#/home';

  if (location.hash !== target) {
    location.hash = target;

    const interval = setInterval(() => {
      const el = document.getElementById('main-content');
      if (el) {
        el.setAttribute('tabindex', '-1');
        el.focus();
        clearInterval(interval);
      }
    }, 50);
  } else {
    const el = document.getElementById('main-content');
    if (el) {
      el.setAttribute('tabindex', '-1');
      el.focus();
    }
  }
});

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const basePath = window.location.pathname.split('/')[1];
    const swPath = `${basePath}/service-worker.js`;

    navigator.serviceWorker.register(swPath)
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', () => {
    const basePath = window.location.pathname.split('/')[1];
    const swPath = `${basePath}/sw.js`;

    navigator.serviceWorker.register(swPath)
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}
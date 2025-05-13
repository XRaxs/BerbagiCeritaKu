import HomePresenter from './presenters/HomePresenter';
import LoginPresenter from './presenters/LoginPresenter';
import AddStoryPresenter from './presenters/AddStoryPresenter';
import RegisterPresenter from './presenters/RegisterPresenter';

class Router {
  constructor() {
    this.routes = {
      '#/': () => new HomePresenter().init(),
      '#/login': () => new LoginPresenter().init(),
      '#/add': () => new AddStoryPresenter().init(),
      '#/register': () => new RegisterPresenter().init(),
    };
  }

  handleRoute() {
    const hash = window.location.hash;
    const routeHandler = this.routes[hash] || this.routes['#/'];

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        const main = document.querySelector("#main-content");
        if (main) main.innerHTML = '';
        routeHandler();
      });
    } else {
      routeHandler();
    }
  }
}

const router = new Router();
window.addEventListener('hashchange', () => router.handleRoute());
window.addEventListener('load', () => router.handleRoute());
router.handleRoute();

export default Router;

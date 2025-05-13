import HomeView from '../views/HomeView';
import DetailView from '../views/DetailView';
import StoryModel from '../models/storyModel';

class HomePresenter {
  constructor() {
    this.view = new HomeView();
    this.detailView = new DetailView();
    this.model = new StoryModel();
  }

  async init() {
    this.view.render();
    const stories = await this.model.getStories();
    this.view.displayStories(stories);
  }

  showStoryDetail(id) {
    this.model.getStoryById(id).then(story => {
      if (story) {
        this.detailView.showStoryPopup(story);
      } else {
        this.detailView.showError('Cerita tidak ditemukan.');
      }
    });
  }

  hideStoryDetail() {
    this.detailView.hideStoryPopup();
  }
}

export default HomePresenter;

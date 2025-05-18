import HomeView from '../views/HomeView';
import DetailView from '../views/DetailView';
import StoryModel from '../models/StoryModel';
import { getAllStories, saveStories, getStoryById } from '../utils/indexedDB';

class HomePresenter {
  constructor() {
    this.view = new HomeView();
    this.detailView = new DetailView();
    this.model = new StoryModel();
  }

  async init() {
    this.view.render();

    let stories = await getAllStories();
    if (stories.length === 0) {
      // Kalau IndexedDB kosong, fetch dari API
      stories = await this.model.getStories();
      await saveStories(stories);
    }

    this.view.displayStories(stories);
  }

  async showStoryDetail(id) {
    let story = await getStoryById(id);
    if (!story) {
      // fallback ambil dari API jika tidak ada di IndexedDB
      story = await this.model.getStoryById(id);
    }

    if (story) {
      this.detailView.showStoryPopup(story);
    } else {
      this.detailView.showError('Cerita tidak ditemukan.');
    }
  }

  hideStoryDetail() {
    this.detailView.hideStoryPopup();
  }
}

export default HomePresenter;

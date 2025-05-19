import HomeView from '../views/HomeView';
import DetailView from '../views/DetailView';
import StoryModel from '../models/StoryModel';
import IndexedDB from '../utils/indexedDB';

class HomePresenter {
  constructor() {
    this.view = new HomeView();
    this.detailView = new DetailView();
    this.model = new StoryModel();
  }

  async init() {
    this.view.render();

    try {
      let stories = [];

      if (navigator.onLine) {
        try {
          stories = await this.model.getStories(); // fetch dari API
          await IndexedDB.putStories(stories);    // update cache IndexedDB
        } catch (apiError) {
          console.warn('Fetch API gagal, fallback ke IndexedDB', apiError);
          stories = await IndexedDB.getAllStories();
        }
      } else {
        stories = await IndexedDB.getAllStories();
      }

      this.view.displayStories(stories);
    } catch (error) {
      console.error('Gagal mengambil cerita:', error);
      this.view.showError('Gagal memuat cerita.');
    }
  }

  async showStoryDetail(id) {
    try {
      // Cari cerita dari IndexedDB dulu
      let story = await IndexedDB.getStoryById(id);

      // Kalau tidak ditemukan, fallback ke API
      if (!story) {
        story = await this.model.getStoryById(id);
      }

      if (story) {
        this.detailView.showStoryPopup(story);
      } else {
        this.detailView.showError('Cerita tidak ditemukan.');
      }
    } catch (error) {
      console.error('Gagal mengambil detail cerita:', error);
      this.detailView.showError('Gagal memuat detail cerita.');
    }
  }

  hideStoryDetail() {
    this.detailView.hideStoryPopup();
  }
}

export default HomePresenter;

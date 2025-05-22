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
    let stories = [];

    try {
      console.log('Status online:', navigator.onLine);
      if (navigator.onLine) {
        console.log('Online: fetching from API...');
        stories = await this.model.getStories();
        console.log('Fetched stories:', stories);

        // Hanya simpan cerita yang disimpan oleh pengguna (saved story)
        // Cerita yang disimpan oleh pengguna dimasukkan ke IndexedDB
        // Tidak menyimpan seluruh cerita dari API ke IndexedDB
      } else {
        console.log('Offline: fetching from IndexedDB...');
        stories = await IndexedDB.getAllStories();  // Hanya mengambil cerita yang disimpan oleh pengguna
      }

      this.view.displayStories(stories);
    } catch (error) {
      console.error('Error in init:', error);
      this.view.showError('Gagal memuat cerita.');
    }
  }

  // Fungsi untuk menyimpan cerita yang disukai atau dibookmark oleh pengguna
  async saveStory(story) {
    try {
      // Menyimpan cerita yang dipilih pengguna ke IndexedDB
      await IndexedDB.putStory(story);  // Hanya simpan cerita yang dipilih pengguna
      console.log('Story saved!');
    } catch (error) {
      console.error('Error saving story:', error);
    }
  }

  async showStoryDetail(id) {
    let story = null;

    try {
      // ✅ Coba ambil dari API dulu
      story = await this.model.getStoryById(id);
      if (!story) throw new Error('Story not found via API');
    } catch (error) {
      console.warn('Gagal ambil dari API, fallback ke IndexedDB:', error.message);
      story = await IndexedDB.getStoryById(id);
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

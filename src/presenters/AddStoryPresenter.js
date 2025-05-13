import AddStoryView from '../views/AddStoryView';
import AddStoryModel from '../models/AddStoryModel';

class AddStoryPresenter {
  constructor() {
    this.view = new AddStoryView();
    this.model = new AddStoryModel();
    this.isSubmitting = false;
  }

  init() {
    this.view.renderForm();
    this.view.setOnSubmitCallback(this.handleSubmit.bind(this));
  }

  async handleSubmit(description, photoData, lat, lon) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    document.getElementById('upload-btn').disabled = true;

    try {
      const success = await this.model.addStory(description, photoData, lat, lon);
      if (success) {
        window.location.hash = '#/';
        window.location.reload();
      } else {
        this.view.showError('Gagal menambah cerita.');
      }
    } catch (error) {
      this.view.showError('Terjadi kesalahan saat mengupload cerita.');
    }

    this.isSubmitting = false;
    document.getElementById('upload-btn').disabled = false;
  }
}

export default AddStoryPresenter;

import BookmarkView from '../views/BookmarkView';

class BookmarkPresenter {
  constructor() {
    this.bookmarkView = new BookmarkView();
  }

  async init() {
    await this.bookmarkView.showBookmarkedStories();
  }
}

export default BookmarkPresenter;

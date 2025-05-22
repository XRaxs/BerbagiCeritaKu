import IndexedDB from '../utils/indexedDB';  // Mengimpor objek default IndexedDB

class BookmarkView {
  constructor() {
    this.container = document.getElementById("main-content");
    this.storyList = null;
  }

  async showBookmarkedStories() {
    const stories = await IndexedDB.getAllStories();  // Mengambil cerita yang disimpan dari IndexedDB
    
    // Debugging: Log the stories data to check if it's being fetched correctly
    console.log('Bookmarked stories:', stories);

    if (stories.length === 0) {
      this.container.innerHTML = "<p>No stories bookmarked yet.</p>";
      return;
    }

    // Render header and initialize story list container
    this.container.innerHTML = `
      <h1>Bookmarked Stories</h1>
      <div id="story-list"></div>
    `;
    this.storyList = document.getElementById("story-list");
    
    // Display the stories
    this.displayStories(stories);
  }

  // Function to display stories
  displayStories(stories) {
    stories.forEach((story) => {
      const createdAt = new Date(story.createdAt).toLocaleString();
      const storyCard = `
        <div class="story-card" tabindex="0">
          <img src="${story.photoUrl}" alt="${story.name}" />
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <small style="margin: 0 1rem; color: gray;">📅 ${createdAt}</small>
          <button class="detail-btn" data-id="${story.id}">Lihat Detail</button>
        </div>
      `;
      this.storyList.innerHTML += storyCard;
    });

    this.addEventListeners();  // Add event listeners after rendering
    this.focusFirstFocusable();
  }

  // Function to handle event listeners for detail buttons
  addEventListeners() {
    const detailButtons = document.querySelectorAll('.detail-btn');
    detailButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const storyId = e.target.getAttribute('data-id');
        window.viewStoryDetail(storyId);  // Navigates to story detail page
      });
    });
  }

  // Focus on the first story card for accessibility
  focusFirstFocusable() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      const firstFocusable = mainContent.querySelector('.story-card[tabindex="0"]');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }

  // Show error message if something goes wrong
  showError(message) {
    const errorElement = document.createElement("div");
    errorElement.textContent = message;
    errorElement.style.color = "red";
    this.container.appendChild(errorElement);
  }
}

export default BookmarkView;

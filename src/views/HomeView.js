class HomeView {
  constructor() {
    this.container = document.getElementById("main-content");
    this.storyList = null;
  }

  render() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.container.innerHTML = `
        <div class="no-admission">
          <h1>Tidak Terdaftar</h1>
          <div id="access-message">
            <p>Anda tidak memiliki akses, silakan <a href="#/login">login terlebih dahulu</a>.</p>
          </div>
        </div>
      `;
      return;
    }

    this.container.innerHTML = `
      <h1>Story List</h1>
      <div id="story-list"></div>
    `;

    this.storyList = document.getElementById("story-list");
  }

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
    this.addDetailEventListeners();
    this.focusFirstFocusable();
  }

  focusFirstFocusable() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      const firstFocusable = mainContent.querySelector('.story-card[tabindex="0"]');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }

  addDetailEventListeners() {
    const detailButtons = document.querySelectorAll(".detail-btn");
    detailButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const storyId = event.target.getAttribute("data-id");
        window.viewStoryDetail(storyId);
      });
    });
  }

  showError(message) {
    const errorElement = document.createElement("div");
    errorElement.textContent = message;
    errorElement.style.color = "red";
    this.container.appendChild(errorElement);
  }
}

export default HomeView;
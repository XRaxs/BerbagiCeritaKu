import IndexedDB from '../utils/indexedDB';  // Pastikan Anda mengimpor IndexedDB

class DetailView {
  constructor() {
    this.container = document.getElementById("main-content");
    this.popupContainer = document.createElement("div");
    this.popupContainer.classList.add("popup-overlay");
  }

  async showStoryPopup(story) {
    const createdAt = new Date(story.createdAt).toLocaleString();

    // Cek apakah cerita sudah ada di IndexedDB
    const isBookmarked = await IndexedDB.getStoryById(story.id);

    // Jika sudah disimpan, tombol berubah ke "Unbookmark Story"
    const buttonLabel = isBookmarked ? "Unbookmark Story" : "Bookmark Story";
    const buttonAction = isBookmarked ? this.unbookmarkStory.bind(this, story) : this.saveStory.bind(this, story);

    const popupHTML = `
      <div class="popup-card">
        <button class="popup-close" aria-label="Tutup detail">✖</button>
        <img src="${story.photoUrl}" alt="photo" />
        <h2>${story.name}</h2>
        <p><strong>Deskripsi:</strong> ${story.description}</p>
        <p><strong>Waktu dibuat:</strong> ${createdAt}</p>
        ${story.lat && story.lon ? 
          `<div id="popup-map" style="height: 200px; margin-top: 1rem;"></div>` : 
          `<p style="color: red;">User tidak mencantumkan lokasi.</p>` 
        }
        <button id="save-story-btn" class="bookmark-btn">${buttonLabel}</button>  <!-- Tombol simpan atau unbookmark cerita --> 
      </div>
    `;

    this.popupContainer.innerHTML = popupHTML;
    this.popupContainer.style.display = 'block';
    this.popupContainer.classList.add('show');

    const closeButton = this.popupContainer.querySelector('.popup-close');
    closeButton.addEventListener('click', () => {
      this.hideStoryPopup();  
    });

    // Tombol untuk menyimpan atau unbookmark cerita
    const saveButton = this.popupContainer.querySelector('#save-story-btn');
    saveButton.addEventListener('click', async () => {
      // Saat tombol diklik, langsung lakukan aksi sesuai status (save/unbookmark)
      await buttonAction(story);
      // Setelah aksi, langsung update tombol tanpa perlu refresh
      saveButton.innerHTML = isBookmarked ? "Bookmark Story" : "Unbookmark Story";
    });

    // Map rendering jika ada latitude dan longitude
    if (story.lat && story.lon) {
      const baseURL = document.querySelector('base')?.getAttribute('href') || './';
      const mapContainer = document.querySelector('#popup-map');
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: `${baseURL}images/marker-icon-2x.png`,
        iconUrl: `${baseURL}images/marker-icon.png`,
        shadowUrl: `${baseURL}images/marker-shadow.png`,
      });

      if (mapContainer) {
        const map = L.map(mapContainer).setView([story.lat, story.lon], 13);
        L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }).addTo(map);
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<b>${story.name}</b>`);

        const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${story.lat}&lon=${story.lon}&format=json&addressdetails=1`;

        fetch(geocodeUrl)
          .then(response => response.json())
          .then(data => {
            const address = data.address;
            const locationName = address ? address.city || address.town || address.village || 'Unknown Location' : 'Unknown Location';
            marker.bindPopup(`<b>${story.name}</b><br/>Location: ${locationName}`);
          })
          .catch(err => {
            console.error('Geocoding error:', err);
            marker.bindPopup(`<b>${story.name}</b><br/>Location: Unknown`);
          });
      }
    }

    this.container.appendChild(this.popupContainer);
  }

  // Fungsi untuk menyimpan cerita yang disukai atau dibookmark oleh pengguna
  async saveStory(story) {
    try {
      await IndexedDB.putStory(story);  
      this.showNotification('Story saved!', 'success');
      this.hideStoryPopup();
    } catch (error) {
      console.error('Error saving story:', error);
    }
  }

  // Fungsi untuk unbookmark cerita (hapus dari IndexedDB)
  async unbookmarkStory(story) {
    try {
      await IndexedDB.deleteStory(story.id);  // Menghapus cerita dari IndexedDB
      this.showNotification('Story unbookmarked!', 'warning');
      this.hideStoryPopup(); 

      setTimeout(() => {
        // Fade out and then refresh content
        const bookmarkContainer = document.getElementById('main-content');
        bookmarkContainer.classList.add('fade-out');  

        setTimeout(() => {
          window.bookmarkView.showBookmarkedStories();  
          bookmarkContainer.classList.remove('fade-out');  
          bookmarkContainer.classList.add('fade-in');
        }, 500);
      }, 2000);
    } catch (error) {
      console.error('Error unbookmarking story:', error);
    }
  }

  // Fungsi untuk menampilkan notifikasi
  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;
    this.container.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);  
  }

  hideStoryPopup() {
    this.popupContainer.style.display = 'none';
    this.popupContainer.classList.remove('show');
    this.popupContainer.innerHTML = '';
  }
}

export default DetailView;

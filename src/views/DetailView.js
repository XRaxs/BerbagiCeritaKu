class DetailView {
  constructor() {
    this.container = document.getElementById("main-content");
    this.popupContainer = document.createElement("div");
    this.popupContainer.classList.add("popup-overlay");
  }

  showStoryPopup(story) {
    const createdAt = new Date(story.createdAt).toLocaleString();

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
      </div>
    `;

    this.popupContainer.innerHTML = popupHTML;
    this.popupContainer.style.display = 'block';
    this.popupContainer.classList.add('show');

    const closeButton = this.popupContainer.querySelector('.popup-close');
    closeButton.addEventListener('click', () => {
      this.hideStoryPopup();
    });

    if (story.lat && story.lon) {
      const mapContainer = document.querySelector('#popup-map');
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: `/images/marker-icon-2x.png`,
        iconUrl: `/images/marker-icon.png`,
        shadowUrl: `/images/marker-shadow.png`,
      });

      if (mapContainer) {
        const map = L.map(mapContainer).setView([story.lat, story.lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
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

  hideStoryPopup() {
    this.popupContainer.style.display = 'none';
    this.popupContainer.classList.remove('show');
    this.popupContainer.innerHTML = '';
  }
}

export default DetailView;

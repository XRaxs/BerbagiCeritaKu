import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class AddStoryView {
  constructor() {
    this.container = document.getElementById('main-content');
    this.selectedMarker = null;
    this.selectedLat = null;
    this.selectedLon = null;
    this.stream = null;
  }

  renderForm() {
    const formHTML = ` 
      <section>
        <div class="add-story-container">
          <div class="add-story-form">
            <h2>Tambah Cerita</h2>
            <form id="add-form">
              <label for="description">Deskripsi :</label>
              <input type="text" id="description" placeholder="Deskripsi" required />
              
              <label for="gambar">Gambar :</label>
              <div id="photo-options">
                <button type="button" id="use-camera">Gunakan Kamera</button>
                <button type="button" id="use-upload">Upload Foto</button>
              </div>
              
              <div id="camera-section" style="display: none;">
                <video id="camera" autoplay playsinline width="300"></video><br/>
                <canvas id="snapshot" style="display:none;"></canvas>
                <button type="button" id="capture">Ambil Foto</button><br/>
              </div>
              
              <div id="file-section" style="display: none;">
                <label for="file">Atau pilih file foto:</label>
                <input type="file" id="file" accept="image/*" />
              </div>

              <label for="map">Map :</label>
              <div id="map" style="height: 300px;"></div>
              <button type="submit" id="upload-btn">Upload Cerita</button>
            </form>
          </div>
        </div>
      </section>
    `;

    this.container.innerHTML = formHTML;
    this.initializeMap();
    this.initEventListeners();
  }

  initializeMap() {
    const basePath = window.location.pathname.split('/')[1];
    const swPath = `${basePath}/service-worker.js`;
    const mapElement = document.getElementById('map');
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: `${basePath}/images/marker-icon-2x.png`,
      iconUrl: `${basePath}/images/marker-icon.png`,
      shadowUrl: `${basePath}/images/marker-shadow.png`,
    });

    if (mapElement) {
      const map = L.map(mapElement).setView([-6.1751, 106.8650], 13);

      L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(map);

      map.on('click', (e) => {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;

        if (this.selectedMarker) {
          map.removeLayer(this.selectedMarker);
        }

        this.selectedMarker = L.marker([lat, lon]).addTo(map).bindPopup("Lokasi Anda").openPopup();

        this.selectedLat = lat;
        this.selectedLon = lon;
      });
    }
  }

  initEventListeners() {
    document.getElementById('use-camera').addEventListener('click', () => {
      // Jika kamera sudah digunakan dan snapshot sudah diambil, sembunyikan snapshot dan tampilkan kamera lagi
      if (document.getElementById('snapshot').style.display === 'block') {
        document.getElementById('snapshot').style.display = 'none';
        document.getElementById('camera').style.display = 'block';
      } else {
        document.getElementById('camera-section').style.display = 'block';
        document.getElementById('file-section').style.display = 'none';
        this.startCamera();
      }
    });

    document.getElementById('use-upload').addEventListener('click', () => {
      document.getElementById('file-section').style.display = 'block';
      document.getElementById('camera-section').style.display = 'none';
      this.stopCamera();
    });

    document.getElementById('capture').addEventListener('click', () => {
      this.capturePhoto();
    });

    document.getElementById('add-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const description = document.getElementById('description').value;
      const photoData = this.getPhotoData();
      const lat = this.selectedLat;
      const lon = this.selectedLon;

      if (this.onSubmit) {
        this.onSubmit(description, photoData, lat, lon);
      }
    });

    const homeNavbar = document.getElementById('home');
    if (homeNavbar) {
      homeNavbar.addEventListener('click', () => {
        this.stopCamera();
      });
    }
  }

  startCamera() {
    if (this.stream) {
      this.stopCamera();
    }

    const videoElement = document.getElementById('camera');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.stream = stream;
          videoElement.srcObject = stream;
          videoElement.style.display = 'block';

          // Sembunyikan snapshot saat kamera aktif
          const canvasElement = document.getElementById('snapshot');
          canvasElement.style.display = 'none';

          // Update ukuran canvas sesuai dengan ukuran video
          videoElement.onloadedmetadata = () => {
            const canvasElement = document.getElementById('snapshot');
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
          };
        })
        .catch(err => {
          this.showError("Tidak bisa mengakses kamera: " + err.message);
        });
    }
  }

  stopCamera() {
    const videoElement = document.getElementById('camera');
    const stream = videoElement.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoElement.srcObject = null;
      this.stream = null;
    }
    
    // Sembunyikan video dan snapshot saat kamera dimatikan
    videoElement.style.display = 'none';
    document.getElementById('snapshot').style.display = 'none';
  }

  capturePhoto() {
    const videoElement = document.getElementById('camera');
    const canvasElement = document.getElementById('snapshot');
    const context = canvasElement.getContext('2d');
    
    // Pastikan ukuran canvas sesuai dengan video
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    // Mengambil foto dari video
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    canvasElement.style.display = 'block';
    videoElement.style.display = 'none';
  }

  getPhotoData() {
    const canvasElement = document.getElementById('snapshot');
    if (canvasElement.style.display === 'block') {
      return canvasElement.toDataURL();  // Ambil data URL dari canvas
    }

    const fileInput = document.getElementById('file');
    if (fileInput && fileInput.files.length > 0) {
      return fileInput.files[0];  // Ambil file foto dari input file
    }

    return null;  // Kembalikan null jika tidak ada gambar yang diambil
  }

  showError(message) {
    const errorElement = document.createElement('div');
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    this.container.appendChild(errorElement);
  }

  setOnSubmitCallback(callback) {
    this.onSubmit = callback;
  }
}

export default AddStoryView;

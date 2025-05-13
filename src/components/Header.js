class Header {
  constructor() {
    this.container = document.getElementById("header");
  }

  render() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name") || "Guest";
  const isLoggedIn = !!token;

  // Cek apakah pengguna sudah berlangganan (isSubscribed)
  const isSubscribed = localStorage.getItem("isSubscribed") === "true";

  this.container.innerHTML = `
    <div class="nav-brand">📖 Berbagi CeritaKu</div>
    <nav class="nav-main">
      <a href="#/home" id="home">Home</a>
      <a href="#/add" id="tambah">Tambah Cerita</a>
      ${
        isLoggedIn
          ? isSubscribed
            ? `<button id="unsubscribeBtn" class="nav-link">Unsubscribe 🔕</button>`
            : `<button id="subscribeBtn" class="nav-link">Subscribe 🔔</button>`
          : ""
      }
    </nav>
    <div class="nav-auth">
      ${
        isLoggedIn
          ? `<span>👋 Hi, ${name}</span><a href="#" id="logout">Logout</a>`
          : `<a href="#/login" id="login">Login</a>`
      }
    </div>
    <button class="hamburger" aria-label="Menu">☰</button>
    <div class="mobile-menu hidden" id="mobileMenu">
      <button class="close-mobile-menu" aria-label="Close">✖</button>
      <a href="#/home" id="home">Home</a>
      <a href="#/add" id="tambah">Tambah Cerita</a>
      ${
        isLoggedIn
          ? isSubscribed
            ? `<button id="unsubscribeBtn" class="nav-link">Unsubscribe 🔕</button>`
            : `<button id="subscribeBtn" class="nav-link">Subscribe 🔔</button>`
          : ""
      }
      ${
        isLoggedIn
          ? `<a href="#" id="mobileLogout">Logout</a>`
          : `<a href="#/login" id="mobileLogin">Login</a>`
      }
    </div>
    `;

    this.afterRender();
  }

  updateHeader(name, buttonText) {
    const token = localStorage.getItem("token");
    const nama = name || "Guest";
    const button = buttonText || "Login";
    const isLoggedIn = !!token;

    // Cek apakah pengguna sudah berlangganan (isSubscribed)
    const isSubscribed = localStorage.getItem("isSubscribed") === "true";

    this.container.innerHTML = `
      <div class="nav-brand">📖 Berbagi CeritaKu</div>
      <nav class="nav-main">
        <a href="#/home" id="home">Home</a>
        <a href="#/add" id="tambah">Tambah Cerita</a>
        ${
          isLoggedIn
            ? isSubscribed
              ? `<button id="unsubscribeBtn" class="nav-link">Unsubscribe 🔕</button>`
              : `<button id="subscribeBtn" class="nav-link">Subscribe 🔔</button>`
            : ""
        }
      </nav>
      <div class="nav-auth">
        ${
          isLoggedIn
            ? `<span>👋 Hi, ${name}</span><a href="#" id="logout">Logout</a>`
            : `<a href="#/login" id="login">Login</a>`
        }
      </div>
      <button class="hamburger" aria-label="Menu">☰</button>
      <div class="mobile-menu hidden" id="mobileMenu">
        <button class="close-mobile-menu" aria-label="Close">✖</button>
        <a href="#/home" id="home">Home</a>
        <a href="#/add" id="tambah">Tambah Cerita</a>
        ${
          isLoggedIn
            ? isSubscribed
              ? `<button id="unsubscribeBtn" class="nav-link">Unsubscribe 🔕</button>`
              : `<button id="subscribeBtn" class="nav-link">Subscribe 🔔</button>`
            : ""
        }
        ${
          isLoggedIn
            ? `<a href="#" id="mobileLogout">Logout</a>`
            : `<a href="#/login" id="mobileLogin">Login</a>`
        }
      </div>
      `;

    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        this.render();
        location.hash = "#/login";
      });
    }

    const loginBtn = document.getElementById("login");
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        location.hash = "#/login";
      });
    }

    this.afterRender();
  }

  afterRender() {
    const mobileMenu = document.getElementById("mobileMenu");
    const hamburger = document.querySelector(".hamburger");
    const closeBtn = document.querySelector(".close-mobile-menu");

    hamburger.addEventListener("click", () => {
      mobileMenu.classList.remove("hidden");
    });

    closeBtn.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });

    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu) {
        mobileMenu.classList.add("hidden");
      }
    });

    const mobileLogout = document.getElementById("mobileLogout");
    if (mobileLogout) {
      mobileLogout.addEventListener("click", () => {
        localStorage.clear();
        this.render();
        location.hash = "#/login";
        mobileMenu.classList.add("hidden");
      });
    }

    const mobileLogin = document.getElementById("mobileLogin");
    if (mobileLogin) {
      mobileLogin.addEventListener("click", () => {
        location.hash = "#/login";
        mobileMenu.classList.add("hidden");
      });
    }

    // Tambahkan event listener untuk tombol subscribe dan unsubscribe
    const subscribeBtn = document.getElementById("subscribeBtn");
    if (subscribeBtn) {
      subscribeBtn.addEventListener("click", this.subscribeUser.bind(this));
    }

    const unsubscribeBtn = document.getElementById("unsubscribeBtn");
    if (unsubscribeBtn) {
      unsubscribeBtn.addEventListener("click", this.unsubscribeUser.bind(this));
    }
  }

  // Fungsi untuk subscribe pengguna]
  subscribeUser() {
    if ("Notification" in window && "serviceWorker" in navigator) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Izin untuk notifikasi diberikan");

          // Pastikan Service Worker sudah siap dan aktif
          navigator.serviceWorker.ready
            .then((registration) => {
              console.log("Service Worker terdaftar dengan sukses:", registration);

              registration.pushManager
                .subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array(
                    "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"
                  ),
                })
                .then((subscription) => {
                  console.log("Berhasil subscribe:", subscription);

                  const p256dh = subscription.getKey('p256dh');
                  const auth = subscription.getKey('auth');

                  // Cek apakah subscription.keys ada
                  if (p256dh && auth) {
                    // Kirimkan data subscription ke server
                    fetch("https://story-api.dicoding.dev/v1/notifications/subscribe", {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,  // Gunakan token yang valid
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        endpoint: subscription.endpoint,
                        keys: {
                          p256dh: arrayBufferToBase64(p256dh),  // Mengubah ArrayBuffer menjadi Base64
                          auth: arrayBufferToBase64(auth),  // Mengubah ArrayBuffer menjadi Base64
                        },
                      }),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        console.log("Subscription berhasil:", data);
                      })
                      .catch((error) => {
                        console.log("Gagal mengirim subscription ke server:", error);
                      });

                    // Simpan status subscription di localStorage
                    localStorage.setItem("isSubscribed", "true");
                    this.render(); // Memperbarui UI setelah subscribe
                  } else {
                    console.error("Gagal: p256dh atau auth tidak valid.");
                  }
                })
                .catch((error) => {
                  console.log("Gagal subscribe untuk push notification:", error);
                });
            })
            .catch((error) => {
              console.log("Service Worker tidak siap:", error);
            });
        } else {
          console.log("Izin untuk notifikasi ditolak");
        }
      });
    }
  }

  // Fungsi untuk unsubscribe pengguna
  unsubscribeUser() {
    navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        if (subscription) {
          subscription
            .unsubscribe()
            .then(() => {
              console.log("Berhasil unsubscribe");

              fetch("https://story-api.dicoding.dev/v1/notifications/subscribe", {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,  // Gunakan token yang valid
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ endpoint: subscription.endpoint }),
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log("Unsubscription berhasil:", data);
                })
                .catch((error) => {
                  console.log("Gagal mengirim unsubscription ke server:", error);
                });

              // Hapus status subscription dari localStorage
              localStorage.setItem("isSubscribed", "false");
              this.render(); // Memperbarui UI setelah unsubscribe
            })
            .catch((error) => {
              console.log("Gagal unsubscribe:", error);
            });
        }
      });
    });
  }
}

// Fungsi untuk mengonversi ArrayBuffer ke Base64
function arrayBufferToBase64(buffer) {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  let length = bytes.byteLength;
  for (let i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export { Header };
export default Header;

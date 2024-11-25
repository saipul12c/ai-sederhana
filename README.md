Berikut ini adalah file `README.md` yang mendetail untuk proyek AI sederhana bernama **Saipul AI**. File ini mencakup informasi tentang proyek, cara instalasi, penggunaan, dan penjelasan struktur folder.

---

## Saipul AI

**Saipul AI** adalah aplikasi chatbot sederhana yang dibangun menggunakan teknologi `Node.js`, `Express.js`, `HTML`, `CSS`, `JavaScript`, dan `JSON` sebagai basis data. Aplikasi ini dirancang untuk meniru respons AI dengan pola-pola tertentu yang disimpan di database JSON. Saipul AI juga dilengkapi fitur mode gelap (*dark mode*) yang dapat diaktifkan oleh pengguna.

---

### Daftar Isi
- [Fitur](#fitur)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Struktur Proyek](#struktur-proyek)
- [Penggunaan](#penggunaan)
- [API](#api)
- [Lisensi](#lisensi)

---

### Fitur
- **Chatbot Responsif**: Saipul AI dapat memberikan respons berdasarkan pola yang telah disimpan dalam database.
- **Mode Gelap (Dark Mode)**: Pengguna dapat mengaktifkan atau menonaktifkan mode gelap untuk pengalaman tampilan yang lebih nyaman.
- **Respons Acak**: Saipul AI dapat memberikan respons acak jika terdapat beberapa jawaban untuk satu pola.
- **Database JSON**: Database respons menggunakan file JSON yang mudah untuk diperbarui.

---

### Persyaratan
- **Node.js** (versi 12 atau lebih baru)
- **npm** (biasanya sudah disertakan dalam instalasi Node.js)

---

### Instalasi

1. **Kloning repositori** ini ke komputer lokal:
   ```bash
   git clone https://github.com/username/saipul-ai.git
   cd saipul-ai
   ```

2. **Instal dependensi** yang diperlukan:
   ```bash
   npm install
   ```

3. **Menjalankan aplikasi**:
   ```bash
   node src/app.js
   ```

4. **Akses aplikasi** di browser:
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

### Struktur Proyek

Berikut adalah struktur folder proyek beserta deskripsinya:

```plaintext
saipul-ai/
├── public/               # Folder untuk file frontend
│   ├── css/              # Folder CSS untuk styling
│   │   └── style.css     # File gaya utama termasuk mode gelap
│   ├── js/               # Folder JavaScript untuk logic frontend
│   │   └── script.js     # Script utama untuk interaksi UI dan API
│   └── index.html        # Halaman HTML utama aplikasi
├── data/                 # Folder untuk data
│   └── database.json     # File JSON yang menyimpan pola dan respons
├── src/                  # Folder backend
│   └── app.js            # Server Express utama dan API logic
├── tailwind.config.js    # Konfigurasi Tailwind CSS (jika diperlukan)
├── package.json          # File konfigurasi npm dan dependensi
└── README.md             # Dokumentasi proyek
```

---

### Penggunaan

1. **Memulai Chat**:
   - Buka halaman `index.html` di browser.
   - Tulis pertanyaan atau pernyataan di kolom input dan klik "Kirim".
   - Saipul AI akan merespons berdasarkan pola yang cocok di `database.json`.

2. **Mengaktifkan Mode Gelap**:
   - Klik tombol 🌙 di bagian atas untuk mengaktifkan mode gelap. Klik lagi untuk kembali ke mode terang.
   - Preferensi mode akan tersimpan secara otomatis di `localStorage`.

---

### API

Aplikasi ini memiliki satu endpoint API yang digunakan untuk menerima pesan dari frontend dan mengembalikan respons berdasarkan pola di database.

#### `POST /api/message`

- **Deskripsi**: Endpoint untuk menerima pesan dari pengguna dan mengembalikan respons yang sesuai.
- **Body**: JSON dengan format berikut:
  ```json
  {
    "message": "Pertanyaan pengguna di sini"
  }
  ```
- **Respons**: JSON dengan format berikut:
  ```json
  {
    "reply": "Respons dari Saipul AI"
  }
  ```

#### Contoh Penggunaan
Request:
```json
POST /api/message
{
  "message": "Halo, apa kabar?"
}
```

Respons:
```json
{
  "reply": "Halo! Saya baik, terima kasih sudah bertanya!"
}
```


- **`patterns`**: Daftar kata atau frasa yang akan dikenali sebagai kunci untuk kategori tertentu.
- **`responses`**: Respons acak yang diberikan jika pola cocok dengan pesan pengguna.
- **`default`**: Respons default yang diberikan jika tidak ada pola yang cocok.


### Lisensi

Proyek ini menggunakan lisensi **MIT**. Anda bebas menggunakannya dan melakukan modifikasi sesuai kebutuhan, tetapi harap mencantumkan kredit ke penulis asli.


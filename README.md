# URL Shortener

## Deskripsi

URL Shortener adalah aplikasi sederhana yang memungkinkan pengguna untuk membuat dan mengelola URL pendek untuk mengarahkan ke URL yang lebih panjang. Proyek ini dilengkapi dengan skrip untuk menambah dan menghapus URL dari basis data.

## Penggunaan

1. **Menjalankan Aplikasi:**

   Untuk menjalankan aplikasi, gunakan perintah berikut:

   ```bash
   npm i
   npm start
   ```

   Ini akan memulai server dan membuat aplikasi dapat diakses di [http://localhost:3000](http://localhost:3000).

3. **Menambahkan URL Baru:**

   Untuk menambahkan URL baru, gunakan perintah:

   ```bash
   npm run add
   ```

   Ikuti petunjuk yang muncul untuk memasukkan detail URL baru.

4. **Menghapus URL:**

   Untuk menghapus URL, gunakan perintah:

   ```bash
   npm run del
   ```

   Ikuti petunjuk yang muncul untuk memasukkan URL yang ingin dihapus.

## Struktur Folder

- `public/data`: Berisi skrip untuk menambah dan menghapus URL, serta berkas data untuk menyimpan URL.
